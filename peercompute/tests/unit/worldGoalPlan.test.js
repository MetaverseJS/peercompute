import test from 'node:test';
import assert from 'node:assert/strict';
import { WORLD_GOAL_PLAN_LIMITS, normalizeWorldGoalPlan, activeWorldGoalMilestone,
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
