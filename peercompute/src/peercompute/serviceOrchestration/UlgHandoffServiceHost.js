import {
  ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA,
  createUlgHandoffServiceEnvelope
} from './ulgManifestAdapter.js';

export const ULG_HANDOFF_SERVICE_ADAPTER_SCHEMA = 'peercompute.ulg.handoff-service-adapter.v0';
export const ULG_HANDOFF_SERVICE_TASK_SCHEMA = 'peercompute.ulg.handoff-service-task.v0';
export const ULG_HANDOFF_SERVICE_RESULT_SCHEMA = 'peercompute.ulg.handoff-service-result.v0';

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
    capabilities: ['ulg.handoff.normalize', 'ulg.handoff.relay-envelope'],
    taskKinds: [ULG_HANDOFF_SERVICE_TASK_SCHEMA, 'peercompute.ulg.handoff.service'],
    abi: {
      inputEnvelopeSchema: ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA,
      outputEnvelopeSchema: ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA
    },
    contract: {
      schema: ULG_HANDOFF_SERVICE_ADAPTER_SCHEMA,
      serviceId,
      inputSchemas: ['peercompute.ulg.demo-handoff.v0', ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA],
      outputSchemas: [ULG_HANDOFF_SERVICE_RESULT_SCHEMA, ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA],
      relaySafeArtifactsRequired: true,
      contentAddressedArtifactsRequired: true
    },
    validation: {
      requiresRelaySafeEnvelope: true,
      requiresContentAddressedArtifacts: true
    },
    metadata: {
      adapter: ULG_HANDOFF_SERVICE_ADAPTER_SCHEMA,
      domain: 'ulg-handoff'
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

  #runTask(task = {}) {
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
      const result = this.#createResult(task, envelope, rootTaskId);
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

  #createResult(task = {}, envelope = {}, rootTaskId) {
    const taskKind = task.taskKind || task.kind || ULG_HANDOFF_SERVICE_TASK_SCHEMA;
    const artifact = {
      schema: ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA,
      artifactKind: 'ulg-handoff-service-envelope',
      sourceService: this.manifest.serviceId,
      contentHash: envelope.handoffId,
      handoffId: envelope.handoffId,
      ready: envelope.ready === true,
      status: envelope.status,
      blockers: clonePlain(envelope.blockers || []),
      envelope: clonePlain(envelope),
      provenance: clonePlain(envelope.provenance || null)
    };
    return {
      schema: ULG_HANDOFF_SERVICE_RESULT_SCHEMA,
      adapterSchema: ULG_HANDOFF_SERVICE_ADAPTER_SCHEMA,
      serviceId: this.manifest.serviceId,
      taskKind,
      taskId: task.taskId || rootTaskId,
      rootTaskId,
      status: envelope.ready ? 'complete' : 'pending',
      ready: envelope.ready === true,
      blockerCount: envelope.blockers?.length || 0,
      envelope,
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
