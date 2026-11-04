import { CID } from 'multiformats/cid';
import { lpStream } from '@libp2p/utils';
import { MODEL_POLICY, validateSessionId } from '../../inference/modelManifest.js';
import { normalizeModelMessages, validateImageInput } from '../../inference/modelTask.js';

// v2 distinguishes image output from vision input and adds credited result frames.
// A v1 reader discards those capabilities, so it must not discover a v2 image host.
export const PEER_INFERENCE_PROTOCOL = '/peercompute/inference/2.0.0';
// Original v2 hosts omit this capability and reject requests above 256 tokens.
export const LEGACY_MAX_NEW_TOKENS = 256;
export const PEER_INFERENCE_LIMITS = Object.freeze({ frameBytes: 128 * 1024, imageChunkBytes: 64 * 1024,
  maximumPeers: 32, maximumModels: 128, maximumInbound: 5, maximumPerPeer: 2,
  maximumOutbound: 5, queryTimeoutMs: 5000, requestTimeoutMs: 120000, recordTtlMs: 15000 });
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });
export const bytes = (text) => encoder.encode(text).length;
export const cid = (value) => CID.parse(string(value, 128)).toV1().toString();
export function string(value, maximum = 256) {
  if (typeof value !== 'string' || !value.length || bytes(value) > maximum) throw new Error('Invalid inference text field');
  return value;
}
export function integer(value, maximum, minimum = 0) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) throw new Error('Invalid inference numeric field');
  return value;
}
export function encryptedConnection(connection) {
  return connection?.status === 'open' && Boolean(connection.remotePeer)
    && (connection.encryption === '/noise' || connection.encryption === '/tls/1.0.0'
      || (connection.encryption === 'native'
        && connection.remoteAddr?.getComponents?.().some(({ name }) => name === 'webrtc' || name === 'webrtc-direct')));
}
export function descriptor(value) {
  if (!value || typeof value !== 'object') throw new Error('Invalid model descriptor');
  if (!Array.isArray(value.modalities) || value.modalities.length > 4
      || value.modalities.some((item) => !['text', 'image', 'audio', 'video'].includes(item))) throw new Error('Invalid model modalities');
  const task = value.task ?? (value.modalities.includes('image') ? 'image-text-to-text' : 'text-generation');
  if (!['text-generation', 'image-text-to-text', 'text-to-image'].includes(task)) throw new Error('Invalid model task');
  const outputModalities = task === 'text-to-image' ? ['image'] : ['text'];
  if (value.outputModalities !== undefined && (!Array.isArray(value.outputModalities)
      || value.outputModalities.length !== 1 || value.outputModalities[0] !== outputModalities[0])) {
    throw new Error('Model output modalities do not match its task');
  }
  if (task === 'text-to-image' && (value.modalities.length !== 1 || value.modalities[0] !== 'text')) {
    throw new Error('Image generation accepts text input only');
  }
  return { manifestCid: cid(value.manifestCid), modelId: string(value.modelId), name: string(value.name),
    task, outputModalities, modalities: [...new Set(value.modalities)], runtime: string(value.runtime, 128),
    repository: string(value.repository, 256), revision: string(value.revision, 128),
    totalBytes: integer(value.totalBytes, 64 * 1024 ** 3) };
}
export function localState(value, hostingEnabled = true, { defaultMaxNewTokens = LEGACY_MAX_NEW_TOKENS } = {}) {
  if (!value || !Array.isArray(value.sharedModels) || value.sharedModels.length > PEER_INFERENCE_LIMITS.maximumModels) {
    throw new Error('Invalid shared model catalog');
  }
  const sharedModels = [...new Map(value.sharedModels.map((item) => { const model = descriptor(item); return [model.manifestCid, model]; })).values()];
  const hostedModel = hostingEnabled && value.hostedModel ? descriptor(value.hostedModel) : null;
  if (hostedModel) hostedModel.maxNewTokens = integer(value.hostedModel.maxNewTokens === undefined
    ? defaultMaxNewTokens : value.hostedModel.maxNewTokens, MODEL_POLICY.maxNewTokens, 1);
  return { sharedModels, hostedModel, busy: Boolean(value.busy),
    idleForMs: integer(value.idleForMs ?? 0, Number.MAX_SAFE_INTEGER),
    queuedRequests: integer(value.queuedRequests ?? 0, 1024) };
}
export function generation(value, { imageBytes = false } = {}) {
  validateSessionId(value.requestId);
  const result = { requestId: value.requestId, manifestCid: cid(value.manifestCid),
    messages: normalizeModelMessages(value), maxNewTokens: integer(value.maxNewTokens ?? MODEL_POLICY.maxNewTokens, MODEL_POLICY.maxNewTokens, 1) };
  if (value.task !== undefined) {
    if (!['text-generation', 'image-text-to-text', 'text-to-image'].includes(value.task)) throw new Error('Invalid inference task');
    result.task = value.task;
  }
  if (value.seed !== undefined) result.seed = integer(value.seed, 0xffffffff);
  if (value.steps !== undefined) result.steps = integer(value.steps, 8, 1);
  for (const key of ['width', 'height']) if (value[key] !== undefined) result[key] = integer(value[key], 512, 512);
  if (result.task === 'text-to-image' && (value.image != null || result.messages.length !== 1
      || result.messages[0].role !== 'user')) throw new Error('Image generation needs one text prompt');
  if (value.image != null) {
    const { width, height, channels } = value.image;
    integer(width, MODEL_POLICY.maxImagePixels, 1); integer(height, MODEL_POLICY.maxImagePixels, 1);
    if (channels !== 4 || width * height > MODEL_POLICY.maxImagePixels) throw new Error('Invalid inference image dimensions');
    if (imageBytes) validateImageInput(value.image);
    result.image = { width, height, channels: 4 };
    if (imageBytes) result.image.data = new Uint8Array(value.image.data);
  }
  return result;
}
export function resultImage(value, { imageBytes = false } = {}) {
  if (!value || typeof value !== 'object') throw new Error('Invalid result image');
  const width = integer(value.width, 1024, 1); const height = integer(value.height, 1024, 1);
  if (value.channels !== 4 || width * height > MODEL_POLICY.maxImagePixels
      || !/^[a-f0-9]{64}$/.test(value.sha256 ?? '')) throw new Error('Invalid result image dimensions or digest');
  if (imageBytes) validateImageInput(value);
  return { width, height, channels: 4, sha256: value.sha256, ...(imageBytes ? { data: value.data } : {}) };
}
export function resultData(value, options = {}) {
  if (typeof value?.text !== 'string' || bytes(value.text) > MODEL_POLICY.maxOutputBytes) throw new Error('Invalid inference result text');
  // Older v2 peers omit completion metadata. Missing evidence never means EOS.
  const finishReason = value.finishReason === undefined ? 'unknown' : value.finishReason;
  if (!['stop', 'length', 'unknown'].includes(finishReason)) throw new Error('Invalid inference finish reason');
  const result = { text: value.text, finishReason };
  if (value.contextTruncated !== undefined) {
    if (typeof value.contextTruncated !== 'boolean') throw new Error('Invalid inference context truncation flag');
    result.contextTruncated = value.contextTruncated;
  }
  for (const key of ['inputTokens', 'outputTokens', 'gpuDispatches', 'gpuSubmissions']) {
    if (value[key] != null) result[key] = integer(value[key], Number.MAX_SAFE_INTEGER);
  }
  if (value.image != null) result.image = resultImage(value.image, options);
  if (value.seed !== undefined) result.seed = integer(value.seed, 0xffffffff);
  if (value.steps !== undefined) result.steps = integer(value.steps, 8, 1);
  return result;
}
export function diffusionProgress(value) {
  if (!['text-encoder', 'denoise', 'decode'].includes(value.stage)) throw new Error('Invalid image generation stage');
  const steps = integer(value.steps, 8, 1);
  return { type: 'diffusion-progress', stage: value.stage, steps, step: integer(value.step, steps) };
}
export function channel(stream) {
  const rpc = lpStream(stream, { maxDataLength: PEER_INFERENCE_LIMITS.frameBytes,
    maxBufferSize: PEER_INFERENCE_LIMITS.frameBytes * 2 + 32 });
  return { rpc,
    async read(signal) { return JSON.parse(decoder.decode((await rpc.read({ signal })).subarray())); },
    async write(value, signal) {
      const data = encoder.encode(JSON.stringify(value));
      if (data.length > PEER_INFERENCE_LIMITS.frameBytes) throw new Error('Inference frame exceeds its byte limit');
      await rpc.write(data, { signal });
    } };
}
