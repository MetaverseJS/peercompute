import { clamp } from '../core/random.js';
import { getBondEventsForFormula } from '../data/molecularStructures.js';
import { createMaterialPropertyPacket } from './propertyPacket.js';

const ATM_PA = 101325;
const WATER_R_SPECIFIC = 461.5;

const pressureAdjustedBounds = (pressurePa) => {
  const atm = clamp(pressurePa / ATM_PA, 0.01, 200);
  const freezeK = 273.15 - 1.8 * Math.log10(atm);
  const boilK = 373.15 + 22 * Math.log(atm);
  return {
    freezeK: clamp(freezeK, 250, 280),
    boilK: clamp(boilK, 275, 650)
  };
};

export const estimateWaterPhase = ({ temperatureK, pressurePa = ATM_PA }) => {
  const { freezeK, boilK } = pressureAdjustedBounds(pressurePa);
  const transitionWidth = 2.5;
  if (temperatureK < freezeK - transitionWidth) return 'solid';
  if (Math.abs(temperatureK - freezeK) <= transitionWidth) return 'mixed';
  if (temperatureK < boilK - transitionWidth) return 'liquid';
  if (Math.abs(temperatureK - boilK) <= transitionWidth) return 'mixed';
  return 'gas';
};

const liquidDensity = (temperatureK) => {
  const tc = temperatureK - 273.15;
  return clamp(999.84 - 0.0679 * (tc - 4) ** 2, 930, 1000);
};

const waterDensity = (phase, temperatureK, pressurePa) => {
  if (phase === 'solid') return 916.7 - 0.08 * (temperatureK - 273.15);
  if (phase === 'gas') return pressurePa / (WATER_R_SPECIFIC * temperatureK);
  if (phase === 'mixed') {
    const vapor = pressurePa / (WATER_R_SPECIFIC * Math.max(temperatureK, 1));
    return (liquidDensity(temperatureK) + vapor) * 0.5;
  }
  return liquidDensity(temperatureK);
};

export const estimateWaterProperties = ({
  temperatureK = 293.15,
  pressurePa = ATM_PA,
  sampleId = 'water-cell'
} = {}) => {
  const phase = estimateWaterPhase({ temperatureK, pressurePa });
  const densityKgM3 = waterDensity(phase, temperatureK, pressurePa);
  const warnings = [];

  let mechanics;
  let thermal;
  let optical;
  let electromagnetic;

  if (phase === 'solid') {
    mechanics = {
      bulkModulusPa: 8.8e9,
      youngsModulusPa: 9.3e9,
      shearModulusPa: 3.5e9,
      viscosityPaS: null,
      surfaceTensionNpm: null
    };
    thermal = {
      heatCapacityJkgK: 2100,
      thermalConductivityWmK: 2.2,
      latentHeatJkg: 333500,
      eosParams: { freezeK: 273.15, model: 'ice-Ih-reference' }
    };
    optical = {
      refractiveIndex: 1.31,
      absorptionRgb: [0.02, 0.015, 0.01],
      scatteringRgb: [0.55, 0.65, 0.9],
      polarizability: 1.45
    };
    electromagnetic = {
      dielectricConstant: 3.2,
      electricalConductivitySpm: 1e-8,
      magneticSusceptibility: -9.0e-6
    };
  } else if (phase === 'gas') {
    mechanics = {
      bulkModulusPa: 1.33 * pressurePa,
      youngsModulusPa: null,
      shearModulusPa: null,
      viscosityPaS: 1.25e-5,
      surfaceTensionNpm: null
    };
    warnings.push('Young/shear modulus are not meaningful for water vapor in this model.');
    thermal = {
      heatCapacityJkgK: 1996,
      thermalConductivityWmK: 0.025,
      latentHeatJkg: 2257000,
      eosParams: { gasConstantJkgK: WATER_R_SPECIFIC, gamma: 1.33 }
    };
    optical = {
      refractiveIndex: 1.00026,
      absorptionRgb: [0.001, 0.001, 0.002],
      scatteringRgb: [0.04, 0.05, 0.07],
      polarizability: 1.45
    };
    electromagnetic = {
      dielectricConstant: 1.0006,
      electricalConductivitySpm: 1e-10,
      magneticSusceptibility: -9.0e-6
    };
  } else {
    mechanics = {
      bulkModulusPa: 2.2e9,
      youngsModulusPa: null,
      shearModulusPa: null,
      viscosityPaS: clamp(0.001 * Math.exp(-0.025 * (temperatureK - 293.15)), 0.00028, 0.01),
      surfaceTensionNpm: clamp(0.0756 - 0.00016 * (temperatureK - 273.15), 0.04, 0.076)
    };
    warnings.push('Liquid water does not expose a static Young modulus; packet leaves it null.');
    thermal = {
      heatCapacityJkgK: 4181,
      thermalConductivityWmK: clamp(0.606 - 0.0015 * Math.abs(temperatureK - 293.15), 0.45, 0.68),
      latentHeatJkg: phase === 'mixed' ? 2257000 : null,
      eosParams: { densityFit: 'fresh-water-near-ambient-v0' }
    };
    optical = {
      refractiveIndex: clamp(1.333 - 0.0001 * (temperatureK - 293.15), 1.29, 1.35),
      absorptionRgb: [0.012, 0.006, 0.002],
      scatteringRgb: [0.03, 0.04, 0.06],
      polarizability: 1.45
    };
    electromagnetic = {
      dielectricConstant: clamp(87.9 - 0.36 * (temperatureK - 273.15), 45, 95),
      electricalConductivitySpm: 5.5e-6,
      magneticSusceptibility: -9.0e-6
    };
  }

  if (phase === 'mixed') {
    warnings.push('Mixed phase uses averaged properties until full latent-heat MD validation lands.');
  }

  return createMaterialPropertyPacket({
    materialId: 'water.h2o.reference-eos-v0',
    sampleId,
    modelTier: 'reference-eos',
    state: {
      temperatureK,
      pressurePa,
      phase,
      composition: { H2O: 1 },
      densityKgM3
    },
    mechanics,
    thermal,
    optical,
    electromagnetic,
    chemical: {
      reactionRates: {},
      bondEvents: getBondEventsForFormula('H2O'),
      ph: phase === 'liquid' ? 7 : null,
      ionFractions: phase === 'liquid' ? { H3O: 1e-7, OH: 1e-7 } : {}
    },
    validation: {
      status: 'approximate',
      referenceSet: 'water-reference-eos-v0',
      tolerances: {
        phase: 'qualitative at this slice',
        densityKgM3: phase === 'liquid' ? '+/- 3%' : '+/- 15%',
        refractiveIndex: '+/- 0.02'
      },
      warnings
    }
  });
};
