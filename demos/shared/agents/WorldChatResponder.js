import { chatIdentifier, chatText, normalizeChatInput, validateSocialAuthor, ROOM_SOCIAL_LIMITS, ROOM_CHAT_LIMITS } from '../chat/roomChatContracts.js';
import { classifyInferenceAvailability } from '../../../peercompute/src/peercompute/inference/InferenceAvailability.js';

export const WORLD_CHAT_LIMITS = Object.freeze({ residents: 16, contextMessages: 16, contextBytes: 8192,
  seenEntries: 1024, seenMs: 300000, cooldownMs: 5000, discussionMs: 120000, turnsPerResident: 2 });
const encoder = new TextEncoder();
const socialEligible = body => body?.initiateConversations === true || body?.respondToWorldChat === true;
const eligible = body => body?.local === true && socialEligible(body)
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
export function createWorldChatResponder({ getResidents, respond, publish, onStatus = () => {}, onDelivered = () => {},
  now = () => performance.now(), wallNow = Date.now, cooldownMs = WORLD_CHAT_LIMITS.cooldownMs,
  discussionMs = WORLD_CHAT_LIMITS.discussionMs, retryMs = 1000 } = {}) {
  if (![getResidents, respond, publish, onStatus, onDelivered, now, wallNow].every(value => typeof value === 'function')
      || !Number.isFinite(cooldownMs) || cooldownMs < 0 || cooldownMs > 60000
      || !Number.isFinite(discussionMs) || discussionMs <= 0 || discussionMs > 300000
      || !Number.isFinite(retryMs) || retryMs < 10 || retryMs > 60000) {
    throw new TypeError('World chat requires callbacks, a bounded cooldown and a discussion deadline');
  }
  const residents = new Map(), seen = new Map(), socialRoots = new Map();
  let context = [], contextBytes = 0, active, timer, discussionTimer, discussion, closed = false, disposal, order = 0;
  const notify = value => { try { Promise.resolve(onStatus(Object.freeze(value))).catch(() => {}); } catch { /* Observer only. */ } };
  const clearTimer = () => { clearTimeout(timer); timer = undefined; };
  const publicContext = () => Object.freeze({ kind: 'public-room-chat', messages: Object.freeze(context.map(entry => entry.message)) });
  const isSelf = (body, message) => message.agentId === body.agentId
    && (!body.ownerPeerId || message.peerId === body.ownerPeerId);
  const participant = (body, social, root) => body.agentId === (root ? social.rootAgentId : social.targetAgentId)
    && body.ownerPeerId === (root ? social.rootPeerId : social.targetPeerId);
  function remaining(key, entry, pending) {
    const budget = discussion?.residents.get(key);
    if (discussion?.kind === 'social') {
      const social = pending?.message.social;
      if (!social || discussion.socialRoot.closed || !socialEligible(entry.body)
          || social.turn >= ROOM_SOCIAL_LIMITS.turns - 1 || now() >= discussion.expiresAt
          || !participant(entry.body, social, (social.turn + 1) % 2 === 0)) return false;
    } else if (entry.body.respondToWorldChat !== true || pending?.message.social) return false;
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
    // until it finishes, preserving the human's request through slow inference.
    // Explicit social threads use ephemeral inference and can stop immediately.
    if (discussion.kind === 'social' && active?.discussion === discussion) active.controller.abort(abortReason());
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
        residents.set(body.key, { body: { ...body }, pending: null, lastStarted: -Infinity, nextAt: 0 });
      } else previous.body = { ...body };
    }
    for (const key of residents.keys()) if (!retained.has(key)) residents.delete(key);
    if (active && residents.get(active.key) !== active.entry) active.controller.abort(abortReason());
    if (active && (active.discussion.kind === 'social' ? !socialEligible(active.entry.body)
      : active.entry.body.respondToWorldChat !== true)) active.controller.abort(abortReason());
  }
  function stillOwned(run) {
    if (closed) throw abortReason();
    reconcile();
    run.controller.signal.throwIfAborted();
    if (closed || residents.get(run.key) !== run.entry || run.discussion !== discussion) throw abortReason();
    if (run.discussion.kind === 'social' && run.discussion.socialRoot.closed) throw abortReason();
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
    if (!pending.length) {
      if ([...residents.values()].some(entry => entry.pending)) {
        timer = setTimeout(schedule, retryMs); timer.unref?.();
      }
      return;
    }
    const ready = pending.filter(([, entry]) => clock >= Math.max(entry.nextAt, entry.lastStarted + cooldownMs))
      .sort((a, b) => a[1].lastStarted - b[1].lastStarted || a[1].pending.order - b[1].pending.order);
    if (!ready.length) {
      const wait = Math.max(1, Math.min(...pending.map(([, entry]) => Math.max(entry.nextAt, entry.lastStarted + cooldownMs) - clock)));
      timer = setTimeout(schedule, wait); timer.unref?.(); return;
    }
    const [key, entry] = ready[0], pendingMessage = entry.pending, previousStart = entry.lastStarted;
    entry.pending = null; entry.lastStarted = clock;
    const run = { key, entry, body: { ...entry.body }, message: pendingMessage.message,
      discussion: pendingMessage.discussion, controller: new AbortController() };
    function defer(reason) {
      stillOwned(run);
      if (run.publishing) return false;
      // Waiting did not produce speech or consume a social turn. Preserve the
      // same current message, but never replace a newer human message.
      if (run.charged) { run.discussion.residents.get(key).turns--; run.charged = false; }
      entry.pending ??= pendingMessage; entry.lastStarted = previousStart;
      entry.nextAt = now() + retryMs;
      notify({ key, status: 'waiting', messageId: run.message.id, reason });
      return true;
    }
    active = run;
    run.done = Promise.resolve().then(async () => {
      stillOwned(run);
      // A manual operation can claim the host before this dispatch microtask.
      // Keep its latest request queued; availability is not opt-in revocation.
      if (entry.body.available === false) {
        entry.pending ??= pendingMessage; entry.lastStarted = previousStart; return;
      }
      const budget = run.discussion.residents.get(key);
      budget.turns++; run.charged = true;
      notify({ key, status: 'responding', messageId: run.message.id });
      stillOwned(run);
      const isCurrent = () => { try { stillOwned(run); return true; } catch { return false; } };
      const answer = await respond(run.body, run.message, { signal: run.controller.signal, context: publicContext(), isCurrent });
      stillOwned(run);
      if (answer?.status === 'waiting') { defer(answer.reason ?? 'Waiting for inference'); return; }
      if (typeof answer === 'string' && !answer.trim()) {
        if (run.discussion.kind === 'social') run.discussion.socialRoot.closed = true;
        notify({ key, status: 'idle', messageId: run.message.id, reason: 'quiet' }); return;
      }
      // Output is validated, never silently truncated or retried after publication.
      const output = normalizeChatInput({ agentId: run.body.agentId, name: displayName(run.body.name), text: answer,
        ...(run.message.social ? { social: { ...run.message.social, turn: run.message.social.turn + 1 } } : {}) });
      const normalized = output.text.trim().replace(/\s+/gu, ' ');
      if (run.message.agentId !== undefined && normalized === budget.lastOutput) {
        notify({ key, status: 'idle', messageId: run.message.id, reason: 'repeated-followup' }); return;
      }
      notify({ key, status: 'publishing', messageId: run.message.id });
      stillOwned(run);
      run.publishing = true;
      const result = await publish(output, { signal: run.controller.signal });
      // Delivery is an observed fact even if a human supersedes the thread while
      // its already-committed transport acknowledgment is returning.
      try { await onDelivered({ body: run.body, incoming: run.message, output, result }); } catch { /* Observer only. */ }
      budget.lastOutput = normalized;
      stillOwned(run); notify({ key, status: 'idle', messageId: run.message.id });
    }).catch(error => {
      if (classifyInferenceAvailability(error) && !run.publishing && !run.controller.signal.aborted) {
        try { if (defer(error.message)) return; } catch { /* A newer message or owner choice wins. */ }
      }
      const cancelled = run.controller.signal.aborted || error?.name === 'AbortError';
      notify({ key, status: cancelled ? 'cancelled' : 'error', messageId: run.message.id,
        ...(cancelled ? {} : { error: String(error?.message ?? error).slice(0, 512) }) });
    }).finally(() => { if (active === run) active = null; schedule(); });
  }
  function sync() { if (!closed) { reconcile(); schedule(); } }
  function acceptSocial(message, clock) {
    const social = message.social, key = `${social.rootPeerId}:${social.rootId}`;
    const identity = JSON.stringify({ ...social, turn: 0 });
    for (const [id, root] of socialRoots) if (clock - root.at >= WORLD_CHAT_LIMITS.seenMs) socialRoots.delete(id);
    let root = socialRoots.get(key);
    if (root) {
      if (root.identity !== identity || root.closed || clock >= root.expiresAt || social.turn !== root.lastTurn + 1) return false;
      root.lastTurn = social.turn;
      return discussion?.socialRoot === root;
    }
    if (social.turn !== 0 || socialRoots.size >= ROOM_SOCIAL_LIMITS.roots) return false;
    const pair = [`${social.rootPeerId}:${social.rootAgentId}`, `${social.targetPeerId}:${social.targetAgentId}`].sort().join('|');
    root = { key, pair, identity, at: clock, expiresAt: clock + Math.min(discussionMs, social.expiresAt - wallNow()), lastTurn: 0, closed: false };
    socialRoots.set(key, root);
    const participants = new Map([...residents].filter(([, entry]) => socialEligible(entry.body)
      && (participant(entry.body, social, true) || participant(entry.body, social, false)))
      .map(([key, entry]) => [key, { agentId: entry.body.agentId, turns: participant(entry.body, social, true) ? 1 : 0, lastOutput: null }]));
    const humanPending = Boolean(active && active.discussion.kind !== 'social')
      || [...residents.values()].some(entry => entry.pending && entry.pending.message.agentId === undefined);
    const socialPending = discussion?.kind === 'social' && !discussion.socialRoot.closed
      && discussion.socialRoot.lastTurn < ROOM_SOCIAL_LIMITS.turns - 1 && clock < discussion.expiresAt;
    if (!social.targetAgentId || !participants.size || humanPending) { root.closed = true; return false; }
    // A delayed competing greeting cannot reopen a quiet/completed encounter.
    if (discussion?.kind === 'social' && discussion.socialRoot.pair === pair
        && !socialPending && clock < discussion.expiresAt) { root.closed = true; return false; }
    if (socialPending && discussion.socialRoot.pair === pair) {
      // Crossed greetings must converge regardless of which local echo arrived
      // first. Compare code units, never locale-dependent collation.
      if (key > discussion.socialRoot.key) {
        for (const [id, entry] of residents) if (participant(entry.body, social, true)) {
          const budget = discussion.residents.get(id);
          if (budget) budget.turns = Math.min(WORLD_CHAT_LIMITS.turnsPerResident, budget.turns + 1);
        }
        root.closed = true; return false;
      }
      for (const [id, budget] of participants) {
        const previous = discussion.residents.get(id);
        if (previous?.agentId === budget.agentId) {
          budget.turns = Math.min(WORLD_CHAT_LIMITS.turnsPerResident, budget.turns + previous.turns);
        }
      }
      root.expiresAt = Math.min(root.expiresAt, discussion.expiresAt);
      discussion.socialRoot.closed = true;
      if (active?.discussion === discussion) active.controller.abort(abortReason());
    } else if (active || socialPending) { root.closed = true; return false; }
    for (const entry of residents.values()) entry.pending = null;
    discussion = { kind: 'social', socialRoot: root, expiresAt: root.expiresAt, residents: participants };
    expireDiscussion(); return true;
  }
  function receive(input) {
    if (closed) return { accepted: false, queued: 0, reason: 'closed' };
    let message;
    try {
      message = Object.freeze({ id: chatIdentifier(input?.id), peerId: chatIdentifier(input?.peerId),
        name: chatText(input?.name ?? 'Guest', ROOM_CHAT_LIMITS.nameBytes, 'Display name'),
        text: chatText(input?.text, ROOM_CHAT_LIMITS.textBytes, 'Message'),
        ...normalizeChatInput({ name: input?.name ?? 'Guest', text: input?.text,
          ...(input?.agentId === undefined ? {} : { agentId: input.agentId }),
          ...(input?.social === undefined ? {} : { social: input.social }) }) });
      validateSocialAuthor(message, message.peerId, wallNow());
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
    if (message.social && !acceptSocial(message, clock)) return { accepted: true, queued: 0 };
    if (message.agentId === undefined) {
      if (discussion?.kind === 'social') discussion.socialRoot.closed = true;
      if (active?.discussion.kind === 'social') active.controller.abort(abortReason());
      // Freeze the participants and their spent budgets for this human turn.
      // Removing/re-enabling or joining a resident cannot buy extra replies.
      discussion = { kind: 'human', expiresAt: clock + discussionMs,
        residents: new Map([...residents].filter(([, entry]) => entry.body.respondToWorldChat === true)
          .map(([key, entry]) => [key, { agentId: entry.body.agentId, turns: 0, lastOutput: null }])) };
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
    residents.clear(); seen.clear(); socialRoots.clear(); context = []; contextBytes = 0;
    active?.controller.abort(abortReason());
    disposal = Promise.resolve(active?.done).then(() => {}); return disposal;
  }
  return { receive, sync, dispose, getStatus: () => Object.freeze({ closed, active: active?.key ?? null,
    pending: [...residents.values()].filter(entry => entry.pending).length, residents: residents.size,
    seen: seen.size, contextMessages: context.length, contextBytes }) };
}
