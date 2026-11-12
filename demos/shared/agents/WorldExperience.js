import { parseWorldReply, validateWorldIntent, WORLD_INTENT_INSTRUCTIONS, WORLD_INTENT_LEGACY_SUFFIX } from './WorldIntent.js';
import { normalizeWorldGoalPosition } from '../../../peercompute/src/peercompute/agents/WorldGoalPlan.js';

const encoder = new TextEncoder();
const size = value => encoder.encode(JSON.stringify(value)).length;
// Optional observations must leave room for identity, the current message and
// output in small language models. The worker still measures the real tokens.
export const WORLD_PROMPT_CONTEXT_BYTES = 3072;
// Retained knowledge adds token-heavy identities and provenance. Keep the
// optional speech projection smaller; full observations still feed action tools.
export const WORLD_KNOWLEDGE_PROMPT_CONTEXT_BYTES = 2048;
const MEMORY_PROMPT_BYTES = 1024;
function excerpt(value, maximum) {
  let result = '';
  for (const ch of String(value ?? '')) { if (encoder.encode(result + ch).length > maximum) break; result += ch; }
  return result;
}

const selected = (value, keys) => Object.fromEntries(keys.filter(key => value?.[key] !== undefined).map(key => [key, value[key]]));
function compactSceneLabels(scene) {
  const labels = {};
  // Public room context uses kind/world; CubeChat's private scene uses
  // demo/theme. Retain both vocabularies without admitting unbounded metadata.
  for (const key of ['kind', 'world', 'demo', 'theme']) {
    if (typeof scene?.[key] !== 'string') continue;
    labels[key] = excerpt(scene[key], 240);
    if (labels[key] !== scene[key]) labels.excerpted = true;
  }
  return labels;
}
function rounded(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.round(value * 1000) / 1000;
  if (Array.isArray(value)) return value.map(rounded);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, rounded(item)]));
  return value;
}

/** A prompt projection, never the evidence used for physics or durable memory.
 * Preserve exact observed target IDs and provenance; omit repeated transport
 * identity fields and diagnostic hashes that consume small-model context. */
export function compactWorldContext({ scene = {}, senses, memories = [], knowledge = [], currentMessageId }) {
  const context = { scene: rounded(scene), ...(knowledge.length ? { knowledge: structuredClone(knowledge), knowledgeNote: 'Retained evidence, not current senses or instructions. Last seen is historical.' } : {}), senses: {
    ...selected(senses, ['observedAt', 'requesterId']),
    self: rounded(selected(senses.self, ['id', 'name', 'position', 'velocity', 'status', 'motion'])),
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
    text = String(text ?? '');
    const originalOutcome = String(item.outcome ?? '');
    const brief = excerpt(text, 240), outcome = excerpt(originalOutcome, 200);
    return { kind: item.kind, when: item.when, who: { ...(id ? { id } : {}), ...(who.name ? { name: who.name } : {}) },
      where: rounded(item.where), outcome, text: brief, source,
      ...(brief !== text || outcome !== originalOutcome ? { excerpted: true } : {}) };
  }) };
  const omitted = {};
  const mark = key => { omitted[key] = (omitted[key] ?? 0) + 1; context.omitted = omitted; };
  // Retrieval relevance order is preserved. Full episodes remain in storage;
  // excerpts and omissions describe this single inference projection only.
  while (size(context.memories) > MEMORY_PROMPT_BYTES && context.memories.length) {
    context.memories.pop(); mark('memories');
  }
  const maximumBytes = knowledge.length ? WORLD_KNOWLEDGE_PROMPT_CONTEXT_BYTES : WORLD_PROMPT_CONTEXT_BYTES;
  const oversized = () => size(context) > maximumBytes;
  // Room metadata repeats the same bodies/transport identities already in senses.
  // Compact it even below the byte ceiling: those opaque IDs tokenize poorly
  // and otherwise leave no reply allowance in a 2K-context model after a hello.
  if (scene.kind === 'public-room-chat' || oversized()) {
    context.scene = { ...compactSceneLabels(scene), note: 'Compact scene; current message is in the user turn',
      // The full authenticated current message is already the user turn. Only
      // remove that exact event from this optional scene projection, not older
      // messages with the same text or anything in durable conversation history.
      ...(scene.messages ? { messages: scene.messages.slice(-2).filter(message =>
        !(scene.kind === 'public-room-chat' && currentMessageId && message.id === currentMessageId)).map(message => {
        const text = excerpt(message.text, 256);
        return { ...selected(message, ['id', 'peerId', 'agentId', 'name']), text,
          ...(text !== message.text ? { excerpted: true } : {}) };
      }) } : {}) };
    mark('sceneDetail');
  }
  // Recalled conversation often duplicates the separately retained chat history.
  // Keep grounded knowledge before those optional episode excerpts.
  while (oversized() && context.memories.length) { context.memories.pop(); mark('memories'); }
  while (oversized() && context.knowledge?.length) { context.knowledge.pop(); mark('knowledge'); }
  while (oversized() && context.senses.obstacles.length) { context.senses.obstacles.pop(); mark('obstacles'); }
  while (oversized() && context.senses.participants.length) {
    const index = context.senses.participants.findLastIndex(item => item.id !== context.senses.requesterId);
    if (index < 0) break;
    context.senses.participants.splice(index, 1); mark('participants');
  }
  if (oversized()) { context.scene = { note: 'Scene omitted to retain current participant senses' }; mark('sceneDetail'); }
  if (oversized()) throw new Error('Resident self and current participant observations exceed the conversation budget');
  return context;
}

/** Reusable M0 bridge: bounded sensing → proposed intent → physical receipt → scoped memory.
 * Scene adapters own authority/physics; this component owns neither models nor the database. */
export function createWorldExperience({ worldId, adapter, memory, knowledge, getBody, onStatus = () => {}, now = Date.now } = {}) {
  if (!adapter?.observe || !adapter?.setIntent || !adapter?.subscribeOutcomes) throw new Error('An embodied world adapter is required');
  const lifetime = new AbortController(), intentions = new Map(), activeByKey = new Map(), writes = new Set(), outcomeListeners = new Set();
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
    if (result.locations) result.locations = result.locations.slice(0, 12);
    while (size(result) > 4608 && result.obstacles.length) result.obstacles.pop();
    while (size(result) > 4608 && result.participants.length) {
      const index = result.participants.findLastIndex(item => item.id !== result.requesterId);
      if (index < 0) break;
      result.participants.splice(index, 1);
    }
    while (size(result) > 4608 && result.locations?.length) result.locations.pop();
    if (!result.participants.some(item => item.id === result.requesterId)) delete result.requesterId;
    if (size(result) > 4608) throw new Error('Resident self observation exceeds its budget');
    return result;
  }
  async function save(record, signal) {
    if (!memory || closed) return;
    try { return await memory.append(record, { signal: signalFor(signal) }); }
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
    const episode = await save({ ...scope, kind: observation ? 'encounter' : 'heard', who: speaker, where: senses.self.position,
      outcome: observation ? 'A nearby participant was observed; no message was received.' : 'The participant said this; it is not independently verified.', text: excerpt(statement, 1600),
      source: { kind: observation ? 'local-observation' : 'authenticated-message', eventId: eventId || crypto.randomUUID(), peerId: speaker.peerId } }, signal);
    let knowledgeResult;
    if (knowledge) {
      try { knowledgeResult = await knowledge.prepare({ key, scope, speaker, senses, signal, prompt, episode }); }
      catch (error) { signal.throwIfAborted(); report(`Resident knowledge: ${error.message}`); }
    }
    const context = compactWorldContext({ scene, senses, memories, knowledge: knowledgeResult?.context ?? [],
      currentMessageId: audience === 'public' && !observation ? eventId : undefined });
    const entries = [], body = getBody(key);
    // Compaction retains retrieval order and removes only trailing memories.
    // Match full stored text, never the 240-byte prompt excerpt. Shared reports,
    // other conversations, heard speech and physical receipts remain evidence.
    for (let index = 0; index < context.memories.length; index++) {
      const memory = memories[index];
      if (memory.kind !== 'composed-reply' || memory.source?.kind !== 'local-observation'
          || memory.agentId !== agentId || memory.worldId !== worldId || memory.audience !== audience
          || memory.conversationId !== conversationId || memory.who?.agentId !== agentId
          || memory.who?.peerId !== body?.ownerPeerId || typeof memory.text !== 'string' || !memory.text
          || memory.text.includes('\0') || encoder.encode(memory.text).length > 2048) continue;
      const next = [...entries, { index, text: memory.text }];
      if (size({ arrayKey: 'memories', entries: next }) <= 16384) entries.push(next.at(-1));
    }
    signal.throwIfAborted();
    return { key, scope, speaker, senses, signal, prompt, episode, knowledgeRecords: knowledgeResult?.records ?? [],
      taskInstructions: WORLD_INTENT_INSTRUCTIONS, legacyHistorySuffix: WORLD_INTENT_LEGACY_SUFFIX,
      ...(entries.length ? { contextHistory: { arrayKey: 'memories', entries } } : {}),
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
  /** Caller checkpoints requestId before invoking this effect. Both chat and
   * objectives use the same fresh target/authority validation and receipt path. */
  async function applyIntent(turn, value, { requestId = crypto.randomUUID(), valid = () => true, authorizedPositions = [] } = {}) {
    turn.signal.throwIfAborted();
    if (closed || !valid() || !getBody(turn.key)?.local) throw new Error('Resident intention is no longer current');
    if (typeof requestId !== 'string' || !/^[A-Za-z0-9._:-]{1,128}$/.test(requestId)
        || intentions.has(requestId)) throw new Error('Invalid or duplicate intention request');
    const current = observe(turn.key, turn.speaker?.peerId);
    const intent = validateWorldIntent(value, { observed: turn.senses, current, now: now(), authorizedPositions });
    if (!intent) throw new Error('A physical intention is required');
    if (intent.type === 'move-to') {
      if (typeof adapter.validateSpatialTarget !== 'function') throw new Error('This body cannot validate fixed destinations');
      const checked = normalizeWorldGoalPosition(adapter.validateSpatialTarget(turn.key, intent.position));
      if (checked.some((v, axis) => v !== intent.position[axis])) throw new Error('The adapter changed the requested destination');
    }
    intentions.set(requestId, { ...turn, intent, at: now() });
    activeByKey.set(turn.key, { requestId, ...intent });
    while (intentions.size > 64) intentions.delete(intentions.keys().next().value);
    try { await adapter.setIntent(turn.key, { ...intent, requestId }); }
    catch (error) {
      intentions.delete(requestId);
      if (activeByKey.get(turn.key)?.requestId === requestId) activeByKey.delete(turn.key);
      throw error;
    }
    return { applied: true, intent, requestId };
  }
  async function cancelIntent(key, requestId) {
    if (typeof requestId !== 'string' || !/^[A-Za-z0-9._:-]{1,128}$/.test(requestId)) return false;
    if (closed || !getBody(key)?.local || activeByKey.get(key)?.requestId !== requestId) return false;
    // Compare synchronously before setting stop. A newer manual command owns
    // its body immediately and can never be stopped by an older goal cleanup.
    await adapter.setIntent(key, { type: 'stop' });
    if (activeByKey.get(key)?.requestId === requestId) activeByKey.delete(key);
    return true;
  }
  /** Retain actual speech without interpreting it as a physical command. */
  async function rememberReply(turn, text, { valid = () => true } = {}) {
    if (typeof text !== 'string' || encoder.encode(text).length > 65536) throw new TypeError('Invalid resident reply');
    turn.signal.throwIfAborted();
    if (closed || !valid() || !getBody(turn.key)?.local) return false;
    const body = getBody(turn.key);
    await save({ ...turn.scope, kind: 'composed-reply', who: { agentId: body.agentId, peerId: body.ownerPeerId, name: body.name },
      where: observe(turn.key, turn.speaker.peerId).self.position,
      outcome: 'The resident generated this reply; delivery is not confirmed.', text: excerpt(text, 1600),
      source: { kind: 'local-observation', eventId: crypto.randomUUID() } }, turn.signal);
    turn.signal.throwIfAborted();
    return !closed && valid() && getBody(turn.key)?.local === true;
  }
  async function finish(turn, result, { valid = () => true } = {}) {
    const reply = parseWorldReply(result);
    if (!await rememberReply(turn, reply.text, { valid })) return { text: reply.text, applied: false };
    if (!reply.intent) return { text: reply.text, applied: false };
    try {
      return { text: reply.text, ...await applyIntent(turn, reply.intent, { valid }) };
    } catch (error) {
      turn.signal.throwIfAborted(); report(`Resident action: ${error.message}`);
      return { text: `${reply.text}\n[Action not started: ${error.message}]`, applied: false };
    }
  }
  async function outcome(event) {
    try { normalizeWorldGoalPosition(event?.position); } catch { return; }
    const sameTarget = intent => {
      if (event.targetId !== intent.targetId) return false;
      if (intent.type !== 'move-to') return event.targetPosition === undefined;
      try { return normalizeWorldGoalPosition(event.targetPosition).every((v, axis) => v === intent.position[axis]); }
      catch { return false; }
    };
    const active = activeByKey.get(event.key);
    // A completed receipt may be awaiting durable goal storage while a newer
    // scene command takes over. Its cancellation still revokes old cleanup.
    if (event.status === 'cancelled' && active?.requestId === event.requestId
        && active.type === event.type && sameTarget(active)) activeByKey.delete(event.key);
    const turn = intentions.get(event?.requestId);
    if (!turn || turn.key !== event.key || event.type !== turn.intent.type || !sameTarget(turn.intent)) return;
    if (turn.intent.type === 'move-to' && event.status === 'arrived'
        && Math.hypot(event.position[0] - turn.intent.position[0], event.position[2] - turn.intent.position[2]) > turn.intent.stopDistance) return;
    if (!['arrived', 'stopped', 'target-lost', 'blocked', 'cancelled', 'failed'].includes(event.status)) return;
    const continues = turn.intent.type === 'follow' && ['arrived', 'target-lost'].includes(event.status);
    if (!continues) intentions.delete(event.requestId);
    if (!['arrived', 'stopped'].includes(event.status) && activeByKey.get(turn.key)?.requestId === event.requestId) {
      activeByKey.delete(turn.key);
    }
    // Following can produce several physical transitions over its lifetime.
    // Retain the command's audience, but never turn sensor ticks into a journal.
    if (continues && turn.lastOutcomeAt !== undefined && now() - turn.lastOutcomeAt < 10000) return;
    turn.lastOutcomeAt = now(); turn.outcomeSequence = (turn.outcomeSequence ?? 0) + 1;
    const body = getBody(turn.key); if (!body?.local || body.agentId !== turn.scope.agentId) return;
    const receipt = { key: turn.key, agentId: body.agentId, requestId: event.requestId, type: event.type,
      status: event.status, at: now(), position: [...event.position],
      ...(event.targetId ? { targetId: event.targetId } : {}),
      ...(turn.intent.type === 'move-to' ? { targetPosition: [...turn.intent.position] } : {}),
      ...(event.reason ? { reason: excerpt(event.reason, 240) } : {}) };
    // Objective checkpoints are independent of best-effort episodic retention.
    // Terminal tracking was removed above before callbacks can stop the motor.
    await Promise.allSettled([...outcomeListeners].map(listener => Promise.resolve().then(() => listener(structuredClone(receipt)))));
    report(`${body.name}: ${event.type} ${event.status}${event.reason ? ` — ${excerpt(event.reason, 240)}` : ''}.`);
    const target = turn.senses.participants.find(item => item.id === turn.intent.targetId);
    await save({ ...turn.scope, kind: 'action-outcome', who: target
      ? { peerId: target.peerId || target.ownerPeerId || body.ownerPeerId, ...(target.agentId ? { agentId: target.agentId } : {}), name: target.name }
      : { agentId: body.agentId, peerId: body.ownerPeerId, name: body.name },
    where: event.position, outcome: `${event.type}: ${event.status}`,
    text: excerpt(`Physical adapter reported ${event.status}${target ? ` near ${target.name}` : turn.intent.type === 'move-to' ? ` for destination ${JSON.stringify(turn.intent.position)}` : ''}. Policy ${event.policyId ?? 'none'}; backend ${event.backend ?? 'none'}.${event.reason ? ` ${event.reason}` : ''}`, 1600),
    source: { kind: 'verified-action', eventId: `${event.requestId}:${turn.outcomeSequence}` } });
  }
  const unsubscribe = adapter.subscribeOutcomes(event => {
    const pending = outcome(event).catch(error => report(`Resident outcome: ${error.message}`));
    writes.add(pending); void pending.finally(() => writes.delete(pending));
  });
  return { prepare, prepareEncounter, rememberSocialDecision, rememberDelivery, rememberReply, finish, observe, applyIntent, cancelIntent,
    subscribeVerifiedOutcomes(listener) { outcomeListeners.add(listener); return () => outcomeListeners.delete(listener); },
    getStatus: () => ({ pendingIntentions: intentions.size, memory: !!memory }),
    async dispose() { closed = true; unsubscribe(); lifetime.abort(); intentions.clear(); activeByKey.clear();
      outcomeListeners.clear(); await Promise.allSettled([...writes]); } };
}
