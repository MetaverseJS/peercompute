import { classifyShortbreadRoad, normalizeBuildingHeight } from '@peercompute/geo-core';

import { EARTH_GEOMETRY_STYLE } from './geometryStyle.js';
import { terrainHeightSamplerForViewer } from './terrainGeometry.js';

export const LOCAL_OSM_HEIGHT_OFFSETS_METERS = Object.freeze({
  buildingWires: EARTH_GEOMETRY_STYLE.heightOffsetsMeters.buildingWires,
  localRoads: EARTH_GEOMETRY_STYLE.heightOffsetsMeters.localRoads,
});

export const LOCAL_OSM_BUFFER_LIMITS = Object.freeze({
  maximumPrimitives: 5_000,
  maximumVertices: 500_000,
  maximumSegmentLengthMeters: 5_000,
});

export const LOCAL_OSM_WATER_HEIGHT_ERROR_CODE = 'ERR_LOCAL_OSM_WATER_HEIGHT_SAMPLE';
export const LOCAL_OSM_WATER_SEGMENT_HEIGHT_ERROR_CODE =
  'ERR_LOCAL_OSM_WATER_HEIGHT_SEGMENT_SAMPLE';

const ACTUAL_BUFFER_RENDERER = EARTH_GEOMETRY_STYLE.renderingModel;
const WGS84_MAXIMUM_RADIUS_METERS = 6_378_137;

function featureCollection(value) {
  return value?.type === 'FeatureCollection' && Array.isArray(value.features) ? value.features : [];
}

function geometryLines(geometry) {
  if (geometry?.type === 'LineString') return [geometry.coordinates];
  if (geometry?.type === 'MultiLineString') return geometry.coordinates;
  return [];
}

function geometryPolygons(geometry) {
  if (geometry?.type === 'Polygon') return [geometry.coordinates];
  if (geometry?.type === 'MultiPolygon') return geometry.coordinates;
  return [];
}

function boundedCount(value, fallback, maximum, label) {
  const selected = value ?? fallback;
  if (!Number.isInteger(selected) || selected < 1 || selected > maximum) {
    throw new RangeError(`${label} must be an integer between 1 and ${maximum}.`);
  }
  return selected;
}

function boundedSegmentLength(value) {
  const selected = value ?? LOCAL_OSM_BUFFER_LIMITS.maximumSegmentLengthMeters;
  if (!Number.isFinite(selected) || selected <= 0 || selected > 50_000) {
    throw new RangeError('maximumSegmentLengthMeters must be between 0 and 50000.');
  }
  // A 5 km WGS84 Cartesian chord sags under 0.5 m. Keeping the effective
  // spacing at this ceiling leaves more than 3.5 m of the local-road offset
  // above a flat intersected water surface between submitted endpoints.
  return Math.min(Number(selected), LOCAL_OSM_BUFFER_LIMITS.maximumSegmentLengthMeters);
}

function normalizeLongitudeDegrees(value) {
  const normalized = ((value + 180) % 360 + 360) % 360 - 180;
  return normalized === -180 && value > 0 ? 180 : normalized;
}

function longitudeDeltaDegrees(left, right) {
  const delta = normalizeLongitudeDegrees(right - left);
  return delta === 180 ? -180 : delta;
}

function centralAngleRadians(left, right) {
  const leftLatitude = left[1] * Math.PI / 180;
  const rightLatitude = right[1] * Math.PI / 180;
  const latitudeDelta = rightLatitude - leftLatitude;
  const longitudeDelta = longitudeDeltaDegrees(left[0], right[0]) * Math.PI / 180;
  const sinLatitude = Math.sin(latitudeDelta / 2);
  const sinLongitude = Math.sin(longitudeDelta / 2);
  const haversine = sinLatitude ** 2
    + Math.cos(leftLatitude) * Math.cos(rightLatitude) * sinLongitude ** 2;
  return 2 * Math.asin(Math.min(1, Math.sqrt(Math.max(0, haversine))));
}

function validCoordinate(value) {
  return Array.isArray(value)
    && Number.isFinite(value[0])
    && Number.isFinite(value[1])
    && value[0] >= -180
    && value[0] <= 180
    && value[1] >= -90
    && value[1] <= 90;
}

function sameHorizontalPosition(left, right) {
  return left[0] === right[0] && left[1] === right[1];
}

function sampledHeight(sampleHeight, longitude, latitude, stats) {
  stats.sampleRequests += 1;
  try {
    const value = sampleHeight?.(longitude, latitude);
    if (Number.isFinite(value)) {
      stats.sampleHits += 1;
      return Number(value);
    }
  } catch {
    stats.sampleErrors += 1;
  }
  stats.sampleFallbacks += 1;
  return 0;
}

function elevatedHeight({
  heightOffsetMeters,
  latitude,
  longitude,
  minimumTerrainHeightMeters,
  sampleHeight,
  sampleWaterHeight,
  stats,
}) {
  const terrainHeight = sampledHeight(sampleHeight, longitude, latitude, stats);
  let surfaceHeight = Math.max(minimumTerrainHeightMeters, terrainHeight);
  if (sampleWaterHeight) {
    stats.waterSampleRequests += 1;
    try {
      const waterHeight = sampleWaterHeight(longitude, latitude);
      if (Number.isFinite(waterHeight)) {
        stats.waterSampleHits += 1;
        stats.waterOverlapRoadCoordinateCount += 1;
        surfaceHeight = Math.max(surfaceHeight, Number(waterHeight));
      } else if (waterHeight === undefined) {
        stats.waterSampleMisses += 1;
      } else {
        throw new TypeError('Water-height point resolver returned a non-finite value.');
      }
    } catch (cause) {
      stats.waterSampleErrors += 1;
      const error = new Error('Local OSM water-height resolver failed.');
      error.code = LOCAL_OSM_WATER_HEIGHT_ERROR_CODE;
      error.cause = cause;
      throw error;
    }
  }
  return surfaceHeight + heightOffsetMeters;
}

function raiseRoadSegmentsAboveWater(coordinates, {
  heightOffsetMeters,
  sampleWaterHeightAlongSegment,
  stats,
}) {
  if (!sampleWaterHeightAlongSegment) return;
  for (let index = 1; index < coordinates.length; index += 1) {
    const left = coordinates[index - 1];
    const right = coordinates[index];
    stats.waterSegmentSampleRequests += 1;
    try {
      const waterHeight = sampleWaterHeightAlongSegment(
        left[0],
        left[1],
        right[0],
        right[1],
      );
      if (Number.isFinite(waterHeight)) {
        stats.waterSegmentSampleHits += 1;
        stats.waterOverlapRoadSegmentCount += 1;
        const minimumRoadHeight = Number(waterHeight) + heightOffsetMeters;
        left[2] = Math.max(left[2], minimumRoadHeight);
        right[2] = Math.max(right[2], minimumRoadHeight);
      } else if (waterHeight === undefined) {
        stats.waterSegmentSampleMisses += 1;
      } else {
        throw new TypeError('Water-height segment resolver returned a non-finite value.');
      }
    } catch (cause) {
      stats.waterSegmentSampleErrors += 1;
      const error = new Error('Local OSM water-height segment resolver failed.');
      error.code = LOCAL_OSM_WATER_SEGMENT_HEIGHT_ERROR_CODE;
      error.cause = cause;
      throw error;
    }
  }
}

function densifyLine(coordinates, {
  close,
  heightOffsetMeters,
  maximumOutputVertices,
  maximumSegmentLengthMeters,
  minimumTerrainHeightMeters,
  sampleHeight,
  sampleWaterHeight,
  sampleWaterHeightAlongSegment,
  stats,
}) {
  if (!Array.isArray(coordinates)
    || coordinates.length < (close ? 3 : 2)
    || coordinates.length > maximumOutputVertices
    || !coordinates.every(validCoordinate)) {
    stats.rejectedPathCount += 1;
    return null;
  }
  const source = coordinates.map(([longitude, latitude]) => [Number(longitude), Number(latitude)]);
  if (close && !sameHorizontalPosition(source[0], source.at(-1))) source.push([...source[0]]);
  if (source.length > maximumOutputVertices) {
    stats.cappedPathCount += 1;
    return null;
  }
  const maximumAngle = maximumSegmentLengthMeters / WGS84_MAXIMUM_RADIUS_METERS;
  const result = [];
  for (let index = 1; index < source.length; index += 1) {
    const left = source[index - 1];
    const right = source[index];
    const subdivisions = Math.max(1, Math.ceil(centralAngleRadians(left, right) / maximumAngle));
    const additionalVertices = subdivisions + (index === 1 ? 1 : 0);
    if (result.length + additionalVertices > maximumOutputVertices) {
      stats.cappedPathCount += 1;
      return null;
    }
    if (index === 1) {
      const height = elevatedHeight({
        heightOffsetMeters,
        latitude: left[1],
        longitude: left[0],
        minimumTerrainHeightMeters,
        sampleHeight,
        sampleWaterHeight,
        stats,
      });
      result.push([left[0], left[1], height]);
    }
    const longitudeDelta = longitudeDeltaDegrees(left[0], right[0]);
    for (let step = 1; step <= subdivisions; step += 1) {
      const mix = step / subdivisions;
      const longitude = normalizeLongitudeDegrees(left[0] + longitudeDelta * mix);
      const latitude = left[1] + (right[1] - left[1]) * mix;
      const height = elevatedHeight({
        heightOffsetMeters,
        latitude,
        longitude,
        minimumTerrainHeightMeters,
        sampleHeight,
        sampleWaterHeight,
        stats,
      });
      result.push([longitude, latitude, height]);
    }
  }
  if (result.length < (close ? 4 : 2)) {
    stats.rejectedPathCount += 1;
    return null;
  }
  raiseRoadSegmentsAboveWater(result, {
    heightOffsetMeters,
    sampleWaterHeightAlongSegment,
    stats,
  });
  stats.densifiedVertexCount += result.length;
  return result;
}

function createOpaqueLineCollection(Cesium, viewer, features, expectedVertexCount) {
  if (features.length === 0) return null;
  const loader = Cesium.GeoJsonPrimitive.fromGeoJson({
    type: 'FeatureCollection',
    features,
  }, {
    allowPicking: false,
    ellipsoid: viewer.scene.globe?.ellipsoid ?? Cesium.Ellipsoid.WGS84,
  });
  let collection = null;
  try {
    if (!loader.polylines
      || loader.polygons
      || loader.points
      || loader.polylines.primitiveCount !== features.length
      || loader.polylines.vertexCount !== expectedVertexCount) {
      throw new Error('Local OSM GeoJSON staging counts did not match the bounded line plan.');
    }
    collection = new Cesium.BufferPolylineCollection({
      primitiveCountMax: features.length,
      vertexCountMax: expectedVertexCount,
      allowPicking: false,
      blendOption: Cesium.BlendOption.OPAQUE,
    });
    const materialCache = new Map();
    const sourceLine = new Cesium.BufferPolyline();
    const targetLine = new Cesium.BufferPolyline();
    for (let index = 0; index < loader.polylines.primitiveCount; index += 1) {
      loader.polylines.get(index, sourceLine);
      const properties = loader.getProperties(sourceLine.featureId);
      const color = properties.bufferColor;
      const width = Math.max(1, Math.min(255, Math.round(properties.bufferWidth)));
      const materialKey = `${color}/${width}`;
      let material = materialCache.get(materialKey);
      if (!material) {
        material = new Cesium.BufferPolylineMaterial({
          color: Cesium.Color.fromCssColorString(color),
          outlineWidth: 0,
          width,
        });
        materialCache.set(materialKey, material);
      }
      collection.add({
        featureId: index,
        positions: sourceLine.getPositions(),
        material,
      }, targetLine);
    }
    if (collection.primitiveCount !== features.length || collection.vertexCount !== expectedVertexCount) {
      throw new Error('Local OSM opaque buffer counts did not match the GeoJSON staging snapshot.');
    }
    return collection;
  } catch (error) {
    collection?.destroy?.();
    throw error;
  } finally {
    loader.destroy();
  }
}

function primitiveCountsMatch(primitive, expectedPrimitiveCount, expectedVertexCount) {
  if (!primitive) return expectedPrimitiveCount === 0 && expectedVertexCount === 0;
  return primitive.primitiveCount === expectedPrimitiveCount
    && primitive.vertexCount === expectedVertexCount;
}

function removeScenePrimitive(scene, primitive) {
  if (!primitive) return;
  if (typeof scene.primitives.contains !== 'function' || scene.primitives.contains(primitive)) {
    scene.primitives.remove(primitive);
  }
}

function destroyUninstalled(primitive, installed) {
  if (primitive && !installed.includes(primitive)) primitive.destroy?.();
}

function cloneTelemetry(value) {
  return JSON.parse(JSON.stringify(value));
}

function errorMessage(sceneOrError, possibleError) {
  const value = possibleError ?? sceneOrError;
  return value instanceof Error ? value.message : String(value ?? 'Cesium render failed.');
}

function planLocalGeometry(collections, {
  buildingLimit,
  maximumPrimitives,
  maximumSegmentLengthMeters,
  maximumVertices,
  roadLimit,
  sampleHeight,
  sampleWaterHeight,
  sampleWaterHeightAlongSegment,
}) {
  const stats = {
    sampleRequests: 0,
    sampleHits: 0,
    sampleFallbacks: 0,
    sampleErrors: 0,
    waterSampleRequests: 0,
    waterSampleHits: 0,
    waterSampleMisses: 0,
    waterSampleErrors: 0,
    waterOverlapRoadCoordinateCount: 0,
    waterSegmentSampleRequests: 0,
    waterSegmentSampleHits: 0,
    waterSegmentSampleMisses: 0,
    waterSegmentSampleErrors: 0,
    waterOverlapRoadSegmentCount: 0,
    densifiedVertexCount: 0,
    cappedPathCount: 0,
    rejectedPathCount: 0,
  };
  const roadFeatures = [];
  const buildingFeatures = [];
  let plannedVertices = 0;
  let renderedRoads = 0;
  let renderedBuildings = 0;

  // Roads consume the bounded planning budget first because their physical
  // precedence over building wires and water is operationally significant.
  for (const feature of collections.roads.slice(0, roadLimit)) {
    const style = classifyLocalRoad(feature.properties);
    for (const line of geometryLines(feature.geometry)) {
      if (roadFeatures.length + buildingFeatures.length >= maximumPrimitives) {
        stats.cappedPathCount += 1;
        continue;
      }
      const coordinates = densifyLine(line, {
        close: false,
        heightOffsetMeters: LOCAL_OSM_HEIGHT_OFFSETS_METERS.localRoads,
        maximumOutputVertices: maximumVertices - plannedVertices,
        maximumSegmentLengthMeters,
        minimumTerrainHeightMeters: 0,
        sampleHeight,
        sampleWaterHeight,
        sampleWaterHeightAlongSegment,
        stats,
      });
      if (!coordinates) continue;
      roadFeatures.push({
        type: 'Feature',
        id: `osm-road-${feature.id ?? feature.properties?.osmWayId ?? renderedRoads}-${renderedRoads}`,
        properties: {
          ...feature.properties,
          renderCategory: 'local-road',
          roadCategory: style.category,
          sourceAuthoritative: true,
          operationalUse: false,
          bufferColor: style.color,
          bufferWidth: Math.max(2, style.width + 1),
        },
        geometry: { type: 'LineString', coordinates },
      });
      plannedVertices += coordinates.length;
      renderedRoads += 1;
    }
  }

  for (const feature of collections.buildings.slice(0, buildingLimit)) {
    const normalized = normalizeLocalBuilding(feature.properties);
    for (const rings of geometryPolygons(feature.geometry)) {
      let renderedPolygon = false;
      if (!Array.isArray(rings)) continue;
      rings.forEach((ring, ringIndex) => {
        if (roadFeatures.length + buildingFeatures.length >= maximumPrimitives) {
          stats.cappedPathCount += 1;
          return;
        }
        const coordinates = densifyLine(ring, {
          close: true,
          heightOffsetMeters: LOCAL_OSM_HEIGHT_OFFSETS_METERS.buildingWires,
          maximumOutputVertices: maximumVertices - plannedVertices,
          maximumSegmentLengthMeters,
          minimumTerrainHeightMeters: Number.NEGATIVE_INFINITY,
          sampleHeight,
          stats,
        });
        if (!coordinates) return;
        buildingFeatures.push({
          type: 'Feature',
          id: `osm-building-${feature.id ?? feature.properties?.osmWayId ?? renderedBuildings}-wire-${ringIndex}`,
          properties: {
            ...feature.properties,
            ...normalized,
            renderCategory: 'building-wireframe',
            sourceAuthoritative: true,
            operationalUse: false,
            bufferColor: EARTH_GEOMETRY_STYLE.colors.building,
            bufferWidth: 1.25,
          },
          geometry: { type: 'LineString', coordinates },
        });
        plannedVertices += coordinates.length;
        renderedPolygon = true;
      });
      if (renderedPolygon) renderedBuildings += 1;
    }
  }

  const buildingVertexCount = buildingFeatures.reduce(
    (total, feature) => total + feature.geometry.coordinates.length,
    0,
  );
  const roadVertexCount = roadFeatures.reduce(
    (total, feature) => total + feature.geometry.coordinates.length,
    0,
  );
  return Object.freeze({
    buildingFeatures,
    buildingVertexCount,
    roadFeatures,
    roadVertexCount,
    renderedBuildings,
    renderedRoads,
    stats: Object.freeze(stats),
  });
}

export function extractLocalOsmCollections(envelope) {
  const data = envelope?.data;
  if (data?.type !== 'OsmRegion'
    || data.roads?.type !== 'FeatureCollection'
    || data.buildings?.type !== 'FeatureCollection'
    || data.roadGraph?.schemaVersion !== 'peercompute.geo.road-graph.v1') {
    throw new TypeError('Local OSM rendering requires the canonical geodata region contract.');
  }
  return {
    roads: featureCollection(data.roads),
    buildings: featureCollection(data.buildings),
    graph: data.roadGraph,
    counts: data.counts,
    provenance: envelope?.provenance ?? null,
  };
}

export function classifyLocalRoad(properties = {}) {
  return classifyShortbreadRoad({
    highway: properties?.semantics?.highway
      ?? properties?.rawTags?.highway
      ?? properties?.highway,
  });
}

export function normalizeLocalBuilding(properties = {}) {
  const backend = properties?.heights;
  if (Number.isFinite(backend?.heightMeters) && backend.heightMeters > 0) {
    return Object.freeze({
      heightMeters: backend.heightMeters,
      baseHeightMeters: Number.isFinite(backend.minimumHeightMeters)
        ? backend.minimumHeightMeters
        : 0,
      heightSource: backend.heightProvenance ?? 'backend-normalized',
      baseHeightSource: backend.minimumHeightMeters > 0 ? 'backend-normalized' : 'ground',
      heightDerived: backend.heightProvenance !== 'source-height',
      heightClamped: backend.heightWasClamped === true,
      sourceHeight: backend.sourceHeight ?? null,
      sourceLevels: backend.sourceLevels ?? null,
    });
  }
  return normalizeBuildingHeight(properties?.rawTags ?? properties?.tags ?? properties);
}

export function renderLocalOsmRegion(
  Cesium,
  viewer,
  envelope,
  {
    maximumRoads = 1_500,
    maximumBuildings = 1_500,
    maximumPrimitives = LOCAL_OSM_BUFFER_LIMITS.maximumPrimitives,
    maximumVertices = LOCAL_OSM_BUFFER_LIMITS.maximumVertices,
    maximumSegmentLengthMeters = LOCAL_OSM_BUFFER_LIMITS.maximumSegmentLengthMeters,
    sampleHeight,
    sampleWaterHeight,
    sampleWaterHeightAlongSegment,
    onTelemetry,
  } = {},
) {
  if (!Cesium?.GeoJsonPrimitive
    || !Cesium?.BufferPolylineCollection
    || !Cesium?.BufferPolyline
    || !Cesium?.BufferPolylineMaterial
    || !Cesium?.Color
    || Cesium?.BlendOption?.OPAQUE === undefined) {
    throw new TypeError('Cesium GeoJSON and opaque buffer-polyline primitives are required.');
  }
  const scene = viewer?.scene;
  if (typeof scene?.primitives?.add !== 'function'
    || typeof scene?.primitives?.remove !== 'function'
    || typeof scene?.postRender?.addEventListener !== 'function'
    || typeof scene?.renderError?.addEventListener !== 'function') {
    throw new TypeError('A Cesium Viewer with public primitive and render events is required.');
  }
  if (sampleHeight !== undefined && typeof sampleHeight !== 'function') {
    throw new TypeError('sampleHeight must be a function when provided.');
  }
  if (sampleWaterHeight !== undefined && typeof sampleWaterHeight !== 'function') {
    throw new TypeError('sampleWaterHeight must be a function when provided.');
  }
  if (sampleWaterHeightAlongSegment !== undefined
    && typeof sampleWaterHeightAlongSegment !== 'function') {
    throw new TypeError('sampleWaterHeightAlongSegment must be a function when provided.');
  }
  if (onTelemetry !== undefined && typeof onTelemetry !== 'function') {
    throw new TypeError('onTelemetry must be a function when provided.');
  }
  const roadLimit = boundedCount(maximumRoads, 1_500, 10_000, 'maximumRoads');
  const buildingLimit = boundedCount(maximumBuildings, 1_500, 10_000, 'maximumBuildings');
  const primitiveLimit = boundedCount(
    maximumPrimitives,
    LOCAL_OSM_BUFFER_LIMITS.maximumPrimitives,
    20_000,
    'maximumPrimitives',
  );
  const vertexLimit = boundedCount(
    maximumVertices,
    LOCAL_OSM_BUFFER_LIMITS.maximumVertices,
    4_000_000,
    'maximumVertices',
  );
  const segmentLength = boundedSegmentLength(maximumSegmentLengthMeters);
  const collections = extractLocalOsmCollections(envelope);
  const explicitSampler = sampleHeight;
  const explicitWaterSampler = sampleWaterHeight;
  const explicitWaterSegmentSampler = sampleWaterHeightAlongSegment;

  let buildingPrimitive = null;
  let roadPrimitive = null;
  let plan = null;
  let visible = true;
  let destroyed = false;
  let generation = 0;
  let gpuSubmittedFrame = false;
  let gpuPresentedFrame = false;
  let renderReady = false;
  let lastError = null;
  let lastErrorCode = null;
  let waterHeightQueryErrorCount = 0;
  let observedSceneRenderError = false;
  let awaitingGpuSubmission = false;
  let removePostRender = () => {};
  let lifecycleReason = 'initializing';
  let suppressTelemetry = false;

  const installedPrimitives = () => [buildingPrimitive, roadPrimitive].filter(Boolean);
  const selectedSampler = () => explicitSampler ?? terrainHeightSamplerForViewer(viewer);
  const countsMatch = (snapshotPlan, building, road) => primitiveCountsMatch(
    building,
    snapshotPlan.buildingFeatures.length,
    snapshotPlan.buildingVertexCount,
  ) && primitiveCountsMatch(road, snapshotPlan.roadFeatures.length, snapshotPlan.roadVertexCount);

  const telemetry = () => ({
    schemaVersion: 'peercompute.earthgrid.local-osm-buffer-geometry.v1',
    renderer: ACTUAL_BUFFER_RENDERER,
    geometryType: 'cesium-buffer-polyline',
    geoJsonStaging: 'Cesium.GeoJsonPrimitive',
    immutableSnapshotCollections: true,
    workerGeometryJobs: 0,
    cpuGeometryValidated: plan ? countsMatch(plan, buildingPrimitive, roadPrimitive) : false,
    gpuSubmittedFrame,
    gpuPresentedFrame,
    renderReady,
    settledEmpty: !buildingPrimitive && !roadPrimitive,
    visible,
    readiness: {
      cpuGeometryValidated: plan ? countsMatch(plan, buildingPrimitive, roadPrimitive) : false,
      gpuSubmittedFrame,
      gpuPresentedFrame,
      renderReady,
      settledEmpty: !buildingPrimitive && !roadPrimitive,
    },
    lifecycleReason,
    categoryOrder: ['building-wireframe', 'local-road'],
    categoryElevationOffsetsMeters: { ...LOCAL_OSM_HEIGHT_OFFSETS_METERS },
    roadMinimumTerrainHeightMeters: 0,
    roadElevationPolicy: 'point-and-segment-water-max-plus-local-road-offset',
    inlandWaterClearance: explicitWaterSampler && explicitWaterSegmentSampler
      ? 'point-and-segment-water-resolver-backed'
      : 'best-available-without-water-height-query',
    waterHeightResolverProvided: Boolean(explicitWaterSampler),
    waterHeightAlongSegmentResolverProvided: Boolean(explicitWaterSegmentSampler),
    waterHeightQueryErrorCount,
    waterOverlapRoadCoordinateCount: plan?.stats.waterOverlapRoadCoordinateCount ?? 0,
    waterOverlapRoadSegmentCount: plan?.stats.waterOverlapRoadSegmentCount ?? 0,
    absoluteRoadOverInlandWaterGuaranteed: Boolean(explicitWaterSampler)
      && Boolean(explicitWaterSegmentSampler)
      && waterHeightQueryErrorCount === 0
      && (plan?.stats.waterSampleErrors ?? 0) === 0
      && (plan?.stats.waterSegmentSampleErrors ?? 0) === 0,
    buildingTerrainHeightPolicy: 'exact-sampled-height-plus-offset',
    buildingFillPrimitiveCount: 0,
    buildingWirePrimitiveCount: plan?.buildingFeatures.length ?? 0,
    roadPrimitiveCount: plan?.roadFeatures.length ?? 0,
    expectedVertexCount: (plan?.buildingVertexCount ?? 0) + (plan?.roadVertexCount ?? 0),
    actualVertexCount: (buildingPrimitive?.vertexCount ?? 0) + (roadPrimitive?.vertexCount ?? 0),
    maximumPrimitives: primitiveLimit,
    maximumVertices: vertexLimit,
    maximumSegmentLengthMeters: segmentLength,
    terrainSampling: { ...(plan?.stats ?? {}) },
    linePassesPerPath: 1,
    rasterPainted: false,
    glow: false,
    observedSceneRenderError,
    lastError,
    lastErrorCode,
  });
  const emitTelemetry = (reason) => {
    lifecycleReason = reason;
    if (!onTelemetry || suppressTelemetry) return;
    try {
      onTelemetry(Object.freeze(cloneTelemetry(telemetry())));
    } catch {
      // A status observer must not invalidate successfully built geometry.
    }
  };

  const removeRenderError = scene.renderError.addEventListener((sceneOrError, possibleError) => {
    if (destroyed || !awaitingGpuSubmission) return;
    lastError = errorMessage(sceneOrError, possibleError);
    lastErrorCode = null;
    observedSceneRenderError = true;
    awaitingGpuSubmission = false;
    gpuSubmittedFrame = false;
    gpuPresentedFrame = false;
    renderReady = false;
    removePostRender();
    removePostRender = () => {};
    emitTelemetry('render-error');
  });

  const scheduleReadiness = (snapshotGeneration, snapshotPlan, building, road) => {
    removePostRender();
    awaitingGpuSubmission = Boolean(building || road);
    gpuSubmittedFrame = false;
    gpuPresentedFrame = false;
    renderReady = false;
    observedSceneRenderError = false;
    if (!awaitingGpuSubmission) {
      return false;
    }
    let removeListener = null;
    const remove = scene.postRender.addEventListener(() => {
      if (!visible) return;
      removeListener?.();
      removeListener = null;
      awaitingGpuSubmission = false;
      if (destroyed
        || snapshotGeneration !== generation
        || building !== buildingPrimitive
        || road !== roadPrimitive
        || lastError) {
        return;
      }
      if (!countsMatch(snapshotPlan, building, road)) {
        lastError = 'Local OSM buffer snapshot counts changed after installation.';
        return;
      }
      gpuSubmittedFrame = true;
      gpuPresentedFrame = true;
      renderReady = true;
      emitTelemetry('post-render-ready');
    });
    removeListener = typeof remove === 'function' ? remove : null;
    removePostRender = () => {
      removeListener?.();
      removeListener = null;
    };
    return true;
  };

  const buildSnapshot = () => {
    const snapshotPlan = planLocalGeometry(collections, {
      buildingLimit,
      maximumPrimitives: primitiveLimit,
      maximumSegmentLengthMeters: segmentLength,
      maximumVertices: vertexLimit,
      roadLimit,
      sampleHeight: selectedSampler(),
      sampleWaterHeight: explicitWaterSampler,
      sampleWaterHeightAlongSegment: explicitWaterSegmentSampler,
    });
    const building = createOpaqueLineCollection(
      Cesium,
      viewer,
      snapshotPlan.buildingFeatures,
      snapshotPlan.buildingVertexCount,
    );
    let road = null;
    try {
      road = createOpaqueLineCollection(
        Cesium,
        viewer,
        snapshotPlan.roadFeatures,
        snapshotPlan.roadVertexCount,
      );
    } catch (error) {
      building?.destroy?.();
      throw error;
    }
    if (!countsMatch(snapshotPlan, building, road)) {
      building?.destroy?.();
      road?.destroy?.();
      throw new Error('Local OSM buffer snapshot counts did not match the bounded geometry plan.');
    }
    return { snapshotPlan, building, road };
  };

  const installSnapshot = ({ snapshotPlan, building, road }) => {
    const newlyInstalled = [];
    try {
      // Building wires are submitted before roads; physical elevations remain
      // authoritative even if other scene collections are later replaced.
      if (building) newlyInstalled.push(scene.primitives.add(building));
      if (road) newlyInstalled.push(scene.primitives.add(road));
    } catch (error) {
      for (const primitive of [...newlyInstalled].reverse()) removeScenePrimitive(scene, primitive);
      destroyUninstalled(building, newlyInstalled);
      destroyUninstalled(road, newlyInstalled);
      throw error;
    }
    const previous = installedPrimitives();
    buildingPrimitive = building;
    roadPrimitive = road;
    plan = snapshotPlan;
    generation += 1;
    lastError = null;
    lastErrorCode = null;
    waterHeightQueryErrorCount = 0;
    for (const primitive of previous.reverse()) removeScenePrimitive(scene, primitive);
    for (const primitive of installedPrimitives()) primitive.show = visible;
    if (!visible) {
      removePostRender();
      awaitingGpuSubmission = false;
      gpuSubmittedFrame = false;
      gpuPresentedFrame = false;
      renderReady = false;
      emitTelemetry('install-hidden');
    } else {
      const submissionPending = scheduleReadiness(generation, snapshotPlan, building, road);
      emitTelemetry(submissionPending ? 'install-pending' : 'settled-empty');
    }
    scene.requestRender?.();
  };

  try {
    installSnapshot(buildSnapshot());
  } catch (error) {
    removeRenderError?.();
    throw error;
  }

  const facade = { name: 'earthgrid-local-osm' };
  Object.defineProperty(facade, 'show', {
    enumerable: true,
    get() { return visible; },
    set(value) {
      const nextVisible = Boolean(value);
      if (nextVisible === visible) return;
      visible = nextVisible;
      for (const primitive of installedPrimitives()) primitive.show = visible;
      if (!visible) {
        awaitingGpuSubmission = false;
        gpuPresentedFrame = false;
        renderReady = false;
        removePostRender();
        removePostRender = () => {};
        emitTelemetry('visibility-hidden');
      } else if (plan) {
        const submissionPending = scheduleReadiness(
          generation,
          plan,
          buildingPrimitive,
          roadPrimitive,
        );
        emitTelemetry(submissionPending ? 'visibility-pending' : 'visibility-settled-empty');
      }
      scene.requestRender?.();
    },
  });
  const dataSource = Object.freeze(facade);

  return {
    dataSource,
    get buildingPrimitive() { return buildingPrimitive; },
    get roadPrimitive() { return roadPrimitive; },
    sourceRoads: collections.roads.length,
    sourceBuildings: collections.buildings.length,
    get renderedRoads() { return plan?.renderedRoads ?? 0; },
    get renderedBuildings() { return plan?.renderedBuildings ?? 0; },
    graph: collections.graph,
    get displayOmitted() {
      return Math.max(0, collections.roads.length - roadLimit)
        + Math.max(0, collections.buildings.length - buildingLimit)
        + (plan?.stats.cappedPathCount ?? 0);
    },
    geometryModel: ACTUAL_BUFFER_RENDERER,
    geometryType: 'cesium-buffer-polyline',
    rasterPainted: false,
    glow: false,
    workerGeometryJobs: 0,
    categoryOrder: Object.freeze(['building-wireframe', 'local-road']),
    categoryElevationOffsetsMeters: LOCAL_OSM_HEIGHT_OFFSETS_METERS,
    heightOffsetsMeters: LOCAL_OSM_HEIGHT_OFFSETS_METERS,
    get gpuSubmittedFrame() { return gpuSubmittedFrame; },
    get gpuPresentedFrame() { return gpuPresentedFrame; },
    get renderReady() { return renderReady; },
    get lastError() { return lastError; },
    getTelemetry() { return cloneTelemetry(telemetry()); },
    refreshHeights() {
      if (destroyed) return false;
      const refreshWhileHidden = !visible;
      suppressTelemetry = refreshWhileHidden;
      gpuSubmittedFrame = false;
      gpuPresentedFrame = false;
      renderReady = false;
      emitTelemetry('refresh-heights-pending');
      try {
        installSnapshot(buildSnapshot());
        emitTelemetry(refreshWhileHidden ? 'refresh-heights-hidden' : 'refresh-heights-installed');
        return true;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        lastErrorCode = typeof error?.code === 'string' ? error.code : null;
        waterHeightQueryErrorCount = [
          LOCAL_OSM_WATER_HEIGHT_ERROR_CODE,
          LOCAL_OSM_WATER_SEGMENT_HEIGHT_ERROR_CODE,
        ].includes(error?.code) ? 1 : 0;
        emitTelemetry(refreshWhileHidden ? 'refresh-heights-hidden-error' : 'refresh-heights-error');
        return false;
      } finally {
        suppressTelemetry = false;
      }
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      generation += 1;
      awaitingGpuSubmission = false;
      removePostRender();
      removeRenderError?.();
      gpuSubmittedFrame = false;
      gpuPresentedFrame = false;
      renderReady = false;
      emitTelemetry('destroy');
      for (const primitive of installedPrimitives().reverse()) removeScenePrimitive(scene, primitive);
      buildingPrimitive = null;
      roadPrimitive = null;
      plan = null;
    },
  };
}
