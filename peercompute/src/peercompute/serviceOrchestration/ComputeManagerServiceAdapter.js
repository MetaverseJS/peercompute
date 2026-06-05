export const COMPUTE_MANAGER_SERVICE_ADAPTER_SCHEMA = 'peercompute.service.compute-manager-adapter.v0';

function scheduleMicrotask(fn) {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(fn);
  } else {
    Promise.resolve().then(fn);
  }
}

function normalizeRootTaskId(task = {}) {
  return String(task.rootTaskId || task.taskId || task.id || `task-${Date.now()}`).trim();
}

function defaultTaskMapper(task = {}, { manifest } = {}) {
  const rootTaskId = normalizeRootTaskId(task);
  if (task.computeTask && typeof task.computeTask === 'object') {
    return {
      ...task.computeTask,
      id: task.computeTask.id || rootTaskId,
      taskFamily: task.computeTask.taskFamily || task.taskKind || manifest?.serviceId
    };
  }
  if (task.computeSolver && typeof task.computeSolver === 'object') {
    return {
      solverId: task.computeSolver.solverId || manifest?.entry?.solverId,
      solverInput: {
        id: task.computeSolver.id || rootTaskId,
        ...task.computeSolver.input
      }
    };
  }
  if (manifest?.entry?.solverId) {
    return {
      solverId: manifest.entry.solverId,
      solverInput: {
        id: rootTaskId,
        stateKey: task.stateKey || rootTaskId,
        input: task.input || task.data || {},
        data: task.data || {}
      }
    };
  }
  if (task.fn || task.module || task.wasm || manifest?.entry?.module || manifest?.entry?.hostModule) {
    return {
      id: rootTaskId,
      runtime: task.runtime || manifest?.runtime || 'js',
      taskFamily: task.taskFamily || task.taskKind || manifest?.serviceId,
      fn: task.fn,
      module: task.module || manifest?.entry?.module,
      hostModule: task.hostModule || manifest?.entry?.hostModule,
      exportName: task.exportName || manifest?.entry?.exportName || 'default',
      hostExport: task.hostExport || manifest?.entry?.hostExport,
      wasm: task.wasm || manifest?.entry?.wasm,
      wasmSource: task.wasmSource || manifest?.entry?.wasmSource,
      source: task.source || manifest?.entry?.source,
      data: task.data || task.input || {},
      placementHint: task.placementHint
    };
  }
  throw new Error(`Task ${rootTaskId} does not provide a compute target`);
}

function defaultResultMapper(result, task = {}, { manifest, computeManager } = {}) {
  return {
    schema: COMPUTE_MANAGER_SERVICE_ADAPTER_SCHEMA,
    serviceId: manifest?.serviceId || task.serviceId || null,
    taskKind: task.taskKind || task.kind || null,
    value: result,
    compute: computeManager?.getStats ? {
      stats: computeManager.getStats()
    } : null
  };
}

export class ComputeManagerServiceAdapter {
  constructor({
    manifest,
    computeManager,
    taskMapper = defaultTaskMapper,
    resultMapper = defaultResultMapper
  } = {}) {
    if (!manifest?.serviceId) {
      throw new Error('ComputeManagerServiceAdapter requires manifest.serviceId');
    }
    if (!computeManager?.submitTask) {
      throw new Error('ComputeManagerServiceAdapter requires computeManager.submitTask');
    }
    this.manifest = manifest;
    this.computeManager = computeManager;
    this.taskMapper = taskMapper;
    this.resultMapper = resultMapper;
    this.listeners = {
      message: new Set(),
      error: new Set()
    };
    this.activeTasks = new Map();
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
      scheduleMicrotask(() => this.#runTask(message.task));
      return;
    }
    if (message.type === 'cancel-task') {
      this.#cancelTask(message.rootTaskId);
      return;
    }
    if (message.type === 'shutdown') {
      this.terminate();
    }
  }

  terminate() {
    this.closed = true;
    for (const rootTaskId of this.activeTasks.keys()) {
      this.#cancelTask(rootTaskId);
    }
  }

  async #runTask(task = {}) {
    const rootTaskId = normalizeRootTaskId(task);
    if (this.closed) return;
    const active = {
      rootTaskId,
      status: 'running',
      cancelled: false
    };
    this.activeTasks.set(rootTaskId, active);
    this.#emitMessage({
      type: 'task-status',
      rootTaskId,
      status: 'running',
      progress: 0.1,
      children: []
    });

    try {
      const mapped = this.taskMapper(task, {
        manifest: this.manifest,
        adapter: this,
        computeManager: this.computeManager
      });
      const result = await this.#submitMappedTask(mapped);
      if (active.cancelled || this.closed) return;
      this.activeTasks.delete(rootTaskId);
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
        result: this.resultMapper(result, task, {
          manifest: this.manifest,
          adapter: this,
          computeManager: this.computeManager
        })
      });
    } catch (error) {
      this.activeTasks.delete(rootTaskId);
      this.#emitMessage({
        type: 'task-error',
        rootTaskId,
        error: error?.message || String(error)
      });
      this.#emitError(error);
    }
  }

  #submitMappedTask(mapped = {}) {
    if (mapped.solverId && mapped.solverInput) {
      return this.computeManager.submitSolverTask(mapped.solverId, mapped.solverInput);
    }
    return this.computeManager.submitTask(mapped);
  }

  #cancelTask(rootTaskId) {
    const active = this.activeTasks.get(rootTaskId);
    if (!active) return;
    active.cancelled = true;
    active.status = 'cancelled-clean';
    this.activeTasks.delete(rootTaskId);
    this.#emitMessage({
      type: 'task-cancelled',
      rootTaskId,
      result: {
        schema: COMPUTE_MANAGER_SERVICE_ADAPTER_SCHEMA,
        serviceId: this.manifest.serviceId,
        cancelled: true,
        reason: 'cancel-requested'
      }
    });
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

export function createComputeManagerServiceFactory(computeManager, options = {}) {
  return (manifest) => new ComputeManagerServiceAdapter({
    ...options,
    manifest,
    computeManager
  });
}
