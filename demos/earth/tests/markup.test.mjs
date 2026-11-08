import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('keeps visible OSM attribution, ODbL license, derived-data, and freshness surfaces', () => {
  assert.match(html, /id="osm-attribution"/u);
  assert.match(html, /OpenStreetMap contributors/u);
  assert.match(html, /opendatacommons\.org\/licenses\/odbl\/1-0\//u);
  assert.match(html, /DERIVED DATABASE/u);
  assert.match(html, /id="local-provenance"/u);
  assert.match(html, /FRESHNESS NOT AVAILABLE/u);
  assert.match(html, /Not navigation, routing, warning, or live-traffic data/u);
  assert.match(html, /id="water-status"/u);
  assert.match(html, /OSM ACTUAL GEOMETRY \/\/ WATER \+ ROADS \+ BUILDINGS/u);
  assert.match(html, /WATER \/\/ 50% BUFFER POLYGON/u);
  assert.match(html, /LAND SIDE \/\/ GREEN COMPANION/u);
  assert.match(html, /TERRAIN \/\/ NURBS CONTOURS/u);
  assert.match(html, /ocean and non-glacier inland-water flat Cesium buffer polygons/u);
  assert.match(html, /buffer polygons at 50% opacity/u);
  assert.match(html, /exact blue degree-one NURBS source-boundary lines/u);
  assert.match(html, /separate display-derived green degree-one NURBS land-side companion lines/u);
  assert.match(html, /green companion is actual geometry, not glow or a second source boundary/u);
  assert.match(html, /Road crossings are raised above the matched water level/u);
  assert.match(html, /bounded median of available terrain samples/u);
  assert.match(html, /no painted GIS canvas, texture glow, blur, bloom, or halo pass/u);
  assert.match(html, /source-native elevations at or below zero use shoreline blue/u);
  assert.match(html, /id="cache-status"/u);
  assert.match(html, /LOCAL DEVICE SOURCE CACHE/u);
  assert.match(html, /local-only PeerCompute StateManager artifact tier/u);
  assert.match(html, /never enter the replicated Yjs document/u);
});
