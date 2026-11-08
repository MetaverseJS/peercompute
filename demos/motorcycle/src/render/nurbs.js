import { NURBSCurve } from 'three/addons/curves/NURBSCurve.js';

const DEFAULT_MAXIMUM_CONTOUR_LEVELS = 96;
const DEFAULT_MAXIMUM_NURBS_CURVES = 512;
const DEFAULT_MAXIMUM_SAMPLED_VERTICES = 60_000;
const DEFAULT_MAXIMUM_CONTROL_POINTS = 48;

function finite(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${label} must be finite.`);
  return number;
}

function positive(value, fallback, label) {
  const selected = value ?? fallback;
  if (!Number.isFinite(selected) || selected <= 0) {
    throw new RangeError(`${label} must be positive.`);
  }
  return Number(selected);
}

function boundedInteger(value, fallback, maximum, label, minimum = 1) {
  const selected = value ?? fallback;
  if (!Number.isInteger(selected) || selected < minimum || selected > maximum) {
    throw new RangeError(`${label} must be an integer between ${minimum} and ${maximum}.`);
  }
  return selected;
}

function pointKey(point) {
  return `${Math.round(point[0] * 1_000)}/${Math.round(point[2] * 1_000)}`;
}

function samePoint(left, right) {
  return Math.hypot(left[0] - right[0], left[1] - right[1], left[2] - right[2]) <= 1e-5;
}

function terrainPoint(positions, index) {
  const offset = index * 3;
  return [positions[offset], positions[offset + 1], positions[offset + 2]];
}

function adjustedSign(height, level) {
  const delta = height - level;
  if (Math.abs(delta) > 1e-7) return delta;
  // Treat exact-level vertices as the high side. This traces a plateau's
  // boundary without inventing parity-based diagonals through a flat patch.
  return 1e-7;
}

function triangleContourSegment(positions, sourceHeights, indices, level, lift) {
  const points = indices.map((index) => terrainPoint(positions, index));
  const heights = indices.map((index) => sourceHeights[index]);
  const intersections = [];
  for (const [leftIndex, rightIndex] of [[0, 1], [1, 2], [2, 0]]) {
    const left = points[leftIndex];
    const right = points[rightIndex];
    const leftHeight = heights[leftIndex];
    const rightHeight = heights[rightIndex];
    const leftSign = adjustedSign(leftHeight, level);
    const rightSign = adjustedSign(rightHeight, level);
    if ((leftSign < 0) === (rightSign < 0)) continue;
    const denominator = rightHeight - leftHeight;
    const interpolation = Math.abs(denominator) <= 1e-12
      ? 0.5
      : Math.min(1, Math.max(0, (level - leftHeight) / denominator));
    const point = [
      left[0] + (right[0] - left[0]) * interpolation,
      left[1] + (right[1] - left[1]) * interpolation + lift,
      left[2] + (right[2] - left[2]) * interpolation,
    ];
    if (!intersections.some((candidate) => samePoint(candidate, point))) intersections.push(point);
  }
  return intersections.length === 2 ? intersections : null;
}

function contourSegmentsAtLevel(terrain, sourceHeights, level, lift) {
  const segments = [];
  const { width, height, positions } = terrain;
  for (let row = 0; row < height - 1; row += 1) {
    for (let column = 0; column < width - 1; column += 1) {
      const a = row * width + column;
      const b = a + 1;
      const c = a + width;
      const d = c + 1;
      const first = triangleContourSegment(positions, sourceHeights, [a, b, c], level, lift);
      const second = triangleContourSegment(positions, sourceHeights, [b, d, c], level, lift);
      if (first) segments.push(first);
      if (second) segments.push(second);
    }
  }
  return segments;
}

function connectedContourPaths(segments) {
  const endpoints = new Map();
  const used = new Uint8Array(segments.length);
  for (let index = 0; index < segments.length; index += 1) {
    for (const point of segments[index]) {
      const key = pointKey(point);
      if (!endpoints.has(key)) endpoints.set(key, []);
      endpoints.get(key).push(index);
    }
  }
  const nextUnusedAt = (key) => (endpoints.get(key) ?? []).find((index) => used[index] === 0) ?? -1;
  const paths = [];
  for (let startIndex = 0; startIndex < segments.length; startIndex += 1) {
    if (used[startIndex]) continue;
    used[startIndex] = 1;
    const path = [segments[startIndex][0], segments[startIndex][1]];
    for (let direction = 0; direction < 2; direction += 1) {
      while (true) {
        const endpoint = direction === 0 ? path[path.length - 1] : path[0];
        const candidateIndex = nextUnusedAt(pointKey(endpoint));
        if (candidateIndex < 0) break;
        used[candidateIndex] = 1;
        const candidate = segments[candidateIndex];
        const other = pointKey(candidate[0]) === pointKey(endpoint) ? candidate[1] : candidate[0];
        if (direction === 0) path.push(other);
        else path.unshift(other);
        if (path.length > segments.length + 1) break;
      }
    }
    const compact = path.filter((point, index) => index === 0 || !samePoint(point, path[index - 1]));
    if (compact.length >= 2) paths.push(compact);
  }
  return paths;
}

function boundedControlPoints(points, maximumControlPoints) {
  if (points.length <= maximumControlPoints) return points;
  const selected = [];
  for (let index = 0; index < maximumControlPoints; index += 1) {
    const sourceIndex = Math.round((index / (maximumControlPoints - 1)) * (points.length - 1));
    selected.push(points[sourceIndex]);
  }
  return selected;
}

function clampedKnots(controlPointCount, degree) {
  const knots = Array(degree + 1).fill(0);
  const internalCount = controlPointCount - degree - 1;
  for (let index = 1; index <= internalCount; index += 1) {
    knots.push(index / (internalCount + 1));
  }
  knots.push(...Array(degree + 1).fill(1));
  return knots;
}

export function createNurbsCurveFromPoints(THREE, points, {
  maximumControlPoints = DEFAULT_MAXIMUM_CONTROL_POINTS,
  degree = 3,
} = {}) {
  if (!THREE?.Vector4) throw new TypeError('A Three.js namespace with Vector4 is required.');
  if (!Array.isArray(points) || points.length < 2) {
    throw new TypeError('A NURBS curve requires at least two points.');
  }
  const controlLimit = boundedInteger(
    maximumControlPoints,
    DEFAULT_MAXIMUM_CONTROL_POINTS,
    256,
    'maximumControlPoints',
    2,
  );
  const selected = boundedControlPoints(points, controlLimit);
  const controls = selected.map((point, index) => {
    if ((!Array.isArray(point) && !ArrayBuffer.isView(point)) || point.length < 3) {
      throw new TypeError(`points[${index}] must contain three components.`);
    }
    return new THREE.Vector4(
      finite(point[0], `points[${index}][0]`),
      finite(point[1], `points[${index}][1]`),
      finite(point[2], `points[${index}][2]`),
      1,
    );
  });
  const selectedDegree = boundedInteger(degree, 3, 3, 'degree');
  const effectiveDegree = Math.min(selectedDegree, controls.length - 1);
  const curve = new NURBSCurve(
    effectiveDegree,
    clampedKnots(controls.length, effectiveDegree),
    controls,
  );
  curve.userData = Object.freeze({
    curveModel: 'NURBS',
    degree: effectiveDegree,
    sourcePointCount: points.length,
    controlPointCount: controls.length,
  });
  return curve;
}

function pathChunkCount(pointCount, maximumControlPoints) {
  return Math.max(1, Math.ceil((pointCount - 1) / (maximumControlPoints - 1)));
}

function chunkContourPath(points, maximumControlPoints) {
  const chunks = [];
  for (let start = 0; start < points.length - 1;) {
    const end = Math.min(points.length, start + maximumControlPoints);
    chunks.push(points.slice(start, end));
    start = end - 1;
  }
  return chunks;
}

export function createNurbsCircleCurve(THREE, radius, { plane = 'yz' } = {}) {
  if (!THREE?.Vector4) throw new TypeError('A Three.js namespace with Vector4 is required.');
  const selectedRadius = positive(radius, 1, 'radius');
  if (!['xy', 'xz', 'yz'].includes(plane)) throw new RangeError('NURBS circle plane must be xy, xz, or yz.');
  const weight = Math.SQRT1_2;
  const planar = [
    [selectedRadius, 0, 1],
    [selectedRadius, selectedRadius, weight],
    [0, selectedRadius, 1],
    [-selectedRadius, selectedRadius, weight],
    [-selectedRadius, 0, 1],
    [-selectedRadius, -selectedRadius, weight],
    [0, -selectedRadius, 1],
    [selectedRadius, -selectedRadius, weight],
    [selectedRadius, 0, 1],
  ];
  const controls = planar.map(([first, second, pointWeight]) => {
    if (plane === 'xy') return new THREE.Vector4(first, second, 0, pointWeight);
    if (plane === 'xz') return new THREE.Vector4(first, 0, second, pointWeight);
    return new THREE.Vector4(0, first, second, pointWeight);
  });
  const curve = new NURBSCurve(
    2,
    [0, 0, 0, 0.25, 0.25, 0.5, 0.5, 0.75, 0.75, 1, 1, 1],
    controls,
  );
  curve.userData = Object.freeze({
    curveModel: 'NURBS',
    degree: 2,
    closed: true,
    radius: selectedRadius,
    plane,
    controlPointCount: controls.length,
  });
  return curve;
}

export function createNurbsCircleGeometry(THREE, radius, {
  plane = 'yz',
  segments = 64,
} = {}) {
  if (!THREE?.BufferGeometry) throw new TypeError('A Three.js namespace with BufferGeometry is required.');
  const segmentCount = boundedInteger(segments, 64, 256, 'segments');
  const curve = createNurbsCircleCurve(THREE, radius, { plane });
  const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(segmentCount));
  geometry.userData = {
    ...curve.userData,
    sampledPointCount: segmentCount + 1,
  };
  return geometry;
}

function appendCurveSegments(target, sampledPoints) {
  for (let index = 1; index < sampledPoints.length; index += 1) {
    const left = sampledPoints[index - 1];
    const right = sampledPoints[index];
    target.push(left.x, left.y, left.z, right.x, right.y, right.z);
  }
}

function lineGeometry(THREE, positions, name) {
  const geometry = new THREE.BufferGeometry();
  geometry.name = name;
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  if (positions.length > 0) {
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
  }
  return geometry;
}

export function createTerrainNurbsContourGeometry(THREE, terrain, {
  contourSpacingMeters = 4,
  majorContourEvery = 5,
  lineLiftMeters = 0.06,
  maximumContourLevels = DEFAULT_MAXIMUM_CONTOUR_LEVELS,
  maximumNurbsCurves = DEFAULT_MAXIMUM_NURBS_CURVES,
  maximumSampledVertices = DEFAULT_MAXIMUM_SAMPLED_VERTICES,
  maximumControlPoints = DEFAULT_MAXIMUM_CONTROL_POINTS,
} = {}) {
  if (!THREE?.BufferGeometry || !THREE?.Float32BufferAttribute) {
    throw new TypeError('A Three.js namespace with buffer geometry support is required.');
  }
  const width = Number(terrain?.width);
  const height = Number(terrain?.height);
  const positions = terrain?.positions;
  if (!Number.isInteger(width) || width < 2 || !Number.isInteger(height) || height < 2
    || (!ArrayBuffer.isView(positions) && !Array.isArray(positions))
    || positions.length !== width * height * 3) {
    throw new TypeError('NURBS contours require a canonical finite terrain grid.');
  }
  const spacing = positive(contourSpacingMeters, 4, 'contourSpacingMeters');
  const lift = finite(lineLiftMeters, 'lineLiftMeters');
  const majorEvery = boundedInteger(majorContourEvery, 5, 64, 'majorContourEvery');
  const levelLimit = boundedInteger(maximumContourLevels, DEFAULT_MAXIMUM_CONTOUR_LEVELS, 512, 'maximumContourLevels');
  const curveLimit = boundedInteger(maximumNurbsCurves, DEFAULT_MAXIMUM_NURBS_CURVES, 4_096, 'maximumNurbsCurves');
  const vertexLimit = boundedInteger(maximumSampledVertices, DEFAULT_MAXIMUM_SAMPLED_VERTICES, 500_000, 'maximumSampledVertices');
  const controlLimit = boundedInteger(
    maximumControlPoints,
    DEFAULT_MAXIMUM_CONTROL_POINTS,
    256,
    'maximumControlPoints',
    2,
  );
  const sourceHeights = (ArrayBuffer.isView(terrain?.heights) || Array.isArray(terrain?.heights))
    && terrain.heights.length === width * height
    ? Float64Array.from(terrain.heights, (value, index) => finite(value, `terrain.heights[${index}]`))
    : Float64Array.from({ length: width * height }, (_, index) => (
      finite(positions[index * 3 + 1], `terrain.positions[${index * 3 + 1}]`)
    ));
  let minimumHeight = Number.POSITIVE_INFINITY;
  let maximumHeight = Number.NEGATIVE_INFINITY;
  for (const value of sourceHeights) {
    minimumHeight = Math.min(minimumHeight, value);
    maximumHeight = Math.max(maximumHeight, value);
  }
  const flatTerrain = maximumHeight - minimumHeight <= 1e-7;
  const originalLevelCount = flatTerrain ? 0 : Math.max(
    0,
    Math.floor(maximumHeight / spacing) - Math.ceil(minimumHeight / spacing) + 1,
  );
  if (!Number.isSafeInteger(originalLevelCount)) {
    throw new RangeError('Terrain contour level count is outside the safe-integer work bound.');
  }
  const spacingMultiplier = Math.max(1, Math.ceil(originalLevelCount / levelLimit));
  const effectiveSpacingMeters = spacing * spacingMultiplier;
  const firstLevel = Math.ceil(minimumHeight / effectiveSpacingMeters) * effectiveSpacingMeters;
  const levels = [];
  for (let level = firstLevel; !flatTerrain && level <= maximumHeight + 1e-9 && levels.length < levelLimit; level += effectiveSpacingMeters) {
    levels.push(level);
  }
  const minorPositions = [];
  const majorPositions = [];
  let sourceSegmentCount = 0;
  let sourcePathCount = 0;
  let nurbsCurveCount = 0;
  let minorCurveCount = 0;
  let majorCurveCount = 0;
  let controlPointCount = 0;
  let sampledVertexCount = 0;
  let omittedCurveCount = 0;
  let processedLevelCount = 0;
  let unprocessedLevelCount = 0;
  let processingTruncated = false;
  let capped = false;
  levelLoop:
  for (let levelIndex = 0; levelIndex < levels.length; levelIndex += 1) {
    processedLevelCount += 1;
    const segments = contourSegmentsAtLevel(terrain, sourceHeights, levels[levelIndex], lift);
    sourceSegmentCount += segments.length;
    const paths = connectedContourPaths(segments);
    sourcePathCount += paths.length;
    for (let pathIndex = 0; pathIndex < paths.length; pathIndex += 1) {
      const chunks = chunkContourPath(paths[pathIndex], controlLimit);
      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex += 1) {
        const chunk = chunks[chunkIndex];
        const requiredVertices = Math.max(0, chunk.length - 1) * 2;
        if (nurbsCurveCount >= curveLimit || sampledVertexCount + requiredVertices > vertexLimit) {
          omittedCurveCount += chunks.length - chunkIndex;
          for (let remaining = pathIndex + 1; remaining < paths.length; remaining += 1) {
            omittedCurveCount += pathChunkCount(paths[remaining].length, controlLimit);
          }
          processingTruncated = true;
          capped = true;
          break levelLoop;
        }
        // Terrain contours use degree-one NURBS. This is still a true NURBS
        // representation, while preserving every extracted triangle
        // intersection exactly instead of rounding off hairpins or moving a
        // displayed contour away from the authoritative terrain mesh.
        const curve = createNurbsCurveFromPoints(THREE, chunk, {
          maximumControlPoints: controlLimit,
          degree: 1,
        });
        const sampled = curve.getPoints(curve.userData.controlPointCount - 1);
        const levelNumber = Math.round(levels[levelIndex] / effectiveSpacingMeters);
        const major = levelNumber % majorEvery === 0;
        appendCurveSegments(major ? majorPositions : minorPositions, sampled);
        nurbsCurveCount += 1;
        if (major) majorCurveCount += 1;
        else minorCurveCount += 1;
        controlPointCount += curve.userData.controlPointCount;
        sampledVertexCount += requiredVertices;
      }
    }
  }
  if (processingTruncated) unprocessedLevelCount = levels.length - processedLevelCount;
  const omittedLevelCount = Math.max(0, originalLevelCount - levels.length);
  const levelCapApplied = omittedLevelCount > 0;
  capped ||= levelCapApplied;
  const minor = lineGeometry(THREE, minorPositions, 'motorcycle-terrain-nurbs-minor-geometry');
  const major = lineGeometry(THREE, majorPositions, 'motorcycle-terrain-nurbs-major-geometry');
  const telemetry = Object.freeze({
    curveModel: 'NURBS',
    contourSpacingMeters: spacing,
    effectiveContourSpacingMeters: effectiveSpacingMeters,
    minimumSourceElevationMeters: minimumHeight,
    maximumSourceElevationMeters: maximumHeight,
    firstContourElevationMeters: levels[0] ?? null,
    majorContourEvery: majorEvery,
    sourceLevelCount: originalLevelCount,
    selectedLevelCount: levels.length,
    processedLevelCount,
    omittedLevelCount,
    unprocessedLevelCount,
    levelCapApplied,
    processingTruncated,
    sourceSegmentCount,
    sourcePathCount,
    nurbsCurveCount,
    minorCurveCount,
    majorCurveCount,
    controlPointCount,
    sampledVertexCount,
    minorSampledVertexCount: minorPositions.length / 3,
    majorSampledVertexCount: majorPositions.length / 3,
    omittedCurveCount,
    capped,
    maximumContourLevels: levelLimit,
    maximumNurbsCurves: curveLimit,
    maximumSampledVertices: vertexLimit,
    maximumControlPoints: controlLimit,
    contourBasis: terrain?.heights ? 'source-elevation-meters' : 'local-mesh-y-fallback',
    topologyPolicy: 'exact-degree-one-nurbs-polyline',
    maximumSourcePathDeviationMeters: 0,
  });
  minor.userData = { ...telemetry, contourClass: 'minor' };
  major.userData = { ...telemetry, contourClass: 'major' };
  return Object.freeze({ minor, major, telemetry });
}
