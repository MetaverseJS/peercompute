import test from 'node:test';
import assert from 'node:assert/strict';
import { WORLD_GOAL_PLAN_LIMITS, normalizeWorldGoalPlan, normalizeWorldGoalPosition, activeWorldGoalMilestone,
  worldGoalMilestoneMatchesAction, worldGoalMilestonesComplete } from '../../src/peercompute/agents/WorldGoalPlan.js';

const visit = { label: 'Visit Nova', type: 'approach', targetId: 'nova' };
const planOf = (...milestones) => ({ version: 1, milestones });
const goalOf = (plan = planOf(visit)) => ({ plan, completedMilestones: [], receipts: [], requesterId: 'original-owner' });
const arrived = (requestId, targetId = 'nova', type = 'approach') => ({ requestId, type, targetId, status: 'arrived', at: 100000 });

test('bounded plans retain detached ordered milestones, exact identities and explicit requester roles', () => {
  const plan = planOf(visit, { label: 'Return to owner', type: 'approach', targetRole: 'requester' },
    { label: 'Face Nova', type: 'look-at', targetId: 'nova' }, { label: 'Hold position', type: 'stop' });
  const normalized = normalizeWorldGoalPlan(plan);
  assert.deepEqual(normalized, plan); assert.notEqual(normalized, plan); assert.notEqual(normalized.milestones[0], visit);
  normalized.milestones[0].targetId = 'another'; assert.equal(visit.targetId, 'nova');
  assert.deepEqual(WORLD_GOAL_PLAN_LIMITS, { maxMilestones: 6, maxLabelBytes: 64 });
  for (const targetId of ['p1', 'speaker', 'requester', 'self', 'owner:exact-network-identity']) {
    assert.equal(normalizeWorldGoalPlan(planOf({ ...visit, targetId })).milestones[0].targetId, targetId);
  }
  assert.equal(normalizeWorldGoalPlan(planOf({ ...visit, label: '😀'.repeat(16) })).milestones[0].label.length, 32);
});

test('plans reject oversized, ambiguous, unsupported and hostile fields before persistence', () => {
  const sparse = new Array(1); sparse.hidden = visit;
  for (const value of [null, {}, { version: 2, milestones: [visit] }, planOf(), planOf(...Array(7).fill(visit)),
    { ...planOf(visit), injected: true }, { version: 1, milestones: sparse },
    planOf({ ...visit, label: '😀'.repeat(17) }), planOf({ ...visit, label: '\ud800' }), planOf({ ...visit, label: 'bad\0text' }),
    planOf({ ...visit, targetId: '' }), planOf({ ...visit, targetId: 'x'.repeat(321) }), planOf({ ...visit, type: 'follow' }),
    planOf({ ...visit, targetRole: 'requester' }), planOf({ label: 'No target', type: 'approach' }),
    planOf({ label: 'Bad role', type: 'approach', targetRole: 'visitor' }), planOf({ ...visit, type: 'stop' }),
    planOf({ ...visit, stopDistance: 10 }), planOf({ ...visit, progress: 1 }),
    planOf(Object.assign(Object.create({ hidden: true }), visit)), planOf({ ...visit, [Symbol('hidden')]: true })]) {
    assert.throws(() => normalizeWorldGoalPlan(value), TypeError);
  }
});

test('active actions require the ordered milestone index, exact type and currently resolved target', () => {
  const goal = goalOf(planOf(visit, { label: 'Return', type: 'approach', targetRole: 'requester' }));
  assert.deepEqual(activeWorldGoalMilestone(goal), { index: 0, milestone: visit, intent: { type: 'approach', targetId: 'nova' } });
  assert.equal(worldGoalMilestoneMatchesAction(goal, { milestoneIndex: 0, intent: { type: 'approach', targetId: 'nova', stopDistance: 12 } }), true);
  for (const action of [{ milestoneIndex: 1, intent: { type: 'approach', targetId: 'nova' } },
    { milestoneIndex: 0, intent: { type: 'look-at', targetId: 'nova' } }, { milestoneIndex: 0, intent: { type: 'approach', targetId: 'other' } },
    { intent: { type: 'approach', targetId: 'nova' } }, null]) assert.equal(worldGoalMilestoneMatchesAction(goal, action), false);
  goal.completedMilestones.push({ index: 0, requestId: 'visit' }); goal.receipts.push(arrived('visit'));
  assert.equal(activeWorldGoalMilestone(goal).intent.targetId, 'original-owner');
  goal.requesterId = 'resumed-owner';
  assert.equal(activeWorldGoalMilestone(goal).intent.targetId, 'resumed-owner');
  assert.equal(worldGoalMilestonesComplete(goal), false);
});

test('complete progress requires contiguous distinct successful receipt evidence with exact action semantics', () => {
  const goal = goalOf(planOf(visit, { label: 'Visit Nova again', type: 'approach', targetId: 'nova' }));
  goal.receipts = [arrived('one'), arrived('two')];
  goal.completedMilestones = [{ index: 0, requestId: 'one' }, { index: 1, requestId: 'two' }];
  assert.equal(worldGoalMilestonesComplete(goal), true); assert.equal(activeWorldGoalMilestone(goal), null);
  const variants = [
    { completedMilestones: [{ index: 0, requestId: 'one' }, { index: 1, requestId: 'one' }] },
    { completedMilestones: [{ index: 1, requestId: 'one' }] },
    { completedMilestones: [{ index: 0, requestId: 'one', forged: true }, { index: 1, requestId: 'two' }] },
    { receipts: [arrived('one')] }, { receipts: [arrived('one'), arrived('two'), arrived('two')] },
    { receipts: [arrived('one'), arrived('two', 'other')] }, { receipts: [arrived('one'), arrived('two', 'nova', 'look-at')] },
    { receipts: [arrived('one'), { ...arrived('two'), status: 'blocked' }] }
  ];
  for (const patch of variants) {
    assert.equal(worldGoalMilestonesComplete({ ...goal, ...patch }), false);
    assert.equal(activeWorldGoalMilestone({ ...goal, ...patch }), null);
  }
  assert.equal(worldGoalMilestonesComplete({ ...goal, plan: null }), false);
  assert.equal(worldGoalMilestonesComplete({ ...goal, completedMilestones: [] }), false);
});

test('historical requester receipts retain identity through Resume and stop requires stopped without a target', () => {
  const goal = goalOf(planOf({ label: 'Return', type: 'approach', targetRole: 'requester' }, { label: 'Stop', type: 'stop' }));
  goal.completedMilestones = [{ index: 0, requestId: 'return' }]; goal.receipts = [arrived('return', 'original-owner')];
  goal.requesterId = 'new-owner';
  assert.deepEqual(activeWorldGoalMilestone(goal).intent, { type: 'stop' });
  assert.equal(worldGoalMilestoneMatchesAction(goal, { milestoneIndex: 1, intent: { type: 'stop' } }), true);
  assert.equal(worldGoalMilestoneMatchesAction(goal, { milestoneIndex: 1, intent: { type: 'stop', targetId: 'new-owner' } }), false);
  goal.completedMilestones.push({ index: 1, requestId: 'stop' }); goal.receipts.push({ requestId: 'stop', type: 'stop', status: 'stopped' });
  assert.equal(worldGoalMilestonesComplete(goal), true);
  goal.receipts[1].status = 'arrived'; assert.equal(worldGoalMilestonesComplete(goal), false);
  goal.receipts[1].status = 'stopped'; goal.receipts[1].targetId = 'new-owner'; assert.equal(worldGoalMilestonesComplete(goal), false);
});

const destination = [140, 4, -20];
const step = { label: 'Explore the clearing', type: 'move-to', position: destination };
const goalFor = (...milestones) => ({ plan: { version: 1, milestones }, completedMilestones: [], receipts: [], requesterId: 'human:owner' });

test('spatial milestones resolve to fixed detached destinations alongside existing participant milestones', () => {
  const goal = goalFor(step, { label: 'Return to owner', type: 'approach', targetRole: 'requester' });
  const normalized = normalizeWorldGoalPlan(goal.plan);
  assert.deepEqual(normalized, goal.plan);
  normalized.milestones[0].position[0] = 99;
  assert.equal(destination[0], 140);
  const active = activeWorldGoalMilestone(goal);
  assert.deepEqual(active, { index: 0, milestone: step, intent: { type: 'move-to', position: destination } });
  active.intent.position[0] = 88;
  assert.equal(activeWorldGoalMilestone(goal).intent.position[0], 140);
  assert.equal(worldGoalMilestoneMatchesAction(goal, { milestoneIndex: 0, intent: { type: 'move-to', position: [...destination], stopDistance: 8 } }), true);
  for (const intent of [{ type: 'move-to', position: [139, 4, -20] }, { type: 'move-to', position: destination, targetId: 'human:owner' },
    { type: 'approach', targetId: 'human:owner' }]) {
    assert.equal(worldGoalMilestoneMatchesAction(goal, { milestoneIndex: 0, intent }), false);
  }
});

test('fixed positions reject sparse, oversized, nonnumeric and hidden coordinates', () => {
  const sparse = []; sparse.length = 3; sparse[0] = 1; sparse[2] = 3;
  const hidden = [1, 2, 3]; Object.defineProperty(hidden, 'hidden', { value: true });
  const inherited = Object.setPrototypeOf([1, NaN, 3], { some: () => false });
  for (const value of [sparse, hidden, inherited, new Float32Array([1, 2, 3]), [1, 2], [1, 2, 3, 4], [1, NaN, 3],
    [1, Infinity, 3], [1, '2', 3], [1, null, 3], [1, 1e8 + 1, 3], Object.assign([1, 2, 3], { [Symbol('extra')]: true })]) {
    assert.throws(() => normalizeWorldGoalPosition(value), /three bounded coordinates/);
    assert.throws(() => normalizeWorldGoalPlan({ version: 1, milestones: [{ ...step, position: value }] }));
  }
  const input = [1e8, 0, -1e8], copy = normalizeWorldGoalPosition(input);
  assert.deepEqual(copy, input); assert.notEqual(copy, input);
});

test('point and participant targets cannot be mixed or inferred from ambiguous fields', () => {
  for (const milestone of [{ ...step, targetId: 'nova' }, { ...step, targetRole: 'requester' },
    { label: 'Missing point', type: 'move-to' }, { ...step, type: 'stop' },
    { ...step, type: 'approach', targetId: 'nova' }, { ...step, type: 'look-at', targetRole: 'requester' }]) {
    assert.throws(() => normalizeWorldGoalPlan({ version: 1, milestones: [milestone] }));
  }
});

test('point progress requires one exact destination receipt with measured position', () => {
  const goal = goalFor(step);
  goal.completedMilestones = [{ index: 0, requestId: 'outbound' }];
  const receipt = { requestId: 'outbound', type: 'move-to', status: 'arrived', targetPosition: [...destination], position: [140, 7, -20] };
  for (const invalid of [{ ...receipt, targetPosition: [140, 4, -19] }, { ...receipt, status: 'blocked' },
    { ...receipt, position: undefined }, { ...receipt, targetId: 'nova' }]) {
    goal.receipts = [invalid]; assert.equal(worldGoalMilestonesComplete(goal), false);
  }
  goal.receipts = [receipt]; assert.equal(worldGoalMilestonesComplete(goal), true);
  goal.receipts.push({ ...receipt }); assert.equal(worldGoalMilestonesComplete(goal), false);
});
