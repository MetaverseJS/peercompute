import {
  RIDE_TILE_LIMITS,
  normalizeRideTile,
  rideTileAt,
  rideTileCoverage,
  rideTileNeighborhood,
} from '../world/rideTile.js';

const STREAM_SCHEMA = 'peercompute.motorcycle.globe-surface-stream.v1';
const SNAPSHOT_SCHEMA = 'peercompute.motorcycle.globe-surface-snapshot.v1';
const STAGE_SCHEMA = 'peercompute.motorcycle.globe-surface-stage.v1';
const RESERVATION_SCHEMA = 'peercompute.motorcycle.globe-surface-reservation.v1';

const DEFAULT_RETRY_POLICY = Object.freeze({
  maximumAttempts: 3,
  initialDelayMs: 250,
  maximumDelayMs: 4_000,
  backoffMultiplier: 2,
});

export const GLOBE_SURFACE_STREAM_LIMITS = Object.freeze({
  maximumDesiredTiles: RIDE_TILE_LIMITS.maximumDesiredTiles,
  maximumActiveTiles: RIDE_TILE_LIMITS.maximumActiveTiles,
  maximumResidentRecords: 32,
  maximumConcurrentRequests: 6,
  maximumResidentBytes: 64 * 1024 * 1024,
  maximumResidentVertices: 900_000,
  maximumTileBytes: 8 * 1024 * 1024,
  maximumTileVertices: 100_000,
});

function positiveInteger(value, fallback, label, maximum = Number.MAX_SAFE_INTEGER) {
  const resolved = value ?? fallback;
  if (!Number.isSafeInteger(resolved) || resolved < 1 || resolved > maximum) {
    throw new RangeError(`${label} must be an integer between 1 and ${maximum}.`);
  }
  return resolved;
}

function nonNegativeNumber(value, fallback, label) {
  const resolved = value ?? fallback;
  if (!Number.isFinite(resolved) || resolved < 0) {
    throw new RangeError(`${label} must be a non-negative finite number.`);
  }
  return resolved;
}

function defaultTransientFailure(error) {
  if (error?.retryable === true || error?.transient === true) return true;
  if (error?.retryable === false || error?.transient === false) return false;
  const status = Number(error?.status ?? error?.statusCode);
  if (status === 408 || status === 425 || status === 429 || status >= 500) return true;
  return new Set([
    'ECONNABORTED',
    'ECONNRESET',
    'EHOSTUNREACH',
    'ENETDOWN',
    'ENETUNREACH',
    'ETIMEDOUT',
    'ERR_NETWORK',
    'UND_ERR_CONNECT_TIMEOUT',
    'UND_ERR_HEADERS_TIMEOUT',
    'UND_ERR_SOCKET',
  ]).has(error?.code);
}

function normalizeRetryPolicy(options = {}) {
  const maximumAttempts = positiveInteger(
    options.maximumAttempts,
    DEFAULT_RETRY_POLICY.maximumAttempts,
    'retry.maximumAttempts',
    16,
  );
  const initialDelayMs = nonNegativeNumber(
    options.initialDelayMs,
    DEFAULT_RETRY_POLICY.initialDelayMs,
    'retry.initialDelayMs',
  );
  const maximumDelayMs = nonNegativeNumber(
    options.maximumDelayMs,
    DEFAULT_RETRY_POLICY.maximumDelayMs,
    'retry.maximumDelayMs',
  );
  const backoffMultiplier = Number(options.backoffMultiplier
    ?? DEFAULT_RETRY_POLICY.backoffMultiplier);
  if (!Number.isFinite(backoffMultiplier) || backoffMultiplier < 1) {
    throw new RangeError('retry.backoffMultiplier must be a finite number of at least 1.');
  }
  if (maximumDelayMs < initialDelayMs) {
    throw new RangeError('retry.maximumDelayMs cannot be less than retry.initialDelayMs.');
  }
  const isTransient = options.isTransient ?? defaultTransientFailure;
  if (typeof isTransient !== 'function') {
    throw new TypeError('retry.isTransient must be a function.');
  }
  return Object.freeze({
    maximumAttempts,
    initialDelayMs,
    maximumDelayMs,
    backoffMultiplier,
    isTransient,
  });
}

function normalizeLimits(options = {}) {
  const limits = Object.freeze({
    maximumDesiredTiles: RIDE_TILE_LIMITS.maximumDesiredTiles,
    maximumActiveTiles: RIDE_TILE_LIMITS.maximumActiveTiles,
    maximumResidentRecords: positiveInteger(
      options.maximumResidentRecords,
      GLOBE_SURFACE_STREAM_LIMITS.maximumResidentRecords,
      'maximumResidentRecords',
    ),
    maximumConcurrentRequests: positiveInteger(
      options.maximumConcurrentRequests,
      GLOBE_SURFACE_STREAM_LIMITS.maximumConcurrentRequests,
      'maximumConcurrentRequests',
      GLOBE_SURFACE_STREAM_LIMITS.maximumConcurrentRequests,
    ),
    maximumResidentBytes: positiveInteger(
      options.maximumResidentBytes,
      GLOBE_SURFACE_STREAM_LIMITS.maximumResidentBytes,
      'maximumResidentBytes',
    ),
    maximumResidentVertices: positiveInteger(
      options.maximumResidentVertices,
      GLOBE_SURFACE_STREAM_LIMITS.maximumResidentVertices,
      'maximumResidentVertices',
    ),
    maximumTileBytes: positiveInteger(
      options.maximumTileBytes,
      GLOBE_SURFACE_STREAM_LIMITS.maximumTileBytes,
      'maximumTileBytes',
    ),
    maximumTileVertices: positiveInteger(
      options.maximumTileVertices,
      GLOBE_SURFACE_STREAM_LIMITS.maximumTileVertices,
      'maximumTileVertices',
    ),
  });
  if (limits.maximumResidentRecords < limits.maximumActiveTiles) {
    throw new RangeError('maximumResidentRecords must retain the complete active 3x3 terrain set.');
  }
  if (limits.maximumTileBytes > limits.maximumResidentBytes) {
    throw new RangeError('maximumTileBytes cannot exceed maximumResidentBytes.');
  }
  if (limits.maximumTileVertices > limits.maximumResidentVertices) {
    throw new RangeError('maximumTileVertices cannot exceed maximumResidentVertices.');
  }
  return limits;
}

function assertFrame(frame, label = 'currentFrame') {
  if (frame?.schema !== 'peercompute.geo.local-enu-frame.v1'
    || typeof frame.localToEcef !== 'function'
    || typeof frame.ecefToLocal !== 'function'
    || !frame.axes?.east
    || !frame.axes?.up
    || !frame.axes?.south) {
    throw new TypeError(`${label} must be a canonical local ENU frame.`);
  }
  return frame;
}

function tuple3(value, label) {
  if ((!Array.isArray(value) && !ArrayBuffer.isView(value)) || value.length < 3) {
    throw new TypeError(`${label} must contain three components.`);
  }
  const tuple = [Number(value[0]), Number(value[1]), Number(value[2])];
  if (!tuple.every(Number.isFinite)) throw new TypeError(`${label} must be finite.`);
  return tuple;
}

function localVectorToEcef(vector, frame) {
  const [x, y, z] = tuple3(vector, 'local vector');
  return [0, 1, 2].map((axis) => (
    x * frame.axes.east[axis]
    + y * frame.axes.up[axis]
    + z * frame.axes.south[axis]
  ));
}

function ecefVectorToLocal(vector, frame) {
  const resolved = tuple3(vector, 'ECEF vector');
  return [frame.axes.east, frame.axes.up, frame.axes.south].map((axis) => (
    resolved[0] * axis[0] + resolved[1] * axis[1] + resolved[2] * axis[2]
  ));
}

function createChunkTransform(currentFrame, chunkFrame) {
  assertFrame(currentFrame);
  assertFrame(chunkFrame, 'terrain frame');
  return Object.freeze({
    schemaVersion: 'peercompute.motorcycle.surface-chunk-transform.v1',
    currentToChunkPoint(point) {
      return chunkFrame.ecefToLocal(currentFrame.localToEcef(tuple3(point, 'current point')));
    },
    chunkToCurrentPoint(point) {
      return currentFrame.ecefToLocal(chunkFrame.localToEcef(tuple3(point, 'chunk point')));
    },
    currentToChunkVector(vector) {
      return ecefVectorToLocal(localVectorToEcef(vector, currentFrame), chunkFrame);
    },
    chunkToCurrentVector(vector) {
      return ecefVectorToLocal(localVectorToEcef(vector, chunkFrame), currentFrame);
    },
  });
}

function resourceOf(value, label) {
  const resource = value?.resource;
  const residentBytes = Number(resource?.residentBytes);
  const vertexCount = Number(resource?.vertexCount);
  if (!Number.isSafeInteger(residentBytes) || residentBytes < 0
    || !Number.isSafeInteger(vertexCount) || vertexCount < 0) {
    throw new TypeError(`${label} must publish non-negative integer resource residentBytes and vertexCount.`);
  }
  return Object.freeze({ residentBytes, vertexCount });
}

function errorSummary(error, details = {}) {
  return Object.freeze({
    name: String(error?.name ?? 'Error'),
    code: typeof error?.code === 'string' ? error.code : null,
    message: String(error?.message ?? error),
    ...details,
  });
}

function isAbort(error, signal) {
  return signal?.aborted === true || error?.name === 'AbortError' || error?.code === 'ABORT_ERR';
}

function recordResource(record) {
  return Object.freeze({
    residentBytes: (record.terrainResource?.residentBytes ?? 0)
      + (record.roadResource?.residentBytes ?? 0),
    vertexCount: (record.terrainResource?.vertexCount ?? 0)
      + (record.roadResource?.vertexCount ?? 0),
  });
}

function emptySnapshot(currentFrame, contentEpoch = 0) {
  return Object.freeze({
    schemaVersion: SNAPSHOT_SCHEMA,
    revision: 0,
    generation: 0,
    contentEpoch,
    centerTile: null,
    currentFrame,
    records: Object.freeze([]),
    activeKeys: Object.freeze([]),
    resourceIdentities: Object.freeze([]),
    roads: Object.freeze({ ready: 0, failed: 0, pending: 0, disabled: 0 }),
    resident: Object.freeze({ records: 0, bytes: 0, vertices: 0 }),
  });
}

export function createGlobeSurfaceStream({
  currentFrame,
  loadTerrainTile,
  loadRoadTile = null,
  clock = () => Date.now(),
  limits: limitOptions = {},
  retry: retryOptions = {},
} = {}) {
  let committedFrame = assertFrame(currentFrame);
  if (typeof loadTerrainTile !== 'function') throw new TypeError('loadTerrainTile is required.');
  if (loadRoadTile !== null && typeof loadRoadTile !== 'function') {
    throw new TypeError('loadRoadTile must be a function or null.');
  }
  if (typeof clock !== 'function') throw new TypeError('clock must be a function.');
  const limits = normalizeLimits(limitOptions);
  const retryPolicy = normalizeRetryPolicy(retryOptions);
  const records = new Map();
  const disposedResources = new WeakSet();
  const stageMetadata = new WeakMap();
  const reservationMetadata = new WeakMap();
  const stageResults = new WeakMap();
  let disposed = false;
  let generation = 0;
  let revision = 0;
  let contentEpoch = 0;
  let accessSequence = 0;
  let requestSequence = 0;
  let resourceSequence = 0;
  let reservationSequence = 0;
  let centerTile = null;
  let coverage = null;
  let activeKeys = Object.freeze([]);
  let desiredKeys = Object.freeze([]);
  let activeRequests = 0;
  let committedSnapshot = emptySnapshot(committedFrame);
  let staged = null;
  let activeReservation = null;
  const counters = {
    terrainBuilds: 0,
    terrainReuses: 0,
    roadBuilds: 0,
    roadReuses: 0,
    evictions: 0,
    requestsStarted: 0,
    requestsCompleted: 0,
    requestsFailed: 0,
    requestsCancelled: 0,
    maximumConcurrentRequests: 0,
    retriesScheduled: 0,
    retriesStarted: 0,
    retryExhaustions: 0,
    terminalFailures: 0,
    capRejections: 0,
    staleResults: 0,
    terrainDisposals: 0,
    roadDisposals: 0,
    disposalFailures: 0,
    reservationsCreated: 0,
    reservationsRejected: 0,
    reservationsCommitted: 0,
    reservationsReleased: 0,
    commits: 0,
    rejectedCommits: 0,
  };

  const clockNow = () => {
    const value = Number(clock());
    if (!Number.isFinite(value)) throw new TypeError('clock must return a finite timestamp.');
    return value;
  };

  const committedKeySet = () => new Set(committedSnapshot.activeKeys);
  const residentRecords = () => [...records.values()].filter((record) => record.terrain !== null);
  const residentUsage = () => residentRecords().reduce((usage, record) => {
    const resource = recordResource(record);
    usage.bytes += resource.residentBytes;
    usage.vertices += resource.vertexCount;
    return usage;
  }, { bytes: 0, vertices: 0 });

  const invalidatePublishedRecord = (record) => {
    record.publicByFrame = new WeakMap();
  };

  const bumpContentEpoch = (record = null) => {
    contentEpoch += 1;
    staged = null;
    if (record) invalidatePublishedRecord(record);
    return contentEpoch;
  };

  const disposeResource = (value, kind) => {
    if ((typeof value !== 'object' && typeof value !== 'function') || value === null) return false;
    if (disposedResources.has(value)) return false;
    disposedResources.add(value);
    counters[kind === 'terrain' ? 'terrainDisposals' : 'roadDisposals'] += 1;
    try {
      value.dispose?.();
    } catch {
      counters.disposalFailures += 1;
    }
    return true;
  };

  const disposeRecordResources = (record) => {
    disposeResource(record.road, 'road');
    disposeResource(record.terrain, 'terrain');
  };

  const evict = (record) => {
    if (!record.terrain || record.reservationPins > 0) return false;
    record.roadController?.abort();
    record.terrainController?.abort();
    disposeRecordResources(record);
    record.terrain = null;
    record.terrainResource = null;
    record.terrainIdentity = null;
    record.road = null;
    record.roadResource = null;
    record.roadIdentity = null;
    record.terrainState = record.desired ? 'queued' : 'absent';
    record.roadState = loadRoadTile ? 'unrequested' : 'disabled';
    record.terrainAttempts = 0;
    record.roadAttempts = 0;
    record.terrainRetryAt = null;
    record.roadRetryAt = null;
    record.error = null;
    record.terrainError = null;
    record.roadError = null;
    bumpContentEpoch(record);
    counters.evictions += 1;
    if (!record.desired && !committedKeySet().has(record.key)) records.delete(record.key);
    return true;
  };

  const evictUntilFits = (incomingBytes, incomingVertices, incomingRecord) => {
    if (incomingBytes > limits.maximumTileBytes || incomingVertices > limits.maximumTileVertices) {
      return 'terminal-cap';
    }
    const residents = residentRecords();
    const usage = residentUsage();
    const recordAddition = incomingRecord.terrain === null ? 1 : 0;
    const current = recordResource(incomingRecord);
    let nextRecords = residents.length + recordAddition;
    let nextBytes = usage.bytes - current.residentBytes + incomingBytes;
    let nextVertices = usage.vertices - current.vertexCount + incomingVertices;
    const fits = () => nextRecords <= limits.maximumResidentRecords
      && nextBytes <= limits.maximumResidentBytes
      && nextVertices <= limits.maximumResidentVertices;
    if (fits()) return 'fits';
    const pinned = committedKeySet();
    const candidates = residents.filter((record) => (
      record !== incomingRecord
      && record.reservationPins === 0
      && !record.required
      && !pinned.has(record.key)
      && (incomingRecord.required || !record.desired)
    )).sort((left, right) => (
      left.lastAccess - right.lastAccess || left.key.localeCompare(right.key)
    ));
    const evictionPlan = [];
    for (const candidate of candidates) {
      const resource = recordResource(candidate);
      evictionPlan.push(candidate);
      nextRecords -= 1;
      nextBytes -= resource.residentBytes;
      nextVertices -= resource.vertexCount;
      if (fits()) break;
    }
    if (!fits()) return 'deferred-cap';
    for (const candidate of evictionPlan) evict(candidate);
    return 'fits';
  };

  const makeRecord = (tile) => ({
    key: tile.key,
    tile,
    desired: true,
    required: false,
    lastAccess: ++accessSequence,
    terrainState: 'queued',
    roadState: loadRoadTile ? 'unrequested' : 'disabled',
    terrain: null,
    terrainResource: null,
    road: null,
    roadResource: null,
    terrainIdentity: null,
    roadIdentity: null,
    terrainController: null,
    roadController: null,
    terrainRequestId: 0,
    roadRequestId: 0,
    terrainAttempts: 0,
    roadAttempts: 0,
    terrainRetryAt: null,
    roadRetryAt: null,
    terrainFailureTransient: false,
    roadFailureTransient: false,
    reservationPins: 0,
    error: null,
    terrainError: null,
    roadError: null,
    publicByFrame: new WeakMap(),
  });

  const recordPriority = (record, kind) => (
    (record.required ? 0 : 2) + (kind === 'terrain' ? 0 : 1)
  );

  const nextRequest = () => {
    const candidates = [];
    const requiredTerrainPending = [...records.values()].some((record) => (
      record.desired
      && record.required
      && (record.terrainState === 'queued' || record.terrainState === 'loading')
    ));
    for (const record of records.values()) {
      if (!record.desired) continue;
      if (requiredTerrainPending && !record.required) continue;
      if (record.terrainState === 'queued') candidates.push({ record, kind: 'terrain' });
      if (loadRoadTile && record.terrain && record.roadState === 'queued') {
        candidates.push({ record, kind: 'road' });
      }
    }
    candidates.sort((left, right) => (
      recordPriority(left.record, left.kind) - recordPriority(right.record, right.kind)
      || left.record.lastAccess - right.record.lastAccess
      || left.record.key.localeCompare(right.record.key)
    ));
    return candidates[0] ?? null;
  };

  const settleRequest = () => {
    activeRequests -= 1;
    pump();
  };

  const createResourceIdentity = (kind, record) => Object.freeze({
    id: ++resourceSequence,
    kind,
    key: record.key,
  });

  const retryDelay = (attempt) => Math.min(
    retryPolicy.maximumDelayMs,
    retryPolicy.initialDelayMs * (retryPolicy.backoffMultiplier ** Math.max(0, attempt - 1)),
  );

  const isTransientFailure = (error, context) => {
    try {
      return retryPolicy.isTransient(error, Object.freeze(context)) === true;
    } catch {
      return false;
    }
  };

  const failRequest = (record, kind, error, attempt, { cap = false } = {}) => {
    const transient = !cap && isTransientFailure(error, {
      kind,
      tile: record.tile,
      attempt,
      maximumAttempts: retryPolicy.maximumAttempts,
      generation,
    });
    const canRetry = transient
      && attempt < retryPolicy.maximumAttempts
      && record.desired
      && !disposed;
    const retryAt = canRetry ? clockNow() + retryDelay(attempt) : null;
    const state = cap ? 'failed-cap' : canRetry ? 'retry-wait' : 'failed';
    record[`${kind}State`] = state;
    record[`${kind}RetryAt`] = retryAt;
    record[`${kind}FailureTransient`] = transient;
    const summary = errorSummary(error, {
      attempt,
      maximumAttempts: retryPolicy.maximumAttempts,
      transient,
      retryable: canRetry,
      terminal: !canRetry,
      retryAt,
      terminalReason: cap
        ? 'tile-cap'
        : transient && attempt >= retryPolicy.maximumAttempts
          ? 'retry-exhausted'
          : canRetry ? null : 'non-transient',
    });
    record[`${kind}Error`] = summary;
    record.error = summary;
    counters.requestsFailed += 1;
    if (cap) counters.capRejections += 1;
    if (canRetry) counters.retriesScheduled += 1;
    else {
      counters.terminalFailures += 1;
      if (transient) counters.retryExhaustions += 1;
    }
    bumpContentEpoch(record);
  };

  const deferForCapacity = (record, kind, error) => {
    record[`${kind}State`] = 'deferred-cap';
    record[`${kind}RetryAt`] = null;
    record[`${kind}FailureTransient`] = false;
    const summary = errorSummary(error, {
      attempt: record[`${kind}Attempts`],
      maximumAttempts: retryPolicy.maximumAttempts,
      transient: false,
      retryable: true,
      terminal: false,
      retryAt: null,
      terminalReason: 'deferred-residency-cap',
    });
    record[`${kind}Error`] = summary;
    record.error = summary;
    counters.requestsFailed += 1;
    counters.capRejections += 1;
    bumpContentEpoch(record);
  };

  const beginRequest = (record, kind) => {
    const controller = new AbortController();
    const requestId = ++requestSequence;
    const attemptField = `${kind}Attempts`;
    const controllerField = `${kind}Controller`;
    const requestIdField = `${kind}RequestId`;
    const attempt = record[attemptField] + 1;
    record[attemptField] = attempt;
    record[controllerField] = controller;
    record[requestIdField] = requestId;
    record[`${kind}State`] = 'loading';
    record[`${kind}RetryAt`] = null;
    if (attempt > 1) counters.retriesStarted += 1;
    activeRequests += 1;
    counters.requestsStarted += 1;
    counters.maximumConcurrentRequests = Math.max(
      counters.maximumConcurrentRequests,
      activeRequests,
    );
    return Object.freeze({ controller, requestId, attempt });
  };

  const startRoad = (record) => {
    const terrain = record.terrain;
    const terrainIdentity = record.terrainIdentity;
    const request = beginRequest(record, 'road');
    const { controller, requestId, attempt } = request;
    void (async () => {
      let road;
      let ownsRoad = false;
      let outcome = null;
      const finish = (nextOutcome) => {
        if (outcome !== null) return;
        outcome = nextOutcome;
        counters[nextOutcome === 'completed'
          ? 'requestsCompleted'
          : nextOutcome === 'failed' ? 'requestsFailed' : 'requestsCancelled'] += 1;
      };
      try {
        if (controller.signal.aborted) {
          throw controller.signal.reason ?? new DOMException('Aborted', 'AbortError');
        }
        road = await loadRoadTile(record.tile, { signal: controller.signal, terrain });
        ownsRoad = road !== null
          && (typeof road === 'object' || typeof road === 'function');
        const current = record.roadController === controller
          && record.roadRequestId === requestId
          && record.terrain === terrain
          && record.terrainIdentity === terrainIdentity;
        if (disposed || controller.signal.aborted || !current || !record.terrain
          || (!record.desired && !committedKeySet().has(record.key))) {
          if (ownsRoad) {
            disposeResource(road, 'road');
            ownsRoad = false;
            counters.staleResults += 1;
          }
          finish('cancelled');
          return;
        }
        if (road === null) {
          record.road = null;
          record.roadResource = Object.freeze({ residentBytes: 0, vertexCount: 0 });
          record.roadIdentity = createResourceIdentity('road-empty', record);
          record.roadState = 'empty';
          record.roadError = null;
          record.error = null;
          record.lastAccess = ++accessSequence;
          bumpContentEpoch(record);
          finish('completed');
          return;
        }
        const resource = resourceOf(road, `Road tile ${record.key}`);
        const terrainResource = record.terrainResource;
        const combinedBytes = terrainResource.residentBytes + resource.residentBytes;
        const combinedVertices = terrainResource.vertexCount + resource.vertexCount;
        const capacity = evictUntilFits(combinedBytes, combinedVertices, record);
        if (capacity !== 'fits') {
          disposeResource(road, 'road');
          ownsRoad = false;
          const error = Object.assign(
            new RangeError(`Road tile ${record.key} exceeds stream residency caps.`),
            { code: 'ERR_GLOBE_STREAM_ROAD_CAP', retryable: false },
          );
          if (capacity === 'terminal-cap') {
            failRequest(record, 'road', error, attempt, { cap: true });
          } else {
            deferForCapacity(record, 'road', error);
          }
          outcome = 'failed';
          return;
        }
        record.road = road;
        record.roadResource = resource;
        record.roadIdentity = createResourceIdentity('road', record);
        record.roadState = 'resident';
        record.roadError = null;
        record.error = null;
        record.lastAccess = ++accessSequence;
        ownsRoad = false;
        counters.roadBuilds += 1;
        bumpContentEpoch(record);
        finish('completed');
      } catch (error) {
        if (ownsRoad) {
          disposeResource(road, 'road');
          ownsRoad = false;
        }
        const current = record.roadController === controller
          && record.roadRequestId === requestId;
        if (isAbort(error, controller.signal) || !current || disposed) {
          if (current && !disposed) {
            record.roadState = record.terrain && record.desired ? 'queued' : 'unrequested';
            record.roadRetryAt = null;
          }
          finish('cancelled');
          return;
        }
        failRequest(record, 'road', error, attempt);
        outcome = 'failed';
      } finally {
        if (ownsRoad) disposeResource(road, 'road');
        if (record.roadController === controller) record.roadController = null;
        settleRequest();
      }
    })();
  };

  const startTerrain = (record) => {
    const request = beginRequest(record, 'terrain');
    const { controller, requestId, attempt } = request;
    void (async () => {
      let terrain;
      let ownsTerrain = false;
      let outcome = null;
      const finish = (nextOutcome) => {
        if (outcome !== null) return;
        outcome = nextOutcome;
        counters[nextOutcome === 'completed'
          ? 'requestsCompleted'
          : nextOutcome === 'failed' ? 'requestsFailed' : 'requestsCancelled'] += 1;
      };
      try {
        if (controller.signal.aborted) {
          throw controller.signal.reason ?? new DOMException('Aborted', 'AbortError');
        }
        terrain = await loadTerrainTile(record.tile, { signal: controller.signal });
        ownsTerrain = terrain !== null
          && (typeof terrain === 'object' || typeof terrain === 'function');
        const current = record.terrainController === controller
          && record.terrainRequestId === requestId;
        if (disposed || controller.signal.aborted || !current
          || (!record.desired && !committedKeySet().has(record.key))) {
          if (ownsTerrain) {
            disposeResource(terrain, 'terrain');
            ownsTerrain = false;
            counters.staleResults += 1;
          }
          finish('cancelled');
          return;
        }
        assertFrame(terrain?.frame, `Terrain tile ${record.key} frame`);
        const resource = resourceOf(terrain, `Terrain tile ${record.key}`);
        const capacity = evictUntilFits(resource.residentBytes, resource.vertexCount, record);
        if (capacity !== 'fits') {
          disposeResource(terrain, 'terrain');
          ownsTerrain = false;
          const error = Object.assign(
            new RangeError(`Terrain tile ${record.key} exceeds stream residency caps.`),
            { code: 'ERR_GLOBE_STREAM_TERRAIN_CAP', retryable: false },
          );
          if (capacity === 'terminal-cap') {
            failRequest(record, 'terrain', error, attempt, { cap: true });
          } else {
            deferForCapacity(record, 'terrain', error);
          }
          outcome = 'failed';
          return;
        }
        record.terrain = terrain;
        record.terrainResource = resource;
        record.terrainIdentity = createResourceIdentity('terrain', record);
        record.terrainState = 'resident';
        record.terrainError = null;
        record.roadState = loadRoadTile ? 'queued' : 'disabled';
        record.roadAttempts = 0;
        record.roadRetryAt = null;
        record.roadError = null;
        record.error = null;
        record.lastAccess = ++accessSequence;
        ownsTerrain = false;
        counters.terrainBuilds += 1;
        bumpContentEpoch(record);
        finish('completed');
      } catch (error) {
        if (ownsTerrain) {
          disposeResource(terrain, 'terrain');
          ownsTerrain = false;
        }
        const current = record.terrainController === controller
          && record.terrainRequestId === requestId;
        if (isAbort(error, controller.signal) || !current || disposed) {
          if (current && !disposed) {
            record.terrainState = record.desired ? 'queued' : 'absent';
            record.terrainRetryAt = null;
          }
          finish('cancelled');
          return;
        }
        failRequest(record, 'terrain', error, attempt);
        outcome = 'failed';
      } finally {
        if (ownsTerrain) disposeResource(terrain, 'terrain');
        if (record.terrainController === controller) record.terrainController = null;
        if (!record.desired && !record.terrain && !committedKeySet().has(record.key)) {
          records.delete(record.key);
        }
        settleRequest();
      }
    })();
  };

  function pump() {
    if (disposed) return;
    while (activeRequests < limits.maximumConcurrentRequests) {
      const request = nextRequest();
      if (!request) break;
      if (request.kind === 'terrain') startTerrain(request.record);
      else startRoad(request.record);
    }
  }

  const promoteDueRetries = () => {
    const now = clockNow();
    let promoted = 0;
    for (const record of records.values()) {
      if (!record.desired) continue;
      if (record.terrainState === 'retry-wait' && record.terrainRetryAt <= now) {
        record.terrainState = 'queued';
        record.terrainRetryAt = null;
        promoted += 1;
      }
      if (loadRoadTile
        && record.terrain
        && record.roadState === 'retry-wait'
        && record.roadRetryAt <= now) {
        record.roadState = 'queued';
        record.roadRetryAt = null;
        promoted += 1;
      }
    }
    pump();
    return promoted;
  };

  const publicRecord = (record, frame) => {
    const cached = record.publicByFrame.get(frame);
    if (cached?.terrainIdentity === record.terrainIdentity
      && cached?.roadIdentity === record.roadIdentity
      && cached?.roadState === record.roadState) return cached.value;
    const resource = recordResource(record);
    const value = Object.freeze({
      schemaVersion: 'peercompute.motorcycle.globe-surface-chunk.v1',
      key: record.key,
      tile: record.tile,
      terrain: record.terrain,
      road: record.road,
      terrainResourceId: record.terrainIdentity?.id ?? null,
      roadResourceId: record.roadIdentity?.id ?? null,
      roadState: record.roadState,
      terrainFrame: record.terrain.frame,
      coreBbox: record.terrain.coreBbox ?? record.terrain.bbox,
      halo: record.terrain.halo ?? null,
      residentBytes: resource.residentBytes,
      vertexCount: resource.vertexCount,
      transform: createChunkTransform(frame, record.terrain.frame),
    });
    record.publicByFrame.set(frame, {
      terrainIdentity: record.terrainIdentity,
      roadIdentity: record.roadIdentity,
      roadState: record.roadState,
      value,
    });
    return value;
  };

  const status = () => {
    const values = [...records.values()];
    const usage = residentUsage();
    const required = activeKeys.map((key) => records.get(key)).filter(Boolean);
    const requiredTerrainReady = required.filter((record) => record.terrain !== null).length;
    const state = disposed
      ? 'disposed'
      : coverage?.supported === false
        ? 'unsupported'
        : activeKeys.length > 0 && requiredTerrainReady === activeKeys.length
          ? 'ready'
          : centerTile ? 'loading' : 'idle';
    return Object.freeze({
      schemaVersion: `${STREAM_SCHEMA}.telemetry`,
      state,
      generation,
      revision,
      contentEpoch,
      centerTile,
      coverage,
      counts: Object.freeze({
        desired: desiredKeys.length,
        active: activeKeys.length,
        activeTerrainReady: requiredTerrainReady,
        queued: values.filter((record) => record.terrainState === 'queued'
          || record.roadState === 'queued').length,
        retryWaiting: values.filter((record) => record.terrainState === 'retry-wait'
          || record.roadState === 'retry-wait').length,
        inflight: activeRequests,
        resident: residentRecords().length,
        terrainFailed: required.filter((record) => record.terrainState === 'failed'
          || record.terrainState === 'failed-cap').length,
        roadReady: required.filter((record) => record.roadState === 'resident'
          || record.roadState === 'empty').length,
        roadFailed: required.filter((record) => record.roadState === 'failed'
          || record.roadState === 'failed-cap').length,
        roadPending: required.filter((record) => record.roadState === 'queued'
          || record.roadState === 'loading'
          || record.roadState === 'retry-wait'
          || record.roadState === 'deferred-cap'
          || record.roadState === 'unrequested').length,
      }),
      resources: Object.freeze({
        residentBytes: usage.bytes,
        residentVertices: usage.vertices,
      }),
      lifecycle: Object.freeze({ ...counters }),
      committed: Object.freeze({
        revision: committedSnapshot.revision,
        generation: committedSnapshot.generation,
        contentEpoch: committedSnapshot.contentEpoch,
        activeKeys: committedSnapshot.activeKeys,
      }),
      staged: Object.freeze({
        ready: staged?.ready === true,
        generation: staged?.generation ?? null,
        contentEpoch: staged?.contentEpoch ?? null,
      }),
      reservation: Object.freeze({
        active: activeReservation !== null,
        id: activeReservation?.id ?? null,
        generation: activeReservation?.generation ?? null,
        contentEpoch: activeReservation?.contentEpoch ?? null,
      }),
      limits,
      retry: Object.freeze({
        maximumAttempts: retryPolicy.maximumAttempts,
        initialDelayMs: retryPolicy.initialDelayMs,
        maximumDelayMs: retryPolicy.maximumDelayMs,
        backoffMultiplier: retryPolicy.backoffMultiplier,
      }),
    });
  };

  const abortUndesired = () => {
    const pinned = committedKeySet();
    for (const record of [...records.values()]) {
      if (record.desired) continue;
      record.terrainController?.abort();
      record.roadController?.abort();
      if (record.terrainState === 'queued'
        || record.terrainState === 'retry-wait'
        || record.terrainState === 'deferred-cap') {
        record.terrainState = 'absent';
        record.terrainRetryAt = null;
      }
      if (record.roadState === 'queued'
        || record.roadState === 'retry-wait'
        || record.roadState === 'deferred-cap') {
        record.roadState = 'unrequested';
        record.roadRetryAt = null;
      }
      if (!record.terrain && !pinned.has(record.key) && !record.terrainController) {
        records.delete(record.key);
      }
    }
  };

  const update = ({ longitude, latitude } = {}) => {
    if (disposed) throw new Error('Globe surface stream is disposed.');
    const nextCoverage = rideTileCoverage({ longitude, latitude });
    const nextCenterTile = nextCoverage.supported
      ? rideTileAt({ longitude: nextCoverage.longitude, latitude: nextCoverage.latitude })
      : null;
    const selectionUnchanged = (nextCenterTile?.key ?? null) === (centerTile?.key ?? null)
      && nextCoverage.supported === coverage?.supported;
    coverage = nextCoverage;
    if (selectionUnchanged) {
      promoteDueRetries();
      return status();
    }
    generation += 1;
    staged = null;
    const previouslyDesired = new Set(desiredKeys);
    for (const record of records.values()) {
      record.desired = false;
      record.required = false;
    }
    if (!nextCoverage.supported) {
      centerTile = null;
      activeKeys = Object.freeze([]);
      desiredKeys = Object.freeze([]);
      abortUndesired();
      return status();
    }
    centerTile = nextCenterTile;
    const active = rideTileNeighborhood(centerTile, { radius: RIDE_TILE_LIMITS.activeRadius });
    const desired = rideTileNeighborhood(centerTile, { radius: RIDE_TILE_LIMITS.desiredRadius });
    activeKeys = Object.freeze(active.map((tile) => tile.key).sort());
    desiredKeys = Object.freeze(desired.map((tile) => tile.key).sort());
    const activeSet = new Set(activeKeys);
    for (const tile of desired) {
      let record = records.get(tile.key);
      if (!record) {
        record = makeRecord(tile);
        records.set(tile.key, record);
      } else {
        const wasDesired = previouslyDesired.has(tile.key);
        record.desired = true;
        record.lastAccess = ++accessSequence;
        if (record.terrain) {
          if (!wasDesired) counters.terrainReuses += 1;
          if (record.road && !wasDesired) counters.roadReuses += 1;
        } else if (record.terrainState === 'absent'
          || (record.terrainState === 'failed'
            && record.terrainFailureTransient
            && !wasDesired)) {
          record.terrainState = 'queued';
          record.terrainAttempts = 0;
          record.terrainRetryAt = null;
          record.terrainError = null;
          record.error = null;
        }
        if (loadRoadTile && record.terrain && (record.roadState === 'unrequested'
          || (record.roadState === 'failed'
            && record.roadFailureTransient
            && !wasDesired))) {
          record.roadState = 'queued';
          record.roadAttempts = 0;
          record.roadRetryAt = null;
          record.roadError = null;
        }
      }
      record.desired = true;
      record.required = activeSet.has(tile.key);
    }
    abortUndesired();
    promoteDueRetries();
    return status();
  };

  const stage = ({ currentFrame: nextFrame = committedFrame } = {}) => {
    if (disposed) throw new Error('Globe surface stream is disposed.');
    const frame = assertFrame(nextFrame);
    const required = activeKeys.map((key) => records.get(key));
    let reason = null;
    if (coverage?.supported === false) reason = 'unsupported-polar-coverage';
    else if (!centerTile || required.length === 0) reason = 'no-target';
    else if (required.some((record) => record?.terrainState === 'failed-cap')) {
      reason = 'terrain-cap-failure';
    } else if (required.some((record) => record?.terrainState === 'failed')) {
      reason = 'terrain-terminal-failure';
    } else if (required.some((record) => !record?.terrain)) reason = 'terrain-pending';
    if (reason !== null) {
      staged = Object.freeze({
        schemaVersion: STAGE_SCHEMA,
        ready: false,
        reason,
        generation,
        contentEpoch,
        snapshot: null,
      });
      stageMetadata.set(staged, {
        state: 'staged',
        receipt: null,
        entries: Object.freeze([]),
      });
      return staged;
    }
    const sortedRequired = [...required].sort((left, right) => left.key.localeCompare(right.key));
    const publishedRecords = sortedRequired.map((record) => publicRecord(record, frame));
    const roadStates = sortedRequired.map((record) => record.roadState);
    const resourceIdentities = Object.freeze(sortedRequired.map((record) => Object.freeze({
      key: record.key,
      terrainResourceId: record.terrainIdentity.id,
      roadResourceId: record.roadIdentity?.id ?? null,
      roadState: record.roadState,
    })));
    const usage = residentUsage();
    const snapshot = Object.freeze({
      schemaVersion: SNAPSHOT_SCHEMA,
      revision: revision + 1,
      generation,
      contentEpoch,
      centerTile,
      currentFrame: frame,
      records: Object.freeze(publishedRecords),
      activeKeys: Object.freeze(publishedRecords.map((record) => record.key)),
      resourceIdentities,
      roads: Object.freeze({
        ready: roadStates.filter((state) => state === 'resident' || state === 'empty').length,
        failed: roadStates.filter((state) => state === 'failed' || state === 'failed-cap').length,
        pending: roadStates.filter((state) => state === 'queued'
          || state === 'loading' || state === 'retry-wait'
          || state === 'deferred-cap' || state === 'unrequested').length,
        disabled: roadStates.filter((state) => state === 'disabled').length,
      }),
      resident: Object.freeze({
        records: residentRecords().length,
        bytes: usage.bytes,
        vertices: usage.vertices,
      }),
    });
    staged = Object.freeze({
      schemaVersion: STAGE_SCHEMA,
      ready: true,
      reason: null,
      generation,
      contentEpoch,
      resourceIdentities,
      snapshot,
    });
    stageMetadata.set(staged, {
      state: 'staged',
      receipt: null,
      entries: Object.freeze(sortedRequired.map((record) => Object.freeze({
        record,
        key: record.key,
        terrain: record.terrain,
        road: record.road,
        terrainIdentity: record.terrainIdentity,
        roadIdentity: record.roadIdentity,
        roadState: record.roadState,
      }))),
    });
    return staged;
  };

  const rejectedReservation = (candidate, reason) => {
    const stageMeta = candidate && typeof candidate === 'object'
      ? stageMetadata.get(candidate)
      : null;
    if (stageMeta?.receipt) return stageMeta.receipt;
    const receipt = Object.freeze({
      schemaVersion: RESERVATION_SCHEMA,
      id: ++reservationSequence,
      accepted: false,
      reason,
      generation: candidate?.generation ?? null,
      contentEpoch: candidate?.contentEpoch ?? null,
      revision: candidate?.snapshot?.revision ?? null,
      snapshot: candidate?.snapshot ?? null,
    });
    reservationMetadata.set(receipt, {
      state: 'rejected',
      result: committedSnapshot,
      rejectionObserved: false,
      stage: candidate,
      entries: Object.freeze([]),
    });
    if (stageMeta) {
      stageMeta.state = 'rejected';
      stageMeta.receipt = receipt;
    }
    counters.reservationsRejected += 1;
    return receipt;
  };

  const reserve = (candidate = stage()) => {
    if (disposed) throw new Error('Globe surface stream is disposed.');
    const meta = candidate && typeof candidate === 'object'
      ? stageMetadata.get(candidate)
      : null;
    if (meta?.receipt) return meta.receipt;
    if (!meta || candidate?.schemaVersion !== STAGE_SCHEMA) {
      return rejectedReservation(candidate, 'unknown-stage');
    }
    if (candidate.ready !== true) {
      return rejectedReservation(candidate, candidate.reason ?? 'stage-not-ready');
    }
    if (activeReservation !== null) {
      return rejectedReservation(candidate, 'reservation-busy');
    }
    if (candidate.generation !== generation
      || candidate.contentEpoch !== contentEpoch
      || candidate.snapshot?.revision !== revision + 1) {
      return rejectedReservation(candidate, 'stale-stage-epoch');
    }
    const exact = meta.entries.length === activeKeys.length
      && meta.entries.every((entry, index) => {
        const record = records.get(entry.key);
        const identity = candidate.resourceIdentities?.[index];
        return record === entry.record
          && record?.required === true
          && record.terrain === entry.terrain
          && record.road === entry.road
          && record.terrainIdentity === entry.terrainIdentity
          && record.roadIdentity === entry.roadIdentity
          && record.roadState === entry.roadState
          && identity?.key === entry.key
          && identity.terrainResourceId === entry.terrainIdentity?.id
          && identity.roadResourceId === (entry.roadIdentity?.id ?? null)
          && identity.roadState === entry.roadState;
      });
    if (!exact) return rejectedReservation(candidate, 'stale-resource-identity');
    const receipt = Object.freeze({
      schemaVersion: RESERVATION_SCHEMA,
      id: ++reservationSequence,
      accepted: true,
      reason: null,
      generation: candidate.generation,
      contentEpoch: candidate.contentEpoch,
      revision: candidate.snapshot.revision,
      snapshot: candidate.snapshot,
    });
    for (const entry of meta.entries) entry.record.reservationPins += 1;
    reservationMetadata.set(receipt, {
      state: 'reserved',
      result: null,
      rejectionObserved: false,
      stage: candidate,
      entries: meta.entries,
    });
    meta.state = 'reserved';
    meta.receipt = receipt;
    activeReservation = receipt;
    counters.reservationsCreated += 1;
    return receipt;
  };

  const releasePins = (receipt, meta) => {
    for (const entry of meta.entries) {
      entry.record.reservationPins = Math.max(0, entry.record.reservationPins - 1);
    }
    if (activeReservation === receipt) activeReservation = null;
  };

  const release = (receipt) => {
    if (disposed) throw new Error('Globe surface stream is disposed.');
    const meta = receipt && typeof receipt === 'object'
      ? reservationMetadata.get(receipt)
      : null;
    if (!meta || meta.state !== 'reserved') return false;
    meta.state = 'released';
    meta.result = committedSnapshot;
    releasePins(receipt, meta);
    if (meta.stage && typeof meta.stage === 'object') stageResults.set(meta.stage, meta.result);
    counters.reservationsReleased += 1;
    pump();
    return true;
  };

  const commitReservation = (receipt) => {
    const meta = receipt && typeof receipt === 'object'
      ? reservationMetadata.get(receipt)
      : null;
    if (!meta) {
      counters.rejectedCommits += 1;
      return committedSnapshot;
    }
    if (meta.state === 'committed' || meta.state === 'released') return meta.result;
    if (meta.state === 'rejected') {
      if (!meta.rejectionObserved) {
        meta.rejectionObserved = true;
        counters.rejectedCommits += 1;
      }
      if (meta.stage && typeof meta.stage === 'object') stageResults.set(meta.stage, meta.result);
      return meta.result;
    }
    revision += 1;
    committedFrame = receipt.snapshot.currentFrame;
    committedSnapshot = Object.freeze({ ...receipt.snapshot, revision });
    meta.state = 'committed';
    meta.result = committedSnapshot;
    releasePins(receipt, meta);
    if (meta.stage && typeof meta.stage === 'object') stageResults.set(meta.stage, committedSnapshot);
    counters.reservationsCommitted += 1;
    counters.commits += 1;
    if (staged === meta.stage) staged = null;
    for (const record of records.values()) {
      if (!record.desired) continue;
      if (record.terrainState === 'deferred-cap') {
        record.terrainState = 'queued';
        record.terrainAttempts = 0;
        record.terrainError = null;
        record.error = null;
      }
      if (record.terrain && record.roadState === 'deferred-cap') {
        record.roadState = 'queued';
        record.roadAttempts = 0;
        record.roadError = null;
        record.error = null;
      }
    }
    pump();
    return committedSnapshot;
  };

  const commit = (candidate = stage()) => {
    if (disposed) throw new Error('Globe surface stream is disposed.');
    if (candidate && typeof candidate === 'object' && stageResults.has(candidate)) {
      return stageResults.get(candidate);
    }
    if (candidate?.schemaVersion === RESERVATION_SCHEMA) {
      return commitReservation(candidate);
    }
    const receipt = reserve(candidate);
    return commitReservation(receipt);
  };

  return Object.freeze({
    schemaVersion: STREAM_SCHEMA,
    limits,
    update,
    tick() {
      if (disposed) throw new Error('Globe surface stream is disposed.');
      promoteDueRetries();
      return status();
    },
    stage,
    reserve,
    release,
    commit,
    getSnapshot() {
      return committedSnapshot;
    },
    getRecord(tileOrKey) {
      const key = typeof tileOrKey === 'string' ? tileOrKey : normalizeRideTile(tileOrKey).key;
      const record = records.get(key);
      if (!record) return null;
      const resource = recordResource(record);
      return Object.freeze({
        key: record.key,
        tile: record.tile,
        desired: record.desired,
        required: record.required,
        terrainState: record.terrainState,
        roadState: record.roadState,
        terrainResourceId: record.terrainIdentity?.id ?? null,
        roadResourceId: record.roadIdentity?.id ?? null,
        terrain: record.terrain,
        road: record.road,
        terrainAttempts: record.terrainAttempts,
        roadAttempts: record.roadAttempts,
        terrainRetryAt: record.terrainRetryAt,
        roadRetryAt: record.roadRetryAt,
        residentBytes: resource.residentBytes,
        vertexCount: resource.vertexCount,
        error: record.error,
        terrainError: record.terrainError,
        roadError: record.roadError,
      });
    },
    getStatus: status,
    dispose() {
      if (disposed) return;
      disposed = true;
      if (activeReservation !== null) {
        const meta = reservationMetadata.get(activeReservation);
        if (meta?.state === 'reserved') {
          meta.state = 'released';
          meta.result = committedSnapshot;
          releasePins(activeReservation, meta);
          if (meta.stage && typeof meta.stage === 'object') {
            stageResults.set(meta.stage, meta.result);
          }
          counters.reservationsReleased += 1;
        }
      }
      for (const record of records.values()) {
        record.terrainController?.abort();
        record.roadController?.abort();
        disposeRecordResources(record);
      }
      contentEpoch += 1;
      records.clear();
      activeKeys = Object.freeze([]);
      desiredKeys = Object.freeze([]);
      centerTile = null;
      staged = null;
      committedSnapshot = emptySnapshot(committedFrame, contentEpoch);
    },
  });
}
