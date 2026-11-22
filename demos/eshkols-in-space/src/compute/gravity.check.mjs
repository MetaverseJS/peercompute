// deno run --unstable-webgpu --allow-read src/compute/gravity.check.mjs [--scale]
import assert from 'node:assert/strict';
import { createBodies } from '../../physics/initial.mjs';
import { GPUHubManager } from '../../../../peercompute/src/peercompute/gpu/GPUHubManager.js';
import { createGravity } from './gravity.js';

const shader = (name) => Deno.readTextFile(new URL('../../physics/' + name, import.meta.url));
const [laws, dispatch, build] = await Promise.all([
  shader('laws.wgsl'),
  shader('tree-dispatch.wgsl'),
  shader('tree-build.wgsl'),
]);
const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
if (!adapter) throw new Error('A WebGPU adapter is required.');
const device = await adapter.requestDevice();
const dt = 0.015, softening = 0.18;

async function treeFixture(bodies, targets) {
  const hub = new GPUHubManager();
  await hub.initialize({ device });
  const count = bodies.length / 8;
  const state = [0, 1].map((i) =>
    hub.createHotBuffer(
      'state' + i,
      bodies.byteLength,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
    )
  );
  const settings = hub.createHotBuffer('settings', 32, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
  const copy = hub.createHotBuffer(
    'snapshot',
    targets ? 32 * targets.length : bodies.byteLength,
    GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  );
  device.queue.writeBuffer(state[0], 0, bodies);
  const gravity = await createGravity(hub, count, state, settings, { laws, dispatch, build });
  assert.equal(gravity.mode, 'tree');
  return {
    // Rebuild the field each time from the same immutable checkpoint.
    async evaluate(epoch) {
      const parameters = new ArrayBuffer(32);
      new Uint32Array(parameters).set([count, 0, count, 0]);
      new Float32Array(parameters, 16, 3).set([dt, 1, softening]);
      new Uint32Array(parameters, 28)[0] = epoch;
      device.queue.writeBuffer(settings, 0, parameters);
      const encoder = device.createCommandEncoder();
      gravity.encode(encoder, 0);
      if (targets) {
        targets.forEach((slot, i) => encoder.copyBufferToBuffer(state[1], 32 * slot, copy, 32 * i, 32));
      } else {
        encoder.copyBufferToBuffer(state[1], 0, copy, 0, bodies.byteLength);
      }
      device.queue.submit([encoder.finish()]);
      await copy.mapAsync(GPUMapMode.READ);
      const result = new Float32Array(copy.getMappedRange().slice(0));
      copy.unmap();
      return result;
    },
    dispose() {
      for (const buffer of hub.getHotStore().values()) buffer.destroy();
    },
  };
}

// Independent double-precision direct sum, including the same Plummer softening.
function exactKick(x, y, z, sources) {
  let vx = 0, vy = 0, vz = 0;
  for (let n = 0; n < sources.length; n += 4) {
    const dx = sources[n] - x, dy = sources[n + 1] - y, dz = sources[n + 2] - z;
    const distance2 = dx * dx + dy * dy + dz * dz + softening * softening;
    const factor = dt * sources[n + 3] / (distance2 * Math.sqrt(distance2));
    vx += dx * factor;
    vy += dy * factor;
    vz += dz * factor;
  }
  return [vx, vy, vz];
}

async function checkPointClusters(name, clusters) {
  // Sparse restored checkpoint with both workgroup and leaf-grid boundary cases.
  const count = 16997;
  const initial = new Float32Array(count * 8);
  const totalMass = clusters.map(() => 0);
  for (let j = 0; j < clusters.length * 256; j++) {
    const index = (j * 137 + 5) % count;
    const cluster = j % clusters.length;
    const { position, mass } = clusters[cluster];
    totalMass[cluster] += mass;
    initial.set([...position, mass, 0.125, -0.25, 0.5, 0.03], index * 8);
  }
  const sources = clusters.flatMap(({ position }, index) => [...position, totalMass[index]]);
  const kicks = new Map(clusters.map(({ position }) => [position.join(), exactKick(...position, sources)]));
  const fixture = await treeFixture(initial);
  try {
    const result = await fixture.evaluate(0);
    const repeat = await fixture.evaluate(53);
    for (let n = 0; n < result.length; n += 8) {
      if (initial[n + 3] === 0) {
        for (let k = 0; k < 8; k++) assert.equal(result[n + k], 0, name + ' tombstone');
        continue;
      }
      const kick = kicks.get(initial.subarray(n, n + 3).join());
      for (let k = 0; k < 3; k++) {
        const velocity = initial[n + 4 + k] + kick[k];
        const drifted = initial[n + k] + dt * velocity;
        assert(
          Math.abs(result[n + 4 + k] - velocity) < 5e-5,
          name + ' analytic kick: ' + result[n + 4 + k] + ' vs ' + velocity,
        );
        assert(Math.abs(result[n + k] - drifted) < 5e-5, name + ' kick then drift');
        assert(Math.abs(result[n + 4 + k] - repeat[n + 4 + k]) < 1e-6, name + ' repeated field');
      }
      assert.equal(result[n + 3], initial[n + 3]);
      assert.equal(result[n + 7], initial[n + 7]);
    }
  } finally {
    fixture.dispose();
  }
  console.log(name, 'passed at', count, 'slots with', clusters.length * 256, 'live bodies.');
}

async function checkPreset(preset, distribution, count = 32771) {
  const initial = createBodies({ count, seed: 42, preset, distribution });
  const sources = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) sources.set(initial.subarray(8 * i, 8 * i + 4), 4 * i);
  // In heavy-core worlds explicitly include the central body as a target.
  const targets = count <= 32771
    ? Array.from({ length: 256 }, (_, i) => i * 1789 % count)
    : Array.from({ length: 64 }, (_, i) => Math.floor(i * count / 64));
  let totalMagnitude = 0, totalError = 0;
  const fractions = [];
  const fixture = await treeFixture(initial, targets);
  let elapsed;
  try {
    const start = performance.now();
    const result = await fixture.evaluate(0);
    elapsed = performance.now() - start;
    const repeat = await fixture.evaluate(17);
    for (const [j, i] of targets.entries()) {
      const ref = exactKick(initial[8 * i], initial[8 * i + 1], initial[8 * i + 2], sources);
      const kick = [0, 1, 2].map((k) => result[8 * j + 4 + k] - initial[8 * i + 4 + k]);
      assert(kick.every(Number.isFinite));
      for (let k = 0; k < 3; k++) {
        assert(
          Math.abs(result[8 * j + 4 + k] - repeat[8 * j + 4 + k]) < 2e-5,
          'Holding positions fixed should retain the same tree field.',
        );
      }
      const error = Math.hypot(...kick.map((x, k) => x - ref[k]));
      const magnitude = Math.hypot(...ref);
      fractions.push(error / Math.max(1e-12, magnitude));
      totalMagnitude += magnitude;
      totalError += error;
    }
  } finally {
    fixture.dispose();
  }
  const ratio = totalError / totalMagnitude;
  fractions.sort((a, b) => a - b);
  console.log(
    preset,
    distribution,
    count,
    'bodies,',
    targets.length,
    'targets, seed 42,',
    Math.round(elapsed),
    'ms for tree step and diagnostic copies:',
    (100 * ratio).toFixed(3) + '% aggregate kick error,',
    (100 * fractions[Math.floor(0.95 * fractions.length)]).toFixed(3) + '% p95 relative kick error.',
  );
  assert(ratio < 0.08, preset + ' ' + distribution + ' aggregate kick error ratio ' + ratio);
}

try {
  console.log('Adapter:', adapter.info.description);
  await checkPointClusters('All slots absorbed', []);
  await checkPointClusters('Coincident group away from the origin', [{ position: [32, -16, 8], mass: 0.5 }]);
  await checkPointClusters('Shifted unequal point masses', [
    { position: [26, -16, 8], mass: 1 },
    { position: [38, -16, 8], mass: 0.25 },
  ]);
  await checkPointClusters('Symmetric field around a central probe', [
    { position: [-4, 0, 0], mass: 1 },
    { position: [4, 0, 0], mass: 1 },
    { position: [0, 0, 0], mass: 0.03125 },
  ]);
  await checkPreset('disk', 'spectrum');
  await checkPreset('sphere', 'equal');
  await checkPreset('binary', 'heavy');
  if (Deno.args.includes('--scale')) await checkPreset('disk', 'spectrum', 2_000_000);
} finally {
  device.destroy();
}
