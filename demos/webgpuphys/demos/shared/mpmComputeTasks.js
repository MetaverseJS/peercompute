import { initWebGPU, mpm } from '../../src/index.js';

let device = null;
let sim = null;
let particleCount = 0;

export async function initHeadlessSim({
  particleCount: nextCount,
  gridSize,
  iterations,
  blockOptions,
  constants
} = {}) {
  if (!nextCount || !gridSize || !blockOptions || !constants) {
    throw new Error('Missing required initialization data for headless MPM');
  }
  if (!device) {
    const result = await initWebGPU();
    device = result.device;
  }
  particleCount = nextCount;
  sim = mpm.createHeadlessMpm({
    device,
    particleCount,
    gridSize,
    iterations,
    blockOptions,
    constants
  });
  return { ok: true };
}

export async function stepHeadlessSim({ steps = 1, diagnostics = false } = {}) {
  if (!sim) {
    throw new Error('Simulation not initialized');
  }
  const safeSteps = Math.max(0, Math.floor(steps));
  for (let i = 0; i < safeSteps; i++) {
    sim.step();
  }
  if (!diagnostics) {
    return { steps: safeSteps };
  }
  const { mass, momentum } = await mpm.computeMassMomentum(device, sim.buffers.particleBuffer, particleCount);
  return { steps: safeSteps, mass, momentum };
}

export function resetHeadlessSim() {
  sim = null;
  particleCount = 0;
  return { ok: true };
}
