/**
 * Grid sample (bilinear) compute shader.
 *
 * Implements torch.nn.functional.grid_sample with:
 *   - mode='bilinear'
 *   - align_corners=True
 *   - padding_mode='zeros' (out-of-bound → 0)
 *
 * Used for SF3D's triplane query: sample features from 3 planes at
 * arbitrary 2D coordinates derived from 3D positions.
 *
 * Input feature map: [C, H, W]
 * Grid coordinates: [N, 2] (normalized [-1, 1])
 * Output: [N, C]
 */

struct Params {
  C: u32,    // channels
  H: u32,    // input height
  W: u32,    // input width
  N: u32,    // number of sample points
  numWorkgroupsX: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> input: array<f32>;   // [C, H, W]
@group(0) @binding(2) var<storage, read> grid: array<f32>;    // [N, 2] (x, y in [-1, 1])
@group(0) @binding(3) var<storage, read_write> output: array<f32>; // [N, C]

const WG_SIZE: u32 = 256;

@compute @workgroup_size(WG_SIZE)
fn grid_sample_main(@builtin(global_invocation_id) gid: vec3<u32>,
                    @builtin(workgroup_id) wgid: vec3<u32>,
                    @builtin(local_invocation_id) lid: vec3<u32>) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  let total = params.N * params.C;
  if (idx >= total) { return; }

  let n = idx / params.C;
  let c = idx % params.C;

  // Grid coordinates in [-1, 1], align_corners=True:
  // pixel = (grid + 1) / 2 * (size - 1)
  let gx = grid[n * 2];
  let gy = grid[n * 2 + 1];

  let px = (gx + 1.0) * 0.5 * f32(params.W - 1);
  let py = (gy + 1.0) * 0.5 * f32(params.H - 1);

  let x0 = i32(floor(px));
  let y0 = i32(floor(py));
  let x1 = x0 + 1;
  let y1 = y0 + 1;

  let fx = px - f32(x0);
  let fy = py - f32(y0);

  let H = i32(params.H);
  let W = i32(params.W);

  // Sample 4 corners with bounds checking (zeros padding)
  var v00: f32 = 0.0;
  var v01: f32 = 0.0;
  var v10: f32 = 0.0;
  var v11: f32 = 0.0;

  if (x0 >= 0 && x0 < W && y0 >= 0 && y0 < H) {
    v00 = input[c * params.H * params.W + u32(y0) * params.W + u32(x0)];
  }
  if (x1 >= 0 && x1 < W && y0 >= 0 && y0 < H) {
    v01 = input[c * params.H * params.W + u32(y0) * params.W + u32(x1)];
  }
  if (x0 >= 0 && x0 < W && y1 >= 0 && y1 < H) {
    v10 = input[c * params.H * params.W + u32(y1) * params.W + u32(x0)];
  }
  if (x1 >= 0 && x1 < W && y1 >= 0 && y1 < H) {
    v11 = input[c * params.H * params.W + u32(y1) * params.W + u32(x1)];
  }

  // Bilinear interpolation
  let top = v00 * (1.0 - fx) + v01 * fx;
  let bot = v10 * (1.0 - fx) + v11 * fx;
  let result = top * (1.0 - fy) + bot * fy;

  // Output layout: [N, C]
  output[n * params.C + c] = result;
}
