import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CHEMISTRY_CATALOG,
  getDisplayReactiveDegree,
  getStateById,
  getZeroTargets,
  summarizeInteraction
} from '../fano-reactor/src/model/chemistry.js';

test('fano-reactor catalog matches expected atomic counts', () => {
  assert.equal(CHEMISTRY_CATALOG.counts.reactiveStates, 84);
  assert.equal(CHEMISTRY_CATALOG.counts.reactiveFamilies, 42);
  assert.equal(CHEMISTRY_CATALOG.counts.directedZeroDivisorPairs, 336);
  assert.equal(CHEMISTRY_CATALOG.counts.nobleGasChannels, 7);
});

test('reactive atom exposes four canonical targets / eight display score', () => {
  const atom = getStateById('e1+e10');
  const targets = getZeroTargets(atom).map((state) => state.id).sort();
  assert.equal(targets.length, 4);
  assert.deepEqual(targets, ['e4-e15', 'e5+e14', 'e6-e13', 'e7+e12']);
  assert.equal(getDisplayReactiveDegree(atom), 8);
});

test('sigma conjugate flips ionic bond into anti-bond', () => {
  const atomA = getStateById('e1+e10');
  const ionic = summarizeInteraction(atomA, getStateById('e4-e15'));
  const anti = summarizeInteraction(atomA, getStateById('e4+e15'));

  assert.equal(ionic.delta, -4);
  assert.equal(ionic.zeroDivisor, true);
  assert.equal(ionic.bond.tone, 'ionic');

  assert.equal(anti.delta, 4);
  assert.equal(anti.zeroDivisor, false);
  assert.equal(anti.bond.tone, 'anti');
});

test('noble-gas CD partners stay inert', () => {
  const noble = getStateById('e1+e9');
  assert.ok(noble, 'expected noble gas showcase state');
  assert.equal(getZeroTargets(noble).length, 0);
  assert.equal(getDisplayReactiveDegree(noble), 0);
});

test('cascade sample reaches the reduced molecule target count and stable super-molecule', () => {
  const sample = CHEMISTRY_CATALOG.cascadeSample;
  assert.ok(sample, 'expected a cascade sample');
  assert.equal(sample.atomA.label, 'e1 + e10');
  assert.equal(sample.atomB.label, 'e4 - e15');
  assert.equal(sample.atomC.label, 'e3 - e13');
  assert.equal(getDisplayReactiveDegree(sample.atomA), 8);
  assert.equal(sample.molecule.paperTargets, 2);
  assert.equal(sample.superMolecule.paperTargets, 0);
});
