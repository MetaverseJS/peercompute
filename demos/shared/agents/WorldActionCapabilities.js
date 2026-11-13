import { routeInferenceTask } from '../../../peercompute/src/peercompute/inference/InferenceRouter.js';

function provider(targets, task, mode) {
  if (!Array.isArray(targets)) return 'unknown';
  try { routeInferenceTask({ task, mode, candidates: targets }); return 'ready'; }
  catch (error) {
    if (error.code === 'ERR_INFERENCE_BUSY') return 'busy';
    if (error.code === 'ERR_INFERENCE_NO_MODEL') return 'not-advertised';
    return 'unknown';
  }
}

/** Host facts for speech, not action authorization or a generated tool call.
 * Uses the same pure routing admission as execution, on an already cached
 * directory. No discovery, service loading or inference takes place here. */
export function worldActionCapabilityFacts({ allowObject = false, allowAvatar = false,
  inferenceMode, targets, hasImage = false, allowPlacement = false, allowResize = false } = {}) {
  if (allowObject !== true && allowAvatar !== true) return '';
  const mode = inferenceMode === 'local-only' ? 'local' : inferenceMode === 'network-assisted' ? 'mixed' : null;
  const image = hasImage === true ? 'supplied (skip image generation)' : mode ? provider(targets, 'text-to-image', mode) : 'unknown';
  const mesh = mode ? provider(targets, 'image-to-3d', mode) : 'unknown';
  const tools = [allowObject === true && (allowPlacement === true ? 'create/place virtual 3D objects at observed places or beside people'
    : 'create/place nearby virtual 3D objects'), allowAvatar === true && 'replace avatar'].filter(Boolean).join('; ');
  return `Host tools: ${tools}. Cached providers (${mode === 'local' ? 'local-only' : mode === 'mixed' ? 'network-assisted' : 'policy unknown'}): image=${image}, mesh=${mesh}. `
    + (allowResize ? 'Existing owned objects can be resized without image or mesh inference. ' : '')
    + 'Not physical manufacturing. Missing/busy means wait. Describe attempts; claim completion only with verified receipts.';
}
