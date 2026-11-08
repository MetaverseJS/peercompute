/**
 * @fileoverview Bounded local-only byte cache for source artifacts.
 *
 * This tier is deliberately separate from the StateManager Y.Doc and from
 * y-indexeddb. Cache keys, response bytes, and access metadata therefore never
 * enter PeerCompute replication. IndexedDB is an optional cold tier; failures
 * disable only that tier while the bounded in-memory cache keeps working.
 */

export const LOCAL_ARTIFACT_CACHE_SCHEMA = 'peercompute.local-artifact.v1';
export const LOCAL_ARTIFACT_CACHE_DATABASE = 'peercompute-local-artifacts-v1';
export const LOCAL_ARTIFACT_CACHE_STORE = 'artifacts';

const DEFAULT_MAXIMUM_ENTRIES = 64;
const DEFAULT_MAXIMUM_BYTES = 32 * 1024 * 1024;
const DEFAULT_MAXIMUM_ENTRY_BYTES = 8 * 1024 * 1024;
const MAXIMUM_METADATA_BYTES = 16 * 1024;
const MAXIMUM_KEY_LENGTH = 2_048;
const MAXIMUM_NAME_LENGTH = 96;

function codedError(ErrorType, code, message) {
  const error = new ErrorType(message);
  error.code = code;
  return error;
}

function abortError() {
  if (typeof DOMException === 'function') return new DOMException('The operation was aborted.', 'AbortError');
  const error = new Error('The operation was aborted.');
  error.name = 'AbortError';
  return error;
}

function throwIfAborted(signal) {
  if (signal?.aborted) throw signal.reason ?? abortError();
}

function positiveInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new RangeError(`${label} must be a positive safe integer.`);
  }
  return value;
}

function finiteTimestamp(value, label) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a finite non-negative timestamp.`);
  }
  return value;
}

function normalizeName(value) {
  const name = String(value ?? '').trim();
  if (!name || name.length > MAXIMUM_NAME_LENGTH || !/^[a-z0-9][a-z0-9._-]*$/iu.test(name)) {
    throw new TypeError('Local artifact cache name must be a short identifier containing letters, numbers, dot, dash, or underscore.');
  }
  return name;
}

function normalizeKey(value) {
  const key = String(value ?? '');
  if (!key || key.length > MAXIMUM_KEY_LENGTH) {
    throw new TypeError(`Local artifact cache keys must contain 1-${MAXIMUM_KEY_LENGTH} characters.`);
  }
  return key;
}

function normalizeIdentifier(value, label) {
  const normalized = String(value ?? '').trim();
  if (!normalized || normalized.length > 256) {
    throw new TypeError(`${label} must be a non-empty string of at most 256 characters.`);
  }
  return normalized;
}

function normalizeMediaType(value) {
  const normalized = normalizeIdentifier(value, 'mediaType').split(';', 1)[0].trim().toLowerCase();
  if (!/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/u.test(normalized)) {
    throw new TypeError('mediaType must be a valid MIME type.');
  }
  return normalized;
}

function copyBytes(value) {
  if (value instanceof Uint8Array) return value.slice();
  if (value instanceof ArrayBuffer) return new Uint8Array(value.slice(0));
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength).slice();
  }
  throw new TypeError('Local artifact cache values must contain ArrayBuffer or typed-array bytes.');
}

function cloneMetadata(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('Local artifact metadata must be an object.');
  }
  let serialized;
  try {
    serialized = JSON.stringify(value);
  } catch {
    throw new TypeError('Local artifact metadata must be JSON-serializable.');
  }
  if (serialized === undefined) serialized = '{}';
  const byteLength = new TextEncoder().encode(serialized).byteLength;
  if (byteLength > MAXIMUM_METADATA_BYTES) {
    throw codedError(
      RangeError,
      'ERR_LOCAL_ARTIFACT_METADATA_TOO_LARGE',
      `Local artifact metadata exceeds the ${MAXIMUM_METADATA_BYTES}-byte cap.`
    );
  }
  const metadata = JSON.parse(serialized);
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new TypeError('Local artifact metadata must serialize to an object.');
  }
  return { metadata, byteLength };
}

async function sha256(bytes) {
  if (!globalThis.crypto?.subtle?.digest) {
    throw codedError(
      Error,
      'ERR_LOCAL_ARTIFACT_HASH_UNAVAILABLE',
      'SHA-256 is unavailable; local artifacts cannot be admitted without integrity metadata.'
    );
  }
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return `sha256:${Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, '0')).join('')}`;
}

function publicMetadata(metadata) {
  return Object.freeze(cloneMetadata(metadata).metadata);
}

function publicResult(entry, cacheStatus, extra = {}) {
  return Object.freeze({
    bytes: entry.bytes.slice(),
    metadata: publicMetadata(entry.metadata),
    cacheStatus,
    ...extra
  });
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed.'));
  });
}

function transactionResult(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted.'));
  });
}

function persistentRecordId(cacheName, key) {
  return `${cacheName}\u0000${key}`;
}

/**
 * Byte-bounded local source-artifact cache with optional IndexedDB persistence.
 */
export class LocalArtifactCache {
  constructor({
    name,
    maximumEntries = DEFAULT_MAXIMUM_ENTRIES,
    maximumBytes = DEFAULT_MAXIMUM_BYTES,
    maximumEntryBytes = Math.min(DEFAULT_MAXIMUM_ENTRY_BYTES, maximumBytes),
    persistent = true,
    clock = Date.now,
    indexedDBImpl = globalThis.indexedDB,
    onDestroy = null
  } = {}) {
    this.name = normalizeName(name);
    this.maximumEntries = positiveInteger(maximumEntries, 'maximumEntries');
    this.maximumBytes = positiveInteger(maximumBytes, 'maximumBytes');
    this.maximumEntryBytes = positiveInteger(maximumEntryBytes, 'maximumEntryBytes');
    if (this.maximumEntryBytes > this.maximumBytes) {
      throw new RangeError('maximumEntryBytes must not exceed maximumBytes.');
    }
    if (typeof clock !== 'function') throw new TypeError('clock must be a function.');
    if (onDestroy !== null && typeof onDestroy !== 'function') {
      throw new TypeError('onDestroy must be a function or null.');
    }

    this.clock = clock;
    this.indexedDB = indexedDBImpl;
    this.persistenceConfigured = persistent === true;
    this.persistenceAvailable = this.persistenceConfigured && typeof indexedDBImpl?.open === 'function';
    this.onDestroy = onDestroy;

    this.entries = new Map();
    this.inflight = new Map();
    this.residentBytes = 0;
    this.reservedBytes = 0;
    this.databasePromise = null;
    this.database = null;
    this.persistenceQueue = Promise.resolve();
    this.destroyed = false;
    this.generation = 0;

    this.counters = {
      hits: 0,
      misses: 0,
      coalesced: 0,
      stale: 0,
      evictions: 0,
      rejected: 0,
      validationFailures: 0,
      persistenceFailures: 0
    };
  }

  #assertActive() {
    if (this.destroyed) throw codedError(Error, 'ERR_LOCAL_ARTIFACT_CACHE_DESTROYED', 'Local artifact cache is destroyed.');
  }

  #touch(key, entry) {
    entry.metadata.accessedAt = this.clock();
    this.entries.delete(key);
    this.entries.set(key, entry);
  }

  #removeMemory(key, { eviction = false } = {}) {
    const entry = this.entries.get(key);
    if (!entry) return false;
    this.entries.delete(key);
    this.residentBytes = Math.max(0, this.residentBytes - entry.storageBytes);
    if (eviction) this.counters.evictions += 1;
    return true;
  }

  #evictFor({ key, entryBytes = null, reservationBytes = 0 } = {}) {
    const existing = this.entries.get(key);
    const existingBytes = existing?.storageBytes ?? 0;
    const overCapacity = () => {
      const replacingEntry = entryBytes !== null;
      const projectedEntries = this.entries.size + (replacingEntry && !existing ? 1 : 0);
      const projectedBytes = replacingEntry
        ? this.residentBytes - existingBytes + entryBytes + this.reservedBytes + reservationBytes
        : this.residentBytes + this.reservedBytes + reservationBytes;
      return projectedEntries > this.maximumEntries || projectedBytes > this.maximumBytes;
    };
    while (overCapacity()) {
      let evicted = false;
      for (const candidateKey of this.entries.keys()) {
        if (candidateKey === key) continue;
        this.#removeMemory(candidateKey, { eviction: true });
        evicted = true;
        break;
      }
      if (!evicted) return false;
    }
    return true;
  }

  #remember(key, entry) {
    if (entry.storageBytes > this.maximumEntryBytes
      || entry.bytes.byteLength > this.maximumEntryBytes) {
      this.counters.rejected += 1;
      return false;
    }
    if (!this.#evictFor({ key, entryBytes: entry.storageBytes })) {
      this.counters.rejected += 1;
      return false;
    }
    this.#removeMemory(key);
    this.entries.set(key, entry);
    this.residentBytes += entry.storageBytes;
    return true;
  }

  #reserve(key) {
    const existingBytes = this.entries.get(key)?.storageBytes ?? 0;
    const reservation = Math.max(0, this.maximumEntryBytes - Math.min(existingBytes, this.maximumEntryBytes));
    if (this.inflight.size >= this.maximumEntries
      || !this.#evictFor({ key, reservationBytes: reservation })) {
      this.counters.rejected += 1;
      throw codedError(
        Error,
        'ERR_LOCAL_ARTIFACT_CACHE_BUSY',
        'Local artifact cache has no bounded capacity for another in-flight load.'
      );
    }
    this.reservedBytes += reservation;
    return reservation;
  }

  #releaseReservation(reservation) {
    this.reservedBytes = Math.max(0, this.reservedBytes - reservation);
  }

  async #openDatabase() {
    if (!this.persistenceAvailable || this.destroyed) return null;
    if (this.database) return this.database;
    if (!this.databasePromise) {
      this.databasePromise = new Promise((resolve, reject) => {
        let request;
        try {
          request = this.indexedDB.open(LOCAL_ARTIFACT_CACHE_DATABASE, 1);
        } catch (error) {
          reject(error);
          return;
        }
        request.onupgradeneeded = () => {
          const database = request.result;
          if (!database.objectStoreNames.contains(LOCAL_ARTIFACT_CACHE_STORE)) {
            database.createObjectStore(LOCAL_ARTIFACT_CACHE_STORE, { keyPath: 'id' });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('Unable to open the local artifact database.'));
        request.onblocked = () => reject(new Error('Opening the local artifact database was blocked.'));
      }).then((database) => {
        this.database = database;
        database.onversionchange = () => {
          database.close();
          if (this.database === database) this.database = null;
        };
        return database;
      }).catch((error) => {
        this.#disablePersistence(error);
        return null;
      });
    }
    return this.databasePromise;
  }

  #disablePersistence(_error) {
    if (this.persistenceAvailable) this.counters.persistenceFailures += 1;
    this.persistenceAvailable = false;
    try { this.database?.close?.(); } catch { /* Best-effort close. */ }
    this.database = null;
  }

  async #readPersistent(key) {
    const database = await this.#openDatabase();
    if (!database) return null;
    let record;
    try {
      const transaction = database.transaction(LOCAL_ARTIFACT_CACHE_STORE, 'readonly');
      const completion = transactionResult(transaction);
      void completion.catch(() => {});
      const request = transaction.objectStore(LOCAL_ARTIFACT_CACHE_STORE).get(persistentRecordId(this.name, key));
      record = await requestResult(request);
      await completion;
    } catch (error) {
      this.#disablePersistence(error);
      return null;
    }
    if (!record || record.cacheName !== this.name || record.key !== key) return null;
    try {
      return {
        bytes: copyBytes(record.bytes),
        metadata: cloneMetadata(record.metadata).metadata,
        storageBytes: Number(record.storageBytes)
      };
    } catch {
      // Return an invalid sentinel so the caller deletes only this corrupt
      // record without disabling an otherwise healthy IndexedDB tier.
      return { bytes: null, metadata: null, storageBytes: Number.NaN };
    }
  }

  async #writePersistent(key, entry) {
    const database = await this.#openDatabase();
    if (!database) return;
    try {
      const transaction = database.transaction(LOCAL_ARTIFACT_CACHE_STORE, 'readwrite');
      const completion = transactionResult(transaction);
      void completion.catch(() => {});
      const store = transaction.objectStore(LOCAL_ARTIFACT_CACHE_STORE);
      store.put({
        id: persistentRecordId(this.name, key),
        cacheName: this.name,
        key,
        bytes: entry.bytes.slice(),
        metadata: cloneMetadata(entry.metadata).metadata,
        storageBytes: entry.storageBytes
      });
      const allRecords = await requestResult(store.getAll());
      const records = allRecords
        .filter((record) => record?.cacheName === this.name)
        .sort((left, right) => (
          Number(left.metadata?.accessedAt ?? 0) - Number(right.metadata?.accessedAt ?? 0)
          || String(left.id).localeCompare(String(right.id))
        ));
      let byteCount = records.reduce((total, record) => {
        const size = Number(record.storageBytes);
        return total + (Number.isSafeInteger(size) && size >= 0 ? size : this.maximumBytes + 1);
      }, 0);
      while (records.length > this.maximumEntries || byteCount > this.maximumBytes) {
        const evicted = records.shift();
        if (!evicted) break;
        const size = Number(evicted.storageBytes);
        byteCount -= Number.isSafeInteger(size) && size >= 0 ? size : this.maximumBytes + 1;
        store.delete(evicted.id);
      }
      await completion;
    } catch (error) {
      this.#disablePersistence(error);
    }
  }

  async #deletePersistent(key) {
    const database = await this.#openDatabase();
    if (!database) return;
    try {
      const transaction = database.transaction(LOCAL_ARTIFACT_CACHE_STORE, 'readwrite');
      const completion = transactionResult(transaction);
      void completion.catch(() => {});
      transaction.objectStore(LOCAL_ARTIFACT_CACHE_STORE).delete(persistentRecordId(this.name, key));
      await completion;
    } catch (error) {
      this.#disablePersistence(error);
    }
  }

  async #clearPersistent() {
    const database = await this.#openDatabase();
    if (!database) return;
    try {
      const transaction = database.transaction(LOCAL_ARTIFACT_CACHE_STORE, 'readwrite');
      const completion = transactionResult(transaction);
      void completion.catch(() => {});
      const store = transaction.objectStore(LOCAL_ARTIFACT_CACHE_STORE);
      const allRecords = await requestResult(store.getAll());
      for (const record of allRecords) {
        if (record?.cacheName === this.name) store.delete(record.id);
      }
      await completion;
    } catch (error) {
      this.#disablePersistence(error);
    }
  }

  #queuePersistence(operation) {
    if (!this.persistenceAvailable) return Promise.resolve();
    const pending = this.persistenceQueue.then(operation, operation);
    this.persistenceQueue = pending.catch(() => {});
    return pending;
  }

  async #validateEntry(entry, validate) {
    const metadata = entry?.metadata;
    if (!entry?.bytes || metadata?.schema !== LOCAL_ARTIFACT_CACHE_SCHEMA
      || entry.bytes.byteLength > this.maximumEntryBytes
      || !Number.isSafeInteger(entry.storageBytes)
      || entry.storageBytes !== entry.bytes.byteLength
      || entry.storageBytes > this.maximumBytes
      || !Number.isFinite(metadata.byteLength)
      || metadata.byteLength !== entry.bytes.byteLength
      || typeof metadata.sha256 !== 'string'
      || typeof metadata.sourceId !== 'string'
      || typeof metadata.mediaType !== 'string'
      || !Number.isFinite(metadata.freshUntil)
      || !Number.isFinite(metadata.staleUntil)
      || metadata.staleUntil < metadata.freshUntil) {
      throw codedError(Error, 'ERR_LOCAL_ARTIFACT_SCHEMA', 'Local artifact metadata is invalid.');
    }
    const digest = await sha256(entry.bytes);
    if (digest !== metadata.sha256) {
      throw codedError(Error, 'ERR_LOCAL_ARTIFACT_INTEGRITY', 'Local artifact SHA-256 does not match its bytes.');
    }
    if (validate) {
      const accepted = await validate(entry.bytes.slice(), publicMetadata(metadata));
      if (accepted === false) {
        throw codedError(Error, 'ERR_LOCAL_ARTIFACT_VALIDATION', 'Local artifact validator rejected the bytes.');
      }
    }
    return entry;
  }

  async #findEntry(key, { allowStale = false, validate, sourceId, mediaType } = {}) {
    let entry = this.entries.get(key) ?? null;
    let fromPersistence = false;
    if (!entry) {
      entry = await this.#readPersistent(key);
      fromPersistence = Boolean(entry);
    }
    if (!entry) return null;
    try {
      if (sourceId && entry.metadata.sourceId !== sourceId) {
        throw codedError(Error, 'ERR_LOCAL_ARTIFACT_SOURCE', 'Local artifact source identifier does not match.');
      }
      if (mediaType && entry.metadata.mediaType !== mediaType) {
        throw codedError(Error, 'ERR_LOCAL_ARTIFACT_MEDIA_TYPE', 'Local artifact media type does not match.');
      }
      if (fromPersistence) await this.#validateEntry(entry, validate);
    } catch {
      this.counters.validationFailures += 1;
      this.#removeMemory(key);
      await this.#queuePersistence(() => this.#deletePersistent(key));
      return null;
    }

    const now = this.clock();
    if (now > entry.metadata.staleUntil) {
      this.#removeMemory(key);
      await this.#queuePersistence(() => this.#deletePersistent(key));
      return null;
    }
    const fresh = now < entry.metadata.freshUntil;
    if (!fresh && !allowStale) return null;
    if (fromPersistence) this.#remember(key, entry);
    if (this.entries.has(key)) this.#touch(key, entry);
    void this.#queuePersistence(() => this.#writePersistent(key, entry));
    return { entry, fresh };
  }

  async read(keyValue, { validate, allowStale = false, signal } = {}) {
    this.#assertActive();
    const key = normalizeKey(keyValue);
    if (validate !== undefined && typeof validate !== 'function') throw new TypeError('validate must be a function.');
    throwIfAborted(signal);
    const found = await this.#findEntry(key, { allowStale, validate });
    throwIfAborted(signal);
    if (!found) return null;
    if (found.fresh) this.counters.hits += 1;
    else this.counters.stale += 1;
    return publicResult(found.entry, found.fresh ? 'hit' : 'stale');
  }

  async #buildEntry({ bytes: inputBytes, metadata: loaderMetadata = {} }, options) {
    const bytes = copyBytes(inputBytes);
    if (bytes.byteLength > this.maximumEntryBytes) {
      this.counters.rejected += 1;
      throw codedError(
        RangeError,
        'ERR_LOCAL_ARTIFACT_ENTRY_TOO_LARGE',
        `Local artifact exceeds the ${this.maximumEntryBytes}-byte entry cap.`
      );
    }
    const { metadata: suppliedMetadata } = cloneMetadata(loaderMetadata);
    const now = this.clock();
    const requestedFreshUntil = finiteTimestamp(options.freshUntil, 'freshUntil');
    const requestedStaleUntil = finiteTimestamp(options.staleUntil, 'staleUntil');
    if (requestedStaleUntil < requestedFreshUntil) {
      throw new RangeError('staleUntil must be greater than or equal to freshUntil.');
    }
    const suppliedFreshUntil = Number.isFinite(suppliedMetadata.freshUntil)
      ? suppliedMetadata.freshUntil
      : requestedFreshUntil;
    const suppliedStaleUntil = Number.isFinite(suppliedMetadata.staleUntil)
      ? suppliedMetadata.staleUntil
      : requestedStaleUntil;
    const staleUntil = Math.min(requestedStaleUntil, suppliedStaleUntil);
    const freshUntil = Math.min(requestedFreshUntil, suppliedFreshUntil, staleUntil);
    const digest = await sha256(bytes);
    const metadata = {
      ...suppliedMetadata,
      schema: LOCAL_ARTIFACT_CACHE_SCHEMA,
      sourceId: options.sourceId,
      mediaType: options.mediaType,
      byteLength: bytes.byteLength,
      sha256: digest,
      createdAt: now,
      accessedAt: now,
      freshUntil,
      staleUntil
    };
    const normalizedMetadata = cloneMetadata(metadata);
    const entry = {
      bytes,
      metadata: normalizedMetadata.metadata,
      // maximumBytes governs immutable response bytes. Metadata has its own
      // 16 KiB per-entry cap plus the entry-count cap, so both allocations are
      // bounded without reducing the advertised source-byte capacity.
      storageBytes: bytes.byteLength
    };
    if (options.validate) {
      try {
        const accepted = await options.validate(bytes.slice(), publicMetadata(entry.metadata));
        if (accepted === false) {
          throw codedError(Error, 'ERR_LOCAL_ARTIFACT_VALIDATION', 'Local artifact validator rejected the bytes.');
        }
      } catch (error) {
        this.counters.validationFailures += 1;
        throw error;
      }
    }
    return entry;
  }

  #subscribe(record, signal, coalesced) {
    throwIfAborted(signal);
    const token = {};
    record.subscribers.add(token);
    if (coalesced) this.counters.coalesced += 1;
    return new Promise((resolve, reject) => {
      let settled = false;
      const cleanup = () => {
        if (settled) return;
        settled = true;
        signal?.removeEventListener?.('abort', onAbort);
        record.subscribers.delete(token);
      };
      const onAbort = () => {
        cleanup();
        if (!record.settled && record.subscribers.size === 0) record.controller.abort();
        reject(signal.reason ?? abortError());
      };
      signal?.addEventListener?.('abort', onAbort, { once: true });
      record.promise.then(
        (result) => {
          cleanup();
          resolve(coalesced ? Object.freeze({ ...result, cacheStatus: 'coalesced' }) : result);
        },
        (error) => {
          cleanup();
          reject(error);
        }
      );
    });
  }

  async getOrLoad({
    key: keyValue,
    sourceId: sourceIdValue,
    mediaType: mediaTypeValue,
    freshUntil,
    staleUntil,
    signal,
    loader,
    validate
  } = {}) {
    this.#assertActive();
    const key = normalizeKey(keyValue);
    const sourceId = normalizeIdentifier(sourceIdValue, 'sourceId');
    const mediaType = normalizeMediaType(mediaTypeValue);
    if (typeof loader !== 'function') throw new TypeError('loader must be a function.');
    if (validate !== undefined && typeof validate !== 'function') throw new TypeError('validate must be a function.');
    finiteTimestamp(freshUntil, 'freshUntil');
    finiteTimestamp(staleUntil, 'staleUntil');
    if (staleUntil < freshUntil) throw new RangeError('staleUntil must be greater than or equal to freshUntil.');
    throwIfAborted(signal);

    let pending = this.inflight.get(key);
    if (pending) return this.#subscribe(pending, signal, true);

    const cached = await this.#findEntry(key, {
      allowStale: true,
      validate,
      sourceId,
      mediaType
    });
    throwIfAborted(signal);
    if (cached?.fresh) {
      this.counters.hits += 1;
      return publicResult(cached.entry, 'hit');
    }

    pending = this.inflight.get(key);
    if (pending) return this.#subscribe(pending, signal, true);

    const reservation = this.#reserve(key);
    const generation = this.generation;
    const controller = new AbortController();
    const record = {
      controller,
      subscribers: new Set(),
      settled: false,
      invalidated: false,
      promise: null
    };
    let reservationReleased = false;
    record.promise = Promise.resolve()
      .then(() => loader({ signal: controller.signal, maximumBytes: this.maximumEntryBytes }))
      .then((loaded) => {
        if (controller.signal.aborted) throw controller.signal.reason ?? abortError();
        const normalized = loaded && typeof loaded === 'object' && 'bytes' in loaded
          ? loaded
          : { bytes: loaded, metadata: {} };
        return this.#buildEntry(normalized, {
          sourceId,
          mediaType,
          freshUntil,
          staleUntil,
          validate
        });
      })
      .then(async (entry) => {
        this.#releaseReservation(reservation);
        reservationReleased = true;
        if (!controller.signal.aborted && !record.invalidated
          && !this.destroyed && generation === this.generation) {
          this.#remember(key, entry);
          if (this.entries.get(key) === entry) {
            await this.#queuePersistence(() => this.#writePersistent(key, entry));
          }
        }
        this.counters.misses += 1;
        return publicResult(entry, 'miss');
      })
      .catch((error) => {
        if (cached && this.clock() <= cached.entry.metadata.staleUntil) {
          this.counters.stale += 1;
          return publicResult(cached.entry, 'stale', {
            refreshErrorCode: typeof error?.code === 'string' ? error.code : 'UPSTREAM_REFRESH_FAILED'
          });
        }
        throw error;
      })
      .finally(() => {
        record.settled = true;
        if (!reservationReleased) this.#releaseReservation(reservation);
        if (this.inflight.get(key) === record) this.inflight.delete(key);
      });
    this.inflight.set(key, record);
    return this.#subscribe(record, signal, false);
  }

  async delete(keyValue) {
    this.#assertActive();
    const key = normalizeKey(keyValue);
    const pending = this.inflight.get(key);
    if (pending) pending.invalidated = true;
    pending?.controller.abort();
    this.#removeMemory(key);
    await this.#queuePersistence(() => this.#deletePersistent(key));
  }

  async clear() {
    this.#assertActive();
    this.generation += 1;
    for (const pending of this.inflight.values()) {
      pending.invalidated = true;
      pending.controller.abort();
    }
    this.entries.clear();
    this.residentBytes = 0;
    await this.#queuePersistence(() => this.#clearPersistent());
  }

  getStats() {
    const now = this.clock();
    let fresh = 0;
    let stale = 0;
    for (const entry of this.entries.values()) {
      if (now < entry.metadata.freshUntil) fresh += 1;
      else if (now <= entry.metadata.staleUntil) stale += 1;
    }
    return Object.freeze({
      schema: 'peercompute.local-artifact-cache-stats.v1',
      entries: this.entries.size,
      freshEntries: fresh,
      staleEntries: stale,
      residentBytes: this.residentBytes,
      maximumEntries: this.maximumEntries,
      maximumBytes: this.maximumBytes,
      maximumEntryBytes: this.maximumEntryBytes,
      pending: this.inflight.size,
      reservedBytes: this.reservedBytes,
      persistenceConfigured: this.persistenceConfigured,
      persistenceAvailable: this.persistenceAvailable,
      ...this.counters
    });
  }

  async destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.generation += 1;
    for (const pending of this.inflight.values()) {
      pending.invalidated = true;
      pending.controller.abort();
    }
    await Promise.allSettled([...this.inflight.values()].map((pending) => pending.promise));
    await this.persistenceQueue.catch(() => {});
    this.entries.clear();
    this.inflight.clear();
    this.residentBytes = 0;
    this.reservedBytes = 0;
    try { this.database?.close?.(); } catch { /* Best-effort close. */ }
    this.database = null;
    this.onDestroy?.(this);
    this.onDestroy = null;
  }
}
