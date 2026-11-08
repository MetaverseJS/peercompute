import { chatIdentifier, chatText, normalizeChatInput, ROOM_CHAT_LIMITS } from '../chat/roomChatContracts.js';

export const WORLD_CHAT_LIMITS = Object.freeze({ residents: 16, contextMessages: 16, contextBytes: 8192,
  seenEntries: 1024, seenMs: 300000, cooldownMs: 5000 });
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
 * The host owns inference and publication. No private history is read here.
 * Opt-in revocation cancels work but retains the single slot until it settles. */
export function createWorldChatResponder({ getResidents, respond, publish, onStatus = () => {},
  now = () => performance.now(), cooldownMs = WORLD_CHAT_LIMITS.cooldownMs } = {}) {
  if (![getResidents, respond, publish, onStatus, now].every(value => typeof value === 'function')
      || !Number.isFinite(cooldownMs) || cooldownMs < 0 || cooldownMs > 60000) {
    throw new TypeError('World chat requires callbacks and a bounded cooldown');
  }
  const residents = new Map(), seen = new Map();
  let context = [], contextBytes = 0, active, timer, closed = false, disposal, order = 0;
  const notify = value => { try { Promise.resolve(onStatus(Object.freeze(value))).catch(() => {}); } catch { /* Observer only. */ } };
  const clearTimer = () => { clearTimeout(timer); timer = undefined; };
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
    if (closed || residents.get(run.key) !== run.entry) throw abortReason();
  }
  function schedule() {
    clearTimer();
    if (closed || active) return;
    reconcile();
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
    const run = { key, entry, body: { ...entry.body }, message: pendingMessage.message, controller: new AbortController() };
    active = run;
    run.done = Promise.resolve().then(async () => {
      stillOwned(run);
      // A manual operation can claim the host before this dispatch microtask.
      // Keep its latest request queued; availability is not opt-in revocation.
      if (entry.body.available === false) {
        entry.pending ??= pendingMessage; entry.lastStarted = previousStart; return;
      }
      notify({ key, status: 'responding', messageId: run.message.id });
      stillOwned(run);
      const answer = await respond(run.body, run.message, { signal: run.controller.signal, context: pendingMessage.context });
      stillOwned(run);
      // Output is validated, never silently truncated or retried after publication.
      const output = normalizeChatInput({ agentId: run.body.agentId, name: displayName(run.body.name), text: answer });
      notify({ key, status: 'publishing', messageId: run.message.id });
      stillOwned(run);
      await publish(output, { signal: run.controller.signal });
      stillOwned(run); notify({ key, status: 'idle', messageId: run.message.id });
    }).catch(error => {
      notify({ key, status: run.controller.signal.aborted ? 'cancelled' : 'error', messageId: run.message.id,
        ...(run.controller.signal.aborted ? {} : { error: String(error?.message ?? error).slice(0, 512) }) });
    }).finally(() => { if (active === run) active = null; schedule(); });
  }
  function sync() { if (!closed) { reconcile(); schedule(); } }
  function receive(input) {
    if (closed) return { accepted: false, queued: 0, reason: 'closed' };
    if (input?.agentId !== undefined) return { accepted: false, queued: 0, reason: 'resident-message' };
    let message;
    try {
      message = Object.freeze({ id: chatIdentifier(input?.id), peerId: chatIdentifier(input?.peerId),
        name: chatText(input?.name ?? 'Guest', ROOM_CHAT_LIMITS.nameBytes, 'Display name'),
        text: chatText(input?.text, ROOM_CHAT_LIMITS.textBytes, 'Message') });
    } catch { return { accepted: false, queued: 0, reason: 'invalid-message' }; }
    const clock = now(), key = `${message.peerId}:${message.id}`;
    for (const [id, at] of seen) if (clock - at >= WORLD_CHAT_LIMITS.seenMs) seen.delete(id);
    if (seen.has(key)) return { accepted: false, queued: 0, reason: 'duplicate' };
    if (seen.size >= WORLD_CHAT_LIMITS.seenEntries) return { accepted: false, queued: 0, reason: 'dedup-full' };
    seen.set(key, clock);
    const bytes = encoder.encode(JSON.stringify(message)).length;
    context.push({ message, bytes }); contextBytes += bytes;
    while (context.length > WORLD_CHAT_LIMITS.contextMessages || contextBytes > WORLD_CHAT_LIMITS.contextBytes) contextBytes -= context.shift().bytes;
    const publicContext = Object.freeze({ kind: 'public-room-chat', messages: Object.freeze(context.map(entry => entry.message)) });
    reconcile();
    for (const entry of residents.values()) entry.pending = { message, context: publicContext, order: order++ };
    const queued = residents.size;
    schedule(); return { accepted: true, queued };
  }
  function dispose() {
    if (disposal) return disposal;
    closed = true; clearTimer(); residents.clear(); seen.clear(); context = []; contextBytes = 0;
    active?.controller.abort(abortReason());
    disposal = Promise.resolve(active?.done).then(() => {}); return disposal;
  }
  return { receive, sync, dispose, getStatus: () => Object.freeze({ closed, active: active?.key ?? null,
    pending: [...residents.values()].filter(entry => entry.pending).length, residents: residents.size,
    seen: seen.size, contextMessages: context.length, contextBytes }) };
}
