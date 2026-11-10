export const WORLD_STANDING_GOAL_LIMITS = Object.freeze({
  maxRecords: 1024, maxAttempts: 3, retryMs: 30_000, cooldownMs: 90_000,
  windowMs: 3_600_000, maxClaimsPerWindow: 6, textBytes: 1800
});

const STATES = new Set(['claimed', 'prepared', 'complete', 'failed', 'unknown']);
const DELIVERY_STATES = new Set(['sending', 'local-only', 'delivered', 'partial', 'failed', 'cancelled']);
const encoder = new TextEncoder(), decoder = new TextDecoder();
const copy = value => value === undefined ? undefined : structuredClone(value);
const request = value => new Promise((resolve, reject) => {
  value.onsuccess = () => resolve(value.result); value.onerror = () => reject(value.error);
});
function fields(value, allowed, label) {
  if (!value || ![Object.prototype, null].includes(Object.getPrototypeOf(value))
      || Reflect.ownKeys(value).some(key => !allowed.includes(key))) throw new TypeError(`Invalid standing goal ${label} fields`);
}
function text(value, maximum, label, empty = false) {
  if (typeof value !== 'string' || (!empty && !value.trim()) || value.includes('\0')
      || encoder.encode(value).length > maximum || decoder.decode(encoder.encode(value)) !== value) {
    throw new TypeError(`Invalid standing goal ${label}`);
  }
  return value;
}
function integer(value, maximum, label) {
  if (!Number.isSafeInteger(value) || value < 0 || value > maximum) throw new TypeError(`Invalid standing goal ${label}`);
  return value;
}
const time = value => integer(value, Number.MAX_SAFE_INTEGER, 'time');
export function worldStandingGoalScope(value) {
  fields(value, ['worldId', 'agentId', 'goalId', 'targetId'], 'scope');
  return { worldId: text(value.worldId, 240, 'world'), agentId: text(value.agentId, 128, 'agent'),
    goalId: text(value.goalId, 128, 'goal'), targetId: text(value.targetId, 320, 'target') };
}
const keyOf = scope => JSON.stringify([scope.worldId, scope.agentId, scope.goalId, scope.targetId]);
const budgetKey = scope => JSON.stringify([scope.worldId, scope.agentId]);
function deliveryRecord(value) {
  if (value === undefined || value === null) return null;
  fields(value, ['id', 'status', 'delivered', 'total'], 'delivery');
  if (!DELIVERY_STATES.has(value.status)) throw new TypeError('Invalid standing goal delivery status');
  const result = { status: value.status };
  if (Object.hasOwn(value, 'id')) result.id = text(value.id, 128, 'delivery ID');
  for (const name of ['delivered', 'total']) {
    if (Object.hasOwn(value, name)) result[name] = integer(value[name], 1_000_000, `delivery ${name}`);
  }
  if (result.delivered !== undefined && result.total !== undefined && result.delivered > result.total) {
    throw new TypeError('Invalid standing goal delivery counts');
  }
  return result;
}

/** Owner-local encounter ledger. A committed claim reserves inference budget; a
 * prepared checkpoint precedes publication. Pending/unknown work is never
 * reclaimed automatically, because the store cannot prove whether it was sent. */
export class WorldStandingGoalStore {
  constructor({ name = 'default', indexedDBImpl = globalThis.indexedDB, now = Date.now, onDestroy,
    maxRecords = WORLD_STANDING_GOAL_LIMITS.maxRecords } = {}) {
    if (typeof name !== 'string' || !/^[\w.-]{1,80}$/.test(name) || typeof now !== 'function') {
      throw new TypeError('Invalid standing goal store configuration');
    }
    integer(maxRecords, WORLD_STANDING_GOAL_LIMITS.maxRecords, 'capacity');
    if (!maxRecords) throw new TypeError('Invalid standing goal capacity');
    Object.assign(this, { name, indexedDB: indexedDBImpl, now, onDestroy, maxRecords });
    this.databaseName = `peercompute-world-standing-goals-v1-${name}`;
    this.persistent = true; this.transactions = new Set();
  }
  async open() {
    if (this.closed) throw new Error('World standing goal store is closed');
    if (this.opening) return this.opening;
    if (this.database) return this;
    if (!this.indexedDB?.open) throw new Error('World standing goals require IndexedDB');
    this.opening = new Promise((resolve, reject) => {
      const opening = this.indexedDB.open(this.databaseName, 1); let failed = false;
      opening.onupgradeneeded = () => {
        opening.result.createObjectStore('encounters', { keyPath: 'key' });
        opening.result.createObjectStore('budgets');
      };
      opening.onerror = () => { failed = true; reject(opening.error); };
      opening.onblocked = () => { failed = true; reject(new Error('World standing goal database upgrade is blocked')); };
      opening.onsuccess = () => {
        if (failed || this.closed) { opening.result.close(); if (!failed) reject(new Error('World standing goal store is closed')); return; }
        this.database = opening.result;
        this.database.onversionchange = () => { this.database?.close(); this.database = null; this.closed = true; };
        resolve(this);
      };
    }).finally(() => { this.opening = null; });
    return this.opening;
  }
  async _transaction(mode, action, signal) {
    signal?.throwIfAborted();
    if (this.closed || !this.database) throw new Error('World standing goal store is not open');
    // Request disk-backed acknowledgement before authorizing a public send.
    const tx = this.database.transaction(['encounters', 'budgets'], mode,
      mode === 'readwrite' ? { durability: 'strict' } : undefined);
    const completion = new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onabort = () => reject(tx.error ?? signal?.reason ?? new Error('World standing goal transaction aborted'));
      tx.onerror = () => {};
    });
    completion.catch(() => {}); this.transactions.add(completion);
    const abort = () => { try { tx.abort(); } catch { /* A committed write stays acknowledged. */ } };
    signal?.addEventListener('abort', abort, { once: true });
    try {
      const result = await action(tx.objectStore('encounters'), tx.objectStore('budgets'));
      await completion; return copy(result);
    } catch (error) { abort(); await completion.catch(() => {}); throw error; }
    finally { this.transactions.delete(completion); signal?.removeEventListener('abort', abort); }
  }
  _read(row, scope) {
    if (!row) return null;
    const record = row.record;
    if (!record || keyOf(worldStandingGoalScope({ worldId: record.worldId, agentId: record.agentId,
      goalId: record.goalId, targetId: record.targetId })) !== keyOf(scope) || row.key !== keyOf(scope)
      || !STATES.has(record.status) || !Array.isArray(record.requestIds)
      || record.requestIds.length !== record.attempts || !record.requestIds.includes(record.requestId)) {
      throw new Error('Invalid stored standing goal record');
    }
    integer(record.attempts, WORLD_STANDING_GOAL_LIMITS.maxAttempts, 'attempts');
    if (!record.attempts || new Set(record.requestIds).size !== record.attempts) throw new Error('Invalid stored standing goal attempts');
    record.requestIds.forEach(id => text(id, 128, 'request ID'));
    time(record.createdAt); time(record.updatedAt); time(record.claimedAt);
    if (record.status === 'failed') time(record.nextAt);
    return record;
  }
  _owned(row, scope, requestId, states) {
    const record = this._read(row, scope);
    if (!record || record.requestId !== requestId || !states.includes(record.status)) {
      throw Object.assign(new Error('Standing goal request or transition conflict'), { code: 'ERR_WORLD_STANDING_GOAL_CONFLICT' });
    }
    return record;
  }
  get(scope, { signal } = {}) {
    scope = worldStandingGoalScope(scope);
    return this._transaction('readonly', async store => this._read(await request(store.get(keyOf(scope))), scope), signal);
  }
  claim(scope, { requestId, signal } = {}) {
    scope = worldStandingGoalScope(scope); requestId = text(requestId, 128, 'request ID');
    return this._transaction('readwrite', async (store, budgets) => {
      const previous = this._read(await request(store.get(keyOf(scope))), scope);
      const denied = (reason, nextAt) => ({ claimed: false, record: previous, reason, ...(nextAt === undefined ? {} : { nextAt }) });
      if (previous && previous.status !== 'failed') {
        return denied(previous.status === 'complete' ? 'completed' : 'outcome-unknown');
      }
      if (previous?.attempts >= WORLD_STANDING_GOAL_LIMITS.maxAttempts) return denied('attempts-exhausted');
      if (previous?.requestIds.includes(requestId)) throw new Error('Standing goal request ID was already used');
      const now = time(this.now());
      let budget = await request(budgets.get(budgetKey(scope)));
      if (budget) {
        if (!Array.isArray(budget.claims) || budget.claims.length > WORLD_STANDING_GOAL_LIMITS.maxClaimsPerWindow) {
          throw new Error('Invalid stored standing goal budget');
        }
        time(budget.lastAt); budget.claims.forEach(time);
      } else budget = { lastAt: null, claims: [] };
      const claims = budget.claims.filter(at => at > now - WORLD_STANDING_GOAL_LIMITS.windowMs);
      const nextAt = Math.max(previous?.nextAt ?? 0, budget.lastAt === null ? 0 : budget.lastAt + WORLD_STANDING_GOAL_LIMITS.cooldownMs);
      if (now < nextAt) return denied('cooldown', nextAt);
      if (claims.length >= WORLD_STANDING_GOAL_LIMITS.maxClaimsPerWindow) {
        return denied('rate-limit', Math.min(...claims) + WORLD_STANDING_GOAL_LIMITS.windowMs);
      }
      if (!previous && await request(store.count()) >= this.maxRecords) return denied('capacity');
      const record = { ...scope, status: 'claimed', requestId, requestIds: [...(previous?.requestIds ?? []), requestId],
        attempts: (previous?.attempts ?? 0) + 1, createdAt: previous?.createdAt ?? now, updatedAt: now, claimedAt: now,
        preparedAt: null, finishedAt: null, nextAt: null, text: null, outcome: null, delivery: null, error: null };
      await request(store.put({ key: keyOf(scope), record }));
      await request(budgets.put({ lastAt: now, claims: [...claims, now] }, budgetKey(scope)));
      return { claimed: true, record };
    }, signal);
  }
  prepare(scope, { requestId, text: output, signal } = {}) {
    scope = worldStandingGoalScope(scope); requestId = text(requestId, 128, 'request ID');
    output = text(output, WORLD_STANDING_GOAL_LIMITS.textBytes, 'prepared text');
    return this._transaction('readwrite', async store => {
      const previous = this._owned(await request(store.get(keyOf(scope))), scope, requestId, ['claimed']);
      const now = Math.max(time(this.now()), previous.updatedAt);
      const record = { ...previous, status: 'prepared', text: output, preparedAt: now, updatedAt: now };
      await request(store.put({ key: keyOf(scope), record })); return record;
    }, signal);
  }
  finish(scope, { requestId, outcome, delivery, signal } = {}) {
    scope = worldStandingGoalScope(scope); requestId = text(requestId, 128, 'request ID');
    if (!['spoken', 'quiet', 'unknown'].includes(outcome)) throw new TypeError('Invalid standing goal outcome');
    delivery = deliveryRecord(delivery);
    if (outcome === 'quiet' && delivery !== null) throw new TypeError('Quiet standing goals cannot have delivery receipts');
    const states = outcome === 'spoken' ? ['prepared'] : outcome === 'quiet' ? ['claimed'] : ['claimed', 'prepared'];
    return this._transaction('readwrite', async store => {
      const previous = this._owned(await request(store.get(keyOf(scope))), scope, requestId, states);
      const now = Math.max(time(this.now()), previous.updatedAt);
      const record = { ...previous, status: outcome === 'unknown' ? 'unknown' : 'complete', outcome, delivery, finishedAt: now, updatedAt: now };
      await request(store.put({ key: keyOf(scope), record })); return record;
    }, signal);
  }
  fail(scope, { requestId, error, signal } = {}) {
    scope = worldStandingGoalScope(scope); requestId = text(requestId, 128, 'request ID');
    const message = error instanceof Error ? error.message : error ?? '';
    const reason = text(message, 512, 'failure', true);
    return this._transaction('readwrite', async store => {
      const previous = this._owned(await request(store.get(keyOf(scope))), scope, requestId, ['claimed', 'prepared']);
      const now = Math.max(time(this.now()), previous.updatedAt), unknown = previous.status === 'prepared';
      const record = { ...previous, status: unknown ? 'unknown' : 'failed', outcome: unknown ? 'unknown' : null,
        error: reason, nextAt: unknown ? null : now + WORLD_STANDING_GOAL_LIMITS.retryMs, finishedAt: now, updatedAt: now };
      await request(store.put({ key: keyOf(scope), record })); return record;
    }, signal);
  }
  close() { return this.destroy(); }
  destroy() {
    if (this.closing) return this.closing;
    this.closed = true;
    this.closing = (async () => {
      await this.opening?.catch(() => {}); await Promise.allSettled([...this.transactions]);
      this.database?.close(); this.database = null; this.onDestroy?.(this);
    })();
    return this.closing;
  }
}
