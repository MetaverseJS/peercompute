import assert from 'node:assert/strict';
import test from 'node:test';
import * as Cesium from 'cesium';

import {
  centeredOverviewTiles,
  overviewTileWindowBounds,
  slippyTileForLocation,
} from '../../src/overview/globeMath.js';
import {
  ROADVECTOR_CAMERA_CONFIG,
  ROADVECTOR_SCALE_DISCLOSURE,
} from '../../src/view/cameraConfig.js';

function rectangleCandidateCount(location) {
  const bounds = overviewTileWindowBounds(location);
  const rectangle = Cesium.Rectangle.fromDegrees(
    bounds.west,
    bounds.south,
    bounds.east,
    bounds.north,
  );
  const scheme = new Cesium.WebMercatorTilingScheme();
  const northWest = scheme.positionToTileXY(Cesium.Rectangle.northwest(rectangle), bounds.zoom);
  const southEast = scheme.positionToTileXY(Cesium.Rectangle.southeast(rectangle), bounds.zoom);
  const count = 2 ** bounds.zoom;
  const columns = ((southEast.x - northWest.x) % count + count) % count + 1;
  const rows = southEast.y - northWest.y + 1;
  return columns * rows;
}

test('z5 road selection and Cesium rectangle stay center-out and bounded to the same tiles', () => {
  for (const location of [
    { longitude: -149.9, latitude: 61.2 },
    { longitude: 179.99, latitude: 61.2 },
    { longitude: 0, latitude: 89.9 },
    { longitude: 0, latitude: -89.9 },
  ]) {
    const center = slippyTileForLocation(location.longitude, location.latitude, 5);
    const tiles = centeredOverviewTiles(location);
    const bounds = overviewTileWindowBounds(location);
    assert.deepEqual({ x: tiles[0].x, y: tiles[0].y, z: tiles[0].z }, center);
    assert.ok(tiles.length <= 25);
    assert.equal(bounds.selectedTiles, tiles.length);
    assert.equal(rectangleCandidateCount(location), tiles.length);
    assert.ok(tiles.every((tile) => tile.x >= 0 && tile.x < 32 && tile.y >= 0 && tile.y < 32));
    assert.ok(tiles.every((tile, index) => index === 0 || tile.distance >= tiles[index - 1].distance));
  }
  assert.equal(overviewTileWindowBounds({ longitude: 179.99, latitude: 61.2 }).crossesAntimeridian, true);
});

test('local scale stays metric behind a discrete Cesium-to-ride transition', () => {
  assert.equal(ROADVECTOR_SCALE_DISCLOSURE.worldUnits, 'meters');
  assert.equal(ROADVECTOR_SCALE_DISCLOSURE.transition, 'discrete-overview-to-local');
  assert.equal(ROADVECTOR_CAMERA_CONFIG.thirdPersonFovDegrees, 60);
  assert.ok(Math.hypot(...ROADVECTOR_CAMERA_CONFIG.thirdOffsetMeters) < 5.5);
  assert.ok(ROADVECTOR_CAMERA_CONFIG.fogDensityPerMeter <= 0.001);
});
