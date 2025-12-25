// Update body position

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
