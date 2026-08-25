import assert from 'node:assert/strict';
import test from 'node:test';

import * as Cesium from 'cesium';
import { PbfWriter } from 'pbf';

import {
  classifyShortbreadRoad,
  decodeShortbreadTile,
  formatShortbreadTileUrl,
  shortbreadDrawCommands,
  SHORTBREAD_MAXIMUM_FEATURES_PER_TILE,
  SHORTBREAD_WATER_STYLE,
  validateShortbreadTileJson
} from '../src/vector/shortbread.js';
import { ShortbreadImageryProvider } from '../src/vector/shortbreadImagery.js';

const tileJson = {
  tilejson: '3.0.0',
  name: 'Shortbread',
  minzoom: 0,
  maxzoom: 14,
  tiles: ['https://vector.openstreetmap.org/shortbread_v1/{z}/{x}/{y}.mvt'],
  vector_layers: [
    { id: 'ocean' },
    { id: 'water_polygons' },
    { id: 'streets' },
    { id: 'buildings' }
  ],
  attribution: '© OpenStreetMap contributors'
};

function writePointFeature(_feature, pbf) {
  pbf.writeVarintField(3, 1);
  pbf.writePackedVarint(4, [9, 0, 0]);
}

function writePointLayer({ name, featureCount }, pbf) {
  pbf.writeStringField(1, name);
  for (let index = 0; index < featureCount; index += 1) {
    pbf.writeMessage(2, writePointFeature, null);
  }
  pbf.writeVarintField(5, 4_096);
  pbf.writeVarintField(15, 2);
}

function createPointMvt(featureCount) {
  const pbf = new PbfWriter();
  pbf.writeMessage(3, writePointLayer, { name: 'streets', featureCount });
  return pbf.finish();
}

function canvasFactory() {
  const context = {
    beginPath() {},
    clearRect() {},
    closePath() {},
    fill() {},
    lineTo() {},
    moveTo() {},
    stroke() {}
  };
  return {
    width: 0,
    height: 0,
    getContext: (type) => type === '2d' ? context : null
  };
}

test('validates only the official bounded Shortbread TileJSON contract', () => {
  const normalized = validateShortbreadTileJson(tileJson);
  assert.equal(normalized.maxzoom, 14);
  assert.deepEqual(normalized.vectorLayerIds, ['ocean', 'water_polygons', 'streets', 'buildings']);
  assert.doesNotThrow(() => validateShortbreadTileJson(tileJson, { requireWater: true }));
  assert.throws(() => validateShortbreadTileJson({ ...tileJson, maxzoom: 15 }), /maxzoom/);
  assert.throws(() => validateShortbreadTileJson({ ...tileJson, tiles: ['https://evil.example/{z}/{x}/{y}.mvt'] }), /official/);
  assert.throws(() => validateShortbreadTileJson({ ...tileJson, vector_layers: [{ id: 'streets' }] }), /buildings/);
  assert.throws(() => validateShortbreadTileJson({
    ...tileJson,
    vector_layers: [{ id: 'streets' }, { id: 'buildings' }]
  }, { requireWater: true }), /ocean and water_polygons/);
});

test('formats official tile URLs and rejects pyramid escape', () => {
  const url = formatShortbreadTileUrl(tileJson.tiles[0], { z: 12, x: 653, y: 1440 });
  assert.equal(url, 'https://vector.openstreetmap.org/shortbread_v1/12/653/1440.mvt');
  assert.throws(() => formatShortbreadTileUrl(tileJson.tiles[0], { z: 2, x: 4, y: 0 }), /outside/);
});

test('road classification and draw commands retain category colors', () => {
  assert.equal(classifyShortbreadRoad({ kind: 'motorway' }).category, 'motorway');
  assert.equal(classifyShortbreadRoad({ highway: 'secondary' }).color, '#24eaff');
  const commands = shortbreadDrawCommands({
    ocean: [{ geometry: { type: 'Polygon', coordinates: [] }, properties: {} }],
    waterPolygons: [
      { geometry: { type: 'Polygon', coordinates: [] }, properties: { kind: 'water' } },
      { geometry: { type: 'Polygon', coordinates: [] }, properties: { kind: 'glacier' } }
    ],
    buildings: [{ geometry: { type: 'Polygon', coordinates: [] }, properties: { id: 1 } }],
    streets: [{ geometry: { type: 'LineString', coordinates: [] }, properties: { kind: 'primary' } }]
  });
  assert.deepEqual(commands.map((command) => command.kind), ['water', 'water', 'building', 'road']);
  assert.equal(commands[0].category, 'ocean');
  assert.equal(commands[1].category, 'inland-water');
  assert.equal(commands[0].fill, 'rgba(0, 128, 255, 0.5)');
  assert.equal(commands[0].opacity, 0.5);
  assert.equal(commands[0].flatSurface, true);
  assert.equal(commands[0].nurbsOutline, true);
  assert.equal(commands[3].category, 'primary');
  assert.equal(SHORTBREAD_WATER_STYLE.schemaVersion, 'peercompute.geo.shortbread-water-style.v2');
  assert.equal(SHORTBREAD_WATER_STYLE.outline.color, '#24cfff');
  assert.equal(SHORTBREAD_WATER_STYLE.outline.curveModel, 'NURBS');
  assert.equal(SHORTBREAD_WATER_STYLE.outline.boundaryModel, 'exact-source-water-boundary-terrain-draped');
  assert.equal(SHORTBREAD_WATER_STYLE.outline.maximumSourceDeviationPixels, 0);
  assert.equal(SHORTBREAD_WATER_STYLE.outline.elevationModel, 'source-elevation-not-published');
  assert.equal(SHORTBREAD_WATER_STYLE.submergedContours.color, SHORTBREAD_WATER_STYLE.outline.color);
  assert.equal(SHORTBREAD_WATER_STYLE.submergedContours.waterLineElevationMeters, 0);
  assert.equal(SHORTBREAD_WATER_STYLE.submergedContours.verticalDatum, 'terrain-source-native');
  assert.equal(SHORTBREAD_WATER_STYLE.submergedContours.waterLineReference, 'terrain-source-native-zero');
  assert.deepEqual(SHORTBREAD_WATER_STYLE.sourceLayers, ['ocean', 'water_polygons']);
  assert.deepEqual(SHORTBREAD_WATER_STYLE.excludedKinds, ['glacier']);
});

test('decoder and legacy imagery share the exact 25,000-feature hard boundary', async () => {
  assert.equal(SHORTBREAD_MAXIMUM_FEATURES_PER_TILE, 25_000);
  const boundary = createPointMvt(SHORTBREAD_MAXIMUM_FEATURES_PER_TILE);
  const decoded = decodeShortbreadTile(boundary, { x: 4, y: 7, z: 5 });
  assert.equal(decoded.streets.length, SHORTBREAD_MAXIMUM_FEATURES_PER_TILE);

  const provider = new ShortbreadImageryProvider(Cesium, {
    tileJson,
    canvasFactory,
    fetchImpl: async () => new Response(boundary, {
      headers: { 'content-type': 'application/vnd.mapbox-vector-tile' }
    })
  });
  await provider.requestImage(4, 7, 5);
  assert.equal(provider.getTelemetry().roadCommands, SHORTBREAD_MAXIMUM_FEATURES_PER_TILE);
  provider.destroy();

  const aboveBoundary = createPointMvt(SHORTBREAD_MAXIMUM_FEATURES_PER_TILE + 1);
  assert.throws(
    () => decodeShortbreadTile(aboveBoundary, { x: 4, y: 7, z: 5 }),
    /feature cap/u
  );
  const rejectingProvider = new ShortbreadImageryProvider(Cesium, {
    tileJson,
    canvasFactory,
    fetchImpl: async () => new Response(aboveBoundary, {
      headers: { 'content-type': 'application/vnd.mapbox-vector-tile' }
    })
  });
  await assert.rejects(rejectingProvider.requestImage(4, 7, 5), /feature cap/u);
  assert.equal(rejectingProvider.getTelemetry().failed, 1);
  rejectingProvider.destroy();
});
