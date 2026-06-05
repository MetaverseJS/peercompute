export const MULTISCALE_LAW_GRAPH_CONSISTENCY_SCHEMA = 'peercompute.multiscale.law-graph-consistency.v0';
export {
  MULTISCALE_LAW_GRAPH_CONSISTENCY_SOLVE_SCHEMA,
  createLawGraphConsistencySolve
} from './lawGraphConsistencySolve.js';
export {
  MULTISCALE_LAW_GRAPH_DISPATCH_QUEUE_SCHEMA,
  createLawGraphDispatchQueue
} from './lawGraphDispatchQueue.js';
export {
  MULTISCALE_LAW_GRAPH_SCHEDULER_MANIFEST_SCHEMA,
  createLawGraphSchedulerManifest
} from './lawGraphSchedulerManifest.js';
export {
  MULTISCALE_LAW_GRAPH_SCHEDULER_EXECUTION_AUDIT_SCHEMA,
  createLawGraphSchedulerExecutionAudit
} from './lawGraphSchedulerExecutionAudit.js';
export {
  MULTISCALE_LAW_GRAPH_RESULT_ADMISSION_SCHEMA,
  createLawGraphResultAdmission
} from './lawGraphResultAdmission.js';
export {
  MULTISCALE_LAW_GRAPH_STATE_APPLICATION_PREFLIGHT_SCHEMA,
  createLawGraphStateApplicationPreflight
} from './lawGraphStateApplicationPreflight.js';
export {
  MULTISCALE_LAW_GRAPH_PROPOSAL_ADMISSION_SCHEMA,
  createLawGraphProposalAdmission
} from './lawGraphProposalAdmission.js';
export {
  MULTISCALE_LAW_GRAPH_UPDATE_PLAN_SCHEMA,
  createLawGraphUpdatePlan
} from './lawGraphUpdatePlan.js';

import {
  createLawGraphConsistencySolve
} from './lawGraphConsistencySolve.js';
import {
  createLawGraphDispatchQueue
} from './lawGraphDispatchQueue.js';
import {
  createLawGraphSchedulerManifest
} from './lawGraphSchedulerManifest.js';
import {
  createLawGraphSchedulerExecutionAudit
} from './lawGraphSchedulerExecutionAudit.js';
import {
  createLawGraphResultAdmission
} from './lawGraphResultAdmission.js';
import {
  createLawGraphStateApplicationPreflight
} from './lawGraphStateApplicationPreflight.js';
import {
  createLawGraphProposalAdmission
} from './lawGraphProposalAdmission.js';
import {
  createLawGraphUpdatePlan
} from './lawGraphUpdatePlan.js';

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function rounded(value, digits = 4) {
  return Number(finite(value).toFixed(digits));
}

function uniqById(nodes = []) {
  const map = new Map();
  for (const node of nodes) {
    if (!node?.id) continue;
    map.set(node.id, { ...map.get(node.id), ...node });
  }
  return [...map.values()];
}

function normalizeFragmentNode(node = {}, fallbackKind = 'state-variable', fragmentScope = 'unknown') {
  return {
    ...node,
    id: node.id,
    kind: node.kind || fallbackKind,
    fragmentScope: node.fragmentScope || fragmentScope,
    status: node.status || 'available'
  };
}

function normalizeFragmentEdge(edge = {}, fragmentScope = 'unknown') {
  const sourceNodeId = edge.sourceNodeId || edge.source || edge.from || null;
  const targetNodeId = edge.targetNodeId || edge.target || edge.to || null;
  if (!sourceNodeId || !targetNodeId) return null;
  return {
    id: edge.id || `${fragmentScope}:${sourceNodeId}->${targetNodeId}:${edge.role || 'edge'}`,
    sourceNodeId,
    targetNodeId,
    role: edge.role || 'dependency',
    fragmentScope
  };
}

function makeStateNode(id, quantity, value, {
  unit = 'reduced',
  layer = 'runtime',
  solver = null,
  status = 'available',
  metadata = {}
} = {}) {
  return {
    id,
    kind: 'state-variable',
    quantity,
    value,
    unit,
    layer,
    solver,
    status,
    ...metadata
  };
}

function makeLawNode(id, label, {
  status = 'ready',
  layer = 'runtime',
  solver = null,
  outputSchema = null,
  calibrated = false,
  scientificReady = false,
  proxyReady = true
} = {}) {
  return {
    id,
    kind: 'law',
    label,
    layer,
    solver,
    status,
    outputSchema,
    calibrated,
    scientificReady,
    proxyReady
  };
}

function makeConstraintNode(id, label, {
  status = 'satisfied',
  layer = 'runtime',
  blockerCount = 0,
  blockers = []
} = {}) {
  return {
    id,
    kind: 'constraint',
    label,
    layer,
    status,
    blockerCount,
    blockers
  };
}

function makeEdge(sourceNodeId, targetNodeId, role) {
  return {
    id: `${sourceNodeId}->${targetNodeId}:${role}`,
    sourceNodeId,
    targetNodeId,
    role
  };
}

function qmatFragmentFromState(state = {}) {
  return state.orbital?.materialPotentialLawGraphFragment
    || state.orbital?.materialPotential?.lawGraphFragment
    || null;
}

function collectBlockers({
  qmatFragment = null,
  qmat = {},
  coupling = {},
  molecularScientificInvariantGate = null,
  molecularScientificReadinessManifest = null
}) {
  const blockers = [];
  const qmatBlocked = qmatFragment?.consistency?.status === 'blocked-reactive-constraint'
    || qmat.unsupportedChemistry?.unsupportedReactiveChemistry === true;
  if (qmatBlocked) {
    const blockedInteractions = Array.isArray(qmat.unsupportedChemistry?.blockedInteractions)
      ? qmat.unsupportedChemistry.blockedInteractions
      : [];
    blockers.push({
      id: 'constraint:qmat-reactive-chemistry',
      scope: 'schrodinger-material-potential',
      severity: 'blocking',
      reason: 'Reactive chemistry requires charge-transfer, reaction-barrier, product-stoichiometry, and conservative mutation artifacts.',
      blockedInteractionCount: blockedInteractions.length,
      blockedInteractions: blockedInteractions.map((item) => item.id || item)
    });
  }
  const blockedAdapters = finite(coupling.fieldAdapterPlan?.blockedAdapterCount, 0);
  if (blockedAdapters > 0) {
    blockers.push({
      id: 'constraint:field-adapter-plan',
      scope: 'cross-scale-coupling',
      severity: 'blocking',
      reason: 'One or more field adapters are blocked before graph update can be conservative.',
      blockedAdapterCount: blockedAdapters
    });
  }
  const invariantBlockers = finite(molecularScientificInvariantGate?.blockedScopeCount, 0);
  if (invariantBlockers > 0) {
    blockers.push({
      id: 'constraint:molecular-scientific-invariants',
      scope: 'molecular-source-transfer',
      severity: 'scientific-blocker',
      reason: 'Proxy source/target mutation is visible but authoritative invariant scopes are not complete.',
      blockedScopeCount: invariantBlockers
    });
  }
  const manifestBlockers = finite(molecularScientificReadinessManifest?.blockedArtifactCount, 0);
  if (manifestBlockers > 0 || molecularScientificReadinessManifest?.manifestComplete === false) {
    blockers.push({
      id: 'constraint:molecular-scientific-readiness-manifest',
      scope: 'molecular-source-transfer',
      severity: 'scientific-blocker',
      reason: 'Required authoritative source/mutation artifacts are not all available.',
      blockedArtifactCount: manifestBlockers,
      nextRequiredArtifactId: molecularScientificReadinessManifest?.nextRequiredArtifactId || null
    });
  }
  return blockers;
}

export function createLawGraphConsistencyReport({
  state = {},
  environment = {},
  timeSeconds = 0,
  activeLayerId = 'unknown',
  fragments = [],
  coupling = null,
  conservation = null,
  molecularScientificInvariantGate = null,
  molecularScientificReadinessManifest = null,
  solverDescriptors = [],
  solverRuntimeEvidence = null,
  solverWarmDeltas = null
} = {}) {
  const qmat = state.orbital?.materialPotential || {};
  const qmatFragment = fragments.find((fragment) => fragment?.scope === 'schrodinger-material-potential')
    || qmatFragmentFromState(state);
  const allFragments = [
    ...fragments.filter((fragment) => fragment?.schema),
    qmatFragment
  ].filter(Boolean);
  const fragmentStateNodes = allFragments.flatMap((fragment) => (
    Array.isArray(fragment.stateNodes)
      ? fragment.stateNodes.map((node) => normalizeFragmentNode(node, 'state-variable', fragment.scope || fragment.modelId || 'fragment'))
      : []
  ));
  const fragmentLawLikeNodes = allFragments.flatMap((fragment) => (
    Array.isArray(fragment.lawNodes)
      ? fragment.lawNodes.map((node) => normalizeFragmentNode(node, 'law', fragment.scope || fragment.modelId || 'fragment'))
      : []
  ));
  const fragmentEdges = allFragments
    .flatMap((fragment) => Array.isArray(fragment.edges)
      ? fragment.edges.map((edge) => normalizeFragmentEdge(edge, fragment.scope || fragment.modelId || 'fragment'))
      : [])
    .filter(Boolean);
  const md = state.molecular?.molecularDynamics || {};
  const reactive = state.surface?.reactiveCell || {};
  const sph = state.mpm?.sphMaterial || {};
  const blockers = collectBlockers({
    qmatFragment,
    qmat,
    coupling: coupling || {},
    molecularScientificInvariantGate: molecularScientificInvariantGate || state.molecular?.scientificInvariantGate,
    molecularScientificReadinessManifest: molecularScientificReadinessManifest || state.molecular?.scientificReadinessManifest
  });
  const stateNodes = uniqById([
    ...fragmentStateNodes,
    makeStateNode('state:environment-boundary', 'environment-boundary', null, {
      layer: 'all',
      unit: 'mixed',
      metadata: {
        ambientTemperatureK: rounded(environment.ambientTemperatureK ?? 294, 2),
        ambientPressurePa: rounded(environment.ambientPressurePa ?? 101325, 1),
        gravityMps2: rounded(environment.gravityMps2 ?? 9.8, 4),
        oxygenFraction: rounded(environment.oxygenFraction ?? 0.21, 4)
      }
    }),
    makeStateNode('state:quantum-orbital-closure', 'orbital-closure', state.orbital?.closureSchema || null, {
      layer: 'orbital',
      solver: 'quantum-orbital-closure',
      metadata: {
        elementSymbol: state.orbital?.elementSymbol || null,
        activeOrbital: state.orbital?.activeOrbitalLabel || state.orbital?.activeOrbital || null,
        finiteGridSize: state.orbital?.finiteGridSize || null
      }
    }),
    makeStateNode('state:quantum-material-potential', 'material-potential', qmat.schema || state.orbital?.materialPotentialSchema || null, {
      layer: 'orbital',
      solver: 'quantum-material-potential',
      status: qmatFragment?.consistency?.status || state.orbital?.materialPotentialLawGraphConsistency || 'unknown',
      metadata: {
        materialId: qmat.materialId || state.orbital?.materialPotentialMaterialId || null,
        forceSurfaceStatus: qmat.forceSurfacePreview?.status || state.orbital?.materialPotentialForceSurfaceStatus || null
      }
    }),
    makeStateNode('state:molecular-dynamics', 'atom-bond-state', md.atomCount || 0, {
      layer: 'molecular',
      solver: 'molecular-dynamics',
      metadata: {
        atomCount: md.atomCount || 0,
        bondCount: md.bondCount || 0,
        dominantMolecule: md.dominantMolecule || null
      }
    }),
    makeStateNode('state:molecular-source-buffer', 'source-buffer', state.molecular?.conservativeSourceBuffer?.schema || null, {
      layer: 'molecular',
      solver: 'molecular-source-equation',
      status: state.molecular?.conservativeSourceBuffer?.status || 'preview',
      metadata: {
        sourceTermCount: state.molecular?.conservativeSourceBuffer?.sourceTermCount || 0
      }
    }),
    makeStateNode('state:reactive-thermal-cell', 'reactive-thermal-state', reactive.temperatureK || 0, {
      layer: 'surface',
      solver: 'reactive-thermal-cell',
      unit: 'K',
      metadata: {
        backend: reactive.backend || 'none',
        heatReleaseNorm: rounded(reactive.heatReleaseNorm || 0, 4)
      }
    }),
    makeStateNode('state:sph-material', 'sph-material-state', sph.particleCount || 0, {
      layer: 'mpm',
      solver: 'sph-material',
      metadata: {
        backend: sph.backend || 'none',
        liquidFraction: rounded(sph.liquidFraction || 0, 4),
        vaporFraction: rounded(sph.vaporFraction || 0, 4)
      }
    }),
    makeStateNode('state:cross-scale-coupling', 'coupling-links', coupling?.activeLinkCount || 0, {
      layer: 'all',
      solver: 'cross-scale-coupling',
      status: coupling?.status || 'unknown',
      metadata: {
        linkCount: coupling?.linkCount || 0,
        activeLinkCount: coupling?.activeLinkCount || 0
      }
    }),
    makeStateNode('state:conservation-audit', 'conservation-audit', conservation?.energyResidualProxy || 0, {
      layer: 'all',
      solver: 'conservation-audit',
      status: conservation?.status || 'unknown',
      metadata: {
        massRelativeError: conservation?.massRelativeError ?? null,
        speciesResidualProxy: conservation?.speciesResidualProxy ?? null
      }
    })
  ]);
  const fragmentConstraintNodes = fragmentLawLikeNodes
    .filter((node) => String(node.id || '').startsWith('constraint:'))
    .map((node) => ({ ...node, kind: 'constraint' }));
  const fragmentLawNodes = fragmentLawLikeNodes
    .filter((node) => !String(node.id || '').startsWith('constraint:'))
    .map((node) => ({ ...node, kind: node.kind === 'law-constraint' ? 'law' : node.kind }));
  const lawNodes = uniqById([
    ...fragmentLawNodes,
    makeLawNode('law:quantum-orbital-closure', 'Schrodinger orbital closure', {
      layer: 'orbital',
      solver: 'quantum-orbital-closure',
      outputSchema: state.orbital?.closureSchema || null
    }),
    makeLawNode('law:quantum-material-potential', 'Quantum material property and reduced force preview', {
      layer: 'orbital',
      solver: 'quantum-material-potential',
      status: state.orbital?.materialPotentialStatus || 'unknown',
      outputSchema: qmat.schema || state.orbital?.materialPotentialSchema || null
    }),
    makeLawNode('law:molecular-dynamics', 'Reduced molecular dynamics', {
      layer: 'molecular',
      solver: 'molecular-dynamics',
      status: md.backend && md.backend !== 'none' ? 'solver-backed' : 'warming'
    }),
    makeLawNode('law:molecular-source-equation', 'Molecular source equation', {
      layer: 'molecular',
      solver: 'molecular-source-equation',
      status: state.molecular?.sourceEquation?.status || 'preview'
    }),
    makeLawNode('law:reactive-thermal-source-consumer', 'Reactive thermal source consumer', {
      layer: 'surface',
      solver: 'reactive-thermal-cell',
      status: reactive.backend && reactive.backend !== 'none' ? 'solver-backed' : 'warming'
    }),
    makeLawNode('law:sph-material-source-consumer', 'SPH material source consumer', {
      layer: 'mpm',
      solver: 'sph-material',
      status: sph.backend && sph.backend !== 'none' ? 'solver-backed' : 'warming'
    }),
    makeLawNode('law:cross-scale-field-transfer', 'Cross-scale field transfer', {
      layer: 'all',
      solver: 'cross-scale-coupling',
      status: coupling?.fieldTransfer?.status || coupling?.status || 'unknown',
      outputSchema: coupling?.fieldTransfer?.schema || null
    }),
    makeLawNode('law:conservation-audit', 'Reduced conservation audit', {
      layer: 'all',
      solver: 'conservation-audit',
      status: conservation?.status || 'unknown',
      outputSchema: conservation?.schema || null
    })
  ]);
  const scientificBlockers = blockers.filter((blocker) => blocker.severity === 'scientific-blocker');
  const proxyBlockers = blockers.filter((blocker) => blocker.severity === 'blocking');
  const constraintNodes = uniqById([
    ...fragmentConstraintNodes,
    makeConstraintNode('constraint:field-adapter-compatibility', 'Field adapter compatibility', {
      status: finite(coupling?.fieldAdapterPlan?.blockedAdapterCount, 0) > 0 ? 'blocking' : 'satisfied',
      blockerCount: finite(coupling?.fieldAdapterPlan?.blockedAdapterCount, 0)
    }),
    makeConstraintNode('constraint:molecular-scientific-readiness', 'Molecular source mutation scientific readiness', {
      status: scientificBlockers.length > 0 ? 'scientific-blocker' : 'satisfied',
      blockerCount: scientificBlockers.length,
      blockers: scientificBlockers.map((blocker) => blocker.id)
    }),
    makeConstraintNode('constraint:conservation-open-system', 'Reduced open-system conservation audit', {
      status: conservation?.mode === 'interactive-proxy' ? 'proxy-audit' : 'unknown',
      blockerCount: conservation?.mode === 'interactive-proxy' ? 1 : 0,
      blockers: conservation?.mode === 'interactive-proxy' ? ['scientific-closed-system-conservation-not-proven'] : []
    })
  ]);
  const edges = [
    ...fragmentEdges,
    makeEdge('state:environment-boundary', 'law:quantum-orbital-closure', 'conditions'),
    makeEdge('law:quantum-orbital-closure', 'state:quantum-orbital-closure', 'updates'),
    makeEdge('state:quantum-orbital-closure', 'law:quantum-material-potential', 'descriptor'),
    makeEdge('law:quantum-material-potential', 'state:quantum-material-potential', 'updates'),
    makeEdge('state:quantum-material-potential', 'law:molecular-dynamics', 'closure-input'),
    makeEdge('law:molecular-dynamics', 'state:molecular-dynamics', 'updates'),
    makeEdge('state:molecular-dynamics', 'law:molecular-source-equation', 'source-input'),
    makeEdge('law:molecular-source-equation', 'state:molecular-source-buffer', 'updates'),
    makeEdge('state:molecular-source-buffer', 'law:reactive-thermal-source-consumer', 'source-input'),
    makeEdge('state:molecular-source-buffer', 'law:sph-material-source-consumer', 'source-input'),
    makeEdge('law:reactive-thermal-source-consumer', 'state:reactive-thermal-cell', 'updates'),
    makeEdge('law:sph-material-source-consumer', 'state:sph-material', 'updates'),
    makeEdge('state:reactive-thermal-cell', 'law:cross-scale-field-transfer', 'handoff-source'),
    makeEdge('state:sph-material', 'law:cross-scale-field-transfer', 'handoff-source'),
    makeEdge('law:cross-scale-field-transfer', 'state:cross-scale-coupling', 'updates'),
    makeEdge('state:cross-scale-coupling', 'law:conservation-audit', 'audit-input'),
    makeEdge('law:conservation-audit', 'state:conservation-audit', 'updates'),
    makeEdge('constraint:field-adapter-compatibility', 'law:cross-scale-field-transfer', 'gates'),
    makeEdge('constraint:molecular-scientific-readiness', 'law:molecular-source-equation', 'gates-scientific-mode'),
    makeEdge('constraint:conservation-open-system', 'law:conservation-audit', 'gates-scientific-mode')
  ];
  const proxyConsistent = proxyBlockers.length === 0;
  const scientificReady = proxyConsistent
    && scientificBlockers.length === 0
    && conservation?.mode !== 'interactive-proxy'
    && qmat?.potentialTerms?.bornOppenheimerForcesAvailable === true;
  const status = !proxyConsistent
    ? 'proxy-update-blocked'
    : scientificReady
      ? 'consistent-scientific-update-ready'
      : 'proxy-consistent-scientific-blocked';
  const lawReadyCount = lawNodes.filter((node) => !['blocking', 'error'].includes(node.status)).length;
  const consistencyScore = stateNodes.length + lawNodes.length + constraintNodes.length > 0
    ? (lawReadyCount + constraintNodes.filter((node) => node.status === 'satisfied').length) / (lawNodes.length + constraintNodes.length)
    : 0;
  const updatePlan = createLawGraphUpdatePlan({
    stateNodes,
    lawNodes,
    constraintNodes,
    edges,
    blockers,
    proxyConsistent,
    scientificReady,
    timeSeconds,
    activeLayerId
  });
  const consistencySolve = createLawGraphConsistencySolve({
    stateNodes,
    lawNodes,
    constraintNodes,
    edges,
    updatePlan,
    blockers,
    proxyConsistent,
    scientificReady,
    timeSeconds,
    activeLayerId
  });
  const proposalAdmission = createLawGraphProposalAdmission({
    updatePlan,
    consistencySolve,
    timeSeconds,
    activeLayerId
  });
  const dispatchQueue = createLawGraphDispatchQueue({
    updatePlan,
    proposalAdmission,
    timeSeconds,
    activeLayerId
  });
  const schedulerManifest = createLawGraphSchedulerManifest({
    dispatchQueue,
    solverDescriptors,
    timeSeconds,
    activeLayerId
  });
  const schedulerExecutionAudit = createLawGraphSchedulerExecutionAudit({
    schedulerManifest,
    solverRuntime: solverRuntimeEvidence,
    solverWarmDeltas,
    timeSeconds,
    activeLayerId
  });
  const resultAdmission = createLawGraphResultAdmission({
    schedulerExecutionAudit,
    timeSeconds,
    activeLayerId
  });
  const stateApplicationPreflight = createLawGraphStateApplicationPreflight({
    resultAdmission,
    schedulerManifest,
    timeSeconds,
    activeLayerId
  });
  return {
    schema: MULTISCALE_LAW_GRAPH_CONSISTENCY_SCHEMA,
    modelId: 'bipartite-state-law-consistency-v0',
    mode: 'state-law-constraint-bipartite-report',
    status,
    proxyConsistent,
    scientificReady,
    timeSeconds: rounded(timeSeconds, 3),
    activeLayerId,
    stateNodeCount: stateNodes.length,
    lawNodeCount: lawNodes.length,
    constraintNodeCount: constraintNodes.length,
    edgeCount: edges.length,
    fragmentCount: allFragments.length,
    blockedConstraintCount: blockers.length,
    proxyBlockingConstraintCount: proxyBlockers.length,
    scientificBlockingConstraintCount: scientificBlockers.length,
    readyLawCount: lawReadyCount,
    consistencyScore: rounded(consistencyScore, 4),
    stateNodes,
    lawNodes,
    constraintNodes,
    edges,
    blockers,
    updatePlan,
    consistencySolve,
    proposalAdmission,
    dispatchQueue,
    schedulerManifest,
    schedulerExecutionAudit,
    resultAdmission,
    stateApplicationPreflight,
    fragments: allFragments.map((fragment) => ({
      schema: fragment.schema,
      modelId: fragment.modelId || null,
      scope: fragment.scope || null,
      stateNodeCount: fragment.stateNodeCount || fragment.stateNodes?.length || 0,
      lawNodeCount: fragment.lawNodeCount || fragment.lawNodes?.length || 0,
      edgeCount: fragment.edgeCount || fragment.edges?.length || 0,
      consistencyStatus: fragment.consistency?.status || null
    })),
    update: {
      strategy: 'reduced-fixed-point-update-plan',
      requiresGlobalSolve: true,
      implementedGlobalSolve: true,
      implementedProposalAdmission: true,
      implementedDispatchQueue: true,
      implementedSchedulerManifest: true,
      implementedSchedulerExecutionAudit: true,
      implementedResultAdmission: true,
      implementedStateApplicationPreflight: true,
      updatePlanSchema: updatePlan.schema,
      consistencySolveSchema: consistencySolve.schema,
      proposalAdmissionSchema: proposalAdmission.schema,
      dispatchQueueSchema: dispatchQueue.schema,
      schedulerManifestSchema: schedulerManifest.schema,
      schedulerExecutionAuditSchema: schedulerExecutionAudit.schema,
      resultAdmissionSchema: resultAdmission.schema,
      stateApplicationPreflightSchema: stateApplicationPreflight.schema,
      operationCount: updatePlan.operationCount,
      runnableOperationCount: updatePlan.runnableOperationCount,
      blockedOperationCount: updatePlan.blockedOperationCount,
      dispatchReadyOperationCount: updatePlan.dispatchReadyOperationCount,
      phaseCount: updatePlan.phaseCount,
      iterationCount: consistencySolve.iterationCount,
      convergedProxy: consistencySolve.convergedProxy,
      convergedScientific: consistencySolve.convergedScientific,
      proposedStateUpdateCount: consistencySolve.proposedStateUpdateCount,
      proposalAdmissionStatus: proposalAdmission.status,
      proxyWarmDeltaReadyCount: proposalAdmission.proxyWarmDeltaReadyCount,
      computeManagerDispatchReadyCount: proposalAdmission.computeManagerDispatchReadyCount,
      authoritativeMutationBlockedCount: proposalAdmission.authoritativeMutationBlockedCount,
      dispatchQueueStatus: dispatchQueue.status,
      dispatchQueueReadyEntryCount: dispatchQueue.readyEntryCount,
      dispatchQueueComputeManagerReadyCount: dispatchQueue.computeManagerReadyCount,
      dispatchQueueModelLocalReadyCount: dispatchQueue.modelLocalReadyCount,
      schedulerManifestStatus: schedulerManifest.status,
      schedulerManifestReadyEntryCount: schedulerManifest.readyManifestEntryCount,
      schedulerManifestSchedulerReadyCount: schedulerManifest.schedulerReadyCount,
      schedulerManifestResolvedDescriptorCount: schedulerManifest.resolvedDescriptorCount,
      schedulerManifestUnresolvedDescriptorCount: schedulerManifest.unresolvedDescriptorCount,
      schedulerExecutionAuditStatus: schedulerExecutionAudit.status,
      schedulerExecutionObservedCount: schedulerExecutionAudit.executionObservedCount,
      schedulerFullyObservedCount: schedulerExecutionAudit.fullyObservedCount,
      schedulerMissingRuntimeCount: schedulerExecutionAudit.missingRuntimeCount,
      schedulerMissingWarmDeltaCount: schedulerExecutionAudit.missingWarmDeltaCount,
      resultAdmissionStatus: resultAdmission.status,
      resultAdmissionProxyAdmittedCount: resultAdmission.proxyAdmittedCount,
      resultAdmissionMissingRuntimeCount: resultAdmission.missingRuntimeCount,
      resultAdmissionMissingWarmDeltaCount: resultAdmission.missingWarmDeltaCount,
      resultAdmissionScientificBlockedCount: resultAdmission.scientificBlockedAdmissionCount,
      stateApplicationPreflightStatus: stateApplicationPreflight.status,
      stateApplicationProxyReadyCount: stateApplicationPreflight.proxyApplicationReadyCount,
      stateApplicationWaitingResultCount: stateApplicationPreflight.waitingResultAdmissionCount,
      stateApplicationMissingLinkCount: stateApplicationPreflight.missingStateApplicationLinkCount,
      stateApplicationScientificBlockedCount: stateApplicationPreflight.scientificBlockedApplicationCount,
      closedResidualProxy: consistencySolve.closedResidualProxy,
      scientificResidual: consistencySolve.scientificResidual,
      authoritativeMutationReady: updatePlan.authoritativeMutationReady,
      nextRunnableOperationId: updatePlan.nextRunnableOperationId,
      nextRequiredStep: scientificReady
        ? 'enable-authoritative-state-application'
        : proxyBlockers.length > 0
          ? proxyBlockers[0].id
          : scientificBlockers[0]?.id || 'calibrated-law-graph-solver'
    },
    validity: {
      status: 'interactive-proxy',
      warnings: [
        'This report is a graph consistency surface over reduced solver telemetry, not a global nonlinear solve.',
        'Scientific readiness requires calibrated laws, conservative mutation, and validation tolerances.'
      ]
    },
    provenance: {
      source: 'demos/multiscale/src/simulation/lawGraph.js',
      generatedFrom: 'MultiscaleModel.state'
    }
  };
}
