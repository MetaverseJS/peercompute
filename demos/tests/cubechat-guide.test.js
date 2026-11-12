import test from 'node:test';
import assert from 'node:assert/strict';
import { cubeGuidePreset, CUBECHAT_GUIDE_FACTS } from '../cubechat/src/agents/cubeGuide.js';
import { normalizeAgentEmbodiments, normalizePublicAgent } from '../../peercompute/src/peercompute/agents/WorldAgentContracts.js';

test('personal guide has owner-targeted welcome and private owner co-creation enabled', () => {
  const guide = cubeGuidePreset('cubechat:room');
  assert.equal(guide.standingGoal.target, 'owner');
  assert.equal(guide.standingGoal.enabled, true);
  assert.equal(guide.selfModifiable, true);
  assert.equal(guide.respondToWorldChat, true);
  assert.equal(guide.movement, 'self-directed');
  assert.equal(guide.sharePrivateMemories, false);
  assert.match(guide.instructions, /one short question at a time/);
  assert.match(guide.instructions, /not a generated cube image/);
  assert.doesNotMatch(guide.instructions, /WASD/);
  assert.match(CUBECHAT_GUIDE_FACTS.join(' '), /WASD/);
  assert.notEqual(guide.key, cubeGuidePreset('cubechat:another').key);
});

test('standing objectives and self modification validate privately, never leak in body directory', () => {
  const guide = cubeGuidePreset('cubechat:room');
  const input = { ...guide, worldId: 'cubechat:room', position: [0, 0, 0], color: '#8fffd4' };
  const [binding] = normalizeAgentEmbodiments([input]);
  assert.deepEqual(binding.standingGoal, guide.standingGoal);
  assert.equal(binding.selfModifiable, true);
  const publicBody = normalizePublicAgent({ ...binding, agentId: 'guide', name: 'Guide', status: 'idle' });
  assert.equal(Object.hasOwn(publicBody, 'standingGoal'), false);
  assert.equal(Object.hasOwn(publicBody, 'selfModifiable'), false);
  for (const invalid of [{ ...guide.standingGoal, objective: 'x'.repeat(2049) }, { ...guide.standingGoal, target: 'anyone' },
    { ...guide.standingGoal, enabled: 'yes' }, { ...guide.standingGoal, execute: 'code' }]) {
    assert.throws(() => normalizeAgentEmbodiments([{ ...input, standingGoal: invalid }]));
  }
  assert.throws(() => normalizeAgentEmbodiments([{ ...input, selfModifiable: 'yes' }]));
});
