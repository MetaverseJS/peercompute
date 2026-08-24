import test from 'node:test';
import assert from 'node:assert/strict';
import { CoalescingTtlLruCache } from '../src/lib/cache.js';
import { BoundedSemaphore, raceWithSignal } from '../src/lib/semaphore.js';

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

test('cache coalesces identical loads and marks subscribers without duplicating work', async () => {
  let loads = 0;
  const gate = deferred();
  const cache = new CoalescingTtlLruCache({ maxEntries: 2, freshTtlMs: 100, staleIfErrorMs: 1_000 });
  const loader = async () => {
    loads += 1;
    await gate.promise;
    return { value: 42 };
  };
  const first = cache.getOrLoad('region-hash', loader);
  const second = cache.getOrLoad('region-hash', loader);
  gate.resolve();
  const [firstResult, secondResult] = await Promise.all([first, second]);
  assert.equal(loads, 1);
  assert.equal(firstResult.cacheStatus, 'miss');
  assert.equal(secondResult.cacheStatus, 'coalesced');
  assert.strictEqual(firstResult.value, secondResult.value);
});

test('cache uses LRU eviction and never retains failed first loads', async () => {
  const cache = new CoalescingTtlLruCache({ maxEntries: 2, freshTtlMs: 1_000, staleIfErrorMs: 1_000 });
  await cache.getOrLoad('a', async () => 'A');
  await cache.getOrLoad('b', async () => 'B');
  await cache.getOrLoad('a', async () => 'not-used');
  await cache.getOrLoad('c', async () => 'C');
  let reloaded = false;
  const b = await cache.getOrLoad('b', async () => {
    reloaded = true;
    return 'B2';
  });
  assert.equal(reloaded, true);
  assert.equal(b.value, 'B2');

  await assert.rejects(cache.getOrLoad('failed', async () => {
    throw new Error('fixture failure');
  }), /fixture failure/u);
  assert.equal(cache.stats.pending, 0);
});

test('cache fails closed instead of evicting or resurrecting in-flight entries', async () => {
  const cache = new CoalescingTtlLruCache({ maxEntries: 1, freshTtlMs: 1_000, staleIfErrorMs: 1_000 });
  const gate = deferred();
  const first = cache.getOrLoad('first', async () => gate.promise);
  assert.throws(
    () => cache.getOrLoad('second', async () => 'second'),
    (error) => error.code === 'CACHE_BUSY' && error.statusCode === 503
  );
  gate.resolve('first');
  assert.equal((await first).value, 'first');
  assert.equal(cache.size, 1);
});

test('cache refreshes after six-hour freshness and serves verified stale only within its bound', async () => {
  let now = 1_000;
  const cache = new CoalescingTtlLruCache({
    maxEntries: 2,
    freshTtlMs: 100,
    staleIfErrorMs: 500,
    clock: () => now
  });
  await cache.getOrLoad('region', async () => 'verified');
  now = 1_101;
  const stale = await cache.getOrLoad('region', async () => {
    const error = new Error('upstream failed');
    error.code = 'UPSTREAM_FETCH_FAILED';
    throw error;
  });
  assert.equal(stale.value, 'verified');
  assert.equal(stale.cacheStatus, 'stale');
  assert.equal(stale.refreshErrorCode, 'UPSTREAM_FETCH_FAILED');

  now = 1_601;
  await assert.rejects(cache.getOrLoad('region', async () => {
    throw new Error('still unavailable');
  }), /still unavailable/u);
});

test('aborting one cache subscriber does not abort the shared loader or other subscribers', async () => {
  const cache = new CoalescingTtlLruCache({ maxEntries: 2, freshTtlMs: 1_000, staleIfErrorMs: 1_000 });
  const gate = deferred();
  const shared = cache.getOrLoad('region', async () => gate.promise);
  const controller = new AbortController();
  const cancelledSubscriber = raceWithSignal(shared, controller.signal);
  const survivingSubscriber = raceWithSignal(cache.getOrLoad('region', async () => 'wrong'));
  controller.abort();
  await assert.rejects(cancelledSubscriber, (error) => error.name === 'AbortError');
  gate.resolve('real-data');
  assert.equal((await survivingSubscriber).value, 'real-data');
});

test('bounded semaphore caps concurrency, rejects excess queueing, and removes aborted waiters', async () => {
  const semaphore = new BoundedSemaphore({ concurrency: 2, maxQueue: 1 });
  const firstRelease = await semaphore.acquire();
  const secondRelease = await semaphore.acquire();
  const controller = new AbortController();
  const queued = semaphore.acquire(controller.signal);
  await assert.rejects(semaphore.acquire(), (error) => error.code === 'UPSTREAM_BUSY');
  assert.equal(semaphore.active, 2);
  assert.equal(semaphore.queued, 1);
  controller.abort();
  await assert.rejects(queued, (error) => error.name === 'AbortError');
  assert.equal(semaphore.queued, 0);
  firstRelease();
  secondRelease();
  assert.equal(semaphore.active, 0);
});
