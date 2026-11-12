import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeWorldAvatarAction } from '../shared/agents/WorldAvatarAction.js';
import { normalizeWorldObjectAction } from '../shared/agents/WorldObjectAction.js';
import { normalizeWorldModelSize, worldModelScale, worldModelSizeFromManifest } from '../shared/world/WorldModelScale.js';

test('object and avatar planners share natural size defaults and honor deliberately miniature or giant sizes', () => {
  for (const normalize of [normalizeWorldAvatarAction, normalizeWorldObjectAction]) {
    const mug = normalize({ name: 'Mug', prompt: 'A plain ceramic cup' });
    const robot = normalize({ name: 'Robot', prompt: 'A friendly human-sized robot' });
    const car = normalize({ name: 'Car', prompt: 'A blue car' });
    assert(mug.size < robot.size && robot.size < car.size);
    assert.equal(normalize({ name: 'Toy car', prompt: 'A tiny toy car' }).size, 1);
    assert.equal(normalize({ name: 'Car', prompt: 'A small toy car', size: 0.5 }).size, 0.5);
    assert.equal(normalize({ name: 'Robot', prompt: 'A giant robot', size: 24 }).size, 24);
    for (const size of [NaN, Infinity, -1, 0, 0.29, 48.01, '6', null]) {
      assert.throws(() => normalize({ name: 'Car', prompt: 'A car', size }));
    }
  }
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
