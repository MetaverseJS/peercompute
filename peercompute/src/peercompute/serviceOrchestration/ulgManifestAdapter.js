import { COMPUTE_SERVICE_MANIFEST_SCHEMA } from './ComputeServiceRegistry.js';

export const ULG_MANIFEST_ADAPTER_SCHEMA = 'peercompute.ulg.manifest-adapter.v0';
export const ULG_SERVICE_CONTRACT_ADAPTER_SCHEMA = 'peercompute.ulg.service-contract.v0.5';
export const ULG_TASK_CAPSULE_ADAPTER_SCHEMA = 'peercompute.ulg.task-capsule-adapter.v0';
export const ULG_ARTIFACT_RESULT_SCHEMA = 'peercompute.ulg.artifact-result.v0';
export const ULG_ARTIFACT_SUMMARY_SCHEMA = 'peercompute.ulg.artifact-summary.v0';
export const ULG_DEMO_HANDOFF_SCHEMA = 'peercompute.ulg.demo-handoff.v0';
export const ULG_DEMO_HANDOFF_ADAPTER_SCHEMA = 'peercompute.ulg.demo-handoff-adapter.v0';
export const ULG_HANDOFF_TRANSFER_MANIFEST_SCHEMA = 'peercompute.ulg.handoff-transfer-manifest.v0';
export const ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA = 'peercompute.ulg.handoff-service-envelope.v0';
export const ULG_QUANTUM_RESPONSE_DESCRIPTOR_SCHEMA = 'peercompute.ulg.quantum-response-descriptor.v0';
export const ULG_QUANTUM_RESPONSE_PARITY_SCHEMA = 'peercompute.ulg.quantum-response-parity.v0';
export const ULG_MAGNETAR_DIPOLE_ISING_CALIBRATION_SCHEMA = 'peercompute.ulg.magnetar-dipole-ising-calibration.v0';
export const ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA = 'eshkol.ulg.closure-output-semantics.v0';
export const ESHKOL_MAGNETAR_CLOSURE_DESCRIPTOR_SCHEMA = 'eshkol.ulg.magnetar-closure-descriptor.v0';
export const ESHKOL_PRODUCTION_HANDLER_BOUNDARY_SCHEMA = 'eshkol.ulg.production-handler-boundary.v0';
export const ESHKOL_PRODUCTION_HANDLER_IMPLEMENTATION_SCHEMA =
  'eshkol.ulg.production-handler-implementation.v0';
export const ESHKOL_PRODUCTION_HANDLER_RUNTIME_EXECUTION_SCHEMA =
  'eshkol.ulg.production-handler-runtime-execution.v0';
export const ESHKOL_FULL_PHYSICS_VALIDATION_REQUIREMENTS_SCHEMA =
  'eshkol.ulg.full-physics-validation-requirements.v0';
export const ESHKOL_PRODUCTION_HANDLER_DISPATCH_PREFLIGHT_SCHEMA = 'eshkol.ulg.production-handler-dispatch-preflight.v0';
export const ESHKOL_PRODUCTION_HOST_IMPORT_CANDIDATE_SCHEMA = 'eshkol.ulg.production-host-import-candidate.v0';
export const ESHKOL_PRODUCTION_CANDIDATE_RUNTIME_PROBE_SCHEMA =
  'eshkol.ulg.production-candidate-runtime-probe.v0';

const DEFAULT_PROTOCOL_VERSION = '0.5';
const MOONLAB_MAGNETAR_REFERENCE_SCHEMA = 'moonlab.magnetar-dipole-ising-reference.v0';
const MOONLAB_MAGNETAR_REFERENCE_ROLE = 'peercompute-reference-tolerance-input';
export const MOONLAB_WEBGPU_COMPLEX64_PARITY_SCOPE_SCHEMA = 'moonlab.webgpu.complex64-parity-scope.v0';
const MOONLAB_WEBGPU_REQUIRED_NATIVE_OPERATIONS = Object.freeze([
  'hadamard',
  'pauli_x',
  'pauli_z',
  'cnot'
]);
const MOONLAB_WEBGPU_REQUIRED_COVERAGE = Object.freeze([
  ...MOONLAB_WEBGPU_REQUIRED_NATIVE_OPERATIONS,
  'compute_probabilities'
]);
const ESHKOL_PRODUCTION_CANDIDATE_RUNTIME_PROBE_STATUS = 'production-candidate-runtime-smoke-passed';
const ESHKOL_PRODUCTION_CANDIDATE_RUNTIME_PROBE_EXECUTION_CLAIM =
  'production-candidate-host-import-runtime-smoke-only';
const ESHKOL_PRODUCTION_HANDLER_BOUNDARY_REQUIRED_BLOCKERS = Object.freeze([
  'full-physics-validation-not-run'
]);
const ESHKOL_FULL_PHYSICS_RUNTIME_EVIDENCE_FAMILIES = Object.freeze([
  'magnetosphere-mhd',
  'pic-kinetic-plasma',
  'radiation-transport',
  'relativistic-correction',
  'cross-family-conservation-coupling'
]);
const ESHKOL_FULL_PHYSICS_RUNTIME_EVIDENCE_SCHEMAS = Object.freeze([
  'peercompute.multiscale.magnetosphere-mhd.runtime-validation.v0',
  'peercompute.multiscale.pic-kinetic-plasma.runtime-validation.v0',
  'peercompute.multiscale.radiation-transport.runtime-validation.v0',
  'peercompute.multiscale.relativistic-correction.runtime-validation.v0',
  'peercompute.multiscale.cross-family-conservation-coupling.runtime-validation.v0'
]);
const ESHKOL_FULL_PHYSICS_REQUIRED_HASH_FIELDS = Object.freeze([
  'referenceHash',
  'toleranceHash',
  'runtimeOutputHash',
  'evidenceHash'
]);
const TASK_ARTIFACT_KIND = Object.freeze({
  'eshkol.closure.derive': 'closure',
  'moonlab.quantum.response': 'quantum-response'
});

function clonePlain(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function normalizeId(value, label) {
  const id = String(value || '').trim();
  if (!id) throw new Error(`${label} is required`);
  return id;
}

function normalizeStringList(value, label) {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  return value.map((entry) => String(entry || '').trim()).filter(Boolean);
}

function inferArtifactKind(output = {}, taskKind) {
  return String(output.artifactKind || TASK_ARTIFACT_KIND[taskKind] || 'artifact').trim();
}

function normalizeChildWorkers(childWorkers = {}) {
  return {
    ...clonePlain(childWorkers),
    allowed: childWorkers.allowed === true,
    maxChildren: Number.isInteger(childWorkers.maxChildren) ? Math.max(0, childWorkers.maxChildren) : 0,
    allowedModules: normalizeStringList(childWorkers.allowedModules || [], 'childWorkers.allowedModules'),
    sameOriginOnly: childWorkers.sameOriginOnly !== false
  };
}

function normalizeProtocolVersion(manifest = {}) {
  return String(
    manifest.protocolVersion
      || manifest.abi?.ulgIrVersion
      || manifest.abi?.gpuAbiVersion
      || DEFAULT_PROTOCOL_VERSION
  ).trim();
}

export function normalizeUlgArtifactOutputs(outputs = [], taskKind = '') {
  const source = Array.isArray(outputs) && outputs.length > 0
    ? outputs
    : [{ artifactKind: TASK_ARTIFACT_KIND[taskKind] || 'artifact' }];
  return source.map((output, index) => {
    const artifactKind = inferArtifactKind(output, taskKind);
    return {
      ...clonePlain(output),
      outputIndex: index,
      artifactKind,
      artifactSchema: output.artifactSchema || null,
      contentHash: output.contentHash || output.hash || null
    };
  });
}

export function normalizeUlgServiceManifest(manifest = {}, options = {}) {
  if (!manifest || typeof manifest !== 'object') {
    throw new Error('ULG service manifest is required');
  }
  const serviceId = normalizeId(manifest.serviceId, 'serviceId');
  const entry = clonePlain(manifest.entry || {});
  if (!entry.workerModule) {
    throw new Error(`ULG service ${serviceId} requires entry.workerModule`);
  }
  const capabilities = normalizeStringList(manifest.capabilities, 'capabilities');
  const taskKinds = normalizeStringList(manifest.taskKinds, 'taskKinds');
  if (capabilities.length === 0) {
    throw new Error(`ULG service ${serviceId} requires at least one capability`);
  }
  if (taskKinds.length === 0) {
    throw new Error(`ULG service ${serviceId} requires at least one task kind`);
  }

  const protocolVersion = normalizeProtocolVersion(manifest);
  const outputArtifactKinds = [...new Set(taskKinds.map((taskKind) => TASK_ARTIFACT_KIND[taskKind] || 'artifact'))];
  const serviceAssets = clonePlain(entry.serviceAssets || null);
  const validation = clonePlain(manifest.validation || {});
  const contract = clonePlain(options.contract || {
    schema: ULG_SERVICE_CONTRACT_ADAPTER_SCHEMA,
    protocolVersion,
    serviceId,
    capabilities,
    taskKinds,
    outputArtifactKinds,
    toleranceProfile: validation.toleranceProfile || null,
    serviceAssets: serviceAssets ? {
      serviceId: serviceAssets.serviceId || serviceId,
      baseUrl: serviceAssets.baseUrl || null,
      required: normalizeStringList(serviceAssets.required || [], 'entry.serviceAssets.required')
    } : null
  });

  return {
    schema: options.schema || COMPUTE_SERVICE_MANIFEST_SCHEMA,
    serviceId,
    version: manifest.version || `${protocolVersion}.0-ulg`,
    runtime: String(manifest.runtime || 'js').trim().toLowerCase(),
    entry,
    childWorkers: normalizeChildWorkers(manifest.childWorkers || {}),
    resources: clonePlain(manifest.resources || {}),
    capabilities,
    taskKinds,
    abi: clonePlain(manifest.abi || {}),
    contract,
    validation,
    metadata: {
      ...clonePlain(manifest.metadata || {}),
      adapter: ULG_MANIFEST_ADAPTER_SCHEMA,
      sourceSchema: 'compute_service_manifest',
      protocolVersion,
      originalServiceId: serviceId,
      serviceAssets,
      outputArtifactKinds
    }
  };
}

export const adaptUlgV05ComputeServiceManifest = normalizeUlgServiceManifest;

export function normalizeUlgTaskCapsule(capsule = {}, options = {}) {
  if (!capsule || typeof capsule !== 'object') {
    throw new Error('ULG task capsule is required');
  }
  const serviceId = normalizeId(capsule.serviceId, 'serviceId');
  const taskKind = normalizeId(capsule.taskKind, 'taskKind');
  const taskId = normalizeId(capsule.taskId, 'taskId');
  const rootTaskId = String(capsule.rootTaskId || taskId).trim();
  const outputs = normalizeUlgArtifactOutputs(capsule.outputs || [], taskKind);
  const task = {
    schema: ULG_TASK_CAPSULE_ADAPTER_SCHEMA,
    serviceId,
    taskKind,
    taskId,
    rootTaskId,
    capsule: clonePlain(capsule),
    inputs: clonePlain(capsule.inputs || []),
    outputs,
    artifactPlan: outputs.map((output) => ({
      outputIndex: output.outputIndex,
      artifactKind: output.artifactKind,
      artifactSchema: output.artifactSchema,
      contentHash: output.contentHash
    })),
    resources: clonePlain(capsule.resources || {}),
    validation: clonePlain(capsule.validation || {}),
    provenance: clonePlain(capsule.provenance || null)
  };
  const workerType = options.workerType || capsule.workerType;
  if (workerType) {
    task.workerType = String(workerType).trim().toLowerCase();
  }
  return task;
}

export const adaptUlgV05TaskCapsule = normalizeUlgTaskCapsule;

function finiteNumberOrNull(value) {
  if (value == null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function finiteWithinTolerance(value, tolerance) {
  const finiteValue = finiteNumberOrNull(value);
  const finiteTolerance = finiteNumberOrNull(tolerance);
  return finiteValue != null && finiteTolerance != null && finiteValue <= finiteTolerance;
}

function stringOrNull(value) {
  if (value == null) return null;
  const text = String(value).trim();
  return text || null;
}

function uniqueStrings(values = []) {
  return [...new Set(values.map((value) => stringOrNull(value)).filter(Boolean))];
}

function normalizeValidationStatus(validation = {}) {
  const explicitStatus = stringOrNull(validation?.status);
  if (explicitStatus) return explicitStatus;
  if (typeof validation?.parityPassed === 'boolean') return validation.parityPassed ? 'pass' : 'fail';
  if (typeof validation?.passed === 'boolean') return validation.passed ? 'pass' : 'fail';
  return null;
}

function plainObjectOrNull(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
}

function stringArray(value) {
  return Array.isArray(value) ? value.map((entry) => stringOrNull(entry)).filter(Boolean) : [];
}

function booleanOrNull(value) {
  return typeof value === 'boolean' ? value : null;
}

function firstPresent(...values) {
  return values.find((value) => value !== undefined && value !== null) ?? null;
}

function arrayValuesEqual(left = [], right = []) {
  return Array.isArray(left)
    && Array.isArray(right)
    && left.length === right.length
    && left.every((value, index) => value === right[index]);
}

function includesAll(values = [], required = []) {
  return required.every((entry) => values.includes(entry));
}

function hasSha256Digest(value) {
  return typeof value === 'string' && value.startsWith('sha256:');
}

function fieldDeltasWithinTolerances(observedDeltas = {}, tolerances = {}) {
  let checkedFieldCount = 0;
  for (const [field, observedDelta] of Object.entries(observedDeltas)) {
    const observed = finiteNumberOrNull(observedDelta);
    const toleranceConfig = tolerances[field];
    const tolerance = finiteNumberOrNull(
      toleranceConfig && typeof toleranceConfig === 'object'
        ? toleranceConfig.abs ?? toleranceConfig.absolute ?? toleranceConfig.value
        : toleranceConfig
    );
    if (observed == null || tolerance == null || tolerance < 0) return false;
    checkedFieldCount += 1;
    if (Math.abs(observed) > tolerance) return false;
  }
  return checkedFieldCount > 0;
}

function findMoonLabWebGpuParityScope(artifact = {}, outputs = {}) {
  const candidates = [
    artifact.webGpuParityScope,
    artifact.webgpuParityScope,
    artifact.webGpuComplex64ParityScope,
    artifact.webgpuComplex64ParityScope,
    artifact.validation?.webGpuParityScope,
    artifact.validation?.webgpuParityScope,
    artifact.runtime?.webGpuParityScope,
    artifact.runtime?.webgpuParityScope,
    outputs.webGpuParityScope,
    outputs.webgpuParityScope,
    outputs.webGpuComplex64ParityScope,
    outputs.webgpuComplex64ParityScope,
    outputs.parityScope
  ];
  return candidates
    .map((entry) => plainObjectOrNull(entry))
    .find((entry) => entry?.schema === MOONLAB_WEBGPU_COMPLEX64_PARITY_SCOPE_SCHEMA)
    || null;
}

function normalizeMoonLabWebGpuParityScope(scope = null) {
  if (!scope) return null;
  const contractValidation = plainObjectOrNull(scope.contractValidation) || {};
  const fidelityRuntimeScope = plainObjectOrNull(scope.fidelityRuntimeScope) || null;
  const webgpuParity = plainObjectOrNull(scope.webgpuParity) || {};
  const complex64Preflight = plainObjectOrNull(scope.complex64Preflight) || {};
  const browserBackendPreflight = plainObjectOrNull(scope.browserBackendPreflight) || {};
  const browserKernelProbe = plainObjectOrNull(scope.browserKernelProbe) || {};
  const browserNativeOperationProbe = plainObjectOrNull(scope.browserNativeOperationProbe) || {};
  const nativeOperationCoverage = stringArray(browserNativeOperationProbe.coveredNativeOperations);
  const browserKernelCoverage = stringArray(browserKernelProbe.coveredNativeOperations);
  const nativeCoverageEntries = Array.isArray(scope.coverage?.nativeWebGpu)
    ? scope.coverage.nativeWebGpu.map((entry) => plainObjectOrNull(entry)).filter(Boolean)
    : [];
  const nativeCoverageReady = MOONLAB_WEBGPU_REQUIRED_COVERAGE.every((operation) => {
    const entry = nativeCoverageEntries.find((coverageEntry) => coverageEntry.operation === operation);
    return entry?.covered === true
      && entry.required === true
      && entry.fallbackAllowed === false
      && entry.status === 'covered-by-browser-webgpu';
  });
  const nativeOperationResults = Array.isArray(browserNativeOperationProbe.operationResults)
    ? browserNativeOperationProbe.operationResults.map((entry) => plainObjectOrNull(entry)).filter(Boolean)
    : [];
  const nativeOperationResultsReady = MOONLAB_WEBGPU_REQUIRED_NATIVE_OPERATIONS.every((operation) => {
    const result = nativeOperationResults.find((entry) => entry.operation === operation);
    return result?.executed === true
      && result.passed === true
      && result.covered === true
      && stringOrNull(result.blocker) == null
      && finiteWithinTolerance(result.maxAmplitudeAbsDiff, result.tolerance);
  });
  const contractValidationValid = contractValidation.valid === true || contractValidation.passed === true;
  const evidenceBlockers = uniqueStrings([
    ...(Array.isArray(scope.blockers) ? scope.blockers : []),
    ...(Array.isArray(contractValidation.blockers) ? contractValidation.blockers : [])
  ]);
  const backendAvailable = scope.backendAvailable === true;
  const webgpuParityExecuted = webgpuParity.executed === true;
  const webgpuParityPassed = webgpuParity.passed === true;
  const noBackendEvidenceReady = scope.backendAvailable === false
    && webgpuParity.executed === false
    && webgpuParity.passed === false;
  const browserWebGpuEvidenceReady = scope.status === 'scope-ready-backend-detected'
    && backendAvailable
    && scope.requireBackend === true
    && webgpuParityExecuted
    && webgpuParityPassed
    && finiteWithinTolerance(webgpuParity.maxProbabilityAbsDiff, webgpuParity.tolerance)
    && browserBackendPreflight.stage === 'device-acquired'
    && browserBackendPreflight.navigatorGpuAvailable === true
    && browserBackendPreflight.adapterAvailable === true
    && browserBackendPreflight.deviceAcquired === true
    && browserKernelProbe.executed === true
    && browserKernelProbe.passed === true
    && browserKernelCoverage.includes('compute_probabilities')
    && finiteWithinTolerance(browserKernelProbe.maxProbabilityAbsDiff, browserKernelProbe.tolerance)
    && browserNativeOperationProbe.executed === true
    && browserNativeOperationProbe.passed === true
    && includesAll(nativeOperationCoverage, MOONLAB_WEBGPU_REQUIRED_NATIVE_OPERATIONS)
    && nativeOperationResultsReady
    && nativeCoverageReady
    && evidenceBlockers.length === 0;
  const preNormalizedEvidenceReady = scope.ready === true
    && Number(scope.validationBlockerCount || 0) === 0
    && scope.fullFidelityMagnetarSimulation === false
    && scope.fullPhysicsValidation === false
    && (noBackendEvidenceReady || (backendAvailable && webgpuParityExecuted && webgpuParityPassed));
  const validationBlockers = uniqueStrings([
    scope.schema === MOONLAB_WEBGPU_COMPLEX64_PARITY_SCOPE_SCHEMA
      ? null
      : 'moonlab-webgpu-complex64-parity-scope-schema-mismatch',
    scope.contractReady === true ? null : 'moonlab-webgpu-complex64-contract-not-ready',
    contractValidationValid ? null : 'moonlab-webgpu-complex64-contract-validation-not-ready',
    scope.reducedFixtureOnly === true ? null : 'moonlab-webgpu-complex64-reduced-fixture-flag-missing',
    noBackendEvidenceReady || browserWebGpuEvidenceReady || preNormalizedEvidenceReady
      ? null
      : 'moonlab-webgpu-complex64-reduced-browser-evidence-not-ready',
    scope.fullFidelityMagnetarSimulation === false
      ? null
      : 'moonlab-webgpu-complex64-full-fidelity-overstated',
    scope.fullPhysicsValidation === false
      ? null
      : 'moonlab-webgpu-complex64-full-physics-validation-overstated',
    complex64Preflight.passed === true
      ? null
      : 'moonlab-webgpu-complex64-preflight-not-ready'
  ]);
  const ready = validationBlockers.length === 0;
  return {
    schema: scope.schema || null,
    status: scope.status || (ready ? (browserWebGpuEvidenceReady ? 'scope-ready-backend-detected' : 'scope-ready-backend-unavailable') : 'scope-blocked'),
    ready,
    contractReady: scope.contractReady === true,
    contractValidationValid,
    reducedFixtureOnly: scope.reducedFixtureOnly === true,
    backendAvailable,
    webgpuParityExecuted,
    webgpuParityPassed,
    complex64PreflightPassed: complex64Preflight.passed === true,
    fullFidelityMagnetarSimulation: typeof scope.fullFidelityMagnetarSimulation === 'boolean'
      ? scope.fullFidelityMagnetarSimulation
      : null,
    fullPhysicsValidation: typeof scope.fullPhysicsValidation === 'boolean'
      ? scope.fullPhysicsValidation
      : null,
    fidelityRuntimeScope: clonePlain(fidelityRuntimeScope),
    blockerCount: evidenceBlockers.length,
    blockers: evidenceBlockers,
    validationBlockerCount: validationBlockers.length,
    validationBlockers,
    browserBackendPreflightStage: stringOrNull(browserBackendPreflight.stage),
    browserBackendPreflightDeviceAcquired:
      typeof browserBackendPreflight.deviceAcquired === 'boolean'
        ? browserBackendPreflight.deviceAcquired
        : null,
    probabilityKernelExecuted:
      typeof browserKernelProbe.executed === 'boolean' ? browserKernelProbe.executed : null,
    probabilityKernelPassed:
      typeof browserKernelProbe.passed === 'boolean' ? browserKernelProbe.passed : null,
    probabilityKernelCoveredOperations: clonePlain(browserKernelCoverage),
    nativeOperationProbeExecuted:
      typeof browserNativeOperationProbe.executed === 'boolean' ? browserNativeOperationProbe.executed : null,
    nativeOperationProbePassed:
      typeof browserNativeOperationProbe.passed === 'boolean' ? browserNativeOperationProbe.passed : null,
    nativeOperationCoveredOperations: clonePlain(nativeOperationCoverage)
  };
}

function createEshkolProductionCandidateRuntimeProbeFromFields(source = {}) {
  const nested = plainObjectOrNull(source.productionCandidateRuntimeProbe);
  if (nested) return nested;
  const schema = firstPresent(
    source.eshkolProductionCandidateRuntimeProbeSchema,
    source.closureProductionCandidateRuntimeProbeSchema,
    source.productionCandidateRuntimeProbeSchema
  );
  const status = firstPresent(
    source.eshkolProductionCandidateRuntimeProbeStatus,
    source.closureProductionCandidateRuntimeProbeStatus,
    source.productionCandidateRuntimeProbeStatus
  );
  const ready = firstPresent(
    source.eshkolProductionCandidateRuntimeProbeReady,
    source.closureProductionCandidateRuntimeProbeReady,
    source.productionCandidateRuntimeProbeReady
  );
  if (schema == null && status == null && ready == null) return null;
  return {
    schema,
    status,
    ready,
    executionClaim: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeExecutionClaim,
      source.closureProductionCandidateRuntimeProbeExecutionClaim,
      source.productionCandidateRuntimeProbeExecutionClaim
    ),
    runtimeScope: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeRuntimeScope,
      source.closureProductionCandidateRuntimeProbeRuntimeScope,
      source.productionCandidateRuntimeProbeRuntimeScope
    ),
    implementationStatus: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeImplementationStatus,
      source.closureProductionCandidateRuntimeProbeImplementationStatus,
      source.productionCandidateRuntimeProbeImplementationStatus
    ),
    entryExport: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeEntryExport,
      source.closureProductionCandidateRuntimeProbeEntryExport,
      source.productionCandidateRuntimeProbeEntryExport
    ),
    entryArgs: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeEntryArgs,
      source.closureProductionCandidateRuntimeProbeEntryArgs,
      source.productionCandidateRuntimeProbeEntryArgs
    ),
    expectedEntryResult: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeExpectedEntryResult,
      source.closureProductionCandidateRuntimeProbeExpectedEntryResult,
      source.productionCandidateRuntimeProbeExpectedEntryResult
    ),
    changedBytesInDeclaredTensorRange: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeChangedBytesInDeclaredTensorRange,
      source.closureProductionCandidateRuntimeProbeChangedBytesInDeclaredTensorRange,
      source.productionCandidateRuntimeProbeChangedBytesInDeclaredTensorRange
    ),
    outputTensorsProducedByEntryExport: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeOutputTensorsProduced,
      source.closureProductionCandidateRuntimeProbeOutputTensorsProduced,
      source.productionCandidateRuntimeProbeOutputTensorsProduced,
      source.eshkolProductionCandidateRuntimeProbeOutputTensorsProducedByEntryExport,
      source.closureProductionCandidateRuntimeProbeOutputTensorsProducedByEntryExport,
      source.productionCandidateRuntimeProbeOutputTensorsProducedByEntryExport
    ),
    productionHandlerReady: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeProductionHandlerReady,
      source.closureProductionCandidateRuntimeProbeProductionHandlerReady,
      source.productionCandidateRuntimeProbeProductionHandlerReady
    ),
    productionHandlerRuntimeExecution: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeProductionHandlerRuntimeExecution,
      source.closureProductionCandidateRuntimeProbeProductionHandlerRuntimeExecution,
      source.productionCandidateRuntimeProbeProductionHandlerRuntimeExecution
    ),
    scientificValidation: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeScientificValidation,
      source.closureProductionCandidateRuntimeProbeScientificValidation,
      source.productionCandidateRuntimeProbeScientificValidation
    ),
    fullPhysicsValidation: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeFullPhysicsValidation,
      source.closureProductionCandidateRuntimeProbeFullPhysicsValidation,
      source.productionCandidateRuntimeProbeFullPhysicsValidation
    ),
    fullFidelityMagnetarSimulation: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeFullFidelityMagnetarSimulation,
      source.closureProductionCandidateRuntimeProbeFullFidelityMagnetarSimulation,
      source.productionCandidateRuntimeProbeFullFidelityMagnetarSimulation
    ),
    hostImportOptions: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeHostImportOptions,
      source.closureProductionCandidateRuntimeProbeHostImportOptions,
      source.productionCandidateRuntimeProbeHostImportOptions
    ),
    hostImportCallCounts: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeHostImportCallCounts,
      source.closureProductionCandidateRuntimeProbeHostImportCallCounts,
      source.productionCandidateRuntimeProbeHostImportCallCounts
    ),
    blocker: firstPresent(
      source.eshkolProductionCandidateRuntimeProbeBlocker,
      source.closureProductionCandidateRuntimeProbeBlocker,
      source.productionCandidateRuntimeProbeBlocker
    )
  };
}

function normalizeEshkolProductionCandidateRuntimeProbe(probe = null) {
  const candidate = plainObjectOrNull(probe);
  if (!candidate) return null;
  const entryArgs = Array.isArray(candidate.entryArgs) ? candidate.entryArgs : [];
  const hostImportOptions = plainObjectOrNull(candidate.hostImportOptions);
  const hostImportCallCounts = plainObjectOrNull(candidate.hostImportCallCounts);
  const validationBlockers = uniqueStrings([
    candidate.schema === ESHKOL_PRODUCTION_CANDIDATE_RUNTIME_PROBE_SCHEMA
      ? null
      : 'eshkol-production-candidate-runtime-probe-schema-mismatch',
    candidate.status === ESHKOL_PRODUCTION_CANDIDATE_RUNTIME_PROBE_STATUS
      ? null
      : 'eshkol-production-candidate-runtime-probe-status-mismatch',
    candidate.executionClaim === ESHKOL_PRODUCTION_CANDIDATE_RUNTIME_PROBE_EXECUTION_CLAIM
      ? null
      : 'eshkol-production-candidate-runtime-probe-execution-claim-mismatch',
    candidate.runtimeScope === 'production-candidate-host-imports'
      ? null
      : 'eshkol-production-candidate-runtime-probe-runtime-scope-mismatch',
    candidate.implementationStatus === 'production-candidate-runtime-imports-present'
      ? null
      : 'eshkol-production-candidate-runtime-probe-implementation-status-mismatch',
    arrayValuesEqual(entryArgs, [131072, 131136])
      ? null
      : 'eshkol-production-candidate-runtime-probe-entry-args-mismatch',
    finiteNumberOrNull(candidate.expectedEntryResult) === 0
      ? null
      : 'eshkol-production-candidate-runtime-probe-entry-result-mismatch',
    finiteNumberOrNull(candidate.changedBytesInDeclaredTensorRange) === 64
      ? null
      : 'eshkol-production-candidate-runtime-probe-changed-byte-count-mismatch',
    candidate.outputTensorsProducedByEntryExport === true
      ? null
      : 'eshkol-production-candidate-runtime-probe-output-tensors-missing',
    candidate.productionHandlerReady === true
      ? null
      : 'eshkol-production-candidate-runtime-probe-handler-ready-missing',
    candidate.productionHandlerRuntimeExecution === true
      ? null
      : 'eshkol-production-candidate-runtime-probe-runtime-execution-missing',
    candidate.scientificValidation === false
      ? null
      : 'eshkol-production-candidate-runtime-probe-scientific-validation-overstated',
    candidate.fullPhysicsValidation === false
      ? null
      : 'eshkol-production-candidate-runtime-probe-full-physics-overstated',
    candidate.fullFidelityMagnetarSimulation === false
      ? null
      : 'eshkol-production-candidate-runtime-probe-full-fidelity-overstated',
    hostImportOptions?.factory === 'createEshkolHostImportObject'
      ? null
      : 'eshkol-production-candidate-runtime-probe-host-import-factory-mismatch',
    hostImportOptions?.productionCandidateRuntimeImports === true
      ? null
      : 'eshkol-production-candidate-runtime-probe-host-import-mode-mismatch',
    hostImportOptions?.runtimeSmokeStubs === false
      ? null
      : 'eshkol-production-candidate-runtime-probe-smoke-stubs-overstated',
    hostImportOptions?.f64TensorMemoryImports === true
      ? null
      : 'eshkol-production-candidate-runtime-probe-f64-imports-mismatch',
    finiteNumberOrNull(hostImportCallCounts?.ulg_read_f64) === 12
      ? null
      : 'eshkol-production-candidate-runtime-probe-read-count-mismatch',
    finiteNumberOrNull(hostImportCallCounts?.ulg_write_f64) === 9
      ? null
      : 'eshkol-production-candidate-runtime-probe-write-count-mismatch',
    candidate.blocker === 'full-physics-validation-not-run'
      ? null
      : 'eshkol-production-candidate-runtime-probe-full-physics-blocker-missing'
  ]);
  return {
    schema: stringOrNull(candidate.schema),
    status: stringOrNull(candidate.status),
    ready: typeof candidate.ready === 'boolean' ? candidate.ready : validationBlockers.length === 0,
    executionClaim: stringOrNull(candidate.executionClaim),
    runtimeScope: stringOrNull(candidate.runtimeScope),
    implementationStatus: stringOrNull(candidate.implementationStatus),
    entryExport: stringOrNull(candidate.entryExport),
    entryArgs: clonePlain(entryArgs),
    expectedEntryResult: finiteNumberOrNull(candidate.expectedEntryResult),
    changedBytesInDeclaredTensorRange: finiteNumberOrNull(candidate.changedBytesInDeclaredTensorRange),
    outputTensorsProducedByEntryExport: booleanOrNull(candidate.outputTensorsProducedByEntryExport),
    productionHandlerReady: booleanOrNull(candidate.productionHandlerReady),
    productionHandlerRuntimeExecution: booleanOrNull(candidate.productionHandlerRuntimeExecution),
    scientificValidation: booleanOrNull(candidate.scientificValidation),
    fullPhysicsValidation: booleanOrNull(candidate.fullPhysicsValidation),
    fullFidelityMagnetarSimulation: booleanOrNull(candidate.fullFidelityMagnetarSimulation),
    hostImportOptions: clonePlain(hostImportOptions),
    hostImportCallCounts: clonePlain(hostImportCallCounts),
    blocker: stringOrNull(candidate.blocker),
    validationBlockerCount: validationBlockers.length,
    validationBlockers
  };
}

function normalizeEshkolFullPhysicsValidationRequirements(requirements = null) {
  const source = plainObjectOrNull(requirements);
  if (!source) return null;
  if (source.schema == null
    && source.status == null
    && !Array.isArray(source.requiredRuntimeEvidenceFamilies)
    && !Array.isArray(source.requiredHashFields)
    && !Array.isArray(source.requiredRuntimeEvidence)) {
    return null;
  }
  const requiredRuntimeEvidence = Array.isArray(source.requiredRuntimeEvidence)
    ? source.requiredRuntimeEvidence
      .map((entry) => plainObjectOrNull(entry))
      .filter(Boolean)
      .map((entry) => ({
        family: stringOrNull(entry.family),
        schema: stringOrNull(entry.schema),
        status: stringOrNull(entry.status),
        required: booleanOrNull(entry.required)
      }))
    : [];
  const requiredRuntimeEvidenceFamilies = stringArray(source.requiredRuntimeEvidenceFamilies);
  const requiredHashFields = stringArray(source.requiredHashFields);
  const blockedBy = stringArray(source.blockedBy);
  const declared = source.schema === ESHKOL_FULL_PHYSICS_VALIDATION_REQUIREMENTS_SCHEMA
    && source.status === 'declared-not-run'
    && source.ready === false
    && source.validationScope === 'magnetar-production-handler-full-physics'
    && source.producerSchema === 'peercompute.multiscale.scenario-runtime-evidence-manifest.v0'
    && source.requiredValidationSchema === 'peercompute.multiscale.scenario-scientific-runtime-validation.v0'
    && source.requiredValidationScope === 'magnetar-scientific-runtime-reference-validation'
    && arrayValuesEqual(requiredRuntimeEvidenceFamilies, ESHKOL_FULL_PHYSICS_RUNTIME_EVIDENCE_FAMILIES)
    && arrayValuesEqual(requiredHashFields, ESHKOL_FULL_PHYSICS_REQUIRED_HASH_FIELDS)
    && requiredRuntimeEvidence.length === ESHKOL_FULL_PHYSICS_RUNTIME_EVIDENCE_FAMILIES.length
    && requiredRuntimeEvidence.every((entry, index) => (
      entry.family === ESHKOL_FULL_PHYSICS_RUNTIME_EVIDENCE_FAMILIES[index]
      && entry.schema === ESHKOL_FULL_PHYSICS_RUNTIME_EVIDENCE_SCHEMAS[index]
      && entry.status === 'required-not-provided'
      && entry.required === true
    ))
    && arrayValuesEqual(blockedBy, ESHKOL_PRODUCTION_HANDLER_BOUNDARY_REQUIRED_BLOCKERS);
  return {
    schema: stringOrNull(source.schema),
    status: stringOrNull(source.status),
    declared,
    ready: booleanOrNull(source.ready),
    validationScope: stringOrNull(source.validationScope),
    producerSchema: stringOrNull(source.producerSchema),
    requiredValidationSchema: stringOrNull(source.requiredValidationSchema),
    requiredValidationScope: stringOrNull(source.requiredValidationScope),
    requiredRuntimeEvidenceFamilies: clonePlain(requiredRuntimeEvidenceFamilies),
    requiredRuntimeEvidenceSchemas: clonePlain(requiredRuntimeEvidence.map((entry) => entry.schema).filter(Boolean)),
    requiredRuntimeEvidenceCount: requiredRuntimeEvidence.length,
    requiredHashFields: clonePlain(requiredHashFields),
    requiredRuntimeEvidence: clonePlain(requiredRuntimeEvidence),
    blockedBy: clonePlain(blockedBy)
  };
}

function findEshkolProductionHandlerBoundary(artifact = {}, closureDescriptor = null) {
  const descriptor = plainObjectOrNull(closureDescriptor);
  const binding = plainObjectOrNull(descriptor?.descriptorBinding);
  const candidates = [
    artifact.productionHandlerBoundary,
    artifact.validation?.productionHandlerBoundary,
    artifact.runtime?.productionHandlerBoundary,
    artifact.metadata?.productionHandlerBoundary,
    descriptor?.productionHandlerBoundary,
    binding?.productionHandlerBoundary,
    binding?.runtimeBinding?.productionHandlerBoundary,
    binding?.closureTensorRuntimeContract?.productionHandlerBoundary
  ];
  return candidates
    .map((entry) => plainObjectOrNull(entry))
    .find((entry) => entry?.schema === ESHKOL_PRODUCTION_HANDLER_BOUNDARY_SCHEMA)
    || null;
}

function normalizeEshkolProductionHandlerBoundary(boundary = null) {
  if (!boundary) return null;
  const runtimeExecution = typeof boundary.runtimeExecution === 'boolean'
    ? boundary.runtimeExecution
    : (typeof boundary.runtimeExecuted === 'boolean' ? boundary.runtimeExecuted : null);
  const hostImports = plainObjectOrNull(boundary.hostImports) || {};
  const productionCandidate = plainObjectOrNull(hostImports.productionCandidate) || {};
  const productionHandlerContract = plainObjectOrNull(boundary.productionHandlerContract) || {};
  const productionHandlerContractInvocation = plainObjectOrNull(productionHandlerContract.invocation) || {};
  const productionHandlerImplementation = plainObjectOrNull(boundary.productionHandlerImplementation) || {
    schema: boundary.productionHandlerImplementationSchema,
    status: boundary.productionHandlerImplementationStatus,
    implementationScope: boundary.productionHandlerImplementationScope,
    executionClaim: boundary.productionHandlerImplementationExecutionClaim,
    evidence: boundary.productionHandlerImplementationEvidence,
    blockedBy: boundary.productionHandlerImplementationBlockedBy
  };
  const productionHandlerImplementationEvidence = Array.isArray(productionHandlerImplementation.evidence)
    ? productionHandlerImplementation.evidence
    : boundary.productionHandlerImplementationEvidence;
  const productionHandlerImplementationBlockedBy = Array.isArray(productionHandlerImplementation.blockedBy)
    ? productionHandlerImplementation.blockedBy
    : boundary.productionHandlerImplementationBlockedBy;
  const productionHandlerRuntimeExecution = plainObjectOrNull(boundary.productionHandlerRuntimeExecution) || {
    schema: boundary.productionHandlerRuntimeExecutionSchema,
    status: boundary.productionHandlerRuntimeExecutionStatus,
    executionClaim: boundary.productionHandlerRuntimeExecutionExecutionClaim
      || ESHKOL_PRODUCTION_CANDIDATE_RUNTIME_PROBE_EXECUTION_CLAIM,
    entryArgs: boundary.productionHandlerRuntimeExecutionEntryArgs,
    entryResult: boundary.productionHandlerRuntimeExecutionEntryResult,
    changedBytesInDeclaredTensorRange:
      boundary.productionHandlerRuntimeExecutionChangedBytesInDeclaredTensorRange,
    outputTensorsProducedByEntryExport:
      boundary.productionHandlerRuntimeExecutionOutputTensorsProduced,
    hostImportCallCounts: boundary.productionHandlerRuntimeExecutionHostImportCallCounts,
    blockedBy: boundary.productionHandlerRuntimeExecutionBlockedBy
  };
  const productionHandlerRuntimeExecutionEntryArgs = Array.isArray(productionHandlerRuntimeExecution.entryArgs)
    ? productionHandlerRuntimeExecution.entryArgs
    : boundary.productionHandlerRuntimeExecutionEntryArgs;
  const productionHandlerRuntimeExecutionHostImportCallCounts =
    plainObjectOrNull(productionHandlerRuntimeExecution.hostImportCallCounts)
    || plainObjectOrNull(boundary.productionHandlerRuntimeExecutionHostImportCallCounts)
    || null;
  const productionHandlerRuntimeExecutionBlockedBy = Array.isArray(productionHandlerRuntimeExecution.blockedBy)
    ? productionHandlerRuntimeExecution.blockedBy
    : boundary.productionHandlerRuntimeExecutionBlockedBy;
  const fullPhysicsValidationRequirements = normalizeEshkolFullPhysicsValidationRequirements(
    plainObjectOrNull(boundary.fullPhysicsValidationRequirements) || {
      schema: boundary.fullPhysicsValidationRequirementsSchema,
      status: boundary.fullPhysicsValidationRequirementsStatus,
      ready: boundary.fullPhysicsValidationRequirementsReady,
      validationScope: boundary.fullPhysicsValidationRequirementsValidationScope,
      producerSchema: boundary.fullPhysicsValidationRequirementsProducerSchema,
      requiredValidationSchema: boundary.fullPhysicsValidationRequirementsRequiredValidationSchema,
      requiredValidationScope: boundary.fullPhysicsValidationRequirementsRequiredValidationScope,
      requiredRuntimeEvidenceFamilies: boundary.fullPhysicsValidationRequiredRuntimeEvidenceFamilies,
      requiredHashFields: boundary.fullPhysicsValidationRequiredHashFields,
      requiredRuntimeEvidence: boundary.fullPhysicsValidationRequiredRuntimeEvidence,
      blockedBy: boundary.fullPhysicsValidationRequirementsBlockedBy
    }
  );
  const dispatchPreflight = plainObjectOrNull(boundary.dispatchPreflight) || {};
  const productionCandidateRuntimeProbe = normalizeEshkolProductionCandidateRuntimeProbe(
    createEshkolProductionCandidateRuntimeProbeFromFields(boundary)
  );
  const productionCandidateRequiredNonStubImports = Array.isArray(productionCandidate.requiredNonStubImports)
    ? productionCandidate.requiredNonStubImports
    : boundary.productionHostImportCandidateRequiredNonStubImports;
  const productionCandidateTensorMemoryImports = Array.isArray(productionCandidate.tensorMemoryImports)
    ? productionCandidate.tensorMemoryImports
    : boundary.productionHostImportCandidateTensorMemoryImports;
  const productionCandidateReadinessRequires = Array.isArray(productionCandidate.readinessRequires)
    ? productionCandidate.readinessRequires
    : boundary.productionHostImportCandidateReadinessRequires;
  const productionCandidateBlockedBy = Array.isArray(productionCandidate.blockedBy)
    ? productionCandidate.blockedBy
    : boundary.productionHostImportCandidateBlockedBy;
  const productionHandlerContractInputTensorIds = Array.isArray(productionHandlerContract.inputTensorIds)
    ? productionHandlerContract.inputTensorIds
    : boundary.productionHandlerContractInputTensorIds;
  const productionHandlerContractOutputTensorIds = Array.isArray(productionHandlerContract.outputTensorIds)
    ? productionHandlerContract.outputTensorIds
    : boundary.productionHandlerContractOutputTensorIds;
  const productionHandlerContractInvocationParameterTypes =
    Array.isArray(productionHandlerContractInvocation.parameterTypes)
      ? productionHandlerContractInvocation.parameterTypes
      : boundary.productionHandlerContractInvocationParameterTypes;
  const productionHandlerContractInvocationResultTypes =
    Array.isArray(productionHandlerContractInvocation.resultTypes)
      ? productionHandlerContractInvocation.resultTypes
      : boundary.productionHandlerContractInvocationResultTypes;
  const productionHandlerContractRequiredEvidence = Array.isArray(productionHandlerContract.requiredEvidence)
    ? productionHandlerContract.requiredEvidence
    : boundary.productionHandlerContractRequiredEvidence;
  const productionHandlerContractBlockedBy = Array.isArray(productionHandlerContract.blockedBy)
    ? productionHandlerContract.blockedBy
    : boundary.productionHandlerContractBlockedBy;
  const dispatchPreflightRequiredChecks = Array.isArray(dispatchPreflight.requiredChecks)
    ? dispatchPreflight.requiredChecks
    : boundary.dispatchPreflightRequiredChecks;
  const dispatchPreflightCheckResults = Array.isArray(dispatchPreflight.checkResults)
    ? dispatchPreflight.checkResults
    : boundary.dispatchPreflightCheckResults;
  const dispatchPreflightCheckSummary = plainObjectOrNull(dispatchPreflight.checkSummary)
    || plainObjectOrNull(boundary.dispatchPreflightCheckSummary)
    || {};
  const dispatchPreflightPassedChecks = Array.isArray(dispatchPreflightCheckSummary.passedChecks)
    ? dispatchPreflightCheckSummary.passedChecks
    : boundary.dispatchPreflightPassedChecks;
  const dispatchPreflightBlockedChecks = Array.isArray(dispatchPreflightCheckSummary.blockedChecks)
    ? dispatchPreflightCheckSummary.blockedChecks
    : boundary.dispatchPreflightBlockedChecks;
  const dispatchPreflightRejectedRuntimeScopes = Array.isArray(dispatchPreflight.rejectedRuntimeScopes)
    ? dispatchPreflight.rejectedRuntimeScopes
    : boundary.dispatchPreflightRejectedRuntimeScopes;
  const dispatchPreflightBlockedBy = Array.isArray(dispatchPreflight.blockedBy)
    ? dispatchPreflight.blockedBy
    : boundary.dispatchPreflightBlockedBy;
  const dispatchPreflightDeclared = boundary.dispatchPreflightDeclared === true
    || (dispatchPreflight.schema === ESHKOL_PRODUCTION_HANDLER_DISPATCH_PREFLIGHT_SCHEMA
    && dispatchPreflight.status === 'blocked'
    && dispatchPreflight.ready === false
    && dispatchPreflight.runtimeSmokeStubsAllowed === false);
  const validationBlockers = uniqueStrings([
    boundary.schema === ESHKOL_PRODUCTION_HANDLER_BOUNDARY_SCHEMA
      ? null
      : 'eshkol-production-handler-boundary-schema-mismatch',
    boundary.handlerReady === true
      ? null
      : 'eshkol-production-handler-boundary-handler-readiness-missing',
    runtimeExecution === true
      ? null
      : 'eshkol-production-handler-boundary-runtime-execution-missing',
    productionHandlerImplementation.schema === ESHKOL_PRODUCTION_HANDLER_IMPLEMENTATION_SCHEMA
      ? null
      : 'eshkol-production-handler-implementation-schema-mismatch',
    productionHandlerImplementation.status === 'implemented-production-candidate-runtime-smoke'
      ? null
      : 'eshkol-production-handler-implementation-status-mismatch',
    productionHandlerImplementation.executionClaim === ESHKOL_PRODUCTION_CANDIDATE_RUNTIME_PROBE_EXECUTION_CLAIM
      ? null
      : 'eshkol-production-handler-implementation-execution-claim-mismatch',
    productionHandlerRuntimeExecution.schema === ESHKOL_PRODUCTION_HANDLER_RUNTIME_EXECUTION_SCHEMA
      ? null
      : 'eshkol-production-handler-runtime-execution-schema-mismatch',
    productionHandlerRuntimeExecution.status === 'production-handler-runtime-smoke-executed'
      ? null
      : 'eshkol-production-handler-runtime-execution-status-mismatch',
    productionHandlerRuntimeExecution.executionClaim === ESHKOL_PRODUCTION_CANDIDATE_RUNTIME_PROBE_EXECUTION_CLAIM
      ? null
      : 'eshkol-production-handler-runtime-execution-claim-mismatch',
    boundary.scientificValidation === false
      ? null
      : 'eshkol-production-handler-boundary-scientific-validation-overstated',
    boundary.fullPhysicsValidation === false
      ? null
      : 'eshkol-production-handler-boundary-full-physics-validation-overstated',
    boundary.fullFidelityMagnetarSimulation === false
      ? null
      : 'eshkol-production-handler-boundary-full-fidelity-overstated'
  ]);
  const ready = validationBlockers.length === 0;
  return {
    schema: boundary.schema || null,
    status: boundary.status || (ready ? 'production-handler-runtime-smoke-executed' : 'production-handler-boundary-blocked'),
    ready,
    handlerReady: typeof boundary.handlerReady === 'boolean' ? boundary.handlerReady : null,
    runtimeExecution,
    scientificValidation: typeof boundary.scientificValidation === 'boolean'
      ? boundary.scientificValidation
      : null,
    fullPhysicsValidation: typeof boundary.fullPhysicsValidation === 'boolean'
      ? boundary.fullPhysicsValidation
      : null,
    fullFidelityMagnetarSimulation: typeof boundary.fullFidelityMagnetarSimulation === 'boolean'
      ? boundary.fullFidelityMagnetarSimulation
      : null,
    boundaryId: stringOrNull(boundary.boundaryId || boundary.id),
    handlerProtocol: stringOrNull(boundary.handlerProtocol || boundary.protocol),
    handlerId: stringOrNull(boundary.handlerId),
    handlerKind: stringOrNull(boundary.handlerKind),
    dispatchSchema: stringOrNull(boundary.dispatchSchema),
    runtimeAbi: stringOrNull(boundary.runtimeAbi),
    tensorMemoryModel: stringOrNull(boundary.tensorMemoryModel),
    hostImportsRuntimeScope: stringOrNull(hostImports.runtimeScope || boundary.hostImportsRuntimeScope),
    hostImportsImplementationStatus:
      stringOrNull(hostImports.implementationStatus || boundary.hostImportsImplementationStatus),
    productionHostImportCandidateSchema:
      stringOrNull(productionCandidate.schema || boundary.productionHostImportCandidateSchema),
    productionHostImportCandidateStatus:
      stringOrNull(productionCandidate.status || boundary.productionHostImportCandidateStatus),
    productionHostImportCandidateProductionRuntimeAbi:
      stringOrNull(
        productionCandidate.productionRuntimeAbi
        || boundary.productionHostImportCandidateProductionRuntimeAbi
      ),
    productionHostImportCandidateRuntimeSmokeStubsAllowed:
      typeof productionCandidate.runtimeSmokeStubsAllowed === 'boolean'
        ? productionCandidate.runtimeSmokeStubsAllowed
        : (
            typeof boundary.productionHostImportCandidateRuntimeSmokeStubsAllowed === 'boolean'
              ? boundary.productionHostImportCandidateRuntimeSmokeStubsAllowed
              : null
          ),
    productionHostImportCandidateRequiredNonStubImports:
      clonePlain(stringArray(productionCandidateRequiredNonStubImports)),
    productionHostImportCandidateTensorMemoryImports:
      clonePlain(stringArray(productionCandidateTensorMemoryImports)),
    productionHostImportCandidateReadinessRequires:
      clonePlain(stringArray(productionCandidateReadinessRequires)),
    productionHostImportCandidateBlockedBy:
      clonePlain(stringArray(productionCandidateBlockedBy)),
    productionCandidateRuntimeProbe,
    productionCandidateRuntimeProbeSchema: productionCandidateRuntimeProbe?.schema || null,
    productionCandidateRuntimeProbeStatus: productionCandidateRuntimeProbe?.status || null,
    productionCandidateRuntimeProbeReady: productionCandidateRuntimeProbe?.ready ?? null,
    productionCandidateRuntimeProbeExecutionClaim: productionCandidateRuntimeProbe?.executionClaim || null,
    productionCandidateRuntimeProbeRuntimeScope: productionCandidateRuntimeProbe?.runtimeScope || null,
    productionCandidateRuntimeProbeImplementationStatus:
      productionCandidateRuntimeProbe?.implementationStatus || null,
    productionCandidateRuntimeProbeEntryExport: productionCandidateRuntimeProbe?.entryExport || null,
    productionCandidateRuntimeProbeEntryArgs: clonePlain(productionCandidateRuntimeProbe?.entryArgs || []),
    productionCandidateRuntimeProbeExpectedEntryResult:
      productionCandidateRuntimeProbe?.expectedEntryResult ?? null,
    productionCandidateRuntimeProbeChangedBytesInDeclaredTensorRange:
      productionCandidateRuntimeProbe?.changedBytesInDeclaredTensorRange ?? null,
    productionCandidateRuntimeProbeOutputTensorsProduced:
      productionCandidateRuntimeProbe?.outputTensorsProducedByEntryExport ?? null,
    productionCandidateRuntimeProbeProductionHandlerReady:
      productionCandidateRuntimeProbe?.productionHandlerReady ?? null,
    productionCandidateRuntimeProbeProductionHandlerRuntimeExecution:
      productionCandidateRuntimeProbe?.productionHandlerRuntimeExecution ?? null,
    productionCandidateRuntimeProbeScientificValidation:
      productionCandidateRuntimeProbe?.scientificValidation ?? null,
    productionCandidateRuntimeProbeFullPhysicsValidation:
      productionCandidateRuntimeProbe?.fullPhysicsValidation ?? null,
    productionCandidateRuntimeProbeFullFidelityMagnetarSimulation:
      productionCandidateRuntimeProbe?.fullFidelityMagnetarSimulation ?? null,
    productionCandidateRuntimeProbeHostImportOptions:
      clonePlain(productionCandidateRuntimeProbe?.hostImportOptions || null),
    productionCandidateRuntimeProbeHostImportCallCounts:
      clonePlain(productionCandidateRuntimeProbe?.hostImportCallCounts || null),
    productionCandidateRuntimeProbeBlocker: productionCandidateRuntimeProbe?.blocker || null,
    productionHandlerContract: clonePlain(productionHandlerContract.schema ? productionHandlerContract : null),
    productionHandlerContractSchema:
      stringOrNull(productionHandlerContract.schema || boundary.productionHandlerContractSchema),
    productionHandlerContractStatus:
      stringOrNull(productionHandlerContract.status || boundary.productionHandlerContractStatus),
    productionHandlerContractDeclared:
      typeof boundary.productionHandlerContractDeclared === 'boolean'
        ? boundary.productionHandlerContractDeclared
        : (
            productionHandlerContract.schema === 'eshkol.ulg.production-handler-contract.v0'
            && productionHandlerContract.status === 'implemented-runtime-smoke-pending-full-physics'
          ),
    productionHandlerContractHandlerId:
      stringOrNull(productionHandlerContract.handlerId || boundary.productionHandlerContractHandlerId),
    productionHandlerContractDispatchSchema:
      stringOrNull(productionHandlerContract.dispatchSchema || boundary.productionHandlerContractDispatchSchema),
    productionHandlerContractEntryExport:
      stringOrNull(productionHandlerContract.entryExport || boundary.productionHandlerContractEntryExport),
    productionHandlerContractRuntimeAbi:
      stringOrNull(productionHandlerContract.runtimeAbi || boundary.productionHandlerContractRuntimeAbi),
    productionHandlerContractTensorMemoryModel:
      stringOrNull(productionHandlerContract.tensorMemoryModel || boundary.productionHandlerContractTensorMemoryModel),
    productionHandlerContractInputTensorIds:
      clonePlain(stringArray(productionHandlerContractInputTensorIds)),
    productionHandlerContractOutputTensorIds:
      clonePlain(stringArray(productionHandlerContractOutputTensorIds)),
    productionHandlerContractInvocationModuleSource:
      stringOrNull(
        productionHandlerContractInvocation.moduleSource
        || boundary.productionHandlerContractInvocationModuleSource
      ),
    productionHandlerContractInvocationEntryExport:
      stringOrNull(
        productionHandlerContractInvocation.entryExport
        || boundary.productionHandlerContractInvocationEntryExport
      ),
    productionHandlerContractInvocationArgumentMode:
      stringOrNull(
        productionHandlerContractInvocation.argumentMode
        || boundary.productionHandlerContractInvocationArgumentMode
      ),
    productionHandlerContractInvocationParameterTypes:
      clonePlain(stringArray(productionHandlerContractInvocationParameterTypes)),
    productionHandlerContractInvocationResultTypes:
      clonePlain(stringArray(productionHandlerContractInvocationResultTypes)),
    productionHandlerContractInvocationInputOffsetParam:
      finiteNumberOrNull(
        productionHandlerContractInvocation.inputOffsetParam
        ?? boundary.productionHandlerContractInvocationInputOffsetParam
      ),
    productionHandlerContractInvocationOutputOffsetParam:
      finiteNumberOrNull(
        productionHandlerContractInvocation.outputOffsetParam
        ?? boundary.productionHandlerContractInvocationOutputOffsetParam
      ),
    productionHandlerContractInvocationExpectedReturn:
      finiteNumberOrNull(
        productionHandlerContractInvocation.expectedReturn
        ?? boundary.productionHandlerContractInvocationExpectedReturn
      ),
    productionHandlerContractRequiredEvidence:
      clonePlain(stringArray(productionHandlerContractRequiredEvidence)),
    productionHandlerContractRequiredEvidenceCount:
      finiteNumberOrNull(
        boundary.productionHandlerContractRequiredEvidenceCount
        ?? stringArray(productionHandlerContractRequiredEvidence).length
      ),
    productionHandlerContractBlockedBy:
      clonePlain(stringArray(productionHandlerContractBlockedBy)),
    productionHandlerImplementation: clonePlain(
      productionHandlerImplementation.schema ? productionHandlerImplementation : null
    ),
    productionHandlerImplementationSchema:
      stringOrNull(productionHandlerImplementation.schema || boundary.productionHandlerImplementationSchema),
    productionHandlerImplementationStatus:
      stringOrNull(productionHandlerImplementation.status || boundary.productionHandlerImplementationStatus),
    productionHandlerImplementationReady:
      productionHandlerImplementation.schema === ESHKOL_PRODUCTION_HANDLER_IMPLEMENTATION_SCHEMA
      && productionHandlerImplementation.status === 'implemented-production-candidate-runtime-smoke',
    productionHandlerImplementationScope:
      stringOrNull(productionHandlerImplementation.implementationScope || boundary.productionHandlerImplementationScope),
    productionHandlerImplementationExecutionClaim:
      stringOrNull(productionHandlerImplementation.executionClaim || boundary.productionHandlerImplementationExecutionClaim),
    productionHandlerImplementationEvidence:
      clonePlain(stringArray(productionHandlerImplementationEvidence)),
    productionHandlerImplementationEvidenceCount:
      finiteNumberOrNull(
        boundary.productionHandlerImplementationEvidenceCount
        ?? stringArray(productionHandlerImplementationEvidence).length
      ),
    productionHandlerImplementationBlockedBy:
      clonePlain(stringArray(productionHandlerImplementationBlockedBy)),
    productionHandlerRuntimeExecution: clonePlain(
      productionHandlerRuntimeExecution.schema ? productionHandlerRuntimeExecution : null
    ),
    productionHandlerRuntimeExecutionSchema:
      stringOrNull(productionHandlerRuntimeExecution.schema || boundary.productionHandlerRuntimeExecutionSchema),
    productionHandlerRuntimeExecutionStatus:
      stringOrNull(productionHandlerRuntimeExecution.status || boundary.productionHandlerRuntimeExecutionStatus),
    productionHandlerRuntimeExecutionReady:
      productionHandlerRuntimeExecution.schema === ESHKOL_PRODUCTION_HANDLER_RUNTIME_EXECUTION_SCHEMA
      && productionHandlerRuntimeExecution.status === 'production-handler-runtime-smoke-executed',
    productionHandlerRuntimeExecutionEntryArgs:
      clonePlain(productionHandlerRuntimeExecutionEntryArgs || []),
    productionHandlerRuntimeExecutionEntryResult:
      finiteNumberOrNull(productionHandlerRuntimeExecution.entryResult ?? boundary.productionHandlerRuntimeExecutionEntryResult),
    productionHandlerRuntimeExecutionChangedBytesInDeclaredTensorRange:
      finiteNumberOrNull(
        productionHandlerRuntimeExecution.changedBytesInDeclaredTensorRange
        ?? boundary.productionHandlerRuntimeExecutionChangedBytesInDeclaredTensorRange
      ),
    productionHandlerRuntimeExecutionOutputTensorsProduced:
      typeof productionHandlerRuntimeExecution.outputTensorsProducedByEntryExport === 'boolean'
        ? productionHandlerRuntimeExecution.outputTensorsProducedByEntryExport
        : (
            typeof boundary.productionHandlerRuntimeExecutionOutputTensorsProduced === 'boolean'
              ? boundary.productionHandlerRuntimeExecutionOutputTensorsProduced
              : null
          ),
    productionHandlerRuntimeExecutionHostImportCallCounts:
      clonePlain(productionHandlerRuntimeExecutionHostImportCallCounts),
    productionHandlerRuntimeExecutionBlockedBy:
      clonePlain(stringArray(productionHandlerRuntimeExecutionBlockedBy)),
    fullPhysicsValidationRequirements: clonePlain(fullPhysicsValidationRequirements),
    fullPhysicsValidationRequirementsSchema:
      fullPhysicsValidationRequirements?.schema || null,
    fullPhysicsValidationRequirementsStatus:
      fullPhysicsValidationRequirements?.status || null,
    fullPhysicsValidationRequirementsDeclared:
      fullPhysicsValidationRequirements?.declared ?? null,
    fullPhysicsValidationRequirementsReady:
      fullPhysicsValidationRequirements?.ready ?? null,
    fullPhysicsValidationRequirementsValidationScope:
      fullPhysicsValidationRequirements?.validationScope || null,
    fullPhysicsValidationRequirementsProducerSchema:
      fullPhysicsValidationRequirements?.producerSchema || null,
    fullPhysicsValidationRequirementsRequiredValidationSchema:
      fullPhysicsValidationRequirements?.requiredValidationSchema || null,
    fullPhysicsValidationRequirementsRequiredValidationScope:
      fullPhysicsValidationRequirements?.requiredValidationScope || null,
    fullPhysicsValidationRequiredRuntimeEvidenceFamilies:
      clonePlain(fullPhysicsValidationRequirements?.requiredRuntimeEvidenceFamilies || []),
    fullPhysicsValidationRequiredRuntimeEvidenceSchemas:
      clonePlain(fullPhysicsValidationRequirements?.requiredRuntimeEvidenceSchemas || []),
    fullPhysicsValidationRequiredRuntimeEvidenceCount:
      fullPhysicsValidationRequirements?.requiredRuntimeEvidenceCount ?? null,
    fullPhysicsValidationRequiredHashFields:
      clonePlain(fullPhysicsValidationRequirements?.requiredHashFields || []),
    fullPhysicsValidationRequiredRuntimeEvidence:
      clonePlain(fullPhysicsValidationRequirements?.requiredRuntimeEvidence || []),
    fullPhysicsValidationRequirementsBlockedBy:
      clonePlain(fullPhysicsValidationRequirements?.blockedBy || []),
    dispatchPreflightSchema: stringOrNull(dispatchPreflight.schema || boundary.dispatchPreflightSchema),
    dispatchPreflightStatus: stringOrNull(dispatchPreflight.status || boundary.dispatchPreflightStatus),
    dispatchPreflightReady:
      typeof dispatchPreflight.ready === 'boolean'
        ? dispatchPreflight.ready
        : (
            typeof boundary.dispatchPreflightReady === 'boolean'
              ? boundary.dispatchPreflightReady
              : null
          ),
    dispatchPreflightDeclared,
    dispatchPreflightDispatchSchema:
      stringOrNull(dispatchPreflight.dispatchSchema || boundary.dispatchPreflightDispatchSchema),
    dispatchPreflightCurrentRuntimeAbi:
      stringOrNull(dispatchPreflight.currentRuntimeAbi || boundary.dispatchPreflightCurrentRuntimeAbi),
    dispatchPreflightRequiredRuntimeAbi:
      stringOrNull(dispatchPreflight.requiredRuntimeAbi || boundary.dispatchPreflightRequiredRuntimeAbi),
    dispatchPreflightRuntimeSmokeStubsAllowed:
      typeof dispatchPreflight.runtimeSmokeStubsAllowed === 'boolean'
        ? dispatchPreflight.runtimeSmokeStubsAllowed
        : (
            typeof boundary.dispatchPreflightRuntimeSmokeStubsAllowed === 'boolean'
              ? boundary.dispatchPreflightRuntimeSmokeStubsAllowed
              : null
          ),
    dispatchPreflightRequiredChecks: clonePlain(stringArray(dispatchPreflightRequiredChecks)),
    dispatchPreflightCheckSummarySchema:
      stringOrNull(dispatchPreflightCheckSummary.schema || boundary.dispatchPreflightCheckSummarySchema),
    dispatchPreflightCheckSummaryStatus:
      stringOrNull(dispatchPreflightCheckSummary.status || boundary.dispatchPreflightCheckSummaryStatus),
    dispatchPreflightCheckSummaryReady:
      typeof dispatchPreflightCheckSummary.ready === 'boolean'
        ? dispatchPreflightCheckSummary.ready
        : (
            typeof boundary.dispatchPreflightCheckSummaryReady === 'boolean'
              ? boundary.dispatchPreflightCheckSummaryReady
              : null
          ),
    dispatchPreflightTotalRequiredCheckCount:
      finiteNumberOrNull(
        dispatchPreflightCheckSummary.totalRequiredCheckCount
        ?? boundary.dispatchPreflightTotalRequiredCheckCount
      ),
    dispatchPreflightPassedCheckCount:
      finiteNumberOrNull(dispatchPreflightCheckSummary.passedCount ?? boundary.dispatchPreflightPassedCheckCount),
    dispatchPreflightBlockedCheckCount:
      finiteNumberOrNull(dispatchPreflightCheckSummary.blockedCount ?? boundary.dispatchPreflightBlockedCheckCount),
    dispatchPreflightPassedChecks: clonePlain(stringArray(dispatchPreflightPassedChecks)),
    dispatchPreflightBlockedChecks: clonePlain(stringArray(dispatchPreflightBlockedChecks)),
    dispatchPreflightCheckResults:
      clonePlain(Array.isArray(dispatchPreflightCheckResults) ? dispatchPreflightCheckResults : []),
    dispatchPreflightRejectedRuntimeScopes: clonePlain(stringArray(dispatchPreflightRejectedRuntimeScopes)),
    dispatchPreflightBlockedBy: clonePlain(stringArray(dispatchPreflightBlockedBy)),
    validationBlockerCount: validationBlockers.length,
    validationBlockers
  };
}

function normalizeMagnetarCalibratedReference(reference = {}, index = 0) {
  const fieldMap = plainObjectOrNull(reference.fieldMap);
  const fieldTolerances = plainObjectOrNull(reference.fieldTolerances || reference.tolerances);
  const fieldObservedDeltas = plainObjectOrNull(reference.fieldObservedDeltas || reference.observedDeltas);
  const validationSource = plainObjectOrNull(reference.validation) || {
    status: reference.validationStatus,
    passed: reference.validationPassed
  };
  const validationStatus = normalizeValidationStatus(validationSource);
  const id = stringOrNull(reference.id) || `magnetar-calibrated-reference-${index + 1}`;
  const family = stringOrNull(reference.family);
  const solverId = stringOrNull(reference.solverId);
  const schema = stringOrNull(reference.schema);
  const role = stringOrNull(reference.role);
  const contractHash = stringOrNull(reference.contractHash);
  const unitsHash = stringOrNull(reference.unitsHash);
  const scientificCoverage = reference.scientificCoverage === true;
  const fieldContractReady = fieldMap != null
    && Object.keys(fieldMap).length > 0
    && fieldTolerances != null
    && Object.keys(fieldTolerances).length > 0
    && fieldObservedDeltas != null
    && fieldDeltasWithinTolerances(fieldObservedDeltas, fieldTolerances);
  const ready = reference.ready === true
    && scientificCoverage
    && validationStatus === 'pass'
    && schema != null
    && role != null
    && family != null
    && solverId != null
    && hasSha256Digest(contractHash)
    && hasSha256Digest(unitsHash)
    && fieldContractReady;
  return {
    id,
    family,
    solverId,
    schema,
    role,
    contractHash,
    unitsHash,
    fieldMap: clonePlain(fieldMap),
    fieldTolerances: clonePlain(fieldTolerances),
    fieldObservedDeltas: clonePlain(fieldObservedDeltas),
    validationStatus,
    ready,
    scientificCoverage,
    status: stringOrNull(reference.status) || (ready ? 'calibrated-reference-ready' : 'calibrated-reference-pending'),
    blocker: ready ? null : stringOrNull(reference.blocker)
  };
}

function countWasmEntries(entries = [], kind) {
  return Array.isArray(entries)
    ? entries.filter((entry) => entry?.kind === kind).length
    : 0;
}

function normalizeWasmByteArray(input) {
  if (input == null) return null;
  if (Array.isArray(input)) {
    return input.map((byte) => Number(byte) & 0xff);
  }
  if (input instanceof ArrayBuffer) {
    return Array.from(new Uint8Array(input));
  }
  if (ArrayBuffer.isView(input)) {
    return Array.from(new Uint8Array(input.buffer, input.byteOffset, input.byteLength));
  }
  if (input?.type === 'Buffer' && Array.isArray(input.data)) {
    return input.data.map((byte) => Number(byte) & 0xff);
  }
  return null;
}

function normalizeUlgHandoffArtifactTransfer({
  index = 0,
  ref = null,
  sourceService = null,
  artifactKind = 'artifact',
  artifactSummary = {},
  artifact = {},
  wasmBytes = null,
  wasmByteLength = null,
  wasmSourceUrl = null
} = {}) {
  const artifactRefUri = stringOrNull(ref?.uri);
  const artifactRefHash = stringOrNull(ref?.artifactHash || ref?.hash);
  const artifactContentHash = stringOrNull(
    artifact?.contentHash
    || artifact?.hash
    || artifactSummary?.contentHash
    || artifactRefHash
  );
  const normalizedWasmByteLength = finiteNumberOrNull(wasmByteLength);
  const hasTransferredWasmBytes = artifactKind === 'closure'
    && wasmBytes != null
    && normalizedWasmByteLength > 0;
  const descriptorReadyClosure = artifactKind === 'closure'
    && artifactSummary?.closureDescriptorReady === true;
  const wasmSha256 = artifactKind === 'closure'
    ? stringOrNull(
      artifactSummary?.closureModuleSha256
      || artifact?.execution?.module?.sha256
      || artifact?.runtime?.module?.sha256
      || artifact?.module?.sha256
    )
    : null;
  const blockers = [];
  if (!artifactRefUri) {
    blockers.push('ulg-artifact-ref-uri-missing');
  }
  if (!artifactContentHash) {
    blockers.push('ulg-artifact-content-hash-missing');
  }
  if (artifactKind === 'closure' && descriptorReadyClosure !== true) {
    if (!hasTransferredWasmBytes) {
      blockers.push('eshkol-closure-wasm-bytes-missing');
    }
    if (!hasSha256Digest(wasmSha256)) {
      blockers.push('eshkol-closure-wasm-sha256-missing');
    }
  }
  return {
    schema: ULG_HANDOFF_TRANSFER_MANIFEST_SCHEMA,
    index,
    sourceService,
    artifactKind,
    artifactRefUri,
    artifactRefHash,
    artifactContentHash,
    wasmTransferMode: hasTransferredWasmBytes
      ? 'inline-byte-array'
      : (wasmSourceUrl ? 'source-url-reference' : 'artifact-metadata-only'),
    wasmByteLength: normalizedWasmByteLength,
    wasmSha256,
    wasmSourceUrl: stringOrNull(wasmSourceUrl),
    hasTransferredWasmBytes,
    relaySafe: blockers.length === 0,
    blockers
  };
}

export function summarizeUlgArtifact(artifactKind, artifact = {}) {
  const validationStatus = artifact.validation?.status || artifact.validationStatus || null;
  const outputs = artifact.outputs && typeof artifact.outputs === 'object' ? artifact.outputs : {};
  const parity = artifact.parity && typeof artifact.parity === 'object' ? artifact.parity : null;
  const responseDescriptor = artifact.responseDescriptor && typeof artifact.responseDescriptor === 'object'
    ? artifact.responseDescriptor
    : null;
  const execution = artifact.execution && typeof artifact.execution === 'object' ? artifact.execution : {};
  const module = execution.module && typeof execution.module === 'object' ? execution.module : {};
  const executionImports = Array.isArray(execution.imports) ? execution.imports : [];
  const executionExports = Array.isArray(execution.exports) ? execution.exports : [];
  const wasmMetadata = execution.wasmMetadata && typeof execution.wasmMetadata === 'object' ? execution.wasmMetadata : {};
  const validity = artifact.validity && typeof artifact.validity === 'object' ? artifact.validity : {};
  const outputSemantics = artifact.validation?.outputSemantics && typeof artifact.validation.outputSemantics === 'object'
    ? artifact.validation.outputSemantics
    : null;
  const closureDescriptor = artifact.validation?.closureDescriptor && typeof artifact.validation.closureDescriptor === 'object'
    ? artifact.validation.closureDescriptor
    : null;
  const eshkolProductionHandlerBoundary = normalizeEshkolProductionHandlerBoundary(
    findEshkolProductionHandlerBoundary(artifact, closureDescriptor)
  );
  const closureDescriptorReady = closureDescriptor?.schema === ESHKOL_MAGNETAR_CLOSURE_DESCRIPTOR_SCHEMA
    && closureDescriptor?.scientificValidation === false;
  const outputSemanticsStdout = outputSemantics?.stdout && typeof outputSemantics.stdout === 'object'
    ? outputSemantics.stdout
    : {};
  const closureValidationReady = validationStatus === 'pass'
    || (validationStatus === 'descriptor-only' && closureDescriptorReady);
  const magnetarReference = outputs.reference && typeof outputs.reference === 'object' ? outputs.reference : null;
  const magnetarReferenceObservables = magnetarReference?.observables && typeof magnetarReference.observables === 'object'
    ? magnetarReference.observables
    : {};
  const magnetarReferenceGroundState = magnetarReferenceObservables.groundState
    && typeof magnetarReferenceObservables.groundState === 'object'
    ? magnetarReferenceObservables.groundState
    : {};
  const magnetarReferenceTolerances = magnetarReference?.tolerances
    && typeof magnetarReference.tolerances === 'object'
    ? magnetarReference.tolerances
    : {};
  const magnetarReferenceValidation = magnetarReference?.validation
    && typeof magnetarReference.validation === 'object'
    ? magnetarReference.validation
    : {};
  const magnetarReferenceValidationStatus = normalizeValidationStatus(magnetarReferenceValidation);
  const magnetarReferenceGroundStateBitString = stringOrNull(
    magnetarReferenceGroundState.bitString ?? magnetarReferenceGroundState.bitstring
  );
  const magnetarReferenceGroundStateEnergy = finiteNumberOrNull(magnetarReferenceGroundState.referenceEnergy);
  const magnetarReferenceToleranceEnergyAbs = finiteNumberOrNull(magnetarReferenceTolerances.energyAbs);
  const magnetarReferenceMaxObservedEnergyDelta = finiteNumberOrNull(
    magnetarReferenceTolerances.maxObservedEnergyDelta
      ?? magnetarReferenceValidation.maxEnergyDelta
  );
  const magnetarCalibratedReferences = Array.isArray(outputs.references)
    ? outputs.references
      .filter((reference) => reference && typeof reference === 'object')
      .map((reference, index) => normalizeMagnetarCalibratedReference(reference, index))
    : [];
  const moonlabWebGpuParityScope = normalizeMoonLabWebGpuParityScope(
    findMoonLabWebGpuParityScope(artifact, outputs)
  );
  const bundleManifest = artifact.runtime?.bundleManifest && typeof artifact.runtime.bundleManifest === 'object'
    ? artifact.runtime.bundleManifest
    : (artifact.bundleManifest && typeof artifact.bundleManifest === 'object' ? artifact.bundleManifest : null);
  const bundleCopyFiles = Array.isArray(bundleManifest?.copyFiles)
    ? bundleManifest.copyFiles
    : (Array.isArray(bundleManifest?.manualDeploy?.copyFiles) ? bundleManifest.manualDeploy.copyFiles : []);
  const hostImports = bundleManifest?.hostImports && typeof bundleManifest.hostImports === 'object'
    ? bundleManifest.hostImports
    : (artifact.runtime?.hostImports && typeof artifact.runtime.hostImports === 'object' ? artifact.runtime.hostImports : null);
  const runtimeAssetProbe = plainObjectOrNull(artifact.runtime?.assetProbe);
  const runtimeAssets = Array.isArray(runtimeAssetProbe?.assets)
    ? runtimeAssetProbe.assets.map((entry) => plainObjectOrNull(entry)).filter(Boolean)
    : [];
  const hostImportsAsset = runtimeAssets.find((asset) => asset.kind === 'hostImportsModule') || null;
  const hostImportsFactory = plainObjectOrNull(artifact.runtime?.hostImportsFactory)
    || plainObjectOrNull(runtimeAssetProbe?.bundleHostImports)
    || null;
  const parityComparisons = Array.isArray(parity?.comparisons) ? parity.comparisons : [];
  const unsupportedParityModeCount = parityComparisons.filter((entry) => entry?.status === 'unsupported').length;
  const calibrationArtifacts = artifact.calibrationArtifacts && typeof artifact.calibrationArtifacts === 'object'
    ? artifact.calibrationArtifacts
    : {};
  const calibrationSummaries = Object.entries(calibrationArtifacts)
    .filter(([, calibration]) => calibration && typeof calibration === 'object')
    .map(([id, calibration]) => ({
      id,
      schema: calibration.schema || null,
      sample: calibration.sample || null,
      status: calibration.validation?.status || calibration.status || null,
      parityStatus: calibration.parity?.status || null,
      groundStateBitString: calibration.summary?.groundState?.bitString || null,
      maxEnergyDelta: calibration.summary?.maxEnergyDelta ?? calibration.parity?.metrics?.maxEnergyDelta ?? null,
      evaluatedBitstrings: calibration.summary?.evaluatedBitstrings ?? null,
      ready: calibration.schema === ULG_MAGNETAR_DIPOLE_ISING_CALIBRATION_SCHEMA
        && calibration.validation?.status === 'pass'
        && calibration.parity?.status === 'pass'
    }));
  const magnetarDipoleIsing = calibrationSummaries.find((entry) => (
    entry.id === 'magnetarDipoleIsing'
    || entry.schema === ULG_MAGNETAR_DIPOLE_ISING_CALIBRATION_SCHEMA
  )) || null;
  return {
    schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
    artifactKind,
    artifactId: artifact.artifactId || artifact.closureId || null,
    sourceService: artifact.sourceService || null,
    validationStatus,
    closureKind: artifact.closureKind || null,
    closureModuleUrl: module.url || null,
    closureModuleSha256: module.sha256 || null,
    closureServiceWorkerSafe: execution.serviceWorkerSafe === true,
    closureRequiresDynamicCode: validity.requiresDynamicCode ?? null,
    closureRequiresHostImports: validity.requiresHostImports ?? null,
    closureEntryExport: execution.entryExport || null,
    closureEntrySignature: clonePlain(execution.entrySignature || null),
    closureHasStartSection: typeof execution.hasStartSection === 'boolean'
      ? execution.hasStartSection
      : (execution.startFunctionIndex == null ? null : true),
    closureStartFunctionIndex: finiteNumberOrNull(execution.startFunctionIndex),
    closureImportCount: executionImports.length,
    closureExportCount: executionExports.length,
    closureRuntimeFunctionImportCount: countWasmEntries(executionImports, 'function'),
    closureRuntimeMemoryImportCount: countWasmEntries(executionImports, 'memory'),
    closureRuntimeGlobalImportCount: countWasmEntries(executionImports, 'global'),
    closureRuntimeTableImportCount: countWasmEntries(executionImports, 'table'),
    closureWasmFunctionCount: finiteNumberOrNull(wasmMetadata.functionCount),
    closureWasmTypeCount: Array.isArray(wasmMetadata.types) ? wasmMetadata.types.length : 0,
    closureBundleManifestSchema: bundleManifest?.schema || null,
    closureBundleCopyFileCount: bundleCopyFiles.length,
    closureBundlePreserveRelativeUrls: bundleManifest?.preserveRelativeUrls === true
      || bundleManifest?.manualDeploy?.preserveRelativeUrls === true,
    closureHostImportsPath: hostImports?.path || null,
    closureHostImportsSha256: hostImports?.sha256 || null,
    closureHostImportsFactory: hostImports?.factory || null,
    closureHostImportsGlobal: hostImports?.global || null,
    closureHostImportsDomFree: hostImports?.domFree === true,
    closureHostImportsModule:
      hostImports?.module || hostImportsAsset?.url || hostImportsFactory?.module || null,
    closureHostImportsAssetStatus: hostImportsAsset?.status || null,
    closureHostImportsFactoryStatus: hostImportsFactory?.status || hostImports?.status || null,
    closureHostImportsFactoryReady:
      hostImportsFactory?.factoryReady === true || hostImports?.factoryReady === true,
    closureHostImportsRequirementsSchema:
      hostImportsFactory?.requirementsSchema || hostImports?.requirementsSchema || null,
    closureHostImportsRequirementsStatus:
      hostImportsFactory?.requirementsStatus || hostImports?.requirementsStatus || null,
    closureHostImportsRuntimeScope: hostImportsFactory?.runtimeScope || hostImports?.runtimeScope || null,
    closureHostImportsImplementationStatus:
      hostImportsFactory?.implementationStatus || hostImports?.implementationStatus || null,
    closureHostImportsRequiredNonStubImportCount:
      finiteNumberOrNull(hostImportsFactory?.requiredNonStubImportCount ?? hostImports?.requiredNonStubImportCount),
    closureOutputSemanticsSchema: outputSemantics?.schema || null,
    closureOutputSemanticsReady: outputSemantics?.schema === ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA
      && outputSemantics?.semanticScope === 'smoke-fixture'
      && outputSemantics?.scientificValidation === false,
    closureOutputSemanticScope: outputSemantics?.semanticScope || null,
    closureOutputScientificScope: outputSemantics?.scientificScope || null,
    closureOutputScientificValidation: typeof outputSemantics?.scientificValidation === 'boolean'
      ? outputSemantics.scientificValidation
      : null,
    closureOutputExpectedEntryExport: outputSemantics?.entryExport || null,
    closureOutputExpectedEntryArgs: clonePlain(Array.isArray(outputSemantics?.entryArgs) ? outputSemantics.entryArgs : null),
    closureOutputExpectedEntryResult: outputSemantics?.expectedEntryResult ?? null,
    closureOutputExpectedStdoutSha256: outputSemanticsStdout.sha256 || null,
    closureOutputExpectedStdoutByteLength: finiteNumberOrNull(outputSemanticsStdout.byteLength),
    closureDescriptorSchema: closureDescriptor?.schema || null,
    closureDescriptorReady,
    closureDescriptorStatus: closureDescriptor?.status || (closureDescriptorReady ? 'closure-descriptor-ready' : null),
    closureDescriptorScope: closureDescriptor?.scope || closureDescriptor?.semanticScope || null,
    closureDescriptorScientificValidation: typeof closureDescriptor?.scientificValidation === 'boolean'
      ? closureDescriptor.scientificValidation
      : null,
    eshkolProductionHandlerBoundaryReady: eshkolProductionHandlerBoundary?.ready === true,
    eshkolProductionHandlerBoundarySchema: eshkolProductionHandlerBoundary?.schema || null,
    eshkolProductionHandlerBoundaryStatus: eshkolProductionHandlerBoundary?.status || null,
    eshkolProductionHandlerBoundaryHandlerReady: eshkolProductionHandlerBoundary?.handlerReady ?? null,
    eshkolProductionHandlerBoundaryRuntimeExecution: eshkolProductionHandlerBoundary?.runtimeExecution ?? null,
    eshkolProductionHandlerBoundaryScientificValidation:
      eshkolProductionHandlerBoundary?.scientificValidation ?? null,
    eshkolProductionHandlerBoundaryFullPhysicsValidation:
      eshkolProductionHandlerBoundary?.fullPhysicsValidation ?? null,
    eshkolProductionHandlerBoundaryFullFidelityMagnetarSimulation:
      eshkolProductionHandlerBoundary?.fullFidelityMagnetarSimulation ?? null,
    eshkolProductionHandlerContractSchema:
      eshkolProductionHandlerBoundary?.productionHandlerContractSchema ?? null,
    eshkolProductionHandlerContractStatus:
      eshkolProductionHandlerBoundary?.productionHandlerContractStatus ?? null,
    eshkolProductionHandlerContractDeclared:
      eshkolProductionHandlerBoundary?.productionHandlerContractDeclared ?? null,
    eshkolProductionHandlerContractHandlerId:
      eshkolProductionHandlerBoundary?.productionHandlerContractHandlerId ?? null,
    eshkolProductionHandlerContractDispatchSchema:
      eshkolProductionHandlerBoundary?.productionHandlerContractDispatchSchema ?? null,
    eshkolProductionHandlerContractEntryExport:
      eshkolProductionHandlerBoundary?.productionHandlerContractEntryExport ?? null,
    eshkolProductionHandlerContractRuntimeAbi:
      eshkolProductionHandlerBoundary?.productionHandlerContractRuntimeAbi ?? null,
    eshkolProductionHandlerContractTensorMemoryModel:
      eshkolProductionHandlerBoundary?.productionHandlerContractTensorMemoryModel ?? null,
    eshkolProductionHandlerContractInputTensorIds:
      clonePlain(eshkolProductionHandlerBoundary?.productionHandlerContractInputTensorIds || []),
    eshkolProductionHandlerContractOutputTensorIds:
      clonePlain(eshkolProductionHandlerBoundary?.productionHandlerContractOutputTensorIds || []),
    eshkolProductionHandlerContractInvocationModuleSource:
      eshkolProductionHandlerBoundary?.productionHandlerContractInvocationModuleSource ?? null,
    eshkolProductionHandlerContractInvocationEntryExport:
      eshkolProductionHandlerBoundary?.productionHandlerContractInvocationEntryExport ?? null,
    eshkolProductionHandlerContractInvocationArgumentMode:
      eshkolProductionHandlerBoundary?.productionHandlerContractInvocationArgumentMode ?? null,
    eshkolProductionHandlerContractInvocationParameterTypes:
      clonePlain(eshkolProductionHandlerBoundary?.productionHandlerContractInvocationParameterTypes || []),
    eshkolProductionHandlerContractInvocationResultTypes:
      clonePlain(eshkolProductionHandlerBoundary?.productionHandlerContractInvocationResultTypes || []),
    eshkolProductionHandlerContractInvocationInputOffsetParam:
      eshkolProductionHandlerBoundary?.productionHandlerContractInvocationInputOffsetParam ?? null,
    eshkolProductionHandlerContractInvocationOutputOffsetParam:
      eshkolProductionHandlerBoundary?.productionHandlerContractInvocationOutputOffsetParam ?? null,
    eshkolProductionHandlerContractInvocationExpectedReturn:
      eshkolProductionHandlerBoundary?.productionHandlerContractInvocationExpectedReturn ?? null,
    eshkolProductionHandlerContractRequiredEvidence:
      clonePlain(eshkolProductionHandlerBoundary?.productionHandlerContractRequiredEvidence || []),
    eshkolProductionHandlerContractRequiredEvidenceCount:
      eshkolProductionHandlerBoundary?.productionHandlerContractRequiredEvidenceCount ?? null,
    eshkolProductionHandlerContractBlockedBy:
      clonePlain(eshkolProductionHandlerBoundary?.productionHandlerContractBlockedBy || []),
    eshkolProductionHandlerImplementationSchema:
      eshkolProductionHandlerBoundary?.productionHandlerImplementationSchema ?? null,
    eshkolProductionHandlerImplementationStatus:
      eshkolProductionHandlerBoundary?.productionHandlerImplementationStatus ?? null,
    eshkolProductionHandlerImplementationReady:
      eshkolProductionHandlerBoundary?.productionHandlerImplementationReady ?? null,
    eshkolProductionHandlerImplementationEvidenceCount:
      eshkolProductionHandlerBoundary?.productionHandlerImplementationEvidenceCount ?? null,
    eshkolProductionHandlerImplementationBlockedBy:
      clonePlain(eshkolProductionHandlerBoundary?.productionHandlerImplementationBlockedBy || []),
    eshkolProductionHandlerRuntimeExecutionSchema:
      eshkolProductionHandlerBoundary?.productionHandlerRuntimeExecutionSchema ?? null,
    eshkolProductionHandlerRuntimeExecutionStatus:
      eshkolProductionHandlerBoundary?.productionHandlerRuntimeExecutionStatus ?? null,
    eshkolProductionHandlerRuntimeExecutionReady:
      eshkolProductionHandlerBoundary?.productionHandlerRuntimeExecutionReady ?? null,
    eshkolProductionHandlerRuntimeExecutionEntryArgs:
      clonePlain(eshkolProductionHandlerBoundary?.productionHandlerRuntimeExecutionEntryArgs || []),
    eshkolProductionHandlerRuntimeExecutionEntryResult:
      eshkolProductionHandlerBoundary?.productionHandlerRuntimeExecutionEntryResult ?? null,
    eshkolProductionHandlerRuntimeExecutionChangedBytesInDeclaredTensorRange:
      eshkolProductionHandlerBoundary?.productionHandlerRuntimeExecutionChangedBytesInDeclaredTensorRange ?? null,
    eshkolProductionHandlerRuntimeExecutionOutputTensorsProduced:
      eshkolProductionHandlerBoundary?.productionHandlerRuntimeExecutionOutputTensorsProduced ?? null,
    eshkolProductionHandlerRuntimeExecutionHostImportCallCounts:
      clonePlain(eshkolProductionHandlerBoundary?.productionHandlerRuntimeExecutionHostImportCallCounts || null),
    eshkolProductionHandlerRuntimeExecutionBlockedBy:
      clonePlain(eshkolProductionHandlerBoundary?.productionHandlerRuntimeExecutionBlockedBy || []),
    eshkolFullPhysicsValidationRequirementsSchema:
      eshkolProductionHandlerBoundary?.fullPhysicsValidationRequirementsSchema ?? null,
    eshkolFullPhysicsValidationRequirementsStatus:
      eshkolProductionHandlerBoundary?.fullPhysicsValidationRequirementsStatus ?? null,
    eshkolFullPhysicsValidationRequirementsDeclared:
      eshkolProductionHandlerBoundary?.fullPhysicsValidationRequirementsDeclared ?? null,
    eshkolFullPhysicsValidationRequirementsReady:
      eshkolProductionHandlerBoundary?.fullPhysicsValidationRequirementsReady ?? null,
    eshkolFullPhysicsValidationRequirementsValidationScope:
      eshkolProductionHandlerBoundary?.fullPhysicsValidationRequirementsValidationScope ?? null,
    eshkolFullPhysicsValidationRequirementsProducerSchema:
      eshkolProductionHandlerBoundary?.fullPhysicsValidationRequirementsProducerSchema ?? null,
    eshkolFullPhysicsValidationRequirementsRequiredValidationSchema:
      eshkolProductionHandlerBoundary?.fullPhysicsValidationRequirementsRequiredValidationSchema ?? null,
    eshkolFullPhysicsValidationRequirementsRequiredValidationScope:
      eshkolProductionHandlerBoundary?.fullPhysicsValidationRequirementsRequiredValidationScope ?? null,
    eshkolFullPhysicsValidationRequiredRuntimeEvidenceFamilies:
      clonePlain(eshkolProductionHandlerBoundary?.fullPhysicsValidationRequiredRuntimeEvidenceFamilies || []),
    eshkolFullPhysicsValidationRequiredRuntimeEvidenceSchemas:
      clonePlain(eshkolProductionHandlerBoundary?.fullPhysicsValidationRequiredRuntimeEvidenceSchemas || []),
    eshkolFullPhysicsValidationRequiredRuntimeEvidenceCount:
      eshkolProductionHandlerBoundary?.fullPhysicsValidationRequiredRuntimeEvidenceCount ?? null,
    eshkolFullPhysicsValidationRequiredHashFields:
      clonePlain(eshkolProductionHandlerBoundary?.fullPhysicsValidationRequiredHashFields || []),
    eshkolFullPhysicsValidationRequiredRuntimeEvidence:
      clonePlain(eshkolProductionHandlerBoundary?.fullPhysicsValidationRequiredRuntimeEvidence || []),
    eshkolFullPhysicsValidationRequirementsBlockedBy:
      clonePlain(eshkolProductionHandlerBoundary?.fullPhysicsValidationRequirementsBlockedBy || []),
    eshkolProductionHostImportsRuntimeScope:
      eshkolProductionHandlerBoundary?.hostImportsRuntimeScope ?? null,
    eshkolProductionHostImportsImplementationStatus:
      eshkolProductionHandlerBoundary?.hostImportsImplementationStatus ?? null,
    eshkolProductionHostImportCandidateSchema:
      eshkolProductionHandlerBoundary?.productionHostImportCandidateSchema ?? null,
    eshkolProductionHostImportCandidateStatus:
      eshkolProductionHandlerBoundary?.productionHostImportCandidateStatus ?? null,
    eshkolProductionHostImportCandidateProductionRuntimeAbi:
      eshkolProductionHandlerBoundary?.productionHostImportCandidateProductionRuntimeAbi ?? null,
    eshkolProductionHostImportCandidateRuntimeSmokeStubsAllowed:
      eshkolProductionHandlerBoundary?.productionHostImportCandidateRuntimeSmokeStubsAllowed ?? null,
    eshkolProductionHostImportCandidateRequiredNonStubImports:
      eshkolProductionHandlerBoundary?.productionHostImportCandidateRequiredNonStubImports || [],
    eshkolProductionHostImportCandidateTensorMemoryImports:
      eshkolProductionHandlerBoundary?.productionHostImportCandidateTensorMemoryImports || [],
    eshkolProductionHostImportCandidateReadinessRequires:
      eshkolProductionHandlerBoundary?.productionHostImportCandidateReadinessRequires || [],
    eshkolProductionHostImportCandidateBlockedBy:
      eshkolProductionHandlerBoundary?.productionHostImportCandidateBlockedBy || [],
    eshkolProductionCandidateRuntimeProbeSchema:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeSchema ?? null,
    eshkolProductionCandidateRuntimeProbeStatus:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeStatus ?? null,
    eshkolProductionCandidateRuntimeProbeReady:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeReady ?? null,
    eshkolProductionCandidateRuntimeProbeExecutionClaim:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeExecutionClaim ?? null,
    eshkolProductionCandidateRuntimeProbeRuntimeScope:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeRuntimeScope ?? null,
    eshkolProductionCandidateRuntimeProbeImplementationStatus:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeImplementationStatus ?? null,
    eshkolProductionCandidateRuntimeProbeEntryExport:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeEntryExport ?? null,
    eshkolProductionCandidateRuntimeProbeEntryArgs:
      clonePlain(eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeEntryArgs || []),
    eshkolProductionCandidateRuntimeProbeExpectedEntryResult:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeExpectedEntryResult ?? null,
    eshkolProductionCandidateRuntimeProbeChangedBytesInDeclaredTensorRange:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeChangedBytesInDeclaredTensorRange ?? null,
    eshkolProductionCandidateRuntimeProbeOutputTensorsProduced:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeOutputTensorsProduced ?? null,
    eshkolProductionCandidateRuntimeProbeProductionHandlerReady:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeProductionHandlerReady ?? null,
    eshkolProductionCandidateRuntimeProbeProductionHandlerRuntimeExecution:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeProductionHandlerRuntimeExecution ?? null,
    eshkolProductionCandidateRuntimeProbeScientificValidation:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeScientificValidation ?? null,
    eshkolProductionCandidateRuntimeProbeFullPhysicsValidation:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeFullPhysicsValidation ?? null,
    eshkolProductionCandidateRuntimeProbeFullFidelityMagnetarSimulation:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeFullFidelityMagnetarSimulation ?? null,
    eshkolProductionCandidateRuntimeProbeHostImportOptions:
      clonePlain(eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeHostImportOptions || null),
    eshkolProductionCandidateRuntimeProbeHostImportCallCounts:
      clonePlain(eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeHostImportCallCounts || null),
    eshkolProductionCandidateRuntimeProbeBlocker:
      eshkolProductionHandlerBoundary?.productionCandidateRuntimeProbeBlocker ?? null,
    eshkolProductionDispatchPreflightSchema:
      eshkolProductionHandlerBoundary?.dispatchPreflightSchema ?? null,
    eshkolProductionDispatchPreflightStatus:
      eshkolProductionHandlerBoundary?.dispatchPreflightStatus ?? null,
    eshkolProductionDispatchPreflightReady:
      eshkolProductionHandlerBoundary?.dispatchPreflightReady ?? null,
    eshkolProductionDispatchPreflightDeclared:
      eshkolProductionHandlerBoundary?.dispatchPreflightDeclared ?? null,
    eshkolProductionDispatchPreflightDispatchSchema:
      eshkolProductionHandlerBoundary?.dispatchPreflightDispatchSchema ?? null,
    eshkolProductionDispatchPreflightCurrentRuntimeAbi:
      eshkolProductionHandlerBoundary?.dispatchPreflightCurrentRuntimeAbi ?? null,
    eshkolProductionDispatchPreflightRequiredRuntimeAbi:
      eshkolProductionHandlerBoundary?.dispatchPreflightRequiredRuntimeAbi ?? null,
    eshkolProductionDispatchPreflightRuntimeSmokeStubsAllowed:
      eshkolProductionHandlerBoundary?.dispatchPreflightRuntimeSmokeStubsAllowed ?? null,
    eshkolProductionDispatchPreflightRequiredChecks:
      eshkolProductionHandlerBoundary?.dispatchPreflightRequiredChecks || [],
    eshkolProductionDispatchPreflightCheckSummarySchema:
      eshkolProductionHandlerBoundary?.dispatchPreflightCheckSummarySchema ?? null,
    eshkolProductionDispatchPreflightCheckSummaryStatus:
      eshkolProductionHandlerBoundary?.dispatchPreflightCheckSummaryStatus ?? null,
    eshkolProductionDispatchPreflightCheckSummaryReady:
      eshkolProductionHandlerBoundary?.dispatchPreflightCheckSummaryReady ?? null,
    eshkolProductionDispatchPreflightTotalRequiredCheckCount:
      eshkolProductionHandlerBoundary?.dispatchPreflightTotalRequiredCheckCount ?? null,
    eshkolProductionDispatchPreflightPassedCheckCount:
      eshkolProductionHandlerBoundary?.dispatchPreflightPassedCheckCount ?? null,
    eshkolProductionDispatchPreflightBlockedCheckCount:
      eshkolProductionHandlerBoundary?.dispatchPreflightBlockedCheckCount ?? null,
    eshkolProductionDispatchPreflightPassedChecks:
      eshkolProductionHandlerBoundary?.dispatchPreflightPassedChecks || [],
    eshkolProductionDispatchPreflightBlockedChecks:
      eshkolProductionHandlerBoundary?.dispatchPreflightBlockedChecks || [],
    eshkolProductionDispatchPreflightCheckResults:
      eshkolProductionHandlerBoundary?.dispatchPreflightCheckResults || [],
    eshkolProductionDispatchPreflightRejectedRuntimeScopes:
      eshkolProductionHandlerBoundary?.dispatchPreflightRejectedRuntimeScopes || [],
    eshkolProductionDispatchPreflightBlockedBy:
      eshkolProductionHandlerBoundary?.dispatchPreflightBlockedBy || [],
    eshkolProductionHandlerBoundaryValidationBlockerCount:
      eshkolProductionHandlerBoundary?.validationBlockerCount ?? null,
    eshkolProductionHandlerBoundaryValidationBlockers:
      eshkolProductionHandlerBoundary?.validationBlockers || [],
    eshkolProductionHandlerBoundary,
    closureReady: artifactKind === 'closure'
      && closureValidationReady
      && execution.serviceWorkerSafe === true
      && validity.requiresDynamicCode === false,
    responseDescriptorSchema: responseDescriptor?.schema || null,
    responseDescriptorReady: responseDescriptor?.schema === ULG_QUANTUM_RESPONSE_DESCRIPTOR_SCHEMA,
    paritySchema: parity?.schema || null,
    parityStatus: parity?.status || null,
    parityReady: parity?.schema === ULG_QUANTUM_RESPONSE_PARITY_SCHEMA,
    parityModeCount: parityComparisons.length,
    unsupportedParityModeCount,
    unsupportedParityModes: parityComparisons
      .filter((entry) => entry?.status === 'unsupported')
      .map((entry) => String(entry.mode || '').trim())
      .filter(Boolean),
    magnetarReferenceReady: artifactKind === 'quantum-response'
      && magnetarReference?.schema === MOONLAB_MAGNETAR_REFERENCE_SCHEMA
      && magnetarReference?.role === MOONLAB_MAGNETAR_REFERENCE_ROLE
      && typeof magnetarReference?.contractHash === 'string'
      && magnetarReference.contractHash.startsWith('sha256:')
      && magnetarReference?.energyUnits === 'normalized-ising'
      && magnetarReferenceGroundStateBitString != null
      && magnetarReferenceGroundStateEnergy != null
      && magnetarReferenceToleranceEnergyAbs != null
      && magnetarReferenceMaxObservedEnergyDelta != null
      && magnetarReferenceValidationStatus === 'pass'
      && magnetarReferenceMaxObservedEnergyDelta <= magnetarReferenceToleranceEnergyAbs,
    magnetarReferenceSchema: magnetarReference?.schema || null,
    magnetarReferenceRole: magnetarReference?.role || null,
    magnetarReferenceContractHash: magnetarReference?.contractHash || null,
    magnetarReferenceEnergyUnits: magnetarReference?.energyUnits || null,
    magnetarReferenceGroundStateBitString,
    magnetarReferenceGroundStateEnergy,
    magnetarReferenceToleranceEnergyAbs,
    magnetarReferenceMaxObservedEnergyDelta,
    magnetarReferenceValidationStatus,
    magnetarCalibratedReferenceCount: magnetarCalibratedReferences.length,
    magnetarCalibratedReferenceReadyCount: magnetarCalibratedReferences.filter((entry) => entry.ready).length,
    magnetarCalibratedReferenceScientificCoverageCount: magnetarCalibratedReferences
      .filter((entry) => entry.scientificCoverage === true).length,
    magnetarCalibratedReferences,
    moonlabWebGpuParityScopeReady: moonlabWebGpuParityScope?.ready === true,
    moonlabWebGpuParityScopeSchema: moonlabWebGpuParityScope?.schema || null,
    moonlabWebGpuParityScopeStatus: moonlabWebGpuParityScope?.status || null,
    moonlabWebGpuParityScopeContractReady: moonlabWebGpuParityScope?.contractReady ?? null,
    moonlabWebGpuParityScopeContractValidationValid: moonlabWebGpuParityScope?.contractValidationValid ?? null,
    moonlabWebGpuParityScopeReducedFixtureOnly: moonlabWebGpuParityScope?.reducedFixtureOnly ?? null,
    moonlabWebGpuParityScopeBackendAvailable: moonlabWebGpuParityScope?.backendAvailable ?? null,
    moonlabWebGpuParityScopeWebgpuParityExecuted: moonlabWebGpuParityScope?.webgpuParityExecuted ?? null,
    moonlabWebGpuParityScopeWebgpuParityPassed: moonlabWebGpuParityScope?.webgpuParityPassed ?? null,
    moonlabWebGpuParityScopeComplex64PreflightPassed: moonlabWebGpuParityScope?.complex64PreflightPassed ?? null,
    moonlabWebGpuParityScopeFullFidelityMagnetarSimulation:
      moonlabWebGpuParityScope?.fullFidelityMagnetarSimulation ?? null,
    moonlabWebGpuParityScopeFullPhysicsValidation: moonlabWebGpuParityScope?.fullPhysicsValidation ?? null,
    moonlabWebGpuParityScopeBlockerCount: moonlabWebGpuParityScope?.blockerCount ?? null,
    moonlabWebGpuParityScopeBlockers: moonlabWebGpuParityScope?.blockers || [],
    moonlabWebGpuParityScopeValidationBlockerCount: moonlabWebGpuParityScope?.validationBlockerCount ?? null,
    moonlabWebGpuParityScopeValidationBlockers: moonlabWebGpuParityScope?.validationBlockers || [],
    moonlabWebGpuParityScope,
    calibrationArtifactCount: calibrationSummaries.length,
    calibrationReadyCount: calibrationSummaries.filter((entry) => entry.ready).length,
    calibrationArtifacts: calibrationSummaries,
    magnetarDipoleIsingReady: magnetarDipoleIsing?.ready === true,
    magnetarDipoleIsingStatus: magnetarDipoleIsing?.status || null,
    magnetarDipoleIsingParityStatus: magnetarDipoleIsing?.parityStatus || null,
    magnetarDipoleIsingGroundState: magnetarDipoleIsing?.groundStateBitString || null,
    magnetarDipoleIsingMaxEnergyDelta: magnetarDipoleIsing?.maxEnergyDelta ?? null,
    magnetarDipoleIsingEvaluatedBitstrings: magnetarDipoleIsing?.evaluatedBitstrings ?? null
  };
}

export function createUlgArtifactResult(task = {}, artifact = {}, options = {}) {
  const capsule = task.capsule || task;
  const serviceId = normalizeId(task.serviceId || capsule.serviceId, 'serviceId');
  const taskKind = normalizeId(task.taskKind || capsule.taskKind, 'taskKind');
  const taskId = normalizeId(task.taskId || capsule.taskId, 'taskId');
  const outputs = normalizeUlgArtifactOutputs(task.outputs || capsule.outputs || [], taskKind);
  const output = outputs.find((item) => item.artifactKind === options.artifactKind)
    || outputs[options.outputIndex || 0]
    || { outputIndex: 0, artifactKind: TASK_ARTIFACT_KIND[taskKind] || 'artifact', artifactSchema: null };
  const artifactKind = String(options.artifactKind || artifact.artifactKind || output.artifactKind).trim();
  const contentHash = String(
    options.contentHash
      || artifact.contentHash
      || artifact.hash
      || output.contentHash
      || ''
  ).trim();
  if (!contentHash) {
    throw new Error(`ULG ${artifactKind} artifact requires a contentHash`);
  }
  const artifactBody = clonePlain(artifact);
  const artifactSummary = summarizeUlgArtifact(artifactKind, artifactBody);

  return {
    schema: ULG_ARTIFACT_RESULT_SCHEMA,
    serviceId,
    taskKind,
    taskId,
    rootTaskId: task.rootTaskId || capsule.rootTaskId || taskId,
    status: options.status || 'complete',
    outputs: [{
      ...clonePlain(output),
      artifactKind,
      contentHash,
      artifactRefHint: `ulg:${artifactKind}:${contentHash}`,
      artifactSummary
    }],
    artifactSummary,
    artifact: {
      ...artifactBody,
      schema: artifactBody.schema || output.artifactSchema || `${artifactKind}.artifact.v0.5`,
      artifactKind,
      contentHash,
      sourceService: artifactBody.sourceService || serviceId,
      serviceId,
      taskKind,
      taskId,
      provenance: clonePlain(artifactBody.provenance || task.provenance || capsule.provenance || null)
    }
  };
}

export const createUlgV05ArtifactResult = createUlgArtifactResult;

export function normalizeUlgDemoHandoffArtifact(entry = {}, index = 0) {
  if (!entry || typeof entry !== 'object') {
    throw new Error('ULG demo handoff artifact entry is required');
  }
  const artifact = clonePlain(entry.artifact || {});
  const artifactKind = String(
    entry.artifactKind
      || entry.artifactSummary?.artifactKind
      || artifact.artifactKind
      || 'artifact'
  ).trim();
  const computedArtifactSummary = summarizeUlgArtifact(artifactKind, artifact);
  const artifactSummary = entry.artifactSummary
    ? { ...computedArtifactSummary, ...clonePlain(entry.artifactSummary) }
    : computedArtifactSummary;
  const wasmBytes = normalizeWasmByteArray(entry.wasmBytes);
  const wasmByteLength = wasmBytes?.length ?? finiteNumberOrNull(entry.wasmByteLength);
  const sourceService = artifactSummary.sourceService
    || artifact.sourceService
    || entry.ref?.sourceService
    || null;
  const validationStatus = artifactSummary.validationStatus
    || artifact.validation?.status
    || artifact.validationStatus
    || null;
  const bundleManifest = artifact.runtime?.bundleManifest && typeof artifact.runtime.bundleManifest === 'object'
    ? artifact.runtime.bundleManifest
    : null;
  const wasmSourceUrl = entry.wasmSourceUrl || null;
  const transfer = normalizeUlgHandoffArtifactTransfer({
    index,
    ref: entry.ref || null,
    sourceService,
    artifactKind,
    artifactSummary,
    artifact,
    wasmBytes,
    wasmByteLength,
    wasmSourceUrl
  });
  return {
    schema: ULG_DEMO_HANDOFF_ADAPTER_SCHEMA,
    index,
    ref: clonePlain(entry.ref || null),
    sourceService,
    artifactKind,
    artifactSummary,
    artifact,
    validationStatus,
    bundleManifest: clonePlain(bundleManifest),
    wasmBytes,
    wasmByteLength,
    wasmSourceUrl,
    transfer,
    hasTransferredWasmBytes: artifactKind === 'closure' && Number(wasmByteLength) > 0,
    magnetarCalibrationReady: artifactSummary.magnetarDipoleIsingReady === true,
    closureOutputSemanticsReady: artifactSummary.closureOutputSemanticsReady === true,
    closureDescriptorReady: artifactSummary.closureDescriptorReady === true,
    closureReady: artifactSummary.closureReady === true
  };
}

export function normalizeUlgDemoHandoff(handoff = {}, options = {}) {
  if (!handoff || typeof handoff !== 'object') {
    throw new Error('ULG demo handoff is required');
  }
  const artifacts = Array.isArray(handoff.artifacts)
    ? handoff.artifacts.map((entry, index) => normalizeUlgDemoHandoffArtifact(entry, index))
    : [];
  const calibrationArtifacts = artifacts.filter((entry) => (
    entry.artifactKind === 'quantum-response'
    && entry.magnetarCalibrationReady
  ));
  const closureArtifacts = artifacts.filter((entry) => (
    entry.artifactKind === 'closure'
    && entry.closureReady
  ));
  const closureArtifactsWithBytes = closureArtifacts.filter((entry) => entry.hasTransferredWasmBytes);
  const artifactTransfers = artifacts.map((entry) => entry.transfer).filter(Boolean);
  const transferBlockers = uniqueStrings([
    artifactTransfers.length > 0 ? null : 'ulg-handoff-artifacts-missing',
    ...artifactTransfers.flatMap((entry) => entry.blockers || [])
  ]);
  const transferManifest = {
    schema: ULG_HANDOFF_TRANSFER_MANIFEST_SCHEMA,
    sourceSchema: handoff.schema || null,
    createdAt: handoff.createdAt || null,
    receivedAt: options.receivedAt || new Date().toISOString(),
    artifactCount: artifactTransfers.length,
    relaySafeArtifactCount: artifactTransfers.filter((entry) => entry.relaySafe).length,
    transferredWasmArtifactCount: artifactTransfers.filter((entry) => entry.hasTransferredWasmBytes).length,
    transferredWasmByteLength: artifactTransfers.reduce((total, entry) => total + (entry.wasmByteLength || 0), 0),
    artifacts: artifactTransfers,
    ready: artifactTransfers.length > 0 && transferBlockers.length === 0,
    blockers: transferBlockers
  };
  const blockers = [];
  if (calibrationArtifacts.length === 0) {
    blockers.push('moonlab-magnetar-calibration-summary-missing');
  }
  if (closureArtifacts.length === 0) {
    blockers.push('eshkol-closure-bundle-summary-missing');
  }
  const descriptorOnlyClosureReady = closureArtifacts.some((entry) => entry.closureDescriptorReady === true);
  if (
    options.requireClosureWasmBytes !== false
    && closureArtifactsWithBytes.length === 0
    && descriptorOnlyClosureReady !== true
  ) {
    blockers.push('eshkol-closure-wasm-bytes-missing');
  }
  const acceptedSourceSchema = handoff.schema === ULG_DEMO_HANDOFF_SCHEMA;
  if (!acceptedSourceSchema) {
    blockers.push('ulg-demo-handoff-schema-unrecognized');
  }
  if (options.requireTransferManifest !== false) {
    for (const blocker of transferManifest.blockers) {
      blockers.push(blocker);
    }
  }
  const uniqueBlockers = uniqueStrings(blockers);
  return {
    schema: ULG_DEMO_HANDOFF_ADAPTER_SCHEMA,
    sourceSchema: handoff.schema || null,
    acceptedSourceSchema,
    createdAt: handoff.createdAt || null,
    receivedAt: options.receivedAt || new Date().toISOString(),
    declaredArtifactCount: finiteNumberOrNull(handoff.artifactCount),
    artifactCount: artifacts.length,
    artifacts,
    calibrationArtifacts,
    closureArtifacts,
    closureArtifactsWithBytes,
    readyCalibrationArtifact: calibrationArtifacts[0] || null,
    readyClosureArtifact: closureArtifactsWithBytes[0] || closureArtifacts[0] || null,
    transferManifest,
    transferReady: transferManifest.ready,
    transferBlockers,
    status: uniqueBlockers.length === 0 ? 'handoff-ready' : 'handoff-pending',
    ready: uniqueBlockers.length === 0,
    blockers: uniqueBlockers
  };
}

function normalizeUlgHandoffEnvelopeArtifactRef(entry = {}) {
  const transfer = entry.transfer && typeof entry.transfer === 'object' ? entry.transfer : {};
  const artifactSummary = entry.artifactSummary && typeof entry.artifactSummary === 'object'
    ? entry.artifactSummary
    : {};
  const artifactRefUri = stringOrNull(transfer.artifactRefUri || entry.ref?.uri);
  const artifactRefHash = stringOrNull(
    transfer.artifactRefHash
    || entry.ref?.artifactHash
    || entry.ref?.hash
  );
  const artifactContentHash = stringOrNull(
    transfer.artifactContentHash
    || entry.artifact?.contentHash
    || entry.artifact?.hash
    || artifactSummary.contentHash
    || artifactRefHash
  );
  const artifactKind = stringOrNull(entry.artifactKind || transfer.artifactKind || artifactSummary.artifactKind)
    || 'artifact';
  const sourceService = stringOrNull(
    transfer.sourceService
    || entry.sourceService
    || artifactSummary.sourceService
    || entry.ref?.sourceService
  );
  const contentAddressed = artifactRefUri != null && (artifactContentHash != null || artifactRefHash != null);
  const relaySafe = transfer.relaySafe === true && contentAddressed;
  const classificationReady = artifactKind === 'closure'
    ? entry.closureReady === true
    : (artifactKind === 'quantum-response' ? entry.magnetarCalibrationReady === true : true);
  const blockers = uniqueStrings([
    ...(Array.isArray(transfer.blockers) ? transfer.blockers : []),
    artifactRefUri ? null : 'ulg-artifact-ref-uri-missing',
    artifactContentHash || artifactRefHash ? null : 'ulg-artifact-content-hash-missing',
    transfer.relaySafe === false ? 'ulg-artifact-transfer-not-relay-safe' : null,
    artifactKind === 'closure' && entry.closureReady !== true ? 'eshkol-closure-bundle-summary-missing' : null,
    artifactKind === 'quantum-response' && entry.magnetarCalibrationReady !== true
      ? 'moonlab-magnetar-calibration-summary-missing'
      : null
  ]);
  return {
    index: entry.index,
    sourceService,
    artifactKind,
    artifactRefUri,
    artifactRefHash,
    artifactContentHash,
    contentAddressed,
    digestAddressed: hasSha256Digest(artifactContentHash) || hasSha256Digest(artifactRefHash),
    relaySafe,
    ready: relaySafe && classificationReady && blockers.length === 0,
    transferMode: transfer.wasmTransferMode || null,
    wasmTransferMode: transfer.wasmTransferMode || null,
    wasmByteLength: transfer.wasmByteLength ?? entry.wasmByteLength ?? null,
    wasmSha256: transfer.wasmSha256 || artifactSummary.closureModuleSha256 || null,
    wasmSourceUrl: transfer.wasmSourceUrl || entry.wasmSourceUrl || null,
    hasTransferredWasmBytes: transfer.hasTransferredWasmBytes === true || entry.hasTransferredWasmBytes === true,
    summarySchema: artifactSummary.schema || null,
    artifactId: artifactSummary.artifactId || entry.artifact?.artifactId || entry.artifact?.closureId || null,
    validationStatus: entry.validationStatus || artifactSummary.validationStatus || null,
    magnetarCalibrationReady: entry.magnetarCalibrationReady === true,
    closureReady: entry.closureReady === true,
    closureDescriptorReady: entry.closureDescriptorReady === true,
    closureOutputSemanticsReady: entry.closureOutputSemanticsReady === true,
    blockers
  };
}

function createUlgHandoffEnvelopeId(normalizedHandoff = {}, artifactRefs = [], options = {}) {
  const explicitId = stringOrNull(options.handoffId || normalizedHandoff.handoffId || normalizedHandoff.id);
  if (explicitId) return explicitId;
  const addressBasis = artifactRefs
    .map((entry) => entry.artifactContentHash || entry.artifactRefHash || entry.artifactRefUri || `index:${entry.index}`)
    .join('|');
  const timeBasis = normalizedHandoff.createdAt || normalizedHandoff.receivedAt || 'undated';
  return `ulg-handoff:${timeBasis}:${artifactRefs.length}:${addressBasis || 'empty'}`;
}

export function createUlgHandoffServiceEnvelope(handoff = {}, options = {}) {
  if (!handoff || typeof handoff !== 'object') {
    throw new Error('ULG handoff is required');
  }
  const receivedAt = options.receivedAt || handoff.receivedAt || new Date().toISOString();
  const normalizedHandoff = handoff.schema === ULG_DEMO_HANDOFF_ADAPTER_SCHEMA
    ? { ...clonePlain(handoff), receivedAt }
    : normalizeUlgDemoHandoff(handoff, { ...options, receivedAt });
  const artifactRefs = normalizedHandoff.artifacts.map((entry) => normalizeUlgHandoffEnvelopeArtifactRef(entry));
  const contentAddressedArtifactCount = artifactRefs.filter((entry) => entry.contentAddressed).length;
  const relaySafeArtifactCount = artifactRefs.filter((entry) => entry.relaySafe).length;
  const readyArtifactCount = artifactRefs.filter((entry) => entry.ready).length;
  const transferManifest = clonePlain(normalizedHandoff.transferManifest || null);
  const blockers = uniqueStrings([
    ...(Array.isArray(normalizedHandoff.blockers) ? normalizedHandoff.blockers : []),
    artifactRefs.length > 0 ? null : 'ulg-handoff-artifacts-missing',
    ...artifactRefs.flatMap((entry) => entry.blockers || []),
    transferManifest?.ready === false ? 'ulg-handoff-transfer-manifest-not-ready' : null
  ]);
  const artifactCount = artifactRefs.length;
  const contentAddressed = artifactCount > 0 && contentAddressedArtifactCount === artifactCount;
  const relaySafe = artifactCount > 0 && relaySafeArtifactCount === artifactCount;
  const ready = normalizedHandoff.ready === true
    && normalizedHandoff.transferReady === true
    && contentAddressed
    && relaySafe
    && readyArtifactCount === artifactCount
    && blockers.length === 0;
  return {
    schema: ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA,
    handoffId: createUlgHandoffEnvelopeId(normalizedHandoff, artifactRefs, options),
    sourceSchema: normalizedHandoff.sourceSchema,
    adapterSchema: normalizedHandoff.schema,
    createdAt: normalizedHandoff.createdAt,
    receivedAt,
    source: {
      origin: stringOrNull(options.origin || handoff.origin || handoff.source?.origin),
      url: stringOrNull(options.url || handoff.url || handoff.source?.url),
      sourceSchema: normalizedHandoff.sourceSchema,
      adapterSchema: normalizedHandoff.schema,
      serviceIds: uniqueStrings(artifactRefs.map((entry) => entry.sourceService)),
      declaredArtifactCount: normalizedHandoff.declaredArtifactCount,
      artifactCount
    },
    provenance: {
      adapter: ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA,
      handoffAdapter: ULG_DEMO_HANDOFF_ADAPTER_SCHEMA,
      source: stringOrNull(options.source) || 'ulg-demo-browser-cache',
      receivedAt,
      contentAddressed,
      relaySafe,
      transferManifestReady: normalizedHandoff.transferReady === true,
      readyArtifactCount,
      blockerCount: blockers.length
    },
    artifactCount,
    contentAddressedArtifactCount,
    relaySafeArtifactCount,
    readyArtifactCount,
    artifactRefs,
    transferManifest,
    handoff: normalizedHandoff,
    status: ready ? 'service-envelope-ready' : 'service-envelope-pending',
    ready,
    blockers
  };
}

export const normalizeUlgHandoffServiceEnvelope = createUlgHandoffServiceEnvelope;
