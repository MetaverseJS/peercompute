import assert from 'node:assert/strict';
import test from 'node:test';

import {
  RIDE_TILE_LIMITS,
  RIDE_TILE_POLAR_DISCLOSURE,
  normalizeRideTile,
  rideTileAt,
  rideTileBounds,
  rideTileCoverage,
  rideTileKey,
  rideTileNeighborhood,
  selectRideTileZoom,
} from '../src/world/rideTile.js';

test('normalizes wrapped z12-z14 ride keys without wrapping polar rows', () => {
  assert.deepEqual(normalizeRideTile({ z: 12, x: -1, y: 10 }), {
    z: 12, x: 4095, y: 10, key: '12/4095/10',
  });
  assert.equal(rideTileKey({ z: 14, x: 16_384, y: 20 }), '14/0/20');
  assert.throws(() => normalizeRideTile({ z: 11, x: 0, y: 0 }), /between 12 and 14/);
  assert.throws(() => normalizeRideTile({ z: 12, x: 0, y: -1 }), /outside/);
  assert.throws(() => normalizeRideTile({ z: 12, x: 0, y: 4096 }), /outside/);
});

test('selects physically bounded adaptive zoom and discloses unsupported polar caps', () => {
  assert.equal(selectRideTileZoom(0), 14);
  assert.equal(selectRideTileZoom(61.2181), 14);
  assert.equal(selectRideTileZoom(85), 12);
  assert.equal(rideTileCoverage({ longitude: 540, latitude: 61 }).longitude, -180);
  const polar = rideTileCoverage({ longitude: 0, latitude: 89 });
  assert.equal(polar.supported, false);
  assert.equal(polar.reason, 'polar-source-coverage-unavailable');
  assert.strictEqual(polar.disclosure, RIDE_TILE_POLAR_DISCLOSURE);
  assert.equal(RIDE_TILE_POLAR_DISCLOSURE.behavior, 'unsupported-not-clamped');
  assert.throws(
    () => rideTileAt({ longitude: 0, latitude: 89 }),
    (error) => error.code === 'ERR_RIDE_TILE_POLAR_UNSUPPORTED',
  );
});

test('enumerates deterministic bounded neighborhoods across the antimeridian', () => {
  const center = rideTileAt({ longitude: -180, latitude: 0, zoom: 12 });
  assert.equal(center.x, 0);
  const active = rideTileNeighborhood(center, { radius: RIDE_TILE_LIMITS.activeRadius });
  const desired = rideTileNeighborhood(center, { radius: RIDE_TILE_LIMITS.desiredRadius });
  assert.deepEqual(active[0], center);
  assert.equal(active.length, RIDE_TILE_LIMITS.maximumActiveTiles);
  assert.equal(desired.length, RIDE_TILE_LIMITS.maximumDesiredTiles);
  assert.equal(new Set(desired.map((tile) => tile.key)).size, desired.length);
  assert.ok(active.some((tile) => tile.x === 4095));
  assert.ok(active.some((tile) => tile.x === 1));
});

test('adjacent wrapped tile bounds publish one exact shared meridian', () => {
  const west = rideTileBounds({ z: 12, x: 4094, y: 2048 });
  const east = rideTileBounds({ z: 12, x: 4095, y: 2048 });
  assert.equal(west.east, east.west);
  assert.equal(west.north, east.north);
  assert.equal(west.south, east.south);
  const matrixStart = rideTileBounds({ z: 12, x: 0, y: 2048 });
  assert.equal(east.east, 180);
  assert.equal(matrixStart.west, -180);
});
