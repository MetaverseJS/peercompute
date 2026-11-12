// Linear projection: output = input @ weight + bias
// Adapted from webgpu-samples visionTransformer mlp.wgsl with 2D dispatch.
//
// Weight layout controlled by params.transposed:
//   transposed=1 (default): weight is [inDim, outDim], access weight[k * outDim + col]
//   transposed=0: weight is [outDim, inDim] (PyTorch native), access weight[col * inDim + k]

struct Params {
  numRows: u32,
  inDim: u32,
  outDim: u32,
  numWorkgroupsX: u32,
  transposed: u32,  // 1=transposed [inDim, outDim], 0=native [outDim, inDim]
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read> bias: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

const WG_SIZE: u32 = 256;

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

  // 4-way split accumulation for better fp32 precision on large dot products.
  var s0 = 0.0;
  var s1 = 0.0;
  var s2 = 0.0;
  var s3 = 0.0;
  let inBase = row * params.inDim;
  let len4 = (params.inDim / 4u) * 4u;

  if (params.transposed == 1u) {
    // Transposed layout: weight[k, col] = weight[k * outDim + col]
    let wBase = col;
    let stride = params.outDim;
    for (var k = 0u; k < len4; k += 4u) {
      s0 += input[inBase + k]      * weight[(k)      * stride + wBase];
      s1 += input[inBase + k + 1u] * weight[(k + 1u) * stride + wBase];
      s2 += input[inBase + k + 2u] * weight[(k + 2u) * stride + wBase];
      s3 += input[inBase + k + 3u] * weight[(k + 3u) * stride + wBase];
    }
    for (var k = len4; k < params.inDim; k++) {
      s0 += input[inBase + k] * weight[k * stride + wBase];
    }
  } else {
    // Native layout: weight[col, k] = weight[col * inDim + k]
    let wBase = col * params.inDim;
    for (var k = 0u; k < len4; k += 4u) {
      s0 += input[inBase + k]      * weight[wBase + k];
      s1 += input[inBase + k + 1u] * weight[wBase + k + 1u];
      s2 += input[inBase + k + 2u] * weight[wBase + k + 2u];
      s3 += input[inBase + k + 3u] * weight[wBase + k + 3u];
    }
    for (var k = len4; k < params.inDim; k++) {
      s0 += input[inBase + k] * weight[wBase + k];
    }
  }
  output[idx] = (s0 + s1) + (s2 + s3) + bias[col];
}
