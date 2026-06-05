const REQUIRED_TOP_LEVEL = [
  'materialId',
  'sampleId',
  'modelTier',
  'timestamp',
  'validUntil',
  'state',
  'mechanics',
  'thermal',
  'optical',
  'electromagnetic',
  'chemical',
  'nuclear',
  'validation'
];

export const createMaterialPropertyPacket = ({
  materialId,
  sampleId = 'local-cell',
  modelTier = 'reference-fit',
  validMs = 2000,
  state,
  mechanics = {},
  thermal = {},
  optical = {},
  electromagnetic = {},
  chemical = {},
  nuclear = {},
  validation = {}
}) => {
  const timestamp = Date.now();
  return {
    materialId,
    sampleId,
    modelTier,
    timestamp,
    validUntil: timestamp + validMs,
    state: {
      temperatureK: null,
      pressurePa: null,
      phase: 'unknown',
      composition: {},
      densityKgM3: null,
      ...state
    },
    mechanics: {
      bulkModulusPa: null,
      youngsModulusPa: null,
      shearModulusPa: null,
      viscosityPaS: null,
      surfaceTensionNpm: null,
      ...mechanics
    },
    thermal: {
      heatCapacityJkgK: null,
      thermalConductivityWmK: null,
      latentHeatJkg: null,
      eosParams: {},
      ...thermal
    },
    optical: {
      refractiveIndex: null,
      absorptionRgb: [0, 0, 0],
      scatteringRgb: [0, 0, 0],
      polarizability: null,
      ...optical
    },
    electromagnetic: {
      dielectricConstant: null,
      electricalConductivitySpm: null,
      magneticSusceptibility: null,
      ...electromagnetic
    },
    chemical: {
      reactionRates: {},
      bondEvents: [],
      ph: null,
      ionFractions: {},
      ...chemical
    },
    nuclear: {
      isotopeFractions: {},
      activityBqKg: 0,
      decayHeatWKg: 0,
      radiationSourceTerms: [],
      ...nuclear
    },
    validation: {
      status: 'approximate',
      referenceSet: 'local-reference-v0',
      tolerances: {},
      warnings: [],
      ...validation
    }
  };
};

export const validatePropertyPacket = (packet) => {
  const errors = [];
  if (!packet || typeof packet !== 'object') {
    return { ok: false, errors: ['packet must be an object'] };
  }
  for (const key of REQUIRED_TOP_LEVEL) {
    if (!(key in packet)) errors.push(`missing top-level field: ${key}`);
  }
  if (!packet.state || typeof packet.state !== 'object') errors.push('state must be an object');
  if (!packet.validation || typeof packet.validation !== 'object') errors.push('validation must be an object');
  if (packet.validUntil <= packet.timestamp) errors.push('validUntil must be greater than timestamp');
  try {
    JSON.stringify(packet);
  } catch (err) {
    errors.push(`packet must be JSON serializable: ${err.message}`);
  }
  return { ok: errors.length === 0, errors };
};

export const packetAgeMs = (packet, now = Date.now()) => Math.max(0, now - (packet?.timestamp || now));

export const isPacketFresh = (packet, now = Date.now()) => Boolean(packet && packet.validUntil >= now);
