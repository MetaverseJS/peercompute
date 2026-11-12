/**
 * full_pipeline.js — single-image → textured GLB, the complete
 * sf3d.image-to-mesh.webgpu-local.v0 route as one callable.
 *
 * This is the exact step 1–6 sequence main.js runs (inference → CLIP materials →
 * UV unwrap → rasterize → texture bake → GLB export), extracted so the
 * acceptance capsule exercises the SAME route the app does, for both the control
 * (kit 0.1.36) and candidate (kit 0.1.38) arms, without duplicating the sequence
 * inside a browser-eval string.
 *
 * `options` is forwarded to runInference (e.g. { cooperativeDino,
 * dinoSchedulingMode, dinoChunkBlocks, cooperativePostProcessor,
 * postProcessorSchedulingMode, postProcessorDutyGranularity,
 * postProcessorChannelsPerDuty,
 * captureDinoPayload }), so a capsule can select cooperative execution per arm
 * while the rest of the route stays identical.
 */

import { runInference } from './inference.js';
import { validateUvUnwrapReply } from './worker_reply_validation.js';
import { unwrapUV, rasterizeUV, bakeTexture, exportGLB } from './texture_baker.js';
import { estimateMaterials } from './clip_estimator.js';
import { makeCooperativeTextureBake, withDecoderArenaLease } from './cooperative_texture_bake.js';
import { callWorker } from './worker_call.js';
import { withForegroundScope } from './foreground_scope.js';

const COND_SIZE = 512;
const TEX_RESOLUTION = 1024;

/**
 * Run UV unwrap on the main thread, or on a Web Worker when one is supplied.
 * Byte-identical output either way (same unwrapUV code). Vertices/faces are
 * transferred zero-copy to the worker; outputs transferred back.
 */
async function runUvUnwrap(vertices, faces, numVertices, numFaces, worker, workerTimeoutMs) {
  if (!worker) return unwrapUV(vertices, faces, numVertices, numFaces);
  // Transfer sliced copies (one copy) so the caller's arrays stay intact while
  // the worker gets zero-copy ownership.
  const vBuf = vertices.slice().buffer, fBuf = faces.slice().buffer;
  const id = `uv-${Math.random().toString(36).slice(2)}`;
  // Fail-loud lifecycle (crash / malformed / wedge) via callWorker.
  return await callWorker(
    worker,
    { vertices: vBuf, faces: fBuf, numVertices, numFaces, id },
    [vBuf, fBuf],
    {
      timeoutMs: workerTimeoutMs || 30000,
      // Every array at its declared length, finite floats, in-range face
      // indices and chart ids (worker_reply_validation.js); malformed replies
      // throw here rather than reach rasterization / the texture baker.
      onResult: (d) => validateUvUnwrapReply(d),
    },
  );
}

export async function runFullPipelineToGlb(device, pipelines, weights, inputImage, options = {}, onProgress) {
  const report = (msg) => { options.signal?.throwIfAborted(); if (onProgress) onProgress(msg); };
  const t0 = performance.now();

  // Absolute-timestamp stage spans on the same performance.now() clock as any
  // caller-side rAF probe, so each foreground frame gap can be attributed to the
  // stage executing during it. Inference substages (dinov2/two-stream/triplane/
  // marching) come back from runInference; the outer steps are marked here.
  const spans = [];
  const mark = (name, start, end) => spans.push({ name, start, end });
  const timed = async (name, fn) => { report(name); const s = performance.now(); const r = await fn(); options.signal?.throwIfAborted(); mark(name, s, performance.now()); return r; };

  // Step 1: inference → untextured mesh + triplane data (+ optional DINO payload)
  const meshResult = await runInference(
    device, pipelines, weights, inputImage, report,
    { ...options, recordStageSpans: spans });

  // Step 2: CLIP material estimation (exact PyTorch preprocessing order)
  report('clip-material-estimate');
  const clipStart = performance.now();
  const clipRaw = meshResult._conditionRgba;
  // Blend / resize / patch-embed run in clip_prep_core — on the main thread, or
  // on options.clipPrepWorker with byte-identical output.
  const { roughness, metallic } = await estimateMaterials(
    device, clipRaw, COND_SIZE, COND_SIZE, weights,
    { clipPrepWorker: options.clipPrepWorker, workerTimeoutMs: options.workerTimeoutMs, withForeground: options.withForeground });
  mark('clip-material-estimate', clipStart, performance.now());
  await options.retirePhase?.('clip-material-estimate', [meshResult._triplanesBuf]);

  // Step 3: UV unwrap (CPU). Optionally offloaded to a Web Worker
  // (options.uvUnwrapWorker) — the second-largest CPU foreground gap (~216ms);
  // byte-identical output (same unwrapUV code).
  const uvResult = await timed('uv-unwrap', () => withForegroundScope(options,
    options.uvUnwrapWorker ? 'uv-unwrap-worker' : 'uv-unwrap',
    () => runUvUnwrap(
      meshResult.vertices, meshResult.faces, meshResult.numVertices, meshResult.numFaces,
      options.uvUnwrapWorker, options.workerTimeoutMs)));

  // Step 4: rasterize UV → per-texel 3D positions (CPU, synchronous)
  const rasterResult = await timed('uv-rasterize', () => withForegroundScope(options, 'uv-rasterize', () => rasterizeUV(
    uvResult.uvs, uvResult.newVertices, uvResult.newFaces,
    uvResult.newNumFaces, TEX_RESOLUTION, uvResult.faceAssignment)));

  // Step 5: texture bake (GPU triplane query). Optionally cooperative — batch
  // the per-texel decode into yieldable GPU duties (options.cooperativeBake).
  let bakeReport = null;
  const bakeOptions = {};
  if (options.cooperativeBake) {
    const bakeTelemetry = {};
    const cooperativeBatch = makeCooperativeTextureBake(device, {
      foregroundOpportunities: options.foregroundOpportunities ?? null,
      batchTexels: options.bakeBatchTexels || 16384,
      schedulingMode: options.bakeSchedulingMode === 'disabled' ? 'disabled' : 'cooperative',
      onProgress: (p) => { if (p.percent != null) report(`Texture bake ${p.completedItems}/${p.totalItems} (${p.percent.toFixed(0)}%)`); },
    });
    bakeOptions.cooperativeBatch = async (numOccupied, makeBatch) => { bakeReport = await cooperativeBatch(numOccupied, makeBatch); };
    bakeOptions.telemetry = bakeTelemetry;
    bakeOptions.finalizeTelemetry = () => bakeTelemetry;
  }
  // Optional worker materialization of albedo/normal/dilation (~752ms CPU tail).
  if (options.materializeWorker) {
    bakeOptions.materializeWorker = options.materializeWorker;
    bakeOptions.workerTimeoutMs = options.workerTimeoutMs;
  }
  bakeOptions.withForeground = options.withForeground;
  // Optional decoder scratch arena (options.decoderArena): removes ~1.015GB
  // per-route decode allocation churn by reusing one buffer per slot across
  // ranges, held under the phase-resource working-set lease. maxBatch is the
  // cooperative batch size (the largest N any range decodes).
  const runBake = () => bakeTexture(
    device, meshResult._triplaneDecoder, meshResult._triplanesBuf,
    meshResult._decoderWeights, rasterResult.positions3D, rasterResult.mask,
    rasterResult.tbnData, TEX_RESOLUTION, bakeOptions);
  let arenaSnapshot = null;
  const bakeResult = await timed('texture-bake', async () => {
    if (options.decoderArena && options.cooperativeBake) {
      const maxBatch = options.bakeBatchTexels || 16384;
      return await withDecoderArenaLease(device, { maxBatch }, async (arena, snap) => {
        bakeOptions.arena = arena;
        arenaSnapshot = snap;
        const r = await runBake();
        arenaSnapshot = arena.snapshot();
        return r;
      });
    }
    return runBake();
  });
  await options.retirePhase?.('texture-bake', []);
  if (bakeReport && bakeOptions.finalizeTelemetry) {
    bakeReport = Object.freeze({
      ...bakeReport,
      textureBakeTelemetry: Object.freeze({
        ...bakeReport.textureBakeTelemetry,
        phases: Object.freeze({ ...bakeOptions.finalizeTelemetry() }),
      }),
    });
  }

  // Step 6: GLB export
  const glb = await timed('glb-export', () => withForegroundScope(options, 'glb-export', () => exportGLB(
    uvResult.newVertices, uvResult.newNormals, uvResult.newFaces, uvResult.uvs,
    bakeResult.albedo, bakeResult.normalMap,
    uvResult.newNumVertices, uvResult.newNumFaces, TEX_RESOLUTION,
    roughness, metallic, { requireNormalTexture: true })));

  // Which CPU phases ran off the main thread. Every worker dispatcher is
  // fail-loud (callWorker never falls back silently), so a requested worker is
  // an effective worker or a thrown error — this is an effective-route record.
  const offloads = Object.freeze({
    preprocess: options.preprocessWorker ? 'worker' : 'main',
    clipPrep: options.clipPrepWorker ? 'worker' : 'main',
    marchingTet: options.marchingTetWorker ? 'worker' : 'main',
    uvUnwrap: options.uvUnwrapWorker ? 'worker' : 'main',
    materialize: options.materializeWorker ? 'worker' : 'main',
  });

  return {
    stageSpans: spans,
    glb,                                   // ArrayBuffer
    numVertices: meshResult.numVertices,
    numFaces: meshResult.numFaces,
    vertices: meshResult.vertices,         // Float32Array [numVertices*3]
    faces: meshResult.faces,               // Uint32Array [numFaces*3]
    offloads,
    uvNumVertices: uvResult.newNumVertices,
    uvNumFaces: uvResult.newNumFaces,
    roughness,
    metallic,
    cooperativeReports: { ...(meshResult._cooperativeReports || {}), ...(bakeReport ? { 'texture-bake': bakeReport } : {}) },
    arenaSnapshot,
    dinoPayload: meshResult._dinoPayload || null,   // { shape, length, tokens } or null
    sdf: meshResult._sdf,
    isosurfaceThreshold: meshResult._isosurfaceThreshold,
    stageTimings: meshResult._stageTimings || {},
    totalMs: performance.now() - t0,
  };
}
