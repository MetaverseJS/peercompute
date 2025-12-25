// Transform local particle positions to world space

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
