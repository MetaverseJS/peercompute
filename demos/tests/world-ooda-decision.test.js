import test from 'node:test';
import assert from 'node:assert/strict';
import { projectWorldOoda, generateWorldOodaDecision } from '../shared/agents/WorldOodaDecision.js';
import { createWorldOodaResident } from '../shared/agents/WorldOodaResident.js';
const observed = () => ({ observedAt: Date.now(), self: { id: 'resident:owner:a', position: [0, 3, 0], intentRevision: 2 },
  participants: [{ id: 'resident:peer:b', kind: 'resident', agentId: 'b', ownerPeerId: 'peer', name: 'Bea', distance: 20, position: [20, 3, 0] }],
  locations: [{ id: 'ground', name: 'Eastern ground', position: [40, 3, 0] }],
  spatial: { frame: 'planar-xz', bounds: { min: [-100, -100], max: [100, 100] }, maximumLegDistance: 200 } });
const head = () => ({ agentId: 'a', revision: 1, status: 'waiting', identity: { name: 'Ada', instructions: 'Learn about this world.' },
  goals: ['Meet others'], context: { summary: 'PRIVATE HUMAN CONVERSATION' }, policy: { inferenceMode: 'local-only' },
  embodiments: [{ worldId: 'world', shared: true, initiateConversations: true, autonomous: true }] });
test('deliberation resolves only observed targets/locations and gates vision/social tools', () => {
  const p = projectWorldOoda(observed(), { canSee: true, canSpeak: true });
  assert.equal(p.resolve('{"decision":"speak","targetId":"p1","text":"Hello Bea"}').targetId, 'resident:peer:b');
  assert.deepEqual(p.resolve('{"decision":"act","intent":{"type":"move-to","locationId":"l1"}}').intent.position, [40, 3, 0]);
  assert.throws(() => p.resolve('{"decision":"act","intent":{"type":"move-to","position":[999,0,0]}}'));
  assert.throws(() => p.resolve('{"decision":"speak","targetId":"p2","text":"Hello"}'));
  assert.throws(() => projectWorldOoda(observed()).resolve('{"decision":"look","question":"What is that?"}'));
  assert.throws(() => projectWorldOoda(observed(), { canSee: true, vision: { description: 'A tree', observedAt: Date.now() } }).resolve('{"decision":"look","question":"Again"}'));
});
test('managed deliberation uses fresh request IDs and no private chat history or summary', async () => {
  const inputs = [], modes = [];
  const inference = { listCandidates: async ({ mode }) => { modes.push(mode); return [{ key: 'local:x', local: true, available: true,
    manifestCid: 'x', sessionId: 's', task: 'text-generation', runtime: 'transformers.js', modalities: ['text'], outputModalities: ['text'] }]; },
  generate: async (_candidate, input) => { inputs.push(input); return { text: '{"decision":"wait","reflection":"Observe before acting."}' }; } };
  await generateWorldOodaDecision({ inference, head: head(), observed: observed(), canSee: true, canSpeak: true });
  await generateWorldOodaDecision({ inference, head: head(), observed: observed(), canSee: true });
  assert.deepEqual(modes, ['local-only', 'local-only']); assert.notEqual(inputs[0].requestId, inputs[1].requestId);
  assert(!JSON.stringify(inputs).includes('PRIVATE HUMAN CONVERSATION'));
  assert(JSON.stringify(inputs[0].messages).includes('\\"decision\\":\\"speak\\"'));
  assert(!JSON.stringify(inputs[1].messages).includes('\\"decision\\":\\"speak\\"'));
  await generateWorldOodaDecision({ inference, head: head(), observed: observed(), canSee: true,
    vision: { description: 'The camera shows a green cube.', observedAt: Date.now() } });
  assert(!JSON.stringify(inputs[2].messages).includes('\\"decision\\":\\"look\\"'));
  assert(JSON.stringify(inputs[2].messages).includes('green cube'));
  await generateWorldOodaDecision({ inference, head: head(), observed: observed(), canAct: false, canSee: true, canSpeak: true });
  assert(!JSON.stringify(inputs[3].messages).includes('\\"decision\\":\\"act\\"'));
  assert(JSON.stringify(inputs[3].messages).includes('current follow task'));
});
function fixture(overrides = {}) {
  const state = { current: head(), visions: 0, requests: [], memories: [], published: [], intents: [] };
  const body = { key: 'local:a', agentId: 'a', ownerPeerId: 'owner', local: true };
  const action = createWorldOodaResident({ worldId: 'world', agents: { get: async () => state.current, inference: {} },
    adapter: { captureVision() {} }, experience: { observe: observed,
      applyIntent: async (_turn, intent) => state.intents.push(intent), rememberDelivery: async () => {} },
    memory: { retrieve: async () => [], append: async record => state.memories.push(record) }, getBody: () => body, owns: () => true,
    conversationId: async (_world, channel) => channel,
    publish: async message => { state.published.push(message); return {}; },
    see: async () => { state.visions++; return { description: 'A green wall', observedAt: Date.now(), pixels: 'NEVER STORE' }; },
    decide: async input => { state.requests.push(input); return state.requests.length === 1
      ? { decision: 'look', question: 'What is ahead?' } : { decision: 'wait', reflection: 'The wall is green.' }; }, ...overrides });
  return { state, run: () => action({ resident: body, signal: new AbortController().signal, isCurrent: () => true, stage() {} }) };
}
test('vision is selected on demand once, then a fresh decision receives its interpretation without storing pixels', async () => {
  const f = fixture(); await f.run(); assert.equal(f.state.visions, 1); assert.equal(f.state.requests.length, 2);
  assert.equal(f.state.requests[1].vision.description, 'A green wall');
  assert(!JSON.stringify(f.state.memories).includes('NEVER STORE')); assert(f.state.memories.some(x => x.kind === 'reflection'));
  const waiting = fixture({ decide: async () => ({ decision: 'wait', reflection: 'Rest.' }) }); await waiting.run(); assert.equal(waiting.state.visions, 0);
});
test('resident speech uses one fresh authenticated social root and can target another resident', async () => {
  const f = fixture({ decide: async () => ({ decision: 'speak', targetId: 'resident:peer:b', text: 'Hello Bea', reflection: '' }) });
  await f.run(); assert.equal(f.state.published.length, 1);
  assert.equal(f.state.published[0].social.targetAgentId, 'b'); assert.equal(f.state.published[0].social.turn, 0);
});

test('continuous follow allows reflection, vision and speech but cannot be replaced by autonomous movement', async () => {
  const projected = projectWorldOoda(observed(), { canAct: false, canSee: true, canSpeak: true });
  assert.throws(() => projected.resolve('{"decision":"act","intent":{"type":"stop"}}'));
  assert.equal(projected.resolve('{"decision":"look","question":"What is ahead?"}').decision, 'look');
  assert.equal(projected.resolve('{"decision":"speak","targetId":"p1","text":"Hello"}').decision, 'speak');
  for (const status of ['moving', 'arrived', 'target-lost']) {
    const intents = [], requests = [];
    const f = fixture({ experience: { observe: () => ({ ...observed(), self: { ...observed().self, motion: { type: 'follow', status } } }),
      applyIntent: async (...args) => intents.push(args) },
    decide: async input => { requests.push(input); return { decision: 'act', intent: { type: 'stop' }, reflection: '' }; } });
    assert.equal((await f.run()).status, 'resting');
    assert.equal(requests[0].canAct, false); assert.equal(intents.length, 0);
  }
  let moving = false;
  const intents = [], f = fixture({ experience: { observe: () => ({ ...observed(), self: { ...observed().self,
    ...(moving ? { motion: { type: 'follow', status: 'moving' } } : {}) } }), applyIntent: async (...args) => intents.push(args) },
  decide: async () => { moving = true; return { decision: 'act', intent: { type: 'stop' }, reflection: '' }; } });
  await f.run(); assert.equal(intents.length, 0, 'New follow command wins over pending reflection');
});
test('editing or owner-pausing during a visual request rejects late reasoning before an action', async () => {
  let f;
  f = fixture({ see: async () => { f.state.current = { ...f.state.current, status: 'paused', pauseCause: 'owner', revision: 2 };
    return { description: 'A wall', observedAt: Date.now() }; } });
  await assert.rejects(f.run(), { name: 'AbortError' }); assert.equal(f.state.requests.length, 1); assert.equal(f.state.intents.length, 0);
});
test('missing optional vision continues with a fresh nonvisual decision instead of a repeated look loop', async () => {
  const f = fixture({ see: async () => { throw Object.assign(new Error('No vision provider'), { code: 'ERR_AGENT_NO_MODEL' }); } });
  await f.run();
  assert.equal(f.state.requests.length, 2); assert.equal(f.state.requests[1].canSee, false);
  assert.equal(f.state.requests[1].vision, undefined);
  assert(f.state.memories.some(x => x.kind === 'reflection'));
  const lost = fixture({ see: async () => { throw Object.assign(new Error('Lost after dispatch'), { code: 'ERR_MODEL_RESIDENCY_INACTIVE', committed: true }); } });
  await assert.rejects(lost.run(), /Lost after dispatch/); assert.equal(lost.state.requests.length, 1);
});
test('Unicode goals stay within memory query bytes and public greeting receipts inform the next reflection', async () => {
  const queries = [], publicEvent = { kind: 'social-delivery', text: 'Welcome Bea', who: { name: 'Bea' }, when: Date.now() };
  const f = fixture({ memory: { retrieve: async request => {
    queries.push(request); assert(new TextEncoder().encode(request.query).length <= 512);
    return request.audience === 'public' ? [publicEvent] : [];
  }, append: async () => {} } });
  f.state.current.goals = ['世界を学ぶ🌎'.repeat(80)]; await f.run();
  assert.equal(queries[1].conversationId, 'public-room');
  assert.equal(f.state.requests[0].publicMemories[0].text, 'Welcome Bea');
  const projection = projectWorldOoda(observed(), { publicMemories: f.state.requests[0].publicMemories });
  assert.equal(projection.data.recentPublicEvents[0].participant, 'Bea');
});


test('private knowledge and its reflections stay out of cycles allowed to publish public speech', async () => {
  const requests = [], reads = [], writes = [];
  const f = fixture({ knowledge: { observe: async input => { requests.push(input); return input.observed; }, assertCurrent: async () => {} },
    memory: { retrieve: async input => { reads.push(input); return []; }, append: async record => writes.push(record) },
    decide: async () => ({ decision: 'wait', reflection: 'A private thought.' }) });
  f.state.current.embodiments[0].initiateConversations = false; await f.run();
  assert.equal(requests[0].audience, 'private'); assert.equal(writes[0].conversationId, 'resident-private-reflection');
  assert.equal(reads[0].conversationId, 'resident-private-reflection');
  requests.length = reads.length = writes.length = 0;
  f.state.current.embodiments[0].initiateConversations = true; await f.run();
  assert.equal(requests[0].audience, 'public'); assert.equal(writes[0].conversationId, 'resident-reflection');
  assert(!reads.some(input => input.conversationId === 'resident-private-reflection'));
});

test('forgetting source knowledge during inference prevents OODA movement and publication', async () => {
  const f = fixture({ knowledge: { observe: async input => input.observed,
    assertCurrent: async () => { throw new DOMException('Knowledge changed', 'AbortError'); } },
    decide: async () => ({ decision: 'act', intent: { type: 'stop' }, reflection: 'Old memory' }) });
  await assert.rejects(f.run(), { name: 'AbortError' }); assert.deepEqual(f.state.intents, []); assert.deepEqual(f.state.published, []);
});
