/**
 * inference.js — SF3D WebGPU inference pipeline.
 *
 * Full forward pass:
 *   1. Image preprocessing (normalize, resize to 512×512)
 *   2. Camera embedding (linear projection)
 *   3. DINOv2 image tokenization (with AdaNorm modulation)
 *   4. Two-stream backbone (interleave transformer)
 *   5. PixelShuffle post-processing
 *   6. Triplane query + decoder MLP
 *   7. Marching tetrahedra mesh extraction (CPU)
 *
 * Steps 1 run on CPU. Steps 2-6 run on GPU. Step 7 runs on CPU.
 */

import { createStorageBuffer, createEmptyBuffer, readBuffer } from './gpu.js';
import { prepareConditionImage, validateConditionReply } from './condition_image.js';
import { SF3D_IMAGE_PREPROCESS } from './preprocess_core.js';
import { callWorker } from './worker_call.js';
import { withForegroundScope } from './foreground_scope.js';
import { SF3DImageTokenizer } from './sf3d_backbone.js';
import { runCooperativeDino } from './cooperative_dino.js';
import { TwoStreamBackbone } from './two_stream.js';
import { runCooperativeTwoStream } from './cooperative_two_stream.js';
import { dispatchTokenizerEmbedding } from './tokenizer_embedding.js';
import { dispatchPostProcessor } from './post_processor.js';
import { runCooperativePostProcessor } from './cooperative_post_processor.js';
import { TriplaneDecoder } from './triplane_decoder.js';
import { loadTetData, loadTetGridVertices, marchingTetrahedra, runMarchingTetOnWorker, scaleTensor } from './marching_tet.js';

// Set to true for detailed tensor diagnostics during inference
const DEBUG = false;

// SF3D model configuration
const CONFIG = {
  ...SF3D_IMAGE_PREPROCESS,
  patchSize: 14,
  hiddenDim: 1024,
  numHeads: 16,
  headDim: 64,
  numEncoderLayers: 24,
  triplanePlaneSize: 96,
  triplaneChannels: 1024,
  numLatents: 1792,
  numBackboneBlocks: 4,
  numBasicBlocks: 3,
  isosurfaceResolution: 160,
  isosurfaceThreshold: 10.0,
  radius: 0.87,
  defaultFovDeg: 40.0,
  defaultDistance: 1.6,
};

/**
 * Preprocess an image for SF3D input.
 * Returns Float32Array in CHW format, normalized with ImageNet stats.
 */

/**
 * Extract raw float32 RGBA source pixels from an image element via canvas.
 * Cheap (a getImageData copy); the expensive resize/blend/normalize is separate
 * so it can run on either the main thread or a worker.
 */
function extractSourcePixels(imageData) {
  // PeerCompute provides checked raw RGBA in its ComputeManager-owned worker.
  const srcW = imageData.width, srcH = imageData.height;
  const srcPixels = imageData.data;
  if (!(srcPixels instanceof Uint8Array || srcPixels instanceof Uint8ClampedArray)
      || !Number.isSafeInteger(srcW) || !Number.isSafeInteger(srcH)
      || srcW < 1 || srcH < 1 || srcPixels.length !== srcW * srcH * 4) {
    throw new Error('SF3D requires validated RGBA pixels');
  }
  const srcFloat = new Float32Array(srcW * srcH * 4);
  for (let i = 0; i < srcPixels.length; i++) srcFloat[i] = srcPixels[i] / 255.0;
  return { srcFloat, srcW, srcH };
}

/**
 * Preprocess an image for SF3D input → CHW float32 tensor.
 *
 * @param {object} [options.preprocessWorker]  a live Worker running
 *   preprocess_worker.js; when supplied, foreground framing, bicubic resizing,
 *   blending and normalization run off the main thread. Both paths use the
 *   same condition_image implementation.
 */
export async function preprocessImage(imageData, width, height, options = {}) {
  return (await preprocessConditionImage(imageData, options)).chw;
}

export async function preprocessConditionImage(imageData, options = {}) {
  const size = CONFIG.condImageSize;
  const { srcFloat, srcW, srcH } = extractSourcePixels(imageData);
  const bg = CONFIG.bgColor, imageMean = CONFIG.imageMean, imageStd = CONFIG.imageStd;

  const worker = options.preprocessWorker;
  if (worker) {
    const id = `pp-${Math.random().toString(36).slice(2)}`;
    // Fail-loud: a worker crash / malformed reply / wedge rejects (never hangs,
    // never silently falls back). The caller owns any main-thread retry policy.
    return await callWorker(
      worker,
      { srcBuffer: srcFloat.buffer, srcW, srcH, size, bg, imageMean, imageStd, id },
      [srcFloat.buffer],
      {
        timeoutMs: options.workerTimeoutMs || 30000,
        // Shape + finiteness (worker_reply_validation.js): a length-correct
        // reply carrying NaN/Inf must not reach the GPU as a successful offload.
        onResult: (data) => validateConditionReply(data, size),
      },
    );
  }

  return prepareConditionImage(srcFloat, srcW, srcH, size, bg, imageMean, imageStd);
}

/**
 * Compute default camera embeddings input.
 * SF3D uses a fixed camera: c2w at distance 1.6, fov 40°.
 * Returns [25] float array: concat(c2w_4x4, intrinsic_normed_3x3).
 */
export function computeCameraInput() {
  const c2w = new Float32Array([
    0, 0, 1, CONFIG.defaultDistance,
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 1,
  ]);

  const fov = CONFIG.defaultFovDeg * Math.PI / 180;
  const focal = 0.5 / Math.tan(fov / 2);
  const intrinsicNormed = new Float32Array([
    focal, 0, 0.5,
    0, focal, 0.5,
    0, 0, 1,
  ]);

  const embedInput = new Float32Array(25);
  embedInput.set(c2w, 0);
  embedInput.set(intrinsicNormed, 16);
  return embedInput;
}

/**
 * Initialize all GPU pipeline modules.
 */
export function initPipelines(device) {
  const imageTokenizer = new SF3DImageTokenizer(device);
  imageTokenizer.init();

  const twoStream = new TwoStreamBackbone(device);
  twoStream.init();

  const triplaneDecoder = new TriplaneDecoder(device);
  triplaneDecoder.init();

  return { imageTokenizer, twoStream, triplaneDecoder };
}

/**
 * Run the full SF3D inference pipeline.
 *
 * @param {GPUDevice} device
 * @param {Object} pipelines - from initPipelines()
 * @param {Object} weights - from loadWeights()
 * @param {HTMLImageElement|HTMLCanvasElement} imageElement
 * @param {Function} onProgress - progress callback
 * @returns {{ vertices: Float32Array, faces: Uint32Array, numVertices: number, numFaces: number }}
 */
export async function runInference(device, pipelines, weights, imageElement, onProgress, options = {}) {
  const report = (msg) => { if (onProgress) onProgress(msg); console.log(msg); };
  const _stageTimings = {};
  let _stageStart;

  // Cooperative DINO options (first uptake of @kaminos/webgpu-inference-kit
  // cooperative porting spine; see cooperative_dino.js). Defaults preserve the
  // legacy single-submit path exactly.
  const cooperativeDino = options.cooperativeDino === true;
  const dinoSchedulingMode = options.dinoSchedulingMode === 'disabled' ? 'disabled' : 'cooperative';
  const dinoChunkBlocks = Number.isSafeInteger(options.dinoChunkBlocks) && options.dinoChunkBlocks > 0
    ? options.dinoChunkBlocks
    : 1;
  const cooperativePostProcessor = options.cooperativePostProcessor === true;
  const cooperativeTwoStream = options.cooperativeTwoStream === true;
  const twoStreamSchedulingMode = options.twoStreamSchedulingMode === 'disabled'
    ? 'disabled'
    : 'cooperative';
  const twoStreamDutyGranularity = options.twoStreamDutyGranularity ?? 'stage';
  if (!['stage', 'attention-tile'].includes(twoStreamDutyGranularity)) {
    throw new RangeError(
      `twoStreamDutyGranularity must be stage or attention-tile, `
      + `got ${twoStreamDutyGranularity}`,
    );
  }
  const twoStreamLinearRowsPerDuty = options.twoStreamLinearRowsPerDuty ?? 128;
  if (!Number.isSafeInteger(twoStreamLinearRowsPerDuty)
    || twoStreamLinearRowsPerDuty <= 0) {
    throw new TypeError(
      `twoStreamLinearRowsPerDuty must be a positive safe integer, `
      + `got ${twoStreamLinearRowsPerDuty}`,
    );
  }
  const postProcessorSchedulingMode = options.postProcessorSchedulingMode === 'disabled'
    ? 'disabled'
    : 'cooperative';
  const postProcessorDutyGranularity = options.postProcessorDutyGranularity ?? 'plane';
  if (!['plane', 'layer', 'channel-range'].includes(postProcessorDutyGranularity)) {
    throw new RangeError(
      `postProcessorDutyGranularity must be plane, layer, or channel-range, `
      + `got ${postProcessorDutyGranularity}`,
    );
  }
  // Bounded-prefix completion for the fixed channel-range postprocessor boundary
  // (kit >=0.1.41). Default strict-prefix preserves prior behavior; validation
  // lives in runCooperativePostProcessor (channel-range + cooperative only).
  const postProcessorCompletionPolicy = options.postProcessorCompletionPolicy ?? 'strict-prefix';
  const postProcessorMaxInFlightGpuDuties = options.postProcessorMaxInFlightGpuDuties ?? null;
  const postProcessorChannelsPerDuty = options.postProcessorChannelsPerDuty ?? 16;
  if (!Number.isSafeInteger(postProcessorChannelsPerDuty)
      || postProcessorChannelsPerDuty <= 0) {
    throw new TypeError(
      `postProcessorChannelsPerDuty must be a positive safe integer, `
      + `got ${postProcessorChannelsPerDuty}`,
    );
  }
  // Surfaced back to the caller/smoke via the returned _cooperativeReports.
  const _cooperativeReports = {};
  // Exact DINO numerical payload (only when options.captureDinoPayload).
  let _dinoPayload = null;
  // Absolute-timestamp stage spans for foreground-tail attribution (opt-in).
  const _spans = Array.isArray(options.recordStageSpans) ? options.recordStageSpans : null;
  const _markSpan = (name, start) => { if (_spans) _spans.push({ name, start, end: performance.now() }); };

  // 1. Preprocess image (CPU)
  _stageStart = performance.now();
  report('Preprocessing image...');
  const conditionImage = await withForegroundScope(options,
    options.preprocessWorker ? 'image-preprocess-worker' : 'image-preprocess',
    () => preprocessConditionImage(imageElement,
      { preprocessWorker: options.preprocessWorker, workerTimeoutMs: options.workerTimeoutMs }));
  const imageBuf = createStorageBuffer(device, conditionImage.chw);

  // 2. Camera embedding (GPU) — counted as part of image-preprocess
  report('Computing camera embedding...');
  const cameraInput = computeCameraInput();
  const cameraInputBuf = createStorageBuffer(device, cameraInput);

  // Dispatch camera embedding: Linear(25 → 768)
  const encoder1 = device.createCommandEncoder();
  const cameraEmbedBuf = createEmptyBuffer(device, 768 * 4);
  _dispatchLinear(device, encoder1, pipelines, cameraInputBuf, cameraEmbedBuf,
    weights.cameraEmbedder.weight, weights.cameraEmbedder.bias, 1, 25, 768);
  device.queue.submit([encoder1.finish()]);

  // Verify image buffer content before DINOv2 — check all 3 channels at pixel (0,0)
  if (DEBUG) {
    const imgFull = await readBuffer(device, imageBuf, 3 * 512 * 512 * 4);
    // R at (0,0): index 0
    // G at (0,0): index 512*512 = 262144
    // B at (0,0): index 2*512*512 = 524288
    const rVal = imgFull[0];
    const gVal = imgFull[262144];
    const bVal = imgFull[524288];
    console.log(`Image CHW pixel[0,0]: R=${rVal.toFixed(6)}, G=${gVal.toFixed(6)}, B=${bVal.toFixed(6)}`);
    // Expected: R=0.0655, G=0.1964, B=0.4178
    console.log(`Image first 5 R: [${Array.from(imgFull.slice(0, 5)).map(v => v.toFixed(4)).join(', ')}]`);
    // Check a non-background pixel (center area)
    const cx = 256, cy = 256;
    const rC = imgFull[0 * 512*512 + cy*512 + cx];
    const gC = imgFull[1 * 512*512 + cy*512 + cx];
    const bC = imgFull[2 * 512*512 + cy*512 + cx];
    console.log(`Image CHW pixel[256,256]: R=${rC.toFixed(6)}, G=${gC.toFixed(6)}, B=${bC.toFixed(6)}`);
  }

  _stageTimings['image-preprocess'] = performance.now() - _stageStart;
  _markSpan('image-preprocess', _stageStart);

  // 3. DINOv2 image tokenization (GPU)
  _stageStart = performance.now();
  let dinov2Result;
  if (cooperativeDino) {
    report(`Running DINOv2 backbone (cooperative, ${dinoSchedulingMode}, chunk=${dinoChunkBlocks})...`);
    const { result, report: coopReport } = await runCooperativeDino({
      device,
      foregroundOpportunities: options.foregroundOpportunities ?? null,
      tokenizer: pipelines.imageTokenizer,
      imageBuf,
      cameraEmbedBuf,
      weights: weights.imageTokenizer,
      numBlocks: CONFIG.numEncoderLayers,
      chunkBlocks: dinoChunkBlocks,
      schedulingMode: dinoSchedulingMode,
      retireIntermediateBuffers: true,
      signal: options.signal,
      onProgress: (p) => {
        if (p.percent != null) report(`DINOv2 blocks ${p.completedItems}/${p.totalItems} (${p.percent.toFixed(0)}%)`);
      },
    });
    dinov2Result = result;
    _cooperativeReports['dinov2-tokenizer'] = coopReport;
  } else {
    report('Running DINOv2 backbone...');
    const encoder2 = device.createCommandEncoder();
    dinov2Result = pipelines.imageTokenizer.encode(
      encoder2, imageBuf, cameraEmbedBuf, weights.imageTokenizer);
    device.queue.submit([encoder2.finish()]);
  }

  // Exact numerical payload capture (acceptance-capsule gate 5). Reads back the
  // complete DINOv2 token buffer — the canonical numerical output of the DINO
  // boundary being A/B'd — so control and candidate can be hashed and compared
  // field-by-field. Gated by option: normal runs pay no extra readback.
  if (options.captureDinoPayload) {
    const tokens = await readBuffer(device, dinov2Result.tokensBuf, dinov2Result.N * 1024 * 4);
    _dinoPayload = {
      shape: { N: dinov2Result.N, dim: 1024 },
      length: tokens.length,
      // Float32Array — the capsule hashes bytes and finds first differing index.
      tokens: Float32Array.from(tokens),
    };
  }

  // Diagnostic: DINOv2 output
  if (DEBUG) {
    const d2Sample = await readBuffer(device, dinov2Result.tokensBuf, dinov2Result.N * 1024 * 4);
    let min = Infinity, max = -Infinity, nan = 0, zero = 0;
    for (let i = 0; i < d2Sample.length; i++) {
      if (isNaN(d2Sample[i])) { nan++; continue; }
      if (d2Sample[i] === 0) zero++;
      if (d2Sample[i] < min) min = d2Sample[i];
      if (d2Sample[i] > max) max = d2Sample[i];
    }
    console.log(`DINOv2 output diagnostic (first 1024 f32): min=${min}, max=${max}, NaN=${nan}, zero=${zero}/${d2Sample.length}`);
  }

  // Diagnostic: camera embedding
  if (DEBUG) {
    const camSample = await readBuffer(device, cameraEmbedBuf, 768 * 4);
    let min = Infinity, max = -Infinity, nan = 0, zero = 0;
    for (let i = 0; i < camSample.length; i++) {
      if (isNaN(camSample[i])) { nan++; continue; }
      if (camSample[i] === 0) zero++;
      if (camSample[i] < min) min = camSample[i];
      if (camSample[i] > max) max = camSample[i];
    }
    console.log(`Camera embedding diagnostic: min=${min}, max=${max}, NaN=${nan}, zero=${zero}/${camSample.length}`);
  }

  _stageTimings['dinov2-tokenizer'] = performance.now() - _stageStart;
  _markSpan('dinov2-tokenizer', _stageStart);
  await options.retirePhase?.('dinov2-tokenizer', [dinov2Result.tokensBuf, cameraEmbedBuf]);

  // 4. Two-stream backbone (GPU)
  _stageStart = performance.now();
  report('Running two-stream backbone...');

  // Rearrange tokenizer embeddings from [3, 1024, 96, 96] to [1024, 27648]
  // PyTorch does: rearrange("Np Ct Hp Wp -> Ct (Np Hp Wp)")
  // Source [p,c,h,w] at p*C*H*W + c*H*W + h*W + w
  // Dest [c, p*H*W + h*W + w] at c*3*H*W + p*H*W + h*W + w
  if (!weights.backbone._rearrangedEmbeddings) {
    const encoder=device.createCommandEncoder();
    weights.backbone._rearrangedEmbeddings=dispatchTokenizerEmbedding(
      encoder,device,pipelines,weights.tokenizer.embeddings);
    device.queue.submit([encoder.finish()]);
  }
  weights.backbone.tokenizer_embeddings_buf = weights.backbone._rearrangedEmbeddings;

  // Diagnostic: check tokenizer embeddings
  if (DEBUG) {
    const embSample = await readBuffer(device, weights.tokenizer.embeddings, Math.min(4096, 28311552 * 4));
    let min = Infinity, max = -Infinity, nan = 0, zero = 0;
    for (let i = 0; i < embSample.length; i++) {
      if (isNaN(embSample[i])) { nan++; continue; }
      if (embSample[i] === 0) zero++;
      if (embSample[i] < min) min = embSample[i];
      if (embSample[i] > max) max = embSample[i];
    }
    console.log(`Tokenizer embeddings diagnostic: min=${min}, max=${max}, NaN=${nan}, zero=${zero}/${embSample.length}`);
  }

  if (DEBUG) device.pushErrorScope('validation');

  let backboneResult;
  if (cooperativeTwoStream) {
    report(
      `Running two-stream backbone (cooperative, ${twoStreamSchedulingMode}, `
      + `${twoStreamDutyGranularity})...`,
    );
    const { result, report: twoStreamReport } = await runCooperativeTwoStream({
      device,
      foregroundOpportunities: options.foregroundOpportunities ?? null,
      backbone: pipelines.twoStream,
      imageTokensBuf: dinov2Result.tokensBuf,
      N_img: dinov2Result.N,
      weights: weights.backbone,
      schedulingMode: twoStreamSchedulingMode,
      dutyGranularity: twoStreamDutyGranularity,
      linearRowsPerDuty: twoStreamLinearRowsPerDuty,
      retireIntermediateBuffers: true,
      signal: options.signal,
      onProgress: (p) => {
        if (p.percent != null) {
          report(
            `Two-stream duties ${p.completedItems}/${p.totalItems} `
            + `(${p.percent.toFixed(0)}%)`,
          );
        }
      },
    });
    backboneResult = result;
    _cooperativeReports['two-stream-backbone'] = twoStreamReport;
  } else {
    const encoder3 = device.createCommandEncoder();
    backboneResult = pipelines.twoStream.forward(
      encoder3, dinov2Result.tokensBuf, dinov2Result.N, weights.backbone);
    device.queue.submit([encoder3.finish()]);
  }

  if (DEBUG) {
    const bbError = await device.popErrorScope();
    if (bbError) {
      console.error(`Backbone validation error: ${bbError.message}`);
    } else {
      console.log('Backbone: no validation errors');
    }
  }

  // DINOv2 layer-by-layer diagnostics
  if (DEBUG && pipelines.imageTokenizer._dinov2Diag) {
    for (const [name, buf] of Object.entries(pipelines.imageTokenizer._dinov2Diag)) {
      const data = await readBuffer(device, buf, Math.min(buf.size, 1297 * 1024 * 4));
      // Token 0 = CLS, Token 1 = first patch
      console.log(`DINOv2 ${name}: [0,:5]=[${Array.from(data.slice(0,5)).map(v=>v.toFixed(4)).join(',')}] [1,:5]=[${Array.from(data.slice(1024,1029)).map(v=>v.toFixed(4)).join(',')}]`);
    }
  }

  // Point-check backbone inputs against PyTorch reference
  if (DEBUG && pipelines.twoStream._diagnosticBuffers) {
    const triProj = pipelines.twoStream._diagnosticBuffers['triProjBuf'];
    const latent = pipelines.twoStream._diagnosticBuffers['latentBuf'];
    if (triProj) {
      const tp = await readBuffer(device, triProj, Math.min(triProj.size, 27648 * 1024 * 4));
      // PyTorch ref: triProjBuf[0, :5] = [-0.425, -0.179, -0.134, 0.484, 0.449]
      console.log(`triProjBuf[0,:5]: [${Array.from(tp.slice(0, 5)).map(v => v.toFixed(4)).join(', ')}]`);
      console.log(`triProjBuf[100,:5]: [${Array.from(tp.slice(100*1024, 100*1024+5)).map(v => v.toFixed(4)).join(', ')}]`);
      console.log(`triProjBuf[9216,:5]: [${Array.from(tp.slice(9216*1024, 9216*1024+5)).map(v => v.toFixed(4)).join(', ')}]`);
    }
    if (latent) {
      const lt = await readBuffer(device, latent, Math.min(latent.size, 3089 * 1024 * 4));
      // PyTorch ref: latentBuf[0, :5] = [-0.778, -0.872, 0.427, 1.171, 1.312]
      console.log(`latentBuf[0,:5]: [${Array.from(lt.slice(0, 5)).map(v => v.toFixed(4)).join(', ')}]`);
      console.log(`latentBuf[1297,:5]: [${Array.from(lt.slice(1297*1024, 1297*1024+5)).map(v => v.toFixed(4)).join(', ')}]`);
    }
  }

  // Stage-by-stage backbone diagnostics (compare with PyTorch reference)
  // PyTorch reference (chair image):
  //   after GroupNorm:      min=-2.50, max=2.51, std=0.45
  //   after proj_triplane:  min=-6.64, max=6.94, std=0.43
  //   block 0 triplane:     min=-7.64, max=9.77, std=0.59
  //   block 3 triplane:     min=-10.09, max=16.46, std=0.85
  //   proj_out (permuted):  min=-5.68, max=5.44, std=0.36
  //   final (with residual): min=-5.67, max=5.45, std=0.36

  _stageTimings['two-stream-backbone'] = performance.now() - _stageStart;
  _markSpan('two-stream-backbone', _stageStart);
  await options.retirePhase?.('two-stream-backbone', [backboneResult.buffer, cameraEmbedBuf]);

  // 5. PixelShuffle post-processing (counted as part of triplane-decode)
  _stageStart = performance.now();
  let triplaneResult;
  if (cooperativePostProcessor) {
    const progressUnit = postProcessorDutyGranularity === 'plane' ? 'planes' : 'duties';
    report(
      `Running post-processor (cooperative, ${postProcessorSchedulingMode}, `
      + `${postProcessorDutyGranularity})...`,
    );
    const { result, report: postProcessorReport } = await runCooperativePostProcessor({
      device,
      foregroundOpportunities: options.foregroundOpportunities ?? null,
      triplanesBuf: backboneResult.buffer,
      weights: weights.postProcessor,
      schedulingMode: postProcessorSchedulingMode,
      dutyGranularity: postProcessorDutyGranularity,
      channelsPerDuty: postProcessorChannelsPerDuty,
      completionPolicy: postProcessorCompletionPolicy,
      maxInFlightGpuDuties: postProcessorMaxInFlightGpuDuties,
      signal: options.signal,
      onProgress: (p) => {
        if (p.percent != null) {
          report(
            `Post-processor ${progressUnit} ${p.completedItems}/${p.totalItems} `
            + `(${p.percent.toFixed(0)}%)`,
          );
        }
      },
    });
    triplaneResult = result;
    _cooperativeReports['post-processor'] = postProcessorReport;
  } else {
    report('Running post-processor...');
    const encoder4 = device.createCommandEncoder();
    triplaneResult = dispatchPostProcessor(
      device, encoder4, backboneResult.buffer, weights.postProcessor);
    device.queue.submit([encoder4.finish()]);

    // Ensure GPU work is done before reading
    await device.queue.onSubmittedWorkDone();
  }
  _markSpan('post-processor', _stageStart);

  // Diagnostic: check backbone output
  if (DEBUG) {
    const bbTotal = backboneResult.C * backboneResult.N * 4;
    const bbSample = await readBuffer(device, backboneResult.buffer, bbTotal);
    let min = Infinity, max = -Infinity, nan = 0, zero = 0;
    for (let i = 0; i < bbSample.length; i++) {
      if (isNaN(bbSample[i])) { nan++; continue; }
      if (bbSample[i] === 0) zero++;
      if (bbSample[i] < min) min = bbSample[i];
      if (bbSample[i] > max) max = bbSample[i];
    }
    console.log(`Backbone output diagnostic (first ${bbSample.length} f32): min=${min}, max=${max}, NaN=${nan}, zero=${zero}/${bbSample.length}`);
    // Point comparison with PyTorch
    // PyTorch backbone[0, 0:5] = [-0.0785, -0.0825, -0.1648, -0.0960, -0.2965]
    // PyTorch backbone[0, 48*96+48] = 0.1221
    console.log(`Backbone [0,0:5]: [${Array.from(bbSample.slice(0, 5)).map(v => v.toFixed(4)).join(', ')}]`);
    console.log(`Backbone [0, 4656] (ch0 plane0 center): ${bbSample[4656].toFixed(6)}`);
    console.log(`Backbone [0, 9216:9221] (ch0 plane1 first 5): [${Array.from(bbSample.slice(9216, 9221)).map(v => v.toFixed(4)).join(', ')}]`);
  }

  // Diagnostic: check triplane features after post-processor
  if (DEBUG) {
    const tpSample = await readBuffer(device, triplaneResult.buffer, Math.min(4096, triplaneResult.C * triplaneResult.H * triplaneResult.W * 4));
    let min = Infinity, max = -Infinity, nan = 0, zero = 0;
    for (let i = 0; i < tpSample.length; i++) {
      if (isNaN(tpSample[i])) { nan++; continue; }
      if (tpSample[i] === 0) zero++;
      if (tpSample[i] < min) min = tpSample[i];
      if (tpSample[i] > max) max = tpSample[i];
    }
    console.log(`Triplane features diagnostic (first 1024 f32): min=${min}, max=${max}, NaN=${nan}, zero=${zero}/${tpSample.length}`);
  }

  // Compare triplane features with PyTorch reference
  if (DEBUG) {
    // Read the full triplane buffer
    const fullTP = await readBuffer(device, triplaneResult.buffer, 3 * 40 * 384 * 384 * 4);
    const tpArr = fullTP;

    // Plane 0, ch 0, center row
    const rowStart = 192 * 384;
    console.log(`WebGPU plane0 ch0 center row (first 20): [${Array.from(tpArr.slice(rowStart, rowStart + 20)).map(v => v.toFixed(2)).join(', ')}]`);

    // Per-plane stats
    const planeSize = 40 * 384 * 384;
    for (let p = 0; p < 3; p++) {
      let pmin = Infinity, pmax = -Infinity, psum = 0, psum2 = 0;
      for (let i = p * planeSize; i < (p + 1) * planeSize; i++) {
        const v = tpArr[i];
        if (v < pmin) pmin = v;
        if (v > pmax) pmax = v;
        psum += v;
        psum2 += v * v;
      }
      const mean = psum / planeSize;
      const std = Math.sqrt(psum2 / planeSize - mean * mean);
      console.log(`WebGPU Plane ${p}: min=${pmin.toFixed(2)}, max=${pmax.toFixed(2)}, mean=${mean.toFixed(4)}, std=${std.toFixed(4)}`);
    }
  }

  // 6. Triplane query + decoder (GPU) — still part of triplane-decode timing
  await options.retirePhase?.('post-processor', [triplaneResult.buffer, cameraEmbedBuf]);
  report('Querying triplane and decoding...');

  // Load tet grid data: the whole grid for the inline marching tet, or only
  // the query positions when a Worker owns the tet table.
  const tetData = options.tetData;
  if (!tetData?.gridVertices || !tetData?.indices) throw new Error('SF3D requires artifact-backed tet data');
  report(`Loaded tet grid: ${tetData.numVertices} vertices, ${tetData.numTets ?? 'worker-owned'} tets`);

  // Scale grid vertices from [0, 1] to bbox
  const bbox = [-CONFIG.radius, CONFIG.radius];
  const gridPositions = scaleTensor(tetData.gridVertices, [0, 1], bbox);
  const gridPosBuf = createStorageBuffer(device, gridPositions);

  // First pass: density + vertex_offset for mesh extraction
  const encoder5 = device.createCommandEncoder();
  const decoded = pipelines.triplaneDecoder.decode(
    encoder5, gridPosBuf, triplaneResult.buffer, tetData.numVertices,
    weights.decoder, ['density', 'vertex_offset']);
  device.queue.submit([encoder5.finish()]);

  // Read back density and vertex_offset to CPU
  report('Reading back SDF values...');
  const densityCPU = await readBuffer(device, decoded.density, tetData.numVertices * 4);
  const sdf = new Float32Array(densityCPU);

  if (DEBUG) {
    let minD = Infinity, maxD = -Infinity, nanCount = 0, zeroCount = 0;
    for (let i = 0; i < sdf.length; i++) {
      if (isNaN(sdf[i])) { nanCount++; continue; }
      if (sdf[i] === 0) zeroCount++;
      if (sdf[i] < minD) minD = sdf[i];
      if (sdf[i] > maxD) maxD = sdf[i];
    }
    console.log(`SDF diagnostic: min=${minD}, max=${maxD}, NaN=${nanCount}, zero=${zeroCount}, total=${sdf.length}`);

    const checkIndices = [136813, 150448, 150449, 150452];
    console.log('Density point-check (PyTorch ref: 11.32, 13.83, 15.00, 11.35):');
    for (const idx of checkIndices) {
      console.log(`  vertex ${idx}: density=${sdf[idx].toFixed(4)}`);
    }

    const insideIndices = [];
    for (let i = 0; i < sdf.length; i++) {
      if (sdf[i] > 10.0) insideIndices.push(i);
    }
    console.log(`WebGPU inside vertices (density > 10): ${insideIndices.length}`);
    if (insideIndices.length > 0) {
      for (let j = 0; j < Math.min(5, insideIndices.length); j++) {
        const idx = insideIndices[j];
        const px = gridPositions[idx * 3], py = gridPositions[idx * 3 + 1], pz = gridPositions[idx * 3 + 2];
        console.log(`  inside vertex ${idx}: pos=[${px.toFixed(4)}, ${py.toFixed(4)}, ${pz.toFixed(4)}], density=${sdf[idx].toFixed(4)}`);
      }
    }

    if (typeof window !== 'undefined') {
      window._lastDensity = new Float32Array(sdf);
    }
  }

  // Subtract threshold: sdf = density - threshold
  for (let i = 0; i < sdf.length; i++) {
    sdf[i] -= CONFIG.isosurfaceThreshold;
  }

  const vertexOffsetCPU = await readBuffer(device, decoded.vertex_offset, tetData.numVertices * 3 * 4);
  const vertexOffsets = new Float32Array(vertexOffsetCPU);

  // Diagnostic: vertex offset statistics
  if (DEBUG) {
    let oMin = Infinity, oMax = -Infinity, oNan = 0;
    for (let i = 0; i < vertexOffsets.length; i++) {
      if (isNaN(vertexOffsets[i])) { oNan++; continue; }
      if (vertexOffsets[i] < oMin) oMin = vertexOffsets[i];
      if (vertexOffsets[i] > oMax) oMax = vertexOffsets[i];
    }
    console.log(`Vertex offsets: min=${oMin.toFixed(4)}, max=${oMax.toFixed(4)}, NaN=${oNan}, total=${vertexOffsets.length}`);
    // After tanh and scale: range = tanh(offset) / 160
    console.log(`After tanh/160: min=${(Math.tanh(oMin)/160).toFixed(6)}, max=${(Math.tanh(oMax)/160).toFixed(6)}`);
  }

  _stageTimings['triplane-decode'] = performance.now() - _stageStart;
  _markSpan('triplane-decode', _stageStart);

  // 7. Marching tetrahedra (CPU)
  _stageStart = performance.now();
  report('Extracting mesh...');
  // Grid vertices need to be in model space with deformation applied
  // The grid is in [0, 1], scale to bbox for the marching tet
  // Optionally offloaded to a Web Worker that owns the resident tet grid
  // (options.marchingTetWorker) — byte-identical output (same marchingTetrahedra
  // code); removes the ~30-40ms contiguous CPU stall from the main thread.
  const mesh = await withForegroundScope(options,
    options.marchingTetWorker ? 'marching-tet-worker' : 'marching-tet',
    () => options.marchingTetWorker
      ? runMarchingTetOnWorker(options.marchingTetWorker,
          { sdf, vertexOffsets, bbox, resolution: CONFIG.isosurfaceResolution },
          { timeoutMs: options.workerTimeoutMs })
      : marchingTetrahedra(
          gridPositions, sdf, tetData.indices, vertexOffsets, CONFIG.isosurfaceResolution));

  report(`Mesh extracted: ${mesh.numVertices} vertices, ${mesh.numFaces} faces`);

  _stageTimings['marching-tet'] = performance.now() - _stageStart;
  _markSpan('marching-tet', _stageStart);
  await options.retirePhase?.('marching-tet', [triplaneResult.buffer, cameraEmbedBuf]);

  // Mesh vertices are already in bbox space (from gridPositions which was pre-scaled)
  return {
    vertices: mesh.vertices,
    faces: mesh.faces,
    numVertices: mesh.numVertices,
    numFaces: mesh.numFaces,
    _conditionRgba: conditionImage.rgba,
    // Expose for texture baking
    _triplanesBuf: triplaneResult.buffer,
    _triplaneDecoder: pipelines.triplaneDecoder,
    _decoderWeights: weights.decoder,
    _stageTimings,
    // Cooperative execution reports per phase (empty unless an opt-in boundary runs)
    _cooperativeReports,
    // Exact DINO numerical payload for A/B comparison (null unless captured).
    _dinoPayload,
    // Expose for parity verification (sdf = density - threshold; add threshold back for raw)
    _sdf: sdf,
    _isosurfaceThreshold: CONFIG.isosurfaceThreshold,
    // Raw decoder vertex offsets (pre tanh/scale, [N*3]), scaled grid positions
    // ([N*3]), and the camera-embedding GPU buffer ([768] f32) for element-wise
    // comparison against tools/dump_parity_reference.py (tools/smoke_parity.mjs).
    _vertexOffsets: vertexOffsets,
    _gridPositions: gridPositions,
    _cameraEmbedBuf: cameraEmbedBuf,
  };
}

// --- Helper: dispatch a single linear layer (for camera embedding) ---
function _dispatchLinear(device, encoder, pipelines, input, output, weight, bias, rows, inDim, outDim) {
  // Reuse the imageTokenizer's linear pipeline
  pipelines.imageTokenizer._dispatchLinear(encoder, input, output, weight, bias, rows, inDim, outDim);
}
