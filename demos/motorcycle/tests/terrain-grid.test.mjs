import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createDerivedFlatTerrainGrid,
  createTerrariumHeightmapCache,
  createTerrainGrid,
  loadTerrariumTerrainTile,
  loadTerrariumTerrainGrid,
  MOTORCYCLE_RIDE_TERRAIN_GRID_SIZE,
  MOTORCYCLE_RIDE_TERRAIN_SOURCE_HALO_PIXELS,
  MOTORCYCLE_TERRAIN_MAXIMUM_SOURCE_TILES,
} from '../src/world/terrainGrid.js';
import { createRoadTerrainSurface } from '../src/world/roadSurfaceCollider.js';

const BBOX = [61.21, -149.92, 61.23, -149.88];

test('decoded Terrarium cache coalesces halo reads, isolates aborts, and evicts by bounded LRU', async () => {
  const calls = new Map();
  let releaseFirst;
  const cache = createTerrariumHeightmapCache({
    maximumEntries: 2,
    fetchImpl: async () => { throw new Error('fetchImpl must remain behind the injected decoder'); },
    fetchHeightmap: async (url) => {
      calls.set(url, (calls.get(url) ?? 0) + 1);
      if (url === 'tile-a' && calls.get(url) === 1) {
        await new Promise((resolve) => { releaseFirst = resolve; });
      }
      return {
        width: 256,
        height: 256,
        heights: new Float32Array(256 * 256).fill(url.length),
      };
    },
  });
  const aborted = new AbortController();
  const first = cache.load('tile-a', { signal: aborted.signal });
  const coalesced = cache.load('tile-a');
  await Promise.resolve();
  aborted.abort();
  releaseFirst();
  await assert.rejects(first, { name: 'AbortError' });
  const a = await coalesced;
  assert.ok(a.heights instanceof Float32Array);
  assert.equal(calls.get('tile-a'), 1);
  assert.strictEqual(await cache.load('tile-a'), a);
  const b = await cache.load('tile-b');
  assert.equal(b.heights[0], 'tile-b'.length);
  assert.strictEqual(await cache.load('tile-a'), a, 'cache hit refreshes LRU age');
  await cache.load('tile-c');
  assert.equal(cache.getTelemetry().entries, 2);
  assert.equal(cache.getTelemetry().evictions, 1);
  await cache.load('tile-b');
  assert.equal(calls.get('tile-b'), 2, 'least-recent decoded heightmap was evicted');
  const telemetry = cache.getTelemetry();
  assert.equal(telemetry.schemaVersion, 'peercompute.motorcycle.terrarium-decoded-cache.v1');
  assert.equal(telemetry.yjsReplicated, false);
  assert.equal(telemetry.misses, 4);
  assert.equal(telemetry.coalesced, 1);
  assert.ok(telemetry.hits >= 2);
  assert.equal(telemetry.callerAborts, 1);
  assert.ok(telemetry.residentBytes <= telemetry.maximumResidentBytes);
  assert.equal(cache.destroy(), true);
  assert.equal(cache.destroy(), false);
  await assert.rejects(cache.load('tile-a'), /destroyed/);
});

test('decoded Terrarium cache owns exact bytes and fences orphaned or late work', async () => {
  const deferred = new Map();
  const cache = createTerrariumHeightmapCache({
    maximumEntries: 1,
    fetchImpl: async () => { throw new Error('fetchImpl must remain behind the injected decoder'); },
    fetchHeightmap: (url) => new Promise((resolve) => deferred.set(url, resolve)),
  });
  const firstController = new AbortController();
  const first = cache.load('tile-a', { signal: firstController.signal });
  await Promise.resolve();
  await assert.rejects(cache.load('tile-b'), (error) => (
    error?.code === 'ERR_MOTORCYCLE_TERRARIUM_CACHE_BUSY'
    && error.retryable === true
    && error.transient === true
  ));
  firstController.abort();
  await assert.rejects(first, { name: 'AbortError' });

  const second = cache.load('tile-b');
  await Promise.resolve();
  const oversizedBacking = new ArrayBuffer(256 * 256 * Float64Array.BYTES_PER_ELEMENT + 4096);
  deferred.get('tile-b')({
    width: 256,
    height: 256,
    heights: new Float64Array(oversizedBacking, 0, 256 * 256),
  });
  const admitted = await second;
  assert.ok(admitted.heights instanceof Float32Array);
  assert.equal(admitted.heights.buffer.byteLength, 256 * 256 * Float32Array.BYTES_PER_ELEMENT);
  assert.equal(cache.getTelemetry().residentBytes, cache.getTelemetry().maximumResidentBytes);
  deferred.get('tile-a')({
    width: 256,
    height: 256,
    heights: new Float32Array(256 * 256),
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(cache.getTelemetry().orphanAborts, 1);
  assert.equal(cache.getTelemetry().lateDiscards, 1);

  let resolveLate;
  const lateCache = createTerrariumHeightmapCache({
    fetchImpl: async () => { throw new Error('fetchImpl must remain behind the injected decoder'); },
    fetchHeightmap: () => new Promise((resolve) => { resolveLate = resolve; }),
  });
  const pending = lateCache.load('tile-late');
  await Promise.resolve();
  assert.equal(lateCache.destroy(), true);
  resolveLate({
    width: 256,
    height: 256,
    heights: new Float32Array(256 * 256),
  });
  await assert.rejects(pending, { name: 'AbortError' });
  assert.equal(lateCache.getTelemetry().entries, 0);
  assert.equal(lateCache.getTelemetry().residentBytes, 0);
  assert.equal(lateCache.getTelemetry().lateDiscards, 1);
  cache.destroy();
});

test('builds a finite WGS84-to-local real-height grid and render-mesh sampler', () => {
  const heights = Float32Array.from([
    100, 101, 102,
    110, 111, 112,
    120, 121, 122,
  ]);
  const terrain = createTerrainGrid({ bbox: BBOX, width: 3, height: 3, heights });
  assert.equal(terrain.schemaVersion, 'peercompute.geo.local-terrain-grid.v1');
  assert.equal(terrain.referenceHeight, 111);
  assert.equal(terrain.positions.length, 27);
  assert.ok([...terrain.positions].every(Number.isFinite));
  assert.ok(Math.abs(terrain.sampleRawHeight(-149.9, 61.22) - 111) < 1e-6);
  assert.ok(Math.abs(terrain.sampleLocalHeight(0, 0)) < 0.05);
  assert.ok(terrain.sampleLocalNormal(0, 0).every(Number.isFinite));
  assert.equal(terrain.surfaceIndex.schemaVersion, 'peercompute.geo.local-surface-index.v1');
  assert.equal(terrain.surfaceIndex.coordinateModel, 'local-xz-triangle-aabb-grid');
  assert.equal(terrain.surfaceIndex.geodeticInversionPerQuery, false);
  assert.equal(terrain.surfaceIndex.triangleCount, 8);
  assert.ok(terrain.surfaceIndex.referenceCount >= terrain.surfaceIndex.triangleCount);
  assert.ok(terrain.surfaceIndex.maximumCandidatesPerBin > 0);
  assert.equal(terrain.source.authoritative, true);
  assert.equal(terrain.source.operationalUse, false);
});

test('physics terrain samples the exact rendered triangle plane, including a center spike', () => {
  const terrain = createTerrainGrid({
    bbox: BBOX,
    width: 3,
    height: 3,
    heights: Float32Array.from([
      0, 0, 0,
      0, 20, 0,
      0, 0, 0,
    ]),
  });
  const triangleIndices = [
    [0, 1, 3], [1, 4, 3],
    [1, 2, 4], [2, 5, 4],
    [3, 4, 6], [4, 7, 6],
    [4, 5, 7], [5, 8, 7],
  ];
  for (const triangle of triangleIndices) {
    const points = triangle.map((index) => terrain.positions.slice(index * 3, index * 3 + 3));
    const x = points.reduce((sum, point) => sum + point[0], 0) / 3;
    const z = points.reduce((sum, point) => sum + point[2], 0) / 3;
    const expected = points.reduce((sum, point) => sum + point[1], 0) / 3;
    const sample = terrain.sampleLocalSurface(x, z);
    assert.ok(sample, `missing triangle sample for ${triangle}`);
    assert.ok(Math.abs(sample.height - expected) < 1e-4, `${sample.height} != ${expected}`);
    assert.ok(sample.normal.every(Number.isFinite));
    assert.ok(sample.normal[1] > 0);
  }

  const surface = createRoadTerrainSurface(terrain);
  const center = terrain.positions.slice(4 * 3, 4 * 3 + 3);
  const sample = surface.sampleSphere({
    center: [center[0], center[1] + 0.1, center[2]],
    radius: 0.2,
  });
  assert.equal(sample.hit, true);
  assert.ok(Math.abs(terrain.sampleLocalHeight(center[0], center[2]) - center[1]) < 1e-4);
  assert.strictEqual(
    terrain.sampleLocalSurface(center[0], center[2]),
    terrain.sampleLocalSurface(center[0], center[2]),
    'identical height/normal queries reuse the exact immutable surface sample',
  );
  assert.equal(terrain.sampleLocalSurface(terrain.localBounds.maxX + 1, center[2]), null);
  assert.equal(terrain.sampleLocalSurface(terrain.localBounds.maxX + 1, center[2]), null);
});

test('elevated mesh edges and diagonal seams resolve through neighboring projected cells', () => {
  const width = 65;
  const height = 65;
  const heights = Float32Array.from({ length: width * height }, (_, index) => {
    const row = Math.floor(index / width);
    const column = index % width;
    return row / (height - 1) * 500 + column / (width - 1) * 250;
  });
  const terrain = createTerrainGrid({ bbox: BBOX, width, height, heights });
  const weights = [
    [0.999998, 0.000001, 0.000001],
    [0.000001, 0.999998, 0.000001],
    [0.000001, 0.000001, 0.999998],
    [0.499999, 0.499999, 0.000002],
    [0.499999, 0.000002, 0.499999],
    [0.000002, 0.499999, 0.499999],
  ];
  for (let row = 0; row < height - 1; row += 1) {
    for (let column = 0; column < width - 1; column += 1) {
      const a = row * width + column;
      const b = a + 1;
      const c = a + width;
      const d = c + 1;
      for (const triangle of [[a, b, c], [b, d, c]]) {
        const points = triangle.map((index) => terrain.positions.slice(index * 3, index * 3 + 3));
        for (const barycentric of weights) {
          const point = [0, 0, 0];
          for (let vertex = 0; vertex < 3; vertex += 1) {
            for (let axis = 0; axis < 3; axis += 1) {
              point[axis] += points[vertex][axis] * barycentric[vertex];
            }
          }
          const sample = terrain.sampleLocalSurface(point[0], point[2]);
          assert.ok(sample, `missing ${row},${column}/${triangle}/${barycentric}`);
          assert.ok(Math.abs(sample.height - point[1]) <= 1e-4);
          assert.ok(sample.normal.every(Number.isFinite));
          assert.ok(sample.normal[1] > 0);
        }
      }
    }
  }
});

test('derived flat fallback is explicit and produces a bounded physics surface', () => {
  const terrain = createDerivedFlatTerrainGrid({ bbox: BBOX, heightMeters: 35 });
  assert.equal(terrain.source.authoritative, false);
  assert.equal(terrain.source.derived, true);
  const surface = createRoadTerrainSurface(terrain);
  const sample = surface.sampleSphere({ center: [0, 0.1, 0], radius: 0.2 });
  assert.equal(sample.hit, true);
  assert.equal(surface.metadata.derivedTerrain, true);
  assert.equal(surface.metadata.operationalUse, false);
});

test('loads a bounded Terrarium tile set into the exact local render/collision grid', async () => {
  const requests = [];
  const terrain = await loadTerrariumTerrainGrid({
    bbox: BBOX,
    width: 5,
    height: 5,
    fetchHeightmap: async (url) => {
      requests.push(url);
      const heights = Float32Array.from(
        { length: 256 * 256 },
        (_, index) => Math.floor(index / 256) * 0.5 + (index % 256) * 0.25,
      );
      return { heights, width: 256, height: 256 };
    },
    clock: () => new Date('2026-08-24T18:00:00.000Z'),
  });
  assert.ok(requests.length > 0);
  assert.ok(requests.length <= MOTORCYCLE_TERRAIN_MAXIMUM_SOURCE_TILES);
  assert.ok(requests.every((url) => /^https:\/\/elevation-tiles-prod\.s3\.amazonaws\.com\/terrarium\/12\//u.test(url)));
  assert.equal(terrain.source.id, 'aws-terrarium');
  assert.equal(terrain.source.derived, false);
  assert.equal(terrain.source.fetchedAt, '2026-08-24T18:00:00.000Z');
  assert.equal(terrain.heights.length, 25);
  assert.ok([...terrain.heights].every(Number.isFinite));
  assert.ok(Math.max(...terrain.heights) > Math.min(...terrain.heights));
  assert.ok(Number.isFinite(terrain.sampleLocalHeight(0, 0)));
});

test('rejects malformed grids instead of inventing source geometry', () => {
  assert.throws(() => createTerrainGrid({ bbox: [0, 1, 0, 2], width: 3, height: 3, heights: new Float32Array(9) }), /ordered/);
  assert.throws(() => createTerrainGrid({ bbox: BBOX, width: 3, height: 3, heights: new Float32Array(8) }), /requires 9/);
  assert.throws(() => createTerrainGrid({ bbox: BBOX, width: 2, height: 3, heights: new Float32Array(6) }), /between 3 and 129/);
});

function globalPostHeightmap(url) {
  const match = /\/terrarium\/(\d+)\/(\d+)\/(\d+)\.png$/u.exec(url);
  assert.ok(match, `unexpected Terrarium URL ${url}`);
  const [, , xText, yText] = match;
  const tileX = Number(xText);
  const tileY = Number(yText);
  return {
    width: 256,
    height: 256,
    heights: Float32Array.from({ length: 256 * 256 }, (_, index) => {
      const row = Math.floor(index / 256);
      const column = index % 256;
      return (tileX * 256 + column) * 0.25 + (tileY * 256 + row) * 0.125;
    }),
  };
}

test('loads a wrapped deterministic ride tile with bounded source halo and resources', async () => {
  const requests = [];
  let activeSourceRequests = 0;
  let maximumSourceRequests = 0;
  const terrain = await loadTerrariumTerrainTile({
    tile: { z: 12, x: -1, y: 1300 },
    fetchHeightmap: async (url) => {
      requests.push(url);
      activeSourceRequests += 1;
      maximumSourceRequests = Math.max(maximumSourceRequests, activeSourceRequests);
      await new Promise((resolve) => setImmediate(resolve));
      const heightmap = globalPostHeightmap(url);
      activeSourceRequests -= 1;
      return heightmap;
    },
    clock: () => new Date('2026-08-25T22:00:00.000Z'),
  });
  assert.equal(terrain.rideTile.key, '12/4095/1300');
  const expandedSize = MOTORCYCLE_RIDE_TERRAIN_GRID_SIZE
    + MOTORCYCLE_RIDE_TERRAIN_SOURCE_HALO_PIXELS * 2;
  assert.equal(terrain.width, expandedSize);
  assert.equal(terrain.height, expandedSize);
  assert.equal(terrain.halo.sourcePixels, 2);
  assert.equal(terrain.halo.geometryOverlapVertices, 1);
  assert.equal(terrain.halo.edgeModel, 'overlapped-shared-half-pixel-terrarium-posts');
  assert.equal(terrain.source.fetchedAt, '2026-08-25T22:00:00.000Z');
  assert.ok(requests.length > 0);
  assert.ok(requests.length <= MOTORCYCLE_TERRAIN_MAXIMUM_SOURCE_TILES);
  assert.equal(maximumSourceRequests, 1, 'one tile loader cannot multiply outer stream concurrency');
  assert.equal(terrain.sourceTiles.length, requests.length);
  assert.equal(new Set(terrain.sourceTiles.map((source) => source.key)).size, requests.length);
  assert.ok(terrain.sourceTiles.some((source) => source.x === 0));
  assert.equal(terrain.resource.vertexCount, expandedSize ** 2);
  assert.ok(terrain.resource.residentBytes > terrain.heights.byteLength + terrain.positions.byteLength);
  assert.equal(terrain.resource.triangleCount, (expandedSize - 1) ** 2 * 2);
});

test('adjacent ride terrain chunks share exact half-pixel boundary heights', async () => {
  const options = {
    fetchHeightmap: async (url) => globalPostHeightmap(url),
    clock: () => new Date('2026-08-25T22:00:00.000Z'),
  };
  const [left, right] = await Promise.all([
    loadTerrariumTerrainTile({ tile: { z: 14, x: 1300, y: 4600 }, ...options }),
    loadTerrariumTerrainTile({ tile: { z: 14, x: 1301, y: 4600 }, ...options }),
  ]);
  assert.notStrictEqual(left.frame, right.frame);
  const halo = MOTORCYCLE_RIDE_TERRAIN_SOURCE_HALO_PIXELS;
  const leftCoreEast = halo + MOTORCYCLE_RIDE_TERRAIN_GRID_SIZE - 1;
  const rightCoreWest = halo;
  for (let row = 0; row < left.height; row += 1) {
    const leftHeight = left.heights[row * left.width + leftCoreEast];
    const rightHeight = right.heights[row * right.width + rightCoreWest];
    assert.equal(leftHeight, rightHeight, `core row ${row}`);
    assert.equal(
      left.heights[row * left.width + left.width - 1],
      right.heights[row * right.width + rightCoreWest + 1],
      `east overlap row ${row}`,
    );
    assert.equal(
      right.heights[row * right.width],
      left.heights[row * left.width + leftCoreEast - 1],
      `west overlap row ${row}`,
    );
  }
});

test('one decoded cache reduces a 5x5 ride window from 225 halo reads to 49 PNG decodes', async () => {
  let sourceDecodes = 0;
  const cache = createTerrariumHeightmapCache({
    maximumEntries: 64,
    fetchImpl: async () => { throw new Error('fetchImpl must remain behind the injected decoder'); },
    fetchHeightmap: async (url) => {
      sourceDecodes += 1;
      return globalPostHeightmap(url);
    },
  });
  const logicalTiles = [];
  for (let yOffset = -2; yOffset <= 2; yOffset += 1) {
    for (let xOffset = -2; xOffset <= 2; xOffset += 1) {
      logicalTiles.push({ z: 14, x: 1300 + xOffset, y: 4600 + yOffset });
    }
  }
  const terrains = await Promise.all(logicalTiles.map((tile) => loadTerrariumTerrainTile({
    tile,
    fetchHeightmap: cache.load,
    clock: () => new Date('2026-08-25T22:00:00.000Z'),
  })));
  assert.equal(terrains.reduce((sum, terrain) => sum + terrain.sourceTiles.length, 0), 225);
  assert.equal(sourceDecodes, 49);
  const telemetry = cache.getTelemetry();
  assert.equal(telemetry.entries, 49);
  assert.equal(telemetry.residentEntries, 49);
  assert.equal(telemetry.misses, 49);
  assert.equal(telemetry.hits + telemetry.coalesced, 225 - 49);
  assert.ok(telemetry.residentBytes <= telemetry.maximumResidentBytes);
  assert.ok(terrains.every((terrain) => [...terrain.heights].every(Number.isFinite)));
  cache.destroy();
});
