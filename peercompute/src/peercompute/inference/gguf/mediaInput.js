import { validateImageInput } from '../modelTask.js';
import { validatePcm } from '../speech/runtimeDefinition.js';

export const GGUF_MEDIA_PROFILE = Object.freeze({ profile: 'gemma4-unified-v1',
  imageMinTokens: 70, imageMaxTokens: 280, batchTokens: 512, contextTokens: 2048,
  maximumFiles: 2, requestBytes: 6 * 1024 ** 2 });

/** Only the application's pinned package can select this profile. */
export function validateGgufMediaProfile(model) {
  const media = model?.ggufMedia;
  if (media === undefined) return null;
  if (!media || Object.keys(media).length !== 2 || media.profile !== GGUF_MEDIA_PROFILE.profile
      || media.projectorPath !== 'mmproj-gemma4-unified-f16.gguf'
      || model.architecture !== 'gemma4' || model.task !== 'text-generation'
      || JSON.stringify(model.modalities) !== '["text","image","audio"]') {
    throw new Error('Unsupported GGUF multimodal profile');
  }
  return GGUF_MEDIA_PROFILE;
}

const crcTable = Uint32Array.from({ length: 256 }, (_, byte) => {
  let value = byte;
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
function crc32(bytes, start, end) {
  let crc = 0xffffffff;
  for (let i = start; i < end; i++) crc = crcTable[(crc ^ bytes[i]) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
  const bytes = new Uint8Array(data.length + 12), view = new DataView(bytes.buffer);
  view.setUint32(0, data.length);
  bytes.set(new TextEncoder().encode(type), 4); bytes.set(data, 8);
  view.setUint32(bytes.length - 4, crc32(bytes, 4, bytes.length - 4));
  return bytes;
}

/** Bounded RGBA -> PNG using stored DEFLATE blocks. No DOM, codec worker or URL. */
export function encodeGgufImage(image) {
  const valid = validateImageInput(image);
  if (!valid) throw new Error('GGUF image pixels are required');
  const stride = valid.width * 4, raw = new Uint8Array(valid.data.length + valid.height);
  for (let row = 0; row < valid.height; row++) raw.set(valid.data.subarray(row * stride, (row + 1) * stride), row * (stride + 1) + 1);
  const compressed = new Uint8Array(2 + raw.length + Math.ceil(raw.length / 65535) * 5 + 4);
  compressed.set([0x78, 0x01]);
  let offset = 2, a = 1, b = 0;
  const view = new DataView(compressed.buffer);
  for (let start = 0; start < raw.length;) {
    const length = Math.min(65535, raw.length - start);
    compressed[offset++] = start + length === raw.length ? 1 : 0;
    view.setUint16(offset, length, true); view.setUint16(offset + 2, length ^ 0xffff, true); offset += 4;
    compressed.set(raw.subarray(start, start + length), offset); offset += length;
    for (let i = start; i < start + length; i++) { a = (a + raw[i]) % 65521; b = (b + a) % 65521; }
    start += length;
  }
  view.setUint32(offset, ((b << 16) | a) >>> 0);
  const header = new Uint8Array(13), headerView = new DataView(header.buffer);
  headerView.setUint32(0, valid.width); headerView.setUint32(4, valid.height); header.set([8, 6, 0, 0, 0], 8);
  const chunks = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), pngChunk('IHDR', header),
    pngChunk('IDAT', compressed), pngChunk('IEND', new Uint8Array())];
  const result = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length; }
  return result;
}

/** Native mtmd accepts WAV, while browser microphone containers vary by browser. */
export function encodeGgufAudio(audio) {
  const { samples, sampleRate } = validatePcm(audio?.samples, audio?.sampleRate);
  const bytes = new Uint8Array(44 + samples.length * 2), view = new DataView(bytes.buffer);
  const text = (offset, value) => bytes.set(new TextEncoder().encode(value), offset);
  text(0, 'RIFF'); view.setUint32(4, bytes.length - 8, true); text(8, 'WAVE'); text(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true); text(36, 'data'); view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const value = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, Math.round(value * (value < 0 ? 32768 : 32767)), true);
  }
  return bytes;
}

export function encodeGgufMedia({ image, audio }) {
  // Validate both inputs before allocating either encoded file.
  validateImageInput(image);
  if (audio != null) validatePcm(audio.samples, audio.sampleRate);
  return [...(image ? [encodeGgufImage(image)] : []), ...(audio ? [encodeGgufAudio(audio)] : [])];
}

export function projectGgufMedia(messages, files, marker) {
  if (marker && messages.some((message) => message.content.includes(marker))) {
    throw new Error('Prompt contains a reserved native media marker');
  }
  if (!files.length) return { messages, files: [] };
  if (typeof marker !== 'string' || !/^<[^\s<>]{1,126}>$/.test(marker)) throw new Error('Invalid native media marker');
  if (files.length > GGUF_MEDIA_PROFILE.maximumFiles) throw new Error('Too many GGUF media inputs');
  const latest = messages.findLastIndex((message) => message.role === 'user');
  if (latest < 0) throw new Error('GGUF media needs a current user message');
  return { files, messages: messages.map((message, index) => index !== latest ? message : {
    role: message.role, content: [{ type: 'text', text: message.content }, ...files.map(() => ({ type: 'text', text: marker }))],
  }) };
}
