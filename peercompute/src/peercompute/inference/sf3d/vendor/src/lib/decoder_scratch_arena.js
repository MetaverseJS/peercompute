/**
 * decoder_scratch_arena.js — one capacity-bound reusable scratch arena for the
 * triplane decoder, held under the kit's phase-resource working-set lease.
 *
 * Cranial's reviewed assay (b7809c7) proved the texture-bake residual is
 * allocation churn: the decoder rebuilds ~30 transient scratch buffers PER range
 * (~1.015GB cumulative across a route), then a single-threaded CPU
 * materialization tail. This arena removes the churn: it pre-allocates one buffer
 * per proven decoder slot, sized for the maximum batch N, and every range reuses
 * the same physical buffers via TriplaneDecoder's _slotProvider.acquire(slotKey).
 *
 * Exact per-range prefix completion (the facade's per-duty queue fence) is
 * RETAINED — the arena only removes allocation, it does not change scheduling or
 * fence semantics. A slot reused across ranges is safe because each range's GPU
 * work completes (prefix fence) before the next range's dispatch overwrites it.
 *
 * The slot graph is the proven output of tools/prove_decoder_slot_graph.mjs:
 * 30 slots for heads [features, perturb_normal], each size = perTexelBytes * N
 * (all bases 0 except the 4-byte SiLU :dummy workspace). Capacity at maxBatch:
 * ~16.9MB @ 4096, ~67.4MB @ 16384 — replacing ~1.015GB churn.
 */

import { createEmptyBuffer } from './gpu.js';

/**
 * Proven decoder scratch slot graph (bake heads [features, perturb_normal]).
 * Each entry: { slotKey, perTexelBytes, baseBytes }. Source of truth:
 * tools/prove_decoder_slot_graph.mjs against the composed head.
 */
export const DECODER_BAKE_SLOT_GRAPH = Object.freeze([
  { slotKey: 'scaledPos', perTexelBytes: 12, baseBytes: 0 },
  { slotKey: 'grid:XY', perTexelBytes: 8, baseBytes: 0 },
  { slotKey: 'grid:XZ', perTexelBytes: 8, baseBytes: 0 },
  { slotKey: 'grid:YZ', perTexelBytes: 8, baseBytes: 0 },
  { slotKey: 'sampled:XY', perTexelBytes: 160, baseBytes: 0 },
  { slotKey: 'sampled:XZ', perTexelBytes: 160, baseBytes: 0 },
  { slotKey: 'sampled:YZ', perTexelBytes: 160, baseBytes: 0 },
  { slotKey: 'concatFeatures', perTexelBytes: 480, baseBytes: 0 },
  { slotKey: 'head:features:lin:0', perTexelBytes: 256, baseBytes: 0 },
  { slotKey: 'head:features:silu:0:dummy', perTexelBytes: 0, baseBytes: 4 },
  { slotKey: 'head:features:silu:0', perTexelBytes: 256, baseBytes: 0 },
  { slotKey: 'head:features:lin:1', perTexelBytes: 256, baseBytes: 0 },
  { slotKey: 'head:features:silu:1:dummy', perTexelBytes: 0, baseBytes: 4 },
  { slotKey: 'head:features:silu:1', perTexelBytes: 256, baseBytes: 0 },
  { slotKey: 'head:features:lin:2', perTexelBytes: 256, baseBytes: 0 },
  { slotKey: 'head:features:silu:2:dummy', perTexelBytes: 0, baseBytes: 4 },
  { slotKey: 'head:features:silu:2', perTexelBytes: 256, baseBytes: 0 },
  { slotKey: 'head:features:rawOut', perTexelBytes: 12, baseBytes: 0 },
  { slotKey: 'head:features:sigmoid', perTexelBytes: 12, baseBytes: 0 },
  { slotKey: 'head:perturb_normal:lin:0', perTexelBytes: 256, baseBytes: 0 },
  { slotKey: 'head:perturb_normal:silu:0:dummy', perTexelBytes: 0, baseBytes: 4 },
  { slotKey: 'head:perturb_normal:silu:0', perTexelBytes: 256, baseBytes: 0 },
  { slotKey: 'head:perturb_normal:lin:1', perTexelBytes: 256, baseBytes: 0 },
  { slotKey: 'head:perturb_normal:silu:1:dummy', perTexelBytes: 0, baseBytes: 4 },
  { slotKey: 'head:perturb_normal:silu:1', perTexelBytes: 256, baseBytes: 0 },
  { slotKey: 'head:perturb_normal:lin:2', perTexelBytes: 256, baseBytes: 0 },
  { slotKey: 'head:perturb_normal:silu:2:dummy', perTexelBytes: 0, baseBytes: 4 },
  { slotKey: 'head:perturb_normal:silu:2', perTexelBytes: 256, baseBytes: 0 },
  { slotKey: 'head:perturb_normal:rawOut', perTexelBytes: 12, baseBytes: 0 },
  { slotKey: 'head:perturb_normal:normalize3', perTexelBytes: 12, baseBytes: 0 },
]);

const align4 = (n) => Math.ceil(n / 4) * 4;
const slotCapacityBytes = (slot, maxBatch) => align4(slot.baseBytes + slot.perTexelBytes * maxBatch);

/**
 * Compute the total arena byte capacity for a given max batch and slot graph.
 */
export function decoderArenaCapacityBytes(maxBatch, slotGraph = DECODER_BAKE_SLOT_GRAPH) {
  return slotGraph.reduce((sum, s) => sum + slotCapacityBytes(s, maxBatch), 0);
}

/**
 * Create the decoder scratch arena.
 *
 * @param {GPUDevice} device
 * @param {object} o
 * @param {number} o.maxBatch   maximum texels any range will decode
 * @param {Array}  [o.slotGraph=DECODER_BAKE_SLOT_GRAPH]
 * @returns a provider with acquire(slotKey, size), plus telemetry + destroy.
 */
export function createDecoderScratchArena(device, { maxBatch, slotGraph = DECODER_BAKE_SLOT_GRAPH }) {
  if (!Number.isSafeInteger(maxBatch) || maxBatch <= 0) {
    throw new TypeError('maxBatch must be a positive safe integer');
  }
  const slots = new Map();
  let totalBytes = 0;
  for (const slot of slotGraph) {
    const capacity = slotCapacityBytes(slot, maxBatch);
    const buffer = createEmptyBuffer(device, capacity, 0, `arena:${slot.slotKey}`);
    slots.set(slot.slotKey, { buffer, capacity, perTexelBytes: slot.perTexelBytes, baseBytes: slot.baseBytes });
    totalBytes += capacity;
  }
  let destroyed = false;
  let acquireCount = 0;

  return {
    slotCount: slots.size,
    totalBytes,
    maxBatch,

    /**
     * TriplaneDecoder._slotProvider.acquire(slotKey, size) — return the
     * pre-allocated slot buffer. Fail loud on an unknown slot or an overflow
     * (size exceeding the slot's max-batch capacity), never silently truncate.
     */
    acquire(slotKey, size) {
      if (destroyed) throw new Error('decoder scratch arena is destroyed');
      const slot = slots.get(slotKey);
      if (!slot) throw new Error(`decoder arena has no slot "${slotKey}" (slot graph mismatch)`);
      if (size > slot.capacity) {
        throw new Error(`decoder arena slot "${slotKey}" overflow: need ${size} > capacity ${slot.capacity} (maxBatch ${maxBatch})`);
      }
      acquireCount++;
      return slot.buffer;
    },

    snapshot() {
      return {
        slotCount: slots.size,
        totalBytes,
        maxBatch,
        acquireCount,
        destroyed,
      };
    },

    destroy() {
      if (destroyed) return { retired: 0 };
      let retired = 0;
      for (const slot of slots.values()) {
        try { slot.buffer.destroy(); retired++; } catch { /* best-effort */ }
      }
      slots.clear();
      destroyed = true;
      return { retired };
    },
  };
}
