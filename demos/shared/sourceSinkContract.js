export const MOLECULAR_SOURCE_SINK_SCHEMA = 'peercompute.multiscale.molecular-source-sink.v0';
export const MOLECULAR_SOURCE_SINK_BALANCE_SCHEMA = 'peercompute.multiscale.molecular-source-sink-balance.v0';
export const MOLECULAR_SOURCE_EQUATION_SCHEMA = 'peercompute.multiscale.molecular-source-equation.v0';
export const MOLECULAR_PHASE_EOS_BASIS_SCHEMA = 'peercompute.multiscale.molecular-phase-eos-basis.v0';
export const MOLECULAR_CONSERVATIVE_TRANSFER_SCHEMA = 'peercompute.multiscale.molecular-conservative-transfer.v0';
export const MOLECULAR_TRANSFER_APPLICATION_SCHEMA = 'peercompute.multiscale.molecular-transfer-application.v0';
export const MOLECULAR_TRANSFER_TRANSACTION_SCHEMA = 'peercompute.multiscale.molecular-transfer-transaction.v0';
export const MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA = 'peercompute.multiscale.molecular-target-mutator-preview.v0';
export const MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA = 'peercompute.multiscale.molecular-target-mutator-registry.v0';
export const MOLECULAR_TARGET_MUTATION_PREFLIGHT_SCHEMA = 'peercompute.multiscale.molecular-target-mutation-preflight.v0';
export const MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA = 'peercompute.multiscale.molecular-target-mutation-operation-plan.v0';
export const MOLECULAR_TARGET_MUTATION_INVARIANT_CHECK_SCHEMA = 'peercompute.multiscale.molecular-target-mutation-invariant-check.v0';
export const MOLECULAR_TARGET_MUTATION_COMMIT_SCHEMA = 'peercompute.multiscale.molecular-target-mutation-commit.v0';
export const MOLECULAR_TARGET_MUTATION_DISPATCH_SCHEMA = 'peercompute.multiscale.molecular-target-mutation-dispatch.v0';
export const MOLECULAR_TARGET_MUTATION_APPLY_VALIDATION_SCHEMA = 'peercompute.multiscale.molecular-target-mutation-apply-validation.v0';
export const MOLECULAR_TARGET_MUTATION_APPLY_EXECUTION_SCHEMA = 'peercompute.multiscale.molecular-target-mutation-apply-execution.v0';
export const MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA = 'peercompute.multiscale.molecular-target-source-intake.v0';
export const MOLECULAR_TARGET_SOURCE_RESPONSE_SCHEMA = 'peercompute.multiscale.molecular-target-source-response.v0';
export const MOLECULAR_TARGET_SOURCE_RECONCILIATION_SCHEMA = 'peercompute.multiscale.molecular-target-source-reconciliation.v0';
export const MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA = 'peercompute.multiscale.molecular-conservative-source-buffer.v0';
export const MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA = 'peercompute.multiscale.molecular-source-buffer-application.v0';
export const MOLECULAR_SOURCE_BUFFER_APPLICATION_AGGREGATE_SCHEMA = 'peercompute.multiscale.molecular-source-buffer-application-aggregate.v0';
export const MOLECULAR_SOURCE_BUFFER_ACCEPTANCE_SCHEMA = 'peercompute.multiscale.molecular-source-buffer-acceptance.v0';
export const MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA = 'peercompute.multiscale.molecular-source-buffer-writeback-validation.v0';
export const MOLECULAR_TARGET_BUFFER_REPLAY_VALIDATION_SCHEMA = 'peercompute.multiscale.molecular-target-buffer-replay-validation.v0';
export const MOLECULAR_TARGET_BUFFER_MUTATION_AUDIT_SCHEMA = 'peercompute.multiscale.molecular-target-buffer-mutation-audit.v0';
export const MOLECULAR_TARGET_BUFFER_WORKER_WRITE_QUEUE_SCHEMA = 'peercompute.multiscale.molecular-target-buffer-worker-write-queue.v0';
export const MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA = 'peercompute.multiscale.molecular-target-buffer-worker-write-execution.v0';
export const MOLECULAR_TARGET_BUFFER_WORKER_WRITE_VERIFICATION_SCHEMA = 'peercompute.multiscale.molecular-target-buffer-worker-write-verification.v0';
export const MOLECULAR_SCIENTIFIC_INVARIANT_GATE_SCHEMA = 'peercompute.multiscale.molecular-scientific-invariant-gate.v0';
export const MOLECULAR_SCIENTIFIC_READINESS_MANIFEST_SCHEMA = 'peercompute.multiscale.molecular-scientific-readiness-manifest.v0';
export const QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA = 'peercompute.multiscale.quantum-statistical-source-equation.v0';
export const QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA = 'peercompute.multiscale.quantum-material-response-derivatives.v0';

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function rounded(value, digits = 4) {
  return Number(finite(value).toFixed(digits));
}

function copySpecies(species = {}) {
  const result = {};
  for (const [key, value] of Object.entries(species || {})) {
    const number = Number(value);
    if (Number.isFinite(number)) result[key] = number;
  }
  return result;
}

export function summarizeMolecularReactionSource(chemistry = {}) {
  const reactionSource = chemistry.reactionSource || {};
  const rates = reactionSource.rates || {};
  const heat = reactionSource.heat || {};
  const netHeatSourceProxy = finite(chemistry.reactionHeatSourceProxy, heat.netHeatSourceProxy || 0);
  const heatSourceProxy = finite(heat.heatSourceProxy, Math.max(0, netHeatSourceProxy));
  const coolingSinkProxy = finite(heat.coolingSinkProxy, Math.max(0, -netHeatSourceProxy));
  const speciesRateProxy = Math.abs(finite(chemistry.reactionSpeciesRateProxy, rates.speciesRateProxy || 0));
  const bondFormationRate = Math.max(0, finite(rates.bondFormationRate));
  const bondBreakageRate = Math.max(0, finite(rates.bondBreakageRate));
  const netBondRate = finite(rates.netBondRate);
  const reactionProgressRate = finite(rates.reactionProgressRate);
  const heatReleaseRateProxy = finite(rates.heatReleaseRateProxy);
  const eventIntensityProxy = Math.max(0, finite(reactionSource.eventIntensityProxy));
  const sourceDrive = clamp(
    Math.max(0, netHeatSourceProxy) * 18
      + Math.max(0, heatSourceProxy) * 8
      + speciesRateProxy * 0.006
      + bondFormationRate * 0.004
      + eventIntensityProxy * 0.18,
    0,
    1
  );
  const coolingDrive = clamp(
    Math.max(0, -netHeatSourceProxy) * 8
      + Math.max(0, coolingSinkProxy) * 6
      + bondBreakageRate * 0.002,
    0,
    1
  );
  return {
    schema: reactionSource.schema || null,
    active: reactionSource.schema === 'peercompute.multiscale.molecular-reaction-source.v0'
      || Math.abs(netHeatSourceProxy) > 0
      || speciesRateProxy > 0
      || bondFormationRate > 0
      || bondBreakageRate > 0,
    mode: reactionSource.mode || 'none',
    heatSourceProxy,
    coolingSinkProxy,
    netHeatSourceProxy,
    speciesRateProxy,
    bondFormationRate,
    bondBreakageRate,
    netBondRate,
    reactionProgressRate,
    heatReleaseRateProxy,
    eventIntensityProxy,
    sourceDrive,
    coolingDrive
  };
}

export function summarizeMolecularPhaseSource({ sourceClosure = null, molecular = {} } = {}) {
  const phase = sourceClosure?.phase || {};
  const thermodynamics = sourceClosure?.thermodynamics || {};
  const statePhaseFractions = sourceClosure?.state?.phaseFractions || {};
  const chemistry = sourceClosure?.chemistry || {};
  const ledger = chemistry.thermoPhaseLedger || sourceClosure?.state?.conserved?.thermoPhaseLedger || {};
  const fractions = phase.phaseFractions || ledger.phaseFractions || statePhaseFractions || {};
  const solidFraction = clamp(finite(molecular.solidFraction, phase.solidFraction ?? ledger.solidFraction ?? fractions.solid), 0, 1);
  const liquidFraction = clamp(finite(molecular.liquidFraction, phase.liquidFraction ?? ledger.liquidFraction ?? fractions.liquid), 0, 1);
  const vaporFraction = clamp(finite(molecular.vaporFraction, phase.vaporFraction ?? ledger.vaporFraction ?? fractions.vapor), 0, 1);
  const plasmaFraction = clamp(finite(molecular.plasmaFraction, phase.plasmaFraction ?? ledger.plasmaFraction ?? fractions.plasma), 0, 1);
  const waterMoleculeFraction = clamp(finite(molecular.waterMoleculeFraction, phase.waterMoleculeFraction ?? ledger.waterMoleculeFraction), 0, 1);
  const phaseChangeRateProxy = Math.max(0, finite(
    molecular.phaseChangeRateProxy,
    phase.phaseChangeRateProxy ?? ledger.phaseChangeRateProxy
  ));
  const latentHeatSinkProxy = Math.max(0, finite(
    molecular.latentHeatSinkProxy,
    phase.latentHeatSinkProxy ?? thermodynamics.latentHeatSinkProxy ?? ledger.latentHeatSinkProxy
  ));
  const latentHeatReleaseProxy = Math.max(0, finite(
    molecular.latentHeatReleaseProxy,
    phase.latentHeatReleaseProxy ?? thermodynamics.latentHeatReleaseProxy ?? ledger.latentHeatReleaseProxy
  ));
  const condensationOrderProxy = clamp(finite(
    molecular.condensationOrderProxy,
    phase.condensationOrderProxy ?? ledger.condensationOrderProxy
  ), 0, 1);
  const vaporizationDriveProxy = Math.max(0, finite(
    molecular.vaporizationDriveProxy,
    phase.vaporizationDriveProxy ?? ledger.vaporizationDriveProxy
  ));
  const freezingDriveProxy = Math.max(0, finite(
    molecular.freezingDriveProxy,
    phase.freezingDriveProxy ?? ledger.freezingDriveProxy
  ));
  const plasmaDriveProxy = Math.max(0, finite(
    molecular.plasmaDriveProxy,
    phase.plasmaDriveProxy ?? ledger.plasmaDriveProxy
  ));
  const phaseDriveProxy = clamp(
    phaseChangeRateProxy * 0.7
      + vaporizationDriveProxy * 0.18
      + freezingDriveProxy * 0.14
      + plasmaDriveProxy * 0.12
      + latentHeatSinkProxy * 0.08
      + latentHeatReleaseProxy * 0.08,
    0,
    1
  );
  const coolingDrive = clamp(
    waterMoleculeFraction * (solidFraction * 0.2 + liquidFraction * 0.22 + condensationOrderProxy * 0.16)
      + latentHeatSinkProxy * 0.1
      + freezingDriveProxy * 0.08,
    0,
    1
  );
  const heatingDrive = clamp(
    vaporFraction * 0.14
      + plasmaFraction * 0.2
      + vaporizationDriveProxy * 0.1
      + plasmaDriveProxy * 0.12
      + latentHeatReleaseProxy * 0.1,
    0,
    1
  );

  return {
    phaseRegime: molecular.phaseRegime || phase.phaseRegime || ledger.phaseRegime || 'unknown',
    phaseFractions: {
      solid: rounded(solidFraction, 6),
      liquid: rounded(liquidFraction, 6),
      vapor: rounded(vaporFraction, 6),
      plasma: rounded(plasmaFraction, 6)
    },
    solidFraction: rounded(solidFraction, 6),
    liquidFraction: rounded(liquidFraction, 6),
    vaporFraction: rounded(vaporFraction, 6),
    plasmaFraction: rounded(plasmaFraction, 6),
    waterMoleculeFraction: rounded(waterMoleculeFraction, 6),
    phaseChangeRateProxy: rounded(phaseChangeRateProxy, 6),
    latentHeatSinkProxy: rounded(latentHeatSinkProxy, 6),
    latentHeatReleaseProxy: rounded(latentHeatReleaseProxy, 6),
    condensationOrderProxy: rounded(condensationOrderProxy, 6),
    vaporizationDriveProxy: rounded(vaporizationDriveProxy, 6),
    freezingDriveProxy: rounded(freezingDriveProxy, 6),
    plasmaDriveProxy: rounded(plasmaDriveProxy, 6),
    phaseDriveProxy: rounded(phaseDriveProxy, 6),
    heatingDrive: rounded(heatingDrive, 6),
    coolingDrive: rounded(coolingDrive, 6),
    active: phaseDriveProxy > 0 || heatingDrive > 0 || coolingDrive > 0
  };
}

export function summarizeMolecularPhaseEosBasis({
  sourceClosure = null,
  molecular = {},
  environment = {},
  ambientTemperatureK = null,
  ambientPressurePa = null
} = {}) {
  const state = sourceClosure?.state || {};
  const env = {
    ...(state.environment || {}),
    ...(environment || {})
  };
  const chemistry = sourceClosure?.chemistry || {};
  const thermodynamics = sourceClosure?.thermodynamics || {};
  const phase = sourceClosure?.phase || {};
  const ledger = chemistry.thermoPhaseLedger
    || state.conserved?.thermoPhaseLedger
    || molecular.thermoPhaseLedger
    || {};
  const phaseSource = summarizeMolecularPhaseSource({ sourceClosure, molecular });
  const phaseFractions = phaseSource.phaseFractions || {};
  const dominantFraction = Math.max(
    finite(phaseFractions.solid),
    finite(phaseFractions.liquid),
    finite(phaseFractions.vapor),
    finite(phaseFractions.plasma)
  );
  const atomCount = Math.max(1, Math.round(finite(
    molecular.atomCount,
    chemistry.atomCount ?? ledger.atomCount ?? state.conserved?.atomCount ?? state.particleCount ?? 1
  )));
  const ambientK = Math.max(1, finite(
    ambientTemperatureK,
    env.ambientTemperatureK ?? thermodynamics.ambientTemperatureK ?? 294
  ));
  const temperatureK = Math.max(1, finite(
    molecular.temperatureK,
    thermodynamics.temperatureK
      ?? chemistry.meanTemperatureK
      ?? ledger.meanTemperatureK
      ?? state.primitive?.temperatureK
      ?? ambientK
  ));
  const ambientPa = Math.max(1, finite(
    ambientPressurePa,
    env.ambientPressurePa ?? thermodynamics.ambientPressurePa ?? 101325
  ));
  const pressureProxyPa = finite(
    molecular.pressureProxyPa,
    thermodynamics.pressurePa
      ?? molecular.pressurePa
      ?? state.primitive?.pressurePa
      ?? ambientPa
  );
  const pressureProxyDeltaPa = finite(
    molecular.pressureDeltaPa,
    phase.pressureProxy ?? ledger.pressureProxy ?? molecular.pressureProxy ?? 0
  ) * 1000;
  const pressurePa = Math.max(0, pressureProxyPa + pressureProxyDeltaPa);
  const densityFromPhase = Math.max(
    0.001,
    phaseSource.solidFraction * 917
      + phaseSource.liquidFraction * 997
      + phaseSource.vaporFraction * 0.6
      + phaseSource.plasmaFraction * 0.03
  );
  const densityKgM3 = Math.max(0.001, finite(
    molecular.densityKgM3,
    thermodynamics.densityKgM3 ?? state.primitive?.densityKgM3 ?? densityFromPhase
  ));
  const heatCapacityProxy = Math.max(0.000001, finite(
    molecular.heatCapacityProxy,
    thermodynamics.heatCapacityProxy
      ?? ledger.heatCapacityProxy
      ?? (Number.isFinite(Number(thermodynamics.heatCapacityJkgK))
        ? Number(thermodynamics.heatCapacityJkgK) / 4184
        : 0.001)
  ));
  const specificEnthalpyProxy = finite(
    molecular.specificEnthalpyProxy,
    thermodynamics.specificEnthalpyProxy
      ?? ledger.specificEnthalpyProxy
      ?? (Number.isFinite(Number(molecular.totalEnergyProxy)) ? Number(molecular.totalEnergyProxy) / atomCount : 0)
      ?? 0
  );
  const pressureWorkProxy = pressurePa / Math.max(1, densityKgM3) * 1e-6;
  const specificInternalEnergyProxy = finite(
    molecular.specificInternalEnergyProxy,
    thermodynamics.specificInternalEnergyJkg
      ?? thermodynamics.specificInternalEnergyProxy
      ?? specificEnthalpyProxy - pressureWorkProxy
  );
  const temperatureDeltaK = temperatureK - ambientK;
  const entropyProxy = finite(
    molecular.entropyProxy,
    thermodynamics.entropyProxy
      ?? heatCapacityProxy * Math.log(Math.max(1, temperatureK) / Math.max(1, ambientK))
      + phaseSource.phaseChangeRateProxy * 0.025
  );
  const latentHeatBudgetProxy = finite(
    molecular.latentHeatBudgetProxy,
    thermodynamics.latentHeatBudgetProxy
      ?? phaseSource.latentHeatReleaseProxy - phaseSource.latentHeatSinkProxy
  );
  const phaseStabilityResidualProxy = clamp(
    finite(
      molecular.phaseStabilityResidualProxy,
      thermodynamics.phaseStabilityResidualProxy
        ?? (1 - dominantFraction) * 0.54
          + phaseSource.phaseDriveProxy * 0.32
          + Math.min(1, Math.abs(temperatureDeltaK) / 2400) * 0.08
          + phaseSource.plasmaFraction * 0.06
    ),
    0,
    1
  );
  const specificFreeEnergyProxy = finite(
    molecular.specificFreeEnergyProxy,
    thermodynamics.specificFreeEnergyProxy
      ?? ledger.specificFreeEnergyProxy
      ?? specificEnthalpyProxy
        - entropyProxy * temperatureK * 0.001
        + pressureWorkProxy
        - latentHeatBudgetProxy / atomCount * 0.002
  );
  const phaseEnergyRateProxy = finite(
    molecular.phaseEnergyRateProxy,
    thermodynamics.phaseEnergyRateProxy
      ?? ledger.phaseEnergyRateProxy
      ?? heatCapacityProxy * temperatureDeltaK * Math.max(0, phaseSource.phaseDriveProxy) * 0.001
        + latentHeatBudgetProxy * 0.02
  );
  const sourceTemperatureDeltaKProxy = finite(
    molecular.sourceTemperatureDeltaKProxy,
    thermodynamics.sourceTemperatureDeltaKProxy ?? temperatureDeltaK
  );
  const thermalDrive = clamp(
    Math.max(0, phaseEnergyRateProxy) * 0.08
      + Math.max(0, sourceTemperatureDeltaKProxy) / 2600
      + phaseStabilityResidualProxy * 0.22
      + phaseSource.heatingDrive * 0.36
      - phaseSource.coolingDrive * 0.18,
    0,
    1
  );
  const coolingDrive = clamp(
    Math.max(0, -phaseEnergyRateProxy) * 0.08
      + Math.max(0, -sourceTemperatureDeltaKProxy) / 1800
      + phaseSource.coolingDrive * 0.38
      + phaseSource.latentHeatSinkProxy * 0.05,
    0,
    1
  );

  return {
    schema: MOLECULAR_PHASE_EOS_BASIS_SCHEMA,
    modelId: 'reduced-molecular-phase-eos-basis-v0',
    mode: 'free-energy-enthalpy-phase-source-proxy',
    status: 'interactive-proxy',
    active: phaseSource.active
      || Math.abs(phaseEnergyRateProxy) > 0
      || phaseStabilityResidualProxy > 0
      || Math.abs(sourceTemperatureDeltaKProxy) > 0.001,
    basis: {
      atomCount,
      temperatureK: rounded(temperatureK, 3),
      ambientTemperatureK: rounded(ambientK, 3),
      sourceTemperatureDeltaKProxy: rounded(sourceTemperatureDeltaKProxy, 6),
      pressurePa: rounded(pressurePa, 3),
      ambientPressurePa: rounded(ambientPa, 3),
      pressureDeltaPa: rounded(pressurePa - ambientPa, 6),
      densityKgM3: rounded(densityKgM3, 6),
      heatCapacityProxy: rounded(heatCapacityProxy, 9),
      specificInternalEnergyProxy: rounded(specificInternalEnergyProxy, 9),
      specificEnthalpyProxy: rounded(specificEnthalpyProxy, 9),
      entropyProxy: rounded(entropyProxy, 9),
      specificFreeEnergyProxy: rounded(specificFreeEnergyProxy, 9),
      pressureWorkProxy: rounded(pressureWorkProxy, 9),
      latentHeatBudgetProxy: rounded(latentHeatBudgetProxy, 9),
      latentHeatSinkProxy: rounded(phaseSource.latentHeatSinkProxy, 9),
      latentHeatReleaseProxy: rounded(phaseSource.latentHeatReleaseProxy, 9),
      unitStatus: 'mixed-reduced-proxy'
    },
    phase: {
      phaseRegime: phaseSource.phaseRegime,
      phaseFractions: { ...phaseSource.phaseFractions },
      dominantFraction: rounded(dominantFraction, 6),
      waterMoleculeFraction: rounded(phaseSource.waterMoleculeFraction, 6),
      phaseDriveProxy: rounded(phaseSource.phaseDriveProxy, 6),
      phaseStabilityResidualProxy: rounded(phaseStabilityResidualProxy, 6)
    },
    source: {
      phaseEnergyRateProxy: rounded(phaseEnergyRateProxy, 9),
      sourceTemperatureDeltaKProxy: rounded(sourceTemperatureDeltaKProxy, 6),
      thermalDrive: rounded(thermalDrive, 6),
      coolingDrive: rounded(coolingDrive, 6),
      signedDrive: rounded(thermalDrive - coolingDrive, 6)
    },
    validity: {
      status: 'interactive-proxy',
      confidence: 0.24,
      warnings: [
        'Reduced molecular phase EOS basis is a free-energy/enthalpy proxy, not a calibrated EOS table or thermodynamic integration.',
        'Scientific mode must replace this with validated phase diagrams, heat capacities, latent heats, and source-term tolerances.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_PHASE_EOS_BASIS_SCHEMA,
      generatedAt: Date.now()
    }
  };
}

export function summarizeQuantumMaterialPropertySource({ sourceClosure = null, molecular = {} } = {}) {
  const chemistry = sourceClosure?.chemistry || {};
  const stateFields = sourceClosure?.state?.fields || {};
  const mechanics = sourceClosure?.mechanics || {};
  const electromagnetics = sourceClosure?.electromagnetics || {};
  const propertyResponse = molecular.quantumMaterialSourcePropertyResponse
    || molecular.quantumMaterialPropertyResponse
    || molecular.propertyResponse
    || chemistry.quantumMaterialPropertyResponse
    || stateFields.quantumMaterialPropertyResponse
    || molecular.quantumMaterialSource?.propertyResponse
    || chemistry.quantumMaterialSource?.propertyResponse
    || (molecular.schema === 'peercompute.multiscale.quantum-material-property-response.v0' ? molecular : null)
    || null;
  const quantumMaterialSource = molecular.quantumMaterialSource || chemistry.quantumMaterialSource || {};
  const active = molecular.quantumMaterialSourceApplied === true
    || molecular.active === true
    || molecular.quantumMaterialPropertyActive === true
    || quantumMaterialSource.applied === true
    || propertyResponse?.schema === 'peercompute.multiscale.quantum-material-property-response.v0';
  const electricalConductivitySpm = Math.max(0, finite(
    molecular.quantumMaterialSourceElectricalConductivitySpm
      ?? molecular.quantumMaterialPropertyElectricalConductivitySpm
      ?? molecular.electricalConductivitySpm,
    chemistry.quantumMaterialElectricalConductivitySpm
      ?? stateFields.quantumMaterialElectricalConductivitySpm
      ?? propertyResponse?.meanElectricalConductivitySpm
      ?? quantumMaterialSource.electricalConductivitySpm
      ?? electromagnetics.electricalConductivitySpm
  ));
  const dielectricConstant = Math.max(1, finite(
    molecular.quantumMaterialSourceDielectricConstant
      ?? molecular.quantumMaterialPropertyDielectricConstant
      ?? molecular.dielectricConstant,
    chemistry.quantumMaterialDielectricConstant
      ?? stateFields.quantumMaterialDielectricConstant
      ?? propertyResponse?.meanDielectricConstant
      ?? quantumMaterialSource.dielectricConstant
      ?? electromagnetics.dielectricConstant
      ?? 1
  ));
  const refractiveIndex = Math.max(1, finite(
    molecular.quantumMaterialSourceRefractiveIndex
      ?? molecular.quantumMaterialPropertyRefractiveIndex
      ?? molecular.refractiveIndex,
    chemistry.quantumMaterialRefractiveIndex
      ?? stateFields.quantumMaterialRefractiveIndex
      ?? propertyResponse?.meanRefractiveIndex
      ?? quantumMaterialSource.refractiveIndex
      ?? 1
  ));
  const mechanicalResponsePa = Math.max(0, finite(
    molecular.quantumMaterialSourceMechanicalResponsePa
      ?? molecular.quantumMaterialPropertyMechanicalResponsePa
      ?? molecular.mechanicalResponsePa,
    chemistry.quantumMaterialMechanicalResponsePa
      ?? stateFields.quantumMaterialMechanicalResponsePa
      ?? propertyResponse?.meanMechanicalResponsePa
      ?? quantumMaterialSource.mechanicalResponsePa
      ?? mechanics.bulkModulusPa
      ?? mechanics.youngsModulusPa
  ));
  const bulkModulusPa = Math.max(0, finite(
    molecular.quantumMaterialSourceBulkModulusPa
      ?? molecular.quantumMaterialPropertyBulkModulusPa
      ?? molecular.bulkModulusPa,
    chemistry.quantumMaterialBulkModulusPa
      ?? stateFields.quantumMaterialBulkModulusPa
      ?? propertyResponse?.meanBulkModulusPa
      ?? quantumMaterialSource.bulkModulusPa
      ?? mechanics.bulkModulusPa
      ?? mechanicalResponsePa
  ));
  const youngsModulusPa = Math.max(0, finite(
    molecular.quantumMaterialSourceYoungsModulusPa
      ?? molecular.quantumMaterialPropertyYoungsModulusPa
      ?? molecular.youngsModulusPa,
    chemistry.quantumMaterialYoungsModulusPa
      ?? stateFields.quantumMaterialYoungsModulusPa
      ?? propertyResponse?.meanYoungsModulusPa
      ?? quantumMaterialSource.youngsModulusPa
      ?? mechanics.youngsModulusPa
      ?? mechanicalResponsePa
  ));
  const opticalAbsorptionProxy = Math.max(0, finite(
    molecular.quantumMaterialSourceOpticalAbsorptionProxy
      ?? molecular.quantumMaterialPropertyOpticalAbsorptionProxy
      ?? molecular.opticalAbsorptionProxy,
    chemistry.quantumMaterialOpticalAbsorptionProxy
      ?? stateFields.quantumMaterialOpticalAbsorptionProxy
      ?? propertyResponse?.meanOpticalAbsorptionProxy
      ?? quantumMaterialSource.opticalAbsorptionProxy
  ));
  const conductivityDrive = clamp(finite(
    molecular.quantumMaterialSourceConductivityDrive
      ?? molecular.quantumMaterialPropertyConductivityDrive
      ?? molecular.conductivityDrive,
    chemistry.quantumMaterialConductivityDrive ?? stateFields.quantumMaterialConductivityDrive
  ), 0, 2);
  const dielectricDrive = clamp(finite(
    molecular.quantumMaterialSourceDielectricDrive
      ?? molecular.quantumMaterialPropertyDielectricDrive
      ?? molecular.dielectricDrive,
    chemistry.quantumMaterialDielectricDrive ?? stateFields.quantumMaterialDielectricDrive
  ), 0, 2);
  const mechanicalStiffnessDrive = clamp(finite(
    molecular.quantumMaterialSourceMechanicalStiffnessDrive
      ?? molecular.quantumMaterialPropertyMechanicalStiffnessDrive
      ?? molecular.mechanicalStiffnessDrive,
    chemistry.quantumMaterialMechanicalStiffnessDrive ?? stateFields.quantumMaterialMechanicalStiffnessDrive
  ), 0, 2);
  const opticalAbsorptionDrive = clamp(finite(
    molecular.quantumMaterialSourceOpticalAbsorptionDrive
      ?? molecular.quantumMaterialPropertyOpticalAbsorptionDrive
      ?? molecular.opticalAbsorptionDrive,
    chemistry.quantumMaterialOpticalAbsorptionDrive ?? stateFields.quantumMaterialOpticalAbsorptionDrive
  ), 0, 2);
  const electricalDrive = clamp(finite(
    molecular.quantumMaterialPropertyElectricalDrive ?? molecular.electricalDrive,
    conductivityDrive
      + Math.log10(1 + electricalConductivitySpm) / 10
      + (dielectricConstant - 1) / 64
  ),
    0,
    1.5
  );
  const opticalHeatingDrive = clamp(finite(
    molecular.quantumMaterialPropertyOpticalHeatingDrive ?? molecular.opticalHeatingDrive,
    opticalAbsorptionDrive
      + Math.max(0, refractiveIndex - 1) * 0.04
      + opticalAbsorptionProxy * 0.015
  ),
    0,
    1.5
  );
  const phaseDriveBoostProxy = clamp(finite(
    molecular.quantumMaterialPropertyPhaseDriveBoostProxy ?? molecular.phaseDriveBoostProxy,
    dielectricDrive * 0.08
      + conductivityDrive * 0.04
      + opticalHeatingDrive * 0.06
  ),
    0,
    0.25
  );
  const thermalFluxBoostProxy = clamp(finite(
    molecular.quantumMaterialPropertyThermalFluxBoostProxy ?? molecular.thermalFluxBoostProxy,
    opticalHeatingDrive * 120
      + electricalDrive * 64
      + Math.max(0, refractiveIndex - 1) * 18
  ),
    0,
    420
  );
  const materialDampingScale = clamp(finite(
    molecular.quantumMaterialPropertyDampingScale
      ?? molecular.quantumMaterialPropertyMaterialDampingScale
      ?? molecular.materialDampingScale,
    1 + mechanicalStiffnessDrive * 0.08 - opticalHeatingDrive * 0.03,
  ),
    0.85,
    1.18
  );
  return {
    schema: propertyResponse?.schema || null,
    modelId: propertyResponse?.modelId || null,
    active,
    status: active ? 'qmat-property-source-ready' : 'inactive',
    calibrated: propertyResponse?.calibrated === true,
    backend: propertyResponse?.backend || quantumMaterialSource.backend || null,
    recordCount: Math.max(0, Math.round(finite(propertyResponse?.recordCount, quantumMaterialSource.recordCount))),
    electricalConductivitySpm: rounded(electricalConductivitySpm, 12),
    dielectricConstant: rounded(dielectricConstant, 6),
    refractiveIndex: rounded(refractiveIndex, 6),
    mechanicalResponsePa: rounded(mechanicalResponsePa, 6),
    bulkModulusPa: rounded(bulkModulusPa, 6),
    youngsModulusPa: rounded(youngsModulusPa, 6),
    opticalAbsorptionProxy: rounded(opticalAbsorptionProxy, 9),
    conductivityDrive: rounded(conductivityDrive, 9),
    dielectricDrive: rounded(dielectricDrive, 9),
    mechanicalStiffnessDrive: rounded(mechanicalStiffnessDrive, 9),
    opticalAbsorptionDrive: rounded(opticalAbsorptionDrive, 9),
    electricalDrive: rounded(electricalDrive, 9),
    opticalHeatingDrive: rounded(opticalHeatingDrive, 9),
    phaseDriveBoostProxy: rounded(phaseDriveBoostProxy, 9),
    thermalFluxBoostProxy: rounded(thermalFluxBoostProxy, 6),
    materialDampingScale: rounded(materialDampingScale, 6)
  };
}

export function summarizeQuantumMaterialResponseDerivativeSource({ sourceClosure = null, molecular = {} } = {}) {
  const chemistry = sourceClosure?.chemistry || {};
  const stateFields = sourceClosure?.state?.fields || {};
  const quantumMaterialSource = molecular.quantumMaterialSource || chemistry.quantumMaterialSource || {};
  const derivativeBundle = molecular.quantumMaterialSourceResponseDerivatives
    || molecular.quantumMaterialResponseDerivatives
    || molecular.responseDerivatives
    || chemistry.quantumMaterialResponseDerivatives
    || stateFields.quantumMaterialResponseDerivatives
    || quantumMaterialSource.responseDerivatives
    || molecular.quantumMaterialSource?.responseDerivatives
    || chemistry.quantumMaterialSource?.responseDerivatives
    || (molecular.schema === QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA ? molecular : null)
    || null;
  const jacobian = derivativeBundle?.jacobian || {};
  const active = molecular.quantumMaterialSourceResponseDerivativeApplied === true
    || molecular.quantumMaterialResponseDerivativeActive === true
    || molecular.active === true
    || quantumMaterialSource.responseDerivativeApplied === true
    || derivativeBundle?.schema === QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA;
  const densityTemperatureDerivativeKgM3PerK = finite(
    molecular.quantumMaterialSourceDensityTemperatureDerivativeKgM3PerK
      ?? molecular.quantumMaterialResponseDerivativeDensityTemperatureDerivativeKgM3PerK
      ?? molecular.densityTemperatureDerivativeKgM3PerK,
    chemistry.quantumMaterialDensityTemperatureDerivativeKgM3PerK
      ?? stateFields.quantumMaterialDensityTemperatureDerivativeKgM3PerK
      ?? derivativeBundle?.meanDensityTemperatureDerivativeKgM3PerK
      ?? jacobian.densityTemperatureDerivativeKgM3PerK
      ?? quantumMaterialSource.densityTemperatureDerivativeKgM3PerK
  );
  const mechanicalPressureDerivativePaPerLog2Pressure = finite(
    molecular.quantumMaterialSourceMechanicalPressureDerivativePaPerLog2Pressure
      ?? molecular.quantumMaterialResponseDerivativeMechanicalPressureDerivativePaPerLog2Pressure
      ?? molecular.mechanicalPressureDerivativePaPerLog2Pressure,
    chemistry.quantumMaterialMechanicalPressureDerivativePaPerLog2Pressure
      ?? stateFields.quantumMaterialMechanicalPressureDerivativePaPerLog2Pressure
      ?? derivativeBundle?.meanMechanicalPressureDerivativePaPerLog2Pressure
      ?? jacobian.mechanicalPressureDerivativePaPerLog2Pressure
      ?? quantumMaterialSource.mechanicalPressureDerivativePaPerLog2Pressure
  );
  const conductivityFieldDerivativeSpmPerNorm = finite(
    molecular.quantumMaterialSourceConductivityFieldDerivativeSpmPerNorm
      ?? molecular.quantumMaterialResponseDerivativeConductivityFieldDerivativeSpmPerNorm
      ?? molecular.conductivityFieldDerivativeSpmPerNorm,
    chemistry.quantumMaterialConductivityFieldDerivativeSpmPerNorm
      ?? stateFields.quantumMaterialConductivityFieldDerivativeSpmPerNorm
      ?? derivativeBundle?.meanConductivityFieldDerivativeSpmPerNorm
      ?? jacobian.conductivityFieldDerivativeSpmPerNorm
      ?? quantumMaterialSource.conductivityFieldDerivativeSpmPerNorm
  );
  const opacityRadiationDerivativePerNorm = finite(
    molecular.quantumMaterialSourceOpacityRadiationDerivativePerNorm
      ?? molecular.quantumMaterialResponseDerivativeOpacityRadiationDerivativePerNorm
      ?? molecular.opacityRadiationDerivativePerNorm,
    chemistry.quantumMaterialOpacityRadiationDerivativePerNorm
      ?? stateFields.quantumMaterialOpacityRadiationDerivativePerNorm
      ?? derivativeBundle?.meanOpacityRadiationDerivativePerNorm
      ?? jacobian.opacityRadiationDerivativePerNorm
      ?? quantumMaterialSource.opacityRadiationDerivativePerNorm
  );
  const temperatureDrive = clamp(finite(
    molecular.quantumMaterialSourceResponseDerivativeTemperatureDrive
      ?? molecular.quantumMaterialResponseDerivativeTemperatureDrive
      ?? molecular.temperatureDrive,
    chemistry.quantumMaterialResponseDerivativeTemperatureDrive
      ?? stateFields.quantumMaterialResponseDerivativeTemperatureDrive
      ?? derivativeBundle?.temperatureDrive
      ?? quantumMaterialSource.responseDerivativeTemperatureDrive
  ), 0, 1);
  const pressureDrive = clamp(finite(
    molecular.quantumMaterialSourceResponseDerivativePressureDrive
      ?? molecular.quantumMaterialResponseDerivativePressureDrive
      ?? molecular.pressureDrive,
    chemistry.quantumMaterialResponseDerivativePressureDrive
      ?? stateFields.quantumMaterialResponseDerivativePressureDrive
      ?? derivativeBundle?.pressureDrive
      ?? quantumMaterialSource.responseDerivativePressureDrive
  ), 0, 1);
  const fieldDrive = clamp(finite(
    molecular.quantumMaterialSourceResponseDerivativeFieldDrive
      ?? molecular.quantumMaterialResponseDerivativeFieldDrive
      ?? molecular.fieldDrive,
    chemistry.quantumMaterialResponseDerivativeFieldDrive
      ?? stateFields.quantumMaterialResponseDerivativeFieldDrive
      ?? derivativeBundle?.fieldDrive
      ?? quantumMaterialSource.responseDerivativeFieldDrive
  ), 0, 1);
  const radiationDrive = clamp(finite(
    molecular.quantumMaterialSourceResponseDerivativeRadiationDrive
      ?? molecular.quantumMaterialResponseDerivativeRadiationDrive
      ?? molecular.radiationDrive,
    chemistry.quantumMaterialResponseDerivativeRadiationDrive
      ?? stateFields.quantumMaterialResponseDerivativeRadiationDrive
      ?? derivativeBundle?.radiationDrive
      ?? quantumMaterialSource.responseDerivativeRadiationDrive
  ), 0, 1);
  const thermalFluxDerivativeBoostProxy = clamp(finite(
    molecular.quantumMaterialResponseDerivativeThermalFluxBoostProxy
      ?? molecular.thermalFluxDerivativeBoostProxy,
    temperatureDrive * 72
      + radiationDrive * 96
      + fieldDrive * 44
      + Math.max(0, opacityRadiationDerivativePerNorm) * 10
  ), 0, 320);
  const phaseDerivativeDriveBoostProxy = clamp(finite(
    molecular.quantumMaterialResponseDerivativePhaseDriveBoostProxy
      ?? molecular.phaseDerivativeDriveBoostProxy,
    temperatureDrive * 0.08
      + pressureDrive * 0.08
      + radiationDrive * 0.04
  ), 0, 0.24);
  const electricalDerivativeDrive = clamp(finite(
    molecular.quantumMaterialResponseDerivativeElectricalDrive
      ?? molecular.electricalDerivativeDrive,
    fieldDrive + Math.max(0, conductivityFieldDerivativeSpmPerNorm) * 0.0004
  ), 0, 1.5);
  const mechanicalDerivativeDrive = clamp(finite(
    molecular.quantumMaterialResponseDerivativeMechanicalDrive
      ?? molecular.mechanicalDerivativeDrive,
    pressureDrive + Math.max(0, mechanicalPressureDerivativePaPerLog2Pressure) * 1e-12
  ), 0, 1.5);
  const opticalDerivativeDrive = clamp(finite(
    molecular.quantumMaterialResponseDerivativeOpticalDrive
      ?? molecular.opticalDerivativeDrive,
    radiationDrive + Math.max(0, opacityRadiationDerivativePerNorm) * 0.04
  ), 0, 1.5);
  const materialDerivativeDampingScale = clamp(finite(
    molecular.quantumMaterialResponseDerivativeDampingScale
      ?? molecular.materialDerivativeDampingScale,
    1 + pressureDrive * 0.04 - temperatureDrive * 0.03 + fieldDrive * 0.01
  ), 0.85, 1.18);
  return {
    schema: derivativeBundle?.schema || (active ? QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA : null),
    modelId: derivativeBundle?.modelId || null,
    active,
    status: active ? 'qmat-response-derivative-source-ready' : 'inactive',
    calibrated: derivativeBundle?.calibrated === true,
    backend: derivativeBundle?.backend || quantumMaterialSource.backend || null,
    recordCount: Math.max(0, Math.round(finite(derivativeBundle?.recordCount, quantumMaterialSource.recordCount))),
    responseDerivatives: derivativeBundle ? { ...derivativeBundle } : null,
    densityTemperatureDerivativeKgM3PerK: rounded(densityTemperatureDerivativeKgM3PerK, 9),
    mechanicalPressureDerivativePaPerLog2Pressure: rounded(mechanicalPressureDerivativePaPerLog2Pressure, 6),
    conductivityFieldDerivativeSpmPerNorm: rounded(conductivityFieldDerivativeSpmPerNorm, 12),
    opacityRadiationDerivativePerNorm: rounded(opacityRadiationDerivativePerNorm, 9),
    temperatureDrive: rounded(temperatureDrive, 9),
    pressureDrive: rounded(pressureDrive, 9),
    fieldDrive: rounded(fieldDrive, 9),
    radiationDrive: rounded(radiationDrive, 9),
    thermalFluxDerivativeBoostProxy: rounded(thermalFluxDerivativeBoostProxy, 6),
    phaseDerivativeDriveBoostProxy: rounded(phaseDerivativeDriveBoostProxy, 9),
    electricalDerivativeDrive: rounded(electricalDerivativeDrive, 9),
    mechanicalDerivativeDrive: rounded(mechanicalDerivativeDrive, 9),
    opticalDerivativeDrive: rounded(opticalDerivativeDrive, 9),
    materialDerivativeDampingScale: rounded(materialDerivativeDampingScale, 6)
  };
}

export function summarizeQuantumMaterialStatisticalSource({ source = {}, molecular = {} } = {}) {
  const equation = source.statisticalSourceEquation
    || source.quantumMaterialSourceStatisticalSourceEquation
    || molecular.statisticalSourceEquation
    || molecular.quantumMaterialSourceStatisticalSourceEquation
    || null;
  const terms = equation?.sourceTerms || {};
  const channelCount = Math.max(0, Math.round(finite(
    source.statisticalSourceChannelCount
      ?? source.quantumMaterialSourceStatisticalSourceChannelCount
      ?? source.channelCount
      ?? molecular.statisticalSourceChannelCount
      ?? molecular.quantumMaterialSourceStatisticalSourceChannelCount
      ?? molecular.channelCount
      ?? equation?.channelCount
      ?? equation?.channels?.length
  )));
  const pressureDriveProxy = clamp(finite(
    source.statisticalSourcePressureDriveProxy
      ?? source.quantumMaterialSourceStatisticalPressureDriveProxy
      ?? source.pressureDriveProxy
      ?? molecular.statisticalSourcePressureDriveProxy
      ?? molecular.quantumMaterialSourceStatisticalPressureDriveProxy
      ?? molecular.pressureDriveProxy
      ?? terms.pressureDriveProxy
  ), -1, 1);
  const opacityDriveProxy = clamp(finite(
    source.statisticalSourceOpacityDriveProxy
      ?? source.quantumMaterialSourceStatisticalOpacityDriveProxy
      ?? source.opacityDriveProxy
      ?? molecular.statisticalSourceOpacityDriveProxy
      ?? molecular.quantumMaterialSourceStatisticalOpacityDriveProxy
      ?? molecular.opacityDriveProxy
      ?? terms.opacityDriveProxy
  ), 0, 2);
  const ionizationDriveProxy = clamp(finite(
    source.statisticalSourceIonizationDriveProxy
      ?? source.quantumMaterialSourceStatisticalIonizationDriveProxy
      ?? source.ionizationDriveProxy
      ?? molecular.statisticalSourceIonizationDriveProxy
      ?? molecular.quantumMaterialSourceStatisticalIonizationDriveProxy
      ?? molecular.ionizationDriveProxy
      ?? terms.ionizationDriveProxy
  ), 0, 1);
  const degeneracyPressureDriveProxy = clamp(finite(
    source.statisticalSourceDegeneracyPressureDriveProxy
      ?? source.quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy
      ?? source.degeneracyPressureDriveProxy
      ?? molecular.statisticalSourceDegeneracyPressureDriveProxy
      ?? molecular.quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy
      ?? molecular.degeneracyPressureDriveProxy
      ?? terms.degeneracyPressureDriveProxy
  ), 0, 1);
  const temperatureDeltaKProxy = clamp(finite(
    source.statisticalSourceTemperatureDeltaKProxy
      ?? source.quantumMaterialSourceStatisticalTemperatureDeltaKProxy
      ?? source.temperatureDeltaKProxy
      ?? molecular.statisticalSourceTemperatureDeltaKProxy
      ?? molecular.quantumMaterialSourceStatisticalTemperatureDeltaKProxy
      ?? molecular.temperatureDeltaKProxy
      ?? terms.temperatureDeltaKProxy
  ), -80, 80);
  const chargeDeltaProxy = clamp(finite(
    source.statisticalSourceChargeDeltaProxy
      ?? source.quantumMaterialSourceStatisticalChargeDeltaProxy
      ?? source.chargeDeltaProxy
      ?? molecular.statisticalSourceChargeDeltaProxy
      ?? molecular.quantumMaterialSourceStatisticalChargeDeltaProxy
      ?? molecular.chargeDeltaProxy
      ?? terms.chargeDeltaProxy
  ), -0.25, 0.25);
  const thermalDampingScale = clamp(finite(
    source.statisticalSourceThermalDampingScale
      ?? source.quantumMaterialSourceStatisticalThermalDampingScale
      ?? source.thermalDampingScale
      ?? molecular.statisticalSourceThermalDampingScale
      ?? molecular.quantumMaterialSourceStatisticalThermalDampingScale
      ?? molecular.thermalDampingScale
      ?? terms.thermalDampingScale,
    1
  ), 0.5, 1.5);
  const heatCapacityProxy = clamp(finite(
    source.statisticalSourceHeatCapacityProxy
      ?? source.quantumMaterialSourceHeatCapacityProxy
      ?? source.heatCapacityProxy
      ?? molecular.statisticalSourceHeatCapacityProxy
      ?? molecular.quantumMaterialSourceHeatCapacityProxy
      ?? molecular.heatCapacityProxy
      ?? terms.heatCapacityProxy
  ), 0, 64);
  const pressureRatio = clamp(finite(
    source.statisticalSourcePressureRatio
      ?? source.quantumMaterialSourceEnsemblePressureRatio
      ?? source.pressureRatio
      ?? molecular.statisticalSourcePressureRatio
      ?? molecular.quantumMaterialSourceEnsemblePressureRatio
      ?? molecular.pressureRatio
      ?? terms.pressureRatio,
    1
  ), 0.001, 1000);
  const active = equation?.schema === QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA
    || channelCount > 0
    || Math.abs(pressureDriveProxy) > 0
    || opacityDriveProxy > 0
    || ionizationDriveProxy > 0
    || degeneracyPressureDriveProxy > 0
    || Math.abs(temperatureDeltaKProxy) > 0
    || Math.abs(chargeDeltaProxy) > 0
    || Math.abs(thermalDampingScale - 1) > 1e-9;
  return {
    schema: equation?.schema
      || source.sourceEquationSchema
      || source.statisticalSourceEquationSchema
      || molecular.sourceEquationSchema
      || molecular.statisticalSourceEquationSchema
      || (active ? QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA : null),
    active,
    status: active ? 'qstat-source-ready' : 'inactive',
    sourceEquation: equation ? { ...equation } : null,
    sourceEquationSchema: equation?.schema
      || source.sourceEquationSchema
      || source.statisticalSourceEquationSchema
      || molecular.sourceEquationSchema
      || molecular.statisticalSourceEquationSchema
      || null,
    channelCount,
    pressureDriveProxy: rounded(pressureDriveProxy, 9),
    opacityDriveProxy: rounded(opacityDriveProxy, 9),
    ionizationDriveProxy: rounded(ionizationDriveProxy, 9),
    degeneracyPressureDriveProxy: rounded(degeneracyPressureDriveProxy, 9),
    temperatureDeltaKProxy: rounded(temperatureDeltaKProxy, 6),
    chargeDeltaProxy: rounded(chargeDeltaProxy, 9),
    thermalDampingScale: rounded(thermalDampingScale, 6),
    heatCapacityProxy: rounded(heatCapacityProxy, 9),
    pressureRatio: rounded(pressureRatio, 9)
  };
}

export function createMolecularSourceSinkReport({
  sourceClosure = null,
  molecular = {},
  targetSolverId = 'unknown',
  targetStateKey = null,
  targetLayer = 'unknown',
  targetField = 'heat-source',
  targetSequence = null,
  ambientTemperatureK = 294,
  ambientPressurePa = null,
  heatFluxProxy = null,
  thermalDrive = null
} = {}) {
  const chemistry = sourceClosure?.chemistry || {};
  const thermodynamics = sourceClosure?.thermodynamics || {};
  const source = sourceClosure?.source || {};
  const state = sourceClosure?.state || {};
  const reactionLedger = chemistry.reactionLedger || {};
  const reactionEventLedger = chemistry.reactionEventLedger || {};
  const reactionSourceSummary = summarizeMolecularReactionSource(chemistry);
  const phaseSourceSummary = summarizeMolecularPhaseSource({ sourceClosure, molecular });
  const quantumMaterialPropertySource = summarizeQuantumMaterialPropertySource({ sourceClosure, molecular });
  const quantumMaterialStatisticalSource = summarizeQuantumMaterialStatisticalSource({
    source: molecular,
    molecular: sourceClosure?.state?.fields || sourceClosure?.chemistry?.quantumMaterialSource || molecular
  });
  const quantumMaterialResponseDerivativeSource = summarizeQuantumMaterialResponseDerivativeSource({
    sourceClosure,
    molecular
  });
  const phaseEosBasis = summarizeMolecularPhaseEosBasis({
    sourceClosure,
    molecular,
    environment: {
      ambientTemperatureK,
      ambientPressurePa: ambientPressurePa ?? sourceClosure?.state?.environment?.ambientPressurePa
    },
    ambientTemperatureK,
    ambientPressurePa
  });
  const species = copySpecies(molecular.species || chemistry.species || state.species || {});
  const molecularSpecies = copySpecies(chemistry.molecularSpecies || reactionLedger.species || {});
  const moleculeSpeciesDelta = copySpecies(chemistry.moleculeSpeciesDelta || reactionEventLedger.moleculeSpeciesDelta || {});
  const atomCount = Math.max(1, finite(molecular.atomCount, chemistry.atomCount || state.particleCount || 1));
  const heatReleaseProxy = clamp(finite(molecular.heatReleaseProxy, chemistry.heatReleaseProxy), 0, 6);
  const reactionProgress = clamp(finite(molecular.reactionProgress, chemistry.reactionProgress), 0, 1);
  const ionizationFraction = clamp(finite(molecular.ionizationFraction, chemistry.ionizationFraction), 0, 1);
  const drive = clamp(finite(thermalDrive, molecular.thermalDrive), 0, 1);
  const heatFlux = Math.max(0, finite(heatFluxProxy, molecular.radiativeHeatFluxBoost));
  const temperatureK = finite(
    molecular.temperatureK,
    thermodynamics.temperatureK ?? chemistry.meanTemperatureK ?? ambientTemperatureK
  );
  const ambientK = Math.max(1, finite(ambientTemperatureK, thermodynamics.ambientTemperatureK ?? 294));
  const temperatureExcessK = Math.max(0, temperatureK - ambientK);
  const carbonFraction = clamp(finite(molecular.carbonFraction, species.C / atomCount), 0, 1);
  const stoichiometryResidualProxy = clamp(finite(
    chemistry.stoichiometryResidualProxy,
    reactionLedger.stoichiometryResidualProxy || 0
  ), 0, 1);
  const energyResidualProxy = clamp(
    heatFlux * 0.00002
      + drive * 0.02
      + heatReleaseProxy * 0.003
      + phaseSourceSummary.phaseDriveProxy * 0.012
      + phaseSourceSummary.latentHeatSinkProxy * 0.004
      + phaseSourceSummary.latentHeatReleaseProxy * 0.004
      + quantumMaterialPropertySource.thermalFluxBoostProxy * 0.00001
      + quantumMaterialPropertySource.phaseDriveBoostProxy * 0.02
      + quantumMaterialResponseDerivativeSource.thermalFluxDerivativeBoostProxy * 0.000006
      + quantumMaterialResponseDerivativeSource.phaseDerivativeDriveBoostProxy * 0.018,
    0,
    1
  );
  const speciesResidualProxy = clamp(
    reactionProgress * 0.02 + ionizationFraction * 0.04 + carbonFraction * 0.015 + stoichiometryResidualProxy * 0.35,
    0,
    1
  );

  return {
    schema: MOLECULAR_SOURCE_SINK_SCHEMA,
    mode: 'reduced-open-system-molecular-source-v0',
    source: {
      solverId: source.solverId || 'molecular-dynamics',
      modelId: sourceClosure?.modelId || molecular.modelId || null,
      stateKey: source.stateKey || state.stateKey || molecular.sourceStateKey || null,
      sequence: source.sequence ?? state.sequence ?? molecular.sourceSequence ?? null,
      closureSchema: sourceClosure?.schema || null
    },
    target: {
      solverId: targetSolverId,
      stateKey: targetStateKey,
      sequence: targetSequence,
      layer: targetLayer,
      field: targetField
    },
    energy: {
      thermalDrive: rounded(drive, 6),
      heatFluxProxyWm2: rounded(heatFlux, 6),
      heatReleaseProxy: rounded(heatReleaseProxy, 6),
      reactionHeatSourceProxy: rounded(
        reactionSourceSummary.netHeatSourceProxy,
        6
      ),
      reactionSourceDrive: rounded(reactionSourceSummary.sourceDrive, 6),
      reactionCoolingDrive: rounded(reactionSourceSummary.coolingDrive, 6),
      phaseEosEnergyRateProxy: rounded(phaseEosBasis.source.phaseEnergyRateProxy, 6),
      phaseEosTemperatureDeltaKProxy: rounded(phaseEosBasis.source.sourceTemperatureDeltaKProxy, 6),
      phaseEosStabilityResidualProxy: rounded(phaseEosBasis.phase.phaseStabilityResidualProxy, 6),
      phaseEosLatentHeatBudgetProxy: rounded(phaseEosBasis.basis.latentHeatBudgetProxy, 6),
      sourceTemperatureK: rounded(temperatureK, 3),
      ambientTemperatureK: rounded(ambientK, 3),
      temperatureExcessK: rounded(temperatureExcessK, 3)
    },
    species: {
      atomCount,
      carbonFraction: rounded(carbonFraction, 6),
      reactionProgress: rounded(reactionProgress, 6),
      ionizationFraction: rounded(ionizationFraction, 6),
      species,
      molecularSpecies,
      moleculeSpeciesDelta,
      dominantMolecule: chemistry.dominantMolecule || reactionLedger.dominantFormula || null,
      reactionEventCount: finite(chemistry.reactionEventCount, reactionEventLedger.bondEventCount || 0),
      formedBondCount: finite(chemistry.formedBondCount, reactionEventLedger.formedBondCount || 0),
      brokenBondCount: finite(chemistry.brokenBondCount, reactionEventLedger.brokenBondCount || 0),
      reactionSpeciesRateProxy: rounded(
        reactionSourceSummary.speciesRateProxy,
        6
      ),
      reactionSourceEventIntensity: rounded(reactionSourceSummary.eventIntensityProxy, 6),
      stoichiometryResidualProxy: rounded(stoichiometryResidualProxy, 6),
      stoichiometryClosed: reactionLedger.stoichiometryClosed === true && stoichiometryResidualProxy <= 0.05
    },
    phase: phaseSourceSummary,
    phaseEos: phaseEosBasis,
    material: {
      quantumMaterialPropertySource,
      thermalFluxBoostProxy: quantumMaterialPropertySource.thermalFluxBoostProxy,
      phaseDriveBoostProxy: quantumMaterialPropertySource.phaseDriveBoostProxy,
      electricalDrive: quantumMaterialPropertySource.electricalDrive,
      opticalHeatingDrive: quantumMaterialPropertySource.opticalHeatingDrive,
      mechanicalStiffnessDrive: quantumMaterialPropertySource.mechanicalStiffnessDrive,
      materialDampingScale: quantumMaterialPropertySource.materialDampingScale,
      quantumMaterialStatisticalSource,
      statisticalSourceChannelCount: quantumMaterialStatisticalSource.channelCount,
      statisticalPressureDriveProxy: quantumMaterialStatisticalSource.pressureDriveProxy,
      statisticalOpacityDriveProxy: quantumMaterialStatisticalSource.opacityDriveProxy,
      statisticalIonizationDriveProxy: quantumMaterialStatisticalSource.ionizationDriveProxy,
      statisticalDegeneracyPressureDriveProxy: quantumMaterialStatisticalSource.degeneracyPressureDriveProxy,
      statisticalTemperatureDeltaKProxy: quantumMaterialStatisticalSource.temperatureDeltaKProxy,
      statisticalChargeDeltaProxy: quantumMaterialStatisticalSource.chargeDeltaProxy,
      statisticalThermalDampingScale: quantumMaterialStatisticalSource.thermalDampingScale,
      quantumMaterialResponseDerivativeSource,
      responseDerivativeTemperatureDrive: quantumMaterialResponseDerivativeSource.temperatureDrive,
      responseDerivativePressureDrive: quantumMaterialResponseDerivativeSource.pressureDrive,
      responseDerivativeFieldDrive: quantumMaterialResponseDerivativeSource.fieldDrive,
      responseDerivativeRadiationDrive: quantumMaterialResponseDerivativeSource.radiationDrive,
      responseDerivativeThermalFluxBoostProxy: quantumMaterialResponseDerivativeSource.thermalFluxDerivativeBoostProxy,
      responseDerivativePhaseDriveBoostProxy: quantumMaterialResponseDerivativeSource.phaseDerivativeDriveBoostProxy,
      responseDerivativeElectricalDrive: quantumMaterialResponseDerivativeSource.electricalDerivativeDrive,
      responseDerivativeMechanicalDrive: quantumMaterialResponseDerivativeSource.mechanicalDerivativeDrive,
      responseDerivativeOpticalDrive: quantumMaterialResponseDerivativeSource.opticalDerivativeDrive,
      responseDerivativeDampingScale: quantumMaterialResponseDerivativeSource.materialDerivativeDampingScale
    },
    conservation: {
      closedSystem: false,
      mode: 'reduced-open-system',
      energyResidualProxy: rounded(clamp(
        energyResidualProxy
          + Math.abs(phaseEosBasis.source.phaseEnergyRateProxy) * 0.01
          + phaseEosBasis.phase.phaseStabilityResidualProxy * 0.02,
        0,
        1
      ), 6),
      speciesResidualProxy: rounded(speciesResidualProxy, 6),
      note: 'Reduced source/sink accounting for interactive coupling; not a closed enthalpy or stoichiometric balance.'
    },
    validity: {
      status: 'interactive-proxy',
      confidence: rounded(sourceClosure?.uncertainty?.confidence ?? 0.22, 3),
      warnings: [
        'Molecular source/sink report is reduced telemetry, not scientific conservation accounting.',
        'Scientific mode still needs units, heat capacity, enthalpy, stoichiometry, and validation tolerances.'
      ]
    },
    provenance: {
      adapter: 'peercompute.multiscale.molecular-source-sink.v0',
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularSourceSinkReport(report = null) {
  if (report?.schema !== MOLECULAR_SOURCE_SINK_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    sourceStateKey: report.source?.stateKey || report.sourceStateKey || null,
    targetSolverId: report.target?.solverId || report.targetSolverId || null,
    targetField: report.target?.field || report.targetField || null,
    thermalDrive: finite(report.energy?.thermalDrive, report.thermalDrive),
    heatFluxProxyWm2: finite(report.energy?.heatFluxProxyWm2, report.heatFluxProxyWm2),
    heatReleaseProxy: finite(report.energy?.heatReleaseProxy, report.heatReleaseProxy),
    reactionHeatSourceProxy: finite(report.energy?.reactionHeatSourceProxy, report.reactionHeatSourceProxy),
    reactionSourceDrive: finite(report.energy?.reactionSourceDrive, report.reactionSourceDrive),
    reactionCoolingDrive: finite(report.energy?.reactionCoolingDrive, report.reactionCoolingDrive),
    reactionProgress: finite(report.species?.reactionProgress, report.reactionProgress),
    ionizationFraction: finite(report.species?.ionizationFraction, report.ionizationFraction),
    dominantMolecule: report.species?.dominantMolecule || report.dominantMolecule || null,
    reactionEventCount: finite(report.species?.reactionEventCount, report.reactionEventCount),
    formedBondCount: finite(report.species?.formedBondCount, report.formedBondCount),
    brokenBondCount: finite(report.species?.brokenBondCount, report.brokenBondCount),
    reactionSpeciesRateProxy: finite(report.species?.reactionSpeciesRateProxy, report.reactionSpeciesRateProxy),
    reactionSourceEventIntensity: finite(report.species?.reactionSourceEventIntensity, report.reactionSourceEventIntensity),
    stoichiometryResidualProxy: finite(report.species?.stoichiometryResidualProxy, report.stoichiometryResidualProxy),
    stoichiometryClosed: report.species?.stoichiometryClosed === true || report.stoichiometryClosed === true,
    phaseRegime: report.phase?.phaseRegime || report.phaseRegime || 'unknown',
    phaseDriveProxy: finite(report.phase?.phaseDriveProxy, report.phaseDriveProxy),
    phaseHeatingDrive: finite(report.phase?.heatingDrive, report.phaseHeatingDrive),
    phaseCoolingDrive: finite(report.phase?.coolingDrive, report.phaseCoolingDrive),
    phaseChangeRateProxy: finite(report.phase?.phaseChangeRateProxy, report.phaseChangeRateProxy),
    latentHeatSinkProxy: finite(report.phase?.latentHeatSinkProxy, report.latentHeatSinkProxy),
    latentHeatReleaseProxy: finite(report.phase?.latentHeatReleaseProxy, report.latentHeatReleaseProxy),
    waterMoleculeFraction: finite(report.phase?.waterMoleculeFraction, report.waterMoleculeFraction),
    phaseEosSchema: report.phaseEos?.schema || report.phaseEosSchema || null,
    phaseEosStatus: report.phaseEos?.status || report.phaseEosStatus || 'unknown',
    phaseEosHeatCapacityProxy: finite(report.phaseEos?.basis?.heatCapacityProxy, report.phaseEosHeatCapacityProxy),
    phaseEosSpecificInternalEnergyProxy: finite(report.phaseEos?.basis?.specificInternalEnergyProxy, report.phaseEosSpecificInternalEnergyProxy),
    phaseEosSpecificEnthalpyProxy: finite(report.phaseEos?.basis?.specificEnthalpyProxy, report.phaseEosSpecificEnthalpyProxy),
    phaseEosSpecificFreeEnergyProxy: finite(report.phaseEos?.basis?.specificFreeEnergyProxy, report.phaseEosSpecificFreeEnergyProxy),
    phaseEosEntropyProxy: finite(report.phaseEos?.basis?.entropyProxy, report.phaseEosEntropyProxy),
    phaseEosLatentHeatBudgetProxy: finite(report.phaseEos?.basis?.latentHeatBudgetProxy, report.phaseEosLatentHeatBudgetProxy),
    phaseEosPhaseEnergyRateProxy: finite(report.phaseEos?.source?.phaseEnergyRateProxy, report.phaseEosPhaseEnergyRateProxy),
    phaseEosTemperatureDeltaKProxy: finite(report.phaseEos?.source?.sourceTemperatureDeltaKProxy, report.phaseEosTemperatureDeltaKProxy),
    phaseEosStabilityResidualProxy: finite(report.phaseEos?.phase?.phaseStabilityResidualProxy, report.phaseEosStabilityResidualProxy),
    phaseEosThermalDrive: finite(report.phaseEos?.source?.thermalDrive, report.phaseEosThermalDrive),
    phaseEosCoolingDrive: finite(report.phaseEos?.source?.coolingDrive, report.phaseEosCoolingDrive),
    quantumMaterialPropertyActive: report.material?.quantumMaterialPropertySource?.active === true
      || report.quantumMaterialPropertyActive === true
      || report.quantumMaterialPropertySource?.active === true,
    quantumMaterialPropertySource: report.material?.quantumMaterialPropertySource
      || report.quantumMaterialPropertySource
      || null,
    quantumMaterialPropertyThermalFluxBoostProxy: finite(report.material?.thermalFluxBoostProxy, report.quantumMaterialPropertyThermalFluxBoostProxy),
    quantumMaterialPropertyPhaseDriveBoostProxy: finite(report.material?.phaseDriveBoostProxy, report.quantumMaterialPropertyPhaseDriveBoostProxy),
    quantumMaterialPropertyElectricalDrive: finite(report.material?.electricalDrive, report.quantumMaterialPropertyElectricalDrive),
    quantumMaterialPropertyOpticalHeatingDrive: finite(report.material?.opticalHeatingDrive, report.quantumMaterialPropertyOpticalHeatingDrive),
    quantumMaterialPropertyMechanicalStiffnessDrive: finite(report.material?.mechanicalStiffnessDrive, report.quantumMaterialPropertyMechanicalStiffnessDrive),
    quantumMaterialStatisticalActive: report.material?.quantumMaterialStatisticalSource?.active === true
      || report.quantumMaterialStatisticalActive === true
      || report.quantumMaterialStatisticalSource?.active === true,
    quantumMaterialStatisticalSource: report.material?.quantumMaterialStatisticalSource
      || report.quantumMaterialStatisticalSource
      || null,
    quantumMaterialStatisticalSourceEquationSchema: report.material?.statisticalSourceEquationSchema
      || report.material?.quantumMaterialStatisticalSource?.sourceEquationSchema
      || report.quantumMaterialStatisticalSourceEquationSchema
      || null,
    quantumMaterialStatisticalSourceChannelCount: Math.max(0, Math.round(finite(
      report.material?.statisticalSourceChannelCount,
      report.material?.quantumMaterialStatisticalSource?.channelCount
    ))),
    quantumMaterialStatisticalPressureDriveProxy: finite(report.material?.statisticalPressureDriveProxy, report.material?.quantumMaterialStatisticalSource?.pressureDriveProxy),
    quantumMaterialStatisticalOpacityDriveProxy: finite(report.material?.statisticalOpacityDriveProxy, report.material?.quantumMaterialStatisticalSource?.opacityDriveProxy),
    quantumMaterialStatisticalIonizationDriveProxy: finite(report.material?.statisticalIonizationDriveProxy, report.material?.quantumMaterialStatisticalSource?.ionizationDriveProxy),
    quantumMaterialStatisticalDegeneracyPressureDriveProxy: finite(report.material?.statisticalDegeneracyPressureDriveProxy, report.material?.quantumMaterialStatisticalSource?.degeneracyPressureDriveProxy),
    quantumMaterialStatisticalTemperatureDeltaKProxy: finite(report.material?.statisticalTemperatureDeltaKProxy, report.material?.quantumMaterialStatisticalSource?.temperatureDeltaKProxy),
    quantumMaterialStatisticalChargeDeltaProxy: finite(report.material?.statisticalChargeDeltaProxy, report.material?.quantumMaterialStatisticalSource?.chargeDeltaProxy),
    quantumMaterialStatisticalThermalDampingScale: finite(report.material?.statisticalThermalDampingScale, report.material?.quantumMaterialStatisticalSource?.thermalDampingScale ?? 1),
    quantumMaterialResponseDerivativeActive: report.material?.quantumMaterialResponseDerivativeSource?.active === true
      || report.quantumMaterialResponseDerivativeActive === true
      || report.quantumMaterialResponseDerivativeSource?.active === true,
    quantumMaterialResponseDerivativeSource: report.material?.quantumMaterialResponseDerivativeSource
      || report.quantumMaterialResponseDerivativeSource
      || null,
    quantumMaterialResponseDerivativeTemperatureDrive: finite(report.material?.responseDerivativeTemperatureDrive, report.quantumMaterialResponseDerivativeTemperatureDrive),
    quantumMaterialResponseDerivativePressureDrive: finite(report.material?.responseDerivativePressureDrive, report.quantumMaterialResponseDerivativePressureDrive),
    quantumMaterialResponseDerivativeFieldDrive: finite(report.material?.responseDerivativeFieldDrive, report.quantumMaterialResponseDerivativeFieldDrive),
    quantumMaterialResponseDerivativeRadiationDrive: finite(report.material?.responseDerivativeRadiationDrive, report.quantumMaterialResponseDerivativeRadiationDrive),
    quantumMaterialResponseDerivativeThermalFluxBoostProxy: finite(report.material?.responseDerivativeThermalFluxBoostProxy, report.quantumMaterialResponseDerivativeThermalFluxBoostProxy),
    quantumMaterialResponseDerivativePhaseDriveBoostProxy: finite(report.material?.responseDerivativePhaseDriveBoostProxy, report.quantumMaterialResponseDerivativePhaseDriveBoostProxy),
    quantumMaterialResponseDerivativeElectricalDrive: finite(report.material?.responseDerivativeElectricalDrive, report.quantumMaterialResponseDerivativeElectricalDrive),
    quantumMaterialResponseDerivativeMechanicalDrive: finite(report.material?.responseDerivativeMechanicalDrive, report.quantumMaterialResponseDerivativeMechanicalDrive),
    quantumMaterialResponseDerivativeOpticalDrive: finite(report.material?.responseDerivativeOpticalDrive, report.quantumMaterialResponseDerivativeOpticalDrive),
    quantumMaterialResponseDerivativeDampingScale: finite(report.material?.responseDerivativeDampingScale, report.quantumMaterialResponseDerivativeDampingScale ?? 1),
    energyResidualProxy: finite(report.conservation?.energyResidualProxy, report.energyResidualProxy),
    speciesResidualProxy: finite(report.conservation?.speciesResidualProxy, report.speciesResidualProxy),
    validityStatus: report.validity?.status || 'unknown'
  };
}

function summarizeConsumerSourceSink({ report = null, solverId = null, targetField = null } = {}) {
  const summary = summarizeMolecularSourceSinkReport(report);
  if (!summary) return null;
  return {
    ...summary,
    targetSolverId: solverId || summary.targetSolverId || 'unknown',
    targetField: targetField || summary.targetField || 'unknown',
    active: Math.abs(summary.reactionHeatSourceProxy) > 0
      || summary.reactionSpeciesRateProxy > 0
      || summary.reactionSourceDrive > 0
      || summary.reactionCoolingDrive > 0
      || summary.phaseDriveProxy > 0
      || summary.phaseHeatingDrive > 0
      || summary.phaseCoolingDrive > 0
      || Math.abs(summary.phaseEosPhaseEnergyRateProxy) > 0
      || summary.phaseEosStabilityResidualProxy > 0
      || summary.quantumMaterialPropertyActive === true
      || summary.quantumMaterialPropertyThermalFluxBoostProxy > 0
      || summary.quantumMaterialPropertyPhaseDriveBoostProxy > 0
      || summary.quantumMaterialStatisticalActive === true
      || summary.quantumMaterialStatisticalSourceChannelCount > 0
      || Math.abs(summary.quantumMaterialStatisticalPressureDriveProxy) > 0
      || summary.quantumMaterialStatisticalOpacityDriveProxy > 0
      || summary.quantumMaterialStatisticalIonizationDriveProxy > 0
      || summary.quantumMaterialStatisticalDegeneracyPressureDriveProxy > 0
      || Math.abs(summary.quantumMaterialStatisticalTemperatureDeltaKProxy) > 0
      || Math.abs(summary.quantumMaterialStatisticalChargeDeltaProxy) > 0
      || summary.quantumMaterialResponseDerivativeActive === true
      || summary.quantumMaterialResponseDerivativeThermalFluxBoostProxy > 0
      || summary.quantumMaterialResponseDerivativePhaseDriveBoostProxy > 0
      || summary.quantumMaterialResponseDerivativeElectricalDrive > 0
      || summary.quantumMaterialResponseDerivativeMechanicalDrive > 0
      || summary.quantumMaterialResponseDerivativeOpticalDrive > 0
      || summary.energyResidualProxy > 0
      || summary.speciesResidualProxy > 0
  };
}

export function createMolecularSourceSinkBalanceReport({
  source = {},
  consumers = [],
  timeSeconds = 0
} = {}) {
  const reactionSourceSummary = summarizeMolecularReactionSource({
    reactionSource: source.reactionSource || null,
    reactionHeatSourceProxy: source.reactionHeatSourceProxy,
    reactionSpeciesRateProxy: source.reactionSpeciesRateProxy
  });
  const consumerSummaries = consumers
    .map((consumer) => summarizeConsumerSourceSink(consumer))
    .filter(Boolean);
  const activeConsumers = consumerSummaries.filter((consumer) => consumer.active);
  const maxConsumerHeatProxy = activeConsumers.reduce((best, consumer) => (
    Math.abs(consumer.reactionHeatSourceProxy) > Math.abs(best)
      ? consumer.reactionHeatSourceProxy
      : best
  ), 0);
  const maxConsumerSpeciesRateProxy = activeConsumers.reduce((best, consumer) => (
    Math.max(best, Math.abs(consumer.reactionSpeciesRateProxy))
  ), 0);
  const maxConsumerSourceDrive = activeConsumers.reduce((best, consumer) => (
    Math.max(best, consumer.reactionSourceDrive)
  ), 0);
  const maxConsumerCoolingDrive = activeConsumers.reduce((best, consumer) => (
    Math.max(best, consumer.reactionCoolingDrive)
  ), 0);
  const totalConsumerSourceDrive = activeConsumers.reduce((sum, consumer) => (
    sum + Math.max(0, consumer.reactionSourceDrive)
  ), 0);
  const totalConsumerCoolingDrive = activeConsumers.reduce((sum, consumer) => (
    sum + Math.max(0, consumer.reactionCoolingDrive)
  ), 0);
  const maxConsumerEnergyResidual = activeConsumers.reduce((best, consumer) => (
    Math.max(best, consumer.energyResidualProxy)
  ), 0);
  const maxConsumerSpeciesResidual = activeConsumers.reduce((best, consumer) => (
    Math.max(best, consumer.speciesResidualProxy)
  ), 0);
  const maxConsumerPhaseEosResidual = activeConsumers.reduce((best, consumer) => (
    Math.max(best, consumer.phaseEosStabilityResidualProxy)
  ), 0);
  const maxConsumerPhaseEosEnergyRate = activeConsumers.reduce((best, consumer) => (
    Math.abs(consumer.phaseEosPhaseEnergyRateProxy) > Math.abs(best)
      ? consumer.phaseEosPhaseEnergyRateProxy
      : best
  ), 0);
  const quantumMaterialPropertyConsumers = activeConsumers.filter((consumer) => (
    consumer.quantumMaterialPropertyActive === true
      || finite(consumer.quantumMaterialPropertyThermalFluxBoostProxy) > 0
      || finite(consumer.quantumMaterialPropertyPhaseDriveBoostProxy) > 0
  ));
  const quantumMaterialPropertySource = quantumMaterialPropertyConsumers
    .map((consumer) => consumer.quantumMaterialPropertySource)
    .find((source) => source?.active === true)
    || summarizeQuantumMaterialPropertySource();
  const maxConsumerQuantumMaterialThermalFlux = quantumMaterialPropertyConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialPropertyThermalFluxBoostProxy))
  ), 0);
  const maxConsumerQuantumMaterialPhaseDrive = quantumMaterialPropertyConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialPropertyPhaseDriveBoostProxy))
  ), 0);
  const maxConsumerQuantumMaterialElectricalDrive = quantumMaterialPropertyConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialPropertyElectricalDrive))
  ), 0);
  const maxConsumerQuantumMaterialOpticalHeatingDrive = quantumMaterialPropertyConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialPropertyOpticalHeatingDrive))
  ), 0);
  const maxConsumerQuantumMaterialMechanicalStiffnessDrive = quantumMaterialPropertyConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialPropertyMechanicalStiffnessDrive))
  ), 0);
  const quantumMaterialStatisticalConsumers = activeConsumers.filter((consumer) => (
    consumer.quantumMaterialStatisticalActive === true
      || finite(consumer.quantumMaterialStatisticalSourceChannelCount) > 0
      || Math.abs(finite(consumer.quantumMaterialStatisticalPressureDriveProxy)) > 0
      || finite(consumer.quantumMaterialStatisticalOpacityDriveProxy) > 0
      || finite(consumer.quantumMaterialStatisticalIonizationDriveProxy) > 0
      || finite(consumer.quantumMaterialStatisticalDegeneracyPressureDriveProxy) > 0
      || Math.abs(finite(consumer.quantumMaterialStatisticalTemperatureDeltaKProxy)) > 0
      || Math.abs(finite(consumer.quantumMaterialStatisticalChargeDeltaProxy)) > 0
  ));
  const quantumMaterialStatisticalSource = quantumMaterialStatisticalConsumers
    .map((consumer) => consumer.quantumMaterialStatisticalSource)
    .find((source) => source?.active === true)
    || summarizeQuantumMaterialStatisticalSource();
  const maxConsumerQuantumMaterialStatisticalSourceChannelCount = quantumMaterialStatisticalConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialStatisticalSourceChannelCount))
  ), 0);
  const maxConsumerQuantumMaterialStatisticalPressureDrive = quantumMaterialStatisticalConsumers.reduce((best, consumer) => (
    Math.abs(finite(consumer.quantumMaterialStatisticalPressureDriveProxy)) > Math.abs(best)
      ? finite(consumer.quantumMaterialStatisticalPressureDriveProxy)
      : best
  ), 0);
  const maxConsumerQuantumMaterialStatisticalOpacityDrive = quantumMaterialStatisticalConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialStatisticalOpacityDriveProxy))
  ), 0);
  const maxConsumerQuantumMaterialStatisticalIonizationDrive = quantumMaterialStatisticalConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialStatisticalIonizationDriveProxy))
  ), 0);
  const maxConsumerQuantumMaterialStatisticalDegeneracyDrive = quantumMaterialStatisticalConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialStatisticalDegeneracyPressureDriveProxy))
  ), 0);
  const maxConsumerQuantumMaterialStatisticalTemperatureDeltaK = quantumMaterialStatisticalConsumers.reduce((best, consumer) => (
    Math.abs(finite(consumer.quantumMaterialStatisticalTemperatureDeltaKProxy)) > Math.abs(best)
      ? finite(consumer.quantumMaterialStatisticalTemperatureDeltaKProxy)
      : best
  ), 0);
  const maxConsumerQuantumMaterialStatisticalChargeDelta = quantumMaterialStatisticalConsumers.reduce((best, consumer) => (
    Math.abs(finite(consumer.quantumMaterialStatisticalChargeDeltaProxy)) > Math.abs(best)
      ? finite(consumer.quantumMaterialStatisticalChargeDeltaProxy)
      : best
  ), 0);
  const maxConsumerQuantumMaterialStatisticalThermalDampingScale = quantumMaterialStatisticalConsumers.reduce((best, consumer) => {
    const value = finite(consumer.quantumMaterialStatisticalThermalDampingScale, 1);
    return Math.abs(value - 1) > Math.abs(best - 1) ? value : best;
  }, 1);
  const quantumMaterialResponseDerivativeConsumers = activeConsumers.filter((consumer) => (
    consumer.quantumMaterialResponseDerivativeActive === true
      || finite(consumer.quantumMaterialResponseDerivativeThermalFluxBoostProxy) > 0
      || finite(consumer.quantumMaterialResponseDerivativePhaseDriveBoostProxy) > 0
      || finite(consumer.quantumMaterialResponseDerivativeElectricalDrive) > 0
      || finite(consumer.quantumMaterialResponseDerivativeMechanicalDrive) > 0
      || finite(consumer.quantumMaterialResponseDerivativeOpticalDrive) > 0
      || finite(consumer.quantumMaterialResponseDerivativeTemperatureDrive) > 0
      || finite(consumer.quantumMaterialResponseDerivativePressureDrive) > 0
      || finite(consumer.quantumMaterialResponseDerivativeFieldDrive) > 0
      || finite(consumer.quantumMaterialResponseDerivativeRadiationDrive) > 0
  ));
  const quantumMaterialResponseDerivativeSource = quantumMaterialResponseDerivativeConsumers
    .map((consumer) => consumer.quantumMaterialResponseDerivativeSource)
    .find((source) => source?.active === true)
    || summarizeQuantumMaterialResponseDerivativeSource();
  const maxConsumerQuantumMaterialResponseDerivativeTemperatureDrive = quantumMaterialResponseDerivativeConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialResponseDerivativeTemperatureDrive))
  ), 0);
  const maxConsumerQuantumMaterialResponseDerivativePressureDrive = quantumMaterialResponseDerivativeConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialResponseDerivativePressureDrive))
  ), 0);
  const maxConsumerQuantumMaterialResponseDerivativeFieldDrive = quantumMaterialResponseDerivativeConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialResponseDerivativeFieldDrive))
  ), 0);
  const maxConsumerQuantumMaterialResponseDerivativeRadiationDrive = quantumMaterialResponseDerivativeConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialResponseDerivativeRadiationDrive))
  ), 0);
  const maxConsumerQuantumMaterialResponseDerivativeThermalFlux = quantumMaterialResponseDerivativeConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialResponseDerivativeThermalFluxBoostProxy))
  ), 0);
  const maxConsumerQuantumMaterialResponseDerivativePhaseDrive = quantumMaterialResponseDerivativeConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialResponseDerivativePhaseDriveBoostProxy))
  ), 0);
  const maxConsumerQuantumMaterialResponseDerivativeElectricalDrive = quantumMaterialResponseDerivativeConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialResponseDerivativeElectricalDrive))
  ), 0);
  const maxConsumerQuantumMaterialResponseDerivativeMechanicalDrive = quantumMaterialResponseDerivativeConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialResponseDerivativeMechanicalDrive))
  ), 0);
  const maxConsumerQuantumMaterialResponseDerivativeOpticalDrive = quantumMaterialResponseDerivativeConsumers.reduce((best, consumer) => (
    Math.max(best, finite(consumer.quantumMaterialResponseDerivativeOpticalDrive))
  ), 0);
  const maxConsumerQuantumMaterialResponseDerivativeDampingScale = quantumMaterialResponseDerivativeConsumers.reduce((best, consumer) => {
    const value = finite(consumer.quantumMaterialResponseDerivativeDampingScale, 1);
    return Math.abs(value - 1) > Math.abs(best - 1) ? value : best;
  }, 1);

  const inferredFromConsumers = reactionSourceSummary.active !== true && activeConsumers.length > 0;
  const sourceHeatProxy = inferredFromConsumers
    ? maxConsumerHeatProxy
    : reactionSourceSummary.netHeatSourceProxy;
  const sourceSpeciesRateProxy = inferredFromConsumers
    ? maxConsumerSpeciesRateProxy
    : reactionSourceSummary.speciesRateProxy;
  const sourceDrive = inferredFromConsumers
    ? maxConsumerSourceDrive
    : reactionSourceSummary.sourceDrive;
  const sourceCoolingDrive = inferredFromConsumers
    ? maxConsumerCoolingDrive
    : reactionSourceSummary.coolingDrive;
  const sourceEventIntensity = inferredFromConsumers
    ? Math.max(...activeConsumers.map((consumer) => consumer.reactionSourceEventIntensity), 0)
    : reactionSourceSummary.eventIntensityProxy;
  const activeSource = reactionSourceSummary.active === true || sourceDrive > 0 || sourceCoolingDrive > 0 || sourceSpeciesRateProxy > 0;
  const sourceDriveCoverage = sourceDrive > 0
    ? clamp(maxConsumerSourceDrive / sourceDrive, 0, 1)
    : activeConsumers.length > 0 || !activeSource ? 1 : 0;
  const coolingDriveCoverage = sourceCoolingDrive > 0
    ? clamp(maxConsumerCoolingDrive / sourceCoolingDrive, 0, 1)
    : 1;
  const heatProxyResidual = Math.max(0, Math.abs(sourceHeatProxy) - Math.abs(maxConsumerHeatProxy));
  const speciesRateResidual = Math.max(0, sourceSpeciesRateProxy - maxConsumerSpeciesRateProxy);
  const sourceDriveResidual = Math.max(0, sourceDrive - maxConsumerSourceDrive);
  const coolingDriveResidual = Math.max(0, sourceCoolingDrive - maxConsumerCoolingDrive);
  const expectedFanoutSourceDrive = sourceDrive * Math.max(1, activeConsumers.length);
  const fanoutOversubscriptionProxy = Math.max(0, totalConsumerSourceDrive - expectedFanoutSourceDrive);
  const balanceResidualProxy = clamp(
    sourceDriveResidual
      + coolingDriveResidual * 0.5
      + heatProxyResidual * 0.05
      + speciesRateResidual * 0.002
      + fanoutOversubscriptionProxy
      + maxConsumerEnergyResidual * 0.35
      + maxConsumerSpeciesResidual * 0.35
      + maxConsumerPhaseEosResidual * 0.18,
    0,
    1
  );
  let status = 'idle';
  if (activeSource && activeConsumers.length === 0) {
    status = 'unconsumed-source';
  } else if ((activeSource || activeConsumers.length > 0) && balanceResidualProxy < 0.05 && sourceDriveCoverage >= 0.95 && coolingDriveCoverage >= 0.95) {
    status = 'balanced-proxy';
  } else if (sourceDriveCoverage < 0.5) {
    status = 'partial-fanout';
  } else if (balanceResidualProxy > 0.25) {
    status = 'watch';
  } else if (activeSource || activeConsumers.length > 0) {
    status = 'tracked';
  }

  return {
    schema: MOLECULAR_SOURCE_SINK_BALANCE_SCHEMA,
    mode: inferredFromConsumers
      ? 'inferred-source-from-consumer-summaries-v0'
      : 'event-source-consumer-balance-v0',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    source: {
      stateKey: source.stateKey || source.sourceStateKey || null,
      sequence: source.sequence ?? source.sourceSequence ?? null,
      reactionSourceSchema: source.reactionSource?.schema || reactionSourceSummary.schema || null,
      reactionHeatSourceProxy: rounded(sourceHeatProxy, 6),
      reactionSpeciesRateProxy: rounded(sourceSpeciesRateProxy, 6),
      reactionSourceDrive: rounded(sourceDrive, 6),
      reactionCoolingDrive: rounded(sourceCoolingDrive, 6),
      eventIntensityProxy: rounded(sourceEventIntensity, 6),
      inferredFromConsumers
    },
    consumers: activeConsumers.map((consumer) => ({
      targetSolverId: consumer.targetSolverId,
      targetField: consumer.targetField,
      reactionHeatSourceProxy: rounded(consumer.reactionHeatSourceProxy, 6),
      reactionSpeciesRateProxy: rounded(consumer.reactionSpeciesRateProxy, 6),
      reactionSourceDrive: rounded(consumer.reactionSourceDrive, 6),
      reactionCoolingDrive: rounded(consumer.reactionCoolingDrive, 6),
      energyResidualProxy: rounded(consumer.energyResidualProxy, 6),
      speciesResidualProxy: rounded(consumer.speciesResidualProxy, 6),
      phaseEosSchema: consumer.phaseEosSchema,
      phaseEosSpecificFreeEnergyProxy: rounded(consumer.phaseEosSpecificFreeEnergyProxy, 9),
      phaseEosSpecificEnthalpyProxy: rounded(consumer.phaseEosSpecificEnthalpyProxy, 9),
      phaseEosPhaseEnergyRateProxy: rounded(consumer.phaseEosPhaseEnergyRateProxy, 9),
      phaseEosStabilityResidualProxy: rounded(consumer.phaseEosStabilityResidualProxy, 6),
      quantumMaterialPropertyActive: consumer.quantumMaterialPropertyActive === true,
      quantumMaterialPropertyThermalFluxBoostProxy: rounded(consumer.quantumMaterialPropertyThermalFluxBoostProxy, 6),
      quantumMaterialPropertyPhaseDriveBoostProxy: rounded(consumer.quantumMaterialPropertyPhaseDriveBoostProxy, 9),
      quantumMaterialStatisticalActive: consumer.quantumMaterialStatisticalActive === true,
      quantumMaterialStatisticalSourceChannelCount: Math.max(0, Math.round(finite(consumer.quantumMaterialStatisticalSourceChannelCount))),
      quantumMaterialStatisticalPressureDriveProxy: rounded(consumer.quantumMaterialStatisticalPressureDriveProxy, 9),
      quantumMaterialStatisticalOpacityDriveProxy: rounded(consumer.quantumMaterialStatisticalOpacityDriveProxy, 9),
      quantumMaterialStatisticalIonizationDriveProxy: rounded(consumer.quantumMaterialStatisticalIonizationDriveProxy, 9),
      quantumMaterialStatisticalDegeneracyPressureDriveProxy: rounded(consumer.quantumMaterialStatisticalDegeneracyPressureDriveProxy, 9),
      quantumMaterialStatisticalTemperatureDeltaKProxy: rounded(consumer.quantumMaterialStatisticalTemperatureDeltaKProxy, 6),
      quantumMaterialResponseDerivativeActive: consumer.quantumMaterialResponseDerivativeActive === true,
      quantumMaterialResponseDerivativeTemperatureDrive: rounded(consumer.quantumMaterialResponseDerivativeTemperatureDrive, 9),
      quantumMaterialResponseDerivativePressureDrive: rounded(consumer.quantumMaterialResponseDerivativePressureDrive, 9),
      quantumMaterialResponseDerivativeFieldDrive: rounded(consumer.quantumMaterialResponseDerivativeFieldDrive, 9),
      quantumMaterialResponseDerivativeRadiationDrive: rounded(consumer.quantumMaterialResponseDerivativeRadiationDrive, 9),
      quantumMaterialResponseDerivativeThermalFluxBoostProxy: rounded(consumer.quantumMaterialResponseDerivativeThermalFluxBoostProxy, 6),
      quantumMaterialResponseDerivativePhaseDriveBoostProxy: rounded(consumer.quantumMaterialResponseDerivativePhaseDriveBoostProxy, 9),
      dominantMolecule: consumer.dominantMolecule
    })),
    material: {
      quantumMaterialPropertySource,
      activeConsumerCount: quantumMaterialPropertyConsumers.length,
      thermalFluxBoostProxy: rounded(maxConsumerQuantumMaterialThermalFlux, 6),
      phaseDriveBoostProxy: rounded(maxConsumerQuantumMaterialPhaseDrive, 9),
      electricalDrive: rounded(maxConsumerQuantumMaterialElectricalDrive, 9),
      opticalHeatingDrive: rounded(maxConsumerQuantumMaterialOpticalHeatingDrive, 9),
      mechanicalStiffnessDrive: rounded(maxConsumerQuantumMaterialMechanicalStiffnessDrive, 9),
      quantumMaterialStatisticalSource,
      statisticalActiveConsumerCount: quantumMaterialStatisticalConsumers.length,
      statisticalSourceEquationSchema: quantumMaterialStatisticalSource.sourceEquationSchema,
      statisticalSourceChannelCount: Math.max(
        quantumMaterialStatisticalSource.channelCount,
        Math.round(maxConsumerQuantumMaterialStatisticalSourceChannelCount)
      ),
      statisticalPressureDriveProxy: rounded(maxConsumerQuantumMaterialStatisticalPressureDrive, 9),
      statisticalOpacityDriveProxy: rounded(maxConsumerQuantumMaterialStatisticalOpacityDrive, 9),
      statisticalIonizationDriveProxy: rounded(maxConsumerQuantumMaterialStatisticalIonizationDrive, 9),
      statisticalDegeneracyPressureDriveProxy: rounded(maxConsumerQuantumMaterialStatisticalDegeneracyDrive, 9),
      statisticalTemperatureDeltaKProxy: rounded(maxConsumerQuantumMaterialStatisticalTemperatureDeltaK, 6),
      statisticalChargeDeltaProxy: rounded(maxConsumerQuantumMaterialStatisticalChargeDelta, 9),
      statisticalThermalDampingScale: rounded(maxConsumerQuantumMaterialStatisticalThermalDampingScale, 6),
      quantumMaterialResponseDerivativeSource,
      responseDerivativeActiveConsumerCount: quantumMaterialResponseDerivativeConsumers.length,
      responseDerivativeTemperatureDrive: rounded(maxConsumerQuantumMaterialResponseDerivativeTemperatureDrive, 9),
      responseDerivativePressureDrive: rounded(maxConsumerQuantumMaterialResponseDerivativePressureDrive, 9),
      responseDerivativeFieldDrive: rounded(maxConsumerQuantumMaterialResponseDerivativeFieldDrive, 9),
      responseDerivativeRadiationDrive: rounded(maxConsumerQuantumMaterialResponseDerivativeRadiationDrive, 9),
      responseDerivativeThermalFluxBoostProxy: rounded(maxConsumerQuantumMaterialResponseDerivativeThermalFlux, 6),
      responseDerivativePhaseDriveBoostProxy: rounded(maxConsumerQuantumMaterialResponseDerivativePhaseDrive, 9),
      responseDerivativeElectricalDrive: rounded(maxConsumerQuantumMaterialResponseDerivativeElectricalDrive, 9),
      responseDerivativeMechanicalDrive: rounded(maxConsumerQuantumMaterialResponseDerivativeMechanicalDrive, 9),
      responseDerivativeOpticalDrive: rounded(maxConsumerQuantumMaterialResponseDerivativeOpticalDrive, 9),
      responseDerivativeDampingScale: rounded(maxConsumerQuantumMaterialResponseDerivativeDampingScale, 6),
      unitStatus: 'property-response-proxy'
    },
    coverage: {
      activeTargetCount: activeConsumers.length,
      sourceDriveCoverage: rounded(sourceDriveCoverage, 6),
      coolingDriveCoverage: rounded(coolingDriveCoverage, 6),
      heatProxyCoverage: Math.abs(sourceHeatProxy) > 0
        ? rounded(clamp(Math.abs(maxConsumerHeatProxy) / Math.abs(sourceHeatProxy), 0, 1), 6)
        : 1,
      speciesRateCoverage: sourceSpeciesRateProxy > 0
        ? rounded(clamp(maxConsumerSpeciesRateProxy / sourceSpeciesRateProxy, 0, 1), 6)
        : 1
    },
    residuals: {
      sourceDriveResidualProxy: rounded(sourceDriveResidual, 6),
      coolingDriveResidualProxy: rounded(coolingDriveResidual, 6),
      heatProxyResidual: rounded(heatProxyResidual, 6),
      speciesRateResidualProxy: rounded(speciesRateResidual, 6),
      consumerEnergyResidualProxy: rounded(maxConsumerEnergyResidual, 6),
      consumerSpeciesResidualProxy: rounded(maxConsumerSpeciesResidual, 6),
      consumerPhaseEosStabilityResidualProxy: rounded(maxConsumerPhaseEosResidual, 6),
      consumerPhaseEosEnergyRateProxy: rounded(maxConsumerPhaseEosEnergyRate, 9),
      fanoutOversubscriptionProxy: rounded(fanoutOversubscriptionProxy, 6),
      balanceResidualProxy: rounded(balanceResidualProxy, 6)
    },
    validity: {
      status: 'interactive-proxy',
      confidence: 0.28,
      warnings: [
        'Molecular source/sink balance compares reduced event-source and consumer telemetry only.',
        'Scientific mode still needs conservative enthalpy, species stoichiometry, units, and validation tolerances.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_SOURCE_SINK_BALANCE_SCHEMA,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularSourceSinkBalanceReport(report = null) {
  if (report?.schema !== MOLECULAR_SOURCE_SINK_BALANCE_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    activeTargetCount: Math.max(0, Math.round(finite(report.coverage?.activeTargetCount, report.activeTargetCount))),
    sourceDriveCoverage: finite(report.coverage?.sourceDriveCoverage, report.sourceDriveCoverage),
    coolingDriveCoverage: finite(report.coverage?.coolingDriveCoverage, report.coolingDriveCoverage),
    heatProxyCoverage: finite(report.coverage?.heatProxyCoverage, report.heatProxyCoverage),
    speciesRateCoverage: finite(report.coverage?.speciesRateCoverage, report.speciesRateCoverage),
    reactionHeatSourceProxy: finite(report.source?.reactionHeatSourceProxy, report.reactionHeatSourceProxy),
    reactionSpeciesRateProxy: finite(report.source?.reactionSpeciesRateProxy, report.reactionSpeciesRateProxy),
    reactionSourceDrive: finite(report.source?.reactionSourceDrive, report.reactionSourceDrive),
    reactionCoolingDrive: finite(report.source?.reactionCoolingDrive, report.reactionCoolingDrive),
    sourceDriveResidualProxy: finite(report.residuals?.sourceDriveResidualProxy, report.sourceDriveResidualProxy),
    coolingDriveResidualProxy: finite(report.residuals?.coolingDriveResidualProxy, report.coolingDriveResidualProxy),
    heatProxyResidual: finite(report.residuals?.heatProxyResidual, report.heatProxyResidual),
    speciesRateResidualProxy: finite(report.residuals?.speciesRateResidualProxy, report.speciesRateResidualProxy),
    consumerEnergyResidualProxy: finite(report.residuals?.consumerEnergyResidualProxy, report.consumerEnergyResidualProxy),
    consumerSpeciesResidualProxy: finite(report.residuals?.consumerSpeciesResidualProxy, report.consumerSpeciesResidualProxy),
    consumerPhaseEosStabilityResidualProxy: finite(report.residuals?.consumerPhaseEosStabilityResidualProxy, report.consumerPhaseEosStabilityResidualProxy),
    consumerPhaseEosEnergyRateProxy: finite(report.residuals?.consumerPhaseEosEnergyRateProxy, report.consumerPhaseEosEnergyRateProxy),
    quantumMaterialPropertyActive: report.material?.quantumMaterialPropertySource?.active === true
      || finite(report.material?.thermalFluxBoostProxy) > 0
      || finite(report.material?.phaseDriveBoostProxy) > 0,
    quantumMaterialPropertySource: report.material?.quantumMaterialPropertySource || null,
    quantumMaterialPropertyThermalFluxBoostProxy: finite(report.material?.thermalFluxBoostProxy, report.quantumMaterialPropertyThermalFluxBoostProxy),
    quantumMaterialPropertyPhaseDriveBoostProxy: finite(report.material?.phaseDriveBoostProxy, report.quantumMaterialPropertyPhaseDriveBoostProxy),
    quantumMaterialPropertyElectricalDrive: finite(report.material?.electricalDrive, report.quantumMaterialPropertyElectricalDrive),
    quantumMaterialPropertyOpticalHeatingDrive: finite(report.material?.opticalHeatingDrive, report.quantumMaterialPropertyOpticalHeatingDrive),
    quantumMaterialPropertyMechanicalStiffnessDrive: finite(report.material?.mechanicalStiffnessDrive, report.quantumMaterialPropertyMechanicalStiffnessDrive),
    quantumMaterialStatisticalActive: report.material?.quantumMaterialStatisticalSource?.active === true
      || finite(report.material?.statisticalSourceChannelCount) > 0
      || Math.abs(finite(report.material?.statisticalPressureDriveProxy)) > 0
      || finite(report.material?.statisticalOpacityDriveProxy) > 0
      || finite(report.material?.statisticalIonizationDriveProxy) > 0
      || finite(report.material?.statisticalDegeneracyPressureDriveProxy) > 0
      || Math.abs(finite(report.material?.statisticalTemperatureDeltaKProxy)) > 0
      || Math.abs(finite(report.material?.statisticalChargeDeltaProxy)) > 0,
    quantumMaterialStatisticalSource: report.material?.quantumMaterialStatisticalSource || null,
    quantumMaterialStatisticalSourceEquationSchema: report.material?.statisticalSourceEquationSchema
      || report.material?.quantumMaterialStatisticalSource?.sourceEquationSchema
      || null,
    quantumMaterialStatisticalSourceChannelCount: Math.max(0, Math.round(finite(
      report.material?.statisticalSourceChannelCount,
      report.material?.quantumMaterialStatisticalSource?.channelCount
    ))),
    quantumMaterialStatisticalPressureDriveProxy: finite(report.material?.statisticalPressureDriveProxy, report.quantumMaterialStatisticalPressureDriveProxy),
    quantumMaterialStatisticalOpacityDriveProxy: finite(report.material?.statisticalOpacityDriveProxy, report.quantumMaterialStatisticalOpacityDriveProxy),
    quantumMaterialStatisticalIonizationDriveProxy: finite(report.material?.statisticalIonizationDriveProxy, report.quantumMaterialStatisticalIonizationDriveProxy),
    quantumMaterialStatisticalDegeneracyPressureDriveProxy: finite(report.material?.statisticalDegeneracyPressureDriveProxy, report.quantumMaterialStatisticalDegeneracyPressureDriveProxy),
    quantumMaterialStatisticalTemperatureDeltaKProxy: finite(report.material?.statisticalTemperatureDeltaKProxy, report.quantumMaterialStatisticalTemperatureDeltaKProxy),
    quantumMaterialStatisticalChargeDeltaProxy: finite(report.material?.statisticalChargeDeltaProxy, report.quantumMaterialStatisticalChargeDeltaProxy),
    quantumMaterialStatisticalThermalDampingScale: finite(report.material?.statisticalThermalDampingScale, report.quantumMaterialStatisticalThermalDampingScale ?? 1),
    quantumMaterialResponseDerivativeActive: report.material?.quantumMaterialResponseDerivativeSource?.active === true
      || finite(report.material?.responseDerivativeThermalFluxBoostProxy) > 0
      || finite(report.material?.responseDerivativePhaseDriveBoostProxy) > 0
      || finite(report.material?.responseDerivativeElectricalDrive) > 0
      || finite(report.material?.responseDerivativeMechanicalDrive) > 0
      || finite(report.material?.responseDerivativeOpticalDrive) > 0,
    quantumMaterialResponseDerivativeSource: report.material?.quantumMaterialResponseDerivativeSource || null,
    quantumMaterialResponseDerivativeTemperatureDrive: finite(report.material?.responseDerivativeTemperatureDrive, report.quantumMaterialResponseDerivativeTemperatureDrive),
    quantumMaterialResponseDerivativePressureDrive: finite(report.material?.responseDerivativePressureDrive, report.quantumMaterialResponseDerivativePressureDrive),
    quantumMaterialResponseDerivativeFieldDrive: finite(report.material?.responseDerivativeFieldDrive, report.quantumMaterialResponseDerivativeFieldDrive),
    quantumMaterialResponseDerivativeRadiationDrive: finite(report.material?.responseDerivativeRadiationDrive, report.quantumMaterialResponseDerivativeRadiationDrive),
    quantumMaterialResponseDerivativeThermalFluxBoostProxy: finite(report.material?.responseDerivativeThermalFluxBoostProxy, report.quantumMaterialResponseDerivativeThermalFluxBoostProxy),
    quantumMaterialResponseDerivativePhaseDriveBoostProxy: finite(report.material?.responseDerivativePhaseDriveBoostProxy, report.quantumMaterialResponseDerivativePhaseDriveBoostProxy),
    quantumMaterialResponseDerivativeElectricalDrive: finite(report.material?.responseDerivativeElectricalDrive, report.quantumMaterialResponseDerivativeElectricalDrive),
    quantumMaterialResponseDerivativeMechanicalDrive: finite(report.material?.responseDerivativeMechanicalDrive, report.quantumMaterialResponseDerivativeMechanicalDrive),
    quantumMaterialResponseDerivativeOpticalDrive: finite(report.material?.responseDerivativeOpticalDrive, report.quantumMaterialResponseDerivativeOpticalDrive),
    quantumMaterialResponseDerivativeDampingScale: finite(report.material?.responseDerivativeDampingScale, report.quantumMaterialResponseDerivativeDampingScale ?? 1),
    fanoutOversubscriptionProxy: finite(report.residuals?.fanoutOversubscriptionProxy, report.fanoutOversubscriptionProxy),
    balanceResidualProxy: finite(report.residuals?.balanceResidualProxy, report.balanceResidualProxy),
    inferredFromConsumers: report.source?.inferredFromConsumers === true || report.inferredFromConsumers === true
  };
}

export function createMolecularSourceEquationReport({
  balance = null,
  source = {},
  environment = {},
  timeSeconds = 0,
  controlVolumeM3 = 1e-9,
  densityKgM3 = 997,
  heatCapacityJKgK = 4184,
  heatScaleW = 0.02,
  speciesScalePerSecond = 1
} = {}) {
  const balanceSummary = summarizeMolecularSourceSinkBalanceReport(balance)
    || summarizeMolecularSourceSinkBalanceReport(source.sourceSinkBalance)
    || {};
  const volume = Math.max(1e-18, finite(controlVolumeM3, 1e-9));
  const density = Math.max(1e-9, finite(densityKgM3, 997));
  const massKg = Math.max(1e-12, volume * density);
  const heatCapacity = Math.max(1, finite(heatCapacityJKgK, 4184));
  const heatScale = Math.max(1e-9, finite(heatScaleW, 0.02));
  const speciesScale = Math.max(1e-9, finite(speciesScalePerSecond, 1));
  const phaseEosBasis = source.phaseEos?.schema === MOLECULAR_PHASE_EOS_BASIS_SCHEMA
    ? source.phaseEos
    : summarizeMolecularPhaseEosBasis({
      molecular: source,
      environment
    });
  const sourceQuantumMaterialPropertySource = summarizeQuantumMaterialPropertySource({ molecular: source });
  const balanceQuantumMaterialPropertySource = summarizeQuantumMaterialPropertySource({
    molecular: balance?.material?.quantumMaterialPropertySource
      || balanceSummary.quantumMaterialPropertySource
      || {
        active: balanceSummary.quantumMaterialPropertyActive,
        thermalFluxBoostProxy: balanceSummary.quantumMaterialPropertyThermalFluxBoostProxy,
        phaseDriveBoostProxy: balanceSummary.quantumMaterialPropertyPhaseDriveBoostProxy,
        electricalDrive: balanceSummary.quantumMaterialPropertyElectricalDrive,
        opticalHeatingDrive: balanceSummary.quantumMaterialPropertyOpticalHeatingDrive,
        mechanicalStiffnessDrive: balanceSummary.quantumMaterialPropertyMechanicalStiffnessDrive
      }
  });
  const quantumMaterialPropertySource = sourceQuantumMaterialPropertySource.active === true
    ? sourceQuantumMaterialPropertySource
    : balanceQuantumMaterialPropertySource;
  const sourceQuantumMaterialStatisticalSource = summarizeQuantumMaterialStatisticalSource({
    source,
    molecular: source
  });
  const balanceQuantumMaterialStatisticalSource = summarizeQuantumMaterialStatisticalSource({
    source: balance?.material?.quantumMaterialStatisticalSource
      || balanceSummary.quantumMaterialStatisticalSource
      || {
        sourceEquationSchema: balanceSummary.quantumMaterialStatisticalSourceEquationSchema,
        channelCount: balanceSummary.quantumMaterialStatisticalSourceChannelCount,
        pressureDriveProxy: balanceSummary.quantumMaterialStatisticalPressureDriveProxy,
        opacityDriveProxy: balanceSummary.quantumMaterialStatisticalOpacityDriveProxy,
        ionizationDriveProxy: balanceSummary.quantumMaterialStatisticalIonizationDriveProxy,
        degeneracyPressureDriveProxy: balanceSummary.quantumMaterialStatisticalDegeneracyPressureDriveProxy,
        temperatureDeltaKProxy: balanceSummary.quantumMaterialStatisticalTemperatureDeltaKProxy,
        chargeDeltaProxy: balanceSummary.quantumMaterialStatisticalChargeDeltaProxy,
        thermalDampingScale: balanceSummary.quantumMaterialStatisticalThermalDampingScale
      }
  });
  const quantumMaterialStatisticalSource = sourceQuantumMaterialStatisticalSource.active === true
    ? sourceQuantumMaterialStatisticalSource
    : balanceQuantumMaterialStatisticalSource;
  const sourceQuantumMaterialResponseDerivativeSource = summarizeQuantumMaterialResponseDerivativeSource({
    molecular: source
  });
  const balanceQuantumMaterialResponseDerivativeSource = summarizeQuantumMaterialResponseDerivativeSource({
    molecular: balance?.material?.quantumMaterialResponseDerivativeSource
      || balanceSummary.quantumMaterialResponseDerivativeSource
      || {
        active: balanceSummary.quantumMaterialResponseDerivativeActive,
        temperatureDrive: balanceSummary.quantumMaterialResponseDerivativeTemperatureDrive,
        pressureDrive: balanceSummary.quantumMaterialResponseDerivativePressureDrive,
        fieldDrive: balanceSummary.quantumMaterialResponseDerivativeFieldDrive,
        radiationDrive: balanceSummary.quantumMaterialResponseDerivativeRadiationDrive,
        thermalFluxDerivativeBoostProxy: balanceSummary.quantumMaterialResponseDerivativeThermalFluxBoostProxy,
        phaseDerivativeDriveBoostProxy: balanceSummary.quantumMaterialResponseDerivativePhaseDriveBoostProxy,
        electricalDerivativeDrive: balanceSummary.quantumMaterialResponseDerivativeElectricalDrive,
        mechanicalDerivativeDrive: balanceSummary.quantumMaterialResponseDerivativeMechanicalDrive,
        opticalDerivativeDrive: balanceSummary.quantumMaterialResponseDerivativeOpticalDrive,
        materialDerivativeDampingScale: balanceSummary.quantumMaterialResponseDerivativeDampingScale
      }
  });
  const quantumMaterialResponseDerivativeSource = sourceQuantumMaterialResponseDerivativeSource.active === true
    ? sourceQuantumMaterialResponseDerivativeSource
    : balanceQuantumMaterialResponseDerivativeSource;
  const heatSourceProxy = finite(balanceSummary.reactionHeatSourceProxy, finite(source.reactionHeatSourceProxy));
  const speciesSourceProxy = Math.max(0, finite(balanceSummary.reactionSpeciesRateProxy, finite(source.reactionSpeciesRateProxy)));
  const heatResidualProxy = Math.max(0, finite(balanceSummary.heatProxyResidual));
  const speciesResidualProxy = Math.max(0, finite(balanceSummary.speciesRateResidualProxy));
  const sourceHeatRateWProxy = heatSourceProxy * heatScale;
  const signedHeatResidualWProxy = Math.sign(sourceHeatRateWProxy || heatSourceProxy || 1) * heatResidualProxy * heatScale;
  const resolvedConsumerHeatRateWProxy = sourceHeatRateWProxy - signedHeatResidualWProxy;
  const sourceSpeciesRateProxy = speciesSourceProxy * speciesScale;
  const openSpeciesRateResidualProxy = speciesResidualProxy * speciesScale;
  const resolvedSpeciesRateProxy = Math.max(0, sourceSpeciesRateProxy - openSpeciesRateResidualProxy);
  const temperatureRateKpsProxy = sourceHeatRateWProxy / (massKg * heatCapacity);
  const resolvedTemperatureRateKpsProxy = resolvedConsumerHeatRateWProxy / (massKg * heatCapacity);
  const phaseEnergyRateWProxy = finite(phaseEosBasis.source?.phaseEnergyRateProxy) * heatScale;
  const latentHeatBudgetRateWProxy = finite(phaseEosBasis.basis?.latentHeatBudgetProxy) * heatScale;
  const status = balanceSummary.status || (Math.abs(sourceHeatRateWProxy) > 0 || sourceSpeciesRateProxy > 0 ? 'tracked' : 'idle');

  return {
    schema: MOLECULAR_SOURCE_EQUATION_SCHEMA,
    mode: 'unit-aware-reduced-source-equation-scaffold-v0',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    basis: {
      representativeVolumeM3: rounded(volume, 12),
      densityKgM3: rounded(density, 6),
      representativeMassKg: rounded(massKg, 12),
      heatCapacityJKgK: rounded(heatCapacity, 6),
      ambientTemperatureK: rounded(finite(environment.ambientTemperatureK, 294), 3),
      ambientPressurePa: rounded(finite(environment.ambientPressurePa, 101325), 3),
      oxygenFraction: rounded(finite(environment.oxygenFraction, 0), 6),
      phaseEosSchema: phaseEosBasis.schema,
      phaseEosStatus: phaseEosBasis.status,
      phaseEosHeatCapacityProxy: rounded(phaseEosBasis.basis?.heatCapacityProxy, 9),
      phaseEosSpecificInternalEnergyProxy: rounded(phaseEosBasis.basis?.specificInternalEnergyProxy, 9),
      phaseEosSpecificEnthalpyProxy: rounded(phaseEosBasis.basis?.specificEnthalpyProxy, 9),
      phaseEosSpecificFreeEnergyProxy: rounded(phaseEosBasis.basis?.specificFreeEnergyProxy, 9),
      phaseEosLatentHeatBudgetProxy: rounded(phaseEosBasis.basis?.latentHeatBudgetProxy, 9),
      phaseEosPhaseStabilityResidualProxy: rounded(phaseEosBasis.phase?.phaseStabilityResidualProxy, 6),
      closedSystem: false,
      sourceBalanceSchema: balance?.schema || null,
      sourceBalanceStatus: balanceSummary.status || 'unknown'
    },
    equations: {
      energy: 'dE/dt = Q_molecular - sum(Q_consumers) - Q_open',
      temperature: 'dT/dt = (dE/dt) / (m * cp)',
      species: 'dN_i/dt = R_i,molecular - sum(R_i,consumers) - R_i,open'
    },
    terms: {
      energy: {
        sourceRateWProxy: rounded(sourceHeatRateWProxy, 9),
        resolvedConsumerRateWProxy: rounded(resolvedConsumerHeatRateWProxy, 9),
        openSystemResidualRateWProxy: rounded(signedHeatResidualWProxy, 9),
        temperatureRateKPerSProxy: rounded(temperatureRateKpsProxy, 9),
        resolvedTemperatureRateKPerSProxy: rounded(resolvedTemperatureRateKpsProxy, 9),
        phaseEnergyRateWProxy: rounded(phaseEnergyRateWProxy, 9),
        latentHeatBudgetRateWProxy: rounded(latentHeatBudgetRateWProxy, 9),
        phaseEosTemperatureDeltaKProxy: rounded(phaseEosBasis.source?.sourceTemperatureDeltaKProxy, 6),
        phaseEosStabilityResidualProxy: rounded(phaseEosBasis.phase?.phaseStabilityResidualProxy, 6),
        phaseEosSpecificFreeEnergyProxy: rounded(phaseEosBasis.basis?.specificFreeEnergyProxy, 9),
        unit: 'W-proxy',
        dimensions: 'M L^2 T^-3',
        unitStatus: 'scaled-proxy'
      },
      material: {
        quantumMaterialPropertySource,
        thermalFluxBoostProxy: rounded(quantumMaterialPropertySource.thermalFluxBoostProxy, 6),
        phaseDriveBoostProxy: rounded(quantumMaterialPropertySource.phaseDriveBoostProxy, 9),
        electricalDrive: rounded(quantumMaterialPropertySource.electricalDrive, 9),
        opticalHeatingDrive: rounded(quantumMaterialPropertySource.opticalHeatingDrive, 9),
        mechanicalStiffnessDrive: rounded(quantumMaterialPropertySource.mechanicalStiffnessDrive, 9),
        materialDampingScale: rounded(quantumMaterialPropertySource.materialDampingScale, 6),
        quantumMaterialStatisticalSource,
        statisticalSourceEquationSchema: quantumMaterialStatisticalSource.sourceEquationSchema,
        statisticalSourceChannelCount: quantumMaterialStatisticalSource.channelCount,
        statisticalPressureDriveProxy: rounded(quantumMaterialStatisticalSource.pressureDriveProxy, 9),
        statisticalOpacityDriveProxy: rounded(quantumMaterialStatisticalSource.opacityDriveProxy, 9),
        statisticalIonizationDriveProxy: rounded(quantumMaterialStatisticalSource.ionizationDriveProxy, 9),
        statisticalDegeneracyPressureDriveProxy: rounded(quantumMaterialStatisticalSource.degeneracyPressureDriveProxy, 9),
        statisticalTemperatureDeltaKProxy: rounded(quantumMaterialStatisticalSource.temperatureDeltaKProxy, 6),
        statisticalChargeDeltaProxy: rounded(quantumMaterialStatisticalSource.chargeDeltaProxy, 9),
        statisticalThermalDampingScale: rounded(quantumMaterialStatisticalSource.thermalDampingScale, 6),
        quantumMaterialResponseDerivativeSource,
        responseDerivativeTemperatureDrive: rounded(quantumMaterialResponseDerivativeSource.temperatureDrive, 9),
        responseDerivativePressureDrive: rounded(quantumMaterialResponseDerivativeSource.pressureDrive, 9),
        responseDerivativeFieldDrive: rounded(quantumMaterialResponseDerivativeSource.fieldDrive, 9),
        responseDerivativeRadiationDrive: rounded(quantumMaterialResponseDerivativeSource.radiationDrive, 9),
        responseDerivativeThermalFluxBoostProxy: rounded(quantumMaterialResponseDerivativeSource.thermalFluxDerivativeBoostProxy, 6),
        responseDerivativePhaseDriveBoostProxy: rounded(quantumMaterialResponseDerivativeSource.phaseDerivativeDriveBoostProxy, 9),
        responseDerivativeElectricalDrive: rounded(quantumMaterialResponseDerivativeSource.electricalDerivativeDrive, 9),
        responseDerivativeMechanicalDrive: rounded(quantumMaterialResponseDerivativeSource.mechanicalDerivativeDrive, 9),
        responseDerivativeOpticalDrive: rounded(quantumMaterialResponseDerivativeSource.opticalDerivativeDrive, 9),
        responseDerivativeDampingScale: rounded(quantumMaterialResponseDerivativeSource.materialDerivativeDampingScale, 6),
        unitStatus: 'property-response-proxy'
      },
      species: {
        sourceRateCountPerSProxy: rounded(sourceSpeciesRateProxy, 6),
        resolvedConsumerRateCountPerSProxy: rounded(resolvedSpeciesRateProxy, 6),
        openSystemResidualRateCountPerSProxy: rounded(openSpeciesRateResidualProxy, 6),
        unit: 'count/s-proxy',
        dimensions: 'T^-1',
        unitStatus: 'scaled-proxy'
      },
      coverage: {
        sourceDriveCoverage: rounded(finite(balanceSummary.sourceDriveCoverage, 1), 6),
        coolingDriveCoverage: rounded(finite(balanceSummary.coolingDriveCoverage, 1), 6),
        heatProxyCoverage: rounded(finite(balanceSummary.heatProxyCoverage, 1), 6),
        speciesRateCoverage: rounded(finite(balanceSummary.speciesRateCoverage, 1), 6),
        activeTargetCount: Math.max(0, Math.round(finite(balanceSummary.activeTargetCount)))
      },
      residuals: {
        balanceResidualProxy: rounded(finite(balanceSummary.balanceResidualProxy), 6),
        heatProxyResidual: rounded(heatResidualProxy, 6),
        speciesRateResidualProxy: rounded(speciesResidualProxy, 6),
        phaseEosStabilityResidualProxy: rounded(
          Math.max(
            finite(balanceSummary.consumerPhaseEosStabilityResidualProxy),
            finite(phaseEosBasis.phase?.phaseStabilityResidualProxy)
          ),
          6
        ),
        fanoutOversubscriptionProxy: rounded(finite(balanceSummary.fanoutOversubscriptionProxy), 6)
      }
    },
    validity: {
      status: 'interactive-proxy',
      confidence: 0.24,
      warnings: [
        'Molecular source equation is a unit-aware scaffold over reduced telemetry, not calibrated enthalpy or kinetics.',
        'Scientific mode must replace heat/species scale factors with validated material data and conservative transfer.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_SOURCE_EQUATION_SCHEMA,
      sourceBalanceSchema: balance?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularSourceEquationReport(report = null) {
  if (report?.schema !== MOLECULAR_SOURCE_EQUATION_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    representativeMassKg: finite(report.basis?.representativeMassKg),
    heatCapacityJKgK: finite(report.basis?.heatCapacityJKgK),
    sourceBalanceStatus: report.basis?.sourceBalanceStatus || 'unknown',
    sourceRateWProxy: finite(report.terms?.energy?.sourceRateWProxy),
    resolvedConsumerRateWProxy: finite(report.terms?.energy?.resolvedConsumerRateWProxy),
    openSystemResidualRateWProxy: finite(report.terms?.energy?.openSystemResidualRateWProxy),
    temperatureRateKPerSProxy: finite(report.terms?.energy?.temperatureRateKPerSProxy),
    resolvedTemperatureRateKPerSProxy: finite(report.terms?.energy?.resolvedTemperatureRateKPerSProxy),
    phaseEnergyRateWProxy: finite(report.terms?.energy?.phaseEnergyRateWProxy),
    latentHeatBudgetRateWProxy: finite(report.terms?.energy?.latentHeatBudgetRateWProxy),
    phaseEosTemperatureDeltaKProxy: finite(report.terms?.energy?.phaseEosTemperatureDeltaKProxy),
    phaseEosStabilityResidualProxy: finite(report.terms?.energy?.phaseEosStabilityResidualProxy),
    phaseEosSpecificFreeEnergyProxy: finite(report.terms?.energy?.phaseEosSpecificFreeEnergyProxy),
    phaseEosSchema: report.basis?.phaseEosSchema || null,
    phaseEosStatus: report.basis?.phaseEosStatus || 'unknown',
    quantumMaterialPropertySource: report.terms?.material?.quantumMaterialPropertySource || null,
    quantumMaterialPropertyThermalFluxBoostProxy: finite(report.terms?.material?.thermalFluxBoostProxy, report.quantumMaterialPropertyThermalFluxBoostProxy),
    quantumMaterialPropertyPhaseDriveBoostProxy: finite(report.terms?.material?.phaseDriveBoostProxy, report.quantumMaterialPropertyPhaseDriveBoostProxy),
    quantumMaterialPropertyElectricalDrive: finite(report.terms?.material?.electricalDrive, report.quantumMaterialPropertyElectricalDrive),
    quantumMaterialPropertyOpticalHeatingDrive: finite(report.terms?.material?.opticalHeatingDrive, report.quantumMaterialPropertyOpticalHeatingDrive),
    quantumMaterialPropertyMechanicalStiffnessDrive: finite(report.terms?.material?.mechanicalStiffnessDrive, report.quantumMaterialPropertyMechanicalStiffnessDrive),
    quantumMaterialPropertyDampingScale: finite(report.terms?.material?.materialDampingScale, report.quantumMaterialPropertyDampingScale),
    quantumMaterialStatisticalSource: report.terms?.material?.quantumMaterialStatisticalSource || null,
    quantumMaterialStatisticalSourceEquationSchema: report.terms?.material?.statisticalSourceEquationSchema || report.terms?.material?.quantumMaterialStatisticalSource?.sourceEquationSchema || null,
    quantumMaterialStatisticalSourceChannelCount: Math.max(0, Math.round(finite(
      report.terms?.material?.statisticalSourceChannelCount,
      report.terms?.material?.quantumMaterialStatisticalSource?.channelCount
    ))),
    quantumMaterialStatisticalPressureDriveProxy: finite(report.terms?.material?.statisticalPressureDriveProxy, report.terms?.material?.quantumMaterialStatisticalSource?.pressureDriveProxy),
    quantumMaterialStatisticalOpacityDriveProxy: finite(report.terms?.material?.statisticalOpacityDriveProxy, report.terms?.material?.quantumMaterialStatisticalSource?.opacityDriveProxy),
    quantumMaterialStatisticalIonizationDriveProxy: finite(report.terms?.material?.statisticalIonizationDriveProxy, report.terms?.material?.quantumMaterialStatisticalSource?.ionizationDriveProxy),
    quantumMaterialStatisticalDegeneracyPressureDriveProxy: finite(report.terms?.material?.statisticalDegeneracyPressureDriveProxy, report.terms?.material?.quantumMaterialStatisticalSource?.degeneracyPressureDriveProxy),
    quantumMaterialStatisticalTemperatureDeltaKProxy: finite(report.terms?.material?.statisticalTemperatureDeltaKProxy, report.terms?.material?.quantumMaterialStatisticalSource?.temperatureDeltaKProxy),
    quantumMaterialStatisticalChargeDeltaProxy: finite(report.terms?.material?.statisticalChargeDeltaProxy, report.terms?.material?.quantumMaterialStatisticalSource?.chargeDeltaProxy),
    quantumMaterialStatisticalThermalDampingScale: finite(report.terms?.material?.statisticalThermalDampingScale, report.terms?.material?.quantumMaterialStatisticalSource?.thermalDampingScale ?? 1),
    quantumMaterialResponseDerivativeSource: report.terms?.material?.quantumMaterialResponseDerivativeSource || null,
    quantumMaterialResponseDerivativeActive: report.terms?.material?.quantumMaterialResponseDerivativeSource?.active === true
      || finite(report.terms?.material?.responseDerivativeThermalFluxBoostProxy) > 0
      || finite(report.terms?.material?.responseDerivativePhaseDriveBoostProxy) > 0
      || finite(report.terms?.material?.responseDerivativeElectricalDrive) > 0
      || finite(report.terms?.material?.responseDerivativeMechanicalDrive) > 0
      || finite(report.terms?.material?.responseDerivativeOpticalDrive) > 0,
    quantumMaterialResponseDerivativeTemperatureDrive: finite(report.terms?.material?.responseDerivativeTemperatureDrive, report.terms?.material?.quantumMaterialResponseDerivativeSource?.temperatureDrive),
    quantumMaterialResponseDerivativePressureDrive: finite(report.terms?.material?.responseDerivativePressureDrive, report.terms?.material?.quantumMaterialResponseDerivativeSource?.pressureDrive),
    quantumMaterialResponseDerivativeFieldDrive: finite(report.terms?.material?.responseDerivativeFieldDrive, report.terms?.material?.quantumMaterialResponseDerivativeSource?.fieldDrive),
    quantumMaterialResponseDerivativeRadiationDrive: finite(report.terms?.material?.responseDerivativeRadiationDrive, report.terms?.material?.quantumMaterialResponseDerivativeSource?.radiationDrive),
    quantumMaterialResponseDerivativeThermalFluxBoostProxy: finite(report.terms?.material?.responseDerivativeThermalFluxBoostProxy, report.terms?.material?.quantumMaterialResponseDerivativeSource?.thermalFluxDerivativeBoostProxy),
    quantumMaterialResponseDerivativePhaseDriveBoostProxy: finite(report.terms?.material?.responseDerivativePhaseDriveBoostProxy, report.terms?.material?.quantumMaterialResponseDerivativeSource?.phaseDerivativeDriveBoostProxy),
    quantumMaterialResponseDerivativeElectricalDrive: finite(report.terms?.material?.responseDerivativeElectricalDrive, report.terms?.material?.quantumMaterialResponseDerivativeSource?.electricalDerivativeDrive),
    quantumMaterialResponseDerivativeMechanicalDrive: finite(report.terms?.material?.responseDerivativeMechanicalDrive, report.terms?.material?.quantumMaterialResponseDerivativeSource?.mechanicalDerivativeDrive),
    quantumMaterialResponseDerivativeOpticalDrive: finite(report.terms?.material?.responseDerivativeOpticalDrive, report.terms?.material?.quantumMaterialResponseDerivativeSource?.opticalDerivativeDrive),
    quantumMaterialResponseDerivativeDampingScale: finite(report.terms?.material?.responseDerivativeDampingScale, report.terms?.material?.quantumMaterialResponseDerivativeSource?.materialDerivativeDampingScale ?? 1),
    sourceRateCountPerSProxy: finite(report.terms?.species?.sourceRateCountPerSProxy),
    resolvedConsumerRateCountPerSProxy: finite(report.terms?.species?.resolvedConsumerRateCountPerSProxy),
    openSystemResidualRateCountPerSProxy: finite(report.terms?.species?.openSystemResidualRateCountPerSProxy),
    activeTargetCount: Math.max(0, Math.round(finite(report.terms?.coverage?.activeTargetCount))),
    sourceDriveCoverage: finite(report.terms?.coverage?.sourceDriveCoverage),
    heatProxyCoverage: finite(report.terms?.coverage?.heatProxyCoverage),
    balanceResidualProxy: finite(report.terms?.residuals?.balanceResidualProxy),
    heatProxyResidual: finite(report.terms?.residuals?.heatProxyResidual),
    speciesRateResidualProxy: finite(report.terms?.residuals?.speciesRateResidualProxy)
  };
}

export function createMolecularConservativeTransferReport({
  sourceEquation = null,
  balance = null,
  timeSeconds = 0
} = {}) {
  const equationSummary = summarizeMolecularSourceEquationReport(sourceEquation) || {};
  const balanceSummary = summarizeMolecularSourceSinkBalanceReport(balance) || {};
  const consumers = Array.isArray(balance?.consumers) ? balance.consumers : [];
  const activeConsumers = consumers.filter((consumer) => (
    consumer?.targetSolverId
    && (
      Math.abs(finite(consumer.reactionHeatSourceProxy)) > 0
      || finite(consumer.reactionSpeciesRateProxy) > 0
      || finite(consumer.reactionSourceDrive) > 0
      || finite(consumer.reactionCoolingDrive) > 0
      || finite(consumer.phaseDriveProxy) > 0
      || Math.abs(finite(consumer.phaseEosPhaseEnergyRateProxy)) > 0
      || consumer.quantumMaterialPropertyActive === true
      || finite(consumer.quantumMaterialPropertyThermalFluxBoostProxy) > 0
      || finite(consumer.quantumMaterialPropertyPhaseDriveBoostProxy) > 0
      || consumer.quantumMaterialStatisticalActive === true
      || finite(consumer.quantumMaterialStatisticalSourceChannelCount) > 0
      || Math.abs(finite(consumer.quantumMaterialStatisticalPressureDriveProxy)) > 0
      || finite(consumer.quantumMaterialStatisticalOpacityDriveProxy) > 0
      || finite(consumer.quantumMaterialStatisticalIonizationDriveProxy) > 0
      || finite(consumer.quantumMaterialStatisticalDegeneracyPressureDriveProxy) > 0
      || consumer.quantumMaterialResponseDerivativeActive === true
      || finite(consumer.quantumMaterialResponseDerivativeTemperatureDrive) > 0
      || finite(consumer.quantumMaterialResponseDerivativePressureDrive) > 0
      || finite(consumer.quantumMaterialResponseDerivativeFieldDrive) > 0
      || finite(consumer.quantumMaterialResponseDerivativeRadiationDrive) > 0
      || finite(consumer.quantumMaterialResponseDerivativeThermalFluxBoostProxy) > 0
      || finite(consumer.energyResidualProxy) > 0
    )
  ));
  const sourceHeatRateWProxy = finite(equationSummary.sourceRateWProxy);
  const sourceSpeciesRateProxy = Math.max(0, finite(equationSummary.sourceRateCountPerSProxy));
  const residualHeatRateWProxy = finite(equationSummary.openSystemResidualRateWProxy);
  const resolvedHeatRateWProxy = finite(equationSummary.resolvedConsumerRateWProxy, sourceHeatRateWProxy - residualHeatRateWProxy);
  const resolvedSpeciesRateProxy = Math.max(0, finite(
    equationSummary.resolvedConsumerRateCountPerSProxy,
    sourceSpeciesRateProxy - finite(equationSummary.openSystemResidualRateCountPerSProxy)
  ));
  const totalWeight = activeConsumers.reduce((sum, consumer) => (
    sum + Math.max(
      0.000001,
      finite(consumer.reactionSourceDrive)
        + finite(consumer.reactionCoolingDrive) * 0.5
        + Math.abs(finite(consumer.reactionHeatSourceProxy)) * 0.1
        + finite(consumer.reactionSpeciesRateProxy) * 0.001
        + finite(consumer.phaseDriveProxy) * 0.2
        + Math.abs(finite(consumer.phaseEosPhaseEnergyRateProxy)) * 0.02
        + finite(consumer.quantumMaterialPropertyThermalFluxBoostProxy) * 0.00002
        + finite(consumer.quantumMaterialPropertyPhaseDriveBoostProxy) * 0.2
        + finite(consumer.quantumMaterialStatisticalSourceChannelCount) * 0.02
        + Math.abs(finite(consumer.quantumMaterialStatisticalPressureDriveProxy)) * 0.2
        + finite(consumer.quantumMaterialStatisticalOpacityDriveProxy) * 0.2
        + finite(consumer.quantumMaterialResponseDerivativeTemperatureDrive) * 0.4
        + finite(consumer.quantumMaterialResponseDerivativePressureDrive) * 0.25
        + finite(consumer.quantumMaterialResponseDerivativeFieldDrive) * 0.25
        + finite(consumer.quantumMaterialResponseDerivativeRadiationDrive) * 0.25
        + finite(consumer.quantumMaterialResponseDerivativeThermalFluxBoostProxy) * 0.00002
        + finite(consumer.energyResidualProxy) * 0.2
    )
  ), 0);
  const defaultWeight = activeConsumers.length > 0 ? 1 / activeConsumers.length : 0;
  let allocatedHeatRateWProxy = 0;
  let allocatedSpeciesRateProxy = 0;
  const allocations = activeConsumers.map((consumer) => {
    const rawWeight = Math.max(
      0.000001,
      finite(consumer.reactionSourceDrive)
        + finite(consumer.reactionCoolingDrive) * 0.5
        + Math.abs(finite(consumer.reactionHeatSourceProxy)) * 0.1
        + finite(consumer.reactionSpeciesRateProxy) * 0.001
        + finite(consumer.phaseDriveProxy) * 0.2
        + Math.abs(finite(consumer.phaseEosPhaseEnergyRateProxy)) * 0.02
        + finite(consumer.quantumMaterialPropertyThermalFluxBoostProxy) * 0.00002
        + finite(consumer.quantumMaterialPropertyPhaseDriveBoostProxy) * 0.2
        + finite(consumer.quantumMaterialStatisticalSourceChannelCount) * 0.02
        + Math.abs(finite(consumer.quantumMaterialStatisticalPressureDriveProxy)) * 0.2
        + finite(consumer.quantumMaterialStatisticalOpacityDriveProxy) * 0.2
        + finite(consumer.quantumMaterialResponseDerivativeTemperatureDrive) * 0.4
        + finite(consumer.quantumMaterialResponseDerivativePressureDrive) * 0.25
        + finite(consumer.quantumMaterialResponseDerivativeFieldDrive) * 0.25
        + finite(consumer.quantumMaterialResponseDerivativeRadiationDrive) * 0.25
        + finite(consumer.quantumMaterialResponseDerivativeThermalFluxBoostProxy) * 0.00002
        + finite(consumer.energyResidualProxy) * 0.2
    );
    const fraction = totalWeight > 0 ? rawWeight / totalWeight : defaultWeight;
    const heatRate = resolvedHeatRateWProxy * fraction;
    const speciesRate = resolvedSpeciesRateProxy * fraction;
    allocatedHeatRateWProxy += heatRate;
    allocatedSpeciesRateProxy += speciesRate;
    return {
      targetSolverId: consumer.targetSolverId,
      targetField: consumer.targetField || 'unknown',
      fraction: rounded(fraction, 6),
      heatRateWProxy: rounded(heatRate, 9),
      speciesRateCountPerSProxy: rounded(speciesRate, 6),
      unitStatus: 'dry-run-proxy',
      applied: false
    };
  });
  const unallocatedHeatRateWProxy = sourceHeatRateWProxy - allocatedHeatRateWProxy;
  const unallocatedSpeciesRateProxy = Math.max(0, sourceSpeciesRateProxy - allocatedSpeciesRateProxy);
  const closedSystemResidualProxy = clamp(
    Math.abs(unallocatedHeatRateWProxy) * 2
      + unallocatedSpeciesRateProxy * 0.001
      + finite(balanceSummary.balanceResidualProxy) * 0.25,
    0,
    1
  );

  return {
    schema: MOLECULAR_CONSERVATIVE_TRANSFER_SCHEMA,
    mode: 'dry-run-source-equation-allocation-v0',
    status: activeConsumers.length > 0 ? 'dry-run-ready' : 'dry-run-unallocated',
    dryRun: true,
    applied: false,
    timeSeconds: rounded(timeSeconds, 3),
    source: {
      sourceEquationSchema: sourceEquation?.schema || null,
      sourceBalanceSchema: balance?.schema || null,
      heatRateWProxy: rounded(sourceHeatRateWProxy, 9),
      resolvedHeatRateWProxy: rounded(resolvedHeatRateWProxy, 9),
      speciesRateCountPerSProxy: rounded(sourceSpeciesRateProxy, 6),
      resolvedSpeciesRateCountPerSProxy: rounded(resolvedSpeciesRateProxy, 6),
      representativeMassKg: rounded(equationSummary.representativeMassKg, 12),
      heatCapacityJKgK: rounded(equationSummary.heatCapacityJKgK, 6)
    },
    allocations,
    residuals: {
      unallocatedHeatRateWProxy: rounded(unallocatedHeatRateWProxy, 9),
      unallocatedSpeciesRateCountPerSProxy: rounded(unallocatedSpeciesRateProxy, 6),
      balanceResidualProxy: rounded(finite(balanceSummary.balanceResidualProxy), 6),
      closedSystemResidualProxy: rounded(closedSystemResidualProxy, 6)
    },
    units: {
      heatRate: { unit: 'W-proxy', dimensions: 'M L^2 T^-3' },
      speciesRate: { unit: 'count/s-proxy', dimensions: 'T^-1' },
      fraction: { unit: '1', dimensions: '1' }
    },
    validity: {
      status: 'interactive-proxy',
      confidence: 0.22,
      warnings: [
        'Dry-run conservative transfer allocates scaled proxy source terms only; it does not mutate solver state.',
        'Scientific mode still needs calibrated enthalpy, stoichiometry, charge, and closed-system residual tolerances.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_CONSERVATIVE_TRANSFER_SCHEMA,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularConservativeTransferReport(report = null) {
  if (report?.schema !== MOLECULAR_CONSERVATIVE_TRANSFER_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    dryRun: report.dryRun === true,
    applied: report.applied === true,
    allocationCount: Array.isArray(report.allocations) ? report.allocations.length : 0,
    heatRateWProxy: finite(report.source?.heatRateWProxy),
    resolvedHeatRateWProxy: finite(report.source?.resolvedHeatRateWProxy),
    speciesRateCountPerSProxy: finite(report.source?.speciesRateCountPerSProxy),
    resolvedSpeciesRateCountPerSProxy: finite(report.source?.resolvedSpeciesRateCountPerSProxy),
    unallocatedHeatRateWProxy: finite(report.residuals?.unallocatedHeatRateWProxy),
    unallocatedSpeciesRateCountPerSProxy: finite(report.residuals?.unallocatedSpeciesRateCountPerSProxy),
    closedSystemResidualProxy: finite(report.residuals?.closedSystemResidualProxy),
    balanceResidualProxy: finite(report.residuals?.balanceResidualProxy),
    heatUnit: report.units?.heatRate?.unit || 'unknown',
    speciesUnit: report.units?.speciesRate?.unit || 'unknown'
  };
}

function createApplicationGate(id, passed, details = {}) {
  return {
    id,
    passed: passed === true,
    ...details
  };
}

export function createMolecularTransferApplicationReport({
  transfer = null,
  applicationRequested = false,
  mutationEnabled = false,
  scientificMode = false,
  targetAdaptersValidated = false,
  closedResidualToleranceProxy = 0.02,
  timeSeconds = 0
} = {}) {
  const hasTransferSchema = transfer?.schema === MOLECULAR_CONSERVATIVE_TRANSFER_SCHEMA;
  const allocations = Array.isArray(transfer?.allocations) ? transfer.allocations : [];
  const dryRun = transfer?.dryRun === true;
  const applied = transfer?.applied === true;
  const heatUnit = transfer?.units?.heatRate || {};
  const speciesUnit = transfer?.units?.speciesRate || {};
  const hasProxyUnits = heatUnit.unit === 'W-proxy'
    && heatUnit.dimensions === 'M L^2 T^-3'
    && speciesUnit.dimensions === 'T^-1';
  const closedResidual = Math.abs(finite(transfer?.residuals?.closedSystemResidualProxy));
  const tolerance = Math.max(0, finite(closedResidualToleranceProxy, 0.02));
  const hasAllocations = allocations.length > 0;
  const gates = [
    createApplicationGate('transfer-schema', hasTransferSchema, {
      expectedSchema: MOLECULAR_CONSERVATIVE_TRANSFER_SCHEMA,
      actualSchema: transfer?.schema || null
    }),
    createApplicationGate('target-allocations', hasAllocations, {
      allocationCount: allocations.length
    }),
    createApplicationGate('proxy-unit-metadata', hasProxyUnits, {
      heatUnit: heatUnit.unit || 'unknown',
      heatDimensions: heatUnit.dimensions || 'unknown',
      speciesUnit: speciesUnit.unit || 'unknown',
      speciesDimensions: speciesUnit.dimensions || 'unknown'
    }),
    createApplicationGate('closed-residual-tolerance', closedResidual <= tolerance, {
      value: rounded(closedResidual, 6),
      tolerance: rounded(tolerance, 6)
    }),
    createApplicationGate('dry-run-disabled', dryRun === false, {
      dryRun
    }),
    createApplicationGate('mutation-enabled', mutationEnabled === true, {
      mutationEnabled: mutationEnabled === true
    }),
    createApplicationGate('scientific-mode-enabled', scientificMode === true, {
      scientificMode: scientificMode === true
    }),
    createApplicationGate('target-adapters-validated', targetAdaptersValidated === true, {
      targetAdaptersValidated: targetAdaptersValidated === true
    })
  ];
  const blockerIds = gates.filter((gate) => gate.passed !== true).map((gate) => gate.id);
  const canApply = gates.every((gate) => gate.passed === true);
  const readyTargetCount = canApply ? allocations.length : 0;
  const blockedTargetCount = canApply ? 0 : allocations.length;
  const targets = allocations.map((allocation) => ({
    targetSolverId: allocation.targetSolverId || 'unknown',
    targetField: allocation.targetField || 'unknown',
    fraction: rounded(allocation.fraction, 6),
    heatRateWProxy: rounded(allocation.heatRateWProxy, 9),
    speciesRateCountPerSProxy: rounded(allocation.speciesRateCountPerSProxy, 6),
    applicationRequested: applicationRequested === true,
    readyToApply: canApply,
    applied: false,
    status: canApply ? 'ready-to-apply' : 'blocked',
    blockers: canApply ? [] : blockerIds
  }));
  const status = !hasTransferSchema
    ? 'missing-transfer'
    : !hasAllocations
      ? 'no-targets'
      : canApply
        ? (applicationRequested ? 'ready-to-apply' : 'ready-preview')
        : 'blocked';

  return {
    schema: MOLECULAR_TRANSFER_APPLICATION_SCHEMA,
    mode: 'validation-gated-non-mutating-application-v0',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    sourceTransferSchema: transfer?.schema || null,
    applicationRequested: applicationRequested === true,
    mutationEnabled: mutationEnabled === true,
    scientificMode: scientificMode === true,
    targetAdaptersValidated: targetAdaptersValidated === true,
    dryRun,
    sourceApplied: applied,
    canApply,
    applied: false,
    allocationCount: allocations.length,
    readyTargetCount,
    blockedTargetCount,
    appliedTargetCount: 0,
    closedResidualToleranceProxy: rounded(tolerance, 6),
    closedSystemResidualProxy: rounded(closedResidual, 6),
    gates,
    blockers: blockerIds,
    targets,
    validity: {
      status: canApply ? 'ready-for-controlled-application' : 'application-blocked',
      confidence: 0.24,
      warnings: canApply
        ? [
            'Transfer inputs passed current proxy gates, but application must still occur through an explicit mutation path.'
          ]
        : [
            'Molecular transfer application is blocked until dry-run, mutation, scientific-mode, and target-validation gates pass.',
            'No molecular source terms are applied by this report.'
          ]
    },
    provenance: {
      adapter: MOLECULAR_TRANSFER_APPLICATION_SCHEMA,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTransferApplicationReport(report = null) {
  if (report?.schema !== MOLECULAR_TRANSFER_APPLICATION_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    canApply: report.canApply === true,
    applied: report.applied === true,
    applicationRequested: report.applicationRequested === true,
    mutationEnabled: report.mutationEnabled === true,
    scientificMode: report.scientificMode === true,
    targetAdaptersValidated: report.targetAdaptersValidated === true,
    dryRun: report.dryRun === true,
    allocationCount: Math.max(0, Math.round(finite(report.allocationCount, report.targets?.length))),
    readyTargetCount: Math.max(0, Math.round(finite(report.readyTargetCount))),
    blockedTargetCount: Math.max(0, Math.round(finite(report.blockedTargetCount))),
    appliedTargetCount: Math.max(0, Math.round(finite(report.appliedTargetCount))),
    closedResidualToleranceProxy: finite(report.closedResidualToleranceProxy),
    closedSystemResidualProxy: finite(report.closedSystemResidualProxy),
    blockerCount: Array.isArray(report.blockers) ? report.blockers.length : 0,
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

export function createMolecularTransferTransactionReport({
  application = null,
  timeSeconds = 0,
  transactionEnabled = false,
  mutatorId = null
} = {}) {
  const hasApplicationSchema = application?.schema === MOLECULAR_TRANSFER_APPLICATION_SCHEMA;
  const targets = Array.isArray(application?.targets) ? application.targets : [];
  const applicationRequested = application?.applicationRequested === true;
  const applicationCanApply = application?.canApply === true;
  const transactionArmed = transactionEnabled === true;
  const mutatorReady = typeof mutatorId === 'string' && mutatorId.trim().length > 0;
  const allowed = hasApplicationSchema && applicationRequested && applicationCanApply && transactionArmed && mutatorReady;
  const blockers = [];
  if (!hasApplicationSchema) blockers.push('missing-application-report');
  if (!applicationRequested) blockers.push('application-not-requested');
  if (!applicationCanApply) blockers.push('application-gate-blocked');
  if (!transactionArmed) blockers.push('transaction-disabled');
  if (!mutatorReady) blockers.push('mutator-unavailable');
  const applicationBlockers = Array.isArray(application?.blockers) ? application.blockers : [];
  for (const blocker of applicationBlockers) {
    if (typeof blocker === 'string' && blocker && !blockers.includes(blocker)) blockers.push(blocker);
  }
  const plannedTargets = targets.map((target) => {
    const targetAllowed = allowed && target.readyToApply === true;
    return {
      targetSolverId: target.targetSolverId || 'unknown',
      targetField: target.targetField || 'unknown',
      fraction: rounded(target.fraction, 6),
      heatRateWProxy: rounded(target.heatRateWProxy, 9),
      speciesRateCountPerSProxy: rounded(target.speciesRateCountPerSProxy, 6),
      requested: applicationRequested,
      readyToApply: target.readyToApply === true,
      transactionAllowed: targetAllowed,
      applied: false,
      status: targetAllowed ? 'mutation-not-implemented' : 'blocked',
      blockers: targetAllowed ? ['mutating-transaction-not-implemented'] : blockers
    };
  });
  const readyTargetCount = plannedTargets.filter((target) => target.transactionAllowed).length;
  const blockedTargetCount = plannedTargets.length - readyTargetCount;
  const status = !hasApplicationSchema
    ? 'missing-application'
    : !applicationRequested
      ? 'not-requested'
      : !applicationCanApply
        ? 'blocked-by-application-gate'
        : !transactionArmed || !mutatorReady
          ? 'blocked-by-transaction-gate'
          : 'mutation-not-implemented';

  return {
    schema: MOLECULAR_TRANSFER_TRANSACTION_SCHEMA,
    mode: 'default-off-non-mutating-transaction-scaffold-v0',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    sourceApplicationSchema: application?.schema || null,
    applicationStatus: application?.status || 'unknown',
    applicationRequested,
    applicationCanApply,
    transactionEnabled: transactionArmed,
    mutatorId: mutatorReady ? mutatorId.trim() : null,
    allowed,
    mutationAttempted: applicationRequested,
    applied: false,
    targetCount: plannedTargets.length,
    readyTargetCount,
    blockedTargetCount,
    appliedTargetCount: 0,
    blockerCount: blockers.length,
    blockers,
    targets: plannedTargets,
    validity: {
      status: allowed ? 'ready-but-not-mutating' : 'transaction-blocked',
      confidence: 0.2,
      warnings: [
        'Molecular transfer transaction is a default-off scaffold and does not mutate solver state.',
        'Validated conservative source equations and explicit target mutators are required before applied source terms are allowed.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TRANSFER_TRANSACTION_SCHEMA,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTransferTransactionReport(report = null) {
  if (report?.schema !== MOLECULAR_TRANSFER_TRANSACTION_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    allowed: report.allowed === true,
    mutationAttempted: report.mutationAttempted === true,
    applied: report.applied === true,
    transactionEnabled: report.transactionEnabled === true,
    applicationRequested: report.applicationRequested === true,
    applicationCanApply: report.applicationCanApply === true,
    targetCount: Math.max(0, Math.round(finite(report.targetCount, report.targets?.length))),
    readyTargetCount: Math.max(0, Math.round(finite(report.readyTargetCount))),
    blockedTargetCount: Math.max(0, Math.round(finite(report.blockedTargetCount))),
    appliedTargetCount: Math.max(0, Math.round(finite(report.appliedTargetCount))),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

function summarizePreviewTargetState(targetSolverId, state = {}) {
  if (targetSolverId === 'reactive-thermal-cell') {
    return {
      temperatureK: rounded(state.temperatureK, 3),
      pressurePa: rounded(state.pressurePa, 3),
      heatReleaseNorm: rounded(state.heatReleaseNorm, 6),
      molecularClosureHeatFluxProxy: rounded(state.molecularClosureHeatFluxProxy, 6),
      molecularReactionHeatSourceProxy: rounded(state.molecularReactionHeatSourceProxy, 6),
      molecularReactionSpeciesRateProxy: rounded(state.molecularReactionSpeciesRateProxy, 6),
      molecularReactionSourceDrive: rounded(state.molecularReactionSourceDrive, 6)
    };
  }
  if (targetSolverId === 'sph-material') {
    return {
      averageTemperatureK: rounded(state.averageTemperatureK, 3),
      iceFraction: rounded(state.iceFraction, 6),
      liquidFraction: rounded(state.liquidFraction, 6),
      vaporFraction: rounded(state.vaporFraction, 6),
      phaseChangeRateProxy: rounded(state.phaseChangeRateProxy, 9),
      molecularClosureRadiativeHeatFluxBoost: rounded(state.molecularClosureRadiativeHeatFluxBoost, 6),
      molecularReactionHeatSourceProxy: rounded(state.molecularReactionHeatSourceProxy, 6),
      molecularReactionSpeciesRateProxy: rounded(state.molecularReactionSpeciesRateProxy, 6),
      molecularReactionSourceDrive: rounded(state.molecularReactionSourceDrive, 6)
    };
  }
  return {
    temperatureK: rounded(state.temperatureK ?? state.averageTemperatureK, 3),
    molecularReactionHeatSourceProxy: rounded(state.molecularReactionHeatSourceProxy, 6),
    molecularReactionSpeciesRateProxy: rounded(state.molecularReactionSpeciesRateProxy, 6)
  };
}

function createTargetMutationPreview({ target = {}, targetState = {}, previewDtSeconds = 1 / 60, inheritedBlockers = [] } = {}) {
  const targetSolverId = target.targetSolverId || targetState.solverId || 'unknown';
  const state = targetState.state || {};
  const heatRateWProxy = finite(target.heatRateWProxy);
  const speciesRateCountPerSProxy = finite(target.speciesRateCountPerSProxy);
  const dt = clamp(finite(previewDtSeconds, 1 / 60), 0.001, 1);
  const heatMagnitude = Math.abs(heatRateWProxy);
  const speciesMagnitude = Math.max(0, speciesRateCountPerSProxy);
  const baseDeltaK = targetSolverId === 'reactive-thermal-cell'
    ? heatRateWProxy * dt * 1200 + speciesMagnitude * dt * 0.004
    : heatRateWProxy * dt * 450 + speciesMagnitude * dt * 0.0015;
  const temperatureDeltaKProxy = rounded(baseDeltaK, 6);
  const phaseDriveDeltaProxy = targetSolverId === 'sph-material'
    ? rounded(clamp(heatMagnitude * dt * 0.08 + speciesMagnitude * dt * 0.0008, 0, 1), 9)
    : 0;
  const reactionDriveDeltaProxy = rounded(clamp(heatMagnitude * 8 + speciesMagnitude * 0.001, 0, 1), 6);
  const before = summarizePreviewTargetState(targetSolverId, state);
  const after = { ...before };
  if (targetSolverId === 'reactive-thermal-cell') {
    after.temperatureK = rounded(finite(before.temperatureK) + temperatureDeltaKProxy, 3);
    after.pressurePa = rounded(finite(before.pressurePa) + temperatureDeltaKProxy * 44, 3);
    after.molecularClosureHeatFluxProxy = rounded(
      finite(before.molecularClosureHeatFluxProxy) + heatMagnitude * 18,
      6
    );
    after.molecularReactionHeatSourceProxy = rounded(
      finite(before.molecularReactionHeatSourceProxy) + heatRateWProxy,
      6
    );
    after.molecularReactionSpeciesRateProxy = rounded(
      finite(before.molecularReactionSpeciesRateProxy) + speciesRateCountPerSProxy,
      6
    );
    after.molecularReactionSourceDrive = rounded(
      clamp(finite(before.molecularReactionSourceDrive) + reactionDriveDeltaProxy, 0, 1),
      6
    );
  } else if (targetSolverId === 'sph-material') {
    after.averageTemperatureK = rounded(finite(before.averageTemperatureK) + temperatureDeltaKProxy, 3);
    after.phaseChangeRateProxy = rounded(
      finite(before.phaseChangeRateProxy) + phaseDriveDeltaProxy,
      9
    );
    after.molecularClosureRadiativeHeatFluxBoost = rounded(
      finite(before.molecularClosureRadiativeHeatFluxBoost) + heatMagnitude * 7,
      6
    );
    after.molecularReactionHeatSourceProxy = rounded(
      finite(before.molecularReactionHeatSourceProxy) + heatRateWProxy,
      6
    );
    after.molecularReactionSpeciesRateProxy = rounded(
      finite(before.molecularReactionSpeciesRateProxy) + speciesRateCountPerSProxy,
      6
    );
    after.molecularReactionSourceDrive = rounded(
      clamp(finite(before.molecularReactionSourceDrive) + reactionDriveDeltaProxy, 0, 1),
      6
    );
  } else {
    after.temperatureK = rounded(finite(before.temperatureK) + temperatureDeltaKProxy, 3);
  }

  const blockers = [...inheritedBlockers];
  for (const blocker of ['target-mutator-not-validated', 'preview-only-non-mutating']) {
    if (!blockers.includes(blocker)) blockers.push(blocker);
  }
  return {
    targetSolverId,
    stateKey: targetState.stateKey || null,
    layer: targetState.layer || 'unknown',
    targetField: target.targetField || 'unknown',
    fraction: rounded(target.fraction, 6),
    heatRateWProxy: rounded(heatRateWProxy, 9),
    speciesRateCountPerSProxy: rounded(speciesRateCountPerSProxy, 6),
    previewDtSeconds: rounded(dt, 6),
    dryRun: true,
    wouldMutate: false,
    applied: false,
    status: 'preview-blocked',
    blockers,
    sourceTerms: {
      temperatureDeltaKProxy,
      phaseDriveDeltaProxy,
      reactionDriveDeltaProxy
    },
    before,
    after
  };
}

export function createMolecularTargetMutatorPreviewReport({
  transaction = null,
  targetStates = {},
  timeSeconds = 0,
  previewDtSeconds = 1 / 60
} = {}) {
  const hasTransactionSchema = transaction?.schema === MOLECULAR_TRANSFER_TRANSACTION_SCHEMA;
  const targets = Array.isArray(transaction?.targets) ? transaction.targets : [];
  const inheritedBlockers = Array.isArray(transaction?.blockers) ? transaction.blockers : [];
  const previews = targets.map((target) => createTargetMutationPreview({
    target,
    targetState: targetStates[target.targetSolverId] || {},
    previewDtSeconds,
    inheritedBlockers: Array.isArray(target.blockers) ? target.blockers : inheritedBlockers
  }));
  const blockers = [...inheritedBlockers];
  if (!hasTransactionSchema) blockers.push('missing-transaction-report');
  for (const blocker of ['target-mutator-not-validated', 'preview-only-non-mutating']) {
    if (!blockers.includes(blocker)) blockers.push(blocker);
  }
  const totalHeatRateWProxy = previews.reduce((sum, preview) => sum + finite(preview.heatRateWProxy), 0);
  const totalSpeciesRateCountPerSProxy = previews.reduce((sum, preview) => sum + finite(preview.speciesRateCountPerSProxy), 0);
  const maxAbsTemperatureDeltaKProxy = previews.reduce((max, preview) => (
    Math.max(max, Math.abs(finite(preview.sourceTerms?.temperatureDeltaKProxy)))
  ), 0);
  const maxPhaseDriveDeltaProxy = previews.reduce((max, preview) => (
    Math.max(max, finite(preview.sourceTerms?.phaseDriveDeltaProxy))
  ), 0);

  return {
    schema: MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA,
    mode: 'target-state-dry-run-mutator-preview-v0',
    status: previews.length > 0 ? 'preview-blocked' : 'no-targets',
    timeSeconds: rounded(timeSeconds, 3),
    sourceTransactionSchema: transaction?.schema || null,
    sourceTransactionStatus: transaction?.status || 'unknown',
    transactionAllowed: transaction?.allowed === true,
    mutationAttempted: transaction?.mutationAttempted === true,
    mutatorId: transaction?.mutatorId || null,
    dryRun: true,
    applied: false,
    mutationEnabled: false,
    previewTargetCount: previews.length,
    blockedTargetCount: previews.length,
    appliedTargetCount: 0,
    blockerCount: blockers.length,
    blockers,
    sourceTerms: {
      totalHeatRateWProxy: rounded(totalHeatRateWProxy, 9),
      totalSpeciesRateCountPerSProxy: rounded(totalSpeciesRateCountPerSProxy, 6),
      maxAbsTemperatureDeltaKProxy: rounded(maxAbsTemperatureDeltaKProxy, 6),
      maxPhaseDriveDeltaProxy: rounded(maxPhaseDriveDeltaProxy, 9),
      unitStatus: 'dry-run-proxy'
    },
    targets: previews,
    validity: {
      status: 'preview-only',
      confidence: 0.2,
      warnings: [
        'Target mutator preview estimates lower-scale source-term effects but does not mutate solver state.',
        'Validated target mutators and conservation residual checks are required before applied molecular source terms are enabled.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA,
      sourceTransactionSchema: transaction?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetMutatorPreviewReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    sourceTransactionSchema: report.sourceTransactionSchema || null,
    sourceTransactionStatus: report.sourceTransactionStatus || 'unknown',
    transactionAllowed: report.transactionAllowed === true,
    mutationAttempted: report.mutationAttempted === true,
    dryRun: report.dryRun === true,
    applied: report.applied === true,
    mutationEnabled: report.mutationEnabled === true,
    previewTargetCount: Math.max(0, Math.round(finite(report.previewTargetCount, report.targets?.length))),
    blockedTargetCount: Math.max(0, Math.round(finite(report.blockedTargetCount, report.targets?.length))),
    appliedTargetCount: Math.max(0, Math.round(finite(report.appliedTargetCount))),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    totalHeatRateWProxy: finite(report.sourceTerms?.totalHeatRateWProxy),
    totalSpeciesRateCountPerSProxy: finite(report.sourceTerms?.totalSpeciesRateCountPerSProxy),
    maxAbsTemperatureDeltaKProxy: finite(report.sourceTerms?.maxAbsTemperatureDeltaKProxy),
    maxPhaseDriveDeltaProxy: finite(report.sourceTerms?.maxPhaseDriveDeltaProxy),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

const TARGET_MUTATOR_FIELD_SPECS = {
  'reactive-thermal-cell': {
    mutatorId: 'reactive-thermal-source-mutator-v0',
    layer: 'surface',
    stateKeyFallback: 'surface:reactive-thermal:campfire',
    invariants: ['energy-proxy', 'species-proxy', 'provenance'],
    fields: [
      { field: 'temperatureK', unit: 'K', dimensions: 'Theta', sourceTerm: 'temperatureDeltaKProxy', role: 'thermal-state' },
      { field: 'pressurePa', unit: 'Pa-proxy', dimensions: 'M L^-1 T^-2', sourceTerm: 'temperatureDeltaKProxy', role: 'equation-of-state-response' },
      { field: 'molecularClosureHeatFluxProxy', unit: 'W/m^2-proxy', dimensions: 'M T^-3', sourceTerm: 'heatRateWProxy', role: 'energy-source' },
      { field: 'molecularReactionHeatSourceProxy', unit: '1', dimensions: '1', sourceTerm: 'heatRateWProxy', role: 'reaction-source' },
      { field: 'molecularReactionSpeciesRateProxy', unit: 'count/s-proxy', dimensions: 'T^-1', sourceTerm: 'speciesRateCountPerSProxy', role: 'species-source' },
      { field: 'molecularReactionSourceDrive', unit: '1', dimensions: '1', sourceTerm: 'reactionDriveDeltaProxy', role: 'source-drive' }
    ]
  },
  'sph-material': {
    mutatorId: 'sph-material-source-mutator-v0',
    layer: 'mpm',
    stateKeyFallback: 'mpm:sph-material:water-balloon',
    invariants: ['energy-proxy', 'species-proxy', 'phase-proxy', 'provenance'],
    fields: [
      { field: 'averageTemperatureK', unit: 'K', dimensions: 'Theta', sourceTerm: 'temperatureDeltaKProxy', role: 'thermal-state' },
      { field: 'phaseChangeRateProxy', unit: '1', dimensions: '1', sourceTerm: 'phaseDriveDeltaProxy', role: 'phase-source' },
      { field: 'molecularClosureRadiativeHeatFluxBoost', unit: 'W/m^2-proxy', dimensions: 'M T^-3', sourceTerm: 'heatRateWProxy', role: 'energy-source' },
      { field: 'molecularReactionHeatSourceProxy', unit: '1', dimensions: '1', sourceTerm: 'heatRateWProxy', role: 'reaction-source' },
      { field: 'molecularReactionSpeciesRateProxy', unit: 'count/s-proxy', dimensions: 'T^-1', sourceTerm: 'speciesRateCountPerSProxy', role: 'species-source' },
      { field: 'molecularReactionSourceDrive', unit: '1', dimensions: '1', sourceTerm: 'reactionDriveDeltaProxy', role: 'source-drive' }
    ]
  }
};

function createRegistryTarget(previewTarget = {}) {
  const targetSolverId = previewTarget.targetSolverId || 'unknown';
  const spec = TARGET_MUTATOR_FIELD_SPECS[targetSolverId] || null;
  const blockers = Array.isArray(previewTarget.blockers) ? [...previewTarget.blockers] : [];
  for (const blocker of [
    'target-mutator-validation-pending',
    'conservative-accounting-not-validated',
    'source-state-mutation-disabled'
  ]) {
    if (!blockers.includes(blocker)) blockers.push(blocker);
  }
  const fields = Array.isArray(spec?.fields)
    ? spec.fields.map((field) => ({ ...field }))
    : [];
  return {
    targetSolverId,
    mutatorId: spec?.mutatorId || null,
    stateKey: previewTarget.stateKey || spec?.stateKeyFallback || null,
    layer: previewTarget.layer || spec?.layer || 'unknown',
    registered: Boolean(spec),
    validated: false,
    canMutate: false,
    applied: false,
    mutationMode: 'preview-only',
    declaredFieldCount: fields.length,
    fields,
    invariants: {
      required: Array.isArray(spec?.invariants) ? [...spec.invariants] : ['energy-proxy', 'species-proxy', 'provenance'],
      conservativeAccountingValidated: false,
      residualCheck: 'not-run'
    },
    preview: {
      heatRateWProxy: rounded(previewTarget.heatRateWProxy, 9),
      speciesRateCountPerSProxy: rounded(previewTarget.speciesRateCountPerSProxy, 6),
      temperatureDeltaKProxy: rounded(previewTarget.sourceTerms?.temperatureDeltaKProxy, 6),
      phaseDriveDeltaProxy: rounded(previewTarget.sourceTerms?.phaseDriveDeltaProxy, 9),
      reactionDriveDeltaProxy: rounded(previewTarget.sourceTerms?.reactionDriveDeltaProxy, 6)
    },
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularTargetMutatorRegistryReport({
  preview = null,
  timeSeconds = 0
} = {}) {
  const hasPreviewSchema = preview?.schema === MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA;
  const previewTargets = Array.isArray(preview?.targets) ? preview.targets : [];
  const targets = previewTargets.map((target) => createRegistryTarget(target));
  const registeredMutatorCount = targets.filter((target) => target.registered).length;
  const validatedMutatorCount = targets.filter((target) => target.validated).length;
  const appliedTargetCount = targets.filter((target) => target.applied).length;
  const blockers = Array.isArray(preview?.blockers) ? [...preview.blockers] : [];
  if (!hasPreviewSchema) blockers.push('missing-target-preview-report');
  for (const blocker of [
    'target-mutator-validation-pending',
    'conservative-accounting-not-validated',
    'source-state-mutation-disabled',
    'registry-preview-only-non-mutating'
  ]) {
    if (!blockers.includes(blocker)) blockers.push(blocker);
  }
  const declaredFieldCount = targets.reduce((sum, target) => sum + finite(target.declaredFieldCount), 0);
  const invariantScopeCount = new Set(targets.flatMap((target) => target.invariants.required)).size;
  const status = !hasPreviewSchema
    ? 'missing-preview'
    : targets.length === 0
      ? 'no-targets'
      : 'registered-preview-blocked';

  return {
    schema: MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA,
    mode: 'default-off-target-mutator-registry-v0',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    sourcePreviewSchema: preview?.schema || null,
    sourcePreviewStatus: preview?.status || 'unknown',
    dryRun: true,
    mutationEnabled: false,
    canMutate: false,
    applied: false,
    targetCount: targets.length,
    registeredMutatorCount,
    validatedMutatorCount,
    blockedMutatorCount: targets.length - appliedTargetCount,
    appliedTargetCount,
    declaredFieldCount,
    invariantScopeCount,
    blockerCount: blockers.length,
    blockers,
    targets,
    validity: {
      status: 'registry-preview-only',
      confidence: 0.18,
      warnings: [
        'Target mutator registry declares candidate field/invariant surfaces only; it does not mutate solver state.',
        'Conservative source-term mutation requires validated target mutators, closed residual checks, and scientific-mode accounting.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA,
      sourcePreviewSchema: preview?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetMutatorRegistryReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    sourcePreviewSchema: report.sourcePreviewSchema || null,
    sourcePreviewStatus: report.sourcePreviewStatus || 'unknown',
    dryRun: report.dryRun === true,
    mutationEnabled: report.mutationEnabled === true,
    canMutate: report.canMutate === true,
    applied: report.applied === true,
    targetCount: Math.max(0, Math.round(finite(report.targetCount, report.targets?.length))),
    registeredMutatorCount: Math.max(0, Math.round(finite(report.registeredMutatorCount))),
    validatedMutatorCount: Math.max(0, Math.round(finite(report.validatedMutatorCount))),
    blockedMutatorCount: Math.max(0, Math.round(finite(report.blockedMutatorCount))),
    appliedTargetCount: Math.max(0, Math.round(finite(report.appliedTargetCount))),
    declaredFieldCount: Math.max(0, Math.round(finite(report.declaredFieldCount))),
    invariantScopeCount: Math.max(0, Math.round(finite(report.invariantScopeCount))),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

function uniqueStrings(values = []) {
  return [...new Set(values.filter((value) => typeof value === 'string' && value.length > 0))];
}

function createTargetMutationPreflight({
  registryTarget = {},
  previewTarget = null,
  inheritedBlockers = [],
  residualToleranceProxy = 0.02
} = {}) {
  const targetSolverId = registryTarget.targetSolverId || previewTarget?.targetSolverId || 'unknown';
  const declaredFieldCount = Math.max(0, Math.round(finite(registryTarget.declaredFieldCount, registryTarget.fields?.length)));
  const invariantScopeCount = Array.isArray(registryTarget.invariants?.required)
    ? registryTarget.invariants.required.length
    : 0;
  const heatRateWProxy = finite(registryTarget.preview?.heatRateWProxy, previewTarget?.heatRateWProxy);
  const speciesRateCountPerSProxy = Math.max(0, finite(
    registryTarget.preview?.speciesRateCountPerSProxy,
    previewTarget?.speciesRateCountPerSProxy
  ));
  const temperatureDeltaKProxy = Math.abs(finite(
    registryTarget.preview?.temperatureDeltaKProxy,
    previewTarget?.sourceTerms?.temperatureDeltaKProxy
  ));
  const phaseDriveDeltaProxy = Math.abs(finite(
    registryTarget.preview?.phaseDriveDeltaProxy,
    previewTarget?.sourceTerms?.phaseDriveDeltaProxy
  ));
  const reactionDriveDeltaProxy = Math.abs(finite(
    registryTarget.preview?.reactionDriveDeltaProxy,
    previewTarget?.sourceTerms?.reactionDriveDeltaProxy
  ));
  const residualRiskProxy = clamp(
    temperatureDeltaKProxy * 0.02
      + phaseDriveDeltaProxy * 0.6
      + reactionDriveDeltaProxy * 0.08
      + Math.abs(heatRateWProxy) * 0.06
      + speciesRateCountPerSProxy * 0.0005,
    0,
    1
  );
  const tolerance = Math.max(0, finite(residualToleranceProxy, 0.02));
  const residualBudgetPassed = residualRiskProxy <= tolerance;
  const checks = [
    {
      id: 'registry-target',
      passed: registryTarget.registered === true,
      value: registryTarget.registered === true ? 'registered' : 'missing'
    },
    {
      id: 'preview-target-present',
      passed: previewTarget != null,
      value: previewTarget?.targetSolverId || null
    },
    {
      id: 'declared-fields',
      passed: declaredFieldCount > 0,
      value: declaredFieldCount
    },
    {
      id: 'invariant-scopes',
      passed: invariantScopeCount > 0,
      value: invariantScopeCount
    },
    {
      id: 'target-mutator-validated',
      passed: registryTarget.validated === true,
      value: registryTarget.validated === true
    },
    {
      id: 'conservative-accounting',
      passed: registryTarget.invariants?.conservativeAccountingValidated === true,
      value: registryTarget.invariants?.conservativeAccountingValidated === true
    },
    {
      id: 'mutation-dispatch-enabled',
      passed: registryTarget.canMutate === true,
      value: registryTarget.canMutate === true
    },
    {
      id: 'residual-budget',
      passed: residualBudgetPassed,
      value: rounded(residualRiskProxy, 6),
      tolerance: rounded(tolerance, 6)
    },
    {
      id: 'preflight-non-mutating',
      passed: false,
      value: false
    }
  ];
  const failedCheckIds = checks.filter((check) => check.passed !== true).map((check) => check.id);
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    ...(Array.isArray(registryTarget.blockers) ? registryTarget.blockers : []),
    ...failedCheckIds,
    declaredFieldCount > 0 ? null : 'missing-declared-fields',
    invariantScopeCount > 0 ? null : 'missing-invariant-scopes',
    residualBudgetPassed ? null : 'residual-budget-exceeded',
    'target-mutator-validation-pending',
    'conservative-accounting-not-validated',
    'source-state-mutation-disabled',
    'preflight-non-mutating'
  ]);
  const prerequisitePassed = checks
    .filter((check) => check.id !== 'preflight-non-mutating')
    .every((check) => check.passed === true);

  return {
    targetSolverId,
    mutatorId: registryTarget.mutatorId || null,
    stateKey: registryTarget.stateKey || previewTarget?.stateKey || null,
    layer: registryTarget.layer || previewTarget?.layer || 'unknown',
    targetField: previewTarget?.targetField || 'unknown',
    dryRun: true,
    canMutate: false,
    applied: false,
    prerequisitePassed,
    residualBudgetPassed,
    status: prerequisitePassed ? 'preflight-blocked' : 'preflight-failed',
    declaredFieldCount,
    invariantScopeCount,
    checkedFieldCount: declaredFieldCount,
    heatRateWProxy: rounded(heatRateWProxy, 9),
    speciesRateCountPerSProxy: rounded(speciesRateCountPerSProxy, 6),
    residuals: {
      toleranceProxy: rounded(tolerance, 6),
      residualRiskProxy: rounded(residualRiskProxy, 6),
      temperatureDeltaKProxy: rounded(temperatureDeltaKProxy, 6),
      phaseDriveDeltaProxy: rounded(phaseDriveDeltaProxy, 9),
      reactionDriveDeltaProxy: rounded(reactionDriveDeltaProxy, 6)
    },
    checks,
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularTargetMutationPreflightReport({
  registry = null,
  preview = null,
  timeSeconds = 0,
  residualToleranceProxy = 0.02
} = {}) {
  const hasRegistrySchema = registry?.schema === MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA;
  const hasPreviewSchema = preview?.schema === MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA;
  const previewTargets = Array.isArray(preview?.targets) ? preview.targets : [];
  const previewBySolver = new Map(previewTargets.map((target) => [target.targetSolverId || 'unknown', target]));
  const registryTargets = Array.isArray(registry?.targets) ? registry.targets : [];
  const inheritedBlockers = uniqueStrings([
    ...(Array.isArray(preview?.blockers) ? preview.blockers : []),
    ...(Array.isArray(registry?.blockers) ? registry.blockers : [])
  ]);
  const targetReports = registryTargets.map((target) => createTargetMutationPreflight({
    registryTarget: target,
    previewTarget: previewBySolver.get(target.targetSolverId || 'unknown') || null,
    inheritedBlockers,
    residualToleranceProxy
  }));
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    hasRegistrySchema ? null : 'missing-target-mutator-registry',
    hasPreviewSchema ? null : 'missing-target-preview-report',
    targetReports.length > 0 ? null : 'no-targets',
    'registry-preview-only-non-mutating',
    'target-mutator-validation-pending',
    'conservative-accounting-not-validated',
    'source-state-mutation-disabled',
    'preflight-non-mutating'
  ]);
  const passedTargetCount = targetReports.filter((target) => target.prerequisitePassed === true).length;
  const blockedTargetCount = targetReports.length - targetReports.filter((target) => target.canMutate === true && target.applied === true).length;
  const maxResidualRiskProxy = targetReports.reduce((max, target) => (
    Math.max(max, finite(target.residuals?.residualRiskProxy))
  ), 0);
  const maxAbsTemperatureDeltaKProxy = targetReports.reduce((max, target) => (
    Math.max(max, finite(target.residuals?.temperatureDeltaKProxy))
  ), 0);
  const maxPhaseDriveDeltaProxy = targetReports.reduce((max, target) => (
    Math.max(max, finite(target.residuals?.phaseDriveDeltaProxy))
  ), 0);
  const totalHeatRateWProxy = targetReports.reduce((sum, target) => sum + finite(target.heatRateWProxy), 0);
  const totalSpeciesRateCountPerSProxy = targetReports.reduce((sum, target) => sum + finite(target.speciesRateCountPerSProxy), 0);
  const residualTolerance = Math.max(0, finite(residualToleranceProxy, 0.02));
  const residualBudgetPassCount = targetReports.filter((target) => target.residualBudgetPassed === true).length;
  const status = !hasRegistrySchema
    ? 'missing-registry'
    : targetReports.length === 0
      ? 'no-targets'
      : 'preflight-blocked';

  return {
    schema: MOLECULAR_TARGET_MUTATION_PREFLIGHT_SCHEMA,
    mode: 'default-off-target-mutation-preflight-v0',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    sourceRegistrySchema: registry?.schema || null,
    sourceRegistryStatus: registry?.status || 'unknown',
    sourcePreviewSchema: preview?.schema || null,
    sourcePreviewStatus: preview?.status || 'unknown',
    dryRun: true,
    canMutate: false,
    applied: false,
    targetCount: targetReports.length,
    checkedTargetCount: targetReports.length,
    passedTargetCount,
    blockedTargetCount,
    appliedTargetCount: 0,
    registeredMutatorCount: Math.max(0, Math.round(finite(registry?.registeredMutatorCount))),
    validatedMutatorCount: Math.max(0, Math.round(finite(registry?.validatedMutatorCount))),
    declaredFieldCount: Math.max(0, Math.round(finite(registry?.declaredFieldCount))),
    invariantScopeCount: Math.max(0, Math.round(finite(registry?.invariantScopeCount))),
    residualBudgetPassCount,
    residualToleranceProxy: rounded(residualTolerance, 6),
    maxResidualRiskProxy: rounded(maxResidualRiskProxy, 6),
    maxAbsTemperatureDeltaKProxy: rounded(maxAbsTemperatureDeltaKProxy, 6),
    maxPhaseDriveDeltaProxy: rounded(maxPhaseDriveDeltaProxy, 9),
    totalHeatRateWProxy: rounded(totalHeatRateWProxy, 9),
    totalSpeciesRateCountPerSProxy: rounded(totalSpeciesRateCountPerSProxy, 6),
    blockerCount: blockers.length,
    blockers,
    targets: targetReports,
    validity: {
      status: 'preflight-blocked',
      confidence: 0.18,
      warnings: [
        'Mutation preflight verifies registry, preview, residual, and invariant readiness without mutating solver state.',
        'Target mutation remains blocked until validated mutators, conservative accounting, and explicit source-state mutation are enabled.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_MUTATION_PREFLIGHT_SCHEMA,
      sourceRegistrySchema: registry?.schema || null,
      sourcePreviewSchema: preview?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetMutationPreflightReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_MUTATION_PREFLIGHT_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    sourceRegistrySchema: report.sourceRegistrySchema || null,
    sourcePreviewSchema: report.sourcePreviewSchema || null,
    dryRun: report.dryRun === true,
    canMutate: report.canMutate === true,
    applied: report.applied === true,
    targetCount: Math.max(0, Math.round(finite(report.targetCount, report.targets?.length))),
    checkedTargetCount: Math.max(0, Math.round(finite(report.checkedTargetCount, report.targets?.length))),
    passedTargetCount: Math.max(0, Math.round(finite(report.passedTargetCount))),
    blockedTargetCount: Math.max(0, Math.round(finite(report.blockedTargetCount))),
    appliedTargetCount: Math.max(0, Math.round(finite(report.appliedTargetCount))),
    registeredMutatorCount: Math.max(0, Math.round(finite(report.registeredMutatorCount))),
    validatedMutatorCount: Math.max(0, Math.round(finite(report.validatedMutatorCount))),
    declaredFieldCount: Math.max(0, Math.round(finite(report.declaredFieldCount))),
    invariantScopeCount: Math.max(0, Math.round(finite(report.invariantScopeCount))),
    residualBudgetPassCount: Math.max(0, Math.round(finite(report.residualBudgetPassCount))),
    residualToleranceProxy: finite(report.residualToleranceProxy),
    maxResidualRiskProxy: finite(report.maxResidualRiskProxy),
    maxAbsTemperatureDeltaKProxy: finite(report.maxAbsTemperatureDeltaKProxy),
    maxPhaseDriveDeltaProxy: finite(report.maxPhaseDriveDeltaProxy),
    totalHeatRateWProxy: finite(report.totalHeatRateWProxy),
    totalSpeciesRateCountPerSProxy: finite(report.totalSpeciesRateCountPerSProxy),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

function getPreviewSourceTerm(previewTarget = {}, sourceTerm = null) {
  if (sourceTerm === 'heatRateWProxy') return finite(previewTarget.heatRateWProxy);
  if (sourceTerm === 'speciesRateCountPerSProxy') return finite(previewTarget.speciesRateCountPerSProxy);
  return finite(previewTarget.sourceTerms?.[sourceTerm]);
}

function createFieldMutationOperation({
  registryTarget = {},
  previewTarget = {},
  preflightTarget = {},
  fieldSpec = {},
  inheritedBlockers = []
} = {}) {
  const field = fieldSpec.field || 'unknown';
  const beforeValue = previewTarget.before?.[field];
  const afterValue = previewTarget.after?.[field];
  const beforeFinite = Number.isFinite(Number(beforeValue));
  const afterFinite = Number.isFinite(Number(afterValue));
  const deltaValue = beforeFinite && afterFinite
    ? finite(afterValue) - finite(beforeValue)
    : getPreviewSourceTerm(previewTarget, fieldSpec.sourceTerm);
  const sourceValue = getPreviewSourceTerm(previewTarget, fieldSpec.sourceTerm);
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    ...(Array.isArray(preflightTarget.blockers) ? preflightTarget.blockers : []),
    'preflight-blocked',
    'operation-plan-non-mutating'
  ]);
  return {
    targetSolverId: registryTarget.targetSolverId || previewTarget.targetSolverId || 'unknown',
    mutatorId: registryTarget.mutatorId || null,
    stateKey: registryTarget.stateKey || previewTarget.stateKey || null,
    layer: registryTarget.layer || previewTarget.layer || 'unknown',
    field,
    role: fieldSpec.role || 'unknown',
    sourceTerm: fieldSpec.sourceTerm || null,
    unit: fieldSpec.unit || 'unknown',
    dimensions: fieldSpec.dimensions || 'unknown',
    beforeValue: beforeFinite ? rounded(beforeValue, 9) : null,
    afterValue: afterFinite ? rounded(afterValue, 9) : null,
    deltaValue: rounded(deltaValue, 9),
    sourceValue: rounded(sourceValue, 9),
    allowedByRegistry: registryTarget.registered === true && field !== 'unknown',
    preflightPassed: preflightTarget.prerequisitePassed === true,
    dryRun: true,
    canApply: false,
    applied: false,
    status: 'operation-blocked',
    blockerCount: blockers.length,
    blockers
  };
}

function createTargetMutationOperationPlan({
  registryTarget = {},
  previewTarget = {},
  preflightTarget = {},
  inheritedBlockers = []
} = {}) {
  const fields = Array.isArray(registryTarget.fields) ? registryTarget.fields : [];
  const operations = fields.map((fieldSpec) => createFieldMutationOperation({
    registryTarget,
    previewTarget,
    preflightTarget,
    fieldSpec,
    inheritedBlockers
  }));
  const maxAbsFieldDeltaProxy = operations.reduce((max, operation) => (
    Math.max(max, Math.abs(finite(operation.deltaValue)))
  ), 0);
  const totalAbsFieldDeltaProxy = operations.reduce((sum, operation) => (
    sum + Math.abs(finite(operation.deltaValue))
  ), 0);
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    ...(Array.isArray(preflightTarget.blockers) ? preflightTarget.blockers : []),
    'preflight-blocked',
    'operation-plan-non-mutating'
  ]);
  return {
    targetSolverId: registryTarget.targetSolverId || previewTarget.targetSolverId || 'unknown',
    mutatorId: registryTarget.mutatorId || null,
    stateKey: registryTarget.stateKey || previewTarget.stateKey || null,
    layer: registryTarget.layer || previewTarget.layer || 'unknown',
    dryRun: true,
    canApply: false,
    applied: false,
    status: operations.length > 0 ? 'operation-plan-blocked' : 'no-operations',
    operationCount: operations.length,
    allowedByRegistryOperationCount: operations.filter((operation) => operation.allowedByRegistry).length,
    blockedOperationCount: operations.length,
    appliedOperationCount: 0,
    maxAbsFieldDeltaProxy: rounded(maxAbsFieldDeltaProxy, 9),
    totalAbsFieldDeltaProxy: rounded(totalAbsFieldDeltaProxy, 9),
    before: previewTarget.before ? { ...previewTarget.before } : {},
    after: previewTarget.after ? { ...previewTarget.after } : {},
    operations,
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularTargetMutationOperationPlanReport({
  preflight = null,
  registry = null,
  preview = null,
  timeSeconds = 0
} = {}) {
  const hasPreflightSchema = preflight?.schema === MOLECULAR_TARGET_MUTATION_PREFLIGHT_SCHEMA;
  const hasRegistrySchema = registry?.schema === MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA;
  const hasPreviewSchema = preview?.schema === MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA;
  const registryTargets = Array.isArray(registry?.targets) ? registry.targets : [];
  const previewBySolver = new Map((Array.isArray(preview?.targets) ? preview.targets : [])
    .map((target) => [target.targetSolverId || 'unknown', target]));
  const preflightBySolver = new Map((Array.isArray(preflight?.targets) ? preflight.targets : [])
    .map((target) => [target.targetSolverId || 'unknown', target]));
  const inheritedBlockers = uniqueStrings([
    ...(Array.isArray(preflight?.blockers) ? preflight.blockers : []),
    ...(Array.isArray(registry?.blockers) ? registry.blockers : []),
    ...(Array.isArray(preview?.blockers) ? preview.blockers : [])
  ]);
  const targets = registryTargets.map((target) => createTargetMutationOperationPlan({
    registryTarget: target,
    previewTarget: previewBySolver.get(target.targetSolverId || 'unknown') || {},
    preflightTarget: preflightBySolver.get(target.targetSolverId || 'unknown') || {},
    inheritedBlockers
  }));
  const operationCount = targets.reduce((sum, target) => sum + finite(target.operationCount), 0);
  const allowedByRegistryOperationCount = targets.reduce((sum, target) => sum + finite(target.allowedByRegistryOperationCount), 0);
  const blockedOperationCount = targets.reduce((sum, target) => sum + finite(target.blockedOperationCount), 0);
  const maxAbsFieldDeltaProxy = targets.reduce((max, target) => (
    Math.max(max, finite(target.maxAbsFieldDeltaProxy))
  ), 0);
  const totalAbsFieldDeltaProxy = targets.reduce((sum, target) => sum + finite(target.totalAbsFieldDeltaProxy), 0);
  const maxAbsTemperatureDeltaKProxy = targets.reduce((max, target) => {
    const temperatureOps = target.operations.filter((operation) => operation.dimensions === 'Theta');
    return Math.max(max, ...temperatureOps.map((operation) => Math.abs(finite(operation.deltaValue))), 0);
  }, 0);
  const totalAbsHeatRateWProxy = targets.reduce((sum, target) => (
    sum + target.operations
      .filter((operation) => operation.sourceTerm === 'heatRateWProxy')
      .reduce((inner, operation) => inner + Math.abs(finite(operation.sourceValue)), 0)
  ), 0);
  const totalSpeciesRateCountPerSProxy = targets.reduce((sum, target) => (
    sum + target.operations
      .filter((operation) => operation.sourceTerm === 'speciesRateCountPerSProxy')
      .reduce((inner, operation) => inner + Math.max(0, finite(operation.sourceValue)), 0)
  ), 0);
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    hasPreflightSchema ? null : 'missing-target-mutation-preflight',
    hasRegistrySchema ? null : 'missing-target-mutator-registry',
    hasPreviewSchema ? null : 'missing-target-preview-report',
    operationCount > 0 ? null : 'no-operations',
    'preflight-blocked',
    'operation-plan-non-mutating'
  ]);
  const status = !hasPreflightSchema
    ? 'missing-preflight'
    : operationCount === 0
      ? 'no-operations'
      : 'operation-plan-blocked';

  return {
    schema: MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA,
    mode: 'field-level-target-mutation-operation-plan-v0',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    sourcePreflightSchema: preflight?.schema || null,
    sourcePreflightStatus: preflight?.status || 'unknown',
    sourceRegistrySchema: registry?.schema || null,
    sourcePreviewSchema: preview?.schema || null,
    dryRun: true,
    canApply: false,
    applied: false,
    targetCount: targets.length,
    operationCount,
    allowedByRegistryOperationCount,
    blockedOperationCount,
    appliedOperationCount: 0,
    maxAbsFieldDeltaProxy: rounded(maxAbsFieldDeltaProxy, 9),
    totalAbsFieldDeltaProxy: rounded(totalAbsFieldDeltaProxy, 9),
    maxAbsTemperatureDeltaKProxy: rounded(maxAbsTemperatureDeltaKProxy, 6),
    totalAbsHeatRateWProxy: rounded(totalAbsHeatRateWProxy, 9),
    totalSpeciesRateCountPerSProxy: rounded(totalSpeciesRateCountPerSProxy, 6),
    blockerCount: blockers.length,
    blockers,
    targets,
    validity: {
      status: 'operation-plan-blocked',
      confidence: 0.18,
      warnings: [
        'Mutation operation plan records field-level before/after/delta telemetry only; it does not mutate solver state.',
        'Applied source-state mutation still requires a validated conservative mutator and invariant residual enforcement.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA,
      sourcePreflightSchema: preflight?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetMutationOperationPlanReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    sourcePreflightSchema: report.sourcePreflightSchema || null,
    sourceRegistrySchema: report.sourceRegistrySchema || null,
    sourcePreviewSchema: report.sourcePreviewSchema || null,
    dryRun: report.dryRun === true,
    canApply: report.canApply === true,
    applied: report.applied === true,
    targetCount: Math.max(0, Math.round(finite(report.targetCount, report.targets?.length))),
    operationCount: Math.max(0, Math.round(finite(report.operationCount))),
    allowedByRegistryOperationCount: Math.max(0, Math.round(finite(report.allowedByRegistryOperationCount))),
    blockedOperationCount: Math.max(0, Math.round(finite(report.blockedOperationCount))),
    appliedOperationCount: Math.max(0, Math.round(finite(report.appliedOperationCount))),
    maxAbsFieldDeltaProxy: finite(report.maxAbsFieldDeltaProxy),
    totalAbsFieldDeltaProxy: finite(report.totalAbsFieldDeltaProxy),
    maxAbsTemperatureDeltaKProxy: finite(report.maxAbsTemperatureDeltaKProxy),
    totalAbsHeatRateWProxy: finite(report.totalAbsHeatRateWProxy),
    totalSpeciesRateCountPerSProxy: finite(report.totalSpeciesRateCountPerSProxy),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

function operationCoversInvariant(operation = {}, scope = '') {
  const sourceTerm = operation.sourceTerm || '';
  const role = operation.role || '';
  const field = operation.field || '';
  if (scope === 'energy-proxy') {
    return sourceTerm === 'heatRateWProxy'
      || sourceTerm === 'temperatureDeltaKProxy'
      || role.includes('thermal')
      || role.includes('energy')
      || operation.dimensions === 'Theta';
  }
  if (scope === 'species-proxy') {
    return sourceTerm === 'speciesRateCountPerSProxy'
      || role.includes('species')
      || field.includes('Species');
  }
  if (scope === 'phase-proxy') {
    return sourceTerm === 'phaseDriveDeltaProxy'
      || role.includes('phase')
      || field.includes('phase');
  }
  if (scope === 'provenance') {
    return Boolean(
      operation.targetSolverId
        && operation.mutatorId
        && operation.stateKey
        && operation.field
        && operation.sourceTerm
        && operation.unit
        && operation.unit !== 'unknown'
        && operation.dimensions
        && operation.dimensions !== 'unknown'
    );
  }
  return false;
}

function createTargetInvariantCheck({
  operationTarget = {},
  registryTarget = {},
  preflightTarget = {},
  inheritedBlockers = [],
  residualToleranceProxy = 0.02
} = {}) {
  const operations = Array.isArray(operationTarget.operations) ? operationTarget.operations : [];
  const requiredScopes = uniqueStrings(
    Array.isArray(registryTarget.invariants?.required)
      ? registryTarget.invariants.required
      : ['energy-proxy', 'species-proxy', 'provenance']
  );
  const scopeChecks = requiredScopes.map((scope) => {
    const matchingOperationCount = operations.filter((operation) => operationCoversInvariant(operation, scope)).length;
    return {
      scope,
      passed: matchingOperationCount > 0,
      matchingOperationCount,
      status: matchingOperationCount > 0 ? 'covered' : 'missing-operation-coverage'
    };
  });
  const missingScopes = scopeChecks.filter((check) => check.passed !== true).map((check) => check.scope);
  const heatOperationCount = operations.filter((operation) => operation.sourceTerm === 'heatRateWProxy').length;
  const speciesOperationCount = operations.filter((operation) => operation.sourceTerm === 'speciesRateCountPerSProxy').length;
  const phaseOperationCount = operations.filter((operation) => operation.sourceTerm === 'phaseDriveDeltaProxy').length;
  const provenanceOperationCount = operations.filter((operation) => operationCoversInvariant(operation, 'provenance')).length;
  const totalHeatRateWProxy = operations
    .filter((operation) => operation.sourceTerm === 'heatRateWProxy')
    .reduce((sum, operation) => sum + Math.abs(finite(operation.sourceValue)), 0);
  const totalSpeciesRateCountPerSProxy = operations
    .filter((operation) => operation.sourceTerm === 'speciesRateCountPerSProxy')
    .reduce((sum, operation) => sum + Math.max(0, finite(operation.sourceValue)), 0);
  const maxPhaseDriveDeltaProxy = operations
    .filter((operation) => operation.sourceTerm === 'phaseDriveDeltaProxy')
    .reduce((max, operation) => Math.max(max, Math.abs(finite(operation.deltaValue, operation.sourceValue))), 0);
  const maxTemperatureDeltaKProxy = operations
    .filter((operation) => operation.dimensions === 'Theta')
    .reduce((max, operation) => Math.max(max, Math.abs(finite(operation.deltaValue))), 0);
  const tolerance = Math.max(0, finite(residualToleranceProxy, 0.02));
  const energyResidualProxy = scopeChecks.some((check) => check.scope === 'energy-proxy' && check.passed)
    ? clamp(totalHeatRateWProxy * 0.25 + maxTemperatureDeltaKProxy * 0.0006, 0, 1)
    : requiredScopes.includes('energy-proxy') ? 1 : 0;
  const speciesResidualProxy = scopeChecks.some((check) => check.scope === 'species-proxy' && check.passed)
    ? clamp(totalSpeciesRateCountPerSProxy * 0.0005, 0, 1)
    : requiredScopes.includes('species-proxy') ? 1 : 0;
  const phaseResidualProxy = scopeChecks.some((check) => check.scope === 'phase-proxy' && check.passed)
    ? clamp(maxPhaseDriveDeltaProxy * 0.2, 0, 1)
    : requiredScopes.includes('phase-proxy') ? 1 : 0;
  const provenanceResidualProxy = scopeChecks.some((check) => check.scope === 'provenance' && check.passed)
    ? 0
    : requiredScopes.includes('provenance') ? 1 : 0;
  const maxResidualProxy = Math.max(
    energyResidualProxy,
    speciesResidualProxy,
    phaseResidualProxy,
    provenanceResidualProxy
  );
  const invariantCoveragePassed = missingScopes.length === 0;
  const residualBudgetPassed = maxResidualProxy <= tolerance;
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    ...(Array.isArray(operationTarget.blockers) ? operationTarget.blockers : []),
    ...(Array.isArray(preflightTarget.blockers) ? preflightTarget.blockers : []),
    invariantCoveragePassed ? null : 'missing-invariant-coverage',
    residualBudgetPassed ? null : 'invariant-residual-budget-exceeded',
    'operation-plan-blocked',
    'invariant-check-non-mutating'
  ]);

  return {
    targetSolverId: operationTarget.targetSolverId || registryTarget.targetSolverId || preflightTarget.targetSolverId || 'unknown',
    mutatorId: operationTarget.mutatorId || registryTarget.mutatorId || null,
    stateKey: operationTarget.stateKey || registryTarget.stateKey || preflightTarget.stateKey || null,
    layer: operationTarget.layer || registryTarget.layer || preflightTarget.layer || 'unknown',
    dryRun: true,
    canApply: false,
    applied: false,
    status: invariantCoveragePassed && residualBudgetPassed ? 'invariant-check-blocked' : 'invariant-check-failed',
    operationCount: operations.length,
    requiredInvariantScopeCount: requiredScopes.length,
    coveredInvariantScopeCount: scopeChecks.filter((check) => check.passed).length,
    missingInvariantScopeCount: missingScopes.length,
    missingInvariantScopes: missingScopes,
    invariantCoveragePassed,
    residualBudgetPassed,
    residualToleranceProxy: rounded(tolerance, 6),
    residuals: {
      maxResidualProxy: rounded(maxResidualProxy, 6),
      energyResidualProxy: rounded(energyResidualProxy, 6),
      speciesResidualProxy: rounded(speciesResidualProxy, 6),
      phaseResidualProxy: rounded(phaseResidualProxy, 6),
      provenanceResidualProxy: rounded(provenanceResidualProxy, 6)
    },
    sourceTerms: {
      heatOperationCount,
      speciesOperationCount,
      phaseOperationCount,
      provenanceOperationCount,
      totalHeatRateWProxy: rounded(totalHeatRateWProxy, 9),
      totalSpeciesRateCountPerSProxy: rounded(totalSpeciesRateCountPerSProxy, 6),
      maxPhaseDriveDeltaProxy: rounded(maxPhaseDriveDeltaProxy, 9),
      maxTemperatureDeltaKProxy: rounded(maxTemperatureDeltaKProxy, 6)
    },
    scopeChecks,
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularTargetMutationInvariantCheckReport({
  operationPlan = null,
  preflight = null,
  registry = null,
  timeSeconds = 0,
  residualToleranceProxy = 0.02
} = {}) {
  const hasOperationPlanSchema = operationPlan?.schema === MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA;
  const hasRegistrySchema = registry?.schema === MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA;
  const hasPreflightSchema = preflight?.schema === MOLECULAR_TARGET_MUTATION_PREFLIGHT_SCHEMA;
  const registryBySolver = new Map((Array.isArray(registry?.targets) ? registry.targets : [])
    .map((target) => [target.targetSolverId || 'unknown', target]));
  const preflightBySolver = new Map((Array.isArray(preflight?.targets) ? preflight.targets : [])
    .map((target) => [target.targetSolverId || 'unknown', target]));
  const inheritedBlockers = uniqueStrings([
    ...(Array.isArray(operationPlan?.blockers) ? operationPlan.blockers : []),
    ...(Array.isArray(preflight?.blockers) ? preflight.blockers : []),
    ...(Array.isArray(registry?.blockers) ? registry.blockers : [])
  ]);
  const targets = (Array.isArray(operationPlan?.targets) ? operationPlan.targets : []).map((target) => {
    const solverId = target.targetSolverId || 'unknown';
    return createTargetInvariantCheck({
      operationTarget: target,
      registryTarget: registryBySolver.get(solverId) || {},
      preflightTarget: preflightBySolver.get(solverId) || {},
      inheritedBlockers,
      residualToleranceProxy
    });
  });
  const targetCount = targets.length;
  const operationCount = targets.reduce((sum, target) => sum + finite(target.operationCount), 0);
  const passedTargetCount = targets.filter((target) => target.invariantCoveragePassed && target.residualBudgetPassed).length;
  const blockedTargetCount = targetCount;
  const requiredInvariantScopeCount = targets.reduce((sum, target) => sum + finite(target.requiredInvariantScopeCount), 0);
  const coveredInvariantScopeCount = targets.reduce((sum, target) => sum + finite(target.coveredInvariantScopeCount), 0);
  const missingInvariantScopeCount = targets.reduce((sum, target) => sum + finite(target.missingInvariantScopeCount), 0);
  const residualBudgetPassCount = targets.filter((target) => target.residualBudgetPassed).length;
  const maxResidualProxy = targets.reduce((max, target) => Math.max(max, finite(target.residuals?.maxResidualProxy)), 0);
  const maxEnergyResidualProxy = targets.reduce((max, target) => Math.max(max, finite(target.residuals?.energyResidualProxy)), 0);
  const maxSpeciesResidualProxy = targets.reduce((max, target) => Math.max(max, finite(target.residuals?.speciesResidualProxy)), 0);
  const maxPhaseResidualProxy = targets.reduce((max, target) => Math.max(max, finite(target.residuals?.phaseResidualProxy)), 0);
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    hasOperationPlanSchema ? null : 'missing-target-mutation-operation-plan',
    hasRegistrySchema ? null : 'missing-target-mutator-registry',
    hasPreflightSchema ? null : 'missing-target-mutation-preflight',
    targetCount > 0 ? null : 'no-targets',
    missingInvariantScopeCount === 0 ? null : 'missing-invariant-coverage',
    residualBudgetPassCount === targetCount ? null : 'invariant-residual-budget-exceeded',
    operationPlan?.canApply === true ? null : 'operation-plan-blocked',
    'invariant-check-non-mutating'
  ]);
  const status = !hasOperationPlanSchema
    ? 'missing-operation-plan'
    : targetCount === 0
      ? 'no-targets'
      : missingInvariantScopeCount > 0
        ? 'invariant-check-failed'
        : 'invariant-check-blocked';

  return {
    schema: MOLECULAR_TARGET_MUTATION_INVARIANT_CHECK_SCHEMA,
    mode: 'operation-plan-invariant-check-v0',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    sourceOperationPlanSchema: operationPlan?.schema || null,
    sourceOperationPlanStatus: operationPlan?.status || 'unknown',
    sourcePreflightSchema: preflight?.schema || null,
    sourceRegistrySchema: registry?.schema || null,
    dryRun: true,
    canApply: false,
    applied: false,
    targetCount,
    checkedTargetCount: targetCount,
    passedTargetCount,
    blockedTargetCount,
    appliedTargetCount: 0,
    operationCount,
    requiredInvariantScopeCount,
    coveredInvariantScopeCount,
    missingInvariantScopeCount,
    residualBudgetPassCount,
    residualToleranceProxy: rounded(Math.max(0, finite(residualToleranceProxy, 0.02)), 6),
    maxResidualProxy: rounded(maxResidualProxy, 6),
    maxEnergyResidualProxy: rounded(maxEnergyResidualProxy, 6),
    maxSpeciesResidualProxy: rounded(maxSpeciesResidualProxy, 6),
    maxPhaseResidualProxy: rounded(maxPhaseResidualProxy, 6),
    blockerCount: blockers.length,
    blockers,
    targets,
    validity: {
      status: 'invariant-check-blocked',
      confidence: 0.18,
      warnings: [
        'Invariant check validates planned operation coverage and proxy residuals only; it does not mutate solver state.',
        'Applied mutation still requires conservative accounting, exact invariant enforcement, and validated target mutators.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_MUTATION_INVARIANT_CHECK_SCHEMA,
      sourceOperationPlanSchema: operationPlan?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetMutationInvariantCheckReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_MUTATION_INVARIANT_CHECK_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    sourceOperationPlanSchema: report.sourceOperationPlanSchema || null,
    sourcePreflightSchema: report.sourcePreflightSchema || null,
    sourceRegistrySchema: report.sourceRegistrySchema || null,
    dryRun: report.dryRun === true,
    canApply: report.canApply === true,
    applied: report.applied === true,
    targetCount: Math.max(0, Math.round(finite(report.targetCount, report.targets?.length))),
    checkedTargetCount: Math.max(0, Math.round(finite(report.checkedTargetCount, report.targets?.length))),
    passedTargetCount: Math.max(0, Math.round(finite(report.passedTargetCount))),
    blockedTargetCount: Math.max(0, Math.round(finite(report.blockedTargetCount))),
    appliedTargetCount: Math.max(0, Math.round(finite(report.appliedTargetCount))),
    operationCount: Math.max(0, Math.round(finite(report.operationCount))),
    requiredInvariantScopeCount: Math.max(0, Math.round(finite(report.requiredInvariantScopeCount))),
    coveredInvariantScopeCount: Math.max(0, Math.round(finite(report.coveredInvariantScopeCount))),
    missingInvariantScopeCount: Math.max(0, Math.round(finite(report.missingInvariantScopeCount))),
    residualBudgetPassCount: Math.max(0, Math.round(finite(report.residualBudgetPassCount))),
    residualToleranceProxy: finite(report.residualToleranceProxy),
    maxResidualProxy: finite(report.maxResidualProxy),
    maxEnergyResidualProxy: finite(report.maxEnergyResidualProxy),
    maxSpeciesResidualProxy: finite(report.maxSpeciesResidualProxy),
    maxPhaseResidualProxy: finite(report.maxPhaseResidualProxy),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

function createTargetMutationCommitDecision({
  invariantTarget = {},
  operationTarget = {},
  inheritedBlockers = []
} = {}) {
  const operationCount = Math.max(0, Math.round(finite(
    operationTarget.operationCount,
    Array.isArray(operationTarget.operations) ? operationTarget.operations.length : 0
  )));
  const invariantCoveragePassed = invariantTarget.invariantCoveragePassed === true
    || (finite(invariantTarget.missingInvariantScopeCount) === 0 && finite(invariantTarget.coveredInvariantScopeCount) > 0);
  const residualBudgetPassed = invariantTarget.residualBudgetPassed === true;
  const invariantEligible = invariantCoveragePassed && residualBudgetPassed;
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    ...(Array.isArray(invariantTarget.blockers) ? invariantTarget.blockers : []),
    ...(Array.isArray(operationTarget.blockers) ? operationTarget.blockers : []),
    invariantEligible ? null : 'target-invariant-check-failed',
    operationTarget.canApply === true ? null : 'operation-plan-blocked',
    'commit-dispatch-not-enabled',
    'target-mutator-apply-not-implemented'
  ]);
  return {
    targetSolverId: invariantTarget.targetSolverId || operationTarget.targetSolverId || 'unknown',
    mutatorId: invariantTarget.mutatorId || operationTarget.mutatorId || null,
    stateKey: invariantTarget.stateKey || operationTarget.stateKey || null,
    layer: invariantTarget.layer || operationTarget.layer || 'unknown',
    dryRun: true,
    canCommit: false,
    committed: false,
    status: invariantEligible ? 'commit-blocked' : 'commit-ineligible',
    invariantCoveragePassed,
    residualBudgetPassed,
    invariantEligible,
    operationCount,
    committableOperationCount: 0,
    committedOperationCount: 0,
    maxResidualProxy: rounded(invariantTarget.residuals?.maxResidualProxy ?? invariantTarget.maxResidualProxy, 6),
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularTargetMutationCommitReport({
  invariantCheck = null,
  operationPlan = null,
  timeSeconds = 0
} = {}) {
  const hasInvariantCheckSchema = invariantCheck?.schema === MOLECULAR_TARGET_MUTATION_INVARIANT_CHECK_SCHEMA;
  const hasOperationPlanSchema = operationPlan?.schema === MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA;
  const operationBySolver = new Map((Array.isArray(operationPlan?.targets) ? operationPlan.targets : [])
    .map((target) => [target.targetSolverId || 'unknown', target]));
  const inheritedBlockers = uniqueStrings([
    ...(Array.isArray(invariantCheck?.blockers) ? invariantCheck.blockers : []),
    ...(Array.isArray(operationPlan?.blockers) ? operationPlan.blockers : [])
  ]);
  const targets = (Array.isArray(invariantCheck?.targets) ? invariantCheck.targets : []).map((target) => {
    const solverId = target.targetSolverId || 'unknown';
    return createTargetMutationCommitDecision({
      invariantTarget: target,
      operationTarget: operationBySolver.get(solverId) || {},
      inheritedBlockers
    });
  });
  const targetCount = targets.length;
  const invariantEligibleTargetCount = targets.filter((target) => target.invariantEligible).length;
  const committableTargetCount = targets.filter((target) => target.canCommit).length;
  const blockedTargetCount = targetCount - committableTargetCount;
  const plannedOperationCount = Math.max(
    Math.round(finite(operationPlan?.operationCount)),
    targets.reduce((sum, target) => sum + finite(target.operationCount), 0)
  );
  const committableOperationCount = targets.reduce((sum, target) => sum + finite(target.committableOperationCount), 0);
  const committedOperationCount = targets.reduce((sum, target) => sum + finite(target.committedOperationCount), 0);
  const maxResidualProxy = targets.reduce((max, target) => Math.max(max, finite(target.maxResidualProxy)), 0);
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    hasInvariantCheckSchema ? null : 'missing-target-mutation-invariant-check',
    hasOperationPlanSchema ? null : 'missing-target-mutation-operation-plan',
    targetCount > 0 ? null : 'no-targets',
    invariantEligibleTargetCount === targetCount && targetCount > 0 ? null : 'target-invariant-check-failed',
    invariantCheck?.canApply === true ? null : 'invariant-check-non-mutating',
    operationPlan?.canApply === true ? null : 'operation-plan-blocked',
    'commit-dispatch-not-enabled',
    'target-mutator-apply-not-implemented'
  ]);
  const status = !hasInvariantCheckSchema
    ? 'missing-invariant-check'
    : targetCount === 0
      ? 'no-targets'
      : invariantEligibleTargetCount !== targetCount
        ? 'commit-ineligible'
        : 'commit-blocked';

  return {
    schema: MOLECULAR_TARGET_MUTATION_COMMIT_SCHEMA,
    mode: 'invariant-gated-target-mutation-commit-v0',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    sourceInvariantCheckSchema: invariantCheck?.schema || null,
    sourceInvariantCheckStatus: invariantCheck?.status || 'unknown',
    sourceOperationPlanSchema: operationPlan?.schema || null,
    sourceOperationPlanStatus: operationPlan?.status || 'unknown',
    dryRun: true,
    canCommit: false,
    committed: false,
    targetCount,
    invariantEligibleTargetCount,
    committableTargetCount,
    blockedTargetCount,
    committedTargetCount: 0,
    plannedOperationCount,
    committableOperationCount,
    blockedOperationCount: Math.max(0, plannedOperationCount - committableOperationCount),
    committedOperationCount,
    maxResidualProxy: rounded(maxResidualProxy, 6),
    blockerCount: blockers.length,
    blockers,
    targets,
    validity: {
      status: 'commit-blocked',
      confidence: 0.17,
      warnings: [
        'Commit report is an audited decision boundary only; it does not mutate solver state.',
        'Real target mutation still requires commit dispatch, validated mutators, and exact conservative invariant enforcement.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_MUTATION_COMMIT_SCHEMA,
      sourceInvariantCheckSchema: invariantCheck?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetMutationCommitReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_MUTATION_COMMIT_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    sourceInvariantCheckSchema: report.sourceInvariantCheckSchema || null,
    sourceOperationPlanSchema: report.sourceOperationPlanSchema || null,
    dryRun: report.dryRun === true,
    canCommit: report.canCommit === true,
    committed: report.committed === true,
    targetCount: Math.max(0, Math.round(finite(report.targetCount, report.targets?.length))),
    invariantEligibleTargetCount: Math.max(0, Math.round(finite(report.invariantEligibleTargetCount))),
    committableTargetCount: Math.max(0, Math.round(finite(report.committableTargetCount))),
    blockedTargetCount: Math.max(0, Math.round(finite(report.blockedTargetCount))),
    committedTargetCount: Math.max(0, Math.round(finite(report.committedTargetCount))),
    plannedOperationCount: Math.max(0, Math.round(finite(report.plannedOperationCount))),
    committableOperationCount: Math.max(0, Math.round(finite(report.committableOperationCount))),
    blockedOperationCount: Math.max(0, Math.round(finite(report.blockedOperationCount))),
    committedOperationCount: Math.max(0, Math.round(finite(report.committedOperationCount))),
    maxResidualProxy: finite(report.maxResidualProxy),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

function createTargetMutationDispatchOperation({
  operation = {},
  commitTarget = {},
  inheritedBlockers = [],
  dispatchEnabled = false,
  mutatorApplyImplemented = false
} = {}) {
  const invariantEligible = commitTarget.invariantEligible === true;
  const commitReady = commitTarget.canCommit === true;
  const operationReady = operation.canApply === true && operation.allowedByRegistry === true;
  const canDispatch = dispatchEnabled === true
    && mutatorApplyImplemented === true
    && invariantEligible
    && commitReady
    && operationReady;
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    ...(Array.isArray(commitTarget.blockers) ? commitTarget.blockers : []),
    ...(Array.isArray(operation.blockers) ? operation.blockers : []),
    invariantEligible ? null : 'target-invariant-check-failed',
    commitReady ? null : 'commit-not-ready',
    operationReady ? null : 'operation-not-apply-ready',
    dispatchEnabled ? null : 'dispatch-disabled',
    mutatorApplyImplemented ? null : 'target-mutator-apply-not-implemented'
  ]);

  return {
    targetSolverId: operation.targetSolverId || commitTarget.targetSolverId || 'unknown',
    mutatorId: operation.mutatorId || commitTarget.mutatorId || null,
    stateKey: operation.stateKey || commitTarget.stateKey || null,
    layer: operation.layer || commitTarget.layer || 'unknown',
    field: operation.field || 'unknown',
    role: operation.role || 'unknown',
    sourceTerm: operation.sourceTerm || null,
    unit: operation.unit || 'unknown',
    dimensions: operation.dimensions || 'unknown',
    beforeValue: Number.isFinite(Number(operation.beforeValue)) ? rounded(operation.beforeValue, 9) : null,
    afterValue: Number.isFinite(Number(operation.afterValue)) ? rounded(operation.afterValue, 9) : null,
    deltaValue: rounded(operation.deltaValue, 9),
    sourceValue: rounded(operation.sourceValue, 9),
    allowedByRegistry: operation.allowedByRegistry === true,
    invariantEligible,
    dryRun: true,
    canDispatch,
    queued: false,
    dispatched: false,
    status: canDispatch ? 'dispatch-ready' : 'dispatch-blocked',
    blockerCount: blockers.length,
    blockers
  };
}

function createTargetMutationDispatchBatch({
  commitTarget = {},
  operationTarget = {},
  inheritedBlockers = [],
  dispatchEnabled = false,
  mutatorApplyImplemented = false
} = {}) {
  const operations = (Array.isArray(operationTarget.operations) ? operationTarget.operations : []).map((operation) => (
    createTargetMutationDispatchOperation({
      operation,
      commitTarget,
      inheritedBlockers,
      dispatchEnabled,
      mutatorApplyImplemented
    })
  ));
  const invariantEligible = commitTarget.invariantEligible === true;
  const commitReady = commitTarget.canCommit === true;
  const dispatchableOperations = operations.filter((operation) => operation.canDispatch === true);
  const maxAbsFieldDeltaProxy = operations.reduce((max, operation) => (
    Math.max(max, Math.abs(finite(operation.deltaValue)))
  ), 0);
  const totalAbsFieldDeltaProxy = operations.reduce((sum, operation) => (
    sum + Math.abs(finite(operation.deltaValue))
  ), 0);
  const maxAbsTemperatureDeltaKProxy = operations
    .filter((operation) => operation.dimensions === 'Theta')
    .reduce((max, operation) => Math.max(max, Math.abs(finite(operation.deltaValue))), 0);
  const totalHeatRateWProxy = operations
    .filter((operation) => operation.sourceTerm === 'heatRateWProxy')
    .reduce((sum, operation) => sum + finite(operation.sourceValue), 0);
  const totalSpeciesRateCountPerSProxy = operations
    .filter((operation) => operation.sourceTerm === 'speciesRateCountPerSProxy')
    .reduce((sum, operation) => sum + Math.max(0, finite(operation.sourceValue)), 0);
  const canDispatch = dispatchEnabled === true
    && mutatorApplyImplemented === true
    && invariantEligible
    && commitReady
    && dispatchableOperations.length === operations.length
    && operations.length > 0;
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    ...(Array.isArray(commitTarget.blockers) ? commitTarget.blockers : []),
    ...(Array.isArray(operationTarget.blockers) ? operationTarget.blockers : []),
    invariantEligible ? null : 'target-invariant-check-failed',
    commitReady ? null : 'commit-not-ready',
    operations.length > 0 ? null : 'no-dispatch-operations',
    dispatchEnabled ? null : 'dispatch-disabled',
    mutatorApplyImplemented ? null : 'target-mutator-apply-not-implemented'
  ]);

  return {
    targetSolverId: commitTarget.targetSolverId || operationTarget.targetSolverId || 'unknown',
    mutatorId: commitTarget.mutatorId || operationTarget.mutatorId || null,
    stateKey: commitTarget.stateKey || operationTarget.stateKey || null,
    layer: commitTarget.layer || operationTarget.layer || 'unknown',
    dryRun: true,
    dispatchEnabled: dispatchEnabled === true,
    canDispatch,
    queued: false,
    dispatched: false,
    status: canDispatch ? 'dispatch-ready' : 'dispatch-blocked',
    invariantEligible,
    operationCount: operations.length,
    dispatchableOperationCount: dispatchableOperations.length,
    queuedOperationCount: 0,
    dispatchedOperationCount: 0,
    maxAbsFieldDeltaProxy: rounded(maxAbsFieldDeltaProxy, 9),
    totalAbsFieldDeltaProxy: rounded(totalAbsFieldDeltaProxy, 9),
    maxAbsTemperatureDeltaKProxy: rounded(maxAbsTemperatureDeltaKProxy, 6),
    totalHeatRateWProxy: rounded(totalHeatRateWProxy, 9),
    totalSpeciesRateCountPerSProxy: rounded(totalSpeciesRateCountPerSProxy, 6),
    operations,
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularTargetMutationDispatchReport({
  commit = null,
  operationPlan = null,
  timeSeconds = 0,
  dispatchEnabled = false,
  mutatorApplyImplemented = false
} = {}) {
  const hasCommitSchema = commit?.schema === MOLECULAR_TARGET_MUTATION_COMMIT_SCHEMA;
  const hasOperationPlanSchema = operationPlan?.schema === MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA;
  const operationBySolver = new Map((Array.isArray(operationPlan?.targets) ? operationPlan.targets : [])
    .map((target) => [target.targetSolverId || 'unknown', target]));
  const inheritedBlockers = uniqueStrings([
    ...(Array.isArray(commit?.blockers) ? commit.blockers : []),
    ...(Array.isArray(operationPlan?.blockers) ? operationPlan.blockers : [])
  ]);
  const batches = (Array.isArray(commit?.targets) ? commit.targets : []).map((target) => {
    const solverId = target.targetSolverId || 'unknown';
    return createTargetMutationDispatchBatch({
      commitTarget: target,
      operationTarget: operationBySolver.get(solverId) || {},
      inheritedBlockers,
      dispatchEnabled,
      mutatorApplyImplemented
    });
  });
  const batchCount = batches.length;
  const invariantEligibleBatchCount = batches.filter((batch) => batch.invariantEligible).length;
  const dispatchableBatchCount = batches.filter((batch) => batch.canDispatch).length;
  const blockedBatchCount = batchCount - dispatchableBatchCount;
  const operationCount = Math.max(
    Math.round(finite(operationPlan?.operationCount)),
    batches.reduce((sum, batch) => sum + finite(batch.operationCount), 0)
  );
  const dispatchableOperationCount = batches.reduce((sum, batch) => sum + finite(batch.dispatchableOperationCount), 0);
  const queuedOperationCount = batches.reduce((sum, batch) => sum + finite(batch.queuedOperationCount), 0);
  const dispatchedOperationCount = batches.reduce((sum, batch) => sum + finite(batch.dispatchedOperationCount), 0);
  const maxAbsFieldDeltaProxy = batches.reduce((max, batch) => (
    Math.max(max, finite(batch.maxAbsFieldDeltaProxy))
  ), 0);
  const maxAbsTemperatureDeltaKProxy = batches.reduce((max, batch) => (
    Math.max(max, finite(batch.maxAbsTemperatureDeltaKProxy))
  ), 0);
  const totalHeatRateWProxy = batches.reduce((sum, batch) => sum + finite(batch.totalHeatRateWProxy), 0);
  const totalSpeciesRateCountPerSProxy = batches.reduce((sum, batch) => (
    sum + finite(batch.totalSpeciesRateCountPerSProxy)
  ), 0);
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    hasCommitSchema ? null : 'missing-target-mutation-commit',
    hasOperationPlanSchema ? null : 'missing-target-mutation-operation-plan',
    batchCount > 0 ? null : 'no-dispatch-batches',
    commit?.canCommit === true ? null : 'commit-not-ready',
    operationCount > 0 ? null : 'no-dispatch-operations',
    dispatchEnabled ? null : 'dispatch-disabled',
    mutatorApplyImplemented ? null : 'target-mutator-apply-not-implemented'
  ]);
  const canDispatch = dispatchEnabled === true
    && mutatorApplyImplemented === true
    && commit?.canCommit === true
    && dispatchableBatchCount === batchCount
    && batchCount > 0;
  const status = !hasCommitSchema
    ? 'missing-commit'
    : batchCount === 0
      ? 'no-dispatch-batches'
      : canDispatch
        ? 'dispatch-ready'
        : 'dispatch-blocked';

  return {
    schema: MOLECULAR_TARGET_MUTATION_DISPATCH_SCHEMA,
    mode: 'commit-gated-target-mutation-dispatch-v0',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    sourceCommitSchema: commit?.schema || null,
    sourceCommitStatus: commit?.status || 'unknown',
    sourceOperationPlanSchema: operationPlan?.schema || null,
    sourceOperationPlanStatus: operationPlan?.status || 'unknown',
    dryRun: true,
    dispatchEnabled: dispatchEnabled === true,
    mutatorApplyImplemented: mutatorApplyImplemented === true,
    canDispatch,
    queued: false,
    dispatched: false,
    batchCount,
    invariantEligibleBatchCount,
    dispatchableBatchCount,
    blockedBatchCount,
    queuedBatchCount: 0,
    dispatchedBatchCount: 0,
    operationCount,
    dispatchableOperationCount,
    blockedOperationCount: Math.max(0, operationCount - dispatchableOperationCount),
    queuedOperationCount,
    dispatchedOperationCount,
    maxAbsFieldDeltaProxy: rounded(maxAbsFieldDeltaProxy, 9),
    maxAbsTemperatureDeltaKProxy: rounded(maxAbsTemperatureDeltaKProxy, 6),
    totalHeatRateWProxy: rounded(totalHeatRateWProxy, 9),
    totalSpeciesRateCountPerSProxy: rounded(totalSpeciesRateCountPerSProxy, 6),
    blockerCount: blockers.length,
    blockers,
    batches,
    validity: {
      status: 'dispatch-blocked',
      confidence: 0.16,
      warnings: [
        'Dispatch report assembles target operation batches only; it does not queue or mutate solver state.',
        'Real dispatch still requires enabled commit dispatch, validated mutator apply code, and conservative invariant enforcement.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_MUTATION_DISPATCH_SCHEMA,
      sourceCommitSchema: commit?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetMutationDispatchReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_MUTATION_DISPATCH_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    sourceCommitSchema: report.sourceCommitSchema || null,
    sourceOperationPlanSchema: report.sourceOperationPlanSchema || null,
    dryRun: report.dryRun === true,
    dispatchEnabled: report.dispatchEnabled === true,
    mutatorApplyImplemented: report.mutatorApplyImplemented === true,
    canDispatch: report.canDispatch === true,
    queued: report.queued === true,
    dispatched: report.dispatched === true,
    batchCount: Math.max(0, Math.round(finite(report.batchCount, report.batches?.length))),
    invariantEligibleBatchCount: Math.max(0, Math.round(finite(report.invariantEligibleBatchCount))),
    dispatchableBatchCount: Math.max(0, Math.round(finite(report.dispatchableBatchCount))),
    blockedBatchCount: Math.max(0, Math.round(finite(report.blockedBatchCount))),
    queuedBatchCount: Math.max(0, Math.round(finite(report.queuedBatchCount))),
    dispatchedBatchCount: Math.max(0, Math.round(finite(report.dispatchedBatchCount))),
    operationCount: Math.max(0, Math.round(finite(report.operationCount))),
    dispatchableOperationCount: Math.max(0, Math.round(finite(report.dispatchableOperationCount))),
    blockedOperationCount: Math.max(0, Math.round(finite(report.blockedOperationCount))),
    queuedOperationCount: Math.max(0, Math.round(finite(report.queuedOperationCount))),
    dispatchedOperationCount: Math.max(0, Math.round(finite(report.dispatchedOperationCount))),
    maxAbsFieldDeltaProxy: finite(report.maxAbsFieldDeltaProxy),
    maxAbsTemperatureDeltaKProxy: finite(report.maxAbsTemperatureDeltaKProxy),
    totalHeatRateWProxy: finite(report.totalHeatRateWProxy),
    totalSpeciesRateCountPerSProxy: finite(report.totalSpeciesRateCountPerSProxy),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

function createTargetMutationApplyValidationOperation({
  operation = {},
  inheritedBlockers = [],
  applyEnabled = false,
  targetApplyImplemented = false,
  residualToleranceProxy = 1e-9
} = {}) {
  const before = Number(operation.beforeValue);
  const after = Number(operation.afterValue);
  const delta = Number(operation.deltaValue);
  const hasFiniteBeforeAfter = Number.isFinite(before) && Number.isFinite(after) && Number.isFinite(delta);
  const beforeAfterResidualProxy = hasFiniteBeforeAfter
    ? Math.abs((after - before) - delta)
    : 1;
  const residualPassed = beforeAfterResidualProxy <= Math.max(0, finite(residualToleranceProxy, 1e-9));
  const dispatchReady = operation.canDispatch === true && operation.dispatched === true;
  const validated = hasFiniteBeforeAfter && residualPassed && operation.allowedByRegistry === true;
  const canApply = applyEnabled === true
    && targetApplyImplemented === true
    && dispatchReady
    && validated;
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    ...(Array.isArray(operation.blockers) ? operation.blockers : []),
    hasFiniteBeforeAfter ? null : 'non-finite-before-after-delta',
    residualPassed ? null : 'before-after-residual-exceeded',
    operation.allowedByRegistry === true ? null : 'operation-not-registry-allowed',
    dispatchReady ? null : 'dispatch-not-ready',
    applyEnabled ? null : 'apply-disabled',
    targetApplyImplemented ? null : 'target-mutator-apply-not-implemented'
  ]);

  return {
    targetSolverId: operation.targetSolverId || 'unknown',
    mutatorId: operation.mutatorId || null,
    stateKey: operation.stateKey || null,
    layer: operation.layer || 'unknown',
    field: operation.field || 'unknown',
    role: operation.role || 'unknown',
    sourceTerm: operation.sourceTerm || null,
    unit: operation.unit || 'unknown',
    dimensions: operation.dimensions || 'unknown',
    beforeValue: Number.isFinite(before) ? rounded(before, 9) : null,
    afterValue: Number.isFinite(after) ? rounded(after, 9) : null,
    deltaValue: Number.isFinite(delta) ? rounded(delta, 9) : null,
    sourceValue: rounded(operation.sourceValue, 9),
    allowedByRegistry: operation.allowedByRegistry === true,
    residualPassed,
    beforeAfterResidualProxy: rounded(beforeAfterResidualProxy, 12),
    dryRun: true,
    validated,
    canApply,
    applied: false,
    status: canApply ? 'apply-ready' : validated ? 'apply-blocked' : 'apply-invalid',
    blockerCount: blockers.length,
    blockers
  };
}

function createTargetMutationApplyValidationTarget({
  batch = {},
  inheritedBlockers = [],
  applyEnabled = false,
  targetApplyImplemented = false,
  residualToleranceProxy = 1e-9
} = {}) {
  const operations = (Array.isArray(batch.operations) ? batch.operations : []).map((operation) => (
    createTargetMutationApplyValidationOperation({
      operation,
      inheritedBlockers,
      applyEnabled,
      targetApplyImplemented,
      residualToleranceProxy
    })
  ));
  const validatedOperations = operations.filter((operation) => operation.validated === true);
  const applyReadyOperations = operations.filter((operation) => operation.canApply === true);
  const maxBeforeAfterResidualProxy = operations.reduce((max, operation) => (
    Math.max(max, finite(operation.beforeAfterResidualProxy))
  ), 0);
  const maxAbsFieldDeltaProxy = operations.reduce((max, operation) => (
    Math.max(max, Math.abs(finite(operation.deltaValue)))
  ), 0);
  const maxAbsTemperatureDeltaKProxy = operations
    .filter((operation) => operation.dimensions === 'Theta')
    .reduce((max, operation) => Math.max(max, Math.abs(finite(operation.deltaValue))), 0);
  const totalHeatRateWProxy = operations
    .filter((operation) => operation.sourceTerm === 'heatRateWProxy')
    .reduce((sum, operation) => sum + finite(operation.sourceValue), 0);
  const totalSpeciesRateCountPerSProxy = operations
    .filter((operation) => operation.sourceTerm === 'speciesRateCountPerSProxy')
    .reduce((sum, operation) => sum + Math.max(0, finite(operation.sourceValue)), 0);
  const validated = operations.length > 0 && validatedOperations.length === operations.length;
  const dispatchReady = batch.canDispatch === true && batch.dispatched === true;
  const canApply = applyEnabled === true
    && targetApplyImplemented === true
    && dispatchReady
    && validated
    && applyReadyOperations.length === operations.length
    && operations.length > 0;
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    ...(Array.isArray(batch.blockers) ? batch.blockers : []),
    operations.length > 0 ? null : 'no-apply-validation-operations',
    validated ? null : 'apply-validation-failed',
    dispatchReady ? null : 'dispatch-not-ready',
    applyEnabled ? null : 'apply-disabled',
    targetApplyImplemented ? null : 'target-mutator-apply-not-implemented'
  ]);

  return {
    targetSolverId: batch.targetSolverId || 'unknown',
    mutatorId: batch.mutatorId || null,
    stateKey: batch.stateKey || null,
    layer: batch.layer || 'unknown',
    dryRun: true,
    validated,
    canApply,
    applied: false,
    status: canApply ? 'apply-ready' : validated ? 'apply-blocked' : 'apply-invalid',
    operationCount: operations.length,
    validatedOperationCount: validatedOperations.length,
    applyReadyOperationCount: applyReadyOperations.length,
    appliedOperationCount: 0,
    blockedOperationCount: Math.max(0, operations.length - applyReadyOperations.length),
    stateWriteSetCount: uniqueStrings(operations.map((operation) => operation.field)).length,
    maxBeforeAfterResidualProxy: rounded(maxBeforeAfterResidualProxy, 12),
    maxAbsFieldDeltaProxy: rounded(maxAbsFieldDeltaProxy, 9),
    maxAbsTemperatureDeltaKProxy: rounded(maxAbsTemperatureDeltaKProxy, 6),
    totalHeatRateWProxy: rounded(totalHeatRateWProxy, 9),
    totalSpeciesRateCountPerSProxy: rounded(totalSpeciesRateCountPerSProxy, 6),
    operations,
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularTargetMutationApplyValidationReport({
  dispatch = null,
  operationPlan = null,
  timeSeconds = 0,
  applyEnabled = false,
  targetApplyImplemented = false,
  residualToleranceProxy = 1e-9
} = {}) {
  const hasDispatchSchema = dispatch?.schema === MOLECULAR_TARGET_MUTATION_DISPATCH_SCHEMA;
  const hasOperationPlanSchema = operationPlan?.schema === MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA;
  const inheritedBlockers = uniqueStrings([
    ...(Array.isArray(dispatch?.blockers) ? dispatch.blockers : []),
    ...(Array.isArray(operationPlan?.blockers) ? operationPlan.blockers : [])
  ]);
  const targets = (Array.isArray(dispatch?.batches) ? dispatch.batches : []).map((batch) => (
    createTargetMutationApplyValidationTarget({
      batch,
      inheritedBlockers,
      applyEnabled,
      targetApplyImplemented,
      residualToleranceProxy
    })
  ));
  const targetCount = targets.length;
  const validatedTargetCount = targets.filter((target) => target.validated).length;
  const applyReadyTargetCount = targets.filter((target) => target.canApply).length;
  const operationCount = Math.max(
    Math.round(finite(dispatch?.operationCount, operationPlan?.operationCount)),
    targets.reduce((sum, target) => sum + finite(target.operationCount), 0)
  );
  const validatedOperationCount = targets.reduce((sum, target) => sum + finite(target.validatedOperationCount), 0);
  const applyReadyOperationCount = targets.reduce((sum, target) => sum + finite(target.applyReadyOperationCount), 0);
  const appliedOperationCount = targets.reduce((sum, target) => sum + finite(target.appliedOperationCount), 0);
  const blockedOperationCount = Math.max(0, operationCount - applyReadyOperationCount);
  const stateWriteSetCount = targets.reduce((sum, target) => sum + finite(target.stateWriteSetCount), 0);
  const maxBeforeAfterResidualProxy = targets.reduce((max, target) => (
    Math.max(max, finite(target.maxBeforeAfterResidualProxy))
  ), 0);
  const maxAbsFieldDeltaProxy = targets.reduce((max, target) => (
    Math.max(max, finite(target.maxAbsFieldDeltaProxy))
  ), 0);
  const maxAbsTemperatureDeltaKProxy = targets.reduce((max, target) => (
    Math.max(max, finite(target.maxAbsTemperatureDeltaKProxy))
  ), 0);
  const totalHeatRateWProxy = targets.reduce((sum, target) => sum + finite(target.totalHeatRateWProxy), 0);
  const totalSpeciesRateCountPerSProxy = targets.reduce((sum, target) => (
    sum + finite(target.totalSpeciesRateCountPerSProxy)
  ), 0);
  const blockers = uniqueStrings([
    ...inheritedBlockers,
    hasDispatchSchema ? null : 'missing-target-mutation-dispatch',
    hasOperationPlanSchema ? null : 'missing-target-mutation-operation-plan',
    targetCount > 0 ? null : 'no-apply-validation-targets',
    validatedTargetCount === targetCount && targetCount > 0 ? null : 'apply-validation-failed',
    dispatch?.canDispatch === true && dispatch?.dispatched === true ? null : 'dispatch-not-ready',
    applyEnabled ? null : 'apply-disabled',
    targetApplyImplemented ? null : 'target-mutator-apply-not-implemented'
  ]);
  const canApply = applyEnabled === true
    && targetApplyImplemented === true
    && dispatch?.canDispatch === true
    && dispatch?.dispatched === true
    && applyReadyTargetCount === targetCount
    && targetCount > 0;
  const status = !hasDispatchSchema
    ? 'missing-dispatch'
    : targetCount === 0
      ? 'no-apply-validation-targets'
      : canApply
        ? 'apply-ready'
        : validatedTargetCount === targetCount
          ? 'apply-blocked'
          : 'apply-invalid';

  return {
    schema: MOLECULAR_TARGET_MUTATION_APPLY_VALIDATION_SCHEMA,
    mode: 'dispatch-gated-target-apply-validation-v0',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    sourceDispatchSchema: dispatch?.schema || null,
    sourceDispatchStatus: dispatch?.status || 'unknown',
    sourceOperationPlanSchema: operationPlan?.schema || null,
    sourceOperationPlanStatus: operationPlan?.status || 'unknown',
    dryRun: true,
    applyEnabled: applyEnabled === true,
    targetApplyImplemented: targetApplyImplemented === true,
    canApply,
    applied: false,
    targetCount,
    validatedTargetCount,
    applyReadyTargetCount,
    blockedTargetCount: Math.max(0, targetCount - applyReadyTargetCount),
    appliedTargetCount: 0,
    operationCount,
    validatedOperationCount,
    applyReadyOperationCount,
    blockedOperationCount,
    appliedOperationCount,
    stateWriteSetCount,
    residualToleranceProxy: rounded(Math.max(0, finite(residualToleranceProxy, 1e-9)), 12),
    maxBeforeAfterResidualProxy: rounded(maxBeforeAfterResidualProxy, 12),
    maxAbsFieldDeltaProxy: rounded(maxAbsFieldDeltaProxy, 9),
    maxAbsTemperatureDeltaKProxy: rounded(maxAbsTemperatureDeltaKProxy, 6),
    totalHeatRateWProxy: rounded(totalHeatRateWProxy, 9),
    totalSpeciesRateCountPerSProxy: rounded(totalSpeciesRateCountPerSProxy, 6),
    blockerCount: blockers.length,
    blockers,
    targets,
    validity: {
      status: 'apply-validation-blocked',
      confidence: 0.16,
      warnings: [
        'Apply validation checks deterministic before/after target write previews only; it does not mutate solver state.',
        'Real target apply still requires enabled dispatch, implemented target mutators, and conservative invariant enforcement.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_MUTATION_APPLY_VALIDATION_SCHEMA,
      sourceDispatchSchema: dispatch?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetMutationApplyValidationReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_MUTATION_APPLY_VALIDATION_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    sourceDispatchSchema: report.sourceDispatchSchema || null,
    sourceOperationPlanSchema: report.sourceOperationPlanSchema || null,
    dryRun: report.dryRun === true,
    applyEnabled: report.applyEnabled === true,
    targetApplyImplemented: report.targetApplyImplemented === true,
    canApply: report.canApply === true,
    applied: report.applied === true,
    targetCount: Math.max(0, Math.round(finite(report.targetCount, report.targets?.length))),
    validatedTargetCount: Math.max(0, Math.round(finite(report.validatedTargetCount))),
    applyReadyTargetCount: Math.max(0, Math.round(finite(report.applyReadyTargetCount))),
    blockedTargetCount: Math.max(0, Math.round(finite(report.blockedTargetCount))),
    appliedTargetCount: Math.max(0, Math.round(finite(report.appliedTargetCount))),
    operationCount: Math.max(0, Math.round(finite(report.operationCount))),
    validatedOperationCount: Math.max(0, Math.round(finite(report.validatedOperationCount))),
    applyReadyOperationCount: Math.max(0, Math.round(finite(report.applyReadyOperationCount))),
    blockedOperationCount: Math.max(0, Math.round(finite(report.blockedOperationCount))),
    appliedOperationCount: Math.max(0, Math.round(finite(report.appliedOperationCount))),
    stateWriteSetCount: Math.max(0, Math.round(finite(report.stateWriteSetCount))),
    residualToleranceProxy: finite(report.residualToleranceProxy),
    maxBeforeAfterResidualProxy: finite(report.maxBeforeAfterResidualProxy),
    maxAbsFieldDeltaProxy: finite(report.maxAbsFieldDeltaProxy),
    maxAbsTemperatureDeltaKProxy: finite(report.maxAbsTemperatureDeltaKProxy),
    totalHeatRateWProxy: finite(report.totalHeatRateWProxy),
    totalSpeciesRateCountPerSProxy: finite(report.totalSpeciesRateCountPerSProxy),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

export function createMolecularTargetMutationApplyExecutionReport({
  applyValidation = null,
  appliedTargets = [],
  timeSeconds = 0,
  executionRequested = false,
  proxyApplyEnabled = false,
  targetApplyImplemented = false,
  residualToleranceProxy = 1e-9,
  reason = 'unknown',
  sequence = 0
} = {}) {
  const hasApplyValidationSchema = applyValidation?.schema === MOLECULAR_TARGET_MUTATION_APPLY_VALIDATION_SCHEMA;
  const targetCount = Math.max(0, Math.round(finite(applyValidation?.targetCount, applyValidation?.targets?.length)));
  const validatedTargetCount = Math.max(0, Math.round(finite(applyValidation?.validatedTargetCount)));
  const operationCount = Math.max(0, Math.round(finite(applyValidation?.operationCount)));
  const validatedOperationCount = Math.max(0, Math.round(finite(applyValidation?.validatedOperationCount)));
  const tolerance = Math.max(0, finite(residualToleranceProxy, applyValidation?.residualToleranceProxy ?? 1e-9));
  const residual = Math.max(0, finite(applyValidation?.maxBeforeAfterResidualProxy));
  const validationPassed = hasApplyValidationSchema
    && targetCount > 0
    && validatedTargetCount === targetCount
    && operationCount > 0
    && validatedOperationCount === operationCount
    && residual <= tolerance;
  const applied = Array.isArray(appliedTargets) ? appliedTargets : [];
  const appliedTargetCount = applied.filter((target) => target.applied === true).length;
  const appliedOperationCount = applied.reduce((sum, target) => sum + finite(target.appliedOperationCount), 0);
  const stateWriteSetCount = applied.reduce((sum, target) => sum + finite(target.stateWriteSetCount), 0);
  const maxBeforeAfterResidualProxy = Math.max(
    residual,
    applied.reduce((max, target) => Math.max(max, finite(target.maxBeforeAfterResidualProxy)), 0)
  );
  const canExecute = executionRequested === true
    && proxyApplyEnabled === true
    && targetApplyImplemented === true
    && validationPassed;
  const upstreamBlockers = uniqueStrings(Array.isArray(applyValidation?.blockers) ? applyValidation.blockers : []);
  const blockers = uniqueStrings([
    hasApplyValidationSchema ? null : 'missing-target-mutation-apply-validation',
    targetCount > 0 ? null : 'no-apply-execution-targets',
    validationPassed ? null : 'apply-validation-not-passed',
    executionRequested ? null : 'execution-not-requested',
    proxyApplyEnabled ? null : 'proxy-apply-disabled',
    targetApplyImplemented ? null : 'target-mutator-apply-not-implemented',
    canExecute && appliedTargetCount === targetCount ? null : appliedTargetCount > 0 ? 'partial-proxy-apply' : null
  ]);
  const status = !hasApplyValidationSchema
    ? 'missing-apply-validation'
    : appliedOperationCount > 0
      ? appliedTargetCount === targetCount
        ? 'applied-proxy'
        : 'partial-proxy-apply'
      : canExecute
        ? 'ready-to-execute'
        : validationPassed
          ? 'execution-blocked'
          : 'execution-invalid';

  return {
    schema: MOLECULAR_TARGET_MUTATION_APPLY_EXECUTION_SCHEMA,
    mode: 'explicit-proxy-model-aggregate-apply-v0',
    status,
    sequence: Math.max(0, Math.round(finite(sequence))),
    timeSeconds: rounded(timeSeconds, 3),
    reason,
    sourceApplyValidationSchema: applyValidation?.schema || null,
    sourceApplyValidationStatus: applyValidation?.status || 'unknown',
    executionRequested: executionRequested === true,
    proxyApplyEnabled: proxyApplyEnabled === true,
    targetApplyImplemented: targetApplyImplemented === true,
    validationPassed,
    canExecute,
    dryRun: appliedOperationCount === 0,
    applied: appliedOperationCount > 0,
    targetCount,
    validatedTargetCount,
    executionReadyTargetCount: canExecute ? targetCount : 0,
    appliedTargetCount,
    blockedTargetCount: Math.max(0, targetCount - appliedTargetCount),
    operationCount,
    validatedOperationCount,
    appliedOperationCount,
    blockedOperationCount: Math.max(0, operationCount - appliedOperationCount),
    stateWriteSetCount,
    residualToleranceProxy: rounded(tolerance, 12),
    maxBeforeAfterResidualProxy: rounded(maxBeforeAfterResidualProxy, 12),
    blockerCount: blockers.length,
    blockers,
    upstreamBlockerCount: upstreamBlockers.length,
    upstreamBlockers,
    targets: applied,
    validity: {
      status: appliedOperationCount > 0 ? 'interactive-proxy-applied' : 'apply-execution-blocked',
      confidence: 0.14,
      warnings: [
        'Apply execution mutates only the reduced model aggregate state, not authoritative worker buffers.',
        'This is an explicit proxy mutation lane for integration testing; scientific mode still needs conservative source equations and exact invariant enforcement.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_MUTATION_APPLY_EXECUTION_SCHEMA,
      sourceApplyValidationSchema: applyValidation?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetMutationApplyExecutionReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_MUTATION_APPLY_EXECUTION_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    sequence: Math.max(0, Math.round(finite(report.sequence))),
    reason: report.reason || null,
    sourceApplyValidationSchema: report.sourceApplyValidationSchema || null,
    executionRequested: report.executionRequested === true,
    proxyApplyEnabled: report.proxyApplyEnabled === true,
    targetApplyImplemented: report.targetApplyImplemented === true,
    validationPassed: report.validationPassed === true,
    canExecute: report.canExecute === true,
    dryRun: report.dryRun === true,
    applied: report.applied === true,
    targetCount: Math.max(0, Math.round(finite(report.targetCount, report.targets?.length))),
    validatedTargetCount: Math.max(0, Math.round(finite(report.validatedTargetCount))),
    executionReadyTargetCount: Math.max(0, Math.round(finite(report.executionReadyTargetCount))),
    appliedTargetCount: Math.max(0, Math.round(finite(report.appliedTargetCount))),
    blockedTargetCount: Math.max(0, Math.round(finite(report.blockedTargetCount))),
    operationCount: Math.max(0, Math.round(finite(report.operationCount))),
    validatedOperationCount: Math.max(0, Math.round(finite(report.validatedOperationCount))),
    appliedOperationCount: Math.max(0, Math.round(finite(report.appliedOperationCount))),
    blockedOperationCount: Math.max(0, Math.round(finite(report.blockedOperationCount))),
    stateWriteSetCount: Math.max(0, Math.round(finite(report.stateWriteSetCount))),
    residualToleranceProxy: finite(report.residualToleranceProxy),
    maxBeforeAfterResidualProxy: finite(report.maxBeforeAfterResidualProxy),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : [],
    upstreamBlockerCount: Math.max(0, Math.round(finite(report.upstreamBlockerCount, report.upstreamBlockers?.length))),
    upstreamBlockers: Array.isArray(report.upstreamBlockers) ? [...report.upstreamBlockers] : []
  };
}

function pickAppliedSourceValue(operations = [], sourceTerm = null) {
  const candidates = operations.filter((operation) => operation.sourceTerm === sourceTerm);
  if (candidates.length === 0) return 0;
  return candidates.reduce((selected, operation) => (
    Math.abs(finite(operation.sourceValue)) > Math.abs(finite(selected.sourceValue)) ? operation : selected
  ), candidates[0]).sourceValue;
}

function pickAppliedFieldDelta(operations = [], fields = []) {
  for (const field of fields) {
    const operation = operations.find((candidate) => candidate.field === field);
    if (operation) return finite(operation.deltaValue);
  }
  return 0;
}

function createTargetSourceIntake(target = {}) {
  const operations = Array.isArray(target.operations) ? target.operations : [];
  const appliedOperations = operations.filter((operation) => operation.applied === true);
  const targetSolverId = target.targetSolverId || 'unknown';
  const heatRateWProxy = pickAppliedSourceValue(appliedOperations, 'heatRateWProxy');
  const speciesRateCountPerSProxy = Math.max(0, pickAppliedSourceValue(appliedOperations, 'speciesRateCountPerSProxy'));
  const reactionDriveDeltaProxy = Math.max(0, pickAppliedSourceValue(appliedOperations, 'reactionDriveDeltaProxy'));
  const phaseDriveDeltaProxy = Math.max(0, pickAppliedSourceValue(appliedOperations, 'phaseDriveDeltaProxy'));
  const temperatureDeltaKProxy = pickAppliedFieldDelta(appliedOperations, ['temperatureK', 'averageTemperatureK']);
  const radiativeHeatFluxBoostProxy = pickAppliedFieldDelta(appliedOperations, [
    'molecularClosureHeatFluxProxy',
    'molecularClosureRadiativeHeatFluxBoost'
  ]);
  const thermalDrive = clamp(
    Math.max(0, heatRateWProxy) * 10
      + Math.max(0, temperatureDeltaKProxy) / 260
      + speciesRateCountPerSProxy * 0.004
      + reactionDriveDeltaProxy * 0.4
      + phaseDriveDeltaProxy * 0.16,
    0,
    1
  );
  const fieldDeltas = {};
  for (const operation of appliedOperations) {
    if (operation.field) fieldDeltas[operation.field] = rounded(operation.deltaValue, 9);
  }
  return {
    targetSolverId,
    stateKey: target.stateKey || null,
    layer: target.layer || 'unknown',
    active: target.applied === true && appliedOperations.length > 0,
    status: target.applied === true && appliedOperations.length > 0 ? 'source-intake-ready' : 'source-intake-inactive',
    operationCount: Math.max(0, Math.round(finite(target.operationCount, operations.length))),
    appliedOperationCount: appliedOperations.length,
    stateWriteSetCount: Math.max(0, Math.round(finite(target.stateWriteSetCount))),
    heatRateWProxy: rounded(heatRateWProxy, 9),
    speciesRateCountPerSProxy: rounded(speciesRateCountPerSProxy, 6),
    temperatureDeltaKProxy: rounded(temperatureDeltaKProxy, 6),
    phaseDriveDeltaProxy: rounded(phaseDriveDeltaProxy, 9),
    reactionDriveDeltaProxy: rounded(reactionDriveDeltaProxy, 6),
    radiativeHeatFluxBoostProxy: rounded(radiativeHeatFluxBoostProxy, 6),
    thermalDrive: rounded(thermalDrive, 6),
    fieldDeltas
  };
}

export function createMolecularTargetSourceIntakeReport({
  applyExecution = null,
  timeSeconds = 0
} = {}) {
  const hasExecutionSchema = applyExecution?.schema === MOLECULAR_TARGET_MUTATION_APPLY_EXECUTION_SCHEMA;
  const targets = (Array.isArray(applyExecution?.targets) ? applyExecution.targets : []).map(createTargetSourceIntake);
  const activeTargets = targets.filter((target) => target.active === true);
  const targetCount = targets.length;
  const activeTargetCount = activeTargets.length;
  const operationCount = targets.reduce((sum, target) => sum + finite(target.operationCount), 0);
  const appliedOperationCount = targets.reduce((sum, target) => sum + finite(target.appliedOperationCount), 0);
  const totalHeatRateWProxy = activeTargets.reduce((sum, target) => sum + finite(target.heatRateWProxy), 0);
  const totalSpeciesRateCountPerSProxy = activeTargets.reduce((sum, target) => sum + finite(target.speciesRateCountPerSProxy), 0);
  const maxTemperatureDeltaKProxy = activeTargets.reduce((max, target) => (
    Math.max(max, Math.abs(finite(target.temperatureDeltaKProxy)))
  ), 0);
  const maxPhaseDriveDeltaProxy = activeTargets.reduce((max, target) => (
    Math.max(max, finite(target.phaseDriveDeltaProxy))
  ), 0);
  const maxThermalDrive = activeTargets.reduce((max, target) => (
    Math.max(max, finite(target.thermalDrive))
  ), 0);
  const blockers = uniqueStrings([
    hasExecutionSchema ? null : 'missing-apply-execution-report',
    applyExecution?.applied === true ? null : 'apply-execution-not-applied',
    activeTargetCount > 0 ? null : 'no-active-source-intake-targets'
  ]);
  return {
    schema: MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA,
    mode: 'apply-execution-derived-target-source-intake-v0',
    status: activeTargetCount > 0 ? 'ready' : 'inactive',
    timeSeconds: rounded(timeSeconds, 3),
    sourceApplyExecutionSchema: applyExecution?.schema || null,
    sourceApplyExecutionStatus: applyExecution?.status || 'unknown',
    sourceApplyExecutionSequence: Math.max(0, Math.round(finite(applyExecution?.sequence))),
    active: activeTargetCount > 0,
    targetCount,
    activeTargetCount,
    operationCount,
    appliedOperationCount,
    totalHeatRateWProxy: rounded(totalHeatRateWProxy, 9),
    totalSpeciesRateCountPerSProxy: rounded(totalSpeciesRateCountPerSProxy, 6),
    maxTemperatureDeltaKProxy: rounded(maxTemperatureDeltaKProxy, 6),
    maxPhaseDriveDeltaProxy: rounded(maxPhaseDriveDeltaProxy, 9),
    maxThermalDrive: rounded(maxThermalDrive, 6),
    blockerCount: blockers.length,
    blockers,
    targets,
    validity: {
      status: activeTargetCount > 0 ? 'interactive-proxy-source-intake' : 'inactive',
      confidence: 0.12,
      warnings: [
        'Target source intake is derived from explicit proxy apply execution and feeds reduced worker inputs only.',
        'Scientific conservative source-term application still requires target buffer mutation, invariant enforcement, and calibrated closure equations.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA,
      sourceApplyExecutionSchema: applyExecution?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetSourceIntakeReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    sourceApplyExecutionSchema: report.sourceApplyExecutionSchema || null,
    sourceApplyExecutionStatus: report.sourceApplyExecutionStatus || 'unknown',
    sourceApplyExecutionSequence: Math.max(0, Math.round(finite(report.sourceApplyExecutionSequence))),
    active: report.active === true,
    targetCount: Math.max(0, Math.round(finite(report.targetCount, report.targets?.length))),
    activeTargetCount: Math.max(0, Math.round(finite(report.activeTargetCount))),
    operationCount: Math.max(0, Math.round(finite(report.operationCount))),
    appliedOperationCount: Math.max(0, Math.round(finite(report.appliedOperationCount))),
    totalHeatRateWProxy: finite(report.totalHeatRateWProxy),
    totalSpeciesRateCountPerSProxy: finite(report.totalSpeciesRateCountPerSProxy),
    maxTemperatureDeltaKProxy: finite(report.maxTemperatureDeltaKProxy),
    maxPhaseDriveDeltaProxy: finite(report.maxPhaseDriveDeltaProxy),
    maxThermalDrive: finite(report.maxThermalDrive),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

function createTargetSourceResponse(intakeTarget = {}, targetState = {}) {
  const targetSolverId = intakeTarget.targetSolverId || targetState.solverId || 'unknown';
  const activeIntake = intakeTarget.active === true;
  const sourceApplyExecutionSequence = Math.max(0, Math.round(finite(intakeTarget.sourceApplyExecutionSequence)));
  const targetResponseSequence = Math.max(0, Math.round(finite(targetState.molecularTargetSourceIntakeSequence)));
  const targetResponseSchema = targetState.molecularTargetSourceIntakeSchema || null;
  const responseThermalDrive = finite(targetState.molecularTargetSourceIntakeThermalDrive);
  const targetSourceBufferSchema = targetState.molecularConservativeSourceBufferSchema || null;
  const targetSourceBufferSequence = Math.max(0, Math.round(finite(targetState.molecularConservativeSourceBufferSequence)));
  const targetSourceBufferThermalDrive = finite(targetState.molecularConservativeSourceBufferThermalDrive);
  const targetSourceBufferResidual = Math.max(0, finite(targetState.molecularConservativeSourceBufferResidual));
  const targetSourceBufferVectorStride = Math.max(0, Math.round(finite(targetState.molecularConservativeSourceBufferVectorStride)));
  const schemaAcknowledged = targetResponseSchema === MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA;
  const sequenceAcknowledged = schemaAcknowledged
    && (sourceApplyExecutionSequence === 0 || targetResponseSequence === sourceApplyExecutionSequence);
  const temperatureK = finite(targetState.temperatureK, finite(targetState.averageTemperatureK));
  const heatFluxResponseProxy = finite(
    targetState.molecularClosureHeatFluxProxy,
    finite(targetState.molecularClosureRadiativeHeatFluxBoost)
  );
  const phaseResponseProxy = Math.max(
    Math.abs(finite(targetState.phaseChangeRateProxy)),
    finite(targetState.boilingFraction),
    finite(targetState.vaporFraction)
  );
  const quantumMaterialResponseDriveProxy = Math.max(
    Math.abs(finite(targetState.molecularQuantumMaterialPropertyThermalFluxBoostProxy)),
    Math.abs(finite(targetState.molecularQuantumMaterialPropertyPhaseDriveBoostProxy)),
    Math.abs(finite(targetState.molecularQuantumMaterialPropertyElectricalDrive)),
    Math.abs(finite(targetState.molecularQuantumMaterialPropertyOpticalHeatingDrive)),
    Math.abs(finite(targetState.molecularQuantumMaterialPropertyMechanicalStiffnessDrive)),
    Math.abs(finite(targetState.molecularQuantumMaterialStatisticalPressureDriveProxy)),
    Math.abs(finite(targetState.molecularQuantumMaterialStatisticalOpacityDriveProxy)),
    Math.abs(finite(targetState.molecularQuantumMaterialStatisticalIonizationDriveProxy)),
    Math.abs(finite(targetState.molecularQuantumMaterialStatisticalDegeneracyPressureDriveProxy)),
    Math.abs(finite(targetState.molecularQuantumMaterialStatisticalTemperatureDeltaKProxy)),
    Math.abs(finite(targetState.molecularQuantumMaterialStatisticalChargeDeltaProxy)),
    Math.abs(finite(targetState.molecularQuantumMaterialResponseDerivativeTemperatureDrive)),
    Math.abs(finite(targetState.molecularQuantumMaterialResponseDerivativePressureDrive)),
    Math.abs(finite(targetState.molecularQuantumMaterialResponseDerivativeFieldDrive)),
    Math.abs(finite(targetState.molecularQuantumMaterialResponseDerivativeRadiationDrive)),
    Math.abs(finite(targetState.molecularQuantumMaterialResponseDerivativeThermalFluxBoostProxy)),
    Math.abs(finite(targetState.molecularQuantumMaterialResponseDerivativePhaseDriveBoostProxy)),
    Math.abs(finite(targetState.molecularQuantumMaterialResponseDerivativeElectricalDrive)),
    Math.abs(finite(targetState.molecularQuantumMaterialResponseDerivativeMechanicalDrive)),
    Math.abs(finite(targetState.molecularQuantumMaterialResponseDerivativeOpticalDrive))
  );
  const sourceBufferAcknowledged = targetSourceBufferSchema === MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA
    && targetSourceBufferVectorStride > 0
    && (
      targetSourceBufferThermalDrive > 0
      || quantumMaterialResponseDriveProxy > 0
      || targetState.molecularSourceBufferApplicationApplied === true
      || targetState.molecularSourceBufferApplication?.applied === true
    );
  const responseDriveAcknowledged = responseThermalDrive > 0
    || sourceBufferAcknowledged
    || quantumMaterialResponseDriveProxy > 0
    || heatFluxResponseProxy > 0
    || phaseResponseProxy > 0;
  const responseAcknowledged = activeIntake
    && sequenceAcknowledged
    && responseDriveAcknowledged;
  const blockers = uniqueStrings([
    activeIntake ? null : 'inactive-source-intake-target',
    schemaAcknowledged ? null : 'target-worker-has-not-acknowledged-intake',
    sequenceAcknowledged ? null : 'target-worker-intake-sequence-pending',
    responseDriveAcknowledged ? null : 'target-worker-response-drive-missing'
  ]);
  return {
    targetSolverId,
    stateKey: intakeTarget.stateKey || targetState.stateKey || null,
    layer: intakeTarget.layer || targetState.layer || 'unknown',
    activeIntake,
    responseAcknowledged,
    status: responseAcknowledged
      ? 'target-source-response-ready'
      : activeIntake
        ? 'target-source-response-pending'
        : 'target-source-response-inactive',
    sourceApplyExecutionSequence,
    targetResponseSchema,
    targetResponseSequence,
    targetSourceBufferSchema,
    targetSourceBufferSequence,
    targetSourceBufferThermalDrive: rounded(targetSourceBufferThermalDrive, 6),
    targetSourceBufferResidual: rounded(targetSourceBufferResidual, 6),
    targetSourceBufferVectorStride,
    sourceBufferAcknowledged,
    responseDriveAcknowledged,
    quantumMaterialResponseDriveProxy: rounded(quantumMaterialResponseDriveProxy, 9),
    schemaAcknowledged,
    sequenceAcknowledged,
    intakeThermalDrive: rounded(intakeTarget.thermalDrive, 6),
    responseThermalDrive: rounded(responseThermalDrive, 6),
    intakeHeatRateWProxy: rounded(intakeTarget.heatRateWProxy, 9),
    heatFluxResponseProxy: rounded(heatFluxResponseProxy, 6),
    temperatureK: rounded(temperatureK, 3),
    heatReleaseNorm: rounded(targetState.heatReleaseNorm, 6),
    steamFraction: rounded(targetState.steamFraction, 6),
    phaseResponseProxy: rounded(phaseResponseProxy, 6),
    coolingResponseProxy: rounded(targetState.coolingPotential, 6),
    fireContactFraction: rounded(targetState.fireContactFraction, 6),
    sourceSinkEnergyResidualProxy: rounded(targetState.molecularSourceSink?.energyResidualProxy, 9),
    sourceSinkSpeciesResidualProxy: rounded(targetState.molecularSourceSink?.speciesResidualProxy, 6),
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularTargetSourceResponseReport({
  sourceIntake = null,
  targetStates = {},
  timeSeconds = 0
} = {}) {
  const hasIntakeSchema = sourceIntake?.schema === MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA;
  const sourceApplyExecutionSequence = Math.max(0, Math.round(finite(sourceIntake?.sourceApplyExecutionSequence)));
  const targets = (Array.isArray(sourceIntake?.targets) ? sourceIntake.targets : [])
    .map((target) => createTargetSourceResponse(
      { ...target, sourceApplyExecutionSequence },
      targetStates[target.targetSolverId] || {}
    ));
  const activeTargets = targets.filter((target) => target.activeIntake);
  const respondedTargets = activeTargets.filter((target) => target.responseAcknowledged);
  const pendingTargets = activeTargets.filter((target) => !target.responseAcknowledged);
  const blockers = uniqueStrings([
    hasIntakeSchema ? null : 'missing-target-source-intake-report',
    activeTargets.length > 0 ? null : 'no-active-source-intake-targets',
    pendingTargets.length === 0 ? null : 'target-source-response-pending'
  ]);
  const totalIntakeThermalDrive = activeTargets.reduce((sum, target) => (
    sum + finite(target.intakeThermalDrive)
  ), 0);
  const totalResponseThermalDrive = respondedTargets.reduce((sum, target) => (
    sum + finite(target.responseThermalDrive)
  ), 0);
  const totalHeatFluxResponseProxy = respondedTargets.reduce((sum, target) => (
    sum + finite(target.heatFluxResponseProxy)
  ), 0);
  const maxResponseThermalDrive = respondedTargets.reduce((max, target) => (
    Math.max(max, finite(target.responseThermalDrive))
  ), 0);
  const maxTemperatureK = respondedTargets.reduce((max, target) => (
    Math.max(max, finite(target.temperatureK))
  ), 0);
  const maxPhaseResponseProxy = respondedTargets.reduce((max, target) => (
    Math.max(max, finite(target.phaseResponseProxy))
  ), 0);
  return {
    schema: MOLECULAR_TARGET_SOURCE_RESPONSE_SCHEMA,
    mode: 'target-worker-response-to-source-intake-v0',
    status: respondedTargets.length === activeTargets.length && activeTargets.length > 0
      ? 'ready'
      : activeTargets.length > 0
        ? 'pending'
        : 'inactive',
    timeSeconds: rounded(timeSeconds, 3),
    sourceIntakeSchema: sourceIntake?.schema || null,
    sourceIntakeStatus: sourceIntake?.status || 'unknown',
    sourceApplyExecutionSequence,
    active: activeTargets.length > 0,
    targetCount: targets.length,
    activeTargetCount: activeTargets.length,
    respondedTargetCount: respondedTargets.length,
    pendingTargetCount: pendingTargets.length,
    totalIntakeThermalDrive: rounded(totalIntakeThermalDrive, 6),
    totalResponseThermalDrive: rounded(totalResponseThermalDrive, 6),
    maxResponseThermalDrive: rounded(maxResponseThermalDrive, 6),
    totalHeatFluxResponseProxy: rounded(totalHeatFluxResponseProxy, 6),
    maxTemperatureK: rounded(maxTemperatureK, 3),
    maxPhaseResponseProxy: rounded(maxPhaseResponseProxy, 6),
    sourceBufferAcknowledgedTargetCount: targets.filter((target) => target.sourceBufferAcknowledged === true).length,
    blockerCount: blockers.length,
    blockers,
    targets,
    validity: {
      status: respondedTargets.length > 0 ? 'interactive-proxy-target-response' : 'pending',
      confidence: 0.1,
      warnings: [
        'Target source response is derived from reduced worker diagnostics after molecular target-source intake.',
        'This acknowledges reduced target response only; scientific conservative mutation still requires unit-aware target buffers and invariant enforcement.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_SOURCE_RESPONSE_SCHEMA,
      sourceIntakeSchema: sourceIntake?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetSourceResponseReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_SOURCE_RESPONSE_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    sourceIntakeSchema: report.sourceIntakeSchema || null,
    sourceIntakeStatus: report.sourceIntakeStatus || 'unknown',
    sourceApplyExecutionSequence: Math.max(0, Math.round(finite(report.sourceApplyExecutionSequence))),
    active: report.active === true,
    targetCount: Math.max(0, Math.round(finite(report.targetCount, report.targets?.length))),
    activeTargetCount: Math.max(0, Math.round(finite(report.activeTargetCount))),
    respondedTargetCount: Math.max(0, Math.round(finite(report.respondedTargetCount))),
    pendingTargetCount: Math.max(0, Math.round(finite(report.pendingTargetCount))),
    totalIntakeThermalDrive: finite(report.totalIntakeThermalDrive),
    totalResponseThermalDrive: finite(report.totalResponseThermalDrive),
    maxResponseThermalDrive: finite(report.maxResponseThermalDrive),
    totalHeatFluxResponseProxy: finite(report.totalHeatFluxResponseProxy),
    maxTemperatureK: finite(report.maxTemperatureK),
    maxPhaseResponseProxy: finite(report.maxPhaseResponseProxy),
    sourceBufferAcknowledgedTargetCount: Math.max(0, Math.round(finite(report.sourceBufferAcknowledgedTargetCount))),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

function createTargetSourceReconciliation(intakeTarget = {}, responseTarget = {}) {
  const targetSolverId = intakeTarget.targetSolverId || responseTarget.targetSolverId || 'unknown';
  const activeIntake = intakeTarget.active === true;
  const responseAcknowledged = responseTarget.responseAcknowledged === true;
  const sequenceAcknowledged = responseTarget.sequenceAcknowledged === true;
  const intakeThermalDrive = Math.max(0, finite(intakeTarget.thermalDrive));
  const responseThermalDrive = Math.max(0, finite(responseTarget.responseThermalDrive));
  const sideBandResponseDriveProxy = Math.max(
    Math.abs(finite(responseTarget.quantumMaterialResponseDriveProxy)),
    responseTarget.sourceBufferAcknowledged === true ? 0.000001 : 0
  );
  const driveResidualProxy = activeIntake && (intakeThermalDrive > 0 || responseThermalDrive > 0)
    ? clamp(Math.abs(responseThermalDrive - intakeThermalDrive) / Math.max(0.001, intakeThermalDrive + responseThermalDrive), 0, 1)
    : 0;
  const unacknowledgedThermalDrive = activeIntake && !responseAcknowledged ? intakeThermalDrive : 0;
  const blockers = uniqueStrings([
    activeIntake ? null : 'inactive-source-intake-target',
    responseTarget.targetSolverId ? null : 'missing-target-source-response-target',
    responseAcknowledged ? null : 'target-source-response-not-acknowledged',
    sequenceAcknowledged ? null : 'target-source-response-sequence-mismatch'
  ]);
  return {
    targetSolverId,
    stateKey: intakeTarget.stateKey || responseTarget.stateKey || null,
    layer: intakeTarget.layer || responseTarget.layer || 'unknown',
    activeIntake,
    responseAcknowledged,
    sequenceAcknowledged,
    reconciled: activeIntake && responseAcknowledged && sequenceAcknowledged,
    status: activeIntake && responseAcknowledged && sequenceAcknowledged
      ? 'source-response-reconciled'
      : activeIntake
        ? 'source-response-pending'
        : 'source-response-inactive',
    sourceApplyExecutionSequence: Math.max(0, Math.round(finite(
      intakeTarget.sourceApplyExecutionSequence,
      responseTarget.sourceApplyExecutionSequence
    ))),
    targetResponseSequence: Math.max(0, Math.round(finite(responseTarget.targetResponseSequence))),
    intakeThermalDrive: rounded(intakeThermalDrive, 6),
    responseThermalDrive: rounded(responseThermalDrive, 6),
    driveResidualProxy: rounded(driveResidualProxy, 6),
    unacknowledgedThermalDrive: rounded(unacknowledgedThermalDrive, 6),
    intakeHeatRateWProxy: rounded(intakeTarget.heatRateWProxy, 9),
    responseHeatFluxProxy: rounded(responseTarget.heatFluxResponseProxy, 6),
    responseTemperatureK: rounded(responseTarget.temperatureK, 3),
    phaseResponseProxy: rounded(responseTarget.phaseResponseProxy, 6),
    quantumMaterialResponseDriveProxy: rounded(sideBandResponseDriveProxy, 9),
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularTargetSourceReconciliationReport({
  sourceIntake = null,
  targetResponse = null,
  timeSeconds = 0,
  residualToleranceProxy = 0.2
} = {}) {
  const hasIntakeSchema = sourceIntake?.schema === MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA;
  const hasResponseSchema = targetResponse?.schema === MOLECULAR_TARGET_SOURCE_RESPONSE_SCHEMA;
  const responseTargetsBySolver = new Map((Array.isArray(targetResponse?.targets) ? targetResponse.targets : [])
    .map((target) => [target.targetSolverId || 'unknown', target]));
  const targets = (Array.isArray(sourceIntake?.targets) ? sourceIntake.targets : [])
    .map((target) => createTargetSourceReconciliation(
      target,
      responseTargetsBySolver.get(target.targetSolverId || 'unknown') || {}
    ));
  const activeTargets = targets.filter((target) => target.activeIntake);
  const reconciledTargets = activeTargets.filter((target) => target.reconciled);
  const pendingTargets = activeTargets.filter((target) => !target.reconciled);
  const sequenceMismatchCount = activeTargets.filter((target) => !target.sequenceAcknowledged).length;
  const totalIntakeThermalDrive = activeTargets.reduce((sum, target) => sum + finite(target.intakeThermalDrive), 0);
  const totalResponseThermalDrive = activeTargets.reduce((sum, target) => sum + finite(target.responseThermalDrive), 0);
  const unacknowledgedThermalDrive = pendingTargets.reduce((sum, target) => sum + finite(target.unacknowledgedThermalDrive), 0);
  const totalHeatRateWProxy = activeTargets.reduce((sum, target) => sum + finite(target.intakeHeatRateWProxy), 0);
  const totalHeatFluxResponseProxy = activeTargets.reduce((sum, target) => sum + finite(target.responseHeatFluxProxy), 0);
  const maxDriveResidualProxy = activeTargets.reduce((max, target) => (
    Math.max(max, finite(target.driveResidualProxy))
  ), 0);
  const pendingFraction = activeTargets.length > 0 ? pendingTargets.length / activeTargets.length : 0;
  const unacknowledgedFraction = totalIntakeThermalDrive > 0
    ? unacknowledgedThermalDrive / totalIntakeThermalDrive
    : 0;
  const reconciliationResidualProxy = clamp(
    pendingFraction * 0.65
      + unacknowledgedFraction * 0.25
      + maxDriveResidualProxy * 0.1,
    0,
    1
  );
  const residualTolerance = Math.max(0, finite(residualToleranceProxy, 0.2));
  const residualPassed = reconciliationResidualProxy <= residualTolerance;
  const blockers = uniqueStrings([
    hasIntakeSchema ? null : 'missing-target-source-intake-report',
    hasResponseSchema ? null : 'missing-target-source-response-report',
    activeTargets.length > 0 ? null : 'no-active-source-intake-targets',
    pendingTargets.length === 0 ? null : 'target-source-response-pending',
    sequenceMismatchCount === 0 ? null : 'target-source-response-sequence-mismatch',
    residualPassed ? null : 'target-source-reconciliation-residual-exceeded'
  ]);
  return {
    schema: MOLECULAR_TARGET_SOURCE_RECONCILIATION_SCHEMA,
    mode: 'target-source-intake-response-reconciliation-v0',
    status: activeTargets.length === 0
      ? 'inactive'
      : pendingTargets.length === 0 && residualPassed
        ? 'reconciled'
        : 'pending',
    timeSeconds: rounded(timeSeconds, 3),
    sourceIntakeSchema: sourceIntake?.schema || null,
    targetResponseSchema: targetResponse?.schema || null,
    sourceApplyExecutionSequence: Math.max(0, Math.round(finite(
      sourceIntake?.sourceApplyExecutionSequence,
      targetResponse?.sourceApplyExecutionSequence
    ))),
    active: activeTargets.length > 0,
    targetCount: targets.length,
    activeTargetCount: activeTargets.length,
    reconciledTargetCount: reconciledTargets.length,
    pendingTargetCount: pendingTargets.length,
    sequenceMismatchCount,
    totalIntakeThermalDrive: rounded(totalIntakeThermalDrive, 6),
    totalResponseThermalDrive: rounded(totalResponseThermalDrive, 6),
    unacknowledgedThermalDrive: rounded(unacknowledgedThermalDrive, 6),
    totalHeatRateWProxy: rounded(totalHeatRateWProxy, 9),
    totalHeatFluxResponseProxy: rounded(totalHeatFluxResponseProxy, 6),
    maxDriveResidualProxy: rounded(maxDriveResidualProxy, 6),
    reconciliationResidualProxy: rounded(reconciliationResidualProxy, 6),
    residualToleranceProxy: rounded(residualTolerance, 6),
    residualPassed,
    blockerCount: blockers.length,
    blockers,
    targets,
    validity: {
      status: activeTargets.length > 0 ? 'interactive-proxy-source-response-reconciliation' : 'inactive',
      confidence: 0.1,
      warnings: [
        'Target source reconciliation compares reduced source intake against reduced worker acknowledgement telemetry.',
        'It is an observability gate before conservative source-buffer mutation, not a scientific conservation proof.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_SOURCE_RECONCILIATION_SCHEMA,
      sourceIntakeSchema: sourceIntake?.schema || null,
      targetResponseSchema: targetResponse?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetSourceReconciliationReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_SOURCE_RECONCILIATION_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    sourceIntakeSchema: report.sourceIntakeSchema || null,
    targetResponseSchema: report.targetResponseSchema || null,
    sourceApplyExecutionSequence: Math.max(0, Math.round(finite(report.sourceApplyExecutionSequence))),
    active: report.active === true,
    targetCount: Math.max(0, Math.round(finite(report.targetCount, report.targets?.length))),
    activeTargetCount: Math.max(0, Math.round(finite(report.activeTargetCount))),
    reconciledTargetCount: Math.max(0, Math.round(finite(report.reconciledTargetCount))),
    pendingTargetCount: Math.max(0, Math.round(finite(report.pendingTargetCount))),
    sequenceMismatchCount: Math.max(0, Math.round(finite(report.sequenceMismatchCount))),
    totalIntakeThermalDrive: finite(report.totalIntakeThermalDrive),
    totalResponseThermalDrive: finite(report.totalResponseThermalDrive),
    unacknowledgedThermalDrive: finite(report.unacknowledgedThermalDrive),
    totalHeatRateWProxy: finite(report.totalHeatRateWProxy),
    totalHeatFluxResponseProxy: finite(report.totalHeatFluxResponseProxy),
    maxDriveResidualProxy: finite(report.maxDriveResidualProxy),
    reconciliationResidualProxy: finite(report.reconciliationResidualProxy),
    residualToleranceProxy: finite(report.residualToleranceProxy),
    residualPassed: report.residualPassed === true,
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

const MOLECULAR_SOURCE_BUFFER_LAYOUT = [
  {
    field: 'heatRateWProxy',
    unit: 'W-proxy',
    dimensions: 'M L^2 T^-3',
    role: 'energy-source-rate'
  },
  {
    field: 'speciesRateCountPerSProxy',
    unit: 'count/s-proxy',
    dimensions: 'T^-1',
    role: 'species-source-rate'
  },
  {
    field: 'temperatureDeltaKProxy',
    unit: 'K-proxy',
    dimensions: 'Theta',
    role: 'thermal-state-delta'
  },
  {
    field: 'phaseDriveDeltaProxy',
    unit: '1',
    dimensions: '1',
    role: 'phase-source-drive'
  },
  {
    field: 'reactionDriveDeltaProxy',
    unit: '1',
    dimensions: '1',
    role: 'reaction-source-drive'
  },
  {
    field: 'radiativeHeatFluxBoostProxy',
    unit: 'W/m^2-proxy',
    dimensions: 'M T^-3',
    role: 'surface-heat-flux-source'
  },
  {
    field: 'thermalDrive',
    unit: '1',
    dimensions: '1',
    role: 'scheduler-drive'
  },
  {
    field: 'reconciliationResidualProxy',
    unit: '1',
    dimensions: '1',
    role: 'acknowledgement-residual'
  }
];

function makeSourceBufferVector(target = {}, reconciliationTarget = {}) {
  return [
    rounded(target.heatRateWProxy, 9),
    rounded(target.speciesRateCountPerSProxy, 6),
    rounded(target.temperatureDeltaKProxy, 6),
    rounded(target.phaseDriveDeltaProxy, 9),
    rounded(target.reactionDriveDeltaProxy, 6),
    rounded(target.radiativeHeatFluxBoostProxy, 6),
    rounded(target.thermalDrive, 6),
    rounded(reconciliationTarget.driveResidualProxy, 6)
  ];
}

function createConservativeSourceBufferTarget(intakeTarget = {}, reconciliationTarget = {}, {
  sourceApplyExecutionSequence = 0,
  quantumMaterialPropertySource = null,
  quantumMaterialStatisticalSource = null,
  quantumMaterialResponseDerivativeSource = null
} = {}) {
  const activeIntake = intakeTarget.active === true;
  const reconciled = reconciliationTarget.reconciled === true;
  const responseAcknowledged = reconciliationTarget.responseAcknowledged === true;
  const sequenceAcknowledged = reconciliationTarget.sequenceAcknowledged === true;
  const sourceVectorF32 = makeSourceBufferVector(intakeTarget, reconciliationTarget);
  const materialPropertySource = summarizeQuantumMaterialPropertySource({
    molecular: quantumMaterialPropertySource || {}
  });
  const materialStatisticalSource = summarizeQuantumMaterialStatisticalSource({
    source: quantumMaterialStatisticalSource || {},
    molecular: quantumMaterialStatisticalSource || {}
  });
  const materialResponseDerivativeSource = summarizeQuantumMaterialResponseDerivativeSource({
    molecular: quantumMaterialResponseDerivativeSource || {}
  });
  const nonzeroSource = sourceVectorF32.slice(0, 7).some((value) => Math.abs(finite(value)) > 0)
    || materialPropertySource.active === true
    || materialStatisticalSource.active === true
    || materialResponseDerivativeSource.active === true;
  const dispatchable = activeIntake && nonzeroSource;
  const blockers = uniqueStrings([
    activeIntake ? null : 'inactive-source-intake-target',
    nonzeroSource ? null : 'empty-source-vector',
    responseAcknowledged ? null : 'target-response-not-yet-acknowledged',
    sequenceAcknowledged ? null : 'target-response-sequence-pending',
    reconciled ? null : 'target-source-reconciliation-pending'
  ]);
  return {
    targetSolverId: intakeTarget.targetSolverId || reconciliationTarget.targetSolverId || 'unknown',
    stateKey: intakeTarget.stateKey || reconciliationTarget.stateKey || null,
    layer: intakeTarget.layer || reconciliationTarget.layer || 'unknown',
    active: activeIntake,
    dispatchable,
    reconciled,
    responseAcknowledged,
    sequenceAcknowledged,
    status: dispatchable
      ? reconciled
        ? 'buffer-ready-reconciled'
        : 'buffer-ready-provisional'
      : 'buffer-inactive',
    sourceApplyExecutionSequence: Math.max(0, Math.round(finite(
      intakeTarget.sourceApplyExecutionSequence,
      sourceApplyExecutionSequence
    ))),
    operationCount: Math.max(0, Math.round(finite(intakeTarget.operationCount))),
    appliedOperationCount: Math.max(0, Math.round(finite(intakeTarget.appliedOperationCount))),
    stateWriteSetCount: Math.max(0, Math.round(finite(intakeTarget.stateWriteSetCount))),
    heatRateWProxy: rounded(intakeTarget.heatRateWProxy, 9),
    speciesRateCountPerSProxy: rounded(intakeTarget.speciesRateCountPerSProxy, 6),
    temperatureDeltaKProxy: rounded(intakeTarget.temperatureDeltaKProxy, 6),
    phaseDriveDeltaProxy: rounded(intakeTarget.phaseDriveDeltaProxy, 9),
    reactionDriveDeltaProxy: rounded(intakeTarget.reactionDriveDeltaProxy, 6),
    radiativeHeatFluxBoostProxy: rounded(intakeTarget.radiativeHeatFluxBoostProxy, 6),
    thermalDrive: rounded(intakeTarget.thermalDrive, 6),
    quantumMaterialPropertySource: materialPropertySource,
    quantumMaterialPropertyThermalFluxBoostProxy: rounded(materialPropertySource.thermalFluxBoostProxy, 6),
    quantumMaterialPropertyPhaseDriveBoostProxy: rounded(materialPropertySource.phaseDriveBoostProxy, 9),
    quantumMaterialPropertyElectricalDrive: rounded(materialPropertySource.electricalDrive, 9),
    quantumMaterialPropertyOpticalHeatingDrive: rounded(materialPropertySource.opticalHeatingDrive, 9),
    quantumMaterialPropertyMechanicalStiffnessDrive: rounded(materialPropertySource.mechanicalStiffnessDrive, 9),
    quantumMaterialPropertyDampingScale: rounded(materialPropertySource.materialDampingScale, 6),
    quantumMaterialStatisticalSource: materialStatisticalSource,
    quantumMaterialStatisticalActive: materialStatisticalSource.active === true,
    quantumMaterialStatisticalSourceEquationSchema: materialStatisticalSource.sourceEquationSchema,
    quantumMaterialStatisticalSourceChannelCount: materialStatisticalSource.channelCount,
    quantumMaterialStatisticalPressureDriveProxy: rounded(materialStatisticalSource.pressureDriveProxy, 9),
    quantumMaterialStatisticalOpacityDriveProxy: rounded(materialStatisticalSource.opacityDriveProxy, 9),
    quantumMaterialStatisticalIonizationDriveProxy: rounded(materialStatisticalSource.ionizationDriveProxy, 9),
    quantumMaterialStatisticalDegeneracyPressureDriveProxy: rounded(materialStatisticalSource.degeneracyPressureDriveProxy, 9),
    quantumMaterialStatisticalTemperatureDeltaKProxy: rounded(materialStatisticalSource.temperatureDeltaKProxy, 6),
    quantumMaterialStatisticalChargeDeltaProxy: rounded(materialStatisticalSource.chargeDeltaProxy, 9),
    quantumMaterialStatisticalThermalDampingScale: rounded(materialStatisticalSource.thermalDampingScale, 6),
    quantumMaterialResponseDerivativeSource: materialResponseDerivativeSource,
    quantumMaterialResponseDerivativeActive: materialResponseDerivativeSource.active === true,
    quantumMaterialResponseDerivativeTemperatureDrive: rounded(materialResponseDerivativeSource.temperatureDrive, 9),
    quantumMaterialResponseDerivativePressureDrive: rounded(materialResponseDerivativeSource.pressureDrive, 9),
    quantumMaterialResponseDerivativeFieldDrive: rounded(materialResponseDerivativeSource.fieldDrive, 9),
    quantumMaterialResponseDerivativeRadiationDrive: rounded(materialResponseDerivativeSource.radiationDrive, 9),
    quantumMaterialResponseDerivativeThermalFluxBoostProxy: rounded(materialResponseDerivativeSource.thermalFluxDerivativeBoostProxy, 6),
    quantumMaterialResponseDerivativePhaseDriveBoostProxy: rounded(materialResponseDerivativeSource.phaseDerivativeDriveBoostProxy, 9),
    quantumMaterialResponseDerivativeElectricalDrive: rounded(materialResponseDerivativeSource.electricalDerivativeDrive, 9),
    quantumMaterialResponseDerivativeMechanicalDrive: rounded(materialResponseDerivativeSource.mechanicalDerivativeDrive, 9),
    quantumMaterialResponseDerivativeOpticalDrive: rounded(materialResponseDerivativeSource.opticalDerivativeDrive, 9),
    quantumMaterialResponseDerivativeDampingScale: rounded(materialResponseDerivativeSource.materialDerivativeDampingScale, 6),
    reconciliationResidualProxy: rounded(reconciliationTarget.driveResidualProxy, 6),
    unacknowledgedThermalDrive: rounded(reconciliationTarget.unacknowledgedThermalDrive, 6),
    sourceVectorF32,
    fieldDeltas: { ...(intakeTarget.fieldDeltas || {}) },
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularConservativeSourceBufferReport({
  sourceEquation = null,
  sourceIntake = null,
  targetReconciliation = null,
  timeSeconds = 0
} = {}) {
  const hasSourceEquationSchema = sourceEquation?.schema === MOLECULAR_SOURCE_EQUATION_SCHEMA;
  const hasIntakeSchema = sourceIntake?.schema === MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA;
  const hasReconciliationSchema = targetReconciliation?.schema === MOLECULAR_TARGET_SOURCE_RECONCILIATION_SCHEMA;
  const sourceEquationSummary = summarizeMolecularSourceEquationReport(sourceEquation) || {};
  const quantumMaterialPropertySource = summarizeQuantumMaterialPropertySource({
    molecular: sourceEquation?.terms?.material?.quantumMaterialPropertySource
      || sourceEquationSummary.quantumMaterialPropertySource
      || {}
  });
  const quantumMaterialStatisticalSource = summarizeQuantumMaterialStatisticalSource({
    source: {
      ...(sourceEquationSummary.quantumMaterialStatisticalSource || {}),
      ...(sourceEquation?.terms?.material?.quantumMaterialStatisticalSource || {}),
      sourceEquationSchema: sourceEquationSummary.quantumMaterialStatisticalSourceEquationSchema
        || sourceEquation?.terms?.material?.statisticalSourceEquationSchema
        || sourceEquationSummary.quantumMaterialStatisticalSource?.sourceEquationSchema,
      channelCount: sourceEquationSummary.quantumMaterialStatisticalSourceChannelCount,
      pressureDriveProxy: sourceEquationSummary.quantumMaterialStatisticalPressureDriveProxy,
      opacityDriveProxy: sourceEquationSummary.quantumMaterialStatisticalOpacityDriveProxy,
      ionizationDriveProxy: sourceEquationSummary.quantumMaterialStatisticalIonizationDriveProxy,
      degeneracyPressureDriveProxy: sourceEquationSummary.quantumMaterialStatisticalDegeneracyPressureDriveProxy,
      temperatureDeltaKProxy: sourceEquationSummary.quantumMaterialStatisticalTemperatureDeltaKProxy,
      chargeDeltaProxy: sourceEquationSummary.quantumMaterialStatisticalChargeDeltaProxy,
      thermalDampingScale: sourceEquationSummary.quantumMaterialStatisticalThermalDampingScale
    }
  });
  const quantumMaterialResponseDerivativeSource = summarizeQuantumMaterialResponseDerivativeSource({
    molecular: {
      ...(sourceEquationSummary.quantumMaterialResponseDerivativeSource || {}),
      ...(sourceEquation?.terms?.material?.quantumMaterialResponseDerivativeSource || {}),
      active: sourceEquationSummary.quantumMaterialResponseDerivativeActive,
      temperatureDrive: sourceEquationSummary.quantumMaterialResponseDerivativeTemperatureDrive,
      pressureDrive: sourceEquationSummary.quantumMaterialResponseDerivativePressureDrive,
      fieldDrive: sourceEquationSummary.quantumMaterialResponseDerivativeFieldDrive,
      radiationDrive: sourceEquationSummary.quantumMaterialResponseDerivativeRadiationDrive,
      thermalFluxDerivativeBoostProxy: sourceEquationSummary.quantumMaterialResponseDerivativeThermalFluxBoostProxy,
      phaseDerivativeDriveBoostProxy: sourceEquationSummary.quantumMaterialResponseDerivativePhaseDriveBoostProxy,
      electricalDerivativeDrive: sourceEquationSummary.quantumMaterialResponseDerivativeElectricalDrive,
      mechanicalDerivativeDrive: sourceEquationSummary.quantumMaterialResponseDerivativeMechanicalDrive,
      opticalDerivativeDrive: sourceEquationSummary.quantumMaterialResponseDerivativeOpticalDrive,
      materialDerivativeDampingScale: sourceEquationSummary.quantumMaterialResponseDerivativeDampingScale
    }
  });
  const reconciliationTargetsBySolver = new Map((Array.isArray(targetReconciliation?.targets) ? targetReconciliation.targets : [])
    .map((target) => [target.targetSolverId || 'unknown', target]));
  const targets = (Array.isArray(sourceIntake?.targets) ? sourceIntake.targets : [])
    .map((target) => createConservativeSourceBufferTarget(
      target,
      reconciliationTargetsBySolver.get(target.targetSolverId || 'unknown') || {},
      {
        sourceApplyExecutionSequence: sourceIntake?.sourceApplyExecutionSequence,
        quantumMaterialPropertySource,
        quantumMaterialStatisticalSource,
        quantumMaterialResponseDerivativeSource
      }
    ));
  const activeTargets = targets.filter((target) => target.active);
  const dispatchableTargets = activeTargets.filter((target) => target.dispatchable);
  const reconciledTargets = activeTargets.filter((target) => target.reconciled);
  const pendingTargets = activeTargets.filter((target) => !target.reconciled);
  const operationCount = targets.reduce((sum, target) => sum + finite(target.operationCount), 0);
  const appliedOperationCount = targets.reduce((sum, target) => sum + finite(target.appliedOperationCount), 0);
  const totalHeatRateWProxy = dispatchableTargets.reduce((sum, target) => sum + finite(target.heatRateWProxy), 0);
  const totalSpeciesRateCountPerSProxy = dispatchableTargets.reduce((sum, target) => sum + finite(target.speciesRateCountPerSProxy), 0);
  const maxTemperatureDeltaKProxy = dispatchableTargets.reduce((max, target) => (
    Math.max(max, Math.abs(finite(target.temperatureDeltaKProxy)))
  ), 0);
  const maxThermalDrive = dispatchableTargets.reduce((max, target) => (
    Math.max(max, finite(target.thermalDrive))
  ), 0);
  const maxReconciliationResidualProxy = activeTargets.reduce((max, target) => (
    Math.max(max, finite(target.reconciliationResidualProxy))
  ), 0);
  const unacknowledgedThermalDrive = activeTargets.reduce((sum, target) => (
    sum + finite(target.unacknowledgedThermalDrive)
  ), 0);
  const expectedHeatRateWProxy = finite(
    sourceEquationSummary.resolvedConsumerRateWProxy,
    sourceIntake?.totalHeatRateWProxy ?? totalHeatRateWProxy
  );
  const expectedSpeciesRateCountPerSProxy = finite(
    sourceEquationSummary.resolvedConsumerRateCountPerSProxy,
    sourceIntake?.totalSpeciesRateCountPerSProxy ?? totalSpeciesRateCountPerSProxy
  );
  const heatRateResidualWProxy = expectedHeatRateWProxy - totalHeatRateWProxy;
  const speciesRateResidualCountPerSProxy = Math.max(0, expectedSpeciesRateCountPerSProxy - totalSpeciesRateCountPerSProxy);
  const sourceBufferResidualProxy = clamp(
    Math.abs(heatRateResidualWProxy) * 2
      + speciesRateResidualCountPerSProxy * 0.001
      + maxReconciliationResidualProxy * 0.35
      + (dispatchableTargets.length === activeTargets.length ? 0 : 0.2),
    0,
    1
  );
  const blockers = uniqueStrings([
    hasSourceEquationSchema ? null : 'missing-source-equation-report',
    hasIntakeSchema ? null : 'missing-target-source-intake-report',
    hasReconciliationSchema ? null : 'missing-target-source-reconciliation-report',
    activeTargets.length > 0 ? null : 'no-active-source-buffer-targets',
    dispatchableTargets.length === activeTargets.length ? null : 'source-buffer-targets-not-dispatchable'
  ]);
  const status = activeTargets.length === 0
    ? 'inactive'
    : pendingTargets.length === 0
      ? 'ready-reconciled'
      : 'ready-provisional';

  return {
    schema: MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA,
    mode: 'unit-aware-target-source-buffer-v0',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    sourceEquationSchema: sourceEquation?.schema || null,
    sourceIntakeSchema: sourceIntake?.schema || null,
    targetReconciliationSchema: targetReconciliation?.schema || null,
    sourceApplyExecutionSequence: Math.max(0, Math.round(finite(sourceIntake?.sourceApplyExecutionSequence))),
    active: activeTargets.length > 0,
    targetCount: targets.length,
    activeTargetCount: activeTargets.length,
    dispatchableTargetCount: dispatchableTargets.length,
    reconciledTargetCount: reconciledTargets.length,
    pendingTargetCount: pendingTargets.length,
    operationCount,
    appliedOperationCount,
    sourceTermCount: dispatchableTargets.length * MOLECULAR_SOURCE_BUFFER_LAYOUT.length,
    bufferStrideFloats: MOLECULAR_SOURCE_BUFFER_LAYOUT.length,
    totalHeatRateWProxy: rounded(totalHeatRateWProxy, 9),
    totalSpeciesRateCountPerSProxy: rounded(totalSpeciesRateCountPerSProxy, 6),
    expectedHeatRateWProxy: rounded(expectedHeatRateWProxy, 9),
    expectedSpeciesRateCountPerSProxy: rounded(expectedSpeciesRateCountPerSProxy, 6),
    heatRateResidualWProxy: rounded(heatRateResidualWProxy, 9),
    speciesRateResidualCountPerSProxy: rounded(speciesRateResidualCountPerSProxy, 6),
    maxTemperatureDeltaKProxy: rounded(maxTemperatureDeltaKProxy, 6),
    maxThermalDrive: rounded(maxThermalDrive, 6),
    quantumMaterialPropertyActive: quantumMaterialPropertySource.active === true,
    quantumMaterialPropertySource,
    quantumMaterialPropertyThermalFluxBoostProxy: rounded(quantumMaterialPropertySource.thermalFluxBoostProxy, 6),
    quantumMaterialPropertyPhaseDriveBoostProxy: rounded(quantumMaterialPropertySource.phaseDriveBoostProxy, 9),
    quantumMaterialPropertyElectricalDrive: rounded(quantumMaterialPropertySource.electricalDrive, 9),
    quantumMaterialPropertyOpticalHeatingDrive: rounded(quantumMaterialPropertySource.opticalHeatingDrive, 9),
    quantumMaterialPropertyMechanicalStiffnessDrive: rounded(quantumMaterialPropertySource.mechanicalStiffnessDrive, 9),
    quantumMaterialPropertyDampingScale: rounded(quantumMaterialPropertySource.materialDampingScale, 6),
    quantumMaterialStatisticalActive: quantumMaterialStatisticalSource.active === true,
    quantumMaterialStatisticalSource,
    quantumMaterialStatisticalSourceEquationSchema: quantumMaterialStatisticalSource.sourceEquationSchema,
    quantumMaterialStatisticalSourceChannelCount: quantumMaterialStatisticalSource.channelCount,
    quantumMaterialStatisticalPressureDriveProxy: rounded(quantumMaterialStatisticalSource.pressureDriveProxy, 9),
    quantumMaterialStatisticalOpacityDriveProxy: rounded(quantumMaterialStatisticalSource.opacityDriveProxy, 9),
    quantumMaterialStatisticalIonizationDriveProxy: rounded(quantumMaterialStatisticalSource.ionizationDriveProxy, 9),
    quantumMaterialStatisticalDegeneracyPressureDriveProxy: rounded(quantumMaterialStatisticalSource.degeneracyPressureDriveProxy, 9),
    quantumMaterialStatisticalTemperatureDeltaKProxy: rounded(quantumMaterialStatisticalSource.temperatureDeltaKProxy, 6),
    quantumMaterialStatisticalChargeDeltaProxy: rounded(quantumMaterialStatisticalSource.chargeDeltaProxy, 9),
    quantumMaterialStatisticalThermalDampingScale: rounded(quantumMaterialStatisticalSource.thermalDampingScale, 6),
    quantumMaterialResponseDerivativeActive: quantumMaterialResponseDerivativeSource.active === true,
    quantumMaterialResponseDerivativeSource,
    quantumMaterialResponseDerivativeTemperatureDrive: rounded(quantumMaterialResponseDerivativeSource.temperatureDrive, 9),
    quantumMaterialResponseDerivativePressureDrive: rounded(quantumMaterialResponseDerivativeSource.pressureDrive, 9),
    quantumMaterialResponseDerivativeFieldDrive: rounded(quantumMaterialResponseDerivativeSource.fieldDrive, 9),
    quantumMaterialResponseDerivativeRadiationDrive: rounded(quantumMaterialResponseDerivativeSource.radiationDrive, 9),
    quantumMaterialResponseDerivativeThermalFluxBoostProxy: rounded(quantumMaterialResponseDerivativeSource.thermalFluxDerivativeBoostProxy, 6),
    quantumMaterialResponseDerivativePhaseDriveBoostProxy: rounded(quantumMaterialResponseDerivativeSource.phaseDerivativeDriveBoostProxy, 9),
    quantumMaterialResponseDerivativeElectricalDrive: rounded(quantumMaterialResponseDerivativeSource.electricalDerivativeDrive, 9),
    quantumMaterialResponseDerivativeMechanicalDrive: rounded(quantumMaterialResponseDerivativeSource.mechanicalDerivativeDrive, 9),
    quantumMaterialResponseDerivativeOpticalDrive: rounded(quantumMaterialResponseDerivativeSource.opticalDerivativeDrive, 9),
    quantumMaterialResponseDerivativeDampingScale: rounded(quantumMaterialResponseDerivativeSource.materialDerivativeDampingScale, 6),
    maxReconciliationResidualProxy: rounded(maxReconciliationResidualProxy, 6),
    unacknowledgedThermalDrive: rounded(unacknowledgedThermalDrive, 6),
    sourceBufferResidualProxy: rounded(sourceBufferResidualProxy, 6),
    blockerCount: blockers.length,
    blockers,
    layout: MOLECULAR_SOURCE_BUFFER_LAYOUT.map((entry, index) => ({ index, ...entry })),
    targets,
    units: {
      buffer: { unit: 'mixed-source-vector', dimensions: 'mixed' },
      heatRate: { unit: 'W-proxy', dimensions: 'M L^2 T^-3' },
      speciesRate: { unit: 'count/s-proxy', dimensions: 'T^-1' },
      temperatureDelta: { unit: 'K-proxy', dimensions: 'Theta' },
      heatFlux: { unit: 'W/m^2-proxy', dimensions: 'M T^-3' },
      drive: { unit: '1', dimensions: '1' }
    },
    validity: {
      status: 'interactive-proxy-source-buffer',
      confidence: 0.11,
      warnings: [
        'Conservative source buffer is unit-labeled and worker-addressable, but values are still reduced proxy source terms.',
        'The current demo consumes this as source input metadata; scientific mode still needs calibrated buffer mutation and invariant enforcement.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA,
      sourceEquationSchema: sourceEquation?.schema || null,
      sourceIntakeSchema: sourceIntake?.schema || null,
      targetReconciliationSchema: targetReconciliation?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularConservativeSourceBufferReport(report = null) {
  if (report?.schema !== MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    sourceEquationSchema: report.sourceEquationSchema || null,
    sourceIntakeSchema: report.sourceIntakeSchema || null,
    targetReconciliationSchema: report.targetReconciliationSchema || null,
    sourceApplyExecutionSequence: Math.max(0, Math.round(finite(report.sourceApplyExecutionSequence))),
    active: report.active === true,
    targetCount: Math.max(0, Math.round(finite(report.targetCount, report.targets?.length))),
    activeTargetCount: Math.max(0, Math.round(finite(report.activeTargetCount))),
    dispatchableTargetCount: Math.max(0, Math.round(finite(report.dispatchableTargetCount))),
    reconciledTargetCount: Math.max(0, Math.round(finite(report.reconciledTargetCount))),
    pendingTargetCount: Math.max(0, Math.round(finite(report.pendingTargetCount))),
    operationCount: Math.max(0, Math.round(finite(report.operationCount))),
    appliedOperationCount: Math.max(0, Math.round(finite(report.appliedOperationCount))),
    sourceTermCount: Math.max(0, Math.round(finite(report.sourceTermCount))),
    bufferStrideFloats: Math.max(0, Math.round(finite(report.bufferStrideFloats))),
    totalHeatRateWProxy: finite(report.totalHeatRateWProxy),
    totalSpeciesRateCountPerSProxy: finite(report.totalSpeciesRateCountPerSProxy),
    expectedHeatRateWProxy: finite(report.expectedHeatRateWProxy),
    expectedSpeciesRateCountPerSProxy: finite(report.expectedSpeciesRateCountPerSProxy),
    heatRateResidualWProxy: finite(report.heatRateResidualWProxy),
    speciesRateResidualCountPerSProxy: finite(report.speciesRateResidualCountPerSProxy),
    maxTemperatureDeltaKProxy: finite(report.maxTemperatureDeltaKProxy),
    maxThermalDrive: finite(report.maxThermalDrive),
    quantumMaterialPropertyActive: report.quantumMaterialPropertyActive === true
      || report.quantumMaterialPropertySource?.active === true,
    quantumMaterialPropertySource: report.quantumMaterialPropertySource || null,
    quantumMaterialPropertyThermalFluxBoostProxy: finite(report.quantumMaterialPropertyThermalFluxBoostProxy),
    quantumMaterialPropertyPhaseDriveBoostProxy: finite(report.quantumMaterialPropertyPhaseDriveBoostProxy),
    quantumMaterialPropertyElectricalDrive: finite(report.quantumMaterialPropertyElectricalDrive),
    quantumMaterialPropertyOpticalHeatingDrive: finite(report.quantumMaterialPropertyOpticalHeatingDrive),
    quantumMaterialPropertyMechanicalStiffnessDrive: finite(report.quantumMaterialPropertyMechanicalStiffnessDrive),
    quantumMaterialPropertyDampingScale: finite(report.quantumMaterialPropertyDampingScale),
    quantumMaterialStatisticalActive: report.quantumMaterialStatisticalActive === true
      || report.quantumMaterialStatisticalSource?.active === true,
    quantumMaterialStatisticalSource: report.quantumMaterialStatisticalSource || null,
    quantumMaterialStatisticalSourceEquationSchema: report.quantumMaterialStatisticalSourceEquationSchema
      || report.quantumMaterialStatisticalSource?.sourceEquationSchema
      || null,
    quantumMaterialStatisticalSourceChannelCount: Math.max(0, Math.round(finite(
      report.quantumMaterialStatisticalSourceChannelCount,
      report.quantumMaterialStatisticalSource?.channelCount
    ))),
    quantumMaterialStatisticalPressureDriveProxy: finite(report.quantumMaterialStatisticalPressureDriveProxy, report.quantumMaterialStatisticalSource?.pressureDriveProxy),
    quantumMaterialStatisticalOpacityDriveProxy: finite(report.quantumMaterialStatisticalOpacityDriveProxy, report.quantumMaterialStatisticalSource?.opacityDriveProxy),
    quantumMaterialStatisticalIonizationDriveProxy: finite(report.quantumMaterialStatisticalIonizationDriveProxy, report.quantumMaterialStatisticalSource?.ionizationDriveProxy),
    quantumMaterialStatisticalDegeneracyPressureDriveProxy: finite(report.quantumMaterialStatisticalDegeneracyPressureDriveProxy, report.quantumMaterialStatisticalSource?.degeneracyPressureDriveProxy),
    quantumMaterialStatisticalTemperatureDeltaKProxy: finite(report.quantumMaterialStatisticalTemperatureDeltaKProxy, report.quantumMaterialStatisticalSource?.temperatureDeltaKProxy),
    quantumMaterialStatisticalChargeDeltaProxy: finite(report.quantumMaterialStatisticalChargeDeltaProxy, report.quantumMaterialStatisticalSource?.chargeDeltaProxy),
    quantumMaterialStatisticalThermalDampingScale: finite(report.quantumMaterialStatisticalThermalDampingScale, report.quantumMaterialStatisticalSource?.thermalDampingScale ?? 1),
    quantumMaterialResponseDerivativeActive: report.quantumMaterialResponseDerivativeActive === true
      || report.quantumMaterialResponseDerivativeSource?.active === true,
    quantumMaterialResponseDerivativeSource: report.quantumMaterialResponseDerivativeSource || null,
    quantumMaterialResponseDerivativeTemperatureDrive: finite(report.quantumMaterialResponseDerivativeTemperatureDrive, report.quantumMaterialResponseDerivativeSource?.temperatureDrive),
    quantumMaterialResponseDerivativePressureDrive: finite(report.quantumMaterialResponseDerivativePressureDrive, report.quantumMaterialResponseDerivativeSource?.pressureDrive),
    quantumMaterialResponseDerivativeFieldDrive: finite(report.quantumMaterialResponseDerivativeFieldDrive, report.quantumMaterialResponseDerivativeSource?.fieldDrive),
    quantumMaterialResponseDerivativeRadiationDrive: finite(report.quantumMaterialResponseDerivativeRadiationDrive, report.quantumMaterialResponseDerivativeSource?.radiationDrive),
    quantumMaterialResponseDerivativeThermalFluxBoostProxy: finite(report.quantumMaterialResponseDerivativeThermalFluxBoostProxy, report.quantumMaterialResponseDerivativeSource?.thermalFluxDerivativeBoostProxy),
    quantumMaterialResponseDerivativePhaseDriveBoostProxy: finite(report.quantumMaterialResponseDerivativePhaseDriveBoostProxy, report.quantumMaterialResponseDerivativeSource?.phaseDerivativeDriveBoostProxy),
    quantumMaterialResponseDerivativeElectricalDrive: finite(report.quantumMaterialResponseDerivativeElectricalDrive, report.quantumMaterialResponseDerivativeSource?.electricalDerivativeDrive),
    quantumMaterialResponseDerivativeMechanicalDrive: finite(report.quantumMaterialResponseDerivativeMechanicalDrive, report.quantumMaterialResponseDerivativeSource?.mechanicalDerivativeDrive),
    quantumMaterialResponseDerivativeOpticalDrive: finite(report.quantumMaterialResponseDerivativeOpticalDrive, report.quantumMaterialResponseDerivativeSource?.opticalDerivativeDrive),
    quantumMaterialResponseDerivativeDampingScale: finite(report.quantumMaterialResponseDerivativeDampingScale, report.quantumMaterialResponseDerivativeSource?.materialDerivativeDampingScale ?? 1),
    maxReconciliationResidualProxy: finite(report.maxReconciliationResidualProxy),
    unacknowledgedThermalDrive: finite(report.unacknowledgedThermalDrive),
    sourceBufferResidualProxy: finite(report.sourceBufferResidualProxy),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

function summarizeSourceBufferTerms(sourceBuffer = {}) {
  const sourceVector = Array.isArray(sourceBuffer?.sourceVectorF32)
    ? sourceBuffer.sourceVectorF32.map((value) => finite(value))
    : [];
  return MOLECULAR_SOURCE_BUFFER_LAYOUT.map((entry, index) => ({
    index,
    field: entry.field,
    unit: entry.unit,
    dimensions: entry.dimensions,
    role: entry.role,
    value: rounded(sourceVector[index] ?? sourceBuffer?.[entry.field], entry.unit === '1' ? 6 : 9),
    nonzero: Math.abs(finite(sourceVector[index] ?? sourceBuffer?.[entry.field])) > 1e-12
  }));
}

function createSourceBufferFieldApplication(field = {}) {
  const before = finite(field.before);
  const after = finite(field.after, before);
  const sourceValue = finite(field.sourceValue);
  return {
    field: field.field || 'unknown',
    unit: field.unit || '1',
    dimensions: field.dimensions || '1',
    sourceTerm: field.sourceTerm || null,
    sourceValue: rounded(sourceValue, field.unit === '1' ? 6 : 9),
    before: rounded(before, field.unit === '1' ? 6 : 9),
    after: rounded(after, field.unit === '1' ? 6 : 9),
    delta: rounded(after - before, field.unit === '1' ? 6 : 9),
    applied: field.applied !== false && Number.isFinite(before) && Number.isFinite(after)
  };
}

export function createMolecularSourceBufferApplicationReport({
  targetSolverId = 'unknown',
  targetStateKey = null,
  targetLayer = 'unknown',
  targetSequence = null,
  backend = null,
  sourceBuffer = null,
  fields = [],
  timeSeconds = 0
} = {}) {
  const hasSourceBufferSchema = sourceBuffer?.schema === MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA;
  const sourceTerms = summarizeSourceBufferTerms(sourceBuffer);
  const nonzeroSourceTermCount = sourceTerms.filter((term) => term.nonzero).length;
  const fieldApplications = fields.map((field) => createSourceBufferFieldApplication(field));
  const appliedFieldCount = fieldApplications.filter((field) => field.applied).length;
  const finiteFieldDeltaCount = fieldApplications.filter((field) => Number.isFinite(field.delta)).length;
  const nonzeroFieldDeltaCount = fieldApplications.filter((field) => Math.abs(finite(field.delta)) > 1e-12).length;
  const sourceActive = sourceBuffer?.active === true;
  const sourceDispatchable = sourceBuffer?.dispatchable !== false && sourceActive;
  const applied = hasSourceBufferSchema && sourceDispatchable && appliedFieldCount > 0;
  const blockers = uniqueStrings([
    hasSourceBufferSchema ? null : 'missing-conservative-source-buffer',
    sourceActive ? null : 'source-buffer-inactive',
    sourceDispatchable ? null : 'source-buffer-not-dispatchable',
    appliedFieldCount > 0 ? null : 'no-target-fields-recorded'
  ]);
  const maxAbsFieldDeltaProxy = fieldApplications.reduce((max, field) => (
    Math.max(max, Math.abs(finite(field.delta)))
  ), 0);
  const appliedHeatRateWProxy = applied ? finite(sourceBuffer?.heatRateWProxy) : 0;
  const appliedSpeciesRateCountPerSProxy = applied ? finite(sourceBuffer?.speciesRateCountPerSProxy) : 0;
  const appliedTemperatureDeltaKProxy = applied ? finite(sourceBuffer?.temperatureDeltaKProxy) : 0;
  const appliedPhaseDriveDeltaProxy = applied ? finite(sourceBuffer?.phaseDriveDeltaProxy) : 0;
  const appliedReactionDriveDeltaProxy = applied ? finite(sourceBuffer?.reactionDriveDeltaProxy) : 0;
  const appliedRadiativeHeatFluxBoostProxy = applied ? finite(sourceBuffer?.radiativeHeatFluxBoostProxy) : 0;
  const quantumMaterialPropertySource = summarizeQuantumMaterialPropertySource({
    molecular: sourceBuffer?.quantumMaterialPropertySource || {
      active: sourceBuffer?.quantumMaterialPropertyActive,
      thermalFluxBoostProxy: sourceBuffer?.quantumMaterialPropertyThermalFluxBoostProxy,
      phaseDriveBoostProxy: sourceBuffer?.quantumMaterialPropertyPhaseDriveBoostProxy,
      electricalDrive: sourceBuffer?.quantumMaterialPropertyElectricalDrive,
      opticalHeatingDrive: sourceBuffer?.quantumMaterialPropertyOpticalHeatingDrive,
      mechanicalStiffnessDrive: sourceBuffer?.quantumMaterialPropertyMechanicalStiffnessDrive,
      materialDampingScale: sourceBuffer?.quantumMaterialPropertyDampingScale
    }
  });
  const quantumMaterialStatisticalSource = summarizeQuantumMaterialStatisticalSource({
    source: {
      ...(sourceBuffer?.quantumMaterialStatisticalSource || {}),
      active: sourceBuffer?.quantumMaterialStatisticalActive,
      sourceEquationSchema: sourceBuffer?.quantumMaterialStatisticalSourceEquationSchema
        || sourceBuffer?.quantumMaterialStatisticalSource?.sourceEquationSchema,
      channelCount: sourceBuffer?.quantumMaterialStatisticalSourceChannelCount,
      pressureDriveProxy: sourceBuffer?.quantumMaterialStatisticalPressureDriveProxy,
      opacityDriveProxy: sourceBuffer?.quantumMaterialStatisticalOpacityDriveProxy,
      ionizationDriveProxy: sourceBuffer?.quantumMaterialStatisticalIonizationDriveProxy,
      degeneracyPressureDriveProxy: sourceBuffer?.quantumMaterialStatisticalDegeneracyPressureDriveProxy,
      temperatureDeltaKProxy: sourceBuffer?.quantumMaterialStatisticalTemperatureDeltaKProxy,
      chargeDeltaProxy: sourceBuffer?.quantumMaterialStatisticalChargeDeltaProxy,
      thermalDampingScale: sourceBuffer?.quantumMaterialStatisticalThermalDampingScale
    }
  });
  const quantumMaterialResponseDerivativeSource = summarizeQuantumMaterialResponseDerivativeSource({
    molecular: sourceBuffer?.quantumMaterialResponseDerivativeSource || {
      active: sourceBuffer?.quantumMaterialResponseDerivativeActive,
      temperatureDrive: sourceBuffer?.quantumMaterialResponseDerivativeTemperatureDrive,
      pressureDrive: sourceBuffer?.quantumMaterialResponseDerivativePressureDrive,
      fieldDrive: sourceBuffer?.quantumMaterialResponseDerivativeFieldDrive,
      radiationDrive: sourceBuffer?.quantumMaterialResponseDerivativeRadiationDrive,
      thermalFluxDerivativeBoostProxy: sourceBuffer?.quantumMaterialResponseDerivativeThermalFluxBoostProxy,
      phaseDerivativeDriveBoostProxy: sourceBuffer?.quantumMaterialResponseDerivativePhaseDriveBoostProxy,
      electricalDerivativeDrive: sourceBuffer?.quantumMaterialResponseDerivativeElectricalDrive,
      mechanicalDerivativeDrive: sourceBuffer?.quantumMaterialResponseDerivativeMechanicalDrive,
      opticalDerivativeDrive: sourceBuffer?.quantumMaterialResponseDerivativeOpticalDrive,
      materialDerivativeDampingScale: sourceBuffer?.quantumMaterialResponseDerivativeDampingScale
    }
  });
  const applicationResidualProxy = clamp(
    finite(sourceBuffer?.sourceBufferResidualProxy)
      + finite(sourceBuffer?.reconciliationResidualProxy) * 0.25
      + (sourceDispatchable ? 0 : 0.25),
    0,
    1
  );
  const status = !hasSourceBufferSchema
    ? 'missing-source-buffer'
    : !sourceActive
      ? 'source-buffer-inactive'
      : !sourceDispatchable
        ? 'source-buffer-not-dispatchable'
        : applied
          ? 'applied-reduced-proxy'
          : 'no-target-fields-recorded';

  return {
    schema: MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA,
    mode: 'target-worker-reduced-source-buffer-application-v0',
    status,
    applied,
    timeSeconds: rounded(timeSeconds, 3),
    targetSolverId,
    targetStateKey,
    targetLayer,
    targetSequence: targetSequence === null || targetSequence === undefined
      ? null
      : Math.max(0, Math.round(finite(targetSequence))),
    backend: backend || null,
    sourceBufferSchema: sourceBuffer?.schema || null,
    sourceBufferStatus: sourceBuffer?.status || 'unknown',
    sourceApplyExecutionSequence: Math.max(0, Math.round(finite(sourceBuffer?.sourceApplyExecutionSequence))),
    sourceBufferActive: sourceActive,
    sourceBufferDispatchable: sourceDispatchable,
    sourceBufferReconciled: sourceBuffer?.reconciled === true,
    bufferStrideFloats: Math.max(0, Math.round(finite(sourceBuffer?.bufferStrideFloats, sourceTerms.length))),
    sourceTermCount: sourceTerms.length,
    nonzeroSourceTermCount,
    appliedFieldCount,
    finiteFieldDeltaCount,
    nonzeroFieldDeltaCount,
    appliedHeatRateWProxy: rounded(appliedHeatRateWProxy, 9),
    appliedSpeciesRateCountPerSProxy: rounded(appliedSpeciesRateCountPerSProxy, 6),
    appliedTemperatureDeltaKProxy: rounded(appliedTemperatureDeltaKProxy, 6),
    appliedPhaseDriveDeltaProxy: rounded(appliedPhaseDriveDeltaProxy, 9),
    appliedReactionDriveDeltaProxy: rounded(appliedReactionDriveDeltaProxy, 6),
    appliedRadiativeHeatFluxBoostProxy: rounded(appliedRadiativeHeatFluxBoostProxy, 6),
    quantumMaterialPropertySource,
    quantumMaterialPropertyActive: quantumMaterialPropertySource.active === true,
    appliedQuantumMaterialPropertyThermalFluxBoostProxy: rounded(
      applied ? quantumMaterialPropertySource.thermalFluxBoostProxy : 0,
      6
    ),
    appliedQuantumMaterialPropertyPhaseDriveBoostProxy: rounded(
      applied ? quantumMaterialPropertySource.phaseDriveBoostProxy : 0,
      9
    ),
    appliedQuantumMaterialPropertyElectricalDrive: rounded(
      applied ? quantumMaterialPropertySource.electricalDrive : 0,
      9
    ),
    appliedQuantumMaterialPropertyOpticalHeatingDrive: rounded(
      applied ? quantumMaterialPropertySource.opticalHeatingDrive : 0,
      9
    ),
    appliedQuantumMaterialPropertyMechanicalStiffnessDrive: rounded(
      applied ? quantumMaterialPropertySource.mechanicalStiffnessDrive : 0,
      9
    ),
    appliedQuantumMaterialPropertyDampingScale: rounded(
      applied ? quantumMaterialPropertySource.materialDampingScale : 0,
      6
    ),
    quantumMaterialStatisticalSource,
    quantumMaterialStatisticalActive: quantumMaterialStatisticalSource.active === true,
    appliedQuantumMaterialStatisticalSourceChannelCount: applied ? quantumMaterialStatisticalSource.channelCount : 0,
    appliedQuantumMaterialStatisticalPressureDriveProxy: rounded(
      applied ? quantumMaterialStatisticalSource.pressureDriveProxy : 0,
      9
    ),
    appliedQuantumMaterialStatisticalOpacityDriveProxy: rounded(
      applied ? quantumMaterialStatisticalSource.opacityDriveProxy : 0,
      9
    ),
    appliedQuantumMaterialStatisticalIonizationDriveProxy: rounded(
      applied ? quantumMaterialStatisticalSource.ionizationDriveProxy : 0,
      9
    ),
    appliedQuantumMaterialStatisticalDegeneracyPressureDriveProxy: rounded(
      applied ? quantumMaterialStatisticalSource.degeneracyPressureDriveProxy : 0,
      9
    ),
    appliedQuantumMaterialStatisticalTemperatureDeltaKProxy: rounded(
      applied ? quantumMaterialStatisticalSource.temperatureDeltaKProxy : 0,
      6
    ),
    appliedQuantumMaterialStatisticalChargeDeltaProxy: rounded(
      applied ? quantumMaterialStatisticalSource.chargeDeltaProxy : 0,
      9
    ),
    appliedQuantumMaterialStatisticalThermalDampingScale: rounded(
      applied ? quantumMaterialStatisticalSource.thermalDampingScale : 0,
      6
    ),
    quantumMaterialResponseDerivativeSource,
    quantumMaterialResponseDerivativeActive: quantumMaterialResponseDerivativeSource.active === true,
    appliedQuantumMaterialResponseDerivativeTemperatureDrive: rounded(
      applied ? quantumMaterialResponseDerivativeSource.temperatureDrive : 0,
      9
    ),
    appliedQuantumMaterialResponseDerivativePressureDrive: rounded(
      applied ? quantumMaterialResponseDerivativeSource.pressureDrive : 0,
      9
    ),
    appliedQuantumMaterialResponseDerivativeFieldDrive: rounded(
      applied ? quantumMaterialResponseDerivativeSource.fieldDrive : 0,
      9
    ),
    appliedQuantumMaterialResponseDerivativeRadiationDrive: rounded(
      applied ? quantumMaterialResponseDerivativeSource.radiationDrive : 0,
      9
    ),
    appliedQuantumMaterialResponseDerivativeThermalFluxBoostProxy: rounded(
      applied ? quantumMaterialResponseDerivativeSource.thermalFluxDerivativeBoostProxy : 0,
      6
    ),
    appliedQuantumMaterialResponseDerivativePhaseDriveBoostProxy: rounded(
      applied ? quantumMaterialResponseDerivativeSource.phaseDerivativeDriveBoostProxy : 0,
      9
    ),
    appliedQuantumMaterialResponseDerivativeElectricalDrive: rounded(
      applied ? quantumMaterialResponseDerivativeSource.electricalDerivativeDrive : 0,
      9
    ),
    appliedQuantumMaterialResponseDerivativeMechanicalDrive: rounded(
      applied ? quantumMaterialResponseDerivativeSource.mechanicalDerivativeDrive : 0,
      9
    ),
    appliedQuantumMaterialResponseDerivativeOpticalDrive: rounded(
      applied ? quantumMaterialResponseDerivativeSource.opticalDerivativeDrive : 0,
      9
    ),
    appliedQuantumMaterialResponseDerivativeDampingScale: rounded(
      applied ? quantumMaterialResponseDerivativeSource.materialDerivativeDampingScale : 0,
      6
    ),
    thermalDrive: rounded(finite(sourceBuffer?.thermalDrive), 6),
    sourceBufferResidualProxy: rounded(finite(sourceBuffer?.sourceBufferResidualProxy), 6),
    reconciliationResidualProxy: rounded(finite(sourceBuffer?.reconciliationResidualProxy), 6),
    applicationResidualProxy: rounded(applicationResidualProxy, 6),
    maxAbsFieldDeltaProxy: rounded(maxAbsFieldDeltaProxy, 9),
    sourceTerms,
    fields: fieldApplications,
    blockerCount: blockers.length,
    blockers,
    units: {
      heatRate: { unit: 'W-proxy', dimensions: 'M L^2 T^-3' },
      speciesRate: { unit: 'count/s-proxy', dimensions: 'T^-1' },
      temperatureDelta: { unit: 'K-proxy', dimensions: 'Theta' },
      heatFlux: { unit: 'W/m^2-proxy', dimensions: 'M T^-3' },
      drive: { unit: '1', dimensions: '1' }
    },
    validity: {
      status: 'interactive-proxy-application-ledger',
      confidence: 0.12,
      warnings: [
        'This report records target worker consumption of reduced source-buffer terms; it is not a calibrated closed-system mutation ledger.',
        'Scientific mode still needs invariant enforcement against calibrated enthalpy, stoichiometry, charge, and phase accounting.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA,
      sourceBufferSchema: sourceBuffer?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularSourceBufferApplicationReport(report = null) {
  if (report?.schema !== MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    applied: report.applied === true,
    targetSolverId: report.targetSolverId || 'unknown',
    targetStateKey: report.targetStateKey || null,
    targetLayer: report.targetLayer || 'unknown',
    targetSequence: report.targetSequence ?? null,
    sourceBufferSchema: report.sourceBufferSchema || null,
    sourceApplyExecutionSequence: Math.max(0, Math.round(finite(report.sourceApplyExecutionSequence))),
    sourceBufferActive: report.sourceBufferActive === true,
    sourceBufferDispatchable: report.sourceBufferDispatchable === true,
    sourceBufferReconciled: report.sourceBufferReconciled === true,
    bufferStrideFloats: Math.max(0, Math.round(finite(report.bufferStrideFloats))),
    sourceTermCount: Math.max(0, Math.round(finite(report.sourceTermCount))),
    nonzeroSourceTermCount: Math.max(0, Math.round(finite(report.nonzeroSourceTermCount))),
    appliedFieldCount: Math.max(0, Math.round(finite(report.appliedFieldCount))),
    finiteFieldDeltaCount: Math.max(0, Math.round(finite(report.finiteFieldDeltaCount, report.appliedFieldCount))),
    nonzeroFieldDeltaCount: Math.max(0, Math.round(finite(report.nonzeroFieldDeltaCount))),
    appliedHeatRateWProxy: finite(report.appliedHeatRateWProxy),
    appliedSpeciesRateCountPerSProxy: finite(report.appliedSpeciesRateCountPerSProxy),
    appliedTemperatureDeltaKProxy: finite(report.appliedTemperatureDeltaKProxy),
    appliedPhaseDriveDeltaProxy: finite(report.appliedPhaseDriveDeltaProxy),
    appliedReactionDriveDeltaProxy: finite(report.appliedReactionDriveDeltaProxy),
    appliedRadiativeHeatFluxBoostProxy: finite(report.appliedRadiativeHeatFluxBoostProxy),
    quantumMaterialPropertyActive: report.quantumMaterialPropertyActive === true
      || report.quantumMaterialPropertySource?.active === true,
    quantumMaterialPropertySource: report.quantumMaterialPropertySource || null,
    appliedQuantumMaterialPropertyThermalFluxBoostProxy: finite(report.appliedQuantumMaterialPropertyThermalFluxBoostProxy),
    appliedQuantumMaterialPropertyPhaseDriveBoostProxy: finite(report.appliedQuantumMaterialPropertyPhaseDriveBoostProxy),
    appliedQuantumMaterialPropertyElectricalDrive: finite(report.appliedQuantumMaterialPropertyElectricalDrive),
    appliedQuantumMaterialPropertyOpticalHeatingDrive: finite(report.appliedQuantumMaterialPropertyOpticalHeatingDrive),
    appliedQuantumMaterialPropertyMechanicalStiffnessDrive: finite(report.appliedQuantumMaterialPropertyMechanicalStiffnessDrive),
    appliedQuantumMaterialPropertyDampingScale: finite(report.appliedQuantumMaterialPropertyDampingScale),
    quantumMaterialStatisticalActive: report.quantumMaterialStatisticalActive === true
      || report.quantumMaterialStatisticalSource?.active === true,
    quantumMaterialStatisticalSource: report.quantumMaterialStatisticalSource || null,
    appliedQuantumMaterialStatisticalSourceChannelCount: Math.max(0, Math.round(finite(report.appliedQuantumMaterialStatisticalSourceChannelCount))),
    appliedQuantumMaterialStatisticalPressureDriveProxy: finite(report.appliedQuantumMaterialStatisticalPressureDriveProxy),
    appliedQuantumMaterialStatisticalOpacityDriveProxy: finite(report.appliedQuantumMaterialStatisticalOpacityDriveProxy),
    appliedQuantumMaterialStatisticalIonizationDriveProxy: finite(report.appliedQuantumMaterialStatisticalIonizationDriveProxy),
    appliedQuantumMaterialStatisticalDegeneracyPressureDriveProxy: finite(report.appliedQuantumMaterialStatisticalDegeneracyPressureDriveProxy),
    appliedQuantumMaterialStatisticalTemperatureDeltaKProxy: finite(report.appliedQuantumMaterialStatisticalTemperatureDeltaKProxy),
    appliedQuantumMaterialStatisticalChargeDeltaProxy: finite(report.appliedQuantumMaterialStatisticalChargeDeltaProxy),
    appliedQuantumMaterialStatisticalThermalDampingScale: finite(report.appliedQuantumMaterialStatisticalThermalDampingScale),
    quantumMaterialResponseDerivativeActive: report.quantumMaterialResponseDerivativeActive === true
      || report.quantumMaterialResponseDerivativeSource?.active === true,
    quantumMaterialResponseDerivativeSource: report.quantumMaterialResponseDerivativeSource || null,
    appliedQuantumMaterialResponseDerivativeTemperatureDrive: finite(report.appliedQuantumMaterialResponseDerivativeTemperatureDrive),
    appliedQuantumMaterialResponseDerivativePressureDrive: finite(report.appliedQuantumMaterialResponseDerivativePressureDrive),
    appliedQuantumMaterialResponseDerivativeFieldDrive: finite(report.appliedQuantumMaterialResponseDerivativeFieldDrive),
    appliedQuantumMaterialResponseDerivativeRadiationDrive: finite(report.appliedQuantumMaterialResponseDerivativeRadiationDrive),
    appliedQuantumMaterialResponseDerivativeThermalFluxBoostProxy: finite(report.appliedQuantumMaterialResponseDerivativeThermalFluxBoostProxy),
    appliedQuantumMaterialResponseDerivativePhaseDriveBoostProxy: finite(report.appliedQuantumMaterialResponseDerivativePhaseDriveBoostProxy),
    appliedQuantumMaterialResponseDerivativeElectricalDrive: finite(report.appliedQuantumMaterialResponseDerivativeElectricalDrive),
    appliedQuantumMaterialResponseDerivativeMechanicalDrive: finite(report.appliedQuantumMaterialResponseDerivativeMechanicalDrive),
    appliedQuantumMaterialResponseDerivativeOpticalDrive: finite(report.appliedQuantumMaterialResponseDerivativeOpticalDrive),
    appliedQuantumMaterialResponseDerivativeDampingScale: finite(report.appliedQuantumMaterialResponseDerivativeDampingScale),
    thermalDrive: finite(report.thermalDrive),
    sourceBufferResidualProxy: finite(report.sourceBufferResidualProxy),
    reconciliationResidualProxy: finite(report.reconciliationResidualProxy),
    applicationResidualProxy: finite(report.applicationResidualProxy),
    maxAbsFieldDeltaProxy: finite(report.maxAbsFieldDeltaProxy),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : []
  };
}

function collectSourceBufferApplications(aggregate = {}) {
  return [aggregate?.reactive, aggregate?.sph]
    .map((report) => summarizeMolecularSourceBufferApplicationReport(report))
    .filter(Boolean);
}

function collectSourceBufferApplicationReports(aggregate = {}) {
  const rawReports = [
    ...(Array.isArray(aggregate?.targetReports) ? aggregate.targetReports : []),
    aggregate?.reactiveReport,
    aggregate?.sphReport,
    aggregate?.reactive,
    aggregate?.sph
  ].filter((report) => report?.schema === MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA);
  const bySolver = new Map();
  for (const report of rawReports) {
    const key = report.targetSolverId || report.targetStateKey || `target-${bySolver.size}`;
    if (!bySolver.has(key) || Array.isArray(report.fields)) {
      bySolver.set(key, report);
    }
  }
  return [...bySolver.values()];
}

function makeSourceBufferAcceptanceTarget(sourceTarget = {}, application = null, {
  bufferStrideFloats = 0,
  sourceApplyExecutionSequence = 0,
  residualToleranceProxy = 0.08
} = {}) {
  const targetSolverId = sourceTarget.targetSolverId || application?.targetSolverId || 'unknown';
  const sourceDispatchable = sourceTarget.dispatchable === true;
  const sourceReconciled = sourceTarget.reconciled === true;
  const sourceTermCount = Math.max(0, Math.round(finite(application?.sourceTermCount)));
  const expectedSourceTermCount = Math.max(0, Math.round(finite(bufferStrideFloats)));
  const applicationResidualProxy = Math.max(0, finite(application?.applicationResidualProxy));
  const sourceSequence = Math.max(0, Math.round(finite(
    sourceTarget.sourceApplyExecutionSequence,
    sourceApplyExecutionSequence
  )));
  const applicationSequence = Math.max(0, Math.round(finite(application?.sourceApplyExecutionSequence)));
  const hasApplication = application?.schema === MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA;
  const fieldDeltaCovered = Math.max(0, Math.round(finite(application?.finiteFieldDeltaCount, application?.appliedFieldCount))) >= Math.max(1, Math.round(finite(application?.appliedFieldCount)));
  const blockers = uniqueStrings([
    sourceDispatchable ? null : 'source-buffer-target-not-dispatchable',
    sourceReconciled ? null : 'source-buffer-target-not-reconciled',
    hasApplication ? null : 'missing-target-application-report',
    application?.sourceBufferSchema === MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA ? null : 'application-source-buffer-schema-mismatch',
    application?.applied === true ? null : 'target-application-not-applied',
    Number(application?.bufferStrideFloats) === Number(bufferStrideFloats) ? null : 'application-buffer-stride-mismatch',
    sourceTermCount === expectedSourceTermCount ? null : 'application-source-term-count-mismatch',
    applicationSequence === sourceSequence ? null : 'application-source-sequence-mismatch',
    fieldDeltaCovered ? null : 'application-field-delta-coverage-missing',
    applicationResidualProxy <= residualToleranceProxy ? null : 'application-residual-over-tolerance'
  ]);
  return {
    targetSolverId,
    targetStateKey: sourceTarget.stateKey || application?.targetStateKey || null,
    targetLayer: sourceTarget.layer || application?.targetLayer || 'unknown',
    sourceDispatchable,
    sourceReconciled,
    sourceStatus: sourceTarget.status || 'unknown',
    applicationSchema: application?.schema || null,
    applicationStatus: application?.status || 'missing',
    applicationApplied: application?.applied === true,
    sourceApplyExecutionSequence: sourceSequence,
    applicationSourceApplyExecutionSequence: hasApplication ? applicationSequence : null,
    sequenceMatched: hasApplication && applicationSequence === sourceSequence,
    bufferStrideFloats: Math.max(0, Math.round(finite(application?.bufferStrideFloats, bufferStrideFloats))),
    expectedBufferStrideFloats: Math.max(0, Math.round(finite(bufferStrideFloats))),
    sourceTermCount,
    expectedSourceTermCount,
    appliedFieldCount: Math.max(0, Math.round(finite(application?.appliedFieldCount))),
    finiteFieldDeltaCount: Math.max(0, Math.round(finite(application?.finiteFieldDeltaCount, application?.appliedFieldCount))),
    fieldDeltaCovered,
    residualToleranceProxy: rounded(residualToleranceProxy, 6),
    applicationResidualProxy: rounded(applicationResidualProxy, 6),
    maxAbsFieldDeltaProxy: rounded(finite(application?.maxAbsFieldDeltaProxy), 9),
    thermalDrive: rounded(finite(application?.thermalDrive, sourceTarget.thermalDrive), 6),
    accepted: blockers.length === 0,
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularSourceBufferAcceptanceReport({
  conservativeSourceBuffer = null,
  sourceBufferApplicationAggregate = null,
  timeSeconds = 0,
  residualToleranceProxy = 0.08
} = {}) {
  const hasSourceBufferSchema = conservativeSourceBuffer?.schema === MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA;
  const hasApplicationAggregateSchema = sourceBufferApplicationAggregate?.schema === MOLECULAR_SOURCE_BUFFER_APPLICATION_AGGREGATE_SCHEMA;
  const sourceSummary = summarizeMolecularConservativeSourceBufferReport(conservativeSourceBuffer) || {};
  const applications = collectSourceBufferApplications(sourceBufferApplicationAggregate);
  const applicationsBySolver = new Map(applications.map((application) => [application.targetSolverId, application]));
  const sourceTargets = (Array.isArray(conservativeSourceBuffer?.targets) ? conservativeSourceBuffer.targets : [])
    .filter((target) => target?.dispatchable === true);
  const bufferStrideFloats = Math.max(0, Math.round(finite(sourceSummary.bufferStrideFloats, conservativeSourceBuffer?.bufferStrideFloats)));
  const tolerance = clamp(finite(residualToleranceProxy, 0.08), 0, 1);
  const targets = sourceTargets.map((target) => makeSourceBufferAcceptanceTarget(
    target,
    applicationsBySolver.get(target.targetSolverId || 'unknown') || null,
    {
      bufferStrideFloats,
      sourceApplyExecutionSequence: sourceSummary.sourceApplyExecutionSequence,
      residualToleranceProxy: tolerance
    }
  ));
  const acceptedTargets = targets.filter((target) => target.accepted);
  const blockedTargets = targets.filter((target) => !target.accepted);
  const missingTargetCount = targets.filter((target) => !target.applicationSchema).length;
  const aggregateAppliedTargetCount = Math.max(0, Math.round(finite(sourceBufferApplicationAggregate?.appliedTargetCount)));
  const aggregateSourceTermCount = Math.max(0, Math.round(finite(sourceBufferApplicationAggregate?.sourceTermCount)));
  const expectedSourceTermCount = sourceTargets.length * bufferStrideFloats;
  const maxApplicationResidualProxy = Math.max(
    0,
    ...targets.map((target) => finite(target.applicationResidualProxy)),
    finite(sourceBufferApplicationAggregate?.residual),
    finite(sourceSummary.sourceBufferResidualProxy)
  );
  const maxAbsFieldDeltaProxy = Math.max(
    0,
    ...targets.map((target) => Math.abs(finite(target.maxAbsFieldDeltaProxy))),
    Math.abs(finite(sourceBufferApplicationAggregate?.maxDelta))
  );
  const blockers = uniqueStrings([
    hasSourceBufferSchema ? null : 'missing-conservative-source-buffer',
    hasApplicationAggregateSchema ? null : 'missing-source-buffer-application-aggregate',
    sourceTargets.length > 0 ? null : 'no-dispatchable-source-buffer-targets',
    sourceSummary.pendingTargetCount > 0 ? 'source-buffer-targets-pending-reconciliation' : null,
    aggregateAppliedTargetCount >= sourceTargets.length ? null : 'aggregate-applied-target-count-mismatch',
    aggregateSourceTermCount >= expectedSourceTermCount ? null : 'aggregate-source-term-count-mismatch',
    blockedTargets.length === 0 ? null : 'target-acceptance-blocked',
    maxApplicationResidualProxy <= tolerance ? null : 'acceptance-residual-over-tolerance',
    ...(blockedTargets.flatMap((target) => target.blockers || []))
  ]);
  const accepted = blockers.length === 0 && sourceTargets.length > 0 && acceptedTargets.length === sourceTargets.length;
  const status = sourceTargets.length === 0
    ? 'idle'
    : accepted
      ? 'accepted-reduced-proxy'
      : acceptedTargets.length > 0
        ? 'partial-reduced-proxy'
        : 'blocked';

  return {
    schema: MOLECULAR_SOURCE_BUFFER_ACCEPTANCE_SCHEMA,
    mode: 'reduced-source-buffer-acceptance-v0',
    status,
    accepted,
    canMutateProxy: accepted,
    scientificMutationReady: false,
    scientificBlockers: [
      'calibrated-closure-required',
      'closed-enthalpy-balance-required',
      'stoichiometry-charge-invariant-required',
      'target-buffer-writeback-validation-required'
    ],
    timeSeconds: rounded(timeSeconds, 3),
    sourceBufferSchema: conservativeSourceBuffer?.schema || null,
    sourceBufferStatus: sourceSummary.status || conservativeSourceBuffer?.status || null,
    sourceApplyExecutionSequence: sourceSummary.sourceApplyExecutionSequence ?? null,
    sourceBufferApplicationAggregateSchema: sourceBufferApplicationAggregate?.schema || null,
    residualToleranceProxy: rounded(tolerance, 6),
    targetCount: sourceTargets.length,
    acceptedTargetCount: acceptedTargets.length,
    blockedTargetCount: blockedTargets.length,
    missingTargetCount,
    aggregateAppliedTargetCount,
    dispatchableTargetCount: Math.max(0, Math.round(finite(sourceSummary.dispatchableTargetCount, sourceTargets.length))),
    reconciledTargetCount: Math.max(0, Math.round(finite(sourceSummary.reconciledTargetCount))),
    pendingTargetCount: Math.max(0, Math.round(finite(sourceSummary.pendingTargetCount))),
    appliedFieldCount: targets.reduce((sum, target) => sum + finite(target.appliedFieldCount), 0),
    finiteFieldDeltaCount: targets.reduce((sum, target) => sum + finite(target.finiteFieldDeltaCount), 0),
    sourceTermCount: aggregateSourceTermCount,
    expectedSourceTermCount,
    bufferStrideFloats,
    maxApplicationResidualProxy: rounded(maxApplicationResidualProxy, 6),
    maxAbsFieldDeltaProxy: rounded(maxAbsFieldDeltaProxy, 9),
    thermalDrive: rounded(finite(sourceBufferApplicationAggregate?.thermalDrive), 6),
    targets,
    blockerCount: blockers.length,
    blockers,
    validity: {
      status: 'interactive-proxy-acceptance-gate',
      confidence: 0.13,
      warnings: [
        'Acceptance means dispatchable source-buffer terms were consumed by target workers with finite reduced deltas.',
        'This still does not prove calibrated thermodynamic, stoichiometric, charge, or phase-conservative mutation.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_SOURCE_BUFFER_ACCEPTANCE_SCHEMA,
      sourceBufferSchema: conservativeSourceBuffer?.schema || null,
      applicationAggregateSchema: sourceBufferApplicationAggregate?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularSourceBufferAcceptanceReport(report = null) {
  if (report?.schema !== MOLECULAR_SOURCE_BUFFER_ACCEPTANCE_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    accepted: report.accepted === true,
    canMutateProxy: report.canMutateProxy === true,
    scientificMutationReady: report.scientificMutationReady === true,
    sourceBufferSchema: report.sourceBufferSchema || null,
    sourceBufferApplicationAggregateSchema: report.sourceBufferApplicationAggregateSchema || null,
    sourceApplyExecutionSequence: report.sourceApplyExecutionSequence ?? null,
    residualToleranceProxy: finite(report.residualToleranceProxy),
    targetCount: Math.max(0, Math.round(finite(report.targetCount))),
    acceptedTargetCount: Math.max(0, Math.round(finite(report.acceptedTargetCount))),
    blockedTargetCount: Math.max(0, Math.round(finite(report.blockedTargetCount))),
    missingTargetCount: Math.max(0, Math.round(finite(report.missingTargetCount))),
    aggregateAppliedTargetCount: Math.max(0, Math.round(finite(report.aggregateAppliedTargetCount))),
    dispatchableTargetCount: Math.max(0, Math.round(finite(report.dispatchableTargetCount))),
    reconciledTargetCount: Math.max(0, Math.round(finite(report.reconciledTargetCount))),
    pendingTargetCount: Math.max(0, Math.round(finite(report.pendingTargetCount))),
    appliedFieldCount: Math.max(0, Math.round(finite(report.appliedFieldCount))),
    finiteFieldDeltaCount: Math.max(0, Math.round(finite(report.finiteFieldDeltaCount))),
    sourceTermCount: Math.max(0, Math.round(finite(report.sourceTermCount))),
    expectedSourceTermCount: Math.max(0, Math.round(finite(report.expectedSourceTermCount))),
    bufferStrideFloats: Math.max(0, Math.round(finite(report.bufferStrideFloats))),
    maxApplicationResidualProxy: finite(report.maxApplicationResidualProxy),
    maxAbsFieldDeltaProxy: finite(report.maxAbsFieldDeltaProxy),
    thermalDrive: finite(report.thermalDrive),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : [],
    targets: Array.isArray(report.targets)
      ? report.targets.map((target) => ({
        targetSolverId: target.targetSolverId || 'unknown',
        accepted: target.accepted === true,
        applicationApplied: target.applicationApplied === true,
        sourceDispatchable: target.sourceDispatchable === true,
        sourceReconciled: target.sourceReconciled === true,
        appliedFieldCount: Math.max(0, Math.round(finite(target.appliedFieldCount))),
        finiteFieldDeltaCount: Math.max(0, Math.round(finite(target.finiteFieldDeltaCount))),
        sourceTermCount: Math.max(0, Math.round(finite(target.sourceTermCount))),
        expectedSourceTermCount: Math.max(0, Math.round(finite(target.expectedSourceTermCount))),
        applicationResidualProxy: finite(target.applicationResidualProxy),
        blockerCount: Math.max(0, Math.round(finite(target.blockerCount, target.blockers?.length)))
      }))
      : []
  };
}

function makeSourceBufferWritebackValidationTarget(application = null, acceptanceTarget = null, {
  residualToleranceProxy = 0.08
} = {}) {
  const targetSolverId = application?.targetSolverId || acceptanceTarget?.targetSolverId || 'unknown';
  const targetStateKey = application?.targetStateKey || acceptanceTarget?.targetStateKey || null;
  const sourceTermCount = Math.max(0, Math.round(finite(application?.sourceTermCount, acceptanceTarget?.sourceTermCount)));
  const expectedSourceTermCount = Math.max(0, Math.round(finite(
    acceptanceTarget?.expectedSourceTermCount,
    application?.bufferStrideFloats
  )));
  const appliedFieldCount = Math.max(0, Math.round(finite(application?.appliedFieldCount)));
  const finiteFieldDeltaCount = Math.max(0, Math.round(finite(
    application?.finiteFieldDeltaCount,
    application?.appliedFieldCount
  )));
  const residual = Math.max(0, finite(
    application?.applicationResidualProxy,
    acceptanceTarget?.applicationResidualProxy
  ));
  const maxAbsFieldDeltaProxy = Math.abs(finite(
    application?.maxAbsFieldDeltaProxy,
    acceptanceTarget?.maxAbsFieldDeltaProxy
  ));
  const accepted = acceptanceTarget?.accepted === true;
  const applied = application?.applied === true || acceptanceTarget?.applicationApplied === true;
  const fieldDeltaCovered = finiteFieldDeltaCount >= Math.max(1, appliedFieldCount);
  const sourceTermsCovered = sourceTermCount === expectedSourceTermCount && expectedSourceTermCount > 0;
  const residualPass = residual <= residualToleranceProxy;
  const writebackObservedProxy = applied && appliedFieldCount > 0 && fieldDeltaCovered && Number.isFinite(maxAbsFieldDeltaProxy);
  const blockers = uniqueStrings([
    accepted ? null : 'source-buffer-acceptance-not-passed',
    application?.schema === MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA ? null : 'missing-source-buffer-application-report',
    applied ? null : 'target-worker-application-not-applied',
    sourceTermsCovered ? null : 'source-term-count-not-covered',
    fieldDeltaCovered ? null : 'field-delta-coverage-not-confirmed',
    writebackObservedProxy ? null : 'target-writeback-delta-not-observed',
    residualPass ? null : 'writeback-residual-over-tolerance'
  ]);
  return {
    targetSolverId,
    targetStateKey,
    targetLayer: application?.targetLayer || acceptanceTarget?.targetLayer || 'unknown',
    applicationSchema: application?.schema || null,
    applicationStatus: application?.status || acceptanceTarget?.applicationStatus || 'missing',
    acceptanceMatched: accepted,
    applicationApplied: applied,
    sourceTermsCovered,
    fieldDeltaCovered,
    writebackObservedProxy,
    sourceTermCount,
    expectedSourceTermCount,
    appliedFieldCount,
    finiteFieldDeltaCount,
    residualToleranceProxy: rounded(residualToleranceProxy, 6),
    writebackResidualProxy: rounded(residual, 6),
    maxAbsFieldDeltaProxy: rounded(maxAbsFieldDeltaProxy, 9),
    thermalDrive: rounded(finite(application?.thermalDrive, acceptanceTarget?.thermalDrive), 6),
    validated: blockers.length === 0,
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularSourceBufferWritebackValidationReport({
  conservativeSourceBuffer = null,
  sourceBufferApplicationAggregate = null,
  sourceBufferAcceptance = null,
  timeSeconds = 0,
  residualToleranceProxy = 0.08
} = {}) {
  const hasSourceBufferSchema = conservativeSourceBuffer?.schema === MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA;
  const hasApplicationAggregateSchema = sourceBufferApplicationAggregate?.schema === MOLECULAR_SOURCE_BUFFER_APPLICATION_AGGREGATE_SCHEMA;
  const acceptanceSummary = summarizeMolecularSourceBufferAcceptanceReport(sourceBufferAcceptance) || {};
  const applications = collectSourceBufferApplications(sourceBufferApplicationAggregate);
  const applicationsBySolver = new Map(applications.map((application) => [application.targetSolverId, application]));
  const acceptanceTargets = Array.isArray(acceptanceSummary.targets) ? acceptanceSummary.targets : [];
  const sourceTargets = (Array.isArray(conservativeSourceBuffer?.targets) ? conservativeSourceBuffer.targets : [])
    .filter((target) => target?.dispatchable === true);
  const acceptanceTargetBySolver = new Map(acceptanceTargets.map((target) => [target.targetSolverId, target]));
  const targetSolverIds = uniqueStrings([
    ...sourceTargets.map((target) => target.targetSolverId || 'unknown'),
    ...acceptanceTargets.map((target) => target.targetSolverId || 'unknown'),
    ...applications.map((application) => application.targetSolverId || 'unknown')
  ]).filter((targetSolverId) => targetSolverId && targetSolverId !== 'unknown');
  const tolerance = clamp(finite(
    residualToleranceProxy,
    acceptanceSummary.residualToleranceProxy
  ), 0, 1);
  const targets = targetSolverIds.map((targetSolverId) => makeSourceBufferWritebackValidationTarget(
    applicationsBySolver.get(targetSolverId) || null,
    acceptanceTargetBySolver.get(targetSolverId) || null,
    { residualToleranceProxy: tolerance }
  ));
  const validatedTargets = targets.filter((target) => target.validated);
  const blockedTargets = targets.filter((target) => !target.validated);
  const observedTargetCount = targets.filter((target) => target.writebackObservedProxy).length;
  const fieldDeltaCoveredTargetCount = targets.filter((target) => target.fieldDeltaCovered).length;
  const maxWritebackResidualProxy = Math.max(
    0,
    ...targets.map((target) => finite(target.writebackResidualProxy)),
    finite(acceptanceSummary.maxApplicationResidualProxy),
    finite(sourceBufferApplicationAggregate?.residual)
  );
  const maxAbsFieldDeltaProxy = Math.max(
    0,
    ...targets.map((target) => Math.abs(finite(target.maxAbsFieldDeltaProxy))),
    Math.abs(finite(sourceBufferApplicationAggregate?.maxDelta)),
    Math.abs(finite(acceptanceSummary.maxAbsFieldDeltaProxy))
  );
  const expectedSourceTermCount = Math.max(0, Math.round(finite(acceptanceSummary.expectedSourceTermCount)));
  const sourceTermCount = targets.reduce((sum, target) => sum + finite(target.sourceTermCount), 0);
  const blockers = uniqueStrings([
    hasSourceBufferSchema ? null : 'missing-conservative-source-buffer',
    hasApplicationAggregateSchema ? null : 'missing-source-buffer-application-aggregate',
    sourceBufferAcceptance?.schema === MOLECULAR_SOURCE_BUFFER_ACCEPTANCE_SCHEMA ? null : 'missing-source-buffer-acceptance',
    acceptanceSummary.canMutateProxy === true ? null : 'source-buffer-acceptance-not-ready',
    targetSolverIds.length > 0 ? null : 'no-targets-to-validate',
    sourceTermCount >= expectedSourceTermCount && expectedSourceTermCount > 0 ? null : 'writeback-source-term-count-mismatch',
    blockedTargets.length === 0 ? null : 'target-writeback-validation-blocked',
    maxWritebackResidualProxy <= tolerance ? null : 'writeback-residual-over-tolerance',
    ...(blockedTargets.flatMap((target) => target.blockers || []))
  ]);
  const validated = blockers.length === 0 && targetSolverIds.length > 0 && validatedTargets.length === targetSolverIds.length;
  const status = targetSolverIds.length === 0
    ? 'idle'
    : validated
      ? 'validated-reduced-writeback-proxy'
      : validatedTargets.length > 0
        ? 'partial-reduced-writeback-proxy'
        : 'blocked';

  return {
    schema: MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA,
    mode: 'reduced-target-writeback-validation-v0',
    status,
    validated,
    validatedProxyWriteback: validated,
    canWritebackProxy: validated,
    scientificWritebackReady: false,
    scientificMutationReady: false,
    scientificBlockers: [
      'live-worker-buffer-replay-required',
      'calibrated-closure-required',
      'closed-enthalpy-balance-required',
      'stoichiometry-charge-invariant-required',
      'reference-tolerance-suite-required'
    ],
    timeSeconds: rounded(timeSeconds, 3),
    sourceBufferSchema: conservativeSourceBuffer?.schema || null,
    sourceBufferStatus: conservativeSourceBuffer?.status || null,
    sourceBufferApplicationAggregateSchema: sourceBufferApplicationAggregate?.schema || null,
    sourceBufferAcceptanceSchema: sourceBufferAcceptance?.schema || null,
    sourceApplyExecutionSequence: acceptanceSummary.sourceApplyExecutionSequence ?? null,
    residualToleranceProxy: rounded(tolerance, 6),
    targetCount: targetSolverIds.length,
    observedTargetCount,
    validatedTargetCount: validatedTargets.length,
    blockedTargetCount: blockedTargets.length,
    fieldDeltaCoveredTargetCount,
    acceptedTargetCount: Math.max(0, Math.round(finite(acceptanceSummary.acceptedTargetCount))),
    sourceTermCount: Math.max(0, Math.round(sourceTermCount)),
    expectedSourceTermCount,
    appliedFieldCount: targets.reduce((sum, target) => sum + finite(target.appliedFieldCount), 0),
    finiteFieldDeltaCount: targets.reduce((sum, target) => sum + finite(target.finiteFieldDeltaCount), 0),
    maxWritebackResidualProxy: rounded(maxWritebackResidualProxy, 6),
    maxAbsFieldDeltaProxy: rounded(maxAbsFieldDeltaProxy, 9),
    thermalDrive: rounded(finite(sourceBufferApplicationAggregate?.thermalDrive), 6),
    targets,
    blockerCount: blockers.length,
    blockers,
    validity: {
      status: 'interactive-proxy-writeback-validation',
      confidence: 0.14,
      warnings: [
        'This validates target-side reduced writeback summaries, not replayed worker buffers or scientific conservative mutation.',
        'Scientific mode must add live target-buffer replay, calibrated invariants, reference tolerances, and out-of-domain policies.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA,
      sourceBufferSchema: conservativeSourceBuffer?.schema || null,
      applicationAggregateSchema: sourceBufferApplicationAggregate?.schema || null,
      acceptanceSchema: sourceBufferAcceptance?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularSourceBufferWritebackValidationReport(report = null) {
  if (report?.schema !== MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    validated: report.validated === true,
    validatedProxyWriteback: report.validatedProxyWriteback === true,
    canWritebackProxy: report.canWritebackProxy === true,
    scientificWritebackReady: report.scientificWritebackReady === true,
    scientificMutationReady: report.scientificMutationReady === true,
    sourceBufferSchema: report.sourceBufferSchema || null,
    sourceBufferApplicationAggregateSchema: report.sourceBufferApplicationAggregateSchema || null,
    sourceBufferAcceptanceSchema: report.sourceBufferAcceptanceSchema || null,
    sourceApplyExecutionSequence: report.sourceApplyExecutionSequence ?? null,
    residualToleranceProxy: finite(report.residualToleranceProxy),
    targetCount: Math.max(0, Math.round(finite(report.targetCount))),
    observedTargetCount: Math.max(0, Math.round(finite(report.observedTargetCount))),
    validatedTargetCount: Math.max(0, Math.round(finite(report.validatedTargetCount))),
    blockedTargetCount: Math.max(0, Math.round(finite(report.blockedTargetCount))),
    fieldDeltaCoveredTargetCount: Math.max(0, Math.round(finite(report.fieldDeltaCoveredTargetCount))),
    acceptedTargetCount: Math.max(0, Math.round(finite(report.acceptedTargetCount))),
    sourceTermCount: Math.max(0, Math.round(finite(report.sourceTermCount))),
    expectedSourceTermCount: Math.max(0, Math.round(finite(report.expectedSourceTermCount))),
    appliedFieldCount: Math.max(0, Math.round(finite(report.appliedFieldCount))),
    finiteFieldDeltaCount: Math.max(0, Math.round(finite(report.finiteFieldDeltaCount))),
    maxWritebackResidualProxy: finite(report.maxWritebackResidualProxy),
    maxAbsFieldDeltaProxy: finite(report.maxAbsFieldDeltaProxy),
    thermalDrive: finite(report.thermalDrive),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : [],
    scientificBlockers: Array.isArray(report.scientificBlockers) ? [...report.scientificBlockers] : [],
    targets: Array.isArray(report.targets)
      ? report.targets.map((target) => ({
        targetSolverId: target.targetSolverId || 'unknown',
        validated: target.validated === true,
        writebackObservedProxy: target.writebackObservedProxy === true,
        fieldDeltaCovered: target.fieldDeltaCovered === true,
        sourceTermsCovered: target.sourceTermsCovered === true,
        appliedFieldCount: Math.max(0, Math.round(finite(target.appliedFieldCount))),
        finiteFieldDeltaCount: Math.max(0, Math.round(finite(target.finiteFieldDeltaCount))),
        sourceTermCount: Math.max(0, Math.round(finite(target.sourceTermCount))),
        expectedSourceTermCount: Math.max(0, Math.round(finite(target.expectedSourceTermCount))),
        writebackResidualProxy: finite(target.writebackResidualProxy),
        blockerCount: Math.max(0, Math.round(finite(target.blockerCount, target.blockers?.length)))
      }))
      : []
  };
}

function snapshotFieldValue(snapshot = {}, fieldName = 'unknown') {
  if (!snapshot || !fieldName) return undefined;
  if (snapshot.fields && Object.prototype.hasOwnProperty.call(snapshot.fields, fieldName)) {
    return snapshot.fields[fieldName];
  }
  return snapshot[fieldName];
}

function makeTargetBufferReplayField(field = {}, snapshot = {}, {
  replayToleranceProxy = 0.000001
} = {}) {
  const expectedAfter = finite(field.after, NaN);
  const actualAfterRaw = snapshotFieldValue(snapshot, field.field);
  const actualAfter = finite(actualAfterRaw, NaN);
  const hasSnapshotField = Number.isFinite(actualAfter);
  const residual = hasSnapshotField && Number.isFinite(expectedAfter)
    ? Math.abs(actualAfter - expectedAfter)
    : Infinity;
  const tolerance = Math.max(
    replayToleranceProxy,
    Math.abs(expectedAfter || 0) * 0.000001
  );
  return {
    field: field.field || 'unknown',
    unit: field.unit || '1',
    dimensions: field.dimensions || '1',
    sourceTerm: field.sourceTerm || null,
    before: Number.isFinite(finite(field.before, NaN)) ? finite(field.before) : null,
    expectedAfter: Number.isFinite(expectedAfter) ? rounded(expectedAfter, field.unit === '1' ? 6 : 9) : null,
    actualAfter: hasSnapshotField ? rounded(actualAfter, field.unit === '1' ? 6 : 9) : null,
    delta: Number.isFinite(finite(field.delta, NaN)) ? finite(field.delta) : null,
    replayResidualProxy: Number.isFinite(residual) ? rounded(residual, 9) : null,
    replayToleranceProxy: rounded(tolerance, 9),
    matched: hasSnapshotField,
    residualPassed: hasSnapshotField && residual <= tolerance,
    applied: field.applied !== false
  };
}

function makeTargetBufferReplayValidationTarget(application = null, writebackTarget = null, snapshot = null, {
  replayToleranceProxy = 0.000001
} = {}) {
  const targetSolverId = application?.targetSolverId || writebackTarget?.targetSolverId || snapshot?.targetSolverId || 'unknown';
  const targetStateKey = application?.targetStateKey || writebackTarget?.targetStateKey || snapshot?.targetStateKey || null;
  const applicationFields = Array.isArray(application?.fields)
    ? application.fields.filter((field) => field?.applied !== false)
    : [];
  const replayFields = applicationFields.map((field) => makeTargetBufferReplayField(field, snapshot, {
    replayToleranceProxy
  }));
  const matchedFieldCount = replayFields.filter((field) => field.matched).length;
  const residualPassedFieldCount = replayFields.filter((field) => field.residualPassed).length;
  const maxReplayResidualProxy = replayFields.reduce((max, field) => (
    Math.max(max, Number.isFinite(field.replayResidualProxy) ? Math.abs(field.replayResidualProxy) : Infinity)
  ), 0);
  const finiteMaxResidual = Number.isFinite(maxReplayResidualProxy) ? maxReplayResidualProxy : 1;
  const writebackValidated = writebackTarget?.validated === true;
  const hasFullApplicationReport = application?.schema === MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA
    && Array.isArray(application.fields);
  const hasSnapshot = !!snapshot;
  const fieldReplayPassed = applicationFields.length > 0
    && matchedFieldCount === applicationFields.length
    && residualPassedFieldCount === applicationFields.length;
  const blockers = uniqueStrings([
    writebackValidated ? null : 'writeback-validation-not-passed',
    hasFullApplicationReport ? null : 'missing-full-source-buffer-application-report',
    hasSnapshot ? null : 'missing-live-target-snapshot',
    applicationFields.length > 0 ? null : 'no-application-fields-to-replay',
    matchedFieldCount === applicationFields.length ? null : 'target-snapshot-field-missing',
    fieldReplayPassed ? null : 'target-snapshot-after-mismatch'
  ]);
  return {
    targetSolverId,
    targetStateKey,
    targetLayer: application?.targetLayer || writebackTarget?.targetLayer || snapshot?.targetLayer || 'unknown',
    targetSequence: application?.targetSequence ?? snapshot?.sequence ?? null,
    applicationSchema: application?.schema || null,
    applicationStatus: application?.status || writebackTarget?.applicationStatus || 'missing',
    writebackValidated,
    snapshotObserved: hasSnapshot,
    targetSnapshotSequence: snapshot?.sequence ?? null,
    applicationFieldCount: applicationFields.length,
    replayedFieldCount: matchedFieldCount,
    residualPassedFieldCount,
    missingFieldCount: Math.max(0, applicationFields.length - matchedFieldCount),
    fieldReplayPassed,
    maxReplayResidualProxy: rounded(finiteMaxResidual, 9),
    replayToleranceProxy: rounded(replayToleranceProxy, 9),
    thermalDrive: rounded(finite(application?.thermalDrive, writebackTarget?.thermalDrive), 6),
    replayed: blockers.length === 0,
    fields: replayFields,
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularTargetBufferReplayValidationReport({
  sourceBufferApplicationAggregate = null,
  sourceBufferWritebackValidation = null,
  targetSnapshots = [],
  timeSeconds = 0,
  replayToleranceProxy = 0.000001
} = {}) {
  const hasApplicationAggregateSchema = sourceBufferApplicationAggregate?.schema === MOLECULAR_SOURCE_BUFFER_APPLICATION_AGGREGATE_SCHEMA;
  const hasWritebackSchema = sourceBufferWritebackValidation?.schema === MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA;
  const writebackSummary = summarizeMolecularSourceBufferWritebackValidationReport(sourceBufferWritebackValidation) || {};
  const applicationReports = collectSourceBufferApplicationReports(sourceBufferApplicationAggregate);
  const applicationsBySolver = new Map(applicationReports.map((report) => [report.targetSolverId || 'unknown', report]));
  const writebackTargets = Array.isArray(sourceBufferWritebackValidation?.targets)
    ? sourceBufferWritebackValidation.targets
    : Array.isArray(writebackSummary.targets)
      ? writebackSummary.targets
      : [];
  const writebackTargetsBySolver = new Map(writebackTargets.map((target) => [target.targetSolverId || 'unknown', target]));
  const snapshotsBySolver = new Map((Array.isArray(targetSnapshots) ? targetSnapshots : [])
    .filter((snapshot) => snapshot?.targetSolverId)
    .map((snapshot) => [snapshot.targetSolverId, snapshot]));
  const targetSolverIds = uniqueStrings([
    ...applicationReports.map((report) => report.targetSolverId || 'unknown'),
    ...writebackTargets.map((target) => target.targetSolverId || 'unknown')
  ]).filter((targetSolverId) => targetSolverId && targetSolverId !== 'unknown');
  const tolerance = Math.max(0, finite(replayToleranceProxy, 0.000001));
  const targets = targetSolverIds.map((targetSolverId) => makeTargetBufferReplayValidationTarget(
    applicationsBySolver.get(targetSolverId) || null,
    writebackTargetsBySolver.get(targetSolverId) || null,
    snapshotsBySolver.get(targetSolverId) || null,
    { replayToleranceProxy: tolerance }
  ));
  const replayedTargets = targets.filter((target) => target.replayed);
  const blockedTargets = targets.filter((target) => !target.replayed);
  const replayedFieldCount = targets.reduce((sum, target) => sum + finite(target.replayedFieldCount), 0);
  const applicationFieldCount = targets.reduce((sum, target) => sum + finite(target.applicationFieldCount), 0);
  const missingFieldCount = targets.reduce((sum, target) => sum + finite(target.missingFieldCount), 0);
  const maxReplayResidualProxy = Math.max(
    0,
    ...targets.map((target) => finite(target.maxReplayResidualProxy))
  );
  const blockers = uniqueStrings([
    hasApplicationAggregateSchema ? null : 'missing-source-buffer-application-aggregate',
    hasWritebackSchema ? null : 'missing-source-buffer-writeback-validation',
    writebackSummary.canWritebackProxy === true ? null : 'writeback-validation-not-ready',
    targetSolverIds.length > 0 ? null : 'no-targets-to-replay',
    applicationReports.length >= targetSolverIds.length ? null : 'missing-full-application-report',
    replayedFieldCount >= applicationFieldCount && applicationFieldCount > 0 ? null : 'target-field-replay-incomplete',
    blockedTargets.length === 0 ? null : 'target-replay-validation-blocked',
    maxReplayResidualProxy <= Math.max(tolerance, 0.000001) ? null : 'target-replay-residual-over-tolerance',
    ...(blockedTargets.flatMap((target) => target.blockers || []))
  ]);
  const replayed = blockers.length === 0 && targetSolverIds.length > 0 && replayedTargets.length === targetSolverIds.length;
  const status = targetSolverIds.length === 0
    ? 'idle'
    : replayed
      ? 'validated-reduced-target-replay-proxy'
      : replayedTargets.length > 0
        ? 'partial-reduced-target-replay-proxy'
        : 'blocked';

  return {
    schema: MOLECULAR_TARGET_BUFFER_REPLAY_VALIDATION_SCHEMA,
    mode: 'reduced-live-target-snapshot-replay-v0',
    status,
    replayed,
    canReplayProxy: replayed,
    scientificReplayReady: false,
    scientificMutationReady: false,
    scientificBlockers: [
      'live-worker-buffer-writeback-required',
      'calibrated-closure-required',
      'closed-enthalpy-balance-required',
      'stoichiometry-charge-invariant-required',
      'reference-tolerance-suite-required'
    ],
    timeSeconds: rounded(timeSeconds, 3),
    sourceBufferApplicationAggregateSchema: sourceBufferApplicationAggregate?.schema || null,
    sourceBufferWritebackValidationSchema: sourceBufferWritebackValidation?.schema || null,
    sourceApplyExecutionSequence: writebackSummary.sourceApplyExecutionSequence ?? null,
    replayToleranceProxy: rounded(tolerance, 9),
    targetCount: targetSolverIds.length,
    replayedTargetCount: replayedTargets.length,
    blockedTargetCount: blockedTargets.length,
    snapshotTargetCount: snapshotsBySolver.size,
    applicationReportCount: applicationReports.length,
    applicationFieldCount,
    replayedFieldCount,
    missingFieldCount,
    maxReplayResidualProxy: rounded(maxReplayResidualProxy, 9),
    writebackValidatedTargetCount: Math.max(0, Math.round(finite(writebackSummary.validatedTargetCount))),
    writebackBlockedTargetCount: Math.max(0, Math.round(finite(writebackSummary.blockedTargetCount))),
    canWritebackProxy: writebackSummary.canWritebackProxy === true,
    targets,
    blockerCount: blockers.length,
    blockers,
    validity: {
      status: 'interactive-proxy-target-replay-validation',
      confidence: 0.15,
      warnings: [
        'This replays reduced target-field after values against current target snapshots.',
        'Scientific mutation still requires live worker-buffer writes, calibrated invariants, and reference tolerances.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_BUFFER_REPLAY_VALIDATION_SCHEMA,
      applicationAggregateSchema: sourceBufferApplicationAggregate?.schema || null,
      writebackValidationSchema: sourceBufferWritebackValidation?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetBufferReplayValidationReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_BUFFER_REPLAY_VALIDATION_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    replayed: report.replayed === true,
    canReplayProxy: report.canReplayProxy === true,
    scientificReplayReady: report.scientificReplayReady === true,
    scientificMutationReady: report.scientificMutationReady === true,
    sourceBufferApplicationAggregateSchema: report.sourceBufferApplicationAggregateSchema || null,
    sourceBufferWritebackValidationSchema: report.sourceBufferWritebackValidationSchema || null,
    sourceApplyExecutionSequence: report.sourceApplyExecutionSequence ?? null,
    replayToleranceProxy: finite(report.replayToleranceProxy),
    targetCount: Math.max(0, Math.round(finite(report.targetCount))),
    replayedTargetCount: Math.max(0, Math.round(finite(report.replayedTargetCount))),
    blockedTargetCount: Math.max(0, Math.round(finite(report.blockedTargetCount))),
    snapshotTargetCount: Math.max(0, Math.round(finite(report.snapshotTargetCount))),
    applicationReportCount: Math.max(0, Math.round(finite(report.applicationReportCount))),
    applicationFieldCount: Math.max(0, Math.round(finite(report.applicationFieldCount))),
    replayedFieldCount: Math.max(0, Math.round(finite(report.replayedFieldCount))),
    missingFieldCount: Math.max(0, Math.round(finite(report.missingFieldCount))),
    maxReplayResidualProxy: finite(report.maxReplayResidualProxy),
    writebackValidatedTargetCount: Math.max(0, Math.round(finite(report.writebackValidatedTargetCount))),
    writebackBlockedTargetCount: Math.max(0, Math.round(finite(report.writebackBlockedTargetCount))),
    canWritebackProxy: report.canWritebackProxy === true,
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : [],
    scientificBlockers: Array.isArray(report.scientificBlockers) ? [...report.scientificBlockers] : [],
    targets: Array.isArray(report.targets)
      ? report.targets.map((target) => ({
        targetSolverId: target.targetSolverId || 'unknown',
        replayed: target.replayed === true,
        writebackValidated: target.writebackValidated === true,
        snapshotObserved: target.snapshotObserved === true,
        applicationFieldCount: Math.max(0, Math.round(finite(target.applicationFieldCount))),
        replayedFieldCount: Math.max(0, Math.round(finite(target.replayedFieldCount))),
        missingFieldCount: Math.max(0, Math.round(finite(target.missingFieldCount))),
        maxReplayResidualProxy: finite(target.maxReplayResidualProxy),
        blockerCount: Math.max(0, Math.round(finite(target.blockerCount, target.blockers?.length)))
      }))
      : []
  };
}

function makeTargetBufferMutationWriteIntent(field = {}, target = {}) {
  const expectedAfter = finite(field.expectedAfter, NaN);
  const actualAfter = finite(field.actualAfter, NaN);
  const replayResidual = finite(field.replayResidualProxy, NaN);
  const hasWriteValue = Number.isFinite(expectedAfter);
  const replayReady = target.replayed === true
    && field.matched === true
    && field.residualPassed === true
    && field.applied !== false;
  const blockers = uniqueStrings([
    target.replayed === true ? null : 'target-replay-not-validated',
    field.applied !== false ? null : 'source-field-not-applied',
    field.matched === true ? null : 'missing-target-snapshot-field',
    field.residualPassed === true ? null : 'replay-residual-over-tolerance',
    hasWriteValue ? null : 'missing-target-write-value'
  ]);
  return {
    targetSolverId: target.targetSolverId || 'unknown',
    targetStateKey: target.targetStateKey || null,
    targetLayer: target.targetLayer || 'unknown',
    field: field.field || 'unknown',
    unit: field.unit || '1',
    dimensions: field.dimensions || '1',
    sourceTerm: field.sourceTerm || null,
    before: Number.isFinite(finite(field.before, NaN)) ? finite(field.before) : null,
    expectedAfter: hasWriteValue ? rounded(expectedAfter, field.unit === '1' ? 6 : 9) : null,
    actualAfter: Number.isFinite(actualAfter) ? rounded(actualAfter, field.unit === '1' ? 6 : 9) : null,
    delta: Number.isFinite(finite(field.delta, NaN)) ? finite(field.delta) : null,
    replayResidualProxy: Number.isFinite(replayResidual) ? rounded(replayResidual, 9) : null,
    replayToleranceProxy: rounded(field.replayToleranceProxy, 9),
    ready: replayReady && blockers.length === 0,
    queued: false,
    applied: false,
    workerWriteReady: false,
    queueBlockers: ['worker-buffer-write-path-not-implemented'],
    blockerCount: blockers.length,
    blockers
  };
}

function makeTargetBufferMutationAuditTarget(target = {}) {
  const writeIntents = Array.isArray(target.fields)
    ? target.fields.map((field) => makeTargetBufferMutationWriteIntent(field, target))
    : [];
  const readyWriteIntentCount = writeIntents.filter((intent) => intent.ready).length;
  const blockedWriteIntentCount = writeIntents.length - readyWriteIntentCount;
  const maxMutationAuditResidualProxy = Math.max(
    0,
    ...writeIntents.map((intent) => finite(intent.replayResidualProxy))
  );
  const blockers = uniqueStrings([
    target.replayed === true ? null : 'target-replay-not-validated',
    writeIntents.length > 0 ? null : 'no-replay-fields-to-mutate',
    blockedWriteIntentCount === 0 ? null : 'write-intent-blocked',
    ...(writeIntents.flatMap((intent) => intent.blockers || []))
  ]);
  return {
    targetSolverId: target.targetSolverId || 'unknown',
    targetStateKey: target.targetStateKey || null,
    targetLayer: target.targetLayer || 'unknown',
    targetSequence: target.targetSequence ?? null,
    targetSnapshotSequence: target.targetSnapshotSequence ?? null,
    replayed: target.replayed === true,
    writebackValidated: target.writebackValidated === true,
    snapshotObserved: target.snapshotObserved === true,
    writeIntentCount: writeIntents.length,
    readyWriteIntentCount,
    blockedWriteIntentCount,
    queuedWriteIntentCount: 0,
    appliedWriteIntentCount: 0,
    maxMutationAuditResidualProxy: rounded(maxMutationAuditResidualProxy, 9),
    ready: blockers.length === 0,
    canQueueWorkerWrite: false,
    workerWriteReady: false,
    mutationApplied: false,
    writeIntents,
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularTargetBufferMutationAuditReport({
  targetBufferReplayValidation = null,
  sourceBufferWritebackValidation = null,
  sourceBufferApplicationAggregate = null,
  timeSeconds = 0
} = {}) {
  const hasReplaySchema = targetBufferReplayValidation?.schema === MOLECULAR_TARGET_BUFFER_REPLAY_VALIDATION_SCHEMA;
  const replaySummary = summarizeMolecularTargetBufferReplayValidationReport(targetBufferReplayValidation) || {};
  const hasWritebackSchema = sourceBufferWritebackValidation?.schema === MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA
    || replaySummary.sourceBufferWritebackValidationSchema === MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA;
  const hasApplicationAggregateSchema = sourceBufferApplicationAggregate?.schema === MOLECULAR_SOURCE_BUFFER_APPLICATION_AGGREGATE_SCHEMA
    || replaySummary.sourceBufferApplicationAggregateSchema === MOLECULAR_SOURCE_BUFFER_APPLICATION_AGGREGATE_SCHEMA;
  const replayTargets = Array.isArray(targetBufferReplayValidation?.targets)
    ? targetBufferReplayValidation.targets
    : [];
  const targets = replayTargets.map((target) => makeTargetBufferMutationAuditTarget(target));
  const readyTargets = targets.filter((target) => target.ready);
  const blockedTargets = targets.filter((target) => !target.ready);
  const writeIntentCount = targets.reduce((sum, target) => sum + finite(target.writeIntentCount), 0);
  const readyWriteIntentCount = targets.reduce((sum, target) => sum + finite(target.readyWriteIntentCount), 0);
  const blockedWriteIntentCount = targets.reduce((sum, target) => sum + finite(target.blockedWriteIntentCount), 0);
  const maxMutationAuditResidualProxy = Math.max(
    0,
    ...targets.map((target) => finite(target.maxMutationAuditResidualProxy))
  );
  const blockers = uniqueStrings([
    hasReplaySchema ? null : 'missing-target-buffer-replay-validation',
    hasApplicationAggregateSchema ? null : 'missing-source-buffer-application-aggregate',
    hasWritebackSchema ? null : 'missing-source-buffer-writeback-validation',
    replaySummary.canReplayProxy === true ? null : 'target-buffer-replay-not-ready',
    targets.length > 0 ? null : 'no-targets-to-audit',
    writeIntentCount > 0 ? null : 'no-write-intents',
    blockedTargets.length === 0 ? null : 'target-mutation-audit-blocked',
    blockedWriteIntentCount === 0 ? null : 'blocked-write-intents',
    ...(blockedTargets.flatMap((target) => target.blockers || []))
  ]);
  const canMutateProxy = blockers.length === 0
    && replaySummary.canReplayProxy === true
    && readyTargets.length === targets.length
    && writeIntentCount > 0
    && readyWriteIntentCount === writeIntentCount;
  const status = targets.length === 0
    ? 'idle'
    : canMutateProxy
      ? 'ready-reduced-target-buffer-mutation-audit'
      : readyTargets.length > 0
        ? 'partial-reduced-target-buffer-mutation-audit'
        : 'blocked';

  return {
    schema: MOLECULAR_TARGET_BUFFER_MUTATION_AUDIT_SCHEMA,
    mode: 'replay-validated-target-buffer-write-intents-v0',
    status,
    mutationAudited: canMutateProxy,
    canMutateProxy,
    canQueueWorkerWrite: false,
    workerWriteReady: false,
    scientificMutationReady: false,
    mutationApplied: false,
    scientificBlockers: [
      'live-worker-buffer-write-path-required',
      'calibrated-closure-required',
      'closed-enthalpy-balance-required',
      'stoichiometry-charge-invariant-required',
      'reference-mutation-replay-suite-required'
    ],
    timeSeconds: rounded(timeSeconds, 3),
    sourceTargetBufferReplayValidationSchema: targetBufferReplayValidation?.schema || null,
    sourceBufferApplicationAggregateSchema: sourceBufferApplicationAggregate?.schema
      || replaySummary.sourceBufferApplicationAggregateSchema
      || null,
    sourceBufferWritebackValidationSchema: sourceBufferWritebackValidation?.schema
      || replaySummary.sourceBufferWritebackValidationSchema
      || null,
    sourceApplyExecutionSequence: replaySummary.sourceApplyExecutionSequence ?? null,
    targetCount: targets.length,
    readyTargetCount: readyTargets.length,
    blockedTargetCount: blockedTargets.length,
    replayValidatedTargetCount: Math.max(0, Math.round(finite(replaySummary.replayedTargetCount))),
    replayBlockedTargetCount: Math.max(0, Math.round(finite(replaySummary.blockedTargetCount))),
    writeIntentCount,
    readyWriteIntentCount,
    blockedWriteIntentCount,
    queuedWriteIntentCount: 0,
    appliedWriteIntentCount: 0,
    maxMutationAuditResidualProxy: rounded(maxMutationAuditResidualProxy, 9),
    replayFieldCount: Math.max(0, Math.round(finite(replaySummary.replayedFieldCount))),
    missingReplayFieldCount: Math.max(0, Math.round(finite(replaySummary.missingFieldCount))),
    targets,
    blockerCount: blockers.length,
    blockers,
    validity: {
      status: 'interactive-proxy-target-mutation-audit',
      confidence: 0.14,
      warnings: [
        'This builds reduced target write intents from replay-validated target fields.',
        'No worker target buffer is mutated by this audit.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_BUFFER_MUTATION_AUDIT_SCHEMA,
      replayValidationSchema: targetBufferReplayValidation?.schema || null,
      writebackValidationSchema: sourceBufferWritebackValidation?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetBufferMutationAuditReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_BUFFER_MUTATION_AUDIT_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    mutationAudited: report.mutationAudited === true,
    canMutateProxy: report.canMutateProxy === true,
    canQueueWorkerWrite: report.canQueueWorkerWrite === true,
    workerWriteReady: report.workerWriteReady === true,
    scientificMutationReady: report.scientificMutationReady === true,
    mutationApplied: report.mutationApplied === true,
    sourceTargetBufferReplayValidationSchema: report.sourceTargetBufferReplayValidationSchema || null,
    sourceBufferApplicationAggregateSchema: report.sourceBufferApplicationAggregateSchema || null,
    sourceBufferWritebackValidationSchema: report.sourceBufferWritebackValidationSchema || null,
    sourceApplyExecutionSequence: report.sourceApplyExecutionSequence ?? null,
    targetCount: Math.max(0, Math.round(finite(report.targetCount))),
    readyTargetCount: Math.max(0, Math.round(finite(report.readyTargetCount))),
    blockedTargetCount: Math.max(0, Math.round(finite(report.blockedTargetCount))),
    replayValidatedTargetCount: Math.max(0, Math.round(finite(report.replayValidatedTargetCount))),
    replayBlockedTargetCount: Math.max(0, Math.round(finite(report.replayBlockedTargetCount))),
    writeIntentCount: Math.max(0, Math.round(finite(report.writeIntentCount))),
    readyWriteIntentCount: Math.max(0, Math.round(finite(report.readyWriteIntentCount))),
    blockedWriteIntentCount: Math.max(0, Math.round(finite(report.blockedWriteIntentCount))),
    queuedWriteIntentCount: Math.max(0, Math.round(finite(report.queuedWriteIntentCount))),
    appliedWriteIntentCount: Math.max(0, Math.round(finite(report.appliedWriteIntentCount))),
    replayFieldCount: Math.max(0, Math.round(finite(report.replayFieldCount))),
    missingReplayFieldCount: Math.max(0, Math.round(finite(report.missingReplayFieldCount))),
    maxMutationAuditResidualProxy: finite(report.maxMutationAuditResidualProxy),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : [],
    scientificBlockers: Array.isArray(report.scientificBlockers) ? [...report.scientificBlockers] : [],
    targets: Array.isArray(report.targets)
      ? report.targets.map((target) => ({
        targetSolverId: target.targetSolverId || 'unknown',
        ready: target.ready === true,
        replayed: target.replayed === true,
        writeIntentCount: Math.max(0, Math.round(finite(target.writeIntentCount))),
        readyWriteIntentCount: Math.max(0, Math.round(finite(target.readyWriteIntentCount))),
        blockedWriteIntentCount: Math.max(0, Math.round(finite(target.blockedWriteIntentCount))),
        maxMutationAuditResidualProxy: finite(target.maxMutationAuditResidualProxy),
        blockerCount: Math.max(0, Math.round(finite(target.blockerCount, target.blockers?.length)))
      }))
      : []
  };
}

function makeTargetBufferWorkerWriteQueueBatch(target = {}) {
  const writeIntents = Array.isArray(target.writeIntents) ? target.writeIntents : [];
  const readyIntents = writeIntents.filter((intent) => intent.ready === true);
  const blockedIntents = writeIntents.filter((intent) => intent.ready !== true);
  const queueReady = target.ready === true
    && writeIntents.length > 0
    && readyIntents.length === writeIntents.length;
  const maxQueueResidualProxy = Math.max(
    0,
    ...writeIntents.map((intent) => finite(intent.replayResidualProxy))
  );
  const auditBlockers = uniqueStrings([
    target.ready === true ? null : 'target-mutation-audit-not-ready',
    writeIntents.length > 0 ? null : 'no-write-intents',
    blockedIntents.length === 0 ? null : 'blocked-write-intents',
    ...(target.blockers || []),
    ...(blockedIntents.flatMap((intent) => intent.blockers || []))
  ]);
  const queueBlockers = uniqueStrings([
    ...auditBlockers,
    queueReady ? 'worker-buffer-write-path-not-implemented' : null
  ]);
  return {
    targetSolverId: target.targetSolverId || 'unknown',
    targetStateKey: target.targetStateKey || null,
    targetLayer: target.targetLayer || 'unknown',
    targetSequence: target.targetSequence ?? null,
    targetSnapshotSequence: target.targetSnapshotSequence ?? null,
    auditReady: target.ready === true,
    queueReady,
    queued: false,
    dispatched: false,
    workerWriteReady: false,
    writeIntentCount: writeIntents.length,
    queueReadyWriteIntentCount: readyIntents.length,
    blockedWriteIntentCount: blockedIntents.length,
    queuedWriteIntentCount: 0,
    dispatchedWriteIntentCount: 0,
    estimatedPackedFloatCount: readyIntents.length * 4,
    maxQueueResidualProxy: rounded(maxQueueResidualProxy, 9),
    fieldWrites: writeIntents.map((intent) => ({
      targetSolverId: intent.targetSolverId || target.targetSolverId || 'unknown',
      targetStateKey: intent.targetStateKey || target.targetStateKey || null,
      field: intent.field || 'unknown',
      unit: intent.unit || '1',
      dimensions: intent.dimensions || '1',
      sourceTerm: intent.sourceTerm || null,
      before: Number.isFinite(finite(intent.before, NaN)) ? finite(intent.before) : null,
      expectedAfter: Number.isFinite(finite(intent.expectedAfter, NaN)) ? finite(intent.expectedAfter) : null,
      delta: Number.isFinite(finite(intent.delta, NaN)) ? finite(intent.delta) : null,
      replayResidualProxy: Number.isFinite(finite(intent.replayResidualProxy, NaN))
        ? rounded(intent.replayResidualProxy, 9)
        : null,
      queueReady: intent.ready === true,
      queued: false,
      dispatched: false,
      workerWriteReady: false,
      blockers: Array.isArray(intent.blockers) ? [...intent.blockers] : []
    })),
    blockerCount: queueBlockers.length,
    blockers: queueBlockers
  };
}

export function createMolecularTargetBufferWorkerWriteQueueReport({
  targetBufferMutationAudit = null,
  timeSeconds = 0
} = {}) {
  const auditSummary = summarizeMolecularTargetBufferMutationAuditReport(targetBufferMutationAudit) || {};
  const hasAuditSchema = targetBufferMutationAudit?.schema === MOLECULAR_TARGET_BUFFER_MUTATION_AUDIT_SCHEMA;
  const auditTargets = Array.isArray(targetBufferMutationAudit?.targets)
    ? targetBufferMutationAudit.targets
    : [];
  const targetBatches = auditTargets.map((target) => makeTargetBufferWorkerWriteQueueBatch(target));
  const queueReadyBatches = targetBatches.filter((batch) => batch.queueReady);
  const queueBlockedBatches = targetBatches.filter((batch) => !batch.queueReady);
  const writeIntentCount = targetBatches.reduce((sum, batch) => sum + finite(batch.writeIntentCount), 0);
  const queueReadyWriteIntentCount = targetBatches.reduce((sum, batch) => sum + finite(batch.queueReadyWriteIntentCount), 0);
  const blockedWriteIntentCount = targetBatches.reduce((sum, batch) => sum + finite(batch.blockedWriteIntentCount), 0);
  const estimatedPackedFloatCount = targetBatches.reduce((sum, batch) => sum + finite(batch.estimatedPackedFloatCount), 0);
  const maxQueueResidualProxy = Math.max(
    0,
    ...targetBatches.map((batch) => finite(batch.maxQueueResidualProxy))
  );
  const canPlanWorkerWrite = hasAuditSchema
    && auditSummary.canMutateProxy === true
    && targetBatches.length > 0
    && queueReadyBatches.length === targetBatches.length
    && writeIntentCount > 0
    && queueReadyWriteIntentCount === writeIntentCount;
  const blockers = uniqueStrings([
    hasAuditSchema ? null : 'missing-target-buffer-mutation-audit',
    auditSummary.canMutateProxy === true ? null : 'target-buffer-mutation-audit-not-ready',
    targetBatches.length > 0 ? null : 'no-target-write-batches',
    writeIntentCount > 0 ? null : 'no-write-intents',
    queueBlockedBatches.length === 0 ? null : 'target-write-batch-blocked',
    blockedWriteIntentCount === 0 ? null : 'blocked-write-intents',
    canPlanWorkerWrite ? 'worker-buffer-write-path-not-implemented' : null,
    ...(queueBlockedBatches.flatMap((batch) => batch.blockers || []))
  ]);
  const status = targetBatches.length === 0
    ? 'idle'
    : canPlanWorkerWrite
      ? 'planned-worker-write-queue-blocked'
      : 'blocked-worker-write-queue-plan';

  return {
    schema: MOLECULAR_TARGET_BUFFER_WORKER_WRITE_QUEUE_SCHEMA,
    mode: 'target-buffer-worker-write-queue-plan-v0',
    status,
    queuePlanned: canPlanWorkerWrite,
    canPlanWorkerWrite,
    canQueueWorkerWrite: false,
    workerWriteReady: false,
    scientificMutationReady: false,
    queued: false,
    dispatched: false,
    applied: false,
    scientificBlockers: [
      'live-worker-buffer-write-path-required',
      'target-worker-queue-dispatch-required',
      'calibrated-conservative-writeback-required',
      'reference-worker-write-replay-suite-required'
    ],
    timeSeconds: rounded(timeSeconds, 3),
    sourceTargetBufferMutationAuditSchema: targetBufferMutationAudit?.schema || null,
    sourceTargetBufferReplayValidationSchema: auditSummary.sourceTargetBufferReplayValidationSchema || null,
    sourceBufferWritebackValidationSchema: auditSummary.sourceBufferWritebackValidationSchema || null,
    sourceBufferApplicationAggregateSchema: auditSummary.sourceBufferApplicationAggregateSchema || null,
    sourceApplyExecutionSequence: auditSummary.sourceApplyExecutionSequence ?? null,
    targetBatchCount: targetBatches.length,
    queueReadyBatchCount: queueReadyBatches.length,
    queueBlockedBatchCount: queueBlockedBatches.length,
    writeIntentCount,
    queueReadyWriteIntentCount,
    blockedWriteIntentCount,
    queuedWriteIntentCount: 0,
    dispatchedWriteIntentCount: 0,
    appliedWriteIntentCount: 0,
    estimatedPackedFloatCount,
    maxQueueResidualProxy: rounded(maxQueueResidualProxy, 9),
    targetBatches,
    blockerCount: blockers.length,
    blockers,
    validity: {
      status: 'interactive-proxy-worker-write-queue-plan',
      confidence: 0.12,
      warnings: [
        'This packages reduced replay-ready target-buffer write intents into target worker batches.',
        'No target worker buffer write is queued, dispatched, or applied by this report.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_BUFFER_WORKER_WRITE_QUEUE_SCHEMA,
      mutationAuditSchema: targetBufferMutationAudit?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetBufferWorkerWriteQueueReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_BUFFER_WORKER_WRITE_QUEUE_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    queuePlanned: report.queuePlanned === true,
    canPlanWorkerWrite: report.canPlanWorkerWrite === true,
    canQueueWorkerWrite: report.canQueueWorkerWrite === true,
    workerWriteReady: report.workerWriteReady === true,
    scientificMutationReady: report.scientificMutationReady === true,
    queued: report.queued === true,
    dispatched: report.dispatched === true,
    applied: report.applied === true,
    sourceTargetBufferMutationAuditSchema: report.sourceTargetBufferMutationAuditSchema || null,
    sourceTargetBufferReplayValidationSchema: report.sourceTargetBufferReplayValidationSchema || null,
    sourceBufferWritebackValidationSchema: report.sourceBufferWritebackValidationSchema || null,
    sourceBufferApplicationAggregateSchema: report.sourceBufferApplicationAggregateSchema || null,
    sourceApplyExecutionSequence: report.sourceApplyExecutionSequence ?? null,
    targetBatchCount: Math.max(0, Math.round(finite(report.targetBatchCount))),
    queueReadyBatchCount: Math.max(0, Math.round(finite(report.queueReadyBatchCount))),
    queueBlockedBatchCount: Math.max(0, Math.round(finite(report.queueBlockedBatchCount))),
    writeIntentCount: Math.max(0, Math.round(finite(report.writeIntentCount))),
    queueReadyWriteIntentCount: Math.max(0, Math.round(finite(report.queueReadyWriteIntentCount))),
    blockedWriteIntentCount: Math.max(0, Math.round(finite(report.blockedWriteIntentCount))),
    queuedWriteIntentCount: Math.max(0, Math.round(finite(report.queuedWriteIntentCount))),
    dispatchedWriteIntentCount: Math.max(0, Math.round(finite(report.dispatchedWriteIntentCount))),
    appliedWriteIntentCount: Math.max(0, Math.round(finite(report.appliedWriteIntentCount))),
    estimatedPackedFloatCount: Math.max(0, Math.round(finite(report.estimatedPackedFloatCount))),
    maxQueueResidualProxy: finite(report.maxQueueResidualProxy),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : [],
    scientificBlockers: Array.isArray(report.scientificBlockers) ? [...report.scientificBlockers] : [],
    targetBatches: Array.isArray(report.targetBatches)
      ? report.targetBatches.map((batch) => ({
        targetSolverId: batch.targetSolverId || 'unknown',
        targetStateKey: batch.targetStateKey || null,
        queueReady: batch.queueReady === true,
        queued: batch.queued === true,
        writeIntentCount: Math.max(0, Math.round(finite(batch.writeIntentCount))),
        queueReadyWriteIntentCount: Math.max(0, Math.round(finite(batch.queueReadyWriteIntentCount))),
        blockedWriteIntentCount: Math.max(0, Math.round(finite(batch.blockedWriteIntentCount))),
        estimatedPackedFloatCount: Math.max(0, Math.round(finite(batch.estimatedPackedFloatCount))),
        maxQueueResidualProxy: finite(batch.maxQueueResidualProxy),
        blockerCount: Math.max(0, Math.round(finite(batch.blockerCount, batch.blockers?.length)))
      }))
      : []
  };
}

function summarizeWorkerWriteAppliedBatch(batch = {}) {
  const fieldWrites = Array.isArray(batch.fieldWrites) ? batch.fieldWrites : [];
  const appliedWrites = fieldWrites.filter((write) => write.applied === true);
  const skippedWrites = fieldWrites.filter((write) => write.applied !== true);
  const maxWorkerWriteResidualProxy = Math.max(
    0,
    ...fieldWrites.map((write) => finite(write.workerWriteResidualProxy))
  );
  const blockers = uniqueStrings([
    batch.applied === true ? null : 'target-worker-write-not-applied',
    appliedWrites.length > 0 ? null : 'no-field-writes-applied',
    ...(batch.blockers || []),
    ...(skippedWrites.flatMap((write) => write.blockers || []))
  ]);
  return {
    targetSolverId: batch.targetSolverId || 'unknown',
    targetStateKey: batch.targetStateKey || null,
    targetLayer: batch.targetLayer || 'unknown',
    targetSequence: batch.targetSequence ?? null,
    targetSnapshotSequence: batch.targetSnapshotSequence ?? null,
    queueReady: batch.queueReady === true,
    queued: batch.queued === true,
    dispatched: batch.dispatched === true,
    applied: batch.applied === true,
    workerWriteReady: batch.workerWriteReady === true,
    writeIntentCount: Math.max(0, Math.round(finite(batch.writeIntentCount, fieldWrites.length))),
    queuedWriteIntentCount: Math.max(0, Math.round(finite(batch.queuedWriteIntentCount, appliedWrites.length + skippedWrites.length))),
    dispatchedWriteIntentCount: Math.max(0, Math.round(finite(batch.dispatchedWriteIntentCount, appliedWrites.length + skippedWrites.length))),
    appliedWriteIntentCount: appliedWrites.length,
    skippedWriteIntentCount: skippedWrites.length,
    stateWriteSetCount: Math.max(0, Math.round(finite(batch.stateWriteSetCount, new Set(appliedWrites.map((write) => write.field)).size))),
    maxWorkerWriteResidualProxy: rounded(maxWorkerWriteResidualProxy, 9),
    fieldWrites,
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularTargetBufferWorkerWriteExecutionReport({
  targetBufferWorkerWriteQueue = null,
  appliedBatches = [],
  executionRequested = false,
  proxyWorkerWriteEnabled = false,
  targetWorkerWriteImplemented = false,
  residualToleranceProxy = 0.000001,
  timeSeconds = 0,
  reason = 'preview',
  sequence = 0
} = {}) {
  const queueSummary = summarizeMolecularTargetBufferWorkerWriteQueueReport(targetBufferWorkerWriteQueue) || {};
  const hasQueueSchema = targetBufferWorkerWriteQueue?.schema === MOLECULAR_TARGET_BUFFER_WORKER_WRITE_QUEUE_SCHEMA;
  const queueBatches = Array.isArray(targetBufferWorkerWriteQueue?.targetBatches)
    ? targetBufferWorkerWriteQueue.targetBatches
    : [];
  const appliedBySolver = new Map((Array.isArray(appliedBatches) ? appliedBatches : [])
    .map((batch) => [batch.targetSolverId || 'unknown', summarizeWorkerWriteAppliedBatch(batch)]));
  const targets = queueBatches.map((batch) => {
    const applied = appliedBySolver.get(batch.targetSolverId || 'unknown');
    if (applied) {
      return {
        ...applied,
        targetStateKey: applied.targetStateKey || batch.targetStateKey || null,
        targetLayer: applied.targetLayer || batch.targetLayer || 'unknown',
        targetSequence: applied.targetSequence ?? batch.targetSequence ?? null,
        targetSnapshotSequence: applied.targetSnapshotSequence ?? batch.targetSnapshotSequence ?? null,
        queueReady: batch.queueReady === true,
        writeIntentCount: Math.max(0, Math.round(finite(batch.writeIntentCount, applied.writeIntentCount))),
        queuedWriteIntentCount: Math.max(0, Math.round(finite(applied.queuedWriteIntentCount))),
        dispatchedWriteIntentCount: Math.max(0, Math.round(finite(applied.dispatchedWriteIntentCount)))
      };
    }
    const blockers = uniqueStrings([
      batch.queueReady === true ? null : 'target-write-batch-not-ready',
      'target-worker-write-not-executed',
      ...(batch.blockers || [])
    ]);
    return {
      targetSolverId: batch.targetSolverId || 'unknown',
      targetStateKey: batch.targetStateKey || null,
      targetLayer: batch.targetLayer || 'unknown',
      targetSequence: batch.targetSequence ?? null,
      targetSnapshotSequence: batch.targetSnapshotSequence ?? null,
      queueReady: batch.queueReady === true,
      queued: false,
      dispatched: false,
      applied: false,
      workerWriteReady: false,
      writeIntentCount: Math.max(0, Math.round(finite(batch.writeIntentCount))),
      queuedWriteIntentCount: 0,
      dispatchedWriteIntentCount: 0,
      appliedWriteIntentCount: 0,
      skippedWriteIntentCount: Math.max(0, Math.round(finite(batch.writeIntentCount))),
      stateWriteSetCount: 0,
      maxWorkerWriteResidualProxy: finite(batch.maxQueueResidualProxy),
      fieldWrites: [],
      blockerCount: blockers.length,
      blockers
    };
  });
  const appliedTargetBatches = targets.filter((target) => target.applied === true);
  const blockedTargetBatches = targets.filter((target) => target.applied !== true);
  const writeIntentCount = targets.reduce((sum, target) => sum + finite(target.writeIntentCount), 0);
  const queuedWriteIntentCount = targets.reduce((sum, target) => sum + finite(target.queuedWriteIntentCount), 0);
  const dispatchedWriteIntentCount = targets.reduce((sum, target) => sum + finite(target.dispatchedWriteIntentCount), 0);
  const appliedWriteIntentCount = targets.reduce((sum, target) => sum + finite(target.appliedWriteIntentCount), 0);
  const skippedWriteIntentCount = targets.reduce((sum, target) => sum + finite(target.skippedWriteIntentCount), 0);
  const stateWriteSetCount = targets.reduce((sum, target) => sum + finite(target.stateWriteSetCount), 0);
  const maxWorkerWriteResidualProxy = Math.max(
    0,
    ...targets.map((target) => finite(target.maxWorkerWriteResidualProxy))
  );
  const tolerance = Math.max(0, finite(residualToleranceProxy, 0.000001));
  const executionConfigReady = executionRequested === true
    && proxyWorkerWriteEnabled === true
    && targetWorkerWriteImplemented === true;
  const canExecuteProxy = hasQueueSchema
    && queueSummary.canPlanWorkerWrite === true
    && executionConfigReady
    && queueSummary.targetBatchCount > 0
    && queueSummary.queueReadyBatchCount === queueSummary.targetBatchCount
    && queueSummary.writeIntentCount > 0
    && queueSummary.queueReadyWriteIntentCount === queueSummary.writeIntentCount;
  const executed = canExecuteProxy
    && targets.length > 0
    && appliedTargetBatches.length === targets.length
    && appliedWriteIntentCount === writeIntentCount
    && maxWorkerWriteResidualProxy <= Math.max(tolerance, 0.000001);
  const blockers = uniqueStrings([
    hasQueueSchema ? null : 'missing-target-buffer-worker-write-queue',
    queueSummary.canPlanWorkerWrite === true ? null : 'target-buffer-worker-write-queue-not-ready',
    executionRequested === true ? null : 'worker-write-execution-not-requested',
    proxyWorkerWriteEnabled === true ? null : 'proxy-worker-write-disabled',
    targetWorkerWriteImplemented === true ? null : 'target-worker-write-not-implemented',
    queueSummary.targetBatchCount > 0 ? null : 'no-target-write-batches',
    writeIntentCount > 0 ? null : 'no-write-intents',
    appliedTargetBatches.length === targets.length && targets.length > 0 ? null : 'target-worker-write-batch-blocked',
    appliedWriteIntentCount === writeIntentCount && writeIntentCount > 0 ? null : 'target-worker-write-intent-not-applied',
    maxWorkerWriteResidualProxy <= Math.max(tolerance, 0.000001) ? null : 'target-worker-write-residual-over-tolerance',
    ...(blockedTargetBatches.flatMap((target) => target.blockers || []))
  ]);
  const status = targets.length === 0
    ? 'idle'
    : executed
      ? 'applied-reduced-worker-write-proxy'
      : appliedTargetBatches.length > 0
        ? 'partial-reduced-worker-write-proxy'
        : 'blocked-worker-write-execution';

  return {
    schema: MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA,
    mode: 'target-buffer-worker-write-execution-v0',
    status,
    reason,
    sequence: Math.max(0, Math.round(finite(sequence))),
    timeSeconds: rounded(timeSeconds, 3),
    sourceTargetBufferWorkerWriteQueueSchema: targetBufferWorkerWriteQueue?.schema || null,
    sourceTargetBufferMutationAuditSchema: queueSummary.sourceTargetBufferMutationAuditSchema || null,
    sourceTargetBufferReplayValidationSchema: queueSummary.sourceTargetBufferReplayValidationSchema || null,
    sourceBufferWritebackValidationSchema: queueSummary.sourceBufferWritebackValidationSchema || null,
    sourceBufferApplicationAggregateSchema: queueSummary.sourceBufferApplicationAggregateSchema || null,
    sourceApplyExecutionSequence: queueSummary.sourceApplyExecutionSequence ?? null,
    executionRequested: executionRequested === true,
    proxyWorkerWriteEnabled: proxyWorkerWriteEnabled === true,
    targetWorkerWriteImplemented: targetWorkerWriteImplemented === true,
    queuePlanned: queueSummary.queuePlanned === true,
    canPlanWorkerWrite: queueSummary.canPlanWorkerWrite === true,
    canExecuteProxy,
    workerWriteExecuted: executed,
    queued: executed,
    dispatched: executed,
    applied: executed,
    workerWriteReady: executed,
    scientificMutationReady: false,
    scientificBlockers: [
      'calibrated-conservative-writeback-required',
      'closed-enthalpy-balance-required',
      'stoichiometry-charge-invariant-required',
      'reference-worker-write-replay-suite-required',
      'authoritative-gpu-buffer-mutation-required'
    ],
    residualToleranceProxy: rounded(tolerance, 9),
    targetBatchCount: targets.length,
    queueReadyBatchCount: Math.max(0, Math.round(finite(queueSummary.queueReadyBatchCount))),
    appliedBatchCount: appliedTargetBatches.length,
    blockedBatchCount: blockedTargetBatches.length,
    writeIntentCount,
    queuedWriteIntentCount,
    dispatchedWriteIntentCount,
    appliedWriteIntentCount,
    skippedWriteIntentCount,
    stateWriteSetCount,
    maxWorkerWriteResidualProxy: rounded(maxWorkerWriteResidualProxy, 9),
    targets,
    blockerCount: blockers.length,
    blockers,
    validity: {
      status: 'interactive-proxy-worker-write-execution',
      confidence: 0.13,
      warnings: [
        'This explicitly writes replay-ready reduced target values into the interactive model target state.',
        'It is not yet an authoritative GPU worker-buffer write or calibrated scientific mutation.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA,
      queueSchema: targetBufferWorkerWriteQueue?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetBufferWorkerWriteExecutionReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    reason: report.reason || null,
    sequence: Math.max(0, Math.round(finite(report.sequence))),
    sourceTargetBufferWorkerWriteQueueSchema: report.sourceTargetBufferWorkerWriteQueueSchema || null,
    sourceTargetBufferMutationAuditSchema: report.sourceTargetBufferMutationAuditSchema || null,
    sourceTargetBufferReplayValidationSchema: report.sourceTargetBufferReplayValidationSchema || null,
    sourceBufferWritebackValidationSchema: report.sourceBufferWritebackValidationSchema || null,
    sourceBufferApplicationAggregateSchema: report.sourceBufferApplicationAggregateSchema || null,
    sourceApplyExecutionSequence: report.sourceApplyExecutionSequence ?? null,
    executionRequested: report.executionRequested === true,
    proxyWorkerWriteEnabled: report.proxyWorkerWriteEnabled === true,
    targetWorkerWriteImplemented: report.targetWorkerWriteImplemented === true,
    queuePlanned: report.queuePlanned === true,
    canPlanWorkerWrite: report.canPlanWorkerWrite === true,
    canExecuteProxy: report.canExecuteProxy === true,
    workerWriteExecuted: report.workerWriteExecuted === true,
    queued: report.queued === true,
    dispatched: report.dispatched === true,
    applied: report.applied === true,
    workerWriteReady: report.workerWriteReady === true,
    scientificMutationReady: report.scientificMutationReady === true,
    residualToleranceProxy: finite(report.residualToleranceProxy),
    targetBatchCount: Math.max(0, Math.round(finite(report.targetBatchCount))),
    queueReadyBatchCount: Math.max(0, Math.round(finite(report.queueReadyBatchCount))),
    appliedBatchCount: Math.max(0, Math.round(finite(report.appliedBatchCount))),
    blockedBatchCount: Math.max(0, Math.round(finite(report.blockedBatchCount))),
    writeIntentCount: Math.max(0, Math.round(finite(report.writeIntentCount))),
    queuedWriteIntentCount: Math.max(0, Math.round(finite(report.queuedWriteIntentCount))),
    dispatchedWriteIntentCount: Math.max(0, Math.round(finite(report.dispatchedWriteIntentCount))),
    appliedWriteIntentCount: Math.max(0, Math.round(finite(report.appliedWriteIntentCount))),
    skippedWriteIntentCount: Math.max(0, Math.round(finite(report.skippedWriteIntentCount))),
    stateWriteSetCount: Math.max(0, Math.round(finite(report.stateWriteSetCount))),
    maxWorkerWriteResidualProxy: finite(report.maxWorkerWriteResidualProxy),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : [],
    scientificBlockers: Array.isArray(report.scientificBlockers) ? [...report.scientificBlockers] : [],
    targets: Array.isArray(report.targets)
      ? report.targets.map((target) => ({
        targetSolverId: target.targetSolverId || 'unknown',
        targetStateKey: target.targetStateKey || null,
        applied: target.applied === true,
        queued: target.queued === true,
        dispatched: target.dispatched === true,
        writeIntentCount: Math.max(0, Math.round(finite(target.writeIntentCount))),
        appliedWriteIntentCount: Math.max(0, Math.round(finite(target.appliedWriteIntentCount))),
        skippedWriteIntentCount: Math.max(0, Math.round(finite(target.skippedWriteIntentCount))),
        stateWriteSetCount: Math.max(0, Math.round(finite(target.stateWriteSetCount))),
        maxWorkerWriteResidualProxy: finite(target.maxWorkerWriteResidualProxy),
        blockerCount: Math.max(0, Math.round(finite(target.blockerCount, target.blockers?.length)))
      }))
      : []
  };
}

function makeWorkerWriteVerificationField(write = {}, snapshot = null, { verificationToleranceProxy = 0.000001 } = {}) {
  const field = write.field || 'unknown';
  const expectedAfter = Number.isFinite(finite(write.expectedAfterValue, NaN))
    ? finite(write.expectedAfterValue)
    : Number.isFinite(finite(write.actualAfterValue, NaN))
      ? finite(write.actualAfterValue)
      : Number.isFinite(finite(write.expectedAfter, NaN))
        ? finite(write.expectedAfter)
        : NaN;
  const snapshotValue = Number.isFinite(finite(snapshot?.fields?.[field], NaN))
    ? finite(snapshot.fields[field])
    : NaN;
  const tolerance = Math.max(0, finite(verificationToleranceProxy, 0.000001));
  const hasExpectedAfter = Number.isFinite(expectedAfter);
  const hasSnapshotField = Number.isFinite(snapshotValue);
  const verificationResidualProxy = hasExpectedAfter && hasSnapshotField
    ? Math.abs(snapshotValue - expectedAfter)
    : Infinity;
  const verified = write.applied === true
    && hasExpectedAfter
    && hasSnapshotField
    && verificationResidualProxy <= Math.max(tolerance, 0.000001);
  const blockers = uniqueStrings([
    write.applied === true ? null : 'field-write-not-applied',
    hasExpectedAfter ? null : 'missing-worker-write-expected-after-value',
    snapshot ? null : 'missing-live-target-snapshot',
    hasSnapshotField ? null : 'target-snapshot-field-missing',
    verified || !hasExpectedAfter || !hasSnapshotField ? null : 'worker-write-verification-residual-over-tolerance',
    ...(write.blockers || [])
  ]);
  return {
    targetSolverId: write.targetSolverId || snapshot?.targetSolverId || 'unknown',
    targetStateKey: write.targetStateKey || snapshot?.targetStateKey || null,
    field,
    unit: write.unit || '1',
    dimensions: write.dimensions || '1',
    sourceTerm: write.sourceTerm || null,
    expectedAfterValue: hasExpectedAfter ? rounded(expectedAfter, 9) : null,
    actualAfterValue: Number.isFinite(finite(write.actualAfterValue, NaN)) ? rounded(write.actualAfterValue, 9) : null,
    snapshotValue: hasSnapshotField ? rounded(snapshotValue, 9) : null,
    deltaValue: Number.isFinite(finite(write.deltaValue, NaN)) ? rounded(write.deltaValue, 9) : null,
    sourceDeltaValue: Number.isFinite(finite(write.sourceDeltaValue, NaN)) ? rounded(write.sourceDeltaValue, 9) : null,
    applied: write.applied === true,
    snapshotObserved: !!snapshot,
    snapshotFieldObserved: hasSnapshotField,
    verified,
    verificationResidualProxy: Number.isFinite(verificationResidualProxy)
      ? rounded(verificationResidualProxy, 12)
      : null,
    verificationToleranceProxy: rounded(tolerance, 9),
    blockerCount: blockers.length,
    blockers
  };
}

function makeWorkerWriteVerificationTarget(target = {}, snapshot = null, { verificationToleranceProxy = 0.000001 } = {}) {
  const fieldWrites = Array.isArray(target.fieldWrites) ? target.fieldWrites : [];
  const fields = fieldWrites.map((write) => makeWorkerWriteVerificationField(write, snapshot, {
    verificationToleranceProxy
  }));
  const verifiedFields = fields.filter((field) => field.verified);
  const appliedFields = fields.filter((field) => field.applied);
  const missingFields = fields.filter((field) => !field.snapshotFieldObserved);
  const mismatchedFields = fields.filter((field) => (
    field.snapshotFieldObserved
    && field.applied === true
    && Number.isFinite(finite(field.verificationResidualProxy, NaN))
    && finite(field.verificationResidualProxy) > Math.max(verificationToleranceProxy, 0.000001)
  ));
  const skippedFields = fields.filter((field) => field.applied !== true);
  const maxVerificationResidualProxy = Math.max(
    0,
    ...fields.map((field) => finite(field.verificationResidualProxy))
  );
  const verified = target.applied === true
    && !!snapshot
    && fieldWrites.length > 0
    && appliedFields.length === fieldWrites.length
    && verifiedFields.length === fieldWrites.length
    && missingFields.length === 0
    && mismatchedFields.length === 0;
  const blockers = uniqueStrings([
    target.applied === true ? null : 'target-worker-write-not-applied',
    snapshot ? null : 'missing-live-target-snapshot',
    fieldWrites.length > 0 ? null : 'no-worker-write-fields-to-verify',
    appliedFields.length === fieldWrites.length && fieldWrites.length > 0 ? null : 'field-write-application-incomplete',
    verifiedFields.length === fieldWrites.length && fieldWrites.length > 0 ? null : 'field-write-verification-incomplete',
    missingFields.length === 0 ? null : 'target-snapshot-field-missing',
    mismatchedFields.length === 0 ? null : 'worker-write-verification-residual-over-tolerance',
    ...(target.blockers || []),
    ...(fields.flatMap((field) => field.blockers || []))
  ]);
  return {
    targetSolverId: target.targetSolverId || snapshot?.targetSolverId || 'unknown',
    targetStateKey: target.targetStateKey || snapshot?.targetStateKey || null,
    targetLayer: target.targetLayer || snapshot?.targetLayer || 'unknown',
    targetSequence: target.targetSequence ?? null,
    targetSnapshotSequence: target.targetSnapshotSequence ?? snapshot?.sequence ?? null,
    liveTargetSequence: snapshot?.sequence ?? null,
    executionApplied: target.applied === true,
    snapshotObserved: !!snapshot,
    verified,
    fieldWriteCount: fieldWrites.length,
    appliedFieldWriteCount: appliedFields.length,
    verifiedFieldWriteCount: verifiedFields.length,
    skippedFieldWriteCount: skippedFields.length,
    missingFieldWriteCount: missingFields.length,
    mismatchedFieldWriteCount: mismatchedFields.length,
    maxVerificationResidualProxy: rounded(maxVerificationResidualProxy, 12),
    fields,
    blockerCount: blockers.length,
    blockers
  };
}

export function createMolecularTargetBufferWorkerWriteVerificationReport({
  targetBufferWorkerWriteExecution = null,
  targetSnapshots = [],
  verificationToleranceProxy = 0.000001,
  timeSeconds = 0
} = {}) {
  const hasExecutionSchema = targetBufferWorkerWriteExecution?.schema === MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA;
  const executionSummary = summarizeMolecularTargetBufferWorkerWriteExecutionReport(targetBufferWorkerWriteExecution) || {};
  const snapshotsBySolver = new Map((Array.isArray(targetSnapshots) ? targetSnapshots : [])
    .filter((snapshot) => snapshot?.targetSolverId)
    .map((snapshot) => [snapshot.targetSolverId, snapshot]));
  const executionTargets = Array.isArray(targetBufferWorkerWriteExecution?.targets)
    ? targetBufferWorkerWriteExecution.targets
    : [];
  const tolerance = Math.max(0, finite(verificationToleranceProxy, 0.000001));
  const targets = executionTargets.map((target) => makeWorkerWriteVerificationTarget(
    target,
    snapshotsBySolver.get(target.targetSolverId || 'unknown') || null,
    { verificationToleranceProxy: tolerance }
  ));
  const verifiedTargets = targets.filter((target) => target.verified);
  const blockedTargets = targets.filter((target) => !target.verified);
  const fieldWriteCount = targets.reduce((sum, target) => sum + finite(target.fieldWriteCount), 0);
  const appliedFieldWriteCount = targets.reduce((sum, target) => sum + finite(target.appliedFieldWriteCount), 0);
  const verifiedFieldWriteCount = targets.reduce((sum, target) => sum + finite(target.verifiedFieldWriteCount), 0);
  const skippedFieldWriteCount = targets.reduce((sum, target) => sum + finite(target.skippedFieldWriteCount), 0);
  const missingFieldWriteCount = targets.reduce((sum, target) => sum + finite(target.missingFieldWriteCount), 0);
  const mismatchedFieldWriteCount = targets.reduce((sum, target) => sum + finite(target.mismatchedFieldWriteCount), 0);
  const maxVerificationResidualProxy = Math.max(
    0,
    ...targets.map((target) => finite(target.maxVerificationResidualProxy))
  );
  const canVerifyProxy = hasExecutionSchema
    && executionSummary.applied === true
    && executionSummary.workerWriteExecuted === true
    && targets.length > 0
    && verifiedTargets.length === targets.length
    && fieldWriteCount > 0
    && verifiedFieldWriteCount === fieldWriteCount
    && appliedFieldWriteCount === fieldWriteCount
    && skippedFieldWriteCount === 0
    && missingFieldWriteCount === 0
    && mismatchedFieldWriteCount === 0
    && maxVerificationResidualProxy <= Math.max(tolerance, 0.000001);
  const blockers = uniqueStrings([
    hasExecutionSchema ? null : 'missing-target-buffer-worker-write-execution',
    executionSummary.applied === true ? null : 'worker-write-execution-not-applied',
    executionSummary.workerWriteExecuted === true ? null : 'worker-write-execution-not-confirmed',
    targets.length > 0 ? null : 'no-worker-write-targets-to-verify',
    fieldWriteCount > 0 ? null : 'no-worker-write-fields-to-verify',
    verifiedTargets.length === targets.length && targets.length > 0 ? null : 'target-worker-write-verification-blocked',
    appliedFieldWriteCount === fieldWriteCount && fieldWriteCount > 0 ? null : 'field-write-application-incomplete',
    verifiedFieldWriteCount === fieldWriteCount && fieldWriteCount > 0 ? null : 'field-write-verification-incomplete',
    skippedFieldWriteCount === 0 ? null : 'field-write-skipped',
    missingFieldWriteCount === 0 ? null : 'target-snapshot-field-missing',
    mismatchedFieldWriteCount === 0 ? null : 'worker-write-verification-residual-over-tolerance',
    maxVerificationResidualProxy <= Math.max(tolerance, 0.000001) ? null : 'worker-write-verification-max-residual-over-tolerance',
    ...(blockedTargets.flatMap((target) => target.blockers || []))
  ]);
  const status = targets.length === 0
    ? 'idle'
    : canVerifyProxy
      ? 'validated-reduced-worker-write-verification-proxy'
      : verifiedTargets.length > 0
        ? 'partial-reduced-worker-write-verification-proxy'
        : 'blocked-worker-write-verification';

  return {
    schema: MOLECULAR_TARGET_BUFFER_WORKER_WRITE_VERIFICATION_SCHEMA,
    mode: 'target-buffer-worker-write-verification-v0',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    sourceTargetBufferWorkerWriteExecutionSchema: targetBufferWorkerWriteExecution?.schema || null,
    sourceTargetBufferWorkerWriteQueueSchema: executionSummary.sourceTargetBufferWorkerWriteQueueSchema || null,
    sourceTargetBufferMutationAuditSchema: executionSummary.sourceTargetBufferMutationAuditSchema || null,
    sourceTargetBufferReplayValidationSchema: executionSummary.sourceTargetBufferReplayValidationSchema || null,
    sourceBufferWritebackValidationSchema: executionSummary.sourceBufferWritebackValidationSchema || null,
    sourceBufferApplicationAggregateSchema: executionSummary.sourceBufferApplicationAggregateSchema || null,
    sourceApplyExecutionSequence: executionSummary.sourceApplyExecutionSequence ?? null,
    executionSequence: executionSummary.sequence ?? null,
    executionApplied: executionSummary.applied === true,
    workerWriteExecuted: executionSummary.workerWriteExecuted === true,
    canVerifyProxy,
    verified: canVerifyProxy,
    scientificMutationReady: false,
    scientificBlockers: [
      'authoritative-gpu-buffer-mutation-required',
      'calibrated-conservative-writeback-required',
      'closed-enthalpy-balance-required',
      'stoichiometry-charge-invariant-required',
      'reference-worker-write-replay-suite-required'
    ],
    verificationToleranceProxy: rounded(tolerance, 9),
    targetBatchCount: targets.length,
    targetCount: targets.length,
    verifiedTargetCount: verifiedTargets.length,
    blockedTargetCount: blockedTargets.length,
    snapshotTargetCount: snapshotsBySolver.size,
    fieldWriteCount,
    appliedFieldWriteCount,
    verifiedFieldWriteCount,
    skippedFieldWriteCount,
    missingFieldWriteCount,
    mismatchedFieldWriteCount,
    maxVerificationResidualProxy: rounded(maxVerificationResidualProxy, 12),
    targets,
    blockerCount: blockers.length,
    blockers,
    validity: {
      status: 'interactive-proxy-worker-write-verification',
      confidence: 0.14,
      warnings: [
        'This verifies reduced worker-write proxy values against current target snapshots.',
        'Scientific mutation still requires authoritative GPU worker-buffer writes and calibrated conservation invariants.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_TARGET_BUFFER_WORKER_WRITE_VERIFICATION_SCHEMA,
      executionSchema: targetBufferWorkerWriteExecution?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularTargetBufferWorkerWriteVerificationReport(report = null) {
  if (report?.schema !== MOLECULAR_TARGET_BUFFER_WORKER_WRITE_VERIFICATION_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    sourceTargetBufferWorkerWriteExecutionSchema: report.sourceTargetBufferWorkerWriteExecutionSchema || null,
    sourceTargetBufferWorkerWriteQueueSchema: report.sourceTargetBufferWorkerWriteQueueSchema || null,
    sourceTargetBufferMutationAuditSchema: report.sourceTargetBufferMutationAuditSchema || null,
    sourceTargetBufferReplayValidationSchema: report.sourceTargetBufferReplayValidationSchema || null,
    sourceBufferWritebackValidationSchema: report.sourceBufferWritebackValidationSchema || null,
    sourceBufferApplicationAggregateSchema: report.sourceBufferApplicationAggregateSchema || null,
    sourceApplyExecutionSequence: report.sourceApplyExecutionSequence ?? null,
    executionSequence: report.executionSequence ?? null,
    executionApplied: report.executionApplied === true,
    workerWriteExecuted: report.workerWriteExecuted === true,
    canVerifyProxy: report.canVerifyProxy === true,
    verified: report.verified === true,
    scientificMutationReady: report.scientificMutationReady === true,
    verificationToleranceProxy: finite(report.verificationToleranceProxy),
    targetBatchCount: Math.max(0, Math.round(finite(report.targetBatchCount, report.targetCount))),
    targetCount: Math.max(0, Math.round(finite(report.targetCount, report.targetBatchCount))),
    verifiedTargetCount: Math.max(0, Math.round(finite(report.verifiedTargetCount))),
    blockedTargetCount: Math.max(0, Math.round(finite(report.blockedTargetCount))),
    snapshotTargetCount: Math.max(0, Math.round(finite(report.snapshotTargetCount))),
    fieldWriteCount: Math.max(0, Math.round(finite(report.fieldWriteCount))),
    appliedFieldWriteCount: Math.max(0, Math.round(finite(report.appliedFieldWriteCount))),
    verifiedFieldWriteCount: Math.max(0, Math.round(finite(report.verifiedFieldWriteCount))),
    skippedFieldWriteCount: Math.max(0, Math.round(finite(report.skippedFieldWriteCount))),
    missingFieldWriteCount: Math.max(0, Math.round(finite(report.missingFieldWriteCount))),
    mismatchedFieldWriteCount: Math.max(0, Math.round(finite(report.mismatchedFieldWriteCount))),
    maxVerificationResidualProxy: finite(report.maxVerificationResidualProxy),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : [],
    scientificBlockers: Array.isArray(report.scientificBlockers) ? [...report.scientificBlockers] : [],
    targets: Array.isArray(report.targets)
      ? report.targets.map((target) => ({
        targetSolverId: target.targetSolverId || 'unknown',
        targetStateKey: target.targetStateKey || null,
        verified: target.verified === true,
        executionApplied: target.executionApplied === true,
        snapshotObserved: target.snapshotObserved === true,
        fieldWriteCount: Math.max(0, Math.round(finite(target.fieldWriteCount))),
        appliedFieldWriteCount: Math.max(0, Math.round(finite(target.appliedFieldWriteCount))),
        verifiedFieldWriteCount: Math.max(0, Math.round(finite(target.verifiedFieldWriteCount))),
        skippedFieldWriteCount: Math.max(0, Math.round(finite(target.skippedFieldWriteCount))),
        missingFieldWriteCount: Math.max(0, Math.round(finite(target.missingFieldWriteCount))),
        mismatchedFieldWriteCount: Math.max(0, Math.round(finite(target.mismatchedFieldWriteCount))),
        maxVerificationResidualProxy: finite(target.maxVerificationResidualProxy),
        blockerCount: Math.max(0, Math.round(finite(target.blockerCount, target.blockers?.length)))
      }))
      : []
  };
}

function createScientificInvariantScope({
  scope,
  category,
  requiredMode = 'authoritative',
  proxySatisfied = false,
  authoritativeSatisfied = false,
  evidence = {},
  blockers = []
} = {}) {
  const proxyOk = proxySatisfied === true;
  const authoritativeOk = authoritativeSatisfied === true;
  const mode = requiredMode || 'authoritative';
  const satisfied = mode === 'proxy' ? proxyOk : authoritativeOk;
  const status = satisfied
    ? 'satisfied'
    : proxyOk
      ? 'proxy-satisfied-authoritative-blocked'
      : 'blocked';
  return {
    scope: scope || 'unknown',
    category: category || 'unknown',
    requiredMode: mode,
    proxySatisfied: proxyOk,
    authoritativeSatisfied: authoritativeOk,
    satisfied,
    status,
    evidence,
    blockerCount: Array.isArray(blockers) ? blockers.length : 0,
    blockers: Array.isArray(blockers) ? [...blockers] : []
  };
}

export function createMolecularScientificInvariantGateReport({
  targetMutationInvariantCheck = null,
  sourceBufferAcceptance = null,
  sourceBufferWritebackValidation = null,
  targetBufferReplayValidation = null,
  targetBufferWorkerWriteVerification = null,
  timeSeconds = 0
} = {}) {
  const invariantSummary = summarizeMolecularTargetMutationInvariantCheckReport(targetMutationInvariantCheck) || {};
  const acceptanceSummary = summarizeMolecularSourceBufferAcceptanceReport(sourceBufferAcceptance) || {};
  const writebackSummary = summarizeMolecularSourceBufferWritebackValidationReport(sourceBufferWritebackValidation) || {};
  const replaySummary = summarizeMolecularTargetBufferReplayValidationReport(targetBufferReplayValidation) || {};
  const verificationSummary = summarizeMolecularTargetBufferWorkerWriteVerificationReport(targetBufferWorkerWriteVerification) || {};

  const targetCount = Math.max(
    0,
    Math.round(finite(
      verificationSummary.targetCount,
      verificationSummary.targetBatchCount ?? invariantSummary.targetCount
    ))
  );
  const invariantTargetCount = Math.max(0, Math.round(finite(invariantSummary.targetCount)));
  const invariantCoverageProxy = invariantTargetCount > 0
    && invariantSummary.passedTargetCount === invariantTargetCount
    && finite(invariantSummary.missingInvariantScopeCount) === 0
    && finite(invariantSummary.blockerCount) === 0;
  const acceptanceProxy = acceptanceSummary.canMutateProxy === true
    && finite(acceptanceSummary.blockedTargetCount) === 0
    && finite(acceptanceSummary.acceptedTargetCount) > 0;
  const writebackProxy = writebackSummary.canWritebackProxy === true
    && finite(writebackSummary.blockedTargetCount) === 0
    && finite(writebackSummary.validatedTargetCount) > 0;
  const replayProxy = replaySummary.canReplayProxy === true
    && finite(replaySummary.blockedTargetCount) === 0
    && finite(replaySummary.missingFieldCount) === 0
    && finite(replaySummary.replayedFieldCount) > 0;
  const workerVerificationProxy = verificationSummary.verified === true
    && verificationSummary.canVerifyProxy === true
    && finite(verificationSummary.blockedTargetCount) === 0
    && finite(verificationSummary.missingFieldWriteCount) === 0
    && finite(verificationSummary.mismatchedFieldWriteCount) === 0
    && finite(verificationSummary.verifiedFieldWriteCount) > 0;
  const unitMetadataProxy = Array.isArray(targetBufferWorkerWriteVerification?.targets)
    && targetBufferWorkerWriteVerification.targets.length > 0
    && targetBufferWorkerWriteVerification.targets
      .flatMap((target) => Array.isArray(target.fields) ? target.fields : [])
      .filter((field) => field.verified === true)
      .every((field) => (
        typeof field.unit === 'string'
        && field.unit.length > 0
        && field.unit !== 'unknown'
        && typeof field.dimensions === 'string'
        && field.dimensions.length > 0
        && field.dimensions !== 'unknown'
      ));
  const provenanceReplayProxy = replayProxy
    && workerVerificationProxy
    && verificationSummary.sourceApplyExecutionSequence !== null
    && verificationSummary.sourceTargetBufferWorkerWriteExecutionSchema === MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA;

  const scopes = [
    createScientificInvariantScope({
      scope: 'operation-invariant-coverage',
      category: 'operation-plan',
      requiredMode: 'authoritative',
      proxySatisfied: invariantCoverageProxy,
      evidence: {
        targetCount: invariantTargetCount,
        passedTargetCount: Math.max(0, Math.round(finite(invariantSummary.passedTargetCount))),
        missingInvariantScopeCount: Math.max(0, Math.round(finite(invariantSummary.missingInvariantScopeCount))),
        maxResidualProxy: finite(invariantSummary.maxResidualProxy)
      },
      blockers: uniqueStrings([
        invariantCoverageProxy ? null : 'operation-invariant-coverage-not-authoritative',
        'calibrated-invariant-residual-budgets-required'
      ])
    }),
    createScientificInvariantScope({
      scope: 'closed-enthalpy-energy-balance',
      category: 'thermodynamics',
      requiredMode: 'authoritative',
      proxySatisfied: acceptanceProxy && writebackProxy,
      evidence: {
        acceptedTargetCount: Math.max(0, Math.round(finite(acceptanceSummary.acceptedTargetCount))),
        validatedTargetCount: Math.max(0, Math.round(finite(writebackSummary.validatedTargetCount))),
        acceptanceResidualProxy: finite(acceptanceSummary.maxApplicationResidualProxy),
        writebackResidualProxy: finite(writebackSummary.maxWritebackResidualProxy)
      },
      blockers: [
        'calibrated-heat-capacity-enthalpy-model-required',
        'closed-energy-residual-reference-tolerance-required'
      ]
    }),
    createScientificInvariantScope({
      scope: 'stoichiometry-species-charge-balance',
      category: 'chemistry',
      requiredMode: 'authoritative',
      proxySatisfied: invariantCoverageProxy && acceptanceProxy,
      evidence: {
        acceptedTargetCount: Math.max(0, Math.round(finite(acceptanceSummary.acceptedTargetCount))),
        sourceTermCount: Math.max(0, Math.round(finite(acceptanceSummary.sourceTermCount))),
        expectedSourceTermCount: Math.max(0, Math.round(finite(acceptanceSummary.expectedSourceTermCount)))
      },
      blockers: [
        'stoichiometric-species-ledger-required',
        'charge-conservation-invariant-required'
      ]
    }),
    createScientificInvariantScope({
      scope: 'phase-latent-heat-balance',
      category: 'phase',
      requiredMode: 'authoritative',
      proxySatisfied: invariantCoverageProxy && writebackProxy,
      evidence: {
        validatedTargetCount: Math.max(0, Math.round(finite(writebackSummary.validatedTargetCount))),
        maxWritebackResidualProxy: finite(writebackSummary.maxWritebackResidualProxy)
      },
      blockers: [
        'calibrated-phase-fraction-eos-required',
        'latent-heat-source-sink-balance-required'
      ]
    }),
    createScientificInvariantScope({
      scope: 'unit-dimension-metadata',
      category: 'metadata',
      requiredMode: 'authoritative',
      proxySatisfied: unitMetadataProxy,
      evidence: {
        verifiedFieldWriteCount: Math.max(0, Math.round(finite(verificationSummary.verifiedFieldWriteCount))),
        fieldWriteCount: Math.max(0, Math.round(finite(verificationSummary.fieldWriteCount)))
      },
      blockers: [
        'unit-dimension-metadata-reference-review-required',
        'scientific-field-metadata-lock-required'
      ]
    }),
    createScientificInvariantScope({
      scope: 'provenance-replay',
      category: 'reproducibility',
      requiredMode: 'authoritative',
      proxySatisfied: provenanceReplayProxy,
      evidence: {
        sourceApplyExecutionSequence: verificationSummary.sourceApplyExecutionSequence ?? null,
        replayedFieldCount: Math.max(0, Math.round(finite(replaySummary.replayedFieldCount))),
        verifiedFieldWriteCount: Math.max(0, Math.round(finite(verificationSummary.verifiedFieldWriteCount)))
      },
      blockers: [
        'reference-replay-suite-required',
        'deterministic-worker-buffer-replay-required'
      ]
    }),
    createScientificInvariantScope({
      scope: 'authoritative-gpu-worker-buffer',
      category: 'execution',
      requiredMode: 'authoritative',
      proxySatisfied: workerVerificationProxy,
      authoritativeSatisfied: false,
      evidence: {
        targetCount,
        verifiedTargetCount: Math.max(0, Math.round(finite(verificationSummary.verifiedTargetCount))),
        verifiedFieldWriteCount: Math.max(0, Math.round(finite(verificationSummary.verifiedFieldWriteCount))),
        maxVerificationResidualProxy: finite(verificationSummary.maxVerificationResidualProxy)
      },
      blockers: [
        'authoritative-gpu-buffer-mutation-required',
        'worker-buffer-writeback-hook-required'
      ]
    })
  ];

  const proxySatisfiedScopeCount = scopes.filter((scope) => scope.proxySatisfied).length;
  const authoritativeSatisfiedScopeCount = scopes.filter((scope) => scope.authoritativeSatisfied).length;
  const blockedScopeCount = scopes.filter((scope) => !scope.satisfied).length;
  const requiredScopeCount = scopes.length;
  const scientificBlockers = uniqueStrings(scopes.flatMap((scope) => scope.blockers || []));
  const canPromoteProxy = workerVerificationProxy
    && replayProxy
    && writebackProxy
    && acceptanceProxy;
  const scientificMutationReady = requiredScopeCount > 0
    && authoritativeSatisfiedScopeCount === requiredScopeCount
    && scientificBlockers.length === 0;
  return {
    schema: MOLECULAR_SCIENTIFIC_INVARIANT_GATE_SCHEMA,
    mode: 'scientific-mutation-invariant-gate-v0',
    status: scientificMutationReady
      ? 'scientific-mutation-ready'
      : canPromoteProxy
        ? 'proxy-verified-scientific-blocked'
        : 'blocked',
    timeSeconds: rounded(timeSeconds, 3),
    scientificMutationReady,
    canPromoteProxy,
    promotionBlocked: !scientificMutationReady,
    targetCount,
    requiredScopeCount,
    proxySatisfiedScopeCount,
    authoritativeSatisfiedScopeCount,
    blockedScopeCount,
    missingAuthoritativeScopeCount: requiredScopeCount - authoritativeSatisfiedScopeCount,
    sourceTargetMutationInvariantCheckSchema: targetMutationInvariantCheck?.schema || null,
    sourceBufferAcceptanceSchema: sourceBufferAcceptance?.schema || null,
    sourceBufferWritebackValidationSchema: sourceBufferWritebackValidation?.schema || null,
    sourceTargetBufferReplayValidationSchema: targetBufferReplayValidation?.schema || null,
    sourceTargetBufferWorkerWriteVerificationSchema: targetBufferWorkerWriteVerification?.schema || null,
    workerWriteVerified: workerVerificationProxy,
    replayVerified: replayProxy,
    writebackValidated: writebackProxy,
    sourceBufferAccepted: acceptanceProxy,
    invariantCoverageProxy,
    unitMetadataProxy,
    provenanceReplayProxy,
    maxVerificationResidualProxy: finite(verificationSummary.maxVerificationResidualProxy),
    maxReplayResidualProxy: finite(replaySummary.maxReplayResidualProxy),
    maxWritebackResidualProxy: finite(writebackSummary.maxWritebackResidualProxy),
    maxAcceptanceResidualProxy: finite(acceptanceSummary.maxApplicationResidualProxy),
    scopes,
    blockerCount: scientificBlockers.length,
    scientificBlockers,
    blockers: scientificBlockers,
    validity: {
      status: 'scientific-mutation-blocker-inventory',
      confidence: 0.16,
      warnings: [
        'This gate inventories required scientific invariants after proxy worker-write verification.',
        'It does not authorize calibrated conservative mutation until all authoritative scopes are satisfied.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_SCIENTIFIC_INVARIANT_GATE_SCHEMA,
      verificationSchema: targetBufferWorkerWriteVerification?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularScientificInvariantGateReport(report = null) {
  if (report?.schema !== MOLECULAR_SCIENTIFIC_INVARIANT_GATE_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    scientificMutationReady: report.scientificMutationReady === true,
    canPromoteProxy: report.canPromoteProxy === true,
    promotionBlocked: report.promotionBlocked !== false,
    targetCount: Math.max(0, Math.round(finite(report.targetCount))),
    requiredScopeCount: Math.max(0, Math.round(finite(report.requiredScopeCount))),
    proxySatisfiedScopeCount: Math.max(0, Math.round(finite(report.proxySatisfiedScopeCount))),
    authoritativeSatisfiedScopeCount: Math.max(0, Math.round(finite(report.authoritativeSatisfiedScopeCount))),
    blockedScopeCount: Math.max(0, Math.round(finite(report.blockedScopeCount))),
    missingAuthoritativeScopeCount: Math.max(0, Math.round(finite(report.missingAuthoritativeScopeCount))),
    workerWriteVerified: report.workerWriteVerified === true,
    replayVerified: report.replayVerified === true,
    writebackValidated: report.writebackValidated === true,
    sourceBufferAccepted: report.sourceBufferAccepted === true,
    invariantCoverageProxy: report.invariantCoverageProxy === true,
    unitMetadataProxy: report.unitMetadataProxy === true,
    provenanceReplayProxy: report.provenanceReplayProxy === true,
    maxVerificationResidualProxy: finite(report.maxVerificationResidualProxy),
    maxReplayResidualProxy: finite(report.maxReplayResidualProxy),
    maxWritebackResidualProxy: finite(report.maxWritebackResidualProxy),
    maxAcceptanceResidualProxy: finite(report.maxAcceptanceResidualProxy),
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : [],
    scientificBlockers: Array.isArray(report.scientificBlockers) ? [...report.scientificBlockers] : [],
    scopes: Array.isArray(report.scopes)
      ? report.scopes.map((scope) => ({
        scope: scope.scope || 'unknown',
        category: scope.category || 'unknown',
        requiredMode: scope.requiredMode || 'authoritative',
        proxySatisfied: scope.proxySatisfied === true,
        authoritativeSatisfied: scope.authoritativeSatisfied === true,
        satisfied: scope.satisfied === true,
        status: scope.status || 'unknown',
        blockerCount: Math.max(0, Math.round(finite(scope.blockerCount, scope.blockers?.length)))
      }))
      : []
  };
}

function findScientificScope(scopes = [], scopeId = '') {
  return (Array.isArray(scopes) ? scopes : [])
    .find((scope) => scope?.scope === scopeId) || null;
}

function createReadinessArtifact({
  artifactId,
  category,
  label,
  requiredScopes = [],
  description = '',
  proxySatisfied = false,
  authoritativeSatisfied = false,
  blockers = [],
  evidence = {},
  priority = 0
} = {}) {
  const proxyOk = proxySatisfied === true;
  const authoritativeOk = authoritativeSatisfied === true;
  const artifactBlockers = uniqueStrings(blockers);
  return {
    artifactId: artifactId || 'unknown-artifact',
    category: category || 'unknown',
    label: label || artifactId || 'unknown',
    requiredScopes: uniqueStrings(requiredScopes),
    requiredScopeCount: uniqueStrings(requiredScopes).length,
    description,
    priority: Math.max(0, Math.round(finite(priority))),
    proxySatisfied: proxyOk,
    authoritativeSatisfied: authoritativeOk,
    status: authoritativeOk
      ? 'authoritative-ready'
      : proxyOk
        ? 'proxy-evidence-authoritative-blocked'
        : 'blocked',
    blockerCount: artifactBlockers.length,
    blockers: artifactBlockers,
    evidence
  };
}

export function createMolecularScientificReadinessManifestReport({
  scientificInvariantGate = null,
  targetBufferWorkerWriteVerification = null,
  timeSeconds = 0
} = {}) {
  const gateSummary = summarizeMolecularScientificInvariantGateReport(scientificInvariantGate) || {};
  const gateScopes = Array.isArray(scientificInvariantGate?.scopes) ? scientificInvariantGate.scopes : [];
  const verificationSummary =
    summarizeMolecularTargetBufferWorkerWriteVerificationReport(targetBufferWorkerWriteVerification) || {};
  const scope = (scopeId) => findScientificScope(gateScopes, scopeId);
  const scopeProxy = (scopeId) => scope(scopeId)?.proxySatisfied === true;
  const scopeAuthoritative = (scopeId) => scope(scopeId)?.authoritativeSatisfied === true;
  const scopeBlockers = (scopeId, fallback = []) => uniqueStrings([
    ...fallback,
    ...(Array.isArray(scope(scopeId)?.blockers) ? scope(scopeId).blockers : [])
  ]);

  const artifacts = [
    createReadinessArtifact({
      artifactId: 'authoritative-gpu-worker-buffer-writer',
      category: 'execution',
      label: 'Authoritative GPU Worker Buffer Writer',
      requiredScopes: ['authoritative-gpu-worker-buffer'],
      description: 'Replace reduced target-state proxy writes with direct worker-buffer mutation plus writeback hooks.',
      priority: 1,
      proxySatisfied: scopeProxy('authoritative-gpu-worker-buffer'),
      authoritativeSatisfied: scopeAuthoritative('authoritative-gpu-worker-buffer'),
      blockers: scopeBlockers('authoritative-gpu-worker-buffer', [
        'authoritative-gpu-buffer-mutation-required',
        'worker-buffer-writeback-hook-required'
      ]),
      evidence: {
        verifiedTargetCount: Math.max(0, Math.round(finite(verificationSummary.verifiedTargetCount))),
        verifiedFieldWriteCount: Math.max(0, Math.round(finite(verificationSummary.verifiedFieldWriteCount))),
        maxVerificationResidualProxy: finite(verificationSummary.maxVerificationResidualProxy)
      }
    }),
    createReadinessArtifact({
      artifactId: 'calibrated-thermodynamic-eos',
      category: 'thermodynamics',
      label: 'Calibrated Thermodynamic EOS',
      requiredScopes: ['closed-enthalpy-energy-balance'],
      description: 'Supply calibrated heat capacity, enthalpy, pressure, and closed energy residual tolerances.',
      priority: 2,
      proxySatisfied: scopeProxy('closed-enthalpy-energy-balance'),
      authoritativeSatisfied: scopeAuthoritative('closed-enthalpy-energy-balance'),
      blockers: scopeBlockers('closed-enthalpy-energy-balance', [
        'calibrated-heat-capacity-enthalpy-model-required',
        'closed-energy-residual-reference-tolerance-required'
      ]),
      evidence: scope('closed-enthalpy-energy-balance')?.evidence || {}
    }),
    createReadinessArtifact({
      artifactId: 'stoichiometric-charge-ledger',
      category: 'chemistry',
      label: 'Stoichiometric Species And Charge Ledger',
      requiredScopes: ['stoichiometry-species-charge-balance'],
      description: 'Close atom, species, stoichiometry, and charge invariants across source and target mutations.',
      priority: 3,
      proxySatisfied: scopeProxy('stoichiometry-species-charge-balance'),
      authoritativeSatisfied: scopeAuthoritative('stoichiometry-species-charge-balance'),
      blockers: scopeBlockers('stoichiometry-species-charge-balance', [
        'stoichiometric-species-ledger-required',
        'charge-conservation-invariant-required'
      ]),
      evidence: scope('stoichiometry-species-charge-balance')?.evidence || {}
    }),
    createReadinessArtifact({
      artifactId: 'phase-latent-heat-reference',
      category: 'phase',
      label: 'Phase And Latent Heat Reference',
      requiredScopes: ['phase-latent-heat-balance'],
      description: 'Provide calibrated phase-fraction, latent-heat, and EOS references for phase-changing targets.',
      priority: 4,
      proxySatisfied: scopeProxy('phase-latent-heat-balance'),
      authoritativeSatisfied: scopeAuthoritative('phase-latent-heat-balance'),
      blockers: scopeBlockers('phase-latent-heat-balance', [
        'calibrated-phase-fraction-eos-required',
        'latent-heat-source-sink-balance-required'
      ]),
      evidence: scope('phase-latent-heat-balance')?.evidence || {}
    }),
    createReadinessArtifact({
      artifactId: 'field-metadata-lock',
      category: 'metadata',
      label: 'Field Metadata Lock',
      requiredScopes: ['unit-dimension-metadata'],
      description: 'Lock unit, dimension, storage-location, and field-layout metadata for scientific mutation paths.',
      priority: 5,
      proxySatisfied: scopeProxy('unit-dimension-metadata'),
      authoritativeSatisfied: scopeAuthoritative('unit-dimension-metadata'),
      blockers: scopeBlockers('unit-dimension-metadata', [
        'unit-dimension-metadata-reference-review-required',
        'scientific-field-metadata-lock-required'
      ]),
      evidence: scope('unit-dimension-metadata')?.evidence || {}
    }),
    createReadinessArtifact({
      artifactId: 'deterministic-reference-replay-suite',
      category: 'reproducibility',
      label: 'Deterministic Reference Replay Suite',
      requiredScopes: ['provenance-replay'],
      description: 'Replay source-buffer, target-buffer, and worker-buffer mutations deterministically against references.',
      priority: 6,
      proxySatisfied: scopeProxy('provenance-replay'),
      authoritativeSatisfied: scopeAuthoritative('provenance-replay'),
      blockers: scopeBlockers('provenance-replay', [
        'reference-replay-suite-required',
        'deterministic-worker-buffer-replay-required'
      ]),
      evidence: scope('provenance-replay')?.evidence || {}
    }),
    createReadinessArtifact({
      artifactId: 'calibrated-invariant-residual-suite',
      category: 'validation',
      label: 'Calibrated Invariant Residual Suite',
      requiredScopes: ['operation-invariant-coverage'],
      description: 'Replace reduced residual proxies with calibrated invariant residual budgets and acceptance gates.',
      priority: 7,
      proxySatisfied: scopeProxy('operation-invariant-coverage'),
      authoritativeSatisfied: scopeAuthoritative('operation-invariant-coverage'),
      blockers: scopeBlockers('operation-invariant-coverage', [
        'operation-invariant-coverage-not-authoritative',
        'calibrated-invariant-residual-budgets-required'
      ]),
      evidence: scope('operation-invariant-coverage')?.evidence || {}
    })
  ].sort((a, b) => a.priority - b.priority);

  const requiredArtifactCount = artifacts.length;
  const proxySatisfiedArtifactCount = artifacts.filter((artifact) => artifact.proxySatisfied).length;
  const authoritativeReadyArtifactCount = artifacts.filter((artifact) => artifact.authoritativeSatisfied).length;
  const blockedArtifactCount = artifacts.filter((artifact) => !artifact.authoritativeSatisfied).length;
  const nextRequiredArtifact = artifacts.find((artifact) => !artifact.authoritativeSatisfied) || null;
  const manifestBlockers = uniqueStrings(artifacts.flatMap((artifact) => artifact.blockers || []));
  const manifestReady = requiredArtifactCount > 0
    && authoritativeReadyArtifactCount === requiredArtifactCount
    && gateSummary.scientificMutationReady === true
    && manifestBlockers.length === 0;

  return {
    schema: MOLECULAR_SCIENTIFIC_READINESS_MANIFEST_SCHEMA,
    mode: 'scientific-mutation-readiness-manifest-v0',
    status: manifestReady
      ? 'scientific-ready'
      : gateSummary.canPromoteProxy
        ? 'proxy-promotable-authoritative-artifacts-blocked'
        : 'blocked',
    timeSeconds: rounded(timeSeconds, 3),
    scientificMutationReady: manifestReady,
    gateScientificMutationReady: gateSummary.scientificMutationReady === true,
    canPromoteProxy: gateSummary.canPromoteProxy === true,
    manifestComplete: manifestReady,
    requiredArtifactCount,
    proxySatisfiedArtifactCount,
    authoritativeReadyArtifactCount,
    blockedArtifactCount,
    missingAuthoritativeArtifactCount: requiredArtifactCount - authoritativeReadyArtifactCount,
    requiredScopeCount: Math.max(0, Math.round(finite(gateSummary.requiredScopeCount))),
    proxySatisfiedScopeCount: Math.max(0, Math.round(finite(gateSummary.proxySatisfiedScopeCount))),
    authoritativeSatisfiedScopeCount: Math.max(0, Math.round(finite(gateSummary.authoritativeSatisfiedScopeCount))),
    blockedScopeCount: Math.max(0, Math.round(finite(gateSummary.blockedScopeCount))),
    nextRequiredArtifactId: nextRequiredArtifact?.artifactId || null,
    nextRequiredArtifactCategory: nextRequiredArtifact?.category || null,
    sourceScientificInvariantGateSchema: scientificInvariantGate?.schema || null,
    sourceTargetBufferWorkerWriteVerificationSchema: targetBufferWorkerWriteVerification?.schema || null,
    blockerCount: manifestBlockers.length,
    blockers: manifestBlockers,
    artifacts,
    validity: {
      status: 'readiness-manifest',
      confidence: 0.15,
      warnings: [
        'Manifest identifies authoritative artifacts required before reduced proxy writes can be promoted.',
        'It is a planning and runtime-gating contract, not evidence that scientific mutation is ready.'
      ]
    },
    provenance: {
      adapter: MOLECULAR_SCIENTIFIC_READINESS_MANIFEST_SCHEMA,
      gateSchema: scientificInvariantGate?.schema || null,
      verificationSchema: targetBufferWorkerWriteVerification?.schema || null,
      generatedAt: Date.now()
    }
  };
}

export function summarizeMolecularScientificReadinessManifestReport(report = null) {
  if (report?.schema !== MOLECULAR_SCIENTIFIC_READINESS_MANIFEST_SCHEMA) return null;
  return {
    schema: report.schema,
    mode: report.mode,
    status: report.status || 'unknown',
    scientificMutationReady: report.scientificMutationReady === true,
    gateScientificMutationReady: report.gateScientificMutationReady === true,
    canPromoteProxy: report.canPromoteProxy === true,
    manifestComplete: report.manifestComplete === true,
    requiredArtifactCount: Math.max(0, Math.round(finite(report.requiredArtifactCount))),
    proxySatisfiedArtifactCount: Math.max(0, Math.round(finite(report.proxySatisfiedArtifactCount))),
    authoritativeReadyArtifactCount: Math.max(0, Math.round(finite(report.authoritativeReadyArtifactCount))),
    blockedArtifactCount: Math.max(0, Math.round(finite(report.blockedArtifactCount))),
    missingAuthoritativeArtifactCount: Math.max(0, Math.round(finite(report.missingAuthoritativeArtifactCount))),
    requiredScopeCount: Math.max(0, Math.round(finite(report.requiredScopeCount))),
    proxySatisfiedScopeCount: Math.max(0, Math.round(finite(report.proxySatisfiedScopeCount))),
    authoritativeSatisfiedScopeCount: Math.max(0, Math.round(finite(report.authoritativeSatisfiedScopeCount))),
    blockedScopeCount: Math.max(0, Math.round(finite(report.blockedScopeCount))),
    nextRequiredArtifactId: report.nextRequiredArtifactId || null,
    nextRequiredArtifactCategory: report.nextRequiredArtifactCategory || null,
    blockerCount: Math.max(0, Math.round(finite(report.blockerCount, report.blockers?.length))),
    blockers: Array.isArray(report.blockers) ? [...report.blockers] : [],
    artifacts: Array.isArray(report.artifacts)
      ? report.artifacts.map((artifact) => ({
        artifactId: artifact.artifactId || 'unknown-artifact',
        category: artifact.category || 'unknown',
        label: artifact.label || artifact.artifactId || 'unknown',
        status: artifact.status || 'unknown',
        priority: Math.max(0, Math.round(finite(artifact.priority))),
        proxySatisfied: artifact.proxySatisfied === true,
        authoritativeSatisfied: artifact.authoritativeSatisfied === true,
        requiredScopeCount: Math.max(0, Math.round(finite(artifact.requiredScopeCount))),
        blockerCount: Math.max(0, Math.round(finite(artifact.blockerCount, artifact.blockers?.length)))
      }))
      : []
  };
}
