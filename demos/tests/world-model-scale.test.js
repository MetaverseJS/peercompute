import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeWorldAvatarAction } from '../shared/agents/WorldAvatarAction.js';
import { normalizeWorldObjectAction } from '../shared/agents/WorldObjectAction.js';
import { normalizeWorldModelSize, normalizeWorldObjectSize, resolveWorldObjectSize,
  worldModelScale, worldModelSizeFromManifest } from '../shared/world/WorldModelScale.js';

test('object and avatar planners share natural size defaults and honor deliberately miniature or giant sizes', () => {
  for (const normalize of [normalizeWorldAvatarAction, normalizeWorldObjectAction]) {
    const mug = normalize({ name: 'Mug', prompt: 'A plain ceramic cup' });
    const robot = normalize({ name: 'Robot', prompt: 'A friendly human-sized robot' });
    const car = normalize({ name: 'Car', prompt: 'A blue car' });
    assert(mug.size < robot.size && robot.size < car.size);
    assert.equal(normalize({ name: 'Toy car', prompt: 'A tiny toy car' }).size, 1);
    assert.equal(normalize({ name: 'Car', prompt: 'A small toy car', size: 0.5 }).size, 0.5);
    assert.equal(normalize({ name: 'Robot', prompt: 'A giant robot', size: 24 }).size, 24);
    for (const size of [NaN, Infinity, -1, 0, 0.29, '6', null]) {
      assert.throws(() => normalize({ name: 'Car', prompt: 'A car', size }));
    }
  }
});
test('placed structures can be building-sized without enlarging the avatar admission limit', () => {
  assert.equal(resolveWorldObjectSize(undefined, { name: 'Castle', prompt: 'A stone fortress' }), 96);
  assert.equal(resolveWorldObjectSize(undefined, { name: 'Model', prompt: 'A large citadel' }), 96);
  assert.equal(resolveWorldObjectSize(undefined, { name: 'Castle', prompt: 'A miniature castle' }), 1);
  assert.equal(resolveWorldObjectSize(undefined, { name: 'Wrestling ring' }), 24);
  assert.equal(resolveWorldObjectSize(12, { name: 'Castle' }), 12);
  assert.equal(normalizeWorldObjectSize(96 * 10), 960);
  assert.throws(() => normalizeWorldObjectSize(1024.01));
  assert.throws(() => normalizeWorldAvatarAction({ name: 'Castle', prompt: 'A walking castle', size: 96 }));
  assert.throws(() => normalizeWorldModelSize(48.01));
  assert.equal(normalizeWorldAvatarAction({ name: 'Castle', prompt: 'A walking castle' }).size, 6);
});
test('retained scale is bounded and schema-validated; legacy mesh exports retain six-unit presentation', () => {
  assert.equal(worldModelSizeFromManifest({ provenance: {} }), 6);
  assert.equal(worldModelSizeFromManifest({ provenance: { worldScale: worldModelScale(15) } }), 15);
  assert.equal(normalizeWorldModelSize(0.3), 0.3); assert.equal(normalizeWorldModelSize(48), 48);
  for (const value of [null, [], { size: 12 }, { ...worldModelScale(12), size: 10000 },
    { ...worldModelScale(12), url: 'https://untrusted.invalid' }]) {
    assert.throws(() => worldModelSizeFromManifest({ provenance: { worldScale: value } }));
  }
});
