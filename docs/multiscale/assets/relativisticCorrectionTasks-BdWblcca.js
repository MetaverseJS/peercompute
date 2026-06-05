export const RELATIVISTIC_CORRECTION_STATE_SCHEMA = 'peercompute.multiscale.relativistic-correction.state.v0';
export const RELATIVISTIC_CORRECTION_RESULT_SCHEMA = 'peercompute.multiscale.relativistic-correction.result.v0';
export const RELATIVISTIC_CORRECTION_DELTA_SCHEMA = 'peercompute.multiscale.relativistic-correction.delta.v0';
export const RELATIVISTIC_CORRECTION_WEBGPU_MAX_SAMPLES = 8192;

const DEFAULT_STATE_KEY = 'multiscale:relativistic-correction:default';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const SAMPLE_FLOATS = 8;
const PARAM_FLOATS = 12;
const PARAM_BYTES = PARAM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const WORKGROUP_SIZE = 64;
const states = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const RELATIVISTIC_SHADER = `
struct Sample {
  orbit: vec4f,
  derived: vec4f,
};

struct Params {
  sampleCount: f32,
  dt: f32,
  compactness: f32,
  spin: f32,
  radiationPressure: f32,
  maxwellFieldEnergy: f32,
  poyntingMagnitude: f32,
  alfvenSpeed: f32,
  picKineticEnergy: f32,
  picEscapeFraction: f32,
  solarWindPressure: f32,
  stellarLuminosityFactor: f32,
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
  var radiusAu = clamp(sample.orbit.x, 0.018, 80.0);
  var beta = clamp(sample.orbit.y, 0.00001, 0.985);
  var phase = sample.orbit.z;
  var precession = sample.orbit.w;

  let fieldDrive = params.maxwellFieldEnergy * 0.0006 + params.poyntingMagnitude * 0.0004;
  let plasmaDrive = params.alfvenSpeed * 0.00018 + params.solarWindPressure * 0.00012;
  let kineticDrive = params.picKineticEnergy * 0.00008 + params.picEscapeFraction * 0.004;
  let radiationDrive = params.radiationPressure * 0.00016 + params.stellarLuminosityFactor * 0.00008;
  let localCompactness = clamp(params.compactness + fieldDrive + plasmaDrive + kineticDrive + radiationDrive, 0.0000001, 0.42);
  let targetBeta = clamp(sqrt(localCompactness / max(0.02, radiusAu)) + fieldDrive * 0.18 + kineticDrive * 0.25, 0.00001, 0.985);
  beta = clamp(beta + (targetBeta - beta) * params.dt * 0.22 + sin(f32(index) * 12.9898 + phase) * params.dt * 0.0005, 0.00001, 0.985);

  let radialBreathing = sin(phase + f32(index) * 0.37) * params.radiationPressure * params.dt * 0.00018;
  radiusAu = clamp(radiusAu + radialBreathing - beta * beta * params.dt * 0.0007 + params.solarWindPressure * params.dt * 0.00005, 0.018, 80.0);

  let gamma = inverseSqrt(max(0.000001, 1.0 - beta * beta));
  let potential = clamp(localCompactness / max(0.018, radiusAu), 0.0, 0.49);
  let metric = max(0.000001, 1.0 - 2.0 * potential);
  let timeDilation = sqrt(metric) / gamma;
  let redshift = inverseSqrt(metric) - 1.0;
  let frameDragging = params.spin * potential * potential * 32.0 + params.poyntingMagnitude * 0.0025 + params.picEscapeFraction * 0.0015;
  let precessionStep = params.dt * (6.0 * 3.14159265 * potential * max(0.2, beta)) + frameDragging * params.dt * 0.02;
  precession = precession + precessionStep;
  phase = phase + params.dt * beta / max(0.04, radiusAu) + frameDragging * params.dt * 0.01;
  if (phase > 6.2831853) {
    phase = phase - floor(phase / 6.2831853) * 6.2831853;
  }

  nextSamples[index].orbit = vec4f(radiusAu, beta, phase, precession);
  nextSamples[index].derived = vec4f(potential, timeDilation, redshift, frameDragging);
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

function lorentzFactor(beta) {
  const safeBeta = clamp(Math.abs(beta), 0, 0.999999);
  return 1 / Math.sqrt(Math.max(1e-12, 1 - safeBeta * safeBeta));
}

function reducedCompactness({ environment = {}, coupling = {} } = {}) {
  const stellarLuminosityFactor = couplingValue(coupling, 'stellarLuminosityFactor', 1, 0.05, 6);
  const stellarFlux = normalizeNumber(environment.stellarFlux, 1, 0, 6);
  const centralMassSolar = couplingValue(coupling, 'centralMassSolar', 1, 0.02, 1e9);
  const compactness = couplingValue(coupling, 'compactness', NaN, 0.0000001, 0.42);
  if (Number.isFinite(compactness)) return compactness;
  return clamp(
    0.00095
      + Math.log10(1 + centralMassSolar) * 0.00045
      + stellarLuminosityFactor * stellarFlux * 0.00018
      + couplingValue(coupling, 'magnetosphereSolarWindPressure', 0, 0, 20) * 0.00005
      + couplingValue(coupling, 'picParticleEscapeFraction', 0, 0, 1) * 0.00045,
    0.0000001,
    0.42
  );
}

export function makeRelativisticCorrectionInitialState({
  sampleCount = 96,
  count = sampleCount,
  seed = 20260529,
  environment = {},
  coupling = {}
} = {}) {
  const safeCount = normalizeInteger(count, 96, 4, 16384);
  const rng = createRng(seed);
  const compactness = reducedCompactness({ environment, coupling });
  const spin = couplingValue(coupling, 'spin', 0.15, -1, 1);
  const radiiAu = new Array(safeCount);
  const speedFractionC = new Array(safeCount);
  const phase = new Array(safeCount);
  const precessionRad = new Array(safeCount);
  const potentialProxy = new Array(safeCount);
  const timeDilationFactor = new Array(safeCount);
  const gravitationalRedshiftProxy = new Array(safeCount);
  const frameDraggingProxy = new Array(safeCount);

  for (let i = 0; i < safeCount; i += 1) {
    const band = i / Math.max(1, safeCount - 1);
    const clustered = i % 5 === 0 ? 0.04 + rng() * 0.18 : 0.22 + band * 18 + rng() * 0.9;
    const radius = clamp(clustered, 0.025, 80);
    const beta = clamp(Math.sqrt(compactness / Math.max(0.025, radius)) * (0.78 + rng() * 0.18), 0.00001, 0.95);
    const potential = clamp(compactness / Math.max(0.025, radius), 0, 0.49);
    const gamma = lorentzFactor(beta);
    const metric = Math.max(1e-9, 1 - 2 * potential);
    radiiAu[i] = radius;
    speedFractionC[i] = beta;
    phase[i] = rng() * Math.PI * 2;
    precessionRad[i] = potential * spin * 0.01;
    potentialProxy[i] = potential;
    timeDilationFactor[i] = Math.sqrt(metric) / gamma;
    gravitationalRedshiftProxy[i] = 1 / Math.sqrt(metric) - 1;
    frameDraggingProxy[i] = spin * potential * potential * 32;
  }

  return {
    schema: RELATIVISTIC_CORRECTION_STATE_SCHEMA,
    sequence: 0,
    elapsedTime: 0,
    sampleCount: safeCount,
    radiiAu,
    speedFractionC,
    phase,
    precessionRad,
    potentialProxy,
    timeDilationFactor,
    gravitationalRedshiftProxy,
    frameDraggingProxy
  };
}

function normalizeState(input = {}) {
  const source = input.state || input;
  if (!source.radiiAu || !source.speedFractionC) return makeRelativisticCorrectionInitialState(input);
  const sampleCount = normalizeInteger(source.sampleCount || source.radiiAu.length, 96, 4, 16384);
  return {
    schema: RELATIVISTIC_CORRECTION_STATE_SCHEMA,
    sequence: normalizeInteger(source.sequence, 0, 0),
    elapsedTime: normalizeNumber(source.elapsedTime, 0, 0),
    sampleCount,
    radiiAu: toFiniteArray(source.radiiAu, sampleCount, 'radiiAu', 1),
    speedFractionC: toFiniteArray(source.speedFractionC, sampleCount, 'speedFractionC', 0.001),
    phase: toFiniteArray(source.phase, sampleCount, 'phase', 0),
    precessionRad: toFiniteArray(source.precessionRad, sampleCount, 'precessionRad', 0),
    potentialProxy: toFiniteArray(source.potentialProxy, sampleCount, 'potentialProxy', 0),
    timeDilationFactor: toFiniteArray(source.timeDilationFactor, sampleCount, 'timeDilationFactor', 1),
    gravitationalRedshiftProxy: toFiniteArray(source.gravitationalRedshiftProxy, sampleCount, 'gravitationalRedshiftProxy', 0),
    frameDraggingProxy: toFiniteArray(source.frameDraggingProxy, sampleCount, 'frameDraggingProxy', 0)
  };
}

function cloneState(state) {
  return {
    schema: RELATIVISTIC_CORRECTION_STATE_SCHEMA,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    sampleCount: state.sampleCount,
    radiiAu: [...state.radiiAu],
    speedFractionC: [...state.speedFractionC],
    phase: [...state.phase],
    precessionRad: [...state.precessionRad],
    potentialProxy: [...state.potentialProxy],
    timeDilationFactor: [...state.timeDilationFactor],
    gravitationalRedshiftProxy: [...state.gravitationalRedshiftProxy],
    frameDraggingProxy: [...state.frameDraggingProxy]
  };
}

function sampleDataFromState(state) {
  const data = new Float32Array(state.sampleCount * SAMPLE_FLOATS);
  for (let i = 0; i < state.sampleCount; i += 1) {
    const dst = i * SAMPLE_FLOATS;
    data[dst] = state.radiiAu[i];
    data[dst + 1] = state.speedFractionC[i];
    data[dst + 2] = state.phase[i];
    data[dst + 3] = state.precessionRad[i];
    data[dst + 4] = state.potentialProxy[i];
    data[dst + 5] = state.timeDilationFactor[i];
    data[dst + 6] = state.gravitationalRedshiftProxy[i];
    data[dst + 7] = state.frameDraggingProxy[i];
  }
  return data;
}

function applySampleDataToState(state, data) {
  for (let i = 0; i < state.sampleCount; i += 1) {
    const src = i * SAMPLE_FLOATS;
    state.radiiAu[i] = data[src];
    state.speedFractionC[i] = data[src + 1];
    state.phase[i] = data[src + 2];
    state.precessionRad[i] = data[src + 3];
    state.potentialProxy[i] = data[src + 4];
    state.timeDilationFactor[i] = data[src + 5];
    state.gravitationalRedshiftProxy[i] = data[src + 6];
    state.frameDraggingProxy[i] = data[src + 7];
  }
}

export function computeRelativisticCorrectionDiagnostics(input = {}) {
  const state = normalizeState(input);
  let meanSpeedFractionC = 0;
  let maxSpeedFractionC = 0;
  let meanLorentzFactor = 0;
  let maxLorentzFactor = 1;
  let meanTimeDilation = 0;
  let minTimeDilation = 1;
  let meanRedshift = 0;
  let maxRedshift = 0;
  let meanPotential = 0;
  let maxPotential = 0;
  let meanPrecessionRad = 0;
  let meanFrameDragging = 0;
  let relativisticEnergyProxy = 0;
  let causalityClampCount = 0;

  for (let i = 0; i < state.sampleCount; i += 1) {
    const beta = clamp(Math.abs(state.speedFractionC[i]), 0, 0.999999);
    const gamma = lorentzFactor(beta);
    const dilation = clamp(state.timeDilationFactor[i], 0, 1.5);
    const redshift = Math.max(0, state.gravitationalRedshiftProxy[i]);
    const potential = Math.max(0, state.potentialProxy[i]);
    meanSpeedFractionC += beta;
    maxSpeedFractionC = Math.max(maxSpeedFractionC, beta);
    meanLorentzFactor += gamma;
    maxLorentzFactor = Math.max(maxLorentzFactor, gamma);
    meanTimeDilation += dilation;
    minTimeDilation = Math.min(minTimeDilation, dilation);
    meanRedshift += redshift;
    maxRedshift = Math.max(maxRedshift, redshift);
    meanPotential += potential;
    maxPotential = Math.max(maxPotential, potential);
    meanPrecessionRad += Math.abs(state.precessionRad[i]);
    meanFrameDragging += Math.abs(state.frameDraggingProxy[i]);
    relativisticEnergyProxy += gamma - 1;
    if (beta >= 0.985 || potential >= 0.49) causalityClampCount += 1;
  }

  const invCount = 1 / Math.max(1, state.sampleCount);
  meanSpeedFractionC *= invCount;
  meanLorentzFactor *= invCount;
  meanTimeDilation *= invCount;
  meanRedshift *= invCount;
  meanPotential *= invCount;
  meanPrecessionRad *= invCount;
  meanFrameDragging *= invCount;
  relativisticEnergyProxy *= invCount;

  return {
    schema: 'peercompute.multiscale.relativistic-correction.diagnostics.v0',
    sampleCount: state.sampleCount,
    meanSpeedFractionC,
    maxSpeedFractionC,
    meanLorentzFactor,
    maxLorentzFactor,
    meanTimeDilation,
    minTimeDilation,
    gravitationalRedshiftProxy: meanRedshift,
    maxGravitationalRedshiftProxy: maxRedshift,
    meanPotentialProxy: meanPotential,
    maxPotentialProxy: maxPotential,
    perihelionPrecessionArcsecProxy: meanPrecessionRad * 206264.806,
    frameDraggingProxy: meanFrameDragging,
    lensingDeflectionArcsecProxy: meanPotential * 4 * 206264.806,
    shapiroDelayProxy: Math.max(0, meanPotential) * 2.0e-3,
    relativisticEnergyProxy,
    causalityClampCount
  };
}

class RelativisticCorrectionWebGpuRuntime {
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
    if (!gpu) throw new Error('WebGPU unavailable for relativistic-correction worker');
    const usage = globalThis.GPUBufferUsage;
    if (!usage) throw new Error('GPUBufferUsage unavailable for relativistic-correction worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for relativistic-correction worker');
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
        module: this.device.createShaderModule({ code: RELATIVISTIC_SHADER }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`Relativistic correction WebGPU validation: ${validationError.message || validationError}`);
    }

    this.device.lost?.then((info) => {
      this.lastError = info?.message || info?.reason || 'Relativistic correction WebGPU device lost';
      gpuDisabledReasons.set(this.stateKey, this.lastError);
    });
  }

  async step(state, options) {
    await this.initialize(state.sampleCount);
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for relativistic-correction worker');
    const sampleData = sampleDataFromState(state);
    const params = new Float32Array([
      state.sampleCount,
      options.dt,
      options.compactness,
      options.spin,
      options.radiationPressure,
      options.maxwellFieldEnergy,
      options.poyntingMagnitude,
      options.alfvenSpeed,
      options.picKineticEnergy,
      options.picEscapeFraction,
      options.solarWindPressure,
      options.stellarLuminosityFactor
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
    state.elapsedTime += options.dt;
    this.submittedSteps += 1;
    return {
      backend: 'webgpu-relativistic-correction',
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
  return {
    dt: normalizeNumber(input.dt, 1 / 120, 0, 0.25),
    compactness: reducedCompactness({ environment, coupling }),
    spin: normalizeNumber(coupling.spin ?? input.spin, 0.15, -1, 1),
    radiationPressure: normalizeNumber(coupling.radiationPressure ?? input.radiationPressure, 1, 0, 6),
    maxwellFieldEnergy: normalizeNumber(coupling.maxwellFieldEnergy ?? input.maxwellFieldEnergy, 0, 0, 100),
    poyntingMagnitude: poyntingMagnitude(poynting),
    alfvenSpeed: normalizeNumber(coupling.alfvenSpeed ?? input.alfvenSpeed, 0, 0, 100),
    picKineticEnergy: normalizeNumber(coupling.picKineticEnergy ?? input.picKineticEnergy, 0, 0, 100000),
    picEscapeFraction: normalizeNumber(coupling.picEscapeFraction ?? coupling.picParticleEscapeFraction ?? input.picEscapeFraction, 0, 0, 1),
    solarWindPressure: normalizeNumber(coupling.solarWindPressure ?? coupling.magnetosphereSolarWindPressure ?? input.solarWindPressure, 0, 0, 100),
    stellarLuminosityFactor: normalizeNumber(coupling.stellarLuminosityFactor ?? input.stellarLuminosityFactor, 1, 0.05, 6)
  };
}

function stepRelativisticCorrectionCpu(state, options) {
  const next = cloneState(state);
  for (let i = 0; i < state.sampleCount; i += 1) {
    let radiusAu = clamp(state.radiiAu[i], 0.018, 80);
    let beta = clamp(state.speedFractionC[i], 0.00001, 0.985);
    let phase = state.phase[i];
    let precession = state.precessionRad[i];
    const fieldDrive = options.maxwellFieldEnergy * 0.0006 + options.poyntingMagnitude * 0.0004;
    const plasmaDrive = options.alfvenSpeed * 0.00018 + options.solarWindPressure * 0.00012;
    const kineticDrive = options.picKineticEnergy * 0.00008 + options.picEscapeFraction * 0.004;
    const radiationDrive = options.radiationPressure * 0.00016 + options.stellarLuminosityFactor * 0.00008;
    const localCompactness = clamp(options.compactness + fieldDrive + plasmaDrive + kineticDrive + radiationDrive, 0.0000001, 0.42);
    const targetBeta = clamp(
      Math.sqrt(localCompactness / Math.max(0.02, radiusAu)) + fieldDrive * 0.18 + kineticDrive * 0.25,
      0.00001,
      0.985
    );
    beta = clamp(beta + (targetBeta - beta) * options.dt * 0.22 + Math.sin(i * 12.9898 + phase) * options.dt * 0.0005, 0.00001, 0.985);
    radiusAu = clamp(
      radiusAu
        + Math.sin(phase + i * 0.37) * options.radiationPressure * options.dt * 0.00018
        - beta * beta * options.dt * 0.0007
        + options.solarWindPressure * options.dt * 0.00005,
      0.018,
      80
    );
    const gamma = lorentzFactor(beta);
    const potential = clamp(localCompactness / Math.max(0.018, radiusAu), 0, 0.49);
    const metric = Math.max(1e-9, 1 - 2 * potential);
    const timeDilation = Math.sqrt(metric) / gamma;
    const redshift = 1 / Math.sqrt(metric) - 1;
    const frameDragging = options.spin * potential * potential * 32 + options.poyntingMagnitude * 0.0025 + options.picEscapeFraction * 0.0015;
    const precessionStep = options.dt * (6 * Math.PI * potential * Math.max(0.2, beta)) + frameDragging * options.dt * 0.02;
    precession += precessionStep;
    phase += options.dt * beta / Math.max(0.04, radiusAu) + frameDragging * options.dt * 0.01;
    if (phase > Math.PI * 2) phase -= Math.floor(phase / (Math.PI * 2)) * Math.PI * 2;

    next.radiiAu[i] = radiusAu;
    next.speedFractionC[i] = beta;
    next.phase[i] = phase;
    next.precessionRad[i] = precession;
    next.potentialProxy[i] = potential;
    next.timeDilationFactor[i] = timeDilation;
    next.gravitationalRedshiftProxy[i] = redshift;
    next.frameDraggingProxy[i] = frameDragging;
  }
  next.elapsedTime += options.dt;
  return next;
}

async function advanceState(state, { stateKey, input, options }) {
  const wantsWebGpu = input.enableWebGPU !== false && input.webgpu !== false;
  const webGpuEligible = wantsWebGpu
    && state.sampleCount <= normalizeInteger(input.webgpuMaxSamples, RELATIVISTIC_CORRECTION_WEBGPU_MAX_SAMPLES, 1, 1048576)
    && !gpuDisabledReasons.has(stateKey);

  if (webGpuEligible) {
    try {
      let runtime = gpuRuntimes.get(stateKey);
      if (!runtime) {
        runtime = new RelativisticCorrectionWebGpuRuntime(stateKey);
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

  const next = stepRelativisticCorrectionCpu(state, options);
  Object.assign(state, next);
  return {
    backend: 'cpu-relativistic-correction',
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
    schema: payload.solver?.warmDelta?.schema || RELATIVISTIC_CORRECTION_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'relativistic-correction',
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
      radius: 'AU',
      speedFractionC: '1',
      timeDilation: 'proper-time/coordinate-time',
      redshift: '1',
      precession: 'arcsec-proxy',
      energy: input.energyUnit || 'reduced-relativistic-energy',
      time: input.timeUnit || 's'
    }
  };
}

export function resetRelativisticCorrection(input = {}) {
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
    schema: RELATIVISTIC_CORRECTION_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

export async function stepRelativisticCorrection(payload = {}) {
  const resolved = resolveInput(payload);
  const { input, stateKey } = resolved;
  const requestedReset = input.reset === true;
  const nextState = input.state || requestedReset || !states.has(stateKey)
    ? normalizeState(input)
    : cloneState(states.get(stateKey));
  const before = computeRelativisticCorrectionDiagnostics(nextState);
  const options = resolveStepOptions(input);
  const advanceResult = await advanceState(nextState, {
    stateKey,
    input,
    options
  });
  nextState.sequence += 1;
  states.set(stateKey, cloneState(nextState));
  const diagnostics = computeRelativisticCorrectionDiagnostics(nextState);
  const conservation = {
    relativisticEnergyDelta: diagnostics.relativisticEnergyProxy - before.relativisticEnergyProxy,
    timeDilationDrift: diagnostics.meanTimeDilation - before.meanTimeDilation,
    precessionDeltaArcsecProxy: diagnostics.perihelionPrecessionArcsecProxy - before.perihelionPrecessionArcsecProxy,
    causalityClampCount: diagnostics.causalityClampCount,
    maxSpeedFractionC: diagnostics.maxSpeedFractionC,
    energyMode: 'reduced-post-newtonian-proxy',
    note: 'Reduced interactive relativistic correction tile; not a validated GR/GRMHD solve.'
  };
  const state = cloneState(nextState);
  const value = {
    ok: true,
    schema: RELATIVISTIC_CORRECTION_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'relativistic-correction',
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
