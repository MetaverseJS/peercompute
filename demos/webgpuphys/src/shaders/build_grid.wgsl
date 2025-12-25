// Build spatial hash grid from particle positions

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
