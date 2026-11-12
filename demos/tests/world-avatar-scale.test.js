import test from 'node:test';
import assert from 'node:assert/strict';
import { referenceAvatarHeight, referenceAvatarSize } from '../shared/agents/WorldAvatarScale.js';
import { worldModelSizeForHeight } from '../shared/world/WorldModelScale.js';

test('reference avatars default to two cubes tall, with bounded physical-description hints', () => {
  for (const text of ['', 'Looks like Skeletor.', 'A robot with small eyes and a giant sword.']) assert.equal(referenceAvatarHeight(text), 12);
  assert.equal(referenceAvatarHeight('A miniature blue robot.'), 3);
  assert.equal(referenceAvatarHeight('A giant skeleton in armor.'), 24);
  assert.equal(referenceAvatarHeight('A short humanoid.'), 9);
  assert.equal(referenceAvatarHeight('A tall copper android.'), 15);
  assert.equal(referenceAvatarHeight('An armored figure, 18 world units tall.'), 18);
  assert.throws(() => referenceAvatarHeight('A figure 100 world units tall.'));
  assert.throws(() => referenceAvatarHeight(null));
});
test('height converts to persisted extent without distorting wide meshes or changing bytes', () => {
  const bounds = { min: [-2, -1, -.5], max: [2, 1, .5] }, mesh = { bounds };
  assert.equal(referenceAvatarSize(mesh, ''), 24);
  assert.equal(referenceAvatarSize(mesh, 'A giant skeleton'), 48);
  assert.deepEqual(bounds, { min: [-2, -1, -.5], max: [2, 1, .5] });
  assert.equal(worldModelSizeForHeight({ min: [0, 0, 0], max: [1, 2, 1] }, 12), 12);
  for (const invalid of [null, { min: [0,0,0], max: [1,0,1] }, { min: [0,0,0], max: [1,NaN,1] },
    { min: [0,0,0], max: [-1,2,1] }, { min: [0,0,0], max: [100,1,1] }]) {
    assert.throws(() => worldModelSizeForHeight(invalid, 12));
  }
});
