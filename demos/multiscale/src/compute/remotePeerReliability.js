export const MULTISCALE_REMOTE_PEER_RELIABILITY_SCHEMA = 'peercompute.multiscale.remote-peer-reliability.v0';
export const MULTISCALE_REMOTE_PEER_RELIABILITY_STORE_SCHEMA = 'peercompute.multiscale.remote-peer-reliability-store.v0';

const DEFAULT_PRIOR_SCORE = 0.75;
const DEFAULT_PRIOR_WEIGHT = 2;
const DEFAULT_DECAY_HALF_LIFE_MS = 1000 * 60 * 60 * 24 * 7;
const DEFAULT_MAX_ENTRY_AGE_MS = 1000 * 60 * 60 * 24 * 30;
const DEFAULT_STORAGE_PREFIX = 'peercompute.multiscale.remotePeerReliability';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeNumber(value, fallback = 0, min = -Number.MAX_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return clamp(number, min, max);
}

function round(value, digits = 3) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(digits));
}

function sanitizeScopePart(value, fallback) {
  return String(value || fallback || 'default')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_.:-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || String(fallback || 'default');
}

function normalizePersistence(persistence = null) {
  if (!persistence || typeof persistence !== 'object') return null;
  return {
    schema: persistence.schema || MULTISCALE_REMOTE_PEER_RELIABILITY_STORE_SCHEMA,
    enabled: persistence.enabled === true,
    available: persistence.available === true,
    loaded: persistence.loaded === true,
    saved: persistence.saved === true,
    storageKey: persistence.storageKey || null,
    scopeId: persistence.scopeId || null,
    savedAtMs: persistence.savedAtMs || null,
    loadedAtMs: persistence.loadedAtMs || null,
    status: persistence.status || null,
    errorMessage: persistence.errorMessage || null
  };
}

function clonePeerEntry(entry = {}) {
  return {
    peerId: entry.peerId || null,
    attempts: entry.attempts || 0,
    successes: entry.successes || 0,
    failures: entry.failures || 0,
    timeouts: entry.timeouts || 0,
    rejected: entry.rejected || 0,
    verificationFailed: entry.verificationFailed || 0,
    validationFailed: entry.validationFailed || 0,
    executorFailed: entry.executorFailed || 0,
    totalDurationMs: entry.totalDurationMs || 0,
    averageDurationMs: entry.averageDurationMs || 0,
    successRate: entry.successRate ?? null,
    failureRate: entry.failureRate ?? null,
    reliabilityScore: entry.reliabilityScore ?? null,
    lastOutcome: entry.lastOutcome || null,
    lastErrorKind: entry.lastErrorKind || null,
    lastTaskId: entry.lastTaskId || null,
    lastActualPlacement: entry.lastActualPlacement || null,
    lastWorkerId: entry.lastWorkerId || null,
    lastCompletedAt: entry.lastCompletedAt || null,
    lastObservedAtMs: entry.lastObservedAtMs || null,
    ageMs: entry.ageMs || 0,
    decayFactor: entry.decayFactor ?? null
  };
}

function scorePeerEntry(entry, {
  priorScore = DEFAULT_PRIOR_SCORE,
  priorWeight = DEFAULT_PRIOR_WEIGHT,
  generatedAtMs = Date.now(),
  decayHalfLifeMs = DEFAULT_DECAY_HALF_LIFE_MS
} = {}) {
  const attempts = Math.max(0, entry.attempts || 0);
  if (attempts === 0) {
    return {
      ...entry,
      successRate: null,
      failureRate: null,
      reliabilityScore: null,
      averageDurationMs: 0,
      ageMs: 0,
      decayFactor: null
    };
  }
  const successRate = (entry.successes || 0) / attempts;
  const failureRate = (entry.failures || 0) / attempts;
  const timeoutRate = (entry.timeouts || 0) / attempts;
  const verificationRate = (entry.verificationFailed || 0) / attempts;
  const validationRate = (entry.validationFailed || 0) / attempts;
  const rejectedRate = (entry.rejected || 0) / attempts;
  const smoothed = ((entry.successes || 0) + priorScore * priorWeight) / (attempts + priorWeight);
  const penalty = timeoutRate * 0.18
    + verificationRate * 0.24
    + validationRate * 0.24
    + rejectedRate * 0.12;
  const rawReliability = clamp(smoothed - penalty, 0, 1);
  const ageMs = entry.lastObservedAtMs
    ? Math.max(0, normalizeNumber(generatedAtMs, Date.now(), 0) - normalizeNumber(entry.lastObservedAtMs, 0, 0))
    : 0;
  const halfLifeMs = normalizeNumber(decayHalfLifeMs, DEFAULT_DECAY_HALF_LIFE_MS, 1);
  const decayFactor = ageMs > 0 ? Math.exp(-Math.LN2 * (ageMs / halfLifeMs)) : 1;
  const decayedReliability = priorScore + (rawReliability - priorScore) * decayFactor;
  return {
    ...entry,
    successRate: round(successRate),
    failureRate: round(failureRate),
    reliabilityScore: round(clamp(decayedReliability, 0, 1)),
    rawReliabilityScore: round(rawReliability),
    averageDurationMs: round((entry.totalDurationMs || 0) / attempts, 2),
    ageMs: round(ageMs, 0),
    decayFactor: round(decayFactor)
  };
}

function sortPeers(peers = {}) {
  return Object.values(peers)
    .map((entry) => ({ ...entry }))
    .sort((a, b) => (
      normalizeNumber(b.reliabilityScore, -1, -1, 1) - normalizeNumber(a.reliabilityScore, -1, -1, 1)
      || (b.successes || 0) - (a.successes || 0)
      || (a.failures || 0) - (b.failures || 0)
      || String(a.peerId || '').localeCompare(String(b.peerId || ''))
    ));
}

export function createRemotePeerReliabilityReport({
  peers = {},
  generatedAtMs = Date.now(),
  priorScore = DEFAULT_PRIOR_SCORE,
  priorWeight = DEFAULT_PRIOR_WEIGHT,
  scopeId = null,
  storageKey = null,
  persistence = null,
  decayHalfLifeMs = DEFAULT_DECAY_HALF_LIFE_MS,
  maxEntryAgeMs = DEFAULT_MAX_ENTRY_AGE_MS
} = {}) {
  const normalizedPeers = {};
  const nowMs = normalizeNumber(generatedAtMs, Date.now(), 0, Number.MAX_SAFE_INTEGER);
  const maxAgeMs = normalizeNumber(maxEntryAgeMs, DEFAULT_MAX_ENTRY_AGE_MS, 1);
  for (const [peerId, rawEntry] of Object.entries(peers || {})) {
    const cleanPeerId = String(rawEntry?.peerId || peerId || '').trim();
    if (!cleanPeerId) continue;
    const lastObservedAtMs = normalizeNumber(rawEntry?.lastObservedAtMs, 0, 0, Number.MAX_SAFE_INTEGER);
    if (lastObservedAtMs > 0 && nowMs - lastObservedAtMs > maxAgeMs) continue;
    normalizedPeers[cleanPeerId] = scorePeerEntry({
      ...clonePeerEntry(rawEntry),
      peerId: cleanPeerId
    }, {
      priorScore,
      priorWeight,
      generatedAtMs: nowMs,
      decayHalfLifeMs
    });
  }
  const rankedPeers = sortPeers(normalizedPeers);
  return {
    schema: MULTISCALE_REMOTE_PEER_RELIABILITY_SCHEMA,
    generatedAtMs: nowMs,
    scopeId,
    storageKey,
    priorScore: round(priorScore),
    priorWeight: round(priorWeight),
    decayHalfLifeMs: round(normalizeNumber(decayHalfLifeMs, DEFAULT_DECAY_HALF_LIFE_MS, 1), 0),
    maxEntryAgeMs: round(maxAgeMs, 0),
    peerCount: rankedPeers.length,
    totalAttempts: rankedPeers.reduce((sum, entry) => sum + (entry.attempts || 0), 0),
    totalSuccesses: rankedPeers.reduce((sum, entry) => sum + (entry.successes || 0), 0),
    totalFailures: rankedPeers.reduce((sum, entry) => sum + (entry.failures || 0), 0),
    peers: normalizedPeers,
    rankedPeers,
    persistence: normalizePersistence(persistence)
  };
}

export function createRemotePeerReliabilityScope({
  gameId = 'multiscale',
  roomId = 'multiscale',
  topologyId = 'multiscale-ladder',
  topology = 'distributed'
} = {}) {
  return [
    `game:${sanitizeScopePart(gameId, 'multiscale')}`,
    `room:${sanitizeScopePart(roomId, 'multiscale')}`,
    `topology:${sanitizeScopePart(topologyId, 'multiscale-ladder')}`,
    `type:${sanitizeScopePart(topology, 'distributed')}`
  ].join('|');
}

export function createRemotePeerReliabilityStorageKey(scopeId, {
  prefix = DEFAULT_STORAGE_PREFIX
} = {}) {
  const cleanScope = sanitizeScopePart(scopeId, createRemotePeerReliabilityScope());
  const cleanPrefix = String(prefix || DEFAULT_STORAGE_PREFIX).trim() || DEFAULT_STORAGE_PREFIX;
  return `${cleanPrefix}.${cleanScope}`;
}

function makePersistenceStatus({
  enabled = false,
  available = false,
  loaded = false,
  saved = false,
  storageKey = null,
  scopeId = null,
  savedAtMs = null,
  loadedAtMs = null,
  status = null,
  errorMessage = null
} = {}) {
  return normalizePersistence({
    schema: MULTISCALE_REMOTE_PEER_RELIABILITY_STORE_SCHEMA,
    enabled,
    available,
    loaded,
    saved,
    storageKey,
    scopeId,
    savedAtMs,
    loadedAtMs,
    status,
    errorMessage
  });
}

function canUseStorage(storage) {
  return storage
    && typeof storage.getItem === 'function'
    && typeof storage.setItem === 'function';
}

export function serializeRemotePeerReliabilityReport(report, {
  scopeId = report?.scopeId || null,
  storageKey = report?.storageKey || null,
  savedAtMs = Date.now(),
  maxPeers = 64
} = {}) {
  const rankedPeers = Array.isArray(report?.rankedPeers) ? report.rankedPeers : [];
  const peers = {};
  for (const entry of rankedPeers.slice(0, Math.max(1, Math.floor(maxPeers)))) {
    if (!entry?.peerId) continue;
    peers[entry.peerId] = clonePeerEntry(entry);
  }
  return {
    schema: MULTISCALE_REMOTE_PEER_RELIABILITY_STORE_SCHEMA,
    savedAtMs: normalizeNumber(savedAtMs, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    scopeId,
    storageKey,
    report: {
      schema: MULTISCALE_REMOTE_PEER_RELIABILITY_SCHEMA,
      generatedAtMs: report?.generatedAtMs || savedAtMs,
      priorScore: report?.priorScore ?? DEFAULT_PRIOR_SCORE,
      priorWeight: report?.priorWeight ?? DEFAULT_PRIOR_WEIGHT,
      decayHalfLifeMs: report?.decayHalfLifeMs ?? DEFAULT_DECAY_HALF_LIFE_MS,
      maxEntryAgeMs: report?.maxEntryAgeMs ?? DEFAULT_MAX_ENTRY_AGE_MS,
      peers
    }
  };
}

export function loadRemotePeerReliabilityReportFromStorage({
  storage = null,
  storageKey = null,
  scopeId = null,
  nowMs = Date.now(),
  priorScore = DEFAULT_PRIOR_SCORE,
  priorWeight = DEFAULT_PRIOR_WEIGHT,
  decayHalfLifeMs = DEFAULT_DECAY_HALF_LIFE_MS,
  maxEntryAgeMs = DEFAULT_MAX_ENTRY_AGE_MS
} = {}) {
  const statusBase = {
    enabled: !!storageKey,
    available: canUseStorage(storage),
    storageKey,
    scopeId,
    loadedAtMs: nowMs
  };
  if (!storageKey || !canUseStorage(storage)) {
    const persistence = makePersistenceStatus({
      ...statusBase,
      status: !storageKey ? 'disabled' : 'storage-unavailable'
    });
    return {
      report: createRemotePeerReliabilityReport({
        generatedAtMs: nowMs,
        priorScore,
        priorWeight,
        scopeId,
        storageKey,
        persistence,
        decayHalfLifeMs,
        maxEntryAgeMs
      }),
      persistence
    };
  }
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) {
      const persistence = makePersistenceStatus({
        ...statusBase,
        status: 'empty'
      });
      return {
        report: createRemotePeerReliabilityReport({
          generatedAtMs: nowMs,
          priorScore,
          priorWeight,
          scopeId,
          storageKey,
          persistence,
          decayHalfLifeMs,
          maxEntryAgeMs
        }),
        persistence
      };
    }
    const parsed = JSON.parse(raw);
    if (parsed?.schema !== MULTISCALE_REMOTE_PEER_RELIABILITY_STORE_SCHEMA) {
      throw new Error('invalid remote reliability store schema');
    }
    if (scopeId && parsed.scopeId && parsed.scopeId !== scopeId) {
      throw new Error('remote reliability store scope mismatch');
    }
    const savedAtMs = normalizeNumber(parsed.savedAtMs, 0, 0, Number.MAX_SAFE_INTEGER);
    const persistence = makePersistenceStatus({
      ...statusBase,
      loaded: true,
      savedAtMs,
      status: 'loaded'
    });
    return {
      report: createRemotePeerReliabilityReport({
        peers: parsed.report?.peers || parsed.peers || {},
        generatedAtMs: nowMs,
        priorScore: parsed.report?.priorScore ?? priorScore,
        priorWeight: parsed.report?.priorWeight ?? priorWeight,
        scopeId,
        storageKey,
        persistence,
        decayHalfLifeMs: parsed.report?.decayHalfLifeMs ?? decayHalfLifeMs,
        maxEntryAgeMs: parsed.report?.maxEntryAgeMs ?? maxEntryAgeMs
      }),
      persistence
    };
  } catch (error) {
    const persistence = makePersistenceStatus({
      ...statusBase,
      status: 'load-error',
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    return {
      report: createRemotePeerReliabilityReport({
        generatedAtMs: nowMs,
        priorScore,
        priorWeight,
        scopeId,
        storageKey,
        persistence,
        decayHalfLifeMs,
        maxEntryAgeMs
      }),
      persistence
    };
  }
}

export function saveRemotePeerReliabilityReportToStorage(report, {
  storage = null,
  storageKey = report?.storageKey || null,
  scopeId = report?.scopeId || null,
  nowMs = Date.now(),
  maxPeers = 64
} = {}) {
  const statusBase = {
    enabled: !!storageKey,
    available: canUseStorage(storage),
    storageKey,
    scopeId,
    savedAtMs: nowMs
  };
  if (!storageKey || !canUseStorage(storage)) {
    return makePersistenceStatus({
      ...statusBase,
      status: !storageKey ? 'disabled' : 'storage-unavailable'
    });
  }
  try {
    const snapshot = serializeRemotePeerReliabilityReport(report, {
      scopeId,
      storageKey,
      savedAtMs: nowMs,
      maxPeers
    });
    storage.setItem(storageKey, JSON.stringify(snapshot));
    return makePersistenceStatus({
      ...statusBase,
      saved: true,
      status: 'saved'
    });
  } catch (error) {
    return makePersistenceStatus({
      ...statusBase,
      status: 'save-error',
      errorMessage: error instanceof Error ? error.message : String(error)
    });
  }
}

function readPlacementPeerId(placement = {}) {
  return String(
    placement.peerId
    || placement.provenance?.peerId
    || placement.transportPeerId
    || placement.responderPeerId
    || ''
  ).trim();
}

export function createRemotePlacementObservationKey(placement = {}) {
  const peerId = readPlacementPeerId(placement);
  const provenance = placement.provenance || {};
  const taskId = placement.taskId || provenance.taskId || '';
  const completedAt = placement.completedAt || provenance.completedAt || '';
  const errorKind = placement.errorKind || provenance.retry?.finalErrorKind || '';
  const durationMs = provenance.durationMs ?? placement.durationMs ?? '';
  if (!peerId && !taskId && !completedAt) return null;
  return [
    peerId,
    placement.actualPlacement || '',
    taskId,
    completedAt,
    errorKind,
    durationMs
  ].join('|');
}

function classifyPlacementOutcome(placement = {}) {
  const provenance = placement.provenance || {};
  const verification = provenance.verification || null;
  const validation = provenance.validation || null;
  const admission = placement.admission || null;
  if (placement.ok !== false
    && !placement.errorKind
    && verification?.verified !== false
    && validation?.valid !== false
    && admission?.accepted !== false) {
    return { ok: true, outcome: 'success', errorKind: null };
  }
  const errorKind = placement.errorKind
    || (admission?.accepted === false ? 'rejected' : null)
    || (verification?.verified === false ? 'verification-failed' : null)
    || (validation?.valid === false ? 'validation-failed' : null)
    || provenance.retry?.finalErrorKind
    || 'remote-failed';
  return { ok: false, outcome: errorKind, errorKind };
}

export function updateRemotePeerReliabilityFromPlacement(report, placement, {
  nowMs = Date.now(),
  priorScore = report?.priorScore ?? DEFAULT_PRIOR_SCORE,
  priorWeight = report?.priorWeight ?? DEFAULT_PRIOR_WEIGHT,
  scopeId = report?.scopeId || null,
  storageKey = report?.storageKey || null,
  persistence = report?.persistence || null,
  decayHalfLifeMs = report?.decayHalfLifeMs ?? DEFAULT_DECAY_HALF_LIFE_MS,
  maxEntryAgeMs = report?.maxEntryAgeMs ?? DEFAULT_MAX_ENTRY_AGE_MS
} = {}) {
  if (!placement || typeof placement !== 'object') {
    return createRemotePeerReliabilityReport({
      peers: report?.peers || {},
      generatedAtMs: nowMs,
      priorScore,
      priorWeight,
      scopeId,
      storageKey,
      persistence,
      decayHalfLifeMs,
      maxEntryAgeMs
    });
  }
  const actualPlacement = String(placement.actualPlacement || '');
  if (!actualPlacement.startsWith('remote-')) {
    return createRemotePeerReliabilityReport({
      peers: report?.peers || {},
      generatedAtMs: nowMs,
      priorScore,
      priorWeight,
      scopeId,
      storageKey,
      persistence,
      decayHalfLifeMs,
      maxEntryAgeMs
    });
  }
  const peerId = readPlacementPeerId(placement);
  if (!peerId) {
    return createRemotePeerReliabilityReport({
      peers: report?.peers || {},
      generatedAtMs: nowMs,
      priorScore,
      priorWeight,
      scopeId,
      storageKey,
      persistence,
      decayHalfLifeMs,
      maxEntryAgeMs
    });
  }
  const peers = {};
  for (const [existingPeerId, entry] of Object.entries(report?.peers || {})) {
    peers[existingPeerId] = clonePeerEntry(entry);
  }
  const entry = clonePeerEntry(peers[peerId] || { peerId });
  const outcome = classifyPlacementOutcome(placement);
  const provenance = placement.provenance || {};
  entry.attempts += 1;
  entry.lastOutcome = outcome.outcome;
  entry.lastErrorKind = outcome.errorKind;
  entry.lastTaskId = placement.taskId || provenance.taskId || null;
  entry.lastActualPlacement = actualPlacement;
  entry.lastWorkerId = provenance.workerId || placement.workerId || null;
  entry.lastCompletedAt = placement.completedAt || provenance.completedAt || null;
  entry.lastObservedAtMs = normalizeNumber(nowMs, Date.now(), 0, Number.MAX_SAFE_INTEGER);
  entry.totalDurationMs += normalizeNumber(provenance.durationMs ?? placement.durationMs, 0, 0, Number.MAX_SAFE_INTEGER);
  if (outcome.ok) {
    entry.successes += 1;
  } else {
    entry.failures += 1;
    if (outcome.errorKind === 'timeout') entry.timeouts += 1;
    else if (outcome.errorKind === 'rejected') entry.rejected += 1;
    else if (outcome.errorKind === 'verification-failed') entry.verificationFailed += 1;
    else if (outcome.errorKind === 'validation-failed') entry.validationFailed += 1;
    else entry.executorFailed += 1;
  }
  peers[peerId] = entry;
  return createRemotePeerReliabilityReport({
    peers,
    generatedAtMs: nowMs,
    priorScore,
    priorWeight,
    scopeId,
    storageKey,
    persistence,
    decayHalfLifeMs,
    maxEntryAgeMs
  });
}

export function getRemotePeerReliability(report, peerId) {
  const cleanPeerId = String(peerId || '').trim();
  if (!cleanPeerId) return null;
  const entry = report?.peers?.[cleanPeerId];
  return Number.isFinite(entry?.reliabilityScore) ? entry.reliabilityScore : null;
}
