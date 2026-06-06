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

const DEFAULT_PROTOCOL_VERSION = '0.5';
const MOONLAB_MAGNETAR_REFERENCE_SCHEMA = 'moonlab.magnetar-dipole-ising-reference.v0';
const MOONLAB_MAGNETAR_REFERENCE_ROLE = 'peercompute-reference-tolerance-input';
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
  const bundleManifest = artifact.runtime?.bundleManifest && typeof artifact.runtime.bundleManifest === 'object'
    ? artifact.runtime.bundleManifest
    : (artifact.bundleManifest && typeof artifact.bundleManifest === 'object' ? artifact.bundleManifest : null);
  const bundleCopyFiles = Array.isArray(bundleManifest?.copyFiles)
    ? bundleManifest.copyFiles
    : (Array.isArray(bundleManifest?.manualDeploy?.copyFiles) ? bundleManifest.manualDeploy.copyFiles : []);
  const hostImports = bundleManifest?.hostImports && typeof bundleManifest.hostImports === 'object'
    ? bundleManifest.hostImports
    : (artifact.runtime?.hostImports && typeof artifact.runtime.hostImports === 'object' ? artifact.runtime.hostImports : null);
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
