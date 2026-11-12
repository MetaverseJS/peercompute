/**
 * sf3d_backbone.js — DINOv2 ViT-Large backbone adapted for SF3D.
 *
 * Key differences from MOGE's DINOv2:
 *   - Separate Q/K/V projections (not fused QKV)
 *   - AdaNorm modulation: each layer has norm1_modulation and norm2_modulation
 *     that take camera embeddings and produce scale/shift for LayerNorm outputs
 *   - Standard GELU MLP (verified from checkpoint config: use_swiglu_ffn=False)
 *   - Final layernorm after encoder
 *   - Output is last_hidden_state permuted to [N_v, C, N_t] tokens (no intermediate extraction)
 *
 * Produces: [N_tokens, dim] image features for the two-stream backbone
 */

import { createStorageBuffer, createEmptyBuffer, readBuffer, captureGpuBufferAllocations } from './gpu.js';

import patchEmbedWGSL from '../shaders/patch_embed_dinov2.wgsl?raw';
import layerNormWGSL from '../shaders/layernorm_vit.wgsl?raw';
import attentionWGSL from '../shaders/attention.wgsl?raw';
import linearWGSL from '../shaders/linear.wgsl?raw';
import linearGeluWGSL from '../shaders/linear_gelu.wgsl?raw';
import layerscaleWGSL from '../shaders/layerscale.wgsl?raw';
import activationsWGSL from '../shaders/activations.wgsl?raw';

const MAX_WG = 65535;
const WG_SIZE = 256;
function splitWG(total) {
  if (total <= MAX_WG) return [total, 1];
  return [MAX_WG, Math.ceil(total / MAX_WG)];
}
function ceilDiv(a, b) { return Math.ceil(a / b); }

function makeUniform(device, data) {
  const buf = device.createBuffer({
    size: Math.max(data.byteLength, 16),
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  new Uint8Array(buf.getMappedRange()).set(new Uint8Array(data.buffer || data));
  buf.unmap();
  return buf;
}

const VIT_CONFIG = {
  dim: 1024,
  numHeads: 16,
  headDim: 64,
  numLayers: 24,
  patchSize: 14,
  channels: 3,
  // Standard GELU MLP (not SwiGLU — verified from checkpoint config)
  mlpHiddenDim: 4096,
  scale: 1.0 / Math.sqrt(64),
  eps: 1e-6,
};

export class SF3DImageTokenizer {
  constructor(device) {
    this.device = device;
    this.pipelines = {};
    this._uniformCache = new Map();
  }

  init() {
    const device = this.device;
    const make = (code, entry) => device.createComputePipeline({
      layout: 'auto',
      compute: { module: device.createShaderModule({ code }), entryPoint: entry },
    });

    this.pipelines.patchEmbed = make(patchEmbedWGSL, 'main');
    this.pipelines.layerNorm = make(layerNormWGSL, 'main');
    this.pipelines.attnScores = make(attentionWGSL, 'computeScores');
    this.pipelines.attnSoftmax = make(attentionWGSL, 'softmax');
    this.pipelines.attnApply = make(attentionWGSL, 'applyAttn');
    this.pipelines.linear = make(linearWGSL, 'main');
    this.pipelines.linearGelu = make(linearGeluWGSL, 'main');
    this.pipelines.layerScale = make(layerscaleWGSL, 'main');
    this.pipelines.activation = make(activationsWGSL, 'activation_main');

    // Inline add shader
    this.pipelines.add = make(`
      @group(0) @binding(0) var<storage, read_write> dst: array<f32>;
      @group(0) @binding(1) var<storage, read> src: array<f32>;
      struct P { count: u32, numWgX: u32 }
      @group(0) @binding(2) var<uniform> p: P;
      @compute @workgroup_size(256)
      fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
        let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
        if (idx >= p.count) { return; }
        dst[idx] = dst[idx] + src[idx];
      }
    `, 'main');

    // Modulated LayerNorm: output = (1 + scale) * LN(input) + shift
    // scale, shift come from linear(cameraEmbed) → [2*D], split into scale and shift
    this.pipelines.modulatedLN = make(`
      struct P { N: u32, D: u32, numWgX: u32 }
      @group(0) @binding(0) var<uniform> p: P;
      @group(0) @binding(1) var<storage, read> input: array<f32>;
      @group(0) @binding(2) var<storage, read> gamma: array<f32>;
      @group(0) @binding(3) var<storage, read> beta: array<f32>;
      @group(0) @binding(4) var<storage, read> modulation: array<f32>;
      @group(0) @binding(5) var<storage, read_write> output: array<f32>;

      @compute @workgroup_size(1)
      fn main(@builtin(global_invocation_id) gid: vec3u) {
        let row = gid.x;
        if (row >= p.N) { return; }
        let D = p.D;
        let base = row * D;
        var sum: f32 = 0.0;
        for (var d: u32 = 0; d < D; d++) { sum += input[base + d]; }
        let mean = sum / f32(D);
        var varSum: f32 = 0.0;
        for (var d: u32 = 0; d < D; d++) { let diff = input[base + d] - mean; varSum += diff * diff; }
        let invStd = 1.0 / sqrt(varSum / f32(D) + 1e-6);
        for (var d: u32 = 0; d < D; d++) {
          let normalized = (input[base + d] - mean) * invStd;
          let ln_out = gamma[d] * normalized + beta[d];
          let scale = modulation[d];
          let shift = modulation[D + d];
          output[base + d] = (1.0 + scale) * ln_out + shift;
        }
      }
    `, 'main');

    this.pipelines.linearGelu = make(linearGeluWGSL, 'main');
  }

  _cachedUniform(data) {
    const bytes = new Uint8Array(data.buffer || data);
    let h = 0;
    for (let i = 0; i < bytes.length; i++) h = (h * 31 + bytes[i]) | 0;
    const key = `u_${bytes.length}_${h}`;
    if (this._uniformCache.has(key)) return this._uniformCache.get(key);
    const buf = makeUniform(this.device, data);
    this._uniformCache.set(key, buf);
    return buf;
  }

  /**
   * Run the SF3D DINOv2 image tokenizer.
   *
   * @param {GPUCommandEncoder} encoder
   * @param {GPUBuffer} imageBuf - [3, 512, 512] normalized image
   * @param {GPUBuffer} cameraEmbedBuf - [768] camera embedding
   * @param {Object} weights - imageTokenizer weights from loadWeights
   * @returns {GPUBuffer} - [N_tokens, 1024] image token features (permuted for backbone)
   */
  /**
   * Legacy single-command-buffer encode. Records patch embed, all 24 ViT
   * blocks, and the final LayerNorm into the caller-supplied `encoder`; the
   * caller submits it once. Behavior-preserving over the pre-cooperative port.
   */
  encode(encoder, imageBuf, cameraEmbedBuf, weights) {
    const ctx = this._setupEncode(encoder, imageBuf, cameraEmbedBuf, weights);
    for (let l = 0; l < VIT_CONFIG.numLayers; l++) {
      this._encodeBlock(encoder, l, ctx, weights);
    }
    return this._finalizeEncode(encoder, ctx, weights);
  }

  /**
   * Cooperative encode driven by the Kaminos cooperative porting spine.
   *
   * Numerically identical to encode(): the exact same dispatch sequence over
   * the exact same device-owned work buffers (tokenBufA/tokenBufB ping-pong
   * persists across chunks because buffers are device-owned, not encoder-owned).
   * The only difference is command-buffer granularity — each fixed chunk of
   * `chunkBlocks` blocks is recorded into its own encoder and handed to the
   * driver to submit + yield, instead of all 24 blocks in one command buffer.
   *
   * Setup (patch embed + SiLU) rides in the first chunk's encoder; the final
   * LayerNorm rides in the last chunk's encoder. Every dispatch executes in the
   * same queue order it would under encode(), so GPU results are byte-identical.
   *
   * @param {object} o
   * @param {GPUBuffer} o.imageBuf
   * @param {GPUBuffer} o.cameraEmbedBuf
   * @param {object} o.weights
   * @param {number} o.numBlocks
   * @param {number} o.chunkBlocks
   * @param {(blockStart:number, blockEnd:number, encodeChunk:(enc:GPUCommandEncoder)=>void)=>Promise<void>} o.driver
   */
  async encodeCooperative({ imageBuf, cameraEmbedBuf, weights, numBlocks, chunkBlocks, driver, withChunkWeights = null, retireIntermediateBuffers = false }) {
    if(this._capturedWorkOwner)throw Error('DINO work-buffer cleanup is quarantined');
    if (numBlocks !== VIT_CONFIG.numLayers) {
      throw new Error(
        `encodeCooperative numBlocks ${numBlocks} must equal VIT_CONFIG.numLayers ${VIT_CONFIG.numLayers}`,
      );
    }
    if(withChunkWeights!==null&&typeof withChunkWeights!=='function')throw TypeError('withChunkWeights must be a function');
    // ctx (work buffers + currentTokens ping-pong pointer) is created once and
    // survives every chunk. Setup dispatches are deferred into the first chunk.
    let ctx = null;
    let result = null;
    const allocations=[];
    let failure,failed=false;

    try{
    for (let start = 0; start < numBlocks; start += chunkBlocks) {
      const end = Math.min(start + chunkBlocks, numBlocks);
      const isFirst = start === 0;
      const isLast = end === numBlocks;
      // eslint-disable-next-line no-await-in-loop
      const encode = chunkWeights => driver(start, end, encoder => {
        const record = () => {
        if (isFirst) {
          ctx = this._setupEncode(encoder, imageBuf, cameraEmbedBuf, chunkWeights);
        }
        for (let l = start; l < end; l++) {
          this._encodeBlock(encoder, l, ctx, chunkWeights);
        }
        if (isLast) {
          result = this._finalizeEncode(encoder, ctx, chunkWeights);
        }
        };
        if(retireIntermediateBuffers)captureGpuBufferAllocations(record,{ownedAllocations:allocations});
        else record();
      });
      if(withChunkWeights)await withChunkWeights({blockStart:start,blockEnd:end,isFirst,isLast},encode);
      else await encode(weights);
    }

    if (!result) throw new Error('encodeCooperative produced no result');
    return result;
    }catch(error){failed=true;failure=error;throw error;}
    finally{
      if(retireIntermediateBuffers){
        // Capture only synchronous model encoding, never a yielding host turn.
        // Do not retire backing still referenced by an unresolved queue prefix.
        this._capturedWorkOwner={buffers:new Set(allocations.map(a=>a.buffer)),keep:failed?null:result?.tokensBuf};
        try{await this.retireCapturedWorkBuffers();}
        catch(error){
          // The output was never returned when finally rejects: recovery owns
          // it too. Keep the entire unresolved inventory on this tokenizer.
          if(this._capturedWorkOwner)this._capturedWorkOwner.keep=null;
          throw failed?new AggregateError([failure,error],'DINO failed and work-buffer cleanup is unresolved',{cause:failure}):error;
        }
      }
    }
  }

  /** Recover only after a new actual drain; unresolved backing stays owned. */
  async retireCapturedWorkBuffers(){
    const owner=this._capturedWorkOwner;if(!owner)return;
    await this.device.queue.onSubmittedWorkDone();
    const errors=[];
    for(const buffer of owner.buffers)if(buffer!==owner.keep){
      try{
        buffer.destroy();owner.buffers.delete(buffer);
        for(const [name,diag] of Object.entries(this._dinov2Diag??{}))if(diag===buffer)delete this._dinov2Diag[name];
      }catch(error){errors.push(error);}
    }
    if(errors.length)throw new AggregateError(errors,'DINO work-buffer retirement failed');
    this._capturedWorkOwner=null;
  }

  /**
   * Allocate work buffers and record patch embedding + SiLU(cameraEmbed) into
   * `encoder`. Returns the mutable context (work buffers + currentTokens
   * pointer) shared across the block loop.
   */
  _setupEncode(encoder, imageBuf, cameraEmbedBuf, weights) {
    const device = this.device;
    const D = VIT_CONFIG.dim;
    const ps = VIT_CONFIG.patchSize;
    const imgSize = 512;
    const tokenH = Math.floor(imgSize / ps); // 36 (512/14 = 36.57, DINOv2 uses floor)
    const tokenW = Math.floor(imgSize / ps);
    // numPatches = 36*36 = 1296, N = 1297 (with CLS)
    const numPatches = tokenH * tokenW;
    const N = numPatches + 1;
    const T = N * D;

    // Work buffers (device-owned; persist across all command buffers)
    const tokenBufA = createEmptyBuffer(device, T * 4);
    const tokenBufB = createEmptyBuffer(device, T * 4);
    const normBuf = createEmptyBuffer(device, T * 4);
    const qBuf = createEmptyBuffer(device, T * 4);
    const kBuf = createEmptyBuffer(device, T * 4);
    const vBuf = createEmptyBuffer(device, T * 4);
    const scoreBuf = createEmptyBuffer(device, VIT_CONFIG.numHeads * N * N * 4);
    const attnOutBuf = createEmptyBuffer(device, T * 4);
    const projBuf = createEmptyBuffer(device, T * 4);
    const hiddenBuf = createEmptyBuffer(device, N * VIT_CONFIG.mlpHiddenDim * 4);
    const ffnOutBuf = createEmptyBuffer(device, T * 4);
    const modBuf = createEmptyBuffer(device, 2 * D * 4); // modulation output [2*D]

    // 1. Patch embedding
    this._dispatchPatchEmbed(encoder, imageBuf, weights, tokenBufA, tokenH, tokenW);

    // Save patch embedding output for diagnostics
    {
      if (!this._dinov2Diag) this._dinov2Diag = {};
      const diagBuf = createEmptyBuffer(device, T * 4);
      encoder.copyBufferToBuffer(tokenBufA, 0, diagBuf, 0, T * 4);
      this._dinov2Diag['patchEmbed'] = diagBuf;
    }

    // Compute SiLU(cameraEmbed) once — PyTorch: linear2(silu(condition))
    const siluCameraEmbedBuf = createEmptyBuffer(device, 768 * 4);
    this._dispatchSiLU(encoder, cameraEmbedBuf, siluCameraEmbedBuf, 768);

    return {
      D, N, T, tokenH, tokenW,
      tokenBufA, tokenBufB, normBuf, qBuf, kBuf, vBuf, scoreBuf,
      attnOutBuf, projBuf, hiddenBuf, ffnOutBuf, modBuf, siluCameraEmbedBuf,
      currentTokens: tokenBufA,
    };
  }

  /**
   * Record one transformer block's dispatches into `encoder`, advancing
   * ctx.currentTokens through the ping-pong. Exact per-block body from the
   * pre-cooperative port; must remain byte-identical between encode() and
   * encodeCooperative().
   */
  _encodeBlock(encoder, l, ctx, weights) {
    const device = this.device;
    const { D, N, T, tokenBufA, tokenBufB, normBuf, qBuf, kBuf, vBuf, scoreBuf,
      attnOutBuf, projBuf, hiddenBuf, ffnOutBuf, modBuf, siluCameraEmbedBuf } = ctx;
    const block = weights.blocks[l];

    // Compute modulation for norm1: linear(silu(cameraEmbed)) → [2*D]
    this._dispatchLinear(encoder, siluCameraEmbedBuf, modBuf, block.norm1Mod.weight, block.norm1Mod.bias, 1, 768, 2 * D);

    // Modulated LayerNorm1
    this._dispatchModulatedLN(encoder, ctx.currentTokens, normBuf, block.norm1, modBuf, N);

    // Self-attention with separate Q/K/V projections
    this._dispatchLinear(encoder, normBuf, qBuf, block.attn.q.weight, block.attn.q.bias, N, D, D);
    this._dispatchLinear(encoder, normBuf, kBuf, block.attn.k.weight, block.attn.k.bias, N, D, D);
    this._dispatchLinear(encoder, normBuf, vBuf, block.attn.v.weight, block.attn.v.bias, N, D, D);

    // Attention
    this._dispatchAttnScores(encoder, qBuf, kBuf, scoreBuf, N);
    this._dispatchAttnSoftmax(encoder, scoreBuf, N);
    this._dispatchAttnApply(encoder, scoreBuf, vBuf, attnOutBuf, N);

    // Output projection
    this._dispatchLinear(encoder, attnOutBuf, projBuf, block.attn.proj.weight, block.attn.proj.bias, N, D, D);

    // LayerScale1 + residual
    const attnOut = (ctx.currentTokens === tokenBufA) ? tokenBufB : tokenBufA;
    this._dispatchLayerScaleResidual(encoder, projBuf, ctx.currentTokens, attnOut, block.layerScale1, T, D);
    ctx.currentTokens = attnOut;

    // Compute modulation for norm2: linear(silu(cameraEmbed)) → [2*D]
    this._dispatchLinear(encoder, siluCameraEmbedBuf, modBuf, block.norm2Mod.weight, block.norm2Mod.bias, 1, 768, 2 * D);

    // Modulated LayerNorm2
    this._dispatchModulatedLN(encoder, ctx.currentTokens, normBuf, block.norm2, modBuf, N);

    // GELU MLP: fc1 (linear + GELU) → fc2 (linear)
    this._dispatchLinearGelu(encoder, normBuf, hiddenBuf,
      block.mlp.fc1.weight, block.mlp.fc1.bias, N, D, VIT_CONFIG.mlpHiddenDim);
    this._dispatchLinear(encoder, hiddenBuf, ffnOutBuf,
      block.mlp.fc2.weight, block.mlp.fc2.bias, N, VIT_CONFIG.mlpHiddenDim, D);

    // LayerScale2 + residual
    const ffnOut = (ctx.currentTokens === tokenBufA) ? tokenBufB : tokenBufA;
    this._dispatchLayerScaleResidual(encoder, ffnOutBuf, ctx.currentTokens, ffnOut, block.layerScale2, T, D);
    ctx.currentTokens = ffnOut;

    // Save diagnostic refs for first few blocks
    if (l < 3 || l === 23) {
      if (!this._dinov2Diag) this._dinov2Diag = {};
      // Copy current state to a persistent buffer for readback
      const diagBuf = createEmptyBuffer(device, T * 4);
      encoder.copyBufferToBuffer(ctx.currentTokens, 0, diagBuf, 0, T * 4);
      this._dinov2Diag[`block${l}`] = diagBuf;
    }
  }

  /** Final LayerNorm + return the DINOv2 token output. */
  _finalizeEncode(encoder, ctx, weights) {
    const { N, normBuf, tokenH, tokenW } = ctx;

    // 3. Final LayerNorm
    this._dispatchLayerNorm(encoder, ctx.currentTokens, normBuf, weights.layernorm, N);

    // Output: normBuf contains [N, D] where N = 1297 (CLS + 1296 patches)
    // The backbone expects [N_tokens, D] — we return all tokens including CLS
    // The two-stream backbone will use this via permute to [C, N_t]
    return {
      tokensBuf: normBuf,
      N,
      tokenH,
      tokenW,
    };
  }

  // --- Dispatch helpers ---

  _dispatchPatchEmbed(encoder, imageBuf, weights, outputBuf, tokenH, tokenW) {
    const device = this.device;
    const D = VIT_CONFIG.dim;
    const ps = VIT_CONFIG.patchSize;
    const numTokens = tokenH * tokenW + 1;
    const totalWG = ceilDiv(numTokens * D, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);

    // imgH/imgW must be the ACTUAL image size (512), not tokenH*ps (504)
    // because the image buffer is [3, 512, 512] and channel offsets use imgH*imgW
    const imgSize = VIT_CONFIG.patchSize === 14 ? 512 : tokenH * ps; // TODO: pass actual image size
    const params = this._cachedUniform(new Uint32Array([
      imgSize, imgSize, ps, tokenH, tokenW, 3, D, numTokens, wgX,
    ]));

    const bg = device.createBindGroup({
      layout: this.pipelines.patchEmbed.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: imageBuf } },
        { binding: 2, resource: { buffer: weights.patchEmbed.weight } },
        { binding: 3, resource: { buffer: weights.patchEmbed.bias } },
        { binding: 4, resource: { buffer: weights.clsToken } },
        { binding: 5, resource: { buffer: weights.posEmbed } },
        { binding: 6, resource: { buffer: outputBuf } },
      ],
    });

    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.patchEmbed);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
  }

  _dispatchLinear(encoder, input, output, weight, bias, rows, inDim, outDim) {
    const device = this.device;
    const totalWG = ceilDiv(rows * outDim, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const params = this._cachedUniform(new Uint32Array([rows, inDim, outDim, wgX, 1]));

    const bg = device.createBindGroup({
      layout: this.pipelines.linear.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: input } },
        { binding: 2, resource: { buffer: weight } },
        { binding: 3, resource: { buffer: bias } },
        { binding: 4, resource: { buffer: output } },
      ],
    });

    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.linear);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
  }

  _dispatchLayerNorm(encoder, input, output, norm, N) {
    const device = this.device;
    const D = VIT_CONFIG.dim;
    const paramsData = new ArrayBuffer(16);
    const v = new DataView(paramsData);
    v.setUint32(0, N, true);
    v.setUint32(4, D, true);
    v.setFloat32(8, VIT_CONFIG.eps, true);
    const params = this._cachedUniform(new Uint8Array(paramsData));

    const bg = device.createBindGroup({
      layout: this.pipelines.layerNorm.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: input } },
        { binding: 2, resource: { buffer: norm.weight } },
        { binding: 3, resource: { buffer: norm.bias } },
        { binding: 4, resource: { buffer: output } },
      ],
    });

    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.layerNorm);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(N);
    pass.end();
  }

  _dispatchModulatedLN(encoder, input, output, norm, modBuf, N) {
    const device = this.device;
    const D = VIT_CONFIG.dim;
    const params = this._cachedUniform(new Uint32Array([N, D, 0]));

    const bg = device.createBindGroup({
      layout: this.pipelines.modulatedLN.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: input } },
        { binding: 2, resource: { buffer: norm.weight } },
        { binding: 3, resource: { buffer: norm.bias } },
        { binding: 4, resource: { buffer: modBuf } },
        { binding: 5, resource: { buffer: output } },
      ],
    });

    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.modulatedLN);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(N);
    pass.end();
  }

  _dispatchAttnScores(encoder, qBuf, kBuf, scoreBuf, N) {
    const device = this.device;
    const { numHeads, dim, headDim, scale } = VIT_CONFIG;
    const total = numHeads * N * N;
    const totalWG = ceilDiv(total, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);

    const paramsData = new ArrayBuffer(24);
    const v = new DataView(paramsData);
    v.setUint32(0, N, true);
    v.setUint32(4, dim, true);
    v.setUint32(8, numHeads, true);
    v.setUint32(12, headDim, true);
    v.setFloat32(16, scale, true);
    v.setUint32(20, wgX, true);
    const params = this._cachedUniform(new Uint8Array(paramsData));

    const bg = device.createBindGroup({
      layout: this.pipelines.attnScores.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: qBuf } },
        { binding: 2, resource: { buffer: kBuf } },
        { binding: 3, resource: { buffer: scoreBuf } },
      ],
    });

    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.attnScores);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
  }

  _dispatchAttnSoftmax(encoder, scoreBuf, N) {
    const totalRows = VIT_CONFIG.numHeads * N;
    const totalWG = ceilDiv(totalRows, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const params = this._cachedUniform(new Uint32Array([N, VIT_CONFIG.numHeads, wgX]));

    const bg = this.device.createBindGroup({
      layout: this.pipelines.attnSoftmax.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: scoreBuf } },
      ],
    });

    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.attnSoftmax);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
  }

  _dispatchAttnApply(encoder, scoreBuf, vBuf, output, N) {
    const D = VIT_CONFIG.dim;
    const totalWG = ceilDiv(N * D, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const params = this._cachedUniform(new Uint32Array([N, D, VIT_CONFIG.numHeads, VIT_CONFIG.headDim, wgX]));

    const bg = this.device.createBindGroup({
      layout: this.pipelines.attnApply.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: scoreBuf } },
        { binding: 2, resource: { buffer: vBuf } },
        { binding: 3, resource: { buffer: output } },
      ],
    });

    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.attnApply);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
  }

  _dispatchLayerScaleResidual(encoder, input, residual, output, gamma, count, D) {
    const totalWG = ceilDiv(count, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const params = this._cachedUniform(new Uint32Array([count, D, wgX]));

    const bg = this.device.createBindGroup({
      layout: this.pipelines.layerScale.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: input } },
        { binding: 2, resource: { buffer: gamma } },
        { binding: 3, resource: { buffer: residual } },
        { binding: 4, resource: { buffer: output } },
      ],
    });

    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.layerScale);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
  }

  _dispatchLinearGelu(encoder, input, output, weight, bias, rows, inDim, outDim) {
    const totalWG = ceilDiv(rows * outDim, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const params = this._cachedUniform(new Uint32Array([rows, inDim, outDim, wgX, 1]));

    const bg = this.device.createBindGroup({
      layout: this.pipelines.linearGelu.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: input } },
        { binding: 2, resource: { buffer: weight } },
        { binding: 3, resource: { buffer: bias } },
        { binding: 4, resource: { buffer: output } },
      ],
    });

    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.linearGelu);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
  }
  _dispatchSiLU(encoder, input, output, count) {
    const totalWG = ceilDiv(count, WG_SIZE);
    const [wgX, wgY] = splitWG(totalWG);
    const params = this._cachedUniform(new Uint32Array([count, 1, wgX])); // op=1 is SiLU
    const dummyBuf = createEmptyBuffer(this.device, 4);

    const bg = this.device.createBindGroup({
      layout: this.pipelines.activation.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: params } },
        { binding: 1, resource: { buffer: input } },
        { binding: 2, resource: { buffer: dummyBuf } },
        { binding: 3, resource: { buffer: output } },
      ],
    });

    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipelines.activation);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
  }
}

export { VIT_CONFIG };

export const VIT_NUM_BLOCKS = VIT_CONFIG.numLayers;

/**
 * Deterministically record the canonical DINO orchestration trace, GPU-free.
 *
 * This is the single source of truth for both the cooperative-DINO contract test
 * and the conformance-adapter fingerprint. It stubs the tokenizer's GPU-touching
 * _dispatch* helpers to append ordered ops (op name + source/dest buffer
 * identity — the data flow that determines numerics), then walks the EXACT
 * _setupEncode -> per-block _encodeBlock -> _finalizeEncode sequence, cut into
 * the same fixed chunks the real cooperative driver uses.
 *
 * @param {object} o
 * @param {number} o.numBlocks
 * @param {number} o.chunkBlocks
 * @param {(blockStart:number, blockEnd:number, recordChunkOps:()=>void)=>Promise<void>} [o.driver]
 *   Optional. When provided (conformance path), the caller's shared boundary
 *   driver is invoked once per chunk with a `recordChunkOps` callback that emits
 *   that chunk's block ops in order. When absent (pure fingerprint path), chunks
 *   are walked directly. Either way the recorded trace is identical.
 * @returns {{ chunks: Array<{blockStart:number,blockEnd:number,ops:Array<{op:string,input:(number|null),output:(number|null)}>}>, output: {N:number,tokenH:number,tokenW:number,dim:number} } | Promise<...>}
 *   Returns a plain object when no driver is given; returns a Promise when a
 *   (potentially async) driver is given.
 */
export function recordDinoDispatchTrace({ numBlocks, chunkBlocks, driver }) {
  if (numBlocks !== VIT_CONFIG.numLayers) {
    throw new Error(`recordDinoDispatchTrace numBlocks ${numBlocks} must equal ${VIT_CONFIG.numLayers}`);
  }
  globalThis.GPUBufferUsage = globalThis.GPUBufferUsage || {
    STORAGE: 1, COPY_SRC: 2, COPY_DST: 4, MAP_READ: 8, UNIFORM: 16,
  };

  let bufSeq = 0;
  const mkBuf = (tag) => ({ __buf: tag, id: bufSeq++ });

  const tok = Object.create(SF3DImageTokenizer.prototype);
  tok.device = { createBuffer: () => mkBuf('empty') };
  tok._uniformCache = new Map();

  // Ops for the CURRENT chunk are appended here; flushed into `chunks`.
  let currentOps = null;
  const rec = (op) => (...args) => {
    const input = args[1]?.__buf ? args[1].id : null;
    const output = args[2]?.__buf ? args[2].id : null;
    currentOps.push({ op, input, output });
  };
  for (const name of [
    '_dispatchPatchEmbed', '_dispatchSiLU', '_dispatchLinear', '_dispatchModulatedLN',
    '_dispatchAttnScores', '_dispatchAttnSoftmax', '_dispatchAttnApply',
    '_dispatchLayerScaleResidual', '_dispatchLinearGelu', '_dispatchLayerNorm',
  ]) {
    tok[name] = rec(name);
  }

  const recEncoder = { __id: 'trace', copyBufferToBuffer() {}, finish() { return {}; } };
  const imageBuf = { __buf: 'image', id: -1 };
  const camBuf = { __buf: 'cam', id: -2 };
  const weights = makeTraceWeights(numBlocks);
  const chunks = [];

  // Setup ops belong to the first chunk. We open the first chunk, run setup,
  // then encode blocks chunk by chunk, then finalize into the last chunk.
  const ctx = (() => {
    currentOps = [];
    const c = tok._setupEncode(recEncoder, imageBuf, camBuf, weights);
    return c;
  })();

  const emitChunk = (start, end) => {
    // On the first chunk, currentOps already holds the setup ops; otherwise open fresh.
    if (start !== 0) currentOps = [];
    for (let l = start; l < end; l++) tok._encodeBlock(recEncoder, l, ctx, weights);
    let output = null;
    if (end === numBlocks) {
      const r = tok._finalizeEncode(recEncoder, ctx, weights);
      output = { N: r.N, tokenH: r.tokenH, tokenW: r.tokenW, dim: VIT_CONFIG.dim };
    }
    chunks.push({ blockStart: start, blockEnd: end, ops: currentOps, _output: output });
  };

  const finish = () => {
    const output = chunks.find(c => c._output)?._output || null;
    for (const c of chunks) delete c._output;
    return { chunks, output };
  };

  if (!driver) {
    for (let start = 0; start < numBlocks; start += chunkBlocks) {
      emitChunk(start, Math.min(start + chunkBlocks, numBlocks));
    }
    return finish();
  }

  // Driver path (conformance): the caller's shared boundary driver invokes the
  // per-chunk callback in order; may be async. Returns a Promise.
  return (async () => {
    for (let start = 0; start < numBlocks; start += chunkBlocks) {
      const end = Math.min(start + chunkBlocks, numBlocks);
      // eslint-disable-next-line no-await-in-loop
      await driver(start, end, () => emitChunk(start, end));
    }
    return finish();
  })();
}

function makeTraceWeights(numBlocks) {
  const lin = () => ({ weight: { __buf: 'w', id: 900 }, bias: { __buf: 'b', id: 901 } });
  const block = {
    norm1Mod: lin(), norm2Mod: lin(), norm1: lin(), norm2: lin(),
    attn: { q: lin(), k: lin(), v: lin(), proj: lin() },
    mlp: { fc1: lin(), fc2: lin() },
    layerScale1: { __buf: 'ls', id: 902 }, layerScale2: { __buf: 'ls', id: 903 },
  };
  return { blocks: Array.from({ length: numBlocks }, () => block), layernorm: lin() };
}
