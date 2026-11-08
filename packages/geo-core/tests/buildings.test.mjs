import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeBuildingHeight } from '../src/vector/buildings.js';

test('reported metric height wins and remains non-derived', () => {
  const value = normalizeBuildingHeight({ building: 'office', height: '22.5 m', 'building:levels': '3' });
  assert.equal(value.heightMeters, 22.5);
  assert.equal(value.heightSource, 'height');
  assert.equal(value.heightDerived, false);
});

test('reported feet, levels, and minimum levels normalize explicitly', () => {
  const feet = normalizeBuildingHeight({ building: 'warehouse', height: '40 ft', min_height: '4 ft' });
  assert.ok(Math.abs(feet.heightMeters - 12.192) < 1e-9);
  assert.ok(Math.abs(feet.baseHeightMeters - 1.2192) < 1e-9);
  const levels = normalizeBuildingHeight({ building: 'apartments', 'building:levels': '7', 'building:min_level': '2' });
  assert.equal(levels.heightMeters, 21);
  assert.equal(levels.baseHeightMeters, 6);
  assert.equal(levels.heightSource, 'building:levels');
  assert.equal(levels.heightDerived, true);
});

test('category fallback and clamps remain disclosed', () => {
  const fallback = normalizeBuildingHeight({ building: 'house' });
  assert.equal(fallback.heightMeters, 8);
  assert.equal(fallback.heightSource, 'category-default');
  const clamped = normalizeBuildingHeight({ building: 'yes', height: '900' });
  assert.equal(clamped.heightMeters, 320);
  assert.equal(clamped.heightClamped, true);
});
