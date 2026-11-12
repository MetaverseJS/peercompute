import { classifyInferenceAvailability } from '../../../peercompute/src/peercompute/inference/InferenceAvailability.js';

export const WORLD_OODA_TIMING = Object.freeze({ minimumMs: 60000, maximumMs: 180000, resourceMs: 5000 });
export function residentRecoveryDelay(random = Math.random) {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new TypeError('Recovery randomness must be in [0, 1)');
  return WORLD_OODA_TIMING.minimumMs + Math.floor(value * (WORLD_OODA_TIMING.maximumMs - WORLD_OODA_TIMING.minimumMs + 1));
}
const cancelled = () => new DOMException('Resident deliberation superseded', 'AbortError');
const recovering = body => body.pauseCause === 'automatic' || body.recoveryRequired && body.pauseCause !== 'owner';
const ownerPaused = body => body.pauseCause === 'owner' || body.status === 'paused' && !recovering(body);

/** One slow, fair deliberation/recovery slot. It borrows the world's existing
 * task/model/body adapters; it never creates a worker, replays a request, or
 * runs a second action while cancellation is still being acknowledged. */
export function createWorldOodaLoop({ getResidents, cycle, recover, onStatus = () => {},
  now = Date.now, random = Math.random, setTimer = setTimeout, clearTimer = clearTimeout,
  tickMs = 1000, initialDelayMs = 10000 } = {}) {
  if (![getResidents, cycle, recover, onStatus, now, random, setTimer, clearTimer].every(fn => typeof fn === 'function')
      || !Number.isFinite(tickMs) || tickMs < 10 || tickMs > 30000
      || !Number.isFinite(initialDelayMs) || initialDelayMs < 0 || initialDelayMs > 180000) throw new TypeError('Invalid resident loop adapters');
  const states = new Map();
  let timer, active, closed = false, disposal, quietUntil = 0, lastClock = 0;
  const emit = (body, state, status, extra = {}) => {
    state.status = status;
    const event = { key: body.key, agentId: body.agentId, status, nextAt: state.nextAt, ...extra };
    const signature = JSON.stringify(event);
    if (signature === state.lastStatus) return;
    state.lastStatus = signature;
    try { Promise.resolve(onStatus(event)).catch(() => {}); } catch { /* UI is observational. */ }
  };
  function clock() {
    const at = now();
    if (!Number.isSafeInteger(at) || at < 0) throw new TypeError('Invalid resident clock');
    if (at < lastClock) {
      active?.controller.abort(cancelled()); quietUntil = at + 30000;
      for (const state of states.values()) state.nextAt = at + Math.max(0, state.nextAt - lastClock);
    }
    lastClock = at; return at;
  }
  function enumerate(at) {
    const bodies = getResidents();
    if (!Array.isArray(bodies)) throw new TypeError('Resident loop enumeration must be synchronous');
    const kept = new Set();
    for (const body of bodies) {
      if (!body?.local || !body.key || !body.agentId || kept.size >= 16 || kept.has(body.key)) continue;
      kept.add(body.key);
      let state = states.get(body.key);
      if (!state || state.agentId !== body.agentId) {
        state = { agentId: body.agentId, nextAt: at + (recovering(body) ? residentRecoveryDelay(random) : initialDelayMs), lastStarted: -1 };
        states.set(body.key, state);
      } else if (recovering(body) && !recovering(state.body ?? {})) {
        state.nextAt = at + residentRecoveryDelay(random);
      }
      state.body = body;
      if (ownerPaused(body)) emit(body, state, 'owner-paused');
      else if (recovering(body)) emit(body, state, 'recovering');
      else if (body.autonomous === false) emit(body, state, 'disabled');
    }
    for (const key of states.keys()) if (!kept.has(key)) states.delete(key);
  }
  function current(run) {
    if (closed || run.controller.signal.aborted) return false;
    const at = clock(); enumerate(at);
    const body = states.get(run.key)?.body;
    const valid = body && !ownerPaused(body) && body.local && body.agentId === run.body.agentId
      && (run.recovery || body.autonomous !== false && body.revision === run.body.revision)
      && at >= quietUntil;
    if (!valid) run.controller.abort(cancelled());
    return !!valid;
  }
  function arm() {
    if (closed || timer !== undefined) return;
    timer = setTimer(() => { timer = undefined; tick(); arm(); }, tickMs); timer?.unref?.();
  }
  function start(state, at) {
    const body = { ...state.body }, controller = new AbortController();
    const run = { key: body.key, body, controller, recovery: recovering(body) }; active = run;
    state.lastStarted = at;
    const deadline = setTimer(() => controller.abort(new DOMException('Resident deliberation timed out', 'TimeoutError')), 120000);
    const stage = status => { if (current(run)) emit(body, state, status); };
    run.done = Promise.resolve().then(async () => {
      if (!current(run)) return;
      if (state.body.available === false) return { status: 'waiting' };
      emit(body, state, run.recovery ? 'recovering' : 'observing');
      return run.recovery ? recover(body, { signal: controller.signal })
        : cycle({ resident: body, signal: controller.signal, isCurrent: () => current(run), stage });
    }).then(result => {
      if (!current(run)) return;
      const waiting = ['waiting', 'busy', 'waiting-for-model'].includes(result?.status);
      state.nextAt = clock() + (waiting ? WORLD_OODA_TIMING.resourceMs : residentRecoveryDelay(random));
      emit(state.body, state, waiting ? 'waiting' : 'reflecting', { reason: result?.reason ?? '' });
    }).catch(error => {
      const waiting = classifyInferenceAvailability(error);
      state.nextAt = clock() + (waiting ? WORLD_OODA_TIMING.resourceMs : residentRecoveryDelay(random));
      if (states.get(body.key) === state && !ownerPaused(state.body)) emit(state.body, state,
        waiting ? 'waiting' : 'recovering', { reason: String(error?.message ?? error).slice(0, 240) });
    }).finally(() => {
      clearTimer(deadline);
      if (active === run) active = null;
      arm();
    });
  }
  function tick() {
    if (closed) return getStatus();
    try {
      const at = clock(); enumerate(at);
      if (active) { current(active); return getStatus(); }
      if (at < quietUntil) return getStatus();
      const candidates = [...states.values()].filter(state => !ownerPaused(state.body)
        && (recovering(state.body) || state.body.autonomous !== false) && state.body.available !== false && at >= state.nextAt);
      candidates.sort((a, b) => a.lastStarted - b.lastStarted || a.nextAt - b.nextAt || a.agentId.localeCompare(b.agentId));
      if (candidates[0]) start(candidates[0], at);
    } catch (error) {
      active?.controller.abort(error);
    } finally { arm(); }
    return getStatus();
  }
  function interrupt() {
    quietUntil = Math.max(quietUntil, clock() + 30000); active?.controller.abort(cancelled());
    return active?.done?.catch(() => {});
  }
  function getStatus() {
    return { closed, active: active?.key ?? null, residents: [...states].map(([key, state]) => ({ key,
      agentId: state.agentId, status: state.status, nextAt: state.nextAt })) };
  }
  function dispose() {
    if (disposal) return disposal;
    closed = true; clearTimer(timer); timer = undefined; active?.controller.abort(cancelled());
    disposal = Promise.resolve(active?.done).then(() => states.clear()); return disposal;
  }
  arm();
  return { tick, sync: tick, interrupt, dispose, getStatus };
}
