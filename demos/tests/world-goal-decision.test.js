import test from 'node:test';
import assert from 'node:assert/strict';
import { generateWorldGoalDecision, parseWorldGoalDecision, projectWorldGoal, worldGoalPrompt,
  WORLD_GOAL_INSTRUCTIONS, WORLD_GOAL_OBSERVATIONS_MARKER } from '../shared/agents/WorldGoalDecision.js';

const now = Date.now();
const observed = { observedAt: now, requesterId: 'human:owner', self: { id: 'resident:owner:agent', name: 'Resident', intentRevision: 0, position: [0, 0, 0] },
  participants: [{ id: 'human:nova', name: 'Nova', kind: 'human', position: [10, 0, 0], distance: 10 },
    { id: 'human:owner', name: 'Owner', kind: 'human', position: [20, 0, 0], distance: 20 }], obstacles: [] };
const initial = { objective: 'Visit Nova, then return to me.', requesterId: 'human:owner', steps: 0,
  limits: { maxSteps: 8 }, plan: null, completedMilestones: [], receipts: [], currentStep: '' };
const milestones = [{ label: 'Visit Nova', type: 'approach', targetId: 'human:nova' },
  { label: 'Return to owner', type: 'approach', targetRole: 'requester' }];
const goal = { ...initial, steps: 1, plan: { version: 1, milestones } };
const act = targetId => ({ decision: 'act', intent: { type: 'approach', targetId }, reason: 'Visit target.' });
const complete = () => ({ ...goal, steps: 3,
  completedMilestones: [{ index: 0, requestId: 'receipt-1' }, { index: 1, requestId: 'receipt-2' }],
  receipts: [{ requestId: 'receipt-1', type: 'approach', targetId: 'human:nova', status: 'arrived', at: now },
    { requestId: 'receipt-2', type: 'approach', targetId: 'human:owner', status: 'arrived', at: now }] });
const parse = (decision, current = goal, senses = observed) => parseWorldGoalDecision(JSON.stringify(decision), { goal: current, observed: senses, now });
const resolve = (projection, decision) => projection.resolve(JSON.stringify(decision), { now });
const state = input => JSON.parse(input.messages[0].content.split(WORLD_GOAL_OBSERVATIONS_MARKER)[1]);
const schemas = projection => projection.instructions.split('\n').filter(line => line.startsWith('{')).map(line => JSON.parse(line));
const candidate = { key: 'local:model', manifestCid: 'model', runtime: 'wllama', local: true, available: true,
  task: 'text-generation', modalities: ['text'], outputModalities: ['text'] };

test('first physical decision must save a bounded complete model plan before any action', () => {
  const plan = { decision: 'plan', milestones };
  assert.deepEqual(parse(plan, initial), plan);
  assert.throws(() => parse(act('human:nova'), initial), { code: 'ERR_WORLD_GOAL_DECISION' });
  assert.throws(() => parse(plan), { code: 'ERR_WORLD_GOAL_DECISION' });
  for (const invalid of [[], Array(7).fill(milestones[0]), [{ ...milestones[0], label: 'é'.repeat(33) }],
    [{ ...milestones[0], targetId: 'missing' }], [{ label: 'Unsupported', type: 'follow', targetId: 'human:nova' }]]) {
    assert.throws(() => parse({ decision: 'plan', milestones: invalid }, initial), { code: 'ERR_WORLD_GOAL_DECISION' });
  }
});

test('only the active milestone type and exact currently observed identity may act', () => {
  assert.deepEqual(parse(act('human:nova')), { ...act('human:nova'), intent: { type: 'approach', targetId: 'human:nova', stopDistance: 10 } });
  for (const intent of [{ type: 'follow', targetId: 'human:nova' }, { type: 'approach', targetId: 'human:owner' },
    { type: 'look-at', targetId: 'human:nova' }, { type: 'approach', targetId: 'unseen' },
    { type: 'approach', targetId: 'human:nova', stopDistance: 0 }, { type: 'stop' }, { type: 'code', source: 'run()' }]) {
    assert.throws(() => parse({ decision: 'act', intent }), { code: 'ERR_WORLD_GOAL_DECISION' });
  }
  const progressed = complete(); progressed.completedMilestones.pop(); progressed.receipts.pop();
  assert.equal(parse(act('human:owner'), progressed).intent.targetId, 'human:owner');
  assert.throws(() => parse(act('human:nova'), progressed), { code: 'ERR_WORLD_GOAL_DECISION' });
});

test('distant observed targets remain valid, while stale observations never authorize a plan or action', () => {
  const distant = { ...observed, participants: [{ ...observed.participants[0], position: [140, 0, 0], distance: 140 }, observed.participants[1]] };
  assert.equal(parse(act('human:nova'), goal, distant).intent.stopDistance, 10);
  const stale = { ...observed, observedAt: now - 121000 };
  assert.throws(() => parse(act('human:nova'), goal, stale), { code: 'ERR_WORLD_GOAL_DECISION' });
  assert.throws(() => parse({ decision: 'plan', milestones }, initial, stale), { code: 'ERR_WORLD_GOAL_DECISION' });
});

test('completion requires every milestone and exactly all distinct successful receipt IDs', () => {
  const done = { decision: 'done', assessment: 'Both requested visits have evidence.', receiptIds: ['receipt-1', 'receipt-2'] };
  assert.deepEqual(parse(done, complete()), done);
  for (const bad of [initial, goal, { ...complete(), completedMilestones: [{ index: 0, requestId: 'receipt-1' }] },
    { ...complete(), completedMilestones: [{ index: 0, requestId: 'receipt-1' }, { index: 1, requestId: 'receipt-1' }] },
    { ...complete(), receipts: complete().receipts.map(item => ({ ...item, status: 'blocked' })) }]) {
    assert.throws(() => parse(done, bad), { code: 'ERR_WORLD_GOAL_DECISION' });
  }
  for (const receiptIds of [[], ['receipt-1'], ['receipt-1', 'receipt-1'], ['receipt-1', 'receipt-2', 'invented'], ['r1', 'r2']]) {
    assert.throws(() => parse({ ...done, receiptIds }, complete()), { code: 'ERR_WORLD_GOAL_DECISION' });
  }
  assert.throws(() => parse(act('human:nova'), complete()), { code: 'ERR_WORLD_GOAL_DECISION' });
});

test('malformed, oversized, executable and extra-field replies cannot authorize work', () => {
  for (const input of ['not JSON', 'x'.repeat(16385), JSON.stringify({ decision: 'wait', reason: 'Wait', code: 'run()' }),
    JSON.stringify({ decision: 'plan', milestones, reason: 'Extra' }),
    JSON.stringify({ decision: 'wait', reason: '\0' }), JSON.stringify({ decision: 'pause', reason: '' })]) {
    assert.throws(() => parseWorldGoalDecision(input, { goal, observed, now }), { code: 'ERR_WORLD_GOAL_DECISION' });
  }
});

test('speaker plan references persist as a requester role, while duplicate names keep exact fixed identities', () => {
  const senses = { ...observed, participants: [{ ...observed.participants[0], id: 'human:other' }, ...observed.participants] };
  const projection = projectWorldGoal(initial, senses);
  const result = resolve(projection, { decision: 'plan', milestones: [
    { label: 'Visit second Nova', type: 'approach', targetId: 'p2' },
    { label: 'Return', type: 'approach', targetId: 'speaker' }] });
  assert.deepEqual(result.milestones, [{ label: 'Visit second Nova', type: 'approach', targetId: 'human:nova' },
    { label: 'Return', type: 'approach', targetRole: 'requester' }]);
  for (const targetId of ['p9', 'human:nova', 'Nova']) {
    assert.throws(() => resolve(projection, { decision: 'plan', milestones: [{ ...milestones[0], targetId }] }),
      { code: 'ERR_WORLD_GOAL_DECISION' });
  }
});

test('new observation order cannot retarget a saved milestone and old snapshots are immutable', () => {
  const mutable = structuredClone(observed), projection = projectWorldGoal(goal, mutable);
  mutable.participants.reverse(); mutable.participants[1].id = 'replaced';
  assert.equal(resolve(projection, act('p1')).intent.targetId, 'human:nova');
  const reversed = projectWorldGoal(goal, { ...observed, participants: [...observed.participants].reverse() });
  assert.equal(resolve(reversed, act('p2')).intent.targetId, 'human:nova');
  assert.throws(() => resolve(reversed, act('p1')), { code: 'ERR_WORLD_GOAL_DECISION' });
  assert.throws(() => resolve(reversed, act('speaker')), { code: 'ERR_WORLD_GOAL_DECISION' });
});

test('opaque stable identities may spell like prompt references but are resolved only by the local lookup', () => {
  const senses = { ...observed, participants: [{ ...observed.participants[0], id: 'speaker' }, observed.participants[1]] };
  const planned = resolve(projectWorldGoal(initial, senses), { decision: 'plan', milestones: [
    { label: 'Visit literal speaker ID', type: 'approach', targetId: 'p1' }] });
  assert.equal(planned.milestones[0].targetId, 'speaker');
  assert.equal(planned.milestones[0].targetRole, undefined);
});

test('completed evidence and active milestone stay compact without previous-step, persona, geometry or flat history', () => {
  const progressed = complete(); progressed.completedMilestones.pop(); progressed.receipts.pop();
  progressed.currentStep = 'PRIVATE OLD RIDDLE'; progressed.lastReceipt = { ...progressed.receipts[0], position: [1, 2, 3] };
  const projection = projectWorldGoal(progressed, observed), context = JSON.parse(projection.worldContext);
  assert.equal(worldGoalPrompt(progressed), progressed.objective);
  assert.equal(context.originalObjective, progressed.objective);
  assert(projection.prompt.includes(JSON.stringify(context.activeMilestone)));
  assert(!projection.prompt.includes(progressed.objective));
  assert.equal(context.phase, 'milestone'); assert.equal(context.activeMilestone.index, 1);
  assert.equal(context.activeMilestone.targetId, 'speaker'); assert.equal(context.completedMilestones[0].requestId, 'r1');
  assert.doesNotMatch(projection.worldContext, /PRIVATE|position|intentRevision|human:|resident:|previousStep|"receipts"/);
  const original = complete(), terminal = projectWorldGoal(original, observed);
  assert.equal(JSON.parse(terminal.worldContext).phase, 'assess');
  assert.deepEqual(resolve(terminal, { decision: 'done', assessment: 'Both arrived.', receiptIds: ['r1', 'r2'] }).receiptIds,
    original.receipts.map(item => item.requestId));
});

test('missing targets remain missing despite receipts, and blocked attempts are shown without progress', () => {
  const blocked = { ...goal, receipts: [{ requestId: 'blocked', type: 'approach', targetId: 'human:nova', status: 'blocked', at: now }],
    lastReceipt: { requestId: 'blocked', type: 'approach', targetId: 'human:nova', status: 'blocked', reason: 'No path.' } };
  const projection = projectWorldGoal(blocked, { ...observed, participants: [observed.participants[1]] });
  const context = JSON.parse(projection.worldContext);
  assert.equal(context.activeMilestone.targetPresent, false); assert.equal(context.activeMilestone.targetId, null);
  assert.equal(context.latestAttempt.status, 'blocked'); assert.deepEqual(context.completedMilestones, []);
  assert.throws(() => resolve(projection, act('p1')), { code: 'ERR_WORLD_GOAL_DECISION' });
  const wait = { decision: 'wait', reason: 'The active target is absent.' };
  assert.deepEqual(resolve(projection, wait), wait);
});

test('requester role refresh changes only the unfinished requester target and preserves historical evidence', () => {
  const progressed = complete(); progressed.completedMilestones.pop(); progressed.receipts.pop(); progressed.requesterId = 'human:new-owner';
  const senses = { ...observed, participants: [...observed.participants, { ...observed.participants[1], id: 'human:new-owner' }] };
  const projection = projectWorldGoal(progressed, senses);
  assert.equal(resolve(projection, act('speaker')).intent.targetId, 'human:new-owner');
  assert.throws(() => resolve(projection, act('p2')), { code: 'ERR_WORLD_GOAL_DECISION' });
  assert.deepEqual(parse({ decision: 'done', assessment: 'Both old visits are complete.', receiptIds: ['receipt-1', 'receipt-2'] },
    { ...complete(), requesterId: 'human:new-owner' }, senses).receiptIds, ['receipt-1', 'receipt-2']);
});

test('all 24 compact observed targets remain addressable without reusing absent historical IDs', () => {
  const crowded = { ...observed, participants: Array.from({ length: 24 }, (_, i) => ({ ...observed.participants[0], id: `human:${i}`, name: 'N'.repeat(150) })) };
  const projection = projectWorldGoal(initial, crowded);
  assert.equal(JSON.parse(projection.worldContext).participants.length, 24);
  const plan = { decision: 'plan', milestones: [{ label: 'Last target', type: 'approach', targetId: 'p24' }] };
  assert.equal(resolve(projection, plan).milestones[0].targetId, 'human:23');
  assert.throws(() => resolve(projection, { decision: 'plan', milestones: [{ ...plan.milestones[0], targetId: 'p25' }] }),
    { code: 'ERR_WORLD_GOAL_DECISION' });
});

test('managed routing preserves local-only and waits without loading an absent model', async () => {
  let generated = 0;
  const inference = { async listCandidates({ mode }) { assert.equal(mode, 'local-only'); return []; }, async generate() { generated++; } };
  assert.deepEqual(await generateWorldGoalDecision({ inference, head: { policy: { inferenceMode: 'local-only' } }, goal, observed }),
    { status: 'waiting-for-model' });
  assert.equal(generated, 0);
});

test('specialist uses raw objective plus compact state without identity instructions or journal mutation', async () => {
  const head = { identity: { name: 'PRIVATE_ADA', instructions: 'PRIVATE_RIDDLE' }, goals: ['UNRELATED_GOAL'],
    context: { summary: 'UNRELATED_PRIVATE_SUMMARY' }, policy: { inferenceMode: 'local-only' } };
  const original = structuredClone(head); let request;
  const inference = { async listCandidates({ mode }) { assert.equal(mode, 'local-only'); return [candidate]; },
    async generate(selected, input) { assert.equal(selected.key, candidate.key); request = input;
      return { text: JSON.stringify({ decision: 'plan', milestones: [{ ...milestones[0], targetId: 'p1' },
        { label: 'Return', type: 'approach', targetId: 'speaker' }] }) }; } };
  assert.equal((await generateWorldGoalDecision({ inference, head, goal: initial, observed })).decision, 'plan');
  assert(request.messages[0].content.startsWith(WORLD_GOAL_INSTRUCTIONS));
  assert(request.messages[0].content.includes(WORLD_GOAL_OBSERVATIONS_MARKER));
  assert.deepEqual(request.messages.at(-1), { role: 'user', content: initial.objective });
  assert.equal(request.messages.length, 2); assert.equal(request.prompt, initial.objective);
  assert.doesNotMatch(JSON.stringify(request), /UNRELATED|PRIVATE_ADA|PRIVATE_RIDDLE/);
  assert.equal(state(request).phase, 'plan'); assert.equal(state(request).requesterId, 'speaker');
  assert.deepEqual(head, original); assert.equal(request.maxNewTokens, 768);
  const controller = new AbortController(); controller.abort(); request = null;
  await assert.rejects(generateWorldGoalDecision({ inference, head, goal, observed, signal: controller.signal }), { name: 'AbortError' });
  assert.equal(request, null);
});

test('a missing target can produce an unchanged model-selected wait with no substituted action', async () => {
  const decision = { decision: 'wait', reason: 'The requested participant is not currently observed.' };
  const inference = { async listCandidates() { return [candidate]; }, async generate(_selected, input) {
    assert.deepEqual(state(input).participants, []); return { text: JSON.stringify(decision) };
  } };
  assert.deepEqual(await generateWorldGoalDecision({ inference, head: { policy: { inferenceMode: 'local-only' } },
    goal, observed: { ...observed, participants: [] } }), decision);
});

test('saved-plan action, wait, pause and final assessment reserve the smaller output budget', async () => {
  const outcomes = [act('p1'), { decision: 'wait', reason: 'Wait for a clear path.' },
    { decision: 'pause', reason: 'Owner help is needed.' },
    { decision: 'done', assessment: 'Both requested visits have exact arrival evidence.', receiptIds: ['r1', 'r2'] }];
  for (const answer of outcomes) {
    const current = answer.decision === 'done' ? complete() : goal;
    const inference = { async listCandidates() { return [candidate]; }, async generate(_selected, input) {
      assert.equal(input.maxNewTokens, 384);
      assert.equal(state(input).phase, answer.decision === 'done' ? 'assess' : 'milestone');
      return { text: JSON.stringify(answer) };
    } };
    const result = await generateWorldGoalDecision({ inference, head: { policy: { inferenceMode: 'local-only' } },
      goal: current, observed });
    assert.equal(result.decision, answer.decision);
    if (result.decision === 'act') assert.equal(result.intent.targetId, 'human:nova');
    if (result.decision === 'done') assert.deepEqual(result.receiptIds, ['receipt-1', 'receipt-2']);
  }
});

test('capability clarification preserves explicit targetless stops and rejects the native targeted-stop failure', async () => {
  const objective = { ...initial, objective: 'Visit Nova, then stop.' };
  const answer = { decision: 'plan', milestones: [{ label: 'Visit Nova', type: 'approach', targetId: 'p1' },
    { label: 'Stop', type: 'stop' }] };
  const clarification = 'Approach already stops when it reaches its target. Do not add a separate stop to a visit unless explicitly requested. A stop milestone has only label and type:stop; it never has targetId or targetRole.';
  const inference = { async listCandidates() { return [candidate]; }, async generate(_selected, input) {
    assert(input.messages[0].content.includes(clarification));
    assert.equal(input.prompt, objective.objective); assert.equal(state(input).phase, 'plan');
    return { text: JSON.stringify(answer) };
  } };
  const selected = await generateWorldGoalDecision({ inference, head: { policy: { inferenceMode: 'local-only' } },
    goal: objective, observed });
  assert.deepEqual(selected.milestones, [{ label: 'Visit Nova', type: 'approach', targetId: 'human:nova' },
    { label: 'Stop', type: 'stop' }]);
  const projection = projectWorldGoal(objective, observed);
  for (const target of [{ targetId: 'p1' }, { targetRole: 'requester' }]) {
    const invalid = structuredClone(answer); Object.assign(invalid.milestones[1], target);
    assert.throws(() => resolve(projection, invalid), { code: 'ERR_WORLD_GOAL_DECISION' });
  }
  const afterVisit = { ...objective, plan: { version: 1, milestones: selected.milestones },
    completedMilestones: [{ index: 0, requestId: 'visit' }],
    receipts: [{ requestId: 'visit', type: 'approach', targetId: 'human:nova', status: 'arrived', at: now }] };
  assert.deepEqual(parse({ decision: 'act', intent: { type: 'stop' } }, afterVisit),
    { decision: 'act', intent: { type: 'stop' }, reason: '' });
  assert.throws(() => parse({ decision: 'act', intent: { type: 'stop', targetId: 'human:nova' } }, afterVisit),
    { code: 'ERR_WORLD_GOAL_DECISION' });
});

test('phase instructions expose only planning, current-action or final-assessment schemas', () => {
  const planning = projectWorldGoal(initial, observed), acting = projectWorldGoal(goal, observed), assessing = projectWorldGoal(complete(), observed);
  assert.deepEqual(schemas(planning).map(item => item.decision), ['plan', 'pause']);
  assert.deepEqual(schemas(acting).map(item => item.decision), ['act', 'wait', 'pause']);
  assert.deepEqual(schemas(assessing).map(item => item.decision), ['done', 'pause']);
  assert.doesNotMatch(acting.instructions, /"decision":"plan"|"decision":"done"|"milestones"/);
  assert.doesNotMatch(assessing.instructions, /"decision":"plan"|"decision":"act"|"decision":"wait"/);
  assert.equal(planning.prompt, initial.objective);
  for (const projection of [acting, assessing]) {
    assert.equal(JSON.parse(projection.worldContext).originalObjective, initial.objective);
    assert(!projection.prompt.includes(initial.objective));
  }
  assert.deepEqual(JSON.parse(assessing.worldContext).completedMilestones.map(item => item.requestId), ['r1', 'r2']);
});

test('active action schema uses only the current observation reference and leaves missing-target wait intact', () => {
  const first = projectWorldGoal(goal, observed);
  const changed = projectWorldGoal(goal, { ...observed, participants: [...observed.participants].reverse() });
  assert.deepEqual(schemas(first)[0].intent, { type: 'approach', targetId: 'p1' });
  assert.deepEqual(schemas(changed)[0].intent, { type: 'approach', targetId: 'p2' });
  assert.equal(resolve(changed, schemas(changed)[0]).intent.targetId, 'human:nova');
  assert.throws(() => resolve(changed, schemas(first)[0]), { code: 'ERR_WORLD_GOAL_DECISION' });
  const missing = projectWorldGoal(goal, { ...observed, participants: [observed.participants[1]] });
  assert.deepEqual(schemas(missing).map(item => item.decision), ['wait', 'pause']);
  assert.equal(JSON.parse(missing.worldContext).activeMilestone.targetPresent, false);
  const wait = { decision: 'wait', reason: 'Wait for the active target to return.' };
  assert.deepEqual(resolve(missing, wait), wait);
});

test('stop milestone sees only targetless stop action schema and still rejects multiple JSON responses', () => {
  const stopGoal = { ...goal, plan: { version: 1, milestones: [milestones[0], { label: 'Stop', type: 'stop' }, milestones[1]] },
    completedMilestones: [{ index: 0, requestId: 'receipt-1' }], receipts: [complete().receipts[0]] };
  const projection = projectWorldGoal(stopGoal, observed), choices = schemas(projection);
  assert.deepEqual(choices.map(item => item.decision), ['act', 'wait', 'pause']);
  assert.deepEqual(choices[0].intent, { type: 'stop' });
  assert.doesNotMatch(projection.instructions, /"decision":"plan"|"type":"approach"|"type":"look-at"|"targetId"/);
  assert.equal(JSON.parse(projection.worldContext).completedMilestones[0].requestId, 'r1');
  assert.deepEqual(resolve(projection, choices[0]).intent, { type: 'stop' });
  const priorPlan = JSON.stringify({ decision: 'plan', milestones: [{ label: 'Visit', type: 'approach', targetId: 'p1' }] });
  assert.throws(() => projection.resolve(priorPlan + '\n' + JSON.stringify(act('p1')), { now }),
    { code: 'ERR_WORLD_GOAL_DECISION' });
  assert.throws(() => resolve(projection, act('p1')), { code: 'ERR_WORLD_GOAL_DECISION' });
});

test('saved-plan current request retains exact original objective as data and refreshes milestone references without mutation', async () => {
  const progressed = complete(); progressed.completedMilestones.pop(); progressed.receipts.pop();
  progressed.requesterId = 'human:reconnected';
  progressed.objective = 'Visit Nova, then return to me. Preserve this wording: café.';
  const senses = { ...observed, participants: [{ ...observed.participants[1], id: 'human:reconnected' }, ...observed.participants] };
  const before = structuredClone({ progressed, senses });
  let request;
  const inference = { async listCandidates() { return [candidate]; }, async generate(_selected, input) {
    request = input; return { text: JSON.stringify(act('speaker')) };
  } };
  const selected = await generateWorldGoalDecision({ inference, head: { policy: { inferenceMode: 'local-only' } },
    goal: progressed, observed: senses });
  const context = state(request);
  const expected = 'Choose act, wait, or pause for this saved current milestone only:\n'
    + JSON.stringify(context.activeMilestone) + '\nUse the current observations and return one decision JSON object.';
  assert.equal(request.prompt, expected); assert.equal(request.messages.at(-1).content, expected);
  assert.equal(context.originalObjective, progressed.objective); assert(!request.prompt.includes(progressed.objective));
  assert.equal(context.activeMilestone.index, 1); assert.equal(context.activeMilestone.targetId, 'speaker');
  assert.equal(selected.intent.targetId, 'human:reconnected');
  assert.deepEqual({ progressed, senses }, before);
  assert.equal(Object.hasOwn(progressed, 'originalObjective'), false);
});

test('assessment current request cites completed evidence against retained objective without asking for a new itinerary', async () => {
  const finished = complete(), before = structuredClone(finished);
  let request;
  const inference = { async listCandidates() { return [candidate]; }, async generate(_selected, input) {
    request = input; return { text: JSON.stringify({ decision: 'done', assessment: 'Both requested arrivals are recorded.', receiptIds: ['r1', 'r2'] }) };
  } };
  const selected = await generateWorldGoalDecision({ inference, head: { policy: { inferenceMode: 'local-only' } }, goal: finished, observed });
  const context = state(request);
  assert.equal(context.phase, 'assess'); assert.equal(context.originalObjective, finished.objective);
  assert.match(request.prompt, /^Assess the completed milestones against originalObjective/);
  assert(request.prompt.includes(JSON.stringify(context.completedMilestones)));
  assert(!request.prompt.includes(finished.objective)); assert.doesNotMatch(request.prompt, /"decision":"plan"|"intent"/);
  assert.equal(request.messages.at(-1).content, request.prompt);
  assert.deepEqual(selected.receiptIds, ['receipt-1', 'receipt-2']); assert.deepEqual(finished, before);
});
