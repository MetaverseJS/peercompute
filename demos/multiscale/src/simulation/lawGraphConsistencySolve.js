export const MULTISCALE_LAW_GRAPH_CONSISTENCY_SOLVE_SCHEMA = 'peercompute.multiscale.law-graph-consistency-solve.v0';

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function rounded(value, digits = 4) {
  return Number(finite(value).toFixed(digits));
}

function nodeById(nodes = []) {
  const map = new Map();
  for (const node of nodes) {
    if (node?.id) map.set(node.id, node);
  }
  return map;
}

function operationResidual(operation = {}) {
  const proxyResidual = operation.proxyBlocked
    ? 1 + finite(operation.proxyBlockingConstraintIds?.length, 0)
    : 0;
  const scientificResidual = operation.scientificBlocked
    ? 1
      + finite(operation.scientificBlockingConstraintIds?.length, 0)
      + (operation.requiresAuthoritativeMutation ? 1 : 0)
      + (operation.requiresCalibratedLaw ? 1 : 0)
    : 0;
  return {
    proxyResidual,
    scientificResidual,
    maxResidual: Math.max(proxyResidual, scientificResidual)
  };
}

function solveStatusForOperation(operation = {}, authoritativeMutationReady = false) {
  if (operation.proxyBlocked) return 'blocked-proxy-constraint';
  if (operation.scientificBlocked) return 'proxy-solved-scientific-blocked';
  if (authoritativeMutationReady && operation.requiresAuthoritativeMutation) return 'authoritative-ready';
  return operation.dispatchReady ? 'proxy-solved-dispatch-ready' : 'proxy-solved-local';
}

function proposalStatusForOperation(operation = {}, authoritativeMutationReady = false) {
  if (operation.proxyBlocked) return 'blocked-proxy-constraint';
  if (operation.scientificBlocked) return 'proposal-only-scientific-blocked';
  if (authoritativeMutationReady && operation.requiresAuthoritativeMutation) return 'ready-authoritative';
  return 'proxy-proposed';
}

function makeStateUpdateProposal(operation = {}, stateNode = {}, index = 0, authoritativeMutationReady = false) {
  return {
    id: `proposal:${operation.id}->${stateNode.id}:${index}`,
    operationId: operation.id,
    lawNodeId: operation.lawNodeId,
    stateNodeId: stateNode.id,
    quantity: stateNode.quantity || null,
    layer: stateNode.layer || operation.layer || 'runtime',
    solverId: operation.solverId || stateNode.solver || null,
    mode: authoritativeMutationReady && operation.requiresAuthoritativeMutation ? 'authoritative' : 'proxy',
    status: proposalStatusForOperation(operation, authoritativeMutationReady),
    units: stateNode.unit || 'reduced',
    writesAuthoritativeState: Boolean(authoritativeMutationReady && operation.requiresAuthoritativeMutation),
    requiresAuthoritativeMutation: Boolean(operation.requiresAuthoritativeMutation),
    requiresCalibratedLaw: Boolean(operation.requiresCalibratedLaw),
    residualProxy: rounded(operationResidual(operation).proxyResidual, 4),
    residualScientific: rounded(operationResidual(operation).scientificResidual, 4)
  };
}

function makeIteration({
  index = 0,
  phaseCount = 0,
  operations = [],
  proxyResidualBefore = 0,
  scientificResidualBefore = 0,
  proxyResidualAfter = 0,
  scientificResidualAfter = 0
} = {}) {
  const executedOperations = operations.filter((operation) => operation.runnable && !operation.proxyBlocked);
  const blockedOperations = operations.filter((operation) => operation.proxyBlocked || operation.scientificBlocked);
  return {
    index,
    phaseCount,
    executedOperationCount: executedOperations.length,
    blockedOperationCount: blockedOperations.length,
    dispatchReadyOperationCount: executedOperations.filter((operation) => operation.dispatchReady).length,
    proxyResidualBefore: rounded(proxyResidualBefore, 6),
    proxyResidualAfter: rounded(proxyResidualAfter, 6),
    scientificResidualBefore: rounded(scientificResidualBefore, 6),
    scientificResidualAfter: rounded(scientificResidualAfter, 6),
    residualReductionProxy: rounded(proxyResidualBefore - proxyResidualAfter, 6),
    residualReductionScientific: rounded(scientificResidualBefore - scientificResidualAfter, 6),
    status: proxyResidualAfter === 0
      ? scientificResidualAfter === 0
        ? 'scientific-fixed-point'
        : 'proxy-fixed-point-scientific-blocked'
      : 'blocked-before-fixed-point'
  };
}

export function createLawGraphConsistencySolve({
  stateNodes = [],
  lawNodes = [],
  constraintNodes = [],
  edges = [],
  updatePlan = null,
  blockers = [],
  proxyConsistent = false,
  scientificReady = false,
  timeSeconds = 0,
  activeLayerId = 'unknown',
  maxIterations = 4
} = {}) {
  const plan = updatePlan || {};
  const operations = Array.isArray(plan.operations) ? plan.operations : [];
  const stateMap = nodeById(stateNodes);
  const proxyBlockedOperations = operations.filter((operation) => operation.proxyBlocked);
  const scientificBlockedOperations = operations.filter((operation) => operation.scientificBlocked);
  const runnableOperations = operations.filter((operation) => operation.runnable && !operation.proxyBlocked);
  const authoritativeMutationReady = Boolean(plan.authoritativeMutationReady && scientificReady);
  const convergedProxy = Boolean(proxyConsistent && proxyBlockedOperations.length === 0);
  const convergedScientific = Boolean(convergedProxy && authoritativeMutationReady && scientificBlockedOperations.length === 0);
  const initialProxyResidual = proxyBlockedOperations
    .map((operation) => operationResidual(operation).proxyResidual)
    .reduce((sum, value) => sum + value, proxyConsistent ? 0 : 1);
  const initialScientificResidual = scientificBlockedOperations
    .map((operation) => operationResidual(operation).scientificResidual)
    .reduce((sum, value) => sum + value, authoritativeMutationReady ? 0 : 1);
  const phaseCount = finite(plan.phaseCount, 0);
  const iterationLimit = Math.max(0, Math.min(Math.floor(finite(maxIterations, 4)), Math.max(1, phaseCount || 1)));
  const iterations = [];
  let proxyResidual = initialProxyResidual;
  let scientificResidual = initialScientificResidual;
  for (let index = 0; index < iterationLimit; index += 1) {
    const proxyBefore = proxyResidual;
    const scientificBefore = scientificResidual;
    proxyResidual = convergedProxy ? 0 : proxyResidual;
    scientificResidual = convergedScientific ? 0 : scientificResidual;
    iterations.push(makeIteration({
      index,
      phaseCount,
      operations,
      proxyResidualBefore: proxyBefore,
      scientificResidualBefore: scientificBefore,
      proxyResidualAfter: proxyResidual,
      scientificResidualAfter: scientificResidual
    }));
    if (proxyResidual === 0 && scientificResidual === 0) break;
    if (!convergedProxy || !convergedScientific) break;
  }
  const operationSolves = operations.map((operation) => {
    const residual = operationResidual(operation);
    return {
      operationId: operation.id,
      lawNodeId: operation.lawNodeId,
      solverId: operation.solverId || null,
      status: solveStatusForOperation(operation, authoritativeMutationReady),
      phaseIndex: operation.phaseIndex ?? null,
      sequenceIndex: operation.sequenceIndex ?? null,
      dispatchKind: operation.dispatchKind || 'local-report',
      dispatchReady: Boolean(operation.dispatchReady && !operation.proxyBlocked),
      proposedWriteCount: Array.isArray(operation.writeStateNodeIds) ? operation.writeStateNodeIds.length : 0,
      proxyResidual: rounded(residual.proxyResidual, 4),
      scientificResidual: rounded(residual.scientificResidual, 4),
      proxyBlocked: Boolean(operation.proxyBlocked),
      scientificBlocked: Boolean(operation.scientificBlocked)
    };
  });
  const proposedStateUpdates = operations.flatMap((operation) => {
    if (operation.proxyBlocked) return [];
    const writeStateNodeIds = Array.isArray(operation.writeStateNodeIds) ? operation.writeStateNodeIds : [];
    return writeStateNodeIds.map((stateNodeId, index) => makeStateUpdateProposal(
      operation,
      stateMap.get(stateNodeId) || { id: stateNodeId },
      index,
      authoritativeMutationReady
    ));
  });
  const status = !convergedProxy
    ? 'proxy-solve-blocked'
    : convergedScientific
      ? 'scientific-solve-converged'
      : 'proxy-solve-converged-scientific-blocked';
  return {
    schema: MULTISCALE_LAW_GRAPH_CONSISTENCY_SOLVE_SCHEMA,
    modelId: 'bipartite-state-law-fixed-point-proxy-v0',
    mode: 'reduced-fixed-point-consistency-solve',
    status,
    timeSeconds: rounded(timeSeconds, 3),
    activeLayerId,
    proxyConsistent: Boolean(proxyConsistent),
    scientificReady: Boolean(scientificReady),
    convergedProxy,
    convergedScientific,
    authoritativeMutationReady,
    stateNodeCount: stateNodes.length,
    lawNodeCount: lawNodes.length,
    constraintNodeCount: constraintNodes.length,
    edgeCount: edges.length,
    operationCount: operations.length,
    runnableOperationCount: runnableOperations.length,
    proxyBlockedOperationCount: proxyBlockedOperations.length,
    scientificBlockedOperationCount: scientificBlockedOperations.length,
    iterationCount: iterations.length,
    phaseCount,
    proposedStateUpdateCount: proposedStateUpdates.length,
    proxyAcceptedUpdateCount: proposedStateUpdates.filter((proposal) => proposal.status === 'proxy-proposed').length,
    authoritativeReadyUpdateCount: proposedStateUpdates.filter((proposal) => proposal.status === 'ready-authoritative').length,
    dispatchReadyOperationCount: operationSolves.filter((operation) => operation.dispatchReady).length,
    maxProxyResidual: rounded(Math.max(0, ...operationSolves.map((operation) => operation.proxyResidual)), 6),
    maxScientificResidual: rounded(Math.max(0, ...operationSolves.map((operation) => operation.scientificResidual)), 6),
    closedResidualProxy: rounded(proxyResidual, 6),
    scientificResidual: rounded(scientificResidual, 6),
    nextRunnableOperationId: plan.nextRunnableOperationId || null,
    nextBlockedOperationId: plan.nextBlockedOperationId || null,
    operationSolves,
    proposedStateUpdates,
    iterations,
    residualTargets: [
      {
        id: 'residual:fixed-point-proxy',
        quantity: 'proxy fixed-point residual',
        current: rounded(proxyResidual, 6),
        target: 0,
        satisfied: proxyResidual === 0
      },
      {
        id: 'residual:fixed-point-scientific',
        quantity: 'scientific fixed-point residual',
        current: rounded(scientificResidual, 6),
        target: 0,
        satisfied: scientificResidual === 0
      },
      {
        id: 'residual:authoritative-state-update',
        quantity: 'authoritative state update readiness',
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
        'This is a reduced fixed-point solve report over graph telemetry, not a nonlinear numerical solver.',
        'State updates are proposals only unless authoritative mutation is explicitly ready.'
      ]
    },
    provenance: {
      source: 'demos/multiscale/src/simulation/lawGraphConsistencySolve.js',
      generatedFrom: 'peercompute.multiscale.law-graph-update-plan.v0'
    }
  };
}
