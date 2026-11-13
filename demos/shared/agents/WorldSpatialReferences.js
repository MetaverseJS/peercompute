import { normalizeWorldGoalPosition } from '../../../peercompute/src/peercompute/agents/WorldGoalPlan.js';

const bytes = value => new TextEncoder().encode(value).length;
const fail = () => { throw Object.assign(new Error('Placement requires a current observed destination'), { code: 'ERR_WORLD_OBJECT_TARGET' }); };
const text = (value, maximum) => typeof value === 'string' && value.trim() && !/[\u0000-\u001f\u007f]/u.test(value)
  && bytes(value) <= maximum;
const same = (a, b) => a.length === b.length && a.every((value, index) => value === b[index]);

/** One reference table for navigation and object placement. Retain exact source
 * points and knowledge revisions privately; models select only request-local IDs. */
export function worldSpatialLocations(observed) {
  const locations = observed?.locations ?? [];
  if (!Array.isArray(locations) || locations.length > 12) fail();
  const ids = new Set();
  return locations.map((location, index) => {
    if (!text(location?.id, 320) || !text(location.name, 120) || ids.has(location.id)) fail();
    ids.add(location.id);
    const knowledge = location.knowledgeId !== undefined || location.knowledgeRevision !== undefined;
    if (knowledge && (!text(location.knowledgeId, 320) || !Number.isSafeInteger(location.knowledgeRevision)
        || location.knowledgeRevision < 1)) fail();
    return { id: `l${index + 1}`, sourceId: location.id, name: location.name,
      position: normalizeWorldGoalPosition(location.position), ...(knowledge
        ? { knowledgeId: location.knowledgeId, knowledgeRevision: location.knowledgeRevision } : {}) };
  });
}

export function worldSpatialLocationSummary(location, observed) {
  const self = normalizeWorldGoalPosition(observed.self.position);
  return { id: location.id, name: location.name,
    distance: Math.round(Math.hypot(location.position[0] - self[0], location.position[2] - self[2])),
    relativePosition: location.position.map((value, index) => Math.round(value - self[index])) };
}

/** Trusted adapter input, not the model's argument schema. Source identity is
 * retained so a participant can be observed again after slow inference. */
export function normalizeWorldObjectTarget(value) {
  if (!value || Array.isArray(value) || typeof value !== 'object') fail();
  const allowed = value.kind === 'location' ? ['kind', 'id', 'position', 'observedAt', 'knowledgeId', 'knowledgeRevision']
    : value.kind === 'participant' ? ['kind', 'id', 'observedAt'] : [];
  if (!allowed.length || Object.keys(value).some(key => !allowed.includes(key)) || !text(value.id, 320)
      || !Number.isFinite(value.observedAt) || value.observedAt < 0) fail();
  if (value.kind === 'participant') return { kind: value.kind, id: value.id, observedAt: value.observedAt };
  const knowledge = value.knowledgeId !== undefined || value.knowledgeRevision !== undefined;
  if (knowledge && (!text(value.knowledgeId, 320) || !Number.isSafeInteger(value.knowledgeRevision) || value.knowledgeRevision < 1)) fail();
  return { kind: value.kind, id: value.id, position: normalizeWorldGoalPosition(value.position), observedAt: value.observedAt,
    ...(knowledge ? { knowledgeId: value.knowledgeId, knowledgeRevision: value.knowledgeRevision } : {}) };
}

/** Even injected decision providers must prove their point came from this
 * frozen observation. Scene geometry is revalidated separately at execution. */
export function validateWorldObjectTarget(value, { observed, now = Date.now() } = {}) {
  const target = normalizeWorldObjectTarget(value);
  if (target.observedAt !== observed?.observedAt || now < target.observedAt || now - target.observedAt > 120000) fail();
  if (target.kind === 'participant') {
    if (!observed.participants?.some(item => item.id === target.id)) fail();
  } else {
    const source = worldSpatialLocations(observed).find(item => item.sourceId === target.id);
    if (!source || !same(source.position, target.position) || source.knowledgeId !== target.knowledgeId
        || source.knowledgeRevision !== target.knowledgeRevision) fail();
  }
  return target;
}

export function resolveWorldObjectTarget(reference, { observed, participants, now = Date.now() } = {}) {
  if (!reference || Array.isArray(reference) || typeof reference !== 'object' || Object.keys(reference).length !== 1) fail();
  let target;
  if (Object.hasOwn(reference, 'locationId')) {
    const location = worldSpatialLocations(observed).find(item => item.id === reference.locationId);
    if (!location) fail();
    target = { kind: 'location', id: location.sourceId, position: location.position, observedAt: observed.observedAt,
      ...(location.knowledgeId ? { knowledgeId: location.knowledgeId, knowledgeRevision: location.knowledgeRevision } : {}) };
  } else if (Object.hasOwn(reference, 'targetId') && participants?.has(reference.targetId)) {
    target = { kind: 'participant', id: participants.get(reference.targetId), observedAt: observed.observedAt };
  } else fail();
  return validateWorldObjectTarget(target, { observed, now });
}
