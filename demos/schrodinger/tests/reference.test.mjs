import test from 'node:test';
import assert from 'node:assert/strict';
import { abs2, normalizeComplexVector, probabilitiesFromComplexVector } from '../src/core/complex.js';
import { getElementBySymbol } from '../src/data/elements.js';
import {
  RADIAL_FINITE_DIFFERENCE_EIGENSOLVER_SCHEMA,
  solveRadialSchrodingerEigenstate
} from '../src/quantum/finiteDifferenceSolver.js';
import { buildOrbitalGrid, effectiveNuclearCharge, sampleOrbitalPoints } from '../src/quantum/orbitals.js';
import { harmonicOscillatorEnergyEv, hydrogenicEnergyEv, particleInBoxEnergyEv } from '../src/quantum/references.js';
import {
  ORBITAL_GRID_WEBGPU_SCHEMA,
  RADIAL_WEBGPU_EIGENSOLVER_SCHEMA
} from '../src/quantum/webgpuWaveSolver.js';

test('complex vector normalization preserves probability mass', () => {
  const values = new Float64Array([3, 4, 0, 0]);
  const result = normalizeComplexVector(values);
  assert.equal(result.norm, 5);
  assert.ok(Math.abs(abs2({ re: values[0], im: values[1] }) - 1) < 1e-12);
  const probabilities = probabilitiesFromComplexVector(values);
  assert.ok(Math.abs(probabilities.reduce((a, b) => a + b, 0) - 1) < 1e-12);
});

test('analytic reference energies are stable', () => {
  assert.ok(Math.abs(hydrogenicEnergyEv({ n: 1, zEff: 1 }) + 13.605693122994) < 1e-12);
  assert.ok(Math.abs(hydrogenicEnergyEv({ n: 2, zEff: 1 }) + 3.4014232807485) < 1e-12);
  assert.ok(Math.abs(particleInBoxEnergyEv({ n: 1, lengthNm: 1 }) - 0.3760301621559357) < 1e-12);
  const e0 = harmonicOscillatorEnergyEv({ level: 0, omega: 1e15 });
  const e1 = harmonicOscillatorEnergyEv({ level: 1, omega: 1e15 });
  assert.ok(Math.abs((e1 - e0) - 0.6582119569509067) < 1e-9);
});

test('WebGPU radial Schrodinger schema advertises GPU-first execution', () => {
  assert.equal(RADIAL_WEBGPU_EIGENSOLVER_SCHEMA, 'peercompute.schrodinger.radial-webgpu-eigensolver.v0');
  assert.equal(ORBITAL_GRID_WEBGPU_SCHEMA, 'peercompute.schrodinger.orbital-grid-webgpu.v0');
});

test('orbital grid normalizes and reports effective charge', () => {
  const hydrogen = getElementBySymbol('H');
  const grid = buildOrbitalGrid({
    element: hydrogen,
    n: 1,
    l: 0,
    m: 0,
    gridSize: 14,
    options: { screeningExchange: true }
  });
  assert.ok(Math.abs(grid.normalization - 1) < 1e-10);
  assert.equal(grid.zEff, 1);
  assert.ok(grid.energyEv < -13.6 && grid.energyEv > -13.7);
  assert.ok(grid.boundaryMass < 0.18);
});

test('radial finite-difference eigensolver resolves hydrogen reference states', () => {
  const hydrogen = getElementBySymbol('H');
  const oneS = solveRadialSchrodingerEigenstate({
    element: hydrogen,
    n: 1,
    l: 0,
    gridPointCount: 320,
    options: { screeningExchange: true }
  });
  assert.equal(oneS.schema, RADIAL_FINITE_DIFFERENCE_EIGENSOLVER_SCHEMA);
  assert.equal(oneS.mode, 'time-independent-radial-schrodinger');
  assert.equal(oneS.radialNodeCountObserved, 0);
  assert.ok(Math.abs(oneS.energyEv - hydrogenicEnergyEv({ n: 1, zEff: 1 })) < 0.03);
  assert.ok(oneS.residualRelativeL2 < 1e-9);
  assert.ok(oneS.converged);

  const twoS = solveRadialSchrodingerEigenstate({
    element: hydrogen,
    n: 2,
    l: 0,
    gridPointCount: 320,
    options: { screeningExchange: true }
  });
  assert.equal(twoS.radialNodeCountObserved, 1);
  assert.ok(Math.abs(twoS.energyEv - hydrogenicEnergyEv({ n: 2, zEff: 1 })) < 0.03);
  assert.ok(twoS.residualRelativeL2 < 1e-9);

  const twoP = solveRadialSchrodingerEigenstate({
    element: hydrogen,
    n: 2,
    l: 1,
    gridPointCount: 320,
    options: { screeningExchange: true }
  });
  assert.equal(twoP.radialNodeCountObserved, 0);
  assert.ok(Math.abs(twoP.energyEv - hydrogenicEnergyEv({ n: 2, zEff: 1 })) < 0.03);
  assert.ok(twoP.residualRelativeL2 < 1e-9);
});

test('radial finite-difference eigensolver emits screened active-orbital diagnostics', () => {
  const oxygen = getElementBySymbol('O');
  const zEff = effectiveNuclearCharge(oxygen, 2, 1, { screeningExchange: true });
  const result = solveRadialSchrodingerEigenstate({
    element: oxygen,
    n: 2,
    l: 1,
    zEff,
    gridPointCount: 240,
    options: { screeningExchange: true, correlationMixing: true }
  });
  assert.equal(result.elementSymbol, 'O');
  assert.equal(result.radialNodeCountTarget, 0);
  assert.equal(result.radialNodeCountObserved, 0);
  assert.ok(Number.isFinite(result.energyEv));
  assert.ok(result.energyEv < -10);
  assert.ok(Number.isFinite(result.meanRadiusBohr));
  assert.ok(result.meanRadiusBohr > 0);
  assert.ok(result.radialSamples.length > 16);
  assert.ok(result.validity.warnings.some((warning) => warning.includes('one-electron radial')));
});

test('screening reduces multi-electron effective charge but keeps bounds', () => {
  const oxygen = getElementBySymbol('O');
  const zEff = effectiveNuclearCharge(oxygen, 2, 1, { screeningExchange: true });
  assert.ok(zEff >= 1);
  assert.ok(zEff < oxygen.Z);
});

test('orbital point sampler is deterministic and avoids exact grid-cell pileups', () => {
  const positions = new Float32Array([0, 0, 0]);
  const probabilities = new Float64Array([1]);
  const first = sampleOrbitalPoints({
    positions,
    probabilities,
    sampleCount: 192,
    seed: 'single-cell-visual-spread',
    spacingBohr: 1
  });
  const second = sampleOrbitalPoints({
    positions,
    probabilities,
    sampleCount: 192,
    seed: 'single-cell-visual-spread',
    spacingBohr: 1
  });

  assert.deepEqual(Array.from(first.points), Array.from(second.points));
  const rounded = new Set();
  let maxRadius = 0;
  for (let i = 0; i < first.points.length; i += 3) {
    const x = first.points[i];
    const y = first.points[i + 1];
    const z = first.points[i + 2];
    maxRadius = Math.max(maxRadius, Math.hypot(x, y, z));
    rounded.add(`${x.toFixed(4)}:${y.toFixed(4)}:${z.toFixed(4)}`);
  }
  assert.ok(rounded.size > 180, `expected spread samples, got ${rounded.size} unique points`);
  assert.ok(maxRadius <= 0.721, `expected spherical jitter radius bound, got ${maxRadius}`);
});
