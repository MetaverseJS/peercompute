import { MODEL_POLICY, abortError, throwIfAborted, validateArtifactPath } from './modelManifest.js';

const PROTOCOL = 'peercompute.model-artifact-read.v1';

function subscribe(port, listener) {
  const receive = (event) => listener(event.data);
  port.addEventListener('message', receive);
  port.start?.();
  return () => port.removeEventListener('message', receive);
}

function send(port, message, transfer = []) {
  port.postMessage({ protocol: PROTOCOL, ...message }, transfer);
}

/** Host endpoint. Only manifest-listed files are addressable; one pull grants one chunk. */
export function serveArtifactPort(port, { store, manifest, chunkBytes = MODEL_POLICY.chunkBytes,
  maxReads = MODEL_POLICY.maxReads } = {}) {
  if (!store?.stat || !store?.openRead) throw new Error('A verified artifact store is required');
  if (!Number.isInteger(chunkBytes) || chunkBytes < 1 || chunkBytes > MODEL_POLICY.chunkBytes
      || !Number.isInteger(maxReads) || maxReads < 1 || maxReads > MODEL_POLICY.maxReads) {
    throw new Error('Invalid artifact bridge bounds');
  }
  const files = new Map(manifest.files.map((file) => [validateArtifactPath(file.path), file]));
  const reads = new Map();
  let closed = false;
  let deliveredBytes = 0;

  async function stop(id, reason) {
    const state = reads.get(id);
    if (!state) return;
    reads.delete(id);
    state.controller.abort(reason);
    try { await state.iterator?.return?.(); } catch { /* The reader is already cancelled. */ }
  }

  async function receive(message) {
    if (closed || message?.protocol !== PROTOCOL || typeof message.id !== 'string'
        || message.id.length > 128) return;
    const { id } = message;
    try {
      if (message.type === 'cancel') { await stop(id, 'Reader cancelled'); return; }
      if (message.type === 'open') {
        if (reads.has(id)) throw new Error('Duplicate artifact reader');
        if (reads.size >= maxReads) throw new Error('Artifact reader limit reached');
        const file = files.get(message.path);
        if (!file) throw new Error('Artifact path is not in the manifest');
        const offset = message.offset ?? 0;
        const length = message.length ?? file.size - offset;
        if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0
            || length < 0 || offset > file.size || length > file.size - offset) {
          throw new Error('Invalid artifact byte range');
        }
        const state = { controller: new AbortController(), remaining: length, pulling: false };
        reads.set(id, state);
        const stat = await store.stat(file.cid);
        throwIfAborted(state.controller.signal);
        if (closed || reads.get(id) !== state) return;
        if (!stat || stat.status !== 'complete' || stat.size !== file.size || stat.sha256 !== file.sha256) {
          throw new Error('Model artifact is incomplete or has a different size');
        }
        const stream = await store.openRead(file.cid, { offset, length, signal: state.controller.signal });
        state.iterator = stream[Symbol.asyncIterator]();
        if (closed || state.controller.signal.aborted || reads.get(id) !== state) {
          await state.iterator.return?.();
          return;
        }
        send(port, { type: 'ready', id, size: length });
        return;
      }
      if (message.type !== 'pull') return;
      const state = reads.get(id);
      if (!state?.iterator || state.pulling) throw new Error('Invalid artifact pull credit');
      state.pulling = true;
      const next = await state.iterator.next();
      if (closed || state.controller.signal.aborted || reads.get(id) !== state) return;
      if (next.done) {
        if (state.remaining !== 0) throw new Error('Truncated model artifact');
        reads.delete(id);
        send(port, { type: 'end', id });
        return;
      }
      const bytes = next.value;
      if (!(bytes instanceof Uint8Array) || !bytes.byteLength || bytes.byteLength > chunkBytes
          || bytes.byteLength > state.remaining) throw new Error('Artifact chunk exceeds admitted bounds');
      state.remaining -= bytes.byteLength;
      state.pulling = false;
      deliveredBytes += bytes.byteLength;
      // Copy this bounded chunk so transfer cannot detach a block retained by the store.
      const copy = bytes.slice();
      send(port, { type: 'chunk', id, bytes: copy }, [copy.buffer]);
    } catch (error) {
      await stop(id, error);
      if (!closed) send(port, { type: 'error', id, message: error?.message || 'Artifact read failed' });
    }
  }
  const unsubscribe = subscribe(port, (message) => { void receive(message); });
  return {
    getStats: () => ({ activeReads: reads.size, deliveredBytes }),
    async close() {
      if (closed) return;
      closed = true;
      unsubscribe();
      await Promise.all([...reads.keys()].map((id) => stop(id, 'Artifact bridge closed')));
      port.close();
    },
  };
}

/** Worker endpoint. Responses stream with zero prefetch and a single outstanding pull. */
export function createArtifactFetch(port, { manifest, baseUrl, signal,
  chunkBytes = MODEL_POLICY.chunkBytes, maxReads = MODEL_POLICY.maxReads, maxQueuedReads = 32 } = {}) {
  if (!Number.isInteger(maxReads) || maxReads < 1 || maxReads > MODEL_POLICY.maxReads
      || !Number.isInteger(maxQueuedReads) || maxQueuedReads < 0 || maxQueuedReads > 32) {
    throw new RangeError('Invalid artifact reader limits');
  }
  const base = new URL(baseUrl);
  const files = new Map(manifest.files.map((file) => [validateArtifactPath(file.path), file]));
  const pending = new Map();
  const waiting = [];
  let nextId = 0;
  let closed = false;
  function drain() {
    while (!closed && pending.size < maxReads && waiting.length) {
      const state = waiting.shift();
      pending.set(state.id, state);
      state.active = true;
      send(port, { type: 'open', id: state.id, path: state.path });
    }
  }
  function finish(state, error) {
    pending.delete(state.id);
    const index = waiting.indexOf(state);
    if (index >= 0) waiting.splice(index, 1);
    signal?.removeEventListener('abort', state.abort);
    state.requestSignal?.removeEventListener('abort', state.abort);
    if (error) {
      state.reject?.(error);
      try { state.streamController?.error(error); } catch { /* Already closed. */ }
    }
    state.resolvePull?.();
    drain();
  }
  const unsubscribe = subscribe(port, (message) => {
    if (message?.protocol !== PROTOCOL) return;
    const state = pending.get(message.id);
    if (!state) return;
    if (message.type === 'error') { finish(state, new Error(message.message)); return; }
    if (message.type === 'ready') {
      if (state.ready || message.size !== state.file.size) {
        finish(state, new Error('Invalid artifact response size'));
        send(port, { type: 'cancel', id: state.id });
        return;
      }
      state.ready = true;
      send(port, { type: 'pull', id: state.id });
    } else if (message.type === 'chunk') {
      if (!state.ready || !state.resolvePull || !(message.bytes instanceof Uint8Array)
          || !message.bytes.byteLength || message.bytes.byteLength > chunkBytes
          || state.received + message.bytes.byteLength > state.file.size) {
        send(port, { type: 'cancel', id: state.id });
        finish(state, new Error('Invalid artifact chunk'));
        return;
      }
      state.received += message.bytes.byteLength;
      state.streamController.enqueue(message.bytes);
      const resolve = state.resolvePull;
      state.resolvePull = null;
      resolve();
    } else if (message.type === 'end') {
      if (!state.ready || state.received !== state.file.size) {
        finish(state, new Error('Truncated artifact response'));
      } else {
        state.streamController.close();
        finish(state);
      }
    }
  });

  async function fetchArtifact(input, init = {}) {
    if (closed) throw new Error('Artifact bridge is closed');
    throwIfAborted(signal);
    throwIfAborted(init.signal);
    if (init.method && init.method !== 'GET') throw new Error('Model adapter supports GET only');
    const raw = String(input);
    if (/[\\]/.test(raw) || /%(?:2e|2f|5c|00)/i.test(raw)
        || /\/(?:\.|\.\.)(?:\/|$)/.test(raw)) throw new Error('Invalid artifact URL');
    const url = new URL(raw, base);
    if (url.origin !== base.origin || url.username || url.password || url.search || url.hash
        || !url.pathname.startsWith(base.pathname)) throw new Error('Model path is outside its manifest');
    const path = validateArtifactPath(decodeURIComponent(url.pathname.slice(base.pathname.length)));
    const file = files.get(path);
    // Optional tokenizer/config probes must behave like missing local files, without a remote fallback.
    if (!file) return new Response('Artifact path is not in the manifest', { status: 404 });
    const id = `read-${++nextId}`;
    const state = { id, path, file, requestSignal: init.signal, received: 0, ready: false, active: false, queued: false };
    state.abort = () => {
      if (state.active) send(port, { type: 'cancel', id });
      finish(state, abortError(signal?.reason ?? init.signal?.reason));
    };
    const body = new ReadableStream({
      start(controller) { state.streamController = controller; },
      pull() {
        if (closed) throw new Error('Artifact bridge is closed');
        throwIfAborted(signal);
        throwIfAborted(init.signal);
        if (!state.active && !state.queued && pending.size >= maxReads && waiting.length >= maxQueuedReads) {
          throw new Error('Artifact reader limit reached');
        }
        return new Promise((resolve) => {
          state.resolvePull = resolve;
          if (state.ready) send(port, { type: 'pull', id });
          else if (!state.queued) {
            state.queued = true;
            signal?.addEventListener('abort', state.abort, { once: true });
            init.signal?.addEventListener('abort', state.abort, { once: true });
            waiting.push(state);
            drain();
          }
        });
      },
      cancel() {
        if (state.active) send(port, { type: 'cancel', id });
        finish(state);
      },
    }, { highWaterMark: 0 });
    // Transformers metadata probes read headers without consuming or cancelling the body.
    // Opening only on the first pull keeps those probes from retaining a host reader.
    return new Response(body, { headers: {
      'Content-Length': String(file.size),
      'Content-Type': file.mediaType || 'application/octet-stream',
    } });
  }
  return {
    fetch: fetchArtifact,
    close(reason = 'Artifact bridge closed') {
      if (closed) return;
      closed = true;
      for (const state of [...pending.values(), ...waiting]) {
        if (state.active) send(port, { type: 'cancel', id: state.id });
        finish(state, abortError(reason));
      }
      unsubscribe();
      port.close();
    },
  };
}
