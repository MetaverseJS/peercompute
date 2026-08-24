import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateParticleCloudMassProperties,
  createParticleCloud,
  DeterministicSpatialHash,
} from '../index.js';

test('particle cloud computes a centered full inertia tensor with sphere inertia', () => {
  const properties = calculateParticleCloudMassProperties(createParticleCloud([
    { position: [0, 0, 0], radius: 0.1, mass: 1 },
    { position: [2, 1, 0], radius: 0.2, mass: 3 },
    { position: [-1, 2, 1], radius: 0.15, mass: 2 },
  ]), 12);

  assert.deepEqual(Array.from(properties.centerOfMass), [
    Math.fround(2 / 3),
    Math.fround(7 / 6),
    Math.fround(1 / 3),
  ]);
  const weightedCom = [0, 0, 0];
  for (let index = 0; index < properties.count; index += 1) {
    const offset = index * 3;
    for (let axis = 0; axis < 3; axis += 1) {
      weightedCom[axis] += properties.positions[offset + axis] * properties.masses[index];
    }
  }
  for (const component of weightedCom) assert.ok(Math.abs(component) < 2e-6);
  assert.equal(properties.inertia[1], properties.inertia[3]);
  assert.equal(properties.inertia[2], properties.inertia[6]);
  assert.equal(properties.inertia[5], properties.inertia[7]);
  assert.notEqual(properties.inertia[1], 0, 'off-diagonal products of inertia are retained');
  assert.ok(properties.inertia.every(Number.isFinite));
  assert.ok(properties.inverseInertia.every(Number.isFinite));
  assert.ok(properties.inertia[0] > 0 && properties.inertia[4] > 0 && properties.inertia[8] > 0);
});

test('deterministic spatial hash surfaces occupancy overflow without dropping pairs', () => {
  const hash = new DeterministicSpatialHash({
    cellSize: 1,
    maxEntriesPerCell: 2,
    maxCells: 32,
    maxCandidatePairs: 32,
  });
  const entries = Array.from({ length: 5 }, (_, index) => ({
    key: `body-${index}#0`,
    bodyId: `body-${index}`,
    position: new Float32Array([0.1, 0.1, 0.1]),
    radius: 0.01,
  }));
  const diagnostics = hash.build(entries.reverse());
  const pairs = hash.candidatePairs();
  assert.equal(pairs.length, 10);
  assert.equal(diagnostics.overflowed, true);
  assert.equal(diagnostics.overflowedCells, 1);
  assert.equal(diagnostics.overflowedReferences, 3);
  assert.deepEqual(
    pairs.map(([a, b]) => `${a.key}|${b.key}`),
    [...pairs.map(([a, b]) => `${a.key}|${b.key}`)].sort(),
  );
});

test('spatial hash enforces hard cell and candidate bounds deterministically', () => {
  const bounded = new DeterministicSpatialHash({
    cellSize: 1,
    maxEntriesPerCell: 10,
    maxCells: 1,
    maxCandidatePairs: 1,
  });
  assert.throws(() => bounded.build([
    { key: 'a', bodyId: 'a', position: [0, 0, 0], radius: 0 },
    { key: 'b', bodyId: 'b', position: [2, 0, 0], radius: 0 },
  ]), /maxCells/);

  const pairBound = new DeterministicSpatialHash({
    cellSize: 1,
    maxEntriesPerCell: 10,
    maxCells: 10,
    maxCandidatePairs: 1,
  });
  pairBound.build(['a', 'b', 'c'].map((bodyId) => ({
    key: bodyId,
    bodyId,
    position: [0, 0, 0],
    radius: 0,
  })));
  assert.equal(pairBound.candidatePairs().length, 1);
  assert.equal(pairBound.getDiagnostics().droppedCandidatePairs, 2);
});
