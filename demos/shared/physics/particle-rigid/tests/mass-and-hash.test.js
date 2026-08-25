import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateParticleCloudMassProperties,
  createParticleCloud,
  DeterministicSpatialHash,
} from '../index.js';
import { bodyInverseInertiaWorld } from '../bodyMath.js';
import { quatFromAxisAngle, rotateTensor } from '../math.js';

test('cached world inverse inertia is exact and invalidates on every source mutation', () => {
  const body = {
    motionType: 'dynamic',
    predictedOrientation: quatFromAxisAngle([1, 2, 3], 0.73),
    inverseInertia: new Float32Array([
      2.5, -0.25, 0.125,
      -0.25, 1.75, -0.375,
      0.125, -0.375, 3.25,
    ]),
  };
  const expected = rotateTensor(body.inverseInertia, body.predictedOrientation);
  const first = bodyInverseInertiaWorld(body);
  const second = bodyInverseInertiaWorld(body);
  assert.deepEqual(Array.from(first), Array.from(expected));
  assert.deepEqual(Array.from(second), Array.from(expected));
  assert.notStrictEqual(second, first, 'the exported default-output API remains non-aliasing');

  const explicit = new Float32Array(9);
  assert.strictEqual(bodyInverseInertiaWorld(body, explicit), explicit);
  assert.deepEqual(Array.from(explicit), Array.from(expected));
  first[0] = 123;
  assert.deepEqual(Array.from(bodyInverseInertiaWorld(body)), Array.from(expected));

  body.predictedOrientation.set(quatFromAxisAngle([-2, 1, 0.5], 1.17));
  body.inverseInertia[4] = Math.fround(2.125);
  const mutatedExpected = rotateTensor(body.inverseInertia, body.predictedOrientation);
  assert.deepEqual(Array.from(bodyInverseInertiaWorld(body)), Array.from(mutatedExpected));

  body.motionType = 'static';
  assert.deepEqual(Array.from(bodyInverseInertiaWorld(body)), Array(9).fill(0));
  body.inverseInertia = new Float32Array([
    1.25, 0.1, -0.05,
    0.1, 2.25, 0.2,
    -0.05, 0.2, 4.5,
  ]);
  body.predictedOrientation = quatFromAxisAngle([0, 1, 0], 0.41);
  body.motionType = 'dynamic';
  assert.deepEqual(
    Array.from(bodyInverseInertiaWorld(body)),
    Array.from(rotateTensor(body.inverseInertia, body.predictedOrientation)),
  );
});

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

test('spatial hash preserves exact swept cells and pair order for shuffled inputs', () => {
  const entries = [
    {
      key: 'bike#front',
      bodyId: 'bike',
      position: [1.6, 0.2, -0.4],
      sweptPositions: [[-1.2, 0.2, -0.4], [0.1, 1.4, 0.8], [1.6, 0.2, -0.4]],
      radius: 0.2,
    },
    {
      key: 'traffic-b#0',
      bodyId: 'traffic-b',
      position: [0.4, 0.5, 0.1],
      previousPosition: [-0.3, 0.5, 0.1],
      radius: 0.15,
    },
    {
      key: 'traffic-a#0',
      bodyId: 'traffic-a',
      position: [-0.7, 0.5, 0.1],
      previousPosition: [-0.9, 0.5, 0.1],
      radius: 0.15,
    },
  ];
  const snapshot = (input) => {
    const hash = new DeterministicSpatialHash({
      cellSize: 1,
      maxEntriesPerCell: 16,
      maxCells: 128,
      maxCandidatePairs: 128,
    });
    hash.build(input);
    const pairs = hash.candidatePairs().map(([a, b]) => `${a.key}|${b.key}`);
    const cells = [...hash.cells.values()]
      .map((cell) => ({
        key: cell.key,
        entries: cell.entries.map((entry) => entry.key),
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
    return { cells, pairs, diagnostics: hash.getDiagnostics() };
  };

  const ordered = snapshot(entries);
  const shuffled = snapshot([entries[1], entries[0], entries[2]]);
  assert.deepEqual(shuffled, ordered);
  for (const cell of ordered.cells) {
    assert.deepEqual(cell.entries, [...cell.entries].sort());
  }
  assert.ok(ordered.cells.some((cell) => cell.key === '-2,0,-1'));
  assert.ok(ordered.cells.some((cell) => cell.key === '1,0,0'));
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

test('spatial hash filters excluded body pairs before pair keys consume the candidate cap', () => {
  const hash = new DeterministicSpatialHash({
    cellSize: 1,
    maxEntriesPerCell: 10,
    maxCells: 10,
    maxCandidatePairs: 1,
  });
  hash.build(['a', 'b', 'c'].map((bodyId) => ({
    key: bodyId,
    bodyId,
    position: [0, 0, 0],
    radius: 0,
  })));
  const pairs = hash.candidatePairs((a, b) => a.bodyId === 'b' && b.bodyId === 'c');
  assert.deepEqual(pairs.map(([a, b]) => `${a.key}|${b.key}`), ['b|c']);
  assert.equal(hash.getDiagnostics().candidatePairs, 1);
  assert.equal(hash.getDiagnostics().droppedCandidatePairs, 0);
});
