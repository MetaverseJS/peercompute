import { CID } from 'multiformats/cid';
import { lpStream } from '@libp2p/utils';
import { MODEL_POLICY, validateSessionId } from '../../inference/modelManifest.js';
import { normalizeModelMessages, validateImageInput } from '../../inference/modelTask.js';

export const PEER_INFERENCE_PROTOCOL = '/peercompute/inference/1.0.0';
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
  return { manifestCid: cid(value.manifestCid), modelId: string(value.modelId), name: string(value.name),
    modalities: [...new Set(value.modalities)], runtime: string(value.runtime, 128),
    repository: string(value.repository, 256), revision: string(value.revision, 128),
    totalBytes: integer(value.totalBytes, 64 * 1024 ** 3) };
}
export function localState(value, hostingEnabled = true) {
  if (!value || !Array.isArray(value.sharedModels) || value.sharedModels.length > PEER_INFERENCE_LIMITS.maximumModels) {
    throw new Error('Invalid shared model catalog');
  }
  const sharedModels = [...new Map(value.sharedModels.map((item) => { const model = descriptor(item); return [model.manifestCid, model]; })).values()];
  const hostedModel = hostingEnabled && value.hostedModel ? descriptor(value.hostedModel) : null;
  return { sharedModels, hostedModel, busy: Boolean(value.busy),
    idleForMs: integer(value.idleForMs ?? 0, Number.MAX_SAFE_INTEGER),
    queuedRequests: integer(value.queuedRequests ?? 0, 1024) };
}
export function generation(value, { imageBytes = false } = {}) {
  validateSessionId(value.requestId);
  const result = { requestId: value.requestId, manifestCid: cid(value.manifestCid),
    messages: normalizeModelMessages(value), maxNewTokens: integer(value.maxNewTokens ?? MODEL_POLICY.maxNewTokens, MODEL_POLICY.maxNewTokens, 1) };
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
export function resultData(value) {
  if (typeof value?.text !== 'string' || bytes(value.text) > MODEL_POLICY.maxOutputBytes) throw new Error('Invalid inference result text');
  const result = { text: value.text };
  for (const key of ['inputTokens', 'outputTokens', 'gpuDispatches', 'gpuSubmissions']) {
    if (value[key] != null) result[key] = integer(value[key], Number.MAX_SAFE_INTEGER);
  }
  return result;
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
