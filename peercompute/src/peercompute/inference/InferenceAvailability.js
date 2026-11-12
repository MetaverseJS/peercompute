const waitingCodes = new Map([
  ...['ERR_INFERENCE_BUSY', 'ERR_RESOURCE_CAPACITY', 'ERR_RESOURCE_MEMORY_BUDGET']
    .map(code => [code, 'busy']),
  ...['ERR_INFERENCE_NO_MODEL', 'ERR_AGENT_NO_MODEL', 'ERR_INFERENCE_NOT_HOSTED',
    'ERR_AGENT_STALE_MODEL', 'ERR_MODEL_NOT_READY'].map(code => [code, 'model-unavailable']),
  ['ERR_MODEL_RESIDENCY_INACTIVE', 'recovering'],
]);

/** Availability is not a failed inference. Never use this to replay an accepted
 * request: its remote outcome may already exist even when transport failed. */
export function classifyInferenceAvailability(error) {
  if (!error || error.committed || error.outputStarted || error.name === 'AbortError') return null;
  const kind = waitingCodes.get(error.code);
  return kind ? { kind, code: error.code, message: String(error.message ?? error.code).slice(0, 2048) } : null;
}

function settleOrAbort(promise, signal) {
  signal.throwIfAborted();
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason);
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}

/** Only selection/readiness is retried. The caller dispatches once, after this
 * resolves, and must recheck any world/owner authority that changed while waiting. */
export async function waitForInferenceAvailability({ select, signal, onWaiting,
  pollMs = 1000, timeoutMs = 30_000 } = {}) {
  if (typeof select !== 'function' || !Number.isSafeInteger(pollMs) || pollMs < 1
      || !Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 300_000) {
    throw new TypeError('Invalid inference availability wait');
  }
  signal?.throwIfAborted();
  let lastError;
  const deadline = new AbortController();
  const timeout = setTimeout(() => deadline.abort(Object.assign(new Error('Waiting for an available model'),
    { code: 'ERR_INFERENCE_NO_MODEL' })), timeoutMs);
  const activeSignal = signal ? AbortSignal.any([signal, deadline.signal]) : deadline.signal;
  try {
    for (;;) {
      activeSignal.throwIfAborted();
      try { return await settleOrAbort(Promise.resolve().then(() => select({ signal: activeSignal })), activeSignal); }
      catch (error) {
        activeSignal.throwIfAborted();
        const availability = classifyInferenceAvailability(error);
        if (!availability) throw error;
        lastError = error;
        // A progress observer cannot turn a wait into execution or a failure.
        try { Promise.resolve(onWaiting?.({ type: 'waiting', ...availability })).catch(() => {}); } catch { /* Observer only. */ }
      }
      let timer;
      try { await settleOrAbort(new Promise(resolve => { timer = setTimeout(resolve, pollMs); }), activeSignal); }
      finally { clearTimeout(timer); }
    }
  } catch (error) {
    signal?.throwIfAborted();
    if (deadline.signal.aborted && lastError) throw lastError;
    throw error;
  } finally { clearTimeout(timeout); }
}
