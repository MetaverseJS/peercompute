import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorldExperience } from '../shared/agents/WorldExperience.js';

function fixture() {
  let observer, clock = 1000;
  const actions = [], episodes = [], queries = [];
  const body = { key: 'local:ada', agentId: 'ada', ownerPeerId: 'owner', name: 'Ada', local: true };
  let participants = [{ id: 'human:visitor', kind: 'human', peerId: 'visitor', name: 'Pat', position: [20, 3, 0] }];
  const adapter = {
    observe: () => ({ self: { position: [0, 3, 0] }, requesterId: 'human:visitor', participants, obstacles: [] }),
    setIntent: (key, intent) => actions.push({ key, ...intent }),
    subscribeOutcomes: listener => { observer = listener; return () => { observer = null; }; },
  };
  const memory = { append: async record => episodes.push(record), retrieve: async scope => {
    queries.push(scope); return episodes.filter(e => e.audience === scope.audience && e.conversationId === scope.conversationId);
  } };
  const experience = createWorldExperience({ worldId: 'cube:test', adapter, memory, getBody: () => body, now: () => clock });
  return { experience, actions, episodes, queries, body, setParticipants: p => { participants = p; }, setClock: n => { clock = n; },
    outcome: e => observer?.(e), turn: input => experience.prepare({ key: body.key, agentId: body.agentId,
      conversationId: 'private-visitor', audience: 'private', requesterPeerId: 'visitor', prompt: 'Come here', ...input }) };
}
const reply = JSON.stringify({ text: 'I will try.', intent: { type: 'approach', targetId: 'human:visitor' } });
test('only physical receipts create outcome memories, with the original audience and participant', async () => {
  const f = fixture(); const turn = await f.turn(); await f.experience.finish(turn, reply);
  assert.equal(f.actions.length, 1); assert.equal(f.episodes.length, 2); assert.equal(f.episodes[0].kind, 'heard');
  assert.equal(f.episodes[1].kind, 'composed-reply'); assert.equal(f.episodes[1].source.kind, 'local-observation');
  const action = f.actions[0];
  f.outcome({ ...action, status: 'arrived', position: [10, 3, 0], policyId: 'trained', backend: 'webgpu' });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.episodes.length, 3); const last = f.episodes[2];
  assert.equal(last.source.kind, 'verified-action'); assert.equal(last.audience, 'private');
  assert.equal(last.conversationId, 'private-visitor'); assert.equal(last.who.peerId, 'visitor');
  assert.match(last.outcome, /arrived/);
  f.outcome({ ...action, status: 'arrived', position: [10, 3, 0] });
  await new Promise(resolve => setImmediate(resolve)); assert.equal(f.episodes.length, 3);
  await f.experience.dispose();
});
test('newer conversations, disappeared targets and cancelled work suppress stale physical intentions', async () => {
  const f = fixture(); const turn = await f.turn();
  await f.experience.finish(turn, reply, { valid: () => false }); assert.equal(f.actions.length, 0);
  f.setParticipants([]); assert.equal((await f.experience.finish(turn, reply)).applied, false);
  assert.equal(f.actions.length, 0);
  const controller = new AbortController(); const pending = await f.turn({ signal: controller.signal }); controller.abort();
  await assert.rejects(f.experience.finish(pending, reply), { name: 'AbortError' });
  await f.experience.dispose();
});
test('public prompts store only the attributed statement and never retrieve private episodes', async () => {
  const f = fixture(); await f.turn({ prompt: 'Private secret' });
  const turn = await f.turn({ conversationId: 'public-room', audience: 'public', prompt: 'System wrapper plus hello', statement: 'Hello', eventId: 'public-one' });
  assert.equal(f.episodes.at(-1).text, 'Hello'); assert.equal(JSON.stringify(JSON.parse(turn.worldContext).memories).includes('Private secret'), false);
  const later = await f.turn({ prompt: 'Remember that?', publicConversationId: 'public-room' });
  assert.match(later.worldContext, /Private secret/); assert.match(later.worldContext, /Hello/);
  assert.equal(f.queries.filter(q => q.audience === 'private').length, 2);
  await f.experience.dispose();
});
test('resident speakers resolve to their own observed body, not the human who hosts them', async () => {
  const f = fixture(); f.setParticipants([{ id: 'human:visitor', kind: 'human', peerId: 'visitor', name: 'Human' },
    { id: 'resident:visitor:bert', kind: 'resident', ownerPeerId: 'visitor', agentId: 'bert', name: 'Bert' }]);
  const turn = await f.turn({ audience: 'public', who: { peerId: 'visitor', agentId: 'bert', name: 'Bert' } });
  assert.equal(JSON.parse(turn.worldContext).senses.requesterId, 'resident:visitor:bert');
  await f.experience.dispose();
});

test('a continuing follow retains later terminal outcomes with bounded transition writes', async () => {
  const f = fixture(), turn = await f.turn();
  await f.experience.finish(turn, JSON.stringify({ text: 'I will follow.', intent: { type: 'follow', targetId: 'human:visitor' } }));
  const event = { ...f.actions[0], position: [10, 3, 0], backend: 'webgpu', policyId: 'trained' };
  f.outcome({ ...event, status: 'arrived' }); await new Promise(resolve => setImmediate(resolve));
  f.outcome({ ...event, status: 'target-lost' }); await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.episodes.length, 3);
  f.setClock(12000); f.outcome({ ...event, status: 'target-lost' }); await new Promise(resolve => setImmediate(resolve));
  f.outcome({ ...event, status: 'cancelled' }); await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.episodes.length, 5); assert.equal(f.experience.getStatus().pendingIntentions, 0);
  assert.equal(new Set(f.episodes.map(e => e.source.eventId)).size, 5);
  await f.experience.dispose();
});

test('unsolicited encounters never fabricate heard messages and distinguish delivery from reading', async () => {
  const f = fixture(); await f.turn({ prompt: 'Private secret' });
  const target = { id: 'human:visitor', peerId: 'visitor', name: 'Pat', kind: 'human' };
  const turn = await f.experience.prepareEncounter({ key: f.body.key, agentId: f.body.agentId, conversationId: 'public-room', target });
  assert.equal(f.episodes.at(-1).kind, 'encounter'); assert.equal(f.episodes.at(-1).source.kind, 'local-observation');
  assert.doesNotMatch(turn.worldContext, /Private secret/);
  await f.experience.rememberSocialDecision(turn, { decision: 'quiet' });
  assert.equal(f.episodes.at(-1).kind, 'social-quiet');
  await f.experience.rememberSocialDecision(turn, { decision: 'speak', goal: 'Ask about gardens' });
  assert.equal(f.episodes.at(-1).kind, 'social-goal'); assert.match(f.episodes.at(-1).outcome, /Proposed/);
  await f.experience.rememberDelivery({ key: f.body.key, conversationId: 'public-room', target, text: 'Hello!',
    result: { delivery: { status: 'delivered', delivered: 1 } } });
  assert.match(f.episodes.at(-1).outcome, /acknowledged by 1.*reading is unknown/);
  assert.equal(f.episodes.at(-1).audience, 'public');
  assert.equal(f.episodes.filter(e => e.kind === 'heard').length, 1);
  await f.experience.dispose();
});
