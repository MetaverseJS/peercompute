import { normalizeModelMessages, validateImageInput } from './modelTask.js';
import { validateSessionId } from './modelManifest.js';
import { validatePcm } from './speech/runtimeDefinition.js';

/** Own request data before discovery, queuing, or callbacks can yield to a caller.
 * Model-specific validation still belongs to the selected runtime. In particular,
 * keep prompt-only speech/image generation and inferred task selection intact.
 */
export function snapshotGenerationInput(input = {}) {
  input.signal?.throwIfAborted();
  const snapshot = {};
  for (const key of ['requestId', 'sessionId']) {
    if (input[key] != null) snapshot[key] = validateSessionId(input[key]);
  }
  if (input.task != null) {
    if (typeof input.task !== 'string') throw new Error('Invalid inference task');
    snapshot.task = input.task;
  }
  for (const key of ['maxNewTokens', 'seed', 'steps', 'width', 'height']) {
    if (input[key] !== undefined) {
      if (!Number.isSafeInteger(input[key])) throw new Error(`Invalid inference ${key}`);
      snapshot[key] = input[key];
    }
  }
  if (input.messages != null) snapshot.messages = normalizeModelMessages({ messages: input.messages });
  if (input.prompt != null) {
    // Validate the bounded string without turning TTS's prompt into messages.
    snapshot.prompt = normalizeModelMessages({ prompt: input.prompt })[0].content;
  }
  const image = validateImageInput(input.image);
  const audio = input.audio == null ? null : validatePcm(input.audio.samples, input.audio.sampleRate);
  // Validate every variable-sized input before allocating any owned binary copy.
  if (image) snapshot.image = { width: image.width, height: image.height, channels: 4,
    data: new Uint8Array(image.data) };
  if (audio) snapshot.audio = { sampleRate: audio.sampleRate, samples: new Float32Array(audio.samples) };
  // These are live control channels, intentionally retained by reference. Copying
  // the containing options object keeps later callback replacement isolated too.
  snapshot.signal = input.signal;
  snapshot.onProgress = input.onProgress;
  snapshot.onToken = input.onToken;
  return snapshot;
}
