// Browser locks coordinate separate tabs/workers. The fallback is deliberately
// restricted to memory-only stores; it cannot coordinate persistent contexts.
const localLocks = new Map();

export function throwIfAborted(signal) {
  if (signal?.aborted) throw signal.reason || new DOMException('Aborted', 'AbortError');
}

export async function acquireArtifactLock(name, mode, signal, lockManager) {
  throwIfAborted(signal);
  if (lockManager) {
    return new Promise((resolve, reject) => {
      lockManager.request(name, { mode, ...(signal ? { signal } : {}) }, async () => {
        await new Promise((release) => resolve(release));
      }).catch(reject);
    });
  }
  let state = localLocks.get(name);
  if (!state) { state = { readers: 0, writer: false, queue: [] }; localLocks.set(name, state); }
  return new Promise((resolve, reject) => {
    const pump = () => {
      while (state.queue.length && !state.writer) {
        const next = state.queue[0];
        if (next.mode === 'exclusive' && state.readers) break;
        state.queue.shift();
        next.signal?.removeEventListener('abort', next.abort);
        if (next.mode === 'exclusive') state.writer = true; else state.readers++;
        let released = false;
        next.resolve(() => {
          if (released) return;
          released = true;
          if (next.mode === 'exclusive') state.writer = false; else state.readers--;
          pump();
          if (!state.writer && !state.readers && !state.queue.length) localLocks.delete(name);
        });
        if (next.mode === 'exclusive') break;
      }
    };
    const waiter = { mode, signal, resolve, abort: () => {
      const index = state.queue.indexOf(waiter);
      if (index >= 0) state.queue.splice(index, 1);
      reject(signal.reason || new DOMException('Aborted', 'AbortError'));
      pump();
    } };
    signal?.addEventListener('abort', waiter.abort, { once: true });
    state.queue.push(waiter);
    pump();
  });
}
