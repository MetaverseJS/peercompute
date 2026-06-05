export const MULTISCALE_LOOPBACK_REMOTE_PLACEMENT_SCHEMA = 'peercompute.multiscale.loopback-remote-placement.v0';

const moduleCache = new Map();

function nowMs() {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
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

function normalizeString(value, fallback = '') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function assertNotAborted(signal) {
  if (!signal?.aborted) return;
  const reason = signal.reason || 'loopback executor aborted';
  const error = reason instanceof Error ? reason : new Error(String(reason));
  error.code ||= 'ERR_MULTISCALE_LOOPBACK_ABORTED';
  throw error;
}

async function importTaskModule(moduleUrl) {
  if (!moduleCache.has(moduleUrl)) {
    moduleCache.set(moduleUrl, import(moduleUrl));
  }
  return moduleCache.get(moduleUrl);
}

function unwrapTaskResult(result) {
  if (!result || typeof result !== 'object' || !Object.prototype.hasOwnProperty.call(result, 'commitDelta')) {
    return {
      value: result,
      commitDelta: null
    };
  }
  return {
    value: Object.prototype.hasOwnProperty.call(result, 'value') ? result.value : result.result,
    commitDelta: result.commitDelta || null
  };
}

function createLoopbackProvenance({
  context,
  result,
  value,
  commitDelta,
  executorId,
  peerId,
  workerId,
  startedAt,
  completedAt
}) {
  const taskPacket = context?.taskPacket || {};
  return {
    schema: MULTISCALE_LOOPBACK_REMOTE_PLACEMENT_SCHEMA,
    executorId,
    peerId,
    workerId,
    trustLevel: 'local-loopback-test',
    codeHash: taskPacket.codeHash || null,
    inputHash: taskPacket.inputHash || null,
    taskHash: taskPacket.taskHash || null,
    outputHash: stableHash(value),
    commitDeltaHash: stableHash(commitDelta),
    resultHash: stableHash(result),
    resultSchema: value?.schema || result?.schema || null,
    validated: true,
    redundantReplicaCount: 1,
    replicaCount: 0,
    durationMs: Number(Math.max(0, completedAt - startedAt).toFixed(3)),
    completedAt: Date.now(),
    note: 'Local loopback executor for exercising non-advisory remote placement without a second peer.'
  };
}

export function createLoopbackRemotePlacementExecutor(options = {}) {
  const executorId = normalizeString(
    options.executorId || options.placementExecutorId,
    'multiscale-loopback-placement'
  );
  const peerId = normalizeString(
    options.peerId || options.remotePeerId || options.remotePlacementPeerId,
    'loopback-peer'
  );
  const workerId = normalizeString(options.workerId, 'loopback-main-thread');

  const executor = async (payload = {}, context = {}) => {
    assertNotAborted(context.signal);
    if (payload.runtime && payload.runtime !== 'js') {
      throw new Error(`Loopback remote placement supports JS module tasks only, got ${payload.runtime}`);
    }
    if (payload.fn) {
      throw new Error('Loopback remote placement rejects serialized function tasks');
    }
    if (!payload.module) {
      throw new Error('Loopback remote placement requires payload.module');
    }

    const startedAt = nowMs();
    const moduleExports = await importTaskModule(payload.module);
    assertNotAborted(context.signal);
    const exportName = payload.exportName || 'default';
    const taskFn = moduleExports[exportName];
    if (typeof taskFn !== 'function') {
      throw new Error(`Loopback remote placement could not find export ${exportName}`);
    }
    const rawResult = await taskFn(payload.data ?? {});
    assertNotAborted(context.signal);
    const completedAt = nowMs();
    const { value, commitDelta } = unwrapTaskResult(rawResult);

    return {
      schema: MULTISCALE_LOOPBACK_REMOTE_PLACEMENT_SCHEMA,
      value,
      commitDelta,
      provenance: createLoopbackProvenance({
        context,
        result: rawResult,
        value,
        commitDelta,
        executorId,
        peerId,
        workerId,
        startedAt,
        completedAt
      })
    };
  };

  executor.placementExecutorId = executorId;
  executor.schema = MULTISCALE_LOOPBACK_REMOTE_PLACEMENT_SCHEMA;
  executor.peerId = peerId;
  executor.workerId = workerId;
  return executor;
}

export function isLoopbackRemotePlacementConfig(config = {}) {
  const mode = normalizeString(
    config.placementExecutorMode || config.remotePlacementExecutorMode || config.executorMode,
    ''
  ).toLowerCase();
  return config.enableLoopbackRemotePlacement === true
    || config.remotePlacementLoopback === true
    || config.loopbackExecutor === true
    || mode === 'loopback';
}
