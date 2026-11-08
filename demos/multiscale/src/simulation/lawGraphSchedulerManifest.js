export const MULTISCALE_LAW_GRAPH_SCHEDULER_MANIFEST_SCHEMA =
  'peercompute.multiscale.law-graph-scheduler-manifest.v0';

const SOLVER_DESCRIPTORS_SCHEMA = 'peercompute.multiscale.solver-descriptors.v0';
const SOLVER_DESCRIPTOR_ALIASES = {
  'quantum-orbital-closure': 'quantum-orbital-grid'
};

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function rounded(value, digits = 4) {
  return Number(finite(value).toFixed(digits));
}

function descriptorMapFrom(solverDescriptors = []) {
  const descriptors = Array.isArray(solverDescriptors)
    ? solverDescriptors
    : Array.isArray(solverDescriptors?.solvers)
      ? solverDescriptors.solvers
      : [];
  return new Map(descriptors
    .filter((descriptor) => descriptor?.id)
    .map((descriptor) => [descriptor.id, descriptor]));
}

function descriptorIdFor(solverId = null, descriptorById = new Map()) {
  if (!solverId) return null;
  if (descriptorById.has(solverId)) return solverId;
  const alias = SOLVER_DESCRIPTOR_ALIASES[solverId] || null;
  if (alias && descriptorById.has(alias)) return alias;
  return solverId;
}

function schedulerLaneFor(entry = {}) {
  if (entry.dispatchKind === 'compute-manager-solver-task' || entry.executor === 'compute-manager') {
    return 'compute-manager';
  }
  if (entry.dispatchKind === 'model-local-law' || entry.executor === 'model-local') {
    return 'model-local';
  }
  return 'telemetry';
}

function hasRunnableExecutor(descriptor = null) {
  return Boolean(descriptor?.module && descriptor?.exportName);
}

function makeManifestEntry({
  queueEntry = {},
  descriptor = null,
  descriptorSolverId = null,
  index = 0
} = {}) {
  const schedulerLane = schedulerLaneFor(queueEntry);
  const descriptorRequired = schedulerLane === 'compute-manager';
  const descriptorResolved = Boolean(descriptor);
  const hasExecutor = !descriptorRequired || hasRunnableExecutor(descriptor);
  const warmDeltaScope = descriptor?.warmDelta?.scope || null;
  const warmDeltaSchema = descriptor?.warmDelta?.schema || null;
  const readyForScheduler = Boolean(
    schedulerLane === 'compute-manager'
    && queueEntry.computeManagerReady
    && descriptorResolved
    && hasExecutor
  );
  const readyForModelLocal = Boolean(
    schedulerLane === 'model-local'
    && queueEntry.modelLocalReady
  );
  const readyForTelemetry = Boolean(
    schedulerLane === 'telemetry'
    && (queueEntry.ready || queueEntry.status === 'local-report-only')
  );
  const blockers = Array.isArray(queueEntry.blockers)
    ? queueEntry.blockers.map((blocker) => ({ ...blocker }))
    : [];
  if (queueEntry.solverId && descriptorRequired && !descriptorResolved) {
    blockers.push({
      id: 'descriptor-missing',
      reason: `No registered solver descriptor was found for ${queueEntry.solverId}.`
    });
  }
  if (descriptorRequired && descriptorResolved && !hasRunnableExecutor(descriptor)) {
    blockers.push({
      id: 'executor-missing',
      reason: `Registered descriptor ${queueEntry.solverId} has no runnable module/export executor.`
    });
  }
  if (queueEntry.scientificBlocked && !blockers.some((blocker) => blocker.id === 'scientific-readiness')) {
    blockers.push({
      id: 'scientific-readiness',
      reason: 'The scheduler can route proxy work, but authoritative mutation is scientifically blocked.'
    });
  }
  if (queueEntry.requiresAuthoritativeMutation && !queueEntry.requiresResultAdmission && !blockers.some((blocker) => blocker.id === 'authoritative-mutation')) {
    blockers.push({
      id: 'authoritative-mutation',
      reason: 'Authoritative state mutation is required before this result can be applied.'
    });
  }
  if (!queueEntry.ready && queueEntry.status !== 'local-report-only') {
    blockers.push({
      id: 'dispatch-queue-entry-blocked',
      reason: `Dispatch queue entry is not ready: ${queueEntry.status || 'unknown'}.`
    });
  }
  return {
    id: `manifest:${queueEntry.operationId || queueEntry.id || index}`,
    manifestIndex: index,
    queueEntryId: queueEntry.id || null,
    operationId: queueEntry.operationId || null,
    lawNodeId: queueEntry.lawNodeId || null,
    solverId: queueEntry.solverId || null,
    solverDescriptorId: descriptorResolved ? descriptorSolverId || descriptor?.id || queueEntry.solverId || null : null,
    solverDescriptorAliasFrom: descriptorResolved && descriptorSolverId && descriptorSolverId !== queueEntry.solverId
      ? queueEntry.solverId
      : null,
    layer: queueEntry.layer || 'runtime',
    phaseIndex: queueEntry.phaseIndex ?? null,
    sequenceIndex: queueEntry.sequenceIndex ?? null,
    priority: queueEntry.priority ?? index,
    dispatchKind: queueEntry.dispatchKind || 'local-report',
    schedulerLane,
    queueStatus: queueEntry.status || 'unknown',
    descriptorRequired,
    descriptorResolved,
    descriptorSchema: descriptorResolved ? SOLVER_DESCRIPTORS_SCHEMA : null,
    solverKind: descriptor?.kind || null,
    solverVersion: descriptor?.version || null,
    solverRuntime: descriptor?.runtime || null,
    solverModule: descriptor?.module || null,
    solverExportName: descriptor?.exportName || null,
    hasExecutor,
    affinityPolicy: descriptor?.affinity?.policy || null,
    affinityKeyFields: Array.isArray(descriptor?.affinity?.keyFields)
      ? [...descriptor.affinity.keyFields]
      : [],
    timestepMode: descriptor?.timestep?.mode || null,
    validityApproximation: descriptor?.validity?.approximation || null,
    warmDeltaScope,
    warmDeltaSchema,
    readyForScheduler,
    readyForModelLocal,
    readyForTelemetry,
    computeManagerReady: Boolean(queueEntry.computeManagerReady),
    modelLocalReady: Boolean(queueEntry.modelLocalReady),
    resultAdmissionRequired: Boolean(queueEntry.requiresResultAdmission),
    stateApplicationLinked: finite(queueEntry.stateApplicationCount, 0) > 0,
    stateApplicationCount: finite(queueEntry.stateApplicationCount, 0),
    stateApplicationIds: Array.isArray(queueEntry.stateApplicationIds) ? [...queueEntry.stateApplicationIds] : [],
    stateManagerScopes: Array.isArray(queueEntry.stateManagerScopes) ? [...queueEntry.stateManagerScopes] : [],
    readStateNodeIds: Array.isArray(queueEntry.readStateNodeIds) ? [...queueEntry.readStateNodeIds] : [],
    writeStateNodeIds: Array.isArray(queueEntry.writeStateNodeIds) ? [...queueEntry.writeStateNodeIds] : [],
    outputStateNodeIds: Array.isArray(queueEntry.outputStateNodeIds) ? [...queueEntry.outputStateNodeIds] : [],
    requiresAuthoritativeMutation: Boolean(queueEntry.requiresAuthoritativeMutation),
    requiresCalibratedLaw: Boolean(queueEntry.requiresCalibratedLaw),
    scientificBlocked: Boolean(queueEntry.scientificBlocked),
    proxyBlocked: Boolean(queueEntry.proxyBlocked),
    blockerCount: blockers.length,
    blockers
  };
}

function makeBatches(entries = []) {
  const groups = new Map();
  for (const entry of entries) {
    const key = `${entry.schedulerLane}:${entry.warmDeltaScope || 'none'}`;
    if (!groups.has(key)) {
      groups.set(key, {
        id: `scheduler-batch:${key}`,
        schedulerLane: entry.schedulerLane,
        warmDeltaScope: entry.warmDeltaScope,
        warmDeltaSchema: entry.warmDeltaSchema,
        entryIds: [],
        solverIds: [],
        schedulerReadyCount: 0,
        modelLocalReadyCount: 0,
        telemetryReadyCount: 0,
        unresolvedDescriptorCount: 0,
        scientificBlockedEntryCount: 0,
        blockedManifestEntryCount: 0
      });
    }
    const group = groups.get(key);
    group.entryIds.push(entry.id);
    if (entry.solverId && !group.solverIds.includes(entry.solverId)) group.solverIds.push(entry.solverId);
    if (entry.readyForScheduler) group.schedulerReadyCount += 1;
    if (entry.readyForModelLocal) group.modelLocalReadyCount += 1;
    if (entry.readyForTelemetry) group.telemetryReadyCount += 1;
    if (entry.descriptorRequired && entry.solverId && !entry.descriptorResolved) group.unresolvedDescriptorCount += 1;
    if (entry.scientificBlocked) group.scientificBlockedEntryCount += 1;
    if (entry.blockerCount > 0) group.blockedManifestEntryCount += 1;
  }
  return [...groups.values()].sort((a, b) => {
    if (a.schedulerLane !== b.schedulerLane) return a.schedulerLane.localeCompare(b.schedulerLane);
    return String(a.warmDeltaScope || '').localeCompare(String(b.warmDeltaScope || ''));
  });
}

function nextSchedulerAction({
  entries = [],
  dispatchQueue = {},
  unresolvedDescriptorCount = 0
} = {}) {
  const schedulable = entries.find((entry) => entry.readyForScheduler);
  if (schedulable) {
    if (dispatchQueue.proxyConverged === false) return `partial-schedule:${schedulable.operationId}`;
    return `schedule:${schedulable.solverId}:${schedulable.operationId}`;
  }
  const modelLocal = entries.find((entry) => entry.readyForModelLocal);
  if (modelLocal) {
    if (dispatchQueue.proxyConverged === false) return `partial-run-local:${modelLocal.operationId}`;
    return `run-local:${modelLocal.operationId}`;
  }
  if (unresolvedDescriptorCount > 0) {
    const unresolved = entries.find((entry) => entry.descriptorRequired && entry.solverId && !entry.descriptorResolved);
    return `resolve-descriptor:${unresolved?.solverId || 'unknown'}`;
  }
  const blocked = entries.find((entry) => entry.blockerCount > 0);
  if (blocked) return `resolve:${blocked.blockers[0]?.id || blocked.operationId}`;
  return 'scheduler-manifest-idle';
}

export function createLawGraphSchedulerManifest({
  dispatchQueue = null,
  solverDescriptors = [],
  timeSeconds = 0,
  activeLayerId = 'unknown'
} = {}) {
  const queue = dispatchQueue || {};
  const descriptorById = descriptorMapFrom(solverDescriptors);
  const queueEntries = Array.isArray(queue.entries) ? queue.entries : [];
  const entries = queueEntries
    .map((queueEntry, index) => {
      const descriptorSolverId = descriptorIdFor(queueEntry?.solverId, descriptorById);
      return makeManifestEntry({
        queueEntry,
        descriptor: descriptorSolverId ? descriptorById.get(descriptorSolverId) || null : null,
        descriptorSolverId,
        index
      });
    })
    .sort((a, b) => finite(a.priority, 0) - finite(b.priority, 0) || a.manifestIndex - b.manifestIndex)
    .map((entry, manifestIndex) => ({ ...entry, manifestIndex }));
  const resolvedDescriptorCount = entries.filter((entry) => entry.solverId && entry.descriptorResolved).length;
  const unresolvedDescriptorCount = entries.filter((entry) => (
    entry.descriptorRequired && entry.solverId && !entry.descriptorResolved
  )).length;
  const executorMissingCount = entries.filter((entry) => entry.schedulerLane === 'compute-manager' && entry.descriptorResolved && !entry.hasExecutor).length;
  const schedulerReadyEntries = entries.filter((entry) => entry.readyForScheduler);
  const modelLocalReadyEntries = entries.filter((entry) => entry.readyForModelLocal);
  const telemetryReadyEntries = entries.filter((entry) => entry.readyForTelemetry);
  const readyManifestEntries = entries.filter((entry) => (
    entry.readyForScheduler || entry.readyForModelLocal || entry.readyForTelemetry
  ));
  const scientificBlockedEntries = entries.filter((entry) => entry.scientificBlocked);
  const blockedManifestEntries = entries.filter((entry) => entry.blockerCount > 0);
  const stateApplicationLinkedEntries = entries.filter((entry) => entry.stateApplicationLinked);
  const batches = makeBatches(entries);
  const status = entries.length === 0
    ? 'scheduler-manifest-empty'
    : unresolvedDescriptorCount > 0 || executorMissingCount > 0
      ? 'scheduler-manifest-blocked'
      : queue.proxyConverged === false && readyManifestEntries.length > 0
        ? 'partial-proxy-scheduler-ready-proxy-blocked'
        : readyManifestEntries.length > 0 && scientificBlockedEntries.length > 0
          ? 'proxy-scheduler-ready-scientific-blocked'
          : readyManifestEntries.length > 0 && queue.authoritativeMutationReady === true
            ? 'authoritative-scheduler-ready'
            : readyManifestEntries.length > 0
              ? 'scheduler-manifest-ready'
              : 'scheduler-manifest-blocked';
  const nextAction = nextSchedulerAction({
    entries,
    dispatchQueue: queue,
    unresolvedDescriptorCount
  });
  return {
    schema: MULTISCALE_LAW_GRAPH_SCHEDULER_MANIFEST_SCHEMA,
    modelId: 'bipartite-law-operation-scheduler-manifest-v0',
    mode: 'scheduler-descriptor-resolution-manifest',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    activeLayerId,
    dispatchQueueSchema: queue.schema || null,
    solverDescriptorSchema: SOLVER_DESCRIPTORS_SCHEMA,
    proxyConverged: queue.proxyConverged === true,
    scientificConverged: queue.scientificConverged === true,
    authoritativeMutationReady: queue.authoritativeMutationReady === true,
    manifestEntryCount: entries.length,
    queueEntryCount: queue.queueEntryCount ?? entries.length,
    readyManifestEntryCount: readyManifestEntries.length,
    schedulerReadyCount: schedulerReadyEntries.length,
    computeManagerReadyCount: schedulerReadyEntries.length,
    modelLocalReadyCount: modelLocalReadyEntries.length,
    telemetryReadyCount: telemetryReadyEntries.length,
    resolvedDescriptorCount,
    unresolvedDescriptorCount,
    executorMissingCount,
    scientificBlockedEntryCount: scientificBlockedEntries.length,
    resultAdmissionRequiredCount: entries.filter((entry) => entry.resultAdmissionRequired).length,
    stateApplicationLinkedCount: stateApplicationLinkedEntries.length,
    stateApplicationLinkCount: entries
      .map((entry) => entry.stateApplicationCount)
      .reduce((sum, value) => sum + value, 0),
    blockedManifestEntryCount: blockedManifestEntries.length,
    batchCount: batches.length,
    nextSchedulableEntryId: schedulerReadyEntries[0]?.id || modelLocalReadyEntries[0]?.id || null,
    nextBlockedManifestEntryId: blockedManifestEntries[0]?.id || null,
    nextSchedulerAction: nextAction,
    entries,
    batches,
    residualTargets: [
      {
        id: 'residual:scheduler-descriptor-resolution',
        quantity: 'unresolved solver descriptors',
        current: unresolvedDescriptorCount,
        target: 0,
        satisfied: unresolvedDescriptorCount === 0
      },
      {
        id: 'residual:scheduler-executor-resolution',
        quantity: 'compute-manager descriptors without executors',
        current: executorMissingCount,
        target: 0,
        satisfied: executorMissingCount === 0
      },
      {
        id: 'residual:scheduler-scientific-blocked',
        quantity: 'scientific-blocked manifest entries',
        current: scientificBlockedEntries.length,
        target: 0,
        satisfied: scientificBlockedEntries.length === 0
      }
    ],
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'This manifest resolves law-graph queue entries onto scheduler descriptors and does not submit solver tasks.',
        'ComputeManager result admission and StateManager mutation remain separate downstream contracts.'
      ]
    },
    provenance: {
      source: 'demos/multiscale/src/simulation/lawGraphSchedulerManifest.js',
      generatedFrom: 'peercompute.multiscale.law-graph-dispatch-queue.v0'
    }
  };
}
