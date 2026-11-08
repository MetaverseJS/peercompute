export const MAXWELL_FIELD_STATE_SCHEMA = 'peercompute.multiscale.maxwell.state.v0';
export const MAXWELL_FIELD_RESULT_SCHEMA = 'peercompute.multiscale.maxwell.result.v0';
export const MAXWELL_FIELD_DELTA_SCHEMA = 'peercompute.multiscale.maxwell.delta.v0';

const DEFAULT_STATE_KEY = 'multiscale:maxwell:default';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const FIELD_FLOATS = 12;
const WORKGROUP_SIZE = 64;
const PARAM_FLOATS = 8;
const PARAM_BYTES = PARAM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const states = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const MAXWELL_SHADER = `
struct FieldCell {
  eCharge: vec4f,
  bCurrentX: vec4f,
  currentPad: vec4f,
};

struct Params {
  width: f32,
  height: f32,
  dt: f32,
  lightSpeed: f32,
  damping: f32,
  pad0: f32,
  pad1: f32,
  pad2: f32,
};

@group(0) @binding(0) var<storage, read> currentFields: array<FieldCell>;
@group(0) @binding(1) var<storage, read_write> nextFields: array<FieldCell>;
@group(0) @binding(2) var<uniform> params: Params;

fn cell_index(x: u32, y: u32, width: u32) -> u32 {
  return y * width + x;
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let width = u32(params.width);
  let height = u32(params.height);
  let count = width * height;
  let index = gid.x;
  if (index >= count) {
    return;
  }

  let x = index % width;
  let y = index / width;
  let xp = (x + 1u) % width;
  let xm = (x + width - 1u) % width;
  let yp = (y + 1u) % height;
  let ym = (y + height - 1u) % height;
  let right = cell_index(xp, y, width);
  let left = cell_index(xm, y, width);
  let up = cell_index(x, yp, width);
  let down = cell_index(x, ym, width);

  let cell = currentFields[index];
  let dt = params.dt;
  let damping = params.damping;
  let c = params.lightSpeed;
  let e = cell.eCharge.xyz;
  let b = cell.bCurrentX.xyz;
  let j = vec3f(cell.bCurrentX.w, cell.currentPad.x, cell.currentPad.y);

  let dByDx = (currentFields[right].bCurrentX.y - currentFields[left].bCurrentX.y) * 0.5;
  let dBxDy = (currentFields[up].bCurrentX.x - currentFields[down].bCurrentX.x) * 0.5;
  let curlBz = dByDx - dBxDy;
  let dEzDy = (currentFields[up].eCharge.z - currentFields[down].eCharge.z) * 0.5;
  let dEzDx = (currentFields[right].eCharge.z - currentFields[left].eCharge.z) * 0.5;
  let dEyDx = (currentFields[right].eCharge.y - currentFields[left].eCharge.y) * 0.5;
  let dExDy = (currentFields[up].eCharge.x - currentFields[down].eCharge.x) * 0.5;

  let nextE = vec3f(
    e.x + (dEzDy - j.x) * dt,
    e.y + (-dEzDx - j.y) * dt,
    e.z + (curlBz - j.z) * dt
  ) * damping;
  let nextB = vec3f(
    b.x - dEzDy * dt * c,
    b.y + dEzDx * dt * c,
    b.z - (dEyDx - dExDy) * dt * c
  ) * damping;

  nextFields[index].eCharge = vec4f(nextE, cell.eCharge.w);
  nextFields[index].bCurrentX = vec4f(nextB, cell.bCurrentX.w);
  nextFields[index].currentPad = cell.currentPad;
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeNumber(value, fallback, min = -Number.MAX_VALUE, max = Number.MAX_VALUE) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeInteger(value, fallback, min = 1, max = Number.MAX_SAFE_INTEGER) {
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

function idx(x, y, width) {
  return y * width + x;
}

function neighbor(value, max) {
  return (value + max) % max;
}

function toFiniteArray(values, length, label) {
  const array = Array.from(values || [], (value) => Number(value));
  if (array.length !== length) {
    throw new Error(`${label} length ${array.length} does not match expected ${length}`);
  }
  if (array.some((value) => !Number.isFinite(value))) {
    throw new Error(`${label} contains non-finite values`);
  }
  return array;
}

export function makeMaxwellInitialState({
  width = 16,
  height = 16,
  seed = 20260529,
  amplitude = 0.35
} = {}) {
  const safeWidth = normalizeInteger(width, 16, 4, 128);
  const safeHeight = normalizeInteger(height, 16, 4, 128);
  const cellCount = safeWidth * safeHeight;
  const rng = createRng(seed);
  const electric = new Array(cellCount * 3).fill(0);
  const magnetic = new Array(cellCount * 3).fill(0);
  const chargeDensity = new Array(cellCount).fill(0);
  const currentDensity = new Array(cellCount * 3).fill(0);
  const safeAmplitude = normalizeNumber(amplitude, 0.35, 0, 10);

  for (let y = 0; y < safeHeight; y += 1) {
    for (let x = 0; x < safeWidth; x += 1) {
      const cell = idx(x, y, safeWidth);
      const u = (x / safeWidth - 0.5) * 2;
      const v = (y / safeHeight - 0.5) * 2;
      const r2 = u * u + v * v;
      const pulse = Math.exp(-r2 * 6) * safeAmplitude;
      electric[cell * 3] = -v * pulse;
      electric[cell * 3 + 1] = u * pulse;
      magnetic[cell * 3 + 2] = pulse * 0.65;
      chargeDensity[cell] = (rng() - 0.5) * safeAmplitude * 0.01;
    }
  }

  return {
    schema: MAXWELL_FIELD_STATE_SCHEMA,
    sequence: 0,
    elapsedTime: 0,
    width: safeWidth,
    height: safeHeight,
    electric,
    magnetic,
    chargeDensity,
    currentDensity
  };
}

function normalizeState(input = {}) {
  const source = input.state || input;
  if (!source.electric && !source.magnetic) return makeMaxwellInitialState(input);
  const width = normalizeInteger(source.width, 16, 4, 128);
  const height = normalizeInteger(source.height, 16, 4, 128);
  const cellCount = width * height;
  return {
    schema: MAXWELL_FIELD_STATE_SCHEMA,
    sequence: normalizeInteger(source.sequence, 0, 0),
    elapsedTime: normalizeNumber(source.elapsedTime, 0, 0),
    width,
    height,
    electric: toFiniteArray(source.electric, cellCount * 3, 'electric'),
    magnetic: toFiniteArray(source.magnetic, cellCount * 3, 'magnetic'),
    chargeDensity: toFiniteArray(source.chargeDensity || new Array(cellCount).fill(0), cellCount, 'chargeDensity'),
    currentDensity: toFiniteArray(source.currentDensity || new Array(cellCount * 3).fill(0), cellCount * 3, 'currentDensity')
  };
}

function cloneState(state) {
  return {
    schema: MAXWELL_FIELD_STATE_SCHEMA,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    width: state.width,
    height: state.height,
    electric: [...state.electric],
    magnetic: [...state.magnetic],
    chargeDensity: [...state.chargeDensity],
    currentDensity: [...state.currentDensity]
  };
}

function fieldDataFromState(state) {
  const cellCount = state.width * state.height;
  const data = new Float32Array(cellCount * FIELD_FLOATS);
  for (let i = 0; i < cellCount; i += 1) {
    const src = i * 3;
    const dst = i * FIELD_FLOATS;
    data[dst] = state.electric[src];
    data[dst + 1] = state.electric[src + 1];
    data[dst + 2] = state.electric[src + 2];
    data[dst + 3] = state.chargeDensity[i];
    data[dst + 4] = state.magnetic[src];
    data[dst + 5] = state.magnetic[src + 1];
    data[dst + 6] = state.magnetic[src + 2];
    data[dst + 7] = state.currentDensity[src];
    data[dst + 8] = state.currentDensity[src + 1];
    data[dst + 9] = state.currentDensity[src + 2];
    data[dst + 10] = 0;
    data[dst + 11] = 0;
  }
  return data;
}

function applyFieldDataToState(state, data) {
  const cellCount = state.width * state.height;
  for (let i = 0; i < cellCount; i += 1) {
    const dst = i * 3;
    const src = i * FIELD_FLOATS;
    state.electric[dst] = data[src];
    state.electric[dst + 1] = data[src + 1];
    state.electric[dst + 2] = data[src + 2];
    state.chargeDensity[i] = data[src + 3];
    state.magnetic[dst] = data[src + 4];
    state.magnetic[dst + 1] = data[src + 5];
    state.magnetic[dst + 2] = data[src + 6];
    state.currentDensity[dst] = data[src + 7];
    state.currentDensity[dst + 1] = data[src + 8];
    state.currentDensity[dst + 2] = data[src + 9];
  }
}

class MaxwellWebGpuRuntime {
  constructor(stateKey) {
    this.stateKey = stateKey;
    this.device = null;
    this.pipeline = null;
    this.currentBuffer = null;
    this.nextBuffer = null;
    this.readBuffer = null;
    this.paramBuffer = null;
    this.width = 0;
    this.height = 0;
    this.submittedSteps = 0;
    this.lastError = null;
  }

  async initialize(width, height) {
    if (this.device && this.width === width && this.height === height) return;
    const gpu = globalThis.navigator?.gpu;
    if (!gpu) throw new Error('WebGPU unavailable for Maxwell worker');
    const usage = globalThis.GPUBufferUsage;
    if (!usage) throw new Error('GPUBufferUsage unavailable for Maxwell worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for Maxwell worker');
    this.device = await adapter.requestDevice();
    this.width = width;
    this.height = height;

    const byteLength = width * height * FIELD_FLOATS * Float32Array.BYTES_PER_ELEMENT;
    this.currentBuffer = this.device.createBuffer({
      size: byteLength,
      usage: usage.STORAGE | usage.COPY_DST
    });
    this.nextBuffer = this.device.createBuffer({
      size: byteLength,
      usage: usage.STORAGE | usage.COPY_SRC
    });
    this.readBuffer = this.device.createBuffer({
      size: byteLength,
      usage: usage.COPY_DST | usage.MAP_READ
    });
    this.paramBuffer = this.device.createBuffer({
      size: PARAM_BYTES,
      usage: usage.UNIFORM | usage.COPY_DST
    });

    this.device.pushErrorScope?.('validation');
    this.pipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: this.device.createShaderModule({ code: MAXWELL_SHADER }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`Maxwell WebGPU validation: ${validationError.message || validationError}`);
    }
    this.device.lost?.then((info) => {
      this.lastError = info?.message || info?.reason || 'Maxwell WebGPU device lost';
      gpuDisabledReasons.set(this.stateKey, this.lastError);
    });
  }

  async step(state, input = {}) {
    await this.initialize(state.width, state.height);
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for Maxwell worker');

    const fieldData = fieldDataFromState(state);
    const params = new Float32Array([
      state.width,
      state.height,
      clamp(normalizeNumber(input.dt, 0.01), 0, 0.1),
      normalizeNumber(input.lightSpeed, 1, 0, 10),
      clamp(normalizeNumber(input.damping, 0.996), 0, 1),
      0,
      0,
      0
    ]);
    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.currentBuffer } },
        { binding: 1, resource: { buffer: this.nextBuffer } },
        { binding: 2, resource: { buffer: this.paramBuffer } }
      ]
    });

    this.device.queue.writeBuffer(this.currentBuffer, 0, fieldData);
    this.device.queue.writeBuffer(this.paramBuffer, 0, params);
    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(Math.ceil((state.width * state.height) / WORKGROUP_SIZE));
    pass.end();
    encoder.copyBufferToBuffer(this.nextBuffer, 0, this.readBuffer, 0, fieldData.byteLength);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone?.();
    await this.readBuffer.mapAsync(mapMode.READ);
    const mapped = this.readBuffer.getMappedRange();
    const result = new Float32Array(mapped).slice();
    this.readBuffer.unmap();
    applyFieldDataToState(state, result);
    state.elapsedTime += params[2];
    state.sequence += 1;
    this.submittedSteps += 1;
    return {
      backend: 'webgpu-maxwell-fdtd',
      webgpuStatus: {
        stateKey: this.stateKey,
        width: state.width,
        height: state.height,
        submittedSteps: this.submittedSteps
      }
    };
  }
}

export function computeMaxwellDiagnostics(input = {}) {
  const state = normalizeState(input);
  let electricEnergy = 0;
  let magneticEnergy = 0;
  let netCharge = 0;
  const poyntingFlux = [0, 0, 0];
  const cellCount = state.width * state.height;

  for (let i = 0; i < cellCount; i += 1) {
    const o = i * 3;
    const ex = state.electric[o];
    const ey = state.electric[o + 1];
    const ez = state.electric[o + 2];
    const bx = state.magnetic[o];
    const by = state.magnetic[o + 1];
    const bz = state.magnetic[o + 2];
    electricEnergy += 0.5 * (ex * ex + ey * ey + ez * ez);
    magneticEnergy += 0.5 * (bx * bx + by * by + bz * bz);
    netCharge += state.chargeDensity[i];
    poyntingFlux[0] += ey * bz - ez * by;
    poyntingFlux[1] += ez * bx - ex * bz;
    poyntingFlux[2] += ex * by - ey * bx;
  }

  return {
    schema: 'peercompute.multiscale.maxwell.diagnostics.v0',
    width: state.width,
    height: state.height,
    cellCount,
    electricEnergy,
    magneticEnergy,
    fieldEnergy: electricEnergy + magneticEnergy,
    netCharge,
    poyntingFlux: poyntingFlux.map((value) => value / Math.max(1, cellCount))
  };
}

function advanceMaxwellTile(state, input = {}) {
  const dt = clamp(normalizeNumber(input.dt, 0.01), 0, 0.1);
  const c = normalizeNumber(input.lightSpeed, 1, 0, 10);
  const damping = clamp(normalizeNumber(input.damping, 0.996), 0, 1);
  const width = state.width;
  const height = state.height;
  const nextElectric = [...state.electric];
  const nextMagnetic = [...state.magnetic];

  for (let y = 0; y < height; y += 1) {
    const yp = neighbor(y + 1, height);
    const ym = neighbor(y - 1, height);
    for (let x = 0; x < width; x += 1) {
      const xp = neighbor(x + 1, width);
      const xm = neighbor(x - 1, width);
      const cell = idx(x, y, width);
      const o = cell * 3;
      const right = idx(xp, y, width) * 3;
      const left = idx(xm, y, width) * 3;
      const up = idx(x, yp, width) * 3;
      const down = idx(x, ym, width) * 3;

      const dByDx = (state.magnetic[right + 1] - state.magnetic[left + 1]) * 0.5;
      const dBxDy = (state.magnetic[up] - state.magnetic[down]) * 0.5;
      const curlBz = dByDx - dBxDy;
      const dEzDy = (state.electric[up + 2] - state.electric[down + 2]) * 0.5;
      const dEzDx = (state.electric[right + 2] - state.electric[left + 2]) * 0.5;
      const dEyDx = (state.electric[right + 1] - state.electric[left + 1]) * 0.5;
      const dExDy = (state.electric[up] - state.electric[down]) * 0.5;

      nextElectric[o] = (state.electric[o] + (dEzDy - state.currentDensity[o]) * dt) * damping;
      nextElectric[o + 1] = (state.electric[o + 1] + (-dEzDx - state.currentDensity[o + 1]) * dt) * damping;
      nextElectric[o + 2] = (state.electric[o + 2] + (curlBz - state.currentDensity[o + 2]) * dt) * damping;
      nextMagnetic[o] = (state.magnetic[o] - dEzDy * dt * c) * damping;
      nextMagnetic[o + 1] = (state.magnetic[o + 1] + dEzDx * dt * c) * damping;
      nextMagnetic[o + 2] = (state.magnetic[o + 2] - (dEyDx - dExDy) * dt * c) * damping;
    }
  }

  state.electric = nextElectric;
  state.magnetic = nextMagnetic;
  state.elapsedTime += dt;
  state.sequence += 1;
  return state;
}

async function advanceMaxwellState(state, {
  stateKey,
  input
}) {
  const wantsWebGpu = input.enableWebGPU !== false && input.webgpu !== false;
  const webGpuEligible = wantsWebGpu && !gpuDisabledReasons.has(stateKey);
  if (webGpuEligible) {
    try {
      let runtime = gpuRuntimes.get(stateKey);
      if (!runtime) {
        runtime = new MaxwellWebGpuRuntime(stateKey);
        gpuRuntimes.set(stateKey, runtime);
      }
      return await runtime.step(state, input);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      gpuDisabledReasons.set(stateKey, message);
    }
  }

  advanceMaxwellTile(state, input);
  return {
    backend: 'cpu-maxwell-fdtd',
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

function createDeltaPayload({ payload, stateKey, state, diagnostics, backend, webgpuStatus, webgpuError }) {
  return {
    schema: payload.solver?.warmDelta?.schema || MAXWELL_FIELD_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'maxwell-em',
    stateKey,
    backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    state: cloneState(state),
    diagnostics,
    webgpuStatus,
    webgpuError,
    conservation: {
      netCharge: diagnostics.netCharge,
      fieldEnergy: diagnostics.fieldEnergy,
      chargeAudit: 'periodic-tile-reduced'
    },
    units: {
      electricField: 'reduced V/m',
      magneticField: 'reduced T',
      fieldEnergy: 'reduced J'
    }
  };
}

export function resetMaxwellFields(input = {}) {
  if (input.stateKey || input.taskId) {
    const key = input.stateKey || input.taskId;
    states.delete(key);
    gpuRuntimes.delete(key);
    gpuDisabledReasons.delete(key);
  } else {
    states.clear();
    gpuRuntimes.clear();
    gpuDisabledReasons.clear();
  }
  return {
    ok: true,
    schema: MAXWELL_FIELD_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

export async function stepMaxwellFields(payload = {}) {
  const resolved = resolveInput(payload);
  const { input, stateKey } = resolved;
  const requestedReset = input.reset === true;
  const state = input.state || requestedReset || !states.has(stateKey)
    ? normalizeState(input.state || makeMaxwellInitialState(input))
    : cloneState(states.get(stateKey));
  const advanceResult = await advanceMaxwellState(state, { stateKey, input });
  states.set(stateKey, cloneState(state));
  const diagnostics = computeMaxwellDiagnostics(state);
  const value = {
    ok: true,
    schema: MAXWELL_FIELD_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'maxwell-em',
    stateKey,
    backend: advanceResult.backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    state: cloneState(state),
    diagnostics,
    webgpuStatus: advanceResult.webgpuStatus,
    webgpuError: advanceResult.webgpuError
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
        stateKey,
        state,
        diagnostics,
        backend: advanceResult.backend,
        webgpuStatus: advanceResult.webgpuStatus,
        webgpuError: advanceResult.webgpuError
      })
    }
  };
}
