import test from 'node:test';
import assert from 'node:assert/strict';
import * as Cesium from 'cesium';
import {
  ETOPO2022_DATASET,
  ETOPO2022_MAX_LEVEL,
  ETOPO2022_TILE_SIZE,
  canonicalizeEtopo2022BoundaryVertices,
  createEtopo2022TerrainProvider,
  decodeEtopo2022Bip,
  fetchEtopo2022Samples,
  formatEtopo2022ExportUrl,
  padEtopo2022BoundsForVertexGrid,
  stitchEtopo2022BoundaryPosts
} from '../src/terrain/etopo2022.js';

function makeBip(values, validity = null) {
  const pixelBytes = values.length * 2;
  const maskBytes = validity ? Math.ceil(values.length / 8) : 0;
  const buffer = new ArrayBuffer(pixelBytes + maskBytes);
  const view = new DataView(buffer);
  values.forEach((value, index) => view.setInt16(index * 2, value, true));
  if (validity) {
    const mask = new Uint8Array(buffer, pixelBytes);
    validity.forEach((valid, index) => {
      if (valid) mask[index >> 3] |= 0x80 >> (index & 7);
    });
  }
  return buffer;
}

test('ETOPO 2022 BIP decoding reads little-endian S16 heights with an MSB-first validity mask', () => {
  const expected = [-7533, -110, 0, 4709];
  assert.deepEqual([...decodeEtopo2022Bip(makeBip(expected), 2, 2)], expected);
  assert.deepEqual([...decodeEtopo2022Bip(makeBip(expected, [true, true, true, true]), 2, 2)], expected);
  assert.throws(
    () => decodeEtopo2022Bip(makeBip(expected, [true, false, true, true]), 2, 2),
    /NoData at sample 1/
  );
  const noData = decodeEtopo2022Bip(makeBip(expected, [true, false, true, true]), 2, 2, {
    allowNoData: true
  });
  assert.equal(Number.isNaN(noData[1]), true);
});

test('ETOPO 2022 BIP decoding rejects malformed payload lengths', () => {
  assert.throws(() => decodeEtopo2022Bip(new ArrayBuffer(4), 1, 1), /Expected 2 pixel bytes/);
});

test('ETOPO 2022 export URL pins the pole-to-pole 60-second signed-height mosaic and 257 posts', () => {
  const url = new URL(formatEtopo2022ExportUrl({ west: -180, south: -90, east: 0, north: 90 }));
  assert.equal(ETOPO2022_TILE_SIZE, 257);
  assert.equal(url.origin, 'https://gis.ngdc.noaa.gov');
  assert.equal(url.searchParams.get('bbox'), '-180,-90,0,90');
  assert.equal(url.searchParams.get('bboxSR'), '4326');
  assert.equal(url.searchParams.get('imageSR'), '4326');
  assert.equal(url.searchParams.get('size'), '257,257');
  assert.equal(url.searchParams.get('format'), 'bip');
  assert.equal(url.searchParams.get('pixelType'), 'S16');
  assert.equal(url.searchParams.get('noData'), '-32768');
  assert.equal(url.searchParams.get('f'), 'image');
  const mosaicRule = JSON.parse(url.searchParams.get('mosaicRule'));
  assert.equal(mosaicRule.where, `DemName = '${ETOPO2022_DATASET}'`);
});

test('ETOPO 2022 export bounds align raster cell centers with dyadic terrain posts', () => {
  assert.deepEqual(
    padEtopo2022BoundsForVertexGrid({ west: -180, south: -90, east: 0, north: 90 }, { width: 257, height: 257 }),
    { west: -180.3515625, south: -90.3515625, east: 0.3515625, north: 90.3515625 }
  );
});

test('ETOPO 2022 exact sample requests preserve point order and pin the selected mosaic', async () => {
  let captured;
  const values = await fetchEtopo2022Samples([[180, 10], [180, -10]], {
    fetchImpl: async (url, options) => {
      captured = { url, options };
      return {
        ok: true,
        json: async () => ({
          samples: [
            { locationId: 1, value: '-200' },
            { locationId: 0, value: '100' }
          ]
        })
      };
    }
  });

  assert.deepEqual([...values], [100, -200]);
  assert.equal(captured.options.method, 'POST');
  assert.equal(captured.options.body.get('geometryType'), 'esriGeometryMultipoint');
  assert.deepEqual(JSON.parse(captured.options.body.get('geometry')).points, [[180, 10], [180, -10]]);
  assert.equal(
    JSON.parse(captured.options.body.get('mosaicRule')).where,
    `DemName = '${ETOPO2022_DATASET}'`
  );
});

test('ETOPO 2022 boundary stitching shares one dateline and collapses pole rows', async () => {
  const raw = new Float32Array([
    Number.NaN, 1, 2,
    Number.NaN, 4, 5,
    Number.NaN, 7, 8
  ]);
  const result = await stitchEtopo2022BoundaryPosts(raw, {
    x: 0,
    y: 0,
    level: 0,
    width: 3,
    height: 3,
    bounds: { west: -180, south: -90, east: 0, north: 90 },
    xTileCount: 2,
    yTileCount: 1,
    loadDateline: async () => new Float32Array([10, 20, 30]),
    loadPole: async (latitude) => latitude === 90 ? 100 : -100
  });

  assert.deepEqual([...result], [100, 100, 100, 20, 4, 5, -100, -100, -100]);
  await assert.rejects(
    stitchEtopo2022BoundaryPosts(new Float32Array([1, 2, 3, 4, Number.NaN, 6, 7, 8, 9]), {
      x: 0,
      y: 0,
      level: 0,
      width: 3,
      height: 3,
      bounds: { west: -180, south: -90, east: 0, north: 90 },
      xTileCount: 2,
      yTileCount: 1,
      loadDateline: async () => new Float32Array(3),
      loadPole: async () => 0
    }),
    /interior NoData/
  );
});

test('ETOPO 2022 boundary cache makes same- and cross-level shared vertices byte-identical and stays bounded', () => {
  const tilingScheme = new Cesium.GeographicTilingScheme();
  const cache = new Map();
  const canonicalize = (heights, x, y, level) => canonicalizeEtopo2022BoundaryVertices(heights, {
    x,
    y,
    level,
    width: 3,
    height: 3,
    maximumLevel: 2,
    tilingScheme,
    vertexCache: cache,
    maximumCacheEntries: 16
  });
  const west = canonicalize(new Float32Array([1, 2, 10, 3, 4, 11, 5, 6, 12]), 2, 1, 2);
  const east = canonicalize(new Float32Array([20, 7, 8, 21, 9, 10, 22, 11, 12]), 3, 1, 2);
  assert.deepEqual([east[0], east[3], east[6]], [west[2], west[5], west[8]]);

  const parent = canonicalize(new Float32Array([100, 1, 101, 110, 2, 111, 120, 3, 121]), 1, 0, 1);
  const child = canonicalize(new Float32Array([200, 4, 201, 210, 5, 211, 220, 6, 221]), 4, 0, 2);
  assert.equal(child[0], parent[2]);
  assert.equal(child[6], parent[5]);
  assert.ok(cache.size <= 16);
});

test('ETOPO 2022 provider loads real Cesium terminal terrain, records relief, and blocks z7 at admission', async () => {
  let fetchCount = 0;
  const heights = new Float32Array([-4100, -12, 120, 2724, 1, 2, 3, 4, 5]);
  const provider = createEtopo2022TerrainProvider(Cesium, {
    maxLevel: 2,
    tileSize: 3,
    boundaryCacheSize: 16,
    fetchHeightmap: async () => {
      fetchCount += 1;
      return heights;
    },
    fetchSamples: async () => {
      throw new Error('interior fixture must not request boundary samples');
    },
    retryDelayMs: 0
  });

  const terrain = await provider.requestTileGeometry(2, 1, 2);
  assert.equal(terrain.childTileMask, 0);
  assert.equal(terrain._buffer.length, 9);
  assert.equal(provider.getTileDataAvailable(0, 0, ETOPO2022_MAX_LEVEL + 1), false);
  await assert.rejects(provider.requestTileGeometry(0, 0, 3), /outside the available pyramid/);
  assert.equal(fetchCount, 1, 'unavailable levels must not issue a source request');
  const snapshot = provider.wxglobe.snapshot();
  assert.equal(snapshot.loaded, 1);
  assert.equal(snapshot.failed, 0);
  assert.equal(snapshot.inFlight, 0);
  assert.equal(snapshot.maximumLoadedLevel, 2);
  assert.equal(snapshot.minimum, -4100);
  assert.equal(snapshot.maximum, 2724);
  assert.equal(snapshot.negativeSamples, 2);
  assert.equal(snapshot.positiveSamples, 7);
  assert.equal(snapshot.lastLoadedTile.level, 2);
  assert.ok(provider.wxglobe.boundaryVertexCacheSize() <= 16);
});

test('ETOPO 2022 provider retries boundedly and classifies exhausted root failure as terminal', async () => {
  let attempts = 0;
  const provider = createEtopo2022TerrainProvider(Cesium, {
    maxLevel: 0,
    tileSize: 3,
    boundaryCacheSize: 16,
    retryAttempts: 2,
    retryDelayMs: 0,
    fetchHeightmap: async () => {
      attempts += 1;
      throw new Error('fixture unavailable');
    }
  });

  await assert.rejects(provider.requestTileGeometry(0, 0, 0), /fixture unavailable/);
  assert.equal(attempts, 2);
  assert.equal(provider.wxglobe.telemetry.retries, 1);
  assert.equal(provider.wxglobe.telemetry.failed, 1);
  assert.equal(provider.wxglobe.telemetry.terminalFailures, 1);
  assert.equal(provider.wxglobe.telemetry.rootTerminalFailures, 1);
  assert.equal(provider.wxglobe.telemetry.inFlight, 0);
});

test('ETOPO 2022 provider preserves a terminal root diagnostic after a sibling succeeds', async () => {
  let fetchCalls = 0;
  const provider = createEtopo2022TerrainProvider(Cesium, {
    maxLevel: 0,
    tileSize: 3,
    boundaryCacheSize: 16,
    retryAttempts: 1,
    fetchHeightmap: async () => {
      fetchCalls += 1;
      if (fetchCalls === 1) throw new Error('west root fixture failed');
      return new Float32Array([-1, 0, 1, -2, 2, 3, -3, 4, 5]);
    },
    fetchSamples: async (points) => points.length === 1
      ? new Float32Array([points[0][1] === 90 ? 100 : -100])
      : new Float32Array([10, 20, 30])
  });

  await assert.rejects(provider.requestTileGeometry(0, 0, 0), /west root fixture failed/);
  await provider.requestTileGeometry(1, 0, 0);
  const snapshot = provider.wxglobe.snapshot();
  assert.equal(snapshot.loaded, 1);
  assert.equal(snapshot.rootTerminalFailures, 1);
  assert.equal(snapshot.lastTerminalError, 'west root fixture failed');
  assert.equal(snapshot.lastError, 'west root fixture failed');
});

test('ETOPO 2022 provider enforces an explicit unique-tile session budget without blocking retries', async () => {
  let fetchCount = 0;
  const provider = createEtopo2022TerrainProvider(Cesium, {
    maxLevel: 1,
    tileSize: 3,
    boundaryCacheSize: 16,
    maximumTileRequests: 1,
    retryAttempts: 1,
    fetchHeightmap: async () => {
      fetchCount += 1;
      return new Float32Array([-3, -2, -1, 0, 1, 2, 3, 4, 5]);
    },
    fetchSamples: async (points) => new Float32Array(points.length).fill(0),
  });

  await provider.requestTileGeometry(0, 0, 0);
  await provider.requestTileGeometry(0, 0, 0);
  await assert.rejects(
    provider.requestTileGeometry(0, 0, 1),
    (error) => error?.code === 'ERR_ETOPO_TILE_REQUEST_CAP',
  );

  assert.equal(fetchCount, 2, 'an admitted tile may be requested again without consuming a second budget slot');
  assert.equal(provider.wxglobe.maximumTileRequests, 1);
  assert.equal(provider.wxglobe.requestedTileCount(), 1);
  assert.equal(provider.wxglobe.telemetry.uniqueTileRequests, 1);
  assert.equal(provider.wxglobe.telemetry.requestLimitExceeded, true);
});

test('ETOPO 2022 provider keeps the shared default effectively unlimited', async () => {
  const provider = createEtopo2022TerrainProvider(Cesium, {
    maxLevel: 1,
    tileSize: 3,
    boundaryCacheSize: 16,
    retryAttempts: 1,
    fetchHeightmap: async () => new Float32Array([-3, -2, -1, 0, 1, 2, 3, 4, 5]),
    fetchSamples: async (points) => new Float32Array(points.length).fill(0),
  });
  await provider.requestTileGeometry(0, 0, 0);
  await provider.requestTileGeometry(0, 0, 1);
  assert.equal(provider.wxglobe.maximumTileRequests, Number.MAX_SAFE_INTEGER);
  assert.equal(provider.wxglobe.telemetry.requestLimitExceeded, false);
});
