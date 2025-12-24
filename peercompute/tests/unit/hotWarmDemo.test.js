import test from 'node:test';
import assert from 'node:assert/strict';
import { GPUHubManager } from '../../src/peercompute/gpu/GPUHubManager.js';
import { StateManager } from '../../src/peercompute/stateManager/StateManager.js';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';
import { runHotWarmDemo } from '../../src/peercompute/gpu/demo/HotWarmDemo.js';

test('HotWarm demo registers hot buffer and commits warm delta', async () => {
  const fakeDevice = {
    createBuffer: ({ size, usage, label }) => ({ size, usage, label, id: 'demo-buf' })
  };
  const hub = new GPUHubManager();
  await hub.initialize({ device: fakeDevice });

  const stateManager = new StateManager(null, {
    enablePersistence: false,
    disableNetworkProvider: true,
    disableBroadcast: true
  });
  await stateManager.initialize();

  const computeManager = new ComputeManager({ enableWorkers: false });
  computeManager.setCommitDeltaHandler((delta) => stateManager.commitDelta(delta));

  const result = await runHotWarmDemo({
    gpuHub: hub,
    stateManager,
    computeManager
  });

  assert.equal(result.hotKeys, 1);
  assert.ok(result.warm.demo);
  assert.equal(result.warm.demo.payload.status, 'ok');
});
