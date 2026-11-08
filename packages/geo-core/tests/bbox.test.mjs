import assert from 'node:assert/strict';
import test from 'node:test';

import {
  bboxFromCenter,
  haversineDistanceMeters,
  measureBbox,
  normalizeBbox,
  pointWithinBbox,
  snapBboxOutward
} from '../src/geo/bbox.js';

test('normalizes bounded non-wrapping WGS84 regions', () => {
  const bbox = normalizeBbox('61,-150,61.02,-149.96');
  assert.deepEqual(bbox, [61, -150, 61.02, -149.96]);
  const measurement = measureBbox(bbox);
  assert.ok(measurement.widthKm > 2 && measurement.widthKm < 2.3);
  assert.ok(measurement.heightKm > 2.2 && measurement.heightKm < 2.3);
  assert.ok(measurement.areaKm2 > 4.5 && measurement.areaKm2 < 5.3);
});

test('rejects inverted, wrapping, oversized, and out-of-range regions', () => {
  assert.throws(() => normalizeBbox([1, 0, 0, 1]), /south/);
  assert.throws(() => normalizeBbox([0, 170, 1, -170]), /antimeridian/);
  assert.throws(() => normalizeBbox([-91, 0, 1, 1]), /WGS84/);
  assert.throws(() => normalizeBbox([60, -150, 61, -149]), /8 km/);
  assert.throws(() => normalizeBbox([0, 0, 0.07, 0.07], { maxAxisKm: 10, maxAreaKm2: 40 }), /40 km²/);
});

test('derives, snaps, and queries a center-radius region', () => {
  const bbox = bboxFromCenter({ longitude: -149.9, latitude: 61.2 }, 1_800);
  const measured = measureBbox(bbox);
  assert.ok(Math.abs(measured.widthKm - 3.6) < 0.02);
  assert.ok(Math.abs(measured.heightKm - 3.6) < 0.02);
  assert.equal(pointWithinBbox([-149.9, 61.2], bbox), true);
  assert.equal(pointWithinBbox([-140, 61.2], bbox), false);
  const snapped = snapBboxOutward(bbox, 0.01);
  assert.ok(snapped[0] <= bbox[0] && snapped[1] <= bbox[1]);
  assert.ok(snapped[2] >= bbox[2] && snapped[3] >= bbox[3]);
});

test('haversine distance follows a known one-degree meridian span', () => {
  const distance = haversineDistanceMeters([0, 0], [0, 1]);
  assert.ok(Math.abs(distance - 111_195) < 10);
});
