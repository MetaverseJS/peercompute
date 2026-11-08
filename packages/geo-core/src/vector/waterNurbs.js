export const WATER_NURBS_LIMITS = Object.freeze({
  maximumRingsPerTile: 4_096,
  maximumCurvesPerTile: 8_192,
  maximumSourcePointsPerRing: 65_536,
  maximumSourcePointsPerTile: 65_536,
  maximumSampledVerticesPerTile: 131_072,
  tileEdgeEpsilonPixels: 0.001,
});

export const SHORELINE_LANDLINE_LIMITS = Object.freeze({
  maximumOutputControlPointsPerTile: 262_144,
  maximumOffsetOperationsPerTile: 1_048_576,
  maximumMiterRatio: 4,
  maximumOffsetPixels: 8,
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

function isTileBoundaryPoint(point, size, epsilon) {
  return point[0] <= epsilon
    || point[0] >= size - epsilon
    || point[1] <= epsilon
    || point[1] >= size - epsilon;
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
      fragments: [{
        points: [...points.map((point) => [...point]), [...points[0]]],
        sourceSegmentIndices: points.map((_, index) => index),
        boundaryStart: false,
        boundaryEnd: false,
      }],
      suppressedCount,
      fullyClipped: false,
    };
  }

  const fragments = [];
  let current = [];
  let currentSegmentIndices = [];
  const firstSuppressed = suppressed.findIndex(Boolean);
  const start = (firstSuppressed + 1) % points.length;
  for (let offset = 0; offset < points.length; offset += 1) {
    const index = (start + offset) % points.length;
    const next = (index + 1) % points.length;
    if (suppressed[index]) {
      if (current.length >= 2) {
        fragments.push({
          points: current,
          sourceSegmentIndices: currentSegmentIndices,
          boundaryStart: isTileBoundaryPoint(current[0], size, epsilon),
          boundaryEnd: isTileBoundaryPoint(current.at(-1), size, epsilon),
        });
      }
      current = [];
      currentSegmentIndices = [];
      continue;
    }
    if (current.length === 0) current.push([...points[index]]);
    current.push([...points[next]]);
    currentSegmentIndices.push(index);
  }
  if (current.length >= 2) {
    fragments.push({
      points: current,
      sourceSegmentIndices: currentSegmentIndices,
      boundaryStart: isTileBoundaryPoint(current[0], size, epsilon),
      boundaryEnd: isTileBoundaryPoint(current.at(-1), size, epsilon),
    });
  }
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

  for (let ringIndex = 0; ringIndex < rings.length; ringIndex += 1) {
    const ring = rings[ringIndex];
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
      if (sampledVertexCount + fragment.points.length > maximumSampledVerticesPerTile) {
        const error = new RangeError(`Water shoreline exceeds the ${maximumSampledVerticesPerTile}-sampled-vertex tile cap.`);
        error.code = 'ERR_SHORTBREAD_WATER_NURBS_SAMPLE_CAP';
        throw error;
      }
      sampledVertexCount += fragment.points.length;
      const closed = samePoint(fragment.points[0], fragment.points.at(-1));
      if (closed) closedCurveCount += 1;
      else openCurveCount += 1;
      curves.push(Object.freeze({
        degree: 1,
        rationalWeights: 'uniform-unit',
        knotModel: 'open-clamped-uniform-per-fragment',
        closed,
        sourceRingIndex: ringIndex,
        sourceSegmentIndices: Object.freeze([...fragment.sourceSegmentIndices]),
        boundaryStart: fragment.boundaryStart,
        boundaryEnd: fragment.boundaryEnd,
        controlPointCount: fragment.points.length,
        sampledVertexCount: fragment.points.length,
        points: Object.freeze(fragment.points.map((point) => Object.freeze(point))),
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

function codedRangeError(code, message) {
  const error = new RangeError(message);
  error.code = code;
  return error;
}

function positiveBounded(value, fallback, maximum, label) {
  const resolved = value ?? fallback;
  if (!Number.isFinite(resolved) || resolved <= 0 || resolved > maximum) {
    throw new RangeError(`${label} must be positive and no greater than ${maximum}.`);
  }
  return Number(resolved);
}

function positiveIntegerBounded(value, fallback, maximum, label) {
  const resolved = value ?? fallback;
  if (!Number.isSafeInteger(resolved) || resolved < 1 || resolved > maximum) {
    throw new RangeError(`${label} must be a positive safe integer no greater than ${maximum}.`);
  }
  return resolved;
}

function normalizedLandlineTile(tile) {
  if (!tile || typeof tile !== 'object' || Array.isArray(tile)) {
    throw new TypeError('A Shortbread tile coordinate is required for shoreline companions.');
  }
  const z = Number(tile.z);
  const x = Number(tile.x);
  const y = Number(tile.y);
  const size = Number(tile.size);
  if (![z, x, y].every((value) => Number.isSafeInteger(value) && value >= 0)
    || !Number.isSafeInteger(size) || size < 1
    || x >= 2 ** z || y >= 2 ** z) {
    throw new RangeError('Shoreline companion tile coordinates are outside the tile pyramid.');
  }
  return Object.freeze({ x, y, z, size });
}

function unwrapGlobalPoints(points, tile, referenceX) {
  const period = tile.size * 2 ** tile.z;
  const output = [];
  let previousX = referenceX;
  for (const point of points) {
    if (!finitePoint(point)) throw new TypeError('Finite shoreline companion coordinates are required.');
    let x = tile.x * tile.size + Number(point[0]);
    const y = tile.y * tile.size + Number(point[1]);
    if (previousX !== undefined) {
      while (x - previousX > period / 2) x -= period;
      while (x - previousX < -period / 2) x += period;
    }
    output.push([x, y]);
    previousX = x;
  }
  return output;
}

function signedArea(points) {
  let area = 0;
  for (let index = 0; index < points.length; index += 1) {
    const next = (index + 1) % points.length;
    area += points[index][0] * points[next][1] - points[next][0] * points[index][1];
  }
  return area / 2;
}

function samePointExact(left, right) {
  return left[0] === right[0] && left[1] === right[1];
}

function appendDistinct(points, point) {
  if (points.length === 0 || !samePoint(points.at(-1), point)) points.push(point);
}

function consumeLandlineOperation(budget, count = 1) {
  if (budget.count + count > budget.maximum) {
    throw codedRangeError(
      'ERR_SHORTBREAD_LANDLINE_OPERATION_CAP',
      `Shoreline land-side companion exceeds the ${budget.maximum}-operation tile cap.`,
    );
  }
  budget.count += count;
}

function appendBoundedLandlinePoint(points, point, budget) {
  const before = points.length;
  appendDistinct(points, point);
  if (points.length === before) return;
  budget.count += 1;
  if (budget.count > budget.maximum) {
    throw codedRangeError(
      'ERR_SHORTBREAD_LANDLINE_CONTROL_POINT_CAP',
      `Shoreline land-side companion exceeds the ${budget.maximum}-control-point tile cap.`,
    );
  }
}

function segmentLandNormal(left, right, orientationFactor, operationBudget) {
  consumeLandlineOperation(operationBudget);
  const dx = right[0] - left[0];
  const dy = right[1] - left[1];
  const length = Math.hypot(dx, dy);
  if (!(length > EPSILON)) {
    throw codedRangeError(
      'ERR_SHORTBREAD_LANDLINE_DEGENERATE_SIDE',
      'Shoreline land-side companion contains a zero-length source segment.',
    );
  }
  return [-dy / length * orientationFactor, dx / length * orientationFactor];
}

function offsetJoin(point, previousNormal, nextNormal, distance, maximumMiterRatio, output, stats) {
  if (!(distance > 0)) {
    appendBoundedLandlinePoint(output, [...point], stats.controlPointBudget);
    stats.minimumOffsetPixels = Math.min(stats.minimumOffsetPixels, 0);
    return;
  }
  const sumX = previousNormal[0] + nextNormal[0];
  const sumY = previousNormal[1] + nextNormal[1];
  const sumLength = Math.hypot(sumX, sumY);
  if (sumLength > EPSILON) {
    const miterX = sumX / sumLength;
    const miterY = sumY / sumLength;
    const denominator = miterX * nextNormal[0] + miterY * nextNormal[1];
    if (denominator > EPSILON) {
      const miterLength = distance / denominator;
      if (miterLength <= distance * maximumMiterRatio) {
        appendBoundedLandlinePoint(
          output,
          [point[0] + miterX * miterLength, point[1] + miterY * miterLength],
          stats.controlPointBudget,
        );
        stats.miterJoinCount += 1;
        stats.minimumOffsetPixels = Math.min(stats.minimumOffsetPixels, miterLength);
        stats.maximumOffsetPixels = Math.max(stats.maximumOffsetPixels, miterLength);
        return;
      }
    }
  }
  appendBoundedLandlinePoint(
    output,
    [point[0] + previousNormal[0] * distance, point[1] + previousNormal[1] * distance],
    stats.controlPointBudget,
  );
  appendBoundedLandlinePoint(
    output,
    [point[0] + nextNormal[0] * distance, point[1] + nextNormal[1] * distance],
    stats.controlPointBudget,
  );
  stats.bevelJoinCount += 1;
  stats.minimumOffsetPixels = Math.min(stats.minimumOffsetPixels, distance);
  stats.maximumOffsetPixels = Math.max(stats.maximumOffsetPixels, distance);
}

function wrapCurveNearWorld(points, period) {
  if (points.length === 0) return { points, wrapped: false };
  const center = points.reduce((total, point) => total + point[0], 0) / points.length;
  let shift = 0;
  while (center + shift < 0) shift += period;
  while (center + shift > period) shift -= period;
  if (shift === 0) return { points, wrapped: false };
  return {
    points: points.map(([x, y]) => [x + shift, y]),
    wrapped: true,
  };
}

/**
 * Builds a distinct degree-one NURBS control polygon on the land side of each
 * exact shoreline fragment. Offsets are measured in global Web Mercator tile
 * pixels so adjacent tiles at the same zoom use the same lateral scale.
 */
export function buildLandSideNurbsCompanions(outline, ringRecords, {
  tile,
  offsetPixels = 2,
  maximumMiterRatio = 2,
  maximumOutputControlPoints = SHORELINE_LANDLINE_LIMITS.maximumOutputControlPointsPerTile,
  maximumOperations = SHORELINE_LANDLINE_LIMITS.maximumOffsetOperationsPerTile,
} = {}) {
  if (!outline || !Array.isArray(outline.curves)) {
    throw new TypeError('A water NURBS outline plan is required for shoreline companions.');
  }
  if (!Array.isArray(ringRecords) || ringRecords.length !== outline.sourceRingCount) {
    throw new TypeError('Shoreline companion ring records must match the water outline source rings.');
  }
  const normalizedTile = normalizedLandlineTile(tile);
  const resolvedOffsetPixels = positiveBounded(
    offsetPixels,
    2,
    SHORELINE_LANDLINE_LIMITS.maximumOffsetPixels,
    'offsetPixels',
  );
  const resolvedMaximumMiterRatio = positiveBounded(
    maximumMiterRatio,
    2,
    SHORELINE_LANDLINE_LIMITS.maximumMiterRatio,
    'maximumMiterRatio',
  );
  const controlPointBudget = {
    count: 0,
    maximum: positiveIntegerBounded(
      maximumOutputControlPoints,
      SHORELINE_LANDLINE_LIMITS.maximumOutputControlPointsPerTile,
      SHORELINE_LANDLINE_LIMITS.maximumOutputControlPointsPerTile,
      'maximumOutputControlPoints',
    ),
  };
  const operationBudget = {
    count: 0,
    maximum: positiveIntegerBounded(
      maximumOperations,
      SHORELINE_LANDLINE_LIMITS.maximumOffsetOperationsPerTile,
      SHORELINE_LANDLINE_LIMITS.maximumOffsetOperationsPerTile,
      'maximumOperations',
    ),
  };
  const period = normalizedTile.size * 2 ** normalizedTile.z;
  const curves = [];
  const stats = {
    controlPointBudget,
    miterJoinCount: 0,
    bevelJoinCount: 0,
    seamTaperCount: 0,
    antimeridianWrapCount: 0,
    minimumOffsetPixels: Number.POSITIVE_INFINITY,
    maximumOffsetPixels: 0,
    outerPairCount: 0,
    holePairCount: 0,
  };

  // A source ring can be split into many visible fragments by synthetic tile
  // edges. Resolve its winding once so fragment count cannot multiply an O(n)
  // ring scan, and reserve normalization, unwrap, and signed-area work before
  // doing it.
  const ringContexts = ringRecords.map((record, sourceRingIndex) => {
    if (!record || !Array.isArray(record.points) || !['outer', 'hole'].includes(record.role)
      || typeof record.waterBodyId !== 'string' || record.waterBodyId.length === 0) {
      throw new TypeError('Each shoreline companion ring record needs points, waterBodyId, and outer/hole role.');
    }
    consumeLandlineOperation(operationBudget, record.points.length * 3);
    const normalizedRing = normalizeClosedRing(record.points);
    if (!normalizedRing) {
      throw codedRangeError(
        'ERR_SHORTBREAD_LANDLINE_DEGENERATE_SIDE',
        `Shoreline companion source ring ${sourceRingIndex} is invalid.`,
      );
    }
    const globalRing = unwrapGlobalPoints(normalizedRing, normalizedTile);
    const area = signedArea(globalRing);
    if (!Number.isFinite(area) || Math.abs(area) <= EPSILON) {
      throw codedRangeError(
        'ERR_SHORTBREAD_LANDLINE_DEGENERATE_SIDE',
        `Shoreline companion source ring ${sourceRingIndex} has no stable winding.`,
      );
    }
    return Object.freeze({
      globalRing: Object.freeze(globalRing.map((point) => Object.freeze(point))),
      waterBodyId: record.waterBodyId,
      role: record.role,
      interiorFactor: Math.sign(area),
    });
  });

  for (let curveIndex = 0; curveIndex < outline.curves.length; curveIndex += 1) {
    const sourceCurve = outline.curves[curveIndex];
    const sourceRingIndex = sourceCurve.sourceRingIndex;
    const ringContext = ringContexts[sourceRingIndex];
    if (!ringContext) throw new TypeError(`Shoreline companion source ring ${sourceRingIndex} is unavailable.`);
    // Positive signed area has its ring interior on the left of each directed
    // segment. Outer-ring land is away from that interior; hole/island land is
    // toward it. This remains correct when input winding is reversed.
    const orientationFactor = ringContext.interiorFactor * (ringContext.role === 'hole' ? 1 : -1);
    consumeLandlineOperation(operationBudget, sourceCurve.points.length);
    let sourcePoints = unwrapGlobalPoints(
      sourceCurve.points,
      normalizedTile,
      ringContext.globalRing[0][0],
    );
    const closed = sourceCurve.closed && samePoint(sourcePoints[0], sourcePoints.at(-1));
    if (closed) sourcePoints = sourcePoints.slice(0, -1);
    if (sourcePoints.length < 2) {
      throw codedRangeError(
        'ERR_SHORTBREAD_LANDLINE_DEGENERATE_SIDE',
        `Shoreline companion curve ${curveIndex} has too few source points.`,
      );
    }
    if (!closed && sourcePoints.length === 2 && sourceCurve.boundaryStart && sourceCurve.boundaryEnd) {
      sourcePoints = [
        sourcePoints[0],
        [
          (sourcePoints[0][0] + sourcePoints[1][0]) / 2,
          (sourcePoints[0][1] + sourcePoints[1][1]) / 2,
        ],
        sourcePoints[1],
      ];
    }
    const segmentCount = closed ? sourcePoints.length : sourcePoints.length - 1;
    const normals = [];
    for (let segmentIndex = 0; segmentIndex < segmentCount; segmentIndex += 1) {
      normals.push(segmentLandNormal(
        sourcePoints[segmentIndex],
        sourcePoints[(segmentIndex + 1) % sourcePoints.length],
        orientationFactor,
        operationBudget,
      ));
    }
    const output = [];
    for (let pointIndex = 0; pointIndex < sourcePoints.length; pointIndex += 1) {
      consumeLandlineOperation(operationBudget);
      const point = sourcePoints[pointIndex];
      if (!closed && pointIndex === 0) {
        const distance = sourceCurve.boundaryStart ? 0 : resolvedOffsetPixels;
        appendBoundedLandlinePoint(
          output,
          [point[0] + normals[0][0] * distance, point[1] + normals[0][1] * distance],
          controlPointBudget,
        );
        if (distance === 0) stats.seamTaperCount += 1;
        stats.minimumOffsetPixels = Math.min(stats.minimumOffsetPixels, distance);
        stats.maximumOffsetPixels = Math.max(stats.maximumOffsetPixels, distance);
        continue;
      }
      if (!closed && pointIndex === sourcePoints.length - 1) {
        const distance = sourceCurve.boundaryEnd ? 0 : resolvedOffsetPixels;
        const normal = normals.at(-1);
        appendBoundedLandlinePoint(
          output,
          [point[0] + normal[0] * distance, point[1] + normal[1] * distance],
          controlPointBudget,
        );
        if (distance === 0) stats.seamTaperCount += 1;
        stats.minimumOffsetPixels = Math.min(stats.minimumOffsetPixels, distance);
        stats.maximumOffsetPixels = Math.max(stats.maximumOffsetPixels, distance);
        continue;
      }
      const previousNormal = normals[(pointIndex - 1 + normals.length) % normals.length];
      const nextNormal = normals[pointIndex % normals.length];
      offsetJoin(
        point,
        previousNormal,
        nextNormal,
        resolvedOffsetPixels,
        resolvedMaximumMiterRatio,
        output,
        stats,
      );
    }
    if (closed) appendBoundedLandlinePoint(output, [...output[0]], controlPointBudget);
    if (output.length < 2 || output.every((point, index) => (
      index === 0 || samePointExact(point, output[0])
    ))) {
      throw codedRangeError(
        'ERR_SHORTBREAD_LANDLINE_DEGENERATE_SIDE',
        `Shoreline companion curve ${curveIndex} did not produce distinct geometry.`,
      );
    }
    const wrapped = wrapCurveNearWorld(output, period);
    if (wrapped.wrapped) stats.antimeridianWrapCount += 1;
    const localPoints = wrapped.points.map(([x, y]) => Object.freeze([
      x - normalizedTile.x * normalizedTile.size,
      y - normalizedTile.y * normalizedTile.size,
    ]));
    curves.push(Object.freeze({
      degree: 1,
      rationalWeights: 'uniform-unit',
      knotModel: 'open-clamped-uniform-per-derived-land-side-fragment',
      closed,
      sourceCurveIndex: curveIndex,
      sourceRingIndex,
      waterBodyId: ringContext.waterBodyId,
      ringRole: ringContext.role,
      boundaryStart: sourceCurve.boundaryStart,
      boundaryEnd: sourceCurve.boundaryEnd,
      requestedOffsetPixels: resolvedOffsetPixels,
      controlPointCount: localPoints.length,
      points: Object.freeze(localPoints),
    }));
    if (ringContext.role === 'outer') stats.outerPairCount += 1;
    else stats.holePairCount += 1;
  }

  if (curves.length !== outline.curves.length) {
    throw codedRangeError(
      'ERR_SHORTBREAD_LANDLINE_PAIRING',
      'Every visible blue shoreline must have exactly one land-side companion curve.',
    );
  }
  return Object.freeze({
    schemaVersion: 'peercompute.geo.shoreline-landline.v1',
    geometry: 'distinct-derived-degree-one-nurbs-polyline',
    curveModel: 'NURBS',
    degree: 1,
    topologyPolicy: 'one-land-side-companion-per-visible-shoreline-fragment',
    offsetSpace: 'global-web-mercator-tile-pixels',
    requestedOffsetPixels: resolvedOffsetPixels,
    effectiveMinimumOffsetPixels: Number.isFinite(stats.minimumOffsetPixels)
      ? stats.minimumOffsetPixels
      : 0,
    effectiveMaximumOffsetPixels: stats.maximumOffsetPixels,
    joinModel: 'bounded-miter-with-bevel-fallback',
    maximumMiterRatio: resolvedMaximumMiterRatio,
    curveCount: curves.length,
    pairedCurveCount: curves.length,
    unpairedCurveCount: 0,
    outerPairCount: stats.outerPairCount,
    holePairCount: stats.holePairCount,
    sourceControlPointCount: outline.controlPointCount,
    outputControlPointCount: controlPointBudget.count,
    miterJoinCount: stats.miterJoinCount,
    bevelJoinCount: stats.bevelJoinCount,
    seamTaperCount: stats.seamTaperCount,
    antimeridianWrapCount: stats.antimeridianWrapCount,
    datelineSplitCount: 0,
    offsetOperationCount: operationBudget.count,
    rasterPainted: false,
    glow: false,
    halo: false,
    linePassesPerCurve: 1,
    antimeridianSafe: true,
    capped: false,
    limits: Object.freeze({
      maximumOutputControlPoints: controlPointBudget.maximum,
      maximumOperations: operationBudget.maximum,
      maximumMiterRatio: resolvedMaximumMiterRatio,
      maximumOffsetPixels: SHORELINE_LANDLINE_LIMITS.maximumOffsetPixels,
    }),
    curves: Object.freeze(curves),
  });
}
