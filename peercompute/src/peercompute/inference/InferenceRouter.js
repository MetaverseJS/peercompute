import { MODEL_POLICY } from './modelManifest.js';

export const INFERENCE_TASKS = Object.freeze(['text-generation', 'image-text-to-text', 'text-to-image',
  'automatic-speech-recognition', 'text-to-speech']);

/** Capabilities describe executable adapters, never names or model-card claims. */
export function supportsTask(candidate, task) {
  const input = candidate?.modalities, output = candidate?.outputModalities;
  if (!Array.isArray(input) || !Array.isArray(output) || !INFERENCE_TASKS.includes(task)) return false;
  if (candidate.task !== task && !(task === 'text-generation' && candidate.task === 'image-text-to-text')) return false;
  if (task === 'automatic-speech-recognition') return input.includes('audio') && output.includes('text');
  if (!input.includes('text')) return false;
  if (task === 'image-text-to-text' && !input.includes('image')) return false;
  return output.includes(task === 'text-to-image' ? 'image' : task === 'text-to-speech' ? 'audio' : 'text');
}

/** Scheduling readiness shared by the composer and the execution router. */
export function hasInferenceCapacity(candidate) {
  if (candidate?.available !== true || candidate.queueAvailable === false) return false;
  const queued = candidate.queuedRequests ?? 0, capacity = candidate.queueCapacity ?? MODEL_POLICY.maxQueued;
  return Number.isSafeInteger(queued) && queued >= 0 && Number.isSafeInteger(capacity) && capacity >= 0
    && (!candidate.busy || queued < capacity);
}

export function routeInferenceTask({ task, mode = 'local', candidates = [] } = {}) {
  if (!INFERENCE_TASKS.includes(task) || !['mixed', 'local', 'peers'].includes(mode) || !Array.isArray(candidates)) {
    throw new Error('Invalid inference routing policy');
  }
  const eligible = candidates.filter((candidate) => {
    if (!hasInferenceCapacity(candidate) || !supportsTask(candidate, task)
        || typeof candidate.manifestCid !== 'string' || !candidate.manifestCid
        || typeof candidate.key !== 'string' || !candidate.key || typeof candidate.runtime !== 'string'
        || ![true, false].includes(candidate.local)
        || (mode === 'local' && !candidate.local) || (mode === 'peers' && candidate.local)) return false;
    return true;
  });
  eligible.sort((a, b) => Number(!a.local) - Number(!b.local)
    || Number(Boolean(a.busy)) - Number(Boolean(b.busy))
    || Number(a.task !== task) - Number(b.task !== task)
    || (a.queuedRequests ?? 0) - (b.queuedRequests ?? 0)
    || Math.max(0, b.idleForMs ?? 0) - Math.max(0, a.idleForMs ?? 0)
    || a.manifestCid.localeCompare(b.manifestCid) || a.key.localeCompare(b.key));
  if (!eligible.length) throw Object.assign(new Error(mode === 'local'
    ? 'No compatible local model has available inference capacity.'
    : mode === 'peers' ? 'No compatible peer model has available inference capacity.'
      : 'No compatible local model or peer host has available inference capacity.'), { code: 'ERR_INFERENCE_NO_MODEL' });
  const candidate = structuredClone(eligible[0]);
  return { candidate, route: { kind: 'baseline', target: candidate.key, manifestCid: candidate.manifestCid,
    runtime: candidate.runtime, modelName: candidate.name ?? candidate.manifestCid, local: candidate.local,
    task, modelTask: candidate.task,
    reason: `${candidate.local ? 'Local-first execution' : 'Peer execution'}; ${candidate.busy ? 'bounded available queue' : 'ready capacity'}; baseline routing, not learned quality ranking` } };
}
