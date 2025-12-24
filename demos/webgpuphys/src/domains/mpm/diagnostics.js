import { MPM_PARTICLE_FIELDS, MPM_PARTICLE_STRIDE } from "./schema.js";

async function readParticleBytes(device, particleBuffer, particleCount) {
  const size = particleCount * MPM_PARTICLE_STRIDE;
  const staging = device.createBuffer({
    label: "mpm-particle-staging",
    size,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
  });
  const encoder = device.createCommandEncoder({ label: "mpm-diagnostics-copy" });
  encoder.copyBufferToBuffer(particleBuffer, 0, staging, 0, size);
  device.queue.submit([encoder.finish()]);

  await staging.mapAsync(GPUMapMode.READ);
  const copy = staging.getMappedRange().slice(0);
  staging.unmap();
  staging.destroy?.();
  return copy;
}

/**
 * Compute total mass and momentum from the particle buffer (CPU-side).
 * Returns { mass: number, momentum: [mx, my, mz] }.
 */
export async function computeMassMomentum(device, particleBuffer, particleCount) {
  const bytes = await readParticleBytes(device, particleBuffer, particleCount);
  const massOffset = MPM_PARTICLE_FIELDS.mass / 4; // float index
  const velOffset = MPM_PARTICLE_FIELDS.velocity / 4;

  const floats = new Float32Array(bytes);
  let massSum = 0;
  let mx = 0;
  let my = 0;
  let mz = 0;

  for (let i = 0; i < particleCount; i += 1) {
    const base = (MPM_PARTICLE_STRIDE / 4) * i;
    const m = floats[base + massOffset];
    const vx = floats[base + velOffset + 0];
    const vy = floats[base + velOffset + 1];
    const vz = floats[base + velOffset + 2];
    massSum += m;
    mx += m * vx;
    my += m * vy;
    mz += m * vz;
  }

  return { mass: massSum, momentum: [mx, my, mz] };
}
