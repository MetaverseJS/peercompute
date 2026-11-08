import {
  QUANTUM_MATERIAL_FORCE_SURFACE_SCHEMA,
  QUANTUM_MATERIAL_POTENTIAL_SCHEMA,
  QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA,
  createQuantumMaterialPotential,
  createQuantumStatisticalSourceEquation
} from '../simulation/quantumMaterialPotential.js';

export const QUANTUM_MATERIAL_POTENTIAL_RESULT_SCHEMA = 'peercompute.multiscale.quantum-material-potential.result.v0';
export const QUANTUM_MATERIAL_POTENTIAL_DELTA_SCHEMA = 'peercompute.multiscale.quantum-material-potential.delta.v0';
export const QUANTUM_MATERIAL_POTENTIAL_BATCH_SCHEMA = 'peercompute.multiscale.quantum-material-potential.concurrent-batch.v0';
export const QUANTUM_MATERIAL_POTENTIAL_WEBGPU_SCHEMA = 'peercompute.multiscale.quantum-material-potential.webgpu-batch.v0';
export const QUANTUM_MATERIAL_PROPERTY_RESPONSE_SCHEMA = 'peercompute.multiscale.quantum-material-property-response.v0';
export const QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA = 'peercompute.multiscale.quantum-material-response-derivatives.v0';
export const QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA = 'peercompute.multiscale.quantum-material-molecular-geometry-source.v0';
export const QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA = 'peercompute.multiscale.quantum-material-electronic-charge-source.v0';
export const QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA = 'peercompute.multiscale.quantum-material-reaction-barrier-surface.v0';
export const QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA = 'peercompute.multiscale.quantum-material-product-topology.v0';
export const QUANTUM_MATERIAL_POTENTIAL_LIVE_BACKEND_POLICY = 'webgpu-only-no-cpu-fallback';

const DEFAULT_STATE_KEY = 'orbital:quantum-material-potential:active';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const WORKGROUP_SIZE = 64;
const RECORD_FLOATS = 12;
const OUTPUT_FLOATS = 24;
const ATM_PA = 101325;
const states = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

const MATERIAL_BATCH_SHADER = `
@group(0) @binding(0) var<storage, read> records: array<vec4f>;
@group(0) @binding(1) var<storage, read> params: array<f32>;
@group(0) @binding(2) var<storage, read_write> outputs: array<vec4f>;

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let index = gid.x;
  let recordCount = u32(params[0]);
  if (index >= recordCount) {
    return;
  }
  let temperatureK = params[1];
  let pressureRatio = params[2];
  let gravityNorm = params[3];
  let electricNorm = params[4];
  let magneticNorm = params[5];
  let radiationNorm = params[6];
  let oxygenFraction = params[7];
  let a = records[index * 3u + 0u];
  let b = records[index * 3u + 1u];
  let c = records[index * 3u + 2u];

  let baseRadiusAngstrom = max(0.01, a.y);
  let baseDensity = max(0.0, a.z);
  let phaseCode = a.w;
  let bulk = max(0.0, b.x);
  let young = max(0.0, b.y);
  let conductivity = max(0.0, b.z);
  let refractive = max(0.0, b.w);
  let bondEnergyEv = max(0.0, c.x);
  let bondLengthAngstrom = max(0.01, c.y);

  let tempNorm = clamp((temperatureK - 293.15) / 1200.0, -1.0, 3.0);
  let pressureLog = log2(max(1.0e-6, pressureRatio));
  let fieldDrive = clamp(electricNorm + magneticNorm + radiationNorm, 0.0, 4.0);
  let phaseSoftening = select(0.0, 0.35 + 0.18 * tempNorm, phaseCode >= 2.0);
  let compression = 1.0 + 0.018 * pressureLog;
  let thermalExpansion = 1.0 + 0.015 * tempNorm * (1.0 + 0.1 * baseRadiusAngstrom);

  let adjustedDensity = max(0.0, baseDensity * compression / max(0.2, thermalExpansion));
  let adjustedBulk = max(0.0, bulk * (1.0 + 0.035 * pressureLog) * max(0.05, 1.0 - phaseSoftening));
  let adjustedYoung = max(0.0, young * (1.0 + 0.03 * pressureLog) * max(0.05, 1.0 - phaseSoftening * 0.92));
  let adjustedConductivity = conductivity * (1.0 + 0.12 * fieldDrive + 0.08 * max(0.0, tempNorm));
  let opticalShift = refractive + 0.00008 * adjustedDensity / 1000.0 + 0.004 * radiationNorm;
  let dielectricProxy = max(1.0, opticalShift * opticalShift);
  let bondStrengthProxy = bondEnergyEv / max(0.1, bondLengthAngstrom);
  let alpha = clamp(sqrt(max(0.02, bondStrengthProxy) / max(0.2, 2.0 * max(0.1, bondEnergyEv))), 0.15, 4.0);
  let probeDisplacement = clamp(bondLengthAngstrom * (0.015 * tempNorm - 0.008 * pressureLog + 0.01 * fieldDrive), -0.12, 0.18);
  let expTerm = exp(-alpha * probeDisplacement);
  let hasBond = select(0.0, 1.0, bondEnergyEv > 0.0);
  let potentialEnergyEv = hasBond * (bondEnergyEv * pow(1.0 - expTerm, 2.0) - bondEnergyEv);
  let dEnergyDr = hasBond * (2.0 * bondEnergyEv * alpha * (1.0 - expTerm) * expTerm);
  let curvature = hasBond * (2.0 * bondEnergyEv * alpha * alpha * (2.0 * expTerm * expTerm - expTerm));
  let forceUncertainty = select(1.0, 0.45 + 0.1 * fieldDrive + 0.08 * abs(tempNorm), hasBond > 0.5);
  let behaviorDrive = clamp(
    0.2 * abs(tempNorm)
      + 0.08 * abs(pressureLog)
      + 0.14 * fieldDrive
      + 0.08 * gravityNorm
      + 0.08 * oxygenFraction
      + 0.025 * bondStrengthProxy,
    0.0,
    8.0
  );

  let kBT = max(1.0e-9, 8.617333262145e-5 * max(1.0, temperatureK));
  let ionizationProxyEv = max(0.1, 5.0 + 0.08 * max(1.0, a.x) + 0.25 * bondEnergyEv);
  let gapEv = clamp(abs(bondEnergyEv) * 0.18 + 0.08 * max(1.0, a.x), 0.025, max(0.05, ionizationProxyEv * 0.95));
  let degeneracy0 = max(1.0, 2.0 * (1.0 + floor(clamp(a.x, 0.0, 20.0) / 6.0)));
  let w0 = degeneracy0;
  let w1 = 3.0 * exp(-gapEv / kBT);
  let w2 = 5.0 * exp(-(2.1 * gapEv) / kBT);
  let continuum = exp(-ionizationProxyEv / kBT)
    * (1.0 + clamp(0.08 * pressureLog + 0.12 * fieldDrive, -0.08, 0.5));
  let partitionFn = max(1.0e-30, w0 + w1 + w2 + continuum);
  let excitedPopulation = clamp((w1 + w2) / partitionFn, 0.0, 1.0);
  let ionizationPopulation = clamp(continuum / partitionFn, 0.0, 1.0);
  let meanExcitationEv = (w1 * gapEv + w2 * 2.1 * gapEv + continuum * ionizationProxyEv) / partitionFn;
  let baseEnsemblePressurePa = 101325.0 * max(1.0e-9, pressureRatio)
    * (1.0 + 0.22 * ionizationPopulation);
  let degeneracyParameter = clamp(
    (adjustedDensity / 1000.0) * max(1.0, a.x) * 0.006 * pow(300.0 / max(1.0, temperatureK), 1.5),
    0.0,
    64.0
  );
  let ensemblePressurePa = baseEnsemblePressurePa * (1.0 + 0.04 * min(degeneracyParameter, 10.0) + 0.03 * excitedPopulation);
  let opacityProxy = clamp(
    0.015 * adjustedDensity / 1000.0
      + 0.55 * ionizationPopulation
      + 0.16 * excitedPopulation
      + 0.04 * radiationNorm,
    0.0,
    64.0
  );
  let heatCapacityProxy = clamp((meanExcitationEv / kBT) * (excitedPopulation + ionizationPopulation), 0.0, 64.0);
  let thermalExpansionSlopePerK = 0.015 * (1.0 + 0.1 * baseRadiusAngstrom) / 1200.0;
  let densityTemperatureDerivative = -adjustedDensity * thermalExpansionSlopePerK / max(0.2, thermalExpansion);
  let solidBulkFactor = max(0.05, 1.0 - phaseSoftening);
  let solidYoungFactor = max(0.05, 1.0 - phaseSoftening * 0.92);
  let mechanicalPressureDerivative = bulk * 0.035 * solidBulkFactor + 0.12 * young * 0.03 * solidYoungFactor;
  let conductivityFieldDerivative = conductivity * 0.12;
  let opacityRadiationDerivative = 0.04;

  outputs[index * 6u + 0u] = vec4f(adjustedDensity, adjustedBulk + 0.12 * adjustedYoung, adjustedConductivity + opticalShift, behaviorDrive);
  outputs[index * 6u + 1u] = vec4f(potentialEnergyEv, abs(dEnergyDr), curvature, forceUncertainty);
  outputs[index * 6u + 2u] = vec4f(log(partitionFn), excitedPopulation, ionizationPopulation, meanExcitationEv);
  outputs[index * 6u + 3u] = vec4f(ensemblePressurePa, opacityProxy, degeneracyParameter, heatCapacityProxy);
  outputs[index * 6u + 4u] = vec4f(adjustedConductivity, opticalShift, dielectricProxy, adjustedYoung);
  outputs[index * 6u + 5u] = vec4f(
    densityTemperatureDerivative,
    mechanicalPressureDerivative,
    conductivityFieldDerivative,
    opacityRadiationDerivative
  );
}
`;

export function getQuantumMaterialPotentialShaderSource() {
  return MATERIAL_BATCH_SHADER;
}

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function degeneracyRegime(value) {
  if (value > 1) return 'degenerate';
  if (value > 0.1) return 'partially-degenerate';
  return 'classical';
}

function getExecutionContext() {
  if (typeof WorkerGlobalScope !== 'undefined' && globalThis instanceof WorkerGlobalScope) return 'worker';
  if (typeof window !== 'undefined') return 'browser-main';
  return 'node';
}

function normalizeTaskPayload(payload = {}) {
  const input = payload.input && typeof payload.input === 'object' ? payload.input : payload;
  return {
    input,
    stateKey: input.stateKey || payload.stateKey || DEFAULT_STATE_KEY,
    taskId: input.taskId || payload.id || 'solver:quantum-material-potential:active',
    scope: input.scope || DEFAULT_DELTA_SCOPE,
    emitCommitDelta: input.emitCommitDelta !== false,
    sampleCount: Math.max(1, Math.floor(finite(input.sampleCount, 128)))
  };
}

function phaseCode(phase) {
  const text = String(phase || '').toLowerCase();
  if (text.includes('solid')) return 0;
  if (text.includes('liquid')) return 1;
  if (text.includes('gas') || text.includes('vapor')) return 2;
  if (text.includes('plasma')) return 3;
  return 1;
}

const ATOMIC_NUMBER_BY_SYMBOL = {
  H: 1,
  C: 6,
  N: 7,
  O: 8,
  F: 9,
  Na: 11,
  Mg: 12,
  Si: 14,
  P: 15,
  S: 16,
  Cl: 17,
  K: 19,
  Ca: 20,
  Fe: 26
};

const SYMBOL_BY_ATOMIC_NUMBER = new Map(
  Object.entries(ATOMIC_NUMBER_BY_SYMBOL).map(([symbol, atomicNumber]) => [atomicNumber, symbol])
);

const COVALENT_RADIUS_ANGSTROM = {
  H: 0.31,
  C: 0.76,
  N: 0.71,
  O: 0.66,
  Na: 1.66,
  Mg: 1.41,
  Cl: 1.02,
  K: 2.03,
  Ca: 1.76,
  Fe: 1.24
};

function atomicNumberForSymbol(symbol) {
  return ATOMIC_NUMBER_BY_SYMBOL[String(symbol || '').trim()] || 0;
}

function symbolForAtomicNumber(atomicNumber) {
  return SYMBOL_BY_ATOMIC_NUMBER.get(Math.round(finite(atomicNumber, 0))) || null;
}

function electronegativityForAtomicNumber(atomicNumber) {
  switch (Math.round(finite(atomicNumber, 0))) {
    case 1: return 2.2;
    case 6: return 2.55;
    case 7: return 3.04;
    case 8: return 3.44;
    case 9: return 3.98;
    case 11: return 0.93;
    case 12: return 1.31;
    case 14: return 1.9;
    case 15: return 2.19;
    case 16: return 2.58;
    case 17: return 3.16;
    case 19: return 0.82;
    case 20: return 1;
    case 26: return 1.83;
    default: return 2.1;
  }
}

function hardnessProxyForAtomicNumber(atomicNumber) {
  const z = Math.round(finite(atomicNumber, 0));
  const chi = electronegativityForAtomicNumber(z);
  const shellPenalty = z > 10 ? 0.9 : 0;
  return clamp(4.5 + chi * 1.8 + shellPenalty, 3.2, 13.5);
}

function chargeSignForAtomicNumber(atomicNumber) {
  const z = Math.round(finite(atomicNumber, 0));
  if (z === 8 || z === 9 || z === 17) return -1;
  if (z === 11 || z === 12 || z === 19 || z === 20 || z === 26) return 1;
  return 0.5;
}

function isReactiveMetalAtomicNumber(atomicNumber) {
  const z = Math.round(finite(atomicNumber, 0));
  return z === 11 || z === 12 || z === 19 || z === 20 || z === 26;
}

function isWaterElementAtomicNumber(atomicNumber) {
  const z = Math.round(finite(atomicNumber, 0));
  return z === 1 || z === 8;
}

function createNaWaterProductTopology({
  reactionSiteCount = 1,
  reactionId = 'na-h2o-to-naoh-h2-reduced-stoichiometry'
} = {}) {
  const siteCount = Math.max(1, Math.floor(finite(reactionSiteCount, 1)));
  return {
    schema: QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA,
    modelId: 'webgpu-qmat-reduced-naoh-h2-product-topology-v0',
    status: 'reduced-product-topology-ready',
    calibrated: false,
    webgpuDerived: true,
    reactionId,
    topologyMode: 'reduced-bond-graph-overlay',
    authoritativeAtomMutationReady: false,
    conservativeTopologyMutation: false,
    reducedBondGraphOverlayAvailable: true,
    reactionSiteCount: siteCount,
    maxReactionSiteCount: siteCount,
    products: [
      { formula: 'NaOH', moleculeType: 'sodium-hydroxide', atomCounts: { Na: 1, O: 1, H: 1 }, expectedBondCount: 2 },
      { formula: 'H2', moleculeType: 'hydrogen', atomCounts: { H: 2 }, expectedBondCount: 1, moleculeFractionPerNa: 0.5 }
    ],
    productBonds: [
      {
        productFormula: 'NaOH',
        pairLabel: 'Na-O',
        elements: ['Na', 'O'],
        order: 0.72,
        bondClass: 'ionic',
        targetDistanceReducedNm: 0.24,
        source: 'webgpu-qmat-reduced-product-topology'
      },
      {
        productFormula: 'NaOH',
        pairLabel: 'O-H',
        elements: ['O', 'H'],
        order: 0.96,
        bondClass: 'polar-covalent',
        targetDistanceReducedNm: 0.0957,
        source: 'webgpu-qmat-reduced-product-topology'
      },
      {
        productFormula: 'H2',
        pairLabel: 'H-H',
        elements: ['H', 'H'],
        order: 1,
        bondClass: 'covalent',
        targetDistanceReducedNm: 0.074,
        source: 'webgpu-qmat-reduced-product-topology'
      }
    ],
    sourceStoichiometry: {
      reactants: { Na: 1, H2O: 1 },
      products: { NaOH: 1, H2: 0.5 }
    },
    validity: {
      status: 'interactive-product-topology-proxy',
      warnings: [
        'Reduced WebGPU qmat product topology supplies a NaOH/H2 bond-graph overlay without creating or deleting atoms.',
        'Scientific mode must replace this with conservative topology mutation, calibrated kinetics, and energy-conserving charge transfer.'
      ]
    }
  };
}

function createNaWaterProductStoichiometry({
  targetContainsWater = false,
  targetContainsReactiveMetal = false,
  chargeTransferRequired = false,
  reactionProbabilityProxy = 0,
  chargeTransferGateProxy = 0,
  temperatureK = 293.15
} = {}) {
  if (!targetContainsWater || !targetContainsReactiveMetal || !chargeTransferRequired) return null;
  const thermalActivation = clamp((finite(temperatureK, 293.15) - 273.15) / 1200, 0, 1);
  const extentProxy = clamp(
    0.18
      + reactionProbabilityProxy * 0.48
      + chargeTransferGateProxy * 0.28
      + thermalActivation * 0.08,
    0,
    1
  );
  const heatReleaseEvPerNaProxy = 1.9;
  const productTopology = createNaWaterProductTopology({
    reactionSiteCount: Math.max(1, Math.round(1 + extentProxy * 3))
  });
  return {
    schema: 'peercompute.multiscale.quantum-material-product-stoichiometry.v0',
    modelId: 'reduced-na-water-product-stoichiometry-v0',
    status: 'reduced-product-stoichiometry-ready',
    calibrated: false,
    reactionId: 'na-h2o-to-naoh-h2-reduced-stoichiometry',
    reactants: { Na: 1, H2O: 1 },
    products: { NaOH: 1, H2: 0.5 },
    integerReaction: {
      reactants: { Na: 2, H2O: 2 },
      products: { NaOH: 2, H2: 1 }
    },
    limitingReactant: 'Na',
    chargeTransferElectronCount: 1,
    gasProductFormula: 'H2',
    gasProductMoleculeFractionPerNa: 0.5,
    enthalpyDeltaKjPerMolNaProxy: -184,
    heatReleaseEvPerNaProxy,
    heatReleaseProxy: clamp(extentProxy * heatReleaseEvPerNaProxy * 0.42, 0, 4),
    chargeDeltaProxy: clamp(extentProxy * 0.08, 0, 0.18),
    extentProxy,
    topologyProductAvailable: true,
    productTopologySchema: productTopology.schema,
    productTopologyModelId: productTopology.modelId,
    productTopology,
    productTopologyRequired: true,
    validity: {
      status: 'interactive-reaction-product-proxy',
      warnings: [
        'Na-water product stoichiometry is a reduced qmat handoff for source terms and a reduced NaOH/H2 bond-graph overlay.',
        'Scientific mode must replace this with calibrated reaction barriers, charge equilibration, product energetics, and conservative topology updates.'
      ]
    }
  };
}

function symbolsFromLabel(label = '') {
  const symbols = [];
  for (const match of String(label || '').matchAll(/[A-Z][a-z]?/g)) {
    const symbol = match[0];
    if (atomicNumberForSymbol(symbol) > 0) symbols.push(symbol);
  }
  return symbols;
}

function normalizeConditions(potential = {}) {
  const conditions = potential.conditions || {};
  return {
    temperatureK: finite(conditions.temperatureK, 293.15),
    pressurePa: Math.max(1, finite(conditions.pressurePa, ATM_PA)),
    pressureRatio: Math.max(1e-9, finite(conditions.pressurePa, ATM_PA) / ATM_PA),
    gravityNorm: clamp(Math.abs(finite(conditions.gravityMps2, 9.81)) / 24, 0, 4),
    electricNorm: clamp(Math.abs(finite(conditions.electricFieldVm, 0)) / 1e9, 0, 4),
    magneticNorm: clamp(Math.abs(finite(conditions.magneticFieldT, 0)) / 50, 0, 4),
    radiationNorm: clamp(Math.abs(finite(conditions.radiativeHeatFlux, 0)) / 5000, 0, 4),
    oxygenFraction: clamp(finite(conditions.oxygenFraction, 0.21), 0, 1)
  };
}

function recordFromAtom(atom = {}, weight = 1) {
  const symbol = atom.symbol || symbolForAtomicNumber(atom.atomicNumber) || 'atom';
  return {
    kind: 'atom',
    label: symbol,
    weight,
    atomicNumber: finite(atom.atomicNumber ?? atomicNumberForSymbol(symbol), 0),
    radiusAngstrom: finite(atom.covalentRadiusAngstrom ?? atom.vanDerWaalsRadiusAngstrom, COVALENT_RADIUS_ANGSTROM[symbol] || 1),
    densityKgM3: finite(atom.densityKgM3, 1),
    phaseCode: phaseCode(atom.phase),
    bulkModulusPa: finite(atom.bulkModulusPa, 0),
    youngsModulusPa: finite(atom.youngsModulusPa, 0),
    electricalConductivitySpm: finite(atom.electricalConductivitySpm, 0),
    refractiveIndex: finite(atom.refractiveIndex, 1),
    bondEnergyEv: 0,
    bondLengthAngstrom: finite(atom.covalentRadiusAngstrom, 1)
  };
}

function recordsFromPotentialSpecies(potential = {}) {
  const species = potential.closureResult?.state?.species || potential.species || {};
  const records = [];
  for (const [symbol, rawCount] of Object.entries(species || {})) {
    const atomicNumber = atomicNumberForSymbol(symbol);
    const count = finite(rawCount, 0);
    if (atomicNumber <= 0 || count <= 0) continue;
    records.push(recordFromAtom({
      symbol,
      atomicNumber,
      covalentRadiusAngstrom: COVALENT_RADIUS_ANGSTROM[symbol] || 1,
      phase: potential.phase
    }, count));
  }
  return records;
}

function recordFromMaterial(potential = {}, weight = 1) {
  return {
    kind: 'material',
    label: potential.dominantFormula || potential.elementSymbol || 'material',
    weight,
    atomicNumber: finite(potential.atomProperties?.atomicNumber, 0),
    radiusAngstrom: finite(potential.atomProperties?.covalentRadiusAngstrom, 1),
    densityKgM3: finite(potential.densityKgM3, 1),
    phaseCode: phaseCode(potential.phase),
    bulkModulusPa: finite(potential.bulkModulusPa, 0),
    youngsModulusPa: finite(potential.youngsModulusPa, 0),
    electricalConductivitySpm: finite(potential.electricalConductivitySpm, 0),
    refractiveIndex: finite(potential.refractiveIndex, 1),
    bondEnergyEv: 0,
    bondLengthAngstrom: finite(potential.atomProperties?.covalentRadiusAngstrom, 1)
  };
}

function recordFromBond(term = {}, weight = 1) {
  return {
    kind: 'bond',
    label: term.label || term.atoms?.join('-') || 'bond',
    weight,
    atomicNumber: 0,
    radiusAngstrom: finite(term.equilibriumLengthAngstrom, 1),
    densityKgM3: 0,
    phaseCode: 1,
    bulkModulusPa: finite(term.forceConstantProxy, 0) * 1e10,
    youngsModulusPa: finite(term.forceConstantProxy, 0) * 5e9,
    electricalConductivitySpm: 0,
    refractiveIndex: 1,
    bondEnergyEv: finite(term.dissociationEnergyEv, 0),
    bondLengthAngstrom: finite(term.equilibriumLengthAngstrom, 1)
  };
}

export function createQuantumMaterialBatchRecords(potential = {}, sampleCount = 128) {
  const seed = [
    recordFromMaterial(potential, Math.max(1, finite(potential.dominantCount, 1))),
    recordFromAtom(potential.atomProperties, 1),
    ...recordsFromPotentialSpecies(potential),
    ...(Array.isArray(potential.bondStrengthTerms)
      ? potential.bondStrengthTerms.map((term) => recordFromBond(term, 1))
      : [])
  ].filter((record) => record.label);
  const baseRecords = seed.length ? seed : [recordFromMaterial(potential, 1)];
  const count = Math.max(baseRecords.length, Math.floor(finite(sampleCount, baseRecords.length)));
  const records = [];
  for (let index = 0; index < count; index += 1) {
    const source = baseRecords[index % baseRecords.length];
    const variation = 1 + (((index * 17) % 11) - 5) * 0.002;
    records.push({
      ...source,
      index,
      densityKgM3: source.densityKgM3 * variation,
      bulkModulusPa: source.bulkModulusPa * variation,
      youngsModulusPa: source.youngsModulusPa * variation,
      electricalConductivitySpm: source.electricalConductivitySpm * variation
    });
  }
  return records;
}

function isWaterOhBondRecord(record = {}) {
  if (record.kind !== 'bond') return false;
  const label = String(record.label || '').toUpperCase().replace(/\s+/g, '');
  return label === 'O-H' || label === 'H-O' || label.includes('O-H') || label.includes('H-O');
}

function createMolecularGeometrySource({
  records = [],
  outputs = [],
  backend = 'unavailable',
  conditions = {},
  labelCounts = {},
  bondRecordCount = 0
} = {}) {
  let ohRecordCount = 0;
  let lengthSum = 0;
  let gradientSum = 0;
  let curvatureSum = 0;
  let uncertaintySum = 0;
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (!isWaterOhBondRecord(record)) continue;
    const output = outputs[index] || [];
    ohRecordCount += 1;
    lengthSum += finite(record.bondLengthAngstrom, 0.96);
    gradientSum += Math.abs(finite(output[5], finite(record.forceGradientEvPerAngstrom, 0)));
    curvatureSum += Math.abs(finite(output[6], finite(record.forceConstantProxy, 0)));
    uncertaintySum += clamp(finite(output[7], 0.5), 0, 8);
  }

  const hasWaterGeometry = ohRecordCount > 0 || labelCounts['O-H'] > 0 || labelCounts['H-O'] > 0;
  const targetOhDistanceAngstrom = hasWaterGeometry
    ? clamp(lengthSum / Math.max(1, ohRecordCount || labelCounts['O-H'] || labelCounts['H-O'] || 1), 0.45, 1.45)
    : 0.96;
  const targetAngleDeg = 104.52;
  const targetAngleRad = targetAngleDeg * Math.PI / 180;
  const targetOhDistanceReducedNm = targetOhDistanceAngstrom * 0.1;
  const targetHhDistanceAngstrom = 2 * targetOhDistanceAngstrom * Math.sin(targetAngleRad / 2);
  const meanGradient = ohRecordCount > 0 ? gradientSum / ohRecordCount : 0;
  const meanCurvature = ohRecordCount > 0 ? curvatureSum / ohRecordCount : 0;
  const meanUncertainty = ohRecordCount > 0 ? uncertaintySum / ohRecordCount : 1;
  const distanceStiffnessProxy = hasWaterGeometry
    ? clamp(0.72 + meanGradient * 0.12 + meanCurvature * 0.03 - meanUncertainty * 0.06, 0.35, 1.65)
    : 1;
  const angleStiffnessProxy = hasWaterGeometry
    ? clamp(0.68 + meanCurvature * 0.04 + meanGradient * 0.06 - meanUncertainty * 0.05, 0.32, 1.55)
    : 1;
  const confidence = hasWaterGeometry
    ? clamp(0.55 + Math.min(0.25, ohRecordCount / Math.max(1, bondRecordCount || records.length)) - meanUncertainty * 0.035, 0.2, 0.92)
    : 0;

  return {
    schema: QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA,
    modelId: 'webgpu-qmat-reduced-water-geometry-source-v0',
    status: hasWaterGeometry ? 'webgpu-geometry-source-ready' : 'no-water-geometry-record',
    backend,
    calibrated: false,
    webgpuDerived: String(backend || '').startsWith('webgpu'),
    targetMolecule: 'H2O',
    targetFormula: 'H2O',
    targetPairLabel: 'O-H',
    targetAngleDeg,
    targetAngleCos: Math.cos(targetAngleRad),
    targetOhDistanceAngstrom,
    targetOhDistanceReducedNm,
    targetHhDistanceAngstrom,
    targetHhDistanceReducedNm: targetHhDistanceAngstrom * 0.1,
    distanceStiffnessProxy,
    angleStiffnessProxy,
    confidence,
    sourceRecordCount: records.length,
    bondRecordCount,
    geometryRecordCount: ohRecordCount,
    meanForceGradientEvPerAngstrom: meanGradient,
    meanCurvatureEvPerAngstrom2: meanCurvature,
    meanUncertainty,
    conditionSnapshot: conditions,
    labelCounts: { ...labelCounts },
    validity: {
      status: 'interactive-geometry-source-proxy',
      warnings: [
        'Qmat molecular geometry source derives reduced H2O geometry targets from WebGPU bond records; it is not a calibrated Born-Oppenheimer geometry optimization.',
        'Scientific mode must replace this with validated quantum chemistry, force-field, or tabulated molecular geometry data.'
      ]
    }
  };
}

function createElectronicChargeSource({
  records = [],
  outputs = [],
  backend = 'unavailable',
  conditions = {},
  labelCounts = {},
  statisticalEnsemble = null,
  propertyResponse = null
} = {}) {
  let atomLikeCount = 0;
  let electronegativitySum = 0;
  let hardnessSum = 0;
  let donorDriveSum = 0;
  let acceptorDriveSum = 0;
  let pairRecordCount = 0;
  let pairElectronegativityDeltaSum = 0;
  let bestPairDelta = -Infinity;
  let bestDonorZ = 0;
  let bestAcceptorZ = 0;
  let bestPairLabel = null;

  for (const record of records) {
    const atomicNumber = Math.round(finite(record.atomicNumber, 0));
    if (atomicNumber > 0) {
      const chi = electronegativityForAtomicNumber(atomicNumber);
      const hardness = hardnessProxyForAtomicNumber(atomicNumber);
      atomLikeCount += 1;
      electronegativitySum += chi;
      hardnessSum += hardness;
      if (chargeSignForAtomicNumber(atomicNumber) > 0) donorDriveSum += Math.max(0, 2.4 - chi);
      if (chargeSignForAtomicNumber(atomicNumber) < 0) acceptorDriveSum += Math.max(0, chi - 2.4);
    }

    const symbols = symbolsFromLabel(record.label);
    if (symbols.length >= 2) {
      const a = atomicNumberForSymbol(symbols[0]);
      const b = atomicNumberForSymbol(symbols[1]);
      if (a > 0 && b > 0) {
        const chiA = electronegativityForAtomicNumber(a);
        const chiB = electronegativityForAtomicNumber(b);
        const delta = Math.abs(chiA - chiB);
        pairRecordCount += 1;
        pairElectronegativityDeltaSum += delta;
        if (delta > bestPairDelta) {
          bestPairDelta = delta;
          bestDonorZ = chiA <= chiB ? a : b;
          bestAcceptorZ = chiA > chiB ? a : b;
          bestPairLabel = `${symbolForAtomicNumber(bestAcceptorZ) || symbols[0]}-${symbolForAtomicNumber(bestDonorZ) || symbols[1]}`;
        }
      }
    }
  }

  const outputCount = Math.max(1, outputs.length);
  const meanIonizationFraction = clamp(finite(statisticalEnsemble?.ionizationFraction, 0), 0, 1);
  const meanOpacityProxy = clamp(finite(statisticalEnsemble?.opacityProxy, 0), 0, 64);
  const degeneracyParameter = clamp(finite(statisticalEnsemble?.degeneracyParameter, 0), 0, 128);
  const meanConductivity = clamp(finite(propertyResponse?.meanElectricalConductivitySpm, 0), 0, 1e12);
  const meanDielectric = clamp(finite(propertyResponse?.meanDielectricConstant, 1), 1, 256);
  const meanForceUncertainty = outputs.reduce((sum, output) => sum + clamp(finite(output?.[7], 0.5), 0, 8), 0) / outputCount;
  const fieldDrive = clamp(
    finite(conditions.electricNorm, 0) + finite(conditions.magneticNorm, 0) + finite(conditions.radiationNorm, 0),
    0,
    4
  );
  const tempDrive = clamp((finite(conditions.temperatureK, 293.15) - 293.15) / 2000, -0.3, 2);
  const meanPairDelta = pairRecordCount > 0 ? pairElectronegativityDeltaSum / pairRecordCount : 0;
  const meanElectronegativityProxy = atomLikeCount > 0 ? electronegativitySum / atomLikeCount : 2.1;
  const meanHardnessProxyEv = atomLikeCount > 0 ? hardnessSum / atomLikeCount : 7.5;
  const donorDriveProxy = clamp(donorDriveSum / Math.max(1, atomLikeCount), 0, 2);
  const acceptorDriveProxy = clamp(acceptorDriveSum / Math.max(1, atomLikeCount), 0, 2);
  const chargeMobilityProxy = clamp(
    Math.log10(Math.max(1, meanConductivity + 1)) / 8
      + meanIonizationFraction * 0.42
      + fieldDrive * 0.08
      + Math.max(0, tempDrive) * 0.06,
    0,
    1.5
  );
  const chargeTransferPotentialProxy = clamp(
    meanPairDelta * 0.18
      + Math.abs(acceptorDriveProxy - donorDriveProxy) * 0.06
      + meanIonizationFraction * 0.2
      + fieldDrive * 0.035,
    0,
    1.25
  );
  const hardnessSofteningProxy = clamp(
    meanIonizationFraction * 0.45
      + degeneracyParameter * 0.008
      + Math.max(0, tempDrive) * 0.08,
    0,
    0.72
  );
  const screeningDampingScale = clamp(
    1
      - Math.min(0.22, Math.log2(Math.max(1, meanDielectric)) * 0.028)
      + Math.min(0.12, meanIonizationFraction * 0.2),
    0.72,
    1.16
  );
  const ionizationDriveProxy = clamp(meanIonizationFraction * 0.22 + chargeMobilityProxy * 0.08 + meanOpacityProxy * 0.002, 0, 0.34);
  const chargeDeltaProxy = clamp(
    chargeTransferPotentialProxy * 0.035
      + ionizationDriveProxy * 0.08
      + chargeMobilityProxy * 0.012
      - meanForceUncertainty * 0.001,
    -0.02,
    0.1
  );
  const qeqMixProxy = clamp(0.06 + chargeTransferPotentialProxy * 0.11 + ionizationDriveProxy * 0.16, 0.04, 0.34);
  const confidence = clamp(
    0.45
      + (String(backend || '').startsWith('webgpu') ? 0.18 : 0)
      + Math.min(0.16, pairRecordCount * 0.035)
      - meanForceUncertainty * 0.025,
    0.1,
    0.9
  );

  return {
    schema: QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA,
    modelId: 'webgpu-qmat-reduced-electronic-charge-source-v0',
    status: records.length > 0 ? 'webgpu-electronic-charge-source-ready' : 'no-material-records',
    backend,
    calibrated: false,
    webgpuDerived: String(backend || '').startsWith('webgpu'),
    sourceRecordCount: records.length,
    atomLikeRecordCount: atomLikeCount,
    pairRecordCount,
    targetPairLabel: bestPairLabel || 'all-pairs',
    electronDonorElementZ: bestDonorZ,
    electronDonorElementSymbol: symbolForAtomicNumber(bestDonorZ),
    electronAcceptorElementZ: bestAcceptorZ,
    electronAcceptorElementSymbol: symbolForAtomicNumber(bestAcceptorZ),
    meanElectronegativityProxy,
    meanHardnessProxyEv,
    meanPairElectronegativityDeltaProxy: meanPairDelta,
    donorDriveProxy,
    acceptorDriveProxy,
    chargeTransferPotentialProxy,
    chargeDeltaProxy,
    ionizationDriveProxy,
    chargeMobilityProxy,
    hardnessSofteningProxy,
    screeningDampingScale,
    qeqMixProxy,
    confidence,
    conditionSnapshot: conditions,
    labelCounts: { ...labelCounts },
    validity: {
      status: 'interactive-electronic-charge-source-proxy',
      warnings: [
        'Qmat electronic charge source derives reduced charge-transfer/QEq drives from WebGPU material records and ensemble telemetry; it is not calibrated charge equilibration, QEq, ReaxFF, or quantum chemistry.',
        'Scientific mode must replace this with validated electronic-structure, force-field, or measured charge-transfer data.'
      ]
    }
  };
}

function createReactionBarrierSurface({
  records = [],
  outputs = [],
  backend = 'unavailable',
  conditions = {},
  labelCounts = {},
  bondRecordCount = 0,
  statisticalEnsemble = null,
  propertyResponse = null,
  electronicChargeSource = null
} = {}) {
  let pairRecordCount = 0;
  let waterBondRecordCount = 0;
  let reactiveMetalRecordCount = 0;
  let meanGradient = 0;
  let meanCurvature = 0;
  let meanUncertainty = 0;
  let bestPairDelta = -Infinity;
  let bestPairLabel = electronicChargeSource?.targetPairLabel || null;
  let bestDonorZ = Math.round(finite(electronicChargeSource?.electronDonorElementZ, 0));
  let bestAcceptorZ = Math.round(finite(electronicChargeSource?.electronAcceptorElementZ, 0));

  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    const output = outputs[index] || [];
    const atomicNumber = Math.round(finite(record.atomicNumber, 0));
    if (isReactiveMetalAtomicNumber(atomicNumber)) reactiveMetalRecordCount += 1;
    const symbols = symbolsFromLabel(record.label);
    if (symbols.length >= 2) {
      const a = atomicNumberForSymbol(symbols[0]);
      const b = atomicNumberForSymbol(symbols[1]);
      if (a > 0 && b > 0) {
        const chiA = electronegativityForAtomicNumber(a);
        const chiB = electronegativityForAtomicNumber(b);
        const delta = Math.abs(chiA - chiB);
        pairRecordCount += 1;
        meanGradient += Math.abs(finite(output[5], finite(record.forceGradientEvPerAngstrom, 0)));
        meanCurvature += Math.abs(finite(output[6], finite(record.forceConstantProxy, 0)));
        meanUncertainty += clamp(finite(output[7], 0.5), 0, 8);
        if (isWaterElementAtomicNumber(a) && isWaterElementAtomicNumber(b)) waterBondRecordCount += 1;
        if (delta > bestPairDelta) {
          bestPairDelta = delta;
          bestDonorZ = chiA <= chiB ? a : b;
          bestAcceptorZ = chiA > chiB ? a : b;
          bestPairLabel = `${symbolForAtomicNumber(bestAcceptorZ) || symbols[0]}-${symbolForAtomicNumber(bestDonorZ) || symbols[1]}`;
        }
      }
    }
  }

  const forceCount = Math.max(1, pairRecordCount || bondRecordCount);
  meanGradient /= forceCount;
  meanCurvature /= forceCount;
  meanUncertainty /= Math.max(1, pairRecordCount || records.length);
  const chargeTransferPotential = clamp(finite(electronicChargeSource?.chargeTransferPotentialProxy, 0), 0, 2);
  const ionizationDrive = clamp(finite(electronicChargeSource?.ionizationDriveProxy, 0), 0, 1);
  const mobility = clamp(finite(electronicChargeSource?.chargeMobilityProxy, 0), 0, 2);
  const fieldDrive = clamp(
    finite(conditions.electricNorm, 0) + finite(conditions.magneticNorm, 0) + finite(conditions.radiationNorm, 0),
    0,
    4
  );
  const temperatureK = finite(conditions.temperatureK, 293.15);
  const kBT = Math.max(0.025, 8.617333262145e-5 * Math.max(1, temperatureK));
  const tempDrive = clamp((temperatureK - 293.15) / 2500, -0.2, 2);
  const hasWaterBasis = waterBondRecordCount > 0 || labelCounts['O-H'] > 0 || labelCounts['H-O'] > 0;
  const targetContainsWater = isWaterElementAtomicNumber(bestDonorZ) || isWaterElementAtomicNumber(bestAcceptorZ) || hasWaterBasis;
  const targetContainsReactiveMetal = isReactiveMetalAtomicNumber(bestDonorZ)
    || isReactiveMetalAtomicNumber(bestAcceptorZ)
    || reactiveMetalRecordCount > 0;
  const chargeTransferRequired = chargeTransferPotential > 0.08 || ionizationDrive > 0.04;
  const activationEnergyEvProxy = clamp(
    0.42
      + meanCurvature * 0.045
      + meanGradient * 0.075
      + meanUncertainty * 0.035
      + (targetContainsWater ? 0.1 : 0.04)
      + (targetContainsReactiveMetal ? 0.24 : 0)
      - chargeTransferPotential * 0.22
      - ionizationDrive * 0.18
      - mobility * 0.04
      - tempDrive * 0.05
      - fieldDrive * 0.025,
    0.08,
    4.5
  );
  const reactionProbabilityProxy = clamp(
    Math.exp(-activationEnergyEvProxy / kBT) * (1 + chargeTransferPotential * 0.45 + ionizationDrive * 0.3),
    0,
    1
  );
  const chargeTransferGateProxy = clamp(
    (chargeTransferPotential + ionizationDrive * 0.6 + mobility * 0.12) / (activationEnergyEvProxy + 0.35),
    0,
    1
  );
  const productStoichiometry = createNaWaterProductStoichiometry({
    targetContainsWater,
    targetContainsReactiveMetal,
    chargeTransferRequired,
    reactionProbabilityProxy,
    chargeTransferGateProxy,
    temperatureK
  });
  const productStoichiometryAvailable = productStoichiometry?.status === 'reduced-product-stoichiometry-ready';
  const productTopology = productStoichiometry?.productTopology || null;
  const productTopologyAvailable = productTopology?.schema === QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA
    && productTopology.status === 'reduced-product-topology-ready';
  const unsupportedProductBlockerCount = chargeTransferRequired
    && targetContainsWater
    && targetContainsReactiveMetal
    && !productStoichiometryAvailable
    ? 1
    : 0;
  const gateDampingScale = clamp(
    1
      - chargeTransferGateProxy * 0.32
      - (unsupportedProductBlockerCount > 0 ? 0.18 : 0)
      + reactionProbabilityProxy * 0.08,
    0.42,
    1
  );
  const reactionBarrierGateProxy = clamp(1 - gateDampingScale, 0, 1);
  const confidence = clamp(
    0.42
      + (String(backend || '').startsWith('webgpu') ? 0.18 : 0)
      + Math.min(0.16, pairRecordCount * 0.028)
      + Math.min(0.1, finite(electronicChargeSource?.confidence, 0) * 0.1)
      - meanUncertainty * 0.025,
    0.1,
    0.88
  );

  return {
    schema: QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA,
    modelId: 'webgpu-qmat-reduced-reaction-barrier-surface-v0',
    status: records.length > 0 ? 'webgpu-reaction-barrier-proxy-ready' : 'no-material-records',
    backend,
    calibrated: false,
    webgpuDerived: String(backend || '').startsWith('webgpu'),
    barrierAvailable: records.length > 0,
    productStoichiometryAvailable,
    productTopologyAvailable,
    productStoichiometry,
    productTopology,
    chargeTransferRequired,
    targetReactionId: productStoichiometry?.reactionId
      || (unsupportedProductBlockerCount > 0 ? 'water-charge-transfer-product-gate-proxy' : 'dominant-pair-barrier-proxy'),
    targetPairLabel: bestPairLabel || 'all-pairs',
    reactantBasis: productStoichiometry
      ? Object.keys(productStoichiometry.reactants || {})
      : (hasWaterBasis ? ['H2O'] : []),
    productBasis: productStoichiometry ? Object.keys(productStoichiometry.products || {}) : [],
    productHeatReleaseEvPerNaProxy: productStoichiometry?.heatReleaseEvPerNaProxy || 0,
    productHeatReleaseProxy: productStoichiometry?.heatReleaseProxy || 0,
    productChargeDeltaProxy: productStoichiometry?.chargeDeltaProxy || 0,
    productExtentProxy: productStoichiometry?.extentProxy || 0,
    productGasFormula: productStoichiometry?.gasProductFormula || null,
    productGasMoleculeFractionPerNa: productStoichiometry?.gasProductMoleculeFractionPerNa || 0,
    productChargeTransferElectronCount: productStoichiometry?.chargeTransferElectronCount || 0,
    productEnthalpyDeltaKjPerMolNaProxy: productStoichiometry?.enthalpyDeltaKjPerMolNaProxy || 0,
    productTopologySchema: productTopology?.schema || null,
    productTopologyModelId: productTopology?.modelId || null,
    productTopologyMode: productTopology?.topologyMode || null,
    productTopologyReactionSiteCount: productTopology?.reactionSiteCount || 0,
    productTopologyReducedBondCount: Array.isArray(productTopology?.productBonds) ? productTopology.productBonds.length : 0,
    electronDonorElementZ: bestDonorZ,
    electronDonorElementSymbol: symbolForAtomicNumber(bestDonorZ),
    electronAcceptorElementZ: bestAcceptorZ,
    electronAcceptorElementSymbol: symbolForAtomicNumber(bestAcceptorZ),
    sourceRecordCount: records.length,
    bondRecordCount,
    pairRecordCount,
    waterBondRecordCount,
    reactiveMetalRecordCount,
    activationEnergyEvProxy,
    reactionProbabilityProxy,
    reactionCoordinateForceProxy: meanGradient,
    reactionCoordinateCurvatureProxy: meanCurvature,
    chargeTransferGateProxy,
    gateDampingScale,
    reactionBarrierGateProxy,
    unsupportedProductBlockerCount,
    meanUncertainty,
    confidence,
    conditionSnapshot: conditions,
    labelCounts: { ...labelCounts },
    source: {
      electronicChargeSourceSchema: electronicChargeSource?.schema || null,
      statisticalEnsembleSchema: statisticalEnsemble?.schema || null,
      propertyResponseSchema: propertyResponse?.schema || null
    },
    validity: {
      status: 'interactive-reaction-barrier-proxy',
      warnings: [
        'Qmat reaction barrier surface is a WebGPU-reduced proxy derived from force gradients, curvature, ensemble state, and electronic charge-source telemetry.',
        productStoichiometryAvailable
          ? 'Na-water product stoichiometry is available as a reduced source-term handoff, but conservative product topology remains pending.'
          : 'It gates unsupported reactive charge-transfer behavior until calibrated reaction barriers, product stoichiometry, QEq/ReaxFF, or quantum-chemistry labels are available.'
      ]
    }
  };
}

function encodeRecords(records) {
  const floats = new Float32Array(records.length * RECORD_FLOATS);
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    const offset = index * RECORD_FLOATS;
    floats[offset + 0] = finite(record.atomicNumber, 0);
    floats[offset + 1] = finite(record.radiusAngstrom, 1);
    floats[offset + 2] = finite(record.densityKgM3, 0);
    floats[offset + 3] = finite(record.phaseCode, 1);
    floats[offset + 4] = finite(record.bulkModulusPa, 0);
    floats[offset + 5] = finite(record.youngsModulusPa, 0);
    floats[offset + 6] = finite(record.electricalConductivitySpm, 0);
    floats[offset + 7] = finite(record.refractiveIndex, 1);
    floats[offset + 8] = finite(record.bondEnergyEv, 0);
    floats[offset + 9] = finite(record.bondLengthAngstrom, 1);
    floats[offset + 10] = finite(record.weight, 1);
    floats[offset + 11] = 0;
  }
  return floats;
}

function summarizeOutputs({ records, outputs, backend, webgpuStatus = null, webgpuError = null, conditions }) {
  let densitySum = 0;
  let bulkSum = 0;
  let responseSum = 0;
  let conductivitySum = 0;
  let refractiveSum = 0;
  let dielectricSum = 0;
  let youngSum = 0;
  let driveSum = 0;
  let maxDrive = 0;
  let potentialEnergySum = 0;
  let forceGradientSum = 0;
  let maxForceGradient = 0;
  let curvatureSum = 0;
  let forceUncertaintySum = 0;
  let forceRecordCount = 0;
  let partitionLogSum = 0;
  let excitedPopulationSum = 0;
  let ionizationPopulationSum = 0;
  let meanExcitationEnergySum = 0;
  let ensemblePressureSum = 0;
  let opacityProxySum = 0;
  let degeneracyParameterSum = 0;
  let heatCapacityProxySum = 0;
  let densityTemperatureDerivativeSum = 0;
  let mechanicalPressureDerivativeSum = 0;
  let conductivityFieldDerivativeSum = 0;
  let opacityRadiationDerivativeSum = 0;
  for (let index = 0; index < outputs.length; index += 1) {
    const output = outputs[index];
    densitySum += output[0];
    bulkSum += output[1];
    responseSum += output[2];
    driveSum += output[3];
    maxDrive = Math.max(maxDrive, output[3]);
    potentialEnergySum += output[4] || 0;
    forceGradientSum += output[5] || 0;
    maxForceGradient = Math.max(maxForceGradient, output[5] || 0);
    curvatureSum += output[6] || 0;
    forceUncertaintySum += output[7] || 0;
    partitionLogSum += output[8] || 0;
    excitedPopulationSum += output[9] || 0;
    ionizationPopulationSum += output[10] || 0;
    meanExcitationEnergySum += output[11] || 0;
    ensemblePressureSum += output[12] || 0;
    opacityProxySum += output[13] || 0;
    degeneracyParameterSum += output[14] || 0;
    heatCapacityProxySum += output[15] || 0;
    conductivitySum += output[16] ?? Math.max(0, (output[2] || 0) - 1);
    refractiveSum += output[17] ?? Math.max(1, Math.min(8, output[2] || 1));
    dielectricSum += output[18] ?? Math.max(1, Math.pow(output[17] ?? Math.max(1, Math.min(8, output[2] || 1)), 2));
    youngSum += output[19] ?? Math.max(0, output[1] || 0);
    densityTemperatureDerivativeSum += output[20] || 0;
    mechanicalPressureDerivativeSum += output[21] || 0;
    conductivityFieldDerivativeSum += output[22] || 0;
    opacityRadiationDerivativeSum += output[23] || 0;
    if ((output[5] || 0) > 0 || records[index]?.kind === 'bond') {
      forceRecordCount += 1;
    }
  }
  const count = Math.max(1, outputs.length);
  const bondRecordCount = records.filter((record) => record.kind === 'bond').length;
  const forceCount = Math.max(1, bondRecordCount || forceRecordCount);
  const labelCounts = {};
  for (const record of records) {
    labelCounts[record.label] = (labelCounts[record.label] || 0) + 1;
  }
  const molecularGeometrySource = createMolecularGeometrySource({
    records,
    outputs,
    backend,
    conditions,
    labelCounts,
    bondRecordCount
  });
  const meanDegeneracyParameter = degeneracyParameterSum / count;
  const responseDerivatives = {
    schema: QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA,
    modelId: 'webgpu-condition-response-derivatives-v0',
    status: 'webgpu-response-derivatives-ready',
    backend,
    calibrated: false,
    recordCount: records.length,
    coordinateBasis: [
      'temperatureK',
      'log2PressureRatio',
      'fieldDriveNorm',
      'radiationNorm'
    ],
    outputBasis: [
      'densityKgM3',
      'mechanicalResponsePa',
      'electricalConductivitySpm',
      'opacityProxy'
    ],
    meanDensityTemperatureDerivativeKgM3PerK: densityTemperatureDerivativeSum / count,
    meanMechanicalPressureDerivativePaPerLog2Pressure: mechanicalPressureDerivativeSum / count,
    meanConductivityFieldDerivativeSpmPerNorm: conductivityFieldDerivativeSum / count,
    meanOpacityRadiationDerivativePerNorm: opacityRadiationDerivativeSum / count,
    jacobian: {
      densityKgM3: {
        temperatureK: densityTemperatureDerivativeSum / count
      },
      mechanicalResponsePa: {
        log2PressureRatio: mechanicalPressureDerivativeSum / count
      },
      electricalConductivitySpm: {
        fieldDriveNorm: conductivityFieldDerivativeSum / count
      },
      opacityProxy: {
        radiationNorm: opacityRadiationDerivativeSum / count
      }
    },
    channels: [
      {
        id: 'density-temperature',
        output: 'densityKgM3',
        input: 'temperatureK',
        unit: 'kg m^-3 K^-1',
        derivative: densityTemperatureDerivativeSum / count,
        role: 'thermal-expansion-density-response'
      },
      {
        id: 'mechanical-pressure',
        output: 'mechanicalResponsePa',
        input: 'log2PressureRatio',
        unit: 'Pa per log2(P/P0)',
        derivative: mechanicalPressureDerivativeSum / count,
        role: 'compressive-stiffness-response'
      },
      {
        id: 'conductivity-field',
        output: 'electricalConductivitySpm',
        input: 'fieldDriveNorm',
        unit: 'S m^-1 per reduced-field',
        derivative: conductivityFieldDerivativeSum / count,
        role: 'electromagnetic-transport-response'
      },
      {
        id: 'opacity-radiation',
        output: 'opacityProxy',
        input: 'radiationNorm',
        unit: 'reduced per radiationNorm',
        derivative: opacityRadiationDerivativeSum / count,
        role: 'radiation-optical-response'
      }
    ],
    validity: {
      status: 'interactive-response-derivative-proxy',
      warnings: [
        'Response derivatives are WGSL-reduced sensitivities of the current proxy property model, not calibrated thermodynamic/transport/elastic tensors.',
        'Scientific mode must replace these with validated free-energy, EOS, DFPT, transport, or finite-difference reference derivatives.'
      ]
    }
  };
  const propertyResponse = {
    schema: QUANTUM_MATERIAL_PROPERTY_RESPONSE_SCHEMA,
    modelId: 'webgpu-condition-adjusted-material-property-response-v0',
    status: 'webgpu-property-response-ready',
    backend,
    calibrated: false,
    recordCount: records.length,
    temperatureK: conditions.temperatureK,
    pressurePa: ATM_PA * Math.max(1e-9, conditions.pressureRatio),
    meanDensityKgM3: densitySum / count,
    meanMechanicalResponsePa: bulkSum / count,
    meanBulkModulusPa: bulkSum / count,
    meanYoungsModulusPa: youngSum / count,
    meanElectricalConductivitySpm: conductivitySum / count,
    meanRefractiveIndex: refractiveSum / count,
    meanDielectricConstant: dielectricSum / count,
    meanOpticalAbsorptionProxy: opacityProxySum / count,
    responseDerivatives,
    source: {
      hamiltonian: 'screened-hydrogenic-orbital-plus-reference-material-records',
      responseModel: 'condition-adjusted-reference-property-batch'
    },
    validity: {
      status: 'interactive-property-response-proxy',
      warnings: [
        'Response fields are WebGPU-reduced condition-adjusted material proxies, not calibrated DFT/DFPT optical, transport, or elastic tensors.'
      ]
    }
  };
  const statisticalEnsemble = {
    schema: QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA,
    modelId: 'reduced-boltzmann-saha-degeneracy-bridge-v0',
    status: 'webgpu-ensemble-bridge-ready',
    backend,
    calibrated: false,
    firstPrinciplesUniversal: false,
    acceptableClosureIfLabeled: true,
    recordCount: records.length,
    temperatureK: conditions.temperatureK,
    pressurePa: ATM_PA * Math.max(1e-9, conditions.pressureRatio),
    partitionFunctionLog: partitionLogSum / count,
    excitedStatePopulation: excitedPopulationSum / count,
    ionizationFraction: ionizationPopulationSum / count,
    meanExcitationEnergyEv: meanExcitationEnergySum / count,
    ensemblePressurePa: ensemblePressureSum / count,
    opacityProxy: opacityProxySum / count,
    degeneracyParameter: meanDegeneracyParameter,
    degeneracyRegime: degeneracyRegime(meanDegeneracyParameter),
    heatCapacityProxy: heatCapacityProxySum / count,
    source: {
      hamiltonian: 'screened-hydrogenic-orbital-plus-reference-material-records',
      distribution: 'reduced-boltzmann-saha-degeneracy'
    },
    closureOutputs: {
      temperatureK: conditions.temperatureK,
      pressurePa: ensemblePressureSum / count,
      opacityProxy: opacityProxySum / count,
      ionizationFraction: ionizationPopulationSum / count,
      degeneracyParameter: meanDegeneracyParameter,
      degeneracyRegime: degeneracyRegime(meanDegeneracyParameter)
    },
    validity: {
      status: 'interactive-statistical-closure-proxy',
      warnings: [
        'Concurrent batch ensemble values are reduced distribution summaries over material records; not calibrated EOS/statistical physics.',
        'Use as labeled closure telemetry until first-principles or tabulated ensemble models replace this bridge.'
      ]
    }
  };
  statisticalEnsemble.sourceEquation = createQuantumStatisticalSourceEquation({
    statisticalEnsemble,
    conditions: {
      temperatureK: conditions.temperatureK,
      pressurePa: ATM_PA * Math.max(1e-9, conditions.pressureRatio)
    }
  });
  const electronicChargeSource = createElectronicChargeSource({
    records,
    outputs,
    backend,
    conditions,
    labelCounts,
    statisticalEnsemble,
    propertyResponse
  });
  const reactionBarrierSurface = createReactionBarrierSurface({
    records,
    outputs,
    backend,
    conditions,
    labelCounts,
    bondRecordCount,
    statisticalEnsemble,
    propertyResponse,
    electronicChargeSource
  });
  return {
    schema: QUANTUM_MATERIAL_POTENTIAL_BATCH_SCHEMA,
    backend,
    recordCount: records.length,
    workgroupSize: WORKGROUP_SIZE,
    workgroupCount: Math.ceil(records.length / WORKGROUP_SIZE),
    conditionSnapshot: conditions,
    meanDensityKgM3: densitySum / count,
    meanMechanicalResponsePa: bulkSum / count,
    meanOpticalElectricalResponse: responseSum / count,
    propertyResponse,
    meanBehaviorDrive: driveSum / count,
    maxBehaviorDrive: maxDrive,
    meanPotentialEnergyEv: potentialEnergySum / count,
    meanForceGradientEvPerAngstrom: forceGradientSum / count,
    maxForceGradientEvPerAngstrom: maxForceGradient,
    meanCurvatureEvPerAngstrom2: curvatureSum / count,
    meanForceSurfaceUncertainty: forceUncertaintySum / count,
    statisticalEnsemble,
    statisticalSourceEquation: statisticalEnsemble.sourceEquation,
    responseDerivatives,
    molecularGeometrySource,
    electronicChargeSource,
    reactionBarrierSurface,
    forceSurfacePreview: {
      schema: QUANTUM_MATERIAL_FORCE_SURFACE_SCHEMA,
      modelId: 'reduced-morse-bond-force-surface-preview-v0',
      status: bondRecordCount > 0 ? 'batch-reduced-force-preview-ready' : 'batch-no-bond-force-preview',
      calibrated: false,
      bornOppenheimerForcesAvailable: false,
      reducedEnergyGradientAvailable: bondRecordCount > 0,
      reactionBarrierSurfaceAvailable: reactionBarrierSurface.barrierAvailable === true,
      productStoichiometryAvailable: reactionBarrierSurface.productStoichiometryAvailable === true,
      reactionBarrierSurface,
      recordCount: records.length,
      bondRecordCount,
      meanPotentialEnergyEv: potentialEnergySum / forceCount,
      meanForceGradientEvPerAngstrom: forceGradientSum / forceCount,
      maxForceGradientEvPerAngstrom: maxForceGradient,
      meanCurvatureEvPerAngstrom2: curvatureSum / forceCount,
      meanUncertainty: forceUncertaintySum / count
    },
    labelCounts,
    recordKinds: {
      atom: records.filter((record) => record.kind === 'atom').length,
      material: records.filter((record) => record.kind === 'material').length,
      bond: records.filter((record) => record.kind === 'bond').length
    },
    concurrency: {
      mode: 'webgpu-storage-buffer-parallel-records',
      invocationCount: records.length,
      workgroupSize: WORKGROUP_SIZE,
      outputFloatsPerRecord: OUTPUT_FLOATS
    },
    webgpuStatus,
    webgpuError
  };
}

async function getGpuRuntime(stateKey) {
  if (gpuDisabledReasons.has(stateKey)) return null;
  if (gpuRuntimes.has(stateKey)) return gpuRuntimes.get(stateKey);
  try {
    if (!globalThis.navigator?.gpu) {
      gpuDisabledReasons.set(stateKey, 'navigator.gpu unavailable');
      return null;
    }
    const adapter = await globalThis.navigator.gpu.requestAdapter();
    if (!adapter) {
      gpuDisabledReasons.set(stateKey, 'requestAdapter returned null');
      return null;
    }
    const device = await adapter.requestDevice();
    device.pushErrorScope?.('validation');
    const shaderModule = device.createShaderModule({ code: MATERIAL_BATCH_SHADER });
    const pipeline = device.createComputePipeline({
      layout: 'auto',
      compute: { module: shaderModule, entryPoint: 'main' }
    });
    const validationError = await device.popErrorScope?.();
    if (validationError) {
      throw new Error(`Quantum material WebGPU shader validation failed: ${validationError.message || validationError}`);
    }
    const runtime = { device, pipeline };
    gpuRuntimes.set(stateKey, runtime);
    return runtime;
  } catch (error) {
    gpuDisabledReasons.set(stateKey, error instanceof Error ? error.message : String(error));
    return null;
  }
}

async function evaluateBatchWebGpu(records, conditions, stateKey) {
  const runtime = await getGpuRuntime(stateKey);
  if (!runtime) return null;
  const { device, pipeline } = runtime;
  const recordData = encodeRecords(records);
  const paramsData = new Float32Array([
    records.length,
    conditions.temperatureK,
    conditions.pressureRatio,
    conditions.gravityNorm,
    conditions.electricNorm,
    conditions.magneticNorm,
    conditions.radiationNorm,
    conditions.oxygenFraction
  ]);
  const outputBytes = records.length * OUTPUT_FLOATS * Float32Array.BYTES_PER_ELEMENT;
  const recordBuffer = device.createBuffer({
    size: recordData.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
  });
  const paramsBuffer = device.createBuffer({
    size: Math.max(32, paramsData.byteLength),
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
  });
  const outputBuffer = device.createBuffer({
    size: outputBytes,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
  });
  const readBuffer = device.createBuffer({
    size: outputBytes,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
  });
  device.queue.writeBuffer(recordBuffer, 0, recordData);
  device.queue.writeBuffer(paramsBuffer, 0, paramsData);
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: recordBuffer } },
      { binding: 1, resource: { buffer: paramsBuffer } },
      { binding: 2, resource: { buffer: outputBuffer } }
    ]
  });
  const commandEncoder = device.createCommandEncoder();
  const pass = commandEncoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(Math.ceil(records.length / WORKGROUP_SIZE));
  pass.end();
  commandEncoder.copyBufferToBuffer(outputBuffer, 0, readBuffer, 0, outputBytes);
  device.queue.submit([commandEncoder.finish()]);
  await readBuffer.mapAsync(GPUMapMode.READ);
  const raw = new Float32Array(readBuffer.getMappedRange()).slice();
  readBuffer.unmap();
  recordBuffer.destroy?.();
  paramsBuffer.destroy?.();
  outputBuffer.destroy?.();
  readBuffer.destroy?.();
  const nonZeroOutput = raw.some((value) => Number.isFinite(value) && Math.abs(value) > 1e-30);
  const nonZeroInput = records.some((record) => (
    Math.abs(finite(record.densityKgM3, 0)) > 1e-30
    || Math.abs(finite(record.bulkModulusPa, 0)) > 1e-30
    || Math.abs(finite(record.bondEnergyEv, 0)) > 1e-30
  ));
  if (nonZeroInput && !nonZeroOutput) {
    throw new Error('Quantum material WebGPU validation failed: zero readback for nonzero material records');
  }
  const outputs = [];
  for (let index = 0; index < records.length; index += 1) {
    const offset = index * OUTPUT_FLOATS;
    outputs.push(Array.from(raw.slice(offset, offset + OUTPUT_FLOATS)));
  }
  return {
    outputs,
    status: {
      schema: QUANTUM_MATERIAL_POTENTIAL_WEBGPU_SCHEMA,
      kernelMode: 'storage-buffer-property-force-ensemble-batch',
      recordCount: records.length,
      workgroupSize: WORKGROUP_SIZE,
      workgroupCount: Math.ceil(records.length / WORKGROUP_SIZE)
    }
  };
}

function createDeltaPayload({ input, stateKey, sequence, potential, batch, diagnostics, backend, webgpuStatus, webgpuError }) {
  return {
    schema: QUANTUM_MATERIAL_POTENTIAL_DELTA_SCHEMA,
    solverId: 'quantum-material-potential',
    stateKey,
    sequence,
    status: diagnostics?.status || 'unknown',
    backend,
    liveBackendPolicy: QUANTUM_MATERIAL_POTENTIAL_LIVE_BACKEND_POLICY,
    materialId: potential.materialId,
    elementSymbol: potential.elementSymbol,
    dominantFormula: potential.dominantFormula,
    batch,
    diagnostics,
    webgpuStatus,
    webgpuError,
    environment: input.environment || null
  };
}

function createDiagnostics({ potential, batch = null, status = 'unknown' }) {
  return {
    schema: QUANTUM_MATERIAL_POTENTIAL_SCHEMA,
    status,
    materialId: potential.materialId,
    elementSymbol: potential.elementSymbol,
    dominantFormula: potential.dominantFormula,
    densityKgM3: potential.densityKgM3,
    bulkModulusPa: potential.bulkModulusPa,
    youngsModulusPa: potential.youngsModulusPa,
    refractiveIndex: potential.refractiveIndex,
    electricalConductivitySpm: potential.electricalConductivitySpm,
    unsupportedReactiveChemistry: potential.unsupportedChemistry?.unsupportedReactiveChemistry === true,
    blockedInteractionCount: potential.unsupportedChemistry?.blockedInteractionCount || 0,
    forceGradientAvailable: potential.potentialTerms?.bornOppenheimerForcesAvailable === true,
    reducedForceGradientAvailable: potential.potentialTerms?.reducedEnergyGradientAvailable === true,
    reactionBarrierAvailable: potential.potentialTerms?.reactionBarrierSurfaceAvailable === true,
    forceSurfacePreview: potential.forceSurfacePreview || null,
    lawGraphFragment: potential.lawGraphFragment || null,
    statisticalEnsemble: batch?.statisticalEnsemble || potential.statisticalEnsemble || null,
    batch
  };
}

function withCommitDelta(value, resolved, { input, potential, batch, diagnostics, backend, webgpuStatus, webgpuError }) {
  if (!resolved.emitCommitDelta) return value;
  return {
    value,
    commitDelta: {
      taskId: resolved.taskId,
      scope: resolved.scope,
      version: value.sequence || 0,
      timestamp: Date.now(),
      payload: createDeltaPayload({
        input,
        stateKey: resolved.stateKey,
        sequence: value.sequence || 0,
        potential,
        batch,
        diagnostics,
        backend,
        webgpuStatus,
        webgpuError
      })
    }
  };
}

function createBlockedResult(resolved, {
  input,
  potential,
  records,
  conditions,
  sequence,
  status = 'blocked-webgpu-unavailable',
  backend = 'webgpu-unavailable',
  reason = 'WebGPU unavailable; live quantum material potential execution has no CPU fallback.',
  webgpuError = null
}) {
  const webgpuStatus = {
    schema: QUANTUM_MATERIAL_POTENTIAL_WEBGPU_SCHEMA,
    status,
    kernelMode: 'storage-buffer-property-force-ensemble-batch',
    liveBackendPolicy: QUANTUM_MATERIAL_POTENTIAL_LIVE_BACKEND_POLICY,
    recordCount: records.length,
    workgroupSize: WORKGROUP_SIZE,
    workgroupCount: Math.ceil(records.length / WORKGROUP_SIZE),
    reason,
    conditionSnapshot: conditions
  };
  const diagnostics = createDiagnostics({ potential, batch: null, status });
  states.set(resolved.stateKey, {
    sequence,
    backend,
    status,
    materialId: potential.materialId,
    recordCount: records.length
  });
  const value = {
    ok: false,
    schema: QUANTUM_MATERIAL_POTENTIAL_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: resolved.input?.solverId || 'quantum-material-potential',
    taskId: resolved.taskId,
    stateKey: resolved.stateKey,
    status,
    backend,
    liveBackendPolicy: QUANTUM_MATERIAL_POTENTIAL_LIVE_BACKEND_POLICY,
    sequence,
    elapsedTime: sequence,
    potential,
    batch: null,
    diagnostics,
    conservation: {
      mode: 'blocked-webgpu-only-property-evaluation',
      mutatesState: false,
      forceSurfaceConservative: false,
      reducedEnergyGradientAvailable: false,
      statisticalEnsembleBridgeAvailable: false,
      ensembleBridgeMutatesState: false,
      recordCount: records.length,
      blocker: status,
      reason
    },
    webgpuStatus,
    webgpuError: webgpuError || reason
  };
  return withCommitDelta(value, resolved, {
    input,
    potential,
    batch: null,
    diagnostics,
    backend,
    webgpuStatus,
    webgpuError: value.webgpuError
  });
}

export function resetQuantumMaterialPotential() {
  states.clear();
  for (const runtime of gpuRuntimes.values()) {
    runtime.device?.destroy?.();
  }
  gpuRuntimes.clear();
  gpuDisabledReasons.clear();
}

export async function stepQuantumMaterialPotential(payload = {}) {
  const resolved = normalizeTaskPayload(payload);
  const { input, stateKey } = resolved;
  const state = states.get(stateKey) || { sequence: 0 };
  const sequence = state.sequence + 1;
  const potential = createQuantumMaterialPotential({
    quantumOrbital: input.quantumOrbital || {},
    environment: input.environment || {},
    molecularDynamics: input.molecularDynamics || {},
    timeSeconds: finite(input.timeSeconds, 0)
  });
  const records = createQuantumMaterialBatchRecords(potential, resolved.sampleCount);
  const conditions = normalizeConditions(potential);
  let webgpu;
  try {
    webgpu = await evaluateBatchWebGpu(records, conditions, stateKey);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return createBlockedResult(resolved, {
      input,
      potential,
      records,
      conditions,
      sequence,
      status: 'blocked-webgpu-execution-error',
      backend: 'webgpu-execution-error',
      reason,
      webgpuError: reason
    });
  }
  if (!webgpu) {
    const reason = gpuDisabledReasons.get(stateKey) || 'WebGPU unavailable; live quantum material potential execution has no CPU fallback.';
    return createBlockedResult(resolved, {
      input,
      potential,
      records,
      conditions,
      sequence,
      status: 'blocked-webgpu-unavailable',
      backend: 'webgpu-unavailable',
      reason,
      webgpuError: reason
    });
  }
  const backend = 'webgpu-quantum-material-property-batch';
  const webgpuStatus = webgpu.status;
  const webgpuError = null;
  const outputs = webgpu.outputs;
  const batch = summarizeOutputs({ records, outputs, backend, webgpuStatus, webgpuError, conditions });
  states.set(stateKey, {
    sequence,
    backend,
    materialId: potential.materialId,
    recordCount: records.length
  });
  const diagnostics = createDiagnostics({ potential, batch, status: 'webgpu-executed' });
  const value = {
    ok: true,
    schema: QUANTUM_MATERIAL_POTENTIAL_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'quantum-material-potential',
    stateKey,
    status: 'webgpu-executed',
    backend,
    liveBackendPolicy: QUANTUM_MATERIAL_POTENTIAL_LIVE_BACKEND_POLICY,
    sequence,
    elapsedTime: sequence,
    potential,
    batch,
    diagnostics,
    conservation: {
      mode: 'property-evaluation-only',
      mutatesState: false,
      forceSurfaceConservative: false,
      reducedEnergyGradientAvailable: potential.potentialTerms?.reducedEnergyGradientAvailable === true,
      statisticalEnsembleBridgeAvailable: Boolean(batch.statisticalEnsemble),
      ensembleBridgeMutatesState: false,
      recordCount: records.length
    },
    webgpuStatus,
    webgpuError
  };
  return withCommitDelta(value, resolved, {
    input,
    potential,
    batch,
    diagnostics,
    backend,
    webgpuStatus,
    webgpuError
  });
}
