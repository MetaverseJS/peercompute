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
    const serviceReady = serviceResult?.ready === true
      || serviceResult?.status === 'complete'
      || serviceResult?.status === 'accepted';
    return {
      schema: ULG_HANDOFF_SUPERVISOR_EXECUTOR_SCHEMA,
      dispatchId: dispatch.dispatchId,
      serviceId: dispatch.serviceId,
      sourceService: dispatch.sourceService,
      artifactKind: dispatch.artifactKind,
      taskKind: dispatch.taskKind,
      status: serviceReady ? 'accepted' : (serviceResult?.status || 'pending'),
      ready: serviceReady,
      artifactRefUri: dispatch.artifactRefUri || null,
      artifactContentHash: dispatch.artifactContentHash || null,
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
