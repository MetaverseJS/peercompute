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

test('provider retries one retryable HTTP or transport failure and succeeds on the second attempt', async () => {
  for (const firstFailure of ['http-503', 'transport']) {
    let calls = 0;
    const backoffs = [];
    const provider = createOverpassProvider({
      config: providerConfig({ overpassRetryBackoffMs: 17 }),
      waitForRetry: async (delayMs, signal) => {
        assert.equal(signal.aborted, false);
        backoffs.push(delayMs);
      },
      fetchImpl: async () => {
        calls += 1;
        if (calls === 1) {
          if (firstFailure === 'transport') throw new Error('temporary socket failure');
          return new Response('{}', {
            status: 503,
            headers: { 'content-type': 'application/json' }
          });
        }
        return responseForJson({ elements: [] });
      }
    });
    assert.deepEqual((await provider.fetchRegion(request)).elements, []);
    assert.equal(calls, 2);
    assert.deepEqual(backoffs, [17]);
  }
});

test('provider aborts during retry backoff without issuing the second attempt', async () => {
  let calls = 0;
  const controller = new AbortController();
  const provider = createOverpassProvider({
    config: providerConfig({
      overpassCallTimeoutMs: 5_000,
      overpassRetryBackoffMs: 500
    }),
    fetchImpl: async () => {
      calls += 1;
      return new Response('{}', {
        status: 503,
        headers: { 'content-type': 'application/json' }
      });
    }
  });
  const pending = provider.fetchRegion({ ...request, signal: controller.signal });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls, 1);
  controller.abort(new DOMException('test caller aborted', 'AbortError'));
  await assert.rejects(pending, (error) => error.name === 'AbortError');
  assert.equal(calls, 1);
  assert.equal(provider.stats.active, 0);
});

test('provider shared deadline includes retry backoff and prevents a late second attempt', async () => {
  let calls = 0;
  const provider = createOverpassProvider({
    config: providerConfig({
      overpassCallTimeoutMs: 20,
      overpassRetryBackoffMs: 100
    }),
    fetchImpl: async () => {
      calls += 1;
      return new Response('{}', {
        status: 503,
        headers: { 'content-type': 'application/json' }
      });
    }
  });
  await assert.rejects(
    provider.fetchRegion(request),
    (error) => error.code === 'UPSTREAM_TIMEOUT' && error.statusCode === 504
  );
  assert.equal(calls, 1);
  assert.equal(provider.stats.active, 0);
});

test('provider attempts at most twice when a retryable response remains unavailable', async () => {
  let calls = 0;
  let backoffs = 0;
  const provider = createOverpassProvider({
    config: providerConfig(),
    waitForRetry: async () => { backoffs += 1; },
    fetchImpl: async () => {
      calls += 1;
      return new Response('{}', {
        status: 502,
        headers: { 'content-type': 'application/json' }
      });
    }
  });
  await assert.rejects(
    provider.fetchRegion(request),
    (error) => error.code === 'UPSTREAM_HTTP_ERROR' && error.retryable === true
  );
  assert.equal(calls, 2);
  assert.equal(backoffs, 1);
});

test('provider never retries 4xx, schema, size, or truncation failures', async () => {
  const cases = [
    {
      name: 'HTTP 400',
      expectedCode: 'UPSTREAM_HTTP_ERROR',
      response: () => new Response('{}', {
        status: 400,
        headers: { 'content-type': 'application/json' }
      })
    },
    {
      name: 'invalid schema',
      expectedCode: 'UPSTREAM_SCHEMA_INVALID',
      response: () => responseForJson({ notElements: [] })
    },
    {
      name: 'declared oversized body',
      expectedCode: 'UPSTREAM_BODY_TOO_LARGE',
      limits: { overpassMaxResponseBytes: 8 },
      response: () => new Response('{}', {
        headers: { 'content-type': 'application/json', 'content-length': '9' }
      })
    },
    {
      name: 'truncated result bound',
      expectedCode: 'UPSTREAM_RESULT_LIMIT_EXCEEDED',
      response: () => responseForJson({ elements: Array.from(
        { length: OVERPASS_OUTPUT_LIMIT },
        (_, id) => ({ type: 'node', id })
      ) })
    }
  ];

  for (const fixture of cases) {
    let calls = 0;
    const provider = createOverpassProvider({
      config: providerConfig(fixture.limits),
      waitForRetry: async () => {
        throw new Error(`unexpected retry for ${fixture.name}`);
      },
      fetchImpl: async () => {
        calls += 1;
        return fixture.response();
      }
    });
    await assert.rejects(
      provider.fetchRegion(request),
      (error) => error.code === fixture.expectedCode,
      fixture.name
    );
    assert.equal(calls, 1, fixture.name);
  }
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
