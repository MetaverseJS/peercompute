// Reduce particle forces to body forces using atomics

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
