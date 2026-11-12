/**
 * Cross-attention compute shader.
 *
 * Computes attention where Q comes from one sequence and K,V from another.
 * Used in SF3D's FuseBlock (fuse triplane ↔ image tokens) and
 * BasicBlock's attn2 (cross-attend latents to encoder hidden states).
 *
 * Three entry points matching the self-attention pattern:
 *   - computeCrossScores: Q·K^T with scaling
 *   - softmaxCross: row-wise softmax (same as self-attention)
 *   - applyCrossAttn: scores @ V
 */

struct Params {
  N_q: u32,     // query sequence length
  N_kv: u32,    // key/value sequence length
  D: u32,       // head dimension
  numHeads: u32,
  numWorkgroupsX: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> Q: array<f32>;       // [N_q, numHeads, D]
@group(0) @binding(2) var<storage, read> K: array<f32>;       // [N_kv, numHeads, D]
@group(0) @binding(3) var<storage, read> V: array<f32>;       // [N_kv, numHeads, D]
@group(0) @binding(4) var<storage, read_write> scores: array<f32>; // [numHeads, N_q, N_kv]
@group(0) @binding(5) var<storage, read_write> output: array<f32>; // [N_q, numHeads, D]

const WG_SIZE: u32 = 256;

/**
 * Compute cross-attention scores: score[h, qi, ki] = Q[qi, h, :] · K[ki, h, :] / sqrt(D)
 */
@compute @workgroup_size(WG_SIZE)
fn computeCrossScores(@builtin(global_invocation_id) gid: vec3<u32>,
                      @builtin(workgroup_id) wgid: vec3<u32>,
                      @builtin(local_invocation_id) lid: vec3<u32>) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  let totalScores = params.numHeads * params.N_q * params.N_kv;
  if (idx >= totalScores) { return; }

  let h = idx / (params.N_q * params.N_kv);
  let rem = idx % (params.N_q * params.N_kv);
  let qi = rem / params.N_kv;
  let ki = rem % params.N_kv;

  let D = params.D;
  let scale = 1.0 / sqrt(f32(D));

  // Q layout: [N_q, numHeads, D] → Q[qi * numHeads * D + h * D + d]
  // K layout: [N_kv, numHeads, D] → K[ki * numHeads * D + h * D + d]
  let qBase = qi * params.numHeads * D + h * D;
  let kBase = ki * params.numHeads * D + h * D;

  // 4-way split accumulation
  var s0: f32 = 0.0; var s1: f32 = 0.0;
  var s2: f32 = 0.0; var s3: f32 = 0.0;
  let steps = D / 4u;
  for (var i: u32 = 0u; i < steps; i++) {
    let d = i * 4u;
    s0 += Q[qBase + d]     * K[kBase + d];
    s1 += Q[qBase + d + 1] * K[kBase + d + 1];
    s2 += Q[qBase + d + 2] * K[kBase + d + 2];
    s3 += Q[qBase + d + 3] * K[kBase + d + 3];
  }
  // Handle remainder
  let rem_start = steps * 4u;
  var s_rem: f32 = 0.0;
  for (var d = rem_start; d < D; d++) {
    s_rem += Q[qBase + d] * K[kBase + d];
  }

  let dot = ((s0 + s1) + (s2 + s3)) + s_rem;

  // scores layout: [numHeads, N_q, N_kv]
  scores[h * params.N_q * params.N_kv + qi * params.N_kv + ki] = dot * scale;
}

/**
 * Row-wise softmax over KV dimension.
 * One thread per (head, query) row.
 */
@compute @workgroup_size(WG_SIZE)
fn softmaxCross(@builtin(global_invocation_id) gid: vec3<u32>,
                @builtin(workgroup_id) wgid: vec3<u32>,
                @builtin(local_invocation_id) lid: vec3<u32>) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  let totalRows = params.numHeads * params.N_q;
  if (idx >= totalRows) { return; }

  let base = idx * params.N_kv;

  // Find max
  var maxVal: f32 = scores[base];
  for (var i: u32 = 1u; i < params.N_kv; i++) {
    maxVal = max(maxVal, scores[base + i]);
  }

  // Exp and sum
  var sumExp: f32 = 0.0;
  for (var i: u32 = 0u; i < params.N_kv; i++) {
    let e = exp(scores[base + i] - maxVal);
    scores[base + i] = e;
    sumExp += e;
  }

  // Normalize
  let invSum = 1.0 / sumExp;
  for (var i: u32 = 0u; i < params.N_kv; i++) {
    scores[base + i] *= invSum;
  }
}

/**
 * Apply cross-attention: output[qi, h, d] = sum_ki scores[h, qi, ki] * V[ki, h, d]
 */
@compute @workgroup_size(WG_SIZE)
fn applyCrossAttn(@builtin(global_invocation_id) gid: vec3<u32>,
                  @builtin(workgroup_id) wgid: vec3<u32>,
                  @builtin(local_invocation_id) lid: vec3<u32>) {
  let linearWG = wgid.x + wgid.y * params.numWorkgroupsX;
  let idx = linearWG * WG_SIZE + lid.x;

  let totalOut = params.N_q * params.numHeads * params.D;
  if (idx >= totalOut) { return; }

  let qi = idx / (params.numHeads * params.D);
  let rem = idx % (params.numHeads * params.D);
  let h = rem / params.D;
  let d = rem % params.D;

  let scoreBase = h * params.N_q * params.N_kv + qi * params.N_kv;

  // 4-way accumulation over KV positions
  var s0: f32 = 0.0; var s1: f32 = 0.0;
  var s2: f32 = 0.0; var s3: f32 = 0.0;
  let steps = params.N_kv / 4u;
  for (var i: u32 = 0u; i < steps; i++) {
    let ki = i * 4u;
    // V layout: [N_kv, numHeads, D]
    s0 += scores[scoreBase + ki]     * V[(ki)     * params.numHeads * params.D + h * params.D + d];
    s1 += scores[scoreBase + ki + 1] * V[(ki + 1) * params.numHeads * params.D + h * params.D + d];
    s2 += scores[scoreBase + ki + 2] * V[(ki + 2) * params.numHeads * params.D + h * params.D + d];
    s3 += scores[scoreBase + ki + 3] * V[(ki + 3) * params.numHeads * params.D + h * params.D + d];
  }
  let rem_start = steps * 4u;
  var s_rem: f32 = 0.0;
  for (var ki = rem_start; ki < params.N_kv; ki++) {
    s_rem += scores[scoreBase + ki] * V[ki * params.numHeads * params.D + h * params.D + d];
  }

  output[qi * params.numHeads * params.D + h * params.D + d] = ((s0 + s1) + (s2 + s3)) + s_rem;
}
