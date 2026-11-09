import { parseWorldReply, validateWorldIntent, WORLD_INTENT_INSTRUCTIONS, WORLD_INTENT_LEGACY_SUFFIX } from './WorldIntent.js';

const encoder = new TextEncoder();
const size = value => encoder.encode(JSON.stringify(value)).length;
function excerpt(value, maximum) {
  let result = '';
  for (const ch of String(value ?? '')) { if (encoder.encode(result + ch).length > maximum) break; result += ch; }
  return result;
}

const selected = (value, keys) => Object.fromEntries(keys.filter(key => value?.[key] !== undefined).map(key => [key, value[key]]));
function rounded(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.round(value * 1000) / 1000;
  if (Array.isArray(value)) return value.map(rounded);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, rounded(item)]));
  return value;
}

/** A prompt projection, never the evidence used for physics or durable memory.
 * Preserve exact observed target IDs and provenance; omit repeated transport
 * identity fields and diagnostic hashes that consume small-model context. */
export function compactWorldContext({ scene = {}, senses, memories = [] }) {
  const context = { scene: rounded(scene), senses: {
    ...selected(senses, ['observedAt', 'requesterId']),
    self: rounded(selected(senses.self, ['id', 'name', 'position', 'velocity', 'status'])),
    participants: senses.participants.map(item => rounded(selected(item,
      ['id', 'kind', 'name', 'position', 'relativePosition', 'velocity', 'distance']))),
    obstacles: rounded(senses.obstacles ?? []),
  }, memories: memories.map(item => {
    const who = item.who ?? {}, peerId = who.peerId;
    const id = peerId ? (who.agentId ? `resident:${peerId}:${who.agentId}` : `human:${peerId}`) : who.agentId;
    const source = selected(item.source, ['kind', 'sourceAgentId']);
    if (source.kind === 'shared-memory' && item.source.peerId) source.peerId = item.source.peerId;
    let text = item.text;
    // The action outcome and reason remain; engine provenance stays in the full
    // verified-action record. Other participants' text is never rewritten.
    if (item.kind === 'action-outcome' && source.kind === 'verified-action') {
      text = text?.replace(/ Policy [^;]+; backend [^.]+\./, '');
    }
    return { kind: item.kind, when: item.when, who: { ...(id ? { id } : {}), ...(who.name ? { name: who.name } : {}) },
      where: rounded(item.where), outcome: item.outcome, text, source };
  }) };
  // Retrieval relevance order is preserved. Old episodes yield to live senses
  // and the current room conversation, just as in the full adapter budget.
  while (size(context) > 8192 && context.memories.length) context.memories.pop();
  if (size(context) > 8192) context.scene = { note: 'Older scene context omitted to retain current senses',
    ...(scene.messages ? { messages: rounded(scene.messages.slice(-2)) } : {}) };
  if (size(context) > 8192) throw new Error('Resident context exceeds its conversation budget');
  return context;
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
    eventId, scene = {}, publicConversationId, signal, observation = false }) {
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
    const context = compactWorldContext({ scene, senses, memories });
    await save({ ...scope, kind: observation ? 'encounter' : 'heard', who: speaker, where: senses.self.position,
      outcome: observation ? 'A nearby participant was observed; no message was received.' : 'The participant said this; it is not independently verified.', text: excerpt(statement, 1600),
      source: { kind: observation ? 'local-observation' : 'authenticated-message', eventId: eventId || crypto.randomUUID(), peerId: speaker.peerId } }, signal);
    signal.throwIfAborted();
    return { key, scope, speaker, senses, signal, prompt,
      taskInstructions: WORLD_INTENT_INSTRUCTIONS, legacyHistorySuffix: WORLD_INTENT_LEGACY_SUFFIX,
      worldContext: JSON.stringify(context) };
  }
  function prepareEncounter({ target, ...options }) {
    const peerId = target.peerId || target.ownerPeerId;
    return prepare({ ...options, audience: 'public', observation: true, requesterPeerId: peerId,
      who: { peerId, name: target.name, ...(target.agentId ? { agentId: target.agentId } : {}) },
      prompt: 'Consider this nearby encounter.', statement: `Observed ${target.name} (${target.id}) nearby.` });
  }
  async function rememberSocialDecision(turn, decision) {
    const quiet = decision.decision === 'quiet';
    await save({ ...turn.scope, kind: quiet ? 'social-quiet' : 'social-goal', who: turn.speaker,
      where: turn.senses.self.position,
      outcome: quiet ? 'The resident chose not to speak.' : 'Proposed social goal; not an instruction or completed action.',
      text: quiet ? (decision.reason === 'invalid-output' ? 'No valid decision was produced.' : 'Remain quiet at this encounter.') : decision.goal || 'Exchange a brief public greeting.',
      source: { kind: 'local-observation', eventId: crypto.randomUUID() } }, turn.signal);
  }
  async function rememberDelivery({ key, conversationId, target, text, result, eventId, signal }) {
    const body = getBody(key); if (!body?.local) return;
    // A transport ACK establishes receipt by a peer, never that a human read it.
    const delivery = result?.delivery, acknowledged = Number(delivery?.delivered ?? 0);
    await save({ worldId, agentId: body.agentId, audience: 'public', conversationId, kind: 'social-delivery',
      who: { peerId: target.peerId || target.ownerPeerId, ...(target.agentId ? { agentId: target.agentId } : {}), name: target.name },
      where: observe(key).self.position, outcome: acknowledged > 0 ? `Public chat acknowledged by ${acknowledged} peer(s); reading is unknown.`
        : delivery?.status === 'local-only' ? 'Posted to local world chat; no remote recipients.' : 'Public chat attempted; remote receipt is unconfirmed.',
      text: excerpt(text, 1600), source: { kind: 'local-observation', eventId: eventId || crypto.randomUUID() } }, signal);
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
  return { prepare, prepareEncounter, rememberSocialDecision, rememberDelivery, finish, observe,
    getStatus: () => ({ pendingIntentions: intentions.size, memory: !!memory }),
    async dispose() { closed = true; unsubscribe(); lifetime.abort(); intentions.clear(); await Promise.allSettled([...writes]); } };
}
