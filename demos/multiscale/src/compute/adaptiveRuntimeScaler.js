import { MULTISCALE_SOLVER_ADMISSION_SCHEMA } from './adaptiveComputeBudget.js';

export { MULTISCALE_SOLVER_ADMISSION_SCHEMA } from './adaptiveComputeBudget.js';

export const MULTISCALE_RUNTIME_SCALER_SCHEMA = 'peercompute.multiscale.runtime-scaler.v0';
export const MULTISCALE_SOLVER_LOAD_SCHEMA = 'peercompute.multiscale.solver-load.v0';
export const MULTISCALE_MEMORY_PRESSURE_SCHEMA = 'peercompute.multiscale.memory-pressure.v0';
export const MULTISCALE_NETWORK_CAPACITY_SCHEMA = 'peercompute.multiscale.network-capacity.v0';
export const MULTISCALE_WORKER_UTILIZATION_PRESSURE_SCHEMA = 'peercompute.multiscale.worker-utilization-pressure.v0';

export const SOLVER_LOAD_KEYS = [
  'nbody',
  'maxwell',
  'cosmologyExpansion',
  'molecularDynamics',
  'quantumOrbitalGrid',
  'quantumMaterialPotential',
  'reactiveThermal',
  'sphMaterial',
  'hydroAtmosphere',
  'radiationOpacity',
  'stellarFusion',
  'magnetospherePlasma',
  'picPlasmaPatch',
  'relativisticCorrection',
  'combustionPlume',
  'membraneShell'
];

const SOLVER_ADMISSION_BYTES_PER_UNIT = {
  nbody: 96,
  maxwell: 48,
  cosmologyExpansion: 64,
  molecularDynamics: 128,
  quantumOrbitalGrid: 32,
  quantumMaterialPotential: 64,
  reactiveThermal: 64,
  sphMaterial: 128,
  hydroAtmosphere: 48,
  radiationOpacity: 48,
  stellarFusion: 64,
  magnetospherePlasma: 80,
  picPlasmaPatch: 128,
  relativisticCorrection: 64,
  combustionPlume: 64,
  membraneShell: 96
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeNumber(value, fallback, min = -Number.MAX_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return clamp(number, min, max);
}

function normalizeInteger(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function readCapabilities(computeStatus = {}) {
  const peer = computeStatus.peercompute || {};
  return peer.managerCapabilities || computeStatus.capabilities || computeStatus || {};
}

function readManagerStats(capabilities = {}) {
  const stats = capabilities.stats || {};
  if (stats.schema !== 'peercompute.compute.manager-stats.v0') return null;
  return stats;
}

function readWorkerUtilization(managerStats = null) {
  const report = managerStats?.workerUtilization || null;
  return report?.schema === 'peercompute.compute.worker-utilization.v0' ? report : null;
}

function createWorkerUtilizationPressure(report = null) {
  const summary = report?.summary || {};
  const inline = report?.inline || {};
  const workers = Array.isArray(report?.workers) ? report.workers : [];
  const workerCount = normalizeInteger(summary.workerCount ?? workers.filter((entry) => entry.status !== 'retired').length, 0, 0, 100000);
  const retainedWorkerCount = normalizeInteger(summary.retainedWorkerCount ?? workers.length, workers.length, 0, 100000);
  const retiredWorkerCount = normalizeInteger(summary.retiredWorkerCount ?? workers.filter((entry) => entry.status === 'retired').length, 0, 0, 100000);
  const activeTaskCount = normalizeInteger(summary.activeTaskCount, 0, 0, 100000);
  const workerActiveTaskCount = normalizeInteger(summary.workerActiveTaskCount, 0, 0, 100000);
  const inlineActiveTaskCount = normalizeInteger(summary.inlineActiveTaskCount ?? inline.activeTaskCount, 0, 0, 100000);
  const totalSubmitted = normalizeInteger(summary.totalSubmitted, 0, 0, Number.MAX_SAFE_INTEGER);
  const totalCompleted = normalizeInteger(summary.totalCompleted, 0, 0, Number.MAX_SAFE_INTEGER);
  const totalFailed = normalizeInteger(summary.totalFailed, 0, 0, Number.MAX_SAFE_INTEGER);
  const abandonedCount = workers.reduce((sum, entry) => sum + normalizeInteger(entry.abandoned, 0, 0, Number.MAX_SAFE_INTEGER), 0);
  const saturation = workerCount > 0 ? clamp(workerActiveTaskCount / workerCount, 0, 4) : 0;
  const inlineSaturation = inlineActiveTaskCount > 0 ? 1 : 0;
  const abandonmentPressure = totalSubmitted > 0 ? clamp((abandonedCount / totalSubmitted) * 6, 0, 2) : 0;
  const failurePressure = totalSubmitted > 0 ? clamp((totalFailed / totalSubmitted) * 4, 0, 2) : 0;
  const pressure = clamp(Math.max(saturation, inlineSaturation, abandonmentPressure, failurePressure), 0, 4);
  return {
    schema: MULTISCALE_WORKER_UTILIZATION_PRESSURE_SCHEMA,
    available: report?.schema === 'peercompute.compute.worker-utilization.v0',
    workerCount,
    retainedWorkerCount,
    retiredWorkerCount,
    activeTaskCount,
    workerActiveTaskCount,
    inlineActiveTaskCount,
    totalSubmitted,
    totalCompleted,
    totalFailed,
    abandonedCount,
    saturation: Number(saturation.toFixed(3)),
    pressure: Number(pressure.toFixed(3)),
    busiestExecutorId: summary.busiestExecutorId || null
  };
}

function countPendingSolvers(solverRuntime = {}) {
  return SOLVER_LOAD_KEYS
    .reduce((count, key) => count + (solverRuntime[key]?.pending ? 1 : 0), 0);
}

function readMolecularPairTelemetry(result = {}) {
  const status = result.webgpuStatus || {};
  const diagnostics = result.diagnostics || {};
  const cpuCandidatePairCount = normalizeNumber(
    diagnostics.neighborCandidatePairCount ?? result.neighborCandidatePairCount,
    0,
    0,
    Number.MAX_SAFE_INTEGER
  );
  const webgpuCandidatePairCount = normalizeNumber(
    status.candidatePairCount ?? result.webgpuCandidatePairCount,
    0,
    0,
    Number.MAX_SAFE_INTEGER
  );
  const acceptedNeighborPairCount = normalizeNumber(
    status.acceptedNeighborPairCount
      ?? result.acceptedNeighborPairCount
      ?? result.webgpuAcceptedNeighborPairCount,
    0,
    0,
    Number.MAX_SAFE_INTEGER
  );
  const neighborCapacity = normalizeNumber(
    status.neighborCapacity ?? result.webgpuNeighborCapacity,
    0,
    0,
    Number.MAX_SAFE_INTEGER
  );
  const overflowAtoms = normalizeNumber(
    status.overflowAtoms ?? result.webgpuOverflowAtoms,
    0,
    0,
    Number.MAX_SAFE_INTEGER
  );
  const overflowCells = normalizeNumber(
    status.overflowCells ?? result.webgpuOverflowCells,
    0,
    0,
    Number.MAX_SAFE_INTEGER
  );
  const loadPairCount = Math.max(
    cpuCandidatePairCount,
    webgpuCandidatePairCount,
    acceptedNeighborPairCount
  );
  const neighborCapacityUsage = neighborCapacity > 0
    ? clamp(acceptedNeighborPairCount / neighborCapacity, 0, 4)
    : 0;
  return {
    cpuCandidatePairCount,
    webgpuCandidatePairCount,
    acceptedNeighborPairCount,
    neighborCapacity,
    neighborCapacityUsage,
    overflowAtoms,
    overflowCells,
    overflowCount: overflowAtoms + overflowCells,
    loadPairCount
  };
}

function solverWorkloadUnits(key, budgetEntry = {}, result = {}) {
  if (key === 'nbody') return budgetEntry.bodyCount ?? result.bodyCount ?? 0;
  if (key === 'maxwell') return budgetEntry.cellCount ?? (budgetEntry.width || 0) * (budgetEntry.height || 0);
  if (key === 'cosmologyExpansion') return budgetEntry.sampleCount ?? result.sampleCount ?? 0;
  if (key === 'molecularDynamics') {
    const atoms = budgetEntry.atomCount ?? result.atomCount ?? 0;
    return Math.max(atoms, readMolecularPairTelemetry(result).loadPairCount);
  }
  if (key === 'reactiveThermal') return budgetEntry.cellCount ?? 1;
  if (key === 'sphMaterial') return budgetEntry.particleCount ?? result.particleCount ?? 0;
  if (key === 'picPlasmaPatch') {
    return Math.max(
      budgetEntry.particleCount ?? result.particleCount ?? 0,
      budgetEntry.cellCount ?? (budgetEntry.gridWidth || 0) * (budgetEntry.gridHeight || 0)
    );
  }
  if (key === 'relativisticCorrection') return budgetEntry.sampleCount ?? result.sampleCount ?? 0;
  if (key === 'membraneShell') return budgetEntry.segmentCount ?? result.segmentCount ?? 0;
  return budgetEntry.cellCount ?? (budgetEntry.width || 0) * (budgetEntry.height || 0);
}

function solverPressureForEntry({ key, pending, elapsedMs, cadenceFrames, workloadUnits, result }) {
  const cadencePressure = 1 / Math.max(1, cadenceFrames);
  const elapsedPressure = elapsedMs / 10;
  const pendingPressure = pending ? 0.55 : 0;
  const workloadPressure = Math.log2(Math.max(1, workloadUnits)) / 18;
  const molecularTelemetry = key === 'molecularDynamics'
    ? readMolecularPairTelemetry(result)
    : null;
  const molecularCandidatePressure = molecularTelemetry
    ? Math.min(2.5, molecularTelemetry.loadPairCount / 4096)
    : 0;
  const molecularCapacityPressure = molecularTelemetry?.neighborCapacity > 0
    ? Math.min(1.5, molecularTelemetry.neighborCapacityUsage * 2)
    : 0;
  const molecularOverflowPressure = molecularTelemetry?.overflowCount > 0 ? 2 : 0;
  return clamp(
    elapsedPressure
      + pendingPressure
      + workloadPressure * cadencePressure
      + Math.max(molecularCandidatePressure, molecularCapacityPressure)
      + molecularOverflowPressure,
    0,
    6
  );
}

function solverAdmissionBytesFor(key) {
  return SOLVER_ADMISSION_BYTES_PER_UNIT[key] || 64;
}

function nextAdmissionScale(currentScale, pressure) {
  const normalized = normalizeNumber(currentScale, 1, 0.25, 4);
  if (pressure < 1) return normalized;
  if (normalized > 1.5) return 1.5;
  if (normalized > 1) return 1;
  if (normalized > 0.75) return 0.75;
  return Math.max(0.5, normalized * 0.75);
}

export function createSolverAdmissionReport({
  solverBudget = {},
  solverLoad = {},
  memoryPressure = null,
  workerUtilizationPressure = null,
  workerUtilization = null,
  managerStats = null,
  computeBudget = null,
  resourceProfile = {},
  solverScales = {},
  nowMs = Date.now()
} = {}) {
  const profile = resourceProfile || computeBudget?.resourceProfile || {};
  const derivedWorkerPressure = workerUtilizationPressure?.schema === MULTISCALE_WORKER_UTILIZATION_PRESSURE_SCHEMA
    ? workerUtilizationPressure
    : createWorkerUtilizationPressure(workerUtilization || readWorkerUtilization(managerStats));
  const entries = {};
  let totalEstimatedMemoryMB = 0;
  let dominantSolver = null;
  let dominantScore = 0;
  let limitedSolverCount = 0;
  let lockedLimitedSolverCount = 0;

  const memoryBudgetMB = normalizeNumber(
    memoryPressure?.memoryBudgetMB ?? profile.memoryBudgetMB ?? computeBudget?.capacity?.memoryBudgetMB,
    0,
    0,
    Number.MAX_SAFE_INTEGER
  );
  const gpuMemoryBudgetMB = normalizeNumber(
    memoryPressure?.gpuMemoryBudgetMB ?? profile.gpuMemoryBudgetMB ?? computeBudget?.capacity?.gpuMemoryBudgetMB,
    0,
    0,
    Number.MAX_SAFE_INTEGER
  );
  const capacityScale = normalizeNumber(
    computeBudget?.capacity?.budgetScale ?? computeBudget?.capacityScale,
    1,
    0.05,
    64
  );
  const memoryPressureValue = normalizeNumber(memoryPressure?.pressure, 0, 0, 6);
  const workerPressureValue = normalizeNumber(derivedWorkerPressure?.pressure, 0, 0, 4);
  const solverDominantPressure = normalizeNumber(solverLoad?.dominantPressure, 0, 0, 6);

  for (const key of SOLVER_LOAD_KEYS) {
    const loadEntry = solverLoad?.entries?.[key] || {};
    const budgetEntry = solverBudget?.[key] || {};
    const workloadUnits = solverWorkloadUnits(key, budgetEntry, loadEntry);
    const estimatedMemoryMB = workloadUnits * solverAdmissionBytesFor(key) / (1024 * 1024);
    const pressure = normalizeNumber(loadEntry.pressure, 0, 0, 6);
    const locked = Boolean(loadEntry.locked);
    const currentScale = normalizeNumber(solverScales?.[key], 1, 0.25, 4);
    const localPressure = Math.max(
      pressure,
      memoryPressureValue * 0.75,
      workerPressureValue * 0.85,
      capacityScale < 0.75 ? (0.75 - capacityScale) * 2 : 0
    );
    const nextScale = nextAdmissionScale(currentScale, localPressure);
    const limited = localPressure >= 1 && nextScale < currentScale - 1e-6;
    if (limited) {
      limitedSolverCount += 1;
      if (locked) lockedLimitedSolverCount += 1;
    }
    const score = locked
      ? 0
      : localPressure + Math.log2(Math.max(1, workloadUnits)) / 24;
    if (score > dominantScore) {
      dominantScore = score;
      dominantSolver = key;
    }
    totalEstimatedMemoryMB += estimatedMemoryMB;
    entries[key] = {
      solverKey: key,
      locked,
      workloadUnits: Number((workloadUnits || 0).toFixed(2)),
      currentScale: Number(currentScale.toFixed(3)),
      admittedScale: Number(nextScale.toFixed(3)),
      pressure: Number(localPressure.toFixed(3)),
      estimatedMemoryMB: Number(estimatedMemoryMB.toFixed(3)),
      state: locked && limited
        ? 'locked-over-budget'
        : limited
          ? 'reduce'
          : 'admit'
    };
  }

  const estimatedMemoryBudgetPressure = memoryBudgetMB > 0
    ? clamp(totalEstimatedMemoryMB / Math.max(1, memoryBudgetMB * 0.2), 0, 6)
    : 0;
  const estimatedGpuBudgetPressure = gpuMemoryBudgetMB > 0
    ? clamp(totalEstimatedMemoryMB / Math.max(1, gpuMemoryBudgetMB * 0.25), 0, 6)
    : 0;
  const pressure = clamp(Math.max(
    memoryPressureValue / 1.5,
    workerPressureValue,
    solverDominantPressure / 1.6,
    estimatedMemoryBudgetPressure,
    estimatedGpuBudgetPressure
  ), 0, 6);
  const dominantLimiter = memoryPressureValue >= 1.5
    ? 'memory-pressure'
    : workerPressureValue >= 1
      ? 'worker-utilization-pressure'
      : solverDominantPressure >= 1.25
        ? 'solver-load-pressure'
        : estimatedGpuBudgetPressure >= 1
          ? 'gpu-memory-budget'
          : estimatedMemoryBudgetPressure >= 1
            ? 'memory-budget'
            : 'headroom';
  const recommendedAction = pressure >= 1
    ? 'scale-down'
    : pressure <= 0.35
      ? 'admit-growth'
      : 'hold';

  return {
    schema: MULTISCALE_SOLVER_ADMISSION_SCHEMA,
    sampledAtMs: normalizeNumber(nowMs, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    available: solverLoad?.schema === MULTISCALE_SOLVER_LOAD_SCHEMA,
    resourceTier: profile.tier || computeBudget?.resourceTier || 'unknown',
    capacityScale: Number(capacityScale.toFixed(3)),
    memoryBudgetMB: Number(memoryBudgetMB.toFixed(2)),
    gpuMemoryBudgetMB: Number(gpuMemoryBudgetMB.toFixed(2)),
    totalEstimatedMemoryMB: Number(totalEstimatedMemoryMB.toFixed(3)),
    memoryPressure: Number(memoryPressureValue.toFixed(3)),
    workerPressure: Number(workerPressureValue.toFixed(3)),
    solverPressure: Number(solverDominantPressure.toFixed(3)),
    estimatedMemoryBudgetPressure: Number(estimatedMemoryBudgetPressure.toFixed(3)),
    estimatedGpuBudgetPressure: Number(estimatedGpuBudgetPressure.toFixed(3)),
    pressure: Number(pressure.toFixed(3)),
    dominantLimiter,
    dominantSolver,
    dominantScore: Number(dominantScore.toFixed(3)),
    limitedSolverCount,
    lockedLimitedSolverCount,
    recommendedAction,
    entries
  };
}

export function createSolverLoadReport({
  solverRuntime = {},
  solverBudget = {},
  lockedSolvers = []
} = {}) {
  const locked = new Set(lockedSolvers);
  const entries = {};
  let totalPressure = 0;
  let dominantSolver = null;
  let dominantPressure = 0;

  for (const key of SOLVER_LOAD_KEYS) {
    const runtime = solverRuntime[key] || {};
    const result = runtime.lastResult || {};
    const budgetEntry = solverBudget[key] || {};
    const elapsedMs = normalizeNumber(result.elapsedTime, 0, 0, 10000);
    const cadenceFrames = normalizeInteger(runtime.cadenceFrames ?? budgetEntry.cadenceFrames, 1, 1, 120);
    const workloadUnits = solverWorkloadUnits(key, budgetEntry, result);
    const pending = !!runtime.pending;
    const pressure = solverPressureForEntry({
      key,
      pending,
      elapsedMs,
      cadenceFrames,
      workloadUnits,
      result
    });

    const entry = {
      solverKey: key,
      pending,
      locked: locked.has(key),
      backend: result.backend || 'none',
      elapsedMs: Number(elapsedMs.toFixed(3)),
      cadenceFrames,
      workloadUnits: Number(workloadUnits || 0),
      pressure: Number(pressure.toFixed(3))
    };
    if (key === 'molecularDynamics') {
      const molecularTelemetry = readMolecularPairTelemetry(result);
      entry.atomCount = result.atomCount ?? budgetEntry.atomCount ?? 0;
      entry.neighborCandidatePairCount = molecularTelemetry.cpuCandidatePairCount;
      entry.kernelMode = result.webgpuStatus?.kernelMode || null;
      entry.neighborListMode = result.webgpuStatus?.neighborListMode || null;
      entry.acceptedNeighborPairCount = molecularTelemetry.acceptedNeighborPairCount;
      entry.webgpuCandidatePairCount = molecularTelemetry.webgpuCandidatePairCount;
      entry.webgpuOverflowAtoms = molecularTelemetry.overflowAtoms;
      entry.webgpuOverflowCells = molecularTelemetry.overflowCells;
      entry.webgpuNeighborCapacity = molecularTelemetry.neighborCapacity;
      entry.webgpuNeighborCapacityUsage = Number(molecularTelemetry.neighborCapacityUsage.toFixed(4));
      entry.molecularPairPressure = Number(Math.min(2.5, molecularTelemetry.loadPairCount / 4096).toFixed(3));
      entry.molecularOverflowPressure = molecularTelemetry.overflowCount > 0 ? 2 : 0;
    }
    entries[key] = entry;
    totalPressure += pressure;
    if (!entry.locked && pressure > dominantPressure) {
      dominantPressure = pressure;
      dominantSolver = key;
    }
  }

  return {
    schema: MULTISCALE_SOLVER_LOAD_SCHEMA,
    totalPressure: Number(totalPressure.toFixed(3)),
    dominantSolver,
    dominantPressure: Number(dominantPressure.toFixed(3)),
    lockedSolvers: [...locked],
    entries
  };
}

function makeQualityLadder(minQuality, maxQuality) {
  return [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4]
    .filter((value) => value >= minQuality - 1e-6 && value <= maxQuality + 1e-6);
}

function normalizeSolverScaleMap(value = {}) {
  const next = {};
  for (const key of SOLVER_LOAD_KEYS) {
    const scale = normalizeNumber(value[key], 1, 0.25, 4);
    if (Math.abs(scale - 1) > 1e-6) next[key] = scale;
  }
  return next;
}

function bytesToMb(value) {
  return normalizeNumber(value, 0, 0, Number.MAX_SAFE_INTEGER) / (1024 * 1024);
}

function rounded(value, digits = 4) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(digits));
}

export function createMemoryPressureReport({
  performanceMemory = null,
  resourceProfile = {},
  computeBudget = null,
  nowMs = Date.now()
} = {}) {
  const memoryBudgetMB = normalizeNumber(
    resourceProfile.memoryBudgetMB ?? computeBudget?.resourceProfile?.memoryBudgetMB ?? computeBudget?.capacity?.memoryBudgetMB,
    0,
    0,
    Number.MAX_SAFE_INTEGER
  );
  const gpuMemoryBudgetMB = normalizeNumber(
    resourceProfile.gpuMemoryBudgetMB ?? computeBudget?.resourceProfile?.gpuMemoryBudgetMB ?? computeBudget?.capacity?.gpuMemoryBudgetMB,
    0,
    0,
    Number.MAX_SAFE_INTEGER
  );
  const deviceMemoryGB = normalizeNumber(
    resourceProfile.deviceMemoryGB ?? computeBudget?.resourceProfile?.deviceMemoryGB,
    0,
    0,
    Number.MAX_SAFE_INTEGER
  );
  const usedJSHeapSizeMB = bytesToMb(performanceMemory?.usedJSHeapSize);
  const totalJSHeapSizeMB = bytesToMb(performanceMemory?.totalJSHeapSize);
  const jsHeapSizeLimitMB = bytesToMb(performanceMemory?.jsHeapSizeLimit);
  const hasHeapSample = usedJSHeapSizeMB > 0 && (jsHeapSizeLimitMB > 0 || totalJSHeapSizeMB > 0);
  const heapUsageRatio = jsHeapSizeLimitMB > 0
    ? usedJSHeapSizeMB / jsHeapSizeLimitMB
    : 0;
  const totalHeapUsageRatio = jsHeapSizeLimitMB > 0
    ? totalJSHeapSizeMB / jsHeapSizeLimitMB
    : 0;
  const budgetUsageRatio = memoryBudgetMB > 0 && usedJSHeapSizeMB > 0
    ? usedJSHeapSizeMB / memoryBudgetMB
    : 0;
  const pressureRatio = Math.max(heapUsageRatio, budgetUsageRatio);
  const pressure = hasHeapSample ? clamp(pressureRatio * 2, 0, 6) : 0;
  const level = pressureRatio >= 0.95
    ? 'critical'
    : pressureRatio >= 0.85
      ? 'high'
      : pressureRatio >= 0.7
        ? 'elevated'
        : 'nominal';
  return {
    schema: MULTISCALE_MEMORY_PRESSURE_SCHEMA,
    source: hasHeapSample ? 'performance.memory' : 'unavailable',
    available: hasHeapSample,
    sampledAtMs: normalizeNumber(nowMs, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    level,
    pressure: rounded(pressure, 3),
    usageRatio: rounded(pressureRatio),
    heapUsageRatio: rounded(heapUsageRatio),
    totalHeapUsageRatio: rounded(totalHeapUsageRatio),
    budgetUsageRatio: rounded(budgetUsageRatio),
    usedJSHeapSizeMB: rounded(usedJSHeapSizeMB, 2),
    totalJSHeapSizeMB: rounded(totalJSHeapSizeMB, 2),
    jsHeapSizeLimitMB: rounded(jsHeapSizeLimitMB, 2),
    memoryBudgetMB: rounded(memoryBudgetMB, 2),
    gpuMemoryBudgetMB: rounded(gpuMemoryBudgetMB, 2),
    deviceMemoryGB: rounded(deviceMemoryGB, 2)
  };
}

function normalizeString(value, fallback = 'unknown') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function hasOverride(overrides = {}, keys = []) {
  return keys.some((key) => overrides[key] !== undefined && overrides[key] !== null && overrides[key] !== '');
}

function bandwidthTier(downlinkMbps) {
  if (!(downlinkMbps > 0)) return 'unknown';
  if (downlinkMbps >= 1000) return 'datacenter';
  if (downlinkMbps >= 100) return 'high';
  if (downlinkMbps >= 25) return 'moderate';
  return 'low';
}

function latencyTier(rttMs) {
  if (!(rttMs > 0)) return 'unknown';
  if (rttMs <= 10) return 'lan';
  if (rttMs <= 60) return 'regional';
  if (rttMs <= 180) return 'wan';
  return 'high-latency';
}

function effectiveTypeScore(effectiveType) {
  if (effectiveType === 'slow-2g') return 0.08;
  if (effectiveType === '2g') return 0.16;
  if (effectiveType === '3g') return 0.35;
  if (effectiveType === '4g') return 0.65;
  return 0.25;
}

export function createNetworkCapacityReport({
  connection = null,
  overrides = {},
  computeBudget = null,
  managerStats = null,
  nowMs = Date.now()
} = {}) {
  const overrideSource = hasOverride(overrides, [
    'clusterNodes',
    'clusterNodeCount',
    'clusterGpus',
    'clusterGpuCount',
    'networkBandwidthMbps',
    'networkRttMs',
    'networkEffectiveType',
    'networkSaveData'
  ]);
  const hasConnection = !!connection;
  const source = overrideSource && hasConnection
    ? 'query-overrides+network-information'
    : overrideSource
      ? 'query-overrides'
      : hasConnection
        ? 'network-information'
        : 'unavailable';
  const effectiveType = normalizeString(
    overrides.networkEffectiveType ?? connection?.effectiveType,
    'unknown'
  );
  const downlinkMbps = normalizeNumber(
    overrides.networkBandwidthMbps ?? connection?.downlink,
    0,
    0,
    1000000
  );
  const rttMs = normalizeNumber(
    overrides.networkRttMs ?? connection?.rtt,
    0,
    0,
    60000
  );
  const saveData = Boolean(overrides.networkSaveData ?? connection?.saveData ?? false);
  const clusterNodeCount = normalizeInteger(
    overrides.clusterNodes ?? overrides.clusterNodeCount,
    1,
    1,
    1000000
  );
  const clusterGpuCount = normalizeInteger(
    overrides.clusterGpus ?? overrides.clusterGpuCount,
    0,
    0,
    1000000
  );
  const localWorkerTarget = normalizeInteger(
    computeBudget?.managerTargetWorkers ?? managerStats?.targetWorkers ?? managerStats?.workerCount,
    1,
    1,
    1000000
  );
  const remoteWorkerCapacity = Math.max(0, clusterNodeCount - 1) * localWorkerTarget + clusterGpuCount * Math.max(1, localWorkerTarget);
  const bandwidthScore = downlinkMbps > 0
    ? clamp(Math.log2(1 + downlinkMbps) / 10, 0, 1.5)
    : effectiveTypeScore(effectiveType);
  const latencyScore = rttMs > 0
    ? clamp(1 - rttMs / 300, 0, 1)
    : effectiveTypeScore(effectiveType);
  const clusterScore = clamp(remoteWorkerCapacity / Math.max(1, localWorkerTarget * 8), 0, 2);
  const capacityScore = clamp((bandwidthScore * 0.45 + latencyScore * 0.3 + clusterScore * 0.6) * (saveData ? 0.55 : 1), 0, 4);
  const placementMode = remoteWorkerCapacity <= 0
    ? 'local-only'
    : rttMs > 0 && rttMs <= 10 && downlinkMbps >= 100
      ? 'cluster-lan'
      : 'cluster-wan';
  const recommendation = saveData || capacityScore < 0.45
    ? 'local-only'
    : remoteWorkerCapacity > 0 && capacityScore >= 1
      ? 'cluster-shards'
      : capacityScore >= 0.7
        ? 'peer-shards'
        : 'coarse-sync';
  return {
    schema: MULTISCALE_NETWORK_CAPACITY_SCHEMA,
    source,
    available: hasConnection || overrideSource,
    sampledAtMs: normalizeNumber(nowMs, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    effectiveType,
    downlinkMbps: rounded(downlinkMbps, 2),
    rttMs: rounded(rttMs, 1),
    saveData,
    bandwidthTier: bandwidthTier(downlinkMbps),
    latencyTier: latencyTier(rttMs),
    clusterNodeCount,
    clusterGpuCount,
    localWorkerTarget,
    remoteWorkerCapacity,
    placementMode,
    recommendation,
    capacityScore: rounded(capacityScore, 3)
  };
}

export class AdaptiveRuntimeScaler {
  constructor({
    enabled = true,
    workerPolicy = {},
    initialQuality = 1,
    minQuality = 0.5,
    maxQuality = 4,
    targetFrameMs = 33,
    relaxFrameMs = 18,
    sampleAlpha = 0.08,
    cooldownFrames = 240,
    warmupFrames = 180,
    pressureScaleUp = 1.45,
    pressureScaleDown = 0.55,
    initialSolverScales = {},
    minSolverScale = 0.5,
    maxSolverScale = 1.5,
    solverPressureScaleUp = 1.25,
    solverPressureScaleDown = 0.35,
    memoryPressureScaleUp = 1.5,
    manualWorkerCooldownFrames = 120
  } = {}) {
    this.enabled = enabled !== false;
    this.workerPolicy = {
      minWorkers: normalizeInteger(workerPolicy.minWorkers, 1, 0, 256),
      targetWorkers: normalizeInteger(workerPolicy.targetWorkers, 1, 0, 256),
      maxWorkers: normalizeInteger(workerPolicy.maxWorkers, workerPolicy.targetWorkers || 1, 0, 256)
    };
    this.minQuality = normalizeNumber(minQuality, 0.5, 0.25, 4);
    this.maxQuality = normalizeNumber(maxQuality, 4, this.minQuality, 4);
    this.quality = normalizeNumber(initialQuality, 1, this.minQuality, this.maxQuality);
    this.qualityLadder = makeQualityLadder(this.minQuality, this.maxQuality);
    this.targetFrameMs = normalizeNumber(targetFrameMs, 33, 1, 1000);
    this.relaxFrameMs = normalizeNumber(relaxFrameMs, 18, 1, this.targetFrameMs);
    this.sampleAlpha = normalizeNumber(sampleAlpha, 0.08, 0.01, 1);
    this.cooldownFrames = normalizeInteger(cooldownFrames, 240, 1, 100000);
    this.warmupFrames = normalizeInteger(warmupFrames, 180, 0, 100000);
    this.pressureScaleUp = normalizeNumber(pressureScaleUp, 1.45, 0.1, 10);
    this.pressureScaleDown = normalizeNumber(pressureScaleDown, 0.55, 0, 10);
    this.minSolverScale = normalizeNumber(minSolverScale, 0.5, 0.25, 4);
    this.maxSolverScale = normalizeNumber(maxSolverScale, 1.5, this.minSolverScale, 4);
    this.solverPressureScaleUp = normalizeNumber(solverPressureScaleUp, 1.25, 0.1, 10);
    this.solverPressureScaleDown = normalizeNumber(solverPressureScaleDown, 0.35, 0, 10);
    this.memoryPressureScaleUp = normalizeNumber(memoryPressureScaleUp, 1.5, 0.1, 10);
    this.manualWorkerCooldownFrames = normalizeInteger(manualWorkerCooldownFrames, 120, 0, 100000);
    this.solverScales = normalizeSolverScaleMap(initialSolverScales);
    this.solverScaleLadder = makeQualityLadder(this.minSolverScale, this.maxSolverScale);
    this.frameCount = 0;
    this.cooldown = 0;
    this.workerCooldown = 0;
    this.frameMsAvg = this.targetFrameMs;
    this.pressure = 0;
    this.solverLoad = null;
    this.memoryPressure = null;
    this.workerUtilizationPressure = null;
    this.solverAdmission = null;
    this.lastAction = 'baseline';
    this.lastRequest = null;
    this.lastApplied = null;
  }

  setWorkerPolicy(workerPolicy = {}) {
    this.workerPolicy = {
      minWorkers: normalizeInteger(workerPolicy.minWorkers, this.workerPolicy.minWorkers, 0, 256),
      targetWorkers: normalizeInteger(workerPolicy.targetWorkers, this.workerPolicy.targetWorkers, 0, 256),
      maxWorkers: normalizeInteger(workerPolicy.maxWorkers, this.workerPolicy.maxWorkers, 0, 256)
    };
    this.lastAction = 'worker-policy-update';
    return this.getStatus();
  }

  setQuality(quality) {
    this.quality = normalizeNumber(quality, this.quality, this.minQuality, this.maxQuality);
    this.lastAction = 'quality-update';
    return this.getStatus();
  }

  setEnabled(enabled) {
    this.enabled = enabled !== false;
    this.lastAction = this.enabled ? 'enabled' : 'disabled';
    return this.getStatus();
  }

  update({
    frameMs = null,
    computeStatus = {},
    solverRuntime = {},
    solverGovernor = {},
    solverQualityMultiplier = this.quality,
    solverLoad = null,
    solverAdmission = null,
    memoryPressure = null,
    simBusy = false
  } = {}) {
    const observedFrameMs = normalizeNumber(frameMs, this.frameMsAvg, 0, 5000);
    this.frameMsAvg = this.frameMsAvg * (1 - this.sampleAlpha) + observedFrameMs * this.sampleAlpha;
    this.frameCount += 1;
    this.cooldown = Math.max(0, this.cooldown - 1);
    this.workerCooldown = Math.max(0, this.workerCooldown - 1);
    this.quality = normalizeNumber(solverQualityMultiplier, this.quality, this.minQuality, this.maxQuality);

    const capabilities = readCapabilities(computeStatus);
    const currentWorkers = normalizeInteger(capabilities.workers, this.workerPolicy.targetWorkers, 0, this.workerPolicy.maxWorkers);
    const activeTasks = normalizeInteger(capabilities.activeTaskCount, 0, 0, 100000);
    const queuedTasks = normalizeInteger(capabilities.queuedTaskCount, 0, 0, 100000);
    const managerStats = readManagerStats(capabilities);
    const workerUtilizationPressure = createWorkerUtilizationPressure(readWorkerUtilization(managerStats));
    const managerLoad = normalizeNumber(managerStats?.currentLoad, 0, 0, 16);
    const managerAverageTaskMs = normalizeNumber(
      managerStats?.averageTaskDurationMs ?? managerStats?.averageTaskDuration,
      0,
      0,
      10000
    );
    const targetWorkers = normalizeInteger(
      capabilities.targetWorkers,
      this.workerPolicy.targetWorkers,
      this.workerPolicy.minWorkers,
      this.workerPolicy.maxWorkers
    );
    const pendingSolvers = countPendingSolvers(solverRuntime);
    const queuePressure = activeTasks + queuedTasks;
    const framePressure = clamp(
      (this.frameMsAvg - this.relaxFrameMs) / Math.max(1, this.targetFrameMs - this.relaxFrameMs),
      0,
      4
    );
    const governorPressure = normalizeNumber(solverGovernor.pressure, 0, 0, 4);
    const solverLoadPressure = normalizeNumber(solverLoad?.dominantPressure, 0, 0, 6);
    const managerDurationPressure = managerAverageTaskMs > 0
      ? clamp((managerAverageTaskMs / Math.max(1, this.targetFrameMs)) * 0.5, 0, 2)
      : 0;
    const managerPressure = Math.max(clamp(managerLoad, 0, 4), managerDurationPressure);
    this.solverLoad = solverLoad?.schema === MULTISCALE_SOLVER_LOAD_SCHEMA ? solverLoad : null;
    this.solverAdmission = solverAdmission?.schema === MULTISCALE_SOLVER_ADMISSION_SCHEMA ? solverAdmission : null;
    this.memoryPressure = memoryPressure?.schema === MULTISCALE_MEMORY_PRESSURE_SCHEMA ? memoryPressure : null;
    this.workerUtilizationPressure = workerUtilizationPressure.available ? workerUtilizationPressure : null;
    const memoryPressureValue = normalizeNumber(this.memoryPressure?.pressure, 0, 0, 6);
    const workerPressureValue = normalizeNumber(this.workerUtilizationPressure?.pressure, 0, 0, 4);
    const solverAdmissionPressure = normalizeNumber(this.solverAdmission?.pressure, 0, 0, 6);
    this.pressure = clamp(
      Math.max(framePressure, governorPressure, solverLoadPressure, managerPressure, memoryPressureValue, workerPressureValue, solverAdmissionPressure)
        + pendingSolvers * 0.16
        + queuedTasks * 0.1,
      0,
      6
    );

    const request = this.enabled
      ? this.planRequest({
        currentWorkers,
        targetWorkers,
        queuePressure,
        queuedTasks,
        managerLoad,
        pendingSolvers,
        solverLoad: this.solverLoad,
        solverAdmission: this.solverAdmission,
        memoryPressure: this.memoryPressure,
        workerUtilizationPressure: this.workerUtilizationPressure,
        simBusy
      })
      : null;
    this.lastRequest = request;
    this.lastAction = request?.action || (this.enabled ? 'observe' : 'disabled');
    return this.getStatus();
  }

  planRequest({
    currentWorkers,
    targetWorkers,
    queuePressure,
    queuedTasks,
    managerLoad,
    pendingSolvers,
    solverLoad,
    solverAdmission,
    memoryPressure,
    workerUtilizationPressure,
    simBusy
  }) {
    if (this.cooldown > 0) return null;

    const hasQueuePressure = queuePressure >= Math.max(1, currentWorkers);
    const managerSaturated = managerLoad >= 0.95;
    const workerUtilizationSaturated = normalizeNumber(workerUtilizationPressure?.saturation, 0, 0, 4) >= 0.9
      || normalizeNumber(workerUtilizationPressure?.pressure, 0, 0, 4) >= 1;
    const workerUtilizationIdle = workerUtilizationPressure?.available !== false
      && normalizeNumber(workerUtilizationPressure?.saturation, 0, 0, 4) <= 0.15
      && normalizeInteger(workerUtilizationPressure?.inlineActiveTaskCount, 0, 0, 100000) === 0;
    const memorySaturated = normalizeNumber(memoryPressure?.pressure, 0, 0, 6) >= this.memoryPressureScaleUp;

    if (
      this.frameCount >= this.warmupFrames
      && memorySaturated
      && !simBusy
      && solverLoad?.dominantSolver
      && this.getSolverScale(solverLoad.dominantSolver) > this.minSolverScale + 1e-6
    ) {
      const solverKey = solverLoad.dominantSolver;
      const solverWorkloadMultiplier = this.nextSolverScale(solverKey, -1);
      this.cooldown = this.cooldownFrames;
      return {
        action: 'scale-solver-workload-down',
        reason: 'memory-pressure',
        solverKey,
        solverWorkloadMultiplier,
        memoryPressure: memoryPressure.pressure
      };
    }

    if (
      this.frameCount >= this.warmupFrames
      && memorySaturated
      && !simBusy
      && this.quality > this.minQuality + 1e-6
    ) {
      const nextQuality = this.nextQuality(-1);
      this.cooldown = this.cooldownFrames;
      return {
        action: 'scale-workload-down',
        reason: 'memory-pressure',
        qualityMultiplier: nextQuality,
        memoryPressure: memoryPressure.pressure
      };
    }

    if (
      memorySaturated
      && this.workerCooldown === 0
      && targetWorkers > this.workerPolicy.minWorkers
    ) {
      this.cooldown = Math.max(60, Math.floor(this.cooldownFrames / 2));
      return {
        action: 'scale-workers-down',
        reason: 'memory-pressure',
        workerTarget: Math.max(this.workerPolicy.minWorkers, targetWorkers - 1),
        memoryPressure: memoryPressure.pressure
      };
    }

    if (
      this.workerCooldown === 0
      && (hasQueuePressure || managerSaturated || workerUtilizationSaturated)
      && !memorySaturated
      && currentWorkers < this.workerPolicy.maxWorkers
    ) {
      const nextWorkers = clamp(
        Math.max(targetWorkers + 1, currentWorkers + 1, queuePressure),
        this.workerPolicy.minWorkers,
        this.workerPolicy.maxWorkers
      );
      this.cooldown = Math.max(30, Math.floor(this.cooldownFrames / 3));
      return {
        action: 'scale-workers-up',
        reason: workerUtilizationSaturated && !hasQueuePressure && !managerSaturated
          ? 'worker-utilization-pressure'
          : managerSaturated && !hasQueuePressure
            ? 'manager-load-pressure'
            : 'queue-pressure',
        workerTarget: nextWorkers
      };
    }

    if (
      this.frameCount >= this.warmupFrames
      && !simBusy
      && solverAdmission?.recommendedAction === 'scale-down'
      && solverAdmission?.dominantSolver
      && this.getSolverScale(solverAdmission.dominantSolver) > this.minSolverScale + 1e-6
    ) {
      const solverKey = solverAdmission.dominantSolver;
      const solverWorkloadMultiplier = this.nextSolverScale(solverKey, -1);
      this.cooldown = this.cooldownFrames;
      return {
        action: 'scale-solver-workload-down',
        reason: 'solver-admission-pressure',
        solverKey,
        solverWorkloadMultiplier,
        solverAdmissionPressure: solverAdmission.pressure,
        dominantLimiter: solverAdmission.dominantLimiter
      };
    }

    if (
      this.frameCount >= this.warmupFrames
      && !simBusy
      && solverLoad?.dominantSolver
      && solverLoad.dominantPressure >= this.solverPressureScaleUp
      && this.getSolverScale(solverLoad.dominantSolver) > this.minSolverScale + 1e-6
    ) {
      const solverKey = solverLoad.dominantSolver;
      const solverWorkloadMultiplier = this.nextSolverScale(solverKey, -1);
      this.cooldown = this.cooldownFrames;
      return {
        action: 'scale-solver-workload-down',
        reason: 'solver-load-pressure',
        solverKey,
        solverWorkloadMultiplier,
        solverPressure: solverLoad.dominantPressure
      };
    }

    if (
      this.frameCount >= this.warmupFrames
      && !simBusy
      && this.pressure >= this.pressureScaleUp
      && this.quality > this.minQuality + 1e-6
    ) {
      const nextQuality = this.nextQuality(-1);
      this.cooldown = this.cooldownFrames;
      return {
        action: 'scale-workload-down',
        reason: 'runtime-pressure',
        qualityMultiplier: nextQuality
      };
    }

    if (
      this.frameCount >= this.warmupFrames
      && !simBusy
      && solverLoad?.dominantPressure <= this.solverPressureScaleDown
      && queuedTasks === 0
      && pendingSolvers === 0
    ) {
      const reducedSolver = this.mostReducedSolver();
      if (reducedSolver) {
        const solverWorkloadMultiplier = this.nextSolverScale(reducedSolver, 1);
        this.cooldown = this.cooldownFrames;
        return {
          action: 'scale-solver-workload-up',
          reason: 'solver-load-headroom',
          solverKey: reducedSolver,
          solverWorkloadMultiplier,
          solverPressure: solverLoad.dominantPressure
        };
      }
    }

    if (
      this.frameCount >= this.warmupFrames
      && !simBusy
      && this.pressure <= this.pressureScaleDown
      && queuedTasks === 0
      && pendingSolvers === 0
      && this.frameMsAvg < this.relaxFrameMs
      && this.quality < this.maxQuality - 1e-6
    ) {
      const nextQuality = this.nextQuality(1);
      this.cooldown = this.cooldownFrames;
      return {
        action: 'scale-workload-up',
        reason: 'runtime-headroom',
        qualityMultiplier: nextQuality
      };
    }

    if (
      this.frameCount >= this.warmupFrames
      && this.pressure <= this.pressureScaleDown
      && queuedTasks === 0
      && pendingSolvers === 0
      && targetWorkers > this.workerPolicy.targetWorkers
      && this.workerCooldown === 0
      && (workerUtilizationPressure == null || workerUtilizationIdle)
    ) {
      this.cooldown = Math.max(60, Math.floor(this.cooldownFrames / 2));
      return {
        action: 'scale-workers-down',
        reason: workerUtilizationPressure ? 'worker-utilization-headroom' : 'runtime-headroom',
        workerTarget: Math.max(this.workerPolicy.targetWorkers, targetWorkers - 1)
      };
    }

    return null;
  }

  nextQuality(direction) {
    const ladder = this.qualityLadder.length > 0 ? this.qualityLadder : [this.minQuality, this.maxQuality];
    const nearest = ladder.reduce((bestIndex, value, index) => (
      Math.abs(value - this.quality) < Math.abs(ladder[bestIndex] - this.quality) ? index : bestIndex
    ), 0);
    const nextIndex = clamp(nearest + (direction > 0 ? 1 : -1), 0, ladder.length - 1);
    return ladder[nextIndex];
  }

  getSolverScale(solverKey) {
    return normalizeNumber(this.solverScales[solverKey], 1, this.minSolverScale, this.maxSolverScale);
  }

  nextSolverScale(solverKey, direction) {
    const ladder = this.solverScaleLadder.length > 0
      ? this.solverScaleLadder
      : [this.minSolverScale, 1, this.maxSolverScale];
    const current = this.getSolverScale(solverKey);
    const nearest = ladder.reduce((bestIndex, value, index) => (
      Math.abs(value - current) < Math.abs(ladder[bestIndex] - current) ? index : bestIndex
    ), 0);
    const nextIndex = clamp(nearest + (direction > 0 ? 1 : -1), 0, ladder.length - 1);
    const next = ladder[nextIndex];
    if (Math.abs(next - 1) <= 1e-6) {
      delete this.solverScales[solverKey];
    } else {
      this.solverScales[solverKey] = next;
    }
    return next;
  }

  mostReducedSolver() {
    let selected = null;
    let selectedScale = 1;
    for (const key of Object.keys(this.solverScales)) {
      const normalized = this.getSolverScale(key);
      if (normalized < selectedScale) {
        selected = key;
        selectedScale = normalized;
      }
    }
    return selected;
  }

  noteApplied(result = {}) {
    if (result.action === 'manual-worker-resize') {
      this.workerCooldown = Math.max(this.workerCooldown, this.manualWorkerCooldownFrames);
    }
    this.lastApplied = {
      ok: result.ok !== false,
      action: result.action || this.lastRequest?.action || null,
      reason: result.reason || this.lastRequest?.reason || null,
      workerTarget: result.workerTarget ?? this.lastRequest?.workerTarget ?? null,
      qualityMultiplier: result.qualityMultiplier ?? this.lastRequest?.qualityMultiplier ?? null,
      solverKey: result.solverKey ?? this.lastRequest?.solverKey ?? null,
      solverWorkloadMultiplier: result.solverWorkloadMultiplier ?? this.lastRequest?.solverWorkloadMultiplier ?? null
    };
    return this.getStatus();
  }

  getStatus() {
    return {
      schema: MULTISCALE_RUNTIME_SCALER_SCHEMA,
      enabled: this.enabled,
      frameCount: this.frameCount,
      targetFrameMs: this.targetFrameMs,
      relaxFrameMs: this.relaxFrameMs,
      frameMsAvg: Number(this.frameMsAvg.toFixed(3)),
      pressure: Number(this.pressure.toFixed(3)),
      solverLoad: this.solverLoad
        ? {
          schema: this.solverLoad.schema,
          totalPressure: this.solverLoad.totalPressure,
          dominantSolver: this.solverLoad.dominantSolver,
          dominantPressure: this.solverLoad.dominantPressure
        }
        : null,
      solverAdmission: this.solverAdmission
        ? {
          schema: this.solverAdmission.schema,
          pressure: this.solverAdmission.pressure,
          dominantSolver: this.solverAdmission.dominantSolver,
          dominantLimiter: this.solverAdmission.dominantLimiter,
          recommendedAction: this.solverAdmission.recommendedAction,
          limitedSolverCount: this.solverAdmission.limitedSolverCount,
          lockedLimitedSolverCount: this.solverAdmission.lockedLimitedSolverCount
        }
        : null,
      memoryPressure: this.memoryPressure ? { ...this.memoryPressure } : null,
      workerUtilizationPressure: this.workerUtilizationPressure ? { ...this.workerUtilizationPressure } : null,
      cooldownFrames: this.cooldown,
      workerCooldownFrames: this.workerCooldown,
      manualWorkerCooldownFrames: this.manualWorkerCooldownFrames,
      memoryPressureScaleUp: this.memoryPressureScaleUp,
      qualityBounds: {
        min: this.minQuality,
        max: this.maxQuality
      },
      solverWorkloadScales: { ...this.solverScales },
      workerPolicy: { ...this.workerPolicy },
      lastAction: this.lastAction,
      lastRequest: this.lastRequest ? { ...this.lastRequest } : null,
      lastApplied: this.lastApplied ? { ...this.lastApplied } : null
    };
  }
}
