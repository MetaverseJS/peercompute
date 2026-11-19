import test from 'node:test';
import assert from 'node:assert/strict';
import { ButterchurnReadback } from '../gallery/butterchurn-readback.js';

test('GPU transfer slots stay bounded and publish fresh, unpadded rows in order', async t => {
  globalThis.GPUMapMode = { READ: 1 };
  globalThis.GPUBufferUsage = { COPY_DST: 1, MAP_READ: 2 };
  t.after(() => { delete globalThis.GPUMapMode; delete globalThis.GPUBufferUsage; });
  const buffers = [];
  const device = {
    createBuffer({ size }) {
      const bytes = new Uint8Array(size);
      const buffer = {
        bytes, mapState: 'unmapped',
        mapAsync() {
          this.mapState = 'pending';
          return new Promise((resolve, reject) => {
            this.finish = () => { this.mapState = 'mapped'; resolve(); };
            this.fail = reject;
          });
        },
        getMappedRange() { return bytes.buffer; },
        unmap() { this.mapState = 'unmapped'; },
        destroy() { this.destroyed = true; this.mapState = 'unmapped'; },
      };
      buffers.push(buffer);
      return buffer;
    },
  };
  const ring = new ButterchurnReadback(device, 5, 2);
  const received = [];
  const encoder = {
    copyTextureToBuffer({ texture }, { buffer, bytesPerRow }, size) {
      assert.deepEqual(size, [5, 2]);
      assert.equal(bytesPerRow, 256);
      buffer.bytes.fill(0xf0);
      buffer.bytes.fill(texture, 0, 20);
      buffer.bytes.fill(texture + 10, 256, 276);
    },
  };
  const submit = texture => {
    const slot = ring.copy(encoder, texture);
    return ring.read(slot, pixels => received.push([...pixels]));
  };
  const a = submit(1), b = submit(2), c = submit(3);
  assert.equal(ring.copy(encoder, 4), undefined);
  buffers[1].finish();
  await b;
  buffers[0].finish();
  await a;
  assert.deepEqual(received, [[...Array(20).fill(2), ...Array(20).fill(12)]]);
  const newer = submit(5);
  buffers[0].fail(new Error('Device lost'));
  await newer;
  ring.destroy();
  buffers[2].finish();
  await c;
  assert.equal(received.length, 1);
  assert.equal(ring.copy(encoder, 6), undefined);
  assert.ok(buffers.every(buffer => buffer.destroyed));
});
