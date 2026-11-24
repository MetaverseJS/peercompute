/**
 * Bounded compare-and-swap multi-consumer reservation ledger.
 *
 * Declared model: one ledger instance in one JavaScript realm is the authority.
 * Every operation is a synchronous compare-and-swap on that realm's state, so
 * any number of asynchronous consumers (workers routed through this realm,
 * interleaved async tasks, lanes) observe a single linear order. Nothing here
 * claims distributed exactly-once: CRDT replicas of the optional audit record
 * are evidence, never authority.
 *
 * Per key:
 *   free(epoch) --reserve--> reserved(epoch, reservationId, owner)
 *   reserved --commit--> consumed(epoch, admission)      (exactly once)
 *   reserved --cancel--> free(epoch)                      (losers may retry)
 *   any --retire--> free(epoch + 1)                       (epoch fence)
 * A token is valid only while its reservationId is the key's live reservation
 * at the token's epoch, and only in the ledger that issued it. Resources
 * attached to a reservation are released exactly once: on cancel, on retire,
 * or on ledger destruction (a committed reservation keeps them until retire).
 */
let ledgerSerial = 0;

export const RESERVATION_LEDGER_SCHEMA = 'peercompute.reservation-ledger.v1';

export class ReservationLedger {
  constructor({ name = 'default', maxKeys = 4096, audit = null, now = () => Date.now(), onDestroy = null } = {}) {
    if (!Number.isSafeInteger(maxKeys) || maxKeys < 1) throw new RangeError('maxKeys must be a positive integer');
    this.name = String(name);
    this.ledgerId = `${this.name}#${++ledgerSerial}:${Math.random().toString(36).slice(2, 10)}`;
    this.maxKeys = maxKeys;
    this.audit = typeof audit === 'function' ? audit : null;
    this.now = now;
    this.onDestroy = typeof onDestroy === 'function' ? onDestroy : null;
    this.keys = new Map();
    this.nextReservationId = 1;
    this.destroyed = false;
    this.counters = { reserved: 0, committed: 0, cancelled: 0, retired: 0, rejected: 0, released: 0, releaseErrors: 0 };
  }

  _record(key) { return this.keys.get(String(key)) ?? null; }

  _reject(reason, extra = {}) {
    this.counters.rejected += 1;
    return Object.freeze({ ok: false, reason, ...extra });
  }

  _emit(event, record) {
    if (!this.audit) return;
    try {
      this.audit(Object.freeze({
        schema: RESERVATION_LEDGER_SCHEMA, ledgerId: this.ledgerId, event, key: record.key,
        epoch: record.epoch, state: record.state, owner: record.owner ?? null,
        reservationId: record.reservationId ?? null, admissionId: record.admissionId ?? null, at: this.now()
      }));
    } catch { /* audit is evidence only; it can never change authority */ }
  }

  _takeResources(record) {
    const releases = record.resources;
    record.resources = [];
    return releases;
  }

  _release(releases) {
    for (const release of releases) {
      try { release(); this.counters.released += 1; } catch { this.counters.releaseErrors += 1; }
    }
  }

  _tokenRecord(token) {
    if (!token || token.ledgerId !== this.ledgerId) return { error: 'foreign-ledger' };
    const record = this._record(token.key);
    if (!record) return { error: 'unknown-key' };
    if (record.epoch !== token.epoch) return { error: 'stale-epoch', record };
    if (record.reservationId !== token.reservationId) {
      return { error: record.state === 'consumed' && record.consumedReservationId === token.reservationId ? 'replay' : 'not-owner', record };
    }
    return { record };
  }

  /** The key's current fence: { epoch, state } (a missing key is free at epoch 0). */
  fence(key) {
    const record = this._record(key);
    return Object.freeze({ epoch: record?.epoch ?? 0, state: record?.state ?? 'free', owner: record?.owner ?? null });
  }

  /**
   * CAS: reserve `key` for `consumerId` iff it is free at `expectedEpoch`.
   * Losers learn the state and the epoch to retry against.
   */
  reserve({ key, consumerId, expectedEpoch = null } = {}) {
    if (this.destroyed) return this._reject('destroyed');
    const k = String(key ?? '');
    if (!k || consumerId == null) return this._reject('invalid-request');
    const owner = String(consumerId);
    let record = this._record(k);
    if (!record) {
      if (expectedEpoch != null && expectedEpoch !== 0) {
        return this._reject('stale-epoch', { epoch: 0 });
      }
      if (this.keys.size >= this.maxKeys) return this._reject('capacity', { maxKeys: this.maxKeys });
      record = { key: k, epoch: 0, state: 'free', owner: null, reservationId: null, resources: [] };
      this.keys.set(k, record);
    }
    if (expectedEpoch != null && expectedEpoch !== record.epoch) {
      return this._reject('stale-epoch', { epoch: record.epoch });
    }
    if (record.state === 'reserved') return this._reject('busy', { epoch: record.epoch, owner: record.owner });
    if (record.state === 'consumed') return this._reject('consumed', { epoch: record.epoch, admissionId: record.admissionId });
    record.state = 'reserved';
    record.owner = owner;
    record.reservationId = this.nextReservationId++;
    this.counters.reserved += 1;
    const result = Object.freeze({ ok: true, token: Object.freeze({
      ledgerId: this.ledgerId, key: k, epoch: record.epoch, reservationId: record.reservationId, owner: record.owner }) });
    this._emit('reserve', record);
    return result;
  }

  /** Attach a release callback to a live reservation (run exactly once). */
  attach(token, release) {
    if (this.destroyed) return this._reject('destroyed');
    if (typeof release !== 'function') return this._reject('invalid-request');
    const { record, error } = this._tokenRecord(token);
    if (error) return this._reject(error);
    if (record.state !== 'reserved') return this._reject('not-reserved');
    record.resources.push(release);
    return Object.freeze({ ok: true });
  }

  /** Exactly-once admission of the live reservation. */
  commit(token, { admissionId = null } = {}) {
    if (this.destroyed) return this._reject('destroyed');
    const { record, error } = this._tokenRecord(token);
    if (error) return this._reject(error, record ? { epoch: record.epoch } : {});
    if (record.state !== 'reserved') return this._reject('not-reserved');
    record.state = 'consumed';
    record.admissionId = admissionId ?? `${record.key}@${record.epoch}#${record.reservationId}`;
    record.consumedReservationId = record.reservationId;
    record.reservationId = null;
    this.counters.committed += 1;
    const result = Object.freeze({ ok: true, admissionId: record.admissionId, epoch: record.epoch });
    this._emit('commit', record);
    return result;
  }

  /** Release an uncommitted reservation so another consumer may win. */
  cancel(token) {
    if (this.destroyed) return this._reject('destroyed');
    const { record, error } = this._tokenRecord(token);
    if (error) return this._reject(error);
    if (record.state !== 'reserved') return this._reject('not-reserved');
    record.state = 'free';
    record.owner = null;
    record.reservationId = null;
    const releases = this._takeResources(record);
    this.counters.cancelled += 1;
    const result = Object.freeze({ ok: true, epoch: record.epoch });
    // Publish the completed transition before calling external code. A
    // callback may reserve or retire the key again; its state is its own.
    this._emit('cancel', record);
    this._release(releases);
    return result;
  }

  /**
   * Advance the key's fence: every token of an older epoch becomes stale and
   * its resources are released; the key is free at epoch + 1.
   */
  retire(key, { expectedEpoch = null } = {}) {
    if (this.destroyed) return this._reject('destroyed');
    const record = this._record(key);
    if (!record) return this._reject('unknown-key');
    if (expectedEpoch != null && expectedEpoch !== record.epoch) return this._reject('stale-epoch', { epoch: record.epoch });
    record.epoch += 1;
    record.state = 'free';
    record.owner = null;
    record.reservationId = null;
    record.admissionId = null;
    record.consumedReservationId = null;
    const releases = this._takeResources(record);
    this.counters.retired += 1;
    const result = Object.freeze({ ok: true, epoch: record.epoch });
    this._emit('retire', record);
    this._release(releases);
    return result;
  }

  /** Release every attached resource exactly once and refuse further work. */
  destroy() {
    if (this.destroyed) return false;
    // Invalidate every token and detach from owning registries before cleanup
    // callbacks run (allowing cleanup to register a fresh replacement).
    this.destroyed = true;
    const onDestroy = this.onDestroy;
    this.onDestroy = null;
    try { onDestroy?.(this); } catch { /* registry cleanup is best-effort */ }
    for (const record of this.keys.values()) this._release(this._takeResources(record));
    return true;
  }

  snapshot() {
    return Object.freeze({
      schema: RESERVATION_LEDGER_SCHEMA, ledgerId: this.ledgerId, name: this.name, destroyed: this.destroyed,
      keyCount: this.keys.size, maxKeys: this.maxKeys, counters: { ...this.counters },
      liveResources: [...this.keys.values()].reduce((sum, record) => sum + record.resources.length, 0)
    });
  }
}
