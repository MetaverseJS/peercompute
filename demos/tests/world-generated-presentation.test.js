import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { ArtifactStore } from '../../peercompute/src/peercompute/artifacts/ArtifactStore.js';
import { retainGeneratedMesh } from '../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';
import { createWorldGeneratedObjectPresenter } from '../shared/agents/WorldGeneratedObjectPresenter.js';
import { CubeGeneratedObjectLayer } from '../cubechat/src/renderer/CubeGeneratedObjectLayer.js';
import { WORLD_OBJECT_SCHEMA } from '../shared/agents/WorldObjectAction.js';
import { meshFixture, worldId, sceneAdapter, deferred, tick, until } from './world-generated-fixtures.js';

const placement = { schema: WORLD_OBJECT_SCHEMA, worldId, ownerHostId: 'other-host', agentId: 'agent', objectId: 'object',
  requestId: 'request', requestHash: 'a'.repeat(64), name: 'Fixture pyramid', position: [20, 0, 10], size: 6 };
async function fixture(t) {
  const store = new ArtifactStore({ persistent: false }); await store.open(); t.after(() => store.destroy());
  const record = await retainGeneratedMesh(store, meshFixture(), { provenance: { worldObject: placement } });
  const descriptor = { artifactCid: record.artifactCid, placement, ownerPeerId: 'remote', local: false };
  const calls = [], errors = [], adapter = sceneAdapter();
  const runtime = { store, inspectPeerPackage: async cid => { calls.push('inspect'); return store.getManifest(cid); },
    withArtifactRetention: (callback, options) => store.withRetention(scoped => callback({ ...scoped,
      ensure: (cid, options) => { calls.push('ensure'); return scoped.ensureLocal(cid, options); } }), options) };
  const presenter = createWorldGeneratedObjectPresenter({ runtime, adapter, worldId, onError: value => errors.push(value) });
  t.after(() => presenter.dispose()); return { store, record, descriptor, calls, errors, runtime, presenter, adapter };
}
test('remote manifests are checked before transfer; wrong world, owner, bytes and model-weight manifests never reach ensure', async t => {
  const f = await fixture(t), manifest = await f.store.getManifest(f.record.artifactCid);
  let badIndex = 0;
  for (const bad of [{ ...manifest, model: { runtime: 'llama.cpp' } },
    { ...manifest, files: [{ ...manifest.files[0], size: 17 * 1024 * 1024 }] },
    { ...manifest, provenance: { ...manifest.provenance, worldObject: { ...placement, ownerHostId: 'forged' } } },
    { ...manifest, provenance: { ...manifest.provenance, worldObject: { ...placement, worldId: 'other' } } }]) {
    f.runtime.inspectPeerPackage = async () => bad;
    f.presenter.sync([{ ...f.descriptor, ownerPeerId: `bad-owner-${badIndex++}` }]); await until(() => f.presenter.getStatus().pending === 0);
    assert.equal(f.calls.includes('ensure'), false); assert.equal(f.adapter.visible.size, 0);
  }
  assert.equal(f.errors.length, 4);
  f.runtime.inspectPeerPackage = cid => f.store.getManifest(cid);
  f.presenter.sync([f.descriptor]); await until(() => f.adapter.visible.size === 1);
  assert.deepEqual(f.calls, ['ensure']);
});
test('permanent invalid objects do not retry unchanged CIDs or starve a later valid object', async t => {
  const f = await fixture(t), manifest = await f.store.getManifest(f.record.artifactCid), invalid = [];
  for (let i = 0; i < 2; i++) {
    const bad = await f.store.importManifest({ ...manifest, model: { runtime: `invalid-${i}` } });
    invalid.push({ ...f.descriptor, artifactCid: bad.cid, ownerPeerId: `bad-${i}` });
  }
  f.presenter.sync([...invalid, f.descriptor]); await until(() => f.adapter.visible.size === 1);
  assert.equal(f.calls.filter(value => value === 'inspect').length, 3);
  for (let i = 0; i < 6; i++) { f.presenter.sync([...invalid, f.descriptor]); await tick(); }
  assert.equal(f.calls.filter(value => value === 'inspect').length, 3);
  assert.equal(f.errors.length, 2);
});
test('removed or replaced owners suppress late meshes, and shutdown awaits preparation cleanup', async t => {
  const f = await fixture(t), gate = deferred(), entered = deferred();
  const original = f.adapter.prepare;
  f.adapter.prepare = async (...args) => { entered.resolve(); await gate.promise; return original(...args); };
  f.presenter.sync([f.descriptor]); await entered.promise;
  f.presenter.sync([]); gate.resolve(); await until(() => f.presenter.getStatus().pending === 0);
  assert.equal(f.adapter.visible.size, 0);
  f.adapter.prepare = original; f.presenter.sync([f.descriptor]); await until(() => f.adapter.visible.size === 1);
  f.presenter.sync([]); assert.equal(f.adapter.visible.size, 0);
  const second = deferred(); f.runtime.inspectPeerPackage = async cid => { await second.promise; return f.store.getManifest(cid); };
  f.presenter.sync([f.descriptor]); await tick(); let done = false;
  const closing = f.presenter.dispose().then(() => { done = true; }); await tick(); assert.equal(done, false);
  second.resolve(); await closing; assert.equal(f.adapter.visible.size, 0);
});
test('remote display fetches without permanent pins and preserves independently retained artifacts', async t => {
  const f = await fixture(t), target = new ArtifactStore({ persistent: false });
  await target.open(); t.after(() => target.destroy());
  const fetchBlock = async cid => {
    const chunks = []; for await (const chunk of f.store.getBlockstore().get(cid)) chunks.push(chunk);
    return new Uint8Array(Buffer.concat(chunks));
  };
  const runtime = { store: target, inspectPeerPackage: cid => f.store.getManifest(cid),
    withArtifactRetention: (callback, options) => target.withRetention(scoped => callback({ ...scoped,
      ensure: (cid, options) => scoped.ensureLocal(cid, { ...options, fetchBlock }) }), options) };
  const adapter = sceneAdapter(), presenter = createWorldGeneratedObjectPresenter({ runtime, adapter, worldId });
  t.after(() => presenter.dispose());
  presenter.sync([f.descriptor]); await until(() => adapter.visible.size === 1);
  assert.equal((await target.stat(f.record.artifactCid)).pinned, false);
  assert.equal((await f.store.stat(f.record.artifactCid)).pinned, true);
  presenter.sync([]); await presenter.dispose(); await target.gc();
  assert.equal(await target.stat(f.record.artifactCid), undefined);
  assert.equal((await f.store.stat(f.record.artifactCid)).pinned, true);

  // Viewing an already independently retained artifact must not revoke its pin.
  await target.ensureLocal(f.record.artifactCid, { fetchBlock, pin: true });
  const retainedAdapter = sceneAdapter(), retained = createWorldGeneratedObjectPresenter({ runtime, adapter: retainedAdapter, worldId });
  t.after(() => retained.dispose()); retained.sync([f.descriptor]); await until(() => retainedAdapter.visible.size === 1);
  await retained.dispose(); await target.gc();
  assert.equal((await target.stat(f.record.artifactCid)).pinned, true);
});
test('real Three GLTFLoader displays the checked mesh at a bounded placement and releases scene resources', async () => {
  const scene = new THREE.Scene(), layer = new CubeGeneratedObjectLayer({ scene: { scene, gridSize: 100 },
    getResidentPosition: () => [0, 3, 0] });
  const mesh = meshFixture();
  // CID here identifies the structural fixture bytes; placement validation is
  // tested above against real retained manifests before renderer admission.
  const store = new ArtifactStore({ persistent: false }); await store.open();
  try {
    const retained = await retainGeneratedMesh(store, mesh, { provenance: { worldObject: placement } });
    const descriptor = { artifactCid: retained.artifactCid, placement };
    const prepared = await layer.prepare(mesh); prepared.commit('local:object', descriptor);
    assert.equal(layer.entries.size, 1); const group = layer.entries.get('local:object').group;
    assert.equal(group.parent, layer.group); assert.equal(group.name, placement.name);
    const bounds = new THREE.Box3().setFromObject(group);
    assert.equal(bounds.min.y, placement.position[1]); assert.equal(Math.max(...bounds.getSize(new THREE.Vector3()).toArray()), placement.size);
    assert.deepEqual(layer.getPlacement('agent', 6), [9, 0, 0]);
    let disposed = 0; group.traverse(object => { object.geometry?.addEventListener('dispose', () => disposed++); });
    layer.remove('local:object'); assert.equal(layer.entries.size, 0); assert.equal(disposed, 1);
    const cancelled = new AbortController(); cancelled.abort(); await assert.rejects(layer.prepare(mesh, { signal: cancelled.signal }), { name: 'AbortError' });
    const bad = { ...mesh, data: mesh.data.slice() }; bad.data[0] = 0;
    await assert.rejects(layer.prepare(bad), /Invalid generated mesh/);
  } finally { layer.dispose(); await store.destroy(); }
  assert.equal(scene.children.length, 0);
});
