import { boundedSceneContext } from './DemoAgent.js';
import { chatIdentifier, chatText, normalizeChatInput, ROOM_CHAT_LIMITS } from '../chat/roomChatContracts.js';

export const WORLD_CONVERSATION_CONTEXT_BYTES = 8192;
const encoder = new TextEncoder();
const size = value => encoder.encode(JSON.stringify(value)).length;
const sameMessage = (a, b) => a.id === b.id && a.peerId === b.peerId;

export function worldResidentName(value) {
  let result = '';
  for (const character of chatText(value, 240, 'Resident name').trim()) {
    if (encoder.encode(result + character).length > ROOM_CHAT_LIMITS.nameBytes) break;
    result += character;
  }
  return result;
}

export function worldPublicMessage(value) {
  return { id: chatIdentifier(value.id), peerId: chatText(value.peerId, 160, 'Peer identity'),
    ...normalizeChatInput({ name: value.name, text: value.text,
      ...(value.agentId === undefined ? {} : { agentId: value.agentId }) }) };
}

function publicBody(value) {
  const position = value.position;
  if (!Array.isArray(position) || position.length !== 3 || !position.every(Number.isFinite)) {
    throw new Error('Public world context requires a current body position');
  }
  return { agentId: chatText(value.agentId, 128, 'Resident identity'),
    ownerPeerId: chatText(value.ownerPeerId, 160, 'Resident owner'),
    name: chatText(value.name, 240, 'Resident name'), position: [...position],
    status: chatText(value.status, 32, 'Resident status') };
}

/** Public observations only: never serialize a resident record or private chat.
 * Malformed or oversized adapter data rejects before a persisted inference turn. */
export function worldConversationContext({ world, self, scene = {}, residents = [], messages = [], incoming }) {
  const current = worldPublicMessage(incoming);
  const recent = messages.slice(-16).map(worldPublicMessage);
  if (!recent.some(message => sameMessage(message, current))) recent.push(current);
  const ownBody = publicBody(self);
  const roster = residents.filter(body => body.agentId !== self.agentId || body.ownerPeerId !== self.ownerPeerId)
    .filter(body => !body.local || body.shared === true).slice(0, 48).map(publicBody);
  // Keep the person being answered ahead of other bodies when the room is busy.
  roster.sort((a, b) => Number(b.agentId === current.agentId && b.ownerPeerId === current.peerId)
    - Number(a.agentId === current.agentId && a.ownerPeerId === current.peerId));
  const observations = { kind: 'public-room-chat', world: chatText(world, 240, 'World name'),
    self: ownBody, scene: JSON.parse(boundedSceneContext(scene)), residents: roster, messages: recent };
  const omitted = {};
  const oversized = () => size(observations) > WORLD_CONVERSATION_CONTEXT_BYTES;
  const mark = key => { omitted[key] = (omitted[key] ?? 0) + 1; observations.omitted = omitted; };

  // Retain the triggering message and the newest event, even when a resident
  // was queued while somebody else spoke. Older public turns are expendable.
  while (oversized()) {
    const index = recent.findIndex((message, index) => index < recent.length - 1 && !sameMessage(message, current));
    if (index < 0) break;
    recent.splice(index, 1); mark('messages');
  }
  while (oversized() && roster.length) { roster.pop(); mark('residents'); }
  // Scene adapters provide bounded plain data. Preserve small scene properties
  // (theme, player count) before larger optional observations if space is tight.
  if (observations.scene && typeof observations.scene === 'object' && !Array.isArray(observations.scene)) {
    for (const key of Object.keys(observations.scene).sort((a, b) => size(observations.scene[b]) - size(observations.scene[a]))) {
      if (!oversized()) break;
      delete observations.scene[key]; mark('sceneFields');
    }
  }
  if (oversized()) throw new Error('Current public world messages exceed the conversation budget');
  return JSON.stringify(observations);
}

export function worldReplyPrompt({ world, self, incoming }) {
  const speaker = incoming.agentId === undefined ? 'human player' : 'resident';
  return `You are ${JSON.stringify(self.name)}, a resident in ${JSON.stringify(world)}. Speak only as yourself.\n`
    + `Reply briefly to this public world-chat message from ${speaker} ${JSON.stringify(incoming.name)}. `
    + 'Your response will be visible to everyone in this room.\n'
    + 'Use the current observations and recent conversation to add a relevant new contribution. '
    + 'Avoid repeating introductions, greetings, or your previous answer. Do not claim actions you have not performed.\n'
    + `Message:\n${incoming.text}`;
}
