import { GeodataError } from '../errors.js';

export class CoalescingTtlLruCache {
  #entries = new Map();

  constructor({ maxEntries, freshTtlMs, staleIfErrorMs, clock = Date.now }) {
    if (!Number.isInteger(maxEntries) || maxEntries < 1) {
      throw new RangeError('Cache maxEntries must be a positive integer.');
    }
    if (!Number.isFinite(freshTtlMs) || freshTtlMs < 0) {
      throw new RangeError('Cache freshTtlMs must be non-negative.');
    }
    if (!Number.isFinite(staleIfErrorMs) || staleIfErrorMs < 0) {
      throw new RangeError('Cache staleIfErrorMs must be non-negative.');
    }
    this.maxEntries = maxEntries;
    this.freshTtlMs = freshTtlMs;
    this.staleIfErrorMs = staleIfErrorMs;
    this.clock = clock;
  }

  get size() {
    return this.#entries.size;
  }

  get stats() {
    const now = this.clock();
    let pending = 0;
    let fresh = 0;
    let stale = 0;
    for (const entry of this.#entries.values()) {
      if (entry.pending) pending += 1;
      if (entry.value !== undefined && now < entry.expiresAt) fresh += 1;
      else if (entry.value !== undefined && now <= entry.staleUntil) stale += 1;
    }
    return Object.freeze({
      entries: this.#entries.size,
      pending,
      fresh,
      stale,
      capacity: this.maxEntries
    });
  }

  clear() {
    this.#entries.clear();
  }

  getOrLoad(key, loader) {
    if (typeof key !== 'string' || key.length === 0) {
      throw new TypeError('Cache keys must be non-empty strings.');
    }
    if (typeof loader !== 'function') throw new TypeError('Cache loader must be a function.');

    const now = this.clock();
    let entry = this.#entries.get(key);

    if (entry?.pending) {
      this.#touch(key, entry);
      return entry.pending.then((result) => ({ ...result, cacheStatus: 'coalesced' }));
    }

    if (entry?.value !== undefined && now < entry.expiresAt) {
      entry.lastAccess = now;
      this.#touch(key, entry);
      return Promise.resolve({
        value: entry.value,
        cacheStatus: 'hit',
        fresh: true,
        fetchedAtMs: entry.fetchedAt,
        expiresAtMs: entry.expiresAt,
        staleUntilMs: entry.staleUntil
      });
    }

    const staleCandidate = entry?.value !== undefined && now <= entry.staleUntil ? entry : null;
    if (entry && !staleCandidate) this.#entries.delete(key);
    this.#ensureCapacity(key);

    entry = staleCandidate ?? {
      value: undefined,
      fetchedAt: 0,
      expiresAt: 0,
      staleUntil: 0,
      lastAccess: now,
      pending: null
    };

    const pending = Promise.resolve()
      .then(loader)
      .then((value) => {
        const fetchedAt = this.clock();
        const resolved = {
          value,
          fetchedAt,
          expiresAt: fetchedAt + this.freshTtlMs,
          staleUntil: fetchedAt + this.freshTtlMs + this.staleIfErrorMs,
          lastAccess: fetchedAt,
          pending: null
        };
        if (this.#entries.get(key) === entry) {
          this.#entries.set(key, resolved);
          this.#touch(key, resolved);
        }
        return {
          value,
          cacheStatus: 'miss',
          fresh: true,
          fetchedAtMs: resolved.fetchedAt,
          expiresAtMs: resolved.expiresAt,
          staleUntilMs: resolved.staleUntil
        };
      })
      .catch((error) => {
        const failedAt = this.clock();
        if (staleCandidate && failedAt <= staleCandidate.staleUntil) {
          staleCandidate.pending = null;
          staleCandidate.lastAccess = failedAt;
          this.#entries.set(key, staleCandidate);
          this.#touch(key, staleCandidate);
          return {
            value: staleCandidate.value,
            cacheStatus: 'stale',
            fresh: false,
            fetchedAtMs: staleCandidate.fetchedAt,
            expiresAtMs: staleCandidate.expiresAt,
            staleUntilMs: staleCandidate.staleUntil,
            refreshErrorCode: typeof error?.code === 'string' ? error.code : 'UPSTREAM_REFRESH_FAILED'
          };
        }
        if (this.#entries.get(key) === entry) this.#entries.delete(key);
        throw error;
      });

    entry.pending = pending;
    entry.lastAccess = now;
    this.#entries.set(key, entry);
    this.#touch(key, entry);
    return pending;
  }

  #touch(key, entry) {
    this.#entries.delete(key);
    this.#entries.set(key, entry);
  }

  #ensureCapacity(incomingKey) {
    if (this.#entries.has(incomingKey)) return;
    while (this.#entries.size >= this.maxEntries) {
      let evicted = false;
      for (const [key, entry] of this.#entries) {
        if (!entry.pending) {
          this.#entries.delete(key);
          evicted = true;
          break;
        }
      }
      if (!evicted) {
        throw new GeodataError(
          'CACHE_BUSY',
          'The bounded geodata cache is occupied by in-flight regions; retry shortly.',
          { statusCode: 503, retryable: true }
        );
      }
    }
  }
}
