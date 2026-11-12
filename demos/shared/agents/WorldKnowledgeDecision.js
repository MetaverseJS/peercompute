import { normalizeWorldGoalPosition } from '../../../peercompute/src/peercompute/agents/WorldGoalPlan.js';

const bytes = value => new TextEncoder().encode(value).length;
const failure = () => Object.assign(new Error('The model did not return a grounded place memory'),
  { code: 'ERR_WORLD_KNOWLEDGE_DECISION' });
const samePosition = (a, b) => a.every((coordinate, index) => coordinate === b[index]);
function fields(value, allowed) {
  if (!value || ![Object.prototype, null].includes(Object.getPrototypeOf(value))
      || Reflect.ownKeys(value).some(key => !allowed.includes(key))) throw failure();
}
function label(value, maximum) {
  if (typeof value !== 'string' || !value.trim() || !value.isWellFormed()
      || /[\u0000-\u001f\u007f]/u.test(value) || bytes(value) > maximum) throw failure();
  return value.trim();
}
function identity(value) {
  const result = label(value, 320);
  if (result !== value) throw failure();
  return result;
}
function fresh(observedAt, now) {
  if (!Number.isFinite(now) || now < observedAt || now - observedAt > 120000) throw failure();
}

export const WORLD_KNOWLEDGE_ACTION_INSTRUCTIONS = 'Explicitly name a remembered place: '
  + '{"knowledge":{"type":"remember-place","name":"Owner supplied name","anchor":"speaker"}}. '
  + 'Use only knowledgeAtRequest anchors: here means speaker when that message arrived; self means your position; lN names a listed location. '
  + 'Never invent coordinates/IDs or replace/forget knowledge. Questions or hypotheticals require {"intent":null}. '
  + 'Returning to a remembered place is a movement task, not another memory. Persistence is checked separately.';

/** Short references are bound to the incoming message's detached observation.
 * A place label is owner-reported; only its sampled position is observed. This
 * projector never grants storage authority or proves a destination is clear. */
export function projectWorldKnowledgeRequest(observed) {
  if (!observed?.self || !Array.isArray(observed.participants) || observed.participants.length > 24
      || !Number.isFinite(observed.observedAt) || observed.observedAt < 0
      || observed.locations !== undefined && (!Array.isArray(observed.locations) || observed.locations.length > 12)) throw failure();
  const snapshot = structuredClone(observed), anchors = new Map(), participantIds = new Set(), locationIds = new Set();
  const intentRevision = snapshot.self.intentRevision;
  if (intentRevision !== undefined && (!Number.isSafeInteger(intentRevision) || intentRevision < 0)) throw failure();
  const context = { anchors: [], locations: [] };
  function add(reference, kind, source, name, destination) {
    const id = identity(source.id);
    let position;
    try { position = normalizeWorldGoalPosition(source.position); } catch { return; }
    anchors.set(reference, { source: { kind, id }, position });
    destination.push({ id: reference, name: label(name, 120) });
  }
  add('self', 'self', snapshot.self, 'Your position at the incoming message', context.anchors);
  for (const participant of snapshot.participants) {
    const id = identity(participant?.id);
    if (participantIds.has(id)) throw failure();
    participantIds.add(id);
    if (id === snapshot.requesterId) add('speaker', 'participant', participant, 'Speaker position at the incoming message', context.anchors);
  }
  for (const [index, location] of (snapshot.locations ?? []).entries()) {
    const id = identity(location?.id);
    if (locationIds.has(id)) throw failure();
    locationIds.add(id);
    add(`l${index + 1}`, 'location', location, location.name, context.locations);
  }
  function resolve(value, { now = Date.now() } = {}) {
    fields(value, ['type', 'name', 'anchor']);
    if (value.type !== 'remember-place' || !anchors.has(value.anchor)) throw failure();
    fresh(snapshot.observedAt, now);
    const anchor = anchors.get(value.anchor);
    return { type: 'remember-place', name: label(value.name, 120), position: [...anchor.position],
      source: { ...anchor.source }, observedAt: snapshot.observedAt,
      ...(intentRevision === undefined ? {} : { intentRevision }) };
  }
  function validate(value, { now = Date.now() } = {}) {
    fields(value, ['type', 'name', 'position', 'source', 'observedAt', 'intentRevision']);
    fields(value.source, ['kind', 'id']);
    if (value.observedAt !== snapshot.observedAt || value.intentRevision !== intentRevision
        || Object.hasOwn(value, 'intentRevision') !== (intentRevision !== undefined)) throw failure();
    const reference = [...anchors].find(([, anchor]) => anchor.source.kind === value.source.kind && anchor.source.id === value.source.id)?.[0];
    const action = resolve({ type: value.type, name: value.name, anchor: reference }, { now });
    if (!samePosition(action.position, normalizeWorldGoalPosition(value.position))) throw failure();
    return action;
  }
  return { context, resolve, validate };
}

/** Independent boundary validation also covers injected/test decision providers.
 * Rechecking against a new speaker position would silently change what 'here'
 * meant; the caller must retain the original incoming-message observation. */
export function validateWorldKnowledgeAction(value, { observed, now = Date.now() } = {}) {
  return projectWorldKnowledgeRequest(observed).validate(value, { now });
}
