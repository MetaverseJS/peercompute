import { speechChunks } from '../../../peercompute/src/peercompute/inference/speech/chunks.js';
import { MODEL_POLICY } from '../../../peercompute/src/peercompute/inference/modelManifest.js';

// An explicit language model chooses the conversational provider, not an ASR or
// TTS model. Carry its locality policy into the independent speech stages.
export function voiceTarget(target = 'mixed') {
  if (target === 'local' || target === 'local-only' || target.startsWith('local:')) return 'local-only';
  if (target === 'mixed' || target.startsWith('peer:')) return 'mixed';
  if (target === 'peers-only') return target;
  throw new Error('Unknown voice provider policy');
}

/** DOM-independent, explicit microphone and PCM playback orchestration.
 * execute uses the same managed local/peer router as text and vision. The caller
 * retains one turn signal across recording, conversation and spoken response.
 * This helper never downloads models, opens a microphone automatically, or owns
 * the runtime's residents. Audio owns only this session's tracks and nodes.
 */
export function createVoiceSession({ audio, execute } = {}) {
  if (!audio?.startRecording || !audio?.stopRecording || !audio?.cancelRecording
      || !audio?.play || !audio?.stopPlayback || typeof execute !== 'function') {
    throw new TypeError('Voice sessions require owned audio and a task executor');
  }
  const lifetime = new AbortController();
  let current, closed = false, closing, status = 'idle';
  const getState = () => ({ status, active: Boolean(current), recording: status === 'recording' });
  function update(next, listener) {
    status = next;
    try { listener?.(getState()); } catch { /* UI observation cannot strand owned audio. */ }
  }
  function run(options, callback, kind) {
    if (closed) return Promise.reject(new Error('Voice session is disposed'));
    if (current) return Promise.reject(new Error('A voice operation is already active'));
    const controller = new AbortController();
    const signal = AbortSignal.any([lifetime.signal, controller.signal, ...(options.signal ? [options.signal] : [])]);
    signal.throwIfAborted();
    const operation = { controller, signal, kind, stopRequested: false, stop: null, promise: null };
    current = operation;
    operation.promise = Promise.resolve().then(() => callback(operation)).finally(() => {
      if (current === operation) current = null;
      update(closed ? 'closed' : 'idle', options.onState);
    });
    return operation.promise;
  }
  function stop() {
    if (!current || current.kind !== 'record' || !['idle', 'requesting-microphone', 'recording'].includes(status)) return false;
    current.stopRequested = true; current.stop?.(); return true;
  }
  async function capture(options = {}, consume = (pcm) => pcm) {
    return run(options, async (operation) => {
      const { signal } = operation;
      let removeAbort;
      // Install before permission/capture: an immediate stop or auto time limit
      // must never be lost. Attach a rejection observer while permission waits.
      const stopped = new Promise((resolve, reject) => {
        operation.stop = resolve;
        const abort = () => reject(signal.reason);
        signal.addEventListener('abort', abort, { once: true });
        removeAbort = () => signal.removeEventListener('abort', abort);
        if (signal.aborted) abort();
      });
      stopped.catch(() => {});
      try {
        update('requesting-microphone', options.onState);
        await audio.startRecording({ signal, onLimit: () => operation.stop?.() });
        signal.throwIfAborted(); update('recording', options.onState);
        if (operation.stopRequested) operation.stop();
        await stopped; signal.throwIfAborted();
        const pcm = await audio.stopRecording(); signal.throwIfAborted();
        return await consume(pcm, signal);
      } finally {
        removeAbort?.();
        // A granted microphone or a cancelled permission prompt cannot outlive
        // the operation. WorldAudio also closes tracks granted after cancellation.
        await audio.cancelRecording();
      }
    }, 'record');
  }
  async function record(options = {}) {
    const target = voiceTarget(options.target);
    // Native audio-understanding models can supply a transcription when the
    // caller needs text (for an agent or public chat). They remain distinct from
    // ASR adapters: a prompt is necessary, and only text is returned to the caller.
    const task = options.transcriptionTask ?? 'automatic-speech-recognition';
    if (!['automatic-speech-recognition', 'audio-text-to-text'].includes(task)) {
      throw new Error('Unsupported transcription task');
    }
    return capture(options, async (pcm, signal) => {
      update('transcribing', options.onState);
      const result = await execute(target, { task, audio: pcm,
        ...(task === 'audio-text-to-text' ? { prompt: 'Transcribe the speech in this recording exactly. Return only the transcription.' } : {}),
        requestId: crypto.randomUUID(), signal, onProgress: options.onProgress });
      signal.throwIfAborted();
      if (typeof result?.text !== 'string' || !result.text.trim()) {
        throw new Error('No speech recognized. Try again or type a message.');
      }
      return result;
    });
  }
  async function speak(text, options = {}) {
    const target = voiceTarget(options.target);
    if (typeof text !== 'string' || new TextEncoder().encode(text).length > MODEL_POLICY.maxOutputBytes) {
      throw new Error('Spoken response exceeds the output text budget');
    }
    return run(options, async ({ signal }) => {
      let completedChunks = 0;
      try {
        for (const prompt of speechChunks(text)) {
          signal.throwIfAborted(); update('synthesizing', options.onState);
          const result = await execute(target, { task: 'text-to-speech', prompt,
            requestId: crypto.randomUUID(), signal, onProgress: options.onProgress });
          signal.throwIfAborted(); update('playing', options.onState);
          await audio.play(result, { signal }); signal.throwIfAborted(); completedChunks++;
        }
        return { completedChunks };
      } finally { await audio.stopPlayback(); }
    }, 'speak');
  }
  async function cancel() {
    const operation = current;
    operation?.controller.abort(new DOMException('Voice cancelled', 'AbortError'));
    // Wait for cleanup, not just the abort notification. A new turn must not
    // race microphone release, synthesis cancellation or queued playback.
    const cleanup = await Promise.allSettled([Promise.resolve().then(() => audio.cancelRecording()), Promise.resolve().then(() => audio.stopPlayback()),
      operation?.promise?.catch(() => {})]);
    const errors = cleanup.filter((result) => result.status === 'rejected').map((result) => result.reason);
    if (errors.length) throw new AggregateError(errors, 'Voice cleanup is incomplete');
  }
  function dispose() {
    if (closing) return closing;
    closed = true; lifetime.abort(new DOMException('Voice session disposed', 'AbortError'));
    const pending = (async () => {
      const results = await Promise.allSettled([cancel()]);
      try { await audio.dispose?.(); } catch (error) { results.push({ status: 'rejected', reason: error }); }
      const errors = results.filter((result) => result.status === 'rejected').map((result) => result.reason);
      status = 'closed';
      if (errors.length) throw new AggregateError(errors, 'Voice disposal is incomplete');
    })();
    closing = pending.catch((error) => { closing = null; throw error; });
    return closing;
  }
  return { record, capture: (options) => capture(options), stop, speak, cancel, dispose, getState };
}
