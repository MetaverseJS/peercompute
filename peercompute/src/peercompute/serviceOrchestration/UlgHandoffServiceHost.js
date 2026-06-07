import {
  ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA,
  createUlgHandoffServiceEnvelope
} from './ulgManifestAdapter.js';

export const ULG_HANDOFF_SERVICE_ADAPTER_SCHEMA = 'peercompute.ulg.handoff-service-adapter.v0';
export const ULG_HANDOFF_SERVICE_TASK_SCHEMA = 'peercompute.ulg.handoff-service-task.v0';
export const ULG_HANDOFF_SERVICE_RESULT_SCHEMA = 'peercompute.ulg.handoff-service-result.v0';
export const ULG_HANDOFF_SERVICE_DISPATCH_PLAN_SCHEMA = 'peercompute.ulg.handoff-service-dispatch-plan.v0';
export const ULG_HANDOFF_SERVICE_DISPATCH_RESULT_SCHEMA = 'peercompute.ulg.handoff-service-dispatch-result.v0';
export const ULG_HANDOFF_SUPERVISOR_EXECUTOR_SCHEMA = 'peercompute.ulg.handoff-supervisor-service-executor.v0';
export const ULG_HANDOFF_SUPERVISOR_SERVICE_SUMMARY_SCHEMA = 'peercompute.ulg.handoff-supervisor-service-summary.v0';
export const ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA = 'peercompute.ulg.handoff-dispatch-artifact-payload.v0';

const DEFAULT_DISPATCH_SERVICE_IDS = Object.freeze({
  eshkol: 'eshkol-ulg-fixture',
  moonlab: 'moonlab-ulg-fixture'
});

function clonePlain(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function scheduleMicrotask(fn) {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(fn);
  } else {
    Promise.resolve().then(fn);
  }
}

function normalizeRootTaskId(task = {}) {
  return String(task.rootTaskId || task.taskId || task.id || `ulg-handoff-${Date.now()}`).trim();
}

function stringOrNull(value) {
  if (value == null) return null;
  const text = String(value).trim();
  return text || null;
}

function uniqueStrings(values = []) {
  return [...new Set(values.map((value) => stringOrNull(value)).filter(Boolean))];
}

function objectOrNull(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
}

function finiteNumberOrNull(value) {
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function booleanOrNull(value) {
  return typeof value === 'boolean' ? value : null;
}

function normalizeDispatchServiceIds(options = {}) {
  return {
    ...DEFAULT_DISPATCH_SERVICE_IDS,
    ...clonePlain(options.serviceIds || options.serviceIdBySource || {})
  };
}

function normalizeSourceKey(artifactRef = {}) {
  const sourceService = String(artifactRef.sourceService || '').trim().toLowerCase();
  if (sourceService.includes('eshkol') || artifactRef.artifactKind === 'closure') return 'eshkol';
  if (sourceService.includes('moonlab') || artifactRef.artifactKind === 'quantum-response') return 'moonlab';
  return sourceService || null;
}

function inferDispatchTaskKind(artifactRef = {}) {
  if (artifactRef.artifactKind === 'closure' || normalizeSourceKey(artifactRef) === 'eshkol') {
    return artifactRef.closureDescriptorReady === true && artifactRef.hasTransferredWasmBytes !== true
      ? 'eshkol.ulg.closure.descriptor-bind'
      : 'eshkol.ulg.closure-artifact.ingest';
  }
  if (artifactRef.artifactKind === 'quantum-response' || normalizeSourceKey(artifactRef) === 'moonlab') {
    return 'moonlab.ulg.quantum-response.ingest';
  }
  return 'ulg.artifact.ingest';
}

function createArtifactDispatchTask(envelope = {}, artifactRef = {}, dispatch = {}) {
  return {
    schema: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    taskId: dispatch.dispatchId,
    rootTaskId: dispatch.dispatchId,
    taskKind: dispatch.taskKind,
    serviceId: dispatch.serviceId,
    handoffId: envelope.handoffId || null,
    envelopeSchema: envelope.schema || null,
    artifactRef: {
      index: artifactRef.index ?? null,
      uri: artifactRef.artifactRefUri || null,
      artifactHash: artifactRef.artifactRefHash || null,
      contentHash: artifactRef.artifactContentHash || null,
      sourceService: artifactRef.sourceService || null,
      artifactKind: artifactRef.artifactKind || null
    },
    transfer: {
      relaySafe: artifactRef.relaySafe === true,
      contentAddressed: artifactRef.contentAddressed === true,
      digestAddressed: artifactRef.digestAddressed === true,
      hasTransferredWasmBytes: artifactRef.hasTransferredWasmBytes === true,
      wasmByteLength: artifactRef.wasmByteLength ?? null,
      wasmSha256: artifactRef.wasmSha256 || null,
      wasmTransferMode: artifactRef.wasmTransferMode || null,
      wasmSourceUrl: artifactRef.wasmSourceUrl || null
    }
  };
}

function normalizeDispatchOutput(output, dispatch = {}) {
  const body = output && typeof output === 'object' ? clonePlain(output) : { value: output };
  const blockers = uniqueStrings(Array.isArray(body.blockers) ? body.blockers : []);
  const status = stringOrNull(body.status) || 'accepted';
  const ready = body.ready !== false && status !== 'error' && status !== 'blocked' && blockers.length === 0;
  return {
    dispatchId: dispatch.dispatchId,
    serviceId: dispatch.serviceId,
    sourceService: dispatch.sourceService,
    artifactKind: dispatch.artifactKind,
    taskKind: dispatch.taskKind,
    status,
    ready,
    blockers,
    output: body
  };
}

function findDispatchArtifactEntry(envelope = {}, dispatch = {}) {
  const artifacts = Array.isArray(envelope.handoff?.artifacts) ? envelope.handoff.artifacts : [];
  return artifacts.find((entry) => entry.index === dispatch.index)
    || artifacts.find((entry) => (
      entry.artifactKind === dispatch.artifactKind
      && (entry.sourceService === dispatch.sourceService || entry.sourceService === dispatch.sourceKey)
    ))
    || null;
}

function createDispatchArtifactPayload(envelope = {}, dispatch = {}) {
  const entry = findDispatchArtifactEntry(envelope, dispatch);
  if (!entry) return null;
  return {
    schema: ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA,
    handoffId: envelope.handoffId || dispatch.handoffId || null,
    dispatchId: dispatch.dispatchId || null,
    index: entry.index ?? dispatch.index ?? null,
    sourceService: entry.sourceService || dispatch.sourceService || null,
    artifactKind: entry.artifactKind || dispatch.artifactKind || null,
    artifactRefUri: dispatch.artifactRefUri || entry.transfer?.artifactRefUri || entry.ref?.uri || null,
    artifactContentHash: dispatch.artifactContentHash
      || entry.transfer?.artifactContentHash
      || entry.ref?.artifactHash
      || entry.ref?.hash
      || null,
    artifactSummary: clonePlain(entry.artifactSummary || null),
    artifact: clonePlain(entry.artifact || null),
    bundleManifest: clonePlain(entry.bundleManifest || null),
    validationStatus: entry.validationStatus || null,
    wasmBytes: clonePlain(entry.wasmBytes || null),
    wasmByteLength: entry.wasmByteLength ?? dispatch.wasmByteLength ?? null,
    wasmSha256: entry.transfer?.wasmSha256 || dispatch.wasmSha256 || null,
    wasmTransferMode: entry.transfer?.wasmTransferMode || dispatch.wasmTransferMode || null,
    wasmSourceUrl: entry.wasmSourceUrl || dispatch.wasmSourceUrl || null,
    hasTransferredWasmBytes: entry.hasTransferredWasmBytes === true || dispatch.hasTransferredWasmBytes === true
  };
}

export function createUlgHandoffServiceDispatchPlan(envelope = {}, options = {}) {
  const normalizedEnvelope = envelope?.schema === ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA
    ? clonePlain(envelope)
    : createUlgHandoffServiceEnvelope(envelope, options);
  const serviceIds = normalizeDispatchServiceIds(options);
  const artifactRefs = Array.isArray(normalizedEnvelope.artifactRefs) ? normalizedEnvelope.artifactRefs : [];
  const dispatches = artifactRefs.map((artifactRef, index) => {
    const sourceKey = normalizeSourceKey(artifactRef);
    const serviceId = stringOrNull(serviceIds[sourceKey] || artifactRef.sourceService);
    const taskKind = inferDispatchTaskKind(artifactRef);
    const dispatchId = `${normalizedEnvelope.handoffId || 'ulg-handoff'}:dispatch:${index}`;
    const blockers = uniqueStrings([
      ...(Array.isArray(artifactRef.blockers) ? artifactRef.blockers : []),
      serviceId ? null : 'ulg-dispatch-service-missing',
      artifactRef.artifactRefUri ? null : 'ulg-dispatch-artifact-ref-uri-missing',
      artifactRef.contentAddressed === true ? null : 'ulg-dispatch-artifact-not-content-addressed',
      artifactRef.relaySafe === true ? null : 'ulg-dispatch-artifact-not-relay-safe',
      artifactRef.ready === true ? null : 'ulg-dispatch-artifact-not-ready'
    ]);
    const dispatch = {
      dispatchId,
      handoffId: normalizedEnvelope.handoffId || null,
      index,
      serviceId,
      sourceService: artifactRef.sourceService || sourceKey,
      sourceKey,
      artifactKind: artifactRef.artifactKind || 'artifact',
      taskKind,
      artifactRefUri: artifactRef.artifactRefUri || null,
      artifactRefHash: artifactRef.artifactRefHash || null,
      artifactContentHash: artifactRef.artifactContentHash || null,
      contentAddressed: artifactRef.contentAddressed === true,
      digestAddressed: artifactRef.digestAddressed === true,
      relaySafe: artifactRef.relaySafe === true,
      hasTransferredWasmBytes: artifactRef.hasTransferredWasmBytes === true,
      wasmByteLength: artifactRef.wasmByteLength ?? null,
      wasmSha256: artifactRef.wasmSha256 || null,
      wasmTransferMode: artifactRef.wasmTransferMode || null,
      wasmSourceUrl: artifactRef.wasmSourceUrl || null,
      validationStatus: artifactRef.validationStatus || null,
      magnetarCalibrationReady: artifactRef.magnetarCalibrationReady === true,
      closureReady: artifactRef.closureReady === true,
      closureDescriptorReady: artifactRef.closureDescriptorReady === true,
      closureOutputSemanticsReady: artifactRef.closureOutputSemanticsReady === true,
      blockers,
      ready: blockers.length === 0
    };
    return {
      ...dispatch,
      task: createArtifactDispatchTask(normalizedEnvelope, artifactRef, dispatch)
    };
  });
  const dispatchBlockers = uniqueStrings(dispatches.flatMap((entry) => entry.blockers || []));
  const blockers = uniqueStrings([
    normalizedEnvelope.ready === true ? null : 'ulg-handoff-service-envelope-not-ready',
    ...(Array.isArray(normalizedEnvelope.blockers) ? normalizedEnvelope.blockers : []),
    artifactRefs.length > 0 ? null : 'ulg-handoff-dispatch-artifacts-missing',
    ...dispatchBlockers
  ]);
  const readyDispatchCount = dispatches.filter((entry) => entry.ready).length;
  const ready = normalizedEnvelope.ready === true
    && dispatches.length > 0
    && readyDispatchCount === dispatches.length
    && blockers.length === 0;
  return {
    schema: ULG_HANDOFF_SERVICE_DISPATCH_PLAN_SCHEMA,
    handoffId: normalizedEnvelope.handoffId || null,
    envelopeSchema: normalizedEnvelope.schema || null,
    envelopeStatus: normalizedEnvelope.status || null,
    createdAt: options.createdAt || normalizedEnvelope.receivedAt || new Date().toISOString(),
    dispatchCount: dispatches.length,
    readyDispatchCount,
    blockedDispatchCount: dispatches.length - readyDispatchCount,
    serviceIds: uniqueStrings(dispatches.map((entry) => entry.serviceId)),
    taskKinds: uniqueStrings(dispatches.map((entry) => entry.taskKind)),
    dispatches,
    status: ready ? 'dispatch-ready' : 'dispatch-blocked',
    ready,
    blockers
  };
}

function createNotExecutedDispatchResult(dispatchPlan = {}) {
  return {
    schema: ULG_HANDOFF_SERVICE_DISPATCH_RESULT_SCHEMA,
    handoffId: dispatchPlan.handoffId || null,
    planSchema: dispatchPlan.schema || null,
    status: 'not-executed',
    executed: false,
    ready: dispatchPlan.ready === true,
    dispatchCount: dispatchPlan.dispatchCount || 0,
    executedDispatchCount: 0,
    acceptedDispatchCount: 0,
    failedDispatchCount: 0,
    blockedDispatchCount: dispatchPlan.blockedDispatchCount || 0,
    results: [],
    blockers: []
  };
}

export function summarizeUlgHandoffSupervisorServiceResult(serviceResult = {}) {
  const result = objectOrNull(serviceResult) || {};
  const ingest = objectOrNull(result.ingest) || {};
  const probe = objectOrNull(result.probe) || {};
  const validation = objectOrNull(result.validation) || {};
  const serviceOutput = objectOrNull(result.serviceOutput) || {};
  const descriptorProbe = objectOrNull(probe.descriptorProbe) || {};
  const tensorContract = objectOrNull(descriptorProbe.tensorContract) || {};
  const interpolationTable = objectOrNull(descriptorProbe.interpolationTable) || {};
  const moonlabReferenceSuite = objectOrNull(descriptorProbe.moonlabNormalizedReferenceSuite) || {};
  const productTopologyBinding = objectOrNull(descriptorProbe.productTopologyBinding) || {};
  const tensorRuntimeContract = objectOrNull(descriptorProbe.tensorRuntimeContract) || {};
  const runtimeBinding = objectOrNull(descriptorProbe.runtimeBinding) || {};
  const productionHandlerBoundary = objectOrNull(descriptorProbe.productionHandlerBoundary)
    || objectOrNull(ingest.eshkolProductionHandlerBoundary)
    || null;
  const hostRuntimeProbe = objectOrNull(probe.hostRuntimeProbe) || {};
  const hostRuntimeExecution = objectOrNull(probe.hostRuntimeExecution) || {};
  const tensorRuntimeCandidate = objectOrNull(probe.tensorRuntimeCandidate) || {};
  const outputSemanticsValidation = objectOrNull(hostRuntimeExecution.outputSemanticsValidation) || {};
  const observedOutput = objectOrNull(outputSemanticsValidation.observed) || {};
  const tensorInputIds = Array.isArray(tensorContract.inputIds) ? tensorContract.inputIds : [];
  const tensorOutputIds = Array.isArray(tensorContract.outputIds) ? tensorContract.outputIds : [];
  return {
    schema: ULG_HANDOFF_SUPERVISOR_SERVICE_SUMMARY_SCHEMA,
    serviceResultSchema: result.schema || null,
    serviceStatus: result.serviceStatus || result.adapterStatus || result.status || null,
    taskKind: result.taskKind || null,
    ready: booleanOrNull(result.ready),
    probeSchema: probe.schema || null,
    probeStatus: probe.status || null,
    probeReady: booleanOrNull(probe.ready),
    probeMode: probe.probeMode || null,
    serviceHandlerReady: booleanOrNull(validation.serviceHandlerReady),
    serviceHandlerBlockers: uniqueStrings(validation.serviceHandlerBlockers || []),
    serviceHandlerOutputSchema: serviceOutput.schema || null,
    serviceHandlerOutputStatus: serviceOutput.serviceStatus || serviceOutput.status || null,
    serviceHandlerOutputReady: booleanOrNull(serviceOutput.ready),
    moduleCompiled: booleanOrNull(probe.moduleCompiled),
    moduleImportCount: finiteNumberOrNull(probe.importCount ?? ingest.moduleImportCount),
    moduleExportCount: finiteNumberOrNull(probe.exportCount ?? ingest.moduleExportCount),
    descriptorContractReady: booleanOrNull(ingest.descriptorContractReady ?? descriptorProbe.ready),
    descriptorContractStatus: ingest.descriptorContractStatus || descriptorProbe.status || null,
    descriptorScientificExecution: booleanOrNull(descriptorProbe.scientificExecution),
    descriptorScientificValidation: booleanOrNull(descriptorProbe.scientificValidation),
    descriptorTensorInputCount: tensorInputIds.length,
    descriptorTensorOutputCount: tensorOutputIds.length,
    descriptorTensorCoordinateSystem: tensorContract.coordinateSystem || null,
    descriptorTensorInterpolation: tensorContract.interpolation || null,
    descriptorTensorMatchesArtifactDescriptors: booleanOrNull(tensorContract.matchesArtifactDescriptors),
    descriptorInterpolationTableStatus: interpolationTable.status || null,
    descriptorInterpolationTableComputedFixture: booleanOrNull(interpolationTable.computedFixture),
    descriptorInterpolationTableScientificValidation: booleanOrNull(interpolationTable.scientificValidation),
    descriptorInterpolationTableSampleCount: finiteNumberOrNull(interpolationTable.sampleCount),
    descriptorInterpolationTableSamplePayloadCount: finiteNumberOrNull(interpolationTable.samplePayloadCount),
    descriptorInterpolationTableContentHash: interpolationTable.contentHash || null,
    descriptorInterpolationTableCoordinateSystem: interpolationTable.coordinateSystem || null,
    descriptorInterpolationTableMatchesTensorContract: booleanOrNull(interpolationTable.matchesTensorContract),
    descriptorInterpolationTableDescriptorBindingReady: booleanOrNull(interpolationTable.descriptorBindingReady),
    descriptorInterpolationTableTensorRuntimeMatches: booleanOrNull(
      interpolationTable.tensorRuntimeMatchesInterpolationTable
    ),
    descriptorInterpolationTableSampleShapeValidationReady: booleanOrNull(
      interpolationTable.tensorRuntimeSampleShapeValidationReady
    ),
    descriptorMoonLabReferenceSuiteReady: booleanOrNull(moonlabReferenceSuite.ready),
    descriptorMoonLabReferenceSuiteStatus: moonlabReferenceSuite.status || null,
    descriptorMoonLabReferenceCount: finiteNumberOrNull(moonlabReferenceSuite.referenceCount),
    descriptorProductTopologyStatus: productTopologyBinding.status || null,
    descriptorProductTopologyMatchesTensorContract: booleanOrNull(productTopologyBinding.matchesTensorContract),
    descriptorProductTopologyScientificValidation: booleanOrNull(productTopologyBinding.scientificValidation),
    descriptorTensorRuntimeContractReady: booleanOrNull(
      ingest.descriptorTensorRuntimeContractReady ?? tensorRuntimeContract.ready
    ),
    descriptorTensorRuntimeContractStatus:
      ingest.descriptorTensorRuntimeContractStatus || tensorRuntimeContract.status || null,
    descriptorTensorRuntimeContractHash:
      ingest.descriptorTensorRuntimeContractHash || tensorRuntimeContract.contractHash || null,
    descriptorTensorRuntimeRuntimeStatus: tensorRuntimeContract.runtimeStatus || null,
    descriptorTensorRuntimeRuntimeAbi: tensorRuntimeContract.runtimeAbi || null,
    descriptorTensorRuntimeExecutionClaim: tensorRuntimeContract.executionClaim || null,
    descriptorTensorRuntimeMatchesTensorContract: booleanOrNull(tensorRuntimeContract.matchesTensorContract),
    descriptorTensorRuntimeMatchesInterpolationTable: booleanOrNull(tensorRuntimeContract.matchesInterpolationTable),
    descriptorTensorRuntimeInterpolationTableId: tensorRuntimeContract.interpolationTableId || null,
    descriptorTensorRuntimeInterpolationTableContentHash:
      tensorRuntimeContract.interpolationTableContentHash || null,
    descriptorTensorRuntimeInterpolationTableSampleCount:
      finiteNumberOrNull(tensorRuntimeContract.interpolationTableSampleCount),
    descriptorTensorRuntimeSampleShapeValidationStatus:
      tensorRuntimeContract.sampleShapeValidationStatus || null,
    descriptorTensorRuntimeSampleShapeValidatedSampleCount:
      finiteNumberOrNull(tensorRuntimeContract.sampleShapeValidatedSampleCount),
    descriptorTensorRuntimeSampleShapeValidationMatchesTensorContract:
      booleanOrNull(tensorRuntimeContract.sampleShapeValidationMatchesTensorContract),
    descriptorTensorRuntimeSampleShapeValidationReady:
      booleanOrNull(tensorRuntimeContract.sampleShapeValidationReady),
    descriptorTensorRuntimeDeterministicRuntimeSmokeReady:
      booleanOrNull(tensorRuntimeContract.deterministicRuntimeSmokeReady),
    descriptorTensorRuntimeLinearMemoryBinding: clonePlain(
      objectOrNull(tensorRuntimeContract.linearMemoryBinding)
    ),
    descriptorTensorRuntimeScientificValidation: booleanOrNull(tensorRuntimeContract.scientificValidation),
    descriptorTensorRuntimeFullPhysicsValidation: booleanOrNull(tensorRuntimeContract.fullPhysicsValidation),
    descriptorRuntimeStatus: runtimeBinding.runtimeStatus || null,
    descriptorDerivativeStatus: runtimeBinding.derivativeStatus || null,
    descriptorRuntimeScientificValidation: booleanOrNull(runtimeBinding.scientificValidation),
    descriptorRuntimeDeclaredNotExecuted: runtimeBinding.runtimeStatus === 'declared-not-executed',
    descriptorRuntimeDeterministicSmokeExecuted:
      runtimeBinding.runtimeStatus === 'deterministic-runtime-smoke-executed',
    eshkolProductionHandlerBoundaryReady: booleanOrNull(
      ingest.eshkolProductionHandlerBoundaryReady ?? productionHandlerBoundary?.ready
    ),
    eshkolProductionHandlerBoundarySchema:
      ingest.eshkolProductionHandlerBoundarySchema || productionHandlerBoundary?.schema || null,
    eshkolProductionHandlerBoundaryStatus:
      ingest.eshkolProductionHandlerBoundaryStatus || productionHandlerBoundary?.status || null,
    eshkolProductionHandlerBoundaryHandlerReady: booleanOrNull(
      ingest.eshkolProductionHandlerBoundaryHandlerReady ?? productionHandlerBoundary?.handlerReady
    ),
    eshkolProductionHandlerBoundaryRuntimeExecution: booleanOrNull(
      ingest.eshkolProductionHandlerBoundaryRuntimeExecution ?? productionHandlerBoundary?.runtimeExecution
    ),
    eshkolProductionHandlerBoundaryScientificValidation: booleanOrNull(
      ingest.eshkolProductionHandlerBoundaryScientificValidation ?? productionHandlerBoundary?.scientificValidation
    ),
    eshkolProductionHandlerBoundaryFullPhysicsValidation: booleanOrNull(
      ingest.eshkolProductionHandlerBoundaryFullPhysicsValidation ?? productionHandlerBoundary?.fullPhysicsValidation
    ),
    eshkolProductionHandlerBoundaryFullFidelityMagnetarSimulation: booleanOrNull(
      ingest.eshkolProductionHandlerBoundaryFullFidelityMagnetarSimulation
        ?? productionHandlerBoundary?.fullFidelityMagnetarSimulation
    ),
    eshkolProductionHostImportsRuntimeScope:
      ingest.eshkolProductionHostImportsRuntimeScope
      || productionHandlerBoundary?.hostImportsRuntimeScope
      || null,
    eshkolProductionHostImportsImplementationStatus:
      ingest.eshkolProductionHostImportsImplementationStatus
      || productionHandlerBoundary?.hostImportsImplementationStatus
      || null,
    eshkolProductionHostImportCandidateStatus:
      ingest.eshkolProductionHostImportCandidateStatus
      || productionHandlerBoundary?.productionHostImportCandidateStatus
      || null,
    eshkolProductionHostImportCandidateProductionRuntimeAbi:
      ingest.eshkolProductionHostImportCandidateProductionRuntimeAbi
      || productionHandlerBoundary?.productionHostImportCandidateProductionRuntimeAbi
      || null,
    eshkolProductionHostImportCandidateRuntimeSmokeStubsAllowed: booleanOrNull(
      ingest.eshkolProductionHostImportCandidateRuntimeSmokeStubsAllowed
        ?? productionHandlerBoundary?.productionHostImportCandidateRuntimeSmokeStubsAllowed
    ),
    eshkolProductionHostImportCandidateRequiredNonStubImportCount:
      Array.isArray(ingest.eshkolProductionHostImportCandidateRequiredNonStubImports)
        ? ingest.eshkolProductionHostImportCandidateRequiredNonStubImports.length
        : (
            Array.isArray(productionHandlerBoundary?.productionHostImportCandidateRequiredNonStubImports)
              ? productionHandlerBoundary.productionHostImportCandidateRequiredNonStubImports.length
              : null
          ),
    eshkolProductionHostImportCandidateReadinessRequires: uniqueStrings(
      ingest.eshkolProductionHostImportCandidateReadinessRequires
      || productionHandlerBoundary?.productionHostImportCandidateReadinessRequires
      || []
    ),
    eshkolProductionHostImportCandidateBlockedBy: uniqueStrings(
      ingest.eshkolProductionHostImportCandidateBlockedBy
      || productionHandlerBoundary?.productionHostImportCandidateBlockedBy
      || []
    ),
    eshkolProductionDispatchPreflightSchema:
      ingest.eshkolProductionDispatchPreflightSchema
      || productionHandlerBoundary?.dispatchPreflightSchema
      || null,
    eshkolProductionDispatchPreflightStatus:
      ingest.eshkolProductionDispatchPreflightStatus
      || productionHandlerBoundary?.dispatchPreflightStatus
      || null,
    eshkolProductionDispatchPreflightReady: booleanOrNull(
      ingest.eshkolProductionDispatchPreflightReady ?? productionHandlerBoundary?.dispatchPreflightReady
    ),
    eshkolProductionDispatchPreflightDeclared: booleanOrNull(
      ingest.eshkolProductionDispatchPreflightDeclared ?? productionHandlerBoundary?.dispatchPreflightDeclared
    ),
    eshkolProductionDispatchPreflightCurrentRuntimeAbi:
      ingest.eshkolProductionDispatchPreflightCurrentRuntimeAbi
      || productionHandlerBoundary?.dispatchPreflightCurrentRuntimeAbi
      || null,
    eshkolProductionDispatchPreflightRequiredRuntimeAbi:
      ingest.eshkolProductionDispatchPreflightRequiredRuntimeAbi
      || productionHandlerBoundary?.dispatchPreflightRequiredRuntimeAbi
      || null,
    eshkolProductionDispatchPreflightRuntimeSmokeStubsAllowed: booleanOrNull(
      ingest.eshkolProductionDispatchPreflightRuntimeSmokeStubsAllowed
        ?? productionHandlerBoundary?.dispatchPreflightRuntimeSmokeStubsAllowed
    ),
    eshkolProductionDispatchPreflightRequiredCheckCount:
      Array.isArray(ingest.eshkolProductionDispatchPreflightRequiredChecks)
        ? ingest.eshkolProductionDispatchPreflightRequiredChecks.length
        : (
            Array.isArray(productionHandlerBoundary?.dispatchPreflightRequiredChecks)
              ? productionHandlerBoundary.dispatchPreflightRequiredChecks.length
              : null
          ),
    eshkolProductionDispatchPreflightRejectedRuntimeScopes: uniqueStrings(
      ingest.eshkolProductionDispatchPreflightRejectedRuntimeScopes
      || productionHandlerBoundary?.dispatchPreflightRejectedRuntimeScopes
      || []
    ),
    eshkolProductionDispatchPreflightBlockedBy: uniqueStrings(
      ingest.eshkolProductionDispatchPreflightBlockedBy
      || productionHandlerBoundary?.dispatchPreflightBlockedBy
      || []
    ),
    eshkolProductionHandlerBoundary: clonePlain(
      objectOrNull(ingest.eshkolProductionHandlerBoundary) || objectOrNull(productionHandlerBoundary)
    ),
    hostRuntimeProbeReady: booleanOrNull(ingest.hostRuntimeProbeReady ?? hostRuntimeProbe.ready),
    hostRuntimeProbeStatus: ingest.hostRuntimeProbeStatus || hostRuntimeProbe.status || null,
    hostRuntimeExecutionReady: booleanOrNull(ingest.hostRuntimeExecutionReady ?? hostRuntimeExecution.ready),
    hostRuntimeExecutionStatus: ingest.hostRuntimeExecutionStatus || hostRuntimeExecution.status || null,
    hostRuntimeExecutionInvoked: booleanOrNull(ingest.hostRuntimeExecutionInvoked ?? hostRuntimeExecution.entryInvoked),
    hostRuntimeExecutionMainInvoked: booleanOrNull(hostRuntimeExecution.mainInvoked),
    hostRuntimeExecutionResult: hostRuntimeExecution.entryResult ?? null,
    hostRuntimeExecutionScientificExecution: booleanOrNull(
      ingest.hostRuntimeExecutionScientificExecution ?? hostRuntimeExecution.scientificExecution
    ),
    outputSemanticsValidationReady: booleanOrNull(
      ingest.outputSemanticsValidationReady ?? outputSemanticsValidation.ready
    ),
    outputSemanticsValidationStatus: outputSemanticsValidation.status || null,
    outputSemanticsValidationBlockers: uniqueStrings(outputSemanticsValidation.blockers || []),
    outputSemanticsObservedStdoutSha256: observedOutput.stdoutSha256 || null,
    outputSemanticsObservedStdoutByteLength: finiteNumberOrNull(observedOutput.stdoutByteLength),
    tensorRuntimeCandidateReady: booleanOrNull(
      ingest.tensorRuntimeCandidateReady ?? tensorRuntimeCandidate.ready
    ),
    tensorRuntimeCandidateStatus:
      ingest.tensorRuntimeCandidateStatus || tensorRuntimeCandidate.status || null,
    tensorRuntimeCandidateExecutionClaim:
      ingest.tensorRuntimeCandidateExecutionClaim || tensorRuntimeCandidate.executionClaim || null,
    tensorRuntimeCandidateEntryInvoked: booleanOrNull(
      ingest.tensorRuntimeCandidateEntryInvoked ?? tensorRuntimeCandidate.entryInvoked
    ),
    tensorRuntimeCandidateChangedBytesInDeclaredTensorRange: finiteNumberOrNull(
      ingest.tensorRuntimeCandidateChangedBytesInDeclaredTensorRange
        ?? tensorRuntimeCandidate.changedBytesInDeclaredTensorRange
    ),
    tensorRuntimeCandidateExpectedChangedBytesInDeclaredTensorRange: finiteNumberOrNull(
      ingest.tensorRuntimeCandidateExpectedChangedBytesInDeclaredTensorRange
        ?? tensorRuntimeCandidate.expectedChangedBytesInDeclaredTensorRange
    ),
    tensorRuntimeCandidateOutputTensorsProducedByEntryExport: booleanOrNull(
      ingest.tensorRuntimeCandidateOutputTensorsProducedByEntryExport
        ?? tensorRuntimeCandidate.outputTensorsProducedByEntryExport
    ),
    tensorRuntimeCandidateOutputTensorsMatchExpected: booleanOrNull(
      ingest.tensorRuntimeCandidateOutputTensorsMatchExpected
        ?? tensorRuntimeCandidate.outputTensorsMatchExpected
    ),
    tensorRuntimeCandidateReadCallCount: finiteNumberOrNull(
      ingest.tensorRuntimeCandidateReadCallCount ?? tensorRuntimeCandidate.readCallCount
    ),
    tensorRuntimeCandidateWriteCallCount: finiteNumberOrNull(
      ingest.tensorRuntimeCandidateWriteCallCount ?? tensorRuntimeCandidate.writeCallCount
    ),
    tensorRuntimeCandidateEvidenceHash:
      ingest.tensorRuntimeCandidateEvidenceHash || tensorRuntimeCandidate.candidateEvidenceHash || null,
    tensorRuntimeCandidateScientificValidation: booleanOrNull(
      ingest.tensorRuntimeCandidateScientificValidation ?? tensorRuntimeCandidate.scientificValidation
    ),
    tensorRuntimeCandidateFullPhysicsValidation: booleanOrNull(
      ingest.tensorRuntimeCandidateFullPhysicsValidation ?? tensorRuntimeCandidate.fullPhysicsValidation
    ),
    tensorRuntimeCandidateProductionRuntimeExecution: booleanOrNull(
      ingest.tensorRuntimeCandidateProductionRuntimeExecution
        ?? tensorRuntimeCandidate.productionRuntimeExecution
    ),
    ingestSchema: ingest.schema || null,
    closureReady: booleanOrNull(ingest.closureReady),
    closureDescriptorReady: booleanOrNull(ingest.closureDescriptorReady),
    closureOutputSemanticsReady: booleanOrNull(ingest.closureOutputSemanticsReady),
    wasmByteLength: finiteNumberOrNull(ingest.wasmByteLength),
    wasmSha256: ingest.wasmSha256 || null,
    magnetarDipoleIsingReady: booleanOrNull(ingest.magnetarDipoleIsingReady),
    magnetarReferenceReady: booleanOrNull(ingest.magnetarReferenceReady),
    outputReferenceReadyCount: finiteNumberOrNull(ingest.outputReferenceReadyCount),
    outputReferenceCount: finiteNumberOrNull(ingest.outputReferenceCount),
    magnetarCalibratedReferenceReadyCount: finiteNumberOrNull(ingest.magnetarCalibratedReferenceReadyCount),
    magnetarCalibratedReferenceCount: finiteNumberOrNull(ingest.magnetarCalibratedReferenceCount),
    moonlabWebGpuParityScopeReady: booleanOrNull(ingest.moonlabWebGpuParityScopeReady),
    moonlabWebGpuParityScopeSchema: ingest.moonlabWebGpuParityScopeSchema || null,
    moonlabWebGpuParityScopeStatus: ingest.moonlabWebGpuParityScopeStatus || null,
    moonlabWebGpuParityScopeBackendAvailable:
      booleanOrNull(ingest.moonlabWebGpuParityScopeBackendAvailable),
    moonlabWebGpuParityScopeWebgpuParityExecuted:
      booleanOrNull(ingest.moonlabWebGpuParityScopeWebgpuParityExecuted),
    moonlabWebGpuParityScopeFullFidelityMagnetarSimulation:
      booleanOrNull(ingest.moonlabWebGpuParityScopeFullFidelityMagnetarSimulation),
    moonlabWebGpuParityScopeFullPhysicsValidation:
      booleanOrNull(ingest.moonlabWebGpuParityScopeFullPhysicsValidation)
  };
}

export function createUlgHandoffSupervisorServiceExecutor(options = {}) {
  const getSupervisor = typeof options.getSupervisor === 'function'
    ? options.getSupervisor
    : () => options.supervisor;
  const taskDefaults = clonePlain(options.taskDefaults || {});
  const taskFactory = typeof options.taskFactory === 'function' ? options.taskFactory : null;
  return async function executeUlgHandoffDispatch(context = {}) {
    const supervisor = getSupervisor();
    if (!supervisor || typeof supervisor.submitTask !== 'function') {
      throw new Error('ULG handoff supervisor service executor requires a WorkerSupervisor-like submitTask');
    }
    const dispatch = context.dispatch || {};
    const envelope = context.envelope || {};
    const artifactPayload = options.includeArtifactPayload === false
      ? null
      : createDispatchArtifactPayload(envelope, dispatch);
    const serviceTask = taskFactory
      ? taskFactory(context)
      : {
        ...taskDefaults,
        ...(clonePlain(dispatch.task || {})),
        serviceId: dispatch.serviceId,
        taskKind: dispatch.taskKind,
        taskId: dispatch.dispatchId,
        rootTaskId: dispatch.dispatchId,
        handoffId: envelope.handoffId || dispatch.handoffId || null,
        handoffEnvelope: {
          schema: envelope.schema || null,
          handoffId: envelope.handoffId || null,
          status: envelope.status || null
        },
        artifactPayload,
        dispatch: {
          schema: ULG_HANDOFF_SERVICE_DISPATCH_PLAN_SCHEMA,
          dispatchId: dispatch.dispatchId,
          serviceId: dispatch.serviceId,
          sourceService: dispatch.sourceService,
          artifactKind: dispatch.artifactKind,
          taskKind: dispatch.taskKind,
          artifactRefUri: dispatch.artifactRefUri || null,
          artifactContentHash: dispatch.artifactContentHash || null
        }
      };
    const serviceResult = await supervisor.submitTask(serviceTask);
    const serviceSummary = summarizeUlgHandoffSupervisorServiceResult(serviceResult);
    const serviceStatus = serviceResult?.serviceStatus || serviceResult?.adapterStatus || serviceResult?.status;
    const serviceReady = serviceResult?.ready === true
      || (serviceResult?.ready !== false && (
        serviceStatus === 'complete'
        || serviceStatus === 'accepted'
      ));
    return {
      schema: ULG_HANDOFF_SUPERVISOR_EXECUTOR_SCHEMA,
      dispatchId: dispatch.dispatchId,
      serviceId: dispatch.serviceId,
      sourceService: dispatch.sourceService,
      artifactKind: dispatch.artifactKind,
      taskKind: dispatch.taskKind,
      status: serviceReady ? 'accepted' : (serviceResult?.status || 'pending'),
      ready: serviceReady,
      blockers: uniqueStrings(serviceResult?.blockers || []),
      artifactRefUri: dispatch.artifactRefUri || null,
      artifactContentHash: dispatch.artifactContentHash || null,
      serviceSummary,
      serviceTask: clonePlain(serviceTask),
      serviceResult: clonePlain(serviceResult || null),
      serviceArtifactRef: clonePlain(serviceResult?.artifactRef || null)
    };
  };
}

function createDefaultManifest(options = {}) {
  const serviceId = options.serviceId || 'ulg-handoff-service';
  return {
    serviceId,
    version: options.version || '0.1.0',
    runtime: 'js',
    entry: {
      adapter: ULG_HANDOFF_SERVICE_ADAPTER_SCHEMA,
      workerModule: options.workerModule || '/peercompute/ulg-handoff-service-host.js'
    },
    childWorkers: {
      allowed: false,
      maxChildren: 0,
      allowedModules: [],
      sameOriginOnly: true
    },
    capabilities: [
      'ulg.handoff.normalize',
      'ulg.handoff.relay-envelope',
      'ulg.handoff.dispatch-plan',
      'ulg.handoff.dispatch-execute'
    ],
    taskKinds: [ULG_HANDOFF_SERVICE_TASK_SCHEMA, 'peercompute.ulg.handoff.service'],
    abi: {
      inputEnvelopeSchema: ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA,
      outputEnvelopeSchema: ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA
    },
    contract: {
      schema: ULG_HANDOFF_SERVICE_ADAPTER_SCHEMA,
      serviceId,
      inputSchemas: ['peercompute.ulg.demo-handoff.v0', ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA],
      outputSchemas: [
        ULG_HANDOFF_SERVICE_RESULT_SCHEMA,
        ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA,
        ULG_HANDOFF_SERVICE_DISPATCH_PLAN_SCHEMA,
        ULG_HANDOFF_SERVICE_DISPATCH_RESULT_SCHEMA,
        ULG_HANDOFF_SUPERVISOR_EXECUTOR_SCHEMA
      ],
      relaySafeArtifactsRequired: true,
      contentAddressedArtifactsRequired: true
    },
    validation: {
      requiresRelaySafeEnvelope: true,
      requiresContentAddressedArtifacts: true
    },
    metadata: {
      adapter: ULG_HANDOFF_SERVICE_ADAPTER_SCHEMA,
      domain: 'ulg-handoff',
      dispatchServices: clonePlain(options.dispatchServices || DEFAULT_DISPATCH_SERVICE_IDS)
    }
  };
}

export function createUlgHandoffServiceManifest(options = {}) {
  return createDefaultManifest(options);
}

export class UlgHandoffServiceHost {
  constructor(manifest = createUlgHandoffServiceManifest(), options = {}) {
    this.manifest = manifest;
    this.options = options;
    this.listeners = {
      message: new Set(),
      error: new Set()
    };
    this.workerId = null;
    this.closed = false;
  }

  addEventListener(type, listener) {
    this.listeners[type]?.add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners[type]?.delete(listener);
  }

  postMessage(message = {}) {
    if (this.closed && message.type !== 'init') return;
    if (message.type === 'init') {
      this.workerId = message.workerId;
      this.manifest = message.manifest || this.manifest;
      this.#emitMessage({
        type: 'ready',
        workerId: this.workerId,
        serviceId: this.manifest.serviceId
      });
      return;
    }
    if (message.type === 'submit-task') {
      scheduleMicrotask(() => this.#runTask(message.task || {}));
      return;
    }
    if (message.type === 'cancel-task') {
      this.#emitMessage({
        type: 'task-cancelled',
        rootTaskId: message.rootTaskId,
        result: {
          schema: ULG_HANDOFF_SERVICE_RESULT_SCHEMA,
          serviceId: this.manifest.serviceId,
          cancelled: true,
          reason: 'cancel-requested'
        }
      });
      return;
    }
    if (message.type === 'shutdown') {
      this.terminate();
    }
  }

  terminate() {
    this.closed = true;
  }

  async #runTask(task = {}) {
    const rootTaskId = normalizeRootTaskId(task);
    if (this.closed) return;
    this.#emitMessage({
      type: 'task-status',
      rootTaskId,
      status: 'running',
      progress: 0.2,
      children: []
    });

    try {
      const envelope = this.#createEnvelope(task);
      const dispatchPlan = this.#createDispatchPlan(task, envelope);
      const dispatchResult = await this.#createDispatchResult(task, envelope, dispatchPlan);
      const result = this.#createResult(task, envelope, rootTaskId, dispatchPlan, dispatchResult);
      this.#emitMessage({
        type: 'task-status',
        rootTaskId,
        status: 'complete',
        progress: 1,
        children: []
      });
      this.#emitMessage({
        type: 'task-result',
        rootTaskId,
        result
      });
    } catch (error) {
      this.#emitMessage({
        type: 'task-error',
        rootTaskId,
        error: error?.message || String(error)
      });
      this.#emitError(error);
    }
  }

  #createEnvelope(task = {}) {
    const source = task.serviceEnvelope
      || task.handoffEnvelope
      || task.envelope
      || task.handoff
      || task.payload;
    if (!source || typeof source !== 'object') {
      throw new Error('ULG handoff service task requires handoff or serviceEnvelope');
    }
    return createUlgHandoffServiceEnvelope(source, {
      ...this.options,
      ...(task.options || {}),
      receivedAt: task.receivedAt || task.options?.receivedAt || this.options.receivedAt
    });
  }

  #createDispatchPlan(task = {}, envelope = {}) {
    return createUlgHandoffServiceDispatchPlan(envelope, {
      ...this.options,
      ...(task.options || {}),
      serviceIds: task.serviceIds
        || task.serviceIdBySource
        || task.options?.serviceIds
        || task.options?.serviceIdBySource
        || this.options.serviceIds
        || this.options.serviceIdBySource
    });
  }

  async #createDispatchResult(task = {}, envelope = {}, dispatchPlan = {}) {
    const shouldExecute = task.executeServices === true
      || task.options?.executeServices === true
      || this.options.executeServices === true;
    if (!shouldExecute) {
      return createNotExecutedDispatchResult(dispatchPlan);
    }
    if (dispatchPlan.ready !== true) {
      return {
        schema: ULG_HANDOFF_SERVICE_DISPATCH_RESULT_SCHEMA,
        handoffId: dispatchPlan.handoffId || envelope.handoffId || null,
        planSchema: dispatchPlan.schema || null,
        status: 'blocked',
        executed: false,
        ready: false,
        dispatchCount: dispatchPlan.dispatchCount || 0,
        executedDispatchCount: 0,
        acceptedDispatchCount: 0,
        failedDispatchCount: 0,
        blockedDispatchCount: dispatchPlan.blockedDispatchCount || 0,
        results: [],
        blockers: clonePlain(dispatchPlan.blockers || [])
      };
    }
    const executor = task.serviceExecutor || task.options?.serviceExecutor || this.options.serviceExecutor;
    if (typeof executor !== 'function') {
      return {
        schema: ULG_HANDOFF_SERVICE_DISPATCH_RESULT_SCHEMA,
        handoffId: dispatchPlan.handoffId || envelope.handoffId || null,
        planSchema: dispatchPlan.schema || null,
        status: 'blocked',
        executed: false,
        ready: false,
        dispatchCount: dispatchPlan.dispatchCount || 0,
        executedDispatchCount: 0,
        acceptedDispatchCount: 0,
        failedDispatchCount: 0,
        blockedDispatchCount: dispatchPlan.blockedDispatchCount || 0,
        results: [],
        blockers: ['ulg-handoff-service-executor-missing']
      };
    }
    const results = [];
    for (const dispatch of dispatchPlan.dispatches || []) {
      try {
        const output = await executor({
          dispatch: clonePlain(dispatch),
          dispatchPlan: clonePlain(dispatchPlan),
          envelope: clonePlain(envelope),
          manifest: clonePlain(this.manifest),
          task: clonePlain(task)
        });
        results.push(normalizeDispatchOutput(output, dispatch));
      } catch (error) {
        results.push({
          dispatchId: dispatch.dispatchId,
          serviceId: dispatch.serviceId,
          sourceService: dispatch.sourceService,
          artifactKind: dispatch.artifactKind,
          taskKind: dispatch.taskKind,
          status: 'error',
          ready: false,
          blockers: ['ulg-dispatch-executor-error'],
          error: error?.message || String(error)
        });
      }
    }
    const failedDispatchCount = results.filter((entry) => entry.ready !== true).length;
    const acceptedDispatchCount = results.filter((entry) => entry.ready === true).length;
    const blockers = uniqueStrings(results.flatMap((entry) => [
      ...(Array.isArray(entry.blockers) ? entry.blockers : []),
      entry.error ? `ulg-dispatch-executor-error:${entry.dispatchId}` : null
    ]));
    const ready = failedDispatchCount === 0
      && acceptedDispatchCount === dispatchPlan.readyDispatchCount
      && blockers.length === 0;
    return {
      schema: ULG_HANDOFF_SERVICE_DISPATCH_RESULT_SCHEMA,
      handoffId: dispatchPlan.handoffId || envelope.handoffId || null,
      planSchema: dispatchPlan.schema || null,
      status: ready ? 'executed' : 'partial',
      executed: true,
      ready,
      dispatchCount: dispatchPlan.dispatchCount || 0,
      executedDispatchCount: results.length,
      acceptedDispatchCount,
      failedDispatchCount,
      blockedDispatchCount: 0,
      results,
      blockers
    };
  }

  #createResult(task = {}, envelope = {}, rootTaskId, dispatchPlan = {}, dispatchResult = {}) {
    const taskKind = task.taskKind || task.kind || ULG_HANDOFF_SERVICE_TASK_SCHEMA;
    const dispatchBlocked = dispatchResult?.status === 'blocked' || dispatchResult?.status === 'partial';
    const blockers = uniqueStrings([
      ...(Array.isArray(envelope.blockers) ? envelope.blockers : []),
      ...(Array.isArray(dispatchPlan.blockers) ? dispatchPlan.blockers : []),
      ...(Array.isArray(dispatchResult.blockers) ? dispatchResult.blockers : [])
    ]);
    const artifact = {
      schema: ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA,
      artifactKind: 'ulg-handoff-service-envelope',
      sourceService: this.manifest.serviceId,
      contentHash: envelope.handoffId,
      handoffId: envelope.handoffId,
      ready: envelope.ready === true,
      status: envelope.status,
      blockers,
      envelope: clonePlain(envelope),
      dispatchPlan: clonePlain(dispatchPlan),
      dispatchResult: clonePlain(dispatchResult),
      provenance: clonePlain(envelope.provenance || null)
    };
    return {
      schema: ULG_HANDOFF_SERVICE_RESULT_SCHEMA,
      adapterSchema: ULG_HANDOFF_SERVICE_ADAPTER_SCHEMA,
      serviceId: this.manifest.serviceId,
      taskKind,
      taskId: task.taskId || rootTaskId,
      rootTaskId,
      status: envelope.ready && !dispatchBlocked ? 'complete' : 'pending',
      ready: envelope.ready === true && !dispatchBlocked,
      blockerCount: blockers.length,
      envelope,
      dispatchPlan,
      dispatchResult,
      artifact
    };
  }

  #emitMessage(data) {
    for (const listener of this.listeners.message) {
      listener({ data });
    }
  }

  #emitError(error) {
    for (const listener of this.listeners.error) {
      listener(error);
    }
  }
}
