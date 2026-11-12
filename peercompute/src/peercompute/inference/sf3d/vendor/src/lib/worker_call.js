/**
 * worker_call.js — fail-loud request/response over a Web Worker.
 *
 * Productionizes the CPU-offload workers' failure lifecycle. Every failure path
 * rejects loudly and never hangs or silently falls back:
 *   - worker posts { ok:false, error }        → reject with the error
 *   - worker posts { ok:true } but malformed   → reject (output validation)
 *   - worker top-level throw (onerror)         → reject
 *   - message deserialization fails (onmessageerror) → reject
 *   - worker wedged / never replies            → reject after timeoutMs
 * Listeners are always torn down (success, failure, timeout). The caller decides
 * whether to fall back to a main-thread path — this helper never does so
 * silently.
 *
 * @param {Worker} worker
 * @param {object} message           postMessage payload (must carry a unique id)
 * @param {Transferable[]} transfer  transfer list
 * @param {object} opts
 * @param {number} [opts.timeoutMs=30000]
 * @param {(data:any)=>any} opts.onResult   maps a validated { ok:true } reply to
 *   the resolved value; THROW inside to reject on malformed output.
 * @returns {Promise<any>}
 */
export function callWorker(worker, message, transfer, { timeoutMs = 30000, onResult }) {
  const id = message.id;
  if (!id) throw new Error('callWorker: message.id is required');
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onError);
      worker.removeEventListener('messageerror', onMessageError);
      clearTimeout(timer);
    };
    const done = (fn, arg) => { if (settled) return; settled = true; cleanup(); fn(arg); };

    const onMessage = (e) => {
      if (e.data?.id !== id) return; // not our reply
      if (e.data.ok) {
        try { done(resolve, onResult(e.data)); }
        catch (err) { done(reject, new Error(`worker output invalid: ${err?.message || err}`)); }
      } else {
        done(reject, new Error(`worker failed: ${e.data?.error || 'unknown error'}`));
      }
    };
    const onError = (e) => done(reject, new Error(`worker error: ${e?.message || 'top-level worker exception'}`));
    const onMessageError = () => done(reject, new Error('worker messageerror: reply could not be deserialized'));

    worker.addEventListener('message', onMessage);
    worker.addEventListener('error', onError);
    worker.addEventListener('messageerror', onMessageError);
    const timer = setTimeout(() => done(reject, new Error(`worker timed out after ${timeoutMs}ms`)), timeoutMs);

    try {
      worker.postMessage(message, transfer);
    } catch (err) {
      done(reject, new Error(`worker postMessage failed: ${err?.message || err}`));
    }
  });
}
