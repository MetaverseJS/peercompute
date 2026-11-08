export const STELLAR_FUSION_STATE_SCHEMA = 'peercompute.multiscale.stellar-fusion.state.v0';
export const STELLAR_FUSION_RESULT_SCHEMA = 'peercompute.multiscale.stellar-fusion.result.v0';
export const STELLAR_FUSION_DELTA_SCHEMA = 'peercompute.multiscale.stellar-fusion.delta.v0';
export const STELLAR_FUSION_WEBGPU_MAX_CELLS = 16384;

const DEFAULT_STATE_KEY = 'multiscale:stellar-fusion:default';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const CELL_FLOATS = 8;
const PARAM_FLOATS = 12;
const PARAM_BYTES = PARAM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const WORKGROUP_SIZE = 64;
const states = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const STELLAR_FUSION_SHADER = `
struct Cell {
  thermo: vec4f,
  composition: vec4f,
};

struct Params {
  width: f32,
  height: f32,
  dt: f32,
  stellarFlux: f32,
  gravityMps2: f32,
  metallicity: f32,
  coreTemperatureBias: f32,
  densityCompression: f32,
  radiationPressure: f32,
  opacity: f32,
  magneticActivity: f32,
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
  let r2 = u * u * 1.15 + v * v * 1.7;
  let coreWeight = exp(-r2 * 9.0);

  var temperatureK = clamp(cell.thermo.x, 4500.0, 36000000.0);
  var densityKgM3 = clamp(cell.thermo.y, 1.0, 420000.0);
  var energyDensity = max(0.0, cell.thermo.z);
  var pressurePa = max(0.0, cell.thermo.w);
  var hydrogen = clamp(cell.composition.x, 0.0, 0.95);
  var helium = clamp(cell.composition.y, 0.0, 0.98);

  let neighborTemp = (right.thermo.x + left.thermo.x + up.thermo.x + down.thermo.x) * 0.25;
  let neighborDensity = (right.thermo.y + left.thermo.y + up.thermo.y + down.thermo.y) * 0.25;
  let targetCoreTemp = 15500000.0 * (0.78 + params.coreTemperatureBias * 0.34);
  let tempNorm = clamp(temperatureK / max(1000000.0, targetCoreTemp), 0.02, 3.2);
  let densityNorm = clamp(densityKgM3 / 148000.0, 0.0, 4.0);
  let metalDamp = clamp(1.0 - params.metallicity * 1.8, 0.74, 1.06);
  let magneticBoost = 1.0 + clamp(params.magneticActivity, 0.0, 3.0) * 0.018;
  let fusionRate = clamp(
    densityNorm * hydrogen * hydrogen * pow(tempNorm, 4.0) * coreWeight
      * (0.62 + params.stellarFlux * 0.38) * metalDamp * magneticBoost,
    0.0,
    9.0
  );
  let hydrogenBurn = min(hydrogen, fusionRate * dt * 0.000016);
  let heliumGain = hydrogenBurn * 0.97;
  let neutrinoLoss = fusionRate * densityKgM3 * 0.014 * (1.0 + tempNorm * 0.08);
  let temperatureGain = fusionRate * dt * (85000.0 + params.stellarFlux * 55000.0);
  let compressionHeat = params.densityCompression * coreWeight * 4200.0 * dt;
  let radiativeTransport = (neighborTemp - temperatureK) * dt * 0.035;
  let surfaceCooling = (1.0 - coreWeight) * max(temperatureK - 5800.0, 0.0) * dt * (0.012 + params.opacity * 0.002);
  let radiationPressureCooling = params.radiationPressure * dt * 120.0;

  hydrogen = max(0.0, hydrogen - hydrogenBurn);
  helium = clamp(helium + heliumGain, 0.0, 0.98);
  densityKgM3 = clamp(
    densityKgM3
      + (neighborDensity - densityKgM3) * dt * 0.018
      + coreWeight * params.gravityMps2 * dt * (1.7 + params.densityCompression * 1.2)
      - params.radiationPressure * dt * 0.85
      - fusionRate * dt * 2.5,
    1.0,
    420000.0
  );
  temperatureK = clamp(
    temperatureK + temperatureGain + compressionHeat + radiativeTransport - surfaceCooling - radiationPressureCooling - neutrinoLoss * dt * 0.000001,
    4500.0,
    36000000.0
  );
  let meanMolecularWeight = clamp(0.5 + hydrogen * 0.74 + helium * 0.25 + params.metallicity * 0.08, 0.25, 1.4);
  pressurePa = densityKgM3 * temperatureK * 8.314 * meanMolecularWeight * 820.0;
  energyDensity = max(0.0, energyDensity + hydrogenBurn * densityKgM3 * 640000000000.0 - neutrinoLoss * dt * 14000000.0 + radiativeTransport * densityKgM3 * 0.006);

  nextCells[index].thermo = vec4f(temperatureK, densityKgM3, energyDensity, pressurePa);
  nextCells[index].composition = vec4f(hydrogen, helium, fusionRate, neutrinoLoss);
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

function couplingValue(coupling = {}, key, fallback) {
  return normalizeNumber(coupling[key], fallback);
}

function coreWeightAt(x, y, width, height) {
  const u = x / Math.max(1, width - 1) - 0.5;
  const v = y / Math.max(1, height - 1) - 0.5;
  return Math.exp(-(u * u * 1.15 + v * v * 1.7) * 9);
}

function computeFusionRate({ temperatureK, densityKgM3, hydrogenFraction, coreWeight, options }) {
  const targetCoreTemp = 15500000 * (0.78 + options.coreTemperatureBias * 0.34);
  const tempNorm = clamp(temperatureK / Math.max(1000000, targetCoreTemp), 0.02, 3.2);
  const densityNorm = clamp(densityKgM3 / 148000, 0, 4);
  const metalDamp = clamp(1 - options.metallicity * 1.8, 0.74, 1.06);
  const magneticBoost = 1 + clamp(options.magneticActivity, 0, 3) * 0.018;
  return clamp(
    densityNorm
      * hydrogenFraction
      * hydrogenFraction
      * Math.pow(tempNorm, 4)
      * coreWeight
      * (0.62 + options.stellarFlux * 0.38)
      * metalDamp
      * magneticBoost,
    0,
    9
  );
}

function computePressure({ densityKgM3, temperatureK, hydrogenFraction, heliumFraction, metallicity }) {
  const meanMolecularWeight = clamp(0.5 + hydrogenFraction * 0.74 + heliumFraction * 0.25 + metallicity * 0.08, 0.25, 1.4);
  return Math.max(0, densityKgM3 * temperatureK * 8.314 * meanMolecularWeight * 820);
}

export function makeStellarFusionInitialState({
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
  const stellarFlux = normalizeNumber(environment.stellarFlux, 1, 0.2, 3);
  const metallicity = normalizeNumber(coupling.metallicity ?? environment.metallicity, 0.013, 0, 0.08);
  const coreTemperatureBias = normalizeNumber(coupling.coreTemperatureBias, 1, 0.4, 1.8);
  const options = {
    stellarFlux,
    metallicity,
    coreTemperatureBias,
    magneticActivity: normalizeNumber(coupling.magneticActivity, 0, 0, 3)
  };
  const temperatureK = new Array(cellCount);
  const densityKgM3 = new Array(cellCount);
  const hydrogenFraction = new Array(cellCount);
  const heliumFraction = new Array(cellCount);
  const energyDensity = new Array(cellCount);
  const pressurePa = new Array(cellCount);
  const fusionRate = new Array(cellCount);
  const neutrinoLoss = new Array(cellCount);

  for (let y = 0; y < safeHeight; y += 1) {
    for (let x = 0; x < safeWidth; x += 1) {
      const cell = idx(x, y, safeWidth);
      const coreWeight = coreWeightAt(x, y, safeWidth, safeHeight);
      const noise = (rng() - 0.5) * 0.035;
      const edgeWeight = clamp(1 - Math.sqrt((x / Math.max(1, safeWidth - 1) - 0.5) ** 2 + (y / Math.max(1, safeHeight - 1) - 0.5) ** 2) * 2.2, 0, 1);
      temperatureK[cell] = clamp(
        5800 + coreWeight * 15200000 * (0.72 + stellarFlux * 0.28) + edgeWeight * 1200000 + noise * 240000,
        4500,
        36000000
      );
      densityKgM3[cell] = clamp(220 + coreWeight * 148000 + edgeWeight * 8000 + noise * 1200, 1, 420000);
      hydrogenFraction[cell] = clamp(0.704 - coreWeight * 0.018 + noise * 0.01, 0.1, 0.92);
      heliumFraction[cell] = clamp(0.276 + coreWeight * 0.015 - noise * 0.004, 0.02, 0.9);
      pressurePa[cell] = computePressure({
        densityKgM3: densityKgM3[cell],
        temperatureK: temperatureK[cell],
        hydrogenFraction: hydrogenFraction[cell],
        heliumFraction: heliumFraction[cell],
        metallicity
      });
      energyDensity[cell] = densityKgM3[cell] * temperatureK[cell] * 0.012;
      fusionRate[cell] = computeFusionRate({
        temperatureK: temperatureK[cell],
        densityKgM3: densityKgM3[cell],
        hydrogenFraction: hydrogenFraction[cell],
        coreWeight,
        options
      });
      neutrinoLoss[cell] = fusionRate[cell] * densityKgM3[cell] * 0.014;
    }
  }

  return {
    schema: STELLAR_FUSION_STATE_SCHEMA,
    sequence: 0,
    elapsedTime: 0,
    width: safeWidth,
    height: safeHeight,
    temperatureK,
    densityKgM3,
    hydrogenFraction,
    heliumFraction,
    energyDensity,
    pressurePa,
    fusionRate,
    neutrinoLoss
  };
}

function normalizeState(input = {}) {
  const source = input.state || input;
  if (!source.temperatureK || !source.densityKgM3) return makeStellarFusionInitialState(input);
  const width = normalizeInteger(source.width, 18, 4, 128);
  const height = normalizeInteger(source.height, Math.max(4, Math.round(width / 2)), 4, 128);
  const cellCount = width * height;
  return {
    schema: STELLAR_FUSION_STATE_SCHEMA,
    sequence: normalizeInteger(source.sequence, 0, 0),
    elapsedTime: normalizeNumber(source.elapsedTime, 0, 0),
    width,
    height,
    temperatureK: toFiniteArray(source.temperatureK, cellCount, 'temperatureK', 5800),
    densityKgM3: toFiniteArray(source.densityKgM3, cellCount, 'densityKgM3', 1000),
    hydrogenFraction: toFiniteArray(source.hydrogenFraction, cellCount, 'hydrogenFraction', 0.7),
    heliumFraction: toFiniteArray(source.heliumFraction, cellCount, 'heliumFraction', 0.28),
    energyDensity: toFiniteArray(source.energyDensity, cellCount, 'energyDensity', 0),
    pressurePa: toFiniteArray(source.pressurePa, cellCount, 'pressurePa', 0),
    fusionRate: toFiniteArray(source.fusionRate, cellCount, 'fusionRate', 0),
    neutrinoLoss: toFiniteArray(source.neutrinoLoss, cellCount, 'neutrinoLoss', 0)
  };
}

function cloneState(state) {
  return {
    schema: STELLAR_FUSION_STATE_SCHEMA,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    width: state.width,
    height: state.height,
    temperatureK: [...state.temperatureK],
    densityKgM3: [...state.densityKgM3],
    hydrogenFraction: [...state.hydrogenFraction],
    heliumFraction: [...state.heliumFraction],
    energyDensity: [...state.energyDensity],
    pressurePa: [...state.pressurePa],
    fusionRate: [...state.fusionRate],
    neutrinoLoss: [...state.neutrinoLoss]
  };
}

function cellDataFromState(state) {
  const cellCount = state.width * state.height;
  const data = new Float32Array(cellCount * CELL_FLOATS);
  for (let i = 0; i < cellCount; i += 1) {
    const dst = i * CELL_FLOATS;
    data[dst] = state.temperatureK[i];
    data[dst + 1] = state.densityKgM3[i];
    data[dst + 2] = state.energyDensity[i];
    data[dst + 3] = state.pressurePa[i];
    data[dst + 4] = state.hydrogenFraction[i];
    data[dst + 5] = state.heliumFraction[i];
    data[dst + 6] = state.fusionRate[i];
    data[dst + 7] = state.neutrinoLoss[i];
  }
  return data;
}

function applyCellDataToState(state, data) {
  const cellCount = state.width * state.height;
  for (let i = 0; i < cellCount; i += 1) {
    const src = i * CELL_FLOATS;
    state.temperatureK[i] = data[src];
    state.densityKgM3[i] = data[src + 1];
    state.energyDensity[i] = data[src + 2];
    state.pressurePa[i] = data[src + 3];
    state.hydrogenFraction[i] = data[src + 4];
    state.heliumFraction[i] = data[src + 5];
    state.fusionRate[i] = data[src + 6];
    state.neutrinoLoss[i] = data[src + 7];
  }
}

export function computeStellarFusionDiagnostics(input = {}) {
  const state = normalizeState(input);
  const cellCount = state.width * state.height;
  let meanTemperatureK = 0;
  let meanDensityKgM3 = 0;
  let meanHydrogenFraction = 0;
  let meanHeliumFraction = 0;
  let meanPressurePa = 0;
  let totalEnergyDensity = 0;
  let fusionPowerProxy = 0;
  let neutrinoLossProxy = 0;
  let maxFusionRate = 0;
  let coreTemperatureK = 0;
  let coreDensityKgM3 = 0;
  let coreWeightSum = 0;

  for (let y = 0; y < state.height; y += 1) {
    for (let x = 0; x < state.width; x += 1) {
      const cell = idx(x, y, state.width);
      const coreWeight = coreWeightAt(x, y, state.width, state.height);
      meanTemperatureK += state.temperatureK[cell];
      meanDensityKgM3 += state.densityKgM3[cell];
      meanHydrogenFraction += state.hydrogenFraction[cell];
      meanHeliumFraction += state.heliumFraction[cell];
      meanPressurePa += state.pressurePa[cell];
      totalEnergyDensity += state.energyDensity[cell];
      fusionPowerProxy += state.fusionRate[cell] * state.densityKgM3[cell];
      neutrinoLossProxy += state.neutrinoLoss[cell];
      maxFusionRate = Math.max(maxFusionRate, state.fusionRate[cell]);
      coreTemperatureK += state.temperatureK[cell] * coreWeight;
      coreDensityKgM3 += state.densityKgM3[cell] * coreWeight;
      coreWeightSum += coreWeight;
    }
  }

  meanTemperatureK /= Math.max(1, cellCount);
  meanDensityKgM3 /= Math.max(1, cellCount);
  meanHydrogenFraction /= Math.max(1, cellCount);
  meanHeliumFraction /= Math.max(1, cellCount);
  meanPressurePa /= Math.max(1, cellCount);
  fusionPowerProxy /= Math.max(1, cellCount);
  neutrinoLossProxy /= Math.max(1, cellCount);
  coreTemperatureK /= Math.max(1e-9, coreWeightSum);
  coreDensityKgM3 /= Math.max(1e-9, coreWeightSum);

  return {
    schema: 'peercompute.multiscale.stellar-fusion.diagnostics.v0',
    width: state.width,
    height: state.height,
    cellCount,
    meanTemperatureK,
    coreTemperatureK,
    meanDensityKgM3,
    coreDensityKgM3,
    meanHydrogenFraction,
    meanHeliumFraction,
    meanPressurePa,
    totalEnergyDensity,
    fusionPowerProxy,
    neutrinoLossProxy,
    luminosityProxy: Math.max(0, fusionPowerProxy - neutrinoLossProxy * 0.001),
    meanFusionRate: fusionPowerProxy / Math.max(1, meanDensityKgM3),
    maxFusionRate
  };
}

class StellarFusionWebGpuRuntime {
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
    if (!gpu) throw new Error('WebGPU unavailable for stellar-fusion worker');
    const usage = globalThis.GPUBufferUsage;
    if (!usage) throw new Error('GPUBufferUsage unavailable for stellar-fusion worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for stellar-fusion worker');
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
        module: this.device.createShaderModule({ code: STELLAR_FUSION_SHADER }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`Stellar fusion WebGPU validation: ${validationError.message || validationError}`);
    }

    this.device.lost?.then((info) => {
      this.lastError = info?.message || info?.reason || 'Stellar fusion WebGPU device lost';
      gpuDisabledReasons.set(this.stateKey, this.lastError);
    });
  }

  async step(state, options) {
    await this.initialize(state.width, state.height);
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for stellar-fusion worker');
    const cellData = cellDataFromState(state);
    const params = new Float32Array([
      state.width,
      state.height,
      options.dt,
      options.stellarFlux,
      options.gravityMps2,
      options.metallicity,
      options.coreTemperatureBias,
      options.densityCompression,
      options.radiationPressure,
      options.opacity,
      options.magneticActivity,
      0
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
      backend: 'webgpu-stellar-fusion',
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
    dt: normalizeNumber(input.dt, 1 / 90, 0, 0.25),
    stellarFlux: normalizeNumber(environment.stellarFlux ?? input.stellarFlux, 1, 0.2, 3),
    gravityMps2: normalizeNumber(environment.gravityMps2 ?? input.gravityMps2, 9.8, 0, 28),
    metallicity: normalizeNumber(coupling.metallicity ?? environment.metallicity ?? input.metallicity, 0.013, 0, 0.08),
    coreTemperatureBias: normalizeNumber(coupling.coreTemperatureBias ?? input.coreTemperatureBias, 1, 0.4, 1.8),
    densityCompression: normalizeNumber(coupling.densityCompression ?? input.densityCompression, 0.35, 0, 2.5),
    radiationPressure: normalizeNumber(coupling.radiationPressure ?? input.radiationPressure, 1, 0, 4),
    opacity: normalizeNumber(coupling.opacity ?? input.opacity, 0.08, 0, 3),
    magneticActivity: normalizeNumber(coupling.magneticActivity ?? input.magneticActivity, 0, 0, 3)
  };
}

function stepStellarFusionCpu(state, options) {
  const next = cloneState(state);
  for (let y = 0; y < state.height; y += 1) {
    for (let x = 0; x < state.width; x += 1) {
      const cell = idx(x, y, state.width);
      const right = idx(wrap(x + 1, state.width), y, state.width);
      const left = idx(wrap(x - 1, state.width), y, state.width);
      const up = idx(x, wrap(y + 1, state.height), state.width);
      const down = idx(x, wrap(y - 1, state.height), state.width);
      const coreWeight = coreWeightAt(x, y, state.width, state.height);
      const neighborTemp = (state.temperatureK[right] + state.temperatureK[left] + state.temperatureK[up] + state.temperatureK[down]) * 0.25;
      const neighborDensity = (state.densityKgM3[right] + state.densityKgM3[left] + state.densityKgM3[up] + state.densityKgM3[down]) * 0.25;
      const temperatureK = clamp(state.temperatureK[cell], 4500, 36000000);
      const densityKgM3 = clamp(state.densityKgM3[cell], 1, 420000);
      const hydrogen = clamp(state.hydrogenFraction[cell], 0, 0.95);
      const helium = clamp(state.heliumFraction[cell], 0, 0.98);
      const rate = computeFusionRate({
        temperatureK,
        densityKgM3,
        hydrogenFraction: hydrogen,
        coreWeight,
        options
      });
      const targetCoreTemp = 15500000 * (0.78 + options.coreTemperatureBias * 0.34);
      const tempNorm = clamp(temperatureK / Math.max(1000000, targetCoreTemp), 0.02, 3.2);
      const hydrogenBurn = Math.min(hydrogen, rate * options.dt * 0.000016);
      const heliumGain = hydrogenBurn * 0.97;
      const neutrinoLoss = rate * densityKgM3 * 0.014 * (1 + tempNorm * 0.08);
      const temperatureGain = rate * options.dt * (85000 + options.stellarFlux * 55000);
      const compressionHeat = options.densityCompression * coreWeight * 4200 * options.dt;
      const radiativeTransport = (neighborTemp - temperatureK) * options.dt * 0.035;
      const surfaceCooling = (1 - coreWeight) * Math.max(temperatureK - 5800, 0) * options.dt * (0.012 + options.opacity * 0.002);
      const radiationPressureCooling = options.radiationPressure * options.dt * 120;
      const nextHydrogen = Math.max(0, hydrogen - hydrogenBurn);
      const nextHelium = clamp(helium + heliumGain, 0, 0.98);
      const nextDensity = clamp(
        densityKgM3
          + (neighborDensity - densityKgM3) * options.dt * 0.018
          + coreWeight * options.gravityMps2 * options.dt * (1.7 + options.densityCompression * 1.2)
          - options.radiationPressure * options.dt * 0.85
          - rate * options.dt * 2.5,
        1,
        420000
      );
      const nextTemperature = clamp(
        temperatureK + temperatureGain + compressionHeat + radiativeTransport - surfaceCooling - radiationPressureCooling - neutrinoLoss * options.dt * 0.000001,
        4500,
        36000000
      );
      next.temperatureK[cell] = nextTemperature;
      next.densityKgM3[cell] = nextDensity;
      next.hydrogenFraction[cell] = nextHydrogen;
      next.heliumFraction[cell] = nextHelium;
      next.fusionRate[cell] = rate;
      next.neutrinoLoss[cell] = neutrinoLoss;
      next.pressurePa[cell] = computePressure({
        densityKgM3: nextDensity,
        temperatureK: nextTemperature,
        hydrogenFraction: nextHydrogen,
        heliumFraction: nextHelium,
        metallicity: options.metallicity
      });
      next.energyDensity[cell] = Math.max(
        0,
        state.energyDensity[cell]
          + hydrogenBurn * nextDensity * 640000000000
          - neutrinoLoss * options.dt * 14000000
          + radiativeTransport * nextDensity * 0.006
      );
    }
  }
  next.elapsedTime += options.dt;
  return next;
}

async function advanceState(state, { stateKey, input, options }) {
  const cellCount = state.width * state.height;
  const wantsWebGpu = input.enableWebGPU !== false && input.webgpu !== false;
  const webGpuEligible = wantsWebGpu
    && cellCount <= normalizeInteger(input.webgpuMaxCells, STELLAR_FUSION_WEBGPU_MAX_CELLS, 1, 1048576)
    && !gpuDisabledReasons.has(stateKey);

  if (webGpuEligible) {
    try {
      let runtime = gpuRuntimes.get(stateKey);
      if (!runtime) {
        runtime = new StellarFusionWebGpuRuntime(stateKey);
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

  const next = stepStellarFusionCpu(state, options);
  Object.assign(state, next);
  return {
    backend: 'cpu-stellar-fusion',
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
    schema: payload.solver?.warmDelta?.schema || STELLAR_FUSION_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'stellar-fusion',
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
      temperature: 'K',
      density: 'kg/m^3',
      pressure: 'Pa',
      composition: 'mass-fraction',
      energyDensity: input.energyDensityUnit || 'reduced-J/m^3',
      time: input.timeUnit || 's'
    }
  };
}

export function resetStellarFusion(input = {}) {
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
    schema: STELLAR_FUSION_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

export async function stepStellarFusion(payload = {}) {
  const resolved = resolveInput(payload);
  const { input, stateKey } = resolved;
  const requestedReset = input.reset === true;
  const nextState = input.state || requestedReset || !states.has(stateKey)
    ? normalizeState(input)
    : cloneState(states.get(stateKey));
  const before = computeStellarFusionDiagnostics(nextState);
  const options = resolveStepOptions(input);
  const advanceResult = await advanceState(nextState, {
    stateKey,
    input,
    options
  });
  nextState.sequence += 1;
  states.set(stateKey, cloneState(nextState));
  const diagnostics = computeStellarFusionDiagnostics(nextState);
  const conservation = {
    hydrogenBurnedDelta: Math.max(0, before.meanHydrogenFraction - diagnostics.meanHydrogenFraction),
    heliumProducedDelta: diagnostics.meanHeliumFraction - before.meanHeliumFraction,
    fusionEnergyDelta: diagnostics.totalEnergyDensity - before.totalEnergyDensity,
    neutrinoLossProxy: diagnostics.neutrinoLossProxy,
    energyMode: 'reduced-pp-chain-plasma',
    note: 'Reduced interactive stellar-core tile; not a validated stellar-structure or nuclear network solve.'
  };
  const state = cloneState(nextState);
  const value = {
    ok: true,
    schema: STELLAR_FUSION_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'stellar-fusion',
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
