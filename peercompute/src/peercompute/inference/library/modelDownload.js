const TRANSIENT_STATUS = new Set([408, 429, 500, 502, 503, 504]);

function wait(ms, signal) {
  signal?.throwIfAborted();
  return new Promise((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve(); }, ms);
    signal?.addEventListener('abort', abort, { once: true });
  });
}

function transient(error) {
  return ['TypeError', 'NetworkError', 'TimeoutError'].includes(error?.name);
}

// A stalled source may never settle cancellation. Do not hold retention for it.
function dispose(operation) {
  try { Promise.resolve(operation()).catch(() => {}); } catch { /* Best-effort transport cleanup. */ }
}

/** Resume only within this import: one byte stream, one hash, one UnixFS import.
 * Always re-resolve the canonical URL; signed redirect URLs are never retained.
 * A pinned digest is required before combining responses from different requests.
 */
export async function* downloadModelFile(file, sourceUrl, { signal, fetchImpl = fetch, onRetry,
  maxRetries = 5, baseRetryMs = 1000, inactivityTimeoutMs = 30000 } = {}) {
  let offset = 0, retries = 0, etag, encoded = false;
  const verified = Boolean(file.sha256 || file.gitBlobSha1);
  for (;;) {
    signal?.throwIfAborted();
    const controller = new AbortController();
    const activeSignal = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;
    let response, iterator, failure;
    // Only network waits have a deadline: slow IndexedDB writes must not time out.
    const network = async (operation) => {
      let timer, abort;
      activeSignal.throwIfAborted();
      const aborted = new Promise((_, reject) => {
        abort = () => reject(activeSignal.reason);
        activeSignal.addEventListener('abort', abort, { once: true });
      });
      const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => {
          const error = new DOMException('Model download stopped receiving data', 'TimeoutError');
          controller.abort(error); reject(error);
        }, inactivityTimeoutMs);
      });
      try { return await Promise.race([operation(), timeout, aborted]); }
      finally { clearTimeout(timer); activeSignal.removeEventListener('abort', abort); }
    };
    try {
      try {
        response = await network(async () => {
          const value = await fetchImpl(sourceUrl(file.path), { signal: activeSignal,
          credentials: 'omit', cache: 'no-store',
          ...(offset ? { headers: { Range: `bytes=${offset}-${file.size - 1}` } } : {}) });
          if (activeSignal.aborted) {
            dispose(() => value.body?.cancel?.());
            throw activeSignal.reason;
          }
          return value;
        });
      } catch (error) {
        signal?.throwIfAborted();
        if (!transient(error)) throw error;
        failure = error;
      }
      if (response) {
        if (!response.ok) {
          const error = new Error(`Artifact source failed: ${file.path} (${response.status})`);
          if (!TRANSIENT_STATUS.has(response.status)) throw error;
          failure = error;
        } else {
          if (!response.body) throw new Error(`Artifact source has no body: ${file.path}`);
          const encoding = response.headers?.get('content-encoding');
          if (offset && (encoded || (encoding && encoding !== 'identity')))
            throw new Error(`Cannot resume an encoded model download: ${file.path}`);
          if (offset || response.status === 206) {
            const match = response.headers?.get('content-range')?.match(/^bytes (\d+)-(\d+)\/(\d+)$/u);
            if (response.status !== 206 || !match || Number(match[1]) !== offset
                || Number(match[2]) !== file.size - 1 || Number(match[3]) !== file.size)
              throw new Error(`Model download cannot resume: invalid or ignored byte range for ${file.path}. Retry Load.`);
          }
          const currentEtag = response.headers?.get('etag');
          if (offset && etag && currentEtag && currentEtag !== etag)
            throw new Error(`Model source changed during download: ${file.path}`);
          if (!offset) { etag = currentEtag; encoded = Boolean(encoding && encoding !== 'identity'); }
          if (response.body.getReader) {
            const reader = response.body.getReader();
            iterator = { next: () => reader.read(), return: async () => {
              try { await reader.cancel(); } finally { reader.releaseLock(); }
            } };
          } else iterator = response.body[Symbol.asyncIterator]();
          for (;;) {
            let chunk;
            try { chunk = await network(() => iterator.next()); }
            catch (error) {
              signal?.throwIfAborted();
              if (!transient(error)) throw error;
              failure = error; break;
            }
            signal?.throwIfAborted();
            if (chunk.done) {
              if (offset === file.size) return;
              failure = new Error(`Model download ended before all bytes arrived: ${file.path}`);
              break;
            }
            if (!(chunk.value instanceof Uint8Array) || offset + chunk.value.byteLength > file.size)
              throw new Error(`Model download exceeds its declared size or has invalid bytes: ${file.path}`);
            offset += chunk.value.byteLength;
            yield chunk.value;
          }
        }
      }
    } finally {
      controller.abort();
      // Also close the source when the consumer stops (cancel, quota or hash error).
      if (iterator) dispose(() => iterator.return?.());
      else dispose(() => response?.body?.cancel?.());
    }
    signal?.throwIfAborted();
    // A connection can fail after its final byte. The caller still checks the hash.
    if (offset > 0 && offset === file.size && verified) return;
    if ((offset && !verified) || retries >= maxRetries) {
      const error = new Error(`Download interrupted for ${file.path} after ${offset} of ${file.size} bytes. `
        + (offset && !verified ? 'This file cannot be safely resumed. ' : `Recovery failed after ${retries} retries. `)
        + 'Check your connection and retry Load.', { cause: failure });
      error.code = 'ERR_MODEL_DOWNLOAD_INTERRUPTED'; throw error;
    }
    retries += 1;
    const retryDelayMs = Math.min(baseRetryMs * 2 ** (retries - 1), 8000);
    onRetry?.({ loaded: offset, retryAttempt: retries, maxRetries, retryDelayMs });
    await wait(retryDelayMs, signal);
  }
}
