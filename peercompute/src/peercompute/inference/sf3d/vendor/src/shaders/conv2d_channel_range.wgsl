// conv2d_channel_range.wgsl - exact output-channel range convolution

struct ConvRangeParams {
  inC: u32,
  inH: u32,
  inW: u32,
  outC: u32,
  outH: u32,
  outW: u32,
  kH: u32,
  kW: u32,
  padH: u32,
  padW: u32,
  strideH: u32,
  strideW: u32,
  hasBias: u32,
  channelStart: u32,
  channelCount: u32,
  applyRelu: u32,
};

@group(0) @binding(0) var<uniform> params: ConvRangeParams;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read> bias: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

const TILE_W: u32 = 16;
const TILE_H: u32 = 16;

@compute @workgroup_size(TILE_W, TILE_H, 1)
fn conv2d_channel_range_main(
  @builtin(global_invocation_id) gid: vec3<u32>,
  @builtin(workgroup_id) wgid: vec3<u32>,
) {
  let outX = gid.x;
  let outY = gid.y;
  let localOutCh = wgid.z;
  let outCh = params.channelStart + localOutCh;

  if (
    outX >= params.outW
    || outY >= params.outH
    || localOutCh >= params.channelCount
    || outCh >= params.outC
  ) {
    return;
  }

  var sum: f32 = 0.0;
  for (var ic: u32 = 0; ic < params.inC; ic++) {
    for (var ky: u32 = 0; ky < params.kH; ky++) {
      for (var kx: u32 = 0; kx < params.kW; kx++) {
        let inYRaw = i32(outY * params.strideH + ky) - i32(params.padH);
        let inXRaw = i32(outX * params.strideW + kx) - i32(params.padW);
        let inY = u32(clamp(inYRaw, 0, i32(params.inH) - 1));
        let inX = u32(clamp(inXRaw, 0, i32(params.inW) - 1));
        let inputIndex = ic * params.inH * params.inW + inY * params.inW + inX;
        let weightIndex = outCh * params.inC * params.kH * params.kW
          + ic * params.kH * params.kW
          + ky * params.kW
          + kx;
        sum += input[inputIndex] * weight[weightIndex];
      }
    }
  }

  if (params.hasBias != 0) {
    sum += bias[outCh];
  }
  if (params.applyRelu != 0) {
    sum = max(sum, 0.0);
  }

  let outputIndex = outCh * params.outH * params.outW + outY * params.outW + outX;
  output[outputIndex] = sum;
}
