export const ROOM_CHAT_PROTOCOL = '/peercompute/room-chat/2.0.0';
export const ROOM_CHAT_PROTOCOL_V1 = '/peercompute/room-chat/1.0.0';
export const ROOM_SOCIAL_LIMITS = Object.freeze({ lifetimeMs: 60000, futureSkewMs: 5000, turns: 4, roots: 128 });
export const ROOM_CHAT_LIMITS = Object.freeze({ textBytes: 2048, nameBytes: 80, maximumPeers: 32,
  maximumSends: 2, maximumInbound: 16, perPeerInbound: 2, fanout: 4, requestMs: 5000,
  sendMs: 20000, rateWindowMs: 10000, rateMessages: 8, replayMs: 300000, replayEntries: 1024 });
const encoder = new TextEncoder(), decoder = new TextDecoder('utf-8', { fatal: true });
export const chatError = (message, code = 'ERR_ROOM_CHAT') => Object.assign(new Error(message), { code });
export function chatText(value, limit, label) {
  if (typeof value !== 'string' || !value.trim() || value.includes('\0')
      || encoder.encode(value).length > limit || decoder.decode(encoder.encode(value)) !== value) {
    throw chatError(`${label} must contain valid text within ${limit} UTF-8 bytes`, 'ERR_ROOM_CHAT_INPUT');
  }
  return value;
}
export function chatFields(value, allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || Object.keys(value).some((key) => !allowed.includes(key))) throw chatError('Unexpected room chat fields');
}
export function normalizeChatInput(input) {
  chatFields(input, ['text', 'name', 'agentId', 'social']);
  if (input.social !== undefined && input.agentId === undefined) throw chatError('Only a resident can send a social greeting');
  return { text: chatText(input.text, ROOM_CHAT_LIMITS.textBytes, 'Message'),
    name: chatText(input.name ?? 'Guest', ROOM_CHAT_LIMITS.nameBytes, 'Display name'),
    ...(input.agentId === undefined ? {} : { agentId: chatIdentifier(input.agentId) }),
    ...(input.social === undefined ? {} : { social: normalizeSocialChat(input.social) }) };
}
export function normalizeSocialChat(value) {
  chatFields(value, ['rootId', 'rootPeerId', 'rootAgentId', 'targetPeerId', 'targetAgentId', 'startedAt', 'expiresAt', 'turn']);
  const result = { rootId: chatIdentifier(value.rootId), rootPeerId: chatIdentifier(value.rootPeerId),
    rootAgentId: chatIdentifier(value.rootAgentId), targetPeerId: chatIdentifier(value.targetPeerId),
    ...(value.targetAgentId === undefined ? {} : { targetAgentId: chatIdentifier(value.targetAgentId) }),
    startedAt: value.startedAt, expiresAt: value.expiresAt, turn: value.turn };
  if (![result.startedAt, result.expiresAt, result.turn].every(Number.isSafeInteger)
      || result.startedAt < 0 || result.expiresAt <= result.startedAt
      || result.expiresAt - result.startedAt > ROOM_SOCIAL_LIMITS.lifetimeMs
      || result.turn < 0 || result.turn >= ROOM_SOCIAL_LIMITS.turns
      || (result.targetAgentId === undefined && result.turn !== 0)
      || (result.rootPeerId === result.targetPeerId && result.rootAgentId === result.targetAgentId)) {
    throw chatError('Invalid social conversation bounds', 'ERR_ROOM_CHAT_SOCIAL');
  }
  return Object.freeze(result);
}
export function validateSocialAuthor(message, peerId, wallNow = Date.now()) {
  const value = message.social;
  if (!value) return;
  const root = value.turn % 2 === 0;
  if (message.agentId !== (root ? value.rootAgentId : value.targetAgentId)
      || peerId !== (root ? value.rootPeerId : value.targetPeerId)
      || value.startedAt > wallNow + ROOM_SOCIAL_LIMITS.futureSkewMs || value.expiresAt <= wallNow) {
    throw chatError('Social conversation author or deadline mismatch', 'ERR_ROOM_CHAT_SOCIAL');
  }
}
export function chatScope(config) {
  return Object.fromEntries(['gameId', 'roomId', 'topologyId'].map((key) => [key, chatText(config?.[key], 240, key)]));
}
export function chatIdentifier(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(value)) throw chatError('Invalid room chat identifier');
  return value;
}
export function deliveryStatus(id, recipients, { sending = false, cancelled = false } = {}) {
  const delivered = recipients.filter((entry) => entry.status === 'acknowledged').length, total = recipients.length;
  return { id, status: sending ? 'sending' : !total ? 'local-only' : delivered === total ? 'delivered' : delivered ? 'partial' : 'failed',
    delivered, total, cancelled, recipients: recipients.map((entry) => ({ ...entry })) };
}
