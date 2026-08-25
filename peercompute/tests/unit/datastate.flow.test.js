import test from 'node:test';
import assert from 'node:assert/strict';
import { StateManager } from '../../src/peercompute/stateManager/StateManager.js';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';

test('ComputeManager commitDelta flows into StateManager warm layer', async () => {
  const stateManager = new StateManager(null, {
    enablePersistence: false,
    disableNetworkProvider: true,
    disableBroadcast: true
  });
  await stateManager.initialize();

  const computeManager = new ComputeManager({ enableWorkers: false });
  computeManager.setCommitDeltaHandler((delta) => stateManager.commitDelta(delta));

  const result = await computeManager.submitTask({
    fn: () => ({
      commitDelta: { taskId: 'task-flow', payload: { value: 99 }, version: 1 },
      value: 'done'
    })
  });

  assert.equal(result, 'done');
  const stored = stateManager.getDataState().readWarm('task-flow', 'deltas');
  assert.deepEqual(stored, { version: 1, payload: { value: 99 }, ts: stored.ts });
  assert.equal(typeof stored.ts, 'number');
});

test('DataState local artifact registry aggregates only redacted bounded statistics', async () => {
  const stateManager = new StateManager(null, {
    enablePersistence: false,
    disableNetworkProvider: true,
    disableBroadcast: true
  });
  const dataState = stateManager.getDataState();
  let destroyed = 0;
  const cache = {
    getStats: () => ({ entries: 3, residentBytes: 768, pending: 1 }),
    destroy: async () => { destroyed += 1; }
  };

  assert.equal(dataState.registerLocalArtifactCache('terrain-local', cache), cache);
  assert.equal(dataState.getLocalArtifactCache('terrain-local'), cache);
  assert.deepEqual(dataState.getLocalArtifactCacheStats(), {
    caches: 1,
    entries: 3,
    residentBytes: 768,
    pending: 1
  });
  assert.equal('terrain-local' in dataState.getLocalArtifactCacheStats(), false);
  await dataState.destroyLocalArtifactCaches();
  assert.equal(destroyed, 1);
  assert.equal(dataState.getLocalArtifactCache('terrain-local'), null);
  await stateManager.destroy();
});
