import { agentIdentifier, AGENT_LIMITS } from '../../../peercompute/src/peercompute/agents/AgentContracts.js';
import { residentDiagnosticMessage } from '../../../peercompute/src/peercompute/agents/ResidentDiagnosticsContracts.js';
import { normalizeWorldGoalPlan } from '../../../peercompute/src/peercompute/agents/WorldGoalPlan.js';

const text = (value, maximum = 240) => typeof value === 'string' ? value.replaceAll('\0', '').slice(0, maximum) : '';
const count = value => Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;
const time = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
const point = value => Array.isArray(value) && value.length === 3 && value.every(Number.isFinite) ? [...value] : undefined;
const abort = message => new DOMException(message, 'AbortError');
const failures = new Set(['failed', 'error', 'outcome-unknown']);
const detailNumbers = ['count', 'queueDepth', 'durationMs', 'latencyMs', 'contextBytes', 'contextBudget', 'messageCount',
  'maxNewTokens', 'outputChars', 'attempt', 'nextAt', 'inputTokens', 'requiredTokens', 'contextLength', 'outputTokens',
  'contextTokens', 'reservedOutputTokens', 'removedTurns', 'preflightCalls', 'measurementTokens', 'probeTokenBudget', 'probeOutputTokens'];
function details(value = {}) {
  const result = {};
  for (const key of detailNumbers) if (count(value?.[key])) result[key] = value[key];
  if (text(value?.task, 80)) result.task = text(value.task, 80);
  if ([null, 'owner', 'automatic'].includes(value?.pauseCause)) result.pauseCause = value.pauseCause;
  for (const key of ['committed', 'outputStarted', 'dispatched']) if (typeof value?.[key] === 'boolean') result[key] = value[key];
  return result;
}
function route(value) {
  if (!value || typeof value !== 'object') return undefined;
  const result = {};
  const aliases = { modelLabel: value.modelLabel ?? value.modelName ?? value.name ?? value.modelId ?? value.manifestCid ?? value.manifestCID,
    modelId: value.modelId, manifestCid: value.manifestCid ?? value.manifestCID, runtime: value.runtime, peerId: value.peerId };
  for (const [key, entry] of Object.entries(aliases)) if (text(entry)) result[key] = text(entry);
  if (typeof value.local === 'boolean') { result.local = value.local; result.kind = value.local ? 'local' : 'peer'; }
  if (typeof value.busy === 'boolean') result.busy = value.busy;
  if (count(value.providerCount)) result.providerCount = value.providerCount;
  return Object.keys(result).length ? result : undefined;
}
function state(value) {
  if (typeof value === 'string') return text(value, 160);
  if (!value || typeof value !== 'object') return undefined;
  const result = { status: text(value.status ?? value.appearanceStatus, 80) };
  const reason = value.reason ?? value.error ?? value.appearanceError;
  if (typeof reason === 'string') result.reason = residentDiagnosticMessage(reason);
  if (count(value.nextAt)) result.nextAt = value.nextAt;
  return result;
}
function navigation(value) {
  if (!value || typeof value !== 'object') return null;
  const result = {};
  for (const key of ['key', 'status', 'type', 'targetName', 'targetId', 'backend', 'policyId', 'blockedReason']) {
    if (text(value[key])) result[key] = text(value[key]);
  }
  for (const key of ['distance', 'stopDistance', 'dispatches']) if (count(value[key])) result[key] = value[key];
  if (typeof value.worker === 'boolean') result.worker = value.worker;
  if (value.progress) {
    result.progress = {};
    for (const key of ['distanceTravelled', 'unproductiveSeconds']) if (count(value.progress[key])) result.progress[key] = value.progress[key];
    if (typeof value.progress.targetClear === 'boolean') result.progress.targetClear = value.progress.targetClear;
  }
  return result;
}
function receipt(value) {
  if (!value || typeof value !== 'object') return null;
  const result = {};
  for (const key of ['requestId', 'type', 'status', 'targetId', 'reason']) if (text(value[key], 512)) result[key] = text(value[key], 512);
  if (count(value.at)) result.at = value.at;
  for (const key of ['position', 'targetPosition']) if (point(value[key])) result[key] = point(value[key]);
  return result;
}
function objective(value, agentId, worldId) {
  if (!value || value.agentId !== undefined && value.agentId !== agentId || value.worldId !== undefined && value.worldId !== worldId) return null;
  const result = { revision: value.revision };
  for (const key of ['goalId', 'status', 'objective', 'currentStep', 'reason', 'modelAssessment', 'pauseSource']) {
    if (text(value[key], 1024)) result[key] = text(value[key], 1024);
  }
  if (value.lastReceipt) result.lastReceipt = receipt(value.lastReceipt);
  if (value.plan) {
    try { result.plan = normalizeWorldGoalPlan(value.plan); } catch { result.plan = null; }
    result.completedMilestones = Array.isArray(value.completedMilestones) ? value.completedMilestones.slice(0, 6)
      .map(item => ({ index: item?.index, requestId: text(item?.requestId, 128) })) : [];
    result.receipts = Array.isArray(value.receipts) ? value.receipts.slice(-16).map(receipt).filter(Boolean) : [];
  }
  return result;
}
function diagnostic(value, agentId, worldId) {
  if (!value || value.agentId !== agentId || value.worldId !== worldId) return null;
  return { id: text(value.id, 160), when: time(value.lastWhen ?? value.when), source: text(value.source, 80), stage: text(value.stage, 80),
    status: text(value.status, 80), severity: ['debug', 'info', 'warning', 'error'].includes(value.severity) ? value.severity : 'info',
    message: residentDiagnosticMessage(value.message), code: text(value.errorCode ?? value.code, 128),
    operationId: text(value.operationId, 160), messageId: text(value.messageId, 160), route: route(value.route),
    details: details(value.details), repeatCount: count(value.repeatCount) ? value.repeatCount : 1 };
}
function savedEvent(value, agentId, sources) {
  if (!value || value.agentId !== undefined && value.agentId !== agentId) return null;
  const labels = { request: 'Inference request dispatched.', result: 'Inference completed.', edited: 'Resident profile changed.',
    paused: 'Resident paused by its owner.', resumed: 'Resident resumed by its owner.', recovered: 'Resident recovered automatically.',
    cancelled: 'Inference cancelled.', 'stale-discarded': 'Unsent stale changes discarded.' };
  if (!Object.hasOwn(labels, value.type) && !failures.has(value.type) && value.type !== 'waiting') return null;
  const error = failures.has(value.type), waiting = value.type === 'waiting';
  return { id: `agent-event:${agentId}:${value.sequence}`, when: time(value.at),
    source: sources.get(value.operationId) ?? 'agent-runtime', stage: ['request', 'result'].includes(value.type) ? 'inference' : 'lifecycle',
    status: value.type, severity: error ? 'error' : waiting ? 'warning' : 'info',
    message: error || waiting ? residentDiagnosticMessage(value.text || 'Inference failed without an error description.') : labels[value.type],
    code: text(value.errorCode ?? value.code, 128), operationId: text(value.operationId ?? value.requestId, 160),
    route: route(value.route), details: details({ ...value, ...value.contextBudget }) };
}
function profile(head, binding) {
  const result = { name: text(head.identity?.name), instructions: text(head.identity?.instructions, 16384),
    summary: text(head.context?.summary, 24576), goals: Array.isArray(head.goals) ? head.goals.slice(0, 16).map(value => text(value, 4096)) : [],
    appearancePrompt: text(binding.appearancePrompt, 2048), movement: binding.movement ?? 'self-directed',
    localOnly: head.policy?.inferenceMode === 'local-only', autonomous: binding.autonomous !== false };
  for (const key of ['shared', 'respondToWorldChat', 'initiateConversations', 'allowCloning', 'shareMemories', 'sharePrivateMemories', 'selfModifiable']) result[key] = binding[key] === true;
  if (binding.standingGoal) result.standingGoal = { id: text(binding.standingGoal.id, 80), enabled: binding.standingGoal.enabled === true,
    target: binding.standingGoal.target, objective: text(binding.standingGoal.objective, 2048) };
  return result;
}

/** Read-only projection for the resident inspector. Inference discovery is a
 * cached view; no refresh, generation, model loading, public publication or
 * conversation writes occur here. Ownership is fenced around every await. */
export function createWorldResidentInspector({ worldId, getBody, owns, getAgent, getEvents, getKnowledge,
  getObjective, getRuntime, getDiagnostics, getStates, getNavigation, isClosed = () => false,
  canMemory = () => typeof getKnowledge === 'function', canGoals = () => typeof getObjective === 'function' } = {}) {
  if (!text(worldId) || [getBody, owns, getAgent].some(callback => typeof callback !== 'function')) throw new TypeError('Resident inspector requires world and owner read callbacks');
  const lifetime = new AbortController();
  function bodyFor(key, signal) {
    signal.throwIfAborted(); if (isClosed()) throw abort('World agents are closed');
    const body = getBody(key);
    if (!body || body.key !== key || body.worldId !== undefined && body.worldId !== worldId) throw abort('This resident is no longer in this world');
    agentIdentifier(body.agentId); return body;
  }
  const publicView = body => ({ key: body.key, agentId: body.agentId, name: text(body.name), local: false, worldId,
    ownerPeerId: text(body.ownerPeerId, 160), status: text(body.status, 80), ...(point(body.position) ? { position: point(body.position) } : {}),
    activity: [],
    permissions: { edit: false, memory: false, goals: false, resume: false, appearance: false, remove: false,
      clone: body.local !== true && body.cloneable === true } });
  async function read({ key, signal } = {}) {
    if (!text(key, 300)) throw new TypeError('Resident inspector requires a body key');
    const activeSignal = AbortSignal.any([lifetime.signal, ...(signal ? [signal] : [])]);
    const original = bodyFor(key, activeSignal), ownerPeerId = original.ownerPeerId, agentId = original.agentId;
    if (original.local !== true || owns(agentId) !== true) return publicView(original);
    function fence() {
      const current = bodyFor(key, activeSignal);
      if (current.agentId !== agentId || current.ownerPeerId !== ownerPeerId || current.local !== true || owns(agentId) !== true) {
        throw abort('Resident ownership changed while reading the inspector');
      }
      return current;
    }
    async function checked(callback) { fence(); const value = await callback(); fence(); return value; }
    const warnings = [];
    async function optional(stage, callback, fallback) {
      if (!callback) return fallback;
      try { return await checked(callback); }
      catch (error) {
        fence(); warnings.push({ id: `inspector-read:${stage}`, when: Date.now(), source: 'inspector', stage, status: 'unavailable',
          severity: 'warning', message: residentDiagnosticMessage(`${stage} unavailable: ${error?.message ?? error}`) }); return fallback;
      }
    }
    const head = structuredClone(await checked(() => getAgent(agentId)));
    const binding = head?.embodiments?.find(value => value.worldId === worldId);
    if (head?.agentId !== agentId || !binding || !Number.isSafeInteger(head.revision)) throw abort('Resident body or saved identity changed');
    async function eventTail() {
      const result = []; let after;
      while (result.length < AGENT_LIMITS.events) {
        const page = await checked(() => getEvents(agentId, { after, limit: 100, signal: activeSignal }));
        if (!Array.isArray(page) || page.length > 100) throw new Error('Invalid resident event page');
        if (!page.length) break;
        let cursor = after ?? 0;
        for (const entry of page) {
          if (!Number.isSafeInteger(entry?.sequence) || entry.sequence <= cursor) throw new Error('Resident event cursor did not advance');
          cursor = entry.sequence;
        }
        result.push(...page.slice(0, AGENT_LIMITS.events - result.length)); after = cursor;
        if (page.length < 100) break;
      }
      return result;
    }
    const [events, facts, goal, states, nav, diagnosticsStore, runtime] = await Promise.all([
      optional('history', getEvents && eventTail, []),
      optional('memory', getKnowledge && (() => getKnowledge({ key, signal: activeSignal })), null),
      optional('objective', getObjective && (() => getObjective(key)), null),
      optional('states', getStates && (() => getStates(key)), {}),
      optional('navigation', getNavigation && (() => getNavigation(key)), null),
      optional('diagnostics', getDiagnostics, null), optional('routing', getRuntime, null)
    ]);
    const [journal, cached] = await Promise.all([
      optional('diagnostics', diagnosticsStore?.list && (() => diagnosticsStore.list({ agentId, worldId }, { limit: 192, signal: activeSignal })), []),
      optional('routing', runtime?.listInferenceTargets && (() => runtime.listInferenceTargets()), [])
    ]);
    const journalRows = (Array.isArray(journal) ? journal : []).slice(0, 192).map(value => diagnostic(value, agentId, worldId)).filter(Boolean);
    const sources = new Map(journalRows.filter(value => value.operationId).map(value => [value.operationId, value.source]));
    const historyRows = events.filter(value => value.worldId === undefined || value.worldId === worldId)
      .map(value => savedEvent(value, agentId, sources)).filter(Boolean);
    const activity = [...historyRows, ...journalRows];
    let diagnosticsStatus = null;
    if (diagnosticsStore?.status) {
      const status = await optional('diagnostics', () => diagnosticsStore.status(), null);
      if (status) {
        diagnosticsStatus = { persistent: status.persistent === true, open: status.open === true,
          pending: count(status.pending) ? status.pending : 0, dropped: count(status.dropped) ? status.dropped : 0,
          evicted: count(status.evicted) ? status.evicted : 0 };
        if (status.lastError) {
          diagnosticsStatus.lastError = { when: time(status.lastError.when), operation: text(status.lastError.operation, 80),
            code: text(status.lastError.code, 128), message: residentDiagnosticMessage(status.lastError.message) };
          warnings.push({ id: `diagnostics-storage:${diagnosticsStatus.lastError.when}`, when: diagnosticsStatus.lastError.when,
            source: 'storage', stage: 'diagnostics', status: 'unavailable', severity: 'warning',
            message: `Diagnostic storage: ${diagnosticsStatus.lastError.message}`, code: diagnosticsStatus.lastError.code });
        }
      }
    }
    // Recheck binding after storage reads, but keep the captured profile's
    // revision. A newer revision must not authorize a stale draft's CAS write.
    const currentHead = await checked(() => getAgent(agentId));
    if (currentHead?.agentId !== agentId || !currentHead.embodiments?.some(value => value.worldId === worldId)
        || head.authority?.hostId !== currentHead.authority?.hostId) throw abort('Resident body ownership changed');
    const current = fence(), view = { ...publicView(current), local: true, name: text(head.identity?.name) || text(current.name), revision: head.revision,
      profile: profile(head, binding), objective: objective(goal, agentId, worldId), navigation: navigation(nav), diagnosticsStatus };
    const lastFailure = activity.filter(value => value.severity === 'error' || failures.has(value.status)).sort((a, b) => b.when - a.when)[0];
    const lastActual = activity.filter(value => ['result', 'completed'].includes(value.status) && value.route)
      .sort((a, b) => b.when - a.when)[0];
    view.runtime = { status: text(head.status, 80), activity: state(head.activity), pauseCause: head.pauseCause ?? null,
      recoveryRequired: head.recoveryRequired === true || head.activity?.unsaved === true };
    for (const name of ['worldChat', 'ooda', 'social', 'standing', 'profile', 'appearance']) view.runtime[name] = state(states?.[name]);
    if (lastFailure) { view.runtime.lastFailure = structuredClone(lastFailure); view.runtime.error = `Last failure: ${lastFailure.message}`; }
    if (head.activity?.error) {
      view.runtime.currentIssue = residentDiagnosticMessage(head.activity.error);
      if (view.runtime.currentIssue !== lastFailure?.message) view.runtime.error = `Current runtime issue: ${view.runtime.currentIssue}`
        + (lastFailure ? ` · Last failure: ${lastFailure.message}` : '');
    }
    view.routing = { mode: head.policy?.inferenceMode === 'local-only' ? 'local-only' : 'network-assisted',
      lastRoute: lastActual?.route ?? null, lastModelLabel: lastActual?.route.modelLabel ?? '',
      candidates: (Array.isArray(cached) ? cached : []).filter(value => value?.available === true
        && (head.policy?.inferenceMode !== 'local-only' || value.local === true)).slice(0, 24).map(route).filter(Boolean) };
    if (Array.isArray(facts)) {
      const scoped = facts.filter(value => value && (value.agentId === undefined || value.agentId === agentId)
        && (value.worldId === undefined || value.worldId === worldId));
      view.memorySummary = { places: scoped.filter(value => value.kind === 'place').length,
        people: scoped.filter(value => value.kind === 'person').length, total: scoped.length };
    }
    view.activity = [...activity, ...warnings].sort((a, b) => a.when - b.when || a.id.localeCompare(b.id)).slice(-100);
    view.permissions = { edit: true, memory: canMemory() === true, goals: canGoals() === true,
      resume: head.status === 'paused' || view.runtime.recoveryRequired, appearance: true, remove: true, clone: true };
    fence(); return view;
  }
  return { read, dispose() { lifetime.abort(abort('Resident inspector closed')); } };
}
