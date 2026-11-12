// Layer normalization for ViT backbone.
// Each workgroup normalizes one row (token).
// Thread 0 computes mean/variance serially, then all threads normalize in parallel.
// Adapted from webgpu-samples visionTransformer with 2D dispatch support.

struct Params {
  N: u32,       // number of rows (tokens)
  D: u32,       // dimension per row
  eps: f32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> gamma: array<f32>;
@group(0) @binding(3) var<storage, read> beta: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

var<workgroup> shared_mean: f32;
var<workgroup> shared_inv_std: f32;

@compute @workgroup_size(256)
fn main(
  @builtin(workgroup_id) wg_id: vec3u,
  @builtin(local_invocation_id) local_id: vec3u,
) {
  let row = wg_id.x;
  let tid = local_id.x;
  let D = params.D;
  let base = row * D;

  if (row >= params.N) { return; }

  // Thread 0 computes mean and variance (two-pass for numerical stability).
  // The one-pass formula E[x²]-E[x]² suffers catastrophic cancellation when
  // values are large (±20 common in ViT), losing significant precision.
  if (tid == 0u) {
    var sum = 0.0;
    for (var i = 0u; i < D; i++) {
      sum += input[base + i];
    }
    let mean = sum / f32(D);
    var var_sum = 0.0;
    for (var i = 0u; i < D; i++) {
      let diff = input[base + i] - mean;
      var_sum += diff * diff;
    }
    let variance = var_sum / f32(D);
    shared_mean = mean;
    shared_inv_std = 1.0 / sqrt(variance + params.eps);
  }
  workgroupBarrier();

  let mean = shared_mean;
  let inv_std = shared_inv_std;

  // All threads normalize and apply affine transform in parallel
  for (var i = tid; i < D; i += 256u) {
    let val = input[base + i];
    output[base + i] = (val - mean) * inv_std * gamma[i] + beta[i];
  }
}
