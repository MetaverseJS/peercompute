export const COMBUSTION_PLUME_STATE_SCHEMA = 'peercompute.multiscale.combustion-plume.state.v0';
export const COMBUSTION_PLUME_RESULT_SCHEMA = 'peercompute.multiscale.combustion-plume.result.v0';
export const COMBUSTION_PLUME_DELTA_SCHEMA = 'peercompute.multiscale.combustion-plume.delta.v0';
export const COMBUSTION_PLUME_WEBGPU_MAX_CELLS = 16384;

const DEFAULT_STATE_KEY = 'multiscale:combustion-plume:default';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const CELL_FLOATS = 8;
const PARAM_FLOATS = 12;
const PARAM_BYTES = PARAM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const WORKGROUP_SIZE = 64;
const states = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const COMBUSTION_SHADER = `
struct Cell {
  thermalFuel: vec4f,
  smokeWind: vec4f,
};

struct Params {
  width: f32,
  height: f32,
  dt: f32,
  ambientTemperatureK: f32,
  oxygenBoundary: f32,
  waterContact: f32,
  radiativeHeatFlux: f32,
  windX: f32,
  windY: f32,
  ignition: f32,
  spreadRate: f32,
  pad0: f32,
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

  let dt = clamp(params.dt, 0.0, 0.25);
  let u = f32(x) / max(1.0, params.width - 1.0) - 0.5;
  let v = f32(y) / max(1.0, params.height - 1.0) - 0.5;
  let r2 = u * u + v * v;
  let ignitionSource = exp(-r2 * 22.0) * params.ignition;

  var temperatureK = cell.thermalFuel.x;
  var fuel = clamp(cell.thermalFuel.y, 0.0, 2.0);
  var oxygen = clamp(cell.thermalFuel.z, 0.0, 1.0);
  var water = clamp(cell.thermalFuel.w, 0.0, 1.5);
  var smoke = clamp(cell.smokeWind.x, 0.0, 2.0);

  let neighborTemp = (right.thermalFuel.x + left.thermalFuel.x + up.thermalFuel.x + down.thermalFuel.x) * 0.25;
  let neighborSmoke = (right.smokeWind.x + left.smokeWind.x + up.smokeWind.x + down.smokeWind.x) * 0.25;
  let neighborOxygen = (right.thermalFuel.z + left.thermalFuel.z + up.thermalFuel.z + down.thermalFuel.z) * 0.25;
  let neighborFuel = (right.thermalFuel.y + left.thermalFuel.y + up.thermalFuel.y + down.thermalFuel.y) * 0.25;
  var windTemp = temperatureK;
  var windSmoke = smoke;
  var windOxygen = oxygen;
  if (abs(params.windY) >= abs(params.windX)) {
    if (params.windY >= 0.0) {
      windTemp = down.thermalFuel.x;
      windSmoke = down.smokeWind.x;
      windOxygen = down.thermalFuel.z;
    } else {
      windTemp = up.thermalFuel.x;
      windSmoke = up.smokeWind.x;
      windOxygen = up.thermalFuel.z;
    }
  } else {
    if (params.windX >= 0.0) {
      windTemp = left.thermalFuel.x;
      windSmoke = left.smokeWind.x;
      windOxygen = left.thermalFuel.z;
    } else {
      windTemp = right.thermalFuel.x;
      windSmoke = right.smokeWind.x;
      windOxygen = right.thermalFuel.z;
    }
  }
  let windMix = clamp(length(vec2f(params.windX, params.windY)) * dt * 0.075, 0.0, 0.28);

  fuel = fuel + (neighborFuel - fuel) * dt * 0.04;
  oxygen = oxygen + (neighborOxygen - oxygen) * dt * 0.18 + (params.oxygenBoundary - oxygen) * dt * 0.12;
  smoke = smoke + (neighborSmoke - smoke) * dt * 0.26;
  water = clamp(water + params.waterContact * dt * (0.08 + ignitionSource * 0.25) - max(temperatureK - 373.15, 0.0) * water * dt * 0.00035, 0.0, 1.5);

  let thermalActivation = clamp((temperatureK - 520.0) / 820.0, 0.0, 1.0);
  let oxygenDrive = clamp(oxygen / 0.21, 0.0, 2.0);
  let suppression = clamp(1.0 - water * 0.72, 0.0, 1.0);
  let reactionRate = clamp((thermalActivation * params.spreadRate + ignitionSource * 0.55) * oxygenDrive * fuel * suppression, 0.0, 2.2);
  let fuelBurn = min(fuel, reactionRate * dt * 0.052);
  let oxygenBurn = min(oxygen, fuelBurn * 0.64);
  let heatInput = fuelBurn * 6800.0;
  let radiativeInput = clamp(params.radiativeHeatFlux, -5000.0, 5000.0) * dt * 0.025;
  let waterCooling = water * max(temperatureK - 340.0, 0.0) * dt * 0.38;
  let ambientLoss = max(temperatureK - params.ambientTemperatureK, 0.0) * dt * 0.2;
  let thermalDiffusion = (neighborTemp - temperatureK) * dt * 0.24;
  let buoyancyMix = clamp(thermalActivation * smoke * dt * 0.18, 0.0, 0.08);

  fuel = max(0.0, fuel - fuelBurn);
  oxygen = max(0.0, oxygen - oxygenBurn);
  oxygen = clamp(oxygen + (windOxygen - oxygen) * windMix * 0.65, 0.0, 1.0);
  temperatureK = clamp(temperatureK + heatInput + radiativeInput + thermalDiffusion - waterCooling - ambientLoss, params.ambientTemperatureK, 2600.0);
  temperatureK = clamp(temperatureK + (windTemp - temperatureK) * windMix + (down.thermalFuel.x - temperatureK) * buoyancyMix * 0.35, params.ambientTemperatureK, 2600.0);
  smoke = clamp(smoke + fuelBurn * 1.35 - smoke * dt * (0.08 + water * 0.04), 0.0, 2.0);
  smoke = clamp(smoke + (windSmoke - smoke) * windMix + (down.smokeWind.x - smoke) * buoyancyMix, 0.0, 2.0);

  nextCells[index].thermalFuel = vec4f(temperatureK, fuel, oxygen, water);
  nextCells[index].smokeWind = vec4f(smoke, params.windX, params.windY, heatInput / max(dt, 0.000000001));
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

function toFiniteArray(values, length, label, fallback = 0) {
  const array = Array.from(values || new Array(length).fill(fallback), (value) => Number(value));
  if (array.length !== length) {
    throw new Error(`${label} length ${array.length} does not match expected ${length}`);
  }
  if (array.some((value) => !Number.isFinite(value))) {
    throw new Error(`${label} contains non-finite values`);
  }
  return array;
}

export function makeCombustionPlumeInitialState({
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
  const ambientTemperatureK = normalizeNumber(environment.ambientTemperatureK, 294, 120, 600);
  const oxygen = clamp(normalizeNumber(environment.oxygenFraction, 0.21), 0, 1);
  const ignition = clamp(normalizeNumber(coupling.fireIntensity, 0.7), 0, 2);
  const waterContact = clamp(normalizeNumber(coupling.waterContact, 0), 0, 1.5);
  const temperatureK = new Array(cellCount);
  const fuel = new Array(cellCount);
  const oxygenFraction = new Array(cellCount);
  const smoke = new Array(cellCount);
  const water = new Array(cellCount);
  const heatRelease = new Array(cellCount);
  const windX = new Array(cellCount);
  const windY = new Array(cellCount);

  for (let y = 0; y < safeHeight; y += 1) {
    const v = y / Math.max(1, safeHeight - 1) - 0.5;
    for (let x = 0; x < safeWidth; x += 1) {
      const u = x / Math.max(1, safeWidth - 1) - 0.5;
      const cell = idx(x, y, safeWidth);
      const r2 = u * u + v * v;
      const source = Math.exp(-r2 * 22) * ignition;
      const noise = (rng() - 0.5) * 0.04;
      temperatureK[cell] = clamp(ambientTemperatureK + source * 520 + noise * 90, ambientTemperatureK, 2200);
      fuel[cell] = clamp(0.62 + noise + (1 - Math.abs(v)) * 0.16, 0, 1.4);
      oxygenFraction[cell] = oxygen;
      smoke[cell] = clamp(source * 0.08, 0, 1);
      water[cell] = clamp(waterContact * Math.exp(-r2 * 12), 0, 1.5);
      heatRelease[cell] = 0;
      windX[cell] = 0;
      windY[cell] = 0.2;
    }
  }

  return {
    schema: COMBUSTION_PLUME_STATE_SCHEMA,
    sequence: 0,
    elapsedTime: 0,
    width: safeWidth,
    height: safeHeight,
    ambientTemperatureK,
    oxygenReference: oxygen,
    temperatureK,
    fuel,
    oxygenFraction,
    smoke,
    water,
    heatRelease,
    windX,
    windY
  };
}

function normalizeState(input = {}) {
  const source = input.state || input;
  if (!source.temperatureK || !source.fuel) return makeCombustionPlumeInitialState(input);
  const width = normalizeInteger(source.width, 18, 4, 128);
  const height = normalizeInteger(source.height, Math.max(4, Math.round(width / 2)), 4, 128);
  const cellCount = width * height;
  return {
    schema: COMBUSTION_PLUME_STATE_SCHEMA,
    sequence: normalizeInteger(source.sequence, 0, 0),
    elapsedTime: normalizeNumber(source.elapsedTime, 0, 0),
    width,
    height,
    ambientTemperatureK: normalizeNumber(source.ambientTemperatureK, 294, 120, 600),
    oxygenReference: clamp(normalizeNumber(source.oxygenReference, 0.21), 0.001, 1),
    temperatureK: toFiniteArray(source.temperatureK, cellCount, 'temperatureK', 294),
    fuel: toFiniteArray(source.fuel, cellCount, 'fuel', 0),
    oxygenFraction: toFiniteArray(source.oxygenFraction, cellCount, 'oxygenFraction', 0.21),
    smoke: toFiniteArray(source.smoke, cellCount, 'smoke', 0),
    water: toFiniteArray(source.water, cellCount, 'water', 0),
    heatRelease: toFiniteArray(source.heatRelease, cellCount, 'heatRelease', 0),
    windX: toFiniteArray(source.windX, cellCount, 'windX', 0),
    windY: toFiniteArray(source.windY, cellCount, 'windY', 0)
  };
}

function cloneState(state) {
  return {
    schema: COMBUSTION_PLUME_STATE_SCHEMA,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    width: state.width,
    height: state.height,
    ambientTemperatureK: state.ambientTemperatureK,
    oxygenReference: state.oxygenReference,
    temperatureK: [...state.temperatureK],
    fuel: [...state.fuel],
    oxygenFraction: [...state.oxygenFraction],
    smoke: [...state.smoke],
    water: [...state.water],
    heatRelease: [...state.heatRelease],
    windX: [...state.windX],
    windY: [...state.windY]
  };
}

function cellDataFromState(state) {
  const cellCount = state.width * state.height;
  const data = new Float32Array(cellCount * CELL_FLOATS);
  for (let i = 0; i < cellCount; i += 1) {
    const dst = i * CELL_FLOATS;
    data[dst] = state.temperatureK[i];
    data[dst + 1] = state.fuel[i];
    data[dst + 2] = state.oxygenFraction[i];
    data[dst + 3] = state.water[i];
    data[dst + 4] = state.smoke[i];
    data[dst + 5] = state.windX[i];
    data[dst + 6] = state.windY[i];
    data[dst + 7] = state.heatRelease[i];
  }
  return data;
}

function applyCellDataToState(state, data) {
  const cellCount = state.width * state.height;
  for (let i = 0; i < cellCount; i += 1) {
    const src = i * CELL_FLOATS;
    state.temperatureK[i] = data[src];
    state.fuel[i] = data[src + 1];
    state.oxygenFraction[i] = data[src + 2];
    state.water[i] = data[src + 3];
    state.smoke[i] = data[src + 4];
    state.windX[i] = data[src + 5];
    state.windY[i] = data[src + 6];
    state.heatRelease[i] = data[src + 7];
  }
}

function resolveStepOptions(input = {}) {
  const environment = input.environment || {};
  const coupling = input.coupling || {};
  const hydroWind = coupling.wind || coupling.hydroWind || [0, 0];
  return {
    dt: normalizeNumber(input.dt, 1 / 45, 0, 0.25),
    ambientTemperatureK: normalizeNumber(environment.ambientTemperatureK, 294, 120, 600),
    oxygenBoundary: clamp(normalizeNumber(environment.oxygenFraction, 0.21), 0, 1),
    waterContact: clamp(normalizeNumber(coupling.waterContact ?? coupling.coolingPotential, 0), 0, 1.5),
    radiativeHeatFlux: normalizeNumber(coupling.radiativeHeatFlux, 0, -5000, 5000),
    windX: normalizeNumber(hydroWind[0], 0, -100, 100),
    windY: normalizeNumber(hydroWind[1], 0.2, -100, 100),
    ignition: clamp(normalizeNumber(coupling.fireIntensity, 0.7), 0, 2),
    spreadRate: normalizeNumber(input.spreadRate ?? coupling.spreadRate, 0.62, 0, 4)
  };
}

export function computeCombustionPlumeDiagnostics(input = {}) {
  const state = normalizeState(input);
  const cellCount = state.width * state.height;
  let meanTemperatureK = 0;
  let maxTemperatureK = 0;
  let fireAreaFraction = 0;
  let smokeColumn = 0;
  let fuelRemaining = 0;
  let oxygenMean = 0;
  let waterMean = 0;
  let heatReleaseMean = 0;
  let smokeWeightedX = 0;
  let smokeWeightedY = 0;
  let smokeWeight = 0;
  let buoyancyFlux = 0;
  const ambientTemperatureK = normalizeNumber(state.ambientTemperatureK, 294, 120, 600);
  const oxygenReference = Math.max(0.001, clamp(normalizeNumber(state.oxygenReference, 0.21), 0.001, 1));

  for (let i = 0; i < cellCount; i += 1) {
    const temperature = state.temperatureK[i];
    const x = i % state.width;
    const y = Math.floor(i / state.width);
    const u = x / Math.max(1, state.width - 1) - 0.5;
    const v = y / Math.max(1, state.height - 1) - 0.5;
    const smoke = Math.max(0, state.smoke[i]);
    meanTemperatureK += temperature;
    maxTemperatureK = Math.max(maxTemperatureK, temperature);
    if (temperature > 650 && state.fuel[i] > 0.03) fireAreaFraction += 1;
    smokeColumn += smoke;
    fuelRemaining += state.fuel[i];
    oxygenMean += state.oxygenFraction[i];
    waterMean += state.water[i];
    heatReleaseMean += state.heatRelease[i];
    smokeWeightedX += u * smoke;
    smokeWeightedY += v * smoke;
    smokeWeight += smoke;
    buoyancyFlux += Math.max(0, temperature - ambientTemperatureK) * smoke;
  }

  oxygenMean /= Math.max(1, cellCount);
  const smokeCentroidX = smokeWeight > 1e-9 ? smokeWeightedX / smokeWeight : 0;
  const smokeCentroidY = smokeWeight > 1e-9 ? smokeWeightedY / smokeWeight : 0;
  return {
    schema: 'peercompute.multiscale.combustion-plume.diagnostics.v0',
    width: state.width,
    height: state.height,
    cellCount,
    meanTemperatureK: meanTemperatureK / Math.max(1, cellCount),
    maxTemperatureK,
    fireAreaFraction: fireAreaFraction / Math.max(1, cellCount),
    smokeColumn: smokeColumn / Math.max(1, cellCount),
    fuelRemaining: fuelRemaining / Math.max(1, cellCount),
    oxygenMean,
    oxygenDepletion: clamp(1 - oxygenMean / oxygenReference, 0, 1),
    waterMean: waterMean / Math.max(1, cellCount),
    heatReleaseMean: heatReleaseMean / Math.max(1, cellCount),
    smokeCentroidX,
    smokeCentroidY,
    plumeRise: clamp(smokeCentroidY + 0.5, 0, 1),
    buoyancyFlux: buoyancyFlux / Math.max(1, cellCount),
    suppressionMean: waterMean / Math.max(1, cellCount)
  };
}

class CombustionPlumeWebGpuRuntime {
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
    if (!gpu) throw new Error('WebGPU unavailable for combustion plume worker');
    const usage = globalThis.GPUBufferUsage;
    if (!usage) throw new Error('GPUBufferUsage unavailable for combustion plume worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for combustion plume worker');
    this.device = await adapter.requestDevice();
    this.width = width;
    this.height = height;

    const cellBytes = width * height * CELL_FLOATS * Float32Array.BYTES_PER_ELEMENT;
    this.currentBuffer = this.device.createBuffer({ size: cellBytes, usage: usage.STORAGE | usage.COPY_DST });
    this.nextBuffer = this.device.createBuffer({ size: cellBytes, usage: usage.STORAGE | usage.COPY_SRC });
    this.readBuffer = this.device.createBuffer({ size: cellBytes, usage: usage.COPY_DST | usage.MAP_READ });
    this.paramBuffer = this.device.createBuffer({ size: PARAM_BYTES, usage: usage.UNIFORM | usage.COPY_DST });

    this.device.pushErrorScope?.('validation');
    this.pipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: this.device.createShaderModule({ code: COMBUSTION_SHADER }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`Combustion plume WebGPU validation: ${validationError.message || validationError}`);
    }
    this.device.lost?.then((info) => {
      this.lastError = info?.message || info?.reason || 'Combustion plume WebGPU device lost';
      gpuDisabledReasons.set(this.stateKey, this.lastError);
    });
  }

  async step(state, options) {
    await this.initialize(state.width, state.height);
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for combustion plume worker');
    const cellData = cellDataFromState(state);
    const params = new Float32Array([
      state.width,
      state.height,
      options.dt,
      options.ambientTemperatureK,
      options.oxygenBoundary,
      options.waterContact,
      options.radiativeHeatFlux,
      options.windX,
      options.windY,
      options.ignition,
      options.spreadRate,
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

    this.device.queue.writeBuffer(this.currentBuffer, 0, cellData);
    this.device.queue.writeBuffer(this.paramBuffer, 0, params);
    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(Math.ceil((state.width * state.height) / WORKGROUP_SIZE));
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
      backend: 'webgpu-combustion-plume',
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

function stepCombustionCpu(state, options) {
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
      const ignitionSource = Math.exp(-(u * u + v * v) * 22) * options.ignition;
      const neighborTemp = (state.temperatureK[right] + state.temperatureK[left] + state.temperatureK[up] + state.temperatureK[down]) * 0.25;
      const neighborSmoke = (state.smoke[right] + state.smoke[left] + state.smoke[up] + state.smoke[down]) * 0.25;
      const neighborOxygen = (state.oxygenFraction[right] + state.oxygenFraction[left] + state.oxygenFraction[up] + state.oxygenFraction[down]) * 0.25;
      const neighborFuel = (state.fuel[right] + state.fuel[left] + state.fuel[up] + state.fuel[down]) * 0.25;
      const preferY = Math.abs(options.windY) >= Math.abs(options.windX);
      let windCell = state.width > 0 ? left : cell;
      if (preferY) {
        windCell = options.windY >= 0 ? down : up;
      } else {
        windCell = options.windX >= 0 ? left : right;
      }
      const windMix = clamp(Math.hypot(options.windX, options.windY) * options.dt * 0.075, 0, 0.28);

      let fuel = clamp(state.fuel[cell] + (neighborFuel - state.fuel[cell]) * options.dt * 0.04, 0, 2);
      let oxygen = clamp(
        state.oxygenFraction[cell] + (neighborOxygen - state.oxygenFraction[cell]) * options.dt * 0.18
          + (options.oxygenBoundary - state.oxygenFraction[cell]) * options.dt * 0.12,
        0,
        1
      );
      let smoke = clamp(state.smoke[cell] + (neighborSmoke - state.smoke[cell]) * options.dt * 0.26, 0, 2);
      let water = clamp(
        state.water[cell] + options.waterContact * options.dt * (0.08 + ignitionSource * 0.25)
          - Math.max(state.temperatureK[cell] - 373.15, 0) * state.water[cell] * options.dt * 0.00035,
        0,
        1.5
      );
      const thermalActivation = clamp((state.temperatureK[cell] - 520) / 820, 0, 1);
      const oxygenDrive = clamp(oxygen / 0.21, 0, 2);
      const suppression = clamp(1 - water * 0.72, 0, 1);
      const reactionRate = clamp((thermalActivation * options.spreadRate + ignitionSource * 0.55) * oxygenDrive * fuel * suppression, 0, 2.2);
      const fuelBurn = Math.min(fuel, reactionRate * options.dt * 0.052);
      const oxygenBurn = Math.min(oxygen, fuelBurn * 0.64);
      const heatInput = fuelBurn * 6800;
      const radiativeInput = options.radiativeHeatFlux * options.dt * 0.025;
      const waterCooling = water * Math.max(state.temperatureK[cell] - 340, 0) * options.dt * 0.38;
      const ambientLoss = Math.max(state.temperatureK[cell] - options.ambientTemperatureK, 0) * options.dt * 0.2;
      const thermalDiffusion = (neighborTemp - state.temperatureK[cell]) * options.dt * 0.24;
      const buoyancyMix = clamp(thermalActivation * smoke * options.dt * 0.18, 0, 0.08);

      fuel = Math.max(0, fuel - fuelBurn);
      oxygen = Math.max(0, oxygen - oxygenBurn);
      oxygen = clamp(oxygen + (state.oxygenFraction[windCell] - oxygen) * windMix * 0.65, 0, 1);
      next.temperatureK[cell] = clamp(
        state.temperatureK[cell] + heatInput + radiativeInput + thermalDiffusion - waterCooling - ambientLoss,
        options.ambientTemperatureK,
        2600
      );
      next.temperatureK[cell] = clamp(
        next.temperatureK[cell]
          + (state.temperatureK[windCell] - next.temperatureK[cell]) * windMix
          + (state.temperatureK[down] - next.temperatureK[cell]) * buoyancyMix * 0.35,
        options.ambientTemperatureK,
        2600
      );
      smoke = clamp(smoke + fuelBurn * 1.35 - smoke * options.dt * (0.08 + water * 0.04), 0, 2);
      smoke = clamp(smoke + (state.smoke[windCell] - smoke) * windMix + (state.smoke[down] - smoke) * buoyancyMix, 0, 2);
      next.fuel[cell] = fuel;
      next.oxygenFraction[cell] = oxygen;
      next.water[cell] = water;
      next.smoke[cell] = smoke;
      next.windX[cell] = options.windX;
      next.windY[cell] = options.windY;
      next.heatRelease[cell] = heatInput / Math.max(options.dt, 1e-9);
    }
  }
  next.elapsedTime += options.dt;
  return next;
}

async function advanceState(state, { stateKey, input, options }) {
  const cellCount = state.width * state.height;
  const wantsWebGpu = input.enableWebGPU !== false && input.webgpu !== false;
  const webGpuEligible = wantsWebGpu
    && cellCount <= normalizeInteger(input.webgpuMaxCells, COMBUSTION_PLUME_WEBGPU_MAX_CELLS, 1, 1048576)
    && !gpuDisabledReasons.has(stateKey);

  if (webGpuEligible) {
    try {
      let runtime = gpuRuntimes.get(stateKey);
      if (!runtime) {
        runtime = new CombustionPlumeWebGpuRuntime(stateKey);
        gpuRuntimes.set(stateKey, runtime);
      }
      return {
        ...(await runtime.step(state, options)),
        webgpuError: null
      };
    } catch (error) {
      gpuDisabledReasons.set(stateKey, error instanceof Error ? error.message : String(error));
    }
  }

  const next = stepCombustionCpu(state, options);
  Object.assign(state, next);
  return {
    backend: 'cpu-combustion-plume',
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
    schema: payload.solver?.warmDelta?.schema || COMBUSTION_PLUME_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'combustion-plume',
    stateKey,
    backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    width: state.width,
    height: state.height,
    cellCount: state.width * state.height,
    diagnostics,
    conservation,
    state: cloneState(state),
    webgpuStatus,
    webgpuError,
    units: {
      temperature: 'K',
      fuel: 'reduced mass fraction',
      smoke: 'reduced soot/smoke fraction',
      heatRelease: input.heatReleaseUnit || 'reduced W/m^3'
    }
  };
}

export function resetCombustionPlume(input = {}) {
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
    schema: COMBUSTION_PLUME_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

export async function stepCombustionPlume(payload = {}) {
  const resolved = resolveInput(payload);
  const { input, stateKey } = resolved;
  const requestedReset = input.reset === true;
  const nextState = input.state || requestedReset || !states.has(stateKey)
    ? normalizeState(input)
    : cloneState(states.get(stateKey));
  const options = resolveStepOptions(input);
  nextState.ambientTemperatureK = options.ambientTemperatureK;
  nextState.oxygenReference = Math.max(0.001, options.oxygenBoundary);
  const before = computeCombustionPlumeDiagnostics(nextState);
  const advanceResult = await advanceState(nextState, { stateKey, input, options });
  nextState.ambientTemperatureK = options.ambientTemperatureK;
  nextState.oxygenReference = Math.max(0.001, options.oxygenBoundary);
  nextState.sequence += 1;
  states.set(stateKey, cloneState(nextState));
  const diagnostics = computeCombustionPlumeDiagnostics(nextState);
  const conservation = {
    fuelDelta: diagnostics.fuelRemaining - before.fuelRemaining,
    smokeDelta: diagnostics.smokeColumn - before.smokeColumn,
    heatReleaseDelta: diagnostics.heatReleaseMean - before.heatReleaseMean,
    energyMode: 'reduced-combustion-plume',
    note: 'Reduced interactive combustion/plume tile; not closed enthalpy conservation.'
  };
  const state = cloneState(nextState);
  const value = {
    ok: true,
    schema: COMBUSTION_PLUME_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'combustion-plume',
    stateKey,
    backend: advanceResult.backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    state,
    diagnostics,
    conservation,
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
        payload: resolved.payload,
        input,
        stateKey,
        state,
        diagnostics,
        conservation,
        backend: value.backend,
        webgpuStatus: value.webgpuStatus,
        webgpuError: value.webgpuError
      })
    }
  };
}
