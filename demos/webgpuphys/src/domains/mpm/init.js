import {
  MPM_PARTICLE_STRIDE,
  MATERIAL_TYPE,
  MATERIAL_PRESETS,
  particleBufferSize,
  particleViews
} from "./schema.js";

// Identity matrix for mat3x3f (with column padding for GPU alignment)
// In WGSL std430, mat3x3f has 3 columns of vec4f (padded), so 12 floats total
const identity3Padded = () => [
  1, 0, 0, 0,  // column 0 + padding
  0, 1, 0, 0,  // column 1 + padding
  0, 0, 1, 0   // column 2 + padding
];

const zero3Padded = () => [
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0
];

/**
 * Create an ArrayBuffer for particles laid out in a block (dam-break style).
 * Options:
 * - count: number of particles (required)
 * - gridSize: {x,y,z} for clamping positions
 * - start: [x,y,z] starting corner (default [0,0,0])
 * - spacing: particle spacing (default 0.65 to mirror WebGPU-Ocean)
 * - jitter: random jitter magnitude (default 0.0)
 * - cubeSideCount: optional explicit cube side count (for cubic packing)
 * - materialType: MATERIAL_TYPE enum value (default LIQUID)
 * - mass: default 1.0
 * - temperature: default 273 K
 * - phase: 0=solid, 1=liquid, 2=gas (default based on materialType)
 * - mu: shear modulus (default from material preset)
 * - lambda: bulk modulus (default from material preset)
 * - restDensity: for volume calculation (default 1.0)
 */
export function createBlockParticleData(options) {
  const {
    count,
    gridSize,
    start = [0, 0, 0],
    spacing = 0.65,
    jitter = 0.0,
    materialType = MATERIAL_TYPE.LIQUID,
    mass = 1.0,
    temperature = 300.0,
    phase = null,  // Auto-determine from materialType if not specified
    mu = null,     // Auto-determine from materialType if not specified
    lambda = null, // Auto-determine from materialType if not specified
    restDensity = 1.0,
    cubeSideCount = null
  } = options;
  
  if (!count || !gridSize) throw new Error("count and gridSize are required");

  // Determine defaults based on material type
  let defaultPhase, defaultMu, defaultLambda;
  
  switch (materialType) {
    case MATERIAL_TYPE.BRITTLE_SOLID:
      defaultPhase = 0;  // Solid
      defaultMu = MATERIAL_PRESETS.ice.mu;
      defaultLambda = MATERIAL_PRESETS.ice.lambda;
      break;
    case MATERIAL_TYPE.ELASTIC_SOLID:
      defaultPhase = 0;  // Solid
      defaultMu = MATERIAL_PRESETS.rubber.mu;
      defaultLambda = MATERIAL_PRESETS.rubber.lambda;
      break;
    case MATERIAL_TYPE.LIQUID:
      defaultPhase = 1;  // Liquid
      defaultMu = 0.0;
      defaultLambda = MATERIAL_PRESETS.water.stiffness;
      break;
    case MATERIAL_TYPE.GAS:
      defaultPhase = 2;  // Gas
      defaultMu = 0.0;
      defaultLambda = MATERIAL_PRESETS.steam.gasConstant;
      break;
    case MATERIAL_TYPE.IRON:
      defaultPhase = 0;  // Solid
      defaultMu = MATERIAL_PRESETS.iron.mu;
      defaultLambda = MATERIAL_PRESETS.iron.lambda;
      break;
    case MATERIAL_TYPE.GRANULAR:
      defaultPhase = 0;  // Solid-ish
      defaultMu = 100.0;
      defaultLambda = 100.0;
      break;
    default:
      defaultPhase = 1;
      defaultMu = 0.0;
      defaultLambda = 50.0;
  }

  const actualPhase = phase !== null ? phase : defaultPhase;
  const actualMu = mu !== null ? mu : defaultMu;
  const actualLambda = lambda !== null ? lambda : defaultLambda;

  const buf = new ArrayBuffer(particleBufferSize(count));
  let written = 0;

  const sideCount = cubeSideCount !== null ? cubeSideCount : Math.ceil(Math.cbrt(count));

  for (let iy = 0; iy < sideCount && written < count; iy++) {
    for (let ix = 0; ix < sideCount && written < count; ix++) {
      for (let iz = 0; iz < sideCount && written < count; iz++) {
        const views = particleViews(buf, written);
        const px = Math.min(start[0] + ix * spacing, gridSize.x - 2);
        const py = Math.min(start[1] + iy * spacing, gridSize.y - 2);
        const pz = Math.min(start[2] + iz * spacing, gridSize.z - 2);
        
        const jx = jitter ? (Math.random() * 2 - 1) * jitter : 0;
        const jy = jitter ? (Math.random() * 2 - 1) * jitter : 0;
        const jz = jitter ? (Math.random() * 2 - 1) * jitter : 0;
        views.position.set([px + jx, py + jy, pz + jz]);
        
        views.materialType[0] = materialType;
        views.velocity.set([0, 0, 0]);
        views.phase[0] = actualPhase;
        views.mass[0] = mass;
        views.volume0[0] = mass / restDensity;
        views.temperature[0] = temperature;
        views.damage[0] = 0.0;
        views.F.set(identity3Padded());
        views.C.set(zero3Padded());
        views.mu[0] = actualMu;
        views.lambda[0] = actualLambda;
        views.restDensity[0] = restDensity;
        views.phaseFraction[0] = 0.0;
        
        written += 1;
      }
    }
  }

  if (written < count) {
    throw new Error(`Could not place all particles; placed ${written} of ${count}`);
  }

  return buf;
}

/**
 * Create ice block particle data
 */
export function createIceBlockData(options) {
  return createBlockParticleData({
    ...options,
    materialType: MATERIAL_TYPE.BRITTLE_SOLID,
    temperature: options.temperature ?? 260.0,  // Below freezing
    mu: options.mu ?? MATERIAL_PRESETS.ice.mu,
    lambda: options.lambda ?? MATERIAL_PRESETS.ice.lambda
  });
}

/**
 * Create water block particle data
 */
export function createWaterBlockData(options) {
  return createBlockParticleData({
    ...options,
    materialType: MATERIAL_TYPE.LIQUID,
    temperature: options.temperature ?? 300.0,  // Room temperature
  });
}

/**
 * Create steam/gas particle data
 */
export function createSteamBlockData(options) {
  return createBlockParticleData({
    ...options,
    materialType: MATERIAL_TYPE.GAS,
    temperature: options.temperature ?? 400.0,  // Above boiling
    restDensity: options.restDensity ?? 0.1     // Low density for gas
  });
}

/**
 * Create rubber/elastic block particle data
 */
export function createRubberBlockData(options) {
  return createBlockParticleData({
    ...options,
    materialType: MATERIAL_TYPE.ELASTIC_SOLID,
    temperature: options.temperature ?? 300.0,
    mu: options.mu ?? MATERIAL_PRESETS.rubber.mu,
    lambda: options.lambda ?? MATERIAL_PRESETS.rubber.lambda
  });
}

/**
 * Create mixed material scene with multiple blocks
 * Options:
 * - totalCount: total particle count to use
 * - gridSize: {x, y, z}
 * - spacing, jitter, restDensity: defaults
 * OR
 * - blocks: array of block definitions
 */
export function createMixedMaterialData(options) {
  const { gridSize, blocks, totalCount, spacing = 0.65, jitter = 0.0, restDensity = 1.0 } = options;
  
  // If blocks are provided, use them directly
  if (blocks && blocks.length > 0) {
    let total = 0;
    for (const block of blocks) {
      total += block.count;
    }
    
    const buf = new ArrayBuffer(particleBufferSize(total));
    let offset = 0;
    
    for (const block of blocks) {
      const blockBuf = createBlockParticleData({
        count: block.count,
        gridSize,
        start: block.start,
        spacing: block.spacing ?? spacing,
        jitter: block.jitter ?? jitter,
        materialType: block.materialType ?? MATERIAL_TYPE.LIQUID,
        mass: block.mass ?? 1.0,
        temperature: block.temperature ?? 300.0,
        mu: block.mu,
        lambda: block.lambda,
        restDensity: block.restDensity ?? restDensity
      });
      
      const src = new Uint8Array(blockBuf);
      const dst = new Uint8Array(buf, offset * MPM_PARTICLE_STRIDE);
      dst.set(src.subarray(0, block.count * MPM_PARTICLE_STRIDE));
      
      offset += block.count;
    }
    
    return buf;
  }
  
  // Simple interface: create ice cube above water pool
  // Split particles ~40% ice, ~60% water
  const iceCount = Math.floor(totalCount * 0.4);
  const waterCount = totalCount - iceCount;
  
  // Water: lower pool
  const waterBlocks = [{
    count: waterCount,
    start: [2, 2, 2],
    spacing,
    jitter,
    materialType: MATERIAL_TYPE.LIQUID,
    temperature: 300.0,  // Room temperature
    restDensity
  }];
  
  // Ice: upper cube (elevated)
  const iceStart = [
    gridSize.x * 0.25,  // Centered-ish
    gridSize.y * 0.4,    // Above water
    gridSize.z * 0.25
  ];
  waterBlocks.push({
    count: iceCount,
    start: iceStart,
    spacing,
    jitter: jitter * 0.5,  // Less jitter for solid
    materialType: MATERIAL_TYPE.BRITTLE_SOLID,
    temperature: 260.0,  // Below freezing
    mu: MATERIAL_PRESETS.ice.mu,
    lambda: MATERIAL_PRESETS.ice.lambda,
    restDensity: 0.92  // Ice is less dense than water
  });
  
  // Create with blocks
  return createMixedMaterialData({
    gridSize,
    blocks: waterBlocks,
    spacing,
    jitter,
    restDensity
  });
}
