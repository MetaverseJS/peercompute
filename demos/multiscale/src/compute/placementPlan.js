import { SOLVER_LOAD_KEYS } from './adaptiveRuntimeScaler.js';

export const MULTISCALE_PLACEMENT_PLAN_SCHEMA = 'peercompute.multiscale.placement-plan.v0';
export const MULTISCALE_REMOTE_PLACEMENT_READINESS_SCHEMA = 'peercompute.multiscale.remote-placement-readiness.v0';

const REMOTE_COMPUTE_REQUEST_SCHEMA = 'peercompute.compute.remote-request.v0';
const REMOTE_COMPUTE_RESULT_SCHEMA = 'peercompute.compute.remote-result.v0';

const SOLVER_PLACEMENT_PROFILES = {
  nbody: {
    solverId: 'nbody-gravity',
    solverKind: 'gravity.nbody',
    label: 'N-body gravity',
    coupling: 'moderate',
    syncMode: 'warm-delta',
    remoteClass: 'coarse'
  },
  maxwell: {
    solverId: 'maxwell-em',
    solverKind: 'field.maxwell',
    label: 'Maxwell fields',
    coupling: 'tight',
    syncMode: 'remote-shard-candidate',
    remoteClass: 'lan'
  },
  cosmologyExpansion: {
    solverId: 'cosmology-expansion',
    solverKind: 'cosmology.expansion',
    label: 'Cosmology expansion',
    coupling: 'loose',
    syncMode: 'coarse-sync',
    remoteClass: 'coarse'
  },
  molecularDynamics: {
    solverId: 'molecular-dynamics',
    solverKind: 'chemistry.molecular-dynamics',
    label: 'Molecular dynamics',
    coupling: 'tight',
    syncMode: 'remote-shard-candidate',
    remoteClass: 'lan'
  },
  quantumOrbitalGrid: {
    solverId: 'quantum-orbital-grid',
    solverKind: 'quantum.schrodinger.orbital-grid',
    label: 'Quantum orbital grid',
    coupling: 'tight',
    syncMode: 'local',
    remoteClass: 'pinned'
  },
  quantumMaterialPotential: {
    solverId: 'quantum-material-potential',
    solverKind: 'quantum.schrodinger.material-potential',
    label: 'Quantum material potential',
    coupling: 'moderate',
    syncMode: 'warm-delta',
    remoteClass: 'lan'
  },
  reactiveThermal: {
    solverId: 'reactive-thermal-cell',
    solverKind: 'chemistry.reactive-thermal',
    label: 'Reactive thermal cell',
    coupling: 'tight',
    syncMode: 'local',
    remoteClass: 'pinned'
  },
  sphMaterial: {
    solverId: 'sph-material',
    solverKind: 'material.sph',
    label: 'SPH material',
    coupling: 'tight',
    syncMode: 'remote-shard-candidate',
    remoteClass: 'lan'
  },
  hydroAtmosphere: {
    solverId: 'hydro-atmosphere',
    solverKind: 'fluid.hydro-atmosphere',
    label: 'Hydro atmosphere',
    coupling: 'moderate',
    syncMode: 'warm-delta',
    remoteClass: 'moderate'
  },
  radiationOpacity: {
    solverId: 'radiation-opacity',
    solverKind: 'radiation.opacity',
    label: 'Radiation opacity',
    coupling: 'moderate',
    syncMode: 'warm-delta',
    remoteClass: 'moderate'
  },
  stellarFusion: {
    solverId: 'stellar-fusion',
    solverKind: 'nuclear.stellar-fusion',
    label: 'Stellar fusion',
    coupling: 'moderate',
    syncMode: 'warm-delta',
    remoteClass: 'coarse'
  },
  magnetospherePlasma: {
    solverId: 'magnetosphere-plasma',
    solverKind: 'plasma.magnetosphere',
    label: 'Magnetosphere plasma',
    coupling: 'moderate',
    syncMode: 'warm-delta',
    remoteClass: 'moderate'
  },
  picPlasmaPatch: {
    solverId: 'pic-plasma-patch',
    solverKind: 'plasma.pic',
    label: 'PIC plasma patch',
    coupling: 'tight',
    syncMode: 'remote-shard-candidate',
    remoteClass: 'lan'
  },
  relativisticCorrection: {
    solverId: 'relativistic-correction',
    solverKind: 'relativity.post-newtonian',
    label: 'Relativistic correction',
    coupling: 'loose',
    syncMode: 'coarse-sync',
    remoteClass: 'coarse'
  },
  combustionPlume: {
    solverId: 'combustion-plume',
    solverKind: 'combustion.plume',
    label: 'Combustion plume',
    coupling: 'tight',
    syncMode: 'remote-shard-candidate',
    remoteClass: 'lan'
  },
  membraneShell: {
    solverId: 'membrane-shell',
    solverKind: 'solid.membrane-shell',
    label: 'Membrane shell',
    coupling: 'tight',
    syncMode: 'local',
    remoteClass: 'pinned'
  }
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeNumber(value, fallback = 0, min = -Number.MAX_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return clamp(number, min, max);
}

function normalizeInteger(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeString(value, fallback = '') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function rounded(value, digits = 3) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(digits));
}

function normalizeRemotePlacementMode(value, fallback = 'peer') {
  const normalized = normalizeString(value, fallback).toLowerCase();
  if (normalized === 'cluster') return 'cluster';
  if (normalized === 'peer') return 'peer';
  return fallback;
}

function descriptorById(solverRegistry = null) {
  const descriptors = Array.isArray(solverRegistry?.descriptors)
    ? solverRegistry.descriptors
    : Array.isArray(solverRegistry?.solvers)
      ? solverRegistry.solvers
      : [];
  return new Map(descriptors.map((descriptor) => [descriptor.id, descriptor]));
}

function workloadUnitsFor(key, solverBudget = {}, loadEntry = {}) {
  const budget = solverBudget?.[key] || {};
  return normalizeNumber(
    loadEntry.workloadUnits
      ?? budget.workloadUnits
      ?? budget.cellCount
      ?? budget.sampleCount
      ?? budget.particleCount
      ?? budget.bodyCount
      ?? budget.atomCount
      ?? budget.segmentCount
      ?? ((budget.width || 0) * (budget.height || 0)),
    0,
    0,
    Number.MAX_SAFE_INTEGER
  );
}

function createManagerPressure({ managerStats = {}, workerPolicy = {}, computeBudget = {} } = {}) {
  const targetWorkers = normalizeInteger(
    managerStats.targetWorkers ?? workerPolicy.targetWorkers ?? computeBudget.managerTargetWorkers,
    1,
    1,
    1000000
  );
  const activeTaskCount = normalizeInteger(managerStats.activeTaskCount ?? managerStats.activeTasks, 0, 0, 1000000);
  const queuedTaskCount = normalizeInteger(managerStats.queuedTaskCount ?? managerStats.queuedTasks, 0, 0, 1000000);
  const currentLoad = normalizeNumber(managerStats.currentLoad, 0, 0, 8);
  const averageTaskDurationMs = normalizeNumber(
    managerStats.averageTaskDurationMs ?? managerStats.averageDurationMs,
    0,
    0,
    1000000
  );
  return {
    targetWorkers,
    workerCount: normalizeInteger(managerStats.workerCount ?? managerStats.workers ?? targetWorkers, targetWorkers, 0, 1000000),
    activeTaskCount,
    queuedTaskCount,
    currentLoad,
    averageTaskDurationMs,
    pressure: rounded(clamp(Math.max(
      currentLoad,
      (activeTaskCount + queuedTaskCount) / Math.max(1, targetWorkers),
      averageTaskDurationMs > 0 ? averageTaskDurationMs / 120 : 0
    ), 0, 6))
  };
}

function networkMode(networkCapacity = {}) {
  if (networkCapacity?.recommendation === 'cluster-shards') return 'cluster';
  if (networkCapacity?.recommendation === 'peer-shards') return 'peer';
  if (networkCapacity?.recommendation === 'coarse-sync') return 'peer';
  return 'local';
}

function canUseRemoteClass(profile, mode, networkCapacity) {
  if (profile.remoteClass === 'pinned') return false;
  if (mode === 'cluster') {
    if (profile.remoteClass === 'lan') return networkCapacity?.latencyTier === 'lan';
    return true;
  }
  if (mode === 'peer') {
    return profile.remoteClass === 'coarse' || profile.remoteClass === 'moderate';
  }
  return false;
}

function choosePlacement({
  profile,
  mode,
  networkCapacity,
  memoryPressure,
  managerPressure,
  solverPressure,
  workloadUnits
}) {
  const reasons = [];
  const constraints = [];
  const networkScore = normalizeNumber(networkCapacity?.capacityScore, 0, 0, 4);
  const memoryValue = normalizeNumber(memoryPressure?.pressure, 0, 0, 6);
  const baseConfidence = clamp(
    networkScore * 0.25
      + managerPressure.pressure * 0.18
      + solverPressure * 0.22
      + Math.log2(Math.max(1, workloadUnits)) / 32
      + memoryValue * 0.08,
    0,
    1
  );

  if (profile.remoteClass === 'pinned') {
    reasons.push('pinned-local-coupling');
    constraints.push('stateful-low-latency-source');
  }
  if (networkCapacity?.saveData) {
    reasons.push('network-save-data');
    constraints.push('remote-transfer-disabled');
  }
  if (memoryPressure?.level === 'critical') {
    reasons.push('critical-memory-local-first');
    constraints.push('avoid-remote-state-copy');
  }
  if (mode === 'local') {
    reasons.push('network-local-only');
  }
  if (profile.remoteClass === 'lan' && mode !== 'cluster') {
    constraints.push('lan-required-for-tight-coupling');
  }
  if (profile.remoteClass === 'lan' && mode === 'cluster' && networkCapacity?.latencyTier !== 'lan') {
    reasons.push('cluster-latency-too-high');
    constraints.push('requires-lan-latency');
  }
  if (managerPressure.pressure < 0.35 && solverPressure < 0.35) {
    reasons.push('local-headroom');
  }

  const remoteEligible = reasons.length === 0 && canUseRemoteClass(profile, mode, networkCapacity);
  if (!remoteEligible) {
    return {
      recommendedPlacement: 'local',
      syncMode: 'local',
      confidence: rounded(Math.max(0.55, 1 - baseConfidence)),
      reasons: reasons.length > 0 ? reasons : ['remote-not-beneficial'],
      constraints
    };
  }

  if (mode === 'cluster' && baseConfidence >= 0.45) {
    return {
      recommendedPlacement: 'cluster',
      syncMode: profile.syncMode,
      confidence: rounded(Math.max(0.5, baseConfidence)),
      reasons: ['cluster-capacity-available', `${profile.remoteClass}-solver-candidate`],
      constraints
    };
  }

  if (mode === 'peer' && baseConfidence >= 0.35) {
    return {
      recommendedPlacement: 'peer',
      syncMode: profile.remoteClass === 'coarse' ? 'coarse-sync' : profile.syncMode,
      confidence: rounded(Math.max(0.45, baseConfidence)),
      reasons: ['peer-capacity-available', `${profile.remoteClass}-solver-candidate`],
      constraints
    };
  }

  return {
    recommendedPlacement: 'local',
    syncMode: 'local',
    confidence: rounded(1 - baseConfidence * 0.5),
    reasons: ['remote-confidence-too-low'],
    constraints
  };
}

function targetReplicaCount(placement, networkCapacity, managerPressure, solverPressure) {
  if (placement === 'local') return 0;
  const remoteCapacity = normalizeInteger(networkCapacity?.remoteWorkerCapacity, 0, 0, 1000000);
  if (placement === 'cluster') {
    return Math.max(1, Math.min(remoteCapacity || managerPressure.targetWorkers, Math.ceil(Math.max(1, solverPressure * managerPressure.targetWorkers * 0.5))));
  }
  return Math.max(1, Math.min(remoteCapacity || 2, Math.ceil(Math.max(1, solverPressure))));
}

export function createPlacementPlan({
  resourceProfile = {},
  workerPolicy = {},
  managerStats = {},
  solverLoad = {},
  memoryPressure = {},
  networkCapacity = {},
  solverBudget = {},
  solverRegistry = null,
  computeBudget = {},
  nowMs = Date.now()
} = {}) {
  const descriptors = descriptorById(solverRegistry);
  const managerPressure = createManagerPressure({ managerStats, workerPolicy, computeBudget });
  const mode = networkMode(networkCapacity);
  const counts = { local: 0, peer: 0, cluster: 0 };
  const entries = {};
  let dominantPlacement = 'local';
  let dominantCandidate = null;
  let dominantScore = 0;

  for (const solverKey of SOLVER_LOAD_KEYS) {
    const profile = SOLVER_PLACEMENT_PROFILES[solverKey];
    const descriptor = descriptors.get(profile.solverId) || {};
    const loadEntry = solverLoad?.entries?.[solverKey] || {};
    const pressure = normalizeNumber(loadEntry.pressure, 0, 0, 6);
    const workloadUnits = workloadUnitsFor(solverKey, solverBudget, loadEntry);
    const decision = choosePlacement({
      profile,
      mode,
      networkCapacity,
      memoryPressure,
      managerPressure,
      solverPressure: pressure,
      workloadUnits
    });
    const targetReplicas = targetReplicaCount(decision.recommendedPlacement, networkCapacity, managerPressure, pressure);
    counts[decision.recommendedPlacement] += 1;
    const candidateScore = decision.recommendedPlacement === 'local' ? 0 : decision.confidence * Math.max(1, pressure);
    if (candidateScore > dominantScore) {
      dominantScore = candidateScore;
      dominantCandidate = solverKey;
      dominantPlacement = decision.recommendedPlacement;
    }
    entries[solverKey] = {
      solverKey,
      solverId: descriptor.id || profile.solverId,
      solverKind: descriptor.kind || profile.solverKind,
      label: descriptor.label || profile.label,
      recommendedPlacement: decision.recommendedPlacement,
      executionMode: 'advisory-only',
      syncMode: decision.syncMode,
      pressure: rounded(pressure),
      workloadUnits: rounded(workloadUnits, 2),
      confidence: decision.confidence,
      targetReplicaCount: targetReplicas,
      reasons: decision.reasons,
      constraints: decision.constraints,
      coupling: profile.coupling,
      remoteClass: profile.remoteClass
    };
  }

  return {
    schema: MULTISCALE_PLACEMENT_PLAN_SCHEMA,
    sampledAtMs: normalizeNumber(nowMs, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    advisoryOnly: true,
    source: 'local-placement-heuristic-v0',
    resourceTier: resourceProfile?.tier || computeBudget?.resourceTier || 'unknown',
    networkRecommendation: networkCapacity?.recommendation || 'local-only',
    networkPlacementMode: networkCapacity?.placementMode || 'local-only',
    networkCapacityScore: rounded(normalizeNumber(networkCapacity?.capacityScore, 0, 0, 4)),
    memoryLevel: memoryPressure?.level || 'unknown',
    managerPressure: managerPressure.pressure,
    localWorkerCount: managerPressure.workerCount,
    localWorkerTarget: managerPressure.targetWorkers,
    remoteWorkerCapacity: normalizeInteger(networkCapacity?.remoteWorkerCapacity, 0, 0, 1000000),
    counts,
    dominantPlacement,
    dominantCandidate,
    dominantScore: rounded(dominantScore),
    entries,
    note: 'Advisory only: all current solver work is still submitted through the single local ComputeManager.'
  };
}

export function createRemotePlacementReadiness({
  overrides = {},
  networkCapacity = {},
  placementPlan = null,
  managerCapabilities = {},
  nowMs = Date.now()
} = {}) {
  const enabled = overrides.enableRemotePlacement === true;
  const executorMode = normalizeString(overrides.remotePlacementExecutorMode || overrides.placementExecutorMode, '').toLowerCase();
  const loopbackEnabled = overrides.enableLoopbackRemotePlacement === true
    || overrides.remotePlacementLoopback === true
    || executorMode === 'loopback';
  const peerId = normalizeString(overrides.remotePlacementPeerId, '');
  const requestedMode = normalizeRemotePlacementMode(overrides.remotePlacementMode, peerId ? 'peer' : 'peer');
  const timeoutMs = normalizeInteger(overrides.remotePlacementTimeoutMs, 30000, 1000, 3600000);
  const executorConfigured = managerCapabilities?.placementExecutor === true;
  const admissionConfigured = managerCapabilities?.placementAdmission === true;
  const signerConfigured = managerCapabilities?.placementTaskSigner === true;
  const resultValidatorConfigured = managerCapabilities?.placementResultValidator === true;
  const networkAvailable = networkCapacity?.available !== false;
  const saveData = networkCapacity?.saveData === true;
  const planPeerCandidateCount = placementPlan?.counts?.peer || 0;
  const planClusterCandidateCount = placementPlan?.counts?.cluster || 0;
  const explicitPeerTargetConfigured = enabled
    && !loopbackEnabled
    && requestedMode === 'peer'
    && !!peerId
    && executorConfigured;
  const peerCandidateCount = loopbackEnabled
    ? Math.max(1, planPeerCandidateCount)
    : Math.max(planPeerCandidateCount, explicitPeerTargetConfigured ? 1 : 0);
  const clusterCandidateCount = planClusterCandidateCount;
  const remoteCandidateCount = loopbackEnabled
    ? Math.max(1, planPeerCandidateCount + planClusterCandidateCount)
    : peerCandidateCount + clusterCandidateCount;
  const reasons = [];
  if (!enabled) reasons.push('disabled-by-default');
  if (enabled && requestedMode === 'peer' && !peerId) reasons.push('missing-remote-peer-id');
  if (enabled && !loopbackEnabled && saveData) reasons.push('network-save-data');
  if (enabled && !loopbackEnabled && !networkAvailable) reasons.push('network-capacity-unavailable');
  if (enabled && !executorConfigured) reasons.push('network-placement-executor-not-configured');
  if (enabled && !loopbackEnabled && remoteCandidateCount <= 0) reasons.push('no-remote-placement-candidates');

  const armed = enabled && reasons.every((reason) => reason !== 'disabled-by-default' && reason !== 'missing-remote-peer-id');
  const dispatchReady = armed
    && executorConfigured
    && (requestedMode !== 'peer' || !!peerId)
    && remoteCandidateCount > 0
    && (loopbackEnabled || !saveData);
  const advisoryOnly = !dispatchReady;
  return {
    schema: MULTISCALE_REMOTE_PLACEMENT_READINESS_SCHEMA,
    sampledAtMs: normalizeNumber(nowMs, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    enabled,
    armed,
    dispatchReady,
    advisoryOnly,
    requestedMode,
    peerId: peerId || null,
    timeoutMs,
    executorConfigured,
    executorId: managerCapabilities?.placementExecutorId || null,
    admissionConfigured,
    admissionId: managerCapabilities?.placementAdmissionId || null,
    signerConfigured,
    signerId: managerCapabilities?.placementTaskSignerId || null,
    resultValidatorConfigured,
    resultValidatorId: managerCapabilities?.placementResultValidatorId || null,
    loopbackEnabled,
    requestSchema: REMOTE_COMPUTE_REQUEST_SCHEMA,
    resultSchema: REMOTE_COMPUTE_RESULT_SCHEMA,
    allowedTaskTypes: ['module', 'wasm'],
    functionTasksAllowed: false,
    remoteCandidateCount,
    peerCandidateCount,
    clusterCandidateCount,
    explicitPeerTargetConfigured,
    networkPlacementMode: networkCapacity?.placementMode || 'local-only',
    networkRecommendation: networkCapacity?.recommendation || 'local-only',
    networkCapacityScore: rounded(normalizeNumber(networkCapacity?.capacityScore, 0, 0, 4)),
    reason: reasons[0] || 'ready',
    reasons: reasons.length > 0 ? reasons : ['ready'],
    note: dispatchReady
      ? loopbackEnabled
        ? 'Loopback remote placement is explicitly configured for local end-to-end placement testing without a second peer.'
        : 'Remote placement transport is explicitly configured. Admission, signing, verification, and result validation still decide each task.'
      : 'Remote placement remains advisory/local until explicit peer transport and trust hooks are configured.'
  };
}

export function summarizePlacementPlan(plan = null) {
  if (!plan || plan.schema !== MULTISCALE_PLACEMENT_PLAN_SCHEMA) return 'warming';
  const counts = plan.counts || {};
  const dominant = plan.dominantCandidate
    ? `${plan.dominantCandidate}->${plan.dominantPlacement}`
    : 'local';
  return `L${counts.local || 0} P${counts.peer || 0} C${counts.cluster || 0} / ${dominant} / advisory`;
}

export function summarizeRemotePlacementReadiness(report = null) {
  if (!report || report.schema !== MULTISCALE_REMOTE_PLACEMENT_READINESS_SCHEMA) return 'warming';
  const state = report.dispatchReady
    ? 'dispatch-ready'
    : report.armed
      ? 'armed'
      : report.enabled
        ? 'blocked'
        : 'off';
  const target = report.peerId
    ? `${report.requestedMode}:${String(report.peerId).slice(0, 12)}`
    : report.requestedMode || 'peer';
  return `${state} / ${target} / ${report.reason || 'unknown'}`;
}
