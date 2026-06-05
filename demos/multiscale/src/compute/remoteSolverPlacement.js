export const MULTISCALE_REMOTE_SOLVER_PLACEMENT_POLICY_SCHEMA = 'peercompute.multiscale.remote-solver-placement-policy.v0';
export const MULTISCALE_REMOTE_SOLVER_PLACEMENT_DECISIONS_SCHEMA = 'peercompute.multiscale.remote-solver-placement-decisions.v0';

export const DEFAULT_REMOTE_SOLVER_FAMILIES = [
  'cosmologyExpansion',
  'relativisticCorrection',
  'stellarFusion',
  'nbody'
];

const DEFAULT_ALLOWED_REMOTE_CLASSES = ['coarse'];
const REMOTE_PLACEMENT_MODES = new Set(['auto', 'peer', 'cluster']);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeNumber(value, fallback = 0, min = -Number.MAX_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return clamp(number, min, max);
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (value == null || value === '') return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on', 'enabled'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off', 'disabled'].includes(normalized)) return false;
  return fallback;
}

function normalizeString(value, fallback = '') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function normalizeStringList(value, fallback = []) {
  const values = Array.isArray(value)
    ? value
    : String(value ?? '')
      .split(',')
      .map((entry) => entry.trim());
  const seen = new Set();
  const normalized = [];
  for (const entry of values) {
    const text = String(entry ?? '').trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    normalized.push(text);
  }
  return normalized.length > 0 ? normalized : [...fallback];
}

function firstDefined(source, keys) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(source || {}, key)) {
      return { found: true, value: source[key] };
    }
  }
  return { found: false, value: undefined };
}

function normalizeMode(value, fallback = 'auto') {
  const normalized = normalizeString(value, fallback).toLowerCase();
  return REMOTE_PLACEMENT_MODES.has(normalized) ? normalized : fallback;
}

function queryBoolean(params, keys) {
  for (const key of keys) {
    const value = params.get(key);
    if (value != null) return normalizeBoolean(value, false);
  }
  return undefined;
}

function queryNumber(params, keys) {
  for (const key of keys) {
    const value = params.get(key);
    if (value == null || value === '') continue;
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return undefined;
}

function queryString(params, keys) {
  for (const key of keys) {
    const value = params.get(key);
    if (value != null && value !== '') return value;
  }
  return undefined;
}

export function readRemoteSolverPlacementOverrides(search = globalThis.location?.search || '') {
  const params = new URLSearchParams(search);
  return normalizeRemoteSolverPlacementOptions({
    enabled: queryBoolean(params, [
      'enableRemoteSolverPlacement',
      'remoteSolverPlacement',
      'enableRemoteSolvers',
      'remoteSolvers'
    ]),
    families: queryString(params, ['remoteSolverFamilies', 'remoteSolvers', 'remoteSolverKeys']),
    mode: queryString(params, ['remoteSolverPlacementMode', 'remoteSolverMode']),
    nonAdvisory: queryBoolean(params, ['remoteSolverNonAdvisory', 'remoteSolverExecutable']),
    minimumConfidence: queryNumber(params, ['remoteSolverPlacementConfidence', 'remoteSolverMinConfidence']),
    allowedRemoteClasses: queryString(params, ['remoteSolverClasses', 'remoteSolverRemoteClasses']),
    allowLocalPlanPromotion: queryBoolean(params, ['remoteSolverAllowLocalPlan']),
    allowModeMismatch: queryBoolean(params, ['remoteSolverAllowModeMismatch']),
    allowTightCoupling: queryBoolean(params, ['remoteSolverAllowTightCoupling']),
    source: 'query'
  });
}

export function normalizeRemoteSolverPlacementOptions(options = {}) {
  const enabled = firstDefined(options, [
    'enabled',
    'enableRemoteSolverPlacement',
    'remoteSolverPlacement',
    'enableRemoteSolvers'
  ]);
  const families = firstDefined(options, [
    'families',
    'solverFamilies',
    'remoteSolverFamilies',
    'remoteSolvers',
    'remoteSolverKeys'
  ]);
  const mode = firstDefined(options, ['mode', 'remoteSolverPlacementMode', 'remoteSolverMode']);
  const nonAdvisory = firstDefined(options, [
    'nonAdvisory',
    'remoteSolverNonAdvisory',
    'remoteSolverExecutable'
  ]);
  const confidence = firstDefined(options, [
    'minimumConfidence',
    'minConfidence',
    'remoteSolverPlacementConfidence',
    'remoteSolverMinConfidence'
  ]);
  const remoteClasses = firstDefined(options, [
    'allowedRemoteClasses',
    'remoteClasses',
    'remoteSolverClasses',
    'remoteSolverRemoteClasses'
  ]);

  return {
    source: options.source || 'runtime',
    enabled: enabled.found ? normalizeBoolean(enabled.value, false) : false,
    families: normalizeStringList(families.value, DEFAULT_REMOTE_SOLVER_FAMILIES),
    mode: mode.found ? normalizeMode(mode.value, 'auto') : 'auto',
    nonAdvisory: nonAdvisory.found ? normalizeBoolean(nonAdvisory.value, true) : true,
    minimumConfidence: confidence.found
      ? normalizeNumber(confidence.value, 0.4, 0, 1)
      : 0.4,
    allowedRemoteClasses: normalizeStringList(remoteClasses.value, DEFAULT_ALLOWED_REMOTE_CLASSES)
      .map((entry) => entry.toLowerCase()),
    allowLocalPlanPromotion: normalizeBoolean(options.allowLocalPlanPromotion ?? options.remoteSolverAllowLocalPlan, false),
    allowModeMismatch: normalizeBoolean(options.allowModeMismatch ?? options.remoteSolverAllowModeMismatch, false),
    allowTightCoupling: normalizeBoolean(options.allowTightCoupling ?? options.remoteSolverAllowTightCoupling, false)
  };
}

export function createRemoteSolverPlacementPolicy(options = {}) {
  const normalized = normalizeRemoteSolverPlacementOptions(options);
  const readiness = options.readiness || null;
  const placementPlan = options.placementPlan || null;
  const dispatchReady = readiness?.dispatchReady === true;
  const active = normalized.enabled && normalized.nonAdvisory && dispatchReady;
  const reasons = [];
  if (!normalized.enabled) reasons.push('policy-disabled');
  if (normalized.enabled && !normalized.nonAdvisory) reasons.push('dry-run-advisory');
  if (normalized.enabled && normalized.nonAdvisory && !dispatchReady) {
    reasons.push(readiness?.reason || 'remote-placement-not-dispatch-ready');
  }
  if (normalized.families.length <= 0) reasons.push('no-solver-families');

  const mode = normalized.mode === 'auto'
    ? readiness?.requestedMode || placementPlan?.dominantPlacement || 'auto'
    : normalized.mode;

  return {
    schema: MULTISCALE_REMOTE_SOLVER_PLACEMENT_POLICY_SCHEMA,
    sampledAtMs: normalizeNumber(options.nowMs, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    source: normalized.source,
    enabled: normalized.enabled,
    active,
    advisoryOnly: !active,
    nonAdvisory: normalized.nonAdvisory,
    mode: normalized.mode,
    effectiveMode: mode,
    families: normalized.families,
    allowedRemoteClasses: normalized.allowedRemoteClasses,
    familyCount: normalized.families.length,
    minimumConfidence: normalized.minimumConfidence,
    allowLocalPlanPromotion: normalized.allowLocalPlanPromotion,
    allowModeMismatch: normalized.allowModeMismatch,
    allowTightCoupling: normalized.allowTightCoupling,
    remotePlacementDispatchReady: dispatchReady,
    remotePlacementReason: readiness?.reason || null,
    remotePlacementPeerId: readiness?.peerId || null,
    remotePlacementTimeoutMs: readiness?.timeoutMs || null,
    placementPlanSchema: placementPlan?.schema || null,
    placementPlanSource: placementPlan?.source || null,
    reason: reasons[0] || 'ready',
    reasons: reasons.length > 0 ? reasons : ['ready'],
    note: active
      ? 'Selected solver families can be submitted as non-advisory remote tasks when their placement hint also recommends peer or cluster execution.'
      : 'Solver placement remains advisory/local until this policy and the remote placement transport are both explicitly ready.'
  };
}

function chooseRequestedPlacement(hint = {}, policy = {}) {
  if (policy.mode === 'peer' || policy.mode === 'cluster') return policy.mode;
  const recommended = normalizeString(hint.recommendedPlacement || hint.requestedPlacement || hint.placement, 'local').toLowerCase();
  if (recommended === 'peer' || recommended === 'cluster') return recommended;
  const effective = normalizeString(policy.effectiveMode, 'auto').toLowerCase();
  if (effective === 'peer' || effective === 'cluster') return effective;
  return 'local';
}

function withPromotionStatus(hint, status) {
  return {
    ...hint,
    advisoryOnly: true,
    remoteSolverPlacement: {
      schema: MULTISCALE_REMOTE_SOLVER_PLACEMENT_POLICY_SCHEMA,
      promoted: false,
      ...status
    }
  };
}

export function promoteSolverPlacementHint(hint = null, {
  solverKey = hint?.solverKey || null,
  readiness = {},
  policy = createRemoteSolverPlacementPolicy(),
  nowMs = Date.now()
} = {}) {
  if (!hint || typeof hint !== 'object') return null;
  const base = JSON.parse(JSON.stringify(hint));
  const key = normalizeString(solverKey || base.solverKey, '');
  if (!policy?.enabled) {
    return withPromotionStatus(base, {
      enabled: false,
      active: false,
      reason: 'policy-disabled',
      solverKey: key,
      decidedAtMs: nowMs
    });
  }
  if (!policy.active) {
    return withPromotionStatus(base, {
      enabled: true,
      active: false,
      reason: policy.reason || 'policy-not-active',
      solverKey: key,
      decidedAtMs: nowMs
    });
  }
  if (!policy.families?.includes(key)) {
    return withPromotionStatus(base, {
      enabled: true,
      active: true,
      reason: 'solver-family-not-allowed',
      solverKey: key,
      allowedFamilies: [...(policy.families || [])],
      decidedAtMs: nowMs
    });
  }
  const remoteClass = normalizeString(base.remoteClass, 'unknown').toLowerCase();
  if (!policy.allowTightCoupling && !policy.allowedRemoteClasses?.includes(remoteClass)) {
    return withPromotionStatus(base, {
      enabled: true,
      active: true,
      reason: 'remote-class-not-allowed',
      solverKey: key,
      remoteClass,
      allowedRemoteClasses: [...(policy.allowedRemoteClasses || [])],
      decidedAtMs: nowMs
    });
  }
  const confidence = normalizeNumber(base.confidence, 0, 0, 1);
  if (confidence < policy.minimumConfidence) {
    return withPromotionStatus(base, {
      enabled: true,
      active: true,
      reason: 'placement-confidence-too-low',
      solverKey: key,
      confidence,
      minimumConfidence: policy.minimumConfidence,
      decidedAtMs: nowMs
    });
  }
  const requestedPlacement = chooseRequestedPlacement(base, policy);
  const recommendedPlacement = normalizeString(base.recommendedPlacement || base.requestedPlacement, 'local').toLowerCase();
  if (requestedPlacement !== 'peer' && requestedPlacement !== 'cluster') {
    return withPromotionStatus(base, {
      enabled: true,
      active: true,
      reason: 'placement-plan-local',
      solverKey: key,
      decidedAtMs: nowMs
    });
  }
  if (!policy.allowLocalPlanPromotion && recommendedPlacement === 'local') {
    return withPromotionStatus(base, {
      enabled: true,
      active: true,
      reason: 'placement-plan-local',
      solverKey: key,
      decidedAtMs: nowMs
    });
  }
  if (!policy.allowModeMismatch
    && recommendedPlacement !== 'local'
    && recommendedPlacement !== requestedPlacement) {
    return withPromotionStatus(base, {
      enabled: true,
      active: true,
      reason: 'placement-mode-mismatch',
      solverKey: key,
      requestedPlacement,
      recommendedPlacement,
      decidedAtMs: nowMs
    });
  }

  const targetReplicaCount = Math.max(1, Math.floor(Number(base.targetReplicaCount) || 1));
  return {
    ...base,
    advisoryOnly: false,
    executionMode: 'non-advisory-remote',
    requestedPlacement,
    recommendedPlacement: requestedPlacement,
    targetReplicaCount,
    timeoutMs: readiness?.timeoutMs || policy.remotePlacementTimeoutMs || base.timeoutMs || undefined,
    peerId: requestedPlacement === 'peer'
      ? readiness?.peerId || policy.remotePlacementPeerId || base.peerId || null
      : base.peerId || null,
    remoteSolverPlacement: {
      schema: MULTISCALE_REMOTE_SOLVER_PLACEMENT_POLICY_SCHEMA,
      promoted: true,
      enabled: true,
      active: true,
      reason: 'promoted',
      solverKey: key,
      requestedPlacement,
      confidence,
      policyMode: policy.mode,
      effectiveMode: policy.effectiveMode,
      remoteClass,
      peerId: readiness?.peerId || policy.remotePlacementPeerId || null,
      decidedAtMs: nowMs
    }
  };
}

export function createRemoteSolverPlacementDecisionReport({
  placementPlan = null,
  readiness = {},
  policy = createRemoteSolverPlacementPolicy({ readiness, placementPlan }),
  nowMs = Date.now()
} = {}) {
  const entries = {};
  const counts = {
    promoted: 0,
    advisory: 0,
    blocked: 0,
    peer: 0,
    cluster: 0
  };
  const sourceEntries = placementPlan?.entries && typeof placementPlan.entries === 'object'
    ? placementPlan.entries
    : {};

  for (const [solverKey, hint] of Object.entries(sourceEntries)) {
    const decision = promoteSolverPlacementHint(hint, {
      solverKey,
      readiness,
      policy,
      nowMs
    });
    const promoted = decision?.remoteSolverPlacement?.promoted === true;
    const requestedPlacement = decision?.requestedPlacement || decision?.recommendedPlacement || 'local';
    const reason = decision?.remoteSolverPlacement?.reason || 'unknown';
    if (promoted) {
      counts.promoted += 1;
      if (requestedPlacement === 'peer') counts.peer += 1;
      if (requestedPlacement === 'cluster') counts.cluster += 1;
    } else {
      counts.advisory += 1;
      if (policy?.enabled && policy?.active) counts.blocked += 1;
    }
    entries[solverKey] = {
      solverKey,
      solverId: hint?.solverId || null,
      label: hint?.label || solverKey,
      promoted,
      advisoryOnly: decision?.advisoryOnly !== false,
      requestedPlacement,
      recommendedPlacement: hint?.recommendedPlacement || 'local',
      confidence: normalizeNumber(hint?.confidence, 0, 0, 1),
      remoteClass: hint?.remoteClass || null,
      coupling: hint?.coupling || null,
      reason,
      policyEnabled: policy?.enabled === true,
      policyActive: policy?.active === true
    };
  }

  const promotedKeys = Object.values(entries)
    .filter((entry) => entry.promoted)
    .map((entry) => entry.solverKey);
  const blockedKeys = Object.values(entries)
    .filter((entry) => !entry.promoted && entry.policyActive)
    .map((entry) => entry.solverKey);

  return {
    schema: MULTISCALE_REMOTE_SOLVER_PLACEMENT_DECISIONS_SCHEMA,
    sampledAtMs: normalizeNumber(nowMs, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    policySchema: policy?.schema || null,
    placementPlanSchema: placementPlan?.schema || null,
    readinessSchema: readiness?.schema || null,
    policyEnabled: policy?.enabled === true,
    policyActive: policy?.active === true,
    dispatchReady: readiness?.dispatchReady === true,
    counts,
    promotedKeys,
    blockedKeys,
    entries,
    reason: promotedKeys.length > 0
      ? 'promotions-ready'
      : policy?.reason || readiness?.reason || 'no-promotions',
    note: 'Decision telemetry only; actual remote execution still depends on ComputeManager non-advisory task dispatch and remote result validation.'
  };
}

export function summarizeRemoteSolverPlacementPolicy(policy = null) {
  if (!policy || policy.schema !== MULTISCALE_REMOTE_SOLVER_PLACEMENT_POLICY_SCHEMA) return 'warming';
  const state = policy.active
    ? 'active'
    : policy.enabled
      ? policy.nonAdvisory ? 'blocked' : 'dry-run'
      : 'off';
  const families = Array.isArray(policy.families) && policy.families.length > 0
    ? policy.families.slice(0, 3).join(',')
    : 'none';
  const overflow = policy.familyCount > 3 ? `+${policy.familyCount - 3}` : '';
  return `${state} / ${policy.mode || 'auto'} / ${families}${overflow} / ${policy.reason || 'unknown'}`;
}

export function summarizeRemoteSolverPlacementDecisions(report = null) {
  if (!report || report.schema !== MULTISCALE_REMOTE_SOLVER_PLACEMENT_DECISIONS_SCHEMA) return 'warming';
  const counts = report.counts || {};
  const promoted = counts.promoted || 0;
  const advisory = counts.advisory || 0;
  const target = promoted > 0
    ? report.promotedKeys.slice(0, 2).join(',')
    : report.reason || 'none';
  return `${promoted} promote / ${advisory} advisory / ${target}`;
}
