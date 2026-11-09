export const WORLD_SOCIAL_LIMITS = Object.freeze({
  residents: 16, encounters: 128, targetsPerResident: 8, observationBytes: 24576,
  tickMs: 1000, dwellMs: 8000, radius: 60, cooldownMs: 90000,
  targetCooldownMs: 600000, modelBackoffMs: 30000, humanQuietMs: 30000,
  decisionMs: 60000, encounterRetentionMs: 1800000
});

const encoder = new TextEncoder();
const identifier = value => typeof value === 'string' && value.length > 0 && value.length <= 320;
const eligible = body => body?.local === true && body.shared === true && body.initiateConversations === true
  && body.paused !== true && body.status !== 'paused' && !body.recoveryRequired && !body.recovery
  && identifier(body.agentId) && identifier(body.ownerPeerId);
const identity = body => JSON.stringify([body.ownerPeerId, body.agentId]);
// Availability/activity changes during this scheduler's own request are expected.
// Actual edits and authority changes invalidate a decision made from older input.
const revision = body => JSON.stringify([body.revision, body.identityRevision, body.name, body.instructions,
  body.goals, body.localOnly, body.movement, body.respondToWorldChat]);
const aborted = reason => new DOMException(`Social initiative cancelled: ${reason}`, 'AbortError');

/** Bounded opportunities for a model to choose social behavior; no scripted speech or motion.
 * getResidents and observe are synchronous scene reads. tick() polls/dispatches but
 * does not wait for a slow decide(). The single slot survives cancellation until
 * decide actually settles; dispose() waits for that cleanup acknowledgement. */
export function createWorldSocialInitiative({ getResidents, observe, decide, onStatus = () => {},
  now = () => performance.now(), setTimer = setTimeout, clearTimer = clearTimeout,
  tickMs = WORLD_SOCIAL_LIMITS.tickMs, dwellMs = WORLD_SOCIAL_LIMITS.dwellMs,
  radius = WORLD_SOCIAL_LIMITS.radius, cooldownMs = WORLD_SOCIAL_LIMITS.cooldownMs,
  targetCooldownMs = WORLD_SOCIAL_LIMITS.targetCooldownMs, modelBackoffMs = WORLD_SOCIAL_LIMITS.modelBackoffMs,
  humanQuietMs = WORLD_SOCIAL_LIMITS.humanQuietMs, decisionMs = WORLD_SOCIAL_LIMITS.decisionMs } = {}) {
  if (![getResidents, observe, decide, onStatus, now, setTimer, clearTimer].every(value => typeof value === 'function')) {
    throw new TypeError('Social initiative requires scene, decision, clock and timer callbacks');
  }
  for (const [name, value, minimum, maximum] of [
    ['tickMs', tickMs, 100, 60000], ['dwellMs', dwellMs, 0, 60000], ['radius', radius, 1, 250],
    ['cooldownMs', cooldownMs, 0, 3600000], ['targetCooldownMs', targetCooldownMs, 0, 3600000],
    ['modelBackoffMs', modelBackoffMs, 1000, 300000], ['humanQuietMs', humanQuietMs, 0, 300000],
    ['decisionMs', decisionMs, 1000, 120000]
  ]) if (!Number.isFinite(value) || value < minimum || value > maximum) throw new TypeError(`Invalid social ${name}`);

  const residents = new Map(), encounters = new Map(), statuses = new Map();
  let active, timer, closed = false, disposal, lastClock, quietUntil = 0, epoch = 0;
  const notify = event => {
    const key = event.key ?? 'scheduler', signature = JSON.stringify(event);
    if (statuses.get(key) === signature) return;
    statuses.set(key, signature);
    try { Promise.resolve(onStatus(Object.freeze(event))).catch(() => {}); } catch { /* Presentation only. */ }
  };
  function cancelActive(reason) {
    if (active && !active.controller.signal.aborted) active.controller.abort(aborted(reason));
  }
  function clock() {
    const value = now();
    if (!Number.isFinite(value) || value < 0) throw new TypeError('Social clock must be finite and nonnegative');
    if (lastClock !== undefined && value < lastClock) {
      epoch++; cancelActive('clock changed'); quietUntil = value + humanQuietMs;
      // Keep spent budgets for their remaining durations across a clock reset.
      for (const entry of residents.values()) entry.nextAt = value + Math.max(0, entry.nextAt - lastClock);
      for (const entry of encounters.values()) {
        entry.nextAt = value + Math.max(0, entry.nextAt - lastClock);
        entry.residentNextAt = value + Math.max(0, entry.residentNextAt - lastClock);
        entry.lastSeen = value; entry.since = null;
      }
    }
    lastClock = value; return value;
  }
  function enumerate() {
    const bodies = getResidents();
    if (!Array.isArray(bodies)) {
      Promise.resolve(bodies).catch(() => {});
      throw new TypeError('Social residents must be a synchronous array');
    }
    const retained = new Set();
    for (const body of bodies) {
      if (!eligible(body) || retained.size >= WORLD_SOCIAL_LIMITS.residents) continue;
      const id = identity(body); if (retained.has(id)) continue;
      retained.add(id);
      const previous = residents.get(id);
      // A temporary pause/opt-out cannot reset a spent resident budget.
      const history = previous ? [] : [...encounters.values()].filter(entry => entry.residentId === id);
      residents.set(id, { body, nextAt: previous?.nextAt ?? Math.max(0, ...history.map(entry => entry.residentNextAt)),
        lastStarted: previous?.lastStarted ?? Math.max(-Infinity, ...history.map(entry => entry.lastStarted)) });
    }
    for (const id of residents.keys()) if (!retained.has(id)) residents.delete(id);
    for (const key of statuses.keys()) if (key !== 'scheduler'
      && ![...residents.values()].some(entry => (entry.body.key ?? identity(entry.body)) === key)) statuses.delete(key);
  }
  function observation(body, signal) {
    const raw = observe(body, { signal });
    if (raw?.then) { Promise.resolve(raw).catch(() => {}); throw new TypeError('Social observations must be synchronous'); }
    if (raw?.self?.id !== `resident:${body.ownerPeerId}:${body.agentId}` || !Array.isArray(raw.participants)
      || encoder.encode(JSON.stringify(raw)).length > WORLD_SOCIAL_LIMITS.observationBytes) {
      throw new TypeError('Invalid or oversized social observations');
    }
    const copy = structuredClone(raw);
    const seen = new Set();
    copy.participants = copy.participants.slice(0, 24).filter(target => {
      if (!identifier(target?.id) || target.id === copy.self.id || seen.has(target.id)
        || !Number.isFinite(target.distance) || target.distance < 0 || target.distance >= radius) return false;
      const expected = target.kind === 'human' && identifier(target.peerId) ? `human:${target.peerId}`
        : target.kind === 'resident' && identifier(target.ownerPeerId) && identifier(target.agentId)
          ? `resident:${target.ownerPeerId}:${target.agentId}` : null;
      if (target.id !== expected) return false;
      seen.add(target.id); return true;
    });
    return copy;
  }
  function current(run) {
    if (closed || run.epoch !== epoch || run.controller.signal.aborted) return false;
    try {
      const at = clock(); enumerate();
      const entry = residents.get(run.id);
      if (!entry || revision(entry.body) !== run.revision || at >= run.expiresAt || at < quietUntil) {
        cancelActive(at >= run.expiresAt ? 'decision expired' : 'resident changed'); return false;
      }
      if (!observation(entry.body, run.controller.signal).participants.some(target => target.id === run.target.id)) {
        cancelActive('target left'); return false;
      }
      return !run.controller.signal.aborted;
    } catch { cancelActive('scene unavailable'); return false; }
  }
  function arm() {
    if (closed || timer !== undefined) return;
    timer = setTimer(() => { timer = undefined; void tick(); arm(); }, tickMs);
    timer?.unref?.();
  }
  function start(candidate, at) {
    const { id, entry, encounter, target, sensed } = candidate;
    const previousEncounterNext = encounter.nextAt;
    entry.lastStarted = at; entry.nextAt = at + cooldownMs;
    encounter.lastStarted = at; encounter.nextAt = at + targetCooldownMs; encounter.residentNextAt = entry.nextAt;
    const run = { id, key: entry.body.key ?? id, resident: { ...entry.body }, revision: revision(entry.body),
      target, observation: sensed, encounter, previousEncounterNext, epoch, expiresAt: at + decisionMs,
      controller: new AbortController() };
    active = run;
    run.done = Promise.resolve().then(async () => {
      if (!current(run)) return;
      // A manual operation may reserve the host between selection and dispatch.
      if (residents.get(id)?.body.available === false) { run.controller.abort(aborted('host busy')); return; }
      notify({ key: run.key, agentId: run.resident.agentId, status: 'deciding', targetId: target.id });
      if (!current(run)) return;
      const result = await decide({ resident: run.resident, target: structuredClone(target), observation: run.observation,
        signal: run.controller.signal, isCurrent: () => current(run) });
      if (!current(run)) return;
      const status = result?.status === 'waiting-for-model' ? 'waiting-for-model'
        : result?.status === 'quiet' ? 'quiet' : result?.status === 'spoken' ? 'spoken' : 'idle';
      if (status === 'waiting-for-model') {
        const next = clock() + modelBackoffMs;
        const retained = residents.get(id); if (retained) retained.nextAt = next;
        encounter.residentNextAt = next;
        encounter.nextAt = Math.max(previousEncounterNext, next);
      }
      notify({ key: run.key, agentId: run.resident.agentId, status, targetId: target.id });
    }).catch(error => {
      const cancelled = run.controller.signal.aborted || error?.name === 'AbortError';
      notify({ key: run.key, agentId: run.resident.agentId, status: cancelled ? 'cancelled' : 'error',
        targetId: target.id, ...(cancelled ? {} : { error: String(error?.message ?? error).slice(0, 256) }) });
    }).finally(() => {
      if (run.controller.signal.aborted) notify({ key: run.key, agentId: run.resident.agentId, status: 'cancelled', targetId: target.id });
      if (active === run) active = null;
    });
  }
  async function tick() {
    if (closed) return getStatus();
    try {
      const at = clock(); enumerate();
      if (active) { current(active); return getStatus(); }
      for (const [key, entry] of encounters) if (at - entry.lastSeen > Math.max(
        WORLD_SOCIAL_LIMITS.encounterRetentionMs, targetCooldownMs)) encounters.delete(key);
      const visible = new Set(), candidates = [];
      for (const [id, entry] of residents) {
        if (entry.body.available === false || ['thinking', 'speaking'].includes(entry.body.status)) continue;
        let sensed;
        try { sensed = observation(entry.body); }
        catch (error) { notify({ key: entry.body.key ?? id, status: 'unavailable', error: String(error.message).slice(0, 256) }); continue; }
        const targets = sensed.participants.slice().sort((a, b) => a.distance - b.distance || a.id.localeCompare(b.id))
          .slice(0, WORLD_SOCIAL_LIMITS.targetsPerResident);
        for (const target of targets) {
          const key = JSON.stringify([id, target.id]); visible.add(key);
          let encounter = encounters.get(key);
          if (!encounter) {
            if (encounters.size >= WORLD_SOCIAL_LIMITS.encounters) continue;
            encounter = { residentId: id, residentNextAt: 0, since: at, lastSeen: at, lastStarted: -Infinity, nextAt: 0 };
            encounters.set(key, encounter);
          }
          // A suspended tab or occupied slot is not evidence of continuous proximity.
          if (at - encounter.lastSeen > Math.max(tickMs * 2, 2000)) encounter.since = null;
          encounter.since ??= at; encounter.lastSeen = at;
          if (at >= quietUntil && at >= entry.nextAt && at >= encounter.nextAt && at - encounter.since >= dwellMs) {
            candidates.push({ id, entry, encounter, target, sensed });
          }
        }
      }
      for (const [key, encounter] of encounters) if (!visible.has(key)) encounter.since = null;
      candidates.sort((a, b) => a.entry.lastStarted - b.entry.lastStarted
        || a.encounter.lastStarted - b.encounter.lastStarted || a.target.distance - b.target.distance
        || a.id.localeCompare(b.id) || a.target.id.localeCompare(b.target.id));
      if (candidates.length) start(candidates[0], at);
    } catch (error) {
      cancelActive('scene unavailable');
      notify({ status: 'unavailable', error: String(error?.message ?? error).slice(0, 256) });
    } finally { arm(); }
    return getStatus();
  }
  function sync() {
    if (closed) return;
    if (active) current(active);
    arm();
  }
  function interrupt(reason = 'human') {
    if (closed) return;
    const at = clock(); epoch++; quietUntil = at + humanQuietMs;
    cancelActive(String(reason).slice(0, 80));
    for (const entry of encounters.values()) entry.since = null;
    arm();
  }
  function getStatus() {
    return { closed, active: active?.key ?? null, targetId: active?.target.id ?? null,
      residents: residents.size, encounters: encounters.size, quietUntil };
  }
  function dispose() {
    if (disposal) return disposal;
    closed = true; epoch++; clearTimer(timer); timer = undefined; cancelActive('scene closed');
    disposal = Promise.resolve(active?.done).then(() => { residents.clear(); encounters.clear(); statuses.clear(); });
    return disposal;
  }
  arm();
  return { sync, tick, interrupt, dispose, getStatus };
}
