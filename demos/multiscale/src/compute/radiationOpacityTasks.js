export const RADIATION_OPACITY_STATE_SCHEMA = 'peercompute.multiscale.radiation-opacity.state.v0';
export const RADIATION_OPACITY_RESULT_SCHEMA = 'peercompute.multiscale.radiation-opacity.result.v0';
export const RADIATION_OPACITY_DELTA_SCHEMA = 'peercompute.multiscale.radiation-opacity.delta.v0';
export const RADIATION_OPACITY_WEBGPU_MAX_CELLS = 16384;

const DEFAULT_STATE_KEY = 'multiscale:radiation-opacity:default';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const CELL_FLOATS = 8;
const WORKGROUP_SIZE = 64;
const PARAM_FLOATS = 8;
const PARAM_BYTES = PARAM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const states = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const RADIATION_SHADER = `
struct Cell {
  radTemp: vec4f,
  fluxPower: vec4f,
};

struct Params {
  width: f32,
  height: f32,
  dt: f32,
  stellarFlux: f32,
  fireIntensity: f32,
  ambientTemperatureK: f32,
  cloudCover: f32,
  sootOpacity: f32,
};

@group(0) @binding(0) var<storage, read> currentCells: array<Cell>;
@group(0) @binding(1) var<storage, read_write> nextCells: array<Cell>;
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
  let right = currentCells[cell_index(xp, y, width)];
  let left = currentCells[cell_index(xm, y, width)];
  let up = currentCells[cell_index(x, yp, width)];
  let down = currentCells[cell_index(x, ym, width)];
  let cell = currentCells[index];

  let dt = clamp(params.dt, 0.0, 1.0);
  let u = f32(x) / max(1.0, params.width - 1.0) - 0.5;
  let v = f32(y) / max(1.0, params.height - 1.0) - 0.5;
  let r2 = u * u + v * v;
  let fireSource = exp(-r2 * 26.0) * params.fireIntensity * 3.4;
  let stellarSource = params.stellarFlux * (0.06 + 0.14 * max(0.0, 1.0 - abs(v) * 1.8));

  var radiation = cell.radTemp.x;
  var temperatureK = cell.radTemp.y;
  var opacity = clamp(cell.radTemp.z * 0.965 + (0.035 + params.cloudCover * 0.16 + params.sootOpacity * 0.36) * 0.035, 0.01, 3.0);
  var source = stellarSource + fireSource;

  let laplacian = right.radTemp.x + left.radTemp.x + up.radTemp.x + down.radTemp.x - radiation * 4.0;
  let emission = pow(clamp(temperatureK / 300.0, 0.0, 8.0), 4.0) * 0.042;
  let absorbed = opacity * radiation * 0.09;
  let escape = radiation * (0.014 + opacity * 0.006);
  radiation = max(0.0, radiation + dt * (laplacian * 0.34 + source + emission - absorbed - escape));
  temperatureK = clamp(
    temperatureK + dt * (absorbed * 8.5 + fireSource * 7.5 - emission * 3.1 + (params.ambientTemperatureK - temperatureK) * 0.018),
    120.0,
    2400.0
  );

  let fluxX = -(right.radTemp.x - left.radTemp.x) * 0.5;
  let fluxY = -(up.radTemp.x - down.radTemp.x) * 0.5;
  nextCells[index].radTemp = vec4f(radiation, temperatureK, opacity, source);
  nextCells[index].fluxPower = vec4f(fluxX, fluxY, absorbed, emission);
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

function wrap(value, max) {
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

function couplingValue(coupling = {}, key, fallback) {
  return normalizeNumber(coupling[key], fallback);
}

export function makeRadiationOpacityInitialState({
  width = 18,
  height = 10,
  seed = 20260529,
  environment = {},
  coupling = {}
} = {}) {
  const safeWidth = normalizeInteger(width, 18, 4, 128);
  const safeHeight = normalizeInteger(height, Math.max(4, Math.round(safeWidth / 2)), 4, 128);
  const cellCount = safeWidth * safeHeight;
  const rng = createRng(seed);
  const stellarFlux = normalizeNumber(environment.stellarFlux, 1, 0, 4);
  const ambientTemperatureK = normalizeNumber(environment.ambientTemperatureK, 294, 120, 360);
  const fireIntensity = couplingValue(coupling, 'fireIntensity', 0.2);
  const cloudCover = couplingValue(coupling, 'cloudCover', 0.45);
  const sootOpacity = couplingValue(coupling, 'smokeFraction', couplingValue(coupling, 'sootOpacity', 0.1));
  const radiationEnergy = new Array(cellCount);
  const materialTemperatureK = new Array(cellCount);
  const opacity = new Array(cellCount);
  const sourceStrength = new Array(cellCount);
  const fluxX = new Array(cellCount).fill(0);
  const fluxY = new Array(cellCount).fill(0);
  const absorbedPower = new Array(cellCount).fill(0);
  const emittedPower = new Array(cellCount).fill(0);

  for (let y = 0; y < safeHeight; y += 1) {
    const v = y / Math.max(1, safeHeight - 1) - 0.5;
    for (let x = 0; x < safeWidth; x += 1) {
      const u = x / Math.max(1, safeWidth - 1) - 0.5;
      const cell = idx(x, y, safeWidth);
      const r2 = u * u + v * v;
      const fireSource = Math.exp(-r2 * 26) * fireIntensity * 3.4;
      const stellarSource = stellarFlux * (0.06 + 0.14 * Math.max(0, 1 - Math.abs(v) * 1.8));
      const noise = (rng() - 0.5) * 0.008;
      sourceStrength[cell] = Math.max(0, stellarSource + fireSource);
      opacity[cell] = clamp(0.035 + cloudCover * 0.16 + sootOpacity * 0.36 + noise, 0.01, 3);
      radiationEnergy[cell] = Math.max(0.001, sourceStrength[cell] * 3.2 + opacity[cell] * 0.12 + noise);
      materialTemperatureK[cell] = clamp(ambientTemperatureK + fireSource * 64 + stellarSource * 28 + noise * 120, 120, 2400);
    }
  }

  return {
    schema: RADIATION_OPACITY_STATE_SCHEMA,
    sequence: 0,
    elapsedTime: 0,
    width: safeWidth,
    height: safeHeight,
    radiationEnergy,
    materialTemperatureK,
    opacity,
    sourceStrength,
    fluxX,
    fluxY,
    absorbedPower,
    emittedPower
  };
}

function normalizeState(input = {}) {
  const source = input.state || input;
  if (!source.radiationEnergy && !source.materialTemperatureK) return makeRadiationOpacityInitialState(input);
  const width = normalizeInteger(source.width, 18, 4, 128);
  const height = normalizeInteger(source.height, Math.max(4, Math.round(width / 2)), 4, 128);
  const cellCount = width * height;
  return {
    schema: RADIATION_OPACITY_STATE_SCHEMA,
    sequence: normalizeInteger(source.sequence, 0, 0),
    elapsedTime: normalizeNumber(source.elapsedTime, 0, 0),
    width,
    height,
    radiationEnergy: toFiniteArray(source.radiationEnergy, cellCount, 'radiationEnergy'),
    materialTemperatureK: toFiniteArray(source.materialTemperatureK, cellCount, 'materialTemperatureK'),
    opacity: toFiniteArray(source.opacity || new Array(cellCount).fill(0.05), cellCount, 'opacity'),
    sourceStrength: toFiniteArray(source.sourceStrength || new Array(cellCount).fill(0), cellCount, 'sourceStrength'),
    fluxX: toFiniteArray(source.fluxX || new Array(cellCount).fill(0), cellCount, 'fluxX'),
    fluxY: toFiniteArray(source.fluxY || new Array(cellCount).fill(0), cellCount, 'fluxY'),
    absorbedPower: toFiniteArray(source.absorbedPower || new Array(cellCount).fill(0), cellCount, 'absorbedPower'),
    emittedPower: toFiniteArray(source.emittedPower || new Array(cellCount).fill(0), cellCount, 'emittedPower')
  };
}

function cloneState(state) {
  return {
    schema: RADIATION_OPACITY_STATE_SCHEMA,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    width: state.width,
    height: state.height,
    radiationEnergy: [...state.radiationEnergy],
    materialTemperatureK: [...state.materialTemperatureK],
    opacity: [...state.opacity],
    sourceStrength: [...state.sourceStrength],
    fluxX: [...state.fluxX],
    fluxY: [...state.fluxY],
    absorbedPower: [...state.absorbedPower],
    emittedPower: [...state.emittedPower]
  };
}

function cellDataFromState(state) {
  const cellCount = state.width * state.height;
  const data = new Float32Array(cellCount * CELL_FLOATS);
  for (let i = 0; i < cellCount; i += 1) {
    const dst = i * CELL_FLOATS;
    data[dst] = state.radiationEnergy[i];
    data[dst + 1] = state.materialTemperatureK[i];
    data[dst + 2] = state.opacity[i];
    data[dst + 3] = state.sourceStrength[i];
    data[dst + 4] = state.fluxX[i];
    data[dst + 5] = state.fluxY[i];
    data[dst + 6] = state.absorbedPower[i];
    data[dst + 7] = state.emittedPower[i];
  }
  return data;
}

function applyCellDataToState(state, data) {
  const cellCount = state.width * state.height;
  for (let i = 0; i < cellCount; i += 1) {
    const src = i * CELL_FLOATS;
    state.radiationEnergy[i] = data[src];
    state.materialTemperatureK[i] = data[src + 1];
    state.opacity[i] = data[src + 2];
    state.sourceStrength[i] = data[src + 3];
    state.fluxX[i] = data[src + 4];
    state.fluxY[i] = data[src + 5];
    state.absorbedPower[i] = data[src + 6];
    state.emittedPower[i] = data[src + 7];
  }
}

export function computeRadiationOpacityDiagnostics(input = {}) {
  const state = normalizeState(input);
  const cellCount = state.width * state.height;
  let totalRadiationEnergy = 0;
  let totalAbsorbedPower = 0;
  let totalEmittedPower = 0;
  let maxFluxMagnitude = 0;
  let meanTemperatureK = 0;
  let meanOpacity = 0;
  let sourcePower = 0;

  for (let i = 0; i < cellCount; i += 1) {
    totalRadiationEnergy += state.radiationEnergy[i];
    totalAbsorbedPower += state.absorbedPower[i];
    totalEmittedPower += state.emittedPower[i];
    meanTemperatureK += state.materialTemperatureK[i];
    meanOpacity += state.opacity[i];
    sourcePower += state.sourceStrength[i];
    maxFluxMagnitude = Math.max(maxFluxMagnitude, Math.hypot(state.fluxX[i], state.fluxY[i]));
  }

  meanTemperatureK /= Math.max(1, cellCount);
  meanOpacity /= Math.max(1, cellCount);
  const opticalDepth = meanOpacity * Math.sqrt(cellCount);
  const greenhouseFactor = clamp(opticalDepth / (1 + opticalDepth), 0, 1);

  return {
    schema: 'peercompute.multiscale.radiation-opacity.diagnostics.v0',
    width: state.width,
    height: state.height,
    cellCount,
    totalRadiationEnergy,
    meanRadiationEnergy: totalRadiationEnergy / Math.max(1, cellCount),
    totalAbsorbedPower,
    totalEmittedPower,
    sourcePower,
    meanTemperatureK,
    meanOpacity,
    opticalDepth,
    greenhouseFactor,
    maxFluxMagnitude
  };
}

class RadiationOpacityWebGpuRuntime {
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
    if (!gpu) throw new Error('WebGPU unavailable for radiation-opacity worker');
    const usage = globalThis.GPUBufferUsage;
    if (!usage) throw new Error('GPUBufferUsage unavailable for radiation-opacity worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for radiation-opacity worker');
    this.device = await adapter.requestDevice();
    this.width = width;
    this.height = height;

    const cellBytes = width * height * CELL_FLOATS * Float32Array.BYTES_PER_ELEMENT;
    this.currentBuffer = this.device.createBuffer({
      size: cellBytes,
      usage: usage.STORAGE | usage.COPY_DST
    });
    this.nextBuffer = this.device.createBuffer({
      size: cellBytes,
      usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
    });
    this.readBuffer = this.device.createBuffer({
      size: cellBytes,
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
        module: this.device.createShaderModule({ code: RADIATION_SHADER }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`Radiation WebGPU validation: ${validationError.message || validationError}`);
    }

    this.device.lost?.then((info) => {
      this.lastError = info?.message || info?.reason || 'Radiation WebGPU device lost';
      gpuDisabledReasons.set(this.stateKey, this.lastError);
    });
  }

  async step(state, options) {
    await this.initialize(state.width, state.height);
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for radiation-opacity worker');
    const cellData = cellDataFromState(state);
    const params = new Float32Array([
      state.width,
      state.height,
      options.dt,
      options.stellarFlux,
      options.fireIntensity,
      options.ambientTemperatureK,
      options.cloudCover,
      options.sootOpacity
    ]);
    const workgroups = Math.ceil((state.width * state.height) / WORKGROUP_SIZE);
    const encoder = this.device.createCommandEncoder();
    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.currentBuffer } },
        { binding: 1, resource: { buffer: this.nextBuffer } },
        { binding: 2, resource: { buffer: this.paramBuffer } }
      ]
    });

    this.device.queue.writeBuffer(this.currentBuffer, 0, cellData);
    this.device.queue.writeBuffer(this.paramBuffer, 0, params);
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(workgroups);
    pass.end();
    encoder.copyBufferToBuffer(this.nextBuffer, 0, this.readBuffer, 0, cellData.byteLength);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone?.();
    await this.readBuffer.mapAsync(mapMode.READ);
    const mapped = this.readBuffer.getMappedRange();
    const result = new Float32Array(mapped).slice();
    this.readBuffer.unmap();
    applyCellDataToState(state, result);
    state.elapsedTime += options.dt;
    this.submittedSteps += 1;
    return {
      backend: 'webgpu-radiation-opacity',
      webgpuStatus: {
        stateKey: this.stateKey,
        width: state.width,
        height: state.height,
        cellCount: state.width * state.height,
        submittedSteps: this.submittedSteps
      }
    };
  }
}

function resolveStepOptions(input = {}) {
  const environment = input.environment || {};
  const coupling = input.coupling || {};
  return {
    dt: normalizeNumber(input.dt, 1 / 45, 0, 1),
    stellarFlux: normalizeNumber(environment.stellarFlux ?? input.stellarFlux, 1, 0, 4),
    fireIntensity: normalizeNumber(coupling.fireIntensity ?? input.fireIntensity, 0.2, 0, 2),
    ambientTemperatureK: normalizeNumber(environment.ambientTemperatureK ?? input.ambientTemperatureK, 294, 120, 500),
    cloudCover: normalizeNumber(coupling.cloudCover ?? input.cloudCover, 0.4, 0, 1),
    sootOpacity: normalizeNumber(coupling.smokeFraction ?? coupling.sootOpacity ?? input.sootOpacity, 0.08, 0, 2)
  };
}

function stepRadiationCpu(state, options) {
  const next = cloneState(state);
  for (let y = 0; y < state.height; y += 1) {
    for (let x = 0; x < state.width; x += 1) {
      const cell = idx(x, y, state.width);
      const right = idx(wrap(x + 1, state.width), y, state.width);
      const left = idx(wrap(x - 1, state.width), y, state.width);
      const up = idx(x, wrap(y + 1, state.height), state.width);
      const down = idx(x, wrap(y - 1, state.height), state.width);
      const u = x / Math.max(1, state.width - 1) - 0.5;
      const v = y / Math.max(1, state.height - 1) - 0.5;
      const r2 = u * u + v * v;
      const fireSource = Math.exp(-r2 * 26) * options.fireIntensity * 3.4;
      const stellarSource = options.stellarFlux * (0.06 + 0.14 * Math.max(0, 1 - Math.abs(v) * 1.8));
      const source = stellarSource + fireSource;
      const opacity = clamp(state.opacity[cell] * 0.965 + (0.035 + options.cloudCover * 0.16 + options.sootOpacity * 0.36) * 0.035, 0.01, 3);
      const laplacian = state.radiationEnergy[right] + state.radiationEnergy[left] + state.radiationEnergy[up] + state.radiationEnergy[down] - state.radiationEnergy[cell] * 4;
      const emission = Math.pow(clamp(state.materialTemperatureK[cell] / 300, 0, 8), 4) * 0.042;
      const absorbed = opacity * state.radiationEnergy[cell] * 0.09;
      const escape = state.radiationEnergy[cell] * (0.014 + opacity * 0.006);
      next.radiationEnergy[cell] = Math.max(0, state.radiationEnergy[cell] + options.dt * (laplacian * 0.34 + source + emission - absorbed - escape));
      next.materialTemperatureK[cell] = clamp(
        state.materialTemperatureK[cell] + options.dt * (absorbed * 8.5 + fireSource * 7.5 - emission * 3.1 + (options.ambientTemperatureK - state.materialTemperatureK[cell]) * 0.018),
        120,
        2400
      );
      next.opacity[cell] = opacity;
      next.sourceStrength[cell] = source;
      next.fluxX[cell] = -(state.radiationEnergy[right] - state.radiationEnergy[left]) * 0.5;
      next.fluxY[cell] = -(state.radiationEnergy[up] - state.radiationEnergy[down]) * 0.5;
      next.absorbedPower[cell] = absorbed;
      next.emittedPower[cell] = emission;
    }
  }
  next.elapsedTime += options.dt;
  return next;
}

async function advanceState(state, { stateKey, input, options }) {
  const cellCount = state.width * state.height;
  const wantsWebGpu = input.enableWebGPU !== false && input.webgpu !== false;
  const webGpuEligible = wantsWebGpu
    && cellCount <= normalizeInteger(input.webgpuMaxCells, RADIATION_OPACITY_WEBGPU_MAX_CELLS, 1, 1048576)
    && !gpuDisabledReasons.has(stateKey);

  if (webGpuEligible) {
    try {
      let runtime = gpuRuntimes.get(stateKey);
      if (!runtime) {
        runtime = new RadiationOpacityWebGpuRuntime(stateKey);
        gpuRuntimes.set(stateKey, runtime);
      }
      const stepResult = await runtime.step(state, options);
      return {
        backend: stepResult.backend,
        webgpuStatus: stepResult.webgpuStatus,
        webgpuError: null
      };
    } catch (error) {
      gpuDisabledReasons.set(stateKey, error instanceof Error ? error.message : String(error));
    }
  }

  const next = stepRadiationCpu(state, options);
  Object.assign(state, next);
  return {
    backend: 'cpu-radiation-opacity',
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

function createDeltaPayload({ payload, input, stateKey, state, diagnostics, conservation, backend, webgpuStatus, webgpuError }) {
  return {
    schema: payload.solver?.warmDelta?.schema || RADIATION_OPACITY_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'radiation-opacity',
    stateKey,
    backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    width: state.width,
    height: state.height,
    cellCount: state.width * state.height,
    diagnostics,
    conservation,
    state,
    webgpuStatus,
    webgpuError,
    units: {
      radiationEnergy: input.radiationEnergyUnit || 'reduced-J/m^3',
      temperature: 'K',
      opacity: input.opacityUnit || 'reduced-1/m',
      time: input.timeUnit || 's'
    }
  };
}

export function resetRadiationOpacity(input = {}) {
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
    schema: RADIATION_OPACITY_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

export async function stepRadiationOpacity(payload = {}) {
  const resolved = resolveInput(payload);
  const { input, stateKey } = resolved;
  const requestedReset = input.reset === true;
  const nextState = input.state || requestedReset || !states.has(stateKey)
    ? normalizeState(input)
    : cloneState(states.get(stateKey));
  const before = computeRadiationOpacityDiagnostics(nextState);
  const options = resolveStepOptions(input);
  const advanceResult = await advanceState(nextState, {
    stateKey,
    input,
    options
  });
  nextState.sequence += 1;
  states.set(stateKey, cloneState(nextState));
  const diagnostics = computeRadiationOpacityDiagnostics(nextState);
  const conservation = {
    radiationEnergyDelta: diagnostics.totalRadiationEnergy - before.totalRadiationEnergy,
    absorbedMinusEmitted: diagnostics.totalAbsorbedPower - diagnostics.totalEmittedPower,
    energyMode: 'reduced-grey-radiation-opacity',
    note: 'Reduced interactive transport; not full radiative-transfer energy conservation.'
  };
  const state = cloneState(nextState);
  const value = {
    ok: true,
    schema: RADIATION_OPACITY_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'radiation-opacity',
    stateKey,
    backend: advanceResult.backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    state,
    diagnostics,
    conservation,
    webgpuStatus: advanceResult.webgpuStatus,
    webgpuError: advanceResult.webgpuError,
    parameters: options
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
        webgpuStatus: advanceResult.webgpuStatus,
        webgpuError: advanceResult.webgpuError
      })
    }
  };
}
