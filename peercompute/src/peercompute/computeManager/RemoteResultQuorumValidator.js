import { COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA } from './ComputeManager.js';

export const REMOTE_RESULT_QUORUM_POLICY_SCHEMA = 'peercompute.compute.remote-result-quorum-policy.v0';
export const REMOTE_RESULT_QUORUM_REPORT_SCHEMA = 'peercompute.compute.remote-result-quorum.v0';

function normalizeInteger(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function stableValue(value) {
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
  if (Array.isArray(value)) return value.map(stableValue);
  if (typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      const entry = stableValue(value[key]);
      if (entry !== undefined) out[key] = entry;
    }
    return out;
  }
  return String(value);
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

function stableHash(value) {
  if (value === undefined) return null;
  return hashString(JSON.stringify(stableValue(value)));
}

function normalizeBoolean(value, fallback) {
  return typeof value === 'boolean' ? value : fallback;
}

function normalizePeerIdSet(input) {
  if (!input) return new Set();
  if (input instanceof Set) {
    return new Set([...input].map((id) => String(id || '').trim()).filter(Boolean));
  }
  if (Array.isArray(input)) {
    return new Set(input.map((id) => String(id || '').trim()).filter(Boolean));
  }
  return new Set();
}

export function normalizeRemoteResultQuorumOptions(options = {}) {
  const minReplicaCount = normalizeInteger(options.minReplicaCount ?? options.minResultCount, 2, 1, 1000000);
  return {
    schema: REMOTE_RESULT_QUORUM_POLICY_SCHEMA,
    validationId: options.validationId || options.policyId || options.id || 'remote-result-quorum-validator',
    minReplicaCount,
    minMatchingReplicas: normalizeInteger(
      options.minMatchingReplicas ?? options.minMatchingResultCount,
      minReplicaCount,
      1,
      1000000
    ),
    compareOutputHash: normalizeBoolean(options.compareOutputHash, true),
    compareCommitDeltaHash: normalizeBoolean(options.compareCommitDeltaHash, true),
    compareTaskHashes: normalizeBoolean(options.compareTaskHashes, true),
    requireReplicaTaskHashes: normalizeBoolean(options.requireReplicaTaskHashes, false),
    failClosedOnUnavailableResponder: normalizeBoolean(options.failClosedOnUnavailableResponder, true),
    maxReplicaReports: normalizeInteger(options.maxReplicaReports, 64, 1, 1000000),
    isPeerAvailable: typeof options.isPeerAvailable === 'function' ? options.isPeerAvailable : null,
    unavailablePeers: options.unavailablePeers || null
  };
}

function firstDefined(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null) return value;
  }
  return null;
}

function extractReplicaList(context = {}) {
  const provenance = context.provenance || {};
  const payload = context.payload || {};
  const lists = [
    provenance.replicas,
    provenance.replicaResults,
    provenance.quorum?.replicas,
    payload.remoteReplicas,
    payload.replicaResults
  ];
  return lists.find(Array.isArray) || [];
}

function buildPeerAvailabilityChecker(context = {}, options = {}) {
  const unavailableSet = new Set([
    ...normalizePeerIdSet(options.unavailablePeers),
    ...normalizePeerIdSet(context.unavailablePeers),
    ...normalizePeerIdSet(context.provenance?.unavailablePeers)
  ]);
  const optionCheck = typeof options.isPeerAvailable === 'function' ? options.isPeerAvailable : null;
  const contextCheck = typeof context.isPeerAvailable === 'function' ? context.isPeerAvailable : null;

  return {
    unavailableSet,
    isAvailable(peerId) {
      const normalizedId = String(peerId || '').trim();
      if (!normalizedId) return true;
      if (unavailableSet.has(normalizedId)) return false;
      if (optionCheck && optionCheck(normalizedId) === false) return false;
      if (contextCheck && contextCheck(normalizedId) === false) return false;
      return true;
    }
  };
}

function normalizeReplica(entry, index, context, options, availability) {
  const source = entry && typeof entry === 'object' ? entry : { value: entry };
  const value = firstDefined(source.value, source.result, source.finalResult);
  const commitDelta = firstDefined(source.commitDelta, source.delta);
  const outputHash = firstDefined(
    source.outputHash,
    source.resultHash,
    value !== null ? stableHash(value) : null
  );
  const commitDeltaHash = firstDefined(
    source.commitDeltaHash,
    source.deltaHash,
    commitDelta !== null ? stableHash(commitDelta) : null
  );
  const taskPacket = context.taskPacket || {};
  const taskHashChecks = ['codeHash', 'inputHash', 'taskHash'].map((field) => {
    const expected = taskPacket[field] || null;
    const actual = source[field] || null;
    const missingAllowed = !options.requireReplicaTaskHashes && actual == null;
    return {
      field,
      expected,
      actual,
      ok: !options.compareTaskHashes || !expected || missingAllowed || expected === actual
    };
  });
  const peerId = source.peerId || source.remotePeerId || source.responderPeerId || null;
  const peerAvailable = !options.failClosedOnUnavailableResponder
    || source.peerAvailable !== false && availability.isAvailable(peerId);

  return {
    index,
    peerId,
    peerAvailable,
    workerId: source.workerId || source.remoteWorkerId || null,
    executorId: source.executorId || null,
    outputHash,
    commitDeltaHash,
    codeHash: source.codeHash || null,
    inputHash: source.inputHash || null,
    taskHash: source.taskHash || null,
    ok: source.ok !== false && source.accepted !== false && source.valid !== false && peerAvailable,
    taskHashChecks,
    taskHashMismatchFields: taskHashChecks.filter((check) => !check.ok).map((check) => check.field)
  };
}

function normalizePrimary(finalResult, context = {}, options = {}, availability = null) {
  const provenance = context.provenance || {};
  const outputHash = firstDefined(
    provenance.outputHash,
    provenance.resultHash,
    stableHash(finalResult)
  );
  const commitDeltaHash = firstDefined(
    provenance.commitDeltaHash,
    provenance.deltaHash,
    stableHash(context.commitDelta)
  );
  const peerId = firstDefined(
    provenance.peerId,
    provenance.responderPeerId,
    context.peerId,
    context.responderPeerId
  );
  const peerAvailable = !options.failClosedOnUnavailableResponder
    || !availability
    || availability.isAvailable(peerId);
  return {
    peerId,
    peerAvailable,
    outputHash,
    commitDeltaHash,
    codeHash: provenance.codeHash || context.taskPacket?.codeHash || null,
    inputHash: provenance.inputHash || context.taskPacket?.inputHash || null,
    taskHash: provenance.taskHash || context.taskPacket?.taskHash || null
  };
}

function replicaMatchesPrimary(replica, primary, options) {
  if (!replica.ok || !replica.peerAvailable) return false;
  if (replica.taskHashMismatchFields.length > 0) return false;
  if (options.compareOutputHash && (!replica.outputHash || replica.outputHash !== primary.outputHash)) return false;
  if (
    options.compareCommitDeltaHash
    && (primary.commitDeltaHash || replica.commitDeltaHash)
    && (!replica.commitDeltaHash || replica.commitDeltaHash !== primary.commitDeltaHash)
  ) {
    return false;
  }
  return true;
}

export function evaluateRemoteResultQuorum(finalResult, context = {}, options = {}) {
  const normalized = options.schema === REMOTE_RESULT_QUORUM_POLICY_SCHEMA
    ? options
    : normalizeRemoteResultQuorumOptions(options);
  const availability = buildPeerAvailabilityChecker(context, normalized);
  const primary = normalizePrimary(finalResult, context, normalized, availability);
  const replicas = extractReplicaList(context)
    .slice(0, normalized.maxReplicaReports)
    .map((entry, index) => normalizeReplica(entry, index, context, normalized, availability));
  const evaluatedReplicas = replicas.map((replica) => ({
    ...replica,
    matchesPrimary: primary.peerAvailable && replicaMatchesPrimary(replica, primary, normalized)
  }));
  const taskHashMismatchCount = evaluatedReplicas
    .filter((replica) => replica.taskHashMismatchFields.length > 0)
    .length;
  const unavailableReplicaCount = evaluatedReplicas.filter((replica) => !replica.peerAvailable).length;
  const availableReplicaCount = evaluatedReplicas.length - unavailableReplicaCount;
  const matchingReplicaCount = evaluatedReplicas.filter((replica) => replica.matchesPrimary).length;
  const primaryAvailableCount = primary.peerAvailable ? 1 : 0;
  const matchingResultCount = primaryAvailableCount + matchingReplicaCount;
  const totalResultCount = 1 + evaluatedReplicas.length;
  const availableResultCount = primaryAvailableCount + availableReplicaCount;
  const unavailablePeers = [
    ...new Set([
      ...availability.unavailableSet,
      ...(primary.peerId && !primary.peerAvailable ? [primary.peerId] : []),
      ...evaluatedReplicas.filter((replica) => replica.peerId && !replica.peerAvailable).map((replica) => replica.peerId)
    ])
  ];

  let valid = true;
  let reason = 'quorum-accepted';
  if (!primary.peerAvailable) {
    valid = false;
    reason = 'primary-responder-unavailable';
  } else if (totalResultCount < normalized.minReplicaCount) {
    valid = false;
    reason = 'replica-count-below-floor';
  } else if (availableResultCount < normalized.minReplicaCount) {
    valid = false;
    reason = 'responder-unavailable';
  } else if (taskHashMismatchCount > 0) {
    valid = false;
    reason = 'task-hash-mismatch';
  } else if (matchingResultCount < normalized.minMatchingReplicas) {
    valid = false;
    reason = unavailableReplicaCount > 0 ? 'responder-unavailable' : 'quorum-mismatch';
  }

  return {
    schema: COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA,
    quorumSchema: REMOTE_RESULT_QUORUM_REPORT_SCHEMA,
    validationId: normalized.validationId,
    valid,
    reason,
    primaryPeerId: primary.peerId,
    primaryPeerAvailable: primary.peerAvailable,
    primaryOutputHash: primary.outputHash,
    primaryCommitDeltaHash: primary.commitDeltaHash,
    totalResultCount,
    availableResultCount,
    remoteReplicaCount: evaluatedReplicas.length,
    unavailableReplicaCount,
    unavailablePeers,
    matchingResultCount,
    matchingReplicaCount,
    requiredResultCount: normalized.minReplicaCount,
    requiredMatchingResultCount: normalized.minMatchingReplicas,
    taskHashMismatchCount,
    compareOutputHash: normalized.compareOutputHash,
    compareCommitDeltaHash: normalized.compareCommitDeltaHash,
    compareTaskHashes: normalized.compareTaskHashes,
    replicas: evaluatedReplicas,
    decidedAt: Date.now()
  };
}

export function createRemoteResultQuorumValidator(options = {}) {
  const normalized = normalizeRemoteResultQuorumOptions(options);
  const unavailablePeers = normalizePeerIdSet(options.unavailablePeers);
  const peerReasons = new Map();
  const externalIsPeerAvailable = normalized.isPeerAvailable;
  const listeners = new Set();

  const isPeerAvailable = (peerId) => {
    const id = String(peerId || '').trim();
    if (!id) return true;
    if (unavailablePeers.has(id)) return false;
    if (externalIsPeerAvailable && externalIsPeerAvailable(id) === false) return false;
    return true;
  };

  const effectivePolicy = {
    ...normalized,
    unavailablePeers,
    isPeerAvailable
  };

  const validator = (finalResult, context) => evaluateRemoteResultQuorum(finalResult, context, effectivePolicy);
  validator.placementResultValidatorId = normalized.validationId;
  validator.policy = normalized;
  validator.validateTaskResult = (finalResult, context) => validator(finalResult, context);
  validator.validateResult = (finalResult, context) => validator(finalResult, context);
  validator.markPeerUnavailable = (peerId, { reason = 'peer-disconnected' } = {}) => {
    const id = String(peerId || '').trim();
    if (!id) return false;
    unavailablePeers.add(id);
    peerReasons.set(id, { reason: String(reason || 'peer-disconnected'), at: Date.now() });
    for (const listener of [...listeners]) {
      try { listener({ type: 'peer-unavailable', peerId: id, reason: String(reason || 'peer-disconnected') }); } catch {}
    }
    return true;
  };
  validator.markPeerAvailable = (peerId) => {
    const id = String(peerId || '').trim();
    if (!id) return false;
    const removed = unavailablePeers.delete(id);
    peerReasons.delete(id);
    if (removed) {
      for (const listener of [...listeners]) {
        try { listener({ type: 'peer-available', peerId: id }); } catch {}
      }
    }
    return removed;
  };
  validator.isPeerAvailable = isPeerAvailable;
  validator.getUnavailablePeers = () => [...unavailablePeers];
  validator.onPeerAvailabilityChange = (listener) => {
    if (typeof listener !== 'function') throw new TypeError('listener must be a function');
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  validator.bindToKernel = (kernel) => {
    if (!kernel || typeof kernel.onPeerDisconnect !== 'function') {
      throw new TypeError('bindToKernel requires a NodeKernel with onPeerDisconnect(listener)');
    }
    const unsubDisconnect = kernel.onPeerDisconnect((event) => {
      const peerId = typeof event === 'string' ? event : event?.peerId;
      if (peerId) validator.markPeerUnavailable(peerId, { reason: event?.reason || 'peer-disconnected' });
    });
    const unsubReconnect = typeof kernel.onPeerReconnect === 'function'
      ? kernel.onPeerReconnect((event) => {
          const peerId = typeof event === 'string' ? event : event?.peerId;
          if (peerId) validator.markPeerAvailable(peerId);
        })
      : null;
    const unsubChange = !unsubReconnect && typeof kernel.onPeerConnectionChange === 'function'
      ? kernel.onPeerConnectionChange((event) => {
          if (event?.type === 'reconnect' || event?.type === 'connect') {
            if (event.peerId) validator.markPeerAvailable(event.peerId);
          }
        })
      : null;
    return () => {
      unsubDisconnect?.();
      unsubReconnect?.();
      unsubChange?.();
    };
  };
  return validator;
}

export class RemoteResultQuorumValidator {
  constructor(options = {}) {
    const fn = createRemoteResultQuorumValidator(options);
    this._validator = fn;
    this.placementResultValidatorId = fn.placementResultValidatorId;
    this.policy = fn.policy;
  }

  validate(finalResult, context) {
    return this._validator(finalResult, context);
  }

  validateTaskResult(finalResult, context) {
    return this._validator(finalResult, context);
  }

  validateResult(finalResult, context) {
    return this._validator(finalResult, context);
  }

  markPeerUnavailable(peerId, options) {
    return this._validator.markPeerUnavailable(peerId, options);
  }

  markPeerAvailable(peerId) {
    return this._validator.markPeerAvailable(peerId);
  }

  isPeerAvailable(peerId) {
    return this._validator.isPeerAvailable(peerId);
  }

  getUnavailablePeers() {
    return this._validator.getUnavailablePeers();
  }

  onPeerAvailabilityChange(listener) {
    return this._validator.onPeerAvailabilityChange(listener);
  }

  bindToKernel(kernel) {
    return this._validator.bindToKernel(kernel);
  }
}
