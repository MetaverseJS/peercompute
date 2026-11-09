import { MOTOR_DYNAMICS as D } from '../../../shared/agents/motor/motorContracts.js';

const clamp = (value, maximum) => Math.max(-maximum, Math.min(maximum, value));
const validPair = value => Array.isArray(value) && value.length === 2 && value.every(Number.isFinite);
export const CUBE_NAVIGATION_PROGRESS = Object.freeze({ cellSize: 3, maximumCells: 256, blockedSeconds: 15, attemptSeconds: 120 });
const positionOf = entry => [entry.body.position.x, entry.body.position.z];
const cellOf = position => position.map(value => Math.floor(value / CUBE_NAVIGATION_PROGRESS.cellSize)).join(':');

/** Owns asynchronous motor decisions, never model weights or worker lifetime. */
export class CubeResidentMotor {
  constructor({ getEntries, observe, senseNavigation, now = () => performance.now() }) {
    if (![getEntries, observe, senseNavigation, now].every(value => typeof value === 'function')) throw new TypeError('Resident navigation requires observations and collision sensing');
    Object.assign(this, { getEntries, observe, senseNavigation, now });
    this.service = null; this.listeners = new Set(); this.commands = new Map();
    this.intents = new Map(); this.pending = null; this.closed = false; this.ticks = 0; this.epoch = 0;
  }
  setService(service) {
    if (service != null && typeof service.infer !== 'function') throw new TypeError('A managed resident motor service is required');
    this.epoch++; this.pending?.controller.abort(); this.commands.clear(); this.service = service;
    for (const [key, intent] of this.intents) {
      this.halt(this.getEntries().get(key)); intent.failed = false;
      delete intent.navigation;
      delete intent.policyId; delete intent.backend; delete intent.worker; delete intent.dispatches;
      if (intent.lastOutcome === 'failed') intent.lastOutcome = null;
      if (!intent.blocked) delete intent.blockedReason;
    }
  }
  subscribe(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  emit(key, intent, status, detail = {}) {
    if (intent.lastOutcome === status && status !== 'cancelled') return;
    intent.lastOutcome = status;
    const position = this.getEntries().get(key)?.mesh.position.toArray();
    const event = { key, ...(intent.requestId ? { requestId: intent.requestId } : {}), type: intent.type,
      ...(intent.targetId ? { targetId: intent.targetId } : {}), status, position,
      ...(intent.policyId ? { policyId: intent.policyId, backend: intent.backend } : {}), ...detail };
    for (const listener of this.listeners) { try { Promise.resolve(listener(event)).catch(() => {}); } catch { /* Observer only. */ } }
  }
  setIntent(key, input, { restoredOwner = false } = {}) {
    const entry = this.getEntries().get(key);
    if (!entry?.descriptor.local) throw new Error('Only the resident owner can set an intention');
    if (!input || !['stop', 'look-at', 'approach', 'follow'].includes(input.type)) throw new TypeError('Unknown resident intention');
    const stopDistance = input.stopDistance ?? D.defaultStopDistance;
    if (!Number.isFinite(stopDistance) || stopDistance < 8 || stopDistance > 30) throw new RangeError('Stop distance must be between 8 and 30');
    // Restoring a saved owner-follow preference can precede presence discovery.
    // This exception cannot select an arbitrary unseen person or resident.
    const deferredOwner = restoredOwner && input.type === 'follow' && input.targetId === `human:${entry.descriptor.ownerPeerId}`;
    if (input.type !== 'stop' && (typeof input.targetId !== 'string' || (!deferredOwner && !this.observe(key).participants.some(p => p.id === input.targetId)))) {
      throw new Error('The target is not currently observed');
    }
    if (input.requestId !== undefined && (typeof input.requestId !== 'string' || input.requestId.length > 128)) throw new TypeError('Invalid intention request');
    const previous = this.intents.get(key); if (previous) this.emit(key, previous, 'cancelled');
    const intent = { type: input.type, targetId: input.targetId, requestId: input.requestId, stopDistance, generation: Symbol(), lastOutcome: null };
    this.intents.set(key, intent); this.commands.delete(key); this.halt(entry);
    this.resetProgress(intent, entry);
    this.cancelUnusedBatch();
    if (intent.type === 'stop') { this.halt(entry); this.emit(key, intent, 'stopped'); }
    return { type: intent.type, targetId: intent.targetId, requestId: intent.requestId, stopDistance };
  }
  halt(entry) { if (entry) { entry.body.velocity.x = entry.body.velocity.z = 0; entry.body.force.x = entry.body.force.z = 0; } }
  cancelUnusedBatch() {
    if (this.pending && ![...this.pending.identities].some(([key, generation]) => this.intents.get(key)?.generation === generation)) {
      this.pending.controller.abort();
    }
  }
  suspend(key) {
    const intent = this.intents.get(key);
    if (intent && !intent.suspended) { intent.generation = Symbol(); intent.suspended = true; }
    if (intent) delete intent.navigation;
    this.commands.delete(key); this.halt(this.getEntries().get(key)); this.cancelUnusedBatch();
  }
  resetProgress(intent, entry) {
    const position = positionOf(entry);
    delete intent.navigation;
    intent.progress = { previous: position, travelled: 0, elapsed: 0, attempt: 0, lastNovel: 0, cells: new Set([cellOf(position)]) };
  }
  updateProgress(intent, entry, target, applied) {
    const progress = intent.progress, position = positionOf(entry);
    progress.travelled += Math.hypot(...position.map((value, i) => value - progress.previous[i]));
    progress.previous = position;
    if (!applied) return;
    progress.elapsed += D.fixedDt; progress.attempt += D.fixedDt;
    if (intent.type === 'follow' && progress.target && Math.hypot(...target.map((value, i) => value - progress.target[i])) > 3) {
      progress.cells.clear(); progress.lastNovel = progress.elapsed; progress.target = [...target]; progress.attempt = 0;
    }
    progress.target ??= [...target];
    const cell = cellOf(position);
    if (!progress.cells.has(cell)) {
      if (progress.cells.size >= CUBE_NAVIGATION_PROGRESS.maximumCells) progress.cells.delete(progress.cells.values().next().value);
      progress.cells.add(cell); progress.lastNovel = progress.elapsed;
    }
    if (progress.elapsed - progress.lastNovel >= CUBE_NAVIGATION_PROGRESS.blockedSeconds) {
      intent.blocked = true; intent.blockedReason = 'No new ground reached for 15 seconds';
    } else if (progress.attempt >= CUBE_NAVIGATION_PROGRESS.attemptSeconds) {
      intent.blocked = true; intent.blockedReason = 'Target not reached within 120 seconds of movement';
    }
  }
  clear(key) {
    const intent = this.intents.get(key); if (intent) this.emit(key, intent, 'cancelled');
    this.intents.delete(key); this.commands.delete(key); this.halt(this.getEntries().get(key)); this.cancelUnusedBatch();
  }
  invalidateNavigation() { for (const intent of this.intents.values()) delete intent.navigation; }
  beforeStep() {
    if (this.closed) return;
    const requests = [], identities = new Map(), controlDue = (this.ticks + 1) % D.controlSteps === 0;
    for (const [key, intent] of this.intents) {
      const entry = this.getEntries().get(key); if (!entry?.descriptor.local) continue;
      if (entry.descriptor.status === 'paused') { this.suspend(key); continue; }
      intent.suspended = false;
      if (intent.type === 'stop' || intent.blocked || intent.failed || intent.completed) { this.halt(entry); continue; }
      const target = this.observe(key).participants.find(p => p.id === intent.targetId);
      if (!target) {
        if (intent.lastOutcome !== 'target-lost') { intent.generation = Symbol(); this.resetProgress(intent, entry); }
        this.halt(entry); this.commands.delete(key); this.cancelUnusedBatch(); intent.distance = null;
        this.emit(key, intent, 'target-lost'); continue;
      }
      intent.targetName = String(target.name ?? 'Target').slice(0, 120);
      if (intent.type === 'look-at') {
        entry.mesh.rotation.y = Math.atan2(target.position[0] - entry.body.position.x, target.position[2] - entry.body.position.z);
        this.halt(entry); this.emit(key, intent, 'arrived', { target: [...target.position] }); continue;
      }
      const dx = target.position[0] - entry.body.position.x, dz = target.position[2] - entry.body.position.z;
      const distance = Math.hypot(dx, dz), targetVelocity = [target.velocity?.[0] ?? 0, target.velocity?.[2] ?? 0];
      const speed = Math.hypot(entry.body.velocity.x - (intent.type === 'follow' ? targetVelocity[0] : 0),
        entry.body.velocity.z - (intent.type === 'follow' ? targetVelocity[1] : 0));
      let navigation = intent.navigation;
      const mayArrive = distance <= intent.stopDistance + .6 && speed < .6;
      try {
        if (controlDue || !navigation || (mayArrive && intent.lastOutcome !== 'arrived' && navigation.targetClear)) {
          navigation = intent.navigation = this.senseNavigation(key, target);
        }
      }
      catch (error) {
        intent.failed = true; intent.blockedReason = String(error.message).slice(0, 240); intent.generation = Symbol();
        this.halt(entry); this.commands.delete(key); this.cancelUnusedBatch();
        this.emit(key, intent, 'failed', { reason: intent.blockedReason }); continue;
      }
      if (intent.lastOutcome === 'target-lost') intent.lastOutcome = null;
      intent.distance = distance; intent.targetClear = navigation.targetClear;
      const command = this.commands.get(key);
      const fresh = command && command.generation === intent.generation && this.now() - command.at <= 750;
      this.updateProgress(intent, entry, [entry.body.position.x + dx, entry.body.position.z + dz], fresh);
      if (mayArrive && navigation.targetClear) {
        this.emit(key, intent, 'arrived', { target: [...target.position] });
        intent.progress.lastNovel = intent.progress.elapsed; intent.progress.attempt = 0;
        intent.blocked = false;
        if (intent.type === 'approach') {
          intent.completed = true; intent.generation = Symbol(); this.halt(entry); this.commands.delete(key); this.cancelUnusedBatch(); continue;
        }
      } else if ((distance > intent.stopDistance + 2 || !navigation.targetClear) && intent.lastOutcome === 'arrived') intent.lastOutcome = null;
      if (intent.blocked) {
        intent.generation = Symbol(); this.halt(entry); this.commands.delete(key); this.cancelUnusedBatch();
        this.emit(key, intent, 'blocked', { target: [...target.position], reason: intent.blockedReason }); continue;
      }
      if (!this.service) {
        this.halt(entry); intent.failed = true; intent.blockedReason = 'Managed WebGPU motor is unavailable';
        this.emit(key, intent, 'failed', { reason: intent.blockedReason }); continue;
      }
      if (fresh) {
        entry.body.force.x += D.mass * command.acceleration[0]; entry.body.force.z += D.mass * command.acceleration[1];
      } else this.halt(entry);
      if (controlDue && requests.length < D.maximumResidents) {
        requests.push({ id: key, observation: { relativePosition: [dx, dz], velocity: [entry.body.velocity.x, entry.body.velocity.z],
          targetVelocity, stopDistance: intent.stopDistance, clearance: navigation.clearance, targetClear: navigation.targetClear,
          previousAcceleration: fresh ? [...command.acceleration] : [0, 0] } });
        identities.set(key, intent.generation);
      }
    }
    if (++this.ticks % D.controlSteps || this.pending || !requests.length || !this.service) return;
    const epoch = this.epoch, controller = new AbortController(), service = this.service;
    const timer = setTimeout(() => controller.abort(new DOMException('Motor inference timed out', 'TimeoutError')), 10000);
    const job = { controller, identities }; this.pending = job;
    job.done = Promise.resolve().then(() => {
      controller.signal.throwIfAborted(); return service.infer(requests, { signal: controller.signal });
    }).then(output => {
      if (this.closed || this.epoch !== epoch || controller.signal.aborted) return;
      if (!Array.isArray(output?.results)) throw new Error('Invalid managed motor output');
      const seen = new Set();
      for (const result of output.results) {
        if (seen.has(result.id) || !identities.has(result.id) || !validPair(result.acceleration)) throw new Error('Invalid resident motor action');
        seen.add(result.id);
      }
      if (seen.size !== requests.length) throw new Error('Incomplete resident motor output');
      for (const result of output.results) {
        const intent = this.intents.get(result.id);
        if (intent?.generation !== identities.get(result.id)) continue;
        this.commands.set(result.id, { generation: intent.generation, at: this.now(), acceleration: result.acceleration.map(v => clamp(v, D.maxAcceleration)) });
        intent.policyId = output.policyId; intent.backend = output.backend; intent.worker = output.worker === true;
        intent.dispatches = Number.isSafeInteger(output.dispatches) ? output.dispatches : undefined;
      }
    }).catch(error => {
      if (this.closed || this.epoch !== epoch) return;
      for (const [key, generation] of identities) {
        const intent = this.intents.get(key); if (intent?.generation !== generation) continue;
        this.commands.delete(key); const entry = this.getEntries().get(key); if (entry) this.halt(entry);
        intent.failed = true; intent.blockedReason = String(error.message).slice(0, 240);
        this.emit(key, intent, 'failed', { reason: intent.blockedReason });
      }
    }).finally(() => { clearTimeout(timer); if (this.pending === job) this.pending = null; });
  }
  getResidentStatus(key) {
    const entry = this.getEntries().get(key); if (!entry?.descriptor.local) return null;
    const intent = this.intents.get(key), progress = intent?.progress;
    const command = this.commands.get(key);
    const fresh = command && command.generation === intent?.generation && this.now() - command.at <= 750;
    const status = entry.descriptor.status === 'paused' ? 'paused' : !intent ? 'idle'
      : intent.type === 'stop' ? 'stopped' : intent.failed ? 'failed' : intent.blocked ? 'blocked'
      : intent.lastOutcome === 'target-lost' ? 'target-lost' : intent.lastOutcome === 'arrived' ? 'arrived'
      : !fresh ? 'loading' : intent.targetClear ? 'moving' : 'detouring';
    return { key, type: intent?.type ?? entry.movement ?? 'idle', targetId: intent?.targetId ?? null,
      targetName: intent?.targetName ?? null, status, distance: intent?.distance ?? null,
      stopDistance: intent?.stopDistance ?? null,
      progress: { distanceTravelled: progress?.travelled ?? 0,
        unproductiveSeconds: progress ? Math.max(0, progress.elapsed - progress.lastNovel) : 0,
        targetClear: intent?.targetClear ?? null }, blockedReason: intent?.blockedReason ?? null,
      backend: intent?.backend ?? null, policyId: intent?.policyId ?? null,
      worker: intent?.worker === true, dispatches: intent?.dispatches ?? 0 };
  }
  getStatus() { return { available: !!this.service, pending: !!this.pending, intents: this.intents.size, backend: this.service?.getStatus?.(),
    residents: [...this.getEntries().keys()].map(key => this.getResidentStatus(key)).filter(Boolean).slice(0, D.maximumResidents) }; }
  dispose() {
    this.closed = true; this.epoch++; this.pending?.controller.abort();
    for (const key of this.intents.keys()) this.halt(this.getEntries().get(key));
    this.intents.clear(); this.commands.clear(); this.listeners.clear();
  }
}
