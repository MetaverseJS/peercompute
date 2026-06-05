import {
  SOLVER_LAYER_AFFINITY,
  SOLVER_LAYER_ORDER
} from './solverRuntimeGovernor.js';

export const MULTISCALE_SOLVER_SUBMISSION_BUDGET_SCHEMA = 'peercompute.multiscale.solver-submission-budget.v0';
export const MULTISCALE_SOLVER_SUBMISSION_BUDGET_POLICY = 'active-layer-submit-backpressure-v0';

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeInteger(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeLayerId(value, fallback = 'surface') {
  const text = String(value || '').trim();
  return SOLVER_LAYER_ORDER.includes(text) ? text : fallback;
}

function layerDistance(solverKey, activeLayerId) {
  const solverLayer = SOLVER_LAYER_AFFINITY[solverKey] || activeLayerId;
  const solverIndex = SOLVER_LAYER_ORDER.indexOf(solverLayer);
  const activeIndex = SOLVER_LAYER_ORDER.indexOf(activeLayerId);
  if (solverIndex < 0 || activeIndex < 0) return 0;
  return Math.abs(solverIndex - activeIndex);
}

function extractManagerStats({ managerStats = null, computeStatus = {} } = {}) {
  const peer = computeStatus?.peercompute || {};
  const capabilities = peer.managerCapabilities || computeStatus?.capabilities || {};
  const stats = managerStats || capabilities.stats || {};
  const targetWorkers = normalizeInteger(
    stats.targetWorkers ?? peer.plannedWorkers ?? capabilities.targetWorkers ?? capabilities.workerPolicy?.targetWorkers,
    1,
    1,
    100000
  );
  const activeTaskCount = normalizeInteger(
    stats.activeTaskCount ?? stats.activeTasks ?? capabilities.activeTaskCount ?? capabilities.activeTasks,
    0,
    0,
    100000
  );
  const queuedTaskCount = normalizeInteger(
    stats.queuedTaskCount ?? stats.queuedTasks ?? capabilities.queuedTaskCount ?? capabilities.queuedTasks,
    0,
    0,
    100000
  );
  const currentLoad = finiteNumber(stats.currentLoad ?? capabilities.currentLoad, 0);
  return {
    targetWorkers,
    activeTaskCount,
    queuedTaskCount,
    currentLoad,
    queuePressure: Number(((activeTaskCount + queuedTaskCount) / Math.max(1, targetWorkers)).toFixed(3))
  };
}

function pressureLimit(pressure, queuePressure, queuedTaskCount, targetWorkers, candidateCount, urgentCandidateCount = 0) {
  if (queuedTaskCount > targetWorkers) return urgentCandidateCount > 0 ? Math.min(candidateCount, 1) : 0;
  let limit = candidateCount;
  if (pressure >= 4 || queuePressure >= 1.5) limit = Math.min(limit, 1);
  else if (pressure >= 2.4 || queuePressure >= 1) limit = Math.min(limit, 2);
  else if (pressure >= 1.6 || queuePressure >= 0.7) limit = Math.min(limit, 3);
  else if (pressure >= 1.15) limit = Math.min(limit, 5);
  return Math.max(0, limit);
}

function candidatePriority(candidate, activeLayerId) {
  const distance = layerDistance(candidate.key, activeLayerId);
  const triggerType = candidate.refinementDecision?.triggerType || candidate.dependencyDecision?.triggerType || null;
  const eventBoost = triggerType === 'event' ? 120 : 0;
  const sampleBoost = triggerType === 'sample' ? 40 : 0;
  const dependencyBoost = candidate.dependencyRun ? 34 : 0;
  const warmupBoost = candidate.warmupRun ? 36 : 0;
  const activeBoost = distance === 0 ? 80 : Math.max(0, 28 - distance * 8);
  const cadenceBoost = candidate.cadenceRun ? 12 : 0;
  const explicitPriority = finiteNumber(candidate.refinementDecision?.priority ?? candidate.dependencyDecision?.priority, 0);
  return Number((eventBoost + sampleBoost + dependencyBoost + warmupBoost + activeBoost + cadenceBoost + explicitPriority - distance).toFixed(3));
}

export function createSolverSubmissionBudget({
  frame = 0,
  activeLayerId = 'surface',
  candidates = [],
  runtimeScaler = {},
  solverGovernor = {},
  managerStats = null,
  computeStatus = {},
  targetFrameMs = 1000 / 60,
  maxSubmissions = null,
  reason = 'runtime'
} = {}) {
  const normalizedLayer = normalizeLayerId(activeLayerId);
  const manager = extractManagerStats({ managerStats, computeStatus });
  const frameMsAvg = finiteNumber(runtimeScaler?.frameMsAvg ?? solverGovernor?.frameMsAvg, 0);
  const framePressure = frameMsAvg > 0 ? frameMsAvg / Math.max(1, finiteNumber(targetFrameMs, 1000 / 60)) : 0;
  const pressure = Math.max(
    1,
    finiteNumber(runtimeScaler?.pressure, 0),
    finiteNumber(solverGovernor?.pressure, 0),
    finiteNumber(manager.currentLoad, 0),
    manager.queuePressure,
    framePressure
  );
  const normalizedCandidates = candidates.map((candidate, index) => {
    const key = String(candidate.key || '').trim();
    const distance = layerDistance(key, normalizedLayer);
    const triggerType = candidate.refinementDecision?.triggerType || candidate.dependencyDecision?.triggerType || null;
    const cadenceSource = candidate.warmupRun ? 'warmup' : 'cadence';
    const sourceParts = [];
    if (candidate.cadenceRun || candidate.warmupRun) sourceParts.push(cadenceSource);
    if (candidate.refinementRun) sourceParts.push('refinement');
    if (candidate.dependencyRun) sourceParts.push('dependency');
    const source = sourceParts.length ? sourceParts.join('+') : cadenceSource;
    return {
      key,
      order: index,
      pending: candidate.pending === true,
      cadenceRun: candidate.cadenceRun === true,
      warmupRun: candidate.warmupRun === true,
      refinementRun: candidate.refinementRun === true,
      dependencyRun: candidate.dependencyRun === true,
      source,
      triggerType,
      dependencyDecision: candidate.dependencyDecision || null,
      solverLayerId: SOLVER_LAYER_AFFINITY[key] || null,
      activeLayerId: normalizedLayer,
      layerDistance: distance,
      priority: candidatePriority(candidate, normalizedLayer)
    };
  }).filter((candidate) => candidate.key);
  const runnableCandidates = normalizedCandidates.filter((candidate) => !candidate.pending);
  const urgentCandidateCount = runnableCandidates.filter((candidate) => {
    return candidate.triggerType === 'event' || candidate.dependencyRun || candidate.layerDistance === 0;
  }).length;
  const hardLimit = maxSubmissions == null
    ? runnableCandidates.length
    : normalizeInteger(maxSubmissions, runnableCandidates.length, 0, 100000);
  const pressureLimited = Math.min(
    hardLimit,
    pressureLimit(
      pressure,
      manager.queuePressure,
      manager.queuedTaskCount,
      manager.targetWorkers,
      runnableCandidates.length,
      urgentCandidateCount
    )
  );
  const ranked = [...runnableCandidates].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    if (a.layerDistance !== b.layerDistance) return a.layerDistance - b.layerDistance;
    return a.order - b.order;
  });
  const admittedKeys = new Set(ranked.slice(0, pressureLimited).map((candidate) => candidate.key));
  const decisions = {};
  for (const candidate of normalizedCandidates) {
    const shouldSubmit = admittedKeys.has(candidate.key);
    decisions[candidate.key] = {
      key: candidate.key,
      shouldSubmit,
      pending: candidate.pending,
      source: candidate.source,
      triggerType: candidate.triggerType,
      cadenceRun: candidate.cadenceRun,
      warmupRun: candidate.warmupRun,
      refinementRun: candidate.refinementRun,
      dependencyRun: candidate.dependencyRun,
      dependencyDecision: candidate.dependencyDecision,
      solverLayerId: candidate.solverLayerId,
      activeLayerId: candidate.activeLayerId,
      layerDistance: candidate.layerDistance,
      priority: candidate.priority,
      reason: shouldSubmit
        ? 'admitted'
        : candidate.pending
          ? 'pending'
          : pressureLimited <= 0
            ? 'manager-backlog'
            : 'budget-deferred'
    };
  }
  const admittedSolvers = normalizedCandidates
    .filter((candidate) => decisions[candidate.key]?.shouldSubmit)
    .map((candidate) => candidate.key);
  const deferredSolvers = normalizedCandidates
    .filter((candidate) => !decisions[candidate.key]?.shouldSubmit)
    .map((candidate) => candidate.key);
  const status = admittedSolvers.length === runnableCandidates.length && deferredSolvers.length === 0
    ? 'full'
    : pressureLimited <= 0 && runnableCandidates.length > 0
      ? 'backlog-hold'
      : 'budgeted';

  return {
    schema: MULTISCALE_SOLVER_SUBMISSION_BUDGET_SCHEMA,
    policy: MULTISCALE_SOLVER_SUBMISSION_BUDGET_POLICY,
    reason,
    frame: normalizeInteger(frame, 0, 0, Number.MAX_SAFE_INTEGER),
    activeLayerId: normalizedLayer,
    targetFrameMs: Number(finiteNumber(targetFrameMs, 1000 / 60).toFixed(3)),
    frameMsAvg: Number(frameMsAvg.toFixed(3)),
    pressure: Number(pressure.toFixed(3)),
    queuePressure: manager.queuePressure,
    targetWorkers: manager.targetWorkers,
    activeTaskCount: manager.activeTaskCount,
    queuedTaskCount: manager.queuedTaskCount,
    maxSubmissions: pressureLimited,
    candidateCount: normalizedCandidates.length,
    runnableCandidateCount: runnableCandidates.length,
    urgentCandidateCount,
    admittedCount: admittedSolvers.length,
    deferredCount: deferredSolvers.length,
    admittedSolvers,
    deferredSolvers,
    decisions,
    status,
    updatedAt: Date.now()
  };
}

export function shouldSubmitSolver(report, solverKey) {
  return report?.decisions?.[solverKey]?.shouldSubmit === true;
}
