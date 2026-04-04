import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildKeyboardBehaviorPlan,
  createCubechatArenaState,
  createDeterministicRng,
  decideCubechatArenaAction,
  resolveSimulationProfile
} from '../agent/player-behavior-harness.mjs';

test('resolveSimulationProfile infers cubechat from URL when auto', () => {
  assert.equal(
    resolveSimulationProfile('auto', 'https://demos.peercompute.test/cubechat/?e2e=1'),
    'cubechat'
  );
  assert.equal(
    resolveSimulationProfile('', 'https://demos.peercompute.test/netviz/'),
    'none'
  );
});

test('buildKeyboardBehaviorPlan creates repeated arena phases inside requested budget', () => {
  const plan = buildKeyboardBehaviorPlan('hyperborea', { durationMs: 1800, seed: 7 });
  assert.ok(plan.length >= 6);
  assert.equal(plan[0].kind, 'click');
  assert.ok(plan.some((step) => step.label === 'jump-peek'));
  const holdBudget = plan.reduce((total, step) => total + (step.ms || 0), 0);
  assert.ok(holdBudget >= 1800);
});

test('cubechat arena bot patrols when no fresh targets exist', () => {
  const rng = createDeterministicRng(11);
  const state = createCubechatArenaState(11);
  const action = decideCubechatArenaAction({
    localPosition: { x: 0, z: 0 },
    localRotation: 0,
    peers: []
  }, state, 500, rng);

  assert.equal(action.mode, 'patrol');
  assert.ok(action.forward > 0);
  assert.equal(action.targetId, null);
  assert.equal(action.goalType, 'roam');
});

test('cubechat arena bot pursues distant targets before orbiting', () => {
  const rng = createDeterministicRng(17);
  const state = createCubechatArenaState(17);
  state.personality.chaseRange = 14;
  state.personality.preferredRange = 8;
  const action = decideCubechatArenaAction({
    localPosition: { x: 0, z: 0 },
    localRotation: 0,
    peers: [
      {
        id: 'peer-far',
        position: { x: 18, z: 0 },
        lastSeenAgeMs: 100
      }
    ]
  }, state, 800, rng);

  assert.equal(action.mode, 'pursue');
  assert.equal(action.targetId, 'peer-far');
  assert.equal(action.goalType, 'combat');
  assert.ok(action.forward >= 0.95);
  assert.ok(Math.abs(action.strafe) > 0);
});

test('cubechat arena bot evades very close targets and can flip strafe after timer', () => {
  const rng = createDeterministicRng(22);
  const state = createCubechatArenaState(22);
  state.personality.retreatRange = 6;
  state.nextStrafeFlipAt = 0;
  const action = decideCubechatArenaAction({
    localPosition: { x: 0, z: 0 },
    localRotation: 0.2,
    peers: [
      {
        id: 'peer-close',
        position: { x: 2, z: -3 },
        lastSeenAgeMs: 50
      }
    ]
  }, state, 2000, rng);

  assert.equal(action.targetId, 'peer-close');
  assert.equal(action.goalType, 'combat');
  assert.ok(['retreat', 'strafe', 'close-in'].includes(action.mode));
  assert.ok(action.strafe !== 0);
  assert.ok(state.nextStrafeFlipAt > 2000);
});
