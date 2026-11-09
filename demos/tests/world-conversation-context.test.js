import test from 'node:test';
import assert from 'node:assert/strict';
import { worldConversationContext, worldReplyPrompt, worldResidentName, WORLD_CONVERSATION_CONTEXT_BYTES } from '../shared/agents/WorldConversationContext.js';

const self = { agentId: 'ada', ownerPeerId: 'owner', name: 'Ada', position: [12, 3, -4], status: 'idle', local: true, shared: true };
const message = (id, extra = {}) => ({ id, peerId: 'visitor', name: 'Visitor', text: `Message ${id}`, ...extra });
const build = extra => worldConversationContext({ world: 'CubeChat', self, incoming: message('latest'), ...extra });

test('public context grounds self and speaker while omitting private resident and message properties', () => {
  const incoming = message('latest', { agentId: 'bert', privateHistory: 'private message' });
  const parsed = JSON.parse(build({ incoming, scene: { theme: 'tron', nearbyPlayers: 2 }, residents: [
    { ...self, caption: 'Private reply', appearancePrompt: 'Private appearance' },
    { ...self, agentId: 'secret', shared: false, name: 'Hidden resident' },
    { ...self, agentId: 'bert', ownerPeerId: 'visitor', name: 'Bert', local: false, goals: ['Private goal'], memories: 'private memory' }
  ], messages: [message('old'), incoming] }));
  assert.deepEqual(parsed.self, { agentId: 'ada', ownerPeerId: 'owner', name: 'Ada', position: [12, 3, -4], status: 'idle' });
  assert.deepEqual(parsed.scene, { theme: 'tron', nearbyPlayers: 2 });
  assert.deepEqual(parsed.residents.map(body => body.name), ['Bert']);
  assert.equal(parsed.messages.at(-1).agentId, 'bert');
  assert.equal(/private|Hidden|caption|appearancePrompt|goals|memories/i.test(JSON.stringify(parsed)), false);
});

test('multibyte bounded context retains triggering and most recent turns without changing their text', () => {
  const incoming = message('trigger', { text: '😀'.repeat(512), agentId: 'bert' });
  const latest = message('latest', { text: '界'.repeat(682) });
  const text = build({ incoming, messages: [incoming, ...Array.from({ length: 14 }, (_, i) => message(`old${i}`, { text: 'é'.repeat(1024) })), latest],
    scene: { theme: 'tron', details: ['雪'.repeat(600), '🌍'.repeat(450), '木'.repeat(600)] },
    residents: Array.from({ length: 48 }, (_, i) => ({ ...self, agentId: `resident${i}`, name: '人'.repeat(80), ownerPeerId: `peer${i}` })) });
  const parsed = JSON.parse(text);
  assert(Buffer.byteLength(text) <= WORLD_CONVERSATION_CONTEXT_BYTES);
  assert.deepEqual(parsed.messages.find(item => item.id === 'trigger'), incoming);
  assert.deepEqual(parsed.messages.at(-1), latest);
  assert(parsed.omitted.messages > 0); assert(parsed.omitted.residents > 0); assert(parsed.omitted.sceneFields > 0);
  assert.equal(parsed.scene.theme, 'tron');
  assert.equal(text.includes('\ufffd'), false);
});

test('current incoming message is retained when absent from the bounded transcript and speaker roster has priority', () => {
  const incoming = message('now', { agentId: 'bert', peerId: 'speaker' });
  const parsed = JSON.parse(build({ incoming, messages: [message('old')], residents: [
    { ...self, agentId: 'other' }, { ...self, agentId: 'bert', ownerPeerId: 'speaker', local: false }
  ] }));
  assert.deepEqual(parsed.messages.at(-1), incoming);
  assert.equal(parsed.residents[0].agentId, 'bert');
});

test('scene objects and impossible current-message budgets reject before inference rather than dropping the current question', () => {
  assert.throws(() => build({ scene: new Map() }), /plain/);
  assert.throws(() => build({ scene: { secretFunction() {} } }), /plain/);
  assert.throws(() => build({ incoming: message('control', { text: '\u0001'.repeat(2048) }) }), /budget/);
});

test('public reply prompt identifies the resident and current human or resident speaker', () => {
  const human = worldReplyPrompt({ world: 'CubeChat', self, incoming: message('now') });
  const resident = worldReplyPrompt({ world: 'CubeChat', self, incoming: message('now', { agentId: 'bert', name: 'Bert' }) });
  assert.match(human, /You are "Ada"/); assert.match(human, /human player "Visitor"/);
  assert.match(resident, /from resident "Bert"/); assert.match(resident, /new contribution/);
  assert.match(resident, /Message:\nMessage now$/);
});

test('verified resident display names fit the room UTF-8 limit without split characters', () => {
  assert.equal(worldResidentName('😀'.repeat(60)), '😀'.repeat(20));
  assert.equal(worldResidentName('  Bert  '), 'Bert');
});
