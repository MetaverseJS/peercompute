export const MULTISCALE_LAW_GRAPH_STATE_APPLICATION_PREFLIGHT_SCHEMA =
  'peercompute.multiscale.law-graph-state-application-preflight.v0';

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function rounded(value, digits = 4) {
  return Number(finite(value).toFixed(digits));
}

function buildManifestLookup(schedulerManifest = null) {
  const entries = Array.isArray(schedulerManifest?.entries) ? schedulerManifest.entries : [];
  const byManifestId = new Map();
  const byOperationId = new Map();
  const byQueueEntryId = new Map();
  const bySolverId = new Map();
  for (const entry of entries) {
    if (entry?.id && !byManifestId.has(entry.id)) byManifestId.set(entry.id, entry);
    if (entry?.operationId && !byOperationId.has(entry.operationId)) byOperationId.set(entry.operationId, entry);
    if (entry?.queueEntryId && !byQueueEntryId.has(entry.queueEntryId)) byQueueEntryId.set(entry.queueEntryId, entry);
    if (entry?.solverDescriptorId && !bySolverId.has(entry.solverDescriptorId)) bySolverId.set(entry.solverDescriptorId, entry);
    if (entry?.solverId && !bySolverId.has(entry.solverId)) bySolverId.set(entry.solverId, entry);
  }
  return {
    entries,
    find(admissionEntry = {}) {
      return byManifestId.get(admissionEntry.manifestEntryId)
        || byOperationId.get(admissionEntry.operationId)
        || byQueueEntryId.get(admissionEntry.queueEntryId)
        || bySolverId.get(admissionEntry.solverDescriptorId)
        || bySolverId.get(admissionEntry.solverId)
        || null;
    }
  };
}

function statusForEntry({
  applicationPreflightRequired = false,
  proxyAdmitted = false,
  stateApplicationLinked = false,
  proxyApplicationReady = false,
  authoritativeMutationReady = false,
  scientificBlocked = false
} = {}) {
  if (!applicationPreflightRequired) return 'state-application-not-required';
  if (!proxyAdmitted) return 'state-application-wait-result-admission';
  if (!stateApplicationLinked) return 'state-application-target-missing';
  if (proxyApplicationReady && authoritativeMutationReady && !scientificBlocked) return 'authoritative-state-application-ready';
  if (proxyApplicationReady && scientificBlocked) return 'proxy-state-application-ready-scientific-blocked';
  if (proxyApplicationReady) return 'proxy-state-application-ready';
  return 'state-application-blocked';
}

function nextApplicationAction(entries = []) {
  const required = entries.filter((entry) => entry.applicationPreflightRequired);
  const waitResult = required.find((entry) => !entry.proxyAdmitted);
  if (waitResult) return `wait-result-admission:${waitResult.solverDescriptorId || waitResult.solverId || 'unknown'}`;
  const missingLink = required.find((entry) => !entry.stateApplicationLinked);
  if (missingLink) return `link-state-application:${missingLink.solverDescriptorId || missingLink.solverId || 'unknown'}`;
  const scientificBlocked = required.find((entry) => entry.proxyApplicationReady && entry.scientificBlocked);
  if (scientificBlocked) return `scientific-state-application-blocked:${scientificBlocked.solverDescriptorId || scientificBlocked.solverId || 'unknown'}`;
  const ready = required.find((entry) => entry.proxyApplicationReady);
  if (ready) return `proxy-state-application-ready:${ready.solverDescriptorId || ready.solverId || 'unknown'}`;
  return 'state-application-preflight-idle';
}

export function createLawGraphStateApplicationPreflight({
  resultAdmission = null,
  schedulerManifest = null,
  timeSeconds = 0,
  activeLayerId = 'unknown'
} = {}) {
  const admission = resultAdmission || {};
  const admissionEntries = Array.isArray(admission.entries) ? admission.entries : [];
  const manifestLookup = buildManifestLookup(schedulerManifest);
  const authoritativeMutationReady = admission.authoritativeMutationReady === true;
  const evidenceAvailable = admission.evidenceAvailable === true;
  const entries = admissionEntries.map((admissionEntry, index) => {
    const manifestEntry = manifestLookup.find(admissionEntry);
    const stateApplicationIds = Array.isArray(manifestEntry?.stateApplicationIds)
      ? [...manifestEntry.stateApplicationIds]
      : [];
    const stateManagerScopes = Array.isArray(manifestEntry?.stateManagerScopes)
      ? [...manifestEntry.stateManagerScopes]
      : [];
    const stateApplicationLinked = Boolean(manifestEntry?.stateApplicationLinked || stateApplicationIds.length > 0);
    const applicationPreflightRequired = admissionEntry.resultAdmissionRequired === true;
    const proxyAdmitted = admissionEntry.proxyAdmitted === true;
    const scientificBlocked = admissionEntry.scientificBlocked === true || manifestEntry?.scientificBlocked === true;
    const proxyApplicationReady = applicationPreflightRequired
      && proxyAdmitted
      && stateApplicationLinked;
    return {
      id: `state-application-preflight:${admissionEntry.id || admissionEntry.operationId || index}`,
      preflightIndex: index,
      resultAdmissionEntryId: admissionEntry.id || null,
      auditEntryId: admissionEntry.auditEntryId || null,
      manifestEntryId: admissionEntry.manifestEntryId || manifestEntry?.id || null,
      queueEntryId: admissionEntry.queueEntryId || manifestEntry?.queueEntryId || null,
      operationId: admissionEntry.operationId || manifestEntry?.operationId || null,
      lawNodeId: admissionEntry.lawNodeId || manifestEntry?.lawNodeId || null,
      schedulerLane: admissionEntry.schedulerLane || manifestEntry?.schedulerLane || 'unknown',
      solverId: admissionEntry.solverId || manifestEntry?.solverId || null,
      solverDescriptorId: admissionEntry.solverDescriptorId || manifestEntry?.solverDescriptorId || null,
      applicationPreflightRequired,
      resultAdmissionRequired: admissionEntry.resultAdmissionRequired === true,
      proxyAdmitted,
      proxyApplicationReady,
      authoritativeMutationReady: authoritativeMutationReady && proxyApplicationReady && !scientificBlocked,
      scientificBlocked,
      stateApplicationLinked,
      stateApplicationCount: finite(manifestEntry?.stateApplicationCount, stateApplicationIds.length),
      stateApplicationIds,
      stateManagerScopes,
      readStateNodeIds: Array.isArray(manifestEntry?.readStateNodeIds) ? [...manifestEntry.readStateNodeIds] : [],
      writeStateNodeIds: Array.isArray(manifestEntry?.writeStateNodeIds) ? [...manifestEntry.writeStateNodeIds] : [],
      outputStateNodeIds: Array.isArray(manifestEntry?.outputStateNodeIds) ? [...manifestEntry.outputStateNodeIds] : [],
      runtimeTaskId: admissionEntry.runtimeTaskId || null,
      runtimeStateKey: admissionEntry.runtimeStateKey || null,
      resultSchema: admissionEntry.resultSchema || null,
      resultBackend: admissionEntry.resultBackend || null,
      resultSequence: admissionEntry.resultSequence ?? null,
      warmDeltaSchema: admissionEntry.warmDeltaSchema || null,
      warmDeltaBackend: admissionEntry.warmDeltaBackend || null,
      warmDeltaSequence: admissionEntry.warmDeltaSequence ?? null,
      sequenceConsistent: admissionEntry.sequenceConsistent !== false,
      status: statusForEntry({
        applicationPreflightRequired,
        proxyAdmitted,
        stateApplicationLinked,
        proxyApplicationReady,
        authoritativeMutationReady,
        scientificBlocked
      })
    };
  });
  const requiredEntries = entries.filter((entry) => entry.applicationPreflightRequired);
  const proxyReadyEntries = requiredEntries.filter((entry) => entry.proxyApplicationReady);
  const authoritativeReadyEntries = requiredEntries.filter((entry) => entry.authoritativeMutationReady);
  const scientificBlockedEntries = requiredEntries.filter((entry) => entry.proxyApplicationReady && entry.scientificBlocked);
  const waitingResultEntries = requiredEntries.filter((entry) => !entry.proxyAdmitted);
  const missingLinkEntries = requiredEntries.filter((entry) => entry.proxyAdmitted && !entry.stateApplicationLinked);
  const allRequiredReady = requiredEntries.length > 0
    && proxyReadyEntries.length === requiredEntries.length;
  const status = entries.length === 0
    ? 'state-application-preflight-empty'
    : !evidenceAvailable
      ? 'state-application-evidence-unavailable'
      : requiredEntries.length === 0
        ? 'state-application-not-required'
        : allRequiredReady && authoritativeMutationReady
          ? 'authoritative-state-application-ready'
          : allRequiredReady && scientificBlockedEntries.length > 0
            ? 'proxy-state-application-ready-scientific-blocked'
            : allRequiredReady
              ? 'proxy-state-application-ready'
              : proxyReadyEntries.length > 0
                ? scientificBlockedEntries.length > 0
                  ? 'state-application-partial-scientific-blocked'
                  : 'state-application-partial'
                : waitingResultEntries.length > 0
                  ? 'state-application-waiting-result-admission'
                  : 'state-application-blocked';
  return {
    schema: MULTISCALE_LAW_GRAPH_STATE_APPLICATION_PREFLIGHT_SCHEMA,
    modelId: 'bipartite-law-operation-state-application-preflight-v0',
    mode: 'worker-result-state-application-preflight',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    activeLayerId,
    resultAdmissionSchema: admission.schema || null,
    schedulerManifestSchema: schedulerManifest?.schema || null,
    proxyConverged: admission.proxyConverged === true,
    scientificConverged: admission.scientificConverged === true,
    authoritativeMutationReady,
    evidenceAvailable,
    preflightEntryCount: entries.length,
    applicationPreflightRequiredCount: requiredEntries.length,
    proxyApplicationReadyCount: proxyReadyEntries.length,
    authoritativeReadyApplicationCount: authoritativeReadyEntries.length,
    scientificBlockedApplicationCount: scientificBlockedEntries.length,
    waitingResultAdmissionCount: waitingResultEntries.length,
    missingStateApplicationLinkCount: missingLinkEntries.length,
    stateApplicationLinkedCount: requiredEntries.filter((entry) => entry.stateApplicationLinked).length,
    stateApplicationLinkCount: requiredEntries
      .map((entry) => finite(entry.stateApplicationCount, 0))
      .reduce((sum, value) => sum + value, 0),
    manifestEntryCount: manifestLookup.entries.length,
    nextStateApplicationAction: nextApplicationAction(entries),
    entries,
    residualTargets: [
      {
        id: 'residual:state-application-result-admission',
        quantity: 'state-application preflight entries waiting on proxy result admission',
        current: waitingResultEntries.length,
        target: 0,
        satisfied: waitingResultEntries.length === 0
      },
      {
        id: 'residual:state-application-link-missing',
        quantity: 'proxy-admitted worker results without StateManager application links',
        current: missingLinkEntries.length,
        target: 0,
        satisfied: missingLinkEntries.length === 0
      },
      {
        id: 'residual:state-application-scientific-blocked',
        quantity: 'proxy-ready state applications still blocked from authoritative mutation',
        current: scientificBlockedEntries.length,
        target: 0,
        satisfied: scientificBlockedEntries.length === 0
      }
    ],
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'This preflight maps proxy-admitted worker results to state-application targets only; it does not mutate StateManager or worker buffers.',
        'Authoritative application remains blocked until scientific invariants, calibrated laws, and conservative mutation gates pass.'
      ]
    },
    provenance: {
      source: 'demos/multiscale/src/simulation/lawGraphStateApplicationPreflight.js',
      generatedFrom: [
        'peercompute.multiscale.law-graph-result-admission.v0',
        'peercompute.multiscale.law-graph-scheduler-manifest.v0'
      ]
    }
  };
}
