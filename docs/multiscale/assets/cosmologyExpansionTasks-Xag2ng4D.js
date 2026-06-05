export const COSMOLOGY_EXPANSION_STATE_SCHEMA = 'peercompute.multiscale.cosmology-expansion.state.v0';
export const COSMOLOGY_EXPANSION_RESULT_SCHEMA = 'peercompute.multiscale.cosmology-expansion.result.v0';
export const COSMOLOGY_EXPANSION_DELTA_SCHEMA = 'peercompute.multiscale.cosmology-expansion.delta.v0';
export const COSMOLOGY_EXPANSION_WEBGPU_MAX_SAMPLES = 16384;

const DEFAULT_STATE_KEY = 'multiscale:cosmology-expansion:default';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const SAMPLE_FLOATS = 8;
const PARAM_FLOATS = 12;
const PARAM_BYTES = PARAM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const WORKGROUP_SIZE = 64;
const states = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const COSMOLOGY_SHADER = `
struct Sample {
  positionDensity: vec4f,
  thermalFlow: vec4f,
};

struct Params {
  sampleCount: f32,
  dt: f32,
  scaleFactor: f32,
  hubbleRate: f32,
  matterOmega: f32,
  darkEnergyOmega: f32,
  galaxyTurbulence: f32,
  starFormationRate: f32,
  maxwellFieldEnergy: f32,
  relativisticLensing: f32,
  relativisticRedshift: f32,
  radiationPressure: f32,
};

@group(0) @binding(0) var<storage, read> currentSamples: array<Sample>;
@group(0) @binding(1) var<storage, read_write> nextSamples: array<Sample>;
@group(0) @binding(2) var<uniform> params: Params;

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let index = gid.x;
  if (index >= u32(params.sampleCount)) {
    return;
  }

  let sample = currentSamples[index];
  var x = sample.positionDensity.x;
  var y = sample.positionDensity.y;
  var z = sample.positionDensity.z;
  var density = clamp(sample.positionDensity.w, -0.92, 8.0);
  var temperature = max(1.0, sample.thermalFlow.x);
  var divergence = clamp(sample.thermalFlow.y, -4.0, 4.0);
  var potential = clamp(sample.thermalFlow.z, -8.0, 8.0);
  var expansionRate = clamp(sample.thermalFlow.w, 0.0, 3.0);

  let radius = max(0.001, length(vec3f(x, y, z)));
  let filamentSeed = sin(f32(index) * 12.9898 + params.scaleFactor * 2.113) * cos(radius * 0.71);
  let fieldDrive = params.maxwellFieldEnergy * 0.0008 + params.relativisticLensing * 0.000012;
  let feedbackDrive = params.galaxyTurbulence * 0.035 + params.starFormationRate * 0.012 + params.radiationPressure * 0.006;
  let darkPush = params.darkEnergyOmega * params.hubbleRate * (1.0 + params.relativisticRedshift * 0.45);
  let matterPull = params.matterOmega * (0.05 + max(0.0, density) * 0.018);
  let localExpansion = clamp(darkPush + fieldDrive + feedbackDrive - matterPull, 0.00001, 0.38);

  let radial = normalize(vec3f(x, y, z) + vec3f(0.0001, 0.0002, 0.0003));
  let shear = vec3f(
    sin(y * 0.29 + params.scaleFactor),
    cos(z * 0.23 + f32(index) * 0.01),
    sin(x * 0.19 - params.scaleFactor)
  ) * (params.galaxyTurbulence * 0.016 + fieldDrive * 0.08);
  let moved = vec3f(x, y, z) + (radial * localExpansion * radius * 0.12 + shear) * params.dt;
  x = moved.x;
  y = moved.y;
  z = moved.z;

  let targetDensity = clamp(
    density * (1.0 - localExpansion * params.dt * 0.55)
      + filamentSeed * (0.035 + params.galaxyTurbulence * 0.018)
      + params.starFormationRate * 0.002
      + params.relativisticLensing * 0.000004,
    -0.95,
    8.0
  );
  density = density + (targetDensity - density) * 0.42;
  divergence = clamp(localExpansion * 3.5 - density * 0.055 + fieldDrive * 0.7, -4.0, 4.0);
  potential = clamp(potential * 0.985 + density * params.matterOmega * 0.025 - localExpansion * 0.018, -8.0, 8.0);
  temperature = clamp(
    temperature
      + params.dt * (abs(divergence) * 7.0 + max(0.0, density) * 1.8 + params.starFormationRate * 0.65)
      - params.dt * localExpansion * 2.2,
    1.0,
    200000.0
  );
  expansionRate = localExpansion;

  nextSamples[index].positionDensity = vec4f(x, y, z, density);
  nextSamples[index].thermalFlow = vec4f(temperature, divergence, potential, expansionRate);
}
`;

function getExecutionContext() {
  const scope = globalThis.self;
  const workerScope = globalThis.WorkerGlobalScope;
  if (scope && workerScope && scope instanceof workerScope) return 'dedicated-worker';
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

function couplingValue(coupling = {}, key, fallback, min = -Number.MAX_VALUE, max = Number.MAX_VALUE) {
  return normalizeNumber(coupling[key], fallback, min, max);
}

function poyntingMagnitude(value) {
  if (!Array.isArray(value)) return normalizeNumber(value, 0, 0, 100);
  return Math.hypot(
    normalizeNumber(value[0], 0, -100, 100),
    normalizeNumber(value[1], 0, -100, 100),
    normalizeNumber(value[2], 0, -100, 100)
  );
}

export function makeCosmologyExpansionInitialState({
  sampleCount = 128,
  count = sampleCount,
  seed = 20260530,
  environment = {},
  coupling = {}
} = {}) {
  const safeCount = normalizeInteger(count, 128, 8, 32768);
  const rng = createRng(seed);
  const scaleFactor = normalizeNumber(coupling.scaleFactor ?? environment.scaleFactor, 1, 0.05, 50);
  const hubbleRate = normalizeNumber(coupling.hubbleRate ?? environment.hubbleRate, 0.071, 0.001, 1);
  const matterOmega = normalizeNumber(coupling.matterOmega, 0.315, 0.02, 2);
  const darkEnergyOmega = normalizeNumber(coupling.darkEnergyOmega, 0.685, 0, 2);
  const positionsX = new Array(safeCount);
  const positionsY = new Array(safeCount);
  const positionsZ = new Array(safeCount);
  const densityContrast = new Array(safeCount);
  const temperatureK = new Array(safeCount);
  const velocityDivergence = new Array(safeCount);
  const potentialProxy = new Array(safeCount);
  const expansionRateProxy = new Array(safeCount);

  for (let i = 0; i < safeCount; i += 1) {
    const band = i / Math.max(1, safeCount - 1);
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(1 - 2 * rng());
    const filamentBias = i % 6 === 0 ? 0.38 : 1;
    const radius = (10 + 46 * Math.pow(rng(), 0.6)) * filamentBias;
    const sinPhi = Math.sin(phi);
    const x = Math.cos(theta) * sinPhi * radius;
    const y = Math.sin(theta) * sinPhi * radius * 0.72;
    const z = Math.cos(phi) * radius;
    const filament = Math.sin(theta * 3 + band * 8) * 0.34 + Math.cos(phi * 5) * 0.18;
    const density = clamp(filament + (i % 6 === 0 ? 0.8 + rng() * 1.6 : -0.25 + rng() * 0.5), -0.9, 6);
    positionsX[i] = x;
    positionsY[i] = y;
    positionsZ[i] = z;
    densityContrast[i] = density;
    temperatureK[i] = 12 + Math.max(0, density) * 420 + rng() * 160;
    velocityDivergence[i] = hubbleRate * (1 + rng() * 0.2) - density * 0.01;
    potentialProxy[i] = density * matterOmega * 0.08;
    expansionRateProxy[i] = hubbleRate * darkEnergyOmega;
  }

  return {
    schema: COSMOLOGY_EXPANSION_STATE_SCHEMA,
    sequence: 0,
    elapsedTime: 0,
    sampleCount: safeCount,
    scaleFactor,
    hubbleRate,
    matterOmega,
    darkEnergyOmega,
    positionsX,
    positionsY,
    positionsZ,
    densityContrast,
    temperatureK,
    velocityDivergence,
    potentialProxy,
    expansionRateProxy
  };
}

function normalizeState(input = {}) {
  const source = input.state || input;
  if (!source.positionsX || !source.densityContrast) return makeCosmologyExpansionInitialState(input);
  const sampleCount = normalizeInteger(source.sampleCount || source.positionsX.length, 128, 8, 32768);
  return {
    schema: COSMOLOGY_EXPANSION_STATE_SCHEMA,
    sequence: normalizeInteger(source.sequence, 0, 0),
    elapsedTime: normalizeNumber(source.elapsedTime, 0, 0),
    sampleCount,
    scaleFactor: normalizeNumber(source.scaleFactor, 1, 0.05, 50),
    hubbleRate: normalizeNumber(source.hubbleRate, 0.071, 0.001, 1),
    matterOmega: normalizeNumber(source.matterOmega, 0.315, 0.02, 2),
    darkEnergyOmega: normalizeNumber(source.darkEnergyOmega, 0.685, 0, 2),
    positionsX: toFiniteArray(source.positionsX, sampleCount, 'positionsX', 0),
    positionsY: toFiniteArray(source.positionsY, sampleCount, 'positionsY', 0),
    positionsZ: toFiniteArray(source.positionsZ, sampleCount, 'positionsZ', 0),
    densityContrast: toFiniteArray(source.densityContrast, sampleCount, 'densityContrast', 0),
    temperatureK: toFiniteArray(source.temperatureK, sampleCount, 'temperatureK', 10),
    velocityDivergence: toFiniteArray(source.velocityDivergence, sampleCount, 'velocityDivergence', 0),
    potentialProxy: toFiniteArray(source.potentialProxy, sampleCount, 'potentialProxy', 0),
    expansionRateProxy: toFiniteArray(source.expansionRateProxy, sampleCount, 'expansionRateProxy', 0.071)
  };
}

function cloneState(state) {
  return {
    schema: COSMOLOGY_EXPANSION_STATE_SCHEMA,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    sampleCount: state.sampleCount,
    scaleFactor: state.scaleFactor,
    hubbleRate: state.hubbleRate,
    matterOmega: state.matterOmega,
    darkEnergyOmega: state.darkEnergyOmega,
    positionsX: [...state.positionsX],
    positionsY: [...state.positionsY],
    positionsZ: [...state.positionsZ],
    densityContrast: [...state.densityContrast],
    temperatureK: [...state.temperatureK],
    velocityDivergence: [...state.velocityDivergence],
    potentialProxy: [...state.potentialProxy],
    expansionRateProxy: [...state.expansionRateProxy]
  };
}

function sampleDataFromState(state) {
  const data = new Float32Array(state.sampleCount * SAMPLE_FLOATS);
  for (let i = 0; i < state.sampleCount; i += 1) {
    const dst = i * SAMPLE_FLOATS;
    data[dst] = state.positionsX[i];
    data[dst + 1] = state.positionsY[i];
    data[dst + 2] = state.positionsZ[i];
    data[dst + 3] = state.densityContrast[i];
    data[dst + 4] = state.temperatureK[i];
    data[dst + 5] = state.velocityDivergence[i];
    data[dst + 6] = state.potentialProxy[i];
    data[dst + 7] = state.expansionRateProxy[i];
  }
  return data;
}

function applySampleDataToState(state, data) {
  for (let i = 0; i < state.sampleCount; i += 1) {
    const src = i * SAMPLE_FLOATS;
    state.positionsX[i] = data[src];
    state.positionsY[i] = data[src + 1];
    state.positionsZ[i] = data[src + 2];
    state.densityContrast[i] = data[src + 3];
    state.temperatureK[i] = data[src + 4];
    state.velocityDivergence[i] = data[src + 5];
    state.potentialProxy[i] = data[src + 6];
    state.expansionRateProxy[i] = data[src + 7];
  }
}

export function computeCosmologyExpansionDiagnostics(input = {}) {
  const state = normalizeState(input);
  let meanDensityContrast = 0;
  let maxDensityContrast = -Infinity;
  let minDensityContrast = Infinity;
  let meanTemperatureK = 0;
  let maxTemperatureK = 0;
  let meanVelocityDivergence = 0;
  let meanPotentialProxy = 0;
  let meanExpansionRateProxy = 0;
  let filamentEnergy = 0;
  let voidCount = 0;
  let structureGrowthProxy = 0;

  for (let i = 0; i < state.sampleCount; i += 1) {
    const density = state.densityContrast[i];
    const temperature = Math.max(0, state.temperatureK[i]);
    const divergence = state.velocityDivergence[i];
    const potential = state.potentialProxy[i];
    const expansion = state.expansionRateProxy[i];
    meanDensityContrast += density;
    maxDensityContrast = Math.max(maxDensityContrast, density);
    minDensityContrast = Math.min(minDensityContrast, density);
    meanTemperatureK += temperature;
    maxTemperatureK = Math.max(maxTemperatureK, temperature);
    meanVelocityDivergence += divergence;
    meanPotentialProxy += potential;
    meanExpansionRateProxy += expansion;
    filamentEnergy += Math.max(0, density) * Math.max(0, density);
    structureGrowthProxy += Math.max(0, density) * Math.max(0, -divergence + potential * 0.04);
    if (density < -0.55) voidCount += 1;
  }

  const invCount = 1 / Math.max(1, state.sampleCount);
  meanDensityContrast *= invCount;
  meanTemperatureK *= invCount;
  meanVelocityDivergence *= invCount;
  meanPotentialProxy *= invCount;
  meanExpansionRateProxy *= invCount;
  filamentEnergy *= invCount;
  structureGrowthProxy *= invCount;

  return {
    schema: 'peercompute.multiscale.cosmology-expansion.diagnostics.v0',
    sampleCount: state.sampleCount,
    scaleFactor: state.scaleFactor,
    redshift: Math.max(0, 1 / Math.max(0.0001, state.scaleFactor) - 1),
    hubbleRate: state.hubbleRate,
    matterOmega: state.matterOmega,
    darkEnergyOmega: state.darkEnergyOmega,
    meanDensityContrast,
    maxDensityContrast,
    minDensityContrast,
    voidFraction: voidCount * invCount,
    meanTemperatureK,
    maxTemperatureK,
    meanVelocityDivergence,
    meanPotentialProxy,
    meanExpansionRateProxy,
    filamentEnergy,
    structureGrowthProxy,
    expansionWorkProxy: Math.abs(meanVelocityDivergence) * (1 + filamentEnergy) * Math.max(0.001, state.hubbleRate),
    hubbleTensionProxy: Math.abs(state.hubbleRate - 0.071) / 0.071
  };
}

class CosmologyExpansionWebGpuRuntime {
  constructor(stateKey) {
    this.stateKey = stateKey;
    this.device = null;
    this.pipeline = null;
    this.currentBuffer = null;
    this.nextBuffer = null;
    this.readBuffer = null;
    this.paramBuffer = null;
    this.sampleCount = 0;
    this.submittedSteps = 0;
    this.lastError = null;
  }

  async initialize(sampleCount) {
    if (this.device && this.sampleCount === sampleCount) return;
    const gpu = globalThis.navigator?.gpu;
    if (!gpu) throw new Error('WebGPU unavailable for cosmology-expansion worker');
    const usage = globalThis.GPUBufferUsage;
    if (!usage) throw new Error('GPUBufferUsage unavailable for cosmology-expansion worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for cosmology-expansion worker');
    this.device = await adapter.requestDevice();
    this.sampleCount = sampleCount;

    const sampleBytes = sampleCount * SAMPLE_FLOATS * Float32Array.BYTES_PER_ELEMENT;
    this.currentBuffer = this.device.createBuffer({
      size: sampleBytes,
      usage: usage.STORAGE | usage.COPY_DST
    });
    this.nextBuffer = this.device.createBuffer({
      size: sampleBytes,
      usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
    });
    this.readBuffer = this.device.createBuffer({
      size: sampleBytes,
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
        module: this.device.createShaderModule({ code: COSMOLOGY_SHADER }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`Cosmology expansion WebGPU validation: ${validationError.message || validationError}`);
    }

    this.device.lost?.then((info) => {
      this.lastError = info?.message || info?.reason || 'Cosmology expansion WebGPU device lost';
      gpuDisabledReasons.set(this.stateKey, this.lastError);
    });
  }

  async step(state, options) {
    await this.initialize(state.sampleCount);
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for cosmology-expansion worker');
    const sampleData = sampleDataFromState(state);
    const params = new Float32Array([
      state.sampleCount,
      options.dt,
      state.scaleFactor,
      options.hubbleRate,
      options.matterOmega,
      options.darkEnergyOmega,
      options.galaxyTurbulence,
      options.starFormationRate,
      options.maxwellFieldEnergy,
      options.relativisticLensing,
      options.relativisticRedshift,
      options.radiationPressure
    ]);
    const workgroups = Math.ceil(state.sampleCount / WORKGROUP_SIZE);
    const encoder = this.device.createCommandEncoder();
    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.currentBuffer } },
        { binding: 1, resource: { buffer: this.nextBuffer } },
        { binding: 2, resource: { buffer: this.paramBuffer } }
      ]
    });

    this.device.queue.writeBuffer(this.currentBuffer, 0, sampleData);
    this.device.queue.writeBuffer(this.paramBuffer, 0, params);
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(workgroups);
    pass.end();
    encoder.copyBufferToBuffer(this.nextBuffer, 0, this.readBuffer, 0, sampleData.byteLength);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone?.();
    await this.readBuffer.mapAsync(mapMode.READ);
    const mapped = this.readBuffer.getMappedRange();
    const result = new Float32Array(mapped).slice();
    this.readBuffer.unmap();
    applySampleDataToState(state, result);
    state.scaleFactor = clamp(state.scaleFactor + options.dt * options.hubbleRate * state.scaleFactor * (0.3 + options.darkEnergyOmega * 0.18), 0.05, 50);
    state.hubbleRate = clamp(options.hubbleRate, 0.001, 1);
    state.matterOmega = options.matterOmega;
    state.darkEnergyOmega = options.darkEnergyOmega;
    state.elapsedTime += options.dt;
    this.submittedSteps += 1;
    return {
      backend: 'webgpu-cosmology-expansion',
      webgpuStatus: {
        stateKey: this.stateKey,
        sampleCount: state.sampleCount,
        submittedSteps: this.submittedSteps
      }
    };
  }
}

function resolveStepOptions(input = {}) {
  const environment = input.environment || {};
  const coupling = input.coupling || {};
  const poynting = coupling.poyntingFlux ?? input.poyntingFlux;
  const maxwellFieldEnergy = normalizeNumber(coupling.maxwellFieldEnergy ?? input.maxwellFieldEnergy, 0, 0, 100);
  const poyntingDrive = poyntingMagnitude(poynting) * 0.04;
  const relativisticRedshift = normalizeNumber(coupling.relativisticRedshift ?? input.relativisticRedshift, 0, 0, 10);
  const relativisticLensing = normalizeNumber(coupling.relativisticLensing ?? input.relativisticLensing, 0, 0, 50000);
  const stellarLuminosityFactor = normalizeNumber(coupling.stellarLuminosityFactor ?? input.stellarLuminosityFactor, 1, 0.05, 8);
  const radiationPressure = normalizeNumber(coupling.radiationPressure ?? input.radiationPressure, 1, 0, 8);
  const baseHubble = normalizeNumber(coupling.hubbleRate ?? environment.hubbleRate, 0.071, 0.001, 1);
  return {
    dt: normalizeNumber(input.dt, 1 / 90, 0, 0.5),
    hubbleRate: clamp(
      baseHubble
        + relativisticRedshift * 0.0008
        + Math.min(0.018, relativisticLensing * 0.00000018)
        + poyntingDrive * 0.0001,
      0.001,
      1
    ),
    matterOmega: normalizeNumber(coupling.matterOmega ?? input.matterOmega, 0.315, 0.02, 2),
    darkEnergyOmega: normalizeNumber(coupling.darkEnergyOmega ?? input.darkEnergyOmega, 0.685, 0, 2),
    galaxyTurbulence: normalizeNumber(coupling.galaxyTurbulence ?? input.galaxyTurbulence, 0.34, 0, 4),
    starFormationRate: normalizeNumber(coupling.starFormationRate ?? input.starFormationRate, 1.2, 0, 20),
    maxwellFieldEnergy: maxwellFieldEnergy + poyntingDrive,
    relativisticLensing,
    relativisticRedshift,
    radiationPressure: radiationPressure * stellarLuminosityFactor
  };
}

function stepCosmologyExpansionCpu(state, options) {
  const next = cloneState(state);
  for (let i = 0; i < state.sampleCount; i += 1) {
    let x = state.positionsX[i];
    let y = state.positionsY[i];
    let z = state.positionsZ[i];
    let density = clamp(state.densityContrast[i], -0.92, 8);
    let temperature = Math.max(1, state.temperatureK[i]);
    let divergence = clamp(state.velocityDivergence[i], -4, 4);
    let potential = clamp(state.potentialProxy[i], -8, 8);
    const radius = Math.max(0.001, Math.hypot(x, y, z));
    const filamentSeed = Math.sin(i * 12.9898 + state.scaleFactor * 2.113) * Math.cos(radius * 0.71);
    const fieldDrive = options.maxwellFieldEnergy * 0.0008 + options.relativisticLensing * 0.000012;
    const feedbackDrive = options.galaxyTurbulence * 0.035 + options.starFormationRate * 0.012 + options.radiationPressure * 0.006;
    const darkPush = options.darkEnergyOmega * options.hubbleRate * (1 + options.relativisticRedshift * 0.45);
    const matterPull = options.matterOmega * (0.05 + Math.max(0, density) * 0.018);
    const localExpansion = clamp(darkPush + fieldDrive + feedbackDrive - matterPull, 0.00001, 0.38);
    const invRadius = 1 / radius;
    const shearScale = options.galaxyTurbulence * 0.016 + fieldDrive * 0.08;
    x += (x * invRadius * localExpansion * radius * 0.12 + Math.sin(y * 0.29 + state.scaleFactor) * shearScale) * options.dt;
    y += (y * invRadius * localExpansion * radius * 0.12 + Math.cos(z * 0.23 + i * 0.01) * shearScale) * options.dt;
    z += (z * invRadius * localExpansion * radius * 0.12 + Math.sin(x * 0.19 - state.scaleFactor) * shearScale) * options.dt;
    const targetDensity = clamp(
      density * (1 - localExpansion * options.dt * 0.55)
        + filamentSeed * (0.035 + options.galaxyTurbulence * 0.018)
        + options.starFormationRate * 0.002
        + options.relativisticLensing * 0.000004,
      -0.95,
      8
    );
    density += (targetDensity - density) * 0.42;
    divergence = clamp(localExpansion * 3.5 - density * 0.055 + fieldDrive * 0.7, -4, 4);
    potential = clamp(potential * 0.985 + density * options.matterOmega * 0.025 - localExpansion * 0.018, -8, 8);
    temperature = clamp(
      temperature
        + options.dt * (Math.abs(divergence) * 7 + Math.max(0, density) * 1.8 + options.starFormationRate * 0.65)
        - options.dt * localExpansion * 2.2,
      1,
      200000
    );

    next.positionsX[i] = x;
    next.positionsY[i] = y;
    next.positionsZ[i] = z;
    next.densityContrast[i] = density;
    next.temperatureK[i] = temperature;
    next.velocityDivergence[i] = divergence;
    next.potentialProxy[i] = potential;
    next.expansionRateProxy[i] = localExpansion;
  }
  next.scaleFactor = clamp(state.scaleFactor + options.dt * options.hubbleRate * state.scaleFactor * (0.3 + options.darkEnergyOmega * 0.18), 0.05, 50);
  next.hubbleRate = clamp(options.hubbleRate, 0.001, 1);
  next.matterOmega = options.matterOmega;
  next.darkEnergyOmega = options.darkEnergyOmega;
  next.elapsedTime += options.dt;
  return next;
}

async function advanceState(state, { stateKey, input, options }) {
  const wantsWebGpu = input.enableWebGPU !== false && input.webgpu !== false;
  const webGpuEligible = wantsWebGpu
    && state.sampleCount <= normalizeInteger(input.webgpuMaxSamples, COSMOLOGY_EXPANSION_WEBGPU_MAX_SAMPLES, 1, 1048576)
    && !gpuDisabledReasons.has(stateKey);

  if (webGpuEligible) {
    try {
      let runtime = gpuRuntimes.get(stateKey);
      if (!runtime) {
        runtime = new CosmologyExpansionWebGpuRuntime(stateKey);
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

  const next = stepCosmologyExpansionCpu(state, options);
  Object.assign(state, next);
  return {
    backend: 'cpu-cosmology-expansion',
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
    schema: payload.solver?.warmDelta?.schema || COSMOLOGY_EXPANSION_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'cosmology-expansion',
    stateKey,
    backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    sampleCount: state.sampleCount,
    diagnostics,
    conservation,
    state,
    webgpuStatus,
    webgpuError,
    units: {
      position: 'reduced-Mpc',
      densityContrast: '1',
      temperature: 'K',
      velocityDivergence: 'reduced-H0',
      hubbleRate: input.hubbleUnit || 'reduced-H0',
      time: input.timeUnit || 'reduced-Gyr'
    }
  };
}

export function resetCosmologyExpansion(input = {}) {
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
    schema: COSMOLOGY_EXPANSION_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

export async function stepCosmologyExpansion(payload = {}) {
  const resolved = resolveInput(payload);
  const { input, stateKey } = resolved;
  const requestedReset = input.reset === true;
  const nextState = input.state || requestedReset || !states.has(stateKey)
    ? normalizeState(input)
    : cloneState(states.get(stateKey));
  const before = computeCosmologyExpansionDiagnostics(nextState);
  const options = resolveStepOptions(input);
  const advanceResult = await advanceState(nextState, {
    stateKey,
    input,
    options
  });
  nextState.sequence += 1;
  states.set(stateKey, cloneState(nextState));
  const diagnostics = computeCosmologyExpansionDiagnostics(nextState);
  const conservation = {
    expansionEnergyDelta: diagnostics.expansionWorkProxy - before.expansionWorkProxy,
    densityContrastDrift: diagnostics.meanDensityContrast - before.meanDensityContrast,
    structureGrowthDelta: diagnostics.structureGrowthProxy - before.structureGrowthProxy,
    filamentEnergyDelta: diagnostics.filamentEnergy - before.filamentEnergy,
    scaleFactorDelta: diagnostics.scaleFactor - before.scaleFactor,
    energyMode: 'reduced-cosmology-expansion-proxy',
    note: 'Reduced interactive cosmology expansion tile; not a validated N-body/AMR cosmology solve.'
  };
  const state = cloneState(nextState);
  const value = {
    ok: true,
    schema: COSMOLOGY_EXPANSION_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'cosmology-expansion',
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
