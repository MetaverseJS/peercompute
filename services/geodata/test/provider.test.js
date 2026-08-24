import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';
import { createOverpassProvider } from '../src/providers/overpass.js';
import { OVERPASS_OUTPUT_LIMIT } from '../src/osm/query.js';
import { responseForJson } from './fixture.js';

function providerConfig(limitOverrides = {}) {
  return loadConfig({
    NODE_ENV: 'test',
    GEODATA_OVERPASS_URL: 'https://controlled-overpass.example/interpreter',
    GEODATA_USER_AGENT: 'PeerCompute-Provider-Test/1.0 (+https://example.test/contact)'
  }, { limits: limitOverrides });
}

const request = Object.freeze({
  bbox: Object.freeze({ south: 1, west: 2, north: 3, east: 4 }),
  layers: Object.freeze(['roads', 'buildings'])
});

test('provider sends only the fixed POST endpoint, bounded query, and identifying headers', async () => {
  let captured;
  const provider = createOverpassProvider({
    config: providerConfig(),
    fetchImpl: async (url, init) => {
      captured = { url, init };
      return responseForJson({ elements: [], osm3s: { timestamp_osm_base: '2026-08-23T00:00:00Z' } });
    }
  });
  const payload = await provider.fetchRegion(request);
  assert.deepEqual(payload.elements, []);
  assert.equal(captured.url, 'https://controlled-overpass.example/interpreter');
  assert.equal(captured.init.method, 'POST');
  assert.equal(captured.init.redirect, 'manual');
  assert.equal(captured.init.headers.accept, 'application/json');
  assert.equal(captured.init.headers['user-agent'], 'PeerCompute-Provider-Test/1.0 (+https://example.test/contact)');
  const query = new URLSearchParams(captured.init.body).get('data');
  assert.match(query, /\[timeout:20\]/u);
  assert.match(query, /\(1\.000000,2\.000000,3\.000000,4\.000000\)/u);
});

test('provider runs no more than two upstream calls concurrently', async () => {
  let active = 0;
  let maximumActive = 0;
  const releases = [];
  const provider = createOverpassProvider({
    config: providerConfig(),
    fetchImpl: async () => {
      active += 1;
      maximumActive = Math.max(maximumActive, active);
      await new Promise((resolve) => releases.push(resolve));
      active -= 1;
      return responseForJson({ elements: [] });
    }
  });
  const calls = [provider.fetchRegion(request), provider.fetchRegion(request), provider.fetchRegion(request)];
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(active, 2);
  assert.equal(provider.stats.active, 2);
  assert.equal(provider.stats.queued, 1);
  releases.shift()();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(active, 2);
  while (releases.length) releases.shift()();
  await Promise.all(calls);
  assert.equal(maximumActive, 2);
  assert.equal(provider.stats.active, 0);
});

test('provider fails closed when the Overpass output cap indicates truncation', async () => {
  const provider = createOverpassProvider({
    config: providerConfig(),
    fetchImpl: async () => responseForJson({ elements: Array.from(
      { length: OVERPASS_OUTPUT_LIMIT },
      (_, id) => ({ type: 'node', id })
    ) })
  });
  await assert.rejects(
    provider.fetchRegion(request),
    (error) => error.code === 'UPSTREAM_RESULT_LIMIT_EXCEEDED' && error.statusCode === 422
  );
});

test('unconfigured provider never invokes fetch', async () => {
  let calls = 0;
  const provider = createOverpassProvider({
    config: loadConfig({ NODE_ENV: 'test' }),
    fetchImpl: async () => {
      calls += 1;
      return responseForJson({ elements: [] });
    }
  });
  await assert.rejects(
    provider.fetchRegion(request),
    (error) => error.code === 'OVERPASS_NOT_CONFIGURED' && error.statusCode === 503
  );
  assert.equal(calls, 0);
});
