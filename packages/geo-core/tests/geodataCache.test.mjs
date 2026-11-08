import assert from 'node:assert/strict';
import test from 'node:test';

import { PbfWriter } from 'pbf';

import {
  CACHED_GEO_ROUTE_PREFIX,
  createCachedGeoFetch
} from '../src/client/geodataCache.js';
import {
  SHORTBREAD_MAXIMUM_FEATURES_PER_TILE,
  SHORTBREAD_TILEJSON_URL
} from '../src/vector/shortbread.js';
import { TERRARIUM_URL_TEMPLATE } from '../src/terrain/terrarium.js';

const tileJson = Object.freeze({
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
  ],
  attribution: '© OpenStreetMap contributors'
});

function jsonResponse(payload = tileJson, init = {}) {
  return new Response(JSON.stringify(payload), {
    status: init.status ?? 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=60, stale-while-revalidate=120',
      ...init.headers
    }
  });
}

function pngBytes(width = 256, height = 256) {
  const bytes = new Uint8Array(33);
  bytes.set([137, 80, 78, 71, 13, 10, 26, 10], 0);
  bytes.set([0, 0, 0, 13], 8);
  bytes.set([73, 72, 68, 82], 12);
  new DataView(bytes.buffer).setUint32(16, width);
  new DataView(bytes.buffer).setUint32(20, height);
  bytes[24] = 8;
  bytes[25] = 6;
  return bytes;
}

function writePointFeature(_feature, pbf) {
  pbf.writeVarintField(3, 1);
  pbf.writePackedVarint(4, [9, 0, 0]);
}

function writePointLayer({ featureCount }, pbf) {
  pbf.writeStringField(1, 'streets');
  for (let index = 0; index < featureCount; index += 1) {
    pbf.writeMessage(2, writePointFeature, null);
  }
  pbf.writeVarintField(5, 4_096);
  pbf.writeVarintField(15, 2);
}

function pointMvt(featureCount) {
  const pbf = new PbfWriter();
  pbf.writeMessage(3, writePointLayer, { featureCount });
  return pbf.finish();
}

class MemoryArtifactCache {
  constructor() {
    this.entries = new Map();
    this.calls = [];
  }

  async getOrLoad(options) {
    this.calls.push(options);
    const hit = this.entries.get(options.key);
    if (hit) return { ...hit, bytes: hit.bytes.slice(), cacheStatus: 'hit' };
    const loaded = await options.loader({
      signal: new AbortController().signal,
      maximumBytes: 8 * 1024 * 1024
    });
    const metadata = {
      ...loaded.metadata,
      sourceId: options.sourceId,
      mediaType: options.mediaType
    };
    await options.validate(loaded.bytes, metadata);
    const result = { bytes: loaded.bytes.slice(), metadata };
    this.entries.set(options.key, result);
    return { ...result, bytes: result.bytes.slice(), cacheStatus: 'miss' };
  }
}

function requestUrl(input) {
  return typeof input === 'string' ? input : input.url;
}

test('same-origin proxy responses populate the local road tier and warm hits avoid the network', async () => {
  const urls = [];
  const roadCache = new MemoryArtifactCache();
  const telemetry = [];
  const fetchImpl = async (input) => {
    urls.push(requestUrl(input));
    return jsonResponse();
  };
  const cachedFetch = createCachedGeoFetch({
    fetchImpl,
    geodataBaseUrl: '',
    localRoadCache: roadCache,
    clock: () => 1_000,
    onTelemetry: (snapshot) => telemetry.push(snapshot)
  });

  const cold = await cachedFetch(SHORTBREAD_TILEJSON_URL);
  assert.deepEqual(await cold.json(), tileJson);
  const warm = await cachedFetch(SHORTBREAD_TILEJSON_URL);
  assert.deepEqual(await warm.json(), tileJson);
  assert.deepEqual(urls, [`${CACHED_GEO_ROUTE_PREFIX}/osm-shortbread/tilejson`]);
  assert.equal(roadCache.calls.length, 2);
  assert.equal(roadCache.entries.get('osm-shortbread:tilejson').metadata.freshUntil, 61_000);
  assert.equal(roadCache.entries.get('osm-shortbread:tilejson').metadata.staleUntil, 181_000);
  assert.equal(cachedFetch.getTelemetry().cacheMisses, 1);
  assert.equal(cachedFetch.getTelemetry().cacheHits, 1);
  assert.equal(cachedFetch.getTelemetry().proxyRequests, 1);
  assert.equal(telemetry.at(-1).lastSourceId, 'osm-shortbread');
  await cachedFetch.destroy();
});

test('base URL normalization supports disabled rewrites and absolute API origins', async () => {
  const directUrls = [];
  const directFetch = createCachedGeoFetch({
    fetchImpl: async (input) => {
      directUrls.push(requestUrl(input));
      return jsonResponse();
    },
    geodataBaseUrl: null
  });
  assert.equal((await directFetch(SHORTBREAD_TILEJSON_URL)).ok, true);
  assert.deepEqual(directUrls, [SHORTBREAD_TILEJSON_URL]);
  assert.equal(directFetch.getTelemetry().lastTransport, 'direct');

  const proxyUrls = [];
  const absoluteFetch = createCachedGeoFetch({
    fetchImpl: async (input) => {
      proxyUrls.push(requestUrl(input));
      return jsonResponse();
    },
    geodataBaseUrl: 'https://geo.example'
  });
  assert.equal((await absoluteFetch(SHORTBREAD_TILEJSON_URL)).ok, true);
  assert.deepEqual(proxyUrls, ['https://geo.example/api/v1/cache/osm-shortbread/tilejson']);
  assert.throws(() => createCachedGeoFetch({
    fetchImpl: async () => jsonResponse(),
    geodataBaseUrl: 'https://geo.example/api/v1/cache'
  }), /without a path/u);
});

test('arbitrary hosts, regional OSM JSON, methods, and invalid tile coordinates pass through untouched', async () => {
  const requests = [];
  const cache = new MemoryArtifactCache();
  const cachedFetch = createCachedGeoFetch({
    fetchImpl: async (input, init) => {
      requests.push({ url: requestUrl(input), method: init?.method ?? 'GET' });
      return new Response('passthrough');
    },
    geodataBaseUrl: '',
    localRoadCache: cache
  });
  const arbitrary = 'https://tiles.example/1/0/0.mvt';
  const regional = 'https://app.example/api/v1/geo/osm?bbox=1,2,3,4';
  const invalid = 'https://vector.openstreetmap.org/shortbread_v1/1/2/0.mvt';
  await cachedFetch(arbitrary);
  await cachedFetch(regional);
  await cachedFetch(invalid);
  await cachedFetch(SHORTBREAD_TILEJSON_URL, { method: 'HEAD' });
  assert.deepEqual(requests, [
    { url: arbitrary, method: 'GET' },
    { url: regional, method: 'GET' },
    { url: invalid, method: 'GET' },
    { url: SHORTBREAD_TILEJSON_URL, method: 'HEAD' }
  ]);
  assert.equal(cache.calls.length, 0);
  assert.equal(cachedFetch.getTelemetry().passThrough, 4);
});

test('backend failure uses and clearly reports direct-source fallback', async () => {
  const urls = [];
  const roadCache = new MemoryArtifactCache();
  const cachedFetch = createCachedGeoFetch({
    fetchImpl: async (input) => {
      const url = requestUrl(input);
      urls.push(url);
      if (url.startsWith('/api/')) throw Object.assign(new Error('backend offline'), { code: 'BACKEND_OFFLINE' });
      return jsonResponse();
    },
    geodataBaseUrl: '',
    localRoadCache: roadCache,
    directFallback: true
  });
  assert.equal((await cachedFetch(SHORTBREAD_TILEJSON_URL)).ok, true);
  assert.deepEqual(urls, [
    '/api/v1/cache/osm-shortbread/tilejson',
    SHORTBREAD_TILEJSON_URL
  ]);
  assert.equal(cachedFetch.getTelemetry().proxyFailures, 1);
  assert.equal(cachedFetch.getTelemetry().directFallbacks, 1);
  assert.equal(cachedFetch.getTelemetry().lastTransport, 'direct-fallback');
  assert.equal(roadCache.entries.get('osm-shortbread:tilejson').metadata.transport, 'direct-fallback');
});

test('disabled direct fallback returns the backend HTTP response without caching it', async () => {
  const urls = [];
  const cachedFetch = createCachedGeoFetch({
    fetchImpl: async (input) => {
      urls.push(requestUrl(input));
      return jsonResponse({ error: true }, { status: 503 });
    },
    geodataBaseUrl: '',
    localRoadCache: new MemoryArtifactCache(),
    directFallback: false
  });
  const response = await cachedFetch(SHORTBREAD_TILEJSON_URL);
  assert.equal(response.status, 503);
  assert.deepEqual(urls, ['/api/v1/cache/osm-shortbread/tilejson']);
  assert.equal(cachedFetch.getTelemetry().directFallbacks, 0);
});

test('cache capacity rejection degrades to an uncached network request', async () => {
  const urls = [];
  const capacityCache = {
    getOrLoad: async () => {
      throw Object.assign(new Error('all reservations occupied'), {
        code: 'ERR_LOCAL_ARTIFACT_CACHE_BUSY'
      });
    }
  };
  const cachedFetch = createCachedGeoFetch({
    fetchImpl: async (input) => {
      urls.push(requestUrl(input));
      return jsonResponse();
    },
    geodataBaseUrl: '',
    localRoadCache: capacityCache
  });

  assert.equal((await cachedFetch(SHORTBREAD_TILEJSON_URL)).ok, true);
  assert.deepEqual(urls, ['/api/v1/cache/osm-shortbread/tilejson']);
  assert.equal(cachedFetch.getTelemetry().cacheBypasses, 1);
  assert.equal(cachedFetch.getTelemetry().lastCacheStatus, 'bypass');
});

test('Shortbread tile and Terrarium URLs map only to fixed bounded routes', async () => {
  const urls = [];
  const capacityCache = {
    getOrLoad: async () => {
      throw Object.assign(new Error('bypass for route assertion'), {
        code: 'ERR_LOCAL_ARTIFACT_CACHE_BUSY'
      });
    }
  };
  const cachedFetch = createCachedGeoFetch({
    fetchImpl: async (input) => {
      urls.push(requestUrl(input));
      return new Response(new Uint8Array([1]), {
        headers: { 'content-type': 'application/octet-stream' }
      });
    },
    geodataBaseUrl: '',
    localRoadCache: capacityCache,
    localTerrainCache: capacityCache
  });
  await cachedFetch('https://vector.openstreetmap.org/shortbread_v1/12/653/1440.mvt');
  await cachedFetch(TERRARIUM_URL_TEMPLATE
    .replace('{z}', '12')
    .replace('{x}', '653')
    .replace('{y}', '1440'));
  assert.deepEqual(urls, [
    '/api/v1/cache/osm-shortbread/12/653/1440.mvt',
    '/api/v1/cache/aws-terrarium/12/653/1440.png'
  ]);
});

test('Terrarium bytes require image/png and an exact 256 by 256 IHDR before admission', async () => {
  const terrainCache = new MemoryArtifactCache();
  let dimensions = [256, 256];
  const cachedFetch = createCachedGeoFetch({
    fetchImpl: async () => new Response(pngBytes(...dimensions), {
      headers: { 'content-type': 'image/png' }
    }),
    geodataBaseUrl: '',
    localTerrainCache: terrainCache
  });
  const sourceUrl = TERRARIUM_URL_TEMPLATE
    .replace('{z}', '1')
    .replace('{x}', '0')
    .replace('{y}', '0');
  assert.equal((await cachedFetch(sourceUrl)).ok, true);

  terrainCache.entries.clear();
  dimensions = [255, 256];
  await assert.rejects(cachedFetch(sourceUrl), (error) => (
    error?.code === 'ERR_CACHED_GEO_TERRARIUM_PNG'
  ));
  assert.equal(terrainCache.entries.size, 0);
});

test('local Shortbread admission shares the 25,000-feature hard boundary', async () => {
  const roadCache = new MemoryArtifactCache();
  let bytes = pointMvt(SHORTBREAD_MAXIMUM_FEATURES_PER_TILE);
  const cachedFetch = createCachedGeoFetch({
    fetchImpl: async () => new Response(bytes, {
      headers: { 'content-type': 'application/vnd.mapbox-vector-tile' }
    }),
    geodataBaseUrl: '',
    localRoadCache: roadCache
  });
  const sourceUrl = 'https://vector.openstreetmap.org/shortbread_v1/5/4/7.mvt';
  assert.equal((await cachedFetch(sourceUrl)).ok, true);
  assert.equal(roadCache.entries.size, 1);

  roadCache.entries.clear();
  bytes = pointMvt(SHORTBREAD_MAXIMUM_FEATURES_PER_TILE + 1);
  await assert.rejects(cachedFetch(sourceUrl), (error) => (
    error?.code === 'ERR_CACHED_GEO_SHORTBREAD' && /feature cap/u.test(error.message)
  ));
  assert.equal(roadCache.entries.size, 0);
});

test('destroy aborts lifecycle requests and rejects later use without destroying caller-owned caches', async () => {
  let observedSignal;
  let cacheDestroyed = false;
  const cache = {
    getOrLoad: async ({ loader }) => loader({
      signal: new AbortController().signal,
      maximumBytes: 1_024
    }),
    destroy: async () => { cacheDestroyed = true; }
  };
  const cachedFetch = createCachedGeoFetch({
    fetchImpl: async (_input, init) => {
      observedSignal = init.signal;
      return jsonResponse();
    },
    geodataBaseUrl: '',
    localRoadCache: cache
  });
  await cachedFetch.destroy();
  assert.equal(cacheDestroyed, false);
  await assert.rejects(cachedFetch(SHORTBREAD_TILEJSON_URL), (error) => (
    error?.code === 'ERR_CACHED_GEO_FETCH_DESTROYED'
  ));
  assert.equal(observedSignal, undefined);
});
