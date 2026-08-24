export const WATER_NURBS_LIMITS = Object.freeze({
  maximumRingsPerTile: 4_096,
  maximumCurvesPerTile: 8_192,
  maximumSourcePointsPerRing: 65_536,
  maximumSourcePointsPerTile: 65_536,
  maximumSampledVerticesPerTile: 131_072,
  tileEdgeEpsilonPixels: 0.001,
});

const EPSILON = 1e-9;

function positiveInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new RangeError(`${label} must be a positive safe integer.`);
  }
  return value;
}

function finitePoint(point) {
  return Array.isArray(point)
    && point.length >= 2
    && Number.isFinite(point[0])
    && Number.isFinite(point[1]);
}

function samePoint(left, right) {
  return Math.abs(left[0] - right[0]) <= EPSILON
    && Math.abs(left[1] - right[1]) <= EPSILON;
}

function normalizeClosedRing(ring) {
  if (!Array.isArray(ring)) return null;
  const points = [];
  for (const point of ring) {
    if (!finitePoint(point)) return null;
    const normalized = [Number(point[0]), Number(point[1])];
    if (points.length === 0 || !samePoint(points.at(-1), normalized)) points.push(normalized);
  }
  if (points.length > 1 && samePoint(points[0], points.at(-1))) points.pop();
  return points.length >= 3 ? points : null;
}

function isSyntheticTileBoundarySegment(left, right, size, epsilon) {
  return (left[0] <= epsilon && right[0] <= epsilon)
    || (left[0] >= size - epsilon && right[0] >= size - epsilon)
    || (left[1] <= epsilon && right[1] <= epsilon)
    || (left[1] >= size - epsilon && right[1] >= size - epsilon);
}

function splitExactShorelineFragments(points, size, epsilon) {
  const suppressed = points.map((point, index) => isSyntheticTileBoundarySegment(
    point,
    points[(index + 1) % points.length],
    size,
    epsilon,
  ));
  const suppressedCount = suppressed.filter(Boolean).length;
  if (suppressedCount === 0) {
    return {
      fragments: [[...points.map((point) => [...point]), [...points[0]]]],
      suppressedCount,
      fullyClipped: false,
    };
  }

  const fragments = [];
  let current = [];
  const firstSuppressed = suppressed.findIndex(Boolean);
  const start = (firstSuppressed + 1) % points.length;
  for (let offset = 0; offset < points.length; offset += 1) {
    const index = (start + offset) % points.length;
    const next = (index + 1) % points.length;
    if (suppressed[index]) {
      if (current.length >= 2) fragments.push(current);
      current = [];
      continue;
    }
    if (current.length === 0) current.push([...points[index]]);
    current.push([...points[next]]);
  }
  if (current.length >= 2) fragments.push(current);
  return { fragments, suppressedCount, fullyClipped: fragments.length === 0 };
}

export function buildWaterNurbsOutlines(rings, {
  tileSize,
  maximumRingsPerTile = WATER_NURBS_LIMITS.maximumRingsPerTile,
  maximumCurvesPerTile = WATER_NURBS_LIMITS.maximumCurvesPerTile,
  maximumSourcePointsPerRing = WATER_NURBS_LIMITS.maximumSourcePointsPerRing,
  maximumSourcePointsPerTile = WATER_NURBS_LIMITS.maximumSourcePointsPerTile,
  maximumSampledVerticesPerTile = WATER_NURBS_LIMITS.maximumSampledVerticesPerTile,
  tileEdgeEpsilonPixels = WATER_NURBS_LIMITS.tileEdgeEpsilonPixels,
} = {}) {
  if (!Array.isArray(rings)) throw new TypeError('Water rings must be an array.');
  if (!Number.isFinite(tileSize) || tileSize <= 0) throw new RangeError('tileSize must be positive.');
  positiveInteger(maximumRingsPerTile, 'maximumRingsPerTile');
  positiveInteger(maximumCurvesPerTile, 'maximumCurvesPerTile');
  positiveInteger(maximumSourcePointsPerRing, 'maximumSourcePointsPerRing');
  positiveInteger(maximumSourcePointsPerTile, 'maximumSourcePointsPerTile');
  positiveInteger(maximumSampledVerticesPerTile, 'maximumSampledVerticesPerTile');
  if (!Number.isFinite(tileEdgeEpsilonPixels) || tileEdgeEpsilonPixels < 0) {
    throw new RangeError('tileEdgeEpsilonPixels must be non-negative.');
  }
  if (rings.length > maximumRingsPerTile) {
    const error = new RangeError(`Water shoreline exceeds the ${maximumRingsPerTile}-ring tile cap.`);
    error.code = 'ERR_SHORTBREAD_WATER_NURBS_RING_CAP';
    throw error;
  }

  const curves = [];
  let validRingCount = 0;
  let invalidRingCount = 0;
  let fullyClippedRingCount = 0;
  let sourceControlPointCount = 0;
  let sampledVertexCount = 0;
  let suppressedBoundarySegmentCount = 0;
  let openCurveCount = 0;
  let closedCurveCount = 0;

  for (const ring of rings) {
    const points = normalizeClosedRing(ring);
    if (!points) {
      invalidRingCount += 1;
      continue;
    }
    validRingCount += 1;
    if (points.length > maximumSourcePointsPerRing) {
      const error = new RangeError(`Water ring exceeds the ${maximumSourcePointsPerRing}-source-point cap.`);
      error.code = 'ERR_SHORTBREAD_WATER_NURBS_RING_POINT_CAP';
      throw error;
    }
    if (sourceControlPointCount + points.length > maximumSourcePointsPerTile) {
      const error = new RangeError(`Water shoreline exceeds the ${maximumSourcePointsPerTile}-source-point tile cap.`);
      error.code = 'ERR_SHORTBREAD_WATER_NURBS_CONTROL_CAP';
      throw error;
    }
    sourceControlPointCount += points.length;
    const split = splitExactShorelineFragments(points, tileSize, tileEdgeEpsilonPixels);
    suppressedBoundarySegmentCount += split.suppressedCount;
    if (split.fullyClipped) fullyClippedRingCount += 1;
    for (const fragment of split.fragments) {
      if (curves.length >= maximumCurvesPerTile) {
        const error = new RangeError(`Water shoreline exceeds the ${maximumCurvesPerTile}-curve tile cap.`);
        error.code = 'ERR_SHORTBREAD_WATER_NURBS_CURVE_CAP';
        throw error;
      }
      if (sampledVertexCount + fragment.length > maximumSampledVerticesPerTile) {
        const error = new RangeError(`Water shoreline exceeds the ${maximumSampledVerticesPerTile}-sampled-vertex tile cap.`);
        error.code = 'ERR_SHORTBREAD_WATER_NURBS_SAMPLE_CAP';
        throw error;
      }
      sampledVertexCount += fragment.length;
      const closed = samePoint(fragment[0], fragment.at(-1));
      if (closed) closedCurveCount += 1;
      else openCurveCount += 1;
      curves.push(Object.freeze({
        degree: 1,
        rationalWeights: 'uniform-unit',
        knotModel: 'open-clamped-uniform-per-fragment',
        closed,
        controlPointCount: fragment.length,
        sampledVertexCount: fragment.length,
        points: Object.freeze(fragment.map((point) => Object.freeze(point))),
      }));
    }
  }

  return Object.freeze({
    schemaVersion: 'peercompute.geo.water-nurbs-outlines.v1',
    curveModel: 'NURBS',
    degree: 1,
    knotModel: 'open-clamped-uniform-per-fragment',
    topologyPolicy: 'exact-degree-one-nurbs-polyline',
    maximumSourceDeviationPixels: 0,
    boundaryModel: 'exact-source-water-boundary-terrain-draped',
    elevationModel: 'source-elevation-not-published',
    sourceRingCount: rings.length,
    validRingCount,
    invalidRingCount,
    fullyClippedRingCount,
    curveCount: curves.length,
    openCurveCount,
    closedCurveCount,
    sourceControlPointCount,
    controlPointCount: sampledVertexCount,
    sampledVertexCount,
    suppressedBoundarySegmentCount,
    omittedSourcePointCount: 0,
    capped: false,
    limits: Object.freeze({
      maximumRingsPerTile,
      maximumCurvesPerTile,
      maximumSourcePointsPerRing,
      maximumSourcePointsPerTile,
      maximumSampledVerticesPerTile,
      tileEdgeEpsilonPixels,
    }),
    curves: Object.freeze(curves),
  });
}
