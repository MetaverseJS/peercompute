/** Owns bounded thumbnail reads and stale-result suppression, independent of a renderer. */
export function createWorldAppearancePresenter({ appearance, adapter, getNetwork, onError = () => {}, concurrency = 2 }) {
  const current = new Map(), pending = new Map(), applied = new Map();
  let closed = false, disposal;
  const token = body => JSON.stringify([body.local ? 'local' : body.ownerPeerId, body.agentId,
    body.face?.sha256, body.face?.width, body.face?.height, body.face?.channels]);
  function sync(descriptors) {
    if (closed || !adapter.setAppearance) return;
    current.clear();
    for (const body of descriptors) current.set(body.key, body);
    for (const [key, run] of pending) {
      if (!current.has(key) || token(current.get(key)) !== run.token) run.controller.abort();
    }
    for (const [key] of applied) {
      if (!current.get(key)?.face) {
        if (current.has(key)) adapter.setAppearance(key, null);
        applied.delete(key);
      }
    }
    for (const body of current.values()) {
      if (!body.face || pending.has(body.key) || applied.get(body.key) === token(body)) continue;
      if (pending.size >= concurrency) break;
      const network = getNetwork();
      if (!body.local && !network?.requestAppearance) continue;
      const run = { controller: new AbortController(), token: token(body) };
      pending.set(body.key, run);
      run.done = Promise.resolve().then(async () => {
        const signal = run.controller.signal; signal.throwIfAborted();
        const image = body.local ? await appearance.getLocal(body.agentId, { signal, sha256: body.face.sha256 })
          : await appearance.loadRemote(body, { network, signal });
        signal.throwIfAborted();
        if (!closed && image && current.has(body.key) && token(current.get(body.key)) === run.token) {
          adapter.setAppearance(body.key, image); applied.set(body.key, run.token);
        }
      }).catch(error => {
        if (!closed && !run.controller.signal.aborted) {
          try { onError({ key: body.key, error }); } catch { /* Presentation observer. */ }
        }
      }).finally(() => { if (pending.get(body.key) === run) pending.delete(body.key); });
    }
  }
  return { sync, getStatus: () => ({ pending: pending.size, applied: applied.size, closed }),
    dispose() {
      if (disposal) return disposal;
      closed = true;
      for (const run of pending.values()) run.controller.abort();
      disposal = Promise.allSettled([...pending.values()].map(run => run.done)).then(() => {
        current.clear(); applied.clear(); pending.clear();
      });
      return disposal;
    } };
}
