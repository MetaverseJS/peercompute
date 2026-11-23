/**
 * Epoch-fenced spatial tile lease coordinator and opaque binary boundary
 * summary exchange primitive built directly on ReservationLedger + StateManager.
 *
 * Strictly domain-agnostic: PeerCompute enforces single-winner CAS tile
 * ownership, monotonic epoch fencing, TTL expiry / peer-loss reassignment, and
 * opaque binary (`ArrayBuffer` / `ArrayBufferView`) boundary summary admission
 * gated strictly on `summaryEpoch === activeEpoch` and owner/token match. All
 * domain/physics interpretation of the payload bytes remains outside PeerCompute.
 */

import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { ReservationLedger } from './ReservationLedger.js';

export const SPATIAL_TILE_LEASE_SCHEMA = 'peercompute.state.spatial-tile-lease.v0';
export const SPATIAL_TILE_BOUNDARY_SCHEMA = 'peercompute.state.spatial-tile-boundary-summary.v0';
export const SPATIAL_TILE_EVENT_SCHEMA = 'peercompute.state.spatial-tile-event.v0';

export const SPATIAL_TILE_STATES = Object.freeze({
  UNASSIGNED: 'unassigned',
  LEASED: 'leased',
  EXPIRED: 'expired',
  EVICTED: 'evicted',
  RETIRED: 'retired'
});

const DEFAULT_TTL_MS = 15_000;
const DEFAULT_MAX_PAYLOAD_BYTES = 4 * 1024 * 1024;
const DEFAULT_MAX_TILES = 65_536;

function normalizePositiveInteger(value, fallback, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeIdentifier(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return '';
  return String(value).trim();
}

function clonePlain(value) {
  if (value == null) return value;
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      // Fall back to JSON cloning for plain diagnostics metadata.
    }
  }
  return JSON.parse(JSON.stringify(value));
}

function extractOpaqueBytes(payload) {
  if (payload instanceof ArrayBuffer) {
    return new Uint8Array(payload.slice(0));
  }
  if (ArrayBuffer.isView(payload)) {
    const view = new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength);
    const copy = new Uint8Array(view.byteLength);
    copy.set(view);
    return copy;
  }
  return null;
}

function normalizeSchemaTag(schema) {
  if (schema === undefined || schema === null) return 'application/octet-stream';
  if (typeof schema !== 'string' || !schema.trim()) return null;
  const trimmed = schema.trim();
  if (trimmed.length > 160) return null;
  return trimmed;
}

export class SpatialTileLeaseBroker {
  constructor({
    name = 'default',
    ledger = null,
    defaultTtlMs = DEFAULT_TTL_MS,
    maxPayloadBytes = DEFAULT_MAX_PAYLOAD_BYTES,
    maxTiles = DEFAULT_MAX_TILES,
    now = () => Date.now(),
    audit = null,
    onEvent = null,
    onBoundaryAdmitted = null,
    stateManager = null,
    auditNamespace = null,
    summaryNamespace = null
  } = {}) {
    if (!Number.isSafeInteger(maxPayloadBytes) || maxPayloadBytes < 1) {
      throw new RangeError('maxPayloadBytes must be a positive safe integer');
    }
    if (!Number.isSafeInteger(maxTiles) || maxTiles < 1) {
      throw new RangeError('maxTiles must be a positive safe integer');
    }
    if (!Number.isSafeInteger(defaultTtlMs) || defaultTtlMs < 1) {
      throw new RangeError('defaultTtlMs must be a positive safe integer');
    }

    this.name = String(name || 'default');
    this.defaultTtlMs = defaultTtlMs;
    this.maxPayloadBytes = maxPayloadBytes;
    this.maxTiles = maxTiles;
    this.now = typeof now === 'function' ? now : () => Date.now();
    this.audit = typeof audit === 'function' ? audit : null;
    this.onEvent = typeof onEvent === 'function' ? onEvent : null;
    this.onBoundaryAdmitted = typeof onBoundaryAdmitted === 'function' ? onBoundaryAdmitted : null;
    this.stateManager = stateManager || null;
    this.auditNamespace = auditNamespace ? String(auditNamespace) : null;
    this.summaryNamespace = summaryNamespace ? String(summaryNamespace) : null;

    this._ownsLedger = !ledger;
    this.ledger = ledger || new ReservationLedger({
      name: `spatial-tiles:${this.name}`,
      maxKeys: maxTiles,
      now: this.now
    });

    this.tiles = new Map(); // tileId -> internal tile record
    this.listeners = new Set();
    this._kernelUnsubscribes = new Set();
    this.destroyed = false;
    this.counters = {
      acquired: 0,
      renewed: 0,
      released: 0,
      expired: 0,
      evicted: 0,
      reassignmentsNeeded: 0,
      acquireRejected: 0,
      boundariesAdmitted: 0,
      boundariesRejected: 0
    };
  }

  _reject(counterKey, reason, extra = {}) {
    if (counterKey && Object.hasOwn(this.counters, counterKey)) {
      this.counters[counterKey] += 1;
    }
    return Object.freeze({ ok: false, reason, ...extra });
  }

  _emit(type, detail = {}) {
    const event = Object.freeze({
      schema: SPATIAL_TILE_EVENT_SCHEMA,
      broker: this.name,
      type,
      at: this.now(),
      ...detail
    });
    if (this.auditNamespace && this.stateManager?.writeScoped && detail.tileId) {
      try {
        this.stateManager.writeScoped(this.auditNamespace, detail.tileId, event);
      } catch {
        // Scoped audit is evidence only; never blocks authority.
      }
    }
    if (this.audit) {
      try { this.audit(event); } catch { /* evidence only */ }
    }
    if (this.onEvent) {
      try { this.onEvent(event); } catch { /* listener errors isolated */ }
    }
    for (const listener of [...this.listeners]) {
      try { listener(event); } catch { /* listener errors isolated */ }
    }
    return event;
  }

  _leaseSnapshot(record) {
    if (!record || !record.activeLease) return null;
    const lease = record.activeLease;
    return Object.freeze({
      schema: SPATIAL_TILE_LEASE_SCHEMA,
      tileId: record.tileId,
      peerId: lease.peerId,
      epoch: lease.epoch,
      token: lease.token,
      state: SPATIAL_TILE_STATES.LEASED,
      acquiredAt: lease.acquiredAt,
      renewedAt: lease.renewedAt,
      expiresAt: lease.expiresAt,
      ttlMs: lease.ttlMs,
      metadata: clonePlain(lease.metadata)
    });
  }

  _summarySnapshot(summary, { includePayload = true } = {}) {
    if (!summary) return null;
    const payloadBytes = includePayload ? new Uint8Array(summary.payloadBytes) : null;
    return Object.freeze({
      schema: SPATIAL_TILE_BOUNDARY_SCHEMA,
      tileId: summary.tileId,
      peerId: summary.peerId,
      epoch: summary.epoch,
      sequence: summary.sequence,
      payloadSchema: summary.payloadSchema,
      byteLength: summary.byteLength,
      sha256: summary.sha256,
      admittedAt: summary.admittedAt,
      metadata: clonePlain(summary.metadata),
      ...(includePayload ? { payload: payloadBytes, buffer: payloadBytes.buffer } : {})
    });
  }

  _resolveTokenOrRef(tokenOrRef) {
    if (!tokenOrRef || typeof tokenOrRef !== 'object') return null;
    if (tokenOrRef.token && typeof tokenOrRef.token === 'object') {
      return tokenOrRef.token;
    }
    if (typeof tokenOrRef.key === 'string' && typeof tokenOrRef.reservationId === 'number') {
      return tokenOrRef;
    }
    return null;
  }

  _ensureTileRecord(tileId) {
    let record = this.tiles.get(tileId);
    if (!record) {
      record = {
        tileId,
        activeLease: null,
        lastState: SPATIAL_TILE_STATES.UNASSIGNED,
        lastOwnerPeerId: null,
        lastBoundary: null,
        boundarySequence: 0
      };
      this.tiles.set(tileId, record);
    }
    return record;
  }

  /**
   * Current fence for a tile: `{ tileId, epoch, state, ownerPeerId, expiresAt }`.
   */
  fence(tileId, { now = this.now() } = {}) {
    const id = normalizeIdentifier(tileId);
    if (!id) {
      return Object.freeze({ tileId: '', epoch: 0, state: SPATIAL_TILE_STATES.UNASSIGNED, ownerPeerId: null, expiresAt: null });
    }
    this.expireLeases(now);
    const ledgerFence = this.ledger.fence(id);
    const record = this.tiles.get(id);
    const active = record?.activeLease || null;
    return Object.freeze({
      tileId: id,
      epoch: ledgerFence.epoch,
      state: active ? SPATIAL_TILE_STATES.LEASED : (record?.lastState || SPATIAL_TILE_STATES.UNASSIGNED),
      ownerPeerId: active?.peerId || null,
      expiresAt: active?.expiresAt || null
    });
  }

  /**
   * Deterministic single-winner CAS tile acquisition (`tileId + epoch`).
   */
  acquireTile({
    tileId,
    peerId,
    expectedEpoch = null,
    ttlMs = this.defaultTtlMs,
    metadata = {},
    now = this.now()
  } = {}) {
    if (this.destroyed) return this._reject('acquireRejected', 'destroyed');
    const id = normalizeIdentifier(tileId);
    const owner = normalizeIdentifier(peerId);
    if (!id || !owner) {
      return this._reject('acquireRejected', 'invalid-request');
    }

    const timestamp = Number.isFinite(Number(now)) ? Number(now) : this.now();
    this.expireLeases(timestamp);

    const existing = this.tiles.get(id);
    if (existing?.activeLease) {
      const current = existing.activeLease;
      if (expectedEpoch != null && Number(expectedEpoch) !== current.epoch) {
        return this._reject('acquireRejected', 'stale-epoch', {
          tileId: id,
          activeEpoch: current.epoch,
          ownerPeerId: current.peerId,
          expiresAt: current.expiresAt
        });
      }
      return this._reject('acquireRejected', 'already-leased', {
        tileId: id,
        activeEpoch: current.epoch,
        ownerPeerId: current.peerId,
        expiresAt: current.expiresAt
      });
    }

    const reserved = this.ledger.reserve({
      key: id,
      consumerId: owner,
      expectedEpoch
    });
    if (!reserved.ok) {
      return this._reject('acquireRejected', reserved.reason, {
        tileId: id,
        activeEpoch: reserved.epoch ?? this.ledger.fence(id).epoch,
        ownerPeerId: reserved.owner ?? null
      });
    }

    const safeTtlMs = normalizePositiveInteger(ttlMs, this.defaultTtlMs, 1);
    const token = reserved.token;
    const record = this._ensureTileRecord(id);
    record.activeLease = {
      tileId: id,
      peerId: owner,
      epoch: token.epoch,
      token,
      acquiredAt: timestamp,
      renewedAt: timestamp,
      expiresAt: timestamp + safeTtlMs,
      ttlMs: safeTtlMs,
      metadata: clonePlain(metadata || {})
    };
    record.lastState = SPATIAL_TILE_STATES.LEASED;
    record.lastOwnerPeerId = owner;
    this.counters.acquired += 1;

    const lease = this._leaseSnapshot(record);
    this._emit('tile-acquired', {
      tileId: id,
      peerId: owner,
      epoch: lease.epoch,
      expiresAt: lease.expiresAt,
      ttlMs: lease.ttlMs
    });
    return Object.freeze({ ok: true, lease });
  }

  /**
   * Renew an active tile lease held by its current owner/token before TTL expiry.
   */
  renewTile(tokenOrRef, { ttlMs = null, now = this.now() } = {}) {
    if (this.destroyed) return this._reject(null, 'destroyed');
    const token = this._resolveTokenOrRef(tokenOrRef);
    if (!token) return this._reject(null, 'invalid-token');

    const timestamp = Number.isFinite(Number(now)) ? Number(now) : this.now();
    this.expireLeases(timestamp);

    const record = this.tiles.get(token.key);
    const active = record?.activeLease || null;
    if (!active) {
      const fence = this.ledger.fence(token.key);
      return this._reject(null, token.epoch !== fence.epoch ? 'stale-epoch' : 'no-active-lease', {
        tileId: token.key,
        activeEpoch: fence.epoch
      });
    }
    if (active.epoch !== token.epoch) {
      return this._reject(null, 'stale-epoch', { tileId: token.key, activeEpoch: active.epoch });
    }
    if (active.token !== token || active.token.reservationId !== token.reservationId) {
      return this._reject(null, 'invalid-token', { tileId: token.key, activeEpoch: active.epoch });
    }

    const safeTtlMs = normalizePositiveInteger(ttlMs ?? active.ttlMs, this.defaultTtlMs, 1);
    active.ttlMs = safeTtlMs;
    active.renewedAt = timestamp;
    active.expiresAt = timestamp + safeTtlMs;
    this.counters.renewed += 1;

    const lease = this._leaseSnapshot(record);
    this._emit('tile-renewed', {
      tileId: record.tileId,
      peerId: lease.peerId,
      epoch: lease.epoch,
      expiresAt: lease.expiresAt,
      ttlMs: lease.ttlMs
    });
    return Object.freeze({ ok: true, lease });
  }

  /**
   * Voluntarily release an active tile lease, advancing the tile epoch fence
   * so stale submissions from the old epoch are always rejected fail-closed.
   */
  releaseTile(tokenOrRef, { reason = 'released', now = this.now() } = {}) {
    if (this.destroyed) return this._reject(null, 'destroyed');
    const token = this._resolveTokenOrRef(tokenOrRef);
    if (!token) return this._reject(null, 'invalid-token');

    const timestamp = Number.isFinite(Number(now)) ? Number(now) : this.now();
    this.expireLeases(timestamp);

    const record = this.tiles.get(token.key);
    const active = record?.activeLease || null;
    if (!active) {
      const fence = this.ledger.fence(token.key);
      return this._reject(null, token.epoch !== fence.epoch ? 'stale-epoch' : 'no-active-lease', {
        tileId: token.key,
        activeEpoch: fence.epoch
      });
    }
    if (active.epoch !== token.epoch || active.token !== token) {
      return this._reject(null, active.epoch !== token.epoch ? 'stale-epoch' : 'invalid-token', {
        tileId: token.key,
        activeEpoch: active.epoch
      });
    }

    const previousPeerId = active.peerId;
    const fencedEpoch = active.epoch;
    record.activeLease = null;
    record.lastState = SPATIAL_TILE_STATES.RETIRED;
    const retired = this.ledger.retire(record.tileId, { expectedEpoch: fencedEpoch });
    const nextEpoch = retired.ok ? retired.epoch : this.ledger.fence(record.tileId).epoch;
    this.counters.released += 1;

    this._emit('tile-released', {
      tileId: record.tileId,
      previousPeerId,
      fencedEpoch,
      nextEpoch,
      reason: String(reason || 'released')
    });
    return Object.freeze({
      ok: true,
      tileId: record.tileId,
      previousPeerId,
      fencedEpoch,
      nextEpoch
    });
  }

  /**
   * Expire all tile leases whose TTL has elapsed (`expiresAt <= now`),
   * advancing each tile's epoch fence and emitting reassignment events.
   */
  expireLeases(now = this.now()) {
    if (this.destroyed) return [];
    const timestamp = Number.isFinite(Number(now)) ? Number(now) : this.now();
    const expired = [];
    for (const record of this.tiles.values()) {
      const active = record.activeLease;
      if (!active || active.expiresAt > timestamp) continue;
      const previousPeerId = active.peerId;
      const fencedEpoch = active.epoch;
      record.activeLease = null;
      record.lastState = SPATIAL_TILE_STATES.EXPIRED;
      const retired = this.ledger.retire(record.tileId, { expectedEpoch: fencedEpoch });
      const nextEpoch = retired.ok ? retired.epoch : this.ledger.fence(record.tileId).epoch;
      this.counters.expired += 1;
      this.counters.reassignmentsNeeded += 1;

      const entry = Object.freeze({
        tileId: record.tileId,
        previousPeerId,
        fencedEpoch,
        nextEpoch,
        expiredAt: timestamp,
        reason: 'ttl-expired'
      });
      expired.push(entry);
      this._emit('tile-expired', entry);
      this._emit('tile-reassignment-needed', entry);
    }
    return expired;
  }

  /**
   * Immediately fence and release all active tile leases held by a dropped peer,
   * advancing each tile's epoch so in-flight summaries from the dropped peer fail
   * closed and healthy peers can deterministically win reassignment.
   */
  evictPeer(peerId, { reason = 'peer-disconnected', now = this.now() } = {}) {
    if (this.destroyed) {
      return Object.freeze({ peerId: normalizeIdentifier(peerId), evictedCount: 0, tiles: [] });
    }
    const targetPeerId = normalizeIdentifier(peerId);
    if (!targetPeerId) {
      return Object.freeze({ peerId: '', evictedCount: 0, tiles: [] });
    }
    const timestamp = Number.isFinite(Number(now)) ? Number(now) : this.now();
    const evictedTiles = [];

    for (const record of this.tiles.values()) {
      const active = record.activeLease;
      if (!active || active.peerId !== targetPeerId) continue;
      const fencedEpoch = active.epoch;
      record.activeLease = null;
      record.lastState = SPATIAL_TILE_STATES.EVICTED;
      const retired = this.ledger.retire(record.tileId, { expectedEpoch: fencedEpoch });
      const nextEpoch = retired.ok ? retired.epoch : this.ledger.fence(record.tileId).epoch;
      this.counters.evicted += 1;
      this.counters.reassignmentsNeeded += 1;

      const detail = Object.freeze({
        tileId: record.tileId,
        previousPeerId: targetPeerId,
        fencedEpoch,
        nextEpoch,
        evictedAt: timestamp,
        reason: String(reason || 'peer-disconnected')
      });
      evictedTiles.push(detail);
      this._emit('tile-reassignment-needed', detail);
    }

    if (evictedTiles.length > 0) {
      this._emit('peer-evicted', {
        peerId: targetPeerId,
        evictedCount: evictedTiles.length,
        tiles: evictedTiles,
        reason: String(reason || 'peer-disconnected')
      });
    }

    return Object.freeze({
      peerId: targetPeerId,
      evictedCount: evictedTiles.length,
      tiles: evictedTiles
    });
  }

  handlePeerDisconnect(peerId, options = {}) {
    return this.evictPeer(peerId, options);
  }

  /**
   * Admit a compact opaque binary boundary / multipole summary strictly gated
   * by `summaryEpoch === activeEpoch` and owner/token validation.
   *
   * Never interprets domain/physics contents; copies payload bytes defensively
   * and records a SHA-256 content digest for provenance.
   */
  admitBoundarySummary({
    tileId,
    peerId,
    epoch,
    summaryEpoch = undefined,
    token = undefined,
    schema = 'application/octet-stream',
    payload,
    metadata = {},
    now = this.now()
  } = {}) {
    if (this.destroyed) return this._reject('boundariesRejected', 'destroyed');

    const id = normalizeIdentifier(tileId);
    const sender = normalizeIdentifier(peerId);
    const candidateEpoch = summaryEpoch !== undefined ? summaryEpoch : epoch;
    if (!id || !sender || !Number.isSafeInteger(candidateEpoch) || candidateEpoch < 0) {
      return this._reject('boundariesRejected', 'invalid-request', { tileId: id || null });
    }

    const payloadSchema = normalizeSchemaTag(schema);
    if (!payloadSchema) {
      return this._reject('boundariesRejected', 'invalid-schema', { tileId: id });
    }

    const timestamp = Number.isFinite(Number(now)) ? Number(now) : this.now();
    this.expireLeases(timestamp);

    const record = this.tiles.get(id);
    const active = record?.activeLease || null;
    if (!active) {
      const fence = this.ledger.fence(id);
      const reason = candidateEpoch < fence.epoch ? 'stale-epoch' : 'no-active-lease';
      return this._reject('boundariesRejected', reason, {
        tileId: id,
        activeEpoch: fence.epoch,
        receivedEpoch: candidateEpoch
      });
    }

    if (candidateEpoch !== active.epoch) {
      return this._reject('boundariesRejected', 'stale-epoch', {
        tileId: id,
        activeEpoch: active.epoch,
        receivedEpoch: candidateEpoch,
        ownerPeerId: active.peerId
      });
    }

    if (active.peerId !== sender) {
      return this._reject('boundariesRejected', 'not-owner', {
        tileId: id,
        activeEpoch: active.epoch,
        ownerPeerId: active.peerId,
        peerId: sender
      });
    }

    if (token !== undefined) {
      const resolvedToken = this._resolveTokenOrRef(token);
      if (!resolvedToken || resolvedToken !== active.token || resolvedToken.reservationId !== active.token.reservationId) {
        return this._reject('boundariesRejected', 'invalid-token', {
          tileId: id,
          activeEpoch: active.epoch
        });
      }
    }

    const copiedBytes = extractOpaqueBytes(payload);
    if (!copiedBytes) {
      return this._reject('boundariesRejected', 'invalid-payload', {
        tileId: id,
        activeEpoch: active.epoch
      });
    }
    if (copiedBytes.byteLength === 0) {
      return this._reject('boundariesRejected', 'empty-payload', {
        tileId: id,
        activeEpoch: active.epoch
      });
    }
    if (copiedBytes.byteLength > this.maxPayloadBytes) {
      return this._reject('boundariesRejected', 'payload-too-large', {
        tileId: id,
        activeEpoch: active.epoch,
        byteLength: copiedBytes.byteLength,
        maxPayloadBytes: this.maxPayloadBytes
      });
    }

    record.boundarySequence += 1;
    const digest = bytesToHex(sha256(copiedBytes));
    const stored = {
      tileId: id,
      peerId: sender,
      epoch: active.epoch,
      sequence: record.boundarySequence,
      payloadSchema,
      byteLength: copiedBytes.byteLength,
      sha256: digest,
      admittedAt: timestamp,
      metadata: clonePlain(metadata || {}),
      payloadBytes: copiedBytes
    };
    record.lastBoundary = stored;
    this.counters.boundariesAdmitted += 1;

    const summaryMeta = this._summarySnapshot(stored, { includePayload: false });
    if (this.summaryNamespace && this.stateManager?.writeScoped) {
      try {
        this.stateManager.writeScoped(this.summaryNamespace, id, summaryMeta);
      } catch {
        // Scoped summary metadata mirror must never break authority admission.
      }
    }

    if (this.onBoundaryAdmitted) {
      try {
        this.onBoundaryAdmitted(this._summarySnapshot(stored, { includePayload: true }));
      } catch {
        // Isolate consumer callback failures.
      }
    }

    this._emit('boundary-admitted', {
      tileId: id,
      peerId: sender,
      epoch: stored.epoch,
      sequence: stored.sequence,
      payloadSchema,
      byteLength: stored.byteLength,
      sha256: digest
    });

    return Object.freeze({ ok: true, summary: summaryMeta });
  }

  /**
   * Read the latest admitted opaque boundary summary for a tile.
   * When `expectedEpoch` is provided, fails closed (returns `null`) if the stored
   * summary belongs to a different epoch.
   */
  getBoundarySummary(tileId, { expectedEpoch = null, includePayload = true } = {}) {
    const id = normalizeIdentifier(tileId);
    const record = this.tiles.get(id);
    const summary = record?.lastBoundary || null;
    if (!summary) return null;
    if (expectedEpoch != null && summary.epoch !== Number(expectedEpoch)) return null;
    return this._summarySnapshot(summary, { includePayload });
  }

  getTile(tileId, { now = this.now() } = {}) {
    const id = normalizeIdentifier(tileId);
    if (!id) return null;
    this.expireLeases(now);
    const record = this.tiles.get(id);
    const fence = this.ledger.fence(id);
    if (!record) return null;
    return Object.freeze({
      tileId: id,
      epoch: fence.epoch,
      state: record.activeLease ? SPATIAL_TILE_STATES.LEASED : record.lastState,
      lease: this._leaseSnapshot(record),
      lastOwnerPeerId: record.lastOwnerPeerId,
      lastBoundary: this._summarySnapshot(record.lastBoundary, { includePayload: false })
    });
  }

  listTiles({ peerId = null, activeOnly = false, now = this.now() } = {}) {
    this.expireLeases(now);
    const filterPeer = peerId != null ? normalizeIdentifier(peerId) : null;
    const out = [];
    for (const record of this.tiles.values()) {
      if (activeOnly && !record.activeLease) continue;
      if (filterPeer && record.activeLease?.peerId !== filterPeer) continue;
      out.push(this.getTile(record.tileId, { now }));
    }
    return out;
  }

  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('SpatialTileLeaseBroker.subscribe requires a function');
    }
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Bind this broker to a NodeKernel (or any object exposing `onPeerDisconnect`)
   * so dropped peers immediately evict their tiles and trigger reassignment.
   */
  bindToKernel(kernel) {
    if (!kernel || typeof kernel.onPeerDisconnect !== 'function') {
      throw new TypeError('bindToKernel requires a NodeKernel with onPeerDisconnect(listener)');
    }
    const unsubscribe = kernel.onPeerDisconnect((event) => {
      const peerId = typeof event === 'string' ? event : event?.peerId;
      if (peerId) {
        this.evictPeer(peerId, { reason: event?.reason || 'peer-disconnected' });
      }
    });
    const cleanup = () => {
      this._kernelUnsubscribes.delete(cleanup);
      unsubscribe?.();
    };
    this._kernelUnsubscribes.add(cleanup);
    return cleanup;
  }

  getStats({ now = this.now() } = {}) {
    this.expireLeases(now);
    let activeTileCount = 0;
    let boundaryCount = 0;
    for (const record of this.tiles.values()) {
      if (record.activeLease) activeTileCount += 1;
      if (record.lastBoundary) boundaryCount += 1;
    }
    return Object.freeze({
      name: this.name,
      destroyed: this.destroyed,
      trackedTileCount: this.tiles.size,
      activeTileCount,
      boundaryCount,
      maxTiles: this.maxTiles,
      maxPayloadBytes: this.maxPayloadBytes,
      defaultTtlMs: this.defaultTtlMs,
      counters: Object.freeze({ ...this.counters })
    });
  }

  snapshot({ now = this.now() } = {}) {
    return Object.freeze({
      schema: SPATIAL_TILE_LEASE_SCHEMA,
      ...this.getStats({ now }),
      ledger: this.ledger.snapshot(),
      tiles: this.listTiles({ now })
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    for (const unsub of [...this._kernelUnsubscribes]) {
      try { unsub(); } catch {}
    }
    this._kernelUnsubscribes.clear();
    for (const record of this.tiles.values()) {
      record.activeLease = null;
    }
    if (this._ownsLedger) {
      this.ledger.destroy();
    }
    this.listeners.clear();
    return true;
  }
}
