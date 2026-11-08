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
    maxReplicaReports: normalizeInteger(options.maxReplicaReports, 64, 1, 1000000)
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

function normalizeReplica(entry, index, context, options) {
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

  return {
    index,
    peerId: source.peerId || source.remotePeerId || null,
    workerId: source.workerId || source.remoteWorkerId || null,
    executorId: source.executorId || null,
    outputHash,
    commitDeltaHash,
    codeHash: source.codeHash || null,
    inputHash: source.inputHash || null,
    taskHash: source.taskHash || null,
    ok: source.ok !== false && source.accepted !== false && source.valid !== false,
    taskHashChecks,
    taskHashMismatchFields: taskHashChecks.filter((check) => !check.ok).map((check) => check.field)
  };
}

function normalizePrimary(finalResult, context = {}) {
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
  return {
    outputHash,
    commitDeltaHash,
    codeHash: provenance.codeHash || context.taskPacket?.codeHash || null,
    inputHash: provenance.inputHash || context.taskPacket?.inputHash || null,
    taskHash: provenance.taskHash || context.taskPacket?.taskHash || null
  };
}

function replicaMatchesPrimary(replica, primary, options) {
  if (!replica.ok) return false;
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
  const primary = normalizePrimary(finalResult, context);
  const replicas = extractReplicaList(context)
    .slice(0, normalized.maxReplicaReports)
    .map((entry, index) => normalizeReplica(entry, index, context, normalized));
  const evaluatedReplicas = replicas.map((replica) => ({
    ...replica,
    matchesPrimary: replicaMatchesPrimary(replica, primary, normalized)
  }));
  const taskHashMismatchCount = evaluatedReplicas
    .filter((replica) => replica.taskHashMismatchFields.length > 0)
    .length;
  const matchingReplicaCount = evaluatedReplicas.filter((replica) => replica.matchesPrimary).length;
  const matchingResultCount = 1 + matchingReplicaCount;
  const totalResultCount = 1 + evaluatedReplicas.length;

  let valid = true;
  let reason = 'quorum-accepted';
  if (totalResultCount < normalized.minReplicaCount) {
    valid = false;
    reason = 'replica-count-below-floor';
  } else if (taskHashMismatchCount > 0) {
    valid = false;
    reason = 'task-hash-mismatch';
  } else if (matchingResultCount < normalized.minMatchingReplicas) {
    valid = false;
    reason = 'quorum-mismatch';
  }

  return {
    schema: COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA,
    quorumSchema: REMOTE_RESULT_QUORUM_REPORT_SCHEMA,
    validationId: normalized.validationId,
    valid,
    reason,
    primaryOutputHash: primary.outputHash,
    primaryCommitDeltaHash: primary.commitDeltaHash,
    totalResultCount,
    remoteReplicaCount: evaluatedReplicas.length,
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
  const validator = (finalResult, context) => evaluateRemoteResultQuorum(finalResult, context, normalized);
  validator.placementResultValidatorId = normalized.validationId;
  validator.policy = normalized;
  return validator;
}
