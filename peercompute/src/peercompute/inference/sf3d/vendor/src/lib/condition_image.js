import { prepareForeground } from './foreground_prepare.js';
import { resizeBlendNormalize } from './preprocess_core.js';
import { validatePreprocessReply } from './worker_reply_validation.js';

// One source preparation feeds both geometry and CLIP material estimation.
export function prepareConditionImage(srcFloat, srcW, srcH, size, bg, imageMean, imageStd) {
  const rgba = Uint8Array.from(srcFloat, x => Math.round(x * 255));
  const framed = prepareForeground(rgba, srcW, srcH, size);
  const normalized = Float32Array.from(framed.data, x => x / 255);
  return {
    chw: resizeBlendNormalize(normalized, size, size, size, bg, imageMean, imageStd),
    rgba: framed.data,
  };
}

export function validateConditionReply(reply, size) {
  const chw = validatePreprocessReply(reply, 3 * size * size);
  if (!(reply.rgbaBuffer instanceof ArrayBuffer) || reply.rgbaBuffer.byteLength !== 4 * size * size) {
    throw new Error('condition image reply must carry matching RGBA bytes');
  }
  return { chw, rgba: new Uint8Array(reply.rgbaBuffer) };
}
