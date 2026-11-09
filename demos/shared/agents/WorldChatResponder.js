import { chatIdentifier, chatText, normalizeChatInput, ROOM_CHAT_LIMITS } from '../chat/roomChatContracts.js';

export const WORLD_CHAT_LIMITS = Object.freeze({ residents: 16, contextMessages: 16, contextBytes: 8192,
  seenEntries: 1024, seenMs: 300000, cooldownMs: 5000, discussionMs: 120000, turnsPerResident: 2 });
const encoder = new TextEncoder();
const eligible = body => body?.local === true && body.respondToWorldChat === true
  && body.status !== 'paused' && !body.recoveryRequired;
const abortReason = () => new DOMException('World-chat resident is no longer active', 'AbortError');
function displayName(value) {
  let result = '';
  for (const character of String(value ?? 'Resident').trim()) {
    if (encoder.encode(result + character).length > ROOM_CHAT_LIMITS.nameBytes) break;
    result += character;
  }
  return result || 'Resident';
}

/** Presentation-independent, bounded replies to authenticated public room messages.
 * The host verifies resident authors against its authenticated owner/body directory,
 * and owns inference and publication. No private history is read here.
 * Opt-in revocation cancels work but retains the single slot until it settles. */
export function createWorldChatResponder({ getResidents, respond, publish, onStatus = () => {},
  now = () => performance.now(), cooldownMs = WORLD_CHAT_LIMITS.cooldownMs,
  discussionMs = WORLD_CHAT_LIMITS.discussionMs } = {}) {
  if (![getResidents, respond, publish, onStatus, now].every(value => typeof value === 'function')
      || !Number.isFinite(cooldownMs) || cooldownMs < 0 || cooldownMs > 60000
      || !Number.isFinite(discussionMs) || discussionMs <= 0 || discussionMs > 300000) {
    throw new TypeError('World chat requires callbacks, a bounded cooldown and a discussion deadline');
  }
  const residents = new Map(), seen = new Map();
  let context = [], contextBytes = 0, active, timer, discussionTimer, discussion, closed = false, disposal, order = 0;
  const notify = value => { try { Promise.resolve(onStatus(Object.freeze(value))).catch(() => {}); } catch { /* Observer only. */ } };
  const clearTimer = () => { clearTimeout(timer); timer = undefined; };
  const publicContext = () => Object.freeze({ kind: 'public-room-chat', messages: Object.freeze(context.map(entry => entry.message)) });
  const isSelf = (body, message) => message.agentId === body.agentId
    && (!body.ownerPeerId || message.peerId === body.ownerPeerId);
  function remaining(key, entry, pending) {
    const budget = discussion?.residents.get(key);
    return pending?.discussion === discussion && budget?.agentId === entry.body.agentId
      && budget.turns < WORLD_CHAT_LIMITS.turnsPerResident
      && (pending.message.agentId === undefined || now() < discussion.expiresAt);
  }
  function expireDiscussion() {
    clearTimeout(discussionTimer); discussionTimer = undefined;
    if (closed || !discussion) return;
    const wait = discussion.expiresAt - now();
    if (wait > 0) {
      discussionTimer = setTimeout(expireDiscussion, wait); discussionTimer.unref?.(); return;
    }
    // A slow initial answer still belongs to its human. The deadline applies
    // only to autonomous follow-ups. Already-dispatched inference owns the slot
    // until it finishes; aborting it would persistently pause AgentRuntime.
    for (const entry of residents.values()) if (entry.pending?.message.agentId !== undefined) entry.pending = null;
    schedule();
  }
  function reconcile() {
    if (closed) return;
    let entries;
    try {
      entries = getResidents();
      if (!Array.isArray(entries)) {
        Promise.resolve(entries).catch(() => {});
        throw new TypeError('Residents must be a synchronous array');
      }
    } catch (error) {
      for (const entry of residents.values()) entry.pending = null;
      residents.clear(); active?.controller.abort(abortReason());
      notify({ status: 'error', error: String(error?.message ?? error).slice(0, 512) }); return;
    }
    const retained = new Set();
    for (const body of entries) {
      if (!eligible(body) || retained.size >= WORLD_CHAT_LIMITS.residents || typeof body.key !== 'string'
          || !body.key || body.key.length > 300 || retained.has(body.key)) continue;
      try { chatIdentifier(body.agentId); } catch { continue; }
      retained.add(body.key);
      const previous = residents.get(body.key);
      if (!previous || previous.body.agentId !== body.agentId) {
        residents.set(body.key, { body: { ...body }, pending: null, lastStarted: -Infinity });
      } else previous.body = { ...body };
    }
    for (const key of residents.keys()) if (!retained.has(key)) residents.delete(key);
    if (active && residents.get(active.key) !== active.entry) active.controller.abort(abortReason());
  }
  function stillOwned(run) {
    if (closed) throw abortReason();
    reconcile();
    run.controller.signal.throwIfAborted();
    if (closed || residents.get(run.key) !== run.entry || run.discussion !== discussion) throw abortReason();
    if (run.message.agentId !== undefined && now() >= run.discussion.expiresAt) {
      throw new DOMException('World-chat discussion expired', 'AbortError');
    }
  }
  function schedule() {
    clearTimer();
    if (closed || active) return;
    reconcile();
    for (const [key, entry] of residents) if (entry.pending && !remaining(key, entry, entry.pending)) entry.pending = null;
    const clock = now(), pending = [...residents.entries()].filter(([, entry]) => entry.pending && entry.body.available !== false);
    if (!pending.length) return;
    const ready = pending.filter(([, entry]) => clock >= entry.lastStarted + cooldownMs)
      .sort((a, b) => a[1].lastStarted - b[1].lastStarted || a[1].pending.order - b[1].pending.order);
    if (!ready.length) {
      const wait = Math.max(1, Math.min(...pending.map(([, entry]) => entry.lastStarted + cooldownMs - clock)));
      timer = setTimeout(schedule, wait); timer.unref?.(); return;
    }
    const [key, entry] = ready[0], pendingMessage = entry.pending, previousStart = entry.lastStarted;
    entry.pending = null; entry.lastStarted = clock;
    const run = { key, entry, body: { ...entry.body }, message: pendingMessage.message,
      discussion: pendingMessage.discussion, controller: new AbortController() };
    active = run;
    run.done = Promise.resolve().then(async () => {
      stillOwned(run);
      // A manual operation can claim the host before this dispatch microtask.
      // Keep its latest request queued; availability is not opt-in revocation.
      if (entry.body.available === false) {
        entry.pending ??= pendingMessage; entry.lastStarted = previousStart; return;
      }
      const budget = run.discussion.residents.get(key);
      budget.turns++;
      notify({ key, status: 'responding', messageId: run.message.id });
      stillOwned(run);
      const answer = await respond(run.body, run.message, { signal: run.controller.signal, context: publicContext() });
      stillOwned(run);
      // Output is validated, never silently truncated or retried after publication.
      const output = normalizeChatInput({ agentId: run.body.agentId, name: displayName(run.body.name), text: answer });
      const normalized = output.text.trim().replace(/\s+/gu, ' ');
      if (run.message.agentId !== undefined && normalized === budget.lastOutput) {
        notify({ key, status: 'idle', messageId: run.message.id, reason: 'repeated-followup' }); return;
      }
      notify({ key, status: 'publishing', messageId: run.message.id });
      stillOwned(run);
      await publish(output, { signal: run.controller.signal });
      budget.lastOutput = normalized;
      stillOwned(run); notify({ key, status: 'idle', messageId: run.message.id });
    }).catch(error => {
      const cancelled = run.controller.signal.aborted || error?.name === 'AbortError';
      notify({ key, status: cancelled ? 'cancelled' : 'error', messageId: run.message.id,
        ...(cancelled ? {} : { error: String(error?.message ?? error).slice(0, 512) }) });
    }).finally(() => { if (active === run) active = null; schedule(); });
  }
  function sync() { if (!closed) { reconcile(); schedule(); } }
  function receive(input) {
    if (closed) return { accepted: false, queued: 0, reason: 'closed' };
    let message;
    try {
      message = Object.freeze({ id: chatIdentifier(input?.id), peerId: chatIdentifier(input?.peerId),
        name: chatText(input?.name ?? 'Guest', ROOM_CHAT_LIMITS.nameBytes, 'Display name'),
        text: chatText(input?.text, ROOM_CHAT_LIMITS.textBytes, 'Message'),
        ...(input?.agentId === undefined ? {} : { agentId: chatIdentifier(input.agentId) }) });
    } catch { return { accepted: false, queued: 0, reason: 'invalid-message' }; }
    const clock = now(), key = `${message.peerId}:${message.id}`;
    for (const [id, at] of seen) if (clock - at >= WORLD_CHAT_LIMITS.seenMs) seen.delete(id);
    if (seen.has(key)) return { accepted: false, queued: 0, reason: 'duplicate' };
    if (seen.size >= WORLD_CHAT_LIMITS.seenEntries) return { accepted: false, queued: 0, reason: 'dedup-full' };
    seen.set(key, clock);
    const bytes = encoder.encode(JSON.stringify(message)).length;
    context.push({ message, bytes }); contextBytes += bytes;
    while (context.length > WORLD_CHAT_LIMITS.contextMessages || contextBytes > WORLD_CHAT_LIMITS.contextBytes) contextBytes -= context.shift().bytes;
    reconcile();
    if (message.agentId === undefined) {
      // Freeze the participants and their spent budgets for this human turn.
      // Removing/re-enabling or joining a resident cannot buy extra replies.
      discussion = { expiresAt: clock + discussionMs,
        residents: new Map([...residents].map(([key, entry]) => [key, { agentId: entry.body.agentId, turns: 0, lastOutput: null }])) };
      // Keep any dispatched inference alive until cleanup. stillOwned suppresses
      // its superseded output without turning a healthy persisted agent paused.
      expireDiscussion();
    }
    let queued = 0;
    for (const [key, entry] of residents) {
      const pending = { message, discussion, order: order++ };
      if (message.agentId !== undefined && (isSelf(entry.body, message)
          || (entry.pending && entry.pending.message.agentId === undefined))) continue;
      if (!remaining(key, entry, pending)) continue;
      entry.pending = pending; queued++;
    }
    schedule(); return { accepted: true, queued };
  }
  function dispose() {
    if (disposal) return disposal;
    closed = true; clearTimer(); clearTimeout(discussionTimer); discussion = null;
    residents.clear(); seen.clear(); context = []; contextBytes = 0;
    active?.controller.abort(abortReason());
    disposal = Promise.resolve(active?.done).then(() => {}); return disposal;
  }
  return { receive, sync, dispose, getStatus: () => Object.freeze({ closed, active: active?.key ?? null,
    pending: [...residents.values()].filter(entry => entry.pending).length, residents: residents.size,
    seen: seen.size, contextMessages: context.length, contextBytes }) };
}
