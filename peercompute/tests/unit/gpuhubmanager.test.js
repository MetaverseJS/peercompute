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
