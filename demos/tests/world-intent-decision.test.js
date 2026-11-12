import test from 'node:test';
import assert from 'node:assert/strict';
import { projectWorldIntentRequest, generateWorldIntentDecision, WORLD_PHYSICAL_INTENT_INSTRUCTIONS, WORLD_PHYSICAL_OBSERVATIONS_MARKER } from '../shared/agents/WorldIntentDecision.js';

const observation = () => ({ observedAt: Date.now(), self: { id: 'resident:owner:ada', name: 'Ada',
  status: 'idle', intentRevision: 4, motion: { type: 'follow', status: 'moving', targetId: 'human:visitor' } },
  participants: [{ id: 'human:owner', name: 'Owner', position: [10, 3, 0] },
    { id: 'human:visitor', name: 'Visitor', position: [0, 3, 40] }], requesterId: 'human:visitor' });
const follow = JSON.stringify({ intent: { type: 'follow', targetId: 'speaker', stopDistance: 10 } });
const candidate = local => ({ key: local ? 'local:model' : 'peer:model', manifestCid: 'model', runtime: 'wllama',
  local, available: true, task: 'text-generation', modalities: ['text'], outputModalities: ['text'] });
const head = mode => ({ identity: { instructions: 'PRIVATE_PERSONALITY_SENTINEL' }, goals: ['PRIVATE_GOAL_SENTINEL'],
  context: { summary: 'PRIVATE_MEMORY_SENTINEL' }, policy: { inferenceMode: mode } });

test('physical decisions resolve request-local references including the actual requester and active motion', () => {
  const observed = observation(), projection = projectWorldIntentRequest('Stop following me.', observed);
  const input = JSON.parse(projection.worldContext);
  assert.equal(projection.prompt, 'Stop following me.');
  assert.equal(input.requesterId, 'speaker');
  assert.deepEqual(input.self.motion, { type: 'follow', status: 'moving', targetId: 'speaker' });
  assert.equal(input.participants[1].name, 'Visitor');
  assert.deepEqual(projection.senses.participants[1].position, [0, 3, 40]);
  assert.equal(input.participants[1].position, undefined);
  assert.doesNotMatch(projection.worldContext, /human:visitor|resident:owner:ada|observedAt|intentRevision/);
  assert.deepEqual(projection.resolve(follow), { intent: { type: 'follow', targetId: 'human:visitor', stopDistance: 10 } });
  assert.deepEqual(projection.resolve('```json\n{"intent":{"type":"stop"}}\n```'), { intent: { type: 'stop' } });
  assert.deepEqual(projection.resolve('{"intent":null}'), { intent: null });
  assert.equal(observed.requesterId, 'human:visitor');
});

test('a lost motion target has no prompt reference and cannot be selected as a current participant', () => {
  const observed = observation(); observed.self.motion = { type: 'follow', status: 'target-lost', targetId: 'human:gone' };
  const projection = projectWorldIntentRequest('Follow them.', observed);
  assert.deepEqual(JSON.parse(projection.worldContext).self.motion, { type: 'follow', status: 'target-lost', targetId: null });
  assert.doesNotMatch(projection.worldContext, /human:gone/);
  assert.equal(observed.self.motion.targetId, 'human:gone', 'original evidence remains intact');
  assert.throws(() => projection.resolve('{"intent":{"type":"follow","targetId":"human:gone"}}'));
});

test('target references and validation snapshots cannot be changed by the caller during inference', () => {
  const observed = observation(), projection = projectWorldIntentRequest('Follow me.', observed);
  observed.participants[1].id = 'human:attacker'; observed.observedAt = 0;
  projection.senses.participants.length = 0; projection.senses.observedAt = 0;
  assert.deepEqual(projection.resolve(follow), { intent: { type: 'follow', targetId: 'human:visitor', stopDistance: 10 } });
  const other = observation(); other.participants.reverse();
  assert.equal(projectWorldIntentRequest('Follow me.', other).resolve(follow).intent.targetId, 'human:visitor');
  const absent = observation(); delete absent.requesterId;
  assert.throws(() => projectWorldIntentRequest('Follow me.', absent).resolve(follow), { code: 'ERR_WORLD_INTENT_DECISION' });
});

test('malformed, invented, stale and extra action fields cannot reach the body', () => {
  const observed = observation(), projection = projectWorldIntentRequest('Follow me.', observed);
  const invalid = ['hello', 'null', '[]', '{}', '{"intent":null,"text":"I moved"}',
    '{"intent":{"type":"teleport"}}', '{"intent":{"type":"stop","targetId":"p2"}}',
    '{"intent":{"type":"follow","targetId":"human:visitor"}}', '{"intent":{"type":"follow","targetId":"p3"}}',
    '{"intent":{"type":"follow","targetId":"speaker","stopDistance":7}}',
    '{"intent":{"type":"follow","targetId":"speaker","stopDistance":31}}',
    '{"intent":{"type":"follow","targetId":"speaker","code":"execute"}}', 'x'.repeat(4097)];
  for (const text of invalid) assert.throws(() => projection.resolve(text), { code: 'ERR_WORLD_INTENT_DECISION' });
  assert.throws(() => projection.resolve(follow, { now: observed.observedAt + 120001 }), { code: 'ERR_WORLD_INTENT_DECISION' });
  assert.throws(() => projection.resolve(follow, { now: observed.observedAt - 1 }), { code: 'ERR_WORLD_INTENT_DECISION' });
});

test('request byte bounds, duplicate identities and unobserved requesters fail before inference', () => {
  for (const message of ['', '\0', '😀'.repeat(4097)]) assert.throws(() => projectWorldIntentRequest(message, observation()));
  const duplicate = observation(); duplicate.participants.push(duplicate.participants[0]);
  assert.throws(() => projectWorldIntentRequest('Follow me.', duplicate));
  const missing = observation(); missing.requesterId = 'human:missing';
  assert.throws(() => projectWorldIntentRequest('Follow me.', missing));
  const large = observation(); large.participants[0].name = 'x'.repeat(24576);
  assert.throws(() => projectWorldIntentRequest('Follow me.', large));
});

test('managed action inference respects local-only routing without conversational identity, goals or history', async () => {
  const calls = [], local = candidate(true), remote = candidate(false);
  const inference = { listCandidates: async input => { calls.push(input); return [remote, local]; },
    generate: async (selected, input, options) => { calls.push({ selected, input, options }); return { text: follow }; } };
  const controller = new AbortController();
  const result = await generateWorldIntentDecision({ inference, head: head('local-only'), message: 'Follow me.',
    observed: observation(), signal: controller.signal });
  assert.equal(result.intent.targetId, 'human:visitor');
  assert.equal(calls[0].mode, 'local-only'); assert.deepEqual(calls[1].selected, local);
  assert.equal(calls[1].options.signal, controller.signal);
  assert(calls[1].input.messages[0].content.startsWith(WORLD_PHYSICAL_INTENT_INSTRUCTIONS + WORLD_PHYSICAL_OBSERVATIONS_MARKER));
  assert.equal(calls[1].input.messages[1].content, calls[1].input.prompt);
  assert.equal(calls[1].input.messages.length, 2);
  assert.match(calls[1].input.requestId, /^[0-9a-f-]{36}$/);
  assert.doesNotMatch(JSON.stringify(calls), /PRIVATE_.*_SENTINEL/);
  inference.listCandidates = async () => [remote];
  await assert.rejects(generateWorldIntentDecision({ inference, head: head('local-only'), message: 'Follow me.', observed: observation() }), { code: 'ERR_AGENT_NO_MODEL' });
  assert.equal((await generateWorldIntentDecision({ inference, head: head('network-assisted'), message: 'Follow me.', observed: observation() })).intent.type, 'follow');
});

test('cancellation cannot dispatch a late request or apply a model result after cancellation', async () => {
  for (const phase of ['before', 'discovery', 'generation']) {
    const controller = new AbortController(); let generated = 0;
    if (phase === 'before') controller.abort();
    const inference = { listCandidates: async () => { if (phase === 'discovery') controller.abort(); return [candidate(true)]; },
      generate: async () => { generated++; controller.abort(); return { text: follow }; } };
    await assert.rejects(generateWorldIntentDecision({ inference, head: head('local-only'), message: 'Follow me.',
      observed: observation(), signal: controller.signal }), { name: 'AbortError' });
    assert.equal(generated, phase === 'generation' ? 1 : 0);
  }
});

test('persistent task admission is an explicit owner capability and preserves the raw request', () => {
  const message = 'Explore a distant patch of ground and return to this spot.', observed = observation();
  const owner = projectWorldIntentRequest(message, observed, { allowTask: true });
  assert.equal(owner.prompt, message);
  assert.deepEqual(owner.resolve('{"task":true}'), { task: true });
  for (const value of ['{"task":false}', '{"task":true,"intent":null}', '{"task":"yes"}', '{"task":true,"objective":"different"}']) {
    assert.throws(() => owner.resolve(value));
  }
  assert.throws(() => projectWorldIntentRequest(message, observed).resolve('{"task":true}'));
  assert.throws(() => owner.resolve('{"task":true}', { now: observed.observedAt + 120001 }));
  assert.deepEqual(owner.resolve(follow), { intent: { type: 'follow', targetId: 'human:visitor', stopDistance: 10 } });
});

test('single-action specialist cannot bypass persistent point-task admission using guessed coordinates', () => {
  const observed = observation(); observed.self.position = [0, 3, 0];
  observed.spatial = { frame: 'planar-xz', bounds: { min: [-200, -200], max: [200, 200] }, maximumLegDistance: 160 };
  observed.locations = [{ id: 'known', name: 'Open ground', position: [32, 3, 0] }];
  for (const allowTask of [true, false]) assert.throws(() => projectWorldIntentRequest('Go there.', observed, { allowTask })
    .resolve('{"intent":{"type":"move-to","position":[32,3,0]}}'));
});

test('action selection sees the completed reply as bounded data while preserving the latest user turn', async () => {
  let input;
  const inference = { listCandidates: async () => [candidate(true)], generate: async (_selected, value) => { input = value; return { text: '{"intent":null}' }; } };
  const reply = 'I could make a robot, but which color do you want?';
  await generateWorldIntentDecision({ inference, head: head('local-only'), message: 'Design a robot', reply, observed: observation() });
  assert.equal(input.messages.length, 2); assert.equal(input.messages[0].role, 'system');
  assert(input.messages[0].content.includes(JSON.stringify(reply)));
  assert.match(input.messages[0].content, /asked a question.*intent.*null/);
  assert.equal(input.messages[1].content, 'Design a robot'); assert.equal(input.prompt, 'Design a robot');
  await assert.rejects(generateWorldIntentDecision({ inference, head: head('local-only'), message: 'Design a robot', reply: {}, observed: observation() }));
});
