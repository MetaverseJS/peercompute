import { generateWorldIntentDecision } from './WorldIntentDecision.js';

const aborted = reason => new DOMException(reason, 'AbortError');
const changed = () => new Error('The resident or conversation changed before the action could start.');
const annotation = error => `\n[Action not started: ${String(error?.message || 'The action decision failed.').replaceAll('\0', '').slice(0, 240)}]`;

/** A human turn has one durable speech operation. Physical selection is a
 * separate, cancellable proposal and never contributes an assistant history row.
 * Replacing a pending proposal does not cancel an already applied body intent. */
export function createWorldConversationTurns({ agents, experience, signal: parentSignal,
  decideIntent = generateWorldIntentDecision } = {}) {
  if (!agents?.run || !agents?.get) throw new TypeError('An agent controller is required');
  const lifetime = new AbortController(), active = new Map(), pending = new Set();
  const current = entry => !lifetime.signal.aborted && active.get(entry.key) === entry;
  const unsubscribe = agents.subscribe?.(event => {
    for (const entry of active.values()) {
      if (entry.agentId !== event.agentId || entry.phase !== 'decision') continue;
      if (event.type === 'removed' || (event.type === 'changed' && event.head?.revision !== entry.revision)
          || (event.type === 'activity' && (event.activity?.status === 'paused' || event.activity?.unsaved))) {
        entry.decision.abort(changed());
      }
    }
  });
  async function headFor(entry) {
    entry.signal.throwIfAborted();
    if (!current(entry)) throw changed();
    const head = await agents.get(entry.agentId);
    entry.signal.throwIfAborted();
    if (!current(entry) || !head || head.status === 'paused' || head.recoveryRequired || head.activity?.unsaved
        || (entry.revision !== undefined && head.revision !== entry.revision) || !entry.valid(head)) throw changed();
    return head;
  }
  async function execute(entry, previous) {
    // A replaced decision keeps its inference resources until cleanup settles.
    // Do not dispatch the next speech request on that model before then.
    if (previous) await previous.promise.catch(() => {});
    await headFor(entry);
    const { turn, prompt, conversationId, worldContext, taskInstructions, maxNewTokens, agentId } = entry;
    const outcome = await agents.run(agentId, { task: 'text-generation', prompt, conversationId, worldContext,
      ...(taskInstructions ? { taskInstructions } : {}),
      ...(turn?.legacyHistorySuffix ? { legacyHistorySuffix: turn.legacyHistorySuffix } : {}),
      ...(turn?.contextHistory ? { contextHistory: turn.contextHistory } : {}),
      maxNewTokens, signal: entry.signal });
    const text = outcome.result?.text;
    if (typeof text !== 'string') throw new TypeError('Invalid resident speech');
    const result = { text, finishReason: outcome.result.finishReason ?? 'stop', applied: false };
    entry.revision = outcome.head.revision;
    entry.phase = 'decision';
    entry.signal.throwIfAborted();
    if (!turn || !experience) return result;
    try {
      await headFor(entry);
      // Literal JSON from conversational inference is still speech, never an
      // action. The independently validated second response owns that authority.
      await experience.rememberReply(turn, text, { valid: () => current(entry) && !entry.decision.signal.aborted });
      const head = await headFor(entry);
      entry.decision.signal.throwIfAborted();
      const observed = experience.observe(entry.key, turn.speaker.peerId);
      if (turn.senses.self.intentRevision !== undefined && observed.self.intentRevision !== turn.senses.self.intentRevision) {
        throw new Error('A newer movement command superseded this intention.');
      }
      // A resident speaker and its hosting human are different requesters.
      if (observed.participants.some(item => item.id === turn.senses.requesterId)) observed.requesterId = turn.senses.requesterId;
      else delete observed.requesterId;
      const decisionSignal = AbortSignal.any([entry.signal, entry.decision.signal]);
      const decision = await decideIntent({ inference: agents.inference, head, message: entry.message,
        observed, signal: decisionSignal });
      await headFor(entry);
      decisionSignal.throwIfAborted();
      if (!decision || !Object.hasOwn(decision, 'intent')) throw new Error('The model returned no valid action decision.');
      if (decision.intent === null) return result;
      const action = await experience.applyIntent({ ...turn, senses: observed, signal: decisionSignal }, decision.intent,
        { valid: () => current(entry) && !decisionSignal.aborted, requestId: crypto.randomUUID() });
      return { ...result, ...action };
    } catch (error) {
      // Explicit caller cancellation still cancels the request. Supersession or
      // an invalid/unavailable action preserves the already journaled speech.
      entry.signal.throwIfAborted();
      return { ...result, text: text + annotation(error) };
    }
  }
  function run({ key, agentId, turn, prompt, message = prompt, conversationId, worldContext, taskInstructions,
    maxNewTokens = 512, signal, valid = () => true } = {}) {
    const combined = AbortSignal.any([lifetime.signal, ...(parentSignal ? [parentSignal] : []), ...(signal ? [signal] : [])]);
    combined.throwIfAborted();
    const previous = active.get(key);
    if (previous?.phase === 'speech') return Promise.reject(Object.assign(new Error('This resident is already replying.'), { code: 'ERR_AGENT_BUSY' }));
    previous?.decision.abort(aborted('A newer message superseded this pending action.'));
    const entry = { key, agentId, turn, prompt, message, conversationId, worldContext, taskInstructions, maxNewTokens, valid,
      signal: combined, phase: 'speech', decision: new AbortController() };
    active.set(key, entry);
    entry.promise = execute(entry, previous).finally(() => {
      if (active.get(key) === entry) active.delete(key);
      pending.delete(entry.promise);
    });
    pending.add(entry.promise);
    return entry.promise;
  }
  async function cancelPending(reason = 'The pending action was cancelled.') {
    const entries = [...active.values()];
    // Owner controls also revoke future decisions for visitor speech and a
    // replacement awaiting old inference cleanup. Those requests have their
    // own caller signals, so aborting only the owner's operation misses them.
    for (const entry of entries) entry.decision.abort(aborted(reason));
    const decisions = entries.filter(entry => entry.phase === 'decision');
    await Promise.allSettled(decisions.map(entry => entry.promise));
  }
  return { run, cancelPending,
    async dispose() {
      lifetime.abort(aborted('World conversations closed.')); unsubscribe?.();
      await Promise.allSettled([...pending]); active.clear();
    } };
}
