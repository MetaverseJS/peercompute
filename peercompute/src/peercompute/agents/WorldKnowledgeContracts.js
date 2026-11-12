import { agentIdentifier } from './AgentContracts.js';
import { normalizeWorldGoalPosition } from './WorldGoalPlan.js';

export const WORLD_KNOWLEDGE_LIMITS = Object.freeze({ perResident: 256, entries: 4096,
  bytes: 2 * 1024 * 1024, recordBytes: 4096, evidence: 4, results: 32,
  personFreshMs: 5 * 60 * 1000, placeFreshMs: 30 * 24 * 60 * 60 * 1000 });
const encoder = new TextEncoder(), decoder = new TextDecoder();
const fields = ['agentId', 'worldId', 'audience', 'conversationId', 'id', 'revision', 'kind', 'subjectType', 'subjectId',
  'label', 'note', 'position', 'confidence', 'lastSeenAt', 'evidence', 'createdAt', 'updatedAt', 'origin'];
const sourceKinds = ['verified-action', 'authenticated-message', 'local-observation', 'shared-memory'];

export function worldKnowledgeFields(value, allowed, label = 'record') {
  if (!value || ![Object.prototype, null].includes(Object.getPrototypeOf(value))
      || Reflect.ownKeys(value).some(key => !allowed.includes(key))) throw new TypeError(`Invalid knowledge ${label} fields`);
}
export function worldKnowledgeText(value, maximum, label, empty = false) {
  if (typeof value !== 'string' || (!empty && !value.trim()) || value.includes('\0')
      || encoder.encode(value).length > maximum || decoder.decode(encoder.encode(value)) !== value) {
    throw new TypeError(`Invalid knowledge ${label}`);
  }
  return value;
}
export function worldKnowledgeArray(value, maximum, label) {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype || value.length > maximum
      || Reflect.ownKeys(value).length !== value.length + 1
      || Array.from({ length: value.length }, (_, index) => index).some(index => !Object.hasOwn(value, index))) {
    throw new TypeError(`Invalid knowledge ${label} array`);
  }
  return value;
}
export function worldKnowledgeScope(value) {
  if (!['public', 'private'].includes(value?.audience)) throw new TypeError('Knowledge requires an explicit conversation audience');
  return { agentId: agentIdentifier(value.agentId), worldId: worldKnowledgeText(value.worldId, 240, 'world'),
    audience: value.audience, conversationId: worldKnowledgeText(value.conversationId, 160, 'conversation') };
}
export const worldKnowledgeScopeKey = value => JSON.stringify(Object.values(worldKnowledgeScope(value)));
export const worldKnowledgeBytes = value => encoder.encode(JSON.stringify(value)).length;
function timestamp(value, now, label) {
  if (!Number.isSafeInteger(value) || value < 0 || value > now + 60_000) throw new TypeError(`Invalid knowledge ${label} timestamp`);
  return value;
}
function origin(value) {
  worldKnowledgeFields(value, ['sourceAgentId', 'sourceRecordId', 'sourcePeerId'], 'origin');
  return { sourceAgentId: agentIdentifier(value.sourceAgentId), sourceRecordId: agentIdentifier(value.sourceRecordId),
    ...(value.sourcePeerId !== undefined ? { sourcePeerId: worldKnowledgeText(value.sourcePeerId, 160, 'source peer') } : {}) };
}
function evidence(value, scope, now, inherited) {
  worldKnowledgeFields(value, ['episodeId', 'eventId', 'sourceKind', 'when', 'provenance', 'agentId', 'worldId', 'audience', 'conversationId', 'peerId'], 'evidence');
  const attribution = worldKnowledgeScope(value);
  if (!sourceKinds.includes(value.sourceKind) || !['observed', 'shared'].includes(value.provenance)
      || attribution.worldId !== scope.worldId || attribution.audience !== scope.audience
      || attribution.conversationId !== scope.conversationId
      || (value.provenance === 'observed' && attribution.agentId !== scope.agentId)
      || (value.provenance === 'shared' && !inherited)) throw new TypeError('Knowledge evidence scope or provenance mismatch');
  return { ...attribution, episodeId: agentIdentifier(value.episodeId), eventId: worldKnowledgeText(value.eventId, 160, 'event'),
    sourceKind: value.sourceKind, when: timestamp(value.when, now, 'evidence'), provenance: value.provenance,
    ...(value.peerId !== undefined ? { peerId: worldKnowledgeText(value.peerId, 160, 'evidence peer') } : {}) };
}

/** Evidence attribution is structural, not an assertion that reported prose is
 * true. The host must supply actual episodes and authenticate observations. A
 * remembered person's position is historical even while its timestamp is fresh. */
export function normalizeWorldKnowledgeRecord(input, { now = Date.now() } = {}) {
  if (!Number.isSafeInteger(now) || now < 0) throw new TypeError('Invalid knowledge clock');
  worldKnowledgeFields(input, fields);
  const scope = worldKnowledgeScope(input);
  if (!['place', 'person'].includes(input.kind)
      || !(input.kind === 'place' ? input.subjectType === 'place' : ['peer', 'resident'].includes(input.subjectType))) {
    throw new TypeError('Invalid knowledge subject kind');
  }
  if (!Number.isSafeInteger(input.revision) || input.revision < 1) throw new TypeError('Invalid knowledge revision');
  if (!['observed', 'reported', 'inferred', 'shared'].includes(input.confidence)) throw new TypeError('Invalid knowledge confidence');
  const inherited = input.origin === undefined ? undefined : origin(input.origin);
  if (inherited?.sourceAgentId === scope.agentId || (input.confidence === 'shared' && !inherited)) throw new TypeError('Invalid inherited knowledge origin');
  const sources = worldKnowledgeArray(input.evidence, WORLD_KNOWLEDGE_LIMITS.evidence, 'evidence')
    .map(item => evidence(item, scope, now, inherited));
  if (!sources.length) throw new TypeError('Knowledge requires attributed episode evidence');
  if (input.confidence === 'observed' && !sources.some(item => item.provenance === 'observed')) throw new TypeError('Observed knowledge requires local evidence');
  const record = { ...scope, id: agentIdentifier(input.id), revision: input.revision, kind: input.kind,
    subjectType: input.subjectType, subjectId: input.subjectType === 'peer'
      ? worldKnowledgeText(input.subjectId, 160, 'subject ID') : agentIdentifier(input.subjectId),
    label: worldKnowledgeText(input.label, 240, 'label'), note: worldKnowledgeText(input.note ?? '', 1024, 'note', true),
    ...(input.position !== undefined || input.kind === 'place' ? { position: normalizeWorldGoalPosition(input.position) } : {}),
    confidence: input.confidence, ...(input.lastSeenAt !== undefined ? { lastSeenAt: timestamp(input.lastSeenAt, now, 'last seen') } : {}),
    evidence: sources, createdAt: timestamp(input.createdAt, now, 'created'), updatedAt: timestamp(input.updatedAt, now, 'updated'),
    ...(inherited ? { origin: inherited } : {}) };
  if (record.updatedAt < record.createdAt || (record.lastSeenAt !== undefined && record.lastSeenAt > Math.max(...sources.map(item => item.when)))) {
    throw new TypeError('Knowledge timestamp is unsupported by its evidence');
  }
  if (worldKnowledgeBytes(record) > WORLD_KNOWLEDGE_LIMITS.recordBytes) throw new RangeError('Knowledge record exceeds its byte budget');
  return record;
}

/** Recomputed at use time; never persist a claim that an entity is still here. */
export function worldKnowledgeStatus(record, now = Date.now()) {
  if (!Number.isSafeInteger(now) || now < 0) throw new TypeError('Invalid knowledge clock');
  if (record.confidence !== 'observed' || !Number.isSafeInteger(record.lastSeenAt)) return 'unverified';
  const maximum = record.kind === 'person' ? WORLD_KNOWLEDGE_LIMITS.personFreshMs : WORLD_KNOWLEDGE_LIMITS.placeFreshMs;
  return now - record.lastSeenAt > maximum ? 'stale' : 'fresh';
}
