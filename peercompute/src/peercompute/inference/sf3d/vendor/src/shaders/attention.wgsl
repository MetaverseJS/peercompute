// Multi-head self-attention compute shaders for DINOv2 ViT.
// Adapted from webgpu-samples visionTransformer with 2D dispatch.
//
// Three entry points:
//   computeScores: Q·K^T scaled dot product → scores
//   softmax: row-wise numerically stable softmax
//   applyAttn: scores @ V → output

struct ScoreParams {
  N: u32,        // number of tokens
  D: u32,        // model dimension
  numHeads: u32,
  headDim: u32,
  scale: f32,
  numWorkgroupsX: u32,
}

struct SoftmaxParams {
  N: u32,
  numHeads: u32,
  numWorkgroupsX: u32,
}

struct ApplyParams {
  N: u32,
  D: u32,
  numHeads: u32,
  headDim: u32,
  numWorkgroupsX: u32,
}

// --- Attention scores ---
@group(0) @binding(0) var<uniform> scoreParams: ScoreParams;
@group(0) @binding(1) var<storage, read> qBuf: array<f32>;
@group(0) @binding(2) var<storage, read> kBuf: array<f32>;
@group(0) @binding(3) var<storage, read_write> scoreBuf: array<f32>;

@compute @workgroup_size(256)
fn computeScores(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * scoreParams.numWorkgroupsX;
  let idx = linearWG * 256u + lid.x;

  let N = scoreParams.N;
  let numHeads = scoreParams.numHeads;
  let headDim = scoreParams.headDim;
  let D = scoreParams.D;
  let totalScores = numHeads * N * N;

  if (idx >= totalScores) { return; }

  let head = idx / (N * N);
  let remainder = idx % (N * N);
  let qi = remainder / N;
  let ki = remainder % N;
  let headOffset = head * headDim;

  // headDim is 64, so 4-way split gives 16-element chains.
  var d0 = 0.0;
  var d1 = 0.0;
  var d2 = 0.0;
  var d3 = 0.0;
  let qBase = qi * D + headOffset;
  let kBase = ki * D + headOffset;
  let hd4 = (headDim / 4u) * 4u;
  for (var d = 0u; d < hd4; d += 4u) {
    d0 += qBuf[qBase + d]      * kBuf[kBase + d];
    d1 += qBuf[qBase + d + 1u] * kBuf[kBase + d + 1u];
    d2 += qBuf[qBase + d + 2u] * kBuf[kBase + d + 2u];
    d3 += qBuf[qBase + d + 3u] * kBuf[kBase + d + 3u];
  }
  for (var d = hd4; d < headDim; d++) {
    d0 += qBuf[qBase + d] * kBuf[kBase + d];
  }

  scoreBuf[idx] = ((d0 + d1) + (d2 + d3)) * scoreParams.scale;
}

// --- Softmax ---
// Uses separate bind group with SoftmaxParams
@group(0) @binding(0) var<uniform> softmaxParams: SoftmaxParams;
@group(0) @binding(1) var<storage, read_write> softmaxScoreBuf: array<f32>;

@compute @workgroup_size(256)
fn softmax(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * softmaxParams.numWorkgroupsX;
  let idx = linearWG * 256u + lid.x;

  let N = softmaxParams.N;
  let totalRows = softmaxParams.numHeads * N;

  if (idx >= totalRows) { return; }

  let base = idx * N;

  // Find max
  var m = -1e30;
  for (var i = 0u; i < N; i++) {
    m = max(m, softmaxScoreBuf[base + i]);
  }

  // Exp and sum
  var s = 0.0;
  for (var i = 0u; i < N; i++) {
    let e = exp(softmaxScoreBuf[base + i] - m);
    softmaxScoreBuf[base + i] = e;
    s += e;
  }

  // Normalize
  for (var i = 0u; i < N; i++) {
    softmaxScoreBuf[base + i] = softmaxScoreBuf[base + i] / s;
  }
}

// --- Apply attention ---
@group(0) @binding(0) var<uniform> applyParams: ApplyParams;
@group(0) @binding(1) var<storage, read> applyScoreBuf: array<f32>;
@group(0) @binding(2) var<storage, read> vBuf: array<f32>;
@group(0) @binding(3) var<storage, read_write> attnOutput: array<f32>;

@compute @workgroup_size(256)
fn applyAttn(
  @builtin(workgroup_id) wgid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
) {
  let linearWG = wgid.x + wgid.y * applyParams.numWorkgroupsX;
  let idx = linearWG * 256u + lid.x;

  let N = applyParams.N;
  let D = applyParams.D;
  let numHeads = applyParams.numHeads;
  let headDim = applyParams.headDim;

  if (idx >= N * D) { return; }

  let row = idx / D;
  let col = idx % D;
  let head = col / headDim;
  let d = col % headDim;

  // N is ~1370 tokens, 4-way split gives ~342-element chains.
  var v0 = 0.0;
  var v1 = 0.0;
  var v2 = 0.0;
  var v3 = 0.0;
  let scoreBase = head * N * N + row * N;
  let vCol = head * headDim + d;
  let n4 = (N / 4u) * 4u;
  for (var j = 0u; j < n4; j += 4u) {
    v0 += applyScoreBuf[scoreBase + j]      * vBuf[(j)      * D + vCol];
    v1 += applyScoreBuf[scoreBase + j + 1u] * vBuf[(j + 1u) * D + vCol];
    v2 += applyScoreBuf[scoreBase + j + 2u] * vBuf[(j + 2u) * D + vCol];
    v3 += applyScoreBuf[scoreBase + j + 3u] * vBuf[(j + 3u) * D + vCol];
  }
  for (var j = n4; j < N; j++) {
    v0 += applyScoreBuf[scoreBase + j] * vBuf[j * D + vCol];
  }
  attnOutput[idx] = (v0 + v1) + (v2 + v3);
}
