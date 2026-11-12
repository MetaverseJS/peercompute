import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { AgentRecordStore } from '../../peercompute/src/peercompute/agents/AgentRecordStore.js';
import { AgentRuntime } from '../../peercompute/src/peercompute/agents/AgentRuntime.js';
import { ArtifactStore } from '../../peercompute/src/peercompute/artifacts/ArtifactStore.js';
import { normalizeAgentEmbodiments, normalizePublicAgent } from '../../peercompute/src/peercompute/agents/WorldAgentContracts.js';
import { normalizeResidentAvatar, residentAvatarFromManifest } from '../../peercompute/src/peercompute/agents/ResidentAvatar.js';
import { createResidentProfile, normalizeResidentProfile, legacyResidentProfile } from '../../peercompute/src/peercompute/agents/ResidentProfile.js';
import { readGeneratedMesh } from '../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';
import { createWorldResidentAvatars } from '../shared/agents/WorldResidentAvatars.js';
import { createWorldResidentAvatarPresenter } from '../shared/agents/WorldResidentAvatarPresenter.js';
import { projectWorldIntentRequest } from '../shared/agents/WorldIntentDecision.js';
import { worldModelSizeFromManifest } from '../shared/world/WorldModelScale.js';
import { meshFixture, imageFixture, sceneAdapter, worldId, deferred, until } from './world-generated-fixtures.js';

const action = { name: 'Robot', prompt: 'A friendly copper robot with a square head' };
async function fixture(t) {
  const records = new AgentRecordStore({ name: crypto.randomUUID(), indexedDBImpl: new IDBFactory(), keyRange: IDBKeyRange,
    lockManager: { request: async (_name, _options, callback) => callback({}) } }); await records.open();
  const store = new ArtifactStore({ persistent: false }); await store.open();
  const calls = [], published = new Set(), adapter = sceneAdapter(), state = { mesh: async () => ({ mesh: meshFixture() }), owned: true };
  const candidates = ['text-to-image', 'image-to-3d'].map(task => ({ key: `local:${task}`, local: true, available: true,
    manifestCid: task, sessionId: task, task, runtime: 'fixture', modalities: task === 'image-to-3d' ? ['image'] : ['text'],
    outputModalities: task === 'image-to-3d' ? ['mesh'] : ['image'] }));
  const agents = new AgentRuntime({ store: records, inference: { listCandidates: async () => candidates,
    async generate(candidate, input, options) { calls.push({ candidate, input }); return input.task === 'text-to-image' ? { image: imageFixture() } : state.mesh(input, options); }, cancel: async () => {} } });
  const runtime = { store, artifactReady: true, publish: async cid => published.add(cid), withdraw: async cid => published.delete(cid),
    inspectPeerPackage: cid => store.getManifest(cid), withArtifactRetention: (fn, options) => store.withRetention(retained => fn({ ...retained,
      ensure: (cid, options) => retained.ensureLocal(cid, options) }), options) };
  let head = await agents.create({ name: 'Resident', instructions: 'PRIVATE PERSONALITY', goals: ['PRIVATE GOAL'], embodiments: [{ worldId,
    position: [0, 3, 0], color: '#00ff00', shared: true, allowCloning: true }] }); head = await agents.resume(head.agentId);
  const bodies = async () => (await agents.list()).filter(h => h.embodiments.length).map(h => ({ ...normalizePublicAgent({ agentId: h.agentId,
    name: h.identity.name, color: '#00ff00', position: [0, 3, 0], status: 'idle', avatar: h.embodiments[0].avatar }),
    key: `local:${h.agentId}`, local: true, shared: h.embodiments[0].shared, ownerPeerId: 'owner' }));
  let service;
  service = createWorldResidentAvatars({ runtime, agents, adapter, worldId, ownerHostId: records.hostId,
    isOwner: () => state.owned, onSaved: async () => { await service.syncSharing(await bodies()); } });
  await service.syncSharing(await bodies());
  t.after(async () => { await service.dispose(); await agents.dispose(); await records.destroy(); await store.destroy(); });
  const generate = async (proposal = action, options = {}) => service.generate({ agentId: head.agentId, action: proposal,
    expectedRevision: (await agents.get(head.agentId)).revision, ...options });
  return { records, agents, store, runtime, head, service, adapter, state, calls, published, bodies, generate };
}
test('owner avatar uses real record CAS and retained GLB, replaces one binding, reloads without inference, and resets', async t => {
  const f = await fixture(t), first = await f.generate();
  assert.equal(first.head.agentId, f.head.agentId); assert.equal(first.head.identity.instructions, 'PRIVATE PERSONALITY');
  assert.deepEqual(f.calls.map(c => c.input.task), ['text-to-image', 'image-to-3d']);
  assert.equal(f.adapter.visible.size, 1); assert.equal(f.published.has(first.avatar.artifactCid), true);
  const manifest = await f.store.getManifest(first.avatar.artifactCid);
  assert.equal(JSON.stringify(manifest).includes('PRIVATE'), false); assert.equal(JSON.stringify(manifest).includes(action.prompt), false);
  assert.deepEqual(residentAvatarFromManifest(first.avatar.artifactCid, manifest, { worldId, agentId: f.head.agentId }), first.avatar);
  assert.equal((await f.store.stat(first.avatar.artifactCid)).pinned, true);
  const restored = sceneAdapter(), presenter = createWorldResidentAvatarPresenter({ runtime: f.runtime, adapter: restored, worldId });
  presenter.sync(await f.bodies()); await until(() => restored.visible.size === 1); await presenter.dispose(); assert.equal(f.calls.length, 2);
  const second = await f.generate({ name: 'Car', prompt: 'A little blue car' });
  assert.notEqual(second.avatar.artifactCid, first.avatar.artifactCid); assert.equal(f.adapter.visible.size, 1);
  assert.equal((await f.store.stat(first.avatar.artifactCid)).pinned, false); assert.equal(f.published.has(first.avatar.artifactCid), false);
  await f.generate({ reset: true }); assert.equal(f.adapter.visible.size, 0);
  assert.equal((await f.agents.get(f.head.agentId)).embodiments[0].avatar, undefined);
  assert.equal((await f.store.stat(second.avatar.artifactCid)).pinned, false);
});
test('visitor authority, superseding edits and cancelled computation leave the prior binding intact', async t => {
  const f = await fixture(t), original = await f.generate(); f.state.owned = false;
  await assert.rejects(f.generate(), /ownership/); f.state.owned = true;
  const gate = deferred(), entered = deferred(); f.state.mesh = async () => { entered.resolve(); await gate.promise; return { mesh: meshFixture() }; };
  const pending = f.generate({ name: 'New', prompt: 'Another robot' }); pending.catch(() => {}); await entered.promise;
  await f.agents.update(f.head.agentId, { name: 'Edited' }); gate.resolve(); await assert.rejects(pending, /changed/);
  assert.deepEqual((await f.agents.get(f.head.agentId)).embodiments[0].avatar, original.avatar);
  const controller = new AbortController(); controller.abort(); await assert.rejects(f.generate(action, { signal: controller.signal }), { name: 'AbortError' });
});
test('failed binding save keeps the new pin for actual AgentRuntime Resume recovery', async t => {
  const f = await fixture(t); const commit = f.records.commit.bind(f.records);
  let fail = true; f.records.commit = async (id, change, options) => {
    if (fail && change.head?.embodiments?.[0]?.avatar) { fail = false; throw new Error('Injected IndexedDB write failure'); }
    return commit(id, change, options);
  };
  await assert.rejects(f.generate(), /write failure/); const failed = await f.agents.get(f.head.agentId);
  assert.equal(failed.activity.unsaved, true); assert.equal(failed.embodiments[0].avatar, undefined);
  const resumed = await f.agents.resume(f.head.agentId); assert(resumed.embodiments[0].avatar);
  const cid = resumed.embodiments[0].avatar.artifactCid;
  assert.equal((await f.store.stat(cid)).pinned, true); assert((await readGeneratedMesh(f.store, cid)).data.byteLength > 0);
  await f.service.syncSharing(await f.bodies()); await until(() => f.adapter.visible.size === 1);
});
test('private bodies are not published; clone has independent pin ownership and old-schema profile remains compatible', async t => {
  const f = await fixture(t), head = await f.agents.get(f.head.agentId);
  await f.agents.update(head.agentId, { embodiments: head.embodiments.map(b => ({ ...b, shared: false })) });
  await f.service.syncSharing(await f.bodies()); const first = await f.generate(); assert.equal(f.published.size, 0);
  const source = (await f.bodies())[0], clone = await f.service.retainClone({ sourceBody: source, avatar: first.avatar, agentId: 'clone' });
  assert.notEqual(clone.artifactCid, first.avatar.artifactCid);
  await f.service.release(first.avatar); await f.store.gc();
  assert((await readGeneratedMesh(f.store, clone.artifactCid)).data.byteLength);
  const current = await f.agents.get(head.agentId); current.embodiments[0].shared = true;
  const profile = createResidentProfile(current, worldId); assert.deepEqual(normalizeResidentProfile(profile).avatar, first.avatar);
  assert.equal(legacyResidentProfile(profile).avatar, undefined); assert.equal(normalizeResidentProfile(legacyResidentProfile(profile)).schema, 'peercompute.resident-profile.v1');
  assert.throws(() => normalizeResidentProfile({ ...legacyResidentProfile(profile), avatar: first.avatar }));
});
test('malformed descriptors and wrong resident manifests fail before renderer/remote transfer', async t => {
  const f = await fixture(t), result = await f.generate();
  assert.throws(() => normalizeResidentAvatar({ ...result.avatar, url: 'https://example.com' }));
  assert.throws(() => normalizeAgentEmbodiments([{ worldId, position: [0,0,0], color: '#ff0000', shared: true, avatar: { kind: 'url', artifactCid: 'bogus' } }]));
  let ensured = false; const adapter = sceneAdapter(), errors = [];
  const presenter = createWorldResidentAvatarPresenter({ runtime: { ...f.runtime, withArtifactRetention: () => { ensured = true; } }, adapter,
    worldId, onError: e => errors.push(e) });
  presenter.sync([{ key: 'remote:wrong', local: false, ownerPeerId: 'remote', agentId: 'wrong', avatar: result.avatar }]);
  await until(() => presenter.getStatus().pending === 0); assert.equal(ensured, false); assert.equal(errors.length, 1); await presenter.dispose();
});
test('avatar admission is opt-in owner capability; reset is exact and proposals do not grant movement', () => {
  const observed = { self: { id: 'self', position: [0,0,0] }, participants: [], observedAt: Date.now() };
  const disabled = projectWorldIntentRequest('become a robot', observed);
  assert.throws(() => disabled.resolve(JSON.stringify({ avatar: action })));
  const enabled = projectWorldIntentRequest('become a robot', observed, { allowAvatar: true });
  assert.deepEqual(enabled.resolve(JSON.stringify({ avatar: action })), { avatar: { ...action, size: 6 } });
  assert.deepEqual(enabled.resolve('{"avatar":{"reset":true}}'), { avatar: { reset: true } });
  assert.throws(() => enabled.resolve('{"avatar":{"reset":true,"url":"bad"}}'));
});

test('failed or superseded visual replacement retains the previous mesh and does not pin a remote view', async t => {
  const f = await fixture(t), first = await f.generate(), original = (await f.bodies())[0];
  const second = await f.generate({ name: 'Second', prompt: 'Another shape' }), replacement = (await f.bodies())[0];
  const adapter = sceneAdapter(), errors = [], presenter = createWorldResidentAvatarPresenter({ runtime: f.runtime, adapter, worldId, onError: e => errors.push(e) });
  t.after(() => presenter.dispose());
  presenter.sync([original]); await until(() => adapter.visible.size === 1);
  assert.deepEqual(presenter.getStatus().avatars, [{ key: original.key, artifactCid: first.avatar.artifactCid }]);
  const prepare = adapter.prepare, entered = deferred(), gate = deferred();
  adapter.prepare = async () => { entered.resolve(); await gate.promise; throw new Error('Decoder rejected replacement'); };
  presenter.sync([replacement]); await entered.promise;
  assert.equal(adapter.visible.get(original.key).avatar.artifactCid, first.avatar.artifactCid);
  gate.resolve(); await until(() => presenter.getStatus().pending === 0); assert.equal(errors.length, 1);
  assert.equal(adapter.visible.get(original.key).avatar.artifactCid, first.avatar.artifactCid);
  assert.deepEqual(presenter.getStatus().avatars, [{ key: original.key, artifactCid: first.avatar.artifactCid }]);
  presenter.sync([]); assert.equal(adapter.visible.size, 0);
  adapter.prepare = prepare; presenter.sync([replacement]); await until(() => adapter.visible.size === 1);
  assert.equal(adapter.visible.get(original.key).avatar.artifactCid, second.avatar.artifactCid);
  assert.deepEqual(presenter.getStatus().avatars, [{ key: original.key, artifactCid: second.avatar.artifactCid }]);
});
test('late publication is withdrawn if sharing is revoked while the publish is pending', async t => {
  const f = await fixture(t), entered = deferred(), gate = deferred();
  f.runtime.publish = async cid => { entered.resolve(); await gate.promise; f.published.add(cid); };
  const creating = f.generate(); creating.catch(() => {}); await entered.promise;
  const head = await f.agents.get(f.head.agentId);
  await f.agents.update(head.agentId, { embodiments: head.embodiments.map(b => ({ ...b, shared: false })) });
  const syncing = f.service.syncSharing(await f.bodies()); gate.resolve(); await syncing; await creating;
  assert.equal(f.published.size, 0);
});
test('same request ID is idempotent and a conflicting action cannot reuse the old result', async t => {
  const f = await fixture(t), id = crypto.randomUUID(), result = await f.generate(action, { requestId: id });
  assert.deepEqual((await f.generate(action, { requestId: id })).avatar, result.avatar);
  await assert.rejects(f.generate({ reset: true }, { requestId: id }), /Conflicting/); assert.equal(f.calls.length, 2);
});

test('avatar image inputs and exact-prompt mode participate in idempotency without changing body authority', async t => {
  const f = await fixture(t), image = imageFixture(), requestId = crypto.randomUUID();
  const result = await f.generate(action, { requestId, image });
  assert.deepEqual(f.calls.map(c => c.input.task), ['image-to-3d']);
  assert.deepEqual((await f.generate(action, { requestId, image })).avatar, result.avatar);
  const changed = { ...image, data: image.data.slice() }; changed.data[0] ^= 255;
  await assert.rejects(f.generate(action, { requestId, image: changed }), /Conflicting/);
  await assert.rejects(f.generate(action, { requestId, image, exactPrompt: true }), /Conflicting/);
  await assert.rejects(f.generate({ reset: true }, { image }), /Reset/);
  await assert.rejects(f.generate(action, { exactPrompt: 'yes' }), /boolean/);
});
test('avatar size survives generation, retained reload, remote display and independently retained cloning without rewriting mesh bytes', async t => {
  const f = await fixture(t), first = await f.generate({ name: 'Car', prompt: 'A full-size blue car', size: 15 });
  const cid = first.avatar.artifactCid, manifest = await f.store.getManifest(cid);
  assert.equal(worldModelSizeFromManifest(manifest), 15);
  assert(f.adapter.prepared.some(value => value.size === 15));
  const restored = sceneAdapter(), presenter = createWorldResidentAvatarPresenter({ runtime: f.runtime, adapter: restored, worldId });
  t.after(() => presenter.dispose());
  const sourceBody = { ...(await f.bodies())[0], local: false, key: `remote:${f.head.agentId}` };
  presenter.sync([sourceBody]); await until(() => restored.visible.size === 1);
  assert.equal(restored.prepared[0].size, 15);
  const clone = await f.service.retainClone({ sourceBody, avatar: first.avatar, agentId: 'clone' });
  const clonedManifest = await f.store.getManifest(clone.artifactCid);
  assert.equal(worldModelSizeFromManifest(clonedManifest), 15);
  assert.deepEqual(clonedManifest.files, manifest.files);
  assert.notEqual(clone.artifactCid, cid); assert.equal(f.calls.length, 2);
});
