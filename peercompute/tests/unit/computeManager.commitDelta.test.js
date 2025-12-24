import test from 'node:test';
import assert from 'node:assert/strict';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';

test('ComputeManager commitDelta handler is invoked for inline tasks', async () => {
  const manager = new ComputeManager({ enableWorkers: false });
  let received = null;
  manager.setCommitDeltaHandler((delta) => {
    received = delta;
  });

  const result = await manager.submitTask({
    fn: () => ({
      commitDelta: { taskId: 'task-1', payload: { value: 7 } },
      value: 'ok'
    })
  });

  assert.equal(result, 'ok');
  assert.deepEqual(received, { taskId: 'task-1', payload: { value: 7 } });
});

test('ComputeManager resolves result when no commitDelta is returned', async () => {
  const manager = new ComputeManager({ enableWorkers: false });
  const result = await manager.submitTask({ fn: () => 123 });
  assert.equal(result, 123);
});
