// Reduce particle torques to body torques using atomics

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
