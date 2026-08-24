import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createDerivedFlatTerrainGrid,
  createTerrainGrid,
} from '../src/world/terrainGrid.js';
import { createRoadTerrainSurface } from '../src/world/roadSurfaceCollider.js';

const BBOX = [61.21, -149.92, 61.23, -149.88];

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

test('rejects malformed grids instead of inventing source geometry', () => {
  assert.throws(() => createTerrainGrid({ bbox: [0, 1, 0, 2], width: 3, height: 3, heights: new Float32Array(9) }), /ordered/);
  assert.throws(() => createTerrainGrid({ bbox: BBOX, width: 3, height: 3, heights: new Float32Array(8) }), /requires 9/);
  assert.throws(() => createTerrainGrid({ bbox: BBOX, width: 2, height: 3, heights: new Float32Array(6) }), /between 3 and 129/);
});
