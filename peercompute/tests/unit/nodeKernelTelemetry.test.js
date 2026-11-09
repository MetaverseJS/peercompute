import test from 'node:test';
import assert from 'node:assert/strict';
import { NodeKernel } from '../../src/peercompute/nodeKernel/NodeKernel.js';

test('NodeKernel forwards telemetry consent and installs a removable live compute provider', async t => {
  const kernel = new NodeKernel({ gameId: 'telemetry-kernel', roomId: 'isolated',
    enableWorkers: false, enableGPUHub: false, enablePersistence: false,
    disableStateNetworkProvider: true, disableStateBroadcast: true,
    enableNetVizDebugTelemetry: false, enableNetVizSessionBroadcast: false,
    enableNetworkTelemetry: false, networkTelemetryPublish: false });
  t.after(() => kernel.stop());
  await kernel.initialize();
  const manager = kernel.getNetworkManager(), service = manager.getNetworkTelemetryService();
  assert.equal(manager.config.enableNetworkTelemetry, false);
  assert.equal(manager.config.networkTelemetryPublish, false);
  assert.equal(service.provider().application, 'telemetry-kernel');
  assert.equal(service.provider().role, 'world');
  const stats = service.provider().compute;
  assert.equal(stats.workerCount, kernel.getComputeManager().getStats().workerCount);
  await kernel.stop();
  assert.equal(service.provider, null);
});

test('attach URL carries the game identity required by scoped snapshots', () => {
  const previousWindow = globalThis.window, previousDocument = globalThis.document;
  globalThis.window = { location: { origin: 'https://example.test' } }; globalThis.document = {};
  try {
    const kernel = new NodeKernel({ gameId: 'cubechat', roomId: 'global', topologyId: 'cubechat' });
    const url = new URL(kernel.getNetVizAttachUrl());
    assert.equal(url.searchParams.get('gameId'), 'cubechat');
    assert.equal(url.searchParams.get('room'), 'global');
  } finally { globalThis.window = previousWindow; globalThis.document = previousDocument; }
});
