import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { AgentRecordStore } from '../../peercompute/src/peercompute/agents/AgentRecordStore.js';
import { AgentRuntime } from '../../peercompute/src/peercompute/agents/AgentRuntime.js';
import { deferred, tick } from './world-generated-fixtures.js';

// Exercise the real host and journal in Node, injecting only presentation and
// inference. CSS has no behavior in this test's renderer adapter.
const css = registerHooks({ load(url, context, next) { return url.endsWith('.css')
  ? { format: 'module', source: '', shortCircuit: true } : next(url, context); } });
const { installWorldAgents } = await import('../shared/agents/WorldAgentHost.js');
css.deregister();

async function fixture(t) {
  const records = new AgentRecordStore({ name: crypto.randomUUID(), indexedDBImpl: new IDBFactory(), keyRange: IDBKeyRange,
    lockManager: { request: async (_name, _options, callback) => callback({}) } }); await records.open();
  const bodies = new Map(), calls = [], statuses = [], state = { bodyUpdates: [] }; let revision = 0;
  const agents = new AgentRuntime({ store: records, inference: {
    listCandidates: async () => [{ key: 'local:text', local: true, available: true, manifestCid: 'text',
      sessionId: 'text', runtime: 'fixture', task: 'text-generation', modalities: ['text'], outputModalities: ['text'] }],
    async generate(_candidate, input) {
      calls.push(input);
      if (input.messages[0].content.startsWith('Choose optional physical action')) return { text: '{"intent":null}' };
      if (state.speech) { state.speech.entered.resolve(); await state.speech.drain.promise; }
      return { text: 'I can help.', finishReason: 'stop' };
    }, cancel: async () => {},
  } });
  const originalList = agents.list.bind(agents), originalResume = agents.resume.bind(agents);
  agents.list = async () => {
    const snapshot = await originalList();
    if (state.refresh && !state.refresh.started && snapshot.some(head => head.status === 'paused')) {
      state.refresh.started = true; state.refresh.entered.resolve(); await state.refresh.drain.promise;
      if (state.refresh.error) throw state.refresh.error;
    }
    return snapshot;
  };
  agents.resume = async id => {
    if (state.refresh) await state.refresh.entered.promise;
    const head = await originalResume(id); state.refresh?.resumed.resolve(); return head;
  };
  const adapter = {
    upsert(body) {
      state.bodyUpdates.push(body.status);
      const previous = bodies.get(body.key);
      if (!previous || (previous.status === 'paused') !== (body.status === 'paused')) revision++;
      bodies.set(body.key, { ...body, intentRevision: revision });
    }, remove: key => bodies.delete(key), normalizePosition: value => [...value], getSpawnPosition: () => [0, 3, 0],
    getPosition: key => bodies.get(key)?.position,
    observe: key => ({ self: { id: key, position: [0, 3, 0], status: bodies.get(key)?.status,
      intentRevision: bodies.get(key)?.intentRevision }, participants: [
      { id: 'human:owner', peerId: 'owner', kind: 'human', name: 'Owner', position: [10, 3, 0], distance: 10 }], requesterId: 'human:owner' }),
    setIntent(key) { bodies.get(key).intentRevision = ++revision; return { applied: true }; },
    subscribeOutcomes: () => () => {}, dispose: () => bodies.clear(),
  };
  const host = installWorldAgents({ worldId: 'cubechat:refresh-test', worldLabel: 'CubeChat', adapter,
    runtimeFactory: async () => ({ networkReady: true, networkManager: { peerId: 'owner' },
      getAgentController: async () => agents, dispose: async () => { await agents.dispose(); await records.destroy(); } }),
    uiFactory: () => ({ open() {}, select() {}, setAgents() {}, setMessages() {}, setStatus: value => statuses.push(value),
      setBusy() {}, setVoiceStatus() {}, dispose() {} }),
    serviceFactory: () => ({ start: async () => {}, close: async () => {} }),
  });
  t.after(async () => { state.refresh?.drain.resolve(); state.speech?.drain.resolve(); await host.dispose(); });
  await host.ready; await tick(); return { host, agents, bodies, calls, statuses, state, adapter };
}

test('spawn drains an invalidated paused snapshot before returning, so first speech does not supersede itself', async t => {
  const f = await fixture(t);
  const refresh = f.state.refresh = { entered: deferred(), resumed: deferred(), drain: deferred() };
  let done = false;
  const spawning = f.host.spawn({ name: 'Builder', movement: 'stationary' }).then(head => { done = true; return head; });
  await refresh.entered.promise; await refresh.resumed.promise; await tick(); assert.equal(done, false);
  refresh.drain.resolve(); const head = await spawning, key = `local:${head.agentId}`;
  assert.equal(f.bodies.get(key).status, 'idle');
  const reply = await f.host.send({ key, text: 'Please help me create a chair.' });
  assert.equal(reply.text, 'I can help.'); assert.equal(f.calls.length, 2);
  assert.equal(f.bodies.get(key).status, 'idle');
  assert.equal(f.state.bodyUpdates.includes('paused'), false);
});

test('a real owner movement command during speech still supersedes the pending action', async t => {
  const f = await fixture(t), head = await f.host.spawn({ name: 'Builder' }), key = `local:${head.agentId}`;
  const speech = f.state.speech = { entered: deferred(), drain: deferred() };
  const replying = f.host.send({ key, text: 'Follow me.' }); await speech.entered.promise;
  f.adapter.setIntent(key, { type: 'stop' }); speech.drain.resolve();
  const reply = await replying;
  assert.match(reply.text, /A newer movement command superseded this intention/); assert.equal(f.calls.length, 1);
});

test('a failed refresh rejects its waiter and a later mutation can refresh normally', async t => {
  const f = await fixture(t), refresh = f.state.refresh = {
    entered: deferred(), resumed: deferred(), drain: deferred(), error: new Error('Store read failed') };
  const spawning = f.host.spawn({ name: 'Builder' }); spawning.catch(() => {});
  await refresh.resumed.promise; refresh.drain.resolve(); await assert.rejects(spawning, /Store read failed/);
  delete f.state.refresh;
  const head = (await f.agents.list())[0];
  // A later ordinary mutation must start a new pass instead of remaining
  // attached to the rejected coalesced refresh.
  await f.host.spawn({ name: 'Recovered' });
  assert.equal(f.bodies.get(`local:${head.agentId}`).status, 'idle');
});

test('closing during a delayed refresh drains it without presenting a late body', async t => {
  const f = await fixture(t), refresh = f.state.refresh = { entered: deferred(), resumed: deferred(), drain: deferred() };
  const spawning = f.host.spawn({ name: 'Builder' }); spawning.catch(() => {});
  await refresh.resumed.promise;
  let done = false; const closing = f.host.dispose().then(() => { done = true; });
  await tick(); assert.equal(done, false);
  refresh.drain.resolve(); await closing; await assert.rejects(spawning, /closed/i);
  assert.equal(f.bodies.size, 0); assert.equal(f.state.bodyUpdates.length, 0);
});
