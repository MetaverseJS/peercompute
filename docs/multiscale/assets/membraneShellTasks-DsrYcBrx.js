export const MEMBRANE_SHELL_STATE_SCHEMA = 'peercompute.multiscale.membrane-shell.state.v0';
export const MEMBRANE_SHELL_RESULT_SCHEMA = 'peercompute.multiscale.membrane-shell.result.v0';
export const MEMBRANE_SHELL_DELTA_SCHEMA = 'peercompute.multiscale.membrane-shell.delta.v0';
export const MEMBRANE_SHELL_WEBGPU_MAX_SEGMENTS = 4096;

const DEFAULT_STATE_KEY = 'multiscale:membrane-shell:default';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const SEGMENT_FLOATS = 8;
const PARAM_FLOATS = 20;
const PARAM_BYTES = PARAM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const WORKGROUP_SIZE = 64;
const states = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const MEMBRANE_SHADER = `
struct Segment {
  mechanics: vec4f,
  motion: vec4f,
};

struct Params {
  count: f32,
  dt: f32,
  internalPressurePa: f32,
  ambientPressurePa: f32,
  waterTemperatureK: f32,
  flameTemperatureK: f32,
  fireIntensity: f32,
  radiativeHeatFlux: f32,
  gravityMps2: f32,
  inputIntegrity: f32,
  ruptured: f32,
  ambientTemperatureK: f32,
  steamMassKg: f32,
  waterMassKg: f32,
  youngModulusPa: f32,
  tensileLimitPa: f32,
  waterContact: f32,
  coolingPotential: f32,
  pad0: f32,
  pad1: f32,
};

@group(0) @binding(0) var<storage, read> currentSegments: array<Segment>;
@group(0) @binding(1) var<storage, read_write> nextSegments: array<Segment>;
@group(0) @binding(2) var<uniform> params: Params;

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let index = gid.x;
  let count = u32(params.count);
  if (index >= count) {
    return;
  }

  let segment = currentSegments[index];
  var strain = segment.mechanics.x;
  var stressPa = segment.mechanics.y;
  var temperatureK = segment.mechanics.z;
  var damage = clamp(segment.mechanics.w, 0.0, 1.0);
  var displacement = segment.motion.x;
  var velocity = segment.motion.y;

  let dt = clamp(params.dt, 0.0, 0.1);
  let angle = (f32(index) / max(1.0, params.count)) * 6.28318530718;
  let fireAim = -0.72;
  let fireExposureBase = clamp((cos(angle - fireAim) + 1.0) * 0.5, 0.0, 1.0);
  let fireExposure = fireExposureBase * fireExposureBase;
  let pressureDelta = max(0.0, params.internalPressurePa - params.ambientPressurePa);
  let steamBoost = clamp(params.steamMassKg * 2.8, 0.0, 1.8);
  let waterCooling = clamp(params.waterMassKg * 0.7 + params.waterContact * 0.8 + params.coolingPotential * 0.5, 0.0, 2.0);
  let heatFlux = params.fireIntensity * fireExposure * max(0.0, params.flameTemperatureK - temperatureK) * 0.16
    + clamp(params.radiativeHeatFlux, -5000.0, 5000.0) * fireExposure * 0.008
    + (params.waterTemperatureK - temperatureK) * 0.22
    + (params.ambientTemperatureK - temperatureK) * 0.035
    - waterCooling * max(0.0, temperatureK - params.waterTemperatureK) * 0.18;
  temperatureK = clamp(temperatureK + heatFlux * dt, params.ambientTemperatureK, 900.0);

  let thermalSoftening = clamp(1.0 - max(0.0, temperatureK - 315.0) * 0.0035, 0.12, 1.0);
  let pressureStrain = pressureDelta / max(params.tensileLimitPa * 3.1, 1.0);
  let gravitySag = max(0.0, -sin(angle)) * params.gravityMps2 * 0.0009;
  let targetStrain = clamp(pressureStrain * (1.0 + steamBoost) + gravitySag + displacement * 0.12, 0.0, 0.45);
  let stiffness = max(1.0, params.youngModulusPa * thermalSoftening * (1.0 - damage * 0.72));
  let accel = (targetStrain - strain) * 18.0 - velocity * 3.2;
  velocity = velocity + accel * dt;
  strain = clamp(strain + velocity * dt, 0.0, 0.55);
  displacement = clamp(displacement + velocity * dt, -0.18, 0.42);
  stressPa = stiffness * strain;

  let limit = max(1.0, params.tensileLimitPa * thermalSoftening * (1.0 - damage * 0.25));
  let overStress = max(0.0, stressPa / limit - 0.56);
  let thermalDamage = max(0.0, temperatureK - 320.0) * dt * (0.00011 * fireExposure + 0.000025);
  let flameDamage = params.fireIntensity * fireExposure * dt * 0.006;
  let pressureDamage = overStress * overStress * dt * 0.03;
  damage = clamp(damage + thermalDamage + flameDamage + pressureDamage, 0.0, 1.0);
  if (params.ruptured > 0.5) {
    damage = clamp(damage + dt * 0.5, 0.0, 1.0);
    stressPa = stressPa * 0.22;
    strain = max(strain, 0.18);
  }

  nextSegments[index].mechanics = vec4f(strain, stressPa, temperatureK, damage);
  nextSegments[index].motion = vec4f(displacement, velocity, heatFlux, waterCooling);
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

function resolveOptions(input = {}) {
  const environment = input.environment || {};
  const coupling = input.coupling || {};
  return {
    dt: normalizeNumber(input.dt, 1 / 90, 0, 0.1),
    internalPressurePa: normalizeNumber(coupling.internalPressurePa, 109000, 1, 1e8),
    ambientPressurePa: normalizeNumber(environment.ambientPressurePa, 101325, 1, 1e8),
    waterTemperatureK: normalizeNumber(coupling.waterTemperatureK, 294, 1, 20000),
    flameTemperatureK: normalizeNumber(coupling.flameTemperatureK, 1060, 250, 4000),
    fireIntensity: clamp(normalizeNumber(coupling.fireIntensity, 0.78), 0, 2),
    radiativeHeatFlux: normalizeNumber(coupling.radiativeHeatFlux, 0, -5000, 5000),
    gravityMps2: normalizeNumber(environment.gravityMps2, 9.8, 0, 100),
    inputIntegrity: clamp(normalizeNumber(coupling.membraneIntegrity, 1), 0, 1),
    ruptured: coupling.ruptured === true ? 1 : 0,
    ambientTemperatureK: normalizeNumber(environment.ambientTemperatureK, 294, 1, 20000),
    steamMassKg: normalizeNumber(coupling.steamMassKg, 0, 0, 100),
    waterMassKg: normalizeNumber(coupling.waterMassKg, 0.42, 0, 100),
    youngModulusPa: normalizeNumber(input.youngModulusPa ?? coupling.youngModulusPa, 1600000, 1, 1e11),
    tensileLimitPa: normalizeNumber(input.tensileLimitPa ?? coupling.tensileLimitPa, 2200000, 1, 1e12),
    waterContact: clamp(normalizeNumber(coupling.waterContact, 0), 0, 2),
    coolingPotential: clamp(normalizeNumber(coupling.coolingPotential, 0), 0, 2)
  };
}

export function makeMembraneShellInitialState({
  segmentCount = 64,
  seed = 20260529,
  environment = {},
  coupling = {}
} = {}) {
  const count = normalizeInteger(segmentCount, 64, 8, MEMBRANE_SHELL_WEBGPU_MAX_SEGMENTS);
  const rng = createRng(seed);
  const ambientTemperatureK = normalizeNumber(environment.ambientTemperatureK, 294, 1, 20000);
  const waterTemperatureK = normalizeNumber(coupling.waterTemperatureK, ambientTemperatureK, 1, 20000);
  const pressureDelta = Math.max(
    0,
    normalizeNumber(coupling.internalPressurePa, 109000, 1, 1e8)
      - normalizeNumber(environment.ambientPressurePa, 101325, 1, 1e8)
  );
  const baseStrain = clamp(pressureDelta / 9000000, 0.001, 0.08);
  const strain = new Array(count);
  const stressPa = new Array(count);
  const temperatureK = new Array(count);
  const damage = new Array(count);
  const radialDisplacement = new Array(count);
  const radialVelocity = new Array(count);
  const heatFluxWm2 = new Array(count);
  const coolingFactor = new Array(count);

  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const fireExposure = Math.max(0, Math.cos(angle + 0.72));
    const jitter = (rng() - 0.5) * 0.012;
    strain[i] = clamp(baseStrain + jitter * 0.25, 0, 0.12);
    stressPa[i] = strain[i] * 1600000;
    temperatureK[i] = clamp(
      ambientTemperatureK * 0.62 + waterTemperatureK * 0.38 + fireExposure * 4 + (rng() - 0.5) * 1.5,
      ambientTemperatureK,
      360
    );
    damage[i] = clamp((rng() - 0.5) * 0.006, 0, 0.02);
    radialDisplacement[i] = 0;
    radialVelocity[i] = 0;
    heatFluxWm2[i] = 0;
    coolingFactor[i] = 0;
  }

  return {
    schema: MEMBRANE_SHELL_STATE_SCHEMA,
    sequence: 0,
    elapsedTime: 0,
    segmentCount: count,
    membraneIntegrity: clamp(normalizeNumber(coupling.membraneIntegrity, 1), 0, 1),
    ruptured: coupling.ruptured === true,
    strain,
    stressPa,
    temperatureK,
    damage,
    radialDisplacement,
    radialVelocity,
    heatFluxWm2,
    coolingFactor
  };
}

function normalizeState(input = {}) {
  const source = input.state || input;
  if (!source.strain || !source.temperatureK) return makeMembraneShellInitialState(input);
  const segmentCount = normalizeInteger(
    source.segmentCount || source.strain?.length,
    64,
    8,
    MEMBRANE_SHELL_WEBGPU_MAX_SEGMENTS
  );
  return {
    schema: MEMBRANE_SHELL_STATE_SCHEMA,
    sequence: normalizeInteger(source.sequence, 0, 0),
    elapsedTime: normalizeNumber(source.elapsedTime, 0, 0),
    segmentCount,
    membraneIntegrity: clamp(normalizeNumber(source.membraneIntegrity, input.coupling?.membraneIntegrity ?? 1), 0, 1),
    ruptured: source.ruptured === true,
    strain: toFiniteArray(source.strain, segmentCount, 'strain', 0),
    stressPa: toFiniteArray(source.stressPa, segmentCount, 'stressPa', 0),
    temperatureK: toFiniteArray(source.temperatureK, segmentCount, 'temperatureK', 294),
    damage: toFiniteArray(source.damage, segmentCount, 'damage', 0),
    radialDisplacement: toFiniteArray(source.radialDisplacement, segmentCount, 'radialDisplacement', 0),
    radialVelocity: toFiniteArray(source.radialVelocity, segmentCount, 'radialVelocity', 0),
    heatFluxWm2: toFiniteArray(source.heatFluxWm2, segmentCount, 'heatFluxWm2', 0),
    coolingFactor: toFiniteArray(source.coolingFactor, segmentCount, 'coolingFactor', 0)
  };
}

function cloneState(state) {
  return {
    schema: MEMBRANE_SHELL_STATE_SCHEMA,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    segmentCount: state.segmentCount,
    membraneIntegrity: state.membraneIntegrity,
    ruptured: state.ruptured,
    strain: [...state.strain],
    stressPa: [...state.stressPa],
    temperatureK: [...state.temperatureK],
    damage: [...state.damage],
    radialDisplacement: [...state.radialDisplacement],
    radialVelocity: [...state.radialVelocity],
    heatFluxWm2: [...state.heatFluxWm2],
    coolingFactor: [...state.coolingFactor]
  };
}

function segmentDataFromState(state) {
  const data = new Float32Array(state.segmentCount * SEGMENT_FLOATS);
  for (let i = 0; i < state.segmentCount; i += 1) {
    const dst = i * SEGMENT_FLOATS;
    data[dst] = state.strain[i];
    data[dst + 1] = state.stressPa[i];
    data[dst + 2] = state.temperatureK[i];
    data[dst + 3] = state.damage[i];
    data[dst + 4] = state.radialDisplacement[i];
    data[dst + 5] = state.radialVelocity[i];
    data[dst + 6] = state.heatFluxWm2[i];
    data[dst + 7] = state.coolingFactor[i];
  }
  return data;
}

function applySegmentDataToState(state, data) {
  for (let i = 0; i < state.segmentCount; i += 1) {
    const src = i * SEGMENT_FLOATS;
    state.strain[i] = data[src];
    state.stressPa[i] = data[src + 1];
    state.temperatureK[i] = data[src + 2];
    state.damage[i] = data[src + 3];
    state.radialDisplacement[i] = data[src + 4];
    state.radialVelocity[i] = data[src + 5];
    state.heatFluxWm2[i] = data[src + 6];
    state.coolingFactor[i] = data[src + 7];
  }
}

export function computeMembraneShellDiagnostics(input = {}) {
  const state = normalizeState(input);
  let meanTemperatureK = 0;
  let maxTemperatureK = 0;
  let meanStressPa = 0;
  let maxStressPa = 0;
  let meanStrain = 0;
  let maxStrain = 0;
  let damageMean = 0;
  let damageMax = 0;
  let heatFluxMean = 0;
  let coolingMean = 0;
  for (let i = 0; i < state.segmentCount; i += 1) {
    const temperature = state.temperatureK[i];
    const stress = Math.max(0, state.stressPa[i]);
    const strain = Math.max(0, state.strain[i]);
    const damage = clamp(state.damage[i], 0, 1);
    meanTemperatureK += temperature;
    maxTemperatureK = Math.max(maxTemperatureK, temperature);
    meanStressPa += stress;
    maxStressPa = Math.max(maxStressPa, stress);
    meanStrain += strain;
    maxStrain = Math.max(maxStrain, strain);
    damageMean += damage;
    damageMax = Math.max(damageMax, damage);
    heatFluxMean += state.heatFluxWm2[i];
    coolingMean += state.coolingFactor[i];
  }
  const count = Math.max(1, state.segmentCount);
  meanTemperatureK /= count;
  meanStressPa /= count;
  meanStrain /= count;
  damageMean /= count;
  heatFluxMean /= count;
  coolingMean /= count;
  const thermalRisk = clamp((maxTemperatureK - 315) / 170, 0, 1);
  const strainRisk = clamp(maxStrain / 0.22, 0, 1);
  const stressRisk = clamp(maxStressPa / 2200000, 0, 1);
  const ruptureRisk = clamp(damageMax * 0.52 + damageMean * 0.18 + thermalRisk * 0.14 + strainRisk * 0.1 + stressRisk * 0.06, 0, 1);
  const integrity = state.ruptured
    ? Math.min(state.membraneIntegrity, 0.08)
    : clamp(Math.min(state.membraneIntegrity, 1 - damageMax * 0.5 - damageMean * 0.28 - thermalRisk * 0.06), 0, 1);

  return {
    schema: 'peercompute.multiscale.membrane-shell.diagnostics.v0',
    segmentCount: state.segmentCount,
    membraneIntegrity: integrity,
    ruptured: state.ruptured,
    meanTemperatureK,
    maxTemperatureK,
    meanStressPa,
    maxStressPa,
    meanStrain,
    maxStrain,
    damageMean,
    damageMax,
    heatFluxMean,
    coolingMean,
    ruptureRisk,
    burst: state.ruptured || integrity < 0.22 || ruptureRisk > 0.93
  };
}

class MembraneShellWebGpuRuntime {
  constructor(stateKey) {
    this.stateKey = stateKey;
    this.device = null;
    this.pipeline = null;
    this.currentBuffer = null;
    this.nextBuffer = null;
    this.readBuffer = null;
    this.paramBuffer = null;
    this.segmentCount = 0;
    this.submittedSteps = 0;
    this.lastError = null;
  }

  async initialize(segmentCount) {
    if (this.device && this.segmentCount === segmentCount) return;
    const gpu = globalThis.navigator?.gpu;
    if (!gpu) throw new Error('WebGPU unavailable for membrane shell worker');
    const usage = globalThis.GPUBufferUsage;
    if (!usage) throw new Error('GPUBufferUsage unavailable for membrane shell worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for membrane shell worker');
    this.device = await adapter.requestDevice();
    this.segmentCount = segmentCount;

    const segmentBytes = segmentCount * SEGMENT_FLOATS * Float32Array.BYTES_PER_ELEMENT;
    this.currentBuffer = this.device.createBuffer({ size: segmentBytes, usage: usage.STORAGE | usage.COPY_DST });
    this.nextBuffer = this.device.createBuffer({ size: segmentBytes, usage: usage.STORAGE | usage.COPY_SRC });
    this.readBuffer = this.device.createBuffer({ size: segmentBytes, usage: usage.COPY_DST | usage.MAP_READ });
    this.paramBuffer = this.device.createBuffer({ size: PARAM_BYTES, usage: usage.UNIFORM | usage.COPY_DST });

    this.device.pushErrorScope?.('validation');
    this.pipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: this.device.createShaderModule({ code: MEMBRANE_SHADER }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`Membrane shell WebGPU validation: ${validationError.message || validationError}`);
    }
    this.device.lost?.then((info) => {
      this.lastError = info?.message || info?.reason || 'Membrane shell WebGPU device lost';
      gpuDisabledReasons.set(this.stateKey, this.lastError);
    });
  }

  async step(state, options) {
    await this.initialize(state.segmentCount);
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for membrane shell worker');
    const segmentData = segmentDataFromState(state);
    const params = new Float32Array([
      state.segmentCount,
      options.dt,
      options.internalPressurePa,
      options.ambientPressurePa,
      options.waterTemperatureK,
      options.flameTemperatureK,
      options.fireIntensity,
      options.radiativeHeatFlux,
      options.gravityMps2,
      options.inputIntegrity,
      options.ruptured,
      options.ambientTemperatureK,
      options.steamMassKg,
      options.waterMassKg,
      options.youngModulusPa,
      options.tensileLimitPa,
      options.waterContact,
      options.coolingPotential,
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

    this.device.queue.writeBuffer(this.currentBuffer, 0, segmentData);
    this.device.queue.writeBuffer(this.paramBuffer, 0, params);
    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(Math.ceil(state.segmentCount / WORKGROUP_SIZE));
    pass.end();
    encoder.copyBufferToBuffer(this.nextBuffer, 0, this.readBuffer, 0, segmentData.byteLength);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone?.();
    await this.readBuffer.mapAsync(mapMode.READ);
    const mapped = this.readBuffer.getMappedRange();
    const result = new Float32Array(mapped).slice();
    this.readBuffer.unmap();
    applySegmentDataToState(state, result);
    state.elapsedTime += options.dt;
    this.submittedSteps += 1;
    return {
      backend: 'webgpu-membrane-shell',
      webgpuStatus: {
        stateKey: this.stateKey,
        segmentCount: state.segmentCount,
        submittedSteps: this.submittedSteps
      }
    };
  }
}

function stepMembraneCpu(state, options) {
  const next = cloneState(state);
  for (let i = 0; i < state.segmentCount; i += 1) {
    const angle = (i / Math.max(1, state.segmentCount)) * Math.PI * 2;
    const fireExposure = clamp((Math.cos(angle + 0.72) + 1) * 0.5, 0, 1) ** 2;
    const pressureDelta = Math.max(0, options.internalPressurePa - options.ambientPressurePa);
    const steamBoost = clamp(options.steamMassKg * 2.8, 0, 1.8);
    const waterCooling = clamp(options.waterMassKg * 0.7 + options.waterContact * 0.8 + options.coolingPotential * 0.5, 0, 2);
    const heatFlux = options.fireIntensity * fireExposure * Math.max(0, options.flameTemperatureK - state.temperatureK[i]) * 0.16
      + options.radiativeHeatFlux * fireExposure * 0.008
      + (options.waterTemperatureK - state.temperatureK[i]) * 0.22
      + (options.ambientTemperatureK - state.temperatureK[i]) * 0.035
      - waterCooling * Math.max(0, state.temperatureK[i] - options.waterTemperatureK) * 0.18;
    const temperatureK = clamp(state.temperatureK[i] + heatFlux * options.dt, options.ambientTemperatureK, 900);
    const thermalSoftening = clamp(1 - Math.max(0, temperatureK - 315) * 0.0035, 0.12, 1);
    const pressureStrain = pressureDelta / Math.max(options.tensileLimitPa * 3.1, 1);
    const gravitySag = Math.max(0, -Math.sin(angle)) * options.gravityMps2 * 0.0009;
    const targetStrain = clamp(pressureStrain * (1 + steamBoost) + gravitySag + state.radialDisplacement[i] * 0.12, 0, 0.45);
    let radialVelocity = state.radialVelocity[i] + ((targetStrain - state.strain[i]) * 18 - state.radialVelocity[i] * 3.2) * options.dt;
    let strain = clamp(state.strain[i] + radialVelocity * options.dt, 0, 0.55);
    let radialDisplacement = clamp(state.radialDisplacement[i] + radialVelocity * options.dt, -0.18, 0.42);
    let stressPa = Math.max(1, options.youngModulusPa * thermalSoftening * (1 - state.damage[i] * 0.72)) * strain;
    const limit = Math.max(1, options.tensileLimitPa * thermalSoftening * (1 - state.damage[i] * 0.25));
    const overStress = Math.max(0, stressPa / limit - 0.56);
    const thermalDamage = Math.max(0, temperatureK - 320) * options.dt * (0.00011 * fireExposure + 0.000025);
    const flameDamage = options.fireIntensity * fireExposure * options.dt * 0.006;
    const pressureDamage = overStress * overStress * options.dt * 0.03;
    let damage = clamp(state.damage[i] + thermalDamage + flameDamage + pressureDamage, 0, 1);
    if (options.ruptured > 0.5) {
      damage = clamp(damage + options.dt * 0.5, 0, 1);
      stressPa *= 0.22;
      strain = Math.max(strain, 0.18);
      radialVelocity *= 0.65;
      radialDisplacement = Math.max(radialDisplacement, 0.15);
    }
    next.strain[i] = strain;
    next.stressPa[i] = stressPa;
    next.temperatureK[i] = temperatureK;
    next.damage[i] = damage;
    next.radialDisplacement[i] = radialDisplacement;
    next.radialVelocity[i] = radialVelocity;
    next.heatFluxWm2[i] = heatFlux;
    next.coolingFactor[i] = waterCooling;
  }
  next.elapsedTime += options.dt;
  return next;
}

async function advanceState(state, { stateKey, input, options }) {
  const wantsWebGpu = input.enableWebGPU !== false && input.webgpu !== false;
  const webGpuEligible = wantsWebGpu
    && state.segmentCount <= normalizeInteger(input.webgpuMaxSegments, MEMBRANE_SHELL_WEBGPU_MAX_SEGMENTS, 8, 1048576)
    && !gpuDisabledReasons.has(stateKey);

  if (webGpuEligible) {
    try {
      let runtime = gpuRuntimes.get(stateKey);
      if (!runtime) {
        runtime = new MembraneShellWebGpuRuntime(stateKey);
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

  const next = stepMembraneCpu(state, options);
  Object.assign(state, next);
  return {
    backend: 'cpu-membrane-shell',
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
    schema: payload.solver?.warmDelta?.schema || MEMBRANE_SHELL_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'membrane-shell',
    stateKey,
    backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    segmentCount: state.segmentCount,
    diagnostics,
    conservation,
    state: cloneState(state),
    webgpuStatus,
    webgpuError,
    units: {
      temperature: 'K',
      stress: 'Pa',
      strain: '1',
      heatFlux: input.heatFluxUnit || 'reduced W/m^2'
    }
  };
}

export function resetMembraneShell(input = {}) {
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
    schema: MEMBRANE_SHELL_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

export async function stepMembraneShell(payload = {}) {
  const resolved = resolveInput(payload);
  const { input, stateKey } = resolved;
  const requestedReset = input.reset === true;
  const nextState = input.state || requestedReset || !states.has(stateKey)
    ? normalizeState(input)
    : cloneState(states.get(stateKey));
  const options = resolveOptions(input);
  nextState.membraneIntegrity = Math.min(nextState.membraneIntegrity, options.inputIntegrity);
  nextState.ruptured = nextState.ruptured || options.ruptured > 0.5;
  const before = computeMembraneShellDiagnostics(nextState);
  const advanceResult = await advanceState(nextState, { stateKey, input, options });
  let diagnostics = computeMembraneShellDiagnostics(nextState);
  nextState.membraneIntegrity = Math.min(nextState.membraneIntegrity, diagnostics.membraneIntegrity);
  if (diagnostics.burst) {
    nextState.ruptured = true;
    nextState.membraneIntegrity = Math.min(nextState.membraneIntegrity, 0.08);
    diagnostics = computeMembraneShellDiagnostics(nextState);
  }
  nextState.sequence += 1;
  states.set(stateKey, cloneState(nextState));
  const conservation = {
    strainEnergyProxyDelta: (diagnostics.meanStressPa * diagnostics.meanStrain) - (before.meanStressPa * before.meanStrain),
    heatFluxMeanDelta: diagnostics.heatFluxMean - before.heatFluxMean,
    damageDelta: diagnostics.damageMean - before.damageMean,
    energyMode: 'reduced-membrane-shell',
    note: 'Reduced thin-shell membrane worker; not a validated latex material or closed fracture-energy model.'
  };
  const state = cloneState(nextState);
  const value = {
    ok: true,
    schema: MEMBRANE_SHELL_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'membrane-shell',
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
