import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { createAgentModelAdapter } from '../../inference/src/agentModelAdapter.js';
import { routeAgentTask } from '../../../peercompute/src/peercompute/agents/AgentRouter.js';
import { normalizeAgentFace } from '../../../peercompute/src/peercompute/agents/WorldAgentContracts.js';

const digest = (data) => bytesToHex(sha256(data));
const aborted = () => new DOMException('Appearance operation cancelled', 'AbortError');
const copyImage = (image) => ({ ...image, data: image.data.slice() });
const faceKey = (face) => `${face.width}x${face.height}x${face.channels}:${face.sha256}`;

/** Deterministic, bounded CPU thumbnail. Original generated pixels stay in private history. */
export function appearanceThumbnail(image) {
  if (!image || !Number.isInteger(image.width) || !Number.isInteger(image.height)
      || image.width < 1 || image.height < 1 || image.width > 1024 || image.height > 1024
      || image.channels !== 4 || !(image.data instanceof Uint8Array || image.data instanceof Uint8ClampedArray)
      || image.data.length !== image.width * image.height * 4) throw new Error('Invalid appearance pixels');
  const scale = Math.min(1, 256 / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale)), height = Math.max(1, Math.round(image.height * scale));
  const data = new Uint8Array(width * height * 4);
  // Nearest sample at each destination pixel centre; no browser decoder, URL, or GPU is involved.
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const source = (Math.min(image.height - 1, Math.floor((y + .5) * image.height / height)) * image.width
      + Math.min(image.width - 1, Math.floor((x + .5) * image.width / width))) * 4;
    data.set(image.data.subarray(source, source + 4), (y * width + x) * 4);
  }
  return { width, height, channels: 4, sha256: digest(data), data };
}
function verified(image, expected) {
  const face = normalizeAgentFace(expected);
  if (!image || image.width !== face.width || image.height !== face.height || image.channels !== 4
      || !(image.data instanceof Uint8Array) || image.data.length !== face.width * face.height * 4
      || digest(image.data) !== face.sha256) throw new Error('Resident appearance integrity check failed');
  return { ...face, data: image.data.slice() };
}

/** Private persistence plus explicitly shared owner pixels; owns neither workers nor models. */
export function createWorldAppearance({ runtime, agents, worldId, onStatus = () => {} } = {}) {
  if (!agents?.run || !agents?.update || !agents?.getAttachment || typeof worldId !== 'string' || !worldId) {
    throw new Error('Appearance requires agent persistence and a world');
  }
  const inference = createAgentModelAdapter(runtime), lifetime = new AbortController();
  const operations = new Set(), generating = new Set(), cache = new Map();
  const bindingOf = (head) => head?.embodiments?.find((item) => item.worldId === worldId);
  const signalFor = (signal) => signal ? AbortSignal.any([signal, lifetime.signal]) : lifetime.signal;
  const emit = (event) => { try { Promise.resolve(onStatus(event)).catch(() => {}); } catch { /* UI cannot affect saved state. */ } };
  const track = (task) => { operations.add(task); task.catch(() => {}).finally(() => operations.delete(task)); return task; };
  const remember = (image) => {
    const key = faceKey(image);
    if (cache.has(key)) cache.delete(key);
    cache.set(key, copyImage(image));
    while (cache.size > 32) cache.delete(cache.keys().next().value); // <=8 MiB of pixels.
    return copyImage(image);
  };
  function publicRef(head) { const face = bindingOf(head)?.face; return face ? normalizeAgentFace(face) : null; }
  async function getLocal(agentId, { signal, sharedOnly = false, sha256: expected } = {}) {
    const combined = signalFor(signal); combined.throwIfAborted();
    const head = await agents.get(agentId), binding = bindingOf(head);
    if (!binding?.face || (sharedOnly && !binding.shared) || (expected && expected !== binding.face.sha256)) return null;
    const image = await agents.getAttachment(agentId, binding.face.attachmentId);
    combined.throwIfAborted();
    const result = verified(appearanceThumbnail(image), binding.face);
    // Sharing/removal may change while IndexedDB is reading. Never expose a former private face.
    const current = bindingOf(await agents.get(agentId)); combined.throwIfAborted();
    if (!current?.face || current.face.attachmentId !== binding.face.attachmentId
        || current.face.sha256 !== binding.face.sha256 || (sharedOnly && !current.shared)) return null;
    return remember(result);
  }
  function generate(agentId, { prompt, signal, onProgress } = {}) {
    if (generating.has(agentId)) return Promise.reject(new Error('An appearance is already being generated for this resident'));
    const combined = signalFor(signal); combined.throwIfAborted(); generating.add(agentId);
    const run = async () => {
      let head = await agents.get(agentId), binding = bindingOf(head);
      if (!binding) throw new Error('This resident no longer has a body in this world');
      const requested = prompt === undefined ? binding.appearancePrompt : prompt;
      if (typeof requested !== 'string' || !requested.trim()) throw new Error('Describe the resident appearance first');
      const requestId = crypto.randomUUID();
      combined.throwIfAborted();
      head = await agents.update(agentId, { embodiments: head.embodiments.map((item) => item.worldId === worldId
        ? { ...item, appearancePrompt: requested.trim(), appearanceRequestId: requestId } : item) }, { expectedRevision: head.revision, signal: combined });
      const candidates = await inference.listCandidates({ mode: head.policy.inferenceMode, task: 'text-to-image', signal: combined });
      combined.throwIfAborted();
      try { routeAgentTask({ task: 'text-to-image', inferenceMode: head.policy.inferenceMode, candidates }); }
      catch (error) {
        if (error.code !== 'ERR_AGENT_NO_MODEL') throw error;
        const message = 'Appearance saved. No image-generation model is available. Load or connect to one, then retry.';
        emit({ agentId, status: 'unavailable', message }); return { status: 'unavailable', head, message };
      }
      emit({ agentId, status: 'generating', message: 'Generating resident appearance…' });
      const conversationId = `appearance:${digest(new TextEncoder().encode(worldId))}`;
      const output = await agents.run(agentId, { task: 'text-to-image', prompt: requested.trim(), conversationId, signal: combined,
        onEvent: onProgress });
      combined.throwIfAborted();
      if (!output.imageAttachmentId) throw new Error('Generated appearance was not saved');
      const image = appearanceThumbnail(output.result.image);
      head = await agents.get(agentId); binding = bindingOf(head); combined.throwIfAborted();
      if (!binding || binding.appearanceRequestId !== requestId || binding.appearancePrompt !== requested.trim()) {
        throw new Error('Resident appearance changed before the generated image could be applied');
      }
      const face = { ...normalizeAgentFace(image), attachmentId: output.imageAttachmentId };
      head = await agents.update(agentId, { embodiments: head.embodiments.map((item) => item.worldId === worldId ? { ...item, face } : item) },
        { expectedRevision: head.revision, signal: combined });
      // The binding commit is acknowledged. A subsequent abort cannot roll it back.
      emit({ agentId, status: 'ready', message: 'Resident appearance saved.' });
      return { status: 'ready', head, face: normalizeAgentFace(face), image: remember(image) };
    };
    return track(run().catch((error) => { emit({ agentId, status: 'error', message: error.message }); throw error; })
      .finally(() => generating.delete(agentId)));
  }
  function loadRemote(descriptor, { network, signal } = {}) {
    const combined = signalFor(signal); combined.throwIfAborted();
    const face = normalizeAgentFace(descriptor.face);
    if (cache.has(faceKey(face))) return Promise.resolve(verified(cache.get(faceKey(face)), face));
    return track((async () => {
      const image = await network.requestAppearance(descriptor.ownerPeerId, { agentId: descriptor.agentId, face }, { signal: combined });
      combined.throwIfAborted(); return remember(verified(image, face));
    })());
  }
  return { generate, getLocal: (...args) => track(getLocal(...args)), publicRef, loadRemote,
    async dispose() { lifetime.abort(aborted()); await Promise.allSettled([...operations]); cache.clear(); } };
}
