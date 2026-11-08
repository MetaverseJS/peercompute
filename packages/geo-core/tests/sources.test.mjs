import assert from 'node:assert/strict';
import test from 'node:test';

import { GEO_SOURCE_CATALOG, OSM_ATTRIBUTION_HTML, sourceDescriptor } from '../src/sources/catalog.js';
import { createSourceEnvelope } from '../src/sources/envelope.js';

test('catalog keeps the real terrain, OSM, and weather source/license boundaries', () => {
  const ids = new Set(GEO_SOURCE_CATALOG.map((entry) => entry.id));
  for (const id of [
    'noaa-etopo2022',
    'aws-terrarium',
    'osm-shortbread',
    'osm-local-region',
    'noaa-nowcoast-radar',
    'noaa-nowcoast-satellite'
  ]) assert.ok(ids.has(id));
  assert.match(OSM_ATTRIBUTION_HTML, /OpenStreetMap contributors/);
  assert.equal(sourceDescriptor('osm-shortbread').license, 'ODbL 1.0');
  assert.equal(sourceDescriptor('missing'), null);
});

test('source envelopes validate time and preserve explicit synthetic/operational flags', () => {
  const envelope = createSourceEnvelope({
    source: { id: 'fixture', name: 'Fixture' },
    status: 'fixture',
    fetchedAt: '2026-08-23T12:00:00Z',
    staleAt: '2026-08-23T12:01:00Z',
    synthetic: true,
    operationalUse: false,
    data: { count: 1 }
  });
  assert.equal(envelope.synthetic, true);
  assert.equal(envelope.operationalUse, false);
  assert.equal(envelope.data.count, 1);
  assert.throws(() => createSourceEnvelope({ source: {}, status: 'x', fetchedAt: 'bad' }), /source/);
});
