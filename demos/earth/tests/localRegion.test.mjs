import assert from 'node:assert/strict';
import test from 'node:test';

import {
  formatLocalProvenance,
  localRegionBbox,
  localScenePresentation,
  localSourceSnapshot,
  requestLocalRegionWithNarrowing
} from '../src/localRegion.js';

const SIGNAL = new AbortController().signal;

function codedError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

function staleEnvelope() {
  return {
    status: 'stale',
    fetchedAt: '2026-08-22T12:00:00.000Z',
    staleAt: '2026-08-22T18:00:00.000Z',
    notes: ['A previously verified cached region was served after an upstream refresh failure.'],
    cache: { state: 'stale-on-error' },
    provenance: {
      providerMode: 'configured',
      sourceBaseTimestamp: '2026-08-22T11:59:30.000Z',
      attribution: '© OpenStreetMap contributors',
      licenseUrl: 'https://opendatacommons.org/licenses/odbl/1-0/'
    }
  };
}

test('narrows only through the bounded 1200/800/500 metre density policy', async () => {
  const requests = [];
  const events = [];
  const envelope = { status: 'current' };
  const responses = [
    codedError('REGION_RESULT_LIMIT_EXCEEDED'),
    codedError('ERR_GEODATA_RESPONSE_TOO_LARGE'),
    envelope
  ];
  const result = await requestLocalRegionWithNarrowing({
    geodata: {
      async osmRegion(request) {
        requests.push(request);
        const response = responses.shift();
        if (response instanceof Error) throw response;
        return response;
      }
    },
    location: { longitude: -149.9, latitude: 61.2 },
    signal: SIGNAL,
    bboxForRadius: (_location, radius) => [radius, radius + 1, radius + 2, radius + 3],
    onAttempt: (event) => events.push(event)
  });
  assert.equal(result.envelope, envelope);
  assert.equal(result.radiusMeters, 500);
  assert.deepEqual(result.attemptedRadii, [1_200, 800, 500]);
  assert.deepEqual(requests.map((request) => request.bbox[0]), [1_200, 800, 500]);
  assert.ok(requests.every((request) => request.signal === SIGNAL));
  assert.deepEqual(events.map(({ radiusMeters, narrowed }) => ({ radiusMeters, narrowed })), [
    { radiusMeters: 1_200, narrowed: false },
    { radiusMeters: 800, narrowed: true },
    { radiusMeters: 500, narrowed: true }
  ]);
});

test('does not retry non-density failures or continue below the 500 metre floor', async () => {
  let calls = 0;
  await assert.rejects(() => requestLocalRegionWithNarrowing({
    geodata: { async osmRegion() { calls += 1; throw codedError('UPSTREAM_FETCH_FAILED'); } },
    location: { longitude: 0, latitude: 0 },
    bboxForRadius: (_location, radius) => [0, 0, radius, radius]
  }), (error) => error.code === 'UPSTREAM_FETCH_FAILED');
  assert.equal(calls, 1);

  calls = 0;
  await assert.rejects(() => requestLocalRegionWithNarrowing({
    geodata: { async osmRegion() { calls += 1; throw codedError('REGION_RESPONSE_LIMIT_EXCEEDED'); } },
    location: { longitude: 0, latitude: 0 },
    startRadius: 500,
    bboxForRadius: (_location, radius) => [0, 0, radius, radius]
  }), (error) => error.code === 'REGION_RESPONSE_LIMIT_EXCEEDED');
  assert.equal(calls, 1);
});

test('restores stale status and full freshness/provenance after a visibility cycle', () => {
  const envelope = staleEnvelope();
  const render = { renderedRoads: 18, renderedBuildings: 7 };
  const hidden = localScenePresentation({ enabled: false, envelope, render });
  assert.equal(hidden.status, 'off');
  assert.match(hidden.provenanceText, /STALE ON UPSTREAM ERROR/u);
  assert.match(hidden.provenanceText, /HIDDEN \/ VERIFIED DATA RETAINED/u);

  const restored = localScenePresentation({ enabled: true, envelope, render });
  assert.equal(restored.status, 'stale');
  assert.equal(restored.statusText, 'STALE // 18 R / 7 B');
  assert.match(restored.provenanceText, /OSM BASE 2026-08-22T11:59:30Z/u);
  assert.match(restored.provenanceText, /FETCHED 2026-08-22T12:00:00Z/u);
  assert.match(restored.provenanceText, /FRESHNESS EXPIRED 2026-08-22T18:00:00Z/u);
  assert.match(restored.provenanceText, /ODBL 1\.0 DERIVED DATABASE/u);
  assert.match(formatLocalProvenance(envelope), /CONFIGURED/u);
  assert.deepEqual(localSourceSnapshot(envelope), {
    status: 'stale',
    fetchedAt: envelope.fetchedAt,
    staleAt: envelope.staleAt,
    freshness: 'stale-on-error',
    notes: envelope.notes,
    cache: envelope.cache,
    provenance: envelope.provenance
  });
});

test('derives a deterministic outward-snapped bounded bbox for Anchorage', () => {
  const bbox = localRegionBbox({ longitude: -149.9003, latitude: 61.2181 }, 1_200);
  assert.equal(bbox.length, 4);
  assert.ok(bbox[0] < 61.2181 && bbox[2] > 61.2181);
  assert.ok(bbox[1] < -149.9003 && bbox[3] > -149.9003);
  assert.ok(bbox.every((coordinate) => Math.abs(coordinate * 1_000 - Math.round(coordinate * 1_000)) < 1e-9));
});
