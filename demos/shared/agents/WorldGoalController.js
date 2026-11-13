import { validateWorldIntent } from './WorldIntent.js';
import { parseWorldGoalDecision } from './WorldGoalDecision.js';
import { activeWorldGoalMilestone, normalizeWorldGoalPosition, worldGoalMilestoneMatchesAction } from '../../../peercompute/src/peercompute/agents/WorldGoalPlan.js';
import { classifyInferenceAvailability } from '../../../peercompute/src/peercompute/inference/InferenceAvailability.js';
import { residentRecoveryDelay } from './WorldOodaLoop.js';

const clone = value => value == null ? value : structuredClone(value);
const terminal = goal => !goal || ['completed', 'cancelled'].includes(goal.status);
const failure = (message, code = 'ERR_WORLD_GOAL') => Object.assign(new Error(message), { code });
const cancelled = reason => new DOMException(reason, 'AbortError');
const pointAuthority = goal => {
  const intent = activeWorldGoalMilestone(goal)?.intent;
  return intent?.type === 'move-to' ? { authorizedPositions: [intent.position] } : {};
};
function brief(value, maximum = 240) {
  let text = '';
  for (const character of String(value ?? '').replaceAll('\0', '')) {
    if (new TextEncoder().encode(text + character).length > maximum) break;
    text += character;
  }
  return text;
}

// Keep the scheduler's existing bounded trace contract while retaining the
// actual readiness evidence. A legacy bare wait cannot establish why no model
// was selected, and a swallowed discovery error must not be guessed here.
function availabilityWait(value, status) {
  const classified = classifyInferenceAvailability(value);
  const availability = { kind: classified?.kind ?? (status === 'busy' ? 'busy' : 'unknown'),
    ...(classified ? { code: classified.code } : {}), message: brief(classified?.message) };
  const label = { busy: 'Waiting for model capacity.', recovering: 'Waiting for model recovery.',
    'model-unavailable': 'Waiting for a compatible loaded model.', unknown: 'Waiting for model availability.' }[availability.kind];
  const reason = brief([label, availability.message].filter(Boolean).join(' '), 480);
  // JSON escaping can expand a short error message beyond the trace byte cap.
  while (new TextEncoder().encode(JSON.stringify(availability)).length > 512) {
    availability.message = Array.from(availability.message).slice(0, -1).join('');
  }
  return { reason, text: JSON.stringify(availability) };
}

/** Bounded, receipt-driven owner objectives. Scheduling supplies opportunities;
 * the model chooses actions and the physical adapter establishes their outcomes.
 * Storage, inference, body authority and GPU workers are injected and borrowed. */
export function createWorldGoalController({ store, worldId, observe, decide, dispatch, stop, owns,
  canRun = () => true, onChange = () => {}, now = Date.now,
  setTimer = setTimeout, clearTimer = clearTimeout, tickMs = 1000, decisionTimeoutMs = 60000,
  autoRecovery = false, random = Math.random } = {}) {
  if (!store?.get || !store?.list || !store?.assign || !store?.commit
      || ![observe, decide, dispatch, stop, owns, canRun, onChange, now, setTimer, clearTimer, random].every(fn => typeof fn === 'function')
      || typeof autoRecovery !== 'boolean'
      || typeof worldId !== 'string' || !worldId || !Number.isSafeInteger(tickMs) || tickMs < 100
      || tickMs > 30000 || !Number.isSafeInteger(decisionTimeoutMs) || decisionTimeoutMs < 1 || decisionTimeoutMs > 60000) {
    throw new TypeError('Objective controller requires bounded storage, model and physical adapters');
  }
  const heads = new Map(), queues = new Map(), controls = new Set(), controlCounts = new Map(), settling = new Map(), unresolved = new Map(), expedited = new Set();
  let active, timer, closed = false, disposal, ticking, syncing, quietUntil = 0;
  const scope = agentId => ({ agentId, worldId });
  const owned = agentId => owns(scope(agentId)) === true;
  const assertOwned = agentId => { if (!owned(agentId)) throw failure('This host does not own the resident body', 'ERR_WORLD_GOAL_OWNERSHIP'); };
  const time = () => { const value = now(); if (!Number.isSafeInteger(value) || value < 0) throw new Error('Invalid objective clock'); return value; };
  const snapshot = goal => goal && unresolved.has(goal.agentId) ? { ...clone(goal), status: 'paused', recoveryRequired: true,
    pauseSource: goal.pauseSource === 'owner' || unresolved.get(goal.agentId).ownerHeld ? 'owner' : 'uncertain',
    nextDecisionAt: goal.pauseSource === 'owner' || unresolved.get(goal.agentId).ownerHeld ? null : unresolved.get(goal.agentId).retryAt ?? null,
    reason: autoRecovery && goal.pauseSource !== 'owner' && !unresolved.get(goal.agentId).ownerHeld
      ? 'Objective state or cleanup was not acknowledged. Automatic recovery will retry cleanup before any new action.'
      : 'Objective state or cleanup was not acknowledged. Owner Resume must reconcile it.' } : clone(goal);
  const notify = goal => {
    if (!goal || !owned(goal.agentId)) return goal;
    if (terminal(goal)) expedited.delete(goal.goalId);
    heads.set(goal.agentId, clone(goal));
    try { Promise.resolve(onChange(snapshot(goal))).catch(() => {}); } catch { /* Display is observational. */ }
    return goal;
  };
  const read = async (agentId, signal) => { signal?.throwIfAborted(); assertOwned(agentId);
    const goal = await store.get(scope(agentId), { signal }); signal?.throwIfAborted(); assertOwned(agentId); return notify(goal); };
  const commit = async (goal, patch, event, signal) => {
    signal?.throwIfAborted();
    assertOwned(goal.agentId);
    if (patch.status === 'paused') {
      const source = patch.pauseSource ?? ({ 'model-paused': 'model', 'budget-exhausted': 'system',
        'outcome-unknown': 'uncertain', 'physical-receipt': 'uncertain', 'dispatch-interrupted': 'uncertain',
        restored: 'uncertain', 'planning-failed': 'system', 'step-settled': 'system' }[event?.type] ?? 'owner');
      const automatic = autoRecovery && source !== 'owner';
      const state = goal.recovery ?? (automatic ? { windowIndex: 0, windowStartedAt: time(), stepBase: patch.steps ?? goal.steps, retryAt: null } : null);
      const retryScheduledAt = automatic ? time() : null;
      const retryAt = automatic ? retryScheduledAt + residentRecoveryDelay(random) : null;
      patch = { ...patch, pauseSource: source, nextDecisionAt: retryAt,
        ...(state ? { recovery: { ...state, retryAt, retryScheduledAt } } : {}) };
    } else if (patch.status) {
      patch = { ...patch, pauseSource: null,
        ...((patch.recovery ?? goal.recovery) ? { recovery: { ...(patch.recovery ?? goal.recovery), retryAt: null, retryScheduledAt: null } } : {}) };
    }
    return notify(await store.commit(scope(goal.agentId), {
      goalId: goal.goalId, expectedRevision: goal.revision, patch, ...(event ? { event } : {}) }, { signal }));
  };
  function quarantine(agentId, details = {}) {
    unresolved.set(agentId, { ...unresolved.get(agentId), ...details,
      ...(autoRecovery ? { retryAt: time() + residentRecoveryDelay(random) } : {}) });
  }
  function locked(agentId, work) {
    const previous = queues.get(agentId) ?? Promise.resolve();
    const next = previous.catch(() => {}).then(work); queues.set(agentId, next);
    void next.finally(() => { if (queues.get(agentId) === next) queues.delete(agentId); }).catch(() => {});
    return next;
  }
  function assertCurrent(goal, input) {
    if (!goal || goal.goalId !== input.goalId || goal.revision !== input.expectedRevision) {
      throw failure('The objective changed; refresh its controls', 'ERR_WORLD_GOAL_REVISION');
    }
  }
  function budgetReason(goal) {
    if (goal.startedAt !== null && time() < goal.startedAt) return 'The objective clock moved backwards; wait for the clock to recover.';
    if (deadline(goal) !== null && time() >= deadline(goal)) return 'The ten-minute objective window is exhausted.';
    if (goal.steps - (goal.recovery?.stepBase ?? 0) >= goal.limits.maxSteps) return 'The eight-step objective window is exhausted.';
    if (goal.failures >= goal.limits.maxFailures) return 'Three consecutive objective attempts failed.';
    return '';
  }
  const deadline = goal => goal.recovery ? goal.recovery.windowStartedAt + goal.limits.maxDurationMs : goal.deadlineAt;
  function arm() {
    if (closed || timer !== undefined) return;
    timer = setTimer(() => { timer = undefined; void tick().catch(() => {}).finally(arm); }, tickMs);
    timer?.unref?.();
  }
  function forgetLostOwnership() {
    for (const agentId of [...heads.keys()]) if (!owned(agentId)) {
      if (active?.agentId === agentId) active.controller.abort(cancelled('Resident body ownership changed'));
      expedited.delete(heads.get(agentId)?.goalId);
      heads.delete(agentId); unresolved.delete(agentId);
    }
  }
  async function adoptOwned() {
    forgetLostOwnership();
    for (const saved of await store.list({ worldId })) {
      if (closed || !owned(saved.agentId) || heads.has(saved.agentId)) continue;
      if (terminal(saved)) { notify(saved); continue; }
      // Retain pending evidence until explicit owner reconciliation. No pending
      // model or physical request is replayed after a browser restart.
      await locked(saved.agentId, async () => {
        if (!owned(saved.agentId)) return;
        const goal = await read(saved.agentId);
        if (autoRecovery && goal?.status === 'paused' && (goal.pauseSource === 'owner' || goal.recovery?.retryAt !== null && goal.recovery?.retryAt !== undefined)) return;
        if (!terminal(goal)) await commit(goal, { status: 'paused',
          ...(autoRecovery ? { pauseSource: goal.pendingAction || goal.pendingDecision ? 'uncertain' : 'system' } : {}),
          reason: autoRecovery ? 'Restored objective; cleanup and fresh observations will precede automatic recovery.'
            : 'Restored objective. Its owner must Resume to plan from fresh observations.' },
          { type: 'restored', text: 'Pending work was not replayed.' });
      });
    }
  }
  const ready = adoptOwned().then(arm);
  ready.catch(() => {});
  async function syncOwnership() {
    await ready; if (closed) return;
    if (syncing) return syncing;
    syncing = adoptOwned().finally(() => { syncing = null; });
    return syncing;
  }

  async function assign({ agentId, objective, requesterId, signal, expectedResidentRevision }) {
    await ready; if (closed) throw new Error('Objective controller is closed');
    signal?.throwIfAborted();
    const admissionSignal = signal ? AbortSignal.any([signal, AbortSignal.timeout(decisionTimeoutMs)]) : AbortSignal.timeout(decisionTimeoutMs);
    const assigned = await locked(agentId, async () => {
      const previous = await read(agentId, admissionSignal);
      if (!terminal(previous)) throw failure('Pause or cancel the current objective before assigning another');
      assertOwned(agentId);
      const observed = await observe(scope(agentId), { goal: { agentId, worldId, objective, requesterId }, signal: admissionSignal });
      admissionSignal.throwIfAborted(); assertOwned(agentId);
      if (closed) throw new Error('Objective controller is closed');
      if (expectedResidentRevision !== undefined && observed.residentRevision !== expectedResidentRevision) {
        throw failure('Resident settings changed before task admission', 'ERR_WORLD_GOAL_ADMISSION_REVISION');
      }
      validateWorldIntent({ type: 'stop' }, { observed, current: observed, now: time() });
      const originPosition = normalizeWorldGoalPosition(observed.self?.position);
      const goal = notify(await store.assign({ agentId, worldId, objective, requesterId, originPosition },
        { expectedRevision: previous?.revision ?? 0, signal: admissionSignal }));
      expedited.delete(previous?.goalId);
      return goal;
    });
    admissionSignal.throwIfAborted();
    const resumed = await resume({ agentId, goalId: assigned.goalId, expectedRevision: assigned.revision, requesterId,
      signal: admissionSignal, expectedResidentRevision });
    // An explicitly requested new task need not inherit the conversation's
    // cooldown. A later conversation still interrupts and removes this grant.
    expedited.add(resumed.goalId);
    return resumed;
  }
  async function resume(input) {
    await ready; if (closed) throw new Error('Objective controller is closed');
    input.signal?.throwIfAborted();
    return locked(input.agentId, async () => {
      let goal = await read(input.agentId, input.signal); assertCurrent(goal, input);
      if (input.expectedResidentRevision !== undefined) {
        const observed = await observe(scope(input.agentId), { goal: clone(goal), signal: input.signal });
        input.signal?.throwIfAborted(); assertOwned(input.agentId);
        if (closed) throw new Error('Objective controller is closed');
        if (observed.residentRevision !== input.expectedResidentRevision) {
          throw failure('Resident settings changed before task admission', 'ERR_WORLD_GOAL_ADMISSION_REVISION');
        }
      }
      if (settling.has(input.agentId)) throw failure('Wait for physical cleanup before resuming');
      if (goal.status !== 'paused' && !unresolved.has(input.agentId)) throw failure('Only a paused objective can be resumed');
      if (unresolved.has(input.agentId)) {
        const pending = unresolved.get(input.agentId);
        if (pending.requestId) await stop(scope(input.agentId), { goalId: goal.goalId, requestId: pending.requestId, reason: 'Owner recovery' });
        if (goal.status !== 'paused') goal = await commit(goal, { status: 'paused', reason: 'Owner acknowledged interrupted objective state.' },
          { type: 'reconciled' }, input.signal);
      }
      if (autoRecovery && goal.pendingAction && !unresolved.get(input.agentId)?.requestId) {
        await stop(scope(input.agentId), { goalId: goal.goalId, requestId: goal.pendingAction.requestId, reason: 'Owner recovery' });
      }
      // An interrupted decision may have consumed compute. Charge it once,
      // discard its unknown result, and never restart that same request.
      const steps = goal.steps + (goal.pendingDecision ? 1 : 0);
      const candidate = { ...goal, steps, failures: 0 };
      const reason = autoRecovery ? '' : budgetReason(candidate);
      if (reason) {
        const paused = await commit(goal, { status: 'paused', reason, steps, pendingDecision: null, pendingAction: null },
          { type: 'budget-exhausted', text: reason }, input.signal);
        unresolved.delete(input.agentId); notify(paused); return paused;
      }
      const at = time();
      // An explicit Resume can renew the allowance immediately. Persist that
      // owner intent first; automatic recovery must obey its saved cooldown.
      if (autoRecovery && goal.recovery && goal.pauseSource !== 'owner') goal = await commit(goal,
        { status: 'paused', pauseSource: 'owner', reason: 'Owner requested a fresh objective window.' }, { type: 'owner-recovery-requested' }, input.signal);
      const updated = await commit(goal, { status: 'ready', reason: '', failures: 0, steps,
        ...(autoRecovery ? { recovery: { windowIndex: goal.recovery ? goal.recovery.windowIndex + 1 : 0,
          windowStartedAt: at, stepBase: steps, retryAt: null } } : {}),
        ...(goal.startedAt === null ? { startedAt: at, deadlineAt: at + goal.limits.maxDurationMs } : {}),
        ...(input.requesterId !== undefined ? { requesterId: input.requesterId } : {}),
        pendingDecision: null, pendingAction: null, nextDecisionAt: at },
      { type: 'owner-resumed', text: 'Observe afresh and continue saved milestones; never replay pending requests.' }, input.signal);
      unresolved.delete(input.agentId); notify(updated); arm(); return updated;
    });
  }
  async function control(input, status, reason, internal = false) {
    if (!internal) { await ready; if (closed) throw new Error('Objective controller is closed'); }
    let captured, admitted = false;
    // Fence recovery as soon as the owner asks, including while an earlier
    // asynchronous cleanup still holds the per-resident storage queue.
    controls.add(input.agentId);
    controlCounts.set(input.agentId, (controlCounts.get(input.agentId) ?? 0) + 1);
    try { await locked(input.agentId, async () => {
      if (internal && !owned(input.agentId)) return;
      captured = await read(input.agentId);
      if (internal) { if (!captured || captured.goalId !== input.goalId || terminal(captured)) { captured = null; return; } }
      else assertCurrent(captured, input);
      if (terminal(captured)) throw failure('This objective is already finished');
      admitted = true;
      if (autoRecovery) captured = await commit(captured, { status: 'paused',
        pauseSource: !internal || captured.pauseSource === 'owner' ? 'owner' : 'system', reason },
      { type: internal ? 'system-pause-requested' : 'owner-pause-requested' });
      if (active?.agentId === input.agentId) active.controller.abort(cancelled(reason));
    });
    if (!captured || terminal(captured)) return captured;
      if (active?.agentId === input.agentId) await active.done.catch(() => {});
      await settling.get(input.agentId)?.done;
      const requestId = captured.pendingAction?.requestId ?? unresolved.get(input.agentId)?.requestId;
      const stopped = requestId ? await stop(scope(input.agentId), { goalId: captured.goalId, requestId, reason }) : undefined;
      const result = await locked(input.agentId, async () => {
        const current = await read(input.agentId);
        if (current.goalId !== captured.goalId) throw failure('Objective ownership changed during cancellation');
        return commit(current, { status, reason, pendingDecision: null, pendingAction: null,
          ...(status === 'paused' ? { pauseSource: !internal || stopped === false || current.pauseSource === 'owner' ? 'owner' : 'system' } : {}),
          steps: current.steps + (current.pendingDecision ? 1 : 0), nextDecisionAt: null },
        { type: status === 'cancelled' ? 'owner-cancelled' : 'paused', text: reason });
      });
      unresolved.delete(input.agentId); notify(result); return result;
    } catch (error) {
      if (admitted && owned(input.agentId)) quarantine(input.agentId, { requestId: captured?.pendingAction?.requestId, ownerHeld: !internal });
      notify(heads.get(input.agentId));
      throw error;
    } finally {
      const remaining = (controlCounts.get(input.agentId) ?? 1) - 1;
      if (remaining) controlCounts.set(input.agentId, remaining);
      else { controlCounts.delete(input.agentId); controls.delete(input.agentId); }
    }
  }
  const pause = input => control(input, 'paused', 'Paused by the owner.');
  const cancel = input => control(input, 'cancelled', 'Cancelled by the owner.');

  async function interrupt({ agentId, reason = 'Human conversation has priority' } = {}) {
    await ready;
    for (const goal of heads.values()) if (agentId === undefined || goal.agentId === agentId) expedited.delete(goal.goalId);
    quietUntil = Math.max(quietUntil, time() + 30000);
    const run = active;
    if (run && run.stage !== 'dispatch' && (agentId === undefined || run.agentId === agentId)) {
      run.interrupted = true; run.controller.abort(cancelled(reason)); await run.done.catch(() => {});
    }
    arm();
  }

  async function settleFailure(run, error) {
    if (controls.has(run.agentId) || !owned(run.agentId)) return;
    await locked(run.agentId, async () => {
      const goal = await read(run.agentId);
      if (!goal || goal.goalId !== run.goalId || goal.status !== 'planning' || goal.pendingDecision?.id !== run.id) return;
      const steps = goal.steps + 1;
      if (classifyInferenceAvailability(error)) {
        const wait = availabilityWait(error);
        await commit(goal, { status: 'waiting-for-model', pendingDecision: null,
          reason: wait.reason, nextDecisionAt: time() + 30000 },
        { type: 'waiting-for-model', text: wait.text, requestId: run.id }); return;
      }
      if (error?.committed) {
        // Preserve the pending attempt for explicit owner reconciliation.
        await commit(goal, { status: 'paused', reason: autoRecovery
          ? 'The planning outcome is uncertain; automatic recovery will discard it and observe afresh.'
          : 'The planning outcome is uncertain; owner Resume is required.' },
          { type: 'outcome-unknown', requestId: run.id }); return;
      }
      const failures = run.interrupted ? goal.failures : Math.min(goal.limits.maxFailures, goal.failures + 1);
      const reason = budgetReason({ ...goal, steps, failures }) || (run.interrupted ? 'Waiting for the conversation to finish.' : brief(error?.message ?? error));
      await commit(goal, { status: budgetReason({ ...goal, steps, failures }) ? 'paused' : 'ready', reason,
        pendingDecision: null, steps, failures, nextDecisionAt: time() + 30000 },
      { type: run.interrupted ? 'planning-interrupted' : 'planning-failed', text: reason, requestId: run.id });
    });
  }
  function start(goal) {
    const run = { agentId: goal.agentId, goalId: goal.goalId, id: crypto.randomUUID(), stage: 'planning', controller: new AbortController() };
    active = run;
    const timeout = setTimer(() => run.controller.abort(cancelled('Objective planning deadline exceeded')),
      Math.max(1, Math.min(decisionTimeoutMs, deadline(goal) - time())));
    run.done = (async () => {
      const prepared = await locked(run.agentId, async () => {
        const current = await read(run.agentId);
        if (closed || controls.has(run.agentId) || unresolved.has(run.agentId) || current?.goalId !== run.goalId
            || !['ready', 'waiting-for-model'].includes(current.status)) return null;
        const reason = budgetReason(current);
        if (reason) { await commit(current, { status: 'paused', reason }, { type: 'budget-exhausted', text: reason }); return null; }
        return commit(current, { status: 'planning', reason: '', pendingDecision: { id: run.id, startedAt: time() } },
          { type: 'planning', requestId: run.id });
      });
      if (!prepared) return;
      run.controller.signal.throwIfAborted(); assertOwned(run.agentId);
      const observed = await observe(scope(run.agentId), { goal: clone(prepared), signal: run.controller.signal });
      run.controller.signal.throwIfAborted();
      if (!await canRun(scope(run.agentId), { goal: clone(prepared) })) {
        run.interrupted = true; throw cancelled('The resident is busy with a higher-priority task');
      }
      assertOwned(run.agentId);
      const output = await decide(scope(run.agentId), { goal: clone(prepared), observed: clone(observed), signal: run.controller.signal });
      run.controller.signal.throwIfAborted();
      if (!await canRun(scope(run.agentId), { goal: clone(prepared) })) {
        run.interrupted = true; throw cancelled('The resident is busy with a higher-priority task');
      }
      if (['waiting-for-model', 'busy'].includes(output?.status)) {
        const wait = availabilityWait(output.availability, output.status);
        await locked(run.agentId, async () => {
          const current = await read(run.agentId);
          if (current?.status !== 'planning' || current.pendingDecision?.id !== run.id || controls.has(run.agentId)) return;
          await commit(current, { status: 'waiting-for-model', pendingDecision: null,
            reason: wait.reason, nextDecisionAt: time() + 30000 },
          { type: 'waiting-for-model', text: wait.text, requestId: run.id });
        }); return;
      }
      // Validate injected results too; a test/provider callback cannot bypass the
      // same action/receipt contract as a real language model.
      const decision = parseWorldGoalDecision(JSON.stringify(output), { goal: prepared, observed, now: time() });
      const currentObserved = decision.decision === 'act'
        ? await observe(scope(run.agentId), { goal: clone(prepared), signal: run.controller.signal }) : observed;
      run.controller.signal.throwIfAborted();
      if (decision.decision === 'act') decision.intent = validateWorldIntent(decision.intent,
        { observed, current: currentObserved, now: time(), ...pointAuthority(prepared) });
      let issued;
      await locked(run.agentId, async () => {
        const current = await read(run.agentId);
        if (current?.status !== 'planning' || current.pendingDecision?.id !== run.id || controls.has(run.agentId) || closed) return;
        run.controller.signal.throwIfAborted();
        // Revalidate against the acknowledged current checkpoint before either
        // saving a plan or authorizing a physical effect.
        parseWorldGoalDecision(JSON.stringify(decision), { goal: current, observed: currentObserved, now: time() });
        const steps = current.steps + 1, common = { steps, failures: 0, pendingDecision: null };
        if (decision.decision === 'plan') {
          await commit(current, { ...common, status: 'ready', reason: '',
            plan: { version: 1, milestones: decision.milestones },
            currentStep: 'Model plan saved; awaiting its first action.', nextDecisionAt: time() },
          { type: 'plan-created', text: `Model selected ${decision.milestones.length} ordered milestones.`, requestId: run.id });
        } else if (decision.decision === 'act') {
          const milestone = activeWorldGoalMilestone(current);
          const requestId = crypto.randomUUID();
          issued = await commit(current, { ...common, failures: current.failures, status: 'acting', reason: '',
            currentStep: decision.reason || decision.intent.type,
            pendingAction: { requestId, milestoneIndex: milestone.index, intent: decision.intent,
              issuedAt: time(), observationAt: observed.observedAt } },
          { type: 'action-prepared', text: decision.reason || decision.intent.type, requestId });
        } else if (decision.decision === 'done') {
          await commit(current, { ...common, status: 'completed', reason: 'All saved milestones have physical receipts; the model assessed the objective as finished.',
            modelAssessment: decision.assessment, currentStep: 'Model assessed the objective as finished.', nextDecisionAt: null },
          { type: 'model-assessment', text: decision.assessment });
        } else {
          await commit(current, { ...common, status: decision.decision === 'pause' ? 'paused' : 'ready',
            reason: decision.reason, currentStep: decision.reason, nextDecisionAt: time() + 30000 },
          { type: decision.decision === 'pause' ? 'model-paused' : 'model-waiting', text: decision.reason });
        }
      });
      if (issued) {
        try {
          run.controller.signal.throwIfAborted(); assertOwned(run.agentId); run.stage = 'dispatch';
          const acknowledgement = await dispatch(scope(run.agentId), { goalId: issued.goalId, requestId: issued.pendingAction.requestId,
            intent: clone(issued.pendingAction.intent), observed: clone(currentObserved), ...pointAuthority(issued) }, { signal: run.controller.signal });
          if (acknowledgement?.applied === false) throw failure('The world did not apply this objective action');
        } catch (error) {
          if (!owned(run.agentId)) throw error;
          quarantine(run.agentId, { requestId: issued.pendingAction.requestId });
          const stopped = await stop(scope(run.agentId), { goalId: issued.goalId, requestId: issued.pendingAction.requestId, reason: 'Dispatch failed or interrupted' });
          await locked(run.agentId, async () => {
            const current = await read(run.agentId);
            if (current?.goalId !== issued.goalId || current.pendingAction?.requestId !== issued.pendingAction.requestId) return;
            await commit(current, { status: run.interrupted ? 'ready' : 'paused', reason: run.interrupted
              ? 'Waiting for the conversation to finish.' : 'Physical dispatch was interrupted; Resume plans afresh.',
            ...(stopped === false ? { status: 'paused', pauseSource: 'owner', reason: 'A newer movement command superseded this objective.' } : {}),
            nextDecisionAt: time() + 30000, pendingAction: null },
              { type: 'dispatch-interrupted', requestId: issued.pendingAction.requestId });
          });
          unresolved.delete(run.agentId); throw error;
        }
      }
    })().catch(async error => {
      try { await settleFailure(run, error); }
      catch (persistenceError) { if (owned(run.agentId)) {
        quarantine(run.agentId, { error: persistenceError }); notify(heads.get(run.agentId));
      } }
    }).finally(() => { clearTimer(timeout); if (active === run) active = null; arm(); });
  }

  async function receiveReceipt({ agentId }, event) {
    await ready;
    if (closed || !owned(agentId)) return false;
    let accepted, physical;
    try { await locked(agentId, async () => {
      const goal = await read(agentId), pending = goal?.pendingAction;
      if (goal?.status !== 'acting' || !pending || settling.has(agentId) || event?.requestId !== pending.requestId
          || event.type !== pending.intent.type || event.targetId !== pending.intent.targetId
          || (goal.plan && !worldGoalMilestoneMatchesAction(goal, pending))
          || !['arrived', 'stopped', 'target-lost', 'blocked', 'cancelled', 'failed'].includes(event.status)) return;
      if (pending.intent.type === 'move-to') {
        try {
          const target = normalizeWorldGoalPosition(event.targetPosition);
          if (!target.every((value, index) => value === pending.intent.position[index])) return;
          if (event.status === 'arrived') {
            const actual = normalizeWorldGoalPosition(event.position);
            if (Math.hypot(actual[0] - target[0], actual[2] - target[2]) > pending.intent.stopDistance) return;
          }
        } catch { return; }
      } else if (event.targetPosition !== undefined) return;
      const receipt = { requestId: event.requestId, type: event.type, ...(event.targetId ? { targetId: event.targetId } : {}),
        ...(event.targetPosition ? { targetPosition: clone(event.targetPosition) } : {}),
        status: event.status, at: time(), ...(event.position ? { position: clone(event.position) } : {}),
        ...(event.reason ? { reason: brief(event.reason) } : {}) };
      let resolve;
      const done = new Promise(acknowledge => { resolve = acknowledge; });
      settling.set(agentId, { requestId: pending.requestId, done, resolve });
      physical = { goalId: goal.goalId, requestId: pending.requestId };
      try { accepted = await commit(goal, { lastReceipt: receipt, pendingAction: null, status: 'paused',
        reason: 'Physical outcome saved; settling its motor.' }, { type: 'physical-receipt', requestId: pending.requestId }); }
      catch (error) { settling.get(agentId)?.resolve(); settling.delete(agentId); quarantine(agentId, { requestId: pending.requestId }); throw error; }
    }); } catch (error) {
      if (physical) {
        try { await stop(scope(agentId), { ...physical, reason: 'Physical receipt could not be saved' }); }
        catch { /* Unresolved ownership remains visible for explicit recovery. */ }
        notify(heads.get(agentId));
      }
      throw error;
    }
    if (!accepted) return false;
    const requestId = physical.requestId;
    try {
      // Even approach remains live after arrival. Settle that exact intent before
      // the next decision; a newer manual command must never be stopped here.
      assertOwned(agentId);
      const stopped = event.status !== 'cancelled'
        ? await stop(scope(agentId), { goalId: accepted.goalId, requestId, reason: 'Objective step settled' }) : undefined;
      const superseded = ['arrived', 'stopped'].includes(event.status) && stopped === false;
      await locked(agentId, async () => {
        const current = await read(agentId);
        if (current?.goalId !== accepted.goalId || current.lastReceipt?.requestId !== requestId || terminal(current)) return;
        // Cleanup can overlap owner Pause. A later acknowledged revision wins;
        // this receipt may not rewrite its reason or make the goal ready again.
        if (current.revision !== accepted.revision) return;
        const failures = event.status === 'failed' ? Math.min(current.limits.maxFailures, current.failures + 1) : 0;
        const reason = event.status === 'cancelled' || superseded ? 'A newer movement command superseded this objective. Resume when ready.'
          : budgetReason({ ...current, failures });
        await commit(current, { pendingAction: null, failures, status: reason || controls.has(agentId) ? 'paused' : 'ready',
          ...(event.status === 'cancelled' || superseded || controls.has(agentId) ? { pauseSource: 'owner' } : {}),
          reason: reason || `Physical ${event.type}: ${event.status}.`, nextDecisionAt: time() },
        { type: 'step-settled', requestId });
      });
      return true;
    } catch (error) { if (owned(agentId)) { quarantine(agentId, { requestId }); notify(heads.get(agentId)); } throw error; }
    finally { settling.get(agentId)?.resolve(); settling.delete(agentId); arm(); }
  }
  async function recoverAutomatically(agentId) {
    if (!autoRecovery || closed || controls.has(agentId) || settling.has(agentId) || active?.agentId === agentId || !owned(agentId)) return;
    const cached = heads.get(agentId), unknown = unresolved.get(agentId);
    if (!cached || terminal(cached) || cached.pauseSource === 'owner' || unknown?.ownerHeld
        || time() < (unknown?.retryAt ?? cached.recovery?.retryAt ?? Infinity)) return;
    try { await locked(agentId, async () => {
      let goal = await read(agentId);
      if (!goal || terminal(goal) || goal.pauseSource === 'owner' || controls.has(agentId) || closed) return;
      const uncertain = unresolved.get(agentId);
      if (goal.status !== 'paused') {
        // A failed write may have left the last acknowledged row in planning or
        // acting. Save uncertainty before attempting any recovery side effect.
        await commit(goal, { status: 'paused', pauseSource: 'uncertain', reason: 'Interrupted checkpoint requires cleanup before a new objective window.' },
          { type: 'recovery-checkpoint' });
        unresolved.delete(agentId); return;
      }
      if (!goal.recovery || time() < goal.recovery.retryAt || goal.recovery.retryAt === null
          || time() < (goal.startedAt ?? 0)) return;
      const requestId = goal.pendingAction?.requestId ?? uncertain?.requestId;
      const stopped = requestId ? await stop(scope(agentId), { goalId: goal.goalId, requestId, reason: 'Automatic recovery of previous request' }) : undefined;
      assertOwned(agentId);
      const latest = await read(agentId);
      if (latest?.goalId !== goal.goalId || latest.revision !== goal.revision || controls.has(agentId) || closed) return;
      // A restored world has no old live request to cancel. Only an explicit
      // idle sensor report establishes that absence; a newer stop command is
      // still deliberate movement control and must remain owner-held.
      const observed = await observe(scope(agentId), { goal: clone(goal) }); assertOwned(agentId);
      validateWorldIntent({ type: 'stop' }, { observed, current: observed, now: time() });
      if (controls.has(agentId) || closed) return;
      if (stopped === false && observed.self?.motion?.status !== 'idle') {
        await commit(goal, { status: 'paused', pauseSource: 'owner', reason: 'A newer movement command superseded this objective.',
          pendingAction: null, pendingDecision: null, steps: goal.steps + (goal.pendingDecision ? 1 : 0) },
        { type: 'recovery-superseded', ...(requestId ? { requestId } : {}) });
        unresolved.delete(agentId); return;
      }
      // Fresh observations confirm that this body still exists. They are never
      // used to invent a milestone receipt for an unknown former action.
      const steps = goal.steps + (goal.pendingDecision ? 1 : 0);
      await commit(goal, { status: 'ready', failures: 0, steps, pendingDecision: null, pendingAction: null,
        reason: 'Automatic recovery started a fresh objective window; previous requests were not replayed.', nextDecisionAt: time(),
        recovery: { windowIndex: goal.recovery.windowIndex + 1, windowStartedAt: time(), stepBase: steps, retryAt: null } },
      { type: 'window-restarted', ...(requestId ? { requestId } : {}) });
      unresolved.delete(agentId);
    }); } catch (error) {
      if (!owned(agentId)) return;
      quarantine(agentId, { error }); notify(heads.get(agentId));
      // Preserve the truthful old checkpoint. If storage works, make the next
      // cleanup retry durable too; otherwise the in-memory quarantine fences it.
      try { await locked(agentId, async () => {
        const goal = await read(agentId);
        if (!terminal(goal) && goal.pauseSource !== 'owner') await commit(goal,
          { status: 'paused', pauseSource: 'uncertain', reason: brief(`Recovery cleanup failed: ${error.message ?? error}`) },
          { type: 'recovery-failed' });
      }); } catch { /* Quarantine remains until a later acknowledged retry. */ }
    }
  }
  async function tick() {
    await ready; if (closed) return;
    if (ticking) return ticking;
    ticking = (async () => {
      forgetLostOwnership();
      for (const goal of [...heads.values()]) {
        if (!owned(goal.agentId) || terminal(goal) || controls.has(goal.agentId)) continue;
        if (goal.status === 'paused' || unresolved.has(goal.agentId)) { await recoverAutomatically(goal.agentId); continue; }
        if (deadline(goal) !== null && time() >= deadline(goal)) {
          await control({ agentId: goal.agentId, goalId: goal.goalId }, 'paused', 'The ten-minute objective budget is exhausted.', true);
        }
      }
      if (active) return;
      const candidates = [...heads.values()].filter(goal => ['ready', 'waiting-for-model'].includes(goal.status)
        && !controls.has(goal.agentId) && !unresolved.has(goal.agentId) && !settling.has(goal.agentId)
        && (time() >= quietUntil || expedited.has(goal.goalId))
        && (goal.nextDecisionAt === null || time() >= goal.nextDecisionAt))
        .sort((a, b) => a.updatedAt - b.updatedAt || a.agentId.localeCompare(b.agentId));
      for (const goal of candidates) {
        if (await canRun(scope(goal.agentId), { goal: clone(goal) })) { start(goal); break; }
      }
    })().finally(() => { ticking = null; });
    return ticking;
  }
  async function dispose() {
    if (disposal) return disposal;
    closed = true; clearTimer(timer); timer = undefined;
    active?.controller.abort(cancelled('World closed'));
    disposal = (async () => {
      await ready.catch(() => {}); await active?.done.catch(() => {});
      for (const goal of [...heads.values()]) if (!terminal(goal)) {
        await control({ agentId: goal.agentId, goalId: goal.goalId }, 'paused', 'World closed. Owner Resume is required.', true);
      }
      await Promise.allSettled([...queues.values()]);
    })().catch(error => { disposal = null; throw error; });
    return disposal;
  }
  return { ready, assign, resume, pause, cancel, interrupt, receiveReceipt, tick, syncOwnership, dispose,
    async get(agentId) { await ready; return snapshot(await read(agentId)); },
    list: () => [...heads.values()].filter(goal => owned(goal.agentId)).map(snapshot),
    getStatus: () => ({ closed, active: active?.agentId ?? null, quietUntil, unresolved: [...unresolved.keys()] }) };
}
