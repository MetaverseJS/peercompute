export const PIC_PLASMA_PATCH_STATE_SCHEMA = 'peercompute.multiscale.pic-plasma-patch.state.v0';
export const PIC_PLASMA_PATCH_RESULT_SCHEMA = 'peercompute.multiscale.pic-plasma-patch.result.v0';
export const PIC_PLASMA_PATCH_DELTA_SCHEMA = 'peercompute.multiscale.pic-plasma-patch.delta.v0';
export const PIC_PLASMA_PATCH_WEBGPU_MAX_PARTICLES = 4096;
export const PIC_PLASMA_PATCH_WEBGPU_MAX_CELLS = 4096;

const DEFAULT_STATE_KEY = 'multiscale:pic-plasma-patch:default';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const PARTICLE_FLOATS = 8;
const FIELD_FLOATS = 8;
const PARAM_FLOATS = 12;
const PARAM_BYTES = PARAM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const WORKGROUP_SIZE = 64;
const states = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const PIC_SHADER = `
struct Particle {
  position: vec4f,
  properties: vec4f,
};

struct FieldCell {
  field: vec4f,
  plasma: vec4f,
};

struct Params {
  particleCount: f32,
  gridWidth: f32,
  gridHeight: f32,
  dt: f32,
  reconnectionRate: f32,
  solarWindPressure: f32,
  ionization: f32,
  alfvenSpeed: f32,
  maxwellFieldEnergy: f32,
  poyntingX: f32,
  poyntingY: f32,
  temperatureDrive: f32,
};

@group(0) @binding(0) var<storage, read> currentParticles: array<Particle>;
@group(0) @binding(1) var<storage, read_write> nextParticles: array<Particle>;
@group(0) @binding(2) var<storage, read> fieldCells: array<FieldCell>;
@group(0) @binding(3) var<uniform> params: Params;

fn field_index(x: u32, y: u32, width: u32) -> u32 {
  return y * width + x;
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let index = gid.x;
  if (index >= u32(params.particleCount)) {
    return;
  }

  let gridWidth = u32(params.gridWidth);
  let gridHeight = u32(params.gridHeight);
  let p = currentParticles[index];
  var x = p.position.x;
  var y = p.position.y;
  var vx = p.position.z;
  var vy = p.position.w;
  let charge = p.properties.x;
  let mass = max(0.05, p.properties.y);
  let species = p.properties.z;
  var escaped = p.properties.w;

  let gx = clamp(u32(floor((x * 0.5 + 0.5) * f32(gridWidth))), 0u, gridWidth - 1u);
  let gy = clamp(u32(floor((y * 0.5 + 0.5) * f32(gridHeight))), 0u, gridHeight - 1u);
  let cell = fieldCells[field_index(gx, gy, gridWidth)];
  let electric = vec2f(cell.field.x, cell.field.y);
  let magneticZ = cell.field.z + params.maxwellFieldEnergy * 0.015;

  let sheet = exp(-abs(y) * 5.5);
  let reconnectionKick = vec2f(sign(charge) * params.reconnectionRate * sheet * 0.08, -y * params.reconnectionRate * 0.035);
  let wind = vec2f(params.solarWindPressure * 0.006 + params.alfvenSpeed * 0.01, 0.0);
  let poynting = vec2f(params.poyntingX, params.poyntingY) * 0.015;
  let thermalJitter = sin((f32(index) + params.temperatureDrive) * 12.9898) * params.temperatureDrive * 0.000018;

  let qm = charge / mass;
  let ax = qm * (electric.x + vy * magneticZ) + reconnectionKick.x + wind.x + poynting.x + thermalJitter;
  let ay = qm * (electric.y - vx * magneticZ) + reconnectionKick.y + wind.y + poynting.y - thermalJitter;
  let damping = 0.998 - clamp(params.ionization, 0.0, 1.0) * 0.006;
  vx = (vx + ax * params.dt) * damping;
  vy = (vy + ay * params.dt) * damping;
  x = x + vx * params.dt;
  y = y + vy * params.dt;

  if (x > 1.0) {
    x = -1.0 + fract(x);
    escaped = escaped + 1.0;
  }
  if (x < -1.0) {
    x = 1.0 - fract(abs(x));
    escaped = escaped + 1.0;
  }
  if (y > 1.0) {
    y = 1.0 - fract(y);
    vy = -abs(vy) * 0.45;
    escaped = escaped + 0.5;
  }
  if (y < -1.0) {
    y = -1.0 + fract(abs(y));
    vy = abs(vy) * 0.45;
    escaped = escaped + 0.5;
  }

  nextParticles[index].position = vec4f(x, y, vx, vy);
  nextParticles[index].properties = vec4f(charge, mass, species, escaped);
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

function wrapCell(value, max) {
  return (value + max) % max;
}

function fieldIndex(x, y, width) {
  return y * width + x;
}

function makeEmptyField(cellCount) {
  return {
    electricX: new Array(cellCount).fill(0),
    electricY: new Array(cellCount).fill(0),
    magneticZ: new Array(cellCount).fill(0),
    chargeDensity: new Array(cellCount).fill(0),
    currentX: new Array(cellCount).fill(0),
    currentY: new Array(cellCount).fill(0),
    particleDensity: new Array(cellCount).fill(0),
    fieldEnergy: new Array(cellCount).fill(0)
  };
}

export function makePicPlasmaPatchInitialState({
  particleCount = 160,
  count = particleCount,
  gridWidth = 18,
  gridHeight = Math.max(4, Math.round(gridWidth / 2)),
  seed = 20260529,
  environment = {},
  coupling = {}
} = {}) {
  const safeCount = normalizeInteger(count, 160, 4, 8192);
  const safeWidth = normalizeInteger(gridWidth, 18, 4, 128);
  const safeHeight = normalizeInteger(gridHeight, Math.max(4, Math.round(safeWidth / 2)), 4, 128);
  const cellCount = safeWidth * safeHeight;
  const rng = createRng(seed);
  const reconnectionRate = couplingValue(coupling, 'reconnectionRate', 0.05, 0, 8);
  const solarWindPressure = couplingValue(coupling, 'solarWindPressure', 1, 0, 40);
  const ionization = couplingValue(coupling, 'ionization', couplingValue(coupling, 'meanIonizationFraction', 0.18, 0, 1), 0, 1);
  const alfvenSpeed = couplingValue(coupling, 'alfvenSpeed', 0.4, 0, 20);
  const ambientTemperatureK = normalizeNumber(environment.ambientTemperatureK, 294, 0, 100000000);
  const temperatureDrive = Math.max(0, ambientTemperatureK + couplingValue(coupling, 'meanTemperatureK', 5000, 0, 10000000));

  const positionsX = new Array(safeCount);
  const positionsY = new Array(safeCount);
  const velocitiesX = new Array(safeCount);
  const velocitiesY = new Array(safeCount);
  const charges = new Array(safeCount);
  const masses = new Array(safeCount);
  const species = new Array(safeCount);
  const escaped = new Array(safeCount).fill(0);
  for (let i = 0; i < safeCount; i += 1) {
    const electron = i % 2 === 0;
    const sheet = (rng() - 0.5) * (0.18 + reconnectionRate * 0.02);
    positionsX[i] = (rng() - 0.5) * 1.65;
    positionsY[i] = clamp(sheet + Math.sin(i * 2.399) * 0.06, -0.92, 0.92);
    velocitiesX[i] = 0.08 + solarWindPressure * 0.01 + alfvenSpeed * 0.035 + (rng() - 0.5) * 0.05;
    velocitiesY[i] = (electron ? -1 : 1) * reconnectionRate * 0.02 + (rng() - 0.5) * 0.07;
    charges[i] = electron ? -1 : 1;
    masses[i] = electron ? 0.18 : 1;
    species[i] = electron ? -1 : 1;
  }

  const field = makeEmptyField(cellCount);
  for (let y = 0; y < safeHeight; y += 1) {
    for (let x = 0; x < safeWidth; x += 1) {
      const cell = fieldIndex(x, y, safeWidth);
      const u = x / Math.max(1, safeWidth - 1) - 0.5;
      const v = y / Math.max(1, safeHeight - 1) - 0.5;
      const sheet = Math.exp(-Math.abs(v) * 5.5);
      const fieldScale = 0.04 + reconnectionRate * 0.05 + ionization * 0.08;
      field.electricX[cell] = fieldScale * sheet + solarWindPressure * 0.0006;
      field.electricY[cell] = -v * fieldScale * 0.8;
      field.magneticZ[cell] = (u >= 0 ? 1 : -1) * (0.16 + alfvenSpeed * 0.08 + sheet * 0.12);
      field.fieldEnergy[cell] = 0.5 * (field.electricX[cell] ** 2 + field.electricY[cell] ** 2 + field.magneticZ[cell] ** 2);
    }
  }

  const state = {
    schema: PIC_PLASMA_PATCH_STATE_SCHEMA,
    sequence: 0,
    elapsedTime: 0,
    particleCount: safeCount,
    gridWidth: safeWidth,
    gridHeight: safeHeight,
    positionsX,
    positionsY,
    velocitiesX,
    velocitiesY,
    charges,
    masses,
    species,
    escaped,
    ...field
  };
  depositParticlesToGrid(state, { smoothing: 0.45, fieldRelaxation: 0.25, temperatureDrive });
  return state;
}

function normalizeState(input = {}) {
  const source = input.state || input;
  if (!source.positionsX || !source.charges) return makePicPlasmaPatchInitialState(input);
  const particleCount = normalizeInteger(source.particleCount ?? source.positionsX?.length, 160, 4, 8192);
  const gridWidth = normalizeInteger(source.gridWidth, 18, 4, 128);
  const gridHeight = normalizeInteger(source.gridHeight, Math.max(4, Math.round(gridWidth / 2)), 4, 128);
  const cellCount = gridWidth * gridHeight;
  return {
    schema: PIC_PLASMA_PATCH_STATE_SCHEMA,
    sequence: normalizeInteger(source.sequence, 0, 0),
    elapsedTime: normalizeNumber(source.elapsedTime, 0, 0),
    particleCount,
    gridWidth,
    gridHeight,
    positionsX: toFiniteArray(source.positionsX, particleCount, 'positionsX'),
    positionsY: toFiniteArray(source.positionsY, particleCount, 'positionsY'),
    velocitiesX: toFiniteArray(source.velocitiesX, particleCount, 'velocitiesX'),
    velocitiesY: toFiniteArray(source.velocitiesY, particleCount, 'velocitiesY'),
    charges: toFiniteArray(source.charges, particleCount, 'charges'),
    masses: toFiniteArray(source.masses, particleCount, 'masses', 1),
    species: toFiniteArray(source.species, particleCount, 'species'),
    escaped: toFiniteArray(source.escaped, particleCount, 'escaped'),
    electricX: toFiniteArray(source.electricX, cellCount, 'electricX'),
    electricY: toFiniteArray(source.electricY, cellCount, 'electricY'),
    magneticZ: toFiniteArray(source.magneticZ, cellCount, 'magneticZ'),
    chargeDensity: toFiniteArray(source.chargeDensity, cellCount, 'chargeDensity'),
    currentX: toFiniteArray(source.currentX, cellCount, 'currentX'),
    currentY: toFiniteArray(source.currentY, cellCount, 'currentY'),
    particleDensity: toFiniteArray(source.particleDensity, cellCount, 'particleDensity'),
    fieldEnergy: toFiniteArray(source.fieldEnergy, cellCount, 'fieldEnergy')
  };
}

function cloneState(state) {
  return {
    schema: PIC_PLASMA_PATCH_STATE_SCHEMA,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    particleCount: state.particleCount,
    gridWidth: state.gridWidth,
    gridHeight: state.gridHeight,
    positionsX: [...state.positionsX],
    positionsY: [...state.positionsY],
    velocitiesX: [...state.velocitiesX],
    velocitiesY: [...state.velocitiesY],
    charges: [...state.charges],
    masses: [...state.masses],
    species: [...state.species],
    escaped: [...state.escaped],
    electricX: [...state.electricX],
    electricY: [...state.electricY],
    magneticZ: [...state.magneticZ],
    chargeDensity: [...state.chargeDensity],
    currentX: [...state.currentX],
    currentY: [...state.currentY],
    particleDensity: [...state.particleDensity],
    fieldEnergy: [...state.fieldEnergy]
  };
}

function particleDataFromState(state) {
  const data = new Float32Array(state.particleCount * PARTICLE_FLOATS);
  for (let i = 0; i < state.particleCount; i += 1) {
    const dst = i * PARTICLE_FLOATS;
    data[dst] = state.positionsX[i];
    data[dst + 1] = state.positionsY[i];
    data[dst + 2] = state.velocitiesX[i];
    data[dst + 3] = state.velocitiesY[i];
    data[dst + 4] = state.charges[i];
    data[dst + 5] = state.masses[i];
    data[dst + 6] = state.species[i];
    data[dst + 7] = state.escaped[i];
  }
  return data;
}

function applyParticleDataToState(state, data) {
  for (let i = 0; i < state.particleCount; i += 1) {
    const src = i * PARTICLE_FLOATS;
    state.positionsX[i] = data[src];
    state.positionsY[i] = data[src + 1];
    state.velocitiesX[i] = data[src + 2];
    state.velocitiesY[i] = data[src + 3];
    state.charges[i] = data[src + 4];
    state.masses[i] = data[src + 5];
    state.species[i] = data[src + 6];
    state.escaped[i] = data[src + 7];
  }
}

function fieldDataFromState(state) {
  const cellCount = state.gridWidth * state.gridHeight;
  const data = new Float32Array(cellCount * FIELD_FLOATS);
  for (let i = 0; i < cellCount; i += 1) {
    const dst = i * FIELD_FLOATS;
    data[dst] = state.electricX[i];
    data[dst + 1] = state.electricY[i];
    data[dst + 2] = state.magneticZ[i];
    data[dst + 3] = state.chargeDensity[i];
    data[dst + 4] = state.currentX[i];
    data[dst + 5] = state.currentY[i];
    data[dst + 6] = state.particleDensity[i];
    data[dst + 7] = state.fieldEnergy[i];
  }
  return data;
}

function resolveStepOptions(input = {}) {
  const environment = input.environment || {};
  const coupling = input.coupling || {};
  const poyntingFlux = Array.isArray(coupling.poyntingFlux) ? coupling.poyntingFlux : [0, 0, 0];
  const meanTemperatureK = couplingValue(coupling, 'meanTemperatureK', 5200, 0, 10000000);
  return {
    dt: normalizeNumber(input.dt, 1 / 140, 0, 0.2),
    reconnectionRate: couplingValue(coupling, 'reconnectionRate', 0.04, 0, 8),
    solarWindPressure: couplingValue(coupling, 'solarWindPressure', 1, 0, 40),
    ionization: couplingValue(coupling, 'ionization', couplingValue(coupling, 'meanIonizationFraction', 0.2, 0, 1), 0, 1),
    alfvenSpeed: couplingValue(coupling, 'alfvenSpeed', 0.4, 0, 20),
    maxwellFieldEnergy: couplingValue(coupling, 'maxwellFieldEnergy', 0, 0, 8),
    poyntingX: normalizeNumber(poyntingFlux[0], 0, -4, 4),
    poyntingY: normalizeNumber(poyntingFlux[1], 0, -4, 4),
    temperatureDrive: normalizeNumber(environment.ambientTemperatureK, 294, 0, 100000000) + meanTemperatureK,
    fieldRelaxation: normalizeNumber(input.fieldRelaxation, 0.24, 0, 1),
    smoothing: normalizeNumber(input.smoothing, 0.4, 0, 1)
  };
}

function depositParticlesToGrid(state, options = {}) {
  const cellCount = state.gridWidth * state.gridHeight;
  state.chargeDensity.fill(0);
  state.currentX.fill(0);
  state.currentY.fill(0);
  state.particleDensity.fill(0);

  for (let i = 0; i < state.particleCount; i += 1) {
    const gx = clamp(Math.floor((state.positionsX[i] * 0.5 + 0.5) * state.gridWidth), 0, state.gridWidth - 1);
    const gy = clamp(Math.floor((state.positionsY[i] * 0.5 + 0.5) * state.gridHeight), 0, state.gridHeight - 1);
    const cell = fieldIndex(gx, gy, state.gridWidth);
    state.chargeDensity[cell] += state.charges[i];
    state.currentX[cell] += state.charges[i] * state.velocitiesX[i];
    state.currentY[cell] += state.charges[i] * state.velocitiesY[i];
    state.particleDensity[cell] += 1;
  }

  const fieldRelaxation = normalizeNumber(options.fieldRelaxation, 0.24, 0, 1);
  const smoothing = normalizeNumber(options.smoothing, 0.4, 0, 1);
  const reconnectionDrive = normalizeNumber(options.reconnectionRate, 0.04, 0, 8);
  const windDrive = normalizeNumber(options.solarWindPressure, 1, 0, 40);
  const temperatureDrive = normalizeNumber(options.temperatureDrive, 5200, 0, 10000000);

  const nextEx = new Array(cellCount);
  const nextEy = new Array(cellCount);
  const nextBz = new Array(cellCount);
  for (let y = 0; y < state.gridHeight; y += 1) {
    for (let x = 0; x < state.gridWidth; x += 1) {
      const cell = fieldIndex(x, y, state.gridWidth);
      const right = fieldIndex(wrapCell(x + 1, state.gridWidth), y, state.gridWidth);
      const left = fieldIndex(wrapCell(x - 1, state.gridWidth), y, state.gridWidth);
      const up = fieldIndex(x, wrapCell(y + 1, state.gridHeight), state.gridWidth);
      const down = fieldIndex(x, wrapCell(y - 1, state.gridHeight), state.gridWidth);
      const density = Math.max(1, state.particleDensity[cell]);
      const charge = state.chargeDensity[cell] / density;
      const currentX = state.currentX[cell] / density;
      const currentY = state.currentY[cell] / density;
      const sheetY = y / Math.max(1, state.gridHeight - 1) - 0.5;
      const sheet = Math.exp(-Math.abs(sheetY) * 5.5);
      const exTarget = charge * 0.045 + currentX * 0.02 + windDrive * 0.00055 + sheet * reconnectionDrive * 0.025;
      const eyTarget = -sheetY * reconnectionDrive * 0.035 + charge * 0.018 + currentY * 0.02;
      const bzTarget = state.magneticZ[cell] * 0.985
        + (state.currentX[up] - state.currentX[down] - state.currentY[right] + state.currentY[left]) * 0.0008
        + sheet * Math.sqrt(Math.max(0, temperatureDrive)) * 0.000004;
      nextEx[cell] = state.electricX[cell] * (1 - fieldRelaxation) + exTarget * fieldRelaxation;
      nextEy[cell] = state.electricY[cell] * (1 - fieldRelaxation) + eyTarget * fieldRelaxation;
      nextBz[cell] = state.magneticZ[cell] * (1 - fieldRelaxation * 0.45) + bzTarget * fieldRelaxation * 0.45;
      if (smoothing > 0) {
        nextEx[cell] = nextEx[cell] * (1 - smoothing * 0.18)
          + (state.electricX[right] + state.electricX[left] + state.electricX[up] + state.electricX[down]) * smoothing * 0.045;
        nextEy[cell] = nextEy[cell] * (1 - smoothing * 0.18)
          + (state.electricY[right] + state.electricY[left] + state.electricY[up] + state.electricY[down]) * smoothing * 0.045;
        nextBz[cell] = nextBz[cell] * (1 - smoothing * 0.12)
          + (state.magneticZ[right] + state.magneticZ[left] + state.magneticZ[up] + state.magneticZ[down]) * smoothing * 0.03;
      }
    }
  }

  for (let i = 0; i < cellCount; i += 1) {
    state.electricX[i] = nextEx[i];
    state.electricY[i] = nextEy[i];
    state.magneticZ[i] = nextBz[i];
    state.fieldEnergy[i] = 0.5 * (nextEx[i] ** 2 + nextEy[i] ** 2 + nextBz[i] ** 2);
  }
}

export function computePicPlasmaDiagnostics(input = {}) {
  const state = normalizeState(input);
  let totalCharge = 0;
  let electronCount = 0;
  let ionCount = 0;
  let kineticEnergy = 0;
  let maxParticleSpeed = 0;
  let meanAbsYByCharge = 0;
  let escapedParticles = 0;
  let totalMass = 0;
  for (let i = 0; i < state.particleCount; i += 1) {
    const speed = Math.hypot(state.velocitiesX[i], state.velocitiesY[i]);
    const mass = Math.max(0.05, state.masses[i]);
    const charge = state.charges[i];
    totalCharge += charge;
    totalMass += mass;
    kineticEnergy += 0.5 * mass * speed * speed;
    maxParticleSpeed = Math.max(maxParticleSpeed, speed);
    meanAbsYByCharge += Math.abs(state.positionsY[i]) * Math.sign(charge);
    escapedParticles += Math.max(0, state.escaped[i]);
    if (charge < 0) electronCount += 1;
    if (charge > 0) ionCount += 1;
  }

  let fieldEnergy = 0;
  let currentDensity = 0;
  let chargeDensityAbs = 0;
  let divergenceEProxy = 0;
  for (let y = 0; y < state.gridHeight; y += 1) {
    for (let x = 0; x < state.gridWidth; x += 1) {
      const cell = fieldIndex(x, y, state.gridWidth);
      const right = fieldIndex(wrapCell(x + 1, state.gridWidth), y, state.gridWidth);
      const left = fieldIndex(wrapCell(x - 1, state.gridWidth), y, state.gridWidth);
      const up = fieldIndex(x, wrapCell(y + 1, state.gridHeight), state.gridWidth);
      const down = fieldIndex(x, wrapCell(y - 1, state.gridHeight), state.gridWidth);
      fieldEnergy += state.fieldEnergy[cell];
      currentDensity += Math.hypot(state.currentX[cell], state.currentY[cell]);
      chargeDensityAbs += Math.abs(state.chargeDensity[cell]);
      divergenceEProxy += Math.abs((state.electricX[right] - state.electricX[left]) * 0.5 + (state.electricY[up] - state.electricY[down]) * 0.5 - state.chargeDensity[cell] * 0.02);
    }
  }

  const cellCount = state.gridWidth * state.gridHeight;
  const chargeImbalance = totalCharge / Math.max(1, state.particleCount);
  const chargeSeparation = Math.abs(meanAbsYByCharge) / Math.max(1, state.particleCount);
  const meanKineticEnergy = kineticEnergy / Math.max(1, state.particleCount);
  const meanFieldEnergy = fieldEnergy / Math.max(1, cellCount);
  const meanCurrentDensity = currentDensity / Math.max(1, cellCount);
  const meanChargeDensity = chargeDensityAbs / Math.max(1, cellCount);
  const debyeLengthProxy = Math.sqrt(Math.max(1e-6, meanKineticEnergy + meanFieldEnergy) / Math.max(1e-6, meanChargeDensity + 1));
  const larmorRadiusProxy = maxParticleSpeed / Math.max(1e-6, Math.sqrt(Math.max(1e-6, meanFieldEnergy)));
  const reconnectionHeating = meanCurrentDensity * meanFieldEnergy * 0.45;

  return {
    schema: 'peercompute.multiscale.pic-plasma-patch.diagnostics.v0',
    particleCount: state.particleCount,
    gridWidth: state.gridWidth,
    gridHeight: state.gridHeight,
    cellCount,
    electronCount,
    ionCount,
    totalMass,
    totalCharge,
    chargeImbalance,
    kineticEnergy,
    meanKineticEnergy,
    fieldEnergy,
    meanFieldEnergy,
    maxParticleSpeed,
    currentDensity: meanCurrentDensity,
    meanChargeDensity,
    chargeSeparation,
    escapedParticles,
    particleEscapeFraction: escapedParticles / Math.max(1, state.particleCount),
    debyeLengthProxy,
    larmorRadiusProxy,
    reconnectionHeating,
    divergenceEProxy: divergenceEProxy / Math.max(1, cellCount)
  };
}

class PicPlasmaWebGpuRuntime {
  constructor(stateKey) {
    this.stateKey = stateKey;
    this.device = null;
    this.pipeline = null;
    this.currentParticleBuffer = null;
    this.nextParticleBuffer = null;
    this.readParticleBuffer = null;
    this.fieldBuffer = null;
    this.paramBuffer = null;
    this.particleCount = 0;
    this.cellCount = 0;
    this.submittedSteps = 0;
    this.lastError = null;
  }

  async initialize(particleCount, cellCount) {
    if (this.device && this.particleCount === particleCount && this.cellCount === cellCount) return;
    const gpu = globalThis.navigator?.gpu;
    if (!gpu) throw new Error('WebGPU unavailable for pic-plasma-patch worker');
    const usage = globalThis.GPUBufferUsage;
    if (!usage) throw new Error('GPUBufferUsage unavailable for pic-plasma-patch worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for pic-plasma-patch worker');
    this.device = await adapter.requestDevice();
    this.particleCount = particleCount;
    this.cellCount = cellCount;
    const particleBytes = particleCount * PARTICLE_FLOATS * Float32Array.BYTES_PER_ELEMENT;
    const fieldBytes = cellCount * FIELD_FLOATS * Float32Array.BYTES_PER_ELEMENT;
    this.currentParticleBuffer = this.device.createBuffer({ size: particleBytes, usage: usage.STORAGE | usage.COPY_DST });
    this.nextParticleBuffer = this.device.createBuffer({ size: particleBytes, usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST });
    this.readParticleBuffer = this.device.createBuffer({ size: particleBytes, usage: usage.COPY_DST | usage.MAP_READ });
    this.fieldBuffer = this.device.createBuffer({ size: fieldBytes, usage: usage.STORAGE | usage.COPY_DST });
    this.paramBuffer = this.device.createBuffer({ size: PARAM_BYTES, usage: usage.UNIFORM | usage.COPY_DST });

    this.device.pushErrorScope?.('validation');
    this.pipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: this.device.createShaderModule({ code: PIC_SHADER }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`PIC plasma WebGPU validation: ${validationError.message || validationError}`);
    }
    this.device.lost?.then((info) => {
      this.lastError = info?.message || info?.reason || 'PIC plasma WebGPU device lost';
      gpuDisabledReasons.set(this.stateKey, this.lastError);
    });
  }

  async step(state, options) {
    const cellCount = state.gridWidth * state.gridHeight;
    await this.initialize(state.particleCount, cellCount);
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for pic-plasma-patch worker');
    const particleData = particleDataFromState(state);
    const fieldData = fieldDataFromState(state);
    const params = new Float32Array([
      state.particleCount,
      state.gridWidth,
      state.gridHeight,
      options.dt,
      options.reconnectionRate,
      options.solarWindPressure,
      options.ionization,
      options.alfvenSpeed,
      options.maxwellFieldEnergy,
      options.poyntingX,
      options.poyntingY,
      options.temperatureDrive
    ]);
    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.currentParticleBuffer } },
        { binding: 1, resource: { buffer: this.nextParticleBuffer } },
        { binding: 2, resource: { buffer: this.fieldBuffer } },
        { binding: 3, resource: { buffer: this.paramBuffer } }
      ]
    });
    this.device.queue.writeBuffer(this.currentParticleBuffer, 0, particleData);
    this.device.queue.writeBuffer(this.fieldBuffer, 0, fieldData);
    this.device.queue.writeBuffer(this.paramBuffer, 0, params);
    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(Math.ceil(state.particleCount / WORKGROUP_SIZE));
    pass.end();
    encoder.copyBufferToBuffer(this.nextParticleBuffer, 0, this.readParticleBuffer, 0, particleData.byteLength);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone?.();
    await this.readParticleBuffer.mapAsync(mapMode.READ);
    const mapped = this.readParticleBuffer.getMappedRange();
    const result = new Float32Array(mapped).slice();
    this.readParticleBuffer.unmap();
    applyParticleDataToState(state, result);
    depositParticlesToGrid(state, options);
    state.elapsedTime += options.dt;
    this.submittedSteps += 1;
    return {
      backend: 'webgpu-pic-plasma-patch',
      webgpuStatus: {
        stateKey: this.stateKey,
        particleCount: state.particleCount,
        gridWidth: state.gridWidth,
        gridHeight: state.gridHeight,
        cellCount,
        submittedSteps: this.submittedSteps
      }
    };
  }
}

function stepPicCpu(state, options) {
  for (let i = 0; i < state.particleCount; i += 1) {
    const gx = clamp(Math.floor((state.positionsX[i] * 0.5 + 0.5) * state.gridWidth), 0, state.gridWidth - 1);
    const gy = clamp(Math.floor((state.positionsY[i] * 0.5 + 0.5) * state.gridHeight), 0, state.gridHeight - 1);
    const cell = fieldIndex(gx, gy, state.gridWidth);
    const charge = state.charges[i];
    const mass = Math.max(0.05, state.masses[i]);
    const qm = charge / mass;
    const sheet = Math.exp(-Math.abs(state.positionsY[i]) * 5.5);
    const reconnectionKickX = Math.sign(charge) * options.reconnectionRate * sheet * 0.08;
    const reconnectionKickY = -state.positionsY[i] * options.reconnectionRate * 0.035;
    const thermalJitter = Math.sin((i + options.temperatureDrive) * 12.9898) * options.temperatureDrive * 0.000018;
    const magneticZ = state.magneticZ[cell] + options.maxwellFieldEnergy * 0.015;
    const ax = qm * (state.electricX[cell] + state.velocitiesY[i] * magneticZ)
      + reconnectionKickX
      + options.solarWindPressure * 0.006
      + options.alfvenSpeed * 0.01
      + options.poyntingX * 0.015
      + thermalJitter;
    const ay = qm * (state.electricY[cell] - state.velocitiesX[i] * magneticZ)
      + reconnectionKickY
      + options.poyntingY * 0.015
      - thermalJitter;
    const damping = 0.998 - options.ionization * 0.006;
    state.velocitiesX[i] = (state.velocitiesX[i] + ax * options.dt) * damping;
    state.velocitiesY[i] = (state.velocitiesY[i] + ay * options.dt) * damping;
    state.positionsX[i] += state.velocitiesX[i] * options.dt;
    state.positionsY[i] += state.velocitiesY[i] * options.dt;

    if (state.positionsX[i] > 1) {
      state.positionsX[i] = -1 + (state.positionsX[i] % 1);
      state.escaped[i] += 1;
    }
    if (state.positionsX[i] < -1) {
      state.positionsX[i] = 1 - (Math.abs(state.positionsX[i]) % 1);
      state.escaped[i] += 1;
    }
    if (state.positionsY[i] > 1) {
      state.positionsY[i] = 1 - (state.positionsY[i] % 1);
      state.velocitiesY[i] = -Math.abs(state.velocitiesY[i]) * 0.45;
      state.escaped[i] += 0.5;
    }
    if (state.positionsY[i] < -1) {
      state.positionsY[i] = -1 + (Math.abs(state.positionsY[i]) % 1);
      state.velocitiesY[i] = Math.abs(state.velocitiesY[i]) * 0.45;
      state.escaped[i] += 0.5;
    }
  }
  depositParticlesToGrid(state, options);
  state.elapsedTime += options.dt;
  return state;
}

async function advanceState(state, { stateKey, input, options }) {
  const cellCount = state.gridWidth * state.gridHeight;
  const wantsWebGpu = input.enableWebGPU !== false && input.webgpu !== false;
  const webGpuEligible = wantsWebGpu
    && state.particleCount <= normalizeInteger(input.webgpuMaxParticles, PIC_PLASMA_PATCH_WEBGPU_MAX_PARTICLES, 1, 1048576)
    && cellCount <= normalizeInteger(input.webgpuMaxCells, PIC_PLASMA_PATCH_WEBGPU_MAX_CELLS, 1, 1048576)
    && !gpuDisabledReasons.has(stateKey);

  if (webGpuEligible) {
    try {
      let runtime = gpuRuntimes.get(stateKey);
      if (!runtime) {
        runtime = new PicPlasmaWebGpuRuntime(stateKey);
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

  stepPicCpu(state, options);
  return {
    backend: 'cpu-pic-plasma-patch',
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
  return {
    chargeDrift: after.totalCharge - before.totalCharge,
    chargeImbalance: after.chargeImbalance,
    kineticEnergyDelta: after.kineticEnergy - before.kineticEnergy,
    fieldEnergyDelta: after.fieldEnergy - before.fieldEnergy,
    escapedParticleDelta: after.escapedParticles - before.escapedParticles,
    divergenceEProxy: after.divergenceEProxy,
    energyMode: 'reduced-pic-plasma-patch'
  };
}

function createDeltaPayload({ payload, input, stateKey, state, diagnostics, conservation, backend, webgpuStatus, webgpuError }) {
  return {
    schema: payload.solver?.warmDelta?.schema || PIC_PLASMA_PATCH_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'pic-plasma-patch',
    stateKey,
    backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    particleCount: state.particleCount,
    gridWidth: state.gridWidth,
    gridHeight: state.gridHeight,
    cellCount: state.gridWidth * state.gridHeight,
    diagnostics,
    conservation,
    state,
    webgpuStatus,
    webgpuError,
    units: {
      position: input.positionUnit || 'reduced m',
      velocity: input.velocityUnit || 'reduced m/s',
      charge: input.chargeUnit || 'reduced C',
      electricField: 'reduced V/m',
      magneticField: 'reduced T',
      time: input.timeUnit || 's'
    }
  };
}

export function resetPicPlasmaPatch(input = {}) {
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
    schema: PIC_PLASMA_PATCH_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

export async function stepPicPlasmaPatch(payload = {}) {
  const resolved = resolveInput(payload);
  const { input, stateKey } = resolved;
  const requestedReset = input.reset === true;
  const state = input.state || requestedReset || !states.has(stateKey)
    ? normalizeState(input.state || makePicPlasmaPatchInitialState(input))
    : cloneState(states.get(stateKey));
  const beforeDiagnostics = computePicPlasmaDiagnostics(state);
  const options = resolveStepOptions(input);
  const advanceResult = await advanceState(state, { stateKey, input, options });
  state.sequence += 1;
  states.set(stateKey, cloneState(state));
  const diagnostics = computePicPlasmaDiagnostics(state);
  const conservation = createConservation(beforeDiagnostics, diagnostics);
  const value = {
    ok: true,
    schema: PIC_PLASMA_PATCH_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'pic-plasma-patch',
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
