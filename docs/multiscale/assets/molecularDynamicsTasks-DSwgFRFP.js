export const MOLECULAR_DYNAMICS_STATE_SCHEMA = 'peercompute.multiscale.molecular-dynamics.state.v0';
export const MOLECULAR_DYNAMICS_RESULT_SCHEMA = 'peercompute.multiscale.molecular-dynamics.result.v0';
export const MOLECULAR_DYNAMICS_DELTA_SCHEMA = 'peercompute.multiscale.molecular-dynamics.delta.v0';
export const MOLECULAR_QUANTUM_COUPLING_SCHEMA = 'peercompute.multiscale.molecular-quantum-coupling.v0';
export const MOLECULAR_QUANTUM_SOURCE_SCHEMA = 'peercompute.multiscale.molecular-quantum-source.v0';
export const MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA = 'peercompute.multiscale.molecular-quantum-material-source.v0';
export const MOLECULAR_CHARGE_EQUILIBRATION_SCHEMA = 'peercompute.multiscale.molecular-charge-equilibration.v0';
export const MOLECULAR_FORCE_LAW_SCHEMA = 'peercompute.multiscale.molecular-force-law.v0';
export const MOLECULAR_FORCE_ENERGY_LEDGER_SCHEMA = 'peercompute.multiscale.molecular-force-energy-ledger.v0';
export const MOLECULAR_GEOMETRY_FORCE_LAW_SCHEMA = 'peercompute.multiscale.molecular-geometry-force-law.v0';
export const MOLECULAR_THERMO_PHASE_LEDGER_SCHEMA = 'peercompute.multiscale.molecular-thermo-phase-ledger.v0';
export const MOLECULAR_REACTION_LEDGER_SCHEMA = 'peercompute.multiscale.molecular-reaction-ledger.v0';
export const MOLECULAR_REACTION_EVENT_LEDGER_SCHEMA = 'peercompute.multiscale.molecular-reaction-event-ledger.v0';
export const MOLECULAR_REACTION_SOURCE_SCHEMA = 'peercompute.multiscale.molecular-reaction-source.v0';
export const MOLECULAR_QMAT_PRODUCT_CONSERVATION_AUDIT_SCHEMA =
  'peercompute.multiscale.molecular-qmat-product-conservation-audit.v0';
export const MOLECULAR_QMAT_PRODUCT_TOPOLOGY_MUTATION_SCHEMA =
  'peercompute.multiscale.molecular-qmat-product-topology-mutation.v0';
export const MOLECULAR_ULG_STATE_SOURCE_SCHEMA = 'peercompute.multiscale.molecular-ulg-state-source.v0';
export const MOLECULAR_DYNAMICS_WEBGPU_MAX_ATOMS = 4096;
export const MOLECULAR_DYNAMICS_MAX_BONDS = 1024;
export const MOLECULAR_DYNAMICS_ATOM_FLOAT_STRIDE = 13;

const QUANTUM_ORBITAL_GRID_WAVEFUNCTION_EVOLUTION_WEBGPU_SCHEMA =
  'peercompute.multiscale.quantum-orbital-grid.wavefunction-evolution-webgpu.v0';
const QUANTUM_ORBITAL_GRID_STATISTICAL_BRIDGE_SCHEMA =
  'peercompute.multiscale.quantum-orbital-grid.statistical-bridge-webgpu.v0';
const QUANTUM_ORBITAL_RADIAL_WEBGPU_SCHEMA = 'peercompute.schrodinger.radial-webgpu-eigensolver.v0';
const QUANTUM_MATERIAL_POTENTIAL_SCHEMA = 'peercompute.multiscale.quantum-material-potential.v0';
const QUANTUM_MATERIAL_POTENTIAL_BATCH_SCHEMA = 'peercompute.multiscale.quantum-material-potential.concurrent-batch.v0';
const QUANTUM_MATERIAL_FORCE_SURFACE_SCHEMA = 'peercompute.multiscale.quantum-material-force-surface-preview.v0';
const QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA = 'peercompute.multiscale.quantum-statistical-ensemble.v0';
const QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA = 'peercompute.multiscale.quantum-statistical-source-equation.v0';
const QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA = 'peercompute.multiscale.quantum-material-response-derivatives.v0';
const QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA = 'peercompute.multiscale.quantum-material-molecular-geometry-source.v0';
const QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA = 'peercompute.multiscale.quantum-material-electronic-charge-source.v0';
const QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA = 'peercompute.multiscale.quantum-material-reaction-barrier-surface.v0';
const QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA = 'peercompute.multiscale.quantum-material-product-topology.v0';
const QUANTUM_SOURCE_WEBGPU_WORKER = 'webgpu-worker';
const QUANTUM_SOURCE_CPU_REFERENCE = 'cpu-reference';

const DEFAULT_STATE_KEY = 'molecular:dynamics:patch';
const DEFAULT_DELTA_SCOPE = 'multiscale-solver-deltas';
const WORKGROUP_SIZE = 64;
const ATOM_FLOATS = MOLECULAR_DYNAMICS_ATOM_FLOAT_STRIDE;
const ATOM_TOPOLOGY_GROUP_ID_OFFSET = 10;
const ATOM_TOPOLOGY_GROUP_TYPE_OFFSET = 11;
const ATOM_TOPOLOGY_LOCAL_INDEX_OFFSET = 12;
const ATOM_TOPOLOGY_METADATA_FLOATS = 3;
const PARAM_FLOATS = 64;
const PARAM_BYTES = PARAM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
const MOLECULAR_DYNAMICS_CELL_SIZE = 0.42;
const MOLECULAR_DYNAMICS_FORCE_RADIUS = 0.9;
const MOLECULAR_NEIGHBOR_CELL_SIZE = MOLECULAR_DYNAMICS_CELL_SIZE;
const MOLECULAR_NEIGHBOR_GRID_DIM_X = 10;
const MOLECULAR_NEIGHBOR_GRID_DIM_Y = 10;
const MOLECULAR_NEIGHBOR_GRID_DIM_Z = 10;
const MOLECULAR_NEIGHBOR_GRID_ORIGIN = -2.1;
const MOLECULAR_NEIGHBOR_GRID_EXTENT = MOLECULAR_NEIGHBOR_CELL_SIZE * MOLECULAR_NEIGHBOR_GRID_DIM_X;
const MOLECULAR_NEIGHBOR_CELL_COUNT = MOLECULAR_NEIGHBOR_GRID_DIM_X
  * MOLECULAR_NEIGHBOR_GRID_DIM_Y
  * MOLECULAR_NEIGHBOR_GRID_DIM_Z;
const MOLECULAR_NEIGHBOR_MAX_CELL_OCCUPANCY = 64;
const MOLECULAR_NEIGHBOR_MAX_NEIGHBORS_PER_ATOM = 96;
const MOLECULAR_NEIGHBOR_STATS_UINTS = 4;
const WATER_OH_REST_REDUCED_NM = 0.096;
const WATER_HOH_TARGET_ANGLE_DEG = 104.52;
const WATER_HOH_TARGET_COS = Math.cos(WATER_HOH_TARGET_ANGLE_DEG * Math.PI / 180);
const WATER_HH_TARGET_REDUCED_NM = 2 * WATER_OH_REST_REDUCED_NM * Math.sin(WATER_HOH_TARGET_ANGLE_DEG * Math.PI / 360);

const ELEMENT = {
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

const ELEMENT_DATA = {
  1: { symbol: 'H', mass: 1.008, radius: 0.031, charge: 0.08, valence: 1, electronegativity: 2.2, metal: false },
  6: { symbol: 'C', mass: 12.011, radius: 0.076, charge: 0.04, valence: 4, electronegativity: 2.55, metal: false },
  7: { symbol: 'N', mass: 14.007, radius: 0.071, charge: -0.1, valence: 3, electronegativity: 3.04, metal: false },
  8: { symbol: 'O', mass: 15.999, radius: 0.066, charge: -0.18, valence: 2, electronegativity: 3.44, metal: false },
  9: { symbol: 'F', mass: 18.998, radius: 0.057, charge: -0.22, valence: 1, electronegativity: 3.98, metal: false },
  11: { symbol: 'Na', mass: 22.99, radius: 0.166, charge: 0.55, valence: 1, electronegativity: 0.93, metal: true },
  12: { symbol: 'Mg', mass: 24.305, radius: 0.141, charge: 0.42, valence: 2, electronegativity: 1.31, metal: true },
  14: { symbol: 'Si', mass: 28.085, radius: 0.111, charge: 0.12, valence: 4, electronegativity: 1.9, metal: false },
  15: { symbol: 'P', mass: 30.974, radius: 0.107, charge: 0.08, valence: 3, electronegativity: 2.19, metal: false },
  16: { symbol: 'S', mass: 32.06, radius: 0.105, charge: -0.04, valence: 2, electronegativity: 2.58, metal: false },
  17: { symbol: 'Cl', mass: 35.45, radius: 0.102, charge: -0.55, valence: 1, electronegativity: 3.16, metal: false },
  19: { symbol: 'K', mass: 39.098, radius: 0.203, charge: 0.62, valence: 1, electronegativity: 0.82, metal: true },
  20: { symbol: 'Ca', mass: 40.078, radius: 0.176, charge: 0.5, valence: 2, electronegativity: 1, metal: true },
  26: { symbol: 'Fe', mass: 55.845, radius: 0.124, charge: 0.18, valence: 2, electronegativity: 1.83, metal: true }
};

const MOLECULE_GROUP_TYPE = Object.freeze({
  atom: 0,
  water: 1,
  carbonDioxide: 2,
  methane: 3,
  salt: 4,
  sodiumHydroxide: 5,
  hydrogen: 6
});

function moleculeGroupTypeCode(type) {
  if (type === 'water') return MOLECULE_GROUP_TYPE.water;
  if (type === 'carbon-dioxide') return MOLECULE_GROUP_TYPE.carbonDioxide;
  if (type === 'methane') return MOLECULE_GROUP_TYPE.methane;
  if (type === 'salt') return MOLECULE_GROUP_TYPE.salt;
  if (type === 'sodium-hydroxide') return MOLECULE_GROUP_TYPE.sodiumHydroxide;
  if (type === 'hydrogen') return MOLECULE_GROUP_TYPE.hydrogen;
  return MOLECULE_GROUP_TYPE.atom;
}

export const SUPPORTED_MOLECULAR_ELEMENTS = Object.freeze(
  Object.values(ELEMENT_DATA)
    .map(({ symbol, mass, valence }) => ({ symbol, atomicNumber: ELEMENT[symbol], mass, valence }))
);

const SYMBOL_BY_Z = new Map(Object.entries(ELEMENT_DATA).map(([z, data]) => [Number(z), data.symbol]));
const Z_BY_SYMBOL = new Map(Object.entries(ELEMENT).map(([symbol, z]) => [symbol.toLowerCase(), z]));

const MOLECULAR_SHADER = `
struct Params {
  atomCount: f32,
  dt: f32,
  ambientTemperatureK: f32,
  ambientPressurePa: f32,
  fireIntensity: f32,
  oxygenFraction: f32,
  radiativeHeatFlux: f32,
  gravityMps2: f32,
  waterContact: f32,
  cellSize: f32,
  searchRadius: f32,
  gridOrigin: f32,
  gridDimX: f32,
  gridDimY: f32,
  gridDimZ: f32,
  maxNeighbors: f32,
  ulgActive: f32,
  ulgTemperatureDeltaK: f32,
  ulgChargeDeltaProxy: f32,
  ulgVelocityDeltaProxy: f32,
  ulgMagneticDeltaProxy: f32,
  ulgEnergyDeltaProxy: f32,
  ulgReadiness: f32,
  ulgReserved: f32,
  quantumActive: f32,
  quantumAtomicNumber: f32,
  quantumTargetCharge: f32,
  quantumTemperatureDeltaK: f32,
  quantumBondOrderScale: f32,
  quantumIonizationDrive: f32,
  quantumEvolutionDrive: f32,
  quantumMix: f32,
  quantumMaterialActive: f32,
  quantumMaterialBondOrderScale: f32,
  quantumMaterialTemperatureDeltaK: f32,
  quantumMaterialChargeDeltaProxy: f32,
  quantumMaterialIonizationDrive: f32,
  quantumMaterialForceGradientDrive: f32,
  quantumMaterialBehaviorDrive: f32,
  quantumMaterialUncertainty: f32,
  quantumMaterialPairForceScale: f32,
  quantumMaterialRestLengthDeltaAngstrom: f32,
  quantumMaterialPairForceMix: f32,
  quantumMaterialPrimaryElementZ: f32,
  quantumMaterialSecondaryElementZ: f32,
  quantumMaterialPairSelectivity: f32,
  quantumMaterialPairFallbackFactor: f32,
  quantumMaterialEnsemblePressureDrive: f32,
  quantumMaterialEnsemblePressureRatio: f32,
  quantumMaterialHeatCapacityProxy: f32,
  quantumMaterialThermalDampingScale: f32,
  quantumMaterialConductivityDrive: f32,
  quantumMaterialDielectricDrive: f32,
  quantumMaterialMechanicalStiffnessDrive: f32,
  quantumMaterialOpticalAbsorptionDrive: f32,
  quantumMaterialGeometryActive: f32,
  quantumMaterialGeometryTargetOhDistanceReducedNm: f32,
  quantumMaterialGeometryTargetHhDistanceReducedNm: f32,
  quantumMaterialGeometryTargetAngleCos: f32,
  quantumMaterialGeometryDistanceStiffnessProxy: f32,
  quantumMaterialGeometryAngleStiffnessProxy: f32,
  quantumMaterialGeometryConfidence: f32,
  quantumMaterialReactionBarrierGate: f32,
};

@group(0) @binding(0) var<storage, read> currentAtoms: array<f32>;
@group(0) @binding(1) var<storage, read_write> nextAtoms: array<f32>;
@group(0) @binding(2) var<uniform> params: Params;

var<workgroup> tilePosElement: array<vec4f, ${WORKGROUP_SIZE}>;
var<workgroup> tileChargeTemp: array<vec4f, ${WORKGROUP_SIZE}>;

fn clampf(value: f32, lo: f32, hi: f32) -> f32 {
  return min(hi, max(lo, value));
}

fn qmatPairTargetFactor(element: f32, otherElement: f32) -> f32 {
  if (params.quantumMaterialActive <= 0.5) {
    return 0.0;
  }
  let primary = params.quantumMaterialPrimaryElementZ;
  let secondary = params.quantumMaterialSecondaryElementZ;
  let selectivity = clampf(params.quantumMaterialPairSelectivity, 0.0, 1.0);
  let fallback = clampf(params.quantumMaterialPairFallbackFactor, 0.0, 1.0);
  var matched = 1.0 - selectivity;
  if (primary > 0.5 && secondary > 0.5) {
    let direct = abs(element - primary) < 0.5 && abs(otherElement - secondary) < 0.5;
    let reverse = abs(element - secondary) < 0.5 && abs(otherElement - primary) < 0.5;
    matched = select(fallback, 1.0, direct || reverse);
  } else if (primary > 0.5) {
    let containsPrimary = abs(element - primary) < 0.5 || abs(otherElement - primary) < 0.5;
    matched = select(fallback, 1.0, containsPrimary);
  }
  return clampf(matched, 0.0, 1.0);
}

fn qmatAtomTargetFactor(element: f32) -> f32 {
  if (params.quantumMaterialActive <= 0.5) {
    return 0.0;
  }
  let primary = params.quantumMaterialPrimaryElementZ;
  let secondary = params.quantumMaterialSecondaryElementZ;
  let fallback = clampf(params.quantumMaterialPairFallbackFactor, 0.0, 1.0);
  if (primary > 0.5 && secondary > 0.5) {
    let matched = abs(element - primary) < 0.5 || abs(element - secondary) < 0.5;
    return select(fallback, 1.0, matched);
  }
  if (primary > 0.5) {
    return select(fallback, 1.0, abs(element - primary) < 0.5);
  }
  return 1.0;
}

fn qmatChargeSign(element: f32) -> f32 {
  var sign = select(0.5, -1.0, element == 8.0 || element == 9.0 || element == 17.0);
  sign = select(sign, 1.0, element == 11.0 || element == 12.0 || element == 19.0 || element == 20.0 || element == 26.0);
  return sign;
}

fn elementMatches(element: f32, targetElement: f32) -> bool {
  return abs(element - targetElement) < 0.5;
}

fn covalentRadiusForElement(element: f32) -> f32 {
  var radius = 0.07;
  if (elementMatches(element, 1.0)) { radius = 0.031; }
  if (elementMatches(element, 6.0)) { radius = 0.076; }
  if (elementMatches(element, 7.0)) { radius = 0.071; }
  if (elementMatches(element, 8.0)) { radius = 0.066; }
  if (elementMatches(element, 9.0)) { radius = 0.057; }
  if (elementMatches(element, 11.0)) { radius = 0.166; }
  if (elementMatches(element, 12.0)) { radius = 0.141; }
  if (elementMatches(element, 14.0)) { radius = 0.111; }
  if (elementMatches(element, 15.0)) { radius = 0.107; }
  if (elementMatches(element, 16.0)) { radius = 0.105; }
  if (elementMatches(element, 17.0)) { radius = 0.102; }
  if (elementMatches(element, 19.0)) { radius = 0.203; }
  if (elementMatches(element, 20.0)) { radius = 0.176; }
  if (elementMatches(element, 26.0)) { radius = 0.124; }
  return radius;
}

fn electronegativityForElementShader(element: f32) -> f32 {
  var chi = 2.1;
  if (elementMatches(element, 1.0)) { chi = 2.2; }
  if (elementMatches(element, 6.0)) { chi = 2.55; }
  if (elementMatches(element, 7.0)) { chi = 3.04; }
  if (elementMatches(element, 8.0)) { chi = 3.44; }
  if (elementMatches(element, 9.0)) { chi = 3.98; }
  if (elementMatches(element, 11.0)) { chi = 0.93; }
  if (elementMatches(element, 12.0)) { chi = 1.31; }
  if (elementMatches(element, 14.0)) { chi = 1.9; }
  if (elementMatches(element, 15.0)) { chi = 2.19; }
  if (elementMatches(element, 16.0)) { chi = 2.58; }
  if (elementMatches(element, 17.0)) { chi = 3.16; }
  if (elementMatches(element, 19.0)) { chi = 0.82; }
  if (elementMatches(element, 20.0)) { chi = 1.0; }
  if (elementMatches(element, 26.0)) { chi = 1.83; }
  return chi;
}

fn metalFactorForElement(element: f32) -> f32 {
  if (elementMatches(element, 11.0) || elementMatches(element, 12.0) || elementMatches(element, 19.0) || elementMatches(element, 20.0) || elementMatches(element, 26.0)) {
    return 1.0;
  }
  return 0.0;
}

fn molecularPairRestLengthReducedNm(element: f32, otherElement: f32) -> f32 {
  let radiusSum = covalentRadiusForElement(element) + covalentRadiusForElement(otherElement);
  let metalA = metalFactorForElement(element);
  let metalB = metalFactorForElement(otherElement);
  let enDelta = abs(electronegativityForElementShader(element) - electronegativityForElementShader(otherElement));
  let ionicPair = ((metalA > 0.5 && metalB < 0.5) || (metalB > 0.5 && metalA < 0.5)) && enDelta >= 1.1;
  var restLength = radiusSum * 1.12;
  if (ionicPair) {
    restLength = restLength * 1.08;
  }
  return clampf(restLength, 0.058, 0.34);
}

fn molecularPairAffinity(element: f32, otherElement: f32) -> f32 {
  let same = elementMatches(element, otherElement);
  let metalA = metalFactorForElement(element);
  let metalB = metalFactorForElement(otherElement);
  let enDelta = abs(electronegativityForElementShader(element) - electronegativityForElementShader(otherElement));
  let metalMismatch = (metalA > 0.5 && metalB < 0.5) || (metalB > 0.5 && metalA < 0.5);
  let bothNonMetal = metalA < 0.5 && metalB < 0.5;
  var affinity = 0.35;
  if (same) {
    affinity = 0.28;
    if (elementMatches(element, 1.0)) { affinity = 0.62; }
    if (elementMatches(element, 6.0)) { affinity = 0.86; }
  } else if (metalMismatch && enDelta >= 1.1) {
    affinity = 0.82;
  } else if (bothNonMetal) {
    affinity = 0.76 + clampf(enDelta * 0.1, 0.0, 0.22);
  } else {
    affinity = 0.38;
  }
  let hydrogenOxygen = (elementMatches(element, 1.0) && elementMatches(otherElement, 8.0))
    || (elementMatches(element, 8.0) && elementMatches(otherElement, 1.0));
  let hydrogenNitrogen = (elementMatches(element, 1.0) && elementMatches(otherElement, 7.0))
    || (elementMatches(element, 7.0) && elementMatches(otherElement, 1.0));
  let carbonOxygen = (elementMatches(element, 6.0) && elementMatches(otherElement, 8.0))
    || (elementMatches(element, 8.0) && elementMatches(otherElement, 6.0));
  if (hydrogenOxygen || hydrogenNitrogen || carbonOxygen) {
    affinity = max(affinity, 1.04);
  }
  return clampf(affinity, 0.18, 1.12);
}

fn waterOhPair(element: f32, otherElement: f32) -> bool {
  return (elementMatches(element, 8.0) && elementMatches(otherElement, 1.0))
    || (elementMatches(element, 1.0) && elementMatches(otherElement, 8.0));
}

fn waterHhPair(element: f32, otherElement: f32) -> bool {
  return elementMatches(element, 1.0) && elementMatches(otherElement, 1.0);
}

fn waterElement(element: f32) -> bool {
  return elementMatches(element, 1.0) || elementMatches(element, 8.0);
}

fn reactiveMetalWaterPair(element: f32, otherElement: f32) -> bool {
  return (metalFactorForElement(element) > 0.5 && waterElement(otherElement))
    || (metalFactorForElement(otherElement) > 0.5 && waterElement(element));
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(
  @builtin(global_invocation_id) global_id: vec3<u32>,
  @builtin(local_invocation_id) local_id: vec3<u32>
) {
  let i = global_id.x;
  let count = u32(params.atomCount);
  let isActive = i < count;
  let localIndex = local_id.x;
  let base = i * ${ATOM_FLOATS}u;
  var pos = vec3f(0.0, 0.0, 0.0);
  var vel = vec3f(0.0, 0.0, 0.0);
  var mass = 1.0;
  var element = 0.0;
  var charge = 0.0;
  var temp = params.ambientTemperatureK;
  var moleculeGroupId = -1.0;
  var moleculeGroupType = 0.0;
  var moleculeLocalIndex = 0.0;
  if (isActive) {
    pos = vec3f(currentAtoms[base + 0u], currentAtoms[base + 1u], currentAtoms[base + 2u]);
    vel = vec3f(currentAtoms[base + 3u], currentAtoms[base + 4u], currentAtoms[base + 5u]);
    mass = max(0.25, currentAtoms[base + 6u]);
    element = currentAtoms[base + 7u];
    charge = currentAtoms[base + 8u];
    temp = max(1.0, currentAtoms[base + 9u]);
    moleculeGroupId = currentAtoms[base + ${ATOM_TOPOLOGY_GROUP_ID_OFFSET}u];
    moleculeGroupType = currentAtoms[base + ${ATOM_TOPOLOGY_GROUP_TYPE_OFFSET}u];
    moleculeLocalIndex = currentAtoms[base + ${ATOM_TOPOLOGY_LOCAL_INDEX_OFFSET}u];
  }
  if (isActive && params.ulgActive > 0.5) {
    let parity = select(-1.0, 1.0, (i & 1u) == 0u);
    temp = clampf(temp + params.ulgTemperatureDeltaK, 1.0, 250000.0);
    charge = clampf(charge + params.ulgChargeDeltaProxy, -1.4, 1.4);
    vel.y = clampf(vel.y + params.ulgVelocityDeltaProxy, -100.0, 100.0);
    vel.x = clampf(vel.x + params.ulgMagneticDeltaProxy * parity * 0.5, -100.0, 100.0);
    vel.z = clampf(vel.z - params.ulgMagneticDeltaProxy * parity * 0.5, -100.0, 100.0);
  }
  if (isActive && params.quantumActive > 0.5 && abs(element - params.quantumAtomicNumber) < 0.5) {
    temp = clampf(temp + params.quantumTemperatureDeltaK, 1.0, 250000.0);
    charge = clampf(charge * (1.0 - params.quantumMix) + params.quantumTargetCharge * params.quantumMix, -1.4, 1.4);
  }
  var force = vec3f(0.0, -0.00008 * params.gravityMps2 * mass, 0.0);
  var nearO = 0.0;
  var nearC = 0.0;
  var nearH = 0.0;
  var materialNeighborFactorSum = 0.0;
  var materialNeighborFactorCount = 0.0;
  var waterH1Delta = vec3f(0.0, 0.0, 0.0);
  var waterH2Delta = vec3f(0.0, 0.0, 0.0);
  var waterH1Dist = 999.0;
  var waterH2Dist = 999.0;

  for (var tileStart = 0u; tileStart < count; tileStart = tileStart + ${WORKGROUP_SIZE}u) {
    let loadIndex = tileStart + localIndex;
    if (loadIndex < count) {
      let loadBase = loadIndex * ${ATOM_FLOATS}u;
      tilePosElement[localIndex] = vec4f(
        currentAtoms[loadBase + 0u],
        currentAtoms[loadBase + 1u],
        currentAtoms[loadBase + 2u],
        currentAtoms[loadBase + 7u]
      );
      tileChargeTemp[localIndex] = vec4f(
        currentAtoms[loadBase + 8u],
        currentAtoms[loadBase + 9u],
        0.0,
        0.0
      );
    } else {
      tilePosElement[localIndex] = vec4f(0.0, 0.0, 0.0, 0.0);
      tileChargeTemp[localIndex] = vec4f(0.0, 0.0, 0.0, 0.0);
    }
    workgroupBarrier();

    let tileCount = min(${WORKGROUP_SIZE}u, count - tileStart);
    for (var tileOffset = 0u; tileOffset < tileCount; tileOffset = tileOffset + 1u) {
      let j = tileStart + tileOffset;
      if (!isActive || j == i) {
        continue;
      }
      let otherPacked = tilePosElement[tileOffset];
      let otherPos = otherPacked.xyz;
      let otherElement = otherPacked.w;
      let otherCharge = tileChargeTemp[tileOffset].x;
      let delta = otherPos - pos;
      let dist2 = max(0.0025, dot(delta, delta));
      let dist = sqrt(dist2);
      let dir = delta / dist;
      let pairRestLength = molecularPairRestLengthReducedNm(element, otherElement);
      let pairAffinity = molecularPairAffinity(element, otherElement);
      let quantumPair = params.quantumActive > 0.5
        && (abs(element - params.quantumAtomicNumber) < 0.5 || abs(otherElement - params.quantumAtomicNumber) < 0.5);
      var materialPairTargetFactor = qmatPairTargetFactor(element, otherElement);
      if (params.quantumMaterialActive > 0.5) {
        let reactionBarrierGate = clampf(params.quantumMaterialReactionBarrierGate, 0.0, 1.0);
        if (reactiveMetalWaterPair(element, otherElement)) {
          materialPairTargetFactor = materialPairTargetFactor * (1.0 - clampf(reactionBarrierGate * 1.85, 0.0, 0.84));
        }
        materialNeighborFactorSum = materialNeighborFactorSum + materialPairTargetFactor;
        materialNeighborFactorCount = materialNeighborFactorCount + 1.0;
      }
      let materialBondScale = 1.0 + (params.quantumMaterialBondOrderScale - 1.0) * materialPairTargetFactor;
      let materialPairForceScale = 1.0 + (params.quantumMaterialPairForceScale - 1.0) * materialPairTargetFactor;
      let materialPairForceMix = params.quantumMaterialPairForceMix * materialPairTargetFactor;
      let materialEnsemblePressureDrive = params.quantumMaterialEnsemblePressureDrive * materialPairTargetFactor;
      let materialStiffnessDrive = params.quantumMaterialMechanicalStiffnessDrive * materialPairTargetFactor;
      let materialRestLength = max(0.045, pairRestLength + params.quantumMaterialRestLengthDeltaAngstrom * materialPairForceMix - materialEnsemblePressureDrive * 0.006);
      let bondScale = select(1.0, params.quantumBondOrderScale, quantumPair) * materialBondScale;
      let materialEnsemblePairScale = clampf(1.0 + materialEnsemblePressureDrive * 0.16, 0.84, 1.16);
      let materialStiffnessPairScale = clampf(1.0 + materialStiffnessDrive * 0.045, 0.92, 1.12);
      let bondPull = (
        clampf((materialRestLength - dist) / materialRestLength, -0.8, 1.4) * bondScale
        + params.quantumMaterialForceGradientDrive * materialPairTargetFactor * (0.04 + materialPairForceMix * 0.025)
      ) * materialPairForceScale * materialEnsemblePairScale * materialStiffnessPairScale * pairAffinity;
      let thermalBreak = clampf((temp - 850.0) / 1600.0, 0.0, 0.75);
      let ljRepulse = clampf((0.055 / dist2) - 0.06, -0.05, 1.8);
      let coulomb = clampf(charge * otherCharge * 0.006 / dist2, -0.4, 0.4);
      force = force + dir * ((bondPull * (1.0 - thermalBreak) - ljRepulse - coulomb) * 0.018);
      let geometryThermalScale = 1.0 - clampf((temp - 900.0) / 2800.0, 0.0, 0.62);
      let geometrySourceScale = clampf(0.85 + params.quantumMaterialGeometryActive * params.quantumMaterialGeometryConfidence * 0.35, 0.7, 1.25);
      let geometryDistanceScale = clampf(params.quantumMaterialGeometryDistanceStiffnessProxy, 0.25, 1.8) * geometrySourceScale;
      let geometryOhTarget = max(0.045, params.quantumMaterialGeometryTargetOhDistanceReducedNm);
      let geometryHhTarget = max(0.075, params.quantumMaterialGeometryTargetHhDistanceReducedNm);
      if (waterOhPair(element, otherElement)) {
        let ohError = clampf((dist - geometryOhTarget) / geometryOhTarget, -1.0, 1.5);
        force = force + dir * (ohError * 0.07 * geometryThermalScale * geometryDistanceScale);
      }
      if (waterHhPair(element, otherElement) && dist < 0.24) {
        let hhCompression = clampf((geometryHhTarget - dist) / geometryHhTarget, 0.0, 1.4);
        force = force - dir * (hhCompression * 0.028 * geometryThermalScale * geometryDistanceScale);
      }
      if (elementMatches(element, 8.0) && elementMatches(otherElement, 1.0) && dist < 0.22) {
        if (dist < waterH1Dist) {
          waterH2Dist = waterH1Dist;
          waterH2Delta = waterH1Delta;
          waterH1Dist = dist;
          waterH1Delta = delta;
        } else if (dist < waterH2Dist) {
          waterH2Dist = dist;
          waterH2Delta = delta;
        }
      }
      if (dist < 0.22) {
        if (otherElement == 8.0) { nearO = nearO + 1.0; }
        if (otherElement == 6.0) { nearC = nearC + 1.0; }
        if (otherElement == 1.0) { nearH = nearH + 1.0; }
      }
    }
    workgroupBarrier();
  }

  if (!isActive) {
    return;
  }

  if (elementMatches(element, 8.0) && waterH2Dist < 0.22) {
    let h1 = normalize(waterH1Delta);
    let h2 = normalize(waterH2Delta);
    let bisector = h1 + h2;
    let bisectorLen = length(bisector);
    if (bisectorLen > 0.05) {
      let cosTheta = clampf(dot(h1, h2), -0.98, 0.98);
      let angleError = clampf(cosTheta - params.quantumMaterialGeometryTargetAngleCos, -0.85, 0.85);
      let geometryThermalScale = 1.0 - clampf((temp - 900.0) / 2800.0, 0.0, 0.62);
      let geometrySourceScale = clampf(0.85 + params.quantumMaterialGeometryActive * params.quantumMaterialGeometryConfidence * 0.35, 0.7, 1.25);
      let geometryAngleScale = clampf(params.quantumMaterialGeometryAngleStiffnessProxy, 0.25, 1.8) * geometrySourceScale;
        force = force + (bisector / bisectorLen) * (angleError * 0.032 * geometryThermalScale * geometryAngleScale);
    }
  }

  let materialAtomTargetFactor = qmatAtomTargetFactor(element);
  let materialNeighborTargetFactor = select(0.0, materialNeighborFactorSum / max(1.0, materialNeighborFactorCount), materialNeighborFactorCount > 0.5);
  let reactionBarrierGate = clampf(params.quantumMaterialReactionBarrierGate, 0.0, 1.0);
  let materialSourceBarrierDamping = select(1.0, 1.0 - clampf(reactionBarrierGate * 1.65, 0.0, 0.78), metalFactorForElement(element) > 0.5);
  let materialSourceTargetFactor = clampf(max(materialAtomTargetFactor, materialNeighborTargetFactor * 0.65) * materialSourceBarrierDamping, 0.0, 1.0);
  if (params.quantumMaterialActive > 0.5) {
    temp = clampf(
      temp
        + params.quantumMaterialTemperatureDeltaK * materialSourceTargetFactor * params.quantumMaterialThermalDampingScale
        + params.quantumMaterialEnsemblePressureDrive * materialSourceTargetFactor * 8.0,
      1.0,
      250000.0
    );
    charge = clampf(
      charge
        + params.quantumMaterialChargeDeltaProxy * qmatChargeSign(element) * materialSourceTargetFactor
        + params.quantumMaterialConductivityDrive * qmatChargeSign(element) * materialSourceTargetFactor * 0.008
        - params.quantumMaterialDielectricDrive * charge * materialSourceTargetFactor * 0.006,
      -1.4,
      1.4
    );
  }
  let heatDrive = params.fireIntensity * 22.0
    + params.radiativeHeatFlux * 0.025
    + params.quantumMaterialBehaviorDrive * 0.8 * materialSourceTargetFactor
    + params.quantumMaterialEnsemblePressureDrive * 2.5 * materialSourceTargetFactor;
  let opticalMaterialHeatDrive = (
    params.quantumMaterialOpticalAbsorptionDrive * params.radiativeHeatFlux * 0.0006
      + params.quantumMaterialConductivityDrive * 1.2
  ) * materialSourceTargetFactor;
  let oxygenDrive = params.oxygenFraction * max(0.0, nearC + nearH * 0.2) * 0.25;
  let cool = params.waterContact * max(0.0, temp - params.ambientTemperatureK) * 0.08;
  let thermalRelaxScale = 1.0 / max(0.35, params.quantumMaterialThermalDampingScale);
  temp = clampf(temp + params.dt * (heatDrive + opticalMaterialHeatDrive + oxygenDrive - cool - (temp - params.ambientTemperatureK) * 0.018 * thermalRelaxScale), 1.0, 250000.0);
  let ionDrive = clampf(
    (temp - 1200.0) / 4200.0
      + params.fireIntensity * 0.08
      + params.quantumMaterialIonizationDrive * materialSourceTargetFactor
      + params.quantumMaterialConductivityDrive * materialSourceTargetFactor * 0.018
      + params.quantumMaterialOpticalAbsorptionDrive * materialSourceTargetFactor * 0.006,
    0.0,
    0.45
  );
  charge = clampf(charge * 0.995 + ionDrive * select(-0.01, 0.012, element == 8.0) + nearO * 0.0003 - nearH * 0.00015, -1.4, 1.4);
  vel = (vel + (force / mass) * params.dt) * clampf(0.999 - params.ambientPressurePa * 0.00000000004 - params.waterContact * 0.006, 0.9, 0.9995);
  pos = pos + vel * params.dt;
  let radius = length(pos);
  if (radius > 1.85) {
    pos = normalize(pos) * 1.85;
    vel = vel * -0.32;
  }

  nextAtoms[base + 0u] = pos.x;
  nextAtoms[base + 1u] = pos.y;
  nextAtoms[base + 2u] = pos.z;
  nextAtoms[base + 3u] = vel.x;
  nextAtoms[base + 4u] = vel.y;
  nextAtoms[base + 5u] = vel.z;
  nextAtoms[base + 6u] = mass;
  nextAtoms[base + 7u] = element;
  nextAtoms[base + 8u] = charge;
  nextAtoms[base + 9u] = temp;
  nextAtoms[base + ${ATOM_TOPOLOGY_GROUP_ID_OFFSET}u] = moleculeGroupId;
  nextAtoms[base + ${ATOM_TOPOLOGY_GROUP_TYPE_OFFSET}u] = moleculeGroupType;
  nextAtoms[base + ${ATOM_TOPOLOGY_LOCAL_INDEX_OFFSET}u] = moleculeLocalIndex;
}
`;

const MOLECULAR_NEIGHBOR_CLEAR_SHADER = `
struct Params {
  atomCount: f32,
  dt: f32,
  ambientTemperatureK: f32,
  ambientPressurePa: f32,
  fireIntensity: f32,
  oxygenFraction: f32,
  radiativeHeatFlux: f32,
  gravityMps2: f32,
  waterContact: f32,
  cellSize: f32,
  searchRadius: f32,
  gridOrigin: f32,
  gridDimX: f32,
  gridDimY: f32,
  gridDimZ: f32,
  maxNeighbors: f32,
  ulgActive: f32,
  ulgTemperatureDeltaK: f32,
  ulgChargeDeltaProxy: f32,
  ulgVelocityDeltaProxy: f32,
  ulgMagneticDeltaProxy: f32,
  ulgEnergyDeltaProxy: f32,
  ulgReadiness: f32,
  ulgReserved: f32,
  quantumActive: f32,
  quantumAtomicNumber: f32,
  quantumTargetCharge: f32,
  quantumTemperatureDeltaK: f32,
  quantumBondOrderScale: f32,
  quantumIonizationDrive: f32,
  quantumEvolutionDrive: f32,
  quantumMix: f32,
  quantumMaterialActive: f32,
  quantumMaterialBondOrderScale: f32,
  quantumMaterialTemperatureDeltaK: f32,
  quantumMaterialChargeDeltaProxy: f32,
  quantumMaterialIonizationDrive: f32,
  quantumMaterialForceGradientDrive: f32,
  quantumMaterialBehaviorDrive: f32,
  quantumMaterialUncertainty: f32,
  quantumMaterialPairForceScale: f32,
  quantumMaterialRestLengthDeltaAngstrom: f32,
  quantumMaterialPairForceMix: f32,
  quantumMaterialPrimaryElementZ: f32,
  quantumMaterialSecondaryElementZ: f32,
  quantumMaterialPairSelectivity: f32,
  quantumMaterialPairFallbackFactor: f32,
  quantumMaterialEnsemblePressureDrive: f32,
  quantumMaterialEnsemblePressureRatio: f32,
  quantumMaterialHeatCapacityProxy: f32,
  quantumMaterialThermalDampingScale: f32,
  quantumMaterialConductivityDrive: f32,
  quantumMaterialDielectricDrive: f32,
  quantumMaterialMechanicalStiffnessDrive: f32,
  quantumMaterialOpticalAbsorptionDrive: f32,
  quantumMaterialGeometryActive: f32,
  quantumMaterialGeometryTargetOhDistanceReducedNm: f32,
  quantumMaterialGeometryTargetHhDistanceReducedNm: f32,
  quantumMaterialGeometryTargetAngleCos: f32,
  quantumMaterialGeometryDistanceStiffnessProxy: f32,
  quantumMaterialGeometryAngleStiffnessProxy: f32,
  quantumMaterialGeometryConfidence: f32,
  quantumMaterialReactionBarrierGate: f32,
};

@group(0) @binding(0) var<storage, read_write> gridCounts: array<atomic<u32>>;
@group(0) @binding(1) var<storage, read_write> neighborCounts: array<u32>;
@group(0) @binding(2) var<storage, read_write> stats: array<atomic<u32>>;
@group(0) @binding(3) var<uniform> params: Params;

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let i = global_id.x;
  if (i < ${MOLECULAR_NEIGHBOR_CELL_COUNT}u) {
    atomicStore(&gridCounts[i], 0u);
  }
  if (i < u32(params.atomCount)) {
    neighborCounts[i] = 0u;
  }
  if (i < ${MOLECULAR_NEIGHBOR_STATS_UINTS}u) {
    atomicStore(&stats[i], 0u);
  }
}
`;

const MOLECULAR_NEIGHBOR_BUILD_GRID_SHADER = `
struct Params {
  atomCount: f32,
  dt: f32,
  ambientTemperatureK: f32,
  ambientPressurePa: f32,
  fireIntensity: f32,
  oxygenFraction: f32,
  radiativeHeatFlux: f32,
  gravityMps2: f32,
  waterContact: f32,
  cellSize: f32,
  searchRadius: f32,
  gridOrigin: f32,
  gridDimX: f32,
  gridDimY: f32,
  gridDimZ: f32,
  maxNeighbors: f32,
  ulgActive: f32,
  ulgTemperatureDeltaK: f32,
  ulgChargeDeltaProxy: f32,
  ulgVelocityDeltaProxy: f32,
  ulgMagneticDeltaProxy: f32,
  ulgEnergyDeltaProxy: f32,
  ulgReadiness: f32,
  ulgReserved: f32,
  quantumActive: f32,
  quantumAtomicNumber: f32,
  quantumTargetCharge: f32,
  quantumTemperatureDeltaK: f32,
  quantumBondOrderScale: f32,
  quantumIonizationDrive: f32,
  quantumEvolutionDrive: f32,
  quantumMix: f32,
  quantumMaterialActive: f32,
  quantumMaterialBondOrderScale: f32,
  quantumMaterialTemperatureDeltaK: f32,
  quantumMaterialChargeDeltaProxy: f32,
  quantumMaterialIonizationDrive: f32,
  quantumMaterialForceGradientDrive: f32,
  quantumMaterialBehaviorDrive: f32,
  quantumMaterialUncertainty: f32,
  quantumMaterialPairForceScale: f32,
  quantumMaterialRestLengthDeltaAngstrom: f32,
  quantumMaterialPairForceMix: f32,
  quantumMaterialPrimaryElementZ: f32,
  quantumMaterialSecondaryElementZ: f32,
  quantumMaterialPairSelectivity: f32,
  quantumMaterialPairFallbackFactor: f32,
  quantumMaterialEnsemblePressureDrive: f32,
  quantumMaterialEnsemblePressureRatio: f32,
  quantumMaterialHeatCapacityProxy: f32,
  quantumMaterialThermalDampingScale: f32,
  quantumMaterialConductivityDrive: f32,
  quantumMaterialDielectricDrive: f32,
  quantumMaterialMechanicalStiffnessDrive: f32,
  quantumMaterialOpticalAbsorptionDrive: f32,
  quantumMaterialGeometryActive: f32,
  quantumMaterialGeometryTargetOhDistanceReducedNm: f32,
  quantumMaterialGeometryTargetHhDistanceReducedNm: f32,
  quantumMaterialGeometryTargetAngleCos: f32,
  quantumMaterialGeometryDistanceStiffnessProxy: f32,
  quantumMaterialGeometryAngleStiffnessProxy: f32,
  quantumMaterialGeometryConfidence: f32,
  quantumMaterialReactionBarrierGate: f32,
};

@group(0) @binding(0) var<storage, read> currentAtoms: array<f32>;
@group(0) @binding(1) var<storage, read_write> gridCounts: array<atomic<u32>>;
@group(0) @binding(2) var<storage, read_write> gridAtoms: array<u32>;
@group(0) @binding(3) var<storage, read_write> stats: array<atomic<u32>>;
@group(0) @binding(4) var<uniform> params: Params;

fn clampi(value: i32, lo: i32, hi: i32) -> i32 {
  return min(hi, max(lo, value));
}

fn cellIndexFor(pos: vec3f) -> u32 {
  let cx = clampi(i32(floor((pos.x - params.gridOrigin) / params.cellSize)), 0, ${MOLECULAR_NEIGHBOR_GRID_DIM_X - 1});
  let cy = clampi(i32(floor((pos.y - params.gridOrigin) / params.cellSize)), 0, ${MOLECULAR_NEIGHBOR_GRID_DIM_Y - 1});
  let cz = clampi(i32(floor((pos.z - params.gridOrigin) / params.cellSize)), 0, ${MOLECULAR_NEIGHBOR_GRID_DIM_Z - 1});
  return u32(cx + cy * ${MOLECULAR_NEIGHBOR_GRID_DIM_X} + cz * ${MOLECULAR_NEIGHBOR_GRID_DIM_X * MOLECULAR_NEIGHBOR_GRID_DIM_Y});
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let i = global_id.x;
  if (i >= u32(params.atomCount)) {
    return;
  }
  let base = i * ${ATOM_FLOATS}u;
  let pos = vec3f(currentAtoms[base + 0u], currentAtoms[base + 1u], currentAtoms[base + 2u]);
  let cell = cellIndexFor(pos);
  let slot = atomicAdd(&gridCounts[cell], 1u);
  if (slot < ${MOLECULAR_NEIGHBOR_MAX_CELL_OCCUPANCY}u) {
    gridAtoms[cell * ${MOLECULAR_NEIGHBOR_MAX_CELL_OCCUPANCY}u + slot] = i;
  } else {
    atomicAdd(&stats[1], 1u);
  }
}
`;

const MOLECULAR_NEIGHBOR_LIST_SHADER = `
struct Params {
  atomCount: f32,
  dt: f32,
  ambientTemperatureK: f32,
  ambientPressurePa: f32,
  fireIntensity: f32,
  oxygenFraction: f32,
  radiativeHeatFlux: f32,
  gravityMps2: f32,
  waterContact: f32,
  cellSize: f32,
  searchRadius: f32,
  gridOrigin: f32,
  gridDimX: f32,
  gridDimY: f32,
  gridDimZ: f32,
  maxNeighbors: f32,
  ulgActive: f32,
  ulgTemperatureDeltaK: f32,
  ulgChargeDeltaProxy: f32,
  ulgVelocityDeltaProxy: f32,
  ulgMagneticDeltaProxy: f32,
  ulgEnergyDeltaProxy: f32,
  ulgReadiness: f32,
  ulgReserved: f32,
  quantumActive: f32,
  quantumAtomicNumber: f32,
  quantumTargetCharge: f32,
  quantumTemperatureDeltaK: f32,
  quantumBondOrderScale: f32,
  quantumIonizationDrive: f32,
  quantumEvolutionDrive: f32,
  quantumMix: f32,
  quantumMaterialActive: f32,
  quantumMaterialBondOrderScale: f32,
  quantumMaterialTemperatureDeltaK: f32,
  quantumMaterialChargeDeltaProxy: f32,
  quantumMaterialIonizationDrive: f32,
  quantumMaterialForceGradientDrive: f32,
  quantumMaterialBehaviorDrive: f32,
  quantumMaterialUncertainty: f32,
};

@group(0) @binding(0) var<storage, read> currentAtoms: array<f32>;
@group(0) @binding(1) var<storage, read_write> gridCounts: array<atomic<u32>>;
@group(0) @binding(2) var<storage, read> gridAtoms: array<u32>;
@group(0) @binding(3) var<storage, read_write> neighborCounts: array<u32>;
@group(0) @binding(4) var<storage, read_write> neighborIndex: array<u32>;
@group(0) @binding(5) var<storage, read_write> stats: array<atomic<u32>>;
@group(0) @binding(6) var<uniform> params: Params;

fn clampi(value: i32, lo: i32, hi: i32) -> i32 {
  return min(hi, max(lo, value));
}

fn cellCoord(value: f32, dimMax: i32) -> i32 {
  return clampi(i32(floor((value - params.gridOrigin) / params.cellSize)), 0, dimMax);
}

fn flattenCell(cx: i32, cy: i32, cz: i32) -> u32 {
  return u32(cx + cy * ${MOLECULAR_NEIGHBOR_GRID_DIM_X} + cz * ${MOLECULAR_NEIGHBOR_GRID_DIM_X * MOLECULAR_NEIGHBOR_GRID_DIM_Y});
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let i = global_id.x;
  let count = u32(params.atomCount);
  if (i >= count) {
    return;
  }
  let base = i * ${ATOM_FLOATS}u;
  let pos = vec3f(currentAtoms[base + 0u], currentAtoms[base + 1u], currentAtoms[base + 2u]);
  let cx = cellCoord(pos.x, ${MOLECULAR_NEIGHBOR_GRID_DIM_X - 1});
  let cy = cellCoord(pos.y, ${MOLECULAR_NEIGHBOR_GRID_DIM_Y - 1});
  let cz = cellCoord(pos.z, ${MOLECULAR_NEIGHBOR_GRID_DIM_Z - 1});
  let span = i32(ceil(params.searchRadius / params.cellSize));
  let radius2 = params.searchRadius * params.searchRadius;
  var localCount = 0u;
  var overflowed = false;

  for (var dz = -span; dz <= span; dz = dz + 1) {
    let nz = cz + dz;
    if (nz < 0 || nz >= ${MOLECULAR_NEIGHBOR_GRID_DIM_Z}) { continue; }
    for (var dy = -span; dy <= span; dy = dy + 1) {
      let ny = cy + dy;
      if (ny < 0 || ny >= ${MOLECULAR_NEIGHBOR_GRID_DIM_Y}) { continue; }
      for (var dx = -span; dx <= span; dx = dx + 1) {
        let nx = cx + dx;
        if (nx < 0 || nx >= ${MOLECULAR_NEIGHBOR_GRID_DIM_X}) { continue; }
        let cell = flattenCell(nx, ny, nz);
        let occupancy = min(atomicLoad(&gridCounts[cell]), ${MOLECULAR_NEIGHBOR_MAX_CELL_OCCUPANCY}u);
        for (var slot = 0u; slot < occupancy; slot = slot + 1u) {
          let j = gridAtoms[cell * ${MOLECULAR_NEIGHBOR_MAX_CELL_OCCUPANCY}u + slot];
          if (j >= count || j == i) { continue; }
          atomicAdd(&stats[2], 1u);
          let otherBase = j * ${ATOM_FLOATS}u;
          let delta = vec3f(
            currentAtoms[otherBase + 0u] - pos.x,
            currentAtoms[otherBase + 1u] - pos.y,
            currentAtoms[otherBase + 2u] - pos.z
          );
          if (dot(delta, delta) > radius2) { continue; }
          if (localCount < ${MOLECULAR_NEIGHBOR_MAX_NEIGHBORS_PER_ATOM}u) {
            neighborIndex[i * ${MOLECULAR_NEIGHBOR_MAX_NEIGHBORS_PER_ATOM}u + localCount] = j;
            localCount = localCount + 1u;
            atomicAdd(&stats[3], 1u);
          } else {
            overflowed = true;
          }
        }
      }
    }
  }
  neighborCounts[i] = localCount;
  if (overflowed) {
    atomicAdd(&stats[0], 1u);
  }
}
`;

const MOLECULAR_NEIGHBOR_INTEGRATE_SHADER = `
struct Params {
  atomCount: f32,
  dt: f32,
  ambientTemperatureK: f32,
  ambientPressurePa: f32,
  fireIntensity: f32,
  oxygenFraction: f32,
  radiativeHeatFlux: f32,
  gravityMps2: f32,
  waterContact: f32,
  cellSize: f32,
  searchRadius: f32,
  gridOrigin: f32,
  gridDimX: f32,
  gridDimY: f32,
  gridDimZ: f32,
  maxNeighbors: f32,
  ulgActive: f32,
  ulgTemperatureDeltaK: f32,
  ulgChargeDeltaProxy: f32,
  ulgVelocityDeltaProxy: f32,
  ulgMagneticDeltaProxy: f32,
  ulgEnergyDeltaProxy: f32,
  ulgReadiness: f32,
  ulgReserved: f32,
  quantumActive: f32,
  quantumAtomicNumber: f32,
  quantumTargetCharge: f32,
  quantumTemperatureDeltaK: f32,
  quantumBondOrderScale: f32,
  quantumIonizationDrive: f32,
  quantumEvolutionDrive: f32,
  quantumMix: f32,
  quantumMaterialActive: f32,
  quantumMaterialBondOrderScale: f32,
  quantumMaterialTemperatureDeltaK: f32,
  quantumMaterialChargeDeltaProxy: f32,
  quantumMaterialIonizationDrive: f32,
  quantumMaterialForceGradientDrive: f32,
  quantumMaterialBehaviorDrive: f32,
  quantumMaterialUncertainty: f32,
  quantumMaterialPairForceScale: f32,
  quantumMaterialRestLengthDeltaAngstrom: f32,
  quantumMaterialPairForceMix: f32,
  quantumMaterialPrimaryElementZ: f32,
  quantumMaterialSecondaryElementZ: f32,
  quantumMaterialPairSelectivity: f32,
  quantumMaterialPairFallbackFactor: f32,
  quantumMaterialEnsemblePressureDrive: f32,
  quantumMaterialEnsemblePressureRatio: f32,
  quantumMaterialHeatCapacityProxy: f32,
  quantumMaterialThermalDampingScale: f32,
  quantumMaterialConductivityDrive: f32,
  quantumMaterialDielectricDrive: f32,
  quantumMaterialMechanicalStiffnessDrive: f32,
  quantumMaterialOpticalAbsorptionDrive: f32,
  quantumMaterialGeometryActive: f32,
  quantumMaterialGeometryTargetOhDistanceReducedNm: f32,
  quantumMaterialGeometryTargetHhDistanceReducedNm: f32,
  quantumMaterialGeometryTargetAngleCos: f32,
  quantumMaterialGeometryDistanceStiffnessProxy: f32,
  quantumMaterialGeometryAngleStiffnessProxy: f32,
  quantumMaterialGeometryConfidence: f32,
  quantumMaterialReactionBarrierGate: f32,
};

@group(0) @binding(0) var<storage, read> currentAtoms: array<f32>;
@group(0) @binding(1) var<storage, read_write> nextAtoms: array<f32>;
@group(0) @binding(2) var<storage, read> neighborCounts: array<u32>;
@group(0) @binding(3) var<storage, read> neighborIndex: array<u32>;
@group(0) @binding(4) var<uniform> params: Params;

fn clampf(value: f32, lo: f32, hi: f32) -> f32 {
  return min(hi, max(lo, value));
}

fn qmatPairTargetFactor(element: f32, otherElement: f32) -> f32 {
  if (params.quantumMaterialActive <= 0.5) {
    return 0.0;
  }
  let primary = params.quantumMaterialPrimaryElementZ;
  let secondary = params.quantumMaterialSecondaryElementZ;
  let selectivity = clampf(params.quantumMaterialPairSelectivity, 0.0, 1.0);
  let fallback = clampf(params.quantumMaterialPairFallbackFactor, 0.0, 1.0);
  var matched = 1.0 - selectivity;
  if (primary > 0.5 && secondary > 0.5) {
    let direct = abs(element - primary) < 0.5 && abs(otherElement - secondary) < 0.5;
    let reverse = abs(element - secondary) < 0.5 && abs(otherElement - primary) < 0.5;
    matched = select(fallback, 1.0, direct || reverse);
  } else if (primary > 0.5) {
    let containsPrimary = abs(element - primary) < 0.5 || abs(otherElement - primary) < 0.5;
    matched = select(fallback, 1.0, containsPrimary);
  }
  return clampf(matched, 0.0, 1.0);
}

fn qmatAtomTargetFactor(element: f32) -> f32 {
  if (params.quantumMaterialActive <= 0.5) {
    return 0.0;
  }
  let primary = params.quantumMaterialPrimaryElementZ;
  let secondary = params.quantumMaterialSecondaryElementZ;
  let fallback = clampf(params.quantumMaterialPairFallbackFactor, 0.0, 1.0);
  if (primary > 0.5 && secondary > 0.5) {
    let matched = abs(element - primary) < 0.5 || abs(element - secondary) < 0.5;
    return select(fallback, 1.0, matched);
  }
  if (primary > 0.5) {
    return select(fallback, 1.0, abs(element - primary) < 0.5);
  }
  return 1.0;
}

fn qmatChargeSign(element: f32) -> f32 {
  var sign = select(0.5, -1.0, element == 8.0 || element == 9.0 || element == 17.0);
  sign = select(sign, 1.0, element == 11.0 || element == 12.0 || element == 19.0 || element == 20.0 || element == 26.0);
  return sign;
}

fn elementMatches(element: f32, targetElement: f32) -> bool {
  return abs(element - targetElement) < 0.5;
}

fn covalentRadiusForElement(element: f32) -> f32 {
  var radius = 0.07;
  if (elementMatches(element, 1.0)) { radius = 0.031; }
  if (elementMatches(element, 6.0)) { radius = 0.076; }
  if (elementMatches(element, 7.0)) { radius = 0.071; }
  if (elementMatches(element, 8.0)) { radius = 0.066; }
  if (elementMatches(element, 9.0)) { radius = 0.057; }
  if (elementMatches(element, 11.0)) { radius = 0.166; }
  if (elementMatches(element, 12.0)) { radius = 0.141; }
  if (elementMatches(element, 14.0)) { radius = 0.111; }
  if (elementMatches(element, 15.0)) { radius = 0.107; }
  if (elementMatches(element, 16.0)) { radius = 0.105; }
  if (elementMatches(element, 17.0)) { radius = 0.102; }
  if (elementMatches(element, 19.0)) { radius = 0.203; }
  if (elementMatches(element, 20.0)) { radius = 0.176; }
  if (elementMatches(element, 26.0)) { radius = 0.124; }
  return radius;
}

fn electronegativityForElementShader(element: f32) -> f32 {
  var chi = 2.1;
  if (elementMatches(element, 1.0)) { chi = 2.2; }
  if (elementMatches(element, 6.0)) { chi = 2.55; }
  if (elementMatches(element, 7.0)) { chi = 3.04; }
  if (elementMatches(element, 8.0)) { chi = 3.44; }
  if (elementMatches(element, 9.0)) { chi = 3.98; }
  if (elementMatches(element, 11.0)) { chi = 0.93; }
  if (elementMatches(element, 12.0)) { chi = 1.31; }
  if (elementMatches(element, 14.0)) { chi = 1.9; }
  if (elementMatches(element, 15.0)) { chi = 2.19; }
  if (elementMatches(element, 16.0)) { chi = 2.58; }
  if (elementMatches(element, 17.0)) { chi = 3.16; }
  if (elementMatches(element, 19.0)) { chi = 0.82; }
  if (elementMatches(element, 20.0)) { chi = 1.0; }
  if (elementMatches(element, 26.0)) { chi = 1.83; }
  return chi;
}

fn metalFactorForElement(element: f32) -> f32 {
  if (elementMatches(element, 11.0) || elementMatches(element, 12.0) || elementMatches(element, 19.0) || elementMatches(element, 20.0) || elementMatches(element, 26.0)) {
    return 1.0;
  }
  return 0.0;
}

fn molecularPairRestLengthReducedNm(element: f32, otherElement: f32) -> f32 {
  let radiusSum = covalentRadiusForElement(element) + covalentRadiusForElement(otherElement);
  let metalA = metalFactorForElement(element);
  let metalB = metalFactorForElement(otherElement);
  let enDelta = abs(electronegativityForElementShader(element) - electronegativityForElementShader(otherElement));
  let ionicPair = ((metalA > 0.5 && metalB < 0.5) || (metalB > 0.5 && metalA < 0.5)) && enDelta >= 1.1;
  var restLength = radiusSum * 1.12;
  if (ionicPair) {
    restLength = restLength * 1.08;
  }
  return clampf(restLength, 0.058, 0.34);
}

fn molecularPairAffinity(element: f32, otherElement: f32) -> f32 {
  let same = elementMatches(element, otherElement);
  let metalA = metalFactorForElement(element);
  let metalB = metalFactorForElement(otherElement);
  let enDelta = abs(electronegativityForElementShader(element) - electronegativityForElementShader(otherElement));
  let metalMismatch = (metalA > 0.5 && metalB < 0.5) || (metalB > 0.5 && metalA < 0.5);
  let bothNonMetal = metalA < 0.5 && metalB < 0.5;
  var affinity = 0.35;
  if (same) {
    affinity = 0.28;
    if (elementMatches(element, 1.0)) { affinity = 0.62; }
    if (elementMatches(element, 6.0)) { affinity = 0.86; }
  } else if (metalMismatch && enDelta >= 1.1) {
    affinity = 0.82;
  } else if (bothNonMetal) {
    affinity = 0.76 + clampf(enDelta * 0.1, 0.0, 0.22);
  } else {
    affinity = 0.38;
  }
  let hydrogenOxygen = (elementMatches(element, 1.0) && elementMatches(otherElement, 8.0))
    || (elementMatches(element, 8.0) && elementMatches(otherElement, 1.0));
  let hydrogenNitrogen = (elementMatches(element, 1.0) && elementMatches(otherElement, 7.0))
    || (elementMatches(element, 7.0) && elementMatches(otherElement, 1.0));
  let carbonOxygen = (elementMatches(element, 6.0) && elementMatches(otherElement, 8.0))
    || (elementMatches(element, 8.0) && elementMatches(otherElement, 6.0));
  if (hydrogenOxygen || hydrogenNitrogen || carbonOxygen) {
    affinity = max(affinity, 1.04);
  }
  return clampf(affinity, 0.18, 1.12);
}

fn waterOhPair(element: f32, otherElement: f32) -> bool {
  return (elementMatches(element, 8.0) && elementMatches(otherElement, 1.0))
    || (elementMatches(element, 1.0) && elementMatches(otherElement, 8.0));
}

fn waterHhPair(element: f32, otherElement: f32) -> bool {
  return elementMatches(element, 1.0) && elementMatches(otherElement, 1.0);
}

fn waterElement(element: f32) -> bool {
  return elementMatches(element, 1.0) || elementMatches(element, 8.0);
}

fn reactiveMetalWaterPair(element: f32, otherElement: f32) -> bool {
  return (metalFactorForElement(element) > 0.5 && waterElement(otherElement))
    || (metalFactorForElement(otherElement) > 0.5 && waterElement(element));
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let i = global_id.x;
  let count = u32(params.atomCount);
  if (i >= count) {
    return;
  }
  let base = i * ${ATOM_FLOATS}u;
  var pos = vec3f(currentAtoms[base + 0u], currentAtoms[base + 1u], currentAtoms[base + 2u]);
  var vel = vec3f(currentAtoms[base + 3u], currentAtoms[base + 4u], currentAtoms[base + 5u]);
  let mass = max(0.25, currentAtoms[base + 6u]);
  let element = currentAtoms[base + 7u];
  var charge = currentAtoms[base + 8u];
  var temp = max(1.0, currentAtoms[base + 9u]);
  let moleculeGroupId = currentAtoms[base + ${ATOM_TOPOLOGY_GROUP_ID_OFFSET}u];
  let moleculeGroupType = currentAtoms[base + ${ATOM_TOPOLOGY_GROUP_TYPE_OFFSET}u];
  let moleculeLocalIndex = currentAtoms[base + ${ATOM_TOPOLOGY_LOCAL_INDEX_OFFSET}u];
  if (params.ulgActive > 0.5) {
    let parity = select(-1.0, 1.0, (i & 1u) == 0u);
    temp = clampf(temp + params.ulgTemperatureDeltaK, 1.0, 250000.0);
    charge = clampf(charge + params.ulgChargeDeltaProxy, -1.4, 1.4);
    vel.y = clampf(vel.y + params.ulgVelocityDeltaProxy, -100.0, 100.0);
    vel.x = clampf(vel.x + params.ulgMagneticDeltaProxy * parity * 0.5, -100.0, 100.0);
    vel.z = clampf(vel.z - params.ulgMagneticDeltaProxy * parity * 0.5, -100.0, 100.0);
  }
  if (params.quantumActive > 0.5 && abs(element - params.quantumAtomicNumber) < 0.5) {
    temp = clampf(temp + params.quantumTemperatureDeltaK, 1.0, 250000.0);
    charge = clampf(charge * (1.0 - params.quantumMix) + params.quantumTargetCharge * params.quantumMix, -1.4, 1.4);
  }
  var force = vec3f(0.0, -0.00008 * params.gravityMps2 * mass, 0.0);
  var nearO = 0.0;
  var nearC = 0.0;
  var nearH = 0.0;
  var materialNeighborFactorSum = 0.0;
  var materialNeighborFactorCount = 0.0;
  var waterH1Delta = vec3f(0.0, 0.0, 0.0);
  var waterH2Delta = vec3f(0.0, 0.0, 0.0);
  var waterH1Dist = 999.0;
  var waterH2Dist = 999.0;
  let neighbors = neighborCounts[i];

  for (var n = 0u; n < neighbors; n = n + 1u) {
    let j = neighborIndex[i * ${MOLECULAR_NEIGHBOR_MAX_NEIGHBORS_PER_ATOM}u + n];
    if (j >= count || j == i) { continue; }
    let otherBase = j * ${ATOM_FLOATS}u;
    let otherPos = vec3f(currentAtoms[otherBase + 0u], currentAtoms[otherBase + 1u], currentAtoms[otherBase + 2u]);
    let otherElement = currentAtoms[otherBase + 7u];
    let otherCharge = currentAtoms[otherBase + 8u];
    let delta = otherPos - pos;
    let dist2 = max(0.0025, dot(delta, delta));
    let dist = sqrt(dist2);
    let dir = delta / dist;
    let pairRestLength = molecularPairRestLengthReducedNm(element, otherElement);
    let pairAffinity = molecularPairAffinity(element, otherElement);
    let quantumPair = params.quantumActive > 0.5
      && (abs(element - params.quantumAtomicNumber) < 0.5 || abs(otherElement - params.quantumAtomicNumber) < 0.5);
    var materialPairTargetFactor = qmatPairTargetFactor(element, otherElement);
    if (params.quantumMaterialActive > 0.5) {
      let reactionBarrierGate = clampf(params.quantumMaterialReactionBarrierGate, 0.0, 1.0);
      if (reactiveMetalWaterPair(element, otherElement)) {
        materialPairTargetFactor = materialPairTargetFactor * (1.0 - clampf(reactionBarrierGate * 1.85, 0.0, 0.84));
      }
      materialNeighborFactorSum = materialNeighborFactorSum + materialPairTargetFactor;
      materialNeighborFactorCount = materialNeighborFactorCount + 1.0;
    }
    let materialBondScale = 1.0 + (params.quantumMaterialBondOrderScale - 1.0) * materialPairTargetFactor;
    let materialPairForceScale = 1.0 + (params.quantumMaterialPairForceScale - 1.0) * materialPairTargetFactor;
    let materialPairForceMix = params.quantumMaterialPairForceMix * materialPairTargetFactor;
    let materialEnsemblePressureDrive = params.quantumMaterialEnsemblePressureDrive * materialPairTargetFactor;
    let materialStiffnessDrive = params.quantumMaterialMechanicalStiffnessDrive * materialPairTargetFactor;
    let materialRestLength = max(0.045, pairRestLength + params.quantumMaterialRestLengthDeltaAngstrom * materialPairForceMix - materialEnsemblePressureDrive * 0.006);
    let bondScale = select(1.0, params.quantumBondOrderScale, quantumPair) * materialBondScale;
    let materialEnsemblePairScale = clampf(1.0 + materialEnsemblePressureDrive * 0.16, 0.84, 1.16);
    let materialStiffnessPairScale = clampf(1.0 + materialStiffnessDrive * 0.045, 0.92, 1.12);
    let bondPull = (
      clampf((materialRestLength - dist) / materialRestLength, -0.8, 1.4) * bondScale
      + params.quantumMaterialForceGradientDrive * materialPairTargetFactor * (0.04 + materialPairForceMix * 0.025)
    ) * materialPairForceScale * materialEnsemblePairScale * materialStiffnessPairScale * pairAffinity;
    let thermalBreak = clampf((temp - 850.0) / 1600.0, 0.0, 0.75);
    let ljRepulse = clampf((0.055 / dist2) - 0.06, -0.05, 1.8);
    let coulomb = clampf(charge * otherCharge * 0.006 / dist2, -0.4, 0.4);
    force = force + dir * ((bondPull * (1.0 - thermalBreak) - ljRepulse - coulomb) * 0.018);
    let geometryThermalScale = 1.0 - clampf((temp - 900.0) / 2800.0, 0.0, 0.62);
    let geometrySourceScale = clampf(0.85 + params.quantumMaterialGeometryActive * params.quantumMaterialGeometryConfidence * 0.35, 0.7, 1.25);
    let geometryDistanceScale = clampf(params.quantumMaterialGeometryDistanceStiffnessProxy, 0.25, 1.8) * geometrySourceScale;
    let geometryOhTarget = max(0.045, params.quantumMaterialGeometryTargetOhDistanceReducedNm);
    let geometryHhTarget = max(0.075, params.quantumMaterialGeometryTargetHhDistanceReducedNm);
    if (waterOhPair(element, otherElement)) {
      let ohError = clampf((dist - geometryOhTarget) / geometryOhTarget, -1.0, 1.5);
      force = force + dir * (ohError * 0.07 * geometryThermalScale * geometryDistanceScale);
    }
    if (waterHhPair(element, otherElement) && dist < 0.24) {
      let hhCompression = clampf((geometryHhTarget - dist) / geometryHhTarget, 0.0, 1.4);
      force = force - dir * (hhCompression * 0.028 * geometryThermalScale * geometryDistanceScale);
    }
    if (elementMatches(element, 8.0) && elementMatches(otherElement, 1.0) && dist < 0.22) {
      if (dist < waterH1Dist) {
        waterH2Dist = waterH1Dist;
        waterH2Delta = waterH1Delta;
        waterH1Dist = dist;
        waterH1Delta = delta;
      } else if (dist < waterH2Dist) {
        waterH2Dist = dist;
        waterH2Delta = delta;
      }
    }
    if (dist < 0.22) {
      if (otherElement == 8.0) { nearO = nearO + 1.0; }
      if (otherElement == 6.0) { nearC = nearC + 1.0; }
      if (otherElement == 1.0) { nearH = nearH + 1.0; }
    }
  }

  if (elementMatches(element, 8.0) && waterH2Dist < 0.22) {
    let h1 = normalize(waterH1Delta);
    let h2 = normalize(waterH2Delta);
    let bisector = h1 + h2;
    let bisectorLen = length(bisector);
    if (bisectorLen > 0.05) {
      let cosTheta = clampf(dot(h1, h2), -0.98, 0.98);
      let angleError = clampf(cosTheta - params.quantumMaterialGeometryTargetAngleCos, -0.85, 0.85);
      let geometryThermalScale = 1.0 - clampf((temp - 900.0) / 2800.0, 0.0, 0.62);
      let geometrySourceScale = clampf(0.85 + params.quantumMaterialGeometryActive * params.quantumMaterialGeometryConfidence * 0.35, 0.7, 1.25);
      let geometryAngleScale = clampf(params.quantumMaterialGeometryAngleStiffnessProxy, 0.25, 1.8) * geometrySourceScale;
      force = force + (bisector / bisectorLen) * (angleError * 0.032 * geometryThermalScale * geometryAngleScale);
    }
  }

  let materialAtomTargetFactor = qmatAtomTargetFactor(element);
  let materialNeighborTargetFactor = select(0.0, materialNeighborFactorSum / max(1.0, materialNeighborFactorCount), materialNeighborFactorCount > 0.5);
  let reactionBarrierGate = clampf(params.quantumMaterialReactionBarrierGate, 0.0, 1.0);
  let materialSourceBarrierDamping = select(1.0, 1.0 - clampf(reactionBarrierGate * 1.65, 0.0, 0.78), metalFactorForElement(element) > 0.5);
  let materialSourceTargetFactor = clampf(max(materialAtomTargetFactor, materialNeighborTargetFactor * 0.65) * materialSourceBarrierDamping, 0.0, 1.0);
  if (params.quantumMaterialActive > 0.5) {
    temp = clampf(
      temp
        + params.quantumMaterialTemperatureDeltaK * materialSourceTargetFactor * params.quantumMaterialThermalDampingScale
        + params.quantumMaterialEnsemblePressureDrive * materialSourceTargetFactor * 8.0,
      1.0,
      250000.0
    );
    charge = clampf(
      charge
        + params.quantumMaterialChargeDeltaProxy * qmatChargeSign(element) * materialSourceTargetFactor
        + params.quantumMaterialConductivityDrive * qmatChargeSign(element) * materialSourceTargetFactor * 0.008
        - params.quantumMaterialDielectricDrive * charge * materialSourceTargetFactor * 0.006,
      -1.4,
      1.4
    );
  }
  let heatDrive = params.fireIntensity * 22.0
    + params.radiativeHeatFlux * 0.025
    + params.quantumMaterialBehaviorDrive * 0.8 * materialSourceTargetFactor
    + params.quantumMaterialEnsemblePressureDrive * 2.5 * materialSourceTargetFactor;
  let opticalMaterialHeatDrive = (
    params.quantumMaterialOpticalAbsorptionDrive * params.radiativeHeatFlux * 0.0006
      + params.quantumMaterialConductivityDrive * 1.2
  ) * materialSourceTargetFactor;
  let oxygenDrive = params.oxygenFraction * max(0.0, nearC + nearH * 0.2) * 0.25;
  let cool = params.waterContact * max(0.0, temp - params.ambientTemperatureK) * 0.08;
  let thermalRelaxScale = 1.0 / max(0.35, params.quantumMaterialThermalDampingScale);
  temp = clampf(temp + params.dt * (heatDrive + opticalMaterialHeatDrive + oxygenDrive - cool - (temp - params.ambientTemperatureK) * 0.018 * thermalRelaxScale), 1.0, 250000.0);
  let ionDrive = clampf(
    (temp - 1200.0) / 4200.0
      + params.fireIntensity * 0.08
      + params.quantumMaterialIonizationDrive * materialSourceTargetFactor
      + params.quantumMaterialConductivityDrive * materialSourceTargetFactor * 0.018
      + params.quantumMaterialOpticalAbsorptionDrive * materialSourceTargetFactor * 0.006,
    0.0,
    0.45
  );
  charge = clampf(charge * 0.995 + ionDrive * select(-0.01, 0.012, element == 8.0) + nearO * 0.0003 - nearH * 0.00015, -1.4, 1.4);
  vel = (vel + (force / mass) * params.dt) * clampf(0.999 - params.ambientPressurePa * 0.00000000004 - params.waterContact * 0.006, 0.9, 0.9995);
  pos = pos + vel * params.dt;
  let radius = length(pos);
  if (radius > 1.85) {
    pos = normalize(pos) * 1.85;
    vel = vel * -0.32;
  }

  nextAtoms[base + 0u] = pos.x;
  nextAtoms[base + 1u] = pos.y;
  nextAtoms[base + 2u] = pos.z;
  nextAtoms[base + 3u] = vel.x;
  nextAtoms[base + 4u] = vel.y;
  nextAtoms[base + 5u] = vel.z;
  nextAtoms[base + 6u] = mass;
  nextAtoms[base + 7u] = element;
  nextAtoms[base + 8u] = charge;
  nextAtoms[base + 9u] = temp;
  nextAtoms[base + ${ATOM_TOPOLOGY_GROUP_ID_OFFSET}u] = moleculeGroupId;
  nextAtoms[base + ${ATOM_TOPOLOGY_GROUP_TYPE_OFFSET}u] = moleculeGroupType;
  nextAtoms[base + ${ATOM_TOPOLOGY_LOCAL_INDEX_OFFSET}u] = moleculeLocalIndex;
}
`;

const states = new Map();
const gpuRuntimes = new Map();
const gpuDisabledReasons = new Map();

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function ramp(value, edge0, edge1) {
  if (Math.abs(edge1 - edge0) < 1e-12) return value >= edge1 ? 1 : 0;
  return clamp((value - edge0) / (edge1 - edge0), 0, 1);
}

function normalizeFractions(fractions = {}) {
  const entries = Object.entries(fractions)
    .map(([key, value]) => [key, Math.max(0, Number(value) || 0)]);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  if (total <= 1e-12) {
    return Object.fromEntries(entries.map(([key]) => [key, 0]));
  }
  return Object.fromEntries(entries.map(([key, value]) => [key, value / total]));
}

function normalizeInteger(value, fallback, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeNumber(value, fallback, min = -Number.MAX_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return clamp(number, min, max);
}

export function normalizeMolecularQuantumCoupling(source = null) {
  const envelope = source?.quantumOrbitalClosure || source?.quantumOrbital || source;
  if (!envelope || typeof envelope !== 'object') {
    return {
      schema: MOLECULAR_QUANTUM_COUPLING_SCHEMA,
      active: false,
      sourceSchema: null,
      modelId: null,
      backend: null,
      elementSymbol: null,
      atomicNumber: 0,
      activeOrbital: null,
      principalN: 0,
      angularL: 0,
      magneticM: 0,
      valenceElectronCount: 0,
      unpairedElectronCount: 0,
      electronegativityProxy: 0,
      ionizationFraction: 0,
      polarizabilityProxy: 0,
      electricalConductivityProxy: 0,
      bondingTendency: null,
      finiteGridBackend: null,
      finiteGridLiveBackendPolicy: null,
      finiteGridMeanRadiusBohr: 0,
      finiteGridRmsRadiusBohr: 0,
      finiteGridBoundaryMass: 0,
      finiteGridParityOk: false,
      wavefunctionEvolutionSchema: null,
      wavefunctionEvolutionSource: 'unavailable',
      wavefunctionEvolutionBackend: null,
      wavefunctionEvolutionStatus: 'unavailable',
      wavefunctionEvolutionNormDrift: 0,
      wavefunctionEvolutionDensityDriftL1: 0,
      wavefunctionEvolutionEnergyExpectationEv: 0,
      wavefunctionEvolutionKineticExpectationEv: 0,
      wavefunctionEvolutionPotentialExpectationEv: 0,
      wavefunctionEvolutionFieldEnergyExpectationEv: 0,
      wavefunctionEvolutionAbsFieldEnergyExpectationEv: 0,
      wavefunctionEvolutionElectricFieldVm: 0,
      wavefunctionEvolutionElectricFieldAtomicUnits: 0,
      wavefunctionEvolutionDipoleMomentZBohrElectron: 0,
      wavefunctionEvolutionFieldRmsExtentBohr: 0,
      wavefunctionEvolutionPolarizabilityProxyBohr3: 0,
      wavefunctionEvolutionStarkShiftProxyEv: 0,
      wavefunctionEvolutionFieldResponseSchema: null,
      wavefunctionEvolutionMagneticFieldT: 0,
      wavefunctionEvolutionMagneticFieldAtomicUnits: 0,
      wavefunctionEvolutionZeemanEnergyExpectationEv: 0,
      wavefunctionEvolutionAbsZeemanEnergyExpectationEv: 0,
      wavefunctionEvolutionMagneticMomentProjectionBohrMagneton: 0,
      wavefunctionEvolutionZeemanProjection: 0,
      wavefunctionEvolutionSpinProjection: 0,
      wavefunctionEvolutionLarmorAngularFrequencyProxyAu: 0,
      wavefunctionEvolutionMagneticResponseSchema: null,
      wavefunctionEvolutionComponentEnergyExpectationEv: 0,
      wavefunctionEvolutionHamiltonianComponentResidualEv: 0,
      wavefunctionEvolutionVirialResidualEv: 0,
      wavefunctionEvolutionHamiltonianComponentsSchema: null,
      wavefunctionEvolutionPhaseRotationRad: 0,
      wavefunctionEvolutionDtAtomicUnits: 0,
      wavefunctionEvolutionWebgpuParityOk: null,
      wavefunctionEvolutionWebgpuExecuted: false,
      wavefunctionEvolutionLiveBackendPolicy: null,
      wavefunctionEvolutionDrive: 0,
      radialEigenstateSchema: null,
      radialEigenstateSource: 'unavailable',
      radialEigenstateStatus: 'unavailable',
      radialEigenstateEnergyEv: 0,
      radialEigenstateAnalyticEnergyEv: 0,
      radialEigenstateEnergyErrorEv: 0,
      radialEigenstateResidualRelativeL2: 0,
      radialEigenstateMeanRadiusBohr: 0,
      radialEigenstateGridPointCount: 0,
      radialEigenstateNodeCountObserved: 0,
      radialEigenstateNodeCountTarget: 0,
      radialEigenstateWebgpuExecuted: false,
      statisticalBridgeSchema: null,
      statisticalBridgeSource: 'unavailable',
      statisticalBridgeStatus: 'unavailable',
      statisticalBridgeBackend: null,
      statisticalBridgePartitionFunctionLog: 0,
      statisticalBridgeGroundOccupation: 0,
      statisticalBridgeExcitedOccupation: 0,
      statisticalBridgeFreeEnergyEv: 0,
      statisticalBridgeInternalEnergyEv: 0,
      statisticalBridgeHeatCapacityProxy: 0,
      statisticalBridgeEntropyProxyKb: 0,
      statisticalBridgeIonizationFraction: 0,
      statisticalBridgeOpacityPopulationProxy: 0,
      statisticalBridgeDegeneracyParameter: 0,
      statisticalBridgeEnsemblePressurePa: 0,
      statisticalBridgeTemperatureDeltaKProxy: 0,
      statisticalBridgeChargeDeltaProxy: 0,
      statisticalBridgeThermalDampingScale: 1,
      statisticalBridgeWebgpuExecuted: false,
      statisticalBridgeDrive: 0,
      confidence: 0
    };
  }
  const chemistry = envelope.chemistry && typeof envelope.chemistry === 'object' ? envelope.chemistry : envelope;
  const diagnostics = envelope.diagnostics && typeof envelope.diagnostics === 'object' ? envelope.diagnostics : {};
  const finiteGrid = chemistry.finiteGrid || diagnostics.finiteGrid || envelope.finiteGrid || envelope.finiteGridSummary || {};
  const wavefunctionEvolution = resolveWavefunctionEvolutionCoupling({ finiteGrid, envelope, chemistry });
  const radialEigenstate = resolveRadialEigenstateCoupling({ finiteGrid, envelope, chemistry });
  const statisticalBridge = resolveOrbitalStatisticalBridgeCoupling({ finiteGrid, envelope, chemistry });
  const elementSymbol = normalizeElementKey(
    chemistry.elementSymbol
      || chemistry.symbol
      || envelope.element?.symbol
      || envelope.elementSymbol
      || envelope.symbol
      || finiteGrid.elementSymbol
  );
  const atomicNumber = normalizeInteger(
    chemistry.atomicNumber
      ?? envelope.element?.atomicNumber
      ?? envelope.atomicNumber
      ?? (elementSymbol ? ELEMENT[elementSymbol] : 0),
    elementSymbol ? ELEMENT[elementSymbol] : 0,
    0,
    118
  );
  const confidence = normalizeNumber(
    envelope.uncertainty?.confidence
      ?? envelope.confidence
      ?? chemistry.confidence,
    envelope.schema === MOLECULAR_QUANTUM_COUPLING_SCHEMA ? envelope.confidence : 0.32,
    0,
    1
  );
  const active = Boolean(elementSymbol && atomicNumber > 0 && confidence > 0);
  return {
    schema: MOLECULAR_QUANTUM_COUPLING_SCHEMA,
    active,
    sourceSchema: envelope.schema || chemistry.schema || null,
    modelId: envelope.modelId || chemistry.modelId || null,
    backend: envelope.backend || envelope.source?.backend || chemistry.backend || null,
    elementSymbol,
    atomicNumber,
    activeOrbital: chemistry.activeOrbital || envelope.activeOrbital?.label || envelope.activeOrbital || envelope.activeOrbitalLabel || null,
    principalN: normalizeInteger(chemistry.principalN ?? envelope.activeOrbital?.n ?? envelope.principalN ?? finiteGrid.principalN, 0, 0, 12),
    angularL: normalizeInteger(chemistry.angularL ?? envelope.activeOrbital?.l ?? envelope.angularL ?? finiteGrid.angularL, 0, 0, 8),
    magneticM: normalizeInteger(chemistry.magneticM ?? envelope.activeOrbital?.magneticM ?? envelope.magneticM ?? finiteGrid.magneticM, 0, -8, 8),
    valenceElectronCount: normalizeNumber(chemistry.valenceElectronCount ?? envelope.valenceElectronCount, 0, 0, 32),
    unpairedElectronCount: normalizeNumber(chemistry.unpairedElectronCount ?? envelope.unpairedElectronCount, 0, 0, 32),
    electronegativityProxy: normalizeNumber(chemistry.electronegativityProxy ?? envelope.electronegativityProxy, 0, 0, 6),
    ionizationFraction: normalizeNumber(chemistry.ionizationFraction ?? envelope.ionizationFraction, 0, 0, 1),
    polarizabilityProxy: normalizeNumber(chemistry.polarizabilityProxy ?? envelope.polarizabilityProxy, 0, 0, 200),
    electricalConductivityProxy: normalizeNumber(
      chemistry.electricalConductivityProxy
        ?? chemistry.conductivitySm
        ?? envelope.electricalConductivityProxy
        ?? envelope.conductivitySm,
      0,
      0,
      1e9
    ),
    bondingTendency: chemistry.bondingTendency || envelope.bondingTendency || null,
    finiteGridBackend: finiteGrid.backend || envelope.finiteGridBackend || null,
    finiteGridLiveBackendPolicy: finiteGrid.liveBackendPolicy || envelope.finiteGridLiveBackendPolicy || null,
    finiteGridMeanRadiusBohr: normalizeNumber(finiteGrid.meanRadiusBohr ?? envelope.finiteGridMeanRadiusBohr, 0, 0, 1e6),
    finiteGridRmsRadiusBohr: normalizeNumber(finiteGrid.rmsRadiusBohr ?? envelope.finiteGridRmsRadiusBohr, 0, 0, 1e6),
    finiteGridBoundaryMass: normalizeNumber(finiteGrid.boundaryMass ?? envelope.finiteGridBoundaryMass, 0, 0, 1),
    finiteGridParityOk: finiteGrid.parity?.ok === true || envelope.finiteGridParityOk === true,
    wavefunctionEvolutionSchema: wavefunctionEvolution.wavefunctionEvolutionSchema,
    wavefunctionEvolutionSource: wavefunctionEvolution.wavefunctionEvolutionSource,
    wavefunctionEvolutionBackend: wavefunctionEvolution.wavefunctionEvolutionBackend,
    wavefunctionEvolutionStatus: wavefunctionEvolution.wavefunctionEvolutionStatus,
    wavefunctionEvolutionNormDrift: wavefunctionEvolution.wavefunctionEvolutionNormDrift,
    wavefunctionEvolutionDensityDriftL1: wavefunctionEvolution.wavefunctionEvolutionDensityDriftL1,
    wavefunctionEvolutionEnergyExpectationEv: wavefunctionEvolution.wavefunctionEvolutionEnergyExpectationEv,
    wavefunctionEvolutionKineticExpectationEv: wavefunctionEvolution.wavefunctionEvolutionKineticExpectationEv,
    wavefunctionEvolutionPotentialExpectationEv: wavefunctionEvolution.wavefunctionEvolutionPotentialExpectationEv,
    wavefunctionEvolutionFieldEnergyExpectationEv: wavefunctionEvolution.wavefunctionEvolutionFieldEnergyExpectationEv,
    wavefunctionEvolutionAbsFieldEnergyExpectationEv: wavefunctionEvolution.wavefunctionEvolutionAbsFieldEnergyExpectationEv,
    wavefunctionEvolutionElectricFieldVm: wavefunctionEvolution.wavefunctionEvolutionElectricFieldVm,
    wavefunctionEvolutionElectricFieldAtomicUnits: wavefunctionEvolution.wavefunctionEvolutionElectricFieldAtomicUnits,
    wavefunctionEvolutionDipoleMomentZBohrElectron: wavefunctionEvolution.wavefunctionEvolutionDipoleMomentZBohrElectron,
    wavefunctionEvolutionFieldRmsExtentBohr: wavefunctionEvolution.wavefunctionEvolutionFieldRmsExtentBohr,
    wavefunctionEvolutionPolarizabilityProxyBohr3: wavefunctionEvolution.wavefunctionEvolutionPolarizabilityProxyBohr3,
    wavefunctionEvolutionStarkShiftProxyEv: wavefunctionEvolution.wavefunctionEvolutionStarkShiftProxyEv,
    wavefunctionEvolutionFieldResponseSchema: wavefunctionEvolution.wavefunctionEvolutionFieldResponseSchema,
    wavefunctionEvolutionMagneticFieldT: wavefunctionEvolution.wavefunctionEvolutionMagneticFieldT,
    wavefunctionEvolutionMagneticFieldAtomicUnits: wavefunctionEvolution.wavefunctionEvolutionMagneticFieldAtomicUnits,
    wavefunctionEvolutionZeemanEnergyExpectationEv: wavefunctionEvolution.wavefunctionEvolutionZeemanEnergyExpectationEv,
    wavefunctionEvolutionAbsZeemanEnergyExpectationEv: wavefunctionEvolution.wavefunctionEvolutionAbsZeemanEnergyExpectationEv,
    wavefunctionEvolutionMagneticMomentProjectionBohrMagneton: wavefunctionEvolution.wavefunctionEvolutionMagneticMomentProjectionBohrMagneton,
    wavefunctionEvolutionZeemanProjection: wavefunctionEvolution.wavefunctionEvolutionZeemanProjection,
    wavefunctionEvolutionSpinProjection: wavefunctionEvolution.wavefunctionEvolutionSpinProjection,
    wavefunctionEvolutionLarmorAngularFrequencyProxyAu: wavefunctionEvolution.wavefunctionEvolutionLarmorAngularFrequencyProxyAu,
    wavefunctionEvolutionMagneticResponseSchema: wavefunctionEvolution.wavefunctionEvolutionMagneticResponseSchema,
    wavefunctionEvolutionComponentEnergyExpectationEv: wavefunctionEvolution.wavefunctionEvolutionComponentEnergyExpectationEv,
    wavefunctionEvolutionHamiltonianComponentResidualEv: wavefunctionEvolution.wavefunctionEvolutionHamiltonianComponentResidualEv,
    wavefunctionEvolutionVirialResidualEv: wavefunctionEvolution.wavefunctionEvolutionVirialResidualEv,
    wavefunctionEvolutionHamiltonianComponentsSchema: wavefunctionEvolution.wavefunctionEvolutionHamiltonianComponentsSchema,
    wavefunctionEvolutionPhaseRotationRad: wavefunctionEvolution.wavefunctionEvolutionPhaseRotationRad,
    wavefunctionEvolutionDtAtomicUnits: wavefunctionEvolution.wavefunctionEvolutionDtAtomicUnits,
    wavefunctionEvolutionWebgpuParityOk: wavefunctionEvolution.wavefunctionEvolutionWebgpuParityOk,
    wavefunctionEvolutionWebgpuExecuted: wavefunctionEvolution.wavefunctionEvolutionWebgpuExecuted,
    wavefunctionEvolutionLiveBackendPolicy: wavefunctionEvolution.wavefunctionEvolutionLiveBackendPolicy,
    wavefunctionEvolutionDrive: wavefunctionEvolution.wavefunctionEvolutionDrive,
    radialEigenstateSchema: radialEigenstate.radialEigenstateSchema,
    radialEigenstateSource: radialEigenstate.radialEigenstateSource,
    radialEigenstateStatus: radialEigenstate.radialEigenstateStatus,
    radialEigenstateEnergyEv: radialEigenstate.radialEigenstateEnergyEv,
    radialEigenstateAnalyticEnergyEv: radialEigenstate.radialEigenstateAnalyticEnergyEv,
    radialEigenstateEnergyErrorEv: radialEigenstate.radialEigenstateEnergyErrorEv,
    radialEigenstateResidualRelativeL2: radialEigenstate.radialEigenstateResidualRelativeL2,
    radialEigenstateMeanRadiusBohr: radialEigenstate.radialEigenstateMeanRadiusBohr,
    radialEigenstateGridPointCount: radialEigenstate.radialEigenstateGridPointCount,
    radialEigenstateNodeCountObserved: radialEigenstate.radialEigenstateNodeCountObserved,
    radialEigenstateNodeCountTarget: radialEigenstate.radialEigenstateNodeCountTarget,
    radialEigenstateWebgpuExecuted: radialEigenstate.radialEigenstateWebgpuExecuted,
    statisticalBridgeSchema: statisticalBridge.statisticalBridgeSchema,
    statisticalBridgeSource: statisticalBridge.statisticalBridgeSource,
    statisticalBridgeStatus: statisticalBridge.statisticalBridgeStatus,
    statisticalBridgeBackend: statisticalBridge.statisticalBridgeBackend,
    statisticalBridgePartitionFunctionLog: statisticalBridge.statisticalBridgePartitionFunctionLog,
    statisticalBridgeGroundOccupation: statisticalBridge.statisticalBridgeGroundOccupation,
    statisticalBridgeExcitedOccupation: statisticalBridge.statisticalBridgeExcitedOccupation,
    statisticalBridgeFreeEnergyEv: statisticalBridge.statisticalBridgeFreeEnergyEv,
    statisticalBridgeInternalEnergyEv: statisticalBridge.statisticalBridgeInternalEnergyEv,
    statisticalBridgeHeatCapacityProxy: statisticalBridge.statisticalBridgeHeatCapacityProxy,
    statisticalBridgeEntropyProxyKb: statisticalBridge.statisticalBridgeEntropyProxyKb,
    statisticalBridgeIonizationFraction: statisticalBridge.statisticalBridgeIonizationFraction,
    statisticalBridgeOpacityPopulationProxy: statisticalBridge.statisticalBridgeOpacityPopulationProxy,
    statisticalBridgeDegeneracyParameter: statisticalBridge.statisticalBridgeDegeneracyParameter,
    statisticalBridgeEnsemblePressurePa: statisticalBridge.statisticalBridgeEnsemblePressurePa,
    statisticalBridgeTemperatureDeltaKProxy: statisticalBridge.statisticalBridgeTemperatureDeltaKProxy,
    statisticalBridgeChargeDeltaProxy: statisticalBridge.statisticalBridgeChargeDeltaProxy,
    statisticalBridgeThermalDampingScale: statisticalBridge.statisticalBridgeThermalDampingScale,
    statisticalBridgeWebgpuExecuted: statisticalBridge.statisticalBridgeWebgpuExecuted,
    statisticalBridgeDrive: statisticalBridge.statisticalBridgeDrive,
    confidence
  };
}

function quantumCouplingForState(state) {
  return normalizeMolecularQuantumCoupling(state?.quantumCoupling);
}

function cloneQuantumMaterialSource(source) {
  if (source?.schema !== MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA) return normalizeMolecularQuantumMaterialSource(null);
  return {
    ...source,
    forceSurfacePreview: source.forceSurfacePreview ? { ...source.forceSurfacePreview } : null,
    statisticalEnsemble: source.statisticalEnsemble ? { ...source.statisticalEnsemble } : null,
    statisticalSourceEquation: source.statisticalSourceEquation ? { ...source.statisticalSourceEquation } : null,
    propertyResponse: source.propertyResponse ? { ...source.propertyResponse } : null,
    responseDerivatives: source.responseDerivatives ? { ...source.responseDerivatives } : null,
    molecularGeometrySource: source.molecularGeometrySource ? { ...source.molecularGeometrySource } : null,
    electronicChargeSource: source.electronicChargeSource ? { ...source.electronicChargeSource } : null,
    reactionBarrierSurface: source.reactionBarrierSurface
      ? {
        ...source.reactionBarrierSurface,
        productTopology: source.reactionBarrierSurface.productTopology
          ? {
            ...source.reactionBarrierSurface.productTopology,
            products: Array.isArray(source.reactionBarrierSurface.productTopology.products)
              ? source.reactionBarrierSurface.productTopology.products.map((product) => ({ ...product, atomCounts: { ...(product.atomCounts || {}) } }))
              : [],
            productBonds: Array.isArray(source.reactionBarrierSurface.productTopology.productBonds)
              ? source.reactionBarrierSurface.productTopology.productBonds.map((bond) => ({
                ...bond,
                elements: Array.isArray(bond.elements) ? [...bond.elements] : []
              }))
              : []
          }
          : null
      }
      : null,
    reactionBarrierProductTopology: source.reactionBarrierProductTopology
      ? {
        ...source.reactionBarrierProductTopology,
        products: Array.isArray(source.reactionBarrierProductTopology.products)
          ? source.reactionBarrierProductTopology.products.map((product) => ({ ...product, atomCounts: { ...(product.atomCounts || {}) } }))
          : [],
        productBonds: Array.isArray(source.reactionBarrierProductTopology.productBonds)
          ? source.reactionBarrierProductTopology.productBonds.map((bond) => ({
            ...bond,
            elements: Array.isArray(bond.elements) ? [...bond.elements] : []
          }))
          : []
      }
      : null,
    source: source.source && typeof source.source === 'object' ? { ...source.source } : (source.source || null),
    validity: source.validity
      ? {
        ...source.validity,
        warnings: Array.isArray(source.validity.warnings) ? [...source.validity.warnings] : []
      }
      : null
  };
}

function firstObject(...values) {
  return values.find((value) => value && typeof value === 'object') || null;
}

function candidateQuantumMaterialBatch(source = {}) {
  return firstObject(
    source.batch,
    source.concurrentBatch,
    source.diagnostics?.batch,
    source.diagnostics?.concurrentBatch,
    source.chemistry?.concurrentBatch,
    source.value?.batch,
    source.value?.diagnostics?.batch
  );
}

function candidateQuantumMaterialForceSurface(source = {}, batch = null) {
  return firstObject(
    batch?.forceSurfacePreview,
    source.forceSurfacePreview,
    source.concurrentForceSurfacePreview,
    source.diagnostics?.forceSurfacePreview,
    source.diagnostics?.concurrentForceSurfacePreview,
    source.chemistry?.forceSurfacePreview,
    source.chemistry?.concurrentForceSurfacePreview,
    source.potential?.forceSurfacePreview,
    source.value?.batch?.forceSurfacePreview,
    source.value?.potential?.forceSurfacePreview
  );
}

function candidateQuantumMaterialEnsemble(source = {}, batch = null) {
  return firstObject(
    batch?.statisticalEnsemble,
    source.statisticalEnsemble,
    source.concurrentStatisticalEnsemble,
    source.statistical?.ensemble,
    source.statistical?.statisticalEnsemble,
    source.statistical,
    source.diagnostics?.statisticalEnsemble,
    source.diagnostics?.concurrentStatisticalEnsemble,
    source.diagnostics?.concurrentStatisticalClosure,
    source.chemistry?.statisticalEnsemble,
    source.chemistry?.concurrentStatisticalEnsemble,
    source.chemistry?.concurrentStatisticalClosure,
    source.potential?.statisticalEnsemble,
    source.value?.batch?.statisticalEnsemble,
    source.value?.potential?.statisticalEnsemble
  );
}

function candidateQuantumMaterialPropertyResponse(source = {}, batch = null) {
  return firstObject(
    batch?.propertyResponse,
    source.propertyResponse,
    source.concurrentPropertyResponse,
    source.diagnostics?.propertyResponse,
    source.diagnostics?.concurrentPropertyResponse,
    source.chemistry?.propertyResponse,
    source.chemistry?.concurrentPropertyResponse,
    source.potential?.propertyResponse,
    source.value?.batch?.propertyResponse,
    source.value?.potential?.propertyResponse
  );
}

function candidateQuantumMaterialResponseDerivatives(source = {}, batch = null, propertyResponse = null) {
  return firstObject(
    batch?.responseDerivatives,
    batch?.propertyResponse?.responseDerivatives,
    propertyResponse?.responseDerivatives,
    source.responseDerivatives,
    source.concurrentResponseDerivatives,
    source.diagnostics?.responseDerivatives,
    source.diagnostics?.concurrentResponseDerivatives,
    source.chemistry?.responseDerivatives,
    source.chemistry?.concurrentResponseDerivatives,
    source.potential?.responseDerivatives,
    source.value?.batch?.responseDerivatives,
    source.value?.batch?.propertyResponse?.responseDerivatives,
    source.value?.potential?.responseDerivatives
  );
}

function candidateQuantumMaterialMolecularGeometrySource(source = {}, batch = null) {
  return firstObject(
    batch?.molecularGeometrySource,
    source.molecularGeometrySource,
    source.concurrentMolecularGeometrySource,
    source.diagnostics?.molecularGeometrySource,
    source.diagnostics?.concurrentMolecularGeometrySource,
    source.chemistry?.molecularGeometrySource,
    source.chemistry?.concurrentMolecularGeometrySource,
    source.potential?.molecularGeometrySource,
    source.value?.batch?.molecularGeometrySource,
    source.value?.potential?.molecularGeometrySource
  );
}

function candidateQuantumMaterialElectronicChargeSource(source = {}, batch = null) {
  return firstObject(
    batch?.electronicChargeSource,
    source.electronicChargeSource,
    source.concurrentElectronicChargeSource,
    source.diagnostics?.electronicChargeSource,
    source.diagnostics?.concurrentElectronicChargeSource,
    source.chemistry?.electronicChargeSource,
    source.chemistry?.concurrentElectronicChargeSource,
    source.potential?.electronicChargeSource,
    source.value?.batch?.electronicChargeSource,
    source.value?.potential?.electronicChargeSource
  );
}

function candidateQuantumMaterialReactionBarrierSurface(source = {}, batch = null, forceSurface = null) {
  return firstObject(
    batch?.reactionBarrierSurface,
    batch?.forceSurfacePreview?.reactionBarrierSurface,
    forceSurface?.reactionBarrierSurface,
    source.reactionBarrierSurface,
    source.concurrentReactionBarrierSurface,
    source.diagnostics?.reactionBarrierSurface,
    source.diagnostics?.concurrentReactionBarrierSurface,
    source.chemistry?.reactionBarrierSurface,
    source.chemistry?.concurrentReactionBarrierSurface,
    source.potential?.reactionBarrierSurface,
    source.value?.batch?.reactionBarrierSurface,
    source.value?.batch?.forceSurfacePreview?.reactionBarrierSurface,
    source.value?.potential?.reactionBarrierSurface
  );
}

function molecularGeometryTargetsFromQuantumMaterialSource(source = null) {
  const geometry = source?.molecularGeometrySource || source?.geometrySource || null;
  const geometryApplied = source?.applied === true
    && geometry?.schema === QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA
    && (geometry.status === 'webgpu-geometry-source-ready' || geometry.geometryRecordCount > 0);
  const targetAngleDeg = normalizeNumber(
    geometry?.targetAngleDeg ?? source?.geometryTargetAngleDeg,
    WATER_HOH_TARGET_ANGLE_DEG,
    60,
    150
  );
  const targetAngleCos = normalizeNumber(
    geometry?.targetAngleCos ?? source?.geometryTargetAngleCos,
    Math.cos(targetAngleDeg * Math.PI / 180),
    -0.98,
    0.98
  );
  const targetOhDistanceReducedNm = normalizeNumber(
    geometry?.targetOhDistanceReducedNm ?? source?.geometryTargetOhDistanceReducedNm,
    WATER_OH_REST_REDUCED_NM,
    0.045,
    0.145
  );
  const targetHhDistanceReducedNm = normalizeNumber(
    geometry?.targetHhDistanceReducedNm ?? source?.geometryTargetHhDistanceReducedNm,
    2 * targetOhDistanceReducedNm * Math.sin(targetAngleDeg * Math.PI / 360),
    0.075,
    0.24
  );
  return {
    sourceApplied: geometryApplied,
    sourceSchema: geometry?.schema || source?.geometrySourceSchema || null,
    sourceModelId: geometry?.modelId || source?.geometrySourceModelId || null,
    sourceStatus: geometry?.status || source?.geometrySourceStatus || (geometryApplied ? 'ready' : 'fallback-md-reference'),
    sourceBackend: geometry?.backend || source?.geometrySourceBackend || source?.backend || null,
    targetSource: geometryApplied ? 'quantum-material-molecular-geometry-source' : 'md-default-reduced-water-reference',
    targetMolecule: geometry?.targetMolecule || source?.geometryTargetMolecule || 'H2O',
    targetPairLabel: geometry?.targetPairLabel || source?.geometryTargetPairLabel || 'O-H',
    targetAngleDeg,
    targetAngleCos,
    targetOhDistanceReducedNm,
    targetHhDistanceReducedNm,
    distanceStiffnessProxy: normalizeNumber(
      geometry?.distanceStiffnessProxy ?? source?.geometryDistanceStiffnessProxy,
      1,
      0.25,
      1.8
    ),
    angleStiffnessProxy: normalizeNumber(
      geometry?.angleStiffnessProxy ?? source?.geometryAngleStiffnessProxy,
      1,
      0.25,
      1.8
    ),
    confidence: normalizeNumber(geometry?.confidence ?? source?.geometrySourceConfidence, geometryApplied ? 0.55 : 0, 0, 1),
    calibrated: geometry?.calibrated === true,
    geometryRecordCount: normalizeInteger(geometry?.geometryRecordCount ?? source?.geometrySourceRecordCount, 0, 0, 1048576),
    bondRecordCount: normalizeInteger(geometry?.bondRecordCount ?? source?.geometrySourceBondRecordCount, 0, 0, 1048576),
    molecularGeometrySource: geometry ? { ...geometry } : null
  };
}

function candidateQuantumMaterialStatisticalSourceEquation(source = {}, batch = null, ensemble = null) {
  return firstObject(
    batch?.statisticalSourceEquation,
    batch?.sourceEquation,
    batch?.statisticalEnsemble?.sourceEquation,
    ensemble?.sourceEquation,
    source.statisticalSourceEquation,
    source.sourceEquation,
    source.concurrentStatisticalSourceEquation,
    source.statistical?.sourceEquation,
    source.diagnostics?.statisticalSourceEquation,
    source.diagnostics?.sourceEquation,
    source.diagnostics?.concurrentStatisticalSourceEquation,
    source.diagnostics?.concurrentStatisticalClosure?.sourceEquation,
    source.chemistry?.statisticalSourceEquation,
    source.chemistry?.sourceEquation,
    source.chemistry?.concurrentStatisticalClosure?.sourceEquation,
    source.potential?.statisticalSourceEquation,
    source.value?.batch?.statisticalSourceEquation,
    source.value?.batch?.statisticalEnsemble?.sourceEquation,
    source.value?.potential?.statisticalSourceEquation
  );
}

function makeFallbackQuantumStatisticalSourceEquation(ensemble = null) {
  if (!ensemble || typeof ensemble !== 'object') return null;
  const pressurePa = normalizeNumber(ensemble.pressurePa, 101325, 1, 1e18);
  const ensemblePressurePa = normalizeNumber(
    ensemble.ensemblePressurePa ?? ensemble.closureOutputs?.pressurePa,
    pressurePa,
    1,
    1e18
  );
  const pressureRatio = normalizeNumber(ensemblePressurePa / Math.max(1, pressurePa), 1, 0.001, 1000);
  const ionizationFraction = normalizeNumber(ensemble.ionizationFraction, 0, 0, 1);
  const opacityProxy = normalizeNumber(ensemble.opacityProxy, 0, 0, 64);
  const degeneracyParameter = normalizeNumber(ensemble.degeneracyParameter, 0, 0, 128);
  const heatCapacityProxy = normalizeNumber(ensemble.heatCapacityProxy, 0, 0, 64);
  const pressureDriveProxy = clamp(
    Math.log2(Math.max(0.001, pressureRatio)) * 0.16
      + ionizationFraction * 0.08
      + Math.min(0.12, degeneracyParameter * 0.012),
    -0.25,
    0.55
  );
  const ionizationDriveProxy = clamp(ionizationFraction * 0.18 + pressureDriveProxy * 0.05, 0, 0.24);
  const opacityDriveProxy = clamp(opacityProxy * 0.05 + ionizationFraction * 0.08, 0, 1.35);
  const degeneracyPressureDriveProxy = clamp(degeneracyParameter * 0.012, 0, 0.32);
  const thermalDampingScale = clamp(
    1 + Math.min(0.22, heatCapacityProxy * 0.01) - Math.min(0.08, Math.max(0, pressureDriveProxy) * 0.12),
    0.72,
    1.28
  );
  const channels = [
    { id: 'ensemble-pressure', quantity: 'pressure', unit: 'Pa', sourceValue: ensemblePressurePa, baseValue: pressurePa, driveProxy: pressureDriveProxy },
    { id: 'ionization-population', quantity: 'ionization-fraction', unit: 'dimensionless', sourceValue: ionizationFraction, driveProxy: ionizationDriveProxy },
    { id: 'opacity-population', quantity: 'opacity-proxy', unit: 'reduced', sourceValue: opacityProxy, driveProxy: opacityDriveProxy },
    { id: 'degeneracy-pressure', quantity: 'degeneracy-parameter', unit: 'dimensionless', sourceValue: degeneracyParameter, driveProxy: degeneracyPressureDriveProxy },
    { id: 'heat-capacity', quantity: 'heat-capacity-proxy', unit: 'reduced', sourceValue: heatCapacityProxy, driveProxy: thermalDampingScale }
  ];
  return {
    schema: QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA,
    adapterSchema: 'peercompute.multiscale.molecular-source-equation.v0',
    mode: 'quantum-statistical-ensemble-source-channels-v0',
    status: 'source-equation-derived-from-ensemble',
    source: {
      ensembleSchema: ensemble.schema || QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA,
      modelId: ensemble.modelId || null,
      backend: ensemble.backend || null,
      recordCount: Math.max(0, Math.round(normalizeNumber(ensemble.recordCount, 0, 0))),
      distribution: ensemble.source?.distribution || 'reduced-boltzmann-saha-degeneracy',
      partitionFunctionLog: normalizeNumber(ensemble.partitionFunctionLog, 0)
    },
    channelCount: channels.length,
    channels,
    sourceTerms: {
      temperatureDeltaKProxy: clamp(ionizationFraction * 42 + opacityProxy * 0.9 + pressureDriveProxy * 8 + heatCapacityProxy * 0.2, -20, 45),
      chargeDeltaProxy: clamp(ionizationFraction * 0.08 + degeneracyPressureDriveProxy * 0.02, -0.04, 0.08),
      pressureDriveProxy,
      opacityDriveProxy,
      ionizationDriveProxy,
      degeneracyPressureDriveProxy,
      heatCapacityProxy,
      thermalDampingScale,
      pressureRatio
    },
    closureOutputs: {
      pressurePa: ensemblePressurePa,
      opacityProxy,
      ionizationFraction,
      degeneracyParameter,
      degeneracyRegime: ensemble.degeneracyRegime || 'classical',
      heatCapacityProxy
    }
  };
}

function elementZForSymbol(symbol) {
  const normalized = normalizeElementKey(symbol);
  return normalized ? (ELEMENT[normalized] || 0) : 0;
}

function parseFormulaElementSymbols(formula = '') {
  const text = String(formula || '');
  const symbols = [];
  const seen = new Set();
  for (const match of text.matchAll(/([A-Z][a-z]?)(?:\d+(?:\.\d+)?)?/g)) {
    const normalized = normalizeElementKey(match[1]);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    symbols.push(normalized);
  }
  return symbols;
}

function makeQuantumMaterialTargetPair({
  materialId = null,
  elementSymbol = null,
  dominantFormula = null,
  pairForceMix = 0,
  uncertainty = 0
} = {}) {
  const explicitPrimary = elementZForSymbol(elementSymbol);
  const formulaSymbols = parseFormulaElementSymbols(dominantFormula);
  const text = `${materialId || ''} ${dominantFormula || ''}`.toLowerCase();
  let primarySymbol = null;
  let secondarySymbol = null;
  let mode = 'all-pairs';
  let basis = 'no-target';

  if (text.includes('h2o') || text.includes('water') || (formulaSymbols.includes('H') && formulaSymbols.includes('O'))) {
    primarySymbol = 'O';
    secondarySymbol = 'H';
    mode = 'formula-hetero-pair';
    basis = 'water-oh';
  } else if (text.includes('nacl') || text.includes('sodium chloride') || (formulaSymbols.includes('Na') && formulaSymbols.includes('Cl'))) {
    primarySymbol = 'Na';
    secondarySymbol = 'Cl';
    mode = 'formula-ionic-pair';
    basis = 'salt-nacl';
  } else if (formulaSymbols.length >= 2) {
    primarySymbol = formulaSymbols.find((symbol) => symbol !== 'H') || formulaSymbols[0];
    secondarySymbol = formulaSymbols.find((symbol) => symbol !== primarySymbol) || formulaSymbols[1];
    mode = 'formula-hetero-pair';
    basis = 'dominant-formula';
  } else if (explicitPrimary > 0) {
    primarySymbol = normalizeElementKey(elementSymbol);
    mode = 'element-containing-pair';
    basis = 'element-symbol';
  }

  const primaryElementZ = elementZForSymbol(primarySymbol);
  const secondaryElementZ = elementZForSymbol(secondarySymbol);
  const boundedMix = normalizeNumber(pairForceMix, 0, 0, 1);
  const boundedUncertainty = normalizeNumber(uncertainty, 0, 0, 16);
  const hasHeteroTarget = primaryElementZ > 0 && secondaryElementZ > 0;
  const hasElementTarget = primaryElementZ > 0;
  const pairSelectivity = hasHeteroTarget
    ? clamp(0.72 + boundedMix * 0.22 - boundedUncertainty * 0.035, 0.55, 0.96)
    : hasElementTarget
      ? clamp(0.45 + boundedMix * 0.2 - boundedUncertainty * 0.02, 0.32, 0.75)
      : 0;
  const pairFallbackFactor = hasHeteroTarget
    ? clamp(0.18 - boundedMix * 0.08 + boundedUncertainty * 0.035, 0.06, 0.35)
    : hasElementTarget
      ? clamp(0.38 - boundedMix * 0.08 + boundedUncertainty * 0.025, 0.18, 0.65)
      : 1;
  const targetPairLabel = hasHeteroTarget
    ? `${symbolForElement(primaryElementZ)}-${symbolForElement(secondaryElementZ)}`
    : hasElementTarget
      ? `${symbolForElement(primaryElementZ)}-*`
      : 'all-pairs';

  return {
    targetPairLabel,
    targetPairMode: mode,
    targetPairBasis: basis,
    primaryElementZ,
    primaryElementSymbol: hasElementTarget ? symbolForElement(primaryElementZ) : null,
    secondaryElementZ,
    secondaryElementSymbol: hasHeteroTarget ? symbolForElement(secondaryElementZ) : null,
    pairSelectivity,
    pairFallbackFactor
  };
}

function quantumMaterialPairTargetFactorForElements(elementA, elementB, source = null) {
  const normalized = source?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
    ? source
    : normalizeMolecularQuantumMaterialSource(source);
  if (normalized.applied !== true) return 0;
  const primary = Number(normalized.primaryElementZ || 0);
  const secondary = Number(normalized.secondaryElementZ || 0);
  const fallback = normalizeNumber(normalized.pairFallbackFactor, primary > 0 ? 0.25 : 1, 0, 1);
  if (primary > 0 && secondary > 0) {
    const direct = Number(elementA) === primary && Number(elementB) === secondary;
    const reverse = Number(elementA) === secondary && Number(elementB) === primary;
    return direct || reverse ? 1 : fallback;
  }
  if (primary > 0) {
    return Number(elementA) === primary || Number(elementB) === primary ? 1 : fallback;
  }
  return 1;
}

function quantumMaterialAtomTargetFactorForElement(element, source = null) {
  const normalized = source?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
    ? source
    : normalizeMolecularQuantumMaterialSource(source);
  if (normalized.applied !== true) return 0;
  const primary = Number(normalized.primaryElementZ || 0);
  const secondary = Number(normalized.secondaryElementZ || 0);
  const fallback = normalizeNumber(normalized.pairFallbackFactor, primary > 0 ? 0.25 : 1, 0, 1);
  const atom = Number(element);
  if (primary > 0 && secondary > 0) {
    return atom === primary || atom === secondary ? 1 : fallback;
  }
  if (primary > 0) {
    return atom === primary ? 1 : fallback;
  }
  return 1;
}

function qmatChargeSignForElement(element) {
  const z = Number(element);
  if (z === ELEMENT.O || z === ELEMENT.F || z === ELEMENT.Cl) return -1;
  if (z === ELEMENT.Na || z === ELEMENT.Mg || z === ELEMENT.K || z === ELEMENT.Ca || z === ELEMENT.Fe) return 1;
  return 0.5;
}

function summarizeQuantumMaterialTargetPairs(state, source) {
  const normalized = source?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
    ? source
    : normalizeMolecularQuantumMaterialSource(source);
  const atomCount = normalizeInteger(state?.atomCount, 0, 0, MOLECULAR_DYNAMICS_WEBGPU_MAX_ATOMS);
  const primary = Number(normalized.primaryElementZ || 0);
  const secondary = Number(normalized.secondaryElementZ || 0);
  const targetElements = new Set([primary, secondary].filter((value) => value > 0));
  let targetAtomCount = 0;
  let fallbackAtomCount = 0;
  let weightedAtomFactorSum = 0;
  if (normalized.applied === true && atomCount > 0) {
    for (let i = 0; i < atomCount; i += 1) {
      const factor = quantumMaterialAtomTargetFactorForElement(state.elementZ[i], normalized);
      weightedAtomFactorSum += factor;
      if (targetElements.size === 0 || factor >= 0.999) targetAtomCount += 1;
      else fallbackAtomCount += 1;
    }
  }

  let candidatePairCount = 0;
  let selectedPairCount = 0;
  let fallbackPairCount = 0;
  let weightedPairFactorSum = 0;
  if (normalized.applied === true && atomCount > 1) {
    const searchRadius = MOLECULAR_DYNAMICS_FORCE_RADIUS;
    forEachSpatialCandidatePair(state, {
      searchRadius,
      callback: (i, j) => {
        const dx = state.positionsX[j] - state.positionsX[i];
        const dy = state.positionsY[j] - state.positionsY[i];
        const dz = state.positionsZ[j] - state.positionsZ[i];
        const distanceSquared = dx * dx + dy * dy + dz * dz;
        if (distanceSquared > searchRadius * searchRadius) return;
        candidatePairCount += 1;
        const factor = quantumMaterialPairTargetFactorForElements(state.elementZ[i], state.elementZ[j], normalized);
        weightedPairFactorSum += factor;
        if (factor >= 0.999) selectedPairCount += 1;
        else fallbackPairCount += 1;
      }
    });
  }

  return {
    targetMatchedAtomCount: targetAtomCount,
    targetAtomCount,
    targetFallbackAtomCount: fallbackAtomCount,
    targetAtomWeightedFactorSum: weightedAtomFactorSum,
    targetAtomMeanFactor: atomCount > 0 ? weightedAtomFactorSum / atomCount : 0,
    targetAtomFraction: atomCount > 0 ? targetAtomCount / atomCount : 0,
    targetPairCandidateCount: candidatePairCount,
    targetPairSelectedCount: selectedPairCount,
    targetPairFallbackCount: fallbackPairCount,
    targetPairWeightedFactorSum: weightedPairFactorSum,
    targetPairMeanFactor: candidatePairCount > 0 ? weightedPairFactorSum / candidatePairCount : 0,
    targetPairFraction: candidatePairCount > 0 ? selectedPairCount / candidatePairCount : 0
  };
}

function normalizeMolecularQuantumMaterialSource(input = null, fallback = null) {
  if (input?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA) return cloneQuantumMaterialSource(input);
  const source = firstObject(input, fallback);
  const batch = candidateQuantumMaterialBatch(source || {});
  const forceSurface = candidateQuantumMaterialForceSurface(source || {}, batch);
  const ensemble = candidateQuantumMaterialEnsemble(source || {}, batch);
  const statisticalSourceEquation = candidateQuantumMaterialStatisticalSourceEquation(source || {}, batch, ensemble)
    || makeFallbackQuantumStatisticalSourceEquation(ensemble);
  const propertyResponse = candidateQuantumMaterialPropertyResponse(source || {}, batch);
  const responseDerivatives = candidateQuantumMaterialResponseDerivatives(source || {}, batch, propertyResponse);
  const molecularGeometrySource = candidateQuantumMaterialMolecularGeometrySource(source || {}, batch);
  const electronicChargeSource = candidateQuantumMaterialElectronicChargeSource(source || {}, batch);
  const reactionBarrierSurface = candidateQuantumMaterialReactionBarrierSurface(source || {}, batch, forceSurface);
  const backend = batch?.backend || source?.backend || source?.concurrentBackend || source?.value?.backend || 'unavailable';
  const webgpuBatch = batch?.schema === QUANTUM_MATERIAL_POTENTIAL_BATCH_SCHEMA
    && String(backend || '').startsWith('webgpu');
  const recordCount = normalizeInteger(batch?.recordCount ?? source?.concurrentRecordCount, 0, 0, 1048576);
  const forceGradient = normalizeNumber(
    forceSurface?.meanForceGradientEvPerAngstrom
      ?? batch?.meanForceGradientEvPerAngstrom
      ?? source?.concurrentForceGradientEvPerAngstrom,
    0,
    0,
    1e6
  );
  const maxForceGradient = normalizeNumber(
    forceSurface?.maxForceGradientEvPerAngstrom
      ?? batch?.maxForceGradientEvPerAngstrom,
    forceGradient,
    0,
    1e6
  );
  const curvature = normalizeNumber(
    forceSurface?.meanCurvatureEvPerAngstrom2
      ?? batch?.meanCurvatureEvPerAngstrom2,
    0,
    -1e6,
    1e6
  );
  const uncertainty = normalizeNumber(
    forceSurface?.meanUncertainty
      ?? forceSurface?.meanForceSurfaceUncertainty
      ?? batch?.meanForceSurfaceUncertainty,
    webgpuBatch ? 0.5 : 1,
    0,
    16
  );
  const behaviorDrive = normalizeNumber(
    batch?.meanBehaviorDrive
      ?? source?.concurrentBehaviorDrive
      ?? source?.behaviorDrive,
    0,
    0,
    64
  );
  const ionizationFraction = normalizeNumber(
    ensemble?.ionizationFraction
      ?? source?.ensembleIonizationFraction,
    0,
    0,
    1
  );
  const opacityProxy = normalizeNumber(
    ensemble?.opacityProxy
      ?? source?.ensembleOpacityProxy,
    0,
    0,
    64
  );
  const degeneracyParameter = normalizeNumber(
    ensemble?.degeneracyParameter
      ?? source?.ensembleDegeneracyParameter,
    0,
    0,
    128
  );
  const ensembleBasePressurePa = normalizeNumber(
    ensemble?.pressurePa
      ?? batch?.conditionSnapshot?.pressurePa
      ?? source?.conditionSnapshot?.pressurePa,
    101325,
    1,
    1e18
  );
  const ensemblePressurePa = normalizeNumber(
    ensemble?.ensemblePressurePa
      ?? ensemble?.closureOutputs?.pressurePa
      ?? batch?.ensemblePressurePa,
    ensembleBasePressurePa,
    1,
    1e18
  );
  const ensemblePressureRatio = normalizeNumber(
    ensemblePressurePa / Math.max(1, ensembleBasePressurePa),
    1,
    0.001,
    1000
  );
  const heatCapacityProxy = normalizeNumber(
    ensemble?.heatCapacityProxy
      ?? source?.ensembleHeatCapacityProxy,
    0,
    0,
    64
  );
  const statisticalSourceTerms = statisticalSourceEquation?.sourceTerms || {};
  const statisticalSourceChannelCount = Math.max(0, Math.round(normalizeNumber(
    statisticalSourceEquation?.channelCount ?? statisticalSourceEquation?.channels?.length,
    0,
    0
  )));
  const statisticalSourcePressureDriveProxy = normalizeNumber(
    statisticalSourceTerms.pressureDriveProxy,
    0,
    -1,
    1
  );
  const statisticalSourceOpacityDriveProxy = normalizeNumber(
    statisticalSourceTerms.opacityDriveProxy,
    0,
    0,
    1.5
  );
  const statisticalSourceIonizationDriveProxy = normalizeNumber(
    statisticalSourceTerms.ionizationDriveProxy,
    0,
    0,
    1
  );
  const statisticalSourceDegeneracyPressureDriveProxy = normalizeNumber(
    statisticalSourceTerms.degeneracyPressureDriveProxy,
    0,
    0,
    1
  );
  const statisticalSourceTemperatureDeltaKProxy = normalizeNumber(
    statisticalSourceTerms.temperatureDeltaKProxy,
    0,
    -60,
    60
  );
  const statisticalSourceChargeDeltaProxy = normalizeNumber(
    statisticalSourceTerms.chargeDeltaProxy,
    0,
    -0.2,
    0.2
  );
  const statisticalSourceThermalDampingScale = normalizeNumber(
    statisticalSourceTerms.thermalDampingScale,
    1,
    0.5,
    1.5
  );
  const densityKgM3 = normalizeNumber(
    propertyResponse?.meanDensityKgM3
      ?? batch?.meanDensityKgM3
      ?? source?.densityKgM3
      ?? source?.potential?.densityKgM3
      ?? source?.value?.potential?.densityKgM3,
    0,
    0,
    1e8
  );
  const mechanicalResponsePa = normalizeNumber(
    propertyResponse?.meanMechanicalResponsePa
      ?? batch?.meanMechanicalResponsePa
      ?? source?.mechanicalResponsePa
      ?? source?.bulkModulusPa
      ?? source?.potential?.bulkModulusPa
      ?? source?.value?.potential?.bulkModulusPa,
    0,
    0,
    1e15
  );
  const bulkModulusPa = normalizeNumber(
    propertyResponse?.meanBulkModulusPa
      ?? source?.bulkModulusPa
      ?? source?.potential?.bulkModulusPa
      ?? source?.value?.potential?.bulkModulusPa,
    mechanicalResponsePa,
    0,
    1e15
  );
  const youngsModulusPa = normalizeNumber(
    propertyResponse?.meanYoungsModulusPa
      ?? source?.youngsModulusPa
      ?? source?.potential?.youngsModulusPa
      ?? source?.value?.potential?.youngsModulusPa,
    mechanicalResponsePa,
    0,
    1e15
  );
  const electricalConductivitySpm = normalizeNumber(
    propertyResponse?.meanElectricalConductivitySpm
      ?? source?.electricalConductivitySpm
      ?? source?.electricalConductivitySm
      ?? source?.potential?.electricalConductivitySpm
      ?? source?.value?.potential?.electricalConductivitySpm,
    0,
    0,
    1e12
  );
  const refractiveIndex = normalizeNumber(
    propertyResponse?.meanRefractiveIndex
      ?? source?.refractiveIndex
      ?? source?.potential?.refractiveIndex
      ?? source?.value?.potential?.refractiveIndex,
    1,
    0,
    16
  );
  const dielectricConstant = normalizeNumber(
    propertyResponse?.meanDielectricConstant
      ?? source?.dielectricConstant
      ?? source?.potential?.dielectricConstant
      ?? source?.value?.potential?.dielectricConstant,
    Math.max(1, refractiveIndex * refractiveIndex),
    1,
    256
  );
  const opticalAbsorptionProxy = normalizeNumber(
    propertyResponse?.meanOpticalAbsorptionProxy
      ?? source?.opticalAbsorptionProxy
      ?? opacityProxy,
    opacityProxy,
    0,
    64
  );
  const densityTemperatureDerivativeKgM3PerK = normalizeNumber(
    responseDerivatives?.meanDensityTemperatureDerivativeKgM3PerK
      ?? responseDerivatives?.jacobian?.densityKgM3?.temperatureK,
    0,
    -1e8,
    1e8
  );
  const mechanicalPressureDerivativePaPerLog2Pressure = normalizeNumber(
    responseDerivatives?.meanMechanicalPressureDerivativePaPerLog2Pressure
      ?? responseDerivatives?.jacobian?.mechanicalResponsePa?.log2PressureRatio,
    0,
    -1e15,
    1e15
  );
  const conductivityFieldDerivativeSpmPerNorm = normalizeNumber(
    responseDerivatives?.meanConductivityFieldDerivativeSpmPerNorm
      ?? responseDerivatives?.jacobian?.electricalConductivitySpm?.fieldDriveNorm,
    0,
    -1e12,
    1e12
  );
  const opacityRadiationDerivativePerNorm = normalizeNumber(
    responseDerivatives?.meanOpacityRadiationDerivativePerNorm
      ?? responseDerivatives?.jacobian?.opacityProxy?.radiationNorm,
    0,
    -64,
    64
  );
  const reducedForceAvailable = forceSurface?.reducedEnergyGradientAvailable === true
    || forceSurface?.schema === QUANTUM_MATERIAL_FORCE_SURFACE_SCHEMA
    || forceGradient > 0
    || maxForceGradient > 0;
  const applied = webgpuBatch && recordCount > 0;
  const electronicChargeSourceApplied = applied
    && electronicChargeSource?.schema === QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA
    && (electronicChargeSource.status === 'webgpu-electronic-charge-source-ready' || electronicChargeSource.webgpuDerived === true);
  const electronicChargeSourceChargeDeltaProxy = electronicChargeSourceApplied
    ? normalizeNumber(electronicChargeSource.chargeDeltaProxy, 0, -0.2, 0.2)
    : 0;
  const electronicChargeSourceIonizationDriveProxy = electronicChargeSourceApplied
    ? normalizeNumber(electronicChargeSource.ionizationDriveProxy, 0, 0, 1)
    : 0;
  const electronicChargeSourceMobilityProxy = electronicChargeSourceApplied
    ? normalizeNumber(electronicChargeSource.chargeMobilityProxy, 0, 0, 2)
    : 0;
  const electronicChargeSourceHardnessSofteningProxy = electronicChargeSourceApplied
    ? normalizeNumber(electronicChargeSource.hardnessSofteningProxy, 0, 0, 1)
    : 0;
  const electronicChargeSourceScreeningDampingScale = electronicChargeSourceApplied
    ? normalizeNumber(electronicChargeSource.screeningDampingScale, 1, 0.6, 1.4)
    : 1;
  const electronicChargeSourceQeqMixProxy = electronicChargeSourceApplied
    ? normalizeNumber(electronicChargeSource.qeqMixProxy, 0, 0, 1)
    : 0;
  const electronicChargeSourceElectronegativityDeltaProxy = electronicChargeSourceApplied
    ? normalizeNumber(electronicChargeSource.meanPairElectronegativityDeltaProxy, 0, 0, 6)
    : 0;
  const reactionBarrierSurfaceApplied = applied
    && reactionBarrierSurface?.schema === QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA
    && (
      reactionBarrierSurface.status === 'webgpu-reaction-barrier-proxy-ready'
        || reactionBarrierSurface.webgpuDerived === true
        || reactionBarrierSurface.barrierAvailable === true
    );
  const reactionBarrierActivationEnergyEvProxy = reactionBarrierSurfaceApplied
    ? normalizeNumber(reactionBarrierSurface.activationEnergyEvProxy, 0, 0, 10)
    : 0;
  const reactionBarrierProbabilityProxy = reactionBarrierSurfaceApplied
    ? normalizeNumber(reactionBarrierSurface.reactionProbabilityProxy, 0, 0, 1)
    : 0;
  const reactionBarrierGateDampingScale = reactionBarrierSurfaceApplied
    ? normalizeNumber(reactionBarrierSurface.gateDampingScale, 1, 0.2, 1)
    : 1;
  const reactionBarrierChargeTransferGateProxy = reactionBarrierSurfaceApplied
    ? normalizeNumber(reactionBarrierSurface.chargeTransferGateProxy, 0, 0, 1)
    : 0;
  const reactionBarrierGateProxy = reactionBarrierSurfaceApplied
    ? normalizeNumber(reactionBarrierSurface.reactionBarrierGateProxy ?? (1 - reactionBarrierGateDampingScale), 0, 0, 1)
    : 0;
  const reactionBarrierUnsupportedProductBlockerCount = reactionBarrierSurfaceApplied
    ? normalizeInteger(reactionBarrierSurface.unsupportedProductBlockerCount, 0, 0, 1024)
    : 0;
  const reactionBarrierProductStoichiometryAvailable = reactionBarrierSurfaceApplied
    && reactionBarrierSurface.productStoichiometryAvailable === true;
  const reactionBarrierProductTopologyAvailable = reactionBarrierSurfaceApplied
    && reactionBarrierSurface.productTopologyAvailable === true;
  const reactionBarrierProductStoichiometry = reactionBarrierProductStoichiometryAvailable
    && reactionBarrierSurface.productStoichiometry
    && typeof reactionBarrierSurface.productStoichiometry === 'object'
    ? {
      ...reactionBarrierSurface.productStoichiometry,
      reactants: { ...(reactionBarrierSurface.productStoichiometry.reactants || {}) },
      products: { ...(reactionBarrierSurface.productStoichiometry.products || {}) },
      integerReaction: reactionBarrierSurface.productStoichiometry.integerReaction
        ? {
          reactants: { ...(reactionBarrierSurface.productStoichiometry.integerReaction.reactants || {}) },
          products: { ...(reactionBarrierSurface.productStoichiometry.integerReaction.products || {}) }
        }
        : null
    }
    : null;
  const rawReactionBarrierProductTopology = reactionBarrierProductTopologyAvailable
    ? reactionBarrierSurface.productTopology
      || reactionBarrierProductStoichiometry?.productTopology
      || null
    : null;
  const reactionBarrierProductTopology = rawReactionBarrierProductTopology
    && typeof rawReactionBarrierProductTopology === 'object'
    ? {
      ...rawReactionBarrierProductTopology,
      products: Array.isArray(rawReactionBarrierProductTopology.products)
        ? rawReactionBarrierProductTopology.products.map((product) => ({ ...product, atomCounts: { ...(product.atomCounts || {}) } }))
        : [],
      productBonds: Array.isArray(rawReactionBarrierProductTopology.productBonds)
        ? rawReactionBarrierProductTopology.productBonds.map((bond) => ({
          ...bond,
          elements: Array.isArray(bond.elements) ? [...bond.elements] : []
        }))
        : []
    }
    : null;
  const reactionBarrierProductHeatReleaseProxy = reactionBarrierProductStoichiometryAvailable
    ? normalizeNumber(reactionBarrierSurface.productHeatReleaseProxy ?? reactionBarrierProductStoichiometry?.heatReleaseProxy, 0, 0, 16)
    : 0;
  const reactionBarrierProductChargeDeltaProxy = reactionBarrierProductStoichiometryAvailable
    ? normalizeNumber(reactionBarrierSurface.productChargeDeltaProxy ?? reactionBarrierProductStoichiometry?.chargeDeltaProxy, 0, -1, 1)
    : 0;
  const reactionBarrierProductExtentProxy = reactionBarrierProductStoichiometryAvailable
    ? normalizeNumber(reactionBarrierSurface.productExtentProxy ?? reactionBarrierProductStoichiometry?.extentProxy, 0, 0, 1)
    : 0;
  const reactionBarrierChargeTransferRequired = reactionBarrierSurfaceApplied
    && reactionBarrierSurface.chargeTransferRequired === true;
  const reactionBarrierConfidence = reactionBarrierSurfaceApplied
    ? normalizeNumber(reactionBarrierSurface.confidence, 0, 0, 1)
    : 0;
  const responseDerivativeTemperatureDrive = applied
    ? clamp(-densityTemperatureDerivativeKgM3PerK / Math.max(1, densityKgM3) * 300, -0.35, 0.35)
    : 0;
  const responseDerivativePressureDrive = applied
    ? clamp(mechanicalPressureDerivativePaPerLog2Pressure / Math.max(1, mechanicalResponsePa) * 0.85, -0.15, 0.45)
    : 0;
  const responseDerivativeFieldDrive = applied
    ? clamp(conductivityFieldDerivativeSpmPerNorm / Math.max(1, electricalConductivitySpm + 1) * 0.2, -0.12, 0.42)
    : 0;
  const responseDerivativeRadiationDrive = applied
    ? clamp(opacityRadiationDerivativePerNorm * 1.5, -0.08, 0.36)
    : 0;
  const ensemblePressureDrive = applied
    ? clamp(
      Math.log2(Math.max(0.001, ensemblePressureRatio)) * 0.16
        + ionizationFraction * 0.08
        + Math.min(0.12, degeneracyParameter * 0.012)
        + statisticalSourcePressureDriveProxy * 0.18,
      -0.25,
      0.55
    )
    : 0;
  const thermalDampingScale = applied
    ? clamp(
      1
        + Math.min(0.22, heatCapacityProxy * 0.01)
        - Math.min(0.08, Math.max(0, ensemblePressureDrive) * 0.12),
      0.72,
      1.28
    ) * clamp(statisticalSourceThermalDampingScale, 0.85, 1.15)
      * clamp(1 + (electronicChargeSourceScreeningDampingScale - 1) * 0.25, 0.94, 1.08)
    : 1;
  const conductivityDrive = applied
    ? clamp(
      Math.log10(Math.max(1, electricalConductivitySpm + 1)) / 8
        + ionizationFraction * 0.28
        + behaviorDrive * 0.01
        + responseDerivativeFieldDrive
        + electronicChargeSourceMobilityProxy * 0.08,
      0,
      1.35
    )
    : 0;
  const dielectricDrive = applied
    ? clamp(
      Math.log2(Math.max(1, dielectricConstant)) / 8
        + Math.min(0.16, opticalAbsorptionProxy * 0.012)
        + statisticalSourceOpacityDriveProxy * 0.04
        + responseDerivativeRadiationDrive * 0.25
        + electronicChargeSourceHardnessSofteningProxy * 0.04,
      0,
      1.2
    )
    : 0;
  const mechanicalStiffnessDrive = applied
    ? clamp(Math.log10(Math.max(1, mechanicalResponsePa + 1)) / 12 + responseDerivativePressureDrive, 0, 1.15)
    : 0;
  const opticalAbsorptionDrive = applied
    ? clamp(
      opticalAbsorptionProxy * 0.05
        + Math.max(0, refractiveIndex - 1) * 0.04
        + statisticalSourceOpacityDriveProxy * 0.08
        + responseDerivativeRadiationDrive,
      0,
      1.35
    )
    : 0;
  const forceGradientDrive = applied
    ? clamp(forceGradient * 0.025 + maxForceGradient * 0.012 + Math.abs(curvature) * 0.002, 0, 0.24)
    : 0;
  const bondOrderScale = applied && reducedForceAvailable
    ? clamp(
      1
        + Math.min(0.16, forceGradient * 0.055 + maxForceGradient * 0.022 + Math.max(0, curvature) * 0.004)
        - Math.min(0.08, uncertainty * 0.025),
      0.9,
      1.18
    )
    : 1;
  const ionizationDrive = applied
    ? clamp(
      ionizationFraction * 0.18
        + behaviorDrive * 0.012
        + forceGradientDrive * 0.25
        + statisticalSourceIonizationDriveProxy * 0.2
        + electronicChargeSourceIonizationDriveProxy * 0.32,
      0,
      0.24
    )
    : 0;
  const temperatureDeltaK = applied
    ? clamp(
      behaviorDrive * 3.5
        + ionizationFraction * 42
        + opacityProxy * 0.9
        + forceGradientDrive * 8
        + statisticalSourceTemperatureDeltaKProxy * 0.35
        + responseDerivativeTemperatureDrive * 6
        + electronicChargeSourceIonizationDriveProxy * 10
        - uncertainty * 0.08,
      -20,
      45
    )
    : 0;
  const chargeDeltaProxy = applied
    ? clamp(
      ionizationFraction * 0.08
        + behaviorDrive * 0.002
        + forceGradientDrive * 0.025
        + statisticalSourceChargeDeltaProxy * 0.4
        + electronicChargeSourceChargeDeltaProxy * 0.65
        - uncertainty * 0.0008,
      -0.04,
      0.08
    )
    : 0;
  const meanPotentialEnergyEv = normalizeNumber(forceSurface?.meanPotentialEnergyEv ?? batch?.meanPotentialEnergyEv, 0, -1e9, 1e9);
  const pairForceMix = applied && reducedForceAvailable
    ? clamp(
      forceGradientDrive * 1.8
        + Math.max(0, bondOrderScale - 1) * 2.6
        + Math.min(0.24, Math.max(0, -meanPotentialEnergyEv) * 0.018)
        - uncertainty * 0.012,
      0,
      1
    )
    : 0;
  const pairForceScale = applied && reducedForceAvailable
    ? clamp(
      1
        + pairForceMix * 0.18
        + Math.max(0, bondOrderScale - 1) * 0.65
        + forceGradientDrive * 0.22
        - uncertainty * 0.006,
      0.82,
      1.38
    )
    : 1;
  const restLengthDeltaAngstrom = applied && reducedForceAvailable
    ? clamp(
      -pairForceMix * 0.026
        - Math.max(0, bondOrderScale - 1) * 0.018
        + clamp(curvature, -8, 8) * 0.0012
        + uncertainty * 0.001,
      -0.045,
      0.035
    )
    : 0;
  const materialId = source?.materialId || source?.potential?.materialId || source?.diagnostics?.materialId || source?.value?.potential?.materialId || null;
  const elementSymbol = source?.elementSymbol || source?.potential?.elementSymbol || source?.diagnostics?.elementSymbol || source?.value?.potential?.elementSymbol || null;
  const dominantFormula = source?.dominantFormula || source?.potential?.dominantFormula || source?.diagnostics?.dominantFormula || source?.value?.potential?.dominantFormula || null;
  const targetPair = makeQuantumMaterialTargetPair({
    materialId,
    elementSymbol,
    dominantFormula,
    pairForceMix,
    uncertainty
  });
  const geometryTargets = molecularGeometryTargetsFromQuantumMaterialSource({
    applied,
    backend,
    molecularGeometrySource
  });
  return {
    schema: MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA,
    sourceSchema: source?.schema || source?.value?.schema || null,
    sourcePotentialSchema: source?.schema === QUANTUM_MATERIAL_POTENTIAL_SCHEMA ? source.schema : source?.potential?.schema || null,
    sourceBatchSchema: batch?.schema || null,
    sourceForceSurfaceSchema: forceSurface?.schema || null,
    sourceEnsembleSchema: ensemble?.schema || null,
    sourceStatisticalSourceEquationSchema: statisticalSourceEquation?.schema || null,
    sourceResponseDerivativesSchema: responseDerivatives?.schema || null,
    status: applied ? 'webgpu-material-source-ready' : 'unavailable',
    applied,
    active: applied,
    materialId,
    elementSymbol,
    dominantFormula,
    backend,
    source: webgpuBatch ? QUANTUM_SOURCE_WEBGPU_WORKER : 'unavailable',
    liveBackendPolicy: source?.liveBackendPolicy || source?.value?.liveBackendPolicy || null,
    recordCount,
    forceSurfacePreview: forceSurface ? { ...forceSurface } : null,
    statisticalEnsemble: ensemble ? { ...ensemble } : null,
    statisticalSourceEquation: statisticalSourceEquation ? { ...statisticalSourceEquation } : null,
    propertyResponse: propertyResponse ? { ...propertyResponse } : null,
    responseDerivatives: responseDerivatives ? { ...responseDerivatives } : null,
    molecularGeometrySource: molecularGeometrySource ? { ...molecularGeometrySource } : null,
    electronicChargeSource: electronicChargeSource ? { ...electronicChargeSource } : null,
    reactionBarrierSurface: reactionBarrierSurface ? { ...reactionBarrierSurface } : null,
    sourceReactionBarrierSurfaceSchema: reactionBarrierSurface?.schema || null,
    sourceElectronicChargeSourceSchema: electronicChargeSource?.schema || null,
    reactionBarrierSurfaceApplied,
    reactionBarrierSurfaceSchema: reactionBarrierSurface?.schema || null,
    reactionBarrierSurfaceModelId: reactionBarrierSurface?.modelId || null,
    reactionBarrierSurfaceStatus: reactionBarrierSurface?.status || null,
    reactionBarrierSurfaceBackend: reactionBarrierSurface?.backend || backend,
    reactionBarrierTargetReactionId: reactionBarrierSurface?.targetReactionId || null,
    reactionBarrierTargetPairLabel: reactionBarrierSurface?.targetPairLabel || 'all-pairs',
    reactionBarrierActivationEnergyEvProxy,
    reactionBarrierProbabilityProxy,
    reactionBarrierGateDampingScale,
    reactionBarrierGateProxy,
    reactionBarrierChargeTransferGateProxy,
    reactionBarrierUnsupportedProductBlockerCount,
    reactionBarrierProductStoichiometryAvailable,
    reactionBarrierProductTopologyAvailable,
    reactionBarrierProductStoichiometry,
    reactionBarrierProductTopology,
    reactionBarrierProductTopologySchema: reactionBarrierProductTopology?.schema || reactionBarrierSurface?.productTopologySchema || null,
    reactionBarrierProductTopologyModelId: reactionBarrierProductTopology?.modelId || reactionBarrierSurface?.productTopologyModelId || null,
    reactionBarrierProductTopologyMode: reactionBarrierProductTopology?.topologyMode || reactionBarrierSurface?.productTopologyMode || null,
    reactionBarrierProductTopologyReactionSiteCount: normalizeInteger(
      reactionBarrierProductTopology?.reactionSiteCount ?? reactionBarrierSurface?.productTopologyReactionSiteCount,
      0,
      0,
      32768
    ),
    reactionBarrierProductTopologyReducedBondCount: normalizeInteger(
      reactionBarrierSurface?.productTopologyReducedBondCount
        ?? (Array.isArray(reactionBarrierProductTopology?.productBonds) ? reactionBarrierProductTopology.productBonds.length : 0),
      0,
      0,
      32768
    ),
    reactionBarrierProductHeatReleaseProxy,
    reactionBarrierProductChargeDeltaProxy,
    reactionBarrierProductExtentProxy,
    reactionBarrierProductGasFormula: reactionBarrierSurface?.productGasFormula || reactionBarrierProductStoichiometry?.gasProductFormula || null,
    reactionBarrierProductGasMoleculeFractionPerNa: normalizeNumber(
      reactionBarrierSurface?.productGasMoleculeFractionPerNa ?? reactionBarrierProductStoichiometry?.gasProductMoleculeFractionPerNa,
      0,
      0,
      4
    ),
    reactionBarrierProductChargeTransferElectronCount: normalizeNumber(
      reactionBarrierSurface?.productChargeTransferElectronCount ?? reactionBarrierProductStoichiometry?.chargeTransferElectronCount,
      0,
      0,
      8
    ),
    reactionBarrierProductEnthalpyDeltaKjPerMolNaProxy: normalizeNumber(
      reactionBarrierSurface?.productEnthalpyDeltaKjPerMolNaProxy ?? reactionBarrierProductStoichiometry?.enthalpyDeltaKjPerMolNaProxy,
      0,
      -10000,
      10000
    ),
    reactionBarrierChargeTransferRequired,
    reactionBarrierConfidence,
    electronicChargeSourceApplied,
    electronicChargeSourceSchema: electronicChargeSource?.schema || null,
    electronicChargeSourceModelId: electronicChargeSource?.modelId || null,
    electronicChargeSourceStatus: electronicChargeSource?.status || null,
    electronicChargeSourceBackend: electronicChargeSource?.backend || backend,
    electronicChargeSourceTargetPairLabel: electronicChargeSource?.targetPairLabel || 'all-pairs',
    electronicChargeSourceDonorElementZ: normalizeNumber(electronicChargeSource?.electronDonorElementZ, 0, 0, 118),
    electronicChargeSourceAcceptorElementZ: normalizeNumber(electronicChargeSource?.electronAcceptorElementZ, 0, 0, 118),
    electronicChargeSourceDonorElementSymbol: electronicChargeSource?.electronDonorElementSymbol || null,
    electronicChargeSourceAcceptorElementSymbol: electronicChargeSource?.electronAcceptorElementSymbol || null,
    electronicChargeSourceChargeDeltaProxy,
    electronicChargeSourceIonizationDriveProxy,
    electronicChargeSourceMobilityProxy,
    electronicChargeSourceHardnessSofteningProxy,
    electronicChargeSourceScreeningDampingScale,
    electronicChargeSourceQeqMixProxy,
    electronicChargeSourceElectronegativityDeltaProxy,
    electronicChargeSourceChargeTransferPotentialProxy: normalizeNumber(electronicChargeSource?.chargeTransferPotentialProxy, 0, 0, 2),
    electronicChargeSourceMeanHardnessProxyEv: normalizeNumber(electronicChargeSource?.meanHardnessProxyEv, 0, 0, 100),
    electronicChargeSourceMeanElectronegativityProxy: normalizeNumber(electronicChargeSource?.meanElectronegativityProxy, 0, 0, 6),
    electronicChargeSourceConfidence: normalizeNumber(electronicChargeSource?.confidence, 0, 0, 1),
    geometrySourceApplied: geometryTargets.sourceApplied,
    geometrySourceSchema: geometryTargets.sourceSchema,
    geometrySourceModelId: geometryTargets.sourceModelId,
    geometrySourceStatus: geometryTargets.sourceStatus,
    geometrySourceBackend: geometryTargets.sourceBackend,
    geometryTargetSource: geometryTargets.targetSource,
    geometryTargetMolecule: geometryTargets.targetMolecule,
    geometryTargetPairLabel: geometryTargets.targetPairLabel,
    geometryTargetAngleDeg: geometryTargets.targetAngleDeg,
    geometryTargetAngleCos: geometryTargets.targetAngleCos,
    geometryTargetOhDistanceReducedNm: geometryTargets.targetOhDistanceReducedNm,
    geometryTargetHhDistanceReducedNm: geometryTargets.targetHhDistanceReducedNm,
    geometryDistanceStiffnessProxy: geometryTargets.distanceStiffnessProxy,
    geometryAngleStiffnessProxy: geometryTargets.angleStiffnessProxy,
    geometrySourceConfidence: geometryTargets.confidence,
    geometrySourceCalibrated: geometryTargets.calibrated,
    geometrySourceRecordCount: geometryTargets.geometryRecordCount,
    geometrySourceBondRecordCount: geometryTargets.bondRecordCount,
    reducedEnergyGradientAvailable: reducedForceAvailable,
    bornOppenheimerForcesAvailable: forceSurface?.bornOppenheimerForcesAvailable === true,
    reactionBarrierSurfaceAvailable: reactionBarrierSurfaceApplied || forceSurface?.reactionBarrierSurfaceAvailable === true,
    meanPotentialEnergyEv,
    meanForceGradientEvPerAngstrom: forceGradient,
    maxForceGradientEvPerAngstrom: maxForceGradient,
    meanCurvatureEvPerAngstrom2: curvature,
    meanUncertainty: uncertainty,
    behaviorDrive,
    ionizationFraction,
    opacityProxy,
    degeneracyParameter,
    densityKgM3,
    mechanicalResponsePa,
    bulkModulusPa,
    youngsModulusPa,
    electricalConductivitySpm,
    refractiveIndex,
    dielectricConstant,
    opticalAbsorptionProxy,
    densityTemperatureDerivativeKgM3PerK,
    mechanicalPressureDerivativePaPerLog2Pressure,
    conductivityFieldDerivativeSpmPerNorm,
    opacityRadiationDerivativePerNorm,
    responseDerivativeTemperatureDrive,
    responseDerivativePressureDrive,
    responseDerivativeFieldDrive,
    responseDerivativeRadiationDrive,
    conductivityDrive,
    dielectricDrive,
    mechanicalStiffnessDrive,
    opticalAbsorptionDrive,
    ensemblePressurePa,
    ensembleBasePressurePa,
    ensemblePressureRatio,
    ensemblePressureDrive,
    heatCapacityProxy,
    thermalDampingScale,
    statisticalSourceChannelCount,
    statisticalSourcePressureDriveProxy,
    statisticalSourceOpacityDriveProxy,
    statisticalSourceIonizationDriveProxy,
    statisticalSourceDegeneracyPressureDriveProxy,
    statisticalSourceTemperatureDeltaKProxy,
    statisticalSourceChargeDeltaProxy,
    statisticalSourceThermalDampingScale,
    bondOrderScale,
    temperatureAppliedDeltaK: temperatureDeltaK,
    chargeDeltaProxy,
    ionizationDrive,
    forceGradientDrive,
    pairForceScale,
    restLengthDeltaAngstrom,
    pairForceMix,
    targetPairLabel: targetPair.targetPairLabel,
    targetPairMode: targetPair.targetPairMode,
    targetPairBasis: targetPair.targetPairBasis,
    primaryElementZ: targetPair.primaryElementZ,
    primaryElementSymbol: targetPair.primaryElementSymbol,
    secondaryElementZ: targetPair.secondaryElementZ,
    secondaryElementSymbol: targetPair.secondaryElementSymbol,
    pairSelectivity: targetPair.pairSelectivity,
    pairFallbackFactor: targetPair.pairFallbackFactor,
    applicationMode: applied ? 'md-kernel-material-source-term-pending' : 'unavailable',
    webgpuKernelApplied: false,
    calibrated: false,
    bornOppenheimerForcesAvailableAtRuntime: false,
    validity: {
      status: applied ? 'reduced-webgpu-qmat-md-source-proxy' : 'unavailable',
      warnings: [
        'Reduced qmat force/property source from WebGPU batch telemetry; not Born-Oppenheimer, DFT, ReaxFF, or calibrated reaction chemistry.',
        'Temperature, charge, bond-scale, pair-force/rest-length, conductivity, dielectric, optical, and stiffness effects are bounded interactive proxy terms.'
      ]
    }
  };
}

function quantumMaterialSourceForState(state) {
  return normalizeMolecularQuantumMaterialSource(state?.quantumMaterialSource);
}

function quantumAdjustmentForElement(element, quantumCoupling = null) {
  const coupling = normalizeMolecularQuantumCoupling(quantumCoupling);
  if (!coupling.active || Number(element) !== coupling.atomicNumber) {
    return {
      active: false,
      electronegativityDelta: 0,
      chargeBias: 0,
      bondOrderScale: 1,
      ionizationDrive: 0,
      evolutionDrive: 0,
      statisticalBridgeDrive: 0,
      confidence: 0
    };
  }
  const baseElectronegativity = baseElectronegativityForElement(element);
  const chiProxy = coupling.electronegativityProxy > 0 ? coupling.electronegativityProxy : baseElectronegativity;
  const electronegativityDelta = clamp((chiProxy - baseElectronegativity) * 0.36, -0.42, 0.42);
  const effectiveChi = baseElectronegativity + electronegativityDelta;
  const acceptorBias = effectiveChi >= 2.65 ? -0.03 * (effectiveChi - 2.65) : 0.024 * (2.65 - effectiveChi);
  const tendency = String(coupling.bondingTendency || '');
  const tendencyBias = tendency.includes('acceptor') ? -0.028 : tendency.includes('donor') ? 0.032 : 0;
  const evolutionDrive = normalizeNumber(coupling.wavefunctionEvolutionDrive, 0, 0, 0.09);
  const statisticalBridgeDrive = normalizeNumber(coupling.statisticalBridgeDrive, 0, 0, 0.12);
  const ionizationDrive = clamp(
    coupling.ionizationFraction * (0.018 + coupling.confidence * 0.028)
      + Math.min(0.025, Math.log10(1 + coupling.electricalConductivityProxy) * 0.0025)
      + evolutionDrive * 0.55
      + statisticalBridgeDrive * 0.42
      + normalizeNumber(coupling.statisticalBridgeIonizationFraction, 0, 0, 1) * 0.026,
    0,
    0.14
  );
  const evolutionChargeBias = tendency.includes('acceptor') ? -evolutionDrive * 0.22 : tendency.includes('donor') ? evolutionDrive * 0.2 : 0;
  const statisticalChargeBias = normalizeNumber(coupling.statisticalBridgeChargeDeltaProxy, 0, -1, 1) * 0.12;
  const chargeBias = clamp(
    acceptorBias
      + tendencyBias
      + evolutionChargeBias
      + statisticalChargeBias
      + (tendency.includes('conductor') ? ionizationDrive * 0.35 : 0),
    -0.18,
    0.18
  );
  const valenceDelta = coupling.valenceElectronCount > 0
    ? (coupling.valenceElectronCount - valenceForElement(element)) * 0.018
    : 0;
  const gridConfidence = coupling.finiteGridParityOk ? 0.025 : -Math.min(0.05, coupling.finiteGridBoundaryMass * 0.16);
  const bondOrderScale = clamp(
    1
      + valenceDelta
      + coupling.unpairedElectronCount * 0.012
      + coupling.confidence * 0.035
      + gridConfidence
      + evolutionDrive * 0.42
      + statisticalBridgeDrive * 0.22,
    0.82,
    1.22
  );
  return {
    active: true,
    electronegativityDelta,
    chargeBias,
    bondOrderScale,
    ionizationDrive,
    evolutionDrive,
    statisticalBridgeDrive,
    confidence: coupling.confidence
  };
}

export function getMolecularNeighborGridLayout({
  atomCount = 0,
  cellSize = MOLECULAR_NEIGHBOR_CELL_SIZE,
  searchRadius = MOLECULAR_DYNAMICS_FORCE_RADIUS,
  state = null
} = {}) {
  const bounds = computeMolecularNeighborGridBounds(state, { cellSize, searchRadius });
  return {
    schema: 'peercompute.multiscale.molecular-neighbor-grid-layout.v0',
    atomCount: normalizeInteger(atomCount, 0, 0, MOLECULAR_DYNAMICS_WEBGPU_MAX_ATOMS),
    cellSize: bounds.cellSize,
    searchRadius,
    gridOrigin: bounds.gridOrigin,
    gridExtent: bounds.gridExtent,
    gridCenter: bounds.gridCenter,
    dynamicBounds: bounds.dynamicBounds,
    boundsMin: bounds.boundsMin,
    boundsMax: bounds.boundsMax,
    gridDimX: MOLECULAR_NEIGHBOR_GRID_DIM_X,
    gridDimY: MOLECULAR_NEIGHBOR_GRID_DIM_Y,
    gridDimZ: MOLECULAR_NEIGHBOR_GRID_DIM_Z,
    cellCount: MOLECULAR_NEIGHBOR_CELL_COUNT,
    maxCellOccupancy: MOLECULAR_NEIGHBOR_MAX_CELL_OCCUPANCY,
    maxNeighborsPerAtom: MOLECULAR_NEIGHBOR_MAX_NEIGHBORS_PER_ATOM,
    neighborCapacity: normalizeInteger(atomCount, 0, 0, MOLECULAR_DYNAMICS_WEBGPU_MAX_ATOMS)
      * MOLECULAR_NEIGHBOR_MAX_NEIGHBORS_PER_ATOM,
    cellAtomCapacity: MOLECULAR_NEIGHBOR_CELL_COUNT * MOLECULAR_NEIGHBOR_MAX_CELL_OCCUPANCY
  };
}

function computeMolecularNeighborGridBounds(state, {
  cellSize = MOLECULAR_NEIGHBOR_CELL_SIZE,
  searchRadius = MOLECULAR_DYNAMICS_FORCE_RADIUS
} = {}) {
  const baseCellSize = normalizeNumber(cellSize, MOLECULAR_NEIGHBOR_CELL_SIZE, 0.01, 100);
  const baseExtent = Math.abs(baseCellSize - MOLECULAR_NEIGHBOR_CELL_SIZE) < 1e-9
    ? MOLECULAR_NEIGHBOR_GRID_EXTENT
    : baseCellSize * MOLECULAR_NEIGHBOR_GRID_DIM_X;
  const fallback = {
    cellSize: baseCellSize,
    gridOrigin: MOLECULAR_NEIGHBOR_GRID_ORIGIN,
    gridExtent: baseExtent,
    gridCenter: 0,
    dynamicBounds: false,
    boundsMin: MOLECULAR_NEIGHBOR_GRID_ORIGIN,
    boundsMax: MOLECULAR_NEIGHBOR_GRID_ORIGIN + baseExtent
  };
  if (!state?.positionsX || !state?.positionsY || !state?.positionsZ || !state.atomCount) return fallback;
  let minCoord = Number.POSITIVE_INFINITY;
  let maxCoord = Number.NEGATIVE_INFINITY;
  const count = normalizeInteger(state.atomCount, 0, 0, MOLECULAR_DYNAMICS_WEBGPU_MAX_ATOMS);
  for (let i = 0; i < count; i += 1) {
    const x = Number(state.positionsX[i]);
    const y = Number(state.positionsY[i]);
    const z = Number(state.positionsZ[i]);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) continue;
    minCoord = Math.min(minCoord, x, y, z);
    maxCoord = Math.max(maxCoord, x, y, z);
  }
  if (!Number.isFinite(minCoord) || !Number.isFinite(maxCoord)) return fallback;
  const padding = Math.max(baseCellSize, searchRadius * 0.75);
  const paddedMin = minCoord - padding;
  const paddedMax = maxCoord + padding;
  const requiredExtent = Math.max(baseExtent, paddedMax - paddedMin);
  const resolvedCellSize = requiredExtent / MOLECULAR_NEIGHBOR_GRID_DIM_X;
  const gridCenter = (paddedMin + paddedMax) * 0.5;
  const gridOrigin = gridCenter - requiredExtent * 0.5;
  return {
    cellSize: resolvedCellSize,
    gridOrigin,
    gridExtent: requiredExtent,
    gridCenter,
    dynamicBounds: Math.abs(resolvedCellSize - baseCellSize) > 1e-6
      || Math.abs(gridOrigin - MOLECULAR_NEIGHBOR_GRID_ORIGIN) > 1e-6,
    boundsMin: paddedMin,
    boundsMax: paddedMax
  };
}

function makeRng(seed = 1) {
  let state = Math.floor(Math.abs(seed)) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function symbolForElement(element) {
  return SYMBOL_BY_Z.get(Number(element)) || 'other';
}

function massForElement(element) {
  return ELEMENT_DATA[Number(element)]?.mass ?? 10;
}

function covalentRadius(element) {
  return ELEMENT_DATA[Number(element)]?.radius ?? 0.07;
}

function valenceForElement(element) {
  return ELEMENT_DATA[Number(element)]?.valence ?? 2;
}

function baseElectronegativityForElement(element) {
  return ELEMENT_DATA[Number(element)]?.electronegativity ?? 2.1;
}

function electronegativityForElement(element, quantumCoupling = null) {
  const base = baseElectronegativityForElement(element);
  return base + quantumAdjustmentForElement(element, quantumCoupling).electronegativityDelta;
}

function hardnessForElement(element, quantumCoupling = null) {
  const data = ELEMENT_DATA[Number(element)] || {};
  const radius = Math.max(0.025, covalentRadius(element));
  const baseChi = data.electronegativity ?? 2.1;
  const base = (data.metal ? 4.6 : 6.2) + baseChi * 1.15 + Math.min(4, 0.08 / radius);
  const adjustment = quantumAdjustmentForElement(element, quantumCoupling);
  return clamp(
    base + adjustment.ionizationDrive * 4 + adjustment.confidence * 0.35 - adjustment.evolutionDrive * 5,
    2.5,
    18
  );
}

function isMetalElement(element) {
  return ELEMENT_DATA[Number(element)]?.metal === true;
}

function isWaterElement(element) {
  return Number(element) === ELEMENT.H || Number(element) === ELEMENT.O;
}

function isReactiveMetalWaterPair(elementA, elementB) {
  return (isMetalElement(elementA) && isWaterElement(elementB))
    || (isMetalElement(elementB) && isWaterElement(elementA));
}

function isSeededWaterOhPair(state, atomA, atomB) {
  if (!state?.moleculeGroupId || !state?.moleculeGroupType) return false;
  const groupA = normalizeInteger(state.moleculeGroupId[atomA], -1, -1, 32768);
  const groupB = normalizeInteger(state.moleculeGroupId[atomB], -1, -1, 32768);
  if (groupA < 0 || groupA !== groupB) return false;
  const typeA = normalizeInteger(state.moleculeGroupType[atomA], MOLECULE_GROUP_TYPE.atom, 0, 32);
  const typeB = normalizeInteger(state.moleculeGroupType[atomB], MOLECULE_GROUP_TYPE.atom, 0, 32);
  if (typeA !== MOLECULE_GROUP_TYPE.water || typeB !== MOLECULE_GROUP_TYPE.water) return false;
  const elementA = Number(state.elementZ?.[atomA] || 0);
  const elementB = Number(state.elementZ?.[atomB] || 0);
  return (elementA === ELEMENT.O && elementB === ELEMENT.H)
    || (elementB === ELEMENT.O && elementA === ELEMENT.H);
}

function seededWaterTopologyShouldHold(state, atomA, atomB, quantumMaterialSource = null) {
  if (!isSeededWaterOhPair(state, atomA, atomB)) return false;
  const pairTemperature = (
    normalizeNumber(state.temperatureK?.[atomA], 294, 1, 250000)
      + normalizeNumber(state.temperatureK?.[atomB], 294, 1, 250000)
  ) * 0.5;
  if (pairTemperature >= 900) return false;
  const source = quantumMaterialSource?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
    ? quantumMaterialSource
    : normalizeMolecularQuantumMaterialSource(quantumMaterialSource);
  return source.reactionBarrierProductTopologyAvailable !== true;
}

function unsupportedReactionBarrierDampingScale(source = null) {
  const normalized = source?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
    ? source
    : normalizeMolecularQuantumMaterialSource(source);
  const baseDamping = normalizeNumber(normalized.reactionBarrierGateDampingScale, 1, 0.2, 1);
  if (normalized.reactionBarrierSurfaceApplied !== true) return 1;
  if (normalized.reactionBarrierProductStoichiometryAvailable === true) return 1;
  const gateProxy = normalizeNumber(normalized.reactionBarrierGateProxy, Math.max(0, 1 - baseDamping), 0, 1);
  const chargeGateProxy = normalizeNumber(normalized.reactionBarrierChargeTransferGateProxy, 0, 0, 1);
  const blockerBoost = normalizeInteger(normalized.reactionBarrierUnsupportedProductBlockerCount, 0, 0, 1024) > 0 ? 0.08 : 0;
  const unsupportedGate = clamp(Math.max(gateProxy, chargeGateProxy) * 1.65 + blockerBoost, 0, 0.84);
  return clamp(baseDamping * (1 - unsupportedGate), 0.14, 1);
}

function reactionBarrierDampingForPair(elementA, elementB, source = null) {
  const normalized = source?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
    ? source
    : normalizeMolecularQuantumMaterialSource(source);
  if (normalized.reactionBarrierSurfaceApplied !== true) return 1;
  if (normalized.reactionBarrierProductStoichiometryAvailable === true) return 1;
  if (!isReactiveMetalWaterPair(elementA, elementB)) return 1;
  return unsupportedReactionBarrierDampingScale(normalized);
}

function reactionBarrierDampingForElement(element, source = null) {
  const normalized = source?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
    ? source
    : normalizeMolecularQuantumMaterialSource(source);
  if (normalized.reactionBarrierSurfaceApplied !== true) return 1;
  if (normalized.reactionBarrierProductStoichiometryAvailable === true) return 1;
  if (!isMetalElement(element)) return 1;
  const primary = Number(normalized.primaryElementZ || 0);
  const secondary = Number(normalized.secondaryElementZ || 0);
  if (!isWaterElement(primary) && !isWaterElement(secondary)) return 1;
  return unsupportedReactionBarrierDampingScale(normalized);
}

function createQuantumMaterialReactionProductSource(source = null) {
  const normalized = source?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
    ? source
    : normalizeMolecularQuantumMaterialSource(source);
  const applied = normalized.reactionBarrierSurfaceApplied === true
    && normalized.reactionBarrierProductStoichiometryAvailable === true;
  const stoichiometry = applied && normalized.reactionBarrierProductStoichiometry
    ? normalized.reactionBarrierProductStoichiometry
    : null;
  const productTopology = applied && normalized.reactionBarrierProductTopology
    ? normalized.reactionBarrierProductTopology
    : null;
  const heatReleaseProxy = applied
    ? normalizeNumber(normalized.reactionBarrierProductHeatReleaseProxy, 0, 0, 16)
    : 0;
  const chargeDeltaProxy = applied
    ? normalizeNumber(normalized.reactionBarrierProductChargeDeltaProxy, 0, -1, 1)
    : 0;
  const extentProxy = applied
    ? normalizeNumber(normalized.reactionBarrierProductExtentProxy, 0, 0, 1)
    : 0;
  const probabilityProxy = applied
    ? normalizeNumber(normalized.reactionBarrierProbabilityProxy, 0, 0, 1)
    : 0;
  return {
    schema: 'peercompute.multiscale.molecular-qmat-reaction-product-source.v0',
    modelId: 'qmat-reaction-product-source-handoff-v0',
    applied,
    status: applied
      ? (normalized.reactionBarrierProductTopologyAvailable === true
        ? 'product-source-ready-topology-overlay'
        : 'product-source-ready-topology-pending')
      : 'unavailable',
    targetReactionId: normalized.reactionBarrierTargetReactionId || stoichiometry?.reactionId || null,
    productStoichiometry: stoichiometry,
    productTopology,
    productTopologySchema: productTopology?.schema || normalized.reactionBarrierProductTopologySchema || null,
    productTopologyModelId: productTopology?.modelId || normalized.reactionBarrierProductTopologyModelId || null,
    productTopologyMode: productTopology?.topologyMode || normalized.reactionBarrierProductTopologyMode || null,
    productTopologyAvailable: normalized.reactionBarrierProductTopologyAvailable === true,
    productTopologyRequired: applied && normalized.reactionBarrierProductTopologyAvailable !== true,
    productTopologyReactionSiteCount: normalizeInteger(
      productTopology?.reactionSiteCount ?? normalized.reactionBarrierProductTopologyReactionSiteCount,
      0,
      0,
      32768
    ),
    productTopologyReducedBondCount: normalizeInteger(
      normalized.reactionBarrierProductTopologyReducedBondCount
        ?? (Array.isArray(productTopology?.productBonds) ? productTopology.productBonds.length : 0),
      0,
      0,
      32768
    ),
    heatReleaseProxy,
    chargeDeltaProxy,
    extentProxy,
    probabilityProxy,
    progressDriveProxy: applied ? clamp(extentProxy * (0.55 + probabilityProxy * 0.45), 0, 1) : 0,
    gasProductFormula: normalized.reactionBarrierProductGasFormula || stoichiometry?.gasProductFormula || null,
    gasMoleculeFractionPerNa: normalizeNumber(
      normalized.reactionBarrierProductGasMoleculeFractionPerNa ?? stoichiometry?.gasProductMoleculeFractionPerNa,
      0,
      0,
      4
    ),
    chargeTransferElectronCount: normalizeNumber(
      normalized.reactionBarrierProductChargeTransferElectronCount ?? stoichiometry?.chargeTransferElectronCount,
      0,
      0,
      8
    ),
    enthalpyDeltaKjPerMolNaProxy: normalizeNumber(
      normalized.reactionBarrierProductEnthalpyDeltaKjPerMolNaProxy ?? stoichiometry?.enthalpyDeltaKjPerMolNaProxy,
      0,
      -10000,
      10000
    ),
    validity: {
      status: applied ? 'interactive-product-source-proxy' : 'unavailable',
      warnings: applied
        ? [
          normalized.reactionBarrierProductTopologyAvailable === true
            ? 'Qmat product source exposes reduced stoichiometry, heat, gas, charge-transfer, and product bond-graph topology terms.'
            : 'Qmat product source exposes reduced stoichiometry, heat, gas, and charge-transfer terms; MD topology mutation remains pending.',
          'Scientific mode must replace this with conservative product topology updates and calibrated reaction kinetics.'
        ]
        : []
    }
  };
}

function molecularPairRestLengthReducedNm(elementA, elementB) {
  const radiusSum = covalentRadius(elementA) + covalentRadius(elementB);
  const enDelta = Math.abs(baseElectronegativityForElement(elementA) - baseElectronegativityForElement(elementB));
  const ionicPair = isMetalElement(elementA) !== isMetalElement(elementB) && enDelta >= 1.1;
  return clamp(radiusSum * 1.12 * (ionicPair ? 1.08 : 1), 0.058, 0.34);
}

function molecularPairAffinity(elementA, elementB) {
  const same = Number(elementA) === Number(elementB);
  const metalA = isMetalElement(elementA);
  const metalB = isMetalElement(elementB);
  const enDelta = Math.abs(baseElectronegativityForElement(elementA) - baseElectronegativityForElement(elementB));
  const bothNonMetal = !metalA && !metalB;
  let affinity = 0.35;
  if (same) {
    affinity = 0.28;
    if (Number(elementA) === ELEMENT.H) affinity = 0.62;
    if (Number(elementA) === ELEMENT.C) affinity = 0.86;
  } else if (metalA !== metalB && enDelta >= 1.1) {
    affinity = 0.82;
  } else if (bothNonMetal) {
    affinity = 0.76 + clamp(enDelta * 0.1, 0, 0.22);
  } else {
    affinity = 0.38;
  }
  const pair = new Set([Number(elementA), Number(elementB)]);
  if (
    (pair.has(ELEMENT.H) && pair.has(ELEMENT.O))
    || (pair.has(ELEMENT.H) && pair.has(ELEMENT.N))
    || (pair.has(ELEMENT.C) && pair.has(ELEMENT.O))
  ) {
    affinity = Math.max(affinity, 1.04);
  }
  return clamp(affinity, 0.18, 1.12);
}

function molecularPairClass(elementA, elementB) {
  const enDelta = Math.abs(baseElectronegativityForElement(elementA) - baseElectronegativityForElement(elementB));
  if (isMetalElement(elementA) !== isMetalElement(elementB) && enDelta >= 1.1) return 'ionic-candidate';
  if (Number(elementA) !== Number(elementB) && enDelta >= 0.4) return 'polar-covalent-candidate';
  if (molecularPairAffinity(elementA, elementB) >= 0.7) return 'covalent-candidate';
  return 'weak-contact-candidate';
}

function molecularPairForceLawForElements(elementA, elementB) {
  const atomicNumberA = Number(elementA);
  const atomicNumberB = Number(elementB);
  const electronegativityDelta = Math.abs(
    baseElectronegativityForElement(atomicNumberA) - baseElectronegativityForElement(atomicNumberB)
  );
  const pairClass = molecularPairClass(atomicNumberA, atomicNumberB);
  return {
    schema: MOLECULAR_FORCE_LAW_SCHEMA,
    modelId: 'element-aware-covalent-radius-affinity-v0',
    status: 'interactive-proxy',
    elementA: symbolForElement(atomicNumberA),
    elementB: symbolForElement(atomicNumberB),
    atomicNumberA,
    atomicNumberB,
    restLengthReducedNm: molecularPairRestLengthReducedNm(atomicNumberA, atomicNumberB),
    affinity: molecularPairAffinity(atomicNumberA, atomicNumberB),
    electronegativityDelta,
    pairClass,
    ionicCandidate: pairClass === 'ionic-candidate',
    polarCandidate: pairClass === 'polar-covalent-candidate',
    covalentCandidate: pairClass === 'covalent-candidate' || pairClass === 'polar-covalent-candidate',
    weakCandidate: pairClass === 'weak-contact-candidate',
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'Element-aware reduced force law uses covalent radii and electronegativity classes; it is not a calibrated force field or ab initio potential surface.'
      ]
    }
  };
}

export function getMolecularPairForceLawPreview(elementA, elementB) {
  return molecularPairForceLawForElements(elementA, elementB);
}

function distanceBetweenAtoms(state, a, b) {
  const dx = Number(state.positionsX[b] || 0) - Number(state.positionsX[a] || 0);
  const dy = Number(state.positionsY[b] || 0) - Number(state.positionsY[a] || 0);
  const dz = Number(state.positionsZ[b] || 0) - Number(state.positionsZ[a] || 0);
  return Math.hypot(dx, dy, dz);
}

function seededWaterGroupsForState(state) {
  const groups = new Map();
  const atomCount = normalizeInteger(state?.atomCount, 0, 0, 32768);
  for (let i = 0; i < atomCount; i += 1) {
    const groupId = normalizeInteger(state.moleculeGroupId?.[i], -1, -1, 32768);
    const groupType = normalizeInteger(state.moleculeGroupType?.[i], MOLECULE_GROUP_TYPE.atom, 0, 32);
    if (groupId < 0 || groupType !== MOLECULE_GROUP_TYPE.water) continue;
    const group = groups.get(groupId) || { groupId, oxygen: -1, hydrogens: [] };
    if (state.elementZ[i] === ELEMENT.O) group.oxygen = i;
    if (state.elementZ[i] === ELEMENT.H) group.hydrogens.push(i);
    groups.set(groupId, group);
  }
  return [...groups.values()].filter((group) => group.oxygen >= 0 && group.hydrogens.length >= 2);
}

function productGroupsForState(state) {
  const groups = new Map();
  const atomCount = normalizeInteger(state?.atomCount, 0, 0, 32768);
  for (let i = 0; i < atomCount; i += 1) {
    const groupId = normalizeInteger(state.moleculeGroupId?.[i], -1, -1, 32768);
    const groupType = normalizeInteger(state.moleculeGroupType?.[i], MOLECULE_GROUP_TYPE.atom, 0, 32);
    if (
      groupId < 0
      || (groupType !== MOLECULE_GROUP_TYPE.sodiumHydroxide && groupType !== MOLECULE_GROUP_TYPE.hydrogen)
    ) {
      continue;
    }
    const group = groups.get(groupId) || {
      groupId,
      groupType,
      sodium: -1,
      oxygen: -1,
      hydrogens: []
    };
    if (state.elementZ[i] === ELEMENT.Na) group.sodium = i;
    if (state.elementZ[i] === ELEMENT.O) group.oxygen = i;
    if (state.elementZ[i] === ELEMENT.H) group.hydrogens.push(i);
    groups.set(groupId, group);
  }
  return [...groups.values()]
    .map((group) => ({
      ...group,
      hydrogens: group.hydrogens.sort((a, b) => a - b)
    }))
    .filter((group) => (
      group.groupType === MOLECULE_GROUP_TYPE.sodiumHydroxide
        ? group.sodium >= 0 && group.oxygen >= 0 && group.hydrogens.length >= 1
        : group.hydrogens.length >= 2
    ));
}

function isProductGroupedAtom(state, index) {
  const groupType = normalizeInteger(state?.moleculeGroupType?.[index], MOLECULE_GROUP_TYPE.atom, 0, 32);
  return groupType === MOLECULE_GROUP_TYPE.sodiumHydroxide || groupType === MOLECULE_GROUP_TYPE.hydrogen;
}

function productBondRuleForPair(topology = null, elementA, elementB, productFormula = null) {
  const symbolA = symbolForElement(elementA);
  const symbolB = symbolForElement(elementB);
  const pairKey = [symbolA, symbolB].sort().join('-');
  for (const rule of Array.isArray(topology?.productBonds) ? topology.productBonds : []) {
    if (productFormula && rule.productFormula && rule.productFormula !== productFormula) continue;
    const elements = Array.isArray(rule.elements) ? rule.elements : [];
    const ruleKey = elements.map((symbol) => String(symbol || '')).sort().join('-');
    if (ruleKey !== pairKey) continue;
    return rule;
  }
  return null;
}

function nearestUnusedAtom(state, targetIndex, candidates = [], used = new Set()) {
  let bestIndex = -1;
  let bestDistance = Infinity;
  for (const index of candidates) {
    if (used.has(index)) continue;
    const distance = distanceBetweenAtoms(state, targetIndex, index);
    if (distance >= bestDistance) continue;
    bestDistance = distance;
    bestIndex = index;
  }
  return bestIndex;
}

function createQuantumMaterialProductTopologyOverlay(state, quantumMaterialSource = null) {
  const source = quantumMaterialSource?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
    ? quantumMaterialSource
    : quantumMaterialSourceForState(state);
  const productSource = createQuantumMaterialReactionProductSource(source);
  const topology = productSource.productTopology || source.reactionBarrierProductTopology || null;
  if (
    productSource.applied !== true
    || productSource.productTopologyAvailable !== true
    || topology?.schema !== QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA
  ) {
    return {
      schema: 'peercompute.multiscale.molecular-qmat-product-topology-overlay.v0',
      applied: false,
      status: 'unavailable',
      reason: productSource.applied ? 'product-topology-unavailable' : 'product-source-unavailable',
      productSource,
      topology: topology || null,
      bonds: [],
      reactionSiteCount: 0,
      naohMoleculeCount: 0,
      h2MoleculeCount: 0,
      releasedHydrogenCount: 0,
      partialHydrogenSiteCount: 0
    };
  }

  const existingProductGroups = productGroupsForState(state);
  const bonds = [];
  const productSites = [];
  let existingNaohMoleculeCount = 0;
  let existingH2MoleculeCount = 0;
  const naORule = productBondRuleForPair(topology, ELEMENT.Na, ELEMENT.O, 'NaOH');
  const ohRule = productBondRuleForPair(topology, ELEMENT.O, ELEMENT.H, 'NaOH');
  const h2Rule = productBondRuleForPair(topology, ELEMENT.H, ELEMENT.H, 'H2');
  for (const group of existingProductGroups) {
    if (group.groupType === MOLECULE_GROUP_TYPE.sodiumHydroxide) {
      const retainedHydrogen = group.hydrogens[0];
      bonds.push({
        a: group.sodium,
        b: group.oxygen,
        elementA: 'Na',
        elementB: 'O',
        order: normalizeNumber(naORule?.order, 0.72, 0.05, 2),
        distance: distanceBetweenAtoms(state, group.sodium, group.oxygen),
        priority: 9.9,
        productTopology: true,
        productFormula: 'NaOH',
        source: 'qmat-product-topology-state'
      });
      bonds.push({
        a: group.oxygen,
        b: retainedHydrogen,
        elementA: 'O',
        elementB: 'H',
        order: normalizeNumber(ohRule?.order, 0.96, 0.05, 2),
        distance: distanceBetweenAtoms(state, group.oxygen, retainedHydrogen),
        priority: 9.7,
        productTopology: true,
        productFormula: 'NaOH',
        source: 'qmat-product-topology-state'
      });
      existingNaohMoleculeCount += 1;
    } else if (group.groupType === MOLECULE_GROUP_TYPE.hydrogen) {
      const [a, b] = group.hydrogens;
      bonds.push({
        a,
        b,
        elementA: 'H',
        elementB: 'H',
        order: normalizeNumber(h2Rule?.order, 1, 0.05, 2),
        distance: distanceBetweenAtoms(state, a, b),
        priority: 9.5,
        productTopology: true,
        productFormula: 'H2',
        source: 'qmat-product-topology-state'
      });
      existingH2MoleculeCount += 1;
    }
  }

  const sodiumAtoms = [];
  for (let i = 0; i < normalizeInteger(state?.atomCount, 0, 0, 32768); i += 1) {
    if (Number(state.elementZ?.[i] || 0) === ELEMENT.Na && !isProductGroupedAtom(state, i)) sodiumAtoms.push(i);
  }
  const waterGroups = seededWaterGroupsForState(state);
  const requestedSites = normalizeInteger(
    topology.reactionSiteCount ?? productSource.productTopologyReactionSiteCount,
    Math.max(1, Math.min(sodiumAtoms.length, waterGroups.length)),
    0,
    32768
  );
  const siteLimit = Math.max(0, Math.min(sodiumAtoms.length, waterGroups.length, requestedSites));
  const usedSodium = new Set();
  const usedHydrogen = new Set();
  const releasedHydrogens = [];
  let newNaohMoleculeCount = 0;

  for (let site = 0; site < siteLimit; site += 1) {
    const group = waterGroups[site];
    if (!group) break;
    const oxygen = group.oxygen;
    const sodium = nearestUnusedAtom(state, oxygen, sodiumAtoms, usedSodium);
    if (sodium < 0) break;
    usedSodium.add(sodium);
    const hydrogens = [...group.hydrogens]
      .sort((a, b) => distanceBetweenAtoms(state, oxygen, a) - distanceBetweenAtoms(state, oxygen, b));
    const retainedHydrogen = hydrogens[0];
    const releasedHydrogen = hydrogens[1];
    if (!Number.isInteger(retainedHydrogen) || !Number.isInteger(releasedHydrogen)) continue;
    usedHydrogen.add(retainedHydrogen);
    usedHydrogen.add(releasedHydrogen);
    releasedHydrogens.push(releasedHydrogen);

    bonds.push({
      a: sodium,
      b: oxygen,
      elementA: 'Na',
      elementB: 'O',
      order: normalizeNumber(naORule?.order, 0.72, 0.05, 2),
      distance: distanceBetweenAtoms(state, sodium, oxygen),
      priority: 9.8,
      productTopology: true,
      productFormula: 'NaOH',
      source: 'qmat-product-topology-overlay'
    });
    bonds.push({
      a: oxygen,
      b: retainedHydrogen,
      elementA: 'O',
      elementB: 'H',
      order: normalizeNumber(ohRule?.order, 0.96, 0.05, 2),
      distance: distanceBetweenAtoms(state, oxygen, retainedHydrogen),
      priority: 9.6,
      productTopology: true,
      productFormula: 'NaOH',
      source: 'qmat-product-topology-overlay'
    });
    productSites.push({
      sodium,
      oxygen,
      retainedHydrogen,
      releasedHydrogen,
      sourceWaterGroupId: normalizeInteger(group.groupId, site, -1, 32768)
    });
    newNaohMoleculeCount += 1;
  }

  let newH2MoleculeCount = 0;
  const h2Sites = [];
  for (let i = 0; i + 1 < releasedHydrogens.length; i += 2) {
    const a = releasedHydrogens[i];
    const b = releasedHydrogens[i + 1];
    bonds.push({
      a,
      b,
      elementA: 'H',
      elementB: 'H',
      order: normalizeNumber(h2Rule?.order, 1, 0.05, 2),
      distance: distanceBetweenAtoms(state, a, b),
      priority: 9.4,
      productTopology: true,
      productFormula: 'H2',
      source: 'qmat-product-topology-overlay'
    });
    h2Sites.push({ a, b });
    newH2MoleculeCount += 1;
  }
  const naohMoleculeCount = existingNaohMoleculeCount + newNaohMoleculeCount;
  const h2MoleculeCount = existingH2MoleculeCount + newH2MoleculeCount;
  const releasedHydrogenCount = h2MoleculeCount * 2 + (releasedHydrogens.length % 2);

  return {
    schema: 'peercompute.multiscale.molecular-qmat-product-topology-overlay.v0',
    modelId: 'qmat-naoh-h2-reduced-bond-overlay-v0',
    applied: bonds.length > 0,
    status: bonds.length > 0 ? 'reduced-product-topology-overlay-applied' : 'no-product-sites',
    topology,
    productSource,
    bonds,
    productSites,
    h2Sites,
    reactionSiteCount: naohMoleculeCount,
    naohMoleculeCount,
    h2MoleculeCount,
    newNaohMoleculeCount,
    newH2MoleculeCount,
    existingNaohMoleculeCount,
    existingH2MoleculeCount,
    releasedHydrogenCount,
    partialHydrogenSiteCount: releasedHydrogens.length % 2,
    requestedReactionSiteCount: requestedSites,
    availableWaterGroupCount: waterGroups.length + existingNaohMoleculeCount,
    currentWaterGroupCount: waterGroups.length,
    availableSodiumAtomCount: sodiumAtoms.length,
    validity: {
      status: 'interactive-product-topology-overlay',
      warnings: [
        'Reduced qmat product topology overlay rewires the diagnostic bond graph and may relabel existing atoms; it does not create/delete atoms or perform a calibrated reaction integration.'
      ]
    }
  };
}

function nextMoleculeGroupId(state) {
  let maxGroupId = -1;
  const atomCount = normalizeInteger(state?.atomCount, 0, 0, 32768);
  for (let i = 0; i < atomCount; i += 1) {
    maxGroupId = Math.max(maxGroupId, normalizeInteger(state.moleculeGroupId?.[i], -1, -1, 32768));
  }
  return maxGroupId + 1;
}

function assignMoleculeGroup(state, atoms = [], groupId, groupType, localIndices = []) {
  for (let i = 0; i < atoms.length; i += 1) {
    const atom = atoms[i];
    if (!Number.isInteger(atom) || atom < 0 || atom >= state.atomCount) continue;
    state.moleculeGroupId[atom] = groupId;
    state.moleculeGroupType[atom] = groupType;
    state.moleculeLocalIndex[atom] = normalizeInteger(localIndices[i], i, 0, 128);
  }
}

function clearAtomMoleculeGroup(state, atom) {
  if (!Number.isInteger(atom) || atom < 0 || atom >= state.atomCount) return;
  state.moleculeGroupId[atom] = -1;
  state.moleculeGroupType[atom] = MOLECULE_GROUP_TYPE.atom;
  state.moleculeLocalIndex[atom] = 0;
}

function nudgePairToDistance(state, a, b, targetDistance, strength = 0.35) {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 || a >= state.atomCount || b >= state.atomCount) {
    return;
  }
  const distance = Math.max(1e-6, distanceBetweenAtoms(state, a, b));
  const target = normalizeNumber(targetDistance, distance, 0.04, 0.5);
  const correction = (target - distance) * clamp(strength, 0, 1) * 0.5;
  const dx = (state.positionsX[b] - state.positionsX[a]) / distance;
  const dy = (state.positionsY[b] - state.positionsY[a]) / distance;
  const dz = (state.positionsZ[b] - state.positionsZ[a]) / distance;
  state.positionsX[a] -= dx * correction;
  state.positionsY[a] -= dy * correction;
  state.positionsZ[a] -= dz * correction;
  state.positionsX[b] += dx * correction;
  state.positionsY[b] += dy * correction;
  state.positionsZ[b] += dz * correction;
  const vx = (state.velocitiesX[a] + state.velocitiesX[b]) * 0.5;
  const vy = (state.velocitiesY[a] + state.velocitiesY[b]) * 0.5;
  const vz = (state.velocitiesZ[a] + state.velocitiesZ[b]) * 0.5;
  state.velocitiesX[a] = state.velocitiesX[a] * 0.65 + vx * 0.35;
  state.velocitiesY[a] = state.velocitiesY[a] * 0.65 + vy * 0.35;
  state.velocitiesZ[a] = state.velocitiesZ[a] * 0.65 + vz * 0.35;
  state.velocitiesX[b] = state.velocitiesX[b] * 0.65 + vx * 0.35;
  state.velocitiesY[b] = state.velocitiesY[b] * 0.65 + vy * 0.35;
  state.velocitiesZ[b] = state.velocitiesZ[b] * 0.65 + vz * 0.35;
}

function applyQuantumMaterialProductTopologyMutation(state, quantumMaterialSource = null, {
  sourceMode = 'post-md-topology-commit'
} = {}) {
  if (!Array.isArray(state.moleculeGroupId) || state.moleculeGroupId.length < state.atomCount) {
    state.moleculeGroupId = Array.from({ length: state.atomCount }, (_, index) => normalizeInteger(state.moleculeGroupId?.[index], -1, -1, 32768));
  }
  if (!Array.isArray(state.moleculeGroupType) || state.moleculeGroupType.length < state.atomCount) {
    state.moleculeGroupType = Array.from({ length: state.atomCount }, (_, index) => normalizeInteger(state.moleculeGroupType?.[index], MOLECULE_GROUP_TYPE.atom, 0, 32));
  }
  if (!Array.isArray(state.moleculeLocalIndex) || state.moleculeLocalIndex.length < state.atomCount) {
    state.moleculeLocalIndex = Array.from({ length: state.atomCount }, (_, index) => normalizeInteger(state.moleculeLocalIndex?.[index], 0, 0, 128));
  }
  const overlay = createQuantumMaterialProductTopologyOverlay(state, quantumMaterialSource);
  const newProductSites = Array.isArray(overlay.productSites) ? overlay.productSites : [];
  const newH2Sites = Array.isArray(overlay.h2Sites) ? overlay.h2Sites : [];
  const topology = overlay.topology || null;
  const naORule = productBondRuleForPair(topology, ELEMENT.Na, ELEMENT.O, 'NaOH');
  const ohRule = productBondRuleForPair(topology, ELEMENT.O, ELEMENT.H, 'NaOH');
  const h2Rule = productBondRuleForPair(topology, ELEMENT.H, ELEMENT.H, 'H2');
  let groupId = nextMoleculeGroupId(state);
  let mutatedAtomCount = 0;
  let retiredWaterGroupCount = 0;
  const retiredWaterGroups = new Set();
  for (const site of newProductSites) {
    const atoms = [site.sodium, site.oxygen, site.retainedHydrogen];
    if (atoms.some((atom) => !Number.isInteger(atom) || atom < 0 || atom >= state.atomCount)) continue;
    assignMoleculeGroup(state, atoms, groupId, MOLECULE_GROUP_TYPE.sodiumHydroxide, [0, 1, 2]);
    clearAtomMoleculeGroup(state, site.releasedHydrogen);
    nudgePairToDistance(state, site.sodium, site.oxygen, naORule?.targetDistanceReducedNm ?? 0.24, 0.28);
    nudgePairToDistance(state, site.oxygen, site.retainedHydrogen, ohRule?.targetDistanceReducedNm ?? WATER_OH_REST_REDUCED_NM, 0.42);
    const meanTemperature = (
      normalizeNumber(state.temperatureK[site.sodium], 294, 1, 250000)
        + normalizeNumber(state.temperatureK[site.oxygen], 294, 1, 250000)
        + normalizeNumber(state.temperatureK[site.retainedHydrogen], 294, 1, 250000)
    ) / 3;
    state.temperatureK[site.sodium] = state.temperatureK[site.sodium] * 0.95 + meanTemperature * 0.05;
    state.temperatureK[site.oxygen] = state.temperatureK[site.oxygen] * 0.95 + meanTemperature * 0.05;
    state.temperatureK[site.retainedHydrogen] = state.temperatureK[site.retainedHydrogen] * 0.95 + meanTemperature * 0.05;
    groupId += 1;
    mutatedAtomCount += atoms.length + (Number.isInteger(site.releasedHydrogen) ? 1 : 0);
    if (!retiredWaterGroups.has(site.sourceWaterGroupId)) {
      retiredWaterGroups.add(site.sourceWaterGroupId);
      retiredWaterGroupCount += 1;
    }
  }
  for (const site of newH2Sites) {
    if (!Number.isInteger(site.a) || !Number.isInteger(site.b) || site.a < 0 || site.b < 0) continue;
    assignMoleculeGroup(state, [site.a, site.b], groupId, MOLECULE_GROUP_TYPE.hydrogen, [0, 1]);
    nudgePairToDistance(state, site.a, site.b, h2Rule?.targetDistanceReducedNm ?? 0.074, 0.65);
    const meanTemperature = (
      normalizeNumber(state.temperatureK[site.a], 294, 1, 250000)
        + normalizeNumber(state.temperatureK[site.b], 294, 1, 250000)
    ) * 0.5;
    state.temperatureK[site.a] = state.temperatureK[site.a] * 0.94 + meanTemperature * 0.06;
    state.temperatureK[site.b] = state.temperatureK[site.b] * 0.94 + meanTemperature * 0.06;
    groupId += 1;
    mutatedAtomCount += 2;
  }
  const postOverlay = createQuantumMaterialProductTopologyOverlay(state, quantumMaterialSource);
  const applied = postOverlay.applied === true;
  const newMutationApplied = newProductSites.length > 0 || newH2Sites.length > 0;
  const productAtomCount = (postOverlay.naohMoleculeCount || 0) * 3 + (postOverlay.h2MoleculeCount || 0) * 2;
  const report = {
    schema: MOLECULAR_QMAT_PRODUCT_TOPOLOGY_MUTATION_SCHEMA,
    modelId: 'qmat-na-water-reduced-product-topology-state-mutation-v0',
    mode: sourceMode,
    applied,
    newMutationApplied,
    status: !applied
      ? 'unavailable'
      : (newMutationApplied ? 'reduced-product-topology-state-mutated' : 'reduced-product-topology-state-current'),
    targetReactionId: postOverlay.productSource?.targetReactionId || null,
    productTopologySchema: postOverlay.topology?.schema || null,
    productTopologyModelId: postOverlay.topology?.modelId || null,
    productTopologyMode: postOverlay.topology?.topologyMode || null,
    overlaySchema: postOverlay.schema,
    overlayBondCount: postOverlay.bonds.length,
    naohMoleculeCount: postOverlay.naohMoleculeCount || 0,
    h2MoleculeCount: postOverlay.h2MoleculeCount || 0,
    newNaohMoleculeCount: newProductSites.length,
    newH2MoleculeCount: newH2Sites.length,
    existingNaohMoleculeCount: postOverlay.existingNaohMoleculeCount || 0,
    existingH2MoleculeCount: postOverlay.existingH2MoleculeCount || 0,
    mutatedAtomCount: Math.max(mutatedAtomCount, productAtomCount),
    retiredWaterGroupCount: Math.max(retiredWaterGroupCount, postOverlay.naohMoleculeCount || 0),
    reducedAtomInventoryConserved: true,
    authoritativeAtomMutationReady: false,
    scientificMutation: false,
    validity: {
      status: applied ? 'interactive-reduced-topology-mutation' : 'unavailable',
      warnings: applied
        ? [
          'Reduced qmat topology mutation relabels existing atoms into NaOH/H2 product groups and does not create/delete atoms.',
          'This is still not calibrated kinetics, ReaxFF/QEq chemistry, or a conservative scientific product integration.'
        ]
        : []
    }
  };
  state.quantumMaterialProductTopologyMutation = report;
  return report;
}

function countAtomsForElement(state, atomicNumber) {
  const target = Number(atomicNumber);
  const atomCount = normalizeInteger(state?.atomCount, 0, 0, 32768);
  let count = 0;
  for (let i = 0; i < atomCount; i += 1) {
    if (Number(state?.elementZ?.[i] || 0) === target) count += 1;
  }
  return count;
}

function createQuantumMaterialReactionProductConservationAudit({
  state = null,
  reactionLedger = null,
  productSource = null,
  productTopologyOverlay = null
} = {}) {
  const source = productSource || createQuantumMaterialReactionProductSource(null);
  const overlay = productTopologyOverlay || { applied: false };
  const reactionSiteCount = normalizeInteger(
    overlay.reactionSiteCount ?? overlay.naohMoleculeCount,
    0,
    0,
    32768
  );
  const requestedReactionSiteCount = normalizeInteger(
    overlay.requestedReactionSiteCount ?? source.productTopologyReactionSiteCount,
    reactionSiteCount,
    0,
    32768
  );
  const availableWaterGroupCount = normalizeInteger(
    overlay.availableWaterGroupCount,
    state ? seededWaterGroupsForState(state).length : 0,
    0,
    32768
  );
  const availableSodiumAtomCount = normalizeInteger(
    overlay.availableSodiumAtomCount,
    state ? countAtomsForElement(state, ELEMENT.Na) : 0,
    0,
    32768
  );
  const naohMoleculeCount = normalizeInteger(overlay.naohMoleculeCount, 0, 0, 32768);
  const h2MoleculeCount = normalizeInteger(overlay.h2MoleculeCount, 0, 0, 32768);
  const releasedHydrogenCount = normalizeInteger(
    overlay.releasedHydrogenCount,
    h2MoleculeCount * 2 + normalizeInteger(overlay.partialHydrogenSiteCount, 0, 0, 32768),
    0,
    32768
  );
  const partialHydrogenSiteCount = normalizeInteger(
    overlay.partialHydrogenSiteCount,
    releasedHydrogenCount % 2,
    0,
    32768
  );
  const applied = source.applied === true && overlay.applied === true && reactionSiteCount > 0;
  const h2ExpectedMoleculeCount = reactionSiteCount * normalizeNumber(
    source.gasMoleculeFractionPerNa,
    0.5,
    0,
    4
  );
  const expectedReactants = {
    Na: reactionSiteCount,
    H2O: reactionSiteCount
  };
  const expectedReactantAtoms = {
    Na: reactionSiteCount,
    O: reactionSiteCount,
    H: reactionSiteCount * 2
  };
  const observedProductSpecies = {
    NaOH: naohMoleculeCount,
    H2: h2MoleculeCount,
    H: partialHydrogenSiteCount
  };
  const observedProductAtoms = {
    Na: naohMoleculeCount,
    O: naohMoleculeCount,
    H: naohMoleculeCount + h2MoleculeCount * 2 + partialHydrogenSiteCount
  };
  const elementResiduals = {
    Na: expectedReactantAtoms.Na - observedProductAtoms.Na,
    O: expectedReactantAtoms.O - observedProductAtoms.O,
    H: expectedReactantAtoms.H - observedProductAtoms.H
  };
  const atomConservationResidualProxy = Math.abs(elementResiduals.Na)
    + Math.abs(elementResiduals.O)
    + Math.abs(elementResiduals.H);
  const siteCoverageFraction = applied
    ? clamp(reactionSiteCount / Math.max(1, requestedReactionSiteCount || reactionSiteCount), 0, 1)
    : 0;
  const sourceHeatReleaseProxy = normalizeNumber(source.heatReleaseProxy, 0, 0, 16);
  const sourceChargeDeltaProxy = normalizeNumber(source.chargeDeltaProxy, 0, -1, 1);
  const allocatedHeatReleaseProxy = sourceHeatReleaseProxy * siteCoverageFraction;
  const allocatedChargeDeltaProxy = sourceChargeDeltaProxy * siteCoverageFraction;
  const heatBudgetResidualProxy = Math.max(0, sourceHeatReleaseProxy - allocatedHeatReleaseProxy);
  const chargeBudgetResidualProxy = Math.abs(sourceChargeDeltaProxy - allocatedChargeDeltaProxy);
  const waterConsumedCount = reactionSiteCount;
  const waterRemainingEstimate = Math.max(0, availableWaterGroupCount - waterConsumedCount);
  const reducedAtomConservationClosed = applied && atomConservationResidualProxy <= 1e-9;
  const reducedProductGraphComplete = applied && partialHydrogenSiteCount === 0
    && Math.abs(h2MoleculeCount - h2ExpectedMoleculeCount) <= 0.5;
  const reducedConservativeProductGraphReady = reducedAtomConservationClosed;
  return {
    schema: MOLECULAR_QMAT_PRODUCT_CONSERVATION_AUDIT_SCHEMA,
    modelId: 'qmat-na-water-product-accounting-v0',
    mode: 'reduced-product-graph-conservation-audit',
    applied,
    status: !applied
      ? 'unavailable'
      : (reducedProductGraphComplete
        ? 'closed-reduced-product-accounting'
        : 'partial-released-hydrogen-accounting'),
    targetReactionId: source.targetReactionId || null,
    requestedReactionSiteCount,
    reactionSiteCount,
    availableWaterGroupCount,
    availableSodiumAtomCount,
    waterConsumedCount,
    waterRemainingEstimate,
    observedSpecies: { ...(reactionLedger?.species || {}) },
    expectedReactants,
    expectedReactantAtoms,
    observedProductSpecies,
    observedProductAtoms,
    elementResiduals,
    atomConservationResidualProxy,
    h2ExpectedMoleculeCount,
    h2CompleteMoleculeCount: h2MoleculeCount,
    h2PartialHydrogenSiteCount: partialHydrogenSiteCount,
    releasedHydrogenCount,
    siteCoverageFraction,
    sourceHeatReleaseProxy,
    allocatedHeatReleaseProxy,
    heatBudgetResidualProxy,
    sourceChargeDeltaProxy,
    allocatedChargeDeltaProxy,
    chargeBudgetResidualProxy,
    reducedAtomConservationClosed,
    reducedProductGraphComplete,
    reducedConservativeProductGraphReady,
    authoritativeAtomMutationReady: false,
    scientificMutationReady: false,
    validity: {
      status: applied ? 'interactive-reduced-product-accounting' : 'unavailable',
      warnings: applied
        ? [
          'Reduced qmat product accounting verifies elemental/product-budget closure for the diagnostic product graph only.',
          'Authoritative atom/species mutation remains blocked until a calibrated conservative chemistry update writes the worker buffers.'
        ]
        : []
    }
  };
}

function applySeededWaterTopologyProjection(state, {
  strength = 0.62,
  dt = 0.05,
  quantumMaterialSource = null
} = {}) {
  const source = quantumMaterialSource?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
    ? quantumMaterialSource
    : quantumMaterialSourceForState(state);
  if (source.reactionBarrierProductTopologyAvailable === true) {
    state.seededWaterTopologyProjection = {
      applied: false,
      projectedWaterCount: 0,
      reason: 'product-topology-available'
    };
    return state.seededWaterTopologyProjection;
  }
  const boundedStrength = clamp(strength, 0, 0.92);
  const invDt = 1 / Math.max(1e-6, normalizeNumber(dt, 0.05, 1e-6, 10));
  let projectedWaterCount = 0;
  let correctionMagnitude = 0;
  for (const group of seededWaterGroupsForState(state)) {
    const oxygen = group.oxygen;
    const [h1, h2] = group.hydrogens;
    const meanTemperature = (
      normalizeNumber(state.temperatureK[oxygen], 294, 1, 250000)
        + normalizeNumber(state.temperatureK[h1], 294, 1, 250000)
        + normalizeNumber(state.temperatureK[h2], 294, 1, 250000)
    ) / 3;
    if (meanTemperature >= 900) continue;

    for (const hydrogen of [h1, h2]) {
      const dx = state.positionsX[hydrogen] - state.positionsX[oxygen];
      const dy = state.positionsY[hydrogen] - state.positionsY[oxygen];
      const dz = state.positionsZ[hydrogen] - state.positionsZ[oxygen];
      const dist = Math.max(1e-6, Math.hypot(dx, dy, dz));
      const correction = (WATER_OH_REST_REDUCED_NM - dist) * boundedStrength;
      const cx = dx / dist * correction;
      const cy = dy / dist * correction;
      const cz = dz / dist * correction;
      state.positionsX[hydrogen] += cx;
      state.positionsY[hydrogen] += cy;
      state.positionsZ[hydrogen] += cz;
      state.velocitiesX[hydrogen] += cx * invDt * 0.18;
      state.velocitiesY[hydrogen] += cy * invDt * 0.18;
      state.velocitiesZ[hydrogen] += cz * invDt * 0.18;
      correctionMagnitude += Math.hypot(cx, cy, cz);
    }

    const hhDx = state.positionsX[h2] - state.positionsX[h1];
    const hhDy = state.positionsY[h2] - state.positionsY[h1];
    const hhDz = state.positionsZ[h2] - state.positionsZ[h1];
    const hhDist = Math.max(1e-6, Math.hypot(hhDx, hhDy, hhDz));
    const hhCorrection = (WATER_HH_TARGET_REDUCED_NM - hhDist) * boundedStrength * 0.5;
    const hx = hhDx / hhDist * hhCorrection;
    const hy = hhDy / hhDist * hhCorrection;
    const hz = hhDz / hhDist * hhCorrection;
    state.positionsX[h1] -= hx;
    state.positionsY[h1] -= hy;
    state.positionsZ[h1] -= hz;
    state.positionsX[h2] += hx;
    state.positionsY[h2] += hy;
    state.positionsZ[h2] += hz;
    state.velocitiesX[h1] -= hx * invDt * 0.12;
    state.velocitiesY[h1] -= hy * invDt * 0.12;
    state.velocitiesZ[h1] -= hz * invDt * 0.12;
    state.velocitiesX[h2] += hx * invDt * 0.12;
    state.velocitiesY[h2] += hy * invDt * 0.12;
    state.velocitiesZ[h2] += hz * invDt * 0.12;
    for (const hydrogen of [h1, h2]) {
      state.velocitiesX[hydrogen] = state.velocitiesX[oxygen] + (state.velocitiesX[hydrogen] - state.velocitiesX[oxygen]) * 0.68;
      state.velocitiesY[hydrogen] = state.velocitiesY[oxygen] + (state.velocitiesY[hydrogen] - state.velocitiesY[oxygen]) * 0.68;
      state.velocitiesZ[hydrogen] = state.velocitiesZ[oxygen] + (state.velocitiesZ[hydrogen] - state.velocitiesZ[oxygen]) * 0.68;
    }
    correctionMagnitude += Math.abs(hhCorrection) * 2;
    projectedWaterCount += 1;
  }
  state.seededWaterTopologyProjection = {
    applied: projectedWaterCount > 0,
    projectedWaterCount,
    correctionMagnitude
  };
  return state.seededWaterTopologyProjection;
}

function createMolecularGeometryForceLawLedger({ state, bonds = [], quantumMaterialSource = null } = {}) {
  const atomCount = normalizeInteger(state?.atomCount, 0, 0, 32768);
  const geometryTargets = molecularGeometryTargetsFromQuantumMaterialSource(quantumMaterialSource || state?.quantumMaterialSource);
  const hByO = new Map();
  for (const bond of Array.isArray(bonds) ? bonds : []) {
    const a = Number(bond.a);
    const b = Number(bond.b);
    if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 || a >= atomCount || b >= atomCount) continue;
    const elementA = state.elementZ[a];
    const elementB = state.elementZ[b];
    let oxygen = -1;
    let hydrogen = -1;
    if (elementA === ELEMENT.O && elementB === ELEMENT.H) {
      oxygen = a;
      hydrogen = b;
    } else if (elementB === ELEMENT.O && elementA === ELEMENT.H) {
      oxygen = b;
      hydrogen = a;
    }
	    if (oxygen < 0 || hydrogen < 0) continue;
	    const distance = distanceBetweenAtoms(state, oxygen, hydrogen);
	    const seededWaterPair = isSeededWaterOhPair(state, oxygen, hydrogen);
	    if (distance > (seededWaterPair ? 0.3 : 0.24)) continue;
	    const hydrogens = hByO.get(oxygen) || [];
    hydrogens.push({ index: hydrogen, distance, bondOrder: Number(bond.order || 0) });
    hByO.set(oxygen, hydrogens);
  }

  const species = compositionFromState({ atomCount, elementZ: state?.elementZ || [] });
  const expectedWaterTriplets = Math.min(Number(species.O || 0), Math.floor(Number(species.H || 0) / 2));
  let tripletCount = 0;
  let completeWaterTripletCount = 0;
  let angleSum = 0;
  let angleErrorAbsSum = 0;
  let angleErrorSquaredSum = 0;
  let maxAngleErrorDeg = 0;
  let ohDistanceSum = 0;
  let hhDistanceSum = 0;
  let bondDistanceErrorSquared = 0;
  for (const [oxygen, hydrogens] of hByO.entries()) {
    if (hydrogens.length < 2) continue;
    hydrogens.sort((a, b) => b.bondOrder - a.bondOrder || a.distance - b.distance);
    const h1 = hydrogens[0].index;
    const h2 = hydrogens[1].index;
    const v1 = [
      Number(state.positionsX[h1] || 0) - Number(state.positionsX[oxygen] || 0),
      Number(state.positionsY[h1] || 0) - Number(state.positionsY[oxygen] || 0),
      Number(state.positionsZ[h1] || 0) - Number(state.positionsZ[oxygen] || 0)
    ];
    const v2 = [
      Number(state.positionsX[h2] || 0) - Number(state.positionsX[oxygen] || 0),
      Number(state.positionsY[h2] || 0) - Number(state.positionsY[oxygen] || 0),
      Number(state.positionsZ[h2] || 0) - Number(state.positionsZ[oxygen] || 0)
    ];
    const d1 = Math.max(1e-6, Math.hypot(v1[0], v1[1], v1[2]));
    const d2 = Math.max(1e-6, Math.hypot(v2[0], v2[1], v2[2]));
    const cosTheta = clamp((v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]) / (d1 * d2), -1, 1);
    const angleDeg = Math.acos(cosTheta) * 180 / Math.PI;
    const angleErrorDeg = angleDeg - geometryTargets.targetAngleDeg;
    const hhDistance = distanceBetweenAtoms(state, h1, h2);
    tripletCount += 1;
    completeWaterTripletCount += d1 < 0.17 && d2 < 0.17 && hhDistance < 0.24 ? 1 : 0;
    angleSum += angleDeg;
    angleErrorAbsSum += Math.abs(angleErrorDeg);
    angleErrorSquaredSum += angleErrorDeg * angleErrorDeg;
    maxAngleErrorDeg = Math.max(maxAngleErrorDeg, Math.abs(angleErrorDeg));
    ohDistanceSum += (d1 + d2) * 0.5;
    hhDistanceSum += hhDistance;
    bondDistanceErrorSquared += Math.pow((d1 - geometryTargets.targetOhDistanceReducedNm) / geometryTargets.targetOhDistanceReducedNm, 2);
    bondDistanceErrorSquared += Math.pow((d2 - geometryTargets.targetOhDistanceReducedNm) / geometryTargets.targetOhDistanceReducedNm, 2);
    bondDistanceErrorSquared += Math.pow((hhDistance - geometryTargets.targetHhDistanceReducedNm) / geometryTargets.targetHhDistanceReducedNm, 2) * 0.35;
  }
  const rmsAngleErrorDeg = tripletCount > 0
    ? Math.sqrt(angleErrorSquaredSum / tripletCount)
    : 0;
  const geometryEnergyProxy = tripletCount > 0
    ? (rmsAngleErrorDeg / 180) ** 2 * tripletCount * 0.38 + bondDistanceErrorSquared * 0.015
    : 0;
  return {
    schema: MOLECULAR_GEOMETRY_FORCE_LAW_SCHEMA,
    modelId: geometryTargets.sourceApplied
      ? 'qmat-sourced-water-hoh-angle-distance-constraint-v0'
      : 'reduced-water-hoh-angle-distance-constraint-v0',
    status: 'interactive-proxy',
    targetMolecule: 'H2O',
    targetSource: geometryTargets.targetSource,
    sourceApplied: geometryTargets.sourceApplied,
    sourceSchema: geometryTargets.sourceSchema,
    sourceModelId: geometryTargets.sourceModelId,
    sourceStatus: geometryTargets.sourceStatus,
    sourceBackend: geometryTargets.sourceBackend,
    sourceConfidence: geometryTargets.confidence,
    sourceCalibrated: geometryTargets.calibrated,
    sourceRecordCount: geometryTargets.geometryRecordCount,
    sourceBondRecordCount: geometryTargets.bondRecordCount,
    sourceTargetPairLabel: geometryTargets.targetPairLabel,
    targetAngleDeg: geometryTargets.targetAngleDeg,
    targetAngleCos: geometryTargets.targetAngleCos,
    targetOhDistanceReducedNm: geometryTargets.targetOhDistanceReducedNm,
    targetHhDistanceReducedNm: geometryTargets.targetHhDistanceReducedNm,
    distanceStiffnessProxy: geometryTargets.distanceStiffnessProxy,
    angleStiffnessProxy: geometryTargets.angleStiffnessProxy,
    molecularGeometrySource: geometryTargets.molecularGeometrySource,
    expectedWaterTripletCount: expectedWaterTriplets,
    tripletCount,
    completeWaterTripletCount,
    meanAngleDeg: tripletCount > 0 ? angleSum / tripletCount : 0,
    meanAbsAngleErrorDeg: tripletCount > 0 ? angleErrorAbsSum / tripletCount : 0,
    rmsAngleErrorDeg,
    maxAbsAngleErrorDeg: maxAngleErrorDeg,
    meanOhDistanceReducedNm: tripletCount > 0 ? ohDistanceSum / tripletCount : 0,
    meanHhDistanceReducedNm: tripletCount > 0 ? hhDistanceSum / tripletCount : 0,
    geometryClosureFraction: expectedWaterTriplets > 0 ? clamp(tripletCount / expectedWaterTriplets, 0, 1) : 0,
    stiffnessProxy: tripletCount > 0 ? clamp(1 - rmsAngleErrorDeg / 90, 0, 1) : 0,
    geometryEnergyProxy,
    webgpuKernelTerm: 'water-oh-distance-hh-spacing-hoh-central-angle',
    validity: {
      status: 'interactive-proxy',
      warnings: [
        geometryTargets.sourceApplied
          ? 'Qmat-sourced reduced water geometry targets stabilize H-O-H shape in the live WebGPU MD kernel; the source is still not a calibrated flexible water model.'
          : 'Reduced water geometry law stabilizes H-O-H shape in the live WebGPU MD kernel; it is not a calibrated flexible water model.'
      ]
    }
  };
}

function initialChargeForElement(element, quantumCoupling = null) {
  const base = ELEMENT_DATA[Number(element)]?.charge ?? 0;
  return clamp(base + quantumAdjustmentForElement(element, quantumCoupling).chargeBias, -1.4, 1.4);
}

function defaultCompositionForAtomCount(atomCount) {
  const waterMoleculeCount = Math.max(1, Math.floor(normalizeInteger(atomCount, 72, 3, 32768) / 3));
  const composition = {
    H: waterMoleculeCount * 2,
    O: waterMoleculeCount
  };
  const remainder = normalizeInteger(atomCount, 72, 3, 32768) - waterMoleculeCount * 3;
  if (remainder > 0) composition.H += remainder;
  return composition;
}

function normalizeElementKey(key) {
  const raw = String(key || '').trim();
  if (!raw) return null;
  const numeric = Number(raw);
  if (Number.isInteger(numeric) && ELEMENT_DATA[numeric]) return ELEMENT_DATA[numeric].symbol;
  const normalized = raw.slice(0, 1).toUpperCase() + raw.slice(1).toLowerCase();
  return Z_BY_SYMBOL.has(normalized.toLowerCase()) ? normalized : null;
}

function hasFiniteWavefunctionEvolution(evolution = null) {
  return evolution
    && typeof evolution === 'object'
    && Number.isFinite(Number(evolution.normDrift))
    && Number.isFinite(Number(evolution.densityDriftL1))
    && Number.isFinite(Number(evolution.phaseRotationRad));
}

function wavefunctionEvolutionFromFlat(source = {}, prefix = '') {
  const schema = source[`${prefix}Schema`];
  const normDrift = source[`${prefix}NormDrift`];
  const densityDriftL1 = source[`${prefix}DensityDriftL1`];
  const phaseRotationRad = source[`${prefix}PhaseRotationRad`];
  if (!schema && !Number.isFinite(Number(normDrift))) return null;
  const hamiltonianComponents = source[`${prefix}HamiltonianComponents`]
    || (source[`${prefix}HamiltonianComponentsSchema`] ? {
      schema: source[`${prefix}HamiltonianComponentsSchema`]
    } : null);
  return {
    schema: schema || null,
    backend: source[`${prefix}Backend`] || null,
    status: source[`${prefix}Status`] || null,
    dtAtomicUnits: source[`${prefix}DtAtomicUnits`] ?? null,
    normDrift,
    densityDriftL1,
    energyExpectationEv: source[`${prefix}EnergyExpectationEv`] ?? null,
    kineticExpectationEv: source[`${prefix}KineticExpectationEv`] ?? hamiltonianComponents?.kineticExpectationEv ?? null,
    potentialExpectationEv: source[`${prefix}PotentialExpectationEv`] ?? hamiltonianComponents?.potentialExpectationEv ?? null,
    fieldEnergyExpectationEv: source[`${prefix}FieldEnergyExpectationEv`] ?? source[`${prefix}FieldResponse`]?.fieldEnergyExpectationEv ?? null,
    absFieldEnergyExpectationEv: source[`${prefix}AbsFieldEnergyExpectationEv`] ?? source[`${prefix}FieldResponse`]?.absFieldEnergyExpectationEv ?? null,
    electricFieldVm: source[`${prefix}ElectricFieldVm`] ?? source[`${prefix}FieldResponse`]?.electricFieldVm ?? null,
    electricFieldAtomicUnits: source[`${prefix}ElectricFieldAtomicUnits`] ?? source[`${prefix}FieldResponse`]?.electricFieldAtomicUnits ?? null,
    dipoleMomentZBohrElectron: source[`${prefix}DipoleMomentZBohrElectron`] ?? source[`${prefix}FieldResponse`]?.dipoleMomentZBohrElectron ?? null,
    fieldRmsExtentBohr: source[`${prefix}FieldRmsExtentBohr`] ?? source[`${prefix}FieldResponse`]?.fieldRmsExtentBohr ?? null,
    polarizabilityProxyBohr3: source[`${prefix}PolarizabilityProxyBohr3`] ?? source[`${prefix}FieldResponse`]?.polarizabilityProxyBohr3 ?? null,
    starkShiftProxyEv: source[`${prefix}StarkShiftProxyEv`] ?? source[`${prefix}FieldResponse`]?.starkShiftProxyEv ?? null,
    fieldResponse: source[`${prefix}FieldResponse`] || null,
    fieldResponseSchema: source[`${prefix}FieldResponseSchema`] ?? source[`${prefix}FieldResponse`]?.schema ?? null,
    magneticFieldT: source[`${prefix}MagneticFieldT`] ?? source[`${prefix}MagneticResponse`]?.magneticFieldT ?? null,
    magneticFieldAtomicUnits: source[`${prefix}MagneticFieldAtomicUnits`] ?? source[`${prefix}MagneticResponse`]?.magneticFieldAtomicUnits ?? null,
    zeemanEnergyExpectationEv: source[`${prefix}ZeemanEnergyExpectationEv`] ?? source[`${prefix}MagneticResponse`]?.zeemanEnergyExpectationEv ?? null,
    absZeemanEnergyExpectationEv: source[`${prefix}AbsZeemanEnergyExpectationEv`] ?? source[`${prefix}MagneticResponse`]?.absZeemanEnergyExpectationEv ?? null,
    magneticMomentProjectionBohrMagneton: source[`${prefix}MagneticMomentProjectionBohrMagneton`] ?? source[`${prefix}MagneticResponse`]?.magneticMomentProjectionBohrMagneton ?? null,
    zeemanProjection: source[`${prefix}ZeemanProjection`] ?? source[`${prefix}MagneticResponse`]?.zeemanProjection ?? null,
    spinProjection: source[`${prefix}SpinProjection`] ?? source[`${prefix}MagneticResponse`]?.spinProjection ?? null,
    larmorAngularFrequencyProxyAu: source[`${prefix}LarmorAngularFrequencyProxyAu`] ?? source[`${prefix}MagneticResponse`]?.larmorAngularFrequencyProxyAu ?? null,
    magneticResponse: source[`${prefix}MagneticResponse`] || null,
    magneticResponseSchema: source[`${prefix}MagneticResponseSchema`] ?? source[`${prefix}MagneticResponse`]?.schema ?? null,
    componentEnergyExpectationEv: source[`${prefix}ComponentEnergyExpectationEv`] ?? hamiltonianComponents?.componentEnergyExpectationEv ?? null,
    hamiltonianComponentResidualEv: source[`${prefix}HamiltonianComponentResidualEv`] ?? hamiltonianComponents?.hamiltonianComponentResidualEv ?? null,
    virialResidualEv: source[`${prefix}VirialResidualEv`] ?? hamiltonianComponents?.virialResidualEv ?? null,
    hamiltonianComponents,
    hamiltonianComponentsSchema: source[`${prefix}HamiltonianComponentsSchema`] ?? hamiltonianComponents?.schema ?? null,
    phaseRotationRad,
    interiorSampleCount: source[`${prefix}InteriorSampleCount`] ?? null,
    parity: typeof source[`${prefix}ParityOk`] === 'boolean'
      ? { ok: source[`${prefix}ParityOk`] }
      : null
  };
}

function isWebgpuWavefunctionEvolution(evolution = null) {
  const schema = String(evolution?.schema || '').toLowerCase();
  const backend = String(evolution?.backend || evolution?.source || '').toLowerCase();
  return schema === QUANTUM_ORBITAL_GRID_WAVEFUNCTION_EVOLUTION_WEBGPU_SCHEMA
    || schema.includes('wavefunction-evolution-webgpu')
    || backend.startsWith('webgpu');
}

function resolveWavefunctionEvolutionCoupling({ finiteGrid = {}, envelope = {}, chemistry = {} } = {}) {
  const webgpuEvolution = finiteGrid.wavefunctionEvolutionWebgpu
    || chemistry.wavefunctionEvolutionWebgpu
    || envelope.wavefunctionEvolutionWebgpu
    || wavefunctionEvolutionFromFlat(finiteGrid, 'wavefunctionEvolutionWebgpu')
    || wavefunctionEvolutionFromFlat(envelope, 'finiteGridWavefunctionEvolutionWebgpu')
    || wavefunctionEvolutionFromFlat(envelope, 'wavefunctionEvolutionWebgpu');
  const cpuEvolution = finiteGrid.wavefunctionEvolution
    || chemistry.wavefunctionEvolution
    || envelope.wavefunctionEvolution
    || wavefunctionEvolutionFromFlat(finiteGrid, 'wavefunctionEvolution')
    || wavefunctionEvolutionFromFlat(envelope, 'finiteGridWavefunctionEvolution')
    || wavefunctionEvolutionFromFlat(envelope, 'wavefunctionEvolution');
  const implicitWebgpuEvolution = hasFiniteWavefunctionEvolution(cpuEvolution) && isWebgpuWavefunctionEvolution(cpuEvolution)
    ? cpuEvolution
    : null;
  const evolution = hasFiniteWavefunctionEvolution(webgpuEvolution)
    ? webgpuEvolution
    : implicitWebgpuEvolution || cpuEvolution;
  if (!hasFiniteWavefunctionEvolution(evolution)) {
    return {
      wavefunctionEvolutionSchema: null,
      wavefunctionEvolutionSource: 'unavailable',
      wavefunctionEvolutionBackend: null,
      wavefunctionEvolutionStatus: 'unavailable',
      wavefunctionEvolutionNormDrift: 0,
      wavefunctionEvolutionDensityDriftL1: 0,
      wavefunctionEvolutionEnergyExpectationEv: 0,
      wavefunctionEvolutionKineticExpectationEv: 0,
      wavefunctionEvolutionPotentialExpectationEv: 0,
      wavefunctionEvolutionFieldEnergyExpectationEv: 0,
      wavefunctionEvolutionAbsFieldEnergyExpectationEv: 0,
      wavefunctionEvolutionElectricFieldVm: 0,
      wavefunctionEvolutionElectricFieldAtomicUnits: 0,
      wavefunctionEvolutionDipoleMomentZBohrElectron: 0,
      wavefunctionEvolutionFieldRmsExtentBohr: 0,
      wavefunctionEvolutionPolarizabilityProxyBohr3: 0,
      wavefunctionEvolutionStarkShiftProxyEv: 0,
      wavefunctionEvolutionFieldResponseSchema: null,
      wavefunctionEvolutionMagneticFieldT: 0,
      wavefunctionEvolutionMagneticFieldAtomicUnits: 0,
      wavefunctionEvolutionZeemanEnergyExpectationEv: 0,
      wavefunctionEvolutionAbsZeemanEnergyExpectationEv: 0,
      wavefunctionEvolutionMagneticMomentProjectionBohrMagneton: 0,
      wavefunctionEvolutionZeemanProjection: 0,
      wavefunctionEvolutionSpinProjection: 0,
      wavefunctionEvolutionLarmorAngularFrequencyProxyAu: 0,
      wavefunctionEvolutionMagneticResponseSchema: null,
      wavefunctionEvolutionComponentEnergyExpectationEv: 0,
      wavefunctionEvolutionHamiltonianComponentResidualEv: 0,
      wavefunctionEvolutionVirialResidualEv: 0,
      wavefunctionEvolutionHamiltonianComponentsSchema: null,
      wavefunctionEvolutionPhaseRotationRad: 0,
      wavefunctionEvolutionDtAtomicUnits: 0,
      wavefunctionEvolutionWebgpuParityOk: null,
      wavefunctionEvolutionWebgpuExecuted: false,
      wavefunctionEvolutionLiveBackendPolicy: finiteGrid.liveBackendPolicy || envelope.finiteGridLiveBackendPolicy || null,
      wavefunctionEvolutionDrive: 0
    };
  }
  const webgpuExecuted = evolution === webgpuEvolution || evolution === implicitWebgpuEvolution || isWebgpuWavefunctionEvolution(evolution);
  const source = webgpuExecuted ? QUANTUM_SOURCE_WEBGPU_WORKER : QUANTUM_SOURCE_CPU_REFERENCE;
  const normDrift = normalizeNumber(evolution.normDrift, 0, 0, 1);
  const densityDriftL1 = normalizeNumber(evolution.densityDriftL1, 0, 0, 2);
  const phaseRotationRad = normalizeNumber(evolution.phaseRotationRad, 0, -1e6, 1e6);
  const energyExpectationEv = normalizeNumber(evolution.energyExpectationEv, 0, -1e9, 1e9);
  const hamiltonianComponents = evolution.hamiltonianComponents || {};
  const fieldResponse = evolution.fieldResponse || {};
  const kineticExpectationEv = normalizeNumber(evolution.kineticExpectationEv ?? hamiltonianComponents.kineticExpectationEv, 0, -1e9, 1e9);
  const potentialExpectationEv = normalizeNumber(evolution.potentialExpectationEv ?? hamiltonianComponents.potentialExpectationEv, 0, -1e9, 1e9);
  const fieldEnergyExpectationEv = normalizeNumber(evolution.fieldEnergyExpectationEv ?? fieldResponse.fieldEnergyExpectationEv, 0, -1e9, 1e9);
  const absFieldEnergyExpectationEv = normalizeNumber(evolution.absFieldEnergyExpectationEv ?? fieldResponse.absFieldEnergyExpectationEv, 0, 0, 1e9);
  const electricFieldVm = normalizeNumber(evolution.electricFieldVm ?? fieldResponse.electricFieldVm, 0, -1e12, 1e12);
  const electricFieldAtomicUnits = normalizeNumber(evolution.electricFieldAtomicUnits ?? fieldResponse.electricFieldAtomicUnits, 0, -1, 1);
  const dipoleMomentZBohrElectron = normalizeNumber(evolution.dipoleMomentZBohrElectron ?? fieldResponse.dipoleMomentZBohrElectron, 0, -1e6, 1e6);
  const fieldRmsExtentBohr = normalizeNumber(evolution.fieldRmsExtentBohr ?? fieldResponse.fieldRmsExtentBohr, 0, 0, 1e6);
  const polarizabilityProxyBohr3 = normalizeNumber(evolution.polarizabilityProxyBohr3 ?? fieldResponse.polarizabilityProxyBohr3, 0, 0, 1e12);
  const starkShiftProxyEv = normalizeNumber(evolution.starkShiftProxyEv ?? fieldResponse.starkShiftProxyEv, 0, -1e9, 0);
  const magneticResponse = evolution.magneticResponse || {};
  const magneticFieldT = normalizeNumber(evolution.magneticFieldT ?? magneticResponse.magneticFieldT, 0, -1e6, 1e6);
  const magneticFieldAtomicUnits = normalizeNumber(evolution.magneticFieldAtomicUnits ?? magneticResponse.magneticFieldAtomicUnits, 0, -1, 1);
  const zeemanEnergyExpectationEv = normalizeNumber(evolution.zeemanEnergyExpectationEv ?? magneticResponse.zeemanEnergyExpectationEv, 0, -1e9, 1e9);
  const absZeemanEnergyExpectationEv = normalizeNumber(evolution.absZeemanEnergyExpectationEv ?? magneticResponse.absZeemanEnergyExpectationEv, 0, 0, 1e9);
  const magneticMomentProjectionBohrMagneton = normalizeNumber(evolution.magneticMomentProjectionBohrMagneton ?? magneticResponse.magneticMomentProjectionBohrMagneton, 0, -1e6, 1e6);
  const zeemanProjection = normalizeNumber(evolution.zeemanProjection ?? magneticResponse.zeemanProjection, 0, -1e6, 1e6);
  const spinProjection = normalizeNumber(evolution.spinProjection ?? magneticResponse.spinProjection, 0, -1e6, 1e6);
  const larmorAngularFrequencyProxyAu = normalizeNumber(evolution.larmorAngularFrequencyProxyAu ?? magneticResponse.larmorAngularFrequencyProxyAu, 0, 0, 1);
  const componentEnergyExpectationEv = normalizeNumber(evolution.componentEnergyExpectationEv ?? hamiltonianComponents.componentEnergyExpectationEv, 0, -1e9, 1e9);
  const hamiltonianComponentResidualEv = normalizeNumber(evolution.hamiltonianComponentResidualEv ?? hamiltonianComponents.hamiltonianComponentResidualEv, 0, -1e9, 1e9);
  const virialResidualEv = normalizeNumber(evolution.virialResidualEv ?? hamiltonianComponents.virialResidualEv, 0, -1e9, 1e9);
  const parityOk = webgpuExecuted
    ? (evolution.parity?.ok ?? finiteGrid.wavefunctionEvolutionWebgpuParityOk ?? envelope.finiteGridWavefunctionEvolutionWebgpuParityOk ?? null)
    : null;
  const stabilityDrive = normDrift * 140 + densityDriftL1 * 55 + Math.min(0.035, Math.abs(phaseRotationRad) * 0.42);
  const energyDrive = Math.min(0.018, Math.abs(energyExpectationEv) / 12000);
  const fieldDrive = Math.min(0.022, Math.abs(electricFieldAtomicUnits) * 0.18 + Math.abs(fieldEnergyExpectationEv) / 18000 + Math.abs(starkShiftProxyEv) / 12000);
  const magneticDrive = Math.min(0.014, Math.abs(magneticFieldAtomicUnits) * 0.16 + Math.abs(zeemanEnergyExpectationEv) / 18000 + Math.abs(magneticMomentProjectionBohrMagneton) * 0.001);
  const parityScale = parityOk === false ? 0.55 : parityOk === true ? 1.08 : 1;
  return {
    wavefunctionEvolutionSchema: evolution.schema || null,
    wavefunctionEvolutionSource: source,
    wavefunctionEvolutionBackend: evolution.backend || (webgpuExecuted ? 'webgpu-orbital-grid-wavefunction-evolution-reduction' : null),
    wavefunctionEvolutionStatus: evolution.status || 'unknown',
    wavefunctionEvolutionNormDrift: normDrift,
    wavefunctionEvolutionDensityDriftL1: densityDriftL1,
    wavefunctionEvolutionEnergyExpectationEv: energyExpectationEv,
    wavefunctionEvolutionKineticExpectationEv: kineticExpectationEv,
    wavefunctionEvolutionPotentialExpectationEv: potentialExpectationEv,
    wavefunctionEvolutionFieldEnergyExpectationEv: fieldEnergyExpectationEv,
    wavefunctionEvolutionAbsFieldEnergyExpectationEv: absFieldEnergyExpectationEv,
    wavefunctionEvolutionElectricFieldVm: electricFieldVm,
    wavefunctionEvolutionElectricFieldAtomicUnits: electricFieldAtomicUnits,
    wavefunctionEvolutionDipoleMomentZBohrElectron: dipoleMomentZBohrElectron,
    wavefunctionEvolutionFieldRmsExtentBohr: fieldRmsExtentBohr,
    wavefunctionEvolutionPolarizabilityProxyBohr3: polarizabilityProxyBohr3,
    wavefunctionEvolutionStarkShiftProxyEv: starkShiftProxyEv,
    wavefunctionEvolutionFieldResponseSchema: fieldResponse.schema || evolution.fieldResponseSchema || null,
    wavefunctionEvolutionMagneticFieldT: magneticFieldT,
    wavefunctionEvolutionMagneticFieldAtomicUnits: magneticFieldAtomicUnits,
    wavefunctionEvolutionZeemanEnergyExpectationEv: zeemanEnergyExpectationEv,
    wavefunctionEvolutionAbsZeemanEnergyExpectationEv: absZeemanEnergyExpectationEv,
    wavefunctionEvolutionMagneticMomentProjectionBohrMagneton: magneticMomentProjectionBohrMagneton,
    wavefunctionEvolutionZeemanProjection: zeemanProjection,
    wavefunctionEvolutionSpinProjection: spinProjection,
    wavefunctionEvolutionLarmorAngularFrequencyProxyAu: larmorAngularFrequencyProxyAu,
    wavefunctionEvolutionMagneticResponseSchema: magneticResponse.schema || evolution.magneticResponseSchema || null,
    wavefunctionEvolutionComponentEnergyExpectationEv: componentEnergyExpectationEv,
    wavefunctionEvolutionHamiltonianComponentResidualEv: hamiltonianComponentResidualEv,
    wavefunctionEvolutionVirialResidualEv: virialResidualEv,
    wavefunctionEvolutionHamiltonianComponentsSchema: hamiltonianComponents.schema || evolution.hamiltonianComponentsSchema || null,
    wavefunctionEvolutionPhaseRotationRad: phaseRotationRad,
    wavefunctionEvolutionDtAtomicUnits: normalizeNumber(evolution.dtAtomicUnits, 0, 0, 1),
    wavefunctionEvolutionWebgpuParityOk: parityOk,
    wavefunctionEvolutionWebgpuExecuted: webgpuExecuted,
    wavefunctionEvolutionLiveBackendPolicy: finiteGrid.liveBackendPolicy || envelope.finiteGridLiveBackendPolicy || null,
    wavefunctionEvolutionDrive: clamp((stabilityDrive + energyDrive + fieldDrive + magneticDrive) * parityScale, 0, 0.09)
  };
}

function radialEigenstateFromFlat(source = {}, prefix = '') {
  const schema = source[`${prefix}Schema`];
  const energyEv = source[`${prefix}EnergyEv`];
  const residualRelativeL2 = source[`${prefix}ResidualRelativeL2`];
  if (!schema && !Number.isFinite(Number(energyEv)) && !Number.isFinite(Number(residualRelativeL2))) return null;
  return {
    schema: schema || null,
    backend: source[`${prefix}Backend`] || null,
    status: source[`${prefix}Status`] || null,
    energyEv,
    analyticEnergyEv: source[`${prefix}AnalyticEnergyEv`] ?? null,
    energyErrorEv: source[`${prefix}EnergyErrorEv`] ?? null,
    residualRelativeL2,
    meanRadiusBohr: source[`${prefix}MeanRadiusBohr`] ?? null,
    gridPointCount: source[`${prefix}GridPointCount`] ?? null,
    radialNodeCountObserved: source[`${prefix}NodeCountObserved`] ?? null,
    radialNodeCountTarget: source[`${prefix}NodeCountTarget`] ?? null
  };
}

function hasFiniteRadialEigenstate(radial = null) {
  return radial
    && typeof radial === 'object'
    && Number.isFinite(Number(radial.energyEv))
    && Number.isFinite(Number(radial.residualRelativeL2));
}

function isWebgpuRadialEigenstate(radial = null) {
  const schema = String(radial?.schema || '').toLowerCase();
  const backend = String(radial?.backend || radial?.source || '').toLowerCase();
  return schema === QUANTUM_ORBITAL_RADIAL_WEBGPU_SCHEMA
    || schema.includes('radial-webgpu-eigensolver')
    || backend.startsWith('webgpu');
}

function resolveRadialEigenstateCoupling({ finiteGrid = {}, envelope = {}, chemistry = {} } = {}) {
  const radial = finiteGrid.radialEigenstate
    || chemistry.radialEigenstate
    || envelope.radialEigenstate
    || radialEigenstateFromFlat(finiteGrid, 'radialEigenstate')
    || radialEigenstateFromFlat(envelope, 'finiteGridRadialEigenstate')
    || radialEigenstateFromFlat(envelope, 'radialEigenstate');
  if (!hasFiniteRadialEigenstate(radial)) {
    return {
      radialEigenstateSchema: null,
      radialEigenstateSource: 'unavailable',
      radialEigenstateStatus: 'unavailable',
      radialEigenstateEnergyEv: 0,
      radialEigenstateAnalyticEnergyEv: 0,
      radialEigenstateEnergyErrorEv: 0,
      radialEigenstateResidualRelativeL2: 0,
      radialEigenstateMeanRadiusBohr: 0,
      radialEigenstateGridPointCount: 0,
      radialEigenstateNodeCountObserved: 0,
      radialEigenstateNodeCountTarget: 0,
      radialEigenstateWebgpuExecuted: false
    };
  }
  const webgpuExecuted = isWebgpuRadialEigenstate(radial);
  return {
    radialEigenstateSchema: radial.schema || null,
    radialEigenstateSource: webgpuExecuted ? QUANTUM_SOURCE_WEBGPU_WORKER : QUANTUM_SOURCE_CPU_REFERENCE,
    radialEigenstateStatus: radial.status || 'unknown',
    radialEigenstateEnergyEv: normalizeNumber(radial.energyEv, 0, -1e9, 1e9),
    radialEigenstateAnalyticEnergyEv: normalizeNumber(radial.analyticEnergyEv, 0, -1e9, 1e9),
    radialEigenstateEnergyErrorEv: normalizeNumber(radial.energyErrorEv, 0, -1e9, 1e9),
    radialEigenstateResidualRelativeL2: normalizeNumber(radial.residualRelativeL2, 0, 0, 1e9),
    radialEigenstateMeanRadiusBohr: normalizeNumber(radial.meanRadiusBohr, 0, 0, 1e9),
    radialEigenstateGridPointCount: normalizeInteger(radial.gridPointCount, 0, 0, 1e9),
    radialEigenstateNodeCountObserved: normalizeInteger(radial.radialNodeCountObserved, 0, 0, 1e6),
    radialEigenstateNodeCountTarget: normalizeInteger(radial.radialNodeCountTarget, 0, 0, 1e6),
    radialEigenstateWebgpuExecuted: webgpuExecuted
  };
}

function statisticalBridgeFromFlat(source = {}, prefix = '') {
  const schema = source[`${prefix}Schema`];
  const partitionFunctionLog = source[`${prefix}PartitionFunctionLog`];
  if (!schema && !Number.isFinite(Number(partitionFunctionLog))) return null;
  return {
    schema: schema || null,
    backend: source[`${prefix}Backend`] || null,
    status: source[`${prefix}Status`] || null,
    partitionFunctionLog,
    groundOccupation: source[`${prefix}GroundOccupation`] ?? null,
    excitedOccupation: source[`${prefix}ExcitedOccupation`] ?? null,
    freeEnergyEv: source[`${prefix}FreeEnergyEv`] ?? null,
    internalEnergyEv: source[`${prefix}InternalEnergyEv`] ?? null,
    heatCapacityProxy: source[`${prefix}HeatCapacityProxy`] ?? null,
    entropyProxyKb: source[`${prefix}EntropyProxyKb`] ?? null,
    ionizationFraction: source[`${prefix}IonizationFraction`] ?? null,
    opacityPopulationProxy: source[`${prefix}OpacityPopulationProxy`] ?? null,
    degeneracyParameter: source[`${prefix}DegeneracyParameter`] ?? null,
    ensemblePressurePa: source[`${prefix}EnsemblePressurePa`] ?? null,
    sourceTerms: {
      temperatureDeltaKProxy: source[`${prefix}TemperatureDeltaKProxy`] ?? 0,
      chargeDeltaProxy: source[`${prefix}ChargeDeltaProxy`] ?? 0,
      thermalDampingScale: source[`${prefix}ThermalDampingScale`] ?? 1
    }
  };
}

function hasFiniteOrbitalStatisticalBridge(bridge = null) {
  return bridge
    && typeof bridge === 'object'
    && Number.isFinite(Number(bridge.partitionFunctionLog));
}

function isWebgpuOrbitalStatisticalBridge(bridge = null) {
  const schema = String(bridge?.schema || '').toLowerCase();
  const backend = String(bridge?.backend || bridge?.source || '').toLowerCase();
  return schema === QUANTUM_ORBITAL_GRID_STATISTICAL_BRIDGE_SCHEMA
    || schema.includes('statistical-bridge-webgpu')
    || backend.startsWith('webgpu');
}

function resolveOrbitalStatisticalBridgeCoupling({ finiteGrid = {}, envelope = {}, chemistry = {} } = {}) {
  const bridge = finiteGrid.statisticalBridge
    || chemistry.statisticalBridge
    || envelope.statisticalBridge
    || statisticalBridgeFromFlat(finiteGrid, 'statisticalBridge')
    || statisticalBridgeFromFlat(envelope, 'finiteGridStatisticalBridge')
    || statisticalBridgeFromFlat(envelope, 'statisticalBridge');
  if (!hasFiniteOrbitalStatisticalBridge(bridge)) {
    return {
      statisticalBridgeSchema: null,
      statisticalBridgeSource: 'unavailable',
      statisticalBridgeStatus: 'unavailable',
      statisticalBridgeBackend: null,
      statisticalBridgePartitionFunctionLog: 0,
      statisticalBridgeGroundOccupation: 0,
      statisticalBridgeExcitedOccupation: 0,
      statisticalBridgeFreeEnergyEv: 0,
      statisticalBridgeInternalEnergyEv: 0,
      statisticalBridgeHeatCapacityProxy: 0,
      statisticalBridgeEntropyProxyKb: 0,
      statisticalBridgeIonizationFraction: 0,
      statisticalBridgeOpacityPopulationProxy: 0,
      statisticalBridgeDegeneracyParameter: 0,
      statisticalBridgeEnsemblePressurePa: 0,
      statisticalBridgeTemperatureDeltaKProxy: 0,
      statisticalBridgeChargeDeltaProxy: 0,
      statisticalBridgeThermalDampingScale: 1,
      statisticalBridgeWebgpuExecuted: false,
      statisticalBridgeDrive: 0
    };
  }
  const webgpuExecuted = isWebgpuOrbitalStatisticalBridge(bridge);
  const sourceTerms = bridge.sourceTerms || {};
  const heatCapacityProxy = normalizeNumber(bridge.heatCapacityProxy, 0, 0, 64);
  const excitedOccupation = normalizeNumber(bridge.excitedOccupation, 0, 0, 1);
  const ionizationFraction = normalizeNumber(bridge.ionizationFraction, 0, 0, 1);
  const opacityPopulationProxy = normalizeNumber(bridge.opacityPopulationProxy, 0, 0, 64);
  const degeneracyParameter = normalizeNumber(bridge.degeneracyParameter, 0, 0, 128);
  const temperatureDeltaKProxy = normalizeNumber(sourceTerms.temperatureDeltaKProxy ?? bridge.temperatureDeltaKProxy, 0, -1000, 1000);
  const chargeDeltaProxy = normalizeNumber(sourceTerms.chargeDeltaProxy ?? bridge.chargeDeltaProxy, 0, -1, 1);
  const thermalDampingScale = normalizeNumber(sourceTerms.thermalDampingScale ?? bridge.thermalDampingScale, 1, 0.1, 4);
  const statisticalBridgeDrive = clamp(
    excitedOccupation * 0.025
      + ionizationFraction * 0.04
      + opacityPopulationProxy * 0.002
      + degeneracyParameter * 0.0006
      + Math.abs(temperatureDeltaKProxy) * 0.0002
      + Math.abs(chargeDeltaProxy) * 0.08,
    0,
    0.12
  );
  return {
    statisticalBridgeSchema: bridge.schema || null,
    statisticalBridgeSource: webgpuExecuted ? QUANTUM_SOURCE_WEBGPU_WORKER : QUANTUM_SOURCE_CPU_REFERENCE,
    statisticalBridgeStatus: bridge.status || 'unknown',
    statisticalBridgeBackend: bridge.backend || (webgpuExecuted ? 'webgpu-orbital-grid-wavefunction-evolution-reduction' : null),
    statisticalBridgePartitionFunctionLog: normalizeNumber(bridge.partitionFunctionLog, 0, -1e12, 1e12),
    statisticalBridgeGroundOccupation: normalizeNumber(bridge.groundOccupation, 0, 0, 1),
    statisticalBridgeExcitedOccupation: excitedOccupation,
    statisticalBridgeFreeEnergyEv: normalizeNumber(bridge.freeEnergyEv, 0, -1e12, 1e12),
    statisticalBridgeInternalEnergyEv: normalizeNumber(bridge.internalEnergyEv, 0, -1e12, 1e12),
    statisticalBridgeHeatCapacityProxy: heatCapacityProxy,
    statisticalBridgeEntropyProxyKb: normalizeNumber(bridge.entropyProxyKb, 0, 0, 128),
    statisticalBridgeIonizationFraction: ionizationFraction,
    statisticalBridgeOpacityPopulationProxy: opacityPopulationProxy,
    statisticalBridgeDegeneracyParameter: degeneracyParameter,
    statisticalBridgeEnsemblePressurePa: normalizeNumber(bridge.ensemblePressurePa, 0, 0, 1e18),
    statisticalBridgeTemperatureDeltaKProxy: temperatureDeltaKProxy,
    statisticalBridgeChargeDeltaProxy: chargeDeltaProxy,
    statisticalBridgeThermalDampingScale: thermalDampingScale,
    statisticalBridgeWebgpuExecuted: webgpuExecuted,
    statisticalBridgeDrive
  };
}

export function normalizeMolecularComposition(composition = null, {
  fallbackAtomCount = 72,
  minAtoms = 3,
  maxAtoms = 32768
} = {}) {
  const normalized = {};
  if (composition && typeof composition === 'object') {
    for (const [key, value] of Object.entries(composition)) {
      const symbol = normalizeElementKey(key);
      if (!symbol) continue;
      const count = normalizeInteger(value, 0, 0, maxAtoms);
      if (count > 0) normalized[symbol] = (normalized[symbol] || 0) + count;
    }
  }
  let total = Object.values(normalized).reduce((sum, count) => sum + count, 0);
  if (total < minAtoms) {
    return normalizeMolecularComposition(defaultCompositionForAtomCount(fallbackAtomCount), {
      fallbackAtomCount,
      minAtoms,
      maxAtoms
    });
  }
  if (total <= maxAtoms) return normalized;
  const scaled = {};
  let remaining = maxAtoms;
  for (const symbol of Object.keys(normalized)) {
    const count = Math.min(remaining, Math.max(0, Math.floor(normalized[symbol] * maxAtoms / total)));
    if (count > 0) scaled[symbol] = count;
    remaining -= count;
  }
  total = Object.values(scaled).reduce((sum, count) => sum + count, 0);
  if (total < minAtoms) return defaultCompositionForAtomCount(minAtoms);
  return scaled;
}

function pushMany(target, element, count) {
  for (let i = 0; i < count; i += 1) target.push(element);
}

function buildElementSequence(composition) {
  const remaining = new Map(
    Object.entries(composition)
      .map(([symbol, count]) => [symbol, normalizeInteger(count, 0, 0, 32768)])
      .filter(([, count]) => count > 0)
  );
  const sequence = [];
  const consume = (symbol, count = 1) => {
    const current = remaining.get(symbol) || 0;
    if (current < count) return false;
    remaining.set(symbol, current - count);
    return true;
  };

  while ((remaining.get('O') || 0) > 0 && (remaining.get('H') || 0) >= 2) {
    consume('O');
    consume('H', 2);
    sequence.push(ELEMENT.O, ELEMENT.H, ELEMENT.H);
  }
  while ((remaining.get('C') || 0) > 0 && (remaining.get('O') || 0) >= 2) {
    consume('C');
    consume('O', 2);
    sequence.push(ELEMENT.C, ELEMENT.O, ELEMENT.O);
  }
  while ((remaining.get('C') || 0) > 0 && (remaining.get('H') || 0) >= 4) {
    consume('C');
    consume('H', 4);
    sequence.push(ELEMENT.C, ELEMENT.H, ELEMENT.H, ELEMENT.H, ELEMENT.H);
  }
  while ((remaining.get('Na') || 0) > 0 && (remaining.get('Cl') || 0) > 0) {
    consume('Na');
    consume('Cl');
    sequence.push(ELEMENT.Na, ELEMENT.Cl);
  }

  const rest = [...remaining.entries()]
    .filter(([, count]) => count > 0)
    .sort(([a], [b]) => (ELEMENT[a] || 999) - (ELEMENT[b] || 999));
  for (const [symbol, count] of rest) {
    pushMany(sequence, ELEMENT[symbol], count);
  }
  return sequence;
}

function elementForIndex(index, sequence = null) {
  if (sequence?.length) return sequence[index % sequence.length];
  const pattern = [ELEMENT.O, ELEMENT.H, ELEMENT.H];
  return pattern[index % pattern.length];
}

function hasElementPattern(sequence, start, pattern) {
  if (start + pattern.length > sequence.length) return false;
  return pattern.every((element, offset) => sequence[start + offset] === element);
}

function buildInitialMoleculeGroups(sequence) {
  const groups = [];
  for (let index = 0; index < sequence.length;) {
    if (hasElementPattern(sequence, index, [ELEMENT.O, ELEMENT.H, ELEMENT.H])) {
      groups.push({ start: index, size: 3, type: 'water' });
      index += 3;
    } else if (hasElementPattern(sequence, index, [ELEMENT.C, ELEMENT.O, ELEMENT.O])) {
      groups.push({ start: index, size: 3, type: 'carbon-dioxide' });
      index += 3;
    } else if (hasElementPattern(sequence, index, [ELEMENT.C, ELEMENT.H, ELEMENT.H, ELEMENT.H, ELEMENT.H])) {
      groups.push({ start: index, size: 5, type: 'methane' });
      index += 5;
    } else if (hasElementPattern(sequence, index, [ELEMENT.Na, ELEMENT.Cl])) {
      groups.push({ start: index, size: 2, type: 'salt' });
      index += 2;
    } else {
      groups.push({ start: index, size: 1, type: 'atom' });
      index += 1;
    }
  }
  return groups;
}

function initialMoleculeOffsets(type) {
  if (type === 'water') {
    return [
      [0, 0, 0],
      [0.086, 0.066, 0.008],
      [-0.086, 0.066, -0.008]
    ];
  }
  if (type === 'carbon-dioxide') {
    return [
      [0, 0, 0],
      [0.076, 0, 0],
      [-0.076, 0, 0]
    ];
  }
  if (type === 'methane') {
    return [
      [0, 0, 0],
      [0.092, 0, 0],
      [-0.092, 0, 0],
      [0, 0.092, 0.074],
      [0, -0.092, -0.074]
    ];
  }
  if (type === 'salt') {
    return [
      [0, 0, 0],
      [0.19, 0, 0]
    ];
  }
  return [[0, 0, 0]];
}

function initialGroupSpacing(groups) {
  if (groups.some((group) => group.type === 'salt')) return 0.66;
  if (groups.some((group) => group.size > 3 || group.type === 'carbon-dioxide')) return 0.48;
  return 0.42;
}

function initialGroupCenter(groupIndex, groupCount, spacing) {
  const columns = Math.max(1, Math.ceil(Math.sqrt(groupCount)));
  const rows = Math.max(1, Math.ceil(groupCount / columns));
  const column = groupIndex % columns;
  const row = Math.floor(groupIndex / columns);
  return {
    x: (column - (columns - 1) * 0.5) * spacing,
    y: (row - (rows - 1) * 0.5) * spacing,
    z: ((groupIndex % 5) - 2) * 0.035
  };
}

function getExecutionContext() {
  if (globalThis.WorkerGlobalScope && globalThis.self instanceof globalThis.WorkerGlobalScope) {
    return 'dedicated-worker';
  }
  return 'main-thread-or-node';
}

function cloneState(state) {
  return {
    schema: MOLECULAR_DYNAMICS_STATE_SCHEMA,
    atomCount: state.atomCount,
    sequence: state.sequence || 0,
    elapsedTime: state.elapsedTime || 0,
    reactionProgress: Number(state.reactionProgress || 0),
    positionsX: Array.from(state.positionsX || []),
    positionsY: Array.from(state.positionsY || []),
    positionsZ: Array.from(state.positionsZ || []),
    velocitiesX: Array.from(state.velocitiesX || []),
    velocitiesY: Array.from(state.velocitiesY || []),
	    velocitiesZ: Array.from(state.velocitiesZ || []),
	    massesAmu: Array.from(state.massesAmu || []),
	    elementZ: Array.from(state.elementZ || []),
	    moleculeGroupId: Array.from(state.moleculeGroupId || []),
	    moleculeGroupType: Array.from(state.moleculeGroupType || []),
	    moleculeLocalIndex: Array.from(state.moleculeLocalIndex || []),
	    requestedComposition: { ...(state.requestedComposition || {}) },
    quantumCoupling: normalizeMolecularQuantumCoupling(state.quantumCoupling),
    quantumCouplingApplication: state.quantumCouplingApplication?.schema === MOLECULAR_QUANTUM_SOURCE_SCHEMA
      ? {
        ...state.quantumCouplingApplication,
        coupling: normalizeMolecularQuantumCoupling(state.quantumCouplingApplication.coupling)
      }
      : null,
    quantumMaterialSource: state.quantumMaterialSource?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
      ? cloneQuantumMaterialSource(state.quantumMaterialSource)
      : normalizeMolecularQuantumMaterialSource(null),
    ulgStateDeltaSource: state.ulgStateDeltaSource?.schema === MOLECULAR_ULG_STATE_SOURCE_SCHEMA
      ? {
        ...state.ulgStateDeltaSource,
        channelUpdates: Array.isArray(state.ulgStateDeltaSource.channelUpdates)
          ? state.ulgStateDeltaSource.channelUpdates.map((update) => ({ ...update }))
          : []
      }
      : null,
    chargeEquilibration: state.chargeEquilibration?.schema === MOLECULAR_CHARGE_EQUILIBRATION_SCHEMA
      ? { ...state.chargeEquilibration }
      : null,
    quantumMaterialProductTopologyMutation: state.quantumMaterialProductTopologyMutation?.schema === MOLECULAR_QMAT_PRODUCT_TOPOLOGY_MUTATION_SCHEMA
      ? {
        ...state.quantumMaterialProductTopologyMutation,
        validity: state.quantumMaterialProductTopologyMutation.validity
          ? {
            ...state.quantumMaterialProductTopologyMutation.validity,
            warnings: Array.isArray(state.quantumMaterialProductTopologyMutation.validity.warnings)
              ? [...state.quantumMaterialProductTopologyMutation.validity.warnings]
              : []
          }
          : undefined
      }
      : null,
    partialCharge: Array.from(state.partialCharge || []),
    temperatureK: Array.from(state.temperatureK || []),
    bondA: Array.from(state.bondA || []),
    bondB: Array.from(state.bondB || []),
    bondOrder: Array.from(state.bondOrder || [])
  };
}

function attachBondState(state, bonds) {
  state.bondA = bonds.map((bond) => bond.a);
  state.bondB = bonds.map((bond) => bond.b);
  state.bondOrder = bonds.map((bond) => bond.order);
  return state;
}

function compositionFromState(state) {
  const composition = {};
  for (let i = 0; i < state.atomCount; i += 1) {
    const symbol = symbolForElement(state.elementZ[i]);
    if (symbol === 'other') continue;
    composition[symbol] = (composition[symbol] || 0) + 1;
  }
  return composition;
}

function mergeCompositions(base = {}, additions = {}) {
  const merged = { ...base };
  for (const [symbol, count] of Object.entries(additions || {})) {
    const normalized = normalizeElementKey(symbol);
    if (!normalized) continue;
    merged[normalized] = (merged[normalized] || 0) + normalizeInteger(count, 0, 0, 32768);
    if (merged[normalized] <= 0) delete merged[normalized];
  }
  return merged;
}

export function makeMolecularDynamicsInitialState({
  atomCount = 72,
  seed = 20260529,
  environment = {},
  coupling = {},
  composition = null
} = {}) {
  const requestedComposition = normalizeMolecularComposition(composition, {
    fallbackAtomCount: atomCount
  });
  const elementSequence = buildElementSequence(requestedComposition);
  const count = normalizeInteger(elementSequence.length || atomCount, 72, 3, 32768);
  const rng = makeRng(seed);
  const positionsX = new Array(count);
  const positionsY = new Array(count);
  const positionsZ = new Array(count);
  const velocitiesX = new Array(count);
  const velocitiesY = new Array(count);
  const velocitiesZ = new Array(count);
  const massesAmu = new Array(count);
	  const elementZ = new Array(count);
	  const moleculeGroupId = new Array(count);
	  const moleculeGroupType = new Array(count);
	  const moleculeLocalIndex = new Array(count);
	  const partialCharge = new Array(count);
  const temperatureK = new Array(count);
  const ambientTemperature = normalizeNumber(environment.ambientTemperatureK, 294, 1, 250000);
  const fireIntensity = normalizeNumber(coupling.fireIntensity, 0.1, 0, 3);
  const quantumCoupling = normalizeMolecularQuantumCoupling(coupling.quantumOrbital ?? coupling.quantumOrbitalClosure);
  const quantumMaterialSource = normalizeMolecularQuantumMaterialSource(
    coupling.quantumMaterialPotential,
    coupling.quantumMaterialPotentialClosure
  );
  const groups = buildInitialMoleculeGroups(elementSequence);
  const spacing = initialGroupSpacing(groups);
  for (let groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
	    const group = groups[groupIndex];
	    const center = initialGroupCenter(groupIndex, groups.length, spacing);
	    const offsets = initialMoleculeOffsets(group.type);
	    const groupTypeCode = moleculeGroupTypeCode(group.type);
	    const orientation = rng() * Math.PI * 2 + groupIndex * 0.37;
    const cos = Math.cos(orientation);
    const sin = Math.sin(orientation);
    for (let local = 0; local < group.size; local += 1) {
      const i = group.start + local;
      const element = elementForIndex(i, elementSequence);
      const offset = offsets[local] || [0, 0, 0];
      const ox = offset[0] * cos - offset[1] * sin;
      const oy = offset[0] * sin + offset[1] * cos;
      const jitter = group.type === 'atom' ? 0.022 : 0.006;
      positionsX[i] = center.x + ox + (rng() - 0.5) * jitter;
      positionsY[i] = center.y + oy + (rng() - 0.5) * jitter;
      positionsZ[i] = center.z + offset[2] + (rng() - 0.5) * jitter;
      velocitiesX[i] = (rng() - 0.5) * 0.018;
      velocitiesY[i] = (rng() - 0.5) * 0.018;
      velocitiesZ[i] = (rng() - 0.5) * 0.018;
	      massesAmu[i] = massForElement(element);
	      elementZ[i] = element;
	      moleculeGroupId[i] = group.type === 'atom' ? -1 : groupIndex;
	      moleculeGroupType[i] = groupTypeCode;
	      moleculeLocalIndex[i] = local;
	      partialCharge[i] = initialChargeForElement(element, quantumCoupling);
      temperatureK[i] = ambientTemperature + fireIntensity * 40 + rng() * 12;
    }
  }
  const state = {
    schema: MOLECULAR_DYNAMICS_STATE_SCHEMA,
    atomCount: count,
    sequence: 0,
    elapsedTime: 0,
    reactionProgress: normalizeNumber(coupling.reactionProgress, 0.18, 0, 1),
    requestedComposition,
    quantumCoupling,
    quantumMaterialSource,
    positionsX,
    positionsY,
    positionsZ,
    velocitiesX,
    velocitiesY,
    velocitiesZ,
	    massesAmu,
	    elementZ,
	    moleculeGroupId,
	    moleculeGroupType,
	    moleculeLocalIndex,
	    partialCharge,
    temperatureK,
    bondA: [],
    bondB: [],
    bondOrder: []
  };
  equilibratePartialCharges(state);
  const diagnostics = computeMolecularDynamicsDiagnostics(state);
  return attachBondState(state, diagnostics.bonds);
}

function preferredAnchorElements(element) {
  if (element === ELEMENT.H) return [ELEMENT.O, ELEMENT.N, ELEMENT.C, ELEMENT.S, ELEMENT.Cl];
  if (element === ELEMENT.O) return [ELEMENT.H, ELEMENT.C, ELEMENT.Na, ELEMENT.K, ELEMENT.Mg, ELEMENT.Ca, ELEMENT.Fe];
  if (element === ELEMENT.C) return [ELEMENT.H, ELEMENT.O, ELEMENT.N, ELEMENT.S];
  if (element === ELEMENT.N) return [ELEMENT.H, ELEMENT.C, ELEMENT.O];
  if (element === ELEMENT.Cl || element === ELEMENT.F) return [ELEMENT.Na, ELEMENT.K, ELEMENT.Mg, ELEMENT.Ca, ELEMENT.H];
  if (element === ELEMENT.Na || element === ELEMENT.K) return [ELEMENT.Cl, ELEMENT.F, ELEMENT.O];
  if (element === ELEMENT.Mg || element === ELEMENT.Ca || element === ELEMENT.Fe) return [ELEMENT.O, ELEMENT.Cl, ELEMENT.F, ELEMENT.S];
  return [ELEMENT.H, ELEMENT.O, ELEMENT.C, ELEMENT.N, ELEMENT.Cl];
}

function bondValenceCost(order, maxA, maxB) {
  return order >= 1.1 && maxA > 1 && maxB > 1 ? 2 : 1;
}

function buildValenceUsage(state) {
  const usage = new Array(state.atomCount).fill(0);
  const bonds = inferBonds(state);
  for (const bond of bonds) {
    const maxA = valenceForElement(state.elementZ[bond.a]);
    const maxB = valenceForElement(state.elementZ[bond.b]);
    const cost = bondValenceCost(bond.order, maxA, maxB);
    usage[bond.a] += cost;
    usage[bond.b] += cost;
  }
  return usage;
}

function findAppendAnchor(state, element) {
  const valenceUsage = buildValenceUsage(state);
  const preferred = preferredAnchorElements(element);
  const scoreAnchor = (index) => {
    const max = valenceForElement(state.elementZ[index]);
    const usage = valenceUsage[index] || 0;
    if (usage >= max) return Infinity;
    const elementScore = preferred.includes(state.elementZ[index]) ? preferred.indexOf(state.elementZ[index]) : preferred.length + 1;
    return elementScore * 100 + usage / Math.max(1, max) + index * 0.0001;
  };
  let bestIndex = -1;
  let bestScore = Infinity;
  for (let i = 0; i < state.atomCount; i += 1) {
    const score = scoreAnchor(i);
    if (score < bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }
  return Number.isFinite(bestScore) ? bestIndex : -1;
}

function appendPlacementForAtom(state, element, atomIndex, rng) {
  const anchor = findAppendAnchor(state, element);
  if (anchor >= 0) {
    const anchorElement = state.elementZ[anchor];
    const distance = Math.min(0.22, Math.max(0.078, (covalentRadius(element) + covalentRadius(anchorElement)) * 1.1));
    const angle = atomIndex * 2.399963229728653 + rng() * 0.35;
    const vertical = ((atomIndex % 5) - 2) * 0.018;
    return {
      x: state.positionsX[anchor] + Math.cos(angle) * distance,
      y: state.positionsY[anchor] + Math.sin(angle) * distance,
      z: state.positionsZ[anchor] + vertical,
      vx: state.velocitiesX[anchor] + (rng() - 0.5) * 0.012,
      vy: state.velocitiesY[anchor] + (rng() - 0.5) * 0.012,
      vz: state.velocitiesZ[anchor] + (rng() - 0.5) * 0.012
    };
  }

  const angle = atomIndex * 2.399963229728653 + rng() * 0.5;
  const radius = Math.min(1.55, 0.42 + (atomIndex % 31) * 0.028);
  return {
    x: Math.cos(angle) * radius + (rng() - 0.5) * 0.03,
    y: Math.sin(angle) * radius + (rng() - 0.5) * 0.03,
    z: ((atomIndex % 7) - 3) * 0.04 + (rng() - 0.5) * 0.02,
    vx: (rng() - 0.5) * 0.018,
    vy: (rng() - 0.5) * 0.018,
    vz: (rng() - 0.5) * 0.018
  };
}

export function appendMolecularAtomsToState(baseState = {}, {
  composition = {},
  seed = 20260529,
  environment = {},
  coupling = {}
} = {}) {
  const source = normalizeState(baseState);
  const additions = normalizeMolecularComposition(composition, {
    fallbackAtomCount: 1,
    minAtoms: 1,
    maxAtoms: Math.max(1, 32768 - source.atomCount)
  });
  const sequence = buildElementSequence(additions);
  if (!sequence.length || source.atomCount >= 32768) return source;

  const rng = makeRng(seed + source.atomCount * 17 + sequence.length * 131);
  const state = cloneState(source);
  const ambientTemperature = normalizeNumber(environment.ambientTemperatureK, 294, 1, 250000);
  const fireIntensity = normalizeNumber(coupling.fireIntensity, 0.1, 0, 3);
  const quantumCoupling = normalizeMolecularQuantumCoupling(coupling.quantumOrbital ?? coupling.quantumOrbitalClosure ?? source.quantumCoupling);
  const quantumMaterialSource = normalizeMolecularQuantumMaterialSource(
    coupling.quantumMaterialPotential ?? source.quantumMaterialSource,
    coupling.quantumMaterialPotentialClosure
  );
  state.quantumCoupling = quantumCoupling;
  state.quantumMaterialSource = quantumMaterialSource;
	  const addCount = Math.min(sequence.length, 32768 - state.atomCount);
	  const start = state.atomCount;
	  if (!Array.isArray(state.moleculeGroupId) || state.moleculeGroupId.length < state.atomCount) {
	    state.moleculeGroupId = Array.from({ length: state.atomCount }, (_, index) => normalizeInteger(state.moleculeGroupId?.[index], -1, -1, 32768));
	  }
	  if (!Array.isArray(state.moleculeGroupType) || state.moleculeGroupType.length < state.atomCount) {
	    state.moleculeGroupType = Array.from({ length: state.atomCount }, (_, index) => normalizeInteger(state.moleculeGroupType?.[index], 0, 0, 32));
	  }
	  if (!Array.isArray(state.moleculeLocalIndex) || state.moleculeLocalIndex.length < state.atomCount) {
	    state.moleculeLocalIndex = Array.from({ length: state.atomCount }, (_, index) => normalizeInteger(state.moleculeLocalIndex?.[index], 0, 0, 128));
	  }

	  for (let local = 0; local < addCount; local += 1) {
    const element = sequence[local];
    const placement = appendPlacementForAtom(state, element, start + local, rng);
    state.positionsX.push(placement.x);
    state.positionsY.push(placement.y);
    state.positionsZ.push(placement.z);
    state.velocitiesX.push(placement.vx);
    state.velocitiesY.push(placement.vy);
    state.velocitiesZ.push(placement.vz);
	    state.massesAmu.push(massForElement(element));
	    state.elementZ.push(element);
	    state.moleculeGroupId.push(-1);
	    state.moleculeGroupType.push(MOLECULE_GROUP_TYPE.atom);
	    state.moleculeLocalIndex.push(0);
	    state.partialCharge.push(initialChargeForElement(element, quantumCoupling));
    state.temperatureK.push(ambientTemperature + fireIntensity * 40 + rng() * 12);
    state.atomCount += 1;
  }

  state.requestedComposition = mergeCompositions(
    source.requestedComposition && Object.keys(source.requestedComposition).length > 0
      ? source.requestedComposition
      : compositionFromState(source),
    additions
  );
  equilibratePartialCharges(state);
  const diagnostics = computeMolecularDynamicsDiagnostics(state);
  return attachBondState(state, diagnostics.bonds);
}

function normalizeState(input = {}) {
  const source = input.state || input;
  if (!source.positionsX || !source.positionsY || !source.positionsZ || !source.elementZ) {
    return makeMolecularDynamicsInitialState({
      atomCount: input.atomCount || input.count,
      seed: input.seed,
      environment: input.environment,
      coupling: input.coupling,
      composition: input.composition
    });
  }
  const count = normalizeInteger(source.atomCount || source.positionsX.length, source.positionsX.length || 3, 3, 32768);
  const state = {
    schema: MOLECULAR_DYNAMICS_STATE_SCHEMA,
    atomCount: count,
    sequence: normalizeInteger(source.sequence, 0, 0, Number.MAX_SAFE_INTEGER),
    elapsedTime: normalizeNumber(source.elapsedTime, 0, 0, Number.MAX_SAFE_INTEGER),
    reactionProgress: normalizeNumber(source.reactionProgress, 0.18, 0, 1),
    requestedComposition: normalizeMolecularComposition(source.requestedComposition || input.composition, {
      fallbackAtomCount: count
    }),
    quantumCoupling: normalizeMolecularQuantumCoupling(source.quantumCoupling || input.coupling?.quantumOrbital || input.coupling?.quantumOrbitalClosure),
    quantumCouplingApplication: source.quantumCouplingApplication?.schema === MOLECULAR_QUANTUM_SOURCE_SCHEMA
      ? {
        ...source.quantumCouplingApplication,
        coupling: normalizeMolecularQuantumCoupling(source.quantumCouplingApplication.coupling)
      }
      : null,
    quantumMaterialSource: source.quantumMaterialSource?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
      ? cloneQuantumMaterialSource(source.quantumMaterialSource)
      : normalizeMolecularQuantumMaterialSource(
        input.coupling?.quantumMaterialPotential
          ?? input.coupling?.quantumMaterialPotentialClosure
          ?? input.quantumMaterialPotential
          ?? input.quantumMaterialPotentialClosure
          ?? input.closureResults?.quantumMaterialPotential
      ),
    ulgStateDeltaSource: source.ulgStateDeltaSource?.schema === MOLECULAR_ULG_STATE_SOURCE_SCHEMA
      ? {
        ...source.ulgStateDeltaSource,
        channelUpdates: Array.isArray(source.ulgStateDeltaSource.channelUpdates)
          ? source.ulgStateDeltaSource.channelUpdates.map((update) => ({ ...update }))
          : []
      }
      : null,
    chargeEquilibration: source.chargeEquilibration?.schema === MOLECULAR_CHARGE_EQUILIBRATION_SCHEMA
      ? { ...source.chargeEquilibration }
      : null,
    quantumMaterialProductTopologyMutation: source.quantumMaterialProductTopologyMutation?.schema === MOLECULAR_QMAT_PRODUCT_TOPOLOGY_MUTATION_SCHEMA
      ? { ...source.quantumMaterialProductTopologyMutation }
      : null,
    positionsX: new Array(count),
    positionsY: new Array(count),
    positionsZ: new Array(count),
    velocitiesX: new Array(count),
    velocitiesY: new Array(count),
    velocitiesZ: new Array(count),
	    massesAmu: new Array(count),
	    elementZ: new Array(count),
	    moleculeGroupId: new Array(count),
	    moleculeGroupType: new Array(count),
	    moleculeLocalIndex: new Array(count),
	    partialCharge: new Array(count),
    temperatureK: new Array(count),
    bondA: [],
    bondB: [],
    bondOrder: []
  };
  for (let i = 0; i < count; i += 1) {
    const element = normalizeInteger(source.elementZ?.[i], elementForIndex(i), 1, 118);
    state.positionsX[i] = normalizeNumber(source.positionsX?.[i], 0, -10, 10);
    state.positionsY[i] = normalizeNumber(source.positionsY?.[i], 0, -10, 10);
    state.positionsZ[i] = normalizeNumber(source.positionsZ?.[i], 0, -10, 10);
    state.velocitiesX[i] = normalizeNumber(source.velocitiesX?.[i], 0, -100, 100);
    state.velocitiesY[i] = normalizeNumber(source.velocitiesY?.[i], 0, -100, 100);
    state.velocitiesZ[i] = normalizeNumber(source.velocitiesZ?.[i], 0, -100, 100);
	    state.massesAmu[i] = normalizeNumber(source.massesAmu?.[i], massForElement(element), 0.1, 300);
	    state.elementZ[i] = element;
	    state.moleculeGroupId[i] = normalizeInteger(source.moleculeGroupId?.[i], -1, -1, 32768);
	    state.moleculeGroupType[i] = normalizeInteger(source.moleculeGroupType?.[i], MOLECULE_GROUP_TYPE.atom, 0, 32);
	    state.moleculeLocalIndex[i] = normalizeInteger(source.moleculeLocalIndex?.[i], 0, 0, 128);
	    state.partialCharge[i] = normalizeNumber(source.partialCharge?.[i], 0, -4, 4);
    state.temperatureK[i] = normalizeNumber(source.temperatureK?.[i], 294, 1, 250000);
  }
  const diagnostics = computeMolecularDynamicsDiagnostics(state);
  return attachBondState(state, diagnostics.bonds);
}

function atomDataFromState(state) {
  const data = new Float32Array(state.atomCount * ATOM_FLOATS);
  for (let i = 0; i < state.atomCount; i += 1) {
    const base = i * ATOM_FLOATS;
    data[base + 0] = state.positionsX[i];
    data[base + 1] = state.positionsY[i];
    data[base + 2] = state.positionsZ[i];
    data[base + 3] = state.velocitiesX[i];
    data[base + 4] = state.velocitiesY[i];
    data[base + 5] = state.velocitiesZ[i];
    data[base + 6] = state.massesAmu[i];
    data[base + 7] = state.elementZ[i];
    data[base + 8] = state.partialCharge[i];
    data[base + 9] = state.temperatureK[i];
    data[base + ATOM_TOPOLOGY_GROUP_ID_OFFSET] = normalizeInteger(state.moleculeGroupId?.[i], -1, -1, 32768);
    data[base + ATOM_TOPOLOGY_GROUP_TYPE_OFFSET] = normalizeInteger(
      state.moleculeGroupType?.[i],
      MOLECULE_GROUP_TYPE.atom,
      0,
      32
    );
    data[base + ATOM_TOPOLOGY_LOCAL_INDEX_OFFSET] = normalizeInteger(state.moleculeLocalIndex?.[i], 0, 0, 128);
  }
  return data;
}

function applyAtomDataToState(state, data) {
  for (let i = 0; i < state.atomCount; i += 1) {
    const base = i * ATOM_FLOATS;
    state.positionsX[i] = data[base + 0];
    state.positionsY[i] = data[base + 1];
    state.positionsZ[i] = data[base + 2];
    state.velocitiesX[i] = data[base + 3];
    state.velocitiesY[i] = data[base + 4];
    state.velocitiesZ[i] = data[base + 5];
    state.massesAmu[i] = data[base + 6];
    state.elementZ[i] = Math.round(data[base + 7]);
    state.partialCharge[i] = data[base + 8];
    state.temperatureK[i] = data[base + 9];
    state.moleculeGroupId[i] = normalizeInteger(
      Math.round(data[base + ATOM_TOPOLOGY_GROUP_ID_OFFSET]),
      state.moleculeGroupId?.[i] ?? -1,
      -1,
      32768
    );
    state.moleculeGroupType[i] = normalizeInteger(
      Math.round(data[base + ATOM_TOPOLOGY_GROUP_TYPE_OFFSET]),
      state.moleculeGroupType?.[i] ?? MOLECULE_GROUP_TYPE.atom,
      0,
      32
    );
    state.moleculeLocalIndex[i] = normalizeInteger(
      Math.round(data[base + ATOM_TOPOLOGY_LOCAL_INDEX_OFFSET]),
      state.moleculeLocalIndex?.[i] ?? 0,
      0,
      128
    );
  }
}

function bondThreshold(a, b) {
  return clamp(molecularPairRestLengthReducedNm(a, b) * 1.84, 0.11, 0.56);
}

function uniqueElementsForState(state) {
  const elements = new Set();
  for (let i = 0; i < state.atomCount; i += 1) {
    elements.add(state.elementZ[i]);
  }
  return [...elements];
}

function maxBondThresholdForState(state) {
  const elements = uniqueElementsForState(state);
  let radius = 0.22;
  for (const a of elements) {
    for (const b of elements) {
      radius = Math.max(radius, bondThreshold(a, b));
    }
  }
  return radius;
}

function spatialCellKey(cx, cy, cz) {
  return `${cx}:${cy}:${cz}`;
}

function buildSpatialCellIndex(state, cellSize = MOLECULAR_DYNAMICS_CELL_SIZE) {
  const cells = new Map();
  for (let i = 0; i < state.atomCount; i += 1) {
    const cx = Math.floor(state.positionsX[i] / cellSize);
    const cy = Math.floor(state.positionsY[i] / cellSize);
    const cz = Math.floor(state.positionsZ[i] / cellSize);
    const key = spatialCellKey(cx, cy, cz);
    let cell = cells.get(key);
    if (!cell) {
      cell = { cx, cy, cz, indices: [] };
      cells.set(key, cell);
    }
    cell.indices.push(i);
  }
  return cells;
}

function forEachSpatialCandidatePair(state, {
  searchRadius = maxBondThresholdForState(state),
  cellSize = MOLECULAR_DYNAMICS_CELL_SIZE,
  callback
} = {}) {
  const cells = buildSpatialCellIndex(state, cellSize);
  const cellSpan = Math.max(1, Math.ceil(searchRadius / cellSize));
  let pairCount = 0;
  for (const cell of cells.values()) {
    for (let dz = -cellSpan; dz <= cellSpan; dz += 1) {
      for (let dy = -cellSpan; dy <= cellSpan; dy += 1) {
        for (let dx = -cellSpan; dx <= cellSpan; dx += 1) {
          const neighbor = cells.get(spatialCellKey(cell.cx + dx, cell.cy + dy, cell.cz + dz));
          if (!neighbor) continue;
          for (const i of cell.indices) {
            for (const j of neighbor.indices) {
              if (j <= i) continue;
              pairCount += 1;
              callback?.(i, j);
            }
          }
        }
      }
    }
  }
  return {
    mode: 'cell-list',
    pairCount,
    cellCount: cells.size,
    cellSize,
    searchRadius
  };
}

function inferBondSelection(state) {
  const searchRadius = maxBondThresholdForState(state);
  const quantumCoupling = quantumCouplingForState(state);
  const quantumMaterialSource = quantumMaterialSourceForState(state);
  const candidates = [];
  let reactionBarrierGatedCandidateCount = 0;
  let reactionBarrierSuppressedCandidateCount = 0;
  let reactionBarrierDampingSum = 0;
  const productTopologyOverlay = createQuantumMaterialProductTopologyOverlay(state, quantumMaterialSource);
  if (productTopologyOverlay.applied === true) {
    for (const bond of productTopologyOverlay.bonds) {
      candidates.push({
        a: bond.a,
        b: bond.b,
        order: bond.order,
        distance: bond.distance,
        priority: Number(bond.priority || 9),
        productTopology: true,
        productFormula: bond.productFormula || null,
        source: bond.source || 'qmat-product-topology-overlay'
      });
    }
  }
  const pairSearch = forEachSpatialCandidatePair(state, {
    searchRadius,
    callback: (i, j) => {
      const dx = state.positionsX[j] - state.positionsX[i];
	      const dy = state.positionsY[j] - state.positionsY[i];
	      const dz = state.positionsZ[j] - state.positionsZ[i];
	      const distance = Math.hypot(dx, dy, dz);
	      const threshold = bondThreshold(state.elementZ[i], state.elementZ[j]);
	      const preserveSeededWater = seededWaterTopologyShouldHold(state, i, j, quantumMaterialSource);
	      const effectiveThreshold = preserveSeededWater ? Math.max(threshold, 0.27) : threshold;
	      if (distance < effectiveThreshold) {
	        const thermalPenalty = clamp(((state.temperatureK[i] + state.temperatureK[j]) * 0.5 - 900) / 2800, 0, 0.8);
	        const chargeAssist = clamp(Math.abs(state.partialCharge[i] - state.partialCharge[j]) * 0.08, 0, 0.18);
	        const heteroBonus = state.elementZ[i] === state.elementZ[j] ? 0 : 0.12;
        const adjustmentA = quantumAdjustmentForElement(state.elementZ[i], quantumCoupling);
        const adjustmentB = quantumAdjustmentForElement(state.elementZ[j], quantumCoupling);
        const quantumBondScale = Math.sqrt(adjustmentA.bondOrderScale * adjustmentB.bondOrderScale);
        const quantumPriority = (adjustmentA.active || adjustmentB.active)
          ? (adjustmentA.confidence + adjustmentB.confidence) * 0.025
          : 0;
        const rawOrder = clamp(((1 - distance / threshold) * 1.6 + chargeAssist - thermalPenalty) * quantumBondScale, 0.02, 2);
        const reactionBarrierDamping = reactionBarrierDampingForPair(state.elementZ[i], state.elementZ[j], quantumMaterialSource);
	        if (reactionBarrierDamping < 0.999) {
	          reactionBarrierGatedCandidateCount += 1;
	          reactionBarrierDampingSum += reactionBarrierDamping;
	        }
	        const seededWaterOrder = preserveSeededWater
	          ? clamp(1.02 - thermalPenalty * 0.45, 0.42, 1.12)
	          : 0;
	        const order = clamp(Math.max(rawOrder * reactionBarrierDamping, seededWaterOrder), 0.02, 2);
	        if (rawOrder >= 0.08 && order < 0.08) reactionBarrierSuppressedCandidateCount += 1;
	        candidates.push({
	          a: i,
	          b: j,
	          order,
	          distance,
	          priority: order + heteroBonus + quantumPriority + (preserveSeededWater ? 2.6 : 0)
	        });
	      }
    }
  });
  candidates.sort((a, b) => b.priority - a.priority || a.distance - b.distance);
  const valenceUsage = new Array(state.atomCount).fill(0);
  const bonds = [];
  for (const candidate of candidates) {
    const maxA = valenceForElement(state.elementZ[candidate.a]);
    const maxB = valenceForElement(state.elementZ[candidate.b]);
    const valenceCost = bondValenceCost(candidate.order, maxA, maxB);
    if (valenceUsage[candidate.a] + valenceCost > maxA || valenceUsage[candidate.b] + valenceCost > maxB) continue;
    bonds.push({
      a: candidate.a,
      b: candidate.b,
      elementA: symbolForElement(state.elementZ[candidate.a]),
      elementB: symbolForElement(state.elementZ[candidate.b]),
      order: candidate.order,
      distance: candidate.distance,
      productTopology: candidate.productTopology === true,
      productFormula: candidate.productFormula || null,
      source: candidate.source || null
    });
    valenceUsage[candidate.a] += valenceCost;
    valenceUsage[candidate.b] += valenceCost;
    if (bonds.length >= MOLECULAR_DYNAMICS_MAX_BONDS) break;
  }
  return {
    bonds,
    pairSearch,
    bondCandidateCount: candidates.length,
    productTopologyOverlay,
    productTopologyOverlayApplied: productTopologyOverlay.applied === true,
    productTopologyOverlayBondCount: productTopologyOverlay.bonds.length,
    reactionBarrierGatedCandidateCount,
    reactionBarrierSuppressedCandidateCount,
    reactionBarrierMeanDamping: reactionBarrierGatedCandidateCount > 0
      ? reactionBarrierDampingSum / reactionBarrierGatedCandidateCount
      : 1
  };
}

function inferBonds(state) {
  return inferBondSelection(state).bonds;
}

function summarizeChargeArray(charges = []) {
  let totalCharge = 0;
  let meanAbsCharge = 0;
  let sumSquared = 0;
  let maxAbsCharge = 0;
  for (const chargeValue of charges) {
    const charge = Number(chargeValue);
    if (!Number.isFinite(charge)) continue;
    totalCharge += charge;
    meanAbsCharge += Math.abs(charge);
    sumSquared += charge * charge;
    maxAbsCharge = Math.max(maxAbsCharge, Math.abs(charge));
  }
  const count = Math.max(1, charges.length);
  return {
    totalCharge,
    meanAbsCharge: meanAbsCharge / count,
    rmsCharge: Math.sqrt(sumSquared / count),
    maxAbsCharge
  };
}

function neutralizeClampedCharges(charges, minCharge = -1.4, maxCharge = 1.4) {
  let totalCorrection = 0;
  let residualCharge = charges.reduce((sum, charge) => sum + Number(charge || 0), 0);
  for (let pass = 0; pass < 8 && Math.abs(residualCharge) > 1e-9; pass += 1) {
    const sign = residualCharge > 0 ? -1 : 1;
    const capacity = charges.reduce((sum, charge) => {
      const available = sign < 0 ? Math.max(0, charge - minCharge) : Math.max(0, maxCharge - charge);
      return sum + available;
    }, 0);
    if (capacity <= 1e-12) break;
    const correctionMagnitude = Math.min(Math.abs(residualCharge), capacity);
    let passCorrection = 0;
    for (let i = 0; i < charges.length; i += 1) {
      const available = sign < 0 ? Math.max(0, charges[i] - minCharge) : Math.max(0, maxCharge - charges[i]);
      if (available <= 0) continue;
      const correction = sign * correctionMagnitude * (available / capacity);
      charges[i] = clamp(charges[i] + correction, minCharge, maxCharge);
      passCorrection += correction;
    }
    totalCorrection += passCorrection;
    residualCharge = charges.reduce((sum, charge) => sum + Number(charge || 0), 0);
  }
  return {
    totalCorrection,
    correctionPerAtom: charges.length > 0 ? totalCorrection / charges.length : 0,
    residualCharge
  };
}

function calculateQeqResiduals(state, bonds, charges, quantumCoupling) {
  let residualSquared = 0;
  let weightedResidualSquared = 0;
  let maxResidual = 0;
  let weightSum = 0;
  let pairCount = 0;
  for (const bond of bonds) {
    const a = bond.a;
    const b = bond.b;
    const chiA = electronegativityForElement(state.elementZ[a], quantumCoupling);
    const chiB = electronegativityForElement(state.elementZ[b], quantumCoupling);
    const hardnessA = hardnessForElement(state.elementZ[a], quantumCoupling);
    const hardnessB = hardnessForElement(state.elementZ[b], quantumCoupling);
    const residual = (chiB - chiA) - (hardnessB * charges[b] - hardnessA * charges[a]);
    const weight = Math.max(0.05, Number(bond.order || 0));
    residualSquared += residual * residual;
    weightedResidualSquared += residual * residual * weight;
    maxResidual = Math.max(maxResidual, Math.abs(residual));
    weightSum += weight;
    pairCount += 1;
  }
  return {
    electronegativityResidualRms: pairCount > 0 ? Math.sqrt(residualSquared / pairCount) : 0,
    weightedElectronegativityResidualRms: weightSum > 0 ? Math.sqrt(weightedResidualSquared / weightSum) : 0,
    maxElectronegativityResidual: maxResidual,
    residualPairCount: pairCount
  };
}

function createChargeEquilibrationReport({
  state,
  bonds,
  quantumCoupling,
  quantumMaterialSource = null,
  beforeCharges = null,
  afterCharges = null,
  mode = 'diagnostic-current-state',
  iterationCount = 0,
  transferMagnitude = 0,
  transferCount = 0,
  neutralizationCharge = 0,
  neutralizationResidualCharge = 0
} = {}) {
  const atomCount = normalizeInteger(state?.atomCount, 0, 0, MOLECULAR_DYNAMICS_WEBGPU_MAX_ATOMS);
  const resolvedBonds = Array.isArray(bonds) ? bonds : [];
  const before = Array.isArray(beforeCharges)
    ? beforeCharges.slice(0, atomCount)
    : Array.from({ length: atomCount }, (_, index) => Number(state?.partialCharge?.[index] || 0));
  const after = Array.isArray(afterCharges)
    ? afterCharges.slice(0, atomCount)
    : Array.from({ length: atomCount }, (_, index) => Number(state?.partialCharge?.[index] || 0));
  let chargeDeltaSquared = 0;
  let maxChargeDelta = 0;
  for (let i = 0; i < atomCount; i += 1) {
    const delta = (after[i] || 0) - (before[i] || 0);
    chargeDeltaSquared += delta * delta;
    maxChargeDelta = Math.max(maxChargeDelta, Math.abs(delta));
  }
  let hardnessSum = 0;
  let matchedQuantumAtomCount = 0;
  let quantumEvolutionDrive = 0;
  const qmatSource = quantumMaterialSource?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
    ? quantumMaterialSource
    : normalizeMolecularQuantumMaterialSource(quantumMaterialSource);
  let quantumMaterialElectronicMatchedAtomCount = 0;
  let quantumMaterialElectronicChargeDrive = 0;
  let quantumMaterialElectronicQeqMix = 0;
  for (let i = 0; i < atomCount; i += 1) {
    hardnessSum += hardnessForElement(state.elementZ[i], quantumCoupling);
    const adjustment = quantumAdjustmentForElement(state.elementZ[i], quantumCoupling);
    if (adjustment.active) {
      matchedQuantumAtomCount += 1;
      quantumEvolutionDrive += adjustment.evolutionDrive;
    }
    if (qmatSource.applied === true && qmatSource.electronicChargeSourceApplied === true) {
      const factor = quantumMaterialAtomTargetFactorForElement(state.elementZ[i], qmatSource);
      if (factor > 0.001) {
        quantumMaterialElectronicMatchedAtomCount += 1;
        quantumMaterialElectronicChargeDrive += Math.abs(qmatSource.electronicChargeSourceChargeDeltaProxy || 0) * factor;
        quantumMaterialElectronicQeqMix += Number(qmatSource.electronicChargeSourceQeqMixProxy || 0) * factor;
      }
    }
  }
  if (matchedQuantumAtomCount > 0) quantumEvolutionDrive /= matchedQuantumAtomCount;
  if (quantumMaterialElectronicMatchedAtomCount > 0) {
    quantumMaterialElectronicChargeDrive /= quantumMaterialElectronicMatchedAtomCount;
    quantumMaterialElectronicQeqMix /= quantumMaterialElectronicMatchedAtomCount;
  }
  const beforeSummary = summarizeChargeArray(before);
  const afterSummary = summarizeChargeArray(after);
  const residuals = calculateQeqResiduals(state, resolvedBonds, after, quantumCoupling);
  return {
    schema: MOLECULAR_CHARGE_EQUILIBRATION_SCHEMA,
    modelId: 'reduced-qeq-electronegativity-hardness-relaxation-v0',
    mode,
    status: 'interactive-proxy',
    atomCount,
    bondCount: resolvedBonds.length,
    iterationCount,
    transferCount,
    transferMagnitude,
    totalChargeBefore: beforeSummary.totalCharge,
    totalChargeAfter: afterSummary.totalCharge,
    neutralizationCharge,
    neutralizationResidualCharge,
    meanAbsChargeBefore: beforeSummary.meanAbsCharge,
    meanAbsChargeAfter: afterSummary.meanAbsCharge,
    rmsChargeBefore: beforeSummary.rmsCharge,
    rmsChargeAfter: afterSummary.rmsCharge,
    chargeRmsDelta: atomCount > 0 ? Math.sqrt(chargeDeltaSquared / atomCount) : 0,
    maxChargeDelta,
    meanHardnessProxyEv: atomCount > 0 ? hardnessSum / atomCount : 0,
    electronegativityResidualRms: residuals.electronegativityResidualRms,
    weightedElectronegativityResidualRms: residuals.weightedElectronegativityResidualRms,
    maxElectronegativityResidual: residuals.maxElectronegativityResidual,
    residualPairCount: residuals.residualPairCount,
    quantumCouplingApplied: quantumCoupling?.active === true && matchedQuantumAtomCount > 0,
    quantumCouplingElementSymbol: quantumCoupling?.elementSymbol || null,
    matchedQuantumAtomCount,
    quantumEvolutionDrive,
    quantumMaterialElectronicChargeSourceApplied: qmatSource.applied === true && qmatSource.electronicChargeSourceApplied === true,
    quantumMaterialElectronicChargeSourceSchema: qmatSource.electronicChargeSourceSchema || qmatSource.sourceElectronicChargeSourceSchema || null,
    quantumMaterialElectronicChargeSourceModelId: qmatSource.electronicChargeSourceModelId || null,
    quantumMaterialElectronicMatchedAtomCount,
    quantumMaterialElectronicChargeDrive,
    quantumMaterialElectronicQeqMix,
    quantumMaterialElectronicChargeTransferPotentialProxy: qmatSource.electronicChargeSourceChargeTransferPotentialProxy || 0,
    quantumMaterialElectronicHardnessSofteningProxy: qmatSource.electronicChargeSourceHardnessSofteningProxy || 0,
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'Reduced electronegativity-hardness relaxation; not a calibrated ReaxFF/QEq or quantum chemistry charge solve.'
      ]
    }
  };
}

function createMolecularForceEnergyLedger({
  state,
  bonds,
  chargeEquilibration,
  kineticEnergy = 0,
  thermalEnergyProxy = 0,
  meanTemperatureK = 0,
  quantumCoupling = null,
  quantumMaterialSource = null
} = {}) {
  const atomCount = normalizeInteger(state?.atomCount, 0, 0, 32768);
  const resolvedBonds = Array.isArray(bonds) ? bonds : [];
  const coupling = normalizeMolecularQuantumCoupling(quantumCoupling || state?.quantumCoupling);
  const materialSource = normalizeMolecularQuantumMaterialSource(quantumMaterialSource || state?.quantumMaterialSource);
  const geometryForceLaw = createMolecularGeometryForceLawLedger({
    state,
    bonds: resolvedBonds,
    quantumMaterialSource: materialSource
  });
  const materialPairForceScale = materialSource.applied
    ? normalizeNumber(materialSource.pairForceScale, 1, 0.5, 1.8)
    : 1;
  const materialRestLengthDeltaAngstrom = materialSource.applied
    ? normalizeNumber(materialSource.restLengthDeltaAngstrom, 0, -0.08, 0.08)
    : 0;
  const materialPairForceMix = materialSource.applied
    ? normalizeNumber(materialSource.pairForceMix, 0, 0, 1)
    : 0;
  const materialEnsemblePressureDrive = materialSource.applied
    ? normalizeNumber(materialSource.ensemblePressureDrive, 0, -1, 1)
    : 0;
  const materialHeatCapacityProxy = materialSource.applied
    ? normalizeNumber(materialSource.heatCapacityProxy, 0, 0, 64)
    : 0;
  let bondedAttractionEnergyProxy = 0;
  let bondStrainEnergyProxy = 0;
  let bondOrderSum = 0;
  let bondStrainSum = 0;
  let maxBondStrain = 0;
  for (const bond of resolvedBonds) {
    const a = Number(bond.a);
    const b = Number(bond.b);
    const order = Math.max(0, Number(bond.order || 0));
    const distance = Math.max(0.02, Number(bond.distance || 0));
    const idealDistance = Math.max(0.04, molecularPairRestLengthReducedNm(state?.elementZ?.[a], state?.elementZ?.[b]));
    const strain = (distance - idealDistance) / idealDistance;
    bondedAttractionEnergyProxy -= order * 0.14 / distance;
    bondStrainEnergyProxy += order * strain * strain * 0.045;
    bondOrderSum += order;
    bondStrainSum += Math.abs(strain);
    maxBondStrain = Math.max(maxBondStrain, Math.abs(strain));
  }

  let pairCount = 0;
  let electrostaticEnergyProxy = 0;
  let repulsionEnergyProxy = 0;
  let closePairCount = 0;
  let quantumMaterialTargetPairCount = 0;
  let quantumMaterialFallbackPairCount = 0;
  let quantumMaterialWeightedPairFactorSum = 0;
  let quantumMaterialTargetAtomCount = 0;
  let quantumMaterialFallbackAtomCount = 0;
  let quantumMaterialWeightedAtomFactorSum = 0;
  let pairRestLengthSum = 0;
  let pairAffinitySum = 0;
  let ionicPairCandidateCount = 0;
  let polarPairCandidateCount = 0;
  let covalentPairCandidateCount = 0;
  let weakPairCandidateCount = 0;
  if (materialSource.applied && atomCount > 0) {
    for (let i = 0; i < atomCount; i += 1) {
      const factor = quantumMaterialAtomTargetFactorForElement(state.elementZ[i], materialSource);
      quantumMaterialWeightedAtomFactorSum += factor;
      if (factor >= 0.999) quantumMaterialTargetAtomCount += 1;
      else quantumMaterialFallbackAtomCount += 1;
    }
  }
  const searchRadius = Math.max(MOLECULAR_DYNAMICS_FORCE_RADIUS, maxBondThresholdForState(state));
  const pairSearch = forEachSpatialCandidatePair(state, {
    searchRadius,
    callback: (i, j) => {
      const dx = state.positionsX[j] - state.positionsX[i];
      const dy = state.positionsY[j] - state.positionsY[i];
      const dz = state.positionsZ[j] - state.positionsZ[i];
      const distanceSquared = Math.max(0.0016, dx * dx + dy * dy + dz * dz);
      if (distanceSquared > searchRadius * searchRadius) return;
      const distance = Math.sqrt(distanceSquared);
      pairCount += 1;
      const forceLaw = molecularPairForceLawForElements(state.elementZ[i], state.elementZ[j]);
      pairRestLengthSum += forceLaw.restLengthReducedNm;
      pairAffinitySum += forceLaw.affinity;
      if (forceLaw.ionicCandidate) ionicPairCandidateCount += 1;
      else if (forceLaw.polarCandidate) polarPairCandidateCount += 1;
      else if (forceLaw.covalentCandidate) covalentPairCandidateCount += 1;
      else weakPairCandidateCount += 1;
      const materialPairFactor = materialSource.applied
        ? quantumMaterialPairTargetFactorForElements(state.elementZ[i], state.elementZ[j], materialSource)
        : 0;
      quantumMaterialWeightedPairFactorSum += materialPairFactor;
      if (materialPairFactor >= 0.999) quantumMaterialTargetPairCount += 1;
      else if (materialSource.applied) quantumMaterialFallbackPairCount += 1;
      electrostaticEnergyProxy += clamp(
        Number(state.partialCharge[i] || 0) * Number(state.partialCharge[j] || 0) * 0.012 / distance,
        -0.8,
        0.8
      );
      const softCore = Math.max(
        0.035,
        forceLaw.restLengthReducedNm * 0.58
      );
      if (distance < softCore) {
        const overlap = (softCore - distance) / softCore;
        repulsionEnergyProxy += overlap * overlap * 0.22;
        closePairCount += 1;
      }
    }
  });

  const residualPairs = Math.max(
    1,
    Number(chargeEquilibration?.residualPairCount || 0),
    resolvedBonds.length
  );
  const qeqResidualPenaltyProxy = clamp(
    Math.pow(Number(chargeEquilibration?.weightedElectronegativityResidualRms || 0), 2)
      * residualPairs
      * 0.00008,
    0,
    8
  );
  const thermalReferenceEnergyProxy = atomCount > 0 ? atomCount * 294 * 0.00008617 : 0;
  const thermalExcessEnergyProxy = thermalEnergyProxy - thermalReferenceEnergyProxy;
  const matchedQuantumAtomCount = Number(
    chargeEquilibration?.matchedQuantumAtomCount
      ?? chargeEquilibration?.quantumCouplingMatchedAtomCount
      ?? 0
  );
  const quantumCouplingBiasEnergyProxy = coupling.active
    ? -Math.min(1, Number(coupling.wavefunctionEvolutionDrive || 0))
      * Math.max(1, matchedQuantumAtomCount || atomCount)
      * 0.015
    : 0;
  const quantumMaterialSourceBiasEnergyProxy = materialSource.applied
    ? -Math.min(1, Number(materialSource.forceGradientDrive || 0) + Math.max(0, Number(materialSource.bondOrderScale || 1) - 1))
      * Math.max(
        1,
        quantumMaterialWeightedAtomFactorSum
          || Number(materialSource.targetAtomWeightedFactorSum || 0)
          || Number(materialSource.targetMatchedAtomCount || 0)
          || Number(materialSource.matchedAtomCount || 0)
          || atomCount
      )
      * 0.02
      + Math.min(1, Number(materialSource.meanUncertainty || 0)) * 0.004
    : 0;
  const quantumMaterialPairForceBiasEnergyProxy = materialSource.applied
    ? -Math.min(
      1.35,
      Math.abs(materialPairForceScale - 1) * 2.4
        + Math.abs(materialRestLengthDeltaAngstrom) * 14
        + materialPairForceMix * 0.38
    ) * Math.max(1, quantumMaterialWeightedPairFactorSum || quantumMaterialTargetPairCount || pairCount || atomCount) * 0.006
    : 0;
  const quantumMaterialEnsembleBiasEnergyProxy = materialSource.applied
    ? (
      -Math.abs(materialEnsemblePressureDrive) * 0.004
        - Math.min(1, materialHeatCapacityProxy * 0.018) * 0.002
    ) * Math.max(1, quantumMaterialWeightedAtomFactorSum || atomCount)
    : 0;
  const quantumMaterialForceBiasEnergyProxy =
    quantumMaterialSourceBiasEnergyProxy + quantumMaterialPairForceBiasEnergyProxy + quantumMaterialEnsembleBiasEnergyProxy;
  const totalPotentialEnergyProxy = bondedAttractionEnergyProxy
    + bondStrainEnergyProxy
    + geometryForceLaw.geometryEnergyProxy
    + electrostaticEnergyProxy
    + repulsionEnergyProxy
    + qeqResidualPenaltyProxy
    + quantumCouplingBiasEnergyProxy
    + quantumMaterialForceBiasEnergyProxy;
  const totalEnergyProxy = Number(kineticEnergy || 0) + Number(thermalEnergyProxy || 0) + totalPotentialEnergyProxy;

  return {
    schema: MOLECULAR_FORCE_ENERGY_LEDGER_SCHEMA,
    modelId: 'reduced-molecular-force-energy-ledger-v0',
    mode: 'reduced-force-field-energy-accounting',
    status: 'interactive-proxy',
    atomCount,
    bondCount: resolvedBonds.length,
    pairCount,
    candidatePairCount: pairSearch.pairCount,
    closePairCount,
    pairSearchMode: pairSearch.mode,
    spatialCellCount: pairSearch.cellCount,
    searchRadius: pairSearch.searchRadius,
    forceLaw: {
      schema: MOLECULAR_FORCE_LAW_SCHEMA,
      modelId: 'element-aware-covalent-radius-affinity-v0',
      status: 'interactive-proxy',
      pairCount,
      meanPairRestLengthReducedNm: pairCount > 0 ? pairRestLengthSum / pairCount : 0,
      meanPairAffinity: pairCount > 0 ? pairAffinitySum / pairCount : 0,
      ionicPairCandidateCount,
      polarPairCandidateCount,
      covalentPairCandidateCount,
      weakPairCandidateCount,
      warnings: [
        'Reduced pair law is suitable for interactive molecule layout/telemetry only; it is not a calibrated force field.'
      ]
    },
    forceLawSchema: MOLECULAR_FORCE_LAW_SCHEMA,
    forceLawModelId: 'element-aware-covalent-radius-affinity-v0',
    geometryForceLaw,
    geometryForceLawSchema: geometryForceLaw.schema,
    geometryForceLawModelId: geometryForceLaw.modelId,
    waterGeometryTargetSource: geometryForceLaw.targetSource,
    waterGeometrySourceApplied: geometryForceLaw.sourceApplied === true,
    waterGeometrySourceSchema: geometryForceLaw.sourceSchema,
    waterGeometrySourceModelId: geometryForceLaw.sourceModelId,
    waterGeometrySourceBackend: geometryForceLaw.sourceBackend,
    waterGeometrySourceConfidence: geometryForceLaw.sourceConfidence,
    waterGeometryTargetOhDistanceReducedNm: geometryForceLaw.targetOhDistanceReducedNm,
    waterGeometryTargetHhDistanceReducedNm: geometryForceLaw.targetHhDistanceReducedNm,
    waterGeometryTargetAngleDeg: geometryForceLaw.targetAngleDeg,
    waterGeometryDistanceStiffnessProxy: geometryForceLaw.distanceStiffnessProxy,
    waterGeometryAngleStiffnessProxy: geometryForceLaw.angleStiffnessProxy,
    waterGeometryTripletCount: geometryForceLaw.tripletCount,
    waterGeometryCompleteTripletCount: geometryForceLaw.completeWaterTripletCount,
    waterGeometryMeanAngleDeg: geometryForceLaw.meanAngleDeg,
    waterGeometryMeanAbsAngleErrorDeg: geometryForceLaw.meanAbsAngleErrorDeg,
    waterGeometryRmsAngleErrorDeg: geometryForceLaw.rmsAngleErrorDeg,
    waterGeometryMaxAbsAngleErrorDeg: geometryForceLaw.maxAbsAngleErrorDeg,
    waterGeometryMeanOhDistanceReducedNm: geometryForceLaw.meanOhDistanceReducedNm,
    waterGeometryMeanHhDistanceReducedNm: geometryForceLaw.meanHhDistanceReducedNm,
    waterGeometryClosureFraction: geometryForceLaw.geometryClosureFraction,
    waterGeometryStiffnessProxy: geometryForceLaw.stiffnessProxy,
    waterGeometryEnergyProxy: geometryForceLaw.geometryEnergyProxy,
    meanPairRestLengthReducedNm: pairCount > 0 ? pairRestLengthSum / pairCount : 0,
    meanPairAffinity: pairCount > 0 ? pairAffinitySum / pairCount : 0,
    ionicPairCandidateCount,
    polarPairCandidateCount,
    covalentPairCandidateCount,
    weakPairCandidateCount,
    bondOrderSum,
    meanBondStrain: resolvedBonds.length > 0 ? bondStrainSum / resolvedBonds.length : 0,
    maxBondStrain,
    meanTemperatureK: Number(meanTemperatureK || 0),
    components: {
      kineticEnergyProxy: Number(kineticEnergy || 0),
      thermalEnergyProxy: Number(thermalEnergyProxy || 0),
      thermalReferenceEnergyProxy,
      thermalExcessEnergyProxy,
      bondedAttractionEnergyProxy,
      bondStrainEnergyProxy,
      waterGeometryEnergyProxy: geometryForceLaw.geometryEnergyProxy,
      electrostaticEnergyProxy,
      repulsionEnergyProxy,
      qeqResidualPenaltyProxy,
      quantumCouplingBiasEnergyProxy,
      quantumMaterialSourceBiasEnergyProxy,
      quantumMaterialPairForceBiasEnergyProxy,
      quantumMaterialEnsembleBiasEnergyProxy,
      quantumMaterialForceBiasEnergyProxy
    },
    bondedAttractionEnergyProxy,
    bondStrainEnergyProxy,
    waterGeometryEnergyProxy: geometryForceLaw.geometryEnergyProxy,
    electrostaticEnergyProxy,
    repulsionEnergyProxy,
    qeqResidualPenaltyProxy,
    quantumCouplingBiasEnergyProxy,
    quantumMaterialSourceBiasEnergyProxy,
    quantumMaterialPairForceBiasEnergyProxy,
    quantumMaterialEnsembleBiasEnergyProxy,
    quantumMaterialForceBiasEnergyProxy,
    quantumMaterialSourceApplied: materialSource.applied === true,
    quantumMaterialTargetPairLabel: materialSource.targetPairLabel || 'all-pairs',
    quantumMaterialPrimaryElementZ: Number(materialSource.primaryElementZ || 0),
    quantumMaterialSecondaryElementZ: Number(materialSource.secondaryElementZ || 0),
    quantumMaterialPairSelectivity: Number(materialSource.pairSelectivity || 0),
    quantumMaterialPairFallbackFactor: Number(materialSource.pairFallbackFactor ?? 1),
    quantumMaterialTargetPairCount,
    quantumMaterialFallbackPairCount,
    quantumMaterialWeightedPairFactorSum,
    quantumMaterialMeanPairFactor: pairCount > 0 ? quantumMaterialWeightedPairFactorSum / pairCount : 0,
    quantumMaterialTargetAtomCount,
    quantumMaterialFallbackAtomCount,
    quantumMaterialWeightedAtomFactorSum,
    quantumMaterialMeanAtomFactor: atomCount > 0 ? quantumMaterialWeightedAtomFactorSum / atomCount : 0,
    quantumMaterialSourceForceGradientDrive: Number(materialSource.forceGradientDrive || 0),
    quantumMaterialSourceBondOrderScale: Number(materialSource.bondOrderScale || 1),
    quantumMaterialSourcePairForceScale: materialPairForceScale,
    quantumMaterialSourceRestLengthDeltaAngstrom: materialRestLengthDeltaAngstrom,
    quantumMaterialSourcePairForceMix: materialPairForceMix,
    quantumMaterialSourceEnsemblePressureDrive: materialEnsemblePressureDrive,
    quantumMaterialSourceHeatCapacityProxy: materialHeatCapacityProxy,
    totalPotentialEnergyProxy,
    totalEnergyProxy,
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'Reduced energy accounting mirrors the interactive MD forces; it is not a calibrated force field, ReaxFF energy, or ab initio Hamiltonian.'
      ]
    }
  };
}

function dominantPhaseForFractions(fractions = {}) {
  const entries = Object.entries(fractions)
    .sort(([, a], [, b]) => Number(b || 0) - Number(a || 0));
  const [phase, fraction] = entries[0] || ['unknown', 0];
  if (Number(fractions.plasma || 0) >= 0.18) return 'plasma';
  if (Number(fraction || 0) < 0.52) return 'mixed';
  return phase || 'unknown';
}

function createMolecularThermoPhaseLedger({
  state,
  bonds,
  reactionLedger,
  forceEnergyLedger,
  meanTemperatureK = 0,
  maxTemperatureK = 0,
  thermalEnergyProxy = 0,
  totalEnergyProxy = 0,
  heatReleaseProxy = 0,
  ionizationFraction = 0,
  pressureProxy = 0
} = {}) {
  const atomCount = normalizeInteger(state?.atomCount, 0, 0, 32768);
  const resolvedBonds = Array.isArray(bonds) ? bonds : [];
  let solidScore = 0;
  let liquidScore = 0;
  let vaporScore = 0;
  let plasmaScore = 0;
  let reactiveHotScore = 0;
  let thermalBoundaryScore = 0;
  let temperatureVariance = 0;

  for (let i = 0; i < atomCount; i += 1) {
    const temperature = Math.max(1, Number(state?.temperatureK?.[i] || meanTemperatureK || 294));
    const absCharge = Math.abs(Number(state?.partialCharge?.[i] || 0));
    const chargePlasma = ramp(absCharge, 0.18, 0.95);
    const thermalPlasma = ramp(temperature, 1800, 5800);
    const plasma = clamp(chargePlasma * 0.58 + thermalPlasma * 0.52, 0, 1);
    const condensed = Math.max(0, 1 - plasma);
    const freeze = 1 - ramp(temperature, 258, 292);
    const boil = ramp(temperature, 360, 420);
    const vapor = condensed * boil;
    const solid = condensed * (1 - boil) * freeze;
    const liquid = Math.max(0, condensed - solid - vapor);
    solidScore += solid;
    liquidScore += liquid;
    vaporScore += vapor;
    plasmaScore += plasma;
    reactiveHotScore += ramp(temperature, 620, 2200) * (1 - plasma * 0.4);
    thermalBoundaryScore += Math.max(
      0,
      1 - Math.min(Math.abs(temperature - 273.15) / 38, Math.abs(temperature - 373.15) / 48)
    );
    const delta = temperature - Number(meanTemperatureK || 0);
    temperatureVariance += delta * delta;
  }

  const phaseFractions = normalizeFractions({
    solid: atomCount > 0 ? solidScore / atomCount : 0,
    liquid: atomCount > 0 ? liquidScore / atomCount : 0,
    vapor: atomCount > 0 ? vaporScore / atomCount : 0,
    plasma: Math.max(atomCount > 0 ? plasmaScore / atomCount : 0, Number(ionizationFraction || 0))
  });
  const waterMoleculeAtomCount = Math.max(0, Number(reactionLedger?.species?.H2O || 0)) * 3;
  const waterMoleculeFraction = clamp(waterMoleculeAtomCount / Math.max(1, atomCount), 0, 1);
  const componentClosureFraction = clamp(Number(reactionLedger?.componentClosureFraction ?? 0), 0, 1);
  const bondNetworkFraction = clamp(resolvedBonds.length / Math.max(1, atomCount), 0, 2);
  const condensationOrderProxy = clamp(
    (phaseFractions.solid + phaseFractions.liquid)
      * (0.35 + componentClosureFraction * 0.5 + waterMoleculeFraction * 0.15)
      * (0.4 + Math.min(1, bondNetworkFraction) * 0.6),
    0,
    1
  );
  const reactiveHotFraction = atomCount > 0 ? reactiveHotScore / atomCount : 0;
  const boundaryFraction = atomCount > 0 ? thermalBoundaryScore / atomCount : 0;
  const vaporizationDriveProxy = clamp(
    phaseFractions.vapor * (0.55 + reactiveHotFraction * 0.45)
      + Math.max(0, Number(heatReleaseProxy || 0)) * 0.035,
    0,
    4
  );
  const freezingDriveProxy = clamp(
    phaseFractions.solid * (1 - reactiveHotFraction) * (0.35 + condensationOrderProxy * 0.65),
    0,
    4
  );
  const plasmaDriveProxy = clamp(phaseFractions.plasma + Number(ionizationFraction || 0) * 0.8, 0, 4);
  const phaseChangeRateProxy = clamp(
    boundaryFraction * 0.75
      + vaporizationDriveProxy * 0.28
      + freezingDriveProxy * 0.18
      + plasmaDriveProxy * 0.22,
    0,
    4
  );
  const latentHeatSinkProxy = clamp(
    vaporizationDriveProxy * atomCount * 0.015
      + plasmaDriveProxy * atomCount * 0.024,
    0,
    1e6
  );
  const latentHeatReleaseProxy = clamp(freezingDriveProxy * atomCount * 0.011, 0, 1e6);
  const specificEnthalpyProxy = atomCount > 0
    ? Number(totalEnergyProxy || 0) / atomCount + Number(pressureProxy || 0) * 0.0002
    : 0;
  const heatCapacityProxy = atomCount > 0
    ? Math.max(0.00001, Number(thermalEnergyProxy || 0) / Math.max(1, atomCount * Math.max(1, Number(meanTemperatureK || 0))))
    : 0;
  const temperatureStdDevK = atomCount > 0 ? Math.sqrt(temperatureVariance / atomCount) : 0;
  const referenceTemperatureK = 294;
  const sourceTemperatureDeltaKProxy = Number(meanTemperatureK || 0) - referenceTemperatureK;
  const pressureWorkProxy = Number(pressureProxy || 0) * 0.0002;
  const entropyProxy = heatCapacityProxy * Math.log(Math.max(1, Number(meanTemperatureK || 1)) / referenceTemperatureK)
    + phaseChangeRateProxy * 0.025;
  const phaseStabilityResidualProxy = clamp(
    (1 - Math.max(
      phaseFractions.solid,
      phaseFractions.liquid,
      phaseFractions.vapor,
      phaseFractions.plasma
    )) * 0.54
      + phaseChangeRateProxy * 0.08
      + boundaryFraction * 0.22
      + phaseFractions.plasma * 0.06,
    0,
    1
  );
  const latentHeatBudgetProxy = latentHeatReleaseProxy - latentHeatSinkProxy;
  const specificInternalEnergyProxy = specificEnthalpyProxy - pressureWorkProxy;
  const specificFreeEnergyProxy = specificEnthalpyProxy
    - entropyProxy * Math.max(1, Number(meanTemperatureK || referenceTemperatureK)) * 0.001
    + pressureWorkProxy
    - latentHeatBudgetProxy / Math.max(1, atomCount) * 0.002;
  const phaseEnergyRateProxy = heatCapacityProxy * sourceTemperatureDeltaKProxy * phaseChangeRateProxy * 0.001
    + latentHeatBudgetProxy * 0.02;

  return {
    schema: MOLECULAR_THERMO_PHASE_LEDGER_SCHEMA,
    modelId: 'reduced-molecular-thermo-phase-ledger-v0',
    mode: 'temperature-charge-bond-phase-proxy',
    status: 'interactive-proxy',
    atomCount,
    bondCount: resolvedBonds.length,
    dominantMolecule: reactionLedger?.dominantFormula || null,
    phaseFractions,
    solidFraction: phaseFractions.solid,
    liquidFraction: phaseFractions.liquid,
    vaporFraction: phaseFractions.vapor,
    plasmaFraction: phaseFractions.plasma,
    reactiveHotFraction,
    thermalBoundaryFraction: boundaryFraction,
    phaseRegime: dominantPhaseForFractions(phaseFractions),
    waterMoleculeFraction,
    componentClosureFraction,
    condensationOrderProxy,
    vaporizationDriveProxy,
    freezingDriveProxy,
    plasmaDriveProxy,
    phaseChangeRateProxy,
    latentHeatSinkProxy,
    latentHeatReleaseProxy,
    latentHeatBudgetProxy,
    heatCapacityProxy,
    specificInternalEnergyProxy,
    specificEnthalpyProxy,
    entropyProxy,
    specificFreeEnergyProxy,
    phaseStabilityResidualProxy,
    phaseEnergyRateProxy,
    sourceTemperatureDeltaKProxy,
    meanTemperatureK: Number(meanTemperatureK || 0),
    maxTemperatureK: Number(maxTemperatureK || 0),
    temperatureStdDevK,
    pressureProxy: Number(pressureProxy || 0),
    energyLedgerSchema: forceEnergyLedger?.schema || null,
    forceFieldTotalEnergyProxy: Number(forceEnergyLedger?.totalEnergyProxy ?? totalEnergyProxy ?? 0),
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'Reduced molecular phase classification from temperature, charge, and bond telemetry; not a calibrated water EOS, phase diagram, or thermodynamic integration.'
      ]
    }
  };
}

function buildNeighborLists(state, searchRadius = MOLECULAR_DYNAMICS_FORCE_RADIUS) {
  const neighborLists = Array.from({ length: state.atomCount }, () => []);
  const pairSearch = forEachSpatialCandidatePair(state, {
    searchRadius,
    callback: (a, b) => {
      const dx = state.positionsX[b] - state.positionsX[a];
      const dy = state.positionsY[b] - state.positionsY[a];
      const dz = state.positionsZ[b] - state.positionsZ[a];
      if (dx * dx + dy * dy + dz * dz > searchRadius * searchRadius) return;
      neighborLists[a].push(b);
      neighborLists[b].push(a);
    }
  });
  return {
    neighborLists,
    pairSearch
  };
}

function equilibratePartialCharges(state) {
  const quantumCoupling = quantumCouplingForState(state);
  const quantumMaterialSource = quantumMaterialSourceForState(state);
  const bonds = inferBonds(state);
  const beforeCharges = state.partialCharge.slice(0, state.atomCount);
  const nextCharges = new Array(state.atomCount);
  let transferMagnitude = 0;
  let transferCount = 0;
  for (let i = 0; i < state.atomCount; i += 1) {
    const adjustment = quantumAdjustmentForElement(state.elementZ[i], quantumCoupling);
    const relaxation = adjustment.active ? 0.16 : 0.12;
    nextCharges[i] = state.partialCharge[i] * (1 - relaxation) + initialChargeForElement(state.elementZ[i], quantumCoupling) * relaxation;
    if (adjustment.active) nextCharges[i] += adjustment.ionizationDrive * 0.08;
    if (quantumMaterialSource.applied === true && quantumMaterialSource.electronicChargeSourceApplied === true) {
      const factor = quantumMaterialAtomTargetFactorForElement(state.elementZ[i], quantumMaterialSource);
      const qmatChargeStep = normalizeNumber(quantumMaterialSource.electronicChargeSourceChargeDeltaProxy, 0, -0.2, 0.2)
        * qmatChargeSignForElement(state.elementZ[i])
        * factor
        * clamp(0.35 + normalizeNumber(quantumMaterialSource.electronicChargeSourceQeqMixProxy, 0, 0, 1), 0.25, 1.1);
      nextCharges[i] += qmatChargeStep;
    }
  }
  for (const bond of bonds) {
    const a = bond.a;
    const b = bond.b;
    const qmatPairFactor = quantumMaterialSource.applied === true
      ? quantumMaterialPairTargetFactorForElements(state.elementZ[a], state.elementZ[b], quantumMaterialSource)
      : 0;
    const qmatElectronicChiDelta = quantumMaterialSource.electronicChargeSourceApplied === true
      ? normalizeNumber(quantumMaterialSource.electronicChargeSourceElectronegativityDeltaProxy, 0, 0, 6)
        * (qmatChargeSignForElement(state.elementZ[b]) - qmatChargeSignForElement(state.elementZ[a]))
        * qmatPairFactor
        * 0.08
      : 0;
    const chiDelta = electronegativityForElement(state.elementZ[b], quantumCoupling)
      - electronegativityForElement(state.elementZ[a], quantumCoupling)
      + qmatElectronicChiDelta;
    const hardnessA = hardnessForElement(state.elementZ[a], quantumCoupling);
    const hardnessB = hardnessForElement(state.elementZ[b], quantumCoupling);
    const hardnessResidual = hardnessB * nextCharges[b] - hardnessA * nextCharges[a];
    const meanTemperature = (state.temperatureK[a] + state.temperatureK[b]) * 0.5;
    const thermalDamping = clamp(1 - (meanTemperature - 600) / 7000, 0.18, 1);
    const distanceShield = 1 / Math.max(0.04, bond.distance);
    const transfer = clamp(
      (chiDelta - hardnessResidual) * bond.order * thermalDamping * 0.42 / (hardnessA + hardnessB + distanceShield),
      -0.14,
      0.14
    );
    nextCharges[a] += transfer;
    nextCharges[b] -= transfer;
    transferMagnitude += Math.abs(transfer);
    transferCount += 1;
  }
  const meanCharge = nextCharges.reduce((sum, charge) => sum + charge, 0) / Math.max(1, state.atomCount);
  for (let i = 0; i < state.atomCount; i += 1) {
    state.partialCharge[i] = clamp(nextCharges[i] - meanCharge, -1.4, 1.4);
  }
  const activeCharges = state.partialCharge.subarray
    ? state.partialCharge.subarray(0, state.atomCount)
    : state.partialCharge;
  const neutralization = neutralizeClampedCharges(activeCharges, -1.4, 1.4);
  const afterCharges = state.partialCharge.slice(0, state.atomCount);
  state.chargeEquilibration = createChargeEquilibrationReport({
    state,
    bonds,
    quantumCoupling,
    quantumMaterialSource,
    beforeCharges,
    afterCharges,
    mode: 'applied-bond-graph-qeq-relaxation',
    iterationCount: 1,
    transferMagnitude,
    transferCount,
    neutralizationCharge: meanCharge - neutralization.correctionPerAtom,
    neutralizationResidualCharge: neutralization.residualCharge
  });
  return bonds;
}

function summarizeBondClasses(state, bonds) {
  const quantumCoupling = quantumCouplingForState(state);
  let ionicBondCount = 0;
  let covalentBondCount = 0;
  let polarBondCount = 0;
  let valenceUsed = 0;
  let valenceCapacity = 0;
  const usage = new Array(state.atomCount).fill(0);
  for (const bond of bonds) {
    const a = state.elementZ[bond.a];
    const b = state.elementZ[bond.b];
    const maxA = valenceForElement(a);
    const maxB = valenceForElement(b);
    const cost = bondValenceCost(bond.order, maxA, maxB);
    usage[bond.a] += cost;
    usage[bond.b] += cost;
    const electronegativityDelta = Math.abs(electronegativityForElement(a, quantumCoupling) - electronegativityForElement(b, quantumCoupling));
    const chargeDelta = Math.abs(state.partialCharge[bond.a] - state.partialCharge[bond.b]);
    if (electronegativityDelta >= 1.6 || chargeDelta >= 0.85) ionicBondCount += 1;
    else covalentBondCount += 1;
    if (electronegativityDelta >= 0.4 || chargeDelta >= 0.25) polarBondCount += 1;
  }
  for (let i = 0; i < state.atomCount; i += 1) {
    valenceUsed += Math.min(valenceForElement(state.elementZ[i]), usage[i]);
    valenceCapacity += valenceForElement(state.elementZ[i]);
  }
  return {
    ionicBondCount,
    covalentBondCount,
    polarBondCount,
    polarBondFraction: bonds.length ? polarBondCount / bonds.length : 0,
    valenceSaturation: valenceCapacity > 0 ? valenceUsed / valenceCapacity : 0
  };
}

const FORMULA_ORDER = ['C', 'H', 'N', 'O', 'F', 'Na', 'Mg', 'Si', 'P', 'S', 'Cl', 'K', 'Ca', 'Fe', 'other'];

function incrementCount(target, key, amount = 1) {
  if (!key) return;
  target[key] = (target[key] || 0) + amount;
}

function elementCountsFromIndices(state, indices) {
  const counts = {};
  for (const index of indices) incrementCount(counts, symbolForElement(state.elementZ[index]));
  if (!counts.other) counts.other = 0;
  return counts;
}

function countOf(counts, symbol) {
  return Number(counts?.[symbol] || 0);
}

function formulaFromElementCounts(counts = {}) {
  if (
    countOf(counts, 'Na') === 1
    && countOf(counts, 'Cl') === 1
    && Object.keys(counts).every((key) => key === 'Na' || key === 'Cl' || key === 'other')
  ) {
    return 'NaCl';
  }
  const parts = [];
  for (const symbol of FORMULA_ORDER) {
    const count = countOf(counts, symbol);
    if (count <= 0) continue;
    parts.push(`${symbol}${count === 1 ? '' : count}`);
  }
  return parts.join('') || 'unknown';
}

function classifyMolecularFormula(counts = {}, atomCount = 0) {
  const h = countOf(counts, 'H');
  const c = countOf(counts, 'C');
  const n = countOf(counts, 'N');
  const o = countOf(counts, 'O');
  const na = countOf(counts, 'Na');
  const cl = countOf(counts, 'Cl');
  const other = countOf(counts, 'other');
  if (atomCount === 3 && h === 2 && o === 1 && other === 0) return { formula: 'H2O', type: 'water', expectedBondCount: 2, recognized: true };
  if (atomCount === 3 && na === 1 && o === 1 && h === 1 && other === 0) return { formula: 'NaOH', type: 'sodium-hydroxide', expectedBondCount: 2, recognized: true };
  if (atomCount === 3 && c === 1 && o === 2 && other === 0) return { formula: 'CO2', type: 'carbon-dioxide', expectedBondCount: 2, recognized: true };
  if (atomCount === 5 && c === 1 && h === 4 && other === 0) return { formula: 'CH4', type: 'methane', expectedBondCount: 4, recognized: true };
  if (atomCount === 2 && na === 1 && cl === 1 && other === 0) return { formula: 'NaCl', type: 'salt', expectedBondCount: 1, recognized: true };
  if (atomCount === 2 && h === 2 && other === 0) return { formula: 'H2', type: 'hydrogen', expectedBondCount: 1, recognized: true };
  if (atomCount === 2 && o === 2 && other === 0) return { formula: 'O2', type: 'oxygen', expectedBondCount: 1, recognized: true };
  if (atomCount === 2 && n === 2 && other === 0) return { formula: 'N2', type: 'nitrogen', expectedBondCount: 1, recognized: true };
  if (atomCount === 2 && c === 1 && o === 1 && other === 0) return { formula: 'CO', type: 'carbon-monoxide', expectedBondCount: 1, recognized: true };
  if (atomCount === 1) {
    return {
      formula: formulaFromElementCounts(counts),
      type: 'free-atom',
      expectedBondCount: 0,
      recognized: false
    };
  }
  return {
    formula: formulaFromElementCounts(counts),
    type: 'unknown-component',
    expectedBondCount: Math.max(0, atomCount - 1),
    recognized: false
  };
}

function createMolecularReactionLedger(state, bonds = []) {
  const adjacency = Array.from({ length: state.atomCount }, () => []);
  const bondLookup = new Map();
  for (const bond of bonds) {
    adjacency[bond.a]?.push(bond.b);
    adjacency[bond.b]?.push(bond.a);
    bondLookup.set(`${Math.min(bond.a, bond.b)}:${Math.max(bond.a, bond.b)}`, bond);
  }
  const visited = new Array(state.atomCount).fill(false);
  const components = [];
  const species = {};
  let componentCount = 0;
  let recognizedMoleculeCount = 0;
  let freeAtomCount = 0;
  let unrecognizedAtomCount = 0;
  let expectedBondCount = 0;
  let bondResidual = 0;
  let largestComponentAtomCount = 0;
  let dominantFormula = null;
  let dominantFormulaCount = 0;

  for (let start = 0; start < state.atomCount; start += 1) {
    if (visited[start]) continue;
    const stack = [start];
    const indices = [];
    visited[start] = true;
    while (stack.length) {
      const index = stack.pop();
      indices.push(index);
      for (const next of adjacency[index]) {
        if (visited[next]) continue;
        visited[next] = true;
        stack.push(next);
      }
    }
    indices.sort((a, b) => a - b);
    const counts = elementCountsFromIndices(state, indices);
    let componentBondCount = 0;
    let totalBondOrder = 0;
    for (let i = 0; i < indices.length; i += 1) {
      for (let j = i + 1; j < indices.length; j += 1) {
        const bond = bondLookup.get(`${indices[i]}:${indices[j]}`);
        if (!bond) continue;
        componentBondCount += 1;
        totalBondOrder += Number(bond.order || 0);
      }
    }
    const classification = classifyMolecularFormula(counts, indices.length);
    componentCount += 1;
    incrementCount(species, classification.formula);
    if (classification.recognized) recognizedMoleculeCount += 1;
    else if (classification.type === 'free-atom') freeAtomCount += indices.length;
    else unrecognizedAtomCount += indices.length;
    expectedBondCount += classification.expectedBondCount;
    bondResidual += Math.abs(componentBondCount - classification.expectedBondCount);
    largestComponentAtomCount = Math.max(largestComponentAtomCount, indices.length);
    if (species[classification.formula] > dominantFormulaCount) {
      dominantFormula = classification.formula;
      dominantFormulaCount = species[classification.formula];
    }
    if (components.length < 64) {
      components.push({
        id: componentCount - 1,
        formula: classification.formula,
        type: classification.type,
        recognized: classification.recognized,
        atomCount: indices.length,
        bondCount: componentBondCount,
        expectedBondCount: classification.expectedBondCount,
        bondResidual: Math.abs(componentBondCount - classification.expectedBondCount),
        meanBondOrder: componentBondCount > 0 ? totalBondOrder / componentBondCount : 0,
        elementCounts: counts
      });
    }
  }

  const residualAtomCount = freeAtomCount + unrecognizedAtomCount;
  const normalizedBondResidual = bondResidual / Math.max(1, expectedBondCount + bonds.length);
  const speciesResidualProxy = clamp(residualAtomCount / Math.max(1, state.atomCount) + normalizedBondResidual, 0, 1);
  const componentClosureFraction = clamp(
    (1 - residualAtomCount / Math.max(1, state.atomCount)) * (1 - normalizedBondResidual),
    0,
    1
  );
  return {
    schema: MOLECULAR_REACTION_LEDGER_SCHEMA,
    modelId: 'reduced-bond-graph-reaction-ledger-v0',
    componentCount,
    components,
    componentsTruncated: componentCount > components.length,
    species,
    dominantFormula,
    dominantFormulaCount,
    recognizedMoleculeCount,
    freeAtomCount,
    unrecognizedAtomCount,
    residualAtomCount,
    expectedBondCount,
    observedBondCount: bonds.length,
    bondResidual,
    normalizedBondResidual,
    stoichiometryResidualProxy: speciesResidualProxy,
    speciesResidualProxy,
    componentClosureFraction,
    stoichiometryClosed: residualAtomCount === 0 && normalizedBondResidual <= 0.05,
    largestComponentAtomCount,
    mode: 'bond-graph-component-ledger',
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'Component ledger is derived from reduced valence-capped bond inference, not a validated reaction network or force field.'
      ]
    }
  };
}

function bondKey(bond = {}) {
  const a = Math.min(Number(bond.a), Number(bond.b));
  const b = Math.max(Number(bond.a), Number(bond.b));
  return `${a}:${b}`;
}

function summarizeBondEvent(bond = {}, diagnostics = {}) {
  const state = diagnostics.state || null;
  const a = Number(bond.a);
  const b = Number(bond.b);
  const elementA = bond.elementA || (state?.elementZ ? symbolForElement(state.elementZ[a]) : null);
  const elementB = bond.elementB || (state?.elementZ ? symbolForElement(state.elementZ[b]) : null);
  const pair = elementA && elementB ? [elementA, elementB].sort().join('-') : null;
  return {
    a,
    b,
    pair,
    order: Number(bond.order || 0),
    distance: Number(bond.distance || 0)
  };
}

function speciesDelta(beforeSpecies = {}, afterSpecies = {}) {
  const delta = {};
  const keys = new Set([...Object.keys(beforeSpecies || {}), ...Object.keys(afterSpecies || {})]);
  for (const key of keys) {
    const value = Number(afterSpecies?.[key] || 0) - Number(beforeSpecies?.[key] || 0);
    if (value !== 0) delta[key] = value;
  }
  return delta;
}

function sumAbsValues(values = {}) {
  return Object.values(values).reduce((sum, value) => sum + Math.abs(Number(value) || 0), 0);
}

export function createMolecularReactionEventLedger(beforeDiagnostics = {}, afterDiagnostics = {}) {
  const beforeBonds = beforeDiagnostics.bonds || [];
  const afterBonds = afterDiagnostics.bonds || [];
  const beforeMap = new Map(beforeBonds.map((bond) => [bondKey(bond), bond]));
  const afterMap = new Map(afterBonds.map((bond) => [bondKey(bond), bond]));
  const formedBonds = [];
  const brokenBonds = [];
  let retainedBondCount = 0;
  let bondOrderDelta = 0;
  for (const [key, bond] of afterMap) {
    const previous = beforeMap.get(key);
    if (!previous) {
      formedBonds.push(summarizeBondEvent(bond, afterDiagnostics));
      bondOrderDelta += Number(bond.order || 0);
    } else {
      retainedBondCount += 1;
      bondOrderDelta += Number(bond.order || 0) - Number(previous.order || 0);
    }
  }
  for (const [key, bond] of beforeMap) {
    if (afterMap.has(key)) continue;
    brokenBonds.push(summarizeBondEvent(bond, beforeDiagnostics));
    bondOrderDelta -= Number(bond.order || 0);
  }
  const moleculeSpeciesDelta = speciesDelta(
    beforeDiagnostics.molecularSpecies || beforeDiagnostics.reactionLedger?.species || {},
    afterDiagnostics.molecularSpecies || afterDiagnostics.reactionLedger?.species || {}
  );
  const atomSpeciesDelta = speciesDelta(beforeDiagnostics.species || {}, afterDiagnostics.species || {});
  const bondEventCount = formedBonds.length + brokenBonds.length;
  const atomCount = Math.max(1, Number(afterDiagnostics.atomCount || beforeDiagnostics.atomCount || 1));
  const moleculeDeltaMagnitude = sumAbsValues(moleculeSpeciesDelta);
  const atomDeltaMagnitude = sumAbsValues(atomSpeciesDelta);
  const heatReleaseDelta = Number(afterDiagnostics.heatReleaseProxy || 0) - Number(beforeDiagnostics.heatReleaseProxy || 0);
  const reactionProgressDelta = Number(afterDiagnostics.reactionProgress || 0) - Number(beforeDiagnostics.reactionProgress || 0);
  const stoichiometryResidualDelta = Number(afterDiagnostics.stoichiometryResidualProxy || 0)
    - Number(beforeDiagnostics.stoichiometryResidualProxy || 0);
  return {
    schema: MOLECULAR_REACTION_EVENT_LEDGER_SCHEMA,
    modelId: 'reduced-bond-graph-reaction-events-v0',
    mode: 'bond-graph-step-delta',
    bondEventCount,
    formedBondCount: formedBonds.length,
    brokenBondCount: brokenBonds.length,
    retainedBondCount,
    netBondCountDelta: Number(afterDiagnostics.bondCount || 0) - Number(beforeDiagnostics.bondCount || 0),
    bondOrderDelta,
    heatReleaseDelta,
    reactionProgressDelta,
    stoichiometryResidualDelta,
    moleculeSpeciesDelta,
    atomSpeciesDelta,
    moleculeDeltaMagnitude,
    atomDeltaMagnitude,
    eventIntensityProxy: clamp(
      bondEventCount / Math.max(1, afterBonds.length + beforeBonds.length)
        + moleculeDeltaMagnitude / atomCount
        + Math.abs(stoichiometryResidualDelta) * 0.35,
      0,
      1
    ),
    formedBonds: formedBonds.slice(0, 64),
    brokenBonds: brokenBonds.slice(0, 64),
    eventsTruncated: formedBonds.length > 64 || brokenBonds.length > 64,
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'Reaction event ledger compares reduced inferred bond graphs between steps; it is not a validated reaction-rate law.'
      ]
    }
  };
}

function rateMap(delta = {}, invDt = 1) {
  const result = {};
  for (const [key, value] of Object.entries(delta || {})) {
    const rate = Number(value || 0) * invDt;
    if (rate !== 0) result[key] = rate;
  }
  return result;
}

export function createMolecularReactionSourceTerms({
  beforeDiagnostics = {},
  afterDiagnostics = {},
  eventLedger = null,
  dt = 1 / 90
} = {}) {
  const safeDt = Math.max(1e-6, Number(dt) || 1 / 90);
  const invDt = 1 / safeDt;
  const events = eventLedger || createMolecularReactionEventLedger(beforeDiagnostics, afterDiagnostics);
  const formedBondCount = Number(events.formedBondCount || 0);
  const brokenBondCount = Number(events.brokenBondCount || 0);
  const moleculeDeltaMagnitude = Number(events.moleculeDeltaMagnitude || 0);
  const heatReleaseDelta = Number(events.heatReleaseDelta || 0);
  const reactionProgressDelta = Number(events.reactionProgressDelta || 0);
  const speciesRates = rateMap(events.moleculeSpeciesDelta, invDt);
  const atomSpeciesRates = rateMap(events.atomSpeciesDelta, invDt);
  const bondFormationRate = formedBondCount * invDt;
  const bondBreakageRate = brokenBondCount * invDt;
  const netBondRate = Number(events.netBondCountDelta || 0) * invDt;
  const heatSourceProxy = clamp(
    Math.max(0, heatReleaseDelta) * invDt * 0.04
      + formedBondCount * 0.035
      + moleculeDeltaMagnitude * 0.018,
    0,
    4
  );
  const coolingSinkProxy = clamp(
    Math.max(0, -heatReleaseDelta) * invDt * 0.03
      + brokenBondCount * 0.025,
    0,
    4
  );
  const speciesRateProxy = clamp(moleculeDeltaMagnitude * invDt * 0.025, 0, 4);
  return {
    schema: MOLECULAR_REACTION_SOURCE_SCHEMA,
    modelId: 'reduced-event-derived-reaction-source-v0',
    mode: 'event-ledger-source-proxy',
    dt: safeDt,
    rates: {
      bondFormationRate,
      bondBreakageRate,
      netBondRate,
      reactionProgressRate: reactionProgressDelta * invDt,
      heatReleaseRateProxy: heatReleaseDelta * invDt,
      speciesRateProxy,
      speciesRates,
      atomSpeciesRates
    },
    heat: {
      heatSourceProxy,
      coolingSinkProxy,
      netHeatSourceProxy: heatSourceProxy - coolingSinkProxy
    },
    species: {
      moleculeSpeciesDelta: { ...(events.moleculeSpeciesDelta || {}) },
      atomSpeciesDelta: { ...(events.atomSpeciesDelta || {}) },
      moleculeDeltaMagnitude,
      atomDeltaMagnitude: Number(events.atomDeltaMagnitude || 0)
    },
    eventLedgerSchema: events.schema || null,
    eventIntensityProxy: Number(events.eventIntensityProxy || 0),
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'Reaction source terms are derived from reduced event telemetry; scientific mode still needs enthalpy, stoichiometry, and validated kinetics.'
      ]
    }
  };
}

export function computeMolecularDynamicsDiagnostics(stateInput = {}) {
  const state = stateInput.schema === MOLECULAR_DYNAMICS_STATE_SCHEMA ? stateInput : normalizeState(stateInput);
  const quantumCoupling = quantumCouplingForState(state);
  const quantumCouplingApplication = state.quantumCouplingApplication?.schema === MOLECULAR_QUANTUM_SOURCE_SCHEMA
    ? state.quantumCouplingApplication
    : createQuantumCouplingApplicationReport(state, quantumCoupling);
  const quantumMaterialSource = state.quantumMaterialSource?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
    ? state.quantumMaterialSource
    : normalizeMolecularQuantumMaterialSource(null);
  const quantumMaterialReactionProductSource = createQuantumMaterialReactionProductSource(quantumMaterialSource);
  const ulgStateDeltaSource = state.ulgStateDeltaSource?.schema === MOLECULAR_ULG_STATE_SOURCE_SCHEMA
    ? state.ulgStateDeltaSource
    : normalizeUlgRuntimeStateDelta(null);
  let kineticEnergy = 0;
  let thermalEnergyProxy = 0;
  let meanTemperatureK = 0;
  let maxTemperatureK = 0;
  let totalCharge = 0;
  let ionizedCount = 0;
  let meanAbsCharge = 0;
  let metalAtoms = 0;
  let dipoleX = 0;
  let dipoleY = 0;
  let dipoleZ = 0;
  const species = {};
  let quantumCouplingMatchedAtomCount = 0;
  let quantumElectronegativityShift = 0;
  let quantumChargeBias = 0;
  let quantumBondOrderScale = 0;
  let quantumIonizationDrive = 0;
  let quantumEvolutionDrive = 0;
  for (let i = 0; i < state.atomCount; i += 1) {
    const vx = state.velocitiesX[i];
    const vy = state.velocitiesY[i];
    const vz = state.velocitiesZ[i];
    const mass = state.massesAmu[i];
    const temperature = Math.max(1, state.temperatureK[i]);
    kineticEnergy += 0.5 * mass * (vx * vx + vy * vy + vz * vz);
    thermalEnergyProxy += temperature * mass * 0.00008617;
    meanTemperatureK += temperature;
    maxTemperatureK = Math.max(maxTemperatureK, temperature);
    totalCharge += state.partialCharge[i];
    meanAbsCharge += Math.abs(state.partialCharge[i]);
    dipoleX += state.partialCharge[i] * state.positionsX[i];
    dipoleY += state.partialCharge[i] * state.positionsY[i];
    dipoleZ += state.partialCharge[i] * state.positionsZ[i];
    if (isMetalElement(state.elementZ[i])) metalAtoms += 1;
    if (Math.abs(state.partialCharge[i]) > 0.18) ionizedCount += 1;
    const symbol = symbolForElement(state.elementZ[i]);
    species[symbol] = (species[symbol] || 0) + 1;
    const adjustment = quantumAdjustmentForElement(state.elementZ[i], quantumCoupling);
    if (adjustment.active) {
      quantumCouplingMatchedAtomCount += 1;
      quantumElectronegativityShift += adjustment.electronegativityDelta;
      quantumChargeBias += adjustment.chargeBias;
      quantumBondOrderScale += adjustment.bondOrderScale;
      quantumIonizationDrive += adjustment.ionizationDrive;
      quantumEvolutionDrive += adjustment.evolutionDrive;
    }
  }
  if (!species.other) species.other = 0;
  const bondSelection = inferBondSelection(state);
  const bonds = bondSelection.bonds;
  const productTopologyOverlay = bondSelection.productTopologyOverlay || createQuantumMaterialProductTopologyOverlay(state, quantumMaterialSource);
  const quantumMaterialReactionProductTopologyMutation =
    state.quantumMaterialProductTopologyMutation?.schema === MOLECULAR_QMAT_PRODUCT_TOPOLOGY_MUTATION_SCHEMA
      ? state.quantumMaterialProductTopologyMutation
      : {
        schema: MOLECULAR_QMAT_PRODUCT_TOPOLOGY_MUTATION_SCHEMA,
        modelId: 'qmat-na-water-reduced-product-topology-state-mutation-v0',
        mode: 'diagnostic-current-state',
        applied: false,
        newMutationApplied: false,
        status: 'unavailable',
        targetReactionId: quantumMaterialReactionProductSource.targetReactionId || null,
        overlayBondCount: productTopologyOverlay.bonds.length,
        naohMoleculeCount: productTopologyOverlay.naohMoleculeCount || 0,
        h2MoleculeCount: productTopologyOverlay.h2MoleculeCount || 0,
        mutatedAtomCount: 0,
        retiredWaterGroupCount: 0,
        reducedAtomInventoryConserved: true,
        authoritativeAtomMutationReady: false,
        scientificMutation: false
      };
  const bondClasses = summarizeBondClasses(state, bonds);
  const reactionLedger = createMolecularReactionLedger(state, bonds);
  const quantumMaterialReactionProductConservationAudit = createQuantumMaterialReactionProductConservationAudit({
    state,
    reactionLedger,
    productSource: quantumMaterialReactionProductSource,
    productTopologyOverlay
  });
  const chargeEquilibration = state.chargeEquilibration?.schema === MOLECULAR_CHARGE_EQUILIBRATION_SCHEMA
    ? state.chargeEquilibration
    : createChargeEquilibrationReport({
      state,
      bonds,
      quantumCoupling,
      quantumMaterialSource,
      mode: 'diagnostic-current-state'
    });
  let meanBondOrder = 0;
  for (const bond of bonds) {
    meanBondOrder += bond.order;
  }
  meanBondOrder /= Math.max(1, bonds.length);
  meanTemperatureK /= Math.max(1, state.atomCount);
  meanAbsCharge /= Math.max(1, state.atomCount);
  const forceEnergyLedger = createMolecularForceEnergyLedger({
    state,
    bonds,
    chargeEquilibration,
    kineticEnergy,
    thermalEnergyProxy,
    meanTemperatureK,
    quantumCoupling,
    quantumMaterialSource
  });
  const potentialEnergyProxy = forceEnergyLedger.totalPotentialEnergyProxy;
  const totalEnergyProxy = forceEnergyLedger.totalEnergyProxy;
  const ionizationFraction = ionizedCount / Math.max(1, state.atomCount);
  const quantumCouplingApplied = quantumCoupling.active && quantumCouplingMatchedAtomCount > 0;
  if (quantumCouplingMatchedAtomCount > 0) {
    quantumElectronegativityShift /= quantumCouplingMatchedAtomCount;
    quantumChargeBias /= quantumCouplingMatchedAtomCount;
    quantumBondOrderScale /= quantumCouplingMatchedAtomCount;
    quantumIonizationDrive /= quantumCouplingMatchedAtomCount;
    quantumEvolutionDrive /= quantumCouplingMatchedAtomCount;
  } else {
    quantumBondOrderScale = 1;
  }
  const dipoleMomentProxy = Math.hypot(dipoleX, dipoleY, dipoleZ);
  const metalFraction = metalAtoms / Math.max(1, state.atomCount);
  const reactionProgress = clamp(
    state.reactionProgress * 0.84
      + Math.min(1, bonds.length / Math.max(1, state.atomCount * 1.2)) * 0.08
      + Math.min(1, Math.max(0, meanTemperatureK - 320) / 1500) * 0.08
      + quantumMaterialReactionProductSource.progressDriveProxy * 0.1,
    0,
    1
  );
  const oxygenAtoms = species.O || 0;
  const heatReleaseProxy = clamp(
    Math.max(0, meanBondOrder) * Math.min(1, oxygenAtoms / Math.max(1, state.atomCount * 0.24)) * (0.2 + reactionProgress * 0.8)
      + quantumMaterialReactionProductSource.heatReleaseProxy,
    0,
    4
  );
  const pressureProxy = meanTemperatureK * state.atomCount * 0.00012;
  const quantumMaterialConductivityDrive = quantumMaterialSource.applied
    ? normalizeNumber(quantumMaterialSource.conductivityDrive, 0, 0, 1.5)
    : 0;
  const quantumMaterialDielectricDrive = quantumMaterialSource.applied
    ? normalizeNumber(quantumMaterialSource.dielectricDrive, 0, 0, 1.5)
    : 0;
  const quantumMaterialMechanicalStiffnessDrive = quantumMaterialSource.applied
    ? normalizeNumber(quantumMaterialSource.mechanicalStiffnessDrive, 0, 0, 1.5)
    : 0;
  const quantumMaterialOpticalAbsorptionDrive = quantumMaterialSource.applied
    ? normalizeNumber(quantumMaterialSource.opticalAbsorptionDrive, 0, 0, 1.5)
    : 0;
  const quantumMaterialElectricalConductivitySpm = quantumMaterialSource.applied
    ? normalizeNumber(quantumMaterialSource.electricalConductivitySpm, 0, 0, 1e12)
    : 0;
  const quantumMaterialDielectricConstant = quantumMaterialSource.applied
    ? normalizeNumber(quantumMaterialSource.dielectricConstant, 1, 1, 256)
    : 1;
  const quantumMaterialRefractiveIndex = quantumMaterialSource.applied
    ? normalizeNumber(quantumMaterialSource.refractiveIndex, 1, 0, 16)
    : 1;
  const quantumMaterialMechanicalResponsePa = quantumMaterialSource.applied
    ? normalizeNumber(quantumMaterialSource.mechanicalResponsePa, 0, 0, 1e15)
    : 0;
  const quantumMaterialBulkModulusPa = quantumMaterialSource.applied
    ? normalizeNumber(quantumMaterialSource.bulkModulusPa, quantumMaterialMechanicalResponsePa, 0, 1e15)
    : 0;
  const quantumMaterialYoungsModulusPa = quantumMaterialSource.applied
    ? normalizeNumber(quantumMaterialSource.youngsModulusPa, quantumMaterialMechanicalResponsePa, 0, 1e15)
    : 0;
  const quantumMaterialOpticalAbsorptionProxy = quantumMaterialSource.applied
    ? normalizeNumber(quantumMaterialSource.opticalAbsorptionProxy, quantumMaterialSource.opacityProxy || 0, 0, 64)
    : 0;
  const electricalConductivityProxy = clamp(
    ionizationFraction * 0.65
      + metalFraction * 0.45
      + Math.max(0, meanTemperatureK - 600) / 9000
      + meanAbsCharge * 0.08
      + Math.min(0.18, chargeEquilibration.weightedElectronegativityResidualRms * 0.018)
      + quantumMaterialConductivityDrive * 0.22
      + Math.min(0.16, Math.log10(Math.max(1, quantumMaterialElectricalConductivitySpm + 1)) * 0.035),
    0,
    4
  );
  const dielectricConstantProxy = clamp(
    1
      + bondClasses.polarBondFraction * 0.45
      + Math.min(4, dipoleMomentProxy * 0.02)
      + quantumMaterialDielectricDrive * 1.6
      + Math.min(12, Math.max(0, quantumMaterialDielectricConstant - 1) * 0.12),
    1,
    256
  );
  const refractiveIndexProxy = clamp(
    Math.max(1, Math.sqrt(Math.max(1, dielectricConstantProxy)))
      + Math.max(0, quantumMaterialRefractiveIndex - 1) * 0.18,
    1,
    16
  );
  const thermoPhaseLedger = createMolecularThermoPhaseLedger({
    state,
    bonds,
    reactionLedger,
    forceEnergyLedger,
    meanTemperatureK,
    maxTemperatureK,
    thermalEnergyProxy,
    totalEnergyProxy,
    heatReleaseProxy,
    ionizationFraction,
    pressureProxy
  });
  return {
    schema: 'peercompute.multiscale.molecular-dynamics.diagnostics.v0',
    atomCount: state.atomCount,
    bondCount: bonds.length,
    meanBondOrder,
    reactionProgress,
    heatReleaseProxy,
    kineticEnergy,
    potentialEnergyProxy,
    thermalEnergyProxy,
    totalEnergyProxy,
    forceEnergyLedger,
    forceFieldPotentialEnergyProxy: forceEnergyLedger.totalPotentialEnergyProxy,
    forceFieldTotalEnergyProxy: forceEnergyLedger.totalEnergyProxy,
    forceFieldBondedAttractionEnergyProxy: forceEnergyLedger.bondedAttractionEnergyProxy,
    forceFieldBondStrainEnergyProxy: forceEnergyLedger.bondStrainEnergyProxy,
    forceFieldElectrostaticEnergyProxy: forceEnergyLedger.electrostaticEnergyProxy,
    forceFieldRepulsionEnergyProxy: forceEnergyLedger.repulsionEnergyProxy,
    forceFieldQeqResidualPenaltyProxy: forceEnergyLedger.qeqResidualPenaltyProxy,
    forceFieldQuantumCouplingBiasEnergyProxy: forceEnergyLedger.quantumCouplingBiasEnergyProxy,
    forceFieldQuantumMaterialSourceBiasEnergyProxy: forceEnergyLedger.quantumMaterialSourceBiasEnergyProxy,
    forceFieldQuantumMaterialPairForceBiasEnergyProxy: forceEnergyLedger.quantumMaterialPairForceBiasEnergyProxy,
    forceFieldQuantumMaterialEnsembleBiasEnergyProxy: forceEnergyLedger.quantumMaterialEnsembleBiasEnergyProxy,
    forceFieldQuantumMaterialBiasEnergyProxy: forceEnergyLedger.quantumMaterialForceBiasEnergyProxy,
    forceFieldQuantumMaterialTargetPairCount: forceEnergyLedger.quantumMaterialTargetPairCount,
    forceFieldQuantumMaterialFallbackPairCount: forceEnergyLedger.quantumMaterialFallbackPairCount,
    forceFieldQuantumMaterialWeightedPairFactorSum: forceEnergyLedger.quantumMaterialWeightedPairFactorSum,
    forceFieldQuantumMaterialMeanPairFactor: forceEnergyLedger.quantumMaterialMeanPairFactor,
    forceFieldQuantumMaterialTargetAtomCount: forceEnergyLedger.quantumMaterialTargetAtomCount,
    forceFieldQuantumMaterialFallbackAtomCount: forceEnergyLedger.quantumMaterialFallbackAtomCount,
    forceFieldQuantumMaterialWeightedAtomFactorSum: forceEnergyLedger.quantumMaterialWeightedAtomFactorSum,
    forceFieldQuantumMaterialMeanAtomFactor: forceEnergyLedger.quantumMaterialMeanAtomFactor,
    forceFieldPairCount: forceEnergyLedger.pairCount,
    forceFieldCandidatePairCount: forceEnergyLedger.candidatePairCount,
    forceFieldClosePairCount: forceEnergyLedger.closePairCount,
    forceFieldForceLaw: forceEnergyLedger.forceLaw,
    forceFieldForceLawSchema: forceEnergyLedger.forceLawSchema,
    forceFieldForceLawModelId: forceEnergyLedger.forceLawModelId,
    forceFieldMeanPairRestLengthReducedNm: forceEnergyLedger.meanPairRestLengthReducedNm,
    forceFieldMeanPairAffinity: forceEnergyLedger.meanPairAffinity,
    forceFieldIonicPairCandidateCount: forceEnergyLedger.ionicPairCandidateCount,
    forceFieldPolarPairCandidateCount: forceEnergyLedger.polarPairCandidateCount,
    forceFieldCovalentPairCandidateCount: forceEnergyLedger.covalentPairCandidateCount,
    forceFieldWeakPairCandidateCount: forceEnergyLedger.weakPairCandidateCount,
    forceFieldMaxBondStrain: forceEnergyLedger.maxBondStrain,
    forceFieldMeanBondStrain: forceEnergyLedger.meanBondStrain,
    molecularGeometryForceLaw: forceEnergyLedger.geometryForceLaw,
    molecularGeometryForceLawSchema: forceEnergyLedger.geometryForceLawSchema,
    molecularGeometryForceLawModelId: forceEnergyLedger.geometryForceLawModelId,
    waterGeometryTargetSource: forceEnergyLedger.waterGeometryTargetSource,
    waterGeometrySourceApplied: forceEnergyLedger.waterGeometrySourceApplied,
    waterGeometrySourceSchema: forceEnergyLedger.waterGeometrySourceSchema,
    waterGeometrySourceModelId: forceEnergyLedger.waterGeometrySourceModelId,
    waterGeometrySourceBackend: forceEnergyLedger.waterGeometrySourceBackend,
    waterGeometrySourceConfidence: forceEnergyLedger.waterGeometrySourceConfidence,
    waterGeometryTargetOhDistanceReducedNm: forceEnergyLedger.waterGeometryTargetOhDistanceReducedNm,
    waterGeometryTargetHhDistanceReducedNm: forceEnergyLedger.waterGeometryTargetHhDistanceReducedNm,
    waterGeometryTargetAngleDeg: forceEnergyLedger.waterGeometryTargetAngleDeg,
    waterGeometryDistanceStiffnessProxy: forceEnergyLedger.waterGeometryDistanceStiffnessProxy,
    waterGeometryAngleStiffnessProxy: forceEnergyLedger.waterGeometryAngleStiffnessProxy,
    waterGeometryTripletCount: forceEnergyLedger.waterGeometryTripletCount,
    waterGeometryCompleteTripletCount: forceEnergyLedger.waterGeometryCompleteTripletCount,
    waterGeometryMeanAngleDeg: forceEnergyLedger.waterGeometryMeanAngleDeg,
    waterGeometryMeanAbsAngleErrorDeg: forceEnergyLedger.waterGeometryMeanAbsAngleErrorDeg,
    waterGeometryRmsAngleErrorDeg: forceEnergyLedger.waterGeometryRmsAngleErrorDeg,
    waterGeometryMaxAbsAngleErrorDeg: forceEnergyLedger.waterGeometryMaxAbsAngleErrorDeg,
    waterGeometryMeanOhDistanceReducedNm: forceEnergyLedger.waterGeometryMeanOhDistanceReducedNm,
    waterGeometryMeanHhDistanceReducedNm: forceEnergyLedger.waterGeometryMeanHhDistanceReducedNm,
    waterGeometryClosureFraction: forceEnergyLedger.waterGeometryClosureFraction,
    waterGeometryStiffnessProxy: forceEnergyLedger.waterGeometryStiffnessProxy,
    waterGeometryEnergyProxy: forceEnergyLedger.waterGeometryEnergyProxy,
    thermoPhaseLedger,
    phaseFractions: thermoPhaseLedger.phaseFractions,
    phaseRegime: thermoPhaseLedger.phaseRegime,
    solidFraction: thermoPhaseLedger.solidFraction,
    liquidFraction: thermoPhaseLedger.liquidFraction,
    vaporFraction: thermoPhaseLedger.vaporFraction,
    plasmaFraction: thermoPhaseLedger.plasmaFraction,
    reactiveHotFraction: thermoPhaseLedger.reactiveHotFraction,
    waterMoleculeFraction: thermoPhaseLedger.waterMoleculeFraction,
    condensationOrderProxy: thermoPhaseLedger.condensationOrderProxy,
    vaporizationDriveProxy: thermoPhaseLedger.vaporizationDriveProxy,
    freezingDriveProxy: thermoPhaseLedger.freezingDriveProxy,
    plasmaDriveProxy: thermoPhaseLedger.plasmaDriveProxy,
    phaseChangeRateProxy: thermoPhaseLedger.phaseChangeRateProxy,
    latentHeatSinkProxy: thermoPhaseLedger.latentHeatSinkProxy,
    latentHeatReleaseProxy: thermoPhaseLedger.latentHeatReleaseProxy,
    latentHeatBudgetProxy: thermoPhaseLedger.latentHeatBudgetProxy,
    heatCapacityProxy: thermoPhaseLedger.heatCapacityProxy,
    specificInternalEnergyProxy: thermoPhaseLedger.specificInternalEnergyProxy,
    specificEnthalpyProxy: thermoPhaseLedger.specificEnthalpyProxy,
    entropyProxy: thermoPhaseLedger.entropyProxy,
    specificFreeEnergyProxy: thermoPhaseLedger.specificFreeEnergyProxy,
    phaseStabilityResidualProxy: thermoPhaseLedger.phaseStabilityResidualProxy,
    phaseEnergyRateProxy: thermoPhaseLedger.phaseEnergyRateProxy,
    sourceTemperatureDeltaKProxy: thermoPhaseLedger.sourceTemperatureDeltaKProxy,
    meanTemperatureK,
    maxTemperatureK,
    totalCharge,
    ionizationFraction,
    meanAbsCharge,
    dipoleMomentProxy,
    chargeEquilibration,
    chargeEquilibrationResidualRms: chargeEquilibration.electronegativityResidualRms,
    chargeEquilibrationWeightedResidualRms: chargeEquilibration.weightedElectronegativityResidualRms,
    chargeEquilibrationMaxResidual: chargeEquilibration.maxElectronegativityResidual,
    chargeEquilibrationChargeRmsDelta: chargeEquilibration.chargeRmsDelta,
    chargeEquilibrationMaxChargeDelta: chargeEquilibration.maxChargeDelta,
    chargeEquilibrationTransferMagnitude: chargeEquilibration.transferMagnitude,
    chargeEquilibrationMeanHardnessProxyEv: chargeEquilibration.meanHardnessProxyEv,
    chargeEquilibrationNeutralizationResidualCharge: chargeEquilibration.neutralizationResidualCharge,
    electricalConductivityProxy,
    dielectricConstantProxy,
    refractiveIndexProxy,
    quantumMaterialSourcePropertyResponse: quantumMaterialSource.propertyResponse || null,
    quantumMaterialSourceResponseDerivatives: quantumMaterialSource.responseDerivatives || null,
    quantumMaterialSourceDensityKgM3: quantumMaterialSource.densityKgM3 || 0,
    quantumMaterialSourceMechanicalResponsePa: quantumMaterialMechanicalResponsePa,
    quantumMaterialSourceBulkModulusPa: quantumMaterialBulkModulusPa,
    quantumMaterialSourceYoungsModulusPa: quantumMaterialYoungsModulusPa,
    quantumMaterialSourceElectricalConductivitySpm: quantumMaterialElectricalConductivitySpm,
    quantumMaterialSourceRefractiveIndex: quantumMaterialRefractiveIndex,
    quantumMaterialSourceDielectricConstant: quantumMaterialDielectricConstant,
    quantumMaterialSourceOpticalAbsorptionProxy: quantumMaterialOpticalAbsorptionProxy,
    quantumMaterialSourceResponseDerivativesSchema: quantumMaterialSource.sourceResponseDerivativesSchema || quantumMaterialSource.responseDerivatives?.schema || null,
    quantumMaterialSourceDensityTemperatureDerivativeKgM3PerK: quantumMaterialSource.densityTemperatureDerivativeKgM3PerK || 0,
    quantumMaterialSourceMechanicalPressureDerivativePaPerLog2Pressure: quantumMaterialSource.mechanicalPressureDerivativePaPerLog2Pressure || 0,
    quantumMaterialSourceConductivityFieldDerivativeSpmPerNorm: quantumMaterialSource.conductivityFieldDerivativeSpmPerNorm || 0,
    quantumMaterialSourceOpacityRadiationDerivativePerNorm: quantumMaterialSource.opacityRadiationDerivativePerNorm || 0,
    quantumMaterialSourceResponseDerivativeTemperatureDrive: quantumMaterialSource.responseDerivativeTemperatureDrive || 0,
    quantumMaterialSourceResponseDerivativePressureDrive: quantumMaterialSource.responseDerivativePressureDrive || 0,
    quantumMaterialSourceResponseDerivativeFieldDrive: quantumMaterialSource.responseDerivativeFieldDrive || 0,
    quantumMaterialSourceResponseDerivativeRadiationDrive: quantumMaterialSource.responseDerivativeRadiationDrive || 0,
    quantumMaterialSourceConductivityDrive: quantumMaterialConductivityDrive,
    quantumMaterialSourceDielectricDrive: quantumMaterialDielectricDrive,
    quantumMaterialSourceMechanicalStiffnessDrive: quantumMaterialMechanicalStiffnessDrive,
    quantumMaterialSourceOpticalAbsorptionDrive: quantumMaterialOpticalAbsorptionDrive,
    quantumMaterialGeometrySourceApplied: quantumMaterialSource.geometrySourceApplied === true,
    quantumMaterialGeometrySourceSchema: quantumMaterialSource.geometrySourceSchema || null,
    quantumMaterialGeometrySourceModelId: quantumMaterialSource.geometrySourceModelId || null,
    quantumMaterialGeometryTargetSource: quantumMaterialSource.geometryTargetSource || 'md-default-reduced-water-reference',
    quantumMaterialGeometryTargetOhDistanceReducedNm: quantumMaterialSource.geometryTargetOhDistanceReducedNm || WATER_OH_REST_REDUCED_NM,
    quantumMaterialGeometryTargetHhDistanceReducedNm: quantumMaterialSource.geometryTargetHhDistanceReducedNm || WATER_HH_TARGET_REDUCED_NM,
    quantumMaterialGeometryTargetAngleDeg: quantumMaterialSource.geometryTargetAngleDeg || WATER_HOH_TARGET_ANGLE_DEG,
    quantumMaterialGeometryDistanceStiffnessProxy: quantumMaterialSource.geometryDistanceStiffnessProxy || 1,
    quantumMaterialGeometryAngleStiffnessProxy: quantumMaterialSource.geometryAngleStiffnessProxy || 1,
    quantumMaterialGeometrySourceConfidence: quantumMaterialSource.geometrySourceConfidence || 0,
    quantumMaterialElectronicChargeSource: quantumMaterialSource.electronicChargeSource || null,
    quantumMaterialElectronicChargeSourceApplied: quantumMaterialSource.electronicChargeSourceApplied === true,
    quantumMaterialElectronicChargeSourceSchema: quantumMaterialSource.electronicChargeSourceSchema || null,
    quantumMaterialElectronicChargeSourceModelId: quantumMaterialSource.electronicChargeSourceModelId || null,
    quantumMaterialElectronicChargeSourceStatus: quantumMaterialSource.electronicChargeSourceStatus || null,
    quantumMaterialElectronicChargeSourceBackend: quantumMaterialSource.electronicChargeSourceBackend || null,
    quantumMaterialElectronicChargeTargetPairLabel: quantumMaterialSource.electronicChargeSourceTargetPairLabel || 'all-pairs',
    quantumMaterialElectronicChargeDonorElementZ: quantumMaterialSource.electronicChargeSourceDonorElementZ || 0,
    quantumMaterialElectronicChargeAcceptorElementZ: quantumMaterialSource.electronicChargeSourceAcceptorElementZ || 0,
    quantumMaterialElectronicChargeDonorElementSymbol: quantumMaterialSource.electronicChargeSourceDonorElementSymbol || null,
    quantumMaterialElectronicChargeAcceptorElementSymbol: quantumMaterialSource.electronicChargeSourceAcceptorElementSymbol || null,
    quantumMaterialElectronicChargeDeltaProxy: quantumMaterialSource.electronicChargeSourceChargeDeltaProxy || 0,
    quantumMaterialElectronicIonizationDriveProxy: quantumMaterialSource.electronicChargeSourceIonizationDriveProxy || 0,
    quantumMaterialElectronicChargeMobilityProxy: quantumMaterialSource.electronicChargeSourceMobilityProxy || 0,
    quantumMaterialElectronicHardnessSofteningProxy: quantumMaterialSource.electronicChargeSourceHardnessSofteningProxy || 0,
    quantumMaterialElectronicScreeningDampingScale: quantumMaterialSource.electronicChargeSourceScreeningDampingScale || 1,
    quantumMaterialElectronicQeqMixProxy: quantumMaterialSource.electronicChargeSourceQeqMixProxy || 0,
    quantumMaterialElectronicElectronegativityDeltaProxy: quantumMaterialSource.electronicChargeSourceElectronegativityDeltaProxy || 0,
    quantumMaterialElectronicChargeTransferPotentialProxy: quantumMaterialSource.electronicChargeSourceChargeTransferPotentialProxy || 0,
    quantumMaterialElectronicMeanHardnessProxyEv: quantumMaterialSource.electronicChargeSourceMeanHardnessProxyEv || 0,
    quantumMaterialElectronicMeanElectronegativityProxy: quantumMaterialSource.electronicChargeSourceMeanElectronegativityProxy || 0,
    quantumMaterialElectronicChargeSourceConfidence: quantumMaterialSource.electronicChargeSourceConfidence || 0,
    pairSearchMode: bondSelection.pairSearch.mode,
    neighborCandidatePairCount: bondSelection.pairSearch.pairCount,
    bondCandidateCount: bondSelection.bondCandidateCount,
    spatialCellCount: bondSelection.pairSearch.cellCount,
    spatialCellSize: bondSelection.pairSearch.cellSize,
    bondSearchRadius: bondSelection.pairSearch.searchRadius,
    ionicBondCount: bondClasses.ionicBondCount,
    covalentBondCount: bondClasses.covalentBondCount,
    polarBondFraction: bondClasses.polarBondFraction,
    valenceSaturation: bondClasses.valenceSaturation,
    pressureProxy,
    quantumCoupling: {
      schema: MOLECULAR_QUANTUM_COUPLING_SCHEMA,
      active: quantumCoupling.active,
      applied: quantumCouplingApplied,
      elementSymbol: quantumCoupling.elementSymbol,
      atomicNumber: quantumCoupling.atomicNumber,
      activeOrbital: quantumCoupling.activeOrbital,
      bondingTendency: quantumCoupling.bondingTendency,
      finiteGridBackend: quantumCoupling.finiteGridBackend,
      finiteGridLiveBackendPolicy: quantumCoupling.finiteGridLiveBackendPolicy,
      confidence: quantumCoupling.confidence,
      wavefunctionEvolutionSchema: quantumCoupling.wavefunctionEvolutionSchema,
      wavefunctionEvolutionSource: quantumCoupling.wavefunctionEvolutionSource,
      wavefunctionEvolutionBackend: quantumCoupling.wavefunctionEvolutionBackend,
      wavefunctionEvolutionStatus: quantumCoupling.wavefunctionEvolutionStatus,
      wavefunctionEvolutionNormDrift: quantumCoupling.wavefunctionEvolutionNormDrift,
      wavefunctionEvolutionDensityDriftL1: quantumCoupling.wavefunctionEvolutionDensityDriftL1,
      wavefunctionEvolutionEnergyExpectationEv: quantumCoupling.wavefunctionEvolutionEnergyExpectationEv,
      wavefunctionEvolutionKineticExpectationEv: quantumCoupling.wavefunctionEvolutionKineticExpectationEv,
      wavefunctionEvolutionPotentialExpectationEv: quantumCoupling.wavefunctionEvolutionPotentialExpectationEv,
      wavefunctionEvolutionFieldEnergyExpectationEv: quantumCoupling.wavefunctionEvolutionFieldEnergyExpectationEv,
      wavefunctionEvolutionAbsFieldEnergyExpectationEv: quantumCoupling.wavefunctionEvolutionAbsFieldEnergyExpectationEv,
      wavefunctionEvolutionElectricFieldVm: quantumCoupling.wavefunctionEvolutionElectricFieldVm,
      wavefunctionEvolutionElectricFieldAtomicUnits: quantumCoupling.wavefunctionEvolutionElectricFieldAtomicUnits,
      wavefunctionEvolutionDipoleMomentZBohrElectron: quantumCoupling.wavefunctionEvolutionDipoleMomentZBohrElectron,
      wavefunctionEvolutionFieldRmsExtentBohr: quantumCoupling.wavefunctionEvolutionFieldRmsExtentBohr,
      wavefunctionEvolutionPolarizabilityProxyBohr3: quantumCoupling.wavefunctionEvolutionPolarizabilityProxyBohr3,
      wavefunctionEvolutionStarkShiftProxyEv: quantumCoupling.wavefunctionEvolutionStarkShiftProxyEv,
      wavefunctionEvolutionFieldResponseSchema: quantumCoupling.wavefunctionEvolutionFieldResponseSchema,
      wavefunctionEvolutionMagneticFieldT: quantumCoupling.wavefunctionEvolutionMagneticFieldT,
      wavefunctionEvolutionMagneticFieldAtomicUnits: quantumCoupling.wavefunctionEvolutionMagneticFieldAtomicUnits,
      wavefunctionEvolutionZeemanEnergyExpectationEv: quantumCoupling.wavefunctionEvolutionZeemanEnergyExpectationEv,
      wavefunctionEvolutionAbsZeemanEnergyExpectationEv: quantumCoupling.wavefunctionEvolutionAbsZeemanEnergyExpectationEv,
      wavefunctionEvolutionMagneticMomentProjectionBohrMagneton: quantumCoupling.wavefunctionEvolutionMagneticMomentProjectionBohrMagneton,
      wavefunctionEvolutionZeemanProjection: quantumCoupling.wavefunctionEvolutionZeemanProjection,
      wavefunctionEvolutionSpinProjection: quantumCoupling.wavefunctionEvolutionSpinProjection,
      wavefunctionEvolutionLarmorAngularFrequencyProxyAu: quantumCoupling.wavefunctionEvolutionLarmorAngularFrequencyProxyAu,
      wavefunctionEvolutionMagneticResponseSchema: quantumCoupling.wavefunctionEvolutionMagneticResponseSchema,
      wavefunctionEvolutionComponentEnergyExpectationEv: quantumCoupling.wavefunctionEvolutionComponentEnergyExpectationEv,
      wavefunctionEvolutionHamiltonianComponentResidualEv: quantumCoupling.wavefunctionEvolutionHamiltonianComponentResidualEv,
      wavefunctionEvolutionVirialResidualEv: quantumCoupling.wavefunctionEvolutionVirialResidualEv,
      wavefunctionEvolutionHamiltonianComponentsSchema: quantumCoupling.wavefunctionEvolutionHamiltonianComponentsSchema,
      wavefunctionEvolutionPhaseRotationRad: quantumCoupling.wavefunctionEvolutionPhaseRotationRad,
      wavefunctionEvolutionWebgpuParityOk: quantumCoupling.wavefunctionEvolutionWebgpuParityOk,
      wavefunctionEvolutionWebgpuExecuted: quantumCoupling.wavefunctionEvolutionWebgpuExecuted === true,
      wavefunctionEvolutionLiveBackendPolicy: quantumCoupling.wavefunctionEvolutionLiveBackendPolicy,
      wavefunctionEvolutionDrive: quantumCoupling.wavefunctionEvolutionDrive,
      radialEigenstateSchema: quantumCoupling.radialEigenstateSchema,
      radialEigenstateSource: quantumCoupling.radialEigenstateSource,
      radialEigenstateStatus: quantumCoupling.radialEigenstateStatus,
      radialEigenstateEnergyEv: quantumCoupling.radialEigenstateEnergyEv,
      radialEigenstateEnergyErrorEv: quantumCoupling.radialEigenstateEnergyErrorEv,
      radialEigenstateResidualRelativeL2: quantumCoupling.radialEigenstateResidualRelativeL2,
      radialEigenstateMeanRadiusBohr: quantumCoupling.radialEigenstateMeanRadiusBohr,
      radialEigenstateGridPointCount: quantumCoupling.radialEigenstateGridPointCount,
      radialEigenstateWebgpuExecuted: quantumCoupling.radialEigenstateWebgpuExecuted === true,
      statisticalBridgeSchema: quantumCoupling.statisticalBridgeSchema,
      statisticalBridgeSource: quantumCoupling.statisticalBridgeSource,
      statisticalBridgeStatus: quantumCoupling.statisticalBridgeStatus,
      statisticalBridgeBackend: quantumCoupling.statisticalBridgeBackend,
      statisticalBridgePartitionFunctionLog: quantumCoupling.statisticalBridgePartitionFunctionLog,
      statisticalBridgeExcitedOccupation: quantumCoupling.statisticalBridgeExcitedOccupation,
      statisticalBridgeFreeEnergyEv: quantumCoupling.statisticalBridgeFreeEnergyEv,
      statisticalBridgeInternalEnergyEv: quantumCoupling.statisticalBridgeInternalEnergyEv,
      statisticalBridgeHeatCapacityProxy: quantumCoupling.statisticalBridgeHeatCapacityProxy,
      statisticalBridgeEntropyProxyKb: quantumCoupling.statisticalBridgeEntropyProxyKb,
      statisticalBridgeIonizationFraction: quantumCoupling.statisticalBridgeIonizationFraction,
      statisticalBridgeOpacityPopulationProxy: quantumCoupling.statisticalBridgeOpacityPopulationProxy,
      statisticalBridgeDegeneracyParameter: quantumCoupling.statisticalBridgeDegeneracyParameter,
      statisticalBridgeEnsemblePressurePa: quantumCoupling.statisticalBridgeEnsemblePressurePa,
      statisticalBridgeTemperatureDeltaKProxy: quantumCoupling.statisticalBridgeTemperatureDeltaKProxy,
      statisticalBridgeChargeDeltaProxy: quantumCoupling.statisticalBridgeChargeDeltaProxy,
      statisticalBridgeThermalDampingScale: quantumCoupling.statisticalBridgeThermalDampingScale,
      statisticalBridgeWebgpuExecuted: quantumCoupling.statisticalBridgeWebgpuExecuted === true,
      statisticalBridgeDrive: quantumCoupling.statisticalBridgeDrive,
      matchedAtomCount: quantumCouplingMatchedAtomCount,
      electronegativityShift: quantumElectronegativityShift,
      chargeBias: quantumChargeBias,
      bondOrderScale: quantumBondOrderScale,
      ionizationDrive: quantumIonizationDrive,
      evolutionDrive: quantumEvolutionDrive
    },
    quantumCouplingApplication,
    quantumCouplingApplied,
    quantumCouplingElementSymbol: quantumCoupling.elementSymbol,
    quantumCouplingAtomicNumber: quantumCoupling.atomicNumber,
    quantumCouplingMatchedAtomCount,
    quantumCouplingApplicationMode: quantumCouplingApplication.applicationMode || 'unavailable',
    quantumCouplingWebgpuKernelApplied: quantumCouplingApplication.webgpuKernelApplied === true,
    quantumCouplingTemperatureDeltaK: Number(quantumCouplingApplication.temperatureAppliedDeltaK || 0),
    quantumCouplingTargetCharge: Number(quantumCouplingApplication.targetCharge || 0),
    quantumCouplingChargeMix: Number(quantumCouplingApplication.chargeMix || 0),
    quantumElectronegativityShift,
    quantumChargeBias,
    quantumBondOrderScale,
    quantumIonizationDrive,
    quantumEvolutionDrive,
    quantumWavefunctionEvolutionSource: quantumCoupling.wavefunctionEvolutionSource,
    quantumWavefunctionEvolutionBackend: quantumCoupling.wavefunctionEvolutionBackend,
    quantumWavefunctionEvolutionNormDrift: quantumCoupling.wavefunctionEvolutionNormDrift,
    quantumWavefunctionEvolutionDensityDriftL1: quantumCoupling.wavefunctionEvolutionDensityDriftL1,
    quantumWavefunctionEvolutionEnergyExpectationEv: quantumCoupling.wavefunctionEvolutionEnergyExpectationEv,
    quantumWavefunctionEvolutionKineticExpectationEv: quantumCoupling.wavefunctionEvolutionKineticExpectationEv,
    quantumWavefunctionEvolutionPotentialExpectationEv: quantumCoupling.wavefunctionEvolutionPotentialExpectationEv,
    quantumWavefunctionEvolutionFieldEnergyExpectationEv: quantumCoupling.wavefunctionEvolutionFieldEnergyExpectationEv,
    quantumWavefunctionEvolutionAbsFieldEnergyExpectationEv: quantumCoupling.wavefunctionEvolutionAbsFieldEnergyExpectationEv,
    quantumWavefunctionEvolutionElectricFieldVm: quantumCoupling.wavefunctionEvolutionElectricFieldVm,
    quantumWavefunctionEvolutionElectricFieldAtomicUnits: quantumCoupling.wavefunctionEvolutionElectricFieldAtomicUnits,
    quantumWavefunctionEvolutionDipoleMomentZBohrElectron: quantumCoupling.wavefunctionEvolutionDipoleMomentZBohrElectron,
    quantumWavefunctionEvolutionFieldRmsExtentBohr: quantumCoupling.wavefunctionEvolutionFieldRmsExtentBohr,
    quantumWavefunctionEvolutionPolarizabilityProxyBohr3: quantumCoupling.wavefunctionEvolutionPolarizabilityProxyBohr3,
    quantumWavefunctionEvolutionStarkShiftProxyEv: quantumCoupling.wavefunctionEvolutionStarkShiftProxyEv,
    quantumWavefunctionEvolutionFieldResponseSchema: quantumCoupling.wavefunctionEvolutionFieldResponseSchema,
    quantumWavefunctionEvolutionMagneticFieldT: quantumCoupling.wavefunctionEvolutionMagneticFieldT,
    quantumWavefunctionEvolutionMagneticFieldAtomicUnits: quantumCoupling.wavefunctionEvolutionMagneticFieldAtomicUnits,
    quantumWavefunctionEvolutionZeemanEnergyExpectationEv: quantumCoupling.wavefunctionEvolutionZeemanEnergyExpectationEv,
    quantumWavefunctionEvolutionAbsZeemanEnergyExpectationEv: quantumCoupling.wavefunctionEvolutionAbsZeemanEnergyExpectationEv,
    quantumWavefunctionEvolutionMagneticMomentProjectionBohrMagneton: quantumCoupling.wavefunctionEvolutionMagneticMomentProjectionBohrMagneton,
    quantumWavefunctionEvolutionZeemanProjection: quantumCoupling.wavefunctionEvolutionZeemanProjection,
    quantumWavefunctionEvolutionSpinProjection: quantumCoupling.wavefunctionEvolutionSpinProjection,
    quantumWavefunctionEvolutionLarmorAngularFrequencyProxyAu: quantumCoupling.wavefunctionEvolutionLarmorAngularFrequencyProxyAu,
    quantumWavefunctionEvolutionMagneticResponseSchema: quantumCoupling.wavefunctionEvolutionMagneticResponseSchema,
    quantumWavefunctionEvolutionComponentEnergyExpectationEv: quantumCoupling.wavefunctionEvolutionComponentEnergyExpectationEv,
    quantumWavefunctionEvolutionHamiltonianComponentResidualEv: quantumCoupling.wavefunctionEvolutionHamiltonianComponentResidualEv,
    quantumWavefunctionEvolutionVirialResidualEv: quantumCoupling.wavefunctionEvolutionVirialResidualEv,
    quantumWavefunctionEvolutionHamiltonianComponentsSchema: quantumCoupling.wavefunctionEvolutionHamiltonianComponentsSchema,
    quantumWavefunctionEvolutionPhaseRotationRad: quantumCoupling.wavefunctionEvolutionPhaseRotationRad,
    quantumWavefunctionEvolutionWebgpuParityOk: quantumCoupling.wavefunctionEvolutionWebgpuParityOk,
    quantumWavefunctionEvolutionWebgpuExecuted: quantumCoupling.wavefunctionEvolutionWebgpuExecuted === true,
    quantumWavefunctionEvolutionLiveBackendPolicy: quantumCoupling.wavefunctionEvolutionLiveBackendPolicy,
    quantumRadialEigenstateSchema: quantumCoupling.radialEigenstateSchema,
    quantumRadialEigenstateSource: quantumCoupling.radialEigenstateSource,
    quantumRadialEigenstateStatus: quantumCoupling.radialEigenstateStatus,
    quantumRadialEigenstateEnergyEv: quantumCoupling.radialEigenstateEnergyEv,
    quantumRadialEigenstateEnergyErrorEv: quantumCoupling.radialEigenstateEnergyErrorEv,
    quantumRadialEigenstateResidualRelativeL2: quantumCoupling.radialEigenstateResidualRelativeL2,
    quantumRadialEigenstateMeanRadiusBohr: quantumCoupling.radialEigenstateMeanRadiusBohr,
    quantumRadialEigenstateGridPointCount: quantumCoupling.radialEigenstateGridPointCount,
    quantumRadialEigenstateWebgpuExecuted: quantumCoupling.radialEigenstateWebgpuExecuted === true,
    quantumStatisticalBridgeSchema: quantumCoupling.statisticalBridgeSchema,
    quantumStatisticalBridgeSource: quantumCoupling.statisticalBridgeSource,
    quantumStatisticalBridgeStatus: quantumCoupling.statisticalBridgeStatus,
    quantumStatisticalBridgeBackend: quantumCoupling.statisticalBridgeBackend,
    quantumStatisticalBridgePartitionFunctionLog: quantumCoupling.statisticalBridgePartitionFunctionLog,
    quantumStatisticalBridgeExcitedOccupation: quantumCoupling.statisticalBridgeExcitedOccupation,
    quantumStatisticalBridgeFreeEnergyEv: quantumCoupling.statisticalBridgeFreeEnergyEv,
    quantumStatisticalBridgeInternalEnergyEv: quantumCoupling.statisticalBridgeInternalEnergyEv,
    quantumStatisticalBridgeHeatCapacityProxy: quantumCoupling.statisticalBridgeHeatCapacityProxy,
    quantumStatisticalBridgeEntropyProxyKb: quantumCoupling.statisticalBridgeEntropyProxyKb,
    quantumStatisticalBridgeIonizationFraction: quantumCoupling.statisticalBridgeIonizationFraction,
    quantumStatisticalBridgeOpacityPopulationProxy: quantumCoupling.statisticalBridgeOpacityPopulationProxy,
    quantumStatisticalBridgeDegeneracyParameter: quantumCoupling.statisticalBridgeDegeneracyParameter,
    quantumStatisticalBridgeEnsemblePressurePa: quantumCoupling.statisticalBridgeEnsemblePressurePa,
    quantumStatisticalBridgeTemperatureDeltaKProxy: quantumCoupling.statisticalBridgeTemperatureDeltaKProxy,
    quantumStatisticalBridgeChargeDeltaProxy: quantumCoupling.statisticalBridgeChargeDeltaProxy,
    quantumStatisticalBridgeThermalDampingScale: quantumCoupling.statisticalBridgeThermalDampingScale,
    quantumStatisticalBridgeWebgpuExecuted: quantumCoupling.statisticalBridgeWebgpuExecuted === true,
    quantumStatisticalBridgeDrive: quantumCoupling.statisticalBridgeDrive,
    quantumCouplingConfidence: quantumCoupling.confidence,
    quantumMaterialSource,
    quantumMaterialSourceApplied: quantumMaterialSource.applied === true,
    quantumMaterialSourceMode: quantumMaterialSource.applicationMode || 'unavailable',
    quantumMaterialSourceWebgpuKernelApplied: quantumMaterialSource.webgpuKernelApplied === true,
    quantumMaterialSourceSchema: quantumMaterialSource.schema,
    quantumMaterialSourceBatchSchema: quantumMaterialSource.sourceBatchSchema || null,
    quantumMaterialSourceForceSurfaceSchema: quantumMaterialSource.sourceForceSurfaceSchema || null,
    quantumMaterialSourceEnsembleSchema: quantumMaterialSource.sourceEnsembleSchema || null,
    quantumMaterialSourceStatisticalSourceEquation: quantumMaterialSource.statisticalSourceEquation || null,
    quantumMaterialSourceStatisticalSourceEquationSchema: quantumMaterialSource.sourceStatisticalSourceEquationSchema || quantumMaterialSource.statisticalSourceEquation?.schema || null,
    quantumMaterialSourceStatisticalSourceChannelCount: Number(quantumMaterialSource.statisticalSourceChannelCount || 0),
    quantumMaterialSourceResponseDerivatives: quantumMaterialSource.responseDerivatives || null,
    quantumMaterialSourceResponseDerivativesSchema: quantumMaterialSource.sourceResponseDerivativesSchema || quantumMaterialSource.responseDerivatives?.schema || null,
    quantumMaterialSourceBackend: quantumMaterialSource.backend || 'unavailable',
    quantumMaterialSourceLiveBackendPolicy: quantumMaterialSource.liveBackendPolicy || null,
    quantumMaterialSourceMaterialId: quantumMaterialSource.materialId || null,
    quantumMaterialSourceElementSymbol: quantumMaterialSource.elementSymbol || null,
    quantumMaterialSourceDominantFormula: quantumMaterialSource.dominantFormula || null,
    quantumMaterialSourceRecordCount: Number(quantumMaterialSource.recordCount || 0),
    quantumMaterialSourceReducedEnergyGradientAvailable: quantumMaterialSource.reducedEnergyGradientAvailable === true,
    quantumMaterialSourceBornOppenheimerForcesAvailable: quantumMaterialSource.bornOppenheimerForcesAvailable === true,
    quantumMaterialSourceReactionBarrierSurfaceAvailable: quantumMaterialSource.reactionBarrierSurfaceAvailable === true,
    quantumMaterialReactionBarrierSurface: quantumMaterialSource.reactionBarrierSurface || null,
    quantumMaterialReactionBarrierSurfaceApplied: quantumMaterialSource.reactionBarrierSurfaceApplied === true,
    quantumMaterialReactionBarrierSurfaceSchema: quantumMaterialSource.reactionBarrierSurfaceSchema || null,
    quantumMaterialReactionBarrierSurfaceModelId: quantumMaterialSource.reactionBarrierSurfaceModelId || null,
    quantumMaterialReactionBarrierSurfaceStatus: quantumMaterialSource.reactionBarrierSurfaceStatus || null,
    quantumMaterialReactionBarrierTargetReactionId: quantumMaterialSource.reactionBarrierTargetReactionId || null,
    quantumMaterialReactionBarrierTargetPairLabel: quantumMaterialSource.reactionBarrierTargetPairLabel || 'all-pairs',
    quantumMaterialReactionBarrierActivationEnergyEvProxy: Number(quantumMaterialSource.reactionBarrierActivationEnergyEvProxy || 0),
    quantumMaterialReactionBarrierProbabilityProxy: Number(quantumMaterialSource.reactionBarrierProbabilityProxy || 0),
    quantumMaterialReactionBarrierGateDampingScale: Number(quantumMaterialSource.reactionBarrierGateDampingScale || 1),
    quantumMaterialReactionBarrierGateProxy: Number(quantumMaterialSource.reactionBarrierGateProxy || 0),
    quantumMaterialReactionBarrierChargeTransferGateProxy: Number(quantumMaterialSource.reactionBarrierChargeTransferGateProxy || 0),
    quantumMaterialReactionBarrierUnsupportedProductBlockerCount: Number(quantumMaterialSource.reactionBarrierUnsupportedProductBlockerCount || 0),
    quantumMaterialReactionBarrierProductStoichiometryAvailable: quantumMaterialSource.reactionBarrierProductStoichiometryAvailable === true,
    quantumMaterialReactionBarrierProductTopologyAvailable: quantumMaterialSource.reactionBarrierProductTopologyAvailable === true,
    quantumMaterialReactionBarrierProductStoichiometry: quantumMaterialSource.reactionBarrierProductStoichiometry || null,
    quantumMaterialReactionBarrierProductTopology: quantumMaterialSource.reactionBarrierProductTopology || null,
    quantumMaterialReactionProductSource,
    quantumMaterialReactionProductSourceApplied: quantumMaterialReactionProductSource.applied === true,
    quantumMaterialReactionProductTargetReactionId: quantumMaterialReactionProductSource.targetReactionId || null,
    quantumMaterialReactionProductHeatReleaseProxy: quantumMaterialReactionProductSource.heatReleaseProxy,
    quantumMaterialReactionProductChargeDeltaProxy: quantumMaterialReactionProductSource.chargeDeltaProxy,
    quantumMaterialReactionProductExtentProxy: quantumMaterialReactionProductSource.extentProxy,
    quantumMaterialReactionProductProgressDriveProxy: quantumMaterialReactionProductSource.progressDriveProxy,
    quantumMaterialReactionProductGasFormula: quantumMaterialReactionProductSource.gasProductFormula,
    quantumMaterialReactionProductGasMoleculeFractionPerNa: quantumMaterialReactionProductSource.gasMoleculeFractionPerNa,
    quantumMaterialReactionProductChargeTransferElectronCount: quantumMaterialReactionProductSource.chargeTransferElectronCount,
    quantumMaterialReactionProductEnthalpyDeltaKjPerMolNaProxy: quantumMaterialReactionProductSource.enthalpyDeltaKjPerMolNaProxy,
    quantumMaterialReactionProductTopologyAvailable: quantumMaterialReactionProductSource.productTopologyAvailable === true,
    quantumMaterialReactionProductTopologyRequired: quantumMaterialReactionProductSource.productTopologyRequired === true,
    quantumMaterialReactionProductTopology: quantumMaterialReactionProductSource.productTopology || null,
    quantumMaterialReactionProductTopologySchema: quantumMaterialReactionProductSource.productTopologySchema || null,
    quantumMaterialReactionProductTopologyModelId: quantumMaterialReactionProductSource.productTopologyModelId || null,
    quantumMaterialReactionProductTopologyMode: quantumMaterialReactionProductSource.productTopologyMode || null,
    quantumMaterialReactionProductTopologyReactionSiteCount: quantumMaterialReactionProductSource.productTopologyReactionSiteCount || 0,
    quantumMaterialReactionProductTopologyReducedBondCount: quantumMaterialReactionProductSource.productTopologyReducedBondCount || 0,
    quantumMaterialReactionProductTopologyOverlay: productTopologyOverlay,
    quantumMaterialReactionProductTopologyOverlayApplied: productTopologyOverlay.applied === true,
    quantumMaterialReactionProductTopologyOverlayBondCount: productTopologyOverlay.bonds.length,
    quantumMaterialReactionProductTopologyNaohMoleculeCount: productTopologyOverlay.naohMoleculeCount || 0,
    quantumMaterialReactionProductTopologyH2MoleculeCount: productTopologyOverlay.h2MoleculeCount || 0,
    quantumMaterialReactionProductTopologyReleasedHydrogenCount: productTopologyOverlay.releasedHydrogenCount || 0,
    quantumMaterialReactionProductTopologyPartialHydrogenSiteCount: productTopologyOverlay.partialHydrogenSiteCount || 0,
    quantumMaterialReactionProductTopologyMutation: quantumMaterialReactionProductTopologyMutation,
    quantumMaterialReactionProductTopologyMutationSchema: quantumMaterialReactionProductTopologyMutation.schema,
    quantumMaterialReactionProductTopologyMutationStatus: quantumMaterialReactionProductTopologyMutation.status,
    quantumMaterialReactionProductTopologyMutationApplied: quantumMaterialReactionProductTopologyMutation.applied === true,
    quantumMaterialReactionProductTopologyNewMutationApplied: quantumMaterialReactionProductTopologyMutation.newMutationApplied === true,
    quantumMaterialReactionProductTopologyMutatedAtomCount: quantumMaterialReactionProductTopologyMutation.mutatedAtomCount || 0,
    quantumMaterialReactionProductTopologyRetiredWaterGroupCount: quantumMaterialReactionProductTopologyMutation.retiredWaterGroupCount || 0,
    quantumMaterialReactionProductTopologyMutationAtomInventoryConserved: quantumMaterialReactionProductTopologyMutation.reducedAtomInventoryConserved === true,
    quantumMaterialReactionProductTopologyScientificMutation: quantumMaterialReactionProductTopologyMutation.scientificMutation === true,
    quantumMaterialReactionProductConservationAudit,
    quantumMaterialReactionProductConservationAuditSchema: quantumMaterialReactionProductConservationAudit.schema,
    quantumMaterialReactionProductConservationAuditStatus: quantumMaterialReactionProductConservationAudit.status,
    quantumMaterialReactionProductConservationClosed: quantumMaterialReactionProductConservationAudit.reducedAtomConservationClosed === true,
    quantumMaterialReactionProductGraphComplete: quantumMaterialReactionProductConservationAudit.reducedProductGraphComplete === true,
    quantumMaterialReactionProductConservativeProductGraphReady: quantumMaterialReactionProductConservationAudit.reducedConservativeProductGraphReady === true,
    quantumMaterialReactionProductAtomResidualProxy: quantumMaterialReactionProductConservationAudit.atomConservationResidualProxy || 0,
    quantumMaterialReactionProductHeatBudgetResidualProxy: quantumMaterialReactionProductConservationAudit.heatBudgetResidualProxy || 0,
    quantumMaterialReactionProductChargeBudgetResidualProxy: quantumMaterialReactionProductConservationAudit.chargeBudgetResidualProxy || 0,
    quantumMaterialReactionProductSiteCoverageFraction: quantumMaterialReactionProductConservationAudit.siteCoverageFraction || 0,
    quantumMaterialReactionProductWaterConsumedCount: quantumMaterialReactionProductConservationAudit.waterConsumedCount || 0,
    quantumMaterialReactionProductWaterRemainingEstimate: quantumMaterialReactionProductConservationAudit.waterRemainingEstimate || 0,
    quantumMaterialReactionBarrierChargeTransferRequired: quantumMaterialSource.reactionBarrierChargeTransferRequired === true,
    quantumMaterialReactionBarrierConfidence: Number(quantumMaterialSource.reactionBarrierConfidence || 0),
    quantumMaterialSourceMeanForceGradientEvPerAngstrom: Number(quantumMaterialSource.meanForceGradientEvPerAngstrom || 0),
    quantumMaterialSourceMaxForceGradientEvPerAngstrom: Number(quantumMaterialSource.maxForceGradientEvPerAngstrom || 0),
    quantumMaterialSourceMeanCurvatureEvPerAngstrom2: Number(quantumMaterialSource.meanCurvatureEvPerAngstrom2 || 0),
    quantumMaterialSourceMeanPotentialEnergyEv: Number(quantumMaterialSource.meanPotentialEnergyEv || 0),
    quantumMaterialSourceMeanUncertainty: Number(quantumMaterialSource.meanUncertainty || 0),
    quantumMaterialSourceBehaviorDrive: Number(quantumMaterialSource.behaviorDrive || 0),
    quantumMaterialSourceIonizationFraction: Number(quantumMaterialSource.ionizationFraction || 0),
    quantumMaterialSourceOpacityProxy: Number(quantumMaterialSource.opacityProxy || 0),
    quantumMaterialSourceDegeneracyParameter: Number(quantumMaterialSource.degeneracyParameter || 0),
    quantumMaterialSourcePropertyResponse: quantumMaterialSource.propertyResponse || null,
    quantumMaterialSourceDensityKgM3: Number(quantumMaterialSource.densityKgM3 || 0),
    quantumMaterialSourceMechanicalResponsePa: Number(quantumMaterialSource.mechanicalResponsePa || 0),
    quantumMaterialSourceBulkModulusPa: Number(quantumMaterialSource.bulkModulusPa || 0),
    quantumMaterialSourceYoungsModulusPa: Number(quantumMaterialSource.youngsModulusPa || 0),
    quantumMaterialSourceElectricalConductivitySpm: Number(quantumMaterialSource.electricalConductivitySpm || 0),
    quantumMaterialSourceRefractiveIndex: Number(quantumMaterialSource.refractiveIndex || 1),
    quantumMaterialSourceDielectricConstant: Number(quantumMaterialSource.dielectricConstant || 1),
    quantumMaterialSourceOpticalAbsorptionProxy: Number(quantumMaterialSource.opticalAbsorptionProxy || 0),
    quantumMaterialSourceDensityTemperatureDerivativeKgM3PerK: Number(quantumMaterialSource.densityTemperatureDerivativeKgM3PerK || 0),
    quantumMaterialSourceMechanicalPressureDerivativePaPerLog2Pressure: Number(quantumMaterialSource.mechanicalPressureDerivativePaPerLog2Pressure || 0),
    quantumMaterialSourceConductivityFieldDerivativeSpmPerNorm: Number(quantumMaterialSource.conductivityFieldDerivativeSpmPerNorm || 0),
    quantumMaterialSourceOpacityRadiationDerivativePerNorm: Number(quantumMaterialSource.opacityRadiationDerivativePerNorm || 0),
    quantumMaterialSourceResponseDerivativeTemperatureDrive: Number(quantumMaterialSource.responseDerivativeTemperatureDrive || 0),
    quantumMaterialSourceResponseDerivativePressureDrive: Number(quantumMaterialSource.responseDerivativePressureDrive || 0),
    quantumMaterialSourceResponseDerivativeFieldDrive: Number(quantumMaterialSource.responseDerivativeFieldDrive || 0),
    quantumMaterialSourceResponseDerivativeRadiationDrive: Number(quantumMaterialSource.responseDerivativeRadiationDrive || 0),
    quantumMaterialSourceConductivityDrive: Number(quantumMaterialSource.conductivityDrive || 0),
    quantumMaterialSourceDielectricDrive: Number(quantumMaterialSource.dielectricDrive || 0),
    quantumMaterialSourceMechanicalStiffnessDrive: Number(quantumMaterialSource.mechanicalStiffnessDrive || 0),
    quantumMaterialSourceOpticalAbsorptionDrive: Number(quantumMaterialSource.opticalAbsorptionDrive || 0),
    quantumMaterialSourceEnsemblePressurePa: Number(quantumMaterialSource.ensemblePressurePa || 0),
    quantumMaterialSourceEnsembleBasePressurePa: Number(quantumMaterialSource.ensembleBasePressurePa || 0),
    quantumMaterialSourceEnsemblePressureRatio: Number(quantumMaterialSource.ensemblePressureRatio || 1),
    quantumMaterialSourceEnsemblePressureDrive: Number(quantumMaterialSource.ensemblePressureDrive || 0),
    quantumMaterialSourceHeatCapacityProxy: Number(quantumMaterialSource.heatCapacityProxy || 0),
    quantumMaterialSourceThermalDampingScale: Number(quantumMaterialSource.thermalDampingScale || 1),
    quantumMaterialSourceStatisticalPressureDriveProxy: Number(quantumMaterialSource.statisticalSourcePressureDriveProxy || 0),
    quantumMaterialSourceStatisticalOpacityDriveProxy: Number(quantumMaterialSource.statisticalSourceOpacityDriveProxy || 0),
    quantumMaterialSourceStatisticalIonizationDriveProxy: Number(quantumMaterialSource.statisticalSourceIonizationDriveProxy || 0),
    quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy: Number(quantumMaterialSource.statisticalSourceDegeneracyPressureDriveProxy || 0),
    quantumMaterialSourceStatisticalTemperatureDeltaKProxy: Number(quantumMaterialSource.statisticalSourceTemperatureDeltaKProxy || 0),
    quantumMaterialSourceStatisticalChargeDeltaProxy: Number(quantumMaterialSource.statisticalSourceChargeDeltaProxy || 0),
    quantumMaterialSourceStatisticalThermalDampingScale: Number(quantumMaterialSource.statisticalSourceThermalDampingScale || 1),
    quantumMaterialSourceBondOrderScale: Number(quantumMaterialSource.bondOrderScale || 1),
    quantumMaterialSourcePairForceScale: Number(quantumMaterialSource.pairForceScale || 1),
    quantumMaterialSourceRestLengthDeltaAngstrom: Number(quantumMaterialSource.restLengthDeltaAngstrom || 0),
    quantumMaterialSourcePairForceMix: Number(quantumMaterialSource.pairForceMix || 0),
    quantumMaterialSourceTargetPairLabel: quantumMaterialSource.targetPairLabel || 'all-pairs',
    quantumMaterialSourceTargetPairMode: quantumMaterialSource.targetPairMode || 'all-pairs',
    quantumMaterialSourceTargetPairBasis: quantumMaterialSource.targetPairBasis || 'no-target',
    quantumMaterialSourcePrimaryElementZ: Number(quantumMaterialSource.primaryElementZ || 0),
    quantumMaterialSourceSecondaryElementZ: Number(quantumMaterialSource.secondaryElementZ || 0),
    quantumMaterialSourcePairSelectivity: Number(quantumMaterialSource.pairSelectivity || 0),
    quantumMaterialSourcePairFallbackFactor: Number(quantumMaterialSource.pairFallbackFactor ?? 1),
    quantumMaterialSourceTargetMatchedAtomCount: Number(quantumMaterialSource.targetMatchedAtomCount || 0),
    quantumMaterialSourceTargetAtomCount: Number(quantumMaterialSource.targetAtomCount ?? quantumMaterialSource.targetMatchedAtomCount ?? 0),
    quantumMaterialSourceTargetFallbackAtomCount: Number(quantumMaterialSource.targetFallbackAtomCount || 0),
    quantumMaterialSourceTargetAtomWeightedFactorSum: Number(quantumMaterialSource.targetAtomWeightedFactorSum || 0),
    quantumMaterialSourceTargetAtomMeanFactor: Number(quantumMaterialSource.targetAtomMeanFactor || 0),
    quantumMaterialSourceTargetAtomFraction: Number(quantumMaterialSource.targetAtomFraction || 0),
    quantumMaterialSourceTargetPairCandidateCount: Number(quantumMaterialSource.targetPairCandidateCount || 0),
    quantumMaterialSourceTargetPairSelectedCount: Number(quantumMaterialSource.targetPairSelectedCount || 0),
    quantumMaterialSourceTargetPairFallbackCount: Number(quantumMaterialSource.targetPairFallbackCount || 0),
    quantumMaterialSourceTargetPairMeanFactor: Number(quantumMaterialSource.targetPairMeanFactor || 0),
    quantumMaterialSourceTargetPairFraction: Number(quantumMaterialSource.targetPairFraction || 0),
    reactionBarrierGatedCandidateCount: Number(bondSelection.reactionBarrierGatedCandidateCount || 0),
    reactionBarrierSuppressedCandidateCount: Number(bondSelection.reactionBarrierSuppressedCandidateCount || 0),
    reactionBarrierMeanDamping: Number(bondSelection.reactionBarrierMeanDamping || 1),
    quantumMaterialSourceTemperatureDeltaK: Number(quantumMaterialSource.temperatureAppliedDeltaK || 0),
    quantumMaterialSourceChargeDeltaProxy: Number(quantumMaterialSource.chargeDeltaProxy || 0),
    quantumMaterialSourceIonizationDrive: Number(quantumMaterialSource.ionizationDrive || 0),
    quantumMaterialSourceForceGradientDrive: Number(quantumMaterialSource.forceGradientDrive || 0),
    ulgStateDeltaSource,
    ulgStateDeltaApplied: ulgStateDeltaSource.applied === true,
    ulgStateDeltaAppliedChannelCount: Number(ulgStateDeltaSource.appliedChannelUpdateCount || 0),
    ulgStateDeltaTemperatureDeltaK: Number(ulgStateDeltaSource.temperatureAppliedDeltaK ?? ulgStateDeltaSource.temperatureDeltaK ?? 0),
    ulgStateDeltaChargeDeltaProxy: Number(ulgStateDeltaSource.chargeAppliedDeltaProxy ?? ulgStateDeltaSource.chargeDeltaProxy ?? 0),
    ulgStateDeltaVelocityDeltaProxy: Number(ulgStateDeltaSource.velocityAppliedDeltaProxy ?? ulgStateDeltaSource.velocityDeltaProxy ?? 0),
    ulgStateDeltaHash: ulgStateDeltaSource.stateDeltaHash || null,
    ulgStateDeltaApplicationMode: ulgStateDeltaSource.applicationMode || 'unavailable',
    ulgStateDeltaWebgpuKernelApplied: ulgStateDeltaSource.webgpuKernelApplied === true,
    species,
    molecularSpecies: reactionLedger.species,
    dominantMolecule: reactionLedger.dominantFormula,
    recognizedMoleculeCount: reactionLedger.recognizedMoleculeCount,
    stoichiometryResidualProxy: reactionLedger.stoichiometryResidualProxy,
    componentClosureFraction: reactionLedger.componentClosureFraction,
    reactionLedger,
    bonds
  };
}

function resolveStepOptions(input = {}) {
  const environment = input.environment || {};
  const coupling = input.coupling || {};
  return {
    dt: normalizeNumber(input.dt, 1 / 90, 0, 0.25),
    ambientTemperatureK: normalizeNumber(environment.ambientTemperatureK, 294, 1, 250000),
    ambientPressurePa: normalizeNumber(environment.ambientPressurePa, 101325, 0, 1e12),
    oxygenFraction: normalizeNumber(environment.oxygenFraction, 0.21, 0, 1),
    gravityMps2: normalizeNumber(environment.gravityMps2, 9.8, -1000, 1000),
    fireIntensity: normalizeNumber(coupling.fireIntensity ?? input.fireIntensity, 0, 0, 4),
    radiativeHeatFlux: normalizeNumber(coupling.radiativeHeatFlux ?? input.radiativeHeatFlux, 0, -1e6, 1e7),
    waterContact: normalizeNumber(coupling.waterContact ?? input.waterContact, 0, 0, 2),
    reactionProgress: normalizeNumber(coupling.reactionProgress ?? input.reactionProgress, 0, 0, 1),
    quantumCoupling: normalizeMolecularQuantumCoupling(
      coupling.quantumOrbital
        ?? coupling.quantumOrbitalClosure
        ?? input.quantumOrbital
        ?? input.quantumOrbitalClosure
        ?? input.closureResults?.quantumOrbital
    ),
    quantumMaterialSource: normalizeMolecularQuantumMaterialSource(
      coupling.quantumMaterialPotential
        ?? coupling.quantumMaterialPotentialClosure
        ?? input.quantumMaterialPotential
        ?? input.quantumMaterialPotentialClosure
        ?? input.closureResults?.quantumMaterialPotential,
      coupling.quantumMaterialPotentialClosure
        ?? input.quantumMaterialPotentialClosure
        ?? input.closureResults?.quantumMaterialPotential
    )
  };
}

function normalizeUlgRuntimeStateDelta(input = {}) {
  const source = input?.schema === 'peercompute.ulg.webgpu-state-delta.v0'
    ? input
    : input?.stateDelta?.schema === 'peercompute.ulg.webgpu-state-delta.v0'
      ? input.stateDelta
      : null;
  if (!source) {
    return {
      schema: MOLECULAR_ULG_STATE_SOURCE_SCHEMA,
      sourceSchema: null,
      applied: false,
      status: 'unavailable',
      readiness: 0,
      channelUpdateCount: 0,
      appliedChannelUpdateCount: 0,
      channelUpdates: [],
      temperatureDeltaK: 0,
      chargeDeltaProxy: 0,
      velocityDeltaProxy: 0,
      magneticDeltaProxy: 0,
      energyDeltaProxy: 0,
      normalizationCorrection: 0,
      stateDeltaHash: null
    };
  }
  const updates = Array.isArray(source.channelUpdates) ? source.channelUpdates : [];
  const byId = new Map(updates.map((update) => [update.channelId, update]));
  const deltaFor = (id) => normalizeNumber(byId.get(id)?.delta, 0, -1e9, 1e9);
  const applied = source.proxyStateApplied === true && source.ok === true;
  return {
    schema: MOLECULAR_ULG_STATE_SOURCE_SCHEMA,
    sourceSchema: source.schema,
    applied,
    status: source.status || 'unknown',
    mutationMode: source.mutationMode || null,
    readiness: normalizeNumber(source.readiness, 0, 0, 1),
    executedFraction: normalizeNumber(source.executedFraction, 0, 0, 1),
    channelUpdateCount: normalizeInteger(source.channelUpdateCount, updates.length, 0, 1024),
    appliedChannelUpdateCount: normalizeInteger(source.appliedChannelUpdateCount, applied ? updates.length : 0, 0, 1024),
    channelUpdates: updates.slice(0, 8).map((update) => ({
      channelId: update.channelId || 'channel:unknown',
      quantity: update.quantity || 'unknown',
      unit: update.unit || 'reduced',
      delta: normalizeNumber(update.delta, 0, -1e9, 1e9),
      status: update.status || null
    })),
    temperatureDeltaK: deltaFor('channel:temperature'),
    chargeDeltaProxy: deltaFor('channel:charge'),
    velocityDeltaProxy: deltaFor('channel:v'),
    magneticDeltaProxy: deltaFor('channel:magnetic-field'),
    energyDeltaProxy: deltaFor('channel:internal-energy'),
    normalizationCorrection: deltaFor('channel:wavefunction-normalization'),
    materialResponseDrive: normalizeNumber(source.materialResponse?.drive, 0, -1e9, 1e9),
    quantumResidualProxy: normalizeNumber(source.residuals?.quantumResidualProxy, 0, 0, 1e9),
    stateDeltaHash: source.stateDeltaHash || null
  };
}

function createUlgStateDeltaApplicationReport(ulgSource, {
  mix = 0.22,
  atomCount = 0,
  applicationMode = 'md-kernel-source-term-pending',
  webgpuKernelApplied = false
} = {}) {
  const source = normalizeUlgRuntimeStateDelta(ulgSource);
  const affectedAtomCount = source.applied ? normalizeInteger(atomCount, 0, 0, MOLECULAR_DYNAMICS_WEBGPU_MAX_ATOMS) : 0;
  const temperatureStep = clamp(source.temperatureDeltaK * mix, -35, 35);
  const chargeStep = clamp(source.chargeDeltaProxy * mix, -0.15, 0.15);
  const velocityStep = clamp(source.velocityDeltaProxy * mix, -0.08, 0.08);
  const magneticStep = clamp(source.magneticDeltaProxy * mix, -0.08, 0.08);
  return {
    ...source,
    temperatureAppliedDeltaK: source.applied ? temperatureStep : 0,
    chargeAppliedDeltaProxy: source.applied ? chargeStep : 0,
    velocityAppliedDeltaProxy: source.applied ? velocityStep : 0,
    magneticAppliedDeltaProxy: source.applied ? magneticStep : 0,
    affectedAtomCount,
    applicationMode: source.applied ? applicationMode : 'unavailable',
    webgpuKernelApplied: source.applied && webgpuKernelApplied,
    shaderParamVersion: 'molecular-ulg-source-params-v0'
  };
}

function attachUlgStateDeltaApplicationToState(state, sourceReport, {
  applicationMode = 'md-kernel-source-term-pending',
  webgpuKernelApplied = false
} = {}) {
  const source = sourceReport?.schema === MOLECULAR_ULG_STATE_SOURCE_SCHEMA
    ? sourceReport
    : createUlgStateDeltaApplicationReport(sourceReport, { atomCount: state.atomCount, applicationMode, webgpuKernelApplied });
  const report = {
    ...source,
    affectedAtomCount: source.applied ? state.atomCount : 0,
    applicationMode: source.applied ? applicationMode : (source.applicationMode || 'unavailable'),
    webgpuKernelApplied: source.applied && webgpuKernelApplied
  };
  state.ulgStateDeltaSource = report;
  return report;
}

function applyUlgStateDeltaReportToState(state, sourceReport, {
  applicationMode = 'cpu-md-source-term',
  webgpuKernelApplied = false
} = {}) {
  const source = sourceReport?.schema === MOLECULAR_ULG_STATE_SOURCE_SCHEMA
    ? sourceReport
    : createUlgStateDeltaApplicationReport(sourceReport, { atomCount: state.atomCount, applicationMode, webgpuKernelApplied });
  if (!source.applied || !state.atomCount) {
    return attachUlgStateDeltaApplicationToState(state, source, { applicationMode, webgpuKernelApplied });
  }
  const temperatureStep = normalizeNumber(source.temperatureAppliedDeltaK, 0, -35, 35);
  const chargeStep = normalizeNumber(source.chargeAppliedDeltaProxy, 0, -0.15, 0.15);
  const velocityStep = normalizeNumber(source.velocityAppliedDeltaProxy, 0, -0.08, 0.08);
  const magneticStep = normalizeNumber(source.magneticAppliedDeltaProxy, 0, -0.08, 0.08);
  for (let i = 0; i < state.atomCount; i += 1) {
    state.temperatureK[i] = clamp(state.temperatureK[i] + temperatureStep, 1, 250000);
    state.partialCharge[i] = clamp(state.partialCharge[i] + chargeStep, -1.4, 1.4);
    state.velocitiesY[i] = clamp(state.velocitiesY[i] + velocityStep, -100, 100);
    const parity = i % 2 === 0 ? 1 : -1;
    state.velocitiesX[i] = clamp(state.velocitiesX[i] + magneticStep * parity * 0.5, -100, 100);
    state.velocitiesZ[i] = clamp(state.velocitiesZ[i] - magneticStep * parity * 0.5, -100, 100);
  }
  const report = {
      ...source,
      temperatureAppliedDeltaK: temperatureStep,
      chargeAppliedDeltaProxy: chargeStep,
      velocityAppliedDeltaProxy: velocityStep,
      magneticAppliedDeltaProxy: magneticStep,
      affectedAtomCount: state.atomCount,
      applicationMode,
      webgpuKernelApplied: source.applied && webgpuKernelApplied
  };
  state.ulgStateDeltaSource = report;
  return report;
}

function applyUlgStateDeltaToState(state, ulgSource, { mix = 0.22 } = {}) {
  const report = createUlgStateDeltaApplicationReport(ulgSource, {
    mix,
    atomCount: state.atomCount,
    applicationMode: 'cpu-pre-md-step-source-term'
  });
  return applyUlgStateDeltaReportToState(state, report, {
    applicationMode: 'cpu-pre-md-step-source-term',
    webgpuKernelApplied: false
  });
}

function createQuantumCouplingApplicationReport(state, quantumCoupling, {
  mix = 0.08,
  applicationMode = 'md-kernel-source-term-pending',
  webgpuKernelApplied = false
} = {}) {
  const coupling = normalizeMolecularQuantumCoupling(quantumCoupling);
  let matchedAtomCount = 0;
  if (coupling.active && state.atomCount) {
    for (let i = 0; i < state.atomCount; i += 1) {
      if (Number(state.elementZ[i]) === coupling.atomicNumber) matchedAtomCount += 1;
    }
  }
  const adjustment = quantumAdjustmentForElement(coupling.atomicNumber, coupling);
  const sourceMix = normalizeNumber(mix, 0.08, 0, 1);
  const targetCharge = clamp(
    initialChargeForElement(coupling.atomicNumber, coupling)
      + adjustment.ionizationDrive * 0.22
      + adjustment.evolutionDrive * 0.12,
    -1.4,
    1.4
  );
  const temperatureStep = clamp(
    (adjustment.ionizationDrive * 18 + adjustment.evolutionDrive * 28) * sourceMix,
    -60,
    60
  );
  const applied = coupling.active && matchedAtomCount > 0;
  return {
    schema: MOLECULAR_QUANTUM_SOURCE_SCHEMA,
    sourceSchema: coupling.schema,
    coupling,
    applied,
    active: coupling.active,
    elementSymbol: coupling.elementSymbol,
    atomicNumber: coupling.atomicNumber,
    matchedAtomCount,
    targetCharge,
    chargeMix: applied ? sourceMix : 0,
    temperatureAppliedDeltaK: applied ? temperatureStep : 0,
    bondOrderScale: applied ? adjustment.bondOrderScale : 1,
    chargeBias: adjustment.chargeBias,
    electronegativityDelta: adjustment.electronegativityDelta,
    ionizationDrive: adjustment.ionizationDrive,
    evolutionDrive: adjustment.evolutionDrive,
    confidence: coupling.confidence,
    wavefunctionEvolutionSchema: coupling.wavefunctionEvolutionSchema,
    wavefunctionEvolutionSource: coupling.wavefunctionEvolutionSource,
    wavefunctionEvolutionBackend: coupling.wavefunctionEvolutionBackend,
    wavefunctionEvolutionStatus: coupling.wavefunctionEvolutionStatus,
    wavefunctionEvolutionNormDrift: coupling.wavefunctionEvolutionNormDrift,
    wavefunctionEvolutionDensityDriftL1: coupling.wavefunctionEvolutionDensityDriftL1,
    wavefunctionEvolutionEnergyExpectationEv: coupling.wavefunctionEvolutionEnergyExpectationEv,
    wavefunctionEvolutionKineticExpectationEv: coupling.wavefunctionEvolutionKineticExpectationEv,
    wavefunctionEvolutionPotentialExpectationEv: coupling.wavefunctionEvolutionPotentialExpectationEv,
    wavefunctionEvolutionFieldEnergyExpectationEv: coupling.wavefunctionEvolutionFieldEnergyExpectationEv,
    wavefunctionEvolutionAbsFieldEnergyExpectationEv: coupling.wavefunctionEvolutionAbsFieldEnergyExpectationEv,
    wavefunctionEvolutionElectricFieldVm: coupling.wavefunctionEvolutionElectricFieldVm,
    wavefunctionEvolutionElectricFieldAtomicUnits: coupling.wavefunctionEvolutionElectricFieldAtomicUnits,
    wavefunctionEvolutionDipoleMomentZBohrElectron: coupling.wavefunctionEvolutionDipoleMomentZBohrElectron,
    wavefunctionEvolutionFieldRmsExtentBohr: coupling.wavefunctionEvolutionFieldRmsExtentBohr,
    wavefunctionEvolutionPolarizabilityProxyBohr3: coupling.wavefunctionEvolutionPolarizabilityProxyBohr3,
    wavefunctionEvolutionStarkShiftProxyEv: coupling.wavefunctionEvolutionStarkShiftProxyEv,
    wavefunctionEvolutionFieldResponseSchema: coupling.wavefunctionEvolutionFieldResponseSchema,
    wavefunctionEvolutionMagneticFieldT: coupling.wavefunctionEvolutionMagneticFieldT,
    wavefunctionEvolutionMagneticFieldAtomicUnits: coupling.wavefunctionEvolutionMagneticFieldAtomicUnits,
    wavefunctionEvolutionZeemanEnergyExpectationEv: coupling.wavefunctionEvolutionZeemanEnergyExpectationEv,
    wavefunctionEvolutionAbsZeemanEnergyExpectationEv: coupling.wavefunctionEvolutionAbsZeemanEnergyExpectationEv,
    wavefunctionEvolutionMagneticMomentProjectionBohrMagneton: coupling.wavefunctionEvolutionMagneticMomentProjectionBohrMagneton,
    wavefunctionEvolutionZeemanProjection: coupling.wavefunctionEvolutionZeemanProjection,
    wavefunctionEvolutionSpinProjection: coupling.wavefunctionEvolutionSpinProjection,
    wavefunctionEvolutionLarmorAngularFrequencyProxyAu: coupling.wavefunctionEvolutionLarmorAngularFrequencyProxyAu,
    wavefunctionEvolutionMagneticResponseSchema: coupling.wavefunctionEvolutionMagneticResponseSchema,
    wavefunctionEvolutionComponentEnergyExpectationEv: coupling.wavefunctionEvolutionComponentEnergyExpectationEv,
    wavefunctionEvolutionHamiltonianComponentResidualEv: coupling.wavefunctionEvolutionHamiltonianComponentResidualEv,
    wavefunctionEvolutionVirialResidualEv: coupling.wavefunctionEvolutionVirialResidualEv,
    wavefunctionEvolutionHamiltonianComponentsSchema: coupling.wavefunctionEvolutionHamiltonianComponentsSchema,
    wavefunctionEvolutionPhaseRotationRad: coupling.wavefunctionEvolutionPhaseRotationRad,
    wavefunctionEvolutionWebgpuParityOk: coupling.wavefunctionEvolutionWebgpuParityOk,
    wavefunctionEvolutionWebgpuExecuted: coupling.wavefunctionEvolutionWebgpuExecuted === true,
    wavefunctionEvolutionLiveBackendPolicy: coupling.wavefunctionEvolutionLiveBackendPolicy,
    radialEigenstateSchema: coupling.radialEigenstateSchema,
    radialEigenstateSource: coupling.radialEigenstateSource,
    radialEigenstateStatus: coupling.radialEigenstateStatus,
    radialEigenstateEnergyEv: coupling.radialEigenstateEnergyEv,
    radialEigenstateEnergyErrorEv: coupling.radialEigenstateEnergyErrorEv,
    radialEigenstateResidualRelativeL2: coupling.radialEigenstateResidualRelativeL2,
    radialEigenstateMeanRadiusBohr: coupling.radialEigenstateMeanRadiusBohr,
    radialEigenstateGridPointCount: coupling.radialEigenstateGridPointCount,
    radialEigenstateWebgpuExecuted: coupling.radialEigenstateWebgpuExecuted === true,
    statisticalBridgeSchema: coupling.statisticalBridgeSchema,
    statisticalBridgeSource: coupling.statisticalBridgeSource,
    statisticalBridgeStatus: coupling.statisticalBridgeStatus,
    statisticalBridgeBackend: coupling.statisticalBridgeBackend,
    statisticalBridgePartitionFunctionLog: coupling.statisticalBridgePartitionFunctionLog,
    statisticalBridgeExcitedOccupation: coupling.statisticalBridgeExcitedOccupation,
    statisticalBridgeFreeEnergyEv: coupling.statisticalBridgeFreeEnergyEv,
    statisticalBridgeInternalEnergyEv: coupling.statisticalBridgeInternalEnergyEv,
    statisticalBridgeHeatCapacityProxy: coupling.statisticalBridgeHeatCapacityProxy,
    statisticalBridgeEntropyProxyKb: coupling.statisticalBridgeEntropyProxyKb,
    statisticalBridgeIonizationFraction: coupling.statisticalBridgeIonizationFraction,
    statisticalBridgeOpacityPopulationProxy: coupling.statisticalBridgeOpacityPopulationProxy,
    statisticalBridgeDegeneracyParameter: coupling.statisticalBridgeDegeneracyParameter,
    statisticalBridgeEnsemblePressurePa: coupling.statisticalBridgeEnsemblePressurePa,
    statisticalBridgeTemperatureDeltaKProxy: coupling.statisticalBridgeTemperatureDeltaKProxy,
    statisticalBridgeChargeDeltaProxy: coupling.statisticalBridgeChargeDeltaProxy,
    statisticalBridgeThermalDampingScale: coupling.statisticalBridgeThermalDampingScale,
    statisticalBridgeWebgpuExecuted: coupling.statisticalBridgeWebgpuExecuted === true,
    statisticalBridgeDrive: coupling.statisticalBridgeDrive,
    applicationMode: applied ? applicationMode : 'unavailable',
    webgpuKernelApplied: applied && webgpuKernelApplied,
    shaderParamVersion: 'molecular-quantum-source-params-v0'
  };
}

function attachQuantumCouplingApplicationToState(state, report, {
  applicationMode = 'md-kernel-source-term-pending',
  webgpuKernelApplied = false
} = {}) {
  const source = report?.schema === MOLECULAR_QUANTUM_SOURCE_SCHEMA
    ? report
    : createQuantumCouplingApplicationReport(state, report, { applicationMode, webgpuKernelApplied });
  const nextReport = {
    ...source,
    applicationMode: source.applied ? applicationMode : (source.applicationMode || 'unavailable'),
    webgpuKernelApplied: source.applied && webgpuKernelApplied
  };
  state.quantumCoupling = normalizeMolecularQuantumCoupling(nextReport.coupling);
  state.quantumCouplingApplication = nextReport;
  return nextReport;
}

function applyQuantumCouplingReportToState(state, report, {
  applicationMode = 'cpu-md-quantum-source-term',
  webgpuKernelApplied = false
} = {}) {
  const source = report?.schema === MOLECULAR_QUANTUM_SOURCE_SCHEMA
    ? report
    : createQuantumCouplingApplicationReport(state, report, { applicationMode, webgpuKernelApplied });
  state.quantumCoupling = normalizeMolecularQuantumCoupling(source.coupling);
  if (!source.applied || !state.atomCount) {
    return attachQuantumCouplingApplicationToState(state, source, { applicationMode, webgpuKernelApplied });
  }
  for (let i = 0; i < state.atomCount; i += 1) {
    if (Number(state.elementZ[i]) !== source.atomicNumber) continue;
    state.partialCharge[i] = clamp(
      state.partialCharge[i] * (1 - source.chargeMix) + source.targetCharge * source.chargeMix,
      -1.4,
      1.4
    );
    state.temperatureK[i] = clamp(state.temperatureK[i] + source.temperatureAppliedDeltaK, 1, 250000);
  }
  return attachQuantumCouplingApplicationToState(state, source, { applicationMode, webgpuKernelApplied });
}

function applyQuantumCouplingToState(state, quantumCoupling, { mix = 0.08 } = {}) {
  const report = createQuantumCouplingApplicationReport(state, quantumCoupling, {
    mix,
    applicationMode: 'cpu-pre-md-quantum-source-term',
    webgpuKernelApplied: false
  });
  applyQuantumCouplingReportToState(state, report, {
    applicationMode: 'cpu-pre-md-quantum-source-term',
    webgpuKernelApplied: false
  });
  if (!report.applied) return {
    applied: false,
    matchedAtomCount: 0
  };
  return {
    applied: true,
    matchedAtomCount: report.matchedAtomCount
  };
}

function createQuantumMaterialSourceApplicationReport(state, quantumMaterialSource, {
  applicationMode = 'md-kernel-material-source-term-pending',
  webgpuKernelApplied = false
} = {}) {
  const source = normalizeMolecularQuantumMaterialSource(quantumMaterialSource);
  const matchedAtomCount = source.applied ? normalizeInteger(state?.atomCount, 0, 0, MOLECULAR_DYNAMICS_WEBGPU_MAX_ATOMS) : 0;
  const targetPairSummary = summarizeQuantumMaterialTargetPairs(state, source);
  return {
    ...source,
    ...targetPairSummary,
    applied: source.applied && matchedAtomCount > 0,
    active: source.active && matchedAtomCount > 0,
    matchedAtomCount,
    applicationMode: source.applied && matchedAtomCount > 0 ? applicationMode : 'unavailable',
    webgpuKernelApplied: source.applied && matchedAtomCount > 0 && webgpuKernelApplied === true,
    shaderParamVersion: 'molecular-quantum-material-source-params-v1'
  };
}

function attachQuantumMaterialSourceToState(state, report, {
  applicationMode = 'md-kernel-material-source-term-pending',
  webgpuKernelApplied = false
} = {}) {
  const source = report?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
    ? report
    : createQuantumMaterialSourceApplicationReport(state, report, { applicationMode, webgpuKernelApplied });
  const nextReport = {
    ...source,
    applicationMode: source.applied ? applicationMode : (source.applicationMode || 'unavailable'),
    webgpuKernelApplied: source.applied && webgpuKernelApplied === true
  };
  state.quantumMaterialSource = nextReport;
  return nextReport;
}

function stepMolecularDynamicsCpu(state, options) {
  const next = cloneState(state);
  const quantumCoupling = normalizeMolecularQuantumCoupling(options.quantumCoupling);
  const quantumMaterialSource = normalizeMolecularQuantumMaterialSource(options.quantumMaterialSource);
  const materialActive = quantumMaterialSource.applied === true;
  const materialBondScale = materialActive ? normalizeNumber(quantumMaterialSource.bondOrderScale, 1, 0.5, 1.8) : 1;
  const materialForceGradientDrive = materialActive ? normalizeNumber(quantumMaterialSource.forceGradientDrive, 0, 0, 1) : 0;
  const materialPairForceScale = materialActive ? normalizeNumber(quantumMaterialSource.pairForceScale, 1, 0.5, 1.8) : 1;
  const materialRestLengthDeltaAngstrom = materialActive ? normalizeNumber(quantumMaterialSource.restLengthDeltaAngstrom, 0, -0.08, 0.08) : 0;
  const materialPairForceMix = materialActive ? normalizeNumber(quantumMaterialSource.pairForceMix, 0, 0, 1) : 0;
  const materialBehaviorDrive = materialActive ? normalizeNumber(quantumMaterialSource.behaviorDrive, 0, 0, 64) : 0;
  const materialIonizationDrive = materialActive ? normalizeNumber(quantumMaterialSource.ionizationDrive, 0, 0, 1) : 0;
  const materialTemperatureDeltaK = materialActive ? normalizeNumber(quantumMaterialSource.temperatureAppliedDeltaK, 0, -60, 60) : 0;
  const materialChargeDeltaProxy = materialActive ? normalizeNumber(quantumMaterialSource.chargeDeltaProxy, 0, -0.2, 0.2) : 0;
  const materialEnsemblePressureDrive = materialActive ? normalizeNumber(quantumMaterialSource.ensemblePressureDrive, 0, -1, 1) : 0;
  const materialThermalDampingScale = materialActive ? normalizeNumber(quantumMaterialSource.thermalDampingScale, 1, 0.5, 1.5) : 1;
  const materialConductivityDrive = materialActive ? normalizeNumber(quantumMaterialSource.conductivityDrive, 0, 0, 1.5) : 0;
  const materialDielectricDrive = materialActive ? normalizeNumber(quantumMaterialSource.dielectricDrive, 0, 0, 1.5) : 0;
  const materialStiffnessDrive = materialActive ? normalizeNumber(quantumMaterialSource.mechanicalStiffnessDrive, 0, 0, 1.5) : 0;
  const materialOpticalAbsorptionDrive = materialActive ? normalizeNumber(quantumMaterialSource.opticalAbsorptionDrive, 0, 0, 1.5) : 0;
  const geometryTargets = molecularGeometryTargetsFromQuantumMaterialSource(quantumMaterialSource);
  const geometrySourceScale = clamp(0.85 + (geometryTargets.sourceApplied ? geometryTargets.confidence : 0) * 0.35, 0.7, 1.25);
  const geometryDistanceScale = geometryTargets.distanceStiffnessProxy * geometrySourceScale;
  const geometryAngleScale = geometryTargets.angleStiffnessProxy * geometrySourceScale;
  const { neighborLists } = buildNeighborLists(state, MOLECULAR_DYNAMICS_FORCE_RADIUS);
  for (let i = 0; i < state.atomCount; i += 1) {
    let fx = 0;
    let fy = -0.00008 * options.gravityMps2 * state.massesAmu[i];
    let fz = 0;
    let nearO = 0;
    let nearC = 0;
    let nearH = 0;
    const x = state.positionsX[i];
    const y = state.positionsY[i];
    const z = state.positionsZ[i];
    const element = state.elementZ[i];
    const charge = state.partialCharge[i];
    const quantumAdjustment = quantumAdjustmentForElement(element, quantumCoupling);
    let materialNeighborFactorSum = 0;
    let materialNeighborFactorCount = 0;
    let waterH1Delta = null;
    let waterH2Delta = null;
    let waterH1Dist = Infinity;
    let waterH2Dist = Infinity;
    for (const j of neighborLists[i]) {
      const dx = state.positionsX[j] - x;
      const dy = state.positionsY[j] - y;
      const dz = state.positionsZ[j] - z;
      const distanceSquared = Math.max(0.0025, dx * dx + dy * dy + dz * dz);
      const distance = Math.sqrt(distanceSquared);
      const invDistance = 1 / distance;
      const pairRestLength = molecularPairRestLengthReducedNm(element, state.elementZ[j]);
      const pairAffinity = molecularPairAffinity(element, state.elementZ[j]);
      let materialPairTargetFactor = materialActive
        ? quantumMaterialPairTargetFactorForElements(element, state.elementZ[j], quantumMaterialSource)
        : 0;
      if (materialActive) {
        materialPairTargetFactor *= reactionBarrierDampingForPair(element, state.elementZ[j], quantumMaterialSource);
      }
      if (materialActive) {
        materialNeighborFactorSum += materialPairTargetFactor;
        materialNeighborFactorCount += 1;
      }
      const localMaterialBondScale = 1 + (materialBondScale - 1) * materialPairTargetFactor;
      const localMaterialPairForceScale = 1 + (materialPairForceScale - 1) * materialPairTargetFactor;
      const localMaterialPairForceMix = materialPairForceMix * materialPairTargetFactor;
      const localMaterialPressureDrive = materialEnsemblePressureDrive * materialPairTargetFactor;
      const localMaterialStiffnessScale = clamp(1 + materialStiffnessDrive * materialPairTargetFactor * 0.045, 0.92, 1.12);
      const materialRestLength = Math.max(
        0.045,
        pairRestLength + materialRestLengthDeltaAngstrom * localMaterialPairForceMix - localMaterialPressureDrive * 0.006
      );
      const bondPull = clamp((materialRestLength - distance) / materialRestLength, -0.8, 1.4);
      const thermalBreak = clamp((state.temperatureK[i] - 850) / 1600, 0, 0.75);
      const repulse = clamp(0.055 / distanceSquared - 0.06, -0.05, 1.8);
      const coulomb = clamp(charge * state.partialCharge[j] * 0.006 / distanceSquared, -0.4, 0.4);
      const materialBondPull = (
        bondPull * localMaterialBondScale
          + materialForceGradientDrive * materialPairTargetFactor * (0.04 + localMaterialPairForceMix * 0.025)
      ) * localMaterialPairForceScale * clamp(1 + localMaterialPressureDrive * 0.16, 0.84, 1.16) * localMaterialStiffnessScale * pairAffinity;
      const scale = (materialBondPull * (1 - thermalBreak) - repulse - coulomb) * 0.018;
      fx += dx * invDistance * scale;
      fy += dy * invDistance * scale;
      fz += dz * invDistance * scale;
      const geometryThermalScale = 1 - clamp((state.temperatureK[i] - 900) / 2800, 0, 0.62);
      const otherElement = state.elementZ[j];
      const waterOhPair = (element === ELEMENT.O && otherElement === ELEMENT.H)
        || (element === ELEMENT.H && otherElement === ELEMENT.O);
      if (waterOhPair) {
        const ohError = clamp((distance - geometryTargets.targetOhDistanceReducedNm) / geometryTargets.targetOhDistanceReducedNm, -1, 1.5);
        const geometryScale = ohError * 0.07 * geometryThermalScale * geometryDistanceScale;
        fx += dx * invDistance * geometryScale;
        fy += dy * invDistance * geometryScale;
        fz += dz * invDistance * geometryScale;
      }
      if (element === ELEMENT.H && otherElement === ELEMENT.H && distance < 0.24) {
        const hhCompression = clamp((geometryTargets.targetHhDistanceReducedNm - distance) / geometryTargets.targetHhDistanceReducedNm, 0, 1.4);
        const geometryScale = hhCompression * 0.028 * geometryThermalScale * geometryDistanceScale;
        fx -= dx * invDistance * geometryScale;
        fy -= dy * invDistance * geometryScale;
        fz -= dz * invDistance * geometryScale;
      }
      if (element === ELEMENT.O && otherElement === ELEMENT.H && distance < 0.22) {
        const candidate = { x: dx, y: dy, z: dz };
        if (distance < waterH1Dist) {
          waterH2Dist = waterH1Dist;
          waterH2Delta = waterH1Delta;
          waterH1Dist = distance;
          waterH1Delta = candidate;
        } else if (distance < waterH2Dist) {
          waterH2Dist = distance;
          waterH2Delta = candidate;
        }
      }
      if (distance < 0.22) {
        if (state.elementZ[j] === ELEMENT.O) nearO += 1;
        if (state.elementZ[j] === ELEMENT.C) nearC += 1;
        if (state.elementZ[j] === ELEMENT.H) nearH += 1;
      }
    }
    if (element === ELEMENT.O && waterH1Delta && waterH2Delta && waterH2Dist < 0.22) {
      const h1Inv = 1 / Math.max(1e-6, waterH1Dist);
      const h2Inv = 1 / Math.max(1e-6, waterH2Dist);
      const h1x = waterH1Delta.x * h1Inv;
      const h1y = waterH1Delta.y * h1Inv;
      const h1z = waterH1Delta.z * h1Inv;
      const h2x = waterH2Delta.x * h2Inv;
      const h2y = waterH2Delta.y * h2Inv;
      const h2z = waterH2Delta.z * h2Inv;
      const bisectorX = h1x + h2x;
      const bisectorY = h1y + h2y;
      const bisectorZ = h1z + h2z;
      const bisectorLength = Math.hypot(bisectorX, bisectorY, bisectorZ);
      if (bisectorLength > 0.05) {
        const cosTheta = clamp(h1x * h2x + h1y * h2y + h1z * h2z, -0.98, 0.98);
        const angleError = clamp(cosTheta - geometryTargets.targetAngleCos, -0.85, 0.85);
        const geometryThermalScale = 1 - clamp((state.temperatureK[i] - 900) / 2800, 0, 0.62);
	        const geometryScale = angleError * 0.032 * geometryThermalScale * geometryAngleScale / bisectorLength;
        fx += bisectorX * geometryScale;
        fy += bisectorY * geometryScale;
        fz += bisectorZ * geometryScale;
      }
    }
    const materialAtomTargetFactor = materialActive
      ? quantumMaterialAtomTargetFactorForElement(element, quantumMaterialSource)
      : 0;
    const materialNeighborTargetFactor = materialNeighborFactorCount > 0
      ? materialNeighborFactorSum / materialNeighborFactorCount
      : 0;
    const materialSourceBarrierDamping = materialActive
      ? reactionBarrierDampingForElement(element, quantumMaterialSource)
      : 1;
    const materialSourceTargetFactor = materialActive
      ? clamp(Math.max(materialAtomTargetFactor, materialNeighborTargetFactor * 0.65) * materialSourceBarrierDamping, 0, 1)
      : 0;
    const heatDrive = options.fireIntensity * 22 + options.radiativeHeatFlux * 0.025 + materialBehaviorDrive * 0.8 * materialSourceTargetFactor;
    const opticalMaterialHeatDrive = (
      materialOpticalAbsorptionDrive * options.radiativeHeatFlux * 0.0006
        + materialConductivityDrive * 1.2
    ) * materialSourceTargetFactor;
    const oxygenDrive = options.oxygenFraction * Math.max(0, nearC + nearH * 0.2) * 0.25;
    const cool = options.waterContact * Math.max(0, state.temperatureK[i] - options.ambientTemperatureK) * 0.08;
    const temperature = clamp(
      state.temperatureK[i]
        + materialTemperatureDeltaK * materialSourceTargetFactor * materialThermalDampingScale
        + materialEnsemblePressureDrive * materialSourceTargetFactor * 8
        + options.dt * (
          heatDrive
            + opticalMaterialHeatDrive
            + materialEnsemblePressureDrive * 2.5 * materialSourceTargetFactor
            + oxygenDrive
            - cool
            - (state.temperatureK[i] - options.ambientTemperatureK) * 0.018 / Math.max(0.35, materialThermalDampingScale)
        ),
      1,
      250000
    );
    const ionDrive = clamp(
      (temperature - 1200) / 4200
        + options.fireIntensity * 0.08
        + materialIonizationDrive * materialSourceTargetFactor
        + materialConductivityDrive * materialSourceTargetFactor * 0.018
        + materialOpticalAbsorptionDrive * materialSourceTargetFactor * 0.006,
      0,
      0.45
    );
    const materialChargeSign = isMetalElement(element) ? 1 : [ELEMENT.O, ELEMENT.F, ELEMENT.Cl].includes(element) ? -1 : 0.5;
    next.partialCharge[i] = clamp(
      state.partialCharge[i] * 0.995
        + ionDrive * (element === ELEMENT.O ? 0.012 : -0.01)
        + quantumAdjustment.ionizationDrive * 0.06
        + quantumAdjustment.chargeBias * 0.018
        + materialChargeDeltaProxy * materialChargeSign * materialSourceTargetFactor
        + materialConductivityDrive * materialChargeSign * materialSourceTargetFactor * 0.008
        - materialDielectricDrive * state.partialCharge[i] * materialSourceTargetFactor * 0.006
        + nearO * 0.0003
        - nearH * 0.00015,
      -1.4,
      1.4
    );
    const damping = clamp(0.999 - options.ambientPressurePa * 0.00000000004 - options.waterContact * 0.006, 0.9, 0.9995);
    next.velocitiesX[i] = (state.velocitiesX[i] + (fx / state.massesAmu[i]) * options.dt) * damping;
    next.velocitiesY[i] = (state.velocitiesY[i] + (fy / state.massesAmu[i]) * options.dt) * damping;
    next.velocitiesZ[i] = (state.velocitiesZ[i] + (fz / state.massesAmu[i]) * options.dt) * damping;
    next.positionsX[i] = state.positionsX[i] + next.velocitiesX[i] * options.dt;
    next.positionsY[i] = state.positionsY[i] + next.velocitiesY[i] * options.dt;
    next.positionsZ[i] = state.positionsZ[i] + next.velocitiesZ[i] * options.dt;
    const radius = Math.hypot(next.positionsX[i], next.positionsY[i], next.positionsZ[i]);
    if (radius > 1.85) {
      const scale = 1.85 / radius;
      next.positionsX[i] *= scale;
      next.positionsY[i] *= scale;
      next.positionsZ[i] *= scale;
      next.velocitiesX[i] *= -0.32;
      next.velocitiesY[i] *= -0.32;
      next.velocitiesZ[i] *= -0.32;
    }
    next.temperatureK[i] = temperature;
	  }
	  applySeededWaterTopologyProjection(next, {
	    dt: options.dt,
	    quantumMaterialSource,
	    strength: materialActive ? 0.74 : 0.58
	  });
	  applyQuantumMaterialProductTopologyMutation(next, quantumMaterialSource, {
	    sourceMode: 'cpu-reference-post-integrate-topology-commit'
	  });
	  next.reactionProgress = clamp(state.reactionProgress * 0.98 + options.reactionProgress * 0.01 + options.fireIntensity * options.oxygenFraction * 0.01, 0, 1);
  next.elapsedTime += options.dt;
  return next;
}

class MolecularDynamicsWebGpuRuntime {
  constructor(stateKey) {
    this.stateKey = stateKey;
    this.device = null;
    this.referencePipeline = null;
    this.clearGridPipeline = null;
    this.buildGridPipeline = null;
    this.neighborListPipeline = null;
    this.integratePipeline = null;
    this.currentBuffer = null;
    this.nextBuffer = null;
    this.readBuffer = null;
    this.paramBuffer = null;
    this.gridCountBuffer = null;
    this.gridAtomBuffer = null;
    this.neighborCountBuffer = null;
    this.neighborIndexBuffer = null;
    this.neighborStatsBuffer = null;
    this.neighborStatsReadBuffer = null;
    this.atomCount = 0;
    this.submittedSteps = 0;
    this.lastError = null;
    this.neighborListAvailable = false;
    this.neighborValidationError = null;
  }

  async initialize(atomCount) {
    if (this.device && this.atomCount === atomCount) return;
    const gpu = globalThis.navigator?.gpu;
    if (!gpu) throw new Error('WebGPU unavailable for molecular-dynamics worker');
    const usage = globalThis.GPUBufferUsage;
    if (!usage) throw new Error('GPUBufferUsage unavailable for molecular-dynamics worker');
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('No WebGPU adapter available for molecular-dynamics worker');
    this.device = await adapter.requestDevice();
    this.atomCount = atomCount;
    const atomBytes = atomCount * ATOM_FLOATS * Float32Array.BYTES_PER_ELEMENT;
    const uintBytes = Uint32Array.BYTES_PER_ELEMENT;
    const gridCountBytes = MOLECULAR_NEIGHBOR_CELL_COUNT * uintBytes;
    const gridAtomBytes = MOLECULAR_NEIGHBOR_CELL_COUNT * MOLECULAR_NEIGHBOR_MAX_CELL_OCCUPANCY * uintBytes;
    const neighborCountBytes = atomCount * uintBytes;
    const neighborIndexBytes = atomCount * MOLECULAR_NEIGHBOR_MAX_NEIGHBORS_PER_ATOM * uintBytes;
    const statsBytes = MOLECULAR_NEIGHBOR_STATS_UINTS * uintBytes;
    this.currentBuffer = this.device.createBuffer({ size: atomBytes, usage: usage.STORAGE | usage.COPY_DST });
    this.nextBuffer = this.device.createBuffer({ size: atomBytes, usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST });
    this.readBuffer = this.device.createBuffer({ size: atomBytes, usage: usage.COPY_DST | usage.MAP_READ });
    this.paramBuffer = this.device.createBuffer({ size: PARAM_BYTES, usage: usage.UNIFORM | usage.COPY_DST });
    this.gridCountBuffer = this.device.createBuffer({ size: gridCountBytes, usage: usage.STORAGE | usage.COPY_DST });
    this.gridAtomBuffer = this.device.createBuffer({ size: gridAtomBytes, usage: usage.STORAGE | usage.COPY_DST });
    this.neighborCountBuffer = this.device.createBuffer({ size: neighborCountBytes, usage: usage.STORAGE | usage.COPY_DST });
    this.neighborIndexBuffer = this.device.createBuffer({ size: neighborIndexBytes, usage: usage.STORAGE | usage.COPY_DST });
    this.neighborStatsBuffer = this.device.createBuffer({ size: statsBytes, usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST });
    this.neighborStatsReadBuffer = this.device.createBuffer({ size: statsBytes, usage: usage.COPY_DST | usage.MAP_READ });
    this.device.pushErrorScope?.('validation');
    this.referencePipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: this.device.createShaderModule({ code: MOLECULAR_SHADER }),
        entryPoint: 'main'
      }
    });
    const validationError = await this.device.popErrorScope?.();
    if (validationError) {
      throw new Error(`Molecular dynamics WebGPU validation: ${validationError.message || validationError}`);
    }
    this.neighborListAvailable = false;
    this.neighborValidationError = null;
    try {
      this.device.pushErrorScope?.('validation');
      this.clearGridPipeline = this.device.createComputePipeline({
        layout: 'auto',
        compute: {
          module: this.device.createShaderModule({ code: MOLECULAR_NEIGHBOR_CLEAR_SHADER }),
          entryPoint: 'main'
        }
      });
      this.buildGridPipeline = this.device.createComputePipeline({
        layout: 'auto',
        compute: {
          module: this.device.createShaderModule({ code: MOLECULAR_NEIGHBOR_BUILD_GRID_SHADER }),
          entryPoint: 'main'
        }
      });
      this.neighborListPipeline = this.device.createComputePipeline({
        layout: 'auto',
        compute: {
          module: this.device.createShaderModule({ code: MOLECULAR_NEIGHBOR_LIST_SHADER }),
          entryPoint: 'main'
        }
      });
      this.integratePipeline = this.device.createComputePipeline({
        layout: 'auto',
        compute: {
          module: this.device.createShaderModule({ code: MOLECULAR_NEIGHBOR_INTEGRATE_SHADER }),
          entryPoint: 'main'
        }
      });
      const neighborValidationError = await this.device.popErrorScope?.();
      if (neighborValidationError) {
        throw new Error(neighborValidationError.message || neighborValidationError);
      }
      this.neighborListAvailable = true;
    } catch (error) {
      this.clearGridPipeline = null;
      this.buildGridPipeline = null;
      this.neighborListPipeline = null;
      this.integratePipeline = null;
      this.neighborListAvailable = false;
      this.neighborValidationError = error instanceof Error ? error.message : String(error);
    }
    this.device.lost?.then((info) => {
      this.lastError = info?.message || info?.reason || 'Molecular dynamics WebGPU device lost';
      gpuDisabledReasons.set(this.stateKey, this.lastError);
    });
  }

  makeParams(state, options, layout = getMolecularNeighborGridLayout({ atomCount: state.atomCount, state })) {
    const ulgSource = options.ulgStateDeltaSource?.schema === MOLECULAR_ULG_STATE_SOURCE_SCHEMA
      ? options.ulgStateDeltaSource
      : createUlgStateDeltaApplicationReport(options.ulgStateDeltaSource, {
        atomCount: state.atomCount,
        applicationMode: 'webgpu-md-kernel-source-term',
        webgpuKernelApplied: false
      });
    const quantumSource = options.quantumCouplingApplication?.schema === MOLECULAR_QUANTUM_SOURCE_SCHEMA
      ? options.quantumCouplingApplication
      : createQuantumCouplingApplicationReport(state, options.quantumCoupling, {
        atomCount: state.atomCount,
        applicationMode: 'webgpu-md-kernel-quantum-source-term',
        webgpuKernelApplied: false
      });
    const quantumMaterialSource = options.quantumMaterialSource?.schema === MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA
      ? options.quantumMaterialSource
      : createQuantumMaterialSourceApplicationReport(state, options.quantumMaterialSource, {
        applicationMode: 'webgpu-md-kernel-quantum-material-source-term',
        webgpuKernelApplied: false
      });
    const geometryTargets = molecularGeometryTargetsFromQuantumMaterialSource(quantumMaterialSource);
    return new Float32Array([
      state.atomCount,
      options.dt,
      options.ambientTemperatureK,
      options.ambientPressurePa,
      options.fireIntensity,
      options.oxygenFraction,
      options.radiativeHeatFlux,
      options.gravityMps2,
      options.waterContact,
      layout.cellSize,
      MOLECULAR_DYNAMICS_FORCE_RADIUS,
      layout.gridOrigin,
      layout.gridDimX,
      layout.gridDimY,
      layout.gridDimZ,
      MOLECULAR_NEIGHBOR_MAX_NEIGHBORS_PER_ATOM,
      ulgSource.applied ? 1 : 0,
      normalizeNumber(ulgSource.temperatureAppliedDeltaK, 0, -35, 35),
      normalizeNumber(ulgSource.chargeAppliedDeltaProxy, 0, -0.15, 0.15),
      normalizeNumber(ulgSource.velocityAppliedDeltaProxy, 0, -0.08, 0.08),
      normalizeNumber(ulgSource.magneticAppliedDeltaProxy, 0, -0.08, 0.08),
      normalizeNumber(ulgSource.energyDeltaProxy, 0, -1e9, 1e9),
      normalizeNumber(ulgSource.readiness, 0, 0, 1),
      0,
      quantumSource.applied ? 1 : 0,
      normalizeNumber(quantumSource.atomicNumber, 0, 0, 118),
      normalizeNumber(quantumSource.targetCharge, 0, -1.4, 1.4),
      normalizeNumber(quantumSource.temperatureAppliedDeltaK, 0, -60, 60),
      normalizeNumber(quantumSource.bondOrderScale, 1, 0.5, 1.8),
      normalizeNumber(quantumSource.ionizationDrive, 0, 0, 1),
      normalizeNumber(quantumSource.evolutionDrive, 0, 0, 1),
      normalizeNumber(quantumSource.chargeMix, 0, 0, 1),
      quantumMaterialSource.applied ? 1 : 0,
      normalizeNumber(quantumMaterialSource.bondOrderScale, 1, 0.5, 1.8),
      normalizeNumber(quantumMaterialSource.temperatureAppliedDeltaK, 0, -60, 60),
      normalizeNumber(quantumMaterialSource.chargeDeltaProxy, 0, -0.2, 0.2),
      normalizeNumber(quantumMaterialSource.ionizationDrive, 0, 0, 1),
      normalizeNumber(quantumMaterialSource.forceGradientDrive, 0, 0, 1),
      normalizeNumber(quantumMaterialSource.behaviorDrive, 0, 0, 64),
      normalizeNumber(quantumMaterialSource.meanUncertainty, 1, 0, 16),
      normalizeNumber(quantumMaterialSource.pairForceScale, 1, 0.5, 1.8),
      normalizeNumber(quantumMaterialSource.restLengthDeltaAngstrom, 0, -0.08, 0.08),
      normalizeNumber(quantumMaterialSource.pairForceMix, 0, 0, 1),
      normalizeNumber(quantumMaterialSource.primaryElementZ, 0, 0, 118),
      normalizeNumber(quantumMaterialSource.secondaryElementZ, 0, 0, 118),
      normalizeNumber(quantumMaterialSource.pairSelectivity, 0, 0, 1),
      normalizeNumber(quantumMaterialSource.pairFallbackFactor, 1, 0, 1),
      normalizeNumber(quantumMaterialSource.ensemblePressureDrive, 0, -1, 1),
      normalizeNumber(quantumMaterialSource.ensemblePressureRatio, 1, 0.001, 1000),
      normalizeNumber(quantumMaterialSource.heatCapacityProxy, 0, 0, 64),
      normalizeNumber(quantumMaterialSource.thermalDampingScale, 1, 0.5, 1.5),
      normalizeNumber(quantumMaterialSource.conductivityDrive, 0, 0, 1.5),
      normalizeNumber(quantumMaterialSource.dielectricDrive, 0, 0, 1.5),
      normalizeNumber(quantumMaterialSource.mechanicalStiffnessDrive, 0, 0, 1.5),
      normalizeNumber(quantumMaterialSource.opticalAbsorptionDrive, 0, 0, 1.5),
      geometryTargets.sourceApplied ? 1 : 0,
      geometryTargets.targetOhDistanceReducedNm,
      geometryTargets.targetHhDistanceReducedNm,
      geometryTargets.targetAngleCos,
      geometryTargets.distanceStiffnessProxy,
      geometryTargets.angleStiffnessProxy,
      geometryTargets.confidence,
      normalizeNumber(quantumMaterialSource.reactionBarrierGateProxy, 0, 0, 1)
    ]);
  }

  async readFloatBuffer(buffer, byteLength) {
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for molecular-dynamics worker');
    await buffer.mapAsync(mapMode.READ);
    const mapped = buffer.getMappedRange();
    const result = new Float32Array(mapped).slice(0, byteLength / Float32Array.BYTES_PER_ELEMENT);
    buffer.unmap();
    return result;
  }

  async readUintBuffer(buffer, uintLength) {
    const mapMode = globalThis.GPUMapMode;
    if (!mapMode) throw new Error('GPUMapMode unavailable for molecular-dynamics worker');
    await buffer.mapAsync(mapMode.READ);
    const mapped = buffer.getMappedRange();
    const result = new Uint32Array(mapped).slice(0, uintLength);
    buffer.unmap();
    return result;
  }

  makeNeighborStats(stats) {
    return {
      overflowAtoms: Number(stats?.[0] || 0),
      overflowCells: Number(stats?.[1] || 0),
      candidatePairCount: Number(stats?.[2] || 0),
      acceptedNeighborPairCount: Number(stats?.[3] || 0)
    };
  }

  makeTopologyBufferStatus({ roundTripApplied = false } = {}) {
    return {
      atomFloatStride: ATOM_FLOATS,
      topologyMetadataFloatOffset: ATOM_TOPOLOGY_GROUP_ID_OFFSET,
      topologyMetadataFloatCount: ATOM_TOPOLOGY_METADATA_FLOATS,
      topologyMetadataFields: ['moleculeGroupId', 'moleculeGroupType', 'moleculeLocalIndex'],
      topologyMetadataGpuVisible: true,
      topologyMetadataRoundTripApplied: roundTripApplied === true
    };
  }

  async stepNeighborList(state, options) {
    const atomData = atomDataFromState(state);
    const layout = getMolecularNeighborGridLayout({ atomCount: state.atomCount, state });
    const params = this.makeParams(state, options, layout);
    const workgroups = Math.ceil(state.atomCount / WORKGROUP_SIZE);
    const clearWorkgroups = Math.ceil(
      Math.max(layout.cellCount, state.atomCount, MOLECULAR_NEIGHBOR_STATS_UINTS) / WORKGROUP_SIZE
    );
    const encoder = this.device.createCommandEncoder();
    const clearBindGroup = this.device.createBindGroup({
      layout: this.clearGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.gridCountBuffer } },
        { binding: 1, resource: { buffer: this.neighborCountBuffer } },
        { binding: 2, resource: { buffer: this.neighborStatsBuffer } },
        { binding: 3, resource: { buffer: this.paramBuffer } }
      ]
    });
    const buildGridBindGroup = this.device.createBindGroup({
      layout: this.buildGridPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.currentBuffer } },
        { binding: 1, resource: { buffer: this.gridCountBuffer } },
        { binding: 2, resource: { buffer: this.gridAtomBuffer } },
        { binding: 3, resource: { buffer: this.neighborStatsBuffer } },
        { binding: 4, resource: { buffer: this.paramBuffer } }
      ]
    });
    const neighborBindGroup = this.device.createBindGroup({
      layout: this.neighborListPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.currentBuffer } },
        { binding: 1, resource: { buffer: this.gridCountBuffer } },
        { binding: 2, resource: { buffer: this.gridAtomBuffer } },
        { binding: 3, resource: { buffer: this.neighborCountBuffer } },
        { binding: 4, resource: { buffer: this.neighborIndexBuffer } },
        { binding: 5, resource: { buffer: this.neighborStatsBuffer } },
        { binding: 6, resource: { buffer: this.paramBuffer } }
      ]
    });
    const integrateBindGroup = this.device.createBindGroup({
      layout: this.integratePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.currentBuffer } },
        { binding: 1, resource: { buffer: this.nextBuffer } },
        { binding: 2, resource: { buffer: this.neighborCountBuffer } },
        { binding: 3, resource: { buffer: this.neighborIndexBuffer } },
        { binding: 4, resource: { buffer: this.paramBuffer } }
      ]
    });
    this.device.queue.writeBuffer(this.currentBuffer, 0, atomData);
    this.device.queue.writeBuffer(this.paramBuffer, 0, params);
    let pass = encoder.beginComputePass();
    pass.setPipeline(this.clearGridPipeline);
    pass.setBindGroup(0, clearBindGroup);
    pass.dispatchWorkgroups(clearWorkgroups);
    pass.end();
    pass = encoder.beginComputePass();
    pass.setPipeline(this.buildGridPipeline);
    pass.setBindGroup(0, buildGridBindGroup);
    pass.dispatchWorkgroups(workgroups);
    pass.end();
    pass = encoder.beginComputePass();
    pass.setPipeline(this.neighborListPipeline);
    pass.setBindGroup(0, neighborBindGroup);
    pass.dispatchWorkgroups(workgroups);
    pass.end();
    pass = encoder.beginComputePass();
    pass.setPipeline(this.integratePipeline);
    pass.setBindGroup(0, integrateBindGroup);
    pass.dispatchWorkgroups(workgroups);
    pass.end();
    encoder.copyBufferToBuffer(this.nextBuffer, 0, this.readBuffer, 0, atomData.byteLength);
    encoder.copyBufferToBuffer(this.neighborStatsBuffer, 0, this.neighborStatsReadBuffer, 0, MOLECULAR_NEIGHBOR_STATS_UINTS * Uint32Array.BYTES_PER_ELEMENT);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone?.();
    const [result, rawStats] = await Promise.all([
      this.readFloatBuffer(this.readBuffer, atomData.byteLength),
      this.readUintBuffer(this.neighborStatsReadBuffer, MOLECULAR_NEIGHBOR_STATS_UINTS)
    ]);
    const stats = this.makeNeighborStats(rawStats);
    const overflow = stats.overflowAtoms > 0 || stats.overflowCells > 0;
    if (overflow) {
      return {
        backend: 'webgpu-molecular-dynamics',
        overflow: true,
        webgpuStatus: {
        stateKey: this.stateKey,
        atomCount: state.atomCount,
        submittedSteps: this.submittedSteps,
        kernelMode: 'cell-neighbor-list',
        neighborListMode: 'overflow-fallback',
        workgroupSize: WORKGROUP_SIZE,
        ...this.makeTopologyBufferStatus({ roundTripApplied: false }),
        ...layout,
        ...stats
      }
    };
    }
    applyAtomDataToState(state, result);
    const ulgStateDeltaSource = attachUlgStateDeltaApplicationToState(state, options.ulgStateDeltaSource, {
      applicationMode: 'webgpu-neighbor-integrate-source-term',
      webgpuKernelApplied: true
    });
    const quantumSource = attachQuantumCouplingApplicationToState(state, options.quantumCouplingApplication, {
      applicationMode: 'webgpu-neighbor-integrate-quantum-source-term',
      webgpuKernelApplied: true
    });
    const quantumMaterialSource = attachQuantumMaterialSourceToState(state, options.quantumMaterialSource, {
      applicationMode: 'webgpu-neighbor-integrate-quantum-material-source-term',
      webgpuKernelApplied: true
    });
    applySeededWaterTopologyProjection(state, {
      dt: options.dt,
      quantumMaterialSource,
      strength: quantumMaterialSource.applied ? 0.74 : 0.58
    });
    const productTopologyMutation = applyQuantumMaterialProductTopologyMutation(state, quantumMaterialSource, {
      sourceMode: 'webgpu-neighbor-post-integrate-topology-commit'
    });
    state.reactionProgress = clamp(state.reactionProgress * 0.98 + options.reactionProgress * 0.01 + options.fireIntensity * options.oxygenFraction * 0.01, 0, 1);
    state.elapsedTime += options.dt;
    this.submittedSteps += 1;
    const productTopologyOverlay = createQuantumMaterialProductTopologyOverlay(state, quantumMaterialSource);
    const productConservationAudit = createQuantumMaterialReactionProductConservationAudit({
      state,
      productSource: createQuantumMaterialReactionProductSource(quantumMaterialSource),
      productTopologyOverlay
    });
    return {
      backend: 'webgpu-molecular-dynamics',
      webgpuStatus: {
        stateKey: this.stateKey,
        atomCount: state.atomCount,
        submittedSteps: this.submittedSteps,
        kernelMode: 'cell-neighbor-list',
        neighborListMode: 'active',
        ...this.makeTopologyBufferStatus({ roundTripApplied: true }),
        ulgStateDeltaApplied: ulgStateDeltaSource.applied === true,
        ulgStateDeltaApplicationMode: ulgStateDeltaSource.applicationMode,
        ulgStateDeltaWebgpuKernelApplied: ulgStateDeltaSource.webgpuKernelApplied === true,
        ulgStateDeltaAppliedChannelCount: ulgStateDeltaSource.appliedChannelUpdateCount || 0,
        quantumCouplingApplied: quantumSource.applied === true,
        quantumCouplingApplicationMode: quantumSource.applicationMode,
        quantumCouplingWebgpuKernelApplied: quantumSource.webgpuKernelApplied === true,
        quantumCouplingMatchedAtomCount: quantumSource.matchedAtomCount || 0,
        quantumMaterialSourceApplied: quantumMaterialSource.applied === true,
        quantumMaterialSourceMode: quantumMaterialSource.applicationMode,
        quantumMaterialSourceWebgpuKernelApplied: quantumMaterialSource.webgpuKernelApplied === true,
        quantumMaterialSourceRecordCount: quantumMaterialSource.recordCount || 0,
        quantumMaterialSourceForceGradientEvPerAngstrom: quantumMaterialSource.meanForceGradientEvPerAngstrom || 0,
        quantumMaterialSourceBondOrderScale: quantumMaterialSource.bondOrderScale || 1,
        quantumMaterialSourcePairForceScale: quantumMaterialSource.pairForceScale || 1,
        quantumMaterialSourceRestLengthDeltaAngstrom: quantumMaterialSource.restLengthDeltaAngstrom || 0,
        quantumMaterialSourcePairForceMix: quantumMaterialSource.pairForceMix || 0,
        quantumMaterialSourceTargetPairLabel: quantumMaterialSource.targetPairLabel || 'all-pairs',
        quantumMaterialSourcePrimaryElementZ: quantumMaterialSource.primaryElementZ || 0,
        quantumMaterialSourceSecondaryElementZ: quantumMaterialSource.secondaryElementZ || 0,
        quantumMaterialSourcePairSelectivity: quantumMaterialSource.pairSelectivity || 0,
        quantumMaterialSourcePairFallbackFactor: quantumMaterialSource.pairFallbackFactor ?? 1,
        quantumMaterialSourceTargetAtomCount: quantumMaterialSource.targetAtomCount || quantumMaterialSource.targetMatchedAtomCount || 0,
        quantumMaterialSourceTargetFallbackAtomCount: quantumMaterialSource.targetFallbackAtomCount || 0,
        quantumMaterialSourceTargetAtomWeightedFactorSum: quantumMaterialSource.targetAtomWeightedFactorSum || 0,
        quantumMaterialSourceTargetAtomMeanFactor: quantumMaterialSource.targetAtomMeanFactor || 0,
        quantumMaterialSourceTargetPairSelectedCount: quantumMaterialSource.targetPairSelectedCount || 0,
        quantumMaterialSourceTargetPairFallbackCount: quantumMaterialSource.targetPairFallbackCount || 0,
        quantumMaterialSourceTargetPairMeanFactor: quantumMaterialSource.targetPairMeanFactor || 0,
        quantumMaterialSourceEnsemblePressurePa: quantumMaterialSource.ensemblePressurePa || 0,
        quantumMaterialSourceEnsemblePressureRatio: quantumMaterialSource.ensemblePressureRatio || 1,
        quantumMaterialSourceEnsemblePressureDrive: quantumMaterialSource.ensemblePressureDrive || 0,
        quantumMaterialSourceHeatCapacityProxy: quantumMaterialSource.heatCapacityProxy || 0,
        quantumMaterialSourceThermalDampingScale: quantumMaterialSource.thermalDampingScale || 1,
        quantumMaterialSourceStatisticalSourceEquationSchema: quantumMaterialSource.sourceStatisticalSourceEquationSchema || quantumMaterialSource.statisticalSourceEquation?.schema || null,
        quantumMaterialSourceStatisticalSourceChannelCount: quantumMaterialSource.statisticalSourceChannelCount || 0,
        quantumMaterialSourceStatisticalPressureDriveProxy: quantumMaterialSource.statisticalSourcePressureDriveProxy || 0,
        quantumMaterialSourceStatisticalOpacityDriveProxy: quantumMaterialSource.statisticalSourceOpacityDriveProxy || 0,
        quantumMaterialSourceStatisticalIonizationDriveProxy: quantumMaterialSource.statisticalSourceIonizationDriveProxy || 0,
        quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy: quantumMaterialSource.statisticalSourceDegeneracyPressureDriveProxy || 0,
        quantumMaterialSourceStatisticalTemperatureDeltaKProxy: quantumMaterialSource.statisticalSourceTemperatureDeltaKProxy || 0,
        quantumMaterialSourceStatisticalChargeDeltaProxy: quantumMaterialSource.statisticalSourceChargeDeltaProxy || 0,
        quantumMaterialSourceStatisticalThermalDampingScale: quantumMaterialSource.statisticalSourceThermalDampingScale || 1,
        quantumMaterialSourceElectricalConductivitySpm: quantumMaterialSource.electricalConductivitySpm || 0,
        quantumMaterialSourceDielectricConstant: quantumMaterialSource.dielectricConstant || 1,
        quantumMaterialSourceRefractiveIndex: quantumMaterialSource.refractiveIndex || 1,
        quantumMaterialSourceMechanicalResponsePa: quantumMaterialSource.mechanicalResponsePa || 0,
        quantumMaterialSourceResponseDerivativesSchema: quantumMaterialSource.sourceResponseDerivativesSchema || quantumMaterialSource.responseDerivatives?.schema || null,
        quantumMaterialSourceResponseDerivativeTemperatureDrive: quantumMaterialSource.responseDerivativeTemperatureDrive || 0,
        quantumMaterialSourceResponseDerivativePressureDrive: quantumMaterialSource.responseDerivativePressureDrive || 0,
        quantumMaterialSourceResponseDerivativeFieldDrive: quantumMaterialSource.responseDerivativeFieldDrive || 0,
        quantumMaterialSourceResponseDerivativeRadiationDrive: quantumMaterialSource.responseDerivativeRadiationDrive || 0,
        quantumMaterialSourceConductivityDrive: quantumMaterialSource.conductivityDrive || 0,
        quantumMaterialSourceDielectricDrive: quantumMaterialSource.dielectricDrive || 0,
        quantumMaterialSourceMechanicalStiffnessDrive: quantumMaterialSource.mechanicalStiffnessDrive || 0,
        quantumMaterialSourceOpticalAbsorptionDrive: quantumMaterialSource.opticalAbsorptionDrive || 0,
        quantumMaterialGeometrySourceApplied: quantumMaterialSource.geometrySourceApplied === true,
        quantumMaterialGeometrySourceSchema: quantumMaterialSource.geometrySourceSchema || null,
        quantumMaterialGeometrySourceModelId: quantumMaterialSource.geometrySourceModelId || null,
        quantumMaterialGeometryTargetSource: quantumMaterialSource.geometryTargetSource || 'md-default-reduced-water-reference',
        quantumMaterialGeometryTargetOhDistanceReducedNm: quantumMaterialSource.geometryTargetOhDistanceReducedNm || WATER_OH_REST_REDUCED_NM,
        quantumMaterialGeometryTargetHhDistanceReducedNm: quantumMaterialSource.geometryTargetHhDistanceReducedNm || WATER_HH_TARGET_REDUCED_NM,
        quantumMaterialGeometryTargetAngleDeg: quantumMaterialSource.geometryTargetAngleDeg || WATER_HOH_TARGET_ANGLE_DEG,
        quantumMaterialGeometrySourceConfidence: quantumMaterialSource.geometrySourceConfidence || 0,
        quantumMaterialElectronicChargeSourceApplied: quantumMaterialSource.electronicChargeSourceApplied === true,
        quantumMaterialElectronicChargeSourceSchema: quantumMaterialSource.electronicChargeSourceSchema || null,
        quantumMaterialElectronicChargeSourceModelId: quantumMaterialSource.electronicChargeSourceModelId || null,
        quantumMaterialElectronicChargeDeltaProxy: quantumMaterialSource.electronicChargeSourceChargeDeltaProxy || 0,
        quantumMaterialElectronicIonizationDriveProxy: quantumMaterialSource.electronicChargeSourceIonizationDriveProxy || 0,
        quantumMaterialElectronicChargeMobilityProxy: quantumMaterialSource.electronicChargeSourceMobilityProxy || 0,
        quantumMaterialElectronicScreeningDampingScale: quantumMaterialSource.electronicChargeSourceScreeningDampingScale || 1,
        quantumMaterialElectronicQeqMixProxy: quantumMaterialSource.electronicChargeSourceQeqMixProxy || 0,
        quantumMaterialReactionBarrierSurfaceApplied: quantumMaterialSource.reactionBarrierSurfaceApplied === true,
        quantumMaterialReactionBarrierSurfaceSchema: quantumMaterialSource.reactionBarrierSurfaceSchema || null,
        quantumMaterialReactionBarrierActivationEnergyEvProxy: quantumMaterialSource.reactionBarrierActivationEnergyEvProxy || 0,
        quantumMaterialReactionBarrierProbabilityProxy: quantumMaterialSource.reactionBarrierProbabilityProxy || 0,
        quantumMaterialReactionBarrierGateDampingScale: quantumMaterialSource.reactionBarrierGateDampingScale || 1,
        quantumMaterialReactionBarrierGateProxy: quantumMaterialSource.reactionBarrierGateProxy || 0,
        quantumMaterialReactionBarrierUnsupportedProductBlockerCount: quantumMaterialSource.reactionBarrierUnsupportedProductBlockerCount || 0,
        quantumMaterialReactionBarrierProductStoichiometryAvailable: quantumMaterialSource.reactionBarrierProductStoichiometryAvailable === true,
        quantumMaterialReactionBarrierProductTopologyAvailable: quantumMaterialSource.reactionBarrierProductTopologyAvailable === true,
        quantumMaterialReactionProductTopologySchema: quantumMaterialSource.reactionBarrierProductTopologySchema || null,
        quantumMaterialReactionProductTopologyModelId: quantumMaterialSource.reactionBarrierProductTopologyModelId || null,
        quantumMaterialReactionProductTopologyMode: quantumMaterialSource.reactionBarrierProductTopologyMode || null,
        quantumMaterialReactionProductTopologyOverlayApplied: productTopologyOverlay.applied === true,
        quantumMaterialReactionProductTopologyOverlayBondCount: productTopologyOverlay.bonds.length,
        quantumMaterialReactionProductTopologyNaohMoleculeCount: productTopologyOverlay.naohMoleculeCount || 0,
        quantumMaterialReactionProductTopologyH2MoleculeCount: productTopologyOverlay.h2MoleculeCount || 0,
        quantumMaterialReactionProductTopologyPartialHydrogenSiteCount: productTopologyOverlay.partialHydrogenSiteCount || 0,
        quantumMaterialReactionProductTopologyMutationApplied: productTopologyMutation.applied === true,
        quantumMaterialReactionProductTopologyMutationStatus: productTopologyMutation.status,
        quantumMaterialReactionProductTopologyMutatedAtomCount: productTopologyMutation.mutatedAtomCount || 0,
        quantumMaterialReactionProductTopologyRetiredWaterGroupCount: productTopologyMutation.retiredWaterGroupCount || 0,
        quantumMaterialReactionProductConservationAuditSchema: productConservationAudit.schema,
        quantumMaterialReactionProductConservationClosed: productConservationAudit.reducedAtomConservationClosed === true,
        quantumMaterialReactionProductGraphComplete: productConservationAudit.reducedProductGraphComplete === true,
        quantumMaterialReactionProductAtomResidualProxy: productConservationAudit.atomConservationResidualProxy || 0,
        quantumMaterialReactionProductSiteCoverageFraction: productConservationAudit.siteCoverageFraction || 0,
        quantumMaterialReactionProductSourceApplied: quantumMaterialSource.reactionBarrierProductStoichiometryAvailable === true,
        quantumMaterialReactionProductTargetReactionId: quantumMaterialSource.reactionBarrierProductStoichiometry?.reactionId || null,
        quantumMaterialReactionProductHeatReleaseProxy: quantumMaterialSource.reactionBarrierProductHeatReleaseProxy || 0,
        quantumMaterialReactionProductChargeDeltaProxy: quantumMaterialSource.reactionBarrierProductChargeDeltaProxy || 0,
        quantumMaterialReactionProductExtentProxy: quantumMaterialSource.reactionBarrierProductExtentProxy || 0,
        quantumMaterialReactionProductGasFormula: quantumMaterialSource.reactionBarrierProductGasFormula || null,
        quantumMaterialReactionProductTopologyRequired: quantumMaterialSource.reactionBarrierProductStoichiometryAvailable === true
          && quantumMaterialSource.reactionBarrierProductTopologyAvailable !== true,
        workgroupSize: WORKGROUP_SIZE,
        ...layout,
        ...stats
      }
    };
  }

  async stepReferenceAllPairs(state, options, fallback = null) {
    const atomData = atomDataFromState(state);
    const layout = getMolecularNeighborGridLayout({ atomCount: state.atomCount, state });
    const params = this.makeParams(state, options, layout);
    const workgroups = Math.ceil(state.atomCount / WORKGROUP_SIZE);
    const encoder = this.device.createCommandEncoder();
    const bindGroup = this.device.createBindGroup({
      layout: this.referencePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.currentBuffer } },
        { binding: 1, resource: { buffer: this.nextBuffer } },
        { binding: 2, resource: { buffer: this.paramBuffer } }
      ]
    });
    this.device.queue.writeBuffer(this.currentBuffer, 0, atomData);
    this.device.queue.writeBuffer(this.paramBuffer, 0, params);
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.referencePipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(workgroups);
    pass.end();
    encoder.copyBufferToBuffer(this.nextBuffer, 0, this.readBuffer, 0, atomData.byteLength);
    this.device.queue.submit([encoder.finish()]);
    await this.device.queue.onSubmittedWorkDone?.();
    const result = await this.readFloatBuffer(this.readBuffer, atomData.byteLength);
    applyAtomDataToState(state, result);
    const ulgStateDeltaSource = attachUlgStateDeltaApplicationToState(state, options.ulgStateDeltaSource, {
      applicationMode: fallback ? 'webgpu-reference-overflow-source-term' : 'webgpu-reference-all-pairs-source-term',
      webgpuKernelApplied: true
    });
    const quantumSource = attachQuantumCouplingApplicationToState(state, options.quantumCouplingApplication, {
      applicationMode: fallback ? 'webgpu-reference-overflow-quantum-source-term' : 'webgpu-reference-all-pairs-quantum-source-term',
      webgpuKernelApplied: true
    });
    const quantumMaterialSource = attachQuantumMaterialSourceToState(state, options.quantumMaterialSource, {
      applicationMode: fallback ? 'webgpu-reference-overflow-quantum-material-source-term' : 'webgpu-reference-all-pairs-quantum-material-source-term',
      webgpuKernelApplied: true
    });
    applySeededWaterTopologyProjection(state, {
      dt: options.dt,
      quantumMaterialSource,
      strength: quantumMaterialSource.applied ? 0.74 : 0.58
    });
    const productTopologyMutation = applyQuantumMaterialProductTopologyMutation(state, quantumMaterialSource, {
      sourceMode: fallback ? 'webgpu-reference-overflow-post-integrate-topology-commit' : 'webgpu-reference-post-integrate-topology-commit'
    });
    state.reactionProgress = clamp(state.reactionProgress * 0.98 + options.reactionProgress * 0.01 + options.fireIntensity * options.oxygenFraction * 0.01, 0, 1);
    state.elapsedTime += options.dt;
    this.submittedSteps += 1;
    const productTopologyOverlay = createQuantumMaterialProductTopologyOverlay(state, quantumMaterialSource);
    const productConservationAudit = createQuantumMaterialReactionProductConservationAudit({
      state,
      productSource: createQuantumMaterialReactionProductSource(quantumMaterialSource),
      productTopologyOverlay
    });
    return {
      backend: 'webgpu-molecular-dynamics',
      webgpuStatus: {
        stateKey: this.stateKey,
        atomCount: state.atomCount,
        submittedSteps: this.submittedSteps,
        kernelMode: 'tiled-workgroup-all-pairs',
        neighborListMode: fallback ? 'fallback-reference' : (this.neighborListAvailable ? 'reference' : 'unavailable'),
        ...this.makeTopologyBufferStatus({ roundTripApplied: true }),
        ulgStateDeltaApplied: ulgStateDeltaSource.applied === true,
        ulgStateDeltaApplicationMode: ulgStateDeltaSource.applicationMode,
        ulgStateDeltaWebgpuKernelApplied: ulgStateDeltaSource.webgpuKernelApplied === true,
        ulgStateDeltaAppliedChannelCount: ulgStateDeltaSource.appliedChannelUpdateCount || 0,
        quantumCouplingApplied: quantumSource.applied === true,
        quantumCouplingApplicationMode: quantumSource.applicationMode,
        quantumCouplingWebgpuKernelApplied: quantumSource.webgpuKernelApplied === true,
        quantumCouplingMatchedAtomCount: quantumSource.matchedAtomCount || 0,
        quantumMaterialSourceApplied: quantumMaterialSource.applied === true,
        quantumMaterialSourceMode: quantumMaterialSource.applicationMode,
        quantumMaterialSourceWebgpuKernelApplied: quantumMaterialSource.webgpuKernelApplied === true,
        quantumMaterialSourceRecordCount: quantumMaterialSource.recordCount || 0,
        quantumMaterialSourceForceGradientEvPerAngstrom: quantumMaterialSource.meanForceGradientEvPerAngstrom || 0,
        quantumMaterialSourceBondOrderScale: quantumMaterialSource.bondOrderScale || 1,
        quantumMaterialSourcePairForceScale: quantumMaterialSource.pairForceScale || 1,
        quantumMaterialSourceRestLengthDeltaAngstrom: quantumMaterialSource.restLengthDeltaAngstrom || 0,
        quantumMaterialSourcePairForceMix: quantumMaterialSource.pairForceMix || 0,
        quantumMaterialSourceTargetPairLabel: quantumMaterialSource.targetPairLabel || 'all-pairs',
        quantumMaterialSourcePrimaryElementZ: quantumMaterialSource.primaryElementZ || 0,
        quantumMaterialSourceSecondaryElementZ: quantumMaterialSource.secondaryElementZ || 0,
        quantumMaterialSourcePairSelectivity: quantumMaterialSource.pairSelectivity || 0,
        quantumMaterialSourcePairFallbackFactor: quantumMaterialSource.pairFallbackFactor ?? 1,
        quantumMaterialSourceTargetAtomCount: quantumMaterialSource.targetAtomCount || quantumMaterialSource.targetMatchedAtomCount || 0,
        quantumMaterialSourceTargetFallbackAtomCount: quantumMaterialSource.targetFallbackAtomCount || 0,
        quantumMaterialSourceTargetAtomWeightedFactorSum: quantumMaterialSource.targetAtomWeightedFactorSum || 0,
        quantumMaterialSourceTargetAtomMeanFactor: quantumMaterialSource.targetAtomMeanFactor || 0,
        quantumMaterialSourceTargetPairSelectedCount: quantumMaterialSource.targetPairSelectedCount || 0,
        quantumMaterialSourceTargetPairFallbackCount: quantumMaterialSource.targetPairFallbackCount || 0,
        quantumMaterialSourceTargetPairMeanFactor: quantumMaterialSource.targetPairMeanFactor || 0,
        quantumMaterialSourceEnsemblePressurePa: quantumMaterialSource.ensemblePressurePa || 0,
        quantumMaterialSourceEnsemblePressureRatio: quantumMaterialSource.ensemblePressureRatio || 1,
        quantumMaterialSourceEnsemblePressureDrive: quantumMaterialSource.ensemblePressureDrive || 0,
        quantumMaterialSourceHeatCapacityProxy: quantumMaterialSource.heatCapacityProxy || 0,
        quantumMaterialSourceThermalDampingScale: quantumMaterialSource.thermalDampingScale || 1,
        quantumMaterialSourceStatisticalSourceEquationSchema: quantumMaterialSource.sourceStatisticalSourceEquationSchema || quantumMaterialSource.statisticalSourceEquation?.schema || null,
        quantumMaterialSourceStatisticalSourceChannelCount: quantumMaterialSource.statisticalSourceChannelCount || 0,
        quantumMaterialSourceStatisticalPressureDriveProxy: quantumMaterialSource.statisticalSourcePressureDriveProxy || 0,
        quantumMaterialSourceStatisticalOpacityDriveProxy: quantumMaterialSource.statisticalSourceOpacityDriveProxy || 0,
        quantumMaterialSourceStatisticalIonizationDriveProxy: quantumMaterialSource.statisticalSourceIonizationDriveProxy || 0,
        quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy: quantumMaterialSource.statisticalSourceDegeneracyPressureDriveProxy || 0,
        quantumMaterialSourceStatisticalTemperatureDeltaKProxy: quantumMaterialSource.statisticalSourceTemperatureDeltaKProxy || 0,
        quantumMaterialSourceStatisticalChargeDeltaProxy: quantumMaterialSource.statisticalSourceChargeDeltaProxy || 0,
        quantumMaterialSourceStatisticalThermalDampingScale: quantumMaterialSource.statisticalSourceThermalDampingScale || 1,
        quantumMaterialSourceElectricalConductivitySpm: quantumMaterialSource.electricalConductivitySpm || 0,
        quantumMaterialSourceDielectricConstant: quantumMaterialSource.dielectricConstant || 1,
        quantumMaterialSourceRefractiveIndex: quantumMaterialSource.refractiveIndex || 1,
        quantumMaterialSourceMechanicalResponsePa: quantumMaterialSource.mechanicalResponsePa || 0,
        quantumMaterialSourceResponseDerivativesSchema: quantumMaterialSource.sourceResponseDerivativesSchema || quantumMaterialSource.responseDerivatives?.schema || null,
        quantumMaterialSourceResponseDerivativeTemperatureDrive: quantumMaterialSource.responseDerivativeTemperatureDrive || 0,
        quantumMaterialSourceResponseDerivativePressureDrive: quantumMaterialSource.responseDerivativePressureDrive || 0,
        quantumMaterialSourceResponseDerivativeFieldDrive: quantumMaterialSource.responseDerivativeFieldDrive || 0,
        quantumMaterialSourceResponseDerivativeRadiationDrive: quantumMaterialSource.responseDerivativeRadiationDrive || 0,
        quantumMaterialSourceConductivityDrive: quantumMaterialSource.conductivityDrive || 0,
        quantumMaterialSourceDielectricDrive: quantumMaterialSource.dielectricDrive || 0,
        quantumMaterialSourceMechanicalStiffnessDrive: quantumMaterialSource.mechanicalStiffnessDrive || 0,
        quantumMaterialSourceOpticalAbsorptionDrive: quantumMaterialSource.opticalAbsorptionDrive || 0,
        quantumMaterialGeometrySourceApplied: quantumMaterialSource.geometrySourceApplied === true,
        quantumMaterialGeometrySourceSchema: quantumMaterialSource.geometrySourceSchema || null,
        quantumMaterialGeometrySourceModelId: quantumMaterialSource.geometrySourceModelId || null,
        quantumMaterialGeometryTargetSource: quantumMaterialSource.geometryTargetSource || 'md-default-reduced-water-reference',
        quantumMaterialGeometryTargetOhDistanceReducedNm: quantumMaterialSource.geometryTargetOhDistanceReducedNm || WATER_OH_REST_REDUCED_NM,
        quantumMaterialGeometryTargetHhDistanceReducedNm: quantumMaterialSource.geometryTargetHhDistanceReducedNm || WATER_HH_TARGET_REDUCED_NM,
        quantumMaterialGeometryTargetAngleDeg: quantumMaterialSource.geometryTargetAngleDeg || WATER_HOH_TARGET_ANGLE_DEG,
        quantumMaterialGeometrySourceConfidence: quantumMaterialSource.geometrySourceConfidence || 0,
        quantumMaterialElectronicChargeSourceApplied: quantumMaterialSource.electronicChargeSourceApplied === true,
        quantumMaterialElectronicChargeSourceSchema: quantumMaterialSource.electronicChargeSourceSchema || null,
        quantumMaterialElectronicChargeSourceModelId: quantumMaterialSource.electronicChargeSourceModelId || null,
        quantumMaterialElectronicChargeDeltaProxy: quantumMaterialSource.electronicChargeSourceChargeDeltaProxy || 0,
        quantumMaterialElectronicIonizationDriveProxy: quantumMaterialSource.electronicChargeSourceIonizationDriveProxy || 0,
        quantumMaterialElectronicChargeMobilityProxy: quantumMaterialSource.electronicChargeSourceMobilityProxy || 0,
        quantumMaterialElectronicScreeningDampingScale: quantumMaterialSource.electronicChargeSourceScreeningDampingScale || 1,
        quantumMaterialElectronicQeqMixProxy: quantumMaterialSource.electronicChargeSourceQeqMixProxy || 0,
        quantumMaterialReactionBarrierSurfaceApplied: quantumMaterialSource.reactionBarrierSurfaceApplied === true,
        quantumMaterialReactionBarrierSurfaceSchema: quantumMaterialSource.reactionBarrierSurfaceSchema || null,
        quantumMaterialReactionBarrierActivationEnergyEvProxy: quantumMaterialSource.reactionBarrierActivationEnergyEvProxy || 0,
        quantumMaterialReactionBarrierProbabilityProxy: quantumMaterialSource.reactionBarrierProbabilityProxy || 0,
        quantumMaterialReactionBarrierGateDampingScale: quantumMaterialSource.reactionBarrierGateDampingScale || 1,
        quantumMaterialReactionBarrierGateProxy: quantumMaterialSource.reactionBarrierGateProxy || 0,
        quantumMaterialReactionBarrierUnsupportedProductBlockerCount: quantumMaterialSource.reactionBarrierUnsupportedProductBlockerCount || 0,
        quantumMaterialReactionBarrierProductStoichiometryAvailable: quantumMaterialSource.reactionBarrierProductStoichiometryAvailable === true,
        quantumMaterialReactionBarrierProductTopologyAvailable: quantumMaterialSource.reactionBarrierProductTopologyAvailable === true,
        quantumMaterialReactionProductTopologySchema: quantumMaterialSource.reactionBarrierProductTopologySchema || null,
        quantumMaterialReactionProductTopologyModelId: quantumMaterialSource.reactionBarrierProductTopologyModelId || null,
        quantumMaterialReactionProductTopologyMode: quantumMaterialSource.reactionBarrierProductTopologyMode || null,
        quantumMaterialReactionProductTopologyOverlayApplied: productTopologyOverlay.applied === true,
        quantumMaterialReactionProductTopologyOverlayBondCount: productTopologyOverlay.bonds.length,
        quantumMaterialReactionProductTopologyNaohMoleculeCount: productTopologyOverlay.naohMoleculeCount || 0,
        quantumMaterialReactionProductTopologyH2MoleculeCount: productTopologyOverlay.h2MoleculeCount || 0,
        quantumMaterialReactionProductTopologyPartialHydrogenSiteCount: productTopologyOverlay.partialHydrogenSiteCount || 0,
        quantumMaterialReactionProductTopologyMutationApplied: productTopologyMutation.applied === true,
        quantumMaterialReactionProductTopologyMutationStatus: productTopologyMutation.status,
        quantumMaterialReactionProductTopologyMutatedAtomCount: productTopologyMutation.mutatedAtomCount || 0,
        quantumMaterialReactionProductTopologyRetiredWaterGroupCount: productTopologyMutation.retiredWaterGroupCount || 0,
        quantumMaterialReactionProductConservationAuditSchema: productConservationAudit.schema,
        quantumMaterialReactionProductConservationClosed: productConservationAudit.reducedAtomConservationClosed === true,
        quantumMaterialReactionProductGraphComplete: productConservationAudit.reducedProductGraphComplete === true,
        quantumMaterialReactionProductAtomResidualProxy: productConservationAudit.atomConservationResidualProxy || 0,
        quantumMaterialReactionProductSiteCoverageFraction: productConservationAudit.siteCoverageFraction || 0,
        quantumMaterialReactionProductSourceApplied: quantumMaterialSource.reactionBarrierProductStoichiometryAvailable === true,
        quantumMaterialReactionProductTargetReactionId: quantumMaterialSource.reactionBarrierProductStoichiometry?.reactionId || null,
        quantumMaterialReactionProductHeatReleaseProxy: quantumMaterialSource.reactionBarrierProductHeatReleaseProxy || 0,
        quantumMaterialReactionProductChargeDeltaProxy: quantumMaterialSource.reactionBarrierProductChargeDeltaProxy || 0,
        quantumMaterialReactionProductExtentProxy: quantumMaterialSource.reactionBarrierProductExtentProxy || 0,
        quantumMaterialReactionProductGasFormula: quantumMaterialSource.reactionBarrierProductGasFormula || null,
        quantumMaterialReactionProductTopologyRequired: quantumMaterialSource.reactionBarrierProductStoichiometryAvailable === true
          && quantumMaterialSource.reactionBarrierProductTopologyAvailable !== true,
        workgroupSize: WORKGROUP_SIZE,
        fallbackFrom: fallback?.webgpuStatus?.neighborListMode || null,
        neighborListError: this.neighborValidationError,
        ...(fallback?.webgpuStatus ? {
          overflowAtoms: fallback.webgpuStatus.overflowAtoms,
          overflowCells: fallback.webgpuStatus.overflowCells,
          candidatePairCount: fallback.webgpuStatus.candidatePairCount,
          acceptedNeighborPairCount: fallback.webgpuStatus.acceptedNeighborPairCount,
          neighborCapacity: fallback.webgpuStatus.neighborCapacity,
          cellCount: fallback.webgpuStatus.cellCount,
          maxCellOccupancy: fallback.webgpuStatus.maxCellOccupancy,
          maxNeighborsPerAtom: fallback.webgpuStatus.maxNeighborsPerAtom,
          cellSize: fallback.webgpuStatus.cellSize,
          gridOrigin: fallback.webgpuStatus.gridOrigin,
          gridExtent: fallback.webgpuStatus.gridExtent,
          dynamicBounds: fallback.webgpuStatus.dynamicBounds
        } : {
          ...layout
        })
      }
    };
  }

  async step(state, options) {
    await this.initialize(state.atomCount);
    if (this.neighborListAvailable) {
      try {
        const neighborResult = await this.stepNeighborList(state, options);
        if (!neighborResult.overflow) return neighborResult;
        return await this.stepReferenceAllPairs(state, options, neighborResult);
      } catch (error) {
        this.neighborListAvailable = false;
        this.neighborValidationError = error instanceof Error ? error.message : String(error);
      }
    }
    return this.stepReferenceAllPairs(state, options);
  }
}

async function advanceState(state, { stateKey, input, options }) {
  const wantsWebGpu = input.enableWebGPU !== false && input.webgpu !== false;
  const webGpuEligible = wantsWebGpu
    && state.atomCount <= normalizeInteger(input.webgpuMaxAtoms, MOLECULAR_DYNAMICS_WEBGPU_MAX_ATOMS, 1, 1048576)
    && !gpuDisabledReasons.has(stateKey);
  if (webGpuEligible) {
    try {
      let runtime = gpuRuntimes.get(stateKey);
      if (!runtime) {
        runtime = new MolecularDynamicsWebGpuRuntime(stateKey);
        gpuRuntimes.set(stateKey, runtime);
      }
      return await runtime.step(state, options);
    } catch (error) {
      gpuDisabledReasons.set(stateKey, error instanceof Error ? error.message : String(error));
    }
  }
  applyQuantumCouplingReportToState(state, options.quantumCouplingApplication, {
    applicationMode: 'cpu-md-quantum-source-term',
    webgpuKernelApplied: false
  });
  applyUlgStateDeltaReportToState(state, options.ulgStateDeltaSource, {
    applicationMode: 'cpu-md-source-term',
    webgpuKernelApplied: false
  });
  const next = stepMolecularDynamicsCpu(state, options);
  Object.assign(state, next);
  attachQuantumMaterialSourceToState(state, options.quantumMaterialSource, {
    applicationMode: 'cpu-md-quantum-material-source-term',
    webgpuKernelApplied: false
  });
  return {
    backend: 'cpu-molecular-dynamics',
    webgpuStatus: null,
    webgpuError: gpuDisabledReasons.get(stateKey) || null
  };
}

function resolveInput(payload = {}) {
  const input = payload.input || payload;
  return {
    payload,
    input,
    stateKey: payload.stateKey || input.stateKey || input.taskId || DEFAULT_STATE_KEY,
    scope: input.scope || payload.scope || payload.solver?.warmDelta?.scope || DEFAULT_DELTA_SCOPE,
    taskId: input.taskId || payload.stateKey || input.stateKey || DEFAULT_STATE_KEY,
    emitCommitDelta: input.emitCommitDelta === true || payload.emitCommitDelta === true
  };
}

function createDeltaPayload({ payload, input, stateKey, state, diagnostics, conservation, backend, webgpuStatus, webgpuError }) {
  return {
    schema: payload.solver?.warmDelta?.schema || MOLECULAR_DYNAMICS_DELTA_SCHEMA,
    solverId: payload.solver?.id || 'molecular-dynamics',
    stateKey,
    backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    atomCount: state.atomCount,
    bondCount: diagnostics.bondCount,
    diagnostics,
    conservation,
    state,
    webgpuStatus,
    webgpuError,
    units: {
      position: 'reduced-nm',
      velocity: 'reduced-nm/ps',
      temperature: 'K',
      energy: 'reduced-eV',
      charge: 'e'
    }
  };
}

export function resetMolecularDynamics(input = {}) {
  if (input.stateKey || input.taskId) {
    const key = input.stateKey || input.taskId;
    states.delete(key);
    gpuRuntimes.delete(key);
    gpuDisabledReasons.delete(key);
  } else {
    states.clear();
    gpuRuntimes.clear();
    gpuDisabledReasons.clear();
  }
  return {
    ok: true,
    schema: MOLECULAR_DYNAMICS_RESULT_SCHEMA,
    executionContext: getExecutionContext()
  };
}

export async function stepMolecularDynamics(payload = {}) {
  const resolved = resolveInput(payload);
  const { input, stateKey } = resolved;
  const requestedReset = input.reset === true;
  const nextState = input.state || requestedReset || !states.has(stateKey)
    ? normalizeState(input)
    : cloneState(states.get(stateKey));
  const options = resolveStepOptions(input);
  const quantumCouplingApplication = createQuantumCouplingApplicationReport(nextState, options.quantumCoupling, {
    mix: input.state ? 0.1 : 0.055,
    applicationMode: 'md-kernel-source-term-pending',
    webgpuKernelApplied: false
  });
  nextState.quantumCoupling = options.quantumCoupling;
  nextState.quantumCouplingApplication = quantumCouplingApplication;
  options.quantumCouplingApplication = quantumCouplingApplication;
  const quantumMaterialSource = createQuantumMaterialSourceApplicationReport(nextState, options.quantumMaterialSource, {
    applicationMode: 'md-kernel-material-source-term-pending',
    webgpuKernelApplied: false
  });
  nextState.quantumMaterialSource = quantumMaterialSource;
  options.quantumMaterialSource = quantumMaterialSource;
  const ulgStateDeltaSource = createUlgStateDeltaApplicationReport(
    input.coupling?.ulgRuntimeStateDelta ?? input.ulgRuntimeStateDelta ?? input.coupling?.ulgRuntimeExecution,
    {
      mix: input.state ? 0.24 : 0.12,
      atomCount: nextState.atomCount,
      applicationMode: 'md-kernel-source-term-pending',
      webgpuKernelApplied: false
    }
  );
  nextState.ulgStateDeltaSource = ulgStateDeltaSource;
  options.ulgStateDeltaSource = ulgStateDeltaSource;
  const before = computeMolecularDynamicsDiagnostics(nextState);
  const advanceResult = await advanceState(nextState, { stateKey, input, options });
  equilibratePartialCharges(nextState);
  nextState.sequence += 1;
  const diagnostics = computeMolecularDynamicsDiagnostics(nextState);
  const topologyBufferStatus = advanceResult.webgpuStatus || {};
  diagnostics.molecularTopologyBufferAtomFloatStride = Number(topologyBufferStatus.atomFloatStride || 0);
  diagnostics.molecularTopologyBufferMetadataFloatOffset = Number(topologyBufferStatus.topologyMetadataFloatOffset || 0);
  diagnostics.molecularTopologyBufferMetadataFloatCount = Number(topologyBufferStatus.topologyMetadataFloatCount || 0);
  diagnostics.molecularTopologyBufferMetadataFields = Array.isArray(topologyBufferStatus.topologyMetadataFields)
    ? [...topologyBufferStatus.topologyMetadataFields]
    : [];
  diagnostics.molecularTopologyBufferGpuVisible = topologyBufferStatus.topologyMetadataGpuVisible === true;
  diagnostics.molecularTopologyBufferRoundTripApplied = topologyBufferStatus.topologyMetadataRoundTripApplied === true;
  diagnostics.chargeEquilibration = nextState.chargeEquilibration || diagnostics.chargeEquilibration;
  diagnostics.chargeEquilibrationResidualRms = diagnostics.chargeEquilibration.electronegativityResidualRms;
  diagnostics.chargeEquilibrationWeightedResidualRms = diagnostics.chargeEquilibration.weightedElectronegativityResidualRms;
  diagnostics.chargeEquilibrationMaxResidual = diagnostics.chargeEquilibration.maxElectronegativityResidual;
  diagnostics.chargeEquilibrationChargeRmsDelta = diagnostics.chargeEquilibration.chargeRmsDelta;
  diagnostics.chargeEquilibrationMaxChargeDelta = diagnostics.chargeEquilibration.maxChargeDelta;
  diagnostics.chargeEquilibrationTransferMagnitude = diagnostics.chargeEquilibration.transferMagnitude;
  diagnostics.chargeEquilibrationMeanHardnessProxyEv = diagnostics.chargeEquilibration.meanHardnessProxyEv;
  diagnostics.chargeEquilibrationNeutralizationResidualCharge = diagnostics.chargeEquilibration.neutralizationResidualCharge;
  diagnostics.ulgStateDeltaSource = nextState.ulgStateDeltaSource || ulgStateDeltaSource;
  diagnostics.ulgStateDeltaApplied = diagnostics.ulgStateDeltaSource?.applied === true;
  diagnostics.ulgStateDeltaAppliedChannelCount = Number(diagnostics.ulgStateDeltaSource?.appliedChannelUpdateCount || 0);
  diagnostics.ulgStateDeltaTemperatureDeltaK = Number(diagnostics.ulgStateDeltaSource?.temperatureAppliedDeltaK ?? diagnostics.ulgStateDeltaSource?.temperatureDeltaK ?? 0);
  diagnostics.ulgStateDeltaChargeDeltaProxy = Number(diagnostics.ulgStateDeltaSource?.chargeAppliedDeltaProxy ?? diagnostics.ulgStateDeltaSource?.chargeDeltaProxy ?? 0);
  diagnostics.ulgStateDeltaVelocityDeltaProxy = Number(diagnostics.ulgStateDeltaSource?.velocityAppliedDeltaProxy ?? diagnostics.ulgStateDeltaSource?.velocityDeltaProxy ?? 0);
  diagnostics.ulgStateDeltaHash = diagnostics.ulgStateDeltaSource?.stateDeltaHash || null;
  diagnostics.ulgStateDeltaApplicationMode = diagnostics.ulgStateDeltaSource?.applicationMode || 'unavailable';
  diagnostics.ulgStateDeltaWebgpuKernelApplied = diagnostics.ulgStateDeltaSource?.webgpuKernelApplied === true;
  const reactionEventLedger = createMolecularReactionEventLedger(before, diagnostics);
  const reactionSource = createMolecularReactionSourceTerms({
    beforeDiagnostics: before,
    afterDiagnostics: diagnostics,
    eventLedger: reactionEventLedger,
    dt: options.dt
  });
  diagnostics.reactionEventLedger = reactionEventLedger;
  diagnostics.reactionSource = reactionSource;
  diagnostics.reactionEventCount = reactionEventLedger.bondEventCount;
  diagnostics.formedBondCount = reactionEventLedger.formedBondCount;
  diagnostics.brokenBondCount = reactionEventLedger.brokenBondCount;
  diagnostics.moleculeSpeciesDelta = reactionEventLedger.moleculeSpeciesDelta;
  diagnostics.reactionHeatSourceProxy = reactionSource.heat.netHeatSourceProxy;
  diagnostics.reactionSpeciesRateProxy = reactionSource.rates.speciesRateProxy;
  nextState.reactionProgress = diagnostics.reactionProgress;
  attachBondState(nextState, diagnostics.bonds);
  states.set(stateKey, cloneState(nextState));
  const conservation = {
    energyDelta: diagnostics.totalEnergyProxy - before.totalEnergyProxy,
    potentialEnergyDelta: diagnostics.forceFieldPotentialEnergyProxy - before.forceFieldPotentialEnergyProxy,
    qeqResidualPenaltyDelta: diagnostics.forceFieldQeqResidualPenaltyProxy - before.forceFieldQeqResidualPenaltyProxy,
    chargeDrift: diagnostics.totalCharge - before.totalCharge,
    bondCountDelta: diagnostics.bondCount - before.bondCount,
    formedBondCount: reactionEventLedger.formedBondCount,
    brokenBondCount: reactionEventLedger.brokenBondCount,
    reactionEventCount: reactionEventLedger.bondEventCount,
    moleculeDeltaMagnitude: reactionEventLedger.moleculeDeltaMagnitude,
    reactionEventIntensityProxy: reactionEventLedger.eventIntensityProxy,
    reactionHeatSourceProxy: reactionSource.heat.netHeatSourceProxy,
    reactionSpeciesRateProxy: reactionSource.rates.speciesRateProxy,
    quantumCouplingApplicationMode: diagnostics.quantumCouplingApplicationMode,
    quantumCouplingWebgpuKernelApplied: diagnostics.quantumCouplingWebgpuKernelApplied === true,
    quantumCouplingTemperatureDeltaK: diagnostics.quantumCouplingTemperatureDeltaK,
    quantumCouplingTargetCharge: diagnostics.quantumCouplingTargetCharge,
    quantumMaterialSourceApplied: diagnostics.quantumMaterialSourceApplied === true,
    quantumMaterialSourceMode: diagnostics.quantumMaterialSourceMode,
    quantumMaterialSourceWebgpuKernelApplied: diagnostics.quantumMaterialSourceWebgpuKernelApplied === true,
    quantumMaterialSourceRecordCount: diagnostics.quantumMaterialSourceRecordCount,
    quantumMaterialSourceForceGradientEvPerAngstrom: diagnostics.quantumMaterialSourceMeanForceGradientEvPerAngstrom,
    quantumMaterialSourceBondOrderScale: diagnostics.quantumMaterialSourceBondOrderScale,
    quantumMaterialSourcePairForceScale: diagnostics.quantumMaterialSourcePairForceScale,
    quantumMaterialSourceRestLengthDeltaAngstrom: diagnostics.quantumMaterialSourceRestLengthDeltaAngstrom,
    quantumMaterialSourcePairForceMix: diagnostics.quantumMaterialSourcePairForceMix,
    quantumMaterialSourceTargetPairLabel: diagnostics.quantumMaterialSourceTargetPairLabel,
    quantumMaterialSourcePrimaryElementZ: diagnostics.quantumMaterialSourcePrimaryElementZ,
    quantumMaterialSourceSecondaryElementZ: diagnostics.quantumMaterialSourceSecondaryElementZ,
    quantumMaterialSourcePairSelectivity: diagnostics.quantumMaterialSourcePairSelectivity,
    quantumMaterialSourcePairFallbackFactor: diagnostics.quantumMaterialSourcePairFallbackFactor,
    quantumMaterialSourceTargetAtomCount: diagnostics.quantumMaterialSourceTargetAtomCount,
    quantumMaterialSourceTargetFallbackAtomCount: diagnostics.quantumMaterialSourceTargetFallbackAtomCount,
    quantumMaterialSourceTargetAtomWeightedFactorSum: diagnostics.quantumMaterialSourceTargetAtomWeightedFactorSum,
    quantumMaterialSourceTargetAtomMeanFactor: diagnostics.quantumMaterialSourceTargetAtomMeanFactor,
    quantumMaterialSourceTargetAtomFraction: diagnostics.quantumMaterialSourceTargetAtomFraction,
    quantumMaterialSourceTargetPairSelectedCount: diagnostics.quantumMaterialSourceTargetPairSelectedCount,
    quantumMaterialSourceTargetPairFallbackCount: diagnostics.quantumMaterialSourceTargetPairFallbackCount,
    quantumMaterialSourceTargetPairMeanFactor: diagnostics.quantumMaterialSourceTargetPairMeanFactor,
    quantumMaterialSourceTemperatureDeltaK: diagnostics.quantumMaterialSourceTemperatureDeltaK,
    quantumMaterialSourceChargeDeltaProxy: diagnostics.quantumMaterialSourceChargeDeltaProxy,
    quantumMaterialSourceIonizationDrive: diagnostics.quantumMaterialSourceIonizationDrive,
    quantumMaterialSourceForceGradientDrive: diagnostics.quantumMaterialSourceForceGradientDrive,
    quantumMaterialSourceEnsemblePressurePa: diagnostics.quantumMaterialSourceEnsemblePressurePa,
    quantumMaterialSourceEnsemblePressureRatio: diagnostics.quantumMaterialSourceEnsemblePressureRatio,
    quantumMaterialSourceEnsemblePressureDrive: diagnostics.quantumMaterialSourceEnsemblePressureDrive,
    quantumMaterialSourceHeatCapacityProxy: diagnostics.quantumMaterialSourceHeatCapacityProxy,
    quantumMaterialSourceThermalDampingScale: diagnostics.quantumMaterialSourceThermalDampingScale,
    quantumMaterialSourceStatisticalSourceEquationSchema: diagnostics.quantumMaterialSourceStatisticalSourceEquationSchema,
    quantumMaterialSourceStatisticalSourceChannelCount: diagnostics.quantumMaterialSourceStatisticalSourceChannelCount,
    quantumMaterialSourceStatisticalPressureDriveProxy: diagnostics.quantumMaterialSourceStatisticalPressureDriveProxy,
    quantumMaterialSourceStatisticalOpacityDriveProxy: diagnostics.quantumMaterialSourceStatisticalOpacityDriveProxy,
    quantumMaterialSourceStatisticalIonizationDriveProxy: diagnostics.quantumMaterialSourceStatisticalIonizationDriveProxy,
    quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy: diagnostics.quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy,
    quantumMaterialSourceStatisticalTemperatureDeltaKProxy: diagnostics.quantumMaterialSourceStatisticalTemperatureDeltaKProxy,
    quantumMaterialSourceStatisticalChargeDeltaProxy: diagnostics.quantumMaterialSourceStatisticalChargeDeltaProxy,
    quantumMaterialSourceStatisticalThermalDampingScale: diagnostics.quantumMaterialSourceStatisticalThermalDampingScale,
    quantumMaterialSourceElectricalConductivitySpm: diagnostics.quantumMaterialSourceElectricalConductivitySpm,
    quantumMaterialSourceDielectricConstant: diagnostics.quantumMaterialSourceDielectricConstant,
    quantumMaterialSourceRefractiveIndex: diagnostics.quantumMaterialSourceRefractiveIndex,
    quantumMaterialSourceMechanicalResponsePa: diagnostics.quantumMaterialSourceMechanicalResponsePa,
    quantumMaterialSourceBulkModulusPa: diagnostics.quantumMaterialSourceBulkModulusPa,
    quantumMaterialSourceYoungsModulusPa: diagnostics.quantumMaterialSourceYoungsModulusPa,
    quantumMaterialSourceResponseDerivativesSchema: diagnostics.quantumMaterialSourceResponseDerivativesSchema,
    quantumMaterialSourceDensityTemperatureDerivativeKgM3PerK: diagnostics.quantumMaterialSourceDensityTemperatureDerivativeKgM3PerK,
    quantumMaterialSourceMechanicalPressureDerivativePaPerLog2Pressure: diagnostics.quantumMaterialSourceMechanicalPressureDerivativePaPerLog2Pressure,
    quantumMaterialSourceConductivityFieldDerivativeSpmPerNorm: diagnostics.quantumMaterialSourceConductivityFieldDerivativeSpmPerNorm,
    quantumMaterialSourceOpacityRadiationDerivativePerNorm: diagnostics.quantumMaterialSourceOpacityRadiationDerivativePerNorm,
    quantumMaterialSourceResponseDerivativeTemperatureDrive: diagnostics.quantumMaterialSourceResponseDerivativeTemperatureDrive,
    quantumMaterialSourceResponseDerivativePressureDrive: diagnostics.quantumMaterialSourceResponseDerivativePressureDrive,
    quantumMaterialSourceResponseDerivativeFieldDrive: diagnostics.quantumMaterialSourceResponseDerivativeFieldDrive,
    quantumMaterialSourceResponseDerivativeRadiationDrive: diagnostics.quantumMaterialSourceResponseDerivativeRadiationDrive,
    quantumMaterialSourceConductivityDrive: diagnostics.quantumMaterialSourceConductivityDrive,
    quantumMaterialSourceDielectricDrive: diagnostics.quantumMaterialSourceDielectricDrive,
    quantumMaterialSourceMechanicalStiffnessDrive: diagnostics.quantumMaterialSourceMechanicalStiffnessDrive,
    quantumMaterialSourceOpticalAbsorptionDrive: diagnostics.quantumMaterialSourceOpticalAbsorptionDrive,
    quantumMaterialPairForceBiasEnergyDelta: diagnostics.forceFieldQuantumMaterialPairForceBiasEnergyProxy - before.forceFieldQuantumMaterialPairForceBiasEnergyProxy,
    quantumMaterialEnsembleBiasEnergyDelta: diagnostics.forceFieldQuantumMaterialEnsembleBiasEnergyProxy - before.forceFieldQuantumMaterialEnsembleBiasEnergyProxy,
    quantumMaterialForceBiasEnergyDelta: diagnostics.forceFieldQuantumMaterialBiasEnergyProxy - before.forceFieldQuantumMaterialBiasEnergyProxy,
    forceFieldForceLawSchema: diagnostics.forceFieldForceLawSchema,
    forceFieldForceLawModelId: diagnostics.forceFieldForceLawModelId,
    forceFieldMeanPairRestLengthReducedNm: diagnostics.forceFieldMeanPairRestLengthReducedNm,
    forceFieldMeanPairAffinity: diagnostics.forceFieldMeanPairAffinity,
    forceFieldIonicPairCandidateCount: diagnostics.forceFieldIonicPairCandidateCount,
    forceFieldPolarPairCandidateCount: diagnostics.forceFieldPolarPairCandidateCount,
    forceFieldCovalentPairCandidateCount: diagnostics.forceFieldCovalentPairCandidateCount,
    forceFieldWeakPairCandidateCount: diagnostics.forceFieldWeakPairCandidateCount,
    molecularGeometryForceLawSchema: diagnostics.molecularGeometryForceLawSchema,
    molecularGeometryForceLawModelId: diagnostics.molecularGeometryForceLawModelId,
    waterGeometryTripletCount: diagnostics.waterGeometryTripletCount,
    waterGeometryMeanAngleDeg: diagnostics.waterGeometryMeanAngleDeg,
    waterGeometryMeanAbsAngleErrorDeg: diagnostics.waterGeometryMeanAbsAngleErrorDeg,
    waterGeometryRmsAngleErrorDeg: diagnostics.waterGeometryRmsAngleErrorDeg,
    waterGeometryEnergyProxy: diagnostics.waterGeometryEnergyProxy,
    waterGeometryTargetSource: diagnostics.waterGeometryTargetSource,
    waterGeometrySourceApplied: diagnostics.waterGeometrySourceApplied === true,
    waterGeometrySourceSchema: diagnostics.waterGeometrySourceSchema,
    waterGeometrySourceModelId: diagnostics.waterGeometrySourceModelId,
    waterGeometryTargetOhDistanceReducedNm: diagnostics.waterGeometryTargetOhDistanceReducedNm,
    waterGeometryTargetHhDistanceReducedNm: diagnostics.waterGeometryTargetHhDistanceReducedNm,
    waterGeometryTargetAngleDeg: diagnostics.waterGeometryTargetAngleDeg,
    quantumMaterialGeometrySourceApplied: diagnostics.quantumMaterialGeometrySourceApplied === true,
    quantumMaterialGeometrySourceSchema: diagnostics.quantumMaterialGeometrySourceSchema,
    quantumMaterialGeometrySourceModelId: diagnostics.quantumMaterialGeometrySourceModelId,
    quantumMaterialGeometryTargetSource: diagnostics.quantumMaterialGeometryTargetSource,
    quantumMaterialGeometryTargetOhDistanceReducedNm: diagnostics.quantumMaterialGeometryTargetOhDistanceReducedNm,
	    quantumMaterialGeometryTargetHhDistanceReducedNm: diagnostics.quantumMaterialGeometryTargetHhDistanceReducedNm,
	    quantumMaterialGeometryTargetAngleDeg: diagnostics.quantumMaterialGeometryTargetAngleDeg,
	    quantumMaterialGeometrySourceConfidence: diagnostics.quantumMaterialGeometrySourceConfidence,
	    quantumMaterialElectronicChargeSourceApplied: diagnostics.quantumMaterialElectronicChargeSourceApplied === true,
	    quantumMaterialElectronicChargeSourceSchema: diagnostics.quantumMaterialElectronicChargeSourceSchema,
	    quantumMaterialElectronicChargeSourceModelId: diagnostics.quantumMaterialElectronicChargeSourceModelId,
	    quantumMaterialElectronicChargeDeltaProxy: diagnostics.quantumMaterialElectronicChargeDeltaProxy,
	    quantumMaterialElectronicIonizationDriveProxy: diagnostics.quantumMaterialElectronicIonizationDriveProxy,
	    quantumMaterialElectronicChargeMobilityProxy: diagnostics.quantumMaterialElectronicChargeMobilityProxy,
	    quantumMaterialElectronicScreeningDampingScale: diagnostics.quantumMaterialElectronicScreeningDampingScale,
	    quantumMaterialElectronicQeqMixProxy: diagnostics.quantumMaterialElectronicQeqMixProxy,
	    quantumMaterialReactionBarrierSurfaceApplied: diagnostics.quantumMaterialReactionBarrierSurfaceApplied === true,
	    quantumMaterialReactionBarrierSurfaceSchema: diagnostics.quantumMaterialReactionBarrierSurfaceSchema,
	    quantumMaterialReactionBarrierSurfaceModelId: diagnostics.quantumMaterialReactionBarrierSurfaceModelId,
	    quantumMaterialReactionBarrierTargetReactionId: diagnostics.quantumMaterialReactionBarrierTargetReactionId,
	    quantumMaterialReactionBarrierTargetPairLabel: diagnostics.quantumMaterialReactionBarrierTargetPairLabel,
	    quantumMaterialReactionBarrierActivationEnergyEvProxy: diagnostics.quantumMaterialReactionBarrierActivationEnergyEvProxy,
	    quantumMaterialReactionBarrierProbabilityProxy: diagnostics.quantumMaterialReactionBarrierProbabilityProxy,
	    quantumMaterialReactionBarrierGateDampingScale: diagnostics.quantumMaterialReactionBarrierGateDampingScale,
	    quantumMaterialReactionBarrierGateProxy: diagnostics.quantumMaterialReactionBarrierGateProxy,
	    quantumMaterialReactionBarrierChargeTransferGateProxy: diagnostics.quantumMaterialReactionBarrierChargeTransferGateProxy,
	    quantumMaterialReactionBarrierUnsupportedProductBlockerCount: diagnostics.quantumMaterialReactionBarrierUnsupportedProductBlockerCount,
	    quantumMaterialReactionBarrierProductStoichiometryAvailable: diagnostics.quantumMaterialReactionBarrierProductStoichiometryAvailable === true,
	    quantumMaterialReactionBarrierProductTopologyAvailable: diagnostics.quantumMaterialReactionBarrierProductTopologyAvailable === true,
	    quantumMaterialReactionProductTopologyOverlayApplied: diagnostics.quantumMaterialReactionProductTopologyOverlayApplied === true,
	    quantumMaterialReactionProductTopologyNaohMoleculeCount: diagnostics.quantumMaterialReactionProductTopologyNaohMoleculeCount || 0,
	    quantumMaterialReactionProductTopologyH2MoleculeCount: diagnostics.quantumMaterialReactionProductTopologyH2MoleculeCount || 0,
    quantumMaterialReactionProductTopologyMutationApplied: diagnostics.quantumMaterialReactionProductTopologyMutationApplied === true,
    quantumMaterialReactionProductTopologyNewMutationApplied: diagnostics.quantumMaterialReactionProductTopologyNewMutationApplied === true,
    quantumMaterialReactionProductTopologyMutatedAtomCount: diagnostics.quantumMaterialReactionProductTopologyMutatedAtomCount || 0,
    quantumMaterialReactionProductTopologyRetiredWaterGroupCount: diagnostics.quantumMaterialReactionProductTopologyRetiredWaterGroupCount || 0,
    molecularTopologyBufferAtomFloatStride: diagnostics.molecularTopologyBufferAtomFloatStride,
    molecularTopologyBufferMetadataFloatOffset: diagnostics.molecularTopologyBufferMetadataFloatOffset,
    molecularTopologyBufferMetadataFloatCount: diagnostics.molecularTopologyBufferMetadataFloatCount,
    molecularTopologyBufferGpuVisible: diagnostics.molecularTopologyBufferGpuVisible === true,
    molecularTopologyBufferRoundTripApplied: diagnostics.molecularTopologyBufferRoundTripApplied === true,
    quantumMaterialReactionProductSourceApplied: diagnostics.quantumMaterialReactionProductSourceApplied === true,
	    quantumMaterialReactionProductTargetReactionId: diagnostics.quantumMaterialReactionProductTargetReactionId,
	    quantumMaterialReactionProductHeatReleaseProxy: diagnostics.quantumMaterialReactionProductHeatReleaseProxy,
	    quantumMaterialReactionProductChargeDeltaProxy: diagnostics.quantumMaterialReactionProductChargeDeltaProxy,
	    quantumMaterialReactionProductExtentProxy: diagnostics.quantumMaterialReactionProductExtentProxy,
	    quantumMaterialReactionProductProgressDriveProxy: diagnostics.quantumMaterialReactionProductProgressDriveProxy,
	    quantumMaterialReactionProductGasFormula: diagnostics.quantumMaterialReactionProductGasFormula,
	    quantumMaterialReactionProductGasMoleculeFractionPerNa: diagnostics.quantumMaterialReactionProductGasMoleculeFractionPerNa,
	    quantumMaterialReactionProductChargeTransferElectronCount: diagnostics.quantumMaterialReactionProductChargeTransferElectronCount,
	    quantumMaterialReactionProductTopologyRequired: diagnostics.quantumMaterialReactionProductTopologyRequired === true,
	    quantumMaterialReactionBarrierChargeTransferRequired: diagnostics.quantumMaterialReactionBarrierChargeTransferRequired === true,
	    reactionBarrierGatedCandidateCount: diagnostics.reactionBarrierGatedCandidateCount,
	    reactionBarrierSuppressedCandidateCount: diagnostics.reactionBarrierSuppressedCandidateCount,
	    reactionBarrierMeanDamping: diagnostics.reactionBarrierMeanDamping,
	    ulgStateDeltaApplied: diagnostics.ulgStateDeltaApplied === true,
	    ulgStateDeltaAppliedChannelCount: diagnostics.ulgStateDeltaAppliedChannelCount,
	    ulgStateDeltaTemperatureDeltaK: diagnostics.ulgStateDeltaTemperatureDeltaK,
    ulgStateDeltaChargeDeltaProxy: diagnostics.ulgStateDeltaChargeDeltaProxy,
    ulgStateDeltaVelocityDeltaProxy: diagnostics.ulgStateDeltaVelocityDeltaProxy,
    ulgStateDeltaApplicationMode: diagnostics.ulgStateDeltaApplicationMode,
    ulgStateDeltaWebgpuKernelApplied: diagnostics.ulgStateDeltaWebgpuKernelApplied === true,
    heatReleaseDelta: diagnostics.heatReleaseProxy - before.heatReleaseProxy,
    stoichiometryResidualDelta: diagnostics.stoichiometryResidualProxy - (before.stoichiometryResidualProxy || 0),
    componentClosureDelta: diagnostics.componentClosureFraction - (before.componentClosureFraction || 0),
    energyMode: 'reduced-molecular-dynamics-proxy',
    note: 'Reduced interactive MD patch; not a validated force field, ReaxFF, or quantum chemistry solve.'
  };
  const state = cloneState(nextState);
  const value = {
    ok: true,
    schema: MOLECULAR_DYNAMICS_RESULT_SCHEMA,
    executionContext: getExecutionContext(),
    solverId: payload.solver?.id || 'molecular-dynamics',
    stateKey,
    backend: advanceResult.backend,
    sequence: state.sequence,
    elapsedTime: state.elapsedTime,
    state,
    diagnostics,
    conservation,
    webgpuStatus: advanceResult.webgpuStatus,
    webgpuError: advanceResult.webgpuError
  };
  if (!resolved.emitCommitDelta) return value;
  return {
    value,
    commitDelta: {
      taskId: resolved.taskId,
      scope: resolved.scope,
      version: state.sequence,
      timestamp: Date.now(),
      payload: createDeltaPayload({
        payload,
        input,
        stateKey,
        state,
        diagnostics,
        conservation,
        backend: value.backend,
        webgpuStatus: value.webgpuStatus,
        webgpuError: value.webgpuError
      })
    }
  };
}
