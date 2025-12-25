var Wt=Object.defineProperty;var Ht=(t,e,r)=>e in t?Wt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var c=(t,e,r)=>Ht(t,typeof e!="symbol"?e+"":e,r);import{d as j,i as jt}from"./device-CAsdAK37.js";const k={BRITTLE_SOLID:0,ELASTIC_SOLID:1,LIQUID:2,GAS:3,GRANULAR:4,IRON:5},we=160,v={position:0,materialType:12,velocity:16,phase:28,mass:32,volume0:36,temperature:40,damage:44,F:48,C:96,mu:144,lambda:148,restDensity:152,phaseFraction:156},Kt=32,he=64,Qt=1e5,R={ice:{mu:50,lambda:50},water:{stiffness:50},steam:{gasConstant:5},rubber:{mu:5,lambda:20},iron:{mu:200,lambda:300}},F={stiffness:50,restDensity:1,dynamicViscosity:.1,dt:.1,subSteps:4,fixedPointScale:Qt,tensileStrength:10,damageRate:2,thermalDiffusivity:.05,ambientPressure:1};function Et(t){return t*we}function Xt(t){return t*Kt}function Jt(t,e=0){const r=e*we;return{position:new Float32Array(t,r+v.position,3),materialType:new Uint32Array(t,r+v.materialType,1),velocity:new Float32Array(t,r+v.velocity,3),phase:new Uint32Array(t,r+v.phase,1),mass:new Float32Array(t,r+v.mass,1),volume0:new Float32Array(t,r+v.volume0,1),temperature:new Float32Array(t,r+v.temperature,1),damage:new Float32Array(t,r+v.damage,1),F:new Float32Array(t,r+v.F,12),C:new Float32Array(t,r+v.C,12),mu:new Float32Array(t,r+v.mu,1),lambda:new Float32Array(t,r+v.lambda,1),restDensity:new Float32Array(t,r+v.restDensity,1),phaseFraction:new Float32Array(t,r+v.phaseFraction,1)}}function Yt(t,e,r){const i=Et(e),n=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC;return t.createBuffer({label:"mpm-particles",size:i,usage:n})}function Zt(t,e,r){const i=Xt(e),n=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC;return t.createBuffer({label:"mpm-grid",size:i,usage:n})}const Ze=(t,e)=>Math.ceil(t/e);class er{constructor(e,r={}){this.device=e,this.constants={...F,...r.constants??{}},this.iterations=r.iterations??1,this.pipelines={},this.bindGroups={},this.particleCount=0,this.gridCount=0}configure({pipelines:e,bindGroups:r}){this.pipelines={...e},this.bindGroups={...r}}setCounts({particleCount:e,gridCount:r}){this.particleCount=e??this.particleCount,this.gridCount=r??this.gridCount}step(e,r){if(!e)throw new Error("MpmDomain.step requires a command encoder");if(!this._hasPipelines())throw new Error("MpmDomain pipelines not configured");const i=Ze(this.particleCount,he),n=Ze(this.gridCount,he);for(let s=0;s<this.iterations;s+=1)this._runPass(e,"clearGrid",n),this._runPass(e,"p2g1",i),this._runPass(e,"p2g2",i),this._runPass(e,"updateGrid",n),this._runPass(e,"g2p",i),this.pipelines.copyPosition&&this.bindGroups.copyPosition&&this._runPass(e,"copyPosition",i)}_runPass(e,r,i){const n=this.pipelines[r],s=this.bindGroups[r];if(!n||!s)throw new Error(`Missing pipeline or bind group for ${r}`);const o=e.beginComputePass({label:`mpm-${r}`});o.setPipeline(n),o.setBindGroup(0,s),o.dispatchWorkgroups(i),o.end()}_hasPipelines(){return this.pipelines.clearGrid&&this.pipelines.p2g1&&this.pipelines.p2g2&&this.pipelines.updateGrid&&this.pipelines.g2p&&this.bindGroups.clearGrid&&this.bindGroups.p2g1&&this.bindGroups.p2g2&&this.bindGroups.updateGrid&&this.bindGroups.g2p}}const xe=`
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
`,ve=`
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
`,ke=`
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
`,tr=`
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
`,Tt=`
struct SimulationUniforms {
  gravity: vec3f,
  ambientPressure: f32,
};
`,Ee=`
override fixed_point_multiplier: f32;

fn encodeFixedPoint(f: f32) -> i32 {
  return i32(f * fixed_point_multiplier);
}

fn decodeFixedPoint(v: i32) -> f32 {
  return f32(v) / fixed_point_multiplier;
}
`,rr=`
${ke}

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
`,ir=`
${xe}
${ve}
${tr}
${Ee}

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
`,nr=`
${xe}
${ve}

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

${Tt}
${Ee}

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
`,sr=`
${ke}

${Tt}
${Ee}
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
`,or=`
${xe}
${ve}
${ke}

struct MouseInteraction {
  point: vec3f,
  radius: f32,
  velocity: vec3f,     // For moving heat sources
  temperature: f32,    // Heat source temperature (0 = no thermal effect)
};

${Ee}
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
`,ar=`
${xe}
${ve}

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
`;function cr(t,e=F){const r=e.tensileStrength??0,i=e.damageRate??0,n=e.restDensity??F.restDensity,s=e.stiffness??F.stiffness,o=e.dynamicViscosity??F.dynamicViscosity,a=e.dt??F.dt,d=e.fixedPointScale??F.fixedPointScale,f=j(t,rr,"mpm-clear-grid"),h=j(t,ir,"mpm-p2g1"),g=j(t,nr,"mpm-p2g2"),m=j(t,sr,"mpm-update-grid"),B=j(t,or,"mpm-g2p"),l=j(t,ar,"mpm-copy-position");return{clearGrid:t.createComputePipeline({label:"mpm-clear-grid",layout:"auto",compute:{module:f}}),p2g1:t.createComputePipeline({label:"mpm-p2g1",layout:"auto",compute:{module:h,constants:{fixed_point_multiplier:d}}}),p2g2:t.createComputePipeline({label:"mpm-p2g2",layout:"auto",compute:{module:g,constants:{fixed_point_multiplier:d,stiffness:s,rest_density:n,dynamic_viscosity:o,dt:a,tensile_strength:r,damage_rate:i}}}),updateGrid:t.createComputePipeline({label:"mpm-update-grid",layout:"auto",compute:{module:m,constants:{fixed_point_multiplier:e.fixedPointScale,dt:e.dt,thermal_diffusivity:e.thermalDiffusivity??.1}}}),g2p:t.createComputePipeline({label:"mpm-g2p",layout:"auto",compute:{module:B,constants:{fixed_point_multiplier:e.fixedPointScale,dt:e.dt}}}),copyPosition:t.createComputePipeline({label:"mpm-copy-position",layout:"auto",compute:{module:l}})}}function lr(t,e,r){const{particleBuffer:i,gridBuffer:n,initBoxBuffer:s,realBoxBuffer:o,interactionBuffer:a,posVelBuffer:d,simUniformBuffer:f}=r,h={clearGrid:t.createBindGroup({layout:e.clearGrid.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n}}]}),p2g1:t.createBindGroup({layout:e.p2g1.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:s}}]}),p2g2:t.createBindGroup({layout:e.p2g2.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:f}}]}),updateGrid:t.createBindGroup({layout:e.updateGrid.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:f}}]}),g2p:t.createBindGroup({layout:e.g2p.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:s}},{binding:4,resource:{buffer:a}}]})};return e.copyPosition&&d&&(h.copyPosition=t.createBindGroup({layout:e.copyPosition.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:d}}]})),h}function et(t,e,r){const i=new Float32Array(4);i.set(e.slice(0,3));const n=t.createBuffer({label:r??"vec3-uniform",size:i.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.queue.writeBuffer(n,0,i),n}function dr(t,e,r){const i=new Float32Array(4);i.set(e.slice(0,3)),i[3]=r;const n=t.createBuffer({label:"mpm-sim-uniforms",size:i.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.queue.writeBuffer(n,0,i),n}function yo(t,e){const{particleCount:r,gridSize:i,posVelBuffer:n,interactionBuffer:s,constants:o,iterations:a}=e;if(!i)throw new Error("gridSize {x,y,z} is required");const d=Math.ceil(i.x)*Math.ceil(i.y)*Math.ceil(i.z),f=Yt(t,r),h=Zt(t,d),g=et(t,[i.x,i.y,i.z],"mpm-init-box"),m=et(t,[i.x,i.y,i.z],"mpm-real-box"),B=(o==null?void 0:o.ambientPressure)??F.ambientPressure,l=dr(t,[0,-.3,0],B);let u=s;if(!u){u=t.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,label:"mpm-interaction-default"});const C=new Float32Array(8);C[3]=-1,t.queue.writeBuffer(u,0,C)}const p=cr(t,o),w=lr(t,p,{particleBuffer:f,gridBuffer:h,initBoxBuffer:g,realBoxBuffer:m,simUniformBuffer:l,interactionBuffer:u,posVelBuffer:n}),x=new er(t,{constants:o,iterations:a});return x.configure({pipelines:p,bindGroups:w}),x.setCounts({particleCount:r,gridCount:d}),{domain:x,pipelines:p,bindGroups:w,buffers:{particleBuffer:f,gridBuffer:h,initBoxBuffer:g,realBoxBuffer:m,simUniformBuffer:l,interactionBuffer:u,posVelBuffer:n},dispatch:{particle:Math.ceil(r/he),grid:Math.ceil(d/he)}}}function _o(t,e,r){const i=r.byteLength??r.length;if(i>e.size)throw new Error(`Particle data (${i}) exceeds buffer size (${e.size})`);t.queue.writeBuffer(e,0,r)}const ur=()=>[1,0,0,0,0,1,0,0,0,0,1,0],fr=()=>[0,0,0,0,0,0,0,0,0,0,0,0];function wo(t){const{count:e,gridSize:r,start:i=[0,0,0],spacing:n=.65,jitter:s=0,materialType:o=k.LIQUID,mass:a=1,temperature:d=300,phase:f=null,mu:h=null,lambda:g=null,restDensity:m=1,cubeSideCount:B=null}=t;if(!e||!r)throw new Error("count and gridSize are required");let l,u,p;switch(o){case k.BRITTLE_SOLID:l=0,u=R.ice.mu,p=R.ice.lambda;break;case k.ELASTIC_SOLID:l=0,u=R.rubber.mu,p=R.rubber.lambda;break;case k.LIQUID:l=1,u=0,p=R.water.stiffness;break;case k.GAS:l=2,u=0,p=R.steam.gasConstant;break;case k.IRON:l=0,u=R.iron.mu,p=R.iron.lambda;break;case k.GRANULAR:l=0,u=100,p=100;break;default:l=1,u=0,p=50}const w=f!==null?f:l,x=h!==null?h:u,C=g!==null?g:p,P=new ArrayBuffer(Et(e));let b=0;const U=B!==null?B:Math.ceil(Math.cbrt(e));for(let S=0;S<U&&b<e;S++)for(let D=0;D<U&&b<e;D++)for(let N=0;N<U&&b<e;N++){const z=Jt(P,b),Lt=Math.min(i[0]+D*n,r.x-2),Ft=Math.min(i[1]+S*n,r.y-2),Gt=Math.min(i[2]+N*n,r.z-2),Vt=s?(Math.random()*2-1)*s:0,kt=s?(Math.random()*2-1)*s:0,qt=s?(Math.random()*2-1)*s:0;z.position.set([Lt+Vt,Ft+kt,Gt+qt]),z.materialType[0]=o,z.velocity.set([0,0,0]),z.phase[0]=w,z.mass[0]=a,z.volume0[0]=a/m,z.temperature[0]=d,z.damage[0]=0,z.F.set(ur()),z.C.set(fr()),z.mu[0]=x,z.lambda[0]=C,z.restDensity[0]=m,z.phaseFraction[0]=0,b+=1}if(b<e)throw new Error(`Could not place all particles; placed ${b} of ${e}`);return P}async function hr(t,e,r){var a;const i=r*we,n=t.createBuffer({label:"mpm-particle-staging",size:i,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),s=t.createCommandEncoder({label:"mpm-diagnostics-copy"});s.copyBufferToBuffer(e,0,n,0,i),t.queue.submit([s.finish()]),await n.mapAsync(GPUMapMode.READ);const o=n.getMappedRange().slice(0);return n.unmap(),(a=n.destroy)==null||a.call(n),o}async function xo(t,e,r){const i=await hr(t,e,r),n=v.mass/4,s=v.velocity/4,o=new Float32Array(i);let a=0,d=0,f=0,h=0;for(let g=0;g<r;g+=1){const m=we/4*g,B=o[m+n],l=o[m+s+0],u=o[m+s+1],p=o[m+s+2];a+=B,d+=B*l,f+=B*u,h+=B*p}return{mass:a,momentum:[d,f,h]}}function pr(t,e){if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}function qe(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return t;if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return new Uint8Array(t.buffer,t.byteOffset,t.byteLength);throw new Error("Unknown type, must be binary type")}function mr(t){return new TextEncoder().encode(t)}function gr(t){return new TextDecoder().decode(t)}function br(t,e){if(t.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),i=0;i<r.length;i++)r[i]=255;for(var n=0;n<t.length;n++){var s=t.charAt(n),o=s.charCodeAt(0);if(r[o]!==255)throw new TypeError(s+" is ambiguous");r[o]=n}var a=t.length,d=t.charAt(0),f=Math.log(a)/Math.log(256),h=Math.log(256)/Math.log(a);function g(l){if(l instanceof Uint8Array||(ArrayBuffer.isView(l)?l=new Uint8Array(l.buffer,l.byteOffset,l.byteLength):Array.isArray(l)&&(l=Uint8Array.from(l))),!(l instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(l.length===0)return"";for(var u=0,p=0,w=0,x=l.length;w!==x&&l[w]===0;)w++,u++;for(var C=(x-w)*h+1>>>0,P=new Uint8Array(C);w!==x;){for(var b=l[w],U=0,S=C-1;(b!==0||U<p)&&S!==-1;S--,U++)b+=256*P[S]>>>0,P[S]=b%a>>>0,b=b/a>>>0;if(b!==0)throw new Error("Non-zero carry");p=U,w++}for(var D=C-p;D!==C&&P[D]===0;)D++;for(var N=d.repeat(u);D<C;++D)N+=t.charAt(P[D]);return N}function m(l){if(typeof l!="string")throw new TypeError("Expected String");if(l.length===0)return new Uint8Array;var u=0;if(l[u]!==" "){for(var p=0,w=0;l[u]===d;)p++,u++;for(var x=(l.length-u)*f+1>>>0,C=new Uint8Array(x);l[u];){var P=r[l.charCodeAt(u)];if(P===255)return;for(var b=0,U=x-1;(P!==0||b<w)&&U!==-1;U--,b++)P+=a*C[U]>>>0,C[U]=P%256>>>0,P=P/256>>>0;if(P!==0)throw new Error("Non-zero carry");w=b,u++}if(l[u]!==" "){for(var S=x-w;S!==x&&C[S]===0;)S++;for(var D=new Uint8Array(p+(x-S)),N=p;S!==x;)D[N++]=C[S++];return D}}}function B(l){var u=m(l);if(u)return u;throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:m,decode:B}}var yr=br,_r=yr;class wr{constructor(e,r,i){c(this,"name");c(this,"prefix");c(this,"baseEncode");this.name=e,this.prefix=r,this.baseEncode=i}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class xr{constructor(e,r,i){c(this,"name");c(this,"prefix");c(this,"baseDecode");c(this,"prefixCodePoint");this.name=e,this.prefix=r;const n=r.codePointAt(0);if(n===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=n,this.baseDecode=i}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Ct(this,e)}}class vr{constructor(e){c(this,"decoders");this.decoders=e}or(e){return Ct(this,e)}decode(e){const r=e[0],i=this.decoders[r];if(i!=null)return i.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}function Ct(t,e){return new vr({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}class Er{constructor(e,r,i,n){c(this,"name");c(this,"prefix");c(this,"baseEncode");c(this,"baseDecode");c(this,"encoder");c(this,"decoder");this.name=e,this.prefix=r,this.baseEncode=i,this.baseDecode=n,this.encoder=new wr(e,r,i),this.decoder=new xr(e,r,n)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function Te({name:t,prefix:e,encode:r,decode:i}){return new Er(t,e,r,i)}function oe({name:t,prefix:e,alphabet:r}){const{encode:i,decode:n}=_r(r,t);return Te({prefix:e,name:t,encode:i,decode:s=>qe(n(s))})}function Tr(t,e,r,i){let n=t.length;for(;t[n-1]==="=";)--n;const s=new Uint8Array(n*r/8|0);let o=0,a=0,d=0;for(let f=0;f<n;++f){const h=e[t[f]];if(h===void 0)throw new SyntaxError(`Non-${i} character`);a=a<<r|h,o+=r,o>=8&&(o-=8,s[d++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return s}function Cr(t,e,r){const i=e[e.length-1]==="=",n=(1<<r)-1;let s="",o=0,a=0;for(let d=0;d<t.length;++d)for(a=a<<8|t[d],o+=8;o>r;)o-=r,s+=e[n&a>>o];if(o!==0&&(s+=e[n&a<<r-o]),i)for(;(s.length*r&7)!==0;)s+="=";return s}function Pr(t){const e={};for(let r=0;r<t.length;++r)e[t[r]]=r;return e}function _({name:t,prefix:e,bitsPerChar:r,alphabet:i}){const n=Pr(i);return Te({prefix:e,name:t,encode(s){return Cr(s,i,r)},decode(s){return Tr(s,n,r,t)}})}const M=oe({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),Sr=oe({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),Ir=Object.freeze(Object.defineProperty({__proto__:null,base58btc:M,base58flickr:Sr},Symbol.toStringTag,{value:"Module"})),q=_({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),zr=_({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),Br=_({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),Dr=_({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),Ar=_({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),Or=_({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),Ur=_({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),$r=_({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),Mr=_({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),Nr=Object.freeze(Object.defineProperty({__proto__:null,base32:q,base32hex:Ar,base32hexpad:Ur,base32hexpadupper:$r,base32hexupper:Or,base32pad:Br,base32padupper:Dr,base32upper:zr,base32z:Mr},Symbol.toStringTag,{value:"Module"})),fe=oe({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),Rr=oe({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}),Lr=Object.freeze(Object.defineProperty({__proto__:null,base36:fe,base36upper:Rr},Symbol.toStringTag,{value:"Module"}));var Fr=Pt,tt=128,Gr=-128,Vr=Math.pow(2,31);function Pt(t,e,r){e=e||[],r=r||0;for(var i=r;t>=Vr;)e[r++]=t&255|tt,t/=128;for(;t&Gr;)e[r++]=t&255|tt,t>>>=7;return e[r]=t|0,Pt.bytes=r-i+1,e}var kr=$e,qr=128,rt=127;function $e(t,i){var r=0,i=i||0,n=0,s=i,o,a=t.length;do{if(s>=a)throw $e.bytes=0,new RangeError("Could not decode varint");o=t[s++],r+=n<28?(o&rt)<<n:(o&rt)*Math.pow(2,n),n+=7}while(o>=qr);return $e.bytes=s-i,r}var Wr=Math.pow(2,7),Hr=Math.pow(2,14),jr=Math.pow(2,21),Kr=Math.pow(2,28),Qr=Math.pow(2,35),Xr=Math.pow(2,42),Jr=Math.pow(2,49),Yr=Math.pow(2,56),Zr=Math.pow(2,63),ei=function(t){return t<Wr?1:t<Hr?2:t<jr?3:t<Kr?4:t<Qr?5:t<Xr?6:t<Jr?7:t<Yr?8:t<Zr?9:10},ti={encode:Fr,decode:kr,encodingLength:ei},pe=ti;function Me(t,e=0){return[pe.decode(t,e),pe.decode.bytes]}function me(t,e,r=0){return pe.encode(t,e,r),e}function ge(t){return pe.encodingLength(t)}function ri(t,e){const r=e.byteLength,i=ge(t),n=i+ge(r),s=new Uint8Array(n+r);return me(t,s,0),me(r,s,i),s.set(e,n),new We(t,r,e,s)}function ii(t){const e=qe(t),[r,i]=Me(e),[n,s]=Me(e.subarray(i)),o=e.subarray(i+s);if(o.byteLength!==n)throw new Error("Incorrect length");return new We(r,n,o,e)}function ni(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof Uint8Array&&pr(t.bytes,r.bytes)}}class We{constructor(e,r,i,n){c(this,"code");c(this,"size");c(this,"digest");c(this,"bytes");this.code=e,this.size=r,this.digest=i,this.bytes=n}}function it(t,e){const{bytes:r,version:i}=t;switch(i){case 0:return oi(r,Ne(t),e??M.encoder);default:return ai(r,Ne(t),e??q.encoder)}}const nt=new WeakMap;function Ne(t){const e=nt.get(t);if(e==null){const r=new Map;return nt.set(t,r),r}return e}var wt;class y{constructor(e,r,i,n){c(this,"code");c(this,"version");c(this,"multihash");c(this,"bytes");c(this,"/");c(this,wt,"CID");this.code=r,this.version=e,this.multihash=i,this.bytes=n,this["/"]=n}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==Z)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==ci)throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");return y.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,i=ri(e,r);return y.createV1(this.code,i)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`)}}equals(e){return y.equals(this,e)}static equals(e,r){const i=r;return i!=null&&e.code===i.code&&e.version===i.version&&ni(e.multihash,i.multihash)}toString(e){return it(this,e)}toJSON(){return{"/":it(this)}}link(){return this}[(wt=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()})`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof y)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===r){const{version:i,code:n,multihash:s,bytes:o}=r;return new y(i,n,s,o??st(i,n,s.bytes))}else if(r[li]===!0){const{version:i,multihash:n,code:s}=r,o=ii(n);return y.create(i,s,o)}else return null}static create(e,r,i){if(typeof r!="number")throw new Error("String codecs are no longer supported");if(!(i.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{if(r!==Z)throw new Error(`Version 0 CID must use dag-pb (code: ${Z}) block encoding`);return new y(e,r,i,i.bytes)}case 1:{const n=st(e,r,i.bytes);return new y(e,r,i,n)}default:throw new Error("Invalid version")}}static createV0(e){return y.create(0,Z,e)}static createV1(e,r){return y.create(1,e,r)}static decode(e){const[r,i]=y.decodeFirst(e);if(i.length!==0)throw new Error("Incorrect length");return r}static decodeFirst(e){const r=y.inspectBytes(e),i=r.size-r.multihashSize,n=qe(e.subarray(i,i+r.multihashSize));if(n.byteLength!==r.multihashSize)throw new Error("Incorrect length");const s=n.subarray(r.multihashSize-r.digestSize),o=new We(r.multihashCode,r.digestSize,s,n);return[r.version===0?y.createV0(o):y.createV1(r.codec,o),e.subarray(r.size)]}static inspectBytes(e){let r=0;const i=()=>{const[g,m]=Me(e.subarray(r));return r+=m,g};let n=i(),s=Z;if(n===18?(n=0,r=0):s=i(),n!==0&&n!==1)throw new RangeError(`Invalid CID version ${n}`);const o=r,a=i(),d=i(),f=r+d,h=f-o;return{version:n,codec:s,multihashCode:a,digestSize:d,multihashSize:h,size:f}}static parse(e,r){const[i,n]=si(e,r),s=y.decode(n);if(s.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Ne(s).set(i,e),s}}function si(t,e){switch(t[0]){case"Q":{const r=e??M;return[M.prefix,r.decode(`${M.prefix}${t}`)]}case M.prefix:{const r=e??M;return[M.prefix,r.decode(t)]}case q.prefix:{const r=e??q;return[q.prefix,r.decode(t)]}case fe.prefix:{const r=e??fe;return[fe.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");return[t[0],e.decode(t)]}}}function oi(t,e,r){const{prefix:i}=r;if(i!==M.prefix)throw Error(`Cannot string encode V0 in ${r.name} encoding`);const n=e.get(i);if(n==null){const s=r.encode(t).slice(1);return e.set(i,s),s}else return n}function ai(t,e,r){const{prefix:i}=r,n=e.get(i);if(n==null){const s=r.encode(t);return e.set(i,s),s}else return n}const Z=112,ci=18;function st(t,e,r){const i=ge(t),n=i+ge(e),s=new Uint8Array(n+r.byteLength);return me(t,s,0),me(e,s,i),s.set(r,n),s}const li=Symbol.for("@ipld/js-cid/CID");function Re(t=0){return new Uint8Array(t)}function ne(t=0){return new Uint8Array(t)}function Ce(t,e){e==null&&(e=t.reduce((n,s)=>n+s.length,0));const r=ne(e);let i=0;for(const n of t)r.set(n,i),i+=n.length;return r}const di=oe({prefix:"9",name:"base10",alphabet:"0123456789"}),ui=Object.freeze(Object.defineProperty({__proto__:null,base10:di},Symbol.toStringTag,{value:"Module"})),fi=_({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),hi=_({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),pi=Object.freeze(Object.defineProperty({__proto__:null,base16:fi,base16upper:hi},Symbol.toStringTag,{value:"Module"})),mi=_({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),gi=Object.freeze(Object.defineProperty({__proto__:null,base2:mi},Symbol.toStringTag,{value:"Module"})),St=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),bi=St.reduce((t,e,r)=>(t[r]=e,t),[]),yi=St.reduce((t,e,r)=>{const i=e.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${e}`);return t[i]=r,t},[]);function _i(t){return t.reduce((e,r)=>(e+=bi[r],e),"")}function wi(t){const e=[];for(const r of t){const i=r.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${r}`);const n=yi[i];if(n==null)throw new Error(`Non-base256emoji character: ${r}`);e.push(n)}return new Uint8Array(e)}const xi=Te({prefix:"🚀",name:"base256emoji",encode:_i,decode:wi}),vi=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:xi},Symbol.toStringTag,{value:"Module"})),Ei=_({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),Ti=_({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),He=_({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),Ci=_({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),Pi=Object.freeze(Object.defineProperty({__proto__:null,base64:Ei,base64pad:Ti,base64url:He,base64urlpad:Ci},Symbol.toStringTag,{value:"Module"})),Si=_({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),Ii=Object.freeze(Object.defineProperty({__proto__:null,base8:Si},Symbol.toStringTag,{value:"Module"})),zi=Te({prefix:"\0",name:"identity",encode:t=>gr(t),decode:t=>mr(t)}),Bi=Object.freeze(Object.defineProperty({__proto__:null,identity:zi},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const be={...Bi,...gi,...Ii,...ui,...pi,...Nr,...Lr,...Ir,...Pi,...vi};function It(t,e,r,i){return{name:t,prefix:e,encoder:{name:t,prefix:e,encode:r},decoder:{decode:i}}}const ot=It("utf8","u",t=>"u"+new TextDecoder("utf8").decode(t),t=>new TextEncoder().encode(t.substring(1))),Se=It("ascii","a",t=>{let e="a";for(let r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},t=>{t=t.substring(1);const e=ne(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}),zt={utf8:ot,"utf-8":ot,hex:be.base16,latin1:Se,ascii:Se,binary:Se,...be};function ae(t,e="utf8"){const r=zt[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.decoder.decode(`${r.prefix}${t}`)}function V(t,e="utf8"){const r=zt[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.encoder.encode(t).substring(1)}const Di=Math.pow(2,7),Ai=Math.pow(2,14),Oi=Math.pow(2,21),Bt=Math.pow(2,28),Dt=Math.pow(2,35),At=Math.pow(2,42),Ot=Math.pow(2,49),I=128,L=127;function je(t){if(t<Di)return 1;if(t<Ai)return 2;if(t<Oi)return 3;if(t<Bt)return 4;if(t<Dt)return 5;if(t<At)return 6;if(t<Ot)return 7;if(Number.MAX_SAFE_INTEGER!=null&&t>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function Ui(t,e,r=0){switch(je(t)){case 8:e[r++]=t&255|I,t/=128;case 7:e[r++]=t&255|I,t/=128;case 6:e[r++]=t&255|I,t/=128;case 5:e[r++]=t&255|I,t/=128;case 4:e[r++]=t&255|I,t>>>=7;case 3:e[r++]=t&255|I,t>>>=7;case 2:e[r++]=t&255|I,t>>>=7;case 1:{e[r++]=t&255,t>>>=7;break}default:throw new Error("unreachable")}return e}function $i(t,e){let r=t[e],i=0;if(i+=r&L,r<I||(r=t[e+1],i+=(r&L)<<7,r<I)||(r=t[e+2],i+=(r&L)<<14,r<I)||(r=t[e+3],i+=(r&L)<<21,r<I)||(r=t[e+4],i+=(r&L)*Bt,r<I)||(r=t[e+5],i+=(r&L)*Dt,r<I)||(r=t[e+6],i+=(r&L)*At,r<I)||(r=t[e+7],i+=(r&L)*Ot,r<I))return i;throw new RangeError("Could not decode varint")}const Ke=new Float32Array([-0]),G=new Uint8Array(Ke.buffer);function Mi(t,e,r){Ke[0]=t,e[r]=G[0],e[r+1]=G[1],e[r+2]=G[2],e[r+3]=G[3]}function Ni(t,e){return G[0]=t[e],G[1]=t[e+1],G[2]=t[e+2],G[3]=t[e+3],Ke[0]}const Qe=new Float64Array([-0]),E=new Uint8Array(Qe.buffer);function Ri(t,e,r){Qe[0]=t,e[r]=E[0],e[r+1]=E[1],e[r+2]=E[2],e[r+3]=E[3],e[r+4]=E[4],e[r+5]=E[5],e[r+6]=E[6],e[r+7]=E[7]}function Li(t,e){return E[0]=t[e],E[1]=t[e+1],E[2]=t[e+2],E[3]=t[e+3],E[4]=t[e+4],E[5]=t[e+5],E[6]=t[e+6],E[7]=t[e+7],Qe[0]}const Fi=BigInt(Number.MAX_SAFE_INTEGER),Gi=BigInt(Number.MIN_SAFE_INTEGER);class T{constructor(e,r){c(this,"lo");c(this,"hi");this.lo=e|0,this.hi=r|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const r=~this.lo+1>>>0;let i=~this.hi>>>0;return r===0&&(i=i+1>>>0),-(r+i*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const r=~this.lo+1>>>0;let i=~this.hi>>>0;return r===0&&(i=i+1>>>0),-(BigInt(r)+(BigInt(i)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,r=(this.lo>>>28|this.hi<<4)>>>0,i=this.hi>>>24;return i===0?r===0?e<16384?e<128?1:2:e<2097152?3:4:r<16384?r<128?5:6:r<2097152?7:8:i<128?9:10}static fromBigInt(e){if(e===0n)return W;if(e<Fi&&e>Gi)return this.fromNumber(Number(e));const r=e<0n;r&&(e=-e);let i=e>>32n,n=e-(i<<32n);return r&&(i=~i|0n,n=~n|0n,++n>at&&(n=0n,++i>at&&(i=0n))),new T(Number(n),Number(i))}static fromNumber(e){if(e===0)return W;const r=e<0;r&&(e=-e);let i=e>>>0,n=(e-i)/4294967296>>>0;return r&&(n=~n>>>0,i=~i>>>0,++i>4294967295&&(i=0,++n>4294967295&&(n=0))),new T(i,n)}static from(e){return typeof e=="number"?T.fromNumber(e):typeof e=="bigint"?T.fromBigInt(e):typeof e=="string"?T.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new T(e.low>>>0,e.high>>>0):W}}const W=new T(0,0);W.toBigInt=function(){return 0n};W.zzEncode=W.zzDecode=function(){return this};W.length=function(){return 1};const at=4294967296n;function Vi(t){let e=0,r=0;for(let i=0;i<t.length;++i)r=t.charCodeAt(i),r<128?e+=1:r<2048?e+=2:(r&64512)===55296&&(t.charCodeAt(i+1)&64512)===56320?(++i,e+=4):e+=3;return e}function ki(t,e,r){if(r-e<1)return"";let n;const s=[];let o=0,a;for(;e<r;)a=t[e++],a<128?s[o++]=a:a>191&&a<224?s[o++]=(a&31)<<6|t[e++]&63:a>239&&a<365?(a=((a&7)<<18|(t[e++]&63)<<12|(t[e++]&63)<<6|t[e++]&63)-65536,s[o++]=55296+(a>>10),s[o++]=56320+(a&1023)):s[o++]=(a&15)<<12|(t[e++]&63)<<6|t[e++]&63,o>8191&&((n??(n=[])).push(String.fromCharCode.apply(String,s)),o=0);return n!=null?(o>0&&n.push(String.fromCharCode.apply(String,s.slice(0,o))),n.join("")):String.fromCharCode.apply(String,s.slice(0,o))}function Ut(t,e,r){const i=r;let n,s;for(let o=0;o<t.length;++o)n=t.charCodeAt(o),n<128?e[r++]=n:n<2048?(e[r++]=n>>6|192,e[r++]=n&63|128):(n&64512)===55296&&((s=t.charCodeAt(o+1))&64512)===56320?(n=65536+((n&1023)<<10)+(s&1023),++o,e[r++]=n>>18|240,e[r++]=n>>12&63|128,e[r++]=n>>6&63|128,e[r++]=n&63|128):(e[r++]=n>>12|224,e[r++]=n>>6&63|128,e[r++]=n&63|128);return r-i}function $(t,e){return RangeError(`index out of range: ${t.pos} + ${e??1} > ${t.len}`)}function ce(t,e){return(t[e-4]|t[e-3]<<8|t[e-2]<<16|t[e-1]<<24)>>>0}class qi{constructor(e){c(this,"buf");c(this,"pos");c(this,"len");c(this,"_slice",Uint8Array.prototype.subarray);this.buf=e,this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,$(this,10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw $(this,4);return ce(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw $(this,4);return ce(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw $(this,4);const e=Ni(this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)throw $(this,4);const e=Li(this.buf,this.pos);return this.pos+=8,e}bytes(){const e=this.uint32(),r=this.pos,i=this.pos+e;if(i>this.len)throw $(this,e);return this.pos+=e,r===i?new Uint8Array(0):this.buf.subarray(r,i)}string(){const e=this.bytes();return ki(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+e>this.len)throw $(this,e);this.pos+=e}else do if(this.pos>=this.len)throw $(this);while((this.buf[this.pos++]&128)!==0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new T(0,0);let r=0;if(this.len-this.pos>4){for(;r<4;++r)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;r=0}else{for(;r<3;++r){if(this.pos>=this.len)throw $(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(this.buf[this.pos++]&127)<<r*7)>>>0,e}if(this.len-this.pos>4){for(;r<5;++r)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<r*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;r<5;++r){if(this.pos>=this.len)throw $(this);if(e.hi=(e.hi|(this.buf[this.pos]&127)<<r*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.len)throw $(this,8);const e=ce(this.buf,this.pos+=4),r=ce(this.buf,this.pos+=4);return new T(e,r)}int64(){return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=$i(this.buf,this.pos);return this.pos+=je(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){return this.readFixed64().toString()}}function Wi(t){return new qi(t instanceof Uint8Array?t:t.subarray())}function Xe(t,e,r){const i=Wi(t);return e.decode(i,void 0,r)}function Hi(t){let i,n=8192;return function(o){if(o<1||o>4096)return ne(o);n+o>8192&&(i=ne(8192),n=0);const a=i.subarray(n,n+=o);return(n&7)!==0&&(n=(n|7)+1),a}}class te{constructor(e,r,i){c(this,"fn");c(this,"len");c(this,"next");c(this,"val");this.fn=e,this.len=r,this.next=void 0,this.val=i}}function Ie(){}class ji{constructor(e){c(this,"head");c(this,"tail");c(this,"len");c(this,"next");this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const Ki=Hi();function Qi(t){return globalThis.Buffer!=null?ne(t):Ki(t)}class Le{constructor(){c(this,"len");c(this,"head");c(this,"tail");c(this,"states");this.len=0,this.head=new te(Ie,0,0),this.tail=this.head,this.states=null}_push(e,r,i){return this.tail=this.tail.next=new te(e,r,i),this.len+=r,this}uint32(e){return this.len+=(this.tail=this.tail.next=new Ji((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(le,10,T.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const r=T.fromBigInt(e);return this._push(le,r.length(),r)}uint64Number(e){return this._push(Ui,je(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const r=T.fromBigInt(e).zzEncode();return this._push(le,r.length(),r)}sint64Number(e){const r=T.fromNumber(e).zzEncode();return this._push(le,r.length(),r)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(ze,1,e?1:0)}fixed32(e){return this._push(ee,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const r=T.fromBigInt(e);return this._push(ee,4,r.lo)._push(ee,4,r.hi)}fixed64Number(e){const r=T.fromNumber(e);return this._push(ee,4,r.lo)._push(ee,4,r.hi)}fixed64String(e){return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.fixed64String(e)}float(e){return this._push(Mi,4,e)}double(e){return this._push(Ri,8,e)}bytes(e){const r=e.length>>>0;return r===0?this._push(ze,1,0):this.uint32(r)._push(Yi,r,e)}string(e){const r=Vi(e);return r!==0?this.uint32(r)._push(Ut,r,e):this._push(ze,1,0)}fork(){return this.states=new ji(this),this.head=this.tail=new te(Ie,0,0),this.len=0,this}reset(){return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new te(Ie,0,0),this.len=0),this}ldelim(){const e=this.head,r=this.tail,i=this.len;return this.reset().uint32(i),i!==0&&(this.tail.next=e.next,this.tail=r,this.len+=i),this}finish(){let e=this.head.next;const r=Qi(this.len);let i=0;for(;e!=null;)e.fn(e.val,r,i),i+=e.len,e=e.next;return r}}function ze(t,e,r){e[r]=t&255}function Xi(t,e,r){for(;t>127;)e[r++]=t&127|128,t>>>=7;e[r]=t}class Ji extends te{constructor(r,i){super(Xi,r,i);c(this,"next");this.next=void 0}}function le(t,e,r){for(;t.hi!==0;)e[r++]=t.lo&127|128,t.lo=(t.lo>>>7|t.hi<<25)>>>0,t.hi>>>=7;for(;t.lo>127;)e[r++]=t.lo&127|128,t.lo=t.lo>>>7;e[r++]=t.lo}function ee(t,e,r){e[r]=t&255,e[r+1]=t>>>8&255,e[r+2]=t>>>16&255,e[r+3]=t>>>24}function Yi(t,e,r){e.set(t,r)}globalThis.Buffer!=null&&(Le.prototype.bytes=function(t){const e=t.length>>>0;return this.uint32(e),e>0&&this._push(Zi,e,t),this},Le.prototype.string=function(t){const e=globalThis.Buffer.byteLength(t);return this.uint32(e),e>0&&this._push(en,e,t),this});function Zi(t,e,r){e.set(t,r)}function en(t,e,r){t.length<40?Ut(t,e,r):e.utf8Write!=null?e.utf8Write(t,r):e.set(ae(t),r)}function tn(){return new Le}function Je(t,e){const r=tn();return e.encode(t,r,{lengthDelimited:!1}),r.finish()}var Fe;(function(t){t[t.VARINT=0]="VARINT",t[t.BIT64=1]="BIT64",t[t.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",t[t.START_GROUP=3]="START_GROUP",t[t.END_GROUP=4]="END_GROUP",t[t.BIT32=5]="BIT32"})(Fe||(Fe={}));function rn(t,e,r,i){return{name:t,type:e,encode:r,decode:i}}function Ye(t,e){return rn("message",Fe.LENGTH_DELIMITED,t,e)}class Ge extends Error{constructor(){super(...arguments);c(this,"code","ERR_MAX_LENGTH");c(this,"name","MaxLengthError")}}class nn{constructor(){c(this,"index",0);c(this,"input","")}new(e){return this.index=0,this.input=e,this}readAtomically(e){const r=this.index,i=e();return i===void 0&&(this.index=r),i}parseWith(e){const r=e();if(this.index===this.input.length)return r}peekChar(){if(!(this.index>=this.input.length))return this.input[this.index]}readChar(){if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(e){return this.readAtomically(()=>{const r=this.readChar();if(r===e)return r})}readSeparator(e,r,i){return this.readAtomically(()=>{if(!(r>0&&this.readGivenChar(e)===void 0))return i()})}readNumber(e,r,i,n){return this.readAtomically(()=>{let s=0,o=0;const a=this.peekChar();if(a===void 0)return;const d=a==="0",f=2**(8*n)-1;for(;;){const h=this.readAtomically(()=>{const g=this.readChar();if(g===void 0)return;const m=Number.parseInt(g,e);if(!Number.isNaN(m))return m});if(h===void 0)break;if(s*=e,s+=h,s>f||(o+=1,r!==void 0&&o>r))return}if(o!==0)return!i&&d&&o>1?void 0:s})}readIPv4Addr(){return this.readAtomically(()=>{const e=new Uint8Array(4);for(let r=0;r<e.length;r++){const i=this.readSeparator(".",r,()=>this.readNumber(10,3,!1,1));if(i===void 0)return;e[r]=i}return e})}readIPv6Addr(){const e=r=>{for(let i=0;i<r.length/2;i++){const n=i*2;if(i<r.length-3){const o=this.readSeparator(":",i,()=>this.readIPv4Addr());if(o!==void 0)return r[n]=o[0],r[n+1]=o[1],r[n+2]=o[2],r[n+3]=o[3],[n+4,!0]}const s=this.readSeparator(":",i,()=>this.readNumber(16,4,!0,2));if(s===void 0)return[n,!1];r[n]=s>>8,r[n+1]=s&255}return[r.length,!1]};return this.readAtomically(()=>{const r=new Uint8Array(16),[i,n]=e(r);if(i===16)return r;if(n||this.readGivenChar(":")===void 0||this.readGivenChar(":")===void 0)return;const s=new Uint8Array(14),o=16-(i+2),[a]=e(s.subarray(0,o));return r.set(s.subarray(0,a),16-a),r})}readIPAddr(){return this.readIPv4Addr()??this.readIPv6Addr()}}const sn=45,on=15,ye=new nn;function an(t){if(!(t.length>on))return ye.new(t).parseWith(()=>ye.readIPv4Addr())}function cn(t){if(t.includes("%")&&(t=t.split("%")[0]),!(t.length>sn))return ye.new(t).parseWith(()=>ye.readIPv6Addr())}function Pe(t){return!!an(t)}function $t(t){return!!cn(t)}var xt,vt;(vt=(xt=globalThis.process)==null?void 0:xt.env)!=null&&vt.DUMP_SESSION_KEYS;var _e;(function(t){let e;t.codec=()=>(e==null&&(e=Ye((r,i,n={})=>{if(n.lengthDelimited!==!1&&i.fork(),r.webtransportCerthashes!=null)for(const s of r.webtransportCerthashes)i.uint32(10),i.bytes(s);if(r.streamMuxers!=null)for(const s of r.streamMuxers)i.uint32(18),i.string(s);n.lengthDelimited!==!1&&i.ldelim()},(r,i,n={})=>{var a,d;const s={webtransportCerthashes:[],streamMuxers:[]},o=i==null?r.len:r.pos+i;for(;r.pos<o;){const f=r.uint32();switch(f>>>3){case 1:{if(((a=n.limits)==null?void 0:a.webtransportCerthashes)!=null&&s.webtransportCerthashes.length===n.limits.webtransportCerthashes)throw new Ge('Decode error - map field "webtransportCerthashes" had too many elements');s.webtransportCerthashes.push(r.bytes());break}case 2:{if(((d=n.limits)==null?void 0:d.streamMuxers)!=null&&s.streamMuxers.length===n.limits.streamMuxers)throw new Ge('Decode error - map field "streamMuxers" had too many elements');s.streamMuxers.push(r.string());break}default:{r.skipType(f&7);break}}}return s})),e),t.encode=r=>Je(r,t.codec()),t.decode=(r,i)=>Xe(r,t.codec(),i)})(_e||(_e={}));var ct;(function(t){let e;t.codec=()=>(e==null&&(e=Ye((r,i,n={})=>{n.lengthDelimited!==!1&&i.fork(),r.identityKey!=null&&r.identityKey.byteLength>0&&(i.uint32(10),i.bytes(r.identityKey)),r.identitySig!=null&&r.identitySig.byteLength>0&&(i.uint32(18),i.bytes(r.identitySig)),r.extensions!=null&&(i.uint32(34),_e.codec().encode(r.extensions,i)),n.lengthDelimited!==!1&&i.ldelim()},(r,i,n={})=>{var a;const s={identityKey:Re(0),identitySig:Re(0)},o=i==null?r.len:r.pos+i;for(;r.pos<o;){const d=r.uint32();switch(d>>>3){case 1:{s.identityKey=r.bytes();break}case 2:{s.identitySig=r.bytes();break}case 4:{s.extensions=_e.codec().decode(r,r.uint32(),{limits:(a=n.limits)==null?void 0:a.extensions});break}default:{r.skipType(d&7);break}}}return s})),e),t.encode=r=>Je(r,t.codec()),t.decode=(r,i)=>Xe(r,t.codec(),i)})(ct||(ct={}));var lt;(function(t){t[t.Data=0]="Data",t[t.WindowUpdate=1]="WindowUpdate",t[t.Ping=2]="Ping",t[t.GoAway=3]="GoAway"})(lt||(lt={}));var Ve;(function(t){t[t.SYN=1]="SYN",t[t.ACK=2]="ACK",t[t.FIN=4]="FIN",t[t.RST=8]="RST"})(Ve||(Ve={}));Object.values(Ve).filter(t=>typeof t!="string");var dt;(function(t){t[t.NormalTermination=0]="NormalTermination",t[t.ProtocolError=1]="ProtocolError",t[t.InternalError=2]="InternalError"})(dt||(dt={}));var ut;(function(t){t[t.Init=0]="Init",t[t.SYNSent=1]="SYNSent",t[t.SYNReceived=2]="SYNReceived",t[t.Established=3]="Established",t[t.Finished=4]="Finished",t[t.Paused=5]="Paused"})(ut||(ut={}));var Ae;let J=(Ae=class extends Error{constructor(){super(...arguments);c(this,"name","InvalidMultiaddrError")}},c(Ae,"name","InvalidMultiaddrError"),Ae);var Oe;let se=(Oe=class extends Error{constructor(){super(...arguments);c(this,"name","ValidationError")}},c(Oe,"name","ValidationError"),Oe);var Ue;let ln=(Ue=class extends Error{constructor(){super(...arguments);c(this,"name","UnknownProtocolError")}},c(Ue,"name","UnknownProtocolError"),Ue);const dn=4,un=6,fn=273,hn=33,pn=41,mn=42,gn=43,bn=53,yn=54,_n=55,wn=56,xn=132,vn=301,En=302,Tn=400,Cn=421,Pn=444,Sn=445,In=446,zn=447,Bn=448,Dn=449,An=454,On=460,Un=461,$n=465,Mn=466,Nn=480,Rn=481,Ln=443,Fn=477,Gn=478,Vn=479,kn=277,qn=275,Wn=276,Hn=280,jn=281,Kn=290,Qn=777;function ft(t){return e=>V(e,t)}function ht(t){return e=>ae(e,t)}function re(t){return new DataView(t.buffer).getUint16(t.byteOffset).toString()}function Q(t){const e=new ArrayBuffer(2);return new DataView(e).setUint16(0,typeof t=="string"?parseInt(t):t),new Uint8Array(e)}function Xn(t){const e=t.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==16)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion address.`);const r=ae(e[0],"base32"),i=parseInt(e[1],10);if(i<1||i>65536)throw new Error("Port number is not in range(1, 65536)");const n=Q(i);return Ce([r,n],r.length+n.length)}function Jn(t){const e=t.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==56)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion3 address.`);const r=q.decode(`b${e[0]}`),i=parseInt(e[1],10);if(i<1||i>65536)throw new Error("Port number is not in range(1, 65536)");const n=Q(i);return Ce([r,n],r.length+n.length)}function pt(t){const e=t.subarray(0,t.length-2),r=t.subarray(t.length-2),i=V(e,"base32"),n=re(r);return`${i}:${n}`}const Mt=function(t){t=t.toString().trim();const e=new Uint8Array(4);return t.split(/\./g).forEach((r,i)=>{const n=parseInt(r,10);if(isNaN(n)||n<0||n>255)throw new J("Invalid byte value in IP address");e[i]=n}),e},Yn=function(t){let e=0;t=t.toString().trim();const r=t.split(":",8);let i;for(i=0;i<r.length;i++){const s=Pe(r[i]);let o;s&&(o=Mt(r[i]),r[i]=V(o.subarray(0,2),"base16")),o!=null&&++i<8&&r.splice(i,0,V(o.subarray(2,4),"base16"))}if(r[0]==="")for(;r.length<8;)r.unshift("0");else if(r[r.length-1]==="")for(;r.length<8;)r.push("0");else if(r.length<8){for(i=0;i<r.length&&r[i]!=="";i++);const s=[i,1];for(i=9-r.length;i>0;i--)s.push("0");r.splice.apply(r,s)}const n=new Uint8Array(e+16);for(i=0;i<r.length;i++){r[i]===""&&(r[i]="0");const s=parseInt(r[i],16);if(isNaN(s)||s<0||s>65535)throw new J("Invalid byte value in IP address");n[e++]=s>>8&255,n[e++]=s&255}return n},Zn=function(t){if(t.byteLength!==4)throw new J("IPv4 address was incorrect length");const e=[];for(let r=0;r<t.byteLength;r++)e.push(t[r]);return e.join(".")},es=function(t){if(t.byteLength!==16)throw new J("IPv6 address was incorrect length");const e=[];for(let i=0;i<t.byteLength;i+=2){const n=t[i],s=t[i+1],o=`${n.toString(16).padStart(2,"0")}${s.toString(16).padStart(2,"0")}`;e.push(o)}const r=e.join(":");try{const i=new URL(`http://[${r}]`);return i.hostname.substring(1,i.hostname.length-1)}catch{throw new J(`Invalid IPv6 address "${r}"`)}};function ts(t){try{const e=new URL(`http://[${t}]`);return e.hostname.substring(1,e.hostname.length-1)}catch{throw new J(`Invalid IPv6 address "${t}"`)}}const Be=Object.values(be).map(t=>t.decoder),rs=(function(){let t=Be[0].or(Be[1]);return Be.slice(2).forEach(e=>t=t.or(e)),t})();function is(t){return rs.decode(t)}function ns(t){return e=>t.encoder.encode(e)}function ss(t){if(parseInt(t).toString()!==t)throw new se("Value must be an integer")}function os(t){if(t<0)throw new se("Value must be a positive integer, or zero")}function as(t){return e=>{if(e>t)throw new se(`Value must be smaller than or equal to ${t}`)}}function cs(...t){return e=>{for(const r of t)r(e)}}const de=cs(ss,os,as(65535)),A=-1;let ls=class{constructor(){c(this,"protocolsByCode",new Map);c(this,"protocolsByName",new Map)}getProtocol(e){let r;if(typeof e=="string"?r=this.protocolsByName.get(e):r=this.protocolsByCode.get(e),r==null)throw new ln(`Protocol ${e} was unknown`);return r}addProtocol(e){var r;this.protocolsByCode.set(e.code,e),this.protocolsByName.set(e.name,e),(r=e.aliases)==null||r.forEach(i=>{this.protocolsByName.set(i,e)})}removeProtocol(e){var i;const r=this.protocolsByCode.get(e);r!=null&&(this.protocolsByCode.delete(r.code),this.protocolsByName.delete(r.name),(i=r.aliases)==null||i.forEach(n=>{this.protocolsByName.delete(n)}))}};const ds=new ls,us=[{code:dn,name:"ip4",size:32,valueToBytes:Mt,bytesToValue:Zn,validate:t=>{if(!Pe(t))throw new se(`Invalid IPv4 address "${t}"`)}},{code:un,name:"tcp",size:16,valueToBytes:Q,bytesToValue:re,validate:de},{code:fn,name:"udp",size:16,valueToBytes:Q,bytesToValue:re,validate:de},{code:hn,name:"dccp",size:16,valueToBytes:Q,bytesToValue:re,validate:de},{code:pn,name:"ip6",size:128,valueToBytes:Yn,bytesToValue:es,stringToValue:ts,validate:t=>{if(!$t(t))throw new se(`Invalid IPv6 address "${t}"`)}},{code:mn,name:"ip6zone",size:A},{code:gn,name:"ipcidr",size:8,bytesToValue:ft("base10"),valueToBytes:ht("base10")},{code:bn,name:"dns",size:A},{code:yn,name:"dns4",size:A},{code:_n,name:"dns6",size:A},{code:wn,name:"dnsaddr",size:A},{code:xn,name:"sctp",size:16,valueToBytes:Q,bytesToValue:re,validate:de},{code:vn,name:"udt"},{code:En,name:"utp"},{code:Tn,name:"unix",size:A,stringToValue:t=>decodeURIComponent(t),valueToString:t=>encodeURIComponent(t)},{code:Cn,name:"p2p",aliases:["ipfs"],size:A,bytesToValue:ft("base58btc"),valueToBytes:t=>t.startsWith("Q")||t.startsWith("1")?ht("base58btc")(t):y.parse(t).multihash.bytes},{code:Pn,name:"onion",size:96,bytesToValue:pt,valueToBytes:Xn},{code:Sn,name:"onion3",size:296,bytesToValue:pt,valueToBytes:Jn},{code:In,name:"garlic64",size:A},{code:zn,name:"garlic32",size:A},{code:Bn,name:"tls"},{code:Dn,name:"sni",size:A},{code:An,name:"noise"},{code:On,name:"quic"},{code:Un,name:"quic-v1"},{code:$n,name:"webtransport"},{code:Mn,name:"certhash",size:A,bytesToValue:ns(He),valueToBytes:is},{code:Nn,name:"http"},{code:Rn,name:"http-path",size:A,stringToValue:t=>`/${decodeURIComponent(t)}`,valueToString:t=>encodeURIComponent(t.substring(1))},{code:Ln,name:"https"},{code:Fn,name:"ws"},{code:Gn,name:"wss"},{code:Vn,name:"p2p-websocket-star"},{code:kn,name:"p2p-stardust"},{code:qn,name:"p2p-webrtc-star"},{code:Wn,name:"p2p-webrtc-direct"},{code:Hn,name:"webrtc-direct"},{code:jn,name:"webrtc"},{code:Kn,name:"p2p-circuit"},{code:Qn,name:"memory",size:A}];us.forEach(t=>{ds.addProtocol(t)});var mt;(function(t){let e;t.codec=()=>(e==null&&(e=Ye((r,i,n={})=>{if(n.lengthDelimited!==!1&&i.fork(),r.publicKey!=null&&r.publicKey.byteLength>0&&(i.uint32(10),i.bytes(r.publicKey)),r.addrs!=null)for(const s of r.addrs)i.uint32(18),i.bytes(s);n.lengthDelimited!==!1&&i.ldelim()},(r,i,n={})=>{var a;const s={publicKey:Re(0),addrs:[]},o=i==null?r.len:r.pos+i;for(;r.pos<o;){const d=r.uint32();switch(d>>>3){case 1:{s.publicKey=r.bytes();break}case 2:{if(((a=n.limits)==null?void 0:a.addrs)!=null&&s.addrs.length===n.limits.addrs)throw new Ge('Decode error - map field "addrs" had too many elements');s.addrs.push(r.bytes());break}default:{r.skipType(d&7);break}}}return s})),e),t.encode=r=>Je(r,t.codec()),t.decode=(r,i)=>Xe(r,t.codec(),i)})(mt||(mt={}));class H extends Error{constructor(){super(...arguments);c(this,"name","InvalidMultiaddrError")}}c(H,"name","InvalidMultiaddrError");class Y extends Error{constructor(){super(...arguments);c(this,"name","ValidationError")}}c(Y,"name","ValidationError");class Nt extends Error{constructor(){super(...arguments);c(this,"name","UnknownProtocolError")}}c(Nt,"name","UnknownProtocolError");const fs=4,hs=6,ps=273,ms=33,gs=41,bs=42,ys=43,_s=53,ws=54,xs=55,vs=56,Es=132,Ts=301,Cs=302,Ps=400,Ss=421,Is=444,zs=445,Bs=446,Ds=447,As=448,Os=449,Us=454,$s=460,Ms=461,Ns=465,Rs=466,Ls=480,Fs=481,Gs=443,Vs=477,ks=478,qs=479,Ws=277,Hs=275,js=276,Ks=280,Qs=281,Xs=290,Js=777;function gt(t){return e=>V(e,t)}function bt(t){return e=>ae(e,t)}function ie(t){return new DataView(t.buffer).getUint16(t.byteOffset).toString()}function X(t){const e=new ArrayBuffer(2);return new DataView(e).setUint16(0,typeof t=="string"?parseInt(t):t),new Uint8Array(e)}function Ys(t){const e=t.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==16)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion address.`);const r=ae(e[0],"base32"),i=parseInt(e[1],10);if(i<1||i>65536)throw new Error("Port number is not in range(1, 65536)");const n=X(i);return Ce([r,n],r.length+n.length)}function Zs(t){const e=t.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==56)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion3 address.`);const r=q.decode(`b${e[0]}`),i=parseInt(e[1],10);if(i<1||i>65536)throw new Error("Port number is not in range(1, 65536)");const n=X(i);return Ce([r,n],r.length+n.length)}function yt(t){const e=t.subarray(0,t.length-2),r=t.subarray(t.length-2),i=V(e,"base32"),n=ie(r);return`${i}:${n}`}const Rt=function(t){t=t.toString().trim();const e=new Uint8Array(4);return t.split(/\./g).forEach((r,i)=>{const n=parseInt(r,10);if(isNaN(n)||n<0||n>255)throw new H("Invalid byte value in IP address");e[i]=n}),e},eo=function(t){let e=0;t=t.toString().trim();const r=t.split(":",8);let i;for(i=0;i<r.length;i++){const s=Pe(r[i]);let o;s&&(o=Rt(r[i]),r[i]=V(o.subarray(0,2),"base16")),o!=null&&++i<8&&r.splice(i,0,V(o.subarray(2,4),"base16"))}if(r[0]==="")for(;r.length<8;)r.unshift("0");else if(r[r.length-1]==="")for(;r.length<8;)r.push("0");else if(r.length<8){for(i=0;i<r.length&&r[i]!=="";i++);const s=[i,1];for(i=9-r.length;i>0;i--)s.push("0");r.splice.apply(r,s)}const n=new Uint8Array(e+16);for(i=0;i<r.length;i++){r[i]===""&&(r[i]="0");const s=parseInt(r[i],16);if(isNaN(s)||s<0||s>65535)throw new H("Invalid byte value in IP address");n[e++]=s>>8&255,n[e++]=s&255}return n},to=function(t){if(t.byteLength!==4)throw new H("IPv4 address was incorrect length");const e=[];for(let r=0;r<t.byteLength;r++)e.push(t[r]);return e.join(".")},ro=function(t){if(t.byteLength!==16)throw new H("IPv6 address was incorrect length");const e=[];for(let i=0;i<t.byteLength;i+=2){const n=t[i],s=t[i+1],o=`${n.toString(16).padStart(2,"0")}${s.toString(16).padStart(2,"0")}`;e.push(o)}const r=e.join(":");try{const i=new URL(`http://[${r}]`);return i.hostname.substring(1,i.hostname.length-1)}catch{throw new H(`Invalid IPv6 address "${r}"`)}};function io(t){try{const e=new URL(`http://[${t}]`);return e.hostname.substring(1,e.hostname.length-1)}catch{throw new H(`Invalid IPv6 address "${t}"`)}}const De=Object.values(be).map(t=>t.decoder),no=(function(){let t=De[0].or(De[1]);return De.slice(2).forEach(e=>t=t.or(e)),t})();function so(t){return no.decode(t)}function oo(t){return e=>t.encoder.encode(e)}function ao(t){if(parseInt(t).toString()!==t)throw new Y("Value must be an integer")}function co(t){if(t<0)throw new Y("Value must be a positive integer, or zero")}function lo(t){return e=>{if(e>t)throw new Y(`Value must be smaller than or equal to ${t}`)}}function uo(...t){return e=>{for(const r of t)r(e)}}const ue=uo(ao,co,lo(65535)),O=-1;class fo{constructor(){c(this,"protocolsByCode",new Map);c(this,"protocolsByName",new Map)}getProtocol(e){let r;if(typeof e=="string"?r=this.protocolsByName.get(e):r=this.protocolsByCode.get(e),r==null)throw new Nt(`Protocol ${e} was unknown`);return r}addProtocol(e){var r;this.protocolsByCode.set(e.code,e),this.protocolsByName.set(e.name,e),(r=e.aliases)==null||r.forEach(i=>{this.protocolsByName.set(i,e)})}removeProtocol(e){var i;const r=this.protocolsByCode.get(e);r!=null&&(this.protocolsByCode.delete(r.code),this.protocolsByName.delete(r.name),(i=r.aliases)==null||i.forEach(n=>{this.protocolsByName.delete(n)}))}}const ho=new fo,po=[{code:fs,name:"ip4",size:32,valueToBytes:Rt,bytesToValue:to,validate:t=>{if(!Pe(t))throw new Y(`Invalid IPv4 address "${t}"`)}},{code:hs,name:"tcp",size:16,valueToBytes:X,bytesToValue:ie,validate:ue},{code:ps,name:"udp",size:16,valueToBytes:X,bytesToValue:ie,validate:ue},{code:ms,name:"dccp",size:16,valueToBytes:X,bytesToValue:ie,validate:ue},{code:gs,name:"ip6",size:128,valueToBytes:eo,bytesToValue:ro,stringToValue:io,validate:t=>{if(!$t(t))throw new Y(`Invalid IPv6 address "${t}"`)}},{code:bs,name:"ip6zone",size:O},{code:ys,name:"ipcidr",size:8,bytesToValue:gt("base10"),valueToBytes:bt("base10")},{code:_s,name:"dns",size:O,resolvable:!0},{code:ws,name:"dns4",size:O,resolvable:!0},{code:xs,name:"dns6",size:O,resolvable:!0},{code:vs,name:"dnsaddr",size:O,resolvable:!0},{code:Es,name:"sctp",size:16,valueToBytes:X,bytesToValue:ie,validate:ue},{code:Ts,name:"udt"},{code:Cs,name:"utp"},{code:Ps,name:"unix",size:O,path:!0,stringToValue:t=>decodeURIComponent(t),valueToString:t=>encodeURIComponent(t)},{code:Ss,name:"p2p",aliases:["ipfs"],size:O,bytesToValue:gt("base58btc"),valueToBytes:t=>t.startsWith("Q")||t.startsWith("1")?bt("base58btc")(t):y.parse(t).multihash.bytes},{code:Is,name:"onion",size:96,bytesToValue:yt,valueToBytes:Ys},{code:zs,name:"onion3",size:296,bytesToValue:yt,valueToBytes:Zs},{code:Bs,name:"garlic64",size:O},{code:Ds,name:"garlic32",size:O},{code:As,name:"tls"},{code:Os,name:"sni",size:O},{code:Us,name:"noise"},{code:$s,name:"quic"},{code:Ms,name:"quic-v1"},{code:Ns,name:"webtransport"},{code:Rs,name:"certhash",size:O,bytesToValue:oo(He),valueToBytes:so},{code:Ls,name:"http"},{code:Fs,name:"http-path",size:O,stringToValue:t=>`/${decodeURIComponent(t)}`,valueToString:t=>encodeURIComponent(t.substring(1))},{code:Gs,name:"https"},{code:Vs,name:"ws"},{code:ks,name:"wss"},{code:qs,name:"p2p-websocket-star"},{code:Ws,name:"p2p-stardust"},{code:Hs,name:"p2p-webrtc-star"},{code:js,name:"p2p-webrtc-direct"},{code:Ks,name:"webrtc-direct"},{code:Qs,name:"webrtc"},{code:Xs,name:"p2p-circuit"},{code:Js,name:"memory",size:O}];po.forEach(t=>{ho.addProtocol(t)});new TextEncoder;new TextDecoder;class mo{constructor(e={}){this.frameBudgetMs=e.frameBudgetMs??4,this.hotStore=e.hotStore||new Map,this.device=null,this.tasks=new Map}async initialize(e={}){if(e.device)return this.device=e.device,this.device;if(typeof navigator>"u"||!navigator.gpu)throw new Error("[GPUHubManager] WebGPU not available in this environment");const r=await navigator.gpu.requestAdapter(e.adapterOptions);if(!r)throw new Error("[GPUHubManager] Failed to acquire GPU adapter");return this.device=await r.requestDevice(e.deviceDescriptor),this.device}setDevice(e){this.device=e}getHotStore(){return this.hotStore}registerHotBuffer(e,r){this.hotStore.set(e,r)}registerHotBufferSet(e,r){this.hotStore.set(e,r)}getHotBufferSet(e){return this.hotStore.get(e)}getHotBuffer(e){return this.hotStore.get(e)}createHotBuffer(e,r,i,n){if(!this.device)throw new Error("[GPUHubManager] Device not initialized");const s=this.device.createBuffer({size:r,usage:i,label:n});return this.hotStore.set(e,s),s}removeHotBuffer(e){this.hotStore.delete(e)}registerTask(e,r){this.tasks.set(e,r)}unregisterTask(e){this.tasks.delete(e)}tick(){}}let K=null,_t=null;async function Po(){if(K)return K;try{return _t=new mo({frameBudgetMs:6}),K=await _t.initialize(),K}catch(t){console.warn("[webgpuphys] GPU hub unavailable, falling back to local WebGPU init",t);const{device:e}=await jt();return K=e,K}}export{we as M,xo as a,wo as c,Po as g,yo as s,_o as u};
