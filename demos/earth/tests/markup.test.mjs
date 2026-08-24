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
});
