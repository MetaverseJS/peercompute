import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GPUHubManager,
  createResidentStageWorkerBackend
} from '../../src/peercompute/gpu/GPUHubManager.js';

class FakeResidentStageWorker {
  constructor() {
    this.listeners = new Set();
    this.messages = [];
    this.terminated = false;
  }

  addEventListener(type, listener) {
    if (type === 'message') this.listeners.add(listener);
  }

  removeEventListener(type, listener) {
    if (type === 'message') this.listeners.delete(listener);
  }

  postMessage(message) {
    this.messages.push(message);
    queueMicrotask(() => {
      const payload = message.payload || {};
      this.emit({
        type: 'resident-stage-result',
        id: message.id,
        result: {
          value: {
            ...payload.input,
            stageId: payload.stage.id,
            workerBridge: true
          },
          retainedBufferRefs: ['worker-retained-buffer'],
          summary: { protocol: message.type }
        }
      });
    });
  }

  emit(data) {
    for (const listener of this.listeners) listener({ data });
  }

  terminate() {
    this.terminated = true;
  }
}

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
  assert.equal(descriptor.workerPolicy.schema, 'peercompute.gpu.resident-stage-worker-policy.v0');
  assert.equal(descriptor.workerPolicy.mode, 'inline');
  assert.equal(descriptor.workerPolicy.status, 'inline-ready');
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

test('GPUHubManager records requested resident worker policy without overclaiming execution', () => {
  const hub = new GPUHubManager();
  const descriptor = hub.registerResidentStageExecutor({
    stageId: 'mechanics-grid-update',
    lawNodeId: 'ulg-mls-mpm-mechanics-grid-update-stage',
    runtimeTarget: 'gpu-hub-resident-stage-worker',
    workerPolicy: {
      mode: 'dedicated-worker',
      workerType: 'webgpu-compute-worker',
      workerModuleUrl: '/workers/ulg-mechanics-grid-update-worker.js',
      startupMode: 'warm-on-first-use',
      idleTtlMs: 120000,
      sameDeviceRequired: true
    },
    executor() {
      return { value: { ok: true } };
    }
  });

  assert.equal(descriptor.workerPolicy.schema, 'peercompute.gpu.resident-stage-worker-policy.v0');
  assert.equal(descriptor.workerPolicy.mode, 'dedicated-worker');
  assert.equal(descriptor.workerPolicy.status, 'blocked-worker-backend-missing');
  assert.equal(descriptor.workerPolicy.workerType, 'webgpu-compute-worker');
  assert.equal(descriptor.workerPolicy.workerModuleUrl, '/workers/ulg-mechanics-grid-update-worker.js');
  assert.equal(descriptor.workerPolicy.startupMode, 'warm-on-first-use');
  assert.equal(descriptor.workerPolicy.idleTtlMs, 120000);
  assert.equal(descriptor.workerPolicy.sameDeviceRequired, true);
  assert.equal(descriptor.workerPolicy.bufferTransferPolicy, 'worker-owns-device-and-retained-buffers-required');
  assert.equal(descriptor.workerPolicy.fallbackRuntimeTarget, 'gpu-hub-inline-stage-executor');
});

test('GPUHubManager executes a resident stage through an attached worker backend', async () => {
  const hub = new GPUHubManager();
  const descriptor = hub.registerResidentStageExecutor({
    stageId: 'mechanics-g2p',
    workerPolicy: {
      mode: 'dedicated-worker',
      workerType: 'webgpu-compute-worker',
      workerModuleUrl: '/workers/ulg-mechanics-g2p-worker.js'
    },
    workerRunner: {
      async runStage({ stage, input, executor }) {
        return {
          value: {
            ...input,
            stageId: stage.id,
            workerRan: true,
            workerStatus: executor.workerPolicy.status
          },
          retainedBufferRefs: ['sph-state-buffer'],
          summary: { backend: 'webgpu-worker' }
        };
      }
    }
  });

  assert.equal(descriptor.runtimeTarget, 'gpu-hub-resident-stage-worker');
  assert.equal(descriptor.workerPolicy.status, 'worker-ready');
  assert.equal(descriptor.workerPolicy.fallbackRuntimeTarget, null);

  const result = await hub.executeResidentStage({
    stage: { id: 'mechanics-g2p' },
    input: { particleCount: 2 }
  });
  assert.deepEqual(result.value, {
    particleCount: 2,
    stageId: 'mechanics-g2p',
    workerRan: true,
    workerStatus: 'worker-ready'
  });
  assert.deepEqual(result.retainedBufferRefs, ['sph-state-buffer']);
  assert.deepEqual(result.summary, { backend: 'webgpu-worker' });
});

test('createResidentStageWorkerBackend bridges resident stage messages to a Worker-like host', async () => {
  const fakeWorker = new FakeResidentStageWorker();
  const backend = createResidentStageWorkerBackend({
    workerModuleUrl: '/workers/resident-stage.js',
    workerFactory: () => fakeWorker,
    timeoutMs: 1000
  });
  const hub = new GPUHubManager();
  const descriptor = hub.registerResidentStageExecutor({
    stageId: 'mechanics-worker-bridge',
    workerPolicy: {
      mode: 'dedicated-worker',
      workerModuleUrl: '/workers/resident-stage.js'
    },
    workerRunner: backend
  });

  assert.equal(backend.schema, 'peercompute.gpu.resident-stage-worker-backend.v0');
  assert.equal(descriptor.workerPolicy.status, 'worker-ready');
  assert.equal(descriptor.workerPolicy.workerModuleUrl, '/workers/resident-stage.js');

  const result = await hub.executeResidentStage({
    stage: { id: 'mechanics-worker-bridge' },
    input: { particleCount: 3 }
  });

  assert.equal(fakeWorker.messages.length, 1);
  assert.equal(fakeWorker.messages[0].type, 'run-resident-stage');
  assert.equal(fakeWorker.messages[0].payload.stage.id, 'mechanics-worker-bridge');
  assert.deepEqual(fakeWorker.messages[0].payload.input, { particleCount: 3 });
  assert.deepEqual(result.value, {
    particleCount: 3,
    stageId: 'mechanics-worker-bridge',
    workerBridge: true
  });
  assert.deepEqual(result.retainedBufferRefs, ['worker-retained-buffer']);
  assert.deepEqual(result.summary, { protocol: 'run-resident-stage' });

  backend.dispose();
  assert.equal(fakeWorker.terminated, true);
});
