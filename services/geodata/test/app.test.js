import { gunzipSync } from 'node:zlib';
import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO_SOURCE_CATALOG, NOWCOAST_LAYERS } from '@peercompute/geo-core';
import { buildGeodataApp, JSON_CONTENT_TYPE } from '../src/app.js';
import { loadConfig } from '../src/config.js';
import { serializeBoundedOsmRegionEnvelope } from '../src/service.js';
import { createOverpassFixture, responseForJson } from './fixture.js';

const ALLOWED_ORIGIN = 'https://earth.example';
const VALID_URL = '/api/v1/geo/osm?bbox=-0.02,-0.02,0.04,0.04&layers=roads,buildings&vehicle=motorcycle';
const SHORTBREAD_TILEJSON_ROUTE = '/api/v1/cache/osm-shortbread/tilejson';
const SHORTBREAD_TILE_ROUTE = '/api/v1/cache/osm-shortbread/0/0/0.mvt';
const TERRARIUM_TILE_ROUTE = '/api/v1/cache/aws-terrarium/0/0/0.png';

const SHORTBREAD_TILEJSON = Object.freeze({
  tilejson: '3.0.0',
  name: 'OpenStreetMap Shortbread',
  minzoom: 0,
  maxzoom: 14,
  tiles: ['https://vector.openstreetmap.org/shortbread_v1/{z}/{x}/{y}.mvt'],
  vector_layers: [
    { id: 'ocean' },
    { id: 'water_polygons' },
    { id: 'streets' },
    { id: 'buildings' }
  ]
});

function validTerrariumPng() {
  const bytes = Buffer.alloc(33);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes, 0);
  bytes.writeUInt32BE(13, 8);
  bytes.write('IHDR', 12, 'ascii');
  bytes.writeUInt32BE(256, 16);
  bytes.writeUInt32BE(256, 20);
  bytes[24] = 8;
  bytes[25] = 2;
  return bytes;
}

function configuredServiceConfig(limitOverrides = {}) {
  return loadConfig({
    NODE_ENV: 'test',
    GEODATA_OVERPASS_URL: 'https://overpass.internal.example/interpreter',
    GEODATA_CORS_ORIGINS: ALLOWED_ORIGIN,
    GEODATA_USER_AGENT: 'PeerCompute-Test/1.0 (+https://example.test/contact)'
  }, { limits: limitOverrides });
}

async function createApp(t, options = {}) {
  const app = await buildGeodataApp({
    config: options.config ?? configuredServiceConfig(),
    clock: options.clock,
    fetchImpl: options.fetchImpl ?? (async () => responseForJson(createOverpassFixture())),
    processInfo: {
      nodeVersion: 'v24.test',
      platform: 'test-platform',
      architecture: 'test-architecture',
      uptime: () => 12.3456
    }
  });
  t.after(() => app.close());
  return app;
}

function assertSecurityHeaders(headers) {
  assert.equal(headers['x-content-type-options'], 'nosniff');
  assert.equal(headers['referrer-policy'], 'strict-origin-when-cross-origin');
  assert.equal(
    headers['permissions-policy'],
    'geolocation=(self), xr-spatial-tracking=(self), camera=(), microphone=()'
  );
  assert.equal(headers['cross-origin-resource-policy'], 'cross-origin');
  assert.equal(headers['x-frame-options'], 'DENY');
  assert.match(headers.vary, /(?:^|, )Origin(?:,|$)/u);
}

test('health exposes readiness and bounded counters without endpoint or coordinate leakage', async (t) => {
  const now = Date.parse('2026-08-23T22:00:00Z');
  const app = await createApp(t, { clock: () => now });
  const response = await app.inject({ method: 'GET', url: '/healthz' });
  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['content-type'], JSON_CONTENT_TYPE);
  assert.equal(response.headers['cache-control'], 'no-store');
  assertSecurityHeaders(response.headers);
  const body = response.json();
  assert.equal(body.schemaVersion, 'peercompute.geodata.health.v1');
  assert.equal(body.status, 'ready');
  assert.equal(body.synthetic, false);
  assert.equal(body.fetchedAt, '2026-08-23T22:00:00.000Z');
  assert.equal(body.data.service.nodeVersion, 'v24.test');
  assert.equal(body.data.readiness.osmRegion, true);
  assert.equal(body.data.cache.osmRegion.capacity, 128);
  assert.equal(body.data.cache.osmRegion.maxBytes, 128 * 1024 * 1024);
  assert.equal(body.data.cache.sourceArtifacts.capacity, 512);
  assert.equal(body.data.cache.sourceArtifacts.maxBytes, 128 * 1024 * 1024);
  assert.equal(body.data.readiness.shortbreadCache, true);
  assert.equal(body.data.readiness.terrariumCache, true);
  assert.doesNotMatch(response.body, /overpass\.internal|secret|-0\.02,0\.04/u);
});

test('unconfigured health is degraded and the OSM route fails with a secret-free public envelope', async (t) => {
  const app = await createApp(t, { config: loadConfig({ NODE_ENV: 'test' }) });
  const health = await app.inject({ url: '/healthz' });
  assert.equal(health.json().status, 'degraded');
  assert.equal(health.json().data.readiness.ready, false);

  const response = await app.inject({ url: VALID_URL });
  assert.equal(response.statusCode, 503);
  assert.equal(response.headers['content-type'], JSON_CONTENT_TYPE);
  assert.equal(response.headers['cache-control'], 'no-store');
  const body = response.json();
  assert.equal(body.schemaVersion, 'peercompute.geodata.error.v1');
  assert.equal(body.error.code, 'OVERPASS_NOT_CONFIGURED');
  assert.equal(body.error.retryable, false);
  assert.doesNotMatch(response.body, /stack|cause|GEODATA_USER_AGENT/u);
});

test('catalog returns fixed official descriptors and public five-minute caching', async (t) => {
  const app = await createApp(t, { clock: () => Date.parse('2026-08-23T22:00:00Z') });
  const response = await app.inject({ url: '/api/v1/catalog' });
  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['content-type'], JSON_CONTENT_TYPE);
  assert.equal(response.headers['cache-control'], 'public, max-age=300');
  assertSecurityHeaders(response.headers);
  const body = response.json();
  assert.equal(body.schemaVersion, 'peercompute.geodata.catalog.v1');
  assert.equal(body.synthetic, false);
  assert.equal(body.staleAt, '2026-08-23T22:05:00.000Z');
  const sources = new Map(body.data.sources.map((source) => [source.id, source]));
  assert.match(sources.get('noaa-etopo2022').url, /gis\.ngdc\.noaa\.gov/u);
  assert.equal(sources.get('osm-shortbread').url, SHORTBREAD_TILEJSON_ROUTE);
  assert.equal(
    sources.get('osm-shortbread').tileUrl,
    '/api/v1/cache/osm-shortbread/{z}/{x}/{y}.mvt'
  );
  assert.equal(sources.get('osm-shortbread').transportAuthority, 'peercompute-geodata-server');
  assert.equal(
    sources.get('aws-terrarium').url,
    '/api/v1/cache/aws-terrarium/{z}/{x}/{y}.png'
  );
  assert.equal(sources.get('aws-terrarium').transportAuthority, 'peercompute-geodata-server');
  assert.equal(sources.get('noaa-etopo2022').transportAuthority, 'browser');
  assert.equal(sources.get('osm-local-region').configured, true);
  assert.equal(sources.get('osm-local-region').attribution, '© OpenStreetMap contributors');
  assert.match(sources.get('osm-local-region').licenseUrl, /odbl/u);
  assert.match(sources.get('noaa-nowcoast-radar').url, /GetCapabilities/u);
  assert.match(sources.get('noaa-nowcoast-satellite').url, /GetCapabilities/u);
  assert.deepEqual([...sources.keys()], GEO_SOURCE_CATALOG.map((source) => source.id));
  assert.deepEqual(
    body.data.layers.map((layer) => layer.id),
    NOWCOAST_LAYERS.map((layer) => layer.id)
  );
  const catalogLayers = new Map(body.data.layers.map((layer) => [layer.id, layer]));
  for (const canonicalLayer of NOWCOAST_LAYERS) {
    const layer = catalogLayers.get(canonicalLayer.id);
    assert.equal(layer.sourceId, canonicalLayer.sourceId);
    assert.equal(layer.kind, canonicalLayer.kind);
    assert.equal(layer.layerName, canonicalLayer.layer);
    assert.equal(layer.cadenceMinutes, canonicalLayer.cadenceMinutes);
    assert.equal(layer.historyMinutes, canonicalLayer.historyMinutes);
    assert.match(layer.url, /REQUEST=GetCapabilities/iu);
  }
  assert.deepEqual(
    sources.get('noaa-nowcoast-radar').layerIds,
    NOWCOAST_LAYERS.filter((layer) => layer.sourceId === 'noaa-nowcoast-radar').map((layer) => layer.id)
  );
  assert.deepEqual(
    sources.get('noaa-nowcoast-satellite').layerIds,
    NOWCOAST_LAYERS.filter((layer) => layer.sourceId === 'noaa-nowcoast-satellite').map((layer) => layer.id)
  );
  assert.equal(catalogLayers.get('noaa-goes-infrared').sourceId, 'noaa-nowcoast-satellite');
  assert.equal(catalogLayers.get('noaa-goes-infrared').layerName, 'goes_longwave_imagery');
});

test('CORS reflects only configured exact origins and supports bounded GET preflight', async (t) => {
  const app = await createApp(t);
  const allowed = await app.inject({
    url: '/healthz',
    headers: { origin: ALLOWED_ORIGIN }
  });
  assert.equal(allowed.headers['access-control-allow-origin'], ALLOWED_ORIGIN);
  assert.match(allowed.headers.vary, /Origin/u);

  const denied = await app.inject({
    url: '/healthz',
    headers: { origin: 'https://attacker.example' }
  });
  assert.equal(denied.headers['access-control-allow-origin'], undefined);
  assert.match(denied.headers.vary, /Origin/u);

  const preflight = await app.inject({
    method: 'OPTIONS',
    url: '/api/v1/geo/osm',
    headers: {
      origin: ALLOWED_ORIGIN,
      'access-control-request-method': 'GET',
      'access-control-request-headers': 'if-none-match'
    }
  });
  assert.equal(preflight.statusCode, 204);
  assert.equal(preflight.headers['access-control-allow-origin'], ALLOWED_ORIGIN);
  assert.equal(preflight.headers['access-control-max-age'], '600');
  assert.match(preflight.headers['access-control-allow-methods'], /GET/u);
});

test('Shortbread TileJSON route coalesces fixed upstream bytes and preserves strong 304 validators', async (t) => {
  let calls = 0;
  let releaseFetch;
  const gate = new Promise((resolve) => { releaseFetch = resolve; });
  const serialized = JSON.stringify(SHORTBREAD_TILEJSON);
  const app = await createApp(t, {
    clock: () => Date.parse('2026-08-25T12:00:00Z'),
    fetchImpl: async (url, init) => {
      calls += 1;
      assert.equal(String(url), 'https://vector.openstreetmap.org/shortbread_v1/tilejson.json');
      assert.equal(init.method, 'GET');
      assert.equal(init.redirect, 'manual');
      assert.equal(init.headers['user-agent'], 'PeerCompute-Test/1.0 (+https://example.test/contact)');
      await gate;
      return new Response(serialized, { headers: { 'content-type': 'application/json' } });
    }
  });

  const firstPromise = app.inject({ url: SHORTBREAD_TILEJSON_ROUTE });
  const secondPromise = app.inject({ url: SHORTBREAD_TILEJSON_ROUTE });
  await new Promise((resolve) => setImmediate(resolve));
  releaseFetch();
  const [first, second] = await Promise.all([firstPromise, secondPromise]);
  assert.equal(calls, 1);
  assert.deepEqual(
    new Set([first.headers['x-geodata-cache'], second.headers['x-geodata-cache']]),
    new Set(['miss', 'coalesced'])
  );
  assert.equal(first.body, serialized);
  assert.equal(second.body, serialized);
  assert.equal(first.headers['x-geodata-source'], 'osm-shortbread-tilejson');
  assert.equal(first.headers.age, '0');
  assert.equal(first.headers['cache-control'], 'public, max-age=300, stale-while-revalidate=3600, stale-if-error=86400');
  assert.match(first.headers.etag, /^"sha256-[A-Za-z0-9_-]+"$/u);

  const hit = await app.inject({ url: SHORTBREAD_TILEJSON_ROUTE });
  assert.equal(hit.headers['x-geodata-cache'], 'hit');
  const notModified = await app.inject({
    url: SHORTBREAD_TILEJSON_ROUTE,
    headers: { 'if-none-match': first.headers.etag }
  });
  assert.equal(notModified.statusCode, 304);
  assert.equal(notModified.body, '');
  assert.equal(notModified.headers.etag, first.headers.etag);
  assert.equal(notModified.headers['x-geodata-cache'], 'hit');
  assert.equal(calls, 1);
  const health = (await app.inject({ url: '/healthz' })).json();
  assert.equal(health.data.cache.sourceArtifacts.entries, 1);
  assert.equal(health.data.cache.sourceArtifacts.bytes, Buffer.byteLength(serialized));
  assert.equal(health.data.cache.sourceArtifacts.misses, 1);
  assert.equal(health.data.cache.sourceArtifacts.coalesced, 1);
  assert.equal(health.data.cache.sourceArtifacts.hits, 2);
  assert.equal(health.data.upstream.sourceArtifacts.active, 0);
});

test('fixed MVT and Terrarium routes preserve validated bytes and reject coordinates or query injection', async (t) => {
  const mvt = Buffer.alloc(0);
  const png = validTerrariumPng();
  const requested = [];
  const app = await createApp(t, {
    fetchImpl: async (url) => {
      requested.push(String(url));
      if (String(url).endsWith('.mvt')) {
        return new Response(mvt, {
          headers: { 'content-type': 'application/vnd.mapbox-vector-tile' }
        });
      }
      if (String(url).endsWith('.png')) {
        return new Response(png, { headers: { 'content-type': 'image/png' } });
      }
      throw new Error('unexpected fixed source URL');
    }
  });

  const vector = await app.inject({
    url: SHORTBREAD_TILE_ROUTE,
    headers: { 'accept-encoding': 'gzip' }
  });
  assert.equal(vector.statusCode, 200);
  assert.deepEqual(vector.rawPayload, mvt);
  assert.equal(vector.headers['content-encoding'], undefined);
  assert.equal(vector.headers['content-type'], 'application/vnd.mapbox-vector-tile');
  assert.equal(vector.headers['x-geodata-source'], 'osm-shortbread-mvt');
  const terrain = await app.inject({
    url: TERRARIUM_TILE_ROUTE,
    headers: { 'accept-encoding': 'gzip' }
  });
  assert.equal(terrain.statusCode, 200);
  assert.deepEqual(terrain.rawPayload, png);
  assert.equal(terrain.headers['content-encoding'], undefined);
  assert.equal(terrain.headers['content-type'], 'image/png');
  assert.equal(terrain.headers['x-geodata-source'], 'aws-terrarium-png');
  assert.equal(
    terrain.headers['cache-control'],
    'public, max-age=604800, stale-while-revalidate=86400, stale-if-error=2592000'
  );
  assert.deepEqual(requested, [
    'https://vector.openstreetmap.org/shortbread_v1/0/0/0.mvt',
    'https://elevation-tiles-prod.s3.amazonaws.com/terrarium/0/0/0.png'
  ]);

  for (const url of [
    '/api/v1/cache/osm-shortbread/15/0/0.mvt',
    '/api/v1/cache/aws-terrarium/0/0/1.png',
    `${TERRARIUM_TILE_ROUTE}?url=https://evil.example/tile.png`
  ]) {
    const rejected = await app.inject({ url });
    assert.equal(rejected.statusCode, 400);
    assert.match(rejected.json().error.code, /INVALID_(?:TILE_COORDINATE|QUERY)/u);
  }
  assert.equal(requested.length, 2);
});

test('source artifacts serve verified stale bytes after refresh failure and expire at the hard stale bound', async (t) => {
  let now = 1_000;
  let shouldFail = false;
  let calls = 0;
  const serialized = JSON.stringify(SHORTBREAD_TILEJSON);
  const app = await createApp(t, {
    config: configuredServiceConfig({ shortbreadFreshTtlMs: 100, shortbreadStaleIfErrorMs: 500 }),
    clock: () => now,
    fetchImpl: async () => {
      calls += 1;
      if (shouldFail) throw new Error('private source socket detail');
      return new Response(serialized, { headers: { 'content-type': 'application/json' } });
    }
  });
  const first = await app.inject({ url: SHORTBREAD_TILEJSON_ROUTE });
  assert.equal(first.statusCode, 200);
  shouldFail = true;
  now = 1_101;
  const stale = await app.inject({ url: SHORTBREAD_TILEJSON_ROUTE });
  assert.equal(stale.statusCode, 200);
  assert.equal(stale.body, first.body);
  assert.equal(stale.headers['x-geodata-cache'], 'stale');
  assert.equal(stale.headers.warning, '110 - "Response is stale"');
  assert.equal(stale.headers['cache-control'], 'public, max-age=0, must-revalidate, stale-if-error=0');
  assert.doesNotMatch(stale.body, /private source socket detail/u);

  now = 1_601;
  const expired = await app.inject({ url: SHORTBREAD_TILEJSON_ROUTE });
  assert.equal(expired.statusCode, 502);
  assert.equal(expired.json().error.code, 'UPSTREAM_FETCH_FAILED');
  assert.equal(calls, 3);
});

test('OSM route uses the fixed provider, coalesces requests, and returns deterministic attributed data', async (t) => {
  let calls = 0;
  let releaseFetch;
  const gate = new Promise((resolve) => { releaseFetch = resolve; });
  const app = await createApp(t, {
    clock: () => Date.parse('2026-08-23T22:00:00Z'),
    fetchImpl: async (url, init) => {
      calls += 1;
      assert.equal(url, 'https://overpass.internal.example/interpreter');
      assert.equal(init.redirect, 'manual');
      assert.equal(init.headers['user-agent'], 'PeerCompute-Test/1.0 (+https://example.test/contact)');
      assert.match(init.body, /^data=/u);
      assert.match(decodeURIComponent(init.body), /\[timeout:20\]/u);
      await gate;
      return responseForJson(createOverpassFixture());
    }
  });

  const firstPromise = app.inject({ url: VALID_URL });
  const secondPromise = app.inject({ url: VALID_URL });
  await new Promise((resolve) => setImmediate(resolve));
  releaseFetch();
  const [first, second] = await Promise.all([firstPromise, secondPromise]);
  assert.equal(calls, 1);
  assert.equal(first.statusCode, 200);
  assert.equal(second.statusCode, 200);
  assert.deepEqual(new Set([
    first.headers['x-geodata-cache'], second.headers['x-geodata-cache']
  ]), new Set(['MISS', 'COALESCED']));
  assert.equal(first.body, second.body);
  assert.equal(
    first.headers['cache-control'],
    'public, max-age=3600, stale-while-revalidate=86400'
  );
  assert.match(first.headers.etag, /^"sha256-[A-Za-z0-9_-]+"$/u);
  const body = first.json();
  assert.equal(body.schemaVersion, 'peercompute.geo.osm-region.v1');
  assert.equal(body.status, 'current');
  assert.equal(body.synthetic, false);
  assert.equal(body.provenance.attribution, '© OpenStreetMap contributors');
  assert.match(body.provenance.licenseUrl, /odbl/u);
  assert.match(body.provenance.derivedDatabaseNotice, /derived database/u);
  assert.equal(body.data.counts.roadWays, 4);
  assert.equal(body.data.counts.buildings, 4);
  assert.match(body.cache.key, /^[a-f0-9]{64}$/u);
});

test('OSM cache coalesces concurrent callers across one provider retry', async (t) => {
  let calls = 0;
  let releaseRetry;
  const retryGate = new Promise((resolve) => { releaseRetry = resolve; });
  const app = await createApp(t, {
    config: configuredServiceConfig({ overpassRetryBackoffMs: 0 }),
    fetchImpl: async () => {
      calls += 1;
      if (calls === 1) {
        return new Response('{}', {
          status: 503,
          headers: { 'content-type': 'application/json' }
        });
      }
      await retryGate;
      return responseForJson(createOverpassFixture());
    }
  });
  const firstPromise = app.inject({ url: VALID_URL });
  const secondPromise = app.inject({ url: VALID_URL });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls, 2);
  releaseRetry();
  const [first, second] = await Promise.all([firstPromise, secondPromise]);
  assert.equal(first.statusCode, 200);
  assert.equal(second.statusCode, 200);
  assert.deepEqual(
    new Set([first.headers['x-geodata-cache'], second.headers['x-geodata-cache']]),
    new Set(['MISS', 'COALESCED'])
  );
  assert.equal(calls, 2, 'one shared cache loader owns both bounded provider attempts');
});

test('OSM response has a strong ETag, stable cached bytes, and proper 304 behavior', async (t) => {
  let calls = 0;
  const app = await createApp(t, {
    clock: () => Date.parse('2026-08-23T22:00:00Z'),
    fetchImpl: async () => {
      calls += 1;
      return responseForJson(createOverpassFixture());
    }
  });
  const first = await app.inject({ url: VALID_URL });
  const second = await app.inject({ url: VALID_URL });
  assert.equal(calls, 1);
  assert.equal(second.headers['x-geodata-cache'], 'HIT');
  assert.equal(second.body, first.body);
  assert.equal(second.headers.etag, first.headers.etag);

  const notModified = await app.inject({
    url: VALID_URL,
    headers: { 'if-none-match': first.headers.etag }
  });
  assert.equal(notModified.statusCode, 304);
  assert.equal(notModified.body, '');
  assert.equal(notModified.headers.etag, first.headers.etag);
  assert.equal(calls, 1);
});

test('large OSM responses compress without changing JSON or strong attribution', async (t) => {
  const app = await createApp(t);
  const response = await app.inject({
    url: VALID_URL,
    headers: { 'accept-encoding': 'gzip' }
  });
  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['content-encoding'], 'gzip');
  assert.match(response.headers.vary, /accept-encoding/iu);
  const body = JSON.parse(gunzipSync(response.rawPayload).toString('utf8'));
  assert.equal(body.provenance.attribution, '© OpenStreetMap contributors');
  assert.equal(body.data.roadGraph.edges.length, 9);
});

test('normalized responses fail closed before serialization exceeds the public cap', async (t) => {
  let calls = 0;
  const app = await createApp(t, {
    config: configuredServiceConfig({ normalizedResponseMaxBytes: 1_024 }),
    fetchImpl: async () => {
      calls += 1;
      return responseForJson(createOverpassFixture());
    }
  });
  const first = await app.inject({ url: VALID_URL });
  const second = await app.inject({ url: VALID_URL });
  for (const response of [first, second]) {
    assert.equal(response.statusCode, 422);
    assert.equal(response.headers['cache-control'], 'no-store');
    assert.equal(response.json().error.code, 'REGION_RESPONSE_LIMIT_EXCEEDED');
    assert.equal(response.json().data, null);
    assert.match(response.json().error.message, /smaller region/u);
    assert.doesNotMatch(response.body, /FeatureCollection|Neon Avenue/u);
  }
  assert.equal(calls, 2, 'an oversized normalized result must never enter the verified cache');
});

test('normalized serializer uses exact UTF-8 bytes and never truncates at its boundary', () => {
  const envelope = { schemaVersion: 'test', data: 'radar ☃ satellite' };
  const expected = JSON.stringify(envelope);
  const exactBytes = Buffer.byteLength(expected, 'utf8');
  assert.deepEqual(serializeBoundedOsmRegionEnvelope(envelope, exactBytes), {
    serialized: expected,
    byteLength: exactBytes
  });
  assert.throws(
    () => serializeBoundedOsmRegionEnvelope(envelope, exactBytes - 1),
    (error) => error.code === 'REGION_RESPONSE_LIMIT_EXCEEDED'
      && error.statusCode === 422
      && /smaller region/u.test(error.message)
  );
});

test('verified cache entries become visibly stale on refresh failure and expire after seven days', async (t) => {
  let now = 1_000;
  let shouldFail = false;
  const app = await createApp(t, {
    config: configuredServiceConfig({ cacheFreshTtlMs: 100, cacheStaleIfErrorMs: 500 }),
    clock: () => now,
    fetchImpl: async () => {
      if (shouldFail) throw new Error('private upstream socket detail');
      return responseForJson(createOverpassFixture());
    }
  });
  const fresh = await app.inject({ url: VALID_URL });
  assert.equal(fresh.statusCode, 200);
  shouldFail = true;
  now = 1_101;
  const stale = await app.inject({ url: VALID_URL });
  assert.equal(stale.statusCode, 200);
  assert.equal(stale.headers['x-geodata-cache'], 'STALE');
  assert.equal(stale.json().status, 'stale');
  assert.equal(stale.json().cache.state, 'stale-on-error');
  assert.match(stale.body, /previously verified cached region/u);
  assert.doesNotMatch(stale.body, /private upstream socket detail/u);

  now = 1_601;
  const expired = await app.inject({ url: VALID_URL });
  assert.equal(expired.statusCode, 502);
  assert.equal(expired.json().error.code, 'UPSTREAM_FETCH_FAILED');
  assert.doesNotMatch(expired.body, /private upstream socket detail/u);
});

test('query errors and unknown routes stay bounded and never invoke the provider', async (t) => {
  let calls = 0;
  const app = await createApp(t, {
    fetchImpl: async () => {
      calls += 1;
      return responseForJson(createOverpassFixture());
    }
  });
  const oversized = await app.inject({
    url: '/api/v1/geo/osm?bbox=0,0,0.08,0.01&layers=roads&vehicle=motorcycle'
  });
  assert.equal(oversized.statusCode, 422);
  assert.equal(oversized.json().error.code, 'BBOX_TOO_LARGE');
  const extra = await app.inject({
    url: '/api/v1/geo/osm?bbox=0,0,0.01,0.01&layers=roads&vehicle=motorcycle&url=https://evil.example'
  });
  assert.equal(extra.statusCode, 400);
  assert.equal(extra.json().error.code, 'INVALID_QUERY');
  const missing = await app.inject({ url: '/api/v1/not-real' });
  assert.equal(missing.statusCode, 404);
  assert.equal(missing.json().error.code, 'ROUTE_NOT_FOUND');
  assert.equal(calls, 0);
});

test('OSM route rate limit returns the standard public error envelope', async (t) => {
  const app = await createApp(t, {
    config: configuredServiceConfig({ osmRateLimitMax: 2 })
  });
  assert.equal((await app.inject({ url: VALID_URL })).statusCode, 200);
  assert.equal((await app.inject({ url: VALID_URL })).statusCode, 200);
  const limited = await app.inject({ url: VALID_URL });
  assert.equal(limited.statusCode, 429);
  assert.equal(limited.headers['content-type'], JSON_CONTENT_TYPE);
  assert.equal(limited.json().schemaVersion, 'peercompute.geodata.error.v1');
  assert.equal(limited.json().error.code, 'RATE_LIMITED');
  assert.equal(limited.json().error.retryable, true);
  assert.ok(Number(limited.headers['x-ratelimit-limit']) >= 2);
});

test('fixed source routes admit two 143-request cold-load bursts and rate-limit only after the declared cap', async (t) => {
  const config = configuredServiceConfig();
  assert.equal(config.limits.sourceRateLimitMax, 360);
  assert.equal(config.limits.osmRateLimitMax, 30);
  assert.equal(config.limits.metadataRateLimitMax, 120);
  let calls = 0;
  const app = await createApp(t, {
    config,
    fetchImpl: async () => {
      calls += 1;
      return new Response(JSON.stringify(SHORTBREAD_TILEJSON), {
        headers: { 'content-type': 'application/json' }
      });
    }
  });

  for (let burst = 0; burst < 2; burst += 1) {
    const responses = await Promise.all(Array.from(
      { length: 143 },
      () => app.inject({ url: SHORTBREAD_TILEJSON_ROUTE })
    ));
    assert.ok(responses.every((response) => response.statusCode === 200));
  }

  const remainingBudget = config.limits.sourceRateLimitMax - 2 * 143;
  const remainingResponses = await Promise.all(Array.from(
    { length: remainingBudget },
    () => app.inject({ url: SHORTBREAD_TILEJSON_ROUTE })
  ));
  assert.ok(remainingResponses.every((response) => response.statusCode === 200));

  const limited = await app.inject({ url: SHORTBREAD_TILEJSON_ROUTE });
  assert.equal(limited.statusCode, 429);
  assert.equal(limited.headers['content-type'], JSON_CONTENT_TYPE);
  assert.equal(Number(limited.headers['x-ratelimit-limit']), config.limits.sourceRateLimitMax);
  assert.equal(limited.json().schemaVersion, 'peercompute.geodata.error.v1');
  assert.equal(limited.json().error.code, 'RATE_LIMITED');
  assert.equal(limited.json().error.retryable, true);
  assert.equal(calls, 1, 'cached fixed-source hits must not refetch upstream bytes');
});
