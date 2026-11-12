// LayerScale: element-wise multiply by learned gamma, then add residual.
// DINOv2 applies this after attention and after FFN:
//   x = x + gamma * sublayer(norm(x))
//
// This shader does: output[i] = residual[i] + gamma[i % D] * input[i]

struct Params {
  count: u32,   // total elements (N * D)
  D: u32,       // model dim (for gamma indexing)
  numWorkgroupsX: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;      // sublayer output
@group(0) @binding(2) var<storage, read> gamma: array<f32>;       // [D] learned scale
@group(0) @binding(3) var<storage, read> residual: array<f32>;    // pre-sublayer x
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

const WG_SIZE: u32 = 256;

@compute @workgroup_size(WG_SIZE)
fn main(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  if (idx >= params.count) { return; }

  let d = idx % params.D;
  output[idx] = residual[idx] + gamma[d] * input[idx];
}
