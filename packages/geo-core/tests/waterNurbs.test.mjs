import assert from 'node:assert/strict';
import test from 'node:test';

import { buildWaterNurbsOutlines, WATER_NURBS_LIMITS } from '../src/vector/waterNurbs.js';

test('preserves internal closed water rings as finite exact degree-one NURBS curves', () => {
  const outline = buildWaterNurbsOutlines([
    [[100, 100], [180, 90], [220, 150], [190, 220], [110, 210], [100, 100]],
  ], { tileSize: 512 });
  assert.equal(outline.schemaVersion, 'peercompute.geo.water-nurbs-outlines.v1');
  assert.equal(outline.curveModel, 'NURBS');
  assert.equal(outline.curveCount, 1);
  assert.equal(outline.degree, 1);
  assert.equal(outline.curves[0].degree, 1);
  assert.equal(outline.curves[0].rationalWeights, 'uniform-unit');
  assert.deepEqual(outline.curves[0].points[0], outline.curves[0].points.at(-1));
  assert.ok(outline.curves[0].points.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y)));
});

test('suppresses synthetic clipped tile edges and keeps the remaining shoreline exact', () => {
  const ring = [[0, 10], [80, 12], [90, 80], [0, 90], [0, 10]];
  const outline = buildWaterNurbsOutlines([ring], { tileSize: 512 });
  assert.equal(outline.suppressedBoundarySegmentCount, 1);
  assert.equal(outline.curveCount, 1);
  assert.equal(outline.curves[0].closed, false);
  assert.deepEqual(outline.curves[0].points, [[0, 10], [80, 12], [90, 80], [0, 90]]);
});

test('never downsamples source shorelines and rejects aggregate cap escape', () => {
  const ring = Array.from({ length: 12 }, (_, index) => [100 + index, 100 + (index % 3)]);
  ring.push([...ring[0]]);
  const outline = buildWaterNurbsOutlines([ring], {
    tileSize: 512,
    maximumSourcePointsPerRing: 16,
    maximumSourcePointsPerTile: 16,
    maximumSampledVerticesPerTile: 20,
  });
  assert.equal(outline.sourceControlPointCount, 12);
  assert.equal(outline.omittedSourcePointCount, 0);
  assert.equal(outline.capped, false);
  assert.throws(() => buildWaterNurbsOutlines([ring, ring], {
    tileSize: 512,
    maximumSourcePointsPerRing: 16,
    maximumSourcePointsPerTile: 16,
    maximumSampledVerticesPerTile: 40,
  }), (error) => error?.code === 'ERR_SHORTBREAD_WATER_NURBS_CONTROL_CAP');
  assert.equal(WATER_NURBS_LIMITS.maximumSampledVerticesPerTile, 131_072);
});

test('counts invalid rings instead of inventing a shoreline', () => {
  const outline = buildWaterNurbsOutlines([
    [[1, 1], [2, 2]],
    [[10, 10], [20, 10], [20, 20], [10, 10]],
  ], { tileSize: 512 });
  assert.equal(outline.invalidRingCount, 1);
  assert.equal(outline.curveCount, 1);
});

test('preserves holes and multipolygon rings as separate exact NURBS curves', () => {
  const outline = buildWaterNurbsOutlines([
    [[100, 100], [220, 100], [220, 220], [100, 220], [100, 100]],
    [[140, 140], [180, 140], [180, 180], [140, 180], [140, 140]],
    [[300, 300], [360, 300], [360, 360], [300, 360], [300, 300]],
  ], { tileSize: 512 });
  assert.equal(outline.sourceRingCount, 3);
  assert.equal(outline.validRingCount, 3);
  assert.equal(outline.closedCurveCount, 3);
  assert.equal(outline.openCurveCount, 0);
  assert.equal(outline.maximumSourceDeviationPixels, 0);
  assert.equal(outline.knotModel, 'open-clamped-uniform-per-fragment');
});

test('fully clipped tile boxes emit no false shoreline and two clipped edges split open fragments', () => {
  const fullyClipped = buildWaterNurbsOutlines([
    [[0, 0], [512, 0], [512, 512], [0, 512], [0, 0]],
  ], { tileSize: 512 });
  assert.equal(fullyClipped.curveCount, 0);
  assert.equal(fullyClipped.fullyClippedRingCount, 1);
  assert.equal(fullyClipped.suppressedBoundarySegmentCount, 4);
  assert.equal(fullyClipped.omittedSourcePointCount, 0);

  const split = buildWaterNurbsOutlines([
    [[0, 20], [120, 30], [512, 40], [512, 100], [120, 110], [0, 120], [0, 20]],
  ], { tileSize: 512 });
  assert.equal(split.curveCount, 2);
  assert.equal(split.openCurveCount, 2);
  assert.equal(split.closedCurveCount, 0);
  assert.ok(split.curves.every((curve) => curve.closed === false));
});

test('emits distinct stable codes for every hard NURBS cap', () => {
  const ring = [[100, 100], [200, 100], [200, 200], [100, 200], [100, 100]];
  assert.throws(() => buildWaterNurbsOutlines([ring, ring], {
    tileSize: 512,
    maximumRingsPerTile: 1,
  }), (error) => error?.code === 'ERR_SHORTBREAD_WATER_NURBS_RING_CAP');
  assert.throws(() => buildWaterNurbsOutlines([ring], {
    tileSize: 512,
    maximumSourcePointsPerRing: 3,
  }), (error) => error?.code === 'ERR_SHORTBREAD_WATER_NURBS_RING_POINT_CAP');
  assert.throws(() => buildWaterNurbsOutlines([ring], {
    tileSize: 512,
    maximumSampledVerticesPerTile: 4,
  }), (error) => error?.code === 'ERR_SHORTBREAD_WATER_NURBS_SAMPLE_CAP');
  const splitRing = [[0, 20], [120, 30], [512, 40], [512, 100], [120, 110], [0, 120], [0, 20]];
  assert.throws(() => buildWaterNurbsOutlines([splitRing], {
    tileSize: 512,
    maximumCurvesPerTile: 1,
  }), (error) => error?.code === 'ERR_SHORTBREAD_WATER_NURBS_CURVE_CAP');
});
