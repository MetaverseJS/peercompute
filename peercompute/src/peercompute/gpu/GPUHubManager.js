/**
 * @fileoverview GPUHubManager - Main-thread GPU hub for shared render+compute
 */

const GPU_HUB_RESIDENT_STAGE_EXECUTOR_SCHEMA = 'peercompute.gpu.resident-stage-executor.v0';
export const GPU_HUB_RESIDENT_STAGE_WORKER_POLICY_SCHEMA = 'peercompute.gpu.resident-stage-worker-policy.v0';
export const GPU_HUB_RESIDENT_STAGE_WORKER_BACKEND_SCHEMA = 'peercompute.gpu.resident-stage-worker-backend.v0';

function normalizeString(value, fallback = null) {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function cloneMetadata(value) {
  return value == null ? null : JSON.parse(JSON.stringify(value));
}

function normalizeBoolean(value, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

function normalizePositiveInteger(value, fallback = null) {
  const number = Math.floor(Number(value));
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function normalizeResidentStageWorkerPolicy(source = {}, stageId = null) {
  const policy = source && typeof source === 'object' ? source : {};
  const requestedMode = normalizeString(policy.mode ?? policy.residencyMode, null);
  const hasWorkerTarget = Boolean(policy.worker || policy.workerReady || policy.workerModuleUrl || policy.workerType);
  const mode = requestedMode || (hasWorkerTarget ? 'dedicated-worker' : 'inline');
  const workerReady = normalizeBoolean(policy.workerReady, false) || Boolean(policy.worker);
  const dedicated = mode === 'dedicated-worker' || mode === 'webgpu-worker' || mode === 'gpu-compute-worker';
  const normalizedMode = dedicated ? 'dedicated-worker' : 'inline';
  const status = dedicated
    ? (workerReady ? 'worker-ready' : 'blocked-worker-backend-missing')
    : 'inline-ready';
  return {
    schema: GPU_HUB_RESIDENT_STAGE_WORKER_POLICY_SCHEMA,
    stageId,
    mode: normalizedMode,
    status,
    workerType: normalizeString(policy.workerType, dedicated ? 'webgpu-compute-worker' : null),
    workerModuleUrl: normalizeString(policy.workerModuleUrl ?? policy.moduleUrl, null),
    startupMode: normalizeString(policy.startupMode, dedicated ? 'warm-on-first-use' : 'inline'),
    idleTtlMs: normalizePositiveInteger(policy.idleTtlMs, dedicated ? 60000 : null),
    sameDeviceRequired: normalizeBoolean(policy.sameDeviceRequired, dedicated),
    bufferTransferPolicy: normalizeString(
      policy.bufferTransferPolicy,
      dedicated
        ? 'worker-owns-device-and-retained-buffers-required'
        : 'main-thread-gpuhub-inline'
    ),
    fallbackRuntimeTarget: status === 'blocked-worker-backend-missing'
      ? 'gpu-hub-inline-stage-executor'
      : null,
    authority: 'compute-manager-gpuhub-resident-stage-worker-policy'
  };
}

async function executeWorkerRunner(runner, args) {
  if (typeof runner === 'function') return runner(args);
  if (runner && typeof runner.runStage === 'function') return runner.runStage(args);
  throw new Error('[GPUHubManager] Resident stage worker backend must be a function or expose runStage()');
}

function defaultResidentStageWorkerFactory(moduleUrl, { workerScriptType = 'module' } = {}) {
  if (typeof Worker === 'undefined') {
    throw new Error('[GPUHubManager] Worker is not available in this environment');
  }
  return new Worker(moduleUrl, { type: workerScriptType });
}

function addWorkerMessageListener(worker, listener) {
  if (typeof worker.addEventListener === 'function') {
    worker.addEventListener('message', listener);
    return () => worker.removeEventListener?.('message', listener);
  }
  const previous = worker.onmessage;
  worker.onmessage = listener;
  return () => {
    if (worker.onmessage === listener) worker.onmessage = previous || null;
  };
}

function workerMessageData(event) {
  return event?.data ?? event;
}

export class ResidentStageWorkerBackend {
  constructor({
    workerModuleUrl,
    workerFactory = defaultResidentStageWorkerFactory,
    workerScriptType = 'module',
    requestIdPrefix = 'resident-stage-worker',
    timeoutMs = 30000
  } = {}) {
    this.schema = GPU_HUB_RESIDENT_STAGE_WORKER_BACKEND_SCHEMA;
    this.workerModuleUrl = normalizeString(workerModuleUrl, null);
    if (!this.workerModuleUrl) {
      throw new Error('[GPUHubManager] Resident stage worker backend requires workerModuleUrl');
    }
    this.workerFactory = workerFactory;
    this.workerScriptType = workerScriptType;
    this.requestIdPrefix = requestIdPrefix;
    this.timeoutMs = normalizePositiveInteger(timeoutMs, 30000);
    this.worker = null;
    this.disposeMessageListener = null;
    this.pending = new Map();
    this.nextRequestOrdinal = 1;
  }

  ensureWorker() {
    if (this.worker) return this.worker;
    this.worker = this.workerFactory(this.workerModuleUrl, {
      workerScriptType: this.workerScriptType,
      backend: this
    });
    this.disposeMessageListener = addWorkerMessageListener(
      this.worker,
      (event) => this.handleMessage(workerMessageData(event))
    );
    return this.worker;
  }

  handleMessage(message = {}) {
    const id = normalizeString(message.id, null);
    if (!id || !this.pending.has(id)) return;
    const pending = this.pending.get(id);
    if (message.type === 'resident-stage-result' || message.type === 'result') {
      clearTimeout(pending.timeout);
      this.pending.delete(id);
      pending.resolve(message.result);
      return;
    }
    if (message.type === 'resident-stage-error' || message.type === 'error') {
      clearTimeout(pending.timeout);
      this.pending.delete(id);
      pending.reject(new Error(message.error || 'resident stage worker failed'));
    }
  }

  runStage(args = {}) {
    const worker = this.ensureWorker();
    const id = `${this.requestIdPrefix}:${this.nextRequestOrdinal++}`;
    const payload = {
      stage: args.stage || null,
      stageIndex: args.stageIndex ?? null,
      input: args.input ?? null,
      lease: args.lease || null,
      lane: args.lane || null,
      context: args.context || {},
      executor: args.executor || null
    };
    const message = {
      type: 'run-resident-stage',
      id,
      payload
    };
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`resident stage worker timed out: ${id}`));
      }, this.timeoutMs);
      this.pending.set(id, { resolve, reject, timeout });
      worker.postMessage(message);
    });
  }

  dispose() {
    for (const [id, pending] of this.pending.entries()) {
      clearTimeout(pending.timeout);
      pending.reject(new Error(`resident stage worker disposed: ${id}`));
    }
    this.pending.clear();
    this.disposeMessageListener?.();
    this.disposeMessageListener = null;
    this.worker?.terminate?.();
    this.worker = null;
  }
}

export function createResidentStageWorkerBackend(options = {}) {
  return new ResidentStageWorkerBackend(options);
}

export class GPUHubManager {
  /**
   * @param {Object} config
   * @param {number} [config.frameBudgetMs]
   * @param {Map<string, any>} [config.hotStore]
   */
  constructor(config = {}) {
    this.frameBudgetMs = config.frameBudgetMs ?? 4;
    this.hotStore = config.hotStore || new Map();
    this.device = null;
    this.tasks = new Map();
    this.residentStageExecutors = new Map();
    this.residentStageExecutorAliases = new Map();
  }

  async initialize(options = {}) {
    if (options.device) {
      this.device = options.device;
      return this.device;
    }
    if (typeof navigator === 'undefined' || !navigator.gpu) {
      throw new Error('[GPUHubManager] WebGPU not available in this environment');
    }
    const adapter = await navigator.gpu.requestAdapter(options.adapterOptions);
    if (!adapter) {
      throw new Error('[GPUHubManager] Failed to acquire GPU adapter');
    }
    this.device = await adapter.requestDevice(options.deviceDescriptor);
    return this.device;
  }

  setDevice(device) {
    this.device = device;
  }

  getHotStore() {
    return this.hotStore;
  }

  registerHotBuffer(key, buffer) {
    this.hotStore.set(key, buffer);
  }

  registerHotBufferSet(taskId, buffers) {
    this.hotStore.set(taskId, buffers);
  }

  getHotBufferSet(taskId) {
    return this.hotStore.get(taskId);
  }

  getHotBuffer(key) {
    return this.hotStore.get(key);
  }

  createHotBuffer(key, size, usage, label) {
    if (!this.device) {
      throw new Error('[GPUHubManager] Device not initialized');
    }
    const buffer = this.device.createBuffer({
      size,
      usage,
      label
    });
    this.hotStore.set(key, buffer);
    return buffer;
  }

  removeHotBuffer(key) {
    this.hotStore.delete(key);
  }

  registerResidentStageExecutor(specOrStageId, executor = null) {
    const spec = typeof specOrStageId === 'string'
      ? { stageId: specOrStageId, executor }
      : { ...(specOrStageId || {}) };
    const stageId = normalizeString(spec.stageId ?? spec.id, null);
    if (!stageId) {
      throw new Error('[GPUHubManager] Resident stage executor requires a stageId');
    }
    const run = spec.executor || executor;
    const workerRunner = spec.workerRunner || spec.workerBackend || spec.workerPolicy?.workerRunner || null;
    if (typeof run !== 'function' && !workerRunner) {
      throw new Error(`[GPUHubManager] Resident stage executor must be a function: ${stageId}`);
    }
    const record = {
      schema: GPU_HUB_RESIDENT_STAGE_EXECUTOR_SCHEMA,
      stageId,
      lawNodeId: normalizeString(spec.lawNodeId, null),
      runtimeTarget: normalizeString(
        spec.runtimeTarget,
        workerRunner ? 'gpu-hub-resident-stage-worker' : 'gpu-hub-inline-stage-executor'
      ),
      executor: typeof run === 'function' ? run : null,
      workerRunner,
      workerPolicy: normalizeResidentStageWorkerPolicy({
        ...(spec.workerPolicy || spec.workerResidency || {}),
        workerReady: (spec.workerPolicy || spec.workerResidency || {}).workerReady || Boolean(workerRunner)
      }, stageId),
      metadata: cloneMetadata(spec.metadata || {}),
      registeredAt: Date.now()
    };
    this.residentStageExecutors.set(stageId, record);
    if (record.lawNodeId) this.residentStageExecutorAliases.set(record.lawNodeId, stageId);
    return this.describeResidentStageExecutor(stageId);
  }

  describeResidentStageExecutor(stageOrId) {
    const record = this.getResidentStageExecutorRecord(stageOrId);
    if (!record) return null;
    return {
      schema: record.schema,
      stageId: record.stageId,
      lawNodeId: record.lawNodeId,
      runtimeTarget: record.runtimeTarget,
      workerPolicy: cloneMetadata(record.workerPolicy),
      metadata: cloneMetadata(record.metadata || {}),
      registeredAt: record.registeredAt
    };
  }

  getResidentStageExecutorRecord(stageOrId) {
    const stageId = normalizeString(
      typeof stageOrId === 'string' ? stageOrId : stageOrId?.id ?? stageOrId?.stageId,
      null
    );
    const lawNodeId = normalizeString(typeof stageOrId === 'string' ? null : stageOrId?.lawNodeId, null);
    if (stageId && this.residentStageExecutors.has(stageId)) {
      return this.residentStageExecutors.get(stageId);
    }
    const alias = lawNodeId ? this.residentStageExecutorAliases.get(lawNodeId) : null;
    return alias ? this.residentStageExecutors.get(alias) : null;
  }

  hasResidentStageExecutor(stageOrId) {
    return Boolean(this.getResidentStageExecutorRecord(stageOrId));
  }

  listResidentStageExecutors() {
    return [...this.residentStageExecutors.keys()]
      .sort()
      .map((stageId) => this.describeResidentStageExecutor(stageId));
  }

  async executeResidentStage(args = {}) {
    const record = this.getResidentStageExecutorRecord(args.stage);
    if (!record) {
      const stageId = normalizeString(args.stage?.id ?? args.stage?.stageId, 'unknown');
      const err = new Error(`[GPUHubManager] Missing resident stage executor: ${stageId}`);
      err.code = 'ERR_GPU_HUB_RESIDENT_STAGE_EXECUTOR_MISSING';
      err.stage = args.stage || null;
      throw err;
    }
    const executionArgs = {
      ...args,
      gpuHub: this,
      device: this.device,
      executor: this.describeResidentStageExecutor(record.stageId)
    };
    if (record.workerRunner) {
      return executeWorkerRunner(record.workerRunner, executionArgs);
    }
    return record.executor(executionArgs);
  }

  registerTask(id, task) {
    this.tasks.set(id, task);
  }

  unregisterTask(id) {
    this.tasks.delete(id);
  }

  /**
   * Placeholder tick for shared-GPU tasks.
   * The caller should integrate this into the render loop.
   */
  tick() {
    // Intentionally minimal: scheduling is handled by the render loop.
  }
}
