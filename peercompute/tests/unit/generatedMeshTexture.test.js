import assert from 'node:assert/strict';
import test from 'node:test';
import { deflateSync } from 'node:zlib';
import { inspectGeneratedMeshTexture, decodeGeneratedMeshTexture, GENERATED_MESH_TEXTURE_LIMITS } from '../../src/peercompute/inference/GeneratedMeshTexture.js';

const PNG = Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAEElEQVR4nGP4z8AARAwQCgAf7gP9i18U1AAAAABJRU5ErkJggg==', 'base64'));
const JPEG = Uint8Array.from(Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAACAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzGiiivgT+oj//2Q==', 'base64'));
function chunk(type, data) {
  const result = Buffer.alloc(data.length + 12); result.writeUInt32BE(data.length); result.write(type, 4); result.set(data, 8);
  let crc = 0xffffffff;
  for (const value of result.subarray(4, -4)) { crc ^= value; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); }
  result.writeUInt32BE((crc ^ 0xffffffff) >>> 0, result.length - 4); return result;
}
function pngHeader(width, height, extra = []) {
  const header = Buffer.from(PNG.subarray(16, 29)); header.writeUInt32BE(width); header.writeUInt32BE(height, 4);
  return new Uint8Array(Buffer.concat([PNG.subarray(0, 8), chunk('IHDR', header), ...extra,
    chunk('IDAT', deflateSync(Buffer.from([0, 255, 0, 0, 255, 0, 0, 0, 255, 0, 0, 255, 0, 0]))), chunk('IEND', Buffer.alloc(0))]));
}

test('PNG and JPEG inspection reads actual bounded image dimensions', () => {
  for (const [data, mimeType] of [[PNG, 'image/png'], [JPEG, 'image/jpeg']]) {
    assert.deepEqual(inspectGeneratedMeshTexture(data, mimeType), { mimeType, width: 2, height: 2, pixels: 4 });
    assert.throws(() => inspectGeneratedMeshTexture(data, mimeType === 'image/png' ? 'image/jpeg' : 'image/png'), /signature/);
  }
});
test('PNG rejects oversized dimensions, broken chunks/checksums, animated and compressed metadata', () => {
  for (const data of [pngHeader(2049, 1), pngHeader(0, 2), pngHeader(2, 0), pngHeader(0xffffffff, 0xffffffff),
    pngHeader(2, 2, [chunk('acTL', Buffer.alloc(8))]), pngHeader(2, 2, [chunk('iCCP', Buffer.alloc(12))]),
    PNG.subarray(0, -1), new Uint8Array([...PNG, 1])]) assert.throws(() => inspectGeneratedMeshTexture(data, 'image/png'), /Invalid generated mesh texture/);
  const bad = PNG.slice(); bad[bad.length - 1] ^= 1;
  assert.throws(() => inspectGeneratedMeshTexture(bad, 'image/png'), /checksum/);
  assert.throws(() => inspectGeneratedMeshTexture(new Uint8Array(GENERATED_MESH_TEXTURE_LIMITS.byteLength + 1), 'image/png'), /byte limit/);
  assert.throws(() => inspectGeneratedMeshTexture(PNG, 'image/svg+xml'), /MIME/);
});
test('JPEG bounds include frame dimensions, scan structure and exact EOF', () => {
  const frame = JPEG.findIndex((value, i) => value === 255 && JPEG[i + 1] === 192);
  const oversized = JPEG.slice(); oversized[frame + 7] = 0xff; oversized[frame + 8] = 0xff;
  const depth = JPEG.slice(); depth[frame + 4] = 16;
  const type = JPEG.slice(); type[frame + 1] = 195;
  for (const bad of [oversized, depth, type, JPEG.subarray(0, -2), new Uint8Array([...JPEG, 0]), JPEG.subarray(0, frame)]) {
    assert.throws(() => inspectGeneratedMeshTexture(bad, 'image/jpeg'), /Invalid generated mesh texture/);
  }
});
test('bounded decoder refuses invalid headers before decode and closes mismatched/cancelled bitmaps', async t => {
  const previous = globalThis.createImageBitmap; let calls = 0, closed = 0;
  t.after(() => { if (previous) globalThis.createImageBitmap = previous; else delete globalThis.createImageBitmap; });
  globalThis.createImageBitmap = async blob => { calls++; assert.ok(blob instanceof Blob); return { width: 3, height: 2, close() { closed++; } }; };
  await assert.rejects(decodeGeneratedMeshTexture(pngHeader(9000, 9000), 'image/png'), /dimensions/);
  assert.equal(calls, 0);
  await assert.rejects(decodeGeneratedMeshTexture(PNG, 'image/png'), /decoded dimensions/); assert.equal(closed, 1);
  const abort = new AbortController();
  globalThis.createImageBitmap = async () => { abort.abort(); return { width: 2, height: 2, close() { closed++; } }; };
  await assert.rejects(decodeGeneratedMeshTexture(PNG, 'image/png', { signal: abort.signal }), { name: 'AbortError' });
  assert.equal(closed, 2);
});
