import {
  ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA
} from './UlgHandoffServiceHost.js';

export const ULG_DISPATCH_SERVICE_ADAPTER_SCHEMA = 'peercompute.ulg.dispatch-service-adapter.v0';
export const ULG_DISPATCH_SERVICE_RESULT_SCHEMA = 'peercompute.ulg.dispatch-service-result.v0';
export const ULG_DISPATCH_SERVICE_TELEMETRY_SCHEMA = 'peercompute.ulg.dispatch-service-telemetry.v0';
export const ULG_DISPATCH_SERVICE_ARTIFACT_SCHEMA = 'peercompute.ulg.dispatch-service-artifact.v0';

const DEFAULT_ADAPTERS = Object.freeze({
  moonlab: {
    sourceService: 'moonlab',
    serviceId: 'moonlab-ulg-fixture',
    workerModule: '/peercompute/ulg/moonlab-dispatch-service-host.js',
    childWorkerModule: '/peercompute/ulg/moonlab-core-dispatch.worker.js',
    taskKinds: ['moonlab.ulg.quantum-response.ingest'],
    capabilities: ['ulg.dispatch.moonlab.ingest', 'ulg.quantum-response.ingest'],
    acceptedArtifactKinds: ['quantum-response']
  },
  eshkol: {
    sourceService: 'eshkol',
    serviceId: 'eshkol-ulg-fixture',
    workerModule: '/peercompute/ulg/eshkol-dispatch-service-host.js',
    childWorkerModule: '/peercompute/ulg/eshkol-closure-dispatch.worker.js',
    taskKinds: ['eshkol.ulg.closure-artifact.ingest', 'eshkol.ulg.closure.descriptor-bind'],
    capabilities: ['ulg.dispatch.eshkol.ingest', 'ulg.closure-artifact.ingest'],
    acceptedArtifactKinds: ['closure']
  }
});

function clonePlain(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

function stringOrNull(value) {
  if (value == null) return null;
  const text = String(value).trim();
  return text || null;
}

function uniqueStrings(values = []) {
  return [...new Set(values.map((value) => stringOrNull(value)).filter(Boolean))];
}

function createArtifactContentHash(payload = {}, task = {}, serviceId = 'ulg-dispatch-service') {
  return payload.artifactContentHash
    || payload.artifactRefUri
    || `${serviceId}:${payload.dispatchId || task.taskId || 'dispatch-artifact'}`;
}

function finiteNumberOrNull(value) {
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function normalizeWasmBytes(value) {
  if (!value) return null;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength));
  }
  if (Array.isArray(value)) return new Uint8Array(value);
  if (value?.type === 'Buffer' && Array.isArray(value.data)) return new Uint8Array(value.data);
  return null;
}

function wasmEntriesByKind(entries = []) {
  return entries.reduce((counts, entry) => {
    const kind = entry?.kind || 'unknown';
    counts[kind] = (counts[kind] || 0) + 1;
    return counts;
  }, {});
}

function countReadyReferences(references = []) {
  return Array.isArray(references)
    ? references.filter((entry) => entry?.ready === true).length
    : 0;
}

function objectOrNull(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
}

function idsFromDescriptors(entries = []) {
  return Array.isArray(entries)
    ? entries.map((entry) => stringOrNull(entry?.id)).filter(Boolean)
    : [];
}

function arraysEqual(left = [], right = []) {
  return Array.isArray(left)
    && Array.isArray(right)
    && left.length === right.length
    && left.every((value, index) => value === right[index]);
}

function wasmImportKey(entry = {}) {
  return `${entry.module || ''}:${entry.name || ''}:${entry.kind || ''}`;
}

function wasmExportKey(entry = {}) {
  return `${entry.name || ''}:${entry.kind || ''}`;
}

function wasmMetadataMatches(observed = [], declared = [], keyFn) {
  if (!Array.isArray(declared) || declared.length === 0) return null;
  const observedKeys = new Set(observed.map(keyFn));
  const declaredKeys = declared.map(keyFn);
  return observed.length === declared.length && declaredKeys.every((key) => observedKeys.has(key));
}

function declaredCount(summaryValue, declaredEntries = []) {
  const summaryCount = finiteNumberOrNull(summaryValue);
  if (summaryCount != null) return summaryCount;
  return Array.isArray(declaredEntries) && declaredEntries.length > 0 ? declaredEntries.length : null;
}

function adapterConfig(sourceService, options = {}) {
  const key = String(sourceService || '').trim().toLowerCase();
  const defaults = DEFAULT_ADAPTERS[key];
  if (!defaults) {
    throw new Error(`Unsupported ULG dispatch adapter sourceService: ${sourceService}`);
  }
  const serviceIds = options.serviceIds || {};
  return {
    ...defaults,
    ...clonePlain(options),
    sourceService: defaults.sourceService,
    serviceId: options.serviceId || serviceIds[key] || defaults.serviceId,
    taskKinds: [...(options.taskKinds || defaults.taskKinds)],
    capabilities: [...(options.capabilities || defaults.capabilities)],
    acceptedArtifactKinds: [...(options.acceptedArtifactKinds || defaults.acceptedArtifactKinds)]
  };
}

function createManifestForSource(sourceService, options = {}) {
  const config = adapterConfig(sourceService, options);
  const childWorkerModule = options.childWorkerModule || config.childWorkerModule;
  const allowedModules = uniqueStrings([
    childWorkerModule,
    ...(options.childWorkers?.allowedModules || [])
  ]);
  const childWorkers = {
    allowed: options.childWorkers?.allowed ?? true,
    maxChildren: options.childWorkers?.maxChildren ?? 1,
    allowedModules,
    sameOriginOnly: options.childWorkers?.sameOriginOnly ?? true
  };
  return {
    serviceId: config.serviceId,
    version: options.version || '0.1.0',
    runtime: options.runtime || 'js',
    entry: {
      adapter: ULG_DISPATCH_SERVICE_ADAPTER_SCHEMA,
      workerModule: options.workerModule || config.workerModule
    },
    childWorkers,
    resources: clonePlain(options.resources || {}),
    capabilities: config.capabilities,
    taskKinds: config.taskKinds,
    abi: {
      inputEnvelopeSchema: ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA,
      outputEnvelopeSchema: ULG_DISPATCH_SERVICE_RESULT_SCHEMA,
      artifactSchema: ULG_DISPATCH_SERVICE_ARTIFACT_SCHEMA,
      ...(clonePlain(options.abi || {}))
    },
    contract: {
      schema: ULG_DISPATCH_SERVICE_ADAPTER_SCHEMA,
      serviceId: config.serviceId,
      sourceService: config.sourceService,
      inputSchemas: [ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA],
      outputSchemas: [ULG_DISPATCH_SERVICE_RESULT_SCHEMA, ULG_DISPATCH_SERVICE_ARTIFACT_SCHEMA],
      acceptedArtifactKinds: config.acceptedArtifactKinds,
      relaySafeArtifactsRequired: true,
      contentAddressedArtifactsRequired: true
    },
    validation: {
      requiresArtifactPayload: true,
      requiresArtifactRef: true,
      requiresContentHash: true,
      ...(clonePlain(options.validation || {}))
    },
    metadata: {
      ...(clonePlain(options.metadata || {})),
      domain: config.sourceService,
      dispatchAdapter: true,
      fixture: false,
      acceptedArtifactKinds: config.acceptedArtifactKinds
    }
  };
}

export function createUlgMoonLabDispatchServiceManifest(options = {}) {
  return createManifestForSource('moonlab', options);
}

export function createUlgEshkolDispatchServiceManifest(options = {}) {
  return createManifestForSource('eshkol', options);
}

export function createUlgDispatchServiceManifests(options = {}) {
  const workerModules = options.workerModules || {};
  const childWorkerModules = options.childWorkerModules || {};
  return [
    createUlgMoonLabDispatchServiceManifest({
      ...options,
      serviceId: options.serviceIds?.moonlab || options.moonlabServiceId || options.serviceId,
      workerModule: workerModules.moonlab || options.moonlabWorkerModule || options.workerModule,
      childWorkerModule: childWorkerModules.moonlab || options.moonlabChildWorkerModule || options.childWorkerModule
    }),
    createUlgEshkolDispatchServiceManifest({
      ...options,
      serviceId: options.serviceIds?.eshkol || options.eshkolServiceId || options.serviceId,
      workerModule: workerModules.eshkol || options.eshkolWorkerModule || options.workerModule,
      childWorkerModule: childWorkerModules.eshkol || options.eshkolChildWorkerModule || options.childWorkerModule
    })
  ];
}

function normalizeExpectedSource(manifest = {}) {
  return stringOrNull(manifest.metadata?.domain)
    || (String(manifest.serviceId || '').includes('eshkol') ? 'eshkol' : null)
    || (String(manifest.serviceId || '').includes('moonlab') ? 'moonlab' : null);
}

function acceptedArtifactKinds(manifest = {}) {
  return Array.isArray(manifest.metadata?.acceptedArtifactKinds)
    ? manifest.metadata.acceptedArtifactKinds
    : [];
}

function validateDispatchPayload(task = {}, manifest = {}) {
  const payload = task.artifactPayload;
  const expectedSource = normalizeExpectedSource(manifest);
  const acceptedKinds = acceptedArtifactKinds(manifest);
  const blockers = [];
  if (!payload || typeof payload !== 'object') {
    blockers.push('ulg-dispatch-artifact-payload-missing');
    return { payload: null, blockers, ready: false, expectedSource, acceptedKinds };
  }
  if (payload.schema !== ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA) {
    blockers.push('ulg-dispatch-artifact-payload-schema-mismatch');
  }
  if (expectedSource && payload.sourceService !== expectedSource) {
    blockers.push('ulg-dispatch-artifact-source-mismatch');
  }
  if (acceptedKinds.length > 0 && !acceptedKinds.includes(payload.artifactKind)) {
    blockers.push('ulg-dispatch-artifact-kind-mismatch');
  }
  if (!payload.artifactRefUri) {
    blockers.push('ulg-dispatch-artifact-ref-uri-missing');
  }
  if (!payload.artifactContentHash) {
    blockers.push('ulg-dispatch-artifact-content-hash-missing');
  }
  if (payload.sourceService === 'moonlab' && payload.artifactKind === 'quantum-response') {
    if (payload.artifactSummary?.magnetarDipoleIsingReady !== true) {
      blockers.push('moonlab-quantum-response-calibration-not-ready');
    }
  }
  if (payload.sourceService === 'eshkol' && payload.artifactKind === 'closure') {
    const summary = payload.artifactSummary || {};
    const closureReady = summary.closureReady === true || summary.closureDescriptorReady === true;
    if (!closureReady) {
      blockers.push('eshkol-closure-summary-not-ready');
    }
    const needsWasmBytes = task.taskKind === 'eshkol.ulg.closure-artifact.ingest'
      || payload.hasTransferredWasmBytes === true;
    if (needsWasmBytes && !(payload.wasmByteLength > 0)) {
      blockers.push('eshkol-closure-wasm-bytes-missing');
    }
  }
  return {
    payload,
    blockers: uniqueStrings(blockers),
    ready: blockers.length === 0,
    expectedSource,
    acceptedKinds
  };
}

async function createMoonLabDispatchProbe(payload = {}) {
  const artifact = payload.artifact || {};
  const summary = payload.artifactSummary || {};
  const outputReferences = Array.isArray(artifact.outputs?.references)
    ? artifact.outputs.references
    : [];
  const outputReferenceReadyCount = countReadyReferences(outputReferences);
  const calibration = artifact.calibrationArtifacts?.magnetarDipoleIsing || null;
  const blockers = uniqueStrings([
    summary.magnetarDipoleIsingReady === true
      ? null
      : 'moonlab-magnetar-dipole-ising-not-ready'
  ]);
  return {
    schema: 'peercompute.ulg.moonlab-dispatch-payload-probe.v0',
    status: blockers.length === 0 ? 'pass' : 'blocked',
    ready: blockers.length === 0,
    blockers,
    responseDescriptorSchema: artifact.responseDescriptor?.schema || summary.responseDescriptorSchema || null,
    paritySchema: artifact.parity?.schema || summary.paritySchema || null,
    parityStatus: artifact.parity?.status || summary.parityStatus || null,
    calibrationSchema: calibration?.schema || null,
    calibrationStatus: calibration?.validation?.status || summary.magnetarDipoleIsingStatus || null,
    outputReferenceCount: summary.outputReferenceCount ?? outputReferences.length,
    outputReferenceReadyCount: summary.outputReferenceReadyCount ?? outputReferenceReadyCount,
    magnetarCalibratedReferenceCount: summary.magnetarCalibratedReferenceCount ?? null,
    magnetarCalibratedReferenceReadyCount: summary.magnetarCalibratedReferenceReadyCount ?? null,
    magnetarCalibratedReferenceScientificCoverageCount:
      summary.magnetarCalibratedReferenceScientificCoverageCount ?? null
  };
}

function createEshkolDescriptorContractProbe(payload = {}, moduleProbe = {}) {
  const summary = payload.artifactSummary || {};
  const artifact = payload.artifact || {};
  const descriptor = objectOrNull(artifact.validation?.closureDescriptor);
  const blockers = [];
  const summaryReady = summary.closureDescriptorReady === true;

  if (!descriptor) {
    return {
      schema: 'peercompute.ulg.eshkol-descriptor-contract-probe.v0',
      status: summaryReady ? 'summary-only-ready' : 'descriptor-not-present',
      ready: summaryReady,
      blockers: [],
      descriptorPresent: false,
      closureDescriptorReady: summaryReady,
      closureDescriptorSchema: summary.closureDescriptorSchema || null,
      scientificExecution: false,
      scientificValidation: false
    };
  }

  const binding = objectOrNull(descriptor.descriptorBinding);
  const tensorContract = objectOrNull(descriptor.tensorContract);
  const handoffEnvelope = objectOrNull(binding?.handoffEnvelope);
  const interpolationTable = objectOrNull(binding?.ulgInterpolationTable);
  const moonlabSuite = objectOrNull(binding?.moonlabNormalizedReferenceSuite);
  const productTopologyBinding = objectOrNull(binding?.peercomputeProductTopologyBinding);
  const runtimeBinding = objectOrNull(binding?.runtimeBinding);
  const artifactInputIds = idsFromDescriptors(artifact.inputs);
  const artifactOutputIds = idsFromDescriptors(artifact.outputs);
  const tensorInputIds = Array.isArray(tensorContract?.inputIds) ? [...tensorContract.inputIds] : [];
  const tensorOutputIds = Array.isArray(tensorContract?.outputIds) ? [...tensorContract.outputIds] : [];
  const tableInputIds = Array.isArray(interpolationTable?.inputTensorIds) ? [...interpolationTable.inputTensorIds] : [];
  const tableOutputIds = Array.isArray(interpolationTable?.outputTensorIds) ? [...interpolationTable.outputTensorIds] : [];
  const productInputIds = Array.isArray(productTopologyBinding?.inputTensorIds) ? [...productTopologyBinding.inputTensorIds] : [];
  const productOutputIds = Array.isArray(productTopologyBinding?.outputTensorIds) ? [...productTopologyBinding.outputTensorIds] : [];
  const descriptorEntryExport = descriptor.entryExport || null;
  const moduleEntryExport = moduleProbe.entryExport || summary.closureEntryExport || artifact.execution?.entryExport || null;
  const tensorContractMatches = arraysEqual(artifactInputIds, tensorInputIds)
    && arraysEqual(artifactOutputIds, tensorOutputIds);
  const interpolationTableMatches = arraysEqual(tableInputIds, tensorInputIds)
    && arraysEqual(tableOutputIds, tensorOutputIds)
    && (!interpolationTable?.coordinateSystem || interpolationTable.coordinateSystem === tensorContract?.coordinateSystem);
  const productTopologyMatches = arraysEqual(productInputIds, tensorInputIds)
    && arraysEqual(productOutputIds, tensorOutputIds);
  const entryExportMatches = !descriptorEntryExport
    || !moduleEntryExport
    || descriptorEntryExport === moduleEntryExport;
  const moduleEntryExportAvailable = moduleProbe.hasEntryExport == null
    ? null
    : moduleProbe.hasEntryExport === true;
  const referenceIds = Array.isArray(moonlabSuite?.referenceIds) ? [...moonlabSuite.referenceIds] : [];
  const sampleIds = Array.isArray(binding?.moonlabClosureSurfaceSampleIds) ? [...binding.moonlabClosureSurfaceSampleIds] : [];

  if (summary.closureDescriptorSchema && descriptor.schema !== summary.closureDescriptorSchema) {
    blockers.push('eshkol-descriptor-schema-summary-mismatch');
  }
  if (descriptor.scientificValidation !== false) {
    blockers.push('eshkol-descriptor-scientific-validation-overstated');
  }
  if (!tensorContractMatches) {
    blockers.push('eshkol-descriptor-tensor-contract-mismatch');
  }
  if (binding) {
    if (handoffEnvelope?.schema !== 'peercompute.ulg.handoff-service-envelope.v0') {
      blockers.push('eshkol-descriptor-handoff-envelope-schema-mismatch');
    }
    if (handoffEnvelope?.artifactKind !== 'closure' || handoffEnvelope?.sourceService !== 'eshkol') {
      blockers.push('eshkol-descriptor-handoff-artifact-binding-mismatch');
    }
    if (handoffEnvelope?.contentAddressing !== 'required') {
      blockers.push('eshkol-descriptor-content-addressing-not-required');
    }
    if (handoffEnvelope?.relaySafeTransfer !== 'required') {
      blockers.push('eshkol-descriptor-relay-safe-transfer-not-required');
    }
    if (!interpolationTableMatches) {
      blockers.push('eshkol-descriptor-interpolation-table-mismatch');
    }
    if (interpolationTable?.status && interpolationTable.status !== 'declared-not-computed') {
      blockers.push('eshkol-descriptor-interpolation-table-overstates-computation');
    }
    if (moonlabSuite?.ready !== true) {
      blockers.push('eshkol-descriptor-moonlab-suite-not-ready');
    }
    if (moonlabSuite?.contentHash && !String(moonlabSuite.contentHash).startsWith('sha256:')) {
      blockers.push('eshkol-descriptor-moonlab-suite-hash-invalid');
    }
    if (!productTopologyMatches) {
      blockers.push('eshkol-descriptor-product-topology-mismatch');
    }
    if (productTopologyBinding?.status && productTopologyBinding.status !== 'descriptor-bound-not-executed') {
      blockers.push('eshkol-descriptor-product-topology-overstates-execution');
    }
    if (productTopologyBinding?.scientificValidation !== false) {
      blockers.push('eshkol-descriptor-product-topology-scientific-validation-overstated');
    }
    if (runtimeBinding?.runtimeStatus && runtimeBinding.runtimeStatus !== 'declared-not-executed') {
      blockers.push('eshkol-descriptor-runtime-overstates-execution');
    }
    if (runtimeBinding?.derivativeStatus && runtimeBinding.derivativeStatus !== 'declared-not-computed') {
      blockers.push('eshkol-descriptor-runtime-overstates-derivative-computation');
    }
    if (runtimeBinding?.scientificValidation !== false) {
      blockers.push('eshkol-descriptor-runtime-scientific-validation-overstated');
    }
  }
  if (!entryExportMatches) {
    blockers.push('eshkol-descriptor-entry-export-mismatch');
  }
  if (moduleEntryExportAvailable === false) {
    blockers.push('eshkol-descriptor-entry-export-missing');
  }

  return {
    schema: 'peercompute.ulg.eshkol-descriptor-contract-probe.v0',
    status: blockers.length === 0 ? 'descriptor-contract-ready' : 'descriptor-contract-blocked',
    ready: blockers.length === 0,
    blockers: uniqueStrings(blockers),
    descriptorPresent: true,
    closureDescriptorReady: summaryReady,
    closureDescriptorSchema: descriptor.schema || null,
    descriptorRole: descriptor.descriptorRole || null,
    descriptorEntryExport,
    moduleEntryExport,
    entryExportMatches,
    moduleEntryExportAvailable,
    scientificExecution: false,
    scientificValidation: descriptor.scientificValidation === true,
    tensorContract: {
      inputIds: tensorInputIds,
      outputIds: tensorOutputIds,
      coordinateSystem: tensorContract?.coordinateSystem || null,
      interpolation: tensorContract?.interpolation || null,
      artifactInputIds,
      artifactOutputIds,
      matchesArtifactDescriptors: tensorContractMatches
    },
    descriptorBinding: binding ? {
      schema: binding.schema || null,
      bindingId: binding.bindingId || null,
      handoffEnvelopeSchema: handoffEnvelope?.schema || null,
      handoffArtifactKind: handoffEnvelope?.artifactKind || null,
      handoffSourceService: handoffEnvelope?.sourceService || null,
      contentAddressing: handoffEnvelope?.contentAddressing || null,
      relaySafeTransfer: handoffEnvelope?.relaySafeTransfer || null
    } : null,
    interpolationTable: interpolationTable ? {
      id: interpolationTable.id || null,
      status: interpolationTable.status || null,
      coordinateSystem: interpolationTable.coordinateSystem || null,
      inputTensorIds: tableInputIds,
      outputTensorIds: tableOutputIds,
      matchesTensorContract: interpolationTableMatches
    } : null,
    moonlabNormalizedReferenceSuite: moonlabSuite ? {
      schema: moonlabSuite.schema || null,
      assetId: moonlabSuite.assetId || null,
      contentHash: moonlabSuite.contentHash || null,
      status: moonlabSuite.status || null,
      ready: moonlabSuite.ready === true,
      referenceCount: referenceIds.length,
      referenceFamilyCount: Array.isArray(moonlabSuite.referenceFamilies)
        ? moonlabSuite.referenceFamilies.length
        : 0,
      closureSurfaceSampleCount: sampleIds.length
    } : null,
    productTopologyBinding: productTopologyBinding ? {
      schema: productTopologyBinding.schema || null,
      bindingId: productTopologyBinding.bindingId || null,
      topologyId: productTopologyBinding.topologyId || null,
      status: productTopologyBinding.status || null,
      scientificValidation: productTopologyBinding.scientificValidation === true,
      inputTensorIds: productInputIds,
      outputTensorIds: productOutputIds,
      matchesTensorContract: productTopologyMatches
    } : null,
    runtimeBinding: runtimeBinding ? {
      schema: runtimeBinding.schema || null,
      runtimeStatus: runtimeBinding.runtimeStatus || null,
      derivativeStatus: runtimeBinding.derivativeStatus || null,
      scientificValidation: runtimeBinding.scientificValidation === true
    } : null
  };
}

async function createEshkolDispatchProbe(payload = {}, task = {}) {
  const bytes = normalizeWasmBytes(payload.wasmBytes);
  const declaredLength = finiteNumberOrNull(payload.wasmByteLength);
  const summary = payload.artifactSummary || {};
  const artifact = payload.artifact || {};
  const declaredImports = Array.isArray(artifact.execution?.imports) ? artifact.execution.imports : [];
  const declaredExports = Array.isArray(artifact.execution?.exports) ? artifact.execution.exports : [];
  const declaredEntryExport = summary.closureEntryExport || artifact.execution?.entryExport || null;
  const descriptorProbeBase = {
    entryExport: declaredEntryExport,
    hasEntryExport: null
  };
  const descriptorProbe = createEshkolDescriptorContractProbe(payload, descriptorProbeBase);
  const blockers = [];
  blockers.push(...(descriptorProbe.blockers || []));
  const descriptorOnlyTask = task.taskKind === 'eshkol.ulg.closure.descriptor-bind'
    || (summary.closureDescriptorReady === true && payload.hasTransferredWasmBytes !== true);
  if (!bytes || bytes.byteLength === 0) {
    if (descriptorOnlyTask) {
      const descriptorBlockers = uniqueStrings(descriptorProbe.blockers || []);
      return {
        schema: 'peercompute.ulg.eshkol-dispatch-wasm-probe.v0',
        status: descriptorBlockers.length === 0 ? 'descriptor-contract-ready' : 'blocked',
        ready: descriptorBlockers.length === 0,
        blockers: descriptorBlockers,
        wasmByteLength: declaredLength,
        moduleCompiled: false,
        probeMode: 'descriptor-contract-metadata-only',
        descriptorProbe
      };
    }
    blockers.push('eshkol-wasm-bytes-missing');
    return {
      schema: 'peercompute.ulg.eshkol-dispatch-wasm-probe.v0',
      status: 'blocked',
      ready: false,
      blockers: uniqueStrings(blockers),
      wasmByteLength: declaredLength,
      moduleCompiled: false,
      probeMode: 'wasm-module-compile',
      descriptorProbe
    };
  }
  if (declaredLength != null && declaredLength !== bytes.byteLength) {
    blockers.push('eshkol-wasm-byte-length-mismatch');
  }
  if (bytes.byteLength < 8) {
    return {
      schema: 'peercompute.ulg.eshkol-dispatch-wasm-probe.v0',
      status: blockers.length === 0 ? 'skipped-short-wasm-header' : 'blocked',
      ready: blockers.length === 0,
      blockers: uniqueStrings(blockers),
      wasmByteLength: bytes.byteLength,
      declaredWasmByteLength: declaredLength,
      moduleCompiled: false,
      probeMode: 'wasm-module-compile',
      descriptorProbe,
      notes: ['WASM bytes contain a magic-header fixture but not a complete module.']
    };
  }

  let imports = [];
  let exports = [];
  try {
    const module = await WebAssembly.compile(bytes);
    imports = WebAssembly.Module.imports(module);
    exports = WebAssembly.Module.exports(module);
  } catch (error) {
    blockers.push('eshkol-wasm-module-compile-failed');
    return {
      schema: 'peercompute.ulg.eshkol-dispatch-wasm-probe.v0',
      status: 'blocked',
      ready: false,
      blockers: uniqueStrings(blockers),
      error: error?.message || String(error),
      wasmByteLength: bytes.byteLength,
      declaredWasmByteLength: declaredLength,
      moduleCompiled: false,
      probeMode: 'wasm-module-compile',
      descriptorProbe
    };
  }

  const entryExport = declaredEntryExport || 'main';
  const hasEntryExport = exports.some((entry) => entry.name === entryExport);
  const importMetadataMatches = wasmMetadataMatches(imports, declaredImports, wasmImportKey);
  const exportMetadataMatches = wasmMetadataMatches(exports, declaredExports, wasmExportKey);
  const expectedImportCount = declaredCount(summary.closureImportCount, declaredImports);
  const expectedExportCount = declaredCount(summary.closureExportCount, declaredExports);
  if (expectedImportCount != null && expectedImportCount !== imports.length) {
    blockers.push('eshkol-wasm-import-count-mismatch');
  }
  if (expectedExportCount != null && expectedExportCount !== exports.length) {
    blockers.push('eshkol-wasm-export-count-mismatch');
  }
  if (importMetadataMatches === false) {
    blockers.push('eshkol-wasm-import-metadata-mismatch');
  }
  if (exportMetadataMatches === false) {
    blockers.push('eshkol-wasm-export-metadata-mismatch');
  }
  if (!hasEntryExport) {
    blockers.push('eshkol-wasm-entry-export-missing');
  }
  const compiledDescriptorProbe = createEshkolDescriptorContractProbe(payload, {
    entryExport,
    hasEntryExport
  });
  blockers.push(...(compiledDescriptorProbe.blockers || []));
  const uniqueBlockers = uniqueStrings(blockers);

  return {
    schema: 'peercompute.ulg.eshkol-dispatch-wasm-probe.v0',
    status: uniqueBlockers.length === 0 ? 'pass' : 'blocked',
    ready: uniqueBlockers.length === 0,
    blockers: uniqueBlockers,
    wasmByteLength: bytes.byteLength,
    declaredWasmByteLength: declaredLength,
    wasmSha256: payload.wasmSha256 || null,
    moduleCompiled: true,
    probeMode: 'wasm-module-compile',
    importCount: imports.length,
    exportCount: exports.length,
    importKinds: wasmEntriesByKind(imports),
    exportKinds: wasmEntriesByKind(exports),
    declaredImportCount: expectedImportCount,
    declaredExportCount: expectedExportCount,
    importMetadataMatches,
    exportMetadataMatches,
    entryExport,
    hasEntryExport,
    serviceWorkerSafe: summary.closureServiceWorkerSafe === true || artifact.execution?.serviceWorkerSafe === true,
    requiresDynamicCode: summary.closureRequiresDynamicCode ?? artifact.validity?.requiresDynamicCode ?? null,
    descriptorProbe: compiledDescriptorProbe
  };
}

async function createDispatchAdapterProbe(payload = {}, task = {}) {
  if (payload.sourceService === 'moonlab') return createMoonLabDispatchProbe(payload);
  if (payload.sourceService === 'eshkol') return createEshkolDispatchProbe(payload, task);
  return {
    schema: 'peercompute.ulg.dispatch-payload-probe.v0',
    status: 'pass',
    ready: true,
    blockers: []
  };
}

function createMoonLabIngestSummary(payload = {}, probe = null) {
  const summary = payload.artifactSummary || {};
  const artifact = payload.artifact || {};
  const outputReferences = Array.isArray(artifact.outputs?.references)
    ? artifact.outputs.references
    : [];
  return {
    schema: 'peercompute.ulg.moonlab-dispatch-ingest.v0',
    magnetarDipoleIsingReady: summary.magnetarDipoleIsingReady === true,
    magnetarDipoleIsingStatus: summary.magnetarDipoleIsingStatus || null,
    magnetarReferenceReady: summary.magnetarReferenceReady === true,
    outputReferenceReadyCount: summary.outputReferenceReadyCount ?? null,
    outputReferenceCount: summary.outputReferenceCount ?? outputReferences.length,
    magnetarCalibratedReferenceReadyCount: summary.magnetarCalibratedReferenceReadyCount ?? null,
    magnetarCalibratedReferenceCount: summary.magnetarCalibratedReferenceCount ?? null,
    adapterProbe: clonePlain(probe)
  };
}

function createEshkolIngestSummary(payload = {}, probe = null) {
  const summary = payload.artifactSummary || {};
  return {
    schema: 'peercompute.ulg.eshkol-dispatch-ingest.v0',
    closureReady: summary.closureReady === true,
    closureDescriptorReady: summary.closureDescriptorReady === true,
    closureOutputSemanticsReady: summary.closureOutputSemanticsReady === true,
    closureKind: summary.closureKind || payload.artifact?.closureKind || null,
    closureDescriptorSchema: summary.closureDescriptorSchema || null,
    wasmByteLength: payload.wasmByteLength ?? null,
    wasmSha256: payload.wasmSha256 || null,
    wasmTransferMode: payload.wasmTransferMode || null,
    hasTransferredWasmBytes: payload.hasTransferredWasmBytes === true,
    moduleCompiled: probe?.moduleCompiled === true,
    moduleImportCount: probe?.importCount ?? null,
    moduleExportCount: probe?.exportCount ?? null,
    moduleImportMetadataMatches: probe?.importMetadataMatches ?? null,
    moduleExportMetadataMatches: probe?.exportMetadataMatches ?? null,
    descriptorContractReady: probe?.descriptorProbe?.ready === true,
    descriptorContractSchema: probe?.descriptorProbe?.schema || null,
    descriptorContractStatus: probe?.descriptorProbe?.status || null,
    adapterProbe: clonePlain(probe)
  };
}

function createIngestSummary(payload = {}, probe = null) {
  if (payload.sourceService === 'moonlab') return createMoonLabIngestSummary(payload, probe);
  if (payload.sourceService === 'eshkol') return createEshkolIngestSummary(payload, probe);
  return {
    schema: 'peercompute.ulg.dispatch-ingest.v0',
    artifactKind: payload.artifactKind || null,
    sourceService: payload.sourceService || null,
    adapterProbe: clonePlain(probe)
  };
}

function createResultArtifact({ manifest, task, payload, ingest, validation, lease, probe }) {
  return {
    schema: ULG_DISPATCH_SERVICE_ARTIFACT_SCHEMA,
    artifactKind: `${payload.sourceService || 'ulg'}-dispatch-ingest`,
    sourceService: manifest.serviceId,
    contentHash: createArtifactContentHash(payload, task, manifest.serviceId),
    handoffId: payload.handoffId || task.handoffId || null,
    dispatchId: payload.dispatchId || task.dispatch?.dispatchId || null,
    artifactRefUri: payload.artifactRefUri || null,
    artifactContentHash: payload.artifactContentHash || null,
    payloadSchema: payload.schema || null,
    payloadSourceService: payload.sourceService || null,
    payloadArtifactKind: payload.artifactKind || null,
    validation: clonePlain(validation),
    ingest: clonePlain(ingest),
    childLease: lease ? {
      schema: lease.schema,
      leaseId: lease.leaseId,
      module: lease.module,
      workerType: lease.workerType,
      count: lease.count
    } : null,
    probe: clonePlain(probe),
    artifactPayload: clonePlain(payload)
  };
}

export class UlgDispatchServiceHost {
  constructor(manifest, options = {}) {
    this.manifest = manifest;
    this.options = options;
    this.listeners = {
      message: new Set(),
      error: new Set()
    };
    this.workerId = null;
    this.task = null;
    this.validation = null;
    this.probe = null;
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
      this.#emit({
        type: 'ready',
        workerId: this.workerId,
        serviceId: this.manifest.serviceId
      });
      this.#emitHeartbeat('ready');
      return;
    }
    if (message.type === 'submit-task') {
      this.#startTask(message.task || {}).catch((error) => {
        this.#emit({
          type: 'task-error',
          rootTaskId: message.task?.rootTaskId,
          error: error?.message || String(error)
        });
      });
      return;
    }
    if (message.type === 'lease-granted') {
      this.#completeTask(message.lease || null);
      return;
    }
    if (message.type === 'lease-denied') {
      this.#completeTask(null, ['ulg-dispatch-child-lease-denied', message.error]);
      return;
    }
    if (message.type === 'cancel-task') {
      this.#emit({
        type: 'task-cancelled',
        rootTaskId: message.rootTaskId,
        result: this.#createResult({
          status: 'cancelled',
          ready: false,
          blockers: ['ulg-dispatch-task-cancelled'],
          lease: null
        })
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

  async #startTask(task = {}) {
    this.task = task;
    this.validation = validateDispatchPayload(task, this.manifest);
    this.probe = null;
    this.#emitHeartbeat('validating-dispatch');
    this.#emit({
      type: 'task-status',
      rootTaskId: task.rootTaskId,
      status: this.validation.ready ? 'validating-dispatch-payload' : 'blocked-dispatch-payload',
      progress: this.validation.ready ? 0.25 : 1,
      children: []
    });
    if (!this.validation.ready) {
      this.#emit({
        type: 'task-result',
        rootTaskId: task.rootTaskId,
        result: this.#createResult({
          status: 'blocked',
          ready: false,
          blockers: this.validation.blockers,
          lease: null
        })
      });
      return;
    }
    this.probe = await createDispatchAdapterProbe(this.validation.payload, task, this.manifest);
    const probeBlockers = uniqueStrings(this.probe?.blockers || []);
    if (probeBlockers.length > 0) {
      this.validation = {
        ...this.validation,
        blockers: uniqueStrings([...(this.validation.blockers || []), ...probeBlockers]),
        ready: false
      };
      this.#emit({
        type: 'task-result',
        rootTaskId: task.rootTaskId,
        result: this.#createResult({
          status: 'blocked',
          ready: false,
          blockers: this.validation.blockers,
          lease: null
        })
      });
      return;
    }

    const module = this.options.childWorkerModule
      || this.manifest.childWorkers?.allowedModules?.[0]
      || null;
    const shouldRequestLease = this.options.requestChildLease !== false
      && this.manifest.childWorkers?.allowed === true
      && module;
    if (!shouldRequestLease) {
      this.#completeTask(null);
      return;
    }
    this.#emit({
      type: 'lease-request',
      requestId: `${task.rootTaskId}:dispatch-lease`,
      rootTaskId: task.rootTaskId,
      module,
      workerType: this.options.workerType || 'module',
      count: task.resources?.childWorkers || 1,
      ttlMs: this.options.leaseTtlMs || 5_000,
      resources: {
        sourceService: this.validation.payload.sourceService || null,
        artifactKind: this.validation.payload.artifactKind || null,
        payloadSchema: this.validation.payload.schema || null,
        wasmByteLength: this.validation.payload.wasmByteLength ?? null
      }
    });
  }

  #completeTask(lease = null, extraBlockers = []) {
    const blockers = uniqueStrings([
      ...(this.validation?.blockers || []),
      ...extraBlockers
    ]);
    const ready = this.validation?.ready === true && blockers.length === 0;
    const task = this.task || {};
    if (lease) {
      this.#emit({
        type: 'task-status',
        rootTaskId: lease.rootTaskId,
        status: 'running-dispatch-adapter',
        progress: 0.75,
        children: [{
          childId: `${lease.rootTaskId}:dispatch-child`,
          leaseId: lease.leaseId,
          module: lease.module,
          serviceId: this.manifest.serviceId,
          status: 'running',
          progress: 0.75
        }]
      });
      this.#emit({ type: 'lease-release', leaseId: lease.leaseId });
    }
    this.#emitHeartbeat(ready ? 'accepted' : 'blocked', lease);
    this.#emit({
      type: 'task-result',
      rootTaskId: task.rootTaskId || lease?.rootTaskId,
      result: this.#createResult({
        status: ready ? 'accepted' : 'blocked',
        ready,
        blockers,
        lease
      })
    });
  }

  #createResult({ status, ready, blockers, lease }) {
    const task = this.task || {};
    const payload = this.validation?.payload || task.artifactPayload || {};
    const ingest = payload && typeof payload === 'object' ? createIngestSummary(payload, this.probe) : null;
    const validation = {
      schema: 'peercompute.ulg.dispatch-service-validation.v0',
      status: ready ? 'pass' : 'blocked',
      ready,
      blockers: clonePlain(blockers || []),
      expectedSourceService: this.validation?.expectedSource || null,
      acceptedArtifactKinds: clonePlain(this.validation?.acceptedKinds || []),
      adapterProbeSchema: this.probe?.schema || null,
      adapterProbeStatus: this.probe?.status || null,
      adapterProbeReady: this.probe?.ready === true
    };
    const artifact = ready && payload
      ? createResultArtifact({ manifest: this.manifest, task, payload, ingest, validation, lease, probe: this.probe })
      : null;
    return {
      schema: ULG_DISPATCH_SERVICE_RESULT_SCHEMA,
      adapterSchema: ULG_DISPATCH_SERVICE_ADAPTER_SCHEMA,
      serviceId: this.manifest.serviceId,
      serviceStatus: status,
      ready,
      blockers: clonePlain(blockers || []),
      taskId: task.taskId || null,
      taskKind: task.taskKind || null,
      handoffId: payload.handoffId || task.handoffId || null,
      dispatchId: payload.dispatchId || task.dispatch?.dispatchId || null,
      artifactKind: payload.artifactKind || null,
      sourceService: payload.sourceService || null,
      artifactRefUri: payload.artifactRefUri || null,
      artifactContentHash: payload.artifactContentHash || null,
      ingest,
      probe: clonePlain(this.probe),
      validation,
      childLease: lease ? {
        schema: lease.schema,
        leaseId: lease.leaseId,
        module: lease.module,
        workerType: lease.workerType,
        count: lease.count
      } : null,
      artifact
    };
  }

  #emitHeartbeat(status, lease = null) {
    this.#emit({
      type: 'heartbeat',
      telemetry: {
        schema: ULG_DISPATCH_SERVICE_TELEMETRY_SCHEMA,
        adapterSchema: ULG_DISPATCH_SERVICE_ADAPTER_SCHEMA,
        serviceId: this.manifest.serviceId,
        status,
        sourceService: normalizeExpectedSource(this.manifest),
        payloadSchema: this.task?.artifactPayload?.schema || null,
        artifactKind: this.task?.artifactPayload?.artifactKind || null,
        taskKind: this.task?.taskKind || null,
        probeSchema: this.probe?.schema || null,
        probeStatus: this.probe?.status || null,
        probeReady: this.probe?.ready === true,
        blockers: clonePlain(this.validation?.blockers || []),
        activeLeaseId: lease?.leaseId || null
      }
    });
  }

  #emit(data) {
    for (const listener of this.listeners.message) {
      listener({ data });
    }
  }
}

export function createUlgDispatchServiceHostFactory(options = {}) {
  return function createUlgDispatchServiceHost(manifest) {
    return new UlgDispatchServiceHost(manifest, options);
  };
}
