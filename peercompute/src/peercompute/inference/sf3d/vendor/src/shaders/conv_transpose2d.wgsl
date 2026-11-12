// conv_transpose2d.wgsl — Transposed 2D convolution (deconvolution) compute shader
//
// Implements nn.ConvTranspose2d(inC, outC, kernel_size=stride, stride=stride)
// which is the primary upsampling method in MoGe-2's ConvStack.
//
// For stride=kernel_size=2 (the MoGe-2 case), this is equivalent to:
//   - Each input pixel maps to a 2x2 output patch
//   - Output[oy, ox] = sum over inC of weight[ic, oc, oy%s, ox%s] * input[ic, oy/s, ox/s]
//
// Memory layout (CHW, row-major):
//   input:   [C_in, H, W]              — f32
//   weight:  [C_in, C_out, kH, kW]     — f32 (note: transposed conv weight layout)
//   bias:    [C_out]                    — f32
//   output:  [C_out, H*stride, W*stride] — f32

struct ConvTransposeParams {
  inC: u32,
  inH: u32,
  inW: u32,
  outC: u32,
  outH: u32,
  outW: u32,
  kH: u32,
  kW: u32,
  strideH: u32,
  strideW: u32,
  hasBias: u32,
  numWorkgroupsX: u32,
};

@group(0) @binding(0) var<uniform> params: ConvTransposeParams;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read> bias: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

const WG_SIZE: u32 = 256;

@compute @workgroup_size(WG_SIZE)
fn conv_transpose2d_main(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let totalOut = params.outC * params.outH * params.outW;
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  if (idx >= totalOut) {
    return;
  }

  let outSpatial = params.outH * params.outW;
  let oc = idx / outSpatial;
  let rem = idx % outSpatial;
  let oy = rem / params.outW;
  let ox = rem % params.outW;

  var sum: f32 = 0.0;

  // For each input channel, find which input pixel(s) contribute to this output pixel
  // With stride=kernel_size, each output pixel is influenced by exactly one input pixel
  // oy = iy * stride + ky  =>  iy = (oy - ky) / stride, must be integer and in bounds
  for (var ic: u32 = 0; ic < params.inC; ic++) {
    for (var ky: u32 = 0; ky < params.kH; ky++) {
      if (oy < ky) { continue; }
      let iy_check = oy - ky;
      if (iy_check % params.strideH != 0) { continue; }
      let iy = iy_check / params.strideH;
      if (iy >= params.inH) { continue; }

      for (var kx: u32 = 0; kx < params.kW; kx++) {
        if (ox < kx) { continue; }
        let ix_check = ox - kx;
        if (ix_check % params.strideW != 0) { continue; }
        let ix = ix_check / params.strideW;
        if (ix >= params.inW) { continue; }

        let inputIdx = ic * params.inH * params.inW + iy * params.inW + ix;
        // Weight layout for ConvTranspose2d: [C_in, C_out, kH, kW]
        let weightIdx = ic * params.outC * params.kH * params.kW
                      + oc * params.kH * params.kW
                      + ky * params.kW
                      + kx;
        sum += input[inputIdx] * weight[weightIdx];
      }
    }
  }

  if (params.hasBias != 0) {
    sum += bias[oc];
  }

  output[idx] = sum;
}
