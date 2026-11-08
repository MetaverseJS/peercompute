export const MOTORCYCLE_ROAD_SURFACE_SCHEMA =
  'peercompute.motorcycle.terrain-draped-road-surface.v1';

export const MOTORCYCLE_ROAD_STYLE_GROUP_SCHEMA =
  'peercompute.motorcycle.terrain-draped-road-style-group.v1';

// Preserve the existing 8 cm source lift plus 2.5 cm ribbon lift, but make it
// one shared physical/rendering value instead of two unrelated visual offsets.
export const MOTORCYCLE_ROAD_DECK_CLEARANCE_METERS = 0.105;

export const MOTORCYCLE_ROAD_SURFACE_LIMITS = Object.freeze({
  maximumRoadSegments: 5_000,
  maximumRoadTriangles: 100_000,
  maximumRoadVertices: 300_000,
  maximumSpatialReferences: 1_000_000,
});

const CLIP_EPSILON_METERS = 1e-5;
const SAMPLE_EPSILON_METERS = 1e-4;

function finite(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${label} must be finite.`);
  return number;
}

function boundedInteger(value, fallback, maximum, label) {
  const selected = value ?? fallback;
  if (!Number.isInteger(selected) || selected < 0 || selected > maximum) {
    throw new RangeError(`${label} must be an integer between 0 and ${maximum}.`);
  }
  return selected;
}

function finitePoint(value, label) {
  if ((!Array.isArray(value) && !ArrayBuffer.isView(value)) || value.length < 3) {
    throw new TypeError(`${label} must contain three components.`);
  }
  return [
    finite(value[0], `${label}[0]`),
    finite(value[1], `${label}[1]`),
    finite(value[2], `${label}[2]`),
  ];
}

function capError(message) {
  const error = new RangeError(message);
  error.code = 'ERR_MOTORCYCLE_ROAD_SURFACE_CAP';
  return error;
}

function surfaceBin(value, minimum, maximum, count) {
  if (maximum <= minimum) return 0;
  return Math.min(count - 1, Math.max(0, Math.floor(
    ((value - minimum) / (maximum - minimum)) * count,
  )));
}

function binRange(minimum, maximum, boundsMinimum, boundsMaximum, count) {
  return [
    surfaceBin(minimum, boundsMinimum, boundsMaximum, count),
    surfaceBin(maximum, boundsMinimum, boundsMaximum, count),
  ];
}

function signedArea(points) {
  let area = 0;
  for (let index = 0; index < points.length; index += 1) {
    const next = points[(index + 1) % points.length];
    area += points[index][0] * next[1] - next[0] * points[index][1];
  }
  return area * 0.5;
}

function edgeCross(start, end, point) {
  return (end[0] - start[0]) * (point[1] - start[1])
    - (end[1] - start[1]) * (point[0] - start[0]);
}

function lineIntersection(previous, current, previousDistance, currentDistance) {
  const denominator = previousDistance - currentDistance;
  const alpha = Math.abs(denominator) <= Number.EPSILON
    ? 0
    : Math.min(1, Math.max(0, previousDistance / denominator));
  return [
    previous[0] + (current[0] - previous[0]) * alpha,
    previous[1] + (current[1] - previous[1]) * alpha,
  ];
}

function deduplicatePolygon(points) {
  const result = [];
  for (const point of points) {
    const previous = result.at(-1);
    if (!previous || Math.hypot(point[0] - previous[0], point[1] - previous[1]) > CLIP_EPSILON_METERS) {
      result.push(point);
    }
  }
  if (result.length > 1
    && Math.hypot(result[0][0] - result.at(-1)[0], result[0][1] - result.at(-1)[1])
      <= CLIP_EPSILON_METERS) {
    result.pop();
  }
  return result;
}

function clipConvexPolygon(subject, clip) {
  let output = subject.map((point) => [...point]);
  const orientation = signedArea(clip) >= 0 ? 1 : -1;
  for (let edge = 0; edge < clip.length && output.length > 0; edge += 1) {
    const start = clip[edge];
    const end = clip[(edge + 1) % clip.length];
    const input = output;
    output = [];
    let previous = input.at(-1);
    let previousDistance = orientation * edgeCross(start, end, previous);
    let previousInside = previousDistance >= -CLIP_EPSILON_METERS;
    for (const current of input) {
      const currentDistance = orientation * edgeCross(start, end, current);
      const currentInside = currentDistance >= -CLIP_EPSILON_METERS;
      if (currentInside !== previousInside) {
        output.push(lineIntersection(previous, current, previousDistance, currentDistance));
      }
      if (currentInside) output.push(current);
      previous = current;
      previousDistance = currentDistance;
      previousInside = currentInside;
    }
    output = deduplicatePolygon(output);
  }
  return output.length >= 3 && Math.abs(signedArea(output)) > 1e-9 ? output : [];
}

function triangleSurfaceSample(points, x, z, epsilon = SAMPLE_EPSILON_METERS) {
  const [a, b, c] = points;
  const denominator = (b[2] - c[2]) * (a[0] - c[0])
    + (c[0] - b[0]) * (a[2] - c[2]);
  if (Math.abs(denominator) <= 1e-12) return null;
  const weightA = ((b[2] - c[2]) * (x - c[0])
    + (c[0] - b[0]) * (z - c[2])) / denominator;
  const weightB = ((c[2] - a[2]) * (x - c[0])
    + (a[0] - c[0]) * (z - c[2])) / denominator;
  const weightC = 1 - weightA - weightB;
  if (weightA < -epsilon || weightB < -epsilon || weightC < -epsilon) return null;
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  let normal = [
    ab[1] * ac[2] - ab[2] * ac[1],
    ab[2] * ac[0] - ab[0] * ac[2],
    ab[0] * ac[1] - ab[1] * ac[0],
  ];
  if (normal[1] < 0) normal = normal.map((component) => -component);
  const length = Math.hypot(...normal) || 1;
  return {
    height: a[1] * weightA + b[1] * weightB + c[1] * weightC,
    normal: Object.freeze(normal.map((component) => component / length)),
  };
}

function roadFootprintRecord(id, rectangle, from, to, widthMeters, metadata, deckClearanceMeters) {
  const directionX = to[0] - from[0];
  const directionZ = to[2] - from[2];
  const length = Math.hypot(directionX, directionZ);
  const unitX = directionX / length;
  const unitZ = directionZ / length;
  const halfWidth = Math.min(30, Math.max(0.2, widthMeters * 0.5));
  return Object.freeze({
    id,
    originX: from[0],
    originZ: from[2],
    unitX,
    unitZ,
    length,
    halfWidth,
    minimumX: Math.min(...rectangle.map((point) => point[0])) - SAMPLE_EPSILON_METERS,
    maximumX: Math.max(...rectangle.map((point) => point[0])) + SAMPLE_EPSILON_METERS,
    minimumZ: Math.min(...rectangle.map((point) => point[1])) - SAMPLE_EPSILON_METERS,
    maximumZ: Math.max(...rectangle.map((point) => point[1])) + SAMPLE_EPSILON_METERS,
    metadata,
    contactMetadata: Object.freeze({
      surfaceKind: 'osm-road',
      roadSegmentId: metadata.roadSegmentId,
      osmWayId: metadata.osmWayId,
      roadCategory: metadata.category,
      roadFootprintId: id,
      roadTriangleId: null,
      roadDeckClearanceMeters: deckClearanceMeters,
      roadSourceAuthoritative: metadata.sourceAuthoritative,
      roadNavigationGrade: metadata.navigationGrade,
    }),
  });
}

function footprintContains(footprint, x, z) {
  if (x < footprint.minimumX || x > footprint.maximumX
    || z < footprint.minimumZ || z > footprint.maximumZ) return false;
  const relativeX = x - footprint.originX;
  const relativeZ = z - footprint.originZ;
  const longitudinal = relativeX * footprint.unitX + relativeZ * footprint.unitZ;
  if (longitudinal < -SAMPLE_EPSILON_METERS
    || longitudinal > footprint.length + SAMPLE_EPSILON_METERS) return false;
  const lateral = -relativeX * footprint.unitZ + relativeZ * footprint.unitX;
  return Math.abs(lateral) <= footprint.halfWidth + SAMPLE_EPSILON_METERS;
}

function terrainTriangleRecords(terrain) {
  const { width, height, positions, localBounds } = terrain;
  const binColumns = width - 1;
  const binRows = height - 1;
  const bins = Array.from({ length: binColumns * binRows }, () => []);
  const records = [];
  const add = (indices) => {
    const points = indices.map((index) => [
      positions[index * 3], positions[index * 3 + 1], positions[index * 3 + 2],
    ]);
    const minimumX = Math.min(...points.map((point) => point[0])) - SAMPLE_EPSILON_METERS;
    const maximumX = Math.max(...points.map((point) => point[0])) + SAMPLE_EPSILON_METERS;
    const minimumZ = Math.min(...points.map((point) => point[2])) - SAMPLE_EPSILON_METERS;
    const maximumZ = Math.max(...points.map((point) => point[2])) + SAMPLE_EPSILON_METERS;
    const record = { id: records.length, points, minimumX, maximumX, minimumZ, maximumZ };
    records.push(record);
    const [firstColumn, lastColumn] = binRange(
      minimumX, maximumX, localBounds.minX, localBounds.maxX, binColumns,
    );
    const [firstRow, lastRow] = binRange(
      minimumZ, maximumZ, localBounds.minZ, localBounds.maxZ, binRows,
    );
    for (let row = firstRow; row <= lastRow; row += 1) {
      for (let column = firstColumn; column <= lastColumn; column += 1) {
        bins[row * binColumns + column].push(record.id);
      }
    }
  };
  for (let row = 0; row < height - 1; row += 1) {
    for (let column = 0; column < width - 1; column += 1) {
      const a = row * width + column;
      const b = a + 1;
      const c = a + width;
      const d = c + 1;
      add([a, b, c]);
      add([b, d, c]);
    }
  }
  return { records, bins, binColumns, binRows };
}

function candidateTerrainTriangles(index, localBounds, minimumX, maximumX, minimumZ, maximumZ) {
  const [firstColumn, lastColumn] = binRange(
    minimumX, maximumX, localBounds.minX, localBounds.maxX, index.binColumns,
  );
  const [firstRow, lastRow] = binRange(
    minimumZ, maximumZ, localBounds.minZ, localBounds.maxZ, index.binRows,
  );
  const ids = new Set();
  for (let row = firstRow; row <= lastRow; row += 1) {
    for (let column = firstColumn; column <= lastColumn; column += 1) {
      for (const id of index.bins[row * index.binColumns + column]) ids.add(id);
    }
  }
  return [...ids].sort((left, right) => left - right);
}

function sampleIndexedTerrain(index, localBounds, x, z) {
  const column = surfaceBin(x, localBounds.minX, localBounds.maxX, index.binColumns);
  const row = surfaceBin(z, localBounds.minZ, localBounds.maxZ, index.binRows);
  for (const triangleId of index.bins[row * index.binColumns + column]) {
    const triangle = index.records[triangleId];
    if (x < triangle.minimumX || x > triangle.maximumX
      || z < triangle.minimumZ || z > triangle.maximumZ) continue;
    const sample = triangleSurfaceSample(triangle.points, x, z);
    if (sample) return sample;
  }
  return null;
}

function styleKey(segment) {
  const category = typeof segment?.category === 'string' ? segment.category : 'other';
  return `${category}/${String(segment?.color ?? '')}`;
}

function roadRectangle(from, to, widthMeters) {
  const dx = to[0] - from[0];
  const dz = to[2] - from[2];
  const length = Math.hypot(dx, dz);
  if (length <= 1e-5 || widthMeters <= 0) return null;
  const halfWidth = Math.min(30, Math.max(0.2, widthMeters * 0.5));
  const perpendicularX = (-dz / length) * halfWidth;
  const perpendicularZ = (dx / length) * halfWidth;
  return [
    [from[0] + perpendicularX, from[2] + perpendicularZ],
    [to[0] + perpendicularX, to[2] + perpendicularZ],
    [to[0] - perpendicularX, to[2] - perpendicularZ],
    [from[0] - perpendicularX, from[2] - perpendicularZ],
  ];
}

function groupBuilder(segment) {
  const category = typeof segment?.category === 'string' ? segment.category : 'other';
  return {
    key: styleKey(segment),
    category,
    color: segment?.color ?? null,
    positions: [],
    indices: [],
    sourceSegmentIds: new Set(),
    sourceAuthoritative: true,
    patchCount: 0,
  };
}

function immutableSegmentMetadata(segment, selectedIndex) {
  return Object.freeze({
    selectedIndex,
    roadSegmentId: typeof segment.id === 'string' ? segment.id : `road-segment/${selectedIndex}`,
    osmWayId: segment.osmWayId ?? null,
    category: typeof segment.category === 'string' ? segment.category : 'other',
    sourceAuthoritative: segment.sourceAuthoritative === true,
    navigationGrade: false,
  });
}

/**
 * Clip every bounded road ribbon against the exact Float32 terrain triangles.
 * Each emitted road triangle is therefore the terrain triangle plane plus one
 * shared vertical deck clearance. Rendering and collision consume these same
 * Float32 triangles; no endpoint chord or hidden terrain approximation exists.
 */
export function createTerrainDrapedRoadSurface(terrain, roadSegments, options = {}) {
  if (terrain?.schemaVersion !== 'peercompute.geo.local-terrain-grid.v1') {
    throw new TypeError('A canonical local terrain grid is required.');
  }
  if (!Array.isArray(roadSegments)) throw new TypeError('Road segments must be an array.');
  const maximumRoadSegments = boundedInteger(
    options.maximumRoadSegments,
    MOTORCYCLE_ROAD_SURFACE_LIMITS.maximumRoadSegments,
    MOTORCYCLE_ROAD_SURFACE_LIMITS.maximumRoadSegments,
    'maximumRoadSegments',
  );
  const maximumRoadTriangles = boundedInteger(
    options.maximumRoadTriangles,
    MOTORCYCLE_ROAD_SURFACE_LIMITS.maximumRoadTriangles,
    MOTORCYCLE_ROAD_SURFACE_LIMITS.maximumRoadTriangles,
    'maximumRoadTriangles',
  );
  const maximumRoadVertices = boundedInteger(
    options.maximumRoadVertices,
    MOTORCYCLE_ROAD_SURFACE_LIMITS.maximumRoadVertices,
    MOTORCYCLE_ROAD_SURFACE_LIMITS.maximumRoadVertices,
    'maximumRoadVertices',
  );
  const maximumSpatialReferences = boundedInteger(
    options.maximumSpatialReferences,
    MOTORCYCLE_ROAD_SURFACE_LIMITS.maximumSpatialReferences,
    MOTORCYCLE_ROAD_SURFACE_LIMITS.maximumSpatialReferences,
    'maximumSpatialReferences',
  );
  const deckClearanceMeters = finite(
    options.deckClearanceMeters ?? MOTORCYCLE_ROAD_DECK_CLEARANCE_METERS,
    'deckClearanceMeters',
  );
  if (deckClearanceMeters < 0 || deckClearanceMeters > 0.5) {
    throw new RangeError('deckClearanceMeters must be between 0 and 0.5.');
  }

  const selected = roadSegments.slice(0, maximumRoadSegments);
  const terrainIndex = terrainTriangleRecords(terrain);
  const groups = new Map();
  const roadFootprints = [];
  let invalidSegmentCount = 0;
  let outsideTerrainSegmentCount = 0;
  let renderedSourceSegmentCount = 0;
  let patchCount = 0;
  let vertexCount = 0;
  let triangleCount = 0;

  for (let selectedIndex = 0; selectedIndex < selected.length; selectedIndex += 1) {
    const segment = selected[selectedIndex];
    let from;
    let to;
    let widthMeters;
    try {
      from = finitePoint(segment?.from, `roadSegments[${selectedIndex}].from`);
      to = finitePoint(segment?.to, `roadSegments[${selectedIndex}].to`);
      widthMeters = finite(segment?.widthMeters, `roadSegments[${selectedIndex}].widthMeters`);
    } catch {
      invalidSegmentCount += 1;
      continue;
    }
    const rectangle = roadRectangle(from, to, widthMeters);
    if (!rectangle) {
      invalidSegmentCount += 1;
      continue;
    }
    const minimumX = Math.min(...rectangle.map((point) => point[0]));
    const maximumX = Math.max(...rectangle.map((point) => point[0]));
    const minimumZ = Math.min(...rectangle.map((point) => point[1]));
    const maximumZ = Math.max(...rectangle.map((point) => point[1]));
    const candidates = candidateTerrainTriangles(
      terrainIndex, terrain.localBounds, minimumX, maximumX, minimumZ, maximumZ,
    );
    const key = styleKey(segment);
    const group = groups.get(key) ?? groupBuilder(segment);
    if (!groups.has(key)) groups.set(key, group);
    const metadata = immutableSegmentMetadata(segment, selectedIndex);
    let segmentRendered = false;
    for (const triangleId of candidates) {
      const terrainTriangle = terrainIndex.records[triangleId];
      if (terrainTriangle.maximumX < minimumX || terrainTriangle.minimumX > maximumX
        || terrainTriangle.maximumZ < minimumZ || terrainTriangle.minimumZ > maximumZ) continue;
      const clip = terrainTriangle.points.map((point) => [point[0], point[2]]);
      const polygon = clipConvexPolygon(rectangle, clip);
      if (polygon.length < 3) continue;
      if (vertexCount + polygon.length > maximumRoadVertices) {
        throw capError(`Terrain-draped road vertices exceed ${maximumRoadVertices}.`);
      }
      if (triangleCount + polygon.length - 2 > maximumRoadTriangles) {
        throw capError(`Terrain-draped road triangles exceed ${maximumRoadTriangles}.`);
      }
      const base = group.positions.length / 3;
      const patchPoints = [];
      for (const [x, z] of polygon) {
        const storedX = Math.fround(x);
        const storedZ = Math.fround(z);
        const terrainSample = triangleSurfaceSample(terrainTriangle.points, storedX, storedZ);
        if (!terrainSample) throw new Error('Clipped road vertex escaped its terrain triangle.');
        const point = [storedX, Math.fround(terrainSample.height + deckClearanceMeters), storedZ];
        patchPoints.push(point);
        group.positions.push(...point);
      }
      for (let fan = 1; fan < patchPoints.length - 1; fan += 1) {
        const points = [patchPoints[0], patchPoints[fan], patchPoints[fan + 1]];
        if (Math.abs(signedArea(points.map((point) => [point[0], point[2]]))) <= 1e-9) continue;
        group.indices.push(base, base + fan, base + fan + 1);
        triangleCount += 1;
      }
      group.patchCount += 1;
      patchCount += 1;
      vertexCount += polygon.length;
      segmentRendered = true;
    }
    if (segmentRendered) {
      renderedSourceSegmentCount += 1;
      group.sourceSegmentIds.add(metadata.roadSegmentId);
      group.sourceAuthoritative &&= metadata.sourceAuthoritative;
      roadFootprints.push(roadFootprintRecord(
        roadFootprints.length,
        rectangle,
        from,
        to,
        widthMeters,
        metadata,
        deckClearanceMeters,
      ));
    } else {
      outsideTerrainSegmentCount += 1;
    }
  }

  const styleGroups = Object.freeze([...groups.values()]
    .filter((group) => group.indices.length > 0)
    .sort((left, right) => left.key.localeCompare(right.key))
    .map((group) => {
      const positions = new Float32Array(group.positions);
      const IndexArray = positions.length / 3 > 65_535 ? Uint32Array : Uint16Array;
      return Object.freeze({
        schemaVersion: MOTORCYCLE_ROAD_STYLE_GROUP_SCHEMA,
        key: group.key,
        category: group.category,
        color: group.color,
        positions,
        indices: new IndexArray(group.indices),
        sourceSegmentCount: group.sourceSegmentIds.size,
        sourceAuthoritative: group.sourceAuthoritative,
        patchCount: group.patchCount,
        triangleCount: group.indices.length / 3,
        vertexCount: positions.length / 3,
      });
    }));

  // Four bins per terrain cell keep dense intersections cheap at 120 Hz. The
  // index stores each source ribbon footprint once; the exact terrain sampler
  // supplies the same triangle plane used by the clipped render geometry.
  const binColumns = Math.min(256, Math.max(1, (terrain.width - 1) * 4));
  const binRows = Math.min(256, Math.max(1, (terrain.height - 1) * 4));
  const roadBins = Array.from({ length: binColumns * binRows }, () => []);
  let spatialReferenceCount = 0;
  let maximumCandidatesPerBin = 0;
  for (const footprint of roadFootprints) {
    const [firstColumn, lastColumn] = binRange(
      footprint.minimumX, footprint.maximumX,
      terrain.localBounds.minX, terrain.localBounds.maxX, binColumns,
    );
    const [firstRow, lastRow] = binRange(
      footprint.minimumZ, footprint.maximumZ,
      terrain.localBounds.minZ, terrain.localBounds.maxZ, binRows,
    );
    for (let row = firstRow; row <= lastRow; row += 1) {
      for (let column = firstColumn; column <= lastColumn; column += 1) {
        const bin = roadBins[row * binColumns + column];
        bin.push(footprint.id);
        spatialReferenceCount += 1;
        if (spatialReferenceCount > maximumSpatialReferences) {
          throw capError(`Terrain-draped road spatial references exceed ${maximumSpatialReferences}.`);
        }
        maximumCandidatesPerBin = Math.max(maximumCandidatesPerBin, bin.length);
      }
    }
  }

  const telemetry = Object.freeze({
    schemaVersion: 'peercompute.motorcycle.terrain-draped-road-surface.telemetry.v1',
    elevationModel: 'exact-terrain-triangle-plus-shared-deck-clearance',
    collisionModel: 'single-composite-static-heightfield',
    coordinateModel: 'immutable-local-xz-with-origin-rebase-query-offset',
    deckClearanceMeters,
    requestedSegmentCount: roadSegments.length,
    selectedSegmentCount: selected.length,
    renderedSourceSegmentCount,
    rendererCapOmittedCount: Math.max(0, roadSegments.length - selected.length),
    invalidOmittedCount: invalidSegmentCount,
    outsideTerrainOmittedCount: outsideTerrainSegmentCount,
    styleGroupCount: styleGroups.length,
    patchCount,
    vertexCount,
    triangleCount,
    collisionFootprintCount: roadFootprints.length,
    terrainTriangleCount: terrainIndex.records.length,
    spatialBinColumns: binColumns,
    spatialBinRows: binRows,
    spatialReferenceCount,
    maximumCandidatesPerBin,
    deterministicOverlapRule: 'lowest-stable-road-footprint-id',
    sourceAuthoritative: selected.length > 0
      && selected.every((segment) => segment?.sourceAuthoritative === true),
    navigationGrade: false,
  });

  let cachedX = Number.NaN;
  let cachedZ = Number.NaN;
  let cachedSample = null;
  const containsTerrainLocal = typeof terrain.containsLocal === 'function'
    ? (x, z) => terrain.containsLocal(x, z)
    : (x, z) => x >= terrain.localBounds.minX && x <= terrain.localBounds.maxX
      && z >= terrain.localBounds.minZ && z <= terrain.localBounds.maxZ;
  const sampleLocalSurface = (xValue, zValue) => {
    const x = Number(xValue);
    const z = Number(zValue);
    if (!Number.isFinite(x) || !Number.isFinite(z)) return null;
    if (x === cachedX && z === cachedZ) return cachedSample;
    cachedX = x;
    cachedZ = z;
    if (!containsTerrainLocal(x, z)) {
      cachedSample = null;
      return null;
    }
    const column = surfaceBin(x, terrain.localBounds.minX, terrain.localBounds.maxX, binColumns);
    const row = surfaceBin(z, terrain.localBounds.minZ, terrain.localBounds.maxZ, binRows);
    let selectedFootprint = null;
    for (const footprintId of roadBins[row * binColumns + column]) {
      const footprint = roadFootprints[footprintId];
      if (footprintContains(footprint, x, z)) {
        selectedFootprint = footprint;
        break;
      }
    }
    const terrainSample = selectedFootprint
      ? (terrain.sampleLocalSurface?.(x, z)
        ?? sampleIndexedTerrain(terrainIndex, terrain.localBounds, x, z))
      : null;
    cachedSample = terrainSample && selectedFootprint ? Object.freeze({
      schemaVersion: 'peercompute.motorcycle.road-surface-sample.v1',
      surfaceKind: 'osm-road',
      height: terrainSample.height + deckClearanceMeters,
      normal: terrainSample.normal,
      footprintId: selectedFootprint.id,
      triangleId: null,
      deckClearanceMeters,
      contactMetadata: selectedFootprint.contactMetadata,
      ...selectedFootprint.metadata,
    }) : null;
    return cachedSample;
  };

  return Object.freeze({
    schemaVersion: MOTORCYCLE_ROAD_SURFACE_SCHEMA,
    deckClearanceMeters,
    groups: styleGroups,
    sampleLocalSurface,
    containsLocalRoad: (x, z) => sampleLocalSurface(x, z) !== null,
    getTelemetry: () => telemetry,
    telemetry,
  });
}
