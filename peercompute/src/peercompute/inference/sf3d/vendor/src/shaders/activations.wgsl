// activations.wgsl — Element-wise activation functions
//
// ReLU, SiLU, and element-wise add (for skip connections).
// Each function operates in-place or writes to a separate output buffer.

struct ActivationParams {
  count: u32,     // total number of elements
  op: u32,        // 0=relu, 1=silu, 2=add, 3=add_relu, 4=sigmoid
  numWorkgroupsX: u32,
};

@group(0) @binding(0) var<uniform> params: ActivationParams;
@group(0) @binding(1) var<storage, read> input_a: array<f32>;
@group(0) @binding(2) var<storage, read> input_b: array<f32>;  // used for add ops
@group(0) @binding(3) var<storage, read_write> output: array<f32>;

const WG_SIZE: u32 = 256;

@compute @workgroup_size(WG_SIZE)
fn activation_main(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;
  if (idx >= params.count) {
    return;
  }

  let a = input_a[idx];

  switch params.op {
    case 0u: { // ReLU
      output[idx] = max(a, 0.0);
    }
    case 1u: { // SiLU (x * sigmoid(x))
      output[idx] = a / (1.0 + exp(-a));
    }
    case 2u: { // Add (skip connection)
      output[idx] = a + input_b[idx];
    }
    case 3u: { // Add + ReLU
      output[idx] = max(a + input_b[idx], 0.0);
    }
    case 4u: { // Sigmoid
      output[idx] = 1.0 / (1.0 + exp(-a));
    }
    default: {
      output[idx] = a;
    }
  }
}
