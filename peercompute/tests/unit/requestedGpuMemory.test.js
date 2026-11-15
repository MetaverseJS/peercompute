import test from 'node:test';
import assert from 'node:assert/strict';
import { observeRequestedGpuMemory } from '../../src/peercompute/inference/RequestedGpuMemory.js';

test('requested buffer high water accounts for explicit destruction, not physical device capacity', () => {
  const device = { createBuffer({ size }) { if (size === -1) throw new Error('allocation failed'); return { size, destroy() {} }; } };
  const original = device.createBuffer, evidence = {}, restore = observeRequestedGpuMemory(device, evidence);
  const a = device.createBuffer({ size: 100 }), b = device.createBuffer({ size: 50 });
  assert.equal(evidence.requestedGpuBufferPeakBytes, 150);
  a.destroy(); a.destroy(); device.createBuffer({ size: 120 });
  assert.equal(evidence.requestedGpuBufferPeakBytes, 170);
  assert.throws(() => device.createBuffer({ size: -1 })); assert.equal(evidence.requestedGpuBufferPeakBytes, 170);
  b.destroy(); restore(); assert.equal(device.createBuffer, original);
});

test('unsupported instrumentation is optional and does not change device behavior', () => {
  const device = Object.freeze({ createBuffer: () => ({}) }), evidence = {};
  observeRequestedGpuMemory(device, evidence)(); assert.deepEqual(evidence, {});
  observeRequestedGpuMemory({}, evidence)(); assert.deepEqual(evidence, {});
});
