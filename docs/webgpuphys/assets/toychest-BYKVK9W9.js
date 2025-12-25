var Re=Object.defineProperty;var Ge=(s,e,t)=>e in s?Re(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var u=(s,e,t)=>Ge(s,typeof e!="symbol"?e+"":e,t);import{i as qe,c as me,a as Te,b as P,d as W,w as H,g as ve,r as xe,e as Ae}from"./device-CAsdAK37.js";import{P as _e}from"./particleRenderer-xFdTy0S0.js";import{c as Me,a as We,b as Pe,d as Oe,O as Fe,g as Ue}from"./orbitControls-7kOmSw7O.js";class C{constructor(e=0,t=0,r=0){this.data=new Float32Array([e,t,r])}get x(){return this.data[0]}set x(e){this.data[0]=e}get y(){return this.data[1]}set y(e){this.data[1]=e}get z(){return this.data[2]}set z(e){this.data[2]=e}set(e,t,r){return this.data[0]=e,this.data[1]=t,this.data[2]=r,this}copy(e){return this.data[0]=e.data[0],this.data[1]=e.data[1],this.data[2]=e.data[2],this}clone(){return new C(this.x,this.y,this.z)}add(e){return this.data[0]+=e.data[0],this.data[1]+=e.data[1],this.data[2]+=e.data[2],this}sub(e){return this.data[0]-=e.data[0],this.data[1]-=e.data[1],this.data[2]-=e.data[2],this}scale(e){return this.data[0]*=e,this.data[1]*=e,this.data[2]*=e,this}dot(e){return this.data[0]*e.data[0]+this.data[1]*e.data[1]+this.data[2]*e.data[2]}cross(e){const t=this.data[0],r=this.data[1],i=this.data[2],n=e.data[0],o=e.data[1],a=e.data[2];return this.data[0]=r*a-i*o,this.data[1]=i*n-t*a,this.data[2]=t*o-r*n,this}length(){return Math.sqrt(this.dot(this))}lengthSq(){return this.dot(this)}normalize(){const e=this.length();return e>0&&this.scale(1/e),this}static cross(e,t,r=new C){return r.data[0]=e.y*t.z-e.z*t.y,r.data[1]=e.z*t.x-e.x*t.z,r.data[2]=e.x*t.y-e.y*t.x,r}static dot(e,t){return e.x*t.x+e.y*t.y+e.z*t.z}}function fe(s,e){const t=s/e.length;let r=0,i=0,n=0;for(const o of e){const a=o[0],g=o[1],p=o[2];r+=t*(g*g+p*p),i+=t*(a*a+p*p),n+=t*(a*a+g*g)}return new C(r,i,n)}function De(s,e){const t=.4*s*e*e;return new C(t,t,t)}const ke=`// Shared WGSL utilities for WebGPU Physics

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
`,Ee=`// Transform local particle positions to world space

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
`,Qe=`// Compute relative particle positions (for torque calculation)

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
`,Le=`// Derive particle velocities from body velocities

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
`,je=`// Clear the spatial hash grid

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
`,Ze=`// Build spatial hash grid from particle positions

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
`,Xe=`// Calculate particle collision forces

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
    force += particleForce(stiffness, damping, friction, radius + sphereRadius, sphereRadius, position, spherePos, velocity, vec3<f32>(0.0));
  }
  
  particleForceOut[particleIndex] = vec4<f32>(force, 1.0);
}
`,Ye=`// Calculate particle collision torques (similar to force but for rotation)

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
            
            let force = particleForce(stiffness, damping, friction, 2.0 * radius, radius, position, neighborPos, v, nv);
            
            // Torque = r x F (relative position cross force)
            torque += cross3(relativePos, force);
          }
        }
      }
    }
  }
  
  particleTorqueOut[particleIndex] = vec4<f32>(torque, 1.0);
}
`,Ke=`// Reduce particle forces to body forces using atomics

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
`,Ne=`// Reduce particle torques to body torques using atomics

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
`,He=`// Update body linear velocity

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
`,$e=`// Update body angular velocity

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
`,Je=`// Update body position

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
`,et=`// Update body quaternion

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
`,se=64,we=4;class tt{constructor(e={}){u(this,"ctx");u(this,"device");u(this,"buffers");u(this,"pipelines");u(this,"layouts");u(this,"bindGroups",new Map);u(this,"_bodyCount",0);u(this,"_particleCount",0);u(this,"maxBodies");u(this,"maxParticles");u(this,"params");u(this,"grid");u(this,"time",0);u(this,"fixedTime",0);u(this,"accumulator",0);u(this,"maxSubSteps");u(this,"_interpolationValue",0);u(this,"bufferIndex",0);u(this,"bodyPositions");u(this,"bodyQuaternions");u(this,"bodyMasses");u(this,"particleLocalPositions");u(this,"bodyDataDirty",!0);u(this,"particleDataDirty",!0);u(this,"massDirty",!0);u(this,"interactionSphere",{position:new C(10,1,0),radius:1});u(this,"initPromise");u(this,"initialized",!1);var r,i,n;this.maxBodies=e.maxBodies||64,this.maxParticles=e.maxParticles||256,this.maxSubSteps=e.maxSubSteps||5,this.params={stiffness:e.stiffness??1700,damping:e.damping??6,friction:e.friction??2,drag:e.drag??.1,radius:e.radius??.5,fixedTimeStep:e.fixedTimeStep??1/120,gravity:((r=e.gravity)==null?void 0:r.data)??new Float32Array([0,-9.81,0]),boxSize:((i=e.boxSize)==null?void 0:i.data)??new Float32Array([10,10,10])};const t=e.gridResolution||new C(64,64,64);this.grid={position:((n=e.gridPosition)==null?void 0:n.data)??new Float32Array([0,0,0]),resolution:t.data,maxParticlesPerCell:we},this.bodyPositions=new Float32Array(this.maxBodies*4),this.bodyQuaternions=new Float32Array(this.maxBodies*4),this.bodyMasses=new Float32Array(this.maxBodies*4),this.particleLocalPositions=new Float32Array(this.maxParticles*4);for(let o=0;o<this.maxBodies;o++)this.bodyQuaternions[o*4+3]=1;this.initPromise=this.initialize()}async initialize(){this.ctx=await qe(),this.device=this.ctx.device,this.createBuffers(),await this.createPipelines(),this.createBindGroups(),this.initialized=!0}async ready(){await this.initPromise}createBuffers(){const e=this.device,t=this.maxBodies*4*4,r=this.maxParticles*4*4,i=Math.ceil(this.grid.resolution[0])*Math.ceil(this.grid.resolution[1])*Math.ceil(this.grid.resolution[2]),n=Math.ceil(i/se),o=65535;this.gridDispatch={x:Math.min(n,o),y:Math.ceil(n/o),z:1},this.gridStride=this.gridDispatch.x*se;const a=i*4,g=i*we*4;this.buffers={bodyPositionA:P(e,t,"body-position-a"),bodyPositionB:P(e,t,"body-position-b"),bodyQuaternionA:P(e,t,"body-quaternion-a"),bodyQuaternionB:P(e,t,"body-quaternion-b"),bodyVelocityA:P(e,t,"body-velocity-a"),bodyVelocityB:P(e,t,"body-velocity-b"),bodyAngularVelocityA:P(e,t,"body-angular-velocity-a"),bodyAngularVelocityB:P(e,t,"body-angular-velocity-b"),bodyForce:P(e,t,"body-force"),bodyTorque:P(e,t,"body-torque"),bodyMass:P(e,t,"body-mass"),particleLocalPosition:P(e,r,"particle-local-position"),particleRelativePosition:P(e,r,"particle-relative-position"),particleWorldPosition:P(e,r,"particle-world-position"),particleVelocity:P(e,r,"particle-velocity"),particleForce:P(e,r,"particle-force"),particleTorque:P(e,r,"particle-torque"),gridCellCount:P(e,a,"grid-cell-count"),gridCellParticles:P(e,g,"grid-cell-particles"),params:Te(e,Ae(256,256),"params"),stagingPosition:me(e,t,"staging-position"),stagingQuaternion:me(e,t,"staging-quaternion")}}async createPipelines(){const e=this.device,t=g=>ke+`
`+g,r=(g,p)=>({binding:g,visibility:GPUShaderStage.COMPUTE,buffer:{type:p}}),i=(g,p)=>e.createBindGroupLayout({label:g,entries:p}),n=(g,p,w)=>e.createComputePipeline({label:g,layout:e.createPipelineLayout({label:`${g}-layout`,bindGroupLayouts:[w]}),compute:{module:p,entryPoint:"main"}}),o={localToWorld:W(e,t(Ee),"local-to-world"),localToRelative:W(e,t(Qe),"local-to-relative"),bodyVelToParticleVel:W(e,t(Le),"body-vel-to-particle-vel"),clearGrid:W(e,t(je),"clear-grid"),buildGrid:W(e,t(Ze),"build-grid"),updateForce:W(e,t(Xe),"update-force"),updateTorque:W(e,t(Ye),"update-torque"),reduceForce:W(e,t(Ke),"reduce-force"),reduceTorque:W(e,t(Ne),"reduce-torque"),updateBodyVelocity:W(e,t(He),"update-body-velocity"),updateBodyAngularVelocity:W(e,t($e),"update-body-angular-velocity"),updateBodyPosition:W(e,t(Je),"update-body-position"),updateBodyQuaternion:W(e,t(et),"update-body-quaternion")},a={localToWorld:i("layout/local-to-world",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"read-only-storage"),r(4,"storage")]),localToRelative:i("layout/local-to-relative",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"read-only-storage"),r(4,"storage")]),bodyVelToParticleVel:i("layout/body-vel-to-particle-vel",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"read-only-storage"),r(4,"storage")]),clearGrid:i("layout/clear-grid",[r(0,"uniform"),r(1,"storage")]),buildGrid:i("layout/build-grid",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"storage"),r(3,"storage")]),updateForce:i("layout/update-force",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"read-only-storage"),r(4,"read-only-storage"),r(5,"read-only-storage"),r(6,"read-only-storage"),r(7,"storage")]),updateTorque:i("layout/update-torque",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"read-only-storage"),r(4,"read-only-storage"),r(5,"read-only-storage"),r(6,"read-only-storage"),r(7,"storage")]),reduceForce:i("layout/reduce-force",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"storage")]),reduceTorque:i("layout/reduce-torque",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"read-only-storage"),r(4,"read-only-storage"),r(5,"storage")]),updateBodyVelocity:i("layout/update-body-velocity",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"read-only-storage"),r(4,"storage")]),updateBodyAngularVelocity:i("layout/update-body-angular-velocity",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"read-only-storage"),r(4,"read-only-storage"),r(5,"storage")]),updateBodyPosition:i("layout/update-body-position",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"storage")]),updateBodyQuaternion:i("layout/update-body-quaternion",[r(0,"uniform"),r(1,"read-only-storage"),r(2,"read-only-storage"),r(3,"storage")])};this.layouts=a,this.pipelines={localToWorld:n("local-to-world",o.localToWorld,a.localToWorld),localToRelative:n("local-to-relative",o.localToRelative,a.localToRelative),bodyVelToParticleVel:n("body-vel-to-particle-vel",o.bodyVelToParticleVel,a.bodyVelToParticleVel),clearGrid:n("clear-grid",o.clearGrid,a.clearGrid),buildGrid:n("build-grid",o.buildGrid,a.buildGrid),updateForce:n("update-force",o.updateForce,a.updateForce),updateTorque:n("update-torque",o.updateTorque,a.updateTorque),reduceForce:n("reduce-force",o.reduceForce,a.reduceForce),reduceTorque:n("reduce-torque",o.reduceTorque,a.reduceTorque),updateBodyVelocity:n("update-body-velocity",o.updateBodyVelocity,a.updateBodyVelocity),updateBodyAngularVelocity:n("update-body-angular-velocity",o.updateBodyAngularVelocity,a.updateBodyAngularVelocity),updateBodyPosition:n("update-body-position",o.updateBodyPosition,a.updateBodyPosition),updateBodyQuaternion:n("update-body-quaternion",o.updateBodyQuaternion,a.updateBodyQuaternion)}}createBindGroups(){this.updateBindGroups()}updateBindGroups(){const e=this.device,t=this.buffers,r=this.layouts,i=this.bufferIndex===0?t.bodyPositionA:t.bodyPositionB,n=this.bufferIndex===0?t.bodyPositionB:t.bodyPositionA,o=this.bufferIndex===0?t.bodyQuaternionA:t.bodyQuaternionB,a=this.bufferIndex===0?t.bodyQuaternionB:t.bodyQuaternionA,g=this.bufferIndex===0?t.bodyVelocityA:t.bodyVelocityB,p=this.bufferIndex===0?t.bodyVelocityB:t.bodyVelocityA,w=this.bufferIndex===0?t.bodyAngularVelocityA:t.bodyAngularVelocityB,D=this.bufferIndex===0?t.bodyAngularVelocityB:t.bodyAngularVelocityA;this.bindGroups.set("localToWorld",e.createBindGroup({layout:r.localToWorld,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.particleLocalPosition}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:o}},{binding:4,resource:{buffer:t.particleWorldPosition}}]})),this.bindGroups.set("localToRelative",e.createBindGroup({layout:r.localToRelative,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.particleLocalPosition}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:o}},{binding:4,resource:{buffer:t.particleRelativePosition}}]})),this.bindGroups.set("bodyVelToParticleVel",e.createBindGroup({layout:r.bodyVelToParticleVel,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.particleRelativePosition}},{binding:2,resource:{buffer:g}},{binding:3,resource:{buffer:w}},{binding:4,resource:{buffer:t.particleVelocity}}]})),this.bindGroups.set("clearGrid",e.createBindGroup({layout:r.clearGrid,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.gridCellCount}}]})),this.bindGroups.set("buildGrid",e.createBindGroup({layout:r.buildGrid,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.particleWorldPosition}},{binding:2,resource:{buffer:t.gridCellCount}},{binding:3,resource:{buffer:t.gridCellParticles}}]})),this.bindGroups.set("updateForce",e.createBindGroup({layout:r.updateForce,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.particleWorldPosition}},{binding:2,resource:{buffer:t.particleRelativePosition}},{binding:3,resource:{buffer:t.particleVelocity}},{binding:4,resource:{buffer:w}},{binding:5,resource:{buffer:t.gridCellCount}},{binding:6,resource:{buffer:t.gridCellParticles}},{binding:7,resource:{buffer:t.particleForce}}]})),this.bindGroups.set("updateTorque",e.createBindGroup({layout:r.updateTorque,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.particleWorldPosition}},{binding:2,resource:{buffer:t.particleRelativePosition}},{binding:3,resource:{buffer:t.particleVelocity}},{binding:4,resource:{buffer:w}},{binding:5,resource:{buffer:t.gridCellCount}},{binding:6,resource:{buffer:t.gridCellParticles}},{binding:7,resource:{buffer:t.particleTorque}}]})),this.bindGroups.set("reduceForce",e.createBindGroup({layout:r.reduceForce,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.particleLocalPosition}},{binding:2,resource:{buffer:t.particleForce}},{binding:3,resource:{buffer:t.bodyForce}}]})),this.bindGroups.set("reduceTorque",e.createBindGroup({layout:r.reduceTorque,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:t.particleLocalPosition}},{binding:2,resource:{buffer:t.particleRelativePosition}},{binding:3,resource:{buffer:t.particleForce}},{binding:4,resource:{buffer:t.particleTorque}},{binding:5,resource:{buffer:t.bodyTorque}}]})),this.bindGroups.set("updateBodyVelocity",e.createBindGroup({layout:r.updateBodyVelocity,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:g}},{binding:2,resource:{buffer:t.bodyForce}},{binding:3,resource:{buffer:t.bodyMass}},{binding:4,resource:{buffer:p}}]})),this.bindGroups.set("updateBodyAngularVelocity",e.createBindGroup({layout:r.updateBodyAngularVelocity,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:w}},{binding:2,resource:{buffer:t.bodyTorque}},{binding:3,resource:{buffer:t.bodyMass}},{binding:4,resource:{buffer:o}},{binding:5,resource:{buffer:D}}]})),this.bindGroups.set("updateBodyPosition",e.createBindGroup({layout:r.updateBodyPosition,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:i}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:n}}]})),this.bindGroups.set("updateBodyQuaternion",e.createBindGroup({layout:r.updateBodyQuaternion,entries:[{binding:0,resource:{buffer:t.params}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:D}},{binding:3,resource:{buffer:a}}]}))}swapBuffers(){this.bufferIndex=1-this.bufferIndex,this.updateBindGroups()}flushData(){this.bodyDataDirty&&(H(this.device,this.buffers.bodyPositionA,this.bodyPositions),H(this.device,this.buffers.bodyPositionB,this.bodyPositions),H(this.device,this.buffers.bodyQuaternionA,this.bodyQuaternions),H(this.device,this.buffers.bodyQuaternionB,this.bodyQuaternions),this.bodyDataDirty=!1),this.particleDataDirty&&(H(this.device,this.buffers.particleLocalPosition,this.particleLocalPositions),this.particleDataDirty=!1),this.massDirty&&(H(this.device,this.buffers.bodyMass,this.bodyMasses),this.massDirty=!1),this.updateParamsBuffer()}updateParamsBuffer(){const e=new Float32Array(32);e[0]=this.params.stiffness,e[1]=this.params.damping,e[2]=this.params.radius,e[3]=this._particleCount,e[4]=this.params.fixedTimeStep,e[5]=this.params.friction,e[6]=this.params.drag,e[7]=this._bodyCount,e[8]=this.params.gravity[0],e[9]=this.params.gravity[1],e[10]=this.params.gravity[2],e[11]=0,e[12]=this.params.boxSize[0],e[13]=this.params.boxSize[1],e[14]=this.params.boxSize[2],e[15]=0,e[16]=this.grid.position[0],e[17]=this.grid.position[1],e[18]=this.grid.position[2],e[19]=0,e[20]=this.grid.resolution[0],e[21]=this.grid.resolution[1],e[22]=this.grid.resolution[2],e[23]=this.grid.maxParticlesPerCell,e[24]=this.interactionSphere.position.x,e[25]=this.interactionSphere.position.y,e[26]=this.interactionSphere.position.z,e[27]=this.interactionSphere.radius;const t=2*this.params.radius/this.params.fixedTimeStep;e[28]=t,e[29]=t,e[30]=t,e[31]=this.gridStride||0,H(this.device,this.buffers.params,e)}addBody(e,t,r,i,n,o,a,g,p,w,D){if(this._bodyCount>=this.maxBodies)return console.warn(`Cannot add body: maximum (${this.maxBodies}) reached`),-1;const $=this._bodyCount,R=$*4;return this.bodyPositions[R]=e,this.bodyPositions[R+1]=t,this.bodyPositions[R+2]=r,this.bodyPositions[R+3]=1,this.bodyQuaternions[R]=i,this.bodyQuaternions[R+1]=n,this.bodyQuaternions[R+2]=o,this.bodyQuaternions[R+3]=a,this.bodyMasses[R]=p>0?1/p:0,this.bodyMasses[R+1]=w>0?1/w:0,this.bodyMasses[R+2]=D>0?1/D:0,this.bodyMasses[R+3]=g>0?1/g:0,this._bodyCount++,this.bodyDataDirty=!0,this.massDirty=!0,$}addParticle(e,t,r,i){if(this._particleCount>=this.maxParticles)return console.warn(`Cannot add particle: maximum (${this.maxParticles}) reached`),-1;const n=this._particleCount,o=n*4;return this.particleLocalPositions[o]=t,this.particleLocalPositions[o+1]=r,this.particleLocalPositions[o+2]=i,this.particleLocalPositions[o+3]=e,this._particleCount++,this.particleDataDirty=!0,n}step(e){if(!this.initialized){console.warn("World not initialized. Call await world.ready() first.");return}this.accumulator+=e;let t=0;for(;this.accumulator>=this.params.fixedTimeStep&&t<this.maxSubSteps;)this.singleStep(),this.accumulator-=this.params.fixedTimeStep,t++;this._interpolationValue=this.accumulator/this.params.fixedTimeStep,this.time+=e}singleStep(){this.flushData();const e=this.device.createCommandEncoder({label:"physics-step"});e.clearBuffer(this.buffers.bodyForce),e.clearBuffer(this.buffers.bodyTorque),e.clearBuffer(this.buffers.gridCellParticles);const t=ve(this._particleCount,se),r=ve(this._bodyCount,se);{const i=e.beginComputePass({label:"local-to-world"});i.setPipeline(this.pipelines.localToWorld),i.setBindGroup(0,this.bindGroups.get("localToWorld")),i.dispatchWorkgroups(t),i.end()}{const i=e.beginComputePass({label:"local-to-relative"});i.setPipeline(this.pipelines.localToRelative),i.setBindGroup(0,this.bindGroups.get("localToRelative")),i.dispatchWorkgroups(t),i.end()}{const i=e.beginComputePass({label:"body-vel-to-particle-vel"});i.setPipeline(this.pipelines.bodyVelToParticleVel),i.setBindGroup(0,this.bindGroups.get("bodyVelToParticleVel")),i.dispatchWorkgroups(t),i.end()}{const i=e.beginComputePass({label:"clear-grid"});i.setPipeline(this.pipelines.clearGrid),i.setBindGroup(0,this.bindGroups.get("clearGrid")),i.dispatchWorkgroups(this.gridDispatch.x,this.gridDispatch.y,this.gridDispatch.z),i.end()}{const i=e.beginComputePass({label:"build-grid"});i.setPipeline(this.pipelines.buildGrid),i.setBindGroup(0,this.bindGroups.get("buildGrid")),i.dispatchWorkgroups(t),i.end()}{const i=e.beginComputePass({label:"update-force"});i.setPipeline(this.pipelines.updateForce),i.setBindGroup(0,this.bindGroups.get("updateForce")),i.dispatchWorkgroups(t),i.end()}{const i=e.beginComputePass({label:"update-torque"});i.setPipeline(this.pipelines.updateTorque),i.setBindGroup(0,this.bindGroups.get("updateTorque")),i.dispatchWorkgroups(t),i.end()}{const i=e.beginComputePass({label:"reduce-force"});i.setPipeline(this.pipelines.reduceForce),i.setBindGroup(0,this.bindGroups.get("reduceForce")),i.dispatchWorkgroups(t),i.end()}{const i=e.beginComputePass({label:"reduce-torque"});i.setPipeline(this.pipelines.reduceTorque),i.setBindGroup(0,this.bindGroups.get("reduceTorque")),i.dispatchWorkgroups(t),i.end()}{const i=e.beginComputePass({label:"update-body-velocity"});i.setPipeline(this.pipelines.updateBodyVelocity),i.setBindGroup(0,this.bindGroups.get("updateBodyVelocity")),i.dispatchWorkgroups(r),i.end()}{const i=e.beginComputePass({label:"update-body-angular-velocity"});i.setPipeline(this.pipelines.updateBodyAngularVelocity),i.setBindGroup(0,this.bindGroups.get("updateBodyAngularVelocity")),i.dispatchWorkgroups(r),i.end()}{const i=e.beginComputePass({label:"update-body-position"});i.setPipeline(this.pipelines.updateBodyPosition),i.setBindGroup(0,this.bindGroups.get("updateBodyPosition")),i.dispatchWorkgroups(r),i.end()}{const i=e.beginComputePass({label:"update-body-quaternion"});i.setPipeline(this.pipelines.updateBodyQuaternion),i.setBindGroup(0,this.bindGroups.get("updateBodyQuaternion")),i.dispatchWorkgroups(r),i.end()}this.device.queue.submit([e.finish()]),this.swapBuffers(),this.fixedTime+=this.params.fixedTimeStep}get bodyCount(){return this._bodyCount}get particleCount(){return this._particleCount}getParticleWorldPositionBuffer(){return this.buffers.particleWorldPosition}getParticlePositionBuffer(){return this.getParticleWorldPositionBuffer()}getParamsBuffer(){return this.buffers.params}get interpolationValue(){return this._interpolationValue}get stiffness(){return this.params.stiffness}set stiffness(e){this.params.stiffness=e}get damping(){return this.params.damping}set damping(e){this.params.damping=e}get friction(){return this.params.friction}set friction(e){this.params.friction=e}get drag(){return this.params.drag}set drag(e){this.params.drag=e}get radius(){return this.params.radius}set radius(e){this.params.radius=e}get fixedTimeStep(){return this.params.fixedTimeStep}set fixedTimeStep(e){this.params.fixedTimeStep=e}get gravity(){return new C(this.params.gravity[0],this.params.gravity[1],this.params.gravity[2])}set gravity(e){this.params.gravity[0]=e.x,this.params.gravity[1]=e.y,this.params.gravity[2]=e.z}setSpherePosition(e,t,r,i){if(e!==0)throw new Error("Multiple spheres not supported yet");this.interactionSphere.position.set(t,r,i)}getSpherePosition(e,t){if(e!==0)throw new Error("Multiple spheres not supported yet");return t=t||new C,t.copy(this.interactionSphere.position),t}setSphereRadius(e,t){if(e!==0)throw new Error("Multiple spheres not supported yet");this.interactionSphere.radius=t}getSphereRadius(e){if(e!==0)throw new Error("Multiple spheres not supported yet");return this.interactionSphere.radius}async readBodyPositions(){const e=this._bodyCount*4*4,t=this.bufferIndex===0?this.buffers.bodyPositionA:this.buffers.bodyPositionB,r=await xe(this.device,t,this.buffers.stagingPosition,e);return new Float32Array(r)}async readBodyQuaternions(){const e=this._bodyCount*4*4,t=this.bufferIndex===0?this.buffers.bodyQuaternionA:this.buffers.bodyQuaternionB,r=await xe(this.device,t,this.buffers.stagingQuaternion,e);return new Float32Array(r)}getDevice(){return this.device}getBodyPositionBuffer(){return this.bufferIndex===0?this.buffers.bodyPositionA:this.buffers.bodyPositionB}getBodyQuaternionBuffer(){return this.bufferIndex===0?this.buffers.bodyQuaternionA:this.buffers.bodyQuaternionB}destroy(){this.initialized&&(Object.values(this.buffers).forEach(e=>{e&&typeof e.destroy=="function"&&e.destroy()}),this.bindGroups.clear(),this.initialized=!1)}}class ne{constructor(e,t,r){this.device=e,this.format=r||navigator.gpu.getPreferredCanvasFormat(),this.vertexBuffer=e.createBuffer({size:t.vertices.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.vertexBuffer,0,t.vertices),this.indexBuffer=e.createBuffer({size:t.indices.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.indexBuffer,0,t.indices),this.indexCount=t.indices.length,this.uniformBuffer=e.createBuffer({size:80,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const n=e.createShaderModule({code:`
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
    `}),o=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]});this.pipeline=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[o]}),vertex:{module:n,entryPoint:"vs_main",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"}]}]},fragment:{module:n,entryPoint:"fs_main",targets:[{format:this.format}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"}}),this.bindGroup=null}updateBindGroup(e,t){this.bindGroup=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:e}},{binding:2,resource:{buffer:t}}]})}record(e,t,r=0,{viewProj:i,scale:n=[1,1,1]}={}){this.bindGroup&&(e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.setVertexBuffer(0,this.vertexBuffer),e.setIndexBuffer(this.indexBuffer,"uint16"),e.drawIndexed(this.indexCount,t,0,0,r))}updateUniforms(e,t=[1,1,1]){const r=new Float32Array(20);r.set(e,0),r.set(t,16),this.device.queue.writeBuffer(this.uniformBuffer,0,r)}}class rt{constructor(e,t,r={}){this.device=e,this.format=t||navigator.gpu.getPreferredCanvasFormat();const i=r.size||40,n=r.height||0,o=new Float32Array([-i,n,-i,i,n,-i,i,n,i,-i,n,i]),a=new Uint16Array([0,2,1,0,3,2]);this.vertexBuffer=e.createBuffer({size:o.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.vertexBuffer,0,o),this.indexBuffer=e.createBuffer({size:a.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.indexBuffer,0,a),this.indexCount=a.length,this.uniformBuffer=e.createBuffer({size:80,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const p=e.createShaderModule({code:`
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
    `}),w=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]});this.pipeline=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[w]}),vertex:{module:p,entryPoint:"vs_main",buffers:[{arrayStride:12,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]}]},fragment:{module:p,entryPoint:"fs_main",targets:[{format:this.format}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{format:"depth24plus",depthWriteEnabled:!1,depthCompare:"less-equal"}}),this.bindGroup=e.createBindGroup({layout:w,entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]})}update(e,{gridSize:t=1,lineWidth:r=.04,height:i=0}={}){const n=new Float32Array(20);n.set(e,0),n[16]=i,n[17]=t,n[18]=r,n[19]=0,this.device.queue.writeBuffer(this.uniformBuffer,0,n)}record(e){e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.setVertexBuffer(0,this.vertexBuffer),e.setIndexBuffer(this.indexBuffer,"uint16"),e.drawIndexed(this.indexCount,1)}}async function it(){const s=document.getElementById("canvas");document.getElementById("error");const e=document.getElementById("particleCount"),t=document.getElementById("fps");s.style.width="100%",s.style.height="100%",s.style.display="block";const r={radius:.1,stiffness:1200,damping:5,friction:1.5,drag:.25,gravityY:-10,sphereRadius:6,oscillate:!0,ampX:5,ampY:5,ampZ:5,showParticles:!1,paused:!1,objectCount:1024,resolution:1,spawnShape:"Mix",boxX:12,boxY:100,boxZ:12};let i=null,n=null,o=null,a=null,g=null,p=null,w={},D=null,$=null,R={};function ge(){return["I","J","L","O","S","T","Z"]}async function ee(){i&&i.destroy();const Q=.6/r.resolution*.5,l=Q*2,b=Math.ceil(r.boxX*2/l)+8,O=Math.ceil(r.boxY*2/l)+8,E=Math.ceil(r.boxZ*2/l)+8,T=new tt({maxBodies:1e5,maxParticles:1e6,radius:Q,stiffness:r.stiffness,damping:r.damping,friction:r.friction,drag:r.drag,fixedTimeStep:1/120,gravity:new C(0,r.gravityY,0),boxSize:new C(r.boxX,r.boxY,r.boxZ),gridPosition:new C(-r.boxX,0,-r.boxZ),gridResolution:new C(b,O,E),maxSubSteps:8});await T.ready();const z=T.getDevice(),Z=navigator.gpu.getPreferredCanvasFormat();s.getContext("webgpu").configure({device:z,format:Z,alphaMode:"premultiplied"});const X=new _e(z),N=new rt(z,Z,{size:40,height:0}),J=z.createTexture({size:[s.width,s.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),_={};_.Box=new ne(z,Me()),_.Cylinder=new ne(z,We()),_.Sphere=new ne(z,Pe(1,16,12));for(let I of ge())_[`Tetris_${I}`]=new ne(z,Oe(I));const B=new ne(z,Pe(1,32,24)),c=z.createBuffer({size:16,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),h=z.createBuffer({size:16,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});z.queue.writeBuffer(h,0,new Float32Array([0,0,0,1])),B.updateBindGroup(c,h),g||(g=new Fe(s,{radius:20,target:[0,.5,0]}));const m={};ze(T,m),T.setSphereRadius(0,r.sphereRadius),T.setSpherePosition(0,0,1,0),T.step(T.fixedTimeStep||1/60),p&&p.destroy(),D&&D.destroy(),$&&$.destroy(),i=T,n=X,o=N,w=_,a=B,D=c,$=h,R=m,p=J}function ze(d,Q){const l=r.resolution,b=d.radius,O=1;function E(c,h,m){Q[c]||(Q[c]=[]),Q[c].push([h,m])}function T(c,h,m){const I=d.bodyCount,S=[],v=(l-1)*b;for(let G=0;G<l;G++)for(let q=0;q<l;q++)for(let x=0;x<l;x++){const U=G*2*b-v,L=q*2*b-v,j=x*2*b-v;S.push([U,L,j])}const f=fe(S.length*O,S),y=S.length*O,A=new C(Math.random(),Math.random(),Math.random()).normalize(),F=Math.random()*Math.PI*2,M=Math.sin(F/2),Y=Math.cos(F/2),K=d.addBody(c,h,m,A.x*M,A.y*M,A.z*M,Y,y,f.x,f.y,f.z);for(let G=0;G<l;G++)for(let q=0;q<l;q++)for(let x=0;x<l;x++)if(G===0||G===l-1||q===0||q===l-1||x===0||x===l-1){const U=G*2*b-v,L=q*2*b-v,j=x*2*b-v;d.addParticle(K,U,L,j)}E("Box",I,1)}function z(c,h,m){const I=d.bodyCount,S=O,v=De(S,b),f=new C(Math.random(),Math.random(),Math.random()).normalize(),y=Math.random()*Math.PI*2,A=Math.sin(y/2),F=Math.cos(y/2),M=d.addBody(c,h,m,f.x*A,f.y*A,f.z*A,F,S,v.x,v.y,v.z);d.addParticle(M,0,0,0),E("Sphere",I,1)}function Z(c,h,m){const I=d.bodyCount,v=l*2*b/2,f=[],y=(l-1)*b;for(let x=0;x<l;x++)for(let U=0;U<l;U++)for(let L=0;L<l;L++){const j=x*2*b-y,V=U*2*b-y,ie=L*2*b-y;j*j+ie*ie<=v*v*1.2&&f.push([j,V,ie])}if(f.length===0)return;const A=f.length*O,F=fe(A,f),M=new C(Math.random(),Math.random(),Math.random()).normalize(),Y=Math.random()*Math.PI*2,K=Math.sin(Y/2),G=Math.cos(Y/2),q=d.addBody(c,h,m,M.x*K,M.y*K,M.z*K,G,A,F.x,F.y,F.z);for(let x of f)d.addParticle(q,x[0],x[1],x[2]);E("Cylinder",I,1)}function re(c,h,m,I){const S=d.bodyCount,v=Ue(I),f=l*2*b,y=[],A=(l-1)*b;for(let V of v){const ie=V[0]*f,Be=V[1]*f,Ie=V[2]*f;for(let ue=0;ue<l;ue++)for(let ce=0;ce<l;ce++)for(let pe=0;pe<l;pe++){const Ce=ue*2*b-A,Se=ce*2*b-A,Ve=pe*2*b-A;y.push([ie+Ce,Be+Se,Ie+Ve])}}let F=0,M=0,Y=0;for(let V of y)F+=V[0],M+=V[1],Y+=V[2];F/=y.length,M/=y.length,Y/=y.length;for(let V of y)V[0]-=F,V[1]-=M,V[2]-=Y;const K=y.length*O,G=fe(K,y),q=new C(Math.random(),Math.random(),Math.random()).normalize(),x=Math.random()*Math.PI*2,U=Math.sin(x/2),L=Math.cos(x/2),j=d.addBody(c,h,m,q.x*U,q.y*U,q.z*U,L,K,G.x,G.y,G.z);for(let V of y)d.addParticle(j,V[0],V[1],V[2]);E(`Tetris_${I}`,S,1)}const X=ge(),N=r.objectCount,J=r.spawnShape,_=l*2*b*1,B=12;for(let c=0;c<N;c++){const h=Math.random()*Math.PI*2,m=Math.random()*(B/2),I=Math.cos(h)*m,S=Math.sin(h)*m,v=2+c*(_*.25);let f=J;if(f==="Mix"){const y=Math.random();y<.25?f="Box":y<.5?f="Cylinder":y<.75?f="Sphere":f="Tetris"}if(f==="Box")T(I,v,S);else if(f==="Cylinder")Z(I,v,S);else if(f==="Sphere")z(I,v,S);else if(f==="Tetris"){const y=X[Math.floor(Math.random()*X.length)];re(I,v,S,y)}}e.textContent=d.particleCount.toString()}await ee();const k=new window.lil.GUI({title:"Shapes Demo"});k.add(r,"objectCount",1,5e4,1024).name("Object Count").onFinishChange(ee),k.add(r,"resolution",1,4,1).name("Particles/Side").onFinishChange(ee),k.add(r,"spawnShape",["Box","Cylinder","Sphere","Tetris","Mix"]).name("Shape").onFinishChange(ee);const te=k.addFolder("Physics");te.add(i,"stiffness",0,5e3,10),te.add(i,"damping",0,20,.1),te.add(i,"friction",0,10,.1),te.add(i,"fixedTimeStep",.001,.1,.001).name("Time Step"),te.add(r,"gravityY",-20,20,.1).name("Gravity Y").onChange(d=>i.gravity=new C(0,d,0));const de=k.addFolder("Container");de.add(r,"boxX",2,100,1).name("Width (X)").onChange(d=>{i&&(i.params.boxSize[0]=d)}),de.add(r,"boxY",2,100,1).name("Height (Y)").onChange(d=>{i&&(i.params.boxSize[1]=d)}),de.add(r,"boxZ",2,100,1).name("Depth (Z)").onChange(d=>{i&&(i.params.boxSize[2]=d)}),k.add(r,"sphereRadius",.1,10,.05).onChange(d=>i.setSphereRadius(0,d));const oe=k.addFolder("Oscillation");oe.add(r,"oscillate"),oe.add(r,"ampX",0,60).name("Amplitude X"),oe.add(r,"ampY",0,60).name("Amplitude Y"),oe.add(r,"ampZ",0,60).name("Amplitude Z"),k.add(r,"showParticles").name("Render Particles"),k.add(r,"paused"),k.add({reset:ee},"reset").name("Reset World");function ye(){s.width=window.innerWidth,s.height=window.innerHeight,i&&i.initialized&&(p&&p.destroy(),p=i.getDevice().createTexture({size:[s.width,s.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}))}window.addEventListener("resize",ye),ye();let be=performance.now(),le=0,ae=0;function he(){requestAnimationFrame(he);const d=performance.now(),Q=(d-be)*.001;if(be=d,le++,ae+=Q,ae>=1&&(t.textContent=Math.round(le/ae).toString(),le=0,ae=0),!i||!i.initialized)return;if(r.oscillate){const B=d*.001,c=Math.sin(B*2)*r.ampX,h=Math.cos(B*1.4)*r.ampZ,m=.8+Math.sin(B*3.6)*r.ampY;i.setSpherePosition(0,c,m,h)}r.paused||i.step(Q);const l=i.getDevice(),b=s.getContext("webgpu"),O=g.getViewProj(s.width/s.height),E=r.resolution*i.radius,T=r.resolution*i.radius,z=i.radius,Z=r.resolution*2*i.radius;n.updateBindGroup(i.getParticleWorldPositionBuffer()),n.updateViewProj(O,i.radius),o.update(O,{gridSize:.5,lineWidth:.04,height:0});const re=new Float32Array(4),X=i.getSpherePosition(0);re.set([X.x,X.y,X.z,1]),l.queue.writeBuffer(D,0,re);const N=i.getSphereRadius(0);a.updateUniforms(O,[N,N,N]);for(let B in w){w[B].updateBindGroup(i.getBodyPositionBuffer(),i.getBodyQuaternionBuffer());let c=[1,1,1];B==="Box"?c=[E,E,E]:B==="Cylinder"?c=[T,T,T]:B==="Sphere"?c=[z,z,z]:B.startsWith("Tetris")&&(c=[Z,Z,Z]),w[B].updateUniforms(O,c)}const J=l.createCommandEncoder(),_=J.beginRenderPass({colorAttachments:[{view:b.getCurrentTexture().createView(),clearValue:{r:.14,g:.16,b:.2,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:p.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});if(r.showParticles)n.record(_,i.particleCount);else for(let B in R){const c=R[B],h=w[B];if(h)for(let m of c){const I=m[0],S=m[1];h.record(_,S,I)}}a.record(_,1),o.record(_),_.end(),l.queue.submit([J.finish()])}he()}it().catch(s=>{const e=document.getElementById("error");e.textContent=`Error: ${s.message||s}`,console.error(s)});
