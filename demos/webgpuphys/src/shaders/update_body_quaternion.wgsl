// Update body quaternion

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
