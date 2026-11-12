// Linear projection + GELU activation: output = GELU(input @ weight + bias)
// Used for MLP fc1 in DINOv2 ViT blocks.
// NaN guard: Apple Metal may produce NaN from finite accumulations; sanitized via bitcast.

struct Params {
  numRows: u32,
  inDim: u32,
  outDim: u32,
  numWorkgroupsX: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read> bias: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

const WG_SIZE: u32 = 256;

fn gelu(x: f32) -> f32 {
  // GELU via erf approximation (Abramowitz & Stegun 7.1.26, max error ~1.5e-7).
  // Avoids tanh() which has precision issues on Apple Metal fast-math.
  if (x > 10.0) { return x; }
  if (x < -10.0) { return 0.0; }
  let a = x * 0.7071067811865476; // x / sqrt(2)
  let s = sign(a);
  let t_abs = abs(a);
  let p = 0.3275911;
  let t = 1.0 / (1.0 + p * t_abs);
  let t2 = t * t;
  let t3 = t2 * t;
  let t4 = t3 * t;
  let t5 = t4 * t;
  let erf_abs = 1.0 - (0.254829592 * t - 0.284496736 * t2 + 1.421413741 * t3 - 1.453152027 * t4 + 1.061405429 * t5) * exp(-t_abs * t_abs);
  let erf_val = s * erf_abs;
  return 0.5 * x * (1.0 + erf_val);
}

@compute @workgroup_size(WG_SIZE)
fn main(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  if (idx >= params.numRows * params.outDim) { return; }

  let row = idx / params.outDim;
  let col = idx % params.outDim;

  // Split accumulation (see linear.wgsl for rationale).
  var s0 = 0.0;
  var s1 = 0.0;
  var s2 = 0.0;
  var s3 = 0.0;
  let inBase = row * params.inDim;
  let wBase = col;
  let stride = params.outDim;
  let len4 = (params.inDim / 4u) * 4u;
  for (var k = 0u; k < len4; k += 4u) {
    s0 += input[inBase + k]      * weight[(k)      * stride + wBase];
    s1 += input[inBase + k + 1u] * weight[(k + 1u) * stride + wBase];
    s2 += input[inBase + k + 2u] * weight[(k + 2u) * stride + wBase];
    s3 += input[inBase + k + 3u] * weight[(k + 3u) * stride + wBase];
  }
  for (var k = len4; k < params.inDim; k++) {
    s0 += input[inBase + k] * weight[k * stride + wBase];
  }
  output[idx] = gelu((s0 + s1) + (s2 + s3) + bias[col]);
}
