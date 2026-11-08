import { WebGpuLadderCompute } from './webgpuLadderCompute.js';

export const PEERCOMPUTE_LADDER_RUNTIME_SCHEMA = 'peercompute.multiscale.peercompute.runtime.v0';

function resolveRuntimeModuleUrl(assetName) {
  const baseURI = globalThis.document?.baseURI;
  if (import.meta.env?.PROD && baseURI) {
    return new globalThis.URL(`./assets/${assetName}`, baseURI).href;
  }

  // Keep the development URL dynamic so Vite does not copy the unbundled
  // source module into production output alongside the stable Rollup entry.
  return new globalThis.URL(`./${assetName}`, import.meta.url).href;
}

export function resolvePeerComputeWorkerBootstrapUrl() {
  return resolveRuntimeModuleUrl('peercomputeComputeWorker.js');
}

function resolveDefaultTaskModuleUrl() {
  return resolveRuntimeModuleUrl('peercomputeLadderTasks.js');
}

const TASK_MODULE_URL = resolveDefaultTaskModuleUrl();
const DEFAULT_READBACK_INTERVAL = 3;
const MAX_READBACK_INTERVAL = 60;

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function normalizeReadbackInterval(value, fallback = DEFAULT_READBACK_INTERVAL) {
  const interval = Math.floor(Number(value));
  const base = Number.isFinite(interval) && interval > 0 ? interval : fallback;
  return Math.min(MAX_READBACK_INTERVAL, Math.max(1, base));
}

function createNoopManager() {
  throw new Error('ComputeManager factory was not provided');
}

export class PeerComputeLadderRuntime {
  constructor({
    count,
    seed = 1337,
    readbackInterval,
    readbackRingSize,
    manager = null,
    submitTask = null,
    getCapabilities = null,
    createManager = createNoopManager,
    moduleUrl = TASK_MODULE_URL,
    taskId = 'multiscale-ladder',
    affinityKey = taskId,
    scope = 'multiscale-compute',
    stateKey = taskId,
    layerIndex = 0,
    layerId = 'layer',
    shardIndex = 0,
    initialPositions = null,
    initialParticleRecords = null,
    emitCommitDelta = false
  } = {}) {
    this.config = {
      count,
      seed,
      readbackInterval,
      readbackRingSize,
      taskId,
      affinityKey,
      scope,
      stateKey,
      layerIndex,
      layerId,
      shardIndex,
      initialPositions,
      initialParticleRecords,
      emitCommitDelta
    };
    this.taskId = taskId;
    this.affinityKey = affinityKey;
    this.scope = scope;
    this.sharedManager = !!(manager || submitTask);
    this.createManager = createManager;
    this.manager = manager;
    this.submitTaskFn = submitTask;
    this.getCapabilitiesFn = getCapabilities;
    this.moduleUrl = moduleUrl;
    this.localCompute = new WebGpuLadderCompute(this.config);
    this.computeStatus = this.localCompute.getStatus();
    this.readbackInterval = this.computeStatus.readbackInterval || normalizeReadbackInterval(readbackInterval);
    this.readbackIntervalReason = this.computeStatus.readbackIntervalReason || 'initial';
    this.lastSnapshot = this.localCompute.lastSnapshot;
    this.initialized = false;
    this.usingLocalFallback = false;
    this.execution = 'initializing';
    this.lastError = null;
    this.pendingTask = false;
    this.pendingPromise = null;
    this.submittedTasks = 0;
    this.completedTasks = 0;
    this.failedTasks = 0;
  }

  async initialize() {
    if (this.initialized) return this.getStatus();
    this.initialized = true;

    try {
      if (!this.manager && !this.submitTaskFn) {
        this.manager = this.createManager();
      }
      if (!this.sharedManager) {
        await this.manager?.initialize?.();
      }
      const result = await this.submitTask({
        id: `${this.taskId}:init`,
        taskFamily: 'multiscale-ladder',
        affinityKey: this.affinityKey,
        module: this.moduleUrl,
        exportName: 'initLadderCompute',
        data: this.config,
        webgpu: { required: false }
      });
      this.applyTaskResult(result);
      this.config.initialPositions = null;
      this.config.initialParticleRecords = null;
      return this.getStatus();
    } catch (error) {
      await this.activateLocalFallback(error);
      return this.getStatus();
    }
  }

  step(input = {}) {
    const nextReadbackInterval = input?.readbackBudget?.readbackInterval ?? input?.readbackInterval;
    const normalizedReadbackInterval = nextReadbackInterval == null
      ? null
      : normalizeReadbackInterval(nextReadbackInterval, this.readbackInterval);
    if (normalizedReadbackInterval != null && normalizedReadbackInterval !== this.readbackInterval) {
      this.setReadbackInterval(nextReadbackInterval, input?.readbackReason || input?.readbackBudget?.reason || 'step-input');
    }
    if (this.usingLocalFallback) {
      const snapshot = this.localCompute.step(input);
      this.lastSnapshot = snapshot;
      this.computeStatus = this.localCompute.getStatus();
      return snapshot;
    }

    if ((!this.manager && !this.submitTaskFn) || this.pendingTask) {
      return this.lastSnapshot;
    }

    this.pendingTask = true;
    this.submittedTasks += 1;
    const taskId = `${this.taskId}:step:${this.submittedTasks}`;
    this.pendingPromise = this.submitTask({
      id: taskId,
      taskFamily: 'multiscale-ladder',
      affinityKey: this.affinityKey,
      module: this.moduleUrl,
      exportName: 'stepLadderCompute',
      data: {
        ...input,
        readbackInterval: this.readbackInterval,
        readbackReason: this.readbackIntervalReason,
        config: this.config
      },
      webgpu: { required: false }
    })
      .then((result) => {
        this.completedTasks += 1;
        this.applyTaskResult(result);
        return result;
      })
      .catch((error) => {
        this.failedTasks += 1;
        this.lastError = errorMessage(error);
        return this.activateLocalFallback(error, input);
      })
      .finally(() => {
        this.pendingTask = false;
      });

    return this.lastSnapshot;
  }

  submitTask(task) {
    if (this.submitTaskFn) return this.submitTaskFn(task);
    return this.manager.submitTask(task);
  }

  setReadbackInterval(readbackInterval, reason = 'runtime') {
    const next = normalizeReadbackInterval(readbackInterval, this.readbackInterval);
    if (next === this.readbackInterval) return this.getStatus();
    this.readbackInterval = next;
    this.readbackIntervalReason = reason;
    this.config.readbackInterval = this.readbackInterval;
    this.config.readbackReason = reason;
    if (this.localCompute?.setReadbackInterval) {
      this.computeStatus = this.localCompute.setReadbackInterval(this.readbackInterval, reason);
    } else if (this.computeStatus) {
      this.computeStatus = {
        ...this.computeStatus,
        readbackInterval: this.readbackInterval,
        readbackIntervalReason: reason
      };
    }
    return this.getStatus();
  }

  async whenIdle() {
    return this.pendingPromise || Promise.resolve(null);
  }

  applyTaskResult(result = {}) {
    if (result.status) {
      this.computeStatus = result.status;
    }
    if (result.snapshot) {
      this.lastSnapshot = result.snapshot;
    }
    this.execution = result.executionContext === 'dedicated-worker'
      ? 'peercompute-worker'
      : 'peercompute-inline';
    this.lastError = this.computeStatus?.lastError || null;
  }

  async activateLocalFallback(error, stepInput = null) {
    this.usingLocalFallback = true;
    this.execution = 'local-fallback';
    this.lastError = errorMessage(error);

    if (!this.localCompute.device && this.localCompute.backend === 'initializing') {
      await this.localCompute.initialize();
    }
    if (stepInput) {
      this.lastSnapshot = this.localCompute.step(stepInput);
    } else {
      this.lastSnapshot = this.localCompute.lastSnapshot;
    }
    this.computeStatus = {
      ...this.localCompute.getStatus(),
      lastError: this.localCompute.getStatus().lastError || this.lastError
    };
    return this.getStatus();
  }

  getStatus() {
    const capabilities = this.getCapabilitiesFn?.() || this.manager?.getCapabilities?.() || null;
    const computeStatus = this.computeStatus || {};
    return {
      ...computeStatus,
      lastError: computeStatus.lastError || this.lastError,
      peercompute: {
        schema: PEERCOMPUTE_LADDER_RUNTIME_SCHEMA,
        manager: (this.manager || this.submitTaskFn) ? 'peercompute-compute-manager' : 'local-fallback',
        taskModule: this.moduleUrl,
        execution: this.execution,
        workerCount: this.sharedManager ? 1 : (capabilities?.workers ?? 0),
        affinityKey: this.affinityKey,
        taskId: this.taskId,
        scope: this.scope,
        sharedManager: this.sharedManager,
        managerWorkerCount: capabilities?.workers ?? 0,
        capabilities,
        pendingTask: this.pendingTask,
        submittedTasks: this.submittedTasks,
        completedTasks: this.completedTasks,
        failedTasks: this.failedTasks,
        localFallback: this.usingLocalFallback
      }
    };
  }
}
