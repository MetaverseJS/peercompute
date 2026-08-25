import test from 'node:test';
import assert from 'node:assert/strict';
import { PbfWriter } from 'pbf';
import { loadConfig } from '../src/config.js';
import { fetchBoundedBytes } from '../src/lib/fetch-bytes.js';
import {
  createSourceArtifactProvider,
  parseTileCoordinates,
  validateBoundedShortbreadMvt,
  validateCanonicalShortbreadTileJson,
  validateTerrariumPng
} from '../src/providers/source-artifacts.js';

const VALID_TILEJSON = Object.freeze({
  tilejson: '3.0.0',
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
const OBSERVED_Z5_SELECTED_FEATURES = 12_848;
const OBSERVED_Z5_COORDINATE_POSITIONS = 257_997;

function sourceConfig(limitOverrides = {}) {
  return loadConfig({
    NODE_ENV: 'test',
    GEODATA_USER_AGENT: 'PeerCompute-Source-Test/1.0 (+https://example.test/contact)'
  }, { limits: limitOverrides });
}

function validPng() {
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

function writePointFeature({ pointCount }, pbf) {
  pbf.writeVarintField(3, 1);
  pbf.writePackedVarint(4, [
    (pointCount << 3) | 1,
    ...Array.from({ length: pointCount * 2 }, () => 0)
  ]);
}

function writePointLayer({ name, featurePointCounts }, pbf) {
  pbf.writeStringField(1, name);
  for (const pointCount of featurePointCounts) {
    pbf.writeMessage(2, writePointFeature, { pointCount });
  }
  pbf.writeVarintField(5, 4_096);
  pbf.writeVarintField(15, 2);
}

function createPointMvt(layers) {
  const pbf = new PbfWriter();
  for (const layer of layers) pbf.writeMessage(3, writePointLayer, layer);
  return pbf.finish();
}

function observedZ5BoundaryFixture() {
  const basePointCount = Math.floor(
    OBSERVED_Z5_COORDINATE_POSITIONS / OBSERVED_Z5_SELECTED_FEATURES
  );
  const extraPointFeatures = OBSERVED_Z5_COORDINATE_POSITIONS
    - basePointCount * OBSERVED_Z5_SELECTED_FEATURES;
  const selectedPointCounts = Array.from(
    { length: OBSERVED_Z5_SELECTED_FEATURES },
    (_, index) => basePointCount + (index < extraPointFeatures ? 1 : 0)
  );
  return createPointMvt([
    { name: 'ocean', featurePointCounts: selectedPointCounts.slice(0, 1) },
    { name: 'water_polygons', featurePointCounts: selectedPointCounts.slice(1) },
    { name: 'water_polygons_labels', featurePointCounts: Array(159).fill(1) },
    { name: 'boundaries', featurePointCounts: [1] }
  ]);
}

test('bounded byte fetch forbids redirects and rejects content type, declared size, and streamed overflow', async () => {
  const defaults = {
    url: new URL('https://fixed.example/artifact'),
    timeoutMs: 1_000,
    maxResponseBytes: 8,
    allowedContentTypes: ['application/octet-stream']
  };
  await assert.rejects(fetchBoundedBytes({
    ...defaults,
    fetchImpl: async () => new Response(null, {
      status: 302,
      headers: { location: 'https://evil.example/pivot' }
    })
  }), (error) => error.code === 'UPSTREAM_REDIRECT_FORBIDDEN');
  await assert.rejects(fetchBoundedBytes({
    ...defaults,
    fetchImpl: async () => new Response('wrong', { headers: { 'content-type': 'text/html' } })
  }), (error) => error.code === 'UPSTREAM_CONTENT_TYPE_REJECTED');
  await assert.rejects(fetchBoundedBytes({
    ...defaults,
    fetchImpl: async () => new Response('tiny', {
      headers: { 'content-type': 'application/octet-stream', 'content-length': '9' }
    })
  }), (error) => error.code === 'UPSTREAM_BODY_TOO_LARGE');
  await assert.rejects(fetchBoundedBytes({
    ...defaults,
    fetchImpl: async () => new Response(new Uint8Array(9), {
      headers: { 'content-type': 'application/octet-stream' }
    })
  }), (error) => error.code === 'UPSTREAM_BODY_TOO_LARGE');
});

test('Shortbread and Terrarium validators fail closed on noncanonical upstream schemas', () => {
  const tileJsonBytes = Buffer.from(JSON.stringify(VALID_TILEJSON));
  assert.equal(validateCanonicalShortbreadTileJson(tileJsonBytes).maxzoom, 14);
  assert.throws(
    () => validateCanonicalShortbreadTileJson(Buffer.from(JSON.stringify({
      ...VALID_TILEJSON,
      tiles: ['https://evil.example/{z}/{x}/{y}.mvt']
    }))),
    (error) => error.code === 'UPSTREAM_SCHEMA_REJECTED'
  );

  assert.deepEqual(validateBoundedShortbreadMvt(new Uint8Array(), { z: 0, x: 0, y: 0 }), {
    ocean: 0,
    waterPolygons: 0,
    streets: 0,
    buildings: 0
  });
  assert.throws(
    () => validateBoundedShortbreadMvt(Uint8Array.of(255), { z: 0, x: 0, y: 0 }),
    (error) => error.code === 'UPSTREAM_SCHEMA_REJECTED'
  );

  assert.deepEqual(validateTerrariumPng(validPng()), {
    width: 256,
    height: 256,
    bitDepth: 8,
    colorType: 2
  });
  const wrongSize = validPng();
  wrongSize.writeUInt32BE(512, 16);
  assert.throws(
    () => validateTerrariumPng(wrongSize),
    (error) => error.code === 'UPSTREAM_SCHEMA_REJECTED'
  );
});

test('bounded MVT admits the observed valid z5 feature boundary and rejects above the hard feature cap', () => {
  const observedBoundary = observedZ5BoundaryFixture();
  assert.ok(observedBoundary.byteLength < 2 * 1024 * 1024);
  assert.deepEqual(validateBoundedShortbreadMvt(
    observedBoundary,
    { z: 5, x: 4, y: 7 }
  ), {
    ocean: 1,
    waterPolygons: 12_847,
    streets: 0,
    buildings: 0
  });

  const aboveHardFeatureCap = createPointMvt([{
    name: 'streets',
    featurePointCounts: Array(25_001).fill(1)
  }]);
  assert.throws(
    () => validateBoundedShortbreadMvt(
      aboveHardFeatureCap,
      { z: 5, x: 4, y: 7 }
    ),
    (error) => error.code === 'UPSTREAM_SCHEMA_REJECTED'
      && /feature cap/u.test(error.cause?.message ?? '')
  );
});

test('tile coordinates are canonical and bounded before any fixed upstream request', () => {
  assert.deepEqual(parseTileCoordinates({ z: '14', x: '16383', y: '0' }, 14), {
    z: 14,
    x: 16_383,
    y: 0
  });
  for (const params of [
    { z: '01', x: '0', y: '0' },
    { z: '15', x: '0', y: '0' },
    { z: '1', x: '2', y: '0' },
    { z: '0', x: '-1', y: '0' },
    { z: '0', x: '0', y: '0', url: 'https://evil.example' }
  ]) {
    if ('url' in params) {
      const { url: _ignored, ...coordinates } = params;
      assert.deepEqual(parseTileCoordinates(coordinates, 14), { z: 0, x: 0, y: 0 });
      continue;
    }
    assert.throws(
      () => parseTileCoordinates(params, 14),
      (error) => error.code === 'INVALID_TILE_COORDINATE' && error.statusCode === 400
    );
  }
});

test('source provider uses only allowlisted HTTPS origins and admits validated exact bytes', async () => {
  const requested = [];
  const tileJsonBytes = Buffer.from(JSON.stringify(VALID_TILEJSON));
  const png = validPng();
  const provider = createSourceArtifactProvider({
    config: sourceConfig(),
    fetchImpl: async (url, init) => {
      requested.push(String(url));
      assert.equal(init.redirect, 'manual');
      assert.equal(init.headers['user-agent'], 'PeerCompute-Source-Test/1.0 (+https://example.test/contact)');
      if (String(url).endsWith('tilejson.json')) {
        return new Response(tileJsonBytes, { headers: { 'content-type': 'application/json' } });
      }
      if (String(url).endsWith('.mvt')) {
        return new Response(Buffer.alloc(0), {
          headers: { 'content-type': 'application/vnd.mapbox-vector-tile' }
        });
      }
      return new Response(png, { headers: { 'content-type': 'image/png' } });
    }
  });

  const tileJson = await provider.fetchShortbreadTileJson();
  const mvt = await provider.fetchShortbreadTile({ z: 0, x: 0, y: 0 });
  const terrain = await provider.fetchTerrariumTile({ z: 0, x: 0, y: 0 });
  assert.deepEqual(tileJson.bytes, tileJsonBytes);
  assert.deepEqual(mvt.bytes, Buffer.alloc(0));
  assert.deepEqual(terrain.bytes, png);
  assert.match(tileJson.etag, /^"sha256-[A-Za-z0-9_-]+"$/u);
  assert.deepEqual(requested, [
    'https://vector.openstreetmap.org/shortbread_v1/tilejson.json',
    'https://vector.openstreetmap.org/shortbread_v1/0/0/0.mvt',
    'https://elevation-tiles-prod.s3.amazonaws.com/terrarium/0/0/0.png'
  ]);
  assert.equal(provider.stats.active, 0);
  assert.equal(provider.stats.queued, 0);
});
