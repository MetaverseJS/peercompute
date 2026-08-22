function createAbortError() {
  if (typeof DOMException === 'function') return new DOMException('Terrain request aborted.', 'AbortError');
  const error = new Error('Terrain request aborted.');
  error.name = 'AbortError';
  return error;
}

function throwIfAborted(signal) {
  if (signal?.aborted) throw signal.reason?.name === 'AbortError' ? signal.reason : createAbortError();
}

function abortableDelay(delayMs, signal) {
  if (delayMs <= 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let timeoutId;
    const abort = () => {
      clearTimeout(timeoutId);
      reject(createAbortError());
    };
    timeoutId = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve();
    }, delayMs);
    signal?.addEventListener('abort', abort, { once: true });
  });
}

export async function retryTerrainRequest(
  operation,
  {
    attempts = 3,
    delayMs = 180,
    signal,
    onRetryStart = () => {},
    onRetryEnd = () => {}
  } = {}
) {
  if (typeof operation !== 'function') throw new TypeError('Terrain retry requires an operation.');
  if (!Number.isInteger(attempts) || attempts < 1) throw new RangeError('Terrain retry attempts must be positive.');
  if (!Number.isFinite(delayMs) || delayMs < 0) throw new RangeError('Terrain retry delay must be non-negative.');

  let retryContext = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    throwIfAborted(signal);
    if (retryContext) {
      try {
        await abortableDelay(delayMs, signal);
      } catch (error) {
        onRetryEnd(retryContext);
        retryContext = null;
        throw error;
      }
    }
    try {
      const result = await operation({ attempt, signal });
      if (retryContext) onRetryEnd(retryContext);
      return result;
    } catch (error) {
      if (retryContext) {
        onRetryEnd(retryContext);
        retryContext = null;
      }
      throwIfAborted(signal);
      if (error?.name === 'AbortError') throw error;
      if (attempt === attempts) throw error;
      retryContext = { attempt, nextAttempt: attempt + 1, error };
      onRetryStart(retryContext);
    }
  }
  throw new Error('Terrain retry loop terminated unexpectedly.');
}
