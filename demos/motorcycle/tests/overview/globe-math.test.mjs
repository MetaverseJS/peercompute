import assert from 'node:assert/strict';
import test from 'node:test';

import {
  centeredOverviewTiles,
  overviewCameraPose,
  slippyTileForLocation,
  wgs84ToOverviewCartesian,
} from '../../src/overview/globeMath.js';
import {
  ROADVECTOR_CAMERA_CONFIG,
  ROADVECTOR_SCALE_DISCLOSURE,
} from '../../src/view/cameraConfig.js';

test('hemisphere projection and north-up camera are finite at cardinal locations', () => {
  assert.deepEqual(wgs84ToOverviewCartesian(0, 0, 10), [0, 0, 10]);
  const east = wgs84ToOverviewCartesian(90, 0, 10);
  assert.ok(Math.abs(east[0] - 10) < 1e-9);
  assert.ok(Math.abs(east[1]) < 1e-9);
  assert.ok(Math.abs(east[2]) < 1e-9);
  const pose = overviewCameraPose({ longitude: -149.9, latitude: 61.2 });
  assert.ok([...pose.position, ...pose.up, ...pose.target].every(Number.isFinite));
  assert.ok(Math.abs(Math.hypot(...pose.up) - 1) < 1e-9);
  assert.ok(Math.abs(pose.position.reduce((sum, value, index) => sum + value * pose.up[index], 0)) < 1e-9,
    'camera north vector must remain tangent to the globe');
});

test('z5 road selection wraps longitude, stays center-out, and never exceeds 25 tiles', () => {
  const center = slippyTileForLocation(179.99, 61.2, 5);
  const tiles = centeredOverviewTiles({ longitude: 179.99, latitude: 61.2 });
  assert.equal(tiles.length, 25);
  assert.deepEqual({ x: tiles[0].x, y: tiles[0].y, z: tiles[0].z }, center);
  assert.ok(tiles.every((tile) => tile.x >= 0 && tile.x < 32 && tile.y >= 0 && tile.y < 32));
  assert.ok(tiles.some((tile) => tile.x === 0), 'dateline tile window must wrap instead of escaping the pyramid');
  assert.ok(tiles.every((tile, index) => index === 0 || tile.distance >= tiles[index - 1].distance));
});

test('local scale config stays metric while the overview transition is explicit', () => {
  assert.equal(ROADVECTOR_SCALE_DISCLOSURE.worldUnits, 'meters');
  assert.equal(ROADVECTOR_SCALE_DISCLOSURE.transition, 'discrete-overview-to-local');
  assert.equal(ROADVECTOR_CAMERA_CONFIG.thirdPersonFovDegrees, 60);
  assert.ok(Math.hypot(...ROADVECTOR_CAMERA_CONFIG.thirdOffsetMeters) < 5.5);
  assert.ok(ROADVECTOR_CAMERA_CONFIG.fogDensityPerMeter <= 0.001);
});
