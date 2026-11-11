import test from 'node:test';
import assert from 'node:assert/strict';
import { TRIPOSR, foregroundBounds, rgbaToTripoInput, sampleTriplane, tripoGridPoints,
  extractTripoSurface, orientTripoMesh, tripoColorsToLinear } from '../../src/peercompute/inference/mesh/geometry.js';

test('foreground framing and straight-alpha grey compositing preserve transparent pixels', () => {
  const data = new Uint8Array(3 * 2 * 4); data.set([255, 0, 0, 255], 4);
  assert.deepEqual(foregroundBounds({ width: 3, height: 2, data }), { x: 1, y: 0, width: 1, height: 1 });
  assert.throws(() => foregroundBounds({ width: 1, height: 1, data: new Uint8Array(4) }), /no visible/);
  const rgba = new Uint8Array(512 * 512 * 4); rgba.set([255, 0, 0, 255]);
  const input = rgbaToTripoInput(rgba); assert.equal(input[0], 1); assert.equal(input[512 ** 2], 0);
  assert.equal(input[1], 0.5); assert.equal(input[512 ** 2 + 1], 0.5);
});

test('triplane interpolation has correct xy/xz/yz order, channel order and zero padding', () => {
  const planes = new Float32Array(3 * 40 * 64 * 64);
  for (let p = 0; p < 3; p++) for (let c = 0; c < 40; c++) {
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) planes[(p * 40 + c) * 4096 + y * 64 + x] = p * 10000 + c * 1000 + y * 10 + x;
  }
  const features = sampleTriplane(planes, new Float32Array([0, 0, 0]));
  assert.equal(features[0], 346.5); assert.equal(features[1], 1346.5);
  assert.equal(features[40], 10346.5); assert.equal(features[80], 20346.5);
  planes.fill(1);
  const boundary = sampleTriplane(planes, new Float32Array([-TRIPOSR.radius, -TRIPOSR.radius, -TRIPOSR.radius]));
  assert(Math.abs(boundary[0] - .25) < 1e-6, 'align_corners=false uses quarter border weight, not clamping');
  assert.throws(() => sampleTriplane(planes, new Float32Array([NaN, 0, 0])), /non-finite/);
});

test('query grid includes both exact reference endpoints and uses x-fast order', () => {
  const points = tripoGridPoints(4, 0, 64);
  assert(Math.abs(points[0] + .87) < 1e-6); assert(Math.abs(points.at(-1) - .87) < 1e-6);
  assert(points[3] > points[0]); assert.equal(points[4], points[1]);
  assert.throws(() => tripoGridPoints(4, 63, 2));
});

test('mesh extraction reconstructs an independently defined density sphere and rejects invalid fields', () => {
  const n = 20, field = new Float32Array(n ** 3);
  for (let z = 0; z < n; z++) for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const d = ((x / (n - 1) * 2 - 1) ** 2 + (y / (n - 1) * 2 - 1) ** 2 + (z / (n - 1) * 2 - 1) ** 2);
    field[x + n * y + n * n * z] = 50 - 100 * d;
  }
  const mesh = extractTripoSurface(field, n); assert(mesh.indices.length > 100);
  const maxRadius = mesh.positions.reduce((max, _, i) => i % 3 ? max : Math.max(max, Math.hypot(...mesh.positions.subarray(i, i + 3))), 0);
  assert(Math.abs(maxRadius - .435) < .02);
  assert(mesh.normals.every(Number.isFinite));
  for (let i = 0; i < mesh.normals.length; i += 3) assert(Math.abs(Math.hypot(...mesh.normals.subarray(i, i + 3)) - 1) < 1e-6);
  orientTripoMesh(mesh); assert(mesh.positions.every(Number.isFinite));
  field[1] = Infinity; assert.throws(() => extractTripoSurface(field, n), /non-finite/);
  assert.throws(() => extractTripoSurface(new Float32Array(8 ** 3), 8), /No solid/);
});

test('model RGB colors become linear glTF vertex colors exactly once', () => {
  const result = tripoColorsToLinear(new Float32Array([0, .5, 1]));
  assert.equal(result[0], 0); assert(Math.abs(result[1] - .21404114) < 1e-6); assert.equal(result[2], 1);
});
