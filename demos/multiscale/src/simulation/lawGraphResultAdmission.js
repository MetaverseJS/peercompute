export const MULTISCALE_LAW_GRAPH_RESULT_ADMISSION_SCHEMA =
  'peercompute.multiscale.law-graph-result-admission.v0';

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function rounded(value, digits = 4) {
  return Number(finite(value).toFixed(digits));
}

function statusForEntry({
  resultAdmissionRequired = false,
  runtimeMatched = false,
  warmDeltaMatched = false,
  pending = false,
  failedTasks = 0,
  proxyAdmitted = false,
  scientificBlocked = false,
  authoritativeMutationReady = false
} = {}) {
  if (!resultAdmissionRequired) return 'result-admission-not-required';
  if (pending) return 'result-admission-pending-runtime';
  if (failedTasks > 0) return 'result-admission-runtime-failed';
  if (!runtimeMatched) return 'result-admission-runtime-missing';
  if (!warmDeltaMatched) return 'result-admission-warm-delta-missing';
  if (proxyAdmitted && authoritativeMutationReady && !scientificBlocked) return 'authoritative-result-ready';
  if (proxyAdmitted && scientificBlocked) return 'proxy-result-admitted-scientific-blocked';
  if (proxyAdmitted) return 'proxy-result-admitted';
  return 'result-admission-runtime-missing';
}

function nextResultAdmissionAction(entries = []) {
  const required = entries.filter((entry) => entry.resultAdmissionRequired);
  const missingRuntime = required.find((entry) => !entry.runtimeMatched && !entry.pending);
  if (missingRuntime) return `wait-runtime:${missingRuntime.solverDescriptorId || missingRuntime.solverId || 'unknown'}`;
  const pending = required.find((entry) => entry.pending);
  if (pending) return `wait-worker:${pending.solverDescriptorId || pending.solverId || 'unknown'}`;
  const missingWarmDelta = required.find((entry) => entry.runtimeMatched && !entry.warmDeltaMatched);
  if (missingWarmDelta) return `wait-warm-delta:${missingWarmDelta.solverDescriptorId || missingWarmDelta.solverId || 'unknown'}`;
  const failed = required.find((entry) => entry.failedTasks > 0);
  if (failed) return `inspect-runtime-failure:${failed.solverDescriptorId || failed.solverId || 'unknown'}`;
  const blocked = required.find((entry) => entry.proxyAdmitted && entry.scientificBlocked);
  if (blocked) return `scientific-result-admission-blocked:${blocked.solverDescriptorId || blocked.solverId || 'unknown'}`;
  return 'result-admission-idle';
}

export function createLawGraphResultAdmission({
  schedulerExecutionAudit = null,
  timeSeconds = 0,
  activeLayerId = 'unknown'
} = {}) {
  const audit = schedulerExecutionAudit || {};
  const auditEntries = Array.isArray(audit.entries) ? audit.entries : [];
  const evidenceAvailable = audit.evidenceAvailable === true;
  const authoritativeMutationReady = audit.authoritativeMutationReady === true;
  const entries = auditEntries.map((auditEntry, index) => {
    const resultAdmissionRequired = auditEntry.executionRequired === true
      && auditEntry.resultAdmissionRequired === true;
    const runtimeMatched = auditEntry.runtimeMatched === true;
    const warmDeltaMatched = auditEntry.warmDeltaMatched === true;
    const pending = auditEntry.pending === true;
    const failedTasks = finite(auditEntry.failedTasks, 0);
    const proxyAdmitted = resultAdmissionRequired
      && runtimeMatched
      && warmDeltaMatched
      && !pending
      && failedTasks <= 0;
    const sequenceComparable = auditEntry.resultSequence != null
      && auditEntry.warmDeltaSequence != null;
    const sequenceConsistent = !sequenceComparable
      || String(auditEntry.resultSequence) === String(auditEntry.warmDeltaSequence);
    const scientificBlocked = auditEntry.scientificBlocked === true;
    return {
      id: `result-admission:${auditEntry.id || auditEntry.operationId || index}`,
      admissionIndex: index,
      auditEntryId: auditEntry.id || null,
      manifestEntryId: auditEntry.manifestEntryId || null,
      queueEntryId: auditEntry.queueEntryId || null,
      operationId: auditEntry.operationId || null,
      lawNodeId: auditEntry.lawNodeId || null,
      schedulerLane: auditEntry.schedulerLane || 'unknown',
      solverId: auditEntry.solverId || null,
      solverDescriptorId: auditEntry.solverDescriptorId || null,
      resultAdmissionRequired,
      runtimeMatched,
      warmDeltaMatched,
      proxyAdmitted,
      authoritativeMutationReady: authoritativeMutationReady && proxyAdmitted && !scientificBlocked,
      scientificBlocked,
      pending,
      failedTasks,
      runtimeTaskId: auditEntry.runtimeTaskId || null,
      runtimeStateKey: auditEntry.runtimeStateKey || null,
      resultSchema: auditEntry.resultSchema || null,
      resultBackend: auditEntry.resultBackend || null,
      resultSequence: auditEntry.resultSequence ?? null,
      warmDeltaSchema: auditEntry.warmDeltaSchema || null,
      warmDeltaBackend: auditEntry.warmDeltaBackend || null,
      warmDeltaSequence: auditEntry.warmDeltaSequence ?? null,
      sequenceComparable,
      sequenceConsistent,
      status: statusForEntry({
        resultAdmissionRequired,
        runtimeMatched,
        warmDeltaMatched,
        pending,
        failedTasks,
        proxyAdmitted,
        scientificBlocked,
        authoritativeMutationReady
      })
    };
  });
  const requiredEntries = entries.filter((entry) => entry.resultAdmissionRequired);
  const proxyAdmittedEntries = requiredEntries.filter((entry) => entry.proxyAdmitted);
  const authoritativeReadyEntries = requiredEntries.filter((entry) => entry.authoritativeMutationReady);
  const scientificBlockedEntries = requiredEntries.filter((entry) => entry.proxyAdmitted && entry.scientificBlocked);
  const missingRuntimeEntries = requiredEntries.filter((entry) => !entry.runtimeMatched && !entry.pending);
  const missingWarmDeltaEntries = requiredEntries.filter((entry) => entry.runtimeMatched && !entry.warmDeltaMatched);
  const pendingEntries = requiredEntries.filter((entry) => entry.pending);
  const failedEntries = requiredEntries.filter((entry) => entry.failedTasks > 0);
  const missingResultSchemaEntries = requiredEntries.filter((entry) => entry.proxyAdmitted && !entry.resultSchema);
  const sequenceMismatchEntries = requiredEntries.filter((entry) => entry.sequenceComparable && !entry.sequenceConsistent);
  const allRequiredAdmitted = requiredEntries.length > 0
    && proxyAdmittedEntries.length === requiredEntries.length;
  const status = entries.length === 0
    ? 'result-admission-empty'
    : !evidenceAvailable
      ? 'result-admission-evidence-unavailable'
      : requiredEntries.length === 0
        ? 'result-admission-not-required'
        : allRequiredAdmitted && authoritativeMutationReady
          ? 'authoritative-result-admission-ready'
          : allRequiredAdmitted && scientificBlockedEntries.length > 0
            ? 'proxy-result-admission-ready-scientific-blocked'
            : allRequiredAdmitted
              ? 'proxy-result-admission-ready'
              : proxyAdmittedEntries.length > 0
                ? scientificBlockedEntries.length > 0
                  ? 'result-admission-partial-scientific-blocked'
                  : 'result-admission-partial'
                : pendingEntries.length > 0
                  ? 'result-admission-pending'
                  : 'result-admission-blocked';
  return {
    schema: MULTISCALE_LAW_GRAPH_RESULT_ADMISSION_SCHEMA,
    modelId: 'bipartite-law-operation-result-admission-v0',
    mode: 'worker-result-proxy-admission-gate',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    activeLayerId,
    schedulerExecutionAuditSchema: audit.schema || null,
    proxyConverged: audit.proxyConverged === true,
    scientificConverged: audit.scientificConverged === true,
    authoritativeMutationReady,
    evidenceAvailable,
    resultAdmissionEntryCount: entries.length,
    resultAdmissionRequiredCount: requiredEntries.length,
    proxyAdmittedCount: proxyAdmittedEntries.length,
    authoritativeReadyAdmissionCount: authoritativeReadyEntries.length,
    scientificBlockedAdmissionCount: scientificBlockedEntries.length,
    missingExecutionEvidenceCount: requiredEntries.filter((entry) => !entry.runtimeMatched && !entry.warmDeltaMatched).length,
    missingRuntimeCount: missingRuntimeEntries.length,
    missingWarmDeltaCount: missingWarmDeltaEntries.length,
    missingResultSchemaCount: missingResultSchemaEntries.length,
    pendingRuntimeCount: pendingEntries.length,
    failedRuntimeCount: failedEntries.length,
    sequenceMismatchCount: sequenceMismatchEntries.length,
    nextResultAdmissionAction: nextResultAdmissionAction(entries),
    entries,
    residualTargets: [
      {
        id: 'residual:result-admission-runtime-missing',
        quantity: 'result-admission entries without runtime result evidence',
        current: missingRuntimeEntries.length,
        target: 0,
        satisfied: missingRuntimeEntries.length === 0
      },
      {
        id: 'residual:result-admission-warm-delta-missing',
        quantity: 'result-admission entries without matching warm delta evidence',
        current: missingWarmDeltaEntries.length,
        target: 0,
        satisfied: missingWarmDeltaEntries.length === 0
      },
      {
        id: 'residual:result-admission-scientific-blocked',
        quantity: 'proxy-admitted worker results still blocked from authoritative mutation',
        current: scientificBlockedEntries.length,
        target: 0,
        satisfied: scientificBlockedEntries.length === 0
      }
    ],
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'This gate admits proxy worker result evidence only; it does not perform authoritative state mutation.',
        'Scientific promotion remains blocked until calibrated law artifacts and conservative mutation gates converge.'
      ]
    },
    provenance: {
      source: 'demos/multiscale/src/simulation/lawGraphResultAdmission.js',
      generatedFrom: 'peercompute.multiscale.law-graph-scheduler-execution-audit.v0'
    }
  };
}
