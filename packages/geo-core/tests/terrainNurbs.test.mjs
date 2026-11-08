import assert from 'node:assert/strict';
import test from 'node:test';
import * as Cesium from 'cesium';

import { createCappedHeightmapTerrainProvider } from '../src/terrain/cappedHeightmapProvider.js';
import { createEtopo2022TerrainProvider } from '../src/terrain/etopo2022.js';
import {
  TERRAIN_NURBS_LIMITS,
  buildTerrainNurbsContours,
} from '../src/terrain/terrainNurbs.js';
import { createTerrariumTerrainProvider } from '../src/terrain/terrarium.js';

test('flat finite terrain emits no invented contour geometry', () => {
  const result = buildTerrainNurbsContours(new Float32Array(9).fill(42), {
    width: 3,
    height: 3,
    contourSpacingMeters: 10,
  });

  assert.equal(result.schemaVersion, 'peercompute.geo.terrain-nurbs-contours.v1');
  assert.equal(result.curveModel, 'NURBS');
  assert.equal(result.degree, 1);
  assert.equal(result.minimumSourceElevationMeters, 42);
  assert.equal(result.maximumSourceElevationMeters, 42);
  assert.equal(result.paths.length, 0);
  assert.equal(result.telemetry.pathCount, 0);
  assert.equal(result.telemetry.segmentCount, 0);
  assert.equal(result.maximumPathDisplacementGridUnits, 0);
  assert.equal(result.maximumElevationDisplacementMeters, 0);
  assert.equal(Object.isFrozen(result), true);
  assert.throws(() => buildTerrainNurbsContours([0, 1, Number.NaN, 2], {
    width: 2,
    height: 2,
  }), /must be finite/);
});

test('crossing-zero terrain classifies exact degree-one paths above and at-or-below zero', () => {
  const result = buildTerrainNurbsContours(new Float32Array([
    -2, 2,
    -2, 2,
  ]), {
    width: 2,
    height: 2,
    contourSpacingMeters: 1,
  });

  assert.ok(result.paths.some((path) => path.classification === 'above-zero'));
  assert.ok(result.paths.some((path) => path.elevationMeters === 0));
  assert.ok(result.paths.some((path) => path.elevationMeters < 0));
  assert.ok(result.telemetry.aboveZeroPathCount > 0);
  assert.ok(result.telemetry.atOrBelowZeroPathCount > 0);
  for (const path of result.paths) {
    assert.equal(path.degree, 1);
    assert.equal(path.rationalWeights, 'uniform-unit');
    assert.equal(path.knotModel, 'open-clamped-uniform');
    assert.equal(path.segmentCount, path.controlPointCount - 1);
    for (const point of path.points) {
      assert.ok(Number.isFinite(point.gridRow));
      assert.ok(Number.isFinite(point.gridColumn));
      assert.equal(point.sourceElevationMeters, path.elevationMeters);
    }
  }
});

test('fixed Cesium two-triangle topology resolves saddles and preserves shared-edge seams', () => {
  const saddle = buildTerrainNurbsContours(new Float32Array([
    1, -1,
    -1, 1,
  ]), {
    width: 2,
    height: 2,
    contourSpacingMeters: 2,
  });
  assert.equal(saddle.saddleResolution, 'fixed-lower-left-to-upper-right-diagonal');
  assert.equal(saddle.paths.length, 2);
  assert.deepEqual(saddle.paths.map((path) => path.points), [
    [
      { gridRow: 0, gridColumn: 0.5, sourceElevationMeters: 0 },
      { gridRow: 0.5, gridColumn: 0, sourceElevationMeters: 0 },
    ],
    [
      { gridRow: 0.5, gridColumn: 1, sourceElevationMeters: 0 },
      { gridRow: 1, gridColumn: 0.5, sourceElevationMeters: 0 },
    ],
  ]);

  const seamGrid = new Float32Array([
    -1, -1,
    1, 1,
  ]);
  const west = buildTerrainNurbsContours(seamGrid, {
    width: 2,
    height: 2,
    contourSpacingMeters: 2,
  });
  const east = buildTerrainNurbsContours(seamGrid, {
    width: 2,
    height: 2,
    contourSpacingMeters: 2,
  });
  const westSeam = west.paths[0].points.find((point) => point.gridColumn === 1);
  const eastSeam = east.paths[0].points.find((point) => point.gridColumn === 0);
  assert.deepEqual(
    [westSeam.gridRow, westSeam.sourceElevationMeters],
    [eastSeam.gridRow, eastSeam.sourceElevationMeters],
  );
});

test('spacing adapts to bounded contour levels and irreducible geometry caps fail explicitly', () => {
  const adapted = buildTerrainNurbsContours(new Float32Array([
    -100, 100,
    -100, 100,
  ]), {
    width: 2,
    height: 2,
    contourSpacingMeters: 1,
    maximumContourLevelsPerTile: 3,
  });
  assert.equal(adapted.adapted, true);
  assert.ok(adapted.contourSpacingMeters > 1);
  assert.ok(adapted.telemetry.candidateContourLevelCount <= 3);
  assert.deepEqual(adapted.telemetry.adaptationReasons, ['contour-level-cap']);

  assert.throws(() => buildTerrainNurbsContours(new Float32Array([
    1, -1,
    -1, 1,
  ]), {
    width: 2,
    height: 2,
    contourSpacingMeters: 2,
    maximumSegmentsPerTile: 1,
    maximumAdaptationPasses: 2,
  }), (error) => error?.code === 'ERR_TERRAIN_NURBS_SEGMENT_CAP');

  assert.throws(() => buildTerrainNurbsContours(new Float32Array(9), {
    width: 3,
    height: 3,
    maximumGridSamples: 8,
  }), (error) => error?.code === 'ERR_TERRAIN_NURBS_GRID_CAP');
  assert.equal(TERRAIN_NURBS_LIMITS.maximumGridSamples, 262_144);
});

test('finite contour output is deterministic with no resampling or omitted geometry', () => {
  const heights = new Float64Array([
    -7, -2, 4, 9,
    -5, 1, 6, 12,
    -3, 3, 8, 14,
    -1, 5, 10, 16,
  ]);
  const options = { width: 4, height: 4, contourSpacingMeters: 3 };
  const first = buildTerrainNurbsContours(heights, options);
  const second = buildTerrainNurbsContours(heights, options);
  assert.deepEqual(first, second);
  assert.equal(first.capped, false);
  assert.equal(first.telemetry.omittedPathCount, 0);
  assert.equal(first.telemetry.omittedSegmentCount, 0);
  assert.equal(first.telemetry.controlPointCount, first.paths.reduce(
    (count, path) => count + path.points.length,
    0,
  ));
  assert.ok(first.paths.flatMap((path) => path.points).every((point) => (
    Number.isFinite(point.gridRow)
    && Number.isFinite(point.gridColumn)
    && Number.isFinite(point.sourceElevationMeters)
  )));
});

class FakeEvent {}
class FakeCredit {
  constructor(html) { this.html = html; }
}
class FakeHeightmapTerrainData {
  constructor(options) { Object.assign(this, options); }
}

const FakeCesium = {
  Event: FakeEvent,
  Credit: FakeCredit,
  HeightmapTerrainData: FakeHeightmapTerrainData,
  TerrainProvider: {
    getEstimatedLevelZeroGeometricErrorForAHeightmap: () => 1,
  },
};

const fakeTilingScheme = {
  ellipsoid: {},
  getNumberOfXTilesAtLevel: (level) => 2 ** (level + 1),
  getNumberOfYTilesAtLevel: (level) => 2 ** level,
};

test('successful heightmap observer receives exact metadata and cannot corrupt terrain delivery', async () => {
  const observations = [];
  const provider = createCappedHeightmapTerrainProvider(FakeCesium, {
    callback: () => [1, 2, 3, 4],
    width: 2,
    height: 2,
    tilingScheme: fakeTilingScheme,
    maximumLevel: 0,
    onHeightmap: (metadata) => observations.push(metadata),
  });
  const terrain = await provider.requestTileGeometry(1, 0, 0);
  assert.equal(observations.length, 1);
  assert.deepEqual({
    x: observations[0].x,
    y: observations[0].y,
    level: observations[0].level,
    width: observations[0].width,
    height: observations[0].height,
  }, { x: 1, y: 0, level: 0, width: 2, height: 2 });
  assert.equal(observations[0].heights, terrain.buffer);
  assert.ok(observations[0].heights instanceof Float64Array);
  assert.equal(observations[0].tilingScheme, fakeTilingScheme);

  const throwing = createCappedHeightmapTerrainProvider(FakeCesium, {
    callback: () => new Float32Array([5, 6, 7, 8]),
    width: 2,
    height: 2,
    tilingScheme: fakeTilingScheme,
    maximumLevel: 0,
    onHeightmap: () => { throw new Error('observer failed'); },
  });
  assert.deepEqual([...(await throwing.requestTileGeometry(0, 0, 0)).buffer], [5, 6, 7, 8]);

  const rejecting = createCappedHeightmapTerrainProvider(FakeCesium, {
    callback: () => new Float32Array([9, 10, 11, 12]),
    width: 2,
    height: 2,
    tilingScheme: fakeTilingScheme,
    maximumLevel: 0,
    onHeightmap: async () => { throw new Error('async observer failed'); },
  });
  assert.deepEqual([...(await rejecting.requestTileGeometry(0, 0, 0)).buffer], [9, 10, 11, 12]);
  await Promise.resolve();
});

test('ETOPO and Terrarium factories plumb exact successful heightmap metadata', async () => {
  const etopoObservations = [];
  const etopo = createEtopo2022TerrainProvider(Cesium, {
    maxLevel: 2,
    tileSize: 3,
    boundaryCacheSize: 16,
    retryAttempts: 1,
    fetchHeightmap: async () => new Float32Array([
      -4, -3, -2,
      -1, 0, 1,
      2, 3, 4,
    ]),
    fetchSamples: async () => { throw new Error('interior fixture must not stitch boundaries'); },
    onHeightmap: (metadata) => etopoObservations.push(metadata),
  });
  const etopoTerrain = await etopo.requestTileGeometry(2, 1, 2);
  assert.equal(etopoObservations.length, 1);
  assert.deepEqual(
    [etopoObservations[0].x, etopoObservations[0].y, etopoObservations[0].level],
    [2, 1, 2],
  );
  assert.equal(etopoObservations[0].width, 3);
  assert.equal(etopoObservations[0].height, 3);
  assert.equal(etopoObservations[0].heights, etopoTerrain._buffer);
  assert.equal(etopoObservations[0].tilingScheme, etopo.tilingScheme);

  const terrariumObservations = [];
  const terrarium = createTerrariumTerrainProvider(Cesium, {
    maxLevel: 1,
    sourceTileSize: 2,
    gridSize: 3,
    retryAttempts: 1,
    fetchHeightmap: async () => ({
      heights: new Float32Array([-8, -4, 4, 8]),
      width: 2,
      height: 2,
    }),
    onHeightmap: (metadata) => terrariumObservations.push(metadata),
  });
  const terrariumTerrain = await terrarium.requestTileGeometry(0, 0, 1);
  assert.equal(terrariumObservations.length, 1);
  assert.deepEqual(
    [terrariumObservations[0].x, terrariumObservations[0].y, terrariumObservations[0].level],
    [0, 0, 1],
  );
  assert.equal(terrariumObservations[0].width, 3);
  assert.equal(terrariumObservations[0].height, 3);
  assert.equal(terrariumObservations[0].heights, terrariumTerrain._buffer);
  assert.equal(terrariumObservations[0].tilingScheme, terrarium.tilingScheme);
});
