import test from 'node:test';
import assert from 'node:assert/strict';
import { worldSpatialLocations, normalizeWorldObjectTarget, resolveWorldObjectTarget, validateWorldObjectTarget } from '../shared/agents/WorldSpatialReferences.js';
import { projectWorldGoal } from '../shared/agents/WorldGoalDecision.js';
import { projectWorldIntentRequest } from '../shared/agents/WorldIntentDecision.js';

const sensed = () => ({ observedAt: Date.now(), self: { id: 'resident:owner:ada', position: [0, 3, 0] },
  spatial: { frame: 'planar-xz', bounds: { min: [-500, -500], max: [500, 500] }, maximumLegDistance: 160 },
  locations: [{ id: 'knowledge:castle', name: 'Castle hill', position: [96, 3, 0], knowledgeId: 'castle', knowledgeRevision: 4 },
    { id: 'ground:32:0', name: 'Near clearing', position: [32, 3, 0] }],
  requesterId: 'human:owner', participants: [{ id: 'human:owner', name: 'Owner', kind: 'human', position: [10, 3, 0] }] });
const action = { name: 'Castle', prompt: 'One castle', size: 40 };

test('navigation and placement expose identical grounded locations without leaking durable identities', () => {
  const observed = sensed(), goal = { objective: 'Go far away', requesterId: observed.requesterId, steps: 0, limits: { maxSteps: 8 } };
  const navigation = projectWorldGoal(goal, observed);
  const placement = projectWorldIntentRequest('Build a castle far away', observed, { allowObject: true, allowPlacement: true });
  assert.deepEqual(JSON.parse(placement.worldContext).locations, JSON.parse(navigation.worldContext).locations);
  assert.doesNotMatch(placement.worldContext, /knowledge:castle|knowledgeRevision|human:owner/);
  assert.deepEqual(worldSpatialLocations(observed)[0], { id: 'l1', sourceId: 'knowledge:castle', name: 'Castle hill',
    position: [96, 3, 0], knowledgeId: 'castle', knowledgeRevision: 4 });
  const output = placement.resolve(JSON.stringify({ object: { ...action, placement: { locationId: 'l1' } } }));
  assert.deepEqual(output.object, action);
  assert.deepEqual(output.placementTarget, { kind: 'location', id: 'knowledge:castle', position: [96, 3, 0],
    observedAt: observed.observedAt, knowledgeId: 'castle', knowledgeRevision: 4 });
  observed.locations[0].position[0] = 17;
  assert.equal(placement.resolve(JSON.stringify({ object: { ...action, placement: { locationId: 'l1' } } })).placementTarget.position[0], 96);
});

test('speaker and pN resolve authenticated observed identities, never names or coordinates', () => {
  const observed = sensed(); observed.participants.push({ id: 'resident:peer:sam', name: 'Sam', position: [20, 3, 0] });
  const projected = projectWorldIntentRequest('Build beside Sam', observed, { allowObject: true, allowPlacement: true });
  for (const [targetId, id] of [['speaker', 'human:owner'], ['p2', 'resident:peer:sam']]) {
    const output = projected.resolve(JSON.stringify({ object: { ...action, placement: { targetId } } }));
    assert.deepEqual(output.placementTarget, { kind: 'participant', id, observedAt: observed.observedAt });
  }
  for (const placement of [{ targetId: 'Sam' }, { targetId: 'human:owner' }, { targetId: 'p3' },
    { locationId: 'l3' }, { locationId: 'origin' }, { position: [100, 3, 0] }, {},
    { locationId: 'l1', targetId: 'speaker' }, { locationId: 'l1', position: [100, 3, 0] }]) {
    assert.throws(() => projected.resolve(JSON.stringify({ object: { ...action, placement } })), { code: 'ERR_WORLD_INTENT_DECISION' });
  }
});

test('stale observations, unauthorised tools, unsupported adapters and malformed target evidence fail closed', () => {
  const observed = sensed(), raw = JSON.stringify({ object: { ...action, placement: { locationId: 'l1' } } });
  for (const options of [{}, { allowObject: true }, { allowPlacement: true }]) {
    assert.throws(() => projectWorldIntentRequest('Place castle', observed, options).resolve(raw));
  }
  const projection = projectWorldIntentRequest('Place castle', observed, { allowObject: true, allowPlacement: true });
  assert.throws(() => projection.resolve(raw, { now: observed.observedAt + 120001 }));
  assert.throws(() => projection.resolve(raw, { now: observed.observedAt - 1 }));
  const target = resolveWorldObjectTarget({ locationId: 'l1' }, { observed });
  for (const change of [{ position: [1, 3, 0] }, { knowledgeRevision: 3 }, { id: 'invented' }, { observedAt: observed.observedAt - 1 }]) {
    assert.throws(() => validateWorldObjectTarget({ ...target, ...change }, { observed }));
  }
  for (const value of [null, {}, { ...target, extra: true }, { ...target, position: [NaN, 3, 0] },
    { ...target, knowledgeRevision: undefined }, { kind: 'participant', id: 'human:owner', observedAt: NaN }]) {
    assert.throws(() => normalizeWorldObjectTarget(value));
  }
  const malformed = sensed(); malformed.locations.push(malformed.locations[0]);
  assert.throws(() => worldSpatialLocations(malformed));
});

test('untargeted objects retain the original nearby action shape', () => {
  const projected = projectWorldIntentRequest('Build a mug', sensed(), { allowObject: true, allowPlacement: true });
  assert.deepEqual(projected.resolve(JSON.stringify({ object: action })), { object: action });
});
