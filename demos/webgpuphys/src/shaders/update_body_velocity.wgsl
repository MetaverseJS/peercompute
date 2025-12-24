// Update body linear velocity

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
