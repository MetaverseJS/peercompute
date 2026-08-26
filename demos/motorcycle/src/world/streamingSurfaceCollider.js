const SNAPSHOT_SCHEMA = 'peercompute.motorcycle.globe-surface-snapshot.v1';
const MAXIMUM_SWEEP_SEGMENTS = 8;
const MINIMUM_SWEEP_INTERVAL_METERS = 1e-4;

function finiteNonNegative(value, fallback, label) {
  const resolved = Number(value ?? fallback);
  if (!Number.isFinite(resolved) || resolved < 0) {
    throw new RangeError(`${label} must be finite and non-negative.`);
  }
  return resolved;
}

function tuple3(value, label) {
  if ((!Array.isArray(value) && !ArrayBuffer.isView(value)) || value.length < 3) {
    throw new TypeError(`${label} must contain three components.`);
  }
  const tuple = [Number(value[0]), Number(value[1]), Number(value[2])];
  if (!tuple.every(Number.isFinite)) throw new TypeError(`${label} must be finite.`);
  return tuple;
}

function normalized(vector) {
  const value = tuple3(vector, 'surface normal');
  const length = Math.hypot(...value);
  if (length <= 1e-12) return Object.freeze([0, 1, 0]);
  return Object.freeze(value.map((entry) => entry / length));
}

function dot(left, right) {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

function spherePoint(center, normal, radius) {
  return new Float32Array([
    center[0] - normal[0] * radius,
    center[1] - normal[1] * radius,
    center[2] - normal[2] * radius,
  ]);
}

function streamCandidate(
  record,
  sample,
  center,
  chunkCenter,
  radius,
  kind,
  friction,
  snapshotRevision,
) {
  const groundChunk = [chunkCenter[0], sample.height, chunkCenter[2]];
  const groundCurrent = record.transform.chunkToCurrentPoint(groundChunk);
  const normal = normalized(record.transform.chunkToCurrentVector(sample.normal));
  const centerToGround = [
    center[0] - groundCurrent[0],
    center[1] - groundCurrent[1],
    center[2] - groundCurrent[2],
  ];
  const signedDistance = Math.fround(dot(normal, centerToGround) - radius);
  return {
    key: `stream:${record.key}:${kind}`,
    kind,
    groundHeight: groundCurrent[1],
    signedDistance,
    normal,
    point: spherePoint(center, normal, radius),
    friction,
    sourceClass: 'stream',
    metadata: Object.freeze({
      ...(sample.contactMetadata ?? sample.metadata ?? {}),
      surfaceKind: kind,
      streamTileKey: record.key,
      streamSnapshotRevision: snapshotRevision,
    }),
  };
}

const IDENTITY_FALLBACK_TRANSFORM = Object.freeze({
  currentToFallbackPoint: (point) => [...point],
  fallbackToCurrentPoint: (point) => [...point],
  fallbackToCurrentVector: (vector) => [...vector],
});

function normalizeFallbackTransform(transform) {
  if (transform === null) return null;
  if (!transform
    || typeof transform.currentToFallbackPoint !== 'function'
    || typeof transform.fallbackToCurrentPoint !== 'function'
    || typeof transform.fallbackToCurrentVector !== 'function') {
    throw new TypeError('fallbackTransform must map current/fallback points and fallback vectors.');
  }
  return transform;
}

function fallbackCandidate(sample, center, fallbackCenter, radius, fallbackSurface, transform) {
  if (!sample || sample.unavailable || sample.outside
    || !Number.isFinite(sample.signedDistance)) return null;
  const fallbackNormal = normalized(sample.normal ?? [0, 1, 0]);
  const distanceToGround = sample.signedDistance + radius;
  const fallbackGround = [
    fallbackCenter[0] - fallbackNormal[0] * distanceToGround,
    fallbackCenter[1] - fallbackNormal[1] * distanceToGround,
    fallbackCenter[2] - fallbackNormal[2] * distanceToGround,
  ];
  const ground = tuple3(transform.fallbackToCurrentPoint(fallbackGround), 'fallback ground point');
  const normal = normalized(transform.fallbackToCurrentVector(fallbackNormal));
  const signedDistance = Math.fround(dot(normal, [
    center[0] - ground[0],
    center[1] - ground[1],
    center[2] - ground[2],
  ]) - radius);
  const reportedKind = sample.metadata?.surfaceKind;
  const kind = reportedKind === 'road' || reportedKind === 'osm-road'
    ? 'road'
    : 'terrain';
  return {
    key: `fallback:${fallbackSurface.id}:${kind}`,
    kind,
    groundHeight: ground[1],
    signedDistance,
    normal,
    point: spherePoint(center, normal, radius),
    friction: sample.friction,
    restitution: sample.restitution,
    surfaceVelocity: sample.surfaceVelocity,
    sourceClass: 'fallback',
    metadata: Object.freeze({
      ...(sample.metadata ?? {}),
      fallbackSurfaceId: fallbackSurface.id,
    }),
  };
}

function selectCandidate(candidates) {
  if (candidates.length === 0) return null;
  const priority = (candidate) => {
    if (candidate.kind === 'road') return 3;
    if (candidate.sourceClass === 'stream') return 2;
    return 1;
  };
  return [...candidates].sort((left, right) => (
    priority(right) - priority(left)
    || right.groundHeight - left.groundHeight
    || left.key.localeCompare(right.key)
  ))[0];
}

export function createStreamingSurfaceCollider({
  getSnapshot,
  fallbackSurface = null,
  fallbackTransform,
  id = 'streaming-road-terrain-surface',
  roadFriction = 1.05,
  terrainFriction = 1.05,
  restitution = 0.01,
} = {}) {
  if (typeof getSnapshot !== 'function') throw new TypeError('getSnapshot is required.');
  if (fallbackSurface !== null
    && (typeof fallbackSurface !== 'object'
      || typeof fallbackSurface.sampleSphere !== 'function'
      || typeof fallbackSurface.id !== 'string')) {
    throw new TypeError('fallbackSurface must be one sampleSphere collider or null.');
  }
  if (fallbackSurface === null && fallbackTransform !== undefined && fallbackTransform !== null) {
    throw new TypeError('fallbackTransform requires a fallbackSurface.');
  }
  let activeFallbackTransform = fallbackSurface === null
    ? null
    : fallbackTransform === undefined
      ? IDENTITY_FALLBACK_TRANSFORM
      : normalizeFallbackTransform(fallbackTransform);
  let streamEnabled = true;
  const resolvedRoadFriction = finiteNonNegative(roadFriction, 1.05, 'roadFriction');
  const resolvedTerrainFriction = finiteNonNegative(terrainFriction, 1.05, 'terrainFriction');
  const resolvedRestitution = finiteNonNegative(restitution, 0.01, 'restitution');
  const telemetry = {
    pointQueries: 0,
    sampleQueries: 0,
    sweepQueries: 0,
    sweepSamples: 0,
    snapshotReads: 0,
    unavailableQueries: 0,
    streamRoadHits: 0,
    fallbackRoadHits: 0,
    fallbackTerrainHits: 0,
    streamTerrainHits: 0,
    maximumSweepSegmentsUsed: 0,
    chunkBoundsTests: 0,
    chunkBoundsHits: 0,
    maximumCandidateChunksPerSample: 0,
  };
  const metadata = Object.freeze({
    sourceAuthoritative: true,
    derivedTerrain: false,
    operationalUse: false,
    roadAware: true,
    streaming: true,
    fallbackSurfaceId: fallbackSurface?.id ?? null,
    collisionModel: 'atomic-stream-snapshot-with-single-fallback',
  });

  const sampleWithSnapshot = (snapshot, capturedFallbackTransform, { center, radius }) => {
    const resolvedCenter = tuple3(center, 'sphere center');
    const resolvedRadius = finiteNonNegative(radius, 0, 'sphere radius');
    const candidates = [];
    const chunkCenters = [];
    if (snapshot?.schemaVersion === SNAPSHOT_SCHEMA) {
      for (const record of snapshot.records) {
        const chunkCenter = record.transform.currentToChunkPoint(resolvedCenter);
        telemetry.chunkBoundsTests += 1;
        const bounds = record.terrain?.localBounds;
        const inside = bounds
          && chunkCenter[0] >= bounds.minX - 0.5
          && chunkCenter[0] <= bounds.maxX + 0.5
          && chunkCenter[2] >= bounds.minZ - 0.5
          && chunkCenter[2] <= bounds.maxZ + 0.5;
        if (!inside) continue;
        telemetry.chunkBoundsHits += 1;
        chunkCenters.push({ record, chunkCenter });
        const road = record.road?.sampleLocalSurface?.(chunkCenter[0], chunkCenter[2]) ?? null;
        if (road) {
          candidates.push(streamCandidate(
            record,
            road,
            resolvedCenter,
            chunkCenter,
            resolvedRadius,
            'road',
            resolvedRoadFriction,
            snapshot.revision,
          ));
        }
      }
      telemetry.maximumCandidateChunksPerSample = Math.max(
        telemetry.maximumCandidateChunksPerSample,
        chunkCenters.length,
      );
    }
    if (fallbackSurface && capturedFallbackTransform) {
      const fallbackCenter = tuple3(
        capturedFallbackTransform.currentToFallbackPoint(resolvedCenter),
        'fallback sphere center',
      );
      const fallback = fallbackCandidate(
        fallbackSurface.sampleSphere({ center: fallbackCenter, radius: resolvedRadius }),
        resolvedCenter,
        fallbackCenter,
        resolvedRadius,
        fallbackSurface,
        capturedFallbackTransform,
      );
      if (fallback) candidates.push(fallback);
    }
    if (snapshot?.schemaVersion === SNAPSHOT_SCHEMA
      && !candidates.some((candidate) => candidate.kind === 'road')) {
      for (const { record, chunkCenter } of chunkCenters) {
        const terrain = record.terrain.sampleLocalSurface(chunkCenter[0], chunkCenter[2]);
        if (terrain) {
          candidates.push(streamCandidate(
            record,
            terrain,
            resolvedCenter,
            chunkCenter,
            resolvedRadius,
            'terrain',
            resolvedTerrainFriction,
            snapshot.revision,
          ));
        }
      }
    }
    const selected = selectCandidate(candidates);
    if (!selected) {
      telemetry.unavailableQueries += 1;
      return {
        hit: false,
        unavailable: true,
        signedDistance: Number.POSITIVE_INFINITY,
      };
    }
    if (selected.key.startsWith('stream:') && selected.kind === 'road') telemetry.streamRoadHits += 1;
    else if (selected.key.startsWith('fallback:') && selected.kind === 'road') telemetry.fallbackRoadHits += 1;
    else if (selected.key.startsWith('fallback:')) telemetry.fallbackTerrainHits += 1;
    else telemetry.streamTerrainHits += 1;
    return {
      hit: selected.signedDistance <= 0,
      signedDistance: selected.signedDistance,
      penetration: Math.fround(Math.max(0, -selected.signedDistance)),
      normal: selected.normal,
      point: selected.point,
      surfaceVelocity: selected.surfaceVelocity ?? new Float32Array(3),
      friction: selected.friction,
      restitution: selected.restitution ?? resolvedRestitution,
      groundHeight: selected.groundHeight,
      surfaceKind: selected.metadata?.surfaceKind ?? selected.kind,
      tileKey: selected.metadata?.streamTileKey ?? null,
      snapshotRevision: selected.metadata?.streamSnapshotRevision ?? null,
      metadata: selected.metadata,
    };
  };

  return Object.freeze({
    id,
    type: 'heightfield',
    metadata,
    sampleSphere(query) {
      telemetry.sampleQueries += 1;
      telemetry.snapshotReads += 1;
      return sampleWithSnapshot(streamEnabled ? getSnapshot() : null, activeFallbackTransform, query);
    },
    samplePoint(position) {
      telemetry.pointQueries += 1;
      telemetry.snapshotReads += 1;
      const snapshot = streamEnabled ? getSnapshot() : null;
      const sample = sampleWithSnapshot(snapshot, activeFallbackTransform, {
        center: tuple3(position, 'sample point'),
        radius: 0,
      });
      if (sample.unavailable || !Number.isFinite(sample.groundHeight)) {
        return Object.freeze({
          available: false,
          height: null,
          normal: null,
          surfaceKind: null,
          tileKey: null,
          snapshotRevision: snapshot?.revision ?? null,
        });
      }
      return Object.freeze({
        available: true,
        height: sample.groundHeight,
        normal: sample.normal,
        surfaceKind: sample.surfaceKind,
        tileKey: sample.tileKey,
        snapshotRevision: sample.snapshotRevision ?? snapshot?.revision ?? null,
        metadata: sample.metadata,
      });
    },
    sweepSphere({ from, to, radius }) {
      telemetry.sweepQueries += 1;
      telemetry.snapshotReads += 1;
      const snapshot = streamEnabled ? getSnapshot() : null;
      const capturedFallbackTransform = activeFallbackTransform;
      const start = tuple3(from, 'sweep from');
      const end = tuple3(to, 'sweep to');
      const resolvedRadius = finiteNonNegative(radius, 0, 'sweep radius');
      const distance = Math.hypot(
        end[0] - start[0],
        end[1] - start[1],
        end[2] - start[2],
      );
      const steps = Math.min(MAXIMUM_SWEEP_SEGMENTS, Math.max(1, Math.ceil(
        distance / Math.max(resolvedRadius * 0.5, MINIMUM_SWEEP_INTERVAL_METERS),
      )));
      telemetry.maximumSweepSegmentsUsed = Math.max(telemetry.maximumSweepSegmentsUsed, steps);
      let lastSample = null;
      for (let index = 1; index <= steps; index += 1) {
        const alpha = index / steps;
        lastSample = sampleWithSnapshot(snapshot, capturedFallbackTransform, {
          center: [
            start[0] + (end[0] - start[0]) * alpha,
            start[1] + (end[1] - start[1]) * alpha,
            start[2] + (end[2] - start[2]) * alpha,
          ],
          radius: resolvedRadius,
        });
        telemetry.sweepSamples += 1;
        if (lastSample.hit) return { ...lastSample, swept: true, toi: Math.fround(alpha) };
      }
      return lastSample ?? {
        hit: false,
        unavailable: true,
        signedDistance: Number.POSITIVE_INFINITY,
      };
    },
    setFallbackTransform(transform) {
      if (fallbackSurface === null) {
        if (transform !== null) throw new TypeError('This collider has no fallback surface.');
        return false;
      }
      activeFallbackTransform = normalizeFallbackTransform(transform);
      return activeFallbackTransform !== null;
    },
    setStreamEnabled(enabled) {
      streamEnabled = Boolean(enabled);
      return streamEnabled;
    },
    getTelemetry() {
      return Object.freeze({
        schemaVersion: 'peercompute.motorcycle.streaming-surface-collider.telemetry.v1',
        id,
        ...telemetry,
        maximumSweepSegments: MAXIMUM_SWEEP_SEGMENTS,
        sweepIntervalRadiusFraction: 0.5,
        fallbackSurfaceId: fallbackSurface?.id ?? null,
        fallbackEnabled: activeFallbackTransform !== null,
        streamEnabled,
      });
    },
  });
}
