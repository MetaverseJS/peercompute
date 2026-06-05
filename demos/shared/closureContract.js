export const CLOSURE_STATE_SCHEMA = 'peercompute.multiscale.closure-state.v0';
export const CLOSURE_RESULT_SCHEMA = 'peercompute.multiscale.closure-result.v0';

function finiteNumber(value, fallback = null) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => item !== undefined)
      .map(([key, item]) => [key, item && typeof item === 'object' ? cloneJson(item) : item])
  );
}

export function makeClosureState({
  layerId = 'unknown',
  materialId = 'unknown',
  solverId = 'unknown',
  stateKey = 'unknown',
  sequence = 0,
  environment = {},
  primitive = {},
  conserved = {},
  species = {},
  phaseFractions = {},
  fields = {},
  validity = {}
} = {}) {
  return {
    schema: CLOSURE_STATE_SCHEMA,
    layerId,
    materialId,
    solverId,
    stateKey,
    sequence: finiteNumber(sequence, 0),
    environment: cloneJson(environment),
    primitive: cloneJson(primitive),
    conserved: cloneJson(conserved),
    species: cloneJson(species),
    phaseFractions: cloneJson(phaseFractions),
    fields: cloneJson(fields),
    validity: cloneJson(validity)
  };
}

export function makeClosureResult({
  modelId = 'unknown-closure-model',
  source = {},
  state = null,
  thermodynamics = {},
  transport = {},
  mechanics = {},
  electromagnetics = {},
  statistical = {},
  chemistry = {},
  phase = {},
  diagnostics = {},
  validity = {},
  uncertainty = {},
  conservation = {},
  provenance = {}
} = {}) {
  return {
    schema: CLOSURE_RESULT_SCHEMA,
    modelId,
    source: cloneJson(source),
    state: state ? cloneJson(state) : null,
    thermodynamics: compactObject({
      temperatureK: finiteNumber(thermodynamics.temperatureK),
      pressurePa: finiteNumber(thermodynamics.pressurePa),
      densityKgM3: finiteNumber(thermodynamics.densityKgM3),
      heatSourceWm3: finiteNumber(thermodynamics.heatSourceWm3),
      soundSpeedMps: finiteNumber(thermodynamics.soundSpeedMps),
      specificInternalEnergyJkg: finiteNumber(thermodynamics.specificInternalEnergyJkg),
      heatCapacityJkgK: finiteNumber(thermodynamics.heatCapacityJkgK),
      latentHeatJkg: finiteNumber(thermodynamics.latentHeatJkg),
      specificEnthalpyProxy: finiteNumber(thermodynamics.specificEnthalpyProxy),
      specificFreeEnergyProxy: finiteNumber(thermodynamics.specificFreeEnergyProxy),
      specificInternalEnergyProxy: finiteNumber(thermodynamics.specificInternalEnergyProxy),
      entropyProxy: finiteNumber(thermodynamics.entropyProxy),
      phaseEnergyRateProxy: finiteNumber(thermodynamics.phaseEnergyRateProxy),
      phaseStabilityResidualProxy: finiteNumber(thermodynamics.phaseStabilityResidualProxy),
      sourceTemperatureDeltaKProxy: finiteNumber(thermodynamics.sourceTemperatureDeltaKProxy),
      latentHeatBudgetProxy: finiteNumber(thermodynamics.latentHeatBudgetProxy),
      latentHeatSinkProxy: finiteNumber(thermodynamics.latentHeatSinkProxy),
      latentHeatReleaseProxy: finiteNumber(thermodynamics.latentHeatReleaseProxy)
    }),
    transport: compactObject({
      thermalConductivityWmK: finiteNumber(transport.thermalConductivityWmK),
      electricalConductivitySm: finiteNumber(transport.electricalConductivitySm),
      viscosityPaS: finiteNumber(transport.viscosityPaS),
      diffusivityM2s: finiteNumber(transport.diffusivityM2s)
    }),
    mechanics: compactObject({
      bulkModulusPa: finiteNumber(mechanics.bulkModulusPa),
      shearModulusPa: finiteNumber(mechanics.shearModulusPa),
      youngsModulusPa: finiteNumber(mechanics.youngsModulusPa),
      yieldStrengthPa: finiteNumber(mechanics.yieldStrengthPa),
      surfaceTensionNpm: finiteNumber(mechanics.surfaceTensionNpm),
      damage: finiteNumber(mechanics.damage)
    }),
    electromagnetics: compactObject({
      chargeDensityCm3: finiteNumber(electromagnetics.chargeDensityCm3),
      conductivitySm: finiteNumber(electromagnetics.conductivitySm),
      dielectricConstant: finiteNumber(electromagnetics.dielectricConstant),
      magneticSusceptibility: finiteNumber(electromagnetics.magneticSusceptibility),
      permittivity: finiteNumber(electromagnetics.permittivity),
      permeability: finiteNumber(electromagnetics.permeability)
    }),
    statistical: compactObject({
      schema: statistical.schema,
      ensembleSchema: statistical.ensembleSchema,
      modelId: statistical.modelId,
      status: statistical.status,
      backend: statistical.backend,
      calibrated: statistical.calibrated,
      firstPrinciplesUniversal: statistical.firstPrinciplesUniversal,
      acceptableClosureIfLabeled: statistical.acceptableClosureIfLabeled,
      recordCount: finiteNumber(statistical.recordCount),
      temperatureK: finiteNumber(statistical.temperatureK),
      pressurePa: finiteNumber(statistical.pressurePa),
      ensemblePressurePa: finiteNumber(statistical.ensemblePressurePa),
      pressureRatio: finiteNumber(statistical.pressureRatio),
      betaEv: finiteNumber(statistical.betaEv),
      partitionFunction: finiteNumber(statistical.partitionFunction),
      partitionFunctionLog: finiteNumber(statistical.partitionFunctionLog),
      groundStatePopulation: finiteNumber(statistical.groundStatePopulation),
      excitedStatePopulation: finiteNumber(statistical.excitedStatePopulation),
      continuumPopulation: finiteNumber(statistical.continuumPopulation),
      ionizationFraction: finiteNumber(statistical.ionizationFraction),
      meanExcitationEnergyEv: finiteNumber(statistical.meanExcitationEnergyEv),
      heatCapacityProxy: finiteNumber(statistical.heatCapacityProxy),
      opacityProxy: finiteNumber(statistical.opacityProxy),
      degeneracyParameter: finiteNumber(statistical.degeneracyParameter),
      degeneracyRegime: statistical.degeneracyRegime,
      distribution: statistical.distribution,
      hamiltonian: statistical.hamiltonian,
      sourceEquation: statistical.sourceEquation,
      sourceTerms: statistical.sourceTerms,
      closureOutputs: statistical.closureOutputs,
      populations: statistical.populations,
      validity: statistical.validity
    }),
    chemistry: cloneJson(chemistry),
    phase: cloneJson(phase),
    diagnostics: cloneJson(diagnostics),
    validity: {
      status: validity.status || 'interactive-proxy',
      regimes: Array.isArray(validity.regimes) ? [...validity.regimes] : [],
      bounds: cloneJson(validity.bounds || {}),
      warnings: Array.isArray(validity.warnings) ? [...validity.warnings] : []
    },
    uncertainty: {
      mode: uncertainty.mode || 'unvalidated-proxy',
      confidence: finiteNumber(uncertainty.confidence, 0),
      value: finiteNumber(uncertainty.value, null)
    },
    conservation: cloneJson(conservation),
    provenance: {
      source: provenance.source || 'runtime-reduced-model',
      references: Array.isArray(provenance.references) ? [...provenance.references] : [],
      codeHash: provenance.codeHash || null,
      inputHash: provenance.inputHash || null
    }
  };
}

export function validateClosureResult(result = {}) {
  const errors = [];
  if (result.schema !== CLOSURE_RESULT_SCHEMA) errors.push('schema');
  if (!result.modelId) errors.push('modelId');
  if (!result.source?.solverId) errors.push('source.solverId');
  if (!result.validity?.status) errors.push('validity.status');
  if (!result.uncertainty?.mode) errors.push('uncertainty.mode');
  if (!result.conservation || typeof result.conservation !== 'object') errors.push('conservation');
  return {
    ok: errors.length === 0,
    errors
  };
}

export function summarizeClosureResult(result = null) {
  if (!result) return null;
  return {
    schema: result.schema,
    modelId: result.modelId,
    source: cloneJson(result.source || {}),
    thermodynamics: cloneJson(result.thermodynamics || {}),
    transport: cloneJson(result.transport || {}),
    mechanics: cloneJson(result.mechanics || {}),
    electromagnetics: cloneJson(result.electromagnetics || {}),
    statistical: cloneJson(result.statistical || {}),
    chemistry: cloneJson(result.chemistry || {}),
    phase: cloneJson(result.phase || {}),
    validity: cloneJson(result.validity || {}),
    uncertainty: cloneJson(result.uncertainty || {}),
    conservation: cloneJson(result.conservation || {})
  };
}

export function closureResultFromReactiveThermal(result = {}, {
  environment = {},
  layerId = 'surface'
} = {}) {
  const closure = result.closure || {};
  const state = result.state || {};
  const closureState = makeClosureState({
    layerId,
    materialId: 'water-fire-reactive-cell',
    solverId: result.solverId || 'reactive-thermal-cell',
    stateKey: result.stateKey || 'surface:reactive-thermal',
    sequence: result.sequence || state.sequence || 0,
    environment,
    primitive: {
      temperatureK: closure.temperatureK ?? state.temperatureK,
      pressurePa: closure.pressurePa ?? state.pressurePa
    },
    species: {
      fuelFraction: state.fuelFraction,
      oxygenFraction: state.oxygenFraction,
      productFraction: state.productFraction,
      waterLiquidFraction: state.waterLiquidFraction,
      waterVaporFraction: state.waterVaporFraction
    },
    phaseFractions: {
      liquid: state.waterLiquidFraction,
      vapor: state.waterVaporFraction
    }
  });

  return makeClosureResult({
    modelId: 'reduced-reactive-thermal-cell-v0',
    source: {
      solverId: result.solverId || 'reactive-thermal-cell',
      stateKey: result.stateKey || closureState.stateKey,
      backend: result.backend || 'unknown',
      sequence: result.sequence || 0
    },
    state: closureState,
    thermodynamics: {
      temperatureK: closure.temperatureK,
      pressurePa: closure.pressurePa,
      heatSourceWm3: closure.heatSource
    },
    transport: {
      thermalConductivityWmK: closure.thermalConductivityWmK,
      electricalConductivitySm: closure.electricalConductivitySm
    },
    electromagnetics: {
      conductivitySm: closure.electricalConductivitySm
    },
    chemistry: {
      heatReleaseNorm: closure.heatReleaseNorm,
      fireIntensityEstimate: closure.fireIntensityEstimate,
      speciesRates: closure.speciesRates || {}
    },
    phase: {
      phaseRates: closure.phaseRates || {},
      phaseFractions: {
        liquid: state.waterLiquidFraction,
        vapor: closure.steamFraction ?? state.waterVaporFraction
      }
    },
    diagnostics: {
      elapsedTime: result.elapsedTime,
      executionContext: result.executionContext
    },
    validity: {
      status: 'interactive-proxy',
      regimes: ['surface', 'mpm', 'molecular'],
      warnings: ['Reduced thermal chemistry; not a validated combustion mechanism.']
    },
    uncertainty: {
      mode: 'heuristic-reduced-model',
      confidence: 0.18
    },
    conservation: result.conservation || {},
    provenance: {
      source: 'demos/multiscale/src/compute/reactiveThermalTasks.js'
    }
  });
}

export function closureResultFromSphMaterial(result = {}, {
  environment = {},
  layerId = 'mpm'
} = {}) {
  const diagnostics = result.diagnostics || {};
  const state = result.state || {};
  const closureState = makeClosureState({
    layerId,
    materialId: 'water-sph-material-patch',
    solverId: result.solverId || 'sph-material',
    stateKey: result.stateKey || 'surface:sph-material',
    sequence: result.sequence || state.sequence || 0,
    environment,
    primitive: {
      temperatureK: diagnostics.averageTemperatureK,
      densityMean: diagnostics.densityMean
    },
    conserved: {
      totalMass: diagnostics.totalMass,
      momentum: diagnostics.momentum,
      kineticEnergy: diagnostics.kineticEnergy
    },
    phaseFractions: diagnostics.phaseMix || {}
  });

  return makeClosureResult({
    modelId: 'reduced-sph-material-patch-v0',
    source: {
      solverId: result.solverId || 'sph-material',
      stateKey: result.stateKey || closureState.stateKey,
      backend: result.backend || 'unknown',
      sequence: result.sequence || 0
    },
    state: closureState,
    thermodynamics: {
      temperatureK: diagnostics.averageTemperatureK,
      specificEnthalpyProxy: diagnostics.meanSpecificEnthalpyProxy,
      latentHeatSinkProxy: diagnostics.latentHeatSinkProxy,
      latentHeatReleaseProxy: diagnostics.latentHeatReleaseProxy
    },
    transport: {
      thermalConductivityWmK: 0.6 + finiteNumber(diagnostics.vaporFraction, 0) * 0.03,
      viscosityPaS: 0.001 * (1 + finiteNumber(diagnostics.vaporFraction, 0) * 4)
    },
    mechanics: {
      bulkModulusPa: 2.2e9 * Math.max(0, 1 - finiteNumber(diagnostics.vaporFraction, 0)),
      shearModulusPa: 0,
      damage: finiteNumber(diagnostics.vaporFraction, 0)
    },
    phase: {
      phaseFractions: diagnostics.phaseMix || {},
      vaporFraction: diagnostics.vaporFraction,
      liquidFraction: diagnostics.liquidFraction,
      iceFraction: diagnostics.iceFraction,
      boilingFraction: diagnostics.boilingFraction,
      freezingFraction: diagnostics.freezingFraction,
      phaseChangeRateProxy: diagnostics.phaseChangeRateProxy,
      phaseRegime: diagnostics.phaseRegime
    },
    diagnostics,
    validity: {
      status: 'interactive-proxy',
      regimes: ['surface', 'mpm'],
      warnings: ['Reduced particle patch; not a validated SPH/MLS-MPM water model.']
    },
    uncertainty: {
      mode: 'heuristic-reduced-model',
      confidence: 0.16
    },
    conservation: result.conservation || {},
    provenance: {
      source: 'demos/multiscale/src/compute/sphMaterialTasks.js'
    }
  });
}

export function closureResultFromMolecularDynamics(result = {}, {
  environment = {},
  layerId = 'molecular'
} = {}) {
  const diagnostics = result.diagnostics || {};
  const state = result.state || {};
  const webgpuStatus = result.webgpuStatus || {};
  const species = diagnostics.species || state.requestedComposition || {};
  const reactionLedger = diagnostics.reactionLedger || null;
  const reactionEventLedger = diagnostics.reactionEventLedger || null;
  const reactionSource = diagnostics.reactionSource || null;
  const forceEnergyLedger = diagnostics.forceEnergyLedger || null;
  const thermoPhaseLedger = diagnostics.thermoPhaseLedger || null;
  const molecularSpecies = diagnostics.molecularSpecies || reactionLedger?.species || {};
  const atomCount = finiteNumber(diagnostics.atomCount ?? state.atomCount, 0);
  const bondCount = finiteNumber(diagnostics.bondCount, 0);
  const totalEnergyProxy = finiteNumber(diagnostics.totalEnergyProxy, null);
  const specificEnergyProxy = atomCount > 0 && Number.isFinite(totalEnergyProxy)
    ? totalEnergyProxy / atomCount
    : null;
  const quantumCoupling = diagnostics.quantumCoupling || null;
  const chargeEquilibration = diagnostics.chargeEquilibration || null;
  const quantumMaterialSource = diagnostics.quantumMaterialSource || null;
  const quantumConfidence = finiteNumber(
    diagnostics.quantumCouplingConfidence ?? quantumCoupling?.confidence,
    0
  );
  const quantumApplied = diagnostics.quantumCouplingApplied === true || quantumCoupling?.applied === true;
  const confidence = Math.max(
    0.08,
    Math.min(0.28, 0.17 + (quantumApplied ? quantumConfidence * 0.07 : 0))
  );
  const phaseFractions = diagnostics.phaseFractions || thermoPhaseLedger?.phaseFractions || {
    molecular: Math.max(0, 1 - finiteNumber(diagnostics.ionizationFraction, 0)),
    ionized: finiteNumber(diagnostics.ionizationFraction, 0)
  };
  const closureState = makeClosureState({
    layerId,
    materialId: 'reduced-molecular-reactive-patch',
    solverId: result.solverId || 'molecular-dynamics',
    stateKey: result.stateKey || 'molecular:md-patch',
    sequence: result.sequence || state.sequence || 0,
    environment,
    primitive: {
      temperatureK: diagnostics.meanTemperatureK,
      maxTemperatureK: diagnostics.maxTemperatureK,
      pressureProxy: diagnostics.pressureProxy,
      reactionProgress: diagnostics.reactionProgress,
      ionizationFraction: diagnostics.ionizationFraction,
      dipoleMomentProxy: diagnostics.dipoleMomentProxy
    },
    conserved: {
      atomCount,
      bondCount,
      totalCharge: diagnostics.totalCharge,
      kineticEnergyProxy: diagnostics.kineticEnergy,
      potentialEnergyProxy: diagnostics.potentialEnergyProxy,
      thermalEnergyProxy: diagnostics.thermalEnergyProxy,
      totalEnergyProxy: diagnostics.totalEnergyProxy,
      forceEnergyLedger,
      thermoPhaseLedger,
      forceFieldPotentialEnergyProxy: diagnostics.forceFieldPotentialEnergyProxy,
      forceFieldTotalEnergyProxy: diagnostics.forceFieldTotalEnergyProxy
    },
    species,
    phaseFractions,
    fields: {
      meanBondOrder: diagnostics.meanBondOrder,
      heatReleaseProxy: diagnostics.heatReleaseProxy,
      meanAbsCharge: diagnostics.meanAbsCharge,
      electricalConductivityProxy: diagnostics.electricalConductivityProxy,
      dielectricConstantProxy: diagnostics.dielectricConstantProxy,
      refractiveIndexProxy: diagnostics.refractiveIndexProxy,
      ionicBondCount: diagnostics.ionicBondCount,
      covalentBondCount: diagnostics.covalentBondCount,
      polarBondFraction: diagnostics.polarBondFraction,
      valenceSaturation: diagnostics.valenceSaturation,
      pairSearchMode: diagnostics.pairSearchMode,
      neighborCandidatePairCount: diagnostics.neighborCandidatePairCount,
      bondCandidateCount: diagnostics.bondCandidateCount,
      spatialCellCount: diagnostics.spatialCellCount,
      dominantMolecule: diagnostics.dominantMolecule,
      recognizedMoleculeCount: diagnostics.recognizedMoleculeCount,
      stoichiometryResidualProxy: diagnostics.stoichiometryResidualProxy,
      componentClosureFraction: diagnostics.componentClosureFraction,
      molecularSpecies,
      reactionLedger,
      reactionEventLedger,
      reactionSource,
      forceEnergyLedger,
      thermoPhaseLedger,
      phaseRegime: diagnostics.phaseRegime,
      phaseFractions,
      phaseChangeRateProxy: diagnostics.phaseChangeRateProxy,
      latentHeatSinkProxy: diagnostics.latentHeatSinkProxy,
      latentHeatReleaseProxy: diagnostics.latentHeatReleaseProxy,
      waterMoleculeFraction: diagnostics.waterMoleculeFraction,
      condensationOrderProxy: diagnostics.condensationOrderProxy,
      forceFieldBondedAttractionEnergyProxy: diagnostics.forceFieldBondedAttractionEnergyProxy,
      forceFieldBondStrainEnergyProxy: diagnostics.forceFieldBondStrainEnergyProxy,
      forceFieldElectrostaticEnergyProxy: diagnostics.forceFieldElectrostaticEnergyProxy,
      forceFieldRepulsionEnergyProxy: diagnostics.forceFieldRepulsionEnergyProxy,
      forceFieldQeqResidualPenaltyProxy: diagnostics.forceFieldQeqResidualPenaltyProxy,
      forceFieldQuantumMaterialSourceBiasEnergyProxy: diagnostics.forceFieldQuantumMaterialSourceBiasEnergyProxy,
      forceFieldQuantumMaterialPairForceBiasEnergyProxy: diagnostics.forceFieldQuantumMaterialPairForceBiasEnergyProxy,
      forceFieldQuantumMaterialBiasEnergyProxy: diagnostics.forceFieldQuantumMaterialBiasEnergyProxy,
      forceFieldPairCount: diagnostics.forceFieldPairCount,
      forceFieldClosePairCount: diagnostics.forceFieldClosePairCount,
      forceFieldMaxBondStrain: diagnostics.forceFieldMaxBondStrain,
      molecularGeometryForceLaw: diagnostics.molecularGeometryForceLaw,
      molecularGeometryForceLawSchema: diagnostics.molecularGeometryForceLawSchema,
      molecularGeometryForceLawModelId: diagnostics.molecularGeometryForceLawModelId,
      waterGeometryTargetSource: diagnostics.waterGeometryTargetSource,
      waterGeometrySourceApplied: diagnostics.waterGeometrySourceApplied,
      waterGeometrySourceSchema: diagnostics.waterGeometrySourceSchema,
      waterGeometrySourceModelId: diagnostics.waterGeometrySourceModelId,
      waterGeometryTargetOhDistanceReducedNm: diagnostics.waterGeometryTargetOhDistanceReducedNm,
      waterGeometryTargetHhDistanceReducedNm: diagnostics.waterGeometryTargetHhDistanceReducedNm,
      waterGeometryTargetAngleDeg: diagnostics.waterGeometryTargetAngleDeg,
      waterGeometryTripletCount: diagnostics.waterGeometryTripletCount,
      waterGeometryMeanAngleDeg: diagnostics.waterGeometryMeanAngleDeg,
      waterGeometryMeanAbsAngleErrorDeg: diagnostics.waterGeometryMeanAbsAngleErrorDeg,
      waterGeometryRmsAngleErrorDeg: diagnostics.waterGeometryRmsAngleErrorDeg,
      waterGeometryClosureFraction: diagnostics.waterGeometryClosureFraction,
      waterGeometryEnergyProxy: diagnostics.waterGeometryEnergyProxy,
      reactionEventCount: diagnostics.reactionEventCount,
      formedBondCount: diagnostics.formedBondCount,
      brokenBondCount: diagnostics.brokenBondCount,
      moleculeSpeciesDelta: diagnostics.moleculeSpeciesDelta,
      reactionHeatSourceProxy: diagnostics.reactionHeatSourceProxy,
      reactionSpeciesRateProxy: diagnostics.reactionSpeciesRateProxy,
      chargeEquilibration,
      chargeEquilibrationResidualRms: diagnostics.chargeEquilibrationResidualRms,
      chargeEquilibrationWeightedResidualRms: diagnostics.chargeEquilibrationWeightedResidualRms,
      chargeEquilibrationChargeRmsDelta: diagnostics.chargeEquilibrationChargeRmsDelta,
      chargeEquilibrationTransferMagnitude: diagnostics.chargeEquilibrationTransferMagnitude,
      chargeEquilibrationNeutralizationResidualCharge: chargeEquilibration?.neutralizationResidualCharge,
      quantumCoupling,
      quantumMaterialSource,
      quantumMaterialPropertyResponse: diagnostics.quantumMaterialSourcePropertyResponse || quantumMaterialSource?.propertyResponse || null,
      quantumMaterialResponseDerivatives: diagnostics.quantumMaterialSourceResponseDerivatives || quantumMaterialSource?.responseDerivatives || null,
      quantumMaterialResponseDerivativesSchema: diagnostics.quantumMaterialSourceResponseDerivativesSchema
        || quantumMaterialSource?.sourceResponseDerivativesSchema
        || quantumMaterialSource?.responseDerivatives?.schema
        || null,
      quantumMaterialDensityTemperatureDerivativeKgM3PerK: diagnostics.quantumMaterialSourceDensityTemperatureDerivativeKgM3PerK
        ?? quantumMaterialSource?.densityTemperatureDerivativeKgM3PerK,
      quantumMaterialMechanicalPressureDerivativePaPerLog2Pressure: diagnostics.quantumMaterialSourceMechanicalPressureDerivativePaPerLog2Pressure
        ?? quantumMaterialSource?.mechanicalPressureDerivativePaPerLog2Pressure,
      quantumMaterialConductivityFieldDerivativeSpmPerNorm: diagnostics.quantumMaterialSourceConductivityFieldDerivativeSpmPerNorm
        ?? quantumMaterialSource?.conductivityFieldDerivativeSpmPerNorm,
      quantumMaterialOpacityRadiationDerivativePerNorm: diagnostics.quantumMaterialSourceOpacityRadiationDerivativePerNorm
        ?? quantumMaterialSource?.opacityRadiationDerivativePerNorm,
      quantumMaterialResponseDerivativeTemperatureDrive: diagnostics.quantumMaterialSourceResponseDerivativeTemperatureDrive
        ?? quantumMaterialSource?.responseDerivativeTemperatureDrive,
      quantumMaterialResponseDerivativePressureDrive: diagnostics.quantumMaterialSourceResponseDerivativePressureDrive
        ?? quantumMaterialSource?.responseDerivativePressureDrive,
      quantumMaterialResponseDerivativeFieldDrive: diagnostics.quantumMaterialSourceResponseDerivativeFieldDrive
        ?? quantumMaterialSource?.responseDerivativeFieldDrive,
      quantumMaterialResponseDerivativeRadiationDrive: diagnostics.quantumMaterialSourceResponseDerivativeRadiationDrive
        ?? quantumMaterialSource?.responseDerivativeRadiationDrive,
      quantumMaterialDensityKgM3: diagnostics.quantumMaterialSourceDensityKgM3,
      quantumMaterialMechanicalResponsePa: diagnostics.quantumMaterialSourceMechanicalResponsePa,
      quantumMaterialBulkModulusPa: diagnostics.quantumMaterialSourceBulkModulusPa,
      quantumMaterialYoungsModulusPa: diagnostics.quantumMaterialSourceYoungsModulusPa,
      quantumMaterialElectricalConductivitySpm: diagnostics.quantumMaterialSourceElectricalConductivitySpm,
      quantumMaterialDielectricConstant: diagnostics.quantumMaterialSourceDielectricConstant,
      quantumMaterialRefractiveIndex: diagnostics.quantumMaterialSourceRefractiveIndex,
      quantumMaterialOpticalAbsorptionProxy: diagnostics.quantumMaterialSourceOpticalAbsorptionProxy,
      quantumMaterialConductivityDrive: diagnostics.quantumMaterialSourceConductivityDrive,
      quantumMaterialDielectricDrive: diagnostics.quantumMaterialSourceDielectricDrive,
      quantumMaterialMechanicalStiffnessDrive: diagnostics.quantumMaterialSourceMechanicalStiffnessDrive,
      quantumMaterialOpticalAbsorptionDrive: diagnostics.quantumMaterialSourceOpticalAbsorptionDrive,
      quantumMaterialGeometrySourceApplied: diagnostics.quantumMaterialGeometrySourceApplied,
      quantumMaterialGeometrySourceSchema: diagnostics.quantumMaterialGeometrySourceSchema,
      quantumMaterialGeometrySourceModelId: diagnostics.quantumMaterialGeometrySourceModelId,
      quantumMaterialGeometryTargetSource: diagnostics.quantumMaterialGeometryTargetSource,
      quantumMaterialGeometryTargetOhDistanceReducedNm: diagnostics.quantumMaterialGeometryTargetOhDistanceReducedNm,
      quantumMaterialGeometryTargetHhDistanceReducedNm: diagnostics.quantumMaterialGeometryTargetHhDistanceReducedNm,
      quantumMaterialGeometryTargetAngleDeg: diagnostics.quantumMaterialGeometryTargetAngleDeg,
      quantumMaterialGeometrySourceConfidence: diagnostics.quantumMaterialGeometrySourceConfidence,
      quantumMaterialElectronicChargeSource: diagnostics.quantumMaterialElectronicChargeSource
        || quantumMaterialSource?.electronicChargeSource
        || null,
      quantumMaterialElectronicChargeSourceApplied: diagnostics.quantumMaterialElectronicChargeSourceApplied
        ?? quantumMaterialSource?.electronicChargeSourceApplied,
      quantumMaterialElectronicChargeSourceSchema: diagnostics.quantumMaterialElectronicChargeSourceSchema
        || quantumMaterialSource?.electronicChargeSourceSchema
        || null,
      quantumMaterialElectronicChargeSourceModelId: diagnostics.quantumMaterialElectronicChargeSourceModelId
        || quantumMaterialSource?.electronicChargeSourceModelId
        || null,
      quantumMaterialElectronicChargeTargetPairLabel: diagnostics.quantumMaterialElectronicChargeTargetPairLabel
        || quantumMaterialSource?.electronicChargeSourceTargetPairLabel
        || 'all-pairs',
      quantumMaterialElectronicChargeDeltaProxy: diagnostics.quantumMaterialElectronicChargeDeltaProxy
        ?? quantumMaterialSource?.electronicChargeSourceChargeDeltaProxy,
      quantumMaterialElectronicIonizationDriveProxy: diagnostics.quantumMaterialElectronicIonizationDriveProxy
        ?? quantumMaterialSource?.electronicChargeSourceIonizationDriveProxy,
      quantumMaterialElectronicChargeMobilityProxy: diagnostics.quantumMaterialElectronicChargeMobilityProxy
        ?? quantumMaterialSource?.electronicChargeSourceMobilityProxy,
      quantumMaterialElectronicHardnessSofteningProxy: diagnostics.quantumMaterialElectronicHardnessSofteningProxy
        ?? quantumMaterialSource?.electronicChargeSourceHardnessSofteningProxy,
      quantumMaterialElectronicScreeningDampingScale: diagnostics.quantumMaterialElectronicScreeningDampingScale
        ?? quantumMaterialSource?.electronicChargeSourceScreeningDampingScale,
      quantumMaterialElectronicQeqMixProxy: diagnostics.quantumMaterialElectronicQeqMixProxy
        ?? quantumMaterialSource?.electronicChargeSourceQeqMixProxy,
      quantumMaterialElectronicChargeTransferPotentialProxy: diagnostics.quantumMaterialElectronicChargeTransferPotentialProxy
        ?? quantumMaterialSource?.electronicChargeSourceChargeTransferPotentialProxy,
      quantumMaterialElectronicChargeSourceConfidence: diagnostics.quantumMaterialElectronicChargeSourceConfidence
        ?? quantumMaterialSource?.electronicChargeSourceConfidence,
      quantumMaterialReactionBarrierSurface: diagnostics.quantumMaterialReactionBarrierSurface
        || quantumMaterialSource?.reactionBarrierSurface
        || null,
      quantumMaterialReactionBarrierSurfaceApplied: diagnostics.quantumMaterialReactionBarrierSurfaceApplied
        ?? quantumMaterialSource?.reactionBarrierSurfaceApplied,
      quantumMaterialReactionBarrierSurfaceSchema: diagnostics.quantumMaterialReactionBarrierSurfaceSchema
        || quantumMaterialSource?.reactionBarrierSurfaceSchema
        || null,
      quantumMaterialReactionBarrierSurfaceModelId: diagnostics.quantumMaterialReactionBarrierSurfaceModelId
        || quantumMaterialSource?.reactionBarrierSurfaceModelId
        || null,
      quantumMaterialReactionBarrierTargetReactionId: diagnostics.quantumMaterialReactionBarrierTargetReactionId
        || quantumMaterialSource?.reactionBarrierTargetReactionId
        || null,
      quantumMaterialReactionBarrierTargetPairLabel: diagnostics.quantumMaterialReactionBarrierTargetPairLabel
        || quantumMaterialSource?.reactionBarrierTargetPairLabel
        || 'all-pairs',
      quantumMaterialReactionBarrierActivationEnergyEvProxy: diagnostics.quantumMaterialReactionBarrierActivationEnergyEvProxy
        ?? quantumMaterialSource?.reactionBarrierActivationEnergyEvProxy,
      quantumMaterialReactionBarrierProbabilityProxy: diagnostics.quantumMaterialReactionBarrierProbabilityProxy
        ?? quantumMaterialSource?.reactionBarrierProbabilityProxy,
      quantumMaterialReactionBarrierGateDampingScale: diagnostics.quantumMaterialReactionBarrierGateDampingScale
        ?? quantumMaterialSource?.reactionBarrierGateDampingScale,
      quantumMaterialReactionBarrierGateProxy: diagnostics.quantumMaterialReactionBarrierGateProxy
        ?? quantumMaterialSource?.reactionBarrierGateProxy,
      quantumMaterialReactionBarrierChargeTransferGateProxy: diagnostics.quantumMaterialReactionBarrierChargeTransferGateProxy
        ?? quantumMaterialSource?.reactionBarrierChargeTransferGateProxy,
      quantumMaterialReactionBarrierUnsupportedProductBlockerCount: diagnostics.quantumMaterialReactionBarrierUnsupportedProductBlockerCount
        ?? quantumMaterialSource?.reactionBarrierUnsupportedProductBlockerCount,
      quantumMaterialReactionBarrierProductStoichiometryAvailable: diagnostics.quantumMaterialReactionBarrierProductStoichiometryAvailable
        ?? quantumMaterialSource?.reactionBarrierProductStoichiometryAvailable,
      quantumMaterialReactionBarrierProductTopologyAvailable: diagnostics.quantumMaterialReactionBarrierProductTopologyAvailable
        ?? quantumMaterialSource?.reactionBarrierProductTopologyAvailable,
      quantumMaterialReactionBarrierProductStoichiometry: diagnostics.quantumMaterialReactionBarrierProductStoichiometry
        || quantumMaterialSource?.reactionBarrierProductStoichiometry
        || diagnostics.quantumMaterialReactionProductSource?.productStoichiometry
        || null,
      quantumMaterialReactionProductSource: diagnostics.quantumMaterialReactionProductSource || null,
      quantumMaterialReactionProductSourceApplied: diagnostics.quantumMaterialReactionProductSourceApplied,
      quantumMaterialReactionProductTargetReactionId: diagnostics.quantumMaterialReactionProductTargetReactionId
        || diagnostics.quantumMaterialReactionProductSource?.targetReactionId
        || null,
      quantumMaterialReactionProductHeatReleaseProxy: diagnostics.quantumMaterialReactionProductHeatReleaseProxy
        ?? diagnostics.quantumMaterialReactionProductSource?.heatReleaseProxy,
      quantumMaterialReactionProductChargeDeltaProxy: diagnostics.quantumMaterialReactionProductChargeDeltaProxy
        ?? diagnostics.quantumMaterialReactionProductSource?.chargeDeltaProxy,
      quantumMaterialReactionProductExtentProxy: diagnostics.quantumMaterialReactionProductExtentProxy
        ?? diagnostics.quantumMaterialReactionProductSource?.extentProxy,
      quantumMaterialReactionProductProgressDriveProxy: diagnostics.quantumMaterialReactionProductProgressDriveProxy
        ?? diagnostics.quantumMaterialReactionProductSource?.progressDriveProxy,
      quantumMaterialReactionProductGasFormula: diagnostics.quantumMaterialReactionProductGasFormula
        || diagnostics.quantumMaterialReactionProductSource?.gasProductFormula
        || null,
      quantumMaterialReactionProductGasMoleculeFractionPerNa: diagnostics.quantumMaterialReactionProductGasMoleculeFractionPerNa
        ?? diagnostics.quantumMaterialReactionProductSource?.gasMoleculeFractionPerNa,
      quantumMaterialReactionProductChargeTransferElectronCount: diagnostics.quantumMaterialReactionProductChargeTransferElectronCount
        ?? diagnostics.quantumMaterialReactionProductSource?.chargeTransferElectronCount,
      quantumMaterialReactionProductEnthalpyDeltaKjPerMolNaProxy: diagnostics.quantumMaterialReactionProductEnthalpyDeltaKjPerMolNaProxy
        ?? diagnostics.quantumMaterialReactionProductSource?.enthalpyDeltaKjPerMolNaProxy,
      quantumMaterialReactionProductTopologyAvailable: diagnostics.quantumMaterialReactionProductTopologyAvailable
        ?? diagnostics.quantumMaterialReactionProductSource?.productTopologyAvailable,
      quantumMaterialReactionProductTopologyRequired: diagnostics.quantumMaterialReactionProductTopologyRequired
        ?? diagnostics.quantumMaterialReactionProductSource?.productTopologyRequired,
      quantumMaterialReactionProductTopology: diagnostics.quantumMaterialReactionProductTopology
        || diagnostics.quantumMaterialReactionProductSource?.productTopology
        || null,
      quantumMaterialReactionProductTopologySchema: diagnostics.quantumMaterialReactionProductTopologySchema
        || diagnostics.quantumMaterialReactionProductSource?.productTopologySchema
        || null,
      quantumMaterialReactionProductTopologyModelId: diagnostics.quantumMaterialReactionProductTopologyModelId
        || diagnostics.quantumMaterialReactionProductSource?.productTopologyModelId
        || null,
      quantumMaterialReactionProductTopologyMode: diagnostics.quantumMaterialReactionProductTopologyMode
        || diagnostics.quantumMaterialReactionProductSource?.productTopologyMode
        || null,
      quantumMaterialReactionProductTopologyOverlayApplied: diagnostics.quantumMaterialReactionProductTopologyOverlayApplied,
      quantumMaterialReactionProductTopologyOverlayBondCount: diagnostics.quantumMaterialReactionProductTopologyOverlayBondCount,
      quantumMaterialReactionProductTopologyNaohMoleculeCount: diagnostics.quantumMaterialReactionProductTopologyNaohMoleculeCount,
      quantumMaterialReactionProductTopologyH2MoleculeCount: diagnostics.quantumMaterialReactionProductTopologyH2MoleculeCount,
      quantumMaterialReactionProductTopologyPartialHydrogenSiteCount: diagnostics.quantumMaterialReactionProductTopologyPartialHydrogenSiteCount,
      quantumMaterialReactionProductTopologyMutation: diagnostics.quantumMaterialReactionProductTopologyMutation || null,
      quantumMaterialReactionProductTopologyMutationSchema: diagnostics.quantumMaterialReactionProductTopologyMutationSchema
        || diagnostics.quantumMaterialReactionProductTopologyMutation?.schema
        || null,
      quantumMaterialReactionProductTopologyMutationStatus: diagnostics.quantumMaterialReactionProductTopologyMutationStatus
        || diagnostics.quantumMaterialReactionProductTopologyMutation?.status
        || null,
      quantumMaterialReactionProductTopologyMutationApplied: diagnostics.quantumMaterialReactionProductTopologyMutationApplied
        ?? diagnostics.quantumMaterialReactionProductTopologyMutation?.applied,
      quantumMaterialReactionProductTopologyNewMutationApplied: diagnostics.quantumMaterialReactionProductTopologyNewMutationApplied
        ?? diagnostics.quantumMaterialReactionProductTopologyMutation?.newMutationApplied,
      quantumMaterialReactionProductTopologyMutatedAtomCount: diagnostics.quantumMaterialReactionProductTopologyMutatedAtomCount
        ?? diagnostics.quantumMaterialReactionProductTopologyMutation?.mutatedAtomCount,
      quantumMaterialReactionProductTopologyRetiredWaterGroupCount: diagnostics.quantumMaterialReactionProductTopologyRetiredWaterGroupCount
        ?? diagnostics.quantumMaterialReactionProductTopologyMutation?.retiredWaterGroupCount,
	      quantumMaterialReactionProductTopologyMutationAtomInventoryConserved: diagnostics.quantumMaterialReactionProductTopologyMutationAtomInventoryConserved
	        ?? diagnostics.quantumMaterialReactionProductTopologyMutation?.reducedAtomInventoryConserved,
	      quantumMaterialReactionProductTopologyScientificMutation: diagnostics.quantumMaterialReactionProductTopologyScientificMutation
	        ?? diagnostics.quantumMaterialReactionProductTopologyMutation?.scientificMutation,
      quantumMaterialReactionProductTopologyGpuWriteback: diagnostics.quantumMaterialReactionProductTopologyGpuWriteback
        || diagnostics.quantumMaterialReactionProductTopologyMutation?.gpuWriteback
        || null,
      quantumMaterialReactionProductTopologyGpuWritebackSchema: diagnostics.quantumMaterialReactionProductTopologyGpuWritebackSchema
        || diagnostics.quantumMaterialReactionProductTopologyGpuWriteback?.schema
        || diagnostics.quantumMaterialReactionProductTopologyMutation?.gpuWritebackSchema
        || null,
      quantumMaterialReactionProductTopologyGpuWritebackStatus: diagnostics.quantumMaterialReactionProductTopologyGpuWritebackStatus
        || diagnostics.quantumMaterialReactionProductTopologyGpuWriteback?.status
        || diagnostics.quantumMaterialReactionProductTopologyMutation?.gpuWritebackStatus
        || null,
      quantumMaterialReactionProductTopologyGpuWritebackApplied: diagnostics.quantumMaterialReactionProductTopologyGpuWritebackApplied
        ?? diagnostics.quantumMaterialReactionProductTopologyGpuWriteback?.applied
        ?? diagnostics.quantumMaterialReactionProductTopologyMutation?.webgpuWritebackApplied,
      quantumMaterialReactionProductTopologyGpuWritebackKernelApplied: diagnostics.quantumMaterialReactionProductTopologyGpuWritebackKernelApplied
        ?? diagnostics.quantumMaterialReactionProductTopologyGpuWriteback?.webgpuKernelApplied
        ?? diagnostics.quantumMaterialReactionProductTopologyMutation?.webgpuWritebackKernelApplied,
      quantumMaterialReactionProductTopologyGpuWritebackCommandCount: diagnostics.quantumMaterialReactionProductTopologyGpuWritebackCommandCount
        ?? diagnostics.quantumMaterialReactionProductTopologyGpuWriteback?.commandCount
        ?? diagnostics.quantumMaterialReactionProductTopologyMutation?.gpuWritebackCommandCount,
      quantumMaterialReactionProductTopologyGpuWritebackCommandFloatStride: diagnostics.quantumMaterialReactionProductTopologyGpuWritebackCommandFloatStride
        ?? diagnostics.quantumMaterialReactionProductTopologyGpuWriteback?.commandFloatStride
        ?? diagnostics.quantumMaterialReactionProductTopologyMutation?.gpuWritebackCommandFloatStride,
	      molecularTopologyBufferAtomFloatStride: diagnostics.molecularTopologyBufferAtomFloatStride,
      molecularTopologyBufferMetadataFloatOffset: diagnostics.molecularTopologyBufferMetadataFloatOffset,
      molecularTopologyBufferMetadataFloatCount: diagnostics.molecularTopologyBufferMetadataFloatCount,
      molecularTopologyBufferMetadataFields: Array.isArray(diagnostics.molecularTopologyBufferMetadataFields)
        ? [...diagnostics.molecularTopologyBufferMetadataFields]
        : [],
      molecularTopologyBufferGpuVisible: diagnostics.molecularTopologyBufferGpuVisible,
      molecularTopologyBufferRoundTripApplied: diagnostics.molecularTopologyBufferRoundTripApplied,
      quantumMaterialReactionProductConservationAudit: diagnostics.quantumMaterialReactionProductConservationAudit || null,
      quantumMaterialReactionProductConservationAuditSchema: diagnostics.quantumMaterialReactionProductConservationAuditSchema
        || diagnostics.quantumMaterialReactionProductConservationAudit?.schema
        || null,
      quantumMaterialReactionProductConservationAuditStatus: diagnostics.quantumMaterialReactionProductConservationAuditStatus
        || diagnostics.quantumMaterialReactionProductConservationAudit?.status
        || null,
      quantumMaterialReactionProductConservationClosed: diagnostics.quantumMaterialReactionProductConservationClosed
        ?? diagnostics.quantumMaterialReactionProductConservationAudit?.reducedAtomConservationClosed,
      quantumMaterialReactionProductGraphComplete: diagnostics.quantumMaterialReactionProductGraphComplete
        ?? diagnostics.quantumMaterialReactionProductConservationAudit?.reducedProductGraphComplete,
      quantumMaterialReactionProductConservativeProductGraphReady: diagnostics.quantumMaterialReactionProductConservativeProductGraphReady
        ?? diagnostics.quantumMaterialReactionProductConservationAudit?.reducedConservativeProductGraphReady,
      quantumMaterialReactionProductAtomResidualProxy: diagnostics.quantumMaterialReactionProductAtomResidualProxy
        ?? diagnostics.quantumMaterialReactionProductConservationAudit?.atomConservationResidualProxy,
      quantumMaterialReactionProductHeatBudgetResidualProxy: diagnostics.quantumMaterialReactionProductHeatBudgetResidualProxy
        ?? diagnostics.quantumMaterialReactionProductConservationAudit?.heatBudgetResidualProxy,
      quantumMaterialReactionProductChargeBudgetResidualProxy: diagnostics.quantumMaterialReactionProductChargeBudgetResidualProxy
        ?? diagnostics.quantumMaterialReactionProductConservationAudit?.chargeBudgetResidualProxy,
      quantumMaterialReactionProductSiteCoverageFraction: diagnostics.quantumMaterialReactionProductSiteCoverageFraction
        ?? diagnostics.quantumMaterialReactionProductConservationAudit?.siteCoverageFraction,
      quantumMaterialReactionProductWaterConsumedCount: diagnostics.quantumMaterialReactionProductWaterConsumedCount
        ?? diagnostics.quantumMaterialReactionProductConservationAudit?.waterConsumedCount,
      quantumMaterialReactionProductWaterRemainingEstimate: diagnostics.quantumMaterialReactionProductWaterRemainingEstimate
        ?? diagnostics.quantumMaterialReactionProductConservationAudit?.waterRemainingEstimate,
      quantumMaterialReactionBarrierChargeTransferRequired: diagnostics.quantumMaterialReactionBarrierChargeTransferRequired
        ?? quantumMaterialSource?.reactionBarrierChargeTransferRequired,
      quantumMaterialReactionBarrierConfidence: diagnostics.quantumMaterialReactionBarrierConfidence
        ?? quantumMaterialSource?.reactionBarrierConfidence,
      quantumMaterialSourceStatisticalSourceEquation: diagnostics.quantumMaterialSourceStatisticalSourceEquation
        || quantumMaterialSource?.statisticalSourceEquation
        || null,
      quantumMaterialSourceStatisticalSourceEquationSchema: diagnostics.quantumMaterialSourceStatisticalSourceEquationSchema
        || quantumMaterialSource?.statisticalSourceEquation?.schema
        || null,
      quantumMaterialSourceStatisticalSourceChannelCount: diagnostics.quantumMaterialSourceStatisticalSourceChannelCount
        ?? quantumMaterialSource?.statisticalSourceChannelCount,
      quantumMaterialSourceStatisticalPressureDriveProxy: diagnostics.quantumMaterialSourceStatisticalPressureDriveProxy
        ?? quantumMaterialSource?.statisticalSourcePressureDriveProxy,
      quantumMaterialSourceStatisticalOpacityDriveProxy: diagnostics.quantumMaterialSourceStatisticalOpacityDriveProxy
        ?? quantumMaterialSource?.statisticalSourceOpacityDriveProxy,
      quantumMaterialSourceStatisticalIonizationDriveProxy: diagnostics.quantumMaterialSourceStatisticalIonizationDriveProxy
        ?? quantumMaterialSource?.statisticalSourceIonizationDriveProxy,
      quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy: diagnostics.quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy
        ?? quantumMaterialSource?.statisticalSourceDegeneracyPressureDriveProxy,
      quantumMaterialSourceStatisticalTemperatureDeltaKProxy: diagnostics.quantumMaterialSourceStatisticalTemperatureDeltaKProxy
        ?? quantumMaterialSource?.statisticalSourceTemperatureDeltaKProxy,
      quantumMaterialSourceStatisticalChargeDeltaProxy: diagnostics.quantumMaterialSourceStatisticalChargeDeltaProxy
        ?? quantumMaterialSource?.statisticalSourceChargeDeltaProxy,
      quantumMaterialSourceStatisticalThermalDampingScale: diagnostics.quantumMaterialSourceStatisticalThermalDampingScale
        ?? quantumMaterialSource?.statisticalSourceThermalDampingScale
    },
    validity: {
      modelTier: 'reduced-interactive-md-proxy',
      status: 'interactive-proxy'
    }
  });

  return makeClosureResult({
    modelId: 'reduced-molecular-dynamics-chemistry-v0',
    source: {
      solverId: result.solverId || 'molecular-dynamics',
      stateKey: result.stateKey || closureState.stateKey,
      backend: result.backend || 'unknown',
      executionContext: result.executionContext || null,
      sequence: result.sequence || state.sequence || 0
    },
    state: closureState,
    thermodynamics: {
      temperatureK: diagnostics.meanTemperatureK,
      pressurePa: environment.ambientPressurePa,
      specificEnthalpyProxy: diagnostics.specificEnthalpyProxy ?? specificEnergyProxy,
      specificFreeEnergyProxy: diagnostics.specificFreeEnergyProxy ?? thermoPhaseLedger?.specificFreeEnergyProxy,
      specificInternalEnergyProxy: diagnostics.specificInternalEnergyProxy ?? thermoPhaseLedger?.specificInternalEnergyProxy,
      entropyProxy: diagnostics.entropyProxy ?? thermoPhaseLedger?.entropyProxy,
      phaseEnergyRateProxy: diagnostics.phaseEnergyRateProxy ?? thermoPhaseLedger?.phaseEnergyRateProxy,
      phaseStabilityResidualProxy: diagnostics.phaseStabilityResidualProxy ?? thermoPhaseLedger?.phaseStabilityResidualProxy,
      sourceTemperatureDeltaKProxy: diagnostics.sourceTemperatureDeltaKProxy ?? thermoPhaseLedger?.sourceTemperatureDeltaKProxy,
      latentHeatBudgetProxy: diagnostics.latentHeatBudgetProxy ?? thermoPhaseLedger?.latentHeatBudgetProxy,
      latentHeatSinkProxy: diagnostics.latentHeatSinkProxy,
      latentHeatReleaseProxy: diagnostics.latentHeatReleaseProxy
    },
    transport: {
      electricalConductivitySm: diagnostics.electricalConductivityProxy
    },
    mechanics: {
      bulkModulusPa: diagnostics.quantumMaterialSourceBulkModulusPa,
      youngsModulusPa: diagnostics.quantumMaterialSourceYoungsModulusPa
    },
    electromagnetics: {
      chargeDensityCm3: atomCount > 0 ? finiteNumber(diagnostics.totalCharge, 0) / atomCount : 0,
      conductivitySm: diagnostics.electricalConductivityProxy,
      dielectricConstant: diagnostics.dielectricConstantProxy ?? (1
        + finiteNumber(diagnostics.polarBondFraction, 0) * 0.45
        + Math.min(4, finiteNumber(diagnostics.dipoleMomentProxy, 0) * 0.02))
    },
    chemistry: {
      atomCount,
      bondCount,
      species,
      molecularSpecies,
      reactionLedger,
      reactionEventLedger,
      reactionSource,
      dominantMolecule: diagnostics.dominantMolecule,
      recognizedMoleculeCount: diagnostics.recognizedMoleculeCount,
      stoichiometryResidualProxy: diagnostics.stoichiometryResidualProxy,
      componentClosureFraction: diagnostics.componentClosureFraction,
      reactionEventCount: diagnostics.reactionEventCount,
      formedBondCount: diagnostics.formedBondCount,
      brokenBondCount: diagnostics.brokenBondCount,
      moleculeSpeciesDelta: diagnostics.moleculeSpeciesDelta,
      reactionHeatSourceProxy: diagnostics.reactionHeatSourceProxy,
      reactionSpeciesRateProxy: diagnostics.reactionSpeciesRateProxy,
      reactionProgress: diagnostics.reactionProgress,
      heatReleaseProxy: diagnostics.heatReleaseProxy,
      forceEnergyLedger,
      thermoPhaseLedger,
      phaseEos: diagnostics.phaseEos || thermoPhaseLedger?.phaseEos || null,
      forceFieldPotentialEnergyProxy: diagnostics.forceFieldPotentialEnergyProxy,
      forceFieldTotalEnergyProxy: diagnostics.forceFieldTotalEnergyProxy,
      forceFieldBondedAttractionEnergyProxy: diagnostics.forceFieldBondedAttractionEnergyProxy,
      forceFieldBondStrainEnergyProxy: diagnostics.forceFieldBondStrainEnergyProxy,
      forceFieldElectrostaticEnergyProxy: diagnostics.forceFieldElectrostaticEnergyProxy,
      forceFieldRepulsionEnergyProxy: diagnostics.forceFieldRepulsionEnergyProxy,
      forceFieldQeqResidualPenaltyProxy: diagnostics.forceFieldQeqResidualPenaltyProxy,
      forceFieldQuantumMaterialSourceBiasEnergyProxy: diagnostics.forceFieldQuantumMaterialSourceBiasEnergyProxy,
      forceFieldQuantumMaterialPairForceBiasEnergyProxy: diagnostics.forceFieldQuantumMaterialPairForceBiasEnergyProxy,
      forceFieldQuantumMaterialBiasEnergyProxy: diagnostics.forceFieldQuantumMaterialBiasEnergyProxy,
      molecularGeometryForceLawSchema: diagnostics.molecularGeometryForceLawSchema,
      waterGeometryTargetSource: diagnostics.waterGeometryTargetSource,
      waterGeometrySourceApplied: diagnostics.waterGeometrySourceApplied,
      waterGeometryTripletCount: diagnostics.waterGeometryTripletCount,
      waterGeometryMeanAngleDeg: diagnostics.waterGeometryMeanAngleDeg,
      waterGeometryMeanAbsAngleErrorDeg: diagnostics.waterGeometryMeanAbsAngleErrorDeg,
      waterGeometryEnergyProxy: diagnostics.waterGeometryEnergyProxy,
      meanBondOrder: diagnostics.meanBondOrder,
      ionicBondCount: diagnostics.ionicBondCount,
      covalentBondCount: diagnostics.covalentBondCount,
      polarBondFraction: diagnostics.polarBondFraction,
      valenceSaturation: diagnostics.valenceSaturation,
      ionizationFraction: diagnostics.ionizationFraction,
      meanAbsCharge: diagnostics.meanAbsCharge,
      dipoleMomentProxy: diagnostics.dipoleMomentProxy,
      chargeEquilibration,
      chargeEquilibrationResidualRms: diagnostics.chargeEquilibrationResidualRms,
      chargeEquilibrationChargeRmsDelta: diagnostics.chargeEquilibrationChargeRmsDelta,
      chargeEquilibrationNeutralizationResidualCharge: chargeEquilibration?.neutralizationResidualCharge,
      quantumCoupling: quantumCoupling ? {
        ...quantumCoupling,
        applied: quantumApplied,
        matchedAtomCount: diagnostics.quantumCouplingMatchedAtomCount ?? quantumCoupling.matchedAtomCount ?? 0
      } : null,
      quantumMaterialSource: quantumMaterialSource ? {
        ...quantumMaterialSource,
        applied: diagnostics.quantumMaterialSourceApplied === true || quantumMaterialSource.applied === true,
        matchedAtomCount: diagnostics.quantumMaterialSource?.matchedAtomCount ?? quantumMaterialSource.matchedAtomCount ?? atomCount
      } : null,
      quantumMaterialElectronicChargeSourceApplied: diagnostics.quantumMaterialElectronicChargeSourceApplied,
      quantumMaterialElectronicChargeSourceSchema: diagnostics.quantumMaterialElectronicChargeSourceSchema,
      quantumMaterialElectronicChargeDeltaProxy: diagnostics.quantumMaterialElectronicChargeDeltaProxy,
      quantumMaterialElectronicIonizationDriveProxy: diagnostics.quantumMaterialElectronicIonizationDriveProxy,
      quantumMaterialElectronicChargeMobilityProxy: diagnostics.quantumMaterialElectronicChargeMobilityProxy,
      quantumMaterialElectronicHardnessSofteningProxy: diagnostics.quantumMaterialElectronicHardnessSofteningProxy,
      quantumMaterialElectronicScreeningDampingScale: diagnostics.quantumMaterialElectronicScreeningDampingScale,
      quantumMaterialElectronicQeqMixProxy: diagnostics.quantumMaterialElectronicQeqMixProxy,
      quantumMaterialReactionBarrierSurfaceApplied: diagnostics.quantumMaterialReactionBarrierSurfaceApplied,
      quantumMaterialReactionBarrierSurfaceSchema: diagnostics.quantumMaterialReactionBarrierSurfaceSchema,
      quantumMaterialReactionBarrierActivationEnergyEvProxy: diagnostics.quantumMaterialReactionBarrierActivationEnergyEvProxy,
      quantumMaterialReactionBarrierGateProxy: diagnostics.quantumMaterialReactionBarrierGateProxy,
      quantumMaterialReactionBarrierGateDampingScale: diagnostics.quantumMaterialReactionBarrierGateDampingScale,
      quantumMaterialReactionBarrierUnsupportedProductBlockerCount: diagnostics.quantumMaterialReactionBarrierUnsupportedProductBlockerCount,
      quantumMaterialReactionBarrierProductStoichiometryAvailable: diagnostics.quantumMaterialReactionBarrierProductStoichiometryAvailable,
      quantumMaterialReactionBarrierProductTopologyAvailable: diagnostics.quantumMaterialReactionBarrierProductTopologyAvailable,
      quantumMaterialReactionBarrierProductStoichiometry: diagnostics.quantumMaterialReactionBarrierProductStoichiometry || null,
      quantumMaterialReactionProductSource: diagnostics.quantumMaterialReactionProductSource || null,
      quantumMaterialReactionProductSourceApplied: diagnostics.quantumMaterialReactionProductSourceApplied,
      quantumMaterialReactionProductTargetReactionId: diagnostics.quantumMaterialReactionProductTargetReactionId,
      quantumMaterialReactionProductHeatReleaseProxy: diagnostics.quantumMaterialReactionProductHeatReleaseProxy,
      quantumMaterialReactionProductChargeDeltaProxy: diagnostics.quantumMaterialReactionProductChargeDeltaProxy,
      quantumMaterialReactionProductExtentProxy: diagnostics.quantumMaterialReactionProductExtentProxy,
      quantumMaterialReactionProductProgressDriveProxy: diagnostics.quantumMaterialReactionProductProgressDriveProxy,
      quantumMaterialReactionProductGasFormula: diagnostics.quantumMaterialReactionProductGasFormula,
      quantumMaterialReactionProductGasMoleculeFractionPerNa: diagnostics.quantumMaterialReactionProductGasMoleculeFractionPerNa,
      quantumMaterialReactionProductChargeTransferElectronCount: diagnostics.quantumMaterialReactionProductChargeTransferElectronCount,
      quantumMaterialReactionProductEnthalpyDeltaKjPerMolNaProxy: diagnostics.quantumMaterialReactionProductEnthalpyDeltaKjPerMolNaProxy,
      quantumMaterialReactionProductTopologyAvailable: diagnostics.quantumMaterialReactionProductTopologyAvailable,
      quantumMaterialReactionProductTopologyRequired: diagnostics.quantumMaterialReactionProductTopologyRequired,
      quantumMaterialReactionProductTopology: diagnostics.quantumMaterialReactionProductTopology || null,
      quantumMaterialReactionProductTopologySchema: diagnostics.quantumMaterialReactionProductTopologySchema,
      quantumMaterialReactionProductTopologyModelId: diagnostics.quantumMaterialReactionProductTopologyModelId,
      quantumMaterialReactionProductTopologyMode: diagnostics.quantumMaterialReactionProductTopologyMode,
      quantumMaterialReactionProductTopologyOverlayApplied: diagnostics.quantumMaterialReactionProductTopologyOverlayApplied,
      quantumMaterialReactionProductTopologyOverlayBondCount: diagnostics.quantumMaterialReactionProductTopologyOverlayBondCount,
      quantumMaterialReactionProductTopologyNaohMoleculeCount: diagnostics.quantumMaterialReactionProductTopologyNaohMoleculeCount,
      quantumMaterialReactionProductTopologyH2MoleculeCount: diagnostics.quantumMaterialReactionProductTopologyH2MoleculeCount,
      quantumMaterialReactionProductTopologyPartialHydrogenSiteCount: diagnostics.quantumMaterialReactionProductTopologyPartialHydrogenSiteCount,
      quantumMaterialReactionProductTopologyMutation: diagnostics.quantumMaterialReactionProductTopologyMutation || null,
      quantumMaterialReactionProductTopologyMutationSchema: diagnostics.quantumMaterialReactionProductTopologyMutationSchema,
      quantumMaterialReactionProductTopologyMutationStatus: diagnostics.quantumMaterialReactionProductTopologyMutationStatus,
	      quantumMaterialReactionProductTopologyMutationApplied: diagnostics.quantumMaterialReactionProductTopologyMutationApplied,
	      quantumMaterialReactionProductTopologyNewMutationApplied: diagnostics.quantumMaterialReactionProductTopologyNewMutationApplied,
	      quantumMaterialReactionProductTopologyMutatedAtomCount: diagnostics.quantumMaterialReactionProductTopologyMutatedAtomCount,
	      quantumMaterialReactionProductTopologyRetiredWaterGroupCount: diagnostics.quantumMaterialReactionProductTopologyRetiredWaterGroupCount,
	      quantumMaterialReactionProductTopologyMutationAtomInventoryConserved: diagnostics.quantumMaterialReactionProductTopologyMutationAtomInventoryConserved,
	      quantumMaterialReactionProductTopologyScientificMutation: diagnostics.quantumMaterialReactionProductTopologyScientificMutation,
      quantumMaterialReactionProductTopologyGpuWritebackApplied: diagnostics.quantumMaterialReactionProductTopologyGpuWritebackApplied,
      quantumMaterialReactionProductTopologyGpuWritebackKernelApplied: diagnostics.quantumMaterialReactionProductTopologyGpuWritebackKernelApplied,
      quantumMaterialReactionProductTopologyGpuWritebackCommandCount: diagnostics.quantumMaterialReactionProductTopologyGpuWritebackCommandCount,
      quantumMaterialReactionProductTopologyGpuWritebackCommandFloatStride: diagnostics.quantumMaterialReactionProductTopologyGpuWritebackCommandFloatStride,
	      molecularTopologyBufferGpuVisible: diagnostics.molecularTopologyBufferGpuVisible,
      molecularTopologyBufferRoundTripApplied: diagnostics.molecularTopologyBufferRoundTripApplied,
      molecularTopologyBufferAtomFloatStride: diagnostics.molecularTopologyBufferAtomFloatStride,
      molecularTopologyBufferMetadataFloatCount: diagnostics.molecularTopologyBufferMetadataFloatCount,
      quantumMaterialReactionProductConservationAudit: diagnostics.quantumMaterialReactionProductConservationAudit || null,
      quantumMaterialReactionProductConservationAuditSchema: diagnostics.quantumMaterialReactionProductConservationAuditSchema,
      quantumMaterialReactionProductConservationAuditStatus: diagnostics.quantumMaterialReactionProductConservationAuditStatus,
      quantumMaterialReactionProductConservationClosed: diagnostics.quantumMaterialReactionProductConservationClosed,
      quantumMaterialReactionProductGraphComplete: diagnostics.quantumMaterialReactionProductGraphComplete,
      quantumMaterialReactionProductConservativeProductGraphReady: diagnostics.quantumMaterialReactionProductConservativeProductGraphReady,
      quantumMaterialReactionProductAtomResidualProxy: diagnostics.quantumMaterialReactionProductAtomResidualProxy,
      quantumMaterialReactionProductHeatBudgetResidualProxy: diagnostics.quantumMaterialReactionProductHeatBudgetResidualProxy,
      quantumMaterialReactionProductChargeBudgetResidualProxy: diagnostics.quantumMaterialReactionProductChargeBudgetResidualProxy,
      quantumMaterialReactionProductSiteCoverageFraction: diagnostics.quantumMaterialReactionProductSiteCoverageFraction,
      quantumMaterialReactionProductWaterConsumedCount: diagnostics.quantumMaterialReactionProductWaterConsumedCount,
      quantumMaterialReactionProductWaterRemainingEstimate: diagnostics.quantumMaterialReactionProductWaterRemainingEstimate
    },
    phase: {
      phaseFractions,
      solidFraction: diagnostics.solidFraction ?? thermoPhaseLedger?.solidFraction,
      liquidFraction: diagnostics.liquidFraction ?? thermoPhaseLedger?.liquidFraction,
      vaporFraction: diagnostics.vaporFraction ?? thermoPhaseLedger?.vaporFraction,
      plasmaFraction: diagnostics.plasmaFraction ?? thermoPhaseLedger?.plasmaFraction,
      phaseRegime: diagnostics.phaseRegime ?? thermoPhaseLedger?.phaseRegime,
      phaseChangeRateProxy: diagnostics.phaseChangeRateProxy ?? thermoPhaseLedger?.phaseChangeRateProxy,
      latentHeatSinkProxy: diagnostics.latentHeatSinkProxy ?? thermoPhaseLedger?.latentHeatSinkProxy,
      latentHeatReleaseProxy: diagnostics.latentHeatReleaseProxy ?? thermoPhaseLedger?.latentHeatReleaseProxy,
      waterMoleculeFraction: diagnostics.waterMoleculeFraction ?? thermoPhaseLedger?.waterMoleculeFraction,
      condensationOrderProxy: diagnostics.condensationOrderProxy ?? thermoPhaseLedger?.condensationOrderProxy,
      vaporizationDriveProxy: diagnostics.vaporizationDriveProxy ?? thermoPhaseLedger?.vaporizationDriveProxy,
      freezingDriveProxy: diagnostics.freezingDriveProxy ?? thermoPhaseLedger?.freezingDriveProxy,
      plasmaDriveProxy: diagnostics.plasmaDriveProxy ?? thermoPhaseLedger?.plasmaDriveProxy,
      pressureProxy: diagnostics.pressureProxy,
      ionizedFraction: diagnostics.ionizationFraction
    },
    diagnostics: {
      elapsedTime: result.elapsedTime,
      executionContext: result.executionContext,
      pairSearchMode: diagnostics.pairSearchMode,
      neighborCandidatePairCount: diagnostics.neighborCandidatePairCount,
      bondCandidateCount: diagnostics.bondCandidateCount,
      spatialCellCount: diagnostics.spatialCellCount,
      webgpuStatus: {
        kernelMode: webgpuStatus.kernelMode || 'none',
        neighborListMode: webgpuStatus.neighborListMode || 'none',
        acceptedNeighborPairCount: webgpuStatus.acceptedNeighborPairCount,
        candidatePairCount: webgpuStatus.candidatePairCount,
        neighborCapacity: webgpuStatus.neighborCapacity,
        overflowAtoms: webgpuStatus.overflowAtoms,
        overflowCells: webgpuStatus.overflowCells
      },
      webgpuError: result.webgpuError || null
    },
    validity: {
      status: 'interactive-proxy',
      regimes: ['molecular', 'mpm', 'surface'],
      bounds: {
        atomCount,
        supportedElements: Object.keys(species),
        temperatureK: diagnostics.meanTemperatureK,
        pressureProxy: diagnostics.pressureProxy
      },
      warnings: [
        'Reduced molecular dynamics proxy; not a validated force field.',
        'Charge, conductivity, pressure, and reaction outputs are interactive proxies, not calibrated ReaxFF/QEq/DFT/AIMD values.'
      ]
    },
    uncertainty: {
      mode: 'heuristic-reduced-md-model',
      confidence
    },
    conservation: result.conservation || {},
    provenance: {
      source: 'demos/multiscale/src/compute/molecularDynamicsTasks.js'
    }
  });
}

export function closureResultFromMaterialPacket(packet = {}, {
  layerId = 'molecular',
  solverId = 'schrodinger-materials',
  stateKey = null,
  environment = {},
  conservation = {}
} = {}) {
  const state = packet.state || {};
  const validation = packet.validation || {};
  const conductivity = packet.electromagnetic?.electricalConductivitySpm;
  const closureState = makeClosureState({
    layerId,
    materialId: packet.materialId || 'unknown-material',
    solverId,
    stateKey: stateKey || `material:${packet.sampleId || packet.materialId || 'unknown'}`,
    sequence: packet.timestamp || 0,
    environment,
    primitive: {
      temperatureK: state.temperatureK,
      pressurePa: state.pressurePa,
      phase: state.phase,
      densityKgM3: state.densityKgM3
    },
    species: state.composition || {},
    phaseFractions: state.phase ? { [state.phase]: 1 } : {},
    validity: {
      modelTier: packet.modelTier,
      status: validation.status,
      referenceSet: validation.referenceSet
    }
  });

  return makeClosureResult({
    modelId: packet.modelTier || 'schrodinger-material-packet-v0',
    source: {
      solverId,
      stateKey: closureState.stateKey,
      backend: 'schrodinger-material-packet',
      sequence: packet.timestamp || 0,
      materialId: packet.materialId || null,
      sampleId: packet.sampleId || null
    },
    state: closureState,
    thermodynamics: {
      temperatureK: state.temperatureK,
      pressurePa: state.pressurePa,
      densityKgM3: state.densityKgM3,
      heatCapacityJkgK: packet.thermal?.heatCapacityJkgK,
      latentHeatJkg: packet.thermal?.latentHeatJkg
    },
    transport: {
      thermalConductivityWmK: packet.thermal?.thermalConductivityWmK,
      electricalConductivitySm: conductivity,
      viscosityPaS: packet.mechanics?.viscosityPaS
    },
    mechanics: {
      bulkModulusPa: packet.mechanics?.bulkModulusPa,
      youngsModulusPa: packet.mechanics?.youngsModulusPa,
      shearModulusPa: packet.mechanics?.shearModulusPa,
      surfaceTensionNpm: packet.mechanics?.surfaceTensionNpm
    },
    electromagnetics: {
      conductivitySm: conductivity,
      dielectricConstant: packet.electromagnetic?.dielectricConstant,
      magneticSusceptibility: packet.electromagnetic?.magneticSusceptibility
    },
    chemistry: {
      reactionRates: packet.chemical?.reactionRates || {},
      bondEvents: packet.chemical?.bondEvents || [],
      ph: packet.chemical?.ph ?? null,
      ionFractions: packet.chemical?.ionFractions || {}
    },
    phase: {
      phase: state.phase,
      phaseFractions: state.phase ? { [state.phase]: 1 } : {},
      eosParams: packet.thermal?.eosParams || {}
    },
    diagnostics: {
      optical: packet.optical || {},
      nuclear: packet.nuclear || {},
      timestamp: packet.timestamp,
      validUntil: packet.validUntil
    },
    validity: {
      status: validation.status || 'approximate',
      regimes: [layerId],
      bounds: validation.tolerances || {},
      warnings: validation.warnings || []
    },
    uncertainty: {
      mode: validation.status === 'validated' ? 'reference-data' : 'reference-fit-or-table',
      confidence: validation.status === 'validated' ? 0.85 : 0.42
    },
    conservation,
    provenance: {
      source: 'demos/schrodinger/src/materials/propertyPacket.js',
      references: validation.referenceSet ? [validation.referenceSet] : []
    }
  });
}

export function materialPacketFromClosureResult(result = {}, {
  validMs = 2000,
  now = Date.now()
} = {}) {
  const state = result.state || {};
  const source = result.source || {};
  const thermodynamics = result.thermodynamics || {};
  const mechanics = result.mechanics || {};
  const transport = result.transport || {};
  const electromagnetics = result.electromagnetics || {};
  const chemistry = result.chemistry || {};
  const phase = result.phase || {};
  const diagnostics = result.diagnostics || {};
  const validation = result.validity || {};
  return {
    materialId: state.materialId || source.materialId || 'closure.material',
    sampleId: source.sampleId || source.stateKey || state.stateKey || 'closure-cell',
    modelTier: result.modelId || 'closure-result',
    timestamp: now,
    validUntil: now + validMs,
    state: {
      temperatureK: thermodynamics.temperatureK ?? state.primitive?.temperatureK ?? null,
      pressurePa: thermodynamics.pressurePa ?? state.primitive?.pressurePa ?? null,
      phase: phase.phase || Object.keys(phase.phaseFractions || state.phaseFractions || {})[0] || 'unknown',
      composition: state.species || {},
      densityKgM3: thermodynamics.densityKgM3 ?? state.primitive?.densityKgM3 ?? null
    },
    mechanics: {
      bulkModulusPa: mechanics.bulkModulusPa ?? null,
      youngsModulusPa: mechanics.youngsModulusPa ?? null,
      shearModulusPa: mechanics.shearModulusPa ?? null,
      viscosityPaS: transport.viscosityPaS ?? null,
      surfaceTensionNpm: mechanics.surfaceTensionNpm ?? null
    },
    thermal: {
      heatCapacityJkgK: thermodynamics.heatCapacityJkgK ?? null,
      thermalConductivityWmK: transport.thermalConductivityWmK ?? null,
      latentHeatJkg: thermodynamics.latentHeatJkg ?? null,
      eosParams: phase.eosParams || {}
    },
    optical: diagnostics.optical || {
      refractiveIndex: null,
      absorptionRgb: [0, 0, 0],
      scatteringRgb: [0, 0, 0],
      polarizability: null
    },
    electromagnetic: {
      dielectricConstant: electromagnetics.dielectricConstant ?? null,
      electricalConductivitySpm: electromagnetics.conductivitySm ?? transport.electricalConductivitySm ?? null,
      magneticSusceptibility: electromagnetics.magneticSusceptibility ?? null
    },
    chemical: {
      reactionRates: chemistry.reactionRates || {},
      bondEvents: chemistry.bondEvents || [],
      ph: chemistry.ph ?? null,
      ionFractions: chemistry.ionFractions || {}
    },
    nuclear: diagnostics.nuclear || {
      isotopeFractions: {},
      activityBqKg: 0,
      decayHeatWKg: 0,
      radiationSourceTerms: []
    },
    validation: {
      status: validation.status || 'approximate',
      referenceSet: result.provenance?.references?.[0] || result.provenance?.source || 'closure-result',
      tolerances: validation.bounds || {},
      warnings: validation.warnings || []
    }
  };
}
