import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchBoundedJson } from '../src/lib/fetch-json.js';
import { buildOverpassQuery, encodeOverpassQuery, OVERPASS_OUTPUT_LIMIT } from '../src/osm/query.js';

const defaultFetchOptions = Object.freeze({
  url: 'https://overpass.test/interpreter',
  timeoutMs: 1_000,
  maxRequestBytes: 1_024,
  maxResponseBytes: 64,
  body: 'data=query'
});

test('bounded JSON fetch requires manual redirects and accepts only declared JSON content', async () => {
  let captured;
  const value = await fetchBoundedJson({
    ...defaultFetchOptions,
    fetchImpl: async (url, init) => {
      captured = { url, init };
      return new Response('{"ok":true}', {
        headers: { 'content-type': 'application/json; charset=utf-8' }
      });
    }
  });
  assert.deepEqual(value, { ok: true });
  assert.equal(captured.url, defaultFetchOptions.url);
  assert.equal(captured.init.redirect, 'manual');
  assert.ok(captured.init.signal instanceof AbortSignal);

  await assert.rejects(fetchBoundedJson({
    ...defaultFetchOptions,
    fetchImpl: async () => new Response('<html></html>', {
      headers: { 'content-type': 'text/html' }
    })
  }), (error) => error.code === 'UPSTREAM_CONTENT_TYPE_REJECTED');
});

test('bounded JSON fetch rejects redirects without following them', async () => {
  await assert.rejects(fetchBoundedJson({
    ...defaultFetchOptions,
    fetchImpl: async () => new Response(null, {
      status: 302,
      headers: { location: 'https://untrusted.example/pivot' }
    })
  }), (error) => error.code === 'UPSTREAM_REDIRECT_FORBIDDEN');
});

test('bounded JSON fetch enforces request, declared response, and streamed response sizes', async () => {
  await assert.rejects(fetchBoundedJson({
    ...defaultFetchOptions,
    maxRequestBytes: 4,
    fetchImpl: async () => new Response('{}', { headers: { 'content-type': 'application/json' } })
  }), (error) => error.code === 'UPSTREAM_REQUEST_TOO_LARGE');

  await assert.rejects(fetchBoundedJson({
    ...defaultFetchOptions,
    fetchImpl: async () => new Response('{}', {
      headers: { 'content-type': 'application/json', 'content-length': '65' }
    })
  }), (error) => error.code === 'UPSTREAM_BODY_TOO_LARGE');

  await assert.rejects(fetchBoundedJson({
    ...defaultFetchOptions,
    maxResponseBytes: 8,
    fetchImpl: async () => new Response(new Uint8Array(9), {
      headers: { 'content-type': 'application/json' }
    })
  }), (error) => error.code === 'UPSTREAM_BODY_TOO_LARGE');
});

test('bounded JSON fetch maps invalid JSON, HTTP failures, and timeouts to public error codes', async () => {
  await assert.rejects(fetchBoundedJson({
    ...defaultFetchOptions,
    fetchImpl: async () => new Response('{bad', { headers: { 'content-type': 'application/json' } })
  }), (error) => error.code === 'UPSTREAM_INVALID_JSON');

  await assert.rejects(fetchBoundedJson({
    ...defaultFetchOptions,
    fetchImpl: async () => new Response('{}', {
      status: 429,
      headers: { 'content-type': 'application/json' }
    })
  }), (error) => error.code === 'UPSTREAM_HTTP_ERROR' && error.statusCode === 503);

  await assert.rejects(fetchBoundedJson({
    ...defaultFetchOptions,
    timeoutMs: 5,
    fetchImpl: async (_url, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () => reject(init.signal.reason), { once: true });
    })
  }), (error) => error.code === 'UPSTREAM_TIMEOUT' && error.statusCode === 504);
});

test('Overpass query is fixed, bounded, layer-selective, and uses snapped s,w,n,e order', () => {
  const bbox = { south: 1, west: 2, north: 3, east: 4 };
  const query = buildOverpassQuery({ bbox, layers: ['roads', 'buildings'], timeoutSeconds: 20 });
  assert.match(query, /^\[out:json\]\[timeout:20\];/u);
  assert.match(query, /way\["highway"\]\(1\.000000,2\.000000,3\.000000,4\.000000\);/u);
  assert.match(query, /relation\["type"="restriction"\]\(1\.000000,2\.000000,3\.000000,4\.000000\);/u);
  assert.match(query, /relation\["building"\]/u);
  assert.match(query, /\(\.selected; way\(r\.selected\);\);/u);
  assert.match(query, new RegExp(`out meta geom qt ${OVERPASS_OUTPUT_LIMIT};`, 'u'));
  assert.match(encodeOverpassQuery(query), /^data=/u);

  const roadsOnly = buildOverpassQuery({ bbox, layers: ['roads'], timeoutSeconds: 20 });
  assert.doesNotMatch(roadsOnly, /building/u);
  assert.match(roadsOnly, /relation\["type"="restriction"\]/u);
});
