/**
 * Cooperative DINO encoder boundary — first uptake of the Kaminos WebGPU
 * Inference Kit cooperative porting spine (@kaminos/webgpu-inference-kit@^0.1.36)
 * in the sf3d.image-to-mesh.webgpu-local.v0 route.
 *
 * Scope (session 7, cranial-depth-enema directive
 * `adopt-cooperative-porting-spine-0136-in-sf3d`): wire ONLY the DINOv2 ViT
 * encoder — a strictly sequential 24-block loop in sf3d_backbone.js — through
 * the kit's cooperative execution facade as one gpu-command boundary
 * (unit: vit-block, totalItems: 24). This is a scheduling-granularity change,
 * NOT a numerical change: the exact per-block dispatch sequence and tokenBufA/
 * tokenBufB ping-pong are preserved; the only difference from the legacy path
 * is that each block (or fixed chunk of blocks) is submitted as its own command
 * buffer with a browser yield between duties, instead of all 24 blocks landing
 * in one command buffer with one submit.
 *
 * The runtime here is adapter-owned and thin: it wraps the real GPUDevice.queue
 * and exposes exactly the surface createWebGpuCooperativeExecution() consumes
 * (routeId, queue.submit/onSubmittedWorkDone, runInvocation, commandDuties
 * .measureSubmission, hostPhases, yieldToBrowser). No kit inference-runtime,
 * session, or resource-residency machinery is pulled in for this first slice —
 * those are separate pending directives, deliberately kept out to avoid
 * ambiguous parity/perf regression attribution.
 */

import {
  createWebGpuCooperativeExecution,
  defineWebGpuCooperativeBoundaryManifest,
} from '@kaminos/webgpu-inference-kit';

export const SF3D_ROUTE_ID = 'sf3d.image-to-mesh.webgpu-local.v0';
export const DINO_COOPERATIVE_MANIFEST_ID = 'sf3d.dino-encoder-cooperative-boundaries.v0';
export const DINO_BOUNDARY_ID = 'dino-vit-blocks';

/**
 * Declare the DINO encoder cooperative boundary manifest.
 *
 * One phase, one gpu-command boundary over the 24 ViT blocks. Fixed chunking
 * by default (chunkBlocks blocks per submitted duty). progressWeight equals the
 * block count so denominator-bearing progress reads as fraction-of-blocks; no
 * hidden cap — totalItems is exactly the declared block count.
 *
 * @param {number} numBlocks   total ViT blocks (24 for SF3D DINOv2-large)
 * @param {number} chunkBlocks blocks per submitted GPU duty (>=1)
 */
export function defineDinoEncoderManifest(numBlocks, chunkBlocks = 1) {
  if (!Number.isSafeInteger(numBlocks) || numBlocks <= 0) {
    throw new TypeError('numBlocks must be a positive safe integer');
  }
  if (!Number.isSafeInteger(chunkBlocks) || chunkBlocks <= 0) {
    throw new TypeError('chunkBlocks must be a positive safe integer');
  }
  return defineWebGpuCooperativeBoundaryManifest({
    manifestId: DINO_COOPERATIVE_MANIFEST_ID,
    routeId: SF3D_ROUTE_ID,
    phases: [
      {
        phaseId: 'dinov2-tokenizer',
        boundaries: [
          {
            boundaryId: DINO_BOUNDARY_ID,
            kind: 'gpu-command',
            unit: 'vit-block',
            totalItems: numBlocks,
            progressWeight: numBlocks,
            commandDutyKind: 'compute',
            chunking: { mode: 'fixed', chunkItems: chunkBlocks },
            yieldPolicy: 'after-duty',
            resources: {
              retain: ['dinov2.weights'],
              produce: ['dinov2.tokens'],
              release: [],
            },
          },
        ],
      },
    ],
    metadata: { source: 'sf3d-webgpu-cooperative-dino-uptake' },
  });
}

/**
 * Adapter-owned thin runtime over the real GPUDevice.queue.
 *
 * `yieldToBrowser` is a real macrotask yield (MessageChannel) so the browser
 * event loop can service a frame between submitted block duties — this is the
 * cooperative behavior the operator smoke measures. In scheduling-disabled A/B
 * the facade never calls yieldToBrowser, so both arms declare identical work
 * but only the cooperative arm actually cedes the main thread per duty.
 */
export function createSf3dCooperativeRuntime(device, hooks = {}) {
  const now = () => globalThis.performance?.now?.() ?? Date.now();
  // Optional kit foreground-opportunity interlock (the shape returned by
  // createWebGpuForegroundOpportunityInterlock). When present, pending host
  // demand — e.g. the kiln's flame frame — is serviced at every cooperative
  // pre-encode boundary exactly as the kit's own runtime does, so the host's
  // command buffers reach the shared queue ahead of the next inference duty.
  const foregroundOpportunities = hooks.foregroundOpportunities ?? null;
  if (foregroundOpportunities != null) {
    for (const method of ['serviceAtBoundary', 'snapshot']) {
      if (typeof foregroundOpportunities[method] !== 'function') {
        throw new Error(`foregroundOpportunities must expose ${method}()`);
      }
    }
  }
  let foregroundBoundarySequence = 0;
  const hasForegroundPressure = (snapshot) => snapshot.pendingRequestCount > 0
    || snapshot.activeRequestCount > 0
    || snapshot.activeServiceCount > 0
    || snapshot.queuedServiceCount > 0;
  const queue = {
    submit(commandBuffers) {
      device.queue.submit(commandBuffers);
    },
    async onSubmittedWorkDone() {
      const startedAtMs = now();
      const result = await device.queue.onSubmittedWorkDone();
      const completedAtMs = now();
      if (typeof hooks.onQueueFenceResolved === 'function') {
        await hooks.onQueueFenceResolved({
          startedAtMs,
          completedAtMs,
          queueWaitMs: completedAtMs - startedAtMs,
        });
      }
      return result;
    },
  };

  return {
    routeId: SF3D_ROUTE_ID,
    runtimeLabel: 'sf3d-webgpu-cooperative-dino',
    queue,
    hostPhases: {
      snapshot() {
        return { status: 'not-instrumented', phase: 'dinov2-tokenizer' };
      },
    },
    commandDuties: {
      // Observe/route the submission only — do NOT impose our own queue fence
      // here. The facade owns fence policy: in cooperative mode it fences the
      // queue prefix per duty (per-gpu-duty-prefix-fence); in disabled mode it
      // takes exactly one terminal fence. Fencing here would double-fence the
      // cooperative arm and, worse, force per-duty fences onto the disabled arm,
      // destroying the scheduling A/B over identical declared work.
      async measureSubmission(descriptor, submit) {
        return submit();
      },
    },
    foregroundOpportunities,
    // The facade awaits this hook before each cooperative GPU encode. Without
    // an interlock it is an honest pass-through (cooperation is the post-duty
    // browser yield + per-duty queue fence). With an interlock, pending host
    // demand is serviced here, before the next inference duty is encoded,
    // mirroring the kit runtime: no demand → no synthetic service turn; a
    // failed service refuses the encode; demand without an invocation
    // identity refuses.
    async prepareCommandDutyAtBoundary(descriptor, schedulerInvocation = null) {
      if (!foregroundOpportunities) return descriptor;
      const pressure = typeof foregroundOpportunities.pressureSnapshot === 'function'
        ? foregroundOpportunities.pressureSnapshot()
        : foregroundOpportunities.snapshot();
      if (!hasForegroundPressure(pressure)) return descriptor;
      const invocationId = schedulerInvocation?.invocationId;
      if (typeof invocationId !== 'string' || !invocationId.trim()) {
        throw new Error('foreground opportunity service requires an active invocation identity');
      }
      foregroundBoundarySequence += 1;
      const service = await foregroundOpportunities.serviceAtBoundary({
        invocationId,
        boundaryId: `${invocationId}:foreground-boundary:${foregroundBoundarySequence}`,
        dutyId: descriptor?.dutyId || `${invocationId}:command-duty:${foregroundBoundarySequence}`,
        phase: descriptor?.phase || 'sf3d-cooperative-duty',
        position: 'before-encode',
        metadata: {
          runtimeLabel: 'sf3d-webgpu-cooperative',
          schedulerRevision: schedulerInvocation.schedulerRevision ?? null,
        },
      });
      const prepared = {
        ...descriptor,
        metadata: { ...(descriptor?.metadata || {}), foregroundOpportunityService: service },
      };
      if (service.status === 'failed') {
        const first = service.failures?.[0];
        throw new Error(first?.failure?.error?.message || 'foreground opportunity failed');
      }
      return prepared;
    },
    settleCommandDuty() {
      // No scheduler-owned duty ledger in this slice; settlement is a no-op.
    },
    async runInvocation({ invocationId }, fn) {
      return fn({
        invocationId,
        schedulerRevision: null,
        scheduler: {
          mode: 'cooperative',
          yieldMs: 0,
          waitForSubmittedWorkDone: true,
          phaseChunkSize: {},
        },
        async yieldToBrowser() {
          const start = now();
          await macrotaskYield();
          const end = now();
          const result = { reason: 'cooperative-boundary-duty-complete', elapsedMs: end - start };
          if (typeof hooks.onBrowserYield === 'function') {
            await hooks.onBrowserYield({
              startedAtMs: start,
              completedAtMs: end,
              elapsedMs: end - start,
            });
          }
          return result;
        },
      });
    },
  };
}

/**
 * Yield to the browser macrotask queue so a foreground frame can run.
 * MessageChannel gives a true macrotask (unlike microtask await), which is
 * what lets the compositor paint between block duties.
 */
function macrotaskYield() {
  if (typeof MessageChannel === 'function') {
    return new Promise(resolve => {
      const channel = new MessageChannel();
      channel.port1.onmessage = () => {
        channel.port1.close();
        resolve();
      };
      channel.port2.postMessage(null);
    });
  }
  return new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Run the DINO encoder cooperatively.
 *
 * @param {object}   opts
 * @param {GPUDevice} opts.device
 * @param {object}   opts.tokenizer            SF3DImageTokenizer instance
 * @param {GPUBuffer} opts.imageBuf
 * @param {GPUBuffer} opts.cameraEmbedBuf
 * @param {object}   opts.weights              weights.imageTokenizer
 * @param {number}   opts.numBlocks            24 for SF3D
 * @param {number}  [opts.chunkBlocks=1]       blocks per submitted duty
 * @param {'cooperative'|'disabled'} [opts.schedulingMode='cooperative']
 * @param {(progress:object)=>void} [opts.onProgress]
 * @param {AbortSignal} [opts.signal]
 * @param {string}   [opts.invocationId]
 * @returns {Promise<{ result: object, report: object }>}
 *          result is the tokenizer.encode() output ({ tokensBuf, N, tokenH, tokenW });
 *          report is the kit cooperative execution report.
 */
export async function runCooperativeDino(opts) {
  const {
    device,
    tokenizer,
    imageBuf,
    cameraEmbedBuf,
    weights,
    numBlocks,
    chunkBlocks = 1,
    schedulingMode = 'cooperative',
    onProgress,
    signal,
    invocationId = `sf3d:dino:${schedulingMode}`,
  } = opts;
  if(opts.withChunkWeights!=null&&schedulingMode!=='cooperative')
    throw Error('phase weight residency requires cooperative queue-prefix fences');

  const manifest = defineDinoEncoderManifest(numBlocks, chunkBlocks);
  const runtime = createSf3dCooperativeRuntime(device, {
    foregroundOpportunities: opts.foregroundOpportunities ?? null,
  });
  const execution = createWebGpuCooperativeExecution({
    runtime,
    manifest,
    invocationId,
    schedulingMode,
    onProgress,
    signal,
  });

  let result = null;

  // Production run: create a real execution and drive the SHARED boundary
  // driver against the facade the execution hands to run(). The driver's
  // encode/submit produce real WebGPU command buffers on the real device queue.
  await execution.run(async cooperative => {
    result = await driveDinoCooperativeBoundary(cooperative, {
      numBlocks,
      chunkBlocks,
      encodeChunk: ({ blockStart, blockEnd, encodeInto }) => {
        const encoder = device.createCommandEncoder({
          label: `dino-blocks-${blockStart}-${blockEnd}`,
        });
        encodeInto(encoder);
        return encoder.finish();
      },
      // kit >=0.1.41: encode() returns the command buffer and the kit owns
      // queue.submit; no producer-side submit callback.
      encodeTokenizer: (driver) => tokenizer.encodeCooperative({
        imageBuf, cameraEmbedBuf, weights, numBlocks, chunkBlocks, driver,
        withChunkWeights:opts.withChunkWeights??null,
        retireIntermediateBuffers:opts.retireIntermediateBuffers===true,
      }),
    });
  });

  return { result, report: execution.finish() };
}

/**
 * SHARED cooperative-DINO boundary driver.
 *
 * Consumes the supplied cooperative facade DIRECTLY (the object passed to
 * `execution.run`'s callback — with `startBoundary`). It does NOT create a
 * nested cooperative execution: production and conformance both hand this driver
 * a facade whose runtime they own, so all declared work, cancellation, failure
 * injection, progress, and settlement stay inside that one facade's authority.
 *
 * The driver decides WHERE the command buffer is cut (per fixed chunk of blocks)
 * and delegates HOW a chunk is encoded/submitted to the caller via injected
 * `encodeChunk`/`submitChunk`. This is the only seam that differs between:
 *   - production: real GPUCommandEncoder + real device.queue.submit;
 *   - conformance: deterministic instrumented encode/submit tokens (no GPU).
 *
 * Block order, chunk boundaries, and the tokenizer's ping-pong are identical on
 * both paths, so the canonical orchestration trace (and its fingerprint) match.
 *
 * @param {object} cooperative                 facade from execution.run callback
 * @param {object} o
 * @param {number} o.numBlocks
 * @param {number} o.chunkBlocks
 * @param {(ctx:{blockStart:number,blockEnd:number,encodeInto:(enc:any)=>void})=>any} o.encodeChunk
 *        returns the "command buffer" (real GPUCommandBuffer or a deterministic token)
 * @param {(driver:Function)=>Promise<any>} o.encodeTokenizer
 *        invokes tokenizer.encodeCooperative with the per-chunk driver we build
 * @returns {Promise<any>} the tokenizer.encode() output ({ tokensBuf, N, tokenH, tokenW })
 */
export async function driveDinoCooperativeBoundary(cooperative, o) {
  const { encodeChunk, encodeTokenizer } = o;
  const gpu = cooperative.startBoundary(DINO_BOUNDARY_ID);

  // The tokenizer calls this once per fixed chunk of blocks, in order. We map
  // each chunk to exactly one cooperative range + gpu duty.
  const perChunkDriver = async (blockStart, blockEnd, encodeInto) => {
    const range = gpu.nextRange();
    if (!range) {
      throw new Error(`cooperative DINO boundary exhausted ranges before block ${blockStart}`);
    }
    await gpu.runGpuDuty(range, {
      encode() {
        return encodeChunk({ blockStart, blockEnd, encodeInto });
      },
    });
  };

  const result = await encodeTokenizer(perChunkDriver);

  // Boundary must be fully consumed for the facade to accept completion.
  if (gpu.nextRange() != null) {
    throw new Error('cooperative DINO boundary left ranges unconsumed');
  }
  return result;
}
