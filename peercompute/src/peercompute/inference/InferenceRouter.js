import { MODEL_POLICY } from './modelManifest.js';
import { INFERENCE_TASKS, supportsTask } from './InferenceCapabilities.js';
export { INFERENCE_TASKS, supportsTask, inferInferenceTask, supportsInferenceInput } from './InferenceCapabilities.js';

/** Scheduling readiness shared by the composer and the execution router. */
export function hasInferenceCapacity(candidate, task, inputModalities = []) {
  if (candidate?.available !== true || candidate.queueAvailable === false) return false;
  if (task && Array.isArray(candidate.hosts) && candidate.hosts.length) {
    return candidate.hosts.some((host) => supportsTask({ ...candidate, ...host }, task)
      && inputModalities.every((modality) => (host.modalities ?? candidate.modalities)?.includes(modality))
      && hasInferenceCapacity({ ...host, available: true }));
  }
  const queued = candidate.queuedRequests ?? 0, capacity = candidate.queueCapacity ?? MODEL_POLICY.maxQueued;
  return Number.isSafeInteger(queued) && queued >= 0 && Number.isSafeInteger(capacity) && capacity >= 0
    && (!candidate.busy || queued < capacity);
}

export function routeInferenceTask({ task, mode = 'local', candidates = [], inputModalities = [] } = {}) {
  if (!INFERENCE_TASKS.includes(task) || !['mixed', 'local', 'peers'].includes(mode) || !Array.isArray(candidates)
      || !Array.isArray(inputModalities) || inputModalities.some((value) => !['text', 'image', 'audio'].includes(value))) {
    throw new Error('Invalid inference routing policy');
  }
  const compatible = candidates.filter((candidate) => {
    if (candidate?.available !== true || !supportsTask(candidate, task)
        || inputModalities.some((value) => !candidate.modalities.includes(value))
        || typeof candidate.manifestCid !== 'string' || !candidate.manifestCid
        || typeof candidate.key !== 'string' || !candidate.key || typeof candidate.runtime !== 'string'
        || ![true, false].includes(candidate.local)
        || (mode === 'local' && !candidate.local) || (mode === 'peers' && candidate.local)) return false;
    return !Array.isArray(candidate.hosts) || candidate.hosts.some(host => supportsTask({ ...candidate, ...host }, task)
      && inputModalities.every(modality => (host.modalities ?? candidate.modalities)?.includes(modality)));
  });
  const eligible = compatible.filter(candidate => hasInferenceCapacity(candidate, task, inputModalities));
  eligible.sort((a, b) => Number(!a.local) - Number(!b.local)
    || Number(Boolean(a.busy)) - Number(Boolean(b.busy))
    || Number(a.task !== task) - Number(b.task !== task)
    || (a.queuedRequests ?? 0) - (b.queuedRequests ?? 0)
    || Math.max(0, b.idleForMs ?? 0) - Math.max(0, a.idleForMs ?? 0)
    || a.manifestCid.localeCompare(b.manifestCid) || a.key.localeCompare(b.key));
  if (!eligible.length) throw Object.assign(new Error(mode === 'local'
    ? 'No compatible local model has available inference capacity.'
    : mode === 'peers' ? 'No compatible peer model has available inference capacity.'
      : 'No compatible local model or peer host has available inference capacity.'),
    { code: compatible.length ? 'ERR_INFERENCE_BUSY' : 'ERR_INFERENCE_NO_MODEL' });
  const candidate = structuredClone(eligible[0]);
  return { candidate, route: { kind: 'baseline', target: candidate.key, manifestCid: candidate.manifestCid,
    runtime: candidate.runtime, modelName: candidate.name ?? candidate.manifestCid, local: candidate.local,
    task, modelTask: candidate.task,
    reason: `${candidate.local ? 'Local-first execution' : 'Peer execution'}; ${candidate.busy ? 'bounded available queue' : 'ready capacity'}; baseline routing, not learned quality ranking` } };
}
