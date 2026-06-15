/**
 * @fileoverview GPUHubManager - Main-thread GPU hub for shared render+compute
 */

const GPU_HUB_RESIDENT_STAGE_EXECUTOR_SCHEMA = 'peercompute.gpu.resident-stage-executor.v0';

function normalizeString(value, fallback = null) {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function cloneMetadata(value) {
  return value == null ? null : JSON.parse(JSON.stringify(value));
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
    if (typeof run !== 'function') {
      throw new Error(`[GPUHubManager] Resident stage executor must be a function: ${stageId}`);
    }
    const record = {
      schema: GPU_HUB_RESIDENT_STAGE_EXECUTOR_SCHEMA,
      stageId,
      lawNodeId: normalizeString(spec.lawNodeId, null),
      runtimeTarget: normalizeString(spec.runtimeTarget, 'gpu-hub-inline-stage-executor'),
      executor: run,
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
    return record.executor({
      ...args,
      gpuHub: this,
      device: this.device,
      executor: this.describeResidentStageExecutor(record.stageId)
    });
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
