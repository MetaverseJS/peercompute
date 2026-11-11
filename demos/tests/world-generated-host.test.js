import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { AgentRecordStore } from '../../peercompute/src/peercompute/agents/AgentRecordStore.js';
import { AgentRuntime } from '../../peercompute/src/peercompute/agents/AgentRuntime.js';
import { WorldMemoryStore } from '../../peercompute/src/peercompute/agents/WorldMemoryStore.js';
import { ArtifactStore } from '../../peercompute/src/peercompute/artifacts/ArtifactStore.js';
import { action, worldId, meshFixture, imageFixture, sceneAdapter, deferred, tick } from './world-generated-fixtures.js';

// Presentation is injected below. Ignore only CSS imports while exercising
// the unchanged host/agent modules in Node; no browser or default runtime starts.
const css = registerHooks({ load(url, context, next) { return url.endsWith('.css')
  ? { format: 'module', source: '', shortCircuit: true } : next(url, context); } });
const { installWorldAgents } = await import('../shared/agents/WorldAgentHost.js');
css.deregister();

async function fixture(t) {
  const db = new IDBFactory(), records = new AgentRecordStore({ name: crypto.randomUUID(), indexedDBImpl: db, keyRange: IDBKeyRange,
    lockManager: { request: async (_name, _options, callback) => callback({}) } }); await records.open();
  const store = new ArtifactStore({ persistent: false }); await store.open();
  const memory = new WorldMemoryStore({ name: crypto.randomUUID(), indexedDBImpl: db });
  const calls = [], statuses = [], bodies = new Map(), objects = sceneAdapter(), state = { action, mesh: async () => ({ mesh: meshFixture() }) };
  const candidates = ['text-generation', 'text-to-image', 'image-to-3d'].map(task => ({ key: `local:${task}`, local: true,
    available: true, manifestCid: task, sessionId: task, task, runtime: 'fixture',
    modalities: task === 'image-to-3d' ? ['image'] : ['text'], outputModalities: task === 'image-to-3d' ? ['mesh'] : task === 'text-to-image' ? ['image'] : ['text'] }));
  const agents = new AgentRuntime({ store: records, inference: { listCandidates: async () => candidates,
    async generate(_candidate, input, options) {
      calls.push(input);
      if (input.task === 'image-to-3d') return state.mesh(input, options);
      if (input.task === 'text-to-image') return { image: imageFixture() };
      if (input.messages?.[0]?.content.includes('Choose optional physical action')) {
        return { text: JSON.stringify(state.action ? { object: state.action } : { intent: null }) };
      }
      return { text: 'I will try to make that.', finishReason: 'stop' };
    }, cancel: async () => {} } });
  let networkOptions;
  const host = installWorldAgents({ worldId, worldLabel: 'CubeChat', generatedObjectAdapter: objects,
    runtimeFactory: async () => ({ store, networkReady: true, networkManager: { peerId: 'owner' }, artifactReady: false,
      getAgentController: async () => agents,
      stateManager: { getWorldMemoryStore: () => memory, createWorldMemoryStore: () => memory },
      dispose: async () => { await agents.dispose(); await records.destroy(); await memory.close(); await store.destroy(); } }),
    adapter: { upsert: body => bodies.set(body.key, body), remove: key => bodies.delete(key), normalizePosition: value => [...value],
      getSpawnPosition: () => [0, 3, 0], getPosition: key => bodies.get(key)?.position,
      observe: key => ({ self: { id: key, position: [0, 3, 0] }, participants: [
        { id: 'human:owner', peerId: 'owner', kind: 'human', name: 'Owner', position: [10, 3, 0], distance: 10 },
        { id: 'human:visitor', peerId: 'visitor', kind: 'human', name: 'Visitor', position: [15, 3, 0], distance: 15 }], requesterId: 'human:owner' }),
      setIntent: () => { throw new Error('Object creation must not alter resident movement'); }, subscribeOutcomes: () => () => {},
      dispose: () => bodies.clear() },
    uiFactory: () => ({ open() {}, select() {}, setAgents() {}, setMessages() {}, setStatus: value => statuses.push(value),
      setBusy() {}, setVoiceStatus() {}, dispose() {} }),
    serviceFactory: options => { networkOptions = options; return { start: async () => {}, close: async () => {} }; },
  });
  t.after(() => host.dispose()); await host.ready; await tick();
  const head = await host.spawn({ name: 'Builder', shared: true, movement: 'stationary' });
  return { host, agents, objects, calls, statuses, state, head, memory, get networkOptions() { return networkOptions; } };
}
test('full world host sends owner proposal through real agent journal, artifact manager and final placement receipt; visitors cannot create', async t => {
  const f = await fixture(t), key = `local:${f.head.agentId}`;
  const reply = await f.host.send({ key, text: 'Create a stone pyramid next to you' });
  assert.match(reply.text, /\[Placed Test pyramid beside the resident\.\]/); assert.equal(f.objects.visible.size, 1);
  assert.deepEqual(f.calls.map(value => value.task), ['text-generation', 'text-generation', 'text-to-image', 'image-to-3d']);
  assert(f.statuses.some(value => value.startsWith('Generating 3D shape')));
  const memory = await f.memory.retrieve({ worldId, agentId: f.head.agentId, audience: 'private',
    conversationId: (await f.agents.events(f.head.agentId)).find(event => event.type === 'request').conversationId, query: 'pyramid', limit: 8 });
  assert(memory.some(value => value.source.kind === 'verified-action' && value.text.includes('Object CID:')));
  const before = f.calls.length;
  const visitor = await f.networkOptions.respond({ agentId: f.head.agentId, prompt: 'Create another object', requesterPeerId: 'visitor' });
  assert.doesNotMatch(visitor.text, /\[Placed/); assert.equal(f.objects.visible.size, 1);
  assert(f.calls.slice(before).every(value => value.task === 'text-generation'));
  const journal = await f.agents.events(f.head.agentId);
  assert(journal.every(event => !event.mesh && !event.data));
});
test('normal chat Cancel interrupts object generation without pausing the resident or placing a late asset', async t => {
  const f = await fixture(t), entered = deferred(), drain = deferred();
  f.state.mesh = async (_input, { signal }) => {
    entered.resolve(); await new Promise(resolve => signal.addEventListener('abort', resolve, { once: true }));
    await drain.promise; signal.throwIfAborted();
  };
  const pending = f.host.send({ key: `local:${f.head.agentId}`, text: 'Generate an object' }); pending.catch(() => {});
  await entered.promise; let cancelled = false; const cancel = f.host.cancel().then(() => { cancelled = true; });
  await tick(); assert.equal(cancelled, false); drain.resolve(); await cancel;
  await assert.rejects(pending, { name: 'AbortError' }); assert.equal(f.objects.visible.size, 0);
  const head = await f.agents.get(f.head.agentId); assert.notEqual(head.status, 'paused'); assert.equal(Boolean(head.recoveryRequired), false);
});
