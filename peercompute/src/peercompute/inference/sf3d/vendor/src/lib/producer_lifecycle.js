/**
 * Producer lifecycle: one run at a time, and a dispose() that is safe to call
 * at any time. A host tearing down while a run is outstanding must not leak
 * the run (bridge run open, drain timer firing, second run refused forever) or
 * release buffers the run is still using; the release is deferred until that
 * run ends, and everything new is refused from the moment dispose is requested.
 * Pure (no GPU), so the contract is testable in Node.
 */
export function createProducerLifecycle({ release }) {
  if (typeof release !== 'function') throw new Error('release must be a function');
  const state = { activeRunId: null, disposed: false, releaseStarted: false, quarantined: false, quarantineReason: undefined };
  let resolveCompletion;
  let rejectCompletion;
  const completion = new Promise((resolve, reject) => {
    resolveCompletion = resolve;
    rejectCompletion = reject;
  });
  // A failed foreground finish may quarantine before a host asks to dispose.
  // Preserve rejection for that later caller without emitting an unhandled one.
  completion.catch(() => {});
  const doRelease = () => {
    if (state.releaseStarted) return completion;
    state.releaseStarted = true;
    Promise.resolve()
      .then(() => release())
      .then(
        () => resolveCompletion(Object.freeze({ status: 'released' })),
        error => rejectCompletion(error),
      );
    return completion;
  };
  return Object.freeze({
    get activeRunId() { return state.activeRunId; },
    get disposed() { return state.disposed; },
    get quarantined() { return state.quarantined; },
    beginRun(runId) {
      if (state.quarantined) throw new Error('sf3d producer is quarantined after failed foreground finish', { cause: state.quarantineReason });
      if (state.disposed) throw new Error('sf3d producer is disposed');
      if (state.activeRunId != null) throw new Error(`sf3d producer already has an active run (${state.activeRunId})`);
      state.activeRunId = runId;
    },
    /** 'release-started' when a deferred dispose begins at this run's end, else 'idle'. */
    endRun(runId) {
      if (state.activeRunId !== runId) throw new Error(`${runId} is not the active run (${state.activeRunId ?? 'none'})`);
      state.activeRunId = null;
      if (state.quarantined) return 'quarantined';
      if (state.disposed) { doRelease(); return 'release-started'; }
      return 'idle';
    },
    quarantine(runId, error) {
      if (state.activeRunId !== runId) throw new Error(`${runId} is not the active run (${state.activeRunId ?? 'none'})`);
      if (state.quarantined) return;
      state.quarantined = true;
      state.quarantineReason = error;
      rejectCompletion(error);
    },
    assertAcceptingRequests() {
      if (state.disposed) throw new Error('sf3d producer is disposed');
    },
    dispose() {
      if (state.disposed) return Object.freeze({ status: 'already-disposed', completion });
      state.disposed = true;
      if (state.quarantined) return Object.freeze({ status: 'quarantined', completion });
      if (state.activeRunId != null) {
        return Object.freeze({ status: 'deferred-until-run-ends', runId: state.activeRunId, completion });
      }
      doRelease();
      return Object.freeze({ status: 'releasing', completion });
    },
  });
}

/**
 * Validate every fallible run input BEFORE acquiring lifecycle or bridge
 * state, then acquire both and hand back one exactly-once release boundary.
 * A rejected run therefore never leaves an active run behind (r2 HIGH,
 * 2026-09-16: an empty run id or a bad route override used to wedge the
 * producer after lifecycle.beginRun had already fired).
 *
 * buildOptions() must return the frozen route options WITHOUT the
 * foreground service; it is attached here from the admitted service run.
 */
export async function prepareProducerRun({ lifecycle, foreground, runId, buildOptions }) {
  if (typeof runId !== 'string' || !runId.trim()) throw new Error('runId must be a non-empty string');
  if (typeof buildOptions !== 'function') throw new Error('buildOptions must be a function');
  const baseOptions = buildOptions();            // throws on unknown worker roles / bad overrides
  lifecycle.beginRun(runId);                       // refuses when disposed or a run is active
  let foregroundRun;
  try {
    foregroundRun = await foreground.beginRun(runId);
  } catch (error) {
    lifecycle.endRun(runId);
    throw error;
  }
  const options = Object.freeze({
    ...baseOptions,
    foregroundOpportunities: foregroundRun.foregroundOpportunities,
    withForeground: foregroundRun.withForeground,
  });
  let released = null;
  return Object.freeze({
    runId,
    options,
    foregroundRun,
    /** Finish the bridge run and end the lifecycle run exactly once; returns the foreground report. */
    async release() {
      if (released) return released;
      released = (async () => {
        try {
          return await foregroundRun.finish();
        } catch (error) {
          lifecycle.quarantine(runId, error);
          throw error;
        } finally {
          lifecycle.endRun(runId);
        }
      })();
      return released;
    },
  });
}
