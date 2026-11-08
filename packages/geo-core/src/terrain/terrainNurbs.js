export const TERRAIN_NURBS_LIMITS = Object.freeze({
  maximumGridSamples: 262_144,
  maximumContourLevelsPerTile: 96,
  maximumPathsPerTile: 8_192,
  maximumSegmentsPerTile: 65_536,
  maximumControlPointsPerTile: 131_072,
  maximumAdaptationPasses: 12,
});

const CAP_ERROR_CODES = Object.freeze({
  contourLevels: 'ERR_TERRAIN_NURBS_LEVEL_CAP',
  paths: 'ERR_TERRAIN_NURBS_PATH_CAP',
  segments: 'ERR_TERRAIN_NURBS_SEGMENT_CAP',
  controlPoints: 'ERR_TERRAIN_NURBS_CONTROL_POINT_CAP',
});

function positiveSafeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new RangeError(`${label} must be a positive safe integer.`);
  }
  return value;
}

function nonNegativeSafeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${label} must be a non-negative safe integer.`);
  }
  return value;
}

function finitePositive(value, label) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be finite and positive.`);
  }
  return value;
}

function validateHeightGrid(heights, width, height, maximumGridSamples) {
  positiveSafeInteger(width, 'width');
  positiveSafeInteger(height, 'height');
  if (width < 2 || height < 2) {
    throw new RangeError('Terrain contour grids must be at least 2 by 2 samples.');
  }
  if (!Array.isArray(heights) && !ArrayBuffer.isView(heights)) {
    throw new TypeError('Terrain heights must be an array or typed array.');
  }
  const sampleCount = width * height;
  if (!Number.isSafeInteger(sampleCount) || sampleCount > maximumGridSamples) {
    const error = new RangeError(`Terrain contour grid exceeds the ${maximumGridSamples}-sample cap.`);
    error.code = 'ERR_TERRAIN_NURBS_GRID_CAP';
    throw error;
  }
  if (heights.length !== sampleCount) {
    throw new RangeError(`Terrain contour grid must contain exactly ${sampleCount} height samples.`);
  }

  let minimum = Number.POSITIVE_INFINITY;
  let maximum = Number.NEGATIVE_INFINITY;
  for (let index = 0; index < heights.length; index += 1) {
    const value = heights[index];
    if (!Number.isFinite(value)) {
      throw new RangeError(`Terrain height sample ${index} must be finite.`);
    }
    minimum = Math.min(minimum, value);
    maximum = Math.max(maximum, value);
  }
  return { minimum, maximum, sampleCount };
}

function buildContourLevels(minimum, maximum, spacing, maximumLevels) {
  if (minimum === maximum) return { levels: [], count: 0, exceeded: false };
  const firstIndex = Math.ceil(minimum / spacing);
  const lastIndex = Math.floor(maximum / spacing);
  const count = lastIndex - firstIndex + 1;
  if (!Number.isFinite(firstIndex) || !Number.isFinite(lastIndex) || !Number.isFinite(count)) {
    return { levels: null, count: Number.POSITIVE_INFINITY, exceeded: true };
  }
  if (count <= 0) return { levels: [], count: 0, exceeded: false };
  if (count > maximumLevels) return { levels: null, count, exceeded: true };

  const levels = [];
  for (let offset = 0; offset < count; offset += 1) {
    const level = (firstIndex + offset) * spacing;
    if (!Number.isFinite(level)) {
      return { levels: null, count: Number.POSITIVE_INFINITY, exceeded: true };
    }
    const normalized = Object.is(level, -0) ? 0 : level;
    if (levels.length === 0 || normalized !== levels.at(-1)) levels.push(normalized);
  }
  return { levels, count: levels.length, exceeded: false };
}

function nextLevelBoundedSpacing(spacing, levelCount, minimum, maximum, maximumLevels) {
  if (!Number.isFinite(levelCount)) {
    const magnitude = Math.max(Math.abs(minimum), Math.abs(maximum), spacing);
    return magnitude > spacing && Number.isFinite(magnitude) ? magnitude : spacing * 2;
  }
  let factor = 2;
  factor = Math.max(factor, Math.ceil(levelCount / maximumLevels));
  let next = spacing * factor;
  if (!Number.isFinite(next) || next <= spacing) {
    const magnitude = Math.max(Math.abs(minimum), Math.abs(maximum), spacing);
    next = magnitude > spacing && Number.isFinite(magnitude) ? magnitude : spacing * 2;
  }
  return next;
}

function lowerBound(values, target) {
  let low = 0;
  let high = values.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (values[middle] < target) low = middle + 1;
    else high = middle;
  }
  return low;
}

function upperBound(values, target) {
  let low = 0;
  let high = values.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (values[middle] <= target) low = middle + 1;
    else high = middle;
  }
  return low;
}

function makeVertex(row, column, width, heights) {
  const index = row * width + column;
  return { row, column, index, height: heights[index] };
}

function intersectionForEdge(left, right, elevationMeters, nodes) {
  const leftAtOrBelow = left.height <= elevationMeters;
  const rightAtOrBelow = right.height <= elevationMeters;
  if (leftAtOrBelow === rightAtOrBelow) return null;

  const denominator = right.height - left.height;
  const t = (elevationMeters - left.height) / denominator;
  let key;
  let gridRow;
  let gridColumn;
  if (t === 0) {
    key = `v:${left.index}`;
    gridRow = left.row;
    gridColumn = left.column;
  } else if (t === 1) {
    key = `v:${right.index}`;
    gridRow = right.row;
    gridColumn = right.column;
  } else {
    const lowIndex = Math.min(left.index, right.index);
    const highIndex = Math.max(left.index, right.index);
    key = `e:${lowIndex}:${highIndex}`;
    gridRow = left.row + (right.row - left.row) * t;
    gridColumn = left.column + (right.column - left.column) * t;
  }

  let node = nodes.get(key);
  if (!node) {
    node = {
      key,
      point: { gridRow, gridColumn, sourceElevationMeters: elevationMeters },
      edges: [],
    };
    nodes.set(key, node);
  }
  return node;
}

function addTriangleSegment(state, triangle, elevationMeters, remainingSegments) {
  const intersections = [];
  const edges = [[0, 1], [1, 2], [2, 0]];
  for (const [leftIndex, rightIndex] of edges) {
    const intersection = intersectionForEdge(
      triangle[leftIndex],
      triangle[rightIndex],
      elevationMeters,
      state.nodes,
    );
    if (intersection) intersections.push(intersection);
  }
  if (intersections.length !== 2 || intersections[0].key === intersections[1].key) return null;

  const [left, right] = intersections;
  const key = left.key < right.key
    ? `${left.key}|${right.key}`
    : `${right.key}|${left.key}`;
  if (state.segmentKeys.has(key)) return null;
  if (remainingSegments <= 0) return 'segments';

  const edge = { key, left: left.key, right: right.key, used: false };
  const edgeIndex = state.edges.length;
  state.segmentKeys.add(key);
  state.edges.push(edge);
  left.edges.push(edgeIndex);
  right.edges.push(edgeIndex);
  return null;
}

function otherNodeKey(edge, nodeKey) {
  return edge.left === nodeKey ? edge.right : edge.left;
}

function compareKeys(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function tracePath(state, startKey, firstEdgeIndex) {
  const nodeKeys = [startKey];
  let currentKey = startKey;
  let edgeIndex = firstEdgeIndex;

  while (edgeIndex !== undefined) {
    const edge = state.edges[edgeIndex];
    if (edge.used) break;
    edge.used = true;
    const nextKey = otherNodeKey(edge, currentKey);
    nodeKeys.push(nextKey);
    if (nextKey === startKey) break;

    const nextNode = state.nodes.get(nextKey);
    if (nextNode.edges.length !== 2) break;
    edgeIndex = nextNode.edges.find((candidate) => !state.edges[candidate].used);
    currentKey = nextKey;
  }
  return nodeKeys;
}

function pathFromNodeKeys(state, nodeKeys, elevationMeters) {
  const points = Object.freeze(nodeKeys.map((key) => {
    const point = state.nodes.get(key).point;
    return Object.freeze({ ...point });
  }));
  return Object.freeze({
    degree: 1,
    rationalWeights: 'uniform-unit',
    knotModel: 'open-clamped-uniform',
    elevationMeters,
    classification: elevationMeters > 0 ? 'above-zero' : 'at-or-below-zero',
    closed: nodeKeys.length > 2 && nodeKeys[0] === nodeKeys.at(-1),
    controlPointCount: points.length,
    segmentCount: points.length - 1,
    points,
  });
}

function traceLevelPaths(state, elevationMeters, remainingPaths, remainingControlPoints) {
  for (const node of state.nodes.values()) {
    node.edges.sort((leftIndex, rightIndex) => {
      const left = otherNodeKey(state.edges[leftIndex], node.key);
      const right = otherNodeKey(state.edges[rightIndex], node.key);
      return compareKeys(left, right);
    });
  }

  const paths = [];
  let controlPointCount = 0;
  const endpointKeys = [...state.nodes.values()]
    .filter((node) => node.edges.length !== 2)
    .map((node) => node.key)
    .sort();
  const appendPath = (nodeKeys) => {
    if (nodeKeys.length < 2) return null;
    if (paths.length >= remainingPaths) return 'paths';
    if (controlPointCount + nodeKeys.length > remainingControlPoints) return 'controlPoints';
    const path = pathFromNodeKeys(state, nodeKeys, elevationMeters);
    paths.push(path);
    controlPointCount += path.controlPointCount;
    return null;
  };

  for (const key of endpointKeys) {
    const node = state.nodes.get(key);
    for (const edgeIndex of node.edges) {
      if (state.edges[edgeIndex].used) continue;
      const exceeded = appendPath(tracePath(state, key, edgeIndex));
      if (exceeded) return { exceeded };
    }
  }

  const remainingEdges = state.edges
    .map((edge, index) => ({ edge, index }))
    .filter(({ edge }) => !edge.used)
    .sort((left, right) => compareKeys(left.edge.key, right.edge.key));
  for (const { edge, index } of remainingEdges) {
    if (edge.used) continue;
    const startKey = edge.left < edge.right ? edge.left : edge.right;
    const exceeded = appendPath(tracePath(state, startKey, index));
    if (exceeded) return { exceeded };
  }
  return { paths, controlPointCount };
}

function extractAtLevels(heights, width, height, levels, limits) {
  const states = levels.map(() => ({ nodes: new Map(), edges: [], segmentKeys: new Set() }));
  let segmentCount = 0;

  for (let row = 0; row < height - 1; row += 1) {
    for (let column = 0; column < width - 1; column += 1) {
      const upperLeft = makeVertex(row, column, width, heights);
      const lowerLeft = makeVertex(row + 1, column, width, heights);
      const lowerRight = makeVertex(row + 1, column + 1, width, heights);
      const upperRight = makeVertex(row, column + 1, width, heights);
      const triangles = [
        [upperLeft, lowerLeft, upperRight],
        [upperRight, lowerLeft, lowerRight],
      ];

      for (const triangle of triangles) {
        const minimum = Math.min(triangle[0].height, triangle[1].height, triangle[2].height);
        const maximum = Math.max(triangle[0].height, triangle[1].height, triangle[2].height);
        const firstLevel = lowerBound(levels, minimum);
        const levelEnd = upperBound(levels, maximum);
        for (let levelIndex = firstLevel; levelIndex < levelEnd; levelIndex += 1) {
          const state = states[levelIndex];
          const before = state.edges.length;
          const exceeded = addTriangleSegment(
            state,
            triangle,
            levels[levelIndex],
            limits.maximumSegmentsPerTile - segmentCount,
          );
          if (exceeded) return { exceeded };
          segmentCount += state.edges.length - before;
        }
      }
    }
  }

  const paths = [];
  let controlPointCount = 0;
  for (let levelIndex = 0; levelIndex < levels.length; levelIndex += 1) {
    const traced = traceLevelPaths(
      states[levelIndex],
      levels[levelIndex],
      limits.maximumPathsPerTile - paths.length,
      limits.maximumControlPointsPerTile - controlPointCount,
    );
    if (traced.exceeded) return { exceeded: traced.exceeded };
    paths.push(...traced.paths);
    controlPointCount += traced.controlPointCount;
  }
  return { paths, segmentCount, controlPointCount };
}

function capError(reason, limits, spacing, adaptationCount) {
  const limitNames = {
    contourLevels: 'maximumContourLevelsPerTile',
    paths: 'maximumPathsPerTile',
    segments: 'maximumSegmentsPerTile',
    controlPoints: 'maximumControlPointsPerTile',
  };
  const limitName = limitNames[reason];
  const error = new RangeError(
    `Terrain NURBS contours cannot satisfy ${limitName}=${limits[limitName]} after ${adaptationCount} spacing adaptations.`,
  );
  error.code = CAP_ERROR_CODES[reason];
  error.cap = limitName;
  error.spacingMeters = spacing;
  return error;
}

function summarizeClassification(paths) {
  const aboveLevels = new Set();
  const submergedLevels = new Set();
  const summary = {
    aboveZeroContourLevelCount: 0,
    aboveZeroPathCount: 0,
    aboveZeroSegmentCount: 0,
    aboveZeroControlPointCount: 0,
    atOrBelowZeroContourLevelCount: 0,
    atOrBelowZeroPathCount: 0,
    atOrBelowZeroSegmentCount: 0,
    atOrBelowZeroControlPointCount: 0,
  };
  for (const path of paths) {
    if (path.classification === 'above-zero') {
      aboveLevels.add(path.elevationMeters);
      summary.aboveZeroPathCount += 1;
      summary.aboveZeroSegmentCount += path.segmentCount;
      summary.aboveZeroControlPointCount += path.controlPointCount;
    } else {
      submergedLevels.add(path.elevationMeters);
      summary.atOrBelowZeroPathCount += 1;
      summary.atOrBelowZeroSegmentCount += path.segmentCount;
      summary.atOrBelowZeroControlPointCount += path.controlPointCount;
    }
  }
  summary.aboveZeroContourLevelCount = aboveLevels.size;
  summary.atOrBelowZeroContourLevelCount = submergedLevels.size;
  return Object.freeze(summary);
}

export function buildTerrainNurbsContours(heights, {
  width,
  height,
  contourSpacingMeters = 500,
  maximumGridSamples = TERRAIN_NURBS_LIMITS.maximumGridSamples,
  maximumContourLevelsPerTile = TERRAIN_NURBS_LIMITS.maximumContourLevelsPerTile,
  maximumPathsPerTile = TERRAIN_NURBS_LIMITS.maximumPathsPerTile,
  maximumSegmentsPerTile = TERRAIN_NURBS_LIMITS.maximumSegmentsPerTile,
  maximumControlPointsPerTile = TERRAIN_NURBS_LIMITS.maximumControlPointsPerTile,
  maximumAdaptationPasses = TERRAIN_NURBS_LIMITS.maximumAdaptationPasses,
} = {}) {
  positiveSafeInteger(maximumGridSamples, 'maximumGridSamples');
  positiveSafeInteger(maximumContourLevelsPerTile, 'maximumContourLevelsPerTile');
  positiveSafeInteger(maximumPathsPerTile, 'maximumPathsPerTile');
  positiveSafeInteger(maximumSegmentsPerTile, 'maximumSegmentsPerTile');
  positiveSafeInteger(maximumControlPointsPerTile, 'maximumControlPointsPerTile');
  nonNegativeSafeInteger(maximumAdaptationPasses, 'maximumAdaptationPasses');
  finitePositive(contourSpacingMeters, 'contourSpacingMeters');
  const source = validateHeightGrid(heights, width, height, maximumGridSamples);
  const limits = Object.freeze({
    maximumGridSamples,
    maximumContourLevelsPerTile,
    maximumPathsPerTile,
    maximumSegmentsPerTile,
    maximumControlPointsPerTile,
    maximumAdaptationPasses,
  });

  let effectiveSpacingMeters = contourSpacingMeters;
  let adaptationCount = 0;
  const adaptationReasons = [];
  let previousFailedSignature = null;

  while (true) {
    const candidate = buildContourLevels(
      source.minimum,
      source.maximum,
      effectiveSpacingMeters,
      maximumContourLevelsPerTile,
    );
    if (candidate.exceeded) {
      if (adaptationCount >= maximumAdaptationPasses) {
        throw capError('contourLevels', limits, effectiveSpacingMeters, adaptationCount);
      }
      adaptationReasons.push('contour-level-cap');
      adaptationCount += 1;
      effectiveSpacingMeters = nextLevelBoundedSpacing(
        effectiveSpacingMeters,
        candidate.count,
        source.minimum,
        source.maximum,
        maximumContourLevelsPerTile,
      );
      if (!Number.isFinite(effectiveSpacingMeters)) {
        throw capError('contourLevels', limits, effectiveSpacingMeters, adaptationCount);
      }
      continue;
    }

    const extracted = extractAtLevels(heights, width, height, candidate.levels, limits);
    if (extracted.exceeded) {
      const signature = `${extracted.exceeded}:${candidate.levels.join(',')}`;
      if (adaptationCount >= maximumAdaptationPasses || signature === previousFailedSignature) {
        throw capError(extracted.exceeded, limits, effectiveSpacingMeters, adaptationCount);
      }
      previousFailedSignature = signature;
      adaptationReasons.push(`${extracted.exceeded}-cap`);
      adaptationCount += 1;
      effectiveSpacingMeters *= 2;
      if (!Number.isFinite(effectiveSpacingMeters)) {
        throw capError(extracted.exceeded, limits, effectiveSpacingMeters, adaptationCount);
      }
      continue;
    }

    const classification = summarizeClassification(extracted.paths);
    const telemetry = Object.freeze({
      sourceSampleCount: source.sampleCount,
      candidateContourLevelCount: candidate.levels.length,
      contourLevelCount:
        classification.aboveZeroContourLevelCount
        + classification.atOrBelowZeroContourLevelCount,
      pathCount: extracted.paths.length,
      segmentCount: extracted.segmentCount,
      controlPointCount: extracted.controlPointCount,
      ...classification,
      requestedContourSpacingMeters: contourSpacingMeters,
      effectiveContourSpacingMeters: effectiveSpacingMeters,
      adaptationCount,
      adaptationReasons: Object.freeze([...adaptationReasons]),
      capped: false,
      omittedPathCount: 0,
      omittedSegmentCount: 0,
    });

    return Object.freeze({
      schemaVersion: 'peercompute.geo.terrain-nurbs-contours.v1',
      curveModel: 'NURBS',
      degree: 1,
      rationalWeights: 'uniform-unit',
      knotModel: 'open-clamped-uniform-per-path',
      topologyPolicy: 'cesium-regular-grid-upper-left-lower-left-upper-right__upper-right-lower-left-lower-right',
      saddleResolution: 'fixed-lower-left-to-upper-right-diagonal',
      elevationModel: 'exact-piecewise-linear-source-heightmap',
      classificationModel: 'above-zero-vs-at-or-below-zero',
      maximumPathDisplacementGridUnits: 0,
      maximumElevationDisplacementMeters: 0,
      minimumSourceElevationMeters: source.minimum,
      maximumSourceElevationMeters: source.maximum,
      requestedContourSpacingMeters: contourSpacingMeters,
      effectiveContourSpacingMeters: effectiveSpacingMeters,
      contourSpacingMeters: effectiveSpacingMeters,
      adapted: adaptationCount > 0,
      adaptationCount,
      capped: false,
      limits,
      telemetry,
      paths: Object.freeze(extracted.paths),
    });
  }
}
