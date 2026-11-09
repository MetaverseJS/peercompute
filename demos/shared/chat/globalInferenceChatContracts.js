import { describeResultImage, imageDigest } from '../../../peercompute/src/peercompute/networkManager/inference/imageResult.js';
import { resultImage } from '../../../peercompute/src/peercompute/networkManager/inference/protocol.js';
import { audioMetadata, describeAudio } from '../../../peercompute/src/peercompute/networkManager/inference/audioFrames.js';

export const GLOBAL_INFERENCE_CHAT_PROTOCOL = '/peercompute/global-inference-chat/1.0.0';
// maximumPeers bounds each rotating send/refresh batch, not network membership.
export const GLOBAL_INFERENCE_CHAT_LIMITS = Object.freeze({ nameBytes: 80, textBytes: 64 * 1024,
  modelNameBytes: 256, frameBytes: 120 * 1024, imagePixels: 1024 * 1024, imageDimension: 1024,
  audioSeconds: 30, audioSampleRate: 48000, maximumPart: 1023, maximumPeers: 32, fanout: 4,
  maximumSends: 2, maximumInbound: 4, perPeerInbound: 2, requestMs: 30000, connectMs: 5000,
  sendMs: 120000, cacheEvents: 128, cacheBytes: 16 * 1024 * 1024, peerCacheBytes: 8 * 1024 * 1024,
  historyEvents: 64, replayEntries: 4096, replayMs: 15 * 60000, rateWindowMs: 10000, rateMessages: 64, ratePeers: 256 });
const L = GLOBAL_INFERENCE_CHAT_LIMITS, encoder = new TextEncoder(), decoder = new TextDecoder('utf-8', { fatal: true });
export const globalChatError = (message, code = 'ERR_GLOBAL_CHAT') => Object.assign(new Error(message), { code });
export function globalChatFields(value, allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || Object.keys(value).some((key) => !allowed.includes(key))) throw globalChatError('Unexpected global chat fields');
}
export function globalChatText(value, maximum, label, { empty = false } = {}) {
  if (typeof value !== 'string' || (!empty && !value.trim()) || value.includes('\0')
      || encoder.encode(value).length > maximum || decoder.decode(encoder.encode(value)) !== value) {
    throw globalChatError(`${label} must contain valid text within ${maximum} UTF-8 bytes`, 'ERR_GLOBAL_CHAT_INPUT');
  }
  return value;
}
export function globalChatIdentifier(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(value)) throw globalChatError('Invalid global chat identifier');
  return value;
}
export function globalChatScope(config) {
  return Object.fromEntries(['gameId', 'roomId', 'topologyId'].map((key) => [key, globalChatText(config?.[key], 240, key)]));
}
const eventFields = ['turnId', 'phase', 'name', 'text', 'modelName', 'image', 'audio', 'part'];
function scalars(value) {
  const result = { turnId: globalChatIdentifier(value.turnId), phase: value.phase,
    name: globalChatText(value.name ?? 'Guest', L.nameBytes, 'Display name'),
    text: globalChatText(value.text ?? '', L.textBytes, 'Message', { empty: true }) };
  if (!['prompt', 'result', 'error', 'audio'].includes(result.phase)) throw globalChatError('Invalid global chat phase');
  if (value.modelName !== undefined) result.modelName = globalChatText(value.modelName, L.modelNameBytes, 'Model name');
  if (result.phase === 'audio') {
    if (!value.audio || value.image || !Number.isInteger(value.part) || value.part < 0 || value.part > L.maximumPart) {
      throw globalChatError('Speech output requires PCM audio and a bounded part number');
    }
    result.part = value.part;
  } else if (value.audio !== undefined || value.part !== undefined) {
    throw globalChatError('Only generated speech may contain audio or a part number');
  }
  if (result.phase === 'error' && value.image !== undefined) throw globalChatError('Error events contain text only');
  if (result.phase !== 'audio' && !result.text.trim() && !value.image) throw globalChatError('Global event is empty');
  return result;
}
/** Explicit public fields only: passing conversations, agent records, URLs or raw microphone audio rejects. */
export function prepareGlobalChatInput(value) {
  globalChatFields(value, eventFields);
  const input = scalars(value), wire = { ...input };
  if (value.image !== undefined) {
    globalChatFields(value.image, ['data', 'width', 'height', 'channels']);
    wire.image = describeResultImage(value.image);
    input.image = { width: wire.image.width, height: wire.image.height, channels: 4, data: new Uint8Array(value.image.data) };
  }
  if (value.audio !== undefined) {
    globalChatFields(value.audio, ['samples', 'sampleRate']);
    wire.audio = describeAudio(value.audio.samples, value.audio.sampleRate);
    input.audio = { samples: new Float32Array(value.audio.samples), sampleRate: wire.audio.sampleRate };
  }
  return { input, wire };
}
export function globalChatWire(value) {
  globalChatFields(value, ['id', ...eventFields]);
  const result = { id: globalChatIdentifier(value.id), ...scalars(value) };
  if (value.image !== undefined) {
    globalChatFields(value.image, ['width', 'height', 'channels', 'sha256']); result.image = resultImage(value.image);
  }
  if (value.audio !== undefined) {
    globalChatFields(value.audio, ['format', 'channels', 'sampleRate', 'sampleCount', 'sha256']); result.audio = audioMetadata(value.audio);
  }
  if (encoder.encode(JSON.stringify(result)).length > L.frameBytes) throw globalChatError('Global event metadata is too large');
  return result;
}
export const globalChatDigest = (wire) => imageDigest(encoder.encode(JSON.stringify(wire)));
export const globalChatBytes = (wire) => encoder.encode(JSON.stringify(wire)).length
  + (wire.image ? wire.image.width * wire.image.height * 4 : 0) + (wire.audio ? wire.audio.sampleCount * 4 : 0);
export function cloneGlobalChatEvent(event) {
  return Object.freeze({ ...event,
    ...(event.image ? { image: { ...event.image, data: new Uint8Array(event.image.data) } } : {}),
    ...(event.audio ? { audio: { ...event.audio, samples: new Float32Array(event.audio.samples) } } : {}) });
}
export function globalChatDelivery(id, recipients, { sending = false, cancelled = false } = {}) {
  const delivered = recipients.filter((entry) => entry.status === 'acknowledged').length, total = recipients.length;
  return { id, status: sending ? 'sending' : !total ? 'local-only' : delivered === total ? 'delivered' : delivered ? 'partial' : 'failed',
    delivered, total, cancelled, recipients: recipients.map((entry) => ({ ...entry })) };
}
