// Derive particle velocities from body velocities

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
