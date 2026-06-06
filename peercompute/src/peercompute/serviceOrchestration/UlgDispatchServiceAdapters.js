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

function createMoonLabIngestSummary(payload = {}) {
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
    magnetarCalibratedReferenceCount: summary.magnetarCalibratedReferenceCount ?? null
  };
}

function createEshkolIngestSummary(payload = {}) {
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
    hasTransferredWasmBytes: payload.hasTransferredWasmBytes === true
  };
}

function createIngestSummary(payload = {}) {
  if (payload.sourceService === 'moonlab') return createMoonLabIngestSummary(payload);
  if (payload.sourceService === 'eshkol') return createEshkolIngestSummary(payload);
  return {
    schema: 'peercompute.ulg.dispatch-ingest.v0',
    artifactKind: payload.artifactKind || null,
    sourceService: payload.sourceService || null
  };
}

function createResultArtifact({ manifest, task, payload, ingest, validation, lease }) {
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
      this.#startTask(message.task || {});
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

  #startTask(task = {}) {
    this.task = task;
    this.validation = validateDispatchPayload(task, this.manifest);
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
    const ingest = payload && typeof payload === 'object' ? createIngestSummary(payload) : null;
    const validation = {
      schema: 'peercompute.ulg.dispatch-service-validation.v0',
      status: ready ? 'pass' : 'blocked',
      ready,
      blockers: clonePlain(blockers || []),
      expectedSourceService: this.validation?.expectedSource || null,
      acceptedArtifactKinds: clonePlain(this.validation?.acceptedKinds || [])
    };
    const artifact = ready && payload
      ? createResultArtifact({ manifest: this.manifest, task, payload, ingest, validation, lease })
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
