export const MULTISCALE_LAW_GRAPH_DISPATCH_QUEUE_SCHEMA = 'peercompute.multiscale.law-graph-dispatch-queue.v0';

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function rounded(value, digits = 4) {
  return Number(finite(value).toFixed(digits));
}

function byOperation(records = []) {
  const map = new Map();
  for (const record of records) {
    if (record?.operationId) {
      const list = map.get(record.operationId) || [];
      list.push(record);
      map.set(record.operationId, list);
    }
  }
  return map;
}

function singleByOperation(records = []) {
  const map = new Map();
  for (const record of records) {
    if (record?.operationId) map.set(record.operationId, record);
  }
  return map;
}

function executorFor(admission = {}) {
  if (admission.dispatchKind === 'compute-manager-solver-task') return 'compute-manager';
  if (admission.dispatchKind === 'model-local-law') return 'model-local';
  return 'local-report';
}

function queueStatusFor({
  admission = {},
  planOperation = {},
  globalProxyConverged = false,
  authoritativeMutationReady = false
} = {}) {
  if (admission.proxyBlocked || planOperation.proxyBlocked) return 'blocked-proxy-constraint';
  if (!admission.canSubmitToComputeManager && admission.dispatchKind === 'compute-manager-solver-task') {
    return 'blocked-dispatch-admission';
  }
  if (admission.dispatchKind === 'local-report') return 'local-report-only';
  if (!globalProxyConverged) return 'ready-proxy-dispatch-global-proxy-blocked';
  if (admission.scientificBlocked) return 'ready-proxy-dispatch-scientific-blocked';
  if (authoritativeMutationReady) return 'ready-authoritative-dispatch';
  return 'ready-proxy-dispatch';
}

function entryPriority({ planOperation = {}, admission = {}, activeLayerId = 'unknown' } = {}) {
  const phase = finite(planOperation.phaseIndex, 0);
  const sequence = finite(planOperation.sequenceIndex, 0);
  const activeLayerBias = planOperation.layer === activeLayerId || admission.layer === activeLayerId ? -25 : 0;
  const computeBias = admission.dispatchKind === 'compute-manager-solver-task' ? -5 : 0;
  return rounded(activeLayerBias + computeBias + phase * 10 + sequence, 3);
}

function makeQueueEntry({
  admission = {},
  planOperation = {},
  applications = [],
  index = 0,
  activeLayerId = 'unknown',
  globalProxyConverged = false,
  authoritativeMutationReady = false
} = {}) {
  const status = queueStatusFor({
    admission,
    planOperation,
    globalProxyConverged,
    authoritativeMutationReady
  });
  const executor = executorFor(admission);
  const ready = status.startsWith('ready-');
  const computeReady = ready && executor === 'compute-manager' && admission.canSubmitToComputeManager;
  const modelLocalReady = ready && executor === 'model-local';
  const blockers = [];
  if (!globalProxyConverged) {
    blockers.push({
      id: 'global-proxy-consistency',
      reason: 'The graph has a proxy blocker, so this queue entry is dispatchable only as partial proxy telemetry.'
    });
  }
  if (admission.scientificBlocked) {
    blockers.push({
      id: 'scientific-readiness',
      reason: 'The operation can dispatch for proxy telemetry, but result mutation is scientifically blocked.'
    });
  }
  if (planOperation.requiresAuthoritativeMutation && !authoritativeMutationReady) {
    blockers.push({
      id: 'authoritative-mutation',
      reason: 'Authoritative state mutation is not enabled for this law operation.'
    });
  }
  if (planOperation.requiresCalibratedLaw && !authoritativeMutationReady) {
    blockers.push({
      id: 'calibrated-law',
      reason: 'Scientific dispatch needs calibrated law surfaces and validation tolerances.'
    });
  }
  if (status === 'blocked-proxy-constraint') {
    blockers.push({
      id: 'proxy-constraint',
      reason: 'A proxy constraint blocks dispatch.'
    });
  }
  const stateApplicationIds = applications.map((application) => application.id);
  const outputStateNodeIds = applications.map((application) => application.stateNodeId).filter(Boolean);
  const stateManagerScopes = [...new Set(applications.map((application) => application.stateManagerScope).filter(Boolean))];
  return {
    id: `queue:${admission.operationId || index}`,
    queueIndex: index,
    operationId: admission.operationId || null,
    lawNodeId: admission.lawNodeId || null,
    solverId: admission.solverId || planOperation.solverId || null,
    layer: planOperation.layer || admission.layer || 'runtime',
    phaseIndex: planOperation.phaseIndex ?? null,
    sequenceIndex: planOperation.sequenceIndex ?? null,
    dispatchKind: admission.dispatchKind || planOperation.dispatchKind || 'local-report',
    executor,
    status,
    priority: entryPriority({ planOperation, admission, activeLayerId }),
    ready,
    computeManagerReady: computeReady,
    modelLocalReady,
    canSubmitToComputeManager: Boolean(computeReady),
    canRunModelLocal: Boolean(modelLocalReady),
    requiresResultAdmission: admission.requiresResultAdmission !== false,
    requiresAuthoritativeMutation: Boolean(planOperation.requiresAuthoritativeMutation || admission.requiresAuthoritativeMutation),
    requiresCalibratedLaw: Boolean(planOperation.requiresCalibratedLaw || admission.requiresCalibratedLaw),
    scientificBlocked: Boolean(admission.scientificBlocked),
    proxyBlocked: Boolean(admission.proxyBlocked || planOperation.proxyBlocked),
    readStateNodeIds: Array.isArray(planOperation.readStateNodeIds) ? [...planOperation.readStateNodeIds] : [],
    writeStateNodeIds: Array.isArray(planOperation.writeStateNodeIds) ? [...planOperation.writeStateNodeIds] : outputStateNodeIds,
    outputStateNodeIds,
    stateApplicationIds,
    stateApplicationCount: stateApplicationIds.length,
    stateManagerScopes,
    blockerCount: blockers.length,
    blockers
  };
}

function makeBatches(entries = []) {
  const groups = new Map();
  for (const entry of entries) {
    const key = `${entry.executor}:${entry.layer}`;
    if (!groups.has(key)) {
      groups.set(key, {
        id: `batch:${key}`,
        executor: entry.executor,
        layer: entry.layer,
        entryIds: [],
        readyEntryCount: 0,
        computeManagerReadyCount: 0,
        modelLocalReadyCount: 0,
        scientificBlockedCount: 0,
        partialProxyCount: 0
      });
    }
    const group = groups.get(key);
    group.entryIds.push(entry.id);
    if (entry.ready) group.readyEntryCount += 1;
    if (entry.computeManagerReady) group.computeManagerReadyCount += 1;
    if (entry.modelLocalReady) group.modelLocalReadyCount += 1;
    if (entry.scientificBlocked) group.scientificBlockedCount += 1;
    if (entry.status === 'ready-proxy-dispatch-global-proxy-blocked') group.partialProxyCount += 1;
  }
  return [...groups.values()].sort((a, b) => {
    if (a.executor !== b.executor) return a.executor.localeCompare(b.executor);
    return a.layer.localeCompare(b.layer);
  });
}

function nextQueueAction(entries = [], globalProxyConverged = false) {
  const ready = entries.find((entry) => entry.ready);
  if (ready) {
    if (!globalProxyConverged) return `partial-dispatch:${ready.operationId}`;
    return `${ready.executor === 'compute-manager' ? 'dispatch' : 'run-local'}:${ready.operationId}`;
  }
  const blocked = entries.find((entry) => entry.proxyBlocked || entry.blockerCount > 0);
  if (blocked) return `resolve:${blocked.blockers[0]?.id || blocked.operationId}`;
  return 'queue-idle';
}

export function createLawGraphDispatchQueue({
  updatePlan = null,
  proposalAdmission = null,
  timeSeconds = 0,
  activeLayerId = 'unknown'
} = {}) {
  const plan = updatePlan || {};
  const admission = proposalAdmission || {};
  const planOperationById = singleByOperation(Array.isArray(plan.operations) ? plan.operations : []);
  const applicationsByOperation = byOperation(Array.isArray(admission.stateApplications) ? admission.stateApplications : []);
  const dispatchAdmissions = Array.isArray(admission.dispatchAdmissions) ? admission.dispatchAdmissions : [];
  const globalProxyConverged = admission.proxyConverged === true;
  const authoritativeMutationReady = admission.authoritativeMutationReady === true;
  const entries = dispatchAdmissions
    .map((dispatchAdmission, index) => makeQueueEntry({
      admission: dispatchAdmission,
      planOperation: planOperationById.get(dispatchAdmission.operationId) || {},
      applications: applicationsByOperation.get(dispatchAdmission.operationId) || [],
      index,
      activeLayerId,
      globalProxyConverged,
      authoritativeMutationReady
    }))
    .sort((a, b) => a.priority - b.priority || a.queueIndex - b.queueIndex)
    .map((entry, queueIndex) => ({ ...entry, queueIndex }));
  const readyEntries = entries.filter((entry) => entry.ready);
  const computeReadyEntries = entries.filter((entry) => entry.computeManagerReady);
  const modelLocalReadyEntries = entries.filter((entry) => entry.modelLocalReady);
  const partialProxyEntries = entries.filter((entry) => entry.status === 'ready-proxy-dispatch-global-proxy-blocked');
  const scientificBlockedEntries = entries.filter((entry) => entry.scientificBlocked);
  const blockedEntries = entries.filter((entry) => entry.status.startsWith('blocked-'));
  const batches = makeBatches(entries);
  const status = entries.length === 0
    ? 'dispatch-queue-empty'
    : !globalProxyConverged && readyEntries.length > 0
      ? 'partial-proxy-dispatch-ready-proxy-blocked'
      : readyEntries.length > 0
        ? authoritativeMutationReady
          ? 'authoritative-dispatch-ready'
          : 'proxy-dispatch-ready-scientific-blocked'
        : 'dispatch-queue-blocked';
  return {
    schema: MULTISCALE_LAW_GRAPH_DISPATCH_QUEUE_SCHEMA,
    modelId: 'bipartite-law-operation-dispatch-queue-v0',
    mode: 'scheduler-facing-proxy-dispatch-queue',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    activeLayerId,
    updatePlanSchema: plan.schema || null,
    proposalAdmissionSchema: admission.schema || null,
    proxyConverged: globalProxyConverged,
    scientificConverged: admission.scientificConverged === true,
    authoritativeMutationReady,
    queueEntryCount: entries.length,
    readyEntryCount: readyEntries.length,
    blockedEntryCount: blockedEntries.length,
    computeManagerReadyCount: computeReadyEntries.length,
    modelLocalReadyCount: modelLocalReadyEntries.length,
    partialProxyReadyCount: partialProxyEntries.length,
    scientificBlockedEntryCount: scientificBlockedEntries.length,
    resultAdmissionRequiredCount: entries.filter((entry) => entry.requiresResultAdmission).length,
    stateApplicationLinkCount: entries
      .map((entry) => entry.stateApplicationCount)
      .reduce((sum, value) => sum + value, 0),
    batchCount: batches.length,
    nextDispatchEntryId: readyEntries[0]?.id || null,
    nextBlockedDispatchEntryId: blockedEntries[0]?.id || null,
    nextQueueAction: nextQueueAction(entries, globalProxyConverged),
    entries,
    batches,
    residualTargets: [
      {
        id: 'residual:dispatch-proxy-blocked',
        quantity: 'proxy-blocked dispatch entries',
        current: blockedEntries.length,
        target: 0,
        satisfied: blockedEntries.length === 0
      },
      {
        id: 'residual:dispatch-scientific-blocked',
        quantity: 'scientific-blocked ready dispatch entries',
        current: scientificBlockedEntries.length,
        target: 0,
        satisfied: scientificBlockedEntries.length === 0
      },
      {
        id: 'residual:authoritative-dispatch-readiness',
        quantity: 'authoritative dispatch readiness',
        current: authoritativeMutationReady ? 1 : 0,
        target: 1,
        satisfied: authoritativeMutationReady
      }
    ],
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'This queue is scheduler-facing telemetry and does not submit tasks by itself.',
        'Partial proxy dispatch remains separated from scientific authoritative mutation.'
      ]
    },
    provenance: {
      source: 'demos/multiscale/src/simulation/lawGraphDispatchQueue.js',
      generatedFrom: 'peercompute.multiscale.law-graph-proposal-admission.v0'
    }
  };
}
