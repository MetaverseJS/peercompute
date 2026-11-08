export const HYDRO_ATMOSPHERE_STATE_SCHEMA = 'peercompute.multiscale.hydro-atmosphere.state.v0';
export const HYDRO_ATMOSPHERE_RESULT_SCHEMA = 'peercompute.multiscale.hydro-atmosphere.result.v0';
export const HYDRO_ATMOSPHERE_DELTA_SCHEMA = 'peercompute.multiscale.hydro-atmosphere.delta.v0';
export const HYDRO_ATMOSPHERE_WEBGPU_MAX_CELLS = 16384;

const DEFAULT_STATE_KEY = 'multiscale:hydro-atmosphere:default';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const CELL_FLOATS = 8;
const WORKGROUP_SIZE = 64;
const PARAM_FLOATS = 8;
const PARAM_BYTES = PARAM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const states = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const HYDRO_SHADER = `
struct Cell {
  massMom: vec4f,
  moistTerrain: vec4f,
};

struct Params {
  width: f32,
  height: f32,
  dt: f32,
  stellarFlux: f32,
  gravity: f32,
  ambientTemperatureK: f32,
  oceanHeat: f32,
  damping: f32,
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
  var mass = cell.massMom.x;
  var mx = cell.massMom.y;
  var my = cell.massMom.z;
  var temperatureK = cell.massMom.w;
  var vapor = cell.moistTerrain.x;
  var cloud = cell.moistTerrain.y;
  var precip = cell.moistTerrain.z;
  let terrain = cell.moistTerrain.w;

  let pressureRight = right.massMom.x + right.massMom.w * 0.0032 - right.moistTerrain.w * 0.09;
  let pressureLeft = left.massMom.x + left.massMom.w * 0.0032 - left.moistTerrain.w * 0.09;
  let pressureUp = up.massMom.x + up.massMom.w * 0.0032 - up.moistTerrain.w * 0.09;
  let pressureDown = down.massMom.x + down.massMom.w * 0.0032 - down.moistTerrain.w * 0.09;
  let gradX = (pressureRight - pressureLeft) * 0.5;
  let gradY = (pressureUp - pressureDown) * 0.5;
  let coriolis = (f32(y) / max(1.0, params.height - 1.0) - 0.5) * 0.08;
  let oldMx = mx;
  let oldMy = my;

  mx = (mx - gradX * dt * 0.68 + oldMy * coriolis * dt) * params.damping;
  my = (my - gradY * dt * 0.68 - oldMx * coriolis * dt) * params.damping;
  mass = clamp(
    mass - ((right.massMom.y - left.massMom.y) + (up.massMom.z - down.massMom.z)) * dt * 0.035,
    0.35,
    2.2
  );

  let neighborTemperature = (right.massMom.w + left.massMom.w + up.massMom.w + down.massMom.w) * 0.25;
  let radiativeEquilibrium = params.ambientTemperatureK - 18.0 + params.stellarFlux * 42.0 + params.oceanHeat * 16.0 - terrain * 22.0;
  temperatureK = clamp(
    temperatureK
      + (radiativeEquilibrium - temperatureK) * dt * 0.035
      + (neighborTemperature - temperatureK) * dt * 0.03
      - cloud * dt * 1.6
      - precip * dt * 2.4,
    180.0,
    340.0
  );

  let saturation = clamp(0.11 + (temperatureK - 250.0) * 0.0032, 0.06, 0.42);
  let evaporation = max(0.0, params.oceanHeat + params.stellarFlux * 0.45 - terrain * 0.65) * dt * 0.0045;
  let condensation = max(0.0, vapor - saturation) * dt * 0.72;
  let precipRate = max(0.0, cloud - 0.18) * dt * 0.38;
  vapor = clamp(vapor + evaporation - condensation + precip * dt * 0.03, 0.0, 1.2);
  cloud = clamp(cloud + condensation - precipRate, 0.0, 1.2);
  precip = clamp(precip * 0.86 + precipRate * 4.8, 0.0, 1.4);

  nextCells[index].massMom = vec4f(mass, mx, my, temperatureK);
  nextCells[index].moistTerrain = vec4f(vapor, cloud, precip, terrain);
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

export function makeHydroAtmosphereInitialState({
  width = 20,
  height = 10,
  seed = 20260529,
  environment = {},
  oceanHeat = 0.51
} = {}) {
  const safeWidth = normalizeInteger(width, 20, 4, 128);
  const safeHeight = normalizeInteger(height, Math.max(4, Math.round(safeWidth / 2)), 4, 128);
  const cellCount = safeWidth * safeHeight;
  const rng = createRng(seed);
  const stellarFlux = normalizeNumber(environment.stellarFlux, 1, 0.1, 4);
  const ambientTemperatureK = normalizeNumber(environment.ambientTemperatureK, 294, 180, 360);
  const safeOceanHeat = clamp(normalizeNumber(oceanHeat, 0.51), 0, 1);
  const columnMass = new Array(cellCount);
  const momentumX = new Array(cellCount);
  const momentumY = new Array(cellCount);
  const temperatureK = new Array(cellCount);
  const waterVapor = new Array(cellCount);
  const cloudWater = new Array(cellCount);
  const precipitation = new Array(cellCount);
  const terrain = new Array(cellCount);

  for (let y = 0; y < safeHeight; y += 1) {
    const latitude = (y / Math.max(1, safeHeight - 1) - 0.5) * Math.PI;
    const latBand = Math.cos(latitude);
    for (let x = 0; x < safeWidth; x += 1) {
      const i = idx(x, y, safeWidth);
      const longitude = (x / safeWidth) * Math.PI * 2;
      const ridge = 0.5 + 0.5 * Math.sin(longitude * 2.0 + Math.sin(latitude * 3.0));
      const noise = (rng() - 0.5) * 0.08;
      terrain[i] = clamp(ridge * 0.42 + noise, 0, 1);
      columnMass[i] = 1 + Math.sin(longitude + latitude * 0.6) * 0.06 + noise * 0.4;
      momentumX[i] = latBand * (0.11 + stellarFlux * 0.035) + (rng() - 0.5) * 0.025;
      momentumY[i] = Math.sin(longitude * 1.5) * 0.035 + (rng() - 0.5) * 0.02;
      temperatureK[i] = ambientTemperatureK - 18 + stellarFlux * 28 + safeOceanHeat * 12 - terrain[i] * 18 + latBand * 8;
      waterVapor[i] = clamp(0.13 + safeOceanHeat * 0.15 + latBand * 0.05 - terrain[i] * 0.045 + noise, 0.02, 0.7);
      cloudWater[i] = clamp(0.08 + waterVapor[i] * 0.38 + Math.max(0, latBand) * 0.08 + noise * 0.5, 0, 0.7);
      precipitation[i] = clamp(Math.max(0, cloudWater[i] - 0.18) * 0.45, 0, 0.5);
    }
  }

  return {
    schema: HYDRO_ATMOSPHERE_STATE_SCHEMA,
    sequence: 0,
    elapsedTime: 0,
    width: safeWidth,
    height: safeHeight,
    columnMass,
    momentumX,
    momentumY,
    temperatureK,
    waterVapor,
    cloudWater,
    precipitation,
    terrain
  };
}

function normalizeState(input = {}) {
  const source = input.state || input;
  if (!source.columnMass && !source.temperatureK) return makeHydroAtmosphereInitialState(input);
  const width = normalizeInteger(source.width, 20, 4, 128);
  const height = normalizeInteger(source.height, Math.max(4, Math.round(width / 2)), 4, 128);
  const cellCount = width * height;
  return {
    schema: HYDRO_ATMOSPHERE_STATE_SCHEMA,
    sequence: normalizeInteger(source.sequence, 0, 0),
    elapsedTime: normalizeNumber(source.elapsedTime, 0, 0),
    width,
    height,
    columnMass: toFiniteArray(source.columnMass, cellCount, 'columnMass'),
    momentumX: toFiniteArray(source.momentumX || new Array(cellCount).fill(0), cellCount, 'momentumX'),
    momentumY: toFiniteArray(source.momentumY || new Array(cellCount).fill(0), cellCount, 'momentumY'),
    temperatureK: toFiniteArray(source.temperatureK, cellCount, 'temperatureK'),
    waterVapor: toFiniteArray(source.waterVapor || new Array(cellCount).fill(0), cellCount, 'waterVapor'),
    cloudWater: toFiniteArray(source.cloudWater || new Array(cellCount).fill(0), cellCount, 'cloudWater'),
    precipitation: toFiniteArray(source.precipitation || new Array(cellCount).fill(0), cellCount, 'precipitation'),
    terrain: toFiniteArray(source.terrain || new Array(cellCount).fill(0), cellCount, 'terrain')
  };
}

function cloneState(state) {
  return {
    schema: HYDRO_ATMOSPHERE_STATE_SCHEMA,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    width: state.width,
    height: state.height,
    columnMass: [...state.columnMass],
    momentumX: [...state.momentumX],
    momentumY: [...state.momentumY],
    temperatureK: [...state.temperatureK],
    waterVapor: [...state.waterVapor],
    cloudWater: [...state.cloudWater],
    precipitation: [...state.precipitation],
    terrain: [...state.terrain]
  };
}

function cellDataFromState(state) {
  const cellCount = state.width * state.height;
  const data = new Float32Array(cellCount * CELL_FLOATS);
  for (let i = 0; i < cellCount; i += 1) {
    const offset = i * CELL_FLOATS;
    data[offset] = state.columnMass[i];
    data[offset + 1] = state.momentumX[i];
    data[offset + 2] = state.momentumY[i];
    data[offset + 3] = state.temperatureK[i];
    data[offset + 4] = state.waterVapor[i];
    data[offset + 5] = state.cloudWater[i];
    data[offset + 6] = state.precipitation[i];
    data[offset + 7] = state.terrain[i];
  }
  return data;
}

function applyCellDataToState(state, data) {
  const cellCount = state.width * state.height;
  for (let i = 0; i < cellCount; i += 1) {
    const offset = i * CELL_FLOATS;
    state.columnMass[i] = data[offset];
    state.momentumX[i] = data[offset + 1];
    state.momentumY[i] = data[offset + 2];
    state.temperatureK[i] = data[offset + 3];
    state.waterVapor[i] = data[offset + 4];
    state.cloudWater[i] = data[offset + 5];
    state.precipitation[i] = data[offset + 6];
    state.terrain[i] = data[offset + 7];
  }
}

class HydroAtmosphereWebGpuRuntime {
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
    const cellCount = width * height;
    if (cellCount > HYDRO_ATMOSPHERE_WEBGPU_MAX_CELLS) {
      throw new Error(`Hydro atmosphere WebGPU cell count ${cellCount} exceeds ${HYDRO_ATMOSPHERE_WEBGPU_MAX_CELLS}`);
    }
    const gpu = globalThis.navigator?.gpu;
    if (!gpu) throw new Error('WebGPU unavailable for hydro atmosphere worker');
    const usage = globalThis.GPUBufferUsage;
    if (!usage) throw new Error('GPUBufferUsage unavailable for hydro atmosphere worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for hydro atmosphere worker');
    this.device = await adapter.requestDevice();
    this.width = width;
    this.height = height;

    const byteLength = cellCount * CELL_FLOATS * Float32Array.BYTES_PER_ELEMENT;
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
        module: this.device.createShaderModule({ code: HYDRO_SHADER }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`Hydro atmosphere WebGPU validation: ${validationError.message || validationError}`);
    }
    this.device.lost?.then((info) => {
      this.lastError = info?.message || info?.reason || 'Hydro atmosphere WebGPU device lost';
      gpuDisabledReasons.set(this.stateKey, this.lastError);
    });
  }

  async step(state, input = {}) {
    await this.initialize(state.width, state.height);
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for hydro atmosphere worker');
    const environment = input.environment || {};
    const coupling = input.coupling || {};
    const dt = clamp(normalizeNumber(input.dt, 0.02), 0, 1);
    const params = new Float32Array([
      state.width,
      state.height,
      dt,
      normalizeNumber(environment.stellarFlux, 1, 0.1, 4),
      normalizeNumber(environment.gravityMps2, 9.8, 0, 40),
      normalizeNumber(environment.ambientTemperatureK, 294, 180, 360),
      clamp(normalizeNumber(coupling.oceanHeat, 0.51), 0, 1),
      clamp(normalizeNumber(input.damping, 0.992), 0, 1)
    ]);
    const data = cellDataFromState(state);
    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.currentBuffer } },
        { binding: 1, resource: { buffer: this.nextBuffer } },
        { binding: 2, resource: { buffer: this.paramBuffer } }
      ]
    });

    this.device.queue.writeBuffer(this.currentBuffer, 0, data);
    this.device.queue.writeBuffer(this.paramBuffer, 0, params);
    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(Math.ceil((state.width * state.height) / WORKGROUP_SIZE));
    pass.end();
    encoder.copyBufferToBuffer(this.nextBuffer, 0, this.readBuffer, 0, data.byteLength);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone?.();
    await this.readBuffer.mapAsync(mapMode.READ);
    const mapped = this.readBuffer.getMappedRange();
    const result = new Float32Array(mapped).slice();
    this.readBuffer.unmap();
    applyCellDataToState(state, result);
    state.elapsedTime += dt;
    state.sequence += 1;
    this.submittedSteps += 1;
    return {
      backend: 'webgpu-hydro-atmosphere',
      webgpuStatus: {
        stateKey: this.stateKey,
        width: state.width,
        height: state.height,
        submittedSteps: this.submittedSteps
      }
    };
  }
}

function advanceHydroAtmosphereTile(state, input = {}) {
  const environment = input.environment || {};
  const coupling = input.coupling || {};
  const dt = clamp(normalizeNumber(input.dt, 0.02), 0, 1);
  const stellarFlux = normalizeNumber(environment.stellarFlux, 1, 0.1, 4);
  const ambientTemperatureK = normalizeNumber(environment.ambientTemperatureK, 294, 180, 360);
  const oceanHeat = clamp(normalizeNumber(coupling.oceanHeat, 0.51), 0, 1);
  const damping = clamp(normalizeNumber(input.damping, 0.992), 0, 1);
  const next = cloneState(state);

  for (let y = 0; y < state.height; y += 1) {
    const coriolis = (y / Math.max(1, state.height - 1) - 0.5) * 0.08;
    for (let x = 0; x < state.width; x += 1) {
      const i = idx(x, y, state.width);
      const right = idx(wrap(x + 1, state.width), y, state.width);
      const left = idx(wrap(x - 1, state.width), y, state.width);
      const up = idx(x, wrap(y + 1, state.height), state.width);
      const down = idx(x, wrap(y - 1, state.height), state.width);
      const pressureRight = state.columnMass[right] + state.temperatureK[right] * 0.0032 - state.terrain[right] * 0.09;
      const pressureLeft = state.columnMass[left] + state.temperatureK[left] * 0.0032 - state.terrain[left] * 0.09;
      const pressureUp = state.columnMass[up] + state.temperatureK[up] * 0.0032 - state.terrain[up] * 0.09;
      const pressureDown = state.columnMass[down] + state.temperatureK[down] * 0.0032 - state.terrain[down] * 0.09;
      const gradX = (pressureRight - pressureLeft) * 0.5;
      const gradY = (pressureUp - pressureDown) * 0.5;
      const oldMx = state.momentumX[i];
      const oldMy = state.momentumY[i];

      next.momentumX[i] = (oldMx - gradX * dt * 0.68 + oldMy * coriolis * dt) * damping;
      next.momentumY[i] = (oldMy - gradY * dt * 0.68 - oldMx * coriolis * dt) * damping;
      next.columnMass[i] = clamp(
        state.columnMass[i] - ((state.momentumX[right] - state.momentumX[left]) + (state.momentumY[up] - state.momentumY[down])) * dt * 0.035,
        0.35,
        2.2
      );

      const neighborTemperature = (state.temperatureK[right] + state.temperatureK[left] + state.temperatureK[up] + state.temperatureK[down]) * 0.25;
      const radiativeEquilibrium = ambientTemperatureK - 18 + stellarFlux * 42 + oceanHeat * 16 - state.terrain[i] * 22;
      next.temperatureK[i] = clamp(
        state.temperatureK[i]
          + (radiativeEquilibrium - state.temperatureK[i]) * dt * 0.035
          + (neighborTemperature - state.temperatureK[i]) * dt * 0.03
          - state.cloudWater[i] * dt * 1.6
          - state.precipitation[i] * dt * 2.4,
        180,
        340
      );

      const saturation = clamp(0.11 + (next.temperatureK[i] - 250) * 0.0032, 0.06, 0.42);
      const evaporation = Math.max(0, oceanHeat + stellarFlux * 0.45 - state.terrain[i] * 0.65) * dt * 0.0045;
      const condensation = Math.max(0, state.waterVapor[i] - saturation) * dt * 0.72;
      const precipRate = Math.max(0, state.cloudWater[i] - 0.18) * dt * 0.38;
      next.waterVapor[i] = clamp(state.waterVapor[i] + evaporation - condensation + state.precipitation[i] * dt * 0.03, 0, 1.2);
      next.cloudWater[i] = clamp(state.cloudWater[i] + condensation - precipRate, 0, 1.2);
      next.precipitation[i] = clamp(state.precipitation[i] * 0.86 + precipRate * 4.8, 0, 1.4);
    }
  }

  next.elapsedTime += dt;
  next.sequence += 1;
  Object.assign(state, next);
  return { backend: 'cpu-hydro-atmosphere' };
}

export function computeHydroAtmosphereDiagnostics(input = {}) {
  const state = normalizeState(input);
  const cellCount = state.width * state.height;
  let totalColumnMass = 0;
  let totalMoisture = 0;
  let kineticEnergy = 0;
  let temperatureSum = 0;
  let cloudSum = 0;
  let precipitationSum = 0;
  let maxWindMps = 0;
  let vorticitySum = 0;

  for (let y = 0; y < state.height; y += 1) {
    for (let x = 0; x < state.width; x += 1) {
      const i = idx(x, y, state.width);
      const mass = Math.max(1e-6, state.columnMass[i]);
      const windX = state.momentumX[i] / mass;
      const windY = state.momentumY[i] / mass;
      const speed = Math.hypot(windX, windY);
      const right = idx(wrap(x + 1, state.width), y, state.width);
      const left = idx(wrap(x - 1, state.width), y, state.width);
      const up = idx(x, wrap(y + 1, state.height), state.width);
      const down = idx(x, wrap(y - 1, state.height), state.width);
      const curl = (state.momentumY[right] - state.momentumY[left]) * 0.5
        - (state.momentumX[up] - state.momentumX[down]) * 0.5;
      totalColumnMass += state.columnMass[i];
      totalMoisture += state.waterVapor[i] + state.cloudWater[i] + state.precipitation[i];
      kineticEnergy += 0.5 * mass * speed * speed;
      temperatureSum += state.temperatureK[i];
      cloudSum += state.cloudWater[i];
      precipitationSum += state.precipitation[i];
      maxWindMps = Math.max(maxWindMps, speed * 38);
      vorticitySum += Math.abs(curl);
    }
  }

  const meanTemperatureK = temperatureSum / Math.max(1, cellCount);
  const cloudCover = clamp(cloudSum / Math.max(1, cellCount) * 2.8, 0, 1);
  const precipitationMean = precipitationSum / Math.max(1, cellCount);
  return {
    schema: 'peercompute.multiscale.hydro-atmosphere.diagnostics.v0',
    width: state.width,
    height: state.height,
    cellCount,
    totalColumnMass,
    totalMoisture,
    kineticEnergy,
    meanTemperatureK,
    meanPressurePa: 101325 + (meanTemperatureK - 288) * 62 + (totalColumnMass / Math.max(1, cellCount) - 1) * 18000,
    cloudCover,
    precipitationMean,
    maxWindMps,
    vorticityMean: vorticitySum / Math.max(1, cellCount),
    stormEnergy: clamp(cloudCover * 0.5 + precipitationMean * 1.8 + Math.min(1, maxWindMps / 80) * 0.35, 0, 1)
  };
}

function conservationFromDiagnostics(before, after) {
  return {
    massDrift: after.totalColumnMass - before.totalColumnMass,
    moistureDrift: after.totalMoisture - before.totalMoisture,
    kineticEnergyDrift: after.kineticEnergy - before.kineticEnergy,
    energyMode: 'reduced-moist-shallow-water',
    note: 'Reduced periodic hydro tile; moisture has evaporation/precipitation source terms and is not closed.'
  };
}

function createDeltaPayload({ payload, stateKey, state, diagnostics, conservation, backend }) {
  return {
    schema: payload.solver?.warmDelta?.schema || HYDRO_ATMOSPHERE_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'hydro-atmosphere',
    stateKey,
    backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    diagnostics,
    conservation,
    state: cloneState(state),
    units: {
      temperature: 'K',
      pressure: 'Pa',
      velocity: 'm/s visual proxy',
      moisture: 'reduced column fraction'
    }
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

export function resetHydroAtmosphere(input = {}) {
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
    schema: HYDRO_ATMOSPHERE_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

async function stepWithWebGpu(state, stateKey, input = {}) {
  let runtime = gpuRuntimes.get(stateKey);
  if (!runtime) {
    runtime = new HydroAtmosphereWebGpuRuntime(stateKey);
    gpuRuntimes.set(stateKey, runtime);
  }
  return runtime.step(state, input);
}

export async function stepHydroAtmosphere(payload = {}) {
  const resolved = resolveInput(payload);
  const { input, stateKey } = resolved;
  const requestedReset = input.reset === true;
  const state = input.state || requestedReset || !states.has(stateKey)
    ? normalizeState(input.state || makeHydroAtmosphereInitialState(input))
    : cloneState(states.get(stateKey));
  const before = computeHydroAtmosphereDiagnostics(state);
  let backend = 'cpu-hydro-atmosphere';
  let webgpuStatus = null;

  if (input.enableWebGPU !== false && !gpuDisabledReasons.has(stateKey)) {
    try {
      const gpuResult = await stepWithWebGpu(state, stateKey, input);
      backend = gpuResult.backend;
      webgpuStatus = gpuResult.webgpuStatus;
    } catch (error) {
      const reason = error?.message || String(error);
      gpuDisabledReasons.set(stateKey, reason);
      advanceHydroAtmosphereTile(state, input);
      webgpuStatus = {
        fallback: true,
        disabledReason: reason
      };
    }
  } else {
    advanceHydroAtmosphereTile(state, input);
    if (gpuDisabledReasons.has(stateKey)) {
      webgpuStatus = {
        fallback: true,
        disabledReason: gpuDisabledReasons.get(stateKey)
      };
    }
  }

  const diagnostics = computeHydroAtmosphereDiagnostics(state);
  const conservation = conservationFromDiagnostics(before, diagnostics);
  states.set(stateKey, cloneState(state));

  const value = {
    ok: true,
    schema: HYDRO_ATMOSPHERE_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'hydro-atmosphere',
    stateKey,
    backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    state: cloneState(state),
    diagnostics,
    conservation,
    webgpuStatus
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
        conservation,
        backend
      })
    }
  };
}
