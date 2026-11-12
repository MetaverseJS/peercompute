import { normalizeAgentEmbodiments } from './WorldAgentContracts.js';

export const AGENT_SCHEMA = 'peercompute.agent.v1';
export const AGENT_EXPORT_SCHEMA = 'peercompute.agent.export.v1';
export const AGENT_LIMITS = Object.freeze({ headBytes: 64 * 1024, eventBytes: 128 * 1024,
  operationBytes: 16 * 1024, events: 256, historyBytes: 8 * 1024 * 1024,
  operations: 256, attachmentBytes: 4 * 1024 * 1024, attachmentCount: 64,
  attachmentTotalBytes: 64 * 1024 * 1024, exportBytes: 12 * 1024 * 1024 });
const statuses = new Set(['paused', 'running', 'waiting', 'completed', 'error']);
const pauseCauses = new Set(['owner', 'automatic']);
export const AGENT_OPERATION_STATUSES = Object.freeze(['prepared', 'dispatched', 'completed', 'failed', 'cancelled', 'outcome-unknown']);
export const activeAgentOperation = (operation) => ['prepared', 'dispatched'].includes(operation?.status);
const encoder = new TextEncoder();
export function agentError(code, message) { return Object.assign(new Error(message), { code }); }
export function agentIdentifier(value, label = 'identifier') {
  if (typeof value !== 'string' || !/^[A-Za-z0-9._:-]{1,128}$/.test(value)) throw new TypeError(`Invalid agent ${label}`);
  return value;
}
export function boundedAgentJson(value, maximum, label = 'data') {
  let count = 0;
  function check(item, depth) {
    if (++count > 20000 || depth > 16) throw new RangeError(`Agent ${label} is too complex`);
    if (item === null || typeof item === 'string' || typeof item === 'boolean') return;
    if (typeof item === 'number' && Number.isFinite(item)) return;
    if (!item || typeof item !== 'object' || (!Array.isArray(item)
        && ![Object.prototype, null].includes(Object.getPrototypeOf(item)))) throw new TypeError(`Invalid agent ${label}`);
    for (const [key, entry] of Object.entries(item)) {
      if (['__proto__', 'prototype', 'constructor'].includes(key)) throw new TypeError(`Invalid agent ${label} key`);
      check(entry, depth + 1);
    }
  }
  check(value, 0);
  const json = JSON.stringify(value);
  const bytes = encoder.encode(json).byteLength;
  if (bytes > maximum) throw new RangeError(`Agent ${label} exceeds its byte budget`);
  return { value: JSON.parse(json), bytes };
}
function text(value, maximum, label) {
  if (typeof value !== 'string' || value.includes('\0') || encoder.encode(value).byteLength > maximum) {
    throw new TypeError(`Invalid agent ${label}`);
  }
  return value;
}
export function normalizeAgentInput(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Invalid agent input');
  const name = text(input.name ?? '', 240, 'name').trim();
  if (!name) throw new TypeError('Agent name is required');
  const goals = input.goals ?? [];
  if (!Array.isArray(goals) || goals.length > 16) throw new TypeError('Invalid agent goals');
  const inferenceMode = input.inferenceMode ?? 'local-only';
  if (!['local-only', 'network-assisted'].includes(inferenceMode)) throw new TypeError('Invalid agent inference mode');
  return { identity: { name, instructions: text(input.instructions ?? '', 16 * 1024, 'instructions') },
    goals: goals.map((goal) => text(goal, 4096, 'goal').trim()).filter(Boolean),
    context: { summary: text(input.summary ?? '', 24 * 1024, 'summary') }, policy: { inferenceMode },
    ...(input.embodiments !== undefined ? { embodiments: normalizeAgentEmbodiments(input.embodiments) } : {}) };
}
export function normalizeAgentOperation(input) {
  const { value } = boundedAgentJson(input, AGENT_LIMITS.operationBytes, 'operation');
  if (!value || Array.isArray(value)) throw new TypeError('Invalid agent operation');
  agentIdentifier(value.id, 'operation ID');
  if (!AGENT_OPERATION_STATUSES.includes(value.status)) throw new TypeError('Invalid agent operation status');
  return value;
}
export function normalizeAgentRecord(input) {
  if (!input || input.schema !== AGENT_SCHEMA || input.agentKind !== 'general') throw new TypeError('Unsupported agent schema or kind');
  const fields = normalizeAgentInput({ name: input.identity?.name, instructions: input.identity?.instructions,
    goals: input.goals, summary: input.context?.summary, inferenceMode: input.policy?.inferenceMode, embodiments: input.embodiments });
  agentIdentifier(input.agentId, 'ID');
  if (input.authority?.kind !== 'local' || input.authority.epoch !== 0) throw new TypeError('Portable agent authority is not supported');
  agentIdentifier(input.authority.hostId, 'local host ID');
  if (!Number.isSafeInteger(input.revision) || input.revision < 1 || !statuses.has(input.status)) throw new TypeError('Invalid agent revision or status');
  for (const key of ['createdAt', 'updatedAt']) if (!Number.isSafeInteger(input[key]) || input[key] < 0) throw new TypeError('Invalid agent timestamp');
  const pendingOperation = input.pendingOperation == null ? null : normalizeAgentOperation(input.pendingOperation);
  if (pendingOperation && !activeAgentOperation(pendingOperation)) throw new TypeError('Only active operations may be pending');
  if (input.pauseCause != null && !pauseCauses.has(input.pauseCause)) throw new TypeError('Invalid agent pause cause');
  // Old paused records do not prove an automatic failure. Keep them under owner
  // control; active work interrupted by reload is reconciled by the runtime.
  const pauseCause = input.status === 'paused' ? input.pauseCause ?? 'owner' : null;
  const record = { schema: AGENT_SCHEMA, agentId: input.agentId, agentKind: 'general', ...fields,
    authority: { kind: 'local', hostId: input.authority.hostId, epoch: 0 }, revision: input.revision,
    status: input.status, pauseCause, createdAt: input.createdAt, updatedAt: input.updatedAt, pendingOperation };
  return boundedAgentJson(record, AGENT_LIMITS.headBytes, 'head').value;
}
export function normalizeAgentEvent(input) {
  const result = boundedAgentJson(input, AGENT_LIMITS.eventBytes, 'event');
  if (!result.value || Array.isArray(result.value)) throw new TypeError('Invalid agent event');
  const ids = result.value.attachmentIds;
  if (ids !== undefined && (!Array.isArray(ids) || ids.length > 4 || new Set(ids).size !== ids.length)) throw new TypeError('Invalid agent attachment references');
  ids?.forEach((id) => agentIdentifier(id, 'attachment ID'));
  return result.value;
}
export function normalizeAgentAttachment(input) {
  agentIdentifier(input?.id, 'attachment ID');
  if (!Number.isSafeInteger(input.width) || !Number.isSafeInteger(input.height)
      || input.width < 1 || input.height < 1 || input.width > 1024 || input.height > 1024
      || input.channels !== 4 || !(input.data instanceof Uint8Array)
      || input.data.byteLength !== input.width * input.height * 4
      || input.data.byteLength > AGENT_LIMITS.attachmentBytes) throw new TypeError('Invalid bounded RGBA agent attachment');
  return { id: input.id, width: input.width, height: input.height, channels: 4, data: input.data.slice() };
}
