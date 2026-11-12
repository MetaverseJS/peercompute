/**
 * Cooperative execution for the SF3D two-stream interleave transformer.
 *
 * The graph is cut only at dependency-safe stage boundaries. Legacy forward()
 * drives these same stages into one command encoder, so scheduling changes do
 * not create a second numerical implementation.
 */

import {
  createWebGpuCooperativeExecution,
  defineWebGpuCooperativeBoundaryManifest,
} from '@kaminos/webgpu-inference-kit';
import { createSf3dCooperativeRuntime, SF3D_ROUTE_ID } from './cooperative_dino.js';
import {
  TWO_STREAM_STAGE_IDS,
  createTwoStreamAttentionDutyPlan,
} from './two_stream.js';
import {captureGpuBufferAllocations} from './gpu.js';

export const TWO_STREAM_MANIFEST_ID = 'sf3d.two-stream-cooperative-boundaries.v0';
export const TWO_STREAM_BOUNDARY_ID = 'two-stream-stages';
export const TWO_STREAM_ATTENTION_MANIFEST_ID =
  'sf3d.two-stream-attention-cooperative-boundaries.v0';
export const TWO_STREAM_ATTENTION_BOUNDARY_ID = 'two-stream-attention-duties';
export const TWO_STREAM_DUTY_COUNT = TWO_STREAM_STAGE_IDS.length;
export { TWO_STREAM_STAGE_IDS };

export function defineTwoStreamManifest(options = {}) {
  const {
    dutyGranularity = 'stage',
    N_img,
    linearRowsPerDuty = 128,
    attentionRowsPerDuty = 128,
    residentFFN = false,
    reuseDeadTriplaneStorage = false,
    reuseAttentionResidualStorage = false,
    reuseAttentionQueryStorage = false,
    reuseAttentionProjectionStorage = false,
    reuseTokenizerSetupStorage = false,
  } = options;
  if (!['stage', 'attention-tile'].includes(dutyGranularity)) {
    throw new RangeError(`unknown two-stream duty granularity ${dutyGranularity}`);
  }
  const attentionPlan = dutyGranularity === 'attention-tile'
    ? createTwoStreamAttentionDutyPlan(N_img, { linearRowsPerDuty, attentionRowsPerDuty, residentFFN })
    : null;
  const boundaryId = attentionPlan ? TWO_STREAM_ATTENTION_BOUNDARY_ID : TWO_STREAM_BOUNDARY_ID;
  const totalItems = attentionPlan?.length ?? TWO_STREAM_DUTY_COUNT;
  return defineWebGpuCooperativeBoundaryManifest({
    manifestId: attentionPlan ? TWO_STREAM_ATTENTION_MANIFEST_ID : TWO_STREAM_MANIFEST_ID,
    routeId: SF3D_ROUTE_ID,
    phases: [
      {
        phaseId: 'two-stream-backbone',
        boundaries: [
          {
            boundaryId,
            kind: 'gpu-command',
            unit: attentionPlan ? 'two-stream-attention-duty' : 'two-stream-stage',
            totalItems,
            progressWeight: totalItems,
            commandDutyKind: 'compute',
            chunking: { mode: 'fixed', chunkItems: 1 },
            yieldPolicy: 'after-duty',
            resources: {
              retain: [
                'dinov2.tokens',
                'triplane.low-resolution',
                'two-stream.weights',
                'two-stream.intermediates',
              ],
              produce: ['two-stream.triplane-features'],
              release: [],
            },
          },
        ],
      },
    ],
    metadata: {
      source: 'sf3d-webgpu-cooperative-two-stream',
      dutyGranularity,
      linearRowsPerDuty: attentionPlan ? linearRowsPerDuty : null,
      attentionRowsPerDuty: attentionPlan ? attentionRowsPerDuty : null,
      residentFFN,
      reuseDeadTriplaneStorage,
      reuseAttentionResidualStorage,
      reuseAttentionQueryStorage,
      reuseAttentionProjectionStorage,
      reuseTokenizerSetupStorage,
    },
  });
}

export async function driveTwoStreamBoundary(cooperative, options) {
  const {
    encodeStage,
    now = () => globalThis.performance?.now?.() ?? Date.now(),
  } = options;
  if (options.submitStage != null) {
    throw new TypeError('submitStage is unsupported: the kit owns queue.submit (>=0.1.41); encodeStage must return the command buffer');
  }
  const gpu = cooperative.startBoundary(TWO_STREAM_BOUNDARY_ID);
  const telemetry = [];

  for (let stageIndex = 0; stageIndex < TWO_STREAM_DUTY_COUNT; stageIndex++) {
    const range = gpu.nextRange();
    if (!range) {
      throw new Error(`cooperative two-stream exhausted ranges before stage ${stageIndex}`);
    }
    if (range.itemStart !== stageIndex || range.itemEnd !== stageIndex + 1) {
      throw new Error(
        `cooperative two-stream range ${range.itemStart}-${range.itemEnd} `
        + `does not match stage ${stageIndex}`,
      );
    }

    const stageId = TWO_STREAM_STAGE_IDS[stageIndex];
    const timing = {
      stageIndex,
      stageId,
      dutyStartedAtMs: now(),
      encodeStartedAtMs: null,
      encodeCompletedAtMs: null,
      submitStartedAtMs: null,
      submitCompletedAtMs: null,
      dutyCompletedAtMs: null,
      encodeMs: null,
      submitMs: null,
      dutyMs: null,
    };

    // kit >=0.1.41: encode returns the command buffer; the kit submits it and
    // captures the queue-prefix fence. Submit timing stays null (kit-owned).
    await gpu.runGpuDuty(range, {
      encode() {
        timing.encodeStartedAtMs = now();
        const commandBuffer = encodeStage({ stageIndex, stageId, range });
        timing.encodeCompletedAtMs = now();
        timing.encodeMs = timing.encodeCompletedAtMs - timing.encodeStartedAtMs;
        return commandBuffer;
      },
    });

    timing.dutyCompletedAtMs = now();
    timing.dutyMs = timing.dutyCompletedAtMs - timing.dutyStartedAtMs;
    telemetry.push(Object.freeze(timing));
  }

  if (gpu.nextRange() != null) {
    throw new Error('cooperative two-stream left ranges unconsumed');
  }
  return {
    completedDuties: telemetry.length,
    totalDuties: TWO_STREAM_DUTY_COUNT,
    telemetry: Object.freeze(telemetry),
  };
}

export async function driveTwoStreamAttentionBoundary(cooperative, options) {
  const {
    plan,
    encodeDuty,
    now = () => globalThis.performance?.now?.() ?? Date.now(),
  } = options;
  if (options.submitDuty != null) {
    throw new TypeError('submitDuty is unsupported: the kit owns queue.submit (>=0.1.41); encodeDuty must return the command buffer');
  }
  const gpu = cooperative.startBoundary(TWO_STREAM_ATTENTION_BOUNDARY_ID);
  const telemetry = [];

  const runDuty=async duty=>{
    await options.beforeDuty?.(duty);
    const range = gpu.nextRange();
    if (!range) {
      throw new Error(
        `cooperative two-stream attention exhausted ranges before duty ${duty.dutyIndex}`,
      );
    }
    if (range.itemStart !== duty.dutyIndex || range.itemEnd !== duty.dutyIndex + 1) {
      throw new Error(
        `cooperative two-stream attention range ${range.itemStart}-${range.itemEnd} `
        + `does not match duty ${duty.dutyIndex}`,
      );
    }
    const timing = {
      dutyIndex: duty.dutyIndex,
      dutyId: duty.dutyId,
      kind: duty.kind,
      ownerId: duty.ownerId ?? null,
      tileIndex: duty.tileIndex ?? null,
      tileCount: duty.tileCount ?? null,
      rangeIndex: duty.rangeIndex ?? null,
      rangeCount: duty.rangeCount ?? null,
      rowStart: duty.rowStart ?? null,
      rowCount: duty.rowCount ?? null,
      rowEnd: duty.rowEnd ?? null,
      dutyStartedAtMs: now(),
      encodeStartedAtMs: null,
      encodeCompletedAtMs: null,
      submitStartedAtMs: null,
      submitCompletedAtMs: null,
      dutyCompletedAtMs: null,
      encodeMs: null,
      submitMs: null,
      dutyMs: null,
    };

    // kit >=0.1.41: encode returns the command buffer; the kit submits it.
    await gpu.runGpuDuty(range, {
      encode() {
        timing.encodeStartedAtMs = now();
        const commandBuffer = encodeDuty({ duty, range });
        timing.encodeCompletedAtMs = now();
        timing.encodeMs = timing.encodeCompletedAtMs - timing.encodeStartedAtMs;
        return commandBuffer;
      },
    });
    timing.dutyCompletedAtMs = now();
    timing.dutyMs = timing.dutyCompletedAtMs - timing.dutyStartedAtMs;
    telemetry.push(Object.freeze(timing));
    await options.afterDuty?.(duty);
  };
  for(const group of groupTwoStreamDuties(plan)){
    const work=async()=>{for(const duty of group.duties)await runDuty(duty);};
    if(options.withDutyGroup)await options.withDutyGroup(group,work);
    else await work();
  }

  if (gpu.nextRange() != null) {
    throw new Error('cooperative two-stream attention left ranges unconsumed');
  }
  return {
    completedDuties: telemetry.length,
    totalDuties: plan.length,
    telemetry: Object.freeze(telemetry),
  };
}

/** Exact existing stages remain the weight-lifetime groups of the fine plan. */
export function groupTwoStreamDuties(plan){
  const groups=[];
  for(const duty of plan){
    const stageId=duty.kind==='setup'||duty.kind==='final'?duty.kind:
      duty.basic!=null?`block-${duty.block}-basic-${duty.basic}`:
      duty.kind==='attention-tile'?duty.ownerId.replace(/-(self|cross)$/,''):
      `block-${duty.block}-fuse-${duty.direction}`;
    if(groups.at(-1)?.stageId!==stageId)groups.push({stageId,duties:[]});
    groups.at(-1).duties.push(duty);
  }
  return groups;
}

/** Unresolved queue/destruction failures stay reachable on the actual backbone. */
export async function retireTwoStreamWork(backbone,keep=new Set()){
  const owner=backbone._residentWorkOwner;
  if(!owner&&!backbone._failedUniforms?.size)return;
  if(owner){
    for(const allocation of owner.allocations)owner.buffers.add(allocation.buffer);
    owner.allocations.length=0;
  }
  await backbone.device.queue.onSubmittedWorkDone();
  const errors=[];
  for(const buffer of backbone._failedUniforms??[]){
    try{buffer.destroy();backbone._failedUniforms.delete(buffer);}
    catch(error){errors.push(error);}
  }
  for(const buffer of owner?.buffers??[])if(!keep.has(buffer)){
    try{
      buffer.destroy();owner.buffers.delete(buffer);
      if(backbone._zeroBias===buffer){backbone._zeroBias=null;backbone._zeroBiasSize=0;}
      for(const [key,value] of Object.entries(backbone._diagnosticBuffers??{}))
        if(value===buffer)delete backbone._diagnosticBuffers[key];
    }catch(error){errors.push(error);}
  }
  if(errors.length)throw new AggregateError(errors,'two-stream work retirement failed');
  if(!owner||owner.buffers.size===0)backbone._residentWorkOwner=null;
}

function liveWorkBuffers(state,backbone){
  const keep=new Set(),seen=new Set(),owned=backbone._residentWorkOwner.buffers;
  const visit=value=>{
    if(!value||typeof value!=='object'||seen.has(value))return;
    seen.add(value);if(owned.has(value)){keep.add(value);return;}
    for(const [key,child] of Object.entries(value))if(key!=='weights'&&key!=='attnWeights')visit(child);
  };
  for(const value of [state.currentLatent,state.currentTriplane,state.activeOperation,state.result,backbone._zeroBias])visit(value);
  return keep;
}

export async function runCooperativeTwoStream(options) {
  const {
    device,
    backbone,
    imageTokensBuf,
    N_img,
    weights,
    schedulingMode = 'cooperative',
    dutyGranularity = 'stage',
    linearRowsPerDuty = 128,
    attentionRowsPerDuty = 128,
    residentFFN = false,
    retireIntermediateBuffers = false,
    reuseDeadTriplaneStorage = false,
    reuseAttentionResidualStorage = false,
    reuseAttentionQueryStorage = false,
    reuseAttentionProjectionStorage = false,
    reuseTokenizerSetupStorage = false,
    rematerializeTokenizerEmbedding = false,
    withGroupWeights = null,
    onProgress,
    signal,
    invocationId = `sf3d:two-stream:${schedulingMode}`,
  } = options;
  if (!['stage', 'attention-tile'].includes(dutyGranularity)) {
    throw new RangeError(`unknown two-stream duty granularity ${dutyGranularity}`);
  }
  if((residentFFN||retireIntermediateBuffers||withGroupWeights)&&dutyGranularity!=='attention-tile')
    throw TypeError('resident lifetimes require the exact attention-tile plan');
  if(typeof reuseDeadTriplaneStorage!=='boolean'||(reuseDeadTriplaneStorage&&
    (!residentFFN||!retireIntermediateBuffers||dutyGranularity!=='attention-tile')))
    throw TypeError('dead-triplane reuse requires explicit resident FFN and owned work retirement');
  if(typeof reuseAttentionResidualStorage!=='boolean'||(reuseAttentionResidualStorage&&!reuseDeadTriplaneStorage))
    throw TypeError('attention residual reuse requires explicit owned dead-triplane reuse');
  if(typeof reuseAttentionQueryStorage!=='boolean'||(reuseAttentionQueryStorage&&(!residentFFN||!retireIntermediateBuffers||dutyGranularity!=='attention-tile')))
    throw TypeError('attention query storage reuse requires owned resident attention duties');
  if(typeof reuseAttentionProjectionStorage!=='boolean'||(reuseAttentionProjectionStorage&&
    (!reuseAttentionQueryStorage||!reuseAttentionResidualStorage)))
    throw TypeError('attention projection row reuse requires owned query and residual reuse');
  if(withGroupWeights!==null&&typeof withGroupWeights!=='function')throw TypeError('withGroupWeights must be a function');
  if(typeof reuseTokenizerSetupStorage!=='boolean'||(reuseTokenizerSetupStorage&&
    (!residentFFN||!retireIntermediateBuffers||!withGroupWeights||!rematerializeTokenizerEmbedding||
      dutyGranularity!=='attention-tile')))
    throw TypeError('tokenizer setup reuse requires owned resident work and canonical rematerialization');
  if(backbone._residentWorkOwner||backbone._failedUniforms?.size)throw Error('two-stream work cleanup is quarantined');
  const attentionPlan = dutyGranularity === 'attention-tile'
    ? createTwoStreamAttentionDutyPlan(N_img, { linearRowsPerDuty, attentionRowsPerDuty, residentFFN })
    : null;
  const now = () => globalThis.performance?.now?.() ?? Date.now();
  const queueFences = [];
  const browserYields = [];
  let activeStage = null;
  const runtime = createSf3dCooperativeRuntime(device, {
    foregroundOpportunities: options.foregroundOpportunities ?? null,
    onQueueFenceResolved(event) {
      queueFences.push(Object.freeze({ ...activeStage, ...event }));
    },
    onBrowserYield(event) {
      browserYields.push(Object.freeze({ ...activeStage, ...event }));
    },
  });
  const execution = createWebGpuCooperativeExecution({
    runtime,
    manifest: defineTwoStreamManifest({
      dutyGranularity,
      N_img,
      linearRowsPerDuty,
      attentionRowsPerDuty,
      residentFFN,
      reuseDeadTriplaneStorage,
      reuseAttentionResidualStorage,
      reuseAttentionQueryStorage,
      reuseAttentionProjectionStorage,
      reuseTokenizerSetupStorage,
    }),
    invocationId,
    schedulingMode,
    onProgress,
    signal,
  });
  const state = attentionPlan
    ? backbone.createAttentionForwardState(
      imageTokensBuf,
      N_img,
      weights,
      { linearRowsPerDuty, attentionRowsPerDuty, residentFFN, reuseDeadTriplaneStorage, reuseAttentionResidualStorage,reuseAttentionQueryStorage,reuseAttentionProjectionStorage,
        reuseTokenizerSetupStorage,rematerializeTokenizerEmbedding },
    )
    : backbone.createForwardState(imageTokensBuf, N_img, weights);
  let stageTelemetry = [];
  if(attentionPlan&&JSON.stringify(state.finePlan)!==JSON.stringify(attentionPlan))
    throw Error('backbone effective plan differs from declared cooperative plan');
  if(attentionPlan&&(state.reuseAttentionQueryStorage??false)!==reuseAttentionQueryStorage)
    throw Error('backbone effective attention query reuse differs from requested configuration');
  if(attentionPlan&&(state.reuseAttentionProjectionStorage??false)!==reuseAttentionProjectionStorage)
    throw Error('backbone effective attention projection row reuse differs from requested configuration');
  const owner=retireIntermediateBuffers?{allocations:[],buffers:new Set()}:null;
  if(owner)backbone._residentWorkOwner=owner;
  let succeeded=false,failure,failed=false;
  const storageReuse=[];
  const attentionResidualReuse=[];
  const attentionProjectionReuse=[];
  let tokenizerSetupStorageReuse=null;
  const record=fn=>owner?captureGpuBufferAllocations(fn,{ownedAllocations:owner.allocations}).value:fn();

  try{
  await execution.run(async cooperative => {
    const driven = attentionPlan
      ? await driveTwoStreamAttentionBoundary(cooperative, {
        plan: attentionPlan,
        now,
        beforeDuty:options.onBeforeDuty?duty=>options.onBeforeDuty(duty,state):null,
        withDutyGroup:withGroupWeights?async(group,work)=>withGroupWeights(group,async phaseWeights=>{
          state.weights=phaseWeights;return work();
        }):null,
        async afterDuty(duty){
          if(owner){
            for(const allocation of owner.allocations)owner.buffers.add(allocation.buffer);
            owner.allocations.length=0;
            if(reuseTokenizerSetupStorage&&duty.kind==='setup')
              tokenizerSetupStorageReuse={...state.tokenizerSetupStorageReuse,status:'completed-prefix',afterDutyIndex:duty.dutyIndex};
            if(reuseAttentionProjectionStorage&&duty.kind==='fuse-attention-linear-range'&&duty.rangeIndex===duty.rangeCount-1)
              attentionProjectionReuse.push(backbone._markFineAttentionProjectionReusable(state,duty));
            if(reuseAttentionResidualStorage&&duty.kind==='fuse-attention-linear-range'&&duty.rangeIndex===duty.rangeCount-1)
              attentionResidualReuse.push(backbone._markFineAttentionResidualReusable(state,duty));
            if(reuseDeadTriplaneStorage&&duty.kind==='fuse-residual-norm')
              storageReuse.push(backbone._markFineFuseStorageReusable(state,duty));
            await retireTwoStreamWork(backbone,liveWorkBuffers(state,backbone));
          }
          await options.onAfterDuty?.(duty,state);
        },
        encodeDuty({ duty }) {
          activeStage = {
            dutyIndex: duty.dutyIndex,
            dutyId: duty.dutyId,
            kind: duty.kind,
            ownerId: duty.ownerId ?? null,
            tileIndex: duty.tileIndex ?? null,
            tileCount: duty.tileCount ?? null,
            rangeIndex: duty.rangeIndex ?? null,
            rangeCount: duty.rangeCount ?? null,
            rowStart: duty.rowStart ?? null,
            rowCount: duty.rowCount ?? null,
            rowEnd: duty.rowEnd ?? null,
          };
          const encoder = device.createCommandEncoder({
            label: `two-stream-${duty.dutyIndex}-${duty.dutyId}`,
          });
          record(()=>backbone.dispatchAttentionForwardDuty(encoder, state, duty.dutyIndex));
          return encoder.finish();
        },
      })
      : await driveTwoStreamBoundary(cooperative, {
        now,
        encodeStage({ stageIndex, stageId }) {
          activeStage = { stageIndex, stageId };
          const encoder = device.createCommandEncoder({
            label: `two-stream-${stageIndex}-${stageId}`,
          });
          backbone.dispatchForwardStage(encoder, state, stageIndex);
          return encoder.finish();
        },
      });
    stageTelemetry = driven.telemetry;
  });

  activeStage = null;
  const result = backbone.getForwardResult(state);
  succeeded=true;
  return {
    result,
    report: Object.freeze({
      ...execution.finish(),
      adapterTelemetry: Object.freeze({
        dutyGranularity,
        residentFFN,
        reuseDeadTriplaneStorage,
        storageReuse:Object.freeze(storageReuse),
        reuseAttentionResidualStorage,
        reuseAttentionQueryStorage:state.reuseAttentionQueryStorage??false,
        reuseAttentionProjectionStorage:state.reuseAttentionProjectionStorage??false,
        attentionProjectionReuse:Object.freeze(attentionProjectionReuse),
        attentionResidualReuse:Object.freeze(attentionResidualReuse),
        reuseTokenizerSetupStorage,
        tokenizerSetupStorageReuse,
        linearRowsPerDuty:attentionPlan?linearRowsPerDuty:null,
        attentionRowsPerDuty:attentionPlan?attentionRowsPerDuty:null,
        declaredDutyCount: attentionPlan?.length ?? TWO_STREAM_DUTY_COUNT,
        stageDuties: Object.freeze(stageTelemetry),
        queueFences: Object.freeze(queueFences),
        browserYields: Object.freeze(browserYields),
      }),
    }),
  };
  }catch(error){failed=true;failure=error;throw error;}
  finally{
    if(owner){
      try{
        await retireTwoStreamWork(backbone,succeeded?new Set([state.result?.buffer]):new Set());
        // Ownership of the one complete returned output transfers only if
        // cleanup succeeded. A rejected return leaves that output recoverable.
        backbone._residentWorkOwner=null;
      }catch(error){
        throw failed?new AggregateError([failure,error],'two-stream failed and cleanup is unresolved',{cause:failure}):error;
      }
    }
  }
}
