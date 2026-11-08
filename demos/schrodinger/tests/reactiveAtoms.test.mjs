import test from 'node:test';
import assert from 'node:assert/strict';
import { ReactiveAtomSimulation } from '../src/simulation/reactiveAtoms.js';

const run = (simulation, steps = 240) => {
  for (let i = 0; i < steps; i++) simulation.update(1 / 60);
};

test('reactive atom sandbox bonds five oxygen atoms with ten hydrogens into water groups', () => {
  const simulation = new ReactiveAtomSimulation({ seed: 'h2o-sandbox-test' });
  simulation.setEnvironment({ temperatureK: 293.15, pressureAtm: 1, gravityMps2: 0 });
  simulation.addAtoms('O', 5);
  simulation.addAtoms('H', 10);

  run(simulation);
  const summary = simulation.getSummary();
  assert.equal(summary.atomCount, 15);
  assert.equal(summary.bondSummary.covalent, 10);
  assert.deepEqual(summary.molecules, [{ formula: 'H2O', count: 5, atomCount: 3 }]);
});

test('reactive atom sandbox forms ionic sodium chloride pairs', () => {
  const simulation = new ReactiveAtomSimulation({ seed: 'nacl-sandbox-test' });
  simulation.setEnvironment({ temperatureK: 293.15, pressureAtm: 4, gravityMps2: 0 });
  simulation.addAtoms('Na', 3);
  simulation.addAtoms('Cl', 3);

  run(simulation);
  const summary = simulation.getSummary();
  assert.equal(summary.bondSummary.ionic, 3);
  assert.deepEqual(summary.molecules, [{ formula: 'NaCl', count: 3, atomCount: 2 }]);
});

test('reactive atom sandbox reports unsupported inert atoms without bonds', () => {
  const simulation = new ReactiveAtomSimulation({ seed: 'argon-sandbox-test' });
  simulation.addAtoms('Ar', 5);

  run(simulation);
  const summary = simulation.getSummary();
  assert.equal(summary.bondCount, 0);
  assert.ok(summary.warnings.some((warning) => warning.includes('Ar')));
});

test('reactive atom sandbox high temperature breaks covalent water bonds', () => {
  const simulation = new ReactiveAtomSimulation({ seed: 'hot-water-sandbox-test' });
  simulation.setEnvironment({ temperatureK: 293.15, pressureAtm: 1, gravityMps2: 0 });
  simulation.addAtoms('O', 2);
  simulation.addAtoms('H', 4);
  run(simulation);
  assert.equal(simulation.getSummary().bondSummary.covalent, 4);

  simulation.setEnvironment({ temperatureK: 6000, pressureAtm: 1, gravityMps2: 0 });
  run(simulation, 900);
  assert.ok(simulation.getSummary().bondCount < 4);
});
