import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLOSURE_RESULT_SCHEMA,
  closureResultFromMaterialPacket,
  materialPacketFromClosureResult,
  validateClosureResult
} from '../../shared/closureContract.js';
import { estimateElementProperties, estimateMoleculeProperties } from '../src/materials/materialProperties.js';
import { validatePropertyPacket } from '../src/materials/propertyPacket.js';
import { estimateWaterPhase, estimateWaterProperties } from '../src/materials/waterProperties.js';
import { createWaterPhaseGroup } from '../src/visualization/waterPhaseView.js';

const disposeGroup = (group) => {
  group.traverse((item) => {
    if (item.geometry) item.geometry.dispose();
    if (item.material) item.material.dispose();
  });
};

test('property packets validate and serialize', () => {
  const packet = estimateWaterProperties({ temperatureK: 293.15, pressurePa: 101325 });
  const validation = validatePropertyPacket(packet);
  assert.equal(validation.ok, true, validation.errors.join(', '));
  assert.doesNotThrow(() => JSON.stringify(packet));
  assert.equal(packet.materialId, 'water.h2o.reference-eos-v0');
});

test('material property packets adapt to shared closure contract', () => {
  const packet = estimateWaterProperties({ temperatureK: 298, pressurePa: 101325 });
  const closure = closureResultFromMaterialPacket(packet, {
    layerId: 'molecular',
    solverId: 'schrodinger-materials',
    stateKey: `schrodinger:${packet.sampleId}`
  });
  assert.equal(closure.schema, CLOSURE_RESULT_SCHEMA);
  assert.equal(closure.source.solverId, 'schrodinger-materials');
  assert.equal(closure.state.materialId, packet.materialId);
  assert.equal(closure.thermodynamics.temperatureK, packet.state.temperatureK);
  assert.equal(closure.thermodynamics.densityKgM3, packet.state.densityKgM3);
  assert.equal(closure.transport.electricalConductivitySm, packet.electromagnetic.electricalConductivitySpm);
  assert.equal(closure.mechanics.bulkModulusPa, packet.mechanics.bulkModulusPa);
  assert.deepEqual(validateClosureResult(closure), { ok: true, errors: [] });

  const roundTrip = materialPacketFromClosureResult(closure, { now: packet.timestamp });
  assert.equal(validatePropertyPacket(roundTrip).ok, true);
  assert.equal(roundTrip.materialId, packet.materialId);
  assert.equal(roundTrip.state.phase, packet.state.phase);
  assert.equal(roundTrip.electromagnetic.electricalConductivitySpm, packet.electromagnetic.electricalConductivitySpm);
});

test('water phase estimator covers solid liquid gas order', () => {
  assert.equal(estimateWaterPhase({ temperatureK: 250, pressurePa: 101325 }), 'solid');
  assert.equal(estimateWaterPhase({ temperatureK: 293.15, pressurePa: 101325 }), 'liquid');
  assert.equal(estimateWaterPhase({ temperatureK: 430, pressurePa: 101325 }), 'gas');
});

test('liquid water omits misleading Young modulus', () => {
  const packet = estimateWaterProperties({ temperatureK: 298, pressurePa: 101325 });
  assert.equal(packet.state.phase, 'liquid');
  assert.equal(packet.mechanics.youngsModulusPa, null);
  assert.ok(packet.mechanics.bulkModulusPa > 1e9);
  assert.ok(packet.validation.warnings.some((warning) => warning.includes('Young')));
});

test('water responds to pressure in boiling transition', () => {
  const lowPressure = estimateWaterProperties({ temperatureK: 360, pressurePa: 0.2 * 101325 });
  const highPressure = estimateWaterProperties({ temperatureK: 360, pressurePa: 8 * 101325 });
  assert.notEqual(lowPressure.state.phase, highPressure.state.phase);
  assert.equal(highPressure.state.phase, 'liquid');
});

test('water material cell renders each molecule as oxygen plus two hydrogens', () => {
  const packet = estimateWaterProperties({ temperatureK: 293.15, pressurePa: 101325 });
  assert.equal(packet.chemical.bondEvents.length, 2);
  assert.ok(packet.chemical.bondEvents.every((event) => event.bondClass === 'covalent'));

  const group = createWaterPhaseGroup(packet);
  assert.equal(group.userData.formula, 'H2O');
  assert.equal(group.userData.atomsPerMolecule, 3);
  assert.equal(group.userData.bondsPerMolecule, 2);
  assert.deepEqual(group.userData.bondClasses, ['covalent']);
  assert.ok(group.userData.moleculeCount >= 1);

  const molecule = group.children.find((child) => child.name.startsWith('molecule:H2O:'));
  assert.ok(molecule, 'expected at least one H2O molecule group');
  const atomNames = [];
  const bondNames = [];
  molecule.traverse((item) => {
    if (item.name.startsWith('atom:')) atomNames.push(item.name);
    if (item.name.startsWith('bond:')) bondNames.push(item.name);
  });
  assert.deepEqual(atomNames.sort(), ['atom:H', 'atom:H', 'atom:O']);
  assert.deepEqual(bondNames.sort(), ['bond:covalent', 'bond:covalent']);

  disposeGroup(group);
});

test('ionic materials expose ionic bond events and visible bond meshes', () => {
  const packet = estimateMoleculeProperties({ materialId: 'sodium-chloride', temperatureK: 293.15, pressurePa: 101325 });
  assert.equal(packet.chemical.bondEvents.length, 1);
  assert.equal(packet.chemical.bondEvents[0].bondClass, 'ionic');

  const group = createWaterPhaseGroup(packet);
  assert.equal(group.userData.formula, 'NaCl');
  assert.deepEqual(group.userData.bondClasses, ['ionic']);

  const molecule = group.children.find((child) => child.name.startsWith('molecule:NaCl:'));
  assert.ok(molecule, 'expected at least one NaCl formula-unit group');
  const bond = molecule.children.find((child) => child.name === 'bond:ionic');
  assert.ok(bond, 'expected visible ionic bond mesh');
  assert.equal(bond.userData.bondClass, 'ionic');

  disposeGroup(group);
});

test('non-water molecule packets and radioactive element packets expose expected domains', () => {
  const methane = estimateMoleculeProperties({ materialId: 'methane', temperatureK: 293.15, pressurePa: 101325 });
  assert.equal(methane.state.phase, 'gas');
  assert.ok(methane.mechanics.bulkModulusPa > 1e5);
  assert.equal(validatePropertyPacket(methane).ok, true);

  const uranium = estimateElementProperties({ symbol: 'U', temperatureK: 293.15, pressurePa: 101325 });
  assert.equal(uranium.state.phase, 'solid');
  assert.ok(uranium.nuclear.activityBqKg > 0);
  assert.ok(uranium.nuclear.radiationSourceTerms.length > 0);
});
