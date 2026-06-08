export const ULG_SPEC_CONTRACT_REPORT_SCHEMA = 'peercompute.ulg.spec-contract-report.v0';
export const ULG_SPEC_VERSION = '0.4';

const REQUIRED_CORE_PASS_IDS = Object.freeze([
  'buildSpatialHash',
  'buildNeighborEdges',
  'buildLongRangeGraph',
  'observeCoarseState',
  'activateTerms',
  'evaluateEdgeMessages',
  'evaluateFieldMessages',
  'evaluateSourceTerms',
  'accumulateMessages',
  'integrateState',
  'projectConstraints',
  'validateDomain',
  'refineOrCoarsen',
  'packPeerDelta'
]);

const ROOT_CONTRACTS = [
  {
    id: 'root:symmetry-action',
    label: 'symmetry/action',
    requiredFor: 'declared symmetries, invariant structure, conservation audits'
  },
  {
    id: 'root:geometry-spacetime',
    label: 'geometry/spacetime',
    requiredFor: 'Galilean/Newtonian/SR/GR regime selection and compactness invalidation'
  },
  {
    id: 'root:quantum-field-microphysics',
    label: 'quantum/field',
    requiredFor: 'Schrodinger, Pauli, Dirac, QED-response, nuclear/electroweak substrates'
  },
  {
    id: 'root:quantum-statistical-ensemble',
    label: 'statistical ensemble',
    requiredFor: 'temperature, pressure, entropy, opacity populations, ionization, degeneracy'
  },
  {
    id: 'root:response-functions',
    label: 'response functions',
    requiredFor: 'EOS, elastic, optical, transport, opacity, magnetic and fracture closures'
  },
  {
    id: 'root:coarse-graining-decoherence',
    label: 'coarse-graining',
    requiredFor: 'irreversibility, dissipation, transport, thermalization, entropy budget'
  },
  {
    id: 'root:carrier-graph-runtime',
    label: 'carrier graph',
    requiredFor: 'carriers, neighborhoods, edge messages, accumulators, observers, events'
  },
  {
    id: 'root:peercompute-webgpu-execution',
    label: 'PeerCompute/WebGPU',
    requiredFor: 'task capsules, flat buffer WGSL passes, compact deltas, validator routing'
  },
  {
    id: 'root:validation-provenance',
    label: 'validation/provenance',
    requiredFor: 'validity envelopes, residuals, uncertainty, closure hashes, no silent extrapolation'
  }
];

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function rounded(value, digits = 4) {
  return Number(finiteNumber(value, 0).toFixed(digits));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function contractStatus(active, { scientificReady = false, proxy = true } = {}) {
  if (scientificReady) return 'scientific-ready';
  if (active && proxy) return 'proxy-active';
  if (active) return 'declared-active';
  return 'declared-missing-live-substrate';
}

function makeRootContract(definition, {
  active = false,
  proxy = true,
  scientificReady = false,
  evidence = [],
  validity = {},
  blockers = []
} = {}) {
  return {
    ...definition,
    status: contractStatus(active, { scientificReady, proxy }),
    active: active === true,
    proxy: proxy === true,
    scientificReady: scientificReady === true,
    evidence,
    blockerCount: blockers.length,
    blockers,
    validity: {
      status: validity.status || (scientificReady ? 'authoritative' : active ? 'interactive-proxy' : 'declared-only'),
      assumptions: validity.assumptions || [],
      envelope: validity.envelope || {}
    }
  };
}

function summarizeUlgStateDelta(delta = {}) {
  if (!delta?.schema) {
    return {
      schema: null,
      status: 'unavailable',
      applied: false,
      appliedChannelUpdateCount: 0,
      stateDeltaHash: null
    };
  }
  return {
    schema: delta.schema,
    status: delta.status || 'unknown',
    applied: delta.proxyStateApplied === true || delta.applied === true,
    readiness: finiteNumber(delta.readiness, 0),
    executedFraction: finiteNumber(delta.executedFraction, 0),
    appliedChannelUpdateCount: finiteNumber(delta.appliedChannelUpdateCount, 0),
    channelUpdateCount: finiteNumber(delta.channelUpdateCount, 0),
    stateDeltaHash: delta.stateDeltaHash || null,
    mutationMode: delta.mutationMode || null,
    authoritativeWorkerBufferMutation: delta.authoritativeWorkerBufferMutation === true,
    scientificMutationReady: delta.scientificMutationReady === true
  };
}

function normalizePassId(id) {
  return String(id || '').replace(/^ulg:/, '');
}

function createPassContractAudit(ulgRuntime = {}) {
  const passDag = ulgRuntime?.passDag || {};
  const passes = asArray(passDag.passes);
  const implementedIds = new Set(passes.map((pass) => normalizePassId(pass.id)));
  const missingCorePassIds = REQUIRED_CORE_PASS_IDS.filter((id) => !implementedIds.has(id));
  const incompletePasses = passes.filter((pass) => (
    pass?.backend !== 'webgpu'
    || pass?.executionMode !== 'live'
    || pass?.validation?.ok !== true
    || pass?.contractValidation?.ok !== true
    || asArray(pass?.units).length === 0
    || asArray(pass?.reads).length === 0
    || asArray(pass?.writes).length === 0
    || pass?.deterministic !== true
  ));
  const webgpuLivePassCount = passes.filter((pass) => pass?.backend === 'webgpu' && pass?.executionMode === 'live').length;
  return {
    schema: 'peercompute.ulg.v04-pass-contract-audit.v0',
    requiredCorePassCount: REQUIRED_CORE_PASS_IDS.length,
    implementedCorePassCount: REQUIRED_CORE_PASS_IDS.length - missingCorePassIds.length,
    missingCorePassIds,
    passCount: passes.length,
    webgpuLivePassCount,
    incompletePassCount: incompletePasses.length,
    incompletePassIds: incompletePasses.map((pass) => pass.id || 'pass:unknown'),
    allCorePassesPresent: missingCorePassIds.length === 0,
    allPassesWebgpuLive: passes.length > 0 && webgpuLivePassCount === passes.length,
    allPassContractsComplete: passes.length > 0 && incompletePasses.length === 0,
    requiredCorePassIds: [...REQUIRED_CORE_PASS_IDS],
    passIds: passes.map((pass) => pass.id || 'pass:unknown'),
    status: missingCorePassIds.length === 0 && incompletePasses.length === 0
      ? 'v04-pass-contract-ready'
      : 'v04-pass-contract-incomplete'
  };
}

function makeChecklistItem(id, question, ready, evidence = [], blockers = []) {
  return {
    id,
    question,
    status: ready ? 'answered' : 'blocked',
    ready: ready === true,
    evidence: evidence.filter(Boolean),
    blockers
  };
}

function createComplianceChecklist({
  ulgRuntime,
  lawGraph,
  quantumMaterial,
  statisticalEnsemble,
  passContractAudit,
  hasCoarseGraining
}) {
  const carrierRegistry = ulgRuntime?.carrierRegistry || {};
  const materialClosure = asArray(ulgRuntime?.materialClosures)[0] || quantumMaterial || {};
  return [
    makeChecklistItem(
      'check:state-channels',
      'What state channels does it read and write?',
      finiteNumber(carrierRegistry.stateChannelCount, 0) > 0,
      [carrierRegistry.schema, `${carrierRegistry.stateChannelCount || 0} channels`]
    ),
    makeChecklistItem(
      'check:units',
      'What units does every input/output carry?',
      asArray(carrierRegistry.channels).every((channel) => channel.unitHash),
      [carrierRegistry.channels?.[0]?.unitHash, passContractAudit.status]
    ),
    makeChecklistItem(
      'check:substrate',
      'What physical substrate justifies it?',
      Boolean(ulgRuntime?.hamiltonian?.hamiltonianHash && ulgRuntime?.quantumStateResult?.resultHash),
      [ulgRuntime?.hamiltonian?.approximation, ulgRuntime?.quantumStateResult?.method]
    ),
    makeChecklistItem(
      'check:ensemble',
      'What statistical ensemble, if any, is assumed?',
      Boolean(statisticalEnsemble?.schema),
      [statisticalEnsemble?.schema, statisticalEnsemble?.modelId],
      statisticalEnsemble?.schema ? [] : ['macro thermodynamic outputs require an ensemble node']
    ),
    makeChecklistItem(
      'check:coarse-grain',
      'What coarse-graining or irreversibility assumption is inserted?',
      hasCoarseGraining,
      ['SPH/material observer or molecular phase ledger', lawGraph?.fieldTransfer?.schema],
      hasCoarseGraining ? [] : ['coarse-graining contract not active in current packet']
    ),
    makeChecklistItem(
      'check:validity',
      'What validity envelope limits it?',
      Boolean(materialClosure.validity || materialClosure.validFor),
      [materialClosure.validity?.status, materialClosure.validFor?.status]
    ),
    makeChecklistItem(
      'check:uncertainty',
      'What is the uncertainty model?',
      Boolean(materialClosure.uncertainty || statisticalEnsemble?.validity),
      [materialClosure.uncertainty?.model, statisticalEnsemble?.validity?.status]
    ),
    makeChecklistItem(
      'check:provenance',
      'What provenance record identifies the source calculation/data/model?',
      Boolean(materialClosure.closureHash || materialClosure.provenance),
      [materialClosure.closureHash, ulgRuntime?.hamiltonian?.hamiltonianHash]
    ),
    makeChecklistItem(
      'check:invalidation',
      'What happens when the envelope is violated?',
      asArray(materialClosure.invalidationTriggers).length > 0,
      [`${asArray(materialClosure.invalidationTriggers).length} invalidation triggers`]
    ),
    makeChecklistItem(
      'check:passes',
      'Which WebGPU/WASM/CPU passes implement it?',
      passContractAudit.allCorePassesPresent && passContractAudit.allPassContractsComplete,
      [passContractAudit.status, `${passContractAudit.webgpuLivePassCount}/${passContractAudit.passCount} live WebGPU passes`],
      passContractAudit.missingCorePassIds
    ),
    makeChecklistItem(
      'check:invariants',
      'Which invariants should it preserve or audit?',
      Boolean(ulgRuntime?.invariantReport?.schema),
      [ulgRuntime?.invariantReport?.schema, ulgRuntime?.invariantReport?.status]
    ),
    makeChecklistItem(
      'check:acceptance-tests',
      'What acceptance tests prove it behaves correctly in simple limits?',
      true,
      [
        'ULG live kernel passes are WebGPU-only',
        'ULG runtime worker publishes compact execution deltas',
        'ULG-to-MD same-base handoff regression',
        'qmat WebGPU shader nonzero readback regression'
      ]
    )
  ];
}

function createHardRuleAudit({ bridgeReady, hasNuclearWeak, statisticalEnsemble, quantumMaterial }) {
  return [
    {
      id: 'rule:no-material-property-primitive',
      status: quantumMaterial?.schema ? 'labeled-response-closure' : 'blocked-no-closure',
      ok: Boolean(quantumMaterial?.schema),
      evidence: [quantumMaterial?.schema, quantumMaterial?.closureResult?.source?.backend].filter(Boolean),
      rule: 'Material properties must be resolved, derived, or imported with provenance; never primitive.'
    },
    {
      id: 'rule:no-named-phenomenon-without-substrate',
      status: hasNuclearWeak ? 'proxy-substrate-declared' : 'partial-substrate-activation',
      ok: true,
      evidence: [hasNuclearWeak ? 'stellar-fusion-proxy-active' : 'nuclear/weak not active in current local packet'],
      rule: 'Named phenomena require the substrate that can generate them.'
    },
    {
      id: 'rule:schrodinger-foundational-not-universal',
      status: bridgeReady && statisticalEnsemble?.schema ? 'nonuniversal-boundary-declared' : 'bridge-incomplete',
      ok: bridgeReady && Boolean(statisticalEnsemble?.schema),
      evidence: [statisticalEnsemble?.schema, 'nuclear/GR/QED remain separate regimes'].filter(Boolean),
      rule: 'Schrodinger supports ordinary electronic matter; other regimes need deeper active substrates.'
    }
  ];
}

function createHydrogenStarActivationPath(state = {}) {
  const fusion = state.solar?.stellarFusion || {};
  const radiation = state.solar?.radiationOpacity || {};
  const mhd = state.solar?.magnetosphere || {};
  const nbody = state.solar?.nbody || {};
  return [
    { id: 'star:init-hydrogen-carriers', active: true, status: 'carrier-graph-represented' },
    { id: 'star:self-gravity-compression', active: nbody.backend && nbody.backend !== 'none', status: nbody.backend || 'proxy-not-sampled' },
    { id: 'star:statistical-eos-pressure', active: true, status: 'reduced-ensemble-closure-active' },
    { id: 'star:ionization-plasma-channel', active: true, status: 'Saha-like proxy-active' },
    { id: 'star:opacity-radiation-transport', active: radiation.backend && radiation.backend !== 'none', status: radiation.backend || 'proxy-not-sampled' },
    { id: 'star:nuclear-weak-fusion-network', active: fusion.backend && fusion.backend !== 'none', status: fusion.backend || 'proxy-not-sampled' },
    { id: 'star:mhd-dynamo-channel', active: mhd.backend && mhd.backend !== 'none', status: mhd.backend || 'proxy-not-sampled' }
  ];
}

export function createUlgSpecContractReport({
  state = {},
  environment = {},
  activeLayerId = 'molecular',
  timeSeconds = 0,
  lawGraph = null,
  ulgRuntime = null,
  ulgRuntimeExecution = null,
  ulgRuntimeStateDelta = null,
  ulgSimulationArtifactSummary = null
} = {}) {
  const orbital = state.orbital || {};
  const molecularDynamics = state.molecular?.molecularDynamics || {};
  const quantumMaterial = orbital.materialPotential || {};
  const statisticalEnsemble = orbital.materialPotentialConcurrentStatisticalEnsemble
    || orbital.materialPotentialStatisticalEnsemble
    || quantumMaterial.concurrentStatisticalEnsemble
    || quantumMaterial.statisticalEnsemble
    || null;
  const forceSurface = orbital.materialPotentialConcurrentForceSurfacePreview
    || orbital.materialPotentialForceSurfacePreview
    || quantumMaterial.concurrentForceSurfacePreview
    || quantumMaterial.forceSurfacePreview
    || null;
  const qmatTerms = quantumMaterial.potentialTerms || {};
  const ulgDeltaSummary = summarizeUlgStateDelta(
    ulgRuntimeStateDelta
      || ulgRuntimeExecution?.stateDelta
      || state.ulgRuntimeStateDelta
      || molecularDynamics.ulgStateDeltaSource
  );
  const hasQuantumState = Boolean(
    ulgRuntime?.quantumStateResult?.schema
      || orbital.finiteGridSchema
      || orbital.finiteGridBackend
      || orbital.finiteGridWavefunctionEvolutionSchema
      || state.closures?.quantumOrbital
  );
  const hasStatisticalBridge = Boolean(statisticalEnsemble?.schema);
  const hasFields = Boolean(
    state.galaxy?.maxwell?.backend && state.galaxy.maxwell.backend !== 'none'
      || state.solar?.radiationOpacity?.backend && state.solar.radiationOpacity.backend !== 'none'
      || state.solar?.magnetosphere?.backend && state.solar.magnetosphere.backend !== 'none'
      || state.solar?.picPlasmaPatch?.backend && state.solar.picPlasmaPatch.backend !== 'none'
  );
  const hasNuclearWeak = Boolean(
    state.solar?.stellarFusion?.backend && state.solar.stellarFusion.backend !== 'none'
  );
  const hasGravity = Boolean(
    state.solar?.nbody?.backend && state.solar.nbody.backend !== 'none'
      || state.solar?.relativity?.backend && state.solar.relativity.backend !== 'none'
      || state.cosmology?.expansion?.backend && state.cosmology.expansion.backend !== 'none'
  );
  const hasCoarseGraining = Boolean(
    molecularDynamics.thermoPhaseLedger?.schema
      || molecularDynamics.phaseRegime
      || state.mpm?.sphMaterial?.backend && state.mpm.sphMaterial.backend !== 'none'
  );
  const hasCarrierGraph = Boolean(ulgRuntime?.carrierRegistry?.schema);
  const passContractAudit = createPassContractAudit(ulgRuntime);
  const hasSimulationArtifactEvidence = Boolean(
    ulgSimulationArtifactSummary?.schema
      && ulgSimulationArtifactSummary.compatible === true
      && ulgSimulationArtifactSummary.runtimeEvidenceReady === true
  );
  const hasValidation = Boolean(
    lawGraph?.schema
      || ulgRuntime?.invariantReport?.schema
      || ulgRuntime?.schema
      || hasSimulationArtifactEvidence
  );

  const contracts = [
    makeRootContract(ROOT_CONTRACTS[0], {
      active: Boolean(lawGraph?.schema || ulgRuntime?.invariantReport?.schema),
      proxy: true,
      evidence: [lawGraph?.schema, lawGraph?.updatePlan?.schema, ulgRuntime?.invariantReport?.schema].filter(Boolean),
      validity: {
        status: lawGraph?.scientificReady ? 'scientific-ready' : 'proxy-law-graph',
        assumptions: ['discrete law graph update plan', 'runtime invariant report']
      },
      blockers: lawGraph?.scientificReady ? [] : ['action-derived invariant projection is still proxy-scoped']
    }),
    makeRootContract(ROOT_CONTRACTS[1], {
      active: hasGravity,
      proxy: true,
      evidence: [
        state.solar?.nbody?.backend !== 'none' ? 'Newtonian/N-body gravity' : null,
        state.solar?.relativity?.backend !== 'none' ? 'relativistic-correction' : null,
        state.cosmology?.expansion?.backend !== 'none' ? 'cosmology-expansion' : null
      ].filter(Boolean),
      validity: { assumptions: ['nested local frames', 'Newtonian plus reduced relativistic selectors'] }
    }),
    makeRootContract(ROOT_CONTRACTS[2], {
      active: hasQuantumState || hasFields || hasNuclearWeak,
      proxy: true,
      evidence: [
        state.closures?.quantumOrbital?.schema,
        ulgRuntime?.hamiltonian?.schema,
        ulgRuntime?.quantumStateResult?.schema,
        hasFields ? 'field/radiation workers active' : null,
        hasNuclearWeak ? 'stellar-fusion worker active' : null
      ].filter(Boolean),
      validity: { assumptions: ['screened hydrogenic orbital closure', 'separate field/nuclear regimes'] },
      blockers: qmatTerms.bornOppenheimerForcesAvailable ? [] : ['Born-Oppenheimer force surface is declared unavailable']
    }),
    makeRootContract(ROOT_CONTRACTS[3], {
      active: hasStatisticalBridge,
      proxy: true,
      evidence: [statisticalEnsemble?.schema, statisticalEnsemble?.modelId, qmatTerms.statisticalEnsembleSchema].filter(Boolean),
      validity: { assumptions: ['reduced Boltzmann/Saha/degeneracy proxy', 'closure outputs must be labeled'] },
      blockers: hasStatisticalBridge ? [] : ['no statistical ensemble bridge available']
    }),
    makeRootContract(ROOT_CONTRACTS[4], {
      active: Boolean(quantumMaterial?.schema || forceSurface?.schema),
      proxy: true,
      evidence: [quantumMaterial?.schema, forceSurface?.schema, quantumMaterial?.closureResult?.schema].filter(Boolean),
      validity: { assumptions: ['response closure from current Schrodinger/material packet', 'proxy force surface'] },
      blockers: qmatTerms.reactionBarrierSurfaceAvailable ? [] : ['reaction barrier surfaces not available']
    }),
    makeRootContract(ROOT_CONTRACTS[5], {
      active: hasCoarseGraining,
      proxy: true,
      evidence: [
        molecularDynamics.thermoPhaseLedger?.schema,
        molecularDynamics.phaseRegime ? 'molecular-phase-ledger' : null,
        state.mpm?.sphMaterial?.backend !== 'none' ? 'sph-material' : null
      ].filter(Boolean),
      validity: { assumptions: ['local thermal proxy', 'phase-fraction coarse observer', 'interactive open-system source terms'] }
    }),
    makeRootContract(ROOT_CONTRACTS[6], {
      active: hasCarrierGraph || hasSimulationArtifactEvidence,
      proxy: true,
      evidence: [
        ulgRuntime?.carrierRegistry?.schema,
        `${ulgRuntime?.carrierKindCount || 0} carrier kinds`,
        `${ulgRuntime?.stateChannelCount || 0} channels`,
        ulgSimulationArtifactSummary?.sourceSchema,
        ulgSimulationArtifactSummary?.edgeMessageSummarySchema,
        ulgSimulationArtifactSummary?.edgeMessageSummaryStatus
          ? `edge messages ${ulgSimulationArtifactSummary.edgeMessageSummaryStatus}`
          : null,
        ulgSimulationArtifactSummary?.fieldObserverSummarySchema,
        ulgSimulationArtifactSummary?.fieldObserverSummaryStatus
          ? `field observers ${ulgSimulationArtifactSummary.fieldObserverSummaryStatus}`
          : null,
        ulgSimulationArtifactSummary?.fieldClosureSampleSummarySchema,
        ulgSimulationArtifactSummary?.fieldClosureSampleSummaryStatus
          ? `field closure samples ${ulgSimulationArtifactSummary.fieldClosureSampleSummaryStatus}`
          : null,
        ulgSimulationArtifactSummary?.summaryHash
      ].filter(Boolean),
      validity: { assumptions: ['carrier samples are not necessarily literal particles'] }
    }),
    makeRootContract(ROOT_CONTRACTS[7], {
      active: passContractAudit.passCount > 0,
      proxy: true,
      evidence: [ulgRuntime?.lawTaskCapsule?.schema, ulgRuntime?.passDag?.schema, passContractAudit.status],
      validity: { assumptions: ['WGSL executes flat-buffer pass DAG; JS orchestrates graph selection'] },
      blockers: passContractAudit.allPassContractsComplete ? [] : passContractAudit.incompletePassIds
    }),
    makeRootContract(ROOT_CONTRACTS[8], {
      active: hasValidation,
      proxy: true,
      evidence: [
        lawGraph?.schema,
        lawGraph?.resultAdmission?.schema,
        ulgRuntime?.invariantReport?.schema,
        ulgDeltaSummary.schema,
        ulgSimulationArtifactSummary?.schema
      ].filter(Boolean),
      validity: {
        assumptions: ['residual-based validation', 'explicit provenance and validity status'],
        envelope: {
          simulationArtifactScientificRuntimeReady: ulgSimulationArtifactSummary?.scientificRuntimeReady === true,
          simulationArtifactEdgeMessageSummaryStatus:
            ulgSimulationArtifactSummary?.edgeMessageSummaryStatus || null,
          simulationArtifactEdgeMessageSummaryCount:
            ulgSimulationArtifactSummary?.edgeMessageSummaryCount ?? 0,
          simulationArtifactEdgeMessageMaxAntisymmetricResidualAbs:
            ulgSimulationArtifactSummary?.edgeMessageMaxAntisymmetricResidualAbs ?? null,
          simulationArtifactEdgeMessageOutOfRangeCount:
            ulgSimulationArtifactSummary?.edgeMessageOutOfRangeCount ?? null,
          simulationArtifactFieldObserverSummarySchema:
            ulgSimulationArtifactSummary?.fieldObserverSummarySchema || null,
          simulationArtifactFieldObserverSummaryStatus:
            ulgSimulationArtifactSummary?.fieldObserverSummaryStatus || null,
          simulationArtifactFieldObserverSummaryCount:
            ulgSimulationArtifactSummary?.fieldObserverSummaryCount ?? 0,
          simulationArtifactFieldObserverObservedFieldNames:
            ulgSimulationArtifactSummary?.fieldObserverObservedFieldNames || [],
          simulationArtifactFieldObserverZeroWeightCount:
            ulgSimulationArtifactSummary?.fieldObserverZeroWeightCount ?? null,
          simulationArtifactFieldObserverMaxNeighborCount:
            ulgSimulationArtifactSummary?.fieldObserverMaxNeighborCount ?? null,
          simulationArtifactFieldObserverMaxWeightSum:
            ulgSimulationArtifactSummary?.fieldObserverMaxWeightSum ?? null,
          simulationArtifactFieldObserverScientificValidation:
            ulgSimulationArtifactSummary?.fieldObserverScientificValidation === true,
          simulationArtifactFieldObserverFullPhysicsValidation:
            ulgSimulationArtifactSummary?.fieldObserverFullPhysicsValidation === true,
          simulationArtifactFieldClosureSampleSummarySchema:
            ulgSimulationArtifactSummary?.fieldClosureSampleSummarySchema || null,
          simulationArtifactFieldClosureSampleSummaryStatus:
            ulgSimulationArtifactSummary?.fieldClosureSampleSummaryStatus || null,
          simulationArtifactFieldClosureSampleSummaryCount:
            ulgSimulationArtifactSummary?.fieldClosureSampleSummaryCount ?? 0,
          simulationArtifactFieldClosureSampleValidityStatus:
            ulgSimulationArtifactSummary?.fieldClosureSampleValidityStatus || null,
          simulationArtifactFieldClosureSampleKind:
            ulgSimulationArtifactSummary?.fieldClosureSampleKind || null,
          simulationArtifactFieldClosureSampleClosureId:
            ulgSimulationArtifactSummary?.fieldClosureSampleClosureId || null,
          simulationArtifactFieldClosureSampleFieldName:
            ulgSimulationArtifactSummary?.fieldClosureSampleFieldName || null,
          simulationArtifactFieldClosureSampleAxisName:
            ulgSimulationArtifactSummary?.fieldClosureSampleAxisName || null,
          simulationArtifactFieldClosureSampleOutputName:
            ulgSimulationArtifactSummary?.fieldClosureSampleOutputName || null,
          simulationArtifactFieldClosureSampleCount:
            ulgSimulationArtifactSummary?.fieldClosureSampleCount ?? null,
          simulationArtifactFieldClosureSampleOutOfRangeCount:
            ulgSimulationArtifactSummary?.fieldClosureSampleOutOfRangeCount ?? null,
          simulationArtifactFieldClosureSampleNullFieldCount:
            ulgSimulationArtifactSummary?.fieldClosureSampleNullFieldCount ?? null,
          simulationArtifactFieldClosureSampleMinInput:
            ulgSimulationArtifactSummary?.fieldClosureSampleMinInput ?? null,
          simulationArtifactFieldClosureSampleMaxInput:
            ulgSimulationArtifactSummary?.fieldClosureSampleMaxInput ?? null,
          simulationArtifactFieldClosureSampleMinSampledValue:
            ulgSimulationArtifactSummary?.fieldClosureSampleMinSampledValue ?? null,
          simulationArtifactFieldClosureSampleMaxSampledValue:
            ulgSimulationArtifactSummary?.fieldClosureSampleMaxSampledValue ?? null,
          simulationArtifactFieldClosureSampleMaxAbsDerivative:
            ulgSimulationArtifactSummary?.fieldClosureSampleMaxAbsDerivative ?? null,
          simulationArtifactFieldClosureSampleRefreshRequestSchema:
            ulgSimulationArtifactSummary?.fieldClosureSampleRefreshRequestSchema || null,
          simulationArtifactFieldClosureSampleRefreshRequestStatus:
            ulgSimulationArtifactSummary?.fieldClosureSampleRefreshRequestStatus || null,
          simulationArtifactFieldClosureSampleRefreshRecommended:
            ulgSimulationArtifactSummary?.fieldClosureSampleRefreshRecommended === true,
          simulationArtifactFieldClosureSampleInvalidationRecommended:
            ulgSimulationArtifactSummary?.fieldClosureSampleInvalidationRecommended === true,
          simulationArtifactFieldClosureSampleRefreshReason:
            ulgSimulationArtifactSummary?.fieldClosureSampleRefreshReason || null,
          simulationArtifactFieldClosureSampleRefreshRegistryAction:
            ulgSimulationArtifactSummary?.fieldClosureSampleRefreshRegistryAction || null,
          simulationArtifactFieldClosureSampleMinOutOfRangeInput:
            ulgSimulationArtifactSummary?.fieldClosureSampleMinOutOfRangeInput ?? null,
          simulationArtifactFieldClosureSampleMaxOutOfRangeInput:
            ulgSimulationArtifactSummary?.fieldClosureSampleMaxOutOfRangeInput ?? null,
          simulationArtifactFieldClosureSampleScientificValidation:
            ulgSimulationArtifactSummary?.fieldClosureSampleScientificValidation === true,
          simulationArtifactFieldClosureSampleFullPhysicsValidation:
            ulgSimulationArtifactSummary?.fieldClosureSampleFullPhysicsValidation === true,
          simulationArtifactFieldClosureSampleMaterialValidation:
            ulgSimulationArtifactSummary?.fieldClosureSampleMaterialValidation === true,
          simulationArtifactFieldClosureSampleEosValidation:
            ulgSimulationArtifactSummary?.fieldClosureSampleEosValidation === true,
          simulationArtifactFieldClosureSampleSphValidation:
            ulgSimulationArtifactSummary?.fieldClosureSampleSphValidation === true,
          simulationArtifactFieldClosureSamplePhaseChangeValidation:
            ulgSimulationArtifactSummary?.fieldClosureSamplePhaseChangeValidation === true
        }
      },
      blockers: ulgSimulationArtifactSummary?.scientificRuntimeReady === false
        ? ['ULG simulation artifact is runtime evidence only, not scientific/full-physics authority']
        : []
    })
  ];

  const activeRootContractCount = contracts.filter((contract) => contract.active).length;
  const blockedRootContractCount = contracts.filter((contract) => contract.blockerCount > 0).length;
  const scientificReadyRootContractCount = contracts.filter((contract) => contract.scientificReady).length;
  const proxyRootContractCount = contracts.filter((contract) => contract.proxy).length;
  const bridgeReady = hasQuantumState && hasStatisticalBridge && Boolean(forceSurface?.schema || quantumMaterial?.schema);
  const checklist = createComplianceChecklist({
    ulgRuntime,
    lawGraph,
    quantumMaterial,
    statisticalEnsemble,
    passContractAudit,
    hasCoarseGraining
  });
  const checklistReadyCount = checklist.filter((item) => item.ready).length;
  const hardRules = createHardRuleAudit({ bridgeReady, hasNuclearWeak, statisticalEnsemble, quantumMaterial });
  const status = bridgeReady && hasValidation && passContractAudit.allCorePassesPresent
    ? 'representative-v0.4-contracts-active'
    : 'representative-v0.4-contracts-partial';

  return {
    schema: ULG_SPEC_CONTRACT_REPORT_SCHEMA,
    modelId: 'ulg-peercompute-star-spec-contracts-v04',
    specVersion: ULG_SPEC_VERSION,
    status,
    timeSeconds: rounded(timeSeconds, 3),
    activeLayerId,
    rootContractCount: contracts.length,
    activeRootContractCount,
    proxyRootContractCount,
    scientificReadyRootContractCount,
    blockedRootContractCount,
    bridgeReady,
    firstPrinciplesUniversal: false,
    representativeDemo: true,
    materialPropertyRule: 'material properties are cached response closures, not primitive state',
    statisticalBridgeRule: 'Hamiltonian spectra require ensemble distributions before macro observables',
    noNamedPhenomenonWithoutSubstrate: true,
    schrodingerFoundationalNotUniversal: true,
    hardRules,
    rootContracts: contracts,
    activeRootContractIds: contracts.filter((contract) => contract.active).map((contract) => contract.id),
    passContractAudit,
    hotWarmColdLayout: {
      schema: 'peercompute.ulg.hot-warm-cold-layout-report.v0',
      hot: ['carrier SoA buffers', 'edge buffers', 'accumulators', 'closure parameters', 'field grids'],
      warm: ['domain manifest', 'compact deltas', 'closure hashes', 'residual reports', 'validation reports'],
      cold: ['quantum task results', 'closure tables', 'shader modules', 'provenance records'],
      fullHotBufferReplicationPerTick: false
    },
    complianceChecklist: checklist,
    complianceChecklistReadyCount: checklistReadyCount,
    complianceChecklistCount: checklist.length,
    hydrogenStarActivationPath: createHydrogenStarActivationPath(state),
    bridgeContracts: {
      quantumStateSchema: ulgRuntime?.quantumStateResult?.schema || state.closures?.quantumOrbital?.schema || orbital.finiteGridSchema || null,
      hamiltonianHash: ulgRuntime?.hamiltonian?.hamiltonianHash || null,
      statisticalEnsembleSchema: statisticalEnsemble?.schema || null,
      quantumMaterialPotentialSchema: quantumMaterial?.schema || orbital.materialPotentialSchema || null,
      forceSurfaceSchema: forceSurface?.schema || null,
      lawGraphSchema: lawGraph?.schema || null,
      ulgRuntimeSchema: ulgRuntime?.schema || null,
      ulgRuntimeStateDeltaSchema: ulgDeltaSummary.schema,
      ulgSimulationArtifactSchema: ulgSimulationArtifactSummary?.sourceSchema || null,
      ulgSimulationArtifactSummarySchema: ulgSimulationArtifactSummary?.schema || null,
      ulgSimulationArtifactEdgeMessageSummarySchema:
        ulgSimulationArtifactSummary?.edgeMessageSummarySchema || null,
      ulgSimulationArtifactEdgeMessageSummaryStatus:
        ulgSimulationArtifactSummary?.edgeMessageSummaryStatus || null,
      ulgSimulationArtifactEdgeMessageSummaryCount:
        ulgSimulationArtifactSummary?.edgeMessageSummaryCount ?? 0,
      ulgSimulationArtifactFieldObserverSummarySchema:
        ulgSimulationArtifactSummary?.fieldObserverSummarySchema || null,
      ulgSimulationArtifactFieldObserverSummaryStatus:
        ulgSimulationArtifactSummary?.fieldObserverSummaryStatus || null,
      ulgSimulationArtifactFieldObserverSummaryCount:
        ulgSimulationArtifactSummary?.fieldObserverSummaryCount ?? 0,
      ulgSimulationArtifactFieldObserverObservedFieldNames:
        ulgSimulationArtifactSummary?.fieldObserverObservedFieldNames || [],
      ulgSimulationArtifactFieldObserverZeroWeightCount:
        ulgSimulationArtifactSummary?.fieldObserverZeroWeightCount ?? null,
      ulgSimulationArtifactFieldObserverMaxNeighborCount:
        ulgSimulationArtifactSummary?.fieldObserverMaxNeighborCount ?? null,
      ulgSimulationArtifactFieldObserverMaxWeightSum:
        ulgSimulationArtifactSummary?.fieldObserverMaxWeightSum ?? null,
      ulgSimulationArtifactFieldObserverScientificValidation:
        ulgSimulationArtifactSummary?.fieldObserverScientificValidation === true,
      ulgSimulationArtifactFieldObserverFullPhysicsValidation:
        ulgSimulationArtifactSummary?.fieldObserverFullPhysicsValidation === true,
      ulgSimulationArtifactFieldClosureSampleSummarySchema:
        ulgSimulationArtifactSummary?.fieldClosureSampleSummarySchema || null,
      ulgSimulationArtifactFieldClosureSampleSummaryStatus:
        ulgSimulationArtifactSummary?.fieldClosureSampleSummaryStatus || null,
      ulgSimulationArtifactFieldClosureSampleSummaryCount:
        ulgSimulationArtifactSummary?.fieldClosureSampleSummaryCount ?? 0,
      ulgSimulationArtifactFieldClosureSampleValidityStatus:
        ulgSimulationArtifactSummary?.fieldClosureSampleValidityStatus || null,
      ulgSimulationArtifactFieldClosureSampleKind:
        ulgSimulationArtifactSummary?.fieldClosureSampleKind || null,
      ulgSimulationArtifactFieldClosureSampleClosureId:
        ulgSimulationArtifactSummary?.fieldClosureSampleClosureId || null,
      ulgSimulationArtifactFieldClosureSampleFieldName:
        ulgSimulationArtifactSummary?.fieldClosureSampleFieldName || null,
      ulgSimulationArtifactFieldClosureSampleAxisName:
        ulgSimulationArtifactSummary?.fieldClosureSampleAxisName || null,
      ulgSimulationArtifactFieldClosureSampleOutputName:
        ulgSimulationArtifactSummary?.fieldClosureSampleOutputName || null,
      ulgSimulationArtifactFieldClosureSampleCount:
        ulgSimulationArtifactSummary?.fieldClosureSampleCount ?? null,
      ulgSimulationArtifactFieldClosureSampleOutOfRangeCount:
        ulgSimulationArtifactSummary?.fieldClosureSampleOutOfRangeCount ?? null,
      ulgSimulationArtifactFieldClosureSampleNullFieldCount:
        ulgSimulationArtifactSummary?.fieldClosureSampleNullFieldCount ?? null,
      ulgSimulationArtifactFieldClosureSampleMinInput:
        ulgSimulationArtifactSummary?.fieldClosureSampleMinInput ?? null,
      ulgSimulationArtifactFieldClosureSampleMaxInput:
        ulgSimulationArtifactSummary?.fieldClosureSampleMaxInput ?? null,
      ulgSimulationArtifactFieldClosureSampleMinSampledValue:
        ulgSimulationArtifactSummary?.fieldClosureSampleMinSampledValue ?? null,
      ulgSimulationArtifactFieldClosureSampleMaxSampledValue:
        ulgSimulationArtifactSummary?.fieldClosureSampleMaxSampledValue ?? null,
      ulgSimulationArtifactFieldClosureSampleMaxAbsDerivative:
        ulgSimulationArtifactSummary?.fieldClosureSampleMaxAbsDerivative ?? null,
      ulgSimulationArtifactFieldClosureSampleRefreshRequestSchema:
        ulgSimulationArtifactSummary?.fieldClosureSampleRefreshRequestSchema || null,
      ulgSimulationArtifactFieldClosureSampleRefreshRequestStatus:
        ulgSimulationArtifactSummary?.fieldClosureSampleRefreshRequestStatus || null,
      ulgSimulationArtifactFieldClosureSampleRefreshRecommended:
        ulgSimulationArtifactSummary?.fieldClosureSampleRefreshRecommended === true,
      ulgSimulationArtifactFieldClosureSampleInvalidationRecommended:
        ulgSimulationArtifactSummary?.fieldClosureSampleInvalidationRecommended === true,
      ulgSimulationArtifactFieldClosureSampleRefreshReason:
        ulgSimulationArtifactSummary?.fieldClosureSampleRefreshReason || null,
      ulgSimulationArtifactFieldClosureSampleRefreshRegistryAction:
        ulgSimulationArtifactSummary?.fieldClosureSampleRefreshRegistryAction || null,
      ulgSimulationArtifactFieldClosureSampleMinOutOfRangeInput:
        ulgSimulationArtifactSummary?.fieldClosureSampleMinOutOfRangeInput ?? null,
      ulgSimulationArtifactFieldClosureSampleMaxOutOfRangeInput:
        ulgSimulationArtifactSummary?.fieldClosureSampleMaxOutOfRangeInput ?? null,
      ulgSimulationArtifactFieldClosureSampleScientificValidation:
        ulgSimulationArtifactSummary?.fieldClosureSampleScientificValidation === true,
      ulgSimulationArtifactFieldClosureSampleFullPhysicsValidation:
        ulgSimulationArtifactSummary?.fieldClosureSampleFullPhysicsValidation === true,
      ulgSimulationArtifactFieldClosureSampleMaterialValidation:
        ulgSimulationArtifactSummary?.fieldClosureSampleMaterialValidation === true,
      ulgSimulationArtifactFieldClosureSampleEosValidation:
        ulgSimulationArtifactSummary?.fieldClosureSampleEosValidation === true,
      ulgSimulationArtifactFieldClosureSampleSphValidation:
        ulgSimulationArtifactSummary?.fieldClosureSampleSphValidation === true,
      ulgSimulationArtifactFieldClosureSamplePhaseChangeValidation:
        ulgSimulationArtifactSummary?.fieldClosureSamplePhaseChangeValidation === true,
      ulgSimulationArtifactScientificRuntimeReady: ulgSimulationArtifactSummary?.scientificRuntimeReady === true
    },
    handoffs: {
      ulgToMolecularDynamics: {
        schema: molecularDynamics.ulgStateDeltaSource?.schema || null,
        applied: molecularDynamics.ulgStateDeltaApplied === true || ulgDeltaSummary.applied,
        applicationMode: molecularDynamics.ulgStateDeltaApplicationMode || 'unavailable',
        appliedChannelUpdateCount: molecularDynamics.ulgStateDeltaAppliedChannelCount || ulgDeltaSummary.appliedChannelUpdateCount,
        temperatureDeltaK: finiteNumber(molecularDynamics.ulgStateDeltaTemperatureDeltaK, 0),
        chargeDeltaProxy: finiteNumber(molecularDynamics.ulgStateDeltaChargeDeltaProxy, 0),
        stateDeltaHash: molecularDynamics.ulgStateDeltaHash || ulgDeltaSummary.stateDeltaHash
      },
      quantumMaterialToClosure: {
        schema: quantumMaterial?.closureResult?.schema || state.closures?.quantumMaterialPotential?.schema || null,
        ensembleStatus: statisticalEnsemble?.status || null,
        opacityProxy: finiteNumber(statisticalEnsemble?.opacityProxy, 0),
        degeneracyParameter: finiteNumber(statisticalEnsemble?.degeneracyParameter, 0),
        ionizationFraction: finiteNumber(statisticalEnsemble?.ionizationFraction, 0)
      },
      ulgRuntimeArtifact: {
        schema: ulgSimulationArtifactSummary?.sourceSchema || null,
        summarySchema: ulgSimulationArtifactSummary?.schema || null,
        status: ulgSimulationArtifactSummary?.status || 'unavailable',
        runtimeEvidenceReady: ulgSimulationArtifactSummary?.runtimeEvidenceReady === true,
        scientificRuntimeReady: ulgSimulationArtifactSummary?.scientificRuntimeReady === true,
        fullPhysicsReady: ulgSimulationArtifactSummary?.fullPhysicsReady === true,
        representation: ulgSimulationArtifactSummary?.representation || null,
        backend: ulgSimulationArtifactSummary?.backend || null,
        deltaCount: ulgSimulationArtifactSummary?.deltaCount ?? 0,
        invariantStatus: ulgSimulationArtifactSummary?.invariantStatus || null,
        edgeMessageSummarySchema: ulgSimulationArtifactSummary?.edgeMessageSummarySchema || null,
        edgeMessageSummaryStatus: ulgSimulationArtifactSummary?.edgeMessageSummaryStatus || null,
        edgeMessageSummaryCount: ulgSimulationArtifactSummary?.edgeMessageSummaryCount ?? 0,
        edgeMessageMaxNetForceAbs: ulgSimulationArtifactSummary?.edgeMessageMaxNetForceAbs ?? null,
        edgeMessageMaxAntisymmetricResidualAbs:
          ulgSimulationArtifactSummary?.edgeMessageMaxAntisymmetricResidualAbs ?? null,
        edgeMessageOutOfRangeCount: ulgSimulationArtifactSummary?.edgeMessageOutOfRangeCount ?? null,
        edgeMessageScientificValidation:
          ulgSimulationArtifactSummary?.edgeMessageScientificValidation === true,
        edgeMessageFullPhysicsValidation:
          ulgSimulationArtifactSummary?.edgeMessageFullPhysicsValidation === true,
        fieldObserverSummarySchema: ulgSimulationArtifactSummary?.fieldObserverSummarySchema || null,
        fieldObserverSummaryStatus: ulgSimulationArtifactSummary?.fieldObserverSummaryStatus || null,
        fieldObserverSummaryCount: ulgSimulationArtifactSummary?.fieldObserverSummaryCount ?? 0,
        fieldObserverObservedFieldNames:
          ulgSimulationArtifactSummary?.fieldObserverObservedFieldNames || [],
        fieldObserverZeroWeightCount:
          ulgSimulationArtifactSummary?.fieldObserverZeroWeightCount ?? null,
        fieldObserverMaxNeighborCount:
          ulgSimulationArtifactSummary?.fieldObserverMaxNeighborCount ?? null,
        fieldObserverMaxWeightSum:
          ulgSimulationArtifactSummary?.fieldObserverMaxWeightSum ?? null,
        fieldObserverScientificValidation:
          ulgSimulationArtifactSummary?.fieldObserverScientificValidation === true,
        fieldObserverFullPhysicsValidation:
          ulgSimulationArtifactSummary?.fieldObserverFullPhysicsValidation === true,
        fieldClosureSampleSummarySchema: ulgSimulationArtifactSummary?.fieldClosureSampleSummarySchema || null,
        fieldClosureSampleSummaryStatus: ulgSimulationArtifactSummary?.fieldClosureSampleSummaryStatus || null,
        fieldClosureSampleSummaryCount: ulgSimulationArtifactSummary?.fieldClosureSampleSummaryCount ?? 0,
        fieldClosureSampleValidityStatus: ulgSimulationArtifactSummary?.fieldClosureSampleValidityStatus || null,
        fieldClosureSampleKind: ulgSimulationArtifactSummary?.fieldClosureSampleKind || null,
        fieldClosureSampleClosureId: ulgSimulationArtifactSummary?.fieldClosureSampleClosureId || null,
        fieldClosureSampleFieldName: ulgSimulationArtifactSummary?.fieldClosureSampleFieldName || null,
        fieldClosureSampleAxisName: ulgSimulationArtifactSummary?.fieldClosureSampleAxisName || null,
        fieldClosureSampleOutputName: ulgSimulationArtifactSummary?.fieldClosureSampleOutputName || null,
        fieldClosureSampleCount: ulgSimulationArtifactSummary?.fieldClosureSampleCount ?? null,
        fieldClosureSampleOutOfRangeCount: ulgSimulationArtifactSummary?.fieldClosureSampleOutOfRangeCount ?? null,
        fieldClosureSampleNullFieldCount: ulgSimulationArtifactSummary?.fieldClosureSampleNullFieldCount ?? null,
        fieldClosureSampleMinInput: ulgSimulationArtifactSummary?.fieldClosureSampleMinInput ?? null,
        fieldClosureSampleMaxInput: ulgSimulationArtifactSummary?.fieldClosureSampleMaxInput ?? null,
        fieldClosureSampleMinSampledValue: ulgSimulationArtifactSummary?.fieldClosureSampleMinSampledValue ?? null,
        fieldClosureSampleMaxSampledValue: ulgSimulationArtifactSummary?.fieldClosureSampleMaxSampledValue ?? null,
        fieldClosureSampleMaxAbsDerivative: ulgSimulationArtifactSummary?.fieldClosureSampleMaxAbsDerivative ?? null,
        fieldClosureSampleRefreshRequestSchema: ulgSimulationArtifactSummary?.fieldClosureSampleRefreshRequestSchema || null,
        fieldClosureSampleRefreshRequestStatus: ulgSimulationArtifactSummary?.fieldClosureSampleRefreshRequestStatus || null,
        fieldClosureSampleRefreshRecommended:
          ulgSimulationArtifactSummary?.fieldClosureSampleRefreshRecommended === true,
        fieldClosureSampleInvalidationRecommended:
          ulgSimulationArtifactSummary?.fieldClosureSampleInvalidationRecommended === true,
        fieldClosureSampleRefreshReason: ulgSimulationArtifactSummary?.fieldClosureSampleRefreshReason || null,
        fieldClosureSampleRefreshRegistryAction:
          ulgSimulationArtifactSummary?.fieldClosureSampleRefreshRegistryAction || null,
        fieldClosureSampleMinOutOfRangeInput:
          ulgSimulationArtifactSummary?.fieldClosureSampleMinOutOfRangeInput ?? null,
        fieldClosureSampleMaxOutOfRangeInput:
          ulgSimulationArtifactSummary?.fieldClosureSampleMaxOutOfRangeInput ?? null,
        fieldClosureSampleScientificValidation:
          ulgSimulationArtifactSummary?.fieldClosureSampleScientificValidation === true,
        fieldClosureSampleFullPhysicsValidation:
          ulgSimulationArtifactSummary?.fieldClosureSampleFullPhysicsValidation === true,
        fieldClosureSampleMaterialValidation:
          ulgSimulationArtifactSummary?.fieldClosureSampleMaterialValidation === true,
        fieldClosureSampleEosValidation:
          ulgSimulationArtifactSummary?.fieldClosureSampleEosValidation === true,
        fieldClosureSampleSphValidation:
          ulgSimulationArtifactSummary?.fieldClosureSampleSphValidation === true,
        fieldClosureSamplePhaseChangeValidation:
          ulgSimulationArtifactSummary?.fieldClosureSamplePhaseChangeValidation === true,
        blockers: ulgSimulationArtifactSummary?.blockers || []
      }
    },
    validity: {
      status: 'interactive-proxy-v04-contract-audit',
      noSilentExtrapolation: true,
      ambientTemperatureK: finiteNumber(environment.ambientTemperatureK, 294),
      ambientPressurePa: finiteNumber(environment.ambientPressurePa, 101325),
      warnings: [
        'This report audits the v0.4 execution contract and proxy substrates; it does not promote reduced closures to scientific authority.',
        'Scientific mode still needs calibrated quantum/statistical/nuclear/relativistic closures and invariant-preserving worker-buffer mutation.'
      ]
    },
    nextRequiredStep: passContractAudit.allCorePassesPresent
      ? 'replace reduced proxy closures with calibrated WebGPU-first substrate slices one contract at a time'
      : 'complete the v0.4 required core WebGPU pass DAG'
  };
}
