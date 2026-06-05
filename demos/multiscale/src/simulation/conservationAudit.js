import {
  createFieldMetadataReport,
  describeMultiscaleField
} from './fieldMetadata.js';
import {
  summarizeMolecularTargetMutationApplyExecutionReport,
  summarizeMolecularTargetMutationApplyValidationReport,
  summarizeMolecularTargetMutationCommitReport,
  summarizeMolecularTargetMutationDispatchReport,
  summarizeMolecularTargetMutationInvariantCheckReport,
  summarizeMolecularTargetMutationOperationPlanReport,
  summarizeMolecularTargetMutationPreflightReport,
  summarizeMolecularTargetMutatorRegistryReport,
  summarizeMolecularTargetMutatorPreviewReport,
  summarizeMolecularSourceBufferAcceptanceReport,
  summarizeMolecularSourceBufferWritebackValidationReport,
  summarizeMolecularTargetBufferReplayValidationReport,
  summarizeMolecularTargetBufferMutationAuditReport,
  summarizeMolecularTargetBufferWorkerWriteQueueReport,
  summarizeMolecularTargetBufferWorkerWriteExecutionReport,
  summarizeMolecularTargetBufferWorkerWriteVerificationReport,
  summarizeMolecularScientificInvariantGateReport,
  summarizeMolecularConservativeSourceBufferReport,
  summarizeMolecularSourceBufferApplicationReport,
  summarizeMolecularTargetSourceIntakeReport,
  summarizeMolecularTargetSourceReconciliationReport,
  summarizeMolecularTargetSourceResponseReport
} from '../../../shared/sourceSinkContract.js';

export const MULTISCALE_CONSERVATION_AUDIT_SCHEMA = 'peercompute.multiscale.conservation-audit.v0';
export const MULTISCALE_COMPUTE_RESIZE_CONSERVATION_SCHEMA = 'peercompute.multiscale.compute-resize-conservation.v0';

const DEFAULT_WATER_INVENTORY_KG = 0.42;

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

function expRounded(value, digits = 4) {
  return Number(finite(value).toExponential(digits));
}

function createComputeResizeConservation(computeResize = null) {
  const resize = computeResize?.scalePoolResize || computeResize;
  const correction = resize?.resizeCorrectionSummary;
  const audit = resize?.resizeAuditSummary;
  if (!resize || !correction || correction.schema !== 'peercompute.multiscale.compute.particle-resize-correction-summary.v0') {
    return null;
  }
  const massBefore = Math.abs(finite(correction.maxAbsMassProxyDeltaBefore, correction.maxAbsMassProxyDelta));
  const massAfter = Math.abs(finite(correction.maxAbsMassProxyDeltaAfter, correction.maxAbsMassProxyDelta));
  const momentumBefore = Math.abs(finite(correction.maxAbsMomentumDeltaBefore));
  const momentumAfter = Math.abs(finite(correction.maxAbsMomentumDeltaAfter));
  const kineticBefore = Math.abs(finite(correction.maxAbsKineticEnergyDeltaBefore));
  const kineticAfter = Math.abs(finite(correction.maxAbsKineticEnergyDeltaAfter));
  return {
    schema: MULTISCALE_COMPUTE_RESIZE_CONSERVATION_SCHEMA,
    mode: 'interactive-record-scale-proxy',
    reason: resize.reason || 'unknown',
    changed: resize.changed !== false,
    particleCountBefore: Math.max(0, Math.round(finite(resize.previous?.totalParticleCount))),
    particleCountAfter: Math.max(0, Math.round(finite(resize.next?.totalParticleCount))),
    plannedShardTasksBefore: Math.max(0, Math.round(finite(resize.previous?.plannedShardTasks))),
    plannedShardTasksAfter: Math.max(0, Math.round(finite(resize.next?.plannedShardTasks))),
    carriedForwardShardCount: Math.max(0, Math.round(finite(resize.carriedForwardShardCount))),
    carriedForwardRecordShardCount: Math.max(0, Math.round(finite(resize.carriedForwardRecordShardCount))),
    auditedShardCount: Math.max(0, Math.round(finite(audit?.auditedShardCount))),
    correctedShardCount: Math.max(0, Math.round(finite(correction.correctedShardCount))),
    appliedShardCount: Math.max(0, Math.round(finite(correction.appliedShardCount))),
    massConservedShardCount: Math.max(0, Math.round(finite(correction.massConservedShardCount))),
    massProxySource: correction.massProxySource || audit?.massProxySource || 'unknown',
    massConservationMode: correction.massConservationMode || 'none',
    momentumMode: correction.momentumMode || audit?.momentumMode || 'unknown',
    kineticEnergyMode: correction.kineticEnergyMode || audit?.kineticEnergyMode || 'unknown',
    maxAbsMassProxyDeltaBefore: expRounded(massBefore, 4),
    maxAbsMassProxyDeltaAfter: expRounded(massAfter, 4),
    maxMassScaleDelta: expRounded(correction.maxMassScaleDelta, 4),
    maxAbsMomentumDeltaBefore: expRounded(momentumBefore, 4),
    maxAbsMomentumDeltaAfter: expRounded(momentumAfter, 4),
    maxAbsKineticEnergyDeltaBefore: expRounded(kineticBefore, 4),
    maxAbsKineticEnergyDeltaAfter: expRounded(kineticAfter, 4),
    residualImprovement: {
      massProxy: expRounded(Math.max(0, massBefore - massAfter), 4),
      momentum: expRounded(Math.max(0, momentumBefore - momentumAfter), 4),
      kineticEnergy: expRounded(Math.max(0, kineticBefore - kineticAfter), 4)
    },
    note: 'Compute capacity resize conservation uses ladder record scale as an interactive proxy, not a validated material mass field.'
  };
}

export function createConservationAudit({
  state = {},
  environment = {},
  timeSeconds = 0,
  referenceWaterMassKg = DEFAULT_WATER_INVENTORY_KG,
  computeResize = null,
  molecularSourceSinkBalance = null,
  molecularSourceEquation = null,
  molecularSourceTransfer = null,
  molecularSourceTransferApplication = null,
  molecularSourceTransferTargetPreview = null,
  molecularTargetMutatorRegistry = null,
  molecularTargetMutationPreflight = null,
  molecularTargetMutationOperationPlan = null,
  molecularTargetMutationInvariantCheck = null,
  molecularTargetMutationCommit = null,
  molecularTargetMutationDispatch = null,
  molecularTargetMutationApplyValidation = null,
  molecularTargetMutationApplyExecution = null,
  molecularTargetSourceIntake = null,
  molecularTargetSourceReconciliation = null,
  molecularTargetSourceResponse = null,
  molecularConservativeSourceBuffer = null,
  molecularSourceBufferAcceptance = null,
  molecularSourceBufferWritebackValidation = null,
  molecularTargetBufferReplayValidation = null,
  molecularTargetBufferMutationAudit = null,
  molecularTargetBufferWorkerWriteQueue = null,
  molecularTargetBufferWorkerWriteExecution = null,
  molecularTargetBufferWorkerWriteVerification = null,
  molecularScientificInvariantGate = null
} = {}) {
  const balloon = state.balloon || {};
  const membraneShell = balloon.membraneShell || {};
  const surface = state.surface || {};
  const plume = surface.combustionPlume || {};
  const reactiveCell = surface.reactiveCell || {};
  const mpm = state.mpm || {};
  const sph = mpm.sphMaterial || {};
  const planet = state.planet || {};
  const hydro = planet.hydroAtmosphere || {};
  const solar = state.solar || {};
  const cosmology = state.cosmology || {};
  const cosmologyExpansion = cosmology.expansion || {};
  const radiation = solar.radiationOpacity || {};
  const stellarFusion = solar.stellarFusion || {};
  const magnetosphere = solar.magnetosphere || {};
  const pic = solar.picPlasmaPatch || {};
  const relativity = solar.relativity || {};
  const nbody = solar.nbody || {};
  const molecular = state.molecular || {};
  const molecularDynamics = molecular.molecularDynamics || {};
  const sourceSinkBalance = molecularSourceSinkBalance || molecular.sourceSinkBalance || {};
  const sourceEquation = molecularSourceEquation || molecular.sourceEquation || {};
  const sourceTransfer = molecularSourceTransfer || molecular.sourceTransfer || {};
  const sourceTransferApplication = molecularSourceTransferApplication || molecular.sourceTransferApplication || {};
  const sourceTransferTargetPreview = molecularSourceTransferTargetPreview || molecular.sourceTransferTargetPreview || {};
  const sourceTransferTargetPreviewSummary = summarizeMolecularTargetMutatorPreviewReport(sourceTransferTargetPreview) || {};
  const targetMutatorRegistry = molecularTargetMutatorRegistry || molecular.targetMutatorRegistry || {};
  const targetMutatorRegistrySummary = summarizeMolecularTargetMutatorRegistryReport(targetMutatorRegistry) || {};
  const targetMutationPreflight = molecularTargetMutationPreflight || molecular.targetMutationPreflight || {};
  const targetMutationPreflightSummary = summarizeMolecularTargetMutationPreflightReport(targetMutationPreflight) || {};
  const targetMutationOperationPlan = molecularTargetMutationOperationPlan || molecular.targetMutationOperationPlan || {};
  const targetMutationOperationPlanSummary = summarizeMolecularTargetMutationOperationPlanReport(targetMutationOperationPlan) || {};
  const targetMutationInvariantCheck = molecularTargetMutationInvariantCheck || molecular.targetMutationInvariantCheck || {};
  const targetMutationInvariantCheckSummary = summarizeMolecularTargetMutationInvariantCheckReport(targetMutationInvariantCheck) || {};
  const targetMutationCommit = molecularTargetMutationCommit || molecular.targetMutationCommit || {};
  const targetMutationCommitSummary = summarizeMolecularTargetMutationCommitReport(targetMutationCommit) || {};
  const targetMutationDispatch = molecularTargetMutationDispatch || molecular.targetMutationDispatch || {};
  const targetMutationDispatchSummary = summarizeMolecularTargetMutationDispatchReport(targetMutationDispatch) || {};
  const targetMutationApplyValidation = molecularTargetMutationApplyValidation || molecular.targetMutationApplyValidation || {};
  const targetMutationApplyValidationSummary = summarizeMolecularTargetMutationApplyValidationReport(targetMutationApplyValidation) || {};
  const targetMutationApplyExecution = molecularTargetMutationApplyExecution || molecular.targetMutationApplyExecution || {};
  const targetMutationApplyExecutionSummary = summarizeMolecularTargetMutationApplyExecutionReport(targetMutationApplyExecution) || {};
  const targetSourceIntake = molecularTargetSourceIntake || molecular.targetSourceIntake || {};
  const targetSourceIntakeSummary = summarizeMolecularTargetSourceIntakeReport(targetSourceIntake) || {};
  const targetSourceResponse = molecularTargetSourceResponse || molecular.targetSourceResponse || {};
  const targetSourceResponseSummary = summarizeMolecularTargetSourceResponseReport(targetSourceResponse) || {};
  const targetSourceReconciliation = molecularTargetSourceReconciliation || molecular.targetSourceReconciliation || {};
  const targetSourceReconciliationSummary = summarizeMolecularTargetSourceReconciliationReport(targetSourceReconciliation) || {};
  const conservativeSourceBuffer = molecularConservativeSourceBuffer || molecular.conservativeSourceBuffer || {};
  const conservativeSourceBufferSummary = summarizeMolecularConservativeSourceBufferReport(conservativeSourceBuffer) || {};
  const sourceBufferAcceptance = molecularSourceBufferAcceptance || molecular.sourceBufferAcceptance || {};
  const sourceBufferAcceptanceSummary = summarizeMolecularSourceBufferAcceptanceReport(sourceBufferAcceptance) || {};
  const sourceBufferWritebackValidation = molecularSourceBufferWritebackValidation || molecular.sourceBufferWritebackValidation || {};
  const sourceBufferWritebackValidationSummary = summarizeMolecularSourceBufferWritebackValidationReport(
    sourceBufferWritebackValidation
  ) || {};
  const targetBufferReplayValidation = molecularTargetBufferReplayValidation || molecular.targetBufferReplayValidation || {};
  const targetBufferReplayValidationSummary = summarizeMolecularTargetBufferReplayValidationReport(
    targetBufferReplayValidation
  ) || {};
  const targetBufferMutationAudit = molecularTargetBufferMutationAudit || molecular.targetBufferMutationAudit || {};
  const targetBufferMutationAuditSummary = summarizeMolecularTargetBufferMutationAuditReport(
    targetBufferMutationAudit
  ) || {};
  const targetBufferWorkerWriteQueue = molecularTargetBufferWorkerWriteQueue || molecular.targetBufferWorkerWriteQueue || {};
  const targetBufferWorkerWriteQueueSummary = summarizeMolecularTargetBufferWorkerWriteQueueReport(
    targetBufferWorkerWriteQueue
  ) || {};
  const targetBufferWorkerWriteExecution = molecularTargetBufferWorkerWriteExecution || molecular.targetBufferWorkerWriteExecution || {};
  const targetBufferWorkerWriteExecutionSummary = summarizeMolecularTargetBufferWorkerWriteExecutionReport(
    targetBufferWorkerWriteExecution
  ) || {};
  const targetBufferWorkerWriteVerification = molecularTargetBufferWorkerWriteVerification || molecular.targetBufferWorkerWriteVerification || {};
  const targetBufferWorkerWriteVerificationSummary = summarizeMolecularTargetBufferWorkerWriteVerificationReport(
    targetBufferWorkerWriteVerification
  ) || {};
  const scientificInvariantGate = molecularScientificInvariantGate || molecular.scientificInvariantGate || {};
  const scientificInvariantGateSummary = summarizeMolecularScientificInvariantGateReport(scientificInvariantGate) || {};
  const reactiveSourceBufferApplicationSummary = summarizeMolecularSourceBufferApplicationReport(
    reactiveCell.molecularSourceBufferApplication
  ) || {};
  const sphSourceBufferApplicationSummary = summarizeMolecularSourceBufferApplicationReport(
    sph.molecularSourceBufferApplication
  ) || {};
  const molecularSourceBufferApplicationAppliedCount = [
    reactiveSourceBufferApplicationSummary,
    sphSourceBufferApplicationSummary
  ].filter((summary) => summary.applied === true).length;
  const molecularSourceBufferApplicationAppliedFieldCount =
    Math.max(0, Math.round(finite(reactiveSourceBufferApplicationSummary.appliedFieldCount)))
    + Math.max(0, Math.round(finite(sphSourceBufferApplicationSummary.appliedFieldCount)));
  const molecularSourceBufferApplicationSourceTermCount =
    Math.max(0, Math.round(finite(reactiveSourceBufferApplicationSummary.sourceTermCount)))
    + Math.max(0, Math.round(finite(sphSourceBufferApplicationSummary.sourceTermCount)));
  const molecularSourceBufferApplicationHeatRate = finite(reactiveSourceBufferApplicationSummary.appliedHeatRateWProxy)
    + finite(sphSourceBufferApplicationSummary.appliedHeatRateWProxy);
  const molecularSourceBufferApplicationThermalDrive = finite(reactiveSourceBufferApplicationSummary.thermalDrive)
    + finite(sphSourceBufferApplicationSummary.thermalDrive);
  const molecularSourceBufferApplicationResidual = Math.max(
    0,
    finite(reactiveSourceBufferApplicationSummary.applicationResidualProxy),
    finite(sphSourceBufferApplicationSummary.applicationResidualProxy)
  );
  const molecularSourceBufferApplicationMaxDelta = Math.max(
    0,
    Math.abs(finite(reactiveSourceBufferApplicationSummary.maxAbsFieldDeltaProxy)),
    Math.abs(finite(sphSourceBufferApplicationSummary.maxAbsFieldDeltaProxy))
  );
  const sourceEquationEnergy = sourceEquation.terms?.energy || sourceEquation;
  const sourceEquationSpecies = sourceEquation.terms?.species || sourceEquation;
  const computeResizeConservation = createComputeResizeConservation(computeResize);

  const waterLiquidKg = Math.max(0, finite(balloon.waterMassKg));
  const waterVaporKg = Math.max(0, finite(balloon.steamMassKg));
  const waterReleasedKg = Math.max(0, finite(balloon.spillReleasedKg));
  const waterInventoryKg = waterLiquidKg + waterVaporKg + waterReleasedKg;
  const waterMassDeltaKg = waterInventoryKg - referenceWaterMassKg;
  const waterMassRelativeError = referenceWaterMassKg > 0
    ? Math.abs(waterMassDeltaKg) / referenceWaterMassKg
    : 0;

  const hydrodynamicDrift = Math.abs(finite(hydro.massDrift)) + Math.abs(finite(hydro.moistureDrift));
  const materialMassDrift = Math.abs(finite(sph.massDrift));
  const materialKineticDrift = Math.abs(finite(sph.kineticEnergyDrift));
  const speciesDelta = Math.abs(finite(reactiveCell.speciesInventoryDelta));
  const nbodyRelativeEnergyDrift = Math.abs(finite(nbody.relativeEnergyDrift));
  const radiationEnergyDrift = Math.abs(finite(radiation.radiationEnergyDrift));
  const stellarFusionEnergyDrift = Math.abs(finite(stellarFusion.energyDrift));
  const stellarFusionSpeciesDrift = Math.abs(finite(stellarFusion.speciesDrift));
  const magnetosphereMassDrift = Math.abs(finite(magnetosphere.massDrift));
  const magnetosphereEnergyDelta = Math.abs(finite(magnetosphere.plasmaEnergyDelta)) + Math.abs(finite(magnetosphere.magneticEnergyDelta));
  const magnetosphereDivergence = Math.abs(finite(magnetosphere.divergenceBProxy));
  const picChargeDrift = Math.abs(finite(pic.chargeDrift));
  const picEnergyDelta = Math.abs(finite(pic.kineticEnergyDelta)) + Math.abs(finite(pic.fieldEnergyDelta));
  const picDivergenceE = Math.abs(finite(pic.divergenceEProxy));
  const picChargeImbalance = Math.abs(finite(pic.chargeImbalance));
  const relativisticEnergyDelta = Math.abs(finite(relativity.relativisticEnergyDelta));
  const relativisticTimeDilationDrift = Math.abs(finite(relativity.timeDilationDrift));
  const relativisticSpeed = Math.abs(finite(relativity.maxSpeedFractionC));
  const cosmologyExpansionEnergyDelta = Math.abs(finite(cosmologyExpansion.expansionEnergyDelta));
  const cosmologyDensityDrift = Math.abs(finite(cosmologyExpansion.densityContrastDrift));
  const cosmologyStructureGrowthDelta = Math.abs(finite(cosmologyExpansion.structureGrowthDelta));
  const cosmologyExpansionWork = Math.abs(finite(cosmologyExpansion.expansionWorkProxy));
  const molecularEnergyDelta = Math.abs(finite(molecularDynamics.energyDelta));
  const molecularChargeDrift = Math.abs(finite(molecularDynamics.chargeDrift));
  const molecularHeatReleaseDelta = Math.abs(finite(molecularDynamics.heatReleaseDelta));
  const molecularIonization = Math.abs(finite(molecularDynamics.ionizationFraction));
  const reactiveMolecularClosureApplied = reactiveCell.molecularClosureApplied === true ? 1 : 0;
  const reactiveMolecularClosureThermalDrive = Math.max(0, finite(reactiveCell.molecularClosureThermalDrive));
  const reactiveMolecularClosureHeatFlux = Math.max(0, finite(reactiveCell.molecularClosureHeatFluxProxy));
  const reactiveMolecularReactionHeatSourceProxy = finite(reactiveCell.molecularReactionHeatSourceProxy);
  const reactiveMolecularReactionSpeciesRateProxy = Math.max(0, finite(reactiveCell.molecularReactionSpeciesRateProxy));
  const reactiveMolecularReactionSourceDrive = Math.max(0, finite(reactiveCell.molecularReactionSourceDrive));
  const reactiveMolecularReactionCoolingDrive = Math.max(0, finite(reactiveCell.molecularReactionCoolingDrive));
  const reactiveMolecularPhaseDrive = Math.max(0, finite(reactiveCell.molecularPhaseDriveProxy));
  const reactiveMolecularPhaseHeatingDrive = Math.max(0, finite(reactiveCell.molecularPhaseHeatingDrive));
  const reactiveMolecularPhaseCoolingDrive = Math.max(0, finite(reactiveCell.molecularPhaseCoolingDrive));
  const reactiveMolecularLatentHeatSinkProxy = Math.max(0, finite(reactiveCell.molecularLatentHeatSinkProxy));
  const reactiveMolecularLatentHeatReleaseProxy = Math.max(0, finite(reactiveCell.molecularLatentHeatReleaseProxy));
  const reactiveMolecularSourceSinkEnergyResidual = Math.max(0, finite(reactiveCell.molecularSourceSink?.energyResidualProxy));
  const reactiveMolecularSourceSinkSpeciesResidual = Math.max(0, finite(reactiveCell.molecularSourceSink?.speciesResidualProxy));
  const sphMolecularClosureApplied = sph.molecularClosureApplied === true ? 1 : 0;
  const sphMolecularClosureThermalDrive = Math.max(0, finite(sph.molecularClosureThermalDrive));
  const sphMolecularClosureHeatFlux = Math.max(0, finite(sph.molecularClosureRadiativeHeatFluxBoost));
  const sphMolecularReactionHeatSourceProxy = finite(sph.molecularReactionHeatSourceProxy);
  const sphMolecularReactionSpeciesRateProxy = Math.max(0, finite(sph.molecularReactionSpeciesRateProxy));
  const sphMolecularReactionSourceDrive = Math.max(0, finite(sph.molecularReactionSourceDrive));
  const sphMolecularReactionCoolingDrive = Math.max(0, finite(sph.molecularReactionCoolingDrive));
  const sphMolecularPhaseDrive = Math.max(0, finite(sph.molecularPhaseDriveProxy));
  const sphMolecularPhaseHeatingDrive = Math.max(0, finite(sph.molecularPhaseHeatingDrive));
  const sphMolecularPhaseCoolingDrive = Math.max(0, finite(sph.molecularPhaseCoolingDrive));
  const sphMolecularLatentHeatSinkProxy = Math.max(0, finite(sph.molecularLatentHeatSinkProxy));
  const sphMolecularLatentHeatReleaseProxy = Math.max(0, finite(sph.molecularLatentHeatReleaseProxy));
  const sphMolecularSourceSinkEnergyResidual = Math.max(0, finite(sph.molecularSourceSink?.energyResidualProxy));
  const sphMolecularSourceSinkSpeciesResidual = Math.max(0, finite(sph.molecularSourceSink?.speciesResidualProxy));
  const molecularClosureThermalDrive = Math.max(
    reactiveMolecularClosureThermalDrive,
    sphMolecularClosureThermalDrive
  );
  const molecularSourceSinkEnergyResidual = Math.max(
    reactiveMolecularSourceSinkEnergyResidual,
    sphMolecularSourceSinkEnergyResidual
  );
  const molecularSourceSinkSpeciesResidual = Math.max(
    reactiveMolecularSourceSinkSpeciesResidual,
    sphMolecularSourceSinkSpeciesResidual
  );
  const molecularReactionHeatSourceProxy = Math.abs(reactiveMolecularReactionHeatSourceProxy) >= Math.abs(sphMolecularReactionHeatSourceProxy)
    ? reactiveMolecularReactionHeatSourceProxy
    : sphMolecularReactionHeatSourceProxy;
  const molecularReactionSpeciesRateProxy = Math.max(
    reactiveMolecularReactionSpeciesRateProxy,
    sphMolecularReactionSpeciesRateProxy
  );
  const molecularReactionSourceDrive = Math.max(
    reactiveMolecularReactionSourceDrive,
    sphMolecularReactionSourceDrive
  );
  const molecularReactionCoolingDrive = Math.max(
    reactiveMolecularReactionCoolingDrive,
    sphMolecularReactionCoolingDrive
  );
  const molecularPhaseDrive = Math.max(reactiveMolecularPhaseDrive, sphMolecularPhaseDrive);
  const molecularPhaseHeatingDrive = Math.max(reactiveMolecularPhaseHeatingDrive, sphMolecularPhaseHeatingDrive);
  const molecularPhaseCoolingDrive = Math.max(reactiveMolecularPhaseCoolingDrive, sphMolecularPhaseCoolingDrive);
  const molecularLatentHeatSinkProxy = Math.max(reactiveMolecularLatentHeatSinkProxy, sphMolecularLatentHeatSinkProxy);
  const molecularLatentHeatReleaseProxy = Math.max(reactiveMolecularLatentHeatReleaseProxy, sphMolecularLatentHeatReleaseProxy);
  const molecularSourceSinkBalanceCoverage = clamp(finite(
    sourceSinkBalance.coverage?.sourceDriveCoverage,
    sourceSinkBalance.sourceDriveCoverage ?? 1
  ), 0, 1);
  const molecularSourceSinkCoolingCoverage = clamp(finite(
    sourceSinkBalance.coverage?.coolingDriveCoverage,
    sourceSinkBalance.coolingDriveCoverage ?? 1
  ), 0, 1);
  const molecularSourceSinkBalanceResidual = Math.max(0, finite(
    sourceSinkBalance.residuals?.balanceResidualProxy,
    sourceSinkBalance.balanceResidualProxy
  ));
  const molecularSourceSinkBalanceHeatResidual = Math.max(0, finite(
    sourceSinkBalance.residuals?.heatProxyResidual,
    sourceSinkBalance.heatProxyResidual
  ));
  const molecularSourceSinkBalanceSpeciesResidual = Math.max(0, finite(
    sourceSinkBalance.residuals?.speciesRateResidualProxy,
    sourceSinkBalance.speciesRateResidualProxy
  ));
  const molecularSourceSinkBalanceFanoutOversubscription = Math.max(0, finite(
    sourceSinkBalance.residuals?.fanoutOversubscriptionProxy,
    sourceSinkBalance.fanoutOversubscriptionProxy
  ));
  const molecularSourceEquationHeatRateWProxy = finite(
    sourceEquationEnergy.sourceRateWProxy,
    sourceEquation.sourceRateWProxy
  );
  const molecularSourceEquationTemperatureRateKps = finite(
    sourceEquationEnergy.temperatureRateKPerSProxy,
    sourceEquation.temperatureRateKPerSProxy
  );
  const molecularSourceEquationSpeciesRateProxy = Math.max(0, finite(
    sourceEquationSpecies.sourceRateCountPerSProxy,
    sourceEquation.sourceRateCountPerSProxy
  ));
  const molecularSourceEquationResidualWProxy = finite(
    sourceEquationEnergy.openSystemResidualRateWProxy,
    sourceEquation.openSystemResidualRateWProxy
  );
  const molecularSourceEquationPhaseEnergyRateWProxy = finite(
    sourceEquationEnergy.phaseEnergyRateWProxy,
    sourceEquation.phaseEnergyRateWProxy
  );
  const molecularPhaseEosStabilityResidual = Math.max(
    0,
    finite(sourceEquationEnergy.phaseEosStabilityResidualProxy, sourceEquation.phaseEosStabilityResidualProxy),
    finite(molecularDynamics.phaseStabilityResidualProxy),
    finite(reactiveCell.molecularPhaseEosStabilityResidualProxy),
    finite(sph.molecularPhaseEosStabilityResidualProxy)
  );
  const molecularPhaseEosSpecificFreeEnergyProxy = Math.abs(finite(molecularDynamics.specificFreeEnergyProxy)) >= Math.abs(finite(sourceEquationEnergy.phaseEosSpecificFreeEnergyProxy))
    ? finite(molecularDynamics.specificFreeEnergyProxy)
    : finite(sourceEquationEnergy.phaseEosSpecificFreeEnergyProxy);
  const sourceTransferAllocations = Array.isArray(sourceTransfer.allocations) ? sourceTransfer.allocations : [];
  const molecularSourceTransferAllocationCount = Math.max(0, Math.round(finite(
    sourceTransfer.allocationCount,
    sourceTransferAllocations.length
  )));
  const molecularSourceTransferAllocationFractionTotal = sourceTransferAllocations.reduce(
    (sum, allocation) => sum + finite(allocation?.fraction),
    0
  );
  const molecularSourceTransferAllocatedHeatRateWProxy = sourceTransferAllocations.reduce(
    (sum, allocation) => sum + finite(allocation?.heatRateWProxy),
    0
  );
  const molecularSourceTransferAllocatedSpeciesRateProxy = sourceTransferAllocations.reduce(
    (sum, allocation) => sum + finite(allocation?.speciesRateCountPerSProxy),
    0
  );
  const molecularSourceTransferUnallocatedHeatRateWProxy = finite(
    sourceTransfer.residuals?.unallocatedHeatRateWProxy,
    sourceTransfer.unallocatedHeatRateWProxy
  );
  const molecularSourceTransferUnallocatedSpeciesRateProxy = Math.max(0, finite(
    sourceTransfer.residuals?.unallocatedSpeciesRateCountPerSProxy,
    sourceTransfer.unallocatedSpeciesRateCountPerSProxy
  ));
  const molecularSourceTransferClosedResidualWProxy = finite(
    sourceTransfer.residuals?.closedSystemResidualProxy,
    sourceTransfer.closedSystemResidualProxy
  );
  const molecularSourceTransferApplicationCanApply = sourceTransferApplication.canApply === true ? 1 : 0;
  const molecularSourceTransferApplicationReadyTargetCount = Math.max(0, Math.round(finite(sourceTransferApplication.readyTargetCount)));
  const molecularSourceTransferApplicationBlockedTargetCount = Math.max(0, Math.round(finite(sourceTransferApplication.blockedTargetCount)));
  const molecularSourceTransferApplicationAppliedTargetCount = Math.max(0, Math.round(finite(sourceTransferApplication.appliedTargetCount)));
  const molecularSourceTransferApplicationBlockerCount = Math.max(
    0,
    Math.round(finite(
      sourceTransferApplication.blockerCount,
      Array.isArray(sourceTransferApplication.blockers) ? sourceTransferApplication.blockers.length : 0
    ))
  );
  const molecularSourceTransferApplicationClosedResidualWProxy = finite(
    sourceTransferApplication.closedSystemResidualProxy,
    molecularSourceTransferClosedResidualWProxy
  );
  const molecularSourceTransferTargetPreviewCount = Math.max(0, Math.round(finite(
    sourceTransferTargetPreviewSummary.previewTargetCount,
    sourceTransferTargetPreview.previewTargetCount
  )));
  const molecularSourceTransferTargetPreviewBlockedTargetCount = Math.max(0, Math.round(finite(
    sourceTransferTargetPreviewSummary.blockedTargetCount,
    sourceTransferTargetPreview.blockedTargetCount
  )));
  const molecularSourceTransferTargetPreviewAppliedTargetCount = Math.max(0, Math.round(finite(
    sourceTransferTargetPreviewSummary.appliedTargetCount,
    sourceTransferTargetPreview.appliedTargetCount
  )));
  const molecularSourceTransferTargetPreviewBlockerCount = Math.max(0, Math.round(finite(
    sourceTransferTargetPreviewSummary.blockerCount,
    Array.isArray(sourceTransferTargetPreview.blockers) ? sourceTransferTargetPreview.blockers.length : 0
  )));
  const molecularSourceTransferTargetPreviewTotalHeatRateWProxy = finite(
    sourceTransferTargetPreviewSummary.totalHeatRateWProxy,
    sourceTransferTargetPreview.sourceTerms?.totalHeatRateWProxy
  );
  const molecularSourceTransferTargetPreviewTotalSpeciesRateProxy = Math.max(0, finite(
    sourceTransferTargetPreviewSummary.totalSpeciesRateCountPerSProxy,
    sourceTransferTargetPreview.sourceTerms?.totalSpeciesRateCountPerSProxy
  ));
  const molecularSourceTransferTargetPreviewMaxDeltaK = Math.max(0, finite(
    sourceTransferTargetPreviewSummary.maxAbsTemperatureDeltaKProxy,
    sourceTransferTargetPreview.sourceTerms?.maxAbsTemperatureDeltaKProxy
  ));
  const molecularSourceTransferTargetPreviewMaxPhaseDrive = Math.max(0, finite(
    sourceTransferTargetPreviewSummary.maxPhaseDriveDeltaProxy,
    sourceTransferTargetPreview.sourceTerms?.maxPhaseDriveDeltaProxy
  ));
  const molecularTargetMutatorRegistryTargetCount = Math.max(0, Math.round(finite(targetMutatorRegistrySummary.targetCount)));
  const molecularTargetMutatorRegistryRegisteredCount = Math.max(0, Math.round(finite(targetMutatorRegistrySummary.registeredMutatorCount)));
  const molecularTargetMutatorRegistryValidatedCount = Math.max(0, Math.round(finite(targetMutatorRegistrySummary.validatedMutatorCount)));
  const molecularTargetMutatorRegistryBlockedCount = Math.max(0, Math.round(finite(targetMutatorRegistrySummary.blockedMutatorCount)));
  const molecularTargetMutatorRegistryDeclaredFieldCount = Math.max(0, Math.round(finite(targetMutatorRegistrySummary.declaredFieldCount)));
  const molecularTargetMutatorRegistryInvariantScopeCount = Math.max(0, Math.round(finite(targetMutatorRegistrySummary.invariantScopeCount)));
  const molecularTargetMutatorRegistryBlockerCount = Math.max(0, Math.round(finite(targetMutatorRegistrySummary.blockerCount)));
  const molecularTargetMutationPreflightTargetCount = Math.max(0, Math.round(finite(targetMutationPreflightSummary.targetCount)));
  const molecularTargetMutationPreflightPassedCount = Math.max(0, Math.round(finite(targetMutationPreflightSummary.passedTargetCount)));
  const molecularTargetMutationPreflightBlockedCount = Math.max(0, Math.round(finite(targetMutationPreflightSummary.blockedTargetCount)));
  const molecularTargetMutationPreflightResidualBudgetPassCount = Math.max(0, Math.round(finite(targetMutationPreflightSummary.residualBudgetPassCount)));
  const molecularTargetMutationPreflightBlockerCount = Math.max(0, Math.round(finite(targetMutationPreflightSummary.blockerCount)));
  const molecularTargetMutationPreflightResidualTolerance = Math.max(0, finite(targetMutationPreflightSummary.residualToleranceProxy));
  const molecularTargetMutationPreflightMaxResidualRisk = Math.max(0, finite(targetMutationPreflightSummary.maxResidualRiskProxy));
  const molecularTargetMutationPreflightMaxDeltaK = Math.max(0, finite(targetMutationPreflightSummary.maxAbsTemperatureDeltaKProxy));
  const molecularTargetMutationOperationPlanTargetCount = Math.max(0, Math.round(finite(targetMutationOperationPlanSummary.targetCount)));
  const molecularTargetMutationOperationPlanOperationCount = Math.max(0, Math.round(finite(targetMutationOperationPlanSummary.operationCount)));
  const molecularTargetMutationOperationPlanAllowedCount = Math.max(0, Math.round(finite(targetMutationOperationPlanSummary.allowedByRegistryOperationCount)));
  const molecularTargetMutationOperationPlanBlockedCount = Math.max(0, Math.round(finite(targetMutationOperationPlanSummary.blockedOperationCount)));
  const molecularTargetMutationOperationPlanBlockerCount = Math.max(0, Math.round(finite(targetMutationOperationPlanSummary.blockerCount)));
  const molecularTargetMutationOperationPlanMaxDelta = Math.max(0, finite(targetMutationOperationPlanSummary.maxAbsFieldDeltaProxy));
  const molecularTargetMutationOperationPlanMaxDeltaK = Math.max(0, finite(targetMutationOperationPlanSummary.maxAbsTemperatureDeltaKProxy));
  const molecularTargetMutationInvariantCheckTargetCount = Math.max(0, Math.round(finite(targetMutationInvariantCheckSummary.targetCount)));
  const molecularTargetMutationInvariantCheckPassedCount = Math.max(0, Math.round(finite(targetMutationInvariantCheckSummary.passedTargetCount)));
  const molecularTargetMutationInvariantCheckBlockedCount = Math.max(0, Math.round(finite(targetMutationInvariantCheckSummary.blockedTargetCount)));
  const molecularTargetMutationInvariantCheckCoveredScopeCount = Math.max(0, Math.round(finite(targetMutationInvariantCheckSummary.coveredInvariantScopeCount)));
  const molecularTargetMutationInvariantCheckMissingScopeCount = Math.max(0, Math.round(finite(targetMutationInvariantCheckSummary.missingInvariantScopeCount)));
  const molecularTargetMutationInvariantCheckResidualPassCount = Math.max(0, Math.round(finite(targetMutationInvariantCheckSummary.residualBudgetPassCount)));
  const molecularTargetMutationInvariantCheckBlockerCount = Math.max(0, Math.round(finite(targetMutationInvariantCheckSummary.blockerCount)));
  const molecularTargetMutationInvariantCheckMaxResidual = Math.max(0, finite(targetMutationInvariantCheckSummary.maxResidualProxy));
  const molecularTargetMutationCommitTargetCount = Math.max(0, Math.round(finite(targetMutationCommitSummary.targetCount)));
  const molecularTargetMutationCommitEligibleCount = Math.max(0, Math.round(finite(targetMutationCommitSummary.invariantEligibleTargetCount)));
  const molecularTargetMutationCommitCommittableCount = Math.max(0, Math.round(finite(targetMutationCommitSummary.committableTargetCount)));
  const molecularTargetMutationCommitBlockedCount = Math.max(0, Math.round(finite(targetMutationCommitSummary.blockedTargetCount)));
  const molecularTargetMutationCommitOperationCount = Math.max(0, Math.round(finite(targetMutationCommitSummary.plannedOperationCount)));
  const molecularTargetMutationCommitCommittedOperationCount = Math.max(0, Math.round(finite(targetMutationCommitSummary.committedOperationCount)));
  const molecularTargetMutationCommitBlockerCount = Math.max(0, Math.round(finite(targetMutationCommitSummary.blockerCount)));
  const molecularTargetMutationDispatchBatchCount = Math.max(0, Math.round(finite(targetMutationDispatchSummary.batchCount)));
  const molecularTargetMutationDispatchEligibleCount = Math.max(0, Math.round(finite(targetMutationDispatchSummary.invariantEligibleBatchCount)));
  const molecularTargetMutationDispatchDispatchableCount = Math.max(0, Math.round(finite(targetMutationDispatchSummary.dispatchableBatchCount)));
  const molecularTargetMutationDispatchBlockedCount = Math.max(0, Math.round(finite(targetMutationDispatchSummary.blockedBatchCount)));
  const molecularTargetMutationDispatchOperationCount = Math.max(0, Math.round(finite(targetMutationDispatchSummary.operationCount)));
  const molecularTargetMutationDispatchDispatchedOperationCount = Math.max(0, Math.round(finite(targetMutationDispatchSummary.dispatchedOperationCount)));
  const molecularTargetMutationDispatchBlockerCount = Math.max(0, Math.round(finite(targetMutationDispatchSummary.blockerCount)));
  const molecularTargetMutationApplyValidationTargetCount = Math.max(0, Math.round(finite(targetMutationApplyValidationSummary.targetCount)));
  const molecularTargetMutationApplyValidationValidatedCount = Math.max(0, Math.round(finite(targetMutationApplyValidationSummary.validatedTargetCount)));
  const molecularTargetMutationApplyValidationReadyCount = Math.max(0, Math.round(finite(targetMutationApplyValidationSummary.applyReadyTargetCount)));
  const molecularTargetMutationApplyValidationBlockedCount = Math.max(0, Math.round(finite(targetMutationApplyValidationSummary.blockedTargetCount)));
  const molecularTargetMutationApplyValidationOperationCount = Math.max(0, Math.round(finite(targetMutationApplyValidationSummary.operationCount)));
  const molecularTargetMutationApplyValidationAppliedOperationCount = Math.max(0, Math.round(finite(targetMutationApplyValidationSummary.appliedOperationCount)));
  const molecularTargetMutationApplyValidationStateWriteSetCount = Math.max(0, Math.round(finite(targetMutationApplyValidationSummary.stateWriteSetCount)));
  const molecularTargetMutationApplyValidationMaxResidual = Math.max(0, finite(targetMutationApplyValidationSummary.maxBeforeAfterResidualProxy));
  const molecularTargetMutationApplyValidationBlockerCount = Math.max(0, Math.round(finite(targetMutationApplyValidationSummary.blockerCount)));
  const molecularTargetMutationApplyExecutionTargetCount = Math.max(0, Math.round(finite(targetMutationApplyExecutionSummary.targetCount)));
  const molecularTargetMutationApplyExecutionAppliedTargetCount = Math.max(0, Math.round(finite(targetMutationApplyExecutionSummary.appliedTargetCount)));
  const molecularTargetMutationApplyExecutionOperationCount = Math.max(0, Math.round(finite(targetMutationApplyExecutionSummary.operationCount)));
  const molecularTargetMutationApplyExecutionAppliedOperationCount = Math.max(0, Math.round(finite(targetMutationApplyExecutionSummary.appliedOperationCount)));
  const molecularTargetMutationApplyExecutionStateWriteSetCount = Math.max(0, Math.round(finite(targetMutationApplyExecutionSummary.stateWriteSetCount)));
  const molecularTargetMutationApplyExecutionMaxResidual = Math.max(0, finite(targetMutationApplyExecutionSummary.maxBeforeAfterResidualProxy));
  const molecularTargetMutationApplyExecutionBlockerCount = Math.max(0, Math.round(finite(targetMutationApplyExecutionSummary.blockerCount)));
  const molecularTargetSourceIntakeActiveCount = Math.max(0, Math.round(finite(targetSourceIntakeSummary.activeTargetCount)));
  const molecularTargetSourceIntakeAppliedOperationCount = Math.max(0, Math.round(finite(targetSourceIntakeSummary.appliedOperationCount)));
  const molecularTargetSourceIntakeHeatRateWProxy = finite(targetSourceIntakeSummary.totalHeatRateWProxy);
  const molecularTargetSourceIntakeThermalDrive = Math.max(0, finite(targetSourceIntakeSummary.maxThermalDrive));
  const molecularTargetSourceResponseActiveCount = Math.max(0, Math.round(finite(targetSourceResponseSummary.activeTargetCount)));
  const molecularTargetSourceResponseRespondedCount = Math.max(0, Math.round(finite(targetSourceResponseSummary.respondedTargetCount)));
  const molecularTargetSourceResponsePendingCount = Math.max(0, Math.round(finite(targetSourceResponseSummary.pendingTargetCount)));
  const molecularTargetSourceResponseThermalDrive = Math.max(0, finite(targetSourceResponseSummary.totalResponseThermalDrive));
  const molecularTargetSourceResponseHeatFlux = Math.max(0, finite(targetSourceResponseSummary.totalHeatFluxResponseProxy));
  const molecularTargetSourceResponseMaxTemperatureK = Math.max(0, finite(targetSourceResponseSummary.maxTemperatureK));
  const molecularTargetSourceResponseBlockerCount = Math.max(0, Math.round(finite(targetSourceResponseSummary.blockerCount)));
  const molecularTargetSourceReconciliationActiveCount = Math.max(0, Math.round(finite(targetSourceReconciliationSummary.activeTargetCount)));
  const molecularTargetSourceReconciliationReconciledCount = Math.max(0, Math.round(finite(targetSourceReconciliationSummary.reconciledTargetCount)));
  const molecularTargetSourceReconciliationPendingCount = Math.max(0, Math.round(finite(targetSourceReconciliationSummary.pendingTargetCount)));
  const molecularTargetSourceReconciliationSequenceMismatchCount = Math.max(0, Math.round(finite(targetSourceReconciliationSummary.sequenceMismatchCount)));
  const molecularTargetSourceReconciliationResidual = Math.max(0, finite(targetSourceReconciliationSummary.reconciliationResidualProxy));
  const molecularTargetSourceReconciliationUnacknowledgedDrive = Math.max(0, finite(targetSourceReconciliationSummary.unacknowledgedThermalDrive));
  const molecularTargetSourceReconciliationHeatRate = finite(targetSourceReconciliationSummary.totalHeatRateWProxy);
  const molecularTargetSourceReconciliationHeatFlux = Math.max(0, finite(targetSourceReconciliationSummary.totalHeatFluxResponseProxy));
  const molecularTargetSourceReconciliationBlockerCount = Math.max(0, Math.round(finite(targetSourceReconciliationSummary.blockerCount)));
  const molecularConservativeSourceBufferActiveCount = Math.max(0, Math.round(finite(conservativeSourceBufferSummary.activeTargetCount)));
  const molecularConservativeSourceBufferDispatchableCount = Math.max(0, Math.round(finite(conservativeSourceBufferSummary.dispatchableTargetCount)));
  const molecularConservativeSourceBufferReconciledCount = Math.max(0, Math.round(finite(conservativeSourceBufferSummary.reconciledTargetCount)));
  const molecularConservativeSourceBufferPendingCount = Math.max(0, Math.round(finite(conservativeSourceBufferSummary.pendingTargetCount)));
  const molecularConservativeSourceBufferSourceTermCount = Math.max(0, Math.round(finite(conservativeSourceBufferSummary.sourceTermCount)));
  const molecularConservativeSourceBufferHeatRate = finite(conservativeSourceBufferSummary.totalHeatRateWProxy);
  const molecularConservativeSourceBufferSpeciesRate = Math.max(0, finite(conservativeSourceBufferSummary.totalSpeciesRateCountPerSProxy));
  const molecularConservativeSourceBufferResidual = Math.max(0, finite(conservativeSourceBufferSummary.sourceBufferResidualProxy));
  const molecularConservativeSourceBufferUnacknowledgedDrive = Math.max(0, finite(conservativeSourceBufferSummary.unacknowledgedThermalDrive));
  const molecularSourceBufferAcceptanceCanMutateProxy = sourceBufferAcceptanceSummary.canMutateProxy === true ? 1 : 0;
  const molecularSourceBufferAcceptanceAcceptedCount = Math.max(0, Math.round(finite(sourceBufferAcceptanceSummary.acceptedTargetCount)));
  const molecularSourceBufferAcceptanceBlockedCount = Math.max(0, Math.round(finite(sourceBufferAcceptanceSummary.blockedTargetCount)));
  const molecularSourceBufferAcceptanceMissingCount = Math.max(0, Math.round(finite(sourceBufferAcceptanceSummary.missingTargetCount)));
  const molecularSourceBufferAcceptanceResidual = Math.max(0, finite(sourceBufferAcceptanceSummary.maxApplicationResidualProxy));
  const molecularSourceBufferAcceptanceBlockerCount = Math.max(
    0,
    Math.round(finite(
      sourceBufferAcceptanceSummary.blockerCount,
      Array.isArray(sourceBufferAcceptanceSummary.blockers) ? sourceBufferAcceptanceSummary.blockers.length : 0
    ))
  );
  const molecularSourceBufferWritebackCanWritebackProxy = sourceBufferWritebackValidationSummary.canWritebackProxy === true ? 1 : 0;
  const molecularSourceBufferWritebackValidatedCount = Math.max(0, Math.round(finite(sourceBufferWritebackValidationSummary.validatedTargetCount)));
  const molecularSourceBufferWritebackBlockedCount = Math.max(0, Math.round(finite(sourceBufferWritebackValidationSummary.blockedTargetCount)));
  const molecularSourceBufferWritebackResidual = Math.max(0, finite(sourceBufferWritebackValidationSummary.maxWritebackResidualProxy));
  const molecularSourceBufferWritebackBlockerCount = Math.max(
    0,
    Math.round(finite(
      sourceBufferWritebackValidationSummary.blockerCount,
      Array.isArray(sourceBufferWritebackValidationSummary.blockers) ? sourceBufferWritebackValidationSummary.blockers.length : 0
    ))
  );
  const molecularTargetBufferReplayCanReplayProxy = targetBufferReplayValidationSummary.canReplayProxy === true ? 1 : 0;
  const molecularTargetBufferReplayValidatedCount = Math.max(0, Math.round(finite(targetBufferReplayValidationSummary.replayedTargetCount)));
  const molecularTargetBufferReplayBlockedCount = Math.max(0, Math.round(finite(targetBufferReplayValidationSummary.blockedTargetCount)));
  const molecularTargetBufferReplayFieldCount = Math.max(0, Math.round(finite(targetBufferReplayValidationSummary.replayedFieldCount)));
  const molecularTargetBufferReplayMissingFieldCount = Math.max(0, Math.round(finite(targetBufferReplayValidationSummary.missingFieldCount)));
  const molecularTargetBufferReplayResidual = Math.max(0, finite(targetBufferReplayValidationSummary.maxReplayResidualProxy));
  const molecularTargetBufferReplayBlockerCount = Math.max(
    0,
    Math.round(finite(
      targetBufferReplayValidationSummary.blockerCount,
      Array.isArray(targetBufferReplayValidationSummary.blockers) ? targetBufferReplayValidationSummary.blockers.length : 0
    ))
  );
  const molecularTargetBufferMutationAuditCanMutateProxy = targetBufferMutationAuditSummary.canMutateProxy === true ? 1 : 0;
  const molecularTargetBufferMutationAuditCanQueueWorkerWrite = targetBufferMutationAuditSummary.canQueueWorkerWrite === true ? 1 : 0;
  const molecularTargetBufferMutationAuditScientificReady = targetBufferMutationAuditSummary.scientificMutationReady === true ? 1 : 0;
  const molecularTargetBufferMutationAuditReadyCount = Math.max(0, Math.round(finite(targetBufferMutationAuditSummary.readyTargetCount)));
  const molecularTargetBufferMutationAuditBlockedCount = Math.max(0, Math.round(finite(targetBufferMutationAuditSummary.blockedTargetCount)));
  const molecularTargetBufferMutationAuditWriteIntentCount = Math.max(0, Math.round(finite(targetBufferMutationAuditSummary.writeIntentCount)));
  const molecularTargetBufferMutationAuditReadyWriteIntentCount = Math.max(0, Math.round(finite(targetBufferMutationAuditSummary.readyWriteIntentCount)));
  const molecularTargetBufferMutationAuditBlockedWriteIntentCount = Math.max(0, Math.round(finite(targetBufferMutationAuditSummary.blockedWriteIntentCount)));
  const molecularTargetBufferMutationAuditResidual = Math.max(0, finite(targetBufferMutationAuditSummary.maxMutationAuditResidualProxy));
  const molecularTargetBufferMutationAuditBlockerCount = Math.max(
    0,
    Math.round(finite(
      targetBufferMutationAuditSummary.blockerCount,
      Array.isArray(targetBufferMutationAuditSummary.blockers) ? targetBufferMutationAuditSummary.blockers.length : 0
    ))
  );
  const molecularTargetBufferWorkerWriteQueueCanPlan = targetBufferWorkerWriteQueueSummary.canPlanWorkerWrite === true ? 1 : 0;
  const molecularTargetBufferWorkerWriteQueueCanQueueWorkerWrite = targetBufferWorkerWriteQueueSummary.canQueueWorkerWrite === true ? 1 : 0;
  const molecularTargetBufferWorkerWriteQueueScientificReady = targetBufferWorkerWriteQueueSummary.scientificMutationReady === true ? 1 : 0;
  const molecularTargetBufferWorkerWriteQueueBatchCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteQueueSummary.targetBatchCount)));
  const molecularTargetBufferWorkerWriteQueueReadyBatchCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteQueueSummary.queueReadyBatchCount)));
  const molecularTargetBufferWorkerWriteQueueBlockedBatchCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteQueueSummary.queueBlockedBatchCount)));
  const molecularTargetBufferWorkerWriteQueueWriteIntentCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteQueueSummary.writeIntentCount)));
  const molecularTargetBufferWorkerWriteQueueReadyWriteIntentCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteQueueSummary.queueReadyWriteIntentCount)));
  const molecularTargetBufferWorkerWriteQueueBlockedWriteIntentCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteQueueSummary.blockedWriteIntentCount)));
  const molecularTargetBufferWorkerWriteQueueQueuedWriteIntentCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteQueueSummary.queuedWriteIntentCount)));
  const molecularTargetBufferWorkerWriteQueueResidual = Math.max(0, finite(targetBufferWorkerWriteQueueSummary.maxQueueResidualProxy));
  const molecularTargetBufferWorkerWriteQueueBlockerCount = Math.max(
    0,
    Math.round(finite(
      targetBufferWorkerWriteQueueSummary.blockerCount,
      Array.isArray(targetBufferWorkerWriteQueueSummary.blockers) ? targetBufferWorkerWriteQueueSummary.blockers.length : 0
    ))
  );
  const molecularTargetBufferWorkerWriteExecutionCanExecute = targetBufferWorkerWriteExecutionSummary.canExecuteProxy === true ? 1 : 0;
  const molecularTargetBufferWorkerWriteExecutionApplied = targetBufferWorkerWriteExecutionSummary.applied === true ? 1 : 0;
  const molecularTargetBufferWorkerWriteExecutionScientificReady = targetBufferWorkerWriteExecutionSummary.scientificMutationReady === true ? 1 : 0;
  const molecularTargetBufferWorkerWriteExecutionBatchCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteExecutionSummary.targetBatchCount)));
  const molecularTargetBufferWorkerWriteExecutionAppliedBatchCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteExecutionSummary.appliedBatchCount)));
  const molecularTargetBufferWorkerWriteExecutionBlockedBatchCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteExecutionSummary.blockedBatchCount)));
  const molecularTargetBufferWorkerWriteExecutionWriteIntentCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteExecutionSummary.writeIntentCount)));
  const molecularTargetBufferWorkerWriteExecutionQueuedWriteIntentCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteExecutionSummary.queuedWriteIntentCount)));
  const molecularTargetBufferWorkerWriteExecutionDispatchedWriteIntentCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteExecutionSummary.dispatchedWriteIntentCount)));
  const molecularTargetBufferWorkerWriteExecutionAppliedWriteIntentCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteExecutionSummary.appliedWriteIntentCount)));
  const molecularTargetBufferWorkerWriteExecutionSkippedWriteIntentCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteExecutionSummary.skippedWriteIntentCount)));
  const molecularTargetBufferWorkerWriteExecutionResidual = Math.max(0, finite(targetBufferWorkerWriteExecutionSummary.maxWorkerWriteResidualProxy));
  const molecularTargetBufferWorkerWriteExecutionBlockerCount = Math.max(
    0,
    Math.round(finite(
      targetBufferWorkerWriteExecutionSummary.blockerCount,
      Array.isArray(targetBufferWorkerWriteExecutionSummary.blockers) ? targetBufferWorkerWriteExecutionSummary.blockers.length : 0
    ))
  );
  const molecularTargetBufferWorkerWriteVerificationCanVerify = targetBufferWorkerWriteVerificationSummary.canVerifyProxy === true ? 1 : 0;
  const molecularTargetBufferWorkerWriteVerificationVerified = targetBufferWorkerWriteVerificationSummary.verified === true ? 1 : 0;
  const molecularTargetBufferWorkerWriteVerificationScientificReady = targetBufferWorkerWriteVerificationSummary.scientificMutationReady === true ? 1 : 0;
  const molecularTargetBufferWorkerWriteVerificationTargetCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteVerificationSummary.targetBatchCount)));
  const molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteVerificationSummary.verifiedTargetCount)));
  const molecularTargetBufferWorkerWriteVerificationBlockedTargetCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteVerificationSummary.blockedTargetCount)));
  const molecularTargetBufferWorkerWriteVerificationFieldWriteCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteVerificationSummary.fieldWriteCount)));
  const molecularTargetBufferWorkerWriteVerificationVerifiedFieldWriteCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteVerificationSummary.verifiedFieldWriteCount)));
  const molecularTargetBufferWorkerWriteVerificationSkippedFieldWriteCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteVerificationSummary.skippedFieldWriteCount)));
  const molecularTargetBufferWorkerWriteVerificationMissingFieldWriteCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteVerificationSummary.missingFieldWriteCount)));
  const molecularTargetBufferWorkerWriteVerificationMismatchedFieldWriteCount = Math.max(0, Math.round(finite(targetBufferWorkerWriteVerificationSummary.mismatchedFieldWriteCount)));
  const molecularTargetBufferWorkerWriteVerificationResidual = Math.max(0, finite(targetBufferWorkerWriteVerificationSummary.maxVerificationResidualProxy));
  const molecularTargetBufferWorkerWriteVerificationBlockerCount = Math.max(
    0,
    Math.round(finite(
      targetBufferWorkerWriteVerificationSummary.blockerCount,
      Array.isArray(targetBufferWorkerWriteVerificationSummary.blockers) ? targetBufferWorkerWriteVerificationSummary.blockers.length : 0
    ))
  );
  const molecularScientificInvariantGateCanPromoteProxy = scientificInvariantGateSummary.canPromoteProxy === true ? 1 : 0;
  const molecularScientificInvariantGateScientificReady = scientificInvariantGateSummary.scientificMutationReady === true ? 1 : 0;
  const molecularScientificInvariantGateProxySatisfiedScopeCount = Math.max(0, Math.round(finite(scientificInvariantGateSummary.proxySatisfiedScopeCount)));
  const molecularScientificInvariantGateAuthoritativeSatisfiedScopeCount = Math.max(0, Math.round(finite(scientificInvariantGateSummary.authoritativeSatisfiedScopeCount)));
  const molecularScientificInvariantGateBlockedScopeCount = Math.max(0, Math.round(finite(scientificInvariantGateSummary.blockedScopeCount)));
  const molecularScientificInvariantGateBlockerCount = Math.max(
    0,
    Math.round(finite(
      scientificInvariantGateSummary.blockerCount,
      Array.isArray(scientificInvariantGateSummary.blockers) ? scientificInvariantGateSummary.blockers.length : 0
    ))
  );
  const membraneDamage = Math.max(0, finite(membraneShell.damageMean));
  const membraneRuptureRisk = Math.max(0, finite(membraneShell.ruptureRisk));

  const reducedEnergyInput = Math.max(0, finite(surface.radiativeHeatFlux)) * 0.01
    + Math.max(0, finite(plume.heatReleaseMean)) * 0.00025
    + Math.max(0, finite(reactiveCell.heatReleaseNorm)) * 0.2
    + reactiveMolecularClosureHeatFlux * 0.00018
    + sphMolecularClosureHeatFlux * 0.00014
    + Math.max(0, finite(membraneShell.heatFluxMean)) * 0.00004;
  const reducedEnergySink = Math.max(0, finite(surface.waterContact)) * 0.24
    + Math.max(0, finite(sph.coolingPotential)) * 0.3
    + Math.max(0, finite(plume.suppressionMean)) * 0.16
    + membraneDamage * 0.06;
  const reducedEnergyResidual = clamp(
    Math.abs(reducedEnergyInput - reducedEnergySink) * 0.06
      + radiationEnergyDrift * 0.02
      + nbodyRelativeEnergyDrift * 0.5
      + clamp(stellarFusionEnergyDrift * 1e-14, 0, 0.2)
      + clamp(magnetosphereEnergyDelta * 0.00008, 0, 0.2)
      + clamp(picEnergyDelta * 0.0003, 0, 0.16)
      + clamp(picDivergenceE * 0.12, 0, 0.08)
      + clamp(relativisticEnergyDelta * 0.25 + relativisticTimeDilationDrift * 0.4, 0, 0.14)
      + clamp(cosmologyExpansionEnergyDelta * 0.18 + cosmologyExpansionWork * 0.015, 0, 0.12)
      + clamp(molecularEnergyDelta * 0.025 + molecularHeatReleaseDelta * 0.04, 0, 0.1)
      + clamp((reactiveMolecularClosureHeatFlux + sphMolecularClosureHeatFlux) * 0.00002 + molecularClosureThermalDrive * 0.015, 0, 0.05)
      + clamp(Math.abs(molecularReactionHeatSourceProxy) * 0.03 + molecularReactionSourceDrive * 0.012 + molecularReactionCoolingDrive * 0.006, 0, 0.04)
      + clamp(molecularPhaseDrive * 0.012 + molecularPhaseHeatingDrive * 0.006 + molecularPhaseCoolingDrive * 0.006 + molecularLatentHeatSinkProxy * 0.004 + molecularLatentHeatReleaseProxy * 0.004, 0, 0.04)
      + clamp(molecularSourceSinkEnergyResidual * 0.35, 0, 0.05)
      + clamp(molecularSourceSinkBalanceResidual * 0.18 + molecularSourceSinkBalanceHeatResidual * 0.04 + molecularSourceSinkBalanceFanoutOversubscription * 0.08, 0, 0.06)
      + clamp(Math.abs(molecularSourceEquationHeatRateWProxy) * 0.8 + Math.abs(molecularSourceEquationResidualWProxy) * 1.2, 0, 0.03)
      + clamp(Math.abs(molecularSourceEquationPhaseEnergyRateWProxy) * 0.4 + molecularPhaseEosStabilityResidual * 0.012, 0, 0.03)
      + clamp(Math.abs(molecularSourceTransferClosedResidualWProxy) * 0.8 + Math.abs(molecularSourceTransferUnallocatedHeatRateWProxy) * 0.8, 0, 0.03)
      + clamp(molecularTargetSourceResponseThermalDrive * 0.004 + molecularTargetSourceResponseHeatFlux * 0.000005, 0, 0.03)
      + clamp(molecularTargetSourceReconciliationResidual * 0.015 + molecularTargetSourceReconciliationUnacknowledgedDrive * 0.006, 0, 0.02)
      + clamp(molecularConservativeSourceBufferResidual * 0.018 + molecularConservativeSourceBufferUnacknowledgedDrive * 0.004, 0, 0.02)
      + clamp(molecularSourceBufferAcceptanceResidual * 0.012 + molecularSourceBufferAcceptanceBlockedCount * 0.003 + molecularSourceBufferAcceptanceMissingCount * 0.006, 0, 0.02)
      + clamp(molecularSourceBufferWritebackResidual * 0.01 + molecularSourceBufferWritebackBlockedCount * 0.003, 0, 0.02)
      + clamp(molecularTargetBufferReplayResidual * 0.01 + molecularTargetBufferReplayBlockedCount * 0.003 + molecularTargetBufferReplayMissingFieldCount * 0.001, 0, 0.02)
      + clamp(molecularTargetBufferMutationAuditResidual * 0.008 + molecularTargetBufferMutationAuditBlockedCount * 0.002 + molecularTargetBufferMutationAuditBlockedWriteIntentCount * 0.0005, 0, 0.02)
      + clamp(molecularTargetBufferWorkerWriteQueueResidual * 0.006 + molecularTargetBufferWorkerWriteQueueBlockedBatchCount * 0.001 + molecularTargetBufferWorkerWriteQueueBlockedWriteIntentCount * 0.0004, 0, 0.02)
      + clamp(molecularTargetBufferWorkerWriteExecutionResidual * 0.006 + molecularTargetBufferWorkerWriteExecutionBlockedBatchCount * 0.001 + molecularTargetBufferWorkerWriteExecutionSkippedWriteIntentCount * 0.00035, 0, 0.02)
      + clamp(molecularTargetBufferWorkerWriteVerificationResidual * 0.006 + molecularTargetBufferWorkerWriteVerificationBlockedTargetCount * 0.001 + molecularTargetBufferWorkerWriteVerificationMissingFieldWriteCount * 0.00035 + molecularTargetBufferWorkerWriteVerificationMismatchedFieldWriteCount * 0.0005, 0, 0.02)
      + clamp(molecularScientificInvariantGateBlockedScopeCount * 0.001 + molecularScientificInvariantGateBlockerCount * 0.00025, 0, 0.02)
      + clamp(materialKineticDrift * 0.00002, 0, 0.2),
    0,
    1
  );
  const speciesResidual = clamp(
    speciesDelta * 0.5
      + Math.max(0, 1 - finite(plume.fuelRemaining, 1)) * 0.03
      + Math.max(0, finite(plume.oxygenDepletion)) * 0.04
      + stellarFusionSpeciesDrift * 0.5
      + clamp(cosmologyDensityDrift * 0.08 + cosmologyStructureGrowthDelta * 0.04, 0, 0.08)
      + clamp(picChargeDrift * 0.02 + picChargeImbalance * 0.12, 0, 0.12)
      + clamp(molecularChargeDrift * 0.04 + molecularIonization * 0.08, 0, 0.1)
      + clamp(molecularReactionSpeciesRateProxy * 0.0005, 0, 0.04)
      + clamp(molecularSourceSinkSpeciesResidual * 0.35, 0, 0.04)
      + clamp(molecularSourceSinkBalanceSpeciesResidual * 0.002 + molecularSourceSinkBalanceResidual * 0.08, 0, 0.05)
      + clamp(molecularSourceEquationSpeciesRateProxy * 0.0005, 0, 0.02)
      + clamp(molecularSourceTransferUnallocatedSpeciesRateProxy * 0.0005, 0, 0.02),
    0,
    1
  );
  const massResidual = clamp(
    waterMassRelativeError
      + materialMassDrift * 0.02
      + hydrodynamicDrift * 0.01
      + magnetosphereMassDrift * 0.02
      + clamp(
        Math.abs(finite(computeResizeConservation?.maxAbsMassProxyDeltaAfter))
          / Math.max(1, Math.abs(finite(computeResizeConservation?.maxAbsMassProxyDeltaBefore))),
        0,
        0.1
      ),
    0,
    1
  );
  const worstResidual = Math.max(reducedEnergyResidual, speciesResidual, massResidual);
  const status = worstResidual < 0.05 ? 'interactive-pass' : worstResidual < 0.25 ? 'interactive-watch' : 'interactive-divergent';
  const trackedCouplings = [
    'stellar-fusion -> luminosity/radiationPressure -> radiation-opacity',
    'stellar-fusion/maxwell -> magnetosphere-plasma -> radiationPressure/debrisFlux',
    'magnetosphere-plasma -> pic-plasma-patch -> kinetic charge/current feedback',
    'nbody/stellar/maxwell/pic -> relativistic-correction -> redshift/lensing/time-dilation telemetry',
    'relativistic/maxwell/galaxy -> cosmology-expansion -> filament/void/growth telemetry',
    'cosmology-expansion -> galactic turbulence/starFormation -> downstream solver forcing',
    'combustion/radiation/surface -> molecular-dynamics -> reaction/heat/bond telemetry',
    'molecular-dynamics closure -> reactive/SPH thermal source -> material heat telemetry',
    'molecular source/sink balance -> event-derived chemistry coverage/residual telemetry',
    'molecular source equation -> unit-aware heat/species transfer scaffold',
    'molecular phase EOS basis -> reduced free-energy/enthalpy/latent source telemetry',
    'molecular conservative transfer dry-run -> reactive/SPH allocation telemetry',
    'molecular transfer application gate -> blocked/ready/applied mutation guard telemetry',
    'molecular target-mutator preview -> reactive/SPH dry-run target delta telemetry',
    'molecular target-mutator registry -> allowed-field/invariant mutation gate telemetry',
    'molecular target-mutation preflight -> residual/blocker readiness telemetry',
    'molecular target-mutation operation plan -> field-level before/after delta telemetry',
    'molecular target-mutation invariant check -> operation-plan invariant coverage and residual telemetry',
    'molecular target-mutation dispatch -> commit-gated target operation batch telemetry',
    'molecular target-mutation apply validation -> before/after write-set residual telemetry',
    'molecular target-mutation apply execution -> explicit reduced target state write telemetry',
    'molecular target-source response -> reactive/SPH intake acknowledgement telemetry',
    'molecular target-source reconciliation -> reactive/SPH response audit telemetry',
    'molecular conservative source buffer -> reactive/SPH unit-aware source-vector telemetry',
    'molecular source-buffer application -> reactive/SPH before-after consumer ledger telemetry',
    'molecular source-buffer acceptance -> reduced worker-consumption invariant gate telemetry',
    'molecular source-buffer writeback validation -> reduced target delta confirmation telemetry',
    'radiation-opacity -> surfaceRadiativeHeatFlux -> reactive/combustion/SPH',
    'membrane-shell pressure/heat damage -> balloon rupture -> SPH water release',
    'SPH coolingPotential -> surface waterContact -> combustion/reactive suppression',
    'combustion plume heat/smoke -> surface/molecular/weather proxy state',
    'reactive thermal speciesInventoryDelta -> conservation warning surface'
  ];
  if (computeResizeConservation) {
    trackedCouplings.push('compute-capacity resize -> record-scale mass proxy -> particle resize correction audit');
  }
  const warnings = [
    'Interactive proxy audit only; source terms are not yet closed enthalpy/species balances.',
    'Use residuals as regression/telemetry signals, not scientific conservation tolerances.'
  ];
  if (computeResizeConservation) {
    warnings.push('Compute resize conservation uses record-scale proxy telemetry and does not yet enforce material mass, species, charge, or field invariants.');
  }
  const residualMetadata = {
    massRelativeError: describeMultiscaleField({
      solverId: 'conservation-audit',
      field: 'massRelativeError',
      layer: 'runtime',
      role: 'residual'
    }),
    energyResidualProxy: describeMultiscaleField({
      solverId: 'conservation-audit',
      field: 'energyResidualProxy',
      layer: 'runtime',
      role: 'residual'
    }),
    speciesResidualProxy: describeMultiscaleField({
      solverId: 'conservation-audit',
      field: 'speciesResidualProxy',
      layer: 'runtime',
      role: 'residual'
    })
  };
  const exchangeMetadata = {
    surfaceRadiativeHeatFlux: describeMultiscaleField({
      solverId: 'radiation-opacity',
      field: 'surfaceRadiativeHeatFlux',
      layer: 'surface',
      role: 'exchange.surfaceRadiativeHeatFlux'
    }),
    combustionBuoyancyFlux: describeMultiscaleField({
      solverId: 'combustion-plume',
      field: 'buoyancyFlux',
      layer: 'surface',
      role: 'exchange.combustionBuoyancyFlux'
    }),
    sphCoolingPotential: describeMultiscaleField({
      solverId: 'sph-material',
      field: 'coolingPotential',
      layer: 'mpm',
      role: 'exchange.sphCoolingPotential'
    }),
    sphSpillImpulse: describeMultiscaleField({
      solverId: 'sph-material',
      field: 'spillImpulse',
      layer: 'mpm',
      role: 'exchange.sphSpillImpulse'
    }),
    membraneRuptureRisk: describeMultiscaleField({
      solverId: 'membrane-shell',
      field: 'ruptureRisk',
      layer: 'surface',
      role: 'exchange.membraneRuptureRisk'
    }),
    molecularHeatReleaseProxy: describeMultiscaleField({
      solverId: 'molecular-dynamics',
      field: 'heatReleaseProxy',
      layer: 'molecular',
      role: 'exchange.molecularHeatReleaseProxy'
    }),
    molecularClosureReactiveHeatFluxProxy: describeMultiscaleField({
      solverId: 'reactive-thermal-cell',
      field: 'molecularClosureHeatFluxProxy',
      layer: 'surface',
      role: 'exchange.molecularClosureReactiveHeatFluxProxy'
    }),
    molecularClosureSphHeatFluxProxy: describeMultiscaleField({
      solverId: 'sph-material',
      field: 'molecularClosureRadiativeHeatFluxBoost',
      layer: 'mpm',
      role: 'exchange.molecularClosureSphHeatFluxProxy'
    }),
    molecularSourceSinkEnergyResidual: describeMultiscaleField({
      solverId: 'molecular-source-sink',
      field: 'energyResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceSinkEnergyResidual'
    }),
    molecularSourceSinkSpeciesResidual: describeMultiscaleField({
      solverId: 'molecular-source-sink',
      field: 'speciesResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceSinkSpeciesResidual'
    }),
    molecularReactionHeatSourceProxy: describeMultiscaleField({
      solverId: 'molecular-source-sink',
      field: 'reactionHeatSourceProxy',
      layer: 'molecular',
      role: 'exchange.molecularReactionHeatSourceProxy'
    }),
    molecularReactionSpeciesRateProxy: describeMultiscaleField({
      solverId: 'molecular-source-sink',
      field: 'reactionSpeciesRateProxy',
      layer: 'molecular',
      role: 'exchange.molecularReactionSpeciesRateProxy'
    }),
    molecularReactionSourceDrive: describeMultiscaleField({
      solverId: 'molecular-source-sink',
      field: 'reactionSourceDrive',
      layer: 'molecular',
      role: 'exchange.molecularReactionSourceDrive'
    }),
    molecularReactionCoolingDrive: describeMultiscaleField({
      solverId: 'molecular-source-sink',
      field: 'reactionCoolingDrive',
      layer: 'molecular',
      role: 'exchange.molecularReactionCoolingDrive'
    }),
    molecularPhaseDrive: describeMultiscaleField({
      solverId: 'molecular-source-sink',
      field: 'phaseDriveProxy',
      layer: 'molecular',
      role: 'exchange.molecularPhaseDrive'
    }),
    molecularLatentHeatSinkProxy: describeMultiscaleField({
      solverId: 'molecular-source-sink',
      field: 'latentHeatSinkProxy',
      layer: 'molecular',
      role: 'exchange.molecularLatentHeatSinkProxy'
    }),
    molecularLatentHeatReleaseProxy: describeMultiscaleField({
      solverId: 'molecular-source-sink',
      field: 'latentHeatReleaseProxy',
      layer: 'molecular',
      role: 'exchange.molecularLatentHeatReleaseProxy'
    }),
    molecularSourceSinkBalanceCoverage: describeMultiscaleField({
      solverId: 'molecular-source-sink-balance',
      field: 'sourceDriveCoverage',
      layer: 'molecular',
      role: 'exchange.molecularSourceSinkBalanceCoverage'
    }),
    molecularSourceSinkBalanceResidual: describeMultiscaleField({
      solverId: 'molecular-source-sink-balance',
      field: 'balanceResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceSinkBalanceResidual'
    }),
    molecularSourceSinkBalanceHeatResidual: describeMultiscaleField({
      solverId: 'molecular-source-sink-balance',
      field: 'heatProxyResidual',
      layer: 'molecular',
      role: 'exchange.molecularSourceSinkBalanceHeatResidual'
    }),
    molecularSourceSinkBalanceSpeciesResidual: describeMultiscaleField({
      solverId: 'molecular-source-sink-balance',
      field: 'speciesRateResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceSinkBalanceSpeciesResidual'
    }),
    molecularSourceEquationHeatRateWProxy: describeMultiscaleField({
      solverId: 'molecular-source-equation',
      field: 'sourceRateWProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceEquationHeatRateWProxy'
    }),
    molecularSourceEquationTemperatureRateKps: describeMultiscaleField({
      solverId: 'molecular-source-equation',
      field: 'temperatureRateKPerSProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceEquationTemperatureRateKps'
    }),
    molecularSourceEquationSpeciesRateProxy: describeMultiscaleField({
      solverId: 'molecular-source-equation',
      field: 'sourceRateCountPerSProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceEquationSpeciesRateProxy'
    }),
    molecularSourceEquationResidualWProxy: describeMultiscaleField({
      solverId: 'molecular-source-equation',
      field: 'openSystemResidualRateWProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceEquationResidualWProxy'
    }),
    molecularSourceEquationPhaseEnergyRateWProxy: describeMultiscaleField({
      solverId: 'molecular-source-equation',
      field: 'phaseEnergyRateWProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceEquationPhaseEnergyRateWProxy'
    }),
    molecularPhaseEosStabilityResidual: describeMultiscaleField({
      solverId: 'molecular-phase-eos-basis',
      field: 'phaseStabilityResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularPhaseEosStabilityResidual'
    }),
    molecularPhaseEosSpecificFreeEnergyProxy: describeMultiscaleField({
      solverId: 'molecular-phase-eos-basis',
      field: 'specificFreeEnergyProxy',
      layer: 'molecular',
      role: 'exchange.molecularPhaseEosSpecificFreeEnergyProxy'
    }),
    molecularSourceTransferAllocationCount: describeMultiscaleField({
      solverId: 'molecular-conservative-transfer',
      field: 'allocationCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferAllocationCount'
    }),
    molecularSourceTransferAllocationFractionTotal: describeMultiscaleField({
      solverId: 'molecular-conservative-transfer',
      field: 'allocationFractionTotal',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferAllocationFractionTotal'
    }),
    molecularSourceTransferAllocatedHeatRateWProxy: describeMultiscaleField({
      solverId: 'molecular-conservative-transfer',
      field: 'allocatedHeatRateWProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferAllocatedHeatRateWProxy'
    }),
    molecularSourceTransferAllocatedSpeciesRateProxy: describeMultiscaleField({
      solverId: 'molecular-conservative-transfer',
      field: 'allocatedSpeciesRateCountPerSProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferAllocatedSpeciesRateProxy'
    }),
    molecularSourceTransferUnallocatedHeatRateWProxy: describeMultiscaleField({
      solverId: 'molecular-conservative-transfer',
      field: 'unallocatedHeatRateWProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferUnallocatedHeatRateWProxy'
    }),
    molecularSourceTransferUnallocatedSpeciesRateProxy: describeMultiscaleField({
      solverId: 'molecular-conservative-transfer',
      field: 'unallocatedSpeciesRateCountPerSProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferUnallocatedSpeciesRateProxy'
    }),
    molecularSourceTransferClosedResidualWProxy: describeMultiscaleField({
      solverId: 'molecular-conservative-transfer',
      field: 'closedSystemResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferClosedResidualWProxy'
    }),
    molecularSourceTransferApplicationCanApply: describeMultiscaleField({
      solverId: 'molecular-transfer-application',
      field: 'canApply',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferApplicationCanApply'
    }),
    molecularSourceTransferApplicationReadyTargetCount: describeMultiscaleField({
      solverId: 'molecular-transfer-application',
      field: 'readyTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferApplicationReadyTargetCount'
    }),
    molecularSourceTransferApplicationBlockedTargetCount: describeMultiscaleField({
      solverId: 'molecular-transfer-application',
      field: 'blockedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferApplicationBlockedTargetCount'
    }),
    molecularSourceTransferApplicationAppliedTargetCount: describeMultiscaleField({
      solverId: 'molecular-transfer-application',
      field: 'appliedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferApplicationAppliedTargetCount'
    }),
    molecularSourceTransferApplicationBlockerCount: describeMultiscaleField({
      solverId: 'molecular-transfer-application',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferApplicationBlockerCount'
    }),
    molecularSourceTransferApplicationClosedResidualWProxy: describeMultiscaleField({
      solverId: 'molecular-transfer-application',
      field: 'closedSystemResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferApplicationClosedResidualWProxy'
    }),
    molecularSourceTransferTargetPreviewCount: describeMultiscaleField({
      solverId: 'molecular-target-mutator-preview',
      field: 'previewTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferTargetPreviewCount'
    }),
    molecularSourceTransferTargetPreviewBlockedTargetCount: describeMultiscaleField({
      solverId: 'molecular-target-mutator-preview',
      field: 'blockedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferTargetPreviewBlockedTargetCount'
    }),
    molecularSourceTransferTargetPreviewAppliedTargetCount: describeMultiscaleField({
      solverId: 'molecular-target-mutator-preview',
      field: 'appliedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferTargetPreviewAppliedTargetCount'
    }),
    molecularSourceTransferTargetPreviewBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-mutator-preview',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferTargetPreviewBlockerCount'
    }),
    molecularSourceTransferTargetPreviewTotalHeatRateWProxy: describeMultiscaleField({
      solverId: 'molecular-target-mutator-preview',
      field: 'totalHeatRateWProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferTargetPreviewTotalHeatRateWProxy'
    }),
    molecularSourceTransferTargetPreviewTotalSpeciesRateProxy: describeMultiscaleField({
      solverId: 'molecular-target-mutator-preview',
      field: 'totalSpeciesRateCountPerSProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferTargetPreviewTotalSpeciesRateProxy'
    }),
    molecularSourceTransferTargetPreviewMaxDeltaK: describeMultiscaleField({
      solverId: 'molecular-target-mutator-preview',
      field: 'maxAbsTemperatureDeltaKProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferTargetPreviewMaxDeltaK'
    }),
    molecularSourceTransferTargetPreviewMaxPhaseDrive: describeMultiscaleField({
      solverId: 'molecular-target-mutator-preview',
      field: 'maxPhaseDriveDeltaProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceTransferTargetPreviewMaxPhaseDrive'
    }),
    molecularTargetMutatorRegistryTargetCount: describeMultiscaleField({
      solverId: 'molecular-target-mutator-registry',
      field: 'targetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutatorRegistryTargetCount'
    }),
    molecularTargetMutatorRegistryRegisteredCount: describeMultiscaleField({
      solverId: 'molecular-target-mutator-registry',
      field: 'registeredMutatorCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutatorRegistryRegisteredCount'
    }),
    molecularTargetMutatorRegistryValidatedCount: describeMultiscaleField({
      solverId: 'molecular-target-mutator-registry',
      field: 'validatedMutatorCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutatorRegistryValidatedCount'
    }),
    molecularTargetMutatorRegistryBlockedCount: describeMultiscaleField({
      solverId: 'molecular-target-mutator-registry',
      field: 'blockedMutatorCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutatorRegistryBlockedCount'
    }),
    molecularTargetMutatorRegistryDeclaredFieldCount: describeMultiscaleField({
      solverId: 'molecular-target-mutator-registry',
      field: 'declaredFieldCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutatorRegistryDeclaredFieldCount'
    }),
    molecularTargetMutatorRegistryInvariantScopeCount: describeMultiscaleField({
      solverId: 'molecular-target-mutator-registry',
      field: 'invariantScopeCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutatorRegistryInvariantScopeCount'
    }),
    molecularTargetMutatorRegistryBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-mutator-registry',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutatorRegistryBlockerCount'
    }),
    molecularTargetMutationPreflightTargetCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-preflight',
      field: 'targetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationPreflightTargetCount'
    }),
    molecularTargetMutationPreflightPassedCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-preflight',
      field: 'passedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationPreflightPassedCount'
    }),
    molecularTargetMutationPreflightBlockedCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-preflight',
      field: 'blockedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationPreflightBlockedCount'
    }),
    molecularTargetMutationPreflightResidualBudgetPassCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-preflight',
      field: 'residualBudgetPassCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationPreflightResidualBudgetPassCount'
    }),
    molecularTargetMutationPreflightBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-preflight',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationPreflightBlockerCount'
    }),
    molecularTargetMutationPreflightResidualTolerance: describeMultiscaleField({
      solverId: 'molecular-target-mutation-preflight',
      field: 'residualToleranceProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationPreflightResidualTolerance'
    }),
    molecularTargetMutationPreflightMaxResidualRisk: describeMultiscaleField({
      solverId: 'molecular-target-mutation-preflight',
      field: 'maxResidualRiskProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationPreflightMaxResidualRisk'
    }),
    molecularTargetMutationPreflightMaxDeltaK: describeMultiscaleField({
      solverId: 'molecular-target-mutation-preflight',
      field: 'maxAbsTemperatureDeltaKProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationPreflightMaxDeltaK'
    }),
    molecularTargetMutationOperationPlanTargetCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-operation-plan',
      field: 'targetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationOperationPlanTargetCount'
    }),
    molecularTargetMutationOperationPlanOperationCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-operation-plan',
      field: 'operationCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationOperationPlanOperationCount'
    }),
    molecularTargetMutationOperationPlanAllowedCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-operation-plan',
      field: 'allowedByRegistryOperationCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationOperationPlanAllowedCount'
    }),
    molecularTargetMutationOperationPlanBlockedCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-operation-plan',
      field: 'blockedOperationCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationOperationPlanBlockedCount'
    }),
    molecularTargetMutationOperationPlanBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-operation-plan',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationOperationPlanBlockerCount'
    }),
    molecularTargetMutationOperationPlanMaxDelta: describeMultiscaleField({
      solverId: 'molecular-target-mutation-operation-plan',
      field: 'maxAbsFieldDeltaProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationOperationPlanMaxDelta'
    }),
    molecularTargetMutationOperationPlanMaxDeltaK: describeMultiscaleField({
      solverId: 'molecular-target-mutation-operation-plan',
      field: 'maxAbsTemperatureDeltaKProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationOperationPlanMaxDeltaK'
    }),
    molecularTargetMutationInvariantCheckTargetCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-invariant-check',
      field: 'targetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationInvariantCheckTargetCount'
    }),
    molecularTargetMutationInvariantCheckPassedCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-invariant-check',
      field: 'passedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationInvariantCheckPassedCount'
    }),
    molecularTargetMutationInvariantCheckBlockedCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-invariant-check',
      field: 'blockedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationInvariantCheckBlockedCount'
    }),
    molecularTargetMutationInvariantCheckCoveredScopeCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-invariant-check',
      field: 'coveredInvariantScopeCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationInvariantCheckCoveredScopeCount'
    }),
    molecularTargetMutationInvariantCheckMissingScopeCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-invariant-check',
      field: 'missingInvariantScopeCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationInvariantCheckMissingScopeCount'
    }),
    molecularTargetMutationInvariantCheckResidualPassCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-invariant-check',
      field: 'residualBudgetPassCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationInvariantCheckResidualPassCount'
    }),
    molecularTargetMutationInvariantCheckBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-invariant-check',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationInvariantCheckBlockerCount'
    }),
    molecularTargetMutationInvariantCheckMaxResidual: describeMultiscaleField({
      solverId: 'molecular-target-mutation-invariant-check',
      field: 'maxResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationInvariantCheckMaxResidual'
    }),
    molecularTargetMutationCommitTargetCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-commit',
      field: 'targetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationCommitTargetCount'
    }),
    molecularTargetMutationCommitEligibleCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-commit',
      field: 'invariantEligibleTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationCommitEligibleCount'
    }),
    molecularTargetMutationCommitCommittableCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-commit',
      field: 'committableTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationCommitCommittableCount'
    }),
    molecularTargetMutationCommitBlockedCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-commit',
      field: 'blockedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationCommitBlockedCount'
    }),
    molecularTargetMutationCommitOperationCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-commit',
      field: 'plannedOperationCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationCommitOperationCount'
    }),
    molecularTargetMutationCommitCommittedOperationCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-commit',
      field: 'committedOperationCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationCommitCommittedOperationCount'
    }),
    molecularTargetMutationCommitBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-commit',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationCommitBlockerCount'
    }),
    molecularTargetMutationDispatchBatchCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-dispatch',
      field: 'batchCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationDispatchBatchCount'
    }),
    molecularTargetMutationDispatchEligibleCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-dispatch',
      field: 'invariantEligibleBatchCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationDispatchEligibleCount'
    }),
    molecularTargetMutationDispatchDispatchableCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-dispatch',
      field: 'dispatchableBatchCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationDispatchDispatchableCount'
    }),
    molecularTargetMutationDispatchBlockedCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-dispatch',
      field: 'blockedBatchCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationDispatchBlockedCount'
    }),
    molecularTargetMutationDispatchOperationCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-dispatch',
      field: 'operationCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationDispatchOperationCount'
    }),
    molecularTargetMutationDispatchDispatchedOperationCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-dispatch',
      field: 'dispatchedOperationCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationDispatchDispatchedOperationCount'
    }),
    molecularTargetMutationDispatchBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-dispatch',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationDispatchBlockerCount'
    }),
    molecularTargetMutationApplyValidationTargetCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-validation',
      field: 'targetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyValidationTargetCount'
    }),
    molecularTargetMutationApplyValidationValidatedCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-validation',
      field: 'validatedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyValidationValidatedCount'
    }),
    molecularTargetMutationApplyValidationReadyCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-validation',
      field: 'applyReadyTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyValidationReadyCount'
    }),
    molecularTargetMutationApplyValidationBlockedCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-validation',
      field: 'blockedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyValidationBlockedCount'
    }),
    molecularTargetMutationApplyValidationOperationCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-validation',
      field: 'operationCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyValidationOperationCount'
    }),
    molecularTargetMutationApplyValidationAppliedOperationCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-validation',
      field: 'appliedOperationCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyValidationAppliedOperationCount'
    }),
    molecularTargetMutationApplyValidationStateWriteSetCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-validation',
      field: 'stateWriteSetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyValidationStateWriteSetCount'
    }),
    molecularTargetMutationApplyValidationMaxResidual: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-validation',
      field: 'maxBeforeAfterResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyValidationMaxResidual'
    }),
    molecularTargetMutationApplyValidationBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-validation',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyValidationBlockerCount'
    }),
    molecularTargetMutationApplyExecutionTargetCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-execution',
      field: 'targetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyExecutionTargetCount'
    }),
    molecularTargetMutationApplyExecutionAppliedTargetCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-execution',
      field: 'appliedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyExecutionAppliedTargetCount'
    }),
    molecularTargetMutationApplyExecutionOperationCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-execution',
      field: 'operationCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyExecutionOperationCount'
    }),
    molecularTargetMutationApplyExecutionAppliedOperationCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-execution',
      field: 'appliedOperationCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyExecutionAppliedOperationCount'
    }),
    molecularTargetMutationApplyExecutionStateWriteSetCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-execution',
      field: 'stateWriteSetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyExecutionStateWriteSetCount'
    }),
    molecularTargetMutationApplyExecutionMaxResidual: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-execution',
      field: 'maxBeforeAfterResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyExecutionMaxResidual'
    }),
    molecularTargetMutationApplyExecutionBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-mutation-apply-execution',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetMutationApplyExecutionBlockerCount'
    }),
    molecularTargetSourceIntakeActiveCount: describeMultiscaleField({
      solverId: 'molecular-target-source-intake',
      field: 'activeTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceIntakeActiveCount'
    }),
    molecularTargetSourceIntakeAppliedOperationCount: describeMultiscaleField({
      solverId: 'molecular-target-source-intake',
      field: 'appliedOperationCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceIntakeAppliedOperationCount'
    }),
    molecularTargetSourceIntakeHeatRateWProxy: describeMultiscaleField({
      solverId: 'molecular-target-source-intake',
      field: 'totalHeatRateWProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceIntakeHeatRateWProxy'
    }),
    molecularTargetSourceIntakeThermalDrive: describeMultiscaleField({
      solverId: 'molecular-target-source-intake',
      field: 'maxThermalDrive',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceIntakeThermalDrive'
    }),
    molecularTargetSourceResponseActiveCount: describeMultiscaleField({
      solverId: 'molecular-target-source-response',
      field: 'activeTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceResponseActiveCount'
    }),
    molecularTargetSourceResponseRespondedCount: describeMultiscaleField({
      solverId: 'molecular-target-source-response',
      field: 'respondedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceResponseRespondedCount'
    }),
    molecularTargetSourceResponsePendingCount: describeMultiscaleField({
      solverId: 'molecular-target-source-response',
      field: 'pendingTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceResponsePendingCount'
    }),
    molecularTargetSourceResponseThermalDrive: describeMultiscaleField({
      solverId: 'molecular-target-source-response',
      field: 'totalResponseThermalDrive',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceResponseThermalDrive'
    }),
    molecularTargetSourceResponseHeatFlux: describeMultiscaleField({
      solverId: 'molecular-target-source-response',
      field: 'totalHeatFluxResponseProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceResponseHeatFlux'
    }),
    molecularTargetSourceResponseMaxTemperatureK: describeMultiscaleField({
      solverId: 'molecular-target-source-response',
      field: 'maxTemperatureK',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceResponseMaxTemperatureK'
    }),
    molecularTargetSourceResponseBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-source-response',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceResponseBlockerCount'
    }),
    molecularTargetSourceReconciliationActiveCount: describeMultiscaleField({
      solverId: 'molecular-target-source-reconciliation',
      field: 'activeTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceReconciliationActiveCount'
    }),
    molecularTargetSourceReconciliationReconciledCount: describeMultiscaleField({
      solverId: 'molecular-target-source-reconciliation',
      field: 'reconciledTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceReconciliationReconciledCount'
    }),
    molecularTargetSourceReconciliationPendingCount: describeMultiscaleField({
      solverId: 'molecular-target-source-reconciliation',
      field: 'pendingTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceReconciliationPendingCount'
    }),
    molecularTargetSourceReconciliationSequenceMismatchCount: describeMultiscaleField({
      solverId: 'molecular-target-source-reconciliation',
      field: 'sequenceMismatchCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceReconciliationSequenceMismatchCount'
    }),
    molecularTargetSourceReconciliationResidual: describeMultiscaleField({
      solverId: 'molecular-target-source-reconciliation',
      field: 'reconciliationResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceReconciliationResidual'
    }),
    molecularTargetSourceReconciliationUnacknowledgedDrive: describeMultiscaleField({
      solverId: 'molecular-target-source-reconciliation',
      field: 'unacknowledgedThermalDrive',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceReconciliationUnacknowledgedDrive'
    }),
    molecularTargetSourceReconciliationHeatRate: describeMultiscaleField({
      solverId: 'molecular-target-source-reconciliation',
      field: 'totalHeatRateWProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceReconciliationHeatRate'
    }),
    molecularTargetSourceReconciliationHeatFlux: describeMultiscaleField({
      solverId: 'molecular-target-source-reconciliation',
      field: 'totalHeatFluxResponseProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceReconciliationHeatFlux'
    }),
    molecularTargetSourceReconciliationBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-source-reconciliation',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetSourceReconciliationBlockerCount'
    }),
    molecularConservativeSourceBufferActiveCount: describeMultiscaleField({
      solverId: 'molecular-conservative-source-buffer',
      field: 'activeTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularConservativeSourceBufferActiveCount'
    }),
    molecularConservativeSourceBufferDispatchableCount: describeMultiscaleField({
      solverId: 'molecular-conservative-source-buffer',
      field: 'dispatchableTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularConservativeSourceBufferDispatchableCount'
    }),
    molecularConservativeSourceBufferReconciledCount: describeMultiscaleField({
      solverId: 'molecular-conservative-source-buffer',
      field: 'reconciledTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularConservativeSourceBufferReconciledCount'
    }),
    molecularConservativeSourceBufferPendingCount: describeMultiscaleField({
      solverId: 'molecular-conservative-source-buffer',
      field: 'pendingTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularConservativeSourceBufferPendingCount'
    }),
    molecularConservativeSourceBufferSourceTermCount: describeMultiscaleField({
      solverId: 'molecular-conservative-source-buffer',
      field: 'sourceTermCount',
      layer: 'molecular',
      role: 'exchange.molecularConservativeSourceBufferSourceTermCount'
    }),
    molecularConservativeSourceBufferHeatRate: describeMultiscaleField({
      solverId: 'molecular-conservative-source-buffer',
      field: 'totalHeatRateWProxy',
      layer: 'molecular',
      role: 'exchange.molecularConservativeSourceBufferHeatRate'
    }),
    molecularConservativeSourceBufferSpeciesRate: describeMultiscaleField({
      solverId: 'molecular-conservative-source-buffer',
      field: 'totalSpeciesRateCountPerSProxy',
      layer: 'molecular',
      role: 'exchange.molecularConservativeSourceBufferSpeciesRate'
    }),
    molecularConservativeSourceBufferResidual: describeMultiscaleField({
      solverId: 'molecular-conservative-source-buffer',
      field: 'sourceBufferResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularConservativeSourceBufferResidual'
    }),
    molecularConservativeSourceBufferUnacknowledgedDrive: describeMultiscaleField({
      solverId: 'molecular-conservative-source-buffer',
      field: 'unacknowledgedThermalDrive',
      layer: 'molecular',
      role: 'exchange.molecularConservativeSourceBufferUnacknowledgedDrive'
    }),
    molecularSourceBufferApplicationAppliedCount: describeMultiscaleField({
      solverId: 'molecular-source-buffer-application',
      field: 'appliedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferApplicationAppliedCount'
    }),
    molecularSourceBufferApplicationAppliedFieldCount: describeMultiscaleField({
      solverId: 'molecular-source-buffer-application',
      field: 'appliedFieldCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferApplicationAppliedFieldCount'
    }),
    molecularSourceBufferApplicationSourceTermCount: describeMultiscaleField({
      solverId: 'molecular-source-buffer-application',
      field: 'sourceTermCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferApplicationSourceTermCount'
    }),
    molecularSourceBufferApplicationHeatRate: describeMultiscaleField({
      solverId: 'molecular-source-buffer-application',
      field: 'appliedHeatRateWProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferApplicationHeatRate'
    }),
    molecularSourceBufferApplicationThermalDrive: describeMultiscaleField({
      solverId: 'molecular-source-buffer-application',
      field: 'thermalDrive',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferApplicationThermalDrive'
    }),
    molecularSourceBufferApplicationResidual: describeMultiscaleField({
      solverId: 'molecular-source-buffer-application',
      field: 'applicationResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferApplicationResidual'
    }),
    molecularSourceBufferApplicationMaxDelta: describeMultiscaleField({
      solverId: 'molecular-source-buffer-application',
      field: 'maxAbsFieldDeltaProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferApplicationMaxDelta'
    }),
    molecularSourceBufferAcceptanceCanMutateProxy: describeMultiscaleField({
      solverId: 'molecular-source-buffer-acceptance',
      field: 'canMutateProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferAcceptanceCanMutateProxy'
    }),
    molecularSourceBufferAcceptanceAcceptedCount: describeMultiscaleField({
      solverId: 'molecular-source-buffer-acceptance',
      field: 'acceptedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferAcceptanceAcceptedCount'
    }),
    molecularSourceBufferAcceptanceBlockedCount: describeMultiscaleField({
      solverId: 'molecular-source-buffer-acceptance',
      field: 'blockedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferAcceptanceBlockedCount'
    }),
    molecularSourceBufferAcceptanceResidual: describeMultiscaleField({
      solverId: 'molecular-source-buffer-acceptance',
      field: 'maxApplicationResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferAcceptanceResidual'
    }),
    molecularSourceBufferAcceptanceBlockerCount: describeMultiscaleField({
      solverId: 'molecular-source-buffer-acceptance',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferAcceptanceBlockerCount'
    }),
    molecularSourceBufferWritebackCanWritebackProxy: describeMultiscaleField({
      solverId: 'molecular-source-buffer-writeback-validation',
      field: 'canWritebackProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferWritebackCanWritebackProxy'
    }),
    molecularSourceBufferWritebackValidatedCount: describeMultiscaleField({
      solverId: 'molecular-source-buffer-writeback-validation',
      field: 'validatedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferWritebackValidatedCount'
    }),
    molecularSourceBufferWritebackBlockedCount: describeMultiscaleField({
      solverId: 'molecular-source-buffer-writeback-validation',
      field: 'blockedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferWritebackBlockedCount'
    }),
    molecularSourceBufferWritebackResidual: describeMultiscaleField({
      solverId: 'molecular-source-buffer-writeback-validation',
      field: 'maxWritebackResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferWritebackResidual'
    }),
    molecularSourceBufferWritebackBlockerCount: describeMultiscaleField({
      solverId: 'molecular-source-buffer-writeback-validation',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularSourceBufferWritebackBlockerCount'
    }),
    molecularTargetBufferReplayCanReplayProxy: describeMultiscaleField({
      solverId: 'molecular-target-buffer-replay-validation',
      field: 'canReplayProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferReplayCanReplayProxy'
    }),
    molecularTargetBufferReplayValidatedCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-replay-validation',
      field: 'replayedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferReplayValidatedCount'
    }),
    molecularTargetBufferReplayBlockedCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-replay-validation',
      field: 'blockedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferReplayBlockedCount'
    }),
    molecularTargetBufferReplayFieldCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-replay-validation',
      field: 'replayedFieldCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferReplayFieldCount'
    }),
    molecularTargetBufferReplayMissingFieldCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-replay-validation',
      field: 'missingFieldCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferReplayMissingFieldCount'
    }),
    molecularTargetBufferReplayResidual: describeMultiscaleField({
      solverId: 'molecular-target-buffer-replay-validation',
      field: 'maxReplayResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferReplayResidual'
    }),
    molecularTargetBufferReplayBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-replay-validation',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferReplayBlockerCount'
    }),
    molecularTargetBufferMutationAuditCanMutateProxy: describeMultiscaleField({
      solverId: 'molecular-target-buffer-mutation-audit',
      field: 'canMutateProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferMutationAuditCanMutateProxy'
    }),
    molecularTargetBufferMutationAuditCanQueueWorkerWrite: describeMultiscaleField({
      solverId: 'molecular-target-buffer-mutation-audit',
      field: 'canQueueWorkerWrite',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferMutationAuditCanQueueWorkerWrite'
    }),
    molecularTargetBufferMutationAuditScientificReady: describeMultiscaleField({
      solverId: 'molecular-target-buffer-mutation-audit',
      field: 'scientificMutationReady',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferMutationAuditScientificReady'
    }),
    molecularTargetBufferMutationAuditReadyCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-mutation-audit',
      field: 'readyTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferMutationAuditReadyCount'
    }),
    molecularTargetBufferMutationAuditBlockedCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-mutation-audit',
      field: 'blockedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferMutationAuditBlockedCount'
    }),
    molecularTargetBufferMutationAuditWriteIntentCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-mutation-audit',
      field: 'writeIntentCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferMutationAuditWriteIntentCount'
    }),
    molecularTargetBufferMutationAuditReadyWriteIntentCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-mutation-audit',
      field: 'readyWriteIntentCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferMutationAuditReadyWriteIntentCount'
    }),
    molecularTargetBufferMutationAuditBlockedWriteIntentCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-mutation-audit',
      field: 'blockedWriteIntentCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferMutationAuditBlockedWriteIntentCount'
    }),
    molecularTargetBufferMutationAuditResidual: describeMultiscaleField({
      solverId: 'molecular-target-buffer-mutation-audit',
      field: 'maxMutationAuditResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferMutationAuditResidual'
    }),
    molecularTargetBufferMutationAuditBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-mutation-audit',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferMutationAuditBlockerCount'
    }),
    molecularTargetBufferWorkerWriteQueueCanPlan: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-queue',
      field: 'canPlanWorkerWrite',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteQueueCanPlan'
    }),
    molecularTargetBufferWorkerWriteQueueCanQueueWorkerWrite: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-queue',
      field: 'canQueueWorkerWrite',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteQueueCanQueueWorkerWrite'
    }),
    molecularTargetBufferWorkerWriteQueueScientificReady: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-queue',
      field: 'scientificMutationReady',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteQueueScientificReady'
    }),
    molecularTargetBufferWorkerWriteQueueBatchCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-queue',
      field: 'targetBatchCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteQueueBatchCount'
    }),
    molecularTargetBufferWorkerWriteQueueReadyBatchCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-queue',
      field: 'queueReadyBatchCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteQueueReadyBatchCount'
    }),
    molecularTargetBufferWorkerWriteQueueBlockedBatchCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-queue',
      field: 'queueBlockedBatchCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteQueueBlockedBatchCount'
    }),
    molecularTargetBufferWorkerWriteQueueWriteIntentCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-queue',
      field: 'writeIntentCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteQueueWriteIntentCount'
    }),
    molecularTargetBufferWorkerWriteQueueReadyWriteIntentCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-queue',
      field: 'queueReadyWriteIntentCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteQueueReadyWriteIntentCount'
    }),
    molecularTargetBufferWorkerWriteQueueBlockedWriteIntentCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-queue',
      field: 'blockedWriteIntentCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteQueueBlockedWriteIntentCount'
    }),
    molecularTargetBufferWorkerWriteQueueQueuedWriteIntentCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-queue',
      field: 'queuedWriteIntentCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteQueueQueuedWriteIntentCount'
    }),
    molecularTargetBufferWorkerWriteQueueResidual: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-queue',
      field: 'maxQueueResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteQueueResidual'
    }),
    molecularTargetBufferWorkerWriteQueueBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-queue',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteQueueBlockerCount'
    }),
    molecularTargetBufferWorkerWriteExecutionCanExecute: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-execution',
      field: 'canExecuteProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteExecutionCanExecute'
    }),
    molecularTargetBufferWorkerWriteExecutionApplied: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-execution',
      field: 'applied',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteExecutionApplied'
    }),
    molecularTargetBufferWorkerWriteExecutionScientificReady: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-execution',
      field: 'scientificMutationReady',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteExecutionScientificReady'
    }),
    molecularTargetBufferWorkerWriteExecutionBatchCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-execution',
      field: 'targetBatchCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteExecutionBatchCount'
    }),
    molecularTargetBufferWorkerWriteExecutionAppliedBatchCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-execution',
      field: 'appliedBatchCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteExecutionAppliedBatchCount'
    }),
    molecularTargetBufferWorkerWriteExecutionBlockedBatchCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-execution',
      field: 'blockedBatchCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteExecutionBlockedBatchCount'
    }),
    molecularTargetBufferWorkerWriteExecutionWriteIntentCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-execution',
      field: 'writeIntentCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteExecutionWriteIntentCount'
    }),
    molecularTargetBufferWorkerWriteExecutionQueuedWriteIntentCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-execution',
      field: 'queuedWriteIntentCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteExecutionQueuedWriteIntentCount'
    }),
    molecularTargetBufferWorkerWriteExecutionDispatchedWriteIntentCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-execution',
      field: 'dispatchedWriteIntentCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteExecutionDispatchedWriteIntentCount'
    }),
    molecularTargetBufferWorkerWriteExecutionAppliedWriteIntentCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-execution',
      field: 'appliedWriteIntentCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteExecutionAppliedWriteIntentCount'
    }),
    molecularTargetBufferWorkerWriteExecutionSkippedWriteIntentCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-execution',
      field: 'skippedWriteIntentCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteExecutionSkippedWriteIntentCount'
    }),
    molecularTargetBufferWorkerWriteExecutionResidual: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-execution',
      field: 'maxWorkerWriteResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteExecutionResidual'
    }),
    molecularTargetBufferWorkerWriteExecutionBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-execution',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteExecutionBlockerCount'
    }),
    molecularTargetBufferWorkerWriteVerificationCanVerify: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-verification',
      field: 'canVerifyProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteVerificationCanVerify'
    }),
    molecularTargetBufferWorkerWriteVerificationVerified: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-verification',
      field: 'verified',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteVerificationVerified'
    }),
    molecularTargetBufferWorkerWriteVerificationScientificReady: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-verification',
      field: 'scientificMutationReady',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteVerificationScientificReady'
    }),
    molecularTargetBufferWorkerWriteVerificationTargetCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-verification',
      field: 'targetBatchCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteVerificationTargetCount'
    }),
    molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-verification',
      field: 'verifiedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount'
    }),
    molecularTargetBufferWorkerWriteVerificationBlockedTargetCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-verification',
      field: 'blockedTargetCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteVerificationBlockedTargetCount'
    }),
    molecularTargetBufferWorkerWriteVerificationFieldWriteCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-verification',
      field: 'fieldWriteCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteVerificationFieldWriteCount'
    }),
    molecularTargetBufferWorkerWriteVerificationVerifiedFieldWriteCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-verification',
      field: 'verifiedFieldWriteCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteVerificationVerifiedFieldWriteCount'
    }),
    molecularTargetBufferWorkerWriteVerificationSkippedFieldWriteCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-verification',
      field: 'skippedFieldWriteCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteVerificationSkippedFieldWriteCount'
    }),
    molecularTargetBufferWorkerWriteVerificationMissingFieldWriteCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-verification',
      field: 'missingFieldWriteCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteVerificationMissingFieldWriteCount'
    }),
    molecularTargetBufferWorkerWriteVerificationMismatchedFieldWriteCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-verification',
      field: 'mismatchedFieldWriteCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteVerificationMismatchedFieldWriteCount'
    }),
    molecularTargetBufferWorkerWriteVerificationResidual: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-verification',
      field: 'maxVerificationResidualProxy',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteVerificationResidual'
    }),
    molecularTargetBufferWorkerWriteVerificationBlockerCount: describeMultiscaleField({
      solverId: 'molecular-target-buffer-worker-write-verification',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularTargetBufferWorkerWriteVerificationBlockerCount'
    }),
    molecularScientificInvariantGateCanPromoteProxy: describeMultiscaleField({
      solverId: 'molecular-scientific-invariant-gate',
      field: 'canPromoteProxy',
      layer: 'molecular',
      role: 'exchange.molecularScientificInvariantGateCanPromoteProxy'
    }),
    molecularScientificInvariantGateScientificReady: describeMultiscaleField({
      solverId: 'molecular-scientific-invariant-gate',
      field: 'scientificMutationReady',
      layer: 'molecular',
      role: 'exchange.molecularScientificInvariantGateScientificReady'
    }),
    molecularScientificInvariantGateProxySatisfiedScopeCount: describeMultiscaleField({
      solverId: 'molecular-scientific-invariant-gate',
      field: 'proxySatisfiedScopeCount',
      layer: 'molecular',
      role: 'exchange.molecularScientificInvariantGateProxySatisfiedScopeCount'
    }),
    molecularScientificInvariantGateAuthoritativeSatisfiedScopeCount: describeMultiscaleField({
      solverId: 'molecular-scientific-invariant-gate',
      field: 'authoritativeSatisfiedScopeCount',
      layer: 'molecular',
      role: 'exchange.molecularScientificInvariantGateAuthoritativeSatisfiedScopeCount'
    }),
    molecularScientificInvariantGateBlockedScopeCount: describeMultiscaleField({
      solverId: 'molecular-scientific-invariant-gate',
      field: 'blockedScopeCount',
      layer: 'molecular',
      role: 'exchange.molecularScientificInvariantGateBlockedScopeCount'
    }),
    molecularScientificInvariantGateBlockerCount: describeMultiscaleField({
      solverId: 'molecular-scientific-invariant-gate',
      field: 'blockerCount',
      layer: 'molecular',
      role: 'exchange.molecularScientificInvariantGateBlockerCount'
    }),
    magnetosphereReconnectionRate: describeMultiscaleField({
      solverId: 'magnetosphere-plasma',
      field: 'reconnectionRate',
      layer: 'solar',
      role: 'exchange.magnetosphereReconnectionRate'
    }),
    picCurrentDensity: describeMultiscaleField({
      solverId: 'pic-plasma-patch',
      field: 'currentDensity',
      layer: 'solar',
      role: 'exchange.picCurrentDensity'
    }),
    relativisticLensingDeflectionArcsecProxy: describeMultiscaleField({
      solverId: 'relativistic-correction',
      field: 'lensingDeflectionArcsecProxy',
      layer: 'solar',
      role: 'exchange.relativisticLensing'
    }),
    cosmologyStructureGrowth: describeMultiscaleField({
      solverId: 'cosmology-expansion',
      field: 'structureGrowthProxy',
      layer: 'supergalactic',
      role: 'exchange.cosmologyStructureGrowth'
    })
  };
  const fieldMetadata = createFieldMetadataReport([
    ...Object.values(residualMetadata),
    ...Object.values(exchangeMetadata)
  ]);

  return {
    schema: MULTISCALE_CONSERVATION_AUDIT_SCHEMA,
    mode: 'interactive-proxy',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    closedSystem: false,
    massRelativeError: expRounded(massResidual, 3),
    energyResidualProxy: expRounded(reducedEnergyResidual, 3),
    speciesResidualProxy: expRounded(speciesResidual, 3),
    residuals: {
      massRelativeError: {
        value: expRounded(massResidual, 3),
        metadata: residualMetadata.massRelativeError
      },
      energyResidualProxy: {
        value: expRounded(reducedEnergyResidual, 3),
        metadata: residualMetadata.energyResidualProxy
      },
      speciesResidualProxy: {
        value: expRounded(speciesResidual, 3),
        metadata: residualMetadata.speciesResidualProxy
      }
    },
    computeResize: computeResizeConservation,
    fieldMetadata,
    water: {
      referenceMassKg: rounded(referenceWaterMassKg, 4),
      liquidKg: rounded(waterLiquidKg, 4),
      vaporKg: rounded(waterVaporKg, 4),
      releasedKg: rounded(waterReleasedKg, 4),
      inventoryKg: rounded(waterInventoryKg, 4),
      deltaKg: expRounded(waterMassDeltaKg, 4),
      relativeError: expRounded(waterMassRelativeError, 3)
    },
    solverDrift: {
      nbodyRelativeEnergyDrift: expRounded(nbodyRelativeEnergyDrift, 4),
      stellarFusionEnergyDrift: expRounded(finite(stellarFusion.energyDrift), 4),
      stellarFusionSpeciesDrift: expRounded(finite(stellarFusion.speciesDrift), 4),
      magnetosphereMassDrift: expRounded(finite(magnetosphere.massDrift), 4),
      magnetosphereMagneticEnergyDelta: expRounded(finite(magnetosphere.magneticEnergyDelta), 4),
      magnetospherePlasmaEnergyDelta: expRounded(finite(magnetosphere.plasmaEnergyDelta), 4),
      magnetosphereDivergenceBProxy: expRounded(magnetosphereDivergence, 4),
      picChargeDrift: expRounded(finite(pic.chargeDrift), 4),
      picKineticEnergyDelta: expRounded(finite(pic.kineticEnergyDelta), 4),
      picFieldEnergyDelta: expRounded(finite(pic.fieldEnergyDelta), 4),
      picDivergenceEProxy: expRounded(picDivergenceE, 4),
      relativisticEnergyDelta: expRounded(finite(relativity.relativisticEnergyDelta), 4),
      relativisticTimeDilationDrift: expRounded(finite(relativity.timeDilationDrift), 4),
      relativisticPrecessionDeltaArcsecProxy: expRounded(finite(relativity.precessionDeltaArcsecProxy), 4),
      relativisticCausalityClampCount: rounded(finite(relativity.causalityClampCount), 0),
      cosmologyExpansionEnergyDelta: expRounded(finite(cosmologyExpansion.expansionEnergyDelta), 4),
      cosmologyDensityContrastDrift: expRounded(finite(cosmologyExpansion.densityContrastDrift), 4),
      cosmologyStructureGrowthDelta: expRounded(finite(cosmologyExpansion.structureGrowthDelta), 4),
      cosmologyFilamentEnergyDelta: expRounded(finite(cosmologyExpansion.filamentEnergyDelta), 4),
      cosmologyScaleFactorDelta: expRounded(finite(cosmologyExpansion.scaleFactorDelta), 4),
      molecularEnergyDelta: expRounded(finite(molecularDynamics.energyDelta), 4),
      molecularChargeDrift: expRounded(finite(molecularDynamics.chargeDrift), 4),
      molecularBondCountDelta: expRounded(finite(molecularDynamics.bondCountDelta), 4),
      molecularHeatReleaseDelta: expRounded(finite(molecularDynamics.heatReleaseDelta), 4),
      molecularClosureReactiveHeatFluxProxy: expRounded(reactiveMolecularClosureHeatFlux, 4),
      molecularClosureSphHeatFluxProxy: expRounded(sphMolecularClosureHeatFlux, 4),
      molecularClosureThermalDrive: expRounded(molecularClosureThermalDrive, 4),
      molecularReactionHeatSourceProxy: expRounded(molecularReactionHeatSourceProxy, 4),
      molecularReactionSpeciesRateProxy: expRounded(molecularReactionSpeciesRateProxy, 4),
      molecularReactionSourceDrive: expRounded(molecularReactionSourceDrive, 4),
      molecularReactionCoolingDrive: expRounded(molecularReactionCoolingDrive, 4),
      molecularPhaseDrive: expRounded(molecularPhaseDrive, 4),
      molecularPhaseHeatingDrive: expRounded(molecularPhaseHeatingDrive, 4),
      molecularPhaseCoolingDrive: expRounded(molecularPhaseCoolingDrive, 4),
      molecularLatentHeatSinkProxy: expRounded(molecularLatentHeatSinkProxy, 4),
      molecularLatentHeatReleaseProxy: expRounded(molecularLatentHeatReleaseProxy, 4),
      molecularSourceSinkEnergyResidual: expRounded(molecularSourceSinkEnergyResidual, 4),
      molecularSourceSinkSpeciesResidual: expRounded(molecularSourceSinkSpeciesResidual, 4),
      molecularSourceSinkBalanceResidual: expRounded(molecularSourceSinkBalanceResidual, 4),
      molecularSourceSinkBalanceHeatResidual: expRounded(molecularSourceSinkBalanceHeatResidual, 4),
      molecularSourceSinkBalanceSpeciesResidual: expRounded(molecularSourceSinkBalanceSpeciesResidual, 4),
      molecularSourceEquationHeatRateWProxy: expRounded(molecularSourceEquationHeatRateWProxy, 4),
      molecularSourceEquationTemperatureRateKps: expRounded(molecularSourceEquationTemperatureRateKps, 4),
      molecularSourceEquationSpeciesRateProxy: expRounded(molecularSourceEquationSpeciesRateProxy, 4),
      molecularSourceEquationResidualWProxy: expRounded(molecularSourceEquationResidualWProxy, 4),
      molecularSourceEquationPhaseEnergyRateWProxy: expRounded(molecularSourceEquationPhaseEnergyRateWProxy, 4),
      molecularPhaseEosStabilityResidual: rounded(molecularPhaseEosStabilityResidual, 4),
      molecularPhaseEosSpecificFreeEnergyProxy: expRounded(molecularPhaseEosSpecificFreeEnergyProxy, 4),
      molecularSourceTransferAllocationCount: rounded(molecularSourceTransferAllocationCount, 0),
      molecularSourceTransferAllocationFractionTotal: rounded(molecularSourceTransferAllocationFractionTotal, 4),
      molecularSourceTransferAllocatedHeatRateWProxy: expRounded(molecularSourceTransferAllocatedHeatRateWProxy, 4),
      molecularSourceTransferAllocatedSpeciesRateProxy: expRounded(molecularSourceTransferAllocatedSpeciesRateProxy, 4),
      molecularSourceTransferUnallocatedHeatRateWProxy: expRounded(molecularSourceTransferUnallocatedHeatRateWProxy, 4),
      molecularSourceTransferUnallocatedSpeciesRateProxy: expRounded(molecularSourceTransferUnallocatedSpeciesRateProxy, 4),
      molecularSourceTransferClosedResidualWProxy: expRounded(molecularSourceTransferClosedResidualWProxy, 4),
      molecularSourceTransferApplicationCanApply: rounded(molecularSourceTransferApplicationCanApply, 0),
      molecularSourceTransferApplicationReadyTargetCount: rounded(molecularSourceTransferApplicationReadyTargetCount, 0),
      molecularSourceTransferApplicationBlockedTargetCount: rounded(molecularSourceTransferApplicationBlockedTargetCount, 0),
      molecularSourceTransferApplicationAppliedTargetCount: rounded(molecularSourceTransferApplicationAppliedTargetCount, 0),
      molecularSourceTransferApplicationBlockerCount: rounded(molecularSourceTransferApplicationBlockerCount, 0),
      molecularSourceTransferApplicationClosedResidualWProxy: expRounded(molecularSourceTransferApplicationClosedResidualWProxy, 4),
      molecularSourceTransferTargetPreviewCount: rounded(molecularSourceTransferTargetPreviewCount, 0),
      molecularSourceTransferTargetPreviewBlockedTargetCount: rounded(molecularSourceTransferTargetPreviewBlockedTargetCount, 0),
      molecularSourceTransferTargetPreviewAppliedTargetCount: rounded(molecularSourceTransferTargetPreviewAppliedTargetCount, 0),
      molecularSourceTransferTargetPreviewBlockerCount: rounded(molecularSourceTransferTargetPreviewBlockerCount, 0),
      molecularSourceTransferTargetPreviewTotalHeatRateWProxy: expRounded(molecularSourceTransferTargetPreviewTotalHeatRateWProxy, 4),
      molecularSourceTransferTargetPreviewTotalSpeciesRateProxy: expRounded(molecularSourceTransferTargetPreviewTotalSpeciesRateProxy, 4),
      molecularSourceTransferTargetPreviewMaxDeltaK: expRounded(molecularSourceTransferTargetPreviewMaxDeltaK, 4),
      molecularSourceTransferTargetPreviewMaxPhaseDrive: expRounded(molecularSourceTransferTargetPreviewMaxPhaseDrive, 4),
      molecularTargetMutatorRegistryTargetCount: rounded(molecularTargetMutatorRegistryTargetCount, 0),
      molecularTargetMutatorRegistryRegisteredCount: rounded(molecularTargetMutatorRegistryRegisteredCount, 0),
      molecularTargetMutatorRegistryValidatedCount: rounded(molecularTargetMutatorRegistryValidatedCount, 0),
      molecularTargetMutatorRegistryBlockedCount: rounded(molecularTargetMutatorRegistryBlockedCount, 0),
      molecularTargetMutatorRegistryDeclaredFieldCount: rounded(molecularTargetMutatorRegistryDeclaredFieldCount, 0),
      molecularTargetMutatorRegistryInvariantScopeCount: rounded(molecularTargetMutatorRegistryInvariantScopeCount, 0),
      molecularTargetMutatorRegistryBlockerCount: rounded(molecularTargetMutatorRegistryBlockerCount, 0),
      molecularTargetMutationPreflightTargetCount: rounded(molecularTargetMutationPreflightTargetCount, 0),
      molecularTargetMutationPreflightPassedCount: rounded(molecularTargetMutationPreflightPassedCount, 0),
      molecularTargetMutationPreflightBlockedCount: rounded(molecularTargetMutationPreflightBlockedCount, 0),
      molecularTargetMutationPreflightResidualBudgetPassCount: rounded(molecularTargetMutationPreflightResidualBudgetPassCount, 0),
      molecularTargetMutationPreflightBlockerCount: rounded(molecularTargetMutationPreflightBlockerCount, 0),
      molecularTargetMutationPreflightResidualTolerance: expRounded(molecularTargetMutationPreflightResidualTolerance, 4),
      molecularTargetMutationPreflightMaxResidualRisk: expRounded(molecularTargetMutationPreflightMaxResidualRisk, 4),
      molecularTargetMutationPreflightMaxDeltaK: expRounded(molecularTargetMutationPreflightMaxDeltaK, 4),
      molecularTargetMutationOperationPlanTargetCount: rounded(molecularTargetMutationOperationPlanTargetCount, 0),
      molecularTargetMutationOperationPlanOperationCount: rounded(molecularTargetMutationOperationPlanOperationCount, 0),
      molecularTargetMutationOperationPlanAllowedCount: rounded(molecularTargetMutationOperationPlanAllowedCount, 0),
      molecularTargetMutationOperationPlanBlockedCount: rounded(molecularTargetMutationOperationPlanBlockedCount, 0),
      molecularTargetMutationOperationPlanBlockerCount: rounded(molecularTargetMutationOperationPlanBlockerCount, 0),
      molecularTargetMutationOperationPlanMaxDelta: expRounded(molecularTargetMutationOperationPlanMaxDelta, 4),
      molecularTargetMutationOperationPlanMaxDeltaK: expRounded(molecularTargetMutationOperationPlanMaxDeltaK, 4),
      molecularTargetMutationInvariantCheckTargetCount: rounded(molecularTargetMutationInvariantCheckTargetCount, 0),
      molecularTargetMutationInvariantCheckPassedCount: rounded(molecularTargetMutationInvariantCheckPassedCount, 0),
      molecularTargetMutationInvariantCheckBlockedCount: rounded(molecularTargetMutationInvariantCheckBlockedCount, 0),
      molecularTargetMutationInvariantCheckCoveredScopeCount: rounded(molecularTargetMutationInvariantCheckCoveredScopeCount, 0),
      molecularTargetMutationInvariantCheckMissingScopeCount: rounded(molecularTargetMutationInvariantCheckMissingScopeCount, 0),
      molecularTargetMutationInvariantCheckResidualPassCount: rounded(molecularTargetMutationInvariantCheckResidualPassCount, 0),
      molecularTargetMutationInvariantCheckBlockerCount: rounded(molecularTargetMutationInvariantCheckBlockerCount, 0),
      molecularTargetMutationInvariantCheckMaxResidual: expRounded(molecularTargetMutationInvariantCheckMaxResidual, 4),
      molecularTargetMutationCommitTargetCount: rounded(molecularTargetMutationCommitTargetCount, 0),
      molecularTargetMutationCommitEligibleCount: rounded(molecularTargetMutationCommitEligibleCount, 0),
      molecularTargetMutationCommitCommittableCount: rounded(molecularTargetMutationCommitCommittableCount, 0),
      molecularTargetMutationCommitBlockedCount: rounded(molecularTargetMutationCommitBlockedCount, 0),
      molecularTargetMutationCommitOperationCount: rounded(molecularTargetMutationCommitOperationCount, 0),
      molecularTargetMutationCommitCommittedOperationCount: rounded(molecularTargetMutationCommitCommittedOperationCount, 0),
      molecularTargetMutationCommitBlockerCount: rounded(molecularTargetMutationCommitBlockerCount, 0),
      molecularTargetMutationDispatchBatchCount: rounded(molecularTargetMutationDispatchBatchCount, 0),
      molecularTargetMutationDispatchEligibleCount: rounded(molecularTargetMutationDispatchEligibleCount, 0),
      molecularTargetMutationDispatchDispatchableCount: rounded(molecularTargetMutationDispatchDispatchableCount, 0),
      molecularTargetMutationDispatchBlockedCount: rounded(molecularTargetMutationDispatchBlockedCount, 0),
      molecularTargetMutationDispatchOperationCount: rounded(molecularTargetMutationDispatchOperationCount, 0),
      molecularTargetMutationDispatchDispatchedOperationCount: rounded(molecularTargetMutationDispatchDispatchedOperationCount, 0),
      molecularTargetMutationDispatchBlockerCount: rounded(molecularTargetMutationDispatchBlockerCount, 0),
      molecularTargetMutationApplyValidationTargetCount: rounded(molecularTargetMutationApplyValidationTargetCount, 0),
      molecularTargetMutationApplyValidationValidatedCount: rounded(molecularTargetMutationApplyValidationValidatedCount, 0),
      molecularTargetMutationApplyValidationReadyCount: rounded(molecularTargetMutationApplyValidationReadyCount, 0),
      molecularTargetMutationApplyValidationBlockedCount: rounded(molecularTargetMutationApplyValidationBlockedCount, 0),
      molecularTargetMutationApplyValidationOperationCount: rounded(molecularTargetMutationApplyValidationOperationCount, 0),
      molecularTargetMutationApplyValidationAppliedOperationCount: rounded(molecularTargetMutationApplyValidationAppliedOperationCount, 0),
      molecularTargetMutationApplyValidationStateWriteSetCount: rounded(molecularTargetMutationApplyValidationStateWriteSetCount, 0),
      molecularTargetMutationApplyValidationMaxResidual: expRounded(molecularTargetMutationApplyValidationMaxResidual, 4),
      molecularTargetMutationApplyValidationBlockerCount: rounded(molecularTargetMutationApplyValidationBlockerCount, 0),
      molecularTargetMutationApplyExecutionTargetCount: rounded(molecularTargetMutationApplyExecutionTargetCount, 0),
      molecularTargetMutationApplyExecutionAppliedTargetCount: rounded(molecularTargetMutationApplyExecutionAppliedTargetCount, 0),
      molecularTargetMutationApplyExecutionOperationCount: rounded(molecularTargetMutationApplyExecutionOperationCount, 0),
      molecularTargetMutationApplyExecutionAppliedOperationCount: rounded(molecularTargetMutationApplyExecutionAppliedOperationCount, 0),
      molecularTargetMutationApplyExecutionStateWriteSetCount: rounded(molecularTargetMutationApplyExecutionStateWriteSetCount, 0),
      molecularTargetMutationApplyExecutionMaxResidual: expRounded(molecularTargetMutationApplyExecutionMaxResidual, 4),
      molecularTargetMutationApplyExecutionBlockerCount: rounded(molecularTargetMutationApplyExecutionBlockerCount, 0),
      molecularTargetSourceIntakeActiveCount: rounded(molecularTargetSourceIntakeActiveCount, 0),
      molecularTargetSourceIntakeAppliedOperationCount: rounded(molecularTargetSourceIntakeAppliedOperationCount, 0),
      molecularTargetSourceIntakeHeatRateWProxy: expRounded(molecularTargetSourceIntakeHeatRateWProxy, 4),
      molecularTargetSourceIntakeThermalDrive: expRounded(molecularTargetSourceIntakeThermalDrive, 4),
      molecularTargetSourceResponseActiveCount: rounded(molecularTargetSourceResponseActiveCount, 0),
      molecularTargetSourceResponseRespondedCount: rounded(molecularTargetSourceResponseRespondedCount, 0),
      molecularTargetSourceResponsePendingCount: rounded(molecularTargetSourceResponsePendingCount, 0),
      molecularTargetSourceResponseThermalDrive: expRounded(molecularTargetSourceResponseThermalDrive, 4),
      molecularTargetSourceResponseHeatFlux: expRounded(molecularTargetSourceResponseHeatFlux, 4),
      molecularTargetSourceResponseMaxTemperatureK: rounded(molecularTargetSourceResponseMaxTemperatureK, 2),
      molecularTargetSourceResponseBlockerCount: rounded(molecularTargetSourceResponseBlockerCount, 0),
      molecularTargetSourceReconciliationActiveCount: rounded(molecularTargetSourceReconciliationActiveCount, 0),
      molecularTargetSourceReconciliationReconciledCount: rounded(molecularTargetSourceReconciliationReconciledCount, 0),
      molecularTargetSourceReconciliationPendingCount: rounded(molecularTargetSourceReconciliationPendingCount, 0),
      molecularTargetSourceReconciliationSequenceMismatchCount: rounded(molecularTargetSourceReconciliationSequenceMismatchCount, 0),
      molecularTargetSourceReconciliationResidual: expRounded(molecularTargetSourceReconciliationResidual, 4),
      molecularTargetSourceReconciliationUnacknowledgedDrive: expRounded(molecularTargetSourceReconciliationUnacknowledgedDrive, 4),
      molecularTargetSourceReconciliationHeatRate: expRounded(molecularTargetSourceReconciliationHeatRate, 4),
      molecularTargetSourceReconciliationHeatFlux: expRounded(molecularTargetSourceReconciliationHeatFlux, 4),
      molecularTargetSourceReconciliationBlockerCount: rounded(molecularTargetSourceReconciliationBlockerCount, 0),
      molecularConservativeSourceBufferActiveCount: rounded(molecularConservativeSourceBufferActiveCount, 0),
      molecularConservativeSourceBufferDispatchableCount: rounded(molecularConservativeSourceBufferDispatchableCount, 0),
      molecularConservativeSourceBufferReconciledCount: rounded(molecularConservativeSourceBufferReconciledCount, 0),
      molecularConservativeSourceBufferPendingCount: rounded(molecularConservativeSourceBufferPendingCount, 0),
      molecularConservativeSourceBufferSourceTermCount: rounded(molecularConservativeSourceBufferSourceTermCount, 0),
      molecularConservativeSourceBufferHeatRate: expRounded(molecularConservativeSourceBufferHeatRate, 4),
      molecularConservativeSourceBufferSpeciesRate: expRounded(molecularConservativeSourceBufferSpeciesRate, 4),
      molecularConservativeSourceBufferResidual: expRounded(molecularConservativeSourceBufferResidual, 4),
      molecularConservativeSourceBufferUnacknowledgedDrive: expRounded(molecularConservativeSourceBufferUnacknowledgedDrive, 4),
      molecularSourceBufferApplicationAppliedCount: rounded(molecularSourceBufferApplicationAppliedCount, 0),
      molecularSourceBufferApplicationAppliedFieldCount: rounded(molecularSourceBufferApplicationAppliedFieldCount, 0),
      molecularSourceBufferApplicationSourceTermCount: rounded(molecularSourceBufferApplicationSourceTermCount, 0),
      molecularSourceBufferApplicationHeatRate: expRounded(molecularSourceBufferApplicationHeatRate, 4),
      molecularSourceBufferApplicationThermalDrive: expRounded(molecularSourceBufferApplicationThermalDrive, 4),
      molecularSourceBufferApplicationResidual: expRounded(molecularSourceBufferApplicationResidual, 4),
      molecularSourceBufferApplicationMaxDelta: expRounded(molecularSourceBufferApplicationMaxDelta, 4),
      molecularSourceBufferAcceptanceCanMutateProxy: rounded(molecularSourceBufferAcceptanceCanMutateProxy, 0),
      molecularSourceBufferAcceptanceAcceptedCount: rounded(molecularSourceBufferAcceptanceAcceptedCount, 0),
      molecularSourceBufferAcceptanceBlockedCount: rounded(molecularSourceBufferAcceptanceBlockedCount, 0),
      molecularSourceBufferAcceptanceResidual: expRounded(molecularSourceBufferAcceptanceResidual, 4),
      molecularSourceBufferAcceptanceBlockerCount: rounded(molecularSourceBufferAcceptanceBlockerCount, 0),
      molecularSourceBufferWritebackCanWritebackProxy: rounded(molecularSourceBufferWritebackCanWritebackProxy, 0),
      molecularSourceBufferWritebackValidatedCount: rounded(molecularSourceBufferWritebackValidatedCount, 0),
      molecularSourceBufferWritebackBlockedCount: rounded(molecularSourceBufferWritebackBlockedCount, 0),
      molecularSourceBufferWritebackResidual: expRounded(molecularSourceBufferWritebackResidual, 4),
      molecularSourceBufferWritebackBlockerCount: rounded(molecularSourceBufferWritebackBlockerCount, 0),
      molecularTargetBufferReplayCanReplayProxy: rounded(molecularTargetBufferReplayCanReplayProxy, 0),
      molecularTargetBufferReplayValidatedCount: rounded(molecularTargetBufferReplayValidatedCount, 0),
      molecularTargetBufferReplayBlockedCount: rounded(molecularTargetBufferReplayBlockedCount, 0),
      molecularTargetBufferReplayFieldCount: rounded(molecularTargetBufferReplayFieldCount, 0),
      molecularTargetBufferReplayMissingFieldCount: rounded(molecularTargetBufferReplayMissingFieldCount, 0),
      molecularTargetBufferReplayResidual: expRounded(molecularTargetBufferReplayResidual, 4),
      molecularTargetBufferReplayBlockerCount: rounded(molecularTargetBufferReplayBlockerCount, 0),
      molecularTargetBufferMutationAuditCanMutateProxy: rounded(molecularTargetBufferMutationAuditCanMutateProxy, 0),
      molecularTargetBufferMutationAuditCanQueueWorkerWrite: rounded(molecularTargetBufferMutationAuditCanQueueWorkerWrite, 0),
      molecularTargetBufferMutationAuditScientificReady: rounded(molecularTargetBufferMutationAuditScientificReady, 0),
      molecularTargetBufferMutationAuditReadyCount: rounded(molecularTargetBufferMutationAuditReadyCount, 0),
      molecularTargetBufferMutationAuditBlockedCount: rounded(molecularTargetBufferMutationAuditBlockedCount, 0),
      molecularTargetBufferMutationAuditWriteIntentCount: rounded(molecularTargetBufferMutationAuditWriteIntentCount, 0),
      molecularTargetBufferMutationAuditReadyWriteIntentCount: rounded(molecularTargetBufferMutationAuditReadyWriteIntentCount, 0),
      molecularTargetBufferMutationAuditBlockedWriteIntentCount: rounded(molecularTargetBufferMutationAuditBlockedWriteIntentCount, 0),
      molecularTargetBufferMutationAuditResidual: expRounded(molecularTargetBufferMutationAuditResidual, 4),
      molecularTargetBufferMutationAuditBlockerCount: rounded(molecularTargetBufferMutationAuditBlockerCount, 0),
      molecularTargetBufferWorkerWriteQueueCanPlan: rounded(molecularTargetBufferWorkerWriteQueueCanPlan, 0),
      molecularTargetBufferWorkerWriteQueueCanQueueWorkerWrite: rounded(molecularTargetBufferWorkerWriteQueueCanQueueWorkerWrite, 0),
      molecularTargetBufferWorkerWriteQueueScientificReady: rounded(molecularTargetBufferWorkerWriteQueueScientificReady, 0),
      molecularTargetBufferWorkerWriteQueueBatchCount: rounded(molecularTargetBufferWorkerWriteQueueBatchCount, 0),
      molecularTargetBufferWorkerWriteQueueReadyBatchCount: rounded(molecularTargetBufferWorkerWriteQueueReadyBatchCount, 0),
      molecularTargetBufferWorkerWriteQueueBlockedBatchCount: rounded(molecularTargetBufferWorkerWriteQueueBlockedBatchCount, 0),
      molecularTargetBufferWorkerWriteQueueWriteIntentCount: rounded(molecularTargetBufferWorkerWriteQueueWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteQueueReadyWriteIntentCount: rounded(molecularTargetBufferWorkerWriteQueueReadyWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteQueueBlockedWriteIntentCount: rounded(molecularTargetBufferWorkerWriteQueueBlockedWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteQueueQueuedWriteIntentCount: rounded(molecularTargetBufferWorkerWriteQueueQueuedWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteQueueResidual: expRounded(molecularTargetBufferWorkerWriteQueueResidual, 4),
      molecularTargetBufferWorkerWriteQueueBlockerCount: rounded(molecularTargetBufferWorkerWriteQueueBlockerCount, 0),
      molecularTargetBufferWorkerWriteExecutionCanExecute: rounded(molecularTargetBufferWorkerWriteExecutionCanExecute, 0),
      molecularTargetBufferWorkerWriteExecutionApplied: rounded(molecularTargetBufferWorkerWriteExecutionApplied, 0),
      molecularTargetBufferWorkerWriteExecutionScientificReady: rounded(molecularTargetBufferWorkerWriteExecutionScientificReady, 0),
      molecularTargetBufferWorkerWriteExecutionBatchCount: rounded(molecularTargetBufferWorkerWriteExecutionBatchCount, 0),
      molecularTargetBufferWorkerWriteExecutionAppliedBatchCount: rounded(molecularTargetBufferWorkerWriteExecutionAppliedBatchCount, 0),
      molecularTargetBufferWorkerWriteExecutionBlockedBatchCount: rounded(molecularTargetBufferWorkerWriteExecutionBlockedBatchCount, 0),
      molecularTargetBufferWorkerWriteExecutionWriteIntentCount: rounded(molecularTargetBufferWorkerWriteExecutionWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteExecutionQueuedWriteIntentCount: rounded(molecularTargetBufferWorkerWriteExecutionQueuedWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteExecutionDispatchedWriteIntentCount: rounded(molecularTargetBufferWorkerWriteExecutionDispatchedWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteExecutionAppliedWriteIntentCount: rounded(molecularTargetBufferWorkerWriteExecutionAppliedWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteExecutionSkippedWriteIntentCount: rounded(molecularTargetBufferWorkerWriteExecutionSkippedWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteExecutionResidual: expRounded(molecularTargetBufferWorkerWriteExecutionResidual, 4),
      molecularTargetBufferWorkerWriteExecutionBlockerCount: rounded(molecularTargetBufferWorkerWriteExecutionBlockerCount, 0),
      molecularTargetBufferWorkerWriteVerificationCanVerify: rounded(molecularTargetBufferWorkerWriteVerificationCanVerify, 0),
      molecularTargetBufferWorkerWriteVerificationVerified: rounded(molecularTargetBufferWorkerWriteVerificationVerified, 0),
      molecularTargetBufferWorkerWriteVerificationScientificReady: rounded(molecularTargetBufferWorkerWriteVerificationScientificReady, 0),
      molecularTargetBufferWorkerWriteVerificationTargetCount: rounded(molecularTargetBufferWorkerWriteVerificationTargetCount, 0),
      molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount: rounded(molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount, 0),
      molecularTargetBufferWorkerWriteVerificationBlockedTargetCount: rounded(molecularTargetBufferWorkerWriteVerificationBlockedTargetCount, 0),
      molecularTargetBufferWorkerWriteVerificationFieldWriteCount: rounded(molecularTargetBufferWorkerWriteVerificationFieldWriteCount, 0),
      molecularTargetBufferWorkerWriteVerificationVerifiedFieldWriteCount: rounded(molecularTargetBufferWorkerWriteVerificationVerifiedFieldWriteCount, 0),
      molecularTargetBufferWorkerWriteVerificationSkippedFieldWriteCount: rounded(molecularTargetBufferWorkerWriteVerificationSkippedFieldWriteCount, 0),
      molecularTargetBufferWorkerWriteVerificationMissingFieldWriteCount: rounded(molecularTargetBufferWorkerWriteVerificationMissingFieldWriteCount, 0),
      molecularTargetBufferWorkerWriteVerificationMismatchedFieldWriteCount: rounded(molecularTargetBufferWorkerWriteVerificationMismatchedFieldWriteCount, 0),
      molecularTargetBufferWorkerWriteVerificationResidual: expRounded(molecularTargetBufferWorkerWriteVerificationResidual, 4),
      molecularTargetBufferWorkerWriteVerificationBlockerCount: rounded(molecularTargetBufferWorkerWriteVerificationBlockerCount, 0),
      molecularScientificInvariantGateCanPromoteProxy: rounded(molecularScientificInvariantGateCanPromoteProxy, 0),
      molecularScientificInvariantGateScientificReady: rounded(molecularScientificInvariantGateScientificReady, 0),
      molecularScientificInvariantGateProxySatisfiedScopeCount: rounded(molecularScientificInvariantGateProxySatisfiedScopeCount, 0),
      molecularScientificInvariantGateAuthoritativeSatisfiedScopeCount: rounded(molecularScientificInvariantGateAuthoritativeSatisfiedScopeCount, 0),
      molecularScientificInvariantGateBlockedScopeCount: rounded(molecularScientificInvariantGateBlockedScopeCount, 0),
      molecularScientificInvariantGateBlockerCount: rounded(molecularScientificInvariantGateBlockerCount, 0),
      radiationEnergyDrift: expRounded(radiationEnergyDrift, 4),
      hydroMassDrift: expRounded(finite(hydro.massDrift), 4),
      hydroMoistureDrift: expRounded(finite(hydro.moistureDrift), 4),
      sphMassDrift: expRounded(finite(sph.massDrift), 4),
      sphMomentumDrift: expRounded(finite(sph.momentumDrift), 4),
      sphKineticEnergyDrift: expRounded(finite(sph.kineticEnergyDrift), 4),
      reactiveSpeciesInventoryDelta: expRounded(finite(reactiveCell.speciesInventoryDelta), 4),
      computeResizeMassProxyDeltaBefore: expRounded(computeResizeConservation?.maxAbsMassProxyDeltaBefore, 4),
      computeResizeMassProxyDeltaAfter: expRounded(computeResizeConservation?.maxAbsMassProxyDeltaAfter, 4),
      computeResizeMomentumDeltaAfter: expRounded(computeResizeConservation?.maxAbsMomentumDeltaAfter, 4),
      computeResizeKineticEnergyDeltaAfter: expRounded(computeResizeConservation?.maxAbsKineticEnergyDeltaAfter, 4)
    },
    exchange: {
      computeResizeParticleCountBefore: rounded(computeResizeConservation?.particleCountBefore, 0),
      computeResizeParticleCountAfter: rounded(computeResizeConservation?.particleCountAfter, 0),
      computeResizeCarriedForwardShardCount: rounded(computeResizeConservation?.carriedForwardShardCount, 0),
      computeResizeMassConservedShardCount: rounded(computeResizeConservation?.massConservedShardCount, 0),
      surfaceRadiativeHeatFlux: rounded(surface.radiativeHeatFlux, 4),
      combustionHeatReleaseMean: expRounded(plume.heatReleaseMean, 4),
      combustionBuoyancyFlux: expRounded(plume.buoyancyFlux, 4),
      combustionOxygenDepletion: rounded(plume.oxygenDepletion, 4),
      stellarFusionPowerProxy: expRounded(stellarFusion.fusionPowerProxy, 4),
      stellarLuminosityFactor: rounded(stellarFusion.luminosityFactor, 4),
      stellarCoreTemperatureK: rounded(stellarFusion.coreTemperatureK, 2),
      stellarNeutrinoLossProxy: expRounded(stellarFusion.neutrinoLossProxy, 4),
      magnetosphereSolarWindPressure: rounded(magnetosphere.solarWindPressure, 4),
      magnetosphereReconnectionRate: rounded(magnetosphere.reconnectionRate, 4),
      magnetosphereMagnetopauseRadius: rounded(magnetosphere.magnetopauseRadius, 4),
      magnetosphereAlfvenSpeed: rounded(magnetosphere.alfvenSpeed, 4),
      magnetosphereDivergenceBProxy: expRounded(magnetosphere.divergenceBProxy, 4),
      picChargeImbalance: expRounded(pic.chargeImbalance, 4),
      picCurrentDensity: expRounded(pic.currentDensity, 4),
      picReconnectionHeating: expRounded(pic.reconnectionHeating, 4),
      picParticleEscapeFraction: rounded(pic.particleEscapeFraction, 4),
      picDivergenceEProxy: expRounded(pic.divergenceEProxy, 4),
      relativisticMaxSpeedFractionC: rounded(relativisticSpeed, 5),
      relativisticMeanLorentzFactor: rounded(relativity.meanLorentzFactor, 5),
      relativisticMeanTimeDilation: rounded(relativity.meanTimeDilation, 6),
      relativisticGravitationalRedshift: expRounded(relativity.gravitationalRedshiftProxy, 4),
      relativisticPrecessionArcsecProxy: expRounded(relativity.perihelionPrecessionArcsecProxy, 4),
      relativisticLensingDeflectionArcsecProxy: expRounded(relativity.lensingDeflectionArcsecProxy, 4),
      cosmologyScaleFactor: rounded(cosmologyExpansion.scaleFactor, 5),
      cosmologyRedshift: expRounded(cosmologyExpansion.redshift, 4),
      cosmologyHubbleRate: rounded(cosmologyExpansion.hubbleRate, 5),
      cosmologyMatterOmega: rounded(cosmologyExpansion.matterOmega, 4),
      cosmologyDarkEnergyOmega: rounded(cosmologyExpansion.darkEnergyOmega, 4),
      cosmologyFilamentEnergy: expRounded(cosmologyExpansion.filamentEnergy, 4),
      cosmologyStructureGrowth: expRounded(cosmologyExpansion.structureGrowthProxy, 4),
      cosmologyVoidFraction: rounded(cosmologyExpansion.voidFraction, 4),
      cosmologyExpansionWorkProxy: expRounded(cosmologyExpansion.expansionWorkProxy, 4),
      reactiveHeatReleaseNorm: rounded(reactiveCell.heatReleaseNorm, 4),
      membraneRuptureRisk: rounded(membraneRuptureRisk, 4),
      membraneMaxStressPa: expRounded(membraneShell.maxStressPa, 4),
      membraneHeatFluxMean: expRounded(membraneShell.heatFluxMean, 4),
      sphCoolingPotential: rounded(sph.coolingPotential, 4),
      sphFireContactFraction: rounded(sph.fireContactFraction, 4),
      sphSpillImpulse: rounded(sph.spillImpulse, 4),
      sphGroundContactFraction: rounded(sph.groundContactFraction, 4),
      sphKineticEnergyDrift: expRounded(sph.kineticEnergyDrift, 4),
      waterSpillReleasedKg: rounded(waterReleasedKg, 4),
      waterContact: rounded(surface.waterContact, 4),
      molecularReactionProgress: rounded(molecular.reactionProgress, 4),
      molecularAtomCount: rounded(molecularDynamics.atomCount, 0),
      molecularBondCount: rounded(molecularDynamics.bondCount, 0),
      molecularMeanBondOrder: rounded(molecularDynamics.meanBondOrder, 4),
      molecularHeatReleaseProxy: rounded(molecularDynamics.heatReleaseProxy, 4),
      molecularIonizationFraction: rounded(molecularDynamics.ionizationFraction, 4),
      molecularMeanTemperatureK: rounded(molecularDynamics.meanTemperatureK, 2),
      molecularClosureReactiveApplied: reactiveMolecularClosureApplied,
      molecularClosureReactiveThermalDrive: rounded(reactiveMolecularClosureThermalDrive, 4),
      molecularClosureReactiveHeatFluxProxy: rounded(reactiveMolecularClosureHeatFlux, 4),
      molecularClosureReactiveReactionHeatSourceProxy: rounded(reactiveMolecularReactionHeatSourceProxy, 4),
      molecularClosureReactiveReactionSpeciesRateProxy: rounded(reactiveMolecularReactionSpeciesRateProxy, 4),
      molecularClosureReactiveReactionSourceDrive: rounded(reactiveMolecularReactionSourceDrive, 4),
      molecularClosureReactiveReactionCoolingDrive: rounded(reactiveMolecularReactionCoolingDrive, 4),
      molecularClosureReactivePhaseDrive: rounded(reactiveMolecularPhaseDrive, 4),
      molecularClosureReactivePhaseHeatingDrive: rounded(reactiveMolecularPhaseHeatingDrive, 4),
      molecularClosureReactivePhaseCoolingDrive: rounded(reactiveMolecularPhaseCoolingDrive, 4),
      molecularClosureReactiveLatentHeatSinkProxy: expRounded(reactiveMolecularLatentHeatSinkProxy, 4),
      molecularClosureReactiveLatentHeatReleaseProxy: expRounded(reactiveMolecularLatentHeatReleaseProxy, 4),
      molecularClosureReactiveSourceSinkEnergyResidual: expRounded(reactiveMolecularSourceSinkEnergyResidual, 4),
      molecularClosureReactiveSourceSinkSpeciesResidual: expRounded(reactiveMolecularSourceSinkSpeciesResidual, 4),
      molecularClosureSphApplied: sphMolecularClosureApplied,
      molecularClosureSphThermalDrive: rounded(sphMolecularClosureThermalDrive, 4),
      molecularClosureSphRadiativeHeatFluxBoost: rounded(sphMolecularClosureHeatFlux, 4),
      molecularClosureSphReactionHeatSourceProxy: rounded(sphMolecularReactionHeatSourceProxy, 4),
      molecularClosureSphReactionSpeciesRateProxy: rounded(sphMolecularReactionSpeciesRateProxy, 4),
      molecularClosureSphReactionSourceDrive: rounded(sphMolecularReactionSourceDrive, 4),
      molecularClosureSphReactionCoolingDrive: rounded(sphMolecularReactionCoolingDrive, 4),
      molecularClosureSphPhaseDrive: rounded(sphMolecularPhaseDrive, 4),
      molecularClosureSphPhaseHeatingDrive: rounded(sphMolecularPhaseHeatingDrive, 4),
      molecularClosureSphPhaseCoolingDrive: rounded(sphMolecularPhaseCoolingDrive, 4),
      molecularClosureSphLatentHeatSinkProxy: expRounded(sphMolecularLatentHeatSinkProxy, 4),
      molecularClosureSphLatentHeatReleaseProxy: expRounded(sphMolecularLatentHeatReleaseProxy, 4),
      molecularClosureSphSourceSinkEnergyResidual: expRounded(sphMolecularSourceSinkEnergyResidual, 4),
      molecularClosureSphSourceSinkSpeciesResidual: expRounded(sphMolecularSourceSinkSpeciesResidual, 4),
      molecularReactionHeatSourceProxy: rounded(molecularReactionHeatSourceProxy, 4),
      molecularReactionSpeciesRateProxy: rounded(molecularReactionSpeciesRateProxy, 4),
      molecularReactionSourceDrive: rounded(molecularReactionSourceDrive, 4),
      molecularReactionCoolingDrive: rounded(molecularReactionCoolingDrive, 4),
      molecularPhaseDrive: rounded(molecularPhaseDrive, 4),
      molecularPhaseHeatingDrive: rounded(molecularPhaseHeatingDrive, 4),
      molecularPhaseCoolingDrive: rounded(molecularPhaseCoolingDrive, 4),
      molecularLatentHeatSinkProxy: expRounded(molecularLatentHeatSinkProxy, 4),
      molecularLatentHeatReleaseProxy: expRounded(molecularLatentHeatReleaseProxy, 4),
      molecularSourceSinkBalanceCoverage: rounded(molecularSourceSinkBalanceCoverage, 4),
      molecularSourceSinkCoolingCoverage: rounded(molecularSourceSinkCoolingCoverage, 4),
      molecularSourceSinkBalanceResidual: rounded(molecularSourceSinkBalanceResidual, 4),
      molecularSourceSinkBalanceHeatResidual: rounded(molecularSourceSinkBalanceHeatResidual, 4),
      molecularSourceSinkBalanceSpeciesResidual: rounded(molecularSourceSinkBalanceSpeciesResidual, 4),
      molecularSourceSinkBalanceFanoutOversubscription: rounded(molecularSourceSinkBalanceFanoutOversubscription, 4),
      molecularSourceEquationHeatRateWProxy: expRounded(molecularSourceEquationHeatRateWProxy, 4),
      molecularSourceEquationTemperatureRateKps: expRounded(molecularSourceEquationTemperatureRateKps, 4),
      molecularSourceEquationSpeciesRateProxy: expRounded(molecularSourceEquationSpeciesRateProxy, 4),
      molecularSourceEquationResidualWProxy: expRounded(molecularSourceEquationResidualWProxy, 4),
      molecularSourceEquationPhaseEnergyRateWProxy: expRounded(molecularSourceEquationPhaseEnergyRateWProxy, 4),
      molecularPhaseEosStabilityResidual: rounded(molecularPhaseEosStabilityResidual, 4),
      molecularPhaseEosSpecificFreeEnergyProxy: expRounded(molecularPhaseEosSpecificFreeEnergyProxy, 4),
      molecularSourceTransferAllocationCount: rounded(molecularSourceTransferAllocationCount, 0),
      molecularSourceTransferAllocationFractionTotal: rounded(molecularSourceTransferAllocationFractionTotal, 4),
      molecularSourceTransferAllocatedHeatRateWProxy: expRounded(molecularSourceTransferAllocatedHeatRateWProxy, 4),
      molecularSourceTransferAllocatedSpeciesRateProxy: expRounded(molecularSourceTransferAllocatedSpeciesRateProxy, 4),
      molecularSourceTransferUnallocatedHeatRateWProxy: expRounded(molecularSourceTransferUnallocatedHeatRateWProxy, 4),
      molecularSourceTransferUnallocatedSpeciesRateProxy: expRounded(molecularSourceTransferUnallocatedSpeciesRateProxy, 4),
      molecularSourceTransferClosedResidualWProxy: expRounded(molecularSourceTransferClosedResidualWProxy, 4),
      molecularSourceTransferApplicationCanApply: rounded(molecularSourceTransferApplicationCanApply, 0),
      molecularSourceTransferApplicationReadyTargetCount: rounded(molecularSourceTransferApplicationReadyTargetCount, 0),
      molecularSourceTransferApplicationBlockedTargetCount: rounded(molecularSourceTransferApplicationBlockedTargetCount, 0),
      molecularSourceTransferApplicationAppliedTargetCount: rounded(molecularSourceTransferApplicationAppliedTargetCount, 0),
      molecularSourceTransferApplicationBlockerCount: rounded(molecularSourceTransferApplicationBlockerCount, 0),
      molecularSourceTransferApplicationClosedResidualWProxy: expRounded(molecularSourceTransferApplicationClosedResidualWProxy, 4),
      molecularSourceTransferTargetPreviewCount: rounded(molecularSourceTransferTargetPreviewCount, 0),
      molecularSourceTransferTargetPreviewBlockedTargetCount: rounded(molecularSourceTransferTargetPreviewBlockedTargetCount, 0),
      molecularSourceTransferTargetPreviewAppliedTargetCount: rounded(molecularSourceTransferTargetPreviewAppliedTargetCount, 0),
      molecularSourceTransferTargetPreviewBlockerCount: rounded(molecularSourceTransferTargetPreviewBlockerCount, 0),
      molecularSourceTransferTargetPreviewTotalHeatRateWProxy: expRounded(molecularSourceTransferTargetPreviewTotalHeatRateWProxy, 4),
      molecularSourceTransferTargetPreviewTotalSpeciesRateProxy: expRounded(molecularSourceTransferTargetPreviewTotalSpeciesRateProxy, 4),
      molecularSourceTransferTargetPreviewMaxDeltaK: expRounded(molecularSourceTransferTargetPreviewMaxDeltaK, 4),
      molecularSourceTransferTargetPreviewMaxPhaseDrive: expRounded(molecularSourceTransferTargetPreviewMaxPhaseDrive, 4),
      molecularTargetMutatorRegistryTargetCount: rounded(molecularTargetMutatorRegistryTargetCount, 0),
      molecularTargetMutatorRegistryRegisteredCount: rounded(molecularTargetMutatorRegistryRegisteredCount, 0),
      molecularTargetMutatorRegistryValidatedCount: rounded(molecularTargetMutatorRegistryValidatedCount, 0),
      molecularTargetMutatorRegistryBlockedCount: rounded(molecularTargetMutatorRegistryBlockedCount, 0),
      molecularTargetMutatorRegistryDeclaredFieldCount: rounded(molecularTargetMutatorRegistryDeclaredFieldCount, 0),
      molecularTargetMutatorRegistryInvariantScopeCount: rounded(molecularTargetMutatorRegistryInvariantScopeCount, 0),
      molecularTargetMutatorRegistryBlockerCount: rounded(molecularTargetMutatorRegistryBlockerCount, 0),
      molecularTargetMutationPreflightTargetCount: rounded(molecularTargetMutationPreflightTargetCount, 0),
      molecularTargetMutationPreflightPassedCount: rounded(molecularTargetMutationPreflightPassedCount, 0),
      molecularTargetMutationPreflightBlockedCount: rounded(molecularTargetMutationPreflightBlockedCount, 0),
      molecularTargetMutationPreflightResidualBudgetPassCount: rounded(molecularTargetMutationPreflightResidualBudgetPassCount, 0),
      molecularTargetMutationPreflightBlockerCount: rounded(molecularTargetMutationPreflightBlockerCount, 0),
      molecularTargetMutationPreflightResidualTolerance: expRounded(molecularTargetMutationPreflightResidualTolerance, 4),
      molecularTargetMutationPreflightMaxResidualRisk: expRounded(molecularTargetMutationPreflightMaxResidualRisk, 4),
      molecularTargetMutationPreflightMaxDeltaK: expRounded(molecularTargetMutationPreflightMaxDeltaK, 4),
      molecularTargetMutationOperationPlanTargetCount: rounded(molecularTargetMutationOperationPlanTargetCount, 0),
      molecularTargetMutationOperationPlanOperationCount: rounded(molecularTargetMutationOperationPlanOperationCount, 0),
      molecularTargetMutationOperationPlanAllowedCount: rounded(molecularTargetMutationOperationPlanAllowedCount, 0),
      molecularTargetMutationOperationPlanBlockedCount: rounded(molecularTargetMutationOperationPlanBlockedCount, 0),
      molecularTargetMutationOperationPlanBlockerCount: rounded(molecularTargetMutationOperationPlanBlockerCount, 0),
      molecularTargetMutationOperationPlanMaxDelta: expRounded(molecularTargetMutationOperationPlanMaxDelta, 4),
      molecularTargetMutationOperationPlanMaxDeltaK: expRounded(molecularTargetMutationOperationPlanMaxDeltaK, 4),
      molecularTargetMutationInvariantCheckTargetCount: rounded(molecularTargetMutationInvariantCheckTargetCount, 0),
      molecularTargetMutationInvariantCheckPassedCount: rounded(molecularTargetMutationInvariantCheckPassedCount, 0),
      molecularTargetMutationInvariantCheckBlockedCount: rounded(molecularTargetMutationInvariantCheckBlockedCount, 0),
      molecularTargetMutationInvariantCheckCoveredScopeCount: rounded(molecularTargetMutationInvariantCheckCoveredScopeCount, 0),
      molecularTargetMutationInvariantCheckMissingScopeCount: rounded(molecularTargetMutationInvariantCheckMissingScopeCount, 0),
      molecularTargetMutationInvariantCheckResidualPassCount: rounded(molecularTargetMutationInvariantCheckResidualPassCount, 0),
      molecularTargetMutationInvariantCheckBlockerCount: rounded(molecularTargetMutationInvariantCheckBlockerCount, 0),
      molecularTargetMutationInvariantCheckMaxResidual: expRounded(molecularTargetMutationInvariantCheckMaxResidual, 4),
      molecularTargetMutationCommitTargetCount: rounded(molecularTargetMutationCommitTargetCount, 0),
      molecularTargetMutationCommitEligibleCount: rounded(molecularTargetMutationCommitEligibleCount, 0),
      molecularTargetMutationCommitCommittableCount: rounded(molecularTargetMutationCommitCommittableCount, 0),
      molecularTargetMutationCommitBlockedCount: rounded(molecularTargetMutationCommitBlockedCount, 0),
      molecularTargetMutationCommitOperationCount: rounded(molecularTargetMutationCommitOperationCount, 0),
      molecularTargetMutationCommitCommittedOperationCount: rounded(molecularTargetMutationCommitCommittedOperationCount, 0),
      molecularTargetMutationCommitBlockerCount: rounded(molecularTargetMutationCommitBlockerCount, 0),
      molecularTargetMutationDispatchBatchCount: rounded(molecularTargetMutationDispatchBatchCount, 0),
      molecularTargetMutationDispatchEligibleCount: rounded(molecularTargetMutationDispatchEligibleCount, 0),
      molecularTargetMutationDispatchDispatchableCount: rounded(molecularTargetMutationDispatchDispatchableCount, 0),
      molecularTargetMutationDispatchBlockedCount: rounded(molecularTargetMutationDispatchBlockedCount, 0),
      molecularTargetMutationDispatchOperationCount: rounded(molecularTargetMutationDispatchOperationCount, 0),
      molecularTargetMutationDispatchDispatchedOperationCount: rounded(molecularTargetMutationDispatchDispatchedOperationCount, 0),
      molecularTargetMutationDispatchBlockerCount: rounded(molecularTargetMutationDispatchBlockerCount, 0),
      molecularTargetMutationApplyValidationTargetCount: rounded(molecularTargetMutationApplyValidationTargetCount, 0),
      molecularTargetMutationApplyValidationValidatedCount: rounded(molecularTargetMutationApplyValidationValidatedCount, 0),
      molecularTargetMutationApplyValidationReadyCount: rounded(molecularTargetMutationApplyValidationReadyCount, 0),
      molecularTargetMutationApplyValidationBlockedCount: rounded(molecularTargetMutationApplyValidationBlockedCount, 0),
      molecularTargetMutationApplyValidationOperationCount: rounded(molecularTargetMutationApplyValidationOperationCount, 0),
      molecularTargetMutationApplyValidationAppliedOperationCount: rounded(molecularTargetMutationApplyValidationAppliedOperationCount, 0),
      molecularTargetMutationApplyValidationStateWriteSetCount: rounded(molecularTargetMutationApplyValidationStateWriteSetCount, 0),
      molecularTargetMutationApplyValidationMaxResidual: expRounded(molecularTargetMutationApplyValidationMaxResidual, 4),
      molecularTargetMutationApplyValidationBlockerCount: rounded(molecularTargetMutationApplyValidationBlockerCount, 0),
      molecularTargetMutationApplyExecutionTargetCount: rounded(molecularTargetMutationApplyExecutionTargetCount, 0),
      molecularTargetMutationApplyExecutionAppliedTargetCount: rounded(molecularTargetMutationApplyExecutionAppliedTargetCount, 0),
      molecularTargetMutationApplyExecutionOperationCount: rounded(molecularTargetMutationApplyExecutionOperationCount, 0),
      molecularTargetMutationApplyExecutionAppliedOperationCount: rounded(molecularTargetMutationApplyExecutionAppliedOperationCount, 0),
      molecularTargetMutationApplyExecutionStateWriteSetCount: rounded(molecularTargetMutationApplyExecutionStateWriteSetCount, 0),
      molecularTargetMutationApplyExecutionMaxResidual: expRounded(molecularTargetMutationApplyExecutionMaxResidual, 4),
      molecularTargetMutationApplyExecutionBlockerCount: rounded(molecularTargetMutationApplyExecutionBlockerCount, 0),
      molecularTargetSourceIntakeActiveCount: rounded(molecularTargetSourceIntakeActiveCount, 0),
      molecularTargetSourceIntakeAppliedOperationCount: rounded(molecularTargetSourceIntakeAppliedOperationCount, 0),
      molecularTargetSourceIntakeHeatRateWProxy: expRounded(molecularTargetSourceIntakeHeatRateWProxy, 4),
      molecularTargetSourceIntakeThermalDrive: rounded(molecularTargetSourceIntakeThermalDrive, 6),
      molecularTargetSourceResponseActiveCount: rounded(molecularTargetSourceResponseActiveCount, 0),
      molecularTargetSourceResponseRespondedCount: rounded(molecularTargetSourceResponseRespondedCount, 0),
      molecularTargetSourceResponsePendingCount: rounded(molecularTargetSourceResponsePendingCount, 0),
      molecularTargetSourceResponseThermalDrive: rounded(molecularTargetSourceResponseThermalDrive, 6),
      molecularTargetSourceResponseHeatFlux: rounded(molecularTargetSourceResponseHeatFlux, 6),
      molecularTargetSourceResponseMaxTemperatureK: rounded(molecularTargetSourceResponseMaxTemperatureK, 2),
      molecularTargetSourceResponseBlockerCount: rounded(molecularTargetSourceResponseBlockerCount, 0),
      molecularTargetSourceReconciliationActiveCount: rounded(molecularTargetSourceReconciliationActiveCount, 0),
      molecularTargetSourceReconciliationReconciledCount: rounded(molecularTargetSourceReconciliationReconciledCount, 0),
      molecularTargetSourceReconciliationPendingCount: rounded(molecularTargetSourceReconciliationPendingCount, 0),
      molecularTargetSourceReconciliationSequenceMismatchCount: rounded(molecularTargetSourceReconciliationSequenceMismatchCount, 0),
      molecularTargetSourceReconciliationResidual: rounded(molecularTargetSourceReconciliationResidual, 12),
      molecularTargetSourceReconciliationUnacknowledgedDrive: rounded(molecularTargetSourceReconciliationUnacknowledgedDrive, 6),
      molecularTargetSourceReconciliationHeatRate: rounded(molecularTargetSourceReconciliationHeatRate, 12),
      molecularTargetSourceReconciliationHeatFlux: rounded(molecularTargetSourceReconciliationHeatFlux, 6),
      molecularTargetSourceReconciliationBlockerCount: rounded(molecularTargetSourceReconciliationBlockerCount, 0),
      molecularConservativeSourceBufferActiveCount: rounded(molecularConservativeSourceBufferActiveCount, 0),
      molecularConservativeSourceBufferDispatchableCount: rounded(molecularConservativeSourceBufferDispatchableCount, 0),
      molecularConservativeSourceBufferReconciledCount: rounded(molecularConservativeSourceBufferReconciledCount, 0),
      molecularConservativeSourceBufferPendingCount: rounded(molecularConservativeSourceBufferPendingCount, 0),
      molecularConservativeSourceBufferSourceTermCount: rounded(molecularConservativeSourceBufferSourceTermCount, 0),
      molecularConservativeSourceBufferHeatRate: rounded(molecularConservativeSourceBufferHeatRate, 12),
      molecularConservativeSourceBufferSpeciesRate: rounded(molecularConservativeSourceBufferSpeciesRate, 6),
      molecularConservativeSourceBufferResidual: rounded(molecularConservativeSourceBufferResidual, 12),
      molecularConservativeSourceBufferUnacknowledgedDrive: rounded(molecularConservativeSourceBufferUnacknowledgedDrive, 6),
      molecularSourceBufferApplicationAppliedCount: rounded(molecularSourceBufferApplicationAppliedCount, 0),
      molecularSourceBufferApplicationAppliedFieldCount: rounded(molecularSourceBufferApplicationAppliedFieldCount, 0),
      molecularSourceBufferApplicationSourceTermCount: rounded(molecularSourceBufferApplicationSourceTermCount, 0),
      molecularSourceBufferApplicationHeatRate: rounded(molecularSourceBufferApplicationHeatRate, 12),
      molecularSourceBufferApplicationThermalDrive: rounded(molecularSourceBufferApplicationThermalDrive, 6),
      molecularSourceBufferApplicationResidual: rounded(molecularSourceBufferApplicationResidual, 12),
      molecularSourceBufferApplicationMaxDelta: rounded(molecularSourceBufferApplicationMaxDelta, 12),
      molecularSourceBufferAcceptanceCanMutateProxy: rounded(molecularSourceBufferAcceptanceCanMutateProxy, 0),
      molecularSourceBufferAcceptanceAcceptedCount: rounded(molecularSourceBufferAcceptanceAcceptedCount, 0),
      molecularSourceBufferAcceptanceBlockedCount: rounded(molecularSourceBufferAcceptanceBlockedCount, 0),
      molecularSourceBufferAcceptanceResidual: rounded(molecularSourceBufferAcceptanceResidual, 12),
      molecularSourceBufferAcceptanceBlockerCount: rounded(molecularSourceBufferAcceptanceBlockerCount, 0),
      molecularSourceBufferWritebackCanWritebackProxy: rounded(molecularSourceBufferWritebackCanWritebackProxy, 0),
      molecularSourceBufferWritebackValidatedCount: rounded(molecularSourceBufferWritebackValidatedCount, 0),
      molecularSourceBufferWritebackBlockedCount: rounded(molecularSourceBufferWritebackBlockedCount, 0),
      molecularSourceBufferWritebackResidual: rounded(molecularSourceBufferWritebackResidual, 12),
      molecularSourceBufferWritebackBlockerCount: rounded(molecularSourceBufferWritebackBlockerCount, 0),
      molecularTargetBufferReplayCanReplayProxy: rounded(molecularTargetBufferReplayCanReplayProxy, 0),
      molecularTargetBufferReplayValidatedCount: rounded(molecularTargetBufferReplayValidatedCount, 0),
      molecularTargetBufferReplayBlockedCount: rounded(molecularTargetBufferReplayBlockedCount, 0),
      molecularTargetBufferReplayFieldCount: rounded(molecularTargetBufferReplayFieldCount, 0),
      molecularTargetBufferReplayMissingFieldCount: rounded(molecularTargetBufferReplayMissingFieldCount, 0),
      molecularTargetBufferReplayResidual: rounded(molecularTargetBufferReplayResidual, 12),
      molecularTargetBufferReplayBlockerCount: rounded(molecularTargetBufferReplayBlockerCount, 0),
      molecularTargetBufferMutationAuditCanMutateProxy: rounded(molecularTargetBufferMutationAuditCanMutateProxy, 0),
      molecularTargetBufferMutationAuditCanQueueWorkerWrite: rounded(molecularTargetBufferMutationAuditCanQueueWorkerWrite, 0),
      molecularTargetBufferMutationAuditScientificReady: rounded(molecularTargetBufferMutationAuditScientificReady, 0),
      molecularTargetBufferMutationAuditReadyCount: rounded(molecularTargetBufferMutationAuditReadyCount, 0),
      molecularTargetBufferMutationAuditBlockedCount: rounded(molecularTargetBufferMutationAuditBlockedCount, 0),
      molecularTargetBufferMutationAuditWriteIntentCount: rounded(molecularTargetBufferMutationAuditWriteIntentCount, 0),
      molecularTargetBufferMutationAuditReadyWriteIntentCount: rounded(molecularTargetBufferMutationAuditReadyWriteIntentCount, 0),
      molecularTargetBufferMutationAuditBlockedWriteIntentCount: rounded(molecularTargetBufferMutationAuditBlockedWriteIntentCount, 0),
      molecularTargetBufferMutationAuditResidual: rounded(molecularTargetBufferMutationAuditResidual, 12),
      molecularTargetBufferMutationAuditBlockerCount: rounded(molecularTargetBufferMutationAuditBlockerCount, 0),
      molecularTargetBufferWorkerWriteQueueCanPlan: rounded(molecularTargetBufferWorkerWriteQueueCanPlan, 0),
      molecularTargetBufferWorkerWriteQueueCanQueueWorkerWrite: rounded(molecularTargetBufferWorkerWriteQueueCanQueueWorkerWrite, 0),
      molecularTargetBufferWorkerWriteQueueScientificReady: rounded(molecularTargetBufferWorkerWriteQueueScientificReady, 0),
      molecularTargetBufferWorkerWriteQueueBatchCount: rounded(molecularTargetBufferWorkerWriteQueueBatchCount, 0),
      molecularTargetBufferWorkerWriteQueueReadyBatchCount: rounded(molecularTargetBufferWorkerWriteQueueReadyBatchCount, 0),
      molecularTargetBufferWorkerWriteQueueBlockedBatchCount: rounded(molecularTargetBufferWorkerWriteQueueBlockedBatchCount, 0),
      molecularTargetBufferWorkerWriteQueueWriteIntentCount: rounded(molecularTargetBufferWorkerWriteQueueWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteQueueReadyWriteIntentCount: rounded(molecularTargetBufferWorkerWriteQueueReadyWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteQueueBlockedWriteIntentCount: rounded(molecularTargetBufferWorkerWriteQueueBlockedWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteQueueQueuedWriteIntentCount: rounded(molecularTargetBufferWorkerWriteQueueQueuedWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteQueueResidual: rounded(molecularTargetBufferWorkerWriteQueueResidual, 12),
      molecularTargetBufferWorkerWriteQueueBlockerCount: rounded(molecularTargetBufferWorkerWriteQueueBlockerCount, 0),
      molecularTargetBufferWorkerWriteExecutionCanExecute: rounded(molecularTargetBufferWorkerWriteExecutionCanExecute, 0),
      molecularTargetBufferWorkerWriteExecutionApplied: rounded(molecularTargetBufferWorkerWriteExecutionApplied, 0),
      molecularTargetBufferWorkerWriteExecutionScientificReady: rounded(molecularTargetBufferWorkerWriteExecutionScientificReady, 0),
      molecularTargetBufferWorkerWriteExecutionBatchCount: rounded(molecularTargetBufferWorkerWriteExecutionBatchCount, 0),
      molecularTargetBufferWorkerWriteExecutionAppliedBatchCount: rounded(molecularTargetBufferWorkerWriteExecutionAppliedBatchCount, 0),
      molecularTargetBufferWorkerWriteExecutionBlockedBatchCount: rounded(molecularTargetBufferWorkerWriteExecutionBlockedBatchCount, 0),
      molecularTargetBufferWorkerWriteExecutionWriteIntentCount: rounded(molecularTargetBufferWorkerWriteExecutionWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteExecutionQueuedWriteIntentCount: rounded(molecularTargetBufferWorkerWriteExecutionQueuedWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteExecutionDispatchedWriteIntentCount: rounded(molecularTargetBufferWorkerWriteExecutionDispatchedWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteExecutionAppliedWriteIntentCount: rounded(molecularTargetBufferWorkerWriteExecutionAppliedWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteExecutionSkippedWriteIntentCount: rounded(molecularTargetBufferWorkerWriteExecutionSkippedWriteIntentCount, 0),
      molecularTargetBufferWorkerWriteExecutionResidual: rounded(molecularTargetBufferWorkerWriteExecutionResidual, 12),
      molecularTargetBufferWorkerWriteExecutionBlockerCount: rounded(molecularTargetBufferWorkerWriteExecutionBlockerCount, 0),
      molecularTargetBufferWorkerWriteVerificationCanVerify: rounded(molecularTargetBufferWorkerWriteVerificationCanVerify, 0),
      molecularTargetBufferWorkerWriteVerificationVerified: rounded(molecularTargetBufferWorkerWriteVerificationVerified, 0),
      molecularTargetBufferWorkerWriteVerificationScientificReady: rounded(molecularTargetBufferWorkerWriteVerificationScientificReady, 0),
      molecularTargetBufferWorkerWriteVerificationTargetCount: rounded(molecularTargetBufferWorkerWriteVerificationTargetCount, 0),
      molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount: rounded(molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount, 0),
      molecularTargetBufferWorkerWriteVerificationBlockedTargetCount: rounded(molecularTargetBufferWorkerWriteVerificationBlockedTargetCount, 0),
      molecularTargetBufferWorkerWriteVerificationFieldWriteCount: rounded(molecularTargetBufferWorkerWriteVerificationFieldWriteCount, 0),
      molecularTargetBufferWorkerWriteVerificationVerifiedFieldWriteCount: rounded(molecularTargetBufferWorkerWriteVerificationVerifiedFieldWriteCount, 0),
      molecularTargetBufferWorkerWriteVerificationSkippedFieldWriteCount: rounded(molecularTargetBufferWorkerWriteVerificationSkippedFieldWriteCount, 0),
      molecularTargetBufferWorkerWriteVerificationMissingFieldWriteCount: rounded(molecularTargetBufferWorkerWriteVerificationMissingFieldWriteCount, 0),
      molecularTargetBufferWorkerWriteVerificationMismatchedFieldWriteCount: rounded(molecularTargetBufferWorkerWriteVerificationMismatchedFieldWriteCount, 0),
      molecularTargetBufferWorkerWriteVerificationResidual: rounded(molecularTargetBufferWorkerWriteVerificationResidual, 12),
      molecularTargetBufferWorkerWriteVerificationBlockerCount: rounded(molecularTargetBufferWorkerWriteVerificationBlockerCount, 0),
      molecularScientificInvariantGateCanPromoteProxy: rounded(molecularScientificInvariantGateCanPromoteProxy, 0),
      molecularScientificInvariantGateScientificReady: rounded(molecularScientificInvariantGateScientificReady, 0),
      molecularScientificInvariantGateProxySatisfiedScopeCount: rounded(molecularScientificInvariantGateProxySatisfiedScopeCount, 0),
      molecularScientificInvariantGateAuthoritativeSatisfiedScopeCount: rounded(molecularScientificInvariantGateAuthoritativeSatisfiedScopeCount, 0),
      molecularScientificInvariantGateBlockedScopeCount: rounded(molecularScientificInvariantGateBlockedScopeCount, 0),
      molecularScientificInvariantGateBlockerCount: rounded(molecularScientificInvariantGateBlockerCount, 0),
      ambientTemperatureK: rounded(environment.ambientTemperatureK ?? 294, 2),
      ambientPressurePa: rounded(environment.ambientPressurePa ?? 101325, 1)
    },
    exchangeMetadata,
    trackedCouplings,
    energyAudit: 'reduced-open-system',
    speciesAudit: 'reduced-open-system',
    chargeAudit: 'reduced-pic-and-molecular-proxy',
    warnings
  };
}
