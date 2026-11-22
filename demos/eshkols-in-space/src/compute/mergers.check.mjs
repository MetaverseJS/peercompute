// deno run --unstable-webgpu --allow-read src/compute/mergers.check.mjs [--scale]
import assert from 'node:assert/strict';
import { createBodies } from '../../physics/initial.mjs';
import { GPUHubManager } from '../../../../peercompute/src/peercompute/gpu/GPUHubManager.js';
import { createMerger } from './mergers.js';

const root = new URL('../../physics/', import.meta.url);
const shader = await Deno.readTextFile(new URL('laws.wgsl', root)) + '\n' +
  await Deno.readTextFile(new URL('mergers.wgsl.in', root));
const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
if (!adapter) throw new Error('A WebGPU adapter is required.');
const device = await adapter.requestDevice();
console.log('Adapter:', adapter.info.description);
async function run(bodies, expectedLive, readBodies) {
  const count = bodies.length / 8;
  const hub = new GPUHubManager();
  await hub.initialize({ device });
  const storage = hub.createHotBuffer(
    'bodies',
    bodies.byteLength,
    GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
  );
  device.queue.writeBuffer(storage, 0, bodies);
  try {
    const merger = await createMerger(hub, count, shader);
    const start = performance.now();
    const encoder = device.createCommandEncoder();
    merger.encode(encoder, storage);
    const snapshot = readBodies &&
      hub.createHotBuffer('copy', bodies.byteLength, GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ);
    if (snapshot) encoder.copyBufferToBuffer(storage, 0, snapshot, 0, bodies.byteLength);
    device.queue.submit([encoder.finish()]);
    const live = await merger.readLiveCount();
    if (expectedLive !== undefined) assert.equal(live, expectedLive, '4-byte live count');
    else assert(live >= Math.ceil(count / 2) && live < count);
    console.log(count, 'slots,', live, 'live,', Math.round(performance.now() - start), 'ms');
    if (snapshot) {
      await snapshot.mapAsync(GPUMapMode.READ);
      const result = new Float32Array(snapshot.getMappedRange().slice(0));
      snapshot.unmap();
      return result;
    }
  } finally {
    for (const buffer of hub.getHotStore().values()) buffer.destroy();
  }
}

function compareToBruteForce(count, coincident = false) {
  const source = new Float32Array(count * 8);
  for (let i = 0; i < count; i++) {
    const xyz = [13 * i % 79, 37 * i % 53, 29 * i % 71].map((x) => coincident ? 0 : (x - 32) / 24);
    source.set([...xyz, i % 41 === 0 ? 0 : 1 + i % 7, 0, 0, 0, (1 << (i % 8)) / 220], 8 * i);
  }
  const partner = new Int32Array(count).fill(-1);
  const expected = Array.from({ length: count }, (_, i) => source[8 * i + 3]);
  for (let i = 0; i < count; i++) {
    const a = i * 8;
    if (source[a + 3] === 0) continue;
    for (let j = 0; j < count; j++) {
      if (i === j || source[8 * j + 3] === 0) continue;
      const b = j * 8;
      const d = Math.hypot(
        source[a] - source[b],
        source[a + 1] - source[b + 1],
        source[a + 2] - source[b + 2],
      );
      if (d <= source[a + 7] + source[b + 7]) {
        partner[i] = j;
        break;
      }
    }
  }
  for (let i = 0; i < count; i++) {
    const j = partner[i];
    if (j > i && partner[j] === i) {
      expected[i] += expected[j];
      expected[j] = 0;
    }
  }
  return run(source, expected.filter((mass) => mass > 0).length, true).then((actual) => {
    assert.deepEqual(expected, Array.from({ length: count }, (_, i) => actual[8 * i + 3]));
  });
}

try {
  await compareToBruteForce(1);
  await compareToBruteForce(137);
  await compareToBruteForce(2049);
  await compareToBruteForce(331, true);
  if (Deno.args.includes('--scale')) {
    const count = 2_000_000;
    const source = new Float32Array(count * 8);
    const pairs = Math.floor((count - 1) / 257);
    for (let i = 0; i < count; i++) {
      const cell = i > 0 && i % 257 === 0 ? i - 1 : i;
      const n = i * 8;
      source[n] = cell % 128;
      source[n + 1] = Math.floor(cell / 128) % 128;
      source[n + 2] = Math.floor(cell / 16384);
      source[n + 3] = 1;
      source[n + 7] = 0.02;
    }
    await run(source, count - pairs, false);
    for (const distribution of ['spectrum', 'heavy']) {
      const initial = createBodies({ count, seed: 42, preset: 'disk', distribution });
      console.log('Spiral disk,', distribution);
      await run(initial, undefined, false);
    }
  }
} finally {
  device.destroy();
}
