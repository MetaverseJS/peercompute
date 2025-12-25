// Calculate particle collision torques (similar to force but for rotation)

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
