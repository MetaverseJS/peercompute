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

async function fixture(t, { avatar = false } = {}) {
  const db = new IDBFactory(), records = new AgentRecordStore({ name: crypto.randomUUID(), indexedDBImpl: db, keyRange: IDBKeyRange,
    lockManager: { request: async (_name, _options, callback) => callback({}) } }); await records.open();
  const store = new ArtifactStore({ persistent: false }); await store.open();
  const memory = new WorldMemoryStore({ name: crypto.randomUUID(), indexedDBImpl: db });
  const calls = [], statuses = [], bodies = new Map(), objects = sceneAdapter(), view = {}, state = { action, speech: 'I will try to make that.', mesh: async () => ({ mesh: meshFixture() }) };
  const candidates = ['text-generation', 'text-to-image', 'image-to-3d'].map(task => ({ key: `local:${task}`, local: true,
    available: true, manifestCid: task, sessionId: task, name: `Fixture ${task}`, task, runtime: 'fixture',
    modalities: task === 'image-to-3d' ? ['image'] : ['text'], outputModalities: task === 'image-to-3d' ? ['mesh'] : task === 'text-to-image' ? ['image'] : ['text'] }));
  const agents = new AgentRuntime({ store: records, inference: { listCandidates: async () => candidates,
    async generate(_candidate, input, options) {
      calls.push(input);
      if (input.task === 'image-to-3d') return state.mesh(input, options);
      if (input.task === 'text-to-image') return { image: imageFixture() };
      if (input.messages?.[0]?.content.includes('Choose optional physical action')) {
        return { text: JSON.stringify(state.action ? { [avatar ? 'avatar' : 'object']: state.action } : { intent: null }) };
      }
      return { text: state.speech, finishReason: 'stop' };
    }, cancel: async () => {} } });
  let networkOptions;
  const host = installWorldAgents({ worldId, worldLabel: 'CubeChat', generatedObjectAdapter: objects,
    ...(avatar ? { residentAvatarAdapter: sceneAdapter() } : {}),
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
    uiFactory: () => ({ open() {}, select() {}, setAgents() {}, setMessages: rows => { view.messages = rows; }, setStatus: value => statuses.push(value),
      setBusy() {}, setVoiceStatus() {}, dispose() {} }),
    serviceFactory: options => { networkOptions = options; return { start: async () => {}, close: async () => {} }; },
  });
  t.after(() => host.dispose()); await host.ready; await tick();
  const head = await host.spawn({ name: 'Builder', shared: true, movement: 'stationary' });
  return { host, agents, objects, calls, statuses, state, head, memory, view, get networkOptions() { return networkOptions; } };
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

test('owner private chat changes the existing resident avatar and records a verified outcome; visitors cannot do so', async t => {
  const f = await fixture(t, { avatar: true }), key = `local:${f.head.agentId}`;
  f.state.action = { name: 'Robot', prompt: 'An isolated copper robot' };
  const reply = await f.host.send({ key, text: 'Become a robot' });
  assert.match(reply.text, /Avatar saved: Robot/);
  const saved = await f.agents.get(f.head.agentId); assert(saved.embodiments[0].avatar);
  assert.equal(f.objects.visible.size, 0); assert.equal(f.host.getStatus().bodies.length, 1);
  assert.equal(f.host.getStatus().residentAvatars.rendered, 1);
  const count = f.calls.length;
  await f.networkOptions.respond({ agentId: f.head.agentId, prompt: 'Become a car', requesterPeerId: 'visitor' });
  assert(f.calls.slice(count).every(input => input.task === 'text-generation'));
  assert.deepEqual((await f.agents.get(f.head.agentId)).embodiments[0].avatar, saved.embodiments[0].avatar);
  f.state.action = { reset: true }; const reset = await f.host.send({ key, text: 'Go back to your original cube' });
  assert.match(reset.text, /Avatar saved: original cube/); assert.equal(f.host.getStatus().residentAvatars.rendered, 0);
});

test('a declined conversational reply never launches image or avatar work and exposes its actual model', async t => {
  const f = await fixture(t, { avatar: true }), key = `local:${f.head.agentId}`;
  f.state.speech = 'I cannot generate that avatar. I can suggest another design.';
  const reply = await f.host.send({ key, text: 'Try the first design' });
  assert.equal(reply.text, f.state.speech); assert.equal(reply.modelLabel, 'Fixture text-generation · local');
  assert.deepEqual(f.calls.map(value => value.task), ['text-generation']);
  await f.host.openConversation(key); assert.equal(f.view.messages.at(-1).modelLabel, reply.modelLabel);
  f.state.speech = 'I will try the copper robot.';
  await f.host.send({ key, text: 'Try a copper robot instead' });
  assert.equal(f.calls[1].messages.at(-1).content, 'Try a copper robot instead');
  assert.match(f.calls[2].messages[0].content, /I will try the copper robot/);
  assert((await f.agents.get(f.head.agentId)).embodiments[0].avatar);
});

test('a failed avatar settles, records the failure for the next turn and does not reuse its result', async t => {
  const f = await fixture(t, { avatar: true }), key = `local:${f.head.agentId}`;
  f.state.mesh = async () => { throw new Error('3D provider stopped'); };
  const failed = await f.host.send({ key, text: 'Become a first robot' });
  assert.equal(failed.avatarFailed, true); assert.match(failed.text, /3D provider stopped/);
  assert.equal(f.host.getStatus().residentAvatars.busy, false);
  f.state.mesh = async () => ({ mesh: meshFixture() }); f.state.speech = 'Trying your second design.';
  const before = f.calls.length, next = await f.host.send({ key, text: 'Become a second robot' });
  assert.match(next.text, /^Trying your second design/); assert.match(next.text, /Avatar saved/);
  assert.equal(f.calls[before].messages.at(-1).content, 'Become a second robot');
  assert.match(f.calls[before].messages[0].content, /3D provider stopped/);
});

test('owner image controls bypass text and image models, copy pixels and restore command history', async t => {
  const f = await fixture(t, { avatar: true }), key = `local:${f.head.agentId}`, image = imageFixture();
  const expected = [...image.data], pending = f.host.send({ key, text: '', avatarImage: image }); image.data.fill(0);
  const reply = await pending; assert.match(reply.text, /Avatar saved/); assert.equal(reply.role, 'system');
  assert.deepEqual(f.calls.map(value => value.task), ['image-to-3d']); assert.deepEqual([...f.calls[0].image.data], expected);
  assert.equal((await f.agents.events(f.head.agentId)).filter(event => event.type === 'result').length, 0, 'No fabricated LLM response');
  await f.host.openConversation(key);
  assert(f.view.messages.some(row => row.role === 'user' && row.text === 'Use this image as your avatar.'));
  assert(f.view.messages.some(row => row.role === 'system' && /Avatar saved/.test(row.text)));
});

test('exact owner prompt is sent unchanged without a speech or prompt-generation model', async t => {
  const f = await fixture(t, { avatar: true }), key = `local:${f.head.agentId}`;
  const literal = 'A copper robot, blue eyes.\nRound hands.';
  const reply = await f.host.send({ key, text: `Avatar prompt: ${literal}` });
  assert.match(reply.text, /Avatar saved/); assert.equal(reply.modelLabel, undefined);
  assert.deepEqual(f.calls.map(value => value.task), ['text-to-image', 'image-to-3d']);
  assert.equal(f.calls[0].prompt, literal);
});

test('multibyte owner commands and failed replies fit durable memory without blocking avatar work', async t => {
  const f = await fixture(t, { avatar: true }), key = `local:${f.head.agentId}`;
  const command = '机器人'.repeat(300);
  const result = await f.host.send({ key, text: command, avatarImage: imageFixture() });
  assert.match(result.text, /Avatar saved/);
  await f.host.openConversation(key);
  const saved = f.view.messages.find(row => row.role === 'user' && row.text.startsWith('机器人'));
  assert(saved); assert(new TextEncoder().encode(saved.text).length <= 2048); assert(saved.text.endsWith('…'));
  f.state.speech = '机器人'.repeat(300); f.state.mesh = async () => { throw new Error('Provider stopped'); };
  const failed = await f.host.send({ key, text: 'Try another robot' });
  assert.equal(failed.avatarFailed, true); assert.doesNotMatch(failed.text, /Failure memory not saved/);
  f.state.action = null; f.state.speech = 'Ready.';
  const before = f.calls.length; await f.host.send({ key, text: 'What happened?' });
  assert.match(f.calls[before].messages[0].content, /Provider stopped/);
});

test('failed image commands return a retryable result without making the resident require Resume', async t => {
  const f = await fixture(t, { avatar: true }), key = `local:${f.head.agentId}`;
  f.state.mesh = async () => { throw new Error('Model unavailable'); };
  const result = await f.host.send({ key, text: '', avatarImage: imageFixture() });
  assert.equal(result.avatarFailed, true); assert.equal(result.role, 'system');
  assert.equal(f.host.getStatus().residentAvatars.busy, false);
  const head = await f.agents.get(f.head.agentId); assert.notEqual(head.status, 'paused'); assert.equal(Boolean(head.recoveryRequired), false);
  f.state.mesh = async () => ({ mesh: meshFixture() });
  assert.match((await f.host.send({ key, text: '', avatarImage: imageFixture() })).text, /Avatar saved/);
});
