import test from 'node:test';
import assert from 'node:assert/strict';
import { compactWorldContext, createWorldExperience, WORLD_PROMPT_CONTEXT_BYTES } from '../shared/agents/WorldExperience.js';
import { WORLD_INTENT_INSTRUCTIONS, WORLD_INTENT_LEGACY_SUFFIX } from '../shared/agents/WorldIntent.js';
import { CubeAgentLayer } from '../cubechat/src/agents/CubeAgentLayer.js';

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
  return { experience, adapter, actions, episodes, queries, body, setParticipants: p => { participants = p; }, setClock: n => { clock = n; },
    outcome: e => observer?.(e), turn: input => experience.prepare({ key: body.key, agentId: body.agentId,
      conversationId: 'private-visitor', audience: 'private', requesterPeerId: 'visitor', prompt: 'Come here', ...input }) };
}
const reply = JSON.stringify({ text: 'I will try.', intent: { type: 'approach', targetId: 'human:visitor' } });
test('fixed tasks revalidate local geometry and publish only exact destination and actual arrival receipts', async () => {
  const f = fixture(), originalObserve = f.adapter.observe, target = [96, 12.6, 0], origin = [0, 3, 0], receipts = [];
  f.adapter.observe = () => ({ ...originalObserve(), spatial: { frame: 'planar-xz', bounds: { min: [-120, -120], max: [120, 120] }, maximumLegDistance: 160 },
    locations: [] });
  let blocked = false;
  f.adapter.validateSpatialTarget = (_key, position) => { if (blocked) throw new Error('Destination now occupied'); return [...position]; };
  f.experience.subscribeVerifiedOutcomes(receipt => receipts.push(receipt));
  const turn = await f.turn();
  await assert.rejects(f.experience.applyIntent(turn, { type: 'move-to', position: target }), /not observed or authorized/);
  blocked = true;
  await assert.rejects(f.experience.applyIntent(turn, { type: 'move-to', position: target }, { authorizedPositions: [target] }), /occupied/);
  assert.equal(f.actions.length, 0);
  blocked = false;
  await f.experience.applyIntent(turn, { type: 'move-to', position: target }, { requestId: 'point-task', authorizedPositions: [target] });
  const action = f.actions.at(-1);
  for (const invalid of [
    { targetPosition: origin, position: target },
    { targetPosition: target, position: [80, 3, 0] },
    { targetPosition: target, position: [90, , 0] },
    { targetPosition: target, position: [90, 3, 0], targetId: 'injected' },
  ]) f.outcome({ ...action, status: 'arrived', ...invalid });
  await new Promise(resolve => setImmediate(resolve)); assert.equal(receipts.length, 0);
  f.outcome({ ...action, status: 'arrived', targetPosition: target, position: [89, 500, 0] });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(receipts.length, 1); assert.deepEqual(receipts[0].targetPosition, target);
  assert.deepEqual(receipts[0].position, [89, 500, 0], 'planar arrival does not pretend decorative terrain height is physics');
  assert.match(f.episodes.at(-1).text, /destination/);
  await f.experience.dispose();
});
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
test('plain conversational speech is retained literally without parsing JSON into an intention', async () => {
  const f = fixture(), turn = await f.turn();
  assert.equal(await f.experience.rememberReply(turn, reply), true);
  assert.equal(f.episodes.at(-1).text, reply); assert.equal(f.episodes.at(-1).kind, 'composed-reply');
  assert.deepEqual(f.actions, []);
  assert.equal(await f.experience.rememberReply(turn, 'Stale reply', { valid: () => false }), false);
  assert.equal(f.episodes.length, 2);
  await f.experience.dispose();
});

test('only full same-scope self-authored local speech becomes a history dedup candidate', async () => {
  const full = 'A detailed remembered scene. '.repeat(20);
  for (const [label, patch, eligible] of [
    ['same scope', {}, true], ['different world', { worldId: 'cube:other' }, false],
    ['different agent', { agentId: 'other' }, false],
    ['another author', { who: { agentId: 'other', peerId: 'owner' } }, false],
    ['another host', { who: { agentId: 'ada', peerId: 'other-host' } }, false],
    ['shared report', { source: { kind: 'shared-memory', sourceAgentId: 'ancestor' } }, false],
    ['heard statement', { kind: 'heard' }, false],
    ['physical receipt', { kind: 'action-outcome', source: { kind: 'verified-action' } }, false],
    ['oversized old text', { text: 'x'.repeat(2049) }, false],
    ['invalid old text', { text: 'legacy\0text' }, false],
  ]) {
    const f = fixture(), episode = { agentId: 'ada', worldId: 'cube:test', audience: 'private',
      conversationId: 'private-visitor', kind: 'composed-reply', who: { agentId: 'ada', peerId: 'owner' },
      where: [0, 3, 0], when: 900, outcome: 'Generated speech', text: full, source: { kind: 'local-observation' }, ...patch };
    f.episodes.push(episode); const original = structuredClone(episode);
    const turn = await f.turn(), context = JSON.parse(turn.worldContext);
    assert.equal(!!turn.contextHistory, eligible, label);
    if (eligible) {
      assert.equal(turn.contextHistory.entries[0].text, full);
      assert.equal(turn.contextHistory.entries[0].index, 0);
      assert(context.memories[0].excerpted); assert(context.memories[0].text.length < full.length);
    }
    assert.deepEqual(f.episodes[0], original); await f.experience.dispose();
  }
  const f = fixture();
  f.episodes.push({ agentId: 'ada', worldId: 'cube:test', audience: 'public', conversationId: 'room', kind: 'composed-reply',
    who: { agentId: 'ada', peerId: 'owner' }, text: full, source: { kind: 'local-observation' } });
  const turn = await f.turn({ publicConversationId: 'room' });
  assert.equal(turn.contextHistory, undefined, 'Public speech recalled in private is not the same conversation');
  assert.equal(JSON.parse(turn.worldContext).memories.length, 1); await f.experience.dispose();
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

test('public scene excludes only the current event while full speech and earlier same-text evidence remain', async () => {
  const f = fixture(), statement = 'Hello again, what have you seen?', prompt = `Pat says: ${statement}`;
  const scene = { kind: 'public-room-chat', messages: [
    { id: 'older', peerId: 'visitor', name: 'Pat', text: statement },
    { id: 'current', peerId: 'visitor', name: 'Pat', text: statement },
  ] }, original = structuredClone(scene);
  const turn = await f.turn({ audience: 'public', conversationId: 'public-room', scene,
    prompt, statement, eventId: 'current' });
  assert.deepEqual(JSON.parse(turn.worldContext).scene.messages, [scene.messages[0]]);
  assert.equal(turn.prompt, prompt);
  assert.equal(f.episodes.at(-1).text, statement);
  assert.equal(f.episodes.at(-1).source.eventId, 'current');
  assert.deepEqual(scene, original, 'Evidence is not mutated by prompt projection');
  const unrelated = await f.turn({ audience: 'public', scene, eventId: 'different' });
  assert.equal(JSON.parse(unrelated.worldContext).scene.messages.length, 2);
  const privateTurn = await f.turn({ scene, eventId: 'current' });
  assert.equal(JSON.parse(privateTurn.worldContext).scene.messages.length, 2);
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

test('prompt projection preserves exact target identity and provenance without altering raw evidence', () => {
  const senses = { observedAt: 1234, requesterId: 'human:authenticated-visitor',
    self: { id: 'resident:owner:ada', agentId: 'ada', ownerPeerId: 'owner', name: 'Ada', position: [0.123456789, 3, 0], intentRevision: 9,
      motion: { type: 'follow', targetId: 'human:authenticated-visitor', status: 'moving' } },
    participants: [{ id: 'human:authenticated-visitor', peerId: 'authenticated-visitor', kind: 'human', name: 'Pat',
      position: [19.987654321, 3, 0], relativePosition: [19.864197532, 0, 0], velocity: [0.000000001, 0, 0], distance: 19.864197532 }], obstacles: [] };
  const episodes = [{ kind: 'action-outcome', when: 1000, who: { peerId: 'authenticated-visitor', name: 'Pat' },
    where: [1.23456789, 3, 0], outcome: 'approach: blocked',
    text: 'Physical adapter reported blocked near Pat. Policy sha256:diagnostic-hash; backend webgpu. Target enclosed.',
    source: { kind: 'verified-action', eventId: 'full-receipt-id' } },
  { kind: 'heard', when: 900, text: 'I reached the target.', source: { kind: 'shared-memory', sourceAgentId: 'ancestor', peerId: 'other-host', eventId: 'clone-receipt' } }];
  const before = structuredClone({ senses, episodes });
  const context = compactWorldContext({ senses, memories: episodes });
  assert.equal(context.senses.requesterId, senses.requesterId); assert.equal(context.senses.self.id, senses.self.id);
  assert.equal(context.senses.participants[0].id, senses.participants[0].id);
  assert.deepEqual(context.senses.participants[0].position, [19.988, 3, 0]);
  assert.equal(context.senses.self.intentRevision, undefined);
  assert.deepEqual(context.senses.self.motion, senses.self.motion, 'Observed motion is retained separately from lifecycle status');
  assert.equal(context.memories[0].source.kind, 'verified-action'); assert.equal(context.memories[0].outcome, 'approach: blocked');
  assert.match(context.memories[0].text, /Target enclosed/); assert.doesNotMatch(JSON.stringify(context), /diagnostic-hash|full-receipt-id/);
  assert.deepEqual(context.memories[1].source, { kind: 'shared-memory', sourceAgentId: 'ancestor', peerId: 'other-host' });
  assert.deepEqual({ senses, episodes }, before);
});

test('new turns retain raw prompts and validated senses while reusing verified outcome memory', async () => {
  const f = fixture(), turn = await f.turn({ prompt: 'Come here' });
  assert.equal(turn.prompt, 'Come here'); assert.equal(turn.taskInstructions, WORLD_INTENT_INSTRUCTIONS);
  assert.equal(turn.legacyHistorySuffix, WORLD_INTENT_LEGACY_SUFFIX);
  await f.experience.finish(turn, reply);
  f.outcome({ ...f.actions[0], status: 'arrived', position: [10.123456789, 3, 0], policyId: 'trained-hash', backend: 'webgpu' });
  await new Promise(resolve => setImmediate(resolve));
  const next = await f.turn({ prompt: 'Follow me' }), context = JSON.parse(next.worldContext);
  assert.equal(next.prompt, 'Follow me');
  const outcome = context.memories.find(item => item.kind === 'action-outcome');
  assert.equal(outcome.source.kind, 'verified-action'); assert.equal(outcome.outcome, 'approach: arrived');
  assert.deepEqual(outcome.where, [10.123, 3, 0]);
  const saved = f.episodes.find(item => item.kind === 'action-outcome');
  assert.equal(saved.where[0], 10.123456789); assert.match(saved.text, /trained-hash/); assert(saved.source.eventId);
  assert.equal(f.episodes.filter(item => item.kind === 'heard').some(item => item.text.includes('response format')), false);
  await f.experience.dispose();
});

test('long recalled passages are bounded excerpts while durable memories and current prompts remain complete', async () => {
  const f = fixture(), original = 'A remembered detail about the garden. '.repeat(32);
  for (let i = 0; i < 6; i++) await f.turn({ prompt: `${i}: ${original}` });
  const before = structuredClone(f.episodes);
  const prompt = 'Please follow me, and remember our conversation.';
  const turn = await f.turn({ prompt }), context = JSON.parse(turn.worldContext);
  assert.equal(turn.prompt, prompt);
  assert(new TextEncoder().encode(turn.worldContext).length <= WORLD_PROMPT_CONTEXT_BYTES);
  assert(context.memories.length > 0 && context.memories.length < 6);
  assert(context.memories.every(memory => memory.excerpted && new TextEncoder().encode(memory.text).length <= 240));
  assert(context.omitted.memories > 0);
  assert.deepEqual(f.episodes.slice(0, before.length), before);
  assert.equal(f.episodes[0].text, `0: ${original}`);
  assert.equal(context.senses.requesterId, 'human:visitor');
  await f.experience.dispose();
});

test('crowded prompt context keeps the current requester and explicit omissions without mutating sensing evidence', () => {
  const participants = Array.from({ length: 24 }, (_, i) => ({ id: `human:${i}-${'x'.repeat(60)}`,
    name: `Participant ${i}`, kind: 'human', position: [i, 3, i], relativePosition: [i, 0, i], velocity: [0, 0, 0], distance: i }));
  const senses = { self: { id: 'resident:owner:ada', position: [0, 3, 0] }, requesterId: participants.at(-1).id,
    participants, obstacles: Array.from({ length: 12 }, (_, i) => ({ position: [i, 0, i], radius: 3 })) };
  const scene = { kind: 'public-room-chat', world: 'CubeChat', residents: participants,
    messages: Array.from({ length: 10 }, (_, i) => ({ id: `message-${i}`, peerId: 'visitor', name: 'Pat', text: 'Long room message. '.repeat(80) })) };
  const before = structuredClone({ scene, senses });
  const context = compactWorldContext({ scene, senses });
  assert(new TextEncoder().encode(JSON.stringify(context)).length <= WORLD_PROMPT_CONTEXT_BYTES);
  assert.equal(context.senses.requesterId, senses.requesterId);
  assert(context.senses.participants.some(person => person.id === senses.requesterId));
  assert(context.omitted.participants > 0 && context.omitted.sceneDetail > 0);
  assert.equal(context.scene.kind, 'public-room-chat'); assert.equal(context.scene.world, 'CubeChat');
  assert(context.scene.messages.every(message => message.excerpted));
  assert.deepEqual({ scene, senses }, before);
});

test('ordinary public hello omits duplicated room bodies even below the byte ceiling', () => {
  const senses = { self: { id: 'resident:owner:mira', name: 'Mira', position: [-5, 3, 0] },
    requesterId: 'human:owner', participants: [{ id: 'human:owner', name: 'Pat', position: [0, 3, 0] },
      { id: 'resident:owner:nova', name: 'Nova', position: [5, 3, 0] }], obstacles: [] };
  const scene = { kind: 'public-room-chat', world: 'CubeChat', self: senses.self,
    residents: senses.participants, scene: { agent: senses.self, theme: 'tron' },
    messages: [{ id: 'hello', peerId: 'owner', name: 'Pat', text: 'Hello Mira and Nova.' }] };
  const before = structuredClone({ scene, senses });
  assert(new TextEncoder().encode(JSON.stringify(before)).length < WORLD_PROMPT_CONTEXT_BYTES);
  const context = compactWorldContext({ scene, senses });
  assert.equal(context.scene.self, undefined); assert.equal(context.scene.residents, undefined);
  assert.equal(context.scene.world, 'CubeChat'); assert.equal(context.scene.messages[0].text, 'Hello Mira and Nova.');
  assert.equal(context.senses.self.id, senses.self.id); assert.equal(context.senses.requesterId, 'human:owner');
  assert.deepEqual(context.senses.participants, senses.participants);
  assert.deepEqual({ scene, senses }, before, 'Projection does not delete saved messages or physical observations');
});

test('compaction keeps the actual CubeChat scene name and theme while retaining the exact current requester', () => {
  const body = { key: 'local:conan', name: 'Conan', position: [0, 3, 0], status: 'idle' };
  // Exercise the adapter's actual field names without creating a renderer or a body.
  const scene = CubeAgentLayer.prototype.getContext.call({ entries: new Map([[body.key, { descriptor: body }]]),
    scene: { worldThemeId: 'tron', players: new Map([['owner', {}]]) } }, body);
  const participants = Array.from({ length: 24 }, (_, index) => ({ id: `human:${index}-${'p'.repeat(60)}`,
    kind: 'human', name: `Player ${index}`, position: [index, 3, index], relativePosition: [index, 0, index],
    velocity: [0, 0, 0], distance: index }));
  const senses = { self: { id: 'resident:owner:conan', name: 'Conan', position: [0, 3, 0] },
    requesterId: participants.at(-1).id, participants, obstacles: [] };
  const before = structuredClone({ scene, senses });
  const context = compactWorldContext({ scene, senses });
  assert.equal(scene.demo, 'CubeChat'); assert.equal(scene.theme, 'tron');
  assert.equal(context.scene.demo, scene.demo); assert.equal(context.scene.theme, scene.theme);
  assert.equal(context.scene.agent, undefined); assert(context.omitted.sceneDetail > 0);
  assert(context.omitted.participants > 0);
  assert.equal(context.senses.self.id, senses.self.id); assert.equal(context.senses.requesterId, senses.requesterId);
  assert(context.senses.participants.some(person => person.id === senses.requesterId));
  assert(new TextEncoder().encode(JSON.stringify(context)).length <= WORLD_PROMPT_CONTEXT_BYTES);
  assert.deepEqual({ scene, senses }, before);
});

test('compacted scene labels have bounded Unicode excerpts and never displace fixed requester identity', () => {
  const scene = { kind: '界'.repeat(1000), world: '🌍'.repeat(1000), demo: 'CubeChat', theme: '🌌'.repeat(1000) };
  const senses = { self: { id: `resident:${'o'.repeat(128)}:${'a'.repeat(128)}`, position: [0, 3, 0] },
    requesterId: `human:${'p'.repeat(128)}`, participants: [{ id: `human:${'p'.repeat(128)}`,
      kind: 'human', name: 'Current requester', position: [10, 3, 0] }], obstacles: [] };
  const original = structuredClone({ scene, senses });
  const context = compactWorldContext({ scene, senses });
  assert.equal(context.scene.demo, 'CubeChat'); assert.equal(context.scene.excerpted, true);
  for (const key of ['kind', 'world', 'demo', 'theme']) {
    assert(new TextEncoder().encode(context.scene[key]).length <= 240);
    assert.equal(context.scene[key].isWellFormed(), true);
    assert(scene[key].startsWith(context.scene[key]));
  }
  assert.equal(context.senses.requesterId, senses.requesterId);
  assert.equal(context.senses.participants[0].id, senses.requesterId);
  assert(new TextEncoder().encode(JSON.stringify(context)).length <= WORLD_PROMPT_CONTEXT_BYTES);
  assert.deepEqual({ scene, senses }, original);

  // Exact sensing identities take precedence when even the bounded scene labels
  // cannot coexist with the fixed self/requester fields in the prompt budget.
  const crowded = structuredClone(senses);
  crowded.self.name = '界'.repeat(300); crowded.participants[0].name = '人'.repeat(300);
  const fixed = compactWorldContext({ scene, senses: crowded });
  assert.match(fixed.scene.note, /Scene omitted/);
  assert.equal(fixed.senses.self.id, crowded.self.id);
  assert.equal(fixed.senses.requesterId, crowded.requesterId);
  assert.equal(fixed.senses.participants[0].id, crowded.requesterId);
  assert(new TextEncoder().encode(JSON.stringify(fixed)).length <= WORLD_PROMPT_CONTEXT_BYTES);
  crowded.self.name = '界'.repeat(WORLD_PROMPT_CONTEXT_BYTES);
  assert.throws(() => compactWorldContext({ scene, senses: crowded }), /current participant observations exceed/);
});

test('checkpointed objective actions share validation and publish only matched physical receipts', async () => {
  const f = fixture(), receipts = [], turn = await f.turn();
  const unsubscribe = f.experience.subscribeVerifiedOutcomes(receipt => receipts.push(receipt));
  const intent = { type: 'approach', targetId: 'human:visitor' };
  await f.experience.applyIntent(turn, intent, { requestId: 'goal-action-1' });
  const action = f.actions.at(-1);
  f.outcome({ ...action, requestId: 'forged', status: 'arrived', position: [10, 3, 0] });
  f.outcome({ ...action, status: 'arrived', position: [NaN, 3, 0] });
  await new Promise(resolve => setImmediate(resolve)); assert.equal(receipts.length, 0);
  f.outcome({ ...action, status: 'arrived', position: [10, 3, 0] });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(receipts.length, 1); assert.equal(receipts[0].requestId, 'goal-action-1');
  assert.equal(receipts[0].agentId, 'ada');
  assert.equal(await f.experience.cancelIntent(turn.key, 'goal-action-1'), true);
  assert.equal(f.actions.at(-1).type, 'stop');
  assert.equal(await f.experience.cancelIntent(turn.key, 'goal-action-1'), false);
  unsubscribe(); await f.experience.dispose();
});

test('old goal cleanup cannot stop a newer chat or adapter-owned movement command', async () => {
  const f = fixture(), turn = await f.turn(), intent = { type: 'approach', targetId: 'human:visitor' };
  await f.experience.applyIntent(turn, intent, { requestId: 'goal-action-1' });
  await f.experience.applyIntent(turn, { type: 'look-at', targetId: 'human:visitor' }, { requestId: 'manual-action' });
  const count = f.actions.length;
  assert.equal(await f.experience.cancelIntent(turn.key, 'goal-action-1'), false); assert.equal(f.actions.length, count);
  // A scene-owned Stay here/roam command cancels the tracked intention outside
  // this bridge. That receipt relinquishes cleanup authority over newer motion.
  f.outcome({ ...f.actions.at(-1), status: 'cancelled', position: [0, 3, 0] });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(await f.experience.cancelIntent(turn.key, 'manual-action'), false);
  await f.experience.dispose();
});

test('failed physical stop preserves ownership for recovery until acknowledged or superseded', async () => {
  const f = fixture(), turn = await f.turn();
  await f.experience.applyIntent(turn, { type: 'approach', targetId: 'human:visitor' }, { requestId: 'pending-goal' });
  const original = f.adapter.setIntent; let attempts = 0;
  f.adapter.setIntent = (key, intent) => {
    if (intent.type === 'stop' && ++attempts === 1) throw Error('Stop not acknowledged');
    return original(key, intent);
  };
  await assert.rejects(f.experience.cancelIntent(turn.key, 'pending-goal'), /not acknowledged/);
  assert.equal(await f.experience.cancelIntent(turn.key, 'pending-goal'), true);
  assert.equal(attempts, 2); assert.equal(await f.experience.cancelIntent(turn.key, 'pending-goal'), false);
  await f.experience.dispose();
});

test('a terminal receipt awaiting persistence cannot let old cleanup stop newer scene motion', async () => {
  const f = fixture(), turn = await f.turn(); let release, entered;
  const started = new Promise(resolve => { entered = resolve; });
  f.experience.subscribeVerifiedOutcomes(async () => { entered(); await new Promise(resolve => { release = resolve; }); });
  await f.experience.applyIntent(turn, { type: 'approach', targetId: 'human:visitor' }, { requestId: 'old-goal' });
  const old = { ...f.actions.at(-1), position: [10,3,0] };
  f.outcome({ ...old, status: 'arrived' }); await started;
  // Scene Movement controls replace the motor outside the intention bridge.
  f.outcome({ ...old, status: 'cancelled' });
  f.adapter.setIntent(turn.key, { type: 'follow', targetId: 'human:visitor' });
  assert.equal(await f.experience.cancelIntent(turn.key, 'old-goal'), false);
  assert.equal(f.actions.at(-1).type, 'follow');
  release(); await f.experience.dispose();
});

test('missing request identity never authorizes stopping a body', async () => {
  const f = fixture();
  assert.equal(await f.experience.cancelIntent(f.body.key), false);
  assert.equal(await f.experience.cancelIntent(f.body.key, ''), false);
  assert.equal(await f.experience.cancelIntent(f.body.key, 'bad id'), false);
  assert.equal(f.actions.length, 0); await f.experience.dispose();
});
