import test from 'node:test';
import assert from 'node:assert/strict';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';
import { WASM_ADD_BYTES, WASM_MEMORY_BYTES } from '../fixtures/wasmFixtures.js';

const adapterModuleUrl = new URL('../fixtures/wasmCommitAdapter.js', import.meta.url).toString();
const hybridModuleUrl = new URL('../fixtures/wasmWebGpuTask.js', import.meta.url).toString();

test('ComputeManager executes wasm tasks with memory input and output views', async () => {
  const manager = new ComputeManager({ enableWorkers: false });

  const result = await manager.submitTask({
    runtime: 'wasm',
    wasm: {
      source: WASM_MEMORY_BYTES,
      entry: 'scaleFirst',
      args: [4],
      inputViews: [
        {
          name: 'input',
          dataKey: 'input',
          view: 'Int32Array',
          byteOffset: 0
        }
      ],
      outputViews: [
        {
          name: 'scaled',
          view: 'Int32Array',
          byteOffset: 0,
          length: 1
        }
      ]
    },
    data: {
      input: [7]
    }
  });

  assert.ok(result.scaled instanceof Int32Array);
  assert.equal(result.scaled[0], 28);
});

test('ComputeManager applies wasm result adapters and forwards commitDelta', async () => {
  const manager = new ComputeManager({ enableWorkers: false });
  let received = null;
  manager.setCommitDeltaHandler((delta) => {
    received = delta;
  });

  const result = await manager.submitTask({
    runtime: 'wasm',
    wasm: {
      source: WASM_ADD_BYTES,
      entry: 'add',
      args: [5, 6],
      resultModule: adapterModuleUrl,
      resultExport: 'toCommitDelta'
    },
    data: {
      taskId: 'wasm-add',
      scope: 'deltas',
      version: 7
    }
  });

  assert.deepEqual(result, { sum: 11, runtime: 'wasm' });
  assert.deepEqual(received, {
    taskId: 'wasm-add',
    scope: 'deltas',
    version: 7,
    payload: {
      sum: 11,
      runtime: 'wasm'
    }
  });
});

test('ComputeManager executes wasm-webgpu tasks through a host module', async () => {
  const manager = new ComputeManager({ enableWorkers: false });
  let received = null;
  manager.setCommitDeltaHandler((delta) => {
    received = delta;
  });

  const result = await manager.submitTask({
    runtime: 'wasm-webgpu',
    wasm: {
      source: WASM_ADD_BYTES
    },
    module: hybridModuleUrl,
    exportName: 'runWasmWebGPU',
    data: {
      args: [2, 9],
      taskId: 'wasm-webgpu-add'
    }
  });

  assert.deepEqual(result, {
    sum: 11,
    gpuSupported: result.gpuSupported,
    runtime: 'wasm-webgpu'
  });
  assert.equal(typeof result.gpuSupported, 'boolean');
  assert.deepEqual(received, {
    taskId: 'wasm-webgpu-add',
    scope: 'deltas',
    version: 1,
    payload: {
      sum: 11,
      gpuSupported: result.gpuSupported,
      runtime: 'wasm-webgpu'
    }
  });
});
