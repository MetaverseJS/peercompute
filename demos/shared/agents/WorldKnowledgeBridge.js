import { normalizeWorldGoalPosition } from '../../../peercompute/src/peercompute/agents/WorldGoalPlan.js';
import { worldKnowledgeStatus } from '../../../peercompute/src/peercompute/agents/WorldKnowledgeContracts.js';
import { knowledgeExcerpt, projectWorldKnowledge } from './WorldKnowledgeContext.js';
import { validateWorldKnowledgeAction } from './WorldKnowledgeDecision.js';

const encoder = new TextEncoder();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const labelKey = label => label.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');
const hash = async value => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value))),
  byte => byte.toString(16).padStart(2, '0')).join('');
const scopeOf = record => ({ agentId: record.agentId, worldId: record.worldId,
  audience: record.audience, conversationId: record.conversationId });
const identityOf = participant => participant?.kind === 'resident' && participant.agentId && (participant.peerId || participant.ownerPeerId)
  ? { type: 'resident', key: `${participant.peerId || participant.ownerPeerId}\0${participant.agentId}` }
  : participant?.kind === 'human' && participant.peerId ? { type: 'peer', key: participant.peerId } : null;
async function subjectOf(participant) {
  const identity = identityOf(participant);
  return identity && { subjectType: identity.type, subjectId: identity.type === 'peer' ? identity.key : await hash(identity.key) };
}
function evidenceOf(turn) {
  const episode = turn.episode;
  if (!episode?.id || !Object.entries(turn.scope).every(([key, value]) => episode[key] === value)) throw new Error('A saved conversation episode is required to remember this observation');
  return { ...turn.scope, episodeId: episode.id, eventId: episode.source.eventId, sourceKind: episode.source.kind,
    when: episode.when, provenance: 'observed', ...(episode.source.peerId ? { peerId: episode.source.peerId } : {}) };
}

/** Grounded, audience-scoped knowledge. The scene owns authorization; the
 * StateManager store owns atomic CAS and durable forgetting. No model coordinates,
 * descriptions of unseen people or guessed current positions are admitted. */
export function createWorldKnowledgeBridge({ worldId, store, memory, adapter, conversationId, isCurrent = () => true, now = Date.now } = {}) {
  if (!store || !adapter || typeof conversationId !== 'function') throw new Error('Knowledge requires a store and world adapter');
  const publicScope = async agentId => ({ agentId, worldId, audience: 'public', conversationId: await conversationId(worldId, 'public-room') });
  async function recall(scope, query = '', { signal } = {}) {
    const scopes = [scope];
    if (scope.audience === 'private') scopes.push(await publicScope(scope.agentId));
    const records = [];
    for (const item of scopes) records.push(...await store.retrieve({ ...item, query: knowledgeExcerpt(query, 512), limit: 8 }, { signal }));
    return records;
  }
  async function recognize(turn) {
    const participant = turn.senses.participants.find(item => item.id === turn.senses.requesterId);
    if (!participant || !turn.episode) return;
    // A body observation and the authenticated message must name the same peer
    // (and resident, if present). Display names never establish identity.
    if ((participant.peerId || participant.ownerPeerId) !== turn.speaker.peerId
        || (turn.speaker.agentId ?? null) !== (participant.agentId ?? null)) return;
    const subject = await subjectOf(participant); if (!subject) return;
    const id = await hash(JSON.stringify([turn.scope, subject.subjectType, subject.subjectId]));
    const existing = await store.get(turn.scope, id, { signal: turn.signal })
      ?? (await store.list(turn.scope, { signal: turn.signal })).find(record => record.kind === 'person'
        && record.subjectType === subject.subjectType && record.subjectId === subject.subjectId);
    const evidence = evidenceOf(turn);
    try {
      await store.put({ ...existing, ...turn.scope, id: existing?.id ?? id, ...subject, kind: 'person',
        label: existing?.label ?? knowledgeExcerpt(participant.name || 'Unnamed participant', 240),
        note: existing?.note ?? 'Encountered in this world. Last seen is historical; current presence comes from sensors.',
        position: normalizeWorldGoalPosition(participant.position), confidence: existing?.confidence ?? 'observed', lastSeenAt: evidence.when,
        evidence: [...(existing?.evidence ?? []), evidence].slice(-4) }, { expectedRevision: existing?.revision ?? 0, signal: turn.signal, isCurrent: () => isCurrent(turn.key) });
    } catch (error) {
      // A newer correction/forget wins over background familiarity maintenance.
      if (!['ERR_WORLD_KNOWLEDGE_CONFLICT', 'ERR_WORLD_KNOWLEDGE_FORGOTTEN'].includes(error.code)) throw error;
    }
  }
  async function attachIdentity(records, observed) {
    const participants = await Promise.all((observed?.participants ?? []).map(async item => ({ item, subject: await subjectOf(item) })));
    return records.map(record => {
      const match = record.kind === 'person' && participants.find(({ subject }) => subject
        && subject.subjectType === record.subjectType && subject.subjectId === record.subjectId);
      return { ...record, ...(match ? { currentParticipantId: match.item.id } : {}) };
    });
  }
  async function prepare(turn) {
    await recognize(turn);
    const records = await recall(turn.scope, turn.prompt, { signal: turn.signal });
    turn.signal?.throwIfAborted();
    return { records, context: projectWorldKnowledge(await attachIdentity(records, turn.senses), { observed: turn.senses, now: now() }) };
  }
  async function rememberPlace({ turn, action, valid = () => true, signal = turn.signal }) {
    signal?.throwIfAborted();
    const checked = validateWorldKnowledgeAction(action, { observed: turn.senses, now: now() });
    if (!checked || !await valid()) throw new Error('The remember request is no longer current');
    // This tool names an owner-specified point; it does not invent place names.
    // Validate the proposed label against the unchanged message, independently
    // of whatever example or placeholder a small model might copy.
    if (typeof turn.prompt !== 'string' || !labelKey(turn.prompt).includes(labelKey(checked.name))) {
      throw new Error('The remembered name must come from your message. Please name the place explicitly.');
    }
    const position = normalizeWorldGoalPosition(checked.position);
    if (adapter.normalizePosition && !same(adapter.normalizePosition(position), position)) throw new Error('Remembered position is outside this world');
    const bounds = turn.senses.spatial?.bounds;
    if (bounds && [position[0], position[2]].some((value, axis) => value < bounds.min[axis] || value > bounds.max[axis])) {
      throw new Error('Remembered position is outside the observed world bounds');
    }
    const evidence = evidenceOf(turn), subjectId = await hash(labelKey(checked.name));
    const id = await hash(JSON.stringify([turn.scope, 'place', subjectId]));
    // Snapshot revision captured before inference. A Mind correction/forget in
    // another tab cannot be overwritten by this delayed proposal.
    const existing = (turn.knowledgeRecords ?? []).find(record => record.audience === turn.scope.audience
      && record.conversationId === turn.scope.conversationId && record.kind === 'place' && record.subjectId === subjectId);
    // Naming a point grants creation authority, never replacement authority.
    // A mistaken tool choice for "take me back" must not move that destination.
    // CAS and semantic uniqueness also protect records absent from bounded recall.
    if (existing) throw Object.assign(new Error('That place is already remembered. Inspect it in Mind or choose a new name.'),
      { code: 'ERR_WORLD_KNOWLEDGE_CONFLICT' });
    signal?.throwIfAborted(); if (!await valid()) throw new Error('Resident ownership changed before remembering');
    if (!memory) throw new Error('Durable observation evidence is unavailable');
    const observation = await memory.append({ ...turn.scope, kind: 'place-observation', when: checked.observedAt,
      who: turn.speaker, where: checked.position, text: checked.name,
      outcome: 'Owner-requested name for this observed point; knowledge retention is recorded separately.',
      source: { kind: 'local-observation', eventId: crypto.randomUUID() } }, { signal });
    const anchorEvidence = evidenceOf({ ...turn, episode: observation });
    if (!await valid()) throw new Error('Resident ownership changed before remembering');
    return store.put({ ...turn.scope, id, kind: 'place', subjectType: 'place', subjectId,
      label: checked.name, note: 'Named by the owner from a directly observed position.', position: checked.position,
      confidence: 'observed', lastSeenAt: anchorEvidence.when, evidence: [evidence, anchorEvidence] },
    { expectedRevision: 0, signal, isCurrent: () => isCurrent(turn.key) });
  }
  async function observe({ key, agentId, observed, query = '', audience = 'private', requester = 'owner', signal }) {
    const scope = { agentId, worldId, audience, conversationId: await conversationId(worldId, audience === 'public' ? 'public-room' : requester) };
    const records = await recall(scope, query, { signal }), locations = [];
    for (const record of records) {
      if (record.kind !== 'place') continue;
      // Retained coordinates are only candidate destinations. Check the current
      // walking surface, distance and obstacles again; never move a saved point.
      try {
        const position = normalizeWorldGoalPosition(adapter.validateSpatialTarget?.(key, record.position));
        if (!same(position, record.position)) continue;
        locations.push({ id: `knowledge:${record.id}`, name: knowledgeExcerpt(record.label, 120), position,
          knowledgeId: record.id, knowledgeRevision: record.revision });
      } catch { /* Keep the memory, omit a currently unreachable navigation target. */ }
      if (locations.length === 6) break;
    }
    signal?.throwIfAborted();
    return { ...observed, locations: [...locations, ...(observed.locations ?? [])].slice(0, 12),
      knowledge: projectWorldKnowledge(await attachIdentity(records, observed), { observed, now: now() }),
      knowledgeSnapshot: records.map(record => ({ ...scopeOf(record), id: record.id, revision: record.revision })) };
  }
  async function assertCurrent(observed, { signal } = {}) {
    for (const reference of observed.knowledgeSnapshot ?? []) {
      const record = await store.get(scopeOf(reference), reference.id, { signal });
      if (!record || record.revision !== reference.revision) throw new DOMException('Resident knowledge changed; observe again', 'AbortError');
    }
    signal?.throwIfAborted();
  }
  async function list(agentId, { signal } = {}) {
    return (await store.snapshot({ agentId, worldId, includePrivate: true }, { signal }))
      .map(record => ({ ...record, status: worldKnowledgeStatus(record, now()) }));
  }
  async function find(agentId, id, { signal } = {}) {
    const record = (await store.snapshot({ agentId, worldId, includePrivate: true }, { signal })).find(item => item.id === id);
    if (!record) throw new Error('This memory was removed; refresh Mind');
    return record;
  }
  async function correct(agentId, { id, expectedRevision, patch, signal, isCurrent, ownerPeerId, ownerPosition }) {
    if (!patch || Object.keys(patch).some(key => !['label', 'note'].includes(key))) throw new Error('Only memory labels and notes can be corrected here');
    const record = await find(agentId, id, { signal });
    if (!memory || typeof ownerPeerId !== 'string' || !ownerPeerId) throw new Error('An authenticated owner correction is required');
    const scope = scopeOf(record);
    const episode = await memory.append({ ...scope, kind: 'knowledge-correction',
      who: { peerId: ownerPeerId, name: 'Owner' }, where: record.position ?? normalizeWorldGoalPosition(ownerPosition),
      text: JSON.stringify({ recordId: record.id, patch }),
      outcome: 'The owner requested this correction; it is not independently verified or a confirmed knowledge write.',
      source: { kind: 'authenticated-message', eventId: crypto.randomUUID(), peerId: ownerPeerId } }, { signal });
    const evidence = evidenceOf({ scope, episode });
    return store.put({ ...record, ...patch, confidence: 'reported', evidence: [...record.evidence, evidence].slice(-4) },
      { expectedRevision, signal, isCurrent });
  }
  async function forget(agentId, { id, expectedRevision, signal, isCurrent }) {
    const record = await find(agentId, id, { signal });
    return store.forget(scopeOf(record), id, { expectedRevision, signal, isCurrent });
  }
  return { prepare, rememberPlace, observe, assertCurrent, list, correct, forget };
}
