import assert from 'node:assert/strict';
import test from 'node:test';

import { createLocalEnuFrame } from '@peercompute/geo-core';
import { createGlobeSurfaceStream } from '../src/runtime/globeSurfaceStream.js';
import { createTerrainGrid } from '../src/world/terrainGrid.js';
import { rideTileAt, rideTileBounds } from '../src/world/rideTile.js';
import { createStreamingSurfaceCollider } from '../src/world/streamingSurfaceCollider.js';

const FRAME = createLocalEnuFrame({ longitude: -149.9003, latitude: 61.2181, height: 40 });

const tick = () => new Promise((resolve) => setImmediate(resolve));

async function waitForIdle(stream, maximumTicks = 400) {
  for (let index = 0; index < maximumTicks; index += 1) {
    const status = stream.getStatus();
    if (status.counts.inflight === 0 && status.counts.queued === 0) return status;
    await tick();
  }
  assert.fail(`stream did not become idle: ${JSON.stringify(stream.getStatus().counts)}`);
}

async function waitFor(predicate, message, maximumTicks = 400) {
  for (let index = 0; index < maximumTicks; index += 1) {
    const value = predicate();
    if (value) return value;
    await tick();
  }
  assert.fail(message);
}

function tileCenter(tile) {
  const bounds = rideTileBounds(tile);
  return {
    longitude: (bounds.west + bounds.east) / 2,
    latitude: (bounds.south + bounds.north) / 2,
  };
}

function fakeTerrain(tile, { residentBytes = 256, vertexCount = 9 } = {}) {
  const bounds = rideTileBounds(tile);
  const height = (tile.x % 17) * 0.25 + (tile.y % 13) * 0.125;
  const terrain = createTerrainGrid({
    bbox: bounds.bbox,
    width: 3,
    height: 3,
    heights: new Float32Array(9).fill(height),
  });
  return Object.freeze({
    ...terrain,
    rideTile: tile,
    coreBbox: bounds.bbox,
    halo: Object.freeze({ sourcePixels: 1 }),
    resource: Object.freeze({ residentBytes, vertexCount }),
  });
}

function disposableTerrain(tile, options = {}) {
  const terrain = fakeTerrain(tile, options);
  let disposeCount = 0;
  return {
    value: Object.freeze({
      ...terrain,
      dispose() {
        disposeCount += 1;
      },
    }),
    get disposeCount() {
      return disposeCount;
    },
  };
}

function disposableRoad({ residentBytes = 32, vertexCount = 4 } = {}) {
  let disposeCount = 0;
  return {
    value: Object.freeze({
      resource: Object.freeze({ residentBytes, vertexCount }),
      sampleLocalSurface() {
        return Object.freeze({
          height: 0,
          normal: Object.freeze([0, 1, 0]),
          contactMetadata: Object.freeze({ roadSegmentId: 'controlled-road' }),
        });
      },
      dispose() {
        disposeCount += 1;
      },
    }),
    get disposeCount() {
      return disposeCount;
    },
  };
}

async function drainControlled(stream, pending) {
  for (let iteration = 0; iteration < 100; iteration += 1) {
    await tick();
    const unresolved = pending.filter((entry) => !entry.settled)
      .sort((left, right) => right.tile.key.localeCompare(left.tile.key));
    for (const entry of unresolved) {
      entry.settled = true;
      entry.resolve(fakeTerrain(entry.tile));
    }
    await tick();
    const status = stream.getStatus();
    if (status.counts.inflight === 0 && status.counts.queued === 0) return status;
  }
  assert.fail('controlled stream did not settle');
}

test('stages terrain atomically in deterministic key order under reverse completion', async (t) => {
  const pending = [];
  const completionOrder = [];
  const stream = createGlobeSurfaceStream({
    currentFrame: FRAME,
    loadTerrainTile(tile, { signal }) {
      return new Promise((resolve, reject) => {
        const entry = {
          tile,
          settled: false,
          resolve(terrain) {
            completionOrder.push(tile.key);
            resolve(terrain);
          },
        };
        pending.push(entry);
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), {
          once: true,
        });
      });
    },
  });
  t.after(() => stream.dispose());

  const initial = stream.update({ longitude: -149.9003, latitude: 61.2181 });
  assert.equal(initial.counts.desired, 25);
  assert.equal(initial.counts.active, 9);
  assert.equal(initial.counts.inflight, 6);
  const premature = stream.stage();
  assert.equal(premature.ready, false);
  assert.equal(premature.reason, 'terrain-pending');
  assert.equal(stream.commit(premature).revision, 0);

  const idle = await drainControlled(stream, pending);
  assert.equal(idle.lifecycle.maximumConcurrentRequests, 6);
  assert.equal(idle.lifecycle.terrainBuilds, 25);
  assert.notDeepEqual(completionOrder, [...completionOrder].sort());
  const prepared = stream.stage();
  assert.equal(prepared.ready, true);
  assert.deepEqual(
    prepared.snapshot.records.map((record) => record.key),
    [...prepared.snapshot.activeKeys].sort(),
  );
  const committed = stream.commit(prepared);
  assert.equal(committed.revision, 1);
  assert.equal(committed.records.length, 9);
  assert.strictEqual(stream.getSnapshot(), committed);
  assert.equal(stream.commit(prepared), committed, 'a stale stage cannot be committed twice');
  const stableGeneration = stream.getStatus().generation;
  const stableBuilds = stream.getStatus().lifecycle.terrainBuilds;
  stream.update(tileCenter(committed.centerTile));
  assert.equal(stream.getStatus().generation, stableGeneration);
  assert.equal(stream.getStatus().lifecycle.terrainBuilds, stableBuilds);

  const nextFrame = createLocalEnuFrame({ longitude: -149.89, latitude: 61.22, height: 45 });
  const reframed = stream.stage({ currentFrame: nextFrame });
  assert.equal(reframed.ready, true);
  const chunk = reframed.snapshot.records[0];
  const point = [12, 3, -8];
  const roundTrip = chunk.transform.chunkToCurrentPoint(
    chunk.transform.currentToChunkPoint(point),
  );
  assert.ok(roundTrip.every((value, index) => Math.abs(value - point[index]) < 1e-6));
  assert.strictEqual(stream.commit(reframed).currentFrame, nextFrame);
});

test('qualifies every active terrain chunk before spending capacity on desired prefetch', async (t) => {
  const pending = [];
  const stream = createGlobeSurfaceStream({
    currentFrame: FRAME,
    limits: { maximumConcurrentRequests: 2 },
    loadTerrainTile(tile, { signal }) {
      return new Promise((resolve, reject) => {
        const entry = { tile, settled: false, resolve };
        pending.push(entry);
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), {
          once: true,
        });
      });
    },
  });
  t.after(() => stream.dispose());
  stream.update({ longitude: -149.9003, latitude: 61.2181 });
  for (let completed = 0; completed < 9; completed += 1) {
    const entry = await waitFor(
      () => pending.find((candidate) => !candidate.settled),
      'required terrain request was not scheduled',
    );
    assert.equal(stream.getRecord(entry.tile.key).required, true);
    entry.settled = true;
    entry.resolve(fakeTerrain(entry.tile));
    await tick();
    if (stream.getStatus().counts.activeTerrainReady < 9) {
      assert.ok(pending.filter((candidate) => !candidate.settled).every(
        (candidate) => stream.getRecord(candidate.tile.key).required,
      ));
    }
  }
  await waitFor(
    () => stream.getStatus().counts.activeTerrainReady === 9,
    'active terrain did not qualify',
  );
  await waitFor(
    () => pending.some((entry) => !entry.settled && !stream.getRecord(entry.tile.key).required),
    'desired-ring prefetch did not resume after active terrain qualified',
  );
  await drainControlled(stream, pending);
});

test('reuses exact resident chunks on adjacent A-B-A traversal without rebuilding', async (t) => {
  const stream = createGlobeSurfaceStream({
    currentFrame: FRAME,
    loadTerrainTile: async (tile) => fakeTerrain(tile),
  });
  t.after(() => stream.dispose());
  const aTile = rideTileAt({ longitude: -149.9003, latitude: 61.2181 });
  stream.update(tileCenter(aTile));
  await waitForIdle(stream);
  const aFirst = stream.commit(stream.stage());
  const aFirstChunk = aFirst.records.find((record) => record.key === aTile.key);
  assert.ok(aFirstChunk);
  const buildsAfterA = stream.getStatus().lifecycle.terrainBuilds;

  const bTile = { ...aTile, x: aTile.x + 1 };
  stream.update(tileCenter(bTile));
  await waitForIdle(stream);
  stream.commit(stream.stage());
  const buildsAfterB = stream.getStatus().lifecycle.terrainBuilds;

  stream.update(tileCenter(aTile));
  await waitForIdle(stream);
  const aAgain = stream.commit(stream.stage());
  const aAgainChunk = aAgain.records.find((record) => record.key === aTile.key);
  assert.strictEqual(aAgainChunk, aFirstChunk);
  assert.strictEqual(aAgainChunk.terrain, aFirstChunk.terrain);
  assert.equal(stream.getStatus().lifecycle.terrainBuilds, buildsAfterB);
  assert.ok(buildsAfterB > buildsAfterA);
  assert.ok(stream.getStatus().lifecycle.terrainReuses > 0);
  assert.ok(stream.getStatus().counts.resident <= 32);
});

test('evicts inactive LRU residents within strict record, byte, and vertex caps', async (t) => {
  const stream = createGlobeSurfaceStream({
    currentFrame: FRAME,
    limits: {
      maximumResidentRecords: 18,
      maximumResidentBytes: 18 * 256,
      maximumResidentVertices: 18 * 9,
      maximumTileBytes: 256,
      maximumTileVertices: 9,
    },
    loadTerrainTile: async (tile) => fakeTerrain(tile),
  });
  t.after(() => stream.dispose());
  const aTile = rideTileAt({ longitude: -149.9003, latitude: 61.2181 });
  stream.update(tileCenter(aTile));
  await waitForIdle(stream);
  stream.commit(stream.stage());
  const aTerrain = stream.getRecord(aTile.key).terrain;

  const bTile = { ...aTile, x: aTile.x + 20 };
  stream.update(tileCenter(bTile));
  await waitForIdle(stream);
  const bStage = stream.stage();
  assert.equal(bStage.ready, true);
  stream.commit(bStage);
  await waitForIdle(stream);
  const status = stream.getStatus();
  assert.ok(status.lifecycle.evictions > 0);
  assert.ok(status.counts.resident <= 18);
  assert.ok(status.resources.residentBytes <= 18 * 256);
  assert.ok(status.resources.residentVertices <= 18 * 9);
  assert.notStrictEqual(stream.getRecord(aTile.key)?.terrain ?? null, aTerrain);
});

test('cancels obsolete requests and discloses polar coverage without clamping', async (t) => {
  const stream = createGlobeSurfaceStream({
    currentFrame: FRAME,
    loadTerrainTile(tile, { signal }) {
      return new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException(
          `Aborted ${tile.key}`,
          'AbortError',
        )), { once: true });
      });
    },
  });
  t.after(() => stream.dispose());
  const aTile = rideTileAt({ longitude: -149.9003, latitude: 61.2181 });
  stream.update(tileCenter(aTile));
  assert.equal(stream.getStatus().counts.inflight, 6);
  const bTile = { ...aTile, x: aTile.x + 30 };
  stream.update(tileCenter(bTile));
  await tick();
  await tick();
  assert.ok(stream.getStatus().lifecycle.requestsCancelled >= 6);
  assert.ok(stream.getStatus().counts.inflight <= 6);
  const polar = stream.update({ longitude: 0, latitude: 89 });
  assert.equal(polar.state, 'unsupported');
  assert.equal(polar.coverage.reason, 'polar-source-coverage-unavailable');
  assert.equal(stream.stage().reason, 'unsupported-polar-coverage');
});

test('terrain qualifies snapshots while optional road failures remain truthful', async (t) => {
  const stream = createGlobeSurfaceStream({
    currentFrame: FRAME,
    loadTerrainTile: async (tile) => fakeTerrain(tile),
    loadRoadTile: async (tile) => {
      throw Object.assign(new Error(`No road tile ${tile.key}`), { code: 'ERR_ROAD_UNAVAILABLE' });
    },
  });
  t.after(() => stream.dispose());
  stream.update({ longitude: -149.9003, latitude: 61.2181 });
  await waitForIdle(stream);
  const prepared = stream.stage();
  assert.equal(prepared.ready, true);
  assert.equal(prepared.snapshot.roads.failed, 9);
  assert.equal(prepared.snapshot.roads.ready, 0);
  assert.ok(prepared.snapshot.records.every((record) => record.road === null));
  assert.equal(stream.commit(prepared).records.length, 9);
});

test('same-center tick/update applies bounded transient terrain retry backoff', async (t) => {
  const centerTile = rideTileAt({ longitude: -149.9003, latitude: 61.2181 });
  let now = 1_000;
  const attempts = new Map();
  const stream = createGlobeSurfaceStream({
    currentFrame: FRAME,
    clock: () => now,
    retry: {
      maximumAttempts: 3,
      initialDelayMs: 20,
      maximumDelayMs: 80,
      backoffMultiplier: 2,
    },
    async loadTerrainTile(tile) {
      const attempt = (attempts.get(tile.key) ?? 0) + 1;
      attempts.set(tile.key, attempt);
      if (tile.key === centerTile.key && attempt === 1) {
        throw Object.assign(new Error('temporary terrain outage'), {
          code: 'ETIMEDOUT',
          transient: true,
        });
      }
      return fakeTerrain(tile);
    },
  });
  t.after(() => stream.dispose());

  stream.update(tileCenter(centerTile));
  await waitForIdle(stream);
  const waiting = stream.getRecord(centerTile.key);
  assert.equal(waiting.terrainState, 'retry-wait');
  assert.equal(waiting.terrainAttempts, 1);
  assert.equal(waiting.terrainRetryAt, 1_020);
  assert.equal(stream.getStatus().lifecycle.requestsStarted, 25);
  assert.equal(stream.getStatus().lifecycle.requestsCompleted, 24);
  assert.equal(stream.getStatus().lifecycle.requestsFailed, 1);
  assert.equal(stream.getStatus().lifecycle.retriesScheduled, 1);
  const failedEpoch = stream.getStatus().contentEpoch;

  stream.tick();
  stream.update(tileCenter(centerTile));
  await tick();
  assert.equal(attempts.get(centerTile.key), 1, 'idempotent calls before the deadline do not retry');
  assert.equal(stream.getStatus().generation, 1);
  assert.equal(stream.getStatus().contentEpoch, failedEpoch);

  now = 1_020;
  stream.tick();
  await waitForIdle(stream);
  const recovered = stream.getRecord(centerTile.key);
  assert.equal(recovered.terrainState, 'resident');
  assert.equal(recovered.terrainAttempts, 2);
  assert.equal(attempts.get(centerTile.key), 2);
  assert.equal(stream.getStatus().lifecycle.requestsStarted, 26);
  assert.equal(stream.getStatus().lifecycle.requestsCompleted, 25);
  assert.equal(stream.getStatus().lifecycle.requestsFailed, 1);
  assert.equal(stream.getStatus().lifecycle.retriesStarted, 1);
  assert.equal(stream.getStatus().lifecycle.retryExhaustions, 0);
  assert.ok(stream.getStatus().contentEpoch > failedEpoch);
  assert.equal(stream.stage().ready, true);
});

test('transient terrain retries stop exactly at the configured attempt bound', async (t) => {
  const centerTile = rideTileAt({ longitude: -149.9003, latitude: 61.2181 });
  let now = 0;
  let attempts = 0;
  const stream = createGlobeSurfaceStream({
    currentFrame: FRAME,
    clock: () => now,
    retry: { maximumAttempts: 2, initialDelayMs: 5, maximumDelayMs: 5 },
    async loadTerrainTile(tile) {
      if (tile.key === centerTile.key) {
        attempts += 1;
        throw Object.assign(new Error('still offline'), { transient: true });
      }
      return fakeTerrain(tile);
    },
  });
  t.after(() => stream.dispose());
  stream.update(tileCenter(centerTile));
  await waitForIdle(stream);
  assert.equal(stream.getRecord(centerTile.key).terrainState, 'retry-wait');
  now = 5;
  stream.tick();
  await waitForIdle(stream);
  assert.equal(stream.getRecord(centerTile.key).terrainState, 'failed');
  now = 5_000;
  stream.tick();
  stream.update(tileCenter(centerTile));
  await tick();
  const status = stream.getStatus();
  assert.equal(attempts, 2);
  assert.equal(status.lifecycle.requestsStarted, 26);
  assert.equal(status.lifecycle.requestsCompleted, 24);
  assert.equal(status.lifecycle.requestsFailed, 2);
  assert.equal(status.lifecycle.retriesScheduled, 1);
  assert.equal(status.lifecycle.retriesStarted, 1);
  assert.equal(status.lifecycle.retryExhaustions, 1);
  assert.equal(status.lifecycle.terminalFailures, 1);
});

test('terminal terrain errors and tile-cap failures remain stable under idempotent ticks', async (t) => {
  const centerTile = rideTileAt({ longitude: -149.9003, latitude: 61.2181 });
  let now = 10_000;
  let terminalAttempts = 0;
  const terminal = createGlobeSurfaceStream({
    currentFrame: FRAME,
    clock: () => now,
    retry: { maximumAttempts: 3, initialDelayMs: 1, maximumDelayMs: 4 },
    async loadTerrainTile(tile) {
      if (tile.key === centerTile.key) {
        terminalAttempts += 1;
        throw Object.assign(new Error('permanent source rejection'), {
          code: 'ERR_TERRAIN_FORBIDDEN',
          retryable: false,
        });
      }
      return fakeTerrain(tile);
    },
  });
  t.after(() => terminal.dispose());
  terminal.update(tileCenter(centerTile));
  await waitForIdle(terminal);
  now += 10_000;
  terminal.tick();
  terminal.update(tileCenter(centerTile));
  await tick();
  assert.equal(terminalAttempts, 1);
  assert.equal(terminal.getRecord(centerTile.key).terrainState, 'failed');
  assert.equal(terminal.getStatus().lifecycle.retriesScheduled, 0);
  assert.equal(terminal.getStatus().lifecycle.terminalFailures, 1);
  assert.equal(terminal.stage().reason, 'terrain-terminal-failure');

  const oversized = disposableTerrain(centerTile, { residentBytes: 257, vertexCount: 9 });
  let capAttempts = 0;
  const capped = createGlobeSurfaceStream({
    currentFrame: FRAME,
    limits: {
      maximumResidentBytes: 25 * 256,
      maximumResidentVertices: 25 * 9,
      maximumTileBytes: 256,
      maximumTileVertices: 9,
    },
    async loadTerrainTile(tile) {
      if (tile.key === centerTile.key) {
        capAttempts += 1;
        return oversized.value;
      }
      return fakeTerrain(tile);
    },
  });
  t.after(() => capped.dispose());
  capped.update(tileCenter(centerTile));
  await waitForIdle(capped);
  capped.tick();
  capped.update(tileCenter(centerTile));
  await tick();
  const capStatus = capped.getStatus();
  assert.equal(capAttempts, 1);
  assert.equal(capped.getRecord(centerTile.key).terrainState, 'failed-cap');
  assert.equal(capped.stage().reason, 'terrain-cap-failure');
  assert.equal(oversized.disposeCount, 1);
  assert.equal(capStatus.lifecycle.requestsStarted, 25);
  assert.equal(capStatus.lifecycle.requestsCompleted, 24);
  assert.equal(capStatus.lifecycle.requestsFailed, 1);
  assert.equal(capStatus.lifecycle.requestsCancelled, 0);
  assert.equal(capStatus.lifecycle.capRejections, 1);
  assert.equal(capStatus.lifecycle.terminalFailures, 1);
  assert.equal(capStatus.lifecycle.terrainDisposals, 1);
});

function createControlledRoadLoader() {
  const pending = [];
  return Object.freeze({
    pending,
    load(tile, { signal }) {
      return new Promise((resolve, reject) => {
        const entry = {
          tile,
          settled: false,
          resolve(value) {
            if (entry.settled) return;
            entry.settled = true;
            resolve(value);
          },
          reject(error) {
            if (entry.settled) return;
            entry.settled = true;
            reject(error);
          },
        };
        pending.push(entry);
        signal.addEventListener('abort', () => entry.reject(new DOMException(
          `Aborted ${tile.key}`,
          'AbortError',
        )), { once: true });
      });
    },
    next() {
      return pending.find((entry) => !entry.settled) ?? null;
    },
  });
}

test('road content changes invalidate stages while reservations publish exactly once', async (t) => {
  const control = createControlledRoadLoader();
  const stream = createGlobeSurfaceStream({
    currentFrame: FRAME,
    limits: { maximumConcurrentRequests: 1 },
    loadTerrainTile: async (tile) => fakeTerrain(tile),
    loadRoadTile: control.load,
  });
  t.after(() => stream.dispose());
  stream.update({ longitude: -149.9003, latitude: 61.2181 });
  const firstRoad = await waitFor(
    () => stream.getStatus().counts.activeTerrainReady === 9 && control.next(),
    'first controlled road request was not issued',
  );
  const beforeRoad = stream.stage();
  assert.equal(beforeRoad.ready, true);
  assert.equal(beforeRoad.resourceIdentities.length, 9);
  assert.equal(beforeRoad.contentEpoch, beforeRoad.snapshot.contentEpoch);
  const firstResource = disposableRoad();
  firstRoad.resolve(firstResource.value);
  await waitFor(
    () => stream.getRecord(firstRoad.tile.key).roadState === 'resident',
    'first road did not become resident',
  );
  assert.ok(stream.getStatus().contentEpoch > beforeRoad.contentEpoch);
  const rejected = stream.reserve(beforeRoad);
  assert.equal(rejected.accepted, false);
  assert.equal(rejected.reason, 'stale-stage-epoch');
  const rejectedResult = stream.commit(rejected);
  assert.equal(rejectedResult.revision, 0);
  assert.strictEqual(stream.commit(rejected), rejectedResult);
  assert.equal(stream.getStatus().lifecycle.reservationsRejected, 1);
  assert.equal(stream.getStatus().lifecycle.rejectedCommits, 1);

  const secondRoad = await waitFor(() => control.next(), 'second road request was not issued');
  const publishStage = stream.stage();
  const reservation = stream.reserve(publishStage);
  assert.equal(reservation.accepted, true);
  assert.equal(reservation.generation, publishStage.generation);
  assert.equal(reservation.contentEpoch, publishStage.contentEpoch);
  const secondResource = disposableRoad();
  secondRoad.resolve(secondResource.value);
  await waitFor(
    () => stream.getRecord(secondRoad.tile.key).roadState === 'resident',
    'second road did not become resident after reservation',
  );
  assert.ok(stream.getStatus().contentEpoch > reservation.contentEpoch);
  const published = stream.commit(reservation);
  assert.equal(published.revision, 1);
  assert.equal(published.contentEpoch, reservation.contentEpoch);
  assert.strictEqual(stream.commit(reservation), published);
  assert.strictEqual(stream.commit(publishStage), published);
  assert.equal(stream.getStatus().lifecycle.reservationsCreated, 1);
  assert.equal(stream.getStatus().lifecycle.reservationsCommitted, 1);
  assert.equal(stream.getStatus().lifecycle.commits, 1);
  assert.ok(stream.getStatus().committed.contentEpoch < stream.getStatus().contentEpoch);
  assert.equal(firstResource.disposeCount, 0);
  assert.equal(secondResource.disposeCount, 0);
  const liveEpoch = stream.getStatus().contentEpoch;
  stream.dispose();
  assert.ok(stream.getStatus().contentEpoch > liveEpoch);
  assert.equal(firstResource.disposeCount, 1);
  assert.equal(secondResource.disposeCount, 1);
  assert.equal(stream.getStatus().lifecycle.roadDisposals, 2);
});

test('road failure and cap rejection after stage invalidate exact resource identities', async (t) => {
  for (const outcome of ['failure', 'cap']) {
    await t.test(outcome, async (st) => {
      const control = createControlledRoadLoader();
      const cappedRoad = disposableRoad({ residentBytes: 1, vertexCount: 1 });
      const stream = createGlobeSurfaceStream({
        currentFrame: FRAME,
        limits: {
          maximumConcurrentRequests: 1,
          maximumResidentBytes: 25 * 256,
          maximumResidentVertices: 25 * 9,
          maximumTileBytes: outcome === 'cap' ? 256 : 512,
          maximumTileVertices: outcome === 'cap' ? 9 : 16,
        },
        loadTerrainTile: async (tile) => fakeTerrain(tile),
        loadRoadTile: control.load,
      });
      st.after(() => stream.dispose());
      stream.update({ longitude: -149.9003, latitude: 61.2181 });
      const roadRequest = await waitFor(
        () => stream.getStatus().counts.activeTerrainReady === 9 && control.next(),
        `${outcome} road request was not issued`,
      );
      const candidate = stream.stage();
      if (outcome === 'failure') {
        roadRequest.reject(Object.assign(new Error('permanent road absence'), {
          code: 'ERR_ROAD_UNAVAILABLE',
          retryable: false,
        }));
      } else {
        roadRequest.resolve(cappedRoad.value);
      }
      await waitFor(
        () => ['failed', 'failed-cap'].includes(stream.getRecord(roadRequest.tile.key).roadState),
        `${outcome} road outcome did not settle`,
      );
      const receipt = stream.reserve(candidate);
      assert.equal(receipt.accepted, false);
      assert.equal(receipt.reason, 'stale-stage-epoch');
      assert.equal(stream.commit(receipt).revision, 0);
      const status = stream.getStatus();
      assert.equal(status.lifecycle.requestsFailed, 1);
      assert.equal(status.lifecycle.terminalFailures, 1);
      assert.equal(status.lifecycle.retriesScheduled, 0);
      if (outcome === 'cap') {
        assert.equal(cappedRoad.disposeCount, 1);
        assert.equal(status.lifecycle.capRejections, 1);
        assert.equal(status.lifecycle.roadDisposals, 1);
      } else {
        assert.equal(status.lifecycle.capRejections, 0);
        assert.equal(status.lifecycle.roadDisposals, 0);
      }
    });
  }
});

test('generation changes reject old stages before publication', async (t) => {
  const stream = createGlobeSurfaceStream({
    currentFrame: FRAME,
    loadTerrainTile: async (tile) => fakeTerrain(tile),
  });
  t.after(() => stream.dispose());
  const first = rideTileAt({ longitude: -149.9003, latitude: 61.2181 });
  stream.update(tileCenter(first));
  await waitForIdle(stream);
  const candidate = stream.stage();
  const second = { ...first, x: first.x + 3 };
  stream.update(tileCenter(second));
  const receipt = stream.reserve(candidate);
  assert.equal(receipt.accepted, false);
  assert.equal(receipt.reason, 'stale-stage-epoch');
  assert.ok(stream.getStatus().generation > candidate.generation);
});

test('late terrain results are disposed exactly once after an obsolete abort', async (t) => {
  const pending = [];
  const stream = createGlobeSurfaceStream({
    currentFrame: FRAME,
    limits: { maximumConcurrentRequests: 1 },
    loadTerrainTile(tile) {
      return new Promise((resolve) => pending.push({ tile, resolve }));
    },
  });
  t.after(() => stream.dispose());
  const first = rideTileAt({ longitude: -149.9003, latitude: 61.2181 });
  stream.update(tileCenter(first));
  const obsolete = await waitFor(() => pending[0], 'initial terrain request was not issued');
  const second = { ...first, x: first.x + 30 };
  stream.update(tileCenter(second));
  const late = disposableTerrain(obsolete.tile);
  obsolete.resolve(late.value);
  await waitFor(
    () => stream.getStatus().lifecycle.staleResults === 1,
    'late terrain result was not classified stale',
  );
  const status = stream.getStatus();
  assert.equal(late.disposeCount, 1);
  assert.equal(status.lifecycle.terrainDisposals, 1);
  assert.equal(status.lifecycle.requestsCancelled, 1);
  assert.equal(status.lifecycle.requestsCompleted, 0);
  assert.equal(status.lifecycle.requestsFailed, 0);
  assert.equal(status.lifecycle.requestsStarted, 2, 'the replacement request starts after stale settle');
});

test('late road results and resident resources are disposed exactly once', async (t) => {
  const pendingRoads = [];
  const terrains = [];
  const roads = [];
  const stream = createGlobeSurfaceStream({
    currentFrame: FRAME,
    limits: { maximumConcurrentRequests: 1 },
    loadTerrainTile: async (tile) => {
      const terrain = disposableTerrain(tile);
      terrains.push(terrain);
      return terrain.value;
    },
    loadRoadTile(tile) {
      return new Promise((resolve) => pendingRoads.push({ tile, resolve }));
    },
  });
  const first = rideTileAt({ longitude: -149.9003, latitude: 61.2181 });
  stream.update(tileCenter(first));
  const obsoleteRoad = await waitFor(
    () => stream.getStatus().counts.activeTerrainReady === 9 && pendingRoads[0],
    'obsolete road request was not issued',
  );
  const second = { ...first, x: first.x + 30 };
  stream.update(tileCenter(second));
  const lateRoad = disposableRoad();
  roads.push(lateRoad);
  obsoleteRoad.resolve(lateRoad.value);
  await waitFor(
    () => stream.getStatus().lifecycle.staleResults === 1,
    'late road result was not classified stale',
  );
  assert.equal(lateRoad.disposeCount, 1);
  assert.equal(stream.getStatus().lifecycle.roadDisposals, 1);
  assert.equal(stream.getStatus().lifecycle.requestsCancelled, 1);

  stream.dispose();
  assert.ok(terrains.length >= 9);
  assert.ok(terrains.every((resource) => resource.disposeCount === 1));
  assert.ok(roads.every((resource) => resource.disposeCount === 1));
  assert.equal(stream.getStatus().lifecycle.terrainDisposals, terrains.length);
  assert.equal(stream.getStatus().lifecycle.disposalFailures, 0);
  assert.equal(stream.getStatus().state, 'disposed');
});

test('collider resolves real chunk ENU terrain before and after a staged reframe', async (t) => {
  const stream = createGlobeSurfaceStream({
    currentFrame: FRAME,
    loadTerrainTile: async (tile) => fakeTerrain(tile),
  });
  t.after(() => stream.dispose());
  const centerTile = rideTileAt({ longitude: -149.9003, latitude: 61.2181 });
  stream.update(tileCenter(centerTile));
  await waitForIdle(stream);
  stream.commit(stream.stage());
  const collider = createStreamingSurfaceCollider({ getSnapshot: () => stream.getSnapshot() });
  let chunk = stream.getSnapshot().records.find((record) => record.key === centerTile.key);
  const centerVertex = chunk.terrain.positions.slice(4 * 3, 4 * 3 + 3);
  const firstCenter = chunk.transform.chunkToCurrentPoint([
    centerVertex[0], centerVertex[1] + 0.1, centerVertex[2],
  ]);
  const first = collider.sampleSphere({ center: firstCenter, radius: 0.2 });
  assert.equal(first.hit, true);
  assert.equal(first.metadata.streamTileKey, centerTile.key);

  const nextFrame = createLocalEnuFrame({ longitude: -149.88, latitude: 61.23, height: 70 });
  stream.commit(stream.stage({ currentFrame: nextFrame }));
  chunk = stream.getSnapshot().records.find((record) => record.key === centerTile.key);
  const reframedCenter = chunk.transform.chunkToCurrentPoint([
    centerVertex[0], centerVertex[1] + 0.1, centerVertex[2],
  ]);
  const reframed = collider.sampleSphere({ center: reframedCenter, radius: 0.2 });
  assert.equal(reframed.hit, true);
  assert.equal(reframed.metadata.streamTileKey, centerTile.key);
});

function identityChunk({ roadHeight = null, terrainHeight = 0 } = {}) {
  const identity = Object.freeze({
    currentToChunkPoint: (point) => [...point],
    chunkToCurrentPoint: (point) => [...point],
    currentToChunkVector: (vector) => [...vector],
    chunkToCurrentVector: (vector) => [...vector],
  });
  return Object.freeze({
    key: '14/1/1',
    transform: identity,
    road: roadHeight === null ? null : Object.freeze({
      sampleLocalSurface: () => Object.freeze({
        height: roadHeight,
        normal: Object.freeze([0, 1, 0]),
        contactMetadata: Object.freeze({ roadSegmentId: 'stream-road' }),
      }),
    }),
    terrain: Object.freeze({
      localBounds: Object.freeze({
        minX: -100,
        maxX: 100,
        minZ: -100,
        maxZ: 100,
      }),
      sampleLocalSurface: () => Object.freeze({
        height: terrainHeight,
        normal: Object.freeze([0, 1, 0]),
      }),
    }),
  });
}

function snapshot(records, { revision = 0 } = {}) {
  return Object.freeze({
    schemaVersion: 'peercompute.motorcycle.globe-surface-snapshot.v1',
    revision,
    records: Object.freeze(records),
  });
}

test('stable collider maps chunk/fallback frames and keeps road precedence', () => {
  let reads = 0;
  let currentSnapshot = snapshot([identityChunk({ roadHeight: 0, terrainHeight: 10 })]);
  let fallbackKind = 'terrain';
  const fallback = Object.freeze({
    id: 'initial-composite',
    sampleSphere({ center, radius }) {
      const height = fallbackKind === 'road' ? 20 : 15;
      return {
        hit: center[1] - height - radius <= 0,
        signedDistance: center[1] - height - radius,
        normal: [0, 1, 0],
        friction: 0.8,
        restitution: 0.02,
        metadata: { surfaceKind: fallbackKind },
      };
    },
  });
  const collider = createStreamingSurfaceCollider({
    getSnapshot() {
      reads += 1;
      return currentSnapshot;
    },
    fallbackSurface: fallback,
  });
  const streamedRoad = collider.sampleSphere({ center: [0, 0.1, 0], radius: 0.2 });
  assert.equal(streamedRoad.metadata.roadSegmentId, 'stream-road');
  assert.equal(streamedRoad.metadata.surfaceKind, 'road');

  fallbackKind = 'road';
  const fallbackRoad = collider.sampleSphere({ center: [0, 20.1, 0], radius: 0.2 });
  assert.equal(fallbackRoad.metadata.fallbackSurfaceId, 'initial-composite');
  assert.equal(fallbackRoad.metadata.surfaceKind, 'road');

  currentSnapshot = snapshot([identityChunk({ terrainHeight: 5 })], { revision: 17 });
  fallbackKind = 'osm-road';
  const osmRoad = collider.sampleSphere({ center: [0, 15.1, 0], radius: 0.2 });
  assert.equal(osmRoad.metadata.fallbackSurfaceId, 'initial-composite');
  assert.equal(osmRoad.metadata.surfaceKind, 'osm-road');
  assert.equal(osmRoad.surfaceKind, 'osm-road');
  assert.equal(osmRoad.tileKey, null);

  fallbackKind = 'terrain';
  const streamedBelowFallback = collider.sampleSphere({ center: [0, 5.1, 0], radius: 0.2 });
  assert.equal(streamedBelowFallback.metadata.surfaceKind, 'terrain');
  assert.equal(streamedBelowFallback.metadata.streamTileKey, '14/1/1');
  assert.equal(streamedBelowFallback.groundHeight, 5);
  assert.equal(streamedBelowFallback.snapshotRevision, 17);
  const point = collider.samplePoint([0, 30, 0]);
  assert.equal(point.available, true);
  assert.equal(point.height, 5);
  assert.deepEqual(point.normal, [0, 1, 0]);
  assert.equal(point.surfaceKind, 'terrain');
  assert.equal(point.tileKey, '14/1/1');
  assert.equal(point.snapshotRevision, 17);

  currentSnapshot = snapshot([]);
  fallbackKind = 'terrain';
  collider.setFallbackTransform({
    currentToFallbackPoint: ([x, y, z]) => [x, y - 10, z],
    fallbackToCurrentPoint: ([x, y, z]) => [x, y + 10, z],
    fallbackToCurrentVector: (vector) => [...vector],
  });
  const transformed = collider.sampleSphere({ center: [0, 25.1, 0], radius: 0.2 });
  assert.equal(transformed.hit, true);
  assert.ok(Math.abs(transformed.signedDistance + 0.1) < 1e-6);
  assert.equal(collider.setFallbackTransform(null), false);
  assert.equal(collider.sampleSphere({ center: [0, 25.1, 0], radius: 0.2 }).unavailable, true);

  const beforeSweepReads = reads;
  collider.sweepSphere({ from: [0, 2, 0], to: [0, -1, 0], radius: 0.2 });
  assert.equal(reads, beforeSweepReads + 1, 'one immutable snapshot is captured per sweep');
  const telemetry = collider.getTelemetry();
  assert.equal(telemetry.fallbackEnabled, false);
  assert.ok(telemetry.chunkBoundsTests > 0);
  assert.ok(telemetry.chunkBoundsHits > 0);
  assert.equal(telemetry.maximumCandidateChunksPerSample, 1);
});
