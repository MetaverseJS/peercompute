import {
  createShaderModule,
  createComputePipeline
} from "../../device.js";
import {
  CLEAR_GRID_WGSL,
  P2G1_WGSL,
  P2G2_WGSL,
  UPDATE_GRID_WGSL,
  G2P_WGSL,
  COPY_POSITION_WGSL,
  DIFFUSE_TEMPERATURE_WGSL
} from "./shaders.js";
import { DEFAULT_SIMULATION_CONSTANTS } from "./schema.js";

export function createMpmPipelines(device, constants = DEFAULT_SIMULATION_CONSTANTS) {
  const tensileStrength = constants.tensileStrength ?? 0;
  const damageRate = constants.damageRate ?? 0;
  const restDensity = constants.restDensity ?? DEFAULT_SIMULATION_CONSTANTS.restDensity;
  const stiffness = constants.stiffness ?? DEFAULT_SIMULATION_CONSTANTS.stiffness;
  const dynamicViscosity = constants.dynamicViscosity ?? DEFAULT_SIMULATION_CONSTANTS.dynamicViscosity;
  const dt = constants.dt ?? DEFAULT_SIMULATION_CONSTANTS.dt;
  const fixedPointScale = constants.fixedPointScale ?? DEFAULT_SIMULATION_CONSTANTS.fixedPointScale;

  const clearGridModule = createShaderModule(device, CLEAR_GRID_WGSL, "mpm-clear-grid");
  const p2g1Module = createShaderModule(device, P2G1_WGSL, "mpm-p2g1");
  const p2g2Module = createShaderModule(device, P2G2_WGSL, "mpm-p2g2");
  const updateGridModule = createShaderModule(device, UPDATE_GRID_WGSL, "mpm-update-grid");
  const g2pModule = createShaderModule(device, G2P_WGSL, "mpm-g2p");
  const copyPositionModule = createShaderModule(device, COPY_POSITION_WGSL, "mpm-copy-position");

  const pipelines = {
    clearGrid: device.createComputePipeline({
      label: "mpm-clear-grid",
      layout: "auto",
      compute: { module: clearGridModule }
    }),
    p2g1: device.createComputePipeline({
      label: "mpm-p2g1",
      layout: "auto",
      compute: {
        module: p2g1Module,
        constants: {
          fixed_point_multiplier: fixedPointScale
        }
      }
    }),
    p2g2: device.createComputePipeline({
      label: "mpm-p2g2",
      layout: "auto",
      compute: {
        module: p2g2Module,
        constants: {
          fixed_point_multiplier: fixedPointScale,
          stiffness,
          rest_density: restDensity,
          dynamic_viscosity: dynamicViscosity,
          dt,
          tensile_strength: tensileStrength,
          damage_rate: damageRate
        }
      }
    }),
    updateGrid: device.createComputePipeline({
      label: "mpm-update-grid",
      layout: "auto",
      compute: {
        module: updateGridModule,
        constants: {
          fixed_point_multiplier: constants.fixedPointScale,
          dt: constants.dt,
          thermal_diffusivity: constants.thermalDiffusivity ?? 0.1
        }
      }
    }),
    g2p: device.createComputePipeline({
      label: "mpm-g2p",
      layout: "auto",
      compute: {
        module: g2pModule,
        constants: {
          fixed_point_multiplier: constants.fixedPointScale,
          dt: constants.dt
        }
      }
    }),
    copyPosition: device.createComputePipeline({
      label: "mpm-copy-position",
      layout: "auto",
      compute: { module: copyPositionModule }
    })
  };

  return pipelines;
}

/**
 * Create bind groups for the standard MLS-MPM pipeline.
 * Buffers:
 * - particleBuffer: storage (particles)
 * - gridBuffer: storage (cells)
 * - initBoxBuffer: uniform vec3 (size padded to 16 bytes)
 * - realBoxBuffer: uniform vec3 (size padded to 16 bytes)
 * - interactionBuffer: uniform MouseInteraction (32 bytes)
 * - posVelBuffer: storage (optional) for copyPosition
 */
export function createMpmBindGroups(device, pipelines, buffers) {
  const {
    particleBuffer,
    gridBuffer,
    initBoxBuffer,
    realBoxBuffer,
    interactionBuffer,
    posVelBuffer,
    simUniformBuffer
  } = buffers;

  const bindGroups = {
    clearGrid: device.createBindGroup({
      layout: pipelines.clearGrid.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: gridBuffer } }]
    }),
    p2g1: device.createBindGroup({
      layout: pipelines.p2g1.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: particleBuffer } },
        { binding: 1, resource: { buffer: gridBuffer } },
        { binding: 2, resource: { buffer: initBoxBuffer } }
      ]
    }),
    p2g2: device.createBindGroup({
      layout: pipelines.p2g2.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: particleBuffer } },
        { binding: 1, resource: { buffer: gridBuffer } },
        { binding: 2, resource: { buffer: initBoxBuffer } },
        { binding: 3, resource: { buffer: simUniformBuffer } }
      ]
    }),
    updateGrid: device.createBindGroup({
      layout: pipelines.updateGrid.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: gridBuffer } },
        { binding: 1, resource: { buffer: realBoxBuffer } },
        { binding: 2, resource: { buffer: initBoxBuffer } },
        { binding: 3, resource: { buffer: simUniformBuffer } }
      ]
    }),
    g2p: device.createBindGroup({
      layout: pipelines.g2p.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: particleBuffer } },
        { binding: 1, resource: { buffer: gridBuffer } },
        { binding: 2, resource: { buffer: realBoxBuffer } },
        { binding: 3, resource: { buffer: initBoxBuffer } },
        { binding: 4, resource: { buffer: interactionBuffer } }
      ]
    })
  };

  if (pipelines.copyPosition && posVelBuffer) {
    bindGroups.copyPosition = device.createBindGroup({
      layout: pipelines.copyPosition.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: particleBuffer } },
        { binding: 1, resource: { buffer: posVelBuffer } }
      ]
    });
  }

  return bindGroups;
}
