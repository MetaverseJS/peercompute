// upsample.wgsl — Bilinear/Nearest upsampling compute shader
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
