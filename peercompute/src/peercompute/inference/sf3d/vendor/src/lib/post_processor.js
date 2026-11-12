/**
 * post_processor.js — PixelShuffle upsampling network for SF3D triplane features.
 *
 * Architecture (from network.py PixelShuffleUpsampleNetwork):
 *   Input: [1024, 27648] channel-first triplane features from backbone
 *   Reshape to 3 planes: [3, 1024, 96, 96]
 *   Per-plane processing (shared weights):
 *     Conv2d(1024→1024, 3×3, pad=1) + ReLU  ×3
 *     Conv2d(1024→640, 3×3, pad=1)           (640 = 40 * 4²)
 *     PixelShuffle(4)                         → [40, 384, 384]
 *   Output: [3, 40, 384, 384] triplane feature planes
 */

import { createEmptyBuffer, createUniformBuffer } from './gpu.js';
import {
  dispatchActivation,
  dispatchConv2d,
  dispatchConv2dChannelRange,
  dispatchPixelShuffle,
} from './shader_ops.js';

const POST_CONFIG = {
  inChannels: 1024,
  outChannels: 40,
  scaleFactor: 4,
  convLayers: 4,
  kernelSize: 3,
  planeSize: 96,
  // output_channels = out_channels * scale_factor² = 40 * 16 = 640
  lastConvOut: 640,
};

export const POST_PROCESSOR_PLANE_STAGE_IDS = Object.freeze([
  'gather',
  'conv-0-relu',
  'conv-1-relu',
  'conv-2-relu',
  'conv-3',
  'pixel-shuffle-copy',
]);

export const POST_PROCESSOR_CONV_OUTPUT_CHANNELS = Object.freeze([
  POST_CONFIG.inChannels,
  POST_CONFIG.inChannels,
  POST_CONFIG.inChannels,
  POST_CONFIG.lastConvOut,
]);

/**
 * Dispatch the post-processor for all 3 triplane planes.
 *
 * @param {GPUDevice} device
 * @param {GPUCommandEncoder} encoder
 * @param {GPUBuffer} triplanesBuf - [1024, 27648] channel-first backbone output
 * @param {Object} weights - post_processor weights from loadWeights
 * @returns {{ buffer: GPUBuffer, C: number, H: number, W: number }} - [3, 40, 384, 384]
 */
export function createPostProcessorOutput(device) {
  const { outChannels, scaleFactor, planeSize } = POST_CONFIG;
  const outH = planeSize * scaleFactor; // 384
  const outW = planeSize * scaleFactor; // 384
  const outPlaneElements = outChannels * outH * outW;

  // Output buffer for all 3 planes: [3, 40, 384, 384]
  const outputBuf = createEmptyBuffer(device, 3 * outPlaneElements * 4);
  return {
    buffer: outputBuf,
    C: outChannels,
    H: outH,
    W: outW,
    numPlanes: 3,
  };
}

/**
 * Encode one dependency-independent triplane plane into a caller-owned output.
 *
 * The four convolutions inside a plane remain sequential and therefore stay in
 * one command buffer for this first cooperative cut. Different planes share
 * weights but no intermediate buffers, so command boundaries between planes do
 * not change numerical ordering or output layout.
 */
export function dispatchPostProcessorPlane(
  device,
  encoder,
  triplanesBuf,
  weights,
  output,
  plane,
) {
  const state = createPostProcessorPlaneState(
    device,
    triplanesBuf,
    weights,
    output,
    plane,
  );
  for (let stageIndex = 0; stageIndex < POST_PROCESSOR_PLANE_STAGE_IDS.length; stageIndex++) {
    dispatchPostProcessorPlaneStage(device, encoder, state, stageIndex);
  }
}

/**
 * Create the persistent state that crosses command boundaries for one plane.
 *
 * Buffer allocation remains inside the stage that first produces each value,
 * so constructing state does not silently perform GPU work or front-load memory.
 */
export function createPostProcessorPlaneState(
  device,
  triplanesBuf,
  weights,
  output,
  plane,
) {
  if (!Number.isSafeInteger(plane) || plane < 0 || plane >= 3) {
    throw new RangeError('postprocessor plane must be an integer in [0, 3)');
  }
  if (!device || !triplanesBuf || !weights || !output?.buffer) {
    throw new TypeError('postprocessor plane state requires device, input, weights, and output');
  }
  if (!Array.isArray(weights.convLayers) || weights.convLayers.length !== POST_CONFIG.convLayers) {
    throw new RangeError(`postprocessor requires exactly ${POST_CONFIG.convLayers} convolution layers`);
  }
  return {
    device,
    triplanesBuf,
    weights,
    output,
    plane,
    nextStageIndex: 0,
    channelStage: null,
    current: null,
    complete: false,
  };
}

/**
 * Encode one exact channel-plan duty for one plane.
 */
export function dispatchPostProcessorChannelDuty(device, encoder, state, duty) {
  if (device !== state?.device) {
    throw new Error('postprocessor plane state belongs to a different GPUDevice');
  }
  if (!duty || duty.plane !== state.plane) {
    throw new Error(`postprocessor channel duty belongs to plane ${duty?.plane}`);
  }
  if (duty.kind === 'gather') {
    if (duty.stageIndex !== 0 || state.nextStageIndex !== 0 || state.channelStage) {
      throw new Error(`postprocessor plane ${state.plane} expected gather stage 0`);
    }
    return dispatchPostProcessorPlaneStage(device, encoder, state, 0);
  }
  if (duty.kind === 'pixel-shuffle-copy') {
    if (duty.stageIndex !== 5 || state.nextStageIndex !== 5 || state.channelStage) {
      throw new Error(`postprocessor plane ${state.plane} expected PixelShuffle stage 5`);
    }
    return dispatchPostProcessorPlaneStage(device, encoder, state, 5);
  }
  if (duty.kind !== 'conv-range') {
    throw new Error(`unsupported postprocessor channel duty kind ${duty.kind}`);
  }
  if (!Number.isSafeInteger(duty.stageIndex)
      || duty.stageIndex < 1
      || duty.stageIndex > 4
      || duty.stageIndex !== state.nextStageIndex) {
    throw new Error(
      `postprocessor plane ${state.plane} expected stage ${state.nextStageIndex}, `
      + `got ${duty.stageIndex}`,
    );
  }

  const layerIndex = duty.stageIndex - 1;
  const totalChannels = POST_PROCESSOR_CONV_OUTPUT_CHANNELS[layerIndex];
  const isLast = layerIndex === POST_CONFIG.convLayers - 1;
  if (duty.layerIndex !== layerIndex
      || duty.totalChannels !== totalChannels
      || !Number.isSafeInteger(duty.rangeIndex)
      || !Number.isSafeInteger(duty.rangeCount)
      || duty.rangeCount <= 0
      || !Number.isSafeInteger(duty.channelStart)
      || !Number.isSafeInteger(duty.channelCount)
      || duty.channelCount <= 0
      || duty.channelEnd !== duty.channelStart + duty.channelCount
      || duty.channelEnd > totalChannels) {
    throw new Error(`invalid postprocessor channel duty for ${duty.stageId}`);
  }

  if (!state.channelStage) {
    if (duty.rangeIndex !== 0 || duty.channelStart !== 0) {
      throw new Error(`postprocessor ${duty.stageId} must begin at output channel 0`);
    }
    const input = state.current;
    if (!input?.buffer) {
      throw new Error(`postprocessor ${duty.stageId} has no input buffer`);
    }
    const outH = Math.floor((input.outH + 2 - 3) / 1) + 1;
    const outW = Math.floor((input.outW + 2 - 3) / 1) + 1;
    const outputBuffer = createEmptyBuffer(device, totalChannels * outH * outW * 4);
    state.channelStage = {
      layerIndex,
      stageIndex: duty.stageIndex,
      stageId: duty.stageId,
      rangeCount: duty.rangeCount,
      nextRangeIndex: 0,
      nextChannelStart: 0,
      input,
      outputBuffer,
      outC: totalChannels,
      outH,
      outW,
    };
  }

  const active = state.channelStage;
  if (active.layerIndex !== layerIndex
      || active.stageIndex !== duty.stageIndex
      || active.stageId !== duty.stageId
      || active.rangeCount !== duty.rangeCount
      || duty.rangeIndex !== active.nextRangeIndex
      || duty.channelStart !== active.nextChannelStart) {
    throw new Error(
      `postprocessor ${duty.stageId} expected range ${active.nextRangeIndex} `
      + `at channel ${active.nextChannelStart}`,
    );
  }

  dispatchConv2dChannelRange(
    device,
    encoder,
    active.input.buffer,
    state.weights.convLayers[layerIndex].weight,
    state.weights.convLayers[layerIndex].bias,
    active.outputBuffer,
    {
      inC: active.input.outC,
      inH: active.input.outH,
      inW: active.input.outW,
      outC: totalChannels,
      kH: 3,
      kW: 3,
      padH: 1,
      padW: 1,
      strideH: 1,
      strideW: 1,
      applyRelu: !isLast,
      resourceContext: state.resourceContext,
    },
    {
      channelStart: duty.channelStart,
      channelCount: duty.channelCount,
    },
  );
  active.nextRangeIndex++;
  active.nextChannelStart = duty.channelEnd;
  const rangeComplete = active.nextRangeIndex === active.rangeCount;
  const channelsComplete = active.nextChannelStart === totalChannels;
  if (rangeComplete !== channelsComplete) {
    throw new Error(`postprocessor ${duty.stageId} range count disagrees with channel coverage`);
  }
  if (rangeComplete) {
    state.current = {
      buffer: active.outputBuffer,
      outC: totalChannels,
      outH: active.outH,
      outW: active.outW,
    };
    state.channelStage = null;
    state.nextStageIndex++;
  }
  return {
    plane: state.plane,
    stageIndex: duty.stageIndex,
    stageId: duty.stageId,
    rangeIndex: duty.rangeIndex,
    rangeCount: duty.rangeCount,
    channelStart: duty.channelStart,
    channelEnd: duty.channelEnd,
    complete: state.complete,
  };
}

/**
 * Encode one exact stage for one plane.
 *
 * The caller may invoke all stages into one encoder (legacy route) or finish
 * and submit after each stage (cooperative route). State enforces the dependency
 * order so skipped, repeated, or out-of-order command duties fail loud.
 */
export function dispatchPostProcessorPlaneStage(device, encoder, state, stageIndex) {
  if (device !== state?.device) {
    throw new Error('postprocessor plane state belongs to a different GPUDevice');
  }
  if (!Number.isSafeInteger(stageIndex)
      || stageIndex < 0
      || stageIndex >= POST_PROCESSOR_PLANE_STAGE_IDS.length) {
    throw new RangeError(
      `postprocessor stage must be an integer in [0, ${POST_PROCESSOR_PLANE_STAGE_IDS.length})`,
    );
  }
  if (stageIndex !== state.nextStageIndex) {
    throw new Error(
      `postprocessor plane ${state.plane} expected stage ${state.nextStageIndex}, got ${stageIndex}`,
    );
  }

  const {
    inChannels,
    scaleFactor,
    planeSize,
    lastConvOut,
  } = POST_CONFIG;
  const planePixels = planeSize * planeSize;
  const planeElements = inChannels * planePixels;

  if (stageIndex === 0) {
    const planeBuf = createEmptyBuffer(device, planeElements * 4);
    _dispatchGatherPlane(
      device,
      encoder,
      state.triplanesBuf,
      planeBuf,
      inChannels,
      planeSize * planeSize * 3,
      state.plane * planePixels,
      planePixels,
      state.resourceContext,
    );
    state.current = {
      buffer: planeBuf,
      outC: inChannels,
      outH: planeSize,
      outW: planeSize,
    };
  } else if (stageIndex <= 4) {
    const layerIndex = stageIndex - 1;
    const isLast = layerIndex === POST_CONFIG.convLayers - 1;
    const curOutC = isLast ? lastConvOut : inChannels;
    const convResult = dispatchConv2d(
      device,
      encoder,
      state.current.buffer,
      state.weights.convLayers[layerIndex].weight,
      state.weights.convLayers[layerIndex].bias,
      {
        inC: state.current.outC,
        inH: state.current.outH,
        inW: state.current.outW,
        outC: curOutC,
        kH: 3,
        kW: 3,
        padH: 1,
        padW: 1,
        strideH: 1,
        strideW: 1,
      },
    );
    if (isLast) {
      state.current = {
        buffer: convResult.buffer,
        outC: curOutC,
        outH: convResult.outH,
        outW: convResult.outW,
      };
    } else {
      const reluBuf = dispatchActivation(
        device,
        encoder,
        convResult.buffer,
        null,
        curOutC * convResult.outH * convResult.outW,
        0,
      );
      state.current = {
        buffer: reluBuf,
        outC: curOutC,
        outH: convResult.outH,
        outW: convResult.outW,
      };
    }
  } else {
    const psResult = dispatchPixelShuffle(device, encoder, state.current.buffer, {
      inC: lastConvOut,
      inH: planeSize,
      inW: planeSize,
      scaleFactor,
      resourceContext: state.resourceContext,
    });
    const outPlaneElements = state.output.C * state.output.H * state.output.W;
    const outOffset = state.plane * outPlaneElements * 4;
    encoder.copyBufferToBuffer(
      psResult.buffer,
      0,
      state.output.buffer,
      outOffset,
      outPlaneElements * 4,
    );
    state.complete = true;
  }

  state.nextStageIndex++;
  return {
    plane: state.plane,
    stageIndex,
    stageId: POST_PROCESSOR_PLANE_STAGE_IDS[stageIndex],
    complete: state.complete,
  };
}

export function dispatchPostProcessor(device, encoder, triplanesBuf, weights) {
  const output = createPostProcessorOutput(device);

  // Preserve the legacy route exactly: all three planes are still encoded into
  // the caller's one command encoder and submitted by the caller as one buffer.
  for (let plane = 0; plane < output.numPlanes; plane++) {
    dispatchPostProcessorPlane(device, encoder, triplanesBuf, weights, output, plane);
  }

  return output;
}

// --- Internal: gather one triplane plane from strided layout ---

let _gatherPipeline = null;

function _dispatchGatherPlane(device, encoder, srcBuf, dstBuf, numChannels, totalSpatial, spatialOffset, spatialSize, resourceContext = null) {
  if (resourceContext && (resourceContext.device !== device
      || !(resourceContext.pipelines instanceof Map))) throw new Error('gather resource context belongs to another device');
  let pipeline = resourceContext ? resourceContext.pipelines.get('gather') : _gatherPipeline;
  // Gather: for each channel c and spatial index s in [0, spatialSize):
  //   dst[c * spatialSize + s] = src[c * totalSpatial + spatialOffset + s]
  if (!pipeline) {
    pipeline = device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: device.createShaderModule({
          code: `
            struct P { numChannels: u32, totalSpatial: u32, spatialOffset: u32, spatialSize: u32, numWgX: u32 }
            @group(0) @binding(0) var<uniform> p: P;
            @group(0) @binding(1) var<storage, read> src: array<f32>;
            @group(0) @binding(2) var<storage, read_write> dst: array<f32>;
            @compute @workgroup_size(256)
            fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
              let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
              let total = p.numChannels * p.spatialSize;
              if (idx >= total) { return; }
              let c = idx / p.spatialSize;
              let s = idx % p.spatialSize;
              dst[c * p.spatialSize + s] = src[c * p.totalSpatial + p.spatialOffset + s];
            }
          `,
        }),
        entryPoint: 'main',
      },
    });
    if (resourceContext) resourceContext.pipelines.set('gather', pipeline);
    else _gatherPipeline = pipeline;
  }

  const total = numChannels * spatialSize;
  const totalWG = Math.ceil(total / 256);
  const wgX = Math.min(totalWG, 65535);
  const wgY = Math.ceil(totalWG / 65535);

  const params = createUniformBuffer(device,
    new Uint32Array([numChannels, totalSpatial, spatialOffset, spatialSize, wgX]),
    'post-processor-gather-uniform');

  const bg = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: params } },
      { binding: 1, resource: { buffer: srcBuf } },
      { binding: 2, resource: { buffer: dstBuf } },
    ],
  });

  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bg);
  pass.dispatchWorkgroups(wgX, wgY);
  pass.end();
}
