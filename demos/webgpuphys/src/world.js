import { Vec3 } from "./math.js";
import {
  initWebGPU,
  createShaderModule,
  createStorageBuffer,
  createUniformBuffer,
  createStagingBuffer,
  writeBuffer,
  readBuffer,
  getDispatchSize,
  alignTo
} from "./device.js";
import sharedWgsl from "./shaders/shared.wgsl?raw";
import localToWorldWgsl from "./shaders/local_to_world.wgsl?raw";
import localToRelativeWgsl from "./shaders/local_to_relative.wgsl?raw";
import bodyVelToParticleVelWgsl from "./shaders/body_vel_to_particle_vel.wgsl?raw";
import clearGridWgsl from "./shaders/clear_grid.wgsl?raw";
import buildGridWgsl from "./shaders/build_grid.wgsl?raw";
import updateForceWgsl from "./shaders/update_force.wgsl?raw";
import updateTorqueWgsl from "./shaders/update_torque.wgsl?raw";
import reduceForceWgsl from "./shaders/reduce_force.wgsl?raw";
import reduceTorqueWgsl from "./shaders/reduce_torque.wgsl?raw";
import updateBodyVelocityWgsl from "./shaders/update_body_velocity.wgsl?raw";
import updateBodyAngularVelocityWgsl from "./shaders/update_body_angular_velocity.wgsl?raw";
import updateBodyPositionWgsl from "./shaders/update_body_position.wgsl?raw";
import updateBodyQuaternionWgsl from "./shaders/update_body_quaternion.wgsl?raw";
const WORKGROUP_SIZE = 64;
const MAX_PARTICLES_PER_CELL = 4;
class World {
  // WebGPU context
  ctx;
  device;
  // Buffers
  buffers;
  pipelines;
  layouts;
  bindGroups = /* @__PURE__ */ new Map();
  // Simulation state
  _bodyCount = 0;
  _particleCount = 0;
  maxBodies;
  maxParticles;
  // Simulation parameters
  params;
  grid;
  // Timing
  time = 0;
  fixedTime = 0;
  accumulator = 0;
  maxSubSteps;
  _interpolationValue = 0;
  // Double-buffer state (which buffer is current)
  bufferIndex = 0;
  // CPU-side data for initialization
  bodyPositions;
  bodyQuaternions;
  bodyMasses;
  particleLocalPositions;
  // Dirty flags for CPU->GPU sync
  bodyDataDirty = true;
  particleDataDirty = true;
  massDirty = true;
  // Sphere interaction
  interactionSphere = {
    position: new Vec3(10, 1, 0),
    radius: 1
  };
  // Initialization promise
  initPromise;
  initialized = false;
  constructor(options = {}) {
    this.maxBodies = options.maxBodies || 64;
    this.maxParticles = options.maxParticles || 256;
    this.maxSubSteps = options.maxSubSteps || 5;
    this.params = {
      stiffness: options.stiffness ?? 1700,
      damping: options.damping ?? 6,
      friction: options.friction ?? 2,
      drag: options.drag ?? 0.1,
      radius: options.radius ?? 0.5,
      fixedTimeStep: options.fixedTimeStep ?? 1 / 120,
      gravity: options.gravity?.data ?? new Float32Array([0, -9.81, 0]),
      boxSize: options.boxSize?.data ?? new Float32Array([10, 10, 10])
    };
    const gridRes = options.gridResolution || new Vec3(64, 64, 64);
    this.grid = {
      position: options.gridPosition?.data ?? new Float32Array([0, 0, 0]),
      resolution: gridRes.data,
      maxParticlesPerCell: MAX_PARTICLES_PER_CELL
    };
    this.bodyPositions = new Float32Array(this.maxBodies * 4);
    this.bodyQuaternions = new Float32Array(this.maxBodies * 4);
    this.bodyMasses = new Float32Array(this.maxBodies * 4);
    this.particleLocalPositions = new Float32Array(this.maxParticles * 4);
    for (let i = 0; i < this.maxBodies; i++) {
      this.bodyQuaternions[i * 4 + 3] = 1;
    }
    this.initPromise = this.initialize();
  }
  /**
   * Initialize WebGPU resources
   */
  async initialize() {
    this.ctx = await initWebGPU();
    this.device = this.ctx.device;
    this.createBuffers();
    await this.createPipelines();
    this.createBindGroups();
    this.initialized = true;
  }
  /**
   * Wait for initialization to complete
   */
  async ready() {
    await this.initPromise;
  }
  /**
   * Create all GPU buffers
   */
  createBuffers() {
    const device = this.device;
    const bodySize = this.maxBodies * 4 * 4;
    const particleSize = this.maxParticles * 4 * 4;
    const gridCellCount = Math.ceil(this.grid.resolution[0]) * Math.ceil(this.grid.resolution[1]) * Math.ceil(this.grid.resolution[2]);
    
    // Calculate dispatch size for grid clearing (handling 65535 limit)
    // Total workgroups needed
    const totalWorkgroups = Math.ceil(gridCellCount / WORKGROUP_SIZE);
    const maxDispatchX = 65535;
    this.gridDispatch = {
        x: Math.min(totalWorkgroups, maxDispatchX),
        y: Math.ceil(totalWorkgroups / maxDispatchX),
        z: 1
    };
    // Stride for shader (in number of threads)
    this.gridStride = this.gridDispatch.x * WORKGROUP_SIZE;

    const gridSize = gridCellCount * 4;
    const gridParticlesSize = gridCellCount * MAX_PARTICLES_PER_CELL * 4;
    this.buffers = {
      // Body buffers (double-buffered)
      bodyPositionA: createStorageBuffer(device, bodySize, "body-position-a"),
      bodyPositionB: createStorageBuffer(device, bodySize, "body-position-b"),
      bodyQuaternionA: createStorageBuffer(device, bodySize, "body-quaternion-a"),
      bodyQuaternionB: createStorageBuffer(device, bodySize, "body-quaternion-b"),
      bodyVelocityA: createStorageBuffer(device, bodySize, "body-velocity-a"),
      bodyVelocityB: createStorageBuffer(device, bodySize, "body-velocity-b"),
      bodyAngularVelocityA: createStorageBuffer(device, bodySize, "body-angular-velocity-a"),
      bodyAngularVelocityB: createStorageBuffer(device, bodySize, "body-angular-velocity-b"),
      bodyForce: createStorageBuffer(device, bodySize, "body-force"),
      bodyTorque: createStorageBuffer(device, bodySize, "body-torque"),
      bodyMass: createStorageBuffer(device, bodySize, "body-mass"),
      // Particle buffers
      particleLocalPosition: createStorageBuffer(device, particleSize, "particle-local-position"),
      particleRelativePosition: createStorageBuffer(device, particleSize, "particle-relative-position"),
      particleWorldPosition: createStorageBuffer(device, particleSize, "particle-world-position"),
      particleVelocity: createStorageBuffer(device, particleSize, "particle-velocity"),
      particleForce: createStorageBuffer(device, particleSize, "particle-force"),
      particleTorque: createStorageBuffer(device, particleSize, "particle-torque"),
      // Broadphase grid
      gridCellCount: createStorageBuffer(device, gridSize, "grid-cell-count"),
      gridCellParticles: createStorageBuffer(device, gridParticlesSize, "grid-cell-particles"),
      // Uniform params buffer (aligned to 256 bytes for uniform binding)
      params: createUniformBuffer(device, alignTo(256, 256), "params"),
      // Staging buffers for CPU readback
      stagingPosition: createStagingBuffer(device, bodySize, "staging-position"),
      stagingQuaternion: createStagingBuffer(device, bodySize, "staging-quaternion")
    };
  }
  /**
   * Create compute pipelines
   */
  async createPipelines() {
    const device = this.device;
    const makeShader = (code) => sharedWgsl + "\n" + code;
    const bufferLayout = (binding, type) => ({
      binding,
      visibility: GPUShaderStage.COMPUTE,
      buffer: { type }
    });
    const makeLayout = (label, entries) => device.createBindGroupLayout({ label, entries });
    const makePipeline = (label, module, layout) => device.createComputePipeline({
      label,
      layout: device.createPipelineLayout({
        label: `${label}-layout`,
        bindGroupLayouts: [layout]
      }),
      compute: {
        module,
        entryPoint: "main"
      }
    });
    const modules = {
      localToWorld: createShaderModule(device, makeShader(localToWorldWgsl), "local-to-world"),
      localToRelative: createShaderModule(device, makeShader(localToRelativeWgsl), "local-to-relative"),
      bodyVelToParticleVel: createShaderModule(device, makeShader(bodyVelToParticleVelWgsl), "body-vel-to-particle-vel"),
      clearGrid: createShaderModule(device, makeShader(clearGridWgsl), "clear-grid"),
      buildGrid: createShaderModule(device, makeShader(buildGridWgsl), "build-grid"),
      updateForce: createShaderModule(device, makeShader(updateForceWgsl), "update-force"),
      updateTorque: createShaderModule(device, makeShader(updateTorqueWgsl), "update-torque"),
      reduceForce: createShaderModule(device, makeShader(reduceForceWgsl), "reduce-force"),
      reduceTorque: createShaderModule(device, makeShader(reduceTorqueWgsl), "reduce-torque"),
      updateBodyVelocity: createShaderModule(device, makeShader(updateBodyVelocityWgsl), "update-body-velocity"),
      updateBodyAngularVelocity: createShaderModule(device, makeShader(updateBodyAngularVelocityWgsl), "update-body-angular-velocity"),
      updateBodyPosition: createShaderModule(device, makeShader(updateBodyPositionWgsl), "update-body-position"),
      updateBodyQuaternion: createShaderModule(device, makeShader(updateBodyQuaternionWgsl), "update-body-quaternion")
    };
    const layouts = {
      localToWorld: makeLayout("layout/local-to-world", [
        bufferLayout(0, "uniform"),
        bufferLayout(1, "read-only-storage"),
        bufferLayout(2, "read-only-storage"),
        bufferLayout(3, "read-only-storage"),
        bufferLayout(4, "storage")
      ]),
      localToRelative: makeLayout("layout/local-to-relative", [
        bufferLayout(0, "uniform"),
        bufferLayout(1, "read-only-storage"),
        bufferLayout(2, "read-only-storage"),
        bufferLayout(3, "read-only-storage"),
        bufferLayout(4, "storage")
      ]),
      bodyVelToParticleVel: makeLayout("layout/body-vel-to-particle-vel", [
        bufferLayout(0, "uniform"),
        bufferLayout(1, "read-only-storage"),
        bufferLayout(2, "read-only-storage"),
        bufferLayout(3, "read-only-storage"),
        bufferLayout(4, "storage")
      ]),
      clearGrid: makeLayout("layout/clear-grid", [
        bufferLayout(0, "uniform"),
        bufferLayout(1, "storage")
      ]),
      buildGrid: makeLayout("layout/build-grid", [
        bufferLayout(0, "uniform"),
        bufferLayout(1, "read-only-storage"),
        bufferLayout(2, "storage"),
        bufferLayout(3, "storage")
      ]),
      updateForce: makeLayout("layout/update-force", [
        bufferLayout(0, "uniform"),
        bufferLayout(1, "read-only-storage"),
        bufferLayout(2, "read-only-storage"),
        bufferLayout(3, "read-only-storage"),
        bufferLayout(4, "read-only-storage"),
        bufferLayout(5, "read-only-storage"),
        bufferLayout(6, "read-only-storage"),
        bufferLayout(7, "storage")
      ]),
      updateTorque: makeLayout("layout/update-torque", [
        bufferLayout(0, "uniform"),
        bufferLayout(1, "read-only-storage"),
        bufferLayout(2, "read-only-storage"),
        bufferLayout(3, "read-only-storage"),
        bufferLayout(4, "read-only-storage"),
        bufferLayout(5, "read-only-storage"),
        bufferLayout(6, "read-only-storage"),
        bufferLayout(7, "storage")
      ]),
      reduceForce: makeLayout("layout/reduce-force", [
        bufferLayout(0, "uniform"),
        bufferLayout(1, "read-only-storage"),
        bufferLayout(2, "read-only-storage"),
        bufferLayout(3, "storage")
      ]),
      reduceTorque: makeLayout("layout/reduce-torque", [
        bufferLayout(0, "uniform"),
        bufferLayout(1, "read-only-storage"),
        bufferLayout(2, "read-only-storage"),
        bufferLayout(3, "read-only-storage"),
        bufferLayout(4, "read-only-storage"),
        bufferLayout(5, "storage")
      ]),
      updateBodyVelocity: makeLayout("layout/update-body-velocity", [
        bufferLayout(0, "uniform"),
        bufferLayout(1, "read-only-storage"),
        bufferLayout(2, "read-only-storage"),
        bufferLayout(3, "read-only-storage"),
        bufferLayout(4, "storage")
      ]),
      updateBodyAngularVelocity: makeLayout("layout/update-body-angular-velocity", [
        bufferLayout(0, "uniform"),
        bufferLayout(1, "read-only-storage"),
        bufferLayout(2, "read-only-storage"),
        bufferLayout(3, "read-only-storage"),
        bufferLayout(4, "read-only-storage"),
        bufferLayout(5, "storage")
      ]),
      updateBodyPosition: makeLayout("layout/update-body-position", [
        bufferLayout(0, "uniform"),
        bufferLayout(1, "read-only-storage"),
        bufferLayout(2, "read-only-storage"),
        bufferLayout(3, "storage")
      ]),
      updateBodyQuaternion: makeLayout("layout/update-body-quaternion", [
        bufferLayout(0, "uniform"),
        bufferLayout(1, "read-only-storage"),
        bufferLayout(2, "read-only-storage"),
        bufferLayout(3, "storage")
      ])
    };
    this.layouts = layouts;
    this.pipelines = {
      localToWorld: makePipeline("local-to-world", modules.localToWorld, layouts.localToWorld),
      localToRelative: makePipeline("local-to-relative", modules.localToRelative, layouts.localToRelative),
      bodyVelToParticleVel: makePipeline("body-vel-to-particle-vel", modules.bodyVelToParticleVel, layouts.bodyVelToParticleVel),
      clearGrid: makePipeline("clear-grid", modules.clearGrid, layouts.clearGrid),
      buildGrid: makePipeline("build-grid", modules.buildGrid, layouts.buildGrid),
      updateForce: makePipeline("update-force", modules.updateForce, layouts.updateForce),
      updateTorque: makePipeline("update-torque", modules.updateTorque, layouts.updateTorque),
      reduceForce: makePipeline("reduce-force", modules.reduceForce, layouts.reduceForce),
      reduceTorque: makePipeline("reduce-torque", modules.reduceTorque, layouts.reduceTorque),
      updateBodyVelocity: makePipeline("update-body-velocity", modules.updateBodyVelocity, layouts.updateBodyVelocity),
      updateBodyAngularVelocity: makePipeline("update-body-angular-velocity", modules.updateBodyAngularVelocity, layouts.updateBodyAngularVelocity),
      updateBodyPosition: makePipeline("update-body-position", modules.updateBodyPosition, layouts.updateBodyPosition),
      updateBodyQuaternion: makePipeline("update-body-quaternion", modules.updateBodyQuaternion, layouts.updateBodyQuaternion)
    };
  }
  /**
   * Create bind groups for each pipeline
   */
  createBindGroups() {
    this.updateBindGroups();
  }
  /**
   * Update bind groups after buffer swap
   */
  updateBindGroups() {
    const device = this.device;
    const buffers = this.buffers;
    const layouts = this.layouts;
    const posRead = this.bufferIndex === 0 ? buffers.bodyPositionA : buffers.bodyPositionB;
    const posWrite = this.bufferIndex === 0 ? buffers.bodyPositionB : buffers.bodyPositionA;
    const quatRead = this.bufferIndex === 0 ? buffers.bodyQuaternionA : buffers.bodyQuaternionB;
    const quatWrite = this.bufferIndex === 0 ? buffers.bodyQuaternionB : buffers.bodyQuaternionA;
    const velRead = this.bufferIndex === 0 ? buffers.bodyVelocityA : buffers.bodyVelocityB;
    const velWrite = this.bufferIndex === 0 ? buffers.bodyVelocityB : buffers.bodyVelocityA;
    const angVelRead = this.bufferIndex === 0 ? buffers.bodyAngularVelocityA : buffers.bodyAngularVelocityB;
    const angVelWrite = this.bufferIndex === 0 ? buffers.bodyAngularVelocityB : buffers.bodyAngularVelocityA;
    this.bindGroups.set("localToWorld", device.createBindGroup({
      layout: layouts.localToWorld,
      entries: [
        { binding: 0, resource: { buffer: buffers.params } },
        { binding: 1, resource: { buffer: buffers.particleLocalPosition } },
        { binding: 2, resource: { buffer: posRead } },
        { binding: 3, resource: { buffer: quatRead } },
        { binding: 4, resource: { buffer: buffers.particleWorldPosition } }
      ]
    }));
    this.bindGroups.set("localToRelative", device.createBindGroup({
      layout: layouts.localToRelative,
      entries: [
        { binding: 0, resource: { buffer: buffers.params } },
        { binding: 1, resource: { buffer: buffers.particleLocalPosition } },
        { binding: 2, resource: { buffer: posRead } },
        { binding: 3, resource: { buffer: quatRead } },
        { binding: 4, resource: { buffer: buffers.particleRelativePosition } }
      ]
    }));
    this.bindGroups.set("bodyVelToParticleVel", device.createBindGroup({
      layout: layouts.bodyVelToParticleVel,
      entries: [
        { binding: 0, resource: { buffer: buffers.params } },
        { binding: 1, resource: { buffer: buffers.particleRelativePosition } },
        { binding: 2, resource: { buffer: velRead } },
        { binding: 3, resource: { buffer: angVelRead } },
        { binding: 4, resource: { buffer: buffers.particleVelocity } }
      ]
    }));
    this.bindGroups.set("clearGrid", device.createBindGroup({
      layout: layouts.clearGrid,
      entries: [
        { binding: 0, resource: { buffer: buffers.params } },
        { binding: 1, resource: { buffer: buffers.gridCellCount } }
      ]
    }));
    this.bindGroups.set("buildGrid", device.createBindGroup({
      layout: layouts.buildGrid,
      entries: [
        { binding: 0, resource: { buffer: buffers.params } },
        { binding: 1, resource: { buffer: buffers.particleWorldPosition } },
        { binding: 2, resource: { buffer: buffers.gridCellCount } },
        { binding: 3, resource: { buffer: buffers.gridCellParticles } }
      ]
    }));
    this.bindGroups.set("updateForce", device.createBindGroup({
      layout: layouts.updateForce,
      entries: [
        { binding: 0, resource: { buffer: buffers.params } },
        { binding: 1, resource: { buffer: buffers.particleWorldPosition } },
        { binding: 2, resource: { buffer: buffers.particleRelativePosition } },
        { binding: 3, resource: { buffer: buffers.particleVelocity } },
        { binding: 4, resource: { buffer: angVelRead } },
        { binding: 5, resource: { buffer: buffers.gridCellCount } },
        { binding: 6, resource: { buffer: buffers.gridCellParticles } },
        { binding: 7, resource: { buffer: buffers.particleForce } }
      ]
    }));
    this.bindGroups.set("updateTorque", device.createBindGroup({
      layout: layouts.updateTorque,
      entries: [
        { binding: 0, resource: { buffer: buffers.params } },
        { binding: 1, resource: { buffer: buffers.particleWorldPosition } },
        { binding: 2, resource: { buffer: buffers.particleRelativePosition } },
        { binding: 3, resource: { buffer: buffers.particleVelocity } },
        { binding: 4, resource: { buffer: angVelRead } },
        { binding: 5, resource: { buffer: buffers.gridCellCount } },
        { binding: 6, resource: { buffer: buffers.gridCellParticles } },
        { binding: 7, resource: { buffer: buffers.particleTorque } }
      ]
    }));
    this.bindGroups.set("reduceForce", device.createBindGroup({
      layout: layouts.reduceForce,
      entries: [
        { binding: 0, resource: { buffer: buffers.params } },
        { binding: 1, resource: { buffer: buffers.particleLocalPosition } },
        { binding: 2, resource: { buffer: buffers.particleForce } },
        { binding: 3, resource: { buffer: buffers.bodyForce } }
      ]
    }));
    this.bindGroups.set("reduceTorque", device.createBindGroup({
      layout: layouts.reduceTorque,
      entries: [
        { binding: 0, resource: { buffer: buffers.params } },
        { binding: 1, resource: { buffer: buffers.particleLocalPosition } },
        { binding: 2, resource: { buffer: buffers.particleRelativePosition } },
        { binding: 3, resource: { buffer: buffers.particleForce } },
        { binding: 4, resource: { buffer: buffers.particleTorque } },
        { binding: 5, resource: { buffer: buffers.bodyTorque } }
      ]
    }));
    this.bindGroups.set("updateBodyVelocity", device.createBindGroup({
      layout: layouts.updateBodyVelocity,
      entries: [
        { binding: 0, resource: { buffer: buffers.params } },
        { binding: 1, resource: { buffer: velRead } },
        { binding: 2, resource: { buffer: buffers.bodyForce } },
        { binding: 3, resource: { buffer: buffers.bodyMass } },
        { binding: 4, resource: { buffer: velWrite } }
      ]
    }));
    this.bindGroups.set("updateBodyAngularVelocity", device.createBindGroup({
      layout: layouts.updateBodyAngularVelocity,
      entries: [
        { binding: 0, resource: { buffer: buffers.params } },
        { binding: 1, resource: { buffer: angVelRead } },
        { binding: 2, resource: { buffer: buffers.bodyTorque } },
        { binding: 3, resource: { buffer: buffers.bodyMass } },
        { binding: 4, resource: { buffer: quatRead } },
        { binding: 5, resource: { buffer: angVelWrite } }
      ]
    }));
    this.bindGroups.set("updateBodyPosition", device.createBindGroup({
      layout: layouts.updateBodyPosition,
      entries: [
        { binding: 0, resource: { buffer: buffers.params } },
        { binding: 1, resource: { buffer: posRead } },
        { binding: 2, resource: { buffer: velWrite } },
        // Use updated velocity
        { binding: 3, resource: { buffer: posWrite } }
      ]
    }));
    this.bindGroups.set("updateBodyQuaternion", device.createBindGroup({
      layout: layouts.updateBodyQuaternion,
      entries: [
        { binding: 0, resource: { buffer: buffers.params } },
        { binding: 1, resource: { buffer: quatRead } },
        { binding: 2, resource: { buffer: angVelWrite } },
        // Use updated angular velocity
        { binding: 3, resource: { buffer: quatWrite } }
      ]
    }));
  }
  /**
   * Swap double-buffered resources
   */
  swapBuffers() {
    this.bufferIndex = 1 - this.bufferIndex;
    this.updateBindGroups();
  }
  /**
   * Sync CPU data to GPU
   */
  flushData() {
    if (this.bodyDataDirty) {
      writeBuffer(this.device, this.buffers.bodyPositionA, this.bodyPositions);
      writeBuffer(this.device, this.buffers.bodyPositionB, this.bodyPositions);
      writeBuffer(this.device, this.buffers.bodyQuaternionA, this.bodyQuaternions);
      writeBuffer(this.device, this.buffers.bodyQuaternionB, this.bodyQuaternions);
      this.bodyDataDirty = false;
    }
    if (this.particleDataDirty) {
      writeBuffer(this.device, this.buffers.particleLocalPosition, this.particleLocalPositions);
      this.particleDataDirty = false;
    }
    if (this.massDirty) {
      writeBuffer(this.device, this.buffers.bodyMass, this.bodyMasses);
      this.massDirty = false;
    }
    this.updateParamsBuffer();
  }
  /**
   * Update the params uniform buffer
   */
  updateParamsBuffer() {
    const data = new Float32Array(32);
    data[0] = this.params.stiffness;
    data[1] = this.params.damping;
    data[2] = this.params.radius;
    data[3] = this._particleCount;
    data[4] = this.params.fixedTimeStep;
    data[5] = this.params.friction;
    data[6] = this.params.drag;
    data[7] = this._bodyCount;
    data[8] = this.params.gravity[0];
    data[9] = this.params.gravity[1];
    data[10] = this.params.gravity[2];
    data[11] = 0;
    data[12] = this.params.boxSize[0];
    data[13] = this.params.boxSize[1];
    data[14] = this.params.boxSize[2];
    data[15] = 0;
    data[16] = this.grid.position[0];
    data[17] = this.grid.position[1];
    data[18] = this.grid.position[2];
    data[19] = 0;
    data[20] = this.grid.resolution[0];
    data[21] = this.grid.resolution[1];
    data[22] = this.grid.resolution[2];
    data[23] = this.grid.maxParticlesPerCell;
    data[24] = this.interactionSphere.position.x;
    data[25] = this.interactionSphere.position.y;
    data[26] = this.interactionSphere.position.z;
    data[27] = this.interactionSphere.radius;
    const maxV = 2 * this.params.radius / this.params.fixedTimeStep;
    data[28] = maxV;
    data[29] = maxV;
    data[30] = maxV;
    // Store grid stride in w component of maxVelocity for clear_grid shader
    data[31] = this.gridStride || 0; 
    writeBuffer(this.device, this.buffers.params, data);
  }
  /**
   * Add a rigid body to the simulation
   */
  addBody(x, y, z, qx, qy, qz, qw, mass, inertiaX, inertiaY, inertiaZ) {
    if (this._bodyCount >= this.maxBodies) {
      console.warn(`Cannot add body: maximum (${this.maxBodies}) reached`);
      return -1;
    }
    const id = this._bodyCount;
    const offset = id * 4;
    this.bodyPositions[offset] = x;
    this.bodyPositions[offset + 1] = y;
    this.bodyPositions[offset + 2] = z;
    this.bodyPositions[offset + 3] = 1;
    this.bodyQuaternions[offset] = qx;
    this.bodyQuaternions[offset + 1] = qy;
    this.bodyQuaternions[offset + 2] = qz;
    this.bodyQuaternions[offset + 3] = qw;
    this.bodyMasses[offset] = inertiaX > 0 ? 1 / inertiaX : 0;
    this.bodyMasses[offset + 1] = inertiaY > 0 ? 1 / inertiaY : 0;
    this.bodyMasses[offset + 2] = inertiaZ > 0 ? 1 / inertiaZ : 0;
    this.bodyMasses[offset + 3] = mass > 0 ? 1 / mass : 0;
    this._bodyCount++;
    this.bodyDataDirty = true;
    this.massDirty = true;
    return id;
  }
  /**
   * Add a collision particle to a body
   */
  addParticle(bodyId, x, y, z) {
    if (this._particleCount >= this.maxParticles) {
      console.warn(`Cannot add particle: maximum (${this.maxParticles}) reached`);
      return -1;
    }
    const id = this._particleCount;
    const offset = id * 4;
    this.particleLocalPositions[offset] = x;
    this.particleLocalPositions[offset + 1] = y;
    this.particleLocalPositions[offset + 2] = z;
    this.particleLocalPositions[offset + 3] = bodyId;
    this._particleCount++;
    this.particleDataDirty = true;
    return id;
  }
  /**
   * Step the simulation forward by deltaTime
   */
  step(deltaTime) {
    if (!this.initialized) {
      console.warn("World not initialized. Call await world.ready() first.");
      return;
    }
    this.accumulator += deltaTime;
    let substeps = 0;
    while (this.accumulator >= this.params.fixedTimeStep && substeps < this.maxSubSteps) {
      this.singleStep();
      this.accumulator -= this.params.fixedTimeStep;
      substeps++;
    }
    this._interpolationValue = this.accumulator / this.params.fixedTimeStep;
    this.time += deltaTime;
  }
  /**
   * Execute a single physics step
   */
  singleStep() {
    this.flushData();
    const encoder = this.device.createCommandEncoder({ label: "physics-step" });
    encoder.clearBuffer(this.buffers.bodyForce);
    encoder.clearBuffer(this.buffers.bodyTorque);
    encoder.clearBuffer(this.buffers.gridCellParticles);
    const particleDispatch = getDispatchSize(this._particleCount, WORKGROUP_SIZE);
    const bodyDispatch = getDispatchSize(this._bodyCount, WORKGROUP_SIZE);
    // gridDispatch is calculated in createBuffers/constructor
    {
      const pass = encoder.beginComputePass({ label: "local-to-world" });
      pass.setPipeline(this.pipelines.localToWorld);
      pass.setBindGroup(0, this.bindGroups.get("localToWorld"));
      pass.dispatchWorkgroups(particleDispatch);
      pass.end();
    }
    {
      const pass = encoder.beginComputePass({ label: "local-to-relative" });
      pass.setPipeline(this.pipelines.localToRelative);
      pass.setBindGroup(0, this.bindGroups.get("localToRelative"));
      pass.dispatchWorkgroups(particleDispatch);
      pass.end();
    }
    {
      const pass = encoder.beginComputePass({ label: "body-vel-to-particle-vel" });
      pass.setPipeline(this.pipelines.bodyVelToParticleVel);
      pass.setBindGroup(0, this.bindGroups.get("bodyVelToParticleVel"));
      pass.dispatchWorkgroups(particleDispatch);
      pass.end();
    }
    {
      const pass = encoder.beginComputePass({ label: "clear-grid" });
      pass.setPipeline(this.pipelines.clearGrid);
      pass.setBindGroup(0, this.bindGroups.get("clearGrid"));
      pass.dispatchWorkgroups(this.gridDispatch.x, this.gridDispatch.y, this.gridDispatch.z);
      pass.end();
    }
    {
      const pass = encoder.beginComputePass({ label: "build-grid" });
      pass.setPipeline(this.pipelines.buildGrid);
      pass.setBindGroup(0, this.bindGroups.get("buildGrid"));
      pass.dispatchWorkgroups(particleDispatch);
      pass.end();
    }
    {
      const pass = encoder.beginComputePass({ label: "update-force" });
      pass.setPipeline(this.pipelines.updateForce);
      pass.setBindGroup(0, this.bindGroups.get("updateForce"));
      pass.dispatchWorkgroups(particleDispatch);
      pass.end();
    }
    {
      const pass = encoder.beginComputePass({ label: "update-torque" });
      pass.setPipeline(this.pipelines.updateTorque);
      pass.setBindGroup(0, this.bindGroups.get("updateTorque"));
      pass.dispatchWorkgroups(particleDispatch);
      pass.end();
    }
    {
      const pass = encoder.beginComputePass({ label: "reduce-force" });
      pass.setPipeline(this.pipelines.reduceForce);
      pass.setBindGroup(0, this.bindGroups.get("reduceForce"));
      pass.dispatchWorkgroups(particleDispatch);
      pass.end();
    }
    {
      const pass = encoder.beginComputePass({ label: "reduce-torque" });
      pass.setPipeline(this.pipelines.reduceTorque);
      pass.setBindGroup(0, this.bindGroups.get("reduceTorque"));
      pass.dispatchWorkgroups(particleDispatch);
      pass.end();
    }
    {
      const pass = encoder.beginComputePass({ label: "update-body-velocity" });
      pass.setPipeline(this.pipelines.updateBodyVelocity);
      pass.setBindGroup(0, this.bindGroups.get("updateBodyVelocity"));
      pass.dispatchWorkgroups(bodyDispatch);
      pass.end();
    }
    {
      const pass = encoder.beginComputePass({ label: "update-body-angular-velocity" });
      pass.setPipeline(this.pipelines.updateBodyAngularVelocity);
      pass.setBindGroup(0, this.bindGroups.get("updateBodyAngularVelocity"));
      pass.dispatchWorkgroups(bodyDispatch);
      pass.end();
    }
    {
      const pass = encoder.beginComputePass({ label: "update-body-position" });
      pass.setPipeline(this.pipelines.updateBodyPosition);
      pass.setBindGroup(0, this.bindGroups.get("updateBodyPosition"));
      pass.dispatchWorkgroups(bodyDispatch);
      pass.end();
    }
    {
      const pass = encoder.beginComputePass({ label: "update-body-quaternion" });
      pass.setPipeline(this.pipelines.updateBodyQuaternion);
      pass.setBindGroup(0, this.bindGroups.get("updateBodyQuaternion"));
      pass.dispatchWorkgroups(bodyDispatch);
      pass.end();
    }
    this.device.queue.submit([encoder.finish()]);
    this.swapBuffers();
    this.fixedTime += this.params.fixedTimeStep;
  }
  // Property getters and setters
  get bodyCount() {
    return this._bodyCount;
  }
  get particleCount() {
    return this._particleCount;
  }
  /**
   * Expose GPU buffers for rendering
   */
  getParticleWorldPositionBuffer() {
    return this.buffers.particleWorldPosition;
  }
  // Backward/compat alias
  getParticlePositionBuffer() {
    return this.getParticleWorldPositionBuffer();
  }
  getParamsBuffer() {
    return this.buffers.params;
  }
  get interpolationValue() {
    return this._interpolationValue;
  }
  get stiffness() {
    return this.params.stiffness;
  }
  set stiffness(v) {
    this.params.stiffness = v;
  }
  get damping() {
    return this.params.damping;
  }
  set damping(v) {
    this.params.damping = v;
  }
  get friction() {
    return this.params.friction;
  }
  set friction(v) {
    this.params.friction = v;
  }
  get drag() {
    return this.params.drag;
  }
  set drag(v) {
    this.params.drag = v;
  }
  get radius() {
    return this.params.radius;
  }
  set radius(v) {
    this.params.radius = v;
  }
  get fixedTimeStep() {
    return this.params.fixedTimeStep;
  }
  set fixedTimeStep(v) {
    this.params.fixedTimeStep = v;
  }
  get gravity() {
    return new Vec3(this.params.gravity[0], this.params.gravity[1], this.params.gravity[2]);
  }
  set gravity(v) {
    this.params.gravity[0] = v.x;
    this.params.gravity[1] = v.y;
    this.params.gravity[2] = v.z;
  }
  /**
   * Set interaction sphere position
   */
  setSpherePosition(index, x, y, z) {
    if (index !== 0) throw new Error("Multiple spheres not supported yet");
    this.interactionSphere.position.set(x, y, z);
  }
  /**
   * Get interaction sphere position
   */
  getSpherePosition(index, out) {
    if (index !== 0) throw new Error("Multiple spheres not supported yet");
    out = out || new Vec3();
    out.copy(this.interactionSphere.position);
    return out;
  }
  /**
   * Set interaction sphere radius
   */
  setSphereRadius(index, radius) {
    if (index !== 0) throw new Error("Multiple spheres not supported yet");
    this.interactionSphere.radius = radius;
  }
  /**
   * Get interaction sphere radius
   */
  getSphereRadius(index) {
    if (index !== 0) throw new Error("Multiple spheres not supported yet");
    return this.interactionSphere.radius;
  }
  /**
   * Read body positions from GPU (async)
   */
  async readBodyPositions() {
    const size = this._bodyCount * 4 * 4;
    const posBuffer = this.bufferIndex === 0 ? this.buffers.bodyPositionA : this.buffers.bodyPositionB;
    const data = await readBuffer(this.device, posBuffer, this.buffers.stagingPosition, size);
    return new Float32Array(data);
  }
  /**
   * Read body quaternions from GPU (async)
   */
  async readBodyQuaternions() {
    const size = this._bodyCount * 4 * 4;
    const quatBuffer = this.bufferIndex === 0 ? this.buffers.bodyQuaternionA : this.buffers.bodyQuaternionB;
    const data = await readBuffer(this.device, quatBuffer, this.buffers.stagingQuaternion, size);
    return new Float32Array(data);
  }
  /**
   * Get the WebGPU device (for rendering integration)
   */
  getDevice() {
    return this.device;
  }
  /**
   * Get body position buffer for rendering
   */
  getBodyPositionBuffer() {
    return this.bufferIndex === 0 ? this.buffers.bodyPositionA : this.buffers.bodyPositionB;
  }
  /**
   * Get body quaternion buffer for rendering  
   */
  getBodyQuaternionBuffer() {
    return this.bufferIndex === 0 ? this.buffers.bodyQuaternionA : this.buffers.bodyQuaternionB;
  }
  /**
   * Destroy all GPU resources
   */
  destroy() {
    if (!this.initialized) return;
    Object.values(this.buffers).forEach((buffer) => {
      if (buffer && typeof buffer.destroy === "function") {
        buffer.destroy();
      }
    });
    this.bindGroups.clear();
    this.initialized = false;
  }
}
export {
  World
};
