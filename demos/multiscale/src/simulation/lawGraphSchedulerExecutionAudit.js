export const MULTISCALE_LAW_GRAPH_SCHEDULER_EXECUTION_AUDIT_SCHEMA =
  'peercompute.multiscale.law-graph-scheduler-execution-audit.v0';

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function rounded(value, digits = 4) {
  return Number(finite(value).toFixed(digits));
}

function normalizeRuntimeEntries(solverRuntime = null) {
  if (!solverRuntime || typeof solverRuntime !== 'object') return [];
  return Object.entries(solverRuntime)
    .filter(([key, entry]) => key !== 'schema' && key !== 'scope' && entry && typeof entry === 'object')
    .map(([runtimeKey, entry]) => ({
      runtimeKey,
      solverId: entry.solverId || null,
      stateKey: entry.stateKey || null,
      taskId: entry.taskId || null,
      cadenceFrames: finite(entry.cadenceFrames, 0),
      pending: entry.pending === true,
      submittedTasks: finite(entry.submittedTasks, 0),
      completedTasks: finite(entry.completedTasks, 0),
      failedTasks: finite(entry.failedTasks, 0),
      lastError: entry.lastError || null,
      lastResult: entry.lastResult || null
    }))
    .filter((entry) => entry.solverId || entry.runtimeKey);
}

function normalizeWarmDeltas(solverWarmDeltas = null) {
  if (!solverWarmDeltas || typeof solverWarmDeltas !== 'object') return [];
  return Object.entries(solverWarmDeltas)
    .map(([deltaKey, entry]) => {
      const payload = entry?.payload && typeof entry.payload === 'object' ? entry.payload : entry;
      return {
        deltaKey,
        solverId: payload?.solverId || null,
        schema: payload?.schema || null,
        backend: payload?.backend || null,
        sequence: payload?.sequence ?? null,
        version: entry?.version ?? payload?.version ?? null,
        taskId: entry?.taskId || payload?.taskId || null,
        timestamp: entry?.timestamp || entry?.ts || payload?.timestamp || null
      };
    })
    .filter((entry) => entry.solverId || entry.schema);
}

function buildLookup(entries = [], field = 'solverId') {
  const map = new Map();
  for (const entry of entries) {
    const key = entry?.[field];
    if (!key || map.has(key)) continue;
    map.set(key, entry);
  }
  return map;
}

function resultSchema(result = null) {
  return result?.schema || result?.value?.schema || null;
}

function resultBackend(result = null) {
  return result?.backend || result?.value?.backend || null;
}

function resultSequence(result = null) {
  return result?.sequence ?? result?.value?.sequence ?? null;
}

function statusForEntry({
  manifestEntry = {},
  runtime = null,
  warmDelta = null,
  executionRequired = false,
  runtimeMatched = false,
  warmDeltaMatched = false
} = {}) {
  if (!executionRequired) {
    if (manifestEntry.readyForModelLocal) return 'model-local-ready';
    if (manifestEntry.readyForTelemetry) return 'telemetry-ready';
    return manifestEntry.blockerCount > 0 ? 'non-worker-blocked' : 'non-worker-idle';
  }
  if (runtimeMatched && warmDeltaMatched) return 'worker-result-and-warm-delta-observed';
  if (runtimeMatched) return 'worker-result-observed-no-warm-delta';
  if (warmDeltaMatched) return 'warm-delta-observed-no-runtime-result';
  if (runtime?.pending) return 'worker-pending';
  if (runtime?.failedTasks > 0 && runtime.completedTasks <= 0) return 'worker-failed';
  if (!runtime) return 'worker-runtime-missing';
  return 'worker-result-missing';
}

function nextExecutionAction(entries = []) {
  const missingRuntime = entries.find((entry) => entry.executionRequired && !entry.runtimeMatched && !entry.pending);
  if (missingRuntime) return `observe-runtime:${missingRuntime.solverDescriptorId || missingRuntime.solverId || 'unknown'}`;
  const pending = entries.find((entry) => entry.executionRequired && entry.pending);
  if (pending) return `wait-worker:${pending.solverDescriptorId || pending.solverId || 'unknown'}`;
  const missingWarmDelta = entries.find((entry) => entry.executionRequired && entry.runtimeMatched && !entry.warmDeltaMatched);
  if (missingWarmDelta) return `match-warm-delta:${missingWarmDelta.solverDescriptorId || missingWarmDelta.solverId || 'unknown'}`;
  const failed = entries.find((entry) => entry.executionRequired && entry.failedTasks > 0);
  if (failed) return `inspect-failure:${failed.solverDescriptorId || failed.solverId || 'unknown'}`;
  const observed = entries.find((entry) => entry.executionRequired && entry.executionObserved);
  if (observed) return `result-admission-blocked:${observed.solverDescriptorId || observed.solverId || 'unknown'}`;
  return 'scheduler-execution-audit-idle';
}

export function createLawGraphSchedulerExecutionAudit({
  schedulerManifest = null,
  solverRuntime = null,
  solverWarmDeltas = null,
  timeSeconds = 0,
  activeLayerId = 'unknown'
} = {}) {
  const manifest = schedulerManifest || {};
  const manifestEntries = Array.isArray(manifest.entries) ? manifest.entries : [];
  const runtimeEntries = normalizeRuntimeEntries(solverRuntime);
  const warmDeltas = normalizeWarmDeltas(solverWarmDeltas);
  const runtimeBySolver = buildLookup(runtimeEntries, 'solverId');
  const warmDeltaBySolver = buildLookup(warmDeltas, 'solverId');
  const evidenceAvailable = runtimeEntries.length > 0 || warmDeltas.length > 0;
  const entries = manifestEntries.map((manifestEntry, index) => {
    const solverId = manifestEntry.solverDescriptorId || manifestEntry.solverId || null;
    const runtime = solverId ? runtimeBySolver.get(solverId) || runtimeBySolver.get(manifestEntry.solverId) || null : null;
    const warmDelta = solverId ? warmDeltaBySolver.get(solverId) || warmDeltaBySolver.get(manifestEntry.solverId) || null : null;
    const runtimeMatched = Boolean(runtime?.lastResult || runtime?.completedTasks > 0);
    const warmDeltaMatched = Boolean(warmDelta && (
      !manifestEntry.warmDeltaSchema || warmDelta.schema === manifestEntry.warmDeltaSchema
    ));
    const executionRequired = manifestEntry.schedulerLane === 'compute-manager';
    const executionObserved = executionRequired && (runtimeMatched || warmDeltaMatched);
    return {
      id: `execution-audit:${manifestEntry.id || manifestEntry.operationId || index}`,
      auditIndex: index,
      manifestEntryId: manifestEntry.id || null,
      queueEntryId: manifestEntry.queueEntryId || null,
      operationId: manifestEntry.operationId || null,
      lawNodeId: manifestEntry.lawNodeId || null,
      schedulerLane: manifestEntry.schedulerLane || 'unknown',
      solverId: manifestEntry.solverId || null,
      solverDescriptorId: manifestEntry.solverDescriptorId || null,
      warmDeltaScope: manifestEntry.warmDeltaScope || null,
      expectedWarmDeltaSchema: manifestEntry.warmDeltaSchema || null,
      executionRequired,
      schedulerReady: manifestEntry.readyForScheduler === true,
      runtimeKey: runtime?.runtimeKey || null,
      runtimeMatched,
      runtimeTaskId: runtime?.taskId || null,
      runtimeStateKey: runtime?.stateKey || null,
      pending: runtime?.pending === true,
      submittedTasks: finite(runtime?.submittedTasks, 0),
      completedTasks: finite(runtime?.completedTasks, 0),
      failedTasks: finite(runtime?.failedTasks, 0),
      cadenceFrames: finite(runtime?.cadenceFrames, 0),
      lastError: runtime?.lastError || null,
      resultSchema: resultSchema(runtime?.lastResult),
      resultBackend: resultBackend(runtime?.lastResult),
      resultSequence: resultSequence(runtime?.lastResult),
      warmDeltaMatched,
      warmDeltaKey: warmDelta?.deltaKey || null,
      warmDeltaSchema: warmDelta?.schema || null,
      warmDeltaBackend: warmDelta?.backend || null,
      warmDeltaSequence: warmDelta?.sequence ?? null,
      warmDeltaVersion: warmDelta?.version ?? null,
      executionObserved,
      resultAdmissionRequired: manifestEntry.resultAdmissionRequired === true,
      scientificBlocked: manifestEntry.scientificBlocked === true,
      blockerCount: finite(manifestEntry.blockerCount, 0),
      status: statusForEntry({
        manifestEntry,
        runtime,
        warmDelta,
        executionRequired,
        runtimeMatched,
        warmDeltaMatched
      })
    };
  });
  const executionRequiredEntries = entries.filter((entry) => entry.executionRequired);
  const runtimeMatchedEntries = executionRequiredEntries.filter((entry) => entry.runtimeMatched);
  const warmDeltaMatchedEntries = executionRequiredEntries.filter((entry) => entry.warmDeltaMatched);
  const observedEntries = executionRequiredEntries.filter((entry) => entry.executionObserved);
  const fullyObservedEntries = executionRequiredEntries.filter((entry) => entry.runtimeMatched && entry.warmDeltaMatched);
  const pendingEntries = executionRequiredEntries.filter((entry) => entry.pending);
  const failedEntries = executionRequiredEntries.filter((entry) => entry.failedTasks > 0);
  const missingRuntimeEntries = executionRequiredEntries.filter((entry) => !entry.runtimeMatched && !entry.pending);
  const missingWarmDeltaEntries = executionRequiredEntries.filter((entry) => entry.runtimeMatched && !entry.warmDeltaMatched);
  const status = manifestEntries.length === 0
    ? 'scheduler-execution-audit-empty'
    : !evidenceAvailable
      ? 'scheduler-execution-evidence-unavailable'
      : executionRequiredEntries.length > 0 && fullyObservedEntries.length === executionRequiredEntries.length
        ? manifest.scientificConverged === true
          ? 'scheduler-execution-observed'
          : 'scheduler-execution-observed-scientific-blocked'
        : observedEntries.length > 0
          ? 'scheduler-execution-partial'
          : pendingEntries.length > 0
            ? 'scheduler-execution-pending'
            : 'scheduler-execution-unobserved';
  return {
    schema: MULTISCALE_LAW_GRAPH_SCHEDULER_EXECUTION_AUDIT_SCHEMA,
    modelId: 'bipartite-law-operation-scheduler-execution-audit-v0',
    mode: 'scheduler-execution-evidence-audit',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    activeLayerId,
    schedulerManifestSchema: manifest.schema || null,
    proxyConverged: manifest.proxyConverged === true,
    scientificConverged: manifest.scientificConverged === true,
    authoritativeMutationReady: manifest.authoritativeMutationReady === true,
    evidenceAvailable,
    manifestEntryCount: manifestEntries.length,
    auditEntryCount: entries.length,
    executionRequiredCount: executionRequiredEntries.length,
    schedulerReadyCount: executionRequiredEntries.filter((entry) => entry.schedulerReady).length,
    runtimeMatchedCount: runtimeMatchedEntries.length,
    warmDeltaMatchedCount: warmDeltaMatchedEntries.length,
    executionObservedCount: observedEntries.length,
    fullyObservedCount: fullyObservedEntries.length,
    pendingRuntimeCount: pendingEntries.length,
    failedRuntimeCount: failedEntries.length,
    missingRuntimeCount: missingRuntimeEntries.length,
    missingWarmDeltaCount: missingWarmDeltaEntries.length,
    modelLocalObservedCount: entries.filter((entry) => entry.status === 'model-local-ready').length,
    telemetryObservedCount: entries.filter((entry) => entry.status === 'telemetry-ready').length,
    scientificBlockedEntryCount: entries.filter((entry) => entry.scientificBlocked).length,
    resultAdmissionRequiredCount: entries.filter((entry) => entry.resultAdmissionRequired).length,
    nextExecutionAction: nextExecutionAction(entries),
    entries,
    residualTargets: [
      {
        id: 'residual:scheduler-execution-runtime-missing',
        quantity: 'compute-manager entries without runtime result evidence',
        current: missingRuntimeEntries.length,
        target: 0,
        satisfied: missingRuntimeEntries.length === 0
      },
      {
        id: 'residual:scheduler-execution-warm-delta-missing',
        quantity: 'runtime-observed entries without matching warm delta',
        current: missingWarmDeltaEntries.length,
        target: 0,
        satisfied: missingWarmDeltaEntries.length === 0
      },
      {
        id: 'residual:scheduler-execution-failed-runtime',
        quantity: 'compute-manager entries with failed runtime attempts',
        current: failedEntries.length,
        target: 0,
        satisfied: failedEntries.length === 0
      }
    ],
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'This audit observes existing ComputeManager runtime and warm-delta evidence; it does not submit tasks.',
        'Observed worker results still require downstream result admission and authoritative mutation gates.'
      ]
    },
    provenance: {
      source: 'demos/multiscale/src/simulation/lawGraphSchedulerExecutionAudit.js',
      generatedFrom: 'peercompute.multiscale.law-graph-scheduler-manifest.v0'
    }
  };
}
