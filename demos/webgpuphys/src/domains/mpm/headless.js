import { Engine } from "../../engine.js";
import {
  setupMpmDomain,
  uploadParticleData,
  createBlockParticleData
} from "./index.js";

/**
 * Create a headless MLS-MPM simulation (no rendering).
 * Returns domain, buffers, pipelines, bind groups, and a step() helper.
 *
 * options:
 * - device: GPUDevice (required)
 * - particleCount: number
 * - gridSize: { x, y, z } (required)
 * - iterations: MLS-MPM iterations per step (default 1)
 * - constants: overrides for water defaults (stiffness/restDensity/etc)
 * - posVelBuffer: optional buffer to receive copyPosition output
 * - particleData: optional ArrayBuffer laid out with 128B stride; if omitted a block is generated
 * - blockOptions: options passed to createBlockParticleData when particleData is omitted
 */
export function createHeadlessMpm(options) {
  const {
    device,
    particleCount,
    gridSize,
    iterations,
    constants,
    posVelBuffer,
    particleData,
    blockOptions = {}
  } = options;
  if (!device) throw new Error("device is required");
  if (!particleCount) throw new Error("particleCount is required");
  if (!gridSize) throw new Error("gridSize {x,y,z} is required");

  const setup = setupMpmDomain(device, {
    particleCount,
    gridSize,
    posVelBuffer,
    constants,
    iterations
  });

  // Upload particle data
  const data =
    particleData ??
    createBlockParticleData({
      count: particleCount,
      gridSize,
      ...blockOptions
    });
  uploadParticleData(device, setup.buffers.particleBuffer, data);

  // Create engine and attach domain
  const engine = new Engine(device);
  engine.addDomain(setup.domain);

  const step = (dt = (constants && constants.dt) || 0.2) => {
    const encoder = device.createCommandEncoder({ label: "mpm-headless-step" });
    setup.domain.step(encoder, dt);
    device.queue.submit([encoder.finish()]);
  };

  return {
    engine,
    ...setup,
    step
  };
}
