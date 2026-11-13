import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { StateManager } from '../../src/peercompute/stateManager/StateManager.js';
import { ArtifactStore } from '../../src/peercompute/artifacts/ArtifactStore.js';
test('StateManager owns object store lifetime while retained CAS heads survive reopening', async () => {
  const indexedDBImpl = new IDBFactory(), manager = new StateManager();
  const artifacts = new ArtifactStore({ persistent: false }); await artifacts.open();
  const { cid } = await artifacts.importFile(new Uint8Array([1])); await artifacts.destroy();
  const store = manager.createWorldObjectStore({ name: 'owned', indexedDBImpl }); await store.open();
  assert.equal(manager.getWorldObjectStore('owned'), store);
  assert.throws(() => manager.createWorldObjectStore({ name: 'owned' }), /registered/);
  const scope = { worldId: 'world', ownerHostId: 'host' };
  await store.adopt({ ...scope, objectId: 'castle', artifactCid: cid });
  await manager.destroy(); assert.equal(store.closed, true); assert.equal(manager.getWorldObjectStore('owned'), null);
  assert.throws(() => manager.createWorldObjectStore(), /destroyed/);
  const reopened = new StateManager(), retained = reopened.createWorldObjectStore({ name: 'owned', indexedDBImpl });
  await retained.open(); assert.equal((await retained.get(scope, 'castle')).artifactCid, cid); await reopened.destroy();
});
