import test from 'node:test';
import assert from 'node:assert/strict';
import { FOREGROUND_SIZE, validateMeshImage, hasForegroundAlpha, requireForegroundAlpha,
  normalizeForegroundPixels, prepareForegroundInput, applyForegroundMask } from '../../src/peercompute/inference/mesh/imagePreparation.js';
import { foregroundBounds } from '../../src/peercompute/inference/mesh/geometry.js';

const size = FOREGROUND_SIZE;
function image(color = [255, 255, 255, 255]) {
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < data.length; i += 4) data.set(color, i);
  return { width: size, height: size, channels: 4, data };
}
const at = (x, y) => (y * size + x) * 4;
function mask() {
  const data = new Float32Array(size * size).fill(.2);
  for (let y = 80; y < 240; y++) for (let x = 100; x < 220; x++) data[y * size + x] = .8;
  return data;
}
// These numerical tests use same-size canvases, so they test reference mask
// quantization/compositing without substituting a resampling implementation.
function canvas(width, height) {
  let pixels;
  const context = { putImageData(value) { assert.equal(value.width, width); assert.equal(value.height, height); pixels = new Uint8ClampedArray(value.data); },
    drawImage(source, x, y, w, h) { assert.equal(source.width, width); assert.equal(source.height, height);
      assert.deepEqual([x, y, w, h], [0, 0, width, height]); pixels = source.getContext('2d').getImageData().data; },
    getImageData() { return { data: new Uint8ClampedArray(pixels) }; } };
  return { width, height, getContext: () => context };
}
function withPixels(t) {
  const previous = globalThis.ImageData;
  globalThis.ImageData = class { constructor(data, width, height) { Object.assign(this, { data, width, height }); } };
  t.after(() => { if (previous) globalThis.ImageData = previous; else delete globalThis.ImageData; });
}

test('real alpha margins bypass segmentation unchanged, while a nearly opaque PNG does not', () => {
  const cutout = image();
  assert.equal(hasForegroundAlpha(cutout), false);
  cutout.data[3] = 254; assert.equal(hasForegroundAlpha(cutout), false);
  cutout.data[3] = 0; assert.equal(hasForegroundAlpha(cutout), false);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    if (x < 20 || y < 20 || x >= size - 20 || y >= size - 20) cutout.data[at(x, y) + 3] = 0;
  }
  const original = cutout.data.slice();
  assert.equal(hasForegroundAlpha(cutout), true); assert.equal(requireForegroundAlpha(cutout), cutout);
  assert.deepEqual(cutout.data, original);
  assert.throws(() => requireForegroundAlpha(image()), error => error.code === 'ERR_MESH_FOREGROUND' && /current TripoSR/.test(error.message));
});

test('RGB maximum normalization matches the reference channel values and handles black without NaN', t => {
  withPixels(t);
  const source = image([100, 50, 25, 128]), original = source.data.slice();
  const normalized = prepareForegroundInput(source, { canvas }), n = size * size;
  assert.equal(normalized.length, n * 3);
  assert(Math.abs(normalized[0] - (1 - .485) / .229) < 1e-6);
  assert(Math.abs(normalized[n] - (.5 - .456) / .224) < 1e-6);
  assert(Math.abs(normalized[2 * n] - (.25 - .406) / .225) < 1e-6);
  assert.deepEqual(source.data, original, 'RGB conversion never changes caller alpha');
  const black = normalizeForegroundPixels(image([0, 0, 0, 255]).data);
  assert(black.every(Number.isFinite)); assert(Math.abs(black[0] + .485 / .229) < 1e-6);
});

test('learned masks retain white, gray and black subjects and remove enclosed background without color keying', t => {
  withPixels(t);
  for (const color of [[255, 255, 255, 255], [128, 128, 128, 255], [0, 0, 0, 255]]) {
    const source = image(color), original = source.data.slice(), prediction = mask();
    prediction[150 * size + 150] = .2;
    const result = applyForegroundMask(source, prediction, { canvas });
    assert.equal(result.data[at(0, 0) + 3], 0);
    assert.equal(result.data[at(150, 150) + 3], 0, 'enclosed gap is still background');
    assert.deepEqual([...result.data.subarray(at(120, 120), at(120, 120) + 4)], color);
    assert.deepEqual(foregroundBounds(result), { x: 100, y: 80, width: 120, height: 160 });
    assert.deepEqual(source.data, original);
  }
});

test('mask alpha multiplies supplied alpha and validates predictions before allocating canvas surfaces', t => {
  withPixels(t);
  const source = image(), prediction = mask();
  source.data[at(120, 120) + 3] = 128; prediction[120 * size + 120] = .5;
  const result = applyForegroundMask(source, prediction, { canvas });
  assert.equal(result.data[at(120, 120) + 3], 64);
  const neverCanvas = () => { throw new Error('should not allocate'); };
  for (const bad of [new Float32Array(size * size).fill(.5), new Float32Array(size * size - 1),
    Object.assign(mask(), { 7: NaN }), Object.assign(mask(), { 7: Infinity }), Object.assign(mask(), { 7: -1 }), Object.assign(mask(), { 7: 2 })]) {
    assert.throws(() => applyForegroundMask(source, bad, { canvas: neverCanvas }), error => error.code === 'ERR_MESH_FOREGROUND');
  }
});

test('a mask with no isolated foreground or no background margin is actionable, not a fabricated cutout', t => {
  withPixels(t);
  const nearFull = new Float32Array(size * size).fill(.8); nearFull[0] = .2;
  assert.throws(() => applyForegroundMask(image(), nearFull, { canvas }), error => error.code === 'ERR_MESH_FOREGROUND');
  assert.throws(() => applyForegroundMask(image([255, 0, 0, 0]), mask(), { canvas }), error => error.code === 'ERR_MESH_FOREGROUND');
});

test('input sizes and byte representation are bounded before foreground work', () => {
  for (const bad of [{ width: 4097, height: 4096, data: new Uint8Array(0) },
    { width: 1.5, height: 1, data: new Uint8Array(4) }, { width: 1, height: 1, data: new Float32Array(4) },
    { width: 0, height: 1, data: new Uint8Array(0) }, { width: 1, height: 1, data: new Uint8Array(3) }]) {
    assert.throws(() => validateMeshImage(bad), /bounded RGBA/);
  }
  assert.throws(() => normalizeForegroundPixels(new Uint8Array(4)), /320/);
});
