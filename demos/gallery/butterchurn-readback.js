// Each slot remains owned by its mapAsync until the GPU has finished copying.
// Two spare slots let the next refresh proceed when a mapping crosses a vsync.
export class ButterchurnReadback {
  constructor(device, width, height) {
    this.width = width;
    this.height = height;
    this.stride = Math.ceil(width * 4 / 256) * 256;
    this.slots = Array.from({ length: 3 }, () => ({
      buffer: device.createBuffer({
        size: this.stride * height,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      }),
      pixels: new Uint8Array(width * height * 4),
      busy: false,
    }));
    this.serial = 0;
    this.published = 0;
    this.destroyed = false;
  }

  copy(encoder, texture) {
    const slot = this.slots.find(item => !item.busy);
    if (!slot || this.destroyed) return;
    slot.busy = true;
    encoder.copyTextureToBuffer(
      { texture },
      { buffer: slot.buffer, bytesPerRow: this.stride },
      [this.width, this.height],
    );
    return slot;
  }

  async read(slot, landed) {
    if (!slot) return;
    const serial = ++this.serial;
    const { buffer, pixels } = slot;
    try {
      await buffer.mapAsync(GPUMapMode.READ);
      if (this.destroyed || serial < this.published) return;
      const view = new Uint8Array(buffer.getMappedRange());
      const rowBytes = this.width * 4;
      for (let y = 0; y < this.height; y++) {
        pixels.set(view.subarray(y * this.stride, y * this.stride + rowBytes), y * rowBytes);
      }
      this.published = serial;
      landed(pixels);
    } catch {
      // A lost device or a destroyed buffer is handled by the field's watchdog.
    } finally {
      if (buffer.mapState === 'mapped') buffer.unmap();
      slot.busy = false;
    }
  }

  destroy() {
    this.destroyed = true;
    for (const { buffer } of this.slots) buffer.destroy();
  }
}
