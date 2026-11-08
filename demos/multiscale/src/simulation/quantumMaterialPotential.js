import { makeClosureResult, makeClosureState } from '../../../shared/closureContract.js';
import { ELEMENTS, getElementBySymbol } from '../../../schrodinger/src/data/elements.js';
import { getMolecularStructure } from '../../../schrodinger/src/data/molecularStructures.js';
import {
  estimateElementProperties,
  estimateMoleculeProperties
} from '../../../schrodinger/src/materials/materialProperties.js';

export const QUANTUM_MATERIAL_POTENTIAL_SCHEMA = 'peercompute.multiscale.quantum-material-potential.v0';
export const QUANTUM_MATERIAL_POTENTIAL_MODEL_ID = 'schrodinger-derived-material-property-contract-v0';
export const QUANTUM_MATERIAL_FORCE_SURFACE_SCHEMA = 'peercompute.multiscale.quantum-material-force-surface-preview.v0';
export const QUANTUM_MATERIAL_LAW_GRAPH_FRAGMENT_SCHEMA = 'peercompute.multiscale.law-graph-fragment.v0';
export const QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA = 'peercompute.multiscale.quantum-statistical-ensemble.v0';
export const QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA = 'peercompute.multiscale.quantum-statistical-source-equation.v0';
export const QUANTUM_STATISTICAL_CLOSURE_SCHEMA = 'peercompute.multiscale.quantum-statistical-closure.v0';
export const QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA = 'peercompute.multiscale.quantum-material-reaction-barrier-surface.v0';
export const QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA = 'peercompute.multiscale.quantum-material-product-topology.v0';

const BOHR_TO_ANGSTROM = 0.529177210903;
const ATM_PA = 101325;
const BOLTZMANN_EV_PER_K = 8.617333262145e-5;

const ELEMENT_SYMBOLS = new Set(ELEMENTS.map((element) => element.symbol));

const FORMULA_MATERIAL_ID = {
  H2O: 'water',
  H2: 'hydrogen',
  O2: 'oxygen',
  N2: 'nitrogen',
  CO2: 'carbon-dioxide',
  CH4: 'methane',
  NH3: 'ammonia',
  NaCl: 'sodium-chloride'
};

const COVALENT_RADIUS_ANGSTROM = {
  H: 0.31,
  C: 0.76,
  N: 0.71,
  O: 0.66,
  F: 0.57,
  Na: 1.66,
  Mg: 1.41,
  Al: 1.21,
  Si: 1.11,
  P: 1.07,
  S: 1.05,
  Cl: 1.02,
  Fe: 1.24,
  Cu: 1.32,
  Ag: 1.45,
  Au: 1.36,
  Pb: 1.46,
  U: 1.96
};

const VDW_RADIUS_ANGSTROM = {
  H: 1.2,
  C: 1.7,
  N: 1.55,
  O: 1.52,
  F: 1.47,
  Na: 2.27,
  Mg: 1.73,
  Al: 1.84,
  Si: 2.1,
  P: 1.8,
  S: 1.8,
  Cl: 1.75,
  Fe: 2.0,
  Cu: 1.4,
  Ag: 1.72,
  Au: 1.66,
  Pb: 2.02,
  U: 1.86
};

const REFERENCE_BOND_STRENGTH_EV = {
  'H-H:1:covalent': 4.52,
  'H-O:1:covalent': 4.8,
  'O-O:2:covalent': 5.12,
  'N-N:3:covalent': 9.79,
  'C-O:2:covalent': 7.7,
  'C-H:1:covalent': 4.28,
  'H-N:1:covalent': 4.05,
  'Cl-Na:1:ionic': 4.26
};

const REFERENCE_BOND_LENGTH_ANGSTROM = {
  'H-H:1:covalent': 0.741,
  'H-O:1:covalent': 0.957,
  'O-O:2:covalent': 1.21,
  'N-N:3:covalent': 1.1,
  'C-O:2:covalent': 1.16,
  'C-H:1:covalent': 1.09,
  'H-N:1:covalent': 1.01,
  'Cl-Na:1:ionic': 2.36
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeSymbol(symbol, fallback = 'O') {
  const raw = String(symbol || fallback).trim();
  if (!raw) return fallback;
  const normalized = raw[0].toUpperCase() + raw.slice(1).toLowerCase();
  return ELEMENT_SYMBOLS.has(normalized) ? normalized : fallback;
}

function getTemperatureK(environment = {}, molecularDynamics = {}) {
  const mdActive = finiteNumber(molecularDynamics.atomCount, 0) > 0
    || (molecularDynamics.backend && molecularDynamics.backend !== 'none');
  return finiteNumber(
    mdActive ? molecularDynamics.meanTemperatureK : undefined,
    finiteNumber(environment.ambientTemperatureK, 293.15)
  );
}

function getPressurePa(environment = {}) {
  return Math.max(1, finiteNumber(environment.ambientPressurePa, ATM_PA));
}

function getOrbitalEnvelope(source = {}) {
  const closure = source?.closureResult && typeof source.closureResult === 'object'
    ? source.closureResult
    : source?.quantumOrbitalClosure && typeof source.quantumOrbitalClosure === 'object'
      ? source.quantumOrbitalClosure
      : null;
  const chemistry = closure?.chemistry || source.chemistry || {};
  const diagnostics = closure?.diagnostics || source.diagnostics || {};
  const finiteGrid = source.finiteGrid || diagnostics.finiteGrid || source.finiteGridSummary || {};
  const activeOrbital = source.activeOrbital && typeof source.activeOrbital === 'object'
    ? source.activeOrbital
    : {
        label: chemistry.activeOrbital || source.activeOrbital || source.activeOrbitalLabel || 'unknown',
        n: chemistry.principalN ?? source.principalN ?? finiteGrid.principalN ?? 0,
        l: chemistry.angularL ?? source.angularL ?? finiteGrid.angularL ?? 0,
        magneticM: chemistry.magneticM ?? source.magneticM ?? finiteGrid.magneticM ?? 0
      };
  return {
    closure,
    chemistry,
    diagnostics,
    finiteGrid,
    activeOrbital,
    elementSymbol: normalizeSymbol(
      source.element?.symbol
        || chemistry.elementSymbol
        || source.elementSymbol
        || finiteGrid.elementSymbol
        || 'O'
    )
  };
}

function orbitalShapeDescriptor(activeOrbital = {}, finiteGrid = {}) {
  const l = Math.max(0, Math.round(finiteNumber(activeOrbital.l ?? activeOrbital.angularL, 0)));
  const shape = l === 0
    ? 'spherical'
    : l === 1
      ? 'two-lobed'
      : l === 2
        ? 'multi-lobed-clover'
        : 'complex-multi-lobed';
  return {
    orbitalLabel: activeOrbital.label || `${activeOrbital.n || '?'}l${l}`,
    principalN: Math.max(0, Math.round(finiteNumber(activeOrbital.n ?? activeOrbital.principalN, 0))),
    angularL: l,
    magneticM: Math.round(finiteNumber(activeOrbital.magneticM, 0)),
    shape,
    meanRadiusBohr: finiteNumber(finiteGrid.meanRadiusBohr, null),
    meanRadiusAngstrom: finiteNumber(finiteGrid.meanRadiusBohr, 0) * BOHR_TO_ANGSTROM,
    rmsRadiusBohr: finiteNumber(finiteGrid.rmsRadiusBohr, null),
    rmsRadiusAngstrom: finiteNumber(finiteGrid.rmsRadiusBohr, 0) * BOHR_TO_ANGSTROM,
    finiteGridBoundaryMass: finiteNumber(finiteGrid.boundaryMass, 0),
    finiteGridNormError: finiteNumber(finiteGrid.normalizationError, 0)
  };
}

function materialCompleteness(packet = {}) {
  const required = [
    packet.state?.densityKgM3,
    packet.mechanics?.bulkModulusPa,
    packet.optical?.refractiveIndex,
    packet.electromagnetic?.dielectricConstant,
    packet.electromagnetic?.electricalConductivitySpm
  ];
  const optional = [
    packet.mechanics?.youngsModulusPa,
    packet.mechanics?.shearModulusPa,
    packet.thermal?.thermalConductivityWmK,
    packet.thermal?.heatCapacityJkgK
  ];
  const available = [...required, ...optional].filter((value) => Number.isFinite(Number(value))).length;
  return {
    availablePropertyCount: available,
    totalTrackedPropertyCount: required.length + optional.length,
    score: available / Math.max(1, required.length + optional.length),
    missing: {
      densityKgM3: !Number.isFinite(Number(packet.state?.densityKgM3)),
      bulkModulusPa: !Number.isFinite(Number(packet.mechanics?.bulkModulusPa)),
      youngsModulusPa: !Number.isFinite(Number(packet.mechanics?.youngsModulusPa)),
      shearModulusPa: !Number.isFinite(Number(packet.mechanics?.shearModulusPa)),
      refractiveIndex: !Number.isFinite(Number(packet.optical?.refractiveIndex)),
      dielectricConstant: !Number.isFinite(Number(packet.electromagnetic?.dielectricConstant)),
      electricalConductivitySpm: !Number.isFinite(Number(packet.electromagnetic?.electricalConductivitySpm))
    }
  };
}

function dominantMolecule(molecularDynamics = {}) {
  const molecules = molecularDynamics.molecularSpecies || {};
  let best = null;
  for (const [formula, rawCount] of Object.entries(molecules)) {
    const count = finiteNumber(rawCount, 0);
    if (count <= 0) continue;
    if (!best || count > best.count) best = { formula, count };
  }
  return best;
}

function compositionForUnsupportedChecks(molecularDynamics = {}) {
  const species = molecularDynamics.species || {};
  const molecules = molecularDynamics.molecularSpecies || {};
  return {
    species,
    molecules,
    hasWater: finiteNumber(molecules.H2O, 0) > 0
      || (finiteNumber(species.H, 0) >= 2 && finiteNumber(species.O, 0) >= 1),
    hasSodium: finiteNumber(species.Na, 0) > 0 || finiteNumber(molecules.Na, 0) > 0,
    hasHydrogen: finiteNumber(species.H, 0) > 0,
    hasOxygen: finiteNumber(species.O, 0) > 0
  };
}

function createNaWaterReactionBarrierSurface({ molecularDynamics = {}, conditions = {} } = {}) {
  const composition = compositionForUnsupportedChecks(molecularDynamics);
  if (!composition.hasSodium || !composition.hasWater) return null;
  const sodiumCount = Math.max(
    finiteNumber(composition.species.Na, 0),
    finiteNumber(composition.molecules.Na, 0)
  );
  const waterCount = Math.max(
    finiteNumber(composition.molecules.H2O, 0),
    Math.min(finiteNumber(composition.species.O, 0), finiteNumber(composition.species.H, 0) / 2)
  );
  const limitingExtentMoleculeCount = Math.max(0, Math.min(sodiumCount, waterCount));
  if (limitingExtentMoleculeCount <= 0) return null;
  const temperatureK = Math.max(1, finiteNumber(conditions.temperatureK, 293.15));
  const pressureRatio = Math.max(1e-6, finiteNumber(conditions.pressurePa, ATM_PA) / ATM_PA);
  const electricDrive = clamp(Math.abs(finiteNumber(conditions.electricFieldVm, 0)) / 1e9, 0, 2);
  const activationEnergyEvProxy = clamp(
    0.34
      - clamp((temperatureK - 273.15) / 1800, 0, 0.18)
      - electricDrive * 0.035
      + Math.log2(Math.max(1, pressureRatio)) * 0.012,
    0.08,
    0.9
  );
  const kBT = Math.max(0.025, BOLTZMANN_EV_PER_K * temperatureK);
  const reactionProbabilityProxy = clamp(Math.exp(-activationEnergyEvProxy / kBT) * 0.75 + electricDrive * 0.08, 0, 1);
  const chargeTransferGateProxy = clamp(0.34 + reactionProbabilityProxy * 0.28 + electricDrive * 0.12, 0, 1);
  const extentProxy = clamp(
    limitingExtentMoleculeCount / Math.max(1, waterCount)
      * (0.28 + reactionProbabilityProxy * 0.44 + chargeTransferGateProxy * 0.18),
    0,
    1
  );
  const heatReleaseEvPerNaProxy = 1.9;
  const productTopology = {
    schema: QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA,
    modelId: 'reduced-naoh-h2-product-topology-v0',
    status: 'reduced-product-topology-ready',
    calibrated: false,
    reactionId: 'na-h2o-to-naoh-h2-reduced-stoichiometry',
    topologyMode: 'reduced-bond-graph-overlay',
    authoritativeAtomMutationReady: false,
    conservativeTopologyMutation: false,
    reducedBondGraphOverlayAvailable: true,
    reactionSiteCount: Math.max(1, Math.floor(limitingExtentMoleculeCount)),
    maxReactionSiteCount: Math.max(1, Math.floor(limitingExtentMoleculeCount)),
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
        source: 'qmat-reduced-product-topology'
      },
      {
        productFormula: 'NaOH',
        pairLabel: 'O-H',
        elements: ['O', 'H'],
        order: 0.96,
        bondClass: 'polar-covalent',
        targetDistanceReducedNm: 0.0957,
        source: 'qmat-reduced-product-topology'
      },
      {
        productFormula: 'H2',
        pairLabel: 'H-H',
        elements: ['H', 'H'],
        order: 1,
        bondClass: 'covalent',
        targetDistanceReducedNm: 0.074,
        source: 'qmat-reduced-product-topology'
      }
    ],
    sourceStoichiometry: {
      reactants: { Na: 1, H2O: 1 },
      products: { NaOH: 1, H2: 0.5 }
    },
    validity: {
      status: 'interactive-product-topology-proxy',
      warnings: [
        'Reduced qmat product topology supplies a NaOH/H2 bond-graph overlay without creating or deleting atoms.',
        'Scientific mode must replace this with conservative topology mutation, calibrated kinetics, and energy-conserving charge transfer.'
      ]
    }
  };
  const productStoichiometry = {
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
    limitingReactant: sodiumCount <= waterCount ? 'Na' : 'H2O',
    limitingExtentMoleculeCount,
    waterCount,
    sodiumCount,
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
    productTopologyRequired: true,
    validity: {
      status: 'interactive-reaction-product-proxy',
      warnings: [
        'Na-water product stoichiometry is a reduced qmat handoff for source terms and a reduced NaOH/H2 bond-graph overlay.',
        'Scientific mode must replace this with calibrated reaction barriers, charge equilibration, product energetics, and conservative topology updates.'
      ]
    }
  };
  return {
    schema: QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA,
    modelId: 'reduced-na-water-reaction-barrier-surface-v0',
    status: 'reduced-product-stoichiometry-ready',
    backend: 'schrodinger-material-contract',
    calibrated: false,
    webgpuDerived: false,
    barrierAvailable: true,
    productStoichiometryAvailable: true,
    productTopologyAvailable: true,
    productStoichiometry,
    productTopology,
    chargeTransferRequired: true,
    targetReactionId: productStoichiometry.reactionId,
    targetPairLabel: 'Na-H2O',
    reactantBasis: Object.keys(productStoichiometry.reactants),
    productBasis: Object.keys(productStoichiometry.products),
    electronDonorElementZ: 11,
    electronDonorElementSymbol: 'Na',
    electronAcceptorElementZ: 8,
    electronAcceptorElementSymbol: 'O',
    activationEnergyEvProxy,
    reactionProbabilityProxy,
    reactionCoordinateForceProxy: 0,
    reactionCoordinateCurvatureProxy: 0,
    chargeTransferGateProxy,
    gateDampingScale: clamp(1 - chargeTransferGateProxy * 0.18 + reactionProbabilityProxy * 0.04, 0.62, 1),
    reactionBarrierGateProxy: clamp(chargeTransferGateProxy * 0.18 - reactionProbabilityProxy * 0.04, 0, 1),
    unsupportedProductBlockerCount: 0,
    productHeatReleaseEvPerNaProxy: productStoichiometry.heatReleaseEvPerNaProxy,
    productHeatReleaseProxy: productStoichiometry.heatReleaseProxy,
    productChargeDeltaProxy: productStoichiometry.chargeDeltaProxy,
    productExtentProxy: productStoichiometry.extentProxy,
    productGasFormula: productStoichiometry.gasProductFormula,
    productGasMoleculeFractionPerNa: productStoichiometry.gasProductMoleculeFractionPerNa,
    productChargeTransferElectronCount: productStoichiometry.chargeTransferElectronCount,
    productEnthalpyDeltaKjPerMolNaProxy: productStoichiometry.enthalpyDeltaKjPerMolNaProxy,
    productTopologySchema: productTopology.schema,
    productTopologyModelId: productTopology.modelId,
    productTopologyMode: productTopology.topologyMode,
    productTopologyReactionSiteCount: productTopology.reactionSiteCount,
    productTopologyReducedBondCount: productTopology.productBonds.length,
    sourceRecordCount: Math.max(0, Math.round(finiteNumber(molecularDynamics.atomCount, sodiumCount + waterCount * 3))),
    confidence: clamp(0.5 + reactionProbabilityProxy * 0.16 - Math.max(0, 298 - temperatureK) * 0.0002, 0.28, 0.76),
    conditionSnapshot: conditions,
    validity: {
      status: 'interactive-reaction-barrier-proxy',
      warnings: [
        'Reduced Na-water reaction surface supplies product stoichiometry, heat, gas, charge, and bond-graph topology metadata; it is not a calibrated reaction path.',
        'Product topology is a reduced overlay, so MD must not treat this as authoritative conservative atom mutation.'
      ]
    }
  };
}

function createUnsupportedChemistryReport(molecularDynamics = {}, { reactionBarrierSurface = null } = {}) {
  const composition = compositionForUnsupportedChecks(molecularDynamics);
  const blocked = [];
  const hasNaWaterProductSurface = reactionBarrierSurface?.schema === QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA
    && reactionBarrierSurface.productStoichiometryAvailable === true;
  if (composition.hasSodium && composition.hasWater && !hasNaWaterProductSurface) {
    blocked.push({
      id: 'na-water-reactive-charge-transfer',
      status: 'blocked-until-reactive-potential',
      reason: 'Sodium plus water requires charge transfer, electron solvation, reaction barriers, and product energetics; the current Schrodinger layer only provides static material properties and reduced bond references.',
      requiredArtifacts: [
        'multi-species-reactive-potential-na-h-o',
        'charge-transfer-qeq-or-electronic-structure-solver',
        'reaction-barrier-surface-na-h2o-to-naoh-h2',
        'energy-conserving-product-stoichiometry'
      ]
    });
  }
  const unsupportedMolecules = Object.entries(composition.molecules)
    .filter(([formula, rawCount]) => finiteNumber(rawCount, 0) > 0
      && !FORMULA_MATERIAL_ID[formula]
      && !ELEMENT_SYMBOLS.has(formula))
    .map(([formula, count]) => ({ formula, count }));
  if (unsupportedMolecules.length) {
    blocked.push({
      id: 'unmapped-molecular-material-packets',
      status: 'property-gap',
      reason: 'Molecule has no reference material packet in this slice.',
      unsupportedMolecules
    });
  }
  return {
    unsupportedReactiveChemistry: blocked.length > 0,
    blockedInteractionCount: blocked.length,
    blockedInteractions: blocked,
    resolvedInteractions: hasNaWaterProductSurface
      ? [{
        id: 'na-water-reactive-charge-transfer',
        status: 'reduced-product-stoichiometry-ready',
        reactionBarrierSurfaceSchema: reactionBarrierSurface.schema,
        targetReactionId: reactionBarrierSurface.targetReactionId,
        productStoichiometry: reactionBarrierSurface.productStoichiometry || null,
        productTopologyAvailable: reactionBarrierSurface.productTopologyAvailable === true
      }]
      : [],
    requiredArtifactCount: blocked.reduce((sum, item) => sum + (item.requiredArtifacts?.length || 0), 0)
  };
}

function createConditionSummary(environment = {}, molecularDynamics = {}) {
  const temperatureK = getTemperatureK(environment, molecularDynamics);
  const pressurePa = getPressurePa(environment);
  const gravityMps2 = finiteNumber(environment.gravityMps2, 9.81);
  const oxygenFraction = clamp(finiteNumber(environment.oxygenFraction, 0.21), 0, 1);
  const stellarFlux = finiteNumber(environment.stellarFlux, 1);
  const radiativeHeatFlux = finiteNumber(environment.radiativeHeatFlux, 0);
  const electricFieldVm = finiteNumber(environment.electricFieldVm ?? environment.electricFieldVpm, 0);
  const magneticFieldT = finiteNumber(environment.magneticFieldT, 0);
  return {
    schema: 'peercompute.multiscale.quantum-material-conditions.v0',
    temperatureK,
    pressurePa,
    gravityMps2,
    oxygenFraction,
    stellarFlux,
    radiativeHeatFlux,
    electricFieldVm,
    magneticFieldT,
    molecularMeanTemperatureK: finiteNumber(molecularDynamics.meanTemperatureK, temperatureK),
    molecularPressureProxy: finiteNumber(molecularDynamics.pressureProxy, 0),
    molecularIonizationFraction: finiteNumber(molecularDynamics.ionizationFraction, 0),
    molecularReactionProgress: finiteNumber(molecularDynamics.reactionProgress, 0),
    molecularPhaseRegime: molecularDynamics.phaseRegime || 'unknown'
  };
}

function createBehaviorSurface({
  propertyPacket,
  unsupportedChemistry,
  molecularDynamics = {},
  conditions,
  reactionBarrierSurface = null
}) {
  const temperatureK = conditions.temperatureK;
  const pressurePa = conditions.pressurePa;
  const phase = propertyPacket.state?.phase || 'unknown';
  const thermalConductivity = finiteNumber(propertyPacket.thermal?.thermalConductivityWmK, 0);
  const heatCapacity = finiteNumber(propertyPacket.thermal?.heatCapacityJkgK, 0);
  const density = Math.max(1e-9, finiteNumber(propertyPacket.state?.densityKgM3, 1));
  const diffusivity = heatCapacity > 0
    ? thermalConductivity / Math.max(1e-9, density * heatCapacity)
    : 0;
  const bulk = finiteNumber(propertyPacket.mechanics?.bulkModulusPa, 0);
  const soundSpeedMps = bulk > 0 ? Math.sqrt(bulk / density) : null;
  const boilingK = finiteNumber(propertyPacket.thermal?.eosParams?.boilK, null)
    ?? finiteNumber(propertyPacket.thermal?.eosParams?.boilingK, null);
  const meltingK = finiteNumber(propertyPacket.thermal?.eosParams?.freezeK, null)
    ?? finiteNumber(propertyPacket.thermal?.eosParams?.meltingK, null);
  const vaporizationDrive = Number.isFinite(boilingK)
    ? clamp((temperatureK - boilingK) / 50, 0, 1)
    : phase === 'gas' ? 1 : 0;
  const freezingDrive = Number.isFinite(meltingK)
    ? clamp((meltingK - temperatureK) / 25, 0, 1)
    : phase === 'solid' ? 1 : 0;
  const ionizationDrive = clamp(
    finiteNumber(molecularDynamics.ionizationFraction, 0) * 0.75
      + Math.max(0, temperatureK - 2500) / 8500
      + Math.abs(conditions.electricFieldVm) / 1e9,
    0,
    1
  );
  const compressionDrive = clamp(Math.log10(Math.max(1, pressurePa / ATM_PA)) / 4, 0, 1);
  const oxidationDrive = clamp(
    conditions.oxygenFraction
      * (0.2 + finiteNumber(molecularDynamics.reactiveHotFraction, 0) * 0.8)
      * (temperatureK > 650 ? 1 : Math.max(0, (temperatureK - 300) / 350)),
    0,
    1
  );
  const conductiveResponse = clamp(
    Math.log10(1 + finiteNumber(propertyPacket.electromagnetic?.electricalConductivitySpm, 0)) / 8,
    0,
    1
  );
  const elasticResponse = clamp(
    (finiteNumber(propertyPacket.mechanics?.youngsModulusPa, 0) || finiteNumber(propertyPacket.mechanics?.bulkModulusPa, 0)) / 1e11,
    0,
    1
  );
  return {
    schema: 'peercompute.multiscale.quantum-material-behavior-surface.v0',
    status: unsupportedChemistry.unsupportedReactiveChemistry ? 'reactive-behavior-blocked' : 'proxy-behavior-ready',
    phase,
    soundSpeedMps,
    thermalDiffusivityM2s: diffusivity,
    vaporizationDrive,
    freezingDrive,
    ionizationDrive,
    compressionDrive,
    oxidationDrive,
    conductiveResponse,
    elasticResponse,
    gravitySedimentationDrive: clamp(Math.abs(conditions.gravityMps2) * density / 2e5, 0, 1),
    magneticResponse: clamp(Math.abs(finiteNumber(propertyPacket.electromagnetic?.magneticSusceptibility, 0) * conditions.magneticFieldT), 0, 1),
    electricPolarizationDrive: clamp(
      finiteNumber(propertyPacket.electromagnetic?.dielectricConstant, 1)
        * Math.abs(conditions.electricFieldVm)
        / 1e10,
      0,
      1
    ),
    blockedReactiveInteractionCount: unsupportedChemistry.blockedInteractionCount,
    productStoichiometryAvailable: reactionBarrierSurface?.productStoichiometryAvailable === true,
    productTopologyAvailable: reactionBarrierSurface?.productTopologyAvailable === true,
    targetReactionId: reactionBarrierSurface?.targetReactionId || null,
    behaviorHooks: {
      phaseChange: true,
      opticalResponse: true,
      thermalTransport: true,
      mechanicalResponse: true,
      electromagneticResponse: true,
      chemicalReaction: !unsupportedChemistry.unsupportedReactiveChemistry,
      radioactiveDecay: finiteNumber(propertyPacket.nuclear?.activityBqKg, 0) > 0,
      liveForceGradient: false,
      liveReactionPath: reactionBarrierSurface?.productStoichiometryAvailable === true
    }
  };
}

function bondKey(a, b, order, bondClass) {
  const sorted = [a, b].sort();
  return `${sorted[0]}-${sorted[1]}:${Math.max(1, Math.round(finiteNumber(order, 1)))}:${bondClass || 'covalent'}`;
}

function proxyBondStrengthEv({ atoms, order = 1, bondClass = 'covalent' }) {
  if (bondClass === 'ionic') return 3.8 + 0.35 * Math.max(1, order);
  if (bondClass === 'metallic') return 1.5 + 0.25 * Math.max(1, order);
  const [a, b] = atoms;
  const radiusA = COVALENT_RADIUS_ANGSTROM[a] || 0.8;
  const radiusB = COVALENT_RADIUS_ANGSTROM[b] || 0.8;
  return clamp((2.2 + 1.45 * Math.max(1, order)) / Math.max(0.55, radiusA + radiusB), 1.2, 9.5);
}

function proxyBondLengthAngstrom(atoms) {
  const [a, b] = atoms;
  return (COVALENT_RADIUS_ANGSTROM[a] || 0.8) + (COVALENT_RADIUS_ANGSTROM[b] || 0.8);
}

function createBondStrengthTerms(formula) {
  if (!formula) return [];
  const structure = getMolecularStructure(formula);
  return structure.bonds.map((bond, index) => {
    const from = structure.atoms[bond.from]?.symbol || '?';
    const to = structure.atoms[bond.to]?.symbol || '?';
    const key = bondKey(from, to, bond.order, bond.bondClass);
    const hasReference = Number.isFinite(REFERENCE_BOND_STRENGTH_EV[key]);
    return {
      schema: 'peercompute.multiscale.quantum-material-bond-strength-term.v0',
      formula: structure.formula,
      index,
      atoms: [from, to],
      bondClass: bond.bondClass || 'unknown',
      order: bond.order || 1,
      label: bond.label || `${from}-${to}`,
      equilibriumLengthAngstrom: finiteNumber(
        REFERENCE_BOND_LENGTH_ANGSTROM[key],
        proxyBondLengthAngstrom([from, to])
      ),
      dissociationEnergyEv: hasReference
        ? REFERENCE_BOND_STRENGTH_EV[key]
        : proxyBondStrengthEv({ atoms: [from, to], order: bond.order, bondClass: bond.bondClass }),
      source: hasReference ? 'reference-bond-energy-lite' : 'order-radius-proxy',
      forceConstantProxy: hasReference
        ? REFERENCE_BOND_STRENGTH_EV[key] / Math.max(0.2, REFERENCE_BOND_LENGTH_ANGSTROM[key] || 1)
        : null
    };
  });
}

function createForceSurfacePreview({
  bondStrengthTerms = [],
  conditions = {},
  unsupportedChemistry = {},
  reactionBarrierSurface = null
}) {
  const temperatureNorm = clamp((finiteNumber(conditions.temperatureK, 293.15) - 293.15) / 1200, -1, 3);
  const pressureLog = Math.log2(Math.max(1e-9, finiteNumber(conditions.pressurePa, ATM_PA) / ATM_PA));
  const fieldDrive = clamp(
    Math.abs(finiteNumber(conditions.electricFieldVm, 0)) / 1e9
      + Math.abs(finiteNumber(conditions.magneticFieldT, 0)) / 50
      + Math.abs(finiteNumber(conditions.radiativeHeatFlux, 0)) / 5000,
    0,
    4
  );
  const terms = bondStrengthTerms.map((term, index) => {
    const dissociationEnergyEv = Math.max(0, finiteNumber(term.dissociationEnergyEv, 0));
    const equilibriumLengthAngstrom = Math.max(0.1, finiteNumber(term.equilibriumLengthAngstrom, 1));
    const alphaPerAngstrom = clamp(
      Math.sqrt(Math.max(0.02, finiteNumber(term.forceConstantProxy, dissociationEnergyEv / equilibriumLengthAngstrom)) / Math.max(0.2, 2 * dissociationEnergyEv || 1)),
      0.15,
      4
    );
    const probeDisplacementAngstrom = clamp(
      equilibriumLengthAngstrom * (0.015 * temperatureNorm - 0.008 * pressureLog + 0.01 * fieldDrive),
      -0.12,
      0.18
    );
    const probeDistanceAngstrom = Math.max(0.05, equilibriumLengthAngstrom + probeDisplacementAngstrom);
    const displacement = probeDistanceAngstrom - equilibriumLengthAngstrom;
    const expTerm = Math.exp(-alphaPerAngstrom * displacement);
    const potentialEnergyEv = dissociationEnergyEv * (1 - expTerm) ** 2 - dissociationEnergyEv;
    const dEnergyDrEvPerAngstrom = 2 * dissociationEnergyEv * alphaPerAngstrom * (1 - expTerm) * expTerm;
    const curvatureEvPerAngstrom2 = 2 * dissociationEnergyEv * alphaPerAngstrom ** 2 * (2 * expTerm ** 2 - expTerm);
    return {
      schema: 'peercompute.multiscale.quantum-material-force-surface-term.v0',
      index,
      sourceBondLabel: term.label,
      atoms: term.atoms,
      bondClass: term.bondClass,
      order: term.order,
      model: 'reduced-morse-from-reference-bond-term',
      calibrated: false,
      bornOppenheimer: false,
      dissociationEnergyEv,
      equilibriumLengthAngstrom,
      alphaPerAngstrom,
      probeDistanceAngstrom,
      probeDisplacementAngstrom,
      potentialEnergyEv,
      dEnergyDrEvPerAngstrom,
      forceMagnitudeEvPerAngstrom: Math.abs(dEnergyDrEvPerAngstrom),
      curvatureEvPerAngstrom2,
      source: term.source
    };
  });
  const count = Math.max(1, terms.length);
  const meanPotentialEnergyEv = terms.reduce((sum, term) => sum + term.potentialEnergyEv, 0) / count;
  const meanForceGradientEvPerAngstrom = terms.reduce((sum, term) => sum + Math.abs(term.dEnergyDrEvPerAngstrom), 0) / count;
  const maxForceGradientEvPerAngstrom = terms.reduce((max, term) => Math.max(max, Math.abs(term.dEnergyDrEvPerAngstrom)), 0);
  const meanCurvatureEvPerAngstrom2 = terms.reduce((sum, term) => sum + term.curvatureEvPerAngstrom2, 0) / count;
  return {
    schema: QUANTUM_MATERIAL_FORCE_SURFACE_SCHEMA,
    modelId: 'reduced-morse-bond-force-surface-preview-v0',
    status: unsupportedChemistry.unsupportedReactiveChemistry
      ? 'preview-ready-reaction-barrier-blocked'
      : terms.length > 0
        ? 'reduced-force-preview-ready'
        : 'no-bond-force-preview',
    calibrated: false,
    bornOppenheimerForcesAvailable: false,
    reducedEnergyGradientAvailable: terms.length > 0,
    reactionBarrierSurfaceAvailable: reactionBarrierSurface?.barrierAvailable === true,
    productStoichiometryAvailable: reactionBarrierSurface?.productStoichiometryAvailable === true,
    reactionBarrierSurface: reactionBarrierSurface ? { ...reactionBarrierSurface } : null,
    termCount: terms.length,
    meanPotentialEnergyEv,
    meanForceGradientEvPerAngstrom,
    maxForceGradientEvPerAngstrom,
    meanCurvatureEvPerAngstrom2,
    terms,
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'Reduced Morse-style force preview derived from reference bond terms; not a calibrated Born-Oppenheimer surface.',
        'Do not use this preview for reactive charge transfer, product stoichiometry, or scientific conservative mutation.'
      ]
    }
  };
}

export function createQuantumStatisticalSourceEquation({
  statisticalEnsemble = {},
  conditions = {}
} = {}) {
  const pressurePa = Math.max(1, finiteNumber(
    statisticalEnsemble.pressurePa,
    conditions.pressurePa ?? ATM_PA
  ));
  const ensemblePressurePa = Math.max(1, finiteNumber(
    statisticalEnsemble.ensemblePressurePa ?? statisticalEnsemble.closureOutputs?.pressurePa,
    pressurePa
  ));
  const pressureRatio = ensemblePressurePa / Math.max(1, pressurePa);
  const ionizationFraction = clamp(finiteNumber(statisticalEnsemble.ionizationFraction, 0), 0, 1);
  const opacityProxy = clamp(finiteNumber(statisticalEnsemble.opacityProxy, 0), 0, 64);
  const degeneracyParameter = clamp(finiteNumber(statisticalEnsemble.degeneracyParameter, 0), 0, 128);
  const heatCapacityProxy = clamp(finiteNumber(statisticalEnsemble.heatCapacityProxy, 0), 0, 64);
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
  const temperatureDeltaKProxy = clamp(
    ionizationFraction * 42
      + opacityProxy * 0.9
      + pressureDriveProxy * 8
      + heatCapacityProxy * 0.2,
    -20,
    45
  );
  const chargeDeltaProxy = clamp(
    ionizationFraction * 0.08 + degeneracyPressureDriveProxy * 0.02,
    -0.04,
    0.08
  );
  const channels = [
    {
      id: 'ensemble-pressure',
      quantity: 'pressure',
      unit: 'Pa',
      sourceValue: ensemblePressurePa,
      baseValue: pressurePa,
      driveProxy: pressureDriveProxy,
      role: 'eos-pressure-response'
    },
    {
      id: 'ionization-population',
      quantity: 'ionization-fraction',
      unit: 'dimensionless',
      sourceValue: ionizationFraction,
      driveProxy: ionizationDriveProxy,
      role: 'charge-state-response'
    },
    {
      id: 'opacity-population',
      quantity: 'opacity-proxy',
      unit: 'reduced',
      sourceValue: opacityProxy,
      driveProxy: opacityDriveProxy,
      role: 'radiation-optical-response'
    },
    {
      id: 'degeneracy-pressure',
      quantity: 'degeneracy-parameter',
      unit: 'dimensionless',
      sourceValue: degeneracyParameter,
      driveProxy: degeneracyPressureDriveProxy,
      role: 'quantum-statistical-pressure-support'
    },
    {
      id: 'heat-capacity',
      quantity: 'heat-capacity-proxy',
      unit: 'reduced',
      sourceValue: heatCapacityProxy,
      driveProxy: thermalDampingScale,
      role: 'thermal-response-damping'
    }
  ];
  return {
    schema: QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA,
    adapterSchema: 'peercompute.multiscale.molecular-source-equation.v0',
    mode: 'quantum-statistical-ensemble-source-channels-v0',
    status: 'source-equation-ready',
    calibrated: false,
    source: {
      ensembleSchema: statisticalEnsemble.schema || QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA,
      modelId: statisticalEnsemble.modelId || null,
      backend: statisticalEnsemble.backend || null,
      recordCount: Math.max(0, Math.round(finiteNumber(statisticalEnsemble.recordCount, 0))),
      distribution: statisticalEnsemble.source?.distribution || 'reduced-boltzmann-saha-degeneracy',
      hamiltonian: statisticalEnsemble.source?.hamiltonian || null,
      partitionFunctionLog: finiteNumber(statisticalEnsemble.partitionFunctionLog, 0)
    },
    channelCount: channels.length,
    channels,
    sourceTerms: {
      temperatureDeltaKProxy,
      chargeDeltaProxy,
      pressureDriveProxy,
      opacityDriveProxy,
      ionizationDriveProxy,
      degeneracyPressureDriveProxy,
      heatCapacityProxy,
      thermalDampingScale,
      pressureRatio
    },
    closureOutputs: {
      temperatureK: finiteNumber(statisticalEnsemble.temperatureK, conditions.temperatureK ?? 293.15),
      pressurePa: ensemblePressurePa,
      opacityProxy,
      ionizationFraction,
      degeneracyParameter,
      degeneracyRegime: statisticalEnsemble.degeneracyRegime || 'classical',
      heatCapacityProxy
    },
    validity: {
      status: 'interactive-source-equation-proxy',
      warnings: [
        'Source channels are reduced ensemble closure terms, not a calibrated EOS or statistical mechanics solve.',
        'Scientific mode must replace these channels with validated EOS/partition-function/opacity/ionization closures before authoritative mutation.'
      ]
    }
  };
}

export function createQuantumStatisticalClosureSection({
  statisticalEnsemble = {},
  conditions = {}
} = {}) {
  if (!statisticalEnsemble || typeof statisticalEnsemble !== 'object') return null;
  const sourceEquation = statisticalEnsemble.sourceEquation?.schema === QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA
    ? statisticalEnsemble.sourceEquation
    : createQuantumStatisticalSourceEquation({ statisticalEnsemble, conditions });
  const pressurePa = Math.max(1, finiteNumber(
    statisticalEnsemble.pressurePa,
    conditions.pressurePa ?? ATM_PA
  ));
  const ensemblePressurePa = Math.max(1, finiteNumber(
    statisticalEnsemble.ensemblePressurePa ?? statisticalEnsemble.closureOutputs?.pressurePa,
    pressurePa
  ));
  return {
    schema: QUANTUM_STATISTICAL_CLOSURE_SCHEMA,
    ensembleSchema: statisticalEnsemble.schema || QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA,
    modelId: statisticalEnsemble.modelId || 'unknown-statistical-ensemble',
    status: statisticalEnsemble.status || 'unknown',
    backend: statisticalEnsemble.backend || null,
    calibrated: statisticalEnsemble.calibrated === true,
    firstPrinciplesUniversal: statisticalEnsemble.firstPrinciplesUniversal === true,
    acceptableClosureIfLabeled: statisticalEnsemble.acceptableClosureIfLabeled === true,
    recordCount: finiteNumber(statisticalEnsemble.recordCount, 0),
    temperatureK: finiteNumber(statisticalEnsemble.temperatureK, conditions.temperatureK ?? 293.15),
    pressurePa,
    ensemblePressurePa,
    pressureRatio: ensemblePressurePa / pressurePa,
    betaEv: finiteNumber(statisticalEnsemble.betaEv, null),
    partitionFunction: finiteNumber(statisticalEnsemble.partitionFunction, null),
    partitionFunctionLog: finiteNumber(statisticalEnsemble.partitionFunctionLog, 0),
    groundStatePopulation: finiteNumber(statisticalEnsemble.groundStatePopulation, null),
    excitedStatePopulation: finiteNumber(statisticalEnsemble.excitedStatePopulation, 0),
    continuumPopulation: finiteNumber(statisticalEnsemble.continuumPopulation, null),
    ionizationFraction: finiteNumber(statisticalEnsemble.ionizationFraction, 0),
    meanExcitationEnergyEv: finiteNumber(statisticalEnsemble.meanExcitationEnergyEv, 0),
    heatCapacityProxy: finiteNumber(statisticalEnsemble.heatCapacityProxy, 0),
    opacityProxy: finiteNumber(statisticalEnsemble.opacityProxy, 0),
    degeneracyParameter: finiteNumber(statisticalEnsemble.degeneracyParameter, 0),
    degeneracyRegime: statisticalEnsemble.degeneracyRegime || 'classical',
    distribution: statisticalEnsemble.source?.distribution || sourceEquation.source?.distribution || 'reduced-boltzmann-saha-degeneracy',
    hamiltonian: statisticalEnsemble.source?.hamiltonian || sourceEquation.source?.hamiltonian || null,
    sourceEquation,
    sourceTerms: sourceEquation.sourceTerms || {},
    closureOutputs: sourceEquation.closureOutputs || statisticalEnsemble.closureOutputs || {},
    populations: Array.isArray(statisticalEnsemble.populations)
      ? statisticalEnsemble.populations.map((population) => ({ ...population }))
      : [],
    validity: statisticalEnsemble.validity || sourceEquation.validity || {
      status: 'interactive-statistical-closure-proxy',
      warnings: []
    }
  };
}

function createQuantumStatisticalEnsemble({
  element,
  orbitalEnvelope,
  propertyPacket,
  molecularDynamics = {},
  conditions = {},
  forceSurfacePreview = null
}) {
  const temperatureK = Math.max(1, finiteNumber(conditions.temperatureK, 293.15));
  const pressurePa = Math.max(1, finiteNumber(conditions.pressurePa, ATM_PA));
  const densityKgM3 = Math.max(1e-12, finiteNumber(propertyPacket.state?.densityKgM3, finiteNumber(element?.densityKgM3, 1)));
  const kBT = Math.max(1e-9, temperatureK * BOLTZMANN_EV_PER_K);
  const activeOrbital = orbitalEnvelope.activeOrbital || {};
  const finiteGrid = orbitalEnvelope.finiteGrid || {};
  const chemistry = orbitalEnvelope.chemistry || {};
  const diagnostics = orbitalEnvelope.diagnostics || {};
  const groundEnergyEv = finiteNumber(
    finiteGrid.energyEv
      ?? activeOrbital.energyEv
      ?? chemistry.energyEv
      ?? diagnostics.energyEv,
    -13.605693 * Math.max(1, finiteNumber(element?.Z, 1)) / Math.max(1, finiteNumber(activeOrbital.n, 1) ** 2)
  );
  const ionizationEnergyEv = Math.max(
    0.1,
    finiteNumber(
      chemistry.ionizationEnergyProxyEv
        ?? orbitalEnvelope.closure?.chemistry?.ionizationEnergyProxyEv
        ?? diagnostics.ionizationEnergyProxyEv,
      Math.abs(groundEnergyEv) * 0.75 + 1.5
    )
  );
  const forceGapEv = Math.abs(finiteNumber(forceSurfacePreview?.meanPotentialEnergyEv, 0));
  const activeN = Math.max(1, finiteNumber(activeOrbital.n, 1));
  const activeL = Math.max(0, finiteNumber(activeOrbital.l ?? activeOrbital.angularL, 0));
  const spectralGapEv = clamp(
    Math.max(0.025, ionizationEnergyEv / Math.max(2, activeN + 1) + forceGapEv * 0.08),
    0.025,
    Math.max(0.05, ionizationEnergyEv * 0.95)
  );
  const levels = [
    { label: activeOrbital.label || 'ground', energyEv: groundEnergyEv, relativeEnergyEv: 0, degeneracy: Math.max(1, 2 * (2 * activeL + 1)), source: 'active-orbital' },
    { label: `${activeOrbital.label || 'orbital'}+thermal-1`, energyEv: groundEnergyEv + spectralGapEv, relativeEnergyEv: spectralGapEv, degeneracy: 3, source: 'reduced-excitation-gap' },
    { label: `${activeOrbital.label || 'orbital'}+thermal-2`, energyEv: groundEnergyEv + spectralGapEv * 2.1, relativeEnergyEv: spectralGapEv * 2.1, degeneracy: 5, source: 'reduced-excitation-gap' },
    { label: 'continuum-ionized', energyEv: groundEnergyEv + ionizationEnergyEv, relativeEnergyEv: ionizationEnergyEv, degeneracy: Math.max(1, finiteNumber(element?.Z, 1)), source: 'ionization-continuum-proxy' }
  ];
  const pressureIonizationFactor = clamp(Math.log10(Math.max(1, pressurePa / ATM_PA)) * 0.08, -0.08, 0.32);
  const fieldIonizationFactor = clamp(
    Math.abs(finiteNumber(conditions.electricFieldVm, 0)) / 1e9
      + Math.abs(finiteNumber(conditions.radiativeHeatFlux, 0)) / 8000,
    0,
    0.5
  );
  const rawWeights = levels.map((level, index) => {
    const thermalWeight = level.degeneracy * Math.exp(-level.relativeEnergyEv / kBT);
    if (index === levels.length - 1) {
      return thermalWeight * (1 + pressureIonizationFactor + fieldIonizationFactor);
    }
    return thermalWeight;
  });
  const partitionFunction = Math.max(1e-30, rawWeights.reduce((sum, weight) => sum + weight, 0));
  const populations = rawWeights.map((weight, index) => ({
    label: levels[index].label,
    population: clamp(weight / partitionFunction, 0, 1)
  }));
  const groundStatePopulation = populations[0]?.population || 0;
  const excitedStatePopulation = clamp((populations[1]?.population || 0) + (populations[2]?.population || 0), 0, 1);
  const continuumPopulation = clamp(populations[3]?.population || 0, 0, 1);
  const molecularIonization = clamp(finiteNumber(molecularDynamics.ionizationFraction, 0), 0, 1);
  const ionizationFraction = clamp(continuumPopulation * 0.7 + molecularIonization * 0.3, 0, 1);
  const meanExcitationEnergyEv = levels.reduce((sum, level, index) => (
    sum + level.relativeEnergyEv * (populations[index]?.population || 0)
  ), 0);
  const heatCapacityProxy = clamp((meanExcitationEnergyEv / Math.max(kBT, 1e-9)) * (excitedStatePopulation + ionizationFraction), 0, 64);
  const molarMassKgMol = Math.max(1e-6, finiteNumber(propertyPacket.state?.molarMassKgMol, 0.018));
  const electronDensityM3 = (densityKgM3 / molarMassKgMol) * 6.02214076e23 * Math.max(1, finiteNumber(element?.Z, 1));
  const degeneracyParameter = clamp(
    (electronDensityM3 / 1e30) * (300 / temperatureK) ** 1.5,
    0,
    64
  );
  const degeneracyRegime = degeneracyParameter > 1
    ? 'degenerate'
    : degeneracyParameter > 0.1
      ? 'partially-degenerate'
      : 'classical';
  const opacityProxy = clamp(
    0.015 * densityKgM3 / 1000
      + 0.55 * ionizationFraction
      + 0.16 * excitedStatePopulation
      + 0.04 * Math.abs(finiteNumber(conditions.radiativeHeatFlux, 0)) / 5000,
    0,
    64
  );
  const ensemblePressurePa = pressurePa * (
    1
      + 0.22 * ionizationFraction
      + 0.04 * Math.min(10, degeneracyParameter)
      + 0.03 * excitedStatePopulation
  );
  const ensemble = {
    schema: QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA,
    modelId: 'reduced-boltzmann-saha-degeneracy-bridge-v0',
    status: 'ensemble-bridge-proxy-ready',
    source: {
      hamiltonian: 'screened-hydrogenic-orbital-plus-reference-material-packet',
      distribution: 'reduced-boltzmann-saha-degeneracy',
      orbitalLabel: activeOrbital.label || 'unknown',
      elementSymbol: element?.symbol || 'unknown'
    },
    calibrated: false,
    firstPrinciplesUniversal: false,
    acceptableClosureIfLabeled: true,
    temperatureK,
    pressurePa,
    betaEv: 1 / kBT,
    partitionFunction,
    partitionFunctionLog: Math.log(partitionFunction),
    levels,
    populations,
    groundStatePopulation,
    excitedStatePopulation,
    continuumPopulation,
    ionizationFraction,
    meanExcitationEnergyEv,
    heatCapacityProxy,
    opacityProxy,
    degeneracyParameter,
    degeneracyRegime,
    ensemblePressurePa,
    closureOutputs: {
      temperatureK,
      pressurePa: ensemblePressurePa,
      opacityProxy,
      ionizationFraction,
      degeneracyParameter,
      degeneracyRegime
    },
    validity: {
      status: 'interactive-statistical-closure-proxy',
      warnings: [
        'Hamiltonian spectra/states are reduced to a small level set; ensemble outputs are proxy closures, not a calibrated partition-function solve.',
        'Temperature, pressure, opacity, ionization, and degeneracy are labeled bridge outputs and must be replaced by calibrated EOS/statistical physics for scientific mode.'
      ]
    }
  };
  ensemble.sourceEquation = createQuantumStatisticalSourceEquation({
    statisticalEnsemble: ensemble,
    conditions
  });
  return ensemble;
}

function createLawGraphFragment({
  element,
  selected,
  propertyPacket,
  orbitalEnvelope,
  conditions,
  bondStrengthTerms,
  forceSurfacePreview,
  statisticalEnsemble,
  unsupportedChemistry,
  reactionBarrierSurface = null,
  molecularDynamics = {}
}) {
  const stateNodes = [
    { id: 'state:ambient-temperature', kind: 'state-variable', quantity: 'temperature', unit: 'K', value: conditions.temperatureK },
    { id: 'state:ambient-pressure', kind: 'state-variable', quantity: 'pressure', unit: 'Pa', value: conditions.pressurePa },
    { id: 'state:gravity', kind: 'state-variable', quantity: 'gravity', unit: 'm/s^2', value: conditions.gravityMps2 },
    { id: 'state:electromagnetic-fields', kind: 'state-variable', quantity: 'field-boundary', unit: 'mixed', electricFieldVm: conditions.electricFieldVm, magneticFieldT: conditions.magneticFieldT },
    { id: 'state:active-orbital-density', kind: 'state-variable', schema: orbitalEnvelope.finiteGrid?.schema || null, elementSymbol: element.symbol, activeOrbital: orbitalEnvelope.activeOrbital?.label || null },
    { id: 'state:molecular-composition', kind: 'state-variable', quantity: 'composition', species: molecularDynamics.species || {}, molecularSpecies: molecularDynamics.molecularSpecies || {} },
    { id: 'state:reference-material-packet', kind: 'state-variable', schema: propertyPacket.schema, materialId: propertyPacket.materialId, basis: selected.basis },
    { id: 'state:reference-bond-catalog', kind: 'state-variable', quantity: 'bond-terms', count: bondStrengthTerms.length },
    {
      id: 'state:statistical-ensemble-distribution',
      kind: 'state-variable',
      schema: statisticalEnsemble?.schema || QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA,
      quantity: 'ensemble-distribution',
      partitionFunctionLog: statisticalEnsemble?.partitionFunctionLog ?? null,
      ionizationFraction: statisticalEnsemble?.ionizationFraction ?? null,
      degeneracyParameter: statisticalEnsemble?.degeneracyParameter ?? null
    },
    {
      id: 'state:reaction-product-stoichiometry',
      kind: 'state-variable',
      quantity: 'reaction-products',
      schema: reactionBarrierSurface?.productStoichiometry?.schema || null,
      targetReactionId: reactionBarrierSurface?.targetReactionId || null,
      available: reactionBarrierSurface?.productStoichiometryAvailable === true,
      productTopologyAvailable: reactionBarrierSurface?.productTopologyAvailable === true
    }
  ];
  const lawNodes = [
    {
      id: 'law:schrodinger-reference-material-properties',
      kind: 'law-constraint',
      outputSchema: QUANTUM_MATERIAL_POTENTIAL_SCHEMA,
      status: 'active-reference-evaluation',
      calibrated: false
    },
    {
      id: 'law:reduced-morse-force-surface-preview',
      kind: 'law-constraint',
      outputSchema: QUANTUM_MATERIAL_FORCE_SURFACE_SCHEMA,
      status: forceSurfacePreview.status,
      calibrated: false
    },
    {
      id: 'law:quantum-statistical-ensemble-bridge',
      kind: 'law-constraint',
      outputSchema: QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA,
      status: statisticalEnsemble?.status || 'ensemble-bridge-proxy-ready',
      calibrated: false,
      firstPrinciplesUniversal: false,
      acceptableClosureIfLabeled: true
    },
    {
      id: 'constraint:unsupported-reactive-chemistry-gate',
      kind: 'law-constraint',
      outputSchema: 'peercompute.multiscale.quantum-material-unsupported-chemistry.v0',
      status: unsupportedChemistry.unsupportedReactiveChemistry ? 'blocking' : 'satisfied'
    },
    {
      id: 'law:reduced-reaction-product-stoichiometry',
      kind: 'law-constraint',
      outputSchema: QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA,
      status: reactionBarrierSurface?.productStoichiometryAvailable === true ? 'reduced-product-source-ready' : 'unavailable',
      calibrated: false,
      conservativeTopologyMutation: reactionBarrierSurface?.productTopologyAvailable === true
    }
  ];
  const edges = [
    { from: 'state:ambient-temperature', to: 'law:schrodinger-reference-material-properties', role: 'condition' },
    { from: 'state:ambient-pressure', to: 'law:schrodinger-reference-material-properties', role: 'condition' },
    { from: 'state:active-orbital-density', to: 'law:schrodinger-reference-material-properties', role: 'descriptor' },
    { from: 'state:molecular-composition', to: 'law:schrodinger-reference-material-properties', role: 'material-selection' },
    { from: 'law:schrodinger-reference-material-properties', to: 'state:reference-material-packet', role: 'updates' },
    { from: 'state:reference-bond-catalog', to: 'law:reduced-morse-force-surface-preview', role: 'bond-parameters' },
    { from: 'state:ambient-temperature', to: 'law:reduced-morse-force-surface-preview', role: 'thermal-probe' },
    { from: 'state:ambient-pressure', to: 'law:reduced-morse-force-surface-preview', role: 'compression-probe' },
    { from: 'state:electromagnetic-fields', to: 'law:reduced-morse-force-surface-preview', role: 'field-probe' },
    { from: 'state:active-orbital-density', to: 'law:quantum-statistical-ensemble-bridge', role: 'spectrum-state-input' },
    { from: 'state:ambient-temperature', to: 'law:quantum-statistical-ensemble-bridge', role: 'distribution-temperature' },
    { from: 'state:ambient-pressure', to: 'law:quantum-statistical-ensemble-bridge', role: 'distribution-pressure' },
    { from: 'state:reference-material-packet', to: 'law:quantum-statistical-ensemble-bridge', role: 'density-material-input' },
    { from: 'law:quantum-statistical-ensemble-bridge', to: 'state:statistical-ensemble-distribution', role: 'updates' },
    { from: 'state:statistical-ensemble-distribution', to: 'law:schrodinger-reference-material-properties', role: 'macro-closure-bridge' },
    { from: 'state:molecular-composition', to: 'constraint:unsupported-reactive-chemistry-gate', role: 'reactive-check' },
    { from: 'constraint:unsupported-reactive-chemistry-gate', to: 'law:reduced-morse-force-surface-preview', role: 'blocks-reaction-barriers' },
    { from: 'constraint:unsupported-reactive-chemistry-gate', to: 'law:schrodinger-reference-material-properties', role: 'validity-warning' },
    { from: 'state:molecular-composition', to: 'law:reduced-reaction-product-stoichiometry', role: 'reactant-basis' },
    { from: 'law:reduced-reaction-product-stoichiometry', to: 'state:reaction-product-stoichiometry', role: 'updates' },
    { from: 'state:reaction-product-stoichiometry', to: 'law:reduced-morse-force-surface-preview', role: 'reaction-source-guard' }
  ];
  return {
    schema: QUANTUM_MATERIAL_LAW_GRAPH_FRAGMENT_SCHEMA,
    modelId: 'bipartite-state-law-fragment-v0',
    scope: 'schrodinger-material-potential',
    stateNodeCount: stateNodes.length,
    lawNodeCount: lawNodes.length,
    edgeCount: edges.length,
    stateNodes,
    lawNodes,
    edges,
    consistency: {
      status: unsupportedChemistry.unsupportedReactiveChemistry ? 'blocked-reactive-constraint' : 'consistent-reduced-preview',
      solvedBy: 'direct-evaluation-no-global-iteration',
      blockedConstraintCount: unsupportedChemistry.blockedInteractionCount,
      requiresGlobalSolve: false
    }
  };
}

function createAtomProperties({ element, orbitalEnvelope, elementPacket }) {
  const finiteGrid = orbitalEnvelope.finiteGrid || {};
  return {
    schema: 'peercompute.multiscale.quantum-atom-material-properties.v0',
    symbol: element.symbol,
    name: element.name,
    atomicNumber: element.Z,
    category: element.category,
    colorHex: element.color,
    covalentRadiusAngstrom: COVALENT_RADIUS_ANGSTROM[element.symbol] || null,
    vanDerWaalsRadiusAngstrom: VDW_RADIUS_ANGSTROM[element.symbol] || null,
    orbitalShape: orbitalShapeDescriptor(orbitalEnvelope.activeOrbital, finiteGrid),
    densityKgM3: elementPacket.state.densityKgM3,
    phase: elementPacket.state.phase,
    meltingK: element.meltingK,
    boilingK: element.boilingK,
    bulkModulusPa: elementPacket.mechanics.bulkModulusPa,
    youngsModulusPa: elementPacket.mechanics.youngsModulusPa,
    shearModulusPa: elementPacket.mechanics.shearModulusPa,
    electricalConductivitySpm: elementPacket.electromagnetic.electricalConductivitySpm,
    dielectricConstant: elementPacket.electromagnetic.dielectricConstant,
    refractiveIndex: elementPacket.optical.refractiveIndex,
    magneticSusceptibility: elementPacket.electromagnetic.magneticSusceptibility,
    radioactive: element.radioactive === true,
    halfLifeYears: element.halfLifeYears || null,
    activityBqKg: elementPacket.nuclear?.activityBqKg || 0,
    sourcePacketMaterialId: elementPacket.materialId
  };
}

function createPropertyPacket({ elementSymbol, molecularDynamics, temperatureK, pressurePa }) {
  const dominant = dominantMolecule(molecularDynamics);
  const materialId = FORMULA_MATERIAL_ID[dominant?.formula];
  if (materialId) {
    return {
      packet: estimateMoleculeProperties({
        materialId,
        temperatureK,
        pressurePa,
        sampleId: `quantum-material:${dominant.formula}`
      }),
      basis: 'dominant-molecular-material',
      dominantFormula: dominant.formula,
      dominantCount: dominant.count
    };
  }
  return {
    packet: estimateElementProperties({
      symbol: elementSymbol,
      temperatureK,
      pressurePa,
      sampleId: `quantum-material:element:${elementSymbol}`
    }),
    basis: 'active-orbital-element',
    dominantFormula: null,
    dominantCount: 0
  };
}

export function createQuantumMaterialPotential({
  quantumOrbital = {},
  environment = {},
  molecularDynamics = {},
  timeSeconds = 0
} = {}) {
  const orbitalEnvelope = getOrbitalEnvelope(quantumOrbital);
  const element = getElementBySymbol(orbitalEnvelope.elementSymbol);
  const temperatureK = getTemperatureK(environment, molecularDynamics);
  const pressurePa = getPressurePa(environment);
  const conditions = createConditionSummary(environment, molecularDynamics);
  const elementPacket = estimateElementProperties({
    symbol: element.symbol,
    temperatureK,
    pressurePa,
    sampleId: `quantum-material:atom:${element.symbol}`
  });
  const selected = createPropertyPacket({
    elementSymbol: element.symbol,
    molecularDynamics,
    temperatureK,
    pressurePa
  });
  const propertyPacket = selected.packet;
  const dominantFormula = selected.dominantFormula;
  const bondStrengthTerms = createBondStrengthTerms(dominantFormula);
  const reactionBarrierSurface = createNaWaterReactionBarrierSurface({ molecularDynamics, conditions });
  const unsupportedChemistry = createUnsupportedChemistryReport(molecularDynamics, { reactionBarrierSurface });
  const completeness = materialCompleteness(propertyPacket);
  const atomProperties = createAtomProperties({ element, orbitalEnvelope, elementPacket });
  const forceSurfacePreview = createForceSurfacePreview({
    bondStrengthTerms,
    conditions,
    unsupportedChemistry,
    reactionBarrierSurface
  });
  const statisticalEnsemble = createQuantumStatisticalEnsemble({
    element,
    orbitalEnvelope,
    propertyPacket,
    molecularDynamics,
    conditions,
    forceSurfacePreview
  });
  const lawGraphFragment = createLawGraphFragment({
    element,
    selected,
    propertyPacket,
    orbitalEnvelope,
    conditions,
    bondStrengthTerms,
    forceSurfacePreview,
    statisticalEnsemble,
    unsupportedChemistry,
    reactionBarrierSurface,
    molecularDynamics
  });
  const behaviorSurface = createBehaviorSurface({
    propertyPacket,
    unsupportedChemistry,
    molecularDynamics,
    conditions,
    reactionBarrierSurface
  });
  const sequence = Math.round(Math.max(0, finiteNumber(timeSeconds, 0)) * 1000);
  const stateKey = `quantum-material:${selected.basis}:${dominantFormula || element.symbol}`;
  const warnings = [
    ...(propertyPacket.validation?.warnings || []),
    'Material properties are provided as reference packets plus Schrodinger/orbital-derived descriptors; this is not yet a calibrated ab initio molecular force surface.',
    reactionBarrierSurface?.productStoichiometryAvailable === true
      ? 'Reduced Na-water product stoichiometry is available as source metadata, but product topology mutation remains unavailable.'
      : 'Born-Oppenheimer force gradients, charge-transfer dynamics, and reaction barrier surfaces are declared unavailable until the lower layer implements them.'
  ];
  for (const blocked of unsupportedChemistry.blockedInteractions) {
    warnings.push(blocked.reason);
  }

  const potentialTerms = {
    materialPropertiesAvailable: true,
    atomicElectronDensityAvailable: Boolean(orbitalEnvelope.finiteGrid?.schema),
    bondStrengthCatalogAvailable: bondStrengthTerms.length > 0,
    forceSurfacePreviewAvailable: forceSurfacePreview.termCount > 0,
    reducedEnergyGradientAvailable: forceSurfacePreview.reducedEnergyGradientAvailable,
    statisticalEnsembleAvailable: true,
    statisticalEnsembleSchema: statisticalEnsemble.schema,
    bornOppenheimerForcesAvailable: false,
    reactiveChargeTransferAvailable: reactionBarrierSurface?.chargeTransferRequired === true,
    reactionBarrierSurfaceAvailable: reactionBarrierSurface?.barrierAvailable === true,
    productStoichiometryAvailable: reactionBarrierSurface?.productStoichiometryAvailable === true,
    productTopologyAvailable: reactionBarrierSurface?.productTopologyAvailable === true,
    calibratedPotentialEnergySurfaceAvailable: false,
    forceSurfacePreviewSchema: forceSurfacePreview.schema,
    reactionBarrierSurfaceSchema: reactionBarrierSurface?.schema || null,
    lawGraphFragmentSchema: lawGraphFragment.schema,
    unsupportedReactiveChemistry: unsupportedChemistry.unsupportedReactiveChemistry
  };
  const validityStatus = unsupportedChemistry.unsupportedReactiveChemistry
    ? 'property-ready-reaction-blocked'
    : forceSurfacePreview.termCount > 0
      ? 'property-ready-reduced-force-preview'
      : 'property-ready-proxy-force-missing';

  const closureState = makeClosureState({
    layerId: 'orbital',
    materialId: propertyPacket.materialId,
    solverId: 'quantum-material-potential',
    stateKey,
    sequence,
    environment,
    primitive: {
      temperatureK,
      pressurePa,
      densityKgM3: propertyPacket.state.densityKgM3,
      phase: propertyPacket.state.phase,
      activeElementAtomicNumber: element.Z
    },
    conserved: {
      atomCount: finiteNumber(molecularDynamics.atomCount, dominantFormula ? selected.dominantCount : 1),
      electronCount: element.Z,
      totalChargeProxy: finiteNumber(molecularDynamics.totalCharge, 0)
    },
    species: molecularDynamics.species || propertyPacket.state.composition || { [element.symbol]: 1 },
    phaseFractions: molecularDynamics.phaseFractions || { [propertyPacket.state.phase || 'unknown']: 1 },
    fields: {
      atomProperties,
      propertyPacket,
      bondStrengthTerms,
      potentialTerms,
      forceSurfacePreview,
      reactionBarrierSurface,
      statisticalEnsemble,
      unsupportedChemistry,
      behaviorSurface,
      conditions,
      lawGraphFragment,
      materialCompleteness: completeness
    },
    validity: {
      status: validityStatus,
      approximation: 'reference-material-packet-plus-screened-hydrogenic-orbital-descriptors'
    }
  });

  const closureResult = makeClosureResult({
    modelId: QUANTUM_MATERIAL_POTENTIAL_MODEL_ID,
    source: {
      solverId: 'quantum-material-potential',
      stateKey,
      backend: orbitalEnvelope.finiteGrid?.backend?.startsWith?.('webgpu')
        ? 'webgpu-orbital-density-plus-reference-material-packets'
        : 'cpu-orbital-density-plus-reference-material-packets',
      sequence
    },
    state: closureState,
    thermodynamics: {
      temperatureK,
      pressurePa,
      ensembleTemperatureK: statisticalEnsemble.temperatureK,
      ensemblePressurePa: statisticalEnsemble.ensemblePressurePa,
      meanExcitationEnergyEv: statisticalEnsemble.meanExcitationEnergyEv,
      heatCapacityProxy: statisticalEnsemble.heatCapacityProxy,
      densityKgM3: propertyPacket.state.densityKgM3,
      heatCapacityJkgK: propertyPacket.thermal?.heatCapacityJkgK,
      latentHeatJkg: propertyPacket.thermal?.latentHeatJkg
    },
    transport: {
      thermalConductivityWmK: propertyPacket.thermal?.thermalConductivityWmK,
      electricalConductivitySm: propertyPacket.electromagnetic?.electricalConductivitySpm,
      viscosityPaS: propertyPacket.mechanics?.viscosityPaS,
      opacityProxy: statisticalEnsemble.opacityProxy
    },
    mechanics: {
      bulkModulusPa: propertyPacket.mechanics?.bulkModulusPa,
      youngsModulusPa: propertyPacket.mechanics?.youngsModulusPa,
      shearModulusPa: propertyPacket.mechanics?.shearModulusPa,
      surfaceTensionNpm: propertyPacket.mechanics?.surfaceTensionNpm
    },
    electromagnetics: {
      conductivitySm: propertyPacket.electromagnetic?.electricalConductivitySpm,
      dielectricConstant: propertyPacket.electromagnetic?.dielectricConstant,
      magneticSusceptibility: propertyPacket.electromagnetic?.magneticSusceptibility,
      ionizationFraction: statisticalEnsemble.ionizationFraction,
      degeneracyParameter: statisticalEnsemble.degeneracyParameter,
      degeneracyRegime: statisticalEnsemble.degeneracyRegime
    },
    statistical: createQuantumStatisticalClosureSection({
      statisticalEnsemble,
      conditions
    }),
    chemistry: {
      elementSymbol: element.symbol,
      dominantFormula,
      dominantCount: selected.dominantCount,
      bondStrengthTerms,
      unsupportedChemistry,
      behaviorSurface,
      conditions,
      forceSurfacePreview,
      reactionBarrierSurface,
      statisticalEnsemble,
      lawGraphFragment,
      potentialTerms
    },
    phase: {
      regime: propertyPacket.state.phase,
      phaseFractions: molecularDynamics.phaseFractions || { [propertyPacket.state.phase || 'unknown']: 1 }
    },
    diagnostics: {
      schema: QUANTUM_MATERIAL_POTENTIAL_SCHEMA,
      atomProperties,
      propertyPacket,
      selectedMaterialBasis: selected.basis,
      materialCompleteness: completeness,
      behaviorSurface,
      conditions,
      forceSurfacePreview,
      reactionBarrierSurface,
      statisticalEnsemble,
      lawGraphFragment,
      potentialTerms
    },
    validity: {
      status: validityStatus,
      regimes: ['orbital', 'molecular', 'material-closure'],
      warnings
    },
    uncertainty: {
      mode: 'reference-table-plus-orbital-proxy',
      confidence: clamp(0.25 + completeness.score * 0.45 - unsupportedChemistry.blockedInteractionCount * 0.08, 0.08, 0.72)
    },
    conservation: {
      materialPropertyPacket: propertyPacket.materialId,
      forceSurfaceConservative: false,
      energyGradientAvailable: false,
      reducedEnergyGradientAvailable: forceSurfacePreview.reducedEnergyGradientAvailable,
      reactionProductStoichiometryAvailable: reactionBarrierSurface?.productStoichiometryAvailable === true,
      reactionProductTopologyAvailable: reactionBarrierSurface?.productTopologyAvailable === true,
      lawGraphConsistency: lawGraphFragment.consistency.status
    },
    provenance: {
      source: 'demos/multiscale/src/simulation/quantumMaterialPotential.js',
      references: [
        'demos/schrodinger/src/materials/materialProperties.js',
        'demos/schrodinger/src/materials/waterProperties.js',
        'demos/schrodinger/src/data/elements.js',
        'demos/schrodinger/src/data/molecularStructures.js',
        'demos/multiscale/src/simulation/quantumOrbitalClosure.js'
      ]
    }
  });

  return {
    schema: QUANTUM_MATERIAL_POTENTIAL_SCHEMA,
    modelId: QUANTUM_MATERIAL_POTENTIAL_MODEL_ID,
    materialId: propertyPacket.materialId,
    selectedMaterialBasis: selected.basis,
    elementSymbol: element.symbol,
    dominantFormula,
    dominantCount: selected.dominantCount,
    colorHex: atomProperties.colorHex,
    phase: propertyPacket.state.phase,
    densityKgM3: propertyPacket.state.densityKgM3,
    bulkModulusPa: propertyPacket.mechanics?.bulkModulusPa ?? null,
    youngsModulusPa: propertyPacket.mechanics?.youngsModulusPa ?? null,
    shearModulusPa: propertyPacket.mechanics?.shearModulusPa ?? null,
    refractiveIndex: propertyPacket.optical?.refractiveIndex ?? null,
    dielectricConstant: propertyPacket.electromagnetic?.dielectricConstant ?? null,
    electricalConductivitySpm: propertyPacket.electromagnetic?.electricalConductivitySpm ?? null,
    magneticSusceptibility: propertyPacket.electromagnetic?.magneticSusceptibility ?? null,
    atomProperties,
    propertyPacket,
    bondStrengthTerms,
    forceSurfacePreview,
    reactionBarrierSurface,
    statisticalEnsemble,
    potentialTerms,
    unsupportedChemistry,
    behaviorSurface,
    conditions,
    lawGraphFragment,
    materialCompleteness: completeness,
    closureResult
  };
}
