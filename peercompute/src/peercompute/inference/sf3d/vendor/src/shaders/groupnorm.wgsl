// groupnorm.wgsl — Group Normalization compute shader
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
