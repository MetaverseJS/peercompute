import { MOTORCYCLE_ROAD_SURFACE_SCHEMA } from './roadSurface.js';

const MAXIMUM_SWEEP_SEGMENTS = 8;
const MINIMUM_SWEEP_INTERVAL_METERS = 1e-4;

function finiteVector(value, label) {
  if ((!Array.isArray(value) && !ArrayBuffer.isView(value)) || value.length < 3) {
    throw new TypeError(`${label} must contain three components.`);
  }
  const result = Array.from(value).slice(0, 3).map(Number);
  if (!result.every(Number.isFinite)) throw new TypeError(`${label} must be finite.`);
  return result;
}

function surfacePoint(center, normal, radius) {
  return new Float32Array([
    center[0] - normal[0] * radius,
    center[1] - normal[1] * radius,
    center[2] - normal[2] * radius,
  ]);
}

export function createRoadTerrainSurface(terrain, {
  id = 'real-terrain-surface',
  roadSurface = null,
  friction = 1.05,
  roadFriction = friction,
  terrainFriction = friction,
  restitution = 0.01,
} = {}) {
  if (terrain?.schemaVersion !== 'peercompute.geo.local-terrain-grid.v1') {
    throw new TypeError('A canonical local terrain grid is required.');
  }
  if (roadSurface !== null && roadSurface?.schemaVersion !== MOTORCYCLE_ROAD_SURFACE_SCHEMA) {
    throw new TypeError('roadSurface must be a canonical terrain-draped road surface.');
  }
  for (const [label, value] of [
    ['friction', friction],
    ['roadFriction', roadFriction],
    ['terrainFriction', terrainFriction],
    ['restitution', restitution],
  ]) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`${label} must be finite and non-negative.`);
    }
  }
  const originOffset = [0, 0, 0];
  let sampleQueries = 0;
  let sweepQueries = 0;
  let sweepSampleCount = 0;
  let endpointOnlySweepCount = 0;
  let adaptiveSweepCount = 0;
  let maximumSweepSegmentsUsed = 0;
  let roadHits = 0;
  let terrainHits = 0;
  let unavailableQueries = 0;
  const metadata = Object.freeze({
    sourceId: terrain.source.id,
    sourceAuthoritative: terrain.source.authoritative,
    derivedTerrain: terrain.source.derived,
    operationalUse: false,
    originRebasing: true,
    roadAware: Boolean(roadSurface),
    roadSurfaceSchema: roadSurface?.schemaVersion ?? null,
    collisionModel: 'single-composite-static-heightfield',
  });
  const terrainContactMetadata = Object.freeze({
    surfaceKind: 'terrain',
    roadSegmentId: null,
    osmWayId: null,
    roadCategory: null,
    roadTriangleId: null,
    roadDeckClearanceMeters: 0,
    roadSourceAuthoritative: false,
    roadNavigationGrade: false,
  });

  const resolveSurface = (x, z) => {
    const canonicalX = x + originOffset[0];
    const canonicalZ = z + originOffset[2];
    const road = roadSurface?.sampleLocalSurface(canonicalX, canonicalZ) ?? null;
    if (road) {
      roadHits += 1;
      return {
        height: road.height - originOffset[1],
        normal: road.normal,
        friction: roadFriction,
        metadata: road.contactMetadata,
      };
    }
    const terrainSample = terrain.sampleLocalSurface(canonicalX, canonicalZ);
    if (!terrainSample) {
      unavailableQueries += 1;
      return null;
    }
    terrainHits += 1;
    return {
      height: terrainSample.height - originOffset[1],
      normal: terrainSample.normal,
      friction: terrainFriction,
      metadata: terrainContactMetadata,
    };
  };

  const sampleSphereInternal = ({ center, radius }) => {
    sampleQueries += 1;
    const sphereCenter = center;
    const sphereRadius = radius;
    const surface = resolveSurface(sphereCenter[0], sphereCenter[2]);
    if (!surface) {
      return {
        hit: false,
        unavailable: true,
        signedDistance: Number.POSITIVE_INFINITY,
      };
    }
    const normal = surface.normal;
    const signedDistance = Math.fround(
      normal[1] * (sphereCenter[1] - surface.height) - sphereRadius,
    );
    return {
      hit: signedDistance <= 0,
      signedDistance,
      penetration: Math.fround(Math.max(0, -signedDistance)),
      normal,
      point: surfacePoint(sphereCenter, normal, sphereRadius),
      surfaceVelocity: new Float32Array(3),
      friction: surface.friction,
      restitution,
      metadata: surface.metadata,
    };
  };

  return Object.freeze({
    id,
    type: 'heightfield',
    metadata,
    sampleSphere: sampleSphereInternal,
    sweepSphere({ from, to, radius }) {
      sweepQueries += 1;
      const start = from;
      const end = to;
      const distance = Math.hypot(
        end[0] - start[0],
        end[1] - start[1],
        end[2] - start[2],
      );
      const steps = Math.min(MAXIMUM_SWEEP_SEGMENTS, Math.max(1, Math.ceil(
        distance / Math.max(radius * 0.5, MINIMUM_SWEEP_INTERVAL_METERS),
      )));
      maximumSweepSegmentsUsed = Math.max(maximumSweepSegmentsUsed, steps);
      if (steps === 1) endpointOnlySweepCount += 1;
      else adaptiveSweepCount += 1;
      let lastSample = null;
      for (let index = 1; index <= steps; index += 1) {
        const alpha = index / steps;
        const center = [
          start[0] + (end[0] - start[0]) * alpha,
          start[1] + (end[1] - start[1]) * alpha,
          start[2] + (end[2] - start[2]) * alpha,
        ];
        const sample = sampleSphereInternal({ center, radius });
        sweepSampleCount += 1;
        lastSample = sample;
        if (sample.hit) {
          if (steps === 1) return sample;
          return { ...sample, swept: true, toi: Math.fround(alpha) };
        }
      }
      // Preserve the endpoint distance so the world can make its precontact
      // decision without issuing the same heightfield query a second time.
      return lastSample ?? {
        hit: false,
        unavailable: true,
        signedDistance: Number.POSITIVE_INFINITY,
      };
    },
    shiftOrigin(shift) {
      const next = finiteVector(shift, 'Terrain origin shift');
      for (let index = 0; index < 3; index += 1) originOffset[index] += next[index];
      return Object.freeze([...originOffset]);
    },
    getOriginOffset() {
      return Object.freeze([...originOffset]);
    },
    getTelemetry() {
      return Object.freeze({
        schemaVersion: 'peercompute.motorcycle.composite-road-terrain-collider.telemetry.v1',
        id,
        roadAware: Boolean(roadSurface),
        sampleQueries,
        sweepQueries,
        sweepSampleCount,
        endpointOnlySweepCount,
        adaptiveSweepCount,
        maximumSweepSegmentsUsed,
        maximumSweepSegments: MAXIMUM_SWEEP_SEGMENTS,
        sweepIntervalRadiusFraction: 0.5,
        roadHits,
        terrainHits,
        unavailableQueries,
        originOffset: Object.freeze([...originOffset]),
        roadSurface: roadSurface?.getTelemetry() ?? null,
      });
    },
  });
}
