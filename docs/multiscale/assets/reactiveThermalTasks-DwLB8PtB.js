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

export const REACTIVE_THERMAL_STATE_SCHEMA = 'peercompute.multiscale.reactive-thermal.state.v0';
export const REACTIVE_THERMAL_RESULT_SCHEMA = 'peercompute.multiscale.reactive-thermal.result.v0';
export const REACTIVE_THERMAL_DELTA_SCHEMA = 'peercompute.multiscale.reactive-thermal.delta.v0';
export const REACTIVE_THERMAL_WEBGPU_MAX_CELLS = 1;

const DEFAULT_STATE_KEY = 'multiscale:reactive-thermal:default';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const REACTIVE_FLOATS = 32;
const PARAM_FLOATS = 8;
const PARAM_BYTES = PARAM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const states = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const REACTIVE_THERMAL_SHADER = `
struct Params {
  dt: f32,
  ambientTemperatureK: f32,
  ambientPressurePa: f32,
  oxygenBoundary: f32,
  waterContact: f32,
  ignition: f32,
  fuelBoundary: f32,
  radiativeHeatFlux: f32,
};

@group(0) @binding(0) var<storage, read> currentData: array<f32>;
@group(0) @binding(1) var<storage, read_write> nextData: array<f32>;
@group(0) @binding(2) var<uniform> params: Params;

fn safe_rate(delta: f32, dt: f32) -> f32 {
  return delta / max(dt, 0.000000001);
}

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  if (gid.x > 0u) {
    return;
  }

  let dt = clamp(params.dt, 0.0, 2.0);
  var sequence = currentData[0];
  var elapsedTime = currentData[1];
  var temperatureK = currentData[2];
  var pressurePa = currentData[3];
  var fuelFraction = currentData[4];
  var oxygenFraction = currentData[5];
  var productFraction = currentData[6];
  var waterLiquidFraction = currentData[7];
  var waterVaporFraction = currentData[8];
  var reactionProgress = currentData[9];
  var heatReleaseNorm = currentData[10];

  let beforeFuel = fuelFraction;
  let beforeOxygen = oxygenFraction;
  let beforeProduct = productFraction;
  let beforeLiquid = waterLiquidFraction;
  let beforeVapor = waterVaporFraction;
  let beforeMass = beforeFuel + beforeOxygen + beforeProduct + beforeLiquid + beforeVapor;

  oxygenFraction = oxygenFraction + (params.oxygenBoundary - oxygenFraction) * dt * 0.9;
  fuelFraction = fuelFraction + (params.fuelBoundary - fuelFraction) * dt * 0.28;
  waterLiquidFraction = waterLiquidFraction + (params.waterContact - waterLiquidFraction) * dt * 1.1;

  let thermalActivation = clamp((temperatureK - 520.0) / 760.0, 0.0, 1.0);
  let oxygenDrive = clamp(oxygenFraction / 0.21, 0.0, 2.0);
  let reactionRate = clamp((thermalActivation * 0.65 + params.ignition * 0.35) * oxygenDrive * fuelFraction, 0.0, 1.5);
  let fuelConsumed = min(fuelFraction, reactionRate * dt * 0.055);
  let oxygenConsumed = min(oxygenFraction, fuelConsumed * 0.62);
  let productCreated = fuelConsumed + oxygenConsumed;

  fuelFraction = fuelFraction - fuelConsumed;
  oxygenFraction = oxygenFraction - oxygenConsumed;
  productFraction = clamp(productFraction + productCreated, 0.0, 1.5);
  reactionProgress = clamp(reactionProgress + fuelConsumed * 0.9, 0.0, 1.0);

  let combustionHeatInput = fuelConsumed * 7200.0;
  let radiativeHeatInput = clamp(params.radiativeHeatFlux, -5000.0, 5000.0) * dt * 0.03;
  let waterCooling = waterLiquidFraction * max(0.0, temperatureK - 373.15) * dt * 0.62;
  let convectiveLoss = max(0.0, temperatureK - params.ambientTemperatureK) * dt * 0.42;
  let vaporRate = min(
    waterLiquidFraction,
    max(0.0, temperatureK - 373.15) * waterLiquidFraction * dt * 0.0009
      + params.waterContact * max(0.0, combustionHeatInput + radiativeHeatInput) * 0.000018
  );

  waterLiquidFraction = clamp(waterLiquidFraction - vaporRate, 0.0, 1.0);
  waterVaporFraction = clamp(waterVaporFraction + vaporRate, 0.0, 1.5);
  temperatureK = clamp(
    temperatureK + combustionHeatInput + radiativeHeatInput - waterCooling - convectiveLoss,
    params.ambientTemperatureK,
    3200.0
  );
  pressurePa = clamp(
    params.ambientPressurePa + (temperatureK - params.ambientTemperatureK) * 44.0 + waterVaporFraction * 18000.0,
    1.0,
    100000000.0
  );
  heatReleaseNorm = clamp(
    heatReleaseNorm + (reactionRate - heatReleaseNorm - params.waterContact * 0.55) * dt * 1.8,
    0.0,
    1.0
  );
  elapsedTime = elapsedTime + dt;
  sequence = sequence + 1.0;

  let afterMass = fuelFraction + oxygenFraction + productFraction + waterLiquidFraction + waterVaporFraction;
  nextData[0] = sequence;
  nextData[1] = elapsedTime;
  nextData[2] = temperatureK;
  nextData[3] = pressurePa;
  nextData[4] = fuelFraction;
  nextData[5] = oxygenFraction;
  nextData[6] = productFraction;
  nextData[7] = waterLiquidFraction;
  nextData[8] = waterVaporFraction;
  nextData[9] = reactionProgress;
  nextData[10] = heatReleaseNorm;
  nextData[11] = safe_rate(fuelFraction - beforeFuel, dt);
  nextData[12] = safe_rate(oxygenFraction - beforeOxygen, dt);
  nextData[13] = safe_rate(productFraction - beforeProduct, dt);
  nextData[14] = safe_rate(waterLiquidFraction - beforeLiquid, dt);
  nextData[15] = safe_rate(waterVaporFraction - beforeVapor, dt);
  nextData[16] = (combustionHeatInput + radiativeHeatInput) / max(dt, 0.000000001);
  nextData[17] = beforeMass;
  nextData[18] = afterMass;
  nextData[19] = afterMass - beforeMass;
  nextData[20] = clamp(heatReleaseNorm * (1.0 - waterLiquidFraction * 0.45), 0.0, 1.0);
  nextData[21] = 0.024 + waterVaporFraction * 0.05 + productFraction * 0.012;
  nextData[22] = 0.0000000001 + productFraction * 0.000001;
  nextData[23] = vaporRate / max(dt, 0.000000001);
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

function readMolecularClosureFromInput(input = {}) {
  const coupling = input.coupling || {};
  return coupling.molecularDynamicsClosure
    || coupling.molecularClosure
    || coupling.closureResults?.molecularDynamics
    || input.closureResults?.molecularDynamics
    || input.molecularDynamicsClosure
    || null;
}

function readMolecularTargetSourceIntake(input = {}, targetSolverId = 'reactive-thermal-cell') {
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

function readMolecularConservativeSourceBuffer(input = {}, targetSolverId = 'reactive-thermal-cell') {
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

function deriveMolecularReactiveCoupling(input = {}, state = {}) {
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
  const species = chemistry.species || (hasClosure ? closure.state?.species : {}) || {};
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
  const atomCount = Math.max(1, normalizeNumber(chemistry.atomCount, 1, 1));
  const heatReleaseProxy = clamp(normalizeNumber(chemistry.heatReleaseProxy, 0), 0, 6);
  const reactionProgress = clamp(normalizeNumber(chemistry.reactionProgress, 0), 0, 1);
  const ionizationFraction = clamp(normalizeNumber(chemistry.ionizationFraction, 0), 0, 1);
  const temperatureK = normalizeNumber(
    thermodynamics.temperatureK,
    chemistry.meanTemperatureK ?? state.temperatureK ?? 294,
    1,
    20000
  );
  const ambientTemperatureK = normalizeNumber(input.environment?.ambientTemperatureK, 294, 1, 20000);
  const carbonFraction = clamp(normalizeNumber(species.C, 0) / atomCount, 0, 1);
  const thermalDrive = clamp(
    heatReleaseProxy * 0.22
      + reactionProgress * 0.18
      + ionizationFraction * 0.12
      + reactionSource.sourceDrive * 0.24
      - reactionSource.coolingDrive * 0.08
      + phaseSource.heatingDrive * 0.18
      + phaseSource.phaseDriveProxy * 0.08
      - phaseSource.coolingDrive * 0.12
      + phaseEosBasis.source.thermalDrive * 0.14
      - phaseEosBasis.source.coolingDrive * 0.08
      + phaseEosBasis.phase.phaseStabilityResidualProxy * 0.06
      + sourceTerms.thermalDrive * 0.32
      + sourceTerms.phaseDriveDeltaProxy * 0.14
      + quantumMaterialPropertySource.electricalDrive * 0.05
      + quantumMaterialPropertySource.opticalHeatingDrive * 0.08
      + quantumMaterialPropertySource.phaseDriveBoostProxy * 0.12
      + Math.max(0, quantumMaterialStatisticalSource.pressureDriveProxy) * 0.05
      + quantumMaterialStatisticalSource.opacityDriveProxy * 0.04
      + quantumMaterialStatisticalSource.ionizationDriveProxy * 0.08
      + quantumMaterialStatisticalSource.degeneracyPressureDriveProxy * 0.05
      + Math.max(0, quantumMaterialStatisticalSource.temperatureDeltaKProxy) / 2600
      + quantumMaterialResponseDerivativeSource.temperatureDrive * 0.1
      + quantumMaterialResponseDerivativeSource.fieldDrive * 0.045
      + quantumMaterialResponseDerivativeSource.radiationDrive * 0.12
      + quantumMaterialResponseDerivativeSource.phaseDerivativeDriveBoostProxy * 0.18
      + Math.max(0, sourceTerms.temperatureDeltaKProxy) / 1800
      + Math.max(0, temperatureK - ambientTemperatureK) / 2400,
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
    atomCount,
    species,
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
    carbonFraction,
    thermalDrive,
    ignitionBoost: clamp(
      thermalDrive * 0.18
        + reactionSource.sourceDrive * 0.08
        + phaseSource.heatingDrive * 0.05
        - phaseSource.coolingDrive * 0.04
        + phaseEosBasis.source.thermalDrive * 0.045
        + intake.reactionDriveDeltaProxy * 0.08
        + quantumMaterialPropertySource.electricalDrive * 0.025
        + quantumMaterialPropertySource.opticalHeatingDrive * 0.035
        + quantumMaterialStatisticalSource.ionizationDriveProxy * 0.035
        + quantumMaterialStatisticalSource.opacityDriveProxy * 0.02
        + quantumMaterialResponseDerivativeSource.fieldDrive * 0.018
        + quantumMaterialResponseDerivativeSource.radiationDrive * 0.025,
      0,
      0.34
    ),
    fuelBoost: clamp(carbonFraction * 0.22 + heatReleaseProxy * 0.012, 0, 0.2),
    radiativeHeatFluxBoost: clamp(
      thermalDrive * 360
        + reactionSource.sourceDrive * 180
        - reactionSource.coolingDrive * 80
        + phaseSource.heatingDrive * 80
        + phaseSource.latentHeatReleaseProxy * 42
        - phaseSource.coolingDrive * 52
        - phaseSource.latentHeatSinkProxy * 36
        + phaseEosBasis.source.thermalDrive * 70
        + Math.max(0, phaseEosBasis.source.phaseEnergyRateProxy) * 18
        - Math.max(0, -phaseEosBasis.source.phaseEnergyRateProxy) * 12
        + Math.max(0, sourceTerms.radiativeHeatFluxBoostProxy) * 0.35
        + quantumMaterialPropertySource.thermalFluxBoostProxy * 0.45
        + quantumMaterialStatisticalSource.opacityDriveProxy * 48
        + Math.max(0, quantumMaterialStatisticalSource.temperatureDeltaKProxy) * 1.8
        + quantumMaterialStatisticalSource.ionizationDriveProxy * 64
        + quantumMaterialResponseDerivativeSource.thermalFluxDerivativeBoostProxy * 0.32
        + quantumMaterialResponseDerivativeSource.radiationDrive * 52,
      0,
      720
    ),
    reactionProgressBoost: clamp(
      reactionProgress * 0.08
        + reactionSource.speciesRateProxy * 0.002
        + reactionSource.bondFormationRate * 0.001
        + phaseSource.phaseDriveProxy * 0.015,
      0,
      0.12
    )
  };
}

function inputWithMolecularReactiveCoupling(input = {}, state = {}) {
  const molecular = deriveMolecularReactiveCoupling(input, state);
  if (!molecular.active) return { input, molecular };
  const coupling = input.coupling || {};
  return {
    molecular,
    input: {
      ...input,
      coupling: {
        ...coupling,
        fireIntensity: clamp(
          normalizeNumber(coupling.fireIntensity, state.heatReleaseNorm ?? 0, 0, 1) + molecular.ignitionBoost,
          0,
          1
        ),
        fuelFraction: clamp(
          normalizeNumber(coupling.fuelFraction, state.fuelFraction ?? 0, 0, 1) + molecular.fuelBoost,
          0,
          1
        ),
        radiativeHeatFlux: clamp(
          normalizeNumber(coupling.radiativeHeatFlux, 0, -5000, 5000) + molecular.radiativeHeatFluxBoost,
          -5000,
          5000
        ),
        reactionProgress: clamp(
          normalizeNumber(coupling.reactionProgress, state.reactionProgress ?? 0, 0, 1) + molecular.reactionProgressBoost,
          0,
          1
        ),
        molecularClosureDrive: molecular.thermalDrive
      }
    }
  };
}

function attachMolecularReactiveCoupling(result, molecular = {}, input = {}, beforeState = {}) {
  if (!molecular.active || !result?.closure) return result;
  const sourceBufferApplication = molecular.conservativeSourceBufferSchema === MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA
    ? createMolecularSourceBufferApplicationReport({
      targetSolverId: result.solverId || 'reactive-thermal-cell',
      targetStateKey: result.stateKey || null,
      targetLayer: 'surface',
      targetSequence: result.sequence ?? null,
      backend: result.backend || null,
      sourceBuffer: molecular.conservativeSourceBuffer,
      timeSeconds: result.elapsedTime ?? 0,
      fields: [
        {
          field: 'temperatureK',
          unit: 'K',
          dimensions: 'Theta',
          sourceTerm: 'temperatureDeltaKProxy',
          sourceValue: molecular.conservativeSourceBuffer?.temperatureDeltaKProxy,
          before: beforeState.temperatureK,
          after: result.closure.temperatureK
        },
        {
          field: 'heatReleaseNorm',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'thermalDrive',
          sourceValue: molecular.conservativeSourceBuffer?.thermalDrive,
          before: beforeState.heatReleaseNorm,
          after: result.closure.heatReleaseNorm
        },
        {
          field: 'reactionProgress',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'reactionDriveDeltaProxy',
          sourceValue: molecular.conservativeSourceBuffer?.reactionDriveDeltaProxy,
          before: beforeState.reactionProgress,
          after: result.closure.reactionProgress
        },
        {
          field: 'molecularClosureHeatFluxProxy',
          unit: 'W/m^2-proxy',
          dimensions: 'M T^-3',
          sourceTerm: 'radiativeHeatFluxBoostProxy',
          sourceValue: molecular.conservativeSourceBuffer?.radiativeHeatFluxBoostProxy,
          before: 0,
          after: molecular.radiativeHeatFluxBoost
        },
        {
          field: 'molecularQuantumMaterialPropertyThermalFluxBoostProxy',
          unit: 'W/m^2-proxy',
          dimensions: 'M T^-3',
          sourceTerm: 'quantumMaterialPropertyThermalFluxBoostProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialPropertyThermalFluxBoostProxy,
          before: beforeState.molecularQuantumMaterialPropertyThermalFluxBoostProxy,
          after: molecular.quantumMaterialPropertyThermalFluxBoostProxy
        },
        {
          field: 'molecularQuantumMaterialPropertyPhaseDriveBoostProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialPropertyPhaseDriveBoostProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialPropertyPhaseDriveBoostProxy,
          before: beforeState.molecularQuantumMaterialPropertyPhaseDriveBoostProxy,
          after: molecular.quantumMaterialPropertyPhaseDriveBoostProxy
        },
        {
          field: 'molecularQuantumMaterialPropertyElectricalDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialPropertyElectricalDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialPropertyElectricalDrive,
          before: beforeState.molecularQuantumMaterialPropertyElectricalDrive,
          after: molecular.quantumMaterialPropertyElectricalDrive
        },
        {
          field: 'molecularQuantumMaterialPropertyOpticalHeatingDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialPropertyOpticalHeatingDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialPropertyOpticalHeatingDrive,
          before: beforeState.molecularQuantumMaterialPropertyOpticalHeatingDrive,
          after: molecular.quantumMaterialPropertyOpticalHeatingDrive
        },
        {
          field: 'molecularQuantumMaterialPropertyMechanicalStiffnessDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialPropertyMechanicalStiffnessDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialPropertyMechanicalStiffnessDrive,
          before: beforeState.molecularQuantumMaterialPropertyMechanicalStiffnessDrive,
          after: molecular.quantumMaterialPropertyMechanicalStiffnessDrive
        },
        {
          field: 'molecularQuantumMaterialPropertyDampingScale',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialPropertyDampingScale',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialPropertyDampingScale,
          before: beforeState.molecularQuantumMaterialPropertyDampingScale,
          after: molecular.quantumMaterialPropertyDampingScale
        },
        {
          field: 'molecularQuantumMaterialStatisticalPressureDriveProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialStatisticalPressureDriveProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialStatisticalPressureDriveProxy,
          before: beforeState.molecularQuantumMaterialStatisticalPressureDriveProxy,
          after: molecular.quantumMaterialStatisticalPressureDriveProxy
        },
        {
          field: 'molecularQuantumMaterialStatisticalOpacityDriveProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialStatisticalOpacityDriveProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialStatisticalOpacityDriveProxy,
          before: beforeState.molecularQuantumMaterialStatisticalOpacityDriveProxy,
          after: molecular.quantumMaterialStatisticalOpacityDriveProxy
        },
        {
          field: 'molecularQuantumMaterialStatisticalIonizationDriveProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialStatisticalIonizationDriveProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialStatisticalIonizationDriveProxy,
          before: beforeState.molecularQuantumMaterialStatisticalIonizationDriveProxy,
          after: molecular.quantumMaterialStatisticalIonizationDriveProxy
        },
        {
          field: 'molecularQuantumMaterialStatisticalDegeneracyPressureDriveProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialStatisticalDegeneracyPressureDriveProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialStatisticalDegeneracyPressureDriveProxy,
          before: beforeState.molecularQuantumMaterialStatisticalDegeneracyPressureDriveProxy,
          after: molecular.quantumMaterialStatisticalDegeneracyPressureDriveProxy
        },
        {
          field: 'molecularQuantumMaterialStatisticalTemperatureDeltaKProxy',
          unit: 'K-proxy',
          dimensions: 'Theta',
          sourceTerm: 'quantumMaterialStatisticalTemperatureDeltaKProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialStatisticalTemperatureDeltaKProxy,
          before: beforeState.molecularQuantumMaterialStatisticalTemperatureDeltaKProxy,
          after: molecular.quantumMaterialStatisticalTemperatureDeltaKProxy
        },
        {
          field: 'molecularQuantumMaterialStatisticalChargeDeltaProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialStatisticalChargeDeltaProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialStatisticalChargeDeltaProxy,
          before: beforeState.molecularQuantumMaterialStatisticalChargeDeltaProxy,
          after: molecular.quantumMaterialStatisticalChargeDeltaProxy
        },
        {
          field: 'molecularQuantumMaterialStatisticalThermalDampingScale',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialStatisticalThermalDampingScale',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialStatisticalThermalDampingScale,
          before: beforeState.molecularQuantumMaterialStatisticalThermalDampingScale,
          after: molecular.quantumMaterialStatisticalThermalDampingScale
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeTemperatureDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativeTemperatureDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeTemperatureDrive,
          before: beforeState.molecularQuantumMaterialResponseDerivativeTemperatureDrive,
          after: molecular.quantumMaterialResponseDerivativeTemperatureDrive
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativePressureDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativePressureDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativePressureDrive,
          before: beforeState.molecularQuantumMaterialResponseDerivativePressureDrive,
          after: molecular.quantumMaterialResponseDerivativePressureDrive
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeFieldDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativeFieldDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeFieldDrive,
          before: beforeState.molecularQuantumMaterialResponseDerivativeFieldDrive,
          after: molecular.quantumMaterialResponseDerivativeFieldDrive
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeRadiationDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativeRadiationDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeRadiationDrive,
          before: beforeState.molecularQuantumMaterialResponseDerivativeRadiationDrive,
          after: molecular.quantumMaterialResponseDerivativeRadiationDrive
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeThermalFluxBoostProxy',
          unit: 'W m-2 proxy',
          dimensions: 'M T-3 proxy',
          sourceTerm: 'quantumMaterialResponseDerivativeThermalFluxBoostProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeThermalFluxBoostProxy,
          before: beforeState.molecularQuantumMaterialResponseDerivativeThermalFluxBoostProxy,
          after: molecular.quantumMaterialResponseDerivativeThermalFluxBoostProxy
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativePhaseDriveBoostProxy',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativePhaseDriveBoostProxy',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativePhaseDriveBoostProxy,
          before: beforeState.molecularQuantumMaterialResponseDerivativePhaseDriveBoostProxy,
          after: molecular.quantumMaterialResponseDerivativePhaseDriveBoostProxy
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeElectricalDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativeElectricalDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeElectricalDrive,
          before: beforeState.molecularQuantumMaterialResponseDerivativeElectricalDrive,
          after: molecular.quantumMaterialResponseDerivativeElectricalDrive
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeMechanicalDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativeMechanicalDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeMechanicalDrive,
          before: beforeState.molecularQuantumMaterialResponseDerivativeMechanicalDrive,
          after: molecular.quantumMaterialResponseDerivativeMechanicalDrive
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeOpticalDrive',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativeOpticalDrive',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeOpticalDrive,
          before: beforeState.molecularQuantumMaterialResponseDerivativeOpticalDrive,
          after: molecular.quantumMaterialResponseDerivativeOpticalDrive
        },
        {
          field: 'molecularQuantumMaterialResponseDerivativeDampingScale',
          unit: '1',
          dimensions: '1',
          sourceTerm: 'quantumMaterialResponseDerivativeDampingScale',
          sourceValue: molecular.conservativeSourceBuffer?.quantumMaterialResponseDerivativeDampingScale,
          before: beforeState.molecularQuantumMaterialResponseDerivativeDampingScale,
          after: molecular.quantumMaterialResponseDerivativeDampingScale
        }
      ]
    })
    : null;
  const sourceSink = createMolecularSourceSinkReport({
    sourceClosure: molecular.sourceClosure,
    molecular,
    targetSolverId: result.solverId || 'reactive-thermal-cell',
    targetStateKey: result.stateKey || null,
    targetLayer: 'surface',
    targetField: 'molecularClosureHeatFluxProxy',
    targetSequence: result.sequence ?? null,
    ambientTemperatureK: input.environment?.ambientTemperatureK,
    ambientPressurePa: input.environment?.ambientPressurePa,
    heatFluxProxy: molecular.radiativeHeatFluxBoost,
    thermalDrive: molecular.thermalDrive
  });
  result.closure.molecularClosure = {
    applied: true,
    modelId: molecular.modelId,
    sourceStateKey: molecular.sourceStateKey,
    sourceSequence: molecular.sourceSequence,
    heatReleaseProxy: molecular.heatReleaseProxy,
    reactionProgress: molecular.reactionProgress,
    ionizationFraction: molecular.ionizationFraction,
    reactionSource: molecular.reactionSource,
    reactionSourceSchema: molecular.reactionSourceSchema,
    reactionHeatSourceProxy: molecular.reactionHeatSourceProxy,
    reactionSpeciesRateProxy: molecular.reactionSpeciesRateProxy,
    reactionSourceDrive: molecular.reactionSourceDrive,
    reactionCoolingDrive: molecular.reactionCoolingDrive,
    reactionSourceEventIntensity: molecular.reactionSourceEventIntensity,
    reactionSourceBondFormationRate: molecular.reactionSourceBondFormationRate,
    reactionSourceBondBreakageRate: molecular.reactionSourceBondBreakageRate,
    phaseSource: molecular.phaseSource,
    phaseEosBasis: molecular.phaseEosBasis,
    molecularPhaseEosSchema: molecular.molecularPhaseEosSchema,
    molecularPhaseEosSpecificFreeEnergyProxy: molecular.molecularPhaseEosSpecificFreeEnergyProxy,
    molecularPhaseEosSpecificEnthalpyProxy: molecular.molecularPhaseEosSpecificEnthalpyProxy,
    molecularPhaseEosLatentHeatBudgetProxy: molecular.molecularPhaseEosLatentHeatBudgetProxy,
    molecularPhaseEosEnergyRateProxy: molecular.molecularPhaseEosEnergyRateProxy,
    molecularPhaseEosStabilityResidualProxy: molecular.molecularPhaseEosStabilityResidualProxy,
    molecularPhaseEosTemperatureDeltaKProxy: molecular.molecularPhaseEosTemperatureDeltaKProxy,
    phaseRegime: molecular.phaseRegime,
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
    targetSourceIntake: molecular.targetSourceIntake,
    targetSourceIntakeSchema: molecular.targetSourceIntakeSchema,
    targetSourceIntakeSequence: molecular.targetSourceIntakeSequence,
    targetSourceIntakeThermalDrive: molecular.targetSourceIntakeThermalDrive,
    conservativeSourceBuffer: molecular.conservativeSourceBuffer,
    conservativeSourceBufferSchema: molecular.conservativeSourceBufferSchema,
    conservativeSourceBufferSequence: molecular.conservativeSourceBufferSequence,
    conservativeSourceBufferThermalDrive: molecular.conservativeSourceBufferThermalDrive,
    conservativeSourceBufferResidual: molecular.conservativeSourceBufferResidual,
    conservativeSourceBufferVectorStride: molecular.conservativeSourceBufferVectorStride,
    sourceBufferApplication,
    sourceBufferApplicationSchema: sourceBufferApplication?.schema || null,
    sourceBufferApplicationStatus: sourceBufferApplication?.status || null,
    sourceBufferApplicationApplied: sourceBufferApplication?.applied === true,
    sourceBufferApplicationAppliedFieldCount: sourceBufferApplication?.appliedFieldCount || 0,
    sourceBufferApplicationSourceTermCount: sourceBufferApplication?.sourceTermCount || 0,
    sourceBufferApplicationThermalDrive: sourceBufferApplication?.thermalDrive || 0,
    sourceBufferApplicationResidual: sourceBufferApplication?.applicationResidualProxy || 0,
    sourceBufferApplicationMaxDelta: sourceBufferApplication?.maxAbsFieldDeltaProxy || 0,
    thermalDrive: molecular.thermalDrive,
    ignitionBoost: molecular.ignitionBoost,
    fuelBoost: molecular.fuelBoost,
    radiativeHeatFluxBoost: molecular.radiativeHeatFluxBoost,
    sourceSink
  };
  result.conservation = {
    ...(result.conservation || {}),
    molecularClosureApplied: true,
    molecularClosureHeatFluxProxy: molecular.radiativeHeatFluxBoost,
    molecularReactionSourceSchema: molecular.reactionSourceSchema,
    molecularReactionHeatSourceProxy: molecular.reactionHeatSourceProxy,
    molecularReactionSpeciesRateProxy: molecular.reactionSpeciesRateProxy,
    molecularReactionSourceDrive: molecular.reactionSourceDrive,
    molecularReactionCoolingDrive: molecular.reactionCoolingDrive,
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
    molecularClosureMode: 'reduced-md-closure-driven-reactive-source',
    molecularSourceSink: sourceSink
  };
  return result;
}

function normalizeState(source = {}) {
  const state = source.state || source;
  return {
    schema: REACTIVE_THERMAL_STATE_SCHEMA,
    sequence: Math.max(0, Math.floor(Number(state.sequence) || 0)),
    elapsedTime: normalizeNumber(state.elapsedTime, 0, 0),
    temperatureK: normalizeNumber(state.temperatureK, source.temperatureK ?? 920, 1, 20000),
    pressurePa: normalizeNumber(state.pressurePa, source.pressurePa ?? 101325, 1, 1e12),
    fuelFraction: clamp(normalizeNumber(state.fuelFraction, source.fuelFraction ?? 0.82), 0, 1),
    oxygenFraction: clamp(normalizeNumber(state.oxygenFraction, source.oxygenFraction ?? 0.21), 0, 1),
    productFraction: clamp(normalizeNumber(state.productFraction, source.productFraction ?? 0.08), 0, 1),
    waterLiquidFraction: clamp(normalizeNumber(state.waterLiquidFraction, source.waterLiquidFraction ?? 0.16), 0, 1),
    waterVaporFraction: clamp(normalizeNumber(state.waterVaporFraction, source.waterVaporFraction ?? 0.02), 0, 1),
    reactionProgress: clamp(normalizeNumber(state.reactionProgress, source.reactionProgress ?? 0.18), 0, 1),
    heatReleaseNorm: clamp(normalizeNumber(state.heatReleaseNorm, source.heatReleaseNorm ?? 0.45), 0, 1)
  };
}

function cloneState(state) {
  return {
    schema: REACTIVE_THERMAL_STATE_SCHEMA,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    temperatureK: state.temperatureK,
    pressurePa: state.pressurePa,
    fuelFraction: state.fuelFraction,
    oxygenFraction: state.oxygenFraction,
    productFraction: state.productFraction,
    waterLiquidFraction: state.waterLiquidFraction,
    waterVaporFraction: state.waterVaporFraction,
    reactionProgress: state.reactionProgress,
    heatReleaseNorm: state.heatReleaseNorm
  };
}

function reactiveDataFromState(state) {
  const data = new Float32Array(REACTIVE_FLOATS);
  data[0] = state.sequence;
  data[1] = state.elapsedTime;
  data[2] = state.temperatureK;
  data[3] = state.pressurePa;
  data[4] = state.fuelFraction;
  data[5] = state.oxygenFraction;
  data[6] = state.productFraction;
  data[7] = state.waterLiquidFraction;
  data[8] = state.waterVaporFraction;
  data[9] = state.reactionProgress;
  data[10] = state.heatReleaseNorm;
  return data;
}

function applyReactiveDataToState(state, data) {
  state.sequence = Math.max(0, Math.round(data[0]));
  state.elapsedTime = data[1];
  state.temperatureK = data[2];
  state.pressurePa = data[3];
  state.fuelFraction = data[4];
  state.oxygenFraction = data[5];
  state.productFraction = data[6];
  state.waterLiquidFraction = data[7];
  state.waterVaporFraction = data[8];
  state.reactionProgress = data[9];
  state.heatReleaseNorm = data[10];
}

function closureFromReactiveData(data) {
  return {
    temperatureK: data[2],
    pressurePa: data[3],
    heatSource: data[16],
    heatReleaseNorm: data[10],
    fireIntensityEstimate: data[20],
    steamFraction: data[8],
    speciesRates: {
      fuel: data[11],
      oxygen: data[12],
      products: data[13],
      waterLiquid: data[14],
      waterVapor: data[15]
    },
    phaseRates: {
      vaporization: data[23],
      liquidFraction: data[7],
      vaporFraction: data[8]
    },
    thermalConductivityWmK: data[21],
    electricalConductivitySm: data[22]
  };
}

function conservationFromReactiveData(data) {
  return {
    speciesInventoryBefore: data[17],
    speciesInventoryAfter: data[18],
    speciesInventoryDelta: data[19],
    energyMode: 'reduced-reactive-thermal',
    note: 'Reduced cell tracks source consistency, not full chemical enthalpy conservation.'
  };
}

export function makeReactiveThermalInitialState(input = {}) {
  const environment = input.environment || {};
  const coupling = input.coupling || {};
  return normalizeState({
    temperatureK: normalizeNumber(coupling.flameTemperatureK, 920, 250, 4000),
    pressurePa: normalizeNumber(environment.ambientPressurePa, 101325, 1, 1e9),
    fuelFraction: clamp(normalizeNumber(coupling.fuelFraction, 0.82), 0, 1),
    oxygenFraction: clamp(normalizeNumber(environment.oxygenFraction, 0.21), 0, 1),
    waterLiquidFraction: clamp(normalizeNumber(coupling.waterContact, 0.16), 0, 1),
    waterVaporFraction: clamp(normalizeNumber(coupling.steamFraction, 0.02), 0, 1),
    reactionProgress: clamp(normalizeNumber(coupling.reactionProgress, 0.18), 0, 1),
    heatReleaseNorm: clamp(normalizeNumber(coupling.fireIntensity, 0.45), 0, 1)
  });
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

function speciesTotal(state) {
  return state.fuelFraction
    + state.oxygenFraction
    + state.productFraction
    + state.waterLiquidFraction
    + state.waterVaporFraction;
}

class ReactiveThermalWebGpuRuntime {
  constructor(stateKey) {
    this.stateKey = stateKey;
    this.device = null;
    this.pipeline = null;
    this.currentBuffer = null;
    this.nextBuffer = null;
    this.readBuffer = null;
    this.paramBuffer = null;
    this.submittedSteps = 0;
    this.lastError = null;
  }

  async initialize() {
    if (this.device) return;
    const gpu = globalThis.navigator?.gpu;
    if (!gpu) throw new Error('WebGPU unavailable for reactive thermal worker');
    const usage = globalThis.GPUBufferUsage;
    if (!usage) throw new Error('GPUBufferUsage unavailable for reactive thermal worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for reactive thermal worker');
    this.device = await adapter.requestDevice();

    const byteLength = REACTIVE_FLOATS * Float32Array.BYTES_PER_ELEMENT;
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
        module: this.device.createShaderModule({ code: REACTIVE_THERMAL_SHADER }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`Reactive thermal WebGPU validation: ${validationError.message || validationError}`);
    }
    this.device.lost?.then((info) => {
      this.lastError = info?.message || info?.reason || 'Reactive thermal WebGPU device lost';
      gpuDisabledReasons.set(this.stateKey, this.lastError);
    });
  }

  async step(state, input = {}) {
    await this.initialize();
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for reactive thermal worker');

    const environment = input.environment || {};
    const coupling = input.coupling || {};
    const dt = normalizeNumber(input.dt, 1 / 60, 0, 2);
    const ambientTemperatureK = normalizeNumber(environment.ambientTemperatureK, 294, 1, 20000);
    const ambientPressurePa = normalizeNumber(environment.ambientPressurePa, 101325, 1, 1e12);
    const oxygenBoundary = clamp(normalizeNumber(environment.oxygenFraction, state.oxygenFraction), 0, 1);
    const waterContact = clamp(normalizeNumber(coupling.waterContact, state.waterLiquidFraction), 0, 1);
    const ignition = clamp(normalizeNumber(coupling.fireIntensity, state.heatReleaseNorm), 0, 1);
    const fuelBoundary = clamp(normalizeNumber(coupling.fuelFraction, state.fuelFraction), 0, 1);
    const radiativeHeatFlux = normalizeNumber(coupling.radiativeHeatFlux, 0, -5000, 5000);
    const data = reactiveDataFromState(state);
    const params = new Float32Array([
      dt,
      ambientTemperatureK,
      ambientPressurePa,
      oxygenBoundary,
      waterContact,
      ignition,
      fuelBoundary,
      radiativeHeatFlux
    ]);
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
    pass.dispatchWorkgroups(1);
    pass.end();
    encoder.copyBufferToBuffer(this.nextBuffer, 0, this.readBuffer, 0, data.byteLength);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone?.();
    await this.readBuffer.mapAsync(mapMode.READ);
    const mapped = this.readBuffer.getMappedRange();
    const resultData = new Float32Array(mapped).slice();
    this.readBuffer.unmap();

    applyReactiveDataToState(state, resultData);
    this.submittedSteps += 1;
    return {
      backend: 'webgpu-reactive-thermal',
      closure: closureFromReactiveData(resultData),
      conservation: conservationFromReactiveData(resultData),
      webgpuStatus: {
        stateKey: this.stateKey,
        submittedSteps: this.submittedSteps,
        cellCount: REACTIVE_THERMAL_WEBGPU_MAX_CELLS
      }
    };
  }
}

function advanceReactiveCell(state, input = {}) {
  const environment = input.environment || {};
  const coupling = input.coupling || {};
  const dt = normalizeNumber(input.dt, 1 / 60, 0, 2);
  const ambientTemperatureK = normalizeNumber(environment.ambientTemperatureK, 294, 1, 20000);
  const ambientPressurePa = normalizeNumber(environment.ambientPressurePa, 101325, 1, 1e12);
  const oxygenBoundary = clamp(normalizeNumber(environment.oxygenFraction, state.oxygenFraction), 0, 1);
  const waterContact = clamp(normalizeNumber(coupling.waterContact, state.waterLiquidFraction), 0, 1);
  const ignition = clamp(normalizeNumber(coupling.fireIntensity, state.heatReleaseNorm), 0, 1);
  const fuelBoundary = clamp(normalizeNumber(coupling.fuelFraction, state.fuelFraction), 0, 1);
  const radiativeHeatFlux = normalizeNumber(coupling.radiativeHeatFlux, 0, -5000, 5000);
  const beforeMass = speciesTotal(state);

  state.oxygenFraction += (oxygenBoundary - state.oxygenFraction) * dt * 0.9;
  state.fuelFraction += (fuelBoundary - state.fuelFraction) * dt * 0.28;
  state.waterLiquidFraction += (waterContact - state.waterLiquidFraction) * dt * 1.1;

  const thermalActivation = clamp((state.temperatureK - 520) / 760, 0, 1);
  const oxygenDrive = clamp(state.oxygenFraction / 0.21, 0, 2);
  const reactionRate = clamp((thermalActivation * 0.65 + ignition * 0.35) * oxygenDrive * state.fuelFraction, 0, 1.5);
  const fuelConsumed = Math.min(state.fuelFraction, reactionRate * dt * 0.055);
  const oxygenConsumed = Math.min(state.oxygenFraction, fuelConsumed * 0.62);
  const productCreated = fuelConsumed + oxygenConsumed;

  state.fuelFraction -= fuelConsumed;
  state.oxygenFraction -= oxygenConsumed;
  state.productFraction = clamp(state.productFraction + productCreated, 0, 1.5);
  state.reactionProgress = clamp(state.reactionProgress + fuelConsumed * 0.9, 0, 1);

  const combustionHeatInput = fuelConsumed * 7200;
  const radiativeHeatInput = radiativeHeatFlux * dt * 0.03;
  const waterCooling = state.waterLiquidFraction * Math.max(0, state.temperatureK - 373.15) * dt * 0.62;
  const convectiveLoss = Math.max(0, state.temperatureK - ambientTemperatureK) * dt * 0.42;
  const vaporRate = Math.min(
    state.waterLiquidFraction,
    Math.max(0, state.temperatureK - 373.15) * state.waterLiquidFraction * dt * 0.0009
      + waterContact * Math.max(0, combustionHeatInput + radiativeHeatInput) * 0.000018
  );

  state.waterLiquidFraction = clamp(state.waterLiquidFraction - vaporRate, 0, 1);
  state.waterVaporFraction = clamp(state.waterVaporFraction + vaporRate, 0, 1.5);
  state.temperatureK = clamp(
    state.temperatureK + combustionHeatInput + radiativeHeatInput - waterCooling - convectiveLoss,
    ambientTemperatureK,
    3200
  );
  state.pressurePa = clamp(
    ambientPressurePa + (state.temperatureK - ambientTemperatureK) * 44 + state.waterVaporFraction * 18000,
    1,
    1e8
  );
  state.heatReleaseNorm = clamp(
    state.heatReleaseNorm + (reactionRate - state.heatReleaseNorm - waterContact * 0.55) * dt * 1.8,
    0,
    1
  );
  state.elapsedTime += dt;
  state.sequence += 1;

  const speciesRates = {
    fuel: -fuelConsumed / Math.max(dt, 1e-9),
    oxygen: -oxygenConsumed / Math.max(dt, 1e-9),
    products: productCreated / Math.max(dt, 1e-9),
    waterLiquid: -vaporRate / Math.max(dt, 1e-9),
    waterVapor: vaporRate / Math.max(dt, 1e-9)
  };
  const phaseRates = {
    vaporization: vaporRate / Math.max(dt, 1e-9),
    liquidFraction: state.waterLiquidFraction,
    vaporFraction: state.waterVaporFraction
  };
  const heatSource = (combustionHeatInput + radiativeHeatInput) / Math.max(dt, 1e-9);
  const afterMass = speciesTotal(state);

  return {
    state,
    closure: {
      temperatureK: state.temperatureK,
      pressurePa: state.pressurePa,
      heatSource,
      heatReleaseNorm: state.heatReleaseNorm,
      fireIntensityEstimate: clamp(state.heatReleaseNorm * (1 - state.waterLiquidFraction * 0.45), 0, 1),
      steamFraction: state.waterVaporFraction,
      speciesRates,
      phaseRates,
      thermalConductivityWmK: 0.024 + state.waterVaporFraction * 0.05 + state.productFraction * 0.012,
      electricalConductivitySm: 1e-10 + state.productFraction * 1e-6
    },
    conservation: {
      speciesInventoryBefore: beforeMass,
      speciesInventoryAfter: afterMass,
      speciesInventoryDelta: afterMass - beforeMass,
      energyMode: 'reduced-reactive-thermal',
      note: 'Reduced cell tracks source consistency, not full chemical enthalpy conservation.'
    }
  };
}

function createDeltaPayload({ payload, stateKey, state, closure, conservation, backend }) {
  return {
    schema: payload.solver?.warmDelta?.schema || REACTIVE_THERMAL_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'reactive-thermal-cell',
    stateKey,
    backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    state: cloneState(state),
    closure,
    conservation,
    units: {
      temperature: 'K',
      pressure: 'Pa',
      heatSource: 'reduced W/m^3'
    }
  };
}

export function resetReactiveThermalCell(input = {}) {
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
    schema: REACTIVE_THERMAL_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

async function stepWithWebGpu(state, stateKey, input = {}) {
  let runtime = gpuRuntimes.get(stateKey);
  if (!runtime) {
    runtime = new ReactiveThermalWebGpuRuntime(stateKey);
    gpuRuntimes.set(stateKey, runtime);
  }
  return runtime.step(state, input);
}

export async function stepReactiveThermalCell(payload = {}) {
  const resolved = resolveInput(payload);
  const { input, stateKey } = resolved;
  const requestedReset = input.reset === true;
  const state = input.state || requestedReset || !states.has(stateKey)
    ? normalizeState(input.state || makeReactiveThermalInitialState(input))
    : cloneState(states.get(stateKey));
  const beforeState = cloneState(state);
  const coupled = inputWithMolecularReactiveCoupling(input, state);
  const effectiveInput = coupled.input;
  let backend = 'cpu-reactive-thermal';
  let webgpuStatus = null;
  let closure;
  let conservation;

  if (effectiveInput.enableWebGPU !== false && !gpuDisabledReasons.has(stateKey)) {
    try {
      const gpuResult = await stepWithWebGpu(state, stateKey, effectiveInput);
      backend = gpuResult.backend;
      webgpuStatus = gpuResult.webgpuStatus;
      closure = gpuResult.closure;
      conservation = gpuResult.conservation;
    } catch (error) {
      const reason = error?.message || String(error);
      gpuDisabledReasons.set(stateKey, reason);
      const cpuResult = advanceReactiveCell(state, effectiveInput);
      closure = cpuResult.closure;
      conservation = cpuResult.conservation;
      webgpuStatus = {
        fallback: true,
        disabledReason: reason
      };
    }
  } else {
    const cpuResult = advanceReactiveCell(state, effectiveInput);
    closure = cpuResult.closure;
    conservation = cpuResult.conservation;
    if (gpuDisabledReasons.has(stateKey)) {
      webgpuStatus = {
        fallback: true,
        disabledReason: gpuDisabledReasons.get(stateKey)
      };
    }
  }
  states.set(stateKey, cloneState(state));

  const value = {
    ok: true,
    schema: REACTIVE_THERMAL_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'reactive-thermal-cell',
    stateKey,
    backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    state: cloneState(state),
    closure,
    conservation,
    webgpuStatus
  };
  attachMolecularReactiveCoupling(value, coupled.molecular, effectiveInput, beforeState);

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
        closure: value.closure,
        conservation: value.conservation,
        backend
      })
    }
  };
}
