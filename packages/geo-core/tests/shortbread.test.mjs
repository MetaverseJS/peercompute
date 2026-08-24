import assert from 'node:assert/strict';
import test from 'node:test';

import {
  classifyShortbreadRoad,
  formatShortbreadTileUrl,
  shortbreadDrawCommands,
  validateShortbreadTileJson
} from '../src/vector/shortbread.js';

const tileJson = {
  tilejson: '3.0.0',
  name: 'Shortbread',
  minzoom: 0,
  maxzoom: 14,
  tiles: ['https://vector.openstreetmap.org/shortbread_v1/{z}/{x}/{y}.mvt'],
  vector_layers: [{ id: 'streets' }, { id: 'buildings' }],
  attribution: '© OpenStreetMap contributors'
};

test('validates only the official bounded Shortbread TileJSON contract', () => {
  const normalized = validateShortbreadTileJson(tileJson);
  assert.equal(normalized.maxzoom, 14);
  assert.deepEqual(normalized.vectorLayerIds, ['streets', 'buildings']);
  assert.throws(() => validateShortbreadTileJson({ ...tileJson, maxzoom: 15 }), /maxzoom/);
  assert.throws(() => validateShortbreadTileJson({ ...tileJson, tiles: ['https://evil.example/{z}/{x}/{y}.mvt'] }), /official/);
  assert.throws(() => validateShortbreadTileJson({ ...tileJson, vector_layers: [{ id: 'streets' }] }), /buildings/);
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
    buildings: [{ geometry: { type: 'Polygon', coordinates: [] }, properties: { id: 1 } }],
    streets: [{ geometry: { type: 'LineString', coordinates: [] }, properties: { kind: 'primary' } }]
  });
  assert.equal(commands[0].kind, 'building');
  assert.equal(commands[1].category, 'primary');
});
