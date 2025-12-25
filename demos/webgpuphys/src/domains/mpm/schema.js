// MLS-MPM buffer schema and helpers.
// Layout is designed for peercompute compatibility: explicit offsets/strides, 16-byte alignment.

// Material type enum (stored as u32)
export const MATERIAL_TYPE = {
  BRITTLE_SOLID: 0,   // Ice, glass - linear elastic + fracture
  ELASTIC_SOLID: 1,   // Rubber - Neo-Hookean
  LIQUID: 2,          // Water - Tait EOS
  GAS: 3,             // Steam - Ideal Gas
  GRANULAR: 4,        // Sand, snow - Drucker-Prager (future)
  IRON: 5             // Stiff elastic solid (metal)
};

export const MPM_PARTICLE_STRIDE = 160; // bytes (extended for multi-material)

// Offsets are in bytes relative to the start of the particle.
// Note: mat3x3f requires 48 bytes (3 columns × 16B alignment) in WGSL std430 layout
export const MPM_PARTICLE_FIELDS = {
  position: 0,        // vec3<f32> (12B)
  materialType: 12,   // u32 (4B) - material behavior type (BRITTLE_SOLID, etc.)
  velocity: 16,       // vec3<f32> (12B)
  phase: 28,          // u32 (4B) - current phase (0=solid, 1=liquid, 2=gas)
  mass: 32,           // f32 (4B)
  volume0: 36,        // f32 (4B) - initial/reference volume
  temperature: 40,    // f32 (4B)
  damage: 44,         // f32 (4B) - fracture damage [0,1] for brittle materials
  F: 48,              // mat3x3<f32> (48B: 3 columns × 16B alignment)
  C: 96,              // mat3x3<f32> (48B: 3 columns × 16B alignment)
  mu: 144,            // f32 (4B) - per-particle shear modulus
  lambda: 148,        // f32 (4B) - per-particle bulk modulus
  restDensity: 152,   // f32 (4B) - derived rest density (state dependent)
  phaseFraction: 156  // f32 (4B) - order parameter (0 solid .. 1 gas via blending)
};

export const MPM_GRID_STRIDE = 32; // bytes (extended for thermal)
export const MPM_GRID_FIELDS = {
  velocity: 0,    // vec3<f32> encoded as i32 when using fixed-point atomics (vx, vy, vz)
  mass: 12,       // f32 encoded as i32 when using fixed-point atomics
  temperature: 16, // f32 encoded as i32 (weighted by mass) for heat transfer
  thermalMass: 20, // f32 encoded as i32 - mass accumulator for temperature averaging
  heatSource: 24,  // f32 - external heat flux (from interactions)
  padding: 28      // 4 bytes padding to 32B alignment
};

// Thermal constants
export const THERMAL_CONSTANTS = {
  diffusivity: 0.1,      // Heat diffusion rate (α)
  // Latent heats (J/kg, scaled down for simulation)
  latentHeatMelt: 334.0, // Ice → Water
  latentHeatBoil: 2260.0, // Water → Steam
  specificHeat: 4.186,   // Water specific heat (scaled)
  meltingPoint: 273.0,   // Kelvin
  boilingPoint: 373.0    // Kelvin
};

// Baseline constants (from WebGPU-Ocean MLS-MPM)
export const MPM_WORKGROUP_SIZE = 64;
export const MPM_FIXED_POINT_SCALE = 1e5; // reduced from 1e7 to prevent overflow

// Material property presets
export const MATERIAL_PRESETS = {
  ice: {
    materialType: MATERIAL_TYPE.BRITTLE_SOLID,
    // Softened significantly for explicit integration stability
    // Real ice is very stiff (E ≈ 9 GPa), but explicit MPM requires softer values
    // E = 2μ(1+ν) ≈ 2.5 * mu for ν ≈ 0.25
    mu: 50.0,                // Shear modulus (very soft for stability)
    lambda: 50.0,            // Bulk modulus
    tensileStrength: 5.0,    // Fracture threshold (lower for easier fracture)
    damageRate: 5.0,         // How fast damage accumulates
    restDensity: 0.92,       // Ice is less dense than water
    spacing: 1.2,
    jitter: 0.0,
    temperature: 260.0,
    temperatureRange: [180, 320]
  },
  water: {
    materialType: MATERIAL_TYPE.LIQUID,
    stiffness: 50.0,         // Bulk modulus for Tait EOS
    restDensity: 1.0,
    viscosity: 0.1,
    spacing: 0.8,
    jitter: 0.3,
    temperature: 300.0,
    temperatureRange: [250, 380]
  },
  steam: {
    materialType: MATERIAL_TYPE.GAS,
    gasConstant: 5.0,        // Pressure multiplier
    restDensity: 0.01,       // Very low density
    spacing: 2.0,
    jitter: 0.5,
    temperature: 450.0,
    temperatureRange: [300, 1200]
  },
  rubber: {
    materialType: MATERIAL_TYPE.ELASTIC_SOLID,
    mu: 5.0,                 // Soft shear modulus
    lambda: 20.0,            // Bulk modulus
    restDensity: 1.0,
    spacing: 1.1,
    jitter: 0.1,
    temperature: 300.0,
    temperatureRange: [250, 450]
  },
  iron: {
    materialType: MATERIAL_TYPE.IRON,
    mu: 200.0,
    lambda: 300.0,
    restDensity: 7.87,
    spacing: 1.0,
    jitter: 0.0,
    temperature: 300.0,
    temperatureRange: [250, 1500],
    tensileStrength: 50.0,
    damageRate: 1.0
  }
};

export const DEFAULT_SIMULATION_CONSTANTS = {
  stiffness: 50.0,           // Base stiffness for fluids
  restDensity: 1.0,
  dynamicViscosity: 0.1,
  dt: 0.1,                   // Timestep (requires sub-stepping for stiff solids)
  subSteps: 4,               // Physics sub-steps per frame
  fixedPointScale: MPM_FIXED_POINT_SCALE,
  tensileStrength: 10.0,     // For brittle fracture
  damageRate: 2.0,           // Damage accumulation rate
  thermalDiffusivity: 0.05,  // Heat diffusion rate (lower = slower spread)
  ambientPressure: 1.0       // Dimensionless ambient pressure (1.0 ~ reference)
};

export function particleBufferSize(particleCount) {
  return particleCount * MPM_PARTICLE_STRIDE;
}

export function gridBufferSize(cellCount) {
  return cellCount * MPM_GRID_STRIDE;
}

// Create typed views for a given particle index on a CPU-side ArrayBuffer.
// This is useful for initialization or headless tests; GPU buffers stay separate.
export function particleViews(buffer, index = 0) {
  const base = index * MPM_PARTICLE_STRIDE;
  return {
    position: new Float32Array(buffer, base + MPM_PARTICLE_FIELDS.position, 3),
    materialType: new Uint32Array(buffer, base + MPM_PARTICLE_FIELDS.materialType, 1),
    velocity: new Float32Array(buffer, base + MPM_PARTICLE_FIELDS.velocity, 3),
    phase: new Uint32Array(buffer, base + MPM_PARTICLE_FIELDS.phase, 1),
    mass: new Float32Array(buffer, base + MPM_PARTICLE_FIELDS.mass, 1),
    volume0: new Float32Array(buffer, base + MPM_PARTICLE_FIELDS.volume0, 1),
    temperature: new Float32Array(buffer, base + MPM_PARTICLE_FIELDS.temperature, 1),
    damage: new Float32Array(buffer, base + MPM_PARTICLE_FIELDS.damage, 1),
    F: new Float32Array(buffer, base + MPM_PARTICLE_FIELDS.F, 12), // 3 columns × 4 floats (padded)
    C: new Float32Array(buffer, base + MPM_PARTICLE_FIELDS.C, 12), // 3 columns × 4 floats (padded)
    mu: new Float32Array(buffer, base + MPM_PARTICLE_FIELDS.mu, 1),
    lambda: new Float32Array(buffer, base + MPM_PARTICLE_FIELDS.lambda, 1),
    restDensity: new Float32Array(buffer, base + MPM_PARTICLE_FIELDS.restDensity, 1),
    phaseFraction: new Float32Array(buffer, base + MPM_PARTICLE_FIELDS.phaseFraction, 1)
  };
}

export function createParticleBuffer(device, particleCount, usage) {
  const size = particleBufferSize(particleCount);
  const bufferUsage = usage ?? (GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC);
  return device.createBuffer({
    label: "mpm-particles",
    size,
    usage: bufferUsage
  });
}

export function createGridBuffer(device, cellCount, usage) {
  const size = gridBufferSize(cellCount);
  const bufferUsage = usage ?? (GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC);
  return device.createBuffer({
    label: "mpm-grid",
    size,
    usage: bufferUsage
  });
}
