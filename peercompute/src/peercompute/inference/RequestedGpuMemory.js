/** Tracks requested buffer bytes on one owned device. This is NOT physical VRAM:
 * excludes textures/driver allocations and cannot observe garbage collection.
 * No strong buffer references are retained. Failed instrumentation is optional. */
export function observeRequestedGpuMemory(device, evidence) {
  if (typeof device?.createBuffer !== 'function') return () => {};
  const descriptor = Object.getOwnPropertyDescriptor(device, 'createBuffer'), create = device.createBuffer;
  let live = 0;
  const wrapped = function (...args) {
    const buffer = create.apply(device, args), size = buffer.size ?? args[0]?.size;
    if (!Number.isSafeInteger(size) || size < 0 || !Number.isSafeInteger(live + size)) return buffer;
    live += size; evidence.requestedGpuBufferPeakBytes = Math.max(evidence.requestedGpuBufferPeakBytes ?? 0, live);
    const destroy = buffer.destroy; let destroyed = false;
    if (typeof destroy === 'function') try {
      buffer.destroy = function (...values) {
        const result = destroy.apply(this, values);
        if (!destroyed) { destroyed = true; live -= size; }
        return result;
      };
    } catch { /* Retain an upper bound if this host makes buffer methods read-only. */ }
    return buffer;
  };
  try { device.createBuffer = wrapped; } catch { return () => {}; }
  return () => {
    if (device.createBuffer !== wrapped) return;
    if (descriptor) Object.defineProperty(device, 'createBuffer', descriptor); else delete device.createBuffer;
  };
}
