import assert from 'node:assert/strict';
import test from 'node:test';

import {
  loadMotorcycleLocation,
  motorcycleRegionBbox,
  normalizeMotorcycleLocation,
} from '../src/runtime/locationLoader.js';
import { createDerivedFlatTerrainGrid } from '../src/world/terrainGrid.js';

for (const retryableCode of ['REGION_RESULT_LIMIT_EXCEEDED', 'REGION_RESPONSE_LIMIT_EXCEEDED']) {
  test(`location loader quantizes coordinates and narrows ${retryableCode}`, async () => {
    const calls = [];
    const envelope = Object.freeze({ schemaVersion: 'fixture-region' });
    const geodata = {
      async osmRegion({ bbox, layers }) {
        assert.deepEqual(layers, ['roads']);
        calls.push(bbox);
        if (calls.length === 1) {
          const error = new Error('dense');
          error.code = retryableCode;
          throw error;
        }
        return envelope;
      },
    };
    const result = await loadMotorcycleLocation({
      geodata,
      location: { longitude: -149.90034, latitude: 61.21814 },
      radiiMeters: [1_200, 800],
      terrainLoader: async ({ bbox }) => createDerivedFlatTerrainGrid({ bbox }),
      sceneDataFactory: (source, terrain) => Object.freeze({ source, terrain }),
    });
    assert.deepEqual(result.location, { longitude: -149.9003, latitude: 61.2181 });
    assert.equal(result.radiusMeters, 800);
    assert.equal(result.attempts[0].status, 'narrowing');
    assert.equal(result.attempts[1].status, 'loaded');
    assert.equal(result.envelope, envelope);
    assert.equal(result.terrainDegraded, true);
    assert.equal(result.terrainError, null);
  });
}

test('terrain failure remains visible while returning an explicit degraded plane', async () => {
  const geodata = { osmRegion: async () => Object.freeze({ id: 'region' }) };
  const result = await loadMotorcycleLocation({
    geodata,
    location: { longitude: -149.9, latitude: 61.2 },
    radiiMeters: [500],
    terrainLoader: async () => {
      const error = new Error('NOAA offline');
      error.code = 'ERR_NOAA_OFFLINE';
      throw error;
    },
    sceneDataFactory: (_source, terrain) => ({ terrainSource: terrain.source.id }),
  });
  assert.equal(result.terrainDegraded, true);
  assert.equal(result.terrain.source.authoritative, false);
  assert.equal(result.terrainError.code, 'ERR_NOAA_OFFLINE');
  assert.equal(result.sceneData.terrainSource, 'peercompute-derived-flat-terrain');
});

test('never-settling terrain is bounded by a deadline and degrades truthfully', async () => {
  const geodata = { osmRegion: async () => Object.freeze({ id: 'region' }) };
  const startedAt = Date.now();
  const result = await loadMotorcycleLocation({
    geodata,
    location: { longitude: -149.9, latitude: 61.2 },
    radiiMeters: [500],
    terrainTimeoutMs: 15,
    terrainLoader: ({ signal }) => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(signal.reason), { once: true });
    }),
    sceneDataFactory: (_source, terrain) => ({ terrainSource: terrain.source.id }),
  });
  assert.ok(Date.now() - startedAt < 1_000);
  assert.equal(result.terrainDegraded, true);
  assert.equal(result.terrain.source.id, 'peercompute-derived-flat-terrain');
  assert.equal(result.terrainError.code, 'ERR_MOTORCYCLE_TERRAIN_TIMEOUT');
  assert.match(result.terrainError.message, /15 ms deadline/u);
});

test('location helpers reject invalid values and return bounded snapped boxes', () => {
  assert.deepEqual(normalizeMotorcycleLocation({ longitude: 1.23456, latitude: 45.67894 }), {
    longitude: 1.2346,
    latitude: 45.6789,
  });
  const bbox = motorcycleRegionBbox({ longitude: -149.9, latitude: 61.2 }, 500);
  assert.equal(bbox.length, 4);
  assert.ok(bbox[0] < 61.2 && bbox[2] > 61.2);
  assert.throws(() => normalizeMotorcycleLocation({ longitude: 200, latitude: 0 }), /outside WGS84/);
});
