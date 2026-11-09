import { MOTOR_DYNAMICS as D } from '../../../shared/agents/motor/motorContracts.js';

const clamp = (value, maximum) => Math.max(-maximum, Math.min(maximum, value));
const validPair = value => Array.isArray(value) && value.length === 2 && value.every(Number.isFinite);

/** Owns asynchronous motor decisions, never model weights or worker lifetime. */
export class CubeResidentMotor {
  constructor({ getEntries, observe, now = () => performance.now() }) {
    Object.assign(this, { getEntries, observe, now });
    this.service = null; this.listeners = new Set(); this.commands = new Map();
    this.intents = new Map(); this.pending = null; this.closed = false; this.ticks = 0; this.epoch = 0;
  }
  setService(service) {
    if (service != null && typeof service.infer !== 'function') throw new TypeError('A managed resident motor service is required');
    this.epoch++; this.pending?.controller.abort(); this.pending = null; this.commands.clear(); this.service = service;
    for (const intent of this.intents.values()) { intent.failed = false; if (intent.lastOutcome === 'failed') intent.lastOutcome = null; }
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
    this.intents.set(key, intent); this.commands.delete(key);
    if (intent.type === 'stop') { this.halt(entry); this.emit(key, intent, 'stopped'); }
    return { type: intent.type, targetId: intent.targetId, requestId: intent.requestId, stopDistance };
  }
  halt(entry) { entry.body.velocity.x = entry.body.velocity.z = 0; entry.body.force.x = entry.body.force.z = 0; }
  clear(key) {
    const intent = this.intents.get(key); if (intent) this.emit(key, intent, 'cancelled');
    this.intents.delete(key); this.commands.delete(key);
  }
  beforeStep() {
    if (this.closed) return;
    const requests = [], identities = new Map();
    for (const [key, intent] of this.intents) {
      const entry = this.getEntries().get(key); if (!entry?.descriptor.local) continue;
      if (entry.descriptor.status === 'paused' || intent.type === 'stop' || intent.blocked || intent.failed) { this.halt(entry); continue; }
      const target = this.observe(key).participants.find(p => p.id === intent.targetId);
      if (!target) { this.halt(entry); this.commands.delete(key); this.emit(key, intent, 'target-lost'); continue; }
      const dx = target.position[0] - entry.body.position.x, dz = target.position[2] - entry.body.position.z;
      if (intent.type === 'look-at') {
        entry.mesh.rotation.y = Math.atan2(dx, dz); this.halt(entry);
        this.emit(key, intent, 'arrived', { target: [...target.position] }); continue;
      }
      if (intent.lastOutcome === 'target-lost') intent.lastOutcome = null;
      const distance = Math.hypot(dx, dz), speed = Math.hypot(entry.body.velocity.x, entry.body.velocity.z);
      if (intent.progressDistance === undefined || distance < intent.progressDistance - .25) {
        intent.progressDistance = distance; intent.stalledSteps = 0;
      } else if (distance > intent.stopDistance + 2 && this.commands.has(key) && ++intent.stalledSteps > 300) {
        intent.blocked = true; this.halt(entry); this.commands.delete(key); this.emit(key, intent, 'blocked', { target: [...target.position] }); continue;
      }
      if (distance <= intent.stopDistance + .6 && speed < .6) {
        this.emit(key, intent, 'arrived', { target: [...target.position] });
        if (intent.type === 'approach') { this.halt(entry); continue; }
      } else if (distance > intent.stopDistance + 2 && intent.lastOutcome === 'arrived') intent.lastOutcome = null;
      if (!this.service) { this.halt(entry); intent.failed = true; this.emit(key, intent, 'failed', { reason: 'Managed WebGPU motor is unavailable' }); continue; }
      const command = this.commands.get(key);
      if (command && command.generation === intent.generation && this.now() - command.at <= 750) {
        entry.body.force.x += D.mass * command.acceleration[0]; entry.body.force.z += D.mass * command.acceleration[1];
      } else this.halt(entry);
      if (requests.length < D.maximumResidents) {
        requests.push({ id: key, observation: { relativePosition: [dx, dz], velocity: [entry.body.velocity.x, entry.body.velocity.z],
          targetVelocity: [target.velocity?.[0] ?? 0, target.velocity?.[2] ?? 0], stopDistance: intent.stopDistance } });
        identities.set(key, intent.generation);
      }
    }
    if (++this.ticks % D.controlSteps || this.pending || !requests.length || !this.service) return;
    const epoch = this.epoch, controller = new AbortController(), service = this.service;
    const timer = setTimeout(() => controller.abort(new DOMException('Motor inference timed out', 'TimeoutError')), 10000);
    const job = { controller }; this.pending = job;
    job.done = Promise.resolve().then(() => service.infer(requests, { signal: controller.signal })).then(output => {
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
        intent.policyId = output.policyId; intent.backend = output.backend;
      }
    }).catch(error => {
      if (this.closed || this.epoch !== epoch) return;
      for (const [key, generation] of identities) {
        const intent = this.intents.get(key); if (intent?.generation !== generation) continue;
        this.commands.delete(key); const entry = this.getEntries().get(key); if (entry) this.halt(entry);
        intent.failed = true;
        this.emit(key, intent, 'failed', { reason: String(error.message).slice(0, 240) });
      }
    }).finally(() => { clearTimeout(timer); if (this.pending === job) this.pending = null; });
  }
  getStatus() { return { available: !!this.service, pending: !!this.pending, intents: this.intents.size, backend: this.service?.getStatus?.() }; }
  dispose() { this.closed = true; this.epoch++; this.pending?.controller.abort(); this.intents.clear(); this.commands.clear(); this.listeners.clear(); }
}
