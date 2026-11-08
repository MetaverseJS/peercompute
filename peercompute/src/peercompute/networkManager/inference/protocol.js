import { CID } from 'multiformats/cid';
import { lpStream } from '@libp2p/utils';
import { MODEL_POLICY, validateSessionId } from '../../inference/modelManifest.js';
import { normalizeModelMessages, validateImageInput } from '../../inference/modelTask.js';
import { INFERENCE_TASKS } from '../../inference/InferenceRouter.js';
import { audioMetadata, describeAudio } from './audioFrames.js';

// v3 adds multiple resident hosts and credited PCM; v2 remains registered for
// existing text/vision/image peers, with speech removed from its directory view.
export const PEER_INFERENCE_PROTOCOL = '/peercompute/inference/3.0.0';
export const PEER_INFERENCE_PROTOCOL_V2 = '/peercompute/inference/2.0.0';
export const isSpeechTask = (task) => ['automatic-speech-recognition', 'text-to-speech'].includes(task);
// Original v2 hosts omit this capability and reject requests above 256 tokens.
export const LEGACY_MAX_NEW_TOKENS = 256;
export const PEER_INFERENCE_LIMITS = Object.freeze({ frameBytes: 128 * 1024, imageChunkBytes: 64 * 1024,
  maximumPeers: 32, maximumModels: 128, maximumInbound: 5, maximumPerPeer: 2,
  maximumOutbound: 5, maximumHostedModels: 16, queryTimeoutMs: 5000, requestTimeoutMs: 120000, recordTtlMs: 15000 });
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
  if (!INFERENCE_TASKS.includes(task)) throw new Error('Invalid model task');
  const outputModalities = task === 'text-to-image' ? ['image'] : task === 'text-to-speech' ? ['audio'] : ['text'];
  if (value.outputModalities !== undefined && (!Array.isArray(value.outputModalities)
      || value.outputModalities.length !== 1 || value.outputModalities[0] !== outputModalities[0])) {
    throw new Error('Model output modalities do not match its task');
  }
  if (task === 'text-to-image' && (value.modalities.length !== 1 || value.modalities[0] !== 'text')) {
    throw new Error('Image generation accepts text input only');
  }
  if (isSpeechTask(task) && (value.modalities.length !== 1 || value.modalities[0] !== (task === 'text-to-speech' ? 'text' : 'audio'))) {
    throw new Error('Invalid speech model modalities');
  }
  return { manifestCid: cid(value.manifestCid), modelId: string(value.modelId), name: string(value.name),
    task, outputModalities, modalities: [...new Set(value.modalities)], runtime: string(value.runtime, 128),
    repository: string(value.repository, 256), revision: string(value.revision, 128),
    totalBytes: integer(value.totalBytes, 64 * 1024 ** 3) };
}
export function localState(value, hostingEnabled = true, { defaultMaxNewTokens = LEGACY_MAX_NEW_TOKENS,
  protocol = PEER_INFERENCE_PROTOCOL } = {}) {
  if (!value || !Array.isArray(value.sharedModels) || value.sharedModels.length > PEER_INFERENCE_LIMITS.maximumModels) {
    throw new Error('Invalid shared model catalog');
  }
  const sharedModels = [...new Map(value.sharedModels.map((item) => { const model = descriptor(item); return [model.manifestCid, model]; })).values()]
    .filter((model) => protocol !== PEER_INFERENCE_PROTOCOL_V2 || !isSpeechTask(model.task));
  const host = (item, fallback = {}) => ({ ...descriptor(item),
    maxNewTokens: integer(item.maxNewTokens === undefined ? defaultMaxNewTokens : item.maxNewTokens, MODEL_POLICY.maxNewTokens, 1),
    busy: Boolean(item.busy ?? fallback.busy), idleForMs: integer(item.idleForMs ?? fallback.idleForMs ?? 0, Number.MAX_SAFE_INTEGER),
    queuedRequests: integer(item.queuedRequests ?? fallback.queuedRequests ?? 0, 1024),
    queueCapacity: integer(item.queueCapacity ?? MODEL_POLICY.maxQueued, 1024), queueAvailable: item.queueAvailable !== false });
  let hostedModel = hostingEnabled && value.hostedModel ? host(value.hostedModel, value) : null;
  if (protocol === PEER_INFERENCE_PROTOCOL_V2 && isSpeechTask(hostedModel?.task)) hostedModel = null;
  const rawHosts = value.hostedModels ?? (hostedModel ? [hostedModel] : []);
  if (!Array.isArray(rawHosts) || rawHosts.length > PEER_INFERENCE_LIMITS.maximumHostedModels) throw new Error('Invalid hosted model list');
  const hostedModels = hostingEnabled ? rawHosts.map((item) => host(item)) : [];
  if (new Set(hostedModels.map((item) => item.manifestCid)).size !== hostedModels.length) throw new Error('Duplicate hosted model identity');
  return { sharedModels, hostedModel, ...(protocol !== PEER_INFERENCE_PROTOCOL_V2 ? { hostedModels } : {}), busy: Boolean(value.busy),
    idleForMs: integer(value.idleForMs ?? 0, Number.MAX_SAFE_INTEGER),
    queuedRequests: integer(value.queuedRequests ?? 0, 1024) };
}
export function generation(value, { imageBytes = false } = {}) {
  validateSessionId(value.requestId);
  if (value.task === 'automatic-speech-recognition') {
    if (value.prompt != null || value.messages != null || value.image != null || !value.audio) throw new Error('ASR accepts audio only');
    const metadata = imageBytes ? describeAudio(value.audio.samples, value.audio.sampleRate, { input: true })
      : audioMetadata(value.audio, { input: true });
    return { requestId: value.requestId, manifestCid: cid(value.manifestCid), task: value.task,
      audio: { ...metadata, ...(imageBytes ? { samples: new Float32Array(value.audio.samples) } : {}) } };
  }
  if (value.audio != null) throw new Error('Only ASR accepts audio input');
  if (value.task === 'text-to-speech') {
    if (value.image != null || value.messages != null || typeof value.prompt !== 'string') throw new Error('TTS accepts one text prompt');
    const prompt = value.prompt.trim();
    if (!prompt || [...prompt].length > 256 || bytes(prompt) > 1024) throw new Error('Speech text exceeds its budget');
    return { requestId: value.requestId, manifestCid: cid(value.manifestCid), task: value.task, prompt };
  }
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
  const text = value?.text ?? (value?.audio ? '' : undefined);
  if (typeof text !== 'string' || bytes(text) > MODEL_POLICY.maxOutputBytes) throw new Error('Invalid inference result text');
  // Older v2 peers omit completion metadata. Missing evidence never means EOS.
  const finishReason = value.finishReason === undefined ? 'unknown' : value.finishReason;
  if (!['stop', 'length', 'unknown'].includes(finishReason)) throw new Error('Invalid inference finish reason');
  const result = { text, finishReason };
  if (value.contextTruncated !== undefined) {
    if (typeof value.contextTruncated !== 'boolean') throw new Error('Invalid inference context truncation flag');
    result.contextTruncated = value.contextTruncated;
  }
  for (const key of ['inputTokens', 'outputTokens', 'gpuDispatches', 'gpuSubmissions']) {
    if (value[key] != null) result[key] = integer(value[key], Number.MAX_SAFE_INTEGER);
  }
  if (value.image != null) result.image = resultImage(value.image, options);
  if (value.audio != null) result.audio = audioMetadata(value.audio);
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
