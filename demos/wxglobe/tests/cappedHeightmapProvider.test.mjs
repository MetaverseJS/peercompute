import test from 'node:test';
import assert from 'node:assert/strict';
import { createCappedHeightmapTerrainProvider } from '../src/terrain/cappedHeightmapProvider.js';

class FakeEvent {}
class FakeCredit {
  constructor(html) {
    this.html = html;
  }
}
class FakeHeightmapTerrainData {
  constructor(options) {
    Object.assign(this, options);
  }
}

const Cesium = {
  Event: FakeEvent,
  Credit: FakeCredit,
  HeightmapTerrainData: FakeHeightmapTerrainData,
  TerrainProvider: {
    getEstimatedLevelZeroGeometricErrorForAHeightmap: (_ellipsoid, width, xTiles) => width / xTiles
  }
};

const tilingScheme = {
  ellipsoid: {},
  getNumberOfXTilesAtLevel: (level) => 2 ** (level + 1),
  getNumberOfYTilesAtLevel: (level) => 2 ** level
};

test('capped heightmap provider publishes terminal child masks and availability', async () => {
  const requests = [];
  const provider = createCappedHeightmapTerrainProvider(Cesium, {
    callback: (x, y, level) => {
      requests.push({ x, y, level });
      return new Float32Array([1, 2, 3, 4]);
    },
    width: 2,
    height: 2,
    tilingScheme,
    credit: 'terrain credit',
    maximumLevel: 2
  });

  assert.equal(provider.getTileDataAvailable(0, 0, 2), true);
  assert.equal(provider.getTileDataAvailable(0, 0, 3), false);
  assert.equal(provider.getTileDataAvailable(-1, 0, 0), false);
  assert.equal(provider.getTileDataAvailable(2, 0, 0), false);
  assert.equal((await provider.requestTileGeometry(0, 0, 1)).childTileMask, 15);
  assert.equal((await provider.requestTileGeometry(0, 0, 2)).childTileMask, 0);
  assert.deepEqual(requests, [{ x: 0, y: 0, level: 1 }, { x: 0, y: 0, level: 2 }]);
  await assert.rejects(provider.requestTileGeometry(0, 0, 3), /outside the available pyramid/);
  assert.equal(requests.length, 2, 'unavailable levels must never reach the source callback');
  assert.equal(provider.credit.html, 'terrain credit');
  assert.equal(provider.getLevelMaximumGeometricError(1), 0.5);
});

test('capped heightmap provider validates callback output before creating terrain data', async () => {
  const provider = createCappedHeightmapTerrainProvider(Cesium, {
    callback: () => new Float32Array(3),
    width: 2,
    height: 2,
    tilingScheme,
    maximumLevel: 0
  });

  await assert.rejects(provider.requestTileGeometry(0, 0, 0), /exactly 4 typed height samples/);
});
