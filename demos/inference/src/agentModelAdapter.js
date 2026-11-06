/** Agents share the console's manager-owned services; this adapter owns no workers or model loads. */
export function createAgentModelAdapter(runtime) {
  return {
    async listCandidates({ mode = 'local-only', signal, refresh = true } = {}) {
      signal?.throwIfAborted();
      if (!['local-only', 'network-assisted'].includes(mode)) throw new Error('Unknown agent inference mode');
      let refreshed = true;
      if (mode === 'network-assisted' && refresh) {
        try { await runtime.refreshPeers({ signal }); }
        catch { signal?.throwIfAborted(); refreshed = false; }
      }
      signal?.throwIfAborted();
      const service = runtime.service;
      const status = service.getStatus();
      const targets = runtime.listInferenceTargets();
      const local = targets.find((entry) => entry.local && entry.available);
      const candidates = [];
      if (local && status.status === 'ready' && status.manifestCid && status.sessionId) {
        const manifest = await runtime.store.getManifest(status.manifestCid, { signal });
        signal?.throwIfAborted();
        const current = runtime.service.getStatus();
        if (runtime.service === service && current.status === 'ready' && current.sessionId === status.sessionId
            && current.manifestCid === status.manifestCid) candidates.push({ ...local,
          manifestCid: status.manifestCid, sessionId: status.sessionId, runtime: manifest.model.runtime,
          task: manifest.model.task ?? local.task, modalities: manifest.model.modalities ?? local.modalities,
          outputModalities: manifest.model.outputModalities ?? local.outputModalities });
      }
      if (mode === 'network-assisted' && refreshed) candidates.push(...targets.filter((entry) => entry.local === false && entry.available));
      return candidates;
    },
    generate(candidate, input, options = {}) {
      options.signal?.throwIfAborted();
      if (candidate.local) {
        const status = runtime.service.getStatus();
        if (status.status !== 'ready' || status.manifestCid !== candidate.manifestCid || status.sessionId !== candidate.sessionId) {
          throw Object.assign(new Error('The selected local model changed before dispatch'), { code: 'ERR_AGENT_STALE_MODEL' });
        }
      } else if (candidate.key !== `peer:${candidate.manifestCid}`) throw new Error('Invalid peer model identity');
      return runtime.generate(candidate.local ? 'local' : candidate.key, { ...input, ...options,
        ...(candidate.local ? { sessionId: candidate.sessionId } : {}) });
    },
    cancel: (requestId) => runtime.cancel(requestId),
  };
}
