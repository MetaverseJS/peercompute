export const N_BODY_GRAVITY_STATE_SCHEMA = 'peercompute.multiscale.nbody.state.v0';
export const N_BODY_GRAVITY_RESULT_SCHEMA = 'peercompute.multiscale.nbody.result.v0';
export const N_BODY_GRAVITY_DELTA_SCHEMA = 'peercompute.multiscale.nbody.delta.v0';
export const N_BODY_GRAVITY_WEBGPU_MAX_BODIES = 512;
export const N_BODY_GRAVITY_TREE_SCHEMA = 'peercompute.multiscale.nbody.tree-approximation.v0';

const DEFAULT_STATE_KEY = 'multiscale:nbody:default';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const DEFAULT_TREE_THETA = 0.65;
const DEFAULT_TREE_LEAF_SIZE = 1;
const DEFAULT_TREE_THRESHOLD = N_BODY_GRAVITY_WEBGPU_MAX_BODIES + 1;
const DEFAULT_TREE_MAX_DEPTH = 24;
const BODY_FLOATS = 8;
const WORKGROUP_SIZE = 64;
const PARAM_FLOATS = 4;
const PARAM_BYTES = PARAM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const states = new Map();
const baselines = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const PREDICT_SHADER = `
struct Body {
  posMass: vec4f,
  velPad: vec4f,
};

struct Params {
  count: f32,
  dt: f32,
  gravitationalConstant: f32,
  softening: f32,
};

@group(0) @binding(0) var<storage, read> currentBodies: array<Body>;
@group(0) @binding(1) var<storage, read_write> predictedBodies: array<Body>;
@group(0) @binding(2) var<uniform> params: Params;

fn accelerationAt(pos: vec3f, selfIndex: u32, count: u32) -> vec3f {
  var acc = vec3f(0.0);
  let soft2 = params.softening * params.softening;
  for (var j = 0u; j < count; j = j + 1u) {
    if (j == selfIndex) {
      continue;
    }
    let other = currentBodies[j];
    let delta = other.posMass.xyz - pos;
    let r2 = dot(delta, delta) + soft2 + 0.000000000001;
    let invR = inverseSqrt(r2);
    let invR3 = invR * invR * invR;
    acc = acc + delta * (params.gravitationalConstant * other.posMass.w * invR3);
  }
  return acc;
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let index = gid.x;
  let count = u32(params.count);
  if (index >= count) {
    return;
  }

  let body = currentBodies[index];
  let acc = accelerationAt(body.posMass.xyz, index, count);
  let dt = params.dt;
  let newPos = body.posMass.xyz + body.velPad.xyz * dt + acc * (0.5 * dt * dt);
  let halfVel = body.velPad.xyz + acc * (0.5 * dt);
  predictedBodies[index].posMass = vec4f(newPos, body.posMass.w);
  predictedBodies[index].velPad = vec4f(halfVel, 0.0);
}
`;

const CORRECT_SHADER = `
struct Body {
  posMass: vec4f,
  velPad: vec4f,
};

struct Params {
  count: f32,
  dt: f32,
  gravitationalConstant: f32,
  softening: f32,
};

@group(0) @binding(0) var<storage, read> predictedBodies: array<Body>;
@group(0) @binding(1) var<storage, read_write> nextBodies: array<Body>;
@group(0) @binding(2) var<uniform> params: Params;

fn accelerationAt(pos: vec3f, selfIndex: u32, count: u32) -> vec3f {
  var acc = vec3f(0.0);
  let soft2 = params.softening * params.softening;
  for (var j = 0u; j < count; j = j + 1u) {
    if (j == selfIndex) {
      continue;
    }
    let other = predictedBodies[j];
    let delta = other.posMass.xyz - pos;
    let r2 = dot(delta, delta) + soft2 + 0.000000000001;
    let invR = inverseSqrt(r2);
    let invR3 = invR * invR * invR;
    acc = acc + delta * (params.gravitationalConstant * other.posMass.w * invR3);
  }
  return acc;
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let index = gid.x;
  let count = u32(params.count);
  if (index >= count) {
    return;
  }

  let body = predictedBodies[index];
  let acc = accelerationAt(body.posMass.xyz, index, count);
  let newVel = body.velPad.xyz + acc * (0.5 * params.dt);
  nextBodies[index].posMass = body.posMass;
  nextBodies[index].velPad = vec4f(newVel, 0.0);
}
`;

function getExecutionContext() {
  const scope = globalThis.self;
  const workerScope = globalThis.WorkerGlobalScope;
  if (scope && workerScope && scope instanceof workerScope) {
    return 'dedicated-worker';
  }
  return 'inline';
}

function normalizeNumber(value, fallback, min = -Number.MAX_VALUE, max = Number.MAX_VALUE) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeInteger(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function createRng(seed = 1) {
  let state = Number(seed) >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function asNumberArray(values, expectedLength, label) {
  const array = Array.from(values || [], (value) => Number(value));
  if (array.length !== expectedLength) {
    throw new Error(`${label} length ${array.length} does not match expected ${expectedLength}`);
  }
  if (array.some((value) => !Number.isFinite(value))) {
    throw new Error(`${label} contains non-finite values`);
  }
  return array;
}

function normalizeFromBodies(bodies = []) {
  const masses = [];
  const positions = [];
  const velocities = [];
  for (const body of bodies) {
    masses.push(normalizeNumber(body.mass, 1, 0, Number.MAX_VALUE));
    positions.push(...asNumberArray(body.position, 3, 'body.position'));
    velocities.push(...asNumberArray(body.velocity || [0, 0, 0], 3, 'body.velocity'));
  }
  return { masses, positions, velocities };
}

export function makeNBodyInitialState({
  count = 7,
  seed = 1,
  radius = 1,
  centralMass = 32,
  orbitalMass = 1,
  gravitationalConstant = 1
} = {}) {
  const safeCount = normalizeInteger(count, 7, 1, 256);
  const safeRadius = normalizeNumber(radius, 1, 0.001, Number.MAX_VALUE);
  const safeCentralMass = normalizeNumber(centralMass, 32, 0.001, Number.MAX_VALUE);
  const safeOrbitalMass = normalizeNumber(orbitalMass, 1, 0.001, Number.MAX_VALUE);
  const safeG = normalizeNumber(gravitationalConstant, 1, 0, Number.MAX_VALUE);
  const rng = createRng(seed);
  const masses = [];
  const positions = [];
  const velocities = [];

  masses.push(safeCentralMass);
  positions.push(0, 0, 0);
  velocities.push(0, 0, 0);

  for (let i = 1; i < safeCount; i += 1) {
    const t = (i - 1) / Math.max(1, safeCount - 1);
    const angle = t * Math.PI * 2 + (rng() - 0.5) * 0.18;
    const orbitRadius = safeRadius * (0.55 + t * 1.35 + (rng() - 0.5) * 0.08);
    const y = (rng() - 0.5) * safeRadius * 0.08;
    const speed = Math.sqrt((safeG * safeCentralMass) / Math.max(orbitRadius, 0.001));
    const jitter = 0.96 + rng() * 0.08;
    masses.push(safeOrbitalMass * (0.65 + rng() * 0.9));
    positions.push(Math.cos(angle) * orbitRadius, y, Math.sin(angle) * orbitRadius);
    velocities.push(-Math.sin(angle) * speed * jitter, 0, Math.cos(angle) * speed * jitter);
  }

  const state = {
    schema: N_BODY_GRAVITY_STATE_SCHEMA,
    sequence: 0,
    elapsedTime: 0,
    masses,
    positions,
    velocities
  };
  removeCenterOfMassDrift(state);
  return state;
}

function removeCenterOfMassDrift(state) {
  const diagnostics = computeNBodyDiagnostics(state);
  const totalMass = diagnostics.totalMass || 1;
  for (let axis = 0; axis < 3; axis += 1) {
    const drift = diagnostics.centerOfMassVelocity[axis];
    for (let i = 0; i < state.masses.length; i += 1) {
      state.velocities[i * 3 + axis] -= drift;
    }
  }
  const center = computeNBodyDiagnostics(state).centerOfMass;
  for (let axis = 0; axis < 3; axis += 1) {
    for (let i = 0; i < state.masses.length; i += 1) {
      state.positions[i * 3 + axis] -= center[axis] * (totalMass / totalMass);
    }
  }
}

function normalizeState(source = {}) {
  const candidate = source.state || source;
  let raw = candidate;
  if (Array.isArray(candidate.bodies)) {
    raw = {
      ...candidate,
      ...normalizeFromBodies(candidate.bodies)
    };
  }

  if (!raw.masses && !raw.positions && !raw.velocities) {
    return makeNBodyInitialState(source);
  }

  const masses = asNumberArray(raw.masses, Array.from(raw.masses || []).length, 'masses');
  const count = masses.length;
  if (count < 1) throw new Error('N-body state requires at least one mass');
  return {
    schema: N_BODY_GRAVITY_STATE_SCHEMA,
    sequence: normalizeInteger(raw.sequence, 0, 0),
    elapsedTime: normalizeNumber(raw.elapsedTime, 0),
    masses,
    positions: asNumberArray(raw.positions, count * 3, 'positions'),
    velocities: asNumberArray(raw.velocities || new Array(count * 3).fill(0), count * 3, 'velocities')
  };
}

function cloneState(state) {
  return {
    schema: N_BODY_GRAVITY_STATE_SCHEMA,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    masses: [...state.masses],
    positions: [...state.positions],
    velocities: [...state.velocities]
  };
}

function bodyDataFromState(state) {
  const data = new Float32Array(state.masses.length * BODY_FLOATS);
  for (let i = 0; i < state.masses.length; i += 1) {
    const stateOffset = i * 3;
    const bodyOffset = i * BODY_FLOATS;
    data[bodyOffset] = state.positions[stateOffset];
    data[bodyOffset + 1] = state.positions[stateOffset + 1];
    data[bodyOffset + 2] = state.positions[stateOffset + 2];
    data[bodyOffset + 3] = state.masses[i];
    data[bodyOffset + 4] = state.velocities[stateOffset];
    data[bodyOffset + 5] = state.velocities[stateOffset + 1];
    data[bodyOffset + 6] = state.velocities[stateOffset + 2];
    data[bodyOffset + 7] = 0;
  }
  return data;
}

function applyBodyDataToState(state, data) {
  for (let i = 0; i < state.masses.length; i += 1) {
    const stateOffset = i * 3;
    const bodyOffset = i * BODY_FLOATS;
    state.positions[stateOffset] = data[bodyOffset];
    state.positions[stateOffset + 1] = data[bodyOffset + 1];
    state.positions[stateOffset + 2] = data[bodyOffset + 2];
    state.masses[i] = data[bodyOffset + 3];
    state.velocities[stateOffset] = data[bodyOffset + 4];
    state.velocities[stateOffset + 1] = data[bodyOffset + 5];
    state.velocities[stateOffset + 2] = data[bodyOffset + 6];
  }
}

class NBodyWebGpuRuntime {
  constructor(stateKey) {
    this.stateKey = stateKey;
    this.device = null;
    this.predictPipeline = null;
    this.correctPipeline = null;
    this.currentBuffer = null;
    this.predictedBuffer = null;
    this.nextBuffer = null;
    this.readBuffer = null;
    this.paramBuffer = null;
    this.count = 0;
    this.lastError = null;
    this.submittedSteps = 0;
  }

  async initialize(count) {
    if (this.device && this.count === count) return;
    const gpu = globalThis.navigator?.gpu;
    if (!gpu) throw new Error('WebGPU unavailable for N-body worker');
    const usage = globalThis.GPUBufferUsage;
    if (!usage) throw new Error('GPUBufferUsage unavailable for N-body worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for N-body worker');
    this.device = await adapter.requestDevice();
    this.count = count;

    const bodyBytes = count * BODY_FLOATS * Float32Array.BYTES_PER_ELEMENT;
    this.currentBuffer = this.device.createBuffer({
      size: bodyBytes,
      usage: usage.STORAGE | usage.COPY_DST
    });
    this.predictedBuffer = this.device.createBuffer({
      size: bodyBytes,
      usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
    });
    this.nextBuffer = this.device.createBuffer({
      size: bodyBytes,
      usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
    });
    this.readBuffer = this.device.createBuffer({
      size: bodyBytes,
      usage: usage.COPY_DST | usage.MAP_READ
    });
    this.paramBuffer = this.device.createBuffer({
      size: PARAM_BYTES,
      usage: usage.UNIFORM | usage.COPY_DST
    });

    this.device.pushErrorScope?.('validation');
    this.predictPipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: this.device.createShaderModule({ code: PREDICT_SHADER }),
        entryPoint: 'main'
      }
    });
    this.correctPipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: this.device.createShaderModule({ code: CORRECT_SHADER }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`N-body WebGPU validation: ${validationError.message || validationError}`);
    }

    this.device.lost?.then((info) => {
      this.lastError = info?.message || info?.reason || 'N-body WebGPU device lost';
      gpuDisabledReasons.set(this.stateKey, this.lastError);
    });
  }

  async step(state, options) {
    await this.initialize(state.masses.length);
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for N-body worker');

    const bodyData = bodyDataFromState(state);
    const params = new Float32Array([
      state.masses.length,
      normalizeNumber(options.dt, 0.01, 0, Number.MAX_VALUE),
      normalizeNumber(options.gravitationalConstant, 1, 0, Number.MAX_VALUE),
      normalizeNumber(options.softening, 0.001, 0, Number.MAX_VALUE)
    ]);
    const workgroups = Math.ceil(state.masses.length / WORKGROUP_SIZE);
    const encoder = this.device.createCommandEncoder();
    const predictBindGroup = this.device.createBindGroup({
      layout: this.predictPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.currentBuffer } },
        { binding: 1, resource: { buffer: this.predictedBuffer } },
        { binding: 2, resource: { buffer: this.paramBuffer } }
      ]
    });
    const correctBindGroup = this.device.createBindGroup({
      layout: this.correctPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.predictedBuffer } },
        { binding: 1, resource: { buffer: this.nextBuffer } },
        { binding: 2, resource: { buffer: this.paramBuffer } }
      ]
    });

    this.device.queue.writeBuffer(this.currentBuffer, 0, bodyData);
    this.device.queue.writeBuffer(this.paramBuffer, 0, params);

    const predictPass = encoder.beginComputePass();
    predictPass.setPipeline(this.predictPipeline);
    predictPass.setBindGroup(0, predictBindGroup);
    predictPass.dispatchWorkgroups(workgroups);
    predictPass.end();

    const correctPass = encoder.beginComputePass();
    correctPass.setPipeline(this.correctPipeline);
    correctPass.setBindGroup(0, correctBindGroup);
    correctPass.dispatchWorkgroups(workgroups);
    correctPass.end();

    encoder.copyBufferToBuffer(this.nextBuffer, 0, this.readBuffer, 0, bodyData.byteLength);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone?.();
    await this.readBuffer.mapAsync(mapMode.READ);
    const mapped = this.readBuffer.getMappedRange();
    const result = new Float32Array(mapped).slice();
    this.readBuffer.unmap();
    applyBodyDataToState(state, result);
    state.elapsedTime += params[1];
    this.submittedSteps += 1;
    return {
      backend: 'webgpu-direct-sum',
      webgpuStatus: {
        stateKey: this.stateKey,
        bodyCount: state.masses.length,
        submittedSteps: this.submittedSteps
      }
    };
  }
}

function computeAccelerations(state, {
  gravitationalConstant = 1,
  softening = 0.001
} = {}) {
  const count = state.masses.length;
  const accelerations = new Array(count * 3).fill(0);
  const safeG = normalizeNumber(gravitationalConstant, 1, 0, Number.MAX_VALUE);
  const softeningSquared = Math.max(0, Number(softening) || 0) ** 2;
  let potentialEnergy = 0;

  for (let i = 0; i < count; i += 1) {
    const ix = i * 3;
    const mi = state.masses[i];
    for (let j = i + 1; j < count; j += 1) {
      const jx = j * 3;
      const mj = state.masses[j];
      const dx = state.positions[jx] - state.positions[ix];
      const dy = state.positions[jx + 1] - state.positions[ix + 1];
      const dz = state.positions[jx + 2] - state.positions[ix + 2];
      const r2 = dx * dx + dy * dy + dz * dz + softeningSquared + 1e-12;
      const invR = 1 / Math.sqrt(r2);
      const invR3 = invR * invR * invR;
      const factorI = safeG * mj * invR3;
      const factorJ = safeG * mi * invR3;

      accelerations[ix] += dx * factorI;
      accelerations[ix + 1] += dy * factorI;
      accelerations[ix + 2] += dz * factorI;
      accelerations[jx] -= dx * factorJ;
      accelerations[jx + 1] -= dy * factorJ;
      accelerations[jx + 2] -= dz * factorJ;
      potentialEnergy -= safeG * mi * mj * invR;
    }
  }

  return { accelerations, potentialEnergy };
}

function normalizeGravityMode(value, fallback = 'auto') {
  const normalized = String(value || fallback).trim().toLowerCase();
  if (['tree', 'barnes-hut', 'barnes_hut', 'bh'].includes(normalized)) return 'tree';
  if (['direct', 'direct-sum', 'direct_sum', 'webgpu-direct'].includes(normalized)) return 'direct';
  return 'auto';
}

function resolveTreeOptions(input = {}) {
  return {
    gravityMode: normalizeGravityMode(input.gravityMode ?? input.nbodyMode ?? input.approximationMode ?? 'auto'),
    treeTheta: normalizeNumber(input.treeTheta ?? input.nbodyTheta ?? input.theta, DEFAULT_TREE_THETA, 0.05, 2.5),
    treeLeafSize: normalizeInteger(input.treeLeafSize ?? input.leafSize, DEFAULT_TREE_LEAF_SIZE, 1, 64),
    treeThreshold: normalizeInteger(input.treeThreshold ?? input.nbodyTreeThreshold, DEFAULT_TREE_THRESHOLD, 2, 100000),
    treeMaxDepth: normalizeInteger(input.treeMaxDepth, DEFAULT_TREE_MAX_DEPTH, 4, 64)
  };
}

function directApproximation(count, backend = 'cpu-direct-sum') {
  return {
    schema: N_BODY_GRAVITY_TREE_SCHEMA,
    mode: 'direct-sum',
    backend,
    theta: null,
    leafSize: null,
    treeThreshold: null,
    treeNodeCount: 0,
    maxDepth: 0,
    acceptedCellCount: 0,
    directPairCount: count * Math.max(0, count - 1),
    interactionCount: count * Math.max(0, count - 1),
    forceErrorEstimate: 0
  };
}

function makeTreeNode({ center, halfSize, depth, indices }) {
  return {
    center,
    halfSize,
    depth,
    indices,
    indexSet: null,
    children: null,
    mass: 0,
    centerOfMass: [0, 0, 0]
  };
}

function computeNodeMass(node, state) {
  let mass = 0;
  const centerOfMass = [0, 0, 0];
  for (const index of node.indices) {
    const bodyMass = state.masses[index];
    const offset = index * 3;
    mass += bodyMass;
    centerOfMass[0] += bodyMass * state.positions[offset];
    centerOfMass[1] += bodyMass * state.positions[offset + 1];
    centerOfMass[2] += bodyMass * state.positions[offset + 2];
  }
  if (mass > 0) {
    centerOfMass[0] /= mass;
    centerOfMass[1] /= mass;
    centerOfMass[2] /= mass;
  }
  node.mass = mass;
  node.centerOfMass = centerOfMass;
  node.indexSet = new Set(node.indices);
}

function childOctantForPosition(node, positions, index) {
  const offset = index * 3;
  let octant = 0;
  if (positions[offset] >= node.center[0]) octant |= 1;
  if (positions[offset + 1] >= node.center[1]) octant |= 2;
  if (positions[offset + 2] >= node.center[2]) octant |= 4;
  return octant;
}

function childCenter(node, octant) {
  const quarter = node.halfSize * 0.5;
  return [
    node.center[0] + ((octant & 1) ? quarter : -quarter),
    node.center[1] + ((octant & 2) ? quarter : -quarter),
    node.center[2] + ((octant & 4) ? quarter : -quarter)
  ];
}

function subdivideTreeNode(node, state, options, stats) {
  computeNodeMass(node, state);
  stats.nodeCount += 1;
  stats.maxDepth = Math.max(stats.maxDepth, node.depth);

  if (
    node.indices.length <= options.treeLeafSize
    || node.depth >= options.treeMaxDepth
    || node.halfSize <= 1e-12
  ) {
    return node;
  }

  const childBuckets = Array.from({ length: 8 }, () => []);
  for (const index of node.indices) {
    childBuckets[childOctantForPosition(node, state.positions, index)].push(index);
  }

  const nonEmptyBuckets = childBuckets.filter((bucket) => bucket.length > 0);
  if (nonEmptyBuckets.length <= 1 && nonEmptyBuckets[0]?.length === node.indices.length) {
    return node;
  }

  node.children = [];
  for (let octant = 0; octant < childBuckets.length; octant += 1) {
    const indices = childBuckets[octant];
    if (indices.length === 0) continue;
    const child = makeTreeNode({
      center: childCenter(node, octant),
      halfSize: node.halfSize * 0.5,
      depth: node.depth + 1,
      indices
    });
    node.children.push(subdivideTreeNode(child, state, options, stats));
  }
  return node;
}

function buildBarnesHutTree(state, options) {
  const count = state.masses.length;
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  for (let i = 0; i < count; i += 1) {
    const offset = i * 3;
    const x = state.positions[offset];
    const y = state.positions[offset + 1];
    const z = state.positions[offset + 2];
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    minZ = Math.min(minZ, z);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    maxZ = Math.max(maxZ, z);
  }

  const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 1e-6);
  const root = makeTreeNode({
    center: [
      (minX + maxX) * 0.5,
      (minY + maxY) * 0.5,
      (minZ + maxZ) * 0.5
    ],
    halfSize: span * 0.500001,
    depth: 0,
    indices: Array.from({ length: count }, (_, index) => index)
  });
  const stats = { nodeCount: 0, maxDepth: 0 };
  return {
    root: subdivideTreeNode(root, state, options, stats),
    stats
  };
}

function addBarnesHutAccelerationFromNode(node, state, bodyIndex, options, output, stats) {
  if (!node || node.mass <= 0) return;
  const offset = bodyIndex * 3;
  const dx = node.centerOfMass[0] - state.positions[offset];
  const dy = node.centerOfMass[1] - state.positions[offset + 1];
  const dz = node.centerOfMass[2] - state.positions[offset + 2];
  const distanceSquared = dx * dx + dy * dy + dz * dz;
  const distance = Math.sqrt(distanceSquared + 1e-18);
  const containsSelf = node.indexSet?.has(bodyIndex) || false;
  const width = node.halfSize * 2;

  if (node.children?.length && !containsSelf && width / distance < options.treeTheta) {
    const r2 = distanceSquared + options.softeningSquared + 1e-12;
    const invR = 1 / Math.sqrt(r2);
    const invR3 = invR * invR * invR;
    const factor = options.safeG * node.mass * invR3;
    output[offset] += dx * factor;
    output[offset + 1] += dy * factor;
    output[offset + 2] += dz * factor;
    stats.acceptedCellCount += 1;
    return;
  }

  if (node.children?.length) {
    for (const child of node.children) {
      addBarnesHutAccelerationFromNode(child, state, bodyIndex, options, output, stats);
    }
    return;
  }

  for (const otherIndex of node.indices) {
    if (otherIndex === bodyIndex) continue;
    const otherOffset = otherIndex * 3;
    const bodyMass = state.masses[otherIndex];
    const ddx = state.positions[otherOffset] - state.positions[offset];
    const ddy = state.positions[otherOffset + 1] - state.positions[offset + 1];
    const ddz = state.positions[otherOffset + 2] - state.positions[offset + 2];
    const r2 = ddx * ddx + ddy * ddy + ddz * ddz + options.softeningSquared + 1e-12;
    const invR = 1 / Math.sqrt(r2);
    const invR3 = invR * invR * invR;
    const factor = options.safeG * bodyMass * invR3;
    output[offset] += ddx * factor;
    output[offset + 1] += ddy * factor;
    output[offset + 2] += ddz * factor;
    stats.directPairCount += 1;
  }
}

function computeSingleDirectAcceleration(state, bodyIndex, options) {
  const offset = bodyIndex * 3;
  const acceleration = [0, 0, 0];
  for (let otherIndex = 0; otherIndex < state.masses.length; otherIndex += 1) {
    if (otherIndex === bodyIndex) continue;
    const otherOffset = otherIndex * 3;
    const dx = state.positions[otherOffset] - state.positions[offset];
    const dy = state.positions[otherOffset + 1] - state.positions[offset + 1];
    const dz = state.positions[otherOffset + 2] - state.positions[offset + 2];
    const r2 = dx * dx + dy * dy + dz * dz + options.softeningSquared + 1e-12;
    const invR = 1 / Math.sqrt(r2);
    const invR3 = invR * invR * invR;
    const factor = options.safeG * state.masses[otherIndex] * invR3;
    acceleration[0] += dx * factor;
    acceleration[1] += dy * factor;
    acceleration[2] += dz * factor;
  }
  return acceleration;
}

function estimateTreeForceError(state, treeAccelerations, options, sampleLimit = 16) {
  const count = state.masses.length;
  if (count <= 1) return 0;
  const sampleCount = Math.min(sampleLimit, count);
  const stride = Math.max(1, Math.floor(count / sampleCount));
  let samples = 0;
  let totalRelativeError = 0;
  let maxRelativeError = 0;
  for (let bodyIndex = 0; bodyIndex < count && samples < sampleCount; bodyIndex += stride) {
    const direct = computeSingleDirectAcceleration(state, bodyIndex, options);
    const offset = bodyIndex * 3;
    const approx = [
      treeAccelerations[offset],
      treeAccelerations[offset + 1],
      treeAccelerations[offset + 2]
    ];
    const error = Math.hypot(approx[0] - direct[0], approx[1] - direct[1], approx[2] - direct[2]);
    const scale = Math.max(1e-12, Math.hypot(...direct));
    const relativeError = error / scale;
    totalRelativeError += relativeError;
    maxRelativeError = Math.max(maxRelativeError, relativeError);
    samples += 1;
  }
  return Number((totalRelativeError / Math.max(1, samples)).toPrecision(6));
}

function computeBarnesHutAccelerations(state, options = {}) {
  const count = state.masses.length;
  const safeG = normalizeNumber(options.gravitationalConstant, 1, 0, Number.MAX_VALUE);
  const softeningSquared = Math.max(0, Number(options.softening) || 0) ** 2;
  const treeOptions = {
    ...resolveTreeOptions(options),
    safeG,
    softeningSquared
  };
  const { root, stats: buildStats } = buildBarnesHutTree(state, treeOptions);
  const accelerations = new Array(count * 3).fill(0);
  const traverseStats = {
    acceptedCellCount: 0,
    directPairCount: 0
  };
  for (let bodyIndex = 0; bodyIndex < count; bodyIndex += 1) {
    addBarnesHutAccelerationFromNode(root, state, bodyIndex, treeOptions, accelerations, traverseStats);
  }
  const interactionCount = traverseStats.acceptedCellCount + traverseStats.directPairCount;
  const forceErrorEstimate = estimateTreeForceError(state, accelerations, treeOptions);

  return {
    accelerations,
    approximation: {
      schema: N_BODY_GRAVITY_TREE_SCHEMA,
      mode: 'barnes-hut',
      backend: 'cpu-barnes-hut',
      theta: treeOptions.treeTheta,
      leafSize: treeOptions.treeLeafSize,
      treeThreshold: treeOptions.treeThreshold,
      treeNodeCount: buildStats.nodeCount,
      maxDepth: buildStats.maxDepth,
      acceptedCellCount: traverseStats.acceptedCellCount,
      directPairCount: traverseStats.directPairCount,
      interactionCount,
      forceErrorEstimate
    }
  };
}

export function computeNBodyDiagnostics(input = {}, options = {}) {
  const state = normalizeState(input);
  const count = state.masses.length;
  const totalMomentum = [0, 0, 0];
  const centerOfMass = [0, 0, 0];
  const angularMomentum = [0, 0, 0];
  let totalMass = 0;
  let kineticEnergy = 0;

  for (let i = 0; i < count; i += 1) {
    const offset = i * 3;
    const mass = state.masses[i];
    const px = state.positions[offset];
    const py = state.positions[offset + 1];
    const pz = state.positions[offset + 2];
    const vx = state.velocities[offset];
    const vy = state.velocities[offset + 1];
    const vz = state.velocities[offset + 2];
    totalMass += mass;
    centerOfMass[0] += mass * px;
    centerOfMass[1] += mass * py;
    centerOfMass[2] += mass * pz;
    totalMomentum[0] += mass * vx;
    totalMomentum[1] += mass * vy;
    totalMomentum[2] += mass * vz;
    kineticEnergy += 0.5 * mass * (vx * vx + vy * vy + vz * vz);
    angularMomentum[0] += mass * (py * vz - pz * vy);
    angularMomentum[1] += mass * (pz * vx - px * vz);
    angularMomentum[2] += mass * (px * vy - py * vx);
  }

  if (totalMass > 0) {
    centerOfMass[0] /= totalMass;
    centerOfMass[1] /= totalMass;
    centerOfMass[2] /= totalMass;
  }

  const centerOfMassVelocity = totalMass > 0
    ? totalMomentum.map((value) => value / totalMass)
    : [0, 0, 0];
  const { potentialEnergy } = computeAccelerations(state, options);

  return {
    schema: 'peercompute.multiscale.nbody.diagnostics.v0',
    count,
    totalMass,
    centerOfMass,
    centerOfMassVelocity,
    totalMomentum,
    angularMomentum,
    kineticEnergy,
    potentialEnergy,
    totalEnergy: kineticEnergy + potentialEnergy
  };
}

function norm3(values) {
  return Math.hypot(values[0] || 0, values[1] || 0, values[2] || 0);
}

function conservationFromBaseline(diagnostics, baseline) {
  if (!baseline) {
    return {
      massDrift: 0,
      momentumDrift: 0,
      relativeEnergyDrift: 0
    };
  }
  const energyScale = Math.max(1e-12, Math.abs(baseline.totalEnergy));
  return {
    massDrift: diagnostics.totalMass - baseline.totalMass,
    momentumDrift: norm3([
      diagnostics.totalMomentum[0] - baseline.totalMomentum[0],
      diagnostics.totalMomentum[1] - baseline.totalMomentum[1],
      diagnostics.totalMomentum[2] - baseline.totalMomentum[2]
    ]),
    relativeEnergyDrift: (diagnostics.totalEnergy - baseline.totalEnergy) / energyScale
  };
}

function advanceVelocityVerlet(state, options) {
  const dt = normalizeNumber(options.dt, 0.01, 0, Number.MAX_VALUE);
  const { accelerations: initialAccelerations } = computeAccelerations(state, options);
  const dt2 = dt * dt;

  for (let i = 0; i < state.positions.length; i += 1) {
    state.positions[i] += state.velocities[i] * dt + 0.5 * initialAccelerations[i] * dt2;
  }

  const { accelerations: finalAccelerations } = computeAccelerations(state, options);
  for (let i = 0; i < state.velocities.length; i += 1) {
    state.velocities[i] += 0.5 * (initialAccelerations[i] + finalAccelerations[i]) * dt;
  }
  state.elapsedTime += dt;
  return {
    approximation: directApproximation(state.masses.length, 'cpu-direct-sum')
  };
}

function advanceVelocityVerletBarnesHut(state, options) {
  const dt = normalizeNumber(options.dt, 0.01, 0, Number.MAX_VALUE);
  const initial = computeBarnesHutAccelerations(state, options);
  const dt2 = dt * dt;

  for (let i = 0; i < state.positions.length; i += 1) {
    state.positions[i] += state.velocities[i] * dt + 0.5 * initial.accelerations[i] * dt2;
  }

  const final = computeBarnesHutAccelerations(state, options);
  for (let i = 0; i < state.velocities.length; i += 1) {
    state.velocities[i] += 0.5 * (initial.accelerations[i] + final.accelerations[i]) * dt;
  }
  state.elapsedTime += dt;
  return {
    approximation: final.approximation
  };
}

async function advanceState(state, {
  stateKey,
  input,
  options,
  substeps
}) {
  const substepOptions = { ...options, dt: options.dt / substeps };
  const treeOptions = resolveTreeOptions(input);
  const requestedMode = treeOptions.gravityMode;
  const useTree = requestedMode === 'tree'
    || (requestedMode === 'auto' && state.masses.length >= treeOptions.treeThreshold);
  if (useTree) {
    let approximation = null;
    for (let i = 0; i < substeps; i += 1) {
      const stepResult = advanceVelocityVerletBarnesHut(state, {
        ...substepOptions,
        ...treeOptions
      });
      approximation = stepResult.approximation;
    }
    return {
      backend: 'cpu-barnes-hut',
      approximation,
      webgpuStatus: null,
      webgpuError: null
    };
  }

  const wantsWebGpu = input.enableWebGPU !== false && input.webgpu !== false;
  const webGpuEligible = wantsWebGpu
    && state.masses.length <= normalizeInteger(
      input.webgpuMaxBodies,
      N_BODY_GRAVITY_WEBGPU_MAX_BODIES,
      1,
      16384
    )
    && !gpuDisabledReasons.has(stateKey);

  if (webGpuEligible) {
    try {
      let runtime = gpuRuntimes.get(stateKey);
      if (!runtime) {
        runtime = new NBodyWebGpuRuntime(stateKey);
        gpuRuntimes.set(stateKey, runtime);
      }
      let webgpuStatus = null;
      for (let i = 0; i < substeps; i += 1) {
        const stepResult = await runtime.step(state, substepOptions);
        webgpuStatus = stepResult.webgpuStatus;
      }
      return {
        backend: 'webgpu-direct-sum',
        approximation: directApproximation(state.masses.length, 'webgpu-direct-sum'),
        webgpuStatus,
        webgpuError: null
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      gpuDisabledReasons.set(stateKey, message);
    }
  }

  let approximation = null;
  for (let i = 0; i < substeps; i += 1) {
    const stepResult = advanceVelocityVerlet(state, substepOptions);
    approximation = stepResult.approximation;
  }
  return {
    backend: 'cpu-direct-sum',
    approximation,
    webgpuStatus: null,
    webgpuError: gpuDisabledReasons.get(stateKey) || null
  };
}

function resolveInput(payload = {}) {
  const input = payload.input || payload;
  return {
    payload,
    input,
    stateKey: payload.stateKey || input.stateKey || input.taskId || DEFAULT_STATE_KEY,
    scope: input.scope || payload.scope || payload.solver?.warmDelta?.scope || DEFAULT_DELTA_SCOPE,
    taskId: input.taskId || payload.stateKey || input.stateKey || DEFAULT_STATE_KEY,
    emitCommitDelta: input.emitCommitDelta === true || payload.emitCommitDelta === true
  };
}

function createDeltaPayload({ payload, input, stateKey, state, diagnostics, conservation, backend, approximation, webgpuStatus, webgpuError }) {
  return {
    schema: payload.solver?.warmDelta?.schema || N_BODY_GRAVITY_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'nbody-gravity',
    stateKey,
    backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    count: state.masses.length,
    bodyCount: state.masses.length,
    positions: [...state.positions],
    velocities: [...state.velocities],
    masses: [...state.masses],
    diagnostics,
    conservation,
    approximation,
    webgpuStatus,
    webgpuError,
    units: {
      position: input.positionUnit || 'm',
      mass: input.massUnit || 'kg',
      time: input.timeUnit || 's'
    }
  };
}

export function resetNBodyGravity(input = {}) {
  if (input.stateKey || input.taskId) {
    const key = input.stateKey || input.taskId;
    states.delete(key);
    baselines.delete(key);
    gpuRuntimes.delete(key);
    gpuDisabledReasons.delete(key);
  } else {
    states.clear();
    baselines.clear();
    gpuRuntimes.clear();
    gpuDisabledReasons.clear();
  }
  return {
    ok: true,
    schema: N_BODY_GRAVITY_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

export async function stepNBodyGravity(payload = {}) {
  const resolved = resolveInput(payload);
  const { input, stateKey } = resolved;
  const requestedReset = input.reset === true;
  const nextState = input.state || input.bodies || input.masses || requestedReset || !states.has(stateKey)
    ? normalizeState(input)
    : cloneState(states.get(stateKey));
  const options = {
    gravitationalConstant: normalizeNumber(input.gravitationalConstant, 1, 0, Number.MAX_VALUE),
    softening: normalizeNumber(input.softening, 0.001, 0, Number.MAX_VALUE),
    dt: normalizeNumber(input.dt, 0.01, 0, Number.MAX_VALUE),
    ...resolveTreeOptions(input)
  };
  const substeps = normalizeInteger(input.substeps, 1, 1, 256);

  if (!baselines.has(stateKey) || requestedReset || input.state || input.bodies || input.masses) {
    baselines.set(stateKey, computeNBodyDiagnostics(nextState, options));
  }

  const advanceResult = await advanceState(nextState, {
    stateKey,
    input,
    options,
    substeps
  });
  nextState.sequence += 1;

  states.set(stateKey, cloneState(nextState));
  const diagnostics = computeNBodyDiagnostics(nextState, options);
  const conservation = conservationFromBaseline(diagnostics, baselines.get(stateKey));
  const state = cloneState(nextState);
  const value = {
    ok: true,
    schema: N_BODY_GRAVITY_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'nbody-gravity',
    stateKey,
    backend: advanceResult.backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    state,
    diagnostics,
    conservation,
    approximation: advanceResult.approximation || directApproximation(state.masses.length, advanceResult.backend),
    webgpuStatus: advanceResult.webgpuStatus,
    webgpuError: advanceResult.webgpuError,
    parameters: {
      gravitationalConstant: options.gravitationalConstant,
      softening: options.softening,
      dt: options.dt,
      substeps,
      gravityMode: options.gravityMode,
      treeTheta: options.treeTheta,
      treeLeafSize: options.treeLeafSize,
      treeThreshold: options.treeThreshold
    }
  };

  if (!resolved.emitCommitDelta) return value;

  return {
    value,
    commitDelta: {
      taskId: resolved.taskId,
      scope: resolved.scope,
      version: state.sequence,
      timestamp: Date.now(),
      payload: createDeltaPayload({
        payload,
        input,
        stateKey,
        state,
        diagnostics,
        conservation,
        backend: advanceResult.backend,
        approximation: advanceResult.approximation || directApproximation(state.masses.length, advanceResult.backend),
        webgpuStatus: advanceResult.webgpuStatus,
        webgpuError: advanceResult.webgpuError
      })
    }
  };
}
