import{a as S,b as A,d as O}from"./gpu-CbAOvyLy.js";var Z=`// activations.wgsl — Element-wise activation functions
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
`,N=`// groupnorm.wgsl — Group Normalization compute shader
//
// Implements nn.GroupNorm: divide channels into groups, normalize each group
// independently over (C/num_groups, H, W), then apply learnable scale+bias.
//
// Special case: num_groups=1 → LayerNorm over spatial+channel
// Special case: num_groups=C → InstanceNorm
//
// MoGe-2 uses:
//   - GroupNorm(C//32, C) → 32 channels per group
//   - GroupNorm(1, C) → "layer norm" mode (all channels in one group)
//
// Two-pass approach:
//   Pass 1: compute mean and variance per group
//   Pass 2: normalize and apply scale+bias
//
// Memory layout (CHW, row-major):
//   input:   [C, H, W]      — f32
//   scale:   [C]             — f32 (learnable gamma)
//   bias:    [C]             — f32 (learnable beta)
//   output:  [C, H, W]      — f32

struct GroupNormParams {
  C: u32,
  H: u32,
  W: u32,
  numGroups: u32,
  eps: f32,
  numWorkgroupsX: u32,
};

@group(0) @binding(0) var<uniform> params: GroupNormParams;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> scale: array<f32>;
@group(0) @binding(3) var<storage, read> gnbias: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

// Intermediate buffer for per-group mean and variance
// Layout: [numGroups * 2] — first numGroups entries are means, next are vars
@group(0) @binding(5) var<storage, read_write> stats: array<f32>;

const WG_SIZE: u32 = 256;

// Pass 1: Compute mean and variance for each group
@compute @workgroup_size(WG_SIZE)
fn groupnorm_stats(
  @builtin(global_invocation_id) gid: vec3<u32>,
) {
  let groupIdx = gid.x;
  if (groupIdx >= params.numGroups) {
    return;
  }

  let channelsPerGroup = params.C / params.numGroups;
  let spatialSize = params.H * params.W;
  let groupSize = channelsPerGroup * spatialSize;

  let startCh = groupIdx * channelsPerGroup;

  // Compute mean
  var sum: f32 = 0.0;
  for (var c: u32 = 0; c < channelsPerGroup; c++) {
    let ch = startCh + c;
    for (var sp: u32 = 0; sp < spatialSize; sp++) {
      sum += input[ch * spatialSize + sp];
    }
  }
  let mean = sum / f32(groupSize);
  stats[groupIdx] = mean;

  // Compute variance
  var varSum: f32 = 0.0;
  for (var c: u32 = 0; c < channelsPerGroup; c++) {
    let ch = startCh + c;
    for (var sp: u32 = 0; sp < spatialSize; sp++) {
      let diff = input[ch * spatialSize + sp] - mean;
      varSum += diff * diff;
    }
  }
  stats[params.numGroups + groupIdx] = varSum / f32(groupSize);
}

// Pass 2: Normalize each element using group stats, apply scale+bias
@compute @workgroup_size(WG_SIZE)
fn groupnorm_normalize(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;
  let totalSize = params.C * params.H * params.W;
  if (idx >= totalSize) {
    return;
  }

  let spatialSize = params.H * params.W;
  let ch = idx / spatialSize;
  let channelsPerGroup = params.C / params.numGroups;
  let groupIdx = ch / channelsPerGroup;

  let mean = stats[groupIdx];
  let variance = stats[params.numGroups + groupIdx];
  let invStd = 1.0 / sqrt(variance + params.eps);

  let normalized = (input[idx] - mean) * invStd;
  output[idx] = normalized * scale[ch] + gnbias[ch];
}
`,F=`// conv2d.wgsl — 2D convolution compute shader
//
// Standard conv2d with:
//   - Arbitrary kernel size (1x1, 3x3, etc.)
//   - Input tiling with halo in workgroup shared memory for 3x3
//   - Replicate padding (matching PyTorch padding_mode='replicate')
//   - Optional bias
//   - Supports batched execution (one dispatch per output channel group)
//
// Memory layout (all NCHW, row-major):
//   input:   [C_in, H, W]       — f32
//   weight:  [C_out, C_in, kH, kW] — f32
//   bias:    [C_out]             — f32
//   output:  [C_out, H_out, W_out] — f32
//
// Uniforms:
//   inC, inH, inW: input dimensions
//   outC, outH, outW: output dimensions
//   kH, kW: kernel size
//   padH, padW: padding
//   strideH, strideW: stride
//   hasBias: 0 or 1

struct ConvParams {
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
};

@group(0) @binding(0) var<uniform> params: ConvParams;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read> bias: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

// Workgroup tile for output spatial positions
// 16x16 output tile per workgroup
const TILE_W: u32 = 16;
const TILE_H: u32 = 16;

@compute @workgroup_size(TILE_W, TILE_H, 1)
fn conv2d_main(
  @builtin(global_invocation_id) gid: vec3<u32>,
  @builtin(workgroup_id) wgid: vec3<u32>,
) {
  let outX = gid.x;
  let outY = gid.y;
  let outCh = wgid.z; // one output channel per z-workgroup

  if (outX >= params.outW || outY >= params.outH || outCh >= params.outC) {
    return;
  }

  var sum: f32 = 0.0;

  // Loop over input channels and kernel
  for (var ic: u32 = 0; ic < params.inC; ic++) {
    for (var ky: u32 = 0; ky < params.kH; ky++) {
      for (var kx: u32 = 0; kx < params.kW; kx++) {
        // Input coordinate with stride and padding
        let inY_raw = i32(outY * params.strideH + ky) - i32(params.padH);
        let inX_raw = i32(outX * params.strideW + kx) - i32(params.padW);

        // Replicate padding: clamp to valid range
        let inY = u32(clamp(inY_raw, 0, i32(params.inH) - 1));
        let inX = u32(clamp(inX_raw, 0, i32(params.inW) - 1));

        let inputIdx = ic * params.inH * params.inW + inY * params.inW + inX;
        let weightIdx = outCh * params.inC * params.kH * params.kW
                      + ic * params.kH * params.kW
                      + ky * params.kW
                      + kx;

        sum += input[inputIdx] * weight[weightIdx];
      }
    }
  }

  // Add bias
  if (params.hasBias != 0) {
    sum += bias[outCh];
  }

  let outputIdx = outCh * params.outH * params.outW + outY * params.outW + outX;
  output[outputIdx] = sum;
}
`,D=`// conv2d_channel_range.wgsl - exact output-channel range convolution

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
`,j=`// conv1x1.wgsl — Pointwise (1x1) convolution compute shader
//
// Optimized for the extremely common 1x1 conv case in ConvStack:
//   - input_blocks: project feature dims
//   - output_blocks: project to output dims
//   - DINOv2 output projections
//
// This is effectively a batched matrix multiply over spatial positions.
// Each thread computes one output element (outCh, y, x).
//
// Memory layout (CHW, row-major):
//   input:   [C_in, H, W]     — f32
//   weight:  [C_out, C_in]    — f32 (kH=kW=1, no spatial dims)
//   bias:    [C_out]          — f32
//   output:  [C_out, H, W]   — f32

struct Conv1x1Params {
  inC: u32,
  outC: u32,
  H: u32,
  W: u32,
  hasBias: u32,
  numWorkgroupsX: u32,
};

@group(0) @binding(0) var<uniform> params: Conv1x1Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read> bias: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

const WG_SIZE: u32 = 256;

@compute @workgroup_size(WG_SIZE)
fn conv1x1_main(
  @builtin(global_invocation_id) gid: vec3<u32>,
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  // 2D dispatch: linearize from workgroup_id.x + workgroup_id.y * numWorkgroupsX
  let spatialSize = params.H * params.W;
  let totalWork = params.outC * spatialSize;
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  if (idx >= totalWork) {
    return;
  }

  let oc = idx / spatialSize;
  let sp = idx % spatialSize;

  var sum: f32 = 0.0;

  // Dot product over input channels
  for (var ic: u32 = 0; ic < params.inC; ic++) {
    let inputVal = input[ic * spatialSize + sp];
    let weightVal = weight[oc * params.inC + ic];
    sum += inputVal * weightVal;
  }

  if (params.hasBias != 0) {
    sum += bias[oc];
  }

  output[oc * spatialSize + sp] = sum;
}
`,V=`// conv_transpose2d.wgsl — Transposed 2D convolution (deconvolution) compute shader
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
`,$=`// pixelshuffle.wgsl — PixelShuffle (sub-pixel convolution) compute shader
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
`,q=`// upsample.wgsl — Bilinear/Nearest upsampling compute shader
//
// Used in Resampler when type='bilinear' or 'nearest'.
// Also used for final F.interpolate to resize output to original image dims.
//
// PyTorch: nn.Upsample(scale_factor=2, mode='bilinear', align_corners=False)
// PyTorch: F.interpolate(x, (h, w), mode='bilinear', align_corners=False)
//
// Memory layout (CHW, row-major):
//   input:   [C, inH, inW]  — f32
//   output:  [C, outH, outW] — f32

struct UpsampleParams {
  C: u32,
  inH: u32,
  inW: u32,
  outH: u32,
  outW: u32,
  mode: u32,    // 0=nearest, 1=bilinear
  numWorkgroupsX: u32,
};

@group(0) @binding(0) var<uniform> params: UpsampleParams;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read_write> output: array<f32>;

const WG_SIZE: u32 = 256;

@compute @workgroup_size(WG_SIZE)
fn upsample_main(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let totalOut = params.C * params.outH * params.outW;
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  if (idx >= totalOut) {
    return;
  }

  let outSpatial = params.outH * params.outW;
  let ch = idx / outSpatial;
  let rem = idx % outSpatial;
  let oy = rem / params.outW;
  let ox = rem % params.outW;

  let inBase = ch * params.inH * params.inW;

  if (params.mode == 0u) {
    // Nearest
    let iy = oy * params.inH / params.outH;
    let ix = ox * params.inW / params.outW;
    output[idx] = input[inBase + iy * params.inW + ix];
  } else {
    // Bilinear (align_corners=False, matching PyTorch F.interpolate)
    // Source coordinate, clamped to valid range before computing fractional part
    let srcY_raw = (f32(oy) + 0.5) * f32(params.inH) / f32(params.outH) - 0.5;
    let srcX_raw = (f32(ox) + 0.5) * f32(params.inW) / f32(params.outW) - 0.5;
    let srcY = clamp(srcY_raw, 0.0, f32(params.inH - 1u));
    let srcX = clamp(srcX_raw, 0.0, f32(params.inW - 1u));

    let y0 = u32(floor(srcY));
    let x0 = u32(floor(srcX));
    let y1 = min(y0 + 1u, params.inH - 1u);
    let x1 = min(x0 + 1u, params.inW - 1u);

    let fy = srcY - f32(y0);
    let fx = srcX - f32(x0);

    let v00 = input[inBase + y0 * params.inW + x0];
    let v01 = input[inBase + y0 * params.inW + x1];
    let v10 = input[inBase + y1 * params.inW + x0];
    let v11 = input[inBase + y1 * params.inW + x1];

    let top = v00 * (1.0 - fx) + v01 * fx;
    let bot = v10 * (1.0 - fx) + v11 * fx;
    output[idx] = top * (1.0 - fy) + bot * fy;
  }
}
`;const G=new Map,L=new Map,T=65535;function B(n,t){const u=new Uint8Array(t.buffer||t);let l=0;for(let i=0;i<u.length;i++)
l=l*31+u[i]|0;const r=`u_${u.length}_${l}`;if(L.has(r))return L.get(r);const s=n.createBuffer({size:Math.max(u.byteLength,
16),usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});return new Uint8Array(s.getMappedRange()).
set(u),s.unmap(),L.set(r,s),s}let M=null;function J(){return{uniformCache:L,dummyBiasBuf:M}}function U(n){return M||(M=A(
n,new Float32Array([0]))),M}function X(n){if(n<=T)return[n,1];const t=T,u=Math.ceil(n/T);return[t,u]}function I(n,t,u,l,r=null){
if(r&&(r.device!==n||!(r.pipelines instanceof Map)))throw new Error("shader resource context belongs to another device");
const s=r?.pipelines??G;if(s.has(t))return s.get(t);const i=n.createShaderModule({code:u}),a=n.createComputePipeline({layout:"\
auto",compute:{module:i,entryPoint:l}});return s.set(t,a),a}function R(n,t,u){return u?O(n,t,"post-processor-duty-unifor\
m"):B(n,t)}function C(n,t){return Math.ceil(n/t)}function K(n,t,u,l,r,s){const{inC:i,inH:a,inW:e,outC:o,kH:c,kW:m,padH:y,
padW:d,strideH:f,strideW:g}=s,W=Math.floor((a+2*y-c)/f)+1,b=Math.floor((e+2*d-m)/g)+1,p=r?1:0,h=I(n,"conv2d",F,"conv2d_m\
ain"),x=new Uint32Array([i,a,e,o,W,b,c,m,y,d,f,g,p]),v=B(n,x),H=r||U(n),w=S(n,o*W*b*4),k=n.createBindGroup({layout:h.getBindGroupLayout(
0),entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{
buffer:H}},{binding:4,resource:{buffer:w}}]}),_=t.beginComputePass();return _.setPipeline(h),_.setBindGroup(0,k),_.dispatchWorkgroups(
C(b,16),C(W,16),o),_.end(),{buffer:w,outC:o,outH:W,outW:b}}function Q(n,t,u,l,r,s,i,a){const{inC:e,inH:o,inW:c,outC:m,kH:y,
kW:d,padH:f,padW:g,strideH:W,strideW:b}=i,{channelStart:p,channelCount:h}=a;if(!Number.isSafeInteger(p)||p<0||!Number.isSafeInteger(
h)||h<=0||p+h>m)throw new RangeError(`invalid Conv2d output-channel range ${p}+${h}/${m}`);const x=Math.floor((o+2*f-y)/
W)+1,v=Math.floor((c+2*g-d)/b)+1,H=r?1:0,w=I(n,"conv2d-channel-range",D,"conv2d_channel_range_main",i.resourceContext),k=new Uint32Array(
[e,o,c,m,x,v,y,d,f,g,W,b,H,p,h,i.applyRelu===!0?1:0]),_=R(n,k,i.resourceContext),z=r||(i.resourceContext?A(n,new Float32Array(
[0])):U(n)),E=n.createBindGroup({layout:w.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:{
buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:z}},{binding:4,resource:{buffer:s}}]}),P=t.beginComputePass();
return P.setPipeline(w),P.setBindGroup(0,E),P.dispatchWorkgroups(C(v,16),C(x,16),h),P.end(),{buffer:s,outC:m,outH:x,outW:v}}
function nn(n,t,u,l,r,s){const{inC:i,outC:a,H:e,W:o}=s,c=r?1:0,m=I(n,"conv1x1",j,"conv1x1_main"),y=C(a*e*o,256),[d,f]=X(
y),g=new Uint32Array([i,a,e,o,c,d]),W=B(n,g),b=r||U(n),p=S(n,a*e*o*4),h=n.createBindGroup({layout:m.getBindGroupLayout(0),
entries:[{binding:0,resource:{buffer:W}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{
buffer:b}},{binding:4,resource:{buffer:p}}]}),x=t.beginComputePass();return x.setPipeline(m),x.setBindGroup(0,h),x.dispatchWorkgroups(
d,f),x.end(),{buffer:p,C:a,H:e,W:o}}function rn(n,t,u,l,r,s){const i=I(n,"activation",Z,"activation_main"),a=C(r,256),[e,
o]=X(a),c=new Uint32Array([r,s,e]),m=B(n,c),y=l||U(n),d=S(n,r*4),f=n.createBindGroup({layout:i.getBindGroupLayout(0),entries:[
{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:y}},{binding:3,resource:{buffer:d}}]}),
g=t.beginComputePass();return g.setPipeline(i),g.setBindGroup(0,f),g.dispatchWorkgroups(e,o),g.end(),d}function an(n,t,u,l,r,s){
const{C:i,H:a,W:e,numGroups:o,eps:c=1e-5}=s;if(!G.has("gn_layout")){const E=n.createBindGroupLayout({entries:[{binding:0,
visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"re\
ad-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:3,visibility:GPUShaderStage.
COMPUTE,buffer:{type:"read-only-storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,
visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),P=n.createPipelineLayout({bindGroupLayouts:[E]}),Y=n.createShaderModule(
{code:N});G.set("gn_layout",E),G.set("gn_stats",n.createComputePipeline({layout:P,compute:{module:Y,entryPoint:"groupnor\
m_stats"}})),G.set("gn_norm",n.createComputePipeline({layout:P,compute:{module:Y,entryPoint:"groupnorm_normalize"}}))}const m=G.
get("gn_stats"),y=G.get("gn_norm"),d=G.get("gn_layout"),f=C(i*a*e,256),[g,W]=X(f),b=new ArrayBuffer(24),p=new Uint32Array(
b),h=new Float32Array(b);p[0]=i,p[1]=a,p[2]=e,p[3]=o,h[4]=c,p[5]=g;const x=B(n,new Uint8Array(b)),v=S(n,o*2*4),H=S(n,i*a*
e*4),w=n.createBindGroup({layout:d,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:u}},{binding:2,resource:{
buffer:l}},{binding:3,resource:{buffer:r}},{binding:4,resource:{buffer:H}},{binding:5,resource:{buffer:v}}]}),k=t.beginComputePass();
k.setPipeline(m),k.setBindGroup(0,w),k.dispatchWorkgroups(C(o,256)),k.end();const _=n.createBindGroup({layout:d,entries:[
{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:r}},
{binding:4,resource:{buffer:H}},{binding:5,resource:{buffer:v}}]}),z=t.beginComputePass();return z.setPipeline(y),z.setBindGroup(
0,_),z.dispatchWorkgroups(g,W),z.end(),H}function tn(n,t,u,l){const{inC:r,inH:s,inW:i,scaleFactor:a}=l,e=r/(a*a),o=s*a,c=i*
a,m=I(n,"pixelshuffle",$,"pixelshuffle_main",l.resourceContext),y=C(e*o*c,256),[d,f]=X(y),g=new Uint32Array([r,s,i,e,a,d]),
W=R(n,g,l.resourceContext),b=S(n,e*o*c*4),p=n.createBindGroup({layout:m.getBindGroupLayout(0),entries:[{binding:0,resource:{
buffer:W}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:b}}]}),h=t.beginComputePass();return h.setPipeline(
m),h.setBindGroup(0,p),h.dispatchWorkgroups(d,f),h.end(),{buffer:b,C:e,H:o,W:c}}function en(n,t,u,l){const{C:r,inH:s,inW:i,
outH:a,outW:e,mode:o=1}=l,c=I(n,"upsample",q,"upsample_main"),m=C(r*a*e,256),[y,d]=X(m),f=new Uint32Array([r,s,i,a,e,o,y]),
g=B(n,f),W=S(n,r*a*e*4),b=n.createBindGroup({layout:c.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:g}},{binding:1,
resource:{buffer:u}},{binding:2,resource:{buffer:W}}]}),p=t.beginComputePass();return p.setPipeline(c),p.setBindGroup(0,
b),p.dispatchWorkgroups(y,d),p.end(),{buffer:W,C:r,H:a,W:e}}function on(n,t,u,l,r,s){const{inC:i,inH:a,inW:e,outC:o,stride:c}=s,
m=c,y=c,d=a*c,f=e*c,g=r?1:0,W=I(n,"conv_transpose2d",V,"conv_transpose2d_main"),b=C(o*d*f,256),[p,h]=X(b),x=new Uint32Array(
[i,a,e,o,d,f,m,y,c,c,g,p]),v=B(n,x),H=r||U(n),w=S(n,o*d*f*4),k=n.createBindGroup({layout:W.getBindGroupLayout(0),entries:[
{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:H}},
{binding:4,resource:{buffer:w}}]}),_=t.beginComputePass();return _.setPipeline(W),_.setBindGroup(0,k),_.dispatchWorkgroups(
p,h),_.end(),{buffer:w,C:o,H:d,W:f}}var sn=Object.freeze({__proto__:null,dispatchActivation:rn,dispatchConv1x1:nn,dispatchConv2d:K,
dispatchConv2dChannelRange:Q,dispatchConvTranspose2d:on,dispatchGroupNorm:an,dispatchPixelShuffle:tn,dispatchUpsample:en,
getPersistentShaderResources:J});export{Z as a,K as b,rn as c,Q as d,tn as e,N as g,sn as s};
