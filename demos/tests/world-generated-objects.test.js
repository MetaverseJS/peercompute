import test from 'node:test';
import assert from 'node:assert/strict';
import { ArtifactStore } from '../../peercompute/src/peercompute/artifacts/ArtifactStore.js';
import { createWorldGeneratedObjects } from '../shared/agents/WorldGeneratedObjects.js';
import { action, worldId, meshFixture, imageFixture, sceneAdapter, deferred, tick, until } from './world-generated-fixtures.js';

async function fixture(t) {
  const store = new ArtifactStore({ persistent: false }); await store.open();
  const adapter = sceneAdapter(), calls = [], states = [], controllers = [];
  const head = { agentId: 'agent', revision: 3, status: 'active', policy: { inferenceMode: 'local-only' }, embodiments: [{ worldId }] };
  const state = { owns: true, candidates: ['text-to-image', 'image-to-3d'].map(task => ({ key: `local:${task}`, manifestCid: task,
    runtime: task === 'text-to-image' ? 'onnx-diffusion' : 'onnx-mesh', available: true, local: true, task,
    modalities: task === 'text-to-image' ? ['text'] : ['image'], outputModalities: task === 'text-to-image' ? ['image'] : ['mesh'] })),
  output: async input => input.task === 'text-to-image' ? { text: '', image: imageFixture() } : { text: '', mesh: meshFixture() } };
  const agents = { get: async () => structuredClone(head), inference: { listCandidates: async () => state.candidates,
    generate: async (candidate, input, options) => { calls.push({ candidate, input, options }); return state.output(input, options); } } };
  const runtime = { store, artifactReady: false, inspectPeerPackage: cid => store.getManifest(cid), ensure: async () => {} };
  const create = (options = {}) => { const manager = createWorldGeneratedObjects({ runtime, agents, adapter, worldId, ownerHostId: 'host',
    isOwner: () => state.owns, onStatus: event => states.push(event), ...options }); controllers.push(manager); return manager; };
  const manager = create(); await manager.ready;
  t.after(async () => { for (const item of controllers) await item.dispose(); await store.destroy(); });
  return { manager, create, runtime, agents, store, adapter, head, state, calls, states };
}
test('managed text-image-mesh chain commits one retained object, actual placement receipt, and restores without generating again', async t => {
  const f = await fixture(t), result = await f.manager.generate({ agentId: 'agent', action, requestId: 'request', expectedRevision: 3 });
  assert.equal(result.status, 'placed'); assert.equal(f.calls.length, 2);
  assert(f.calls[0].input.prompt.startsWith(action.prompt)); assert.match(f.calls[0].input.prompt, /isolated object.*plain white background/);
  assert.equal(f.calls[0].input.task, 'text-to-image');
  assert.deepEqual(f.calls[1].input.image, imageFixture()); assert.equal(f.calls[1].input.task, 'image-to-3d');
  assert.equal(Object.hasOwn(f.calls[1].input, 'prompt'), false);
  assert.equal(f.adapter.visible.size, 1); assert.deepEqual(f.states.map(value => value.status), ['image', 'mesh', 'saving', 'placed']);
  const stored = await f.store.getManifest(result.artifactCid); assert.equal(stored.model, undefined);
  assert.equal(stored.files[0].path, 'mesh.glb'); assert.equal((await f.store.stat(result.artifactCid)).pinned, true);
  const fileCid = stored.files[0].cid; assert.equal((await f.store.stat(fileCid)).pinned, false);
  await f.store.gc(); assert.equal((await f.store.stat(fileCid)).status, 'complete');
  await f.manager.dispose(); const restored = f.create(); await restored.ready; await until(() => f.adapter.visible.size === 1);
  assert.equal(restored.list()[0].artifactCid, result.artifactCid); assert.equal(f.calls.length, 2);
  const otherWorld = f.create({ worldId: 'cubechat:other', adapter: sceneAdapter() }); await otherWorld.ready; assert.deepEqual(otherWorld.list(), []);
  const otherHost = f.create({ ownerHostId: 'other', adapter: sceneAdapter() }); await otherHost.ready; assert.deepEqual(otherHost.list(), []);
});
test('exact requests deduplicate across active calls and reload; changed input cannot replay an existing object identity', async t => {
  const f = await fixture(t), release = deferred(), began = deferred();
  f.state.output = async input => { if (input.task === 'text-to-image') { began.resolve(); await release.promise; return { image: imageFixture() }; } return { mesh: meshFixture() }; };
  const input = { agentId: 'agent', action, requestId: 'idempotent' }, first = f.manager.generate(input);
  assert.equal(f.manager.generate(input), first);
  await assert.rejects(f.manager.generate({ ...input, action: { ...action, prompt: 'Different shape' } }), /Conflicting/);
  await began.promise; await assert.rejects(f.manager.generate({ ...input, requestId: 'another' }), /current object/);
  release.resolve(); await first; assert.equal(f.calls.length, 2);
  await f.manager.dispose(); const restored = f.create(); await restored.ready;
  assert.equal((await restored.generate(input)).status, 'saved'); assert.equal(f.calls.length, 2);
  await assert.rejects(restored.generate({ ...input, action: { ...action, prompt: 'Different shape' } }), /Conflicting/);
});
test('explicit source pixels route directly to the mesh provider and are copied before asynchronous dispatch', async t => {
  const f = await fixture(t), image = imageFixture();
  f.state.candidates = f.state.candidates.filter(value => value.task === 'image-to-3d');
  const running = f.manager.generate({ agentId: 'agent', action, image }); image.data.fill(0);
  await running; assert.equal(f.calls.length, 1); assert.equal(f.calls[0].input.task, 'image-to-3d');
  assert.deepEqual(f.calls[0].input.image, imageFixture());
});
test('missing model, local-only policy and revoked ownership fail before generation or saved placement', async t => {
  const f = await fixture(t);
  f.state.candidates = f.state.candidates.map(value => ({ ...value, local: false, key: `peer:${value.manifestCid}` }));
  await assert.rejects(f.manager.generate({ agentId: 'agent', action }), /No 3D generation model/); assert.equal(f.calls.length, 0);
  f.head.policy.inferenceMode = 'network-assisted';
  f.state.candidates = f.state.candidates.filter(value => value.task === 'image-to-3d');
  await assert.rejects(f.manager.generate({ agentId: 'agent', action }), /text-to-image model/); assert.equal(f.calls.length, 0);
  f.state.owns = false;
  await assert.rejects(f.manager.generate({ agentId: 'agent', action, image: imageFixture() }), /ownership/);
  assert.equal(f.manager.list().length, 0);
});
test('cancel waits for provider cleanup; authority is checked again after persistence and before manifest commit', async t => {
  const f = await fixture(t), began = deferred(), cleanup = deferred(), controller = new AbortController();
  f.state.output = async (_input, { signal }) => {
    began.resolve(); await new Promise(resolve => signal.addEventListener('abort', resolve, { once: true }));
    await cleanup.promise; signal.throwIfAborted();
  };
  const pending = f.manager.generate({ agentId: 'agent', action, signal: controller.signal }); pending.catch(() => {});
  await began.promise; controller.abort(); let finished = false; pending.catch(() => { finished = true; });
  await tick(); assert.equal(finished, false); cleanup.resolve(); await assert.rejects(pending, { name: 'AbortError' });
  assert.equal(f.manager.list().length, 0); assert.equal(f.adapter.visible.size, 0);
  f.state.output = async () => ({ mesh: meshFixture() });
  const original = f.store.importFile.bind(f.store);
  f.store.importFile = async (...args) => { const file = await original(...args); f.head.revision++; return file; };
  await assert.rejects(f.manager.generate({ agentId: 'agent', action, image: imageFixture(), expectedRevision: 3 }), /settings changed/);
  assert.equal(f.manager.list().length, 0); assert(f.adapter.prepared.at(-1).released);
  const records = []; for await (const record of f.store.list()) records.push(record);
  assert.equal(records.filter(record => record.pinned).length, 0);
});
test('owner deletion removes scene and durable placement; another host cannot delete it', async t => {
  const f = await fixture(t), result = await f.manager.generate({ agentId: 'agent', action, requestId: 'delete-me', image: imageFixture() });
  const stranger = f.create({ ownerHostId: 'stranger', adapter: sceneAdapter() }); await stranger.ready;
  await assert.rejects(stranger.remove('delete-me'), /Only this host/);
  await f.manager.remove('delete-me'); assert.equal(f.adapter.visible.size, 0); assert.equal((await f.store.stat(result.artifactCid)).pinned, false);
  const reloaded = f.create(); await reloaded.ready; assert.deepEqual(reloaded.list(), []);
});
test('deletion during a slow publication withdraws its late announcement and cannot republish the removed object', async t => {
  const f = await fixture(t), entered = deferred(), release = deferred(), publications = [], withdrawals = [];
  f.runtime.artifactReady = true;
  f.runtime.publish = async cid => { publications.push(cid); entered.resolve(); await release.promise; };
  f.runtime.withdraw = async cid => { withdrawals.push(cid); };
  const result = await f.manager.generate({ agentId: 'agent', action, requestId: 'publishing', image: imageFixture() });
  await entered.promise; await f.manager.remove('publishing'); release.resolve(); await f.manager.syncNetwork();
  assert.deepEqual(publications, [result.artifactCid]); assert.deepEqual(withdrawals, [result.artifactCid]);
  assert.equal((await f.store.stat(result.artifactCid)).pinned, false);
  await f.manager.syncNetwork(); assert.equal(publications.length, 1);
});
