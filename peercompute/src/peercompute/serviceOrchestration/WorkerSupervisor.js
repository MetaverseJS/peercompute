import { ChildWorkerLeaseManager } from './ChildWorkerLeaseManager.js';
import { ComputeServiceRegistry } from './ComputeServiceRegistry.js';

export const WORKER_SUPERVISOR_TELEMETRY_SCHEMA = 'peercompute.service.worker-supervisor-telemetry.v0';

let nextWorkerId = 1;
let nextTaskId = 1;

function createId(prefix) {
  const id = prefix || 'id';
  const next = id.startsWith('task') ? nextTaskId : nextWorkerId;
  if (id.startsWith('task')) {
    nextTaskId += 1;
  } else {
    nextWorkerId += 1;
  }
  return `${id}-${Date.now().toString(36)}-${next.toString(36)}`;
}

function clonePlain(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function sanitizeForTelemetry(value) {
  if (value == null) return value;
  if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'function') return `[Function:${value.name || 'anonymous'}]`;
  if (ArrayBuffer.isView(value)) {
    return {
      typedArray: value.constructor?.name || 'TypedArray',
      length: value.length
    };
  }
  if (value instanceof ArrayBuffer) {
    return {
      arrayBufferByteLength: value.byteLength
    };
  }
  if (Array.isArray(value)) return value.map(sanitizeForTelemetry);
  if (typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value)) {
      out[key] = sanitizeForTelemetry(value[key]);
    }
    return out;
  }
  return String(value);
}

function defaultWorkerFactory(manifest, { serviceId } = {}) {
  if (typeof Worker === 'undefined') {
    throw new Error(`Web Worker is unavailable for service ${serviceId}`);
  }
  const moduleUrl = manifest?.entry?.workerModule;
  if (!moduleUrl) {
    throw new Error(`Service ${serviceId} does not declare entry.workerModule`);
  }
  return new Worker(moduleUrl, { type: 'module', name: `peercompute-${serviceId}` });
}

function addMessageListener(host, listener) {
  if (typeof host.addEventListener === 'function') {
    host.addEventListener('message', listener);
    return () => host.removeEventListener?.('message', listener);
  }
  if (typeof host.on === 'function') {
    host.on('message', listener);
    return () => host.off?.('message', listener) || host.removeListener?.('message', listener);
  }
  throw new Error('Service host must provide addEventListener or on(message)');
}

function addErrorListener(host, listener) {
  if (typeof host.addEventListener === 'function') {
    host.addEventListener('error', listener);
    return () => host.removeEventListener?.('error', listener);
  }
  if (typeof host.on === 'function') {
    host.on('error', listener);
    return () => host.off?.('error', listener) || host.removeListener?.('error', listener);
  }
  return () => {};
}

function postHostMessage(host, message) {
  if (typeof host.postMessage !== 'function') {
    throw new Error('Service host must provide postMessage');
  }
  host.postMessage(message);
}

function terminateHost(host) {
  if (typeof host.terminate === 'function') {
    host.terminate();
  } else if (typeof host.close === 'function') {
    host.close();
  }
}

function taskRootId(task = {}) {
  return String(task.rootTaskId || task.taskId || task.id || createId('task')).trim();
}

export class WorkerSupervisor {
  constructor({
    registry = new ComputeServiceRegistry(),
    leaseManager = new ChildWorkerLeaseManager(),
    workerFactory = defaultWorkerFactory,
    serviceFactory = null,
    resourceBroker = null,
    artifactCache = null,
    now = () => Date.now()
  } = {}) {
    this.registry = registry;
    this.leaseManager = leaseManager;
    this.workerFactory = serviceFactory || workerFactory;
    this.resourceBroker = resourceBroker;
    this.artifactCache = artifactCache;
    this.now = now;
    this.handles = new Map();
    this.tasks = new Map();
    this.pending = new Map();
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async spawnService(serviceId) {
    const service = this.registry.get(serviceId);
    if (!service) {
      throw new Error(`No registered service: ${serviceId}`);
    }
    if (this.handles.has(serviceId)) {
      return this.handles.get(serviceId);
    }

    const workerId = createId(`service-${serviceId}`);
    const host = this.workerFactory(service.manifest, {
      serviceId,
      workerId,
      supervisor: this,
      registry: this.registry,
      leaseManager: this.leaseManager
    });
    const handle = {
      serviceId,
      workerId,
      manifest: service.manifest,
      host,
      status: 'spawning',
      spawnedAt: this.now(),
      heartbeatAt: null,
      telemetry: {},
      cleanup: []
    };
    handle.cleanup.push(addMessageListener(host, (event) => this.#handleMessage(handle, event?.data ?? event)));
    handle.cleanup.push(addErrorListener(host, (event) => {
      handle.status = 'error';
      handle.error = event?.message || String(event || 'service host error');
      this.#emit({ type: 'worker-error', handle: this.#handleSummary(handle), error: handle.error });
    }));

    this.handles.set(serviceId, handle);
    postHostMessage(host, { type: 'init', workerId, manifest: service.manifest });
    this.#emit({ type: 'service-spawned', handle: this.#handleSummary(handle) });
    return handle;
  }

  async submitTask(task = {}) {
    const serviceId = task.serviceId || this.registry.resolveTask(task)[0]?.serviceId;
    if (!serviceId) {
      throw new Error(`No service resolves task kind: ${task.taskKind || task.kind || 'unknown'}`);
    }
    const handle = this.handles.get(serviceId) || await this.spawnService(serviceId);
    const rootTaskId = taskRootId(task);
    const normalizedTask = {
      ...task,
      rootTaskId,
      taskId: task.taskId || rootTaskId,
      serviceId
    };
    const resourceLease = this.resourceBroker
      ? await this.resourceBroker.requestLease({
        ...(normalizedTask.resources || {}),
        rootTaskId
      })
      : null;
    const taskRecord = {
      ...normalizedTask,
      resourceLease,
      status: 'queued',
      progress: 0,
      children: [],
      submittedAt: this.now()
    };
    this.tasks.set(rootTaskId, taskRecord);
    const promise = new Promise((resolve, reject) => {
      this.pending.set(rootTaskId, { resolve, reject });
    });
    postHostMessage(handle.host, { type: 'submit-task', task: normalizedTask, resourceLease });
    this.#emit({ type: 'task-submitted', task: this.#taskSummary(taskRecord) });
    return promise;
  }

  async cancelTree(rootTaskId) {
    const task = this.tasks.get(rootTaskId);
    if (!task) return undefined;
    task.status = 'cancelling';
    task.cancelRequestedAt = this.now();
    await this.leaseManager.revokeByRootTask(rootTaskId);
    const revokedResources = await this.resourceBroker?.revokeByRootTask?.(rootTaskId);
    if (Array.isArray(revokedResources) && revokedResources.length > 0) {
      task.resourceLease = revokedResources[0];
    }
    const handle = this.handles.get(task.serviceId);
    if (handle) {
      postHostMessage(handle.host, { type: 'cancel-task', rootTaskId });
    }
    this.#emit({ type: 'task-cancelling', task: this.#taskSummary(task) });
    return this.#taskSummary(task);
  }

  async shutdown() {
    await Promise.all([...this.tasks.values()]
      .filter((task) => task.status !== 'complete' && task.status !== 'cancelled-clean' && task.status !== 'error')
      .map((task) => this.cancelTree(task.rootTaskId)));
    for (const handle of this.handles.values()) {
      try {
        postHostMessage(handle.host, { type: 'shutdown' });
      } catch {}
      for (const cleanup of handle.cleanup) {
        try {
          cleanup?.();
        } catch {}
      }
      terminateHost(handle.host);
      handle.status = 'terminated';
      handle.terminatedAt = this.now();
    }
    this.handles.clear();
    this.#emit({ type: 'shutdown' });
  }

  getTreeTelemetry() {
    return {
      schema: WORKER_SUPERVISOR_TELEMETRY_SCHEMA,
      registry: typeof this.registry?.listCapabilities === 'function'
        ? this.registry.listCapabilities()
        : null,
      services: [...this.handles.values()].map((handle) => this.#handleSummary(handle)),
      tasks: [...this.tasks.values()].map((task) => this.#taskSummary(task)),
      leases: this.leaseManager.list(),
      resources: this.resourceBroker?.reportPressure?.() || null,
      artifacts: this.artifactCache?.list?.() || []
    };
  }

  async #handleMessage(handle, message = {}) {
    if (!message || typeof message !== 'object') return;
    if (message.type === 'ready') {
      handle.status = 'ready';
      handle.readyAt = this.now();
    } else if (message.type === 'heartbeat') {
      handle.heartbeatAt = this.now();
      handle.telemetry = clonePlain(message.telemetry || {});
    } else if (message.type === 'task-status') {
      const task = this.tasks.get(message.rootTaskId);
      if (task) {
        task.status = message.status || task.status;
        task.progress = message.progress ?? task.progress;
        task.children = clonePlain(message.children || task.children || []);
        task.updatedAt = this.now();
      }
    } else if (message.type === 'lease-request') {
      await this.#handleLeaseRequest(handle, message);
    } else if (message.type === 'lease-release') {
      await this.leaseManager.release(message.leaseId);
    } else if (message.type === 'task-result') {
      await this.#completeTask(message.rootTaskId, message.result, 'complete');
    } else if (message.type === 'task-cancelled') {
      await this.#completeTask(message.rootTaskId, message.result, 'cancelled-clean');
    } else if (message.type === 'task-error') {
      await this.#failTask(message.rootTaskId, message.error || message.message || 'task failed');
    }
    this.#emit({
      type: 'worker-message',
      serviceId: handle.serviceId,
      message: sanitizeForTelemetry(message)
    });
  }

  async #handleLeaseRequest(handle, message) {
    try {
      const policy = handle.manifest.childWorkers || {};
      const lease = await this.leaseManager.request(handle.workerId, {
        rootTaskId: message.rootTaskId,
        module: message.module,
        workerType: message.workerType,
        count: message.count,
        resources: message.resources,
        ttlMs: message.ttlMs,
        allowed: policy.allowed,
        maxChildren: policy.maxChildren,
        allowedModules: policy.allowedModules,
        sameOriginOnly: policy.sameOriginOnly,
        baseUrl: policy.baseUrl || handle.manifest.entry.workerModule || null
      });
      postHostMessage(handle.host, { type: 'lease-granted', requestId: message.requestId, lease });
    } catch (error) {
      postHostMessage(handle.host, {
        type: 'lease-denied',
        requestId: message.requestId,
        error: error?.message || String(error)
      });
    }
  }

  async #completeTask(rootTaskId, result, status) {
    const task = this.tasks.get(rootTaskId);
    if (!task) return;
    task.status = status;
    task.progress = status === 'complete' ? 1 : task.progress;
    task.finishedAt = this.now();
    task.result = sanitizeForTelemetry(result);
    if (result?.artifact && this.artifactCache?.put) {
      task.artifactRef = await this.artifactCache.put(result.artifact);
    }
    if (task.resourceLease && this.resourceBroker?.releaseLease) {
      await this.resourceBroker.releaseLease(task.resourceLease.leaseId);
    }
    const pending = this.pending.get(rootTaskId);
    pending?.resolve({
      ...(result && typeof result === 'object' ? result : { value: result }),
      status,
      rootTaskId,
      artifactRef: task.artifactRef
    });
    this.pending.delete(rootTaskId);
  }

  async #failTask(rootTaskId, error) {
    const task = this.tasks.get(rootTaskId);
    if (!task) return;
    task.status = 'error';
    task.error = error?.message || String(error);
    task.finishedAt = this.now();
    if (task.resourceLease && this.resourceBroker?.releaseLease) {
      await this.resourceBroker.releaseLease(task.resourceLease.leaseId);
    }
    const pending = this.pending.get(rootTaskId);
    pending?.reject(error instanceof Error ? error : new Error(task.error));
    this.pending.delete(rootTaskId);
  }

  #handleSummary(handle) {
    return {
      serviceId: handle.serviceId,
      workerId: handle.workerId,
      status: handle.status,
      spawnedAt: handle.spawnedAt,
      readyAt: handle.readyAt || null,
      heartbeatAt: handle.heartbeatAt,
      telemetry: clonePlain(handle.telemetry || {}),
      capabilities: [...(handle.manifest.capabilities || [])],
      taskKinds: [...(handle.manifest.taskKinds || [])],
      abi: clonePlain(handle.manifest.abi || null),
      contract: clonePlain(handle.manifest.contract || handle.manifest.metadata?.ulgContract || null)
    };
  }

  #taskSummary(task) {
    return {
      taskId: task.taskId,
      rootTaskId: task.rootTaskId,
      serviceId: task.serviceId,
      taskKind: task.taskKind || task.kind || null,
      status: task.status,
      progress: task.progress ?? 0,
      children: clonePlain(task.children || []),
      resourceLease: clonePlain(task.resourceLease || null),
      artifactRef: clonePlain(task.artifactRef || null),
      error: task.error || null,
      submittedAt: task.submittedAt || null,
      finishedAt: task.finishedAt || null
    };
  }

  #emit(event) {
    const telemetry = this.getTreeTelemetry();
    for (const listener of this.listeners) {
      listener(event, telemetry);
    }
  }
}
