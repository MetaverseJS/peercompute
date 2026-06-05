import { MULTISCALE_SOLVER_DESCRIPTORS } from '../compute/solverWorkerDescriptors.js';

export const MULTISCALE_FIELD_METADATA_SCHEMA = 'peercompute.multiscale.field-metadata.v0';
export const MULTISCALE_FIELD_METADATA_REPORT_SCHEMA = 'peercompute.multiscale.field-metadata-report.v0';
export const MULTISCALE_FIELD_COMPATIBILITY_SCHEMA = 'peercompute.multiscale.field-compatibility.v0';
export const MULTISCALE_FIELD_COMPATIBILITY_REPORT_SCHEMA = 'peercompute.multiscale.field-compatibility-report.v0';
export const MULTISCALE_FIELD_ADAPTER_SCHEMA = 'peercompute.multiscale.field-adapter.v0';
export const MULTISCALE_FIELD_ADAPTER_PLAN_SCHEMA = 'peercompute.multiscale.field-adapter-plan.v0';
export const MULTISCALE_FIELD_TRANSFER_SCHEMA = 'peercompute.multiscale.field-transfer.v0';
export const MULTISCALE_FIELD_TRANSFER_REPORT_SCHEMA = 'peercompute.multiscale.field-transfer-report.v0';

const UNKNOWN_FIELD = {
  unit: 'unknown',
  dimensions: 'unknown',
  location: 'unknown',
  quantity: 'unknown',
  unitStatus: 'unknown',
  confidence: 0
};

const FIELD_OVERRIDES = new Map([
  ['conservation-audit:massRelativeError', { unit: '1', dimensions: '1', quantity: 'relative mass residual', unitStatus: 'dimensionless', location: 'report', confidence: 0.72 }],
  ['conservation-audit:energyResidualProxy', { unit: '1', dimensions: '1', quantity: 'reduced energy residual', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.42 }],
  ['conservation-audit:speciesResidualProxy', { unit: '1', dimensions: '1', quantity: 'reduced species residual', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.42 }],
  ['environment-boundary:ambient-oxygen-pressure-temperature', { unit: 'mixed', dimensions: 'mixed', quantity: 'runtime environment boundary vector', unitStatus: 'mixed', location: 'boundary', confidence: 0.48 }],
  ['environment-boundary:stellarFlux-gravity', { unit: 'mixed', dimensions: 'mixed', quantity: 'stellar flux and gravity boundary vector', unitStatus: 'mixed', location: 'boundary', confidence: 0.48 }],
  ['molecular-dynamics:meanTemperatureK', { unit: 'K', dimensions: 'Theta', quantity: 'mean molecular temperature', unitStatus: 'physical', location: 'region', confidence: 0.45 }],
  ['molecular-dynamics:heatReleaseProxy', { unit: '1', dimensions: '1', quantity: 'normalized molecular heat release', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.4 }],
  ['molecular-dynamics:bondCount', { unit: 'bonds', dimensions: '1', quantity: 'bond count', unitStatus: 'count', location: 'region', confidence: 0.4 }],
  ['molecular-source-sink:energyResidualProxy', { unit: '1', dimensions: '1', quantity: 'molecular source/sink energy residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.32 }],
  ['molecular-source-sink:speciesResidualProxy', { unit: '1', dimensions: '1', quantity: 'molecular source/sink species residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.32 }],
  ['molecular-source-sink:reactionHeatSourceProxy', { unit: '1', dimensions: '1', quantity: 'event-derived molecular reaction heat source proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.3 }],
  ['molecular-source-sink:reactionSpeciesRateProxy', { unit: 'count/s-proxy', dimensions: 'T^-1', quantity: 'event-derived molecular species rate proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.3 }],
  ['molecular-source-sink:reactionSourceDrive', { unit: '1', dimensions: '1', quantity: 'reduced molecular reaction source drive', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.3 }],
  ['molecular-source-sink:reactionCoolingDrive', { unit: '1', dimensions: '1', quantity: 'reduced molecular reaction cooling drive', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.3 }],
  ['molecular-source-sink:phaseDriveProxy', { unit: '1', dimensions: '1', quantity: 'reduced molecular phase-change drive', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.28 }],
  ['molecular-source-sink:latentHeatSinkProxy', { unit: '1', dimensions: '1', quantity: 'reduced molecular latent heat sink proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.26 }],
  ['molecular-source-sink:latentHeatReleaseProxy', { unit: '1', dimensions: '1', quantity: 'reduced molecular latent heat release proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.26 }],
  ['molecular-phase-eos-basis:specificFreeEnergyProxy', { unit: 'J/kg-proxy', dimensions: 'L^2 T^-2', quantity: 'reduced molecular specific free energy proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.24 }],
  ['molecular-phase-eos-basis:specificEnthalpyProxy', { unit: 'J/kg-proxy', dimensions: 'L^2 T^-2', quantity: 'reduced molecular specific enthalpy proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.25 }],
  ['molecular-phase-eos-basis:phaseEnergyRateProxy', { unit: 'W-proxy', dimensions: 'M L^2 T^-3', quantity: 'reduced molecular phase energy-rate proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.24 }],
  ['molecular-phase-eos-basis:phaseStabilityResidualProxy', { unit: '1', dimensions: '1', quantity: 'reduced molecular phase stability residual', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.24 }],
  ['molecular-phase-eos-basis:latentHeatBudgetProxy', { unit: '1', dimensions: '1', quantity: 'reduced molecular latent heat budget proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.24 }],
  ['molecular-source-sink-balance:sourceDriveCoverage', { unit: '1', dimensions: '1', quantity: 'molecular source fanout coverage fraction', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.3 }],
  ['molecular-source-sink-balance:coolingDriveCoverage', { unit: '1', dimensions: '1', quantity: 'molecular cooling sink fanout coverage fraction', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.3 }],
  ['molecular-source-sink-balance:balanceResidualProxy', { unit: '1', dimensions: '1', quantity: 'molecular source/sink balance residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.3 }],
  ['molecular-source-sink-balance:heatProxyResidual', { unit: '1', dimensions: '1', quantity: 'molecular heat source balance residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.3 }],
  ['molecular-source-sink-balance:speciesRateResidualProxy', { unit: 'count/s-proxy', dimensions: 'T^-1', quantity: 'molecular species-rate balance residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.3 }],
  ['molecular-source-sink-balance:fanoutOversubscriptionProxy', { unit: '1', dimensions: '1', quantity: 'molecular source fanout oversubscription proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.28 }],
  ['molecular-source-equation:sourceRateWProxy', { unit: 'W-proxy', dimensions: 'M L^2 T^-3', quantity: 'molecular source equation heat rate proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.3 }],
  ['molecular-source-equation:temperatureRateKPerSProxy', { unit: 'K/s-proxy', dimensions: 'Theta T^-1', quantity: 'molecular source equation temperature-rate proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.3 }],
  ['molecular-source-equation:sourceRateCountPerSProxy', { unit: 'count/s-proxy', dimensions: 'T^-1', quantity: 'molecular source equation species-rate proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.3 }],
  ['molecular-source-equation:openSystemResidualRateWProxy', { unit: 'W-proxy', dimensions: 'M L^2 T^-3', quantity: 'molecular source equation open-system residual heat-rate proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.28 }],
  ['molecular-source-equation:phaseEnergyRateWProxy', { unit: 'W-proxy', dimensions: 'M L^2 T^-3', quantity: 'molecular source equation phase energy-rate proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.26 }],
  ['molecular-conservative-transfer:allocationCount', { unit: '1', dimensions: '1', quantity: 'molecular dry-run transfer allocation count', unitStatus: 'dimensionless', location: 'report', confidence: 0.32 }],
  ['molecular-conservative-transfer:allocationFractionTotal', { unit: '1', dimensions: '1', quantity: 'molecular dry-run transfer allocation fraction total', unitStatus: 'dimensionless', location: 'report', confidence: 0.32 }],
  ['molecular-conservative-transfer:allocatedHeatRateWProxy', { unit: 'W-proxy', dimensions: 'M L^2 T^-3', quantity: 'allocated molecular transfer heat rate proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.3 }],
  ['molecular-conservative-transfer:allocatedSpeciesRateCountPerSProxy', { unit: 'count/s-proxy', dimensions: 'T^-1', quantity: 'allocated molecular transfer species-rate proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.3 }],
  ['molecular-conservative-transfer:unallocatedHeatRateWProxy', { unit: 'W-proxy', dimensions: 'M L^2 T^-3', quantity: 'unallocated molecular transfer heat-rate proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.28 }],
  ['molecular-conservative-transfer:unallocatedSpeciesRateCountPerSProxy', { unit: 'count/s-proxy', dimensions: 'T^-1', quantity: 'unallocated molecular transfer species-rate proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.28 }],
  ['molecular-conservative-transfer:closedSystemResidualProxy', { unit: 'W-proxy', dimensions: 'M L^2 T^-3', quantity: 'molecular dry-run transfer closed-system residual proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.26 }],
  ['molecular-transfer-application:canApply', { unit: '1', dimensions: '1', quantity: 'molecular transfer application readiness flag', unitStatus: 'dimensionless', location: 'report', confidence: 0.3 }],
  ['molecular-transfer-application:readyTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular transfer application ready target count', unitStatus: 'count', location: 'report', confidence: 0.3 }],
  ['molecular-transfer-application:blockedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular transfer application blocked target count', unitStatus: 'count', location: 'report', confidence: 0.3 }],
  ['molecular-transfer-application:appliedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular transfer application applied target count', unitStatus: 'count', location: 'report', confidence: 0.3 }],
  ['molecular-transfer-application:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular transfer application blocker count', unitStatus: 'count', location: 'report', confidence: 0.3 }],
  ['molecular-transfer-application:closedSystemResidualProxy', { unit: 'W-proxy', dimensions: 'M L^2 T^-3', quantity: 'molecular transfer application closed residual proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.26 }],
  ['molecular-target-mutator-preview:previewTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target-mutator preview target count', unitStatus: 'count', location: 'report', confidence: 0.28 }],
  ['molecular-target-mutator-preview:blockedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target-mutator preview blocked target count', unitStatus: 'count', location: 'report', confidence: 0.28 }],
  ['molecular-target-mutator-preview:appliedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target-mutator preview applied target count', unitStatus: 'count', location: 'report', confidence: 0.28 }],
  ['molecular-target-mutator-preview:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular target-mutator preview blocker count', unitStatus: 'count', location: 'report', confidence: 0.28 }],
  ['molecular-target-mutator-preview:totalHeatRateWProxy', { unit: 'W-proxy', dimensions: 'M L^2 T^-3', quantity: 'molecular target-mutator preview total heat-rate proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.26 }],
  ['molecular-target-mutator-preview:totalSpeciesRateCountPerSProxy', { unit: 'count/s-proxy', dimensions: 'T^-1', quantity: 'molecular target-mutator preview total species-rate proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.26 }],
  ['molecular-target-mutator-preview:maxAbsTemperatureDeltaKProxy', { unit: 'K-proxy', dimensions: 'Theta', quantity: 'molecular target-mutator preview maximum absolute temperature delta proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.24 }],
  ['molecular-target-mutator-preview:maxPhaseDriveDeltaProxy', { unit: '1', dimensions: '1', quantity: 'molecular target-mutator preview maximum phase-drive delta proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.24 }],
  ['molecular-target-mutator-registry:targetCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutator registry target count', unitStatus: 'count', location: 'report', confidence: 0.26 }],
  ['molecular-target-mutator-registry:registeredMutatorCount', { unit: '1', dimensions: '1', quantity: 'registered molecular target mutator count', unitStatus: 'count', location: 'report', confidence: 0.26 }],
  ['molecular-target-mutator-registry:validatedMutatorCount', { unit: '1', dimensions: '1', quantity: 'validated molecular target mutator count', unitStatus: 'count', location: 'report', confidence: 0.24 }],
  ['molecular-target-mutator-registry:blockedMutatorCount', { unit: '1', dimensions: '1', quantity: 'blocked molecular target mutator count', unitStatus: 'count', location: 'report', confidence: 0.24 }],
  ['molecular-target-mutator-registry:declaredFieldCount', { unit: '1', dimensions: '1', quantity: 'declared molecular target mutator field count', unitStatus: 'count', location: 'report', confidence: 0.24 }],
  ['molecular-target-mutator-registry:invariantScopeCount', { unit: '1', dimensions: '1', quantity: 'declared molecular target mutator invariant scope count', unitStatus: 'count', location: 'report', confidence: 0.24 }],
  ['molecular-target-mutator-registry:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutator registry blocker count', unitStatus: 'count', location: 'report', confidence: 0.24 }],
  ['molecular-target-mutation-preflight:targetCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation preflight target count', unitStatus: 'count', location: 'report', confidence: 0.24 }],
  ['molecular-target-mutation-preflight:passedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation preflight passed target count', unitStatus: 'count', location: 'report', confidence: 0.22 }],
  ['molecular-target-mutation-preflight:blockedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation preflight blocked target count', unitStatus: 'count', location: 'report', confidence: 0.22 }],
  ['molecular-target-mutation-preflight:residualBudgetPassCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation preflight residual budget pass count', unitStatus: 'count', location: 'report', confidence: 0.22 }],
  ['molecular-target-mutation-preflight:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation preflight blocker count', unitStatus: 'count', location: 'report', confidence: 0.22 }],
  ['molecular-target-mutation-preflight:residualToleranceProxy', { unit: '1', dimensions: '1', quantity: 'molecular target mutation preflight residual tolerance proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.2 }],
  ['molecular-target-mutation-preflight:maxResidualRiskProxy', { unit: '1', dimensions: '1', quantity: 'molecular target mutation preflight maximum residual risk proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.2 }],
  ['molecular-target-mutation-preflight:maxAbsTemperatureDeltaKProxy', { unit: 'K-proxy', dimensions: 'Theta', quantity: 'molecular target mutation preflight maximum absolute temperature delta proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.2 }],
  ['molecular-target-mutation-operation-plan:targetCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation operation-plan target count', unitStatus: 'count', location: 'report', confidence: 0.22 }],
  ['molecular-target-mutation-operation-plan:operationCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation operation count', unitStatus: 'count', location: 'report', confidence: 0.22 }],
  ['molecular-target-mutation-operation-plan:allowedByRegistryOperationCount', { unit: '1', dimensions: '1', quantity: 'registry-allowed molecular target mutation operation count', unitStatus: 'count', location: 'report', confidence: 0.22 }],
  ['molecular-target-mutation-operation-plan:blockedOperationCount', { unit: '1', dimensions: '1', quantity: 'blocked molecular target mutation operation count', unitStatus: 'count', location: 'report', confidence: 0.22 }],
  ['molecular-target-mutation-operation-plan:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation operation-plan blocker count', unitStatus: 'count', location: 'report', confidence: 0.2 }],
  ['molecular-target-mutation-operation-plan:maxAbsFieldDeltaProxy', { unit: 'mixed-proxy', dimensions: 'mixed', quantity: 'maximum molecular target operation field delta proxy', unitStatus: 'mixed-proxy', location: 'report', confidence: 0.18 }],
  ['molecular-target-mutation-operation-plan:maxAbsTemperatureDeltaKProxy', { unit: 'K-proxy', dimensions: 'Theta', quantity: 'maximum molecular target operation temperature delta proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.2 }],
  ['molecular-target-mutation-invariant-check:targetCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation invariant-check target count', unitStatus: 'count', location: 'report', confidence: 0.2 }],
  ['molecular-target-mutation-invariant-check:passedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation invariant-check passed target count', unitStatus: 'count', location: 'report', confidence: 0.2 }],
  ['molecular-target-mutation-invariant-check:blockedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation invariant-check blocked target count', unitStatus: 'count', location: 'report', confidence: 0.2 }],
  ['molecular-target-mutation-invariant-check:coveredInvariantScopeCount', { unit: '1', dimensions: '1', quantity: 'covered molecular target mutation invariant scope count', unitStatus: 'count', location: 'report', confidence: 0.2 }],
  ['molecular-target-mutation-invariant-check:missingInvariantScopeCount', { unit: '1', dimensions: '1', quantity: 'missing molecular target mutation invariant scope count', unitStatus: 'count', location: 'report', confidence: 0.18 }],
  ['molecular-target-mutation-invariant-check:residualBudgetPassCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation invariant residual budget pass count', unitStatus: 'count', location: 'report', confidence: 0.18 }],
  ['molecular-target-mutation-invariant-check:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation invariant-check blocker count', unitStatus: 'count', location: 'report', confidence: 0.18 }],
  ['molecular-target-mutation-invariant-check:maxResidualProxy', { unit: '1', dimensions: '1', quantity: 'molecular target mutation invariant-check max residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.18 }],
  ['molecular-target-mutation-commit:targetCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation commit target count', unitStatus: 'count', location: 'report', confidence: 0.18 }],
  ['molecular-target-mutation-commit:invariantEligibleTargetCount', { unit: '1', dimensions: '1', quantity: 'invariant-eligible molecular target mutation commit target count', unitStatus: 'count', location: 'report', confidence: 0.18 }],
  ['molecular-target-mutation-commit:committableTargetCount', { unit: '1', dimensions: '1', quantity: 'committable molecular target mutation target count', unitStatus: 'count', location: 'report', confidence: 0.16 }],
  ['molecular-target-mutation-commit:blockedTargetCount', { unit: '1', dimensions: '1', quantity: 'blocked molecular target mutation commit target count', unitStatus: 'count', location: 'report', confidence: 0.16 }],
  ['molecular-target-mutation-commit:plannedOperationCount', { unit: '1', dimensions: '1', quantity: 'planned molecular target mutation commit operation count', unitStatus: 'count', location: 'report', confidence: 0.16 }],
  ['molecular-target-mutation-commit:committedOperationCount', { unit: '1', dimensions: '1', quantity: 'committed molecular target mutation operation count', unitStatus: 'count', location: 'report', confidence: 0.14 }],
  ['molecular-target-mutation-commit:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation commit blocker count', unitStatus: 'count', location: 'report', confidence: 0.14 }],
  ['molecular-target-mutation-dispatch:batchCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation dispatch batch count', unitStatus: 'count', location: 'report', confidence: 0.16 }],
  ['molecular-target-mutation-dispatch:invariantEligibleBatchCount', { unit: '1', dimensions: '1', quantity: 'invariant-eligible molecular target dispatch batch count', unitStatus: 'count', location: 'report', confidence: 0.16 }],
  ['molecular-target-mutation-dispatch:dispatchableBatchCount', { unit: '1', dimensions: '1', quantity: 'dispatchable molecular target mutation batch count', unitStatus: 'count', location: 'report', confidence: 0.15 }],
  ['molecular-target-mutation-dispatch:blockedBatchCount', { unit: '1', dimensions: '1', quantity: 'blocked molecular target mutation dispatch batch count', unitStatus: 'count', location: 'report', confidence: 0.15 }],
  ['molecular-target-mutation-dispatch:operationCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation dispatch operation count', unitStatus: 'count', location: 'report', confidence: 0.15 }],
  ['molecular-target-mutation-dispatch:dispatchedOperationCount', { unit: '1', dimensions: '1', quantity: 'dispatched molecular target mutation operation count', unitStatus: 'count', location: 'report', confidence: 0.13 }],
  ['molecular-target-mutation-dispatch:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation dispatch blocker count', unitStatus: 'count', location: 'report', confidence: 0.13 }],
  ['molecular-target-mutation-apply-validation:targetCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation apply-validation target count', unitStatus: 'count', location: 'report', confidence: 0.16 }],
  ['molecular-target-mutation-apply-validation:validatedTargetCount', { unit: '1', dimensions: '1', quantity: 'validated molecular target apply-preview target count', unitStatus: 'count', location: 'report', confidence: 0.16 }],
  ['molecular-target-mutation-apply-validation:applyReadyTargetCount', { unit: '1', dimensions: '1', quantity: 'apply-ready molecular target mutation target count', unitStatus: 'count', location: 'report', confidence: 0.14 }],
  ['molecular-target-mutation-apply-validation:blockedTargetCount', { unit: '1', dimensions: '1', quantity: 'blocked molecular target mutation apply-validation target count', unitStatus: 'count', location: 'report', confidence: 0.14 }],
  ['molecular-target-mutation-apply-validation:operationCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation apply-validation operation count', unitStatus: 'count', location: 'report', confidence: 0.14 }],
  ['molecular-target-mutation-apply-validation:appliedOperationCount', { unit: '1', dimensions: '1', quantity: 'applied molecular target mutation operation count', unitStatus: 'count', location: 'report', confidence: 0.12 }],
  ['molecular-target-mutation-apply-validation:stateWriteSetCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation state write-set field count', unitStatus: 'count', location: 'report', confidence: 0.13 }],
  ['molecular-target-mutation-apply-validation:maxBeforeAfterResidualProxy', { unit: '1', dimensions: '1', quantity: 'maximum molecular target mutation before-after residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.12 }],
  ['molecular-target-mutation-apply-validation:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation apply-validation blocker count', unitStatus: 'count', location: 'report', confidence: 0.12 }],
  ['molecular-target-mutation-apply-execution:targetCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation apply-execution target count', unitStatus: 'count', location: 'report', confidence: 0.13 }],
  ['molecular-target-mutation-apply-execution:appliedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation apply-execution applied target count', unitStatus: 'count', location: 'report', confidence: 0.12 }],
  ['molecular-target-mutation-apply-execution:operationCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation apply-execution operation count', unitStatus: 'count', location: 'report', confidence: 0.13 }],
  ['molecular-target-mutation-apply-execution:appliedOperationCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation apply-execution applied operation count', unitStatus: 'count', location: 'report', confidence: 0.12 }],
  ['molecular-target-mutation-apply-execution:stateWriteSetCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation apply-execution state write-set field count', unitStatus: 'count', location: 'report', confidence: 0.12 }],
  ['molecular-target-mutation-apply-execution:maxBeforeAfterResidualProxy', { unit: '1', dimensions: '1', quantity: 'maximum molecular target mutation apply-execution before-after residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.11 }],
  ['molecular-target-mutation-apply-execution:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular target mutation apply-execution blocker count', unitStatus: 'count', location: 'report', confidence: 0.11 }],
  ['molecular-target-source-intake:activeTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target-source intake active target count', unitStatus: 'count', location: 'report', confidence: 0.12 }],
  ['molecular-target-source-intake:appliedOperationCount', { unit: '1', dimensions: '1', quantity: 'molecular target-source intake applied operation count', unitStatus: 'count', location: 'report', confidence: 0.12 }],
  ['molecular-target-source-intake:totalHeatRateWProxy', { unit: 'W-proxy', dimensions: 'M L^2 T^-3', quantity: 'molecular target-source intake total heat-rate proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.11 }],
  ['molecular-target-source-intake:maxThermalDrive', { unit: '1', dimensions: '1', quantity: 'molecular target-source intake max thermal drive', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.11 }],
  ['molecular-target-source-response:activeTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target-source response active target count', unitStatus: 'count', location: 'report', confidence: 0.11 }],
  ['molecular-target-source-response:respondedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target-source response acknowledged target count', unitStatus: 'count', location: 'report', confidence: 0.11 }],
  ['molecular-target-source-response:pendingTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target-source response pending target count', unitStatus: 'count', location: 'report', confidence: 0.11 }],
  ['molecular-target-source-response:totalResponseThermalDrive', { unit: '1', dimensions: '1', quantity: 'molecular target-source response total thermal drive', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-target-source-response:totalHeatFluxResponseProxy', { unit: 'W/m^2-proxy', dimensions: 'M T^-3', quantity: 'molecular target-source response total heat-flux proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-target-source-response:maxTemperatureK', { unit: 'K', dimensions: 'Theta', quantity: 'molecular target-source response maximum target temperature', unitStatus: 'physical', location: 'report', confidence: 0.12 }],
  ['molecular-target-source-response:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular target-source response blocker count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-source-reconciliation:activeTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target-source reconciliation active target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-source-reconciliation:reconciledTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target-source reconciliation reconciled target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-source-reconciliation:pendingTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target-source reconciliation pending target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-source-reconciliation:sequenceMismatchCount', { unit: '1', dimensions: '1', quantity: 'molecular target-source reconciliation sequence mismatch count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-source-reconciliation:reconciliationResidualProxy', { unit: '1', dimensions: '1', quantity: 'molecular target-source reconciliation residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-target-source-reconciliation:unacknowledgedThermalDrive', { unit: '1', dimensions: '1', quantity: 'molecular target-source reconciliation unacknowledged thermal drive', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-target-source-reconciliation:totalHeatRateWProxy', { unit: 'W-proxy', dimensions: 'M L^2 T^-3', quantity: 'molecular target-source reconciliation total intake heat-rate proxy', unitStatus: 'scaled-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-target-source-reconciliation:totalHeatFluxResponseProxy', { unit: 'W/m^2-proxy', dimensions: 'M T^-3', quantity: 'molecular target-source reconciliation total response heat-flux proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-target-source-reconciliation:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular target-source reconciliation blocker count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-conservative-source-buffer:activeTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer active target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-conservative-source-buffer:dispatchableTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer dispatchable target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-conservative-source-buffer:reconciledTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer reconciled target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-conservative-source-buffer:pendingTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer pending target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-conservative-source-buffer:sourceTermCount', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer source term count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-conservative-source-buffer:bufferStrideFloats', { unit: 'float32', dimensions: '1', quantity: 'molecular source-buffer vector stride', unitStatus: 'layout', location: 'buffer', confidence: 0.1 }],
  ['molecular-conservative-source-buffer:totalHeatRateWProxy', { unit: 'W-proxy', dimensions: 'M L^2 T^-3', quantity: 'molecular source-buffer total heat-rate proxy', unitStatus: 'scaled-proxy', location: 'buffer', confidence: 0.1 }],
  ['molecular-conservative-source-buffer:totalSpeciesRateCountPerSProxy', { unit: 'count/s-proxy', dimensions: 'T^-1', quantity: 'molecular source-buffer total species-rate proxy', unitStatus: 'scaled-proxy', location: 'buffer', confidence: 0.1 }],
  ['molecular-conservative-source-buffer:sourceBufferResidualProxy', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer conservation residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-conservative-source-buffer:unacknowledgedThermalDrive', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer unacknowledged thermal drive', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-source-buffer-acceptance:canMutateProxy', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer reduced mutation acceptance flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-source-buffer-acceptance:acceptedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer accepted target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-source-buffer-acceptance:blockedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer blocked target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-source-buffer-acceptance:maxApplicationResidualProxy', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer acceptance residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-source-buffer-acceptance:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer acceptance blocker count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-source-buffer-writeback-validation:canWritebackProxy', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer reduced writeback validation flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-source-buffer-writeback-validation:validatedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer writeback validated target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-source-buffer-writeback-validation:blockedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer writeback blocked target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-source-buffer-writeback-validation:maxWritebackResidualProxy', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer writeback residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-source-buffer-writeback-validation:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular source-buffer writeback blocker count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-replay-validation:canReplayProxy', { unit: '1', dimensions: '1', quantity: 'molecular target-buffer reduced replay validation flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-replay-validation:replayedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target-buffer replay validated target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-replay-validation:blockedTargetCount', { unit: '1', dimensions: '1', quantity: 'molecular target-buffer replay blocked target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-replay-validation:replayedFieldCount', { unit: '1', dimensions: '1', quantity: 'molecular target-buffer replay matched field count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-replay-validation:missingFieldCount', { unit: '1', dimensions: '1', quantity: 'molecular target-buffer replay missing field count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-replay-validation:maxReplayResidualProxy', { unit: '1', dimensions: '1', quantity: 'molecular target-buffer replay residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-replay-validation:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular target-buffer replay blocker count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-mutation-audit:canMutateProxy', { unit: '1', dimensions: '1', quantity: 'molecular target-buffer reduced mutation readiness flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-mutation-audit:canQueueWorkerWrite', { unit: '1', dimensions: '1', quantity: 'molecular target-buffer worker-write queue readiness flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-mutation-audit:scientificMutationReady', { unit: '1', dimensions: '1', quantity: 'scientific mutation readiness flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.06 }],
  ['molecular-target-buffer-mutation-audit:readyTargetCount', { unit: '1', dimensions: '1', quantity: 'mutation-audit ready target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-mutation-audit:blockedTargetCount', { unit: '1', dimensions: '1', quantity: 'mutation-audit blocked target count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-mutation-audit:writeIntentCount', { unit: '1', dimensions: '1', quantity: 'target-buffer write intent count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-mutation-audit:readyWriteIntentCount', { unit: '1', dimensions: '1', quantity: 'ready target-buffer write intent count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-mutation-audit:blockedWriteIntentCount', { unit: '1', dimensions: '1', quantity: 'blocked target-buffer write intent count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-mutation-audit:maxMutationAuditResidualProxy', { unit: '1', dimensions: '1', quantity: 'mutation-audit replay residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-mutation-audit:blockerCount', { unit: '1', dimensions: '1', quantity: 'mutation-audit blocker count', unitStatus: 'count', location: 'report', confidence: 0.1 }],
  ['molecular-target-buffer-worker-write-queue:canPlanWorkerWrite', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write queue planning flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.09 }],
  ['molecular-target-buffer-worker-write-queue:canQueueWorkerWrite', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write queue dispatch readiness flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.07 }],
  ['molecular-target-buffer-worker-write-queue:scientificMutationReady', { unit: '1', dimensions: '1', quantity: 'scientific target-buffer worker write readiness flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.05 }],
  ['molecular-target-buffer-worker-write-queue:targetBatchCount', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write batch count', unitStatus: 'count', location: 'report', confidence: 0.09 }],
  ['molecular-target-buffer-worker-write-queue:queueReadyBatchCount', { unit: '1', dimensions: '1', quantity: 'queue-plan ready target batch count', unitStatus: 'count', location: 'report', confidence: 0.09 }],
  ['molecular-target-buffer-worker-write-queue:queueBlockedBatchCount', { unit: '1', dimensions: '1', quantity: 'queue-plan blocked target batch count', unitStatus: 'count', location: 'report', confidence: 0.09 }],
  ['molecular-target-buffer-worker-write-queue:writeIntentCount', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write intent count', unitStatus: 'count', location: 'report', confidence: 0.09 }],
  ['molecular-target-buffer-worker-write-queue:queueReadyWriteIntentCount', { unit: '1', dimensions: '1', quantity: 'queue-plan ready write intent count', unitStatus: 'count', location: 'report', confidence: 0.09 }],
  ['molecular-target-buffer-worker-write-queue:blockedWriteIntentCount', { unit: '1', dimensions: '1', quantity: 'queue-plan blocked write intent count', unitStatus: 'count', location: 'report', confidence: 0.09 }],
  ['molecular-target-buffer-worker-write-queue:queuedWriteIntentCount', { unit: '1', dimensions: '1', quantity: 'queued target-buffer write intent count', unitStatus: 'count', location: 'report', confidence: 0.07 }],
  ['molecular-target-buffer-worker-write-queue:maxQueueResidualProxy', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write queue residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.09 }],
  ['molecular-target-buffer-worker-write-queue:blockerCount', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write queue blocker count', unitStatus: 'count', location: 'report', confidence: 0.09 }],
  ['molecular-target-buffer-worker-write-execution:canExecuteProxy', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write execution readiness flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-execution:applied', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write applied flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-execution:scientificMutationReady', { unit: '1', dimensions: '1', quantity: 'scientific target-buffer worker write execution readiness flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.04 }],
  ['molecular-target-buffer-worker-write-execution:targetBatchCount', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write execution batch count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-execution:appliedBatchCount', { unit: '1', dimensions: '1', quantity: 'applied target-buffer worker write batch count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-execution:blockedBatchCount', { unit: '1', dimensions: '1', quantity: 'blocked target-buffer worker write execution batch count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-execution:writeIntentCount', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write execution intent count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-execution:queuedWriteIntentCount', { unit: '1', dimensions: '1', quantity: 'queued target-buffer worker write execution intent count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-execution:dispatchedWriteIntentCount', { unit: '1', dimensions: '1', quantity: 'dispatched target-buffer worker write intent count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-execution:appliedWriteIntentCount', { unit: '1', dimensions: '1', quantity: 'applied target-buffer worker write intent count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-execution:skippedWriteIntentCount', { unit: '1', dimensions: '1', quantity: 'skipped target-buffer worker write intent count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-execution:maxWorkerWriteResidualProxy', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write execution residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-execution:blockerCount', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write execution blocker count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-verification:canVerifyProxy', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write verification readiness flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-verification:verified', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write verification flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-verification:scientificMutationReady', { unit: '1', dimensions: '1', quantity: 'scientific target-buffer worker write verification readiness flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.04 }],
  ['molecular-target-buffer-worker-write-verification:targetBatchCount', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write verification target count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-verification:verifiedTargetCount', { unit: '1', dimensions: '1', quantity: 'verified target-buffer worker write target count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-verification:blockedTargetCount', { unit: '1', dimensions: '1', quantity: 'blocked target-buffer worker write verification target count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-verification:fieldWriteCount', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write verification field count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-verification:verifiedFieldWriteCount', { unit: '1', dimensions: '1', quantity: 'verified target-buffer worker write field count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-verification:skippedFieldWriteCount', { unit: '1', dimensions: '1', quantity: 'skipped target-buffer worker write verification field count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-verification:missingFieldWriteCount', { unit: '1', dimensions: '1', quantity: 'missing target-buffer worker write verification field count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-verification:mismatchedFieldWriteCount', { unit: '1', dimensions: '1', quantity: 'mismatched target-buffer worker write verification field count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-verification:maxVerificationResidualProxy', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write verification residual proxy', unitStatus: 'reduced-proxy', location: 'report', confidence: 0.08 }],
  ['molecular-target-buffer-worker-write-verification:blockerCount', { unit: '1', dimensions: '1', quantity: 'target-buffer worker write verification blocker count', unitStatus: 'count', location: 'report', confidence: 0.08 }],
  ['molecular-scientific-invariant-gate:canPromoteProxy', { unit: '1', dimensions: '1', quantity: 'molecular scientific invariant proxy promotion flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.07 }],
  ['molecular-scientific-invariant-gate:scientificMutationReady', { unit: '1', dimensions: '1', quantity: 'molecular scientific mutation readiness flag', unitStatus: 'boolean-proxy', location: 'report', confidence: 0.03 }],
  ['molecular-scientific-invariant-gate:proxySatisfiedScopeCount', { unit: '1', dimensions: '1', quantity: 'proxy-satisfied molecular invariant scope count', unitStatus: 'count', location: 'report', confidence: 0.07 }],
  ['molecular-scientific-invariant-gate:authoritativeSatisfiedScopeCount', { unit: '1', dimensions: '1', quantity: 'authoritatively satisfied molecular invariant scope count', unitStatus: 'count', location: 'report', confidence: 0.04 }],
  ['molecular-scientific-invariant-gate:blockedScopeCount', { unit: '1', dimensions: '1', quantity: 'blocked molecular scientific invariant scope count', unitStatus: 'count', location: 'report', confidence: 0.07 }],
  ['molecular-scientific-invariant-gate:blockerCount', { unit: '1', dimensions: '1', quantity: 'molecular scientific invariant gate blocker count', unitStatus: 'count', location: 'report', confidence: 0.07 }],
  ['reactive-thermal-cell:heatReleaseNorm', { unit: '1', dimensions: '1', quantity: 'normalized heat release', unitStatus: 'reduced-proxy', location: 'cell', confidence: 0.34 }],
  ['reactive-thermal-cell:molecularClosureHeatFluxProxy', { unit: 'W/m^2-proxy', dimensions: 'M T^-3', quantity: 'molecular closure heat flux source proxy', unitStatus: 'reduced-proxy', location: 'cell', confidence: 0.32 }],
  ['reactive-thermal-cell:temperatureK', { unit: 'K', dimensions: 'Theta', quantity: 'temperature', unitStatus: 'physical', location: 'cell', confidence: 0.5 }],
  ['reactive-thermal-cell:radiativeHeatFlux', { unit: 'W/m^2-proxy', dimensions: 'M T^-3', quantity: 'reduced radiative heat flux', unitStatus: 'reduced-proxy', location: 'boundary', confidence: 0.38 }],
  ['combustion-plume:fireAreaFraction', { unit: '1', dimensions: '1', quantity: 'fire area fraction', unitStatus: 'dimensionless', location: 'region', confidence: 0.36 }],
  ['combustion-plume:waterContact', { unit: '1', dimensions: '1', quantity: 'water contact suppression fraction', unitStatus: 'dimensionless', location: 'region', confidence: 0.34 }],
  ['combustion-plume:buoyancyFlux', { unit: 'reduced W/m^2', dimensions: 'M T^-3', quantity: 'reduced buoyancy flux', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.32 }],
  ['combustion-plume:heatReleaseMean', { unit: 'W/m^3-proxy', dimensions: 'M L^-1 T^-3', quantity: 'reduced volumetric heat release', unitStatus: 'reduced-proxy', location: 'cell', confidence: 0.34 }],
  ['sph-material:coolingPotential', { unit: '1', dimensions: '1', quantity: 'cooling potential fraction', unitStatus: 'dimensionless', location: 'region', confidence: 0.38 }],
  ['sph-material:spillImpulse', { unit: 'reduced N s', dimensions: 'M L T^-1', quantity: 'reduced spill impulse', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.34 }],
  ['sph-material:fireContactFraction', { unit: '1', dimensions: '1', quantity: 'fire contact fraction', unitStatus: 'dimensionless', location: 'region', confidence: 0.38 }],
  ['sph-material:vaporFraction', { unit: '1', dimensions: '1', quantity: 'vapor phase fraction', unitStatus: 'dimensionless', location: 'region', confidence: 0.4 }],
  ['sph-material:kineticEnergyDrift', { unit: 'J-proxy', dimensions: 'M L^2 T^-2', quantity: 'reduced kinetic energy drift', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.3 }],
  ['sph-material:molecularClosureRadiativeHeatFluxBoost', { unit: 'W/m^2-proxy', dimensions: 'M T^-3', quantity: 'molecular closure heat flux boost', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.3 }],
  ['membrane-shell:ruptureRisk', { unit: '1', dimensions: '1', quantity: 'rupture risk fraction', unitStatus: 'dimensionless', location: 'region', confidence: 0.36 }],
  ['membrane-shell:heatFluxMean', { unit: 'W/m^2-proxy', dimensions: 'M T^-3', quantity: 'reduced membrane heat flux', unitStatus: 'reduced-proxy', location: 'segment', confidence: 0.32 }],
  ['hydro-atmosphere:cloudCover', { unit: '1', dimensions: '1', quantity: 'cloud cover fraction', unitStatus: 'dimensionless', location: 'region', confidence: 0.34 }],
  ['hydro-atmosphere:stormEnergy', { unit: 'reduced', dimensions: 'mixed', quantity: 'reduced storm energy', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.28 }],
  ['radiation-opacity:netHeatingPower', { unit: 'W/m^3-proxy', dimensions: 'M L^-1 T^-3', quantity: 'reduced net heating power', unitStatus: 'reduced-proxy', location: 'cell', confidence: 0.34 }],
  ['radiation-opacity:greenhouseFactor', { unit: '1', dimensions: '1', quantity: 'greenhouse factor', unitStatus: 'dimensionless', location: 'region', confidence: 0.32 }],
  ['radiation-opacity:radiationPressure', { unit: '1', dimensions: '1', quantity: 'radiation pressure multiplier', unitStatus: 'dimensionless', location: 'region', confidence: 0.34 }],
  ['stellar-fusion:luminosityFactor', { unit: '1', dimensions: '1', quantity: 'luminosity multiplier', unitStatus: 'dimensionless', location: 'region', confidence: 0.34 }],
  ['stellar-fusion:fusionPowerProxy', { unit: 'reduced-W/m^3', dimensions: 'M L^-1 T^-3', quantity: 'reduced fusion power density', unitStatus: 'reduced-proxy', location: 'cell', confidence: 0.32 }],
  ['stellar-fusion:coreTemperatureK', { unit: 'K', dimensions: 'Theta', quantity: 'stellar core temperature', unitStatus: 'physical', location: 'cell', confidence: 0.36 }],
  ['maxwell-em:fieldEnergy', { unit: 'J/m^3-proxy', dimensions: 'M L^-1 T^-2', quantity: 'reduced electromagnetic field energy', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.34 }],
  ['magnetosphere-plasma:magneticEnergy', { unit: 'J/m^3-proxy', dimensions: 'M L^-1 T^-2', quantity: 'reduced magnetic energy density', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.32 }],
  ['magnetosphere-plasma:reconnectionRate', { unit: 'reduced s^-1', dimensions: 'T^-1', quantity: 'magnetic reconnection rate', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.34 }],
  ['magnetosphere-plasma:solarWindPressure', { unit: 'reduced Pa', dimensions: 'M L^-1 T^-2', quantity: 'solar wind pressure', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.34 }],
  ['pic-plasma-patch:reconnectionHeating', { unit: 'W/m^3-proxy', dimensions: 'M L^-1 T^-3', quantity: 'PIC reconnection heating', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.3 }],
  ['pic-plasma-patch:currentDensity', { unit: 'A/m^2', dimensions: 'I L^-2', quantity: 'current density', unitStatus: 'physical', location: 'cell', confidence: 0.42 }],
  ['relativistic-correction:lensingDeflectionArcsecProxy', { unit: 'arcsec-proxy', dimensions: '1', quantity: 'reduced lensing deflection', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.3 }],
  ['relativistic-correction:gravitationalRedshiftProxy', { unit: '1', dimensions: '1', quantity: 'gravitational redshift proxy', unitStatus: 'dimensionless', location: 'region', confidence: 0.32 }],
  ['cosmology-expansion:filamentEnergy', { unit: 'reduced', dimensions: 'mixed', quantity: 'reduced filament energy', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.28 }],
  ['cosmology-expansion:structureGrowthProxy', { unit: 'reduced', dimensions: 'mixed', quantity: 'structure growth proxy', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.28 }],
  ['nbody-mhd-star-formation:starFormationRate', { unit: 'reduced s^-1', dimensions: 'T^-1', quantity: 'star formation rate proxy', unitStatus: 'reduced-proxy', location: 'region', confidence: 0.22 }],
  ['molecular-dynamics/reactive-thermal/sph:boundaryConditions', { unit: 'mixed', dimensions: 'mixed', quantity: 'material boundary conditions', unitStatus: 'mixed', location: 'boundary', confidence: 0.36 }],
  ['hydro-atmosphere:oceanHeat-stormEnergy', { unit: 'mixed', dimensions: 'mixed', quantity: 'weather heat and storm forcing', unitStatus: 'mixed', location: 'boundary', confidence: 0.28 }]
]);

const FIELD_ALIASES = new Map([
  ['molecular-dynamics:heatReleaseProxy', 'heatReleaseProxy'],
  ['reactive-thermal-cell:temperatureK', 'temperature'],
  ['radiation-opacity:radiationHeatFlux', 'radiativeFlux'],
  ['radiation-opacity:surfaceRadiativeHeatFlux', 'radiativeFlux'],
  ['combustion-plume:smokeColumn', 'smoke'],
  ['hydro-atmosphere:temperatureK', 'temperature'],
  ['stellar-fusion:temperatureK', 'temperature'],
  ['magnetosphere-plasma:alfvenSpeed', 'alfvenSpeed'],
  ['pic-plasma-patch:chargeImbalance', 'chargeDensity'],
  ['relativistic-correction:lensingDeflectionArcsecProxy', 'lensingDeflection'],
  ['cosmology-expansion:structureGrowthProxy', 'structureGrowth']
]);

const UNIT_CONVERSIONS = new Map([
  ['Pa->kPa', { scale: 0.001, offset: 0, precision: 'exact' }],
  ['kPa->Pa', { scale: 1000, offset: 0, precision: 'exact' }],
  ['Pa->MPa', { scale: 0.000001, offset: 0, precision: 'exact' }],
  ['MPa->Pa', { scale: 1000000, offset: 0, precision: 'exact' }],
  ['Pa->GPa', { scale: 0.000000001, offset: 0, precision: 'exact' }],
  ['GPa->Pa', { scale: 1000000000, offset: 0, precision: 'exact' }],
  ['m/s->km/s', { scale: 0.001, offset: 0, precision: 'exact' }],
  ['km/s->m/s', { scale: 1000, offset: 0, precision: 'exact' }],
  ['J->kJ', { scale: 0.001, offset: 0, precision: 'exact' }],
  ['kJ->J', { scale: 1000, offset: 0, precision: 'exact' }],
  ['K->degC', { scale: 1, offset: -273.15, precision: 'affine' }],
  ['degC->K', { scale: 1, offset: 273.15, precision: 'affine' }]
]);

const NAMED_FIELD_ADAPTERS = new Map([
  ['molecular-heat-to-reactive-thermal', {
    adapterEquationId: 'peercompute.multiscale.adapter.molecular-reactive-thermal-source-response.v0',
    equationType: 'molecular-heat-reactive-source-response',
    executionMode: 'named-response-adapter',
    adapterKind: 'reduced-proxy-adapter',
    sourceSinkMode: 'open-system-molecular-thermal-response',
    parameters: {
      currentHeatCarry: 0.36,
      heatReleaseGain: 0.46,
      molecularTemperatureReferenceK: 900,
      temperatureGain: 0.16,
      reactionProgressGain: 0.15,
      bondActivityReference: 24,
      bondActivityGain: 0.1,
      ionizationGain: 0.1,
      conductivityGain: 0.06,
      pressureReferenceProxy: 1.2,
      pressureGain: 0.05,
      radiativeReferenceWm2: 1800,
      radiativeGain: 0.06,
      transferHeatReferenceWProxy: 0.0001,
      transferHeatGain: 0.05,
      transferSpeciesReferenceRateProxy: 20,
      transferSpeciesGain: 0.03,
      transferResidualPenalty: 0.04,
      oxygenReferenceFraction: 0.21,
      oxygenFloorMultiplier: 0.55,
      oxygenBlendMultiplier: 0.45,
      waterSuppressionGain: 0.42,
      maxHeatReleaseNorm: 1
    },
    validationStatus: 'interactive-equation',
    calibrationStatus: 'uncalibrated',
    validationGates: [
      'named-adapter-equation',
      'molecular-heat-response-unit-test',
      'bond-ionization-context-unit-test',
      'source-sink-accounting',
      'reactive-source-reference-tolerance'
    ],
    reason: 'named interactive molecular-source adapter maps atomistic heat, bond activity, ionization, and environment context to reduced reactive thermal source forcing'
  }],
  ['reactive-thermal-to-combustion', {
    adapterEquationId: 'peercompute.multiscale.adapter.thermal-ignition-response.v0',
    equationType: 'thermal-ignition-logistic-response',
    executionMode: 'named-response-adapter',
    sourceSinkMode: 'open-system-thermal-response',
    parameters: {
      ignitionTemperatureK: 620,
      responseWidthK: 85,
      oxygenReferenceFraction: 0.21,
      minimumOxygenFraction: 0.04,
      pressureReferencePa: 101325,
      pressureGainMax: 1.35,
      radiativeFluxReferenceWm2: 1800,
      radiativeBoostMax: 0.28,
      waterSuppressionGain: 0.72
    },
    validationStatus: 'interactive-equation',
    calibrationStatus: 'uncalibrated',
    validationGates: [
      'named-adapter-equation',
      'oxygen-pressure-response-unit-test',
      'suppression-response-unit-test',
      'source-sink-accounting',
      'reference-tolerance'
    ],
    reason: 'named interactive ignition-response adapter maps reactive material temperature to combustion fire-area forcing'
  }],
  ['sph-water-to-fire-suppression', {
    adapterEquationId: 'peercompute.multiscale.adapter.sph-water-suppression-response.v0',
    equationType: 'water-contact-suppression-response',
    executionMode: 'named-response-adapter',
    sourceSinkMode: 'open-system-water-suppression-response',
    adapterKind: 'dimensionless-response-adapter',
    parameters: {
      currentContactCarry: 0.28,
      coolingGain: 0.62,
      fireContactGain: 0.34,
      vaporSuppressionGain: 0.16,
      spillImpulseGain: 0.08,
      hotContactPenalty: 0.24,
      thermalDemandBase: 0.45,
      fireIntensityDemandGain: 0.4,
      thermalDemandTemperatureGain: 0.18,
      thermalDemandReferenceK: 2200,
      maxWaterContact: 1
    },
    validationStatus: 'interactive-equation',
    calibrationStatus: 'uncalibrated',
    validationGates: [
      'named-adapter-equation',
      'cooling-contact-response-unit-test',
      'vapor-hot-contact-response-unit-test',
      'source-sink-accounting',
      'suppression-reference-tolerance'
    ],
    reason: 'named interactive water-suppression adapter maps SPH cooling/contact/phase context to combustion water-contact forcing'
  }],
  ['membrane-rupture-to-sph-release', {
    adapterEquationId: 'peercompute.multiscale.adapter.membrane-rupture-spill-response.v0',
    equationType: 'membrane-rupture-spill-saturating-response',
    executionMode: 'named-response-adapter',
    sourceSinkMode: 'open-system-mass-momentum-release',
    parameters: {
      ruptureThreshold: 0.48,
      responseWidth: 0.11,
      pressureReferencePa: 132000,
      pressureGainMax: 1.55,
      heatFluxReferenceWm2: 2200,
      heatBoostMax: 0.22,
      integrityLossGain: 0.38,
      waterInventoryReferenceKg: 0.42,
      previousImpulseCarry: 0.18,
      burstBoost: 0.32,
      maxImpulse: 2
    },
    validationStatus: 'interactive-equation',
    calibrationStatus: 'uncalibrated',
    validationGates: [
      'named-adapter-equation',
      'rupture-pressure-response-unit-test',
      'water-inventory-gating-unit-test',
      'source-sink-accounting',
      'momentum-transfer-reference-tolerance'
    ],
    reason: 'named interactive rupture-response adapter maps membrane rupture risk and pressure/heat context to SPH spill impulse forcing'
  }],
  ['combustion-plume-to-weather', {
    adapterEquationId: 'peercompute.multiscale.adapter.plume-weather-cloud-response.v0',
    equationType: 'combustion-plume-weather-cloud-response',
    executionMode: 'named-response-adapter',
    sourceSinkMode: 'open-system-plume-weather-response',
    parameters: {
      currentCloudCarry: 0.36,
      buoyancyReferenceFlux: 18,
      buoyancyGain: 0.34,
      smokeGain: 0.28,
      heatReleaseReference: 2200,
      heatGain: 0.2,
      plumeRiseGain: 0.12,
      stormCarry: 0.18,
      steamCloudGain: 0.08,
      pressureReferencePa: 101325,
      pressureLiftMin: 0.72,
      pressureLiftMax: 1.28,
      windShearReferenceMps: 45,
      windShearLossGain: 0.14,
      precipitationLossGain: 0.42,
      maxCloudCover: 1
    },
    validationStatus: 'interactive-equation',
    calibrationStatus: 'uncalibrated',
    validationGates: [
      'named-adapter-equation',
      'plume-buoyancy-response-unit-test',
      'smoke-washout-response-unit-test',
      'source-sink-accounting',
      'weather-reference-tolerance'
    ],
    reason: 'named interactive plume-weather adapter maps combustion buoyancy, smoke, heat, and washout context to reduced weather cloud forcing'
  }],
  ['radiation-opacity-to-surface-heating', {
    adapterEquationId: 'peercompute.multiscale.adapter.radiation-surface-heat-response.v0',
    equationType: 'grey-radiation-surface-heat-response',
    executionMode: 'named-response-adapter',
    sourceSinkMode: 'open-system-radiation-thermal-response',
    parameters: {
      referenceCellCount: 128,
      netHeatingGain: 140,
      greenhouseGain: 18,
      stellarFluxGain: 12,
      radiationPressureGain: 8,
      materialTemperatureGain: 0.025,
      coolingLossGain: 70,
      waterAttenuationGain: 0.22,
      maxFluxWm2Proxy: 260
    },
    validationStatus: 'interactive-equation',
    calibrationStatus: 'uncalibrated',
    validationGates: [
      'named-adapter-equation',
      'net-heating-response-unit-test',
      'greenhouse-response-unit-test',
      'source-sink-accounting',
      'radiative-transfer-reference-tolerance'
    ],
    reason: 'named interactive radiation-response adapter maps grey-radiation heating and greenhouse context to reduced surface radiative heat flux'
  }],
  ['stellar-fusion-to-radiation-pressure', {
    adapterEquationId: 'peercompute.multiscale.adapter.stellar-radiation-pressure-response.v0',
    equationType: 'stellar-luminosity-radiation-pressure-response',
    executionMode: 'named-response-adapter',
    sourceSinkMode: 'open-system-stellar-radiation-response',
    adapterKind: 'dimensionless-response-adapter',
    parameters: {
      currentPressureCarry: 0.32,
      luminosityGain: 0.58,
      fusionPowerReference: 1800,
      fusionPowerGain: 0.22,
      coreTemperatureReferenceK: 15000000,
      coreTemperatureGain: 0.18,
      stellarFluxGain: 0.16,
      opacityTrapGain: 0.12,
      opticalDepthReference: 2,
      maxRadiationPressure: 3.2
    },
    validationStatus: 'interactive-equation',
    calibrationStatus: 'uncalibrated',
    validationGates: [
      'named-adapter-equation',
      'luminosity-pressure-response-unit-test',
      'stellar-opacity-trap-response-unit-test',
      'source-sink-accounting',
      'stellar-radiation-reference-tolerance'
    ],
    reason: 'named interactive stellar-radiation adapter maps stellar luminosity, fusion power, core temperature, and opacity context to reduced radiation-pressure forcing'
  }],
  ['maxwell-field-to-magnetosphere', {
    adapterEquationId: 'peercompute.multiscale.adapter.maxwell-magnetosphere-boundary-response.v0',
    equationType: 'electromagnetic-field-magnetosphere-boundary-response',
    executionMode: 'named-response-adapter',
    adapterKind: 'reduced-proxy-adapter',
    sourceSinkMode: 'open-system-electromagnetic-mhd-boundary-response',
    parameters: {
      currentMagneticEnergyCarry: 0.26,
      fieldEnergyReference: 1.2,
      fieldEnergyGain: 0.62,
      poyntingReference: 1.25,
      poyntingGain: 0.24,
      solarWindPressureGain: 0.08,
      reconnectionGain: 0.1,
      radiationPressureGain: 0.06,
      stellarFluxGain: 0.04,
      maxMagneticEnergy: 4
    },
    validationStatus: 'interactive-equation',
    calibrationStatus: 'uncalibrated',
    validationGates: [
      'named-adapter-equation',
      'field-energy-boundary-response-unit-test',
      'poynting-pressure-response-unit-test',
      'source-sink-accounting',
      'mhd-boundary-reference-tolerance'
    ],
    reason: 'named interactive electromagnetic boundary adapter maps Maxwell field energy and Poynting context to reduced magnetosphere magnetic-energy forcing'
  }],
  ['pic-kinetic-to-mhd-feedback', {
    adapterEquationId: 'peercompute.multiscale.adapter.pic-mhd-reconnection-feedback.v0',
    equationType: 'kinetic-plasma-mhd-reconnection-feedback',
    executionMode: 'named-response-adapter',
    adapterKind: 'reduced-proxy-adapter',
    sourceSinkMode: 'open-system-kinetic-mhd-feedback',
    parameters: {
      currentReconnectionCarry: 0.44,
      heatingReference: 0.018,
      heatingGain: 0.34,
      currentDensityReference: 0.12,
      currentDensityGain: 0.22,
      fieldEnergyReference: 1.6,
      fieldEnergyGain: 0.12,
      chargeImbalanceReference: 0.12,
      chargeImbalanceGain: 0.06,
      chargeSeparationGain: 0.07,
      escapeGain: 0.08,
      currentSheetGain: 0.04,
      solarWindPressureGain: 0.05,
      divergenceReference: 0.08,
      divergenceLossGain: 0.05,
      maxReconnectionRate: 4
    },
    validationStatus: 'interactive-equation',
    calibrationStatus: 'uncalibrated',
    validationGates: [
      'named-adapter-equation',
      'kinetic-heating-response-unit-test',
      'current-density-feedback-unit-test',
      'source-sink-accounting',
      'kinetic-mhd-reference-tolerance'
    ],
    reason: 'named interactive kinetic-feedback adapter maps PIC reconnection heating, current density, charge separation, and particle escape into reduced MHD reconnection-rate forcing'
  }]
]);

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPhysicalLike(metadata) {
  return metadata?.unitStatus === 'physical';
}

function isProxyLike(metadata) {
  return metadata?.unitStatus === 'reduced-proxy'
    || metadata?.unitStatus === 'mixed'
    || metadata?.dimensions === 'mixed'
    || metadata?.metadataSource === 'fallback';
}

function isDimensionlessLike(metadata) {
  return metadata?.unitStatus === 'dimensionless'
    || metadata?.unitStatus === 'count'
    || metadata?.dimensions === '1';
}

function countBy(values, pickKey) {
  const counts = {};
  for (const value of values) {
    const key = pickKey(value) || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function summarizeCompatibilitySource(field = {}) {
  return {
    solverId: field.solverId || 'unknown',
    field: field.field || 'unknown',
    unit: field.unit || 'unknown',
    dimensions: field.dimensions || 'unknown',
    unitStatus: field.unitStatus || 'unknown',
    metadataSource: field.metadataSource || 'unknown'
  };
}

function findUnitConversion(sourceUnit, targetUnit) {
  if (!sourceUnit || !targetUnit || sourceUnit === 'unknown' || targetUnit === 'unknown') {
    return null;
  }
  if (sourceUnit === targetUnit) {
    return {
      scale: 1,
      offset: 0,
      precision: 'identity'
    };
  }
  return UNIT_CONVERSIONS.get(`${sourceUnit}->${targetUnit}`) || null;
}

function adapterKindForCompatibility(check) {
  switch (check?.status) {
    case 'compatible':
      return 'identity';
    case 'unit-conversion-required':
      return 'unit-conversion';
    case 'proxy-adapter-required':
      return 'reduced-proxy-adapter';
    case 'dimensionless-adapter-required':
      return 'dimensionless-response-adapter';
    case 'metadata-incomplete':
      return 'metadata-repair';
    case 'dimension-mismatch':
      return 'blocked-dimension-mismatch';
    default:
      return 'explicit-adapter';
  }
}

function validationGatesForAdapter(status) {
  if (status === 'ready') {
    return ['packet-contract', 'round-trip-unit-test'];
  }
  if (status === 'stub-required') {
    return ['named-adapter-equation', 'conservation-impact-test', 'reference-tolerance'];
  }
  return ['metadata-contract-fix', 'dimension-contract-review'];
}

function finiteOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function rounded(value, digits = 6) {
  const number = Number(value);
  return Number.isFinite(number) ? Number(number.toFixed(digits)) : null;
}

function applyAdapterTransform(value, transform) {
  const input = finiteOrNull(value);
  if (input === null || !transform) {
    return null;
  }
  if (transform.mode === 'named-equation') {
    return applyNamedAdapterEquation(input, transform);
  }
  const scale = Number.isFinite(Number(transform.scale)) ? Number(transform.scale) : 1;
  const offset = Number.isFinite(Number(transform.offset)) ? Number(transform.offset) : 0;
  return input * scale + offset;
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function logistic(value) {
  if (value > 60) return 1;
  if (value < -60) return 0;
  return 1 / (1 + Math.exp(-value));
}

function applyMolecularReactiveThermalSourceResponse(sourceHeatReleaseProxy, transform) {
  const parameters = transform?.parameters || {};
  const context = transform?.context || {};
  const currentHeatCarry = clamp01(finiteOrNull(parameters.currentHeatCarry) ?? 0.36);
  const heatReleaseGain = Math.max(0, finiteOrNull(parameters.heatReleaseGain) ?? 0.46);
  const molecularTemperatureReferenceK = Math.max(1, finiteOrNull(parameters.molecularTemperatureReferenceK) ?? 900);
  const temperatureGain = Math.max(0, finiteOrNull(parameters.temperatureGain) ?? 0.16);
  const reactionProgressGain = Math.max(0, finiteOrNull(parameters.reactionProgressGain) ?? 0.15);
  const bondActivityReference = Math.max(0.001, finiteOrNull(parameters.bondActivityReference) ?? 24);
  const bondActivityGain = Math.max(0, finiteOrNull(parameters.bondActivityGain) ?? 0.1);
  const ionizationGain = Math.max(0, finiteOrNull(parameters.ionizationGain) ?? 0.1);
  const conductivityGain = Math.max(0, finiteOrNull(parameters.conductivityGain) ?? 0.06);
  const pressureReferenceProxy = Math.max(0.001, finiteOrNull(parameters.pressureReferenceProxy) ?? 1.2);
  const pressureGain = Math.max(0, finiteOrNull(parameters.pressureGain) ?? 0.05);
  const radiativeReferenceWm2 = Math.max(1, finiteOrNull(parameters.radiativeReferenceWm2) ?? 1800);
  const radiativeGain = Math.max(0, finiteOrNull(parameters.radiativeGain) ?? 0.06);
  const transferHeatReferenceWProxy = Math.max(0.000000001, finiteOrNull(parameters.transferHeatReferenceWProxy) ?? 0.0001);
  const transferHeatGain = Math.max(0, finiteOrNull(parameters.transferHeatGain) ?? 0.05);
  const transferSpeciesReferenceRateProxy = Math.max(0.000001, finiteOrNull(parameters.transferSpeciesReferenceRateProxy) ?? 20);
  const transferSpeciesGain = Math.max(0, finiteOrNull(parameters.transferSpeciesGain) ?? 0.03);
  const transferResidualPenalty = Math.max(0, finiteOrNull(parameters.transferResidualPenalty) ?? 0.04);
  const oxygenReferenceFraction = Math.max(0.001, finiteOrNull(parameters.oxygenReferenceFraction) ?? 0.21);
  const oxygenFloorMultiplier = clamp01(finiteOrNull(parameters.oxygenFloorMultiplier) ?? 0.55);
  const oxygenBlendMultiplier = clamp01(finiteOrNull(parameters.oxygenBlendMultiplier) ?? 0.45);
  const waterSuppressionGain = Math.max(0, finiteOrNull(parameters.waterSuppressionGain) ?? 0.42);
  const maxHeatReleaseNorm = Math.max(0.001, finiteOrNull(parameters.maxHeatReleaseNorm) ?? 1);

  const heatReleaseProxy = clamp01(finiteOrNull(sourceHeatReleaseProxy) ?? 0);
  const currentHeatReleaseNorm = clamp01(finiteOrNull(context.heatReleaseNorm) ?? 0);
  const ambientTemperatureK = Math.max(1, finiteOrNull(context.ambientTemperatureK) ?? 294);
  const molecularMeanTemperatureK = Math.max(
    1,
    finiteOrNull(context.molecularMeanTemperatureK)
      ?? finiteOrNull(context.meanTemperatureK)
      ?? ambientTemperatureK
  );
  const reactionProgress = clamp01(finiteOrNull(context.reactionProgress) ?? 0);
  const bondCount = Math.max(0, finiteOrNull(context.bondCount) ?? 0);
  const meanBondOrder = clamp01(finiteOrNull(context.meanBondOrder) ?? 0);
  const ionizationFraction = clamp01(finiteOrNull(context.ionizationFraction) ?? 0);
  const electricalConductivityProxy = Math.max(0, finiteOrNull(context.electricalConductivityProxy) ?? 0);
  const pressureProxy = Math.max(0, finiteOrNull(context.pressureProxy) ?? 0);
  const radiativeHeatFlux = Math.max(0, finiteOrNull(context.radiativeHeatFlux) ?? 0);
  const oxygenFraction = clampNumber(finiteOrNull(context.oxygenFraction) ?? oxygenReferenceFraction, 0, 1);
  const waterContact = clamp01(finiteOrNull(context.waterContact) ?? 0);
  const sourceTransfer = context.sourceTransfer || {};
  const transferAllocations = Array.isArray(sourceTransfer.allocations) ? sourceTransfer.allocations : [];
  const transferAllocation = transferAllocations.find((allocation) => allocation?.targetSolverId === 'reactive-thermal-cell')
    || transferAllocations[0]
    || {};
  const transferHeatRate = Math.max(0, finiteOrNull(transferAllocation.heatRateWProxy) ?? 0);
  const transferSpeciesRate = Math.max(0, finiteOrNull(transferAllocation.speciesRateCountPerSProxy) ?? 0);
  const transferClosedResidual = Math.max(0, finiteOrNull(sourceTransfer.residuals?.closedSystemResidualProxy) ?? 0);

  const temperatureDrive = clamp01((molecularMeanTemperatureK - ambientTemperatureK) / molecularTemperatureReferenceK) * temperatureGain;
  const bondActivity = clamp01((bondCount * Math.max(0.25, meanBondOrder)) / bondActivityReference);
  const oxygenAvailability = clamp01(oxygenFraction / oxygenReferenceFraction);
  const oxygenMultiplier = oxygenFloorMultiplier + oxygenAvailability * oxygenBlendMultiplier;
  const waterAttenuation = clamp01(1 - waterContact * waterSuppressionGain);
  const transferDrive = clamp01(transferHeatRate / transferHeatReferenceWProxy) * transferHeatGain
    + clamp01(transferSpeciesRate / transferSpeciesReferenceRateProxy) * transferSpeciesGain
    - clamp01(transferClosedResidual) * transferResidualPenalty;
  const response = (
    currentHeatReleaseNorm * currentHeatCarry
    + heatReleaseProxy * heatReleaseGain
    + temperatureDrive
    + reactionProgress * reactionProgressGain
    + bondActivity * bondActivityGain
    + ionizationFraction * ionizationGain
    + clamp01(electricalConductivityProxy) * conductivityGain
    + clamp01(pressureProxy / pressureReferenceProxy) * pressureGain
    + clamp01(radiativeHeatFlux / radiativeReferenceWm2) * radiativeGain
    + transferDrive
  ) * oxygenMultiplier * waterAttenuation;
  return clampNumber(response, 0, maxHeatReleaseNorm);
}

function applyThermalIgnitionResponse(sourceTemperatureK, transform) {
  const parameters = transform?.parameters || {};
  const context = transform?.context || {};
  const ignitionTemperatureK = finiteOrNull(parameters.ignitionTemperatureK) ?? 620;
  const responseWidthK = Math.max(1, finiteOrNull(parameters.responseWidthK) ?? 85);
  const oxygenReferenceFraction = Math.max(0.001, finiteOrNull(parameters.oxygenReferenceFraction) ?? 0.21);
  const minimumOxygenFraction = clampNumber(finiteOrNull(parameters.minimumOxygenFraction) ?? 0.04, 0, oxygenReferenceFraction);
  const pressureReferencePa = Math.max(1, finiteOrNull(parameters.pressureReferencePa) ?? 101325);
  const pressureGainMax = Math.max(0.1, finiteOrNull(parameters.pressureGainMax) ?? 1.35);
  const radiativeFluxReferenceWm2 = Math.max(1, finiteOrNull(parameters.radiativeFluxReferenceWm2) ?? 1800);
  const radiativeBoostMax = Math.max(0, finiteOrNull(parameters.radiativeBoostMax) ?? 0.28);
  const waterSuppressionGain = Math.max(0, finiteOrNull(parameters.waterSuppressionGain) ?? 0.72);
  const oxygenFraction = clampNumber(finiteOrNull(context.oxygenFraction) ?? oxygenReferenceFraction, 0, 1);
  const ambientPressurePa = Math.max(1, finiteOrNull(context.ambientPressurePa) ?? pressureReferencePa);
  const waterContact = clamp01(finiteOrNull(context.waterContact) ?? 0);
  const radiativeHeatFlux = Math.max(0, finiteOrNull(context.radiativeHeatFlux) ?? 0);

  const thermalResponse = logistic((sourceTemperatureK - ignitionTemperatureK) / responseWidthK);
  const oxygenResponse = clamp01((oxygenFraction - minimumOxygenFraction) / Math.max(0.001, oxygenReferenceFraction - minimumOxygenFraction));
  const pressureResponse = clampNumber(Math.sqrt(ambientPressurePa / pressureReferencePa), 0.35, pressureGainMax);
  const radiativeBoost = Math.min(radiativeBoostMax, radiativeHeatFlux / radiativeFluxReferenceWm2);
  const suppression = clamp01(1 - waterContact * waterSuppressionGain);
  return clamp01((thermalResponse + radiativeBoost) * oxygenResponse * pressureResponse * suppression);
}

function applyMembraneRuptureSpillResponse(sourceRuptureRisk, transform) {
  const parameters = transform?.parameters || {};
  const context = transform?.context || {};
  const ruptureThreshold = clamp01(finiteOrNull(parameters.ruptureThreshold) ?? 0.48);
  const responseWidth = Math.max(0.001, finiteOrNull(parameters.responseWidth) ?? 0.11);
  const pressureReferencePa = Math.max(1, finiteOrNull(parameters.pressureReferencePa) ?? 132000);
  const pressureGainMax = Math.max(0.1, finiteOrNull(parameters.pressureGainMax) ?? 1.55);
  const heatFluxReferenceWm2 = Math.max(1, finiteOrNull(parameters.heatFluxReferenceWm2) ?? 2200);
  const heatBoostMax = Math.max(0, finiteOrNull(parameters.heatBoostMax) ?? 0.22);
  const integrityLossGain = Math.max(0, finiteOrNull(parameters.integrityLossGain) ?? 0.38);
  const waterInventoryReferenceKg = Math.max(0.001, finiteOrNull(parameters.waterInventoryReferenceKg) ?? 0.42);
  const previousImpulseCarry = clamp01(finiteOrNull(parameters.previousImpulseCarry) ?? 0.18);
  const burstBoost = Math.max(0, finiteOrNull(parameters.burstBoost) ?? 0.32);
  const maxImpulse = Math.max(0.001, finiteOrNull(parameters.maxImpulse) ?? 2);
  const ruptureRisk = clamp01(sourceRuptureRisk);
  const membraneIntegrity = clamp01(finiteOrNull(context.membraneIntegrity) ?? 1);
  const internalPressurePa = Math.max(1, finiteOrNull(context.internalPressurePa) ?? pressureReferencePa);
  const ambientPressurePa = Math.max(1, finiteOrNull(context.ambientPressurePa) ?? 101325);
  const heatFluxMean = Math.max(0, finiteOrNull(context.heatFluxMean) ?? 0);
  const waterMassKg = Math.max(0, finiteOrNull(context.waterMassKg) ?? waterInventoryReferenceKg);
  const steamMassKg = Math.max(0, finiteOrNull(context.steamMassKg) ?? 0);
  const previousSpillImpulse = Math.max(0, finiteOrNull(context.previousSpillImpulse) ?? 0);
  const ruptured = context.ruptured === true ? 1 : 0;

  const ruptureResponse = logistic((ruptureRisk - ruptureThreshold) / responseWidth);
  const pressureDelta = Math.max(0, internalPressurePa - ambientPressurePa);
  const pressureResponse = clampNumber(Math.sqrt(pressureDelta / pressureReferencePa), 0, pressureGainMax);
  const heatBoost = Math.min(heatBoostMax, heatFluxMean / heatFluxReferenceWm2);
  const integrityBoost = clamp01(1 - membraneIntegrity) * integrityLossGain;
  const waterAvailability = clamp01((waterMassKg + steamMassKg * 0.25) / waterInventoryReferenceKg);
  const impulse = (
    ruptureResponse * (0.42 + pressureResponse * 0.38 + integrityBoost)
    + heatBoost
    + ruptured * burstBoost
    + previousSpillImpulse * previousImpulseCarry
  ) * waterAvailability;
  return clampNumber(impulse, 0, maxImpulse);
}

function applySphWaterSuppressionResponse(sourceCoolingPotential, transform) {
  const parameters = transform?.parameters || {};
  const context = transform?.context || {};
  const currentContactCarry = clamp01(finiteOrNull(parameters.currentContactCarry) ?? 0.28);
  const coolingGain = Math.max(0, finiteOrNull(parameters.coolingGain) ?? 0.62);
  const fireContactGain = Math.max(0, finiteOrNull(parameters.fireContactGain) ?? 0.34);
  const vaporSuppressionGain = Math.max(0, finiteOrNull(parameters.vaporSuppressionGain) ?? 0.16);
  const spillImpulseGain = Math.max(0, finiteOrNull(parameters.spillImpulseGain) ?? 0.08);
  const hotContactPenalty = Math.max(0, finiteOrNull(parameters.hotContactPenalty) ?? 0.24);
  const thermalDemandBase = clamp01(finiteOrNull(parameters.thermalDemandBase) ?? 0.45);
  const fireIntensityDemandGain = Math.max(0, finiteOrNull(parameters.fireIntensityDemandGain) ?? 0.4);
  const thermalDemandTemperatureGain = Math.max(0, finiteOrNull(parameters.thermalDemandTemperatureGain) ?? 0.18);
  const thermalDemandReferenceK = Math.max(1, finiteOrNull(parameters.thermalDemandReferenceK) ?? 2200);
  const maxWaterContact = Math.max(0.001, finiteOrNull(parameters.maxWaterContact) ?? 1);
  const coolingPotential = clamp01(sourceCoolingPotential);
  const currentWaterContact = clamp01(finiteOrNull(context.waterContact) ?? 0);
  const fireContactFraction = clamp01(finiteOrNull(context.fireContactFraction) ?? 0);
  const hotContactFraction = clamp01(finiteOrNull(context.hotContactFraction) ?? 0);
  const vaporFraction = clamp01(finiteOrNull(context.vaporFraction) ?? 0);
  const liquidFraction = clamp01(finiteOrNull(context.liquidFraction) ?? Math.max(0, 1 - vaporFraction));
  const fireIntensity = clamp01(finiteOrNull(context.fireIntensity) ?? 0);
  const spillImpulse = Math.max(0, finiteOrNull(context.spillImpulse) ?? 0);
  const ambientTemperatureK = Math.max(1, finiteOrNull(context.ambientTemperatureK) ?? 294);
  const flameTemperatureK = Math.max(ambientTemperatureK, finiteOrNull(context.flameTemperatureK) ?? ambientTemperatureK);

  const thermalDemand = clamp01(
    thermalDemandBase
    + fireIntensity * fireIntensityDemandGain
    + ((flameTemperatureK - ambientTemperatureK) / thermalDemandReferenceK) * thermalDemandTemperatureGain
  );
  const coolingDrive = coolingPotential * coolingGain;
  const liquidContactDrive = fireContactFraction * liquidFraction * fireContactGain;
  const vaporShield = vaporFraction * vaporSuppressionGain * (0.35 + fireIntensity * 0.65);
  const spillDrive = Math.min(0.18, spillImpulse * spillImpulseGain);
  const hotContactLoss = hotContactFraction * hotContactPenalty * (1 - vaporFraction * 0.35);
  const response = currentWaterContact * currentContactCarry
    + (coolingDrive + liquidContactDrive + vaporShield + spillDrive) * thermalDemand
    - hotContactLoss;
  return clampNumber(response, 0, maxWaterContact);
}

function applyPlumeWeatherCloudResponse(sourceBuoyancyFlux, transform) {
  const parameters = transform?.parameters || {};
  const context = transform?.context || {};
  const currentCloudCarry = clamp01(finiteOrNull(parameters.currentCloudCarry) ?? 0.36);
  const buoyancyReferenceFlux = Math.max(0.001, finiteOrNull(parameters.buoyancyReferenceFlux) ?? 18);
  const buoyancyGain = Math.max(0, finiteOrNull(parameters.buoyancyGain) ?? 0.34);
  const smokeGain = Math.max(0, finiteOrNull(parameters.smokeGain) ?? 0.28);
  const heatReleaseReference = Math.max(0.001, finiteOrNull(parameters.heatReleaseReference) ?? 2200);
  const heatGain = Math.max(0, finiteOrNull(parameters.heatGain) ?? 0.2);
  const plumeRiseGain = Math.max(0, finiteOrNull(parameters.plumeRiseGain) ?? 0.12);
  const stormCarry = Math.max(0, finiteOrNull(parameters.stormCarry) ?? 0.18);
  const steamCloudGain = Math.max(0, finiteOrNull(parameters.steamCloudGain) ?? 0.08);
  const pressureReferencePa = Math.max(1, finiteOrNull(parameters.pressureReferencePa) ?? 101325);
  const pressureLiftMin = Math.max(0.001, finiteOrNull(parameters.pressureLiftMin) ?? 0.72);
  const pressureLiftMax = Math.max(pressureLiftMin, finiteOrNull(parameters.pressureLiftMax) ?? 1.28);
  const windShearReferenceMps = Math.max(0.001, finiteOrNull(parameters.windShearReferenceMps) ?? 45);
  const windShearLossGain = Math.max(0, finiteOrNull(parameters.windShearLossGain) ?? 0.14);
  const precipitationLossGain = Math.max(0, finiteOrNull(parameters.precipitationLossGain) ?? 0.42);
  const maxCloudCover = Math.max(0.001, finiteOrNull(parameters.maxCloudCover) ?? 1);

  const buoyancyFlux = Math.max(0, finiteOrNull(sourceBuoyancyFlux) ?? 0);
  const smokeColumn = clamp01(finiteOrNull(context.smokeColumn) ?? 0);
  const heatReleaseMean = Math.max(0, finiteOrNull(context.heatReleaseMean) ?? 0);
  const plumeRise = clamp01(finiteOrNull(context.plumeRise) ?? 0);
  const currentCloudCover = clamp01(finiteOrNull(context.cloudCover) ?? 0);
  const stormEnergy = clamp01(finiteOrNull(context.stormEnergy) ?? 0);
  const waterContact = clamp01(finiteOrNull(context.waterContact) ?? 0);
  const precipitationMean = clamp01(finiteOrNull(context.precipitationMean) ?? 0);
  const maxWindMps = Math.max(0, finiteOrNull(context.maxWindMps) ?? 0);
  const ambientPressurePa = Math.max(1, finiteOrNull(context.ambientPressurePa) ?? pressureReferencePa);

  const buoyancyDrive = (buoyancyFlux / (buoyancyReferenceFlux + buoyancyFlux)) * buoyancyGain;
  const smokeDrive = smokeColumn * smokeGain;
  const heatDrive = clamp01(heatReleaseMean / heatReleaseReference) * heatGain;
  const plumeRiseDrive = plumeRise * plumeRiseGain;
  const steamDrive = waterContact * smokeColumn * steamCloudGain;
  const pressureLift = clampNumber(Math.sqrt(pressureReferencePa / ambientPressurePa), pressureLiftMin, pressureLiftMax);
  const windLoss = clamp01(maxWindMps / windShearReferenceMps) * windShearLossGain;
  const precipitationLoss = precipitationMean * precipitationLossGain;
  const response = currentCloudCover * currentCloudCarry
    + (buoyancyDrive + smokeDrive + heatDrive + plumeRiseDrive + steamDrive) * pressureLift
    + stormEnergy * stormCarry
    - windLoss
    - precipitationLoss;
  return clampNumber(response, 0, maxCloudCover);
}

function applyRadiationSurfaceHeatResponse(sourceNetHeatingPower, transform) {
  const parameters = transform?.parameters || {};
  const context = transform?.context || {};
  const referenceCellCount = Math.max(1, finiteOrNull(parameters.referenceCellCount) ?? 128);
  const cellCount = Math.max(1, finiteOrNull(context.cellCount) ?? referenceCellCount);
  const netHeatingGain = Math.max(0, finiteOrNull(parameters.netHeatingGain) ?? 140);
  const greenhouseGain = Math.max(0, finiteOrNull(parameters.greenhouseGain) ?? 18);
  const stellarFluxGain = Math.max(0, finiteOrNull(parameters.stellarFluxGain) ?? 12);
  const radiationPressureGain = Math.max(0, finiteOrNull(parameters.radiationPressureGain) ?? 8);
  const materialTemperatureGain = Math.max(0, finiteOrNull(parameters.materialTemperatureGain) ?? 0.025);
  const coolingLossGain = Math.max(0, finiteOrNull(parameters.coolingLossGain) ?? 70);
  const waterAttenuationGain = clamp01(finiteOrNull(parameters.waterAttenuationGain) ?? 0.22);
  const maxFluxWm2Proxy = Math.max(0.001, finiteOrNull(parameters.maxFluxWm2Proxy) ?? 260);
  const netHeatingPower = finiteOrNull(sourceNetHeatingPower) ?? 0;
  const greenhouseFactor = clamp01(finiteOrNull(context.greenhouseFactor) ?? 0);
  const stellarFlux = Math.max(0, finiteOrNull(context.stellarFlux) ?? 1);
  const radiationPressure = Math.max(0, finiteOrNull(context.radiationPressure) ?? 1);
  const waterContact = clamp01(finiteOrNull(context.waterContact) ?? 0);
  const ambientTemperatureK = Math.max(1, finiteOrNull(context.ambientTemperatureK) ?? 294);
  const meanMaterialTemperatureK = Math.max(1, finiteOrNull(context.meanMaterialTemperatureK) ?? ambientTemperatureK);

  const heatingPerCell = Math.max(0, netHeatingPower) / cellCount;
  const coolingPerCell = Math.max(0, -netHeatingPower) / cellCount;
  const materialTemperatureExcess = Math.max(0, meanMaterialTemperatureK - ambientTemperatureK);
  const absorption = clamp01(1 - waterContact * waterAttenuationGain);
  const flux = (
    heatingPerCell * netHeatingGain
    + greenhouseFactor * greenhouseGain
    + Math.max(0, stellarFlux - 1) * stellarFluxGain
    + Math.max(0, radiationPressure - 1) * radiationPressureGain
    + materialTemperatureExcess * materialTemperatureGain
    - coolingPerCell * coolingLossGain
  ) * absorption;
  return clampNumber(flux, 0, maxFluxWm2Proxy);
}

function applyStellarRadiationPressureResponse(sourceLuminosityFactor, transform) {
  const parameters = transform?.parameters || {};
  const context = transform?.context || {};
  const currentPressureCarry = clamp01(finiteOrNull(parameters.currentPressureCarry) ?? 0.32);
  const luminosityGain = Math.max(0, finiteOrNull(parameters.luminosityGain) ?? 0.58);
  const fusionPowerReference = Math.max(0.001, finiteOrNull(parameters.fusionPowerReference) ?? 1800);
  const fusionPowerGain = Math.max(0, finiteOrNull(parameters.fusionPowerGain) ?? 0.22);
  const coreTemperatureReferenceK = Math.max(1, finiteOrNull(parameters.coreTemperatureReferenceK) ?? 15000000);
  const coreTemperatureGain = Math.max(0, finiteOrNull(parameters.coreTemperatureGain) ?? 0.18);
  const stellarFluxGain = Math.max(0, finiteOrNull(parameters.stellarFluxGain) ?? 0.16);
  const opacityTrapGain = Math.max(0, finiteOrNull(parameters.opacityTrapGain) ?? 0.12);
  const opticalDepthReference = Math.max(0.001, finiteOrNull(parameters.opticalDepthReference) ?? 2);
  const maxRadiationPressure = Math.max(0.001, finiteOrNull(parameters.maxRadiationPressure) ?? 3.2);
  const luminosityFactor = Math.max(0, finiteOrNull(sourceLuminosityFactor) ?? 0);
  const currentRadiationPressure = Math.max(0, finiteOrNull(context.radiationPressure) ?? 0);
  const fusionPowerProxy = Math.max(0, finiteOrNull(context.fusionPowerProxy) ?? 0);
  const coreTemperatureK = Math.max(1, finiteOrNull(context.coreTemperatureK) ?? coreTemperatureReferenceK);
  const stellarFlux = Math.max(0, finiteOrNull(context.stellarFlux) ?? 1);
  const opticalDepth = Math.max(0, finiteOrNull(context.opticalDepth) ?? 0);
  const meanOpacity = Math.max(0, finiteOrNull(context.meanOpacity) ?? 0);

  const luminosityDrive = luminosityFactor * luminosityGain;
  const fusionDrive = clamp01(fusionPowerProxy / fusionPowerReference) * fusionPowerGain;
  const coreTemperatureDrive = Math.max(0, (coreTemperatureK / coreTemperatureReferenceK) - 1) * coreTemperatureGain;
  const stellarFluxDrive = Math.max(0, stellarFlux - 1) * stellarFluxGain;
  const opacityTrapDrive = clamp01((opticalDepth + meanOpacity) / opticalDepthReference) * opacityTrapGain;
  const response = currentRadiationPressure * currentPressureCarry
    + luminosityDrive
    + fusionDrive
    + coreTemperatureDrive
    + stellarFluxDrive
    + opacityTrapDrive;
  return clampNumber(response, 0, maxRadiationPressure);
}

function magnitude3(value) {
  if (!Array.isArray(value)) return 0;
  const x = finiteOrNull(value[0]) ?? 0;
  const y = finiteOrNull(value[1]) ?? 0;
  const z = finiteOrNull(value[2]) ?? 0;
  return Math.sqrt(x * x + y * y + z * z);
}

function applyMaxwellMagnetosphereBoundaryResponse(sourceFieldEnergy, transform) {
  const parameters = transform?.parameters || {};
  const context = transform?.context || {};
  const currentMagneticEnergyCarry = clamp01(finiteOrNull(parameters.currentMagneticEnergyCarry) ?? 0.26);
  const fieldEnergyReference = Math.max(0.001, finiteOrNull(parameters.fieldEnergyReference) ?? 1.2);
  const fieldEnergyGain = Math.max(0, finiteOrNull(parameters.fieldEnergyGain) ?? 0.62);
  const poyntingReference = Math.max(0.001, finiteOrNull(parameters.poyntingReference) ?? 1.25);
  const poyntingGain = Math.max(0, finiteOrNull(parameters.poyntingGain) ?? 0.24);
  const solarWindPressureGain = Math.max(0, finiteOrNull(parameters.solarWindPressureGain) ?? 0.08);
  const reconnectionGain = Math.max(0, finiteOrNull(parameters.reconnectionGain) ?? 0.1);
  const radiationPressureGain = Math.max(0, finiteOrNull(parameters.radiationPressureGain) ?? 0.06);
  const stellarFluxGain = Math.max(0, finiteOrNull(parameters.stellarFluxGain) ?? 0.04);
  const maxMagneticEnergy = Math.max(0.001, finiteOrNull(parameters.maxMagneticEnergy) ?? 4);
  const fieldEnergy = Math.max(0, finiteOrNull(sourceFieldEnergy) ?? 0);
  const currentMagneticEnergy = Math.max(0, finiteOrNull(context.magneticEnergy) ?? 0);
  const poyntingMagnitude = magnitude3(context.poyntingFlux);
  const solarWindPressure = Math.max(0, finiteOrNull(context.solarWindPressure) ?? 0);
  const reconnectionRate = Math.max(0, finiteOrNull(context.reconnectionRate) ?? 0);
  const radiationPressure = Math.max(0, finiteOrNull(context.radiationPressure) ?? 1);
  const stellarFlux = Math.max(0, finiteOrNull(context.stellarFlux) ?? 1);

  const fieldDrive = (fieldEnergy / (fieldEnergyReference + fieldEnergy)) * fieldEnergyGain;
  const poyntingDrive = (poyntingMagnitude / (poyntingReference + poyntingMagnitude)) * poyntingGain;
  const solarWindDrive = clamp01(solarWindPressure / 4) * solarWindPressureGain;
  const reconnectionDrive = clamp01(reconnectionRate) * reconnectionGain;
  const radiationDrive = Math.max(0, radiationPressure - 1) * radiationPressureGain;
  const stellarFluxDrive = Math.max(0, stellarFlux - 1) * stellarFluxGain;
  const response = currentMagneticEnergy * currentMagneticEnergyCarry
    + fieldDrive
    + poyntingDrive
    + solarWindDrive
    + reconnectionDrive
    + radiationDrive
    + stellarFluxDrive;
  return clampNumber(response, 0, maxMagneticEnergy);
}

function applyPicMhdReconnectionFeedback(sourceReconnectionHeating, transform) {
  const parameters = transform?.parameters || {};
  const context = transform?.context || {};
  const currentReconnectionCarry = clamp01(finiteOrNull(parameters.currentReconnectionCarry) ?? 0.44);
  const heatingReference = Math.max(0.000001, finiteOrNull(parameters.heatingReference) ?? 0.018);
  const heatingGain = Math.max(0, finiteOrNull(parameters.heatingGain) ?? 0.34);
  const currentDensityReference = Math.max(0.000001, finiteOrNull(parameters.currentDensityReference) ?? 0.12);
  const currentDensityGain = Math.max(0, finiteOrNull(parameters.currentDensityGain) ?? 0.22);
  const fieldEnergyReference = Math.max(0.000001, finiteOrNull(parameters.fieldEnergyReference) ?? 1.6);
  const fieldEnergyGain = Math.max(0, finiteOrNull(parameters.fieldEnergyGain) ?? 0.12);
  const chargeImbalanceReference = Math.max(0.000001, finiteOrNull(parameters.chargeImbalanceReference) ?? 0.12);
  const chargeImbalanceGain = Math.max(0, finiteOrNull(parameters.chargeImbalanceGain) ?? 0.06);
  const chargeSeparationGain = Math.max(0, finiteOrNull(parameters.chargeSeparationGain) ?? 0.07);
  const escapeGain = Math.max(0, finiteOrNull(parameters.escapeGain) ?? 0.08);
  const currentSheetGain = Math.max(0, finiteOrNull(parameters.currentSheetGain) ?? 0.04);
  const solarWindPressureGain = Math.max(0, finiteOrNull(parameters.solarWindPressureGain) ?? 0.05);
  const divergenceReference = Math.max(0.000001, finiteOrNull(parameters.divergenceReference) ?? 0.08);
  const divergenceLossGain = Math.max(0, finiteOrNull(parameters.divergenceLossGain) ?? 0.05);
  const maxReconnectionRate = Math.max(0.001, finiteOrNull(parameters.maxReconnectionRate) ?? 4);

  const reconnectionHeating = Math.max(0, finiteOrNull(sourceReconnectionHeating) ?? 0);
  const currentReconnectionRate = Math.max(0, finiteOrNull(context.reconnectionRate) ?? 0);
  const currentDensity = Math.max(0, finiteOrNull(context.currentDensity) ?? 0);
  const fieldEnergy = Math.max(0, finiteOrNull(context.fieldEnergy) ?? 0);
  const chargeImbalance = Math.abs(finiteOrNull(context.chargeImbalance) ?? 0);
  const chargeSeparation = clamp01(finiteOrNull(context.chargeSeparation) ?? 0);
  const particleEscapeFraction = clamp01(finiteOrNull(context.particleEscapeFraction) ?? 0);
  const currentSheetIntensity = Math.max(0, finiteOrNull(context.currentSheetIntensity) ?? 0);
  const solarWindPressure = Math.max(0, finiteOrNull(context.solarWindPressure) ?? 0);
  const divergenceEProxy = Math.abs(finiteOrNull(context.divergenceEProxy) ?? 0);

  const heatingDrive = (reconnectionHeating / (heatingReference + reconnectionHeating)) * heatingGain;
  const currentDrive = (currentDensity / (currentDensityReference + currentDensity)) * currentDensityGain;
  const fieldDrive = (fieldEnergy / (fieldEnergyReference + fieldEnergy)) * fieldEnergyGain;
  const chargeDrive = clamp01(chargeImbalance / chargeImbalanceReference) * chargeImbalanceGain
    + chargeSeparation * chargeSeparationGain;
  const escapeDrive = particleEscapeFraction * escapeGain;
  const currentSheetDrive = clamp01(currentSheetIntensity / 2) * currentSheetGain;
  const solarWindDrive = clamp01(solarWindPressure / 6) * solarWindPressureGain;
  const divergenceLoss = clamp01(divergenceEProxy / divergenceReference) * divergenceLossGain;
  const response = currentReconnectionRate * currentReconnectionCarry
    + heatingDrive
    + currentDrive
    + fieldDrive
    + chargeDrive
    + escapeDrive
    + currentSheetDrive
    + solarWindDrive
    - divergenceLoss;
  return clampNumber(response, 0, maxReconnectionRate);
}

function applyNamedAdapterEquation(value, transform) {
  switch (transform?.adapterEquationId) {
    case 'peercompute.multiscale.adapter.molecular-reactive-thermal-source-response.v0':
      return applyMolecularReactiveThermalSourceResponse(value, transform);
    case 'peercompute.multiscale.adapter.thermal-ignition-response.v0':
      return applyThermalIgnitionResponse(value, transform);
    case 'peercompute.multiscale.adapter.sph-water-suppression-response.v0':
      return applySphWaterSuppressionResponse(value, transform);
    case 'peercompute.multiscale.adapter.membrane-rupture-spill-response.v0':
      return applyMembraneRuptureSpillResponse(value, transform);
    case 'peercompute.multiscale.adapter.plume-weather-cloud-response.v0':
      return applyPlumeWeatherCloudResponse(value, transform);
    case 'peercompute.multiscale.adapter.radiation-surface-heat-response.v0':
      return applyRadiationSurfaceHeatResponse(value, transform);
    case 'peercompute.multiscale.adapter.stellar-radiation-pressure-response.v0':
      return applyStellarRadiationPressureResponse(value, transform);
    case 'peercompute.multiscale.adapter.maxwell-magnetosphere-boundary-response.v0':
      return applyMaxwellMagnetosphereBoundaryResponse(value, transform);
    case 'peercompute.multiscale.adapter.pic-mhd-reconnection-feedback.v0':
      return applyPicMhdReconnectionFeedback(value, transform);
    default:
      return null;
  }
}

function findDescriptorField(solverId, field) {
  const descriptor = MULTISCALE_SOLVER_DESCRIPTORS.find((entry) => entry.id === solverId);
  if (!descriptor) return null;
  const candidates = [
    ...(descriptor.inputFields || []),
    ...(descriptor.outputFields || [])
  ];
  const alias = FIELD_ALIASES.get(`${solverId}:${field}`);
  return candidates.find((candidate) => candidate.name === field)
    || candidates.find((candidate) => candidate.name === alias)
    || null;
}

function inferQuantity(field) {
  return String(field || 'unknown')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .toLowerCase();
}

function unitStatusFor(unit, dimensions) {
  if (!unit || unit === 'unknown') return 'unknown';
  if (unit.includes('proxy') || unit === 'reduced') return 'reduced-proxy';
  if (unit === 'mixed' || dimensions === 'mixed') return 'mixed';
  if (unit === '1') return 'dimensionless';
  return 'physical';
}

export function describeMultiscaleField({
  solverId = 'unknown',
  field = 'unknown',
  layer = 'unknown',
  role = 'unspecified',
  fallbackUnit = 'reduced',
  fallbackDimensions = 'mixed',
  fallbackLocation = 'region',
  quantity = null
} = {}) {
  const override = FIELD_OVERRIDES.get(`${solverId}:${field}`);
  const descriptorField = findDescriptorField(solverId, field);
  const base = override || descriptorField || {
    ...UNKNOWN_FIELD,
    unit: fallbackUnit || UNKNOWN_FIELD.unit,
    dimensions: fallbackDimensions || UNKNOWN_FIELD.dimensions,
    location: fallbackLocation || UNKNOWN_FIELD.location,
    confidence: fallbackUnit && fallbackUnit !== 'unknown' ? 0.18 : 0
  };
  const unit = base.unit || fallbackUnit || 'unknown';
  const dimensions = base.dimensions || fallbackDimensions || 'unknown';
  const unitStatus = base.unitStatus || unitStatusFor(unit, dimensions);
  return {
    schema: MULTISCALE_FIELD_METADATA_SCHEMA,
    solverId,
    field,
    canonicalField: descriptorField?.name || field,
    layer,
    role,
    quantity: quantity || base.quantity || inferQuantity(field),
    unit,
    dimensions,
    location: base.location || fallbackLocation || 'region',
    unitStatus,
    metadataSource: override ? 'runtime-override' : descriptorField ? 'solver-descriptor' : 'fallback',
    confidence: Number(Number(base.confidence ?? (descriptorField ? 0.52 : 0.18)).toFixed(3))
  };
}

export function createFieldMetadataReport(fields = []) {
  const normalized = fields
    .filter(Boolean)
    .map((field) => field.schema === MULTISCALE_FIELD_METADATA_SCHEMA
      ? cloneJson(field)
      : describeMultiscaleField(field));
  const unique = [];
  const seen = new Set();
  for (const field of normalized) {
    const key = `${field.solverId}:${field.field}:${field.role}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(field);
  }
  return {
    schema: MULTISCALE_FIELD_METADATA_REPORT_SCHEMA,
    mode: 'descriptor-backed-with-runtime-overrides',
    fieldCount: unique.length,
    physicalFieldCount: unique.filter((field) => field.unitStatus === 'physical').length,
    proxyFieldCount: unique.filter((field) => field.unitStatus === 'reduced-proxy').length,
    dimensionlessFieldCount: unique.filter((field) => field.unitStatus === 'dimensionless').length,
    mixedFieldCount: unique.filter((field) => field.unitStatus === 'mixed' || field.dimensions === 'mixed').length,
    fallbackFieldCount: unique.filter((field) => field.metadataSource === 'fallback').length,
    units: countBy(unique, (field) => field.unit),
    dimensions: countBy(unique, (field) => field.dimensions),
    fields: unique
  };
}

function normalizeMetadata(value) {
  if (!value) {
    return describeMultiscaleField();
  }
  if (value.schema === MULTISCALE_FIELD_METADATA_SCHEMA) {
    return cloneJson(value);
  }
  return describeMultiscaleField(value);
}

export function evaluateFieldCompatibility({
  id = 'unknown-field-link',
  source = null,
  sourceMetadata = null,
  target = null,
  targetMetadata = null,
  policy = 'proxy-adapter-required'
} = {}) {
  const sourceField = normalizeMetadata(sourceMetadata || source?.metadata || source);
  const targetField = normalizeMetadata(targetMetadata || target?.metadata || target);
  const sourceDimensions = sourceField.dimensions || 'unknown';
  const targetDimensions = targetField.dimensions || 'unknown';
  const sourceUnit = sourceField.unit || 'unknown';
  const targetUnit = targetField.unit || 'unknown';
  const dimensionsMatch = sourceDimensions === targetDimensions;
  const unitsMatch = sourceUnit === targetUnit;
  const proxyInvolved = isProxyLike(sourceField) || isProxyLike(targetField);
  const dimensionlessInvolved = isDimensionlessLike(sourceField) || isDimensionlessLike(targetField);
  const bothPhysical = isPhysicalLike(sourceField) && isPhysicalLike(targetField);
  const metadataIncomplete = sourceDimensions === 'unknown'
    || targetDimensions === 'unknown'
    || sourceUnit === 'unknown'
    || targetUnit === 'unknown';

  let status = 'compatible';
  let severity = 'ok';
  let adapterRequired = false;
  let reason = 'source and target units/dimensions match';

  if (metadataIncomplete) {
    status = 'metadata-incomplete';
    severity = 'warning';
    adapterRequired = true;
    reason = 'source or target is missing unit/dimension metadata';
  } else if (dimensionsMatch && unitsMatch) {
    status = 'compatible';
  } else if (dimensionsMatch) {
    status = 'unit-conversion-required';
    severity = bothPhysical ? 'warning' : 'info';
    adapterRequired = true;
    reason = 'dimensions match but units differ';
  } else if (bothPhysical) {
    status = 'dimension-mismatch';
    severity = 'error';
    adapterRequired = true;
    reason = 'physical source and target dimensions differ';
  } else if (proxyInvolved) {
    status = 'proxy-adapter-required';
    severity = 'info';
    adapterRequired = true;
    reason = 'proxy or mixed-dimension handoff requires an explicit adapter before scientific use';
  } else if (dimensionlessInvolved) {
    status = 'dimensionless-adapter-required';
    severity = 'info';
    adapterRequired = true;
    reason = 'dimensionless/count field is being mapped into a different dimensional quantity';
  } else {
    status = 'adapter-required';
    severity = 'warning';
    adapterRequired = true;
    reason = 'source and target dimensions differ';
  }

  return {
    schema: MULTISCALE_FIELD_COMPATIBILITY_SCHEMA,
    id,
    policy,
    status,
    severity,
    adapterRequired,
    dimensionsMatch,
    unitsMatch,
    source: {
      solverId: sourceField.solverId,
      field: sourceField.field,
      unit: sourceUnit,
      dimensions: sourceDimensions,
      unitStatus: sourceField.unitStatus,
      metadataSource: sourceField.metadataSource
    },
    target: {
      solverId: targetField.solverId,
      field: targetField.field,
      unit: targetUnit,
      dimensions: targetDimensions,
      unitStatus: targetField.unitStatus,
      metadataSource: targetField.metadataSource
    },
    reason
  };
}

export function createFieldCompatibilityReport(pairs = []) {
  const checks = pairs
    .filter(Boolean)
    .map((pair) => evaluateFieldCompatibility(pair));
  const statusCounts = countBy(checks, (check) => check.status);
  const severityCounts = countBy(checks, (check) => check.severity);
  const criticalIssueCount = checks.filter((check) => check.severity === 'error').length;
  const warningIssueCount = checks.filter((check) => check.severity === 'warning').length;
  const adapterRequiredCount = checks.filter((check) => check.adapterRequired).length;
  const compatibleCount = checks.filter((check) => check.status === 'compatible').length;
  const proxyAdapterCount = checks.filter((check) => check.status === 'proxy-adapter-required').length;
  const unitConversionCount = checks.filter((check) => check.status === 'unit-conversion-required').length;
  return {
    schema: MULTISCALE_FIELD_COMPATIBILITY_REPORT_SCHEMA,
    mode: 'unit-dimension-contract-check',
    checkCount: checks.length,
    compatibleCount,
    adapterRequiredCount,
    proxyAdapterCount,
    unitConversionCount,
    criticalIssueCount,
    warningIssueCount,
    status: criticalIssueCount > 0
      ? 'dimension-errors'
      : adapterRequiredCount > 0
        ? 'adapters-required'
        : 'compatible',
    statusCounts,
    severityCounts,
    checks,
    warnings: [
      'Compatibility checks validate packet metadata shape only; they do not prove a physical transfer operator.',
      'Proxy and mixed-dimension links must be replaced by named adapters before scientific-mode conservative coupling.'
    ]
  };
}

export function createFieldAdapterPlan(checkOrPair = {}) {
  const check = checkOrPair?.schema === MULTISCALE_FIELD_COMPATIBILITY_SCHEMA
    ? cloneJson(checkOrPair)
    : evaluateFieldCompatibility(checkOrPair);
  const source = summarizeCompatibilitySource(check.source);
  const target = summarizeCompatibilitySource(check.target);
  const namedAdapter = NAMED_FIELD_ADAPTERS.get(check.id);
  const adapterKind = namedAdapter?.adapterKind || adapterKindForCompatibility(check);
  const conversion = findUnitConversion(source.unit, target.unit);
  const sourcePhysical = source.unitStatus === 'physical';
  const targetPhysical = target.unitStatus === 'physical';
  const physicalHandoff = sourcePhysical && targetPhysical;

  let status = 'stub-required';
  let executionMode = 'requires-named-adapter';
  let transform = null;
  let scientificModeReady = false;
  let conservativeTransferReady = false;
  let reason = check.reason || 'adapter status derived from field compatibility';

  if (check.status === 'dimension-mismatch' || check.status === 'metadata-incomplete') {
    status = 'blocked';
    executionMode = check.status === 'dimension-mismatch'
      ? 'blocked-physical-dimension-mismatch'
      : 'blocked-metadata-incomplete';
    reason = check.reason;
  } else if (namedAdapter) {
    status = 'ready';
    executionMode = namedAdapter.executionMode;
    transform = {
      mode: 'named-equation',
      adapterEquationId: namedAdapter.adapterEquationId,
      equationType: namedAdapter.equationType,
      sourceSinkMode: namedAdapter.sourceSinkMode,
      parameters: cloneJson(namedAdapter.parameters),
      sourceUnit: source.unit,
      targetUnit: target.unit,
      sourceDimensions: source.dimensions,
      targetDimensions: target.dimensions
    };
    scientificModeReady = false;
    conservativeTransferReady = false;
    reason = namedAdapter.reason;
  } else if (check.status === 'compatible') {
    status = 'ready';
    executionMode = 'identity-pass-through';
    transform = {
      mode: 'identity',
      scale: 1,
      offset: 0,
      sourceUnit: source.unit,
      targetUnit: target.unit,
      dimensions: source.dimensions
    };
    scientificModeReady = physicalHandoff;
    conservativeTransferReady = physicalHandoff;
    reason = physicalHandoff
      ? 'physical source and target match exactly'
      : 'metadata-compatible pass-through; scientific mode still needs a named semantics check';
  } else if (check.status === 'unit-conversion-required') {
    executionMode = 'affine-unit-conversion';
    if (conversion) {
      status = 'ready';
      transform = {
        mode: conversion.offset === 0 ? 'scale' : 'affine',
        scale: conversion.scale,
        offset: conversion.offset,
        precision: conversion.precision,
        sourceUnit: source.unit,
        targetUnit: target.unit,
        dimensions: source.dimensions
      };
      scientificModeReady = physicalHandoff;
      conservativeTransferReady = physicalHandoff;
      reason = 'known unit conversion available for matching dimensions';
    } else {
      status = 'stub-required';
      transform = {
        mode: 'missing-unit-conversion',
        sourceUnit: source.unit,
        targetUnit: target.unit,
        dimensions: source.dimensions
      };
      reason = 'dimensions match but no explicit conversion rule is registered';
    }
  }

  const adapterId = `${check.id}:${adapterKind}`;
  return {
    schema: MULTISCALE_FIELD_ADAPTER_SCHEMA,
    id: check.id,
    adapterId,
    adapterKind,
    status,
    executionMode,
    source,
    target,
    compatibilityStatus: check.status,
    compatibilitySeverity: check.severity,
    adapterRequired: check.adapterRequired,
    transform,
    namedAdapterEquation: namedAdapter ? {
      adapterEquationId: namedAdapter.adapterEquationId,
      equationType: namedAdapter.equationType,
      sourceSinkMode: namedAdapter.sourceSinkMode,
      validationStatus: namedAdapter.validationStatus,
      calibrationStatus: namedAdapter.calibrationStatus
    } : null,
    scientificModeReady,
    conservativeTransferReady,
    requiresCalibration: status === 'stub-required' || Boolean(namedAdapter?.calibrationStatus === 'uncalibrated'),
    validationGates: namedAdapter ? [...namedAdapter.validationGates] : validationGatesForAdapter(status),
    reason
  };
}

export function createFieldAdapterPlanReport(input = []) {
  const checks = Array.isArray(input)
    ? input.map((entry) => (entry?.schema === MULTISCALE_FIELD_COMPATIBILITY_SCHEMA
      ? cloneJson(entry)
      : evaluateFieldCompatibility(entry)))
    : Array.isArray(input?.checks)
      ? input.checks.map((entry) => cloneJson(entry))
      : [];
  const adapters = checks.map((check) => createFieldAdapterPlan(check));
  const statusCounts = countBy(adapters, (adapter) => adapter.status);
  const kindCounts = countBy(adapters, (adapter) => adapter.adapterKind);
  const readyAdapterCount = adapters.filter((adapter) => adapter.status === 'ready').length;
  const identityAdapterCount = adapters.filter((adapter) => adapter.adapterKind === 'identity').length;
  const unitConversionAdapterCount = adapters.filter((adapter) => adapter.adapterKind === 'unit-conversion').length;
  const readyUnitConversionCount = adapters.filter((adapter) => (
    adapter.adapterKind === 'unit-conversion'
    && adapter.status === 'ready'
  )).length;
  const namedAdapterCount = adapters.filter((adapter) => adapter.namedAdapterEquation).length;
  const readyNamedAdapterCount = adapters.filter((adapter) => (
    adapter.namedAdapterEquation
    && adapter.status === 'ready'
  )).length;
  const stubRequiredCount = adapters.filter((adapter) => adapter.status === 'stub-required').length;
  const blockedAdapterCount = adapters.filter((adapter) => adapter.status === 'blocked').length;
  const conservativeReadyCount = adapters.filter((adapter) => adapter.conservativeTransferReady).length;
  const scientificModeReadyCount = adapters.filter((adapter) => adapter.scientificModeReady).length;
  return {
    schema: MULTISCALE_FIELD_ADAPTER_PLAN_SCHEMA,
    mode: 'metadata-derived-adapter-plan',
    adapterCount: adapters.length,
    readyAdapterCount,
    identityAdapterCount,
    unitConversionAdapterCount,
    readyUnitConversionCount,
    namedAdapterCount,
    readyNamedAdapterCount,
    stubRequiredCount,
    blockedAdapterCount,
    conservativeReadyCount,
    scientificModeReadyCount,
    status: blockedAdapterCount > 0
      ? 'blocked'
      : stubRequiredCount > 0
        ? 'adapter-stubs-required'
        : unitConversionAdapterCount > 0
          ? 'ready-with-unit-conversions'
          : 'ready',
    statusCounts,
    kindCounts,
    adapters,
    warnings: [
      'Adapter plans are metadata-derived execution contracts; proxy stubs are not physical transfer laws.',
      'Scientific mode must replace stub-required adapters with named equations, validation tolerances, and conservation-impact tests.'
    ]
  };
}

export function createFieldTransfer({ link = null, adapter = null } = {}) {
  const sourceValue = finiteOrNull(link?.source?.value);
  const observedTargetValue = finiteOrNull(link?.target?.value);
  const transform = adapter?.transform
    ? {
      ...cloneJson(adapter.transform),
      context: link?.adapterContext ? cloneJson(link.adapterContext) : cloneJson(adapter.transform.context || {})
    }
    : null;
  const transformedValue = adapter?.status === 'ready'
    ? applyAdapterTransform(sourceValue, transform)
    : null;
  const executable = adapter?.status === 'ready' && transformedValue !== null;
  const residual = executable && observedTargetValue !== null
    ? transformedValue - observedTargetValue
    : null;
  const relativeResidual = residual !== null
    ? Math.abs(residual) / Math.max(Math.abs(transformedValue), Math.abs(observedTargetValue), 1)
    : null;
  const skippedReason = adapter?.status === 'stub-required'
    ? 'adapter-stub-required'
    : adapter?.status === 'blocked'
      ? 'adapter-blocked'
      : sourceValue === null
        ? 'non-finite-source-value'
        : 'adapter-unavailable';
  const status = executable
    ? 'executed'
    : adapter?.status === 'stub-required'
      ? 'skipped-stub'
      : adapter?.status === 'blocked'
        ? 'blocked'
        : 'skipped';

  return {
    schema: MULTISCALE_FIELD_TRANSFER_SCHEMA,
    id: adapter?.id || link?.id || 'unknown-field-transfer',
    adapterId: adapter?.adapterId || null,
    adapterKind: adapter?.adapterKind || 'unknown',
    status,
    executionMode: adapter?.executionMode || 'unknown',
    namedAdapterEquation: adapter?.namedAdapterEquation ? cloneJson(adapter.namedAdapterEquation) : null,
    direction: link?.direction || 'unknown',
    source: {
      solverId: adapter?.source?.solverId || link?.source?.solver || 'unknown',
      field: adapter?.source?.field || link?.source?.field || 'unknown',
      value: rounded(sourceValue),
      unit: adapter?.source?.unit || link?.source?.unit || 'unknown',
      dimensions: adapter?.source?.dimensions || link?.source?.dimensions || 'unknown'
    },
    target: {
      solverId: adapter?.target?.solverId || link?.target?.solver || 'unknown',
      field: adapter?.target?.field || link?.target?.field || 'unknown',
      observedValue: rounded(observedTargetValue),
      predictedValue: rounded(transformedValue),
      residual: rounded(residual),
      relativeResidual: rounded(relativeResidual),
      unit: adapter?.target?.unit || link?.target?.unit || 'unknown',
      dimensions: adapter?.target?.dimensions || link?.target?.dimensions || 'unknown'
    },
    transform,
    conservativeTransferReady: Boolean(adapter?.conservativeTransferReady),
    scientificModeReady: Boolean(adapter?.scientificModeReady),
    conservationImpact: {
      mode: adapter?.conservativeTransferReady
        ? 'conservative-transform-ready'
        : adapter?.namedAdapterEquation && executable
          ? 'named-open-system-response'
        : executable
          ? 'interactive-scalar-transfer'
          : 'not-executed',
      trackedQuantities: Array.isArray(link?.conservation) ? [...link.conservation] : [],
      sourceSinkMode: adapter?.transform?.sourceSinkMode || adapter?.namedAdapterEquation?.sourceSinkMode || null,
      requiresSourceSinkAudit: Boolean(adapter?.conservativeTransferReady || adapter?.namedAdapterEquation || link?.conservation?.length)
    },
    skippedReason: executable ? null : skippedReason
  };
}

export function createFieldTransferReport({ links = [], fieldAdapterPlan = null } = {}) {
  const adapters = Array.isArray(fieldAdapterPlan?.adapters) ? fieldAdapterPlan.adapters : [];
  const adapterById = new Map(adapters.map((adapter) => [adapter.id, adapter]));
  const transfers = links
    .filter(Boolean)
    .map((link) => createFieldTransfer({
      link,
      adapter: adapterById.get(link.id)
    }));
  const executedTransfers = transfers.filter((transfer) => transfer.status === 'executed');
  const skippedStubTransfers = transfers.filter((transfer) => transfer.status === 'skipped-stub');
  const blockedTransfers = transfers.filter((transfer) => transfer.status === 'blocked');
  const conservativeExecutedTransfers = executedTransfers
    .filter((transfer) => transfer.conservativeTransferReady);
  const namedExecutedTransfers = executedTransfers
    .filter((transfer) => transfer.namedAdapterEquation);
  const residualTransfers = executedTransfers
    .filter((transfer) => Number.isFinite(Number(transfer.target.residual)));
  const residualMagnitudes = residualTransfers
    .map((transfer) => Math.abs(Number(transfer.target.residual)));
  const maxAbsResidual = residualMagnitudes.length > 0 ? Math.max(...residualMagnitudes) : 0;
  const meanAbsResidual = residualMagnitudes.length > 0
    ? residualMagnitudes.reduce((sum, value) => sum + value, 0) / residualMagnitudes.length
    : 0;

  return {
    schema: MULTISCALE_FIELD_TRANSFER_REPORT_SCHEMA,
    mode: 'ready-adapter-scalar-execution',
    transferCount: transfers.length,
    executedTransferCount: executedTransfers.length,
    skippedStubTransferCount: skippedStubTransfers.length,
    blockedTransferCount: blockedTransfers.length,
    conservativeExecutedTransferCount: conservativeExecutedTransfers.length,
    namedExecutedTransferCount: namedExecutedTransfers.length,
    residualCount: residualTransfers.length,
    maxAbsResidual: rounded(maxAbsResidual),
    meanAbsResidual: rounded(meanAbsResidual),
    status: blockedTransfers.length > 0
      ? 'blocked'
      : skippedStubTransfers.length > 0
        ? 'partial-with-stubs'
        : 'executed',
    statusCounts: countBy(transfers, (transfer) => transfer.status),
    transfers,
    warnings: [
      'Transfer reports execute only ready scalar identity/unit transforms; they do not mutate solver state.',
      'Skipped proxy stubs must be replaced by named physical adapters before scientific-mode coupling.'
    ]
  };
}
