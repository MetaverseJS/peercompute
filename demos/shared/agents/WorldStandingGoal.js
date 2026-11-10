const encoder = new TextEncoder(), decoder = new TextDecoder('utf-8', { fatal: true });
const identifier = value => typeof value === 'string' && value.length > 0 && value.length <= 320 && !value.includes('\0');
const cancelled = () => new DOMException('Standing goal is no longer current', 'AbortError');
const message = error => Array.from(decoder.decode(encoder.encode(String(error?.message ?? error)))
  .replaceAll('\0', '')).slice(0, 128).join('');
function fields(value, allowed) {
  if (!value || ![Object.prototype, null].includes(Object.getPrototypeOf(value))
    || Reflect.ownKeys(value).some(key => !allowed.includes(key))) throw new TypeError('Invalid standing goal fields');
}
function text(value, maximum) {
  if (typeof value !== 'string' || !value.trim() || value.includes('\0')
    || encoder.encode(value).length > maximum || decoder.decode(encoder.encode(value)) !== value) {
    throw new TypeError('Invalid standing goal text');
  }
  return value.trim();
}
function decisionSnapshot(value) {
  fields(value, ['decision', 'text', 'intent', 'goal']);
  if (value.decision === 'quiet') {
    fields(value, ['decision']); return Object.freeze({ decision: 'quiet' });
  }
  if (value.decision !== 'speak') throw new TypeError('Invalid standing goal decision');
  const result = { decision: 'speak', text: text(value.text, 1800), intent: null };
  if (value.intent != null) {
    fields(value.intent, ['type', 'targetId', 'stopDistance']);
    const { type, targetId, stopDistance } = value.intent;
    if (!['look-at', 'approach'].includes(type) || !identifier(targetId)
      || (stopDistance !== undefined && (!Number.isFinite(stopDistance) || stopDistance < 8 || stopDistance > 30))) {
      throw new TypeError('Invalid standing goal intent');
    }
    result.intent = Object.freeze({ type, targetId, ...(stopDistance === undefined ? {} : { stopDistance }) });
  }
  if (value.goal !== undefined) result.goal = text(value.goal, 240);
  return Object.freeze(result);
}
function receiptSnapshot(value) {
  const { id, status, delivered, total } = value ?? {};
  if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(id)
    || !Number.isSafeInteger(delivered) || !Number.isSafeInteger(total) || delivered < 0 || total < delivered || total > 32
    || !(status === 'local-only' && total === 0
      || status === 'delivered' && total > 0 && delivered === total
      || status === 'partial' && delivered > 0 && delivered < total
      || status === 'failed' && delivered === 0 && total > 0)) throw new TypeError('Invalid standing goal delivery receipt');
  return Object.freeze({ id, status, delivered, total });
}

/** One durable encounter at a time. The caller selects opportunities, checks model
 * availability before run(), and binds optional movement to an authorized target.
 * Prepared sends are never automatically repeated, including after a crash or an
 * uncertain receipt. This is a duplicate-suppression ledger, not exactly-once delivery. */
export function createWorldStandingGoalRunner({ store } = {}) {
  if (!store || !['claim', 'prepare', 'finish', 'fail'].every(key => typeof store[key] === 'function')) {
    throw new TypeError('Standing goals require a durable encounter store');
  }
  let active, closed = false, disposal;
  function run({ scope, signal, isCurrent = () => true, decide, publish } = {}) {
    if (closed) return Promise.resolve({ status: 'closed' });
    if (active) return Promise.resolve({ status: 'busy' });
    fields(scope, ['worldId', 'agentId', 'goalId', 'targetId']);
    if (!['worldId', 'agentId', 'goalId', 'targetId'].every(key => identifier(scope[key]))
      || ![isCurrent, decide, publish].every(value => typeof value === 'function')) {
      throw new TypeError('Standing goals require a scope and synchronous authority check, decision and publication callbacks');
    }
    scope = Object.freeze({ ...scope });
    const requestId = crypto.randomUUID(), controller = new AbortController();
    const abort = () => controller.abort(signal?.reason ?? cancelled());
    if (signal?.aborted) abort(); else signal?.addEventListener('abort', abort, { once: true });
    const job = { controller }; active = job;
    function check() {
      controller.signal.throwIfAborted();
      const current = isCurrent();
      if (current?.then) Promise.resolve(current).catch(() => {});
      if (current !== true) { controller.abort(cancelled()); controller.signal.throwIfAborted(); }
    }
    job.done = Promise.resolve().then(async () => {
      let claimStarted = false, claimed = false, claimReturned = false, prepared = false, settling = false, delivery;
      try {
        check(); claimStarted = true;
        const result = await store.claim(scope, { requestId, signal: controller.signal });
        claimReturned = true; claimed = result?.claimed === true;
        check();
        if (!claimed) {
          const reason = result?.reason;
          return { status: reason === 'completed' ? 'already-handled' : reason === 'outcome-unknown' ? 'unknown'
            : ['cooldown', 'rate-limit'].includes(reason) ? 'cooldown' : 'blocked', reason,
          record: result?.record, nextAt: result?.nextAt, requestId };
        }
        const output = await decide({ signal: controller.signal, requestId });
        check(); const decision = decisionSnapshot(output);
        if (decision.decision === 'quiet') {
          check(); settling = true;
          const record = await store.finish(scope, { requestId, outcome: 'quiet' });
          return { status: 'quiet', requestId, record };
        }
        check();
        await store.prepare(scope, { requestId, text: decision.text, signal: controller.signal });
        prepared = true; check();
        // Publication may include movement. No external effect precedes durable preparation.
        delivery = receiptSnapshot(await publish(decision, { signal: controller.signal, requestId }));
        // An acknowledged send stays acknowledged even if cancellation arrived while sending.
        // Settlement intentionally has no cancelled effect signal; disposal waits for this write.
        settling = true;
        const record = await store.finish(scope, { requestId, outcome: 'spoken', delivery });
        return { status: 'spoken', requestId, record, delivery };
      } catch (error) {
        const wasCancelled = controller.signal.aborted || error?.name === 'AbortError';
        if (!claimStarted || claimReturned && !claimed) return { status: wasCancelled ? 'cancelled' : 'failed', requestId, error: message(error) };
        try {
          // fail inspects durable state: claimed can retry within its budget, prepared cannot.
          const record = await store.fail(scope, { requestId, error: message(error) });
          return { status: prepared || settling || record?.status === 'unknown' ? 'unknown' : wasCancelled ? 'cancelled' : 'failed',
            requestId, record, ...(delivery ? { delivery } : {}), error: message(error) };
        } catch (storageError) {
          return { status: 'unknown', requestId, ...(delivery ? { delivery } : {}), error: message(error), storageError: message(storageError) };
        }
      }
    }).finally(() => {
      signal?.removeEventListener('abort', abort);
      if (active === job) active = null;
    });
    return job.done;
  }
  function dispose() {
    if (disposal) return disposal;
    closed = true; active?.controller.abort(cancelled());
    disposal = Promise.resolve(active?.done).then(() => undefined);
    return disposal;
  }
  return Object.freeze({ run, dispose });
}
