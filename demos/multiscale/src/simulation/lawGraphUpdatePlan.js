export const MULTISCALE_LAW_GRAPH_UPDATE_PLAN_SCHEMA = 'peercompute.multiscale.law-graph-update-plan.v0';

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function rounded(value, digits = 4) {
  return Number(finite(value).toFixed(digits));
}

function byId(nodes = []) {
  const map = new Map();
  for (const node of nodes) {
    if (node?.id) map.set(node.id, node);
  }
  return map;
}

function incomingEdges(edges = [], targetNodeId) {
  return edges.filter((edge) => edge?.targetNodeId === targetNodeId);
}

function outgoingEdges(edges = [], sourceNodeId) {
  return edges.filter((edge) => edge?.sourceNodeId === sourceNodeId);
}

function edgeIsBlocking(edge = {}) {
  const role = String(edge.role || '').toLowerCase();
  return role.includes('block') || role.includes('gate');
}

function isScientificConstraint(constraint = {}) {
  return ['scientific-blocker', 'proxy-audit', 'unknown'].includes(constraint.status);
}

function operationIdForLaw(lawNodeId = '') {
  return `op:${String(lawNodeId).replace(/^law:/, '')}`;
}

function dispatchKindForLaw(law = {}) {
  if (!law.solver) return 'local-report';
  if (['cross-scale-coupling', 'conservation-audit', 'molecular-source-equation'].includes(law.solver)) {
    return 'model-local-law';
  }
  return 'compute-manager-solver-task';
}

function scientificMutationLaw(law = {}) {
  return [
    'molecular-source-equation',
    'reactive-thermal-cell',
    'sph-material',
    'cross-scale-coupling'
  ].includes(law.solver);
}

function makeOperation({ law, edges, constraintMap, producerByState }) {
  const inEdges = incomingEdges(edges, law.id);
  const outEdges = outgoingEdges(edges, law.id);
  const readStateNodeIds = inEdges
    .filter((edge) => String(edge.sourceNodeId || '').startsWith('state:'))
    .map((edge) => edge.sourceNodeId);
  const writeStateNodeIds = outEdges
    .filter((edge) => String(edge.targetNodeId || '').startsWith('state:'))
    .map((edge) => edge.targetNodeId);
  const gateEdges = inEdges.filter((edge) => String(edge.sourceNodeId || '').startsWith('constraint:'));
  const gatingConstraintIds = gateEdges.map((edge) => edge.sourceNodeId);
  const proxyBlockingConstraintIds = gateEdges
    .filter((edge) => {
      const constraint = constraintMap.get(edge.sourceNodeId) || {};
      return constraint.status === 'blocking' && edgeIsBlocking(edge);
    })
    .map((edge) => edge.sourceNodeId);
  const scientificBlockingConstraintIds = gateEdges
    .filter((edge) => isScientificConstraint(constraintMap.get(edge.sourceNodeId) || {}))
    .map((edge) => edge.sourceNodeId);
  const dependsOnOperationIds = [...new Set(readStateNodeIds
    .map((stateNodeId) => producerByState.get(stateNodeId))
    .filter((operationId) => operationId && operationId !== operationIdForLaw(law.id)))];
  const requiresAuthoritativeMutation = scientificMutationLaw(law);
  const requiresCalibratedLaw = law.calibrated !== true;
  const dispatchKind = dispatchKindForLaw(law);
  return {
    id: operationIdForLaw(law.id),
    lawNodeId: law.id,
    label: law.label || law.id,
    solverId: law.solver || null,
    layer: law.layer || 'runtime',
    dispatchKind,
    readStateNodeIds: [...new Set(readStateNodeIds)],
    writeStateNodeIds: [...new Set(writeStateNodeIds)],
    gatingConstraintIds: [...new Set(gatingConstraintIds)],
    proxyBlockingConstraintIds: [...new Set(proxyBlockingConstraintIds)],
    scientificBlockingConstraintIds: [...new Set(scientificBlockingConstraintIds)],
    dependsOnOperationIds,
    requiresAuthoritativeMutation,
    requiresCalibratedLaw,
    calibrated: law.calibrated === true,
    proxyReady: law.proxyReady !== false,
    scientificReady: law.scientificReady === true,
    outputSchema: law.outputSchema || null
  };
}

function assignStatuses(operations = [], {
  proxyConsistent = false,
  scientificReady = false
} = {}) {
  return operations.map((operation) => {
    const proxyBlocked = operation.proxyBlockingConstraintIds.length > 0 || operation.proxyReady === false;
    const scientificBlocked = operation.scientificBlockingConstraintIds.length > 0
      || (operation.requiresAuthoritativeMutation && !scientificReady)
      || (operation.requiresCalibratedLaw && !scientificReady);
    const runnable = !proxyBlocked;
    const status = proxyBlocked
      ? 'blocked-proxy-constraint'
      : scientificReady && !scientificBlocked
        ? 'runnable-scientific'
        : scientificBlocked
          ? 'proxy-runnable-scientific-blocked'
          : proxyConsistent
            ? 'runnable-proxy'
            : 'runnable-local-proxy';
    return {
      ...operation,
      status,
      runnable,
      proxyBlocked,
      scientificBlocked,
      authoritativeMutationReady: operation.requiresAuthoritativeMutation && scientificReady && !scientificBlocked,
      dispatchReady: runnable && operation.dispatchKind !== 'local-report'
    };
  });
}

function orderOperations(operations = []) {
  const pending = new Map(operations.map((operation) => [operation.id, operation]));
  const ordered = [];
  let guard = 0;
  while (pending.size && guard < operations.length * operations.length + 4) {
    guard += 1;
    let progressed = false;
    for (const [id, operation] of [...pending.entries()]) {
      const dependenciesSatisfied = operation.dependsOnOperationIds.every((depId) => !pending.has(depId));
      if (!dependenciesSatisfied) continue;
      ordered.push(operation);
      pending.delete(id);
      progressed = true;
    }
    if (!progressed) break;
  }
  if (pending.size) {
    ordered.push(...pending.values());
  }
  const phaseByOperation = new Map();
  for (const operation of ordered) {
    const dependencyPhase = operation.dependsOnOperationIds
      .map((id) => phaseByOperation.get(id) ?? 0)
      .reduce((max, phase) => Math.max(max, phase), 0);
    const phaseIndex = operation.dependsOnOperationIds.length ? dependencyPhase + 1 : 0;
    phaseByOperation.set(operation.id, phaseIndex);
  }
  return ordered.map((operation, sequenceIndex) => ({
    ...operation,
    sequenceIndex,
    phaseIndex: phaseByOperation.get(operation.id) ?? 0
  }));
}

function groupPhases(operations = []) {
  const phases = new Map();
  for (const operation of operations) {
    if (!phases.has(operation.phaseIndex)) {
      phases.set(operation.phaseIndex, {
        index: operation.phaseIndex,
        operationIds: [],
        runnableOperationCount: 0,
        blockedOperationCount: 0,
        dispatchReadyCount: 0
      });
    }
    const phase = phases.get(operation.phaseIndex);
    phase.operationIds.push(operation.id);
    if (operation.runnable) phase.runnableOperationCount += 1;
    if (operation.proxyBlocked || operation.scientificBlocked) phase.blockedOperationCount += 1;
    if (operation.dispatchReady) phase.dispatchReadyCount += 1;
  }
  return [...phases.values()].sort((a, b) => a.index - b.index);
}

export function createLawGraphUpdatePlan({
  stateNodes = [],
  lawNodes = [],
  constraintNodes = [],
  edges = [],
  blockers = [],
  proxyConsistent = false,
  scientificReady = false,
  timeSeconds = 0,
  activeLayerId = 'unknown'
} = {}) {
  const constraintMap = byId(constraintNodes);
  const producerByState = new Map();
  for (const edge of edges) {
    if (String(edge.sourceNodeId || '').startsWith('law:') && String(edge.targetNodeId || '').startsWith('state:')) {
      producerByState.set(edge.targetNodeId, operationIdForLaw(edge.sourceNodeId));
    }
  }
  const rawOperations = lawNodes.map((law) => makeOperation({
    law,
    edges,
    constraintMap,
    producerByState
  }));
  const operations = orderOperations(assignStatuses(rawOperations, { proxyConsistent, scientificReady }));
  const phases = groupPhases(operations);
  const proxyBlockedOperations = operations.filter((operation) => operation.proxyBlocked);
  const scientificBlockedOperations = operations.filter((operation) => operation.scientificBlocked);
  const runnableOperations = operations.filter((operation) => operation.runnable);
  const dispatchReadyOperations = operations.filter((operation) => operation.dispatchReady);
  const authoritativeMutationReady = scientificReady
    && operations
      .filter((operation) => operation.requiresAuthoritativeMutation)
      .every((operation) => operation.authoritativeMutationReady);
  const status = proxyBlockedOperations.length > 0 || !proxyConsistent
    ? 'proxy-plan-blocked'
    : authoritativeMutationReady
      ? 'scientific-update-plan-ready'
      : 'proxy-update-plan-ready-scientific-blocked';
  return {
    schema: MULTISCALE_LAW_GRAPH_UPDATE_PLAN_SCHEMA,
    modelId: 'bipartite-state-law-update-planner-v0',
    mode: 'topological-proxy-update-plan',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    activeLayerId,
    proxyConsistent,
    scientificReady,
    authoritativeMutationReady,
    stateNodeCount: stateNodes.length,
    lawNodeCount: lawNodes.length,
    constraintNodeCount: constraintNodes.length,
    edgeCount: edges.length,
    operationCount: operations.length,
    runnableOperationCount: runnableOperations.length,
    blockedOperationCount: operations.length - runnableOperations.length,
    proxyBlockedOperationCount: proxyBlockedOperations.length,
    scientificBlockedOperationCount: scientificBlockedOperations.length,
    dispatchReadyOperationCount: dispatchReadyOperations.length,
    computeManagerOperationCount: operations.filter((operation) => operation.dispatchKind === 'compute-manager-solver-task').length,
    phaseCount: phases.length,
    nextRunnableOperationId: runnableOperations[0]?.id || null,
    nextBlockedOperationId: proxyBlockedOperations[0]?.id || scientificBlockedOperations[0]?.id || null,
    operations,
    phases,
    residualTargets: [
      {
        id: 'residual:proxy-blocked-operations',
        quantity: 'blocked proxy operations',
        current: proxyBlockedOperations.length,
        target: 0,
        satisfied: proxyBlockedOperations.length === 0
      },
      {
        id: 'residual:scientific-blocked-operations',
        quantity: 'blocked scientific operations',
        current: scientificBlockedOperations.length,
        target: 0,
        satisfied: scientificBlockedOperations.length === 0
      },
      {
        id: 'residual:authoritative-mutation-readiness',
        quantity: 'authoritative mutation readiness',
        current: authoritativeMutationReady ? 1 : 0,
        target: 1,
        satisfied: authoritativeMutationReady
      }
    ],
    blockers: blockers.map((blocker) => ({
      id: blocker.id,
      severity: blocker.severity,
      scope: blocker.scope,
      reason: blocker.reason
    })),
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'This is an executable update plan over current graph telemetry, not an iterative nonlinear graph solve.',
        'Scientific mutation remains blocked until calibrated laws, invariant gates, and conservative writeback are proven.'
      ]
    },
    provenance: {
      source: 'demos/multiscale/src/simulation/lawGraphUpdatePlan.js',
      generatedFrom: 'peercompute.multiscale.law-graph-consistency.v0'
    }
  };
}
