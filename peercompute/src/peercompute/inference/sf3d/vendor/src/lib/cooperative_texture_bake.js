/**
 * Cooperative texture-bake boundary — second SF3D cooperative uptake of the
 * Kaminos cooperative porting spine.
 *
 * Profiling (foreground-tail-stage-attribution_2026-07-24) showed the texture
 * bake's single monolithic triplane-decode dispatch + readback owns a ~231ms
 * contiguous foreground gap — the largest GPU gap in the pipeline. Per-texel
 * decode is fully independent, so we split the occupied texels into fixed
 * batches and decode each as its own GPU command duty through the cooperative
 * facade (submit + queue-prefix fence + browser yield between batches),
 * collapsing the one big gap into yieldable pieces while preserving byte-
 * identical texture output.
 *
 * Reuses the exact command-duty pattern proven at the DINO boundary: the
 * adapter-owned thin runtime (createSf3dCooperativeRuntime) and the boundary/
 * duty facade. This is the GPU cooperative mechanism, not a CPU worker offload.
 */

import {
  createWebGpuCooperativeExecution,
  defineWebGpuCooperativeBoundaryManifest,
  createWebGpuPhaseResourceWorkingSet,
} from '@kaminos/webgpu-inference-kit';
import { createSf3dCooperativeRuntime, SF3D_ROUTE_ID } from './cooperative_dino.js';
import { createDecoderScratchArena, decoderArenaCapacityBytes } from './decoder_scratch_arena.js';

export const TEXTURE_BAKE_MANIFEST_ID = 'sf3d.texture-bake-cooperative-boundaries.v0';
export const TEXTURE_BAKE_BOUNDARY_ID = 'texture-bake-texel-batches';
export const DECODER_ARENA_RESOURCE_ID = 'sf3d.decoder-scratch-arena';

/**
 * Run `fn(arena)` with a decoder scratch arena held under the kit's phase-
 * resource working-set lease (Cranial's constraint: one managed resource, no
 * competing manager). The working set acquires the arena when transitioning into
 * the texture-bake phase and retires it on close — giving the arena lawful
 * lease-owned lifetime, cancellation, and terminal retirement.
 *
 * @param {GPUDevice} device
 * @param {object} o { maxBatch, signal }
 * @param {(arena, workingSetSnapshot)=>Promise<any>} fn
 */
export async function withDecoderArenaLease(device, { maxBatch, signal }, fn) {
  const declaredBytes = decoderArenaCapacityBytes(maxBatch);
  let arena = null;
  const workingSet = createWebGpuPhaseResourceWorkingSet({
    controllerId: 'sf3d.texture-bake.decoder-arena',
    plan: {
      planId: 'sf3d.texture-bake.decoder-arena.v0',
      resources: [{ resourceId: DECODER_ARENA_RESOURCE_ID, declaredBytes }],
      phases: [{ phaseId: 'texture-bake', requiredResourceIds: [DECODER_ARENA_RESOURCE_ID] }],
    },
    acquireResource: ({ resource }) => {
      arena = createDecoderScratchArena(device, { maxBatch });
      return {
        resourceId: resource.resourceId,
        value: arena,
        release: () => {
          const r = arena.destroy();
          return r.retired >= 0 ? 'released' : 'released';
        },
      };
    },
    residencySnapshot: () => (arena ? arena.snapshot() : { slotCount: 0, totalBytes: 0 }),
  });
  try {
    await workingSet.transitionToPhase('texture-bake', { signal });
    return await fn(arena, workingSet.snapshot());
  } finally {
    workingSet.close();
  }
}

/**
 * Declare the texture-bake cooperative boundary manifest: one gpu-command
 * boundary over the occupied texels, fixed chunking by batchTexels.
 */
export function defineTextureBakeManifest(numOccupied, batchTexels) {
  if (!Number.isSafeInteger(numOccupied) || numOccupied <= 0) {
    throw new TypeError('numOccupied must be a positive safe integer');
  }
  if (!Number.isSafeInteger(batchTexels) || batchTexels <= 0) {
    throw new TypeError('batchTexels must be a positive safe integer');
  }
  return defineWebGpuCooperativeBoundaryManifest({
    manifestId: TEXTURE_BAKE_MANIFEST_ID,
    routeId: SF3D_ROUTE_ID,
    phases: [
      {
        phaseId: 'texture-bake',
        boundaries: [
          {
            boundaryId: TEXTURE_BAKE_BOUNDARY_ID,
            kind: 'gpu-command',
            unit: 'texel-batch',
            totalItems: numOccupied,
            progressWeight: numOccupied,
            commandDutyKind: 'compute',
            chunking: { mode: 'fixed', chunkItems: batchTexels },
            yieldPolicy: 'after-duty',
            resources: {
              retain: ['triplane.features', 'decoder.weights'],
              produce: ['texture.albedo', 'texture.normal'],
              release: [],
            },
          },
        ],
      },
    ],
    metadata: { source: 'sf3d-webgpu-cooperative-texture-bake' },
  });
}

/**
 * Build the `cooperativeBatch` callback that bakeTexture/decodeTexelFeatures
 * consumes. It runs a real cooperative execution over the texel boundary and,
 * for each batch, encodes+submits the decode duty (facade fences the queue
 * prefix) and then reads back that batch's outputs.
 *
 * @param {GPUDevice} device
 * @param {object} opts { batchTexels, schedulingMode, onProgress, signal, invocationId }
 * @returns {(numOccupied:number, makeBatch:(start,end)=>Promise<{encode,submit,readback}>)=>Promise<object>}
 *   The returned function resolves to the cooperative execution report.
 */
export function makeCooperativeTextureBake(device, opts = {}) {
  const {
    batchTexels = 16384,
    schedulingMode = 'cooperative',
    onProgress,
    signal,
    invocationId = `sf3d:texture-bake:${schedulingMode}`,
    onBrowserYield,
  } = opts;

  return async function cooperativeBatch(numOccupied, makeBatch) {
    const now = () => globalThis.performance?.now?.() ?? Date.now();
    const batch = Math.min(batchTexels, numOccupied);
    const manifest = defineTextureBakeManifest(numOccupied, batch);
    const ranges = [];
    const queueFences = [];
    const cleanupEvents = [];
    const scratch = {
      allocatedCount: 0,
      allocatedBytes: 0,
      retiredCount: 0,
      retiredBytes: 0,
      activeCount: 0,
      activeBytes: 0,
    };
    let activeRange = null;
    const unsubmittedScratch = [];
    const submittedScratch = [];

    const retireScratch = (resources, reason) => {
      const startedAtMs = now();
      let retiredBytes = 0;
      let retiredCount = 0;
      while (resources.length > 0) {
        const resource = resources[0];
        if (!resource || typeof resource.buffer?.destroy !== 'function') {
          throw new TypeError('scratch resource must expose buffer.destroy()');
        }
        resource.buffer.destroy();
        resources.shift();
        retiredBytes += resource.size;
        retiredCount += 1;
        scratch.retiredCount += 1;
        scratch.retiredBytes += resource.size;
        scratch.activeCount -= 1;
        scratch.activeBytes -= resource.size;
      }
      const completedAtMs = now();
      cleanupEvents.push({
        reason,
        retiredCount,
        retiredBytes,
        interval: { startMs: startedAtMs, endMs: completedAtMs },
      });
      return {
        retiredCount,
        retiredBytes,
        interval: { startMs: startedAtMs, endMs: completedAtMs },
      };
    };

    const runtime = createSf3dCooperativeRuntime(device, {
      foregroundOpportunities: opts.foregroundOpportunities ?? null,
      async onQueueFenceResolved(fence) {
        const retirement = retireScratch(submittedScratch, 'queue-prefix-resolved');
        queueFences.push({
          rangeIndex: activeRange?.rangeIndex ?? null,
          itemStart: activeRange?.itemStart ?? null,
          itemEnd: activeRange?.itemEnd ?? null,
          queueWaitMs: fence.queueWaitMs,
          queueInterval: {
            startMs: fence.startedAtMs,
            endMs: fence.completedAtMs,
          },
          retirementMs: retirement.interval.endMs - retirement.interval.startMs,
          retirementInterval: retirement.interval,
          retiredCount: retirement.retiredCount,
          retiredBytes: retirement.retiredBytes,
        });
      },
      async onBrowserYield(yieldEvent) {
        if (activeRange) {
          activeRange.browserYieldMs += yieldEvent.elapsedMs;
          activeRange.browserYieldIntervals.push({
            startMs: yieldEvent.startedAtMs,
            endMs: yieldEvent.completedAtMs,
          });
        }
        if (typeof onBrowserYield === 'function') await onBrowserYield(yieldEvent);
      },
    });
    const execution = createWebGpuCooperativeExecution({
      runtime, manifest, invocationId, schedulingMode, onProgress, signal,
    });

    try {
      await execution.run(async (cooperative) => {
        const gpu = cooperative.startBoundary(TEXTURE_BAKE_BOUNDARY_ID);
        let range;
        while ((range = gpu.nextRange()) != null) {
          const start = range.itemStart, end = range.itemEnd;
          const prepareEncodeStartedAtMs = now();
          const b = await makeBatch(start, end);
          const resources = Array.isArray(b.scratchResources) ? b.scratchResources : [];
          for (const resource of resources) {
            if (!Number.isFinite(resource?.size) || resource.size < 0) {
              throw new TypeError('scratch resource size must be a non-negative finite number');
            }
          }
          const allocatedBytes = resources.reduce((sum, resource) => sum + resource.size, 0);
          unsubmittedScratch.push(...resources);
          scratch.allocatedCount += resources.length;
          scratch.allocatedBytes += allocatedBytes;
          scratch.activeCount += resources.length;
          scratch.activeBytes += allocatedBytes;

          const rangeTelemetry = {
            rangeIndex: range.rangeIndex,
            itemStart: start,
            itemEnd: end,
            itemCount: range.itemCount,
            modelEncodeMs: Number.isFinite(b.hostEncodeMs) ? b.hostEncodeMs : null,
            hostEncodeMs: 0,
            dutyLifecycleMs: 0,
            dutyWallMs: 0,
            browserYieldMs: 0,
            prepareEncodeInterval: {
              startMs: prepareEncodeStartedAtMs,
              endMs: prepareEncodeStartedAtMs,
            },
            submitInterval: null,
            dutyLifecycleInterval: {
              startMs: 0,
              endMs: 0,
            },
            browserYieldIntervals: [],
            scratchAllocatedCount: resources.length,
            scratchAllocatedBytes: allocatedBytes,
          };
          activeRange = rangeTelemetry;
          const dutyStartedAtMs = now();
          rangeTelemetry.dutyLifecycleInterval.startMs = dutyStartedAtMs;
          try {
            // kit >=0.1.41: encode returns the command buffer; the kit submits it
            // (submit callbacks unsupported). The scratch-lifetime bookkeeping
            // that previously lived in the submit callback (marking this range's
            // scratch as submitted so the per-prefix retire can destroy it once
            // the queue prefix fences) moves into encode, right after the command
            // buffer is built — at which point the kit is about to submit it, so
            // the scratch is committed to queued work before onQueueFenceResolved.
            await gpu.runGpuDuty(range, {
              encode: () => {
                const submitStartedAtMs = now();
                try {
                  const commandBuffer = b.encode();
                  submittedScratch.push(...unsubmittedScratch);
                  unsubmittedScratch.length = 0;
                  return commandBuffer;
                } finally {
                  rangeTelemetry.prepareEncodeInterval.endMs = now();
                  rangeTelemetry.hostEncodeMs = (
                    rangeTelemetry.prepareEncodeInterval.endMs
                    - rangeTelemetry.prepareEncodeInterval.startMs
                  );
                  rangeTelemetry.submitInterval = {
                    startMs: submitStartedAtMs,
                    endMs: now(),
                  };
                }
              },
            });
          } finally {
            rangeTelemetry.dutyLifecycleInterval.endMs = now();
            rangeTelemetry.dutyLifecycleMs = (
              rangeTelemetry.dutyLifecycleInterval.endMs
              - rangeTelemetry.dutyLifecycleInterval.startMs
            );
            rangeTelemetry.dutyWallMs = rangeTelemetry.dutyLifecycleMs;
            ranges.push(rangeTelemetry);
            activeRange = null;
          }
          // No per-batch readback: each batch copies its decode into a shared GPU
          // buffer and the whole texture is read back once after the boundary.
        }
      });
    } catch (error) {
      const cleanup = {
        unsubmitted: null,
        recoveryFence: null,
        submitted: null,
      };
      try {
        if (unsubmittedScratch.length > 0) {
          cleanup.unsubmitted = retireScratch(unsubmittedScratch, 'failure-before-submit');
        }
        if (submittedScratch.length > 0) {
          const startedAtMs = now();
          let fenceError = null;
          try {
            await device.queue.onSubmittedWorkDone();
          } catch (recoveryError) {
            fenceError = recoveryError;
          }
          cleanup.recoveryFence = {
            startMs: startedAtMs,
            endMs: now(),
            status: fenceError ? 'rejected-device-unavailable' : 'resolved',
            error: fenceError?.message ?? null,
          };
          cleanup.submitted = retireScratch(
            submittedScratch,
            fenceError ? 'device-unavailable-after-recovery-fence' : 'terminal-recovery-fence',
          );
        }
      } catch (cleanupError) {
        cleanup.error = cleanupError.message;
      }
      error.textureBakeCleanup = Object.freeze(cleanup);
      throw error;
    }

    if (
      unsubmittedScratch.length !== 0
      || submittedScratch.length !== 0
      || scratch.activeCount !== 0
      || scratch.activeBytes !== 0
    ) {
      throw new Error('texture-bake scratch resources remained active after queue completion');
    }
    return Object.freeze({
      ...execution.finish(),
      textureBakeTelemetry: Object.freeze({
        schema: 'sf3d.texture-bake-duty-telemetry.v1',
        ranges: Object.freeze(ranges.map(range => Object.freeze({ ...range }))),
        queueFences: Object.freeze(queueFences.map(fence => Object.freeze({ ...fence }))),
        cleanupEvents: Object.freeze(cleanupEvents.map(event => Object.freeze({ ...event }))),
        scratch: Object.freeze({ ...scratch }),
      }),
    });
  };
}
