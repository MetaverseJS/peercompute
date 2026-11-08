export const ROOM_CHAT_PROTOCOL = '/peercompute/room-chat/1.0.0';
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
  chatFields(input, ['text', 'name']);
  return { text: chatText(input.text, ROOM_CHAT_LIMITS.textBytes, 'Message'),
    name: chatText(input.name ?? 'Guest', ROOM_CHAT_LIMITS.nameBytes, 'Display name') };
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
