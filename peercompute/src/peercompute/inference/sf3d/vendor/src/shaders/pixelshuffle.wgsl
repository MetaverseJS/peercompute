// pixelshuffle.wgsl — PixelShuffle (sub-pixel convolution) compute shader
//
// Rearranges elements from [C*r*r, H, W] to [C, H*r, W*r]
// where r is the upscale factor.
//
// This is the primary upsampling method in MoGe-2's ConvStack resamplers.
// PyTorch: nn.PixelShuffle(scale_factor)
//
// Memory layout (CHW, row-major):
//   input:   [C_in, H, W]          — where C_in = C_out * r * r
//   output:  [C_out, H * r, W * r]

struct PixelShuffleParams {
  inC: u32,      // C_in = C_out * r * r
  inH: u32,
  inW: u32,
  outC: u32,     // C_out
  scaleFactor: u32,  // r
  numWorkgroupsX: u32,
};

@group(0) @binding(0) var<uniform> params: PixelShuffleParams;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read_write> output: array<f32>;

const WG_SIZE: u32 = 256;

@compute @workgroup_size(WG_SIZE)
fn pixelshuffle_main(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let outH = params.inH * params.scaleFactor;
  let outW = params.inW * params.scaleFactor;
  let totalOut = params.outC * outH * outW;
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  if (idx >= totalOut) {
    return;
  }

  // Decompose output index
  let outSpatial = outH * outW;
  let oc = idx / outSpatial;
  let rem = idx % outSpatial;
  let oy = rem / outW;
  let ox = rem % outW;

  // Map to input coordinates
  let r = params.scaleFactor;
  let iy = oy / r;
  let ix = ox / r;
  let subY = oy % r;
  let subX = ox % r;

  // Input channel: oc * r * r + subY * r + subX
  let ic = oc * r * r + subY * r + subX;
  let inputIdx = ic * params.inH * params.inW + iy * params.inW + ix;

  output[idx] = input[inputIdx];
}
