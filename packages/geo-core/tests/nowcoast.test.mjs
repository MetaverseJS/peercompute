import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assessNowCoastFreshness,
  latestNowCoastTime,
  nowCoastCapabilitiesUrl,
  nowCoastDescriptor,
  parseNowCoastTimes
} from '../src/weather/nowcoast.js';

test('builds credential-free official capabilities URLs', () => {
  const descriptor = nowCoastDescriptor('noaa-radar-alaska');
  assert.equal(descriptor.layer, 'alaska_base_reflectivity_mosaic');
  const url = new URL(nowCoastCapabilitiesUrl(descriptor));
  assert.equal(url.hostname, 'nowcoast.noaa.gov');
  assert.equal(url.searchParams.get('REQUEST'), 'GetCapabilities');
  assert.throws(() => nowCoastCapabilitiesUrl({ ...descriptor, url: 'https://mirror.example/ows' }), /official/);
});

test('parses discrete and interval WMS time dimensions', () => {
  const xml = `<?xml version="1.0"?><WMS_Capabilities><Capability><Layer><Layer>
    <Name>alaska_base_reflectivity_mosaic</Name>
    <Dimension name="time">2026-08-23T11:00:00Z,2026-08-23T11:04:00Z,2026-08-23T11:08:00Z</Dimension>
  </Layer></Layer></Capability></WMS_Capabilities>`;
  const values = parseNowCoastTimes(xml, 'noaa-radar-alaska');
  assert.equal(values.length, 3);
  assert.equal(latestNowCoastTime(values), '2026-08-23T11:08:00.000Z');

  const intervalXml = `<Layer><Name>goes_longwave_imagery</Name><Extent name="time">2026-08-23T10:00:00Z/2026-08-23T11:00:00Z/PT5M</Extent></Layer>`;
  const interval = parseNowCoastTimes(intervalXml, 'noaa-goes-infrared');
  assert.deepEqual(interval[0], {
    kind: 'range',
    start: '2026-08-23T10:00:00.000Z',
    end: '2026-08-23T11:00:00.000Z',
    period: 'PT5M'
  });
});

test('fails closed when layer or time metadata drifts', () => {
  assert.throws(() => parseNowCoastTimes('<Layer><Name>other</Name></Layer>', 'noaa-radar-alaska'), /omit/);
  assert.throws(() => parseNowCoastTimes('<Layer><Name>alaska_base_reflectivity_mosaic</Name></Layer>', 'noaa-radar-alaska'), /time dimension/);
});

test('classifies current, expired, and implausibly future frames from published cadence', () => {
  const values = Object.freeze([
    Object.freeze({ kind: 'instant', value: '2026-08-23T11:08:00.000Z' })
  ]);
  const current = assessNowCoastFreshness(values, 'noaa-radar-alaska', {
    now: Date.parse('2026-08-23T11:20:00.000Z')
  });
  assert.equal(current.status, 'current');
  assert.equal(current.maximumAgeMinutes, 24);
  assert.equal(current.expiresAt, '2026-08-23T11:32:00.000Z');

  const expired = assessNowCoastFreshness(values, 'noaa-radar-alaska', {
    now: Date.parse('2026-08-23T11:32:00.001Z')
  });
  assert.equal(expired.status, 'expired');

  const future = assessNowCoastFreshness(values, 'noaa-radar-alaska', {
    now: Date.parse('2026-08-23T10:59:59.999Z')
  });
  assert.equal(future.status, 'future');
  assert.throws(
    () => assessNowCoastFreshness(values, 'noaa-radar-alaska', { now: Number.NaN }),
    /finite/
  );
});
