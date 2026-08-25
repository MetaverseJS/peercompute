import { invokeFetch, readResponseBytesBounded } from '../client/http.js';
import { OSM_ATTRIBUTION_HTML } from '../sources/catalog.js';
import {
  decodeShortbreadTile,
  formatShortbreadTileUrl,
  shortbreadDrawCommands,
  SHORTBREAD_MAX_ZOOM,
  SHORTBREAD_TILEJSON_URL,
  validateShortbreadTileJson,
} from './shortbread.js';
import { buildWaterNurbsOutlines, WATER_NURBS_LIMITS } from './waterNurbs.js';

const TWO_PI = Math.PI * 2;
const WEB_MERCATOR_MAXIMUM_LATITUDE_RADIANS = 85.0511287798066 * Math.PI / 180;
const TILE_SIZE = 512;
const MAXIMUM_TILEJSON_BYTES = 512 * 1024;
const DEFAULT_REQUEST_TIMEOUT_MS = 15_000;
const MAXIMUM_WATER_LEVEL_SAMPLES_PER_BODY = 32;
const MAXIMUM_BUFFER_LINE_SEGMENT_RADIANS = 0.025 * Math.PI / 180;
const BUFFER_POLYGON_GRANULARITY_RADIANS = 0.25 * Math.PI / 180;
const WATER_SPATIAL_INDEX_GRID_SIZE = 16;
const MAXIMUM_ABSOLUTE_RESOLVED_HEIGHT_METERS = 100_000;
const MINIMUM_ROAD_WATER_CLEARANCE_METERS = (
  (6_378_137 + MAXIMUM_ABSOLUTE_RESOLVED_HEIGHT_METERS * 2)
    * (1 - Math.cos(MAXIMUM_BUFFER_LINE_SEGMENT_RADIANS / 2))
  + 0.01
);

export const SHORTBREAD_GEOMETRY_LIMITS = Object.freeze({
  maximumActiveTiles: 24,
  maximumConcurrentRequests: 6,
  maximumCachedTiles: 96,
  maximumTileBytes: 2 * 1024 * 1024,
  maximumTotalBytes: 192 * 1024 * 1024,
  maximumFeaturesPerTile: 10_000,
  maximumActiveVertices: 4_000_000,
  maximumWaterRoadIntersectionTestsPerTile: 2_000_000,
  maximumWaterSampleIntersectionTestsPerQuery: 65_536,
  maximumWaterSegmentIntersectionTestsPerCall: 65_536,
  maximumWaterSampleIntersectionTestsLifetime: 8_000_000,
  // Cesium triangulates PolygonGeometry synchronously. These source-topology
  // caps are enforced before allocating Cartesian rings or invoking Cesium so
  // a global ocean polygon cannot monopolize the browser main thread.
  maximumPolygonSourceRingsPerSurface: 1_024,
  maximumPolygonSourcePositionsPerSurface: 16_384,
});

// Shortbread roads and inland water both begin at z5. EarthGrid uses this
// threshold to truthfully defer the pathological z0-z4 global-ocean polygons
// while retaining the generic planner's z0-compatible default.
export const SHORTBREAD_GEOMETRY_DETAIL_MINIMUM_ZOOM = 5;

export const SHORTBREAD_GEOMETRY_Z_INDEX = Object.freeze({
  waterSurface: 10,
  shoreline: 20,
  building: 30,
  road: 40,
});

export const SHORTBREAD_GEOMETRY_ELEVATION_OFFSETS_METERS = Object.freeze({
  waterSurface: 0,
  shoreline: 0.5,
  building: 1,
  road: 2,
});

export const SHORTBREAD_GEOMETRY_CATEGORY_ORDER = Object.freeze([
  'water-surface',
  'shoreline',
  'building-wireframe',
  'road',
]);

export const SHORTBREAD_GEOMETRY_STYLE = Object.freeze({
  schemaVersion: 'peercompute.geo.shortbread-geometry-style.v1',
  renderingModel: 'actual-cesium-buffer-geometry',
  renderer: 'cesium-buffer-geometry',
  lineMaterialModel: 'Cesium.BufferPolylineMaterial(Color)',
  surfaceMaterialModel: 'Cesium.BufferPolygonMaterial(Color)',
  coordinateModel: 'bounded-rhumb-tessellated-geodetic-segments',
  rasterPainted: false,
  glow: false,
  bloom: false,
  duplicateLinePass: false,
  linePassesPerCurve: 1,
  water: Object.freeze({ color: '#0080ff', alpha: 0.5 }),
  shoreline: Object.freeze({ color: '#24cfff', alpha: 1, width: 1.5 }),
  building: Object.freeze({ color: '#32aaff', alpha: 1, width: 1 }),
  compatibilityZIndex: SHORTBREAD_GEOMETRY_Z_INDEX,
  categoryOrder: SHORTBREAD_GEOMETRY_CATEGORY_ORDER,
  elevationOffsetsMeters: SHORTBREAD_GEOMETRY_ELEVATION_OFFSETS_METERS,
});

function codedError(Type, code, message) {
  const error = new Type(message);
  error.code = code;
  return error;
}

function abortError(message = 'Shortbread geometry request was aborted.') {
  if (typeof DOMException === 'function') return new DOMException(message, 'AbortError');
  const error = new Error(message);
  error.name = 'AbortError';
  return error;
}

function positiveSafeInteger(value, label, maximum) {
  if (!Number.isSafeInteger(value) || value < 1 || (maximum !== undefined && value > maximum)) {
    const suffix = maximum === undefined ? '' : ` no greater than ${maximum}`;
    throw new RangeError(`${label} must be a positive safe integer${suffix}.`);
  }
  return value;
}

function nonNegativeInteger(value, label, maximum = Number.MAX_SAFE_INTEGER) {
  if (!Number.isSafeInteger(value) || value < 0 || value > maximum) {
    throw new RangeError(`${label} must be an integer between zero and ${maximum}.`);
  }
  return value;
}

function finiteCoordinate(position, label = 'coordinate') {
  if (!Array.isArray(position)
    || position.length < 2
    || !Number.isFinite(position[0])
    || !Number.isFinite(position[1])) {
    throw codedError(TypeError, 'ERR_SHORTBREAD_GEOMETRY_INVALID_COORDINATE', `${label} must contain finite longitude and latitude.`);
  }
  const longitude = Number(position[0]);
  const latitude = Number(position[1]);
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    throw codedError(RangeError, 'ERR_SHORTBREAD_GEOMETRY_INVALID_COORDINATE', `${label} is outside WGS84 longitude/latitude bounds.`);
  }
  return Object.freeze([longitude, latitude]);
}

function sameCoordinate(left, right) {
  return left[0] === right[0] && left[1] === right[1];
}

function exactLine(coordinates, { minimum = 2, closed = false, label = 'line' } = {}) {
  if (!Array.isArray(coordinates) || coordinates.length < minimum) {
    throw codedError(TypeError, 'ERR_SHORTBREAD_GEOMETRY_INVALID_TOPOLOGY', `${label} has too few positions.`);
  }
  const line = coordinates.map((position, index) => finiteCoordinate(position, `${label} position ${index}`));
  if (closed && (!sameCoordinate(line[0], line.at(-1)) || line.length < 4)) {
    throw codedError(TypeError, 'ERR_SHORTBREAD_GEOMETRY_INVALID_TOPOLOGY', `${label} must be a closed GeoJSON linear ring.`);
  }
  return Object.freeze(line);
}

function polygonParts(geometry, label) {
  const rawParts = geometry?.type === 'Polygon'
    ? [geometry.coordinates]
    : geometry?.type === 'MultiPolygon'
      ? geometry.coordinates
      : null;
  if (!Array.isArray(rawParts)) {
    throw codedError(TypeError, 'ERR_SHORTBREAD_GEOMETRY_INVALID_TOPOLOGY', `${label} must be a Polygon or MultiPolygon.`);
  }
  return Object.freeze(rawParts.map((rings, polygonIndex) => {
    if (!Array.isArray(rings) || rings.length < 1) {
      throw codedError(TypeError, 'ERR_SHORTBREAD_GEOMETRY_INVALID_TOPOLOGY', `${label} polygon ${polygonIndex} has no outer ring.`);
    }
    return Object.freeze(rings.map((ring, ringIndex) => exactLine(ring, {
      minimum: 4,
      closed: true,
      label: `${label} polygon ${polygonIndex} ring ${ringIndex}`,
    })));
  }));
}

function lineParts(geometry, label) {
  const rawLines = geometry?.type === 'LineString'
    ? [geometry.coordinates]
    : geometry?.type === 'MultiLineString'
      ? geometry.coordinates
      : null;
  if (!Array.isArray(rawLines)) {
    throw codedError(TypeError, 'ERR_SHORTBREAD_GEOMETRY_INVALID_TOPOLOGY', `${label} must be a LineString or MultiLineString.`);
  }
  return Object.freeze(rawLines.map((line, index) => exactLine(line, {
    minimum: 2,
    label: `${label} line ${index}`,
  })));
}

function geometryPositionCount(value) {
  if (!Array.isArray(value)) return 0;
  if (value.length >= 2 && Number.isFinite(value[0]) && Number.isFinite(value[1])) return 1;
  return value.reduce((total, child) => total + geometryPositionCount(child), 0);
}

function freezeDescriptor(value) {
  return Object.freeze(value);
}

function lineMaterial(color, alpha = 1) {
  return Object.freeze({ type: 'Color', color, alpha });
}

function tileCoordinate(value, label, zoom) {
  const coordinate = nonNegativeInteger(value, label);
  if (coordinate >= 2 ** zoom) throw new RangeError(`${label} is outside the z${zoom} tile pyramid.`);
  return coordinate;
}

function normalizedTile(tile) {
  if (!tile || typeof tile !== 'object' || Array.isArray(tile)) throw new TypeError('A Shortbread tile coordinate is required.');
  const z = nonNegativeInteger(tile.z, 'tile.z', SHORTBREAD_MAX_ZOOM);
  const x = tileCoordinate(tile.x, 'tile.x', z);
  const y = tileCoordinate(tile.y, 'tile.y', z);
  const size = tile.size ?? TILE_SIZE;
  positiveSafeInteger(size, 'tile.size');
  return Object.freeze({ x, y, z, size, key: `${z}/${x}/${y}` });
}

export function projectLonLatToShortbreadTilePixel(position, tile) {
  const [longitude, latitude] = finiteCoordinate(position);
  const normalized = normalizedTile(tile);
  const tiles = 2 ** normalized.z;
  const clampedLatitude = Math.max(-85.0511287798066, Math.min(85.0511287798066, latitude));
  const latitudeRadians = clampedLatitude * Math.PI / 180;
  const worldX = ((longitude + 180) / 360) * tiles;
  const worldY = (1 - Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) / Math.PI) / 2 * tiles;
  return Object.freeze([
    (worldX - normalized.x) * normalized.size,
    (worldY - normalized.y) * normalized.size,
  ]);
}

function projectLonLatToWrappedTilePixel(position, tile) {
  const [longitude, latitude] = finiteCoordinate(position);
  const normalized = normalizedTile(tile);
  const tiles = 2 ** normalized.z;
  const clampedLatitude = Math.max(-85.0511287798066, Math.min(85.0511287798066, latitude));
  const latitudeRadians = clampedLatitude * Math.PI / 180;
  const unwrappedWorldX = ((longitude + 180) / 360) * tiles;
  const worldXCandidates = [unwrappedWorldX - tiles, unwrappedWorldX, unwrappedWorldX + tiles];
  const tileCenterX = normalized.x + 0.5;
  let worldX = worldXCandidates[0];
  for (const candidate of worldXCandidates.slice(1)) {
    if (Math.abs(candidate - tileCenterX) < Math.abs(worldX - tileCenterX)) worldX = candidate;
  }
  const worldY = (1 - Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) / Math.PI) / 2 * tiles;
  return Object.freeze([
    (worldX - normalized.x) * normalized.size,
    (worldY - normalized.y) * normalized.size,
  ]);
}

function tileKeysContainingLonLat(position, zoom) {
  const [longitude, latitude] = finiteCoordinate(position);
  const tiles = 2 ** zoom;
  const clampedLatitude = Math.max(-85.0511287798066, Math.min(85.0511287798066, latitude));
  const latitudeRadians = clampedLatitude * Math.PI / 180;
  const worldX = ((longitude + 180) / 360) * tiles;
  const worldY = (1 - Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) / Math.PI) / 2 * tiles;
  const xFloor = Math.floor(worldX);
  const yFloor = Math.max(0, Math.min(tiles - 1, Math.floor(worldY)));
  const xValues = new Set([((xFloor % tiles) + tiles) % tiles]);
  const yValues = new Set([yFloor]);
  const epsilon = 1e-10;
  if (Math.abs(worldX - Math.round(worldX)) <= epsilon) {
    const previous = Math.round(worldX) - 1;
    xValues.add(((previous % tiles) + tiles) % tiles);
  }
  if (Math.abs(worldY - Math.round(worldY)) <= epsilon) {
    const previous = Math.round(worldY) - 1;
    if (previous >= 0 && previous < tiles) yValues.add(previous);
  }
  const keys = [];
  for (const y of [...yValues].sort((left, right) => left - right)) {
    for (const x of [...xValues].sort((left, right) => left - right)) keys.push(`${zoom}/${x}/${y}`);
  }
  return Object.freeze(keys);
}

export function shortbreadTilePixelToLonLat(position, tile) {
  if (!Array.isArray(position)
    || position.length < 2
    || !Number.isFinite(position[0])
    || !Number.isFinite(position[1])) {
    throw new TypeError('Finite Shortbread tile-pixel coordinates are required.');
  }
  const normalized = normalizedTile(tile);
  const tiles = 2 ** normalized.z;
  const worldX = normalized.x + Number(position[0]) / normalized.size;
  const worldY = normalized.y + Number(position[1]) / normalized.size;
  const longitude = worldX / tiles * 360 - 180;
  const mercatorY = Math.PI * (1 - 2 * worldY / tiles);
  const latitude = Math.atan(Math.sinh(mercatorY)) * 180 / Math.PI;
  return Object.freeze([longitude, latitude]);
}

function waterNurbsForCommands(commands, tile, waterNurbsLimits) {
  const rings = [];
  for (let commandIndex = 0; commandIndex < commands.length; commandIndex += 1) {
    const command = commands[commandIndex];
    if (command?.kind !== 'water' || command.nurbsOutline === false) continue;
    for (const polygon of polygonParts(command.geometry, `water command ${commandIndex}`)) {
      for (const ring of polygon) {
        rings.push(ring.map((position) => projectLonLatToShortbreadTilePixel(position, tile)));
      }
    }
  }
  const outlines = buildWaterNurbsOutlines(rings, {
    tileSize: tile.size,
    ...waterNurbsLimits,
  });
  if (outlines.invalidRingCount > 0) {
    throw codedError(
      TypeError,
      'ERR_SHORTBREAD_GEOMETRY_INVALID_SHORELINE',
      `Shortbread water geometry contains ${outlines.invalidRingCount} invalid shoreline ring(s).`,
    );
  }
  return outlines;
}

function validateWaterNurbsLimits(overrides) {
  if (overrides === undefined || overrides === null) return Object.freeze({ ...WATER_NURBS_LIMITS });
  if (typeof overrides !== 'object' || Array.isArray(overrides)) throw new TypeError('waterNurbsLimits must be an object.');
  const limits = { ...WATER_NURBS_LIMITS };
  for (const [key, value] of Object.entries(overrides)) {
    if (!(key in WATER_NURBS_LIMITS)) throw new TypeError(`Unknown water NURBS limit ${key}.`);
    const valid = key === 'tileEdgeEpsilonPixels'
      ? Number.isFinite(value) && value >= 0
      : Number.isSafeInteger(value) && value >= 1;
    if (!valid || value > WATER_NURBS_LIMITS[key]) {
      throw new RangeError(`${key} cannot exceed the hard water NURBS limit.`);
    }
    limits[key] = value;
  }
  return Object.freeze(limits);
}

function planCounts(descriptors, commands, waterNurbs, deferral) {
  const count = (kind) => descriptors.filter((descriptor) => descriptor.kind === kind).length;
  const vertexCount = descriptors.reduce((total, descriptor) => (
    total + (descriptor.kind === 'water-surface'
      ? geometryPositionCount(descriptor.rings)
      : descriptor.positions.length)
  ), 0);
  return Object.freeze({
    commandCount: commands.length,
    waterCommandCount: commands.filter((command) => command?.kind === 'water').length,
    buildingCommandCount: commands.filter((command) => command?.kind === 'building').length,
    roadCommandCount: commands.filter((command) => command?.kind === 'road').length,
    waterSurfaceCount: count('water-surface'),
    shorelineCurveCount: count('shoreline'),
    buildingWireframeCount: count('building-wireframe'),
    roadCurveCount: count('road'),
    entityCount: descriptors.length,
    vertexCount,
    waterNurbsSourceRingCount: waterNurbs.sourceRingCount,
    waterNurbsSuppressedBoundarySegmentCount: waterNurbs.suppressedBoundarySegmentCount,
    waterNurbsFullyClippedRingCount: waterNurbs.fullyClippedRingCount,
    deferredCommandCount: deferral.commandCount,
    deferredWaterCommandCount: deferral.waterCommandCount,
    deferredSourcePositionCount: deferral.sourcePositionCount,
  });
}

function shorelineCoordinateKey(position) {
  return `${Math.round(position[0] * 1e8)}:${Math.round(position[1] * 1e8)}`;
}

function shorelineSegmentKey(left, right) {
  const leftKey = shorelineCoordinateKey(left);
  const rightKey = shorelineCoordinateKey(right);
  return leftKey < rightKey ? `${leftKey}|${rightKey}` : `${rightKey}|${leftKey}`;
}

function waterSegmentBodyIndex(waterSurfaces) {
  const index = new Map();
  for (const surface of waterSurfaces) {
    for (const ring of surface.rings) {
      for (let positionIndex = 0; positionIndex < ring.length - 1; positionIndex += 1) {
        const key = shorelineSegmentKey(ring[positionIndex], ring[positionIndex + 1]);
        if (!index.has(key)) index.set(key, surface.waterBodyId);
      }
    }
  }
  return index;
}

function shorelineWaterBodyId(positions, segmentBodyIndex) {
  if (positions.length < 2) return null;
  return segmentBodyIndex.get(shorelineSegmentKey(positions[0], positions[1])) ?? null;
}

export function planShortbreadGeometry(commands, tile, {
  maximumFeaturesPerTile = SHORTBREAD_GEOMETRY_LIMITS.maximumFeaturesPerTile,
  maximumVertices = SHORTBREAD_GEOMETRY_LIMITS.maximumActiveVertices,
  minimumGeometryZoom = 0,
  waterNurbsLimits,
} = {}) {
  if (!Array.isArray(commands)) throw new TypeError('Shortbread draw commands must be an array.');
  positiveSafeInteger(
    maximumFeaturesPerTile,
    'maximumFeaturesPerTile',
    SHORTBREAD_GEOMETRY_LIMITS.maximumFeaturesPerTile,
  );
  positiveSafeInteger(maximumVertices, 'maximumVertices', SHORTBREAD_GEOMETRY_LIMITS.maximumActiveVertices);
  if (commands.length > maximumFeaturesPerTile) {
    throw codedError(
      RangeError,
      'ERR_SHORTBREAD_GEOMETRY_FEATURE_CAP',
      `Shortbread geometry exceeds the ${maximumFeaturesPerTile}-feature tile cap.`,
    );
  }
  const normalized = normalizedTile(tile);
  nonNegativeInteger(minimumGeometryZoom, 'minimumGeometryZoom', SHORTBREAD_MAX_ZOOM);
  const geometryDeferred = normalized.z < minimumGeometryZoom;
  const plannedCommands = geometryDeferred ? [] : commands;
  const deferredWaterCommands = geometryDeferred
    ? commands.filter((command) => command?.kind === 'water')
    : [];
  const deferral = Object.freeze({
    active: geometryDeferred,
    reason: geometryDeferred ? 'broad-view-below-buffer-geometry-detail-zoom' : null,
    minimumGeometryZoom,
    tileZoom: normalized.z,
    commandCount: geometryDeferred ? commands.length : 0,
    waterCommandCount: deferredWaterCommands.length,
    sourcePositionCount: geometryDeferred
      ? commands.reduce((total, command) => total + geometryPositionCount(command?.geometry?.coordinates), 0)
      : 0,
  });
  const boundedWaterNurbsLimits = validateWaterNurbsLimits(waterNurbsLimits);
  const waterNurbs = waterNurbsForCommands(plannedCommands, normalized, boundedWaterNurbsLimits);
  const descriptors = [];
  let waterIndex = 0;
  let shorelineIndex = 0;
  let buildingIndex = 0;
  let roadIndex = 0;

  // Explicit category passes make the road-over-water contract independent of
  // decoder or caller ordering.
  for (let commandIndex = 0; commandIndex < plannedCommands.length; commandIndex += 1) {
    const command = plannedCommands[commandIndex];
    if (command?.kind !== 'water') continue;
    for (const rings of polygonParts(command.geometry, `water command ${commandIndex}`)) {
      const waterBodyId = `water-body-${String(waterIndex).padStart(6, '0')}`;
      descriptors.push(freezeDescriptor({
        id: `water-surface-${String(waterIndex).padStart(6, '0')}`,
        waterBodyId,
        kind: 'water-surface',
        geometryModel: 'flat-water-level-buffer-polygon',
        sourceKind: command.category ?? 'water',
        rings,
        material: lineMaterial(SHORTBREAD_GEOMETRY_STYLE.water.color, 0.5),
        alpha: 0.5,
        elevationOffsetMeters: SHORTBREAD_GEOMETRY_ELEVATION_OFFSETS_METERS.waterSurface,
        categoryOrderIndex: 0,
        renderPass: 10,
      }));
      waterIndex += 1;
    }
  }

  const waterSurfaces = descriptors.filter((descriptor) => descriptor.kind === 'water-surface');
  const segmentBodyIndex = waterSegmentBodyIndex(waterSurfaces);
  for (const curve of waterNurbs.curves) {
    const positions = Object.freeze(
      curve.points.map((position) => shortbreadTilePixelToLonLat(position, normalized)),
    );
    descriptors.push(freezeDescriptor({
      id: `shoreline-${String(shorelineIndex).padStart(6, '0')}`,
      kind: 'shoreline',
      geometryModel: 'exact-degree-one-nurbs-polyline',
      positions,
      waterBodyId: shorelineWaterBodyId(positions, segmentBodyIndex),
      material: lineMaterial(SHORTBREAD_GEOMETRY_STYLE.shoreline.color),
      width: SHORTBREAD_GEOMETRY_STYLE.shoreline.width,
      elevationOffsetMeters: SHORTBREAD_GEOMETRY_ELEVATION_OFFSETS_METERS.shoreline,
      categoryOrderIndex: 1,
      renderPass: 20,
      linePassCount: 1,
      nurbs: Object.freeze({
        degree: 1,
        rationalWeights: 'uniform-unit',
        knotModel: curve.knotModel,
        closed: curve.closed,
        maximumSourceDeviationPixels: 0,
      }),
    }));
    shorelineIndex += 1;
  }

  for (let commandIndex = 0; commandIndex < plannedCommands.length; commandIndex += 1) {
    const command = plannedCommands[commandIndex];
    if (command?.kind !== 'building') continue;
    for (const polygon of polygonParts(command.geometry, `building command ${commandIndex}`)) {
      for (const ring of polygon) {
        descriptors.push(freezeDescriptor({
          id: `building-wireframe-${String(buildingIndex).padStart(6, '0')}`,
          kind: 'building-wireframe',
          geometryModel: 'source-footprint-wireframe',
          positions: ring,
          material: lineMaterial(SHORTBREAD_GEOMETRY_STYLE.building.color),
          width: SHORTBREAD_GEOMETRY_STYLE.building.width,
          elevationOffsetMeters: SHORTBREAD_GEOMETRY_ELEVATION_OFFSETS_METERS.building,
          categoryOrderIndex: 2,
          renderPass: 30,
          linePassCount: 1,
        }));
        buildingIndex += 1;
      }
    }
  }

  for (let commandIndex = 0; commandIndex < plannedCommands.length; commandIndex += 1) {
    const command = plannedCommands[commandIndex];
    if (command?.kind !== 'road') continue;
    for (const line of lineParts(command.geometry, `road command ${commandIndex}`)) {
      descriptors.push(freezeDescriptor({
        id: `road-${String(roadIndex).padStart(6, '0')}`,
        kind: 'road',
        geometryModel: 'exact-degree-one-nurbs-source-path',
        category: String(command.category ?? 'other'),
        positions: line,
        material: lineMaterial(
          typeof command.stroke === 'string' && command.stroke.length > 0 ? command.stroke : '#35ff76',
        ),
        width: Math.max(1, Number.isFinite(command.width) ? Number(command.width) : 1),
        elevationOffsetMeters: SHORTBREAD_GEOMETRY_ELEVATION_OFFSETS_METERS.road,
        categoryOrderIndex: 3,
        renderPass: 40,
        linePassCount: 1,
        nurbs: Object.freeze({
          degree: 1,
          rationalWeights: 'uniform-unit',
          knotModel: 'open-clamped-uniform-per-source-path',
          maximumSourceDeviationDegrees: 0,
        }),
      }));
      roadIndex += 1;
    }
  }

  const counts = planCounts(descriptors, commands, waterNurbs, deferral);
  if (counts.vertexCount > maximumVertices) {
    throw codedError(
      RangeError,
      'ERR_SHORTBREAD_GEOMETRY_VERTEX_CAP',
      `Shortbread geometry exceeds the ${maximumVertices}-vertex cap.`,
    );
  }
  return Object.freeze({
    schemaVersion: 'peercompute.geo.shortbread-geometry-plan.v1',
    tile: normalized,
    renderingModel: 'actual-cesium-buffer-geometry',
    renderer: 'cesium-buffer-geometry',
    geometryBackend: 'Cesium.BufferPolygonCollection/Cesium.BufferPolylineCollection',
    categoryOrder: SHORTBREAD_GEOMETRY_CATEGORY_ORDER,
    elevationOffsetsMeters: SHORTBREAD_GEOMETRY_ELEVATION_OFFSETS_METERS,
    rasterPainted: false,
    glow: false,
    linePassesPerCurve: 1,
    roadPrecedence: Object.freeze({
      independentOfInputOrder: true,
      topmost: true,
      categoryOrderIndex: 3,
      elevationOffsetMeters: SHORTBREAD_GEOMETRY_ELEVATION_OFFSETS_METERS.road,
    }),
    compatibilityZIndex: SHORTBREAD_GEOMETRY_Z_INDEX,
    deferral,
    waterNurbs,
    counts,
    descriptors: Object.freeze(descriptors),
  });
}

function normalizeLongitudeRadians(longitude) {
  if (longitude === Math.PI) return Math.PI;
  let result = (longitude + Math.PI) % TWO_PI;
  if (result < 0) result += TWO_PI;
  return result - Math.PI;
}

function normalizedRectangle(rectangle) {
  if (!rectangle || typeof rectangle !== 'object' || Array.isArray(rectangle)) {
    throw new TypeError('A camera view rectangle in radians is required.');
  }
  const values = ['west', 'south', 'east', 'north'].map((key) => Number(rectangle[key]));
  if (!values.every(Number.isFinite)) throw new TypeError('Camera view rectangle bounds must be finite radians.');
  let [west, south, east, north] = values;
  if (Math.abs(west) > Math.PI || Math.abs(east) > Math.PI
    || south < -Math.PI / 2 || north > Math.PI / 2 || south > north) {
    throw new RangeError('Camera view rectangle is outside valid radian bounds.');
  }
  const rawWidth = east - west;
  const world = Math.abs(rawWidth) >= TWO_PI - 1e-12;
  west = normalizeLongitudeRadians(west);
  east = normalizeLongitudeRadians(east);
  const datelineWrapped = !world && (rawWidth < 0 || west > east);
  const longitudeSpan = world
    ? TWO_PI
    : datelineWrapped
      ? Math.max(Number.EPSILON, Math.PI - west + east + Math.PI)
      : Math.max(Number.EPSILON, east - west);
  south = Math.max(-WEB_MERCATOR_MAXIMUM_LATITUDE_RADIANS, south);
  north = Math.min(WEB_MERCATOR_MAXIMUM_LATITUDE_RADIANS, north);
  if (south > north) {
    const midpoint = Math.max(
      -WEB_MERCATOR_MAXIMUM_LATITUDE_RADIANS,
      Math.min(WEB_MERCATOR_MAXIMUM_LATITUDE_RADIANS, (values[1] + values[3]) / 2),
    );
    south = midpoint;
    north = midpoint;
  }
  return Object.freeze({ west, south, east, north, world, datelineWrapped, longitudeSpan });
}

function mercatorWorldY(latitudeRadians) {
  const clamped = Math.max(
    -WEB_MERCATOR_MAXIMUM_LATITUDE_RADIANS,
    Math.min(WEB_MERCATOR_MAXIMUM_LATITUDE_RADIANS, latitudeRadians),
  );
  return (1 - Math.log(Math.tan(clamped) + 1 / Math.cos(clamped)) / Math.PI) / 2;
}

function estimateTargetZoom(rectangle, minimumZoom, maximumZoom, viewportWidth, viewportHeight) {
  const horizontalFraction = Math.max(Number.EPSILON, rectangle.longitudeSpan / TWO_PI);
  const verticalFraction = Math.max(
    Number.EPSILON,
    Math.abs(mercatorWorldY(rectangle.south) - mercatorWorldY(rectangle.north)),
  );
  const horizontal = Math.floor(Math.log2(Math.max(1, viewportWidth) / TILE_SIZE / horizontalFraction));
  const vertical = Math.floor(Math.log2(Math.max(1, viewportHeight) / TILE_SIZE / verticalFraction));
  return Math.max(minimumZoom, Math.min(maximumZoom, Math.min(horizontal, vertical)));
}

function tileX(longitudeRadians, zoom) {
  const count = 2 ** zoom;
  return Math.max(0, Math.min(count - 1, Math.floor((longitudeRadians + Math.PI) / TWO_PI * count)));
}

function tileY(latitudeRadians, zoom) {
  const count = 2 ** zoom;
  return Math.max(0, Math.min(count - 1, Math.floor(mercatorWorldY(latitudeRadians) * count)));
}

function tileSelectionBounds(rectangle, zoom) {
  const count = 2 ** zoom;
  let xRanges;
  if (rectangle.world) {
    xRanges = [[0, count - 1]];
  } else {
    const westX = tileX(rectangle.west, zoom);
    const eastX = tileX(rectangle.east, zoom);
    xRanges = rectangle.datelineWrapped
      ? [[westX, count - 1], [0, eastX]]
      : [[westX, eastX]];
  }
  const northY = tileY(rectangle.north, zoom);
  const southY = tileY(rectangle.south, zoom);
  const xCount = xRanges.reduce((total, [first, last]) => total + last - first + 1, 0);
  return Object.freeze({ xRanges, northY, southY, tileCount: xCount * (southY - northY + 1) });
}

function enumerateTiles(rectangle, zoom, bounds = tileSelectionBounds(rectangle, zoom)) {
  const tiles = [];
  for (let y = bounds.northY; y <= bounds.southY; y += 1) {
    for (const [firstX, lastX] of bounds.xRanges) {
      for (let x = firstX; x <= lastX; x += 1) {
        tiles.push(Object.freeze({ x, y, z: zoom, key: `${zoom}/${x}/${y}` }));
      }
    }
  }
  return tiles;
}

export function selectShortbreadGeometryTiles(rectangle, {
  minimumZoom = 0,
  maximumZoom = SHORTBREAD_MAX_ZOOM,
  targetZoom,
  maximumActiveTiles = SHORTBREAD_GEOMETRY_LIMITS.maximumActiveTiles,
  viewportWidth = 1024,
  viewportHeight = 768,
} = {}) {
  nonNegativeInteger(minimumZoom, 'minimumZoom', SHORTBREAD_MAX_ZOOM);
  nonNegativeInteger(maximumZoom, 'maximumZoom', SHORTBREAD_MAX_ZOOM);
  if (maximumZoom < minimumZoom) throw new RangeError('maximumZoom must not be below minimumZoom.');
  positiveSafeInteger(
    maximumActiveTiles,
    'maximumActiveTiles',
    SHORTBREAD_GEOMETRY_LIMITS.maximumActiveTiles,
  );
  if (!Number.isFinite(viewportWidth) || viewportWidth <= 0
    || !Number.isFinite(viewportHeight) || viewportHeight <= 0) {
    throw new RangeError('Viewport dimensions must be positive finite numbers.');
  }
  const normalized = normalizedRectangle(rectangle);
  const requestedZoom = targetZoom === undefined
    ? estimateTargetZoom(normalized, minimumZoom, maximumZoom, viewportWidth, viewportHeight)
    : nonNegativeInteger(targetZoom, 'targetZoom', SHORTBREAD_MAX_ZOOM);
  let selectedZoom = Math.max(minimumZoom, Math.min(maximumZoom, requestedZoom));
  let bounds = tileSelectionBounds(normalized, selectedZoom);
  while (bounds.tileCount > maximumActiveTiles && selectedZoom > minimumZoom) {
    selectedZoom -= 1;
    bounds = tileSelectionBounds(normalized, selectedZoom);
  }
  if (bounds.tileCount > maximumActiveTiles) {
    throw codedError(
      RangeError,
      'ERR_SHORTBREAD_ACTIVE_TILE_CAP',
      `Camera selection cannot fit inside the ${maximumActiveTiles}-active-tile cap at z${minimumZoom}.`,
    );
  }
  const tiles = enumerateTiles(normalized, selectedZoom, bounds);
  return Object.freeze({
    schemaVersion: 'peercompute.geo.shortbread-tile-selection.v1',
    requestedZoom,
    selectedZoom,
    lodReductions: Math.max(0, requestedZoom - selectedZoom),
    maximumActiveTiles,
    datelineWrapped: normalized.datelineWrapped,
    world: normalized.world,
    tileCount: tiles.length,
    keys: Object.freeze(tiles.map((tile) => tile.key)),
    tiles: Object.freeze(tiles),
  });
}

function boundedLimits(options) {
  const limits = {};
  for (const [key, hardMaximum] of Object.entries(SHORTBREAD_GEOMETRY_LIMITS)) {
    limits[key] = positiveSafeInteger(options[key] ?? hardMaximum, key, hardMaximum);
  }
  if (limits.maximumCachedTiles < limits.maximumActiveTiles) {
    throw new RangeError('maximumCachedTiles must be at least maximumActiveTiles.');
  }
  return Object.freeze(limits);
}

function combineSignals(signals) {
  const present = signals.filter(Boolean);
  if (present.length === 0) return undefined;
  if (present.length === 1) return present[0];
  if (typeof AbortSignal?.any === 'function') return AbortSignal.any(present);
  const controller = new AbortController();
  const abort = () => controller.abort();
  for (const signal of present) {
    if (signal.aborted) {
      controller.abort();
      break;
    }
    signal.addEventListener('abort', abort, { once: true });
  }
  return controller.signal;
}

async function fetchBytes(fetchImpl, url, { maximumBytes, signal, tooLargeCode }) {
  const response = await invokeFetch(fetchImpl, url, {
    method: 'GET',
    headers: { accept: 'application/vnd.mapbox-vector-tile,application/x-protobuf,application/octet-stream' },
    credentials: 'omit',
    redirect: 'error',
    signal,
  });
  if (!response.ok) throw new Error(`Shortbread upstream returned HTTP ${response.status}.`);
  return readResponseBytesBounded(response, {
    maximumBytes,
    label: 'Shortbread geometry response',
    tooLargeCode,
  });
}

function cesiumColor(Cesium, material) {
  return Cesium.Color.fromCssColorString(material.color).withAlpha(material.alpha);
}

const BUFFER_CATEGORY_SPECS = Object.freeze([
  Object.freeze({
    kind: 'water-surface',
    offsetKey: 'waterSurface',
    geometryType: 'polygon',
    blend: 'translucent',
    heightMode: 'water-level',
  }),
  Object.freeze({
    kind: 'shoreline',
    offsetKey: 'shoreline',
    geometryType: 'polyline',
    blend: 'opaque',
    heightMode: 'water-level',
  }),
  Object.freeze({
    kind: 'building-wireframe',
    offsetKey: 'building',
    geometryType: 'polyline',
    blend: 'opaque',
    heightMode: 'terrain',
  }),
  Object.freeze({
    kind: 'road',
    offsetKey: 'road',
    geometryType: 'polyline',
    blend: 'opaque',
    heightMode: 'terrain',
  }),
]);

function validateCesiumBufferApi(Cesium) {
  if (!Cesium?.BufferPolygonCollection || !Cesium?.BufferPolygonMaterial
    || !Cesium?.BufferPolylineCollection || !Cesium?.BufferPolylineMaterial
    || !Cesium?.Cartesian3 || !Cesium?.Cartographic || !Cesium?.Color
    || !Cesium?.EllipsoidRhumbLine || !Cesium?.PolygonGeometry || !Cesium?.PolygonHierarchy
    || !Cesium?.VertexFormat || !Cesium?.ArcType || !Cesium?.BlendOption || !Cesium?.Ellipsoid) {
    throw new TypeError('Cesium 1.144 buffer polygon and polyline geometry APIs are required.');
  }
}

function validateElevationOffsets(overrides) {
  if (overrides === undefined || overrides === null) {
    return Object.freeze({ ...SHORTBREAD_GEOMETRY_ELEVATION_OFFSETS_METERS });
  }
  if (typeof overrides !== 'object' || Array.isArray(overrides)) {
    throw new TypeError('categoryElevationOffsetsMeters must be an object.');
  }
  const offsets = { ...SHORTBREAD_GEOMETRY_ELEVATION_OFFSETS_METERS };
  for (const [key, value] of Object.entries(overrides)) {
    if (!(key in offsets)) throw new TypeError(`Unknown Shortbread geometry elevation category ${key}.`);
    if (!Number.isFinite(value) || Math.abs(value) > 100_000) {
      throw new RangeError(`${key} elevation offset must be finite and within 100000 meters of the resolved height.`);
    }
    offsets[key] = Number(value);
  }
  if (!(offsets.waterSurface < offsets.shoreline
    && offsets.shoreline < offsets.building
    && offsets.building < offsets.road)) {
    throw new RangeError('Shortbread elevation offsets must strictly preserve water, shoreline, building, then road order.');
  }
  if (offsets.road - offsets.waterSurface < MINIMUM_ROAD_WATER_CLEARANCE_METERS) {
    throw codedError(
      RangeError,
      'ERR_SHORTBREAD_ROAD_WATER_CLEARANCE',
      `Shortbread road/water elevation clearance must be at least ${MINIMUM_ROAD_WATER_CLEARANCE_METERS} meters.`,
    );
  }
  return Object.freeze(offsets);
}

function deriveWaterBodyLevels(plan, heightResolver, heightResolutionStats) {
  const levels = new Map();
  const waterSurfaces = plan.descriptors.filter((descriptor) => descriptor.kind === 'water-surface');
  for (const descriptor of waterSurfaces) {
    if (descriptor.sourceKind === 'ocean') {
      levels.set(descriptor.waterBodyId, 0);
      heightResolutionStats.oceanWaterBodyCount += 1;
      continue;
    }
    if (!heightResolver) {
      levels.set(descriptor.waterBodyId, 0);
      heightResolutionStats.fallbackInlandWaterBodyCount += 1;
      continue;
    }
    const outerRing = openPolygonRing(descriptor.rings[0]);
    const sampleCount = Math.min(outerRing.length, MAXIMUM_WATER_LEVEL_SAMPLES_PER_BODY);
    const resolved = [];
    for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
      const positionIndex = Math.floor(sampleIndex * outerRing.length / sampleCount);
      const [longitude, latitude] = outerRing[positionIndex];
      const value = heightResolver(longitude, latitude, descriptor);
      heightResolutionStats.waterLevelSampleCount += 1;
      if (value && typeof value.then === 'function') {
        throw codedError(
          TypeError,
          'ERR_SHORTBREAD_ASYNC_HEIGHT_RESOLVER',
          'heightResolver must return a synchronous finite terrain height.',
        );
      }
      if (value === undefined || value === null) {
        heightResolutionStats.unresolvedWaterLevelSampleCount += 1;
        continue;
      }
      if (!Number.isFinite(value) || Math.abs(value) > MAXIMUM_ABSOLUTE_RESOLVED_HEIGHT_METERS) {
        throw codedError(
          TypeError,
          'ERR_SHORTBREAD_INVALID_RESOLVED_HEIGHT',
          `heightResolver must return a synchronous finite terrain height within ${MAXIMUM_ABSOLUTE_RESOLVED_HEIGHT_METERS} meters of zero or undefined while terrain is unavailable.`,
        );
      }
      resolved.push(Number(value));
      heightResolutionStats.resolvedWaterLevelSampleCount += 1;
    }
    if (resolved.length === 0) {
      levels.set(descriptor.waterBodyId, 0);
      heightResolutionStats.fallbackInlandWaterBodyCount += 1;
      continue;
    }
    resolved.sort((left, right) => left - right);
    const middle = Math.floor(resolved.length / 2);
    const level = resolved.length % 2 === 0
      ? (resolved[middle - 1] + resolved[middle]) / 2
      : resolved[middle];
    levels.set(descriptor.waterBodyId, level);
    heightResolutionStats.derivedInlandWaterBodyCount += 1;
  }
  for (const descriptor of plan.descriptors) {
    if (descriptor.kind === 'shoreline' && !levels.has(descriptor.waterBodyId)) {
      heightResolutionStats.unmatchedShorelineCount += 1;
    }
  }
  return levels;
}

function consumeIntersectionTest(budget) {
  if (!budget) return;
  if (budget.count >= budget.maximum) {
    throw codedError(
      RangeError,
      budget.errorCode,
      `${budget.label} exceeds the ${budget.maximum}-test cap.`,
    );
  }
  budget.count += 1;
}

function pointOnSegment2D(point, left, right, epsilon = 1e-8) {
  const cross = (point[1] - left[1]) * (right[0] - left[0])
    - (point[0] - left[0]) * (right[1] - left[1]);
  if (Math.abs(cross) > epsilon) return false;
  return point[0] >= Math.min(left[0], right[0]) - epsilon
    && point[0] <= Math.max(left[0], right[0]) + epsilon
    && point[1] >= Math.min(left[1], right[1]) - epsilon
    && point[1] <= Math.max(left[1], right[1]) + epsilon;
}

function segmentIntersectsSegment2D(a, b, c, d) {
  const orientation = (left, middle, right) => (
    (middle[1] - left[1]) * (right[0] - middle[0])
      - (middle[0] - left[0]) * (right[1] - middle[1])
  );
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);
  if (((o1 > 0 && o2 < 0) || (o1 < 0 && o2 > 0))
    && ((o3 > 0 && o4 < 0) || (o3 < 0 && o4 > 0))) return true;
  return (Math.abs(o1) <= 1e-8 && pointOnSegment2D(c, a, b))
    || (Math.abs(o2) <= 1e-8 && pointOnSegment2D(d, a, b))
    || (Math.abs(o3) <= 1e-8 && pointOnSegment2D(a, c, d))
    || (Math.abs(o4) <= 1e-8 && pointOnSegment2D(b, c, d));
}

function pointInRing2D(point, ring, budget) {
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index, index += 1) {
    consumeIntersectionTest(budget);
    const left = ring[previous];
    const right = ring[index];
    if (pointOnSegment2D(point, left, right)) return true;
    const crosses = (left[1] > point[1]) !== (right[1] > point[1])
      && point[0] < (right[0] - left[0]) * (point[1] - left[1]) / (right[1] - left[1]) + left[0];
    if (crosses) inside = !inside;
  }
  return inside;
}

function pointInWaterPolygon2D(point, rings, budget) {
  if (!pointInRing2D(point, rings[0], budget)) return false;
  for (let ringIndex = 1; ringIndex < rings.length; ringIndex += 1) {
    if (pointInRing2D(point, rings[ringIndex], budget)) return false;
  }
  return true;
}

function segmentIntersectsWaterPolygon2D(left, right, rings, budget) {
  if (pointInWaterPolygon2D(left, rings, budget) || pointInWaterPolygon2D(right, rings, budget)) return true;
  const midpoint = [(left[0] + right[0]) / 2, (left[1] + right[1]) / 2];
  if (pointInWaterPolygon2D(midpoint, rings, budget)) return true;
  for (const ring of rings) {
    for (let index = 0; index < ring.length - 1; index += 1) {
      consumeIntersectionTest(budget);
      if (segmentIntersectsSegment2D(left, right, ring[index], ring[index + 1])) return true;
    }
  }
  return false;
}

function boundsForRings(rings) {
  const bounds = {
    minimumX: Number.POSITIVE_INFINITY,
    minimumY: Number.POSITIVE_INFINITY,
    maximumX: Number.NEGATIVE_INFINITY,
    maximumY: Number.NEGATIVE_INFINITY,
  };
  for (const ring of rings) {
    for (const [x, y] of ring) {
      bounds.minimumX = Math.min(bounds.minimumX, x);
      bounds.minimumY = Math.min(bounds.minimumY, y);
      bounds.maximumX = Math.max(bounds.maximumX, x);
      bounds.maximumY = Math.max(bounds.maximumY, y);
    }
  }
  return Object.freeze(bounds);
}

function boundsForSegment(left, right) {
  return Object.freeze({
    minimumX: Math.min(left[0], right[0]),
    minimumY: Math.min(left[1], right[1]),
    maximumX: Math.max(left[0], right[0]),
    maximumY: Math.max(left[1], right[1]),
  });
}

function unwrapTilePixelLine(positions, tile, referenceX) {
  const period = tile.size * 2 ** tile.z;
  const projected = positions.map((position) => projectLonLatToShortbreadTilePixel(position, tile));
  if (projected.length === 0) return projected;
  if (Number.isFinite(referenceX)) {
    const candidates = [projected[0][0] - period, projected[0][0], projected[0][0] + period];
    let selected = candidates[0];
    for (const candidate of candidates.slice(1)) {
      if (Math.abs(candidate - referenceX) < Math.abs(selected - referenceX)) selected = candidate;
    }
    projected[0] = Object.freeze([selected, projected[0][1]]);
  }
  for (let index = 1; index < projected.length; index += 1) {
    const previousX = projected[index - 1][0];
    const candidates = [projected[index][0] - period, projected[index][0], projected[index][0] + period];
    let selected = candidates[0];
    for (const candidate of candidates.slice(1)) {
      if (Math.abs(candidate - previousX) < Math.abs(selected - previousX)) selected = candidate;
    }
    projected[index] = Object.freeze([selected, projected[index][1]]);
  }
  return projected;
}

function boundsContainPoint(bounds, point) {
  return point[0] >= bounds.minimumX && point[0] <= bounds.maximumX
    && point[1] >= bounds.minimumY && point[1] <= bounds.maximumY;
}

function boundsIntersect(left, right) {
  return left.minimumX <= right.maximumX && left.maximumX >= right.minimumX
    && left.minimumY <= right.maximumY && left.maximumY >= right.minimumY;
}

function gridCellCoordinate(value, tileSize) {
  return Math.max(0, Math.min(
    WATER_SPATIAL_INDEX_GRID_SIZE - 1,
    Math.floor(value / tileSize * WATER_SPATIAL_INDEX_GRID_SIZE),
  ));
}

function gridCellRange(bounds, tileSize) {
  return Object.freeze({
    minimumX: gridCellCoordinate(bounds.minimumX, tileSize),
    minimumY: gridCellCoordinate(bounds.minimumY, tileSize),
    maximumX: gridCellCoordinate(bounds.maximumX, tileSize),
    maximumY: gridCellCoordinate(bounds.maximumY, tileSize),
  });
}

function gridCellIndex(x, y) {
  return y * WATER_SPATIAL_INDEX_GRID_SIZE + x;
}

function createWaterSurfaceSpatialIndex(plan, waterBodyLevels, waterSurfaceOffsetMeters) {
  const cells = Array.from(
    { length: WATER_SPATIAL_INDEX_GRID_SIZE ** 2 },
    () => [],
  );
  const surfaces = [];
  let cellAssignmentCount = 0;
  for (const descriptor of plan.descriptors) {
    if (descriptor.kind !== 'water-surface') continue;
    const outerRing = unwrapTilePixelLine(descriptor.rings[0], plan.tile);
    const outerReferenceX = outerRing.reduce((total, position) => total + position[0], 0) / outerRing.length;
    const rings = [
      outerRing,
      ...descriptor.rings.slice(1).map((ring) => unwrapTilePixelLine(ring, plan.tile, outerReferenceX)),
    ];
    const bounds = boundsForRings(rings);
    const surfaceIndex = surfaces.length;
    surfaces.push(Object.freeze({
      waterBodyId: descriptor.waterBodyId,
      sourceKind: descriptor.sourceKind,
      baseHeight: waterBodyLevels.get(descriptor.waterBodyId) ?? 0,
      surfaceHeight: (waterBodyLevels.get(descriptor.waterBodyId) ?? 0) + waterSurfaceOffsetMeters,
      rings,
      bounds,
    }));
    const range = gridCellRange(bounds, plan.tile.size);
    for (let y = range.minimumY; y <= range.maximumY; y += 1) {
      for (let x = range.minimumX; x <= range.maximumX; x += 1) {
        cells[gridCellIndex(x, y)].push(surfaceIndex);
        cellAssignmentCount += 1;
      }
    }
  }
  for (let index = 0; index < cells.length; index += 1) cells[index] = Object.freeze(cells[index]);
  const candidatesForBounds = (bounds, budget) => {
    const range = gridCellRange(bounds, plan.tile.size);
    const candidates = new Set();
    for (let y = range.minimumY; y <= range.maximumY; y += 1) {
      for (let x = range.minimumX; x <= range.maximumX; x += 1) {
        consumeIntersectionTest(budget);
        for (const surfaceIndex of cells[gridCellIndex(x, y)]) {
          consumeIntersectionTest(budget);
          candidates.add(surfaceIndex);
        }
      }
    }
    return [...candidates];
  };
  return Object.freeze({
    gridSize: WATER_SPATIAL_INDEX_GRID_SIZE,
    cellAssignmentCount,
    surfaceCount: surfaces.length,
    surfaces: Object.freeze(surfaces),
    candidatesForBounds,
    sample(position, budget) {
      const bounds = boundsForSegment(position, position);
      let height;
      for (const surfaceIndex of candidatesForBounds(bounds, budget)) {
        const surface = surfaces[surfaceIndex];
        consumeIntersectionTest(budget);
        if (!boundsContainPoint(surface.bounds, position)) continue;
        if (!pointInWaterPolygon2D(position, surface.rings, budget)) continue;
        height = height === undefined
          ? surface.surfaceHeight
          : Math.max(height, surface.surfaceHeight);
      }
      return height;
    },
    sampleSegment(left, right, budget) {
      const bounds = boundsForSegment(left, right);
      let height;
      for (const surfaceIndex of candidatesForBounds(bounds, budget)) {
        const surface = surfaces[surfaceIndex];
        consumeIntersectionTest(budget);
        if (!boundsIntersect(bounds, surface.bounds)) continue;
        if (!segmentIntersectsWaterPolygon2D(left, right, surface.rings, budget)) continue;
        height = height === undefined
          ? surface.surfaceHeight
          : Math.max(height, surface.surfaceHeight);
      }
      return height;
    },
  });
}

function deriveRoadMinimumWaterLevels(plan, waterSurfaceIndex, heightResolutionStats, maximumTests) {
  const budget = {
    count: 0,
    maximum: maximumTests,
    errorCode: 'ERR_SHORTBREAD_WATER_ROAD_INTERSECTION_CAP',
    label: 'Shortbread water/road intersection planning',
  };
  const roadMinimums = new Map();
  const worldPixelPeriod = plan.tile.size * 2 ** plan.tile.z;
  for (const descriptor of plan.descriptors) {
    if (descriptor.kind !== 'road') continue;
    const positions = unwrapTilePixelLine(descriptor.positions, plan.tile);
    const minimums = new Float64Array(positions.length);
    minimums.fill(Number.NEGATIVE_INFINITY);
    for (let index = 0; index < positions.length - 1; index += 1) {
      for (const shift of [-worldPixelPeriod, 0, worldPixelPeriod]) {
        const left = [positions[index][0] + shift, positions[index][1]];
        const right = [positions[index + 1][0] + shift, positions[index + 1][1]];
        const segmentBounds = boundsForSegment(left, right);
        for (const surfaceIndex of waterSurfaceIndex.candidatesForBounds(segmentBounds, budget)) {
          const water = waterSurfaceIndex.surfaces[surfaceIndex];
          consumeIntersectionTest(budget);
          if (!boundsIntersect(segmentBounds, water.bounds)) continue;
          if (!segmentIntersectsWaterPolygon2D(left, right, water.rings, budget)) continue;
          minimums[index] = Math.max(minimums[index], water.baseHeight);
          minimums[index + 1] = Math.max(minimums[index + 1], water.baseHeight);
        }
      }
    }
    roadMinimums.set(descriptor.id, minimums);
  }
  heightResolutionStats.waterRoadIntersectionTestCount = budget.count;
  heightResolutionStats.waterSpatialIndexCellAssignmentCount = waterSurfaceIndex.cellAssignmentCount;
  return roadMinimums;
}

function descriptorHeightResolver(heightResolver, descriptor, {
  elevationOffsetMeters,
  heightMode,
  heightResolutionStats,
  fixedBaseHeight,
  minimumBaseHeights,
}) {
  const cache = new Map();
  return (position, positionIndex) => {
    const minimumBaseHeight = minimumBaseHeights?.[positionIndex] ?? Number.NEGATIVE_INFINITY;
    const cacheKey = `${position[0]}\u0000${position[1]}\u0000${minimumBaseHeight}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    let baseHeight = 0;
    if (heightMode === 'water-level') {
      baseHeight = fixedBaseHeight ?? 0;
      heightResolutionStats.waterLevelCoordinateCount += 1;
    } else if (heightResolver) {
      baseHeight = heightResolver(position[0], position[1], descriptor);
      if (baseHeight && typeof baseHeight.then === 'function') {
        throw codedError(
          TypeError,
          'ERR_SHORTBREAD_ASYNC_HEIGHT_RESOLVER',
          'heightResolver must return a synchronous finite terrain height.',
        );
      }
      if (baseHeight === undefined || baseHeight === null) {
        baseHeight = 0;
        heightResolutionStats.unresolvedFallbackCoordinateCount += 1;
      } else if (!Number.isFinite(baseHeight)
        || Math.abs(baseHeight) > MAXIMUM_ABSOLUTE_RESOLVED_HEIGHT_METERS) {
        throw codedError(
          TypeError,
          'ERR_SHORTBREAD_INVALID_RESOLVED_HEIGHT',
          `heightResolver must return a synchronous finite terrain height within ${MAXIMUM_ABSOLUTE_RESOLVED_HEIGHT_METERS} meters of zero or undefined while terrain is unavailable.`,
        );
      } else {
        baseHeight = Number(baseHeight);
        if (baseHeight < 0) {
          baseHeight = 0;
          heightResolutionStats.waterlineClampedTerrainCoordinateCount += 1;
        }
        heightResolutionStats.resolvedTerrainCoordinateCount += 1;
      }
    } else {
      heightResolutionStats.ellipsoidZeroCoordinateCount += 1;
    }
    if (descriptor.kind === 'road' && baseHeight < minimumBaseHeight) {
      baseHeight = minimumBaseHeight;
      heightResolutionStats.waterLevelClampedRoadCoordinateCount += 1;
    }
    const height = Number(baseHeight) + elevationOffsetMeters;
    cache.set(cacheKey, height);
    return height;
  };
}

function consumeBufferVertices(vertexBudget, count) {
  if (count > vertexBudget.remaining) {
    throw codedError(
      RangeError,
      vertexBudget.errorCode,
      `Shortbread tessellated buffer geometry exceeds the ${vertexBudget.maximum}-vertex cap.`,
    );
  }
  vertexBudget.remaining -= count;
}

function densifyRhumbPositions(Cesium, positions, ellipsoid, vertexBudget) {
  const densified = [[...positions[0]]];
  const sourceSegmentIndices = [0];
  const maximumSurfaceDistance = ellipsoid.maximumRadius * MAXIMUM_BUFFER_LINE_SEGMENT_RADIANS;
  const start = new Cesium.Cartographic();
  const end = new Cesium.Cartographic();
  const interpolated = new Cesium.Cartographic();
  for (let sourceIndex = 0; sourceIndex < positions.length - 1; sourceIndex += 1) {
    Cesium.Cartographic.fromDegrees(positions[sourceIndex][0], positions[sourceIndex][1], 0, start);
    Cesium.Cartographic.fromDegrees(positions[sourceIndex + 1][0], positions[sourceIndex + 1][1], 0, end);
    const rhumbLine = new Cesium.EllipsoidRhumbLine(start, end, ellipsoid);
    const segmentCount = Math.max(1, Math.ceil(rhumbLine.surfaceDistance / maximumSurfaceDistance));
    if (densified.length + segmentCount > vertexBudget.remaining) {
      throw codedError(
        RangeError,
        vertexBudget.errorCode,
        `Shortbread tessellated buffer geometry exceeds the ${vertexBudget.maximum}-vertex cap.`,
      );
    }
    for (let segmentIndex = 1; segmentIndex <= segmentCount; segmentIndex += 1) {
      if (segmentIndex === segmentCount) {
        densified.push([...positions[sourceIndex + 1]]);
      } else {
        rhumbLine.interpolateUsingSurfaceDistance(
          rhumbLine.surfaceDistance * segmentIndex / segmentCount,
          interpolated,
        );
        densified.push([
          interpolated.longitude * 180 / Math.PI,
          interpolated.latitude * 180 / Math.PI,
        ]);
      }
      sourceSegmentIndices.push(sourceIndex);
    }
  }
  consumeBufferVertices(vertexBudget, densified.length);
  return Object.freeze({ densified, sourceSegmentIndices });
}

function packedCartesianPositions(Cesium, positions, descriptor, {
  ellipsoid,
  heightResolver,
  elevationOffsetMeters,
  heightMode,
  heightResolutionStats,
  fixedBaseHeight,
  minimumBaseHeights,
}) {
  const resolveHeight = descriptorHeightResolver(heightResolver, descriptor, {
    elevationOffsetMeters,
    heightMode,
    heightResolutionStats,
    fixedBaseHeight,
    minimumBaseHeights,
  });
  const packed = new Float64Array(positions.length * 3);
  const scratch = new Cesium.Cartesian3();
  for (let index = 0; index < positions.length; index += 1) {
    const [longitude, latitude] = positions[index];
    Cesium.Cartesian3.fromDegrees(
      longitude,
      latitude,
      resolveHeight(positions[index], index),
      ellipsoid,
      scratch,
    );
    packed[index * 3] = scratch.x;
    packed[index * 3 + 1] = scratch.y;
    packed[index * 3 + 2] = scratch.z;
  }
  return packed;
}

function openPolygonRing(ring) {
  return sameCoordinate(ring[0], ring.at(-1)) ? ring.slice(0, -1) : [...ring];
}

function prepareBufferPolygon(Cesium, descriptor, options) {
  const rings = descriptor.rings.map(openPolygonRing);
  const sourcePositionCount = rings.reduce((total, ring) => total + ring.length, 0);
  if (rings.length > options.maximumPolygonSourceRingsPerSurface
    || sourcePositionCount > options.maximumPolygonSourcePositionsPerSurface) {
    throw codedError(
      RangeError,
      'ERR_SHORTBREAD_BUFFER_POLYGON_SOURCE_TOPOLOGY_CAP',
      `Shortbread water polygon ${descriptor.id} exceeds the pre-allocation source-topology cap `
        + `(${rings.length}/${options.maximumPolygonSourceRingsPerSurface} rings, `
        + `${sourcePositionCount}/${options.maximumPolygonSourcePositionsPerSurface} positions).`,
    );
  }
  for (const ring of rings) {
    if (ring.length < 3) {
      throw codedError(
        TypeError,
        'ERR_SHORTBREAD_BUFFER_POLYGON',
        `Shortbread water polygon ${descriptor.id} contains a degenerate ring.`,
      );
    }
  }
  const cartesianRing = (ring) => ring.map(([longitude, latitude]) => (
    Cesium.Cartesian3.fromDegrees(longitude, latitude, 0, options.ellipsoid)
  ));
  const hierarchy = new Cesium.PolygonHierarchy(
    cartesianRing(rings[0]),
    rings.slice(1).map((ring) => new Cesium.PolygonHierarchy(cartesianRing(ring))),
  );
  const geometry = Cesium.PolygonGeometry.createGeometry(new Cesium.PolygonGeometry({
    polygonHierarchy: hierarchy,
    ellipsoid: options.ellipsoid,
    height: (options.fixedBaseHeight ?? 0) + options.elevationOffsetMeters,
    granularity: BUFFER_POLYGON_GRANULARITY_RADIANS,
    arcType: Cesium.ArcType.RHUMB,
    vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
  }));
  const positions = geometry?.attributes?.position?.values;
  const triangles = geometry?.indices;
  if (!positions || positions.length < 9 || !triangles || triangles.length < 3 || triangles.length % 3 !== 0) {
    throw codedError(
      TypeError,
      'ERR_SHORTBREAD_BUFFER_POLYGON',
      `Shortbread water polygon ${descriptor.id} could not be triangulated.`,
    );
  }
  const vertexCount = positions.length / 3;
  consumeBufferVertices(options.vertexBudget, vertexCount);
  options.heightResolutionStats.waterLevelCoordinateCount += vertexCount;
  options.heightResolutionStats.sourcePolygonCoordinateCount += rings.reduce(
    (total, ring) => total + ring.length,
    0,
  );
  options.heightResolutionStats.tessellatedPolygonCoordinateCount += vertexCount;
  return Object.freeze({
    positions: new Float64Array(positions),
    holes: new Uint32Array(0),
    triangles: new Uint32Array(triangles),
  });
}

function createPolygonCategory(Cesium, descriptors, options) {
  const polygons = descriptors.map((descriptor) => prepareBufferPolygon(Cesium, descriptor, {
    ...options,
    fixedBaseHeight: options.waterBodyLevels.get(descriptor.waterBodyId) ?? 0,
  }));
  const vertexCount = polygons.reduce((total, polygon) => total + polygon.positions.length / 3, 0);
  const holeCount = polygons.reduce((total, polygon) => total + polygon.holes.length, 0);
  const triangleCount = polygons.reduce((total, polygon) => total + polygon.triangles.length / 3, 0);
  const collection = new Cesium.BufferPolygonCollection({
    primitiveCountMax: polygons.length,
    vertexCountMax: vertexCount,
    holeCountMax: holeCount,
    triangleCountMax: triangleCount,
    allowPicking: false,
    blendOption: Cesium.BlendOption.TRANSLUCENT,
  });
  try {
    for (let index = 0; index < descriptors.length; index += 1) {
      const descriptor = descriptors[index];
      collection.add({
        featureId: index,
        ...polygons[index],
        material: new Cesium.BufferPolygonMaterial({
          color: cesiumColor(Cesium, descriptor.material),
          outlineColor: Cesium.Color.TRANSPARENT,
          outlineWidth: 0,
        }),
      });
    }
  } catch (error) {
    collection.destroy();
    throw error;
  }
  return Object.freeze({
    kind: 'water-surface',
    collection,
    primitiveCount: collection.primitiveCount,
    vertexCount,
    byteLength: collection.byteLength,
    allowPicking: false,
    blend: 'translucent',
    linePassCount: 0,
  });
}

function createPolylineCategory(Cesium, spec, descriptors, options) {
  const lines = descriptors.map((descriptor) => {
    const dense = densifyRhumbPositions(Cesium, descriptor.positions, options.ellipsoid, options.vertexBudget);
    const sourceMinimums = spec.kind === 'road'
      ? options.roadMinimumWaterLevels.get(descriptor.id)
      : undefined;
    let minimumBaseHeights;
    if (sourceMinimums) {
      minimumBaseHeights = new Float64Array(dense.densified.length);
      for (let index = 0; index < minimumBaseHeights.length; index += 1) {
        const sourceSegmentIndex = Math.min(
          dense.sourceSegmentIndices[index],
          descriptor.positions.length - 2,
        );
        minimumBaseHeights[index] = Math.max(
          sourceMinimums[sourceSegmentIndex],
          sourceMinimums[sourceSegmentIndex + 1],
        );
      }
    }
    options.heightResolutionStats.sourcePolylineCoordinateCount += descriptor.positions.length;
    options.heightResolutionStats.tessellatedPolylineCoordinateCount += dense.densified.length;
    return packedCartesianPositions(
      Cesium,
      dense.densified,
      descriptor,
      {
        ...options,
        fixedBaseHeight: spec.kind === 'shoreline'
          ? options.waterBodyLevels.get(descriptor.waterBodyId) ?? 0
          : undefined,
        minimumBaseHeights,
      },
    );
  });
  const vertexCount = lines.reduce((total, positions) => total + positions.length / 3, 0);
  const collection = new Cesium.BufferPolylineCollection({
    primitiveCountMax: lines.length,
    vertexCountMax: vertexCount,
    allowPicking: false,
    blendOption: Cesium.BlendOption.OPAQUE,
  });
  try {
    for (let index = 0; index < descriptors.length; index += 1) {
      const descriptor = descriptors[index];
      const color = cesiumColor(Cesium, descriptor.material);
      collection.add({
        featureId: index,
        positions: lines[index],
        material: new Cesium.BufferPolylineMaterial({
          color,
          outlineColor: color,
          outlineWidth: 0,
          width: Math.min(255, Math.max(1, Math.round(descriptor.width))),
        }),
      });
    }
  } catch (error) {
    collection.destroy();
    throw error;
  }
  return Object.freeze({
    kind: spec.kind,
    collection,
    primitiveCount: collection.primitiveCount,
    vertexCount,
    byteLength: collection.byteLength,
    allowPicking: false,
    blend: 'opaque',
    linePassCount: 1,
  });
}

class ShortbreadBufferTileGeometry {
  constructor(tileKey, categories, elevationOffsetsMeters, heightResolution, waterSurfaceIndex) {
    this.tileKey = tileKey;
    this.categories = categories;
    this.elevationOffsetsMeters = elevationOffsetsMeters;
    this.heightResolution = heightResolution;
    this.waterSurfaceIndex = waterSurfaceIndex;
    this.destroyed = false;
    this.primitiveCount = categories.reduce((total, category) => total + category.primitiveCount, 0);
    this.vertexCount = categories.reduce((total, category) => total + category.vertexCount, 0);
    this.byteLength = categories.reduce((total, category) => total + category.byteLength, 0);
  }

  get collectionCount() { return this.categories.length; }

  getCategory(kind) {
    return this.categories.find((category) => category.kind === kind);
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    for (const category of this.categories) {
      if (!category.collection.isDestroyed()) category.collection.destroy();
    }
  }

  isDestroyed() { return this.destroyed; }
}

export function createShortbreadBufferTileGeometry(Cesium, plan, {
  heightResolver = null,
  categoryElevationOffsetsMeters,
  ellipsoid = Cesium?.Ellipsoid?.WGS84,
  maximumVertices = SHORTBREAD_GEOMETRY_LIMITS.maximumActiveVertices,
  maximumWaterRoadIntersectionTestsPerTile = (
    SHORTBREAD_GEOMETRY_LIMITS.maximumWaterRoadIntersectionTestsPerTile
  ),
  maximumPolygonSourceRingsPerSurface = (
    SHORTBREAD_GEOMETRY_LIMITS.maximumPolygonSourceRingsPerSurface
  ),
  maximumPolygonSourcePositionsPerSurface = (
    SHORTBREAD_GEOMETRY_LIMITS.maximumPolygonSourcePositionsPerSurface
  ),
  vertexCapErrorCode = 'ERR_SHORTBREAD_BUFFER_VERTEX_CAP',
} = {}) {
  validateCesiumBufferApi(Cesium);
  if (!plan?.tile?.key || !Array.isArray(plan.descriptors)) {
    throw new TypeError('A planned Shortbread tile with geometry descriptors is required.');
  }
  if (heightResolver !== null && typeof heightResolver !== 'function') {
    throw new TypeError('heightResolver must be a function or null.');
  }
  if (!ellipsoid) throw new TypeError('A Cesium ellipsoid is required for Shortbread buffer geometry.');
  positiveSafeInteger(maximumVertices, 'maximumVertices', SHORTBREAD_GEOMETRY_LIMITS.maximumActiveVertices);
  positiveSafeInteger(
    maximumWaterRoadIntersectionTestsPerTile,
    'maximumWaterRoadIntersectionTestsPerTile',
    SHORTBREAD_GEOMETRY_LIMITS.maximumWaterRoadIntersectionTestsPerTile,
  );
  positiveSafeInteger(
    maximumPolygonSourceRingsPerSurface,
    'maximumPolygonSourceRingsPerSurface',
    SHORTBREAD_GEOMETRY_LIMITS.maximumPolygonSourceRingsPerSurface,
  );
  positiveSafeInteger(
    maximumPolygonSourcePositionsPerSurface,
    'maximumPolygonSourcePositionsPerSurface',
    SHORTBREAD_GEOMETRY_LIMITS.maximumPolygonSourcePositionsPerSurface,
  );
  if (typeof vertexCapErrorCode !== 'string' || vertexCapErrorCode.length === 0) {
    throw new TypeError('vertexCapErrorCode must be a non-empty string.');
  }
  const offsets = validateElevationOffsets(categoryElevationOffsetsMeters);
  const vertexBudget = {
    maximum: maximumVertices,
    remaining: maximumVertices,
    errorCode: vertexCapErrorCode,
  };
  const heightResolutionStats = {
    waterLevelCoordinateCount: 0,
    resolvedTerrainCoordinateCount: 0,
    unresolvedFallbackCoordinateCount: 0,
    ellipsoidZeroCoordinateCount: 0,
    waterlineClampedTerrainCoordinateCount: 0,
    oceanWaterBodyCount: 0,
    derivedInlandWaterBodyCount: 0,
    fallbackInlandWaterBodyCount: 0,
    waterLevelSampleCount: 0,
    resolvedWaterLevelSampleCount: 0,
    unresolvedWaterLevelSampleCount: 0,
    unmatchedShorelineCount: 0,
    waterLevelClampedRoadCoordinateCount: 0,
    sourcePolygonCoordinateCount: 0,
    tessellatedPolygonCoordinateCount: 0,
    sourcePolylineCoordinateCount: 0,
    tessellatedPolylineCoordinateCount: 0,
    waterRoadIntersectionTestCount: 0,
    waterSpatialIndexCellAssignmentCount: 0,
  };
  const waterBodyLevels = deriveWaterBodyLevels(plan, heightResolver, heightResolutionStats);
  const waterSurfaceIndex = createWaterSurfaceSpatialIndex(plan, waterBodyLevels, offsets.waterSurface);
  const roadMinimumWaterLevels = deriveRoadMinimumWaterLevels(
    plan,
    waterSurfaceIndex,
    heightResolutionStats,
    maximumWaterRoadIntersectionTestsPerTile,
  );
  const categories = [];
  let categorizedCount = 0;
  try {
    for (const spec of BUFFER_CATEGORY_SPECS) {
      const descriptors = plan.descriptors.filter((descriptor) => descriptor.kind === spec.kind);
      if (descriptors.length === 0) continue;
      categorizedCount += descriptors.length;
      const options = {
        ellipsoid,
        heightResolver,
        elevationOffsetMeters: offsets[spec.offsetKey],
        heightMode: spec.heightMode,
        heightResolutionStats,
        waterBodyLevels,
        roadMinimumWaterLevels,
        vertexBudget,
        maximumPolygonSourceRingsPerSurface,
        maximumPolygonSourcePositionsPerSurface,
      };
      const category = spec.geometryType === 'polygon'
        ? createPolygonCategory(Cesium, descriptors, options)
        : createPolylineCategory(Cesium, spec, descriptors, options);
      if (category.primitiveCount !== descriptors.length) {
        category.collection.destroy();
        throw codedError(
          Error,
          'ERR_SHORTBREAD_BUFFER_COUNT_MISMATCH',
          `Shortbread ${spec.kind} buffer count did not match its planned descriptor count.`,
        );
      }
      categories.push(Object.freeze({
        ...category,
        elevationOffsetMeters: offsets[spec.offsetKey],
      }));
    }
    if (categorizedCount !== plan.descriptors.length) {
      throw codedError(
        TypeError,
        'ERR_SHORTBREAD_BUFFER_CATEGORY',
        'Shortbread geometry plan contains an unsupported buffer category.',
      );
    }
    return new ShortbreadBufferTileGeometry(
      plan.tile.key,
      categories,
      offsets,
      Object.freeze({ ...heightResolutionStats }),
      waterSurfaceIndex,
    );
  } catch (error) {
    for (const category of categories) {
      if (!category.collection.isDestroyed()) category.collection.destroy();
    }
    throw error;
  }
}

class ShortbreadBufferScenePrimitive {
  constructor() {
    this.show = true;
    this.revision = 0;
    this.attemptedRevision = -1;
    this.submittedRevision = -1;
    this.presentedRevision = -1;
    this.destroyed = false;
    this.tiles = new Map();
    this.orderedTiles = [];
  }

  get tileCount() { return this.tiles.size; }

  get collectionCount() {
    return this.orderedTiles.reduce((total, tile) => total + tile.collectionCount, 0);
  }

  get primitiveCount() {
    return this.orderedTiles.reduce((total, tile) => total + tile.primitiveCount, 0);
  }

  get vertexCount() {
    return this.orderedTiles.reduce((total, tile) => total + tile.vertexCount, 0);
  }

  get byteLength() {
    return this.orderedTiles.reduce((total, tile) => total + tile.byteLength, 0);
  }

  getTile(tileKey) { return this.tiles.get(tileKey); }

  addTile(tileGeometry) {
    if (this.destroyed) throw new Error('Shortbread buffer scene primitive is destroyed.');
    if (this.tiles.has(tileGeometry.tileKey)) {
      throw new Error(`Shortbread buffer tile ${tileGeometry.tileKey} is already active.`);
    }
    this.tiles.set(tileGeometry.tileKey, tileGeometry);
    this.orderedTiles = [...this.tiles.values()].sort((left, right) => left.tileKey.localeCompare(right.tileKey));
    this.revision += 1;
  }

  removeTile(tileKey) {
    const tileGeometry = this.tiles.get(tileKey);
    if (!tileGeometry) return false;
    this.tiles.delete(tileKey);
    this.orderedTiles = [...this.tiles.values()].sort((left, right) => left.tileKey.localeCompare(right.tileKey));
    tileGeometry.destroy();
    this.revision += 1;
    return true;
  }

  replaceTiles(replacements) {
    if (this.destroyed) throw new Error('Shortbread buffer scene primitive is destroyed.');
    const replacementKeys = new Set();
    for (const replacement of replacements) {
      if (!this.tiles.has(replacement.tileKey) || replacementKeys.has(replacement.tileKey)) {
        throw new Error(`Shortbread buffer tile ${replacement.tileKey} cannot be atomically replaced.`);
      }
      replacementKeys.add(replacement.tileKey);
    }
    const previous = [];
    const nextTiles = new Map(this.tiles);
    for (const replacement of replacements) {
      previous.push(nextTiles.get(replacement.tileKey));
      nextTiles.set(replacement.tileKey, replacement);
    }
    this.tiles = nextTiles;
    this.orderedTiles = [...nextTiles.values()].sort((left, right) => left.tileKey.localeCompare(right.tileKey));
    if (replacements.length > 0) this.revision += 1;
    for (const tile of previous) tile.destroy();
  }

  invalidatePresentation() {
    if (this.destroyed) throw new Error('Shortbread buffer scene primitive is destroyed.');
    this.revision += 1;
  }

  update(frameState) {
    if (!this.show || this.destroyed) return;
    if (this.primitiveCount > 0) this.attemptedRevision = this.revision;
    for (const kind of SHORTBREAD_GEOMETRY_CATEGORY_ORDER) {
      for (const tile of this.orderedTiles) {
        tile.getCategory(kind)?.collection.update(frameState);
      }
    }
    if (this.primitiveCount > 0) this.submittedRevision = this.revision;
  }

  confirmPostRender() {
    if (this.primitiveCount === 0 || this.submittedRevision !== this.revision
      || this.presentedRevision === this.submittedRevision) return false;
    this.presentedRevision = this.submittedRevision;
    return true;
  }

  destroy() {
    if (this.destroyed) return;
    for (const tile of this.orderedTiles) tile.destroy();
    this.tiles.clear();
    this.orderedTiles = [];
    this.destroyed = true;
  }

  isDestroyed() { return this.destroyed; }
}

function worldRectangle() {
  return Object.freeze({ west: -Math.PI, south: -Math.PI / 2, east: Math.PI, north: Math.PI / 2 });
}

function activeGeometryCounts(records) {
  const counts = {
    tileCount: 0,
    entityCount: 0,
    cesiumEntityCount: 0,
    vertexCount: 0,
    bufferCollectionCount: 0,
    bufferPrimitiveCount: 0,
    bufferPolygonCount: 0,
    bufferPolylineCount: 0,
    bufferVertexCount: 0,
    bufferByteLength: 0,
    waterLevelCoordinateCount: 0,
    resolvedTerrainCoordinateCount: 0,
    unresolvedFallbackCoordinateCount: 0,
    ellipsoidZeroCoordinateCount: 0,
    waterlineClampedTerrainCoordinateCount: 0,
    oceanWaterBodyCount: 0,
    derivedInlandWaterBodyCount: 0,
    fallbackInlandWaterBodyCount: 0,
    waterLevelSampleCount: 0,
    resolvedWaterLevelSampleCount: 0,
    unresolvedWaterLevelSampleCount: 0,
    unmatchedShorelineCount: 0,
    waterLevelClampedRoadCoordinateCount: 0,
    sourcePolygonCoordinateCount: 0,
    tessellatedPolygonCoordinateCount: 0,
    sourcePolylineCoordinateCount: 0,
    tessellatedPolylineCoordinateCount: 0,
    waterRoadIntersectionTestCount: 0,
    waterSpatialIndexCellAssignmentCount: 0,
    waterSurfaceCount: 0,
    shorelineCurveCount: 0,
    buildingWireframeCount: 0,
    roadCurveCount: 0,
    deferredTileCount: 0,
    deferredCommandCount: 0,
    deferredWaterCommandCount: 0,
    deferredSourcePositionCount: 0,
    waterNurbsSourceRingCount: 0,
    waterNurbsSuppressedBoundarySegmentCount: 0,
  };
  for (const record of records.values()) {
    if (!record.active) continue;
    counts.tileCount += 1;
    counts.entityCount += record.plan.counts.entityCount ?? record.plan.descriptors.length;
    counts.vertexCount += record.plan.counts.vertexCount ?? 0;
    counts.waterSurfaceCount += record.plan.counts.waterSurfaceCount ?? 0;
    counts.shorelineCurveCount += record.plan.counts.shorelineCurveCount ?? 0;
    counts.buildingWireframeCount += record.plan.counts.buildingWireframeCount ?? 0;
    counts.roadCurveCount += record.plan.counts.roadCurveCount ?? 0;
    if (record.plan.deferral?.active) counts.deferredTileCount += 1;
    counts.deferredCommandCount += record.plan.counts.deferredCommandCount ?? 0;
    counts.deferredWaterCommandCount += record.plan.counts.deferredWaterCommandCount ?? 0;
    counts.deferredSourcePositionCount += record.plan.counts.deferredSourcePositionCount ?? 0;
    counts.waterNurbsSourceRingCount += record.plan.counts.waterNurbsSourceRingCount ?? 0;
    counts.waterNurbsSuppressedBoundarySegmentCount += (
      record.plan.counts.waterNurbsSuppressedBoundarySegmentCount ?? 0
    );
    counts.bufferCollectionCount += record.bufferGeometry?.collectionCount ?? 0;
    counts.bufferPrimitiveCount += record.bufferGeometry?.primitiveCount ?? 0;
    counts.bufferVertexCount += record.bufferGeometry?.vertexCount ?? 0;
    counts.bufferByteLength += record.bufferGeometry?.byteLength ?? 0;
    counts.waterLevelCoordinateCount += record.bufferGeometry?.heightResolution.waterLevelCoordinateCount ?? 0;
    counts.resolvedTerrainCoordinateCount += (
      record.bufferGeometry?.heightResolution.resolvedTerrainCoordinateCount ?? 0
    );
    counts.unresolvedFallbackCoordinateCount += (
      record.bufferGeometry?.heightResolution.unresolvedFallbackCoordinateCount ?? 0
    );
    counts.ellipsoidZeroCoordinateCount += (
      record.bufferGeometry?.heightResolution.ellipsoidZeroCoordinateCount ?? 0
    );
    counts.waterlineClampedTerrainCoordinateCount += (
      record.bufferGeometry?.heightResolution.waterlineClampedTerrainCoordinateCount ?? 0
    );
    counts.oceanWaterBodyCount += record.bufferGeometry?.heightResolution.oceanWaterBodyCount ?? 0;
    counts.derivedInlandWaterBodyCount += (
      record.bufferGeometry?.heightResolution.derivedInlandWaterBodyCount ?? 0
    );
    counts.fallbackInlandWaterBodyCount += (
      record.bufferGeometry?.heightResolution.fallbackInlandWaterBodyCount ?? 0
    );
    counts.waterLevelSampleCount += record.bufferGeometry?.heightResolution.waterLevelSampleCount ?? 0;
    counts.resolvedWaterLevelSampleCount += (
      record.bufferGeometry?.heightResolution.resolvedWaterLevelSampleCount ?? 0
    );
    counts.unresolvedWaterLevelSampleCount += (
      record.bufferGeometry?.heightResolution.unresolvedWaterLevelSampleCount ?? 0
    );
    counts.unmatchedShorelineCount += record.bufferGeometry?.heightResolution.unmatchedShorelineCount ?? 0;
    counts.waterLevelClampedRoadCoordinateCount += (
      record.bufferGeometry?.heightResolution.waterLevelClampedRoadCoordinateCount ?? 0
    );
    counts.sourcePolygonCoordinateCount += (
      record.bufferGeometry?.heightResolution.sourcePolygonCoordinateCount ?? 0
    );
    counts.tessellatedPolygonCoordinateCount += (
      record.bufferGeometry?.heightResolution.tessellatedPolygonCoordinateCount ?? 0
    );
    counts.sourcePolylineCoordinateCount += (
      record.bufferGeometry?.heightResolution.sourcePolylineCoordinateCount ?? 0
    );
    counts.tessellatedPolylineCoordinateCount += (
      record.bufferGeometry?.heightResolution.tessellatedPolylineCoordinateCount ?? 0
    );
    counts.waterRoadIntersectionTestCount += (
      record.bufferGeometry?.heightResolution.waterRoadIntersectionTestCount ?? 0
    );
    counts.waterSpatialIndexCellAssignmentCount += (
      record.bufferGeometry?.heightResolution.waterSpatialIndexCellAssignmentCount ?? 0
    );
    counts.bufferPolygonCount += record.bufferGeometry?.getCategory('water-surface')?.primitiveCount ?? 0;
    counts.bufferPolylineCount += (record.bufferGeometry?.primitiveCount ?? 0)
      - (record.bufferGeometry?.getCategory('water-surface')?.primitiveCount ?? 0);
  }
  return Object.freeze(counts);
}

export class ShortbreadGeometryLayer {
  constructor(Cesium, {
    viewer,
    tileJson,
    fetchImpl = globalThis.fetch,
    decodeTile = decodeShortbreadTile,
    commandsFromTile = shortbreadDrawCommands,
    geometryPlanner = planShortbreadGeometry,
    tileSelector = selectShortbreadGeometryTiles,
    minimumLevel,
    maximumLevel,
    minimumGeometryZoom = 0,
    targetZoom,
    requestTimeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
    waterNurbsLimits,
    heightResolver = null,
    categoryElevationOffsetsMeters,
    onTelemetry = () => {},
    ...limitOptions
  } = {}) {
    validateCesiumBufferApi(Cesium);
    if (!Cesium?.Credit) throw new TypeError('Cesium Credit is required.');
    if (!viewer?.camera?.moveEnd || !viewer?.scene?.primitives
      || !viewer?.scene?.postRender || !viewer?.scene?.renderError) {
      throw new TypeError('A Cesium Viewer with camera, scene primitives, postRender, and renderError is required.');
    }
    if (typeof fetchImpl !== 'function' || typeof decodeTile !== 'function'
      || typeof commandsFromTile !== 'function' || typeof geometryPlanner !== 'function'
      || typeof tileSelector !== 'function' || typeof onTelemetry !== 'function') {
      throw new TypeError('Shortbread geometry lifecycle callbacks must be functions.');
    }
    if (heightResolver !== null && typeof heightResolver !== 'function') {
      throw new TypeError('heightResolver must be a function or null.');
    }
    this.Cesium = Cesium;
    this.viewer = viewer;
    this.tileJson = validateShortbreadTileJson(tileJson, { requireWater: true });
    this.fetchImpl = fetchImpl;
    this.decodeTile = decodeTile;
    this.commandsFromTile = commandsFromTile;
    this.geometryPlanner = geometryPlanner;
    this.tileSelector = tileSelector;
    this.limits = boundedLimits(limitOptions);
    this.minimumZoom = minimumLevel ?? this.tileJson.minzoom;
    this.maximumZoom = maximumLevel ?? this.tileJson.maxzoom;
    nonNegativeInteger(this.minimumZoom, 'minimumLevel', SHORTBREAD_MAX_ZOOM);
    nonNegativeInteger(this.maximumZoom, 'maximumLevel', SHORTBREAD_MAX_ZOOM);
    if (this.minimumZoom < this.tileJson.minzoom || this.maximumZoom > this.tileJson.maxzoom
      || this.maximumZoom < this.minimumZoom) {
      throw new RangeError('Shortbread geometry zoom bounds must be inside the TileJSON range.');
    }
    if (targetZoom !== undefined) nonNegativeInteger(targetZoom, 'targetZoom', SHORTBREAD_MAX_ZOOM);
    nonNegativeInteger(minimumGeometryZoom, 'minimumGeometryZoom', SHORTBREAD_MAX_ZOOM);
    if (minimumGeometryZoom > this.maximumZoom) {
      throw new RangeError('minimumGeometryZoom must not exceed maximumLevel.');
    }
    this.minimumGeometryZoom = minimumGeometryZoom;
    this.targetZoom = targetZoom;
    this.requestTimeoutMs = positiveSafeInteger(requestTimeoutMs, 'requestTimeoutMs');
    this.waterNurbsLimits = validateWaterNurbsLimits(waterNurbsLimits);
    this.heightResolver = heightResolver;
    this.categoryElevationOffsetsMeters = validateElevationOffsets(categoryElevationOffsetsMeters);
    this.ellipsoid = viewer.scene.globe?.ellipsoid ?? Cesium.Ellipsoid.WGS84;
    this.onTelemetry = onTelemetry;
    this.dataSource = null;
    this.errorEvent = typeof Cesium.Event === 'function' ? new Cesium.Event() : null;
    this.scenePrimitive = new ShortbreadBufferScenePrimitive();
    this.credit = new Cesium.Credit(OSM_ATTRIBUTION_HTML, true);
    this.cache = new Map();
    this.activeRecords = new Map();
    this.inflight = new Map();
    this.queue = [];
    this.queueKeys = new Set();
    this.desiredKeys = new Set();
    this.activationRejectedKeys = new Set();
    this.terminalFailedKeys = new Set();
    this.idleWaiters = new Set();
    this.started = false;
    this.destroyed = false;
    this.moveEndCleanup = null;
    this.postRenderCleanup = null;
    this.renderErrorCleanup = null;
    this.scenePrimitiveAdded = false;
    this.postRenderCount = 0;
    this.renderErrorCount = 0;
    this.renderErrorRevision = -1;
    this.lastRenderError = null;
    this.selection = null;
    this.requested = 0;
    this.loaded = 0;
    this.failed = 0;
    this.aborted = 0;
    this.coalesced = 0;
    this.cacheHits = 0;
    this.evicted = 0;
    this.capRejected = 0;
    this.responseBytes = 0;
    this.reservedResponseBytes = 0;
    this.waterSampleQueryCount = 0;
    this.waterSampleHitCount = 0;
    this.waterSampleMissCount = 0;
    this.waterSampleIntersectionTestCount = 0;
    this.waterSampleCapRejectedCount = 0;
    this.waterSampleLifetimeCapRejectedCount = 0;
    this.waterSegmentSampleCallCount = 0;
    this.waterSegmentSampleHitCount = 0;
    this.waterSegmentSampleMissCount = 0;
    this.waterSegmentSampleIntersectionTestCount = 0;
    this.waterSegmentSampleCapRejectedCount = 0;
    this.waterSegmentSampleLifetimeCapRejectedCount = 0;
    this.waterSamplingLifetimeIntersectionTestCount = 0;
    this.lastError = null;
    this.lastErrorCode = null;
  }

  get show() { return this.scenePrimitive.show; }

  set show(value) {
    const show = Boolean(value);
    if (this.scenePrimitive.show === show) return;
    this.scenePrimitive.show = show;
    if (show) this.scenePrimitive.invalidatePresentation();
    this.viewer.scene?.requestRender?.();
    this.#emitTelemetry();
  }

  get isDestroyed() { return this.destroyed; }

  #cameraRectangle() {
    return this.viewer.camera.computeViewRectangle?.(this.viewer.scene?.globe?.ellipsoid) ?? worldRectangle();
  }

  #viewport() {
    const canvas = this.viewer.scene?.canvas;
    return {
      viewportWidth: Number(canvas?.clientWidth || canvas?.width || 1024),
      viewportHeight: Number(canvas?.clientHeight || canvas?.height || 768),
    };
  }

  async start() {
    if (this.destroyed) throw new Error('Shortbread geometry layer is destroyed.');
    if (this.started) return this;
    const listener = () => {
      try {
        this.refresh();
      } catch (error) {
        this.#recordError(error);
      }
    };
    const postRenderListener = () => {
      if (this.renderErrorRevision === this.scenePrimitive.revision) return;
      if (!this.scenePrimitive.confirmPostRender()) return;
      this.postRenderCount += 1;
      if (this.renderErrorRevision >= 0 && this.renderErrorRevision < this.scenePrimitive.revision) {
        this.lastRenderError = null;
        if (this.lastErrorCode === 'ERR_SHORTBREAD_RENDER_ERROR') {
          this.lastError = null;
          this.lastErrorCode = null;
        }
      }
      this.#emitTelemetry();
    };
    const renderErrorListener = (sceneOrError, possibleError) => {
      const awaitingShortbreadPresentation = this.scenePrimitive.tileCount > 0
        && this.scenePrimitive.attemptedRevision === this.scenePrimitive.revision
        && this.scenePrimitive.presentedRevision !== this.scenePrimitive.revision;
      if (!awaitingShortbreadPresentation) return;
      const sourceError = possibleError instanceof Error
        ? possibleError
        : sceneOrError instanceof Error
          ? sceneOrError
          : new Error(String(possibleError ?? sceneOrError ?? 'Unknown Cesium render error.'));
      const error = codedError(
        Error,
        'ERR_SHORTBREAD_RENDER_ERROR',
        `Cesium scene render error observed while Shortbread buffers awaited presentation: ${sourceError.message}`,
      );
      error.cause = sourceError;
      this.renderErrorCount += 1;
      this.renderErrorRevision = this.scenePrimitive.revision;
      this.lastRenderError = sourceError.message;
      this.#recordError(error);
    };
    try {
      this.started = true;
      this.viewer.creditDisplay?.addStaticCredit?.(this.credit);
      const remove = this.viewer.camera.moveEnd.addEventListener(listener);
      this.moveEndCleanup = typeof remove === 'function'
        ? remove
        : () => this.viewer.camera.moveEnd.removeEventListener?.(listener);
      const removePostRender = this.viewer.scene.postRender.addEventListener(postRenderListener);
      this.postRenderCleanup = typeof removePostRender === 'function'
        ? removePostRender
        : () => this.viewer.scene.postRender.removeEventListener?.(postRenderListener);
      const removeRenderError = this.viewer.scene.renderError.addEventListener(renderErrorListener);
      this.renderErrorCleanup = typeof removeRenderError === 'function'
        ? removeRenderError
        : () => this.viewer.scene.renderError.removeEventListener?.(renderErrorListener);
      this.refresh();
      this.viewer.scene.primitives.add(this.scenePrimitive);
      this.scenePrimitiveAdded = true;
      this.viewer.scene.requestRender?.();
    } catch (error) {
      this.moveEndCleanup?.();
      this.moveEndCleanup = null;
      this.postRenderCleanup?.();
      this.postRenderCleanup = null;
      this.renderErrorCleanup?.();
      this.renderErrorCleanup = null;
      for (const request of this.inflight.values()) request.controller.abort();
      this.queue = [];
      this.queueKeys.clear();
      this.desiredKeys.clear();
      for (const record of [...this.activeRecords.values()]) this.#deactivate(record);
      this.viewer.creditDisplay?.removeStaticCredit?.(this.credit);
      if (this.scenePrimitiveAdded) {
        this.viewer.scene.primitives.remove(this.scenePrimitive);
        this.scenePrimitiveAdded = false;
        this.scenePrimitive = new ShortbreadBufferScenePrimitive();
      }
      this.started = false;
      throw error;
    }
    return this;
  }

  refresh(rectangle = this.#cameraRectangle()) {
    if (this.destroyed) throw new Error('Shortbread geometry layer is destroyed.');
    if (!this.started) throw new Error('Shortbread geometry layer must be started before refresh.');
    const selection = this.tileSelector(rectangle, {
      minimumZoom: this.minimumZoom,
      maximumZoom: this.maximumZoom,
      targetZoom: this.targetZoom,
      maximumActiveTiles: this.limits.maximumActiveTiles,
      ...this.#viewport(),
    });
    this.selection = selection;
    this.desiredKeys = new Set(selection.keys);
    this.activationRejectedKeys = new Set(
      [...this.activationRejectedKeys].filter((key) => this.desiredKeys.has(key)),
    );
    this.terminalFailedKeys = new Set(
      [...this.terminalFailedKeys].filter((key) => this.desiredKeys.has(key)),
    );

    for (const [key, record] of this.activeRecords) {
      if (!this.desiredKeys.has(key)) this.#deactivate(record);
    }
    const retainedQueue = [];
    this.queueKeys.clear();
    for (const tile of this.queue) {
      if (this.desiredKeys.has(tile.key)) {
        retainedQueue.push(tile);
        this.queueKeys.add(tile.key);
      } else {
        this.aborted += 1;
      }
    }
    this.queue = retainedQueue;
    for (const [key, request] of this.inflight) {
      if (!this.desiredKeys.has(key)) request.controller.abort();
    }
    for (const tile of selection.tiles) {
      const cached = this.cache.get(tile.key);
      if (cached) {
        this.cacheHits += 1;
        this.#touch(cached);
        try {
          this.#activate(cached);
          this.activationRejectedKeys.delete(cached.key);
          this.terminalFailedKeys.delete(cached.key);
        } catch (error) {
          this.failed += 1;
          const code = String(error?.code ?? '');
          if (code.endsWith('_CAP') || code.includes('TOO_LARGE')) this.capRejected += 1;
          this.activationRejectedKeys.add(cached.key);
          this.terminalFailedKeys.add(cached.key);
          this.#recordError(error);
        }
      } else if (this.inflight.has(tile.key)
        && !this.inflight.get(tile.key).controller.signal.aborted) {
        this.coalesced += 1;
      } else if (this.queueKeys.has(tile.key)) {
        this.coalesced += 1;
      } else {
        this.terminalFailedKeys.delete(tile.key);
        this.queue.push(tile);
        this.queueKeys.add(tile.key);
      }
    }
    this.#pump();
    this.#emitTelemetry();
    return selection;
  }

  refreshHeights() {
    if (this.destroyed) throw new Error('Shortbread geometry layer is destroyed.');
    if (!this.started) throw new Error('Shortbread geometry layer must be started before refreshing heights.');
    const records = [...this.activeRecords.values()].sort((left, right) => left.key.localeCompare(right.key));
    const replacements = [];
    let remainingVertices = this.limits.maximumActiveVertices;
    try {
      for (const record of records) {
        const replacement = {
          record,
          bufferGeometry: createShortbreadBufferTileGeometry(this.Cesium, record.plan, {
            heightResolver: this.heightResolver,
            categoryElevationOffsetsMeters: this.categoryElevationOffsetsMeters,
            ellipsoid: this.ellipsoid,
            maximumVertices: remainingVertices,
            maximumWaterRoadIntersectionTestsPerTile: (
              this.limits.maximumWaterRoadIntersectionTestsPerTile
            ),
            maximumPolygonSourceRingsPerSurface: (
              this.limits.maximumPolygonSourceRingsPerSurface
            ),
            maximumPolygonSourcePositionsPerSurface: (
              this.limits.maximumPolygonSourcePositionsPerSurface
            ),
            vertexCapErrorCode: 'ERR_SHORTBREAD_ACTIVE_VERTEX_CAP',
          }),
        };
        remainingVertices -= replacement.bufferGeometry.vertexCount;
        replacements.push(replacement);
      }
    } catch (error) {
      for (const replacement of replacements) replacement.bufferGeometry.destroy();
      throw error;
    }
    this.scenePrimitive.replaceTiles(replacements.map(({ bufferGeometry }) => bufferGeometry));
    for (const { record, bufferGeometry } of replacements) record.bufferGeometry = bufferGeometry;
    this.viewer.scene.requestRender?.();
    this.#emitTelemetry();
    return Object.freeze({
      tileCount: replacements.length,
      revision: this.scenePrimitive.revision,
    });
  }

  sampleWaterSurfaceHeight(longitudeDegrees, latitudeDegrees) {
    if (this.destroyed) throw new Error('Shortbread geometry layer is destroyed.');
    const position = finiteCoordinate([longitudeDegrees, latitudeDegrees], 'water sample coordinate');
    this.waterSampleQueryCount += 1;
    const remainingLifetimeTests = Math.max(
      0,
      this.limits.maximumWaterSampleIntersectionTestsLifetime
        - this.waterSamplingLifetimeIntersectionTestCount,
    );
    const lifetimeLimitApplies = remainingLifetimeTests
      <= this.limits.maximumWaterSampleIntersectionTestsPerQuery;
    const budget = {
      count: 0,
      maximum: Math.min(
        remainingLifetimeTests,
        this.limits.maximumWaterSampleIntersectionTestsPerQuery,
      ),
      errorCode: lifetimeLimitApplies
        ? 'ERR_SHORTBREAD_WATER_SAMPLE_LIFETIME_CAP'
        : 'ERR_SHORTBREAD_WATER_SAMPLE_INTERSECTION_CAP',
      label: lifetimeLimitApplies
        ? 'Shortbread layer-session active-water sampling'
        : 'Shortbread active-water query',
    };
    let height;
    try {
      const zoomLevels = [...new Set(
        [...this.activeRecords.values()].filter(({ active }) => active).map(({ tile }) => tile.z),
      )].sort((left, right) => left - right);
      const visitedKeys = new Set();
      for (const zoom of zoomLevels) {
        for (const key of tileKeysContainingLonLat(position, zoom)) {
          if (visitedKeys.has(key)) continue;
          visitedKeys.add(key);
          const record = this.activeRecords.get(key);
          if (!record?.active || !record.bufferGeometry?.waterSurfaceIndex) continue;
          const tilePosition = projectLonLatToWrappedTilePixel(position, record.plan.tile);
          const worldPixelPeriod = record.plan.tile.size * 2 ** record.plan.tile.z;
          for (const x of [
            tilePosition[0] - worldPixelPeriod,
            tilePosition[0],
            tilePosition[0] + worldPixelPeriod,
          ]) {
            const sampled = record.bufferGeometry.waterSurfaceIndex.sample(
              [x, tilePosition[1]],
              budget,
            );
            if (sampled !== undefined) height = height === undefined ? sampled : Math.max(height, sampled);
          }
        }
      }
    } catch (error) {
      this.waterSampleIntersectionTestCount += budget.count;
      this.waterSamplingLifetimeIntersectionTestCount += budget.count;
      if (error?.code === 'ERR_SHORTBREAD_WATER_SAMPLE_INTERSECTION_CAP'
        || error?.code === 'ERR_SHORTBREAD_WATER_SAMPLE_LIFETIME_CAP') {
        this.waterSampleCapRejectedCount += 1;
        if (error.code === 'ERR_SHORTBREAD_WATER_SAMPLE_LIFETIME_CAP') {
          this.waterSampleLifetimeCapRejectedCount += 1;
        }
        this.#recordError(error);
      }
      throw error;
    }
    this.waterSampleIntersectionTestCount += budget.count;
    this.waterSamplingLifetimeIntersectionTestCount += budget.count;
    if (height === undefined) this.waterSampleMissCount += 1;
    else this.waterSampleHitCount += 1;
    return height;
  }

  sampleMaximumWaterSurfaceHeightAlongSegment(
    longitude1Degrees,
    latitude1Degrees,
    longitude2Degrees,
    latitude2Degrees,
  ) {
    if (this.destroyed) throw new Error('Shortbread geometry layer is destroyed.');
    const leftPosition = finiteCoordinate(
      [longitude1Degrees, latitude1Degrees],
      'water segment start coordinate',
    );
    const rightPosition = finiteCoordinate(
      [longitude2Degrees, latitude2Degrees],
      'water segment end coordinate',
    );
    this.waterSegmentSampleCallCount += 1;
    const remainingLifetimeTests = Math.max(
      0,
      this.limits.maximumWaterSampleIntersectionTestsLifetime
        - this.waterSamplingLifetimeIntersectionTestCount,
    );
    const lifetimeLimitApplies = remainingLifetimeTests
      <= this.limits.maximumWaterSegmentIntersectionTestsPerCall;
    const budget = {
      count: 0,
      maximum: Math.min(
        remainingLifetimeTests,
        this.limits.maximumWaterSegmentIntersectionTestsPerCall,
      ),
      errorCode: lifetimeLimitApplies
        ? 'ERR_SHORTBREAD_WATER_SAMPLE_LIFETIME_CAP'
        : 'ERR_SHORTBREAD_WATER_SEGMENT_INTERSECTION_CAP',
      label: lifetimeLimitApplies
        ? 'Shortbread layer-session active-water sampling'
        : 'Shortbread active-water segment sampling',
    };
    let height;
    try {
      const records = [...this.activeRecords.values()]
        .filter(({ active, bufferGeometry }) => active && bufferGeometry?.waterSurfaceIndex)
        .sort((left, right) => left.key.localeCompare(right.key));
      for (const record of records) {
        const index = record.bufferGeometry.waterSurfaceIndex;
        if (index.surfaceCount === 0) continue;
        const left = projectLonLatToWrappedTilePixel(leftPosition, record.plan.tile);
        const right = projectLonLatToWrappedTilePixel(rightPosition, record.plan.tile);
        const worldPixelPeriod = record.plan.tile.size * 2 ** record.plan.tile.z;
        const rightXCandidates = [
          right[0] - worldPixelPeriod,
          right[0],
          right[0] + worldPixelPeriod,
        ];
        let unwrappedRightX = rightXCandidates[0];
        for (const candidate of rightXCandidates.slice(1)) {
          if (Math.abs(candidate - left[0]) < Math.abs(unwrappedRightX - left[0])) {
            unwrappedRightX = candidate;
          }
        }
        for (const shift of [-worldPixelPeriod, 0, worldPixelPeriod]) {
          const sampled = index.sampleSegment(
            [left[0] + shift, left[1]],
            [unwrappedRightX + shift, right[1]],
            budget,
          );
          if (sampled !== undefined) height = height === undefined ? sampled : Math.max(height, sampled);
        }
      }
    } catch (error) {
      this.waterSegmentSampleIntersectionTestCount += budget.count;
      this.waterSamplingLifetimeIntersectionTestCount += budget.count;
      if (error?.code === 'ERR_SHORTBREAD_WATER_SEGMENT_INTERSECTION_CAP'
        || error?.code === 'ERR_SHORTBREAD_WATER_SAMPLE_LIFETIME_CAP') {
        this.waterSegmentSampleCapRejectedCount += 1;
        if (error.code === 'ERR_SHORTBREAD_WATER_SAMPLE_LIFETIME_CAP') {
          this.waterSegmentSampleLifetimeCapRejectedCount += 1;
        }
        this.#recordError(error);
      }
      throw error;
    }
    this.waterSegmentSampleIntersectionTestCount += budget.count;
    this.waterSamplingLifetimeIntersectionTestCount += budget.count;
    if (height === undefined) this.waterSegmentSampleMissCount += 1;
    else this.waterSegmentSampleHitCount += 1;
    return height;
  }

  waitForIdle() {
    if (this.queue.length === 0 && this.inflight.size === 0) return Promise.resolve(this.getTelemetry());
    return new Promise((resolve) => this.idleWaiters.add(resolve));
  }

  #pump() {
    if (this.destroyed) return;
    while (this.inflight.size < this.limits.maximumConcurrentRequests && this.queue.length > 0) {
      const eligibleIndex = this.queue.findIndex((tile) => !this.inflight.has(tile.key));
      if (eligibleIndex < 0) break;
      const [tile] = this.queue.splice(eligibleIndex, 1);
      this.queueKeys.delete(tile.key);
      if (!this.desiredKeys.has(tile.key) || this.cache.has(tile.key)) continue;
      const controller = new AbortController();
      this.requested += 1;
      const request = { controller, promise: null };
      const promise = this.#loadTile(tile, controller.signal)
        .catch((error) => {
          if (error?.name === 'AbortError') {
            this.aborted += 1;
          } else {
            this.failed += 1;
            const code = String(error?.code ?? '');
            if (code.endsWith('_CAP') || code.includes('TOO_LARGE')) this.capRejected += 1;
            if (code === 'ERR_SHORTBREAD_ACTIVE_VERTEX_CAP' && this.desiredKeys.has(tile.key)) {
              this.activationRejectedKeys.add(tile.key);
            }
            if (this.desiredKeys.has(tile.key)) this.terminalFailedKeys.add(tile.key);
            this.#recordError(error);
          }
        })
        .finally(() => {
          this.inflight.delete(tile.key);
          this.#pump();
          this.#emitTelemetry();
          this.#resolveIdle();
        });
      request.promise = promise;
      this.inflight.set(tile.key, request);
    }
    this.#resolveIdle();
  }

  async #loadTile(tile, signal) {
    const available = this.limits.maximumTotalBytes - this.responseBytes - this.reservedResponseBytes;
    if (available < 1) {
      throw codedError(
        RangeError,
        'ERR_SHORTBREAD_LIFETIME_BYTE_CAP',
        `Shortbread geometry exhausted its ${this.limits.maximumTotalBytes}-byte lifetime response budget.`,
      );
    }
    const reservation = Math.min(this.limits.maximumTileBytes, available);
    this.reservedResponseBytes += reservation;
    let bytes;
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), this.requestTimeoutMs);
    try {
      const url = formatShortbreadTileUrl(this.tileJson.tiles[0], tile);
      try {
        bytes = await fetchBytes(this.fetchImpl, url, {
          maximumBytes: reservation,
          signal: combineSignals([signal, timeoutController.signal]),
          tooLargeCode: reservation < this.limits.maximumTileBytes
            ? 'ERR_SHORTBREAD_LIFETIME_BYTE_CAP'
            : 'ERR_SHORTBREAD_RESPONSE_TOO_LARGE',
        });
      } catch (error) {
        if (timeoutController.signal.aborted && !signal.aborted) {
          throw codedError(
            Error,
            'ERR_SHORTBREAD_REQUEST_TIMEOUT',
            `Shortbread geometry tile request exceeded ${this.requestTimeoutMs} ms.`,
          );
        }
        throw error;
      }
      this.responseBytes += bytes.byteLength;
      if (signal.aborted || this.destroyed || !this.desiredKeys.has(tile.key)) throw abortError();
    } finally {
      clearTimeout(timeoutId);
      this.reservedResponseBytes -= reservation;
    }
    let decoded;
    try {
      decoded = this.decodeTile(bytes, {
        x: tile.x,
        y: tile.y,
        z: tile.z,
        maximumFeatures: this.limits.maximumFeaturesPerTile,
        includeWater: true,
      });
    } catch (error) {
      if (!error?.code && error instanceof RangeError && /feature cap/iu.test(error.message)) {
        error.code = 'ERR_SHORTBREAD_GEOMETRY_FEATURE_CAP';
      }
      throw error;
    }
    const commands = this.commandsFromTile(decoded);
    const plan = this.geometryPlanner(commands, { ...tile, size: TILE_SIZE }, {
      maximumFeaturesPerTile: this.limits.maximumFeaturesPerTile,
      maximumVertices: this.limits.maximumActiveVertices,
      minimumGeometryZoom: this.minimumGeometryZoom,
      waterNurbsLimits: this.waterNurbsLimits,
    });
    if (signal.aborted || this.destroyed || !this.desiredKeys.has(tile.key)) throw abortError();
    const record = { key: tile.key, tile, plan, bufferGeometry: null, active: false };
    this.#remember(record);
    try {
      this.#activate(record);
      this.loaded += 1;
    } catch (error) {
      this.cache.delete(record.key);
      throw error;
    }
  }

  #remember(record) {
    this.cache.delete(record.key);
    this.cache.set(record.key, record);
    this.#evict();
  }

  #touch(record) {
    this.cache.delete(record.key);
    this.cache.set(record.key, record);
  }

  #evict() {
    while (this.cache.size > this.limits.maximumCachedTiles) {
      const candidate = [...this.cache.values()].find((record) => !record.active);
      if (!candidate) break;
      this.cache.delete(candidate.key);
      this.evicted += 1;
    }
  }

  #activate(record) {
    if (record.active || !this.desiredKeys.has(record.key)) return false;
    const active = activeGeometryCounts(this.activeRecords);
    const remainingVertices = this.limits.maximumActiveVertices - active.bufferVertexCount;
    if (record.plan.counts.vertexCount > remainingVertices) {
      throw codedError(
        RangeError,
        'ERR_SHORTBREAD_ACTIVE_VERTEX_CAP',
        `Shortbread active geometry exceeds the ${this.limits.maximumActiveVertices}-vertex cap.`,
      );
    }
    let bufferGeometry;
    try {
      bufferGeometry = createShortbreadBufferTileGeometry(this.Cesium, record.plan, {
        heightResolver: this.heightResolver,
        categoryElevationOffsetsMeters: this.categoryElevationOffsetsMeters,
        ellipsoid: this.ellipsoid,
        maximumVertices: remainingVertices,
        maximumWaterRoadIntersectionTestsPerTile: (
          this.limits.maximumWaterRoadIntersectionTestsPerTile
        ),
        maximumPolygonSourceRingsPerSurface: (
          this.limits.maximumPolygonSourceRingsPerSurface
        ),
        maximumPolygonSourcePositionsPerSurface: (
          this.limits.maximumPolygonSourcePositionsPerSurface
        ),
        vertexCapErrorCode: 'ERR_SHORTBREAD_ACTIVE_VERTEX_CAP',
      });
      this.scenePrimitive.addTile(bufferGeometry);
    } catch (error) {
      if (bufferGeometry && !bufferGeometry.isDestroyed()) bufferGeometry.destroy();
      throw error;
    }
    record.bufferGeometry = bufferGeometry;
    record.active = true;
    this.activeRecords.set(record.key, record);
    this.activationRejectedKeys.delete(record.key);
    this.terminalFailedKeys.delete(record.key);
    this.#touch(record);
    this.viewer.scene?.requestRender?.();
    return true;
  }

  #deactivate(record) {
    if (!record?.active) return;
    this.scenePrimitive.removeTile(record.key);
    record.bufferGeometry = null;
    record.active = false;
    this.activeRecords.delete(record.key);
    this.viewer.scene?.requestRender?.();
  }

  #recordError(error) {
    this.lastError = error instanceof Error ? error.message : String(error);
    this.lastErrorCode = typeof error?.code === 'string' ? error.code : null;
    try {
      this.errorEvent?.raiseEvent?.(this, error);
    } catch {
      // Telemetry remains the authoritative error surface if an observer fails.
    }
    this.#emitTelemetry();
  }

  #emitTelemetry() {
    try {
      this.onTelemetry(this.getTelemetry());
    } catch {
      // A UI observer must not poison the bounded source lifecycle.
    }
  }

  #resolveIdle() {
    if (this.queue.length > 0 || this.inflight.size > 0) return;
    const telemetry = this.getTelemetry();
    for (const resolve of this.idleWaiters) resolve(telemetry);
    this.idleWaiters.clear();
  }

  getTelemetry() {
    const geometry = activeGeometryCounts(this.activeRecords);
    const viewDeferred = geometry.deferredTileCount > 0
      && geometry.deferredTileCount === geometry.tileCount;
    const bufferCountsExact = geometry.bufferPrimitiveCount === geometry.entityCount
      && geometry.bufferPolygonCount === geometry.waterSurfaceCount
      && geometry.bufferPolylineCount === geometry.shorelineCurveCount
        + geometry.buildingWireframeCount
        + geometry.roadCurveCount;
    const gpuSubmittedFrame = geometry.bufferPrimitiveCount > 0
      && this.scenePrimitive.submittedRevision === this.scenePrimitive.revision;
    const currentRevisionRenderFailed = this.renderErrorRevision === this.scenePrimitive.revision;
    const gpuPresentedFrame = gpuSubmittedFrame
      && this.scenePrimitive.presentedRevision === this.scenePrimitive.revision
      && !currentRevisionRenderFailed;
    const missingDesiredTileCount = [...this.desiredKeys]
      .filter((key) => !this.activeRecords.has(key)).length;
    const lifecycleIdle = this.started && this.queue.length === 0 && this.inflight.size === 0;
    const settledTerminalFailure = lifecycleIdle && this.terminalFailedKeys.size > 0;
    const settledActivationFailure = lifecycleIdle && this.activationRejectedKeys.size > 0;
    const settledEmpty = lifecycleIdle && missingDesiredTileCount === 0
      && !settledTerminalFailure && geometry.tileCount > 0 && geometry.bufferPrimitiveCount === 0;
    const renderReady = this.started && this.scenePrimitiveAdded && this.scenePrimitive.show
      && bufferCountsExact && gpuPresentedFrame && !currentRevisionRenderFailed
      && !settledTerminalFailure && missingDesiredTileCount === 0;
    const heightResolutionMode = this.heightResolver
      ? geometry.unresolvedFallbackCoordinateCount > 0 || geometry.fallbackInlandWaterBodyCount > 0
        ? 'flat-native-water-and-sync-terrain-with-zero-fallback'
        : 'flat-native-water-and-sync-terrain'
      : 'flat-native-water-and-ellipsoid-zero';
    return Object.freeze({
      schemaVersion: 'peercompute.geo.shortbread-geometry-telemetry.v1',
      renderingModel: 'actual-cesium-buffer-geometry',
      renderer: 'cesium-buffer-geometry',
      geometryBackend: 'Cesium.BufferPolygonCollection/Cesium.BufferPolylineCollection',
      materialModel: 'Cesium.BufferPolygonMaterial/Cesium.BufferPolylineMaterial(Color)',
      coordinateModel: 'bounded-rhumb-pre-tessellation-at-resolved-geodetic-height-plus-category-offset',
      arcType: 'RHUMB-pre-tessellated',
      clampToGround: false,
      usesCesiumZIndex: false,
      allowPicking: false,
      workerGeometryJobs: 0,
      groundWorkerQueue: false,
      cpuGeometryValidated: bufferCountsExact,
      gpuSubmittedFrame,
      gpuPresentedFrame,
      renderReady,
      ready: renderReady,
      settledEmpty,
      viewDeferred,
      settledActivationFailure,
      settledTerminalFailure,
      missingDesiredTileCount,
      activationRejectedTileCount: this.activationRejectedKeys.size,
      terminalFailedTileCount: this.terminalFailedKeys.size,
      rasterPainted: false,
      canvasCount: 0,
      imageryLayerCount: 0,
      glow: false,
      bloom: false,
      duplicateLinePass: false,
      linePassesPerCurve: 1,
      roadsTopmost: true,
      roadWaterClearanceMeters: this.categoryElevationOffsetsMeters.road
        - this.categoryElevationOffsetsMeters.waterSurface,
      minimumRoadWaterClearanceMeters: MINIMUM_ROAD_WATER_CLEARANCE_METERS,
      broadViewDeferral: Object.freeze({
        active: viewDeferred,
        model: 'settled-empty-below-detail-geometry-zoom',
        reason: viewDeferred ? 'broad-view-below-buffer-geometry-detail-zoom' : null,
        minimumGeometryZoom: this.minimumGeometryZoom,
        selectedZoom: this.selection?.selectedZoom ?? null,
        deferredTileCount: geometry.deferredTileCount,
        deferredCommandCount: geometry.deferredCommandCount,
        deferredWaterCommandCount: geometry.deferredWaterCommandCount,
        deferredSourcePositionCount: geometry.deferredSourcePositionCount,
        retryTrigger: 'camera-move-end-at-detail-zoom',
      }),
      categoryOrder: SHORTBREAD_GEOMETRY_CATEGORY_ORDER,
      categoryElevationOffsetsMeters: this.categoryElevationOffsetsMeters,
      heightResolver: this.heightResolver ? 'provided-synchronous-undefined-falls-back-zero' : 'ellipsoid-height-zero',
      heightResolution: Object.freeze({
        model: heightResolutionMode,
        waterSurfaceModel: 'flat-per-tile-polygon-fragment-ocean-zero-inland-bounded-median-or-zero-fallback',
        shorelineModel: 'shared-flat-tile-fragment-level-plus-offset',
        crossTileWaterBodyIdentity: 'unavailable-in-shortbread-draw-commands',
        terrainWireModel: 'per-vertex-synchronous-sample-clamped-at-zero-plus-offset',
        waterLevelCoordinateCount: geometry.waterLevelCoordinateCount,
        resolvedTerrainCoordinateCount: geometry.resolvedTerrainCoordinateCount,
        unresolvedFallbackCoordinateCount: geometry.unresolvedFallbackCoordinateCount,
        ellipsoidZeroCoordinateCount: geometry.ellipsoidZeroCoordinateCount,
        waterlineClampedTerrainCoordinateCount: geometry.waterlineClampedTerrainCoordinateCount,
        maximumWaterLevelSamplesPerBody: MAXIMUM_WATER_LEVEL_SAMPLES_PER_BODY,
        oceanWaterBodyCount: geometry.oceanWaterBodyCount,
        derivedInlandWaterBodyCount: geometry.derivedInlandWaterBodyCount,
        fallbackInlandWaterBodyCount: geometry.fallbackInlandWaterBodyCount,
        waterLevelSampleCount: geometry.waterLevelSampleCount,
        resolvedWaterLevelSampleCount: geometry.resolvedWaterLevelSampleCount,
        unresolvedWaterLevelSampleCount: geometry.unresolvedWaterLevelSampleCount,
        unmatchedShorelineCount: geometry.unmatchedShorelineCount,
        waterLevelClampedRoadCoordinateCount: geometry.waterLevelClampedRoadCoordinateCount,
        waterRoadIntersectionTestCount: geometry.waterRoadIntersectionTestCount,
        waterSpatialIndexCellAssignmentCount: geometry.waterSpatialIndexCellAssignmentCount,
        minimumTerrainBaseHeightMeters: 0,
        maximumAbsoluteResolvedHeightMeters: MAXIMUM_ABSOLUTE_RESOLVED_HEIGHT_METERS,
      }),
      tessellation: Object.freeze({
        model: 'bounded-synchronous-rhumb-pre-tessellation',
        maximumLineSegmentDegrees: MAXIMUM_BUFFER_LINE_SEGMENT_RADIANS * 180 / Math.PI,
        polygonGranularityDegrees: BUFFER_POLYGON_GRANULARITY_RADIANS * 180 / Math.PI,
        sourcePolygonCoordinateCount: geometry.sourcePolygonCoordinateCount,
        tessellatedPolygonCoordinateCount: geometry.tessellatedPolygonCoordinateCount,
        sourcePolylineCoordinateCount: geometry.sourcePolylineCoordinateCount,
        tessellatedPolylineCoordinateCount: geometry.tessellatedPolylineCoordinateCount,
        bufferVertexCount: geometry.bufferVertexCount,
        holesResolvedInTriangleMesh: true,
        countedAgainstActiveVertexCap: true,
      }),
      waterSurfaceSampling: Object.freeze({
        model: 'active-tile-key-plus-fixed-grid-aabb-point-in-polygon',
        gridSize: WATER_SPATIAL_INDEX_GRID_SIZE,
        queryCount: this.waterSampleQueryCount,
        hitCount: this.waterSampleHitCount,
        missCount: this.waterSampleMissCount,
        intersectionTestCount: this.waterSampleIntersectionTestCount,
        capRejectedCount: this.waterSampleCapRejectedCount,
        lifetimeCapRejectedCount: this.waterSampleLifetimeCapRejectedCount,
        maximumIntersectionTestsPerQuery: this.limits.maximumWaterSampleIntersectionTestsPerQuery,
        maximumIntersectionTestsLifetime: this.limits.maximumWaterSampleIntersectionTestsLifetime,
        remainingIntersectionTestsLifetime: Math.max(
          0,
          this.limits.maximumWaterSampleIntersectionTestsLifetime
            - this.waterSamplingLifetimeIntersectionTestCount,
        ),
        returnValue: 'highest-visible-water-surface-height-or-undefined',
        antimeridianSafe: true,
      }),
      waterSegmentSampling: Object.freeze({
        model: 'active-tile-plus-fixed-grid-exact-segment-polygon-intersection',
        gridSize: WATER_SPATIAL_INDEX_GRID_SIZE,
        callCount: this.waterSegmentSampleCallCount,
        hitCount: this.waterSegmentSampleHitCount,
        missCount: this.waterSegmentSampleMissCount,
        intersectionTestCount: this.waterSegmentSampleIntersectionTestCount,
        capRejectedCount: this.waterSegmentSampleCapRejectedCount,
        lifetimeCapRejectedCount: this.waterSegmentSampleLifetimeCapRejectedCount,
        maximumIntersectionTestsPerCall: this.limits.maximumWaterSegmentIntersectionTestsPerCall,
        maximumIntersectionTestsLifetime: this.limits.maximumWaterSampleIntersectionTestsLifetime,
        remainingIntersectionTestsLifetime: Math.max(
          0,
          this.limits.maximumWaterSampleIntersectionTestsLifetime
            - this.waterSamplingLifetimeIntersectionTestCount,
        ),
        returnValue: 'highest-intersected-visible-water-surface-height-or-undefined',
        intersectionModel: 'endpoint-containment-plus-ring-segment-intersection',
        exactInWebMercatorRhumbSpace: true,
        antimeridianSafe: true,
      }),
      waterSamplingBudget: Object.freeze({
        scope: 'layer-session-lifetime-shared-by-point-and-segment-samplers',
        intersectionTestCount: this.waterSamplingLifetimeIntersectionTestCount,
        maximumIntersectionTestsLifetime: this.limits.maximumWaterSampleIntersectionTestsLifetime,
        remainingIntersectionTestsLifetime: Math.max(
          0,
          this.limits.maximumWaterSampleIntersectionTestsLifetime
            - this.waterSamplingLifetimeIntersectionTestCount,
        ),
      }),
      waterAlpha: 0.5,
      waterBlend: 'translucent',
      roadBlend: 'opaque',
      requested: this.requested,
      loaded: this.loaded,
      failed: this.failed,
      aborted: this.aborted,
      coalesced: this.coalesced,
      cacheHits: this.cacheHits,
      evicted: this.evicted,
      capRejected: this.capRejected,
      queued: this.queue.length,
      inflight: this.inflight.size,
      cached: this.cache.size,
      responseBytes: this.responseBytes,
      reservedResponseBytes: this.reservedResponseBytes,
      aggregateBudgetScope: 'layer-session-lifetime',
      requestTimeoutMs: this.requestTimeoutMs,
      selection: this.selection,
      geometry,
      scenePrimitiveCount: this.scenePrimitiveAdded ? 1 : 0,
      customDataSourceCount: 0,
      postRenderCount: this.postRenderCount,
      renderErrorCount: this.renderErrorCount,
      renderErrorRevision: this.renderErrorRevision,
      currentRevisionRenderFailed,
      lastRenderError: this.lastRenderError,
      readiness: Object.freeze({
        model: 'exact-buffer-counts-added-next-scene-postRender',
        ready: renderReady,
        renderReady,
        scenePrimitiveAdded: this.scenePrimitiveAdded,
        bufferCountsExact,
        revision: this.scenePrimitive.revision,
        attemptedRevision: this.scenePrimitive.attemptedRevision,
        submittedRevision: this.scenePrimitive.submittedRevision,
        presentedRevision: this.scenePrimitive.presentedRevision,
        pending: !settledEmpty && !settledTerminalFailure && !currentRevisionRenderFailed
          && (this.queue.length > 0 || this.inflight.size > 0 || missingDesiredTileCount > 0
            || (geometry.bufferPrimitiveCount > 0 && !gpuPresentedFrame)),
        settledEmpty,
        viewDeferred,
        settledActivationFailure,
        settledTerminalFailure,
        degraded: settledTerminalFailure,
        missingDesiredTileCount,
        activationRejectedTileCount: this.activationRejectedKeys.size,
        terminalFailedTileCount: this.terminalFailedKeys.size,
        renderFailed: currentRevisionRenderFailed,
        gpuSubmittedFrame,
        gpuPresentedFrame,
        postRenderCount: this.postRenderCount,
        renderErrorCount: this.renderErrorCount,
      }),
      renderedCommands: geometry.waterSurfaceCount + geometry.buildingWireframeCount + geometry.roadCurveCount,
      renderedVertices: geometry.bufferVertexCount,
      roadCommands: geometry.roadCurveCount,
      buildingCommands: geometry.buildingWireframeCount,
      waterCommands: geometry.waterSurfaceCount,
      waterNurbs: Object.freeze({
        schemaVersion: 'peercompute.geo.water-nurbs-outlines.v1',
        curveModel: 'NURBS',
        degree: 1,
        curveCount: geometry.shorelineCurveCount,
        sourceRingCount: geometry.waterNurbsSourceRingCount,
        suppressedBoundarySegmentCount: geometry.waterNurbsSuppressedBoundarySegmentCount,
        linePassCount: geometry.shorelineCurveCount > 0 ? 1 : 0,
        glow: false,
      }),
      limits: this.limits,
      attributionHtml: OSM_ATTRIBUTION_HTML,
      started: this.started,
      destroyed: this.destroyed,
      lastError: this.lastError,
      lastErrorCode: this.lastErrorCode,
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.moveEndCleanup?.();
    this.moveEndCleanup = null;
    this.postRenderCleanup?.();
    this.postRenderCleanup = null;
    this.renderErrorCleanup?.();
    this.renderErrorCleanup = null;
    for (const request of this.inflight.values()) request.controller.abort();
    this.queue = [];
    this.queueKeys.clear();
    this.desiredKeys.clear();
    this.activationRejectedKeys.clear();
    this.terminalFailedKeys.clear();
    for (const record of [...this.activeRecords.values()]) this.#deactivate(record);
    this.cache.clear();
    this.viewer.creditDisplay?.removeStaticCredit?.(this.credit);
    if (this.scenePrimitiveAdded && this.viewer.scene.primitives.contains?.(this.scenePrimitive)) {
      this.viewer.scene.primitives.remove(this.scenePrimitive);
    } else if (!this.scenePrimitive.isDestroyed()) {
      this.scenePrimitive.destroy();
    }
    this.scenePrimitiveAdded = false;
    this.started = false;
    this.#emitTelemetry();
    this.#resolveIdle();
  }
}

export async function loadShortbreadGeometryLayer(Cesium, options = {}) {
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const timeoutController = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
  positiveSafeInteger(timeoutMs, 'timeoutMs');
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
  try {
    const signal = combineSignals([options.signal, timeoutController.signal]);
    const response = await invokeFetch(fetchImpl, SHORTBREAD_TILEJSON_URL, {
      method: 'GET',
      headers: { accept: 'application/json' },
      credentials: 'omit',
      redirect: 'error',
      signal,
    });
    if (!response.ok) throw new Error(`Shortbread upstream returned HTTP ${response.status}.`);
    const bytes = await readResponseBytesBounded(response, {
      maximumBytes: MAXIMUM_TILEJSON_BYTES,
      label: 'Shortbread TileJSON response',
      tooLargeCode: 'ERR_SHORTBREAD_TILEJSON_TOO_LARGE',
    });
    const tileJson = JSON.parse(new TextDecoder().decode(bytes));
    const layer = new ShortbreadGeometryLayer(Cesium, {
      ...options,
      fetchImpl,
      tileJson,
    });
    await layer.start();
    return layer;
  } finally {
    clearTimeout(timeoutId);
  }
}
