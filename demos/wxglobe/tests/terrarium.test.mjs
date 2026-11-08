import test from 'node:test';
import assert from 'node:assert/strict';
import * as Cesium from 'cesium';
import {
  TERRARIUM_GRID_SIZE,
  TERRARIUM_MAX_LEVEL,
  TERRARIUM_TILE_SIZE,
  TERRARIUM_URL_TEMPLATE,
  createTerrariumSourceTileLoader,
  createTerrariumTerrainProvider,
  decodeTerrariumHeight,
  decodeTerrariumPixels,
  formatTerrariumTileUrl,
  resampleTerrariumVertexGrid,
  summarizeHeightmap
} from '../src/terrain/terrarium.js';

test('Terrarium decoding preserves negative, zero, positive, and fractional elevations', () => {
  assert.equal(decodeTerrariumHeight(85, 8, 0), -11000);
  assert.equal(decodeTerrariumHeight(128, 0, 0), 0);
  assert.equal(decodeTerrariumHeight(162, 144, 0), 8848);
  assert.equal(decodeTerrariumHeight(128, 0, 128), 0.5);

  const heights = decodeTerrariumPixels(new Uint8ClampedArray([
    85, 8, 0, 255,
    128, 0, 0, 255,
    162, 144, 0, 255,
    128, 0, 128, 255
  ]), 2, 2);

  assert.ok(heights instanceof Float32Array);
  assert.deepEqual([...heights], [-11000, 0, 8848, 0.5]);
  assert.deepEqual(summarizeHeightmap(heights), {
    minimum: -11000,
    maximum: 8848,
    negativeCount: 1,
    positiveCount: 2
  });
});

test('Terrarium decoding rejects malformed image buffers', () => {
  assert.throws(() => decodeTerrariumPixels(new Uint8Array(7), 1, 2), /Expected 8 RGBA values/);
  assert.throws(() => decodeTerrariumPixels(new Uint8Array(4), 0, 1), /positive integer/);
});

test('tile URL formatting uses the public US AWS endpoint and validates coordinates', () => {
  assert.equal(TERRARIUM_TILE_SIZE, 256);
  assert.equal(TERRARIUM_GRID_SIZE, 257);
  assert.equal(
    formatTerrariumTileUrl(17, 23, 6),
    'https://elevation-tiles-prod.s3.amazonaws.com/terrarium/6/17/23.png'
  );
  assert.match(TERRARIUM_URL_TEMPLATE, /^https:\/\/elevation-tiles-prod\.s3\.amazonaws\.com\//);
  assert.throws(() => formatTerrariumTileUrl(-1, 0, 0), /non-negative integer/);
});

function syntheticSourceTile(x, y, level, sourceTileSize = 2) {
  const tilesPerAxis = 2 ** level;
  const globalSpan = tilesPerAxis * sourceTileSize;
  const heights = new Float32Array(sourceTileSize * sourceTileSize);
  for (let row = 0; row < sourceTileSize; row += 1) {
    for (let column = 0; column < sourceTileSize; column += 1) {
      const globalX = (x * sourceTileSize + column + 0.5) / globalSpan;
      const globalY = (y * sourceTileSize + row + 0.5) / globalSpan;
      heights[row * sourceTileSize + column] = globalX * 1000 + globalY * 100;
    }
  }
  return heights;
}

test('Terrarium 3x3 resampling creates 257-style endpoint posts with exact adjacent edges', async () => {
  const loadTile = async (x, y, level) => syntheticSourceTile(x, y, level);
  const options = { level: 2, sourceTileSize: 2, gridSize: 3, loadTile };
  const west = await resampleTerrariumVertexGrid({ ...options, x: 1, y: 1 });
  const east = await resampleTerrariumVertexGrid({ ...options, x: 2, y: 1 });
  const north = await resampleTerrariumVertexGrid({ ...options, x: 1, y: 1 });
  const south = await resampleTerrariumVertexGrid({ ...options, x: 1, y: 2 });

  assert.equal(west.length, 9);
  for (let row = 0; row < 3; row += 1) assert.equal(west[row * 3 + 2], east[row * 3]);
  for (let column = 0; column < 3; column += 1) assert.equal(north[6 + column], south[column]);
});

test('Terrarium source cache does not let an evicted stale rejection delete its replacement', async () => {
  let calls = 0;
  let rejectFirst;
  let resolveReplacement;
  const firstDeferred = new Promise((_, reject) => { rejectFirst = reject; });
  const replacementDeferred = new Promise((resolve) => { resolveReplacement = resolve; });
  const fetchHeightmap = async (url) => {
    calls += 1;
    if (url.includes('/4/0/0.png')) {
      if (calls === 1) return firstDeferred;
      return replacementDeferred;
    }
    return new Float32Array(4);
  };
  const loader = createTerrariumSourceTileLoader({
    fetchHeightmap,
    urlTemplate: TERRARIUM_URL_TEMPLATE,
    tileSize: 2,
    maximumEntries: 9
  });

  const first = loader(0, 0, 4);
  first.catch(() => {});
  await Promise.all(Array.from({ length: 9 }, (_, index) => loader(index + 1, 0, 4)));
  const replacement = loader(0, 0, 4);
  rejectFirst(new Error('stale request failed'));
  await assert.rejects(first, /stale request failed/);
  const sameReplacement = loader(0, 0, 4);
  assert.equal(sameReplacement, replacement);
  assert.equal(calls, 11);
  resolveReplacement(new Float32Array(4));
  await replacement;
});

test('Terrarium provider returns real Cesium terrain, records relief, and enforces terminal z15', async () => {
  const telemetry = [];
  let fetchCount = 0;
  const provider = createTerrariumTerrainProvider(Cesium, {
    maxLevel: 1,
    sourceTileSize: 2,
    gridSize: 3,
    fetchHeightmap: async (url) => {
      fetchCount += 1;
      assert.match(url, /\/1\/\d+\/\d+\.png$/);
      const heights = new Float32Array([-1000, -1000, 3000, 3000]);
      return { heights, width: 2, height: 2 };
    },
    onTelemetry: (snapshot) => telemetry.push(snapshot),
    retryDelayMs: 0
  });

  const terrain = await provider.requestTileGeometry(0, 0, 1);
  assert.equal(terrain.childTileMask, 0);
  assert.equal(terrain._buffer.length, 9);
  assert.equal(provider.getTileDataAvailable(0, 0, 2), false);
  await assert.rejects(provider.requestTileGeometry(0, 0, 2), /outside the available pyramid/);
  const snapshot = provider.wxglobe.snapshot();
  assert.equal(snapshot.source, 'aws-terrarium');
  assert.equal(snapshot.requested, 1);
  assert.equal(snapshot.loaded, 1);
  assert.equal(snapshot.failed, 0);
  assert.equal(snapshot.inFlight, 0);
  assert.equal(snapshot.maximumLoadedLevel, 1);
  assert.equal(snapshot.lastLoadedTile.level, 1);
  assert.ok(snapshot.minimum < 0);
  assert.ok(snapshot.maximum > 0);
  assert.equal(snapshot.terminalTiles, 1);
  assert.equal(fetchCount, 4, 'a z1 corner requires four unique wrapped/clamped source tiles');
  assert.ok(telemetry.length >= 6);
});

test('Terrarium provider retries boundedly and rethrows terminal tile failures', async () => {
  let attempts = 0;
  const provider = createTerrariumTerrainProvider(Cesium, {
    maxLevel: 1,
    sourceTileSize: 2,
    gridSize: 3,
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
  assert.equal(provider.wxglobe.telemetry.rootTerminalFailures, 1);
  assert.equal(provider.wxglobe.telemetry.inFlight, 0);
});

test('Terrarium provider aborts retired generations without classifying cancellation as failure', async () => {
  const provider = createTerrariumTerrainProvider(Cesium, {
    maxLevel: 0,
    sourceTileSize: 2,
    gridSize: 3,
    fetchHeightmap: async (_url, { signal }) => new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(signal.reason);
        return;
      }
      signal.addEventListener('abort', () => reject(signal.reason), { once: true });
    })
  });

  const pending = provider.requestTileGeometry(0, 0, 0);
  provider.wxglobe.abort();
  await assert.rejects(pending, /aborted/i);
  assert.equal(provider.wxglobe.telemetry.cancellations, 1);
  assert.equal(provider.wxglobe.telemetry.failed, 0);
  assert.equal(provider.wxglobe.telemetry.inFlight, 0);
});

test('public maximum level remains z15 for AWS detail mode', () => {
  assert.equal(TERRARIUM_MAX_LEVEL, 15);
});
