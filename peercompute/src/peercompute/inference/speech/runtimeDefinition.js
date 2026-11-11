import { normalizeArtifactManifest } from '../../artifacts/ArtifactManifest.js';
import { validateRuntimeAssets } from '../modelManifest.js';
import { SPEECH_MODEL_CATALOG } from './speechCatalog.js';

export const SPEECH_LIMITS = Object.freeze({ sampleRate: 16000, maxInputSeconds: 20,
  maxOutputSeconds: 30, maxTextBytes: 1024, maxTextCharacters: 256, maxTranscriptBytes: 8192,
  residentBytes: 1024 ** 3 });
const same = (a, b) => a && b && typeof a === 'object' && typeof b === 'object'
  ? Object.keys(a).length === Object.keys(b).length && Object.keys(a).every((key) => same(a[key], b[key])) : a === b;

export function validateSpeechManifest(input) {
  const manifest = normalizeArtifactManifest(input);
  if (manifest.model?.composition !== undefined) throw new Error('This speech runtime does not support model adapters');
  const trusted = Object.values(SPEECH_MODEL_CATALOG).find((entry) => same(entry.model, manifest.model));
  if (!trusted || manifest.files.length !== trusted.files.length) throw new Error('Speech package is outside the pinned catalog');
  for (const expected of trusted.files) {
    const file = manifest.files.find((item) => item.path === expected.path);
    if (!file || file.size !== expected.size || file.sha256 !== expected.sha256) throw new Error('Speech file differs from its pinned digest');
  }
  return { manifest, trusted, totalBytes: trusted.totalBytes, resourcePolicy: {
    minimumCpuBytes: SPEECH_LIMITS.residentBytes, minimumGpuBytes: SPEECH_LIMITS.residentBytes,
    maxModelBytes: 512 * 1024 ** 2 } };
}

export function validatePcm(samples, sampleRate, maximumSeconds = SPEECH_LIMITS.maxInputSeconds) {
  if (!(samples instanceof Float32Array) || sampleRate !== SPEECH_LIMITS.sampleRate
      || samples.length < 1600 || samples.length > sampleRate * maximumSeconds) {
    throw new Error('Speech input requires 0.1–20 seconds of mono Float32 PCM at 16000 Hz');
  }
  for (const value of samples) if (!Number.isFinite(value) || Math.abs(value) > 1.01) throw new Error('Invalid PCM sample');
  return { samples, sampleRate };
}

export function normalizeSpeechInput(input, manifest) {
  const { trusted } = validateSpeechManifest(manifest);
  if (input.image) throw new Error('Speech does not accept image inputs');
  if (trusted.model.task === 'automatic-speech-recognition') {
    if (input.prompt != null || input.messages != null) throw new Error('ASR accepts audio only');
    return { task: trusted.model.task, audio: validatePcm(input.audio?.samples, input.audio?.sampleRate) };
  }
  if (input.audio != null || input.messages != null || typeof input.prompt !== 'string') throw new Error('TTS accepts one text prompt');
  const prompt = input.prompt.trim();
  if (!prompt || [...prompt].length > SPEECH_LIMITS.maxTextCharacters
      || new TextEncoder().encode(prompt).length > SPEECH_LIMITS.maxTextBytes) throw new Error('Speak one short sentence at a time (maximum 256 characters)');
  return { task: trusted.model.task, prompt };
}

export const speechRuntimeDefinition = Object.freeze({ id: 'transformers-speech',
  moduleUrl: 'peercompute:speech-inference', acceptsAudio: true,
  validateManifest: validateSpeechManifest, validateRuntimeAssets,
  normalizeGenerationInput: normalizeSpeechInput, terminateOnUnload: true,
});
