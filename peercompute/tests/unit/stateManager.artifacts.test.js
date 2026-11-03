import test from 'node:test';
import assert from 'node:assert/strict';
import { StateManager } from '../../src/peercompute/stateManager/StateManager.js';
import { NodeKernel } from '../../src/peercompute/nodeKernel/NodeKernel.js';

test('StateManager owns binary storage without putting blocks or manifests in Yjs', async () => {
  const state = new StateManager(null, { enablePersistence: false, disableNetworkProvider: true });
  const store = state.createArtifactStore({ persistent: false });
  await store.open();
  const file = await store.importFile(new Uint8Array([1, 2, 3]), { pin: true });
  assert.equal(state.getArtifactStore(), store);
  assert.equal(state.getStats().artifactStoreCount, 1);
  assert.equal(state.getStats().artifactStoredBytes, 3);
  assert.deepEqual(state.ydoc.toJSON(), { state: {} });
  assert.throws(() => state.createArtifactStore({ persistent: false }), /already registered/);
  assert.equal((await state.ensureArtifact(file.cid)).status, 'complete');
  await state.destroy();
  assert.equal(store.destroyed, true);
  assert.equal(state.getArtifactStore(), null);
  assert.throws(() => state.createArtifactStore({ persistent: false }), /destroyed/);
});

test('StateManager binds network block requests to the complete artifact root', async () => {
  const sourceState = new StateManager(null);
  const source = sourceState.createArtifactStore({ persistent: false });
  await source.open();
  const file = await source.importFile(new Uint8Array(300_001).fill(42));
  const requests = [];
  const destination = new StateManager({ getLibp2pNode: () => null,
    async fetchArtifactBlock(cid, options) {
      requests.push({ cid: String(cid), root: options.artifactCid });
      const chunks = [];
      for await (const chunk of source.getBlockstore().get(cid)) chunks.push(chunk);
      return chunks[0];
    }
  });
  const store = destination.createArtifactStore({ persistent: false });
  await store.open();
  await destination.ensureArtifact(file.cid);
  assert.ok(requests.length > 1);
  assert.ok(requests.every((request) => request.root === file.cid));
  let length = 0;
  for await (const chunk of store.openRead(file.cid)) length += chunk.length;
  assert.equal(length, 300_001);
  await Promise.all([destination.destroy(), sourceState.destroy()]);
});

test('StateManager attempts every cleanup when an artifact backend fails to close', async () => {
  const state = new StateManager(null);
  const store = state.createArtifactStore({ persistent: false });
  let providerClosed = false;
  let documentClosed = false;
  state.ydoc.on('destroy', () => { documentClosed = true; });
  store.destroy = async () => { throw new Error('backend close failed'); };
  state.indexeddbProvider = { destroy() { providerClosed = true; } };
  await assert.rejects(state.destroy(), /StateManager cleanup failed/);
  assert.equal(providerClosed, true);
  assert.equal(documentClosed, true);
});

test('NodeKernel retains storage and manager handles until worker termination is acknowledged', async () => {
  const kernel = new NodeKernel({ enablePersistence: false });
  const events = [];
  let fail = true;
  const compute = { async destroy() { events.push('compute'); if (fail) throw new Error('Worker still alive'); } };
  const network = { async disconnect() { events.push('network'); } };
  const state = { async destroy() { events.push('state'); } };
  Object.assign(kernel, { computeManager: compute, networkManager: network, stateManager: state });
  await assert.rejects(kernel._cleanupManagers(), /managers retained for retry/);
  assert.deepEqual(events, ['compute']);
  assert.equal(kernel.computeManager, compute);
  assert.equal(kernel.stateManager, state);
  fail = false;
  await kernel._cleanupManagers();
  assert.deepEqual(events, ['compute', 'compute', 'network', 'state']);
  assert.equal(kernel.stateManager, null);
});
