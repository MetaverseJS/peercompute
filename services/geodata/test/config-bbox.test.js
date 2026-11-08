import test from 'node:test';
import assert from 'node:assert/strict';
import { GEODATA_LIMITS, loadConfig, PUBLIC_OVERPASS_URL } from '../src/config.js';
import { parseAndSnapBbox, parseOsmRegionQuery } from '../src/osm/bbox.js';
import { createRegionCacheKey } from '../src/service.js';

test('configuration defaults to the fixed loopback listener with OSM disabled', () => {
  const config = loadConfig({ NODE_ENV: 'test' });
  assert.equal(config.host, '127.0.0.1');
  assert.equal(config.port, 8788);
  assert.equal(config.overpass.configured, false);
  assert.equal(config.overpass.url, null);
  assert.equal(config.overpass.mode, 'unconfigured');
  assert.deepEqual(config.corsOrigins, []);
});

test('public Overpass use requires an explicit non-production flag', () => {
  const disabled = loadConfig({ NODE_ENV: 'production' });
  assert.equal(disabled.overpass.configured, false);

  const enabled = loadConfig({
    NODE_ENV: 'test',
    GEODATA_ALLOW_PUBLIC_OVERPASS: 'true'
  });
  assert.equal(enabled.overpass.url, PUBLIC_OVERPASS_URL);
  assert.equal(enabled.overpass.mode, 'public-development-fallback');
  assert.equal(enabled.overpass.publicFallback, true);
  assert.throws(() => loadConfig({
    NODE_ENV: 'production',
    GEODATA_ALLOW_PUBLIC_OVERPASS: 'true'
  }), /production requires GEODATA_OVERPASS_URL/u);

  const explicitlyConfiguredPublicEndpoint = loadConfig({
    NODE_ENV: 'test',
    GEODATA_OVERPASS_URL: PUBLIC_OVERPASS_URL
  });
  assert.equal(explicitlyConfiguredPublicEndpoint.overpass.mode, 'public-development-fallback');
  assert.equal(explicitlyConfiguredPublicEndpoint.overpass.publicFallback, true);
  assert.throws(() => loadConfig({
    NODE_ENV: 'production',
    GEODATA_OVERPASS_URL: PUBLIC_OVERPASS_URL
  }), /controlled host/u);
  assert.throws(() => loadConfig({
    NODE_ENV: 'production',
    GEODATA_OVERPASS_URL: 'https://lz4.overpass-api.de/api/interpreter'
  }), /controlled host/u);
  assert.throws(() => loadConfig({
    NODE_ENV: 'production',
    GEODATA_OVERPASS_URL: 'https://overpass-api.de./api/interpreter'
  }), /controlled host/u);
});

test('a secret-free fixed configured endpoint wins over the public fallback', () => {
  const config = loadConfig({
    NODE_ENV: 'production',
    GEODATA_OVERPASS_URL: 'https://osm.internal.example/interpreter',
    GEODATA_ALLOW_PUBLIC_OVERPASS: 'true',
    GEODATA_CORS_ORIGINS: 'https://earth.example,https://bike.example',
    GEODATA_USER_AGENT: 'PeerCompute-Test/1.0 (+https://example.test/contact)'
  });
  assert.equal(config.overpass.mode, 'configured');
  assert.equal(config.overpass.publicFallback, false);
  assert.deepEqual(config.corsOrigins, ['https://bike.example', 'https://earth.example']);
});

test('configuration rejects wildcard CORS, URL credentials, queries, and unsafe headers', () => {
  assert.throws(() => loadConfig({ NODE_ENV: 'test', GEODATA_CORS_ORIGINS: '*' }), /wildcard/u);
  assert.throws(() => loadConfig({
    NODE_ENV: 'test',
    GEODATA_OVERPASS_URL: 'https://user:secret@example.test/api'
  }), /secret-free/u);
  assert.throws(() => loadConfig({
    NODE_ENV: 'test',
    GEODATA_OVERPASS_URL: 'https://example.test/api?token=secret'
  }), /secret-free/u);
  assert.throws(() => loadConfig({
    NODE_ENV: 'test',
    GEODATA_USER_AGENT: 'unsafe\r\nheader'
  }), /HTTP header/u);
});

test('bbox validation snaps outward and exposes request and GeoJSON orders', () => {
  const bbox = parseAndSnapBbox('61.2174,-149.9004,61.2181,-149.8992', GEODATA_LIMITS);
  assert.deepEqual(bbox.values, [61.217, -149.901, 61.219, -149.899]);
  assert.deepEqual(bbox.geoJsonValues, [-149.901, 61.217, -149.899, 61.219]);
  assert.equal(bbox.requestOrder, 'south,west,north,east');
  assert.ok(bbox.dimensions.northSouthMeters > 200);
});

test('bbox validation rejects dateline spans, invalid decimals, and oversized regions', () => {
  assert.throws(
    () => parseAndSnapBbox('10,170,11,-170', GEODATA_LIMITS),
    (error) => error.code === 'INVALID_BBOX_ORDER'
  );
  assert.throws(
    () => parseAndSnapBbox('0,0,1e-3,0.01', GEODATA_LIMITS),
    (error) => error.code === 'INVALID_BBOX'
  );
  assert.throws(
    () => parseAndSnapBbox('0,0,0.08,0.01', GEODATA_LIMITS),
    (error) => error.code === 'BBOX_TOO_LARGE' && error.statusCode === 422
  );
});

test('OSM query validation canonicalizes layers, defaults motorcycle, and rejects extras', () => {
  const parsed = parseOsmRegionQuery({
    bbox: '0,0,0.01,0.01',
    layers: 'buildings,roads'
  }, GEODATA_LIMITS);
  assert.deepEqual(parsed.layers, ['roads', 'buildings']);
  assert.equal(parsed.vehicle, 'motorcycle');

  assert.throws(() => parseOsmRegionQuery({
    bbox: '0,0,0.01,0.01',
    layers: 'roads,roads'
  }, GEODATA_LIMITS), (error) => error.code === 'INVALID_LAYERS');
  assert.throws(() => parseOsmRegionQuery({
    bbox: '0,0,0.01,0.01',
    layers: 'roads',
    arbitrary: 'upstream-url'
  }, GEODATA_LIMITS), (error) => error.code === 'INVALID_QUERY');
});

test('cache keys are fixed hashes of outward-snapped regions rather than raw coordinates', () => {
  const parsed = parseOsmRegionQuery({
    bbox: '61.2174,-149.9004,61.2181,-149.8992',
    layers: 'roads,buildings',
    vehicle: 'motorcycle'
  }, GEODATA_LIMITS);
  const key = createRegionCacheKey(parsed);
  assert.match(key, /^[a-f0-9]{64}$/u);
  assert.doesNotMatch(key, /61\.2174|-149\.9004/u);
});
