var Dt=Object.defineProperty;var Ut=(r,e,t)=>e in r?Dt(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var l=(r,e,t)=>Ut(r,typeof e!="symbol"?e+"":e,t);import{d as H,i as Rt}from"./device-CAsdAK37.js";const $={BRITTLE_SOLID:0,ELASTIC_SOLID:1,LIQUID:2,GAS:3,GRANULAR:4,IRON:5},he=160,v={position:0,materialType:12,velocity:16,phase:28,mass:32,volume0:36,temperature:40,damage:44,F:48,C:96,mu:144,lambda:148,restDensity:152,phaseFraction:156},Nt=32,oe=64,Ot=1e5,L={ice:{mu:50,lambda:50},water:{stiffness:50},steam:{gasConstant:5},rubber:{mu:5,lambda:20},iron:{mu:200,lambda:300}},F={stiffness:50,restDensity:1,dynamicViscosity:.1,dt:.1,subSteps:4,fixedPointScale:Ot,tensileStrength:10,damageRate:2,thermalDiffusivity:.05,ambientPressure:1};function ut(r){return r*he}function Lt(r){return r*Nt}function kt(r,e=0){const t=e*he;return{position:new Float32Array(r,t+v.position,3),materialType:new Uint32Array(r,t+v.materialType,1),velocity:new Float32Array(r,t+v.velocity,3),phase:new Uint32Array(r,t+v.phase,1),mass:new Float32Array(r,t+v.mass,1),volume0:new Float32Array(r,t+v.volume0,1),temperature:new Float32Array(r,t+v.temperature,1),damage:new Float32Array(r,t+v.damage,1),F:new Float32Array(r,t+v.F,12),C:new Float32Array(r,t+v.C,12),mu:new Float32Array(r,t+v.mu,1),lambda:new Float32Array(r,t+v.lambda,1),restDensity:new Float32Array(r,t+v.restDensity,1),phaseFraction:new Float32Array(r,t+v.phaseFraction,1)}}function Ft(r,e,t){const i=ut(e),n=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC;return r.createBuffer({label:"mpm-particles",size:i,usage:n})}function Gt(r,e,t){const i=Lt(e),n=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC;return r.createBuffer({label:"mpm-grid",size:i,usage:n})}const $e=(r,e)=>Math.ceil(r/e);class $t{constructor(e,t={}){this.device=e,this.constants={...F,...t.constants??{}},this.iterations=t.iterations??1,this.pipelines={},this.bindGroups={},this.particleCount=0,this.gridCount=0}configure({pipelines:e,bindGroups:t}){this.pipelines={...e},this.bindGroups={...t}}setCounts({particleCount:e,gridCount:t}){this.particleCount=e??this.particleCount,this.gridCount=t??this.gridCount}step(e,t){if(!e)throw new Error("MpmDomain.step requires a command encoder");if(!this._hasPipelines())throw new Error("MpmDomain pipelines not configured");const i=$e(this.particleCount,oe),n=$e(this.gridCount,oe);for(let s=0;s<this.iterations;s+=1)this._runPass(e,"clearGrid",n),this._runPass(e,"p2g1",i),this._runPass(e,"p2g2",i),this._runPass(e,"updateGrid",n),this._runPass(e,"g2p",i),this.pipelines.copyPosition&&this.bindGroups.copyPosition&&this._runPass(e,"copyPosition",i)}_runPass(e,t,i){const n=this.pipelines[t],s=this.bindGroups[t];if(!n||!s)throw new Error(`Missing pipeline or bind group for ${t}`);const o=e.beginComputePass({label:`mpm-${t}`});o.setPipeline(n),o.setBindGroup(0,s),o.dispatchWorkgroups(i),o.end()}_hasPipelines(){return this.pipelines.clearGrid&&this.pipelines.p2g1&&this.pipelines.p2g2&&this.pipelines.updateGrid&&this.pipelines.g2p&&this.bindGroups.clearGrid&&this.bindGroups.p2g1&&this.bindGroups.p2g2&&this.bindGroups.updateGrid&&this.bindGroups.g2p}}const pe=`
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
`,me=`
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
`,Me=`
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
`,Vt=`
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
`,dt=`
struct SimulationUniforms {
  gravity: vec3f,
  ambientPressure: f32,
};
`,ge=`
override fixed_point_multiplier: f32;

fn encodeFixedPoint(f: f32) -> i32 {
  return i32(f * fixed_point_multiplier);
}

fn decodeFixedPoint(v: i32) -> f32 {
  return f32(v) / fixed_point_multiplier;
}
`,qt=`
${Me}

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
`,Ht=`
${pe}
${me}
${Vt}
${ge}

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
`,Wt=`
${pe}
${me}

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

${dt}
${ge}

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
`,jt=`
${Me}

${dt}
${ge}
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
`,Kt=`
${pe}
${me}
${Me}

struct MouseInteraction {
  point: vec3f,
  radius: f32,
  velocity: vec3f,     // For moving heat sources
  temperature: f32,    // Heat source temperature (0 = no thermal effect)
};

${ge}
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
`,Xt=`
${pe}
${me}

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
`;function Qt(r,e=F){const t=e.tensileStrength??0,i=e.damageRate??0,n=e.restDensity??F.restDensity,s=e.stiffness??F.stiffness,o=e.dynamicViscosity??F.dynamicViscosity,a=e.dt??F.dt,c=e.fixedPointScale??F.fixedPointScale,f=H(r,qt,"mpm-clear-grid"),h=H(r,Ht,"mpm-p2g1"),g=H(r,Wt,"mpm-p2g2"),m=H(r,jt,"mpm-update-grid"),C=H(r,Kt,"mpm-g2p"),u=H(r,Xt,"mpm-copy-position");return{clearGrid:r.createComputePipeline({label:"mpm-clear-grid",layout:"auto",compute:{module:f}}),p2g1:r.createComputePipeline({label:"mpm-p2g1",layout:"auto",compute:{module:h,constants:{fixed_point_multiplier:c}}}),p2g2:r.createComputePipeline({label:"mpm-p2g2",layout:"auto",compute:{module:g,constants:{fixed_point_multiplier:c,stiffness:s,rest_density:n,dynamic_viscosity:o,dt:a,tensile_strength:t,damage_rate:i}}}),updateGrid:r.createComputePipeline({label:"mpm-update-grid",layout:"auto",compute:{module:m,constants:{fixed_point_multiplier:e.fixedPointScale,dt:e.dt,thermal_diffusivity:e.thermalDiffusivity??.1}}}),g2p:r.createComputePipeline({label:"mpm-g2p",layout:"auto",compute:{module:C,constants:{fixed_point_multiplier:e.fixedPointScale,dt:e.dt}}}),copyPosition:r.createComputePipeline({label:"mpm-copy-position",layout:"auto",compute:{module:u}})}}function Jt(r,e,t){const{particleBuffer:i,gridBuffer:n,initBoxBuffer:s,realBoxBuffer:o,interactionBuffer:a,posVelBuffer:c,simUniformBuffer:f}=t,h={clearGrid:r.createBindGroup({layout:e.clearGrid.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n}}]}),p2g1:r.createBindGroup({layout:e.p2g1.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:s}}]}),p2g2:r.createBindGroup({layout:e.p2g2.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:f}}]}),updateGrid:r.createBindGroup({layout:e.updateGrid.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:f}}]}),g2p:r.createBindGroup({layout:e.g2p.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:s}},{binding:4,resource:{buffer:a}}]})};return e.copyPosition&&c&&(h.copyPosition=r.createBindGroup({layout:e.copyPosition.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:c}}]})),h}function Ve(r,e,t){const i=new Float32Array(4);i.set(e.slice(0,3));const n=r.createBuffer({label:t??"vec3-uniform",size:i.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(n,0,i),n}function Yt(r,e,t){const i=new Float32Array(4);i.set(e.slice(0,3)),i[3]=t;const n=r.createBuffer({label:"mpm-sim-uniforms",size:i.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(n,0,i),n}function cs(r,e){const{particleCount:t,gridSize:i,posVelBuffer:n,interactionBuffer:s,constants:o,iterations:a}=e;if(!i)throw new Error("gridSize {x,y,z} is required");const c=Math.ceil(i.x)*Math.ceil(i.y)*Math.ceil(i.z),f=Ft(r,t),h=Gt(r,c),g=Ve(r,[i.x,i.y,i.z],"mpm-init-box"),m=Ve(r,[i.x,i.y,i.z],"mpm-real-box"),C=(o==null?void 0:o.ambientPressure)??F.ambientPressure,u=Yt(r,[0,-.3,0],C);let d=s;if(!d){d=r.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,label:"mpm-interaction-default"});const T=new Float32Array(8);T[3]=-1,r.queue.writeBuffer(d,0,T)}const p=Qt(r,o),w=Jt(r,p,{particleBuffer:f,gridBuffer:h,initBoxBuffer:g,realBoxBuffer:m,simUniformBuffer:u,interactionBuffer:d,posVelBuffer:n}),x=new $t(r,{constants:o,iterations:a});return x.configure({pipelines:p,bindGroups:w}),x.setCounts({particleCount:t,gridCount:c}),{domain:x,pipelines:p,bindGroups:w,buffers:{particleBuffer:f,gridBuffer:h,initBoxBuffer:g,realBoxBuffer:m,simUniformBuffer:u,interactionBuffer:d,posVelBuffer:n},dispatch:{particle:Math.ceil(t/oe),grid:Math.ceil(c/oe)}}}function us(r,e,t){const i=t.byteLength??t.length;if(i>e.size)throw new Error(`Particle data (${i}) exceeds buffer size (${e.size})`);r.queue.writeBuffer(e,0,t)}const Zt=()=>[1,0,0,0,0,1,0,0,0,0,1,0],er=()=>[0,0,0,0,0,0,0,0,0,0,0,0];function ds(r){const{count:e,gridSize:t,start:i=[0,0,0],spacing:n=.65,jitter:s=0,materialType:o=$.LIQUID,mass:a=1,temperature:c=300,phase:f=null,mu:h=null,lambda:g=null,restDensity:m=1,cubeSideCount:C=null}=r;if(!e||!t)throw new Error("count and gridSize are required");let u,d,p;switch(o){case $.BRITTLE_SOLID:u=0,d=L.ice.mu,p=L.ice.lambda;break;case $.ELASTIC_SOLID:u=0,d=L.rubber.mu,p=L.rubber.lambda;break;case $.LIQUID:u=1,d=0,p=L.water.stiffness;break;case $.GAS:u=2,d=0,p=L.steam.gasConstant;break;case $.IRON:u=0,d=L.iron.mu,p=L.iron.lambda;break;case $.GRANULAR:u=0,d=100,p=100;break;default:u=1,d=0,p=50}const w=f!==null?f:u,x=h!==null?h:d,T=g!==null?g:p,P=new ArrayBuffer(ut(e));let b=0;const D=C!==null?C:Math.ceil(Math.cbrt(e));for(let I=0;I<D&&b<e;I++)for(let B=0;B<D&&b<e;B++)for(let O=0;O<D&&b<e;O++){const A=kt(P,b),It=Math.min(i[0]+B*n,t.x-2),zt=Math.min(i[1]+I*n,t.y-2),At=Math.min(i[2]+O*n,t.z-2),Ct=s?(Math.random()*2-1)*s:0,Bt=s?(Math.random()*2-1)*s:0,Mt=s?(Math.random()*2-1)*s:0;A.position.set([It+Ct,zt+Bt,At+Mt]),A.materialType[0]=o,A.velocity.set([0,0,0]),A.phase[0]=w,A.mass[0]=a,A.volume0[0]=a/m,A.temperature[0]=c,A.damage[0]=0,A.F.set(Zt()),A.C.set(er()),A.mu[0]=x,A.lambda[0]=T,A.restDensity[0]=m,A.phaseFraction[0]=0,b+=1}if(b<e)throw new Error(`Could not place all particles; placed ${b} of ${e}`);return P}async function tr(r,e,t){var a;const i=t*he,n=r.createBuffer({label:"mpm-particle-staging",size:i,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),s=r.createCommandEncoder({label:"mpm-diagnostics-copy"});s.copyBufferToBuffer(e,0,n,0,i),r.queue.submit([s.finish()]),await n.mapAsync(GPUMapMode.READ);const o=n.getMappedRange().slice(0);return n.unmap(),(a=n.destroy)==null||a.call(n),o}async function fs(r,e,t){const i=await tr(r,e,t),n=v.mass/4,s=v.velocity/4,o=new Float32Array(i);let a=0,c=0,f=0,h=0;for(let g=0;g<t;g+=1){const m=he/4*g,C=o[m+n],u=o[m+s+0],d=o[m+s+1],p=o[m+s+2];a+=C,c+=C*u,f+=C*d,h+=C*p}return{mass:a,momentum:[c,f,h]}}function rr(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function De(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return r;if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return new Uint8Array(r.buffer,r.byteOffset,r.byteLength);throw new Error("Unknown type, must be binary type")}function ir(r){return new TextEncoder().encode(r)}function nr(r){return new TextDecoder().decode(r)}function sr(r,e){if(r.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),i=0;i<t.length;i++)t[i]=255;for(var n=0;n<r.length;n++){var s=r.charAt(n),o=s.charCodeAt(0);if(t[o]!==255)throw new TypeError(s+" is ambiguous");t[o]=n}var a=r.length,c=r.charAt(0),f=Math.log(a)/Math.log(256),h=Math.log(256)/Math.log(a);function g(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var d=0,p=0,w=0,x=u.length;w!==x&&u[w]===0;)w++,d++;for(var T=(x-w)*h+1>>>0,P=new Uint8Array(T);w!==x;){for(var b=u[w],D=0,I=T-1;(b!==0||D<p)&&I!==-1;I--,D++)b+=256*P[I]>>>0,P[I]=b%a>>>0,b=b/a>>>0;if(b!==0)throw new Error("Non-zero carry");p=D,w++}for(var B=T-p;B!==T&&P[B]===0;)B++;for(var O=c.repeat(d);B<T;++B)O+=r.charAt(P[B]);return O}function m(u){if(typeof u!="string")throw new TypeError("Expected String");if(u.length===0)return new Uint8Array;var d=0;if(u[d]!==" "){for(var p=0,w=0;u[d]===c;)p++,d++;for(var x=(u.length-d)*f+1>>>0,T=new Uint8Array(x);u[d];){var P=t[u.charCodeAt(d)];if(P===255)return;for(var b=0,D=x-1;(P!==0||b<w)&&D!==-1;D--,b++)P+=a*T[D]>>>0,T[D]=P%256>>>0,P=P/256>>>0;if(P!==0)throw new Error("Non-zero carry");w=b,d++}if(u[d]!==" "){for(var I=x-w;I!==x&&T[I]===0;)I++;for(var B=new Uint8Array(p+(x-I)),O=p;I!==x;)B[O++]=T[I++];return B}}}function C(u){var d=m(u);if(d)return d;throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:m,decode:C}}var or=sr,ar=or;class lr{constructor(e,t,i){l(this,"name");l(this,"prefix");l(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=i}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class cr{constructor(e,t,i){l(this,"name");l(this,"prefix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=e,this.prefix=t;const n=t.codePointAt(0);if(n===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=n,this.baseDecode=i}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return ft(this,e)}}class ur{constructor(e){l(this,"decoders");this.decoders=e}or(e){return ft(this,e)}decode(e){const t=e[0],i=this.decoders[t];if(i!=null)return i.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}function ft(r,e){return new ur({...r.decoders??{[r.prefix]:r},...e.decoders??{[e.prefix]:e}})}class dr{constructor(e,t,i,n){l(this,"name");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=i,this.baseDecode=n,this.encoder=new lr(e,t,i),this.decoder=new cr(e,t,n)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function be({name:r,prefix:e,encode:t,decode:i}){return new dr(r,e,t,i)}function te({name:r,prefix:e,alphabet:t}){const{encode:i,decode:n}=ar(t,r);return be({prefix:e,name:r,encode:i,decode:s=>De(n(s))})}function fr(r,e,t,i){let n=r.length;for(;r[n-1]==="=";)--n;const s=new Uint8Array(n*t/8|0);let o=0,a=0,c=0;for(let f=0;f<n;++f){const h=e[r[f]];if(h===void 0)throw new SyntaxError(`Non-${i} character`);a=a<<t|h,o+=t,o>=8&&(o-=8,s[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return s}function hr(r,e,t){const i=e[e.length-1]==="=",n=(1<<t)-1;let s="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=8;o>t;)o-=t,s+=e[n&a>>o];if(o!==0&&(s+=e[n&a<<t-o]),i)for(;(s.length*t&7)!==0;)s+="=";return s}function pr(r){const e={};for(let t=0;t<r.length;++t)e[r[t]]=t;return e}function _({name:r,prefix:e,bitsPerChar:t,alphabet:i}){const n=pr(i);return be({prefix:e,name:r,encode(s){return hr(s,i,t)},decode(s){return fr(s,n,t,r)}})}const N=te({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),mr=te({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),gr=Object.freeze(Object.defineProperty({__proto__:null,base58btc:N,base58flickr:mr},Symbol.toStringTag,{value:"Module"})),K=_({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),br=_({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),yr=_({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),_r=_({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),wr=_({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),xr=_({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),vr=_({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),Er=_({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),Sr=_({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),Tr=Object.freeze(Object.defineProperty({__proto__:null,base32:K,base32hex:wr,base32hexpad:vr,base32hexpadupper:Er,base32hexupper:xr,base32pad:yr,base32padupper:_r,base32upper:br,base32z:Sr},Symbol.toStringTag,{value:"Module"})),se=te({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),Pr=te({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}),Ir=Object.freeze(Object.defineProperty({__proto__:null,base36:se,base36upper:Pr},Symbol.toStringTag,{value:"Module"}));var zr=ht,qe=128,Ar=-128,Cr=Math.pow(2,31);function ht(r,e,t){e=e||[],t=t||0;for(var i=t;r>=Cr;)e[t++]=r&255|qe,r/=128;for(;r&Ar;)e[t++]=r&255|qe,r>>>=7;return e[t]=r|0,ht.bytes=t-i+1,e}var Br=Ee,Mr=128,He=127;function Ee(r,i){var t=0,i=i||0,n=0,s=i,o,a=r.length;do{if(s>=a)throw Ee.bytes=0,new RangeError("Could not decode varint");o=r[s++],t+=n<28?(o&He)<<n:(o&He)*Math.pow(2,n),n+=7}while(o>=Mr);return Ee.bytes=s-i,t}var Dr=Math.pow(2,7),Ur=Math.pow(2,14),Rr=Math.pow(2,21),Nr=Math.pow(2,28),Or=Math.pow(2,35),Lr=Math.pow(2,42),kr=Math.pow(2,49),Fr=Math.pow(2,56),Gr=Math.pow(2,63),$r=function(r){return r<Dr?1:r<Ur?2:r<Rr?3:r<Nr?4:r<Or?5:r<Lr?6:r<kr?7:r<Fr?8:r<Gr?9:10},Vr={encode:zr,decode:Br,encodingLength:$r},ae=Vr;function Se(r,e=0){return[ae.decode(r,e),ae.decode.bytes]}function le(r,e,t=0){return ae.encode(r,e,t),e}function ce(r){return ae.encodingLength(r)}function qr(r,e){const t=e.byteLength,i=ce(r),n=i+ce(t),s=new Uint8Array(n+t);return le(r,s,0),le(t,s,i),s.set(e,n),new Ue(r,t,e,s)}function Hr(r){const e=De(r),[t,i]=Se(e),[n,s]=Se(e.subarray(i)),o=e.subarray(i+s);if(o.byteLength!==n)throw new Error("Incorrect length");return new Ue(t,n,o,e)}function Wr(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof Uint8Array&&rr(r.bytes,t.bytes)}}class Ue{constructor(e,t,i,n){l(this,"code");l(this,"size");l(this,"digest");l(this,"bytes");this.code=e,this.size=t,this.digest=i,this.bytes=n}}function We(r,e){const{bytes:t,version:i}=r;switch(i){case 0:return Kr(t,Te(r),e??N.encoder);default:return Xr(t,Te(r),e??K.encoder)}}const je=new WeakMap;function Te(r){const e=je.get(r);if(e==null){const t=new Map;return je.set(r,t),t}return e}var at;class y{constructor(e,t,i,n){l(this,"code");l(this,"version");l(this,"multihash");l(this,"bytes");l(this,"/");l(this,at,"CID");this.code=t,this.version=e,this.multihash=i,this.bytes=n,this["/"]=n}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==Q)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==Qr)throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");return y.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,i=qr(e,t);return y.createV1(this.code,i)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`)}}equals(e){return y.equals(this,e)}static equals(e,t){const i=t;return i!=null&&e.code===i.code&&e.version===i.version&&Wr(e.multihash,i.multihash)}toString(e){return We(this,e)}toJSON(){return{"/":We(this)}}link(){return this}[(at=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof y)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===t){const{version:i,code:n,multihash:s,bytes:o}=t;return new y(i,n,s,o??Ke(i,n,s.bytes))}else if(t[Jr]===!0){const{version:i,multihash:n,code:s}=t,o=Hr(n);return y.create(i,s,o)}else return null}static create(e,t,i){if(typeof t!="number")throw new Error("String codecs are no longer supported");if(!(i.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{if(t!==Q)throw new Error(`Version 0 CID must use dag-pb (code: ${Q}) block encoding`);return new y(e,t,i,i.bytes)}case 1:{const n=Ke(e,t,i.bytes);return new y(e,t,i,n)}default:throw new Error("Invalid version")}}static createV0(e){return y.create(0,Q,e)}static createV1(e,t){return y.create(1,e,t)}static decode(e){const[t,i]=y.decodeFirst(e);if(i.length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=y.inspectBytes(e),i=t.size-t.multihashSize,n=De(e.subarray(i,i+t.multihashSize));if(n.byteLength!==t.multihashSize)throw new Error("Incorrect length");const s=n.subarray(t.multihashSize-t.digestSize),o=new Ue(t.multihashCode,t.digestSize,s,n);return[t.version===0?y.createV0(o):y.createV1(t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const i=()=>{const[g,m]=Se(e.subarray(t));return t+=m,g};let n=i(),s=Q;if(n===18?(n=0,t=0):s=i(),n!==0&&n!==1)throw new RangeError(`Invalid CID version ${n}`);const o=t,a=i(),c=i(),f=t+c,h=f-o;return{version:n,codec:s,multihashCode:a,digestSize:c,multihashSize:h,size:f}}static parse(e,t){const[i,n]=jr(e,t),s=y.decode(n);if(s.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Te(s).set(i,e),s}}function jr(r,e){switch(r[0]){case"Q":{const t=e??N;return[N.prefix,t.decode(`${N.prefix}${r}`)]}case N.prefix:{const t=e??N;return[N.prefix,t.decode(r)]}case K.prefix:{const t=e??K;return[K.prefix,t.decode(r)]}case se.prefix:{const t=e??se;return[se.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function Kr(r,e,t){const{prefix:i}=t;if(i!==N.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const n=e.get(i);if(n==null){const s=t.encode(r).slice(1);return e.set(i,s),s}else return n}function Xr(r,e,t){const{prefix:i}=t,n=e.get(i);if(n==null){const s=t.encode(r);return e.set(i,s),s}else return n}const Q=112,Qr=18;function Ke(r,e,t){const i=ce(r),n=i+ce(e),s=new Uint8Array(n+t.byteLength);return le(r,s,0),le(e,s,i),s.set(t,n),s}const Jr=Symbol.for("@ipld/js-cid/CID");function Pe(r=0){return new Uint8Array(r)}function ee(r=0){return new Uint8Array(r)}function pt(r,e){e==null&&(e=r.reduce((n,s)=>n+s.length,0));const t=ee(e);let i=0;for(const n of r)t.set(n,i),i+=n.length;return t}const Yr=te({prefix:"9",name:"base10",alphabet:"0123456789"}),Zr=Object.freeze(Object.defineProperty({__proto__:null,base10:Yr},Symbol.toStringTag,{value:"Module"})),ei=_({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),ti=_({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),ri=Object.freeze(Object.defineProperty({__proto__:null,base16:ei,base16upper:ti},Symbol.toStringTag,{value:"Module"})),ii=_({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),ni=Object.freeze(Object.defineProperty({__proto__:null,base2:ii},Symbol.toStringTag,{value:"Module"})),mt=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),si=mt.reduce((r,e,t)=>(r[t]=e,r),[]),oi=mt.reduce((r,e,t)=>{const i=e.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${e}`);return r[i]=t,r},[]);function ai(r){return r.reduce((e,t)=>(e+=si[t],e),"")}function li(r){const e=[];for(const t of r){const i=t.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${t}`);const n=oi[i];if(n==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(n)}return new Uint8Array(e)}const ci=be({prefix:"🚀",name:"base256emoji",encode:ai,decode:li}),ui=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:ci},Symbol.toStringTag,{value:"Module"})),di=_({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),fi=_({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),gt=_({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),hi=_({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),pi=Object.freeze(Object.defineProperty({__proto__:null,base64:di,base64pad:fi,base64url:gt,base64urlpad:hi},Symbol.toStringTag,{value:"Module"})),mi=_({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),gi=Object.freeze(Object.defineProperty({__proto__:null,base8:mi},Symbol.toStringTag,{value:"Module"})),bi=be({prefix:"\0",name:"identity",encode:r=>nr(r),decode:r=>ir(r)}),yi=Object.freeze(Object.defineProperty({__proto__:null,identity:bi},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const Ie={...yi,...ni,...gi,...Zr,...ri,...Tr,...Ir,...gr,...pi,...ui};function bt(r,e,t,i){return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:i}}}const Xe=bt("utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),ye=bt("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=ee(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}),yt={utf8:Xe,"utf-8":Xe,hex:Ie.base16,latin1:ye,ascii:ye,binary:ye,...Ie};function Re(r,e="utf8"){const t=yt[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}function ue(r,e="utf8"){const t=yt[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(r).substring(1)}const _i=Math.pow(2,7),wi=Math.pow(2,14),xi=Math.pow(2,21),_t=Math.pow(2,28),wt=Math.pow(2,35),xt=Math.pow(2,42),vt=Math.pow(2,49),z=128,k=127;function Ne(r){if(r<_i)return 1;if(r<wi)return 2;if(r<xi)return 3;if(r<_t)return 4;if(r<wt)return 5;if(r<xt)return 6;if(r<vt)return 7;if(Number.MAX_SAFE_INTEGER!=null&&r>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function vi(r,e,t=0){switch(Ne(r)){case 8:e[t++]=r&255|z,r/=128;case 7:e[t++]=r&255|z,r/=128;case 6:e[t++]=r&255|z,r/=128;case 5:e[t++]=r&255|z,r/=128;case 4:e[t++]=r&255|z,r>>>=7;case 3:e[t++]=r&255|z,r>>>=7;case 2:e[t++]=r&255|z,r>>>=7;case 1:{e[t++]=r&255,r>>>=7;break}default:throw new Error("unreachable")}return e}function Ei(r,e){let t=r[e],i=0;if(i+=t&k,t<z||(t=r[e+1],i+=(t&k)<<7,t<z)||(t=r[e+2],i+=(t&k)<<14,t<z)||(t=r[e+3],i+=(t&k)<<21,t<z)||(t=r[e+4],i+=(t&k)*_t,t<z)||(t=r[e+5],i+=(t&k)*wt,t<z)||(t=r[e+6],i+=(t&k)*xt,t<z)||(t=r[e+7],i+=(t&k)*vt,t<z))return i;throw new RangeError("Could not decode varint")}const Oe=new Float32Array([-0]),G=new Uint8Array(Oe.buffer);function Si(r,e,t){Oe[0]=r,e[t]=G[0],e[t+1]=G[1],e[t+2]=G[2],e[t+3]=G[3]}function Ti(r,e){return G[0]=r[e],G[1]=r[e+1],G[2]=r[e+2],G[3]=r[e+3],Oe[0]}const Le=new Float64Array([-0]),E=new Uint8Array(Le.buffer);function Pi(r,e,t){Le[0]=r,e[t]=E[0],e[t+1]=E[1],e[t+2]=E[2],e[t+3]=E[3],e[t+4]=E[4],e[t+5]=E[5],e[t+6]=E[6],e[t+7]=E[7]}function Ii(r,e){return E[0]=r[e],E[1]=r[e+1],E[2]=r[e+2],E[3]=r[e+3],E[4]=r[e+4],E[5]=r[e+5],E[6]=r[e+6],E[7]=r[e+7],Le[0]}const zi=BigInt(Number.MAX_SAFE_INTEGER),Ai=BigInt(Number.MIN_SAFE_INTEGER);class S{constructor(e,t){l(this,"lo");l(this,"hi");this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let i=~this.hi>>>0;return t===0&&(i=i+1>>>0),-(t+i*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let i=~this.hi>>>0;return t===0&&(i=i+1>>>0),-(BigInt(t)+(BigInt(i)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,i=this.hi>>>24;return i===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:i<128?9:10}static fromBigInt(e){if(e===0n)return V;if(e<zi&&e>Ai)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let i=e>>32n,n=e-(i<<32n);return t&&(i=~i|0n,n=~n|0n,++n>Qe&&(n=0n,++i>Qe&&(i=0n))),new S(Number(n),Number(i))}static fromNumber(e){if(e===0)return V;const t=e<0;t&&(e=-e);let i=e>>>0,n=(e-i)/4294967296>>>0;return t&&(n=~n>>>0,i=~i>>>0,++i>4294967295&&(i=0,++n>4294967295&&(n=0))),new S(i,n)}static from(e){return typeof e=="number"?S.fromNumber(e):typeof e=="bigint"?S.fromBigInt(e):typeof e=="string"?S.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new S(e.low>>>0,e.high>>>0):V}}const V=new S(0,0);V.toBigInt=function(){return 0n};V.zzEncode=V.zzDecode=function(){return this};V.length=function(){return 1};const Qe=4294967296n;function Ci(r){let e=0,t=0;for(let i=0;i<r.length;++i)t=r.charCodeAt(i),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(r.charCodeAt(i+1)&64512)===56320?(++i,e+=4):e+=3;return e}function Bi(r,e,t){if(t-e<1)return"";let n;const s=[];let o=0,a;for(;e<t;)a=r[e++],a<128?s[o++]=a:a>191&&a<224?s[o++]=(a&31)<<6|r[e++]&63:a>239&&a<365?(a=((a&7)<<18|(r[e++]&63)<<12|(r[e++]&63)<<6|r[e++]&63)-65536,s[o++]=55296+(a>>10),s[o++]=56320+(a&1023)):s[o++]=(a&15)<<12|(r[e++]&63)<<6|r[e++]&63,o>8191&&((n??(n=[])).push(String.fromCharCode.apply(String,s)),o=0);return n!=null?(o>0&&n.push(String.fromCharCode.apply(String,s.slice(0,o))),n.join("")):String.fromCharCode.apply(String,s.slice(0,o))}function Et(r,e,t){const i=t;let n,s;for(let o=0;o<r.length;++o)n=r.charCodeAt(o),n<128?e[t++]=n:n<2048?(e[t++]=n>>6|192,e[t++]=n&63|128):(n&64512)===55296&&((s=r.charCodeAt(o+1))&64512)===56320?(n=65536+((n&1023)<<10)+(s&1023),++o,e[t++]=n>>18|240,e[t++]=n>>12&63|128,e[t++]=n>>6&63|128,e[t++]=n&63|128):(e[t++]=n>>12|224,e[t++]=n>>6&63|128,e[t++]=n&63|128);return t-i}function U(r,e){return RangeError(`index out of range: ${r.pos} + ${e??1} > ${r.len}`)}function re(r,e){return(r[e-4]|r[e-3]<<8|r[e-2]<<16|r[e-1]<<24)>>>0}class Mi{constructor(e){l(this,"buf");l(this,"pos");l(this,"len");l(this,"_slice",Uint8Array.prototype.subarray);this.buf=e,this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,U(this,10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw U(this,4);return re(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw U(this,4);return re(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw U(this,4);const e=Ti(this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)throw U(this,4);const e=Ii(this.buf,this.pos);return this.pos+=8,e}bytes(){const e=this.uint32(),t=this.pos,i=this.pos+e;if(i>this.len)throw U(this,e);return this.pos+=e,t===i?new Uint8Array(0):this.buf.subarray(t,i)}string(){const e=this.bytes();return Bi(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+e>this.len)throw U(this,e);this.pos+=e}else do if(this.pos>=this.len)throw U(this);while((this.buf[this.pos++]&128)!==0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new S(0,0);let t=0;if(this.len-this.pos>4){for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){if(this.pos>=this.len)throw U(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw U(this);if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.len)throw U(this,8);const e=re(this.buf,this.pos+=4),t=re(this.buf,this.pos+=4);return new S(e,t)}int64(){return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=Ei(this.buf,this.pos);return this.pos+=Ne(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){return this.readFixed64().toString()}}function Di(r){return new Mi(r instanceof Uint8Array?r:r.subarray())}function ke(r,e,t){const i=Di(r);return e.decode(i,void 0,t)}function Ui(r){let i,n=8192;return function(o){if(o<1||o>4096)return ee(o);n+o>8192&&(i=ee(8192),n=0);const a=i.subarray(n,n+=o);return(n&7)!==0&&(n=(n|7)+1),a}}class Y{constructor(e,t,i){l(this,"fn");l(this,"len");l(this,"next");l(this,"val");this.fn=e,this.len=t,this.next=void 0,this.val=i}}function _e(){}class Ri{constructor(e){l(this,"head");l(this,"tail");l(this,"len");l(this,"next");this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const Ni=Ui();function Oi(r){return globalThis.Buffer!=null?ee(r):Ni(r)}class ze{constructor(){l(this,"len");l(this,"head");l(this,"tail");l(this,"states");this.len=0,this.head=new Y(_e,0,0),this.tail=this.head,this.states=null}_push(e,t,i){return this.tail=this.tail.next=new Y(e,t,i),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.tail.next=new ki((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(ie,10,S.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=S.fromBigInt(e);return this._push(ie,t.length(),t)}uint64Number(e){return this._push(vi,Ne(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=S.fromBigInt(e).zzEncode();return this._push(ie,t.length(),t)}sint64Number(e){const t=S.fromNumber(e).zzEncode();return this._push(ie,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(we,1,e?1:0)}fixed32(e){return this._push(J,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=S.fromBigInt(e);return this._push(J,4,t.lo)._push(J,4,t.hi)}fixed64Number(e){const t=S.fromNumber(e);return this._push(J,4,t.lo)._push(J,4,t.hi)}fixed64String(e){return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.fixed64String(e)}float(e){return this._push(Si,4,e)}double(e){return this._push(Pi,8,e)}bytes(e){const t=e.length>>>0;return t===0?this._push(we,1,0):this.uint32(t)._push(Fi,t,e)}string(e){const t=Ci(e);return t!==0?this.uint32(t)._push(Et,t,e):this._push(we,1,0)}fork(){return this.states=new Ri(this),this.head=this.tail=new Y(_e,0,0),this.len=0,this}reset(){return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new Y(_e,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,i=this.len;return this.reset().uint32(i),i!==0&&(this.tail.next=e.next,this.tail=t,this.len+=i),this}finish(){let e=this.head.next;const t=Oi(this.len);let i=0;for(;e!=null;)e.fn(e.val,t,i),i+=e.len,e=e.next;return t}}function we(r,e,t){e[t]=r&255}function Li(r,e,t){for(;r>127;)e[t++]=r&127|128,r>>>=7;e[t]=r}class ki extends Y{constructor(t,i){super(Li,t,i);l(this,"next");this.next=void 0}}function ie(r,e,t){for(;r.hi!==0;)e[t++]=r.lo&127|128,r.lo=(r.lo>>>7|r.hi<<25)>>>0,r.hi>>>=7;for(;r.lo>127;)e[t++]=r.lo&127|128,r.lo=r.lo>>>7;e[t++]=r.lo}function J(r,e,t){e[t]=r&255,e[t+1]=r>>>8&255,e[t+2]=r>>>16&255,e[t+3]=r>>>24}function Fi(r,e,t){e.set(r,t)}globalThis.Buffer!=null&&(ze.prototype.bytes=function(r){const e=r.length>>>0;return this.uint32(e),e>0&&this._push(Gi,e,r),this},ze.prototype.string=function(r){const e=globalThis.Buffer.byteLength(r);return this.uint32(e),e>0&&this._push($i,e,r),this});function Gi(r,e,t){e.set(r,t)}function $i(r,e,t){r.length<40?Et(r,e,t):e.utf8Write!=null?e.utf8Write(r,t):e.set(Re(r),t)}function Vi(){return new ze}function Fe(r,e){const t=Vi();return e.encode(r,t,{lengthDelimited:!1}),t.finish()}var Ae;(function(r){r[r.VARINT=0]="VARINT",r[r.BIT64=1]="BIT64",r[r.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",r[r.START_GROUP=3]="START_GROUP",r[r.END_GROUP=4]="END_GROUP",r[r.BIT32=5]="BIT32"})(Ae||(Ae={}));function qi(r,e,t,i){return{name:r,type:e,encode:t,decode:i}}function Ge(r,e){return qi("message",Ae.LENGTH_DELIMITED,r,e)}class Ce extends Error{constructor(){super(...arguments);l(this,"code","ERR_MAX_LENGTH");l(this,"name","MaxLengthError")}}class Hi{constructor(){l(this,"index",0);l(this,"input","")}new(e){return this.index=0,this.input=e,this}readAtomically(e){const t=this.index,i=e();return i===void 0&&(this.index=t),i}parseWith(e){const t=e();if(this.index===this.input.length)return t}peekChar(){if(!(this.index>=this.input.length))return this.input[this.index]}readChar(){if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(e){return this.readAtomically(()=>{const t=this.readChar();if(t===e)return t})}readSeparator(e,t,i){return this.readAtomically(()=>{if(!(t>0&&this.readGivenChar(e)===void 0))return i()})}readNumber(e,t,i,n){return this.readAtomically(()=>{let s=0,o=0;const a=this.peekChar();if(a===void 0)return;const c=a==="0",f=2**(8*n)-1;for(;;){const h=this.readAtomically(()=>{const g=this.readChar();if(g===void 0)return;const m=Number.parseInt(g,e);if(!Number.isNaN(m))return m});if(h===void 0)break;if(s*=e,s+=h,s>f||(o+=1,t!==void 0&&o>t))return}if(o!==0)return!i&&c&&o>1?void 0:s})}readIPv4Addr(){return this.readAtomically(()=>{const e=new Uint8Array(4);for(let t=0;t<e.length;t++){const i=this.readSeparator(".",t,()=>this.readNumber(10,3,!1,1));if(i===void 0)return;e[t]=i}return e})}readIPv6Addr(){const e=t=>{for(let i=0;i<t.length/2;i++){const n=i*2;if(i<t.length-3){const o=this.readSeparator(":",i,()=>this.readIPv4Addr());if(o!==void 0)return t[n]=o[0],t[n+1]=o[1],t[n+2]=o[2],t[n+3]=o[3],[n+4,!0]}const s=this.readSeparator(":",i,()=>this.readNumber(16,4,!0,2));if(s===void 0)return[n,!1];t[n]=s>>8,t[n+1]=s&255}return[t.length,!1]};return this.readAtomically(()=>{const t=new Uint8Array(16),[i,n]=e(t);if(i===16)return t;if(n||this.readGivenChar(":")===void 0||this.readGivenChar(":")===void 0)return;const s=new Uint8Array(14),o=16-(i+2),[a]=e(s.subarray(0,o));return t.set(s.subarray(0,a),16-a),t})}readIPAddr(){return this.readIPv4Addr()??this.readIPv6Addr()}}const Wi=45,ji=15,de=new Hi;function Ki(r){if(!(r.length>ji))return de.new(r).parseWith(()=>de.readIPv4Addr())}function Xi(r){if(r.includes("%")&&(r=r.split("%")[0]),!(r.length>Wi))return de.new(r).parseWith(()=>de.readIPv6Addr())}function St(r){return!!Ki(r)}function Qi(r){return!!Xi(r)}class q extends Error{constructor(){super(...arguments);l(this,"name","InvalidMultiaddrError")}}l(q,"name","InvalidMultiaddrError");class X extends Error{constructor(){super(...arguments);l(this,"name","ValidationError")}}l(X,"name","ValidationError");class Tt extends Error{constructor(){super(...arguments);l(this,"name","UnknownProtocolError")}}l(Tt,"name","UnknownProtocolError");const Ji=4,Yi=6,Zi=273,en=33,tn=41,rn=42,nn=43,sn=53,on=54,an=55,ln=56,cn=132,un=301,dn=302,fn=400,hn=421,pn=444,mn=445,gn=446,bn=447,yn=448,_n=449,wn=454,xn=460,vn=461,En=465,Sn=466,Tn=480,Pn=481,In=443,zn=477,An=478,Cn=479,Bn=277,Mn=275,Dn=276,Un=280,Rn=281,Nn=290,On=777;function Je(r){return e=>ue(e,r)}function Ye(r){return e=>Re(e,r)}function Z(r){return new DataView(r.buffer).getUint16(r.byteOffset).toString()}function j(r){const e=new ArrayBuffer(2);return new DataView(e).setUint16(0,typeof r=="string"?parseInt(r):r),new Uint8Array(e)}function Ln(r){const e=r.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==16)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion address.`);const t=Re(e[0],"base32"),i=parseInt(e[1],10);if(i<1||i>65536)throw new Error("Port number is not in range(1, 65536)");const n=j(i);return pt([t,n],t.length+n.length)}function kn(r){const e=r.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==56)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion3 address.`);const t=K.decode(`b${e[0]}`),i=parseInt(e[1],10);if(i<1||i>65536)throw new Error("Port number is not in range(1, 65536)");const n=j(i);return pt([t,n],t.length+n.length)}function Ze(r){const e=r.subarray(0,r.length-2),t=r.subarray(r.length-2),i=ue(e,"base32"),n=Z(t);return`${i}:${n}`}const Pt=function(r){r=r.toString().trim();const e=new Uint8Array(4);return r.split(/\./g).forEach((t,i)=>{const n=parseInt(t,10);if(isNaN(n)||n<0||n>255)throw new q("Invalid byte value in IP address");e[i]=n}),e},Fn=function(r){let e=0;r=r.toString().trim();const t=r.split(":",8);let i;for(i=0;i<t.length;i++){const s=St(t[i]);let o;s&&(o=Pt(t[i]),t[i]=ue(o.subarray(0,2),"base16")),o!=null&&++i<8&&t.splice(i,0,ue(o.subarray(2,4),"base16"))}if(t[0]==="")for(;t.length<8;)t.unshift("0");else if(t[t.length-1]==="")for(;t.length<8;)t.push("0");else if(t.length<8){for(i=0;i<t.length&&t[i]!=="";i++);const s=[i,1];for(i=9-t.length;i>0;i--)s.push("0");t.splice.apply(t,s)}const n=new Uint8Array(e+16);for(i=0;i<t.length;i++){t[i]===""&&(t[i]="0");const s=parseInt(t[i],16);if(isNaN(s)||s<0||s>65535)throw new q("Invalid byte value in IP address");n[e++]=s>>8&255,n[e++]=s&255}return n},Gn=function(r){if(r.byteLength!==4)throw new q("IPv4 address was incorrect length");const e=[];for(let t=0;t<r.byteLength;t++)e.push(r[t]);return e.join(".")},$n=function(r){if(r.byteLength!==16)throw new q("IPv6 address was incorrect length");const e=[];for(let i=0;i<r.byteLength;i+=2){const n=r[i],s=r[i+1],o=`${n.toString(16).padStart(2,"0")}${s.toString(16).padStart(2,"0")}`;e.push(o)}const t=e.join(":");try{const i=new URL(`http://[${t}]`);return i.hostname.substring(1,i.hostname.length-1)}catch{throw new q(`Invalid IPv6 address "${t}"`)}};function Vn(r){try{const e=new URL(`http://[${r}]`);return e.hostname.substring(1,e.hostname.length-1)}catch{throw new q(`Invalid IPv6 address "${r}"`)}}const xe=Object.values(Ie).map(r=>r.decoder),qn=(function(){let r=xe[0].or(xe[1]);return xe.slice(2).forEach(e=>r=r.or(e)),r})();function Hn(r){return qn.decode(r)}function Wn(r){return e=>r.encoder.encode(e)}function jn(r){if(parseInt(r).toString()!==r)throw new X("Value must be an integer")}function Kn(r){if(r<0)throw new X("Value must be a positive integer, or zero")}function Xn(r){return e=>{if(e>r)throw new X(`Value must be smaller than or equal to ${r}`)}}function Qn(...r){return e=>{for(const t of r)t(e)}}const ne=Qn(jn,Kn,Xn(65535)),M=-1;class Jn{constructor(){l(this,"protocolsByCode",new Map);l(this,"protocolsByName",new Map)}getProtocol(e){let t;if(typeof e=="string"?t=this.protocolsByName.get(e):t=this.protocolsByCode.get(e),t==null)throw new Tt(`Protocol ${e} was unknown`);return t}addProtocol(e){var t;this.protocolsByCode.set(e.code,e),this.protocolsByName.set(e.name,e),(t=e.aliases)==null||t.forEach(i=>{this.protocolsByName.set(i,e)})}removeProtocol(e){var i;const t=this.protocolsByCode.get(e);t!=null&&(this.protocolsByCode.delete(t.code),this.protocolsByName.delete(t.name),(i=t.aliases)==null||i.forEach(n=>{this.protocolsByName.delete(n)}))}}const Yn=new Jn,Zn=[{code:Ji,name:"ip4",size:32,valueToBytes:Pt,bytesToValue:Gn,validate:r=>{if(!St(r))throw new X(`Invalid IPv4 address "${r}"`)}},{code:Yi,name:"tcp",size:16,valueToBytes:j,bytesToValue:Z,validate:ne},{code:Zi,name:"udp",size:16,valueToBytes:j,bytesToValue:Z,validate:ne},{code:en,name:"dccp",size:16,valueToBytes:j,bytesToValue:Z,validate:ne},{code:tn,name:"ip6",size:128,valueToBytes:Fn,bytesToValue:$n,stringToValue:Vn,validate:r=>{if(!Qi(r))throw new X(`Invalid IPv6 address "${r}"`)}},{code:rn,name:"ip6zone",size:M},{code:nn,name:"ipcidr",size:8,bytesToValue:Je("base10"),valueToBytes:Ye("base10")},{code:sn,name:"dns",size:M},{code:on,name:"dns4",size:M},{code:an,name:"dns6",size:M},{code:ln,name:"dnsaddr",size:M},{code:cn,name:"sctp",size:16,valueToBytes:j,bytesToValue:Z,validate:ne},{code:un,name:"udt"},{code:dn,name:"utp"},{code:fn,name:"unix",size:M,stringToValue:r=>decodeURIComponent(r),valueToString:r=>encodeURIComponent(r)},{code:hn,name:"p2p",aliases:["ipfs"],size:M,bytesToValue:Je("base58btc"),valueToBytes:r=>r.startsWith("Q")||r.startsWith("1")?Ye("base58btc")(r):y.parse(r).multihash.bytes},{code:pn,name:"onion",size:96,bytesToValue:Ze,valueToBytes:Ln},{code:mn,name:"onion3",size:296,bytesToValue:Ze,valueToBytes:kn},{code:gn,name:"garlic64",size:M},{code:bn,name:"garlic32",size:M},{code:yn,name:"tls"},{code:_n,name:"sni",size:M},{code:wn,name:"noise"},{code:xn,name:"quic"},{code:vn,name:"quic-v1"},{code:En,name:"webtransport"},{code:Sn,name:"certhash",size:M,bytesToValue:Wn(gt),valueToBytes:Hn},{code:Tn,name:"http"},{code:Pn,name:"http-path",size:M,stringToValue:r=>`/${decodeURIComponent(r)}`,valueToString:r=>encodeURIComponent(r.substring(1))},{code:In,name:"https"},{code:zn,name:"ws"},{code:An,name:"wss"},{code:Cn,name:"p2p-websocket-star"},{code:Bn,name:"p2p-stardust"},{code:Mn,name:"p2p-webrtc-star"},{code:Dn,name:"p2p-webrtc-direct"},{code:Un,name:"webrtc-direct"},{code:Rn,name:"webrtc"},{code:Nn,name:"p2p-circuit"},{code:On,name:"memory",size:M}];Zn.forEach(r=>{Yn.addProtocol(r)});var lt,ct;(ct=(lt=globalThis.process)==null?void 0:lt.env)!=null&&ct.DUMP_SESSION_KEYS;var fe;(function(r){let e;r.codec=()=>(e==null&&(e=Ge((t,i,n={})=>{if(n.lengthDelimited!==!1&&i.fork(),t.webtransportCerthashes!=null)for(const s of t.webtransportCerthashes)i.uint32(10),i.bytes(s);if(t.streamMuxers!=null)for(const s of t.streamMuxers)i.uint32(18),i.string(s);n.lengthDelimited!==!1&&i.ldelim()},(t,i,n={})=>{var a,c;const s={webtransportCerthashes:[],streamMuxers:[]},o=i==null?t.len:t.pos+i;for(;t.pos<o;){const f=t.uint32();switch(f>>>3){case 1:{if(((a=n.limits)==null?void 0:a.webtransportCerthashes)!=null&&s.webtransportCerthashes.length===n.limits.webtransportCerthashes)throw new Ce('Decode error - map field "webtransportCerthashes" had too many elements');s.webtransportCerthashes.push(t.bytes());break}case 2:{if(((c=n.limits)==null?void 0:c.streamMuxers)!=null&&s.streamMuxers.length===n.limits.streamMuxers)throw new Ce('Decode error - map field "streamMuxers" had too many elements');s.streamMuxers.push(t.string());break}default:{t.skipType(f&7);break}}}return s})),e),r.encode=t=>Fe(t,r.codec()),r.decode=(t,i)=>ke(t,r.codec(),i)})(fe||(fe={}));var et;(function(r){let e;r.codec=()=>(e==null&&(e=Ge((t,i,n={})=>{n.lengthDelimited!==!1&&i.fork(),t.identityKey!=null&&t.identityKey.byteLength>0&&(i.uint32(10),i.bytes(t.identityKey)),t.identitySig!=null&&t.identitySig.byteLength>0&&(i.uint32(18),i.bytes(t.identitySig)),t.extensions!=null&&(i.uint32(34),fe.codec().encode(t.extensions,i)),n.lengthDelimited!==!1&&i.ldelim()},(t,i,n={})=>{var a;const s={identityKey:Pe(0),identitySig:Pe(0)},o=i==null?t.len:t.pos+i;for(;t.pos<o;){const c=t.uint32();switch(c>>>3){case 1:{s.identityKey=t.bytes();break}case 2:{s.identitySig=t.bytes();break}case 4:{s.extensions=fe.codec().decode(t,t.uint32(),{limits:(a=n.limits)==null?void 0:a.extensions});break}default:{t.skipType(c&7);break}}}return s})),e),r.encode=t=>Fe(t,r.codec()),r.decode=(t,i)=>ke(t,r.codec(),i)})(et||(et={}));var tt;(function(r){r[r.Data=0]="Data",r[r.WindowUpdate=1]="WindowUpdate",r[r.Ping=2]="Ping",r[r.GoAway=3]="GoAway"})(tt||(tt={}));var Be;(function(r){r[r.SYN=1]="SYN",r[r.ACK=2]="ACK",r[r.FIN=4]="FIN",r[r.RST=8]="RST"})(Be||(Be={}));Object.values(Be).filter(r=>typeof r!="string");var rt;(function(r){r[r.NormalTermination=0]="NormalTermination",r[r.ProtocolError=1]="ProtocolError",r[r.InternalError=2]="InternalError"})(rt||(rt={}));var it;(function(r){r[r.Init=0]="Init",r[r.SYNSent=1]="SYNSent",r[r.SYNReceived=2]="SYNReceived",r[r.Established=3]="Established",r[r.Finished=4]="Finished",r[r.Paused=5]="Paused"})(it||(it={}));var nt;(function(r){let e;r.codec=()=>(e==null&&(e=Ge((t,i,n={})=>{if(n.lengthDelimited!==!1&&i.fork(),t.publicKey!=null&&t.publicKey.byteLength>0&&(i.uint32(10),i.bytes(t.publicKey)),t.addrs!=null)for(const s of t.addrs)i.uint32(18),i.bytes(s);n.lengthDelimited!==!1&&i.ldelim()},(t,i,n={})=>{var a;const s={publicKey:Pe(0),addrs:[]},o=i==null?t.len:t.pos+i;for(;t.pos<o;){const c=t.uint32();switch(c>>>3){case 1:{s.publicKey=t.bytes();break}case 2:{if(((a=n.limits)==null?void 0:a.addrs)!=null&&s.addrs.length===n.limits.addrs)throw new Ce('Decode error - map field "addrs" had too many elements');s.addrs.push(t.bytes());break}default:{t.skipType(c&7);break}}}return s})),e),r.encode=t=>Fe(t,r.codec()),r.decode=(t,i)=>ke(t,r.codec(),i)})(nt||(nt={}));new TextEncoder;new TextDecoder;const es="peercompute.gpu.resident-stage-executor.v0",ts="peercompute.gpu.resident-stage-worker-policy.v0";function R(r,e=null){return String(r??"").trim()||e}function ve(r){return r==null?null:JSON.parse(JSON.stringify(r))}function st(r,e=!1){return typeof r=="boolean"?r:e}function rs(r,e=null){const t=Math.floor(Number(r));return Number.isFinite(t)&&t>=0?t:e}function is(r={},e=null){const t=r&&typeof r=="object"?r:{},i=R(t.mode??t.residencyMode,null),n=!!(t.worker||t.workerReady||t.workerModuleUrl||t.workerType),s=i||(n?"dedicated-worker":"inline"),o=st(t.workerReady,!1)||!!t.worker,a=s==="dedicated-worker"||s==="webgpu-worker"||s==="gpu-compute-worker",c=a?"dedicated-worker":"inline",f=a?o?"worker-ready":"blocked-worker-backend-missing":"inline-ready";return{schema:ts,stageId:e,mode:c,status:f,workerType:R(t.workerType,a?"webgpu-compute-worker":null),workerModuleUrl:R(t.workerModuleUrl??t.moduleUrl,null),startupMode:R(t.startupMode,a?"warm-on-first-use":"inline"),idleTtlMs:rs(t.idleTtlMs,a?6e4:null),sameDeviceRequired:st(t.sameDeviceRequired,a),bufferTransferPolicy:R(t.bufferTransferPolicy,a?"worker-owns-device-and-retained-buffers-required":"main-thread-gpuhub-inline"),fallbackRuntimeTarget:f==="blocked-worker-backend-missing"?"gpu-hub-inline-stage-executor":null,authority:"compute-manager-gpuhub-resident-stage-worker-policy"}}async function ns(r,e){if(typeof r=="function")return r(e);if(r&&typeof r.runStage=="function")return r.runStage(e);throw new Error("[GPUHubManager] Resident stage worker backend must be a function or expose runStage()")}class ss{constructor(e={}){this.frameBudgetMs=e.frameBudgetMs??4,this.hotStore=e.hotStore||new Map,this.device=null,this.tasks=new Map,this.residentStageExecutors=new Map,this.residentStageExecutorAliases=new Map}async initialize(e={}){if(e.device)return this.device=e.device,this.device;if(typeof navigator>"u"||!navigator.gpu)throw new Error("[GPUHubManager] WebGPU not available in this environment");const t=await navigator.gpu.requestAdapter(e.adapterOptions);if(!t)throw new Error("[GPUHubManager] Failed to acquire GPU adapter");return this.device=await t.requestDevice(e.deviceDescriptor),this.device}setDevice(e){this.device=e}getHotStore(){return this.hotStore}registerHotBuffer(e,t){this.hotStore.set(e,t)}registerHotBufferSet(e,t){this.hotStore.set(e,t)}getHotBufferSet(e){return this.hotStore.get(e)}getHotBuffer(e){return this.hotStore.get(e)}createHotBuffer(e,t,i,n){if(!this.device)throw new Error("[GPUHubManager] Device not initialized");const s=this.device.createBuffer({size:t,usage:i,label:n});return this.hotStore.set(e,s),s}removeHotBuffer(e){this.hotStore.delete(e)}registerResidentStageExecutor(e,t=null){var c;const i=typeof e=="string"?{stageId:e,executor:t}:{...e||{}},n=R(i.stageId??i.id,null);if(!n)throw new Error("[GPUHubManager] Resident stage executor requires a stageId");const s=i.executor||t,o=i.workerRunner||i.workerBackend||((c=i.workerPolicy)==null?void 0:c.workerRunner)||null;if(typeof s!="function"&&!o)throw new Error(`[GPUHubManager] Resident stage executor must be a function: ${n}`);const a={schema:es,stageId:n,lawNodeId:R(i.lawNodeId,null),runtimeTarget:R(i.runtimeTarget,o?"gpu-hub-resident-stage-worker":"gpu-hub-inline-stage-executor"),executor:typeof s=="function"?s:null,workerRunner:o,workerPolicy:is({...i.workerPolicy||i.workerResidency||{},workerReady:(i.workerPolicy||i.workerResidency||{}).workerReady||!!o},n),metadata:ve(i.metadata||{}),registeredAt:Date.now()};return this.residentStageExecutors.set(n,a),a.lawNodeId&&this.residentStageExecutorAliases.set(a.lawNodeId,n),this.describeResidentStageExecutor(n)}describeResidentStageExecutor(e){const t=this.getResidentStageExecutorRecord(e);return t?{schema:t.schema,stageId:t.stageId,lawNodeId:t.lawNodeId,runtimeTarget:t.runtimeTarget,workerPolicy:ve(t.workerPolicy),metadata:ve(t.metadata||{}),registeredAt:t.registeredAt}:null}getResidentStageExecutorRecord(e){const t=R(typeof e=="string"?e:(e==null?void 0:e.id)??(e==null?void 0:e.stageId),null),i=R(typeof e=="string"?null:e==null?void 0:e.lawNodeId,null);if(t&&this.residentStageExecutors.has(t))return this.residentStageExecutors.get(t);const n=i?this.residentStageExecutorAliases.get(i):null;return n?this.residentStageExecutors.get(n):null}hasResidentStageExecutor(e){return!!this.getResidentStageExecutorRecord(e)}listResidentStageExecutors(){return[...this.residentStageExecutors.keys()].sort().map(e=>this.describeResidentStageExecutor(e))}async executeResidentStage(e={}){var n,s;const t=this.getResidentStageExecutorRecord(e.stage);if(!t){const o=R(((n=e.stage)==null?void 0:n.id)??((s=e.stage)==null?void 0:s.stageId),"unknown"),a=new Error(`[GPUHubManager] Missing resident stage executor: ${o}`);throw a.code="ERR_GPU_HUB_RESIDENT_STAGE_EXECUTOR_MISSING",a.stage=e.stage||null,a}const i={...e,gpuHub:this,device:this.device,executor:this.describeResidentStageExecutor(t.stageId)};return t.workerRunner?ns(t.workerRunner,i):t.executor(i)}registerTask(e,t){this.tasks.set(e,t)}unregisterTask(e){this.tasks.delete(e)}tick(){}}const os=Object.freeze(["hadamard","pauli_x","pauli_z","cnot"]);Object.freeze([...os,"compute_probabilities"]);let W=null,ot=null;async function hs(){if(W)return W;try{return ot=new ss({frameBudgetMs:6}),W=await ot.initialize(),W}catch(r){console.warn("[webgpuphys] GPU hub unavailable, falling back to local WebGPU init",r);const{device:e}=await Rt();return W=e,W}}export{he as M,fs as a,ds as c,hs as g,cs as s,us as u};
