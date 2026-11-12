/**
 * clip_estimator.js — CLIP-based material property estimator for SF3D.
 *
 * Runs CLIP ViT-B/32 visual encoder on the input image, then two small MLP
 * heads to predict roughness and metallic as beta distribution modes.
 *
 * Architecture:
 *   - Patch embedding: 32×32 stride-32 conv → 49 patches of 768d
 *   - CLS token prepend → 50 tokens
 *   - 12 transformer blocks: LN → fused QKV attention (12 heads) → LN → MLP (GELU)
 *   - LN → CLS token → visual projection (768→512)
 *   - Two MLP heads: shared 3-layer (512→512, ReLU) → two branches → beta params → mode
 */

import { createStorageBuffer, createEmptyBuffer, readBuffer } from './gpu.js';
import { createWebGpuResourceCaches } from '@kaminos/webgpu-inference-kit';
import { callWorker } from './worker_call.js';
import { withForegroundScope } from './foreground_scope.js';
import {
  clipPrepWeightsFrom,
  prepareClipEmbeddings,
  validateClipEmbeddings,
  validateClipPrepWeights,
} from './clip_prep_core.js';

const HIDDEN_DIM = 768;
const NUM_HEADS = 12;
const HEAD_DIM = 64;
const MLP_DIM = 3072;
const NUM_BLOCKS = 12;
const NUM_TOKENS = 50; // 49 patches + CLS
const PROJ_DIM = 512;
const WG_SIZE = 256;


// Pipelines can be shared only within one device. Weight bindings additionally
// belong to one weight-set identity; neither cache owns the buffers returned
// by an accessor (an injected accessor may return host-owned resources).
const _pipelinePromises = new WeakMap();
const _deviceWeightBuffers = new WeakMap();

// PeerCompute bundles trusted WGSL with the managed worker; no shader fetches.
import clipLinearSource from '../shaders/linear.wgsl?raw';
import clipLayernormSource from '../shaders/layernorm_vit.wgsl?raw';
export function resolveClipShaderUrls() { return { linear: 'bundled:linear', layernorm: 'bundled:layernorm' }; }
export async function loadClipShaderSources() {
  return Object.freeze({ linear: clipLinearSource, layernorm: clipLayernormSource });
}

export async function createValidatedClipPipeline(device, source, shaderUrl) {
  try {
    device.pushErrorScope('validation');
  } catch (error) {
    throw new Error(
      `CLIP shader validation scope setup failed for ${shaderUrl}: ${error?.message || error}`,
      { cause: error },
    );
  }

  let pipeline = null;
  let failure = null;
  try {
    const module = device.createShaderModule({
      code: source,
      label: `SF3D CLIP ${shaderUrl}`,
    });
    if (typeof module.getCompilationInfo === 'function') {
      const info = await module.getCompilationInfo();
      const errors = (info.messages || []).filter(message => message.type === 'error');
      if (errors.length) {
        const detail = errors.map(message => (
          `${message.lineNum || '?'}:${message.linePos || '?'} ${message.message}`
        )).join('; ');
        throw new Error(`CLIP shader compilation failed for ${shaderUrl}: ${detail}`);
      }
    }
    pipeline = device.createComputePipeline({
      layout: 'auto',
      compute: { module, entryPoint: 'main' },
    });
  } catch (error) {
    failure = error;
  }

  let validationError = null;
  let scopeFailure = null;
  try {
    validationError = await device.popErrorScope();
  } catch (error) {
    scopeFailure = error;
  }

  if (failure || scopeFailure) {
    const detail = [
      failure ? `operation failed: ${failure.message || failure}` : null,
      scopeFailure ? `validation scope pop failed: ${scopeFailure.message || scopeFailure}` : null,
    ].filter(Boolean).join('; ');
    throw new Error(
      `CLIP shader pipeline failed for ${shaderUrl}: ${detail}`,
      { cause: failure || scopeFailure },
    );
  }
  if (validationError) {
    throw new Error(`CLIP shader validation failed for ${shaderUrl}: ${validationError.message || validationError}`);
  }
  return pipeline;
}

function ceilDiv(a, b) { return Math.ceil(a / b); }
function splitWG(total) {
  const maxX = 65535;
  if (total <= maxX) return [total, 1];
  return [maxX, ceilDiv(total, maxX)];
}

async function _ensurePipelines(device) {
  let pending = _pipelinePromises.get(device);
  if (!pending) {
    pending = (async () => {
      const urls = resolveClipShaderUrls();
      const sources = await loadClipShaderSources();
      return {
        linear: await createValidatedClipPipeline(device, sources.linear, urls.linear),
        layernorm: await createValidatedClipPipeline(device, sources.layernorm, urls.layernorm),
      };
    })();
    _pipelinePromises.set(device, pending);
    pending.catch(() => {
      if (_pipelinePromises.get(device) === pending) _pipelinePromises.delete(device);
    });
  }
  return pending;
}

function _ensureWeightBuffers(device, weights) {
  weights._assertActive?.(device);
  let cache = _deviceWeightBuffers.get(device);
  if (!cache) {
    cache = new WeakMap();
    _deviceWeightBuffers.set(device, cache);
  }
  if (cache.has(weights)) return cache.get(weights);
  const buffers = {};

  const makeGPU = (name) => weights._rawGet(name);

  // Visual encoder weights
  buffers.lnPre = { weight: makeGPU('image_estimator.model.visual.ln_pre.weight'),
                           bias: makeGPU('image_estimator.model.visual.ln_pre.bias') };
  buffers.lnPost = { weight: makeGPU('image_estimator.model.visual.ln_post.weight'),
                            bias: makeGPU('image_estimator.model.visual.ln_post.bias') };

  buffers.blocks = [];
  for (let i = 0; i < NUM_BLOCKS; i++) {
    const p = `image_estimator.model.visual.transformer.resblocks.${i}`;
    buffers.blocks.push({
      ln1: { weight: makeGPU(`${p}.ln_1.weight`), bias: makeGPU(`${p}.ln_1.bias`) },
      ln2: { weight: makeGPU(`${p}.ln_2.weight`), bias: makeGPU(`${p}.ln_2.bias`) },
      qkv: { weight: makeGPU(`${p}.attn.in_proj_weight`), bias: makeGPU(`${p}.attn.in_proj_bias`) },
      outProj: { weight: makeGPU(`${p}.attn.out_proj.weight`), bias: makeGPU(`${p}.attn.out_proj.bias`) },
      fc: { weight: makeGPU(`${p}.mlp.c_fc.weight`), bias: makeGPU(`${p}.mlp.c_fc.bias`) },
      proj: { weight: makeGPU(`${p}.mlp.c_proj.weight`), bias: makeGPU(`${p}.mlp.c_proj.bias`) },
    });
  }
  // Publish only a complete set. On failure, loader-created allocations remain
  // owned by the loader and reusable on retry; borrowed accessors stay borrowed.
  cache.set(weights, buffers);
  return buffers;
}

/**
 * Run CLIP material estimation on an image.
 *
 * @param {Uint8ClampedArray|Uint8Array} rgba8  cond-size (512×512) RGBA bytes
 *   straight from canvas getImageData — the alpha blend, 512→224 resize, and
 *   patch embedding happen in clip_prep_core (main thread) or, when
 *   options.clipPrepWorker is supplied, on that Worker with byte-identical
 *   output. The CPU prep is ~115M multiply-adds; inline it was the route's
 *   second-largest contiguous main-thread stall (~240ms).
 */
export async function estimateMaterials(device, rgba8, imgWidth, imgHeight, weights, options = {}) {
  weights._assertActive?.(device);
  const pipelines = await _ensurePipelines(device);
  const weightBuffers = _ensureWeightBuffers(device, weights);

  // Step 1: CPU preprocessing — blend, resize to 224, normalize, patch embed
  const embeddings = options.clipPrepWorker
    ? await withForegroundScope(options, 'clip-prep-worker', () => runClipPrep(
        options.clipPrepWorker, rgba8, imgWidth, imgHeight, weights,
        { timeoutMs: options.workerTimeoutMs }))
    : validateClipEmbeddings(prepareClipEmbeddings(rgba8, imgWidth, imgHeight, clipPrepWeightsFrom(weights)));

  // Step 2: Visual transformer (CPU fp32 for precision, GPU for speed)
  const USE_CPU_TRANSFORMER = false; // GPU path enabled with fp32 weights
  const features = USE_CPU_TRANSFORMER
    ? _runVisualTransformerCPU(embeddings, weights)
    : await _runVisualTransformer(device, embeddings, weights, pipelines, weightBuffers);

  // Step 3: CPU heads (tiny)
  const roughness = _runHead(features, weights, 'roughness');
  const metallic = _runHead(features, weights, 'metallic');

  console.log(`CLIP material estimation: roughness=${roughness.toFixed(3)}, metallic=${metallic.toFixed(3)}`);
  return { roughness, metallic, prepOffloaded: Boolean(options.clipPrepWorker) };
}

// A CLIP-preparation worker owns one copied 9.4 MB-ish preparation-weight set
// at a time. Its cache therefore belongs to *both* the worker and the source
// weight-set identity. Calls through one worker are serialized: a replacement
// init cannot overwrite the tensors under an earlier preparation request.
const _clipPrepState = new WeakMap();

function clipPrepStateFor(worker) {
  let state = _clipPrepState.get(worker);
  if (!state) {
    state = { tail: Promise.resolve(), weightIdentity: null, owners: new Map() };
    _clipPrepState.set(worker, state);
  }
  return state;
}

function queueClipPrep(state, operation) {
  const queued = state.tail.catch(() => undefined).then(operation);
  state.tail = queued;
  return queued;
}

/**
 * Register a producer's use of an injected CLIP-preparation worker. The
 * registration lets producer disposal reset only a cache no sibling producer
 * still owns; it never terminates a host-owned worker or destroys its weights.
 */
export function retainClipPrepWorker(worker, weights) {
  if (!worker) return;
  const state = clipPrepStateFor(worker);
  state.owners.set(weights, (state.owners.get(weights) || 0) + 1);
}

/**
 * Release the copied preparation tensors installed by one producer. This is
 * intentionally an acknowledged worker operation, after the caller's run and
 * foreground drain; clearing the loader's raw map alone cannot release bytes
 * already transferred to a borrowed worker.
 */
export async function releaseClipPrepWorker(worker, weights, { timeoutMs = 30000 } = {}) {
  if (!worker) return;
  const state = clipPrepStateFor(worker);
  const owners = state.owners.get(weights) || 0;
  if (owners > 1) state.owners.set(weights, owners - 1);
  else state.owners.delete(weights);
  return queueClipPrep(state, async () => {
    if (state.weightIdentity !== weights || state.owners.has(weights)) return;
    // The worker clears its tensors before acknowledging reset. A rejected,
    // malformed, or lost reply therefore cannot prove that the old binding
    // remains installed; invalidate the parent model before sending the request
    // so same-identity reuse must initialize again even when this rejects.
    state.weightIdentity = null;
    await callWorker(
      worker,
      { type: 'reset', id: `clip-reset-${Math.random().toString(36).slice(2)}` },
      [],
      { timeoutMs, onResult: (d) => { if (d.reset !== true) throw new Error('clip prep reset not acknowledged'); return true; } },
    );
  });
}

/**
 * Run the CLIP CPU prep on a Worker (clip_prep_worker.js). Fail-loud through
 * callWorker: crash / malformed reply / wedge rejects; never falls back to the
 * main thread silently. The caller's rgba8 is copied, not detached.
 */
export async function runClipPrep(worker, rgba8, width, height, weights, { timeoutMs = 30000 } = {}) {
  const state = clipPrepStateFor(worker);
  return queueClipPrep(state, async () => {
    if (state.weightIdentity !== weights) {
      const prep = weights && typeof weights._rawGetCPU === 'function'
        ? clipPrepWeightsFrom(weights)
        : validateClipPrepWeights(weights);
      const conv1W = prep.conv1W.slice().buffer;
      const classEmb = prep.classEmb.slice().buffer;
      const posEmb = prep.posEmb.slice().buffer;
      try {
        await callWorker(
          worker,
          { type: 'init', id: `clip-init-${Math.random().toString(36).slice(2)}`, conv1W, classEmb, posEmb },
          [conv1W, classEmb, posEmb],
          { timeoutMs, onResult: (d) => { if (d.initialized !== true) throw new Error('clip prep init not acknowledged'); return true; } },
        );
        state.weightIdentity = weights;
      } catch (error) {
        // Worker init revokes its old set before validating the replacement;
        // never let the caller model a failed swap as still bound to the old one.
        state.weightIdentity = null;
        throw error;
      }
    }
    const bytes = (rgba8 instanceof Uint8ClampedArray || rgba8 instanceof Uint8Array)
      ? rgba8 : new Uint8ClampedArray(rgba8);
    const rgba = bytes.slice().buffer;
    return await callWorker(
      worker,
      { id: `clip-prep-${Math.random().toString(36).slice(2)}`, rgba, width, height },
      [rgba],
      { timeoutMs, onResult: (d) => validateClipEmbeddings(new Float32Array(d.embeddings)) },
    );
  });
}

// Inline CLIP shaders (add / GELU / fused attention) bake their sizes into the
// WGSL, so each is compiled once per device via the kit's resource caches
// instead of once per block per run (36+ synchronous pipeline compiles on the
// main thread per estimate).
const _clipCaches = new WeakMap();
export function getClipInlinePipeline(device, label, code) {
  let caches = _clipCaches.get(device);
  if (!caches) {
    caches = createWebGpuResourceCaches(device);
    _clipCaches.set(device, caches);
  }
  const module = caches.getShaderModule(label, code);
  return caches.getComputePipeline(label, {
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });
}

function _runVisualTransformerCPU(embeddings, weights) {
  const N = NUM_TOKENS, D = HIDDEN_DIM;
  const g = (n) => weights._rawGetCPU(n);
  let x = new Float32Array(embeddings);

  // Pre-LN
  x = _cpuLayerNorm(x, N, D, g('image_estimator.model.visual.ln_pre.weight'), g('image_estimator.model.visual.ln_pre.bias'));
  for (let b = 0; b < NUM_BLOCKS; b++) {
    const p = `image_estimator.model.visual.transformer.resblocks.${b}`;

    // LN1
    const ln1 = _cpuLayerNorm(x, N, D, g(`${p}.ln_1.weight`), g(`${p}.ln_1.bias`));

    // Fused QKV: [N, D] × [D, 3D] → [N, 3D]
    // in_proj_weight is NOT transposed by converter (no .weight suffix)
    const qkv = _cpuMatmulBias(ln1, N, D, 3*D, g(`${p}.attn.in_proj_weight`), g(`${p}.attn.in_proj_bias`), false);

    // Self-attention
    const attnOut = _cpuFusedAttn(qkv, N, NUM_HEADS, HEAD_DIM);

    // Out proj — transposed by converter (.weight suffix)
    const proj = _cpuMatmulBias(attnOut, N, D, D, g(`${p}.attn.out_proj.weight`), g(`${p}.attn.out_proj.bias`), true);

    // Residual
    x = _cpuAdd(x, proj);

    // LN2
    const ln2 = _cpuLayerNorm(x, N, D, g(`${p}.ln_2.weight`), g(`${p}.ln_2.bias`));

    // MLP — both transposed by converter (.weight suffix)
    const fc = _cpuMatmulBias(ln2, N, D, MLP_DIM, g(`${p}.mlp.c_fc.weight`), g(`${p}.mlp.c_fc.bias`), true);
    const gelu = _cpuGelu(fc);
    const mlpOut = _cpuMatmulBias(gelu, N, MLP_DIM, D, g(`${p}.mlp.c_proj.weight`), g(`${p}.mlp.c_proj.bias`), true);

    x = _cpuAdd(x, mlpOut);
  }

  // Post-LN
  x = _cpuLayerNorm(x, N, D, g('image_estimator.model.visual.ln_post.weight'), g('image_estimator.model.visual.ln_post.bias'));

  // CLS → project: converter transposed visual.proj from [768, 512] to [512, 768]
  const cls = x.slice(0, D);
  const projW = g('image_estimator.model.visual.proj');
  const features = new Float32Array(PROJ_DIM);
  for (let d = 0; d < PROJ_DIM; d++) {
    let sum = 0;
    for (let k = 0; k < D; k++) sum += cls[k] * projW[d * D + k];
    features[d] = sum;
  }
  return features;
}

function _cpuLayerNorm(x, N, D, weight, bias) {
  const out = new Float32Array(N * D);
  for (let n = 0; n < N; n++) {
    let mean = 0;
    for (let d = 0; d < D; d++) mean += x[n * D + d];
    mean /= D;
    let variance = 0;
    for (let d = 0; d < D; d++) { const diff = x[n*D+d] - mean; variance += diff * diff; }
    variance /= D;
    const invStd = 1.0 / Math.sqrt(variance + 1e-5);
    for (let d = 0; d < D; d++) {
      out[n*D+d] = (x[n*D+d] - mean) * invStd * weight[d] + bias[d];
    }
  }
  return out;
}

function _cpuMatmulBias(x, rows, inDim, outDim, weight, bias, transposed = false) {
  // Weight layout depends on whether the converter transposed this tensor:
  //   transposed=false: [outDim, inDim] (PyTorch native F.linear layout)
  //     output[r, o] = sum_k x[r, k] * weight[o * inDim + k] + bias[o]
  //   transposed=true: [inDim, outDim] (converter did .T for WebGPU shaders)
  //     output[r, o] = sum_k x[r, k] * weight[k * outDim + o] + bias[o]
  const out = new Float32Array(rows * outDim);
  for (let r = 0; r < rows; r++) {
    for (let o = 0; o < outDim; o++) {
      let sum = bias[o];
      if (transposed) {
        for (let k = 0; k < inDim; k++) sum += x[r*inDim+k] * weight[k*outDim+o];
      } else {
        for (let k = 0; k < inDim; k++) sum += x[r*inDim+k] * weight[o*inDim+k];
      }
      out[r*outDim+o] = sum;
    }
  }
  return out;
}

function _cpuFusedAttn(qkv, N, numHeads, headDim) {
  const D = numHeads * headDim;
  const scale = 1.0 / Math.sqrt(headDim);
  const out = new Float32Array(N * D);
  for (let h = 0; h < numHeads; h++) {
    for (let qi = 0; qi < N; qi++) {
      // Compute scores
      const scores = new Float32Array(N);
      let maxS = -Infinity;
      for (let ki = 0; ki < N; ki++) {
        let s = 0;
        for (let d = 0; d < headDim; d++) {
          s += qkv[qi*3*D + h*headDim + d] * qkv[ki*3*D + D + h*headDim + d];
        }
        scores[ki] = s * scale;
        if (scores[ki] > maxS) maxS = scores[ki];
      }
      // Softmax
      let sumE = 0;
      for (let ki = 0; ki < N; ki++) { scores[ki] = Math.exp(scores[ki] - maxS); sumE += scores[ki]; }
      const inv = 1.0 / sumE;
      // Weighted sum of V
      for (let d = 0; d < headDim; d++) {
        let val = 0;
        for (let ki = 0; ki < N; ki++) {
          val += scores[ki] * inv * qkv[ki*3*D + 2*D + h*headDim + d];
        }
        out[qi*D + h*headDim + d] = val;
      }
    }
  }
  return out;
}

function _cpuAdd(a, b) {
  const out = new Float32Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[i] + b[i];
  return out;
}

function _cpuGelu(x) {
  const out = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) {
    const v = x[i];
    // Exact GELU using erf approximation (Abramowitz & Stegun)
    const absv = Math.abs(v * 0.7071067811865476);
    const t = 1.0 / (1.0 + 0.3275911 * absv);
    const erf = 1.0 - (((((1.061405429*t - 1.453152027)*t) + 1.421413741)*t - 0.284496736)*t + 0.254829592)*t * Math.exp(-absv*absv);
    const erfVal = v >= 0 ? erf : -erf;
    out[i] = v * 0.5 * (1.0 + erfVal);
  }
  return out;
}

async function _runVisualTransformer(device, embeddings, weights, pipelines, weightBuffers) {
  const N = NUM_TOKENS, D = HIDDEN_DIM;

  let xBuf = createStorageBuffer(device, new Float32Array(embeddings));
  let encoder = device.createCommandEncoder();

  // Pre-LN
  xBuf = _dispatchLN(encoder, device, xBuf, N, D, weightBuffers.lnPre, pipelines);

  for (let b = 0; b < NUM_BLOCKS; b++) {
    xBuf = encodeClipVisualPhase(encoder, device, xBuf, weightBuffers.blocks[b], pipelines, 'block');
  }

  // Post-LN
  xBuf = _dispatchLN(encoder, device, xBuf, N, D, weightBuffers.lnPost, pipelines);

  device.queue.submit([encoder.finish()]);
  await device.queue.onSubmittedWorkDone();

  // Read CLS token, project to 512d on CPU
  const allTokens = await readBuffer(device, xBuf, N * D * 4);
  const cls = allTokens.slice(0, D);

  // visual.proj: PyTorch [768, 512], converter transposed to [512, 768]
  // output[d] = sum_k cls[k] * proj_transposed[d * 768 + k]
  const projW = weights._rawGetCPU('image_estimator.model.visual.proj');
  return projectClipFeatures(allTokens, projW);
}

/** Same complete GPU block used by ordinary and computation-bound consumers. */
export function encodeClipVisualPhase(encoder,device,input,weights,pipelines,phase){
  const N=NUM_TOKENS,D=HIDDEN_DIM;
  if(phase==='pre'||phase==='post')return _dispatchLN(encoder,device,input,N,D,weights,pipelines);
  if(phase!=='block')throw TypeError('canonical visual phase required');
  const ln1=_dispatchLN(encoder,device,input,N,D,weights.ln1,pipelines);
  const qkv=_dispatchLinear(encoder,device,ln1,N,D,3*D,weights.qkv,false,pipelines);
  const attn=_dispatchFusedAttn(encoder,device,qkv,N);
  const proj=_dispatchLinear(encoder,device,attn,N,D,D,weights.outProj,true,pipelines);
  const residual=_dispatchAdd(encoder,device,input,proj,N*D);
  const ln2=_dispatchLN(encoder,device,residual,N,D,weights.ln2,pipelines);
  const fc=_dispatchLinear(encoder,device,ln2,N,D,MLP_DIM,weights.fc,true,pipelines);
  const gelu=_dispatchGelu(encoder,device,fc,N*MLP_DIM);
  const mlp=_dispatchLinear(encoder,device,gelu,N,MLP_DIM,D,weights.proj,true,pipelines);
  return _dispatchAdd(encoder,device,residual,mlp,N*D);
}

export async function createClipResidentPipelines(device,owner){
  if(!Array.isArray(owner?.allocations))throw TypeError('reachable resident CLIP inventory required');
  return {...await _ensurePipelines(device),residentOwner:owner};
}

export function projectClipFeatures(allTokens,projW){
  const D=HIDDEN_DIM;
  if(!(allTokens instanceof Float32Array)||allTokens.length!==NUM_TOKENS*D||
    !(projW instanceof Float32Array)||projW.length!==PROJ_DIM*D)throw TypeError('complete canonical CLIP projection shape required');
  const cls=allTokens.subarray(0,D);
  const features = new Float32Array(PROJ_DIM);
  for (let d = 0; d < PROJ_DIM; d++) {
    let sum = 0;
    for (let k = 0; k < D; k++) sum += cls[k] * projW[d * D + k];
    features[d] = sum;
  }
  return features;
}

export const runClipMaterialHead=_runHead;

// --- GPU dispatch helpers ---

function _dispatchLinear(encoder, device, input, rows, inDim, outDim, w, transposed, pipelines) {
  const totalWG = ceilDiv(rows * outDim, WG_SIZE);
  const [wgX, wgY] = splitWG(totalWG);
  const params = device.createBuffer({ size: 32, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  pipelines.residentOwner?.allocations.push({buffer:params,size:32});
  device.queue.writeBuffer(params, 0, new Uint32Array([rows, inDim, outDim, wgX, transposed ? 1 : 0]));
  const output = createEmptyBuffer(device, rows * outDim * 4);
  const bg = device.createBindGroup({
    layout: pipelines.linear.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: params } },
      { binding: 1, resource: { buffer: input } },
      { binding: 2, resource: { buffer: w.weight } },
      { binding: 3, resource: { buffer: w.bias } },
      { binding: 4, resource: { buffer: output } },
    ],
  });
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipelines.linear);
  pass.setBindGroup(0, bg);
  pass.dispatchWorkgroups(wgX, wgY);
  pass.end();
  return output;
}

function _dispatchLN(encoder, device, input, N, D, norm, pipelines) {
  const paramsData = new ArrayBuffer(16);
  const v = new DataView(paramsData);
  v.setUint32(0, N, true);
  v.setUint32(4, D, true);
  v.setFloat32(8, 1e-5, true);
  const params = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  pipelines.residentOwner?.allocations.push({buffer:params,size:16});
  device.queue.writeBuffer(params, 0, new Uint8Array(paramsData));
  const output = createEmptyBuffer(device, N * D * 4);
  const bg = device.createBindGroup({
    layout: pipelines.layernorm.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: params } },
      { binding: 1, resource: { buffer: input } },
      { binding: 2, resource: { buffer: norm.weight } },
      { binding: 3, resource: { buffer: norm.bias } },
      { binding: 4, resource: { buffer: output } },
    ],
  });
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipelines.layernorm);
  pass.setBindGroup(0, bg);
  pass.dispatchWorkgroups(N);
  pass.end();
  return output;
}

function _dispatchAdd(encoder, device, a, b, count) {
  const shaderCode = `
    @group(0) @binding(0) var<storage, read> a: array<f32>;
    @group(0) @binding(1) var<storage, read> b: array<f32>;
    @group(0) @binding(2) var<storage, read_write> out: array<f32>;
    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let i = gid.x;
      if (i >= ${count}u) { return; }
      out[i] = a[i] + b[i];
    }
  `;
  const pipeline = getClipInlinePipeline(device, 'sf3d.clip.add', shaderCode);
  const output = createEmptyBuffer(device, count * 4);
  const bg = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: a } },
      { binding: 1, resource: { buffer: b } },
      { binding: 2, resource: { buffer: output } },
    ],
  });
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bg);
  pass.dispatchWorkgroups(ceilDiv(count, 256));
  pass.end();
  return output;
}

function _dispatchGelu(encoder, device, input, count) {
  const shaderCode = `
    @group(0) @binding(0) var<storage, read> inp: array<f32>;
    @group(0) @binding(1) var<storage, read_write> out: array<f32>;
    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let i = gid.x;
      if (i >= ${count}u) { return; }
      let x = inp[i];
      // Exact GELU: x * 0.5 * (1 + erf(x / sqrt(2)))
      // WGSL doesn't have erf, use Abramowitz & Stegun approximation
      let t = 1.0 / (1.0 + 0.3275911 * abs(x * 0.7071067811865476));
      let erf_approx = 1.0 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * exp(-x * x * 0.5);
      let erf_val = select(-erf_approx, erf_approx, x >= 0.0);
      out[i] = x * 0.5 * (1.0 + erf_val);
    }
  `;
  const pipeline = getClipInlinePipeline(device, 'sf3d.clip.gelu', shaderCode);
  const output = createEmptyBuffer(device, count * 4);
  const bg = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: input } },
      { binding: 1, resource: { buffer: output } },
    ],
  });
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bg);
  pass.dispatchWorkgroups(ceilDiv(count, 256));
  pass.end();
  return output;
}

function _dispatchFusedAttn(encoder, device, qkvBuf, N) {
  const D = HIDDEN_DIM;
  const scale = 1.0 / Math.sqrt(HEAD_DIM);
  const shaderCode = `
    @group(0) @binding(0) var<storage, read> qkv: array<f32>;
    @group(0) @binding(1) var<storage, read_write> output: array<f32>;
    @compute @workgroup_size(64)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let idx = gid.x;
      if (idx >= ${N * NUM_HEADS}u) { return; }
      let qi = idx / ${NUM_HEADS}u;
      let h = idx % ${NUM_HEADS}u;
      var scores: array<f32, ${N}>;
      var maxS: f32 = -1e30;
      for (var ki: u32 = 0u; ki < ${N}u; ki++) {
        var s: f32 = 0.0;
        for (var d: u32 = 0u; d < ${HEAD_DIM}u; d++) {
          s += qkv[qi * ${3*D}u + h * ${HEAD_DIM}u + d]
             * qkv[ki * ${3*D}u + ${D}u + h * ${HEAD_DIM}u + d];
        }
        s *= ${scale};
        scores[ki] = s;
        maxS = max(maxS, s);
      }
      var sumE: f32 = 0.0;
      for (var ki: u32 = 0u; ki < ${N}u; ki++) {
        scores[ki] = exp(scores[ki] - maxS);
        sumE += scores[ki];
      }
      let inv = 1.0 / sumE;
      for (var d: u32 = 0u; d < ${HEAD_DIM}u; d++) {
        var val: f32 = 0.0;
        for (var ki: u32 = 0u; ki < ${N}u; ki++) {
          val += scores[ki] * inv * qkv[ki * ${3*D}u + ${2*D}u + h * ${HEAD_DIM}u + d];
        }
        output[qi * ${D}u + h * ${HEAD_DIM}u + d] = val;
      }
    }
  `;
  const pipeline = getClipInlinePipeline(device, 'sf3d.clip.fused-attention', shaderCode);
  const output = createEmptyBuffer(device, N * D * 4);
  const bg = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: qkvBuf } },
      { binding: 1, resource: { buffer: output } },
    ],
  });
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bg);
  pass.dispatchWorkgroups(ceilDiv(N * NUM_HEADS, 64));
  pass.end();
  return output;
}

// --- CPU head computation ---

function _runHead(features, weights, headName) {
  const p = `image_estimator.heads.${headName}`;
  const bias = 1.0;
  const g = (n) => weights._rawGetCPU(n);
  let x = new Float32Array(features);
  for (const l of ['0.0', '0.2', '0.4']) x = _cpuLinearReLU(x, g(`${p}.${l}.weight`), g(`${p}.${l}.bias`));
  let d1 = _cpuLinear(_cpuLinearReLU(x, g(`${p}.1.0.weight`), g(`${p}.1.0.bias`)),
                       g(`${p}.1.2.weight`), g(`${p}.1.2.bias`));
  let d2 = _cpuLinear(_cpuLinearReLU(x, g(`${p}.2.0.weight`), g(`${p}.2.0.bias`)),
                       g(`${p}.2.2.weight`), g(`${p}.2.2.bias`));
  const alpha = _softplus(d1[0] + bias), beta = _softplus(d2[0] + bias);
  if (alpha <= 1 || beta <= 1) return alpha / (alpha + beta);
  return Math.max(0, Math.min(1, (alpha - 1) / (alpha + beta - 2)));
}

function _cpuLinear(x, weight, bias) {
  // Head weights are transposed by converter: [inDim, outDim]
  // output[o] = sum_i x[i] * weight[i * outDim + o] + bias[o]
  const inDim = x.length, outDim = bias.length;
  const out = new Float32Array(outDim);
  for (let o = 0; o < outDim; o++) {
    let s = bias[o];
    for (let i = 0; i < inDim; i++) s += x[i] * weight[i * outDim + o];
    out[o] = s;
  }
  return out;
}

function _cpuLinearReLU(x, w, b) {
  const out = _cpuLinear(x, w, b);
  for (let i = 0; i < out.length; i++) if (out[i] < 0) out[i] = 0;
  return out;
}

function _softplus(x) { return x > 20 ? x : Math.log(1 + Math.exp(x)); }
