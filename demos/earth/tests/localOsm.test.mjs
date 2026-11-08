import assert from 'node:assert/strict';
import test from 'node:test';

import * as Cesium from 'cesium';

import { GEODATA_LIMITS } from '../../../services/geodata/src/config.js';
import { parseAndSnapBbox } from '../../../services/geodata/src/osm/bbox.js';
import { normalizeOverpassRegion } from '../../../services/geodata/src/osm/normalize.js';
import { createOverpassFixture } from '../../../services/geodata/test/fixture.js';

import {
  LOCAL_OSM_HEIGHT_OFFSETS_METERS,
  LOCAL_OSM_WATER_HEIGHT_ERROR_CODE,
  LOCAL_OSM_WATER_SEGMENT_HEIGHT_ERROR_CODE,
  classifyLocalRoad,
  extractLocalOsmCollections,
  normalizeLocalBuilding,
  renderLocalOsmRegion,
} from '../src/layers/localOsm.js';
import { EARTH_GEOMETRY_STYLE } from '../src/layers/geometryStyle.js';

function createViewer() {
  return {
    scene: {
      primitives: new Cesium.PrimitiveCollection(),
      postRender: new Cesium.Event(),
      renderError: new Cesium.Event(),
      globe: { ellipsoid: Cesium.Ellipsoid.WGS84 },
      requestRenderCount: 0,
      requestRender() { this.requestRenderCount += 1; },
    },
  };
}

function localEnvelope({ roadCoordinates, buildingCoordinates } = {}) {
  return {
    provenance: { attribution: '© OpenStreetMap contributors' },
    data: {
      type: 'OsmRegion',
      roads: {
        type: 'FeatureCollection',
        features: [{
          id: 'way/road',
          properties: { semantics: { highway: 'primary' } },
          geometry: {
            type: 'LineString',
            coordinates: roadCoordinates ?? [[-150, 61], [-149, 61]],
          },
        }],
      },
      buildings: {
        type: 'FeatureCollection',
        features: [{
          id: 'way/building',
          properties: { heights: { heightMeters: 12, minimumHeightMeters: 0 } },
          geometry: {
            type: 'Polygon',
            coordinates: buildingCoordinates ?? [[
              [-150, 61],
              [-149.99, 61],
              [-149.99, 61.01],
              [-150, 61],
            ]],
          },
        }],
      },
      roadGraph: { schemaVersion: 'peercompute.geo.road-graph.v1', nodes: [], edges: [] },
      counts: { roads: 1, buildings: 1 },
    },
  };
}

function primitiveHeights(collection) {
  const line = collection.get(0, new Cesium.BufferPolyline());
  const packed = line.getPositions();
  const heights = [];
  for (let index = 0; index < packed.length; index += 3) {
    const cartographic = Cesium.Cartographic.fromCartesian(new Cesium.Cartesian3(
      packed[index],
      packed[index + 1],
      packed[index + 2],
    ));
    heights.push(cartographic.height);
  }
  return heights;
}

function firstMaterial(collection) {
  const line = collection.get(0, new Cesium.BufferPolyline());
  return line.getMaterial(new Cesium.BufferPolylineMaterial());
}

test('extracts canonical local road, building, graph, count, and provenance fields', () => {
  const roads = { type: 'FeatureCollection', features: [{ id: 'r1' }] };
  const buildings = { type: 'FeatureCollection', features: [{ id: 'b1' }] };
  const graph = { nodes: [{ id: 1 }], edges: [] };
  const result = extractLocalOsmCollections({
    provenance: { id: 'osm-local-region' },
    data: {
      type: 'OsmRegion',
      roads,
      buildings,
      roadGraph: { ...graph, schemaVersion: 'peercompute.geo.road-graph.v1' },
      counts: { roads: 1, buildings: 1 },
    },
  });
  assert.deepEqual(result.roads, roads.features);
  assert.deepEqual(result.buildings, buildings.features);
  assert.deepEqual(result.graph, { ...graph, schemaVersion: 'peercompute.geo.road-graph.v1' });
  assert.deepEqual(result.counts, { roads: 1, buildings: 1 });
  assert.deepEqual(result.provenance, { id: 'osm-local-region' });
});

test('rejects compatibility or malformed collection nesting', () => {
  assert.throws(() => extractLocalOsmCollections({
    collections: {
      roads: { type: 'FeatureCollection', features: [{ id: 1 }] },
      buildings: { type: 'FeatureCollection', features: [] },
    },
  }), /canonical geodata region contract/u);
  assert.throws(() => extractLocalOsmCollections({}), /canonical geodata region contract/u);
});

test('adapts the canonical backend road and building property contract', () => {
  const road = classifyLocalRoad({
    rawTags: { highway: 'service' },
    semantics: { highway: 'primary', motorcycleAccess: { allowed: true } },
  });
  assert.equal(road.category, 'primary');
  assert.equal(road.color, '#ffe74a');

  const building = normalizeLocalBuilding({
    rawTags: { building: 'apartments', 'building:levels': '99' },
    heights: {
      heightMeters: 12.192,
      minimumHeightMeters: 3,
      heightProvenance: 'source-height',
      heightWasClamped: false,
      sourceHeight: '40 ft',
      sourceLevels: null,
    },
  });
  assert.equal(building.heightMeters, 12.192);
  assert.equal(building.baseHeightMeters, 3);
  assert.equal(building.heightSource, 'source-height');
  assert.equal(building.heightDerived, false);
  assert.equal(building.sourceHeight, '40 ft');
});

test('consumes the actual geodata normalizer contract without a hand-written shape', () => {
  const bbox = parseAndSnapBbox('-0.02,-0.02,0.04,0.04', GEODATA_LIMITS);
  const region = normalizeOverpassRegion(createOverpassFixture(), {
    bbox,
    layers: ['roads', 'buildings'],
    vehicle: 'motorcycle',
    limits: GEODATA_LIMITS,
  });
  const collections = extractLocalOsmCollections({
    provenance: { attribution: '© OpenStreetMap contributors' },
    data: region,
  });
  assert.equal(collections.roads.length, 4);
  assert.equal(collections.buildings.length, 4);
  const residential = collections.roads.find((feature) => feature.id === 'way/200');
  assert.equal(classifyLocalRoad(residential.properties).category, 'residential');
  const feet = collections.buildings.find((feature) => feature.id === 'way/500');
  assert.equal(normalizeLocalBuilding(feet.properties).heightMeters, 12.192);
  assert.equal(normalizeLocalBuilding(feet.properties).heightSource, 'source-height');
});

test('renders exact-capacity opaque buffers with sampled building terrain and roads above water', () => {
  const viewer = createViewer();
  const telemetryEvents = [];
  const rendered = renderLocalOsmRegion(Cesium, viewer, localEnvelope(), {
    sampleHeight: () => -10,
    onTelemetry: (telemetry) => telemetryEvents.push(telemetry),
  });

  assert.equal(viewer.scene.primitives.length, 2);
  assert.equal(viewer.scene.primitives.get(0), rendered.buildingPrimitive);
  assert.equal(viewer.scene.primitives.get(1), rendered.roadPrimitive);
  assert.ok(rendered.buildingPrimitive instanceof Cesium.BufferPolylineCollection);
  assert.ok(rendered.roadPrimitive instanceof Cesium.BufferPolylineCollection);
  assert.equal(rendered.buildingPrimitive.primitiveCount, 1);
  assert.equal(rendered.roadPrimitive.primitiveCount, 1);
  assert.ok(rendered.roadPrimitive.vertexCount > 2, 'long source road should be densified');

  const buildingHeights = primitiveHeights(rendered.buildingPrimitive);
  const roadHeights = primitiveHeights(rendered.roadPrimitive);
  for (const height of buildingHeights) {
    assert.ok(Math.abs(height - (-10 + LOCAL_OSM_HEIGHT_OFFSETS_METERS.buildingWires)) < 1e-5);
  }
  for (const height of roadHeights) {
    assert.ok(Math.abs(height - LOCAL_OSM_HEIGHT_OFFSETS_METERS.localRoads) < 1e-5);
    assert.ok(height > EARTH_GEOMETRY_STYLE.heightOffsetsMeters.waterSurfaces);
  }
  for (const material of [
    firstMaterial(rendered.buildingPrimitive),
    firstMaterial(rendered.roadPrimitive),
  ]) {
    assert.equal(material.color.alpha, 1);
    assert.equal(material.outlineWidth, 0);
  }

  const pending = rendered.getTelemetry();
  assert.equal(rendered.geometryModel, 'actual-cesium-buffer-geometry');
  assert.equal(pending.geometryType, 'cesium-buffer-polyline');
  assert.equal(pending.geoJsonStaging, 'Cesium.GeoJsonPrimitive');
  assert.equal(pending.workerGeometryJobs, 0);
  assert.equal(pending.buildingFillPrimitiveCount, 0);
  assert.equal(pending.gpuSubmittedFrame, false);
  assert.equal(pending.renderReady, false);
  assert.equal(pending.terrainSampling.sampleFallbacks, 0);
  assert.equal(pending.waterHeightResolverProvided, false);
  assert.equal(pending.waterHeightAlongSegmentResolverProvided, false);
  assert.equal(pending.absoluteRoadOverInlandWaterGuaranteed, false);
  assert.equal(telemetryEvents.at(-1).lifecycleReason, 'install-pending');

  viewer.scene.postRender.raiseEvent(viewer.scene);
  assert.equal(rendered.gpuSubmittedFrame, true);
  assert.equal(rendered.gpuPresentedFrame, true);
  assert.equal(rendered.renderReady, true);
  assert.equal(telemetryEvents.at(-1).lifecycleReason, 'post-render-ready');
  rendered.dataSource.show = false;
  assert.equal(rendered.buildingPrimitive.show, false);
  assert.equal(rendered.roadPrimitive.show, false);
  assert.equal(rendered.renderReady, false);
  assert.equal(rendered.getTelemetry().visible, false);
  assert.equal(telemetryEvents.at(-1).lifecycleReason, 'visibility-hidden');
  const hiddenBuilding = rendered.buildingPrimitive;
  const hiddenEventCount = telemetryEvents.length;
  assert.equal(rendered.refreshHeights(), true);
  assert.notEqual(rendered.buildingPrimitive, hiddenBuilding);
  assert.equal(rendered.getTelemetry().lifecycleReason, 'refresh-heights-hidden');
  assert.equal(telemetryEvents.length, hiddenEventCount, 'hidden refreshes must not resurrect public status');
  rendered.dataSource.show = true;
  assert.equal(rendered.renderReady, false);
  assert.equal(rendered.gpuSubmittedFrame, false);
  assert.equal(telemetryEvents.at(-1).lifecycleReason, 'visibility-pending');
  viewer.scene.postRender.raiseEvent(viewer.scene);
  assert.equal(rendered.renderReady, true);

  rendered.destroy();
  assert.equal(viewer.scene.primitives.length, 0);
  assert.equal(telemetryEvents.at(-1).lifecycleReason, 'destroy');
});

test('refreshHeights atomically replaces immutable snapshots and reports readiness/error transitions', () => {
  const viewer = createViewer();
  const telemetryEvents = [];
  let sampledTerrain = 10;
  const rendered = renderLocalOsmRegion(Cesium, viewer, localEnvelope(), {
    sampleHeight: () => sampledTerrain,
    onTelemetry: (telemetry) => telemetryEvents.push(telemetry),
  });
  viewer.scene.postRender.raiseEvent(viewer.scene);
  const oldBuilding = rendered.buildingPrimitive;
  const oldRoad = rendered.roadPrimitive;

  sampledTerrain = 20;
  assert.equal(rendered.refreshHeights(), true);
  assert.notEqual(rendered.buildingPrimitive, oldBuilding);
  assert.notEqual(rendered.roadPrimitive, oldRoad);
  assert.equal(viewer.scene.primitives.length, 2);
  assert.equal(rendered.gpuSubmittedFrame, false);
  assert.equal(rendered.renderReady, false);
  assert.ok(telemetryEvents.some((event) => event.lifecycleReason === 'refresh-heights-pending'));
  assert.equal(telemetryEvents.at(-1).lifecycleReason, 'refresh-heights-installed');
  assert.ok(Math.abs(
    primitiveHeights(rendered.buildingPrimitive)[0]
      - (sampledTerrain + LOCAL_OSM_HEIGHT_OFFSETS_METERS.buildingWires),
  ) < 1e-5);
  assert.ok(Math.abs(
    primitiveHeights(rendered.roadPrimitive)[0]
      - (sampledTerrain + LOCAL_OSM_HEIGHT_OFFSETS_METERS.localRoads),
  ) < 1e-5);

  viewer.scene.postRender.raiseEvent(viewer.scene);
  assert.equal(rendered.renderReady, true);
  sampledTerrain = 30;
  assert.equal(rendered.refreshHeights(), true);
  viewer.scene.renderError.raiseEvent(viewer.scene, new Error('synthetic render failure'));
  assert.equal(rendered.renderReady, false);
  assert.equal(rendered.gpuSubmittedFrame, false);
  assert.equal(rendered.lastError, 'synthetic render failure');
  assert.equal(telemetryEvents.at(-1).lifecycleReason, 'render-error');
  rendered.destroy();
});

test('places local roads above finite inland-water samples and reports resolver coverage', () => {
  const viewer = createViewer();
  let waterResolverThrows = false;
  const rendered = renderLocalOsmRegion(Cesium, viewer, localEnvelope({
    roadCoordinates: [[-150, 61], [-149, 61]],
  }), {
    sampleHeight: () => 10,
    sampleWaterHeight: (longitude) => {
      if (waterResolverThrows) throw new Error('synthetic water sampling failure');
      return longitude < -149.5 ? 50 : undefined;
    },
    sampleWaterHeightAlongSegment: () => undefined,
  });

  const roadHeights = primitiveHeights(rendered.roadPrimitive);
  assert.ok(roadHeights.some((height) => Math.abs(
    height - (50 + LOCAL_OSM_HEIGHT_OFFSETS_METERS.localRoads),
  ) < 1e-5));
  assert.ok(roadHeights.some((height) => Math.abs(
    height - (10 + LOCAL_OSM_HEIGHT_OFFSETS_METERS.localRoads),
  ) < 1e-5));
  const telemetry = rendered.getTelemetry();
  assert.equal(telemetry.waterHeightResolverProvided, true);
  assert.equal(telemetry.waterHeightAlongSegmentResolverProvided, true);
  assert.equal(telemetry.absoluteRoadOverInlandWaterGuaranteed, true);
  assert.ok(telemetry.waterOverlapRoadCoordinateCount > 0);
  assert.equal(
    telemetry.waterOverlapRoadCoordinateCount,
    telemetry.terrainSampling.waterSampleHits,
  );
  assert.equal(telemetry.terrainSampling.waterSampleRequests, roadHeights.length);
  assert.equal(
    telemetry.terrainSampling.waterSampleRequests,
    telemetry.terrainSampling.waterSampleHits + telemetry.terrainSampling.waterSampleMisses,
  );
  assert.equal(telemetry.terrainSampling.waterSampleErrors, 0);
  assert.equal(telemetry.terrainSampling.waterSegmentSampleRequests, roadHeights.length - 1);
  assert.equal(telemetry.terrainSampling.waterSegmentSampleHits, 0);
  assert.equal(
    telemetry.terrainSampling.waterSegmentSampleMisses,
    telemetry.terrainSampling.waterSegmentSampleRequests,
  );

  const previousRoad = rendered.roadPrimitive;
  waterResolverThrows = true;
  assert.equal(rendered.refreshHeights(), false);
  assert.equal(rendered.roadPrimitive, previousRoad, 'failed rebuild retains the installed snapshot');
  assert.equal(rendered.getTelemetry().absoluteRoadOverInlandWaterGuaranteed, false);
  assert.equal(rendered.getTelemetry().waterHeightQueryErrorCount, 1);
  assert.equal(rendered.getTelemetry().lastErrorCode, LOCAL_OSM_WATER_HEIGHT_ERROR_CODE);
  waterResolverThrows = false;
  assert.equal(rendered.refreshHeights(), true);
  assert.equal(rendered.getTelemetry().absoluteRoadOverInlandWaterGuaranteed, true);
  assert.equal(rendered.getTelemetry().waterHeightQueryErrorCount, 0);
  assert.equal(rendered.getTelemetry().lastErrorCode, null);
  rendered.destroy();
});

test('raises both road endpoints above a narrow elevated lake crossed only between samples', () => {
  const viewer = createViewer();
  const crossedSegments = [];
  let segmentResolverFails = false;
  const lakeLongitude = -149.98;
  const rendered = renderLocalOsmRegion(Cesium, viewer, localEnvelope({
    roadCoordinates: [[-150, 61], [-149.96, 61]],
  }), {
    sampleHeight: () => 10,
    sampleWaterHeight: () => undefined,
    sampleWaterHeightAlongSegment(longitude1, latitude1, longitude2, latitude2) {
      crossedSegments.push([longitude1, latitude1, longitude2, latitude2]);
      if (segmentResolverFails) {
        const error = new Error('synthetic Shortbread segment cap');
        error.code = 'ERR_SHORTBREAD_WATER_SEGMENT_INTERSECTION_CAP';
        throw error;
      }
      const west = Math.min(longitude1, longitude2);
      const east = Math.max(longitude1, longitude2);
      return west < lakeLongitude && lakeLongitude < east ? 75 : undefined;
    },
  });

  const roadHeights = primitiveHeights(rendered.roadPrimitive);
  assert.equal(roadHeights.length, 2, 'the lake must remain strictly between source endpoints');
  for (const height of roadHeights) {
    assert.ok(Math.abs(
      height - (75 + LOCAL_OSM_HEIGHT_OFFSETS_METERS.localRoads),
    ) < 1e-5);
  }
  assert.equal(crossedSegments.length, 1);
  assert.ok(Math.abs(crossedSegments[0][0] - (-150)) < 1e-12);
  assert.equal(crossedSegments[0][1], 61);
  assert.ok(Math.abs(crossedSegments[0][2] - (-149.96)) < 1e-12);
  assert.equal(crossedSegments[0][3], 61);
  const telemetry = rendered.getTelemetry();
  assert.equal(telemetry.waterOverlapRoadCoordinateCount, 0);
  assert.equal(telemetry.waterOverlapRoadSegmentCount, 1);
  assert.equal(telemetry.terrainSampling.waterSegmentSampleRequests, 1);
  assert.equal(telemetry.terrainSampling.waterSegmentSampleHits, 1);
  assert.equal(telemetry.absoluteRoadOverInlandWaterGuaranteed, true);

  const previousRoad = rendered.roadPrimitive;
  segmentResolverFails = true;
  assert.equal(rendered.refreshHeights(), false);
  assert.equal(rendered.roadPrimitive, previousRoad, 'segment-cap failure retains prior geometry');
  assert.equal(rendered.getTelemetry().absoluteRoadOverInlandWaterGuaranteed, false);
  assert.equal(rendered.getTelemetry().waterHeightQueryErrorCount, 1);
  assert.equal(
    rendered.getTelemetry().lastErrorCode,
    LOCAL_OSM_WATER_SEGMENT_HEIGHT_ERROR_CODE,
  );
  segmentResolverFails = false;
  assert.equal(rendered.refreshHeights(), true);
  assert.equal(rendered.getTelemetry().absoluteRoadOverInlandWaterGuaranteed, true);
  rendered.destroy();
});

test('fails an initial local snapshot closed when its water-height resolver throws', () => {
  const viewer = createViewer();
  assert.throws(() => renderLocalOsmRegion(Cesium, viewer, localEnvelope(), {
    sampleHeight: () => 10,
    sampleWaterHeight() { throw new Error('synthetic initial water failure'); },
  }), (error) => error?.code === LOCAL_OSM_WATER_HEIGHT_ERROR_CODE);
  assert.equal(viewer.scene.primitives.length, 0);

  const segmentViewer = createViewer();
  assert.throws(() => renderLocalOsmRegion(Cesium, segmentViewer, localEnvelope(), {
    sampleHeight: () => 10,
    sampleWaterHeight: () => undefined,
    sampleWaterHeightAlongSegment() {
      const error = new Error('synthetic Shortbread lifetime cap');
      error.code = 'ERR_SHORTBREAD_WATER_SAMPLE_LIFETIME_CAP';
      throw error;
    },
  }), (error) => error?.code === LOCAL_OSM_WATER_SEGMENT_HEIGHT_ERROR_CODE
    && error?.cause?.code === 'ERR_SHORTBREAD_WATER_SAMPLE_LIFETIME_CAP');
  assert.equal(segmentViewer.scene.primitives.length, 0);
});

test('enforces deterministic primitive/vertex caps before GeoJSON buffer allocation', () => {
  const viewer = createViewer();
  const roadsFirst = renderLocalOsmRegion(Cesium, viewer, localEnvelope(), {
    maximumPrimitives: 1,
    maximumVertices: 100,
    maximumSegmentLengthMeters: 50_000,
    sampleHeight: () => 0,
  });
  assert.equal(roadsFirst.renderedRoads, 1);
  assert.equal(roadsFirst.renderedBuildings, 0);
  assert.equal(roadsFirst.roadPrimitive.primitiveCount, 1);
  assert.equal(roadsFirst.buildingPrimitive, null);
  assert.ok(roadsFirst.getTelemetry().terrainSampling.cappedPathCount > 0);
  roadsFirst.destroy();

  const cappedVertices = renderLocalOsmRegion(Cesium, viewer, localEnvelope(), {
    maximumPrimitives: 10,
    maximumVertices: 3,
    maximumSegmentLengthMeters: 5_000,
    sampleHeight: () => 0,
  });
  assert.equal(cappedVertices.renderedRoads, 0);
  assert.equal(cappedVertices.renderedBuildings, 0);
  assert.equal(cappedVertices.roadPrimitive, null);
  assert.equal(cappedVertices.buildingPrimitive, null);
  assert.equal(cappedVertices.gpuSubmittedFrame, false);
  assert.equal(cappedVertices.gpuPresentedFrame, false);
  assert.equal(cappedVertices.renderReady, false);
  assert.equal(cappedVertices.getTelemetry().settledEmpty, true);
  assert.ok(cappedVertices.getTelemetry().terrainSampling.cappedPathCount > 0);
  cappedVertices.destroy();
});

test('settles a valid empty local envelope without waiting for a nonexistent GPU submission', () => {
  const viewer = createViewer();
  const envelope = localEnvelope();
  envelope.data.roads.features = [];
  envelope.data.buildings.features = [];
  const rendered = renderLocalOsmRegion(Cesium, viewer, envelope);
  const telemetry = rendered.getTelemetry();
  assert.equal(viewer.scene.primitives.length, 0);
  assert.equal(telemetry.cpuGeometryValidated, true);
  assert.equal(telemetry.settledEmpty, true);
  assert.equal(rendered.gpuSubmittedFrame, false);
  assert.equal(rendered.gpuPresentedFrame, false);
  assert.equal(rendered.renderReady, false);
  assert.equal(telemetry.gpuSubmittedFrame, false);
  assert.equal(telemetry.gpuPresentedFrame, false);
  assert.equal(telemetry.renderReady, false);
  assert.equal(telemetry.lifecycleReason, 'settled-empty');
  rendered.destroy();
});

test('rejects out-of-contract WGS84 coordinates without longitude normalization loops', () => {
  const viewer = createViewer();
  const rendered = renderLocalOsmRegion(Cesium, viewer, localEnvelope({
    roadCoordinates: [[1e100, 61], [-149, 61]],
  }), {
    sampleHeight: () => 0,
  });
  assert.equal(rendered.renderedRoads, 0);
  assert.ok(rendered.getTelemetry().terrainSampling.rejectedPathCount > 0);
  rendered.destroy();
});
