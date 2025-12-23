import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TerrainGenerator } from '../src/systems/terrainGenerator.js';

test('terrain generation is deterministic per seed', () => {
  const genA = new TerrainGenerator(12345);
  const genB = new TerrainGenerator(12345);

  const heightA = genA.getHeight(128, 256);
  const heightB = genB.getHeight(128, 256);
  assert.equal(heightA, heightB);

  const moistureA = genA.getMoisture(512, 1024);
  const moistureB = genB.getMoisture(512, 1024);
  assert.equal(moistureA, moistureB);
});

test('different seeds decorrelate the terrain', () => {
  const genA = new TerrainGenerator(111);
  const genB = new TerrainGenerator(222);

  const samplePairs = [
    [64, 64],
    [128, 2048],
    [512, -256]
  ];

  const identicalHeights = samplePairs.every(([x, z]) => genA.getHeight(x, z) === genB.getHeight(x, z));
  assert.equal(identicalHeights, false, 'heights should diverge across seeds');
});

test('tree and structure placement return booleans', () => {
  const gen = new TerrainGenerator(777);
  const height = gen.getHeight(100, 200);
  const moisture = gen.getMoisture(100, 200);

  assert.equal(typeof gen.shouldPlaceTree(100, 200, height, moisture), 'boolean');
  assert.equal(typeof gen.shouldPlaceStructure(50, 60, gen.getHeight(50, 60)), 'boolean');
});
