export const MULTISCALE_LAW_GRAPH_PROPOSAL_ADMISSION_SCHEMA = 'peercompute.multiscale.law-graph-proposal-admission.v0';

const STATE_MANAGER_SCOPE_BY_STATE = new Map([
  ['state:quantum-orbital-closure', 'multiscale-closures'],
  ['state:quantum-material-potential', 'multiscale-closures'],
  ['state:reference-material-packet', 'multiscale-closures'],
  ['state:molecular-dynamics', 'multiscale-solvers'],
  ['state:molecular-source-buffer', 'multiscale-source-buffers'],
  ['state:reactive-thermal-cell', 'multiscale-solvers'],
  ['state:sph-material', 'multiscale-solvers'],
  ['state:cross-scale-coupling', 'multiscale-couplings'],
  ['state:conservation-audit', 'multiscale-conservation']
]);

const STATE_FAMILY_BY_STATE = new Map([
  ['state:quantum-orbital-closure', 'quantum-orbital'],
  ['state:quantum-material-potential', 'quantum-material-potential'],
  ['state:reference-material-packet', 'quantum-material-potential'],
  ['state:molecular-dynamics', 'molecular-dynamics'],
  ['state:molecular-source-buffer', 'molecular-source-buffer'],
  ['state:reactive-thermal-cell', 'reactive-thermal-cell'],
  ['state:sph-material', 'sph-material'],
  ['state:cross-scale-coupling', 'cross-scale-coupling'],
  ['state:conservation-audit', 'conservation-audit']
]);

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function rounded(value, digits = 4) {
  return Number(finite(value).toFixed(digits));
}

function byId(records = []) {
  const map = new Map();
  for (const record of records) {
    if (record?.id) map.set(record.id, record);
    if (record?.operationId) map.set(record.operationId, record);
  }
  return map;
}

function stateFamilyFor(stateNodeId = '', proposal = {}) {
  if (STATE_FAMILY_BY_STATE.has(stateNodeId)) return STATE_FAMILY_BY_STATE.get(stateNodeId);
  if (String(stateNodeId).startsWith('state:ambient-') || stateNodeId === 'state:gravity') return 'environment-boundary';
  if (String(stateNodeId).startsWith('state:active-orbital')) return 'quantum-orbital';
  if (String(stateNodeId).startsWith('state:reference-')) return 'quantum-material-potential';
  return proposal.layer || 'law-graph';
}

function stateManagerScopeFor(stateNodeId = '', proposal = {}) {
  if (STATE_MANAGER_SCOPE_BY_STATE.has(stateNodeId)) return STATE_MANAGER_SCOPE_BY_STATE.get(stateNodeId);
  const family = stateFamilyFor(stateNodeId, proposal);
  if (family === 'environment-boundary') return 'multiscale-law-graph';
  if (family === 'quantum-orbital' || family === 'quantum-material-potential') return 'multiscale-closures';
  return 'multiscale-law-graph';
}

function proposalAdmissionStatus(proposal = {}, operation = {}, authoritativeMutationReady = false) {
  if (proposal.status === 'blocked-proxy-constraint' || operation.proxyBlocked) return 'blocked-proxy-constraint';
  if (proposal.status === 'ready-authoritative' && authoritativeMutationReady) return 'authoritative-mutation-ready';
  if (proposal.status === 'proposal-only-scientific-blocked' || operation.scientificBlocked) {
    return 'proxy-warm-delta-ready-scientific-blocked';
  }
  return 'proxy-warm-delta-ready';
}

function admissionBlockers(proposal = {}, operation = {}, authoritativeMutationReady = false) {
  const blockers = [];
  if (operation.proxyBlocked || proposal.status === 'blocked-proxy-constraint') {
    blockers.push({
      id: 'proxy-constraint',
      reason: 'A graph constraint blocks this proposal before proxy state admission.'
    });
  }
  if (operation.scientificBlocked || proposal.status === 'proposal-only-scientific-blocked') {
    blockers.push({
      id: 'scientific-readiness',
      reason: 'The proposal can be published as proxy telemetry but cannot mutate authoritative state yet.'
    });
  }
  if (proposal.requiresAuthoritativeMutation && !authoritativeMutationReady) {
    blockers.push({
      id: 'authoritative-mutation',
      reason: 'Authoritative worker/state mutation requires calibrated laws, invariants, and validated writeback.'
    });
  }
  if (proposal.requiresCalibratedLaw && !authoritativeMutationReady) {
    blockers.push({
      id: 'calibrated-law',
      reason: 'Scientific admission needs a calibrated law surface with validation tolerances.'
    });
  }
  return blockers;
}

function makeStateApplication(proposal = {}, operation = {}, index = 0, authoritativeMutationReady = false) {
  const status = proposalAdmissionStatus(proposal, operation, authoritativeMutationReady);
  const blockers = admissionBlockers(proposal, operation, authoritativeMutationReady);
  const stateFamily = stateFamilyFor(proposal.stateNodeId, proposal);
  const stateManagerScope = stateManagerScopeFor(proposal.stateNodeId, proposal);
  const canPublishWarmDelta = !operation.proxyBlocked && status !== 'blocked-proxy-constraint';
  const canApplyAuthoritative = status === 'authoritative-mutation-ready';
  return {
    id: `admission:${proposal.id || index}`,
    proposalId: proposal.id || null,
    operationId: proposal.operationId || operation.operationId || null,
    lawNodeId: proposal.lawNodeId || operation.lawNodeId || null,
    stateNodeId: proposal.stateNodeId || null,
    stateFamily,
    layer: proposal.layer || operation.layer || 'runtime',
    quantity: proposal.quantity || null,
    units: proposal.units || 'reduced',
    status,
    mode: canApplyAuthoritative ? 'authoritative-worker-mutation' : 'proxy-state-manager-warm-delta',
    stateManagerScope,
    writerKind: canApplyAuthoritative ? 'authoritative-worker-buffer' : 'state-manager-warm-delta',
    canPublishWarmDelta,
    canApplyAuthoritative,
    canDispatchComputeTask: Boolean(operation.dispatchReady && operation.dispatchKind === 'compute-manager-solver-task'),
    residualProxy: rounded(proposal.residualProxy || operation.proxyResidual || 0, 6),
    residualScientific: rounded(proposal.residualScientific || operation.scientificResidual || 0, 6),
    blockerCount: blockers.length,
    blockers
  };
}

function makeDispatchAdmission(operation = {}, planOperation = {}) {
  const computeManagerTask = operation.dispatchKind === 'compute-manager-solver-task';
  const canSubmitToComputeManager = computeManagerTask && operation.dispatchReady && !operation.proxyBlocked;
  const status = !operation.dispatchReady || operation.proxyBlocked
    ? 'dispatch-blocked'
    : operation.scientificBlocked
      ? 'proxy-dispatch-ready-scientific-blocked'
      : 'dispatch-ready';
  return {
    id: `dispatch:${operation.operationId}`,
    operationId: operation.operationId,
    lawNodeId: operation.lawNodeId,
    solverId: operation.solverId || planOperation.solverId || null,
    layer: planOperation.layer || 'runtime',
    dispatchKind: operation.dispatchKind || planOperation.dispatchKind || 'local-report',
    status,
    canSubmitToComputeManager,
    requiresResultAdmission: true,
    requiresAuthoritativeMutation: Boolean(planOperation.requiresAuthoritativeMutation),
    requiresCalibratedLaw: Boolean(planOperation.requiresCalibratedLaw),
    scientificBlocked: Boolean(operation.scientificBlocked),
    proxyBlocked: Boolean(operation.proxyBlocked),
    proposedWriteCount: operation.proposedWriteCount || 0,
    blockerCount: (operation.proxyBlocked ? 1 : 0) + (operation.scientificBlocked ? 1 : 0)
  };
}

function groupByScope(applications = []) {
  const groups = new Map();
  for (const application of applications) {
    const key = application.stateManagerScope || 'multiscale-law-graph';
    if (!groups.has(key)) {
      groups.set(key, {
        scope: key,
        proposalCount: 0,
        warmDeltaReadyCount: 0,
        authoritativeReadyCount: 0,
        scientificBlockedCount: 0,
        stateFamilies: []
      });
    }
    const group = groups.get(key);
    group.proposalCount += 1;
    if (application.canPublishWarmDelta) group.warmDeltaReadyCount += 1;
    if (application.canApplyAuthoritative) group.authoritativeReadyCount += 1;
    if (application.status.includes('scientific-blocked')) group.scientificBlockedCount += 1;
    if (!group.stateFamilies.includes(application.stateFamily)) group.stateFamilies.push(application.stateFamily);
  }
  return [...groups.values()].sort((a, b) => a.scope.localeCompare(b.scope));
}

function nextAdmissionAction({ applications = [], dispatchAdmissions = [], consistencySolve = {}, updatePlan = {} } = {}) {
  if (!consistencySolve.convergedProxy) {
    return updatePlan.nextBlockedOperationId || consistencySolve.nextBlockedOperationId || 'resolve-proxy-constraints';
  }
  const dispatch = dispatchAdmissions.find((item) => item.canSubmitToComputeManager);
  if (dispatch) return `dispatch:${dispatch.operationId}`;
  const warmDelta = applications.find((item) => item.canPublishWarmDelta);
  if (warmDelta) return `publish:${warmDelta.stateNodeId}`;
  const scientific = applications.find((item) => item.status.includes('scientific-blocked'));
  if (scientific) return `satisfy:${scientific.blockers[0]?.id || 'scientific-readiness'}`;
  return 'no-admissible-proposals';
}

export function createLawGraphProposalAdmission({
  updatePlan = null,
  consistencySolve = null,
  timeSeconds = 0,
  activeLayerId = 'unknown'
} = {}) {
  const plan = updatePlan || {};
  const solve = consistencySolve || {};
  const planOperationById = byId(Array.isArray(plan.operations) ? plan.operations : []);
  const operationSolveById = byId(Array.isArray(solve.operationSolves) ? solve.operationSolves : []);
  const proposals = Array.isArray(solve.proposedStateUpdates) ? solve.proposedStateUpdates : [];
  const authoritativeMutationReady = Boolean(solve.authoritativeMutationReady && solve.convergedScientific);
  const stateApplications = proposals.map((proposal, index) => makeStateApplication(
    proposal,
    {
      ...(planOperationById.get(proposal.operationId) || {}),
      ...(operationSolveById.get(proposal.operationId) || {})
    },
    index,
    authoritativeMutationReady
  ));
  const dispatchAdmissions = (Array.isArray(solve.operationSolves) ? solve.operationSolves : [])
    .filter((operation) => operation.dispatchKind && operation.dispatchKind !== 'local-report')
    .map((operation) => makeDispatchAdmission(operation, planOperationById.get(operation.operationId) || {}));
  const warmDeltaReadyApplications = stateApplications.filter((application) => application.canPublishWarmDelta);
  const authoritativeReadyApplications = stateApplications.filter((application) => application.canApplyAuthoritative);
  const scientificBlockedApplications = stateApplications.filter((application) => application.status.includes('scientific-blocked'));
  const blockedApplications = stateApplications.filter((application) => application.status === 'blocked-proxy-constraint');
  const computeDispatchReadyAdmissions = dispatchAdmissions.filter((admission) => admission.canSubmitToComputeManager);
  const status = !solve.convergedProxy
    ? 'proxy-admission-blocked'
    : authoritativeMutationReady
      ? 'scientific-admission-ready'
      : warmDeltaReadyApplications.length > 0 || computeDispatchReadyAdmissions.length > 0
        ? 'proxy-admission-ready-scientific-blocked'
        : 'proxy-admission-idle';
  return {
    schema: MULTISCALE_LAW_GRAPH_PROPOSAL_ADMISSION_SCHEMA,
    modelId: 'bipartite-state-update-admission-v0',
    mode: 'state-manager-and-dispatch-admission-plan',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    activeLayerId,
    updatePlanSchema: plan.schema || null,
    consistencySolveSchema: solve.schema || null,
    proxyConverged: Boolean(solve.convergedProxy),
    scientificConverged: Boolean(solve.convergedScientific),
    authoritativeMutationReady,
    proposalCount: proposals.length,
    stateApplicationCount: stateApplications.length,
    proxyWarmDeltaReadyCount: warmDeltaReadyApplications.length,
    blockedApplicationCount: blockedApplications.length,
    scientificBlockedApplicationCount: scientificBlockedApplications.length,
    authoritativeReadyApplicationCount: authoritativeReadyApplications.length,
    stateManagerScopeCount: groupByScope(stateApplications).length,
    dispatchAdmissionCount: dispatchAdmissions.length,
    computeManagerDispatchReadyCount: computeDispatchReadyAdmissions.length,
    authoritativeMutationBlockedCount: stateApplications.filter((application) => (
      application.blockers.some((blocker) => blocker.id === 'authoritative-mutation')
    )).length,
    calibratedLawBlockedCount: stateApplications.filter((application) => (
      application.blockers.some((blocker) => blocker.id === 'calibrated-law')
    )).length,
    closedResidualProxy: rounded(solve.closedResidualProxy || 0, 6),
    scientificResidual: rounded(solve.scientificResidual || 0, 6),
    nextAdmissionAction: nextAdmissionAction({
      applications: stateApplications,
      dispatchAdmissions,
      consistencySolve: solve,
      updatePlan: plan
    }),
    stateManagerScopes: groupByScope(stateApplications),
    stateApplications,
    dispatchAdmissions,
    blockers: [
      ...blockedApplications.map((application) => ({
        id: `${application.id}:proxy`,
        proposalId: application.proposalId,
        severity: 'blocking',
        reason: 'Proxy constraint blocks this state application.'
      })),
      ...scientificBlockedApplications.map((application) => ({
        id: `${application.id}:scientific`,
        proposalId: application.proposalId,
        severity: 'scientific-blocker',
        reason: 'Proxy admission is visible, but scientific mutation is still blocked.'
      }))
    ],
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'This report admits solve proposals to warm-delta and dispatch plans only.',
        'It does not mutate authoritative state or worker buffers.'
      ]
    },
    provenance: {
      source: 'demos/multiscale/src/simulation/lawGraphProposalAdmission.js',
      generatedFrom: 'peercompute.multiscale.law-graph-consistency-solve.v0'
    }
  };
}
