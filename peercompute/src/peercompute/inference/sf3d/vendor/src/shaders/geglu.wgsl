/**
 * GEGLU activation shader.
 *
 * GEGLU(x, W) = chunk(x @ W, 2)[0] * GELU(chunk(x @ W, 2)[1])
 *
 * Input: result of linear projection [N, 2*innerDim]
 * Output: [N, innerDim]
 *
 * The projection produces two halves: hidden_states and gate.
 * Output = hidden_states * GELU(gate)
 */

struct Params {
  N: u32,         // sequence length
  innerDim: u32,  // output dimension (half of input)
  numWorkgroupsX: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;  // [N, 2*innerDim]
@group(0) @binding(2) var<storage, read_write> output: array<f32>; // [N, innerDim]

const WG_SIZE: u32 = 256;

fn gelu(x: f32) -> f32 {
  // Exact GELU via erf approximation (Abramowitz & Stegun 7.1.26)
  if (x > 10.0) { return x; }
  if (x < -10.0) { return 0.0; }
  let a = x * 0.7071067811865476; // x / sqrt(2)
  let abs_a = abs(a);
  let t = 1.0 / (1.0 + 0.3275911 * abs_a);
  let poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  var erf_val = 1.0 - poly * exp(-abs_a * abs_a);
  if (a < 0.0) { erf_val = -erf_val; }
  return 0.5 * x * (1.0 + erf_val);
}

@compute @workgroup_size(WG_SIZE)
fn geglu_main(@builtin(global_invocation_id) gid: vec3<u32>,
              @builtin(workgroup_id) wgid: vec3<u32>,
              @builtin(local_invocation_id) lid: vec3<u32>) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  let total = params.N * params.innerDim;
  if (idx >= total) { return; }

  let row = idx / params.innerDim;
  let col = idx % params.innerDim;

  let doubleInnerDim = params.innerDim * 2u;
  // First half: hidden_states
  let hidden = input[row * doubleInnerDim + col];
  // Second half: gate
  let gate = input[row * doubleInnerDim + params.innerDim + col];

  output[idx] = hidden * gelu(gate);
}
