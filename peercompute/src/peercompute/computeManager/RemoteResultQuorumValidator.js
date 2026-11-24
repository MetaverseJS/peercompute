import { COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA } from './ComputeManager.js';
import { fnv1a32StableHash, sha256StableHash } from './remoteModulePolicy.js';

export const REMOTE_RESULT_QUORUM_POLICY_SCHEMA = 'peercompute.compute.remote-result-quorum-policy.v0';
export const REMOTE_RESULT_QUORUM_REPORT_SCHEMA = 'peercompute.compute.remote-result-quorum.v0';

function normalizeInteger(value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (value === undefined || value === null || value === '' || typeof value === 'boolean') return fallback;
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function stableHash(value) {
  if (value === undefined) return null;
  return sha256StableHash(value);
}

function digestMatchesValue(claimedHash, value) {
  if (claimedHash == null || value === undefined) return true;
  const text = String(claimedHash);
  if (text.startsWith('sha256-')) {
    return text === sha256StableHash(value);
  }
  if (text.startsWith('fnv1a32-')) {
    return text === fnv1a32StableHash(value);
  }
  return true;
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
    verifyPayloadDigests: normalizeBoolean(options.verifyPayloadDigests, true),
    requireDistinctPeers: normalizeBoolean(options.requireDistinctPeers, true),
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
  const hasExplicitValue = Object.prototype.hasOwnProperty.call(source, 'value')
    || Object.prototype.hasOwnProperty.call(source, 'result')
    || Object.prototype.hasOwnProperty.call(source, 'finalResult');
  const value = firstDefined(source.value, source.result, source.finalResult);
  const hasExplicitCommitDelta = Object.prototype.hasOwnProperty.call(source, 'commitDelta')
    || Object.prototype.hasOwnProperty.call(source, 'delta');
  const commitDelta = firstDefined(source.commitDelta, source.delta);
  const claimedOutputHash = firstDefined(source.outputHash, source.resultHash);
  const claimedCommitDeltaHash = firstDefined(source.commitDeltaHash, source.deltaHash);
  const computedOutputHash = hasExplicitValue ? stableHash(value) : null;
  const computedCommitDeltaHash = hasExplicitCommitDelta ? stableHash(commitDelta) : null;
  const outputDigestValid = !options.verifyPayloadDigests
    || !hasExplicitValue
    || digestMatchesValue(claimedOutputHash, value);
  const commitDeltaDigestValid = !options.verifyPayloadDigests
    || !hasExplicitCommitDelta
    || digestMatchesValue(claimedCommitDeltaHash, commitDelta);
  const outputHash = firstDefined(claimedOutputHash, computedOutputHash);
  const commitDeltaHash = firstDefined(claimedCommitDeltaHash, computedCommitDeltaHash);
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
    duplicatePeer: false,
    workerId: source.workerId || source.remoteWorkerId || null,
    executorId: source.executorId || null,
    outputHash,
    computedOutputHash,
    outputDigestValid,
    commitDeltaHash,
    computedCommitDeltaHash,
    commitDeltaDigestValid,
    codeHash: source.codeHash || null,
    inputHash: source.inputHash || null,
    taskHash: source.taskHash || null,
    ok: source.ok !== false
      && source.accepted !== false
      && source.valid !== false
      && peerAvailable
      && outputDigestValid
      && commitDeltaDigestValid,
    taskHashChecks,
    taskHashMismatchFields: taskHashChecks.filter((check) => !check.ok).map((check) => check.field)
  };
}

function normalizePrimary(finalResult, context = {}, options = {}, availability = null) {
  const provenance = context.provenance || {};
  const claimedOutputHash = firstDefined(provenance.outputHash, provenance.resultHash);
  const claimedCommitDeltaHash = firstDefined(provenance.commitDeltaHash, provenance.deltaHash);
  const computedOutputHash = finalResult !== undefined ? stableHash(finalResult) : null;
  const computedCommitDeltaHash = context.commitDelta !== undefined ? stableHash(context.commitDelta) : null;
  const outputDigestValid = !options.verifyPayloadDigests
    || finalResult === undefined
    || digestMatchesValue(claimedOutputHash, finalResult);
  const commitDeltaDigestValid = !options.verifyPayloadDigests
    || context.commitDelta === undefined
    || digestMatchesValue(claimedCommitDeltaHash, context.commitDelta);
  const outputHash = firstDefined(claimedOutputHash, computedOutputHash);
  const commitDeltaHash = firstDefined(claimedCommitDeltaHash, computedCommitDeltaHash);
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
    computedOutputHash,
    outputDigestValid,
    commitDeltaHash,
    computedCommitDeltaHash,
    commitDeltaDigestValid,
    codeHash: provenance.codeHash || context.taskPacket?.codeHash || null,
    inputHash: provenance.inputHash || context.taskPacket?.inputHash || null,
    taskHash: provenance.taskHash || context.taskPacket?.taskHash || null
  };
}

function replicaMatchesPrimary(replica, primary, options) {
  if (!replica.ok || !replica.peerAvailable || replica.duplicatePeer) return false;
  if (!primary.outputDigestValid || !primary.commitDeltaDigestValid) return false;
  if (!replica.outputDigestValid || !replica.commitDeltaDigestValid) return false;
  if (replica.taskHashMismatchFields.length > 0) return false;
  if (
    options.compareOutputHash
    && primary.computedOutputHash
    && replica.computedOutputHash
    && primary.computedOutputHash !== replica.computedOutputHash
  ) {
    return false;
  }
  if (options.compareOutputHash && (!replica.outputHash || replica.outputHash !== primary.outputHash)) return false;
  if (
    options.compareCommitDeltaHash
    && primary.computedCommitDeltaHash
    && replica.computedCommitDeltaHash
    && primary.computedCommitDeltaHash !== replica.computedCommitDeltaHash
  ) {
    return false;
  }
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
  const seenPeerIds = new Set();
  const normalizedPrimaryPeerId = String(primary.peerId || '').trim();
  if (normalizedPrimaryPeerId) {
    seenPeerIds.add(normalizedPrimaryPeerId);
  }
  const replicas = extractReplicaList(context)
    .slice(0, normalized.maxReplicaReports)
    .map((entry, index) => normalizeReplica(entry, index, context, normalized, availability))
    .map((replica) => {
      const normalizedPeerId = String(replica.peerId || '').trim();
      let duplicatePeer = false;
      if (normalized.requireDistinctPeers && normalizedPeerId) {
        if (seenPeerIds.has(normalizedPeerId)) {
          duplicatePeer = true;
        } else {
          seenPeerIds.add(normalizedPeerId);
        }
      }
      return {
        ...replica,
        duplicatePeer,
        ok: replica.ok && !duplicatePeer
      };
    });
  const evaluatedReplicas = replicas.map((replica) => ({
    ...replica,
    matchesPrimary: primary.peerAvailable && replicaMatchesPrimary(replica, primary, normalized)
  }));
  const duplicatePeerCount = evaluatedReplicas.filter((replica) => replica.duplicatePeer).length;
  const distinctReplicas = evaluatedReplicas.filter((replica) => !replica.duplicatePeer);
  const taskHashMismatchCount = distinctReplicas
    .filter((replica) => replica.taskHashMismatchFields.length > 0)
    .length;
  const digestMismatchCount = (primary.outputDigestValid && primary.commitDeltaDigestValid ? 0 : 1)
    + distinctReplicas.filter((replica) => !replica.outputDigestValid || !replica.commitDeltaDigestValid).length;
  const unavailableReplicaCount = distinctReplicas.filter((replica) => !replica.peerAvailable).length;
  const availableReplicaCount = distinctReplicas.length - unavailableReplicaCount;
  const matchingReplicaCount = distinctReplicas.filter((replica) => replica.matchesPrimary).length;
  const primaryAvailableCount = primary.peerAvailable ? 1 : 0;
  const matchingResultCount = (primary.peerAvailable && primary.outputDigestValid && primary.commitDeltaDigestValid ? 1 : 0)
    + matchingReplicaCount;
  const totalResultCount = 1 + distinctReplicas.length;
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
  } else if (!primary.outputDigestValid || !primary.commitDeltaDigestValid) {
    valid = false;
    reason = 'primary-digest-mismatch';
  } else if (totalResultCount < normalized.minReplicaCount) {
    valid = false;
    reason = duplicatePeerCount > 0 ? 'duplicate-responder-peer' : 'replica-count-below-floor';
  } else if (availableResultCount < normalized.minReplicaCount) {
    valid = false;
    reason = 'responder-unavailable';
  } else if (taskHashMismatchCount > 0) {
    valid = false;
    reason = 'task-hash-mismatch';
  } else if (matchingResultCount < normalized.minMatchingReplicas) {
    valid = false;
    if (digestMismatchCount > 0) {
      reason = 'replica-digest-mismatch';
    } else if (unavailableReplicaCount > 0) {
      reason = 'responder-unavailable';
    } else if (duplicatePeerCount > 0) {
      reason = 'duplicate-responder-peer';
    } else {
      reason = 'quorum-mismatch';
    }
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
    distinctRemoteReplicaCount: distinctReplicas.length,
    duplicatePeerCount,
    digestMismatchCount,
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
