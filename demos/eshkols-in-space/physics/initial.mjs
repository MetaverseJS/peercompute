import { initialBody } from './initial-laws.mjs';

const presets = ['disk', 'binary', 'sphere'];
const distributions = ['equal', 'spectrum', 'heavy'];

function prepare({ count, preset = 'disk', distribution = 'equal', seed = 1, gravity = 1 }) {
  const layout = presets.indexOf(preset);
  const masses = distributions.indexOf(distribution);
  if (!Number.isInteger(count) || count < 1 || count > 0xffffffff / 32) throw new RangeError('Invalid body count');
  if (layout < 0 || masses < 0) throw new RangeError('Unknown preset or mass distribution');
  if (!Number.isSafeInteger(seed) || seed < 0) throw new RangeError('Seed must be a nonnegative integer');
  if (!Number.isFinite(gravity) || gravity < 0) throw new RangeError('Gravity must be finite and nonnegative');
  return { count, seed, layout, masses, gravity, packed: new Float32Array(count * 8) };
}

function fill({ count, seed, layout, masses, gravity, packed }, first, end) {
  for (let i = first; i < end; i++) {
    const { position: p, mass, velocity: v, radius } = initialBody(i, count, seed, layout, masses, gravity);
    const offset = i * 8;
    packed[offset] = p.x;
    packed[offset + 1] = p.y;
    packed[offset + 2] = p.z;
    packed[offset + 3] = mass;
    packed[offset + 4] = v.x;
    packed[offset + 5] = v.y;
    packed[offset + 6] = v.z;
    packed[offset + 7] = radius;
  }
}

/** Pack immutable Eshkol bodies into the compute and rendering ABI. */
export function createBodies(config) {
  const state = prepare(config);
  fill(state, 0, state.count);
  return state.packed;
}

/** Same deterministic packing, yielding during long builds so the UI can cancel or repaint. */
export async function createBodiesAsync(config, { signal } = {}) {
  signal?.throwIfAborted();
  const state = prepare(config);
  let i = 0;
  while (i < state.count) {
    const deadline = performance.now() + 8;
    do {
      const end = Math.min(state.count, i + 512);
      fill(state, i, end);
      i = end;
    } while (i < state.count && performance.now() < deadline);
    if (i < state.count) {
      await new Promise(resolve => setTimeout(resolve, 0));
      signal?.throwIfAborted();
    }
  }
  return state.packed;
}
