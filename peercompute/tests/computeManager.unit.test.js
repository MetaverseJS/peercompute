import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ComputeManager } from '../src/peercompute/computeManager/ComputeManager.js';

test('ComputeManager executes inline tasks when workers disabled', async () => {
  try {
    const cm = new ComputeManager({ enableWorkers: false, maxWorkers: 1 });
    await cm.initialize();
    const result = await cm.submitTask({
      fn: (data) => data.a + data.b,
      data: { a: 2, b: 3 }
    });
    assert.equal(result, 5);
  } catch (err) {
    console.error(err);
    throw err;
  }
});

test('ComputeManager executes module task inline', async () => {
  try {
    const cm = new ComputeManager({ enableWorkers: false, maxWorkers: 1 });
    await cm.initialize();
    const moduleUrl = new URL('./fixtures/addModule.js', import.meta.url).toString();
    const result = await cm.submitTask({
      module: moduleUrl,
      exportName: 'add',
      data: { a: 4, b: 6 }
    });
    assert.equal(result, 10);
  } catch (err) {
    console.error(err);
    throw err;
  }
});
