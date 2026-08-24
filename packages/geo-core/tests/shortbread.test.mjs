import assert from 'node:assert/strict';
import test from 'node:test';

import {
  classifyShortbreadRoad,
  formatShortbreadTileUrl,
  shortbreadDrawCommands,
  SHORTBREAD_WATER_STYLE,
  validateShortbreadTileJson
} from '../src/vector/shortbread.js';

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
  assert.equal(commands[3].category, 'primary');
  assert.deepEqual(SHORTBREAD_WATER_STYLE.sourceLayers, ['ocean', 'water_polygons']);
  assert.deepEqual(SHORTBREAD_WATER_STYLE.excludedKinds, ['glacier']);
});
