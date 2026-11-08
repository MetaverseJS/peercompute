import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';

export const AUDIO_LIMITS = Object.freeze({ chunkBytes: 64 * 1024, inputSampleRate: 16000,
  inputSeconds: 20, outputSeconds: 30, maxSampleRate: 48000 });
const count = (value, min, max) => {
  if (!Number.isSafeInteger(value) || value < min || value > max) throw new Error('Invalid audio numeric field');
  return value;
};
export function audioMetadata(value, { input = false } = {}) {
  if (!value || value.format !== 'f32le' || value.channels !== 1 || !/^[a-f0-9]{64}$/.test(value.sha256 ?? '')) {
    throw new Error('Audio requires mono f32le PCM and a SHA-256 digest');
  }
  const sampleRate = count(value.sampleRate, input ? 16000 : 8000, input ? 16000 : AUDIO_LIMITS.maxSampleRate);
  const sampleCount = count(value.sampleCount, input ? 1600 : 1, sampleRate * (input ? AUDIO_LIMITS.inputSeconds : AUDIO_LIMITS.outputSeconds));
  return { format: 'f32le', channels: 1, sampleRate, sampleCount, sha256: value.sha256 };
}
function encode(samples, begin = 0, end = samples.length, input = false) {
  if (!(samples instanceof Float32Array)) throw new Error('Audio samples must be Float32 PCM');
  const bytes = new Uint8Array((end - begin) * 4), view = new DataView(bytes.buffer);
  for (let index = begin; index < end; index++) {
    const value = samples[index];
    if (!Number.isFinite(value) || Math.abs(value) > (input ? 1.01 : 10)) throw new Error('Invalid PCM sample');
    view.setFloat32((index - begin) * 4, value, true);
  }
  return bytes;
}
export function describeAudio(samples, sampleRate, options = {}) {
  if (!(samples instanceof Float32Array)) throw new Error('Audio samples must be Float32 PCM');
  const metadata = audioMetadata({ format: 'f32le', channels: 1, sampleRate, sampleCount: samples.length, sha256: '0'.repeat(64) }, options);
  const hash = sha256.create();
  for (let index = 0; index < samples.length; index += AUDIO_LIMITS.chunkBytes / 4) {
    hash.update(encode(samples, index, Math.min(samples.length, index + AUDIO_LIMITS.chunkBytes / 4), options.input));
  }
  return { ...metadata, sha256: bytesToHex(hash.digest()) };
}
async function readSamples(io, metadata, { requestId, signal, credit, input = false }) {
  const samples = new Float32Array(metadata.sampleCount), hash = sha256.create();
  let offset = 0;
  while (offset < samples.byteLength) {
    const frame = await io.rpc.read({ signal });
    if (!frame.byteLength || frame.byteLength % 4 || frame.byteLength > AUDIO_LIMITS.chunkBytes
        || frame.byteLength > samples.byteLength - offset) throw new Error('Invalid PCM transfer frame');
    const bytes = frame.subarray(), view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    hash.update(bytes);
    for (let i = 0; i < bytes.length; i += 4) {
      const value = view.getFloat32(i, true);
      if (!Number.isFinite(value) || Math.abs(value) > (input ? 1.01 : 10)) throw new Error('Invalid PCM sample');
      samples[(offset + i) / 4] = value;
    }
    offset += bytes.length;
    if (offset === samples.byteLength && bytesToHex(hash.digest()) !== metadata.sha256) throw new Error('Audio digest mismatch');
    await io.write({ type: credit, requestId, offset }, signal);
  }
  return samples;
}
export async function writeInputAudio(io, { samples, requestId, signal }) {
  for (let start = 0; start < samples.length;) {
    const end = Math.min(samples.length, start + AUDIO_LIMITS.chunkBytes / 4);
    await io.rpc.write(encode(samples, start, end, true), { signal });
    const credit = await io.read(signal);
    if (credit.type !== 'audio-credit' || credit.requestId !== requestId || credit.offset !== end * 4) throw new Error('Invalid audio transfer credit');
    start = end;
  }
}
export async function readInputAudio(io, { audio, requestId, signal }) {
  const metadata = audioMetadata(audio, { input: true });
  return { samples: await readSamples(io, metadata, { requestId, signal, input: true, credit: 'audio-credit' }), sampleRate: metadata.sampleRate };
}
export async function writeResultAudio(io, { samples, metadata, requestId, controls, signal }) {
  const ready = controls.expect(0);
  await io.write({ type: 'result-audio', requestId, audio: metadata }, signal); await ready;
  for (let start = 0; start < samples.length;) {
    const end = Math.min(samples.length, start + AUDIO_LIMITS.chunkBytes / 4);
    const credit = controls.expect(end * 4);
    await io.rpc.write(encode(samples, start, end), { signal }); await credit;
    start = end;
  }
}
export async function readResultAudio(io, { audio, requestId, signal }) {
  const metadata = audioMetadata(audio);
  await io.write({ type: 'result-credit', requestId, offset: 0 }, signal);
  const samples = await readSamples(io, metadata, { requestId, signal, credit: 'result-credit' });
  return { audio: samples, sampleRate: metadata.sampleRate, metadata };
}
