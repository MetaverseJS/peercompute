import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeTerrainChunk } from '../src/world/terrainTask.js';

test('computeTerrainChunk returns consistent grid dimensions', () => {
  const size = 2048;
  const lodStep = 64;
  const data = computeTerrainChunk({
    seed: 12345,
    startX: 0,
    startZ: 0,
    lodStep,
    size,
    treeLevel: 'close',
    includeStructures: true
  });
  const expectedGrid = Math.floor(size / lodStep);
  assert.equal(data.gridSize, expectedGrid);
  assert.equal(data.heights.length, (expectedGrid + 1) * (expectedGrid + 1));
  assert.ok(Array.isArray(data.trees));
  assert.ok(Array.isArray(data.structures));
});
