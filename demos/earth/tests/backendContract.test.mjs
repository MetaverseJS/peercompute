import assert from 'node:assert/strict';
import test from 'node:test';

import { buildGeodataApp } from '../../../services/geodata/src/app.js';
import { loadConfig } from '../../../services/geodata/src/config.js';
import { createOverpassFixture, responseForJson } from '../../../services/geodata/test/fixture.js';

import { GeodataClient } from '../src/api.js';

test('consumes the actual backend health, catalog, region, and error envelopes', async (t) => {
  const app = await buildGeodataApp({
    config: loadConfig({
      NODE_ENV: 'test',
      GEODATA_OVERPASS_URL: 'https://overpass.internal.example/interpreter',
      GEODATA_CORS_ORIGINS: 'https://earth.example',
      GEODATA_USER_AGENT: 'PeerCompute-Earth-Test/1.0 (+https://example.test/contact)'
    }),
    clock: () => Date.parse('2026-08-23T22:00:00Z'),
    fetchImpl: async () => responseForJson(createOverpassFixture()),
    processInfo: {
      nodeVersion: 'v24.test',
      platform: 'test-platform',
      architecture: 'test-architecture',
      uptime: () => 1
    }
  });
  t.after(() => app.close());

  const client = new GeodataClient({
    baseUrl: '',
    locationLike: new URL('https://earth.example/demo/'),
    fetchImpl: async (input, init) => {
      const url = new URL(input);
      const injected = await app.inject({
        method: init.method,
        url: `${url.pathname}${url.search}`,
        headers: { accept: init.headers.accept, origin: 'https://earth.example' }
      });
      return new Response(injected.body, {
        status: injected.statusCode,
        headers: injected.headers
      });
    }
  });

  const health = await client.health();
  assert.equal(health.schemaVersion, 'peercompute.geodata.health.v1');
  assert.equal(health.data.readiness.osmRegion, true);

  const catalog = await client.catalog();
  assert.equal(catalog.schemaVersion, 'peercompute.geodata.catalog.v1');
  assert.equal(catalog.data.sources.find((source) => source.id === 'osm-local-region').configured, true);

  const region = await client.osmRegion({
    bbox: [-0.02, -0.02, 0.04, 0.04]
  });
  assert.equal(region.schemaVersion, 'peercompute.geo.osm-region.v1');
  assert.equal(region.data.counts.roadWays, 4);
  assert.equal(region.data.counts.buildings, 4);
  assert.equal(region.data.counts.directedGraphEdges, 9);
  assert.equal(region.provenance.attribution, '© OpenStreetMap contributors');

  await assert.rejects(() => client.osmRegion({
    bbox: [0, 0, 0.08, 0.01]
  }), (error) => (
    error.code === 'BBOX_TOO_LARGE'
      && error.status === 422
      && error.retryable === false
      && error.notes.some((note) => /narrow/u.test(note))
  ));
});
