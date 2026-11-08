import { AGENT_TASKS, normalizeAgentTask, packAgentContext, routeAgentTask } from './AgentRouter.js';
import { normalizeAgentRecord } from './AgentContracts.js';

const copy = (value) => structuredClone(value);
const abortError = (reason = 'Agent task cancelled') => new DOMException(String(reason?.message ?? reason), 'AbortError');
const failure = (message, code) => Object.assign(new Error(message), { code });
const activeOperation = (head) => ['prepared', 'dispatched'].includes(head.pendingOperation?.status);

export const AGENT_CAPABILITIES = Object.freeze({ generalAgent: true, baselineRouting: true,
  learnedRouting: false, peerRouter: false, modelProvisioning: false, mobility: false, tasks: AGENT_TASKS });

/** One direct decision per request. Persistence and inference remain manager-owned. */
export class AgentRuntime {
  constructor({ store, inference, router = routeAgentTask, maximumQueued = 8, taskTimeoutMs = 300_000 } = {}) {
    if (!store?.withRun || !store?.commit || !inference?.listCandidates || !inference?.generate) {
      throw new Error('AgentRuntime requires acknowledged storage and a managed inference adapter');
    }
    if (!Number.isSafeInteger(maximumQueued) || maximumQueued < 1 || maximumQueued > 32
        || !Number.isSafeInteger(taskTimeoutMs) || taskTimeoutMs < 1 || taskTimeoutMs > 300_000) throw new Error('Invalid agent queue limits');
    Object.assign(this, { store, inference, router, maximumQueued, taskTimeoutMs });
    this.capabilities = AGENT_CAPABILITIES;
    this.listeners = new Set(); this.entries = new Map(); this.activities = new Map(); this.unsaved = new Map();
    this.queue = []; this.active = null; this.closed = false;
  }
  #open() { if (this.closed) throw new Error('Agent runtime is closed'); }
  #emit(event) {
    for (const listener of this.listeners) { try { Promise.resolve(listener(copy(event))).catch(() => {}); } catch { /* UI callbacks cannot change execution. */ } }
  }
  #activity(id, value) { this.activities.set(id, value); this.#emit({ type: 'activity', agentId: id, activity: value }); }
  #view(head) {
    if (!head) return head;
    const activity = this.activities.get(head.agentId);
    return { ...head, ...(activity ? { activity: copy(activity) } : {}),
      ...(activeOperation(head) && !this.entries.has(head.agentId) ? { recoveryRequired: true } : {}) };
  }
  #assertSaved(id) {
    if (this.unsaved.has(id)) throw failure('Agent changes are not saved. Resume to retry saving before another action.', 'ERR_AGENT_UNSAVED');
  }
  async list(options) { this.#open(); return (await this.store.list(options)).map((head) => this.#view(head)); }
  async get(id) { this.#open(); return this.#view(await this.store.get(id)); }
  events(id, options) { this.#open(); return this.store.events(id, options); }
  getAttachment(id, attachmentId) { this.#open(); return this.store.getAttachment(id, attachmentId); }
  subscribe(listener) { this.#open(); this.listeners.add(listener); return () => this.listeners.delete(listener); }
  async create(input) {
    this.#open(); const head = await this.store.create(copy(input));
    this.#emit({ type: 'changed', agentId: head.agentId, head }); return head;
  }
  async update(id, input, { expectedRevision, signal } = {}) {
    this.#open(); this.#assertSaved(id);
    if (this.entries.has(id)) throw failure('Wait for this agent task to finish before editing', 'ERR_AGENT_BUSY');
    return this.store.withRun(id, async ({ head, signal: lockSignal }) => {
      if (activeOperation(head)) throw failure('Resolve the interrupted operation with Resume before editing', 'ERR_AGENT_RECOVERY_REQUIRED');
      if (expectedRevision !== undefined && expectedRevision !== head.revision) throw failure('Agent changed in another session', 'ERR_AGENT_REVISION');
      const updated = copy(head);
      if (input.name !== undefined) updated.identity.name = input.name;
      if (input.instructions !== undefined) updated.identity.instructions = input.instructions;
      if (input.goals !== undefined) updated.goals = copy(input.goals);
      if (input.summary !== undefined) updated.context.summary = input.summary;
      if (input.inferenceMode !== undefined) updated.policy.inferenceMode = input.inferenceMode;
      if (input.embodiments !== undefined) updated.embodiments = copy(input.embodiments);
      return this.#save(id, head, { head: normalizeAgentRecord(updated), event: { type: 'edited', text: 'Agent settings saved' } }, lockSignal);
    }, { signal });
  }
  async remove(id, { expectedRevision, signal } = {}) {
    this.#open(); await this.cancel(id);
    const head = await this.store.get(id, { signal });
    if (expectedRevision !== undefined && expectedRevision !== head.revision) throw failure('Agent changed in another session', 'ERR_AGENT_REVISION');
    await this.store.delete(id, { expectedRevision: head.revision, signal });
    this.activities.delete(id); this.unsaved.delete(id); this.#emit({ type: 'removed', agentId: id }); return true;
  }
  export(id) { this.#open(); return this.store.export(id); }
  async importAsNew(bundle, options) {
    this.#open(); const head = await this.store.restoreAsNew(copy(bundle), options);
    this.#emit({ type: 'changed', agentId: head.agentId, head }); return head;
  }
  async #save(id, previous, change, signal) {
    try {
      const head = await this.store.commit(id, { expectedRevision: previous.revision, ...change }, { signal });
      this.#emit({ type: 'changed', agentId: id, head }); return head;
    } catch (error) {
      this.unsaved.set(id, { expectedRevision: previous.revision, change: copy(change) });
      this.#activity(id, { status: 'paused', unsaved: true, error: `Not saved: ${error.message}` });
      throw error;
    }
  }
  run(id, options = {}) {
    this.#open(); this.#assertSaved(id);
    if (this.entries.has(id)) throw failure('This agent already has a queued or active task', 'ERR_AGENT_BUSY');
    if (this.queue.length >= this.maximumQueued) throw failure('Agent task queue is full', 'ERR_AGENT_QUEUE_FULL');
    const input = normalizeAgentTask(options);
    options.signal?.throwIfAborted();
    const controller = new AbortController();
    const signal = options.signal ? AbortSignal.any([controller.signal, options.signal]) : controller.signal;
    const entry = { id, input, controller, signal, requestId: crypto.randomUUID(), onEvent: options.onEvent,
      dispatched: false, route: null };
    entry.promise = new Promise((resolve, reject) => Object.assign(entry, { resolve, reject }));
    entry.promise.catch(() => {}); // Cancellation can settle before the UI attaches its handler.
    entry.timer = setTimeout(() => controller.abort(abortError('Agent task deadline exceeded')), this.taskTimeoutMs);
    entry.queuedAbort = () => {
      const index = this.queue.indexOf(entry);
      if (index < 0) return;
      this.queue.splice(index, 1); this.entries.delete(id); clearTimeout(entry.timer);
      signal.removeEventListener('abort', entry.queuedAbort);
      this.#activity(id, { status: 'paused' }); entry.reject(abortError(signal.reason));
    };
    signal.addEventListener('abort', entry.queuedAbort, { once: true });
    this.entries.set(id, entry); this.queue.push(entry);
    this.#activity(id, { status: 'queued', requestId: entry.requestId }); this.#pump();
    return entry.promise;
  }
  #pump() {
    if (this.active || !this.queue.length) return;
    const entry = this.queue.shift(); this.active = entry;
    entry.signal.removeEventListener('abort', entry.queuedAbort);
    const finish = (callback, value) => {
      clearTimeout(entry.timer); this.entries.delete(entry.id); this.active = null; this.#pump();
      callback(value);
    };
    this.#execute(entry).then((value) => finish(entry.resolve, value), (error) => finish(entry.reject, error));
  }
  async #execute(entry) {
    const { id, input, requestId, signal } = entry;
    try {
      return await this.store.withRun(id, async ({ head, signal: lockSignal }) => {
        let saved = normalizeAgentRecord(head); let prepared = false;
        const combined = AbortSignal.any([signal, lockSignal]);
        if (saved.authority.hostId !== this.store.hostId) throw failure('This agent belongs to a different local installation', 'ERR_AGENT_AUTHORITY');
        if (activeOperation(saved)) throw failure('This agent has an interrupted operation. Resume to acknowledge its unknown outcome; it will not replay.', 'ERR_AGENT_RECOVERY_REQUIRED');
        if (saved.status === 'paused') throw failure('Resume this paused agent before sending a task', 'ERR_AGENT_PAUSED');
        try {
          combined.throwIfAborted();
          const events = [];
          for (let after; ;) {
            const page = await this.store.events(id, { limit: 100, after, signal: combined });
            events.push(...page);
            if (page.length < 100 || events.length >= 300) break;
            after = page.at(-1).sequence;
          }
          const packed = packAgentContext(saved, input, events);
          const candidates = await this.inference.listCandidates({ mode: saved.policy.inferenceMode, task: input.task, signal: combined, refresh: true });
          combined.throwIfAborted();
          const selected = this.router({ task: input.task, inferenceMode: saved.policy.inferenceMode, candidates: copy(candidates) }).candidate;
          const snapshot = candidates.find((item) => item.key === selected?.key && item.manifestCid === selected?.manifestCid
            && item.sessionId === selected?.sessionId && item.local === selected?.local);
          if (!snapshot) throw new Error('Router selected a model outside the current candidate snapshot');
          // Reapply eligibility to the original snapshot, never scorer-supplied capabilities.
          const { candidate, route } = routeAgentTask({ task: input.task, inferenceMode: saved.policy.inferenceMode, candidates: [snapshot] });
          entry.route = route;
          const attachmentId = input.image ? crypto.randomUUID() : null;
          const operation = { id: requestId, status: 'prepared', task: input.task, contextRevision: saved.revision,
            policyMode: saved.policy.inferenceMode, authorityEpoch: saved.authority.epoch, route };
          saved = await this.#save(id, saved, { head: { ...saved, status: 'running' }, operation,
            event: { type: 'request', operationId: requestId, task: input.task, text: input.prompt, route,
              ...(input.conversationId !== undefined ? { conversationId: input.conversationId } : {}),
              ...(attachmentId ? { attachmentIds: [attachmentId], inputAttachmentId: attachmentId } : {}) },
            ...(attachmentId ? { attachments: [{ id: attachmentId, ...input.image }] } : {}) }, combined);
          prepared = true; combined.throwIfAborted();
          saved = await this.#save(id, saved, { head: saved, operation: { ...operation, status: 'dispatched' } }, combined);
          combined.throwIfAborted();
          entry.dispatched = true;
          this.#activity(id, { status: 'running', requestId, route });
          const progress = (event) => {
            if (combined.aborted) return;
            if (event?.type === 'accepted' && typeof event.peerId === 'string') {
              entry.route = { ...route, peerId: event.peerId.slice(0, 128) };
              this.#activity(id, { status: 'running', requestId, route: entry.route });
            }
            const update = { type: 'progress', agentId: id, event };
            this.#emit(update); try { Promise.resolve(entry.onEvent?.(copy(update))).catch(() => {}); } catch { /* Rendering is not execution. */ }
          };
          entry.generation = Promise.resolve(this.inference.generate(candidate, { ...packed, requestId }, {
            signal: combined, onProgress: progress, onToken: (text) => {
              if (combined.aborted) return;
              const event = { type: 'token', agentId: id, text };
              this.#emit(event); try { Promise.resolve(entry.onEvent?.(event)).catch(() => {}); } catch { /* Rendering is not execution. */ }
            },
          }));
          const result = { ...await entry.generation };
          combined.throwIfAborted();
          if (typeof result?.text !== 'string' || new TextEncoder().encode(result.text).length > 65536) throw new Error('Invalid agent inference result');
          if (input.task === 'text-to-image') {
            if (!result.image) throw new Error('Image generation returned no image');
            result.image = normalizeAgentTask({ task: 'image-text-to-text', prompt: 'Validate generated pixels', image: result.image }).image;
          } else if (result.image != null) throw new Error('Text generation returned an unexpected image');
          const actualRoute = { ...entry.route, ...(result.peerId ? { peerId: String(result.peerId).slice(0, 128) } : {}) };
          const imageId = result.image ? crypto.randomUUID() : null;
          saved = await this.#save(id, saved, { head: { ...saved, status: 'completed' },
            operation: { ...operation, status: 'completed', route: actualRoute },
            event: { type: 'result', operationId: requestId, task: input.task, text: result.text, route: actualRoute,
              ...(input.conversationId !== undefined ? { conversationId: input.conversationId } : {}),
              finishReason: result.finishReason ?? 'unknown',
              ...(imageId ? { attachmentIds: [imageId], imageAttachmentId: imageId } : {}) },
            ...(imageId ? { attachments: [{ id: imageId, ...result.image }] } : {}) });
          this.#activity(id, { status: 'completed', requestId, route: actualRoute });
          return { agentId: id, requestId, head: saved, result, route: actualRoute,
            ...(imageId ? { imageAttachmentId: imageId } : {}) };
        } catch (error) {
          if (!this.unsaved.has(id)) {
            const status = error.committed ? 'outcome-unknown' : combined.aborted ? 'cancelled' : 'failed';
            const text = String(error.message ?? error).slice(0, 2048);
            try {
              await this.#save(id, saved, { head: { ...saved, status: 'paused' },
                ...(prepared ? { operation: { id: requestId, status, ...(entry.route ? { route: entry.route } : {}) } } : {}),
                event: { type: status, operationId: requestId, text, ...(entry.route ? { route: entry.route } : {}),
                  ...(!prepared ? { dispatched: false } : {}) } });
            } catch { /* #save preserves the failed checkpoint for explicit reconciliation. */ }
            if (!this.unsaved.has(id)) this.#activity(id, { status: 'paused', error: text, ...(entry.route ? { route: entry.route } : {}) });
          }
          throw error;
        }
      }, { signal });
    } catch (error) {
      if (!this.unsaved.has(id)) this.#activity(id, { status: 'paused', error: String(error.message ?? error).slice(0, 2048) });
      throw error;
    }
  }
  async cancel(id) {
    const entry = this.entries.get(id);
    if (!entry) return false;
    this.#activity(id, { status: 'cancelling', requestId: entry.requestId, ...(entry.route ? { route: entry.route } : {}) });
    entry.controller.abort(abortError());
    let cleanupError;
    if (entry.dispatched) try { await this.inference.cancel?.(entry.requestId); } catch (error) { cleanupError = error; }
    await entry.promise.catch(() => {});
    if (cleanupError) throw cleanupError;
    return true;
  }
  async pause(id) {
    this.#open(); await this.cancel(id); this.#assertSaved(id);
    return this.store.withRun(id, async ({ head }) => {
      if (activeOperation(head)) throw failure('Resume must acknowledge this interrupted operation before it can be changed', 'ERR_AGENT_RECOVERY_REQUIRED');
      const paused = await this.#save(id, head, { head: { ...head, status: 'paused' }, event: { type: 'paused', text: 'Agent paused' } });
      this.#activity(id, { status: 'paused' }); return paused;
    });
  }
  async resume(id) {
    this.#open();
    if (this.entries.has(id)) throw failure('Wait for cleanup before resuming', 'ERR_AGENT_BUSY');
    return this.store.withRun(id, async ({ head }) => {
      const pending = this.unsaved.get(id);
      let next;
      if (pending) {
        const changed = head.revision !== pending.expectedRevision;
        const change = changed ? { head, event: { type: 'stale-discarded', text: 'Unsaved stale changes discarded; the newer saved identity and context were preserved.' },
          ...(activeOperation(head) ? { operation: { ...head.pendingOperation, status: 'outcome-unknown' } } : {}) } : copy(pending.change);
        change.head.status = 'waiting';
        // An unsaved dispatch intent must never become runnable after reconciliation.
        if (['prepared', 'dispatched'].includes(change.operation?.status)) {
          if (head.pendingOperation?.id === change.operation.id) change.operation.status = 'outcome-unknown';
          else { delete change.operation; change.event = { type: 'cancelled', text: 'Unsent task discarded while retrying an unsaved checkpoint.' }; delete change.attachments; }
        }
        next = await this.store.commit(id, { expectedRevision: head.revision, ...change });
        this.unsaved.delete(id);
      } else {
        next = await this.#save(id, head, { head: { ...head, status: 'waiting' },
          ...(activeOperation(head) ? { operation: { ...head.pendingOperation, status: 'outcome-unknown' } } : {}),
          event: { type: activeOperation(head) ? 'outcome-unknown' : 'resumed',
            text: activeOperation(head) ? 'Interrupted operation acknowledged; no task was replayed.' : 'Ready for a new direct task; no task was started.' } });
      }
      this.#activity(id, { status: 'waiting' }); this.#emit({ type: 'changed', agentId: id, head: next }); return next;
    });
  }
  async dispose() {
    if (this.disposing) return this.disposing;
    this.closed = true;
    this.disposing = (async () => {
      const results = await Promise.allSettled([...this.entries.keys()].map((id) => this.cancel(id)));
      this.listeners.clear();
      const errors = results.filter((result) => result.status === 'rejected').map((result) => result.reason);
      if (errors.length) { this.disposing = null; throw new AggregateError(errors, 'Agent cleanup is incomplete'); }
    })();
    return this.disposing;
  }
}
