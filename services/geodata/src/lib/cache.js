import { GeodataError } from '../errors.js';

function defaultByteLength(value) {
  if (typeof value === 'string') return Buffer.byteLength(value, 'utf8');
  if (value instanceof ArrayBuffer) return value.byteLength;
  if (ArrayBuffer.isView(value)) return value.byteLength;
  return Buffer.byteLength(JSON.stringify(value), 'utf8');
}

function nonNegativeDuration(value, label) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be non-negative.`);
  }
  return value;
}

export class CoalescingTtlLruCache {
  #entries = new Map();
  #counters = {
    hits: 0,
    misses: 0,
    coalesced: 0,
    staleServed: 0,
    evictions: 0
  };

  constructor({
    maxEntries,
    freshTtlMs,
    staleIfErrorMs,
    maxBytes,
    maxEntryBytes,
    sizeOf = defaultByteLength,
    clock = Date.now
  }) {
    if (!Number.isInteger(maxEntries) || maxEntries < 1) {
      throw new RangeError('Cache maxEntries must be a positive integer.');
    }
    nonNegativeDuration(freshTtlMs, 'Cache freshTtlMs');
    nonNegativeDuration(staleIfErrorMs, 'Cache staleIfErrorMs');
    if (maxBytes !== undefined && (!Number.isSafeInteger(maxBytes) || maxBytes < 1)) {
      throw new RangeError('Cache maxBytes must be a positive safe integer.');
    }
    if (maxEntryBytes !== undefined && (!Number.isSafeInteger(maxEntryBytes) || maxEntryBytes < 1)) {
      throw new RangeError('Cache maxEntryBytes must be a positive safe integer.');
    }
    if (maxBytes === undefined && maxEntryBytes !== undefined) {
      throw new RangeError('Cache maxBytes is required when maxEntryBytes is configured.');
    }
    if (maxBytes !== undefined && (maxEntryBytes ?? maxBytes) > maxBytes) {
      throw new RangeError('Cache maxEntryBytes cannot exceed maxBytes.');
    }
    if (typeof sizeOf !== 'function') throw new TypeError('Cache sizeOf must be a function.');
    this.maxEntries = maxEntries;
    this.freshTtlMs = freshTtlMs;
    this.staleIfErrorMs = staleIfErrorMs;
    this.maxBytes = maxBytes ?? null;
    this.maxEntryBytes = maxBytes === undefined ? null : (maxEntryBytes ?? maxBytes);
    this.sizeOf = sizeOf;
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
    let residentBytes = 0;
    let pendingReservationBytes = 0;
    for (const entry of this.#entries.values()) {
      if (entry.pending) pending += 1;
      if (entry.value !== undefined && now < entry.expiresAt) fresh += 1;
      else if (entry.value !== undefined && now <= entry.staleUntil) stale += 1;
      residentBytes += entry.sizeBytes;
      pendingReservationBytes += entry.pendingReservationBytes;
    }
    return Object.freeze({
      entries: this.#entries.size,
      pending,
      fresh,
      stale,
      capacity: this.maxEntries,
      bytes: residentBytes,
      residentBytes,
      reservedBytes: pendingReservationBytes,
      pendingReservationBytes,
      maxBytes: this.maxBytes,
      maxEntryBytes: this.maxEntryBytes,
      ...this.#counters
    });
  }

  clear() {
    this.#entries.clear();
  }

  getOrLoad(key, loader, options = {}) {
    if (typeof key !== 'string' || key.length === 0) {
      throw new TypeError('Cache keys must be non-empty strings.');
    }
    if (typeof loader !== 'function') throw new TypeError('Cache loader must be a function.');
    if (!options || typeof options !== 'object' || Array.isArray(options)) {
      throw new TypeError('Cache load options must be an object.');
    }
    const freshTtlMs = nonNegativeDuration(
      options.freshTtlMs ?? this.freshTtlMs,
      'Cache load freshTtlMs'
    );
    const staleIfErrorMs = nonNegativeDuration(
      options.staleIfErrorMs ?? this.staleIfErrorMs,
      'Cache load staleIfErrorMs'
    );

    const now = this.clock();
    let entry = this.#entries.get(key);

    if (entry?.pending) {
      this.#counters.coalesced += 1;
      this.#touch(key, entry);
      return entry.pending.then((result) => ({ ...result, cacheStatus: 'coalesced' }));
    }

    if (entry?.value !== undefined && now < entry.expiresAt) {
      this.#counters.hits += 1;
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

    this.#counters.misses += 1;
    const staleCandidate = entry?.value !== undefined && now <= entry.staleUntil ? entry : null;
    if (entry && !staleCandidate) {
      this.#entries.delete(key);
      entry = undefined;
    }

    const reservationBytes = this.maxEntryBytes === null
      ? 0
      : Math.max(0, this.maxEntryBytes - (staleCandidate?.sizeBytes ?? 0));
    this.#ensureCapacity(key, reservationBytes);

    entry = staleCandidate ?? {
      value: undefined,
      sizeBytes: 0,
      fetchedAt: 0,
      expiresAt: 0,
      staleUntil: 0,
      lastAccess: now,
      pending: null,
      pendingReservationBytes: 0
    };
    entry.pendingReservationBytes = reservationBytes;

    const pending = Promise.resolve()
      .then(loader)
      .then((value) => {
        const sizeBytes = this.#measureValue(value);
        if (this.maxEntryBytes !== null && sizeBytes > this.maxEntryBytes) {
          throw new GeodataError(
            'CACHE_ENTRY_TOO_LARGE',
            'The verified geodata artifact exceeded its cache entry byte limit.',
            { statusCode: 502, retryable: false }
          );
        }

        const fetchedAt = this.clock();
        if (this.#entries.get(key) === entry) {
          entry.pendingReservationBytes = 0;
          this.#ensureResolvedCapacity(key, sizeBytes);
          const resolved = {
            value,
            sizeBytes,
            fetchedAt,
            expiresAt: fetchedAt + freshTtlMs,
            staleUntil: fetchedAt + freshTtlMs + staleIfErrorMs,
            lastAccess: fetchedAt,
            pending: null,
            pendingReservationBytes: 0
          };
          this.#entries.set(key, resolved);
          this.#touch(key, resolved);
          return {
            value,
            cacheStatus: 'miss',
            fresh: true,
            fetchedAtMs: resolved.fetchedAt,
            expiresAtMs: resolved.expiresAt,
            staleUntilMs: resolved.staleUntil
          };
        }

        return {
          value,
          cacheStatus: 'miss',
          fresh: true,
          fetchedAtMs: fetchedAt,
          expiresAtMs: fetchedAt + freshTtlMs,
          staleUntilMs: fetchedAt + freshTtlMs + staleIfErrorMs
        };
      })
      .catch((error) => {
        const failedAt = this.clock();
        entry.pending = null;
        entry.pendingReservationBytes = 0;
        if (staleCandidate && failedAt <= staleCandidate.staleUntil) {
          this.#counters.staleServed += 1;
          staleCandidate.lastAccess = failedAt;
          if (this.#entries.get(key) === entry) {
            this.#entries.set(key, staleCandidate);
            this.#touch(key, staleCandidate);
          }
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

  #measureValue(value) {
    let sizeBytes;
    try {
      sizeBytes = this.sizeOf(value);
    } catch (error) {
      throw new GeodataError(
        'CACHE_VALUE_UNMEASURABLE',
        'The verified geodata artifact could not be measured for bounded cache admission.',
        { statusCode: 500, retryable: false, cause: error }
      );
    }
    if (!Number.isSafeInteger(sizeBytes) || sizeBytes < 0) {
      throw new GeodataError(
        'CACHE_VALUE_UNMEASURABLE',
        'The verified geodata artifact reported an invalid cache byte length.',
        { statusCode: 500, retryable: false }
      );
    }
    return sizeBytes;
  }

  #touch(key, entry) {
    this.#entries.delete(key);
    this.#entries.set(key, entry);
  }

  #byteUsage(excludedKey = null) {
    let residentBytes = 0;
    let pendingReservationBytes = 0;
    for (const [key, entry] of this.#entries) {
      if (key === excludedKey) continue;
      residentBytes += entry.sizeBytes;
      pendingReservationBytes += entry.pendingReservationBytes;
    }
    return { residentBytes, pendingReservationBytes };
  }

  #ensureCapacity(incomingKey, reservationBytes) {
    const incomingExists = this.#entries.has(incomingKey);
    while (true) {
      const usage = this.#byteUsage();
      const entryLimitExceeded = !incomingExists && this.#entries.size >= this.maxEntries;
      const byteLimitExceeded = this.maxBytes !== null
        && usage.residentBytes + usage.pendingReservationBytes + reservationBytes > this.maxBytes;
      if (!entryLimitExceeded && !byteLimitExceeded) return;
      if (!this.#evictOne(incomingKey)) this.#throwBusy();
    }
  }

  #ensureResolvedCapacity(key, sizeBytes) {
    if (this.maxBytes === null) return;
    while (true) {
      const usage = this.#byteUsage(key);
      if (usage.residentBytes + usage.pendingReservationBytes + sizeBytes <= this.maxBytes) return;
      if (!this.#evictOne(key)) this.#throwBusy();
    }
  }

  #evictOne(excludedKey) {
    for (const [key, entry] of this.#entries) {
      if (key !== excludedKey && !entry.pending) {
        this.#entries.delete(key);
        this.#counters.evictions += 1;
        return true;
      }
    }
    return false;
  }

  #throwBusy() {
    throw new GeodataError(
      'CACHE_BUSY',
      'The bounded geodata cache is occupied by in-flight artifacts; retry shortly.',
      { statusCode: 503, retryable: true }
    );
  }
}
