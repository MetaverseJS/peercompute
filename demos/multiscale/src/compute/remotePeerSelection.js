export const MULTISCALE_REMOTE_PEER_SELECTION_SCHEMA = 'peercompute.multiscale.remote-peer-selection.v0';
export const MULTISCALE_REMOTE_PEER_PLACEMENT_PLAN_SCHEMA = 'peercompute.multiscale.remote-peer-placement-plan.v0';

const DEFAULT_SCORE_WEIGHTS = {
  connected: 40,
  preferred: 18,
  trusted: 12,
  previous: 8,
  networkCapacity: 16,
  localPressure: 8,
  advertisedWorkers: 14,
  advertisedGpu: 8,
  advertisedBandwidth: 8,
  advertisedLatency: 6,
  advertisedReliability: 8
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

function roundScore(value) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(3));
}

function normalizePeerIds(values = []) {
  return new Set(
    (Array.isArray(values) ? values : [values])
      .map((value) => String(value || '').trim())
      .filter(Boolean)
  );
}

function normalizePeerIdList(values = []) {
  return [
    ...normalizePeerIds(values)
  ];
}

export function extractPeerIdFromMultiaddr(address = '') {
  const match = String(address || '').match(/\/p2p\/([^/]+)$/);
  return match ? match[1] : null;
}

function readPeerCapacity(peerCapacity = {}, peerId) {
  if (!peerCapacity || typeof peerCapacity !== 'object') return {};
  const direct = peerCapacity[peerId];
  if (direct && typeof direct === 'object') return direct;
  const entries = Array.isArray(peerCapacity.peers) ? peerCapacity.peers : [];
  return entries.find((entry) => entry?.peerId === peerId) || {};
}

function networkCapacityScore(report = {}, weights = DEFAULT_SCORE_WEIGHTS) {
  const score = normalizeNumber(report?.capacityScore, 0, 0, 4);
  return roundScore(clamp(score / 4, 0, 1) * weights.networkCapacity);
}

function localPressureScore(managerStats = {}, weights = DEFAULT_SCORE_WEIGHTS) {
  const load = normalizeNumber(
    managerStats?.currentLoad ?? managerStats?.load ?? managerStats?.pressure,
    0,
    0,
    4
  );
  const queued = normalizeInteger(
    managerStats?.queuedTaskCount ?? managerStats?.queuedTasks,
    0,
    0,
    1000000
  );
  const workerCount = normalizeInteger(
    managerStats?.workerCount ?? managerStats?.targetWorkers,
    1,
    1,
    1000000
  );
  const queuePressure = clamp(queued / Math.max(1, workerCount * 2), 0, 1);
  return roundScore(clamp(Math.max(load / 4, queuePressure), 0, 1) * weights.localPressure);
}

function advertisedCapacityScore(capacity = {}, weights = DEFAULT_SCORE_WEIGHTS) {
  const workerCount = normalizeInteger(
    capacity.remoteWorkerCapacity
      ?? capacity.workerCount
      ?? capacity.workers
      ?? capacity.targetWorkers,
    0,
    0,
    1000000
  );
  const gpuCount = normalizeInteger(
    capacity.gpuCount ?? capacity.gpus ?? capacity.clusterGpuCount,
    0,
    0,
    1000000
  );
  const bandwidthMbps = normalizeNumber(
    capacity.bandwidthMbps ?? capacity.downlinkMbps ?? capacity.networkBandwidthMbps,
    0,
    0,
    1000000
  );
  const rttMs = normalizeNumber(
    capacity.rttMs ?? capacity.latencyMs ?? capacity.networkRttMs,
    0,
    0,
    60000
  );
  const reliability = normalizeNumber(
    capacity.reliability ?? capacity.reliabilityScore ?? capacity.successRate,
    Number.NaN,
    0,
    1
  );
  const workerScore = clamp(Math.log2(1 + workerCount) / 5, 0, 1) * weights.advertisedWorkers;
  const gpuScore = clamp(gpuCount / 4, 0, 1) * weights.advertisedGpu;
  const bandwidthScore = clamp(Math.log2(1 + bandwidthMbps) / 12, 0, 1) * weights.advertisedBandwidth;
  const latencyScore = rttMs > 0
    ? clamp(1 - rttMs / 300, 0, 1) * weights.advertisedLatency
    : 0;
  const reliabilityScore = Number.isFinite(reliability)
    ? reliability * weights.advertisedReliability
    : 0;
  return {
    score: roundScore(workerScore + gpuScore + bandwidthScore + latencyScore + reliabilityScore),
    normalized: {
      workerCount,
      gpuCount,
      bandwidthMbps: roundScore(bandwidthMbps),
      rttMs: roundScore(rttMs),
      reliability: Number.isFinite(reliability) ? roundScore(reliability) : null
    },
    advertised: workerCount > 0
      || gpuCount > 0
      || bandwidthMbps > 0
      || rttMs > 0
      || Number.isFinite(reliability)
  };
}

function createCandidate({
  peerId,
  preferredPeerIds,
  trustedPeerIds,
  previousPeerId,
  peerCapacity,
  networkCapacity,
  managerStats,
  weights
}) {
  const reasons = ['connected-peer', 'non-relay-peer'];
  let score = weights.connected;
  const preferred = preferredPeerIds.has(peerId);
  const trusted = trustedPeerIds.has(peerId);
  const previousPeer = previousPeerId === peerId;
  if (preferred) {
    score += weights.preferred;
    reasons.push('preferred-peer');
  }
  if (trusted) {
    score += weights.trusted;
    reasons.push('trusted-peer');
  }
  if (previousPeer) {
    score += weights.previous;
    reasons.push('previous-peer-stickiness');
  }
  const capacity = readPeerCapacity(peerCapacity, peerId);
  const advertised = advertisedCapacityScore(capacity, weights);
  if (advertised.advertised) {
    score += advertised.score;
    reasons.push('advertised-capacity');
  } else {
    reasons.push('no-peer-capacity-advertisement');
  }
  const networkScore = networkCapacityScore(networkCapacity, weights);
  if (networkScore > 0) {
    score += networkScore;
    reasons.push('network-capacity');
  }
  const pressureScore = localPressureScore(managerStats, weights);
  if (pressureScore > 0) {
    score += pressureScore;
    reasons.push('local-pressure-offload');
  }
  return {
    peerId,
    score: roundScore(score),
    connected: true,
    preferred,
    trusted,
    previousPeer,
    capacity: advertised.normalized,
    reasons
  };
}

function rejectPeer(peerId, reason, rejected) {
  rejected.push({ peerId: peerId || null, reason });
}

export function createRemotePeerSelectionReport({
  connectedPeerIds = [],
  localPeerId = null,
  bootstrapPeers = [],
  networkCapacity = {},
  managerStats = {},
  trustedPeerIds = [],
  preferredPeerIds = [],
  previousPeerId = null,
  peerCapacity = {},
  scoreWeights = {},
  nowMs = Date.now()
} = {}) {
  const weights = { ...DEFAULT_SCORE_WEIGHTS, ...scoreWeights };
  const trusted = normalizePeerIds(trustedPeerIds);
  const preferred = normalizePeerIds(preferredPeerIds);
  const bootstrapPeerIds = normalizePeerIds(
    (Array.isArray(bootstrapPeers) ? bootstrapPeers : [bootstrapPeers])
      .map((entry) => extractPeerIdFromMultiaddr(entry) || String(entry || '').trim())
      .filter(Boolean)
  );
  const seen = new Set();
  const rejected = [];
  const candidates = [];
  for (const rawPeerId of Array.isArray(connectedPeerIds) ? connectedPeerIds : []) {
    const peerId = String(rawPeerId || '').trim();
    if (!peerId) {
      rejectPeer(peerId, 'empty-peer-id', rejected);
      continue;
    }
    if (seen.has(peerId)) {
      rejectPeer(peerId, 'duplicate-peer-id', rejected);
      continue;
    }
    seen.add(peerId);
    if (peerId === localPeerId) {
      rejectPeer(peerId, 'local-peer', rejected);
      continue;
    }
    if (bootstrapPeerIds.has(peerId)) {
      rejectPeer(peerId, 'bootstrap-relay-peer', rejected);
      continue;
    }
    candidates.push(createCandidate({
      peerId,
      preferredPeerIds: preferred,
      trustedPeerIds: trusted,
      previousPeerId,
      peerCapacity,
      networkCapacity,
      managerStats,
      weights
    }));
  }
  candidates.sort((a, b) => (
    b.score - a.score
    || Number(b.preferred) - Number(a.preferred)
    || Number(b.trusted) - Number(a.trusted)
    || Number(b.previousPeer) - Number(a.previousPeer)
    || a.peerId.localeCompare(b.peerId)
  ));
  candidates.forEach((candidate, index) => {
    candidate.rank = index + 1;
  });
  const selected = candidates[0] || null;
  const hasAdvertisedPeerCapacity = candidates.some((candidate) => (
    candidate.capacity.workerCount > 0
    || candidate.capacity.gpuCount > 0
    || candidate.capacity.bandwidthMbps > 0
    || candidate.capacity.rttMs > 0
    || candidate.capacity.reliability != null
  ));
  return {
    schema: MULTISCALE_REMOTE_PEER_SELECTION_SCHEMA,
    sampledAtMs: normalizeNumber(nowMs, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    selectedPeerId: selected?.peerId || null,
    selectedScore: selected?.score || 0,
    candidateCount: candidates.length,
    rejectedCount: rejected.length,
    reason: selected ? 'selected-highest-score' : 'no-connected-peer-candidates',
    candidates,
    rejected,
    scoring: {
      weights: { ...weights },
      networkCapacityScore: networkCapacityScore(networkCapacity, weights),
      localPressureScore: localPressureScore(managerStats, weights)
    },
    limitations: hasAdvertisedPeerCapacity ? [] : ['per-peer-capacity-advertisement-unavailable']
  };
}

function candidatePeerIds(selectionReport = {}) {
  return (Array.isArray(selectionReport?.candidates) ? selectionReport.candidates : [])
    .map((candidate) => String(candidate?.peerId || '').trim())
    .filter(Boolean);
}

function rankedCandidate(selectionReport = {}, peerId) {
  return (Array.isArray(selectionReport?.candidates) ? selectionReport.candidates : [])
    .find((candidate) => candidate?.peerId === peerId) || null;
}

function rotatePeerIds(peerIds = [], rotation = 0) {
  if (!peerIds.length) return [];
  const index = normalizeInteger(rotation, 0, 0, Number.MAX_SAFE_INTEGER) % peerIds.length;
  return [
    ...peerIds.slice(index),
    ...peerIds.slice(0, index)
  ];
}

function createPlacementReason({
  explicitPrimary,
  balanceRemotePlacementPeers,
  primaryPeerId,
  candidateCount,
  replicaPeerIds
}) {
  if (!primaryPeerId) return 'no-connected-peer-candidates';
  if (explicitPrimary) return 'explicit-primary';
  if (balanceRemotePlacementPeers && candidateCount > 1) return 'balanced-remote-primary';
  if (replicaPeerIds.length > 0) return 'selected-primary-with-replicas';
  return 'selected-primary';
}

export function createRemotePeerPlacementPlan({
  selectionReport = null,
  requestedPrimaryPeerId = null,
  requestedReplicaPeerIds = [],
  targetReplicaCount = 1,
  balanceRemotePlacementPeers = false,
  balanceSeed = 0,
  nowMs = Date.now()
} = {}) {
  const rankedPeerIds = candidatePeerIds(selectionReport);
  const candidateCount = rankedPeerIds.length;
  const explicitPrimary = String(requestedPrimaryPeerId || '').trim();
  const requestedReplicas = normalizePeerIdList(requestedReplicaPeerIds)
    .filter((peerId) => peerId !== explicitPrimary);
  const totalTargetCount = normalizeInteger(targetReplicaCount, 1, 1, 16);
  let primaryPeerId = explicitPrimary;
  let primarySource = explicitPrimary ? 'requested-primary' : 'none';
  if (!primaryPeerId) {
    const balancedPeerIds = balanceRemotePlacementPeers
      ? rotatePeerIds(rankedPeerIds, balanceSeed)
      : rankedPeerIds;
    primaryPeerId = balancedPeerIds[0] || null;
    primarySource = balanceRemotePlacementPeers && candidateCount > 1
      ? 'balanced-candidate'
      : 'top-ranked-candidate';
  }
  const replicaPool = [
    ...requestedReplicas,
    ...rankedPeerIds
  ].filter((peerId) => peerId && peerId !== primaryPeerId);
  const replicaPeerIds = normalizePeerIdList(replicaPool)
    .slice(0, Math.max(0, totalTargetCount - 1));
  const peerIds = normalizePeerIdList([
    primaryPeerId,
    ...replicaPeerIds
  ].filter(Boolean));
  const primaryCandidate = primaryPeerId ? rankedCandidate(selectionReport, primaryPeerId) : null;
  const reason = createPlacementReason({
    explicitPrimary,
    balanceRemotePlacementPeers,
    primaryPeerId,
    candidateCount,
    replicaPeerIds
  });
  const limitations = [];
  if (!primaryPeerId) limitations.push('missing-primary-peer');
  if (peerIds.length < totalTargetCount) limitations.push('insufficient-candidates-for-target-replica-count');
  return {
    schema: MULTISCALE_REMOTE_PEER_PLACEMENT_PLAN_SCHEMA,
    sampledAtMs: normalizeNumber(nowMs, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    primaryPeerId,
    peerIds,
    replicaPeerIds,
    requestedPrimaryPeerId: explicitPrimary || null,
    requestedReplicaPeerIds: requestedReplicas,
    targetReplicaCount: totalTargetCount,
    effectiveReplicaCount: peerIds.length,
    quorumCandidateCount: peerIds.length,
    balanceRemotePlacementPeers: balanceRemotePlacementPeers === true,
    balanceSeed: normalizeInteger(balanceSeed, 0, 0, Number.MAX_SAFE_INTEGER),
    primarySource,
    primaryRank: primaryCandidate?.rank || null,
    primaryScore: primaryCandidate?.score || 0,
    candidateCount,
    reason,
    limitations
  };
}
