import {
  createParticleBuffer,
  createGridBuffer,
  particleBufferSize,
  MPM_WORKGROUP_SIZE,
  DEFAULT_SIMULATION_CONSTANTS
} from "./schema.js";
import { createMpmPipelines, createMpmBindGroups } from "./pipelines.js";
import { MpmDomain } from "./domain.js";

function createVec3UniformBuffer(device, vec3, label) {
  // Uniform buffers must be 16-byte aligned; pad to 4 floats.
  const data = new Float32Array(4);
  data.set(vec3.slice(0, 3));
  const buffer = device.createBuffer({
    label: label ?? "vec3-uniform",
    size: data.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  });
  device.queue.writeBuffer(buffer, 0, data);
  return buffer;
}

function createSimUniformBuffer(device, gravityVec3, ambientPressure) {
  const data = new Float32Array(4);
  data.set(gravityVec3.slice(0, 3));
  data[3] = ambientPressure;
  const buffer = device.createBuffer({
    label: "mpm-sim-uniforms",
    size: data.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  });
  device.queue.writeBuffer(buffer, 0, data);
  return buffer;
}

/**
 * Create and wire an MpmDomain with buffers/pipelines/bind groups.
 * Options:
 * - particleCount: number of particles
 * - gridSize: { x, y, z } grid dimensions
 * - posVelBuffer: optional buffer for copyPosition output
 * - interactionBuffer: optional buffer for mouse interaction (MouseInteraction struct)
 * - constants: overrides for water defaults
 * - iterations: how many MLS-MPM iterations per step (default 1)
 */
export function setupMpmDomain(device, options) {
  const {
    particleCount,
    gridSize,
    posVelBuffer,
    interactionBuffer,
    constants,
    iterations
  } = options;
  if (!gridSize) throw new Error("gridSize {x,y,z} is required");

  const gridCount = Math.ceil(gridSize.x) * Math.ceil(gridSize.y) * Math.ceil(gridSize.z);

  const particleBuffer = createParticleBuffer(device, particleCount);
  const gridBuffer = createGridBuffer(device, gridCount);
  const initBoxBuffer = createVec3UniformBuffer(device, [gridSize.x, gridSize.y, gridSize.z], "mpm-init-box");
  const realBoxBuffer = createVec3UniformBuffer(device, [gridSize.x, gridSize.y, gridSize.z], "mpm-real-box");
  const ambientPressure = constants?.ambientPressure ?? DEFAULT_SIMULATION_CONSTANTS.ambientPressure;
  const simUniformBuffer = createSimUniformBuffer(device, [0, -0.3, 0], ambientPressure);

  // Default interaction buffer if not provided (radius = -1)
  let effectiveInteractionBuffer = interactionBuffer;
  if (!effectiveInteractionBuffer) {
    effectiveInteractionBuffer = device.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        label: 'mpm-interaction-default'
    });
    // Write radius = -1
    const data = new Float32Array(8);
    data[3] = -1.0;
    device.queue.writeBuffer(effectiveInteractionBuffer, 0, data);
  }

  const pipelines = createMpmPipelines(device, constants);
  const bindGroups = createMpmBindGroups(device, pipelines, {
    particleBuffer,
    gridBuffer,
    initBoxBuffer,
    realBoxBuffer,
    simUniformBuffer,
    interactionBuffer: effectiveInteractionBuffer,
    posVelBuffer
  });

  const domain = new MpmDomain(device, { constants, iterations });
  domain.configure({ pipelines, bindGroups });
  domain.setCounts({ particleCount, gridCount });

  return {
    domain,
    pipelines,
    bindGroups,
    buffers: {
      particleBuffer,
      gridBuffer,
      initBoxBuffer,
      realBoxBuffer,
      simUniformBuffer,
      interactionBuffer: effectiveInteractionBuffer,
      posVelBuffer
    },
    dispatch: {
      particle: Math.ceil(particleCount / MPM_WORKGROUP_SIZE),
      grid: Math.ceil(gridCount / MPM_WORKGROUP_SIZE)
    }
  };
}

export function uploadParticleData(device, particleBuffer, data) {
  const byteLength = data.byteLength ?? data.length;
  if (byteLength > particleBuffer.size) {
    throw new Error(`Particle data (${byteLength}) exceeds buffer size (${particleBuffer.size})`);
  }
  device.queue.writeBuffer(particleBuffer, 0, data);
}
