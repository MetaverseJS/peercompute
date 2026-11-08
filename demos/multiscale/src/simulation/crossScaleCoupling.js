import {
  createFieldAdapterPlanReport,
  createFieldCompatibilityReport,
  createFieldMetadataReport,
  createFieldTransferReport,
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

export const MULTISCALE_CROSS_SCALE_COUPLING_SCHEMA = 'peercompute.multiscale.cross-scale-coupling.v0';

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

function statusFromBackend(backend) {
  return backend && backend !== 'none' ? 'solver-backed' : 'proxy';
}

function makeLink({
  id,
  direction,
  sourceLayer,
  sourceSolver,
  sourceField,
  sourceValue,
  driverValue = sourceValue,
  sourceUnit = 'reduced',
  targetLayer,
  targetSolver,
  targetField,
  responseValue,
  responseUnit = 'reduced',
  signalScale = 1,
  responseScale = 1,
  confidence = 0.16,
  backend = 'none',
  validity = 'interactive-proxy',
  conservation = [],
  adapterContext = null,
  note = ''
}) {
  const driver = finite(driverValue);
  const source = finite(sourceValue);
  const response = finite(responseValue);
  const sourceMetadata = describeMultiscaleField({
    solverId: sourceSolver,
    field: sourceField,
    layer: sourceLayer,
    role: 'source',
    fallbackUnit: sourceUnit
  });
  const targetMetadata = describeMultiscaleField({
    solverId: targetSolver,
    field: targetField,
    layer: targetLayer,
    role: 'target',
    fallbackUnit: responseUnit
  });
  const activeScore = clamp(
    Math.abs(driver) * signalScale + Math.abs(response) * responseScale,
    0,
    1
  );
  return {
    id,
    direction,
    source: {
      layer: sourceLayer,
      solver: sourceSolver,
      field: sourceField,
      value: rounded(source, 5),
      unit: sourceMetadata.unit,
      dimensions: sourceMetadata.dimensions,
      status: statusFromBackend(backend),
      metadata: sourceMetadata
    },
    target: {
      layer: targetLayer,
      solver: targetSolver,
      field: targetField,
      value: rounded(response, 5),
      unit: targetMetadata.unit,
      dimensions: targetMetadata.dimensions,
      metadata: targetMetadata
    },
    activeScore: rounded(activeScore, 5),
    status: activeScore > 0.04 || statusFromBackend(backend) === 'solver-backed'
      ? 'active'
      : 'idle',
    validity,
    uncertainty: {
      mode: 'heuristic-reduced-coupling',
      confidence: rounded(confidence, 3)
    },
    conservation,
    adapterContext: adapterContext ? { ...adapterContext } : null,
    note
  };
}

function summarizeDirection(links, direction) {
  const filtered = links.filter((link) => link.direction === direction);
  return {
    linkCount: filtered.length,
    activeLinkCount: filtered.filter((link) => link.status === 'active').length,
    links: filtered
  };
}

function countBy(values, pickKey) {
  const counts = {};
  for (const value of values) {
    const key = pickKey(value) || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

export function createCrossScaleCouplingReport({
  state = {},
  environment = {},
  timeSeconds = 0,
  activeLayerId = 'unknown',
  refinementRequests = [],
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
  const cosmology = state.cosmology || {};
  const expansion = cosmology.expansion || {};
  const galaxy = state.galaxy || {};
  const solar = state.solar || {};
  const planet = state.planet || {};
  const surface = state.surface || {};
  const balloon = state.balloon || {};
  const mpm = state.mpm || {};
  const molecular = state.molecular || {};
  const md = molecular.molecularDynamics || {};
  const reactive = surface.reactiveCell || {};
  const plume = surface.combustionPlume || {};
  const sph = mpm.sphMaterial || {};
  const membrane = balloon.membraneShell || {};
  const hydro = planet.hydroAtmosphere || {};
  const radiation = solar.radiationOpacity || {};
  const fusion = solar.stellarFusion || {};
  const magnetosphere = solar.magnetosphere || {};
  const pic = solar.picPlasmaPatch || {};
  const relativity = solar.relativity || {};
  const maxwell = galaxy.maxwell || {};
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
    reactive.molecularSourceBufferApplication
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
  const reactiveReactionHeatSourceProxy = finite(reactive.molecularReactionHeatSourceProxy);
  const sphReactionHeatSourceProxy = finite(sph.molecularReactionHeatSourceProxy);
  const molecularReactionHeatSourceProxy = Math.abs(reactiveReactionHeatSourceProxy) >= Math.abs(sphReactionHeatSourceProxy)
    ? reactiveReactionHeatSourceProxy
    : sphReactionHeatSourceProxy;
  const molecularReactionSpeciesRateProxy = Math.max(
    finite(reactive.molecularReactionSpeciesRateProxy),
    finite(sph.molecularReactionSpeciesRateProxy)
  );
  const molecularReactionSourceDrive = Math.max(
    finite(reactive.molecularReactionSourceDrive),
    finite(sph.molecularReactionSourceDrive)
  );
  const molecularReactionCoolingDrive = Math.max(
    finite(reactive.molecularReactionCoolingDrive),
    finite(sph.molecularReactionCoolingDrive)
  );
  const molecularSourceSinkBalanceCoverage = clamp(finite(
    sourceSinkBalance.coverage?.sourceDriveCoverage,
    sourceSinkBalance.sourceDriveCoverage ?? 1
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
    finite(md.phaseStabilityResidualProxy),
    finite(reactive.molecularPhaseEosStabilityResidualProxy),
    finite(sph.molecularPhaseEosStabilityResidualProxy)
  );
  const molecularPhaseEosSpecificFreeEnergyProxy = Math.abs(finite(md.specificFreeEnergyProxy)) >= Math.abs(finite(sourceEquationEnergy.phaseEosSpecificFreeEnergyProxy))
    ? finite(md.specificFreeEnergyProxy)
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
  const molecularSourceBufferAcceptanceResidual = Math.max(0, finite(sourceBufferAcceptanceSummary.maxApplicationResidualProxy));
  const molecularSourceBufferAcceptanceBlockerCount = Math.max(0, Math.round(finite(sourceBufferAcceptanceSummary.blockerCount)));
  const molecularSourceBufferWritebackCanWritebackProxy = sourceBufferWritebackValidationSummary.canWritebackProxy === true ? 1 : 0;
  const molecularSourceBufferWritebackValidatedCount = Math.max(0, Math.round(finite(sourceBufferWritebackValidationSummary.validatedTargetCount)));
  const molecularSourceBufferWritebackBlockedCount = Math.max(0, Math.round(finite(sourceBufferWritebackValidationSummary.blockedTargetCount)));
  const molecularSourceBufferWritebackResidual = Math.max(0, finite(sourceBufferWritebackValidationSummary.maxWritebackResidualProxy));
  const molecularSourceBufferWritebackBlockerCount = Math.max(0, Math.round(finite(sourceBufferWritebackValidationSummary.blockerCount)));
  const molecularTargetBufferReplayCanReplayProxy = targetBufferReplayValidationSummary.canReplayProxy === true ? 1 : 0;
  const molecularTargetBufferReplayValidatedCount = Math.max(0, Math.round(finite(targetBufferReplayValidationSummary.replayedTargetCount)));
  const molecularTargetBufferReplayBlockedCount = Math.max(0, Math.round(finite(targetBufferReplayValidationSummary.blockedTargetCount)));
  const molecularTargetBufferReplayFieldCount = Math.max(0, Math.round(finite(targetBufferReplayValidationSummary.replayedFieldCount)));
  const molecularTargetBufferReplayMissingFieldCount = Math.max(0, Math.round(finite(targetBufferReplayValidationSummary.missingFieldCount)));
  const molecularTargetBufferReplayResidual = Math.max(0, finite(targetBufferReplayValidationSummary.maxReplayResidualProxy));
  const molecularTargetBufferReplayBlockerCount = Math.max(0, Math.round(finite(targetBufferReplayValidationSummary.blockerCount)));
  const molecularTargetBufferMutationAuditCanMutateProxy = targetBufferMutationAuditSummary.canMutateProxy === true ? 1 : 0;
  const molecularTargetBufferMutationAuditCanQueueWorkerWrite = targetBufferMutationAuditSummary.canQueueWorkerWrite === true ? 1 : 0;
  const molecularTargetBufferMutationAuditScientificReady = targetBufferMutationAuditSummary.scientificMutationReady === true ? 1 : 0;
  const molecularTargetBufferMutationAuditReadyCount = Math.max(0, Math.round(finite(targetBufferMutationAuditSummary.readyTargetCount)));
  const molecularTargetBufferMutationAuditBlockedCount = Math.max(0, Math.round(finite(targetBufferMutationAuditSummary.blockedTargetCount)));
  const molecularTargetBufferMutationAuditWriteIntentCount = Math.max(0, Math.round(finite(targetBufferMutationAuditSummary.writeIntentCount)));
  const molecularTargetBufferMutationAuditReadyWriteIntentCount = Math.max(0, Math.round(finite(targetBufferMutationAuditSummary.readyWriteIntentCount)));
  const molecularTargetBufferMutationAuditBlockedWriteIntentCount = Math.max(0, Math.round(finite(targetBufferMutationAuditSummary.blockedWriteIntentCount)));
  const molecularTargetBufferMutationAuditResidual = Math.max(0, finite(targetBufferMutationAuditSummary.maxMutationAuditResidualProxy));
  const molecularTargetBufferMutationAuditBlockerCount = Math.max(0, Math.round(finite(targetBufferMutationAuditSummary.blockerCount)));
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
    Math.round(Math.max(
      finite(targetBufferWorkerWriteQueueSummary.blockerCount),
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
    Math.round(Math.max(
      finite(targetBufferWorkerWriteExecutionSummary.blockerCount),
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
    Math.round(Math.max(
      finite(targetBufferWorkerWriteVerificationSummary.blockerCount),
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

  const links = [
    makeLink({
      id: 'molecular-heat-to-reactive-thermal',
      direction: 'upward',
      sourceLayer: 'molecular',
      sourceSolver: 'molecular-dynamics',
      sourceField: 'heatReleaseProxy',
      sourceValue: md.heatReleaseProxy ?? molecular.heatReleaseNorm,
      targetLayer: 'surface',
      targetSolver: 'reactive-thermal-cell',
      targetField: 'heatReleaseNorm',
      responseValue: reactive.heatReleaseNorm,
      signalScale: 0.55,
      responseScale: 0.45,
      confidence: md.backend === 'none' ? 0.12 : 0.22,
      backend: md.backend,
      conservation: ['energy', 'species'],
      adapterContext: {
        heatReleaseNorm: finite(reactive.heatReleaseNorm),
        reactiveTemperatureK: finite(reactive.temperatureK, surface.flameTemperatureK ?? environment.ambientTemperatureK ?? 294),
        molecularMeanTemperatureK: finite(md.meanTemperatureK, environment.ambientTemperatureK ?? 294),
        meanTemperatureK: finite(md.meanTemperatureK, environment.ambientTemperatureK ?? 294),
        maxTemperatureK: finite(md.maxTemperatureK, md.meanTemperatureK ?? environment.ambientTemperatureK ?? 294),
        reactionProgress: finite(md.reactionProgress, molecular.reactionProgress),
        bondCount: finite(md.bondCount, molecular.bondEvents),
        meanBondOrder: finite(md.meanBondOrder),
        ionizationFraction: finite(md.ionizationFraction),
        electricalConductivityProxy: finite(md.electricalConductivityProxy),
        pressureProxy: finite(md.pressureProxy),
        energyDelta: finite(md.energyDelta),
        heatReleaseDelta: finite(md.heatReleaseDelta),
        sourceTransfer: sourceTransfer.schema ? { ...sourceTransfer } : null,
        sourceTransferApplication: sourceTransferApplication.schema ? { ...sourceTransferApplication } : null,
        sourceTransferTargetPreview: sourceTransferTargetPreview.schema ? { ...sourceTransferTargetPreview } : null,
        sourceTransferTargetPreviewSummary: sourceTransferTargetPreviewSummary.schema ? { ...sourceTransferTargetPreviewSummary } : null,
        targetMutatorRegistry: targetMutatorRegistry.schema ? { ...targetMutatorRegistry } : null,
        targetMutatorRegistrySummary: targetMutatorRegistrySummary.schema ? { ...targetMutatorRegistrySummary } : null,
        targetMutationPreflight: targetMutationPreflight.schema ? { ...targetMutationPreflight } : null,
        targetMutationPreflightSummary: targetMutationPreflightSummary.schema ? { ...targetMutationPreflightSummary } : null,
        targetMutationOperationPlan: targetMutationOperationPlan.schema ? { ...targetMutationOperationPlan } : null,
        targetMutationOperationPlanSummary: targetMutationOperationPlanSummary.schema ? { ...targetMutationOperationPlanSummary } : null,
        targetMutationInvariantCheck: targetMutationInvariantCheck.schema ? { ...targetMutationInvariantCheck } : null,
        targetMutationInvariantCheckSummary: targetMutationInvariantCheckSummary.schema ? { ...targetMutationInvariantCheckSummary } : null,
        targetMutationCommit: targetMutationCommit.schema ? { ...targetMutationCommit } : null,
        targetMutationCommitSummary: targetMutationCommitSummary.schema ? { ...targetMutationCommitSummary } : null,
        targetMutationDispatch: targetMutationDispatch.schema ? { ...targetMutationDispatch } : null,
        targetMutationDispatchSummary: targetMutationDispatchSummary.schema ? { ...targetMutationDispatchSummary } : null,
        targetMutationApplyValidation: targetMutationApplyValidation.schema ? { ...targetMutationApplyValidation } : null,
        targetMutationApplyValidationSummary: targetMutationApplyValidationSummary.schema ? { ...targetMutationApplyValidationSummary } : null,
        targetMutationApplyExecution: targetMutationApplyExecution.schema ? { ...targetMutationApplyExecution } : null,
        targetMutationApplyExecutionSummary: targetMutationApplyExecutionSummary.schema ? { ...targetMutationApplyExecutionSummary } : null,
        targetSourceIntake: targetSourceIntake.schema ? { ...targetSourceIntake } : null,
        targetSourceIntakeSummary: targetSourceIntakeSummary.schema ? { ...targetSourceIntakeSummary } : null,
        targetSourceResponse: targetSourceResponse.schema ? { ...targetSourceResponse } : null,
        targetSourceResponseSummary: targetSourceResponseSummary.schema ? { ...targetSourceResponseSummary } : null,
        targetSourceReconciliation: targetSourceReconciliation.schema ? { ...targetSourceReconciliation } : null,
        targetSourceReconciliationSummary: targetSourceReconciliationSummary.schema ? { ...targetSourceReconciliationSummary } : null,
        conservativeSourceBuffer: conservativeSourceBuffer.schema ? { ...conservativeSourceBuffer } : null,
        conservativeSourceBufferSummary: conservativeSourceBufferSummary.schema ? { ...conservativeSourceBufferSummary } : null,
        sourceBufferApplication: {
          appliedTargetCount: molecularSourceBufferApplicationAppliedCount,
          appliedFieldCount: molecularSourceBufferApplicationAppliedFieldCount,
          sourceTermCount: molecularSourceBufferApplicationSourceTermCount,
          residual: rounded(molecularSourceBufferApplicationResidual, 6),
          reactive: reactiveSourceBufferApplicationSummary.schema ? { ...reactiveSourceBufferApplicationSummary } : null,
          sph: sphSourceBufferApplicationSummary.schema ? { ...sphSourceBufferApplicationSummary } : null
        },
        sourceBufferAcceptance: sourceBufferAcceptanceSummary.schema ? { ...sourceBufferAcceptanceSummary } : null,
        sourceBufferWritebackValidation: sourceBufferWritebackValidationSummary.schema ? { ...sourceBufferWritebackValidationSummary } : null,
        targetBufferReplayValidation: targetBufferReplayValidationSummary.schema ? { ...targetBufferReplayValidationSummary } : null,
        targetBufferMutationAudit: targetBufferMutationAuditSummary.schema ? { ...targetBufferMutationAuditSummary } : null,
        targetBufferWorkerWriteQueue: targetBufferWorkerWriteQueueSummary.schema ? { ...targetBufferWorkerWriteQueueSummary } : null,
        targetBufferWorkerWriteExecution: targetBufferWorkerWriteExecutionSummary.schema ? { ...targetBufferWorkerWriteExecutionSummary } : null,
        targetBufferWorkerWriteVerification: targetBufferWorkerWriteVerificationSummary.schema ? { ...targetBufferWorkerWriteVerificationSummary } : null,
        scientificInvariantGate: scientificInvariantGateSummary.schema ? { ...scientificInvariantGateSummary } : null,
        species: md.species ? { ...md.species } : {},
        oxygenFraction: finite(environment.oxygenFraction, 0.21),
        ambientTemperatureK: finite(environment.ambientTemperatureK, 294),
        ambientPressurePa: finite(environment.ambientPressurePa, 101325),
        waterContact: finite(surface.waterContact),
        radiativeHeatFlux: finite(surface.radiativeHeatFlux),
        fireIntensity: finite(surface.fireIntensity)
      },
      note: 'Molecular heat/reaction telemetry seeds the reduced reactive thermal source term.'
    }),
    makeLink({
      id: 'molecular-closure-to-reactive-source',
      direction: 'upward',
      sourceLayer: 'molecular',
      sourceSolver: 'molecular-dynamics',
      sourceField: 'heatReleaseProxy',
      sourceValue: reactive.molecularClosureHeatReleaseProxy ?? md.heatReleaseProxy,
      driverValue: reactive.molecularClosureThermalDrive ?? md.heatReleaseProxy,
      targetLayer: 'surface',
      targetSolver: 'reactive-thermal-cell',
      targetField: 'molecularClosureHeatFluxProxy',
      responseValue: reactive.molecularClosureHeatFluxProxy,
      responseUnit: 'W/m^2-proxy',
      signalScale: 0.72,
      responseScale: 0.002,
      confidence: reactive.molecularClosureApplied === true ? 0.28 : 0.12,
      backend: reactive.backend,
      conservation: ['energy', 'species', 'provenance'],
      adapterContext: {
        applied: reactive.molecularClosureApplied === true,
        sourceStateKey: reactive.molecularClosureSourceStateKey || null,
        thermalDrive: finite(reactive.molecularClosureThermalDrive),
        heatReleaseProxy: finite(reactive.molecularClosureHeatReleaseProxy),
        heatFluxProxy: finite(reactive.molecularClosureHeatFluxProxy),
        reactionProgress: finite(reactive.molecularClosureReactionProgress),
        ionizationFraction: finite(reactive.molecularClosureIonizationFraction),
        reactionSourceSchema: reactive.molecularReactionSourceSchema || null,
        reactionHeatSourceProxy: finite(reactive.molecularReactionHeatSourceProxy),
        reactionSpeciesRateProxy: finite(reactive.molecularReactionSpeciesRateProxy),
        reactionSourceDrive: finite(reactive.molecularReactionSourceDrive),
        reactionCoolingDrive: finite(reactive.molecularReactionCoolingDrive),
        sourceSink: reactive.molecularSourceSink ? { ...reactive.molecularSourceSink } : null,
        phaseEos: reactive.molecularSourceSink?.phaseEos ? { ...reactive.molecularSourceSink.phaseEos } : null,
        sourceSinkBalance: sourceSinkBalance.schema ? { ...sourceSinkBalance } : null,
        sourceEquation: sourceEquation.schema ? { ...sourceEquation } : null,
        sourceTransfer: sourceTransfer.schema ? { ...sourceTransfer } : null,
        sourceTransferApplication: sourceTransferApplication.schema ? { ...sourceTransferApplication } : null,
        sourceTransferTargetPreview: sourceTransferTargetPreview.schema ? { ...sourceTransferTargetPreview } : null,
        sourceTransferTargetPreviewSummary: sourceTransferTargetPreviewSummary.schema ? { ...sourceTransferTargetPreviewSummary } : null,
        targetMutatorRegistry: targetMutatorRegistry.schema ? { ...targetMutatorRegistry } : null,
        targetMutatorRegistrySummary: targetMutatorRegistrySummary.schema ? { ...targetMutatorRegistrySummary } : null,
        targetMutationPreflight: targetMutationPreflight.schema ? { ...targetMutationPreflight } : null,
        targetMutationPreflightSummary: targetMutationPreflightSummary.schema ? { ...targetMutationPreflightSummary } : null,
        targetMutationOperationPlan: targetMutationOperationPlan.schema ? { ...targetMutationOperationPlan } : null,
        targetMutationOperationPlanSummary: targetMutationOperationPlanSummary.schema ? { ...targetMutationOperationPlanSummary } : null,
        targetMutationInvariantCheck: targetMutationInvariantCheck.schema ? { ...targetMutationInvariantCheck } : null,
        targetMutationInvariantCheckSummary: targetMutationInvariantCheckSummary.schema ? { ...targetMutationInvariantCheckSummary } : null,
        targetMutationCommit: targetMutationCommit.schema ? { ...targetMutationCommit } : null,
        targetMutationCommitSummary: targetMutationCommitSummary.schema ? { ...targetMutationCommitSummary } : null,
        targetMutationDispatch: targetMutationDispatch.schema ? { ...targetMutationDispatch } : null,
        targetMutationDispatchSummary: targetMutationDispatchSummary.schema ? { ...targetMutationDispatchSummary } : null,
        targetMutationApplyValidation: targetMutationApplyValidation.schema ? { ...targetMutationApplyValidation } : null,
        targetMutationApplyValidationSummary: targetMutationApplyValidationSummary.schema ? { ...targetMutationApplyValidationSummary } : null,
        targetMutationApplyExecution: targetMutationApplyExecution.schema ? { ...targetMutationApplyExecution } : null,
        targetMutationApplyExecutionSummary: targetMutationApplyExecutionSummary.schema ? { ...targetMutationApplyExecutionSummary } : null,
        targetSourceIntake: targetSourceIntake.schema ? { ...targetSourceIntake } : null,
        targetSourceIntakeSummary: targetSourceIntakeSummary.schema ? { ...targetSourceIntakeSummary } : null,
        targetSourceResponse: targetSourceResponse.schema ? { ...targetSourceResponse } : null,
        targetSourceResponseSummary: targetSourceResponseSummary.schema ? { ...targetSourceResponseSummary } : null,
        targetSourceReconciliation: targetSourceReconciliation.schema ? { ...targetSourceReconciliation } : null,
        targetSourceReconciliationSummary: targetSourceReconciliationSummary.schema ? { ...targetSourceReconciliationSummary } : null,
        conservativeSourceBuffer: conservativeSourceBuffer.schema ? { ...conservativeSourceBuffer } : null,
        conservativeSourceBufferSummary: conservativeSourceBufferSummary.schema ? { ...conservativeSourceBufferSummary } : null,
        sourceBufferAcceptance: sourceBufferAcceptanceSummary.schema ? { ...sourceBufferAcceptanceSummary } : null,
        sourceBufferWritebackValidation: sourceBufferWritebackValidationSummary.schema ? { ...sourceBufferWritebackValidationSummary } : null,
        targetBufferReplayValidation: targetBufferReplayValidationSummary.schema ? { ...targetBufferReplayValidationSummary } : null,
        targetBufferMutationAudit: targetBufferMutationAuditSummary.schema ? { ...targetBufferMutationAuditSummary } : null,
        targetBufferWorkerWriteQueue: targetBufferWorkerWriteQueueSummary.schema ? { ...targetBufferWorkerWriteQueueSummary } : null,
        targetBufferWorkerWriteExecution: targetBufferWorkerWriteExecutionSummary.schema ? { ...targetBufferWorkerWriteExecutionSummary } : null,
        targetBufferWorkerWriteVerification: targetBufferWorkerWriteVerificationSummary.schema ? { ...targetBufferWorkerWriteVerificationSummary } : null,
        scientificInvariantGate: scientificInvariantGateSummary.schema ? { ...scientificInvariantGateSummary } : null,
        sourceBufferApplication: reactive.molecularSourceBufferApplication ? { ...reactive.molecularSourceBufferApplication } : null,
        sourceBufferApplicationSummary: reactiveSourceBufferApplicationSummary.schema ? { ...reactiveSourceBufferApplicationSummary } : null,
        molecularAtomCount: finite(md.atomCount),
        molecularBondCount: finite(md.bondCount),
        molecularMeanTemperatureK: finite(md.meanTemperatureK, environment.ambientTemperatureK ?? 294)
      },
      note: 'Typed molecular ClosureResult consumption is carried as an explicit reactive heat-source provenance edge.'
    }),
    makeLink({
      id: 'molecular-closure-to-sph-material-source',
      direction: 'upward',
      sourceLayer: 'molecular',
      sourceSolver: 'molecular-dynamics',
      sourceField: 'heatReleaseProxy',
      sourceValue: sph.molecularClosureHeatReleaseProxy ?? md.heatReleaseProxy,
      driverValue: sph.molecularClosureThermalDrive ?? md.heatReleaseProxy,
      targetLayer: 'mpm',
      targetSolver: 'sph-material',
      targetField: 'molecularClosureRadiativeHeatFluxBoost',
      responseValue: sph.molecularClosureRadiativeHeatFluxBoost,
      responseUnit: 'W/m^2-proxy',
      signalScale: 0.68,
      responseScale: 0.002,
      confidence: sph.molecularClosureApplied === true ? 0.26 : 0.11,
      backend: sph.backend,
      conservation: ['energy', 'phase', 'provenance'],
      adapterContext: {
        applied: sph.molecularClosureApplied === true,
        sourceStateKey: sph.molecularClosureSourceStateKey || null,
        thermalDrive: finite(sph.molecularClosureThermalDrive),
        heatReleaseProxy: finite(sph.molecularClosureHeatReleaseProxy),
        ionizationFraction: finite(sph.molecularClosureIonizationFraction),
        radiativeHeatFluxBoost: finite(sph.molecularClosureRadiativeHeatFluxBoost),
        reactionSourceSchema: sph.molecularReactionSourceSchema || null,
        reactionHeatSourceProxy: finite(sph.molecularReactionHeatSourceProxy),
        reactionSpeciesRateProxy: finite(sph.molecularReactionSpeciesRateProxy),
        reactionSourceDrive: finite(sph.molecularReactionSourceDrive),
        reactionCoolingDrive: finite(sph.molecularReactionCoolingDrive),
        sourceSink: sph.molecularSourceSink ? { ...sph.molecularSourceSink } : null,
        phaseEos: sph.molecularSourceSink?.phaseEos ? { ...sph.molecularSourceSink.phaseEos } : null,
        sourceSinkBalance: sourceSinkBalance.schema ? { ...sourceSinkBalance } : null,
        sourceEquation: sourceEquation.schema ? { ...sourceEquation } : null,
        sourceTransfer: sourceTransfer.schema ? { ...sourceTransfer } : null,
        sourceTransferApplication: sourceTransferApplication.schema ? { ...sourceTransferApplication } : null,
        sourceTransferTargetPreview: sourceTransferTargetPreview.schema ? { ...sourceTransferTargetPreview } : null,
        sourceTransferTargetPreviewSummary: sourceTransferTargetPreviewSummary.schema ? { ...sourceTransferTargetPreviewSummary } : null,
        targetMutatorRegistry: targetMutatorRegistry.schema ? { ...targetMutatorRegistry } : null,
        targetMutatorRegistrySummary: targetMutatorRegistrySummary.schema ? { ...targetMutatorRegistrySummary } : null,
        targetMutationPreflight: targetMutationPreflight.schema ? { ...targetMutationPreflight } : null,
        targetMutationPreflightSummary: targetMutationPreflightSummary.schema ? { ...targetMutationPreflightSummary } : null,
        targetMutationOperationPlan: targetMutationOperationPlan.schema ? { ...targetMutationOperationPlan } : null,
        targetMutationOperationPlanSummary: targetMutationOperationPlanSummary.schema ? { ...targetMutationOperationPlanSummary } : null,
        targetMutationInvariantCheck: targetMutationInvariantCheck.schema ? { ...targetMutationInvariantCheck } : null,
        targetMutationInvariantCheckSummary: targetMutationInvariantCheckSummary.schema ? { ...targetMutationInvariantCheckSummary } : null,
        targetMutationCommit: targetMutationCommit.schema ? { ...targetMutationCommit } : null,
        targetMutationCommitSummary: targetMutationCommitSummary.schema ? { ...targetMutationCommitSummary } : null,
        targetMutationDispatch: targetMutationDispatch.schema ? { ...targetMutationDispatch } : null,
        targetMutationDispatchSummary: targetMutationDispatchSummary.schema ? { ...targetMutationDispatchSummary } : null,
        targetMutationApplyValidation: targetMutationApplyValidation.schema ? { ...targetMutationApplyValidation } : null,
        targetMutationApplyValidationSummary: targetMutationApplyValidationSummary.schema ? { ...targetMutationApplyValidationSummary } : null,
        targetMutationApplyExecution: targetMutationApplyExecution.schema ? { ...targetMutationApplyExecution } : null,
        targetMutationApplyExecutionSummary: targetMutationApplyExecutionSummary.schema ? { ...targetMutationApplyExecutionSummary } : null,
        targetSourceIntake: targetSourceIntake.schema ? { ...targetSourceIntake } : null,
        targetSourceIntakeSummary: targetSourceIntakeSummary.schema ? { ...targetSourceIntakeSummary } : null,
        targetSourceResponse: targetSourceResponse.schema ? { ...targetSourceResponse } : null,
        targetSourceResponseSummary: targetSourceResponseSummary.schema ? { ...targetSourceResponseSummary } : null,
        targetSourceReconciliation: targetSourceReconciliation.schema ? { ...targetSourceReconciliation } : null,
        targetSourceReconciliationSummary: targetSourceReconciliationSummary.schema ? { ...targetSourceReconciliationSummary } : null,
        conservativeSourceBuffer: conservativeSourceBuffer.schema ? { ...conservativeSourceBuffer } : null,
        conservativeSourceBufferSummary: conservativeSourceBufferSummary.schema ? { ...conservativeSourceBufferSummary } : null,
        sourceBufferAcceptance: sourceBufferAcceptanceSummary.schema ? { ...sourceBufferAcceptanceSummary } : null,
        sourceBufferWritebackValidation: sourceBufferWritebackValidationSummary.schema ? { ...sourceBufferWritebackValidationSummary } : null,
        targetBufferReplayValidation: targetBufferReplayValidationSummary.schema ? { ...targetBufferReplayValidationSummary } : null,
        targetBufferMutationAudit: targetBufferMutationAuditSummary.schema ? { ...targetBufferMutationAuditSummary } : null,
        targetBufferWorkerWriteQueue: targetBufferWorkerWriteQueueSummary.schema ? { ...targetBufferWorkerWriteQueueSummary } : null,
        targetBufferWorkerWriteExecution: targetBufferWorkerWriteExecutionSummary.schema ? { ...targetBufferWorkerWriteExecutionSummary } : null,
        targetBufferWorkerWriteVerification: targetBufferWorkerWriteVerificationSummary.schema ? { ...targetBufferWorkerWriteVerificationSummary } : null,
        scientificInvariantGate: scientificInvariantGateSummary.schema ? { ...scientificInvariantGateSummary } : null,
        sourceBufferApplication: sph.molecularSourceBufferApplication ? { ...sph.molecularSourceBufferApplication } : null,
        sourceBufferApplicationSummary: sphSourceBufferApplicationSummary.schema ? { ...sphSourceBufferApplicationSummary } : null,
        molecularMeanTemperatureK: finite(md.meanTemperatureK, environment.ambientTemperatureK ?? 294),
        sphAverageTemperatureK: finite(sph.averageTemperatureK, environment.ambientTemperatureK ?? 294),
        sphVaporFraction: finite(sph.vaporFraction)
      },
      note: 'Typed molecular ClosureResult consumption is carried as an explicit SPH material heat-source provenance edge.'
    }),
    makeLink({
      id: 'reactive-thermal-to-combustion',
      direction: 'upward',
      sourceLayer: 'surface',
      sourceSolver: 'reactive-thermal-cell',
      sourceField: 'temperatureK',
      sourceValue: finite(reactive.temperatureK, surface.flameTemperatureK),
      driverValue: (finite(reactive.temperatureK, surface.flameTemperatureK) - finite(environment.ambientTemperatureK, 294)) / 1600,
      targetLayer: 'surface',
      targetSolver: 'combustion-plume',
      targetField: 'fireAreaFraction',
      responseValue: plume.fireAreaFraction ?? surface.fireIntensity,
      signalScale: 0.72,
      responseScale: 0.46,
      confidence: reactive.backend === 'none' ? 0.13 : 0.23,
      backend: reactive.backend,
      conservation: ['energy', 'species'],
      adapterContext: {
        ambientTemperatureK: finite(environment.ambientTemperatureK, 294),
        ambientPressurePa: finite(environment.ambientPressurePa, 101325),
        oxygenFraction: finite(environment.oxygenFraction, 0.21),
        waterContact: finite(surface.waterContact),
        radiativeHeatFlux: finite(surface.radiativeHeatFlux)
      },
      note: 'Reactive thermal closure feeds fire intensity, flame temperature, and plume ignition.'
    }),
    makeLink({
      id: 'sph-water-to-fire-suppression',
      direction: 'upward',
      sourceLayer: 'mpm',
      sourceSolver: 'sph-material',
      sourceField: 'coolingPotential',
      sourceValue: sph.coolingPotential,
      targetLayer: 'surface',
      targetSolver: 'combustion-plume',
      targetField: 'waterContact',
      responseValue: surface.waterContact,
      signalScale: 0.72,
      responseScale: 0.4,
      confidence: sph.backend === 'none' ? 0.12 : 0.24,
      backend: sph.backend,
      conservation: ['mass', 'energy'],
      adapterContext: {
        waterContact: finite(surface.waterContact),
        fireContactFraction: finite(sph.fireContactFraction),
        hotContactFraction: finite(sph.hotContactFraction),
        vaporFraction: finite(sph.vaporFraction),
        liquidFraction: finite(sph.liquidFraction, mpm.phaseMix?.liquid ?? 1),
        fireIntensity: finite(surface.fireIntensity),
        flameTemperatureK: finite(surface.flameTemperatureK, reactive.temperatureK ?? 294),
        ambientTemperatureK: finite(environment.ambientTemperatureK, 294),
        spillImpulse: finite(balloon.spillImpulse ?? sph.spillImpulse)
      },
      note: 'Water particles raise surface water contact and suppress fire/plume chemistry.'
    }),
    makeLink({
      id: 'membrane-rupture-to-sph-release',
      direction: 'downward',
      sourceLayer: 'surface',
      sourceSolver: 'membrane-shell',
      sourceField: 'ruptureRisk',
      sourceValue: membrane.ruptureRisk,
      targetLayer: 'mpm',
      targetSolver: 'sph-material',
      targetField: 'spillImpulse',
      responseValue: balloon.spillImpulse ?? sph.spillImpulse,
      signalScale: 0.58,
      responseScale: 0.32,
      confidence: membrane.backend === 'none' ? 0.12 : 0.24,
      backend: membrane.backend,
      conservation: ['mass', 'momentum', 'energy'],
      adapterContext: {
        ambientPressurePa: finite(environment.ambientPressurePa, 101325),
        internalPressurePa: finite(balloon.internalPressurePa, 109000),
        membraneIntegrity: finite(balloon.membraneIntegrity, membrane.membraneIntegrity ?? 1),
        heatFluxMean: finite(membrane.heatFluxMean),
        waterMassKg: finite(balloon.waterMassKg, 0.42),
        steamMassKg: finite(balloon.steamMassKg),
        previousSpillImpulse: finite(balloon.spillImpulse ?? sph.spillImpulse),
        ruptured: Boolean(balloon.ruptured || membrane.ruptured)
      },
      note: 'Membrane pressure/damage acts as a boundary condition for released water particles.'
    }),
    makeLink({
      id: 'combustion-plume-to-weather',
      direction: 'upward',
      sourceLayer: 'surface',
      sourceSolver: 'combustion-plume',
      sourceField: 'buoyancyFlux',
      sourceValue: finite(plume.buoyancyFlux),
      driverValue: (finite(plume.buoyancyFlux) * 0.00018) + finite(plume.smokeColumn) * 0.18,
      targetLayer: 'planet',
      targetSolver: 'hydro-atmosphere',
      targetField: 'cloudCover',
      responseValue: hydro.cloudCover ?? planet.cloudCover,
      signalScale: 0.64,
      responseScale: 0.22,
      confidence: plume.backend === 'none' ? 0.11 : 0.22,
      backend: plume.backend,
      conservation: ['energy', 'species'],
      adapterContext: {
        smokeColumn: finite(plume.smokeColumn),
        heatReleaseMean: finite(plume.heatReleaseMean),
        plumeRise: finite(plume.plumeRise),
        cloudCover: finite(hydro.cloudCover ?? planet.cloudCover),
        stormEnergy: finite(hydro.stormEnergy ?? planet.stormEnergy),
        precipitationMean: finite(hydro.precipitationMean ?? planet.precipitation),
        maxWindMps: finite(hydro.maxWindMps),
        waterContact: finite(surface.waterContact),
        ambientPressurePa: finite(environment.ambientPressurePa, 101325),
        ambientTemperatureK: finite(environment.ambientTemperatureK, 294)
      },
      note: 'Smoke and buoyancy are coarse-grained into weather/cloud source terms.'
    }),
    makeLink({
      id: 'radiation-opacity-to-surface-heating',
      direction: 'downward',
      sourceLayer: 'solar',
      sourceSolver: 'radiation-opacity',
      sourceField: 'netHeatingPower',
      sourceValue: finite(radiation.netHeatingPower),
      driverValue: finite(radiation.netHeatingPower) * 0.00008 + finite(radiation.greenhouseFactor) * 0.32,
      targetLayer: 'surface',
      targetSolver: 'reactive-thermal-cell',
      targetField: 'radiativeHeatFlux',
      responseValue: surface.radiativeHeatFlux,
      responseUnit: 'W/m^2-proxy',
      signalScale: 0.42,
      responseScale: 0.003,
      confidence: radiation.backend === 'none' ? 0.12 : 0.23,
      backend: radiation.backend,
      conservation: ['radiation-energy', 'thermal-energy'],
      adapterContext: {
        cellCount: finite(radiation.cellCount, radiation.width && radiation.height ? radiation.width * radiation.height : 128),
        greenhouseFactor: finite(radiation.greenhouseFactor),
        stellarFlux: finite(environment.stellarFlux, 1),
        radiationPressure: finite(solar.radiationPressure, 1),
        waterContact: finite(surface.waterContact),
        ambientTemperatureK: finite(environment.ambientTemperatureK, 294),
        meanMaterialTemperatureK: finite(radiation.meanTemperatureK, environment.ambientTemperatureK ?? 294),
        opticalDepth: finite(radiation.opticalDepth),
        meanOpacity: finite(radiation.meanOpacity)
      },
      note: 'Radiation/opacity tile pushes heat flux into fire, material, and balloon solvers.'
    }),
    makeLink({
      id: 'stellar-fusion-to-radiation-pressure',
      direction: 'upward',
      sourceLayer: 'solar',
      sourceSolver: 'stellar-fusion',
      sourceField: 'luminosityFactor',
      sourceValue: fusion.luminosityFactor ?? environment.stellarFlux,
      targetLayer: 'solar',
      targetSolver: 'radiation-opacity',
      targetField: 'radiationPressure',
      responseValue: solar.radiationPressure,
      signalScale: 0.32,
      responseScale: 0.26,
      confidence: fusion.backend === 'none' ? 0.12 : 0.23,
      backend: fusion.backend,
      conservation: ['energy', 'species'],
      adapterContext: {
        radiationPressure: finite(solar.radiationPressure, 1),
        fusionPowerProxy: finite(fusion.fusionPowerProxy),
        coreTemperatureK: finite(fusion.coreTemperatureK),
        stellarFlux: finite(environment.stellarFlux, 1),
        opticalDepth: finite(radiation.opticalDepth),
        meanOpacity: finite(radiation.meanOpacity),
        greenhouseFactor: finite(radiation.greenhouseFactor)
      },
      note: 'Reduced stellar fusion luminosity drives radiation pressure and planetary forcing.'
    }),
    makeLink({
      id: 'maxwell-field-to-magnetosphere',
      direction: 'downward',
      sourceLayer: 'galactic',
      sourceSolver: 'maxwell-em',
      sourceField: 'fieldEnergy',
      sourceValue: maxwell.fieldEnergy,
      targetLayer: 'solar',
      targetSolver: 'magnetosphere-plasma',
      targetField: 'magneticEnergy',
      responseValue: magnetosphere.magneticEnergy,
      signalScale: 0.55,
      responseScale: 0.00012,
      confidence: maxwell.backend === 'none' ? 0.11 : 0.21,
      backend: maxwell.backend,
      conservation: ['field-energy', 'charge'],
      adapterContext: {
        magneticEnergy: finite(magnetosphere.magneticEnergy),
        poyntingFlux: Array.isArray(maxwell.poyntingFlux) ? [...maxwell.poyntingFlux] : [0, 0, 0],
        solarWindPressure: finite(magnetosphere.solarWindPressure),
        reconnectionRate: finite(magnetosphere.reconnectionRate),
        radiationPressure: finite(solar.radiationPressure, 1),
        stellarFlux: finite(environment.stellarFlux, 1),
        meanIonizationFraction: finite(magnetosphere.meanIonizationFraction)
      },
      note: 'Electromagnetic field telemetry is treated as boundary forcing for plasma/MHD patches.'
    }),
    makeLink({
      id: 'pic-kinetic-to-mhd-feedback',
      direction: 'upward',
      sourceLayer: 'solar',
      sourceSolver: 'pic-plasma-patch',
      sourceField: 'reconnectionHeating',
      sourceValue: pic.reconnectionHeating,
      targetLayer: 'solar',
      targetSolver: 'magnetosphere-plasma',
      targetField: 'reconnectionRate',
      responseValue: magnetosphere.reconnectionRate,
      signalScale: 34,
      responseScale: 0.08,
      confidence: pic.backend === 'none' ? 0.11 : 0.22,
      backend: pic.backend,
      conservation: ['charge', 'field-energy', 'particle-energy'],
      adapterContext: {
        reconnectionRate: finite(magnetosphere.reconnectionRate),
        currentSheetIntensity: finite(magnetosphere.currentSheetIntensity),
        solarWindPressure: finite(magnetosphere.solarWindPressure),
        magneticEnergy: finite(magnetosphere.magneticEnergy),
        currentDensity: finite(pic.currentDensity),
        fieldEnergy: finite(pic.fieldEnergy),
        chargeImbalance: finite(pic.chargeImbalance),
        chargeSeparation: finite(pic.chargeSeparation),
        particleEscapeFraction: finite(pic.particleEscapeFraction),
        divergenceEProxy: finite(pic.divergenceEProxy),
        kineticEnergy: finite(pic.kineticEnergy),
        maxwellFieldEnergy: finite(maxwell.fieldEnergy)
      },
      note: 'PIC patch returns kinetic charge/current/reconnection heating to the MHD proxy.'
    }),
    makeLink({
      id: 'relativity-to-cosmology-galaxy',
      direction: 'upward',
      sourceLayer: 'solar',
      sourceSolver: 'relativistic-correction',
      sourceField: 'lensingDeflectionArcsecProxy',
      sourceValue: relativity.lensingDeflectionArcsecProxy,
      targetLayer: 'supergalactic',
      targetSolver: 'cosmology-expansion',
      targetField: 'filamentEnergy',
      responseValue: cosmology.filamentEnergy ?? expansion.filamentEnergy,
      signalScale: 0.00008,
      responseScale: 0.16,
      confidence: relativity.backend === 'none' ? 0.1 : 0.2,
      backend: relativity.backend,
      conservation: ['energy', 'causal-speed-bound'],
      note: 'Relativistic lensing/redshift telemetry annotates coarse cosmology/galaxy forcing.'
    }),
    makeLink({
      id: 'cosmology-to-galactic-star-formation',
      direction: 'downward',
      sourceLayer: 'supergalactic',
      sourceSolver: 'cosmology-expansion',
      sourceField: 'structureGrowthProxy',
      sourceValue: expansion.structureGrowthProxy ?? cosmology.filamentEnergy,
      targetLayer: 'galactic',
      targetSolver: 'nbody-mhd-star-formation',
      targetField: 'starFormationRate',
      responseValue: galaxy.starFormationRate,
      signalScale: 0.22,
      responseScale: 0.08,
      confidence: expansion.backend === 'none' ? 0.11 : 0.21,
      backend: expansion.backend,
      conservation: ['mass-density-contrast', 'energy'],
      note: 'Large-scale structure growth feeds galactic turbulence and star formation.'
    }),
    makeLink({
      id: 'environment-to-atomic-material',
      direction: 'downward',
      sourceLayer: 'runtime',
      sourceSolver: 'environment-boundary',
      sourceField: 'ambient-oxygen-pressure-temperature',
      sourceValue: finite(environment.oxygenFraction, 0.21) / 0.21
        + finite(environment.ambientPressurePa, 101325) / 101325 * 0.12
        + finite(environment.ambientTemperatureK, 294) / 294 * 0.18,
      targetLayer: 'molecular',
      targetSolver: 'molecular-dynamics/reactive-thermal/sph',
      targetField: 'boundaryConditions',
      responseValue: finite(md.meanTemperatureK, reactive.temperatureK || 294) / 1000
        + finite(surface.fireIntensity) * 0.25,
      signalScale: 0.32,
      responseScale: 0.38,
      confidence: 0.28,
      backend: 'environment',
      conservation: ['open-system-boundary'],
      note: 'User-controlled environment drives atom, chemistry, and material source terms.'
    }),
    makeLink({
      id: 'stellar-environment-to-weather',
      direction: 'downward',
      sourceLayer: 'runtime',
      sourceSolver: 'environment-boundary',
      sourceField: 'stellarFlux-gravity',
      sourceValue: finite(environment.stellarFlux, 1) + finite(environment.gravityMps2, 9.8) / 24,
      targetLayer: 'planet',
      targetSolver: 'hydro-atmosphere',
      targetField: 'oceanHeat-stormEnergy',
      responseValue: finite(planet.oceanHeat) + finite(hydro.stormEnergy, planet.stormEnergy) * 0.4,
      signalScale: 0.25,
      responseScale: 0.28,
      confidence: 0.24,
      backend: 'environment',
      conservation: ['open-system-boundary', 'energy'],
      note: 'Runtime stellar/gravity settings form boundary conditions for weather and climate proxies.'
    })
  ];

  const activeLinks = links.filter((link) => link.status === 'active');
  const strongestLinks = [...activeLinks]
    .sort((a, b) => b.activeScore - a.activeScore)
    .slice(0, 5)
    .map((link) => ({
      id: link.id,
      direction: link.direction,
      sourceLayer: link.source.layer,
      targetLayer: link.target.layer,
      activeScore: link.activeScore,
      sourceField: link.source.field,
      targetField: link.target.field
    }));
  const confidenceMean = links.length > 0
    ? links.reduce((sum, link) => sum + finite(link.uncertainty.confidence), 0) / links.length
    : 0;
  const warningCount = links.filter((link) => link.validity !== 'validated').length;
  const fieldMetadata = createFieldMetadataReport(links.flatMap((link) => [
    link.source.metadata,
    link.target.metadata
  ]));
  const fieldCompatibility = createFieldCompatibilityReport(links.map((link) => ({
    id: link.id,
    sourceMetadata: link.source.metadata,
    targetMetadata: link.target.metadata,
    policy: link.validity === 'validated'
      ? 'strict-physical-dimension-match'
      : 'proxy-adapter-required'
  })));
  const fieldAdapterPlan = createFieldAdapterPlanReport(fieldCompatibility);
  const fieldTransfer = createFieldTransferReport({
    links,
    fieldAdapterPlan
  });

  return {
    schema: MULTISCALE_CROSS_SCALE_COUPLING_SCHEMA,
    mode: 'interactive-proxy',
    status: activeLinks.length >= 5 ? 'coupled' : activeLinks.length > 0 ? 'warming' : 'idle',
    timeSeconds: rounded(timeSeconds, 3),
    activeLayerId,
    linkCount: links.length,
    activeLinkCount: activeLinks.length,
    directionCounts: {
      upward: links.filter((link) => link.direction === 'upward').length,
      downward: links.filter((link) => link.direction === 'downward').length
    },
    activeDirectionCounts: {
      upward: activeLinks.filter((link) => link.direction === 'upward').length,
      downward: activeLinks.filter((link) => link.direction === 'downward').length
    },
    sourceLayerCounts: countBy(activeLinks, (link) => link.source.layer),
    targetLayerCounts: countBy(activeLinks, (link) => link.target.layer),
    strongestLinks,
    upward: summarizeDirection(links, 'upward'),
    downward: summarizeDirection(links, 'downward'),
    links,
    fieldMetadata,
    fieldCompatibility,
    fieldAdapterPlan,
    fieldTransfer,
    exchange: {
      molecularHeatReleaseProxy: rounded(md.heatReleaseProxy ?? molecular.heatReleaseNorm, 4),
      molecularMeanTemperatureK: rounded(md.meanTemperatureK, 2),
      molecularClosureReactiveHeatFluxProxy: rounded(reactive.molecularClosureHeatFluxProxy, 4),
      molecularClosureSphRadiativeHeatFluxBoost: rounded(sph.molecularClosureRadiativeHeatFluxBoost, 4),
      molecularReactionHeatSourceProxy: rounded(molecularReactionHeatSourceProxy, 4),
      molecularReactionSpeciesRateProxy: rounded(molecularReactionSpeciesRateProxy, 4),
      molecularReactionSourceDrive: rounded(molecularReactionSourceDrive, 4),
      molecularReactionCoolingDrive: rounded(molecularReactionCoolingDrive, 4),
      molecularSourceSinkBalanceCoverage: rounded(molecularSourceSinkBalanceCoverage, 4),
      molecularSourceSinkBalanceResidual: rounded(molecularSourceSinkBalanceResidual, 4),
      molecularSourceSinkBalanceHeatResidual: rounded(molecularSourceSinkBalanceHeatResidual, 4),
      molecularSourceSinkBalanceSpeciesResidual: rounded(molecularSourceSinkBalanceSpeciesResidual, 4),
      molecularSourceEquationHeatRateWProxy: rounded(molecularSourceEquationHeatRateWProxy, 6),
      molecularSourceEquationTemperatureRateKps: rounded(molecularSourceEquationTemperatureRateKps, 6),
      molecularSourceEquationSpeciesRateProxy: rounded(molecularSourceEquationSpeciesRateProxy, 6),
      molecularSourceEquationResidualWProxy: rounded(molecularSourceEquationResidualWProxy, 6),
      molecularSourceEquationPhaseEnergyRateWProxy: rounded(molecularSourceEquationPhaseEnergyRateWProxy, 6),
      molecularPhaseEosStabilityResidual: rounded(molecularPhaseEosStabilityResidual, 6),
      molecularPhaseEosSpecificFreeEnergyProxy: rounded(molecularPhaseEosSpecificFreeEnergyProxy, 9),
      molecularSourceTransferAllocationCount: rounded(molecularSourceTransferAllocationCount, 0),
      molecularSourceTransferAllocationFractionTotal: rounded(molecularSourceTransferAllocationFractionTotal, 4),
      molecularSourceTransferAllocatedHeatRateWProxy: rounded(molecularSourceTransferAllocatedHeatRateWProxy, 6),
      molecularSourceTransferAllocatedSpeciesRateProxy: rounded(molecularSourceTransferAllocatedSpeciesRateProxy, 6),
      molecularSourceTransferUnallocatedHeatRateWProxy: rounded(molecularSourceTransferUnallocatedHeatRateWProxy, 6),
      molecularSourceTransferUnallocatedSpeciesRateProxy: rounded(molecularSourceTransferUnallocatedSpeciesRateProxy, 6),
      molecularSourceTransferClosedResidualWProxy: rounded(molecularSourceTransferClosedResidualWProxy, 6),
      molecularSourceTransferApplicationCanApply: rounded(molecularSourceTransferApplicationCanApply, 0),
      molecularSourceTransferApplicationReadyTargetCount: rounded(molecularSourceTransferApplicationReadyTargetCount, 0),
      molecularSourceTransferApplicationBlockedTargetCount: rounded(molecularSourceTransferApplicationBlockedTargetCount, 0),
      molecularSourceTransferApplicationAppliedTargetCount: rounded(molecularSourceTransferApplicationAppliedTargetCount, 0),
      molecularSourceTransferApplicationBlockerCount: rounded(molecularSourceTransferApplicationBlockerCount, 0),
      molecularSourceTransferApplicationClosedResidualWProxy: rounded(molecularSourceTransferApplicationClosedResidualWProxy, 6),
      molecularSourceTransferTargetPreviewCount: rounded(molecularSourceTransferTargetPreviewCount, 0),
      molecularSourceTransferTargetPreviewBlockedTargetCount: rounded(molecularSourceTransferTargetPreviewBlockedTargetCount, 0),
      molecularSourceTransferTargetPreviewAppliedTargetCount: rounded(molecularSourceTransferTargetPreviewAppliedTargetCount, 0),
      molecularSourceTransferTargetPreviewBlockerCount: rounded(molecularSourceTransferTargetPreviewBlockerCount, 0),
      molecularSourceTransferTargetPreviewTotalHeatRateWProxy: rounded(molecularSourceTransferTargetPreviewTotalHeatRateWProxy, 6),
      molecularSourceTransferTargetPreviewTotalSpeciesRateProxy: rounded(molecularSourceTransferTargetPreviewTotalSpeciesRateProxy, 6),
      molecularSourceTransferTargetPreviewMaxDeltaK: rounded(molecularSourceTransferTargetPreviewMaxDeltaK, 6),
      molecularSourceTransferTargetPreviewMaxPhaseDrive: rounded(molecularSourceTransferTargetPreviewMaxPhaseDrive, 6),
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
      molecularTargetMutationPreflightResidualTolerance: rounded(molecularTargetMutationPreflightResidualTolerance, 6),
      molecularTargetMutationPreflightMaxResidualRisk: rounded(molecularTargetMutationPreflightMaxResidualRisk, 6),
      molecularTargetMutationPreflightMaxDeltaK: rounded(molecularTargetMutationPreflightMaxDeltaK, 6),
      molecularTargetMutationOperationPlanTargetCount: rounded(molecularTargetMutationOperationPlanTargetCount, 0),
      molecularTargetMutationOperationPlanOperationCount: rounded(molecularTargetMutationOperationPlanOperationCount, 0),
      molecularTargetMutationOperationPlanAllowedCount: rounded(molecularTargetMutationOperationPlanAllowedCount, 0),
      molecularTargetMutationOperationPlanBlockedCount: rounded(molecularTargetMutationOperationPlanBlockedCount, 0),
      molecularTargetMutationOperationPlanBlockerCount: rounded(molecularTargetMutationOperationPlanBlockerCount, 0),
      molecularTargetMutationOperationPlanMaxDelta: rounded(molecularTargetMutationOperationPlanMaxDelta, 6),
      molecularTargetMutationOperationPlanMaxDeltaK: rounded(molecularTargetMutationOperationPlanMaxDeltaK, 6),
      molecularTargetMutationInvariantCheckTargetCount: rounded(molecularTargetMutationInvariantCheckTargetCount, 0),
      molecularTargetMutationInvariantCheckPassedCount: rounded(molecularTargetMutationInvariantCheckPassedCount, 0),
      molecularTargetMutationInvariantCheckBlockedCount: rounded(molecularTargetMutationInvariantCheckBlockedCount, 0),
      molecularTargetMutationInvariantCheckCoveredScopeCount: rounded(molecularTargetMutationInvariantCheckCoveredScopeCount, 0),
      molecularTargetMutationInvariantCheckMissingScopeCount: rounded(molecularTargetMutationInvariantCheckMissingScopeCount, 0),
      molecularTargetMutationInvariantCheckResidualPassCount: rounded(molecularTargetMutationInvariantCheckResidualPassCount, 0),
      molecularTargetMutationInvariantCheckBlockerCount: rounded(molecularTargetMutationInvariantCheckBlockerCount, 0),
      molecularTargetMutationInvariantCheckMaxResidual: rounded(molecularTargetMutationInvariantCheckMaxResidual, 6),
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
      molecularTargetMutationApplyValidationMaxResidual: rounded(molecularTargetMutationApplyValidationMaxResidual, 12),
      molecularTargetMutationApplyValidationBlockerCount: rounded(molecularTargetMutationApplyValidationBlockerCount, 0),
      molecularTargetMutationApplyExecutionTargetCount: rounded(molecularTargetMutationApplyExecutionTargetCount, 0),
      molecularTargetMutationApplyExecutionAppliedTargetCount: rounded(molecularTargetMutationApplyExecutionAppliedTargetCount, 0),
      molecularTargetMutationApplyExecutionOperationCount: rounded(molecularTargetMutationApplyExecutionOperationCount, 0),
      molecularTargetMutationApplyExecutionAppliedOperationCount: rounded(molecularTargetMutationApplyExecutionAppliedOperationCount, 0),
      molecularTargetMutationApplyExecutionStateWriteSetCount: rounded(molecularTargetMutationApplyExecutionStateWriteSetCount, 0),
      molecularTargetMutationApplyExecutionMaxResidual: rounded(molecularTargetMutationApplyExecutionMaxResidual, 12),
      molecularTargetMutationApplyExecutionBlockerCount: rounded(molecularTargetMutationApplyExecutionBlockerCount, 0),
      molecularTargetSourceIntakeActiveCount: rounded(molecularTargetSourceIntakeActiveCount, 0),
      molecularTargetSourceIntakeAppliedOperationCount: rounded(molecularTargetSourceIntakeAppliedOperationCount, 0),
      molecularTargetSourceIntakeHeatRateWProxy: rounded(molecularTargetSourceIntakeHeatRateWProxy, 12),
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
      molecularSourceSinkEnergyResidual: rounded(Math.max(
        finite(reactive.molecularSourceSink?.energyResidualProxy),
        finite(sph.molecularSourceSink?.energyResidualProxy)
      ), 4),
      reactiveTemperatureK: rounded(reactive.temperatureK ?? surface.flameTemperatureK, 2),
      reactiveHeatReleaseNorm: rounded(reactive.heatReleaseNorm, 4),
      surfaceFireIntensity: rounded(surface.fireIntensity, 4),
      surfaceWaterContact: rounded(surface.waterContact, 4),
      sphCoolingPotential: rounded(sph.coolingPotential, 4),
      sphVaporFraction: rounded(sph.vaporFraction, 4),
      combustionFireArea: rounded(plume.fireAreaFraction, 4),
      combustionSmokeColumn: rounded(plume.smokeColumn, 4),
      hydroCloudCover: rounded(hydro.cloudCover ?? planet.cloudCover, 4),
      radiationHeatFlux: rounded(surface.radiativeHeatFlux, 4),
      stellarLuminosityFactor: rounded(fusion.luminosityFactor ?? environment.stellarFlux, 4),
      magnetosphereReconnectionRate: rounded(magnetosphere.reconnectionRate, 4),
      picReconnectionHeating: expRounded(pic.reconnectionHeating, 4),
      cosmologyStructureGrowth: expRounded(expansion.structureGrowthProxy, 4)
    },
    environment: {
      ambientTemperatureK: rounded(environment.ambientTemperatureK ?? 294, 2),
      ambientPressurePa: rounded(environment.ambientPressurePa ?? 101325, 1),
      oxygenFraction: rounded(environment.oxygenFraction ?? 0.21, 4),
      gravityMps2: rounded(environment.gravityMps2 ?? 9.8, 4),
      stellarFlux: rounded(environment.stellarFlux ?? 1, 4)
    },
    refinementRequests: Array.isArray(refinementRequests) ? [...refinementRequests] : [],
    validity: {
      status: 'interactive-proxy',
      warningCount,
      warnings: [
        'Coupling links are runtime telemetry over reduced proxy solvers, not validated multiphysics transfer operators.',
        'Use activeScore and confidence to route future validation/refinement work, not as scientific error bars.'
      ]
    },
    uncertainty: {
      mode: 'heuristic-reduced-coupling',
      confidenceMean: rounded(confidenceMean, 3)
    },
    provenance: {
      source: 'demos/multiscale/src/simulation/crossScaleCoupling.js',
      generatedFrom: 'MultiscaleModel.state'
    }
  };
}
