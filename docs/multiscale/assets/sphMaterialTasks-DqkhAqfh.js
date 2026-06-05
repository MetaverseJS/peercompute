import {
  MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA,
  MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA,
  createMolecularSourceBufferApplicationReport,
  createMolecularSourceSinkReport,
  summarizeMolecularPhaseEosBasis,
  summarizeMolecularPhaseSource,
  summarizeQuantumMaterialPropertySource,
  summarizeQuantumMaterialResponseDerivativeSource,
  summarizeQuantumMaterialStatisticalSource,
  summarizeMolecularReactionSource
} from '../../../shared/sourceSinkContract.js';

export const SPH_MATERIAL_STATE_SCHEMA = 'peercompute.multiscale.sph-material.state.v0';
export const SPH_MATERIAL_RESULT_SCHEMA = 'peercompute.multiscale.sph-material.result.v0';
export const SPH_MATERIAL_DELTA_SCHEMA = 'peercompute.multiscale.sph-material.delta.v0';
export const SPH_MATERIAL_WEBGPU_MAX_PARTICLES = 1024;

const DEFAULT_STATE_KEY = 'multiscale:sph-material:default';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const PARTICLE_FLOATS = 12;
const PARAM_FLOATS = 28;
const PARAM_BYTES = PARAM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const WORKGROUP_SIZE = 64;
const WATER_FREEZE_K = 273.15;
const WATER_BOIL_K = 373.15;
const WATER_HEAT_CAPACITY_PROXY_KJ_KG_K = 4.18;
const WATER_LATENT_FUSION_PROXY_KJ_KG = 334;
const WATER_LATENT_VAPORIZATION_PROXY_KJ_KG = 2256;
const states = new Map();
const baselines = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const SPH_SHADER = `
struct Particle {
  posMass: vec4f,
  velTemp: vec4f,
  phaseDensity: vec4f,
};

struct Params {
  count: f32,
  dt: f32,
  smoothingRadius: f32,
  pressureScale: f32,
  viscosity: f32,
  thermalDiffusion: f32,
  gravity: f32,
  damping: f32,
  fireX: f32,
  fireY: f32,
  fireZ: f32,
  fireIntensity: f32,
  ambientTemp: f32,
  flameTemp: f32,
  groundY: f32,
  ruptured: f32,
  centerX: f32,
  centerY: f32,
  centerZ: f32,
  shellRadius: f32,
  membraneIntegrity: f32,
  boundsX: f32,
  boundsY: f32,
  boundsZ: f32,
  radiativeHeatFlux: f32,
  spillImpulse: f32,
  ruptureAge: f32,
  pad2: f32,
};

@group(0) @binding(0) var<storage, read> currentParticles: array<Particle>;
@group(0) @binding(1) var<storage, read_write> nextParticles: array<Particle>;
@group(0) @binding(2) var<uniform> params: Params;

fn clamp_to_bounds(posIn: vec3f, velIn: vec3f) -> Particle {
  var pos = posIn;
  var vel = velIn;
  if (pos.y < params.groundY) {
    pos.y = params.groundY;
    if (vel.y < 0.0) {
      vel.y = -vel.y * 0.28;
      vel.x = vel.x * 0.84;
      vel.z = vel.z * 0.84;
    }
  }
  if (abs(pos.x) > params.boundsX) {
    pos.x = clamp(pos.x, -params.boundsX, params.boundsX);
    vel.x = -vel.x * 0.35;
  }
  if (abs(pos.y) > params.boundsY) {
    pos.y = clamp(pos.y, -params.boundsY, params.boundsY);
    vel.y = -vel.y * 0.35;
  }
  if (abs(pos.z) > params.boundsZ) {
    pos.z = clamp(pos.z, -params.boundsZ, params.boundsZ);
    vel.z = -vel.z * 0.35;
  }
  var outParticle: Particle;
  outParticle.posMass = vec4f(pos, 0.0);
  outParticle.velTemp = vec4f(vel, 0.0);
  outParticle.phaseDensity = vec4f(0.0);
  return outParticle;
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let index = gid.x;
  let count = u32(params.count);
  if (index >= count) {
    return;
  }

  let particle = currentParticles[index];
  var pos = particle.posMass.xyz;
  let mass = max(particle.posMass.w, 0.000001);
  var vel = particle.velTemp.xyz;
  var temp = particle.velTemp.w;
  var phase = clamp(particle.phaseDensity.x, 0.0, 1.0);
  var density = 0.0;
  var acc = vec3f(0.0, -params.gravity * 0.08, 0.0);
  var heatRate = (params.ambientTemp - temp) * 0.08;
  let h = max(params.smoothingRadius, 0.001);

  for (var j = 0u; j < count; j = j + 1u) {
    if (j == index) {
      continue;
    }
    let other = currentParticles[j];
    let delta = pos - other.posMass.xyz;
    let dist = length(delta) + 0.00001;
    if (dist < h) {
      let q = 1.0 - dist / h;
      let dir = delta / dist;
      density = density + q * q * q * other.posMass.w;
      acc = acc + dir * (q * q * params.pressureScale * other.posMass.w);
      acc = acc + (other.velTemp.xyz - vel) * (q * params.viscosity);
      heatRate = heatRate + (other.velTemp.w - temp) * q * params.thermalDiffusion;
    }
  }

  let fireDelta = pos - vec3f(params.fireX, params.fireY, params.fireZ);
  let fireDrive = exp(-dot(fireDelta, fireDelta) * 0.75) * params.fireIntensity;
  let radiativeDrive = clamp(params.radiativeHeatFlux, -5000.0, 5000.0) * (0.008 + exp(-dot(fireDelta, fireDelta) * 0.22) * 0.012);
  heatRate = heatRate + (params.flameTemp - temp) * fireDrive * 0.95;
  heatRate = heatRate + radiativeDrive;
  acc.y = acc.y + phase * fireDrive * 1.6;

  var spillDrive = 0.0;
  if (params.ruptured > 0.5) {
    spillDrive = clamp(params.spillImpulse, 0.0, 5.0) * (0.42 + exp(-params.ruptureAge * 1.2) * 0.58);
  }
  if (spillDrive > 0.0001) {
    let center = vec3f(params.centerX, params.centerY, params.centerZ);
    let spillTargetPos = vec3f(params.fireX, params.groundY, params.fireZ);
    let spillDelta = spillTargetPos - center;
    let spillDir = spillDelta / max(length(spillDelta), 0.001);
    vel = vel + spillDir * spillDrive * params.dt * 18.0;
    acc = acc + spillDir * spillDrive * 2.5;
  }

  temp = clamp(temp + heatRate * params.dt, params.ambientTemp, 1400.0);
  let vaporizationStep = max(temp - ${WATER_BOIL_K.toFixed(2)}, 0.0) * params.dt * 0.0014 * (1.0 - phase);
  let condensationStep = max(${WATER_BOIL_K.toFixed(2)} - temp, 0.0) * params.dt * 0.00022 * phase;
  let freezeReleaseStep = max(${WATER_FREEZE_K.toFixed(2)} - temp, 0.0) * params.dt * 0.00035 * (1.0 - phase);
  phase = clamp(
    phase + vaporizationStep - condensationStep,
    0.0,
    1.0
  );
  temp = clamp(temp - vaporizationStep * 72.0 + condensationStep * 12.0 + freezeReleaseStep * 18.0, params.ambientTemp, 1400.0);

  vel = (vel + acc * params.dt) * params.damping;
  pos = pos + vel * params.dt;

  if (params.ruptured < 0.5) {
    let center = vec3f(params.centerX, params.centerY, params.centerZ);
    let fromCenter = pos - center;
    let dist = length(fromCenter) + 0.00001;
    let radius = max(params.shellRadius * (0.92 + (1.0 - params.membraneIntegrity) * 0.1), 0.1);
    if (dist > radius) {
      let dir = fromCenter / dist;
      pos = center + dir * radius;
      let outward = dot(vel, dir);
      if (outward > 0.0) {
        vel = vel - dir * outward * 1.35;
      }
    }
  } else {
    if (spillDrive > 0.0001) {
      let center = vec3f(params.centerX, params.centerY, params.centerZ);
      let spillTargetPos = vec3f(params.fireX, params.groundY + 0.04, params.fireZ);
      let pathDelta = spillTargetPos - center;
      let pathDir = pathDelta / max(length(pathDelta), 0.001);
      let sideDir = normalize(vec3f(-pathDir.z, 0.0, pathDir.x) + vec3f(0.0001, 0.0, 0.0001));
      let lane = fract(f32(index) * 0.61803398875);
      let side = (fract(f32(index) * 0.754877666) - 0.5) * (0.26 - lane * 0.12);
      let pathT = clamp(params.ruptureAge * 0.95 + spillDrive * 0.2 + lane * 0.28, 0.0, 1.0);
      let arc = sin(pathT * 3.14159265) * 0.62;
      let streamPos = center + pathDelta * pathT + vec3f(0.0, arc, 0.0) + sideDir * side;
      let blend = clamp(0.08 + spillDrive * 0.12, 0.0, 0.32);
      let before = pos;
      pos = mix(pos, streamPos, blend);
      vel = vel + (pos - before) / max(params.dt, 0.001) * 0.18;
    }
    let bounded = clamp_to_bounds(pos, vel);
    pos = bounded.posMass.xyz;
    vel = bounded.velTemp.xyz;
  }

  nextParticles[index].posMass = vec4f(pos, mass);
  nextParticles[index].velTemp = vec4f(vel, temp);
  nextParticles[index].phaseDensity = vec4f(phase, density, fireDrive, 0.0);
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

function readMolecularClosureFromInput(input = {}) {
  const coupling = input.coupling || {};
  return coupling.molecularDynamicsClosure
    || coupling.molecularClosure
    || coupling.closureResults?.molecularDynamics
    || input.closureResults?.molecularDynamics
    || input.molecularDynamicsClosure
    || null;
}

function readMolecularTargetSourceIntake(input = {}, targetSolverId = 'sph-material') {
  const coupling = input.coupling || {};
  const candidate = coupling.molecularTargetSourceIntake
    || input.molecularTargetSourceIntake
    || null;
  const inactive = {
    active: false,
    schema: null,
    status: 'inactive',
    sourceApplyExecutionSequence: null,
    heatRateWProxy: 0,
    speciesRateCountPerSProxy: 0,
    temperatureDeltaKProxy: 0,
    phaseDriveDeltaProxy: 0,
    reactionDriveDeltaProxy: 0,
    radiativeHeatFluxBoostProxy: 0,
    thermalDrive: 0
  };
  if (
    candidate?.schema !== MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA
    || candidate.active !== true
    || candidate.targetSolverId !== targetSolverId
  ) {
    return inactive;
  }
  return {
    active: true,
    schema: candidate.schema,
    status: candidate.status || 'source-intake-ready',
    sourceApplyExecutionSequence: normalizeNumber(candidate.sourceApplyExecutionSequence, 0, 0),
    heatRateWProxy: normalizeNumber(candidate.heatRateWProxy, 0, -1000, 1000),
    speciesRateCountPerSProxy: normalizeNumber(candidate.speciesRateCountPerSProxy, 0, 0, 1000000),
    temperatureDeltaKProxy: normalizeNumber(candidate.temperatureDeltaKProxy, 0, -10000, 10000),
    phaseDriveDeltaProxy: normalizeNumber(candidate.phaseDriveDeltaProxy, 0, 0, 1),
    reactionDriveDeltaProxy: normalizeNumber(candidate.reactionDriveDeltaProxy, 0, 0, 1),
    radiativeHeatFluxBoostProxy: normalizeNumber(candidate.radiativeHeatFluxBoostProxy, 0, -5000, 5000),
    thermalDrive: clamp(normalizeNumber(candidate.thermalDrive, 0), 0, 1)
  };
}

function readQuantumMaterialPropertySource(reportTarget = {}, candidate = {}) {
  return summarizeQuantumMaterialPropertySource({
    molecular: reportTarget?.quantumMaterialPropertySource
      || candidate?.quantumMaterialPropertySource
      || {
        active: reportTarget?.quantumMaterialPropertyActive ?? candidate?.quantumMaterialPropertyActive,
        thermalFluxBoostProxy: reportTarget?.quantumMaterialPropertyThermalFluxBoostProxy
          ?? candidate?.quantumMaterialPropertyThermalFluxBoostProxy,
        phaseDriveBoostProxy: reportTarget?.quantumMaterialPropertyPhaseDriveBoostProxy
          ?? candidate?.quantumMaterialPropertyPhaseDriveBoostProxy,
        electricalDrive: reportTarget?.quantumMaterialPropertyElectricalDrive
          ?? candidate?.quantumMaterialPropertyElectricalDrive,
        opticalHeatingDrive: reportTarget?.quantumMaterialPropertyOpticalHeatingDrive
          ?? candidate?.quantumMaterialPropertyOpticalHeatingDrive,
        mechanicalStiffnessDrive: reportTarget?.quantumMaterialPropertyMechanicalStiffnessDrive
          ?? candidate?.quantumMaterialPropertyMechanicalStiffnessDrive,
        materialDampingScale: reportTarget?.quantumMaterialPropertyDampingScale
          ?? candidate?.quantumMaterialPropertyDampingScale
      }
  });
}

function readQuantumMaterialStatisticalSource(reportTarget = {}, candidate = {}) {
  return summarizeQuantumMaterialStatisticalSource({
    source: reportTarget?.quantumMaterialStatisticalSource
      || candidate?.quantumMaterialStatisticalSource
      || {
        active: reportTarget?.quantumMaterialStatisticalActive ?? candidate?.quantumMaterialStatisticalActive,
        sourceEquationSchema: reportTarget?.quantumMaterialStatisticalSourceEquationSchema
          ?? candidate?.quantumMaterialStatisticalSourceEquationSchema,
        channelCount: reportTarget?.quantumMaterialStatisticalSourceChannelCount
          ?? candidate?.quantumMaterialStatisticalSourceChannelCount,
        pressureDriveProxy: reportTarget?.quantumMaterialStatisticalPressureDriveProxy
          ?? candidate?.quantumMaterialStatisticalPressureDriveProxy,
        opacityDriveProxy: reportTarget?.quantumMaterialStatisticalOpacityDriveProxy
          ?? candidate?.quantumMaterialStatisticalOpacityDriveProxy,
        ionizationDriveProxy: reportTarget?.quantumMaterialStatisticalIonizationDriveProxy
          ?? candidate?.quantumMaterialStatisticalIonizationDriveProxy,
        degeneracyPressureDriveProxy: reportTarget?.quantumMaterialStatisticalDegeneracyPressureDriveProxy
          ?? candidate?.quantumMaterialStatisticalDegeneracyPressureDriveProxy,
        temperatureDeltaKProxy: reportTarget?.quantumMaterialStatisticalTemperatureDeltaKProxy
          ?? candidate?.quantumMaterialStatisticalTemperatureDeltaKProxy,
        chargeDeltaProxy: reportTarget?.quantumMaterialStatisticalChargeDeltaProxy
          ?? candidate?.quantumMaterialStatisticalChargeDeltaProxy,
        thermalDampingScale: reportTarget?.quantumMaterialStatisticalThermalDampingScale
          ?? candidate?.quantumMaterialStatisticalThermalDampingScale
      }
  });
}

function readQuantumMaterialResponseDerivativeSource(reportTarget = {}, candidate = {}) {
  return summarizeQuantumMaterialResponseDerivativeSource({
    molecular: reportTarget?.quantumMaterialResponseDerivativeSource
      || candidate?.quantumMaterialResponseDerivativeSource
      || {
        active: reportTarget?.quantumMaterialResponseDerivativeActive
          ?? candidate?.quantumMaterialResponseDerivativeActive,
        temperatureDrive: reportTarget?.quantumMaterialResponseDerivativeTemperatureDrive
          ?? candidate?.quantumMaterialResponseDerivativeTemperatureDrive,
        pressureDrive: reportTarget?.quantumMaterialResponseDerivativePressureDrive
          ?? candidate?.quantumMaterialResponseDerivativePressureDrive,
        fieldDrive: reportTarget?.quantumMaterialResponseDerivativeFieldDrive
          ?? candidate?.quantumMaterialResponseDerivativeFieldDrive,
        radiationDrive: reportTarget?.quantumMaterialResponseDerivativeRadiationDrive
          ?? candidate?.quantumMaterialResponseDerivativeRadiationDrive,
        thermalFluxDerivativeBoostProxy: reportTarget?.quantumMaterialResponseDerivativeThermalFluxBoostProxy
          ?? candidate?.quantumMaterialResponseDerivativeThermalFluxBoostProxy,
        phaseDerivativeDriveBoostProxy: reportTarget?.quantumMaterialResponseDerivativePhaseDriveBoostProxy
          ?? candidate?.quantumMaterialResponseDerivativePhaseDriveBoostProxy,
        electricalDerivativeDrive: reportTarget?.quantumMaterialResponseDerivativeElectricalDrive
          ?? candidate?.quantumMaterialResponseDerivativeElectricalDrive,
        mechanicalDerivativeDrive: reportTarget?.quantumMaterialResponseDerivativeMechanicalDrive
          ?? candidate?.quantumMaterialResponseDerivativeMechanicalDrive,
        opticalDerivativeDrive: reportTarget?.quantumMaterialResponseDerivativeOpticalDrive
          ?? candidate?.quantumMaterialResponseDerivativeOpticalDrive,
        materialDerivativeDampingScale: reportTarget?.quantumMaterialResponseDerivativeDampingScale
          ?? candidate?.quantumMaterialResponseDerivativeDampingScale
      }
  });
}

function readMolecularConservativeSourceBuffer(input = {}, targetSolverId = 'sph-material') {
  const coupling = input.coupling || {};
  const candidate = coupling.molecularConservativeSourceBuffer
    || coupling.conservativeSourceBuffer
    || input.molecularConservativeSourceBuffer
    || input.conservativeSourceBuffer
    || null;
  const reportTarget = Array.isArray(candidate?.targets)
    ? candidate.targets.find((target) => target.targetSolverId === targetSolverId)
    : candidate;
  const inactive = {
    active: false,
    schema: null,
    status: 'inactive',
    sourceApplyExecutionSequence: null,
    heatRateWProxy: 0,
    speciesRateCountPerSProxy: 0,
    temperatureDeltaKProxy: 0,
    phaseDriveDeltaProxy: 0,
    reactionDriveDeltaProxy: 0,
    radiativeHeatFluxBoostProxy: 0,
    thermalDrive: 0,
    reconciliationResidualProxy: 0,
    sourceBufferResidualProxy: 0,
    quantumMaterialPropertySource: summarizeQuantumMaterialPropertySource(),
    quantumMaterialStatisticalSource: summarizeQuantumMaterialStatisticalSource(),
    quantumMaterialResponseDerivativeSource: summarizeQuantumMaterialResponseDerivativeSource(),
    quantumMaterialPropertyThermalFluxBoostProxy: 0,
    quantumMaterialPropertyPhaseDriveBoostProxy: 0,
    quantumMaterialPropertyElectricalDrive: 0,
    quantumMaterialPropertyOpticalHeatingDrive: 0,
    quantumMaterialPropertyMechanicalStiffnessDrive: 0,
    quantumMaterialPropertyDampingScale: 1,
    quantumMaterialStatisticalSourceChannelCount: 0,
    quantumMaterialStatisticalPressureDriveProxy: 0,
    quantumMaterialStatisticalOpacityDriveProxy: 0,
    quantumMaterialStatisticalIonizationDriveProxy: 0,
    quantumMaterialStatisticalDegeneracyPressureDriveProxy: 0,
    quantumMaterialStatisticalTemperatureDeltaKProxy: 0,
    quantumMaterialStatisticalChargeDeltaProxy: 0,
    quantumMaterialStatisticalThermalDampingScale: 1,
    quantumMaterialResponseDerivativeTemperatureDrive: 0,
    quantumMaterialResponseDerivativePressureDrive: 0,
    quantumMaterialResponseDerivativeFieldDrive: 0,
    quantumMaterialResponseDerivativeRadiationDrive: 0,
    quantumMaterialResponseDerivativeThermalFluxBoostProxy: 0,
    quantumMaterialResponseDerivativePhaseDriveBoostProxy: 0,
    quantumMaterialResponseDerivativeElectricalDrive: 0,
    quantumMaterialResponseDerivativeMechanicalDrive: 0,
    quantumMaterialResponseDerivativeOpticalDrive: 0,
    quantumMaterialResponseDerivativeDampingScale: 1,
    sourceVectorF32: []
  };
  if (
    candidate?.schema !== MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA
    || reportTarget?.active !== true
    || reportTarget.targetSolverId !== targetSolverId
  ) {
    return inactive;
  }
  const quantumMaterialPropertySource = readQuantumMaterialPropertySource(reportTarget, candidate);
  const quantumMaterialStatisticalSource = readQuantumMaterialStatisticalSource(reportTarget, candidate);
  const quantumMaterialResponseDerivativeSource = readQuantumMaterialResponseDerivativeSource(reportTarget, candidate);
  return {
    active: true,
    schema: candidate.schema,
    mode: candidate.mode || null,
    status: reportTarget.status || candidate.status || 'buffer-ready-provisional',
    dispatchable: reportTarget.dispatchable === true,
    reconciled: reportTarget.reconciled === true,
    sourceApplyExecutionSequence: normalizeNumber(reportTarget.sourceApplyExecutionSequence, 0, 0),
    bufferStrideFloats: normalizeNumber(candidate.bufferStrideFloats, reportTarget.sourceVectorF32?.length || 0, 0),
    heatRateWProxy: normalizeNumber(reportTarget.heatRateWProxy, 0, -1000, 1000),
    speciesRateCountPerSProxy: normalizeNumber(reportTarget.speciesRateCountPerSProxy, 0, 0, 1000000),
    temperatureDeltaKProxy: normalizeNumber(reportTarget.temperatureDeltaKProxy, 0, -10000, 10000),
    phaseDriveDeltaProxy: normalizeNumber(reportTarget.phaseDriveDeltaProxy, 0, 0, 1),
    reactionDriveDeltaProxy: normalizeNumber(reportTarget.reactionDriveDeltaProxy, 0, 0, 1),
    radiativeHeatFluxBoostProxy: normalizeNumber(reportTarget.radiativeHeatFluxBoostProxy, 0, -5000, 5000),
    thermalDrive: clamp(normalizeNumber(reportTarget.thermalDrive, 0), 0, 1),
    reconciliationResidualProxy: clamp(normalizeNumber(reportTarget.reconciliationResidualProxy, 0), 0, 1),
    sourceBufferResidualProxy: clamp(normalizeNumber(candidate.sourceBufferResidualProxy, 0), 0, 1),
    quantumMaterialPropertySource,
    quantumMaterialPropertyThermalFluxBoostProxy: normalizeNumber(
      quantumMaterialPropertySource.thermalFluxBoostProxy,
      0,
      0,
      5000
    ),
    quantumMaterialPropertyPhaseDriveBoostProxy: clamp(
      normalizeNumber(quantumMaterialPropertySource.phaseDriveBoostProxy, 0),
      0,
      1
    ),
    quantumMaterialPropertyElectricalDrive: clamp(
      normalizeNumber(quantumMaterialPropertySource.electricalDrive, 0),
      0,
      2
    ),
    quantumMaterialPropertyOpticalHeatingDrive: clamp(
      normalizeNumber(quantumMaterialPropertySource.opticalHeatingDrive, 0),
      0,
      2
    ),
    quantumMaterialPropertyMechanicalStiffnessDrive: clamp(
      normalizeNumber(quantumMaterialPropertySource.mechanicalStiffnessDrive, 0),
      0,
      2
    ),
    quantumMaterialPropertyDampingScale: clamp(
      normalizeNumber(quantumMaterialPropertySource.materialDampingScale, 1),
      0.1,
      4
    ),
    quantumMaterialStatisticalSource,
    quantumMaterialStatisticalSourceChannelCount: normalizeNumber(
      quantumMaterialStatisticalSource.channelCount,
      0,
      0,
      64
    ),
    quantumMaterialStatisticalPressureDriveProxy: clamp(
      normalizeNumber(quantumMaterialStatisticalSource.pressureDriveProxy, 0),
      -1,
      1
    ),
    quantumMaterialStatisticalOpacityDriveProxy: clamp(
      normalizeNumber(quantumMaterialStatisticalSource.opacityDriveProxy, 0),
      0,
      2
    ),
    quantumMaterialStatisticalIonizationDriveProxy: clamp(
      normalizeNumber(quantumMaterialStatisticalSource.ionizationDriveProxy, 0),
      0,
      1
    ),
    quantumMaterialStatisticalDegeneracyPressureDriveProxy: clamp(
      normalizeNumber(quantumMaterialStatisticalSource.degeneracyPressureDriveProxy, 0),
      0,
      1
    ),
    quantumMaterialStatisticalTemperatureDeltaKProxy: clamp(
      normalizeNumber(quantumMaterialStatisticalSource.temperatureDeltaKProxy, 0),
      -80,
      80
    ),
    quantumMaterialStatisticalChargeDeltaProxy: clamp(
      normalizeNumber(quantumMaterialStatisticalSource.chargeDeltaProxy, 0),
      -0.25,
      0.25
    ),
    quantumMaterialStatisticalThermalDampingScale: clamp(
      normalizeNumber(quantumMaterialStatisticalSource.thermalDampingScale, 1),
      0.5,
      1.5
    ),
    quantumMaterialResponseDerivativeSource,
    quantumMaterialResponseDerivativeTemperatureDrive: clamp(
      normalizeNumber(quantumMaterialResponseDerivativeSource.temperatureDrive, 0),
      0,
      1
    ),
    quantumMaterialResponseDerivativePressureDrive: clamp(
      normalizeNumber(quantumMaterialResponseDerivativeSource.pressureDrive, 0),
      0,
      1
    ),
    quantumMaterialResponseDerivativeFieldDrive: clamp(
      normalizeNumber(quantumMaterialResponseDerivativeSource.fieldDrive, 0),
      0,
      1
    ),
    quantumMaterialResponseDerivativeRadiationDrive: clamp(
      normalizeNumber(quantumMaterialResponseDerivativeSource.radiationDrive, 0),
      0,
      1
    ),
    quantumMaterialResponseDerivativeThermalFluxBoostProxy: normalizeNumber(
      quantumMaterialResponseDerivativeSource.thermalFluxDerivativeBoostProxy,
      0,
      0,
      5000
    ),
    quantumMaterialResponseDerivativePhaseDriveBoostProxy: clamp(
      normalizeNumber(quantumMaterialResponseDerivativeSource.phaseDerivativeDriveBoostProxy, 0),
      0,
      1
    ),
    quantumMaterialResponseDerivativeElectricalDrive: clamp(
      normalizeNumber(quantumMaterialResponseDerivativeSource.electricalDerivativeDrive, 0),
      0,
      2
    ),
    quantumMaterialResponseDerivativeMechanicalDrive: clamp(
      normalizeNumber(quantumMaterialResponseDerivativeSource.mechanicalDerivativeDrive, 0),
      0,
      2
    ),
    quantumMaterialResponseDerivativeOpticalDrive: clamp(
      normalizeNumber(quantumMaterialResponseDerivativeSource.opticalDerivativeDrive, 0),
      0,
      2
    ),
    quantumMaterialResponseDerivativeDampingScale: clamp(
      normalizeNumber(quantumMaterialResponseDerivativeSource.materialDerivativeDampingScale, 1),
      0.1,
      4
    ),
    sourceVectorF32: Array.isArray(reportTarget.sourceVectorF32)
      ? reportTarget.sourceVectorF32.map((value) => normalizeNumber(value, 0, -1000000, 1000000))
      : []
  };
}

function deriveMolecularMaterialCoupling(input = {}) {
  const closure = readMolecularClosureFromInput(input);
  const intake = readMolecularTargetSourceIntake(input);
  const sourceBuffer = readMolecularConservativeSourceBuffer(input);
  const sourceTerms = sourceBuffer.active ? sourceBuffer : intake;
  const hasClosure = closure?.schema === 'peercompute.multiscale.closure-result.v0';
  if (!hasClosure && !intake.active && !sourceBuffer.active) {
    return { active: false };
  }
  const chemistry = hasClosure ? closure.chemistry || {} : {};
  const thermodynamics = hasClosure ? closure.thermodynamics || {} : {};
  const reactionSource = summarizeMolecularReactionSource(chemistry);
  const phaseSource = summarizeMolecularPhaseSource({ sourceClosure: closure });
  const phaseEosBasis = summarizeMolecularPhaseEosBasis({
    sourceClosure: closure,
    environment: input.environment || {}
  });
  const closureQuantumMaterialPropertySource = summarizeQuantumMaterialPropertySource({ sourceClosure: closure });
  const closureQuantumMaterialStatisticalSource = summarizeQuantumMaterialStatisticalSource({
    source: closure?.state?.fields || closure?.chemistry?.quantumMaterialSource || closure || {},
    molecular: closure?.state?.fields || closure?.chemistry?.quantumMaterialSource || closure || {}
  });
  const closureQuantumMaterialResponseDerivativeSource = summarizeQuantumMaterialResponseDerivativeSource({
    sourceClosure: closure,
    molecular: closure?.state?.fields || closure?.chemistry?.quantumMaterialSource || closure || {}
  });
  const quantumMaterialPropertySource = sourceTerms.quantumMaterialPropertySource?.active === true
    ? sourceTerms.quantumMaterialPropertySource
    : closureQuantumMaterialPropertySource;
  const quantumMaterialStatisticalSource = sourceTerms.quantumMaterialStatisticalSource?.active === true
    ? sourceTerms.quantumMaterialStatisticalSource
    : closureQuantumMaterialStatisticalSource;
  const quantumMaterialResponseDerivativeSource = sourceTerms.quantumMaterialResponseDerivativeSource?.active === true
    ? sourceTerms.quantumMaterialResponseDerivativeSource
    : closureQuantumMaterialResponseDerivativeSource;
  const heatReleaseProxy = clamp(normalizeNumber(chemistry.heatReleaseProxy, 0), 0, 6);
  const reactionProgress = clamp(normalizeNumber(chemistry.reactionProgress, 0), 0, 1);
  const ionizationFraction = clamp(normalizeNumber(chemistry.ionizationFraction, 0), 0, 1);
  const temperatureK = normalizeNumber(thermodynamics.temperatureK, chemistry.meanTemperatureK ?? 294, 1, 20000);
  const ambientTemp = normalizeNumber(input.environment?.ambientTemperatureK, 294, 1, 20000);
  const thermalDrive = clamp(
    heatReleaseProxy * 0.18
      + reactionProgress * 0.12
      + ionizationFraction * 0.08
      + reactionSource.sourceDrive * 0.18
      - reactionSource.coolingDrive * 0.06
      + phaseSource.heatingDrive * 0.12
      + phaseSource.phaseDriveProxy * 0.14
      - phaseSource.coolingDrive * 0.06
      + phaseEosBasis.source.thermalDrive * 0.12
      - phaseEosBasis.source.coolingDrive * 0.05
      + phaseEosBasis.phase.phaseStabilityResidualProxy * 0.07
      + sourceTerms.thermalDrive * 0.34
      + sourceTerms.phaseDriveDeltaProxy * 0.22
      + quantumMaterialPropertySource.electricalDrive * 0.04
      + quantumMaterialPropertySource.opticalHeatingDrive * 0.06
      + quantumMaterialPropertySource.phaseDriveBoostProxy * 0.18
      + Math.max(0, quantumMaterialStatisticalSource.pressureDriveProxy) * 0.08
      + quantumMaterialStatisticalSource.opacityDriveProxy * 0.03
      + quantumMaterialStatisticalSource.ionizationDriveProxy * 0.05
      + quantumMaterialStatisticalSource.degeneracyPressureDriveProxy * 0.09
      + Math.max(0, quantumMaterialStatisticalSource.temperatureDeltaKProxy) / 3200
      + quantumMaterialResponseDerivativeSource.temperatureDrive * 0.08
      + quantumMaterialResponseDerivativeSource.pressureDrive * 0.05
      + quantumMaterialResponseDerivativeSource.radiationDrive * 0.09
      + quantumMaterialResponseDerivativeSource.phaseDerivativeDriveBoostProxy * 0.18
      + Math.max(0, sourceTerms.temperatureDeltaKProxy) / 2200
      + Math.max(0, temperatureK - ambientTemp) / 3200,
    0,
    1
  );
  return {
    active: thermalDrive > 0.0001,
    schema: hasClosure ? closure.schema : null,
    modelId: hasClosure ? closure.modelId || null : null,
    sourceClosure: closure,
    sourceStateKey: hasClosure ? closure.source?.stateKey || closure.state?.stateKey || null : null,
    sourceSequence: hasClosure ? closure.source?.sequence ?? closure.state?.sequence ?? null : null,
    targetSourceIntake: intake.active ? intake : null,
    targetSourceIntakeSchema: intake.active ? intake.schema : null,
    targetSourceIntakeSequence: intake.active ? intake.sourceApplyExecutionSequence : null,
    targetSourceIntakeThermalDrive: intake.active ? intake.thermalDrive : 0,
    conservativeSourceBuffer: sourceBuffer.active ? sourceBuffer : null,
    conservativeSourceBufferSchema: sourceBuffer.active ? sourceBuffer.schema : null,
    conservativeSourceBufferSequence: sourceBuffer.active ? sourceBuffer.sourceApplyExecutionSequence : null,
    conservativeSourceBufferThermalDrive: sourceBuffer.active ? sourceBuffer.thermalDrive : 0,
    conservativeSourceBufferResidual: sourceBuffer.active ? sourceBuffer.sourceBufferResidualProxy : 0,
    conservativeSourceBufferVectorStride: sourceBuffer.active ? sourceBuffer.bufferStrideFloats : 0,
    atomCount: Math.max(1, normalizeNumber(chemistry.atomCount, 1, 1)),
    species: chemistry.species || (hasClosure ? closure.state?.species : {}) || {},
    heatReleaseProxy,
    reactionProgress,
    ionizationFraction,
    reactionSource: chemistry.reactionSource || null,
    reactionSourceSchema: reactionSource.schema,
    reactionHeatSourceProxy: reactionSource.netHeatSourceProxy,
    reactionSpeciesRateProxy: reactionSource.speciesRateProxy,
    reactionSourceDrive: reactionSource.sourceDrive,
    reactionCoolingDrive: reactionSource.coolingDrive,
    reactionSourceEventIntensity: reactionSource.eventIntensityProxy,
    reactionSourceBondFormationRate: reactionSource.bondFormationRate,
    reactionSourceBondBreakageRate: reactionSource.bondBreakageRate,
    phaseSource,
    phaseEosBasis,
    molecularPhaseEosSchema: phaseEosBasis.schema,
    molecularPhaseEosSpecificFreeEnergyProxy: phaseEosBasis.basis.specificFreeEnergyProxy,
    molecularPhaseEosSpecificEnthalpyProxy: phaseEosBasis.basis.specificEnthalpyProxy,
    molecularPhaseEosLatentHeatBudgetProxy: phaseEosBasis.basis.latentHeatBudgetProxy,
    molecularPhaseEosEnergyRateProxy: phaseEosBasis.source.phaseEnergyRateProxy,
    molecularPhaseEosStabilityResidualProxy: phaseEosBasis.phase.phaseStabilityResidualProxy,
    molecularPhaseEosTemperatureDeltaKProxy: phaseEosBasis.source.sourceTemperatureDeltaKProxy,
    phaseRegime: phaseSource.phaseRegime,
    molecularPhaseDriveProxy: phaseSource.phaseDriveProxy,
    molecularPhaseHeatingDrive: phaseSource.heatingDrive,
    molecularPhaseCoolingDrive: phaseSource.coolingDrive,
    molecularPhaseChangeRateProxy: phaseSource.phaseChangeRateProxy,
    molecularLatentHeatSinkProxy: phaseSource.latentHeatSinkProxy,
    molecularLatentHeatReleaseProxy: phaseSource.latentHeatReleaseProxy,
    molecularWaterMoleculeFraction: phaseSource.waterMoleculeFraction,
    quantumMaterialPropertySource: quantumMaterialPropertySource.active ? quantumMaterialPropertySource : null,
    quantumMaterialPropertyThermalFluxBoostProxy: quantumMaterialPropertySource.thermalFluxBoostProxy,
    quantumMaterialPropertyPhaseDriveBoostProxy: quantumMaterialPropertySource.phaseDriveBoostProxy,
    quantumMaterialPropertyElectricalDrive: quantumMaterialPropertySource.electricalDrive,
    quantumMaterialPropertyOpticalHeatingDrive: quantumMaterialPropertySource.opticalHeatingDrive,
    quantumMaterialPropertyMechanicalStiffnessDrive: quantumMaterialPropertySource.mechanicalStiffnessDrive,
    quantumMaterialPropertyDampingScale: quantumMaterialPropertySource.materialDampingScale,
    quantumMaterialStatisticalSource: quantumMaterialStatisticalSource.active ? quantumMaterialStatisticalSource : null,
    quantumMaterialStatisticalSourceChannelCount: quantumMaterialStatisticalSource.channelCount,
    quantumMaterialStatisticalPressureDriveProxy: quantumMaterialStatisticalSource.pressureDriveProxy,
    quantumMaterialStatisticalOpacityDriveProxy: quantumMaterialStatisticalSource.opacityDriveProxy,
    quantumMaterialStatisticalIonizationDriveProxy: quantumMaterialStatisticalSource.ionizationDriveProxy,
    quantumMaterialStatisticalDegeneracyPressureDriveProxy: quantumMaterialStatisticalSource.degeneracyPressureDriveProxy,
    quantumMaterialStatisticalTemperatureDeltaKProxy: quantumMaterialStatisticalSource.temperatureDeltaKProxy,
    quantumMaterialStatisticalChargeDeltaProxy: quantumMaterialStatisticalSource.chargeDeltaProxy,
    quantumMaterialStatisticalThermalDampingScale: quantumMaterialStatisticalSource.thermalDampingScale,
    quantumMaterialResponseDerivativeSource: quantumMaterialResponseDerivativeSource.active ? quantumMaterialResponseDerivativeSource : null,
    quantumMaterialResponseDerivativeTemperatureDrive: quantumMaterialResponseDerivativeSource.temperatureDrive,
    quantumMaterialResponseDerivativePressureDrive: quantumMaterialResponseDerivativeSource.pressureDrive,
    quantumMaterialResponseDerivativeFieldDrive: quantumMaterialResponseDerivativeSource.fieldDrive,
    quantumMaterialResponseDerivativeRadiationDrive: quantumMaterialResponseDerivativeSource.radiationDrive,
    quantumMaterialResponseDerivativeThermalFluxBoostProxy: quantumMaterialResponseDerivativeSource.thermalFluxDerivativeBoostProxy,
    quantumMaterialResponseDerivativePhaseDriveBoostProxy: quantumMaterialResponseDerivativeSource.phaseDerivativeDriveBoostProxy,
    quantumMaterialResponseDerivativeElectricalDrive: quantumMaterialResponseDerivativeSource.electricalDerivativeDrive,
    quantumMaterialResponseDerivativeMechanicalDrive: quantumMaterialResponseDerivativeSource.mechanicalDerivativeDrive,
    quantumMaterialResponseDerivativeOpticalDrive: quantumMaterialResponseDerivativeSource.opticalDerivativeDrive,
    quantumMaterialResponseDerivativeDampingScale: quantumMaterialResponseDerivativeSource.materialDerivativeDampingScale,
    temperatureK,
    thermalDrive,
    fireIntensityBoost: clamp(
      thermalDrive * 0.08
        + reactionSource.sourceDrive * 0.04
        + phaseSource.heatingDrive * 0.025
        - phaseSource.coolingDrive * 0.02
        + phaseEosBasis.source.thermalDrive * 0.025
        + quantumMaterialPropertySource.electricalDrive * 0.015
        + quantumMaterialPropertySource.opticalHeatingDrive * 0.02
        + quantumMaterialStatisticalSource.ionizationDriveProxy * 0.018
        + quantumMaterialStatisticalSource.opacityDriveProxy * 0.012
        + quantumMaterialResponseDerivativeSource.fieldDrive * 0.012
        + quantumMaterialResponseDerivativeSource.radiationDrive * 0.016,
      0,
      0.14
    ),
    flameTemperatureBoostK: Math.max(
      -96,
      thermalDrive * 96
        + reactionSource.sourceDrive * 48
        + phaseSource.heatingDrive * 42
        + phaseSource.latentHeatReleaseProxy * 26
        - phaseSource.coolingDrive * 36
        - phaseSource.latentHeatSinkProxy * 22
        + phaseEosBasis.source.thermalDrive * 36
        + Math.max(0, phaseEosBasis.source.phaseEnergyRateProxy) * 12
        - Math.max(0, -phaseEosBasis.source.phaseEnergyRateProxy) * 8
        + quantumMaterialPropertySource.thermalFluxBoostProxy * 0.12
        + quantumMaterialStatisticalSource.opacityDriveProxy * 18
        + Math.max(0, quantumMaterialStatisticalSource.temperatureDeltaKProxy) * 0.9
        + quantumMaterialResponseDerivativeSource.thermalFluxDerivativeBoostProxy * 0.09
        + quantumMaterialResponseDerivativeSource.temperatureDrive * 24
    ),
    radiativeHeatFluxBoost: clamp(
      thermalDrive * 280
        + reactionSource.sourceDrive * 120
        - reactionSource.coolingDrive * 40
        + phaseSource.heatingDrive * 58
        + phaseSource.latentHeatReleaseProxy * 24
        - phaseSource.coolingDrive * 28
        - phaseSource.latentHeatSinkProxy * 18
        + phaseEosBasis.source.thermalDrive * 42
        + Math.max(0, phaseEosBasis.source.phaseEnergyRateProxy) * 10
        - Math.max(0, -phaseEosBasis.source.phaseEnergyRateProxy) * 7
        + Math.max(0, sourceTerms.radiativeHeatFluxBoostProxy) * 0.28
        + quantumMaterialPropertySource.thermalFluxBoostProxy * 0.35
        + quantumMaterialStatisticalSource.opacityDriveProxy * 36
        + quantumMaterialStatisticalSource.ionizationDriveProxy * 42
        + quantumMaterialResponseDerivativeSource.thermalFluxDerivativeBoostProxy * 0.24
        + quantumMaterialResponseDerivativeSource.radiationDrive * 38,
      0,
      540
    ),
    thermalDiffusionBoost: thermalDrive * 0.045
      + reactionSource.sourceDrive * 0.015
      + phaseSource.phaseDriveProxy * 0.05
      + phaseSource.waterMoleculeFraction * phaseSource.phaseFractions.liquid * 0.018
      + phaseEosBasis.phase.phaseStabilityResidualProxy * 0.012
      + sourceTerms.phaseDriveDeltaProxy * 0.04
      + quantumMaterialPropertySource.mechanicalStiffnessDrive * 0.025
      + quantumMaterialStatisticalSource.degeneracyPressureDriveProxy * 0.018
      + Math.max(0, quantumMaterialStatisticalSource.pressureDriveProxy) * 0.012
      + quantumMaterialResponseDerivativeSource.mechanicalDerivativeDrive * 0.014
      + quantumMaterialResponseDerivativeSource.pressureDrive * 0.012
  };
}

function inputWithMolecularMaterialCoupling(input = {}) {
  const molecular = deriveMolecularMaterialCoupling(input);
  if (!molecular.active) return { input, molecular };
  const coupling = input.coupling || {};
  return {
    molecular,
    input: {
      ...input,
      thermalDiffusion: normalizeNumber(input.thermalDiffusion, 0.18, 0, 20) + molecular.thermalDiffusionBoost,
      coupling: {
        ...coupling,
        fireIntensity: clamp(
          normalizeNumber(coupling.fireIntensity, 0, 0, 1.5) + molecular.fireIntensityBoost,
          0,
          1.5
        ),
        flameTemperatureK: clamp(
          normalizeNumber(coupling.flameTemperatureK, 1060, 250, 4000) + molecular.flameTemperatureBoostK,
          250,
          4000
        ),
        radiativeHeatFlux: clamp(
          normalizeNumber(coupling.radiativeHeatFlux, 0, -5000, 5000) + molecular.radiativeHeatFluxBoost,
          -5000,
          5000
        ),
        molecularClosureDrive: molecular.thermalDrive
      }
    }
  };
}

function attachMolecularMaterialDiagnostics(diagnostics, molecular = {}, target = {}) {
  if (!molecular.active) return diagnostics;
  const beforeDiagnostics = target.beforeDiagnostics || {};
  const sourceBufferApplication = molecular.conservativeSourceBufferSchema === MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA
    ? createMolecularSourceBufferApplicationReport({
      targetSolverId: target.solverId || 'sph-material',
      targetStateKey: target.stateKey || null,
      targetLayer: 'mpm',
      targetSequence: target.sequence ?? null,
      backend: target.backend || null,
      sourceBuffer: molecular.conservativeSourceBuffer,
      timeSeconds: target.elapsedTime ?? 0,
      fields: [
        {
          field: 'averageTemperatureK',
          unit: 'K',
          dimensions: 'Theta',
          sourceTerm: 'temperatureDeltaKProxy',
          sourceValue: molecular.conservativeSourceBuffer?.temperatureDeltaKProxy,
          before: beforeDiagnostics.averageTemperatureK,
          after: diagnostics.averageTemperatureK
        },
        {
          field: 'liquidFraction',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'phaseDriveDeltaProxy',
          sourceValue: molecular.conservativeSourceBuffer?.phaseDriveDeltaProxy,
          before: beforeDiagnostics.liquidFraction,
          after: diagnostics.liquidFraction ?? diagnostics.phaseMix?.liquid
        },
        {
          field: 'vaporFraction',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'phaseDriveDeltaProxy',
          sourceValue: molecular.conservativeSourceBuffer?.phaseDriveDeltaProxy,
          before: beforeDiagnostics.vaporFraction,
          after: diagnostics.vaporFraction ?? diagnostics.phaseMix?.vapor
        },
        {
          field: 'fireContactFraction',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'radiativeHeatFluxBoostProxy',
          sourceValue: molecular.conservativeSourceBuffer?.radiativeHeatFluxBoostProxy,
          before: beforeDiagnostics.fireContactFraction,
          after: diagnostics.fireContactFraction
        },
        {
          field: 'phaseChangeRateProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'phaseDriveDeltaProxy',
          sourceValue: molecular.conservativeSourceBuffer?.phaseDriveDeltaProxy,
          before: beforeDiagnostics.phaseChangeRateProxy,
          after: diagnostics.phaseChangeRateProxy
        },
        {
          field: 'molecularQuantumMaterialPropertyThermalFluxBoostProxy',
          unit: 'W/m^2-proxy',
          dimensions: 'M T^-3',
          sourceTerm: 'quantumMaterialPropertyThermalFluxBoostProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialPropertyThermalFluxBoostProxy,
          before: beforeDiagnostics.molecularQuantumMaterialPropertyThermalFluxBoostProxy,
          after: molecular.quantumMaterialPropertyThermalFluxBoostProxy
        },
        {
          field: 'molecularQuantumMaterialPropertyPhaseDriveBoostProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialPropertyPhaseDriveBoostProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialPropertyPhaseDriveBoostProxy,
          before: beforeDiagnostics.molecularQuantumMaterialPropertyPhaseDriveBoostProxy,
          after: molecular.quantumMaterialPropertyPhaseDriveBoostProxy
        },
        {
          field: 'molecularQuantumMaterialPropertyElectricalDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialPropertyElectricalDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialPropertyElectricalDrive,
          before: beforeDiagnostics.molecularQuantumMaterialPropertyElectricalDrive,
          after: molecular.quantumMaterialPropertyElectricalDrive
        },
        {
          field: 'molecularQuantumMaterialPropertyOpticalHeatingDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialPropertyOpticalHeatingDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialPropertyOpticalHeatingDrive,
          before: beforeDiagnostics.molecularQuantumMaterialPropertyOpticalHeatingDrive,
          after: molecular.quantumMaterialPropertyOpticalHeatingDrive
        },
        {
          field: 'molecularQuantumMaterialPropertyMechanicalStiffnessDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialPropertyMechanicalStiffnessDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialPropertyMechanicalStiffnessDrive,
          before: beforeDiagnostics.molecularQuantumMaterialPropertyMechanicalStiffnessDrive,
          after: molecular.quantumMaterialPropertyMechanicalStiffnessDrive
        },
        {
          field: 'molecularQuantumMaterialPropertyDampingScale',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialPropertyDampingScale',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialPropertyDampingScale,
          before: beforeDiagnostics.molecularQuantumMaterialPropertyDampingScale,
          after: molecular.quantumMaterialPropertyDampingScale
        },
        {
          field: 'molecularQuantumMaterialStatisticalPressureDriveProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialStatisticalPressureDriveProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialStatisticalPressureDriveProxy,
          before: beforeDiagnostics.molecularQuantumMaterialStatisticalPressureDriveProxy,
          after: molecular.quantumMaterialStatisticalPressureDriveProxy
        },
        {
          field: 'molecularQuantumMaterialStatisticalOpacityDriveProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialStatisticalOpacityDriveProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialStatisticalOpacityDriveProxy,
          before: beforeDiagnostics.molecularQuantumMaterialStatisticalOpacityDriveProxy,
          after: molecular.quantumMaterialStatisticalOpacityDriveProxy
        },
        {
          field: 'molecularQuantumMaterialStatisticalIonizationDriveProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialStatisticalIonizationDriveProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialStatisticalIonizationDriveProxy,
          before: beforeDiagnostics.molecularQuantumMaterialStatisticalIonizationDriveProxy,
          after: molecular.quantumMaterialStatisticalIonizationDriveProxy
        },
        {
          field: 'molecularQuantumMaterialStatisticalDegeneracyPressureDriveProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialStatisticalDegeneracyPressureDriveProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialStatisticalDegeneracyPressureDriveProxy,
          before: beforeDiagnostics.molecularQuantumMaterialStatisticalDegeneracyPressureDriveProxy,
          after: molecular.quantumMaterialStatisticalDegeneracyPressureDriveProxy
        },
        {
          field: 'molecularQuantumMaterialStatisticalTemperatureDeltaKProxy',
          unit: 'K-proxy',
          dimensions: 'Theta',
          sourceTerm: 'quantumMaterialStatisticalTemperatureDeltaKProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialStatisticalTemperatureDeltaKProxy,
          before: beforeDiagnostics.molecularQuantumMaterialStatisticalTemperatureDeltaKProxy,
          after: molecular.quantumMaterialStatisticalTemperatureDeltaKProxy
        },
        {
          field: 'molecularQuantumMaterialStatisticalChargeDeltaProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialStatisticalChargeDeltaProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialStatisticalChargeDeltaProxy,
          before: beforeDiagnostics.molecularQuantumMaterialStatisticalChargeDeltaProxy,
          after: molecular.quantumMaterialStatisticalChargeDeltaProxy
        },
        {
          field: 'molecularQuantumMaterialStatisticalThermalDampingScale',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialStatisticalThermalDampingScale',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialStatisticalThermalDampingScale,
          before: beforeDiagnostics.molecularQuantumMaterialStatisticalThermalDampingScale,
          after: molecular.quantumMaterialStatisticalThermalDampingScale
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeTemperatureDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativeTemperatureDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeTemperatureDrive,
          before: beforeDiagnostics.molecularQuantumMaterialResponseDerivativeTemperatureDrive,
          after: molecular.quantumMaterialResponseDerivativeTemperatureDrive
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativePressureDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativePressureDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativePressureDrive,
          before: beforeDiagnostics.molecularQuantumMaterialResponseDerivativePressureDrive,
          after: molecular.quantumMaterialResponseDerivativePressureDrive
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeFieldDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativeFieldDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeFieldDrive,
          before: beforeDiagnostics.molecularQuantumMaterialResponseDerivativeFieldDrive,
          after: molecular.quantumMaterialResponseDerivativeFieldDrive
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeRadiationDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativeRadiationDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeRadiationDrive,
          before: beforeDiagnostics.molecularQuantumMaterialResponseDerivativeRadiationDrive,
          after: molecular.quantumMaterialResponseDerivativeRadiationDrive
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeThermalFluxBoostProxy',
          unit: 'W m-2 proxy',
          dimensions: 'M T-3 proxy',
          sourceTerm: 'quantumMaterialResponseDerivativeThermalFluxBoostProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeThermalFluxBoostProxy,
          before: beforeDiagnostics.molecularQuantumMaterialResponseDerivativeThermalFluxBoostProxy,
          after: molecular.quantumMaterialResponseDerivativeThermalFluxBoostProxy
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativePhaseDriveBoostProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativePhaseDriveBoostProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativePhaseDriveBoostProxy,
          before: beforeDiagnostics.molecularQuantumMaterialResponseDerivativePhaseDriveBoostProxy,
          after: molecular.quantumMaterialResponseDerivativePhaseDriveBoostProxy
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeElectricalDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativeElectricalDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeElectricalDrive,
          before: beforeDiagnostics.molecularQuantumMaterialResponseDerivativeElectricalDrive,
          after: molecular.quantumMaterialResponseDerivativeElectricalDrive
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeMechanicalDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativeMechanicalDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeMechanicalDrive,
          before: beforeDiagnostics.molecularQuantumMaterialResponseDerivativeMechanicalDrive,
          after: molecular.quantumMaterialResponseDerivativeMechanicalDrive
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeOpticalDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativeOpticalDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeOpticalDrive,
          before: beforeDiagnostics.molecularQuantumMaterialResponseDerivativeOpticalDrive,
          after: molecular.quantumMaterialResponseDerivativeOpticalDrive
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeDampingScale',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativeDampingScale',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeDampingScale,
          before: beforeDiagnostics.molecularQuantumMaterialResponseDerivativeDampingScale,
          after: molecular.quantumMaterialResponseDerivativeDampingScale
        }
      ]
    })
    : null;
  const sourceSink = createMolecularSourceSinkReport({
    sourceClosure: molecular.sourceClosure,
    molecular,
    targetSolverId: target.solverId || 'sph-material',
    targetStateKey: target.stateKey || null,
    targetLayer: 'mpm',
    targetField: 'molecularClosureRadiativeHeatFluxBoost',
    targetSequence: target.sequence ?? null,
    ambientTemperatureK: target.environment?.ambientTemperatureK,
    ambientPressurePa: target.environment?.ambientPressurePa,
    heatFluxProxy: molecular.radiativeHeatFluxBoost,
    thermalDrive: molecular.thermalDrive
  });
  return {
    ...diagnostics,
    molecularClosureApplied: true,
    molecularClosureSourceStateKey: molecular.sourceStateKey,
    molecularClosureHeatReleaseProxy: molecular.heatReleaseProxy,
    molecularClosureIonizationFraction: molecular.ionizationFraction,
    molecularClosureThermalDrive: molecular.thermalDrive,
    molecularClosureRadiativeHeatFluxBoost: molecular.radiativeHeatFluxBoost,
    molecularReactionSourceSchema: molecular.reactionSourceSchema,
    molecularReactionHeatSourceProxy: molecular.reactionHeatSourceProxy,
    molecularReactionSpeciesRateProxy: molecular.reactionSpeciesRateProxy,
    molecularReactionSourceDrive: molecular.reactionSourceDrive,
    molecularReactionCoolingDrive: molecular.reactionCoolingDrive,
    molecularReactionSourceEventIntensity: molecular.reactionSourceEventIntensity,
    molecularReactionSourceBondFormationRate: molecular.reactionSourceBondFormationRate,
    molecularReactionSourceBondBreakageRate: molecular.reactionSourceBondBreakageRate,
    molecularPhaseSource: molecular.phaseSource,
    molecularPhaseEosBasis: molecular.phaseEosBasis,
    molecularPhaseEosSchema: molecular.molecularPhaseEosSchema,
    molecularPhaseEosSpecificFreeEnergyProxy: molecular.molecularPhaseEosSpecificFreeEnergyProxy,
    molecularPhaseEosSpecificEnthalpyProxy: molecular.molecularPhaseEosSpecificEnthalpyProxy,
    molecularPhaseEosLatentHeatBudgetProxy: molecular.molecularPhaseEosLatentHeatBudgetProxy,
    molecularPhaseEosEnergyRateProxy: molecular.molecularPhaseEosEnergyRateProxy,
    molecularPhaseEosStabilityResidualProxy: molecular.molecularPhaseEosStabilityResidualProxy,
    molecularPhaseEosTemperatureDeltaKProxy: molecular.molecularPhaseEosTemperatureDeltaKProxy,
    molecularPhaseRegime: molecular.phaseRegime,
    molecularPhaseDriveProxy: molecular.molecularPhaseDriveProxy,
    molecularPhaseHeatingDrive: molecular.molecularPhaseHeatingDrive,
    molecularPhaseCoolingDrive: molecular.molecularPhaseCoolingDrive,
    molecularPhaseChangeRateProxy: molecular.molecularPhaseChangeRateProxy,
    molecularLatentHeatSinkProxy: molecular.molecularLatentHeatSinkProxy,
    molecularLatentHeatReleaseProxy: molecular.molecularLatentHeatReleaseProxy,
    molecularWaterMoleculeFraction: molecular.molecularWaterMoleculeFraction,
    molecularQuantumMaterialPropertySource: molecular.quantumMaterialPropertySource,
    molecularQuantumMaterialPropertyThermalFluxBoostProxy: molecular.quantumMaterialPropertyThermalFluxBoostProxy,
    molecularQuantumMaterialPropertyPhaseDriveBoostProxy: molecular.quantumMaterialPropertyPhaseDriveBoostProxy,
    molecularQuantumMaterialPropertyElectricalDrive: molecular.quantumMaterialPropertyElectricalDrive,
    molecularQuantumMaterialPropertyOpticalHeatingDrive: molecular.quantumMaterialPropertyOpticalHeatingDrive,
    molecularQuantumMaterialPropertyMechanicalStiffnessDrive: molecular.quantumMaterialPropertyMechanicalStiffnessDrive,
    molecularQuantumMaterialPropertyDampingScale: molecular.quantumMaterialPropertyDampingScale,
    molecularQuantumMaterialStatisticalSource: molecular.quantumMaterialStatisticalSource,
    molecularQuantumMaterialStatisticalSourceChannelCount: molecular.quantumMaterialStatisticalSourceChannelCount,
    molecularQuantumMaterialStatisticalPressureDriveProxy: molecular.quantumMaterialStatisticalPressureDriveProxy,
    molecularQuantumMaterialStatisticalOpacityDriveProxy: molecular.quantumMaterialStatisticalOpacityDriveProxy,
    molecularQuantumMaterialStatisticalIonizationDriveProxy: molecular.quantumMaterialStatisticalIonizationDriveProxy,
    molecularQuantumMaterialStatisticalDegeneracyPressureDriveProxy: molecular.quantumMaterialStatisticalDegeneracyPressureDriveProxy,
    molecularQuantumMaterialStatisticalTemperatureDeltaKProxy: molecular.quantumMaterialStatisticalTemperatureDeltaKProxy,
    molecularQuantumMaterialStatisticalChargeDeltaProxy: molecular.quantumMaterialStatisticalChargeDeltaProxy,
    molecularQuantumMaterialStatisticalThermalDampingScale: molecular.quantumMaterialStatisticalThermalDampingScale,
    molecularQuantumMaterialResponseDerivativeSource: molecular.quantumMaterialResponseDerivativeSource,
    molecularQuantumMaterialResponseDerivativeTemperatureDrive: molecular.quantumMaterialResponseDerivativeTemperatureDrive,
    molecularQuantumMaterialResponseDerivativePressureDrive: molecular.quantumMaterialResponseDerivativePressureDrive,
    molecularQuantumMaterialResponseDerivativeFieldDrive: molecular.quantumMaterialResponseDerivativeFieldDrive,
    molecularQuantumMaterialResponseDerivativeRadiationDrive: molecular.quantumMaterialResponseDerivativeRadiationDrive,
    molecularQuantumMaterialResponseDerivativeThermalFluxBoostProxy: molecular.quantumMaterialResponseDerivativeThermalFluxBoostProxy,
    molecularQuantumMaterialResponseDerivativePhaseDriveBoostProxy: molecular.quantumMaterialResponseDerivativePhaseDriveBoostProxy,
    molecularQuantumMaterialResponseDerivativeElectricalDrive: molecular.quantumMaterialResponseDerivativeElectricalDrive,
    molecularQuantumMaterialResponseDerivativeMechanicalDrive: molecular.quantumMaterialResponseDerivativeMechanicalDrive,
    molecularQuantumMaterialResponseDerivativeOpticalDrive: molecular.quantumMaterialResponseDerivativeOpticalDrive,
    molecularQuantumMaterialResponseDerivativeDampingScale: molecular.quantumMaterialResponseDerivativeDampingScale,
    molecularTargetSourceIntakeSchema: molecular.targetSourceIntakeSchema,
    molecularTargetSourceIntakeSequence: molecular.targetSourceIntakeSequence,
    molecularTargetSourceIntakeThermalDrive: molecular.targetSourceIntakeThermalDrive,
    molecularConservativeSourceBufferSchema: molecular.conservativeSourceBufferSchema,
    molecularConservativeSourceBufferSequence: molecular.conservativeSourceBufferSequence,
    molecularConservativeSourceBufferThermalDrive: molecular.conservativeSourceBufferThermalDrive,
    molecularConservativeSourceBufferResidual: molecular.conservativeSourceBufferResidual,
    molecularConservativeSourceBufferVectorStride: molecular.conservativeSourceBufferVectorStride,
    molecularSourceBufferApplication: sourceBufferApplication,
    molecularSourceBufferApplicationSchema: sourceBufferApplication?.schema || null,
    molecularSourceBufferApplicationStatus: sourceBufferApplication?.status || null,
    molecularSourceBufferApplicationApplied: sourceBufferApplication?.applied === true,
    molecularSourceBufferApplicationAppliedFieldCount: sourceBufferApplication?.appliedFieldCount || 0,
    molecularSourceBufferApplicationSourceTermCount: sourceBufferApplication?.sourceTermCount || 0,
    molecularSourceBufferApplicationThermalDrive: sourceBufferApplication?.thermalDrive || 0,
    molecularSourceBufferApplicationResidual: sourceBufferApplication?.applicationResidualProxy || 0,
    molecularSourceBufferApplicationMaxDelta: sourceBufferApplication?.maxAbsFieldDeltaProxy || 0,
    molecularSourceSink: sourceSink
  };
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

function resolveSimParams(input = {}) {
  const environment = input.environment || {};
  const coupling = input.coupling || {};
  return {
    dt: clamp(normalizeNumber(input.dt, 1 / 120), 0, 0.05),
    smoothingRadius: normalizeNumber(input.smoothingRadius, 0.58, 0.05, 5),
    pressureScale: normalizeNumber(input.pressureScale, 10.5, 0, 1000),
    viscosity: normalizeNumber(input.viscosity, 1.35, 0, 50),
    thermalDiffusion: normalizeNumber(input.thermalDiffusion, 0.18, 0, 20),
    gravity: normalizeNumber(environment.gravityMps2, input.gravityMps2 ?? 9.8, 0, 100),
    damping: clamp(normalizeNumber(input.damping, 0.988), 0, 1),
    ambientTemp: normalizeNumber(environment.ambientTemperatureK, 294, 1, 20000),
    ambientPressurePa: normalizeNumber(environment.ambientPressurePa, 101325, 1, 1e12),
    fireCenter: input.fireCenter || [2.4, -0.45, 0],
    fireIntensity: clamp(normalizeNumber(coupling.fireIntensity, 0.78), 0, 1.5),
    flameTemp: normalizeNumber(coupling.flameTemperatureK, 1060, 250, 4000),
    groundY: normalizeNumber(input.groundY, -1.08, -100, 100),
    ruptured: coupling.ruptured === true ? 1 : 0,
    center: input.balloonCenter || [-2.1, 2.7, 0],
    shellRadius: normalizeNumber(input.shellRadius, 1.18, 0.1, 10),
    membraneIntegrity: clamp(normalizeNumber(coupling.membraneIntegrity, 1), 0, 1),
    radiativeHeatFlux: normalizeNumber(coupling.radiativeHeatFlux, 0, -5000, 5000),
    spillImpulse: coupling.ruptured === true
      ? clamp(normalizeNumber(coupling.spillImpulse, 0.6), 0, 5)
      : 0,
    ruptureAge: normalizeNumber(coupling.ruptureAge, 0, 0, 600),
    bounds: input.bounds || [5.8, 4.2, 4.8]
  };
}

export function makeSphMaterialInitialState({
  count = 128,
  seed = 20260529,
  center = [-2.1, 2.7, 0],
  radius = 1.05,
  environment = {}
} = {}) {
  const safeCount = normalizeInteger(count, 128, 1, 512);
  const safeRadius = normalizeNumber(radius, 1.05, 0.01, 20);
  const rng = createRng(seed);
  const positions = [];
  const velocities = [];
  const masses = [];
  const temperatures = [];
  const phases = [];
  const densities = [];
  const ambient = normalizeNumber(environment.ambientTemperatureK, 294, 1, 20000);

  for (let i = 0; i < safeCount; i += 1) {
    const theta = rng() * Math.PI * 2;
    const u = rng() * 2 - 1;
    const r = Math.cbrt(rng()) * safeRadius * 0.86;
    const w = Math.sqrt(Math.max(0, 1 - u * u));
    positions.push(
      center[0] + Math.cos(theta) * w * r,
      center[1] + u * r,
      center[2] + Math.sin(theta) * w * r
    );
    velocities.push((rng() - 0.5) * 0.04, (rng() - 0.5) * 0.04, (rng() - 0.5) * 0.04);
    masses.push(1 / safeCount);
    temperatures.push(ambient + (rng() - 0.5) * 1.5);
    phases.push(0);
    densities.push(0);
  }

  return {
    schema: SPH_MATERIAL_STATE_SCHEMA,
    sequence: 0,
    elapsedTime: 0,
    positions,
    velocities,
    masses,
    temperatures,
    phases,
    densities
  };
}

function normalizeState(source = {}) {
  const candidate = source.state || source;
  if (!candidate.positions) {
    return makeSphMaterialInitialState(source);
  }
  const count = normalizeInteger(
    candidate.count || candidate.masses?.length || Math.floor(candidate.positions.length / 3),
    128,
    1,
    2048
  );
  return {
    schema: SPH_MATERIAL_STATE_SCHEMA,
    sequence: normalizeInteger(candidate.sequence, 0, 0),
    elapsedTime: normalizeNumber(candidate.elapsedTime, 0, 0),
    positions: toFiniteArray(candidate.positions, count * 3, 'positions'),
    velocities: toFiniteArray(candidate.velocities, count * 3, 'velocities'),
    masses: toFiniteArray(candidate.masses, count, 'masses', 1 / count),
    temperatures: toFiniteArray(candidate.temperatures, count, 'temperatures', 294),
    phases: toFiniteArray(candidate.phases, count, 'phases', 0).map((value) => clamp(value, 0, 1)),
    densities: toFiniteArray(candidate.densities, count, 'densities', 0)
  };
}

function cloneState(state) {
  return {
    schema: SPH_MATERIAL_STATE_SCHEMA,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    positions: [...state.positions],
    velocities: [...state.velocities],
    masses: [...state.masses],
    temperatures: [...state.temperatures],
    phases: [...state.phases],
    densities: [...state.densities]
  };
}

function particleDataFromState(state) {
  const count = state.masses.length;
  const data = new Float32Array(count * PARTICLE_FLOATS);
  for (let i = 0; i < count; i += 1) {
    const vec = i * 3;
    const dst = i * PARTICLE_FLOATS;
    data[dst] = state.positions[vec];
    data[dst + 1] = state.positions[vec + 1];
    data[dst + 2] = state.positions[vec + 2];
    data[dst + 3] = state.masses[i];
    data[dst + 4] = state.velocities[vec];
    data[dst + 5] = state.velocities[vec + 1];
    data[dst + 6] = state.velocities[vec + 2];
    data[dst + 7] = state.temperatures[i];
    data[dst + 8] = state.phases[i];
    data[dst + 9] = state.densities[i];
    data[dst + 10] = 0;
    data[dst + 11] = 0;
  }
  return data;
}

function applyParticleDataToState(state, data) {
  const count = state.masses.length;
  for (let i = 0; i < count; i += 1) {
    const vec = i * 3;
    const src = i * PARTICLE_FLOATS;
    state.positions[vec] = data[src];
    state.positions[vec + 1] = data[src + 1];
    state.positions[vec + 2] = data[src + 2];
    state.masses[i] = data[src + 3];
    state.velocities[vec] = data[src + 4];
    state.velocities[vec + 1] = data[src + 5];
    state.velocities[vec + 2] = data[src + 6];
    state.temperatures[i] = data[src + 7];
    state.phases[i] = clamp(data[src + 8], 0, 1);
    state.densities[i] = data[src + 9];
  }
}

function waterPhaseFractionsFromSample(temperatureK, vaporValue) {
  const vapor = clamp(normalizeNumber(vaporValue, 0), 0, 1);
  const nonVapor = clamp(1 - vapor, 0, 1);
  const freezeWeight = clamp((WATER_FREEZE_K - normalizeNumber(temperatureK, 294)) / 42, 0, 1);
  const boilingWeight = clamp((normalizeNumber(temperatureK, 294) - WATER_BOIL_K) / 95, 0, 1);
  const solid = clamp(nonVapor * freezeWeight, 0, 1);
  const liquid = clamp(1 - vapor - solid, 0, 1);
  return {
    solid,
    liquid,
    vapor,
    nonVapor: clamp(solid + liquid, 0, 1),
    freezeWeight,
    boilingWeight
  };
}

function classifyWaterPhaseRegime(phaseMix) {
  const solid = Number(phaseMix.solid || 0);
  const liquid = Number(phaseMix.liquid || 0);
  const vapor = Number(phaseMix.vapor || 0);
  const dominant = Math.max(solid, liquid, vapor);
  const activeCount = [solid, liquid, vapor].filter((value) => value > 0.08).length;
  if (activeCount > 1) return 'mixed';
  if (dominant === solid) return 'solid';
  if (dominant === vapor) return 'vapor';
  return 'liquid';
}

function paramsToArray(params) {
  return new Float32Array([
    0,
    params.dt,
    params.smoothingRadius,
    params.pressureScale,
    params.viscosity,
    params.thermalDiffusion,
    params.gravity,
    params.damping,
    params.fireCenter[0] || 0,
    params.fireCenter[1] || 0,
    params.fireCenter[2] || 0,
    params.fireIntensity,
    params.ambientTemp,
    params.flameTemp,
    params.groundY,
    params.ruptured,
    params.center[0] || 0,
    params.center[1] || 0,
    params.center[2] || 0,
    params.shellRadius,
    params.membraneIntegrity,
    params.bounds[0] || 6,
    params.bounds[1] || 4,
    params.bounds[2] || 5,
    params.radiativeHeatFlux,
    params.spillImpulse,
    params.ruptureAge,
    0
  ]);
}

class SphMaterialWebGpuRuntime {
  constructor(stateKey) {
    this.stateKey = stateKey;
    this.device = null;
    this.pipeline = null;
    this.currentBuffer = null;
    this.nextBuffer = null;
    this.readBuffer = null;
    this.paramBuffer = null;
    this.count = 0;
    this.submittedSteps = 0;
    this.lastError = null;
  }

  async initialize(count) {
    if (this.device && this.count === count) return;
    const gpu = globalThis.navigator?.gpu;
    if (!gpu) throw new Error('WebGPU unavailable for SPH material worker');
    const usage = globalThis.GPUBufferUsage;
    if (!usage) throw new Error('GPUBufferUsage unavailable for SPH material worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for SPH material worker');
    this.device = await adapter.requestDevice();
    this.count = count;

    const byteLength = count * PARTICLE_FLOATS * Float32Array.BYTES_PER_ELEMENT;
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
        module: this.device.createShaderModule({ code: SPH_SHADER }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`SPH material WebGPU validation: ${validationError.message || validationError}`);
    }
    this.device.lost?.then((info) => {
      this.lastError = info?.message || info?.reason || 'SPH material WebGPU device lost';
      gpuDisabledReasons.set(this.stateKey, this.lastError);
    });
  }

  async step(state, params) {
    await this.initialize(state.masses.length);
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for SPH material worker');

    const particleData = particleDataFromState(state);
    const paramData = paramsToArray(params);
    paramData[0] = state.masses.length;
    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.currentBuffer } },
        { binding: 1, resource: { buffer: this.nextBuffer } },
        { binding: 2, resource: { buffer: this.paramBuffer } }
      ]
    });

    this.device.queue.writeBuffer(this.currentBuffer, 0, particleData);
    this.device.queue.writeBuffer(this.paramBuffer, 0, paramData);
    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(Math.ceil(state.masses.length / WORKGROUP_SIZE));
    pass.end();
    encoder.copyBufferToBuffer(this.nextBuffer, 0, this.readBuffer, 0, particleData.byteLength);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone?.();
    await this.readBuffer.mapAsync(mapMode.READ);
    const mapped = this.readBuffer.getMappedRange();
    const result = new Float32Array(mapped).slice();
    this.readBuffer.unmap();
    applyParticleDataToState(state, result);
    state.elapsedTime += params.dt;
    state.sequence += 1;
    this.submittedSteps += 1;
    return {
      backend: 'webgpu-sph-material',
      webgpuStatus: {
        stateKey: this.stateKey,
        particleCount: state.masses.length,
        submittedSteps: this.submittedSteps
      }
    };
  }
}

function advanceCpuSphMaterial(state, input = {}) {
  const params = resolveSimParams(input);
  const count = state.masses.length;
  const nextPositions = [...state.positions];
  const nextVelocities = [...state.velocities];
  const nextTemperatures = [...state.temperatures];
  const nextPhases = [...state.phases];
  const nextDensities = new Array(count).fill(0);
  const h = params.smoothingRadius;

  for (let i = 0; i < count; i += 1) {
    const oi = i * 3;
    const px = state.positions[oi];
    const py = state.positions[oi + 1];
    const pz = state.positions[oi + 2];
    let vx = state.velocities[oi];
    let vy = state.velocities[oi + 1];
    let vz = state.velocities[oi + 2];
    let ax = 0;
    let ay = -params.gravity * 0.08;
    let az = 0;
    let heatRate = (params.ambientTemp - state.temperatures[i]) * 0.08;
    let density = 0;

    for (let j = 0; j < count; j += 1) {
      if (i === j) continue;
      const oj = j * 3;
      const dx = px - state.positions[oj];
      const dy = py - state.positions[oj + 1];
      const dz = pz - state.positions[oj + 2];
      const distance = Math.hypot(dx, dy, dz) + 1e-5;
      if (distance >= h) continue;
      const q = 1 - distance / h;
      const inv = 1 / distance;
      const mass = state.masses[j];
      const pressure = q * q * params.pressureScale * mass;
      density += q * q * q * mass;
      ax += dx * inv * pressure;
      ay += dy * inv * pressure;
      az += dz * inv * pressure;
      ax += (state.velocities[oj] - vx) * q * params.viscosity;
      ay += (state.velocities[oj + 1] - vy) * q * params.viscosity;
      az += (state.velocities[oj + 2] - vz) * q * params.viscosity;
      heatRate += (state.temperatures[j] - state.temperatures[i]) * q * params.thermalDiffusion;
    }

    const fx = px - (params.fireCenter[0] || 0);
    const fy = py - (params.fireCenter[1] || 0);
    const fz = pz - (params.fireCenter[2] || 0);
    const fireDrive = Math.exp(-(fx * fx + fy * fy + fz * fz) * 0.75) * params.fireIntensity;
    const radiativeDrive = params.radiativeHeatFlux * (0.008 + Math.exp(-(fx * fx + fy * fy + fz * fz) * 0.22) * 0.012);
    heatRate += (params.flameTemp - state.temperatures[i]) * fireDrive * 0.95;
    heatRate += radiativeDrive;
    ay += state.phases[i] * fireDrive * 1.6;

    const spillDrive = params.ruptured > 0.5
      ? params.spillImpulse * (0.42 + Math.exp(-params.ruptureAge * 1.2) * 0.58)
      : 0;
    if (spillDrive > 0.0001) {
      const cx = params.center[0] || 0;
      const cy = params.center[1] || 0;
      const cz = params.center[2] || 0;
      const tx = params.fireCenter[0] || 0;
      const ty = params.groundY;
      const tz = params.fireCenter[2] || 0;
      const sx = tx - cx;
      const sy = ty - cy;
      const sz = tz - cz;
      const invSpill = 1 / (Math.hypot(sx, sy, sz) + 1e-5);
      const dx = sx * invSpill;
      const dy = sy * invSpill;
      const dz = sz * invSpill;
      vx += dx * spillDrive * params.dt * 18;
      vy += dy * spillDrive * params.dt * 18;
      vz += dz * spillDrive * params.dt * 18;
      ax += dx * spillDrive * 2.5;
      ay += dy * spillDrive * 2.5;
      az += dz * spillDrive * 2.5;
    }

    let temperature = clamp(state.temperatures[i] + heatRate * params.dt, params.ambientTemp, 1400);
    const vaporizationStep = Math.max(temperature - WATER_BOIL_K, 0) * params.dt * 0.0014 * (1 - state.phases[i]);
    const condensationStep = Math.max(WATER_BOIL_K - temperature, 0) * params.dt * 0.00022 * state.phases[i];
    const freezeReleaseStep = Math.max(WATER_FREEZE_K - temperature, 0) * params.dt * 0.00035 * (1 - state.phases[i]);
    let phase = clamp(state.phases[i] + vaporizationStep - condensationStep, 0, 1);
    temperature = clamp(
      temperature - vaporizationStep * 72 + condensationStep * 12 + freezeReleaseStep * 18,
      params.ambientTemp,
      1400
    );

    vx = (vx + ax * params.dt) * params.damping;
    vy = (vy + ay * params.dt) * params.damping;
    vz = (vz + az * params.dt) * params.damping;
    let nx = px + vx * params.dt;
    let ny = py + vy * params.dt;
    let nz = pz + vz * params.dt;

    if (params.ruptured < 0.5) {
      const cx = params.center[0] || 0;
      const cy = params.center[1] || 0;
      const cz = params.center[2] || 0;
      const shellRadius = Math.max(params.shellRadius * (0.92 + (1 - params.membraneIntegrity) * 0.1), 0.1);
      const sx = nx - cx;
      const sy = ny - cy;
      const sz = nz - cz;
      const distance = Math.hypot(sx, sy, sz) + 1e-5;
      if (distance > shellRadius) {
        const inv = 1 / distance;
        const dx = sx * inv;
        const dy = sy * inv;
        const dz = sz * inv;
        nx = cx + dx * shellRadius;
        ny = cy + dy * shellRadius;
        nz = cz + dz * shellRadius;
        const outward = vx * dx + vy * dy + vz * dz;
        if (outward > 0) {
          vx -= dx * outward * 1.35;
          vy -= dy * outward * 1.35;
          vz -= dz * outward * 1.35;
        }
      }
    } else {
      if (spillDrive > 0.0001) {
        const cx = params.center[0] || 0;
        const cy = params.center[1] || 0;
        const cz = params.center[2] || 0;
        const tx = params.fireCenter[0] || 0;
        const ty = params.groundY + 0.04;
        const tz = params.fireCenter[2] || 0;
        const sx = tx - cx;
        const sy = ty - cy;
        const sz = tz - cz;
        const invPath = 1 / (Math.hypot(sx, sy, sz) + 1e-5);
        const pathX = sx * invPath;
        const pathZ = sz * invPath;
        const sideInv = 1 / (Math.hypot(-pathZ, pathX) + 1e-5);
        const sideX = -pathZ * sideInv;
        const sideZ = pathX * sideInv;
        const lane = ((i * 0.61803398875) % 1 + 1) % 1;
        const sideJitter = ((i * 0.754877666) % 1 + 1) % 1;
        const side = (sideJitter - 0.5) * (0.26 - lane * 0.12);
        const pathT = clamp(params.ruptureAge * 0.95 + spillDrive * 0.2 + lane * 0.28, 0, 1);
        const arc = Math.sin(pathT * Math.PI) * 0.62;
        const streamX = cx + sx * pathT + sideX * side;
        const streamY = cy + sy * pathT + arc;
        const streamZ = cz + sz * pathT + sideZ * side;
        const blend = clamp(0.08 + spillDrive * 0.12, 0, 0.32);
        const beforeX = nx;
        const beforeY = ny;
        const beforeZ = nz;
        nx += (streamX - nx) * blend;
        ny += (streamY - ny) * blend;
        nz += (streamZ - nz) * blend;
        vx += ((nx - beforeX) / Math.max(params.dt, 0.001)) * 0.18;
        vy += ((ny - beforeY) / Math.max(params.dt, 0.001)) * 0.18;
        vz += ((nz - beforeZ) / Math.max(params.dt, 0.001)) * 0.18;
      }
      if (ny < params.groundY) {
        ny = params.groundY;
        if (vy < 0) {
          vy = -vy * 0.28;
          vx *= 0.84;
          vz *= 0.84;
        }
      }
      const bx = params.bounds[0] || 6;
      const by = params.bounds[1] || 4;
      const bz = params.bounds[2] || 5;
      if (Math.abs(nx) > bx) {
        nx = clamp(nx, -bx, bx);
        vx = -vx * 0.35;
      }
      if (Math.abs(ny) > by) {
        ny = clamp(ny, -by, by);
        vy = -vy * 0.35;
      }
      if (Math.abs(nz) > bz) {
        nz = clamp(nz, -bz, bz);
        vz = -vz * 0.35;
      }
    }

    nextPositions[oi] = nx;
    nextPositions[oi + 1] = ny;
    nextPositions[oi + 2] = nz;
    nextVelocities[oi] = vx;
    nextVelocities[oi + 1] = vy;
    nextVelocities[oi + 2] = vz;
    nextTemperatures[i] = temperature;
    nextPhases[i] = phase;
    nextDensities[i] = density;
  }

  state.positions = nextPositions;
  state.velocities = nextVelocities;
  state.temperatures = nextTemperatures;
  state.phases = nextPhases;
  state.densities = nextDensities;
  state.elapsedTime += params.dt;
  state.sequence += 1;
  return state;
}

function computeTotalMass(state) {
  return state.masses.reduce((sum, value) => sum + value, 0);
}

export function computeSphMaterialDiagnostics(input = {}) {
  const state = normalizeState(input);
  const fireCenter = input.fireCenter || input.coupling?.fireCenter || [2.4, -0.45, 0];
  const fireContactRadius = normalizeNumber(input.fireContactRadius, 1.35, 0.05, 20);
  const groundY = normalizeNumber(input.groundY, -1.08, -100, 100);
  const coupling = input.coupling || {};
  const spillImpulse = coupling.ruptured === true
    ? clamp(normalizeNumber(coupling.spillImpulse, 0.6), 0, 5)
    : 0;
  const count = state.masses.length;
  const totalMass = computeTotalMass(state);
  const centerOfMass = [0, 0, 0];
  const momentum = [0, 0, 0];
  let kineticEnergy = 0;
  let averageTemperatureK = 0;
  let solidFraction = 0;
  let liquidFraction = 0;
  let vaporFraction = 0;
  let boilingFraction = 0;
  let freezingFraction = 0;
  let phaseChangeRateProxy = 0;
  let latentHeatSinkProxy = 0;
  let latentHeatReleaseProxy = 0;
  let meanSpecificEnthalpyProxy = 0;
  let fireContactMass = 0;
  let hotContactMass = 0;
  let maxSpeed = 0;
  let densityMean = 0;
  let groundContactMass = 0;
  const radiusSq = fireContactRadius * fireContactRadius;

  for (let i = 0; i < count; i += 1) {
    const offset = i * 3;
    const mass = state.masses[i];
    const px = state.positions[offset];
    const py = state.positions[offset + 1];
    const pz = state.positions[offset + 2];
    const vx = state.velocities[offset];
    const vy = state.velocities[offset + 1];
    const vz = state.velocities[offset + 2];
    const speed = Math.hypot(vx, vy, vz);
    const temperatureK = normalizeNumber(state.temperatures[i], 294);
    const phase = waterPhaseFractionsFromSample(temperatureK, state.phases[i]);
    const vaporizationRate = Math.max(temperatureK - WATER_BOIL_K, 0) * 0.0014 * phase.liquid;
    const condensationRate = Math.max(WATER_BOIL_K - temperatureK, 0) * 0.00022 * phase.vapor;
    const freezingRate = Math.max(WATER_FREEZE_K - temperatureK, 0) * 0.00035 * phase.liquid;
    const meltingRate = Math.max(temperatureK - WATER_FREEZE_K, 0) * 0.00008 * phase.solid;
    const specificEnthalpyProxy = WATER_HEAT_CAPACITY_PROXY_KJ_KG_K * (temperatureK - WATER_FREEZE_K)
      + phase.liquid * WATER_LATENT_FUSION_PROXY_KJ_KG
      + phase.vapor * (WATER_LATENT_FUSION_PROXY_KJ_KG + WATER_LATENT_VAPORIZATION_PROXY_KJ_KG);
    centerOfMass[0] += px * mass;
    centerOfMass[1] += py * mass;
    centerOfMass[2] += pz * mass;
    momentum[0] += vx * mass;
    momentum[1] += vy * mass;
    momentum[2] += vz * mass;
    kineticEnergy += 0.5 * mass * speed * speed;
    averageTemperatureK += temperatureK;
    solidFraction += phase.solid;
    liquidFraction += phase.liquid;
    vaporFraction += phase.vapor;
    boilingFraction += phase.liquid * phase.boilingWeight;
    freezingFraction += phase.liquid * phase.freezeWeight;
    phaseChangeRateProxy += Math.abs(vaporizationRate - condensationRate) + Math.abs(freezingRate - meltingRate);
    latentHeatSinkProxy += mass * (
      vaporizationRate * WATER_LATENT_VAPORIZATION_PROXY_KJ_KG
      + meltingRate * WATER_LATENT_FUSION_PROXY_KJ_KG
    );
    latentHeatReleaseProxy += mass * (
      condensationRate * WATER_LATENT_VAPORIZATION_PROXY_KJ_KG
      + freezingRate * WATER_LATENT_FUSION_PROXY_KJ_KG
    );
    meanSpecificEnthalpyProxy += mass * specificEnthalpyProxy;
    densityMean += state.densities[i];
    maxSpeed = Math.max(maxSpeed, speed);
    if (py <= groundY + 0.08) {
      groundContactMass += mass * phase.nonVapor;
    }
    const dx = px - (fireCenter[0] || 0);
    const dy = py - (fireCenter[1] || 0);
    const dz = pz - (fireCenter[2] || 0);
    const distSq = dx * dx + dy * dy + dz * dz;
    if (distSq <= radiusSq) {
      const contactWeight = 1 - Math.sqrt(distSq) / fireContactRadius;
      const liquidWeight = clamp(phase.liquid + phase.solid * 0.35, 0, 1);
      const weightedMass = mass * contactWeight * liquidWeight;
      fireContactMass += weightedMass;
      if (temperatureK > 323.15) {
        hotContactMass += weightedMass;
      }
    }
  }

  if (totalMass > 0) {
    centerOfMass[0] /= totalMass;
    centerOfMass[1] /= totalMass;
    centerOfMass[2] /= totalMass;
  }

  averageTemperatureK /= Math.max(1, count);
  solidFraction /= Math.max(1, count);
  liquidFraction /= Math.max(1, count);
  vaporFraction /= Math.max(1, count);
  boilingFraction /= Math.max(1, count);
  freezingFraction /= Math.max(1, count);
  phaseChangeRateProxy /= Math.max(1, count);
  densityMean /= Math.max(1, count);
  if (totalMass > 0) {
    latentHeatSinkProxy /= totalMass;
    latentHeatReleaseProxy /= totalMass;
    meanSpecificEnthalpyProxy /= totalMass;
  }
  const phaseMix = {
    solid: clamp(solidFraction, 0, 1),
    liquid: clamp(liquidFraction, 0, 1),
    vapor: clamp(vaporFraction, 0, 1)
  };
  const centerToFireDistance = Math.hypot(
    centerOfMass[0] - (fireCenter[0] || 0),
    centerOfMass[1] - (fireCenter[1] || 0),
    centerOfMass[2] - (fireCenter[2] || 0)
  );

  return {
    schema: 'peercompute.multiscale.sph-material.diagnostics.v0',
    count,
    totalMass,
    centerOfMass,
    momentum,
    kineticEnergy,
    averageTemperatureK,
    iceFraction: phaseMix.solid,
    vaporFraction,
    liquidFraction: phaseMix.liquid,
    boilingFraction: clamp(boilingFraction, 0, 1),
    freezingFraction: clamp(freezingFraction, 0, 1),
    phaseChangeRateProxy,
    latentHeatSinkProxy,
    latentHeatReleaseProxy,
    meanSpecificEnthalpyProxy,
    phaseRegime: classifyWaterPhaseRegime(phaseMix),
    fireContactFraction: totalMass > 0 ? clamp(fireContactMass / totalMass, 0, 1) : 0,
    hotContactFraction: totalMass > 0 ? clamp(hotContactMass / totalMass, 0, 1) : 0,
    coolingPotential: totalMass > 0 ? clamp((fireContactMass - hotContactMass * 0.45) / totalMass, 0, 1) : 0,
    groundContactFraction: totalMass > 0 ? clamp(groundContactMass / totalMass, 0, 1) : 0,
    spillImpulse,
    centerToFireDistance,
    densityMean,
    maxSpeed,
    phaseMix
  };
}

function conservationFromBaseline(diagnostics, baseline) {
  if (!baseline) {
    return {
      massDrift: 0,
      momentumDrift: 0,
      kineticEnergyDrift: 0
    };
  }
  return {
    massDrift: diagnostics.totalMass - baseline.totalMass,
    momentumDrift: Math.hypot(
      diagnostics.momentum[0] - baseline.momentum[0],
      diagnostics.momentum[1] - baseline.momentum[1],
      diagnostics.momentum[2] - baseline.momentum[2]
    ),
    kineticEnergyDrift: diagnostics.kineticEnergy - baseline.kineticEnergy,
    vaporFractionDrift: diagnostics.vaporFraction - baseline.vaporFraction,
    phaseChangeRateProxy: diagnostics.phaseChangeRateProxy,
    note: 'Open material patch exchanges heat, gravity, and boundary impulse with environment.'
  };
}

async function advanceSphMaterialState(state, { stateKey, input }) {
  const params = resolveSimParams(input);
  const wantsWebGpu = input.enableWebGPU !== false && input.webgpu !== false;
  const webGpuEligible = wantsWebGpu
    && state.masses.length <= normalizeInteger(
      input.webgpuMaxParticles,
      SPH_MATERIAL_WEBGPU_MAX_PARTICLES,
      1,
      16384
    )
    && !gpuDisabledReasons.has(stateKey);

  if (webGpuEligible) {
    try {
      let runtime = gpuRuntimes.get(stateKey);
      if (!runtime) {
        runtime = new SphMaterialWebGpuRuntime(stateKey);
        gpuRuntimes.set(stateKey, runtime);
      }
      return {
        ...(await runtime.step(state, params)),
        webgpuError: null
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      gpuDisabledReasons.set(stateKey, message);
    }
  }

  advanceCpuSphMaterial(state, input);
  return {
    backend: 'cpu-sph-material',
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

function createDeltaPayload({ payload, stateKey, state, diagnostics, conservation, backend, webgpuStatus, webgpuError }) {
  return {
    schema: payload.solver?.warmDelta?.schema || SPH_MATERIAL_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'sph-material',
    stateKey,
    backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    particleCount: state.masses.length,
    state: cloneState(state),
    diagnostics,
    conservation,
    webgpuStatus,
    webgpuError,
    units: {
      position: 'reduced m',
      velocity: 'reduced m/s',
      temperature: 'K',
      mass: 'reduced kg'
    }
  };
}

export function resetSphMaterial(input = {}) {
  if (input.stateKey || input.taskId) {
    const key = input.stateKey || input.taskId;
    states.delete(key);
    baselines.delete(key);
    gpuRuntimes.delete(key);
    gpuDisabledReasons.delete(key);
  } else {
    states.clear();
    baselines.clear();
    gpuRuntimes.clear();
    gpuDisabledReasons.clear();
  }
  return {
    ok: true,
    schema: SPH_MATERIAL_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

export async function stepSphMaterial(payload = {}) {
  const resolved = resolveInput(payload);
  const { input, stateKey } = resolved;
  const coupled = inputWithMolecularMaterialCoupling(input);
  const effectiveInput = coupled.input;
  const requestedReset = input.reset === true;
  const state = effectiveInput.state || requestedReset || !states.has(stateKey)
    ? normalizeState(effectiveInput.state || makeSphMaterialInitialState(effectiveInput))
    : cloneState(states.get(stateKey));

  if (!baselines.has(stateKey) || requestedReset || effectiveInput.state) {
    baselines.set(stateKey, computeSphMaterialDiagnostics({
      state,
      fireCenter: effectiveInput.fireCenter,
      fireContactRadius: effectiveInput.fireContactRadius,
      groundY: effectiveInput.groundY,
      coupling: effectiveInput.coupling
    }));
  }

  const beforeDiagnostics = computeSphMaterialDiagnostics({
    state: cloneState(state),
    fireCenter: effectiveInput.fireCenter,
    fireContactRadius: effectiveInput.fireContactRadius,
    groundY: effectiveInput.groundY,
    coupling: effectiveInput.coupling
  });
  const advanceResult = await advanceSphMaterialState(state, { stateKey, input: effectiveInput });
  states.set(stateKey, cloneState(state));
  const diagnostics = attachMolecularMaterialDiagnostics(computeSphMaterialDiagnostics({
    state,
    fireCenter: effectiveInput.fireCenter,
    fireContactRadius: effectiveInput.fireContactRadius,
    groundY: effectiveInput.groundY,
    coupling: effectiveInput.coupling
  }), coupled.molecular, {
    solverId: payload.solver?.id || 'sph-material',
    stateKey,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    environment: effectiveInput.environment,
    backend: advanceResult.backend,
    beforeDiagnostics
  });
  const conservation = conservationFromBaseline(diagnostics, baselines.get(stateKey));
  const value = {
    ok: true,
    schema: SPH_MATERIAL_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'sph-material',
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
