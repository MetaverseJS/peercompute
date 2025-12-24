var At=Object.defineProperty;var Bt=(i,e,t)=>e in i?At(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var l=(i,e,t)=>Bt(i,typeof e!="symbol"?e+"":e,t);import{d as q,i as Dt}from"./device-CAsdAK37.js";const $={BRITTLE_SOLID:0,ELASTIC_SOLID:1,LIQUID:2,GAS:3,GRANULAR:4,IRON:5},fe=160,v={position:0,materialType:12,velocity:16,phase:28,mass:32,volume0:36,temperature:40,damage:44,F:48,C:96,mu:144,lambda:148,restDensity:152,phaseFraction:156},Mt=32,se=64,Ut=1e5,L={ice:{mu:50,lambda:50},water:{stiffness:50},steam:{gasConstant:5},rubber:{mu:5,lambda:20},iron:{mu:200,lambda:300}},R={stiffness:50,restDensity:1,dynamicViscosity:.1,dt:.1,subSteps:4,fixedPointScale:Ut,tensileStrength:10,damageRate:2,thermalDiffusivity:.05,ambientPressure:1};function at(i){return i*fe}function Ot(i){return i*Mt}function Nt(i,e=0){const t=e*fe;return{position:new Float32Array(i,t+v.position,3),materialType:new Uint32Array(i,t+v.materialType,1),velocity:new Float32Array(i,t+v.velocity,3),phase:new Uint32Array(i,t+v.phase,1),mass:new Float32Array(i,t+v.mass,1),volume0:new Float32Array(i,t+v.volume0,1),temperature:new Float32Array(i,t+v.temperature,1),damage:new Float32Array(i,t+v.damage,1),F:new Float32Array(i,t+v.F,12),C:new Float32Array(i,t+v.C,12),mu:new Float32Array(i,t+v.mu,1),lambda:new Float32Array(i,t+v.lambda,1),restDensity:new Float32Array(i,t+v.restDensity,1),phaseFraction:new Float32Array(i,t+v.phaseFraction,1)}}function Lt(i,e,t){const r=at(e),n=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC;return i.createBuffer({label:"mpm-particles",size:r,usage:n})}function Ft(i,e,t){const r=Ot(e),n=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC;return i.createBuffer({label:"mpm-grid",size:r,usage:n})}const Ge=(i,e)=>Math.ceil(i/e);class Rt{constructor(e,t={}){this.device=e,this.constants={...R,...t.constants??{}},this.iterations=t.iterations??1,this.pipelines={},this.bindGroups={},this.particleCount=0,this.gridCount=0}configure({pipelines:e,bindGroups:t}){this.pipelines={...e},this.bindGroups={...t}}setCounts({particleCount:e,gridCount:t}){this.particleCount=e??this.particleCount,this.gridCount=t??this.gridCount}step(e,t){if(!e)throw new Error("MpmDomain.step requires a command encoder");if(!this._hasPipelines())throw new Error("MpmDomain pipelines not configured");const r=Ge(this.particleCount,se),n=Ge(this.gridCount,se);for(let s=0;s<this.iterations;s+=1)this._runPass(e,"clearGrid",n),this._runPass(e,"p2g1",r),this._runPass(e,"p2g2",r),this._runPass(e,"updateGrid",n),this._runPass(e,"g2p",r),this.pipelines.copyPosition&&this.bindGroups.copyPosition&&this._runPass(e,"copyPosition",r)}_runPass(e,t,r){const n=this.pipelines[t],s=this.bindGroups[t];if(!n||!s)throw new Error(`Missing pipeline or bind group for ${t}`);const o=e.beginComputePass({label:`mpm-${t}`});o.setPipeline(n),o.setBindGroup(0,s),o.dispatchWorkgroups(r),o.end()}_hasPipelines(){return this.pipelines.clearGrid&&this.pipelines.p2g1&&this.pipelines.p2g2&&this.pipelines.updateGrid&&this.pipelines.g2p&&this.bindGroups.clearGrid&&this.bindGroups.p2g1&&this.bindGroups.p2g2&&this.bindGroups.updateGrid&&this.bindGroups.g2p}}const he=`
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
`,pe=`
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
`,Ae=`
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
`,Gt=`
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
`,lt=`
struct SimulationUniforms {
  gravity: vec3f,
  ambientPressure: f32,
};
`,me=`
override fixed_point_multiplier: f32;

fn encodeFixedPoint(f: f32) -> i32 {
  return i32(f * fixed_point_multiplier);
}

fn decodeFixedPoint(v: i32) -> f32 {
  return f32(v) / fixed_point_multiplier;
}
`,$t=`
${Ae}

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
`,kt=`
${he}
${pe}
${Gt}
${me}

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
`,Vt=`
${he}
${pe}

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

${lt}
${me}

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
`,qt=`
${Ae}

${lt}
${me}
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
`,Wt=`
${he}
${pe}
${Ae}

struct MouseInteraction {
  point: vec3f,
  radius: f32,
  velocity: vec3f,     // For moving heat sources
  temperature: f32,    // Heat source temperature (0 = no thermal effect)
};

${me}
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
`,Ht=`
${he}
${pe}

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
`;function jt(i,e=R){const t=e.tensileStrength??0,r=e.damageRate??0,n=e.restDensity??R.restDensity,s=e.stiffness??R.stiffness,o=e.dynamicViscosity??R.dynamicViscosity,a=e.dt??R.dt,d=e.fixedPointScale??R.fixedPointScale,f=q(i,$t,"mpm-clear-grid"),h=q(i,kt,"mpm-p2g1"),g=q(i,Vt,"mpm-p2g2"),m=q(i,qt,"mpm-update-grid"),A=q(i,Wt,"mpm-g2p"),c=q(i,Ht,"mpm-copy-position");return{clearGrid:i.createComputePipeline({label:"mpm-clear-grid",layout:"auto",compute:{module:f}}),p2g1:i.createComputePipeline({label:"mpm-p2g1",layout:"auto",compute:{module:h,constants:{fixed_point_multiplier:d}}}),p2g2:i.createComputePipeline({label:"mpm-p2g2",layout:"auto",compute:{module:g,constants:{fixed_point_multiplier:d,stiffness:s,rest_density:n,dynamic_viscosity:o,dt:a,tensile_strength:t,damage_rate:r}}}),updateGrid:i.createComputePipeline({label:"mpm-update-grid",layout:"auto",compute:{module:m,constants:{fixed_point_multiplier:e.fixedPointScale,dt:e.dt,thermal_diffusivity:e.thermalDiffusivity??.1}}}),g2p:i.createComputePipeline({label:"mpm-g2p",layout:"auto",compute:{module:A,constants:{fixed_point_multiplier:e.fixedPointScale,dt:e.dt}}}),copyPosition:i.createComputePipeline({label:"mpm-copy-position",layout:"auto",compute:{module:c}})}}function Kt(i,e,t){const{particleBuffer:r,gridBuffer:n,initBoxBuffer:s,realBoxBuffer:o,interactionBuffer:a,posVelBuffer:d,simUniformBuffer:f}=t,h={clearGrid:i.createBindGroup({layout:e.clearGrid.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n}}]}),p2g1:i.createBindGroup({layout:e.p2g1.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:s}}]}),p2g2:i.createBindGroup({layout:e.p2g2.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:f}}]}),updateGrid:i.createBindGroup({layout:e.updateGrid.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:f}}]}),g2p:i.createBindGroup({layout:e.g2p.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:s}},{binding:4,resource:{buffer:a}}]})};return e.copyPosition&&d&&(h.copyPosition=i.createBindGroup({layout:e.copyPosition.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r}},{binding:1,resource:{buffer:d}}]})),h}function $e(i,e,t){const r=new Float32Array(4);r.set(e.slice(0,3));const n=i.createBuffer({label:t??"vec3-uniform",size:r.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return i.queue.writeBuffer(n,0,r),n}function Qt(i,e,t){const r=new Float32Array(4);r.set(e.slice(0,3)),r[3]=t;const n=i.createBuffer({label:"mpm-sim-uniforms",size:r.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return i.queue.writeBuffer(n,0,r),n}function es(i,e){const{particleCount:t,gridSize:r,posVelBuffer:n,interactionBuffer:s,constants:o,iterations:a}=e;if(!r)throw new Error("gridSize {x,y,z} is required");const d=Math.ceil(r.x)*Math.ceil(r.y)*Math.ceil(r.z),f=Lt(i,t),h=Ft(i,d),g=$e(i,[r.x,r.y,r.z],"mpm-init-box"),m=$e(i,[r.x,r.y,r.z],"mpm-real-box"),A=(o==null?void 0:o.ambientPressure)??R.ambientPressure,c=Qt(i,[0,-.3,0],A);let u=s;if(!u){u=i.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,label:"mpm-interaction-default"});const P=new Float32Array(8);P[3]=-1,i.queue.writeBuffer(u,0,P)}const p=jt(i,o),x=Kt(i,p,{particleBuffer:f,gridBuffer:h,initBoxBuffer:g,realBoxBuffer:m,simUniformBuffer:c,interactionBuffer:u,posVelBuffer:n}),w=new Rt(i,{constants:o,iterations:a});return w.configure({pipelines:p,bindGroups:x}),w.setCounts({particleCount:t,gridCount:d}),{domain:w,pipelines:p,bindGroups:x,buffers:{particleBuffer:f,gridBuffer:h,initBoxBuffer:g,realBoxBuffer:m,simUniformBuffer:c,interactionBuffer:u,posVelBuffer:n},dispatch:{particle:Math.ceil(t/se),grid:Math.ceil(d/se)}}}function ts(i,e,t){const r=t.byteLength??t.length;if(r>e.size)throw new Error(`Particle data (${r}) exceeds buffer size (${e.size})`);i.queue.writeBuffer(e,0,t)}const Xt=()=>[1,0,0,0,0,1,0,0,0,0,1,0],Jt=()=>[0,0,0,0,0,0,0,0,0,0,0,0];function is(i){const{count:e,gridSize:t,start:r=[0,0,0],spacing:n=.65,jitter:s=0,materialType:o=$.LIQUID,mass:a=1,temperature:d=300,phase:f=null,mu:h=null,lambda:g=null,restDensity:m=1,cubeSideCount:A=null}=i;if(!e||!t)throw new Error("count and gridSize are required");let c,u,p;switch(o){case $.BRITTLE_SOLID:c=0,u=L.ice.mu,p=L.ice.lambda;break;case $.ELASTIC_SOLID:c=0,u=L.rubber.mu,p=L.rubber.lambda;break;case $.LIQUID:c=1,u=0,p=L.water.stiffness;break;case $.GAS:c=2,u=0,p=L.steam.gasConstant;break;case $.IRON:c=0,u=L.iron.mu,p=L.iron.lambda;break;case $.GRANULAR:c=0,u=100,p=100;break;default:c=1,u=0,p=50}const x=f!==null?f:c,w=h!==null?h:u,P=g!==null?g:p,T=new ArrayBuffer(at(e));let b=0;const M=A!==null?A:Math.ceil(Math.cbrt(e));for(let I=0;I<M&&b<e;I++)for(let B=0;B<M&&b<e;B++)for(let N=0;N<M&&b<e;N++){const C=Nt(T,b),St=Math.min(r[0]+B*n,t.x-2),Pt=Math.min(r[1]+I*n,t.y-2),Tt=Math.min(r[2]+N*n,t.z-2),It=s?(Math.random()*2-1)*s:0,zt=s?(Math.random()*2-1)*s:0,Ct=s?(Math.random()*2-1)*s:0;C.position.set([St+It,Pt+zt,Tt+Ct]),C.materialType[0]=o,C.velocity.set([0,0,0]),C.phase[0]=x,C.mass[0]=a,C.volume0[0]=a/m,C.temperature[0]=d,C.damage[0]=0,C.F.set(Xt()),C.C.set(Jt()),C.mu[0]=w,C.lambda[0]=P,C.restDensity[0]=m,C.phaseFraction[0]=0,b+=1}if(b<e)throw new Error(`Could not place all particles; placed ${b} of ${e}`);return T}async function Yt(i,e,t){var a;const r=t*fe,n=i.createBuffer({label:"mpm-particle-staging",size:r,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),s=i.createCommandEncoder({label:"mpm-diagnostics-copy"});s.copyBufferToBuffer(e,0,n,0,r),i.queue.submit([s.finish()]),await n.mapAsync(GPUMapMode.READ);const o=n.getMappedRange().slice(0);return n.unmap(),(a=n.destroy)==null||a.call(n),o}async function rs(i,e,t){const r=await Yt(i,e,t),n=v.mass/4,s=v.velocity/4,o=new Float32Array(r);let a=0,d=0,f=0,h=0;for(let g=0;g<t;g+=1){const m=fe/4*g,A=o[m+n],c=o[m+s+0],u=o[m+s+1],p=o[m+s+2];a+=A,d+=A*c,f+=A*u,h+=A*p}return{mass:a,momentum:[d,f,h]}}function Zt(i,e){if(i===e)return!0;if(i.byteLength!==e.byteLength)return!1;for(let t=0;t<i.byteLength;t++)if(i[t]!==e[t])return!1;return!0}function Be(i){if(i instanceof Uint8Array&&i.constructor.name==="Uint8Array")return i;if(i instanceof ArrayBuffer)return new Uint8Array(i);if(ArrayBuffer.isView(i))return new Uint8Array(i.buffer,i.byteOffset,i.byteLength);throw new Error("Unknown type, must be binary type")}function ei(i){return new TextEncoder().encode(i)}function ti(i){return new TextDecoder().decode(i)}function ii(i,e){if(i.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),r=0;r<t.length;r++)t[r]=255;for(var n=0;n<i.length;n++){var s=i.charAt(n),o=s.charCodeAt(0);if(t[o]!==255)throw new TypeError(s+" is ambiguous");t[o]=n}var a=i.length,d=i.charAt(0),f=Math.log(a)/Math.log(256),h=Math.log(256)/Math.log(a);function g(c){if(c instanceof Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var u=0,p=0,x=0,w=c.length;x!==w&&c[x]===0;)x++,u++;for(var P=(w-x)*h+1>>>0,T=new Uint8Array(P);x!==w;){for(var b=c[x],M=0,I=P-1;(b!==0||M<p)&&I!==-1;I--,M++)b+=256*T[I]>>>0,T[I]=b%a>>>0,b=b/a>>>0;if(b!==0)throw new Error("Non-zero carry");p=M,x++}for(var B=P-p;B!==P&&T[B]===0;)B++;for(var N=d.repeat(u);B<P;++B)N+=i.charAt(T[B]);return N}function m(c){if(typeof c!="string")throw new TypeError("Expected String");if(c.length===0)return new Uint8Array;var u=0;if(c[u]!==" "){for(var p=0,x=0;c[u]===d;)p++,u++;for(var w=(c.length-u)*f+1>>>0,P=new Uint8Array(w);c[u];){var T=t[c.charCodeAt(u)];if(T===255)return;for(var b=0,M=w-1;(T!==0||b<x)&&M!==-1;M--,b++)T+=a*P[M]>>>0,P[M]=T%256>>>0,T=T/256>>>0;if(T!==0)throw new Error("Non-zero carry");x=b,u++}if(c[u]!==" "){for(var I=w-x;I!==w&&P[I]===0;)I++;for(var B=new Uint8Array(p+(w-I)),N=p;I!==w;)B[N++]=P[I++];return B}}}function A(c){var u=m(c);if(u)return u;throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:m,decode:A}}var ri=ii,ni=ri;class si{constructor(e,t,r){l(this,"name");l(this,"prefix");l(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class oi{constructor(e,t,r){l(this,"name");l(this,"prefix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=e,this.prefix=t;const n=t.codePointAt(0);if(n===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=n,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return ct(this,e)}}class ai{constructor(e){l(this,"decoders");this.decoders=e}or(e){return ct(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}function ct(i,e){return new ai({...i.decoders??{[i.prefix]:i},...e.decoders??{[e.prefix]:e}})}class li{constructor(e,t,r,n){l(this,"name");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=r,this.baseDecode=n,this.encoder=new si(e,t,r),this.decoder=new oi(e,t,n)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function ge({name:i,prefix:e,encode:t,decode:r}){return new li(i,e,t,r)}function ee({name:i,prefix:e,alphabet:t}){const{encode:r,decode:n}=ni(t,i);return ge({prefix:e,name:i,encode:r,decode:s=>Be(n(s))})}function ci(i,e,t,r){let n=i.length;for(;i[n-1]==="=";)--n;const s=new Uint8Array(n*t/8|0);let o=0,a=0,d=0;for(let f=0;f<n;++f){const h=e[i[f]];if(h===void 0)throw new SyntaxError(`Non-${r} character`);a=a<<t|h,o+=t,o>=8&&(o-=8,s[d++]=255&a>>o)}if(o>=t||255&a<<8-o)throw new SyntaxError("Unexpected end of data");return s}function di(i,e,t){const r=e[e.length-1]==="=",n=(1<<t)-1;let s="",o=0,a=0;for(let d=0;d<i.length;++d)for(a=a<<8|i[d],o+=8;o>t;)o-=t,s+=e[n&a>>o];if(o!==0&&(s+=e[n&a<<t-o]),r)for(;s.length*t&7;)s+="=";return s}function ui(i){const e={};for(let t=0;t<i.length;++t)e[i[t]]=t;return e}function _({name:i,prefix:e,bitsPerChar:t,alphabet:r}){const n=ui(r);return ge({prefix:e,name:i,encode(s){return di(s,r,t)},decode(s){return ci(s,n,t,i)}})}const O=ee({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),fi=ee({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),hi=Object.freeze(Object.defineProperty({__proto__:null,base58btc:O,base58flickr:fi},Symbol.toStringTag,{value:"Module"})),j=_({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),pi=_({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),mi=_({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),gi=_({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),bi=_({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),yi=_({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),_i=_({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),xi=_({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),wi=_({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),vi=Object.freeze(Object.defineProperty({__proto__:null,base32:j,base32hex:bi,base32hexpad:_i,base32hexpadupper:xi,base32hexupper:yi,base32pad:mi,base32padupper:gi,base32upper:pi,base32z:wi},Symbol.toStringTag,{value:"Module"})),ne=ee({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),Ei=ee({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}),Si=Object.freeze(Object.defineProperty({__proto__:null,base36:ne,base36upper:Ei},Symbol.toStringTag,{value:"Module"}));var Pi=dt,ke=128,Ti=-128,Ii=Math.pow(2,31);function dt(i,e,t){e=e||[],t=t||0;for(var r=t;i>=Ii;)e[t++]=i&255|ke,i/=128;for(;i&Ti;)e[t++]=i&255|ke,i>>>=7;return e[t]=i|0,dt.bytes=t-r+1,e}var zi=we,Ci=128,Ve=127;function we(i,r){var t=0,r=r||0,n=0,s=r,o,a=i.length;do{if(s>=a)throw we.bytes=0,new RangeError("Could not decode varint");o=i[s++],t+=n<28?(o&Ve)<<n:(o&Ve)*Math.pow(2,n),n+=7}while(o>=Ci);return we.bytes=s-r,t}var Ai=Math.pow(2,7),Bi=Math.pow(2,14),Di=Math.pow(2,21),Mi=Math.pow(2,28),Ui=Math.pow(2,35),Oi=Math.pow(2,42),Ni=Math.pow(2,49),Li=Math.pow(2,56),Fi=Math.pow(2,63),Ri=function(i){return i<Ai?1:i<Bi?2:i<Di?3:i<Mi?4:i<Ui?5:i<Oi?6:i<Ni?7:i<Li?8:i<Fi?9:10},Gi={encode:Pi,decode:zi,encodingLength:Ri},oe=Gi;function ve(i,e=0){return[oe.decode(i,e),oe.decode.bytes]}function ae(i,e,t=0){return oe.encode(i,e,t),e}function le(i){return oe.encodingLength(i)}function $i(i,e){const t=e.byteLength,r=le(i),n=r+le(t),s=new Uint8Array(n+t);return ae(i,s,0),ae(t,s,r),s.set(e,n),new De(i,t,e,s)}function ki(i){const e=Be(i),[t,r]=ve(e),[n,s]=ve(e.subarray(r)),o=e.subarray(r+s);if(o.byteLength!==n)throw new Error("Incorrect length");return new De(t,n,o,e)}function Vi(i,e){if(i===e)return!0;{const t=e;return i.code===t.code&&i.size===t.size&&t.bytes instanceof Uint8Array&&Zt(i.bytes,t.bytes)}}class De{constructor(e,t,r,n){l(this,"code");l(this,"size");l(this,"digest");l(this,"bytes");this.code=e,this.size=t,this.digest=r,this.bytes=n}}function qe(i,e){const{bytes:t,version:r}=i;switch(r){case 0:return Wi(t,Ee(i),e??O.encoder);default:return Hi(t,Ee(i),e??j.encoder)}}const We=new WeakMap;function Ee(i){const e=We.get(i);if(e==null){const t=new Map;return We.set(i,t),t}return e}var nt;class y{constructor(e,t,r,n){l(this,"code");l(this,"version");l(this,"multihash");l(this,"bytes");l(this,"/");l(this,nt,"CID");this.code=t,this.version=e,this.multihash=r,this.bytes=n,this["/"]=n}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==Q)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==ji)throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");return y.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,r=$i(e,t);return y.createV1(this.code,r)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`)}}equals(e){return y.equals(this,e)}static equals(e,t){const r=t;return r!=null&&e.code===r.code&&e.version===r.version&&Vi(e.multihash,r.multihash)}toString(e){return qe(this,e)}toJSON(){return{"/":qe(this)}}link(){return this}[(nt=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof y)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===t){const{version:r,code:n,multihash:s,bytes:o}=t;return new y(r,n,s,o??He(r,n,s.bytes))}else if(t[Ki]===!0){const{version:r,multihash:n,code:s}=t,o=ki(n);return y.create(r,s,o)}else return null}static create(e,t,r){if(typeof t!="number")throw new Error("String codecs are no longer supported");if(!(r.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{if(t!==Q)throw new Error(`Version 0 CID must use dag-pb (code: ${Q}) block encoding`);return new y(e,t,r,r.bytes)}case 1:{const n=He(e,t,r.bytes);return new y(e,t,r,n)}default:throw new Error("Invalid version")}}static createV0(e){return y.create(0,Q,e)}static createV1(e,t){return y.create(1,e,t)}static decode(e){const[t,r]=y.decodeFirst(e);if(r.length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=y.inspectBytes(e),r=t.size-t.multihashSize,n=Be(e.subarray(r,r+t.multihashSize));if(n.byteLength!==t.multihashSize)throw new Error("Incorrect length");const s=n.subarray(t.multihashSize-t.digestSize),o=new De(t.multihashCode,t.digestSize,s,n);return[t.version===0?y.createV0(o):y.createV1(t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const r=()=>{const[g,m]=ve(e.subarray(t));return t+=m,g};let n=r(),s=Q;if(n===18?(n=0,t=0):s=r(),n!==0&&n!==1)throw new RangeError(`Invalid CID version ${n}`);const o=t,a=r(),d=r(),f=t+d,h=f-o;return{version:n,codec:s,multihashCode:a,digestSize:d,multihashSize:h,size:f}}static parse(e,t){const[r,n]=qi(e,t),s=y.decode(n);if(s.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Ee(s).set(r,e),s}}function qi(i,e){switch(i[0]){case"Q":{const t=e??O;return[O.prefix,t.decode(`${O.prefix}${i}`)]}case O.prefix:{const t=e??O;return[O.prefix,t.decode(i)]}case j.prefix:{const t=e??j;return[j.prefix,t.decode(i)]}case ne.prefix:{const t=e??ne;return[ne.prefix,t.decode(i)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");return[i[0],e.decode(i)]}}}function Wi(i,e,t){const{prefix:r}=t;if(r!==O.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const n=e.get(r);if(n==null){const s=t.encode(i).slice(1);return e.set(r,s),s}else return n}function Hi(i,e,t){const{prefix:r}=t,n=e.get(r);if(n==null){const s=t.encode(i);return e.set(r,s),s}else return n}const Q=112,ji=18;function He(i,e,t){const r=le(i),n=r+le(e),s=new Uint8Array(n+t.byteLength);return ae(i,s,0),ae(e,s,r),s.set(t,n),s}const Ki=Symbol.for("@ipld/js-cid/CID");function Se(i=0){return new Uint8Array(i)}function Z(i=0){return new Uint8Array(i)}function ut(i,e){e==null&&(e=i.reduce((n,s)=>n+s.length,0));const t=Z(e);let r=0;for(const n of i)t.set(n,r),r+=n.length;return t}const Qi=ee({prefix:"9",name:"base10",alphabet:"0123456789"}),Xi=Object.freeze(Object.defineProperty({__proto__:null,base10:Qi},Symbol.toStringTag,{value:"Module"})),Ji=_({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),Yi=_({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),Zi=Object.freeze(Object.defineProperty({__proto__:null,base16:Ji,base16upper:Yi},Symbol.toStringTag,{value:"Module"})),er=_({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),tr=Object.freeze(Object.defineProperty({__proto__:null,base2:er},Symbol.toStringTag,{value:"Module"})),ft=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),ir=ft.reduce((i,e,t)=>(i[t]=e,i),[]),rr=ft.reduce((i,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${e}`);return i[r]=t,i},[]);function nr(i){return i.reduce((e,t)=>(e+=ir[t],e),"")}function sr(i){const e=[];for(const t of i){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const n=rr[r];if(n==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(n)}return new Uint8Array(e)}const or=ge({prefix:"🚀",name:"base256emoji",encode:nr,decode:sr}),ar=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:or},Symbol.toStringTag,{value:"Module"})),lr=_({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),cr=_({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),ht=_({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),dr=_({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),ur=Object.freeze(Object.defineProperty({__proto__:null,base64:lr,base64pad:cr,base64url:ht,base64urlpad:dr},Symbol.toStringTag,{value:"Module"})),fr=_({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),hr=Object.freeze(Object.defineProperty({__proto__:null,base8:fr},Symbol.toStringTag,{value:"Module"})),pr=ge({prefix:"\0",name:"identity",encode:i=>ti(i),decode:i=>ei(i)}),mr=Object.freeze(Object.defineProperty({__proto__:null,identity:pr},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const Pe={...mr,...tr,...hr,...Xi,...Zi,...vi,...Si,...hi,...ur,...ar};function pt(i,e,t,r){return{name:i,prefix:e,encoder:{name:i,prefix:e,encode:t},decoder:{decode:r}}}const je=pt("utf8","u",i=>"u"+new TextDecoder("utf8").decode(i),i=>new TextEncoder().encode(i.substring(1))),be=pt("ascii","a",i=>{let e="a";for(let t=0;t<i.length;t++)e+=String.fromCharCode(i[t]);return e},i=>{i=i.substring(1);const e=Z(i.length);for(let t=0;t<i.length;t++)e[t]=i.charCodeAt(t);return e}),mt={utf8:je,"utf-8":je,hex:Pe.base16,latin1:be,ascii:be,binary:be,...Pe};function Me(i,e="utf8"){const t=mt[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${i}`)}function ce(i,e="utf8"){const t=mt[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(i).substring(1)}const gr=Math.pow(2,7),br=Math.pow(2,14),yr=Math.pow(2,21),gt=Math.pow(2,28),bt=Math.pow(2,35),yt=Math.pow(2,42),_t=Math.pow(2,49),z=128,F=127;function Ue(i){if(i<gr)return 1;if(i<br)return 2;if(i<yr)return 3;if(i<gt)return 4;if(i<bt)return 5;if(i<yt)return 6;if(i<_t)return 7;if(Number.MAX_SAFE_INTEGER!=null&&i>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function _r(i,e,t=0){switch(Ue(i)){case 8:e[t++]=i&255|z,i/=128;case 7:e[t++]=i&255|z,i/=128;case 6:e[t++]=i&255|z,i/=128;case 5:e[t++]=i&255|z,i/=128;case 4:e[t++]=i&255|z,i>>>=7;case 3:e[t++]=i&255|z,i>>>=7;case 2:e[t++]=i&255|z,i>>>=7;case 1:{e[t++]=i&255,i>>>=7;break}default:throw new Error("unreachable")}return e}function xr(i,e){let t=i[e],r=0;if(r+=t&F,t<z||(t=i[e+1],r+=(t&F)<<7,t<z)||(t=i[e+2],r+=(t&F)<<14,t<z)||(t=i[e+3],r+=(t&F)<<21,t<z)||(t=i[e+4],r+=(t&F)*gt,t<z)||(t=i[e+5],r+=(t&F)*bt,t<z)||(t=i[e+6],r+=(t&F)*yt,t<z)||(t=i[e+7],r+=(t&F)*_t,t<z))return r;throw new RangeError("Could not decode varint")}const Oe=new Float32Array([-0]),G=new Uint8Array(Oe.buffer);function wr(i,e,t){Oe[0]=i,e[t]=G[0],e[t+1]=G[1],e[t+2]=G[2],e[t+3]=G[3]}function vr(i,e){return G[0]=i[e],G[1]=i[e+1],G[2]=i[e+2],G[3]=i[e+3],Oe[0]}const Ne=new Float64Array([-0]),E=new Uint8Array(Ne.buffer);function Er(i,e,t){Ne[0]=i,e[t]=E[0],e[t+1]=E[1],e[t+2]=E[2],e[t+3]=E[3],e[t+4]=E[4],e[t+5]=E[5],e[t+6]=E[6],e[t+7]=E[7]}function Sr(i,e){return E[0]=i[e],E[1]=i[e+1],E[2]=i[e+2],E[3]=i[e+3],E[4]=i[e+4],E[5]=i[e+5],E[6]=i[e+6],E[7]=i[e+7],Ne[0]}const Pr=BigInt(Number.MAX_SAFE_INTEGER),Tr=BigInt(Number.MIN_SAFE_INTEGER);class S{constructor(e,t){l(this,"lo");l(this,"hi");this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(t+r*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(BigInt(t)+(BigInt(r)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;return r===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:r<128?9:10}static fromBigInt(e){if(e===0n)return k;if(e<Pr&&e>Tr)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let r=e>>32n,n=e-(r<<32n);return t&&(r=~r|0n,n=~n|0n,++n>Ke&&(n=0n,++r>Ke&&(r=0n))),new S(Number(n),Number(r))}static fromNumber(e){if(e===0)return k;const t=e<0;t&&(e=-e);let r=e>>>0,n=(e-r)/4294967296>>>0;return t&&(n=~n>>>0,r=~r>>>0,++r>4294967295&&(r=0,++n>4294967295&&(n=0))),new S(r,n)}static from(e){return typeof e=="number"?S.fromNumber(e):typeof e=="bigint"?S.fromBigInt(e):typeof e=="string"?S.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new S(e.low>>>0,e.high>>>0):k}}const k=new S(0,0);k.toBigInt=function(){return 0n};k.zzEncode=k.zzDecode=function(){return this};k.length=function(){return 1};const Ke=4294967296n;function Ir(i){let e=0,t=0;for(let r=0;r<i.length;++r)t=i.charCodeAt(r),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(i.charCodeAt(r+1)&64512)===56320?(++r,e+=4):e+=3;return e}function zr(i,e,t){if(t-e<1)return"";let n;const s=[];let o=0,a;for(;e<t;)a=i[e++],a<128?s[o++]=a:a>191&&a<224?s[o++]=(a&31)<<6|i[e++]&63:a>239&&a<365?(a=((a&7)<<18|(i[e++]&63)<<12|(i[e++]&63)<<6|i[e++]&63)-65536,s[o++]=55296+(a>>10),s[o++]=56320+(a&1023)):s[o++]=(a&15)<<12|(i[e++]&63)<<6|i[e++]&63,o>8191&&((n??(n=[])).push(String.fromCharCode.apply(String,s)),o=0);return n!=null?(o>0&&n.push(String.fromCharCode.apply(String,s.slice(0,o))),n.join("")):String.fromCharCode.apply(String,s.slice(0,o))}function xt(i,e,t){const r=t;let n,s;for(let o=0;o<i.length;++o)n=i.charCodeAt(o),n<128?e[t++]=n:n<2048?(e[t++]=n>>6|192,e[t++]=n&63|128):(n&64512)===55296&&((s=i.charCodeAt(o+1))&64512)===56320?(n=65536+((n&1023)<<10)+(s&1023),++o,e[t++]=n>>18|240,e[t++]=n>>12&63|128,e[t++]=n>>6&63|128,e[t++]=n&63|128):(e[t++]=n>>12|224,e[t++]=n>>6&63|128,e[t++]=n&63|128);return t-r}function U(i,e){return RangeError(`index out of range: ${i.pos} + ${e??1} > ${i.len}`)}function te(i,e){return(i[e-4]|i[e-3]<<8|i[e-2]<<16|i[e-1]<<24)>>>0}class Cr{constructor(e){l(this,"buf");l(this,"pos");l(this,"len");l(this,"_slice",Uint8Array.prototype.subarray);this.buf=e,this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,U(this,10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw U(this,4);return te(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw U(this,4);return te(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw U(this,4);const e=vr(this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)throw U(this,4);const e=Sr(this.buf,this.pos);return this.pos+=8,e}bytes(){const e=this.uint32(),t=this.pos,r=this.pos+e;if(r>this.len)throw U(this,e);return this.pos+=e,t===r?new Uint8Array(0):this.buf.subarray(t,r)}string(){const e=this.bytes();return zr(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+e>this.len)throw U(this,e);this.pos+=e}else do if(this.pos>=this.len)throw U(this);while(this.buf[this.pos++]&128);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new S(0,0);let t=0;if(this.len-this.pos>4){for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){if(this.pos>=this.len)throw U(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw U(this);if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.len)throw U(this,8);const e=te(this.buf,this.pos+=4),t=te(this.buf,this.pos+=4);return new S(e,t)}int64(){return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=xr(this.buf,this.pos);return this.pos+=Ue(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){return this.readFixed64().toString()}}function Ar(i){return new Cr(i instanceof Uint8Array?i:i.subarray())}function Le(i,e,t){const r=Ar(i);return e.decode(r,void 0,t)}function Br(i){let r,n=8192;return function(o){if(o<1||o>4096)return Z(o);n+o>8192&&(r=Z(8192),n=0);const a=r.subarray(n,n+=o);return n&7&&(n=(n|7)+1),a}}class J{constructor(e,t,r){l(this,"fn");l(this,"len");l(this,"next");l(this,"val");this.fn=e,this.len=t,this.next=void 0,this.val=r}}function ye(){}class Dr{constructor(e){l(this,"head");l(this,"tail");l(this,"len");l(this,"next");this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const Mr=Br();function Ur(i){return globalThis.Buffer!=null?Z(i):Mr(i)}class Te{constructor(){l(this,"len");l(this,"head");l(this,"tail");l(this,"states");this.len=0,this.head=new J(ye,0,0),this.tail=this.head,this.states=null}_push(e,t,r){return this.tail=this.tail.next=new J(e,t,r),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.tail.next=new Nr((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(ie,10,S.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=S.fromBigInt(e);return this._push(ie,t.length(),t)}uint64Number(e){return this._push(_r,Ue(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=S.fromBigInt(e).zzEncode();return this._push(ie,t.length(),t)}sint64Number(e){const t=S.fromNumber(e).zzEncode();return this._push(ie,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(_e,1,e?1:0)}fixed32(e){return this._push(X,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=S.fromBigInt(e);return this._push(X,4,t.lo)._push(X,4,t.hi)}fixed64Number(e){const t=S.fromNumber(e);return this._push(X,4,t.lo)._push(X,4,t.hi)}fixed64String(e){return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.fixed64String(e)}float(e){return this._push(wr,4,e)}double(e){return this._push(Er,8,e)}bytes(e){const t=e.length>>>0;return t===0?this._push(_e,1,0):this.uint32(t)._push(Lr,t,e)}string(e){const t=Ir(e);return t!==0?this.uint32(t)._push(xt,t,e):this._push(_e,1,0)}fork(){return this.states=new Dr(this),this.head=this.tail=new J(ye,0,0),this.len=0,this}reset(){return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new J(ye,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,r=this.len;return this.reset().uint32(r),r!==0&&(this.tail.next=e.next,this.tail=t,this.len+=r),this}finish(){let e=this.head.next;const t=Ur(this.len);let r=0;for(;e!=null;)e.fn(e.val,t,r),r+=e.len,e=e.next;return t}}function _e(i,e,t){e[t]=i&255}function Or(i,e,t){for(;i>127;)e[t++]=i&127|128,i>>>=7;e[t]=i}class Nr extends J{constructor(t,r){super(Or,t,r);l(this,"next");this.next=void 0}}function ie(i,e,t){for(;i.hi!==0;)e[t++]=i.lo&127|128,i.lo=(i.lo>>>7|i.hi<<25)>>>0,i.hi>>>=7;for(;i.lo>127;)e[t++]=i.lo&127|128,i.lo=i.lo>>>7;e[t++]=i.lo}function X(i,e,t){e[t]=i&255,e[t+1]=i>>>8&255,e[t+2]=i>>>16&255,e[t+3]=i>>>24}function Lr(i,e,t){e.set(i,t)}globalThis.Buffer!=null&&(Te.prototype.bytes=function(i){const e=i.length>>>0;return this.uint32(e),e>0&&this._push(Fr,e,i),this},Te.prototype.string=function(i){const e=globalThis.Buffer.byteLength(i);return this.uint32(e),e>0&&this._push(Rr,e,i),this});function Fr(i,e,t){e.set(i,t)}function Rr(i,e,t){i.length<40?xt(i,e,t):e.utf8Write!=null?e.utf8Write(i,t):e.set(Me(i),t)}function Gr(){return new Te}function Fe(i,e){const t=Gr();return e.encode(i,t,{lengthDelimited:!1}),t.finish()}var Ie;(function(i){i[i.VARINT=0]="VARINT",i[i.BIT64=1]="BIT64",i[i.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",i[i.START_GROUP=3]="START_GROUP",i[i.END_GROUP=4]="END_GROUP",i[i.BIT32=5]="BIT32"})(Ie||(Ie={}));function $r(i,e,t,r){return{name:i,type:e,encode:t,decode:r}}function Re(i,e){return $r("message",Ie.LENGTH_DELIMITED,i,e)}class ze extends Error{constructor(){super(...arguments);l(this,"code","ERR_MAX_LENGTH");l(this,"name","MaxLengthError")}}class kr{constructor(){l(this,"index",0);l(this,"input","")}new(e){return this.index=0,this.input=e,this}readAtomically(e){const t=this.index,r=e();return r===void 0&&(this.index=t),r}parseWith(e){const t=e();if(this.index===this.input.length)return t}peekChar(){if(!(this.index>=this.input.length))return this.input[this.index]}readChar(){if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(e){return this.readAtomically(()=>{const t=this.readChar();if(t===e)return t})}readSeparator(e,t,r){return this.readAtomically(()=>{if(!(t>0&&this.readGivenChar(e)===void 0))return r()})}readNumber(e,t,r,n){return this.readAtomically(()=>{let s=0,o=0;const a=this.peekChar();if(a===void 0)return;const d=a==="0",f=2**(8*n)-1;for(;;){const h=this.readAtomically(()=>{const g=this.readChar();if(g===void 0)return;const m=Number.parseInt(g,e);if(!Number.isNaN(m))return m});if(h===void 0)break;if(s*=e,s+=h,s>f||(o+=1,t!==void 0&&o>t))return}if(o!==0)return!r&&d&&o>1?void 0:s})}readIPv4Addr(){return this.readAtomically(()=>{const e=new Uint8Array(4);for(let t=0;t<e.length;t++){const r=this.readSeparator(".",t,()=>this.readNumber(10,3,!1,1));if(r===void 0)return;e[t]=r}return e})}readIPv6Addr(){const e=t=>{for(let r=0;r<t.length/2;r++){const n=r*2;if(r<t.length-3){const o=this.readSeparator(":",r,()=>this.readIPv4Addr());if(o!==void 0)return t[n]=o[0],t[n+1]=o[1],t[n+2]=o[2],t[n+3]=o[3],[n+4,!0]}const s=this.readSeparator(":",r,()=>this.readNumber(16,4,!0,2));if(s===void 0)return[n,!1];t[n]=s>>8,t[n+1]=s&255}return[t.length,!1]};return this.readAtomically(()=>{const t=new Uint8Array(16),[r,n]=e(t);if(r===16)return t;if(n||this.readGivenChar(":")===void 0||this.readGivenChar(":")===void 0)return;const s=new Uint8Array(14),o=16-(r+2),[a]=e(s.subarray(0,o));return t.set(s.subarray(0,a),16-a),t})}readIPAddr(){return this.readIPv4Addr()??this.readIPv6Addr()}}const Vr=45,qr=15,de=new kr;function Wr(i){if(!(i.length>qr))return de.new(i).parseWith(()=>de.readIPv4Addr())}function Hr(i){if(i.includes("%")&&(i=i.split("%")[0]),!(i.length>Vr))return de.new(i).parseWith(()=>de.readIPv6Addr())}function wt(i){return!!Wr(i)}function jr(i){return!!Hr(i)}class V extends Error{constructor(){super(...arguments);l(this,"name","InvalidMultiaddrError")}}l(V,"name","InvalidMultiaddrError");class K extends Error{constructor(){super(...arguments);l(this,"name","ValidationError")}}l(K,"name","ValidationError");class vt extends Error{constructor(){super(...arguments);l(this,"name","UnknownProtocolError")}}l(vt,"name","UnknownProtocolError");const Kr=4,Qr=6,Xr=273,Jr=33,Yr=41,Zr=42,en=43,tn=53,rn=54,nn=55,sn=56,on=132,an=301,ln=302,cn=400,dn=421,un=444,fn=445,hn=446,pn=447,mn=448,gn=449,bn=454,yn=460,_n=461,xn=465,wn=466,vn=480,En=481,Sn=443,Pn=477,Tn=478,In=479,zn=277,Cn=275,An=276,Bn=280,Dn=281,Mn=290,Un=777;function Qe(i){return e=>ce(e,i)}function Xe(i){return e=>Me(e,i)}function Y(i){return new DataView(i.buffer).getUint16(i.byteOffset).toString()}function H(i){const e=new ArrayBuffer(2);return new DataView(e).setUint16(0,typeof i=="string"?parseInt(i):i),new Uint8Array(e)}function On(i){const e=i.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==16)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion address.`);const t=Me(e[0],"base32"),r=parseInt(e[1],10);if(r<1||r>65536)throw new Error("Port number is not in range(1, 65536)");const n=H(r);return ut([t,n],t.length+n.length)}function Nn(i){const e=i.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==56)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion3 address.`);const t=j.decode(`b${e[0]}`),r=parseInt(e[1],10);if(r<1||r>65536)throw new Error("Port number is not in range(1, 65536)");const n=H(r);return ut([t,n],t.length+n.length)}function Je(i){const e=i.subarray(0,i.length-2),t=i.subarray(i.length-2),r=ce(e,"base32"),n=Y(t);return`${r}:${n}`}const Et=function(i){i=i.toString().trim();const e=new Uint8Array(4);return i.split(/\./g).forEach((t,r)=>{const n=parseInt(t,10);if(isNaN(n)||n<0||n>255)throw new V("Invalid byte value in IP address");e[r]=n}),e},Ln=function(i){let e=0;i=i.toString().trim();const t=i.split(":",8);let r;for(r=0;r<t.length;r++){const s=wt(t[r]);let o;s&&(o=Et(t[r]),t[r]=ce(o.subarray(0,2),"base16")),o!=null&&++r<8&&t.splice(r,0,ce(o.subarray(2,4),"base16"))}if(t[0]==="")for(;t.length<8;)t.unshift("0");else if(t[t.length-1]==="")for(;t.length<8;)t.push("0");else if(t.length<8){for(r=0;r<t.length&&t[r]!=="";r++);const s=[r,1];for(r=9-t.length;r>0;r--)s.push("0");t.splice.apply(t,s)}const n=new Uint8Array(e+16);for(r=0;r<t.length;r++){t[r]===""&&(t[r]="0");const s=parseInt(t[r],16);if(isNaN(s)||s<0||s>65535)throw new V("Invalid byte value in IP address");n[e++]=s>>8&255,n[e++]=s&255}return n},Fn=function(i){if(i.byteLength!==4)throw new V("IPv4 address was incorrect length");const e=[];for(let t=0;t<i.byteLength;t++)e.push(i[t]);return e.join(".")},Rn=function(i){if(i.byteLength!==16)throw new V("IPv6 address was incorrect length");const e=[];for(let r=0;r<i.byteLength;r+=2){const n=i[r],s=i[r+1],o=`${n.toString(16).padStart(2,"0")}${s.toString(16).padStart(2,"0")}`;e.push(o)}const t=e.join(":");try{const r=new URL(`http://[${t}]`);return r.hostname.substring(1,r.hostname.length-1)}catch{throw new V(`Invalid IPv6 address "${t}"`)}};function Gn(i){try{const e=new URL(`http://[${i}]`);return e.hostname.substring(1,e.hostname.length-1)}catch{throw new V(`Invalid IPv6 address "${i}"`)}}const xe=Object.values(Pe).map(i=>i.decoder),$n=function(){let i=xe[0].or(xe[1]);return xe.slice(2).forEach(e=>i=i.or(e)),i}();function kn(i){return $n.decode(i)}function Vn(i){return e=>i.encoder.encode(e)}function qn(i){if(parseInt(i).toString()!==i)throw new K("Value must be an integer")}function Wn(i){if(i<0)throw new K("Value must be a positive integer, or zero")}function Hn(i){return e=>{if(e>i)throw new K(`Value must be smaller than or equal to ${i}`)}}function jn(...i){return e=>{for(const t of i)t(e)}}const re=jn(qn,Wn,Hn(65535)),D=-1;class Kn{constructor(){l(this,"protocolsByCode",new Map);l(this,"protocolsByName",new Map)}getProtocol(e){let t;if(typeof e=="string"?t=this.protocolsByName.get(e):t=this.protocolsByCode.get(e),t==null)throw new vt(`Protocol ${e} was unknown`);return t}addProtocol(e){var t;this.protocolsByCode.set(e.code,e),this.protocolsByName.set(e.name,e),(t=e.aliases)==null||t.forEach(r=>{this.protocolsByName.set(r,e)})}removeProtocol(e){var r;const t=this.protocolsByCode.get(e);t!=null&&(this.protocolsByCode.delete(t.code),this.protocolsByName.delete(t.name),(r=t.aliases)==null||r.forEach(n=>{this.protocolsByName.delete(n)}))}}const Qn=new Kn,Xn=[{code:Kr,name:"ip4",size:32,valueToBytes:Et,bytesToValue:Fn,validate:i=>{if(!wt(i))throw new K(`Invalid IPv4 address "${i}"`)}},{code:Qr,name:"tcp",size:16,valueToBytes:H,bytesToValue:Y,validate:re},{code:Xr,name:"udp",size:16,valueToBytes:H,bytesToValue:Y,validate:re},{code:Jr,name:"dccp",size:16,valueToBytes:H,bytesToValue:Y,validate:re},{code:Yr,name:"ip6",size:128,valueToBytes:Ln,bytesToValue:Rn,stringToValue:Gn,validate:i=>{if(!jr(i))throw new K(`Invalid IPv6 address "${i}"`)}},{code:Zr,name:"ip6zone",size:D},{code:en,name:"ipcidr",size:8,bytesToValue:Qe("base10"),valueToBytes:Xe("base10")},{code:tn,name:"dns",size:D},{code:rn,name:"dns4",size:D},{code:nn,name:"dns6",size:D},{code:sn,name:"dnsaddr",size:D},{code:on,name:"sctp",size:16,valueToBytes:H,bytesToValue:Y,validate:re},{code:an,name:"udt"},{code:ln,name:"utp"},{code:cn,name:"unix",size:D,stringToValue:i=>decodeURIComponent(i),valueToString:i=>encodeURIComponent(i)},{code:dn,name:"p2p",aliases:["ipfs"],size:D,bytesToValue:Qe("base58btc"),valueToBytes:i=>i.startsWith("Q")||i.startsWith("1")?Xe("base58btc")(i):y.parse(i).multihash.bytes},{code:un,name:"onion",size:96,bytesToValue:Je,valueToBytes:On},{code:fn,name:"onion3",size:296,bytesToValue:Je,valueToBytes:Nn},{code:hn,name:"garlic64",size:D},{code:pn,name:"garlic32",size:D},{code:mn,name:"tls"},{code:gn,name:"sni",size:D},{code:bn,name:"noise"},{code:yn,name:"quic"},{code:_n,name:"quic-v1"},{code:xn,name:"webtransport"},{code:wn,name:"certhash",size:D,bytesToValue:Vn(ht),valueToBytes:kn},{code:vn,name:"http"},{code:En,name:"http-path",size:D,stringToValue:i=>`/${decodeURIComponent(i)}`,valueToString:i=>encodeURIComponent(i.substring(1))},{code:Sn,name:"https"},{code:Pn,name:"ws"},{code:Tn,name:"wss"},{code:In,name:"p2p-websocket-star"},{code:zn,name:"p2p-stardust"},{code:Cn,name:"p2p-webrtc-star"},{code:An,name:"p2p-webrtc-direct"},{code:Bn,name:"webrtc-direct"},{code:Dn,name:"webrtc"},{code:Mn,name:"p2p-circuit"},{code:Un,name:"memory",size:D}];Xn.forEach(i=>{Qn.addProtocol(i)});var st,ot;(ot=(st=globalThis.process)==null?void 0:st.env)!=null&&ot.DUMP_SESSION_KEYS;var ue;(function(i){let e;i.codec=()=>(e==null&&(e=Re((t,r,n={})=>{if(n.lengthDelimited!==!1&&r.fork(),t.webtransportCerthashes!=null)for(const s of t.webtransportCerthashes)r.uint32(10),r.bytes(s);if(t.streamMuxers!=null)for(const s of t.streamMuxers)r.uint32(18),r.string(s);n.lengthDelimited!==!1&&r.ldelim()},(t,r,n={})=>{var a,d;const s={webtransportCerthashes:[],streamMuxers:[]},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const f=t.uint32();switch(f>>>3){case 1:{if(((a=n.limits)==null?void 0:a.webtransportCerthashes)!=null&&s.webtransportCerthashes.length===n.limits.webtransportCerthashes)throw new ze('Decode error - map field "webtransportCerthashes" had too many elements');s.webtransportCerthashes.push(t.bytes());break}case 2:{if(((d=n.limits)==null?void 0:d.streamMuxers)!=null&&s.streamMuxers.length===n.limits.streamMuxers)throw new ze('Decode error - map field "streamMuxers" had too many elements');s.streamMuxers.push(t.string());break}default:{t.skipType(f&7);break}}}return s})),e),i.encode=t=>Fe(t,i.codec()),i.decode=(t,r)=>Le(t,i.codec(),r)})(ue||(ue={}));var Ye;(function(i){let e;i.codec=()=>(e==null&&(e=Re((t,r,n={})=>{n.lengthDelimited!==!1&&r.fork(),t.identityKey!=null&&t.identityKey.byteLength>0&&(r.uint32(10),r.bytes(t.identityKey)),t.identitySig!=null&&t.identitySig.byteLength>0&&(r.uint32(18),r.bytes(t.identitySig)),t.extensions!=null&&(r.uint32(34),ue.codec().encode(t.extensions,r)),n.lengthDelimited!==!1&&r.ldelim()},(t,r,n={})=>{var a;const s={identityKey:Se(0),identitySig:Se(0)},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const d=t.uint32();switch(d>>>3){case 1:{s.identityKey=t.bytes();break}case 2:{s.identitySig=t.bytes();break}case 4:{s.extensions=ue.codec().decode(t,t.uint32(),{limits:(a=n.limits)==null?void 0:a.extensions});break}default:{t.skipType(d&7);break}}}return s})),e),i.encode=t=>Fe(t,i.codec()),i.decode=(t,r)=>Le(t,i.codec(),r)})(Ye||(Ye={}));var Ze;(function(i){i[i.Data=0]="Data",i[i.WindowUpdate=1]="WindowUpdate",i[i.Ping=2]="Ping",i[i.GoAway=3]="GoAway"})(Ze||(Ze={}));var Ce;(function(i){i[i.SYN=1]="SYN",i[i.ACK=2]="ACK",i[i.FIN=4]="FIN",i[i.RST=8]="RST"})(Ce||(Ce={}));Object.values(Ce).filter(i=>typeof i!="string");var et;(function(i){i[i.NormalTermination=0]="NormalTermination",i[i.ProtocolError=1]="ProtocolError",i[i.InternalError=2]="InternalError"})(et||(et={}));var tt;(function(i){i[i.Init=0]="Init",i[i.SYNSent=1]="SYNSent",i[i.SYNReceived=2]="SYNReceived",i[i.Established=3]="Established",i[i.Finished=4]="Finished",i[i.Paused=5]="Paused"})(tt||(tt={}));var it;(function(i){let e;i.codec=()=>(e==null&&(e=Re((t,r,n={})=>{if(n.lengthDelimited!==!1&&r.fork(),t.publicKey!=null&&t.publicKey.byteLength>0&&(r.uint32(10),r.bytes(t.publicKey)),t.addrs!=null)for(const s of t.addrs)r.uint32(18),r.bytes(s);n.lengthDelimited!==!1&&r.ldelim()},(t,r,n={})=>{var a;const s={publicKey:Se(0),addrs:[]},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const d=t.uint32();switch(d>>>3){case 1:{s.publicKey=t.bytes();break}case 2:{if(((a=n.limits)==null?void 0:a.addrs)!=null&&s.addrs.length===n.limits.addrs)throw new ze('Decode error - map field "addrs" had too many elements');s.addrs.push(t.bytes());break}default:{t.skipType(d&7);break}}}return s})),e),i.encode=t=>Fe(t,i.codec()),i.decode=(t,r)=>Le(t,i.codec(),r)})(it||(it={}));new TextEncoder;new TextDecoder;class Jn{constructor(e={}){this.frameBudgetMs=e.frameBudgetMs??4,this.hotStore=e.hotStore||new Map,this.device=null,this.tasks=new Map}async initialize(e={}){if(e.device)return this.device=e.device,this.device;if(typeof navigator>"u"||!navigator.gpu)throw new Error("[GPUHubManager] WebGPU not available in this environment");const t=await navigator.gpu.requestAdapter(e.adapterOptions);if(!t)throw new Error("[GPUHubManager] Failed to acquire GPU adapter");return this.device=await t.requestDevice(e.deviceDescriptor),this.device}setDevice(e){this.device=e}getHotStore(){return this.hotStore}registerHotBuffer(e,t){this.hotStore.set(e,t)}registerHotBufferSet(e,t){this.hotStore.set(e,t)}getHotBufferSet(e){return this.hotStore.get(e)}getHotBuffer(e){return this.hotStore.get(e)}createHotBuffer(e,t,r,n){if(!this.device)throw new Error("[GPUHubManager] Device not initialized");const s=this.device.createBuffer({size:t,usage:r,label:n});return this.hotStore.set(e,s),s}removeHotBuffer(e){this.hotStore.delete(e)}registerTask(e,t){this.tasks.set(e,t)}unregisterTask(e){this.tasks.delete(e)}tick(){}}let W=null,rt=null;async function ns(){if(W)return W;try{return rt=new Jn({frameBudgetMs:6}),W=await rt.initialize(),W}catch(i){console.warn("[webgpuphys] GPU hub unavailable, falling back to local WebGPU init",i);const{device:e}=await Dt();return W=e,W}}export{fe as M,rs as a,is as c,ns as g,es as s,ts as u};
