import { normalizeResidentAvatar } from './ResidentAvatar.js';
const utf8 = new TextEncoder();
export const WORLD_AGENT_LIMITS = Object.freeze({ bindings: 8, agents: 16, promptBytes: 16 * 1024, replyBytes: 64 * 1024 });

// Public thumbnails contain pixels, never a remote URL or private attachment ID.
export function normalizeAgentFace(value) {
  if (!value || !/^[a-f0-9]{64}$/.test(value.sha256 ?? '')
      || !Number.isInteger(value.width) || !Number.isInteger(value.height)
      || value.width < 1 || value.height < 1 || value.width > 256 || value.height > 256
      || value.channels !== 4) throw new Error('Invalid agent face');
  return { sha256: value.sha256, width: value.width, height: value.height, channels: 4 };
}

export function worldAgentText(value, maximum, label) {
  if (typeof value !== 'string' || !value.trim() || /[\u0000-\u001f]/.test(value)
      || utf8.encode(value).length > maximum) throw new Error(`Invalid world agent ${label}`);
  return value;
}

export function normalizeWorldPosition(value) {
  if (!Array.isArray(value) || value.length !== 3 || value.some((n) => !Number.isFinite(n) || Math.abs(n) > 1e8)) {
    throw new Error('World position must contain three bounded coordinates');
  }
  return [...value];
}

/** Local automation preferences; never included in a public body or clone. */
export function normalizeStandingSocialGoal(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || Object.keys(value).some(key => !['id', 'enabled', 'objective', 'target'].includes(key))
      || !/^[A-Za-z0-9._:-]{1,80}$/.test(value.id ?? '') || typeof value.enabled !== 'boolean'
      || !['owner', 'new-players'].includes(value.target)
      || typeof value.objective !== 'string' || value.objective.includes('\0')
      || utf8.encode(value.objective).length > 2048 || (value.enabled && !value.objective.trim())) {
    throw new TypeError('Invalid standing social goal');
  }
  return { id: value.id, enabled: value.enabled, objective: value.objective.trim(), target: value.target };
}

export function normalizeAgentEmbodiments(input) {
  if (!Array.isArray(input) || input.length > WORLD_AGENT_LIMITS.bindings) throw new Error('Too many agent world bindings');
  const worlds = new Set();
  return input.map((binding) => {
    const worldId = worldAgentText(binding?.worldId, 240, 'world');
    if (worlds.has(worldId)) throw new Error('Duplicate agent world binding');
    worlds.add(worldId);
    if (!/^#[a-f0-9]{6}$/i.test(binding.color ?? '') || typeof binding.shared !== 'boolean') throw new Error('Invalid agent body settings');
    if (binding.respondToWorldChat !== undefined && typeof binding.respondToWorldChat !== 'boolean') throw new Error('Invalid world chat preference');
    if (binding.initiateConversations !== undefined && typeof binding.initiateConversations !== 'boolean') throw new Error('Invalid conversation initiative preference');
    if (binding.autonomous !== undefined && typeof binding.autonomous !== 'boolean') throw new Error('Invalid autonomous reflection preference');
    if (binding.selfModifiable !== undefined && typeof binding.selfModifiable !== 'boolean') throw new Error('Invalid self-modification preference');
    if (binding.allowCloning !== undefined && typeof binding.allowCloning !== 'boolean') throw new Error('Invalid resident cloning preference');
    if (binding.shareMemories !== undefined && typeof binding.shareMemories !== 'boolean') throw new Error('Invalid resident memory-sharing preference');
    if (binding.sharePrivateMemories !== undefined && typeof binding.sharePrivateMemories !== 'boolean') throw new Error('Invalid resident private-memory-sharing preference');
    if (binding.movement !== undefined && !['stationary', 'follow', 'roam'].includes(binding.movement)) throw new Error('Invalid resident movement preference');
    const result = { worldId, position: normalizeWorldPosition(binding.position), color: binding.color, shared: binding.shared,
      respondToWorldChat: binding.respondToWorldChat ?? false, initiateConversations: binding.initiateConversations ?? false,
      allowCloning: binding.allowCloning ?? false, shareMemories: binding.shareMemories ?? false,
      sharePrivateMemories: binding.sharePrivateMemories ?? false,
      ...(binding.movement === undefined ? {} : { movement: binding.movement }) };
    if (binding.standingGoal !== undefined) result.standingGoal = normalizeStandingSocialGoal(binding.standingGoal);
    if (binding.selfModifiable !== undefined) result.selfModifiable = binding.selfModifiable;
    if (binding.autonomous !== undefined) result.autonomous = binding.autonomous;
    if (binding.appearancePrompt !== undefined) {
      if (typeof binding.appearancePrompt !== 'string' || binding.appearancePrompt.includes('\0')
          || utf8.encode(binding.appearancePrompt).length > 2048) throw new Error('Invalid appearance prompt');
      result.appearancePrompt = binding.appearancePrompt.trim();
    }
    if (binding.appearanceRequestId !== undefined) result.appearanceRequestId = worldAgentText(binding.appearanceRequestId, 128, 'appearance request');
    if (binding.face !== undefined) {
      const attachmentId = worldAgentText(binding.face?.attachmentId, 128, 'face attachment');
      if (!/^[A-Za-z0-9._:-]+$/.test(attachmentId)) throw new Error('Invalid face attachment');
      result.face = { ...normalizeAgentFace(binding.face), attachmentId };
    }
    if (binding.avatar !== undefined) result.avatar = normalizeResidentAvatar(binding.avatar);
    return result;
  });
}

// Only this bounded public body crosses the world directory. Identity prompts,
// goals, memory, conversation history and local host authority never do.
export function normalizePublicAgent(value) {
  const agentId = worldAgentText(value?.agentId, 128, 'ID');
  if (!/^[A-Za-z0-9._:-]+$/.test(agentId)) throw new Error('Invalid public agent ID');
  const name = worldAgentText(value.name, 240, 'name');
  if (!/^#[a-f0-9]{6}$/i.test(value.color ?? '') || !['idle', 'thinking', 'speaking', 'paused'].includes(value.status)) {
    throw new Error('Invalid public agent body');
  }
  if (value.cloneable !== undefined && typeof value.cloneable !== 'boolean') throw new Error('Invalid public clone permission');
  if (value.sharesMemories !== undefined && typeof value.sharesMemories !== 'boolean') throw new Error('Invalid public memory-sharing permission');
  if (value.sharesPrivateMemories !== undefined && typeof value.sharesPrivateMemories !== 'boolean') throw new Error('Invalid public private-memory-sharing permission');
  return { agentId, name, color: value.color, position: normalizeWorldPosition(value.position), status: value.status,
    ...(value.cloneable === undefined ? {} : { cloneable: value.cloneable }),
    ...(value.sharesMemories === undefined ? {} : { sharesMemories: value.sharesMemories }),
    ...(value.sharesPrivateMemories === undefined ? {} : { sharesPrivateMemories:
      value.cloneable === true && value.sharesMemories === true && value.sharesPrivateMemories }),
    ...(value.avatar ? { avatar: normalizeResidentAvatar(value.avatar) } : {}),
    ...(value.face ? { face: normalizeAgentFace(value.face) } : {}) };
}
