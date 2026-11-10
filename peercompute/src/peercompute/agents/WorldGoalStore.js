import { agentIdentifier } from './AgentContracts.js';
import { normalizeWorldPosition } from './WorldAgentContracts.js';
import { normalizeWorldGoalPlan, worldGoalMilestoneMatchesAction, worldGoalMilestonesComplete,
  WORLD_GOAL_PLAN_LIMITS } from './WorldGoalPlan.js';

export const WORLD_GOAL_LIMITS = Object.freeze({ maxSteps: 8, maxFailures: 3, maxDurationMs: 600_000 });
export const WORLD_GOAL_STATUSES = Object.freeze(['paused', 'ready', 'planning', 'acting', 'waiting-for-model', 'completed', 'cancelled']);
const TERMINAL = new Set(['completed', 'cancelled']);
const ACTIONS = new Set(['approach', 'look-at', 'stop']);
const RECEIPT_STATUSES = new Set(['arrived', 'stopped', 'target-lost', 'blocked', 'cancelled', 'failed']);
const MUTABLE = ['requesterId', 'status', 'reason', 'steps', 'failures', 'startedAt', 'deadlineAt', 'nextDecisionAt',
  'pendingDecision', 'pendingAction', 'lastReceipt', 'currentStep', 'modelAssessment', 'plan'];
const encoder = new TextEncoder(), decoder = new TextDecoder();
const copy = value => value === undefined ? undefined : structuredClone(value);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const request = value => new Promise((resolve, reject) => {
  value.onsuccess = () => resolve(value.result); value.onerror = () => reject(value.error);
});
function fields(value, allowed, label) {
  if (!value || ![Object.prototype, null].includes(Object.getPrototypeOf(value))
      || Reflect.ownKeys(value).some(key => !allowed.includes(key))) throw new TypeError(`Invalid goal ${label} fields`);
  return value;
}
function text(value, maximum, label, empty = false) {
  if (typeof value !== 'string' || (!empty && !value.trim()) || value.includes('\0')
      || encoder.encode(value).length > maximum || decoder.decode(encoder.encode(value)) !== value) {
    throw new TypeError(`Invalid goal ${label}`);
  }
  return value;
}
function integer(value, maximum, label) {
  if (!Number.isSafeInteger(value) || value < 0 || value > maximum) throw new TypeError(`Invalid goal ${label}`);
  return value;
}
const timestamp = (value, label) => integer(value, Number.MAX_SAFE_INTEGER, label);
const optionalTime = (value, label) => value === null ? null : timestamp(value, label);
export function worldGoalScope(value) {
  fields(value, ['worldId', 'agentId'], 'scope');
  return { worldId: text(value.worldId, 240, 'world'), agentId: agentIdentifier(value.agentId) };
}
const scopeKey = scope => JSON.stringify([scope.worldId, scope.agentId]);
function intent(value) {
  fields(value, ['type', 'targetId', 'stopDistance'], 'intent');
  if (!ACTIONS.has(value.type)) throw new TypeError('Invalid goal intent type');
  if (value.type === 'stop') {
    if (Object.hasOwn(value, 'targetId') || Object.hasOwn(value, 'stopDistance')) throw new TypeError('Goal stop has no target');
    return { type: 'stop' };
  }
  const stopDistance = value.stopDistance ?? 10;
  if (!Number.isFinite(stopDistance) || stopDistance < 8 || stopDistance > 30) throw new TypeError('Invalid goal stop distance');
  return { type: value.type, targetId: text(value.targetId, 320, 'target'), stopDistance };
}
function pendingDecision(value) {
  if (value === null) return null;
  fields(value, ['id', 'startedAt'], 'pending decision');
  return { id: agentIdentifier(value.id, 'decision ID'), startedAt: timestamp(value.startedAt, 'decision time') };
}
function pendingAction(value) {
  if (value === null) return null;
  fields(value, ['requestId', 'intent', 'issuedAt', 'observationAt', 'milestoneIndex'], 'pending action');
  return { requestId: agentIdentifier(value.requestId, 'action ID'), intent: intent(value.intent),
    issuedAt: timestamp(value.issuedAt, 'action time'), observationAt: timestamp(value.observationAt, 'observation time'),
    ...(Object.hasOwn(value, 'milestoneIndex')
      ? { milestoneIndex: integer(value.milestoneIndex, WORLD_GOAL_PLAN_LIMITS.maxMilestones - 1, 'milestone index') } : {}) };
}
function receipt(value) {
  fields(value, ['requestId', 'type', 'targetId', 'status', 'at', 'position', 'reason'], 'receipt');
  if (!ACTIONS.has(value.type) || !RECEIPT_STATUSES.has(value.status)) throw new TypeError('Invalid goal receipt outcome');
  if ((value.status === 'stopped' && value.type !== 'stop') || (value.status === 'arrived' && value.type === 'stop')) {
    throw new TypeError('Goal receipt outcome does not match action');
  }
  const result = { requestId: agentIdentifier(value.requestId, 'receipt ID'), type: value.type,
    status: value.status, at: timestamp(value.at, 'receipt time') };
  if (value.type === 'stop') {
    if (Object.hasOwn(value, 'targetId')) throw new TypeError('Goal stop receipt has no target');
  } else result.targetId = text(value.targetId, 320, 'receipt target');
  if (Object.hasOwn(value, 'position')) result.position = normalizeWorldPosition(value.position);
  if (Object.hasOwn(value, 'reason')) result.reason = text(value.reason, 512, 'receipt reason', true);
  return result;
}
function eventRecord(value, at) {
  if (value === undefined) return null;
  fields(value, ['type', 'text', 'requestId'], 'event');
  return { type: text(value.type, 80, 'event type'), at,
    ...(Object.hasOwn(value, 'text') ? { text: text(value.text, 512, 'event text', true) } : {}),
    ...(Object.hasOwn(value, 'requestId') ? { requestId: agentIdentifier(value.requestId, 'event request ID') } : {}) };
}
function changedRecord(previous, patch, now) {
  fields(patch, MUTABLE, 'patch');
  const next = { ...previous, ...copy(patch), revision: previous.revision + 1, updatedAt: now };
  if (!WORLD_GOAL_STATUSES.includes(next.status)) throw new TypeError('Invalid goal status');
  next.requesterId = text(next.requesterId, 320, 'requester');
  if (next.requesterId !== previous.requesterId && !(previous.status === 'paused' && next.status === 'ready')) {
    throw new Error('Goal requester can change only on explicit owner Resume');
  }
  next.reason = text(next.reason, 512, 'reason', true);
  next.currentStep = text(next.currentStep, 240, 'current step', true);
  next.modelAssessment = text(next.modelAssessment, 512, 'model assessment', true);
  next.steps = integer(next.steps, WORLD_GOAL_LIMITS.maxSteps, 'steps');
  next.failures = integer(next.failures, WORLD_GOAL_LIMITS.maxFailures, 'failures');
  if (next.steps < previous.steps) throw new Error('Goal steps cannot decrease');
  next.startedAt = optionalTime(next.startedAt, 'start time');
  next.deadlineAt = optionalTime(next.deadlineAt, 'deadline');
  next.nextDecisionAt = optionalTime(next.nextDecisionAt, 'next decision time');
  if ((next.startedAt === null) !== (next.deadlineAt === null)
      || (next.startedAt !== null && (next.startedAt > now + 60_000 || next.deadlineAt <= next.startedAt
        || next.deadlineAt - next.startedAt > WORLD_GOAL_LIMITS.maxDurationMs))) throw new TypeError('Invalid goal deadline');
  if (previous.startedAt !== null && (next.startedAt !== previous.startedAt || next.deadlineAt !== previous.deadlineAt)) {
    throw new Error('Goal deadline cannot be reset');
  }
  next.pendingDecision = pendingDecision(next.pendingDecision);
  next.pendingAction = pendingAction(next.pendingAction);
  if (Object.hasOwn(patch, 'plan')) {
    if (previous.plan !== null) throw new Error('Goal milestone plan cannot be replaced');
    if (previous.status !== 'planning' || !previous.pendingDecision || next.pendingDecision
        || previous.pendingAction || next.pendingAction) throw new Error('Goal plan requires settlement of acknowledged planning without an action');
    next.plan = normalizeWorldGoalPlan(patch.plan);
  }
  for (const field of ['pendingDecision', 'pendingAction']) {
    if (previous[field] && next[field] && !same(previous[field], next[field])) throw new Error(`Goal ${field} cannot be replaced before settlement`);
  }
  if (next.pendingDecision && next.pendingAction) throw new Error('Goal cannot plan and act simultaneously');
  if (next.status === 'planning' && !next.pendingDecision) throw new Error('Planning requires a durable decision checkpoint');
  if (next.status === 'acting' && !next.pendingAction) throw new Error('Acting requires a durable action checkpoint');
  if ((next.pendingDecision && !['planning', 'paused'].includes(next.status))
      || (next.pendingAction && !['acting', 'paused'].includes(next.status))) throw new Error('Goal status cannot discard pending work');
  if (!['paused', 'cancelled'].includes(next.status) && next.startedAt === null) throw new Error('Goal must acknowledge its start and deadline');
  if (next.pendingDecision?.startedAt > now + 60_000 || next.pendingAction?.issuedAt > now + 60_000
      || (next.pendingAction && next.pendingAction.observationAt > next.pendingAction.issuedAt)) throw new TypeError('Invalid goal checkpoint time');
  next.lastReceipt = next.lastReceipt === null ? null : receipt(next.lastReceipt);
  if (!same(next.lastReceipt, previous.lastReceipt)) {
    const action = previous.pendingAction, outcome = next.lastReceipt;
    if (!action || !outcome || outcome.requestId !== action.requestId || outcome.type !== action.intent.type
        || outcome.targetId !== action.intent.targetId || outcome.at < action.issuedAt || outcome.at > now + 60_000) {
      throw new Error('Goal receipt does not match its acknowledged action');
    }
    if (previous.receipts.some(item => item.requestId === outcome.requestId)) throw new Error('Goal receipt request was already settled');
    if (previous.receipts.length >= WORLD_GOAL_LIMITS.maxSteps) throw new Error('Goal receipt budget exhausted');
    if (next.pendingAction) throw new Error('Goal receipt must settle the pending action');
    next.receipts = [...previous.receipts, outcome];
    if (action.milestoneIndex === undefined) {
      if (next.status !== 'paused') throw new Error('Legacy goal actions must settle paused without milestone credit');
    } else {
      if (!worldGoalMilestoneMatchesAction(previous, action)) throw new Error('Goal receipt does not match its active milestone');
      if (['arrived', 'stopped'].includes(outcome.status)) {
        next.completedMilestones = [...previous.completedMilestones, { index: action.milestoneIndex, requestId: outcome.requestId }];
      }
    }
  }
  if (next.pendingAction && !previous.pendingAction && previous.receipts.some(item => item.requestId === next.pendingAction.requestId)) {
    throw new Error('Goal action request was already settled');
  }
  if (next.pendingAction && !previous.pendingAction && !worldGoalMilestoneMatchesAction(next, next.pendingAction)) {
    throw new Error('Goal action must match the active planned milestone');
  }
  if (next.status === 'completed' && (!next.modelAssessment.trim()
      || !worldGoalMilestonesComplete(next))) {
    throw new Error('Goal completion requires an explicit model assessment and successful evidence for every planned milestone');
  }
  return next;
}

/** Owner-local objectives. Only acknowledged CAS checkpoints authorize callers to
 * plan or move. This store never runs work, publishes objectives, or replays them. */
export class WorldGoalStore {
  constructor({ name = 'default', hostId, indexedDBImpl = globalThis.indexedDB, now = Date.now, onDestroy,
    maximumEntries = 64 } = {}) {
    if (typeof name !== 'string' || !/^[\w.-]{1,80}$/.test(name) || typeof now !== 'function') throw new TypeError('Invalid goal store configuration');
    integer(maximumEntries, 64, 'entry capacity');
    if (!maximumEntries) throw new TypeError('Invalid goal entry capacity');
    Object.defineProperty(this, 'hostId', { value: agentIdentifier(hostId, 'local host ID'), enumerable: true });
    Object.assign(this, { name, indexedDB: indexedDBImpl, now, onDestroy, maximumEntries });
    this.databaseName = `peercompute-world-goals-v1-${name}`; this.persistent = true; this.transactions = new Set();
  }
  _time() { return timestamp(this.now(), 'clock'); }
  async open() {
    if (this.closed) throw new Error('World goal store is closed');
    if (this.opening) return this.opening;
    if (this.database) return this;
    if (!this.indexedDB?.open) throw new Error('World goals require IndexedDB');
    this.opening = (async () => {
      await new Promise((resolve, reject) => {
        const opening = this.indexedDB.open(this.databaseName, 1); let failed = false;
        opening.onupgradeneeded = () => {
          opening.result.createObjectStore('goals', { keyPath: 'key' }); opening.result.createObjectStore('metadata');
        };
        opening.onerror = () => { failed = true; reject(opening.error); };
        opening.onblocked = () => { failed = true; reject(new Error('World goal database upgrade is blocked')); };
        opening.onsuccess = () => {
          if (failed || this.closed) { opening.result.close(); if (!failed) reject(new Error('World goal store is closed')); return; }
          this.database = opening.result;
          this.database.onversionchange = () => { this.database?.close(); this.database = null; this.closed = true; };
          resolve();
        };
      });
      try {
        await this._transaction('readwrite', async (_store, metadata) => {
          const owner = await request(metadata.get('hostId'));
          if (owner !== undefined && owner !== this.hostId) throw new Error('World goal database belongs to another host');
          if (owner === undefined) await request(metadata.put(this.hostId, 'hostId'));
        }, undefined, true);
        if (this.closed) throw new Error('World goal store is closed');
        this.bound = true;
        return this;
      } catch (error) { this.database?.close(); this.database = null; throw error; }
    })().finally(() => { this.opening = null; });
    return this.opening;
  }
  async _transaction(mode, action, signal, binding = false) {
    signal?.throwIfAborted();
    if (this.closed || !this.database || (!this.bound && !binding)) throw new Error('World goal store is not open');
    const tx = this.database.transaction(['goals', 'metadata'], mode);
    const completion = new Promise((resolve, reject) => {
      tx.oncomplete = resolve; tx.onabort = () => reject(tx.error ?? signal?.reason ?? new Error('World goal transaction aborted'));
      tx.onerror = () => {};
    });
    completion.catch(() => {}); this.transactions.add(completion);
    const abort = () => { try { tx.abort(); } catch { /* A completed write stays acknowledged. */ } };
    signal?.addEventListener('abort', abort, { once: true });
    try { const result = await action(tx.objectStore('goals'), tx.objectStore('metadata')); await completion; return copy(result); }
    catch (error) { abort(); await completion.catch(() => {}); throw error; }
    finally { this.transactions.delete(completion); signal?.removeEventListener('abort', abort); }
  }
  _owner(record) {
    if (record && record.ownerHostId !== this.hostId) throw new Error('This installation does not own the goal');
    // Version-one databases predate ordered plans. Hydrate without rewriting
    // their receipts or pending checkpoints, and never infer milestone credit.
    return record && { ...record, plan: record.plan ?? null, completedMilestones: record.completedMilestones ?? [] };
  }
  _expected(record, goalId, revision) {
    record = this._owner(record);
    if (!record || record.goalId !== goalId || record.revision !== revision) {
      throw Object.assign(new Error('Goal revision conflict'), { code: 'ERR_WORLD_GOAL_CONFLICT' });
    }
    return record;
  }
  _row(record) {
    if (encoder.encode(JSON.stringify(record)).length > 32 * 1024) throw new RangeError('Goal record exceeds byte capacity');
    return { key: scopeKey(record), record };
  }
  assign(input, { expectedRevision = 0, signal } = {}) {
    fields(input, ['worldId', 'agentId', 'objective', 'requesterId'], 'assignment');
    const scope = worldGoalScope({ worldId: input.worldId, agentId: input.agentId });
    const objective = text(input.objective, 1024, 'objective'), requesterId = text(input.requesterId, 320, 'requester');
    integer(expectedRevision, Number.MAX_SAFE_INTEGER, 'expected revision');
    const now = this._time();
    return this._transaction('readwrite', async store => {
      const key = scopeKey(scope), previous = this._owner((await request(store.get(key)))?.record);
      if ((previous?.revision ?? 0) !== expectedRevision) throw Object.assign(new Error('Goal revision conflict'), { code: 'ERR_WORLD_GOAL_CONFLICT' });
      if (previous && !TERMINAL.has(previous.status)) throw new Error('Cancel the existing goal before assigning a replacement');
      const rows = await request(store.getAll());
      if (!previous && rows.length >= this.maximumEntries) {
        const oldest = rows.filter(row => TERMINAL.has(row.record.status)).sort((a, b) => a.record.updatedAt - b.record.updatedAt || a.key.localeCompare(b.key))[0];
        if (!oldest) throw new Error('World goal capacity reached; no terminal goal can be removed');
        await request(store.delete(oldest.key));
      }
      const record = { schema: 'peercompute.world-goal.v1', ...scope, goalId: crypto.randomUUID(), ownerHostId: this.hostId,
        revision: (previous?.revision ?? 0) + 1, objective, requesterId, status: 'paused', reason: '', steps: 0, failures: 0,
        startedAt: null, deadlineAt: null, nextDecisionAt: null, pendingDecision: null, pendingAction: null,
        lastReceipt: null, receipts: [], plan: null, completedMilestones: [], currentStep: '', modelAssessment: '',
        limits: { ...WORLD_GOAL_LIMITS }, trace: [], createdAt: now, updatedAt: now };
      await request(store.put(this._row(record))); return record;
    }, signal);
  }
  get(scope, { signal } = {}) {
    const key = scopeKey(worldGoalScope(scope));
    return this._transaction('readonly', async store => this._owner((await request(store.get(key)))?.record), signal);
  }
  list(input = {}, { signal } = {}) {
    fields(input, ['worldId'], 'list');
    const worldId = input.worldId === undefined ? undefined : text(input.worldId, 240, 'world');
    return this._transaction('readonly', async store => (await request(store.getAll())).map(row => this._owner(row.record))
      .filter(record => worldId === undefined || record.worldId === worldId).sort((a, b) => b.updatedAt - a.updatedAt), signal);
  }
  commit(scope, input, { signal } = {}) {
    const key = scopeKey(worldGoalScope(scope)); fields(input, ['goalId', 'expectedRevision', 'patch', 'event'], 'commit');
    agentIdentifier(input.goalId, 'goal ID'); integer(input.expectedRevision, Number.MAX_SAFE_INTEGER, 'expected revision');
    fields(input.patch, MUTABLE, 'patch');
    const { goalId, expectedRevision } = input;
    const patch = copy({ ...input.patch, ...(Object.hasOwn(input.patch, 'plan')
      ? { plan: normalizeWorldGoalPlan(input.patch.plan) } : {}) }), now = this._time(), event = eventRecord(input.event, now);
    return this._transaction('readwrite', async store => {
      const previous = this._expected((await request(store.get(key)))?.record, goalId, expectedRevision);
      if (TERMINAL.has(previous.status)) throw new Error('Terminal goals cannot be resumed or changed');
      const record = changedRecord(previous, patch, now);
      if (event) record.trace = [...previous.trace, event].slice(-16);
      await request(store.put(this._row(record))); return record;
    }, signal);
  }
  remove(scope, input, { signal } = {}) {
    const key = scopeKey(worldGoalScope(scope)); fields(input, ['goalId', 'expectedRevision'], 'removal');
    agentIdentifier(input.goalId, 'goal ID'); integer(input.expectedRevision, Number.MAX_SAFE_INTEGER, 'expected revision');
    const { goalId, expectedRevision } = input;
    return this._transaction('readwrite', async store => {
      const previous = this._expected((await request(store.get(key)))?.record, goalId, expectedRevision);
      if (!TERMINAL.has(previous.status)) throw new Error('Cancel the goal before removing it');
      await request(store.delete(key)); return true;
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
