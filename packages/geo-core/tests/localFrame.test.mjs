import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createLocalEnuFrame,
  ecefToGeodetic,
  geodeticToEcef,
  rebaseLocalPoint
} from '../src/geo/localFrame.js';

function close(actual, expected, tolerance, label) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} vs ${expected}`);
}

test('WGS84 geodetic and ECEF conversion round trips', () => {
  const source = { longitude: -149.9003, latitude: 61.2181, height: 37.5 };
  const ecef = geodeticToEcef(source);
  const restored = ecefToGeodetic(ecef);
  close(restored.longitude, source.longitude, 1e-9, 'longitude');
  close(restored.latitude, source.latitude, 1e-9, 'latitude');
  close(restored.height, source.height, 1e-5, 'height');
});

test('local frame uses Three-friendly east/up/south meters', () => {
  const frame = createLocalEnuFrame({ longitude: -149.9, latitude: 61.2, height: 20 });
  const east = frame.toLocal({ longitude: -149.899, latitude: 61.2, height: 20 });
  const north = frame.toLocal({ longitude: -149.9, latitude: 61.201, height: 20 });
  const up = frame.toLocal({ longitude: -149.9, latitude: 61.2, height: 30 });
  assert.ok(east[0] > 53 && east[0] < 55);
  assert.ok(Math.abs(east[2]) < 0.1);
  assert.ok(north[2] < -111 && north[2] > -112);
  assert.ok(up[1] > 9.999 && up[1] < 10.001);
  const restored = frame.fromLocal(east);
  close(restored.longitude, -149.899, 2e-9, 'local longitude');
  close(restored.latitude, 61.2, 2e-9, 'local latitude');
});

test('rebasing preserves the same physical ECEF point', () => {
  const first = createLocalEnuFrame({ longitude: -149.9, latitude: 61.2, height: 0 });
  const second = createLocalEnuFrame({ longitude: -149.89, latitude: 61.205, height: 0 });
  const local = first.toLocal({ longitude: -149.895, latitude: 61.203, height: 12 });
  const rebased = rebaseLocalPoint(local, first, second);
  const restored = second.fromLocal(rebased);
  close(restored.longitude, -149.895, 2e-9, 'rebased longitude');
  close(restored.latitude, 61.203, 2e-9, 'rebased latitude');
  close(restored.height, 12, 2e-5, 'rebased height');
});
