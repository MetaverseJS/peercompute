import { agentIdentifier } from './AgentContracts.js';

export const RESIDENT_DIAGNOSTICS_LIMITS = Object.freeze({ perResident: 192, entries: 2048,
  bytes: 2 * 1024 * 1024, rowBytes: 4096, pending: 64, messageBytes: 512, dedupeMs: 10000 });
const encoder = new TextEncoder();
const numericDetails = ['count', 'queueDepth', 'durationMs', 'latencyMs', 'contextBytes', 'contextBudget',
  'messageCount', 'maxNewTokens', 'outputChars', 'attempt', 'nextAt', 'inputTokens', 'requiredTokens',
  'contextLength', 'outputTokens'];
const plain = value => value && [Object.prototype, null].includes(Object.getPrototypeOf(value));
function text(value, maximum, label) {
  if (typeof value !== 'string' || value.includes('\0') || encoder.encode(value).length > maximum) {
    throw new TypeError(`Invalid resident diagnostic ${label}`);
  }
  return value;
}
function tag(value, label) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9._:-]{0,63}$/i.test(value)) throw new TypeError(`Invalid resident diagnostic ${label}`);
  return value;
}
export function residentDiagnosticScope(input) {
  if (!plain(input)) throw new TypeError('Invalid resident diagnostic scope');
  const worldId = text(input.worldId, 240, 'world');
  if (!worldId.trim()) throw new TypeError('Invalid resident diagnostic world');
  return { agentId: agentIdentifier(input.agentId), worldId };
}
export function residentDiagnosticScopeKey(input) {
  const scope = residentDiagnosticScope(input); return JSON.stringify([scope.agentId, scope.worldId]);
}
/** Error sentences may contain signed URLs. Retain the endpoint, never its
 * credentials, query or fragment. Callers supply messages, not prompt/output. */
export function residentDiagnosticMessage(value) {
  let result = String(value ?? '').replaceAll('\0', '').replace(/https?:\/\/[^\s<>"']+/gi, raw => {
    try { const url = new URL(raw); return `${url.origin}${url.pathname}`; } catch { return '[URL]'; }
  }).slice(0, RESIDENT_DIAGNOSTICS_LIMITS.messageBytes);
  while (encoder.encode(result).length > RESIDENT_DIAGNOSTICS_LIMITS.messageBytes) result = result.slice(0, -1);
  return result;
}
export function residentDiagnosticBytes(value) { return encoder.encode(JSON.stringify(value)).length; }

/** Deliberately project fields: no raw events, prompts, outputs, tensors,
 * attachments, arbitrary metadata, or agent heads can enter this journal. */
export function normalizeResidentDiagnostic(input, { when, id = crypto.randomUUID() } = {}) {
  if (!plain(input)) throw new TypeError('Invalid resident diagnostic');
  if (!Number.isSafeInteger(when) || when < 0) throw new TypeError('Invalid resident diagnostic time');
  const result = { id: agentIdentifier(id), ...residentDiagnosticScope(input), when, lastWhen: when, repeatCount: 1,
    source: tag(input.source, 'source'), stage: tag(input.stage, 'stage'), status: tag(input.status, 'status'),
    severity: input.severity ?? 'info' };
  if (!['debug', 'info', 'warning', 'error'].includes(result.severity)) throw new TypeError('Invalid resident diagnostic severity');
  if (input.message !== undefined) {
    if (typeof input.message !== 'string') throw new TypeError('Invalid resident diagnostic message');
    result.message = residentDiagnosticMessage(input.message);
  }
  for (const key of ['operationId', 'messageId']) if (input[key] !== undefined) result[key] = text(input[key], 160, key);
  if (input.errorCode !== undefined) result.errorCode = tag(input.errorCode, 'error code');
  if (input.route !== undefined) {
    if (!plain(input.route)) throw new TypeError('Invalid resident diagnostic route');
    const route = {};
    for (const key of ['modelLabel', 'modelId', 'runtime', 'peerId']) {
      if (input.route[key] !== undefined) route[key] = text(input.route[key], key === 'modelLabel' ? 240 : 200, key);
    }
    const cid = input.route.manifestCid ?? input.route.manifestCID;
    if (cid !== undefined) route.manifestCid = text(cid, 160, 'manifest CID');
    if (input.route.local !== undefined) {
      if (typeof input.route.local !== 'boolean') throw new TypeError('Invalid resident diagnostic route locality');
      route.local = input.route.local;
    }
    result.route = route;
  }
  if (input.details !== undefined) {
    if (!plain(input.details)) throw new TypeError('Invalid resident diagnostic details');
    const details = {};
    for (const key of numericDetails) if (input.details[key] !== undefined) {
      const value = input.details[key];
      if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > Number.MAX_SAFE_INTEGER) {
        throw new TypeError(`Invalid resident diagnostic ${key}`);
      }
      details[key] = value;
    }
    if (input.details.task !== undefined) details.task = tag(input.details.task, 'task');
    if (input.details.pauseCause !== undefined) {
      if (![null, 'owner', 'automatic'].includes(input.details.pauseCause)) throw new TypeError('Invalid resident diagnostic pause cause');
      details.pauseCause = input.details.pauseCause;
    }
    for (const key of ['committed', 'outputStarted']) if (input.details[key] !== undefined) {
      if (typeof input.details[key] !== 'boolean') throw new TypeError(`Invalid resident diagnostic ${key}`);
      details[key] = input.details[key];
    }
    result.details = details;
  }
  if (residentDiagnosticBytes(result) > RESIDENT_DIAGNOSTICS_LIMITS.rowBytes) throw new RangeError('Resident diagnostic exceeds its byte limit');
  return result;
}
export function residentDiagnosticSignature(row) {
  const { id, when, lastWhen, repeatCount, ...content } = row; return JSON.stringify(content);
}
