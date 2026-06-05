import { executeTaskPayload } from './taskRuntime.js';
import { SolverRegistry } from './SolverRegistry.js';

function createDefaultComputeWorker() {
  return new Worker(new URL('./computeWorker.js', import.meta.url), { type: 'module' });
}

const WORKER_HARD_CAP = 128;
export const COMPUTE_WORKER_UTILIZATION_SCHEMA = 'peercompute.compute.worker-utilization.v0';
export const COMPUTE_TASK_PLACEMENT_SCHEMA = 'peercompute.compute.task-placement.v0';
export const COMPUTE_REMOTE_PLACEMENT_PROVENANCE_SCHEMA = 'peercompute.compute.remote-placement-provenance.v0';
export const COMPUTE_REMOTE_PLACEMENT_VERIFICATION_SCHEMA = 'peercompute.compute.remote-placement-verification.v0';
export const COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA = 'peercompute.compute.remote-placement-validation.v0';
export const COMPUTE_REMOTE_PLACEMENT_RETRY_SCHEMA = 'peercompute.compute.remote-placement-retry.v0';
export const COMPUTE_REMOTE_TASK_ENVELOPE_SCHEMA = 'peercompute.compute.remote-task-envelope.v0';
export const COMPUTE_TASK_PACKET_SCHEMA = 'peercompute.compute.task-packet.v0';
export const COMPUTE_TASK_EXECUTION_SCHEMA = 'peercompute.compute.task-execution.v0';
const DEFAULT_PLACEMENT_RETRYABLE_ERROR_KINDS = ['timeout', 'executor-error'];
const TERMINAL_PLACEMENT_ERROR_KINDS = ['rejected', 'verification-failed', 'validation-failed'];
const GPU_LIMIT_KEYS = [
  'maxBufferSize',
  'maxStorageBufferBindingSize',
  'maxComputeWorkgroupStorageSize',
  'maxComputeInvocationsPerWorkgroup',
  'maxComputeWorkgroupsPerDimension'
];

function normalizeInteger(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeNumber(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function inferResourceTier({ cpuCores, deviceMemoryGB, gpuAvailable, declaredTier }) {
  if (declaredTier) return String(declaredTier);
  if (cpuCores >= 32 || deviceMemoryGB >= 64) return 'cluster';
  if (gpuAvailable && (cpuCores >= 12 || deviceMemoryGB >= 16)) return 'workstation';
  if (cpuCores <= 4 || (deviceMemoryGB && deviceMemoryGB <= 4)) return 'mobile';
  return 'laptop';
}

function defaultMemoryBudgetMB(tier) {
  if (tier === 'cluster') return 8192;
  if (tier === 'workstation') return 2048;
  if (tier === 'mobile') return 384;
  return 1024;
}

function defaultGpuMemoryBudgetMB(tier) {
  if (tier === 'cluster') return 4096;
  if (tier === 'workstation') return 1024;
  if (tier === 'mobile') return 192;
  return 512;
}

function estimateMemoryBudgetMB({ tier, deviceMemoryGB }) {
  const tierBudget = defaultMemoryBudgetMB(tier);
  if (!deviceMemoryGB) return tierBudget;
  const deviceBudget = deviceMemoryGB * 1024 * 0.25;
  return Math.max(128, Math.min(tierBudget, deviceBudget));
}

function normalizeGpuLimits(source = {}) {
  if (!source) return null;
  const raw = source.gpuLimits || source;
  const limits = {};
  for (const key of GPU_LIMIT_KEYS) {
    const value = normalizeInteger(raw[key], null, 0, Number.MAX_SAFE_INTEGER);
    if (value != null) limits[key] = value;
  }
  return Object.keys(limits).length > 0 ? limits : null;
}

function buildResourceProfile(config = {}, capabilities = {}) {
  const navigatorRef = typeof navigator !== 'undefined' ? navigator : null;
  const cpuCores = normalizeInteger(
    config.cpuCores ?? config.hardwareConcurrency ?? navigatorRef?.hardwareConcurrency,
    4,
    1,
    512
  );
  const deviceMemoryGB = normalizeNumber(
    config.deviceMemoryGB ?? config.deviceMemory ?? navigatorRef?.deviceMemory,
    null,
    0,
    2048
  );
  const gpuAvailable = config.gpuAvailable ?? capabilities.webgpu ?? !!navigatorRef?.gpu;
  const tier = inferResourceTier({
    cpuCores,
    deviceMemoryGB: deviceMemoryGB ?? 0,
    gpuAvailable,
    declaredTier: config.tier || config.deviceClass
  });
  const memoryBudgetMB = normalizeNumber(
    config.memoryBudgetMB ?? config.ramBudgetMB,
    estimateMemoryBudgetMB({ tier, deviceMemoryGB }),
    0,
    1048576
  );
  const gpuMemoryBudgetMB = normalizeNumber(
    config.gpuMemoryBudgetMB ?? config.gpuBudgetMB ?? config.vramBudgetMB,
    gpuAvailable ? defaultGpuMemoryBudgetMB(tier) : 0,
    0,
    1048576
  );
  const budgetScale = normalizeNumber(
    config.budgetScale ?? config.resourceBudgetScale ?? config.computeScale,
    1,
    0.05,
    64
  );
  const gpuLimits = normalizeGpuLimits(config.gpuLimits || {
    maxBufferSize: config.gpuMaxBufferSize ?? config.maxBufferSize,
    maxStorageBufferBindingSize: config.gpuMaxStorageBufferBindingSize ?? config.maxStorageBufferBindingSize,
    maxComputeWorkgroupStorageSize: config.gpuMaxComputeWorkgroupStorageSize ?? config.maxComputeWorkgroupStorageSize,
    maxComputeInvocationsPerWorkgroup: config.gpuMaxComputeInvocationsPerWorkgroup ?? config.maxComputeInvocationsPerWorkgroup,
    maxComputeWorkgroupsPerDimension: config.gpuMaxComputeWorkgroupsPerDimension ?? config.maxComputeWorkgroupsPerDimension
  });

  return {
    schema: 'peercompute.compute.resource-profile.v0',
    tier,
    cpuCores,
    deviceMemoryGB,
    memoryBudgetMB,
    gpuMemoryBudgetMB,
    budgetScale,
    gpuLimits,
    gpuLimitsSource: gpuLimits ? (config.gpuLimitsSource || 'configured') : null,
    gpuAvailable: !!gpuAvailable,
    wasmAvailable: !!capabilities.wasm,
    source: config.source || (config.tier ? 'configured' : 'browser')
  };
}

function recommendedWorkerCount(profile) {
  const cores = profile.cpuCores || 4;
  if (profile.tier === 'cluster') return Math.min(64, Math.max(8, cores));
  if (profile.tier === 'workstation') return Math.min(16, Math.max(4, cores));
  if (profile.tier === 'mobile') return Math.min(2, Math.max(1, cores));
  return Math.min(8, Math.max(2, Math.floor(cores * 0.75)));
}

function buildWorkerPolicy(config = {}, profile) {
  const configuredMax = normalizeInteger(config.maxWorkers, null, 1, WORKER_HARD_CAP);
  const recommended = recommendedWorkerCount(profile);
  const maxWorkers = configuredMax ?? Math.min(WORKER_HARD_CAP, Math.max(recommended, profile.cpuCores || recommended));
  const minWorkers = normalizeInteger(config.minWorkers, Math.min(maxWorkers, profile.tier === 'mobile' ? 1 : 2), 0, maxWorkers);
  const targetWorkers = normalizeInteger(
    config.targetWorkers ?? config.initialWorkers,
    Math.min(maxWorkers, Math.max(minWorkers, recommended)),
    minWorkers,
    maxWorkers
  );

  return {
    schema: 'peercompute.compute.worker-policy.v0',
    autoScale: config.autoScaleWorkers !== false,
    minWorkers,
    targetWorkers,
    maxWorkers,
    scaleUpQueueDepth: normalizeInteger(config.scaleUpQueueDepth, 1, 1, 1024),
    idleScaleDownMs: normalizeInteger(config.idleScaleDownMs, 5000, 0, 600000)
  };
}

function workerScaleForTier(tier) {
  if (tier === 'cluster') return 4;
  if (tier === 'workstation') return 2;
  if (tier === 'mobile') return 0.5;
  return 1;
}

function preferredShardsPerLayer(tier) {
  if (tier === 'cluster') return 4;
  if (tier === 'workstation') return 2;
  return 1;
}

function baselineWorkerCount(tier) {
  if (tier === 'cluster') return 64;
  if (tier === 'workstation') return 16;
  if (tier === 'mobile') return 2;
  return 8;
}

function clampScale(value, fallback = 1) {
  return normalizeNumber(value, fallback, 0.25, 8);
}

function isManualWorkerResizeReason(reason) {
  const value = String(reason || '');
  return value === 'manual' || value === 'demo-api' || value.startsWith('manual-') || value.startsWith('user-');
}

function roundToMultiple(value, multiple) {
  const safeMultiple = Math.max(1, multiple);
  return Math.max(safeMultiple, Math.round(value / safeMultiple) * safeMultiple);
}

function nowMs() {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
}

function sleepMs(delayMs) {
  const ms = Math.max(0, Number(delayMs) || 0);
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeEmptyRuntimeStats() {
  return {
    submitted: 0,
    completed: 0,
    failed: 0,
    averageDurationMs: 0,
    lastDurationMs: 0,
    maxDurationMs: 0,
    totalDurationMs: 0
  };
}

function makeEmptyPlacementStats() {
  return {
    submitted: 0,
    attempted: 0,
    completed: 0,
    failed: 0,
    retried: 0,
    retryExhausted: 0,
    timedOut: 0,
    rejected: 0,
    verificationFailed: 0,
    validationFailed: 0
  };
}

function normalizeStringList(value, fallback = []) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry || '').trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map((entry) => entry.trim()).filter(Boolean);
  }
  return [...fallback];
}

function placementExecutorId(executor) {
  if (!executor) return null;
  if (typeof executor === 'function') return executor.placementExecutorId || executor.id || executor.name || 'placement-executor';
  return executor.id || executor.name || executor.constructor?.name || 'placement-executor';
}

function placementAdmissionId(admission) {
  if (!admission) return null;
  if (typeof admission === 'function') return admission.placementAdmissionId || admission.id || admission.name || 'placement-admission';
  return admission.id || admission.name || admission.constructor?.name || 'placement-admission';
}

function placementResultValidatorId(validator) {
  if (!validator) return null;
  if (typeof validator === 'function') return validator.placementResultValidatorId || validator.id || validator.name || 'placement-result-validator';
  return validator.id || validator.name || validator.constructor?.name || 'placement-result-validator';
}

function placementTaskSignerId(signer) {
  if (!signer) return null;
  if (typeof signer === 'function') return signer.placementTaskSignerId || signer.id || signer.name || 'placement-task-signer';
  return signer.id || signer.name || signer.constructor?.name || 'placement-task-signer';
}

function normalizeRemoteReplicaSummaries(value) {
  const list = Array.isArray(value) ? value : [];
  return list.slice(0, 64).map((entry, index) => {
    const raw = entry && typeof entry === 'object' ? entry : { value: entry };
    return {
      schema: raw.schema || null,
      role: raw.role || null,
      index,
      peerId: raw.peerId || raw.remotePeerId || null,
      remotePeerId: raw.remotePeerId || raw.peerId || null,
      targetPeerId: raw.targetPeerId || null,
      transportPeerId: raw.transportPeerId || null,
      responderNodeId: raw.responderNodeId || null,
      responderPeerId: raw.responderPeerId || null,
      clusterId: raw.clusterId || null,
      workerId: raw.workerId || raw.remoteWorkerId || null,
      remoteExecution: raw.remoteExecution && typeof raw.remoteExecution === 'object'
        ? JSON.parse(JSON.stringify(raw.remoteExecution))
        : null,
      executorId: raw.executorId || null,
      codeHash: raw.codeHash || null,
      inputHash: raw.inputHash || null,
      taskHash: raw.taskHash || null,
      outputHash: raw.outputHash || raw.resultHash || null,
      resultHash: raw.resultHash || raw.outputHash || null,
      commitDeltaHash: raw.commitDeltaHash || raw.deltaHash || null,
      resultSchema: raw.resultSchema || raw.schema || null,
      validated: raw.validated === true || raw.valid === true,
      ok: raw.ok !== false && raw.accepted !== false && raw.valid !== false,
      promoted: raw.promoted === true,
      usedAsCommitSource: raw.usedAsCommitSource === true,
      errorCode: raw.errorCode || null,
      errorMessage: raw.errorMessage || null,
      durationMs: Number.isFinite(Number(raw.durationMs)) ? Number(Number(raw.durationMs).toFixed(3)) : null
    };
  });
}

function stableTaskValue(value) {
  if (value == null) return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : String(value);
  if (typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'bigint') return `${value.toString()}n`;
  if (typeof value === 'function') return `[Function:${value.name || 'anonymous'}]`;
  if (ArrayBuffer.isView(value)) {
    return {
      typedArray: value.constructor?.name || 'TypedArray',
      values: Array.from(value)
    };
  }
  if (value instanceof ArrayBuffer) {
    return {
      arrayBufferBytes: Array.from(new Uint8Array(value))
    };
  }
  if (Array.isArray(value)) return value.map(stableTaskValue);
  if (typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      if (key === 'taskPacket') continue;
      if (key === 'taskEnvelope') continue;
      const entry = stableTaskValue(value[key]);
      if (entry !== undefined) out[key] = entry;
    }
    return out;
  }
  return String(value);
}

function stableSerialize(value) {
  return JSON.stringify(stableTaskValue(value));
}

function hashString(value) {
  const input = String(value ?? '');
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a32-${hash.toString(16).padStart(8, '0')}`;
}

function makeEmptyExecutorStats({ executorId, kind = 'worker', ordinal = null, status = 'active' } = {}) {
  return {
    executorId,
    kind,
    ordinal,
    status,
    activeTaskCount: 0,
    submitted: 0,
    completed: 0,
    failed: 0,
    abandoned: 0,
    averageDurationMs: 0,
    lastDurationMs: 0,
    maxDurationMs: 0,
    totalDurationMs: 0,
    lastRuntime: null,
    lastTaskFamily: null,
    lastStartedAt: null,
    lastCompletedAt: null,
    byRuntime: {},
    byTaskFamily: {}
  };
}

/**
 * @fileoverview Compute Manager - Manages distributed compute tasks
 * Coordinates task distribution, execution, and result aggregation
 * Runs as a worker thread under the Node Kernel
 */

/**
 * ComputeManager class - Handles compute task distribution and execution
 * Manages CPU and WebGPU compute workers
 */
export class ComputeManager {
  /**
   * @param {Object} config - Compute configuration
   * @param {boolean} config.enableWebGPU - Enable WebGPU acceleration
   * @param {number} config.maxWorkers - Maximum number of compute workers
   * @param {boolean} config.enableWorkers - Allow spawning Web Workers (browser environments)
   */
  constructor(config = {}) {
    const defaultWorkers = typeof navigator !== 'undefined' && navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency
      : 4;
    const hasWebGPU = typeof navigator !== 'undefined' && !!navigator.gpu;
    const hasWasm = typeof WebAssembly !== 'undefined';
    this.workerPolicyOverrides = {
      minWorkers: config.minWorkers,
      targetWorkers: config.targetWorkers,
      initialWorkers: config.initialWorkers,
      maxWorkers: config.maxWorkers,
      autoScaleWorkers: config.autoScaleWorkers,
      scaleUpQueueDepth: config.scaleUpQueueDepth,
      idleScaleDownMs: config.idleScaleDownMs
    };
    this.resourceProfile = buildResourceProfile(config.resourceProfile || config, {
      wasm: hasWasm,
      webgpu: hasWebGPU
    });
    this.workerPolicy = buildWorkerPolicy(this.workerPolicyOverrides, this.resourceProfile);
    this.config = {
      enableWebGPU: config.enableWebGPU || false,
      enableWorkers: config.enableWorkers !== false,
      minWorkers: this.workerPolicy.minWorkers,
      targetWorkers: this.workerPolicy.targetWorkers,
      maxWorkers: this.workerPolicy.maxWorkers || defaultWorkers,
      autoScaleWorkers: this.workerPolicy.autoScale,
      ...config
    };
    this.config.minWorkers = this.workerPolicy.minWorkers;
    this.config.targetWorkers = this.workerPolicy.targetWorkers;
    this.config.maxWorkers = this.workerPolicy.maxWorkers;
    this.config.autoScaleWorkers = this.workerPolicy.autoScale;

    this.workers = [];
    this.taskQueue = [];
    this.activeTasks = new Map();
    this.workerAffinities = new Map();
    this.workerIds = new WeakMap();
    this.workerUtilization = new Map();
    this.nextWorkerOrdinal = 1;
    this.inlineExecutorId = 'inline';
    this.workerUtilization.set(this.inlineExecutorId, makeEmptyExecutorStats({
      executorId: this.inlineExecutorId,
      kind: 'inline',
      ordinal: 0,
      status: 'active'
    }));
    this.solverRegistry = new SolverRegistry(config.solvers || []);
    this.targetWorkerCount = this.workerPolicy.targetWorkers;
    this.workerSpawnFailures = 0;
    this.workerRetirements = 0;
    this.workerPoolRevision = 0;
    this.workerResizeHistory = [];
    this.placementExecutor = typeof config.placementExecutor === 'function' || config.placementExecutor?.submitTask
      ? config.placementExecutor
      : null;
    this.placementExecutorId = config.placementExecutorId || placementExecutorId(this.placementExecutor);
    this.placementAdmission = typeof config.placementAdmission === 'function' || config.placementAdmission?.admitTask
      ? config.placementAdmission
      : null;
    this.placementAdmissionId = config.placementAdmissionId || placementAdmissionId(this.placementAdmission);
    this.placementResultValidator = typeof config.placementResultValidator === 'function'
      || config.placementResultValidator?.validateTaskResult
      || config.placementResultValidator?.validateResult
      ? config.placementResultValidator
      : null;
    this.placementResultValidatorId = config.placementResultValidatorId || placementResultValidatorId(this.placementResultValidator);
    this.placementTaskSigner = typeof config.placementTaskSigner === 'function'
      || config.placementTaskSigner?.signTaskPacket
      || config.placementTaskSigner?.signEnvelope
      || config.remoteTaskSigner
      ? (config.placementTaskSigner || config.remoteTaskSigner)
      : null;
    this.placementTaskSignerId = config.placementTaskSignerId
      || config.remoteTaskSignerId
      || placementTaskSignerId(this.placementTaskSigner);
    this.placementTimeoutMs = normalizeInteger(
      config.placementTimeoutMs ?? config.remotePlacementTimeoutMs,
      30000,
      0,
      3600000
    );
    this.remoteResultVerification = config.remoteResultVerification !== false
      && config.placementResultVerification !== false;
    this.placementRetryPolicy = {
      schema: COMPUTE_REMOTE_PLACEMENT_RETRY_SCHEMA,
      maxAttempts: normalizeInteger(
        config.placementMaxAttempts ?? config.remotePlacementMaxAttempts,
        1,
        1,
        100
      ),
      baseDelayMs: normalizeInteger(
        config.placementRetryBaseDelayMs ?? config.remotePlacementRetryBaseDelayMs,
        50,
        0,
        600000
      ),
      maxDelayMs: normalizeInteger(
        config.placementRetryMaxDelayMs ?? config.remotePlacementRetryMaxDelayMs,
        1000,
        0,
        600000
      ),
      jitterFraction: normalizeNumber(
        config.placementRetryJitterFraction ?? config.remotePlacementRetryJitterFraction,
        0,
        0,
        1
      ),
      retryableErrorKinds: normalizeStringList(
        config.placementRetryableErrorKinds ?? config.remotePlacementRetryableErrorKinds,
        DEFAULT_PLACEMENT_RETRYABLE_ERROR_KINDS
      ),
      terminalErrorKinds: [...TERMINAL_PLACEMENT_ERROR_KINDS]
    };
    this.manualWorkerAutoScaleCooldownMs = normalizeInteger(
      config.manualWorkerAutoScaleCooldownMs ?? config.workerResizeCooldownMs,
      4000,
      0,
      600000
    );
    this.workerAutoScaleHoldUntil = 0;
    this.workerAutoScaleHoldReason = null;
    this.lastWorkerResize = {
      schema: 'peercompute.compute.worker-resize.v0',
      revision: 0,
      reason: 'initial',
      previousTargetWorkers: this.targetWorkerCount,
      targetWorkers: this.targetWorkerCount,
      previousWorkerCount: 0,
      workerCount: 0,
      changed: false,
      timestamp: null
    };
    this.stats = {
      schema: 'peercompute.compute.manager-stats.v0',
      totalTasksSubmitted: 0,
      totalTasksCompleted: 0,
      totalTasksFailed: 0,
      inlineTasksCompleted: 0,
      workerTasksCompleted: 0,
      remoteTasksCompleted: 0,
      remoteTasksFailed: 0,
      remoteTasksTimedOut: 0,
      remoteTasksRejected: 0,
      remoteTasksVerificationFailed: 0,
      remoteTasksValidationFailed: 0,
      remoteTaskAttempts: 0,
      remoteTasksRetried: 0,
      remoteTasksRetryExhausted: 0,
      totalTaskDurationMs: 0,
      averageTaskDurationMs: 0,
      lastTaskDurationMs: 0,
      minTaskDurationMs: null,
      maxTaskDurationMs: 0,
      lastCompletedAt: null,
      byRuntime: {},
      byTaskFamily: {},
      taskPlacement: {
        schema: COMPUTE_TASK_PLACEMENT_SCHEMA,
        totalSubmitted: 0,
        totalCompleted: 0,
        totalFailed: 0,
        localSubmitted: 0,
        remoteRequested: 0,
        remoteExecuted: 0,
        remoteFailed: 0,
        remoteTimedOut: 0,
        remoteRejected: 0,
        remoteVerificationFailed: 0,
        remoteValidationFailed: 0,
        remoteAttempts: 0,
        remoteRetried: 0,
        remoteRetryExhausted: 0,
        lastPlacement: null,
        lastRemotePlacement: null,
        byRecommendedPlacement: {},
        byActualPlacement: {}
      }
    };
    this.scaleDownTimer = null;
    this.commitDeltaHandler = null;
    this.capabilities = {
      cpu: true,
      wasm: hasWasm,
      webgpu: hasWebGPU,
      wasmWebgpu: hasWasm && hasWebGPU
    };
    this.initialized = false;
    this.workerBootstrapURL = config.workerBootstrapURL
      || config.computeWorkerBootstrapURL
      || config.workerScriptURL
      || config.workerScriptUrl
      || null;
  }

  /**
   * Register a handler to commit CPU deltas to DataState
   * @param {Function} handler
   */
  setCommitDeltaHandler(handler) {
    this.commitDeltaHandler = handler;
  }

  commitDelta(delta) {
    if (!this.commitDeltaHandler) return;
    this.commitDeltaHandler(delta);
  }

  /**
   * Initialize compute manager and spawn compute workers
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) return;
    this.initialized = true;

    if (!this._supportsWorkers()) {
      console.warn('[ComputeManager] Web Workers not available; falling back to inline execution');
      return;
    }

    const count = normalizeInteger(this.targetWorkerCount, this.workerPolicy.targetWorkers, 0, this.workerPolicy.maxWorkers);
    for (let i = 0; i < count; i += 1) {
      if (!this._spawnWorker()) break;
    }

    if (this.workers.length === 0) {
      console.warn('[ComputeManager] Worker bootstrap failed; falling back to inline execution');
    }
  }

  async refreshGpuLimits() {
    if (typeof navigator === 'undefined' || !navigator.gpu?.requestAdapter) {
      return this.getResourceProfile();
    }
    let adapter = null;
    try {
      adapter = await navigator.gpu.requestAdapter();
    } catch {
      return this.getResourceProfile();
    }
    const gpuLimits = normalizeGpuLimits(adapter?.limits);
    if (!gpuLimits) return this.getResourceProfile();

    this.resourceProfile = buildResourceProfile({
      ...this.resourceProfile,
      gpuAvailable: true,
      gpuLimits,
      gpuLimitsSource: 'adapter',
      source: this.resourceProfile.source || 'browser'
    }, this.capabilities);
    this.workerPolicy = buildWorkerPolicy(this.workerPolicyOverrides, this.resourceProfile);
    this.config.minWorkers = this.workerPolicy.minWorkers;
    this.config.targetWorkers = this.workerPolicy.targetWorkers;
    this.config.maxWorkers = this.workerPolicy.maxWorkers;
    this.config.autoScaleWorkers = this.workerPolicy.autoScale;
    return this.getResourceProfile();
  }

  /**
   * Submit a compute task
   * @param {Object} task - Task definition
   * @param {string} task.id - Unique task ID
   * @param {Object} task.data - Task input data (structured cloneable)
   * @param {Function} task.fn - Inline function to run (will be serialized)
   * @param {string} task.module - Module URL to import inside the worker
   * @param {string} task.exportName - Exported function name in module (defaults to 'default')
   * @returns {Promise<any>} Task result
   */
  async submitTask(task) {
    if (!task) throw new Error('Task is required');

    const runtime = typeof task.runtime === 'string'
      ? task.runtime.trim().toLowerCase()
      : task.wasm
        ? (task.hostModule || task.module ? 'wasm-webgpu' : 'wasm')
        : 'js';

    if (runtime === 'js' && !task.fn && !task.module) {
      throw new Error('JavaScript tasks must provide fn or module');
    }
    if ((runtime === 'wasm' || runtime === 'wasm-webgpu') && !(task.wasm?.source || task.wasmSource || task.source)) {
      throw new Error(`${runtime} tasks must provide wasm.source`);
    }
    if (runtime === 'wasm-webgpu' && !(task.hostModule || task.module)) {
      throw new Error('wasm-webgpu tasks must provide hostModule or module');
    }

    const idSource = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;
    const id = task.id || idSource;
    const runtimeStats = this._runtimeStats(runtime);
    runtimeStats.submitted += 1;
    this.stats.totalTasksSubmitted += 1;
    const taskFamily = this._normalizeTaskFamily(task, runtime);
    const taskFamilyStats = this._taskFamilyStats(taskFamily);
    taskFamilyStats.submitted += 1;
    const placement = this._normalizeTaskPlacement(task, { runtime, taskFamily });
    this._recordPlacementSubmitted(placement);
    const payload = {
      id,
      runtime,
      taskFamily,
      solverId: task.solverId,
      placement,
      data: task.data ?? null,
      fn: task.fn ? task.fn.toString() : undefined,
      module: task.module,
      hostModule: task.hostModule,
      exportName: task.exportName || 'default',
      hostExport: task.hostExport,
      wasm: task.wasm,
      wasmSource: task.wasmSource,
      source: task.source,
      args: task.args,
      webgpu: task.webgpu,
      suppressCommitDelta: task.suppressCommitDelta === true || task.commitDelta === false,
      returnEnvelope: task.returnEnvelope === true || task.returnRawResult === true,
      affinityKey: task.affinityKey || task.workerKey || task.data?.affinityKey || task.data?.stateKey
    };

    if (!this.initialized) {
      await this.initialize();
    }
    this._ensureTargetWorkers({ reason: 'task-demand' });

    return new Promise((resolve, reject) => {
      const wrapped = {
        id,
        payload,
        resolve,
        reject,
        submittedAt: nowMs(),
        runtime,
        taskFamily,
        placement
      };
      if (this._dispatchToPlacementExecutor(wrapped)) return;
      if (this._dispatchToWorker(wrapped)) return;
      this.taskQueue.push(wrapped);
      this._maybeScaleForQueue();
      this._scheduleNext();
    });
  }

  getResourceProfile() {
    return { ...this.resourceProfile };
  }

  getWorkerPolicy() {
    return {
      ...this.workerPolicy,
      targetWorkers: this.targetWorkerCount
    };
  }

  setResourceProfile(profile = {}) {
    this.resourceProfile = buildResourceProfile(profile, this.capabilities);
    this.workerPolicy = buildWorkerPolicy(this.workerPolicyOverrides, this.resourceProfile);
    this.config.minWorkers = this.workerPolicy.minWorkers;
    this.config.targetWorkers = this.workerPolicy.targetWorkers;
    this.config.maxWorkers = this.workerPolicy.maxWorkers;
    this.config.autoScaleWorkers = this.workerPolicy.autoScale;
    return this.resizeWorkers(this.workerPolicy.targetWorkers, { reason: 'resource-profile-update' });
  }

  resizeWorkers(targetCount, { reason = 'manual' } = {}) {
    const previousTargetWorkers = this.targetWorkerCount;
    const previousWorkerCount = this.workers.length;
    const nextTarget = normalizeInteger(
      targetCount,
      this.targetWorkerCount,
      this.workerPolicy.minWorkers,
      this.workerPolicy.maxWorkers
    );
    this.targetWorkerCount = nextTarget;
    if (isManualWorkerResizeReason(reason)) {
      this._holdWorkerAutoScale(reason);
    }

    if (!this.initialized || !this._supportsWorkers()) {
      this._recordWorkerResize({
        reason,
        previousTargetWorkers,
        previousWorkerCount
      });
      return this.getCapabilities();
    }

    while (this.workers.length < this.targetWorkerCount) {
      if (!this._spawnWorker()) break;
    }

    this._retireIdleWorkers(reason);
    this._scheduleNext();
    this._recordWorkerResize({
      reason,
      previousTargetWorkers,
      previousWorkerCount
    });
    return this.getCapabilities();
  }

  estimateWorkloadBudget({
    itemName = 'items',
    baseItems = 4096,
    minItems = 1024,
    maxItems = 65536,
    itemStrideBytes = 0,
    memoryFraction = 0.25,
    layerCount = 1,
    maxShardsPerLayer = 8
  } = {}) {
    const workerCount = Math.max(1, this.targetWorkerCount || this.workerPolicy.targetWorkers || 1);
    const safeLayerCount = normalizeInteger(layerCount, 1, 1, 1024);
    const preferredShards = preferredShardsPerLayer(this.resourceProfile.tier);
    const workerBoundShards = Math.max(1, Math.floor(workerCount / safeLayerCount));
    const shardsPerLayer = normalizeInteger(
      Math.min(preferredShards, workerBoundShards),
      1,
      1,
      Math.max(1, maxShardsPerLayer)
    );
    const scale = workerScaleForTier(this.resourceProfile.tier);
    const workerScale = clampScale(workerCount / baselineWorkerCount(this.resourceProfile.tier));
    const memoryBudgetMB = normalizeNumber(this.resourceProfile.memoryBudgetMB, defaultMemoryBudgetMB(this.resourceProfile.tier), 0, 1048576);
    const gpuMemoryBudgetMB = normalizeNumber(this.resourceProfile.gpuMemoryBudgetMB, 0, 0, 1048576);
    const memoryScale = clampScale(memoryBudgetMB / defaultMemoryBudgetMB(this.resourceProfile.tier));
    const gpuScale = this.resourceProfile.gpuAvailable
      ? clampScale(gpuMemoryBudgetMB / Math.max(1, defaultGpuMemoryBudgetMB(this.resourceProfile.tier)))
      : 0.75;
    const explicitScale = normalizeNumber(this.resourceProfile.budgetScale, 1, 0.05, 64);
    const budgetScale = clampScale(Math.min(workerScale, memoryScale, gpuScale) * explicitScale);
    const safeStrideBytes = normalizeInteger(itemStrideBytes, 0, 0, 1048576);
    const safeMemoryFraction = normalizeNumber(memoryFraction, 0.25, 0.01, 1);
    const memoryMaxItems = safeStrideBytes > 0 && memoryBudgetMB > 0
      ? Math.max(minItems, Math.floor((memoryBudgetMB * 1024 * 1024 * safeMemoryFraction) / safeStrideBytes))
      : maxItems;
    const gpuBufferLimitBytes = safeStrideBytes > 0 && this.resourceProfile.gpuLimits
      ? Math.min(
        normalizeInteger(this.resourceProfile.gpuLimits.maxBufferSize, Number.MAX_SAFE_INTEGER, 0),
        normalizeInteger(this.resourceProfile.gpuLimits.maxStorageBufferBindingSize, Number.MAX_SAFE_INTEGER, 0)
      )
      : Number.MAX_SAFE_INTEGER;
    const gpuMaxItems = Number.isFinite(gpuBufferLimitBytes) && gpuBufferLimitBytes > 0 && safeStrideBytes > 0
      ? Math.max(minItems, Math.floor((gpuBufferLimitBytes * safeMemoryFraction) / safeStrideBytes))
      : maxItems;
    const effectiveMaxItems = Math.max(minItems, Math.min(maxItems, memoryMaxItems, gpuMaxItems));
    const itemCount = normalizeInteger(
      roundToMultiple(baseItems * scale * budgetScale, 256),
      baseItems,
      minItems,
      effectiveMaxItems
    );
    const scaleInputs = { workers: workerScale, memory: memoryScale, gpu: gpuScale, explicit: explicitScale };
    const limitingFactor = Object.entries(scaleInputs)
      .sort((a, b) => a[1] - b[1])[0]?.[0] || 'workers';

    return {
      schema: 'peercompute.compute.workload-budget.v0',
      itemName,
      itemCount,
      minItems,
      maxItems,
      effectiveMaxItems,
      itemStrideBytes: safeStrideBytes,
      workerCount,
      shardsPerLayer,
      layerCount: safeLayerCount,
      plannedWorkerTasks: safeLayerCount * shardsPerLayer,
      capacity: {
        schema: 'peercompute.compute.capacity-budget.v0',
        budgetScale,
        limitingFactor,
        workerScale,
        memoryScale,
        gpuScale,
        explicitScale,
        memoryBudgetMB,
        gpuMemoryBudgetMB,
        memoryFraction: safeMemoryFraction,
        memoryMaxItems,
        gpuMaxItems,
        gpuLimits: this.resourceProfile.gpuLimits ? { ...this.resourceProfile.gpuLimits } : null
      },
      resourceProfile: this.getResourceProfile(),
      workerPolicy: this.getWorkerPolicy()
    };
  }

  registerSolver(descriptor) {
    return this.solverRegistry.register(descriptor);
  }

  unregisterSolver(id) {
    return this.solverRegistry.unregister(id);
  }

  getSolver(id) {
    return this.solverRegistry.get(id);
  }

  listSolvers() {
    return this.solverRegistry.list();
  }

  submitSolverTask(solverId, input = {}) {
    const task = this.solverRegistry.createTask(solverId, input);
    return this.submitTask(task);
  }

  /**
   * Distribute task across multiple nodes
   * @param {Object} task - Task to distribute
   * @param {Array<string>} targetNodes - Node IDs to distribute to
   * @returns {Promise<Array>} Results from all nodes
   */
  async distributeTask(task, targetNodes) {
    // TODO: Split task into subtasks
    // TODO: Distribute to network nodes via NetworkManager
    // TODO: Collect results
    // TODO: Aggregate results
  }

  /**
   * Cancel a running task
   * @param {string} taskId - Task ID to cancel
   * @returns {Promise<void>}
   */
  async cancelTask(taskId) {
    // TODO: Find task in active tasks
    // TODO: Terminate worker executing task
    // TODO: Clean up resources
  }

  /**
   * Configure or clear remote placement hooks after construction.
   *
   * This intentionally does not make advisory placement hints executable by
   * itself; tasks still need a non-advisory peer/cluster placement hint before
   * they can leave the local worker/inline path.
   *
   * @param {Object} config - Placement hook configuration.
   * @returns {Object} Updated capability report.
   */
  configurePlacementHooks(config = {}) {
    const has = (key) => Object.prototype.hasOwnProperty.call(config, key);
    const firstConfigured = (...keys) => {
      for (const key of keys) {
        if (has(key)) return { found: true, value: config[key] };
      }
      return { found: false, value: undefined };
    };

    const executor = firstConfigured('placementExecutor', 'remotePlacementExecutor', 'executor');
    if (executor.found) {
      this.placementExecutor = typeof executor.value === 'function' || executor.value?.submitTask
        ? executor.value
        : null;
      this.placementExecutorId = config.placementExecutorId
        || config.remotePlacementExecutorId
        || config.executorId
        || placementExecutorId(this.placementExecutor);
    } else if (has('placementExecutorId') || has('remotePlacementExecutorId') || has('executorId')) {
      this.placementExecutorId = config.placementExecutorId
        || config.remotePlacementExecutorId
        || config.executorId
        || placementExecutorId(this.placementExecutor);
    }

    const admission = firstConfigured('placementAdmission', 'remotePlacementAdmission', 'admission');
    if (admission.found) {
      this.placementAdmission = typeof admission.value === 'function' || admission.value?.admitTask
        ? admission.value
        : null;
      this.placementAdmissionId = config.placementAdmissionId
        || config.remotePlacementAdmissionId
        || config.admissionId
        || placementAdmissionId(this.placementAdmission);
    } else if (has('placementAdmissionId') || has('remotePlacementAdmissionId') || has('admissionId')) {
      this.placementAdmissionId = config.placementAdmissionId
        || config.remotePlacementAdmissionId
        || config.admissionId
        || placementAdmissionId(this.placementAdmission);
    }

    const resultValidator = firstConfigured(
      'placementResultValidator',
      'remotePlacementResultValidator',
      'resultValidator',
      'validator'
    );
    if (resultValidator.found) {
      this.placementResultValidator = typeof resultValidator.value === 'function'
        || resultValidator.value?.validateTaskResult
        || resultValidator.value?.validateResult
        ? resultValidator.value
        : null;
      this.placementResultValidatorId = config.placementResultValidatorId
        || config.remotePlacementResultValidatorId
        || config.resultValidatorId
        || config.validatorId
        || placementResultValidatorId(this.placementResultValidator);
    } else if (
      has('placementResultValidatorId')
      || has('remotePlacementResultValidatorId')
      || has('resultValidatorId')
      || has('validatorId')
    ) {
      this.placementResultValidatorId = config.placementResultValidatorId
        || config.remotePlacementResultValidatorId
        || config.resultValidatorId
        || config.validatorId
        || placementResultValidatorId(this.placementResultValidator);
    }

    const signer = firstConfigured('placementTaskSigner', 'remoteTaskSigner', 'taskSigner', 'signer');
    if (signer.found) {
      this.placementTaskSigner = typeof signer.value === 'function'
        || signer.value?.signTaskPacket
        || signer.value?.signEnvelope
        ? signer.value
        : null;
      this.placementTaskSignerId = config.placementTaskSignerId
        || config.remoteTaskSignerId
        || config.taskSignerId
        || config.signerId
        || placementTaskSignerId(this.placementTaskSigner);
    } else if (
      has('placementTaskSignerId')
      || has('remoteTaskSignerId')
      || has('taskSignerId')
      || has('signerId')
    ) {
      this.placementTaskSignerId = config.placementTaskSignerId
        || config.remoteTaskSignerId
        || config.taskSignerId
        || config.signerId
        || placementTaskSignerId(this.placementTaskSigner);
    }

    if (has('placementTimeoutMs') || has('remotePlacementTimeoutMs')) {
      this.placementTimeoutMs = normalizeInteger(
        config.placementTimeoutMs ?? config.remotePlacementTimeoutMs,
        this.placementTimeoutMs,
        0,
        3600000
      );
    }

    if (has('remoteResultVerification') || has('placementResultVerification')) {
      this.remoteResultVerification = config.remoteResultVerification !== false
        && config.placementResultVerification !== false;
    }

    const nextRetryPolicy = {
      ...this.placementRetryPolicy
    };
    const retrySource = config.placementRetryPolicy || config.remotePlacementRetryPolicy || {};
    const retryHas = (key) => Object.prototype.hasOwnProperty.call(retrySource, key)
      || Object.prototype.hasOwnProperty.call(config, key);
    if (retryHas('maxAttempts') || retryHas('placementMaxAttempts') || retryHas('remotePlacementMaxAttempts')) {
      nextRetryPolicy.maxAttempts = normalizeInteger(
        retrySource.maxAttempts
          ?? config.placementMaxAttempts
          ?? config.remotePlacementMaxAttempts,
        nextRetryPolicy.maxAttempts,
        1,
        100
      );
    }
    if (retryHas('baseDelayMs') || retryHas('placementRetryBaseDelayMs') || retryHas('remotePlacementRetryBaseDelayMs')) {
      nextRetryPolicy.baseDelayMs = normalizeInteger(
        retrySource.baseDelayMs
          ?? config.placementRetryBaseDelayMs
          ?? config.remotePlacementRetryBaseDelayMs,
        nextRetryPolicy.baseDelayMs,
        0,
        600000
      );
    }
    if (retryHas('maxDelayMs') || retryHas('placementRetryMaxDelayMs') || retryHas('remotePlacementRetryMaxDelayMs')) {
      nextRetryPolicy.maxDelayMs = normalizeInteger(
        retrySource.maxDelayMs
          ?? config.placementRetryMaxDelayMs
          ?? config.remotePlacementRetryMaxDelayMs,
        nextRetryPolicy.maxDelayMs,
        0,
        600000
      );
    }
    if (retryHas('jitterFraction') || retryHas('placementRetryJitterFraction') || retryHas('remotePlacementRetryJitterFraction')) {
      nextRetryPolicy.jitterFraction = normalizeNumber(
        retrySource.jitterFraction
          ?? config.placementRetryJitterFraction
          ?? config.remotePlacementRetryJitterFraction,
        nextRetryPolicy.jitterFraction,
        0,
        1
      );
    }
    if (retryHas('retryableErrorKinds') || retryHas('placementRetryableErrorKinds') || retryHas('remotePlacementRetryableErrorKinds')) {
      nextRetryPolicy.retryableErrorKinds = normalizeStringList(
        retrySource.retryableErrorKinds
          ?? config.placementRetryableErrorKinds
          ?? config.remotePlacementRetryableErrorKinds,
        nextRetryPolicy.retryableErrorKinds || DEFAULT_PLACEMENT_RETRYABLE_ERROR_KINDS
      );
    }
    this.placementRetryPolicy = this._getPlacementRetryPolicyReport(nextRetryPolicy);

    return this.getCapabilities();
  }

  /**
   * Get compute capabilities of this node
   * @returns {Object} Capability information
   */
  getCapabilities() {
    // TODO: Return detailed capability info
    return {
      ...this.capabilities,
      resourceProfile: this.getResourceProfile(),
      workerPolicy: this.getWorkerPolicy(),
      workers: this.workers.length,
      targetWorkers: this.targetWorkerCount,
      minWorkers: this.workerPolicy.minWorkers,
      maxWorkers: this.workerPolicy.maxWorkers,
      solverCount: this.solverRegistry.list().length,
      placementExecutor: !!this.placementExecutor,
      placementExecutorId: this.placementExecutorId,
      placementAdmission: !!this.placementAdmission,
      placementAdmissionId: this.placementAdmissionId,
      placementResultValidator: !!this.placementResultValidator,
      placementResultValidatorId: this.placementResultValidatorId,
      placementTaskSigner: !!this.placementTaskSigner,
      placementTaskSignerId: this.placementTaskSignerId,
      placementTimeoutMs: this.placementTimeoutMs,
      placementRetryPolicy: this._getPlacementRetryPolicyReport(),
      remoteResultVerification: this.remoteResultVerification,
      affinityCount: this.workerAffinities.size,
      activeTaskCount: this.activeTasks.size,
      queuedTaskCount: this.taskQueue.length,
      workerSpawnFailures: this.workerSpawnFailures,
      workerRetirements: this.workerRetirements,
      workerPoolRevision: this.workerPoolRevision,
      lastWorkerResize: JSON.parse(JSON.stringify(this.lastWorkerResize)),
      workerResizeHistory: JSON.parse(JSON.stringify(this.workerResizeHistory)),
      workerAutoScaleHold: this._getWorkerAutoScaleHoldStatus(),
      stats: this.getStats()
    };
  }

  /**
   * Get compute statistics
   * @returns {Object} Compute stats
   */
  getStats() {
    const workerCapacity = Math.max(1, this.workers.length || this.targetWorkerCount || this.workerPolicy.targetWorkers || 1);
    const currentLoad = (this.activeTasks.size + this.taskQueue.length) / workerCapacity;
    return {
      schema: this.stats.schema,
      totalTasksSubmitted: this.stats.totalTasksSubmitted,
      totalTasksCompleted: this.stats.totalTasksCompleted,
      totalTasksFailed: this.stats.totalTasksFailed,
      inlineTasksCompleted: this.stats.inlineTasksCompleted,
      workerTasksCompleted: this.stats.workerTasksCompleted,
      remoteTasksCompleted: this.stats.remoteTasksCompleted,
      remoteTasksFailed: this.stats.remoteTasksFailed,
      remoteTasksTimedOut: this.stats.remoteTasksTimedOut,
      remoteTasksRejected: this.stats.remoteTasksRejected,
      remoteTasksVerificationFailed: this.stats.remoteTasksVerificationFailed,
      remoteTasksValidationFailed: this.stats.remoteTasksValidationFailed,
      remoteTaskAttempts: this.stats.remoteTaskAttempts,
      remoteTasksRetried: this.stats.remoteTasksRetried,
      remoteTasksRetryExhausted: this.stats.remoteTasksRetryExhausted,
      averageTaskDuration: this.stats.averageTaskDurationMs,
      averageTaskDurationMs: this.stats.averageTaskDurationMs,
      lastTaskDurationMs: this.stats.lastTaskDurationMs,
      minTaskDurationMs: this.stats.minTaskDurationMs,
      maxTaskDurationMs: this.stats.maxTaskDurationMs,
      currentLoad: Number(currentLoad.toFixed(4)),
      activeTaskCount: this.activeTasks.size,
      queuedTaskCount: this.taskQueue.length,
      workerCount: this.workers.length,
      targetWorkers: this.targetWorkerCount,
      workerPoolRevision: this.workerPoolRevision,
      lastWorkerResize: JSON.parse(JSON.stringify(this.lastWorkerResize)),
      workerResizeHistory: JSON.parse(JSON.stringify(this.workerResizeHistory)),
      workerAutoScaleHold: this._getWorkerAutoScaleHoldStatus(),
      workerUtilization: this._getWorkerUtilizationReport(),
      taskPlacement: JSON.parse(JSON.stringify(this.stats.taskPlacement)),
      lastCompletedAt: this.stats.lastCompletedAt,
      byRuntime: JSON.parse(JSON.stringify(this.stats.byRuntime)),
      byTaskFamily: JSON.parse(JSON.stringify(this.stats.byTaskFamily))
    };
  }

  _getPlacementRetryPolicyReport(policy = this.placementRetryPolicy) {
    return {
      schema: COMPUTE_REMOTE_PLACEMENT_RETRY_SCHEMA,
      maxAttempts: normalizeInteger(policy?.maxAttempts, 1, 1, 100),
      baseDelayMs: normalizeInteger(policy?.baseDelayMs, 0, 0, 600000),
      maxDelayMs: normalizeInteger(policy?.maxDelayMs, 0, 0, 600000),
      jitterFraction: normalizeNumber(policy?.jitterFraction, 0, 0, 1),
      retryableErrorKinds: normalizeStringList(policy?.retryableErrorKinds, DEFAULT_PLACEMENT_RETRYABLE_ERROR_KINDS),
      terminalErrorKinds: [...TERMINAL_PLACEMENT_ERROR_KINDS]
    };
  }

  /**
   * Execute task on appropriate worker
   * @private
   * @param {Object} task - Task to execute
   * @returns {Promise<any>} Task result
   */
  async _executeTask(task) {
    // TODO: Select appropriate worker based on task type
    // TODO: Send task to worker
    // TODO: Wait for result
    // TODO: Handle errors
  }

  /**
   * Schedule next task from queue
   * @private
   */
  _scheduleNext() {
    // TODO: Check for available workers
    // TODO: Get next task from queue
    // TODO: Execute task
  }

  /**
   * Handle task completion
   * @private
   * @param {string} taskId - Completed task ID
   * @param {any} result - Task result
   */
  _handleTaskComplete(taskId, result) {
    // TODO: Remove from active tasks
    // TODO: Return result to submitter
    // TODO: Schedule next queued task
  }

  /**
   * Handle task error
   * @private
   * @param {string} taskId - Failed task ID
   * @param {Error} error - Error details
   */
  _handleTaskError(taskId, error) {
    // TODO: Log error
    // TODO: Retry task if appropriate
    // TODO: Return error to submitter
  }

  /* Internal helpers */
  _supportsWorkers() {
    return typeof Worker !== 'undefined' && this.config.enableWorkers;
  }

  _canDispatchRemotePlacement(placement = {}) {
    return !!this.placementExecutor
      && placement.advisoryOnly === false
      && (placement.requestedPlacement === 'peer' || placement.requestedPlacement === 'cluster');
  }

  _createTaskPacket(payload = {}, placement = {}) {
    const codeEnvelope = {
      runtime: payload.runtime,
      module: payload.module,
      hostModule: payload.hostModule,
      exportName: payload.exportName,
      hostExport: payload.hostExport,
      fn: payload.fn,
      wasm: payload.wasm,
      wasmSource: payload.wasmSource,
      source: payload.source
    };
    const inputEnvelope = {
      data: payload.data,
      args: payload.args,
      webgpu: payload.webgpu,
      placement
    };
    const codeHash = hashString(stableSerialize(codeEnvelope));
    const inputHash = hashString(stableSerialize(inputEnvelope));
    const taskHash = hashString(stableSerialize({
      codeHash,
      inputHash,
      id: payload.id,
      runtime: payload.runtime,
      taskFamily: payload.taskFamily,
      solverId: payload.solverId,
      placement: placement?.requestedPlacement || null
    }));
    return {
      schema: COMPUTE_TASK_PACKET_SCHEMA,
      taskId: payload.id || null,
      runtime: payload.runtime || null,
      taskFamily: payload.taskFamily || null,
      solverId: payload.solverId || null,
      requestedPlacement: placement?.requestedPlacement || null,
      codeHash,
      inputHash,
      taskHash,
      hashAlgorithm: 'fnv1a32-stable-json',
      generatedAt: Date.now()
    };
  }

  _normalizePlacementTaskSignature(result) {
    if (result == null || result === false) {
      return {
        signed: false,
        reason: result === false ? 'signer-declined' : 'no-signature'
      };
    }
    if (typeof result === 'string') {
      return {
        signed: true,
        signature: result,
        signatureAlgorithm: 'custom-signature'
      };
    }
    if (typeof result === 'object') {
      const signature = result.signature || result.value || null;
      return {
        ...result,
        signed: result.signed !== false && !!signature,
        signature,
        signatureAlgorithm: result.signatureAlgorithm || result.algorithm || 'custom-signature',
        reason: result.reason || (signature ? 'signed' : 'no-signature')
      };
    }
    return {
      signed: true,
      signature: String(result),
      signatureAlgorithm: 'custom-signature',
      reason: 'signed'
    };
  }

  async _createTaskEnvelope(task, { mode = null } = {}) {
    const taskPacket = task.payload?.taskPacket || null;
    const placement = task.placement || task.payload?.placement || null;
    const baseEnvelope = {
      schema: COMPUTE_REMOTE_TASK_ENVELOPE_SCHEMA,
      taskPacketSchema: taskPacket?.schema || null,
      taskPacket,
      mode,
      signed: false,
      signerId: null,
      signature: null,
      signatureAlgorithm: null,
      reason: 'no-task-signer',
      createdAt: Date.now()
    };
    if (!this.placementTaskSigner) return baseEnvelope;

    const context = {
      manager: this,
      task,
      placement,
      payload: task.payload,
      taskPacket,
      mode
    };
    const signer = this.placementTaskSigner;
    const result = typeof signer === 'function'
      ? await signer(taskPacket, context)
      : signer.signTaskPacket
        ? await signer.signTaskPacket(taskPacket, context)
        : await signer.signEnvelope(baseEnvelope, context);
    const signature = this._normalizePlacementTaskSignature(result);
    return {
      ...baseEnvelope,
      ...signature,
      schema: signature.schema || COMPUTE_REMOTE_TASK_ENVELOPE_SCHEMA,
      taskPacket,
      signerId: signature.signerId || this.placementTaskSignerId || 'placement-task-signer',
      signedAt: signature.signedAt || Date.now()
    };
  }

  _normalizePlacementAdmissionResult(result) {
    if (result === false) {
      return {
        accepted: false,
        reason: 'admission-denied'
      };
    }
    if (result == null || result === true) {
      return {
        accepted: true,
        reason: 'accepted'
      };
    }
    if (typeof result === 'object') {
      return {
        ...result,
        accepted: result.accepted !== false && result.ok !== false,
        reason: result.reason || (result.accepted === false || result.ok === false ? 'admission-denied' : 'accepted')
      };
    }
    return {
      accepted: true,
      reason: String(result || 'accepted')
    };
  }

  _normalizePlacementValidationResult(result) {
    if (result === false) {
      return {
        valid: false,
        reason: 'validation-denied'
      };
    }
    if (result == null || result === true) {
      return {
        valid: true,
        reason: 'validated'
      };
    }
    if (typeof result === 'object') {
      return {
        ...result,
        valid: result.valid !== false && result.accepted !== false && result.ok !== false,
        reason: result.reason || (result.valid === false || result.accepted === false || result.ok === false
          ? 'validation-denied'
          : 'validated')
      };
    }
    return {
      valid: true,
      reason: String(result || 'validated')
    };
  }

  async _runPlacementAdmission(task, { mode = null } = {}) {
    if (!this.placementAdmission) {
      return {
        accepted: true,
        reason: 'no-admission-hook',
        admissionId: null
      };
    }
    const context = {
      manager: this,
      task,
      placement: task.placement || task.payload?.placement || null,
      payload: task.payload,
      taskPacket: task.payload?.taskPacket || null,
      taskEnvelope: task.payload?.taskEnvelope || null,
      mode
    };
    const result = typeof this.placementAdmission === 'function'
      ? await this.placementAdmission(task.payload, context)
      : await this.placementAdmission.admitTask(task.payload, context);
    const admission = this._normalizePlacementAdmissionResult(result);
    return {
      ...admission,
      schema: admission.schema || 'peercompute.compute.placement-admission.v0',
      admissionId: admission.admissionId || this.placementAdmissionId || 'placement-admission',
      mode,
      decidedAt: Date.now()
    };
  }

  async _runPlacementResultValidator(task, {
    mode = null,
    finalResult = null,
    commitDelta = null,
    provenance = null
  } = {}) {
    if (!this.placementResultValidator) {
      return {
        schema: COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA,
        valid: true,
        reason: 'no-result-validator',
        validationId: null,
        mode,
        decidedAt: Date.now()
      };
    }
    const context = {
      manager: this,
      task,
      placement: task.placement || task.payload?.placement || null,
      payload: task.payload,
      taskPacket: task.payload?.taskPacket || null,
      taskEnvelope: task.payload?.taskEnvelope || null,
      mode,
      finalResult,
      commitDelta,
      provenance
    };
    const validator = this.placementResultValidator;
    const result = typeof validator === 'function'
      ? await validator(finalResult, context)
      : validator.validateTaskResult
        ? await validator.validateTaskResult(finalResult, context)
        : await validator.validateResult(finalResult, context);
    const validation = this._normalizePlacementValidationResult(result);
    return {
      ...validation,
      schema: validation.schema || COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA,
      validationId: validation.validationId || this.placementResultValidatorId || 'placement-result-validator',
      mode,
      decidedAt: Date.now()
    };
  }

  _placementRejectedError(admission, { mode }) {
    const err = new Error(`Remote placement rejected for ${mode}: ${admission?.reason || 'admission-denied'}`);
    err.name = 'PlacementAdmissionRejectedError';
    err.code = 'ERR_COMPUTE_PLACEMENT_REJECTED';
    err.placementMode = mode;
    err.reason = admission?.reason || 'admission-denied';
    err.admission = admission || null;
    return err;
  }

  _placementValidationError(validation, provenance, { mode }) {
    const err = new Error(`Remote placement result validation failed for ${mode}: ${validation?.reason || 'validation-denied'}`);
    err.name = 'PlacementResultValidationError';
    err.code = 'ERR_COMPUTE_PLACEMENT_VALIDATION';
    err.placementMode = mode;
    err.reason = validation?.reason || 'validation-denied';
    err.validation = validation || null;
    err.provenance = provenance || null;
    return err;
  }

  _placementTimeoutFor(task) {
    return normalizeInteger(
      task.placement?.timeoutMs ?? task.payload?.placement?.timeoutMs ?? this.placementTimeoutMs,
      this.placementTimeoutMs,
      0,
      3600000
    );
  }

  _placementRetryPolicyFor(task = {}) {
    const placement = task.placement || task.payload?.placement || {};
    const base = this.placementRetryPolicy || {};
    const maxAttempts = normalizeInteger(
      placement.maxAttempts
        ?? placement.retryMaxAttempts
        ?? placement.remoteMaxAttempts
        ?? placement.remoteRetryMaxAttempts
        ?? base.maxAttempts,
      1,
      1,
      100
    );
    const baseDelayMs = normalizeInteger(
      placement.retryBaseDelayMs ?? placement.remoteRetryBaseDelayMs ?? base.baseDelayMs,
      0,
      0,
      600000
    );
    const maxDelayMs = normalizeInteger(
      placement.retryMaxDelayMs ?? placement.remoteRetryMaxDelayMs ?? base.maxDelayMs,
      baseDelayMs,
      0,
      600000
    );
    const jitterFraction = normalizeNumber(
      placement.retryJitterFraction ?? placement.remoteRetryJitterFraction ?? base.jitterFraction,
      0,
      0,
      1
    );
    return this._getPlacementRetryPolicyReport({
      ...base,
      maxAttempts,
      baseDelayMs,
      maxDelayMs,
      jitterFraction,
      retryableErrorKinds: normalizeStringList(
        placement.retryableErrorKinds ?? placement.remoteRetryableErrorKinds ?? base.retryableErrorKinds,
        DEFAULT_PLACEMENT_RETRYABLE_ERROR_KINDS
      )
    });
  }

  _placementErrorKind(err) {
    if (err?.code === 'ERR_COMPUTE_PLACEMENT_TIMEOUT') return 'timeout';
    if (err?.code === 'ERR_COMPUTE_PLACEMENT_REJECTED') return 'rejected';
    if (err?.code === 'ERR_COMPUTE_PLACEMENT_VERIFICATION') return 'verification-failed';
    if (err?.code === 'ERR_COMPUTE_PLACEMENT_VALIDATION') return 'validation-failed';
    return 'executor-error';
  }

  _placementRetryDelayMs(attempt, policy) {
    const baseDelayMs = normalizeInteger(policy?.baseDelayMs, 0, 0, 600000);
    const maxDelayMs = normalizeInteger(policy?.maxDelayMs, baseDelayMs, 0, 600000);
    const exponent = Math.max(0, normalizeInteger(attempt, 1, 1, 100) - 1);
    const backoff = Math.min(maxDelayMs, baseDelayMs * (2 ** exponent));
    const jitterFraction = normalizeNumber(policy?.jitterFraction, 0, 0, 1);
    if (jitterFraction <= 0 || backoff <= 0) return backoff;
    const jitter = backoff * jitterFraction * Math.random();
    return Math.min(maxDelayMs, Math.round(backoff + jitter));
  }

  _placementRetryDecision({ attempt, errorKind, err, policy, mode }) {
    const retryableKinds = new Set(normalizeStringList(policy?.retryableErrorKinds, DEFAULT_PLACEMENT_RETRYABLE_ERROR_KINDS));
    const terminalKinds = new Set(TERMINAL_PLACEMENT_ERROR_KINDS);
    const maxAttempts = normalizeInteger(policy?.maxAttempts, 1, 1, 100);
    const terminal = terminalKinds.has(errorKind);
    const retryable = !terminal && retryableKinds.has(errorKind);
    const attemptsRemaining = attempt < maxAttempts;
    const retryScheduled = retryable && attemptsRemaining;
    return {
      schema: COMPUTE_REMOTE_PLACEMENT_RETRY_SCHEMA,
      mode,
      attempt,
      nextAttempt: retryScheduled ? attempt + 1 : null,
      maxAttempts,
      errorKind,
      errorCode: err?.code || null,
      errorMessage: err?.message || String(err || ''),
      retryable,
      terminal,
      retryScheduled,
      exhausted: retryable && maxAttempts > 1 && !attemptsRemaining,
      delayMs: retryScheduled ? this._placementRetryDelayMs(attempt, policy) : 0,
      decidedAt: Date.now()
    };
  }

  _placementRetrySummary(task, { mode, ok = true, errorKind = null } = {}) {
    const events = Array.isArray(task.placementRetryEvents) ? task.placementRetryEvents : [];
    const policy = task.placementRetryPolicy || this._placementRetryPolicyFor(task);
    const retryCount = events.filter((event) => event.retryScheduled).length;
    const lastEvent = events[events.length - 1] || null;
    return {
      schema: COMPUTE_REMOTE_PLACEMENT_RETRY_SCHEMA,
      mode,
      maxAttempts: policy.maxAttempts,
      attemptCount: normalizeInteger(task.placementAttempt, retryCount + 1, 0, 100),
      retryCount,
      retried: retryCount > 0,
      retryableErrorKinds: normalizeStringList(policy.retryableErrorKinds, DEFAULT_PLACEMENT_RETRYABLE_ERROR_KINDS),
      terminalErrorKinds: [...TERMINAL_PLACEMENT_ERROR_KINDS],
      exhausted: !ok && !!lastEvent?.exhausted,
      finalErrorKind: ok ? null : (errorKind || lastEvent?.errorKind || null),
      events: JSON.parse(JSON.stringify(events))
    };
  }

  _runPlacementExecutor(task, {
    signal = null,
    timeoutMs = this.placementTimeoutMs,
    mode = null,
    attempt = 1,
    retryPolicy = null
  } = {}) {
    const context = {
      manager: this,
      task,
      placement: task.placement || task.payload?.placement || null,
      payload: task.payload,
      taskPacket: task.payload?.taskPacket || null,
      taskEnvelope: task.payload?.taskEnvelope || null,
      signal,
      timeoutMs,
      mode,
      attempt,
      retryPolicy
    };
    if (typeof this.placementExecutor === 'function') {
      return this.placementExecutor(task.payload, context);
    }
    return this.placementExecutor.submitTask(task.payload, context);
  }

  _runPlacementExecutorWithTimeout(task, { mode, attempt = 1, retryPolicy = null } = {}) {
    const timeoutMs = this._placementTimeoutFor(task);
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const executorPromise = Promise.resolve()
      .then(() => this._runPlacementExecutor(task, {
        signal: controller?.signal || null,
        timeoutMs,
        mode,
        attempt,
        retryPolicy
      }));

    if (timeoutMs <= 0) return executorPromise;

    let timeoutId = null;
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        const err = new Error(`Placement executor timed out after ${timeoutMs}ms for ${mode}`);
        err.name = 'PlacementExecutorTimeoutError';
        err.code = 'ERR_COMPUTE_PLACEMENT_TIMEOUT';
        err.timeoutMs = timeoutMs;
        err.placementMode = mode;
        try {
          controller?.abort?.(err);
        } catch {}
        reject(err);
      }, timeoutMs);
    });

    return Promise.race([executorPromise, timeoutPromise])
      .finally(() => {
        if (timeoutId != null) clearTimeout(timeoutId);
      });
  }

  _normalizeRemotePlacementProvenance(source, {
    task,
    mode,
    result,
    finalResult,
    startedAt = null,
    completedAtMs = null,
    completedAt = Date.now()
  } = {}) {
    const raw = source && typeof source === 'object' ? source : {};
    const payload = task?.payload || {};
    const placement = task?.placement || payload.placement || {};
    const durationMs = Number.isFinite(Number(raw.durationMs))
      ? Number(raw.durationMs)
      : Number.isFinite(Number(raw.roundTripMs))
        ? Number(raw.roundTripMs)
        : Number.isFinite(Number(startedAt)) && Number.isFinite(Number(completedAtMs))
          ? Math.max(0, Number(completedAtMs) - Number(startedAt))
        : null;
    const resultObject = result && typeof result === 'object' ? result : {};
    const finalObject = finalResult && typeof finalResult === 'object' ? finalResult : {};
    const admission = task?.placementAdmission || null;
    const taskPacket = payload.taskPacket || null;
    const taskEnvelope = payload.taskEnvelope || null;
    const replicas = normalizeRemoteReplicaSummaries(
      raw.replicas
      || raw.replicaResults
      || raw.quorum?.replicas
      || resultObject.replicas
      || resultObject.replicaResults
    );

    return {
      schema: COMPUTE_REMOTE_PLACEMENT_PROVENANCE_SCHEMA,
      taskPacketSchema: taskPacket?.schema || null,
      taskEnvelopeSchema: taskEnvelope?.schema || null,
      taskSigned: taskEnvelope?.signed === true,
      signerId: raw.signerId || taskEnvelope?.signerId || null,
      signatureAlgorithm: raw.signatureAlgorithm || taskEnvelope?.signatureAlgorithm || null,
      mode,
      executorId: raw.executorId || this.placementExecutorId || 'placement-executor',
      promotedReplicaExecutorId: raw.promotedReplicaExecutorId || null,
      admissionId: admission?.admissionId || null,
      admissionReason: admission?.reason || null,
      requestedPlacement: placement.requestedPlacement || null,
      taskId: payload.id || task?.id || null,
      taskFamily: payload.taskFamily || task?.taskFamily || null,
      solverId: payload.solverId || placement.solverId || null,
      solverKey: placement.solverKey || null,
      peerId: raw.peerId || raw.remotePeerId || null,
      targetPeerId: raw.targetPeerId || null,
      transportPeerId: raw.transportPeerId || null,
      responderNodeId: raw.responderNodeId || null,
      responderPeerId: raw.responderPeerId || null,
      requesterId: raw.requesterId || null,
      requestId: raw.requestId || null,
      clusterId: raw.clusterId || null,
      workerId: raw.workerId || raw.remoteWorkerId || null,
      remoteExecution: raw.remoteExecution && typeof raw.remoteExecution === 'object'
        ? JSON.parse(JSON.stringify(raw.remoteExecution))
        : null,
      codeHash: raw.codeHash || resultObject.codeHash || taskPacket?.codeHash || null,
      inputHash: raw.inputHash || resultObject.inputHash || taskPacket?.inputHash || null,
      taskHash: raw.taskHash || resultObject.taskHash || taskPacket?.taskHash || null,
      outputHash: raw.outputHash || resultObject.outputHash || null,
      resultHash: raw.resultHash || resultObject.resultHash || raw.outputHash || resultObject.outputHash || null,
      commitDeltaHash: raw.commitDeltaHash || resultObject.commitDeltaHash || raw.deltaHash || resultObject.deltaHash || null,
      resultSchema: raw.resultSchema || finalObject.schema || resultObject.schema || null,
      role: raw.role || null,
      trustLevel: raw.trustLevel || 'injected-executor',
      redundantPlacement: raw.redundantPlacement && typeof raw.redundantPlacement === 'object'
        ? JSON.parse(JSON.stringify(raw.redundantPlacement))
        : null,
      primary: raw.primary && typeof raw.primary === 'object'
        ? JSON.parse(JSON.stringify(raw.primary))
        : null,
      primaryFailure: raw.primaryFailure && typeof raw.primaryFailure === 'object'
        ? JSON.parse(JSON.stringify(raw.primaryFailure))
        : null,
      promotedReplica: raw.promotedReplica && typeof raw.promotedReplica === 'object'
        ? JSON.parse(JSON.stringify(raw.promotedReplica))
        : null,
      replicaSuccessCount: normalizeInteger(raw.replicaSuccessCount, 0, 0, 1000000),
      replicaFailureCount: normalizeInteger(raw.replicaFailureCount, 0, 0, 1000000),
      redundantReplicaCount: normalizeInteger(raw.redundantReplicaCount ?? replicas.length, replicas.length, 0, 1000000),
      replicaCount: replicas.length,
      quorumReplicaCount: normalizeInteger(raw.quorumReplicaCount ?? replicas.length, replicas.length, 0, 1000000),
      replicas,
      validated: raw.validated === true,
      durationMs: durationMs == null ? null : Number(durationMs.toFixed(3)),
      completedAt
    };
  }

  _verifyRemotePlacementProvenance(provenance = {}, task = {}) {
    const taskPacket = task?.payload?.taskPacket || null;
    const checkedAt = Date.now();
    if (!this.remoteResultVerification) {
      return {
        schema: COMPUTE_REMOTE_PLACEMENT_VERIFICATION_SCHEMA,
        verified: true,
        skipped: true,
        reason: 'verification-disabled',
        checkedAt
      };
    }
    if (!taskPacket || taskPacket.schema !== COMPUTE_TASK_PACKET_SCHEMA) {
      return {
        schema: COMPUTE_REMOTE_PLACEMENT_VERIFICATION_SCHEMA,
        verified: false,
        skipped: false,
        reason: 'task-packet-missing',
        taskPacketSchema: taskPacket?.schema || null,
        mismatchFields: ['taskPacket'],
        checks: [],
        checkedAt
      };
    }

    const checks = ['codeHash', 'inputHash', 'taskHash'].map((field) => {
      const expected = taskPacket[field] || null;
      const actual = provenance?.[field] || null;
      return {
        field,
        expected,
        actual,
        ok: !!expected && expected === actual
      };
    });
    const mismatchFields = checks.filter((check) => !check.ok).map((check) => check.field);
    return {
      schema: COMPUTE_REMOTE_PLACEMENT_VERIFICATION_SCHEMA,
      verified: mismatchFields.length === 0,
      skipped: false,
      reason: mismatchFields.length === 0 ? 'hashes-match' : 'hash-mismatch',
      taskPacketSchema: taskPacket.schema,
      hashAlgorithm: taskPacket.hashAlgorithm || null,
      mismatchFields,
      checks,
      checkedAt
    };
  }

  _placementVerificationError(verification, provenance, { mode }) {
    const err = new Error(`Remote placement verification failed for ${mode}: ${verification?.reason || 'hash-mismatch'}`);
    err.name = 'PlacementResultVerificationError';
    err.code = 'ERR_COMPUTE_PLACEMENT_VERIFICATION';
    err.placementMode = mode;
    err.reason = verification?.reason || 'hash-mismatch';
    err.verification = verification || null;
    err.provenance = provenance || null;
    return err;
  }

  _unwrapPlacementExecutorResult(result, task, { mode, startedAt }) {
    let finalResult = result;
    let commitDelta = null;
    let provenanceSource = null;

    if (result && typeof result === 'object') {
      if (Object.prototype.hasOwnProperty.call(result, 'commitDelta')) {
        commitDelta = result.commitDelta;
      }
      provenanceSource = result.provenance || result.remoteProvenance || result.placementProvenance || null;
      const isRemoteEnvelope = Object.prototype.hasOwnProperty.call(result, 'commitDelta')
        || provenanceSource
        || Object.prototype.hasOwnProperty.call(result, 'remoteProvenance')
        || Object.prototype.hasOwnProperty.call(result, 'placementProvenance');
      if (isRemoteEnvelope && Object.prototype.hasOwnProperty.call(result, 'value')) {
        finalResult = result.value;
      } else if (isRemoteEnvelope && Object.prototype.hasOwnProperty.call(result, 'result')) {
        finalResult = result.result;
      }
    }

    const completedAt = Date.now();
    const completedAtMs = nowMs();
    const provenance = this._normalizeRemotePlacementProvenance(provenanceSource, {
      task,
      mode,
      result,
      finalResult,
      startedAt,
      completedAtMs,
      completedAt
    });
    const verification = this._verifyRemotePlacementProvenance(provenance, task);
    provenance.verification = verification;
    provenance.verified = verification.verified;
    if (!verification.verified) {
      throw this._placementVerificationError(verification, provenance, { mode });
    }
    return {
      finalResult,
      commitDelta,
      provenance
    };
  }

  async _runRemotePlacementWithRetries(startedTask, { mode }) {
    const retryPolicy = this._placementRetryPolicyFor(startedTask);
    startedTask.placementRetryPolicy = retryPolicy;
    startedTask.placementRetryEvents = [];
    for (let attempt = 1; attempt <= retryPolicy.maxAttempts; attempt += 1) {
      startedTask.placementAttempt = attempt;
      this._recordPlacementAttempt(startedTask, { mode, attempt, retryPolicy });
      const attemptStartedAt = nowMs();
      try {
        const result = await this._runPlacementExecutorWithTimeout(startedTask, {
          mode,
          attempt,
          retryPolicy
        });
        const { finalResult, commitDelta, provenance } = this._unwrapPlacementExecutorResult(result, startedTask, {
          mode,
          startedAt: attemptStartedAt
        });
        const validation = await this._runPlacementResultValidator(startedTask, {
          mode,
          finalResult,
          commitDelta,
          provenance
        });
        provenance.validation = validation;
        if (!validation.valid) {
          throw this._placementValidationError(validation, provenance, { mode });
        }
        provenance.retry = this._placementRetrySummary(startedTask, { mode, ok: true });
        return { finalResult, commitDelta, provenance };
      } catch (err) {
        const errorKind = this._placementErrorKind(err);
        const retry = this._placementRetryDecision({
          attempt,
          errorKind,
          err,
          policy: retryPolicy,
          mode
        });
        err.retry = retry;
        startedTask.placementRetryEvents.push(retry);
        if (!retry.retryScheduled) {
          throw err;
        }
        this._recordPlacementRetry(startedTask, { mode, retry });
        await sleepMs(retry.delayMs);
      }
    }
    const err = new Error(`Remote placement exhausted retry policy for ${mode}`);
    err.name = 'PlacementRetryExhaustedError';
    err.code = 'ERR_COMPUTE_PLACEMENT_RETRY_EXHAUSTED';
    err.placementMode = mode;
    err.retry = this._placementRetrySummary(startedTask, { mode, ok: false, errorKind: 'executor-error' });
    throw err;
  }

  _dispatchToPlacementExecutor(task) {
    const placement = task.placement || task.payload?.placement || {};
    if (!this._canDispatchRemotePlacement(placement)) return false;
    const mode = `remote-${placement.requestedPlacement}`;
    task.payload.taskPacket = this._createTaskPacket(task.payload, placement);
    const startedTask = {
      ...task,
      startedAt: nowMs(),
      executionMode: mode,
      placementExecutorId: this.placementExecutorId,
      placementAdmissionId: this.placementAdmissionId,
      placementAdmission: null
    };
    this.activeTasks.set(task.id, startedTask);

    Promise.resolve()
      .then(() => this._createTaskEnvelope(startedTask, { mode }))
      .then((taskEnvelope) => {
        startedTask.payload.taskEnvelope = taskEnvelope;
        return null;
      })
      .then(() => this._runPlacementAdmission(startedTask, { mode }))
      .then((admission) => {
        startedTask.placementAdmission = admission;
        if (!admission.accepted) {
          throw this._placementRejectedError(admission, { mode });
        }
        return null;
      })
      .then(() => this._runRemotePlacementWithRetries(startedTask, { mode }))
      .then(({ finalResult, commitDelta, provenance }) => {
        if (commitDelta) {
          this.commitDelta(commitDelta);
        }
        this._recordTaskCompletion(startedTask, {
          ok: true,
          mode,
          provenance,
          admission: startedTask.placementAdmission,
          retry: provenance.retry || this._placementRetrySummary(startedTask, { mode, ok: true })
        });
        startedTask.resolve(finalResult);
      })
      .catch((err) => {
        const errorKind = this._placementErrorKind(err);
        const retry = err?.retry?.schema === COMPUTE_REMOTE_PLACEMENT_RETRY_SCHEMA
          ? this._placementRetrySummary(startedTask, { mode, ok: false, errorKind })
          : null;
        this._recordTaskCompletion(startedTask, {
          ok: false,
          mode,
          errorKind,
          errorMessage: err?.message || String(err),
          admission: startedTask.placementAdmission || err?.admission || null,
          provenance: err?.provenance || null,
          retry
        });
        startedTask.reject(err);
      })
      .finally(() => {
        this.activeTasks.delete(task.id);
        this._scheduleIdleScaleDown();
        this._scheduleNext();
      });
    return true;
  }

  _spawnWorker() {
    try {
      const worker = this.workerBootstrapURL
        ? new Worker(this.workerBootstrapURL, { type: 'module' })
        : createDefaultComputeWorker();
      const ordinal = this.nextWorkerOrdinal;
      this.nextWorkerOrdinal += 1;
      const workerId = `worker-${ordinal}`;
      this.workerIds.set(worker, workerId);
      this.workerUtilization.set(workerId, makeEmptyExecutorStats({
        executorId: workerId,
        kind: 'worker',
        ordinal,
        status: 'active'
      }));
      worker.onmessage = (evt) => this._handleWorkerMessage(worker, evt.data);
      worker.onerror = (err) => this._handleWorkerFailure(worker, err);
      if (typeof worker.addEventListener === 'function') {
        worker.addEventListener('messageerror', (err) => this._handleWorkerFailure(worker, err));
      }
      this.workers.push(worker);
      return worker;
    } catch (err) {
      this.workerSpawnFailures += 1;
      console.warn('[ComputeManager] Failed to start worker; falling back to inline execution', err);
      return null;
    }
  }

  _workerId(worker) {
    return this.workerIds.get(worker) || null;
  }

  _executorStats(executorId, { kind = 'worker', ordinal = null, status = 'active' } = {}) {
    const id = String(executorId || this.inlineExecutorId);
    if (!this.workerUtilization.has(id)) {
      this.workerUtilization.set(id, makeEmptyExecutorStats({
        executorId: id,
        kind,
        ordinal,
        status
      }));
    }
    return this.workerUtilization.get(id);
  }

  _executorBucket(map, key) {
    const bucketKey = String(key || 'unknown');
    if (!map[bucketKey]) {
      map[bucketKey] = makeEmptyRuntimeStats();
    }
    return map[bucketKey];
  }

  _recordExecutorStart(executorId, task, { kind = 'worker' } = {}) {
    const stats = this._executorStats(executorId, { kind });
    const runtime = task.runtime || task.payload?.runtime || 'unknown';
    const taskFamily = task.taskFamily || task.payload?.taskFamily || 'unknown';
    stats.status = stats.status === 'retired' ? 'retired' : 'active';
    stats.activeTaskCount += 1;
    stats.submitted += 1;
    stats.lastRuntime = runtime;
    stats.lastTaskFamily = taskFamily;
    stats.lastStartedAt = Date.now();
    this._executorBucket(stats.byRuntime, runtime).submitted += 1;
    this._executorBucket(stats.byTaskFamily, taskFamily).submitted += 1;
    task.executorId = stats.executorId;
    task.executorActive = true;
  }

  _recordExecutorCompletion(task, { ok = true, durationMs = 0 } = {}) {
    const executorId = task.executorId;
    if (!executorId) return;
    const stats = this.workerUtilization.get(executorId);
    if (!stats) return;
    if (task.executorActive) {
      stats.activeTaskCount = Math.max(0, stats.activeTaskCount - 1);
      task.executorActive = false;
    }
    const runtime = task.runtime || task.payload?.runtime || 'unknown';
    const taskFamily = task.taskFamily || task.payload?.taskFamily || 'unknown';
    const runtimeStats = this._executorBucket(stats.byRuntime, runtime);
    const taskFamilyStats = this._executorBucket(stats.byTaskFamily, taskFamily);
    if (ok) {
      stats.completed += 1;
      runtimeStats.completed += 1;
      taskFamilyStats.completed += 1;
    } else {
      stats.failed += 1;
      runtimeStats.failed += 1;
      taskFamilyStats.failed += 1;
    }

    const roundedDuration = Number(Math.max(0, durationMs).toFixed(3));
    stats.totalDurationMs += durationMs;
    stats.lastDurationMs = roundedDuration;
    stats.maxDurationMs = Math.max(stats.maxDurationMs, roundedDuration);
    const finished = stats.completed + stats.failed;
    stats.averageDurationMs = finished > 0
      ? Number((stats.totalDurationMs / finished).toFixed(3))
      : 0;
    stats.lastRuntime = runtime;
    stats.lastTaskFamily = taskFamily;
    stats.lastCompletedAt = Date.now();

    for (const bucket of [runtimeStats, taskFamilyStats]) {
      bucket.totalDurationMs += durationMs;
      bucket.lastDurationMs = roundedDuration;
      bucket.maxDurationMs = Math.max(bucket.maxDurationMs, roundedDuration);
      const bucketFinished = bucket.completed + bucket.failed;
      bucket.averageDurationMs = bucketFinished > 0
        ? Number((bucket.totalDurationMs / bucketFinished).toFixed(3))
        : 0;
    }
  }

  _recordExecutorAbandon(task) {
    const executorId = task.executorId;
    if (!executorId || !task.executorActive) return;
    const stats = this.workerUtilization.get(executorId);
    if (!stats) return;
    stats.activeTaskCount = Math.max(0, stats.activeTaskCount - 1);
    stats.abandoned += 1;
    task.executorActive = false;
  }

  _cloneExecutorStats(stats) {
    return JSON.parse(JSON.stringify({
      ...stats,
      activeTaskCount: Math.max(0, stats.activeTaskCount || 0)
    }));
  }

  _getWorkerUtilizationReport() {
    const workers = Array.from(this.workerUtilization.values())
      .filter((entry) => entry.kind === 'worker')
      .sort((a, b) => (a.ordinal ?? 0) - (b.ordinal ?? 0))
      .map((entry) => this._cloneExecutorStats(entry));
    const inline = this._cloneExecutorStats(this._executorStats(this.inlineExecutorId, { kind: 'inline', ordinal: 0 }));
    const activeWorkers = workers.filter((entry) => entry.status === 'active');
    const retiredWorkers = workers.filter((entry) => entry.status === 'retired');
    const allExecutors = [inline, ...workers];
    const workerActiveTaskCount = workers.reduce((sum, entry) => sum + (entry.activeTaskCount || 0), 0);
    const totalSubmitted = allExecutors.reduce((sum, entry) => sum + (entry.submitted || 0), 0);
    const totalCompleted = allExecutors.reduce((sum, entry) => sum + (entry.completed || 0), 0);
    const totalFailed = allExecutors.reduce((sum, entry) => sum + (entry.failed || 0), 0);
    const busiest = [...allExecutors]
      .sort((a, b) => (
        (b.activeTaskCount || 0) - (a.activeTaskCount || 0)
        || (b.completed || 0) - (a.completed || 0)
        || (b.submitted || 0) - (a.submitted || 0)
      ))[0] || inline;

    return {
      schema: COMPUTE_WORKER_UTILIZATION_SCHEMA,
      generatedAt: Date.now(),
      inline,
      workers,
      summary: {
        workerCount: this.workers.length,
        activeWorkerCount: activeWorkers.length,
        retiredWorkerCount: retiredWorkers.length,
        retainedWorkerCount: workers.length,
        inlineActiveTaskCount: inline.activeTaskCount || 0,
        workerActiveTaskCount,
        activeTaskCount: workerActiveTaskCount + (inline.activeTaskCount || 0),
        totalSubmitted,
        totalCompleted,
        totalFailed,
        busiestExecutorId: busiest.executorId || null,
        busiestActiveTaskCount: busiest.activeTaskCount || 0,
        busiestCompleted: busiest.completed || 0
      }
    };
  }

  _placementBucket(map, key) {
    const bucketKey = String(key || 'unknown');
    if (!map[bucketKey]) {
      map[bucketKey] = makeEmptyPlacementStats();
    }
    return map[bucketKey];
  }

  _normalizeTaskPlacement(task = {}, { runtime = 'unknown', taskFamily = 'unknown' } = {}) {
    const hint = task.placementHint
      || task.placement
      || task.data?.placementHint
      || task.data?.placement
      || task.data?.solver?.placementHint
      || null;
    const requested = hint?.recommendedPlacement
      || hint?.requestedPlacement
      || hint?.placement
      || 'local';
    const requestedPlacement = ['local', 'peer', 'cluster'].includes(String(requested).trim().toLowerCase())
      ? String(requested).trim().toLowerCase()
      : 'local';
    return {
      schema: COMPUTE_TASK_PLACEMENT_SCHEMA,
      source: hint ? 'task-placement-hint-v0' : 'default-local',
      advisoryOnly: hint?.advisoryOnly !== false,
      requestedPlacement,
      recommendedPlacement: requestedPlacement,
      actualPlacement: null,
      solverKey: hint?.solverKey || task.solverId || task.data?.solver?.id || null,
      solverId: hint?.solverId || task.solverId || task.data?.solver?.id || null,
      taskFamily,
      runtime,
      syncMode: hint?.syncMode || null,
      timeoutMs: normalizeInteger(hint?.timeoutMs, this.placementTimeoutMs, 0, 3600000),
      confidence: Number.isFinite(Number(hint?.confidence)) ? Number(hint.confidence) : null,
      targetReplicaCount: normalizeInteger(hint?.targetReplicaCount, 0, 0, 1000000),
      peerId: hint?.peerId || hint?.remotePeerId || task.peerId || task.remotePeerId || null,
      clusterId: hint?.clusterId || task.clusterId || null,
      reasons: Array.isArray(hint?.reasons) ? [...hint.reasons] : [],
      constraints: Array.isArray(hint?.constraints) ? [...hint.constraints] : []
    };
  }

  _recordPlacementSubmitted(placement = {}) {
    const stats = this.stats.taskPlacement;
    if (!stats) return;
    const requestedPlacement = placement.requestedPlacement || 'local';
    stats.totalSubmitted += 1;
    if (requestedPlacement === 'local') {
      stats.localSubmitted += 1;
    } else {
      stats.remoteRequested += 1;
    }
    this._placementBucket(stats.byRecommendedPlacement, requestedPlacement).submitted += 1;
    stats.lastPlacement = {
      ...placement,
      actualPlacement: placement.actualPlacement || null
    };
  }

  _recordPlacementAttempt(task, { mode = 'unknown', attempt = 1 } = {}) {
    const placement = task.placement || task.payload?.placement;
    const stats = this.stats.taskPlacement;
    if (!placement || !stats) return;
    const requestedPlacement = placement.requestedPlacement || 'local';
    const modeValue = String(mode || 'unknown');
    const actualPlacement = modeValue.startsWith('remote-') ? modeValue : `local-${modeValue}`;
    this.stats.remoteTaskAttempts += 1;
    stats.remoteAttempts += 1;
    this._placementBucket(stats.byRecommendedPlacement, requestedPlacement).attempted += 1;
    this._placementBucket(stats.byActualPlacement, actualPlacement).attempted += 1;
    stats.lastPlacementAttempt = {
      ...placement,
      actualPlacement,
      attempt,
      attemptedAt: Date.now()
    };
  }

  _recordPlacementRetry(task, { mode = 'unknown', retry = null } = {}) {
    const placement = task.placement || task.payload?.placement;
    const stats = this.stats.taskPlacement;
    if (!placement || !stats) return;
    const requestedPlacement = placement.requestedPlacement || 'local';
    const modeValue = String(mode || 'unknown');
    const actualPlacement = modeValue.startsWith('remote-') ? modeValue : `local-${modeValue}`;
    this.stats.remoteTasksRetried += 1;
    stats.remoteRetried += 1;
    this._placementBucket(stats.byRecommendedPlacement, requestedPlacement).retried += 1;
    this._placementBucket(stats.byActualPlacement, actualPlacement).retried += 1;
    stats.lastPlacementRetry = {
      ...placement,
      actualPlacement,
      retry: retry ? JSON.parse(JSON.stringify(retry)) : null,
      decidedAt: Date.now()
    };
  }

  _recordPlacementCompletion(task, {
    ok = true,
    mode = 'unknown',
    errorKind = null,
    errorMessage = null,
    provenance = null,
    admission = null,
    retry = null
  } = {}) {
    const placement = task.placement || task.payload?.placement;
    const stats = this.stats.taskPlacement;
    if (!placement || !stats) return;
    const requestedPlacement = placement.requestedPlacement || 'local';
    const modeValue = String(mode || 'unknown');
    const actualPlacement = modeValue.startsWith('remote-')
      ? modeValue
      : modeValue === 'worker'
        ? 'local-worker'
        : modeValue === 'inline'
          ? 'local-inline'
          : `local-${modeValue}`;
    if (ok) {
      stats.totalCompleted += 1;
    } else {
      stats.totalFailed += 1;
    }
    if (actualPlacement.startsWith('remote-')) {
      if (ok) {
        stats.remoteExecuted += 1;
      } else {
        stats.remoteFailed += 1;
        if (errorKind === 'timeout') stats.remoteTimedOut += 1;
        if (errorKind === 'rejected') stats.remoteRejected += 1;
        if (errorKind === 'verification-failed') stats.remoteVerificationFailed += 1;
        if (errorKind === 'validation-failed') stats.remoteValidationFailed += 1;
        if (retry?.exhausted) stats.remoteRetryExhausted += 1;
      }
    }
    const recommendedBucket = this._placementBucket(stats.byRecommendedPlacement, requestedPlacement);
    const actualBucket = this._placementBucket(stats.byActualPlacement, actualPlacement);
    if (ok) {
      recommendedBucket.completed += 1;
      actualBucket.completed += 1;
    } else {
      recommendedBucket.failed += 1;
      actualBucket.failed += 1;
      if (errorKind === 'timeout') {
        recommendedBucket.timedOut += 1;
        actualBucket.timedOut += 1;
      }
      if (errorKind === 'rejected') {
        recommendedBucket.rejected += 1;
        actualBucket.rejected += 1;
      }
      if (errorKind === 'verification-failed') {
        recommendedBucket.verificationFailed += 1;
        actualBucket.verificationFailed += 1;
      }
      if (errorKind === 'validation-failed') {
        recommendedBucket.validationFailed += 1;
        actualBucket.validationFailed += 1;
      }
      if (retry?.exhausted) {
        recommendedBucket.retryExhausted += 1;
        actualBucket.retryExhausted += 1;
      }
    }
    actualBucket.submitted += 1;
    stats.lastPlacement = {
      ...placement,
      actualPlacement,
      completedAt: Date.now(),
      ok,
      errorKind,
      errorMessage,
      admission,
      provenance,
      retry
    };
    if (actualPlacement.startsWith('remote-')) {
      stats.lastRemotePlacement = JSON.parse(JSON.stringify(stats.lastPlacement));
    }
  }

  _runtimeStats(runtime) {
    const key = String(runtime || 'unknown');
    if (!this.stats.byRuntime[key]) {
      this.stats.byRuntime[key] = makeEmptyRuntimeStats();
    }
    return this.stats.byRuntime[key];
  }

  _normalizeTaskFamily(task = {}, runtime = 'unknown') {
    const explicit = task.taskFamily
      || task.solverId
      || task.data?.solver?.id
      || task.data?.solverId
      || task.data?.taskFamily;
    if (explicit) return String(explicit).trim() || 'unknown';
    if (task.affinityKey || task.workerKey || task.data?.affinityKey || task.data?.stateKey) {
      const key = String(task.affinityKey || task.workerKey || task.data?.affinityKey || task.data?.stateKey);
      const [family] = key.split(':');
      if (family) return family;
    }
    return String(runtime || 'unknown');
  }

  _taskFamilyStats(taskFamily) {
    const key = String(taskFamily || 'unknown');
    if (!this.stats.byTaskFamily[key]) {
      this.stats.byTaskFamily[key] = makeEmptyRuntimeStats();
    }
    return this.stats.byTaskFamily[key];
  }

  _recordTaskCompletion(task, {
    ok = true,
    mode = 'unknown',
    errorKind = null,
    errorMessage = null,
    provenance = null,
    admission = null,
    retry = null
  } = {}) {
    const runtime = task.runtime || task.payload?.runtime || 'unknown';
    const runtimeStats = this._runtimeStats(runtime);
    const taskFamily = task.taskFamily || task.payload?.taskFamily || 'unknown';
    const taskFamilyStats = this._taskFamilyStats(taskFamily);
    const completedAt = nowMs();
    const durationMs = Math.max(0, completedAt - (task.submittedAt || task.startedAt || completedAt));
    const executorDurationMs = Math.max(0, completedAt - (task.startedAt || task.submittedAt || completedAt));

    if (ok) {
      this.stats.totalTasksCompleted += 1;
      runtimeStats.completed += 1;
      taskFamilyStats.completed += 1;
      if (mode === 'worker') {
        this.stats.workerTasksCompleted += 1;
      } else if (String(mode || '').startsWith('remote-')) {
        this.stats.remoteTasksCompleted += 1;
      } else {
        this.stats.inlineTasksCompleted += 1;
      }
    } else {
      this.stats.totalTasksFailed += 1;
      runtimeStats.failed += 1;
      taskFamilyStats.failed += 1;
      if (String(mode || '').startsWith('remote-')) {
        this.stats.remoteTasksFailed += 1;
        if (errorKind === 'timeout') this.stats.remoteTasksTimedOut += 1;
        if (errorKind === 'rejected') this.stats.remoteTasksRejected += 1;
        if (errorKind === 'verification-failed') this.stats.remoteTasksVerificationFailed += 1;
        if (errorKind === 'validation-failed') this.stats.remoteTasksValidationFailed += 1;
        if (retry?.exhausted) this.stats.remoteTasksRetryExhausted += 1;
      }
    }

    this.stats.totalTaskDurationMs += durationMs;
    this.stats.lastTaskDurationMs = Number(durationMs.toFixed(3));
    this.stats.minTaskDurationMs = this.stats.minTaskDurationMs == null
      ? this.stats.lastTaskDurationMs
      : Math.min(this.stats.minTaskDurationMs, this.stats.lastTaskDurationMs);
    this.stats.maxTaskDurationMs = Math.max(this.stats.maxTaskDurationMs, this.stats.lastTaskDurationMs);
    this.stats.averageTaskDurationMs = this.stats.totalTasksCompleted + this.stats.totalTasksFailed > 0
      ? Number((this.stats.totalTaskDurationMs / (this.stats.totalTasksCompleted + this.stats.totalTasksFailed)).toFixed(3))
      : 0;
    this.stats.lastCompletedAt = Date.now();

    runtimeStats.totalDurationMs += durationMs;
    runtimeStats.lastDurationMs = this.stats.lastTaskDurationMs;
    runtimeStats.maxDurationMs = Math.max(runtimeStats.maxDurationMs, runtimeStats.lastDurationMs);
    const runtimeFinished = runtimeStats.completed + runtimeStats.failed;
    runtimeStats.averageDurationMs = runtimeFinished > 0
      ? Number((runtimeStats.totalDurationMs / runtimeFinished).toFixed(3))
      : 0;

    taskFamilyStats.totalDurationMs += durationMs;
    taskFamilyStats.lastDurationMs = this.stats.lastTaskDurationMs;
    taskFamilyStats.maxDurationMs = Math.max(taskFamilyStats.maxDurationMs, taskFamilyStats.lastDurationMs);
    const taskFamilyFinished = taskFamilyStats.completed + taskFamilyStats.failed;
    taskFamilyStats.averageDurationMs = taskFamilyFinished > 0
      ? Number((taskFamilyStats.totalDurationMs / taskFamilyFinished).toFixed(3))
      : 0;

    this._recordExecutorCompletion(task, { ok, durationMs: executorDurationMs });
    this._recordPlacementCompletion(task, {
      ok,
      mode,
      errorKind,
      errorMessage,
      admission,
      provenance,
      retry
    });
  }

  _removeWorker(worker, { terminate = true } = {}) {
    const workerId = this._workerId(worker) || 'worker-unknown';
    if (workerId && this.workerUtilization.has(workerId)) {
      const stats = this.workerUtilization.get(workerId);
      stats.status = 'retired';
    }
    for (const task of this.activeTasks.values()) {
      if (task.worker === worker) {
        this._recordExecutorAbandon(task);
      }
    }
    this.workers = this.workers.filter((entry) => entry !== worker);
    for (const [key, assigned] of this.workerAffinities.entries()) {
      if (assigned === worker) {
        this.workerAffinities.delete(key);
      }
    }
    if (terminate) {
      try {
        worker.terminate?.();
      } catch {}
    }
  }

  _recordWorkerResize({
    reason = 'manual',
    previousTargetWorkers = this.targetWorkerCount,
    previousWorkerCount = this.workers.length
  } = {}) {
    const workerCount = this.workers.length;
    const changed = previousTargetWorkers !== this.targetWorkerCount || previousWorkerCount !== workerCount;
    if (changed) {
      this.workerPoolRevision += 1;
    }
    const event = {
      schema: 'peercompute.compute.worker-resize.v0',
      revision: this.workerPoolRevision,
      reason,
      previousTargetWorkers,
      targetWorkers: this.targetWorkerCount,
      previousWorkerCount,
      workerCount,
      changed,
      timestamp: Date.now()
    };
    this.lastWorkerResize = event;
    if (changed) {
      this.workerResizeHistory.push(event);
      this.workerResizeHistory = this.workerResizeHistory.slice(-16);
    }
    return event;
  }

  _holdWorkerAutoScale(reason = 'manual', durationMs = this.manualWorkerAutoScaleCooldownMs) {
    const safeDuration = normalizeInteger(durationMs, 0, 0, 600000);
    if (safeDuration <= 0) return this._getWorkerAutoScaleHoldStatus();
    const until = Date.now() + safeDuration;
    if (until >= this.workerAutoScaleHoldUntil) {
      this.workerAutoScaleHoldUntil = until;
      this.workerAutoScaleHoldReason = reason;
    }
    return this._getWorkerAutoScaleHoldStatus();
  }

  _getWorkerAutoScaleHoldStatus(now = Date.now()) {
    const remainingMs = Math.max(0, this.workerAutoScaleHoldUntil - now);
    return {
      active: remainingMs > 0,
      reason: remainingMs > 0 ? this.workerAutoScaleHoldReason : null,
      remainingMs,
      until: remainingMs > 0 ? this.workerAutoScaleHoldUntil : null
    };
  }

  _retireIdleWorkers() {
    if (this.workers.length <= this.targetWorkerCount) return;
    const busyWorkers = new Set(Array.from(this.activeTasks.values()).map((entry) => entry.worker));
    for (const worker of [...this.workers].reverse()) {
      if (this.workers.length <= this.targetWorkerCount) break;
      if (busyWorkers.has(worker)) continue;
      this._removeWorker(worker);
      this.workerRetirements += 1;
    }
  }

  _maybeScaleForQueue() {
    if (!this.config.autoScaleWorkers || !this.initialized || !this._supportsWorkers()) return;
    if (this._getWorkerAutoScaleHoldStatus().active) return;
    if (this.workers.length >= this.workerPolicy.maxWorkers) return;
    const pressure = this.activeTasks.size + this.taskQueue.length;
    if (pressure < this.workers.length + this.workerPolicy.scaleUpQueueDepth) return;
    const nextTarget = Math.min(this.workerPolicy.maxWorkers, Math.max(this.targetWorkerCount + 1, pressure));
    this.resizeWorkers(nextTarget, { reason: 'queue-pressure' });
  }

  _scheduleIdleScaleDown() {
    if (!this.config.autoScaleWorkers || this.workerPolicy.idleScaleDownMs < 1) return;
    if (this._getWorkerAutoScaleHoldStatus().active) return;
    if (this.activeTasks.size > 0 || this.taskQueue.length > 0) return;
    if (this.workers.length <= this.workerPolicy.targetWorkers) return;
    clearTimeout(this.scaleDownTimer);
    this.scaleDownTimer = setTimeout(() => {
      this.resizeWorkers(this.workerPolicy.targetWorkers, { reason: 'idle-scale-down' });
    }, this.workerPolicy.idleScaleDownMs);
  }

  _dispatchToWorker(task) {
    const affinityKey = task.payload?.affinityKey;
    const busyWorkers = new Set(Array.from(this.activeTasks.values()).map((entry) => entry.worker));
    let worker = null;

    if (affinityKey && this.workerAffinities.has(affinityKey)) {
      const assigned = this.workerAffinities.get(affinityKey);
      if (!this.workers.includes(assigned)) {
        this.workerAffinities.delete(affinityKey);
      } else if (busyWorkers.has(assigned)) {
        return false;
      } else {
        worker = assigned;
      }
    }

    if (!worker) {
      const assignedWorkers = new Set(this.workerAffinities.values());
      worker = this.workers.find((entry) => !busyWorkers.has(entry) && !assignedWorkers.has(entry))
        || this.workers.find((entry) => !busyWorkers.has(entry));
      if (worker && affinityKey) {
        this.workerAffinities.set(affinityKey, worker);
      }
    }

    if (!worker) return false;
    const workerId = this._workerId(worker) || 'worker-unknown';
    const startedTask = {
      ...task,
      worker,
      workerId,
      startedAt: nowMs(),
      executionMode: 'worker'
    };
    this._recordExecutorStart(workerId, startedTask, { kind: 'worker' });
    this.activeTasks.set(task.id, startedTask);
    worker.postMessage({ type: 'run', ...task.payload });
    return true;
  }

  _buildTaskExecutionReport(task, { mode = null } = {}) {
    const executionMode = mode || task.executionMode || null;
    const runtime = task.runtime || task.payload?.runtime || null;
    const taskFamily = task.taskFamily || task.payload?.taskFamily || null;
    const taskId = task.id || task.payload?.id || null;
    const executorId = task.executorId || (
      executionMode === 'inline' || executionMode === 'inline-fallback'
        ? this.inlineExecutorId
        : null
    );
    const workerId = executionMode === 'worker'
      ? (task.workerId || task.executorId || null)
      : null;
    return {
      schema: COMPUTE_TASK_EXECUTION_SCHEMA,
      taskId,
      runtime,
      taskFamily,
      executionMode,
      executorId,
      workerId
    };
  }

  _attachTaskExecutionReport(result, task, { mode = null } = {}) {
    if (task.payload?.returnEnvelope !== true) return result;
    const computeExecution = this._buildTaskExecutionReport(task, { mode });
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      const next = { ...result };
      if (!next.computeExecution) next.computeExecution = computeExecution;
      if (next.workerId == null && computeExecution.workerId) next.workerId = computeExecution.workerId;
      return next;
    }
    return {
      value: result,
      computeExecution,
      ...(computeExecution.workerId ? { workerId: computeExecution.workerId } : {})
    };
  }

  async _executeInline(task) {
    task.startedAt = nowMs();
    task.executionMode ||= 'inline';
    this._recordExecutorStart(this.inlineExecutorId, task, { kind: 'inline' });
    try {
      const result = await executeTaskPayload(task.payload);
      if (result && typeof result === 'object' && Object.prototype.hasOwnProperty.call(result, 'commitDelta')) {
        if (task.payload?.suppressCommitDelta !== true) {
          this.commitDelta(result.commitDelta);
        }
        const finalResult = Object.prototype.hasOwnProperty.call(result, 'value') ? result.value : result.result;
        this._recordTaskCompletion(task, { ok: true, mode: task.executionMode || 'inline' });
        task.resolve(task.payload?.returnEnvelope === true
          ? this._attachTaskExecutionReport(result, task, { mode: task.executionMode || 'inline' })
          : finalResult);
        return;
      }
      this._recordTaskCompletion(task, { ok: true, mode: task.executionMode || 'inline' });
      task.resolve(task.payload?.returnEnvelope === true
        ? this._attachTaskExecutionReport(result, task, { mode: task.executionMode || 'inline' })
        : result);
    } catch (err) {
      this._recordTaskCompletion(task, { ok: false, mode: task.executionMode || 'inline' });
      task.reject(err);
    }
  }

  _handleWorkerMessage(worker, message) {
    const { id, type, result, error } = message || {};
    const task = this.activeTasks.get(id);
    if (!task) return;

    if (type === 'result') {
      let finalResult = result;
      if (result && typeof result === 'object' && Object.prototype.hasOwnProperty.call(result, 'commitDelta')) {
        if (task.payload?.suppressCommitDelta !== true) {
          this.commitDelta(result.commitDelta);
        }
        finalResult = Object.prototype.hasOwnProperty.call(result, 'value') ? result.value : result.result;
      }
      this._recordTaskCompletion(task, { ok: true, mode: 'worker' });
      task.resolve(task.payload?.returnEnvelope === true
        ? this._attachTaskExecutionReport(result, task, { mode: 'worker' })
        : finalResult);
    } else if (type === 'error') {
      this._recordTaskCompletion(task, { ok: false, mode: 'worker' });
      task.reject(new Error(error || 'Worker task failed'));
    }
    this.activeTasks.delete(id);
    this._retireIdleWorkers();
    this._scheduleIdleScaleDown();
    this._scheduleNext();
  }

  _handleWorkerFailure(worker, error) {
    console.warn('[ComputeManager] Worker error; falling back to inline execution', error);
    this._removeWorker(worker);

    const stranded = [];
    for (const [taskId, task] of this.activeTasks.entries()) {
      if (task.worker !== worker) continue;
      this.activeTasks.delete(taskId);
      stranded.push(task);
    }

    stranded.forEach((task) => {
      if (this.workers.length > 0 && this._dispatchToWorker(task)) {
        return;
      }
      task.executionMode = 'inline-fallback';
      this._executeInline(task);
    });

    this._scheduleNext();
  }

  _scheduleNext() {
    if (this.taskQueue.length === 0) return;
    this._ensureTargetWorkers({ reason: 'queue-dispatch' });
    if (this.workers.length === 0) {
      while (this.taskQueue.length > 0) {
        this._executeInline(this.taskQueue.shift());
      }
      return;
    }

    const remaining = [];
    while (this.taskQueue.length > 0) {
      const next = this.taskQueue.shift();
      if (!this._dispatchToWorker(next)) {
        remaining.push(next);
      }
    }
    this.taskQueue = remaining;
  }

  _ensureTargetWorkers({ reason = 'task-demand' } = {}) {
    if (!this.initialized || !this._supportsWorkers()) return this.workers.length;
    const desired = normalizeInteger(
      this.targetWorkerCount,
      this.workerPolicy.targetWorkers,
      0,
      this.workerPolicy.maxWorkers
    );
    if (desired <= this.workers.length) return this.workers.length;

    const previousTargetWorkers = this.targetWorkerCount;
    const previousWorkerCount = this.workers.length;
    while (this.workers.length < desired) {
      if (!this._spawnWorker()) break;
    }
    if (this.workers.length !== previousWorkerCount) {
      this._recordWorkerResize({
        reason,
        previousTargetWorkers,
        previousWorkerCount
      });
    }
    return this.workers.length;
  }
}
