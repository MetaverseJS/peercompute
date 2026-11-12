// Row-range linear projection: output[row] = input[row] @ weight + bias.
// The accumulation order and weight layout match linear.wgsl exactly.

struct Params {
  totalRows: u32,
  inDim: u32,
  outDim: u32,
  rowStart: u32,
  rowCount: u32,
  numWorkgroupsX: u32,
  transposed: u32,
  _padding: u32,
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
  let localIdx = linearWG * WG_SIZE + lid.x;
  if (localIdx >= params.rowCount * params.outDim) { return; }

  let localRow = localIdx / params.outDim;
  let col = localIdx % params.outDim;
  let row = params.rowStart + localRow;
  if (row >= params.totalRows) { return; }
  let idx = row * params.outDim + col;

  var s0 = 0.0;
  var s1 = 0.0;
  var s2 = 0.0;
  var s3 = 0.0;
  let inBase = row * params.inDim;
  let len4 = (params.inDim / 4u) * 4u;

  if (params.transposed == 1u) {
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
