export const PLACEMENT_ADMISSION_POLICY_SCHEMA = 'peercompute.compute.placement-admission-policy.v0';
export const PLACEMENT_ADMISSION_RESULT_SCHEMA = 'peercompute.compute.placement-admission.v0';

function normalizeNumber(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeInteger(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeAllowedPlacements(value) {
  const list = Array.isArray(value) ? value : ['peer', 'cluster'];
  const allowed = list
    .map((entry) => String(entry || '').trim().toLowerCase())
    .filter((entry) => entry === 'peer' || entry === 'cluster');
  return allowed.length > 0 ? [...new Set(allowed)] : ['peer', 'cluster'];
}

function normalizeTrustedPeerIds(value) {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => String(entry || '').trim()).filter(Boolean);
}

export function normalizePlacementAdmissionPolicyOptions(options = {}) {
  return {
    schema: PLACEMENT_ADMISSION_POLICY_SCHEMA,
    policyId: options.policyId || options.id || 'placement-admission-policy',
    allowedPlacements: normalizeAllowedPlacements(options.allowedPlacements),
    allowUnknownNetwork: options.allowUnknownNetwork === true,
    requireTrustedPeer: options.requireTrustedPeer === true,
    trustedPeerIds: normalizeTrustedPeerIds(options.trustedPeerIds),
    minConfidence: normalizeNumber(options.minConfidence, 0, 0, 1),
    minRemoteWorkers: normalizeInteger(options.minRemoteWorkers, 1, 0, 1000000),
    minPeerBandwidthMbps: normalizeNumber(options.minPeerBandwidthMbps, 1, 0, 1000000),
    minClusterBandwidthMbps: normalizeNumber(options.minClusterBandwidthMbps, 25, 0, 1000000),
    maxPeerRttMs: normalizeNumber(options.maxPeerRttMs, 500, 0, 3600000),
    maxClusterRttMs: normalizeNumber(options.maxClusterRttMs, 150, 0, 3600000),
    minClusterNodes: normalizeInteger(options.minClusterNodes, 1, 0, 1000000),
    minClusterGpus: normalizeInteger(options.minClusterGpus, 0, 0, 1000000),
    networkCapacity: options.networkCapacity || null
  };
}

function selectMetric(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return null;
}

function resolveNetworkCapacity(payload = {}, context = {}, options = {}) {
  return context.networkCapacity
    || context.placement?.networkCapacity
    || payload.networkCapacity
    || payload.data?.networkCapacity
    || options.networkCapacity
    || {};
}

function resolvePeerId(payload = {}, context = {}, network = {}) {
  return context.peerId
    || context.placement?.peerId
    || payload.peerId
    || payload.data?.peerId
    || network.peerId
    || network.bestPeerId
    || null;
}

function addReason(blockedReasons, reason) {
  if (!blockedReasons.includes(reason)) blockedReasons.push(reason);
}

export function evaluatePlacementAdmission(payload = {}, context = {}, policyOptions = {}) {
  const options = policyOptions.schema === PLACEMENT_ADMISSION_POLICY_SCHEMA
    ? policyOptions
    : normalizePlacementAdmissionPolicyOptions(policyOptions);
  const placement = context.placement || payload.placement || payload.data?.placement || {};
  const requestedPlacement = String(placement.requestedPlacement || placement.recommendedPlacement || 'local').trim().toLowerCase();
  const confidence = normalizeNumber(placement.confidence, 1, 0, 1);
  const network = resolveNetworkCapacity(payload, context, options);
  const bandwidthMbps = selectMetric(
    placement.bandwidthMbps,
    network.bandwidthMbps,
    network.downlinkMbps,
    network.effectiveBandwidthMbps
  );
  const rttMs = selectMetric(
    placement.rttMs,
    network.rttMs,
    network.latencyMs,
    network.rtt
  );
  const remoteWorkerCapacity = normalizeInteger(
    placement.remoteWorkerCapacity ?? network.remoteWorkerCapacity ?? network.remoteWorkers,
    0,
    0,
    1000000
  );
  const clusterNodes = normalizeInteger(
    placement.clusterNodes ?? network.clusterNodes,
    0,
    0,
    1000000
  );
  const clusterGpus = normalizeInteger(
    placement.clusterGpus ?? network.clusterGpus,
    0,
    0,
    1000000
  );
  const peerId = resolvePeerId(payload, context, network);
  const blockedReasons = [];

  if (!options.allowedPlacements.includes(requestedPlacement)) {
    addReason(blockedReasons, 'placement-not-allowed');
  }
  if (placement.advisoryOnly !== false) {
    addReason(blockedReasons, 'advisory-only');
  }
  if (confidence < options.minConfidence) {
    addReason(blockedReasons, 'confidence-below-floor');
  }

  const minBandwidth = requestedPlacement === 'cluster'
    ? options.minClusterBandwidthMbps
    : options.minPeerBandwidthMbps;
  const maxRtt = requestedPlacement === 'cluster'
    ? options.maxClusterRttMs
    : options.maxPeerRttMs;

  if (bandwidthMbps == null && !options.allowUnknownNetwork) {
    addReason(blockedReasons, 'bandwidth-unknown');
  } else if (bandwidthMbps != null && bandwidthMbps < minBandwidth) {
    addReason(blockedReasons, 'bandwidth-below-floor');
  }

  if (rttMs == null && !options.allowUnknownNetwork) {
    addReason(blockedReasons, 'rtt-unknown');
  } else if (rttMs != null && rttMs > maxRtt) {
    addReason(blockedReasons, 'rtt-above-ceiling');
  }

  if (requestedPlacement === 'peer') {
    if (remoteWorkerCapacity < options.minRemoteWorkers) {
      addReason(blockedReasons, 'remote-workers-below-floor');
    }
    if (options.requireTrustedPeer && (!peerId || !options.trustedPeerIds.includes(peerId))) {
      addReason(blockedReasons, 'peer-not-trusted');
    }
  } else if (requestedPlacement === 'cluster') {
    if (remoteWorkerCapacity < options.minRemoteWorkers) {
      addReason(blockedReasons, 'remote-workers-below-floor');
    }
    if (clusterNodes < options.minClusterNodes) {
      addReason(blockedReasons, 'cluster-nodes-below-floor');
    }
    if (clusterGpus < options.minClusterGpus) {
      addReason(blockedReasons, 'cluster-gpus-below-floor');
    }
  }

  const accepted = blockedReasons.length === 0;
  return {
    schema: PLACEMENT_ADMISSION_RESULT_SCHEMA,
    admissionId: options.policyId,
    accepted,
    reason: accepted ? 'accepted' : blockedReasons[0],
    blockedReasons,
    requestedPlacement,
    advisoryOnly: placement.advisoryOnly !== false,
    confidence,
    bandwidthMbps,
    rttMs,
    remoteWorkerCapacity,
    clusterNodes,
    clusterGpus,
    peerId,
    decidedAt: Date.now()
  };
}

export function createPlacementAdmissionPolicy(options = {}) {
  const normalized = normalizePlacementAdmissionPolicyOptions(options);
  const policy = (payload, context) => evaluatePlacementAdmission(payload, context, normalized);
  policy.placementAdmissionId = normalized.policyId;
  policy.policy = normalized;
  return policy;
}
