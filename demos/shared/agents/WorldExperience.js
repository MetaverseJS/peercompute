import { parseWorldReply, validateWorldIntent, worldIntentPrompt } from './WorldIntent.js';

const encoder = new TextEncoder();
const size = value => encoder.encode(JSON.stringify(value)).length;
function excerpt(value, maximum) {
  let result = '';
  for (const ch of String(value ?? '')) { if (encoder.encode(result + ch).length > maximum) break; result += ch; }
  return result;
}

/** Reusable M0 bridge: bounded sensing → proposed intent → physical receipt → scoped memory.
 * Scene adapters own authority/physics; this component owns neither models nor the database. */
export function createWorldExperience({ worldId, adapter, memory, getBody, onStatus = () => {}, now = Date.now } = {}) {
  if (!adapter?.observe || !adapter?.setIntent || !adapter?.subscribeOutcomes) throw new Error('An embodied world adapter is required');
  const lifetime = new AbortController(), intentions = new Map(), writes = new Set();
  let closed = false;
  const report = message => { try { onStatus(message); } catch { /* Presentation is observational. */ } };
  const signalFor = signal => AbortSignal.any([lifetime.signal, ...(signal ? [signal] : [])]);
  function observe(key, requesterPeerId) {
    const raw = adapter.observe(key, { requesterPeerId });
    if (!raw?.self || !Array.isArray(raw.participants)) throw new Error('This body cannot observe its world');
    // Adapter data is already bounded; retain a copy so asynchronous inference
    // cannot silently change the evidence behind a proposed target.
    if (size(raw) > 24576) throw new Error('Resident senses exceed the adapter budget');
    const result = structuredClone(raw); result.observedAt = now();
    result.participants = result.participants.slice(0, 24);
    result.obstacles = (result.obstacles ?? []).slice(0, 12);
    while (size(result) > 4608 && result.obstacles.length) result.obstacles.pop();
    while (size(result) > 4608 && result.participants.length) {
      const index = result.participants.findLastIndex(item => item.id !== result.requesterId);
      if (index < 0) break;
      result.participants.splice(index, 1);
    }
    if (!result.participants.some(item => item.id === result.requesterId)) delete result.requesterId;
    if (size(result) > 4608) throw new Error('Resident self observation exceeds its budget');
    return result;
  }
  async function save(record, signal) {
    if (!memory || closed) return;
    try { await memory.append(record, { signal: signalFor(signal) }); }
    catch (error) { if (!closed && error.name !== 'AbortError') report(`Resident memory: ${error.message}`); }
  }
  async function prepare({ key, agentId, conversationId, audience, requesterPeerId, who, prompt, statement = prompt,
    eventId, scene = {}, publicConversationId, signal }) {
    signal = signalFor(signal); signal.throwIfAborted();
    const senses = observe(key, requesterPeerId), scope = { worldId, agentId, audience, conversationId };
    if (who?.agentId) {
      const id = `resident:${who.peerId}:${who.agentId}`;
      if (senses.participants.some(item => item.id === id)) senses.requesterId = id;
      else delete senses.requesterId;
    }
    const participant = senses.participants.find(item => item.id === senses.requesterId);
    const speaker = who ?? { peerId: requesterPeerId || getBody(key)?.ownerPeerId || 'owner', name: participant?.name || 'Visitor' };
    let memories = [];
    if (memory) {
      try {
        memories = await memory.retrieve({ ...scope, query: excerpt(statement, 512), limit: 6 }, { signal });
        if (audience === 'private' && publicConversationId) memories.push(...await memory.retrieve({
          ...scope, audience: 'public', conversationId: publicConversationId, query: excerpt(statement, 512), limit: 3 }, { signal }));
      }
      catch (error) { signal.throwIfAborted(); report(`Resident memory: ${error.message}`); }
    }
    const context = { scene, senses, memories: memories.map(item => ({ kind: item.kind, when: item.when,
      who: item.who, where: item.where, outcome: item.outcome, text: item.text, source: item.source })) };
    // Prioritize current senses and the triggering conversation over old episodes.
    while (size(context) > 8192 && context.memories.length) context.memories.pop();
    if (size(context) > 8192) {
      context.scene = { note: 'Older scene context omitted to retain current senses',
        ...(scene.messages ? { messages: scene.messages.slice(-2) } : {}) };
    }
    if (size(context) > 8192) throw new Error('Resident context exceeds its conversation budget');
    await save({ ...scope, kind: 'heard', who: speaker, where: senses.self.position,
      outcome: 'The participant said this; it is not independently verified.', text: excerpt(statement, 1600),
      source: { kind: 'authenticated-message', eventId: eventId || crypto.randomUUID(), peerId: speaker.peerId } }, signal);
    signal.throwIfAborted();
    return { key, scope, speaker, senses, signal, prompt: worldIntentPrompt(prompt), worldContext: JSON.stringify(context) };
  }
  async function finish(turn, result, { valid = () => true } = {}) {
    const reply = parseWorldReply(result);
    turn.signal.throwIfAborted();
    if (closed || !valid() || !getBody(turn.key)?.local) return { text: reply.text, applied: false };
    const body = getBody(turn.key);
    await save({ ...turn.scope, kind: 'composed-reply', who: { agentId: body.agentId, peerId: body.ownerPeerId, name: body.name },
      where: observe(turn.key, turn.speaker.peerId).self.position,
      outcome: 'The resident generated this reply; delivery is not confirmed.', text: excerpt(reply.text, 1600),
      source: { kind: 'local-observation', eventId: crypto.randomUUID() } }, turn.signal);
    turn.signal.throwIfAborted();
    if (closed || !valid() || !getBody(turn.key)?.local) return { text: reply.text, applied: false };
    if (!reply.intent) return { text: reply.text, applied: false };
    try {
      const current = observe(turn.key, turn.speaker.peerId);
      const intent = validateWorldIntent(reply.intent, { observed: turn.senses, current, now: now() });
      const requestId = crypto.randomUUID();
      intentions.set(requestId, { ...turn, intent, at: now() });
      // At most one live intention per body; scene emits cancellation receipts.
      while (intentions.size > 64) intentions.delete(intentions.keys().next().value);
      try { await adapter.setIntent(turn.key, { ...intent, requestId }); }
      catch (error) { intentions.delete(requestId); throw error; }
      return { text: reply.text, applied: true, intent };
    } catch (error) {
      turn.signal.throwIfAborted(); report(`Resident action: ${error.message}`);
      return { text: `${reply.text}\n[Action not started: ${error.message}]`, applied: false };
    }
  }
  async function outcome(event) {
    const turn = intentions.get(event?.requestId);
    if (!turn || turn.key !== event.key || event.type !== turn.intent.type || event.targetId !== turn.intent.targetId) return;
    if (!['arrived', 'stopped', 'target-lost', 'blocked', 'cancelled', 'failed'].includes(event.status)) return;
    const continues = turn.intent.type === 'follow' && ['arrived', 'target-lost'].includes(event.status);
    if (!continues) intentions.delete(event.requestId);
    // Following can produce several physical transitions over its lifetime.
    // Retain the command's audience, but never turn sensor ticks into a journal.
    if (continues && turn.lastOutcomeAt !== undefined && now() - turn.lastOutcomeAt < 10000) return;
    turn.lastOutcomeAt = now(); turn.outcomeSequence = (turn.outcomeSequence ?? 0) + 1;
    const body = getBody(turn.key); if (!body?.local || body.agentId !== turn.scope.agentId) return;
    report(`${body.name}: ${event.type} ${event.status}${event.reason ? ` — ${excerpt(event.reason, 240)}` : ''}.`);
    const target = turn.senses.participants.find(item => item.id === turn.intent.targetId);
    await save({ ...turn.scope, kind: 'action-outcome', who: target
      ? { peerId: target.peerId || target.ownerPeerId || body.ownerPeerId, ...(target.agentId ? { agentId: target.agentId } : {}), name: target.name }
      : { agentId: body.agentId, peerId: body.ownerPeerId, name: body.name },
    where: event.position, outcome: `${event.type}: ${event.status}`,
    text: excerpt(`Physical adapter reported ${event.status}${target ? ` near ${target.name}` : ''}. Policy ${event.policyId ?? 'none'}; backend ${event.backend ?? 'none'}.${event.reason ? ` ${event.reason}` : ''}`, 1600),
    source: { kind: 'verified-action', eventId: `${event.requestId}:${turn.outcomeSequence}` } });
  }
  const unsubscribe = adapter.subscribeOutcomes(event => {
    const pending = outcome(event).catch(error => report(`Resident outcome: ${error.message}`));
    writes.add(pending); void pending.finally(() => writes.delete(pending));
  });
  return { prepare, finish, observe,
    getStatus: () => ({ pendingIntentions: intentions.size, memory: !!memory }),
    async dispose() { closed = true; unsubscribe(); lifetime.abort(); intentions.clear(); await Promise.allSettled([...writes]); } };
}
