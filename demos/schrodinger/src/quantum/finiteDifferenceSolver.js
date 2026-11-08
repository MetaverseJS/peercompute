import {
  correctedRadialCharge,
  effectiveNuclearCharge,
  radialComponent
} from './orbitals.js';
import { HARTREE_EV, estimateOrbitalExtentBohr, hydrogenicEnergyEv } from './references.js';

export const RADIAL_FINITE_DIFFERENCE_EIGENSOLVER_SCHEMA =
  'peercompute.schrodinger.radial-finite-difference-eigensolver.v0';

const BOHR_RADIUS_NM = 0.0529177210903;
const ATOMIC_TIME_AS = 24.188843265857;
const MIN_GRID_POINTS = 96;
const MAX_GRID_POINTS = 768;
const DEFAULT_ITERATIONS = 28;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const finiteNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === '') return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeGridPointCount = (value, n) => {
  const fallback = clamp(Math.round(192 + Math.max(1, n) * 32), MIN_GRID_POINTS, 512);
  return Math.round(clamp(finiteNumber(value, fallback), MIN_GRID_POINTS, MAX_GRID_POINTS));
};

const normalizeVector = (values, spacing) => {
  let normSquared = 0;
  for (let i = 0; i < values.length; i += 1) normSquared += values[i] * values[i] * spacing;
  const norm = Math.sqrt(Math.max(0, normSquared));
  if (norm <= 1e-30) return 0;
  for (let i = 0; i < values.length; i += 1) values[i] /= norm;
  return norm;
};

const dotWeighted = (a, b, spacing) => {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) sum += a[i] * b[i] * spacing;
  return sum;
};

const applyTridiagonal = ({ diagonal, offDiagonal, vector }) => {
  const out = new Float64Array(vector.length);
  for (let i = 0; i < vector.length; i += 1) {
    out[i] = diagonal[i] * vector[i];
    if (i > 0) out[i] += offDiagonal[i - 1] * vector[i - 1];
    if (i < vector.length - 1) out[i] += offDiagonal[i] * vector[i + 1];
  }
  return out;
};

const solveTridiagonal = ({ diagonal, offDiagonal, rhs }) => {
  const size = diagonal.length;
  const cPrime = new Float64Array(Math.max(0, size - 1));
  const dPrime = new Float64Array(size);
  const solution = new Float64Array(size);
  const pivotFloor = 1e-14;

  let pivot = diagonal[0];
  if (Math.abs(pivot) < pivotFloor) pivot = pivot < 0 ? -pivotFloor : pivotFloor;
  if (size > 1) cPrime[0] = offDiagonal[0] / pivot;
  dPrime[0] = rhs[0] / pivot;

  for (let i = 1; i < size; i += 1) {
    pivot = diagonal[i] - offDiagonal[i - 1] * cPrime[i - 1];
    if (Math.abs(pivot) < pivotFloor) pivot = pivot < 0 ? -pivotFloor : pivotFloor;
    if (i < size - 1) cPrime[i] = offDiagonal[i] / pivot;
    dPrime[i] = (rhs[i] - offDiagonal[i - 1] * dPrime[i - 1]) / pivot;
  }

  solution[size - 1] = dPrime[size - 1];
  for (let i = size - 2; i >= 0; i -= 1) {
    solution[i] = dPrime[i] - cPrime[i] * solution[i + 1];
  }
  return solution;
};

const countRadialNodes = (values) => {
  let maxAbs = 0;
  for (const value of values) maxAbs = Math.max(maxAbs, Math.abs(value));
  const threshold = maxAbs * 1e-4;
  let previousSign = 0;
  let nodes = 0;
  for (const value of values) {
    if (Math.abs(value) <= threshold) continue;
    const sign = value < 0 ? -1 : 1;
    if (previousSign !== 0 && sign !== previousSign) nodes += 1;
    previousSign = sign;
  }
  return nodes;
};

const buildInitialRadialVector = ({ n, l, radialZ, radii, spacing }) => {
  const values = new Float64Array(radii.length);
  for (let i = 0; i < radii.length; i += 1) {
    const r = radii[i];
    values[i] = r * radialComponent(n, l, r, radialZ);
  }
  if (normalizeVector(values, spacing) > 0) return values;

  for (let i = 0; i < radii.length; i += 1) {
    values[i] = Math.sin(Math.PI * (i + 1) / (radii.length + 1));
  }
  normalizeVector(values, spacing);
  return values;
};

const estimateDefaultExtentBohr = ({ n, radialZ }) => {
  const safeZ = Math.max(0.25, radialZ);
  const analyticExtent = estimateOrbitalExtentBohr({ n, zEff: safeZ, scale: 10 });
  return clamp(Math.max(18 / safeZ, analyticExtent), 8 / safeZ, 420);
};

const classifyStatus = ({ energyErrorEv, residualRelativeL2, potentialModel }) => {
  if (potentialModel !== 'coulomb') {
    return residualRelativeL2 < 1e-7 ? 'numerical-screened-converged' : 'numerical-screened-watch';
  }
  if (Math.abs(energyErrorEv) < 0.08 && residualRelativeL2 < 1e-7) return 'numerical-converged';
  if (Math.abs(energyErrorEv) < 0.35 && residualRelativeL2 < 1e-6) return 'numerical-watch';
  return 'numerical-coarse';
};

export function solveRadialSchrodingerEigenstate({
  element = null,
  atomicNumber = null,
  n = 1,
  l = 0,
  zEff = null,
  options = {},
  gridPointCount = null,
  radialExtentBohr = null,
  iterations = DEFAULT_ITERATIONS,
  shiftHartree = null,
  includeGridVectors = false
} = {}) {
  const principalN = Math.max(1, Math.round(finiteNumber(n, 1)));
  const angularL = Math.max(0, Math.round(finiteNumber(l, 0)));
  if (angularL >= principalN) {
    throw new Error('radial eigensolver requires 0 <= l < n');
  }

  const sourceZ = Math.max(1, Math.round(finiteNumber(atomicNumber, element?.Z || 1)));
  const baseZEff = Math.max(
    0.05,
    finiteNumber(
      zEff,
      element ? effectiveNuclearCharge(element, principalN, angularL, options) : sourceZ
    )
  );
  const radialZ = correctedRadialCharge(baseZEff, principalN, angularL, options);
  const pointCount = normalizeGridPointCount(gridPointCount, principalN);
  const extent = Math.max(
    1,
    finiteNumber(radialExtentBohr, estimateDefaultExtentBohr({ n: principalN, radialZ }))
  );
  const spacing = extent / (pointCount + 1);
  const potentialModel = options.debyeLengthBohr || options.coulombSofteningBohr
    ? 'screened-softened-coulomb'
    : 'coulomb';
  const debyeLengthBohr = finiteNumber(options.debyeLengthBohr, Infinity);
  const softeningBohr = Math.max(0, finiteNumber(options.coulombSofteningBohr, 0));
  const diagonal = new Float64Array(pointCount);
  const offDiagonal = new Float64Array(pointCount - 1);
  const radii = new Float64Array(pointCount);

  for (let i = 0; i < pointCount; i += 1) {
    const r = (i + 1) * spacing;
    radii[i] = r;
    const denominator = softeningBohr > 0 ? Math.sqrt(r * r + softeningBohr * softeningBohr) : r;
    const screening = Number.isFinite(debyeLengthBohr) && debyeLengthBohr > 0
      ? Math.exp(-r / debyeLengthBohr)
      : 1;
    const coulombPotential = -radialZ * screening / denominator;
    const centrifugalPotential = angularL * (angularL + 1) / (2 * r * r);
    diagonal[i] = 1 / (spacing * spacing) + coulombPotential + centrifugalPotential;
    if (i < pointCount - 1) offDiagonal[i] = -0.5 / (spacing * spacing);
  }

  let vector = buildInitialRadialVector({ n: principalN, l: angularL, radialZ, radii, spacing });
  const analyticEnergyHartree = hydrogenicEnergyEv({ n: principalN, zEff: radialZ }) / HARTREE_EV;
  const shift = finiteNumber(
    shiftHartree,
    analyticEnergyHartree + (potentialModel === 'coulomb' ? 0 : Math.abs(analyticEnergyHartree) * 0.08)
  );
  const shiftedDiagonal = new Float64Array(pointCount);
  const iterationCount = Math.round(clamp(finiteNumber(iterations, DEFAULT_ITERATIONS), 4, 96));
  let stableIterations = 0;

  for (let iteration = 0; iteration < iterationCount; iteration += 1) {
    for (let i = 0; i < pointCount; i += 1) shiftedDiagonal[i] = diagonal[i] - shift;
    const next = solveTridiagonal({ diagonal: shiftedDiagonal, offDiagonal, rhs: vector });
    const norm = normalizeVector(next, spacing);
    if (!Number.isFinite(norm) || norm <= 0) break;
    vector = next;
    stableIterations += 1;
  }

  const hVector = applyTridiagonal({ diagonal, offDiagonal, vector });
  const energyHartree = dotWeighted(vector, hVector, spacing);
  const residual = new Float64Array(pointCount);
  let residualNormSquared = 0;
  let referenceNormSquared = 0;
  let maxAbsResidualHartree = 0;
  let meanRadiusBohr = 0;
  let meanRadiusSquaredBohr2 = 0;
  let peakProbabilityDensity = 0;
  let peakRadiusBohr = radii[0] || 0;

  for (let i = 0; i < pointCount; i += 1) {
    const density = vector[i] * vector[i];
    const r = radii[i];
    const value = hVector[i] - energyHartree * vector[i];
    residual[i] = value;
    residualNormSquared += value * value * spacing;
    referenceNormSquared += (energyHartree * vector[i]) * (energyHartree * vector[i]) * spacing;
    maxAbsResidualHartree = Math.max(maxAbsResidualHartree, Math.abs(value));
    meanRadiusBohr += density * r * spacing;
    meanRadiusSquaredBohr2 += density * r * r * spacing;
    if (density > peakProbabilityDensity) {
      peakProbabilityDensity = density;
      peakRadiusBohr = r;
    }
  }

  const residualL2Hartree = Math.sqrt(Math.max(0, residualNormSquared));
  const residualRelativeL2 = residualL2Hartree / Math.max(1e-30, Math.sqrt(Math.max(0, referenceNormSquared)));
  const energyEv = energyHartree * HARTREE_EV;
  const analyticEnergyEv = analyticEnergyHartree * HARTREE_EV;
  const energyErrorEv = energyEv - analyticEnergyEv;
  const normalization = dotWeighted(vector, vector, spacing);
  const radialSamples = [];
  const sampleStride = Math.max(1, Math.floor(pointCount / 96));
  for (let i = 0; i < pointCount; i += sampleStride) {
    radialSamples.push({
      rBohr: radii[i],
      u: vector[i],
      probabilityDensity: vector[i] * vector[i]
    });
  }
  if (radialSamples[radialSamples.length - 1]?.rBohr !== radii[pointCount - 1]) {
    const last = pointCount - 1;
    radialSamples.push({
      rBohr: radii[last],
      u: vector[last],
      probabilityDensity: vector[last] * vector[last]
    });
  }

  const result = {
    schema: RADIAL_FINITE_DIFFERENCE_EIGENSOLVER_SCHEMA,
    modelId: 'radial-finite-difference-shift-invert-v0',
    mode: 'time-independent-radial-schrodinger',
    status: classifyStatus({ energyErrorEv, residualRelativeL2, potentialModel }),
    hamiltonian: 'H_l = -1/2 d2/dr2 + l(l+1)/(2r^2) - Z_eff/r',
    solver: 'shift-invert-tridiagonal-finite-difference',
    potentialModel,
    units: {
      length: 'bohr',
      energy: 'hartree/eV',
      timeAtomicUnitAttoseconds: ATOMIC_TIME_AS
    },
    elementSymbol: element?.symbol || null,
    atomicNumber: sourceZ,
    principalN,
    angularL,
    radialNodeCountTarget: Math.max(0, principalN - angularL - 1),
    radialNodeCountObserved: countRadialNodes(vector),
    zEff: baseZEff,
    radialZ,
    energyHartree,
    energyEv,
    analyticEnergyHartree,
    analyticEnergyEv,
    energyErrorHartree: energyHartree - analyticEnergyHartree,
    energyErrorEv,
    relativeEnergyError: Math.abs(energyErrorEv) / Math.max(1e-12, Math.abs(analyticEnergyEv)),
    residualL2Hartree,
    residualRelativeL2,
    maxAbsResidualHartree,
    maxAbsResidualEv: maxAbsResidualHartree * HARTREE_EV,
    normalization,
    meanRadiusBohr,
    meanRadiusNm: meanRadiusBohr * BOHR_RADIUS_NM,
    rmsRadiusBohr: Math.sqrt(Math.max(0, meanRadiusSquaredBohr2)),
    peakRadiusBohr,
    peakProbabilityDensity,
    gridPointCount: pointCount,
    radialExtentBohr: extent,
    spacingBohr: spacing,
    iterationsRequested: iterationCount,
    iterationsCompleted: stableIterations,
    shiftHartree: shift,
    converged: stableIterations === iterationCount && residualRelativeL2 < 1e-7,
    radialSamples,
    validity: {
      status: 'single-electron-reference',
      warnings: [
        'Solves the one-electron radial time-independent Schrodinger equation with a finite-difference Hamiltonian.',
        'Many-electron effects still enter through screened effective charge; this is not DFT or ab initio molecular quantum chemistry.'
      ]
    }
  };

  if (includeGridVectors) {
    result.radialGrid = {
      radiiBohr: Float32Array.from(radii),
      wavefunctionU: Float32Array.from(vector),
      diagonalHartree: Float32Array.from(diagonal),
      offDiagonalHartree: Float32Array.from(offDiagonal),
      spacingBohr: spacing,
      pointCount
    };
  }

  return result;
}
