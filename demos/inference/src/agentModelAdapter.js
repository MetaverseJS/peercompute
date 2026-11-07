import { routeInferenceTask } from '../../../peercompute/src/peercompute/inference/InferenceRouter.js';

/** Agents share the console's manager-owned services; this adapter owns no workers or model loads. */
export function createAgentModelAdapter(runtime) {
  return {
    async listCandidates({ mode = 'local-only', task, signal, refresh = true } = {}) {
      signal?.throwIfAborted();
      if (!['local-only', 'network-assisted'].includes(mode)) throw new Error('Unknown agent inference mode');
      const candidates = [];
      const seen = new Set();
      for (const local of runtime.listInferenceTargets().filter((entry) => entry.local && entry.available)) {
        const service = runtime.getServiceForModel?.(local.manifestCid) ?? runtime.service;
        const status = service.getStatus();
        if (status.status !== 'ready' || !status.manifestCid || !status.sessionId || seen.has(status.sessionId)) continue;
        if (local.manifestCid && status.manifestCid !== local.manifestCid) continue;
        const manifest = await runtime.store.getManifest(status.manifestCid, { signal });
        signal?.throwIfAborted();
        const current = service.getStatus();
        const sameService = (runtime.getServiceForModel?.(status.manifestCid) ?? runtime.service) === service;
        if (sameService && current.status === 'ready' && current.sessionId === status.sessionId
            && current.manifestCid === status.manifestCid) { seen.add(status.sessionId); candidates.push({ ...local,
          manifestCid: status.manifestCid, sessionId: status.sessionId, runtime: manifest.model.runtime,
          task: manifest.model.task ?? local.task, modalities: manifest.model.modalities ?? local.modalities,
          outputModalities: manifest.model.outputModalities ?? local.outputModalities }); }
      }
      if (mode === 'local-only') return candidates;
      if (task) {
        try { routeInferenceTask({ task, mode: 'local', candidates }); return candidates; }
        catch (error) { if (error.code !== 'ERR_INFERENCE_NO_MODEL') throw error; }
      }
      let refreshed = true;
      if (refresh) {
        try { await runtime.refreshPeers({ signal }); }
        catch { signal?.throwIfAborted(); refreshed = false; }
      }
      signal?.throwIfAborted();
      if (refreshed) candidates.push(...runtime.listInferenceTargets().filter((entry) => entry.local === false && entry.available));
      return candidates;
    },
    generate(candidate, input, options = {}) {
      options.signal?.throwIfAborted();
      if (candidate.local) {
        const service = runtime.getServiceForModel?.(candidate.manifestCid) ?? runtime.service;
        const status = service.getStatus();
        if (status.status !== 'ready' || status.manifestCid !== candidate.manifestCid || status.sessionId !== candidate.sessionId) {
          throw Object.assign(new Error('The selected local model changed before dispatch'), { code: 'ERR_AGENT_STALE_MODEL' });
        }
      } else if (candidate.key !== `peer:${candidate.manifestCid}`) throw new Error('Invalid peer model identity');
      return runtime.generate(candidate.local && !runtime.getServiceForModel ? 'local' : candidate.key, { ...input, ...options,
        ...(candidate.local ? { sessionId: candidate.sessionId } : {}) });
    },
    cancel: (requestId) => runtime.cancel(requestId),
  };
}
