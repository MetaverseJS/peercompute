import { makeClosureResult, makeClosureState } from '../../../shared/closureContract.js';
import { getElementBySymbol } from '../../../schrodinger/src/data/elements.js';
import {
  RADIAL_FINITE_DIFFERENCE_EIGENSOLVER_SCHEMA,
  solveRadialSchrodingerEigenstate
} from '../../../schrodinger/src/quantum/finiteDifferenceSolver.js';
import {
  L_LABELS,
  buildOrbitalGrid,
  correctedRadialCharge,
  effectiveNuclearCharge,
  radialComponent,
  realSphericalHarmonic
} from '../../../schrodinger/src/quantum/orbitals.js';
import { estimateOrbitalExtentBohr, hydrogenicEnergyEv } from '../../../schrodinger/src/quantum/references.js';

export const QUANTUM_ORBITAL_CLOSURE_SCHEMA = 'peercompute.multiscale.quantum-orbital-closure.v0';
export const QUANTUM_ORBITAL_FINITE_GRID_SCHEMA = 'peercompute.multiscale.quantum-orbital-finite-grid.v0';
export const QUANTUM_ORBITAL_EIGEN_RESIDUAL_SCHEMA = 'peercompute.multiscale.quantum-orbital-eigen-residual.v0';
export const QUANTUM_ORBITAL_WAVEFUNCTION_EVOLUTION_SCHEMA = 'peercompute.multiscale.quantum-orbital-wavefunction-evolution.v0';
export const QUANTUM_ORBITAL_RADIAL_EIGENSTATE_SCHEMA = RADIAL_FINITE_DIFFERENCE_EIGENSOLVER_SCHEMA;
export const QUANTUM_ORBITAL_MODEL_ID = 'screened-hydrogenic-orbital-closure-v0';

const BOLTZMANN_EV_PER_K = 8.617333262145e-5;
const HARTREE_EV = 27.211386245988;
const DEFAULT_FINITE_GRID_SIZE = 18;
const MIN_FINITE_GRID_SIZE = 8;
const MAX_FINITE_GRID_SIZE = 32;
const MAX_FINITE_GRID_CACHE_ENTRIES = 24;
const finiteGridCache = new Map();

const AUFBAU_ORDER = [
  { n: 1, l: 0 },
  { n: 2, l: 0 },
  { n: 2, l: 1 },
  { n: 3, l: 0 },
  { n: 3, l: 1 },
  { n: 4, l: 0 },
  { n: 3, l: 2 },
  { n: 4, l: 1 },
  { n: 5, l: 0 },
  { n: 4, l: 2 },
  { n: 5, l: 1 },
  { n: 6, l: 0 },
  { n: 4, l: 3 },
  { n: 5, l: 2 },
  { n: 6, l: 1 },
  { n: 7, l: 0 },
  { n: 5, l: 3 },
  { n: 6, l: 2 },
  { n: 7, l: 1 }
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeGridSize(value, fallback = DEFAULT_FINITE_GRID_SIZE) {
  return Math.round(clamp(finiteNumber(value, fallback), MIN_FINITE_GRID_SIZE, MAX_FINITE_GRID_SIZE));
}

function orbitalCapacity(l) {
  return 2 * (2 * l + 1);
}

function orbitalLabel({ n, l }) {
  return `${n}${L_LABELS[l] || `l${l}`}`;
}

export function buildElectronConfiguration(atomicNumber = 1) {
  let remaining = Math.max(0, Math.round(finiteNumber(atomicNumber, 1)));
  const shells = [];
  for (const orbital of AUFBAU_ORDER) {
    if (remaining <= 0) break;
    const capacity = orbitalCapacity(orbital.l);
    const occupancy = Math.min(capacity, remaining);
    shells.push({
      ...orbital,
      label: orbitalLabel(orbital),
      capacity,
      occupancy
    });
    remaining -= occupancy;
  }
  return shells;
}

export function summarizeElectronConfiguration(shells = []) {
  return shells
    .filter((shell) => shell.occupancy > 0)
    .map((shell) => `${shell.label}${shell.occupancy}`)
    .join(' ');
}

function estimateUnpairedElectronCount(shells = []) {
  let unpaired = 0;
  for (const shell of shells) {
    const orbitalCount = 2 * shell.l + 1;
    const occupancy = clamp(shell.occupancy, 0, shell.capacity);
    unpaired += occupancy <= orbitalCount
      ? occupancy
      : Math.max(0, shell.capacity - occupancy);
  }
  return unpaired;
}

function resolveActiveOrbital({ requested = {}, shells = [] } = {}) {
  const requestedN = Math.max(1, Math.round(finiteNumber(requested.principalN, 0)));
  const requestedL = Math.max(0, Math.round(finiteNumber(requested.angularL, -1)));
  const matching = shells.find((shell) => shell.n === requestedN && shell.l === requestedL && shell.occupancy > 0);
  const fallback = [...shells].reverse().find((shell) => shell.occupancy > 0) || { n: 1, l: 0, label: '1s', occupancy: 1, capacity: 2 };
  const active = matching || fallback;
  const magneticM = clamp(
    Math.round(finiteNumber(requested.magneticM, 0)),
    -active.l,
    active.l
  );
  return {
    ...active,
    magneticM,
    radialNodeCount: Math.max(0, active.n - active.l - 1),
    angularNodeCount: active.l,
    totalNodeCount: Math.max(0, active.n - 1)
  };
}

function estimateBondingTendency(element, electronegativityProxy, valenceElectronCount, unpairedElectronCount) {
  const category = String(element.category || '').toLowerCase();
  if (category.includes('noble')) return 'closed-shell-inert';
  if (category.includes('alkali') || category.includes('alkaline')) return 'ionic-donor';
  if (category.includes('halogen')) return 'ionic-acceptor';
  if (category === 'nonmetal' && unpairedElectronCount > 0 && electronegativityProxy > 2.2) return 'polar-covalent-acceptor';
  if (category === 'nonmetal' && valenceElectronCount >= 4) return 'covalent-network';
  if (category.includes('metalloid')) return 'covalent-semiconductor';
  const isMetal = category.includes(' metal')
    || category.endsWith('metal')
    || category.includes('transition')
    || category.includes('actinide');
  if (isMetal) return 'metallic-conductor';
  if (unpairedElectronCount > 0 && electronegativityProxy > 2.2) return 'polar-covalent-acceptor';
  if (valenceElectronCount <= 4) return 'covalent-donor';
  return 'covalent-network';
}

function finiteGridCacheKey({ element, activeOrbital, gridSize, options }) {
  return [
    element.symbol,
    activeOrbital.n,
    activeOrbital.l,
    activeOrbital.magneticM,
    gridSize,
    Boolean(options.screeningExchange),
    Boolean(options.relativisticSpinOrbit),
    Boolean(options.correlationMixing)
  ].join(':');
}

function trimFiniteGridCache() {
  while (finiteGridCache.size > MAX_FINITE_GRID_CACHE_ENTRIES) {
    const firstKey = finiteGridCache.keys().next().value;
    finiteGridCache.delete(firstKey);
  }
}

function summarizeFiniteGrid(grid) {
  let meanRadiusBohr = 0;
  let meanRadiusSquaredBohr2 = 0;
  let probabilityMass = 0;
  for (let i = 0; i < grid.probabilities.length; i += 1) {
    const p = Number(grid.probabilities[i] || 0);
    const base = i * 3;
    const r = Math.sqrt(
      grid.positions[base] * grid.positions[base]
        + grid.positions[base + 1] * grid.positions[base + 1]
        + grid.positions[base + 2] * grid.positions[base + 2]
    );
    probabilityMass += p;
    meanRadiusBohr += p * r;
    meanRadiusSquaredBohr2 += p * r * r;
  }
  return {
    probabilityMass,
    meanRadiusBohr,
    rmsRadiusBohr: Math.sqrt(Math.max(0, meanRadiusSquaredBohr2)),
    normalizationError: Math.abs(1 - probabilityMass)
  };
}

function wavefunctionAt({ x, y, z, activeOrbital, radialZ }) {
  const r = Math.sqrt(x * x + y * y + z * z);
  const theta = r <= 1e-12 ? 0 : Math.acos(clamp(z / r, -1, 1));
  const phi = Math.atan2(y, x);
  return radialComponent(activeOrbital.n, activeOrbital.l, r, radialZ)
    * realSphericalHarmonic(activeOrbital.l, activeOrbital.magneticM, theta, phi);
}

export function estimateFiniteGridEigenResidual({ element, activeOrbital, grid, options = {} } = {}) {
  const gridSize = normalizeGridSize(grid?.gridSize);
  const spacing = Math.max(1e-6, finiteNumber(grid?.spacingBohr, 1));
  const extent = finiteNumber(grid?.extentBohr, spacing * gridSize * 0.5);
  const zEff = finiteNumber(
    grid?.zEff,
    effectiveNuclearCharge(element, activeOrbital.n, activeOrbital.l, options)
  );
  const radialZ = correctedRadialCharge(zEff, activeOrbital.n, activeOrbital.l, options);
  const energyHartree = -0.5 * radialZ * radialZ / Math.max(1, activeOrbital.n * activeOrbital.n);
  const singularSkipRadius = spacing * 0.75;
  let interiorSampleCount = 0;
  let singularSkippedCount = 0;
  let weightedAbsResidual = 0;
  let residualSquared = 0;
  let referenceSquared = 0;
  let probabilityWeight = 0;
  let maxAbsResidualHartree = 0;

  const start = 1;
  const end = Math.max(start, gridSize - 1);
  for (let zIndex = start; zIndex < end; zIndex += 1) {
    const z = -extent + zIndex * spacing;
    for (let yIndex = start; yIndex < end; yIndex += 1) {
      const y = -extent + yIndex * spacing;
      for (let xIndex = start; xIndex < end; xIndex += 1) {
        const x = -extent + xIndex * spacing;
        const radius = Math.sqrt(x * x + y * y + z * z);
        if (radius <= singularSkipRadius) {
          singularSkippedCount += 1;
          continue;
        }
        const center = wavefunctionAt({ x, y, z, activeOrbital, radialZ });
        const laplacian = (
          wavefunctionAt({ x: x + spacing, y, z, activeOrbital, radialZ })
          + wavefunctionAt({ x: x - spacing, y, z, activeOrbital, radialZ })
          + wavefunctionAt({ x, y: y + spacing, z, activeOrbital, radialZ })
          + wavefunctionAt({ x, y: y - spacing, z, activeOrbital, radialZ })
          + wavefunctionAt({ x, y, z: z + spacing, activeOrbital, radialZ })
          + wavefunctionAt({ x, y, z: z - spacing, activeOrbital, radialZ })
          - 6 * center
        ) / (spacing * spacing);
        const hPsi = -0.5 * laplacian - (radialZ / Math.max(radius, singularSkipRadius)) * center;
        const ePsi = energyHartree * center;
        const residual = hPsi - ePsi;
        const absResidual = Math.abs(residual);
        const weight = center * center;
        interiorSampleCount += 1;
        probabilityWeight += weight;
        weightedAbsResidual += absResidual * weight;
        residualSquared += residual * residual;
        referenceSquared += ePsi * ePsi;
        maxAbsResidualHartree = Math.max(maxAbsResidualHartree, absResidual);
      }
    }
  }

  const safeWeight = probabilityWeight > 1e-18 ? probabilityWeight : 1;
  const safeReference = referenceSquared > 1e-18 ? referenceSquared : 1;
  const relativeL2 = Math.sqrt(Math.max(0, residualSquared) / safeReference);
  const weightedMeanResidualHartree = weightedAbsResidual / safeWeight;
  return {
    schema: QUANTUM_ORBITAL_EIGEN_RESIDUAL_SCHEMA,
    modelId: 'screened-hydrogenic-finite-difference-eigencheck-v0',
    mode: 'atomic-units-central-difference',
    status: relativeL2 < 0.08 ? 'finite-grid-pass' : relativeL2 < 0.25 ? 'finite-grid-watch' : 'finite-grid-divergent',
    hamiltonian: 'H = -1/2 laplacian - Z_eff/r',
    laplacian: 'second-order-central-difference',
    basis: 'base-screened-hydrogenic-real-orbital',
    energyHartree,
    energyEv: energyHartree * HARTREE_EV,
    zEff,
    radialZ,
    gridSize,
    spacingBohr: spacing,
    interiorSampleCount,
    boundarySkippedCount: Math.max(0, gridSize ** 3 - interiorSampleCount - singularSkippedCount),
    singularSkippedCount,
    relativeL2,
    weightedMeanResidualHartree,
    weightedMeanResidualEv: weightedMeanResidualHartree * HARTREE_EV,
    maxAbsResidualHartree,
    maxAbsResidualEv: maxAbsResidualHartree * HARTREE_EV,
    referenceNorm: Math.sqrt(Math.max(0, referenceSquared)),
    residualNorm: Math.sqrt(Math.max(0, residualSquared)),
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'Finite-difference residual checks the base screened hydrogenic eigenfunction on this grid; correlation and spin-orbit density perturbations are not eigen-solved.',
        'Boundary and Coulomb-singularity-adjacent cells are skipped to keep the residual bounded for interactive telemetry.'
      ]
    }
  };
}

export function estimateFiniteDifferenceWavefunctionEvolution({ element, activeOrbital, grid, options = {} } = {}) {
  const gridSize = normalizeGridSize(grid?.gridSize);
  const spacing = Math.max(1e-6, finiteNumber(grid?.spacingBohr, 1));
  const extent = finiteNumber(grid?.extentBohr, spacing * gridSize * 0.5);
  const zEff = finiteNumber(
    grid?.zEff,
    effectiveNuclearCharge(element, activeOrbital.n, activeOrbital.l, options)
  );
  const radialZ = correctedRadialCharge(zEff, activeOrbital.n, activeOrbital.l, options);
  const dtAtomicUnits = clamp(finiteNumber(options.wavefunctionDtAtomicUnits, 0.002), 1e-5, 0.02);
  const singularSkipRadius = spacing * 0.75;
  let interiorSampleCount = 0;
  let singularSkippedCount = 0;
  let normBefore = 0;
  let normAfterEuler = 0;
  let densityDriftL1 = 0;
  let hPsiSquared = 0;
  let energyNumerator = 0;
  let maxDensityDelta = 0;

  const initialDensities = [];
  const evolvedDensities = [];
  const start = 1;
  const end = Math.max(start, gridSize - 1);
  for (let zIndex = start; zIndex < end; zIndex += 1) {
    const z = -extent + zIndex * spacing;
    for (let yIndex = start; yIndex < end; yIndex += 1) {
      const y = -extent + yIndex * spacing;
      for (let xIndex = start; xIndex < end; xIndex += 1) {
        const x = -extent + xIndex * spacing;
        const radius = Math.sqrt(x * x + y * y + z * z);
        if (radius <= singularSkipRadius) {
          singularSkippedCount += 1;
          continue;
        }
        const center = wavefunctionAt({ x, y, z, activeOrbital, radialZ });
        const laplacian = (
          wavefunctionAt({ x: x + spacing, y, z, activeOrbital, radialZ })
          + wavefunctionAt({ x: x - spacing, y, z, activeOrbital, radialZ })
          + wavefunctionAt({ x, y: y + spacing, z, activeOrbital, radialZ })
          + wavefunctionAt({ x, y: y - spacing, z, activeOrbital, radialZ })
          + wavefunctionAt({ x, y, z: z + spacing, activeOrbital, radialZ })
          + wavefunctionAt({ x, y, z: z - spacing, activeOrbital, radialZ })
          - 6 * center
        ) / (spacing * spacing);
        const hPsi = -0.5 * laplacian - (radialZ / Math.max(radius, singularSkipRadius)) * center;
        const initialDensity = center * center;
        const evolvedDensity = initialDensity + dtAtomicUnits * dtAtomicUnits * hPsi * hPsi;
        initialDensities.push(initialDensity);
        evolvedDensities.push(evolvedDensity);
        normBefore += initialDensity;
        normAfterEuler += evolvedDensity;
        hPsiSquared += hPsi * hPsi;
        energyNumerator += center * hPsi;
        interiorSampleCount += 1;
      }
    }
  }

  const safeNormBefore = normBefore > 1e-18 ? normBefore : 1;
  const safeNormAfter = normAfterEuler > 1e-18 ? normAfterEuler : 1;
  const renormalizationScale = Math.sqrt(safeNormBefore / safeNormAfter);
  for (let i = 0; i < initialDensities.length; i += 1) {
    const initial = initialDensities[i] / safeNormBefore;
    const evolved = (evolvedDensities[i] * renormalizationScale * renormalizationScale) / safeNormBefore;
    const delta = Math.abs(evolved - initial);
    densityDriftL1 += delta;
    maxDensityDelta = Math.max(maxDensityDelta, delta);
  }
  const energyExpectationHartree = energyNumerator / safeNormBefore;
  const phaseRotationRad = -energyExpectationHartree * dtAtomicUnits;
  const normDrift = Math.abs((normAfterEuler / safeNormBefore) - 1);
  return {
    schema: QUANTUM_ORBITAL_WAVEFUNCTION_EVOLUTION_SCHEMA,
    modelId: 'central-difference-real-time-wavefunction-step-v0',
    mode: 'single-step-explicit-real-time-schrodinger',
    status: normDrift < 1e-4 ? 'finite-difference-stable' : normDrift < 5e-3 ? 'finite-difference-watch' : 'finite-difference-unstable',
    hamiltonian: 'H = -1/2 laplacian - Z_eff/r',
    integrator: 'first-order-explicit-complex-euler-renormalized',
    dtAtomicUnits,
    dtAttoseconds: dtAtomicUnits * 24.188843265857,
    energyExpectationHartree,
    energyExpectationEv: energyExpectationHartree * HARTREE_EV,
    phaseRotationRad,
    normBefore,
    normAfterEuler,
    normDrift,
    renormalizationScale,
    densityDriftL1,
    maxDensityDelta,
    hPsiNorm: Math.sqrt(Math.max(0, hPsiSquared)),
    gridSize,
    spacingBohr: spacing,
    interiorSampleCount,
    boundarySkippedCount: Math.max(0, gridSize ** 3 - interiorSampleCount - singularSkippedCount),
    singularSkippedCount,
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'This is a single explicit finite-difference Hamiltonian step for telemetry, not a stable production time propagator.',
        'The step starts from the base real screened hydrogenic orbital and renormalizes after the Euler update.'
      ]
    }
  };
}

function attachEigenResidual(summary, { element, activeOrbital, grid, options }) {
  const eigenResidual = summary.eigenResidual?.schema === QUANTUM_ORBITAL_EIGEN_RESIDUAL_SCHEMA
    ? summary.eigenResidual
    : estimateFiniteGridEigenResidual({ element, activeOrbital, grid, options });
  const wavefunctionEvolution = summary.wavefunctionEvolution?.schema === QUANTUM_ORBITAL_WAVEFUNCTION_EVOLUTION_SCHEMA
    ? summary.wavefunctionEvolution
    : estimateFiniteDifferenceWavefunctionEvolution({ element, activeOrbital, grid, options });
  const radialEigenstate = summary.radialEigenstate?.schema === QUANTUM_ORBITAL_RADIAL_EIGENSTATE_SCHEMA
    ? summary.radialEigenstate
    : solveRadialSchrodingerEigenstate({
        element,
        n: activeOrbital.n,
        l: activeOrbital.l,
        zEff: grid.zEff,
        options,
        gridPointCount: Math.max(192, grid.gridSize * 12)
      });
  return {
    ...summary,
    eigenResidual,
    eigenResidualSchema: eigenResidual.schema,
    eigenResidualStatus: eigenResidual.status,
    eigenResidualRelativeL2: eigenResidual.relativeL2,
    eigenResidualWeightedMeanHartree: eigenResidual.weightedMeanResidualHartree,
    eigenResidualWeightedMeanEv: eigenResidual.weightedMeanResidualEv,
    eigenResidualMaxAbsHartree: eigenResidual.maxAbsResidualHartree,
    eigenResidualInteriorSampleCount: eigenResidual.interiorSampleCount,
    wavefunctionEvolution,
    wavefunctionEvolutionSchema: wavefunctionEvolution.schema,
    wavefunctionEvolutionStatus: wavefunctionEvolution.status,
    wavefunctionEvolutionDtAtomicUnits: wavefunctionEvolution.dtAtomicUnits,
    wavefunctionEvolutionNormDrift: wavefunctionEvolution.normDrift,
    wavefunctionEvolutionDensityDriftL1: wavefunctionEvolution.densityDriftL1,
    wavefunctionEvolutionEnergyExpectationEv: wavefunctionEvolution.energyExpectationEv,
    wavefunctionEvolutionPhaseRotationRad: wavefunctionEvolution.phaseRotationRad,
    wavefunctionEvolutionInteriorSampleCount: wavefunctionEvolution.interiorSampleCount,
    radialEigenstate,
    radialEigenstateSchema: radialEigenstate.schema,
    radialEigenstateStatus: radialEigenstate.status,
    radialEigenstateEnergyEv: radialEigenstate.energyEv,
    radialEigenstateAnalyticEnergyEv: radialEigenstate.analyticEnergyEv,
    radialEigenstateEnergyErrorEv: radialEigenstate.energyErrorEv,
    radialEigenstateResidualRelativeL2: radialEigenstate.residualRelativeL2,
    radialEigenstateMeanRadiusBohr: radialEigenstate.meanRadiusBohr,
    radialEigenstateGridPointCount: radialEigenstate.gridPointCount,
    radialEigenstateNodeCountObserved: radialEigenstate.radialNodeCountObserved,
    radialEigenstateNodeCountTarget: radialEigenstate.radialNodeCountTarget
  };
}

function finiteGridOverrideMatches({ summary, element, activeOrbital, gridSize }) {
  if (!summary || summary.schema !== QUANTUM_ORBITAL_FINITE_GRID_SCHEMA) return false;
  return summary.elementSymbol === element.symbol
    && Math.round(finiteNumber(summary.principalN, -1)) === activeOrbital.n
    && Math.round(finiteNumber(summary.angularL, -1)) === activeOrbital.l
    && Math.round(finiteNumber(summary.magneticM, 999)) === activeOrbital.magneticM
    && Math.round(finiteNumber(summary.gridSize, -1)) === gridSize
    && Number.isFinite(Number(summary.sampleCount))
    && Number.isFinite(Number(summary.meanRadiusBohr))
    && Number.isFinite(Number(summary.rmsRadiusBohr))
    && Number.isFinite(Number(summary.normalizationError))
    && Number.isFinite(Number(summary.boundaryMass));
}

function isWebGpuOnlyFiniteGridSummary(summary) {
  return summary?.liveBackendPolicy === 'webgpu-only-no-cpu-fallback'
    || String(summary?.backend || '').startsWith('webgpu-')
    || Boolean(summary?.eigenResidualWebgpuSchema)
    || Boolean(summary?.wavefunctionEvolutionWebgpuSchema);
}

export function createFiniteGridSummary({ element, activeOrbital, gridSize, options, preferredSummary = null }) {
  const normalizedGridSize = normalizeGridSize(gridSize);
  if (finiteGridOverrideMatches({
    summary: preferredSummary,
    element,
    activeOrbital,
    gridSize: normalizedGridSize
  })) {
    const preferred = {
      ...preferredSummary,
      backend: preferredSummary.backend || 'worker-finite-grid-summary',
      reductionMode: preferredSummary.reductionMode || 'worker-provided-reduction'
    };
    if (isWebGpuOnlyFiniteGridSummary(preferred)) {
      return preferred;
    }
    if (preferred.eigenResidual?.schema === QUANTUM_ORBITAL_EIGEN_RESIDUAL_SCHEMA
      && preferred.wavefunctionEvolution?.schema === QUANTUM_ORBITAL_WAVEFUNCTION_EVOLUTION_SCHEMA) {
      return preferred;
    }
    const grid = buildOrbitalGrid({
      element,
      n: activeOrbital.n,
      l: activeOrbital.l,
      m: activeOrbital.magneticM,
      gridSize: normalizedGridSize,
      options
    });
    return attachEigenResidual(preferred, { element, activeOrbital, grid, options });
  }
  const key = finiteGridCacheKey({ element, activeOrbital, gridSize: normalizedGridSize, options });
  if (finiteGridCache.has(key)) return finiteGridCache.get(key);
  const grid = buildOrbitalGrid({
    element,
    n: activeOrbital.n,
    l: activeOrbital.l,
    m: activeOrbital.magneticM,
    gridSize: normalizedGridSize,
    options
  });
  const moments = summarizeFiniteGrid(grid);
  const summary = attachEigenResidual({
    schema: QUANTUM_ORBITAL_FINITE_GRID_SCHEMA,
    backend: 'cpu-finite-grid-reference',
    elementSymbol: element.symbol,
    atomicNumber: element.Z,
    principalN: activeOrbital.n,
    angularL: activeOrbital.l,
    magneticM: activeOrbital.magneticM,
    gridSize: normalizedGridSize,
    sampleCount: normalizedGridSize ** 3,
    extentBohr: grid.extentBohr,
    spacingBohr: grid.spacingBohr,
    zEff: grid.zEff,
    energyEv: grid.energyEv,
    normalization: grid.normalization,
    normalizationError: moments.normalizationError,
    boundaryMass: grid.boundaryMass,
    maxProbability: grid.maxProbability,
    maxRadiusBohr: grid.maxRadiusBohr,
    meanRadiusBohr: moments.meanRadiusBohr,
    rmsRadiusBohr: moments.rmsRadiusBohr,
    probabilityMass: moments.probabilityMass,
    reductionMode: 'cpu-reference-moment-reduction',
    webgpuStatus: null,
    webgpuError: null,
    parity: null
  }, { element, activeOrbital, grid, options });
  finiteGridCache.set(key, summary);
  trimFiniteGridCache();
  return summary;
}

function estimateQuantumProperties({ element, activeOrbital, shells, environment = {}, molecularDynamics = {}, normError = 0 }) {
  const zEff = effectiveNuclearCharge(element, activeOrbital.n, activeOrbital.l, {
    screeningExchange: true,
    relativisticSpinOrbit: element.Z >= 30,
    correlationMixing: element.Z >= 6
  });
  const energyEv = hydrogenicEnergyEv({ n: activeOrbital.n, zEff });
  const extentBohr = estimateOrbitalExtentBohr({ n: activeOrbital.n, zEff });
  const outerN = Math.max(...shells.map((shell) => shell.n), 1);
  const valenceElectronCount = shells
    .filter((shell) => shell.n === outerN)
    .reduce((sum, shell) => sum + shell.occupancy, 0);
  const activeOccupancyFraction = activeOrbital.capacity > 0
    ? activeOrbital.occupancy / activeOrbital.capacity
    : 0;
  const unpairedElectronCount = estimateUnpairedElectronCount(shells);
  const shellChargeRadius = (outerN * outerN) / Math.max(0.2, zEff);
  const polarizabilityProxy = clamp(
    (valenceElectronCount * shellChargeRadius * shellChargeRadius) / Math.max(1, element.Z),
    0,
    80
  );
  const electronegativityProxy = clamp(
    0.72 + 3.4 * (zEff / Math.max(1, activeOrbital.n * activeOrbital.n + zEff)) + 0.05 * activeOrbital.l,
    0.5,
    4.2
  );
  const valenceZEff = effectiveNuclearCharge(element, outerN, shells.find((shell) => shell.n === outerN)?.l || 0, {
    screeningExchange: true,
    relativisticSpinOrbit: element.Z >= 30
  });
  const ionizationEnergyProxyEv = Math.abs(hydrogenicEnergyEv({ n: outerN, zEff: valenceZEff }));
  const temperatureK = finiteNumber(
    molecularDynamics.meanTemperatureK,
    finiteNumber(environment.ambientTemperatureK, 294)
  );
  const pressurePa = Math.max(1, finiteNumber(environment.ambientPressurePa, 101325));
  const thermalRatio = (temperatureK * BOLTZMANN_EV_PER_K) / Math.max(0.05, ionizationEnergyProxyEv);
  const pressureScreening = clamp((101325 / pressurePa) ** 0.08, 0.45, 1.8);
  const mdIonization = clamp(finiteNumber(molecularDynamics.ionizationFraction, 0), 0, 1);
  const ionizationFraction = clamp(
    (thermalRatio * thermalRatio * pressureScreening) + mdIonization * 0.65,
    0,
    1
  );
  const conductivitySm = Math.max(
    0,
    finiteNumber(element.conductivitySpm, 0) * (0.08 + ionizationFraction * 0.92)
      + ionizationFraction * 4.5e4
  );
  const dielectricConstant = clamp(1 + polarizabilityProxy * 0.18 + ionizationFraction * 6, 1, 40);
  const magneticSusceptibility = clamp(unpairedElectronCount * 2.5e-5 + (element.radioactive ? 1.5e-5 : 0), 0, 0.0025);
  const normalization = clamp(1 - Math.abs(finiteNumber(normError, 0)), 0, 1.05);
  const totalBindingEnergyProxyEv = shells.reduce((sum, shell) => {
    const shellZEff = effectiveNuclearCharge(element, shell.n, shell.l, {
      screeningExchange: true,
      relativisticSpinOrbit: element.Z >= 30
    });
    return sum + shell.occupancy * hydrogenicEnergyEv({ n: shell.n, zEff: shellZEff });
  }, 0);

  return {
    zEff,
    energyEv,
    extentBohr,
    outerN,
    valenceElectronCount,
    activeOccupancyFraction,
    unpairedElectronCount,
    polarizabilityProxy,
    electronegativityProxy,
    ionizationEnergyProxyEv,
    ionizationFraction,
    conductivitySm,
    dielectricConstant,
    magneticSusceptibility,
    normalization,
    totalBindingEnergyProxyEv,
    bondingTendency: estimateBondingTendency(element, electronegativityProxy, valenceElectronCount, unpairedElectronCount)
  };
}

export function createQuantumOrbitalClosure({
  orbital = {},
  environment = {},
  molecularDynamics = {},
  timeSeconds = 0
} = {}) {
  const element = getElementBySymbol(orbital.elementSymbol || 'O');
  const shells = buildElectronConfiguration(element.Z);
  const activeOrbital = resolveActiveOrbital({ requested: orbital, shells });
  const configuration = summarizeElectronConfiguration(shells);
  const orbitalOptions = {
    screeningExchange: true,
    relativisticSpinOrbit: element.Z >= 30,
    correlationMixing: element.Z >= 6
  };
  const finiteGrid = createFiniteGridSummary({
    element,
    activeOrbital,
    gridSize: orbital.finiteGridSize,
    options: orbitalOptions,
    preferredSummary: orbital.finiteGridSummary || orbital.finiteGridOverride || null
  });
  const properties = estimateQuantumProperties({
    element,
    activeOrbital,
    shells,
    environment,
    molecularDynamics,
    normError: orbital.normError
  });
  const stateKey = `orbital:${element.symbol}:${activeOrbital.label}`;
  const sequence = Math.round(Math.max(0, finiteNumber(timeSeconds, 0)) * 1000);
  const closureState = makeClosureState({
    layerId: 'orbital',
    materialId: `element.${element.symbol.toLowerCase()}`,
    solverId: 'quantum-orbital-closure',
    stateKey,
    sequence,
    environment,
    primitive: {
      atomicNumber: element.Z,
      electronCount: element.Z,
      principalN: activeOrbital.n,
      angularL: activeOrbital.l,
      magneticM: activeOrbital.magneticM,
      zEff: properties.zEff,
      energyEv: properties.energyEv,
      ionizationFraction: properties.ionizationFraction
    },
    conserved: {
      electronCount: element.Z,
      totalChargeProxy: properties.ionizationFraction
    },
    species: {
      [element.symbol]: 1
    },
    fields: {
      electronConfiguration: configuration,
      activeOrbital: activeOrbital.label,
      valenceElectronCount: properties.valenceElectronCount,
      unpairedElectronCount: properties.unpairedElectronCount,
      finiteGrid
    },
    validity: {
      status: 'interactive-proxy',
      approximation: 'screened-hydrogenic-electron-shell',
      finiteGridSchema: finiteGrid.schema,
      radialEigenstateSchema: finiteGrid.radialEigenstateSchema
    }
  });
  const finiteGridBackend = String(finiteGrid.backend || '');
  const closureBackend = finiteGridBackend === 'webgpu-orbital-grid-probability-evaluation'
    ? 'webgpu-screened-hydrogenic-density-evaluation'
    : finiteGridBackend.startsWith('webgpu')
      ? 'webgpu-screened-hydrogenic-grid-reduction'
      : 'cpu-screened-hydrogenic';
  const webgpuWarning = finiteGridBackend === 'webgpu-orbital-grid-probability-evaluation'
    ? 'WebGPU path evaluates screened hydrogenic orbital density on a finite grid and self-normalizes reduced probability moments with no live CPU fallback.'
    : String(finiteGrid.backend || '').startsWith('webgpu')
      ? 'WebGPU path supplies finite-grid probability moments with no live CPU fallback.'
      : 'Finite-grid probability moments are CPU reference summaries until the WebGPU grid worker supplies a matching override.';
  const closureResult = makeClosureResult({
    modelId: QUANTUM_ORBITAL_MODEL_ID,
    source: {
      solverId: 'quantum-orbital-closure',
      stateKey,
      backend: closureBackend,
      sequence
    },
    state: closureState,
    thermodynamics: {
      temperatureK: finiteNumber(molecularDynamics.meanTemperatureK, finiteNumber(environment.ambientTemperatureK, 294)),
      pressurePa: finiteNumber(environment.ambientPressurePa, 101325),
      specificInternalEnergyJkg: Math.abs(properties.totalBindingEnergyProxyEv) * 96485.33212 / Math.max(1, element.Z)
    },
    transport: {
      electricalConductivitySm: properties.conductivitySm
    },
    electromagnetics: {
      conductivitySm: properties.conductivitySm,
      dielectricConstant: properties.dielectricConstant,
      magneticSusceptibility: properties.magneticSusceptibility
    },
    chemistry: {
      elementSymbol: element.symbol,
      atomicNumber: element.Z,
      electronConfiguration: configuration,
      activeOrbital: activeOrbital.label,
      valenceElectronCount: properties.valenceElectronCount,
      unpairedElectronCount: properties.unpairedElectronCount,
      electronegativityProxy: properties.electronegativityProxy,
      polarizabilityProxy: properties.polarizabilityProxy,
      ionizationEnergyProxyEv: properties.ionizationEnergyProxyEv,
      ionizationFraction: properties.ionizationFraction,
      bondingTendency: properties.bondingTendency
    },
    diagnostics: {
      schema: QUANTUM_ORBITAL_CLOSURE_SCHEMA,
      energyEv: properties.energyEv,
      zEff: properties.zEff,
      extentBohr: properties.extentBohr,
      normalization: properties.normalization,
      finiteGrid,
      radialEigenstate: finiteGrid.radialEigenstate,
      radialNodeCount: activeOrbital.radialNodeCount,
      angularNodeCount: activeOrbital.angularNodeCount,
      totalBindingEnergyProxyEv: properties.totalBindingEnergyProxyEv,
      activeOccupancyFraction: properties.activeOccupancyFraction
    },
    validity: {
      status: 'interactive-proxy',
      regimes: ['orbital', 'molecular'],
      warnings: [
        'Includes a one-electron radial finite-difference Schrodinger eigensolve for the active orbital; many-electron and molecular effects remain screened-hydrogenic proxies.',
        webgpuWarning
      ]
    },
    uncertainty: {
      mode: 'screened-hydrogenic-finite-grid-proxy',
      confidence: element.Z === 1 ? 0.7 : 0.32
    },
    conservation: {
      electronCount: element.Z,
      netChargeProxy: properties.ionizationFraction,
      energyReference: 'hydrogenic-screened-binding-energy'
    },
    provenance: {
      source: 'demos/multiscale/src/simulation/quantumOrbitalClosure.js',
      references: [
        'demos/schrodinger/src/quantum/orbitals.js',
        'demos/schrodinger/src/quantum/finiteDifferenceSolver.js',
        'demos/schrodinger/src/quantum/references.js',
        'demos/schrodinger/src/data/elements.js'
      ]
    }
  });

  return {
    schema: QUANTUM_ORBITAL_CLOSURE_SCHEMA,
    modelId: QUANTUM_ORBITAL_MODEL_ID,
    element: {
      symbol: element.symbol,
      name: element.name,
      atomicNumber: element.Z,
      category: element.category,
      radioactive: element.radioactive === true
    },
    activeOrbital,
    shellConfiguration: shells,
    electronConfiguration: configuration,
    finiteGrid,
    ...properties,
    closureResult
  };
}
