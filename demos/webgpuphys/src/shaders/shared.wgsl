// Shared WGSL utilities for WebGPU Physics

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
