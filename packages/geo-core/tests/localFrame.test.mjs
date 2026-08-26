import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createEnuFrameTransform,
  createLocalEnuFrame,
  ecefToGeodetic,
  geodeticToEcef,
  rebaseLocalPoint
} from '../src/geo/localFrame.js';

function close(actual, expected, tolerance, label) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} vs ${expected}`);
}

function rotateVector(quaternion, vector) {
  const [x, y, z, w] = quaternion;
  const [vx, vy, vz] = vector;
  const tx = 2 * (y * vz - z * vy);
  const ty = 2 * (z * vx - x * vz);
  const tz = 2 * (x * vy - y * vx);
  return [
    vx + w * tx + y * tz - z * ty,
    vy + w * ty + z * tx - x * tz,
    vz + w * tz + x * ty - y * tx
  ];
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

test('ENU frame transform freezes a rigid point, vector, and orientation map with an inverse', () => {
  const from = createLocalEnuFrame({ longitude: -149.9, latitude: 61.2, height: 25 });
  const to = createLocalEnuFrame({ longitude: -149.82, latitude: 61.26, height: 130 });
  const transform = createEnuFrameTransform(from, to);
  assert.equal(transform.schema, 'peercompute.geo.enu-frame-transform.v1');
  for (const value of [
    transform,
    transform.fromOrigin,
    transform.toOrigin,
    transform.rotation,
    transform.translation,
    transform.rotationQuaternion,
    transform.inverse,
  ]) assert.equal(Object.isFrozen(value), true);
  assert.equal(transform.inverse.inverse, transform);

  const geodetic = { longitude: -149.865, latitude: 61.231, height: 412.5 };
  const sourcePoint = from.toLocal(geodetic);
  const transformedPoint = transform.transformPoint(sourcePoint);
  const expectedPoint = to.toLocal(geodetic);
  expectedPoint.forEach((expected, index) => close(
    transformedPoint[index], expected, 2e-9, `point ${index}`
  ));
  assert.equal(Object.isFrozen(transformedPoint), true);

  const sourceVector = [12.5, -3.25, 41.75];
  const transformedVector = transform.transformVector(sourceVector);
  close(Math.hypot(...transformedVector), Math.hypot(...sourceVector), 1e-12, 'vector length');
  const orientation = [0.12767944069578063, -0.14487812541736916, 0.2685358227515692, 0.943714364147489];
  const bodyVector = [0.3, -0.4, 0.8];
  const expectedWorldVector = transform.transformVector(rotateVector(orientation, bodyVector));
  const transformedOrientation = transform.transformOrientation(orientation);
  const actualWorldVector = rotateVector(transformedOrientation, bodyVector);
  expectedWorldVector.forEach((expected, index) => close(
    actualWorldVector[index], expected, 2e-15, `orientation vector ${index}`
  ));
  assert.equal(Object.isFrozen(transformedOrientation), true);

  const restoredPoint = transform.inverse.transformPoint(transformedPoint);
  const restoredVector = transform.inverse.transformVector(transformedVector);
  const restoredOrientation = transform.inverse.transformOrientation(transformedOrientation);
  sourcePoint.forEach((expected, index) => close(restoredPoint[index], expected, 2e-9, `inverse point ${index}`));
  sourceVector.forEach((expected, index) => close(restoredVector[index], expected, 2e-14, `inverse vector ${index}`));
  orientation.forEach((expected, index) => close(restoredOrientation[index], expected, 2e-15, `inverse orientation ${index}`));
});

test('ENU transform crosses the antimeridian at high latitude without a coordinate discontinuity', () => {
  const from = createLocalEnuFrame({ longitude: 179.999, latitude: 84.75, height: 85 });
  const to = createLocalEnuFrame({ longitude: -179.9985, latitude: 84.751, height: 120 });
  const transform = createEnuFrameTransform(from, to);
  const target = { longitude: -179.9994, latitude: 84.7506, height: 1_235 };
  const sourcePoint = from.toLocal(target);
  const expectedPoint = to.toLocal(target);
  const transformedPoint = transform.transformPoint(sourcePoint);
  expectedPoint.forEach((expected, index) => close(
    transformedPoint[index], expected, 2e-9, `dateline point ${index}`
  ));
  assert.ok(Math.hypot(...transform.translation) < 300);
  close(Math.hypot(...transform.rotationQuaternion), 1, 2e-15, 'dateline rotation quaternion');
});

test('repeated ENU forward/inverse transforms are deterministic and remain bounded', () => {
  const from = createLocalEnuFrame({ longitude: 179.9995, latitude: 88.5, height: 40 });
  const to = createLocalEnuFrame({ longitude: -179.9995, latitude: 88.5005, height: 55 });
  const transform = createEnuFrameTransform(from, to);
  const initialPoint = [231.25, 17.75, -94.5];
  const initialOrientation = [0.10259783520851541, 0.20519567041703082, -0.30779350562554625, 0.9233805168766387];
  const run = () => {
    let point = initialPoint;
    let orientation = initialOrientation;
    for (let index = 0; index < 1_000; index += 1) {
      point = transform.inverse.transformPoint(transform.transformPoint(point));
      orientation = transform.inverse.transformOrientation(
        transform.transformOrientation(orientation)
      );
    }
    return { point, orientation };
  };
  const first = run();
  const second = run();
  assert.deepEqual(second, first);
  initialPoint.forEach((expected, index) => close(first.point[index], expected, 2e-8, `repeated point ${index}`));
  initialOrientation.forEach((expected, index) => close(
    first.orientation[index], expected, 2e-13, `repeated orientation ${index}`
  ));
  assert.throws(
    () => transform.transformOrientation([0, 0, 0, 0]),
    /non-zero length/u,
  );
});
