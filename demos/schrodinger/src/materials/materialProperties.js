import { clamp } from '../core/random.js';
import { ELEMENTS, elementPhaseAt, getElementBySymbol } from '../data/elements.js';
import { getMaterialById } from '../data/materials.js';
import { getBondEventsForFormula } from '../data/molecularStructures.js';
import { createMaterialPropertyPacket } from './propertyPacket.js';
import { estimateWaterProperties } from './waterProperties.js';

const ATM_PA = 101325;
const GAS_R = 8.31446261815324;

const gasDensity = (molarMassKgMol, temperatureK, pressurePa) => (
  (pressurePa * molarMassKgMol) / (GAS_R * temperatureK)
);

const phaseForMaterial = (material, temperatureK, pressurePa) => {
  if (material.id === 'carbon-dioxide' && pressurePa <= 5.1 * ATM_PA && temperatureK > material.meltingK) {
    return 'gas';
  }
  const pressureShift = 18 * Math.log(clamp(pressurePa / ATM_PA, 0.05, 50));
  if (temperatureK < material.meltingK) return 'solid';
  if (temperatureK < material.boilingK + pressureShift) return 'liquid';
  return 'gas';
};

export const estimateMoleculeProperties = ({
  materialId = 'water',
  temperatureK = 293.15,
  pressurePa = ATM_PA,
  sampleId = 'material-cell'
} = {}) => {
  if (materialId === 'water') {
    return estimateWaterProperties({ temperatureK, pressurePa, sampleId });
  }

  const material = getMaterialById(materialId);
  const phase = phaseForMaterial(material, temperatureK, pressurePa);
  const isGas = phase === 'gas';
  const isSolid = phase === 'solid';
  const densityKgM3 = isGas
    ? gasDensity(material.molarMassKgMol || 0.03, temperatureK, pressurePa)
    : (material.densitySolidKgM3 || (phase === 'liquid' ? 850 : 1200));
  const warnings = [
    'Non-water molecule properties are coarse reference-table estimates in this slice.'
  ];
  if (!isSolid) warnings.push('Static Young/shear modulus omitted for fluid/gas phase.');

  return createMaterialPropertyPacket({
    materialId: `${material.id}.${material.model}`,
    sampleId,
    modelTier: 'reference-table',
    state: {
      temperatureK,
      pressurePa,
      phase,
      composition: { [material.formula]: 1 },
      densityKgM3
    },
    mechanics: {
      bulkModulusPa: isGas ? 1.4 * pressurePa : (material.bulkModulusPa || 1.5e9),
      youngsModulusPa: isSolid ? (material.youngsModulusPa || 1e9) : null,
      shearModulusPa: isSolid ? (material.youngsModulusPa || 1e9) / 2.6 : null,
      viscosityPaS: isGas ? 1.8e-5 : phase === 'liquid' ? 7e-4 : null,
      surfaceTensionNpm: phase === 'liquid' ? 0.03 : null
    },
    thermal: {
      heatCapacityJkgK: isGas ? 1000 : 1500,
      thermalConductivityWmK: isGas ? 0.025 : isSolid ? 4.0 : 0.18,
      latentHeatJkg: null,
      eosParams: { phaseFit: 'melting-boiling-reference-v0' }
    },
    optical: {
      refractiveIndex: isSolid
        ? (material.refractiveIndexSolid || 1.45)
        : (material.refractiveIndexGas || 1.0003),
      absorptionRgb: [0.004, 0.004, 0.004],
      scatteringRgb: isGas ? [0.03, 0.04, 0.06] : [0.12, 0.12, 0.12],
      polarizability: null
    },
    electromagnetic: {
      dielectricConstant: isGas ? (material.dielectricGas || 1.0005) : 2.5,
      electricalConductivitySpm: material.id === 'sodium-chloride' && phase === 'liquid' ? 3.0 : 1e-12,
      magneticSusceptibility: -1e-6
    },
    chemical: {
      reactionRates: {},
      bondEvents: getBondEventsForFormula(material.formula),
      ph: null,
      ionFractions: {}
    },
    validation: {
      status: 'approximate',
      referenceSet: material.model,
      tolerances: {
        phase: 'melting/boiling threshold estimate',
        densityKgM3: isGas ? '+/- 5% ideal gas' : '+/- 25%'
      },
      warnings
    }
  });
};

export const estimateElementProperties = ({
  symbol = 'H',
  temperatureK = 293.15,
  pressurePa = ATM_PA,
  sampleId = 'element-cell'
} = {}) => {
  const element = getElementBySymbol(symbol);
  const phase = elementPhaseAt(element, temperatureK);
  const gas = phase === 'gas';
  const warnings = [];
  if (gas) warnings.push('Gas-phase element mechanics are reduced to ideal-gas bulk modulus.');
  if (phase !== 'solid') warnings.push('Static Young/shear modulus omitted outside solid phase.');

  const activityBqKg = element.radioactive && element.halfLifeYears
    ? (Math.log(2) / (element.halfLifeYears * 365.25 * 24 * 3600)) *
      (6.02214076e23 / Math.max(1, element.Z * 2.2e-3))
    : 0;

  return createMaterialPropertyPacket({
    materialId: `element.${element.symbol.toLowerCase()}.reference-table-v0`,
    sampleId,
    modelTier: 'reference-table',
    state: {
      temperatureK,
      pressurePa,
      phase,
      composition: { [element.symbol]: 1 },
      densityKgM3: gas ? pressurePa / (287 * temperatureK) : element.densityKgM3
    },
    mechanics: {
      bulkModulusPa: gas ? 1.4 * pressurePa : element.bulkModulusPa,
      youngsModulusPa: phase === 'solid' ? element.youngsModulusPa : null,
      shearModulusPa: phase === 'solid' && element.youngsModulusPa ? element.youngsModulusPa / 2.6 : null,
      viscosityPaS: gas ? 1.8e-5 : null,
      surfaceTensionNpm: phase === 'liquid' ? 0.5 : null
    },
    thermal: {
      heatCapacityJkgK: phase === 'solid' ? 450 : gas ? 1000 : 700,
      thermalConductivityWmK: phase === 'solid' ? 50 : gas ? 0.03 : 30,
      latentHeatJkg: null,
      eosParams: { meltingK: element.meltingK, boilingK: element.boilingK }
    },
    optical: {
      refractiveIndex: gas ? 1.0003 : 1.4,
      absorptionRgb: [0.01, 0.01, 0.01],
      scatteringRgb: gas ? [0.03, 0.04, 0.06] : [0.1, 0.1, 0.1],
      polarizability: null
    },
    electromagnetic: {
      dielectricConstant: gas ? 1.0005 : 2.5,
      electricalConductivitySpm: element.conductivitySpm,
      magneticSusceptibility: element.symbol === 'Fe' ? 2e5 : -1e-5
    },
    nuclear: {
      isotopeFractions: element.radioactive ? { [`${element.symbol}-natural`]: 1 } : {},
      activityBqKg,
      decayHeatWKg: activityBqKg * 8e-14,
      radiationSourceTerms: activityBqKg > 0 ? [{ type: 'alpha-beta-gamma-natural', activityBqKg }] : []
    },
    validation: {
      status: 'approximate',
      referenceSet: 'element-reference-table-v0',
      tolerances: { properties: 'coarse engineering reference table' },
      warnings
    }
  });
};

export const listElementMaterials = () => ELEMENTS.map((element) => ({
  id: `element:${element.symbol}`,
  label: `${element.name} (${element.symbol})`
}));
