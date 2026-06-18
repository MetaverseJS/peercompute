import { executeTaskPayload } from './taskRuntime.js';
import { SolverRegistry } from './SolverRegistry.js';
import { GpuResidentLaneManager } from './GpuResidentLaneManager.js';

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
export const COMPUTE_TASK_GRAPH_RESULT_SCHEMA = 'peercompute.compute.task-graph-result.v0';
export const COMPUTE_TASK_GRAPH_CONTEXT_SCHEMA = 'peercompute.compute.task-graph-context.v0';
export const COMPUTE_TASK_GRAPH_CACHE_POLICY_SCHEMA = 'peercompute.compute.task-graph-cache-policy.v0';
export const COMPUTE_TASK_GRAPH_CACHE_INPUTS_SCHEMA = 'peercompute.compute.task-graph-cache-inputs.v0';
export const COMPUTE_TASK_GRAPH_CACHE_ARTIFACT_SCHEMA = 'peercompute.compute.task-graph-cache-artifact.v0';
export const COMPUTE_TASK_GRAPH_CACHE_ADMISSION_SCHEMA = 'peercompute.compute.task-graph-cache-admission.v0';
export const COMPUTE_REMOTE_TASK_GRAPH_CACHE_IMPORT_SCHEMA = 'peercompute.compute.remote-task-graph-cache-import.v0';
export const COMPUTE_REMOTE_TASK_GRAPH_STATE_SEED_POLICY_SCHEMA = 'peercompute.compute.remote-task-graph-state-seed-policy.v0';
export const COMPUTE_TASK_GRAPH_PLACEMENT_POLICY_SCHEMA = 'peercompute.compute.task-graph-placement-policy.v0';
export const COMPUTE_TASK_GRAPH_CANCELLATION_SCHEMA = 'peercompute.compute.task-graph-cancellation.v0';
export const COMPUTE_TASK_GRAPH_GPU_LANE_SCHEMA = 'peercompute.compute.task-graph-gpu-resident-lane.v0';
export const COMPUTE_GPU_FENCE_REPORT_SCHEMA = 'peercompute.compute.gpu-fence-report.v0';
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

function uniqueStringList(...values) {
  const seen = new Set();
  const output = [];
  for (const value of values) {
    for (const entry of normalizeStringList(value, [])) {
      if (seen.has(entry)) continue;
      seen.add(entry);
      output.push(entry);
    }
  }
  return output;
}

function firstNonNull(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null) return value;
  }
  return null;
}

function normalizeGpuFenceRequirements(task = {}) {
  const webgpu = task.webgpu || task.data?.webgpu || {};
  const source = task.gpuFence
    || task.gpuFenceRequirement
    || webgpu.gpuFence
    || webgpu.fence
    || webgpu.fenceRequirement
    || {};
  const required = source.required === true
    || source.fenceRequired === true
    || webgpu.fenceRequired === true
    || webgpu.requiresFence === true
    || webgpu.requiresQueueFence === true;
  const laneId = firstNonNull(source.laneId, source.gpuLaneId, webgpu.laneId, webgpu.gpuLaneId);
  const stateKey = firstNonNull(
    source.stateKey,
    source.gpuStateKey,
    webgpu.stateKey,
    webgpu.gpuStateKey,
    task.stateKey,
    task.data?.stateKey,
    task.data?.input?.stateKey
  );
  const queueFencePolicy = firstNonNull(
    source.queueFencePolicy,
    source.fencePolicy,
    webgpu.queueFencePolicy,
    webgpu.fencePolicy
  );
  const retainedBufferRefs = normalizeStringList(
    source.retainedBufferRefs ?? webgpu.retainedBufferRefs,
    []
  );
  if (!required && !laneId && !stateKey && !queueFencePolicy && retainedBufferRefs.length === 0) return null;
  return {
    schema: 'peercompute.compute.gpu-fence-requirement.v0',
    required,
    laneId: laneId ? String(laneId) : null,
    stateKey: stateKey ? String(stateKey) : null,
    queueFencePolicy: queueFencePolicy ? String(queueFencePolicy) : null,
    retainedBufferRefs,
    source: source.source || (webgpu && Object.keys(webgpu).length > 0 ? 'task.webgpu' : 'task.gpuFence')
  };
}

function normalizeGpuResidentLaneLeaseSpec(task = {}, gpuFenceRequirement = null) {
  const webgpu = task.webgpu || task.data?.webgpu || {};
  const source = task.gpuResidentLane
    || task.gpuResidentLaneLease
    || task.residentLane
    || webgpu.gpuResidentLane
    || webgpu.residentLane
    || {};
  const residency = firstNonNull(
    source.residency,
    webgpu.residency,
    task.residency,
    task.data?.residency
  );
  const enabled = source.enabled === true
    || source.required === true
    || source.leaseRequired === true
    || String(residency || '').trim().toLowerCase() === 'gpu-lane';
  const laneId = firstNonNull(
    source.laneId,
    source.gpuLaneId,
    webgpu.laneId,
    webgpu.gpuLaneId,
    gpuFenceRequirement?.laneId
  );
  const stateKey = firstNonNull(
    source.stateKey,
    source.gpuStateKey,
    webgpu.stateKey,
    webgpu.gpuStateKey,
    task.stateKey,
    task.data?.stateKey,
    task.data?.input?.stateKey,
    gpuFenceRequirement?.stateKey
  );
  const domainKey = firstNonNull(source.domainKey, source.domain, webgpu.domainKey, task.domainKey, task.data?.domainKey);
  const queueFencePolicy = firstNonNull(
    source.queueFencePolicy,
    source.fencePolicy,
    webgpu.queueFencePolicy,
    gpuFenceRequirement?.queueFencePolicy
  );
  const retainedBufferRefs = normalizeStringList(
    source.retainedBufferRefs ?? webgpu.retainedBufferRefs,
    gpuFenceRequirement?.retainedBufferRefs || []
  );
  const copyBudget = source.copyBudget && typeof source.copyBudget === 'object'
    ? JSON.parse(JSON.stringify(source.copyBudget))
    : (webgpu.copyBudget && typeof webgpu.copyBudget === 'object'
        ? JSON.parse(JSON.stringify(webgpu.copyBudget))
        : {});
  const residentSequenceLaneContract = firstNonNull(
    source.residentSequenceLaneContract,
    source.residentLaneContract,
    source.laneContract,
    webgpu.residentSequenceLaneContract,
    task.data?.residentSequenceLaneContract,
    task.data?.input?.residentSequenceLaneContract,
    task.lawGraphNode?.residentSequenceLaneContract,
    null
  );
  if (!enabled && !laneId && !stateKey && retainedBufferRefs.length === 0 && Object.keys(copyBudget).length === 0) {
    return null;
  }
  const localExecutionRaw = String(firstNonNull(source.localExecution, source.executionMode, webgpu.localExecution, 'inline') || 'inline')
    .trim()
    .toLowerCase();
  return {
    schema: 'peercompute.compute.gpu-resident-lane-task.v0',
    enabled: true,
    localExecution: localExecutionRaw === 'worker' ? 'worker' : 'inline',
    laneId: laneId ? String(laneId) : null,
    stateKey: stateKey ? String(stateKey) : null,
    domainKey: domainKey ? String(domainKey) : null,
    solverId: firstNonNull(source.solverId, task.solverId, task.data?.solverId) || null,
    owner: firstNonNull(source.owner, task.owner, task.taskFamily, task.solverId, 'compute-manager-task'),
    readFamilies: normalizeStringList(source.readFamilies ?? source.reads ?? webgpu.readFamilies),
    writeFamilies: normalizeStringList(source.writeFamilies ?? source.writes ?? webgpu.writeFamilies),
    retainedBufferRefs,
    queueFencePolicy: queueFencePolicy ? String(queueFencePolicy) : null,
    copyBudget,
    residentSequenceLaneContract: residentSequenceLaneContract && typeof residentSequenceLaneContract === 'object'
      ? cloneTaskGraphCacheValue(residentSequenceLaneContract)
      : null
  };
}

function cloneTaskGraphCacheValue(value) {
  if (value == null) return value;
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      // Fall through for function-bearing diagnostic objects.
    }
  }
  return JSON.parse(JSON.stringify(value));
}

function normalizeTaskGraphCacheInputs(graph = {}, normalizedNodes = []) {
  const source = graph.cacheInputs
    || graph.cachePolicy?.inputs
    || graph.cache?.inputs
    || graph.inputRefs
    || null;
  const raw = source && typeof source === 'object' ? source : {};
  const stateRefs = normalizeStringList(raw.stateRefs ?? raw.states ?? graph.stateRefs);
  const closureRefs = normalizeStringList(raw.closureRefs ?? raw.closures ?? graph.closureRefs);
  const invalidationRefs = normalizeStringList(raw.invalidationRefs ?? raw.invalidates ?? graph.invalidationRefs);
  const retainedBufferRefs = normalizeStringList(raw.retainedBufferRefs ?? graph.retainedBufferRefs);
  const inputHashes = normalizeStringList(raw.inputHashes ?? raw.hashes ?? graph.inputHashes);
  const lawIds = normalizeStringList(raw.lawIds ?? raw.laws ?? graph.lawIds);
  const stateFamilies = normalizeStringList(raw.stateFamilies ?? graph.stateFamilies);
  const readFamilies = normalizeStringList(raw.readFamilies ?? graph.readFamilies);
  const writeFamilies = normalizeStringList(raw.writeFamilies ?? graph.writeFamilies);
  const values = firstNonNull(raw.values, raw.value, raw.parameters, graph.cacheInputValues, null);
  const nodeInputs = normalizedNodes.map((node) => ({
    id: node.id,
    dependsOn: [...node.dependsOn],
    taskFamily: node.taskFamily || node.task?.taskFamily || node.task?.solverId || null,
    solverId: node.solverId || node.task?.solverId || null,
    cacheInput: firstNonNull(node.cacheInput, node.cacheInputs, node.task?.cacheInput, null)
  }));
  const hasDeclaredInputs = source != null
    || stateRefs.length > 0
    || closureRefs.length > 0
    || invalidationRefs.length > 0
    || retainedBufferRefs.length > 0
    || inputHashes.length > 0
    || lawIds.length > 0
    || stateFamilies.length > 0
    || readFamilies.length > 0
    || writeFamilies.length > 0
    || values != null
    || nodeInputs.some((node) => node.cacheInput != null || node.taskFamily || node.solverId);
  if (!hasDeclaredInputs) return null;
  const material = {
    graphFamily: String(firstNonNull(raw.graphFamily, graph.graphFamily, graph.taskFamily, 'task-graph') || 'task-graph'),
    graphVersion: String(firstNonNull(raw.graphVersion, graph.graphVersion, graph.version, 'v0') || 'v0'),
    lawGraphId: firstNonNull(raw.lawGraphId, graph.lawGraphId, null),
    stateRefs,
    closureRefs,
    invalidationRefs,
    retainedBufferRefs,
    inputHashes,
    lawIds,
    stateFamilies,
    readFamilies,
    writeFamilies,
    scaleRegime: firstNonNull(raw.scaleRegime, graph.scaleRegime, null),
    units: firstNonNull(raw.units, graph.units, null),
    values,
    nodes: nodeInputs
  };
  const inputHash = hashString(stableSerialize(material));
  return {
    schema: COMPUTE_TASK_GRAPH_CACHE_INPUTS_SCHEMA,
    status: 'content-addressed-inputs-declared',
    inputHash,
    stateRefs,
    closureRefs,
    invalidationRefs,
    retainedBufferRefs,
    inputHashes,
    lawIds,
    stateFamilies,
    readFamilies,
    writeFamilies,
    nodeCount: normalizedNodes.length,
    source: source ? 'graph.cacheInputs' : 'graph-derived-input-refs'
  };
}

function normalizeTaskGraphCachePolicy(graph = {}, normalizedNodes = []) {
  const source = graph.cachePolicy || graph.cache || {};
  const explicitCacheKey = String(firstNonNull(graph.cacheKey, source.cacheKey, source.key, '') || '').trim() || null;
  const cacheInputs = normalizeTaskGraphCacheInputs(graph, normalizedNodes);
  const cacheScope = String(firstNonNull(source.scope, graph.cacheScope, 'compute-manager-local') || 'compute-manager-local');
  const derivedCacheKey = cacheInputs ? `${cacheScope}:${cacheInputs.inputHash}` : null;
  const cacheKey = explicitCacheKey || derivedCacheKey;
  const requestedMode = String(firstNonNull(graph.cacheMode, source.mode, cacheKey ? 'read-through' : 'disabled') || 'disabled')
    .trim()
    .toLowerCase();
  const enabled = source.enabled !== false && cacheKey != null && requestedMode !== 'disabled' && requestedMode !== 'off';
  let mode = 'disabled';
  if (enabled) {
    if (requestedMode === 'record-only' || requestedMode === 'write-only') {
      mode = 'record-only';
    } else if (requestedMode === 'read-only') {
      mode = 'read-only';
    } else {
      mode = 'read-through';
    }
  }
  return {
    schema: COMPUTE_TASK_GRAPH_CACHE_POLICY_SCHEMA,
    cacheKey,
    mode,
    readEnabled: mode === 'read-through' || mode === 'read-only',
    writeEnabled: mode === 'read-through' || mode === 'record-only',
    ttlMs: normalizeInteger(source.ttlMs ?? graph.cacheTtlMs, 0, 0, Number.MAX_SAFE_INTEGER),
    scope: cacheScope,
    requireAdmitted: source.requireAdmitted !== false && graph.cacheRequireAdmitted !== false,
    explicitCacheKey,
    derivedCacheKey,
    keySource: explicitCacheKey ? 'explicit' : (derivedCacheKey ? 'content-addressed-inputs' : null),
    inputHash: cacheInputs?.inputHash || null,
    inputs: cacheInputs,
    status: enabled ? 'cache-policy-enabled' : 'cache-policy-disabled'
  };
}

function normalizeTaskGraphStateSeedPayload(graph = {}) {
  const source = firstNonNull(
    graph.stateSeedPayload,
    graph.cachePolicy?.stateSeedPayload,
    graph.cache?.stateSeedPayload,
    graph.remoteStateSeedPayload,
    null
  );
  return source == null ? null : cloneTaskGraphCacheValue(source);
}

function cloneTaskGraphResultInput(value, seen = new WeakSet()) {
  if (value == null) return value;
  if (typeof value === 'function' || typeof value === 'symbol') return undefined;
  if (typeof value !== 'object') return value;
  if (ArrayBuffer.isView(value)) return new value.constructor(value);
  if (value instanceof ArrayBuffer) return value.slice(0);
  if (seen.has(value)) return null;
  seen.add(value);
  if (Array.isArray(value)) {
    return value
      .map((entry) => cloneTaskGraphResultInput(entry, seen))
      .filter((entry) => entry !== undefined);
  }
  const copy = {};
  for (const [key, entry] of Object.entries(value)) {
    const cloned = cloneTaskGraphResultInput(entry, seen);
    if (cloned !== undefined) copy[key] = cloned;
  }
  return copy;
}

function injectTaskGraphResultInputs(task = {}, node = {}, nodeResults = {}) {
  const resultInputs = node.resultInputs
    || node.resultInputMap
    || (task && typeof task === 'object' ? task.resultInputs : null);
  if (!resultInputs || typeof resultInputs !== 'object' || Array.isArray(resultInputs)) {
    return task;
  }
  const data = task.data && typeof task.data === 'object' && !Array.isArray(task.data)
    ? { ...task.data }
    : {};
  const injected = {};
  for (const [inputName, source] of Object.entries(resultInputs)) {
    const sourceNodeId = typeof source === 'string'
      ? source
      : String(source?.nodeId || source?.resultId || source?.from || '').trim();
    if (!inputName || !sourceNodeId) continue;
    if (!Object.prototype.hasOwnProperty.call(nodeResults, sourceNodeId)) {
      throw new Error(`Task graph node ${node.id} requested unavailable result input ${inputName} from ${sourceNodeId}`);
    }
    data[inputName] = cloneTaskGraphResultInput(nodeResults[sourceNodeId]);
    injected[inputName] = sourceNodeId;
  }
  if (Object.keys(injected).length === 0) return task;
  return {
    ...task,
    data,
    taskGraphResultInputs: injected
  };
}

function normalizeTaskGraphCacheAdmission(graph = {}, cachePolicy = {}) {
  const source = graph.cacheAdmission
    || graph.cachePolicy?.admission
    || graph.cache?.admission
    || {};
  const admitted = source.admitted === true
    || source.accepted === true
    || source.status === 'admitted'
    || source.status === 'admission-accepted';
  const recordOnly = cachePolicy.mode === 'record-only';
  const status = source.status
    || (admitted ? 'admitted' : (recordOnly ? 'recorded-not-admitted' : 'pending-admission'));
  return {
    schema: COMPUTE_TASK_GRAPH_CACHE_ADMISSION_SCHEMA,
    status,
    admitted,
    authority: String(firstNonNull(source.authority, graph.cacheAuthority, 'compute-manager-local') || 'compute-manager-local'),
    admissionId: firstNonNull(source.admissionId, source.id, null),
    validatorId: firstNonNull(source.validatorId, source.validator, null),
    reason: String(firstNonNull(
      source.reason,
      recordOnly ? 'record-only-cache-artifact-requires-state-manager-admission' : 'cache-artifact-admission-pending',
      ''
    ) || ''),
    invalidationRefs: normalizeStringList(source.invalidationRefs ?? cachePolicy.inputs?.invalidationRefs),
    acceptedAt: admitted ? (source.acceptedAt || Date.now()) : null
  };
}

function createTaskGraphCacheArtifact({
  graphId,
  cachePolicy,
  result,
  storedAt,
  expiresAt,
  admission
} = {}) {
  const resultHash = hashString(stableSerialize({
    schema: result?.schema,
    graphId: result?.graphId,
    status: result?.status,
    nodeReports: result?.nodeReports,
    nodeResults: result?.nodeResults
  }));
  return {
    schema: COMPUTE_TASK_GRAPH_CACHE_ARTIFACT_SCHEMA,
    artifactId: `${cachePolicy.cacheKey}:artifact`,
    cacheKey: cachePolicy.cacheKey,
    cacheScope: cachePolicy.scope,
    cacheKeySource: cachePolicy.keySource,
    inputHash: cachePolicy.inputHash,
    resultHash,
    graphId,
    status: admission?.admitted ? 'admitted-cache-artifact-recorded' : 'recorded-not-admitted',
    admitted: admission?.admitted === true,
    admission,
    inputs: cachePolicy.inputs,
    invalidationRefs: normalizeStringList(admission?.invalidationRefs, cachePolicy.inputs?.invalidationRefs || []),
    stateSeedPayload: result?.stateSeedPayload != null
      ? cloneTaskGraphCacheValue(result.stateSeedPayload)
      : null,
    storedAt,
    expiresAt,
    ttlMs: cachePolicy.ttlMs,
    resultSchema: result?.schema || null,
    nodeCount: result?.nodeCount ?? null,
    resultNodeSchemas: (result?.nodeReports || []).map((report) => ({
      nodeId: report.nodeId,
      resultSchema: report.resultSchema || null,
      taskFamily: report.taskFamily || null
    }))
  };
}

function normalizeTaskGraphPlacementPolicy(graph = {}) {
  const source = graph.placementPolicy || graph.placement || graph.placementHint || {};
  const requestedPlacement = String(firstNonNull(
    source.requestedPlacement,
    source.placement,
    source.mode,
    graph.requestedPlacement,
    graph.placementMode,
    'local'
  ) || 'local').trim().toLowerCase();
  return {
    schema: COMPUTE_TASK_GRAPH_PLACEMENT_POLICY_SCHEMA,
    requestedPlacement,
    locality: String(firstNonNull(source.locality, graph.locality, requestedPlacement === 'local' ? 'local-inline' : 'distributed') || ''),
    authority: String(firstNonNull(source.authority, graph.authority, 'compute-manager') || 'compute-manager'),
    targetPeerIds: normalizeStringList(source.targetPeerIds ?? source.peers ?? graph.targetPeerIds),
    targetClusterId: firstNonNull(source.targetClusterId, source.clusterId, graph.targetClusterId, null),
    gpuResident: source.gpuResident === true || source.gpuLane === true || graph.gpuResident === true,
    advisory: source.advisory !== false
  };
}

function normalizeTaskGraphGpuResidentLaneSpec(graph = {}, graphId = null) {
  const webgpu = graph.webgpu || {};
  const source = graph.gpuResidentLane
    || graph.gpuResidentLaneLease
    || graph.residentLane
    || webgpu.gpuResidentLane
    || webgpu.residentLane
    || {};
  const residency = firstNonNull(source.residency, webgpu.residency, graph.residency);
  const enabled = source.enabled === true
    || source.required === true
    || source.leaseRequired === true
    || String(residency || '').trim().toLowerCase() === 'gpu-lane';
  const laneId = firstNonNull(source.laneId, source.gpuLaneId, webgpu.laneId, webgpu.gpuLaneId);
  const stateKey = firstNonNull(source.stateKey, source.gpuStateKey, webgpu.stateKey, webgpu.gpuStateKey, graph.stateKey);
  const domainKey = firstNonNull(source.domainKey, source.domain, webgpu.domainKey, graph.domainKey);
  const retainedBufferRefs = normalizeStringList(source.retainedBufferRefs ?? webgpu.retainedBufferRefs ?? graph.retainedBufferRefs);
  const copyBudget = source.copyBudget && typeof source.copyBudget === 'object'
    ? cloneTaskGraphCacheValue(source.copyBudget)
    : (webgpu.copyBudget && typeof webgpu.copyBudget === 'object' ? cloneTaskGraphCacheValue(webgpu.copyBudget) : {});
  if (!enabled && !laneId && !stateKey && retainedBufferRefs.length === 0 && Object.keys(copyBudget).length === 0) {
    return null;
  }
  return {
    schema: COMPUTE_TASK_GRAPH_GPU_LANE_SCHEMA,
    enabled: true,
    laneId: laneId ? String(laneId) : null,
    stateKey: stateKey ? String(stateKey) : null,
    domainKey: domainKey ? String(domainKey) : null,
    solverId: firstNonNull(source.solverId, graph.solverId, null),
    taskId: graphId,
    owner: firstNonNull(source.owner, graph.owner, 'compute-manager-task-graph'),
    readFamilies: normalizeStringList(source.readFamilies ?? source.reads ?? webgpu.readFamilies ?? graph.readFamilies),
    writeFamilies: normalizeStringList(source.writeFamilies ?? source.writes ?? webgpu.writeFamilies ?? graph.writeFamilies),
    retainedBufferRefs,
    queueFencePolicy: firstNonNull(source.queueFencePolicy, source.fencePolicy, webgpu.queueFencePolicy, null),
    copyBudget
  };
}

function gpuFenceStatusSatisfied(status) {
  return [
    'gpu-fence-completed',
    'remote-gpu-fence-completed',
    'queue-work-completed',
    'readback-map-completed',
    'ordered-before-consumer-queue-completed'
  ].includes(String(status || ''));
}

function normalizeGpuFenceReport(source = null, requirement = null) {
  const raw = source && typeof source === 'object' ? source : {};
  const status = raw.status
    || raw.queueCompletionStatus
    || raw.fenceStatus
    || raw.completionStatus
    || (requirement?.required ? 'gpu-fence-report-missing' : null);
  if (!status && !requirement?.required) return null;
  const method = raw.method
    || raw.queueCompletionMethod
    || raw.fenceMethod
    || raw.completionMethod
    || null;
  const fenceSatisfied = raw.fenceSatisfied === true
    || raw.satisfied === true
    || raw.completed === true
    || gpuFenceStatusSatisfied(status);
  return {
    schema: raw.schema || COMPUTE_GPU_FENCE_REPORT_SCHEMA,
    status,
    method,
    fenceSatisfied,
    required: requirement?.required === true || raw.required === true,
    laneId: firstNonNull(raw.laneId, raw.gpuLaneId, requirement?.laneId),
    stateKey: firstNonNull(raw.stateKey, raw.gpuStateKey, requirement?.stateKey),
    queueFencePolicy: firstNonNull(raw.queueFencePolicy, raw.fencePolicy, requirement?.queueFencePolicy),
    queueCompletionStatus: raw.queueCompletionStatus || status || null,
    queueCompletionMethod: raw.queueCompletionMethod || method || null,
    retainedBufferRefs: normalizeStringList(raw.retainedBufferRefs, requirement?.retainedBufferRefs || []),
    workerId: raw.workerId || raw.remoteWorkerId || null,
    deviceId: raw.deviceId || raw.gpuDeviceId || null,
    completedAt: raw.completedAt || null,
    source: raw.source || null
  };
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
      gpuFence: raw.gpuFence && typeof raw.gpuFence === 'object'
        ? JSON.parse(JSON.stringify(raw.gpuFence))
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
    this.activeTaskGraphs = new Map();
    this.taskGraphCache = new Map();
    this.taskGraphCacheArtifacts = new Map();
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
    this.gpuResidentLaneManager = config.gpuResidentLaneManager || new GpuResidentLaneManager({
      gpuHub: config.gpuHub || null,
      deviceId: config.gpuDeviceId || config.deviceId || 'compute-manager-gpu'
    });
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
      taskGraphsSubmitted: 0,
      taskGraphsCompleted: 0,
      taskGraphsFailed: 0,
      taskGraphsCancelled: 0,
      taskGraphCacheHits: 0,
      taskGraphCacheWrites: 0,
      taskGraphCacheArtifactsWritten: 0,
      taskGraphCacheArtifactsAdmitted: 0,
      taskGraphRemoteCacheImports: 0,
      taskGraphRemoteCacheImportBlocked: 0,
      taskGraphCacheInvalidations: 0,
      taskGraphCacheReadBlocked: 0,
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
    const gpuFence = normalizeGpuFenceRequirements(task);
    const gpuResidentLane = normalizeGpuResidentLaneLeaseSpec(task, gpuFence);
    this._recordPlacementSubmitted(placement);
    const payload = {
      id,
      runtime,
      taskFamily,
      solverId: task.solverId,
      placement,
      gpuFence,
      gpuResidentLane,
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

  async submitTaskGraph(graph = {}) {
    const graphId = String(graph.graphId || graph.id || `task-graph:${Date.now()}`).trim();
    const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
    if (!nodes.length) {
      throw new Error('submitTaskGraph requires at least one node');
    }
    const normalizedNodes = [];
    const nodeById = new Map();
    for (const rawNode of nodes) {
      const id = String(rawNode?.id || rawNode?.nodeId || rawNode?.task?.id || '').trim();
      if (!id) throw new Error('submitTaskGraph node id is required');
      if (nodeById.has(id)) throw new Error(`Duplicate task graph node id: ${id}`);
      const dependsOn = normalizeStringList(rawNode.dependsOn || rawNode.dependencies || []);
      const node = {
        ...rawNode,
        id,
        dependsOn
      };
      normalizedNodes.push(node);
      nodeById.set(id, node);
    }
    for (const node of normalizedNodes) {
      for (const dependencyId of node.dependsOn) {
        if (!nodeById.has(dependencyId)) {
          throw new Error(`Task graph node ${node.id} depends on unknown node ${dependencyId}`);
        }
      }
    }

    this.stats.taskGraphsSubmitted += 1;
    const cachePolicy = normalizeTaskGraphCachePolicy(graph, normalizedNodes);
    const stateSeedPayload = normalizeTaskGraphStateSeedPayload(graph);
    const cacheAdmission = normalizeTaskGraphCacheAdmission(graph, cachePolicy);
    const placementPolicy = normalizeTaskGraphPlacementPolicy(graph);
    const graphLaneSpec = normalizeTaskGraphGpuResidentLaneSpec(graph, graphId);
    const cancellationMode = String(graph.cancellation?.mode || graph.cancellationMode || 'cooperative').trim() || 'cooperative';
    const abortSignal = graph.abortSignal || graph.cancelSignal || graph.signal || graph.cancellation?.signal || null;
    const cancellation = {
      schema: COMPUTE_TASK_GRAPH_CANCELLATION_SCHEMA,
      mode: cancellationMode,
      status: 'not-cancelled',
      reason: null
    };
    let cacheEntry = cachePolicy.readEnabled ? this.taskGraphCache.get(cachePolicy.cacheKey) : null;
    const nowWall = Date.now();
    if (cacheEntry && cacheEntry.expiresAt && cacheEntry.expiresAt <= nowWall) {
      this.taskGraphCache.delete(cachePolicy.cacheKey);
      this.taskGraphCacheArtifacts.delete(cachePolicy.cacheKey);
      cacheEntry = null;
    }
    let cacheReadBlockStatus = null;
    if (cacheEntry && cachePolicy.requireAdmitted && cacheEntry.artifact?.admitted !== true) {
      this.stats.taskGraphCacheReadBlocked += 1;
      cacheReadBlockStatus = 'blocked-unadmitted-cache-artifact';
      cacheEntry = null;
    }
    if (cacheEntry) {
      this.stats.taskGraphCacheHits += 1;
      this.stats.taskGraphsCompleted += 1;
      const cached = cloneTaskGraphCacheValue(cacheEntry.result);
      const cacheArtifact = cloneTaskGraphCacheValue(cacheEntry.artifact || cached.cacheArtifact || null);
      return {
        ...cached,
        cachePolicy,
        cacheAdmission: cacheArtifact?.admission || cached.cacheAdmission || cacheAdmission,
        cacheAdmissionStatus: cacheArtifact?.admission?.status || cached.cacheAdmissionStatus || null,
        cacheArtifact,
        cacheArtifactSchema: cacheArtifact?.schema || null,
        cacheArtifactStatus: cacheArtifact?.status || null,
        cacheStatus: 'hit',
        cacheHit: true,
        cachedAt: cacheEntry.storedAt,
        durationMs: 0
      };
    }

    const pending = new Map(normalizedNodes.map((node) => [node.id, node]));
    const nodeResults = {};
    const nodeReports = [];
    const executionOrder = [];
    const executionBatches = [];
    const startedAt = nowMs();
    const activeGraph = {
      graphId,
      startedAt,
      cancelled: abortSignal?.aborted === true,
      reason: abortSignal?.reason || null,
      cacheKey: cachePolicy.cacheKey,
      stateSeedPayload,
      placementPolicy,
      graphLaneSpec
    };
    const onAbort = () => {
      activeGraph.cancelled = true;
      activeGraph.reason = abortSignal?.reason || 'abort-signal';
    };
    if (abortSignal?.addEventListener) abortSignal.addEventListener('abort', onAbort, { once: true });
    this.activeTaskGraphs.set(graphId, activeGraph);

    const assertNotCancelled = () => {
      if (!activeGraph.cancelled) return;
      cancellation.status = 'cancelled';
      cancellation.reason = String(activeGraph.reason || 'cancelled');
      const err = new Error(`Task graph cancelled: ${graphId}`);
      err.code = 'TASK_GRAPH_CANCELLED';
      err.graphId = graphId;
      err.cancellation = { ...cancellation };
      throw err;
    };

    let graphLease = null;
    let graphLeaseExecution = null;
    let graphLeaseStatus = graphLaneSpec ? 'required' : 'not-required';
    let cacheStatus = cacheReadBlockStatus || (cachePolicy.readEnabled
      ? 'miss'
      : (cachePolicy.writeEnabled ? 'record-only' : 'disabled'));

    try {
      assertNotCancelled();
      if (graphLaneSpec) {
        graphLease = this.acquireGpuResidentLaneLease({
          ...graphLaneSpec,
          taskId: graphId,
          owner: graphLaneSpec.owner || 'compute-manager-task-graph'
        });
        graphLeaseStatus = 'active';
      }

      while (pending.size > 0) {
        assertNotCancelled();
        const completedNodeIds = new Set(Object.keys(nodeResults));
        const ready = Array.from(pending.values())
          .filter((node) => node.dependsOn.every((dependencyId) => completedNodeIds.has(dependencyId)));
        if (!ready.length) {
          throw new Error(`Task graph has a cycle or unsatisfied dependency: ${Array.from(pending.keys()).join(', ')}`);
        }
        executionBatches.push(ready.map((node) => node.id));
        const readyResults = await Promise.all(ready.map(async (node) => {
          assertNotCancelled();
          const context = {
            schema: COMPUTE_TASK_GRAPH_CONTEXT_SCHEMA,
            graphId,
            nodeId: node.id,
            dependsOn: [...node.dependsOn],
            completedNodeIds: Object.keys(nodeResults),
            nodeResults,
            results: nodeResults,
            cachePolicy,
            cacheKey: cachePolicy.cacheKey,
            cacheInputs: cachePolicy.inputs,
            stateSeedPayload,
            placementPolicy,
            cancellation,
            graphLease,
            graphLeaseSpec: graphLaneSpec,
            getResult(id) {
              return nodeResults[id];
            }
          };
          let task = typeof node.createTask === 'function'
            ? await node.createTask(context)
            : typeof node.task === 'function'
              ? await node.task(context)
              : node.task;
          if (!task || typeof task !== 'object') {
            throw new Error(`Task graph node ${node.id} did not produce a task`);
          }
          task = injectTaskGraphResultInputs(task, node, nodeResults);
          assertNotCancelled();
          const nodeStartedAt = nowMs();
          const result = await this.submitTask(task);
          assertNotCancelled();
          return {
            node,
            task,
            result,
            durationMs: Math.max(0, nowMs() - nodeStartedAt)
          };
        }));
        for (const entry of readyResults) {
          pending.delete(entry.node.id);
          nodeResults[entry.node.id] = entry.result;
          executionOrder.push(entry.node.id);
          nodeReports.push({
            nodeId: entry.node.id,
            dependsOn: [...entry.node.dependsOn],
            taskId: entry.task.id || null,
            taskFamily: entry.task.taskFamily || entry.task.solverId || null,
            solverId: entry.task.solverId || null,
            status: 'completed',
            durationMs: entry.durationMs,
            resultSchema: entry.result?.computeTaskResultSchema || entry.result?.schema || null
          });
        }
      }

      if (graphLease?.leaseId) {
        graphLeaseExecution = this.completeGpuResidentLaneLease(graphLease.leaseId, {
          status: 'ordered-before-consumer-queue-completed',
          method: 'compute-manager-task-graph-completion',
          queueCompletionStatus: 'ordered-before-consumer-queue-completed',
          queueCompletionMethod: 'compute-manager-task-graph-completion',
          releaseReason: 'task-graph-completed'
        });
        graphLeaseStatus = graphLeaseExecution?.lease?.status || 'completed';
      }

      const result = {
        schema: COMPUTE_TASK_GRAPH_RESULT_SCHEMA,
        graphId,
        status: 'completed',
        nodeCount: normalizedNodes.length,
        edgeCount: normalizedNodes.reduce((sum, node) => sum + node.dependsOn.length, 0),
        executionOrder,
        executionBatches,
        nodeReports,
        nodeResults,
        cachePolicy,
        cacheKey: cachePolicy.cacheKey,
        cacheKeySource: cachePolicy.keySource,
        cacheInputHash: cachePolicy.inputHash,
        cacheInputs: cachePolicy.inputs,
        stateSeedPayload,
        cacheAdmission,
        cacheAdmissionStatus: cacheAdmission.status,
        cacheArtifact: null,
        cacheArtifactSchema: null,
        cacheArtifactStatus: null,
        cacheStatus,
        cacheHit: false,
        placementPolicy,
        cancellation,
        cancellationStatus: cancellation.status,
        graphLeaseRequired: graphLaneSpec != null,
        graphLeaseStatus,
        graphLeaseSpec: graphLaneSpec,
        graphLease,
        graphLeaseExecution,
        durationMs: Math.max(0, nowMs() - startedAt)
      };
      if (cachePolicy.writeEnabled) {
        const storedAt = Date.now();
        const expiresAt = cachePolicy.ttlMs > 0 ? storedAt + cachePolicy.ttlMs : null;
        const cacheArtifact = createTaskGraphCacheArtifact({
          graphId,
          cachePolicy,
          result,
          storedAt,
          expiresAt,
          admission: cacheAdmission
        });
        this.taskGraphCache.set(cachePolicy.cacheKey, {
          storedAt,
          expiresAt,
          artifact: cloneTaskGraphCacheValue(cacheArtifact),
          result: cloneTaskGraphCacheValue(result)
        });
        this.taskGraphCacheArtifacts.set(cachePolicy.cacheKey, cloneTaskGraphCacheValue(cacheArtifact));
        this.stats.taskGraphCacheWrites += 1;
        this.stats.taskGraphCacheArtifactsWritten += 1;
        cacheStatus = cachePolicy.readEnabled ? 'miss-stored' : 'recorded';
        result.cacheStatus = cacheStatus;
        result.cachedAt = storedAt;
        result.cacheArtifact = cacheArtifact;
        result.cacheArtifactSchema = cacheArtifact.schema;
        result.cacheArtifactStatus = cacheArtifact.status;
      }
      this.stats.taskGraphsCompleted += 1;
      return result;
    } catch (err) {
      const wasCancelled = activeGraph.cancelled || err?.code === 'TASK_GRAPH_CANCELLED';
      if (wasCancelled) {
        this.stats.taskGraphsCancelled += 1;
      } else {
        this.stats.taskGraphsFailed += 1;
      }
      if (graphLease?.leaseId && !graphLeaseExecution) {
        try {
          this.rejectGpuResidentLaneLease(graphLease.leaseId, wasCancelled ? 'task-graph-cancelled' : 'task-graph-failed');
          graphLeaseStatus = wasCancelled ? 'rejected-cancelled' : 'rejected-failed';
        } catch {
          graphLeaseStatus = 'reject-failed';
        }
      }
      err.graphId = err.graphId || graphId;
      err.taskGraphStatus = wasCancelled ? 'cancelled' : 'failed';
      err.graphLeaseStatus = graphLeaseStatus;
      err.cancellation = err.cancellation || { ...cancellation };
      throw err;
    } finally {
      if (abortSignal?.removeEventListener) abortSignal.removeEventListener('abort', onAbort);
      this.activeTaskGraphs.delete(graphId);
    }
  }

  getGpuResidentLaneManager() {
    return this.gpuResidentLaneManager;
  }

  getGpuResidentLaneStats() {
    return this.gpuResidentLaneManager?.getStats?.() || null;
  }

  acquireGpuResidentLaneLease(spec = {}) {
    if (!this.gpuResidentLaneManager?.acquireLease) {
      throw new Error('GPU resident lane manager is not available');
    }
    return this.gpuResidentLaneManager.acquireLease(spec);
  }

  completeGpuResidentLaneLease(leaseId, options = {}) {
    if (!this.gpuResidentLaneManager?.completeLease) {
      throw new Error('GPU resident lane manager is not available');
    }
    return this.gpuResidentLaneManager.completeLease(leaseId, options);
  }

  rejectGpuResidentLaneLease(leaseId, reason = 'lane-validation-rejected') {
    if (!this.gpuResidentLaneManager?.rejectLease) {
      throw new Error('GPU resident lane manager is not available');
    }
    return this.gpuResidentLaneManager.rejectLease(leaseId, reason);
  }

  executeGpuResidentLaneStagePlan(leaseId, options = {}) {
    if (!this.gpuResidentLaneManager?.executeStagePlan) {
      throw new Error('GPU resident lane manager cannot execute stage plans');
    }
    return this.gpuResidentLaneManager.executeStagePlan(leaseId, options);
  }

  preflightGpuResidentLaneStagePlacement(leaseId, options = {}) {
    if (!this.gpuResidentLaneManager?.preflightStagePlacement) {
      throw new Error('GPU resident lane manager cannot preflight stage placement');
    }
    return this.gpuResidentLaneManager.preflightStagePlacement(leaseId, options);
  }

  planGpuResidentLaneStagePlacement(leaseId, options = {}) {
    return this.preflightGpuResidentLaneStagePlacement(leaseId, options);
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

  cancelTaskGraph(graphId, reason = 'cancelTaskGraph') {
    const id = String(graphId || '').trim();
    const active = this.activeTaskGraphs.get(id);
    if (!active) {
      return {
        schema: COMPUTE_TASK_GRAPH_CANCELLATION_SCHEMA,
        graphId: id || null,
        status: 'not-found',
        cancelled: false,
        reason: String(reason || 'cancelTaskGraph')
      };
    }
    active.cancelled = true;
    active.reason = String(reason || 'cancelTaskGraph');
    return {
      schema: COMPUTE_TASK_GRAPH_CANCELLATION_SCHEMA,
      graphId: id,
      status: 'cancel-requested',
      cancelled: true,
      reason: active.reason
    };
  }

  listActiveTaskGraphs() {
    return Array.from(this.activeTaskGraphs.values()).map((entry) => ({
      schema: COMPUTE_TASK_GRAPH_RESULT_SCHEMA,
      graphId: entry.graphId,
      status: entry.cancelled ? 'cancel-requested' : 'running',
      startedAt: entry.startedAt,
      cacheKey: entry.cacheKey || null,
      placementPolicy: entry.placementPolicy ? JSON.parse(JSON.stringify(entry.placementPolicy)) : null,
      graphLeaseRequired: entry.graphLaneSpec != null,
      cancellationReason: entry.reason || null
    }));
  }

  getTaskGraphCacheArtifact(cacheKey) {
    const key = String(cacheKey || '').trim();
    const artifact = this.taskGraphCacheArtifacts.get(key);
    return artifact ? cloneTaskGraphCacheValue(artifact) : null;
  }

  listTaskGraphCacheArtifacts() {
    return Array.from(this.taskGraphCacheArtifacts.values())
      .map((artifact) => cloneTaskGraphCacheValue(artifact))
      .sort((a, b) => String(a.cacheKey || '').localeCompare(String(b.cacheKey || '')));
  }

  importRemoteTaskGraphCacheResult(result = {}, admission = {}, options = {}) {
    const artifact = result?.cacheArtifact && typeof result.cacheArtifact === 'object'
      ? result.cacheArtifact
      : null;
    const key = String(artifact?.cacheKey || result?.cacheKey || admission?.cacheKey || '').trim();
    if (!key) {
      this.stats.taskGraphRemoteCacheImportBlocked += 1;
      throw new Error('importRemoteTaskGraphCacheResult requires a cacheKey');
    }
    if (!artifact) {
      this.stats.taskGraphRemoteCacheImportBlocked += 1;
      throw new Error('importRemoteTaskGraphCacheResult requires result.cacheArtifact');
    }
    if (admission?.admitted !== true) {
      this.stats.taskGraphRemoteCacheImportBlocked += 1;
      const err = new Error(`Remote task graph cache artifact is not admitted: ${key}`);
      err.code = 'ERR_REMOTE_TASK_GRAPH_CACHE_ARTIFACT_NOT_ADMITTED';
      err.cacheKey = key;
      throw err;
    }
    const importedAt = Date.now();
    const storedAt = artifact.storedAt || result.cachedAt || importedAt;
    const expiresAt = artifact.expiresAt || null;
    const retainedBufferRefs = normalizeStringList(
      result?.graphLeaseSpec?.retainedBufferRefs,
      result?.cacheInputs?.retainedBufferRefs,
      artifact?.inputs?.retainedBufferRefs
    );
    const remoteGraphLeaseRefs = {
      schema: COMPUTE_TASK_GRAPH_GPU_LANE_SCHEMA,
      source: 'remote-task-graph-result',
      remoteOnly: true,
      usableLocally: false,
      status: retainedBufferRefs.length > 0
        ? 'remote-retained-buffer-refs-metadata-only'
        : 'no-remote-retained-buffer-refs',
      reason: retainedBufferRefs.length > 0
        ? 'remote-gpu-resident-refs-are-not-local-device-leases'
        : 'remote-result-did-not-declare-retained-buffer-refs',
      laneId: result?.graphLeaseSpec?.laneId || result?.graphLease?.laneId || null,
      stateKey: result?.graphLeaseSpec?.stateKey || result?.graphLease?.stateKey || null,
      retainedBufferRefs,
      graphLeaseStatus: result?.graphLeaseStatus || null,
      graphLeaseRequired: result?.graphLeaseRequired === true
    };
    const computeAdmission = {
      schema: COMPUTE_TASK_GRAPH_CACHE_ADMISSION_SCHEMA,
      status: 'admitted',
      admitted: true,
      authority: admission.authority || 'node-kernel-state-manager',
      admissionId: admission.admissionId || null,
      validatorId: admission.validatorId || null,
      reason: admission.reason || 'remote-task-graph-cache-artifact-admitted',
      invalidationRefs: normalizeStringList(admission.invalidationRefs, artifact.invalidationRefs),
      acceptedAt: admission.acceptedAt || admission.admittedAt || importedAt
    };
    const importReport = {
      schema: COMPUTE_REMOTE_TASK_GRAPH_CACHE_IMPORT_SCHEMA,
      status: 'imported-admitted-remote-cache-result',
      cacheKey: key,
      graphId: result?.graphId || artifact.graphId || null,
      sourcePeerId: options.sourcePeerId || admission.sourcePeerId || null,
      responderId: options.responderId || admission.responderId || null,
      requestId: options.requestId || admission.requestId || null,
      admissionId: admission.admissionId || null,
      importedAt,
      remoteArtifactStatus: artifact.status || null,
      remoteArtifactAdmitted: artifact.admitted === true,
      retainedGpuLaneRefs: remoteGraphLeaseRefs,
      retainedGpuLaneRefsStatus: remoteGraphLeaseRefs.status,
      resultHash: artifact.resultHash || null,
      inputHash: artifact.inputHash || result?.cacheInputHash || null
    };
    const importedArtifact = {
      ...cloneTaskGraphCacheValue(artifact),
      cacheKey: key,
      status: 'admitted-remote-cache-artifact-recorded',
      admitted: true,
      admission: computeAdmission,
      stateAdmission: cloneTaskGraphCacheValue(admission),
      remoteCacheImport: importReport,
      remoteGraphLeaseRefs
    };
    const importedResult = {
      ...cloneTaskGraphCacheValue(result),
      cacheKey: key,
      cacheAdmission: computeAdmission,
      cacheAdmissionStatus: computeAdmission.status,
      cacheArtifact: cloneTaskGraphCacheValue(importedArtifact),
      cacheArtifactStatus: importedArtifact.status,
      cacheArtifactSchema: importedArtifact.schema || null,
      cacheStatus: 'remote-imported',
      cacheHit: false,
      remoteTaskGraphCacheImport: importReport,
      remoteGraphLeaseRefs
    };
    this.taskGraphCacheArtifacts.set(key, cloneTaskGraphCacheValue(importedArtifact));
    this.taskGraphCache.set(key, {
      storedAt,
      expiresAt,
      artifact: cloneTaskGraphCacheValue(importedArtifact),
      result: cloneTaskGraphCacheValue(importedResult)
    });
    this.stats.taskGraphRemoteCacheImports += 1;
    return cloneTaskGraphCacheValue(importReport);
  }

  evaluateRemoteTaskGraphStateSeedPolicy(cacheKeyOrOptions, options = {}) {
    const source = cacheKeyOrOptions && typeof cacheKeyOrOptions === 'object'
      ? cacheKeyOrOptions
      : options;
    const key = String(
      typeof cacheKeyOrOptions === 'string'
        ? cacheKeyOrOptions
        : source?.cacheKey || ''
    ).trim();
    const requestedAt = Date.now();
    const cacheEntry = key ? this.taskGraphCache.get(key) || null : null;
    const artifact = key
      ? this.taskGraphCacheArtifacts.get(key) || cacheEntry?.artifact || null
      : null;
    const result = cacheEntry?.result || null;
    const importReport = result?.remoteTaskGraphCacheImport
      || artifact?.remoteCacheImport
      || null;
    const stateSeedPayload = firstNonNull(
      result?.stateSeedPayload,
      result?.stateSeed,
      result?.warmStateSeed,
      artifact?.stateSeedPayload,
      artifact?.stateSeed,
      artifact?.outputs?.stateSeed,
      source?.stateSeedPayload,
      source?.stateSeed
    );
    const remoteGraphLeaseRefs = result?.remoteGraphLeaseRefs
      || artifact?.remoteGraphLeaseRefs
      || importReport?.retainedGpuLaneRefs
      || null;
    const stateFamilies = uniqueStringList(
      result?.cacheInputs?.stateFamilies,
      result?.cachePolicy?.inputs?.stateFamilies,
      artifact?.inputs?.stateFamilies,
      artifact?.cacheInputs?.stateFamilies,
      source?.stateFamilies
    );
    const readFamilies = uniqueStringList(
      result?.cacheInputs?.readFamilies,
      result?.cachePolicy?.inputs?.readFamilies,
      artifact?.inputs?.readFamilies,
      artifact?.cacheInputs?.readFamilies,
      source?.readFamilies
    );
    const writeFamilies = uniqueStringList(
      result?.cacheInputs?.writeFamilies,
      result?.cachePolicy?.inputs?.writeFamilies,
      artifact?.inputs?.writeFamilies,
      artifact?.cacheInputs?.writeFamilies,
      source?.writeFamilies
    );
    const allowedStateFamilies = normalizeStringList(
      source?.allowedStateFamilies ?? source?.allowedFamilies,
      []
    );
    const retainedBufferRefs = uniqueStringList(
      remoteGraphLeaseRefs?.retainedBufferRefs,
      result?.graphLeaseSpec?.retainedBufferRefs,
      result?.cacheInputs?.retainedBufferRefs,
      artifact?.inputs?.retainedBufferRefs,
      source?.retainedBufferRefs
    );
    const remoteRetainedRefsUsableLocally = remoteGraphLeaseRefs?.usableLocally === true
      && remoteGraphLeaseRefs?.remoteOnly !== true;
    const remoteImported = importReport?.schema === COMPUTE_REMOTE_TASK_GRAPH_CACHE_IMPORT_SCHEMA
      || result?.cacheStatus === 'remote-imported'
      || artifact?.status === 'admitted-remote-cache-artifact-recorded';
    const admitted = artifact?.admitted === true;
    const requireStateFamilies = source?.requireStateFamilies !== false;
    const disallowedStateFamilies = allowedStateFamilies.length > 0
      ? stateFamilies.filter((family) => !allowedStateFamilies.includes(family))
      : [];
    let stateFamilyStatus = 'state-family-not-evaluated';
    if (stateFamilies.length === 0) {
      stateFamilyStatus = requireStateFamilies
        ? 'state-family-missing'
        : 'state-family-not-declared';
    } else if (allowedStateFamilies.length === 0) {
      stateFamilyStatus = 'state-family-policy-not-declared';
    } else if (disallowedStateFamilies.length > 0) {
      stateFamilyStatus = 'state-family-blocked';
    } else {
      stateFamilyStatus = 'state-family-allowed';
    }

    let status = 'policy-ready';
    let reason = 'remote-cache-import-admitted-for-local-policy';
    if (!key) {
      status = 'blocked-no-cache-key';
      reason = 'remote-state-seed-policy-requires-cache-key';
    } else if (!cacheEntry && !artifact) {
      status = 'blocked-cache-miss';
      reason = 'cache-entry-not-found';
    } else if (!admitted) {
      status = 'blocked-unadmitted-cache-artifact';
      reason = 'cache-artifact-is-not-admitted';
    } else if (!remoteImported) {
      status = 'blocked-not-remote-import';
      reason = 'cache-entry-did-not-originate-from-admitted-remote-task-graph-import';
    } else if (stateFamilyStatus === 'state-family-missing') {
      status = 'blocked-missing-state-families';
      reason = 'remote-import-did-not-declare-state-families';
    } else if (stateFamilyStatus === 'state-family-policy-not-declared') {
      status = 'blocked-missing-state-family-policy';
      reason = 'allowed-state-family-policy-is-required';
    } else if (stateFamilyStatus === 'state-family-blocked') {
      status = 'blocked-state-family-policy';
      reason = 'remote-import-declares-state-families-outside-policy';
    }
    const ready = status === 'policy-ready';
    const allowWarmStateSeed = source?.allowWarmStateSeed === true;
    const allowHotBufferRefresh = source?.allowHotBufferRefresh === true;
    const warmStateSeedStatus = allowWarmStateSeed
      ? (ready ? 'warm-state-seed-allowed' : 'warm-state-seed-blocked')
      : 'warm-state-seed-not-requested';
    let hotBufferRefreshStatus = allowHotBufferRefresh
      ? 'no-retained-buffer-refs'
      : 'hot-buffer-refresh-not-requested';
    if (allowHotBufferRefresh && !ready) {
      hotBufferRefreshStatus = 'hot-buffer-refresh-blocked';
    } else if (allowHotBufferRefresh && retainedBufferRefs.length > 0 && remoteRetainedRefsUsableLocally) {
      hotBufferRefreshStatus = 'local-buffer-refs-usable';
    } else if (allowHotBufferRefresh && retainedBufferRefs.length > 0) {
      hotBufferRefreshStatus = 'local-refresh-required';
    }

    return {
      schema: COMPUTE_REMOTE_TASK_GRAPH_STATE_SEED_POLICY_SCHEMA,
      status,
      reason,
      cacheKey: key || null,
      requestedAt,
      cacheEntryPresent: cacheEntry != null,
      artifactPresent: artifact != null,
      admitted,
      remoteImported,
      importStatus: importReport?.status || null,
      importSchema: importReport?.schema || null,
      importReport: importReport ? cloneTaskGraphCacheValue(importReport) : null,
      stateFamilies,
      readFamilies,
      writeFamilies,
      stateSeedPayloadAvailable: stateSeedPayload != null,
      stateSeedPayload: stateSeedPayload != null ? cloneTaskGraphCacheValue(stateSeedPayload) : null,
      allowedStateFamilies,
      disallowedStateFamilies,
      stateFamilyStatus,
      warmStateSeedRequested: allowWarmStateSeed,
      warmStateSeedStatus,
      hotBufferRefreshRequested: allowHotBufferRefresh,
      hotBufferRefreshStatus,
      retainedBufferRefs,
      remoteRetainedRefsUsableLocally,
      remoteGraphLeaseRefs: remoteGraphLeaseRefs ? cloneTaskGraphCacheValue(remoteGraphLeaseRefs) : null
    };
  }

  admitTaskGraphCacheArtifact(cacheKeyOrAdmission, admission = {}) {
    const source = cacheKeyOrAdmission && typeof cacheKeyOrAdmission === 'object'
      ? cacheKeyOrAdmission
      : admission;
    const key = String(
      typeof cacheKeyOrAdmission === 'string'
        ? cacheKeyOrAdmission
        : source?.cacheKey || ''
    ).trim();
    if (!key) {
      throw new Error('admitTaskGraphCacheArtifact requires a cacheKey');
    }
    const cacheEntry = this.taskGraphCache.get(key);
    const existingArtifact = this.taskGraphCacheArtifacts.get(key) || cacheEntry?.artifact || null;
    if (!existingArtifact) return null;
    const stateAdmission = cloneTaskGraphCacheValue(source || {});
    const acceptedAt = stateAdmission.admittedAt || stateAdmission.acceptedAt || Date.now();
    const computeAdmission = {
      schema: COMPUTE_TASK_GRAPH_CACHE_ADMISSION_SCHEMA,
      status: 'admitted',
      admitted: true,
      authority: stateAdmission.authority || 'state-manager',
      admissionId: stateAdmission.admissionId || null,
      validatorId: stateAdmission.validatorId || null,
      reason: stateAdmission.reason || 'state-manager-cache-artifact-admitted',
      invalidationRefs: normalizeStringList(stateAdmission.invalidationRefs),
      acceptedAt
    };
    const wasAdmitted = existingArtifact.admitted === true;
    const artifact = {
      ...cloneTaskGraphCacheValue(existingArtifact),
      status: 'admitted-cache-artifact-recorded',
      admitted: true,
      admission: computeAdmission,
      stateAdmission
    };
    this.taskGraphCacheArtifacts.set(key, cloneTaskGraphCacheValue(artifact));
    if (cacheEntry) {
      const result = cloneTaskGraphCacheValue(cacheEntry.result || {});
      result.cacheAdmission = computeAdmission;
      result.cacheAdmissionStatus = computeAdmission.status;
      result.cacheArtifact = cloneTaskGraphCacheValue(artifact);
      result.cacheArtifactStatus = artifact.status;
      result.cacheArtifactSchema = artifact.schema || null;
      this.taskGraphCache.set(key, {
        ...cacheEntry,
        artifact: cloneTaskGraphCacheValue(artifact),
        result
      });
    }
    if (!wasAdmitted) {
      this.stats.taskGraphCacheArtifactsAdmitted += 1;
    }
    return cloneTaskGraphCacheValue(artifact);
  }

  invalidateTaskGraphCacheArtifact(cacheKeyOrInvalidation, options = {}) {
    const source = cacheKeyOrInvalidation && typeof cacheKeyOrInvalidation === 'object'
      ? cacheKeyOrInvalidation
      : options;
    const key = String(
      typeof cacheKeyOrInvalidation === 'string'
        ? cacheKeyOrInvalidation
        : source?.cacheKey || ''
    ).trim();
    if (!key) {
      throw new Error('invalidateTaskGraphCacheArtifact requires a cacheKey');
    }
    const invalidation = cloneTaskGraphCacheValue(source || {});
    const cacheEntry = this.taskGraphCache.get(key);
    const existingArtifact = this.taskGraphCacheArtifacts.get(key) || cacheEntry?.artifact || null;
    this.taskGraphCache.delete(key);
    this.stats.taskGraphCacheInvalidations += 1;
    if (!existingArtifact) {
      return {
        cacheKey: key,
        status: 'invalidated',
        admitted: false,
        invalidation
      };
    }
    const artifact = {
      ...cloneTaskGraphCacheValue(existingArtifact),
      status: 'invalidated',
      admitted: false,
      invalidation,
      invalidatedAt: invalidation.invalidatedAt || Date.now()
    };
    this.taskGraphCacheArtifacts.set(key, cloneTaskGraphCacheValue(artifact));
    return cloneTaskGraphCacheValue(artifact);
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
      gpuResidentLanes: this.getGpuResidentLaneStats(),
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
      taskGraphsSubmitted: this.stats.taskGraphsSubmitted,
      taskGraphsCompleted: this.stats.taskGraphsCompleted,
      taskGraphsFailed: this.stats.taskGraphsFailed,
      taskGraphsCancelled: this.stats.taskGraphsCancelled,
      taskGraphCacheHits: this.stats.taskGraphCacheHits,
      taskGraphCacheWrites: this.stats.taskGraphCacheWrites,
      taskGraphCacheArtifactsWritten: this.stats.taskGraphCacheArtifactsWritten,
      taskGraphCacheArtifactsAdmitted: this.stats.taskGraphCacheArtifactsAdmitted,
      taskGraphRemoteCacheImports: this.stats.taskGraphRemoteCacheImports,
      taskGraphRemoteCacheImportBlocked: this.stats.taskGraphRemoteCacheImportBlocked,
      taskGraphCacheInvalidations: this.stats.taskGraphCacheInvalidations,
      taskGraphCacheReadBlocked: this.stats.taskGraphCacheReadBlocked,
      averageTaskDuration: this.stats.averageTaskDurationMs,
      averageTaskDurationMs: this.stats.averageTaskDurationMs,
      lastTaskDurationMs: this.stats.lastTaskDurationMs,
      minTaskDurationMs: this.stats.minTaskDurationMs,
      maxTaskDurationMs: this.stats.maxTaskDurationMs,
      currentLoad: Number(currentLoad.toFixed(4)),
      activeTaskCount: this.activeTasks.size,
      activeTaskGraphCount: this.activeTaskGraphs.size,
      queuedTaskCount: this.taskQueue.length,
      taskGraphCacheSize: this.taskGraphCache.size,
      taskGraphCacheArtifactCount: this.taskGraphCacheArtifacts.size,
      workerCount: this.workers.length,
      targetWorkers: this.targetWorkerCount,
      workerPoolRevision: this.workerPoolRevision,
      lastWorkerResize: JSON.parse(JSON.stringify(this.lastWorkerResize)),
      workerResizeHistory: JSON.parse(JSON.stringify(this.workerResizeHistory)),
      workerAutoScaleHold: this._getWorkerAutoScaleHoldStatus(),
      workerUtilization: this._getWorkerUtilizationReport(),
      activeTaskGraphs: this.listActiveTaskGraphs(),
      gpuResidentLanes: this.getGpuResidentLaneStats(),
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
      gpuFence: payload.gpuFence,
      gpuResidentLane: payload.gpuResidentLane,
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
      gpuFenceRequired: payload.gpuFence?.required === true,
      gpuFenceSchema: payload.gpuFence?.schema || null,
      gpuLaneId: payload.gpuFence?.laneId || null,
      gpuStateKey: payload.gpuFence?.stateKey || null,
      gpuQueueFencePolicy: payload.gpuFence?.queueFencePolicy || null,
      gpuResidentLaneSchema: payload.gpuResidentLane?.schema || null,
      gpuResidentLaneLocalExecution: payload.gpuResidentLane?.localExecution || null,
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
    const gpuFence = normalizeGpuFenceReport(
      raw.gpuFence
      || raw.gpuFenceReport
      || resultObject.gpuFence
      || resultObject.gpuFenceReport
      || finalObject.gpuFence
      || finalObject.gpuFenceReport
      || raw.remoteExecution?.gpuFence
      || raw.remoteExecution?.gpuFenceReport
      || raw.remoteExecution?.computeExecution?.gpuFence,
      payload.gpuFence || taskPacket?.gpuFence || null
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
      gpuFence,
      gpuFenceStatus: gpuFence?.status ?? null,
      gpuFenceSatisfied: gpuFence?.fenceSatisfied ?? false,
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
    if (taskPacket.gpuFenceRequired === true) {
      checks.push({
        field: 'gpuFence',
        expected: 'fence-satisfied',
        actual: provenance?.gpuFence?.status || null,
        ok: provenance?.gpuFence?.fenceSatisfied === true
      });
    }
    const mismatchFields = checks.filter((check) => !check.ok).map((check) => check.field);
    const reason = mismatchFields.length === 0
      ? 'hashes-match'
      : (mismatchFields.includes('gpuFence') ? 'gpu-fence-missing-or-unsatisfied' : 'hash-mismatch');
    return {
      schema: COMPUTE_REMOTE_PLACEMENT_VERIFICATION_SCHEMA,
      verified: mismatchFields.length === 0,
      skipped: false,
      reason,
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

  _requiresInlineExecution(task) {
    return task.payload?.gpuResidentLane?.localExecution === 'inline';
  }

  _acquireTaskGpuResidentLaneLease(task) {
    const spec = task.payload?.gpuResidentLane;
    if (!spec || task.gpuResidentLaneLease || task.gpuResidentLaneExecution) return task.gpuResidentLaneLease || null;
    if (!this.gpuResidentLaneManager?.acquireLease) {
      throw new Error('GPU resident lane manager is not available for declared resident-lane task');
    }
    const lease = this.acquireGpuResidentLaneLease({
      ...spec,
      taskId: spec.taskId || task.id || task.payload?.id || null,
      solverId: spec.solverId || task.payload?.solverId || task.payload?.taskFamily || null,
      owner: spec.owner || task.payload?.taskFamily || 'compute-manager-task',
      queueFencePolicy: spec.queueFencePolicy || task.payload?.gpuFence?.queueFencePolicy || null,
      retainedBufferRefs: spec.retainedBufferRefs?.length
        ? spec.retainedBufferRefs
        : (task.payload?.gpuFence?.retainedBufferRefs || []),
      residentSequenceLaneContract: spec.residentSequenceLaneContract || null
    });
    task.gpuResidentLaneLease = lease;
    return lease;
  }

  _completeTaskGpuResidentLaneLease(task, result, { mode = null } = {}) {
    const lease = task.gpuResidentLaneLease;
    if (!lease || task.gpuResidentLaneExecution) return result;
    const resultObject = result && typeof result === 'object' ? result : {};
    const resultFence = normalizeGpuFenceReport(
      resultObject.gpuFence || resultObject.gpuFenceReport,
      task.payload?.gpuFence || null
    );
    const required = task.payload?.gpuFence?.required === true;
    const retainedBufferRefs = resultFence?.retainedBufferRefs?.length
      ? resultFence.retainedBufferRefs
      : (task.payload?.gpuResidentLane?.retainedBufferRefs?.length
          ? task.payload.gpuResidentLane.retainedBufferRefs
          : (task.payload?.gpuFence?.retainedBufferRefs || lease.retainedBufferRefs || []));
    const execution = this.completeGpuResidentLaneLease(lease.leaseId, {
      status: resultFence?.status || (required ? 'gpu-fence-report-missing' : 'queue-work-completed'),
      method: resultFence?.method || null,
      queueCompletionStatus: resultFence?.queueCompletionStatus || resultFence?.status || null,
      queueCompletionMethod: resultFence?.queueCompletionMethod || resultFence?.method || null,
      retainedBufferRefs,
      completed: resultFence ? resultFence.fenceSatisfied === true : (required ? false : null),
      source: mode ? `compute-manager-${mode}` : 'compute-manager-local-task'
    });
    task.gpuResidentLaneExecution = execution;
    task.gpuResidentLaneLease = null;
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      return {
        ...result,
        gpuFence: result.gpuFence || execution.gpuFence,
        gpuResidentLaneExecution: result.gpuResidentLaneExecution || execution,
        gpuResidentLaneLease: result.gpuResidentLaneLease || execution.lease
      };
    }
    return result;
  }

  _rejectTaskGpuResidentLaneLease(task, reason = 'task-failed') {
    const lease = task.gpuResidentLaneLease;
    if (!lease || task.gpuResidentLaneExecution || task.gpuResidentLaneRejected) return null;
    const rejected = this.rejectGpuResidentLaneLease(lease.leaseId, reason);
    task.gpuResidentLaneRejected = rejected;
    task.gpuResidentLaneLease = null;
    return rejected;
  }

  _assertRequiredGpuFenceSatisfied(task, result) {
    if (task.payload?.gpuFence?.required !== true) return;
    const resultObject = result && typeof result === 'object' ? result : {};
    const gpuFence = task.gpuResidentLaneExecution?.gpuFence
      || normalizeGpuFenceReport(resultObject.gpuFence || resultObject.gpuFenceReport, task.payload.gpuFence);
    if (gpuFence?.fenceSatisfied === true) return;
    const err = new Error(`GPU fence missing or unsatisfied for task ${task.id || task.payload?.id || 'unknown'}`);
    err.name = 'GpuFenceUnsatisfiedError';
    err.code = 'ERR_COMPUTE_GPU_FENCE_UNSATISFIED';
    err.gpuFence = gpuFence || null;
    err.gpuFenceRequirement = task.payload.gpuFence;
    throw err;
  }

  _dispatchToWorker(task) {
    if (this._requiresInlineExecution(task)) return false;
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

  _buildTaskExecutionReport(task, { mode = null, result = null } = {}) {
    const executionMode = mode || task.executionMode || null;
    const runtime = task.runtime || task.payload?.runtime || null;
    const taskFamily = task.taskFamily || task.payload?.taskFamily || null;
    const taskId = task.id || task.payload?.id || null;
    const resultObject = result && typeof result === 'object' ? result : {};
    const gpuFence = normalizeGpuFenceReport(
      resultObject.gpuFence || resultObject.gpuFenceReport,
      task.payload?.gpuFence || null
    ) || task.gpuResidentLaneExecution?.gpuFence || null;
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
      workerId,
      gpuFenceRequirement: task.payload?.gpuFence || null,
      gpuFence,
      gpuFenceStatus: gpuFence?.status ?? null,
      gpuFenceSatisfied: gpuFence?.fenceSatisfied ?? false,
      gpuResidentLaneRequirement: task.payload?.gpuResidentLane || null,
      gpuResidentLaneExecution: task.gpuResidentLaneExecution || null,
      gpuResidentLaneRejected: task.gpuResidentLaneRejected || null
    };
  }

  _attachTaskExecutionReport(result, task, { mode = null } = {}) {
    if (task.payload?.returnEnvelope !== true) return result;
    const computeExecution = this._buildTaskExecutionReport(task, { mode, result });
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
      this._acquireTaskGpuResidentLaneLease(task);
      const rawResult = await executeTaskPayload(task.payload);
      const result = this._completeTaskGpuResidentLaneLease(task, rawResult, { mode: task.executionMode || 'inline' });
      this._assertRequiredGpuFenceSatisfied(task, result);
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
      this._rejectTaskGpuResidentLaneLease(task, err?.code || 'inline-task-error');
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
      if (this._requiresInlineExecution(next)) {
        this._executeInline(next);
        continue;
      }
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
