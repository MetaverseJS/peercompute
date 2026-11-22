var _e=Object.defineProperty;var We=(l,e,t)=>e in l?_e(l,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[e]=t;var f=(l,e,t)=>We(l,typeof e!="symbol"?e+"":e,t);import{r as Oe,s as me}from"./ModelEvidenceService-Cqouo3eH.js";import{i as Fe,c as Be,a as Ue,b as w,d as _,w as $,g as Ie,
r as Ce,e as De,f as ke,p as Ee}from"./device-CB8g0LHY.js";import{P as Qe}from"./particleRenderer-B5B5iTdk.js";import{c as Le,
a as je,b as Se,d as Ze,O as Xe,g as Ye}from"./orbitControls-rEfmTUzB.js";class I{constructor(e=0,t=0,r=0){this.data=new Float32Array([e,t,r])}get x(){return this.data[0]}set x(e){this.data[0]=e}get y(){
return this.data[1]}set y(e){this.data[1]=e}get z(){return this.data[2]}set z(e){this.data[2]=e}set(e,t,r){return this.data[0]=
e,this.data[1]=t,this.data[2]=r,this}copy(e){return this.data[0]=e.data[0],this.data[1]=e.data[1],this.data[2]=e.data[2],
this}clone(){return new I(this.x,this.y,this.z)}add(e){return this.data[0]+=e.data[0],this.data[1]+=e.data[1],this.data[2]+=
e.data[2],this}sub(e){return this.data[0]-=e.data[0],this.data[1]-=e.data[1],this.data[2]-=e.data[2],this}scale(e){return this.
data[0]*=e,this.data[1]*=e,this.data[2]*=e,this}dot(e){return this.data[0]*e.data[0]+this.data[1]*e.data[1]+this.data[2]*
e.data[2]}cross(e){const t=this.data[0],r=this.data[1],i=this.data[2],a=e.data[0],s=e.data[1],d=e.data[2];return this.data[0]=
r*d-i*s,this.data[1]=i*a-t*d,this.data[2]=t*s-r*a,this}length(){return Math.sqrt(this.dot(this))}lengthSq(){return this.
dot(this)}normalize(){const e=this.length();return e>0&&this.scale(1/e),this}static cross(e,t,r=new I){return r.data[0]=
e.y*t.z-e.z*t.y,r.data[1]=e.z*t.x-e.x*t.z,r.data[2]=e.x*t.y-e.y*t.x,r}static dot(e,t){return e.x*t.x+e.y*t.y+e.z*t.z}}function ve(l,e){
const t=l/e.length;let r=0,i=0,a=0;for(const s of e){const d=s[0],n=s[1],o=s[2];r+=t*(n*n+o*o),i+=t*(d*d+o*o),a+=t*(d*d+
n*n)}return new I(r,i,a)}function Ke(l,e){const t=.4*l*e*e;return new I(t,t,t)}const Ne=`// Shared WGSL utilities for We\
bGPU Physics

// Simulation parameters uniform buffer
struct Params {
  // params1: stiffness, damping, radius, particleCount
  stiffness: f32,
  damping: f32,
  radius: f32,
  particleCount: f32,
  
  // params2: dt, friction, drag, bodyCount  
  dt: f32,
  friction: f32,
  drag: f32,
  bodyCount: f32,
  
  // gravity: x, y, z, 0
  gravity: vec4<f32>,
  
  // boxSize: x, y, z, 0
  boxSize: vec4<f32>,
  
  // gridPos: x, y, z, 0
  gridPos: vec4<f32>,
  
  // gridRes: x, y, z, maxParticlesPerCell
  gridRes: vec4<f32>,
  
  // sphereInteraction: x, y, z, radius
  sphere: vec4<f32>,
  
  // maxVelocity: x, y, z, 0
  maxVelocity: vec4<f32>,
}

// Workgroup size constant
const WORKGROUP_SIZE: u32 = 64u;

// Get grid cell position from world position
fn worldPosToGridPos(particlePos: vec3<f32>, gridPos: vec3<f32>, cellSize: vec3<f32>) -> vec3<i32> {
  return vec3<i32>(floor((particlePos - gridPos) / cellSize));
}

// Convert 3D grid position to linear index
fn gridPosToIndex(gridPos: vec3<i32>, gridRes: vec3<i32>) -> i32 {
  // Clamp to valid range
  let clamped = clamp(gridPos, vec3<i32>(0), gridRes - vec3<i32>(1));
  return clamped.x + clamped.y * gridRes.x + clamped.z * gridRes.x * gridRes.y;
}

// Check if grid position is valid
fn isValidGridPos(gridPos: vec3<i32>, gridRes: vec3<i32>) -> bool {
  return gridPos.x >= 0 && gridPos.x < gridRes.x &&
         gridPos.y >= 0 && gridPos.y < gridRes.y &&
         gridPos.z >= 0 && gridPos.z < gridRes.z;
}

// Quaternion multiplication
fn quatMul(a: vec4<f32>, b: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(
    a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    a.w * b.y + a.y * b.w + a.z * b.x - a.x * b.z,
    a.w * b.z + a.z * b.w + a.x * b.y - a.y * b.x,
    a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z
  );
}

// Integrate quaternion with angular velocity
fn quatIntegrate(q: vec4<f32>, w: vec3<f32>, dt: f32) -> vec4<f32> {
  let halfDt = dt * 0.5;
  
  var result = q;
  result.x += halfDt * (w.x * q.w + w.y * q.z - w.z * q.y);
  result.y += halfDt * (w.y * q.w + w.z * q.x - w.x * q.z);
  result.z += halfDt * (w.z * q.w + w.x * q.y - w.y * q.x);
  result.w += halfDt * (-w.x * q.x - w.y * q.y - w.z * q.z);
  
  return normalize(result);
}

// Rotate vector by quaternion
fn quatRotate(v: vec3<f32>, q: vec4<f32>) -> vec3<f32> {
  let ix = q.w * v.x + q.y * v.z - q.z * v.y;
  let iy = q.w * v.y + q.z * v.x - q.x * v.z;
  let iz = q.w * v.z + q.x * v.y - q.y * v.x;
  let iw = -q.x * v.x - q.y * v.y - q.z * v.z;
  
  return vec3<f32>(
    ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y,
    iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z,
    iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x
  );
}

// Quaternion to rotation matrix (3x3)
fn quatToMat3(q: vec4<f32>) -> mat3x3<f32> {
  let x = q.x;
  let y = q.y;
  let z = q.z;
  let w = q.w;
  
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  
  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  
  return mat3x3<f32>(
    vec3<f32>(1.0 - (yy + zz), xy + wz, xz - wy),
    vec3<f32>(xy - wz, 1.0 - (xx + zz), yz + wx),
    vec3<f32>(xz + wy, yz - wx, 1.0 - (xx + yy))
  );
}

// Compute world-space inverse inertia tensor
fn invInertiaWorld(q: vec4<f32>, invInertia: vec3<f32>) -> mat3x3<f32> {
  let R = quatToMat3(q);
  let RT = transpose(R);
  
  // Diagonal inverse inertia matrix
  let I = mat3x3<f32>(
    vec3<f32>(invInertia.x, 0.0, 0.0),
    vec3<f32>(0.0, invInertia.y, 0.0),
    vec3<f32>(0.0, 0.0, invInertia.z)
  );
  
  // R^T * I * R
  return RT * I * R;
}

// Cross product
fn cross3(a: vec3<f32>, b: vec3<f32>) -> vec3<f32> {
  return vec3<f32>(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );
}

// Particle contact force calculation (spring-damper model)
fn particleForce(
  stiffness: f32,
  damping: f32,
  friction: f32,
  distance: f32,
  minDistance: f32,
  xi: vec3<f32>,
  xj: vec3<f32>,
  vi: vec3<f32>,
  vj: vec3<f32>
) -> vec3<f32> {
  let rij = xj - xi;
  let len = length(rij);
  
  if (len < 0.0001) {
    return vec3<f32>(0.0);
  }
  
  let rijUnit = rij / len;
  let vij = vj - vi;
  let vijT = vij - dot(vij, rijUnit) * rijUnit;
  
  let springForce = -stiffness * (distance - max(len, minDistance)) * rijUnit;
  let dampingForce = damping * dot(vij, rijUnit) * rijUnit;
  let tangentForce = friction * vijT;
  
  return springForce + dampingForce + tangentForce;
}
`,He=`// Transform local particle positions to world space

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> particleLocalPos: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> bodyPos: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read> bodyQuat: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> particleWorldPos: array<vec4<f32>>;

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let particleIndex = id.x;
  
  if (particleIndex >= u32(params.particleCount)) {
    return;
  }
  
  let localPosAndBodyId = particleLocalPos[particleIndex];
  let localPos = localPosAndBodyId.xyz;
  let bodyId = u32(localPosAndBodyId.w);
  
  let bodyPosition = bodyPos[bodyId].xyz;
  let bodyQuaternion = bodyQuat[bodyId];
  
  // Rotate local position by body quaternion and add body position
  let worldPos = bodyPosition + quatRotate(localPos, bodyQuaternion);
  
  particleWorldPos[particleIndex] = vec4<f32>(worldPos, f32(bodyId));
}
`,$e=`// Compute relative particle positions (for torque calculation)

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> particleLocalPos: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> bodyPos: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read> bodyQuat: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> particleRelativePos: array<vec4<f32>>;

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let particleIndex = id.x;
  
  if (particleIndex >= u32(params.particleCount)) {
    return;
  }
  
  let localPosAndBodyId = particleLocalPos[particleIndex];
  let localPos = localPosAndBodyId.xyz;
  let bodyId = u32(localPosAndBodyId.w);
  
  let bodyQuaternion = bodyQuat[bodyId];
  
  // Relative position = rotated local position (without body position offset)
  let relativePos = quatRotate(localPos, bodyQuaternion);
  
  particleRelativePos[particleIndex] = vec4<f32>(relativePos, f32(bodyId));
}
`,Je=`// Derive particle velocities from body velocities

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> particleRelativePos: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> bodyVel: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read> bodyAngularVel: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> particleVel: array<vec4<f32>>;

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let particleIndex = id.x;
  
  if (particleIndex >= u32(params.particleCount)) {
    return;
  }
  
  let relativePosAndBodyId = particleRelativePos[particleIndex];
  let relativePos = relativePosAndBodyId.xyz;
  let bodyId = u32(relativePosAndBodyId.w);
  
  let linearVel = bodyVel[bodyId].xyz;
  let angularVel = bodyAngularVel[bodyId].xyz;
  
  // v_particle = v_body + omega x r
  let vel = linearVel + cross3(angularVel, relativePos);
  
  particleVel[particleIndex] = vec4<f32>(vel, 1.0);
}
`,et=`// Clear the spatial hash grid

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read_write> gridCellCount: array<atomic<u32>>;

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  // Calculate linear index from 2D dispatch to support > 65535 workgroups
  // stride (dispatchX * WORKGROUP_SIZE) is stored in params.maxVelocity.w
  let stride = u32(params.maxVelocity.w);
  let cellIndex = id.y * stride + id.x;
  
  let gridRes = vec3<i32>(params.gridRes.xyz);
  let totalCells = u32(gridRes.x * gridRes.y * gridRes.z);
  
  if (cellIndex >= totalCells) {
    return;
  }
  
  atomicStore(&gridCellCount[cellIndex], 0u);
}
`,tt=`// Build spatial hash grid from particle positions

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> particleWorldPos: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> gridCellCount: array<atomic<u32>>;
@group(0) @binding(3) var<storage, read_write> gridCellParticles: array<u32>;

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let particleIndex = id.x;
  
  if (particleIndex >= u32(params.particleCount)) {
    return;
  }
  
  let worldPos = particleWorldPos[particleIndex].xyz;
  let cellSize = vec3<f32>(params.radius * 2.0);
  let gridPos = params.gridPos.xyz;
  let gridRes = vec3<i32>(params.gridRes.xyz);
  let maxParticlesPerCell = u32(params.gridRes.w);
  
  // Get grid cell for this particle
  let cellPos = worldPosToGridPos(worldPos, gridPos, cellSize);
  
  // Check if within grid bounds
  if (!isValidGridPos(cellPos, gridRes)) {
    return;
  }
  
  let cellIndex = gridPosToIndex(cellPos, gridRes);
  
  // Atomically increment cell count and get slot
  let slot = atomicAdd(&gridCellCount[u32(cellIndex)], 1u);
  
  // Store particle index if slot available
  if (slot < maxParticlesPerCell) {
    let particleSlotIndex = u32(cellIndex) * maxParticlesPerCell + slot;
    gridCellParticles[particleSlotIndex] = particleIndex + 1u; // Store +1 so 0 means empty
  }
}
`,rt=`// Calculate particle collision forces

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> particleWorldPos: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> particleRelativePos: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read> particleVel: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read> bodyAngularVel: array<vec4<f32>>;
@group(0) @binding(5) var<storage, read> gridCellCount: array<u32>;
@group(0) @binding(6) var<storage, read> gridCellParticles: array<u32>;
@group(0) @binding(7) var<storage, read_write> particleForceOut: array<vec4<f32>>;

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let particleIndex = id.x;
  
  if (particleIndex >= u32(params.particleCount)) {
    return;
  }
  
  let worldPosAndBodyId = particleWorldPos[particleIndex];
  let position = worldPosAndBodyId.xyz;
  let bodyId = u32(worldPosAndBodyId.w);
  
  let velocity = particleVel[particleIndex].xyz;
  let relativePos = particleRelativePos[particleIndex].xyz;
  let angularVel = bodyAngularVel[bodyId].xyz;
  
  let cellSize = vec3<f32>(params.radius * 2.0);
  let gridPos = params.gridPos.xyz;
  let gridRes = vec3<i32>(params.gridRes.xyz);
  let maxParticlesPerCell = u32(params.gridRes.w);
  let radius = params.radius;
  let stiffness = params.stiffness;
  let damping = params.damping;
  let friction = params.friction;
  
  var force = vec3<f32>(0.0);
  
  // Get current particle's grid cell
  let particleGridPos = worldPosToGridPos(position, gridPos, cellSize);
  
  // Check neighboring cells (3x3x3)
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      for (var k = -1; k <= 1; k++) {
        let neighborCellPos = particleGridPos + vec3<i32>(i, j, k);
        
        if (!isValidGridPos(neighborCellPos, gridRes)) {
          continue;
        }
        
        let cellIndex = gridPosToIndex(neighborCellPos, gridRes);
        
        // Check all particles in this cell
        for (var slot = 0u; slot < maxParticlesPerCell; slot++) {
          let particleSlotIndex = u32(cellIndex) * maxParticlesPerCell + slot;
          let neighborIndexPlusOne = gridCellParticles[particleSlotIndex];
          
          if (neighborIndexPlusOne == 0u) {
            continue; // Empty slot
          }
          
          let neighborIndex = neighborIndexPlusOne - 1u;
          
          if (neighborIndex == particleIndex) {
            continue; // Skip self
          }
          
          let neighborPosAndBodyId = particleWorldPos[neighborIndex];
          let neighborPos = neighborPosAndBodyId.xyz;
          let neighborBodyId = u32(neighborPosAndBodyId.w);
          
          if (neighborBodyId == bodyId) {
            continue; // Skip same body
          }
          
          let neighborVel = particleVel[neighborIndex].xyz;
          let neighborRelativePos = particleRelativePos[neighborIndex].xyz;
          let neighborAngularVel = bodyAngularVel[neighborBodyId].xyz;
          
          // Check collision
          let r = position - neighborPos;
          let dist = length(r);
          
          if (dist > 0.0 && dist < radius * 2.0) {
            let dir = normalize(r);
            
            // Compute velocities including angular contribution
            let v = velocity - cross3(relativePos + radius * dir, angularVel);
            let nv = neighborVel - cross3(neighborRelativePos + radius * (-dir), neighborAngularVel);
            
            force += particleForce(stiffness, damping, friction, 2.0 * radius, radius, position, neighborPos, v, nv);
          }
        }
      }
    }
  }
  
  // Ground/boundary collisions
  let boxMin = vec3<f32>(-params.boxSize.x, 0.0, -params.boxSize.z);
  let boxMax = vec3<f32>(params.boxSize.x, params.boxSize.y * 0.5, params.boxSize.z);
  
  // X bounds
  {
    let dir = vec3<f32>(1.0, 0.0, 0.0);
    let v = velocity - cross3(relativePos + radius * dir, angularVel);
    let tangentVel = v - dot(v, dir) * dir;
    let x = position.x - radius;
    if (x < boxMin.x) {
      force += -(stiffness * (x - boxMin.x) * dir + damping * dot(v, dir) * dir);
      force -= friction * tangentVel;
    }
  }
  {
    let dir = vec3<f32>(-1.0, 0.0, 0.0);
    let v = velocity - cross3(relativePos + radius * (-dir), angularVel);
    let tangentVel = v - dot(v, dir) * dir;
    let x = position.x + radius;
    if (x > boxMax.x) {
      force -= -(stiffness * (x - boxMax.x) * dir - damping * dot(v, dir) * dir);
      force -= friction * tangentVel;
    }
  }
  
  // Y bounds (ground)
  {
    let dir = vec3<f32>(0.0, 1.0, 0.0);
    let v = velocity - cross3(relativePos + radius * dir, angularVel);
    let tangentVel = v - dot(v, dir) * dir;
    let y = position.y - radius;
    if (y < boxMin.y) {
      force += -(stiffness * (y - boxMin.y) * dir + damping * dot(v, dir) * dir);
      force -= friction * tangentVel;
    }
  }
  {
    let dir = vec3<f32>(0.0, -1.0, 0.0);
    let v = velocity - cross3(relativePos + radius * (-dir), angularVel);
    let tangentVel = v - dot(v, dir) * dir;
    let y = position.y + radius;
    if (y > boxMax.y) {
      force -= -(stiffness * (y - boxMax.y) * dir - damping * dot(v, dir) * dir);
      force -= friction * tangentVel;
    }
  }
  
  // Z bounds
  {
    let dir = vec3<f32>(0.0, 0.0, 1.0);
    let v = velocity - cross3(relativePos + radius * dir, angularVel);
    let tangentVel = v - dot(v, dir) * dir;
    let z = position.z - radius;
    if (z < boxMin.z) {
      force += -(stiffness * (z - boxMin.z) * dir + damping * dot(v, dir) * dir);
      force -= friction * tangentVel;
    }
  }
  {
    let dir = vec3<f32>(0.0, 0.0, -1.0);
    let v = velocity - cross3(relativePos + radius * (-dir), angularVel);
    let tangentVel = v - dot(v, dir) * dir;
    let z = position.z + radius;
    if (z > boxMax.z) {
      force -= -(stiffness * (z - boxMax.z) * dir - damping * dot(v, dir) * dir);
      force -= friction * tangentVel;
    }
  }
  
  // Interaction sphere collision
  let spherePos = params.sphere.xyz;
  let sphereRadius = params.sphere.w;
  let rSphere = position - spherePos;
  let distSphere = length(rSphere);
  if (distSphere > 0.0 && distSphere < sphereRadius + radius) {
    force += particleForce(stiffness, damping, friction, radius + sphereRadius, sphereRadius, position, spherePos, veloc\
ity, vec3<f32>(0.0));
  }
  
  particleForceOut[particleIndex] = vec4<f32>(force, 1.0);
}
`,it=`// Calculate particle collision torques (similar to force but for rotation)

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> particleWorldPos: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> particleRelativePos: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read> particleVel: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read> bodyAngularVel: array<vec4<f32>>;
@group(0) @binding(5) var<storage, read> gridCellCount: array<u32>;
@group(0) @binding(6) var<storage, read> gridCellParticles: array<u32>;
@group(0) @binding(7) var<storage, read_write> particleTorqueOut: array<vec4<f32>>;

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let particleIndex = id.x;
  
  if (particleIndex >= u32(params.particleCount)) {
    return;
  }
  
  let worldPosAndBodyId = particleWorldPos[particleIndex];
  let position = worldPosAndBodyId.xyz;
  let bodyId = u32(worldPosAndBodyId.w);
  
  let velocity = particleVel[particleIndex].xyz;
  let relativePos = particleRelativePos[particleIndex].xyz;
  let angularVel = bodyAngularVel[bodyId].xyz;
  
  let cellSize = vec3<f32>(params.radius * 2.0);
  let gridPos = params.gridPos.xyz;
  let gridRes = vec3<i32>(params.gridRes.xyz);
  let maxParticlesPerCell = u32(params.gridRes.w);
  let radius = params.radius;
  let stiffness = params.stiffness;
  let damping = params.damping;
  let friction = params.friction;
  
  var torque = vec3<f32>(0.0);
  
  // Get current particle's grid cell
  let particleGridPos = worldPosToGridPos(position, gridPos, cellSize);
  
  // Check neighboring cells (3x3x3) - same logic as update_force
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      for (var k = -1; k <= 1; k++) {
        let neighborCellPos = particleGridPos + vec3<i32>(i, j, k);
        
        if (!isValidGridPos(neighborCellPos, gridRes)) {
          continue;
        }
        
        let cellIndex = gridPosToIndex(neighborCellPos, gridRes);
        
        for (var slot = 0u; slot < maxParticlesPerCell; slot++) {
          let particleSlotIndex = u32(cellIndex) * maxParticlesPerCell + slot;
          let neighborIndexPlusOne = gridCellParticles[particleSlotIndex];
          
          if (neighborIndexPlusOne == 0u) {
            continue;
          }
          
          let neighborIndex = neighborIndexPlusOne - 1u;
          
          if (neighborIndex == particleIndex) {
            continue;
          }
          
          let neighborPosAndBodyId = particleWorldPos[neighborIndex];
          let neighborPos = neighborPosAndBodyId.xyz;
          let neighborBodyId = u32(neighborPosAndBodyId.w);
          
          if (neighborBodyId == bodyId) {
            continue;
          }
          
          let neighborVel = particleVel[neighborIndex].xyz;
          let neighborRelativePos = particleRelativePos[neighborIndex].xyz;
          let neighborAngularVel = bodyAngularVel[neighborBodyId].xyz;
          
          let r = position - neighborPos;
          let dist = length(r);
          
          if (dist > 0.0 && dist < radius * 2.0) {
            let dir = normalize(r);
            let v = velocity - cross3(relativePos + radius * dir, angularVel);
            let nv = neighborVel - cross3(neighborRelativePos + radius * (-dir), neighborAngularVel);
            
            let force = particleForce(stiffness, damping, friction, 2.0 * radius, radius, position, neighborPos, v, nv);\

            
            // Torque = r x F (relative position cross force)
            torque += cross3(relativePos, force);
          }
        }
      }
    }
  }
  
  particleTorqueOut[particleIndex] = vec4<f32>(torque, 1.0);
}
`,nt=`// Reduce particle forces to body forces using atomics

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> particleLocalPos: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> particleForceBuf: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> bodyForce: array<atomic<u32>>;

// Helper to atomic add f32 by encoding as u32
fn atomicAddF32(ptr: ptr<storage, atomic<u32>, read_write>, value: f32) {
  var old = atomicLoad(ptr);
  loop {
    let newVal = bitcast<u32>(bitcast<f32>(old) + value);
    let result = atomicCompareExchangeWeak(ptr, old, newVal);
    if (result.exchanged) {
      break;
    }
    old = result.old_value;
  }
}

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let particleIndex = id.x;
  
  if (particleIndex >= u32(params.particleCount)) {
    return;
  }
  
  let localPosAndBodyId = particleLocalPos[particleIndex];
  let bodyId = u32(localPosAndBodyId.w);
  
  let force = particleForceBuf[particleIndex].xyz;
  
  // Atomic add force components to body
  // Body force is stored as 4 u32s: (fx, fy, fz, 1) encoded as f32->u32
  let bodyOffset = bodyId * 4u;
  
  atomicAddF32(&bodyForce[bodyOffset + 0u], force.x);
  atomicAddF32(&bodyForce[bodyOffset + 1u], force.y);
  atomicAddF32(&bodyForce[bodyOffset + 2u], force.z);
}
`,ot=`// Reduce particle torques to body torques using atomics

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> particleLocalPos: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> particleRelativePos: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read> particleForceBuf: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read> particleTorque: array<vec4<f32>>;
@group(0) @binding(5) var<storage, read_write> bodyTorque: array<atomic<u32>>;

// Helper to atomic add f32 by encoding as u32
fn atomicAddF32Torque(ptr: ptr<storage, atomic<u32>, read_write>, value: f32) {
  var old = atomicLoad(ptr);
  loop {
    let newVal = bitcast<u32>(bitcast<f32>(old) + value);
    let result = atomicCompareExchangeWeak(ptr, old, newVal);
    if (result.exchanged) {
      break;
    }
    old = result.old_value;
  }
}

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let particleIndex = id.x;
  
  if (particleIndex >= u32(params.particleCount)) {
    return;
  }
  
  let localPosAndBodyId = particleLocalPos[particleIndex];
  let bodyId = u32(localPosAndBodyId.w);
  
  let relativePos = particleRelativePos[particleIndex].xyz;
  let force = particleForceBuf[particleIndex].xyz;
  let torqueFromCollision = particleTorque[particleIndex].xyz;
  
  // Total torque = collision torque + r x F
  let totalTorque = torqueFromCollision + cross3(relativePos, force);
  
  // Atomic add torque components to body
  let bodyOffset = bodyId * 4u;
  
  atomicAddF32Torque(&bodyTorque[bodyOffset + 0u], totalTorque.x);
  atomicAddF32Torque(&bodyTorque[bodyOffset + 1u], totalTorque.y);
  atomicAddF32Torque(&bodyTorque[bodyOffset + 2u], totalTorque.z);
}
`,at=`// Update body linear velocity

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> bodyVelIn: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> bodyForce: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read> bodyMass: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> bodyVelOut: array<vec4<f32>>;

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let bodyIndex = id.x;
  
  if (bodyIndex >= u32(params.bodyCount)) {
    return;
  }
  
  let velocity = bodyVelIn[bodyIndex].xyz;
  let force = bodyForce[bodyIndex].xyz;
  let massData = bodyMass[bodyIndex];
  let invMass = massData.w; // Inverse mass stored in w component
  
  let dt = params.dt;
  let gravity = params.gravity.xyz;
  let drag = params.drag;
  let maxVel = params.maxVelocity.xyz;
  
  // Skip static bodies (invMass == 0)
  if (invMass == 0.0) {
    bodyVelOut[bodyIndex] = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return;
  }
  
  // Apply gravity and forces: v += (g + F/m) * dt
  var newVel = velocity + (gravity + force * invMass) * dt;
  
  // Apply drag
  newVel = newVel * (1.0 - drag * dt);
  
  // Clamp velocity
  newVel = clamp(newVel, -maxVel, maxVel);
  
  bodyVelOut[bodyIndex] = vec4<f32>(newVel, 1.0);
}
`,st=`// Update body angular velocity

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> bodyAngVelIn: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> bodyTorque: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read> bodyMass: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read> bodyQuat: array<vec4<f32>>;
@group(0) @binding(5) var<storage, read_write> bodyAngVelOut: array<vec4<f32>>;

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let bodyIndex = id.x;
  
  if (bodyIndex >= u32(params.bodyCount)) {
    return;
  }
  
  let angularVel = bodyAngVelIn[bodyIndex].xyz;
  let torque = bodyTorque[bodyIndex].xyz;
  let massData = bodyMass[bodyIndex];
  let invInertia = massData.xyz; // Inverse inertia stored in xyz
  let invMass = massData.w;
  let quat = bodyQuat[bodyIndex];
  
  let dt = params.dt;
  let drag = params.drag;
  let maxVel = params.maxVelocity.xyz;
  
  // Skip static bodies
  if (invMass == 0.0) {
    bodyAngVelOut[bodyIndex] = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return;
  }
  
  // Compute world-space inverse inertia tensor
  let invIWorld = invInertiaWorld(quat, invInertia);
  
  // Apply torque: omega += I^-1 * T * dt
  let angularAccel = invIWorld * torque;
  var newAngVel = angularVel + angularAccel * dt;
  
  // Apply drag
  newAngVel = newAngVel * (1.0 - drag * dt);
  
  // Clamp angular velocity
  newAngVel = clamp(newAngVel, -maxVel, maxVel);
  
  bodyAngVelOut[bodyIndex] = vec4<f32>(newAngVel, 1.0);
}
`,dt=`// Update body position

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> bodyPosIn: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> bodyVel: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> bodyPosOut: array<vec4<f32>>;

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let bodyIndex = id.x;
  
  if (bodyIndex >= u32(params.bodyCount)) {
    return;
  }
  
  let position = bodyPosIn[bodyIndex].xyz;
  let velocity = bodyVel[bodyIndex].xyz;
  let dt = params.dt;
  
  // Simple Euler integration: x += v * dt
  let newPos = position + velocity * dt;
  
  bodyPosOut[bodyIndex] = vec4<f32>(newPos, 1.0);
}
`,lt=`// Update body quaternion

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> bodyQuatIn: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> bodyAngVel: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> bodyQuatOut: array<vec4<f32>>;

@compute @workgroup_size(WORKGROUP_SIZE)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let bodyIndex = id.x;
  
  if (bodyIndex >= u32(params.bodyCount)) {
    return;
  }
  
  let quat = bodyQuatIn[bodyIndex];
  let angularVel = bodyAngVel[bodyIndex].xyz;
  let dt = params.dt;
  
  // Integrate quaternion with angular velocity
  let newQuat = quatIntegrate(quat, angularVel, dt);
  
  bodyQuatOut[bodyIndex] = newQuat;
}
`,ue=64,Ve=4;class ut{constructor(e={}){f(this,"ctx");f(this,"device");f(this,"buffers");f(this,"pipelines");f(this,"lay\
outs");f(this,"bindGroups",new Map);f(this,"_bodyCount",0);f(this,"_particleCount",0);f(this,"maxBodies");f(this,"maxPar\
ticles");f(this,"params");f(this,"grid");f(this,"time",0);f(this,"fixedTime",0);f(this,"accumulator",0);f(this,"maxSubSt\
eps");f(this,"_interpolationValue",0);f(this,"bufferIndex",0);f(this,"bodyPositions");f(this,"bodyQuaternions");f(this,"\
bodyMasses");f(this,"particleLocalPositions");f(this,"bodyDataDirty",!0);f(this,"particleDataDirty",!0);f(this,"massDirt\
y",!0);f(this,"interactionSphere",{position:new I(10,1,0),radius:1});f(this,"initPromise");f(this,"initialized",!1);var r,
i,a;this.maxBodies=e.maxBodies||64,this.maxParticles=e.maxParticles||256,this.maxSubSteps=e.maxSubSteps||5,this.params={
stiffness:e.stiffness??1700,damping:e.damping??6,friction:e.friction??2,drag:e.drag??.1,radius:e.radius??.5,fixedTimeStep:e.
fixedTimeStep??1/120,gravity:((r=e.gravity)==null?void 0:r.data)??new Float32Array([0,-9.81,0]),boxSize:((i=e.boxSize)==
null?void 0:i.data)??new Float32Array([10,10,10])};const t=e.gridResolution||new I(64,64,64);this.grid={position:((a=e.gridPosition)==
null?void 0:a.data)??new Float32Array([0,0,0]),resolution:t.data,maxParticlesPerCell:Ve},this.bodyPositions=new Float32Array(
this.maxBodies*4),this.bodyQuaternions=new Float32Array(this.maxBodies*4),this.bodyMasses=new Float32Array(this.maxBodies*
4),this.particleLocalPositions=new Float32Array(this.maxParticles*4);for(let s=0;s<this.maxBodies;s++)this.bodyQuaternions[s*
4+3]=1;this.initPromise=this.initialize()}async initialize(){this.ctx=await Fe(),this.device=this.ctx.device,this.createBuffers(),
await this.createPipelines(),this.createBindGroups(),this.initialized=!0}async ready(){await this.initPromise}createBuffers(){
const e=this.device,t=this.maxBodies*4*4,r=this.maxParticles*4*4,i=Math.ceil(this.grid.resolution[0])*Math.ceil(this.grid.
resolution[1])*Math.ceil(this.grid.resolution[2]),a=Math.ceil(i/ue),s=65535;this.gridDispatch={x:Math.min(a,s),y:Math.ceil(
a/s),z:1},this.gridStride=this.gridDispatch.x*ue;const d=i*4,n=i*Ve*4;this.buffers={bodyPositionA:w(e,t,"body-position-a"),
bodyPositionB:w(e,t,"body-position-b"),bodyQuaternionA:w(e,t,"body-quaternion-a"),bodyQuaternionB:w(e,t,"body-quaternion\
-b"),bodyVelocityA:w(e,t,"body-velocity-a"),bodyVelocityB:w(e,t,"body-velocity-b"),bodyAngularVelocityA:w(e,t,"body-angu\
lar-velocity-a"),bodyAngularVelocityB:w(e,t,"body-angular-velocity-b"),bodyForce:w(e,t,"body-force"),bodyTorque:w(e,t,"b\
ody-torque"),bodyMass:w(e,t,"body-mass"),particleLocalPosition:w(e,r,"particle-local-position"),particleRelativePosition:w(
e,r,"particle-relative-position"),particleWorldPosition:w(e,r,"particle-world-position"),particleVelocity:w(e,r,"particl\
e-velocity"),particleForce:w(e,r,"particle-force"),particleTorque:w(e,r,"particle-torque"),gridCellCount:w(e,d,"grid-cel\
l-count"),gridCellParticles:w(e,n,"grid-cell-particles"),params:Ue(e,De(256,256),"params"),stagingPosition:Be(e,t,"stagi\
ng-position"),stagingQuaternion:Be(e,t,"staging-quaternion")}}async createPipelines(){const e=this.device,t=n=>Ne+`
`+n,r=(n,o)=>({binding:n,visibility:GPUShaderStage.COMPUTE,buffer:{type:o}}),i=(n,o)=>e.createBindGroupLayout({label:n,entries:o}),
a=(n,o,C)=>e.createComputePipeline({label:n,layout:e.createPipelineLayout({label:`${n}-layout`,bindGroupLayouts:[C]}),compute:{
module:o,entryPoint:"main"}}),s={localToWorld:_(e,t(He),"local-to-world"),localToRelative:_(e,t($e),"local-to-relative"),
bodyVelToParticleVel:_(e,t(Je),"body-vel-to-particle-vel"),clearGrid:_(e,t(et),"clear-grid"),buildGrid:_(e,t(tt),"build-\
grid"),updateForce:_(e,t(rt),"update-force"),updateTorque:_(e,t(it),"update-torque"),reduceForce:_(e,t(nt),"reduce-force"),
reduceTorque:_(e,t(ot),"reduce-torque"),updateBodyVelocity:_(e,t(at),"update-body-velocity"),updateBodyAngularVelocity:_(
e,t(st),"update-body-angular-velocity"),updateBodyPosition:_(e,t(dt),"update-body-position"),updateBodyQuaternion:_(e,t(
lt),"update-body-quaternion")},d={localToWorld:i("layout/local-to-world",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"r\
ead-only-storage"),r(3,"read-only-storage"),r(4,"storage")]),localToRelative:i("layout/local-to-relative",[r(0,"uniform"),
r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"read-only-storage"),r(4,"storage")]),bodyVelToParticleVel:i("layo\
ut/body-vel-to-particle-vel",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"read-only-storage"),
r(4,"storage")]),clearGrid:i("layout/clear-grid",[r(0,"uniform"),r(1,"storage")]),buildGrid:i("layout/build-grid",[r(0,"\
uniform"),r(1,"read-only-storage"),r(2,"storage"),r(3,"storage")]),updateForce:i("layout/update-force",[r(0,"uniform"),r(
1,"read-only-storage"),r(2,"read-only-storage"),r(3,"read-only-storage"),r(4,"read-only-storage"),r(5,"read-only-storage"),
r(6,"read-only-storage"),r(7,"storage")]),updateTorque:i("layout/update-torque",[r(0,"uniform"),r(1,"read-only-storage"),
r(2,"read-only-storage"),r(3,"read-only-storage"),r(4,"read-only-storage"),r(5,"read-only-storage"),r(6,"read-only-stora\
ge"),r(7,"storage")]),reduceForce:i("layout/reduce-force",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storag\
e"),r(3,"storage")]),reduceTorque:i("layout/reduce-torque",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-stora\
ge"),r(3,"read-only-storage"),r(4,"read-only-storage"),r(5,"storage")]),updateBodyVelocity:i("layout/update-body-velocit\
y",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"read-only-storage"),r(4,"storage")]),updateBodyAngularVelocity:i(
"layout/update-body-angular-velocity",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"read-only-s\
torage"),r(4,"read-only-storage"),r(5,"storage")]),updateBodyPosition:i("layout/update-body-position",[r(0,"uniform"),r(
1,"read-only-storage"),r(2,"read-only-storage"),r(3,"storage")]),updateBodyQuaternion:i("layout/update-body-quaternion",
[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"storage")])};this.layouts=d,this.pipelines={localToWorld:a(
"local-to-world",s.localToWorld,d.localToWorld),localToRelative:a("local-to-relative",s.localToRelative,d.localToRelative),
bodyVelToParticleVel:a("body-vel-to-particle-vel",s.bodyVelToParticleVel,d.bodyVelToParticleVel),clearGrid:a("clear-grid",
s.clearGrid,d.clearGrid),buildGrid:a("build-grid",s.buildGrid,d.buildGrid),updateForce:a("update-force",s.updateForce,d.
updateForce),updateTorque:a("update-torque",s.updateTorque,d.updateTorque),reduceForce:a("reduce-force",s.reduceForce,d.
reduceForce),reduceTorque:a("reduce-torque",s.reduceTorque,d.reduceTorque),updateBodyVelocity:a("update-body-velocity",s.
updateBodyVelocity,d.updateBodyVelocity),updateBodyAngularVelocity:a("update-body-angular-velocity",s.updateBodyAngularVelocity,
d.updateBodyAngularVelocity),updateBodyPosition:a("update-body-position",s.updateBodyPosition,d.updateBodyPosition),updateBodyQuaternion:a(
"update-body-quaternion",s.updateBodyQuaternion,d.updateBodyQuaternion)}}createBindGroups(){this.updateBindGroups()}updateBindGroups(){
const e=this.device,t=this.buffers,r=this.layouts,i=this.bufferIndex===0?t.bodyPositionA:t.bodyPositionB,a=this.bufferIndex===
0?t.bodyPositionB:t.bodyPositionA,s=this.bufferIndex===0?t.bodyQuaternionA:t.bodyQuaternionB,d=this.bufferIndex===0?t.bodyQuaternionB:
t.bodyQuaternionA,n=this.bufferIndex===0?t.bodyVelocityA:t.bodyVelocityB,o=this.bufferIndex===0?t.bodyVelocityB:t.bodyVelocityA,
C=this.bufferIndex===0?t.bodyAngularVelocityA:t.bodyAngularVelocityB,D=this.bufferIndex===0?t.bodyAngularVelocityB:t.bodyAngularVelocityA;
this.bindGroups.set("localToWorld",e.createBindGroup({layout:r.localToWorld,entries:[{binding:0,resource:{buffer:t.params}},
{binding:1,resource:{buffer:t.particleLocalPosition}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:s}},{binding:4,
resource:{buffer:t.particleWorldPosition}}]})),this.bindGroups.set("localToRelative",e.createBindGroup({layout:r.localToRelative,
entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.particleLocalPosition}},{binding:2,resource:{
buffer:i}},{binding:3,resource:{buffer:s}},{binding:4,resource:{buffer:t.particleRelativePosition}}]})),this.bindGroups.
set("bodyVelToParticleVel",e.createBindGroup({layout:r.bodyVelToParticleVel,entries:[{binding:0,resource:{buffer:t.params}},
{binding:1,resource:{buffer:t.particleRelativePosition}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:C}},
{binding:4,resource:{buffer:t.particleVelocity}}]})),this.bindGroups.set("clearGrid",e.createBindGroup({layout:r.clearGrid,
entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.gridCellCount}}]})),this.bindGroups.set("b\
uildGrid",e.createBindGroup({layout:r.buildGrid,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.
particleWorldPosition}},{binding:2,resource:{buffer:t.gridCellCount}},{binding:3,resource:{buffer:t.gridCellParticles}}]})),
this.bindGroups.set("updateForce",e.createBindGroup({layout:r.updateForce,entries:[{binding:0,resource:{buffer:t.params}},
{binding:1,resource:{buffer:t.particleWorldPosition}},{binding:2,resource:{buffer:t.particleRelativePosition}},{binding:3,
resource:{buffer:t.particleVelocity}},{binding:4,resource:{buffer:C}},{binding:5,resource:{buffer:t.gridCellCount}},{binding:6,
resource:{buffer:t.gridCellParticles}},{binding:7,resource:{buffer:t.particleForce}}]})),this.bindGroups.set("updateTorq\
ue",e.createBindGroup({layout:r.updateTorque,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.
particleWorldPosition}},{binding:2,resource:{buffer:t.particleRelativePosition}},{binding:3,resource:{buffer:t.particleVelocity}},
{binding:4,resource:{buffer:C}},{binding:5,resource:{buffer:t.gridCellCount}},{binding:6,resource:{buffer:t.gridCellParticles}},
{binding:7,resource:{buffer:t.particleTorque}}]})),this.bindGroups.set("reduceForce",e.createBindGroup({layout:r.reduceForce,
entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.particleLocalPosition}},{binding:2,resource:{
buffer:t.particleForce}},{binding:3,resource:{buffer:t.bodyForce}}]})),this.bindGroups.set("reduceTorque",e.createBindGroup(
{layout:r.reduceTorque,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.particleLocalPosition}},
{binding:2,resource:{buffer:t.particleRelativePosition}},{binding:3,resource:{buffer:t.particleForce}},{binding:4,resource:{
buffer:t.particleTorque}},{binding:5,resource:{buffer:t.bodyTorque}}]})),this.bindGroups.set("updateBodyVelocity",e.createBindGroup(
{layout:r.updateBodyVelocity,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:n}},{binding:2,
resource:{buffer:t.bodyForce}},{binding:3,resource:{buffer:t.bodyMass}},{binding:4,resource:{buffer:o}}]})),this.bindGroups.
set("updateBodyAngularVelocity",e.createBindGroup({layout:r.updateBodyAngularVelocity,entries:[{binding:0,resource:{buffer:t.
params}},{binding:1,resource:{buffer:C}},{binding:2,resource:{buffer:t.bodyTorque}},{binding:3,resource:{buffer:t.bodyMass}},
{binding:4,resource:{buffer:s}},{binding:5,resource:{buffer:D}}]})),this.bindGroups.set("updateBodyPosition",e.createBindGroup(
{layout:r.updateBodyPosition,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:i}},{binding:2,
resource:{buffer:o}},{binding:3,resource:{buffer:a}}]})),this.bindGroups.set("updateBodyQuaternion",e.createBindGroup({layout:r.
updateBodyQuaternion,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:s}},{binding:2,resource:{
buffer:D}},{binding:3,resource:{buffer:d}}]}))}swapBuffers(){this.bufferIndex=1-this.bufferIndex,this.updateBindGroups()}flushData(){
this.bodyDataDirty&&($(this.device,this.buffers.bodyPositionA,this.bodyPositions),$(this.device,this.buffers.bodyPositionB,
this.bodyPositions),$(this.device,this.buffers.bodyQuaternionA,this.bodyQuaternions),$(this.device,this.buffers.bodyQuaternionB,
this.bodyQuaternions),this.bodyDataDirty=!1),this.particleDataDirty&&($(this.device,this.buffers.particleLocalPosition,this.
particleLocalPositions),this.particleDataDirty=!1),this.massDirty&&($(this.device,this.buffers.bodyMass,this.bodyMasses),
this.massDirty=!1),this.updateParamsBuffer()}updateParamsBuffer(){const e=new Float32Array(32);e[0]=this.params.stiffness,
e[1]=this.params.damping,e[2]=this.params.radius,e[3]=this._particleCount,e[4]=this.params.fixedTimeStep,e[5]=this.params.
friction,e[6]=this.params.drag,e[7]=this._bodyCount,e[8]=this.params.gravity[0],e[9]=this.params.gravity[1],e[10]=this.params.
gravity[2],e[11]=0,e[12]=this.params.boxSize[0],e[13]=this.params.boxSize[1],e[14]=this.params.boxSize[2],e[15]=0,e[16]=
this.grid.position[0],e[17]=this.grid.position[1],e[18]=this.grid.position[2],e[19]=0,e[20]=this.grid.resolution[0],e[21]=
this.grid.resolution[1],e[22]=this.grid.resolution[2],e[23]=this.grid.maxParticlesPerCell,e[24]=this.interactionSphere.position.
x,e[25]=this.interactionSphere.position.y,e[26]=this.interactionSphere.position.z,e[27]=this.interactionSphere.radius;const t=2*
this.params.radius/this.params.fixedTimeStep;e[28]=t,e[29]=t,e[30]=t,e[31]=this.gridStride||0,$(this.device,this.buffers.
params,e)}addBody(e,t,r,i,a,s,d,n,o,C,D){if(this._bodyCount>=this.maxBodies)return console.warn(`Cannot add body: maximu\
m (${this.maxBodies}) reached`),-1;const J=this._bodyCount,R=J*4;return this.bodyPositions[R]=e,this.bodyPositions[R+1]=
t,this.bodyPositions[R+2]=r,this.bodyPositions[R+3]=1,this.bodyQuaternions[R]=i,this.bodyQuaternions[R+1]=a,this.bodyQuaternions[R+
2]=s,this.bodyQuaternions[R+3]=d,this.bodyMasses[R]=o>0?1/o:0,this.bodyMasses[R+1]=C>0?1/C:0,this.bodyMasses[R+2]=D>0?1/
D:0,this.bodyMasses[R+3]=n>0?1/n:0,this._bodyCount++,this.bodyDataDirty=!0,this.massDirty=!0,J}addParticle(e,t,r,i){if(this.
_particleCount>=this.maxParticles)return console.warn(`Cannot add particle: maximum (${this.maxParticles}) reached`),-1;
const a=this._particleCount,s=a*4;return this.particleLocalPositions[s]=t,this.particleLocalPositions[s+1]=r,this.particleLocalPositions[s+
2]=i,this.particleLocalPositions[s+3]=e,this._particleCount++,this.particleDataDirty=!0,a}step(e){if(!this.initialized){
console.warn("World not initialized. Call await world.ready() first.");return}this.accumulator+=e;let t=0;for(;this.accumulator>=
this.params.fixedTimeStep&&t<this.maxSubSteps;)this.singleStep(),this.accumulator-=this.params.fixedTimeStep,t++;this._interpolationValue=
this.accumulator/this.params.fixedTimeStep,this.time+=e}singleStep(){this.flushData();const e=this.device.createCommandEncoder(
{label:"physics-step"});e.clearBuffer(this.buffers.bodyForce),e.clearBuffer(this.buffers.bodyTorque),e.clearBuffer(this.
buffers.gridCellParticles);const t=Ie(this._particleCount,ue),r=Ie(this._bodyCount,ue);{const i=e.beginComputePass({label:"\
local-to-world"});i.setPipeline(this.pipelines.localToWorld),i.setBindGroup(0,this.bindGroups.get("localToWorld")),i.dispatchWorkgroups(
t),i.end()}{const i=e.beginComputePass({label:"local-to-relative"});i.setPipeline(this.pipelines.localToRelative),i.setBindGroup(
0,this.bindGroups.get("localToRelative")),i.dispatchWorkgroups(t),i.end()}{const i=e.beginComputePass({label:"body-vel-t\
o-particle-vel"});i.setPipeline(this.pipelines.bodyVelToParticleVel),i.setBindGroup(0,this.bindGroups.get("bodyVelToPart\
icleVel")),i.dispatchWorkgroups(t),i.end()}{const i=e.beginComputePass({label:"clear-grid"});i.setPipeline(this.pipelines.
clearGrid),i.setBindGroup(0,this.bindGroups.get("clearGrid")),i.dispatchWorkgroups(this.gridDispatch.x,this.gridDispatch.
y,this.gridDispatch.z),i.end()}{const i=e.beginComputePass({label:"build-grid"});i.setPipeline(this.pipelines.buildGrid),
i.setBindGroup(0,this.bindGroups.get("buildGrid")),i.dispatchWorkgroups(t),i.end()}{const i=e.beginComputePass({label:"u\
pdate-force"});i.setPipeline(this.pipelines.updateForce),i.setBindGroup(0,this.bindGroups.get("updateForce")),i.dispatchWorkgroups(
t),i.end()}{const i=e.beginComputePass({label:"update-torque"});i.setPipeline(this.pipelines.updateTorque),i.setBindGroup(
0,this.bindGroups.get("updateTorque")),i.dispatchWorkgroups(t),i.end()}{const i=e.beginComputePass({label:"reduce-force"});
i.setPipeline(this.pipelines.reduceForce),i.setBindGroup(0,this.bindGroups.get("reduceForce")),i.dispatchWorkgroups(t),i.
end()}{const i=e.beginComputePass({label:"reduce-torque"});i.setPipeline(this.pipelines.reduceTorque),i.setBindGroup(0,this.
bindGroups.get("reduceTorque")),i.dispatchWorkgroups(t),i.end()}{const i=e.beginComputePass({label:"update-body-velocity"});
i.setPipeline(this.pipelines.updateBodyVelocity),i.setBindGroup(0,this.bindGroups.get("updateBodyVelocity")),i.dispatchWorkgroups(
r),i.end()}{const i=e.beginComputePass({label:"update-body-angular-velocity"});i.setPipeline(this.pipelines.updateBodyAngularVelocity),
i.setBindGroup(0,this.bindGroups.get("updateBodyAngularVelocity")),i.dispatchWorkgroups(r),i.end()}{const i=e.beginComputePass(
{label:"update-body-position"});i.setPipeline(this.pipelines.updateBodyPosition),i.setBindGroup(0,this.bindGroups.get("u\
pdateBodyPosition")),i.dispatchWorkgroups(r),i.end()}{const i=e.beginComputePass({label:"update-body-quaternion"});i.setPipeline(
this.pipelines.updateBodyQuaternion),i.setBindGroup(0,this.bindGroups.get("updateBodyQuaternion")),i.dispatchWorkgroups(
r),i.end()}this.device.queue.submit([e.finish()]),this.swapBuffers(),this.fixedTime+=this.params.fixedTimeStep}get bodyCount(){
return this._bodyCount}get particleCount(){return this._particleCount}getParticleWorldPositionBuffer(){return this.buffers.
particleWorldPosition}getParticlePositionBuffer(){return this.getParticleWorldPositionBuffer()}getParamsBuffer(){return this.
buffers.params}get interpolationValue(){return this._interpolationValue}get stiffness(){return this.params.stiffness}set stiffness(e){
this.params.stiffness=e}get damping(){return this.params.damping}set damping(e){this.params.damping=e}get friction(){return this.
params.friction}set friction(e){this.params.friction=e}get drag(){return this.params.drag}set drag(e){this.params.drag=e}get radius(){
return this.params.radius}set radius(e){this.params.radius=e}get fixedTimeStep(){return this.params.fixedTimeStep}set fixedTimeStep(e){
this.params.fixedTimeStep=e}get gravity(){return new I(this.params.gravity[0],this.params.gravity[1],this.params.gravity[2])}set gravity(e){
this.params.gravity[0]=e.x,this.params.gravity[1]=e.y,this.params.gravity[2]=e.z}setSpherePosition(e,t,r,i){if(e!==0)throw new Error(
"Multiple spheres not supported yet");this.interactionSphere.position.set(t,r,i)}getSpherePosition(e,t){if(e!==0)throw new Error(
"Multiple spheres not supported yet");return t=t||new I,t.copy(this.interactionSphere.position),t}setSphereRadius(e,t){if(e!==
0)throw new Error("Multiple spheres not supported yet");this.interactionSphere.radius=t}getSphereRadius(e){if(e!==0)throw new Error(
"Multiple spheres not supported yet");return this.interactionSphere.radius}async readBodyPositions(){const e=this._bodyCount*
4*4,t=this.bufferIndex===0?this.buffers.bodyPositionA:this.buffers.bodyPositionB,r=await Ce(this.device,t,this.buffers.stagingPosition,
e);return new Float32Array(r)}async readBodyQuaternions(){const e=this._bodyCount*4*4,t=this.bufferIndex===0?this.buffers.
bodyQuaternionA:this.buffers.bodyQuaternionB,r=await Ce(this.device,t,this.buffers.stagingQuaternion,e);return new Float32Array(
r)}getDevice(){return this.device}getBodyPositionBuffer(){return this.bufferIndex===0?this.buffers.bodyPositionA:this.buffers.
bodyPositionB}getBodyQuaternionBuffer(){return this.bufferIndex===0?this.buffers.bodyQuaternionA:this.buffers.bodyQuaternionB}destroy(){
this.initialized&&(Object.values(this.buffers).forEach(e=>{e&&typeof e.destroy=="function"&&e.destroy()}),this.bindGroups.
clear(),this.initialized=!1)}}class ae{constructor(e,t,r){this.device=e,this.format=r||navigator.gpu.getPreferredCanvasFormat(),
this.vertexBuffer=e.createBuffer({size:t.vertices.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),e.queue.
writeBuffer(this.vertexBuffer,0,t.vertices),this.indexBuffer=e.createBuffer({size:t.indices.byteLength,usage:GPUBufferUsage.
INDEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.indexBuffer,0,t.indices),this.indexCount=t.indices.length,this.
uniformBuffer=e.createBuffer({size:80,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const a=e.createShaderModule(
{code:`
      struct Uniforms {
        viewProj: mat4x4<f32>,
        scale: vec3<f32>,
      }
      @group(0) @binding(0) var<uniform> uniforms: Uniforms;
      @group(0) @binding(1) var<storage, read> positions: array<vec4<f32>>;
      @group(0) @binding(2) var<storage, read> quaternions: array<vec4<f32>>;

      struct VertexOutput {
        @builtin(position) position: vec4<f32>,
        @location(0) normal: vec3<f32>,
        @location(1) @interpolate(flat) instanceId: u32
      }

      fn quatRotate(q: vec4<f32>, v: vec3<f32>) -> vec3<f32> {
        let t = 2.0 * cross(q.xyz, v);
        return v + q.w * t + cross(q.xyz, t);
      }

      @vertex
      fn vs_main(
        @location(0) localPos: vec3<f32>,
        @location(1) normal: vec3<f32>,
        @builtin(instance_index) instanceId: u32
      ) -> VertexOutput {
        let bodyPos = positions[instanceId].xyz;
        let bodyQuat = quaternions[instanceId];
        
        // Apply scale then rotate then translate
        let scaledPos = localPos * uniforms.scale;
        let worldPos = bodyPos + quatRotate(bodyQuat, scaledPos);
        let worldNormal = quatRotate(bodyQuat, normal);
        
        var out: VertexOutput;
        out.position = uniforms.viewProj * vec4(worldPos, 1.0);
        out.normal = worldNormal;
        out.instanceId = instanceId;
        return out;
      }

      @fragment
      fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
        let lightDir = vec3(0.0, 1.0, 0.0); // Straight down
        let ambient = 0.3;
        let diffuse = max(dot(in.normal, lightDir), 0.0);
        let hue = f32(in.instanceId % 12u) / 12.0;
        let color = hsvToRgb(hue, 0.7, 0.9);
        let lighting = ambient + diffuse * 1.0;
        return vec4(color * lighting, 1.0);
      }

      fn hsvToRgb(h: f32, s: f32, v: f32) -> vec3<f32> {
        let c = v * s;
        let x = c * (1.0 - abs(fract(h * 6.0) * 2.0 - 1.0));
        let m = v - c;
        var rgb: vec3<f32>;
        let hi = u32(h * 6.0) % 6u;
        if (hi == 0u) { rgb = vec3(c, x, 0.0); }
        else if (hi == 1u) { rgb = vec3(x, c, 0.0); }
        else if (hi == 2u) { rgb = vec3(0.0, c, x); }
        else if (hi == 3u) { rgb = vec3(0.0, x, c); }
        else if (hi == 4u) { rgb = vec3(x, 0.0, c); }
        else { rgb = vec3(c, 0.0, x); }
        return rgb + vec3(m);
      }
    `}),s=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,
visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.VERTEX,buffer:{
type:"read-only-storage"}}]});this.pipeline=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[s]}),
vertex:{module:a,entryPoint:"vs_main",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},
{shaderLocation:1,offset:12,format:"float32x3"}]}]},fragment:{module:a,entryPoint:"fs_main",targets:[{format:this.format}]},
primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"\
less"}}),this.bindGroup=null}updateBindGroup(e,t){this.bindGroup=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(
0),entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:e}},{binding:2,resource:{buffer:t}}]})}record(e,t,r=0,{
viewProj:i,scale:a=[1,1,1]}={}){this.bindGroup&&(e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.setVertexBuffer(
0,this.vertexBuffer),e.setIndexBuffer(this.indexBuffer,"uint16"),e.drawIndexed(this.indexCount,t,0,0,r))}updateUniforms(e,t=[
1,1,1]){const r=new Float32Array(20);r.set(e,0),r.set(t,16),this.device.queue.writeBuffer(this.uniformBuffer,0,r)}}class ct{constructor(e,t,r={}){
this.device=e,this.format=t||navigator.gpu.getPreferredCanvasFormat();const i=r.size||40,a=r.height||0,s=new Float32Array(
[-i,a,-i,i,a,-i,i,a,i,-i,a,i]),d=new Uint16Array([0,2,1,0,3,2]);this.vertexBuffer=e.createBuffer({size:s.byteLength,usage:GPUBufferUsage.
VERTEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.vertexBuffer,0,s),this.indexBuffer=e.createBuffer({size:d.byteLength,
usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.indexBuffer,0,d),this.indexCount=d.length,
this.uniformBuffer=e.createBuffer({size:80,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const o=e.createShaderModule(
{code:`
      struct Uniforms {
        viewProj: mat4x4<f32>,
        planeHeight: f32,
        gridSize: f32,
        lineWidth: f32,
        pad: f32,
      };
      @group(0) @binding(0) var<uniform> uniforms: Uniforms;

      struct VSOut {
        @builtin(position) position: vec4<f32>,
        @location(0) worldPos: vec3<f32>,
      };

      @vertex
      fn vs_main(@location(0) pos: vec3<f32>) -> VSOut {
        var out: VSOut;
        out.worldPos = pos;
        out.position = uniforms.viewProj * vec4(pos, 1.0);
        return out;
      }

      fn gridMask(p: vec3<f32>, grid: f32, width: f32) -> f32 {
        let gx = abs(fract(p.x / grid) - 0.5) * grid;
        let gz = abs(fract(p.z / grid) - 0.5) * grid;
        let d = min(gx, gz);
        return smoothstep(width, width * 0.2, d);
      }

      @fragment
      fn fs_main(in: VSOut) -> @location(0) vec4<f32> {
        let line = 1.0 - gridMask(in.worldPos, uniforms.gridSize, uniforms.lineWidth);
        let base = vec3(0.08, 0.09, 0.1);
        let color = mix(base, vec3(0.35, 0.4, 0.45), line);
        return vec4(color, 1.0);
      }
    `}),C=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{
type:"uniform"}}]});this.pipeline=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[C]}),vertex:{
module:o,entryPoint:"vs_main",buffers:[{arrayStride:12,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]}]},fragment:{
module:o,entryPoint:"fs_main",targets:[{format:this.format}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{
format:"depth24plus",depthWriteEnabled:!1,depthCompare:"less-equal"}}),this.bindGroup=e.createBindGroup({layout:C,entries:[
{binding:0,resource:{buffer:this.uniformBuffer}}]})}update(e,{gridSize:t=1,lineWidth:r=.04,height:i=0}={}){const a=new Float32Array(
20);a.set(e,0),a[16]=i,a[17]=t,a[18]=r,a[19]=0,this.device.queue.writeBuffer(this.uniformBuffer,0,a)}record(e){e.setPipeline(
this.pipeline),e.setBindGroup(0,this.bindGroup),e.setVertexBuffer(0,this.vertexBuffer),e.setIndexBuffer(this.indexBuffer,
"uint16"),e.drawIndexed(this.indexCount,1)}}async function pt(){const l=document.getElementById("canvas");document.getElementById(
"error");const e=document.getElementById("particleCount"),t=document.getElementById("fps");l.style.width="100%",l.style.
height="100%",l.style.display="block";const r=ke(),i=await Ee({overrides:r}),a=Oe(i,null,r),s=me({kind:"count",name:"toy\
chest-objects",baseCount:1024,minCount:128,maxCount:5e4,multiple:64,strideBytes:256,buffersCount:4,memoryFraction:.35},{
capabilities:i,overrides:r}),d=me({kind:"count",name:"toychest-max-particles",baseCount:262144,minCount:16384,maxCount:1e6,
multiple:4096,strideBytes:64,buffersCount:4,memoryFraction:.45},{capabilities:i,overrides:r}),n={radius:.1,stiffness:1200,
damping:5,friction:1.5,drag:.25,gravityY:-10,sphereRadius:6,oscillate:!0,ampX:5,ampY:5,ampZ:5,showParticles:!1,paused:!1,
objectCount:s.count,resolution:i.tier==="mobile"?1:2,spawnShape:"Mix",boxX:12,boxY:100,boxZ:12};let o=null,C=null,D=null,
J=null,R=null,X=null,re={},se=null,ce=null,pe={};function xe(){return["I","J","L","O","S","T","Z"]}async function ie(){o&&
o.destroy();const k=.6/n.resolution*.5,p=k*2,m=Math.ceil(n.boxX*2/p)+8,W=Math.ceil(n.boxY*2/p)+8,U=Math.ceil(n.boxZ*2/p)+
8,Y=me({kind:"grid3d",name:"toychest-broadphase-grid",requestedDim:[m,W,U],minDim:[16,16,16],maxDim:[256,512,256],step:4,
cellStrideBytes:16,buffersCount:2,memoryFraction:.35,workgroupSize:64,dispatchDimensions:1},{capabilities:i,overrides:r}),
[K,N,ee]=Y.dim,L=Math.min(1e5,Math.max(n.objectCount+256,s.effectiveMaxCount)),H=Math.max(1,n.resolution*n.resolution*n.
resolution*4),te=Math.min(d.effectiveMaxCount,Math.max(16384,Math.min(d.count,n.objectCount*H+4096))),G=new ut({maxBodies:L,
maxParticles:te,radius:k,stiffness:n.stiffness,damping:n.damping,friction:n.friction,drag:n.drag,fixedTimeStep:1/120,gravity:new I(
0,n.gravityY,0),boxSize:new I(n.boxX,n.boxY,n.boxZ),gridPosition:new I(-n.boxX,0,-n.boxZ),gridResolution:new I(K,N,ee),maxSubSteps:s.
recommendedSubSteps||8});await G.ready();const g=G.getDevice(),y=navigator.gpu.getPreferredCanvasFormat();l.getContext("\
webgpu").configure({device:g,format:y,alphaMode:"premultiplied"});const x=new Qe(g),S=new ct(g,y,{size:40,height:0}),P=g.
createTexture({size:[l.width,l.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),h={};h.Box=new ae(
g,Le()),h.Cylinder=new ae(g,je()),h.Sphere=new ae(g,Se(1,16,12));for(let q of xe())h[`Tetris_${q}`]=new ae(g,Ze(q));const u=new ae(
g,Se(1,32,24)),b=g.createBuffer({size:16,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),B=g.createBuffer({size:16,
usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});g.queue.writeBuffer(B,0,new Float32Array([0,0,0,1])),u.updateBindGroup(
b,B),R||(R=new Xe(l,{radius:60,target:[0,.5,0]}));const T={};Re(G,T),G.setSphereRadius(0,n.sphereRadius),G.setSpherePosition(
0,0,1,0),G.step(G.fixedTimeStep||1/60),X&&X.destroy(),se&&se.destroy(),ce&&ce.destroy(),o=G,C=x,D=S,re=h,J=u,se=b,ce=B,pe=
T,X=P}function Re(c,k){const p=n.resolution,m=c.radius,W=1;function U(y,z,x){k[y]||(k[y]=[]),k[y].push([z,x])}function Y(y,z,x){
const S=c.bodyCount,P=[],h=(p-1)*m;for(let A=0;A<p;A++)for(let M=0;M<p;M++)for(let v=0;v<p;v++){const F=A*2*m-h,E=M*2*m-
h,Q=v*2*m-h;P.push([F,E,Q])}const u=ve(P.length*W,P),b=P.length*W,B=new I(Math.random(),Math.random(),Math.random()).normalize(),
T=Math.random()*Math.PI*2,q=Math.sin(T/2),j=Math.cos(T/2),Z=c.addBody(y,z,x,B.x*q,B.y*q,B.z*q,j,b,u.x,u.y,u.z);for(let A=0;A<
p;A++)for(let M=0;M<p;M++)for(let v=0;v<p;v++)if(A===0||A===p-1||M===0||M===p-1||v===0||v===p-1){const F=A*2*m-h,E=M*2*m-
h,Q=v*2*m-h;c.addParticle(Z,F,E,Q)}U("Box",S,1)}function K(y,z,x){const S=c.bodyCount,P=W,h=Ke(P,m),u=new I(Math.random(),
Math.random(),Math.random()).normalize(),b=Math.random()*Math.PI*2,B=Math.sin(b/2),T=Math.cos(b/2),q=c.addBody(y,z,x,u.x*
B,u.y*B,u.z*B,T,P,h.x,h.y,h.z);c.addParticle(q,0,0,0),U("Sphere",S,1)}function N(y,z,x){const S=c.bodyCount,h=p*2*m/2,u=[],
b=(p-1)*m;for(let v=0;v<p;v++)for(let F=0;F<p;F++)for(let E=0;E<p;E++){const Q=v*2*m-b,V=F*2*m-b,oe=E*2*m-b;Q*Q+oe*oe<=h*
h*1.2&&u.push([Q,V,oe])}if(u.length===0)return;const B=u.length*W,T=ve(B,u),q=new I(Math.random(),Math.random(),Math.random()).
normalize(),j=Math.random()*Math.PI*2,Z=Math.sin(j/2),A=Math.cos(j/2),M=c.addBody(y,z,x,q.x*Z,q.y*Z,q.z*Z,A,B,T.x,T.y,T.
z);for(let v of u)c.addParticle(M,v[0],v[1],v[2]);U("Cylinder",S,1)}function ee(y,z,x,S){const P=c.bodyCount,h=Ye(S),u=p*
2*m,b=[],B=(p-1)*m;for(let V of h){const oe=V[0]*u,Ge=V[1]*u,qe=V[2]*u;for(let ye=0;ye<p;ye++)for(let be=0;be<p;be++)for(let he=0;he<
p;he++){const Te=ye*2*m-B,Ae=be*2*m-B,Me=he*2*m-B;b.push([oe+Te,Ge+Ae,qe+Me])}}let T=0,q=0,j=0;for(let V of b)T+=V[0],q+=
V[1],j+=V[2];T/=b.length,q/=b.length,j/=b.length;for(let V of b)V[0]-=T,V[1]-=q,V[2]-=j;const Z=b.length*W,A=ve(Z,b),M=new I(
Math.random(),Math.random(),Math.random()).normalize(),v=Math.random()*Math.PI*2,F=Math.sin(v/2),E=Math.cos(v/2),Q=c.addBody(
y,z,x,M.x*F,M.y*F,M.z*F,E,Z,A.x,A.y,A.z);for(let V of b)c.addParticle(Q,V[0],V[1],V[2]);U(`Tetris_${S}`,P,1)}const L=xe(),
H=n.objectCount,te=n.spawnShape,G=p*2*m*1,g=12;for(let y=0;y<H;y++){const z=Math.random()*Math.PI*2,x=Math.random()*(g/2),
S=Math.cos(z)*x,P=Math.sin(z)*x,h=2+y*(G*.25);let u=te;if(u==="Mix"){const b=Math.random();b<.25?u="Box":b<.5?u="Cylinde\
r":b<.75?u="Sphere":u="Tetris"}if(u==="Box")Y(S,h,P);else if(u==="Cylinder")N(S,h,P);else if(u==="Sphere")K(S,h,P);else if(u===
"Tetris"){const b=L[Math.floor(Math.random()*L.length)];ee(S,h,P,b)}}e.textContent=c.particleCount.toString()}await ie();
const O=new window.lil.GUI({title:"Shapes Demo"});O.add(n,"objectCount",1,5e4,1024).name("Object Count").onFinishChange(
ie),O.add(n,"resolution",1,4,1).name("Particles/Side").onFinishChange(ie),O.add(n,"spawnShape",["Box","Cylinder","Sphere",
"Tetris","Mix"]).name("Shape").onFinishChange(ie),(typeof window<"u"&&window.matchMedia&&window.matchMedia("(pointer: co\
arse)").matches||typeof navigator<"u"&&navigator.maxTouchPoints>0)&&O.close();const ne=O.addFolder("Physics");ne.add(o,"\
stiffness",0,5e3,10),ne.add(o,"damping",0,20,.1),ne.add(o,"friction",0,10,.1),ne.add(o,"fixedTimeStep",.001,.1,.001).name(
"Time Step"),ne.add(n,"gravityY",-20,20,.1).name("Gravity Y").onChange(c=>o.gravity=new I(0,c,0));const fe=O.addFolder("\
Container");fe.add(n,"boxX",2,100,1).name("Width (X)").onChange(c=>{o&&(o.params.boxSize[0]=c)}),fe.add(n,"boxY",2,100,1).
name("Height (Y)").onChange(c=>{o&&(o.params.boxSize[1]=c)}),fe.add(n,"boxZ",2,100,1).name("Depth (Z)").onChange(c=>{o&&
(o.params.boxSize[2]=c)}),O.add(n,"sphereRadius",.1,10,.05).onChange(c=>o.setSphereRadius(0,c));const de=O.addFolder("Os\
cillation");de.add(n,"oscillate"),de.add(n,"ampX",0,60).name("Amplitude X"),de.add(n,"ampY",0,60).name("Amplitude Y"),de.
add(n,"ampZ",0,60).name("Amplitude Z"),O.add(n,"showParticles").name("Render Particles"),O.add(n,"paused"),O.add({reset:ie},
"reset").name("Reset World");function Pe(){l.width=Math.max(1,Math.floor(window.innerWidth*a)),l.height=Math.max(1,Math.
floor(window.innerHeight*a)),o&&o.initialized&&(X&&X.destroy(),X=o.getDevice().createTexture({size:[l.width,l.height],format:"\
depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}))}window.addEventListener("resize",Pe),Pe();let we=performance.now(),
ge=0,le=0;function ze(){requestAnimationFrame(ze);const c=performance.now(),k=(c-we)*.001;if(we=c,ge++,le+=k,le>=1&&(t.textContent=
Math.round(ge/le).toString(),ge=0,le=0),!o||!o.initialized)return;if(n.oscillate){const g=c*.001,y=Math.sin(g*2)*n.ampX,
z=Math.cos(g*1.4)*n.ampZ,x=.8+Math.sin(g*3.6)*n.ampY;o.setSpherePosition(0,y,x,z)}n.paused||o.step(k);const p=o.getDevice(),
m=l.getContext("webgpu"),W=R.getViewProj(l.width/l.height),U=n.resolution*o.radius,Y=n.resolution*o.radius,K=o.radius,N=n.
resolution*2*o.radius;C.updateBindGroup(o.getParticleWorldPositionBuffer()),C.updateViewProj(W,o.radius),D.update(W,{gridSize:.5,
lineWidth:.04,height:0});const ee=new Float32Array(4),L=o.getSpherePosition(0);ee.set([L.x,L.y,L.z,1]),p.queue.writeBuffer(
se,0,ee);const H=o.getSphereRadius(0);J.updateUniforms(W,[H,H,H]);for(let g in re){re[g].updateBindGroup(o.getBodyPositionBuffer(),
o.getBodyQuaternionBuffer());let y=[1,1,1];g==="Box"?y=[U,U,U]:g==="Cylinder"?y=[Y,Y,Y]:g==="Sphere"?y=[K,K,K]:g.startsWith(
"Tetris")&&(y=[N,N,N]),re[g].updateUniforms(W,y)}const te=p.createCommandEncoder(),G=te.beginRenderPass({colorAttachments:[
{view:m.getCurrentTexture().createView(),clearValue:{r:.14,g:.16,b:.2,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{
view:X.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});if(n.showParticles)C.record(G,o.particleCount);else
for(let g in pe){const y=pe[g],z=re[g];if(z)for(let x of y){const S=x[0],P=x[1];z.record(G,P,S)}}J.record(G,1),D.record(
G),G.end(),p.queue.submit([te.finish()])}ze()}pt().catch(l=>{const e=document.getElementById("error");e.textContent=`Err\
or: ${l.message||l}`,console.error(l)});
