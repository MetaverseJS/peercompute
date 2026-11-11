import { normalizeResidentAvatar } from './ResidentAvatar.js';
import { agentIdentifier, AGENT_LIMITS } from './AgentContracts.js';
import { normalizeAgentFace, normalizeWorldPosition, worldAgentText } from './WorldAgentContracts.js';

export const RESIDENT_AVATAR_PROFILE_SCHEMA = 'peercompute.resident-profile.v2';
export const RESIDENT_PROFILE_SCHEMA = 'peercompute.resident-profile.v1';
// The retained store is at most 4 MiB; allow bounded identity/template overhead.
export const RESIDENT_PROFILE_MAX_BYTES = 4.5 * 1024 * 1024;
export const RESIDENT_PROFILE_MEMORY_LIMITS = Object.freeze({ entries: 4096, episodeBytes: 4096 });
const encoder = new TextEncoder();
const fields = new Set(['schema', 'sourceAgentId', 'name', 'instructions', 'goals', 'appearancePrompt', 'color', 'face', 'memories']);
function prose(value, maximum, label) {
  if (typeof value !== 'string' || value.includes('\0') || encoder.encode(value).length > maximum
      || new TextDecoder().decode(encoder.encode(value)) !== value) throw new TypeError(`Invalid resident profile ${label}`);
  return value;
}
function only(value, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => !keys.includes(key))) {
    throw new TypeError('Unexpected shared memory fields');
  }
}
function sharedMemory(input, sourceAgentId, worldId, includePrivate) {
  only(input, ['sourceAgentId', 'worldId', 'audience', 'conversationId', 'kind', 'when', 'who', 'where', 'outcome', 'text', 'source']);
  only(input.who, ['peerId', 'agentId', 'name']); only(input.source, ['kind', 'eventId', 'peerId', 'sourceAgentId']);
  if (input.sourceAgentId !== sourceAgentId || !['public', ...(includePrivate ? ['private'] : [])].includes(input.audience)
      || (worldId !== undefined && input.worldId !== worldId)
      || !Number.isSafeInteger(input.when) || input.when < 0) throw new TypeError('Shared memory identity, audience or world mismatch');
  if (!['verified-action', 'authenticated-message', 'local-observation', 'shared-memory'].includes(input.source.kind)) throw new TypeError('Invalid shared memory provenance');
  if (!input.who.peerId && !input.who.agentId) throw new TypeError('Shared memory requires an attributed participant');
  const record = { sourceAgentId: agentIdentifier(sourceAgentId), worldId: worldAgentText(input.worldId, 240, 'memory world'), audience: input.audience,
    conversationId: worldAgentText(input.conversationId, 160, 'memory conversation'),
    kind: worldAgentText(input.kind, 80, 'memory kind'), when: input.when, where: normalizeWorldPosition(input.where),
    who: { ...(input.who.peerId ? { peerId: worldAgentText(input.who.peerId, 160, 'memory peer') } : {}),
      ...(input.who.agentId ? { agentId: agentIdentifier(input.who.agentId) } : {}),
      ...(input.who.name ? { name: worldAgentText(input.who.name, 240, 'memory name') } : {}) },
    outcome: prose(input.outcome, 512, 'memory outcome'), text: prose(input.text, 2048, 'memory text'),
    source: { kind: input.source.kind, eventId: worldAgentText(input.source.eventId, 160, 'memory event'),
      ...(input.source.peerId ? { peerId: worldAgentText(input.source.peerId, 160, 'memory source peer') } : {}),
      ...(input.source.kind === 'shared-memory' ? { sourceAgentId: agentIdentifier(input.source.sourceAgentId) } : {}) } };
  if (encoder.encode(JSON.stringify(record)).length > RESIDENT_PROFILE_MEMORY_LIMITS.episodeBytes) throw new RangeError('Shared memory exceeds its byte budget');
  return record;
}

/** An explicit clone template; never an agent export or authority transfer. */
export function normalizeResidentProfile(input, { worldId, includePrivate = false } = {}) {
  if (typeof includePrivate !== 'boolean') throw new TypeError('Invalid private resident memory permission');
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(key => !fields.has(key) && !(input.schema === RESIDENT_AVATAR_PROFILE_SCHEMA && key === 'avatar'))
      || ![RESIDENT_PROFILE_SCHEMA, RESIDENT_AVATAR_PROFILE_SCHEMA].includes(input.schema) || !/^#[a-f0-9]{6}$/i.test(input.color ?? '')) throw new TypeError('Invalid resident profile');
  if (!Array.isArray(input.goals) || input.goals.length > 16) throw new TypeError('Invalid resident profile goals');
  if (input.face && Object.keys(input.face).some(key => !['sha256', 'width', 'height', 'channels'].includes(key))) throw new TypeError('Private face fields are not transferable');
  const profile = { schema: input.schema,
    ...(input.avatar ? { avatar: normalizeResidentAvatar(input.avatar) } : {}), sourceAgentId: agentIdentifier(input.sourceAgentId),
    name: worldAgentText(input.name, 240, 'profile name'), instructions: prose(input.instructions, 16 * 1024, 'instructions'),
    goals: input.goals.map(goal => prose(goal, 4096, 'goal')), appearancePrompt: prose(input.appearancePrompt ?? '', 2048, 'appearance'),
    color: input.color, ...(input.face ? { face: normalizeAgentFace(input.face) } : {}) };
  if (encoder.encode(JSON.stringify(profile)).length > AGENT_LIMITS.headBytes) throw new RangeError('Resident profile identity exceeds its byte budget');
  if (input.memories !== undefined) {
    if (!Array.isArray(input.memories) || input.memories.length > RESIDENT_PROFILE_MEMORY_LIMITS.entries) throw new RangeError('Too many shared resident memories');
    profile.memories = input.memories.map(memory => sharedMemory(memory, profile.sourceAgentId, worldId, includePrivate));
  }
  if (encoder.encode(JSON.stringify(profile)).length > RESIDENT_PROFILE_MAX_BYTES) throw new RangeError('Resident profile exceeds its byte budget');
  return profile;
}

export function createResidentProfile(head, worldId, { memories = [] } = {}) {
  const binding = head?.embodiments?.find(item => item.worldId === worldId);
  if (!binding?.shared || binding.allowCloning !== true) {
    throw Object.assign(new Error('This resident is not available for cloning'), { code: 'ERR_AGENT_NOT_SHARED' });
  }
  let shared;
  if (binding.shareMemories === true) {
    if (!Array.isArray(memories) || memories.length > RESIDENT_PROFILE_MEMORY_LIMITS.entries) throw new RangeError('Too many selected resident memories');
    shared = memories.map(memory => {
      if (memory.agentId !== head.agentId || memory.worldId !== worldId || !['public', 'private'].includes(memory.audience)
          || (memory.audience === 'private' && binding.sharePrivateMemories !== true)) {
        throw new TypeError('Only this resident\'s explicitly shared world memories may be shared');
      }
      return { sourceAgentId: head.agentId, worldId, audience: memory.audience, conversationId: memory.conversationId,
        kind: memory.kind, when: memory.when,
        who: memory.who, where: memory.where, outcome: memory.outcome, text: memory.text, source: memory.source };
    });
  }
  return normalizeResidentProfile({ schema: binding.avatar ? RESIDENT_AVATAR_PROFILE_SCHEMA : RESIDENT_PROFILE_SCHEMA,
    ...(binding.avatar ? { avatar: binding.avatar } : {}), sourceAgentId: head.agentId,
    name: head.identity.name, instructions: head.identity.instructions, goals: head.goals,
    appearancePrompt: binding.appearancePrompt ?? '', color: binding.color,
    ...(binding.face ? { face: normalizeAgentFace(binding.face) } : {}), ...(shared ? { memories: shared } : {}) },
  { worldId, includePrivate: binding.shareMemories === true && binding.sharePrivateMemories === true });
}

/** Old clone peers receive their original schema without a mesh reference. */
export function legacyResidentProfile(input) {
  const { avatar, ...profile } = input;
  return { ...profile, schema: RESIDENT_PROFILE_SCHEMA };
}
