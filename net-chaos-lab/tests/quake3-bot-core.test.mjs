import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createDeterministicRng,
  createQuake3BotPersonality,
  createQuake3BotState,
  decideQuake3BotAction,
  normalizeQuake3Snapshot,
  rememberRecentId,
  resolveQuake3PersonalityName,
  scoreQuake3Goals
} from '../agent/quake3/index.mjs';
import { selectRouteTarget } from '../agent/quake3/navigation.mjs';

test('normalizeQuake3Snapshot filters stale peers into freshPeers and carries capabilities', () => {
  const world = normalizeQuake3Snapshot({
    gameId: 'sneakywoods',
    localPosition: { x: 0, y: 0, z: 0 },
    capabilities: { primaryAttack: true, primaryRange: 4.5 },
    peers: [
      { id: 'fresh', position: { x: 4, y: 0, z: 0 }, lastSeenAgeMs: 100 },
      { id: 'stale', position: { x: 2, y: 0, z: 0 }, lastSeenAgeMs: 24000 }
    ]
  });

  assert.equal(world.gameId, 'sneakywoods');
  assert.equal(world.peers.length, 2);
  assert.equal(world.freshPeers.length, 1);
  assert.equal(world.freshPeers[0].id, 'fresh');
  assert.equal(world.capabilities.primaryAttack, true);
  assert.equal(world.capabilities.primaryRange, 4.5);
});

test('scoreQuake3Goals prefers pickup over roaming when health is low and no enemies exist', () => {
  const state = createQuake3BotState(31);
  const world = normalizeQuake3Snapshot({
    localPosition: { x: 0, y: 0, z: 0 },
    localHealth: 0.2,
    items: [
      { id: 'medkit', kind: 'health', value: 3, position: { x: 2, y: 0, z: 0 } }
    ]
  });

  const [goal] = scoreQuake3Goals(world, state, 1000);
  assert.equal(goal.type, 'pickup');
  assert.equal(goal.target.id, 'medkit');
});

test('quake3 personality presets resolve deterministically and apply overrides', () => {
  assert.equal(resolveQuake3PersonalityName('ScAvEnGeR'), 'scavenger');
  const personality = createQuake3BotPersonality(13, {
    preset: 'scavenger',
    primaryCooldownMs: 777
  });
  assert.equal(personality.preset, 'scavenger');
  assert.equal(personality.primaryCooldownMs, 777);
  assert.ok(personality.pickupBias > 1);
});

test('scoreQuake3Goals penalizes recently visited pickups', () => {
  const state = createQuake3BotState(35, { preset: 'scavenger' });
  state.goalMemory = rememberRecentId(state.goalMemory, 'medkit-near', 5000, {
    ttlMs: state.personality.goalMemoryMs,
    maxEntries: 10
  });
  const world = normalizeQuake3Snapshot({
    localPosition: { x: 0, y: 0, z: 0 },
    localHealth: 0.2,
    items: [
      { id: 'medkit-near', kind: 'health', value: 3, position: { x: 2, y: 0, z: 0 } },
      { id: 'medkit-far', kind: 'health', value: 3, position: { x: 5, y: 0, z: 0 } }
    ]
  });

  const [goal] = scoreQuake3Goals(world, state, 5200);
  assert.equal(goal.type, 'pickup');
  assert.equal(goal.target.id, 'medkit-far');
});

test('selectRouteTarget uses nav points for far goals and avoids immediate repeats', () => {
  const rng = createDeterministicRng(99);
  const state = createQuake3BotState(99, { preset: 'skirmisher' });
  state.navMemory = rememberRecentId(state.navMemory, 'nav-left', 1000, {
    ttlMs: state.personality.routeMemoryMs,
    maxEntries: 10
  });
  const world = normalizeQuake3Snapshot({
    localPosition: { x: 0, y: 0, z: 0 },
    navPoints: [
      { id: 'nav-left', position: { x: 6, y: 0, z: 3 } },
      { id: 'nav-right', position: { x: 8, y: 0, z: -2 } }
    ]
  });

  const route = selectRouteTarget(
    world,
    state,
    { x: 30, y: 0, z: 0 },
    'goal-a',
    1400,
    rng,
    state.personality
  );

  assert.equal(route.usedNav, true);
  assert.equal(route.navPoint.id, 'nav-right');
  assert.equal(state.routeNavId, 'nav-right');
});

test('decideQuake3BotAction patrols when there are no combat targets', () => {
  const rng = createDeterministicRng(41);
  const state = createQuake3BotState(41);
  const action = decideQuake3BotAction({
    localPosition: { x: 0, y: 0, z: 0 },
    localRotation: 0,
    peers: []
  }, state, 600, rng);

  assert.equal(action.goalType, 'roam');
  assert.equal(action.mode, 'patrol');
  assert.equal(action.primary, false);
});

test('decideQuake3BotAction closes distance to a far target', () => {
  const rng = createDeterministicRng(52);
  const state = createQuake3BotState(52, {
    personality: {
      chaseRange: 15,
      preferredRange: 7
    }
  });
  const action = decideQuake3BotAction({
    localPosition: { x: 0, y: 0, z: 0 },
    localRotation: 0,
    peers: [
      { id: 'enemy', position: { x: 20, y: 0, z: 0 }, lastSeenAgeMs: 50 }
    ]
  }, state, 900, rng);

  assert.equal(action.targetId, 'enemy');
  assert.equal(action.goalType, 'combat');
  assert.equal(action.mode, 'pursue');
  assert.ok(action.forward > 0.9);
});

test('decideQuake3BotAction triggers primary attack when target is in range and aimed', () => {
  const rng = createDeterministicRng(67);
  const state = createQuake3BotState(67, {
    personality: {
      retreatRange: 2.2,
      preferredRange: 4,
      attackFov: 0.8
    }
  });
  const action = decideQuake3BotAction({
    localPosition: { x: 0, y: 0, z: 0 },
    localRotation: Math.PI / 2,
    capabilities: { primaryAttack: true, primaryRange: 3.5 },
    peers: [
      { id: 'enemy', position: { x: -2.2, y: 0, z: 0 }, lastSeenAgeMs: 10 }
    ]
  }, state, 1200, rng);

  assert.equal(action.targetId, 'enemy');
  assert.equal(action.primary, true);
  assert.ok(['strafe', 'close-in', 'retreat'].includes(action.mode));
});
