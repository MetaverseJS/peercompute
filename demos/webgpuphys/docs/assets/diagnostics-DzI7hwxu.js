import{d as P}from"./device-CAsdAK37.js";const w={BRITTLE_SOLID:0,ELASTIC_SOLID:1,LIQUID:2,GAS:3,GRANULAR:4,IRON:5},S=160,n={position:0,materialType:12,velocity:16,phase:28,mass:32,volume0:36,temperature:40,damage:44,F:48,C:96,mu:144,lambda:148,restDensity:152,phaseFraction:156},Q=32,A=64,J=1e5,h={ice:{mu:50,lambda:50},water:{stiffness:50},steam:{gasConstant:5},rubber:{mu:5,lambda:20},iron:{mu:200,lambda:300}},b={stiffness:50,restDensity:1,dynamicViscosity:.1,dt:.1,subSteps:4,fixedPointScale:J,tensileStrength:10,damageRate:2,thermalDiffusivity:.05,ambientPressure:1};function q(e){return e*S}function K(e){return e*Q}function j(e,i=0){const t=i*S;return{position:new Float32Array(e,t+n.position,3),materialType:new Uint32Array(e,t+n.materialType,1),velocity:new Float32Array(e,t+n.velocity,3),phase:new Uint32Array(e,t+n.phase,1),mass:new Float32Array(e,t+n.mass,1),volume0:new Float32Array(e,t+n.volume0,1),temperature:new Float32Array(e,t+n.temperature,1),damage:new Float32Array(e,t+n.damage,1),F:new Float32Array(e,t+n.F,12),C:new Float32Array(e,t+n.C,12),mu:new Float32Array(e,t+n.mu,1),lambda:new Float32Array(e,t+n.lambda,1),restDensity:new Float32Array(e,t+n.restDensity,1),phaseFraction:new Float32Array(e,t+n.phaseFraction,1)}}function X(e,i,t){const r=q(i),a=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC;return e.createBuffer({label:"mpm-particles",size:r,usage:a})}function Z(e,i,t){const r=K(i),a=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC;return e.createBuffer({label:"mpm-grid",size:r,usage:a})}const R=(e,i)=>Math.ceil(e/i);class ee{constructor(i,t={}){this.device=i,this.constants={...b,...t.constants??{}},this.iterations=t.iterations??1,this.pipelines={},this.bindGroups={},this.particleCount=0,this.gridCount=0}configure({pipelines:i,bindGroups:t}){this.pipelines={...i},this.bindGroups={...t}}setCounts({particleCount:i,gridCount:t}){this.particleCount=i??this.particleCount,this.gridCount=t??this.gridCount}step(i,t){if(!i)throw new Error("MpmDomain.step requires a command encoder");if(!this._hasPipelines())throw new Error("MpmDomain pipelines not configured");const r=R(this.particleCount,A),a=R(this.gridCount,A);for(let s=0;s<this.iterations;s+=1)this._runPass(i,"clearGrid",a),this._runPass(i,"p2g1",r),this._runPass(i,"p2g2",r),this._runPass(i,"updateGrid",a),this._runPass(i,"g2p",r),this.pipelines.copyPosition&&this.bindGroups.copyPosition&&this._runPass(i,"copyPosition",r)}_runPass(i,t,r){const a=this.pipelines[t],s=this.bindGroups[t];if(!a||!s)throw new Error(`Missing pipeline or bind group for ${t}`);const l=i.beginComputePass({label:`mpm-${t}`});l.setPipeline(a),l.setBindGroup(0,s),l.dispatchWorkgroups(r),l.end()}_hasPipelines(){return this.pipelines.clearGrid&&this.pipelines.p2g1&&this.pipelines.p2g2&&this.pipelines.updateGrid&&this.pipelines.g2p&&this.bindGroups.clearGrid&&this.bindGroups.p2g1&&this.bindGroups.p2g2&&this.bindGroups.updateGrid&&this.bindGroups.g2p}}const I=`
const MATERIAL_BRITTLE_SOLID: u32 = 0u;
const MATERIAL_ELASTIC_SOLID: u32 = 1u;
const MATERIAL_LIQUID: u32 = 2u;
const MATERIAL_GAS: u32 = 3u;
const MATERIAL_GRANULAR: u32 = 4u;
const MATERIAL_IRON: u32 = 5u;

// Element tables (indices align with UI element dropdowns; placeholder/approx values)
const ELEMENT_COUNT: u32 = 11u;
const melt_points: array<f32, 11> = array<f32, 11>(
  14.0,   // H
  54.0,   // O
  371.0,  // Na
  336.5,  // K
  923.0,  // Mg
  933.0,  // Al
  1687.0, // Si
  1115.0, // Ca
  1941.0, // Ti
  1811.0, // Fe
  600.6   // Pb
);
const boil_points: array<f32, 11> = array<f32, 11>(
  20.3,   // H
  90.2,   // O
  1156.0, // Na
  1032.0, // K
  1363.0, // Mg
  2743.0, // Al
  3538.0, // Si
  1757.0, // Ca
  3560.0, // Ti
  3134.0, // Fe
  2022.0  // Pb
);
const rho_solid: array<f32, 11> = array<f32, 11>(0.086, 1.14, 0.97, 0.86, 1.74, 2.70, 2.33, 1.55, 4.50, 7.87, 11.34);
const rho_liquid: array<f32, 11> = array<f32, 11>(0.071, 1.14, 0.97, 0.83, 1.58, 2.38, 2.57, 1.35, 4.1, 7.0, 10.66);
const rho_gas_ref: array<f32, 11> = array<f32, 11>(0.000089, 0.0014, 0.5, 0.4, 0.5, 0.4, 0.4, 0.5, 0.5, 0.5, 0.5);
const bulk_solid: array<f32, 11> = array<f32, 11>(2.0, 0.9, 6.3, 3.1, 45.0, 76.0, 98.0, 17.0, 160.0, 170.0, 46.0);
const shear_solid: array<f32, 11> = array<f32, 11>(0.1, 0.4, 2.8, 1.3, 17.0, 26.0, 31.0, 7.5, 74.0, 82.0, 14.0);
const bulk_liquid: array<f32, 11> = array<f32, 11>(0.02, 0.04, 2.0, 1.0, 18.0, 16.0, 35.0, 9.0, 25.0, 80.0, 45.0);
const visc_liquid: array<f32, 11> = array<f32, 11>(0.000009, 0.00002, 0.001, 0.0008, 0.0015, 0.0013, 0.0007, 0.0015, 0.004, 0.006, 0.004);
const gas_const: array<f32, 11> = array<f32, 11>(4124.0, 259.8, 100.0, 80.0, 100.0, 80.0, 80.0, 90.0, 100.0, 100.0, 100.0);
const heat_capacity: array<f32, 11> = array<f32, 11>(14.3, 29.4, 28.2, 29.6, 24.9, 24.0, 19.8, 25.0, 25.1, 25.1, 26.4);

// Phase transition temperatures (Kelvin)
// Water phase transitions
const T_MELT: f32 = 273.0;
const T_BOIL: f32 = 373.0;
const T_MELT_LOW: f32 = 271.0;  // Hysteresis
const T_BOIL_HIGH: f32 = 375.0;

// Iron phase transitions (scaled down for demo - real: 1811K melting point)
const T_IRON_MELT: f32 = 450.0;      // Melting point (scaled)
const T_IRON_MELT_LOW: f32 = 440.0;  // Hysteresis for solidification

// Latent heats (heavily scaled for responsive real-time simulation)
// Real values would prevent visible phase changes at reasonable temperatures
const LATENT_HEAT_MELT: f32 = 5.0;   // Scaled way down for quick melting
const LATENT_HEAT_BOIL: f32 = 10.0;  // Scaled way down for quick boiling
const SPECIFIC_HEAT: f32 = 1.0;      // Simplified for simulation responsiveness
`,L=`
struct Particle {
  position: vec3f,
  materialType: u32,      // BRITTLE_SOLID, ELASTIC_SOLID, LIQUID, GAS, GRANULAR
  velocity: vec3f,
  phase: u32,             // Current phase: 0=solid, 1=liquid, 2=gas
  mass: f32,
  volume0: f32,           // Initial/reference volume
  temperature: f32,
  damage: f32,            // Fracture damage [0,1] for brittle materials
  F: mat3x3f,             // Deformation gradient
  C: mat3x3f,             // APIC affine matrix
  mu: f32,                // Per-particle shear modulus
  lambda: f32,            // Per-particle bulk modulus
  restDensity: f32,       // Derived rest density
  phaseFraction: f32,     // Order parameter (0 solid .. 1 gas via blending)
};
`,U=`
struct Cell {
  vx: i32,           // Velocity x (fixed-point)
  vy: i32,           // Velocity y (fixed-point)
  vz: i32,           // Velocity z (fixed-point)
  mass: i32,         // Mass (fixed-point)
  temperature: i32,  // Temperature * mass (fixed-point, for averaging)
  thermalMass: i32,  // Mass accumulator for temperature
  heatSource: i32,   // External heat flux (fixed-point)
  _pad: i32,         // Padding to 32 bytes
};
`,ie=`
struct CellAtomic {
  vx: atomic<i32>,
  vy: atomic<i32>,
  vz: atomic<i32>,
  mass: atomic<i32>,
  temperature: atomic<i32>,
  thermalMass: atomic<i32>,
  heatSource: atomic<i32>,
  _pad: i32,
};
`,N=`
struct SimulationUniforms {
  gravity: vec3f,
  ambientPressure: f32,
};
`,G=`
override fixed_point_multiplier: f32;

fn encodeFixedPoint(f: f32) -> i32 {
  return i32(f * fixed_point_multiplier);
}

fn decodeFixedPoint(v: i32) -> f32 {
  return f32(v) / fixed_point_multiplier;
}
`,te=`
${U}

@group(0) @binding(0) var<storage, read_write> cells: array<Cell>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  if (id.x < arrayLength(&cells)) {
    cells[id.x].mass = 0;
    cells[id.x].vx = 0;
    cells[id.x].vy = 0;
    cells[id.x].vz = 0;
    cells[id.x].temperature = 0;
    cells[id.x].thermalMass = 0;
    cells[id.x].heatSource = 0;
  }
}
`,re=`
${I}
${L}
${ie}
${G}

@group(0) @binding(0) var<storage, read> particles: array<Particle>;
@group(0) @binding(1) var<storage, read_write> cells: array<CellAtomic>;
@group(0) @binding(2) var<uniform> init_box_size: vec3f;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  if (id.x >= arrayLength(&particles)) { return; }

  let p = particles[id.x];
  var weights: array<vec3f, 3>;

  let cell_idx: vec3f = floor(p.position);
  let cell_diff: vec3f = p.position - (cell_idx + 0.5);
  weights[0] = 0.5 * (0.5 - cell_diff) * (0.5 - cell_diff);
  weights[1] = 0.75 - cell_diff * cell_diff;
  weights[2] = 0.5 * (0.5 + cell_diff) * (0.5 + cell_diff);

  let C = p.C;

  for (var gx = 0; gx < 3; gx++) {
    for (var gy = 0; gy < 3; gy++) {
      for (var gz = 0; gz < 3; gz++) {
        let weight = weights[gx].x * weights[gy].y * weights[gz].z;
        let cell = vec3f(
          cell_idx.x + f32(gx) - 1.0,
          cell_idx.y + f32(gy) - 1.0,
          cell_idx.z + f32(gz) - 1.0
        );
        let cell_dist = (cell + 0.5) - p.position;
        let Q = C * cell_dist;

        let mass_contrib = weight * p.mass;
        let vel_contrib = mass_contrib * (p.velocity + Q);
        
        // Temperature contribution (weighted by mass for averaging)
        let temp_contrib = mass_contrib * p.temperature;

        let cell_index: i32 =
          i32(cell.x) * i32(init_box_size.y) * i32(init_box_size.z) +
          i32(cell.y) * i32(init_box_size.z) +
          i32(cell.z);
        
        atomicAdd(&cells[cell_index].mass, encodeFixedPoint(mass_contrib));
        atomicAdd(&cells[cell_index].vx, encodeFixedPoint(vel_contrib.x));
        atomicAdd(&cells[cell_index].vy, encodeFixedPoint(vel_contrib.y));
        atomicAdd(&cells[cell_index].vz, encodeFixedPoint(vel_contrib.z));
        
        // Scatter temperature (mass-weighted for proper averaging)
        atomicAdd(&cells[cell_index].temperature, encodeFixedPoint(temp_contrib));
        atomicAdd(&cells[cell_index].thermalMass, encodeFixedPoint(mass_contrib));
      }
    }
  }
}
`,ae=`
${I}
${L}

struct CellAtomic {
  vx: atomic<i32>,
  vy: atomic<i32>,
  vz: atomic<i32>,
  mass: i32,
  temperature: i32,
  thermalMass: i32,
  heatSource: i32,
  _pad: i32,
};

${N}
${G}

override stiffness: f32;
override rest_density: f32;
override dynamic_viscosity: f32;
override dt: f32;
override tensile_strength: f32;
override damage_rate: f32;

@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<storage, read_write> cells: array<CellAtomic>;
@group(0) @binding(2) var<uniform> init_box_size: vec3f;
@group(0) @binding(3) var<uniform> sim_uniforms: SimulationUniforms;

// Compute eigenvalues of a symmetric 3x3 matrix (for principal stresses)
fn eigenvalues_symmetric(m: mat3x3f) -> vec3f {
  let a = m[0][0]; let b = m[1][1]; let c = m[2][2];
  let d = m[0][1]; let e = m[1][2]; let f = m[0][2];
  
  let p1 = d*d + e*e + f*f;
  
  if (p1 < 1e-10) {
    return vec3f(a, b, c);
  }
  
  let q = (a + b + c) / 3.0;
  let p2 = (a - q)*(a - q) + (b - q)*(b - q) + (c - q)*(c - q) + 2.0*p1;
  let p = sqrt(p2 / 6.0);
  
  let B00 = (a - q) / p; let B11 = (b - q) / p; let B22 = (c - q) / p;
  let B01 = d / p; let B12 = e / p; let B02 = f / p;
  
  let r = 0.5 * (B00 * (B11*B22 - B12*B12) - B01 * (B01*B22 - B12*B02) + B02 * (B01*B12 - B11*B02));
  let r_clamped = clamp(r, -1.0, 1.0);
  let phi = acos(r_clamped) / 3.0;
  
  let eig0 = q + 2.0 * p * cos(phi);
  let eig2 = q + 2.0 * p * cos(phi + 2.0 * 3.14159265359 / 3.0);
  let eig1 = 3.0 * q - eig0 - eig2;
  
  return vec3f(eig0, eig1, eig2);
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  if (id.x >= arrayLength(&particles)) { return; }
  var p = particles[id.x];
  var weights: array<vec3f, 3>;

  let cell_idx = floor(p.position);
  let cell_diff = p.position - (cell_idx + 0.5);
  weights[0] = 0.5 * (0.5 - cell_diff) * (0.5 - cell_diff);
  weights[1] = 0.75 - cell_diff * cell_diff;
  weights[2] = 0.5 * (0.5 + cell_diff) * (0.5 + cell_diff);

  // Gather density from grid
  var density = 0.0;
  for (var gx = 0; gx < 3; gx++) {
    for (var gy = 0; gy < 3; gy++) {
      for (var gz = 0; gz < 3; gz++) {
        let weight = weights[gx].x * weights[gy].y * weights[gz].z;
        let cell = vec3f(
          cell_idx.x + f32(gx) - 1.0,
          cell_idx.y + f32(gy) - 1.0,
          cell_idx.z + f32(gz) - 1.0
        );
        let cell_index: i32 =
          i32(cell.x) * i32(init_box_size.y) * i32(init_box_size.z) +
          i32(cell.y) * i32(init_box_size.z) +
          i32(cell.z);
        density += decodeFixedPoint(cells[cell_index].mass) * weight;
      }
    }
  }

  // Emergent phase & property derivation
  var stress = mat3x3f(vec3f(0.), vec3f(0.), vec3f(0.));
  var volume: f32;
  let I = mat3x3f(vec3f(1,0,0), vec3f(0,1,0), vec3f(0,0,1));

  let elem = min(p.materialType, ELEMENT_COUNT - 1u);
  let melt = melt_points[elem];
  let boil = boil_points[elem] * pow(sim_uniforms.ambientPressure, 0.07);
  let deltaT = 10.0;
  let solid_w = clamp((melt - p.temperature) / deltaT, 0.0, 1.0);
  let gas_w = clamp((p.temperature - boil) / deltaT, 0.0, 1.0);
  let liquid_w = clamp(1.0 - solid_w - gas_w, 0.0, 1.0);

  var phaseTag: u32 = 1u;
  if (solid_w > liquid_w && solid_w > gas_w) { phaseTag = 0u; }
  else if (gas_w > liquid_w && gas_w > solid_w) { phaseTag = 2u; }

  let rho_mix = solid_w * rho_solid[elem] + liquid_w * rho_liquid[elem] + gas_w * max(rho_gas_ref[elem], 1e-4);
  p.restDensity = max(rho_mix, 1e-4);
  p.phaseFraction = clamp(liquid_w + gas_w, 0.0, 1.0);
  p.phase = phaseTag;

  let solid_mu = shear_solid[elem] * solid_w;
  let solid_lambda = bulk_solid[elem] * solid_w;
  let liquid_bulk = bulk_liquid[elem] * liquid_w;
  let liquid_visc = visc_liquid[elem] * liquid_w;
  let gasR = gas_const[elem] * gas_w;
  let dt_soften = clamp(0.1 / dt, 0.1, 1.0);

  p.mu = solid_mu * dt_soften;
  if (phaseTag == 0u) {
    p.lambda = solid_lambda * dt_soften;
  } else {
    p.lambda = liquid_bulk + gasR;
  }

  switch (phaseTag) {
    case 0u: { // Solid
      let F = p.F;
      let J = determinant(F);
      let clampedJ = clamp(J, 0.5, 2.0);
      volume = p.volume0 * clampedJ;
      let FTF = transpose(F) * F;
      let E = 0.5 * (FTF - I);
      let trace_E = E[0][0] + E[1][1] + E[2][2];
      let S = p.lambda * trace_E * I + 2.0 * p.mu * E;
      stress = (1.0 / clampedJ) * F * S * transpose(F);
      break;
    }
    case 1u: { // Liquid
      volume = p.mass / max(density, 1e-6);
      let pressure = max(0.0, p.lambda * (pow(density / p.restDensity, 7.0) - 1.0));
      stress = -pressure * I;
      let strain_rate = p.C + transpose(p.C);
      stress += liquid_visc * strain_rate;
      break;
    }
    default: { // Gas
      volume = p.mass / max(density, 1e-8);
      let pressure = sim_uniforms.ambientPressure + max(gasR, 0.1) * (density / p.restDensity) * (p.temperature / 273.0);
      stress = -pressure * I;
    }
  }

  particles[id.x] = p;

  let factor = -volume * 4.0 * stress * dt;

  for (var gx = 0; gx < 3; gx++) {
    for (var gy = 0; gy < 3; gy++) {
      for (var gz = 0; gz < 3; gz++) {
        let weight = weights[gx].x * weights[gy].y * weights[gz].z;
        let cell = vec3f(
          cell_idx.x + f32(gx) - 1.0,
          cell_idx.y + f32(gy) - 1.0,
          cell_idx.z + f32(gz) - 1.0
        );
        let cell_dist = (cell + 0.5) - p.position;
        let cell_index: i32 =
          i32(cell.x) * i32(init_box_size.y) * i32(init_box_size.z) +
          i32(cell.y) * i32(init_box_size.z) +
          i32(cell.z);
        let momentum = factor * weight * cell_dist;
        atomicAdd(&cells[cell_index].vx, encodeFixedPoint(momentum.x));
        atomicAdd(&cells[cell_index].vy, encodeFixedPoint(momentum.y));
        atomicAdd(&cells[cell_index].vz, encodeFixedPoint(momentum.z));
      }
    }
  }
}
`,se=`
${U}

${N}
${G}
override dt: f32;
override thermal_diffusivity: f32;

@group(0) @binding(0) var<storage, read_write> cells: array<Cell>;
@group(0) @binding(1) var<uniform> real_box_size: vec3f;
@group(0) @binding(2) var<uniform> init_box_size: vec3f;
@group(0) @binding(3) var<uniform> sim_uniforms: SimulationUniforms;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  if (id.x >= arrayLength(&cells)) { return; }
  if (cells[id.x].mass <= 0) { return; }

  let cell_mass = decodeFixedPoint(cells[id.x].mass);
  
  // Velocity update
  var v = vec3f(
    decodeFixedPoint(cells[id.x].vx),
    decodeFixedPoint(cells[id.x].vy),
    decodeFixedPoint(cells[id.x].vz)
  );
  v /= cell_mass;
  v += sim_uniforms.gravity * dt;

  cells[id.x].vx = encodeFixedPoint(v.x);
  cells[id.x].vy = encodeFixedPoint(v.y);
  cells[id.x].vz = encodeFixedPoint(v.z);

  // Compute cell coordinates
  let x: i32 = i32(id.x) / i32(init_box_size.z) / i32(init_box_size.y);
  let y: i32 = (i32(id.x) / i32(init_box_size.z)) % i32(init_box_size.y);
  let z: i32 = i32(id.x) % i32(init_box_size.z);

  // Velocity boundary conditions
  if (x < 2 || x > i32(ceil(real_box_size.x) - 3.0)) { cells[id.x].vx = 0; }
  if (y < 2 || y > i32(ceil(real_box_size.y) - 3.0)) { cells[id.x].vy = 0; }
  if (z < 2 || z > i32(ceil(real_box_size.z) - 3.0)) { cells[id.x].vz = 0; }
  
  // Temperature averaging (divide accumulated T*m by total m)
  let thermal_mass = decodeFixedPoint(cells[id.x].thermalMass);
  if (thermal_mass > 1e-6) {
    let avg_temp = decodeFixedPoint(cells[id.x].temperature) / thermal_mass;
    // Add any heat sources
    let heat_flux = decodeFixedPoint(cells[id.x].heatSource);
    let new_temp = avg_temp + heat_flux * dt;
    // Store back as temperature * mass for proper interpolation
    cells[id.x].temperature = encodeFixedPoint(new_temp * thermal_mass);
  }
}
`,le=`
${I}
${L}
${U}

struct MouseInteraction {
  point: vec3f,
  radius: f32,
  velocity: vec3f,     // For moving heat sources
  temperature: f32,    // Heat source temperature (0 = no thermal effect)
};

${G}
override dt: f32;

@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<storage, read> cells: array<Cell>;
@group(0) @binding(2) var<uniform> real_box_size: vec3f;
@group(0) @binding(3) var<uniform> init_box_size: vec3f;
@group(0) @binding(4) var<uniform> mouse: MouseInteraction;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  if (id.x >= arrayLength(&particles)) { return; }

  var p = particles[id.x];
  p.velocity = vec3f(0.0);
  var new_temperature = 0.0;
  var total_weight = 0.0;

  var weights: array<vec3f, 3>;
  let cell_idx = floor(p.position);
  let cell_diff = p.position - (cell_idx + 0.5);
  weights[0] = 0.5 * (0.5 - cell_diff) * (0.5 - cell_diff);
  weights[1] = 0.75 - cell_diff * cell_diff;
  weights[2] = 0.5 * (0.5 + cell_diff) * (0.5 + cell_diff);

  var B = mat3x3f(vec3f(0.0), vec3f(0.0), vec3f(0.0));
  
  for (var gx = 0; gx < 3; gx++) {
    for (var gy = 0; gy < 3; gy++) {
      for (var gz = 0; gz < 3; gz++) {
        let weight = weights[gx].x * weights[gy].y * weights[gz].z;
        let cell = vec3f(
          cell_idx.x + f32(gx) - 1.0,
          cell_idx.y + f32(gy) - 1.0,
          cell_idx.z + f32(gz) - 1.0
        );
        let cell_dist = (cell + 0.5) - p.position;
        let cell_index: i32 =
          i32(cell.x) * i32(init_box_size.y) * i32(init_box_size.z) +
          i32(cell.y) * i32(init_box_size.z) +
          i32(cell.z);
        
        let weighted_velocity = vec3f(
          decodeFixedPoint(cells[cell_index].vx),
          decodeFixedPoint(cells[cell_index].vy),
          decodeFixedPoint(cells[cell_index].vz)
        ) * weight;

        let term = mat3x3f(
          weighted_velocity * cell_dist.x,
          weighted_velocity * cell_dist.y,
          weighted_velocity * cell_dist.z
        );

        B += term;
        p.velocity += weighted_velocity;
        
        // Gather temperature
        let thermal_mass = decodeFixedPoint(cells[cell_index].thermalMass);
        if (thermal_mass > 1e-6) {
          let cell_temp = decodeFixedPoint(cells[cell_index].temperature) / thermal_mass;
          new_temperature += cell_temp * weight;
          total_weight += weight;
        }
      }
    }
  }

  p.C = B * 4.0;
  
  // Update temperature from grid
  if (total_weight > 0.0) {
    // Blend grid temperature with current particle temperature
    // This smooths out temperature changes
    let grid_temp = new_temperature / total_weight;
    p.temperature = mix(p.temperature, grid_temp, 0.5);
  }
  
  let I = mat3x3f(vec3f(1,0,0), vec3f(0,1,0), vec3f(0,0,1));
  
  // ==========================================
  // DEFORMATION GRADIENT UPDATE
  // ==========================================
  
  switch (p.phase) {
    case 0u: { // Solid-like
      p.F = (I + dt * p.C) * p.F;
      break;
    }
    
    default: {
      p.F = I;
    }
  }
  
  // ==========================================
  // POSITION UPDATE & BOUNDARY CONDITIONS
  // ==========================================
  
  p.position += p.velocity * dt;
  p.position = vec3f(
    clamp(p.position.x, 1.0, real_box_size.x - 2.0),
    clamp(p.position.y, 1.0, real_box_size.y - 2.0),
    clamp(p.position.z, 1.0, real_box_size.z - 2.0)
  );

  // Soft wall boundaries
  let k = 3.0;
  let wall_stiffness = 0.3;
  let wall_min = vec3f(3.0);
  let wall_max = real_box_size - 4.0;
  let x_n = p.position + p.velocity * dt * k;
  if (x_n.x < wall_min.x) { p.velocity.x += wall_stiffness * (wall_min.x - x_n.x); }
  if (x_n.x > wall_max.x) { p.velocity.x += wall_stiffness * (wall_max.x - x_n.x); }
  if (x_n.y < wall_min.y) { p.velocity.y += wall_stiffness * (wall_min.y - x_n.y); }
  if (x_n.y > wall_max.y) { p.velocity.y += wall_stiffness * (wall_max.y - x_n.y); }
  if (x_n.z < wall_min.z) { p.velocity.z += wall_stiffness * (wall_min.z - x_n.z); }
  if (x_n.z > wall_max.z) { p.velocity.z += wall_stiffness * (wall_max.z - x_n.z); }

  // Collision with interaction sphere
  if (mouse.radius > 0.0) {
    let diff = p.position - mouse.point;
    let dist = length(diff);
    
    // Collision response - push particles out of sphere
    if (dist < mouse.radius) {
      let normal = normalize(diff);
      let penetration = mouse.radius - dist;
      p.position += normal * penetration;
      
      let v_dot_n = dot(p.velocity, normal);
      if (v_dot_n < 0.0) {
        p.velocity -= 1.5 * v_dot_n * normal;
      }
    }
    
    // Heat source effect - applies in a LARGER radius than collision (2x)
    // This allows particles to be heated even when pushed to the surface
    let thermal_radius = mouse.radius * 2.0;
    if (mouse.temperature > 1.0 && dist < thermal_radius) {
      // Thermal strength: 1.0 at center, 0.0 at thermal_radius
      let thermal_strength = 1.0 - dist / thermal_radius;
      // Strong thermal effect - 50% blend per frame at center
      // This allows particles to quickly reach target temperature
      p.temperature = mix(p.temperature, mouse.temperature, thermal_strength * 0.5);
    }
  }

  particles[id.x] = p;
}
`,oe=`
${I}
${L}

struct PosVelData {
  position: vec3f,
  materialType: f32,  // Store as f32 for easy GPU access
  velocity: vec3f,
  temperature: f32,
};

@group(0) @binding(0) var<storage, read> particles: array<Particle>;
@group(0) @binding(1) var<storage, read_write> posvel: array<PosVelData>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  if (id.x >= arrayLength(&particles)) { return; }
  let p = particles[id.x];
  posvel[id.x].position = p.position;
  posvel[id.x].materialType = f32(p.materialType);
  posvel[id.x].velocity = p.velocity;
  posvel[id.x].temperature = p.temperature;
}
`;function ne(e,i=b){const t=i.tensileStrength??0,r=i.damageRate??0,a=i.restDensity??b.restDensity,s=i.stiffness??b.stiffness,l=i.dynamicViscosity??b.dynamicViscosity,d=i.dt??b.dt,u=i.fixedPointScale??b.fixedPointScale,m=P(e,te,"mpm-clear-grid"),_=P(e,re,"mpm-p2g1"),x=P(e,ae,"mpm-p2g2"),g=P(e,se,"mpm-update-grid"),y=P(e,le,"mpm-g2p"),c=P(e,oe,"mpm-copy-position");return{clearGrid:e.createComputePipeline({label:"mpm-clear-grid",layout:"auto",compute:{module:m}}),p2g1:e.createComputePipeline({label:"mpm-p2g1",layout:"auto",compute:{module:_,constants:{fixed_point_multiplier:u}}}),p2g2:e.createComputePipeline({label:"mpm-p2g2",layout:"auto",compute:{module:x,constants:{fixed_point_multiplier:u,stiffness:s,rest_density:a,dynamic_viscosity:l,dt:d,tensile_strength:t,damage_rate:r}}}),updateGrid:e.createComputePipeline({label:"mpm-update-grid",layout:"auto",compute:{module:g,constants:{fixed_point_multiplier:i.fixedPointScale,dt:i.dt,thermal_diffusivity:i.thermalDiffusivity??.1}}}),g2p:e.createComputePipeline({label:"mpm-g2p",layout:"auto",compute:{module:y,constants:{fixed_point_multiplier:i.fixedPointScale,dt:i.dt}}}),copyPosition:e.createComputePipeline({label:"mpm-copy-position",layout:"auto",compute:{module:c}})}}function ce(e,i,t){const{particleBuffer:r,gridBuffer:a,initBoxBuffer:s,realBoxBuffer:l,interactionBuffer:d,posVelBuffer:u,simUniformBuffer:m}=t,_={clearGrid:e.createBindGroup({layout:i.clearGrid.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:a}}]}),p2g1:e.createBindGroup({layout:i.p2g1.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:s}}]}),p2g2:e.createBindGroup({layout:i.p2g2.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:m}}]}),updateGrid:e.createBindGroup({layout:i.updateGrid.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:a}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:m}}]}),g2p:e.createBindGroup({layout:i.g2p.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:s}},{binding:4,resource:{buffer:d}}]})};return i.copyPosition&&u&&(_.copyPosition=e.createBindGroup({layout:i.copyPosition.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r}},{binding:1,resource:{buffer:u}}]})),_}function O(e,i,t){const r=new Float32Array(4);r.set(i.slice(0,3));const a=e.createBuffer({label:t??"vec3-uniform",size:r.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(a,0,r),a}function de(e,i,t){const r=new Float32Array(4);r.set(i.slice(0,3)),r[3]=t;const a=e.createBuffer({label:"mpm-sim-uniforms",size:r.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(a,0,r),a}function _e(e,i){const{particleCount:t,gridSize:r,posVelBuffer:a,interactionBuffer:s,constants:l,iterations:d}=i;if(!r)throw new Error("gridSize {x,y,z} is required");const u=Math.ceil(r.x)*Math.ceil(r.y)*Math.ceil(r.z),m=X(e,t),_=Z(e,u),x=O(e,[r.x,r.y,r.z],"mpm-init-box"),g=O(e,[r.x,r.y,r.z],"mpm-real-box"),y=(l==null?void 0:l.ambientPressure)??b.ambientPressure,c=de(e,[0,-.3,0],y);let o=s;if(!o){o=e.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,label:"mpm-interaction-default"});const B=new Float32Array(8);B[3]=-1,e.queue.writeBuffer(o,0,B)}const p=ne(e,l),T=ce(e,p,{particleBuffer:m,gridBuffer:_,initBoxBuffer:x,realBoxBuffer:g,simUniformBuffer:c,interactionBuffer:o,posVelBuffer:a}),z=new ee(e,{constants:l,iterations:d});return z.configure({pipelines:p,bindGroups:T}),z.setCounts({particleCount:t,gridCount:u}),{domain:z,pipelines:p,bindGroups:T,buffers:{particleBuffer:m,gridBuffer:_,initBoxBuffer:x,realBoxBuffer:g,simUniformBuffer:c,interactionBuffer:o,posVelBuffer:a},dispatch:{particle:Math.ceil(t/A),grid:Math.ceil(u/A)}}}function ge(e,i,t){const r=t.byteLength??t.length;if(r>i.size)throw new Error(`Particle data (${r}) exceeds buffer size (${i.size})`);e.queue.writeBuffer(i,0,t)}const ue=()=>[1,0,0,0,0,1,0,0,0,0,1,0],pe=()=>[0,0,0,0,0,0,0,0,0,0,0,0];function xe(e){const{count:i,gridSize:t,start:r=[0,0,0],spacing:a=.65,jitter:s=0,materialType:l=w.LIQUID,mass:d=1,temperature:u=300,phase:m=null,mu:_=null,lambda:x=null,restDensity:g=1,cubeSideCount:y=null}=e;if(!i||!t)throw new Error("count and gridSize are required");let c,o,p;switch(l){case w.BRITTLE_SOLID:c=0,o=h.ice.mu,p=h.ice.lambda;break;case w.ELASTIC_SOLID:c=0,o=h.rubber.mu,p=h.rubber.lambda;break;case w.LIQUID:c=1,o=0,p=h.water.stiffness;break;case w.GAS:c=2,o=0,p=h.steam.gasConstant;break;case w.IRON:c=0,o=h.iron.mu,p=h.iron.lambda;break;case w.GRANULAR:c=0,o=100,p=100;break;default:c=1,o=0,p=50}const T=m!==null?m:c,z=_!==null?_:o,B=x!==null?x:p,D=new ArrayBuffer(q(i));let v=0;const C=y!==null?y:Math.ceil(Math.cbrt(i));for(let M=0;M<C&&v<i;M++)for(let F=0;F<C&&v<i;F++)for(let E=0;E<C&&v<i;E++){const f=j(D,v),k=Math.min(r[0]+F*a,t.x-2),$=Math.min(r[1]+M*a,t.y-2),V=Math.min(r[2]+E*a,t.z-2),H=s?(Math.random()*2-1)*s:0,W=s?(Math.random()*2-1)*s:0,Y=s?(Math.random()*2-1)*s:0;f.position.set([k+H,$+W,V+Y]),f.materialType[0]=l,f.velocity.set([0,0,0]),f.phase[0]=T,f.mass[0]=d,f.volume0[0]=d/g,f.temperature[0]=u,f.damage[0]=0,f.F.set(ue()),f.C.set(pe()),f.mu[0]=z,f.lambda[0]=B,f.restDensity[0]=g,f.phaseFraction[0]=0,v+=1}if(v<i)throw new Error(`Could not place all particles; placed ${v} of ${i}`);return D}async function fe(e,i,t){var d;const r=t*S,a=e.createBuffer({label:"mpm-particle-staging",size:r,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),s=e.createCommandEncoder({label:"mpm-diagnostics-copy"});s.copyBufferToBuffer(i,0,a,0,r),e.queue.submit([s.finish()]),await a.mapAsync(GPUMapMode.READ);const l=a.getMappedRange().slice(0);return a.unmap(),(d=a.destroy)==null||d.call(a),l}async function ye(e,i,t){const r=await fe(e,i,t),a=n.mass/4,s=n.velocity/4,l=new Float32Array(r);let d=0,u=0,m=0,_=0;for(let x=0;x<t;x+=1){const g=S/4*x,y=l[g+a],c=l[g+s+0],o=l[g+s+1],p=l[g+s+2];d+=y,u+=y*c,m+=y*o,_+=y*p}return{mass:d,momentum:[u,m,_]}}export{S as M,ye as a,xe as c,_e as s,ge as u};
