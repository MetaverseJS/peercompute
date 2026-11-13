import test from 'node:test';
import assert from 'node:assert/strict';
import { ArtifactStore } from '../../peercompute/src/peercompute/artifacts/ArtifactStore.js';
import { retainGeneratedMesh } from '../../peercompute/src/peercompute/inference/GeneratedMeshArtifact.js';
import { createWorldGeneratedObjectPresenter } from '../shared/agents/WorldGeneratedObjectPresenter.js';
import { WORLD_OBJECT_SCHEMA, WORLD_OBJECT_TRANSFORM_SCHEMA } from '../shared/agents/WorldObjectAction.js';
import { meshFixture, worldId, sceneAdapter, until } from './world-generated-fixtures.js';

test('a verified remote revision reuses decoded mesh, while a fresh peer fetches the same mesh CID at the retained new scale', async t => {
  const source = new ArtifactStore({ persistent: false }); await source.open(); t.after(() => source.destroy());
  const placement = { schema: WORLD_OBJECT_SCHEMA, worldId, ownerHostId: 'host', agentId: 'creator', objectId: 'castle',
    requestId: 'created', requestHash: 'a'.repeat(64), name: 'Castle', size: 6, position: [96, 0, 0] };
  const original = await retainGeneratedMesh(source, meshFixture(), { name: 'Castle', provenance: { worldObject: placement } });
  const manifest = await source.getManifest(original.artifactCid);
  const changed = { ...placement, schema: WORLD_OBJECT_TRANSFORM_SCHEMA, revision: 1, previousArtifactCid: original.artifactCid,
    actorAgentId: 'editor', requestId: 'resized', requestHash: 'b'.repeat(64), size: 60 };
  const newer = await source.importManifest({ ...manifest, provenance: { ...manifest.provenance, worldObject: changed } }, { pin: true });
  assert.equal((await source.getManifest(newer.cid)).files[0].cid, manifest.files[0].cid);
  async function peer() {
    const store = new ArtifactStore({ persistent: false }); await store.open(); t.after(() => store.destroy());
    const adapter = sceneAdapter(), stats = { blocks: 0, updates: 0 }, errors = [];
    adapter.updateTransform = (key, descriptor) => { stats.updates++; adapter.visible.set(key, structuredClone(descriptor)); };
    const fetchBlock = async cid => { stats.blocks++; const chunks = []; for await (const part of source.getBlockstore().get(cid)) chunks.push(part); return new Uint8Array(Buffer.concat(chunks)); };
    const runtime = { store, inspectPeerPackage: cid => source.getManifest(cid), withArtifactRetention: (callback, options) =>
      store.withRetention(retained => callback({ ...retained, ensure: (cid, opts) => retained.ensureLocal(cid, { ...opts, fetchBlock }) }), options) };
    const presenter = createWorldGeneratedObjectPresenter({ runtime, adapter, worldId, onError: event => errors.push(event) });
    t.after(() => presenter.dispose()); return { store, adapter, presenter, stats, errors };
  }
  const existing = await peer();
  const descriptor = { artifactCid: original.artifactCid, placement, ownerPeerId: 'authenticated-host', local: false };
  existing.presenter.sync([descriptor]); await until(() => existing.adapter.visible.size === 1);
  const blockCount = existing.stats.blocks;
  const updated = { ...descriptor, artifactCid: newer.cid, placement: changed };
  existing.presenter.sync([updated]); await until(() => existing.stats.updates === 1);
  assert.equal(existing.stats.blocks, blockCount, 'no geometry is downloaded again for a verified transform');
  assert.equal(existing.adapter.prepared.length, 1); assert.equal(existing.adapter.removed.length, 0);
  assert.equal(existing.adapter.visible.values().next().value.placement.size, 60);
  const fresh = await peer(); fresh.presenter.sync([updated]); await until(() => fresh.adapter.visible.size === 1);
  assert(fresh.stats.blocks > 0); assert.equal(fresh.adapter.prepared.length, 1);
  assert.equal(fresh.adapter.visible.values().next().value.placement.size, 60);
  assert.equal((await fresh.store.getManifest(newer.cid)).files[0].cid, manifest.files[0].cid);
  existing.presenter.sync([{ ...updated, placement: { ...changed, size: 600 } }]);
  await until(() => existing.errors.length === 1);
  assert.match(existing.errors[0].error.message, /does not match/);
  assert.equal(existing.stats.updates, 1); assert.equal(existing.adapter.visible.values().next().value.placement.size, 60);
});
