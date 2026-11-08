import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { AgentRecordStore } from '../../peercompute/src/peercompute/agents/AgentRecordStore.js';
import { AgentRuntime } from '../../peercompute/src/peercompute/agents/AgentRuntime.js';
import { createAgentModelAdapter } from '../inference/src/agentModelAdapter.js';
import { createWorldAppearance, appearanceThumbnail } from '../shared/agents/WorldAppearance.js';

const worldId = 'cubechat:appearance';
const binding = { worldId, position: [0, 3, 0], color: '#44ffaa', shared: true };
const pixels = (value = 120, size = 512) => ({ width: size, height: size, channels: 4, data: new Uint8Array(size * size * 4).fill(value) });
const candidate = { key: 'local:image', manifestCid: 'image', sessionId: 'gpu', local: true, available: true,
  runtime: 'onnx-diffusion', task: 'text-to-image', modalities: ['text'], outputModalities: ['image'] };
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
async function fixture(t, { localOnly = true } = {}) {
  const store = new AgentRecordStore({ name: crypto.randomUUID(), indexedDBImpl: new IDBFactory(), keyRange: IDBKeyRange,
    lockManager: { request: async (_name, _options, callback) => callback({}) } }); await store.open();
  const calls = [], state = { candidates: [candidate], output: async () => ({ text: '', image: pixels() }) };
  const service = { getStatus: () => ({ status: 'ready', manifestCid: 'image', sessionId: 'gpu' }) };
  const runtime = { listInferenceTargets: () => state.candidates, getServiceForModel: () => service,
    store: { getManifest: async () => ({ model: candidate }) }, refreshPeers: async () => { calls.push('refresh'); },
    generate: async (key, input) => { calls.push({ key, input }); return state.output(input); }, cancel: async () => {} };
  const agents = new AgentRuntime({ store, inference: createAgentModelAdapter(runtime) });
  const head = await agents.create({ name: 'Painter', inferenceMode: localOnly ? 'local-only' : 'network-assisted', embodiments: [binding] });
  await agents.resume(head.agentId);
  const appearance = createWorldAppearance({ runtime, agents, worldId });
  t.after(async () => { await appearance.dispose(); await agents.dispose(); await store.destroy(); });
  return { store, runtime, agents, appearance, calls, state, id: head.agentId };
}
test('unavailable provider saves private prompt without inference, downloads, or pausing the agent', async t => {
  const f = await fixture(t); f.state.candidates = [];
  const before = await f.agents.get(f.id), result = await f.appearance.generate(f.id, { prompt: 'A friendly blue robot' });
  assert.equal(result.status, 'unavailable'); assert.match(result.message, /retry/);
  assert.equal((await f.agents.get(f.id)).status, before.status);
  assert.equal(result.head.embodiments[0].appearancePrompt, 'A friendly blue robot');
  assert.equal((await f.store.operations(f.id)).length, 0); assert.deepEqual(f.calls, []);
});
test('managed generation persists its exact attachment and binds a bounded reproducible public thumbnail', async t => {
  const f = await fixture(t), result = await f.appearance.generate(f.id, { prompt: 'A friendly blue robot' });
  assert.equal(result.status, 'ready'); assert.equal(result.image.width, 256); assert.equal(result.image.data.length, 262144);
  const face = result.head.embodiments[0].face;
  const saved = await f.agents.getAttachment(f.id, face.attachmentId); assert.equal(saved.width, 512);
  assert.deepEqual(f.appearance.publicRef(result.head), result.face);
  assert.equal('attachmentId' in result.face, false); assert.equal('appearancePrompt' in result.face, false);
  assert.match(f.calls[0].input.conversationId, /^appearance:/); assert.equal(f.calls[0].key, 'local:image');
  assert.deepEqual((await f.appearance.getLocal(f.id)).data, result.image.data);
  const restarted = createWorldAppearance({ runtime: f.runtime, agents: f.agents, worldId });
  assert.deepEqual((await restarted.getLocal(f.id, { sharedOnly: true, sha256: face.sha256 })).data, result.image.data);
  await restarted.dispose(); assert.equal(f.calls.length, 1);
});
test('local-only never falls back to a peer; mixed uses the actual peer task without loading weights', async t => {
  const local = await fixture(t); local.state.candidates = [{ ...candidate, local: false, key: 'peer:image' }];
  assert.equal((await local.appearance.generate(local.id, { prompt: 'A robot' })).status, 'unavailable'); assert.deepEqual(local.calls, []);
  const mixed = await fixture(t, { localOnly: false }); mixed.state.candidates = [{ ...candidate, local: false, key: 'peer:image' }];
  assert.equal((await mixed.appearance.generate(mixed.id, { prompt: 'A robot' })).status, 'ready');
  assert.equal(mixed.calls.filter(x => x === 'refresh').length, 2); assert.equal(mixed.calls.find(x => x.key)?.key, 'peer:image');
});
test('cancellation awaits managed cleanup and preserves the previous saved face', async t => {
  const f = await fixture(t), original = await f.appearance.generate(f.id, { prompt: 'Original' });
  const started = deferred(), cleanup = deferred();
  f.state.output = async ({ signal }) => { started.resolve(); await new Promise(r => signal.addEventListener('abort', r, { once: true })); await cleanup.promise; throw signal.reason; };
  const controller = new AbortController(); const running = f.appearance.generate(f.id, { prompt: 'Replacement', signal: controller.signal });
  await started.promise; controller.abort(); let done = false; running.catch(() => { done = true; });
  await new Promise(r => setImmediate(r)); assert.equal(done, false); cleanup.resolve(); await assert.rejects(running, { name: 'AbortError' });
  assert.deepEqual((await f.agents.get(f.id)).embodiments[0].face, original.head.embodiments[0].face);
});
test('a body removed after generation cannot receive a late face binding', async t => {
  const f = await fixture(t), run = f.agents.run.bind(f.agents);
  f.agents.run = async (...args) => { const result = await run(...args); await f.agents.update(f.id, { embodiments: [] }, { expectedRevision: result.head.revision }); return result; };
  await assert.rejects(f.appearance.generate(f.id, { prompt: 'A robot' }), /changed/);
  assert.deepEqual((await f.agents.get(f.id)).embodiments, []);
});
test('private, replaced, and damaged appearance references never expose attachment pixels', async t => {
  const f = await fixture(t); const result = await f.appearance.generate(f.id, { prompt: 'Private portrait' });
  assert.equal(await f.appearance.getLocal(f.id, { sha256: '0'.repeat(64), sharedOnly: true }), null);
  let head = await f.agents.get(f.id);
  await f.agents.update(f.id, { embodiments: [{ ...head.embodiments[0], shared: false }] }, { expectedRevision: head.revision });
  assert.equal(await f.appearance.getLocal(f.id, { sharedOnly: true }), null);
  const read = f.agents.getAttachment.bind(f.agents); f.agents.getAttachment = async (...args) => { const image = await read(...args); image.data.fill(0); return image; };
  await assert.rejects(f.appearance.getLocal(f.id), /integrity/);
  assert.equal(result.face.width, 256);
});
test('remote faces are digest verified, cached, and cancelled on helper disposal', async t => {
  const f = await fixture(t), image = appearanceThumbnail(pixels()), face = { ...image }; delete face.data;
  const descriptor = { ownerPeerId: 'owner', agentId: 'a', face }; let requests = 0;
  const network = { requestAppearance: async () => { requests++; return image; } };
  assert.deepEqual(await f.appearance.loadRemote(descriptor, { network }), image);
  assert.deepEqual(await f.appearance.loadRemote(descriptor, { network }), image); assert.equal(requests, 1);
  const other = appearanceThumbnail(pixels(99));
  await assert.rejects(f.appearance.loadRemote({ ...descriptor, face: other }, { network }), /integrity/);
  await f.appearance.dispose(); assert.throws(() => f.appearance.loadRemote(descriptor, { network }), { name: 'AbortError' });
});
test('thumbnail rejects malformed or excessive inputs and preserves aspect ratio and source immutability', () => {
  const input = { width: 512, height: 256, channels: 4, data: new Uint8Array(512 * 256 * 4).fill(60) };
  const thumb = appearanceThumbnail(input); assert.equal(thumb.width, 256); assert.equal(thumb.height, 128);
  thumb.data.fill(0); assert.equal(input.data[0], 60);
  for (const image of [null, { ...input, width: 4096 }, { ...input, channels: 3 }, { ...input, data: new Uint8Array(2) }]) assert.throws(() => appearanceThumbnail(image));
});

test('equal raw pixel digests with different valid geometry do not collide in the appearance cache', async t => {
  const f = await fixture(t), data = new Uint8Array([10,20,30,255,40,50,60,255]);
  const portrait = appearanceThumbnail({ width: 1, height: 2, channels: 4, data });
  const landscape = appearanceThumbnail({ width: 2, height: 1, channels: 4, data });
  assert.equal(portrait.sha256, landscape.sha256); let calls = 0;
  const network = { requestAppearance: async (_owner, { face }) => { calls++; return face.width === 1 ? portrait : landscape; } };
  const descriptor = { ownerPeerId: 'owner', agentId: 'agent', face: portrait };
  assert.equal((await f.appearance.loadRemote(descriptor, { network })).height, 2);
  assert.equal((await f.appearance.loadRemote({ ...descriptor, face: landscape }, { network })).width, 2);
  assert.equal((await f.appearance.loadRemote(descriptor, { network })).width, 1);
  assert.equal(calls, 2);
});
