const utf8 = new TextEncoder();
export const WORLD_AGENT_LIMITS = Object.freeze({ bindings: 8, agents: 16, promptBytes: 16 * 1024, replyBytes: 64 * 1024 });

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

export function normalizeAgentEmbodiments(input) {
  if (!Array.isArray(input) || input.length > WORLD_AGENT_LIMITS.bindings) throw new Error('Too many agent world bindings');
  const worlds = new Set();
  return input.map((binding) => {
    const worldId = worldAgentText(binding?.worldId, 240, 'world');
    if (worlds.has(worldId)) throw new Error('Duplicate agent world binding');
    worlds.add(worldId);
    if (!/^#[a-f0-9]{6}$/i.test(binding.color ?? '') || typeof binding.shared !== 'boolean') throw new Error('Invalid agent body settings');
    return { worldId, position: normalizeWorldPosition(binding.position), color: binding.color, shared: binding.shared };
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
  return { agentId, name, color: value.color, position: normalizeWorldPosition(value.position), status: value.status };
}
