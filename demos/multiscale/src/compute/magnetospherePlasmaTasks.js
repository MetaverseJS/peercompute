export const MAGNETOSPHERE_PLASMA_STATE_SCHEMA = 'peercompute.multiscale.magnetosphere-plasma.state.v0';
export const MAGNETOSPHERE_PLASMA_RESULT_SCHEMA = 'peercompute.multiscale.magnetosphere-plasma.result.v0';
export const MAGNETOSPHERE_PLASMA_DELTA_SCHEMA = 'peercompute.multiscale.magnetosphere-plasma.delta.v0';
export const MAGNETOSPHERE_PLASMA_WEBGPU_MAX_CELLS = 16384;

const DEFAULT_STATE_KEY = 'multiscale:magnetosphere-plasma:default';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const CELL_FLOATS = 12;
const PARAM_FLOATS = 12;
const PARAM_BYTES = PARAM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const WORKGROUP_SIZE = 64;
const states = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const MAGNETOSPHERE_SHADER = `
struct Cell {
  plasma: vec4f,
  field: vec4f,
  derived: vec4f,
};

struct Params {
  width: f32,
  height: f32,
  dt: f32,
  stellarFlux: f32,
  luminosityFactor: f32,
  radiationPressure: f32,
  maxwellFieldEnergy: f32,
  poyntingX: f32,
  poyntingY: f32,
  magneticSeed: f32,
  gravityMps2: f32,
  ambientPressurePa: f32,
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

  let dt = clamp(params.dt, 0.0, 0.2);
  let u = f32(x) / max(1.0, params.width - 1.0) - 0.5;
  let v = f32(y) / max(1.0, params.height - 1.0) - 0.5;
  let r = max(0.04, sqrt(u * u + v * v));
  let radial = vec2f(u / r, v / r);
  let sheath = exp(-abs(r - 0.28) * 9.0);

  var density = clamp(cell.plasma.x, 0.001, 16.0);
  var temperatureK = clamp(cell.plasma.y, 80.0, 4800000.0);
  var velocity = vec2f(cell.plasma.z, cell.plasma.w);
  var magnetic = vec3f(cell.field.x, cell.field.y, cell.field.z);
  var ionization = clamp(cell.field.w, 0.0, 1.0);

  let densityMix = (right.plasma.x + left.plasma.x + up.plasma.x + down.plasma.x) * 0.25;
  let tempMix = (right.plasma.y + left.plasma.y + up.plasma.y + down.plasma.y) * 0.25;
  let dPdx = (right.derived.x - left.derived.x) * 0.5;
  let dPdy = (up.derived.x - down.derived.x) * 0.5;
  let dByDx = (right.field.y - left.field.y) * 0.5;
  let dBxDy = (up.field.x - down.field.x) * 0.5;
  let dBzDx = (right.field.z - left.field.z) * 0.5;
  let dBzDy = (up.field.z - down.field.z) * 0.5;
  let current = abs(dByDx - dBxDy) + abs(dBzDx) * 0.35 + abs(dBzDy) * 0.35;

  let windDrive = radial * (params.stellarFlux * params.luminosityFactor + params.radiationPressure * 0.35) * (0.02 + sheath * 0.035);
  let lorentz = vec2f(-magnetic.y, magnetic.x) * current * (0.006 + ionization * 0.026);
  let poyntingPush = vec2f(params.poyntingX, params.poyntingY) * 0.018;
  let pressurePush = vec2f(-dPdx, -dPdy) * 0.000014 / max(0.08, density);
  velocity = (velocity + windDrive + lorentz + poyntingPush + pressurePush) * (0.988 - ionization * 0.006);

  let maxwellHeat = params.maxwellFieldEnergy * (0.018 + current * 0.012);
  let stellarHeat = params.stellarFlux * params.luminosityFactor * (45.0 + sheath * 260.0);
  let ohmicHeat = current * current * (20.0 + ionization * 95.0);
  let cooling = max(0.0, temperatureK - 4200.0) * (0.0025 + density * 0.00028);
  temperatureK = clamp(temperatureK + (tempMix - temperatureK) * dt * 0.03 + dt * (stellarHeat + maxwellHeat + ohmicHeat - cooling), 80.0, 4800000.0);
  density = clamp(density + (densityMix - density) * dt * 0.045 + sheath * params.stellarFlux * dt * 0.008 - length(velocity) * dt * 0.002, 0.001, 16.0);

  let twist = (velocity.x * radial.y - velocity.y * radial.x) * 0.018 + params.magneticSeed * 0.004;
  magnetic.x = magnetic.x + (right.field.x + left.field.x + up.field.x + down.field.x - magnetic.x * 4.0) * dt * 0.012 - velocity.y * dt * 0.01;
  magnetic.y = magnetic.y + (right.field.y + left.field.y + up.field.y + down.field.y - magnetic.y * 4.0) * dt * 0.012 + velocity.x * dt * 0.01;
  magnetic.z = magnetic.z + twist + (params.maxwellFieldEnergy * 0.006 + current * 0.004 - magnetic.z * 0.018) * dt;

  let ionTarget = clamp((temperatureK - 2400.0) / 140000.0 + params.radiationPressure * 0.04 + current * 0.02, 0.0, 1.0);
  ionization = clamp(ionization + (ionTarget - ionization) * dt * 0.12, 0.0, 1.0);
  let pressure = density * temperatureK * (0.0024 + ionization * 0.0045) + params.ambientPressurePa * 0.0000002 * density;
  let energy = density * temperatureK * 0.012 + 0.5 * dot(velocity, velocity) * density + 0.5 * dot(magnetic, magnetic);

  nextCells[index].plasma = vec4f(density, temperatureK, velocity.x, velocity.y);
  nextCells[index].field = vec4f(magnetic, ionization);
  nextCells[index].derived = vec4f(pressure, current, energy, 0.0);
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

function couplingValue(coupling = {}, key, fallback, min = -Number.MAX_VALUE, max = Number.MAX_VALUE) {
  return normalizeNumber(coupling[key], fallback, min, max);
}

function pressureForCell({ density, temperatureK, ionization, ambientPressurePa }) {
  return Math.max(0, density * temperatureK * (0.0024 + ionization * 0.0045) + ambientPressurePa * 0.0000002 * density);
}

function currentForCell(state, x, y) {
  const width = state.width;
  const height = state.height;
  const right = idx(wrap(x + 1, width), y, width);
  const left = idx(wrap(x - 1, width), y, width);
  const up = idx(x, wrap(y + 1, height), width);
  const down = idx(x, wrap(y - 1, height), width);
  const dByDx = (state.magneticY[right] - state.magneticY[left]) * 0.5;
  const dBxDy = (state.magneticX[up] - state.magneticX[down]) * 0.5;
  const dBzDx = (state.magneticZ[right] - state.magneticZ[left]) * 0.5;
  const dBzDy = (state.magneticZ[up] - state.magneticZ[down]) * 0.5;
  return Math.abs(dByDx - dBxDy) + Math.abs(dBzDx) * 0.35 + Math.abs(dBzDy) * 0.35;
}

function divergenceForCell(state, x, y) {
  const width = state.width;
  const height = state.height;
  const right = idx(wrap(x + 1, width), y, width);
  const left = idx(wrap(x - 1, width), y, width);
  const up = idx(x, wrap(y + 1, height), width);
  const down = idx(x, wrap(y - 1, height), width);
  return Math.abs((state.magneticX[right] - state.magneticX[left]) * 0.5 + (state.magneticY[up] - state.magneticY[down]) * 0.5);
}

export function makeMagnetospherePlasmaInitialState({
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
  const stellarFlux = normalizeNumber(environment.stellarFlux, 1, 0.1, 5);
  const luminosityFactor = couplingValue(coupling, 'stellarLuminosityFactor', 1, 0.05, 4);
  const radiationPressure = couplingValue(coupling, 'radiationPressure', 1, 0, 5);
  const ambientPressurePa = normalizeNumber(environment.ambientPressurePa, 101325, 0, 10000000);
  const plasmaDensity = new Array(cellCount);
  const temperatureK = new Array(cellCount);
  const velocityX = new Array(cellCount);
  const velocityY = new Array(cellCount);
  const magneticX = new Array(cellCount);
  const magneticY = new Array(cellCount);
  const magneticZ = new Array(cellCount);
  const ionizationFraction = new Array(cellCount);
  const pressurePa = new Array(cellCount);
  const currentDensity = new Array(cellCount);
  const energyDensity = new Array(cellCount);

  for (let y = 0; y < safeHeight; y += 1) {
    for (let x = 0; x < safeWidth; x += 1) {
      const cell = idx(x, y, safeWidth);
      const u = x / Math.max(1, safeWidth - 1) - 0.5;
      const v = y / Math.max(1, safeHeight - 1) - 0.5;
      const r = Math.max(0.04, Math.hypot(u, v));
      const sheath = Math.exp(-Math.abs(r - 0.28) * 9);
      const dipole = clamp(0.12 / (r * r + 0.06), 0.05, 2.8);
      const noise = (rng() - 0.5) * 0.04;
      const radialX = u / r;
      const radialY = v / r;
      plasmaDensity[cell] = clamp(0.22 + sheath * (1.4 + radiationPressure * 0.18) + noise, 0.001, 16);
      temperatureK[cell] = clamp(5200 + sheath * 180000 * stellarFlux * luminosityFactor + noise * 2400, 80, 4800000);
      velocityX[cell] = radialX * (0.08 + stellarFlux * 0.09 + sheath * 0.08);
      velocityY[cell] = radialY * (0.08 + stellarFlux * 0.09 + sheath * 0.08);
      magneticX[cell] = -v * dipole;
      magneticY[cell] = u * dipole;
      magneticZ[cell] = dipole * (0.2 + sheath * 0.45);
      ionizationFraction[cell] = clamp(0.04 + sheath * 0.34 + stellarFlux * 0.06, 0, 1);
      pressurePa[cell] = pressureForCell({
        density: plasmaDensity[cell],
        temperatureK: temperatureK[cell],
        ionization: ionizationFraction[cell],
        ambientPressurePa
      });
      currentDensity[cell] = 0;
      energyDensity[cell] = plasmaDensity[cell] * temperatureK[cell] * 0.012
        + 0.5 * (velocityX[cell] * velocityX[cell] + velocityY[cell] * velocityY[cell]) * plasmaDensity[cell]
        + 0.5 * (magneticX[cell] * magneticX[cell] + magneticY[cell] * magneticY[cell] + magneticZ[cell] * magneticZ[cell]);
    }
  }

  const state = {
    schema: MAGNETOSPHERE_PLASMA_STATE_SCHEMA,
    sequence: 0,
    elapsedTime: 0,
    width: safeWidth,
    height: safeHeight,
    plasmaDensity,
    temperatureK,
    velocityX,
    velocityY,
    magneticX,
    magneticY,
    magneticZ,
    ionizationFraction,
    pressurePa,
    currentDensity,
    energyDensity
  };
  for (let y = 0; y < safeHeight; y += 1) {
    for (let x = 0; x < safeWidth; x += 1) {
      const cell = idx(x, y, safeWidth);
      state.currentDensity[cell] = currentForCell(state, x, y);
    }
  }
  return state;
}

function normalizeState(input = {}) {
  const source = input.state || input;
  if (!source.plasmaDensity || !source.temperatureK) return makeMagnetospherePlasmaInitialState(input);
  const width = normalizeInteger(source.width, 18, 4, 128);
  const height = normalizeInteger(source.height, Math.max(4, Math.round(width / 2)), 4, 128);
  const cellCount = width * height;
  return {
    schema: MAGNETOSPHERE_PLASMA_STATE_SCHEMA,
    sequence: normalizeInteger(source.sequence, 0, 0),
    elapsedTime: normalizeNumber(source.elapsedTime, 0, 0),
    width,
    height,
    plasmaDensity: toFiniteArray(source.plasmaDensity, cellCount, 'plasmaDensity', 0.2),
    temperatureK: toFiniteArray(source.temperatureK, cellCount, 'temperatureK', 5200),
    velocityX: toFiniteArray(source.velocityX, cellCount, 'velocityX', 0),
    velocityY: toFiniteArray(source.velocityY, cellCount, 'velocityY', 0),
    magneticX: toFiniteArray(source.magneticX, cellCount, 'magneticX', 0),
    magneticY: toFiniteArray(source.magneticY, cellCount, 'magneticY', 0),
    magneticZ: toFiniteArray(source.magneticZ, cellCount, 'magneticZ', 0),
    ionizationFraction: toFiniteArray(source.ionizationFraction, cellCount, 'ionizationFraction', 0.1),
    pressurePa: toFiniteArray(source.pressurePa, cellCount, 'pressurePa', 0),
    currentDensity: toFiniteArray(source.currentDensity, cellCount, 'currentDensity', 0),
    energyDensity: toFiniteArray(source.energyDensity, cellCount, 'energyDensity', 0)
  };
}

function cloneState(state) {
  return {
    schema: MAGNETOSPHERE_PLASMA_STATE_SCHEMA,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    width: state.width,
    height: state.height,
    plasmaDensity: [...state.plasmaDensity],
    temperatureK: [...state.temperatureK],
    velocityX: [...state.velocityX],
    velocityY: [...state.velocityY],
    magneticX: [...state.magneticX],
    magneticY: [...state.magneticY],
    magneticZ: [...state.magneticZ],
    ionizationFraction: [...state.ionizationFraction],
    pressurePa: [...state.pressurePa],
    currentDensity: [...state.currentDensity],
    energyDensity: [...state.energyDensity]
  };
}

function cellDataFromState(state) {
  const cellCount = state.width * state.height;
  const data = new Float32Array(cellCount * CELL_FLOATS);
  for (let i = 0; i < cellCount; i += 1) {
    const dst = i * CELL_FLOATS;
    data[dst] = state.plasmaDensity[i];
    data[dst + 1] = state.temperatureK[i];
    data[dst + 2] = state.velocityX[i];
    data[dst + 3] = state.velocityY[i];
    data[dst + 4] = state.magneticX[i];
    data[dst + 5] = state.magneticY[i];
    data[dst + 6] = state.magneticZ[i];
    data[dst + 7] = state.ionizationFraction[i];
    data[dst + 8] = state.pressurePa[i];
    data[dst + 9] = state.currentDensity[i];
    data[dst + 10] = state.energyDensity[i];
    data[dst + 11] = 0;
  }
  return data;
}

function applyCellDataToState(state, data) {
  const cellCount = state.width * state.height;
  for (let i = 0; i < cellCount; i += 1) {
    const src = i * CELL_FLOATS;
    state.plasmaDensity[i] = data[src];
    state.temperatureK[i] = data[src + 1];
    state.velocityX[i] = data[src + 2];
    state.velocityY[i] = data[src + 3];
    state.magneticX[i] = data[src + 4];
    state.magneticY[i] = data[src + 5];
    state.magneticZ[i] = data[src + 6];
    state.ionizationFraction[i] = data[src + 7];
    state.pressurePa[i] = data[src + 8];
    state.currentDensity[i] = data[src + 9];
    state.energyDensity[i] = data[src + 10];
  }
}

export function computeMagnetosphereDiagnostics(input = {}) {
  const state = normalizeState(input);
  const cellCount = state.width * state.height;
  let totalMass = 0;
  let meanTemperatureK = 0;
  let meanIonizationFraction = 0;
  let magneticEnergy = 0;
  let kineticEnergy = 0;
  let thermalEnergy = 0;
  let currentSheetIntensity = 0;
  let divergenceBProxy = 0;
  let maxSpeed = 0;
  let maxCurrentDensity = 0;
  let sheathDensity = 0;
  let sheathWeight = 0;

  for (let y = 0; y < state.height; y += 1) {
    for (let x = 0; x < state.width; x += 1) {
      const cell = idx(x, y, state.width);
      const u = x / Math.max(1, state.width - 1) - 0.5;
      const v = y / Math.max(1, state.height - 1) - 0.5;
      const r = Math.max(0.04, Math.hypot(u, v));
      const sheath = Math.exp(-Math.abs(r - 0.28) * 9);
      const density = Math.max(0, state.plasmaDensity[cell]);
      const speed = Math.hypot(state.velocityX[cell], state.velocityY[cell]);
      const b2 = state.magneticX[cell] * state.magneticX[cell]
        + state.magneticY[cell] * state.magneticY[cell]
        + state.magneticZ[cell] * state.magneticZ[cell];
      totalMass += density;
      meanTemperatureK += state.temperatureK[cell];
      meanIonizationFraction += state.ionizationFraction[cell];
      magneticEnergy += 0.5 * b2;
      kineticEnergy += 0.5 * density * speed * speed;
      thermalEnergy += density * state.temperatureK[cell] * 0.012;
      currentSheetIntensity += Math.abs(state.currentDensity[cell]);
      divergenceBProxy += divergenceForCell(state, x, y);
      maxSpeed = Math.max(maxSpeed, speed);
      maxCurrentDensity = Math.max(maxCurrentDensity, Math.abs(state.currentDensity[cell]));
      sheathDensity += density * sheath;
      sheathWeight += sheath;
    }
  }

  const meanDensity = totalMass / Math.max(1, cellCount);
  meanTemperatureK /= Math.max(1, cellCount);
  meanIonizationFraction /= Math.max(1, cellCount);
  currentSheetIntensity /= Math.max(1, cellCount);
  divergenceBProxy /= Math.max(1, cellCount);
  const meanSheathDensity = sheathDensity / Math.max(1e-9, sheathWeight);
  const alfvenSpeed = Math.sqrt((2 * magneticEnergy) / Math.max(1e-6, totalMass));
  const solarWindPressure = meanSheathDensity * maxSpeed * maxSpeed + meanTemperatureK * meanDensity * 0.00008;
  const magnetopauseRadius = clamp(10 / Math.pow(1 + solarWindPressure * 0.08, 1 / 6), 2.4, 10);
  const reconnectionRate = clamp(currentSheetIntensity * meanIonizationFraction * 0.12 + divergenceBProxy * 0.04, 0, 4);

  return {
    schema: 'peercompute.multiscale.magnetosphere-plasma.diagnostics.v0',
    width: state.width,
    height: state.height,
    cellCount,
    totalMass,
    meanDensity,
    meanTemperatureK,
    meanIonizationFraction,
    magneticEnergy,
    kineticEnergy,
    thermalEnergy,
    plasmaEnergy: kineticEnergy + thermalEnergy,
    currentSheetIntensity,
    maxCurrentDensity,
    divergenceBProxy,
    alfvenSpeed,
    maxSpeed,
    solarWindPressure,
    magnetopauseRadius,
    reconnectionRate
  };
}

class MagnetosphereWebGpuRuntime {
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
    if (!gpu) throw new Error('WebGPU unavailable for magnetosphere-plasma worker');
    const usage = globalThis.GPUBufferUsage;
    if (!usage) throw new Error('GPUBufferUsage unavailable for magnetosphere-plasma worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for magnetosphere-plasma worker');
    this.device = await adapter.requestDevice();
    this.width = width;
    this.height = height;

    const cellBytes = width * height * CELL_FLOATS * Float32Array.BYTES_PER_ELEMENT;
    this.currentBuffer = this.device.createBuffer({ size: cellBytes, usage: usage.STORAGE | usage.COPY_DST });
    this.nextBuffer = this.device.createBuffer({ size: cellBytes, usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST });
    this.readBuffer = this.device.createBuffer({ size: cellBytes, usage: usage.COPY_DST | usage.MAP_READ });
    this.paramBuffer = this.device.createBuffer({ size: PARAM_BYTES, usage: usage.UNIFORM | usage.COPY_DST });

    this.device.pushErrorScope?.('validation');
    this.pipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: this.device.createShaderModule({ code: MAGNETOSPHERE_SHADER }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`Magnetosphere plasma WebGPU validation: ${validationError.message || validationError}`);
    }
    this.device.lost?.then((info) => {
      this.lastError = info?.message || info?.reason || 'Magnetosphere plasma WebGPU device lost';
      gpuDisabledReasons.set(this.stateKey, this.lastError);
    });
  }

  async step(state, options) {
    await this.initialize(state.width, state.height);
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for magnetosphere-plasma worker');
    const cellData = cellDataFromState(state);
    const params = new Float32Array([
      state.width,
      state.height,
      options.dt,
      options.stellarFlux,
      options.luminosityFactor,
      options.radiationPressure,
      options.maxwellFieldEnergy,
      options.poyntingX,
      options.poyntingY,
      options.magneticSeed,
      options.gravityMps2,
      options.ambientPressurePa
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
      backend: 'webgpu-magnetosphere-plasma',
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
  const poyntingFlux = Array.isArray(coupling.poyntingFlux) ? coupling.poyntingFlux : [0, 0, 0];
  return {
    dt: normalizeNumber(input.dt, 1 / 80, 0, 0.2),
    stellarFlux: normalizeNumber(environment.stellarFlux ?? input.stellarFlux, 1, 0.1, 5),
    luminosityFactor: couplingValue(coupling, 'stellarLuminosityFactor', 1, 0.05, 4),
    radiationPressure: couplingValue(coupling, 'radiationPressure', 1, 0, 5),
    maxwellFieldEnergy: couplingValue(coupling, 'maxwellFieldEnergy', 0, 0, 8),
    poyntingX: normalizeNumber(poyntingFlux[0], 0, -4, 4),
    poyntingY: normalizeNumber(poyntingFlux[1], 0, -4, 4),
    magneticSeed: couplingValue(coupling, 'magneticSeed', 0.2, -4, 4),
    gravityMps2: normalizeNumber(environment.gravityMps2 ?? input.gravityMps2, 9.8, 0, 80),
    ambientPressurePa: normalizeNumber(environment.ambientPressurePa ?? input.ambientPressurePa, 101325, 0, 10000000)
  };
}

function stepMagnetosphereCpu(state, options) {
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
      const r = Math.max(0.04, Math.hypot(u, v));
      const radialX = u / r;
      const radialY = v / r;
      const sheath = Math.exp(-Math.abs(r - 0.28) * 9);
      const density = clamp(state.plasmaDensity[cell], 0.001, 16);
      const temperatureK = clamp(state.temperatureK[cell], 80, 4800000);
      const ionization = clamp(state.ionizationFraction[cell], 0, 1);
      const current = currentForCell(state, x, y);
      const dPdx = (state.pressurePa[right] - state.pressurePa[left]) * 0.5;
      const dPdy = (state.pressurePa[up] - state.pressurePa[down]) * 0.5;
      const densityMix = (state.plasmaDensity[right] + state.plasmaDensity[left] + state.plasmaDensity[up] + state.plasmaDensity[down]) * 0.25;
      const tempMix = (state.temperatureK[right] + state.temperatureK[left] + state.temperatureK[up] + state.temperatureK[down]) * 0.25;

      let vx = state.velocityX[cell];
      let vy = state.velocityY[cell];
      vx += radialX * (options.stellarFlux * options.luminosityFactor + options.radiationPressure * 0.35) * (0.02 + sheath * 0.035);
      vy += radialY * (options.stellarFlux * options.luminosityFactor + options.radiationPressure * 0.35) * (0.02 + sheath * 0.035);
      vx += -state.magneticY[cell] * current * (0.006 + ionization * 0.026) + options.poyntingX * 0.018 - dPdx * 0.000014 / Math.max(0.08, density);
      vy += state.magneticX[cell] * current * (0.006 + ionization * 0.026) + options.poyntingY * 0.018 - dPdy * 0.000014 / Math.max(0.08, density);
      vx *= 0.988 - ionization * 0.006;
      vy *= 0.988 - ionization * 0.006;

      const maxwellHeat = options.maxwellFieldEnergy * (0.018 + current * 0.012);
      const stellarHeat = options.stellarFlux * options.luminosityFactor * (45 + sheath * 260);
      const ohmicHeat = current * current * (20 + ionization * 95);
      const cooling = Math.max(0, temperatureK - 4200) * (0.0025 + density * 0.00028);
      const nextTemp = clamp(temperatureK + (tempMix - temperatureK) * options.dt * 0.03 + options.dt * (stellarHeat + maxwellHeat + ohmicHeat - cooling), 80, 4800000);
      const nextDensity = clamp(density + (densityMix - density) * options.dt * 0.045 + sheath * options.stellarFlux * options.dt * 0.008 - Math.hypot(vx, vy) * options.dt * 0.002, 0.001, 16);
      const twist = (vx * radialY - vy * radialX) * 0.018 + options.magneticSeed * 0.004;
      const bx = state.magneticX[cell] + (state.magneticX[right] + state.magneticX[left] + state.magneticX[up] + state.magneticX[down] - state.magneticX[cell] * 4) * options.dt * 0.012 - vy * options.dt * 0.01;
      const by = state.magneticY[cell] + (state.magneticY[right] + state.magneticY[left] + state.magneticY[up] + state.magneticY[down] - state.magneticY[cell] * 4) * options.dt * 0.012 + vx * options.dt * 0.01;
      const bz = state.magneticZ[cell] + twist + (options.maxwellFieldEnergy * 0.006 + current * 0.004 - state.magneticZ[cell] * 0.018) * options.dt;
      const ionTarget = clamp((nextTemp - 2400) / 140000 + options.radiationPressure * 0.04 + current * 0.02, 0, 1);
      const nextIon = clamp(ionization + (ionTarget - ionization) * options.dt * 0.12, 0, 1);
      const pressurePa = pressureForCell({
        density: nextDensity,
        temperatureK: nextTemp,
        ionization: nextIon,
        ambientPressurePa: options.ambientPressurePa
      });

      next.plasmaDensity[cell] = nextDensity;
      next.temperatureK[cell] = nextTemp;
      next.velocityX[cell] = vx;
      next.velocityY[cell] = vy;
      next.magneticX[cell] = bx;
      next.magneticY[cell] = by;
      next.magneticZ[cell] = bz;
      next.ionizationFraction[cell] = nextIon;
      next.currentDensity[cell] = current;
      next.pressurePa[cell] = pressurePa;
      next.energyDensity[cell] = nextDensity * nextTemp * 0.012 + 0.5 * (vx * vx + vy * vy) * nextDensity + 0.5 * (bx * bx + by * by + bz * bz);
    }
  }
  next.elapsedTime += options.dt;
  return next;
}

async function advanceState(state, { stateKey, input, options }) {
  const cellCount = state.width * state.height;
  const wantsWebGpu = input.enableWebGPU !== false && input.webgpu !== false;
  const webGpuEligible = wantsWebGpu
    && cellCount <= normalizeInteger(input.webgpuMaxCells, MAGNETOSPHERE_PLASMA_WEBGPU_MAX_CELLS, 1, 1048576)
    && !gpuDisabledReasons.has(stateKey);

  if (webGpuEligible) {
    try {
      let runtime = gpuRuntimes.get(stateKey);
      if (!runtime) {
        runtime = new MagnetosphereWebGpuRuntime(stateKey);
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

  const next = stepMagnetosphereCpu(state, options);
  Object.assign(state, next);
  return {
    backend: 'cpu-magnetosphere-plasma',
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

function createConservation(before, after) {
  const massDrift = (after.totalMass - before.totalMass) / Math.max(1e-9, before.totalMass);
  return {
    massDrift,
    magneticEnergyDelta: after.magneticEnergy - before.magneticEnergy,
    plasmaEnergyDelta: after.plasmaEnergy - before.plasmaEnergy,
    divergenceBProxy: after.divergenceBProxy,
    energyMode: 'reduced-ideal-mhd-plasma'
  };
}

function createDeltaPayload({ payload, input, stateKey, state, diagnostics, conservation, backend, webgpuStatus, webgpuError }) {
  return {
    schema: payload.solver?.warmDelta?.schema || MAGNETOSPHERE_PLASMA_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'magnetosphere-plasma',
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
      plasmaDensity: input.plasmaDensityUnit || 'reduced kg/m^3',
      temperature: 'K',
      velocity: 'reduced m/s',
      magneticField: 'reduced T',
      pressure: 'reduced Pa',
      time: input.timeUnit || 's'
    }
  };
}

export function resetMagnetospherePlasma(input = {}) {
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
    schema: MAGNETOSPHERE_PLASMA_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

export async function stepMagnetospherePlasma(payload = {}) {
  const resolved = resolveInput(payload);
  const { input, stateKey } = resolved;
  const requestedReset = input.reset === true;
  const state = input.state || requestedReset || !states.has(stateKey)
    ? normalizeState(input.state || makeMagnetospherePlasmaInitialState(input))
    : cloneState(states.get(stateKey));
  const beforeDiagnostics = computeMagnetosphereDiagnostics(state);
  const options = resolveStepOptions(input);
  const advanceResult = await advanceState(state, { stateKey, input, options });
  state.sequence += 1;
  states.set(stateKey, cloneState(state));
  const diagnostics = computeMagnetosphereDiagnostics(state);
  const conservation = createConservation(beforeDiagnostics, diagnostics);
  const value = {
    ok: true,
    schema: MAGNETOSPHERE_PLASMA_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'magnetosphere-plasma',
    stateKey,
    backend: advanceResult.backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    state: cloneState(state),
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
        state: cloneState(state),
        diagnostics,
        conservation,
        backend: advanceResult.backend,
        webgpuStatus: advanceResult.webgpuStatus,
        webgpuError: advanceResult.webgpuError
      })
    }
  };
}
