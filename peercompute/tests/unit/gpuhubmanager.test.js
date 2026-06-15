import test from 'node:test';
import assert from 'node:assert/strict';
import { GPUHubManager } from '../../src/peercompute/gpu/GPUHubManager.js';

test('GPUHubManager initializes with provided device and creates hot buffers', async () => {
  let createArgs = null;
  const fakeDevice = {
    createBuffer: (opts) => {
      createArgs = opts;
      return { ...opts, id: 'buf-1' };
    }
  };

  const hub = new GPUHubManager();
  await hub.initialize({ device: fakeDevice });

  const buffer = hub.createHotBuffer('hot:buf', 64, 0x20, 'hot-buffer');
  assert.equal(buffer.id, 'buf-1');
  assert.equal(hub.getHotBuffer('hot:buf'), buffer);
  assert.deepEqual(createArgs, { size: 64, usage: 0x20, label: 'hot-buffer' });
});

test('GPUHubManager supports hot buffer sets', () => {
  const hub = new GPUHubManager();
  const buffers = { positions: { id: 'p' }, velocities: { id: 'v' } };
  hub.registerHotBufferSet('task-1', buffers);
  assert.deepEqual(hub.getHotBufferSet('task-1'), buffers);
});

test('GPUHubManager registers and executes resident stage executors', async () => {
  const fakeDevice = { label: 'gpu-device:test' };
  const hub = new GPUHubManager();
  hub.setDevice(fakeDevice);

  const descriptor = hub.registerResidentStageExecutor({
    stageId: 'mechanics-p2g',
    lawNodeId: 'ulg-mls-mpm-mechanics-law',
    metadata: { family: 'mechanics' },
    executor({ stage, input, device, gpuHub, executor }) {
      return {
        value: {
          ...input,
          stageId: stage.id,
          deviceLabel: device.label,
          hotStoreSame: gpuHub.getHotStore() === hub.getHotStore(),
          executorStageId: executor.stageId
        },
        retainedBufferRefs: ['mls-mpm-p2g-grid-buffer'],
        summary: { backend: 'webgpu' }
      };
    }
  });

  assert.equal(descriptor.schema, 'peercompute.gpu.resident-stage-executor.v0');
  assert.equal(descriptor.stageId, 'mechanics-p2g');
  assert.equal(descriptor.lawNodeId, 'ulg-mls-mpm-mechanics-law');
  assert.equal(hub.hasResidentStageExecutor({ id: 'mechanics-p2g' }), true);
  assert.equal(hub.hasResidentStageExecutor({ id: 'other', lawNodeId: 'ulg-mls-mpm-mechanics-law' }), true);
  assert.deepEqual(hub.listResidentStageExecutors().map((entry) => entry.stageId), ['mechanics-p2g']);

  const result = await hub.executeResidentStage({
    stage: { id: 'mechanics-p2g' },
    input: { particleCount: 4 }
  });
  assert.deepEqual(result.value, {
    particleCount: 4,
    stageId: 'mechanics-p2g',
    deviceLabel: 'gpu-device:test',
    hotStoreSame: true,
    executorStageId: 'mechanics-p2g'
  });
  assert.deepEqual(result.retainedBufferRefs, ['mls-mpm-p2g-grid-buffer']);
  assert.deepEqual(result.summary, { backend: 'webgpu' });
});
