import test from 'node:test';
import assert from 'node:assert/strict';
import { generateWorldGoalDecision, parseWorldGoalDecision, projectWorldGoal, worldGoalPrompt } from '../shared/agents/WorldGoalDecision.js';

const now = Date.now();
const observed = { observedAt: now, requesterId: 'human:owner', self: { id: 'resident:owner:agent', name: 'Resident', intentRevision: 0, position: [0, 0, 0] },
  participants: [{ id: 'human:nova', name: 'Nova', kind: 'human', position: [10, 0, 0], distance: 10 }], obstacles: [] };
const goal = { objective: 'Visit Nova, then return to me.', steps: 0, limits: { maxSteps: 8 }, receipts: [], currentStep: '' };
const parse = (decision, current = goal) => parseWorldGoalDecision(JSON.stringify(decision), { goal: current, observed, now });

test('goal decisions admit only bounded currently observed finite actions', () => {
  assert.deepEqual(parse({ decision: 'act', intent: { type: 'approach', targetId: 'human:nova' }, reason: 'Visit Nova.' }),
    { decision: 'act', intent: { type: 'approach', targetId: 'human:nova', stopDistance: 10 }, reason: 'Visit Nova.' });
  for (const intent of [{ type: 'follow', targetId: 'human:nova' }, { type: 'approach', targetId: 'unseen' },
    { type: 'approach', targetId: 'human:nova', stopDistance: 0 }, { type: 'stop', targetId: 'human:nova' }, { type: 'code', source: 'run()' }]) {
    assert.throws(() => parse({ decision: 'act', intent }), { code: 'ERR_WORLD_GOAL_DECISION' });
  }
});

test('approach stopping distance bounds final separation without excluding a distant observed target', () => {
  const distant = { ...observed, participants: [{ ...observed.participants[0], position: [140, 0, 0], distance: 140 }] };
  const decision = { decision: 'act', intent: { type: 'approach', targetId: 'human:nova', stopDistance: 10 }, reason: 'Move toward the participant.' };
  assert.deepEqual(parseWorldGoalDecision(JSON.stringify(decision), { goal, observed: distant, now }), decision);
  assert.throws(() => parseWorldGoalDecision(JSON.stringify({ ...decision,
    intent: { ...decision.intent, stopDistance: 140 } }), { goal, observed: distant, now }), { code: 'ERR_WORLD_GOAL_DECISION' });
});

test('completion is an explicit model assessment citing successful receipts from this goal only', () => {
  const done = { decision: 'done', assessment: 'I assess the visit as finished.', receiptIds: ['receipt-1'] };
  assert.throws(() => parse(done));
  assert.throws(() => parse(done, { ...goal, receipts: [{ requestId: 'receipt-1', status: 'blocked' }] }));
  assert.deepEqual(parse(done, { ...goal, receipts: [{ requestId: 'receipt-1', status: 'arrived' }] }), done);
  assert.throws(() => parse({ ...done, receiptIds: [] }));
  assert.throws(() => parse({ ...done, receiptIds: ['receipt-1', 'receipt-1'] }));
});

test('malformed, oversized, executable and extra-field model replies never reach a physical adapter', () => {
  for (const input of ['not JSON', 'x'.repeat(16385), JSON.stringify({ decision: 'wait', reason: 'Wait', code: 'run()' }),
    JSON.stringify({ decision: 'wait', reason: '\0' }), JSON.stringify({ decision: 'pause', reason: '' })]) {
    assert.throws(() => parseWorldGoalDecision(input, { goal, observed, now }), { code: 'ERR_WORLD_GOAL_DECISION' });
  }
});

test('goal prompt includes bounded evidence, omitting full private transcripts and body internals', () => {
  const prompt = worldGoalPrompt({ ...goal, receipts: [{ requestId: 'receipt-1', type: 'approach', status: 'arrived', at: now,
    targetId: 'human:nova', reason: 'PRIVATE world geometry', position: [1, 2, 3] }] });
  assert.match(prompt, /receipt-1/); assert.doesNotMatch(prompt, /PRIVATE|position/);
});

test('prompt references resolve duplicate display names to exact observed identities and reject guessed or old IDs', () => {
  const second = { ...observed, participants: [...observed.participants, { ...observed.participants[0], id: 'human:other' }] };
  const projection = projectWorldGoal(goal, second);
  const result = projection.resolve('{"decision":"act","intent":{"type":"approach","targetId":"p2"}}');
  assert.equal(result.intent.targetId, 'human:other');
  for (const id of ['p9', 'human:other', 'Nova']) {
    assert.throws(() => projection.resolve(JSON.stringify({ decision: 'act', intent: { type: 'approach', targetId: id } })),
      { code: 'ERR_WORLD_GOAL_DECISION' });
  }
  const swapped = projectWorldGoal(goal, { ...second, participants: [...second.participants].reverse() });
  assert.equal(swapped.resolve('{"decision":"act","intent":{"type":"approach","targetId":"p2"}}').intent.targetId, 'human:nova');
  assert.equal(result.intent.targetId, 'human:other', 'Earlier response keeps its own observation mapping');
});

test('eight named receipts fit compact prompts and completion still cites original successful evidence', () => {
  const id = 'resident:' + 'a'.repeat(52) + ':' + 'b'.repeat(36);
  const long = { ...observed, requesterId: id, participants: [{ ...observed.participants[0], id }] };
  const full = { ...goal, receipts: Array.from({ length: 8 }, (_, i) => ({ requestId: `${'r'.repeat(36)}-${i}`,
    type: 'approach', targetId: id, status: i === 7 ? 'blocked' : 'arrived', at: now + i })) };
  const original = structuredClone({ full, long }), projection = projectWorldGoal(full, long);
  assert(projection.prompt.length < worldGoalPrompt(full).length * .7, 'References bound repeated transport-identity overhead');
  assert.doesNotMatch(projection.prompt + projection.worldContext, /a{52}|b{36}|r{36}/);
  assert.equal(JSON.parse(projection.prompt).receipts[0].targetName, 'Nova');
  assert.equal(JSON.parse(projection.worldContext).senses.requesterId, 'p1');
  assert.deepEqual(projection.resolve('{"decision":"done","assessment":"Reached Nova.","receiptIds":["r1","r7"]}').receiptIds,
    [full.receipts[0].requestId, full.receipts[6].requestId]);
  for (const receiptId of ['r8', 'r9', full.receipts[0].requestId]) {
    assert.throws(() => projection.resolve(JSON.stringify({ decision: 'done', assessment: 'Done.', receiptIds: [receiptId] })),
      { code: 'ERR_WORLD_GOAL_DECISION' });
  }
  assert.deepEqual({ full, long }, original, 'Prompt references never rewrite persistent facts');
});

test('compact references cannot select omitted or absent participants, or reuse stale observations', () => {
  const crowded = { ...observed, requesterId: undefined,
    participants: Array.from({ length: 24 }, (_, i) => ({ ...observed.participants[0], id: `human:${i}`, name: 'N'.repeat(150) })) };
  const historical = { ...goal, receipts: [{ requestId: 'old-receipt', type: 'approach', targetId: 'human:gone', status: 'arrived' }] };
  const projection = projectWorldGoal(historical, crowded);
  const visible = JSON.parse(projection.worldContext).senses.participants;
  assert(visible.length < 24);
  for (const id of ['p24', 'p25']) {
    assert.throws(() => projection.resolve(JSON.stringify({ decision: 'act', intent: { type: 'approach', targetId: id } })),
      { code: 'ERR_WORLD_GOAL_DECISION' });
  }
  assert.deepEqual(projection.resolve('{"decision":"done","assessment":"Historical arrival recorded.","receiptIds":["r1"]}').receiptIds,
    ['old-receipt']);
  const stale = projectWorldGoal(goal, { ...observed, observedAt: Date.now() - 121000 });
  assert.throws(() => stale.resolve('{"decision":"act","intent":{"type":"approach","targetId":"p1"}}'),
    { code: 'ERR_WORLD_GOAL_DECISION' });
});

test('managed routing preserves local-only and waits without dispatch when no model exists', async () => {
  let generated = 0;
  const inference = { async listCandidates({ mode }) { assert.equal(mode, 'local-only'); return []; },
    async generate() { generated++; } };
  assert.deepEqual(await generateWorldGoalDecision({ inference, head: { policy: { inferenceMode: 'local-only' } }, goal, observed }),
    { status: 'waiting-for-model' });
  assert.equal(generated, 0);
});

test('managed planning sends the owner objective and current evidence without unrelated journal state', async () => {
  const candidate = { key: 'local:model', manifestCid: 'model', runtime: 'wllama', local: true, available: true,
    task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };
  const head = { identity: { name: 'Ada', instructions: 'Be thoughtful.' }, goals: ['UNRELATED_GOAL'],
    context: { summary: 'UNRELATED_PRIVATE_SUMMARY' }, policy: { inferenceMode: 'local-only' } };
  let request;
  const inference = { async listCandidates({ mode }) { assert.equal(mode, 'local-only'); return [candidate]; },
    async generate(selected, input) { assert.equal(selected.key, candidate.key); request = input;
      return { text: '{"decision":"act","intent":{"type":"approach","targetId":"p1"},"reason":"Visit Nova."}' }; } };
  assert.equal((await generateWorldGoalDecision({ inference, head, goal, observed })).decision, 'act');
  assert.match(JSON.stringify(request.messages), /Visit Nova/); assert.match(JSON.stringify(request.messages), /Ada/);
  assert.doesNotMatch(JSON.stringify(request.messages), /UNRELATED/);
  const senses = JSON.parse(request.worldContext).senses;
  assert.equal(senses.requesterId, 'p2');
  assert.deepEqual(senses.participants.map(({ name, distance }) => ({ name, distance })),
    observed.participants.map(({ name, distance }) => ({ name, distance })));
  assert.equal(request.maxNewTokens, 512);
  const controller = new AbortController(); controller.abort(); request = null;
  await assert.rejects(generateWorldGoalDecision({ inference, head, goal, observed, signal: controller.signal }), { name: 'AbortError' });
  assert.equal(request, null);
});

test('a missing target can still produce an unchanged model-selected wait instead of an invented action', async () => {
  const candidate = { key: 'local:model', manifestCid: 'model', runtime: 'wllama', local: true, available: true,
    task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };
  const decision = { decision: 'wait', reason: 'The requested participant is not currently observed.' };
  const absent = { ...observed, participants: [] };
  const inference = { async listCandidates() { return [candidate]; }, async generate(_selected, input) {
    assert.deepEqual(JSON.parse(input.worldContext).senses.participants, []);
    return { text: JSON.stringify(decision) };
  } };
  assert.deepEqual(await generateWorldGoalDecision({ inference, head: { identity: { name: 'Ada' },
    policy: { inferenceMode: 'local-only' } }, goal, observed: absent }), decision);
});
