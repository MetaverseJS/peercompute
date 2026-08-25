import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildLandSideNurbsCompanions,
  buildWaterNurbsOutlines,
  SHORELINE_LANDLINE_LIMITS,
  WATER_NURBS_LIMITS,
} from '../src/vector/waterNurbs.js';

test('preserves internal closed water rings as finite exact degree-one NURBS curves', () => {
  const outline = buildWaterNurbsOutlines([
    [[100, 100], [180, 90], [220, 150], [190, 220], [110, 210], [100, 100]],
  ], { tileSize: 512 });
  assert.equal(outline.schemaVersion, 'peercompute.geo.water-nurbs-outlines.v1');
  assert.equal(outline.curveModel, 'NURBS');
  assert.equal(outline.curveCount, 1);
  assert.equal(outline.degree, 1);
  assert.equal(outline.curves[0].degree, 1);
  assert.equal(outline.curves[0].sourceRingIndex, 0);
  assert.deepEqual(outline.curves[0].sourceSegmentIndices, [0, 1, 2, 3, 4]);
  assert.equal(outline.curves[0].boundaryStart, false);
  assert.equal(outline.curves[0].boundaryEnd, false);
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
  assert.equal(outline.curves[0].boundaryStart, true);
  assert.equal(outline.curves[0].boundaryEnd, true);
  assert.deepEqual(outline.curves[0].sourceSegmentIndices, [0, 1, 2]);
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

function companionForRing(points, role, options = {}) {
  const outline = buildWaterNurbsOutlines([points], { tileSize: 512 });
  return buildLandSideNurbsCompanions(outline, [{
    points,
    role,
    waterBodyId: 'water-body-test',
  }], {
    tile: { x: 4, y: 5, z: 4, size: 512 },
    ...options,
  });
}

test('builds distinct green-side control polygons independently of outer-ring winding', () => {
  const clockwise = [[100, 100], [100, 220], [220, 220], [220, 100], [100, 100]];
  const counterclockwise = [...clockwise].reverse();
  const clockwiseCompanion = companionForRing(clockwise, 'outer');
  const counterclockwiseCompanion = companionForRing(counterclockwise, 'outer');
  assert.equal(clockwiseCompanion.schemaVersion, 'peercompute.geo.shoreline-landline.v1');
  assert.equal(clockwiseCompanion.curveCount, 1);
  assert.equal(clockwiseCompanion.pairedCurveCount, 1);
  assert.equal(clockwiseCompanion.unpairedCurveCount, 0);
  assert.equal(clockwiseCompanion.outerPairCount, 1);
  assert.equal(clockwiseCompanion.holePairCount, 0);
  assert.equal(clockwiseCompanion.requestedOffsetPixels, 2);
  assert.equal(clockwiseCompanion.curves[0].ringRole, 'outer');
  assert.equal(clockwiseCompanion.curves[0].waterBodyId, 'water-body-test');
  const bounds = (curve) => ({
    west: Math.min(...curve.points.map(([x]) => x)),
    north: Math.min(...curve.points.map(([, y]) => y)),
    east: Math.max(...curve.points.map(([x]) => x)),
    south: Math.max(...curve.points.map(([, y]) => y)),
  });
  assert.deepEqual(bounds(clockwiseCompanion.curves[0]), bounds(counterclockwiseCompanion.curves[0]));
  assert.deepEqual(bounds(clockwiseCompanion.curves[0]), {
    west: 98,
    north: 98,
    east: 222,
    south: 222,
  });
});

test('offsets ocean and inland-water holes toward island land for either winding', () => {
  const hole = [[140, 140], [180, 140], [180, 180], [140, 180], [140, 140]];
  const forward = companionForRing(hole, 'hole');
  const reversed = companionForRing([...hole].reverse(), 'hole');
  const bounds = (curve) => ({
    west: Math.min(...curve.points.map(([x]) => x)),
    north: Math.min(...curve.points.map(([, y]) => y)),
    east: Math.max(...curve.points.map(([x]) => x)),
    south: Math.max(...curve.points.map(([, y]) => y)),
  });
  assert.deepEqual(bounds(forward.curves[0]), bounds(reversed.curves[0]));
  assert.deepEqual(bounds(forward.curves[0]), {
    west: 142,
    north: 142,
    east: 178,
    south: 178,
  });
  assert.equal(forward.holePairCount, 1);
  assert.equal(forward.curves[0].degree, 1);
  assert.equal(forward.linePassesPerCurve, 1);
  assert.equal(forward.glow, false);
  assert.equal(forward.halo, false);
  assert.equal(forward.rasterPainted, false);
});

test('tapers companions at tile seams, wraps the antimeridian, and fails closed on caps', () => {
  const seamRing = [[0, 40], [160, 60], [220, 180], [0, 200], [0, 40]];
  const outline = buildWaterNurbsOutlines([seamRing], { tileSize: 512 });
  const companion = buildLandSideNurbsCompanions(outline, [{
    points: seamRing,
    role: 'outer',
    waterBodyId: 'seam-water',
  }], {
    tile: { x: 0, y: 1, z: 2, size: 512 },
  });
  assert.equal(companion.curveCount, outline.curveCount);
  assert.equal(companion.seamTaperCount, 2);
  assert.deepEqual(companion.curves[0].points[0], outline.curves[0].points[0]);
  assert.deepEqual(companion.curves[0].points.at(-1), outline.curves[0].points.at(-1));
  assert.ok(companion.curves[0].points.some((point, index) => (
    index > 0 && index < companion.curves[0].points.length - 1
      && (point[0] !== outline.curves[0].points[Math.min(index, outline.curves[0].points.length - 1)][0]
        || point[1] !== outline.curves[0].points[Math.min(index, outline.curves[0].points.length - 1)][1])
  )));

  const datelineRing = [[0, 100], [80, 100], [80, 180], [0, 180], [0, 100]];
  const dateline = companionForRing(datelineRing, 'outer', {
    tile: { x: 0, y: 0, z: 5, size: 512 },
  });
  assert.equal(dateline.antimeridianSafe, true);
  const period = 512 * 2 ** 5;
  const worldXs = dateline.curves[0].points.map(([x]) => x);
  assert.ok(Math.max(...worldXs) - Math.min(...worldXs) < period / 2);

  assert.throws(() => buildLandSideNurbsCompanions(outline, [{
    points: seamRing,
    role: 'outer',
    waterBodyId: 'seam-water',
  }], {
    tile: { x: 0, y: 1, z: 2, size: 512 },
    maximumOutputControlPoints: 2,
  }), (error) => error?.code === 'ERR_SHORTBREAD_LANDLINE_CONTROL_POINT_CAP');
  assert.throws(() => buildLandSideNurbsCompanions(outline, [{
    points: seamRing,
    role: 'outer',
    waterBodyId: 'seam-water',
  }], {
    tile: { x: 0, y: 1, z: 2, size: 512 },
    maximumOperations: 1,
  }), (error) => error?.code === 'ERR_SHORTBREAD_LANDLINE_OPERATION_CAP');
  assert.equal(SHORELINE_LANDLINE_LIMITS.maximumOutputControlPointsPerTile, 262_144);
  assert.equal(SHORELINE_LANDLINE_LIMITS.maximumOffsetOperationsPerTile, 1_048_576);
});
