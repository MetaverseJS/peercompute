import { MODEL_POLICY } from '../inference/modelManifest.js';

export const AGENT_TASKS = Object.freeze(['text-generation', 'image-text-to-text', 'text-to-image']);
export const AGENT_ROUTER_KIND = 'baseline';
const bytes = (value) => new TextEncoder().encode(value).byteLength;

export function normalizeAgentTask(input = {}) {
  const task = input.task ?? (input.image ? 'image-text-to-text' : 'text-generation');
  if (!AGENT_TASKS.includes(task)) throw new Error('This agent task is not supported');
  if (typeof input.prompt !== 'string' || !input.prompt.trim()
      || bytes(input.prompt) > (task === 'text-to-image' ? 4096 : MODEL_POLICY.maxPromptBytes)) {
    throw new Error('Enter a nonempty prompt within the task byte budget');
  }
  const maxNewTokens = input.maxNewTokens ?? 256;
  if (!Number.isSafeInteger(maxNewTokens) || maxNewTokens < 1 || maxNewTokens > MODEL_POLICY.maxNewTokens) {
    throw new Error('Agent output token budget is invalid');
  }
  let image;
  if (input.image != null) {
    const value = input.image;
    if (task !== 'image-text-to-text' || !Number.isSafeInteger(value.width) || !Number.isSafeInteger(value.height)
        || value.width < 1 || value.height < 1 || value.width > 1024 || value.height > 1024 || value.width * value.height > MODEL_POLICY.maxImagePixels
        || value.channels !== 4 || !(value.data instanceof Uint8Array || value.data instanceof Uint8ClampedArray)
        || value.data.byteLength !== value.width * value.height * 4) throw new Error('Agent images require bounded RGBA pixels');
    image = { width: value.width, height: value.height, channels: 4, data: new Uint8Array(value.data) };
  }
  if (task === 'image-text-to-text' && !image) throw new Error('This task requires an image');
  if (input.seed !== undefined && (!Number.isSafeInteger(input.seed) || input.seed < 0 || input.seed > 0xffffffff)) {
    throw new Error('Image seed must be an unsigned 32-bit integer');
  }
  return { task, prompt: input.prompt.trim(), maxNewTokens, ...(image ? { image } : {}),
    ...(input.seed !== undefined ? { seed: input.seed } : {}) };
}

/** Transparent cold-start policy; this is not a trained model-quality scorer. */
export function routeAgentTask({ task, inferenceMode = 'local-only', candidates = [] } = {}) {
  if (!AGENT_TASKS.includes(task) || !['local-only', 'network-assisted'].includes(inferenceMode)) {
    throw new Error('Invalid agent routing policy');
  }
  const eligible = candidates.filter((candidate) => candidate?.available === true
    && typeof candidate.manifestCid === 'string' && candidate.manifestCid.length > 0
    && typeof candidate.key === 'string' && typeof candidate.runtime === 'string'
    && (candidate.local === true || (candidate.local === false && inferenceMode === 'network-assisted'))
    && (candidate.task === task || (task === 'text-generation' && candidate.task === 'image-text-to-text'))
    && candidate.modalities?.includes('text')
    && (task !== 'image-text-to-text' || candidate.modalities.includes('image'))
    && candidate.outputModalities?.includes(task === 'text-to-image' ? 'image' : 'text'));
  eligible.sort((a, b) => Number(Boolean(a.busy)) - Number(Boolean(b.busy))
    || Number(!a.local) - Number(!b.local) || a.manifestCid.localeCompare(b.manifestCid));
  if (!eligible.length) throw Object.assign(new Error(inferenceMode === 'local-only'
    ? 'No compatible local model is loaded. Load one in the model console first.'
    : 'No compatible loaded local model or peer host is available.'), { code: 'ERR_AGENT_NO_MODEL' });
  const candidate = structuredClone(eligible[0]);
  return { candidate, route: { kind: AGENT_ROUTER_KIND, target: candidate.key,
    manifestCid: candidate.manifestCid, runtime: candidate.runtime, modelName: candidate.name ?? candidate.manifestCid,
    local: candidate.local, task, modelTask: candidate.task,
    reason: `${candidate.busy ? 'Compatible busy model; bounded inference queue' : 'Compatible ready model'}; ${candidate.local ? 'local execution' : 'peer execution'}; baseline routing, not learned quality ranking` } };
}

/** Byte-bounded context; the managed worker applies actual tokenizer/image limits. */
export function packAgentContext(head, input, events = []) {
  if (input.task === 'text-to-image') return { ...input, messages: [{ role: 'user', content: input.prompt }] };
  const parts = [head.identity?.name && `Your agent name is ${head.identity.name}.`, head.identity?.instructions, head.context?.summary && `Saved context:\n${head.context.summary}`,
    head.goals?.length && `Goals:\n${head.goals.join('\n')}`].filter(Boolean);
  const system = parts.join('\n\n');
  const fixed = [...(system ? [{ role: 'system', content: system }] : []), { role: 'user', content: input.prompt }];
  if (fixed.reduce((sum, item) => sum + bytes(item.content), 0) > MODEL_POLICY.maxPromptBytes) {
    throw new Error('Agent instructions, saved context and current prompt exceed the context byte budget');
  }
  const requests = new Map(); const turns = [];
  // Only the current image is sent. Keep identity/explicit memory, but do not
  // ground a new image in answers whose image pixels are no longer attached.
  for (const event of input.image ? [] : events) {
    if (event.type === 'request' && event.task !== 'text-to-image' && typeof event.text === 'string') requests.set(event.operationId, event);
    if (event.type === 'result' && event.task !== 'text-to-image' && typeof event.text === 'string') {
      const request = requests.get(event.operationId);
      if (request) {
        // Text follow-ups continue the latest successful visual exchange.
        // Failed/cancelled image requests never replace that context.
        if (request.task === 'image-text-to-text') turns.length = 0;
        if (event.text) turns.push([{ role: 'user', content: request.text }, { role: 'assistant', content: event.text }]);
      }
      requests.delete(event.operationId);
    }
  }
  const messages = [...(system ? [fixed[0]] : []), ...turns.slice(-12).flat(), fixed.at(-1)];
  const firstTurn = system ? 1 : 0;
  while (messages.length > MODEL_POLICY.maxMessages || messages.reduce((sum, item) => sum + bytes(item.content), 0) > MODEL_POLICY.maxPromptBytes) {
    if (messages.length - firstTurn <= 1) throw new Error('Agent context cannot fit its byte budget');
    messages.splice(firstTurn, 2);
  }
  return { ...input, messages };
}
