import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { ArtifactStore } from '../../src/peercompute/artifacts/ArtifactStore.js';
import { WorldObjectStore } from '../../src/peercompute/agents/WorldObjectStore.js';

const scope = { worldId: 'cubechat:room', ownerHostId: 'host' };
async function fixture(t) {
  const indexedDBImpl = new IDBFactory(), artifacts = new ArtifactStore({ persistent: false }); await artifacts.open();
  const cids = [];
  for (let i = 0; i < 4; i++) cids.push((await artifacts.importFile(new Uint8Array([i]))).cid);
  await artifacts.destroy();
  const stores = [], create = async () => { const store = new WorldObjectStore({ name: 'test', indexedDBImpl }); stores.push(store); await store.open(); return store; };
  t.after(() => Promise.all(stores.map(store => store.destroy())));
  const a = await create(), b = await create();
  await a.adopt({ ...scope, objectId: 'castle', artifactCid: cids[0], agentId: 'creator', requestId: 'create', requestHash: 'c'.repeat(64) });
  const input = { ...scope, objectId: 'castle', expectedRevision: 0, expectedArtifactCid: cids[0], artifactCid: cids[1],
    agentId: 'editor', requestId: 'resize', requestHash: 'a'.repeat(64) };
  return { a, b, create, cids, input };
}
test('IndexedDB independently opened owners serialize CAS and preserve exact operation receipt across reload', async t => {
  const f = await fixture(t);
  const results = await Promise.allSettled([f.a.commit(f.input), f.b.commit({ ...f.input, artifactCid: f.cids[2], requestId: 'other', requestHash: 'b'.repeat(64) })]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(results.filter(result => result.status === 'rejected')[0].reason.code, 'ERR_WORLD_OBJECT_CONFLICT');
  const winner = results.find(result => result.status === 'fulfilled').value;
  await f.a.destroy(); await f.b.destroy(); const restored = await f.create();
  const head = await restored.get(scope, 'castle'); assert.equal(head.revision, 1); assert.equal(head.artifactCid, winner.head.artifactCid);
  const op = await restored.operation(scope, winner.operation.requestId); assert.deepEqual(op, winner.operation);
  const replayInput = winner.operation.requestId === 'resize' ? f.input : { ...f.input, artifactCid: f.cids[2], requestId: 'other', requestHash: 'b'.repeat(64) };
  const replay = await restored.commit(replayInput); assert.equal(replay.replayed, true); assert.equal(replay.head.revision, 1);
  await assert.rejects(restored.commit({ ...replayInput, requestHash: 'f'.repeat(64) }), /changed/);
});
test('transaction-time authority checks roll back both head and operation; deletion tombstone prevents old manifest adoption', async t => {
  const f = await fixture(t);
  let checks = 0;
  await assert.rejects(f.a.commit(f.input, { isCurrent: () => { checks++; return false; } }), { name: 'AbortError' });
  assert.equal(checks, 1); assert.equal((await f.a.get(scope, 'castle')).revision, 0);
  assert.equal(await f.a.operation(scope, 'resize'), undefined);
  await f.a.commit({ ...f.input, deleted: true });
  const adopted = await f.b.adopt({ ...scope, objectId: 'castle', artifactCid: f.cids[0] });
  assert.equal(adopted.deleted, true); assert.equal(adopted.revision, 1);
  await assert.rejects(f.b.commit({ ...f.input, expectedRevision: 1, expectedArtifactCid: f.cids[1], requestId: 'late' }), /changed/);
  assert.equal((await f.b.list({ ...scope, worldId: 'other' })).length, 0);
});
test('a later valid revision cannot make an old operation apply twice', async t => {
  const f = await fixture(t); await f.a.commit(f.input);
  await f.b.commit({ ...f.input, expectedRevision: 1, expectedArtifactCid: f.cids[1], artifactCid: f.cids[2], requestId: 'second', requestHash: 'b'.repeat(64) });
  const replay = await f.a.commit(f.input);
  assert.equal(replay.operation.revision, 1); assert.equal(replay.head.revision, 2); assert.equal(replay.head.artifactCid, f.cids[2]);
});
