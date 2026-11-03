import { normalizeArtifactManifest } from '../artifacts/ArtifactManifest.js';
import { ARTIFACT_READ_PROTOCOL } from './ArtifactReadBridge.js';
import { MODEL_POLICY, abortError, throwIfAborted, validateArtifactPath } from './modelManifest.js';

export const GGUF_MAXIMUM_READ_BYTES = 16 * 1024 ** 2;

function bound(value, name, minimum, maximum) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) throw new RangeError(`Invalid ${name}`);
  return value;
}

function checkSignal(signal) {
  if (signal != null && (typeof signal.aborted !== 'boolean'
      || typeof signal.addEventListener !== 'function' || typeof signal.removeEventListener !== 'function')) {
    throw new TypeError('An AbortSignal is required');
  }
}

/** A resident worker's bounded random-access client. Returned buffers belong to
 * the caller; getStats().bufferedBytes counts only outstanding requests. Larger
 * native fread requests must be split by the engine before calling read().
 */
export function createGgufArtifactReader(port, { manifest, signal,
  maxReadBytes = GGUF_MAXIMUM_READ_BYTES, maxReads = 2, maxQueuedReads = 16,
  readTimeoutMs = 30_000 } = {}) {
  if (!port?.postMessage || !port?.addEventListener) throw new TypeError('A MessagePort is required');
  bound(maxReadBytes, 'maxReadBytes', 1, GGUF_MAXIMUM_READ_BYTES);
  bound(maxReads, 'maxReads', 1, MODEL_POLICY.maxReads);
  bound(maxQueuedReads, 'maxQueuedReads', 0, 32);
  bound(readTimeoutMs, 'readTimeoutMs', 1, 300_000);
  checkSignal(signal);
  const normalized = normalizeArtifactManifest(manifest);
  const files = new Map(normalized.files.map((file) => {
    if (!/^[a-f0-9]{64}$/.test(file.sha256 ?? '')) throw new TypeError('GGUF artifact files require SHA-256 digests');
    return [validateArtifactPath(file.path), Object.freeze({ ...file })];
  }));
  throwIfAborted(signal);
  const active = new Map();
  const queued = [];
  let nextId = 0;
  let closed = false;
  let closedError;
  let bufferedBytes = 0;
  let peakBufferedBytes = 0;
  let deliveredBytes = 0;
  let completedReads = 0;
  let failedReads = 0;

  function send(message) { port.postMessage({ protocol: ARTIFACT_READ_PROTOCOL, ...message }); }
  function cancel(state) {
    if (state.active) try { send({ type: 'cancel', id: state.id }); } catch { /* Cleanup remains local if the port died. */ }
  }
  function finish(state, error, result) {
    if (state.finished) return;
    state.finished = true;
    active.delete(state.id);
    const index = queued.indexOf(state);
    if (index !== -1) queued.splice(index, 1);
    clearTimeout(state.timer);
    state.signal?.removeEventListener('abort', state.abort);
    bufferedBytes -= state.buffer?.byteLength || 0;
    state.buffer = null;
    if (error) { failedReads++; state.reject(error); }
    else { completedReads++; state.resolve(result); }
    drain();
  }
  function fail(state, error) { cancel(state); finish(state, error); }
  function drain() {
    while (!closed && active.size < maxReads && queued.length) {
      const state = queued.shift();
      state.active = true;
      active.set(state.id, state);
      try { send({ type: 'open', id: state.id, path: state.path, offset: state.offset, length: state.length }); }
      catch (error) { fail(state, error); }
    }
  }
  function pull(state) {
    state.awaiting = true;
    try { send({ type: 'pull', id: state.id }); } catch (error) { fail(state, error); }
  }
  function receive(event) {
    const message = event.data;
    if (closed || message?.protocol !== ARTIFACT_READ_PROTOCOL) return;
    if (message.type === 'closed') { close(new Error(message.message || 'Artifact host closed')); return; }
    const state = active.get(message.id);
    if (!state) return; // Late chunks after cancellation cannot restore a reader.
    try {
      if (message.type === 'error') throw new Error(message.message || 'Artifact read failed');
      if (message.type === 'ready') {
        if (state.ready || message.size !== state.length) throw new Error('Invalid artifact range response size');
        state.ready = true;
        state.buffer = new Uint8Array(state.length);
        bufferedBytes += state.length;
        peakBufferedBytes = Math.max(peakBufferedBytes, bufferedBytes);
        pull(state);
      } else if (message.type === 'chunk') {
        if (!state.ready || !state.awaiting || !(message.bytes instanceof Uint8Array)
            || !message.bytes.byteLength || message.bytes.byteLength > MODEL_POLICY.chunkBytes
            || message.bytes.byteLength > state.length - state.received) {
          throw new Error('Invalid artifact range chunk');
        }
        state.awaiting = false;
        state.buffer.set(message.bytes, state.received);
        state.received += message.bytes.byteLength;
        deliveredBytes += message.bytes.byteLength;
        pull(state);
      } else if (message.type === 'end') {
        if (!state.ready || !state.awaiting || state.received !== state.length) throw new Error('Truncated artifact range');
        finish(state, null, state.buffer);
      } else throw new Error('Unexpected artifact range message');
    } catch (error) { fail(state, error); }
  }
  function stat(path) {
    if (closed) throw closedError;
    const file = files.get(validateArtifactPath(path));
    if (!file) throw new Error('Artifact path is not in the manifest');
    return file;
  }
  async function read(path, offset, length, { signal: requestSignal } = {}) {
    const file = stat(path);
    checkSignal(requestSignal);
    throwIfAborted(requestSignal);
    bound(offset, 'artifact offset', 0, Number.MAX_SAFE_INTEGER);
    bound(length, 'artifact read length', 0, maxReadBytes);
    if (offset > file.size || length > file.size - offset) throw new RangeError('Artifact range exceeds file size');
    if (active.size >= maxReads && queued.length >= maxQueuedReads) throw new Error('Artifact range queue is full');
    if (nextId === Number.MAX_SAFE_INTEGER) throw new RangeError('Artifact request identifiers exhausted');
    return new Promise((resolve, reject) => {
      const state = { id: `gguf-${++nextId}`, path, offset, length, signal: requestSignal,
        resolve, reject, active: false, ready: false, received: 0, buffer: null };
      state.abort = () => fail(state, abortError(requestSignal.reason));
      state.timer = setTimeout(() => fail(state, new DOMException('Artifact range read timed out', 'TimeoutError')), readTimeoutMs);
      requestSignal?.addEventListener('abort', state.abort, { once: true });
      queued.push(state);
      drain();
    });
  }
  function close(reason = 'GGUF artifact reader closed') {
    if (closed) return;
    closed = true;
    closedError = reason instanceof Error ? reason : abortError(reason);
    signal?.removeEventListener('abort', onAbort);
    port.removeEventListener('message', receive);
    for (const state of [...active.values(), ...queued]) fail(state, closedError);
    port.close();
  }
  const onAbort = () => close(abortError(signal.reason));
  signal?.addEventListener('abort', onAbort, { once: true });
  port.addEventListener('message', receive);
  port.start?.();
  return { read, stat, close, getStats: () => Object.freeze({ closed, activeReads: active.size,
    queuedReads: queued.length, bufferedBytes, peakBufferedBytes, deliveredBytes,
    completedReads, failedReads, maxReadBytes, maxReads, maxQueuedReads }) };
}
