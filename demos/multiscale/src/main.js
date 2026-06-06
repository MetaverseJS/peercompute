import './styles.css';
import {
  ComputeManager,
  ComputeServiceRegistry,
  NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA,
  NodeKernel,
  StateManager,
  WorkerSupervisor,
  createPlacementAdmissionPolicy,
  createRemoteResultQuorumValidator,
  createUlgDispatchServiceManifests,
  createUlgHandoffServiceDispatchPlan as createPeerComputeUlgHandoffServiceDispatchPlan,
  createUlgHandoffServiceEnvelope as createPeerComputeUlgHandoffServiceEnvelope,
  createUlgHandoffSupervisorServiceExecutor as createPeerComputeUlgHandoffSupervisorServiceExecutor,
  normalizeUlgDemoHandoff as normalizePeerComputeUlgDemoHandoff,
  summarizeUlgArtifact as summarizePeerComputeUlgArtifact
} from '@peercompute';
import {
  MULTISCALE_SCENARIO_PRESETS,
  MultiscaleModel,
  SCALE_LAYERS
} from './simulation/multiscaleModel.js';
import { MultiscaleScene } from './visualization/multiscaleScene.js';
import { MULTISCALE_RENDER_BUDGET_SCHEMA } from './visualization/renderBudget.js';

const ULG_DISPATCH_SERVICE_ADAPTER_PROBE_SCHEMA = 'peercompute.multiscale.ulg-dispatch-service-adapter-probe.v0';
const ULG_DISPATCH_SERVICE_IDS = Object.freeze({
  moonlab: 'moonlab-ulg-fixture',
  eshkol: 'eshkol-ulg-fixture'
});
const ULG_DISPATCH_WORKER_MODULES = Object.freeze({
  moonlab: new URL('./compute/ulgMoonLabDispatchServiceHost.js', import.meta.url).href,
  eshkol: new URL('./compute/ulgEshkolDispatchServiceHost.js', import.meta.url).href
});
const ULG_DISPATCH_CHILD_WORKER_MODULES = Object.freeze({
  moonlab: ULG_DISPATCH_WORKER_MODULES.moonlab,
  eshkol: ULG_DISPATCH_WORKER_MODULES.eshkol
});
import {
  resolvePeerComputeWorkerBootstrapUrl
} from './compute/peercomputeLadderRuntime.js';
import { ScaleComputeOrchestrator } from './compute/scaleComputeOrchestrator.js';
import {
  createMultiscaleComputeBudget,
  createAdmittedMultiscaleSolverBudget,
  createMultiscaleSolverBudget,
  readComputeOverrides
} from './compute/adaptiveComputeBudget.js';
import {
  MULTISCALE_SOLVER_DESCRIPTORS_SCHEMA,
  createMultiscaleSolverDescriptors
} from './compute/solverWorkerDescriptors.js';
import {
  AdaptiveSolverGovernor,
  MULTISCALE_SOLVER_ACTIVE_LAYER_POLICY,
  SOLVER_LAYER_AFFINITY
} from './compute/solverRuntimeGovernor.js';
import {
  MULTISCALE_LOWER_SCALE_REFINEMENT_POLICY,
  createLowerScaleRefinementScheduler,
  shouldRunLowerScaleRefinementSolver
} from './compute/lowerScaleRefinementScheduler.js';
import {
  createSolverSubmissionBudget,
  shouldSubmitSolver
} from './compute/solverSubmissionBudget.js';
import {
  MULTISCALE_READBACK_BUDGET_SCHEMA,
  createMultiscaleReadbackBudget
} from './compute/readbackBudget.js';
import {
  MULTISCALE_STATE_PUBLICATION_BUDGET_SCHEMA,
  createStatePublicationBudget
} from './compute/statePublicationBudget.js';
import {
  MULTISCALE_RUNTIME_DIAGNOSTICS_BUDGET_SCHEMA,
  createRuntimeDiagnosticsBudget
} from './compute/runtimeDiagnosticsBudget.js';
import {
  AdaptiveRuntimeScaler,
  createMemoryPressureReport,
  createNetworkCapacityReport,
  createSolverAdmissionReport,
  createSolverLoadReport
} from './compute/adaptiveRuntimeScaler.js';
import {
  createPlacementPlan,
  createRemotePlacementReadiness,
  summarizePlacementPlan,
  summarizeRemotePlacementReadiness
} from './compute/placementPlan.js';
import {
  createRemoteSolverPlacementDecisionReport,
  createRemoteSolverPlacementPolicy,
  promoteSolverPlacementHint,
  readRemoteSolverPlacementOverrides,
  summarizeRemoteSolverPlacementDecisions,
  summarizeRemoteSolverPlacementPolicy
} from './compute/remoteSolverPlacement.js';
import {
  MULTISCALE_LOOPBACK_REMOTE_PLACEMENT_SCHEMA,
  createLoopbackRemotePlacementExecutor,
  isLoopbackRemotePlacementConfig
} from './compute/loopbackRemotePlacement.js';
import {
  createRemotePeerPlacementPlan,
  createRemotePeerSelectionReport
} from './compute/remotePeerSelection.js';
import {
  MULTISCALE_REMOTE_PEER_RELIABILITY_SCHEMA,
  createRemotePeerReliabilityScope,
  createRemotePeerReliabilityStorageKey,
  createRemotePeerReliabilityReport,
  createRemotePlacementObservationKey,
  getRemotePeerReliability,
  loadRemotePeerReliabilityReportFromStorage,
  saveRemotePeerReliabilityReportToStorage,
  updateRemotePeerReliabilityFromPlacement
} from './compute/remotePeerReliability.js';
import {
  SOLVER_STATE_REMAP_SCHEMA,
  carrySolverTimeline,
  copyRecordFields,
  remapGridFields,
  summarizeSolverInvariants,
  summarizeSolverRemap
} from './compute/solverStateRemap.js';
import {
  makeNBodyInitialState
} from './compute/nbodyGravityTasks.js';
import {
  makeReactiveThermalInitialState
} from './compute/reactiveThermalTasks.js';
import {
  makeMaxwellInitialState
} from './compute/maxwellTasks.js';
import {
  makeCosmologyExpansionInitialState
} from './compute/cosmologyExpansionTasks.js';
import {
  SUPPORTED_MOLECULAR_ELEMENTS,
  appendMolecularAtomsToState,
  makeMolecularDynamicsInitialState
} from './compute/molecularDynamicsTasks.js';
import {
  QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
  QUANTUM_ORBITAL_GRID_RESULT_SCHEMA
} from './compute/quantumOrbitalGridTasks.js';
import {
  QUANTUM_MATERIAL_POTENTIAL_RESULT_SCHEMA
} from './compute/quantumMaterialPotentialTasks.js';
import {
  ELEMENTS as QUANTUM_ELEMENTS
} from '../../schrodinger/src/data/elements.js';
import {
  makeSphMaterialInitialState
} from './compute/sphMaterialTasks.js';
import {
  makeHydroAtmosphereInitialState
} from './compute/hydroAtmosphereTasks.js';
import {
  makeRadiationOpacityInitialState
} from './compute/radiationOpacityTasks.js';
import {
  makeStellarFusionInitialState
} from './compute/stellarFusionTasks.js';
import {
  makeMagnetospherePlasmaInitialState
} from './compute/magnetospherePlasmaTasks.js';
import {
  makePicPlasmaPatchInitialState
} from './compute/picPlasmaPatchTasks.js';
import {
  makeRelativisticCorrectionInitialState
} from './compute/relativisticCorrectionTasks.js';
import {
  makeCombustionPlumeInitialState
} from './compute/combustionPlumeTasks.js';
import {
  makeMembraneShellInitialState
} from './compute/membraneShellTasks.js';
import {
  MULTISCALE_NODE_KERNEL_STATUS_SCHEMA,
  loadRelayConfig,
  normalizeBootstrapPeers,
  readPeerNetworkOverrides
} from './peercompute/relayConfig.js';

const NO_FATAL_TRANSPORT_MANAGER = { faultTolerance: 'no-fatal' };
const COMPUTE_DELTA_SCOPE = 'multiscale-compute';
const SOLVER_DELTA_SCOPE = 'multiscale-solver-deltas';
const CLOSURE_DELTA_SCOPE = 'multiscale-closures';
const CONSERVATION_DELTA_SCOPE = 'multiscale-conservation';
const COUPLING_DELTA_SCOPE = 'multiscale-couplings';
const LAW_GRAPH_DELTA_SCOPE = 'multiscale-law-graph';
const ULG_RUNTIME_DELTA_SCOPE = 'multiscale-ulg-runtime';
const ULG_RUNTIME_EXECUTION_DELTA_SCOPE = 'multiscale-ulg-runtime-execution';
const SOURCE_SINK_BALANCE_DELTA_SCOPE = 'multiscale-source-sink-balances';
const SOURCE_TRANSFER_DELTA_SCOPE = 'multiscale-source-transfers';
const SOURCE_TRANSFER_APPLICATION_DELTA_SCOPE = 'multiscale-source-transfer-applications';
const SOURCE_TRANSFER_TRANSACTION_DELTA_SCOPE = 'multiscale-source-transfer-transactions';
const SOURCE_TRANSFER_TARGET_PREVIEW_DELTA_SCOPE = 'multiscale-source-transfer-target-previews';
const SOURCE_TRANSFER_TARGET_MUTATOR_REGISTRY_DELTA_SCOPE = 'multiscale-source-transfer-target-mutators';
const SOURCE_TRANSFER_TARGET_MUTATION_PREFLIGHT_DELTA_SCOPE = 'multiscale-source-transfer-target-preflights';
const SOURCE_TRANSFER_TARGET_MUTATION_OPERATION_PLAN_DELTA_SCOPE = 'multiscale-source-transfer-target-operation-plans';
const SOURCE_TRANSFER_TARGET_MUTATION_INVARIANT_CHECK_DELTA_SCOPE = 'multiscale-source-transfer-target-invariant-checks';
const SOURCE_TRANSFER_TARGET_MUTATION_COMMIT_DELTA_SCOPE = 'multiscale-source-transfer-target-commits';
const SOURCE_TRANSFER_TARGET_MUTATION_DISPATCH_DELTA_SCOPE = 'multiscale-source-transfer-target-dispatches';
const SOURCE_TRANSFER_TARGET_MUTATION_APPLY_VALIDATION_DELTA_SCOPE = 'multiscale-source-transfer-target-apply-validations';
const SOURCE_TRANSFER_TARGET_MUTATION_APPLY_EXECUTION_DELTA_SCOPE = 'multiscale-source-transfer-target-apply-executions';
const SOURCE_TRANSFER_TARGET_SOURCE_INTAKE_DELTA_SCOPE = 'multiscale-source-transfer-target-source-intakes';
const SOURCE_TRANSFER_TARGET_SOURCE_RESPONSE_DELTA_SCOPE = 'multiscale-source-transfer-target-source-responses';
const SOURCE_TRANSFER_TARGET_SOURCE_RECONCILIATION_DELTA_SCOPE = 'multiscale-source-transfer-target-source-reconciliations';
const CONSERVATIVE_SOURCE_BUFFER_DELTA_SCOPE = 'multiscale-conservative-source-buffers';
const SOURCE_BUFFER_APPLICATION_DELTA_SCOPE = 'multiscale-source-buffer-applications';
const SOURCE_BUFFER_ACCEPTANCE_DELTA_SCOPE = 'multiscale-source-buffer-acceptances';
const SOURCE_BUFFER_WRITEBACK_VALIDATION_DELTA_SCOPE = 'multiscale-source-buffer-writeback-validations';
const TARGET_BUFFER_REPLAY_VALIDATION_DELTA_SCOPE = 'multiscale-target-buffer-replay-validations';
const TARGET_BUFFER_MUTATION_AUDIT_DELTA_SCOPE = 'multiscale-target-buffer-mutation-audits';
const TARGET_BUFFER_WORKER_WRITE_QUEUE_DELTA_SCOPE = 'multiscale-target-buffer-worker-write-queues';
const TARGET_BUFFER_WORKER_WRITE_EXECUTION_DELTA_SCOPE = 'multiscale-target-buffer-worker-write-executions';
const TARGET_BUFFER_WORKER_WRITE_VERIFICATION_DELTA_SCOPE = 'multiscale-target-buffer-worker-write-verifications';
const SCIENTIFIC_INVARIANT_GATE_DELTA_SCOPE = 'multiscale-scientific-invariant-gates';
const SCIENTIFIC_READINESS_MANIFEST_DELTA_SCOPE = 'multiscale-scientific-readiness-manifests';
const RUNTIME_DEBUG_SCHEMA = 'peercompute.multiscale.runtime-debug.v0';
const COMPUTE_CAPACITY_RESIZE_SCHEMA = 'peercompute.multiscale.compute-capacity-resize.v0';
const MULTISCALE_REMOTE_SOLVER_PLACEMENT_PROBE_SCHEMA = 'peercompute.multiscale.remote-solver-placement-probe.v0';
const NETVIZ_DEBUG_CHANNEL = 'peercompute-netviz-debug-v1';
const NETVIZ_SESSION_SCHEMA = 'peercompute.multiscale.netviz-session.v0';
const NETVIZ_SESSION_BROADCAST_MS = 2000;
const READOUT_CADENCE_SCHEMA = 'peercompute.multiscale.readout-cadence.v0';
const FRAME_PHASE_TIMING_SCHEMA = 'peercompute.multiscale.frame-phase-timing.v0';
const FRAME_PHASE_TIMING_ALPHA = 0.08;
const READOUT_RENDER_INTERVAL_MS = 250;
const RUNTIME_DEBUG_RENDER_INTERVAL_MS = 1000;
const FRAME_READBACK_BUDGET_INTERVAL_FRAMES = 12;
const PACKET_PREVIEW_SCHEMA = 'peercompute.multiscale.packet-preview.v0';
const NETVIZ_SESSION_ID = `multiscale-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const N_BODY_SOLVER_ID = 'nbody-gravity';
const N_BODY_STATE_KEY = 'solar:nbody:reference';
const N_BODY_TASK_ID = 'solver:nbody-gravity:solar-reference';
const REACTIVE_SOLVER_ID = 'reactive-thermal-cell';
const REACTIVE_STATE_KEY = 'surface:reactive-thermal:campfire';
const REACTIVE_TASK_ID = 'solver:reactive-thermal:campfire';
const MAXWELL_SOLVER_ID = 'maxwell-em';
const MAXWELL_STATE_KEY = 'galactic:maxwell:field-tile';
const MAXWELL_TASK_ID = 'solver:maxwell:galactic-field-tile';
const COSMOLOGY_EXPANSION_SOLVER_ID = 'cosmology-expansion';
const COSMOLOGY_EXPANSION_STATE_KEY = 'supergalactic:cosmology-expansion:web-tile';
const COSMOLOGY_EXPANSION_TASK_ID = 'solver:cosmology-expansion:web-tile';
const MOLECULAR_DYNAMICS_SOLVER_ID = 'molecular-dynamics';
const MOLECULAR_DYNAMICS_STATE_KEY = 'molecular:molecular-dynamics:patch';
const MOLECULAR_DYNAMICS_TASK_ID = 'solver:molecular-dynamics:patch';
const QUANTUM_ORBITAL_GRID_SOLVER_ID = 'quantum-orbital-grid';
const QUANTUM_ORBITAL_GRID_STATE_KEY = 'orbital:quantum-orbital-grid:active';
const QUANTUM_ORBITAL_GRID_TASK_ID = 'solver:quantum-orbital-grid:active';
const QUANTUM_MATERIAL_POTENTIAL_SOLVER_ID = 'quantum-material-potential';
const QUANTUM_MATERIAL_POTENTIAL_STATE_KEY = 'orbital:quantum-material-potential:active';
const QUANTUM_MATERIAL_POTENTIAL_TASK_ID = 'solver:quantum-material-potential:active';
const ULG_RUNTIME_SOLVER_ID = 'ulg-runtime';
const ULG_RUNTIME_STATE_KEY = 'ulg:runtime:active-pass-dag';
const ULG_RUNTIME_TASK_ID = 'solver:ulg-runtime:active-pass-dag';
const SPH_MATERIAL_SOLVER_ID = 'sph-material';
const SPH_MATERIAL_STATE_KEY = 'surface:sph-material:water-balloon';
const SPH_MATERIAL_TASK_ID = 'solver:sph-material:water-balloon';
const HYDRO_ATMOSPHERE_SOLVER_ID = 'hydro-atmosphere';
const HYDRO_ATMOSPHERE_STATE_KEY = 'planet:hydro-atmosphere:weather-tile';
const HYDRO_ATMOSPHERE_TASK_ID = 'solver:hydro-atmosphere:weather-tile';
const RADIATION_OPACITY_SOLVER_ID = 'radiation-opacity';
const RADIATION_OPACITY_STATE_KEY = 'surface:radiation-opacity:heat-tile';
const RADIATION_OPACITY_TASK_ID = 'solver:radiation-opacity:heat-tile';
const STELLAR_FUSION_SOLVER_ID = 'stellar-fusion';
const STELLAR_FUSION_STATE_KEY = 'solar:stellar-fusion:core-tile';
const STELLAR_FUSION_TASK_ID = 'solver:stellar-fusion:core-tile';
const MAGNETOSPHERE_PLASMA_SOLVER_ID = 'magnetosphere-plasma';
const MAGNETOSPHERE_PLASMA_STATE_KEY = 'solar:magnetosphere-plasma:mhd-tile';
const MAGNETOSPHERE_PLASMA_TASK_ID = 'solver:magnetosphere-plasma:mhd-tile';
const PIC_PLASMA_PATCH_SOLVER_ID = 'pic-plasma-patch';
const PIC_PLASMA_PATCH_STATE_KEY = 'solar:pic-plasma-patch:reconnection-patch';
const PIC_PLASMA_PATCH_TASK_ID = 'solver:pic-plasma-patch:reconnection-patch';
const RELATIVISTIC_CORRECTION_SOLVER_ID = 'relativistic-correction';
const RELATIVISTIC_CORRECTION_STATE_KEY = 'solar:relativistic-correction:orbital-shell';
const RELATIVISTIC_CORRECTION_TASK_ID = 'solver:relativistic-correction:orbital-shell';
const COMBUSTION_PLUME_SOLVER_ID = 'combustion-plume';
const COMBUSTION_PLUME_STATE_KEY = 'surface:combustion-plume:campfire';
const COMBUSTION_PLUME_TASK_ID = 'solver:combustion-plume:campfire';
const MEMBRANE_SHELL_SOLVER_ID = 'membrane-shell';
const MEMBRANE_SHELL_STATE_KEY = 'surface:membrane-shell:water-balloon';
const MEMBRANE_SHELL_TASK_ID = 'solver:membrane-shell:water-balloon';
const SCALABLE_SOLVER_KEYS = [
  'nbody',
  'maxwell',
  'cosmologyExpansion',
  'molecularDynamics',
  'quantumMaterialPotential',
  'sphMaterial',
  'hydroAtmosphere',
  'radiationOpacity',
  'stellarFusion',
  'magnetospherePlasma',
  'picPlasmaPatch',
  'relativisticCorrection',
  'combustionPlume',
  'membraneShell'
];
const NON_SCALABLE_SOLVER_KEYS = ['reactiveThermal', 'quantumOrbitalGrid'];
const computeOverrides = readComputeOverrides();
const initialSearch = globalThis.location?.search || '';
const peerNetworkInitialOverrides = readPeerNetworkOverrides(initialSearch);
const remoteSolverPlacementInitialOverrides = readRemoteSolverPlacementOverrides(initialSearch);

const model = new MultiscaleModel({ seed: 20260529 });
const initialQuantumOrbital = readInitialQuantumOrbital(initialSearch);
if (initialQuantumOrbital) model.setQuantumOrbital(initialQuantumOrbital);
const canvas = document.querySelector('#multiscale-canvas');
const scene = new MultiscaleScene({ canvas, model });
const computeManager = new ComputeManager({
  enableWebGPU: true,
  enableWorkers: true,
  autoScaleWorkers: computeOverrides.autoScaleWorkers ?? true,
  idleScaleDownMs: 8000,
  resourceProfile: {
    tier: computeOverrides.tier,
    cpuCores: computeOverrides.cpuCores,
    deviceMemoryGB: computeOverrides.deviceMemoryGB,
    memoryBudgetMB: computeOverrides.memoryBudgetMB,
    gpuMemoryBudgetMB: computeOverrides.gpuMemoryBudgetMB,
    budgetScale: computeOverrides.budgetScale,
    gpuLimits: computeOverrides.gpuLimits
  },
  minWorkers: computeOverrides.minWorkers,
  targetWorkers: computeOverrides.targetWorkers,
  maxWorkers: computeOverrides.maxWorkers
});
computeManager.workerBootstrapURL = resolvePeerComputeWorkerBootstrapUrl();
for (const descriptor of createMultiscaleSolverDescriptors()) {
  computeManager.registerSolver(descriptor);
}
let computeBudget = createMultiscaleComputeBudget(computeManager, {
  layerCount: SCALE_LAYERS.length,
  overrides: computeOverrides
});
let admittedSolverBudget = createAdmittedMultiscaleSolverBudget(computeManager, {
  computeBudget,
  overrides: computeOverrides
});
let solverBudget = admittedSolverBudget.solverBudget;
let solverAdmissionReport = admittedSolverBudget.admission;
const solverGovernor = new AdaptiveSolverGovernor({
  budget: solverBudget,
  activeLayerId: model.activeLayer?.id
});
let solverGovernorStatus = solverGovernor.getStatus();
const lowerScaleRefinementScheduler = createLowerScaleRefinementScheduler({
  activeLayerId: model.activeLayer?.id
});
let lowerScaleRefinementReport = lowerScaleRefinementScheduler.getStatus();
let solverQualityMultiplier = 1;
let molecularCompositionManual = hasMolecularCompositionOverride(initialSearch);
let molecularComposition = readInitialMolecularComposition(initialSearch, solverBudget.molecularDynamics.atomCount);
if (molecularCompositionManual) {
  solverBudget = {
    ...solverBudget,
    molecularDynamics: {
      ...solverBudget.molecularDynamics,
      atomCount: countMolecularComposition(molecularComposition)
    }
  };
  solverGovernorStatus = solverGovernor.setBudget(solverBudget);
}
const runtimeScaler = new AdaptiveRuntimeScaler({
  enabled: computeOverrides.autoScaleWorkloads !== false,
  workerPolicy: computeManager.getWorkerPolicy(),
  initialQuality: solverQualityMultiplier
});
let runtimeScalerStatus = runtimeScaler.getStatus();
let memoryPressureReport = null;
let networkCapacityReport = null;
let placementPlanReport = null;
let remotePlacementReadinessReport = null;
let remotePlacementRuntimeOverrides = {};
let remotePlacementConfigurationReport = null;
let remotePeerSelectionReport = null;
let remotePeerPlacementPlan = null;
let remotePeerPlacementBalanceCounter = 0;
let peerNetworkRuntimeOverrides = { ...peerNetworkInitialOverrides };
let remotePeerReliabilityScopeId = createRemotePeerReliabilityScope({
  roomId: peerNetworkRuntimeOverrides.roomId,
  topologyId: peerNetworkRuntimeOverrides.topologyId,
  topology: peerNetworkRuntimeOverrides.topology
});
let remotePeerReliabilityStorageKey = createRemotePeerReliabilityStorageKey(remotePeerReliabilityScopeId);
const remotePeerReliabilityStorage = getRemotePeerReliabilityStorage();
const remotePeerReliabilityInitialLoad = loadRemotePeerReliabilityReportFromStorage({
  storage: remotePeerReliabilityStorage,
  storageKey: remotePeerReliabilityStorageKey,
  scopeId: remotePeerReliabilityScopeId,
  nowMs: Date.now()
});
let remotePeerReliabilityReport = remotePeerReliabilityInitialLoad.report;
let remotePeerReliabilityPersistence = remotePeerReliabilityInitialLoad.persistence;
let lastRemoteReliabilityObservationKey = null;
let remoteSolverPlacementRuntimeOverrides = {};
let remoteSolverPlacementPolicyReport = createRemoteSolverPlacementPolicy({
  ...remoteSolverPlacementInitialOverrides,
  source: remoteSolverPlacementInitialOverrides.source || 'query'
});
let remoteSolverPlacementDecisionReport = createRemoteSolverPlacementDecisionReport({
  policy: remoteSolverPlacementPolicyReport
});
let multiscaleNodeKernel = null;
let multiscaleNodeKernelStartPromise = null;
let nodeKernelRelayConfig = null;
let nodeKernelStatusReport = createNodeKernelStatusReport({
  enabled: peerNetworkRuntimeOverrides.enablePeerNetwork === true,
  state: peerNetworkRuntimeOverrides.enablePeerNetwork === true ? 'configured' : 'disabled',
  reason: peerNetworkRuntimeOverrides.enablePeerNetwork === true ? 'awaiting-start' : 'disabled-by-default'
});
let computeCapacityResizeSequence = 0;
let computeCapacityResizePromise = null;
let lastComputeCapacityResize = null;

const stateManager = new StateManager(null, {
  docName: 'peercompute-multiscale-local',
  enablePersistence: false,
  disableNetworkProvider: true,
  disableBroadcast: true,
  deltaNamespace: COMPUTE_DELTA_SCOPE
});

computeManager.setCommitDeltaHandler((delta) => {
  if (stateManager.isInitialized) {
    stateManager.commitDelta(delta);
  }
});

const compute = new ScaleComputeOrchestrator({
  layers: SCALE_LAYERS,
  seed: 20260529,
  workersPerScale: computeBudget.workersPerScale,
  totalParticleCount: computeBudget.totalParticleCount,
  computeManager,
  computeBudget,
  solverRegistry: getSolverRegistrySummary(),
  stateManager,
  deltaScope: COMPUTE_DELTA_SCOPE
});

const buttons = document.querySelector('#scale-buttons');
const slider = document.querySelector('#scale-slider');
const hud = document.querySelector('.hud');
const hudFocus = document.querySelector('#hud-focus');
const hudTelemetry = document.querySelector('#hud-telemetry');
const layerName = document.querySelector('#layer-name');
const layerReadout = document.querySelector('#layer-readout');
const packetReadout = document.querySelector('#packet-readout');
const computeStatusReadout = document.querySelector('#compute-status');
const runtimeDebugReadout = document.querySelector('#runtime-debug-readout');
const outputToggleBar = document.querySelector('#output-toggles');
const oxygen = document.querySelector('#oxygen');
const stellarFlux = document.querySelector('#stellar-flux');
const gravity = document.querySelector('#gravity');
const ambientTemperature = document.querySelector('#ambient-temperature');
const ambientPressure = document.querySelector('#ambient-pressure');
const electricField = document.querySelector('#electric-field');
const magneticField = document.querySelector('#magnetic-field');
const atomSymbol = document.querySelector('#atom-symbol');
const atomCount = document.querySelector('#atom-count');
const atomAdd = document.querySelector('#atom-add');
const atomWater = document.querySelector('#atom-water');
const atomCarbonDioxide = document.querySelector('#atom-co2');
const atomAir = document.querySelector('#atom-air');
const atomReset = document.querySelector('#atom-reset');
const moleculeRecipe = document.querySelector('#molecule-recipe');
const molecularBufferApply = document.querySelector('#molecular-buffer-apply');
const molecularBufferAuto = document.querySelector('#molecular-buffer-auto');
const molecularBufferStatus = document.querySelector('#molecular-buffer-status');
const orbitalElement = document.querySelector('#orbital-element');
const orbitalN = document.querySelector('#orbital-n');
const orbitalL = document.querySelector('#orbital-l');
const orbitalM = document.querySelector('#orbital-m');
const orbitalGrid = document.querySelector('#orbital-grid');
const orbitalApply = document.querySelector('#orbital-apply');
const orbitalStatus = document.querySelector('#orbital-status');
const autoTour = document.querySelector('#auto-tour');
const qualityDown = document.querySelector('#quality-down');
const qualityUp = document.querySelector('#quality-up');
const scenarioMagnetar = document.querySelector('#scenario-magnetar');
const scenarioAffordance = document.querySelector('#scenario-affordance');
const scenarioAffordanceTitle = document.querySelector('#scenario-affordance-title');
const scenarioAffordanceReadiness = document.querySelector('#scenario-affordance-readiness');
const scenarioAffordanceTarget = document.querySelector('#scenario-affordance-target');
const scenarioAffordanceNote = document.querySelector('#scenario-affordance-note');

const outputPanelRegistry = [
  { id: 'controls', label: 'controls', element: document.querySelector('.panel.left') },
  { id: 'runtime', label: 'runtime', element: document.querySelector('.runtime-panel') },
  { id: 'readout', label: 'readout', element: document.querySelector('.panel.right') },
  { id: 'packet', label: 'packet', element: document.querySelector('.packet') }
].filter((entry) => entry.element);
const outputPanelState = readInitialOutputPanelState(initialSearch, outputPanelRegistry);
const outputPanelButtons = new Map();

let tourEnabled = false;
let lastTourStep = 0;
const molecularBufferWriterInitial = readInitialMolecularBufferWriterRuntime(initialSearch);
let molecularBufferWriterAutoEnabled = molecularBufferWriterInitial.autoEnabled;
let molecularBufferWriterAutoIntervalFrames = molecularBufferWriterInitial.intervalFrames;
let molecularBufferWriterLastFrame = -Infinity;
let molecularBufferWriterRunCount = 0;
let molecularBufferWriterLastReport = null;
let molecularBufferWriterLastSourceApplyReport = null;
let molecularBufferWriterLastReason = 'idle';
let computeStatus = compute.getStatus();
let lastComputeStepError = null;
let nbodySolverState = makeNBodyInitialState({
  count: solverBudget.nbody.bodyCount,
  seed: 20260529,
  radius: 1.8,
  centralMass: 38,
  orbitalMass: 0.8,
  gravitationalConstant: 1
});
let nbodySolverPending = false;
let nbodySolverSubmitted = 0;
let nbodySolverCompleted = 0;
let nbodySolverFailed = 0;
let nbodySolverLastError = null;
let nbodySolverLastResult = null;
let reactiveSolverState = makeReactiveThermalInitialState({
  environment: model.environment,
  coupling: {
    fireIntensity: model.state.surface.fireIntensity,
    fuelFraction: model.state.surface.fuelFraction,
    flameTemperatureK: model.state.surface.flameTemperatureK,
    waterContact: model.state.surface.waterContact,
    steamFraction: model.state.balloon.steamMassKg
  }
});
let reactiveSolverPending = false;
let reactiveSolverSubmitted = 0;
let reactiveSolverCompleted = 0;
let reactiveSolverFailed = 0;
let reactiveSolverLastError = null;
let reactiveSolverLastResult = null;
let maxwellSolverState = makeMaxwellInitialState({
  width: solverBudget.maxwell.width,
  height: solverBudget.maxwell.height,
  seed: 20260529,
  amplitude: 0.32
});
let maxwellSolverPending = false;
let maxwellSolverSubmitted = 0;
let maxwellSolverCompleted = 0;
let maxwellSolverFailed = 0;
let maxwellSolverLastError = null;
let maxwellSolverLastResult = null;
let cosmologyExpansionSolverState = makeCosmologyExpansionInitialState({
  sampleCount: solverBudget.cosmologyExpansion.sampleCount,
  seed: 20260529,
  environment: model.environment,
  coupling: {
    galaxyTurbulence: model.state.galaxy.gasTurbulence,
    starFormationRate: model.state.galaxy.starFormationRate,
    maxwellFieldEnergy: model.state.galaxy.maxwell.fieldEnergy,
    poyntingFlux: model.state.galaxy.maxwell.poyntingFlux,
    relativisticLensing: model.state.solar.relativity.lensingDeflectionArcsecProxy,
    relativisticRedshift: model.state.solar.relativity.gravitationalRedshiftProxy,
    radiationPressure: model.state.solar.radiationPressure
  }
});
let cosmologyExpansionSolverPending = false;
let cosmologyExpansionSolverSubmitted = 0;
let cosmologyExpansionSolverCompleted = 0;
let cosmologyExpansionSolverFailed = 0;
let cosmologyExpansionSolverLastError = null;
let cosmologyExpansionSolverLastResult = null;
let molecularDynamicsSolverState = makeMolecularDynamicsInitialState({
  atomCount: solverBudget.molecularDynamics.atomCount,
  seed: 20260529,
  environment: model.environment,
  composition: molecularComposition,
  coupling: {
    fireIntensity: model.state.surface.fireIntensity,
    waterContact: model.state.surface.waterContact,
    radiativeHeatFlux: model.state.surface.radiativeHeatFlux,
    reactionProgress: model.state.molecular.reactionProgress,
    ulgRuntimeStateDelta: model.state.ulgRuntimeStateDelta
  }
});
let molecularDynamicsSolverPending = false;
let molecularDynamicsSolverSubmitted = 0;
let molecularDynamicsSolverCompleted = 0;
let molecularDynamicsSolverFailed = 0;
let molecularDynamicsSolverLastError = null;
let molecularDynamicsSolverLastResult = null;
let quantumOrbitalGridPending = false;
let quantumOrbitalGridSubmitted = 0;
let quantumOrbitalGridCompleted = 0;
let quantumOrbitalGridFailed = 0;
let quantumOrbitalGridLastError = null;
let quantumOrbitalGridLastResult = null;
let quantumOrbitalGridLastInputKey = null;
let quantumMaterialPotentialPending = false;
let quantumMaterialPotentialSubmitted = 0;
let quantumMaterialPotentialCompleted = 0;
let quantumMaterialPotentialFailed = 0;
let quantumMaterialPotentialLastError = null;
let quantumMaterialPotentialLastResult = null;
let quantumMaterialPotentialLastInputKey = null;
let ulgRuntimePending = false;
let ulgRuntimeSubmitted = 0;
let ulgRuntimeCompleted = 0;
let ulgRuntimeFailed = 0;
let ulgRuntimeLastError = null;
let ulgRuntimeLastResult = null;
let ulgRuntimeLastInputKey = null;
let sphMaterialSolverState = makeSphMaterialInitialState({
  count: solverBudget.sphMaterial.particleCount,
  seed: 20260529,
  environment: model.environment
});
let sphMaterialSolverPending = false;
let sphMaterialSolverSubmitted = 0;
let sphMaterialSolverCompleted = 0;
let sphMaterialSolverFailed = 0;
let sphMaterialSolverLastError = null;
let sphMaterialSolverLastResult = null;
let hydroAtmosphereSolverState = makeHydroAtmosphereInitialState({
  width: solverBudget.hydroAtmosphere.width,
  height: solverBudget.hydroAtmosphere.height,
  seed: 20260529,
  environment: model.environment,
  oceanHeat: model.state.planet.oceanHeat
});
let hydroAtmosphereSolverPending = false;
let hydroAtmosphereSolverSubmitted = 0;
let hydroAtmosphereSolverCompleted = 0;
let hydroAtmosphereSolverFailed = 0;
let hydroAtmosphereSolverLastError = null;
let hydroAtmosphereSolverLastResult = null;
let radiationOpacitySolverState = makeRadiationOpacityInitialState({
  width: solverBudget.radiationOpacity.width,
  height: solverBudget.radiationOpacity.height,
  seed: 20260529,
  environment: model.environment,
  coupling: {
    fireIntensity: model.state.surface.fireIntensity,
    cloudCover: model.state.planet.cloudCover,
    smokeFraction: model.state.surface.smokeFraction
  }
});
let radiationOpacitySolverPending = false;
let radiationOpacitySolverSubmitted = 0;
let radiationOpacitySolverCompleted = 0;
let radiationOpacitySolverFailed = 0;
let radiationOpacitySolverLastError = null;
let radiationOpacitySolverLastResult = null;
let stellarFusionSolverState = makeStellarFusionInitialState({
  width: solverBudget.stellarFusion.width,
  height: solverBudget.stellarFusion.height,
  seed: 20260529,
  environment: model.environment,
  coupling: {
    metallicity: model.state.galaxy.metallicity,
    radiationPressure: model.state.solar.radiationPressure,
    opacity: model.state.solar.radiationOpacity.meanOpacity
  }
});
let stellarFusionSolverPending = false;
let stellarFusionSolverSubmitted = 0;
let stellarFusionSolverCompleted = 0;
let stellarFusionSolverFailed = 0;
let stellarFusionSolverLastError = null;
let stellarFusionSolverLastResult = null;
let magnetospherePlasmaSolverState = makeMagnetospherePlasmaInitialState({
  width: solverBudget.magnetospherePlasma.width,
  height: solverBudget.magnetospherePlasma.height,
  seed: 20260529,
  environment: model.environment,
  coupling: {
    stellarLuminosityFactor: model.state.solar.stellarFusion.luminosityFactor,
    radiationPressure: model.state.solar.radiationPressure,
    maxwellFieldEnergy: model.state.galaxy.maxwell.fieldEnergy,
    poyntingFlux: model.state.galaxy.maxwell.poyntingFlux
  }
});
let magnetospherePlasmaSolverPending = false;
let magnetospherePlasmaSolverSubmitted = 0;
let magnetospherePlasmaSolverCompleted = 0;
let magnetospherePlasmaSolverFailed = 0;
let magnetospherePlasmaSolverLastError = null;
let magnetospherePlasmaSolverLastResult = null;
let picPlasmaPatchSolverState = makePicPlasmaPatchInitialState({
  particleCount: solverBudget.picPlasmaPatch.particleCount,
  gridWidth: solverBudget.picPlasmaPatch.gridWidth,
  gridHeight: solverBudget.picPlasmaPatch.gridHeight,
  seed: 20260529,
  environment: model.environment,
  coupling: {
    reconnectionRate: model.state.solar.magnetosphere.reconnectionRate,
    solarWindPressure: model.state.solar.magnetosphere.solarWindPressure,
    ionization: model.state.solar.magnetosphere.meanIonizationFraction,
    alfvenSpeed: model.state.solar.magnetosphere.alfvenSpeed,
    meanTemperatureK: model.state.solar.magnetosphere.meanTemperatureK,
    maxwellFieldEnergy: model.state.galaxy.maxwell.fieldEnergy,
    poyntingFlux: model.state.galaxy.maxwell.poyntingFlux
  }
});
let picPlasmaPatchSolverPending = false;
let picPlasmaPatchSolverSubmitted = 0;
let picPlasmaPatchSolverCompleted = 0;
let picPlasmaPatchSolverFailed = 0;
let picPlasmaPatchSolverLastError = null;
let picPlasmaPatchSolverLastResult = null;
let relativisticCorrectionSolverState = makeRelativisticCorrectionInitialState({
  sampleCount: solverBudget.relativisticCorrection.sampleCount,
  seed: 20260529,
  environment: model.environment,
  coupling: {
    stellarLuminosityFactor: model.state.solar.stellarFusion.luminosityFactor,
    radiationPressure: model.state.solar.radiationPressure,
    solarWindPressure: model.state.solar.magnetosphere.solarWindPressure,
    alfvenSpeed: model.state.solar.magnetosphere.alfvenSpeed,
    maxwellFieldEnergy: model.state.galaxy.maxwell.fieldEnergy,
    poyntingFlux: model.state.galaxy.maxwell.poyntingFlux,
    picKineticEnergy: model.state.solar.picPlasmaPatch.kineticEnergy,
    picParticleEscapeFraction: model.state.solar.picPlasmaPatch.particleEscapeFraction
  }
});
let relativisticCorrectionSolverPending = false;
let relativisticCorrectionSolverSubmitted = 0;
let relativisticCorrectionSolverCompleted = 0;
let relativisticCorrectionSolverFailed = 0;
let relativisticCorrectionSolverLastError = null;
let relativisticCorrectionSolverLastResult = null;
let combustionPlumeSolverState = makeCombustionPlumeInitialState({
  width: solverBudget.combustionPlume.width,
  height: solverBudget.combustionPlume.height,
  seed: 20260529,
  environment: model.environment,
  coupling: {
    fireIntensity: model.state.surface.fireIntensity,
    waterContact: model.state.surface.waterContact,
    radiativeHeatFlux: model.state.surface.radiativeHeatFlux
  }
});
let combustionPlumeSolverPending = false;
let combustionPlumeSolverSubmitted = 0;
let combustionPlumeSolverCompleted = 0;
let combustionPlumeSolverFailed = 0;
let combustionPlumeSolverLastError = null;
let combustionPlumeSolverLastResult = null;
let membraneShellSolverState = makeMembraneShellInitialState({
  segmentCount: solverBudget.membraneShell.segmentCount,
  seed: 20260529,
  environment: model.environment,
  coupling: {
    membraneIntegrity: model.state.balloon.membraneIntegrity,
    internalPressurePa: model.state.balloon.internalPressurePa,
    waterTemperatureK: model.state.balloon.waterTemperatureK,
    steamMassKg: model.state.balloon.steamMassKg,
    waterMassKg: model.state.balloon.waterMassKg,
    fireIntensity: model.state.surface.fireIntensity,
    flameTemperatureK: model.state.surface.flameTemperatureK,
    radiativeHeatFlux: model.state.surface.radiativeHeatFlux
  }
});
let membraneShellSolverPending = false;
let membraneShellSolverSubmitted = 0;
let membraneShellSolverCompleted = 0;
let membraneShellSolverFailed = 0;
let membraneShellSolverLastError = null;
let membraneShellSolverLastResult = null;
let solverFrame = 0;
let renderFrame = 0;
let solverRuntimeStatus = createSolverRuntimeStatus();
let solverWorkloadMultipliers = {};
let lastSolverRemapReport = {
  schema: SOLVER_STATE_REMAP_SCHEMA,
  sequence: 0,
  reason: 'initial',
  remappedAt: 0,
  retainedSolverCount: 0,
  invariantCount: 0,
  maxRelativeInvariantDelta: 0,
  maxAbsoluteInvariantDelta: 0,
  solvers: []
};
let solverLoadReport = createSolverLoadReport({
  solverRuntime: solverRuntimeStatus,
  solverBudget,
  lockedSolvers: getLockedSolverLoadKeys()
});
let solverSubmissionBudgetReport = createSolverSubmissionBudget({
  activeLayerId: model.activeLayer?.id,
  solverGovernor: solverGovernorStatus,
  runtimeScaler: runtimeScalerStatus,
  candidates: [],
  reason: 'initial'
});
let activeLayerRefreshLayerId = null;
const activeLayerRefreshSolverKeys = new Set();
const remoteSolverPlacementRefreshSolverKeys = new Set();
let hudMode = 'focus';
let renderBudgetReport = scene.getRenderBudgetStatus();
let readbackBudgetReport = createMultiscaleReadbackBudget({
  activeLayerId: model.activeLayer?.id,
  hudMode,
  runtimeScaler: runtimeScalerStatus,
  renderBudget: renderBudgetReport,
  computeStatus,
  reason: 'initial'
});
let appliedReadbackInterval = null;
let lastFrameReadbackBudgetRefreshFrame = -Infinity;
let statePublicationPublishCount = 0;
let statePublicationSkippedFrameCount = 0;
let statePublicationLastPublishedFrame = -1;
let statePublicationLastDurationMs = 0;
let statePublicationBudgetReport = createStatePublicationBudget({
  frame: 0,
  hudMode,
  runtimeScaler: runtimeScalerStatus,
  renderBudget: renderBudgetReport,
  solverSubmissionBudget: solverSubmissionBudgetReport,
  managerStats: computeStatus.peercompute?.managerCapabilities?.stats || null,
  lastPublishedFrame: statePublicationLastPublishedFrame,
  publishCount: statePublicationPublishCount,
  skippedFrameCount: statePublicationSkippedFrameCount,
  reason: 'initial'
});
let lastReadoutRenderMs = -Infinity;
let readoutRenderCount = 0;
let lastRuntimeDebugRenderMs = -Infinity;
let runtimeDebugRenderCount = 0;
let lastRuntimeDebugSnapshot = null;
let runtimeDebugSnapshotBuildCount = 0;
let runtimeDebugSnapshotReuseCount = 0;
let runtimeDebugSnapshotLastFrame = -1;
let runtimeDebugSnapshotLastMs = -Infinity;
let runtimeDebugSnapshotLastDurationMs = 0;
let runtimeDiagnosticsBudgetReport = createRuntimeDiagnosticsBudget({
  frame: 0,
  hudMode,
  runtimeScaler: runtimeScalerStatus,
  renderBudget: renderBudgetReport,
  statePublicationBudget: statePublicationBudgetReport,
  managerStats: computeStatus.peercompute?.managerCapabilities?.stats || null,
  lastSnapshotFrame: runtimeDebugSnapshotLastFrame,
  lastSnapshotAtMs: runtimeDebugSnapshotLastMs,
  snapshotBuildCount: runtimeDebugSnapshotBuildCount,
  snapshotReuseCount: runtimeDebugSnapshotReuseCount,
  lastDurationMs: runtimeDebugSnapshotLastDurationMs,
  reason: 'initial'
});
let framePhaseTimingReport = createFramePhaseTimingReport({
  frame: 0,
  totalMs: 0,
  phases: {},
  reason: 'initial'
});
let lastLayerReadoutRowCount = 0;
let lastLayerReadoutTotalRowCount = 0;
let netVizSessionChannel = null;
let netVizSessionTimer = null;

function createScaleButtons() {
  slider.max = String(SCALE_LAYERS.length - 1);
  const fragment = document.createDocumentFragment();
  SCALE_LAYERS.forEach((layer, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${String(index + 1).padStart(2, '0')} ${layer.id}`;
    button.dataset.layerId = layer.id;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => setLayer(index));
    fragment.append(button);
  });
  buttons.replaceChildren(fragment);
}

function initializeMolecularControls() {
  if (!atomSymbol) return;
  const fragment = document.createDocumentFragment();
  for (const element of SUPPORTED_MOLECULAR_ELEMENTS) {
    const option = document.createElement('option');
    option.value = element.symbol;
    option.textContent = `${element.symbol} Z${element.atomicNumber}`;
    fragment.append(option);
  }
  atomSymbol.replaceChildren(fragment);
  atomSymbol.value = 'H';
  updateMolecularControls();
}

function initializeQuantumOrbitalControls() {
  if (!orbitalElement) return;
  const fragment = document.createDocumentFragment();
  for (const element of QUANTUM_ELEMENTS) {
    const option = document.createElement('option');
    option.value = element.symbol;
    option.textContent = `${element.symbol} Z${element.Z}`;
    fragment.append(option);
  }
  orbitalElement.replaceChildren(fragment);
  updateQuantumOrbitalControls();
}

function readInitialMolecularBufferWriterRuntime(search = '') {
  const defaults = {
    autoEnabled: false,
    intervalFrames: 180
  };
  try {
    const params = new URLSearchParams(search || '');
    const autoValue = String(
      params.get('molecularBufferAuto')
        || params.get('bufferAuto')
        || params.get('autoBufferWrite')
        || ''
    ).trim().toLowerCase();
    const intervalFrames = Number(
      params.get('molecularBufferAutoFrames')
        || params.get('bufferAutoFrames')
        || params.get('autoBufferFrames')
    );
    return {
      autoEnabled: ['1', 'true', 'yes', 'on', 'auto'].includes(autoValue),
      intervalFrames: Number.isFinite(intervalFrames)
        ? Math.min(1800, Math.max(30, Math.floor(intervalFrames)))
        : defaults.intervalFrames
    };
  } catch (_) {
    return defaults;
  }
}

function readInitialOutputPanelState(search = '', registry = outputPanelRegistry) {
  const state = Object.fromEntries(registry.map((entry) => [entry.id, true]));
  try {
    const params = new URLSearchParams(search || '');
    const visibleParam = params.get('outputPanels') || params.get('outputs') || '';
    const hiddenParam = params.get('hideOutputs') || params.get('hiddenOutputs') || '';
    const preset = String(params.get('mobileOutputs') || params.get('outputPreset') || '').trim().toLowerCase();
    const ids = new Set(registry.map((entry) => entry.id));
    const splitIds = (value) => String(value || '')
      .split(',')
      .map((part) => part.trim().toLowerCase())
      .filter((part) => ids.has(part));
    if (preset === 'focus' || preset === 'minimal') {
      for (const entry of registry) {
        state[entry.id] = entry.id === 'controls' || entry.id === 'readout';
      }
    }
    const visibleIds = splitIds(visibleParam);
    if (visibleIds.length > 0 && !['all', '*'].includes(String(visibleParam).trim().toLowerCase())) {
      for (const entry of registry) state[entry.id] = false;
      for (const id of visibleIds) state[id] = true;
    }
    for (const id of splitIds(hiddenParam)) {
      state[id] = false;
    }
  } catch (_) {
    // Keep all output panels visible if URL parsing is unavailable.
  }
  return state;
}

function getOutputPanelVisibility() {
  return outputPanelRegistry.map((entry) => ({
    id: entry.id,
    label: entry.label,
    visible: outputPanelState[entry.id] !== false
  }));
}

function applyOutputPanelVisibility(id, visible = true) {
  const entry = outputPanelRegistry.find((candidate) => candidate.id === id);
  if (!entry) {
    return {
      ok: false,
      reason: 'unknown-output-panel',
      id,
      panels: getOutputPanelVisibility()
    };
  }
  const normalizedVisible = visible !== false;
  outputPanelState[entry.id] = normalizedVisible;
  entry.element.classList.toggle('output-collapsed', !normalizedVisible);
  entry.element.setAttribute('aria-hidden', String(!normalizedVisible));
  const button = outputPanelButtons.get(entry.id);
  button?.classList.toggle('active', normalizedVisible);
  button?.setAttribute('aria-pressed', String(normalizedVisible));
  return {
    ok: true,
    id: entry.id,
    visible: normalizedVisible,
    panels: getOutputPanelVisibility()
  };
}

function toggleOutputPanelVisibility(id) {
  const current = outputPanelState[id] !== false;
  return applyOutputPanelVisibility(id, !current);
}

function applyOutputPanelsVisibilityState(nextVisibility = true) {
  const nextState = typeof nextVisibility === 'object' && nextVisibility
    ? nextVisibility
    : Object.fromEntries(outputPanelRegistry.map((entry) => [entry.id, nextVisibility !== false]));
  const results = outputPanelRegistry.map((entry) => applyOutputPanelVisibility(
    entry.id,
    Object.prototype.hasOwnProperty.call(nextState, entry.id)
      ? nextState[entry.id] !== false
      : outputPanelState[entry.id] !== false
  ));
  return {
    ok: results.every((result) => result.ok),
    panels: getOutputPanelVisibility()
  };
}

function initializeOutputPanelToggles() {
  if (!outputToggleBar) return;
  const fragment = document.createDocumentFragment();
  outputPanelButtons.clear();
  for (const entry of outputPanelRegistry) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = entry.label;
    button.dataset.outputToggle = entry.id;
    button.classList.toggle('active', outputPanelState[entry.id] !== false);
    button.setAttribute('aria-pressed', String(outputPanelState[entry.id] !== false));
    button.addEventListener('click', () => toggleOutputPanelVisibility(entry.id));
    outputPanelButtons.set(entry.id, button);
    fragment.append(button);
    applyOutputPanelVisibility(entry.id, outputPanelState[entry.id] !== false);
  }
  outputToggleBar.replaceChildren(fragment);
}

function readInitialHudMode(search = '') {
  try {
    const params = new URLSearchParams(search || '');
    const value = String(params.get('hud') || params.get('hudMode') || '').trim().toLowerCase();
    if (['telemetry', 'full', 'debug'].includes(value)) return 'telemetry';
  } catch (_) {
    // Keep the focus default when URL parsing is unavailable.
  }
  return 'focus';
}

function applyHudMode(mode = 'focus') {
  const normalized = ['telemetry', 'full', 'debug'].includes(String(mode || '').trim().toLowerCase())
    ? 'telemetry'
    : 'focus';
  hudMode = normalized;
  refreshRenderBudget({ reason: 'hud-mode' });
  if (hud) {
    hud.dataset.mode = normalized;
  }
  hudFocus?.classList.toggle('active', normalized === 'focus');
  hudTelemetry?.classList.toggle('active', normalized === 'telemetry');
  hudFocus?.setAttribute('aria-pressed', String(normalized === 'focus'));
  hudTelemetry?.setAttribute('aria-pressed', String(normalized === 'telemetry'));
  refreshStatePublicationBudget({ reason: 'hud-mode' });
  return {
    mode: hudMode,
    packetPreviewSchema: PACKET_PREVIEW_SCHEMA,
    runtimeDebugThrottleMs: RUNTIME_DEBUG_RENDER_INTERVAL_MS,
    layerReadoutRowCount: lastLayerReadoutRowCount,
    layerReadoutTotalRowCount: lastLayerReadoutTotalRowCount,
    outputPanels: getOutputPanelVisibility()
  };
}

function refreshRenderBudget({ reason = 'runtime' } = {}) {
  renderBudgetReport = scene.setRenderBudget({
    activeLayerId: model.activeLayer?.id || null,
    hudMode,
    runtimeScaler: runtimeScalerStatus,
    frame: renderFrame,
    reason
  });
  return renderBudgetReport;
}

function applyReadbackIntervalIfChanged(report = readbackBudgetReport, reason = 'runtime') {
  const next = Math.max(1, Math.floor(Number(report?.readbackInterval) || 0));
  if (!Number.isFinite(next) || next < 1) return false;
  if (next === appliedReadbackInterval) return false;
  compute.setReadbackInterval?.(next, reason);
  appliedReadbackInterval = next;
  return true;
}

function refreshReadbackBudget({ reason = 'runtime' } = {}) {
  readbackBudgetReport = createMultiscaleReadbackBudget({
    activeLayerId: model.activeLayer?.id || null,
    hudMode,
    runtimeScaler: runtimeScalerStatus,
    renderBudget: renderBudgetReport || refreshRenderBudget({ reason: 'readback-budget' }),
    computeStatus,
    previousReadbackInterval: readbackBudgetReport?.readbackInterval ?? computeStatus?.readbackInterval,
    reason
  });
  applyReadbackIntervalIfChanged(readbackBudgetReport, reason);
  if (Number.isFinite(renderFrame)) {
    lastFrameReadbackBudgetRefreshFrame = renderFrame;
  }
  return readbackBudgetReport;
}

function refreshStatePublicationBudget({ reason = 'runtime', force = false } = {}) {
  statePublicationBudgetReport = createStatePublicationBudget({
    frame: renderFrame,
    hudMode,
    runtimeScaler: runtimeScalerStatus,
    renderBudget: renderBudgetReport || refreshRenderBudget({ reason: 'state-publication-budget' }),
    solverSubmissionBudget: solverSubmissionBudgetReport,
    managerStats: computeStatus.peercompute?.managerCapabilities?.stats || computeManager.getStats?.() || null,
    lastPublishedFrame: statePublicationLastPublishedFrame,
    publishCount: statePublicationPublishCount,
    skippedFrameCount: statePublicationSkippedFrameCount,
    lastDurationMs: statePublicationLastDurationMs,
    force,
    reason
  });
  return statePublicationBudgetReport;
}

function refreshRuntimeDiagnosticsBudget({ reason = 'runtime', force = false, nowMs = getClockMs() } = {}) {
  runtimeDiagnosticsBudgetReport = createRuntimeDiagnosticsBudget({
    frame: renderFrame,
    nowMs,
    hudMode,
    runtimeScaler: runtimeScalerStatus,
    renderBudget: renderBudgetReport || refreshRenderBudget({ reason: 'runtime-diagnostics-budget' }),
    statePublicationBudget: statePublicationBudgetReport || refreshStatePublicationBudget({ reason: 'runtime-diagnostics-budget' }),
    managerStats: computeStatus.peercompute?.managerCapabilities?.stats || computeManager.getStats?.() || null,
    lastSnapshotFrame: runtimeDebugSnapshotLastFrame,
    lastSnapshotAtMs: runtimeDebugSnapshotLastMs,
    snapshotBuildCount: runtimeDebugSnapshotBuildCount,
    snapshotReuseCount: runtimeDebugSnapshotReuseCount,
    lastDurationMs: runtimeDebugSnapshotLastDurationMs,
    force,
    reason
  });
  return runtimeDiagnosticsBudgetReport;
}

function addAtomsToMolecularComposition(symbol, count) {
  if (molecularDynamicsSolverPending) {
    return {
      ok: false,
      reason: 'molecular-solver-pending',
      composition: { ...molecularComposition }
    };
  }
  const normalizedSymbol = normalizeElementSymbol(symbol, 'H');
  const normalizedCount = normalizePositiveInteger(count, 1, 1, 512);
  molecularComposition = normalizeCompositionObject({
    ...molecularComposition,
    [normalizedSymbol]: (molecularComposition[normalizedSymbol] || 0) + normalizedCount
  });
  molecularCompositionManual = true;
  const atomTotal = countMolecularComposition(molecularComposition);
  solverBudget = {
    ...solverBudget,
    molecularDynamics: {
      ...solverBudget.molecularDynamics,
      atomCount: atomTotal
    }
  };
  solverGovernorStatus = solverGovernor.setBudget(solverBudget);
  molecularDynamicsSolverState = appendMolecularAtomsToState(molecularDynamicsSolverState, {
    composition: { [normalizedSymbol]: normalizedCount },
    seed: 20260529 + atomTotal + molecularDynamicsSolverSubmitted,
    environment: model.environment,
    coupling: {
      fireIntensity: model.state.surface.fireIntensity,
      waterContact: model.state.surface.waterContact,
      radiativeHeatFlux: model.state.surface.radiativeHeatFlux,
      reactionProgress: model.state.molecular.reactionProgress,
      ulgRuntimeStateDelta: model.state.ulgRuntimeStateDelta
    }
  });
  molecularDynamicsSolverSubmitted = 0;
  molecularDynamicsSolverCompleted = 0;
  molecularDynamicsSolverFailed = 0;
  molecularDynamicsSolverLastError = null;
  molecularDynamicsSolverLastResult = null;
  scene.setMolecularDynamicsOverlayWaiting?.(`append ${normalizedCount} ${normalizedSymbol}`);
  updateMolecularControls();
  updateSolverRuntimeStatus();
  renderReadout();
  return {
    ok: true,
    reason: `append-${normalizedSymbol}`,
    atomCount: atomTotal,
    added: { [normalizedSymbol]: normalizedCount },
    composition: { ...molecularComposition },
    solverBudget: cloneJson(solverBudget.molecularDynamics)
  };
}

function setLayer(index) {
  const layer = model.setLayerIndex(index);
  slider.value = String(model.layerIndex);
  scene.setLayer(model.layerIndex);
  solverGovernorStatus = solverGovernor.setActiveLayer(layer.id, solverFrame);
  refreshRenderBudget({ reason: 'layer-change' });
  refreshReadbackBudget({ reason: 'layer-change' });
  if (nbodySolverLastResult) {
    scene.applyNBodySolverState({
      ...nbodySolverLastResult,
      state: nbodySolverState
    });
  }
  if (maxwellSolverLastResult) {
    scene.applyMaxwellFieldState({
      ...maxwellSolverLastResult,
      state: maxwellSolverState
    });
  }
  if (cosmologyExpansionSolverLastResult) {
    scene.applyCosmologyExpansionState({
      ...cosmologyExpansionSolverLastResult,
      state: cosmologyExpansionSolverState
    });
  }
  if (molecularDynamicsSolverLastResult) {
    scene.applyMolecularDynamicsState({
      ...molecularDynamicsSolverLastResult,
      state: molecularDynamicsSolverState
    });
  }
  if (sphMaterialSolverLastResult) {
    scene.applySphMaterialState({
      ...sphMaterialSolverLastResult,
      state: sphMaterialSolverState
    });
  }
  if (hydroAtmosphereSolverLastResult) {
    scene.applyHydroAtmosphereState({
      ...hydroAtmosphereSolverLastResult,
      state: hydroAtmosphereSolverState
    });
  }
  if (radiationOpacitySolverLastResult) {
    scene.applyRadiationOpacityState({
      ...radiationOpacitySolverLastResult,
      state: radiationOpacitySolverState
    });
  }
  if (stellarFusionSolverLastResult) {
    scene.applyStellarFusionState({
      ...stellarFusionSolverLastResult,
      state: stellarFusionSolverState
    });
  }
  if (magnetospherePlasmaSolverLastResult) {
    scene.applyMagnetospherePlasmaState({
      ...magnetospherePlasmaSolverLastResult,
      state: magnetospherePlasmaSolverState
    });
  }
  if (picPlasmaPatchSolverLastResult) {
    scene.applyPicPlasmaPatchState({
      ...picPlasmaPatchSolverLastResult,
      state: picPlasmaPatchSolverState
    });
  }
  if (relativisticCorrectionSolverLastResult) {
    scene.applyRelativisticCorrectionState({
      ...relativisticCorrectionSolverLastResult,
      state: relativisticCorrectionSolverState
    });
  }
  if (combustionPlumeSolverLastResult) {
    scene.applyCombustionPlumeState({
      ...combustionPlumeSolverLastResult,
      state: combustionPlumeSolverState
    });
  }
  for (const [i, button] of [...buttons.children].entries()) {
    const active = i === model.layerIndex;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }
  layerName.textContent = layer.label;
  renderReadout();
  return layer;
}

function setEnvironmentFromUi() {
  return model.setEnvironment({
    oxygenFraction: Number(oxygen.value),
    stellarFlux: Number(stellarFlux.value),
    gravityMps2: Number(gravity.value),
    ambientTemperatureK: Number(ambientTemperature.value),
    ambientPressurePa: Number(ambientPressure.value),
    electricFieldVm: Number(electricField?.value || 0),
    magneticFieldT: Number(magneticField?.value || 0)
  });
}

function syncEnvironmentControls() {
  oxygen.value = String(model.environment.oxygenFraction);
  stellarFlux.value = String(model.environment.stellarFlux);
  gravity.value = String(model.environment.gravityMps2);
  ambientTemperature.value = String(model.environment.ambientTemperatureK);
  ambientPressure.value = String(model.environment.ambientPressurePa);
  if (electricField) electricField.value = String(model.environment.electricFieldVm);
  if (magneticField) magneticField.value = String(model.environment.magneticFieldT);
}

function formatScenarioAffordanceValue(value, fallback = 'pending') {
  const normalized = String(value || fallback).trim();
  return normalized ? normalized.replace(/[-_]+/g, ' ') : fallback;
}

function getScenarioLayerLabel(layerId, fallback = 'unknown') {
  const layer = SCALE_LAYERS.find((entry) => entry.id === layerId);
  return layer?.label || layerId || fallback;
}

function renderScenarioAffordance(scenario = model.getScenario()) {
  if (!scenarioAffordance) return;
  const activeMagnetar = scenario?.id === 'magnetar' && scenario.active === true;
  scenarioAffordance.hidden = !activeMagnetar;
  scenarioAffordance.classList.toggle('active', activeMagnetar);
  if (!activeMagnetar) return;

  const activeLayer = model.activeLayer || {};
  const targetLayerId = scenario.targetLayerId || activeLayer.id || 'solar';
  const readiness = scenario.handoffReadiness?.simulationStatus
    || scenario.validation?.simulationStatus
    || scenario.validation?.status
    || 'proxy-only';
  const handoffStatus = scenario.handoffReadiness?.status || 'handoff-pending';
  const blockerCount = scenario.handoffReadiness?.blockerCount ?? '?';
  if (scenarioAffordanceTitle) {
    scenarioAffordanceTitle.textContent = scenario.label || 'Magnetar proxy';
  }
  if (scenarioAffordanceReadiness) {
    scenarioAffordanceReadiness.textContent = `readiness: ${formatScenarioAffordanceValue(readiness)}`;
  }
  if (scenarioAffordanceTarget) {
    scenarioAffordanceTarget.textContent = `active layer: ${getScenarioLayerLabel(activeLayer.id, 'unknown')} / target ${getScenarioLayerLabel(targetLayerId, targetLayerId)}`;
  }
  if (scenarioAffordanceNote) {
    scenarioAffordanceNote.textContent = `scale-ladder proxy, not a literal star render / handoff ${formatScenarioAffordanceValue(handoffStatus)} / blockers ${blockerCount}`;
  }
}

function syncScenarioControls() {
  const scenario = model.getScenario();
  scenarioMagnetar?.classList.toggle('active', scenario.id === 'magnetar' && scenario.active === true);
  scenarioMagnetar?.setAttribute('aria-pressed', String(scenario.id === 'magnetar' && scenario.active === true));
  renderScenarioAffordance(scenario);
}

function readInitialScenarioPreset(search = '') {
  try {
    const params = new URLSearchParams(search || '');
    const value = String(
      params.get('scenario')
        || params.get('scenarioPreset')
        || params.get('objectPreset')
        || ''
    ).trim().toLowerCase();
    return MULTISCALE_SCENARIO_PRESETS[value] ? value : null;
  } catch (_) {
    return null;
  }
}

function applyScenarioPreset(id = 'magnetar', options = {}) {
  const scenario = model.applyScenarioPreset(id);
  syncEnvironmentControls();
  if (options.setLayer !== false && scenario.targetLayerId) {
    model.setLayerById(scenario.targetLayerId);
    setLayer(model.layerIndex);
  } else {
    renderReadout();
  }
  syncScenarioControls();
  return cloneJson({
    scenario,
    environment: model.environment,
    refinementRequests: model.estimateRefinementRequests()
  });
}

function ingestScenarioCalibrationSummary(summary = {}, options = {}) {
  const scenario = model.ingestScenarioCalibrationSummary(summary, options);
  syncEnvironmentControls();
  syncScenarioControls();
  renderReadout();
  return cloneJson({
    scenario,
    calibrationIngest: scenario.calibrationIngest || null,
    handoffReadiness: scenario.handoffReadiness || null
  });
}

function ingestScenarioClosureSummary(summary = {}, options = {}) {
  const scenario = model.ingestScenarioClosureSummary(summary, options);
  syncEnvironmentControls();
  syncScenarioControls();
  renderReadout();
  return cloneJson({
    scenario,
    closureIngest: scenario.closureIngest || null,
    handoffReadiness: scenario.handoffReadiness || null
  });
}

function ingestScenarioClosureModuleProbeReport(report = {}, options = {}) {
  const scenario = model.ingestScenarioClosureModuleProbeReport(report, options);
  syncEnvironmentControls();
  syncScenarioControls();
  renderReadout();
  return cloneJson({
    scenario,
    closureModuleProbe: scenario.closureModuleProbe || null,
    handoffReadiness: scenario.handoffReadiness || null
  });
}

function ingestScenarioTransferManifest(manifest = {}, options = {}) {
  const scenario = model.ingestScenarioTransferManifest(manifest, options);
  syncEnvironmentControls();
  syncScenarioControls();
  renderReadout();
  return cloneJson({
    scenario,
    transferManifest: scenario.transferManifest || null,
    handoffReadiness: scenario.handoffReadiness || null
  });
}

function ingestScenarioRuntimeEvidenceManifest(manifest = {}, options = {}) {
  const scenario = model.ingestScenarioRuntimeEvidenceManifest(manifest, options);
  syncEnvironmentControls();
  syncScenarioControls();
  renderReadout();
  return cloneJson({
    scenario,
    scientificRuntimeEvidence: scenario.scientificRuntimeEvidence || null,
    handoffReadiness: scenario.handoffReadiness || null
  });
}

function refreshScenarioRuntimeEvidence(options = {}) {
  const scenario = model.refreshScenarioRuntimeEvidence(options);
  syncEnvironmentControls();
  syncScenarioControls();
  renderReadout();
  return cloneJson({
    scenario,
    scientificRuntimeEvidence: scenario.scientificRuntimeEvidence || null,
    handoffReadiness: scenario.handoffReadiness || null
  });
}

function getScenarioRuntimeEvidenceRequirements(options = {}) {
  return cloneJson({
    requirements: model.getScenarioRuntimeEvidenceRequirements(options)
  });
}

async function createScenarioBoundedProxyRuntimeEvidenceManifest(options = {}) {
  const manifest = await model.createScenarioBoundedProxyRuntimeEvidenceManifest(options);
  return cloneJson({
    manifest
  });
}

async function refreshScenarioBoundedProxyRuntimeEvidence(options = {}) {
  const manifest = await model.createScenarioBoundedProxyRuntimeEvidenceManifest(options);
  const scenario = model.ingestScenarioRuntimeEvidenceManifest(manifest, options);
  syncEnvironmentControls();
  syncScenarioControls();
  renderReadout();
  return cloneJson({
    manifest,
    scenario,
    scientificRuntimeEvidence: scenario.scientificRuntimeEvidence || null,
    handoffReadiness: scenario.handoffReadiness || null
  });
}

async function createScenarioCalibratedRuntimeEvidenceManifest(options = {}) {
  const manifest = await model.createScenarioCalibratedRuntimeEvidenceManifest(options);
  return cloneJson({
    manifest
  });
}

async function refreshScenarioCalibratedRuntimeEvidence(options = {}) {
  const manifest = await model.createScenarioCalibratedRuntimeEvidenceManifest(options);
  const scenario = model.ingestScenarioRuntimeEvidenceManifest(manifest, options);
  syncEnvironmentControls();
  syncScenarioControls();
  renderReadout();
  return cloneJson({
    manifest,
    scenario,
    scientificRuntimeEvidence: scenario.scientificRuntimeEvidence || null,
    handoffReadiness: scenario.handoffReadiness || null
  });
}

function createUlgCalibratedRuntimeScope(report = {}, options = {}) {
  const manifest = report.manifest && typeof report.manifest === 'object' ? report.manifest : null;
  const evidence = report.scientificRuntimeEvidence && typeof report.scientificRuntimeEvidence === 'object'
    ? report.scientificRuntimeEvidence
    : null;
  const modelTiers = uniqueUlgStrings((manifest?.entries || [])
    .map((entry) => entry?.validation?.modelTier));
  return {
    schema: 'peercompute.multiscale.ulg-calibrated-demo-runtime-scope.v0',
    scenarioId: options.scenarioId || 'magnetar',
    status: evidence?.status || null,
    ready: evidence?.ready === true,
    source: manifest?.source || null,
    modelTiers,
    scientificExecution: evidence?.scientificExecution === true,
    reducedCalibratedRuntimeEvidence: manifest?.source === 'calibrated-reference-runtime-adapter-v0',
    fullFidelityMagnetarSimulation: false,
    fullPhysicsValidation: false,
    limitations: [
      'not-full-fidelity-grmhd',
      'not-production-pic',
      'not-spectral-radiation-transport'
    ]
  };
}

function ingestUlgArtifactForScenario(artifact = {}, options = {}) {
  const artifactKind = options.artifactKind || 'quantum-response';
  const artifactSummary = options.artifactSummary || summarizePeerComputeUlgArtifact(artifactKind, artifact);
  if (artifactSummary.artifactKind === 'closure') {
    return ingestScenarioClosureSummary(artifactSummary, {
      ...options,
      artifactKind,
      provider: options.provider || artifact.sourceService || artifactSummary.sourceService || 'eshkol'
    });
  }
  return ingestScenarioCalibrationSummary(artifactSummary, {
    ...options,
    artifactKind,
    provider: options.provider || artifact.sourceService || 'moonlab'
  });
}

function resolveUlgArtifactBaseUrl(artifact = {}, options = {}) {
  if (options.baseUrl || options.artifactBaseUrl) return options.baseUrl || options.artifactBaseUrl;
  if (artifact.runtime?.assetProbe?.baseUrl) return artifact.runtime.assetProbe.baseUrl;
  if (artifact.artifactBaseUrl || artifact.baseUrl) return artifact.artifactBaseUrl || artifact.baseUrl;
  if (artifact.artifactUrl) return new URL('.', artifact.artifactUrl).href;
  return null;
}

function prepareUlgClosureArtifactForScenario(artifact = {}, options = {}) {
  const runtime = {
    ...(artifact.runtime && typeof artifact.runtime === 'object' ? artifact.runtime : {})
  };
  if (options.bundleManifest) runtime.bundleManifest = options.bundleManifest;
  const prepared = { ...artifact, runtime };
  if (!prepared.validation && options.validationStatus) {
    prepared.validation = { status: String(options.validationStatus) };
  }
  return prepared;
}

function createClosureDescriptorReportFromArtifact(artifact = {}, summary = {}) {
  const descriptor = artifact.validation?.closureDescriptor && typeof artifact.validation.closureDescriptor === 'object'
    ? artifact.validation.closureDescriptor
    : null;
  if (!descriptor && !summary?.closureDescriptorSchema) return null;
  return {
    schema: summary.closureDescriptorSchema || descriptor?.schema || null,
    status: summary.closureDescriptorStatus || descriptor?.status || (summary.closureDescriptorReady === true ? 'closure-descriptor-ready' : null),
    scope: summary.closureDescriptorScope || descriptor?.scope || descriptor?.semanticScope || null,
    ready: summary.closureDescriptorReady === true,
    scientificValidation: typeof summary.closureDescriptorScientificValidation === 'boolean'
      ? summary.closureDescriptorScientificValidation
      : (typeof descriptor?.scientificValidation === 'boolean' ? descriptor.scientificValidation : null),
    probeMode: 'descriptor-only-closure-v0'
  };
}

async function executeUlgClosureArtifactForScenario(artifact = {}, options = {}) {
  const artifactKind = options.artifactKind || 'closure';
  const preparedArtifact = prepareUlgClosureArtifactForScenario(artifact, options);
  const artifactSummary = options.artifactSummary || summarizePeerComputeUlgArtifact(artifactKind, preparedArtifact);
  const provider = options.provider || preparedArtifact.sourceService || artifactSummary.sourceService || 'eshkol';
  const closureIngest = ingestScenarioClosureSummary(artifactSummary, {
    ...options,
    artifactKind,
    provider
  });
  const baseUrl = resolveUlgArtifactBaseUrl(preparedArtifact, options);
  const outputSemantics = options.outputSemantics
    || preparedArtifact.validation?.outputSemantics
    || createOutputSemanticsFromArtifactSummary(artifactSummary);
  const probe = await probeScenarioClosureModule(preparedArtifact, {
    ...options,
    artifactKind,
    provider,
    baseUrl,
    dryInstantiateHostRuntime: true,
    executeHostRuntime: options.executeHostRuntime !== false,
    entryExport: options.entryExport || artifactSummary.closureEntryExport || preparedArtifact.execution?.entryExport || 'main',
    entrySignature: options.entrySignature || artifactSummary.closureEntrySignature || preparedArtifact.execution?.entrySignature || null,
    outputSemantics,
    closureDescriptor: options.closureDescriptor || createClosureDescriptorReportFromArtifact(preparedArtifact, artifactSummary)
  });
  return cloneJson({
    ...probe,
    artifactSummary,
    closureIngest: closureIngest.closureIngest || null,
    closureHandoffReadiness: closureIngest.handoffReadiness || null,
    packet: createUiPacket()
  });
}

function createClosureDescriptorProbeFromArtifactSummary(summary = {}, options = {}) {
  if (!summary?.closureDescriptorSchema) return null;
  return ingestScenarioClosureModuleProbeReport({
    artifactId: summary.artifactId || null,
    closureKind: summary.closureKind || null,
    moduleUrl: summary.closureModuleUrl || null,
    moduleSha256: summary.closureModuleSha256 || null,
    provider: options.provider || summary.sourceService || 'eshkol',
    closureDescriptorSchema: summary.closureDescriptorSchema,
    closureDescriptorReady: summary.closureDescriptorReady === true,
    closureDescriptorStatus: summary.closureDescriptorStatus || null,
    closureDescriptorScope: summary.closureDescriptorScope || null,
    closureDescriptorScientificValidation: typeof summary.closureDescriptorScientificValidation === 'boolean'
      ? summary.closureDescriptorScientificValidation
      : null,
    probeMode: 'descriptor-only-closure-v0'
  }, {
    ...options,
    scenarioId: options.scenarioId || 'magnetar'
  });
}

async function applyUlgDemoHandoffForScenario(handoff = {}, options = {}) {
  const normalized = normalizePeerComputeUlgDemoHandoff(handoff, options);
  const serviceEnvelope = createPeerComputeUlgHandoffServiceEnvelope(normalized, {
    origin: window.location.origin,
    url: window.location.href,
    ...options,
    receivedAt: normalized.receivedAt
  });
  const serviceDispatchPlan = createPeerComputeUlgHandoffServiceDispatchPlan(serviceEnvelope, options);
  const transfer = normalized.transferManifest
    ? ingestScenarioTransferManifest(normalized.transferManifest, {
      ...options,
      scenarioId: options.scenarioId || 'magnetar'
    })
    : null;
  const calibrationArtifact = normalized.readyCalibrationArtifact || normalized.calibrationArtifacts[0] || null;
  const closureArtifact = normalized.readyClosureArtifact || normalized.closureArtifacts[0] || null;
  const calibration = calibrationArtifact
    ? ingestUlgArtifactForScenario(calibrationArtifact.artifact, {
      ...options,
      artifactKind: calibrationArtifact.artifactKind,
      artifactSummary: calibrationArtifact.artifactSummary,
      provider: options.calibrationProvider || calibrationArtifact.sourceService || 'moonlab'
    })
    : null;
  const closureOptions = closureArtifact ? {
    ...options,
    artifactKind: closureArtifact.artifactKind,
    artifactSummary: closureArtifact.artifactSummary,
    bundleManifest: closureArtifact.bundleManifest,
    validationStatus: closureArtifact.validationStatus,
    wasmBytes: closureArtifact.wasmBytes,
    provider: options.closureProvider || closureArtifact.sourceService || 'eshkol'
  } : null;
  const descriptorClosureReady = closureArtifact?.artifactSummary?.closureDescriptorReady === true;
  const descriptorClosureSmokeReady = descriptorClosureReady === true
    && closureArtifact?.artifactSummary?.closureOutputSemanticsReady === true;
  const shouldExecuteClosure = closureArtifact?.hasTransferredWasmBytes
    && options.executeClosure !== false
    && (descriptorClosureReady !== true || descriptorClosureSmokeReady || options.executeDescriptorClosure === true);
  const closure = shouldExecuteClosure
    ? await executeUlgClosureArtifactForScenario(closureArtifact.artifact, closureOptions)
    : (closureArtifact
      ? ingestUlgArtifactForScenario(closureArtifact.artifact, closureOptions)
      : null);
  const closureDescriptorProbe = descriptorClosureReady
    ? createClosureDescriptorProbeFromArtifactSummary(closureArtifact.artifactSummary, closureOptions || {})
    : null;
  return cloneJson({
    handoff: normalized,
    serviceEnvelope,
    serviceDispatchPlan,
    transfer,
    calibration,
    closure,
    closureDescriptorProbe,
    packet: createUiPacket()
  });
}

async function applyUlgDemoHandoffAndRefreshCalibratedRuntimeEvidence(handoff = {}, options = {}) {
  const scenarioOptions = {
    ...options,
    scenarioId: options.scenarioId || 'magnetar'
  };
  const handoffReport = await applyUlgDemoHandoffForScenario(handoff, scenarioOptions);
  const calibratedRuntimeReport = await refreshScenarioCalibratedRuntimeEvidence(scenarioOptions);
  return cloneJson({
    handoffReport,
    calibratedRuntimeReport,
    calibratedRuntimeScope: createUlgCalibratedRuntimeScope(calibratedRuntimeReport, scenarioOptions),
    handoff: handoffReport.handoff,
    serviceEnvelope: handoffReport.serviceEnvelope,
    serviceDispatchPlan: handoffReport.serviceDispatchPlan,
    transfer: handoffReport.transfer,
    calibration: handoffReport.calibration,
    closure: handoffReport.closure,
    closureDescriptorProbe: handoffReport.closureDescriptorProbe,
    manifest: calibratedRuntimeReport.manifest,
    scenario: calibratedRuntimeReport.scenario,
    scientificRuntimeEvidence: calibratedRuntimeReport.scientificRuntimeEvidence,
    handoffReadiness: calibratedRuntimeReport.handoffReadiness,
    packet: createUiPacket()
  });
}

function uniqueUlgStrings(values = []) {
  return [...new Set(values
    .map((value) => (value == null ? null : String(value).trim()))
    .filter(Boolean))];
}

function summarizeUlgDispatchServiceAdapterResults(results = []) {
  return results.map((entry = {}) => {
    const serviceResult = entry.serviceResult && typeof entry.serviceResult === 'object'
      ? entry.serviceResult
      : {};
    const serviceSummary = entry.serviceSummary && typeof entry.serviceSummary === 'object'
      ? entry.serviceSummary
      : null;
    const probe = serviceResult.probe && typeof serviceResult.probe === 'object'
      ? serviceResult.probe
      : {};
    const descriptorProbe = probe.descriptorProbe && typeof probe.descriptorProbe === 'object'
      ? probe.descriptorProbe
      : null;
    const hostRuntimeExecution = probe.hostRuntimeExecution && typeof probe.hostRuntimeExecution === 'object'
      ? probe.hostRuntimeExecution
      : null;
    return {
      schema: 'peercompute.multiscale.ulg-dispatch-service-result-summary.v0',
      dispatchId: entry.dispatchId || null,
      serviceId: entry.serviceId || null,
      sourceService: entry.sourceService || null,
      artifactKind: entry.artifactKind || null,
      taskKind: entry.taskKind || null,
      status: entry.status || null,
      ready: entry.ready === true,
      blockers: uniqueUlgStrings(entry.blockers || []),
      serviceSummary: cloneJson(serviceSummary),
      ingest: cloneJson(serviceResult.ingest || null),
      probeStatus: serviceSummary?.probeStatus || probe.status || null,
      probeReady: serviceSummary?.probeReady ?? (typeof probe.ready === 'boolean' ? probe.ready : null),
      probeMode: serviceSummary?.probeMode || probe.probeMode || null,
      descriptorProbe: cloneJson(descriptorProbe),
      descriptorTensorContract: cloneJson(descriptorProbe?.tensorContract || null),
      descriptorProductTopologyBinding: cloneJson(descriptorProbe?.productTopologyBinding || null),
      descriptorTensorRuntimeContract: cloneJson(descriptorProbe?.tensorRuntimeContract || null),
      descriptorRuntimeBinding: cloneJson(descriptorProbe?.runtimeBinding || null),
      hostRuntimeProbe: cloneJson(probe.hostRuntimeProbe || null),
      hostRuntimeExecution: cloneJson(hostRuntimeExecution),
      outputSemanticsValidation: cloneJson(hostRuntimeExecution?.outputSemanticsValidation || null)
    };
  });
}

function createUlgDispatchArtifactCache(now = () => Date.now()) {
  const records = new Map();
  return {
    async put(artifact = {}) {
      const artifactHash = artifact.contentHash || `ulg-dispatch-artifact-${records.size}`;
      const ref = {
        uri: `artifact://${artifactHash}`,
        artifactHash,
        sourceService: artifact.sourceService || null,
        createdAt: now()
      };
      records.set(ref.uri, { ref, artifact: cloneJson(artifact) });
      return cloneJson(ref);
    },
    async get(ref = {}) {
      return cloneJson(records.get(ref.uri)?.artifact || null);
    },
    list() {
      return [...records.values()].map(({ ref, artifact }) => ({
        ref: cloneJson(ref),
        artifactKind: artifact.artifactKind || artifact.taskKind || 'unknown',
        schema: artifact.schema || null
      }));
    }
  };
}

async function runUlgDispatchServiceAdapterProbe(handoff = {}, options = {}) {
  const normalized = normalizePeerComputeUlgDemoHandoff(handoff, options);
  const serviceEnvelope = createPeerComputeUlgHandoffServiceEnvelope(normalized, {
    origin: window.location.origin,
    url: window.location.href,
    ...options,
    receivedAt: normalized.receivedAt
  });
  const serviceIds = {
    ...ULG_DISPATCH_SERVICE_IDS,
    ...(options.serviceIds || {})
  };
  const workerModules = {
    ...ULG_DISPATCH_WORKER_MODULES,
    ...(options.workerModules || {})
  };
  const childWorkerModules = {
    ...ULG_DISPATCH_CHILD_WORKER_MODULES,
    ...(options.childWorkerModules || {})
  };
  const serviceDispatchPlan = createPeerComputeUlgHandoffServiceDispatchPlan(serviceEnvelope, {
    ...options,
    serviceIds
  });
  const artifactCache = createUlgDispatchArtifactCache();
  const registry = new ComputeServiceRegistry(createUlgDispatchServiceManifests({
    serviceIds,
    workerModules,
    childWorkerModules
  }));
  const supervisor = new WorkerSupervisor({ registry, artifactCache });
  const serviceExecutor = createPeerComputeUlgHandoffSupervisorServiceExecutor({ supervisor });
  const results = [];
  try {
    for (const dispatch of serviceDispatchPlan.dispatches || []) {
      results.push(await serviceExecutor({
        dispatch,
        dispatchPlan: serviceDispatchPlan,
        envelope: serviceEnvelope,
        task: {
          taskId: `${serviceEnvelope.handoffId || 'ulg-handoff'}:adapter-probe`,
          rootTaskId: `${serviceEnvelope.handoffId || 'ulg-handoff'}:adapter-probe`
        }
      }));
    }
    const acceptedDispatchCount = results.filter((entry) => entry.ready === true).length;
    const blockers = uniqueUlgStrings([
      ...(serviceDispatchPlan.blockers || []),
      ...results.flatMap((entry) => entry.blockers || [])
    ]);
    const telemetry = supervisor.getTreeTelemetry();
    return cloneJson({
      schema: ULG_DISPATCH_SERVICE_ADAPTER_PROBE_SCHEMA,
      handoffId: serviceEnvelope.handoffId || null,
      dispatchPlan: serviceDispatchPlan,
      dispatchCount: serviceDispatchPlan.dispatchCount || 0,
      executedDispatchCount: results.length,
      acceptedDispatchCount,
      failedDispatchCount: results.length - acceptedDispatchCount,
      ready: serviceDispatchPlan.ready === true
        && acceptedDispatchCount === serviceDispatchPlan.dispatchCount
        && blockers.length === 0,
      status: blockers.length === 0 && acceptedDispatchCount === serviceDispatchPlan.dispatchCount
        ? 'dispatch-adapters-ready'
        : 'dispatch-adapters-blocked',
      serviceIds: cloneJson(serviceIds),
      workerModules: cloneJson(workerModules),
      results,
      serviceResultSummaries: summarizeUlgDispatchServiceAdapterResults(results),
      telemetry,
      artifacts: artifactCache.list(),
      blockers
    });
  } finally {
    await supervisor.shutdown();
  }
}

function resolveScenarioClosureModuleUrl(artifact = {}, options = {}) {
  const moduleUrl = options.moduleUrl || artifact.execution?.module?.url || artifact.closureModuleUrl || null;
  if (!moduleUrl) return null;
  const assetProbe = artifact.runtime?.assetProbe;
  const moduleAssetUrl = assetProbe?.assets?.find((asset) => asset.kind === 'wasmModule')?.url || null;
  if (moduleAssetUrl && moduleAssetUrl.endsWith(moduleUrl)) return moduleAssetUrl;
  const baseUrl = options.baseUrl
    || assetProbe?.baseUrl
    || assetProbe?.assets?.find((asset) => asset.kind === 'artifactModule')?.url
    || window.location.href;
  return new URL(moduleUrl, baseUrl).href;
}

function normalizeScenarioClosureWasmBytes(input) {
  if (!input) return null;
  if (input instanceof ArrayBuffer) return input;
  if (ArrayBuffer.isView(input)) {
    return input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength);
  }
  if (Array.isArray(input)) {
    return new Uint8Array(input).buffer;
  }
  if (input?.type === 'Buffer' && Array.isArray(input.data)) {
    return new Uint8Array(input.data).buffer;
  }
  return null;
}

function normalizeWasmImportEntry(entry = {}) {
  return {
    module: entry.module || 'env',
    name: entry.name || '',
    kind: entry.kind || ''
  };
}

function normalizeWasmExportEntry(entry = {}) {
  return {
    name: entry.name || '',
    kind: entry.kind || ''
  };
}

function wasmEntryKey(entry = {}) {
  return `${entry.module || ''}:${entry.name || ''}:${entry.kind || ''}`;
}

function wasmExportKey(entry = {}) {
  return `${entry.name || ''}:${entry.kind || ''}`;
}

function readUnsignedLeb128(bytes, offset) {
  let result = 0;
  let shift = 0;
  let nextOffset = offset;
  while (nextOffset < bytes.length) {
    const byte = bytes[nextOffset];
    nextOffset += 1;
    result |= (byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) {
      return { value: result >>> 0, offset: nextOffset };
    }
    shift += 7;
  }
  throw new Error('Malformed WASM varuint');
}

function getWasmStartFunctionIndex(wasmBytes) {
  const bytes = wasmBytes instanceof Uint8Array ? wasmBytes : new Uint8Array(wasmBytes);
  if (bytes.length < 8) return null;
  const magicOk = bytes[0] === 0x00 && bytes[1] === 0x61 && bytes[2] === 0x73 && bytes[3] === 0x6d;
  if (!magicOk) return null;
  let offset = 8;
  while (offset < bytes.length) {
    const sectionId = bytes[offset];
    offset += 1;
    const sectionSize = readUnsignedLeb128(bytes, offset);
    offset = sectionSize.offset;
    const sectionEnd = offset + sectionSize.value;
    if (sectionEnd > bytes.length) return null;
    if (sectionId === 8) {
      return readUnsignedLeb128(bytes, offset).value;
    }
    offset = sectionEnd;
  }
  return null;
}

function createClosureHostRuntimeTable(initial = 64) {
  try {
    return new WebAssembly.Table({ initial, element: 'anyfunc' });
  } catch {
    return new WebAssembly.Table({ initial, element: 'funcref' });
  }
}

function createScenarioClosureHostRuntimeStubImports(observedImports = [], options = {}) {
  const importObject = {};
  const calls = [];
  const memoryInitialPages = Number.isFinite(Number(options.memoryInitialPages))
    ? Math.max(1, Math.floor(Number(options.memoryInitialPages)))
    : 256;
  const tableInitial = Number.isFinite(Number(options.tableInitial))
    ? Math.max(0, Math.floor(Number(options.tableInitial)))
    : 64;
  let functionStubCount = 0;
  let memoryStubCount = 0;
  let globalStubCount = 0;
  let tableStubCount = 0;

  const ensureModule = (moduleName = 'env') => {
    if (!importObject[moduleName]) importObject[moduleName] = {};
    return importObject[moduleName];
  };

  for (const entry of observedImports) {
    const moduleName = entry.module || 'env';
    const name = entry.name || '';
    const moduleImports = ensureModule(moduleName);
    if (!name || moduleImports[name]) continue;
    if (entry.kind === 'function') {
      functionStubCount += 1;
      moduleImports[name] = (...args) => {
        calls.push({ module: moduleName, name, argCount: args.length });
        return 0;
      };
    } else if (entry.kind === 'memory') {
      memoryStubCount += 1;
      moduleImports[name] = new WebAssembly.Memory({ initial: memoryInitialPages });
    } else if (entry.kind === 'global') {
      globalStubCount += 1;
      moduleImports[name] = new WebAssembly.Global({ value: 'i32', mutable: true }, options.stackPointerValue || 65536);
    } else if (entry.kind === 'table') {
      tableStubCount += 1;
      moduleImports[name] = createClosureHostRuntimeTable(tableInitial);
    }
  }

  return {
    importObject,
    calls,
    functionStubCount,
    memoryStubCount,
    globalStubCount,
    tableStubCount
  };
}

async function dryProbeScenarioClosureHostRuntime(module, observedImports = [], options = {}) {
  const stub = createScenarioClosureHostRuntimeStubImports(observedImports, options);
  const entryExport = options.entryExport || 'main';
  let instance = null;
  let error = null;
  try {
    instance = await WebAssembly.instantiate(module, stub.importObject);
  } catch (err) {
    error = err?.message || String(err);
  }
  const exports = instance?.exports || {};
  const entryExportAvailable = typeof exports[entryExport] === 'function';
  const ready = Boolean(instance && entryExportAvailable);
  return {
    schema: 'peercompute.multiscale.scenario-closure-host-runtime-probe.v0',
    status: ready ? 'host-runtime-probe-ready' : 'host-runtime-probe-pending',
    ready,
    mode: 'stub-import-dry-instantiate-v0',
    stubbed: true,
    importObjectCreated: true,
    instantiated: Boolean(instance),
    importCount: observedImports.length,
    functionStubCount: stub.functionStubCount,
    memoryStubCount: stub.memoryStubCount,
    globalStubCount: stub.globalStubCount,
    tableStubCount: stub.tableStubCount,
    stubCallCount: stub.calls.length,
    entryExport,
    entryExportAvailable,
    mainInvoked: false,
    scientificExecution: false,
    error
  };
}

function createScenarioClosureHostRuntimeExecutionImports(observedImports = [], options = {}) {
  const stub = createScenarioClosureHostRuntimeStubImports(observedImports, {
    ...options,
    memoryInitialPages: options.memoryInitialPages || 256,
    tableInitial: options.tableInitial || 256,
    stackPointerValue: options.stackPointerValue || 1048576
  });
  const output = [];
  const calls = [];
  const env = stub.importObject.env || {};
  const record = (name, args) => {
    calls.push({ name, argCount: args.length });
  };
  const pushChar = (value) => {
    const charCode = Number(value) & 0xff;
    output.push(String.fromCharCode(charCode));
    return charCode;
  };

  env.__eshkol_register_parallel_workers = (...args) => { record('__eshkol_register_parallel_workers', args); };
  env.eshkol_init_stack_size = (...args) => { record('eshkol_init_stack_size', args); };
  env.eshkol_runtime_init = (...args) => { record('eshkol_runtime_init', args); return 0; };
  env.get_global_arena = (...args) => { record('get_global_arena', args); return options.globalArenaPtr || 1; };
  env.eshkol_lambda_registry_init = (...args) => { record('eshkol_lambda_registry_init', args); };
  env.__eshkol_lib_init__ = (...args) => { record('__eshkol_lib_init__', args); };
  env.eshkol_display_value = (value, ...args) => {
    record('eshkol_display_value', [value, ...args]);
    output.push(String(value));
  };
  env.eshkol_runtime_current_output_fp = (...args) => {
    record('eshkol_runtime_current_output_fp', args);
    return options.outputFilePointer || 0;
  };
  env.fputc = (charCode, fp) => {
    record('fputc', [charCode, fp]);
    return pushChar(charCode);
  };

  return { ...stub, output, calls };
}

function entryArgsForSignature(signature = {}, fallbackExport = 'main') {
  const parameters = Array.isArray(signature?.parameters) ? signature.parameters : [];
  if (parameters.length === 0 && fallbackExport === 'main') return [0, 0];
  return parameters.map((type) => (type === 'i64' ? 0n : 0));
}

function serializeWasmValue(value) {
  if (typeof value === 'bigint') return value.toString();
  if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean' || value === null) return value;
  return String(value);
}

const ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA = 'eshkol.ulg.closure-output-semantics.v0';
const SCENARIO_CLOSURE_OUTPUT_SEMANTICS_VALIDATION_SCHEMA = 'peercompute.multiscale.scenario-closure-output-semantics-validation.v0';

function createOutputSemanticsFromArtifactSummary(summary = {}) {
  if (!summary?.closureOutputSemanticsSchema) return null;
  const stdout = {};
  if (summary.closureOutputExpectedStdoutSha256) {
    stdout.sha256 = summary.closureOutputExpectedStdoutSha256;
  }
  if (summary.closureOutputExpectedStdoutByteLength != null) {
    stdout.byteLength = Number(summary.closureOutputExpectedStdoutByteLength);
  }
  return {
    schema: summary.closureOutputSemanticsSchema,
    semanticScope: summary.closureOutputSemanticScope || null,
    scientificScope: summary.closureOutputScientificScope || null,
    scientificValidation: summary.closureOutputScientificValidation === true,
    entryExport: summary.closureOutputExpectedEntryExport || null,
    entryArgs: Array.isArray(summary.closureOutputExpectedEntryArgs)
      ? [...summary.closureOutputExpectedEntryArgs]
      : null,
    expectedEntryResult: summary.closureOutputExpectedEntryResult ?? null,
    stdout
  };
}

function compareSerializedScalar(actual, expected) {
  if (actual == null || expected == null) return actual == null && expected == null;
  return String(serializeWasmValue(actual)) === String(serializeWasmValue(expected));
}

function compareSerializedArray(actual = [], expected = []) {
  if (!Array.isArray(actual) || !Array.isArray(expected) || actual.length !== expected.length) return false;
  return actual.every((value, index) => compareSerializedScalar(value, expected[index]));
}

async function sha256Utf8(text) {
  if (!globalThis.crypto?.subtle) return null;
  const encoded = new TextEncoder().encode(String(text));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', encoded);
  return `sha256:${Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')}`;
}

async function validateScenarioClosureOutputSemantics(execution = {}, outputSemantics = null) {
  const blockers = [];
  const semantics = outputSemantics && typeof outputSemantics === 'object' ? outputSemantics : null;
  const stdout = semantics?.stdout && typeof semantics.stdout === 'object' ? semantics.stdout : {};
  const outputText = String(execution.outputText || '');
  const outputByteLength = Number.isFinite(Number(execution.outputByteLength))
    ? Number(execution.outputByteLength)
    : new TextEncoder().encode(outputText).length;
  const outputSha256 = await sha256Utf8(outputText);
  if (!semantics) {
    blockers.push('eshkol-closure-output-semantics-missing');
  }
  if (semantics && semantics.schema !== ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA) {
    blockers.push('eshkol-closure-output-semantics-schema-unrecognized');
  }
  if (semantics && semantics.semanticScope !== 'smoke-fixture') {
    blockers.push('eshkol-closure-output-semantics-scope-unsupported');
  }
  if (semantics && semantics.scientificValidation !== false) {
    blockers.push('eshkol-closure-output-semantics-scientific-scope-invalid');
  }
  if (semantics?.entryExport && semantics.entryExport !== execution.entryExport) {
    blockers.push('eshkol-closure-output-entry-export-mismatch');
  }
  if (Array.isArray(semantics?.entryArgs) && !compareSerializedArray(execution.entryArgs || [], semantics.entryArgs)) {
    blockers.push('eshkol-closure-output-entry-args-mismatch');
  }
  if (
    semantics
    && Object.prototype.hasOwnProperty.call(semantics, 'expectedEntryResult')
    && !compareSerializedScalar(execution.entryResult, semantics.expectedEntryResult)
  ) {
    blockers.push('eshkol-closure-output-entry-result-mismatch');
  }
  if (Number.isFinite(Number(stdout.byteLength)) && Number(stdout.byteLength) !== outputByteLength) {
    blockers.push('eshkol-closure-output-stdout-byte-length-mismatch');
  }
  if (stdout.sha256 && (!outputSha256 || stdout.sha256 !== outputSha256)) {
    blockers.push(outputSha256 ? 'eshkol-closure-output-stdout-sha256-mismatch' : 'eshkol-closure-output-stdout-sha256-unavailable');
  }
  if (typeof stdout.expectedText === 'string' && stdout.expectedText !== outputText) {
    blockers.push('eshkol-closure-output-stdout-text-mismatch');
  }
  if (execution.ready !== true) {
    blockers.push('eshkol-closure-host-runtime-execution-not-ready');
  }
  return {
    schema: SCENARIO_CLOSURE_OUTPUT_SEMANTICS_VALIDATION_SCHEMA,
    status: blockers.length === 0 ? 'output-semantics-validated' : 'output-semantics-pending',
    ready: blockers.length === 0,
    sourceSchema: semantics?.schema || null,
    semanticScope: semantics?.semanticScope || null,
    scientificScope: semantics?.scientificScope || null,
    scientificValidation: semantics?.scientificValidation === true,
    expected: {
      entryExport: semantics?.entryExport || null,
      entryArgs: Array.isArray(semantics?.entryArgs) ? [...semantics.entryArgs] : null,
      entryResult: semantics?.expectedEntryResult ?? null,
      stdoutSha256: stdout.sha256 || null,
      stdoutByteLength: Number.isFinite(Number(stdout.byteLength)) ? Number(stdout.byteLength) : null,
      stdoutExpectedTextProvided: typeof stdout.expectedText === 'string'
    },
    observed: {
      entryExport: execution.entryExport || null,
      entryArgs: Array.isArray(execution.entryArgs) ? [...execution.entryArgs] : [],
      entryResult: execution.entryResult ?? null,
      stdoutSha256: outputSha256,
      stdoutByteLength: outputByteLength
    },
    checks: {
      schema: semantics?.schema === ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA,
      semanticScope: semantics?.semanticScope === 'smoke-fixture',
      scientificValidation: semantics?.scientificValidation === false,
      entryExport: !semantics?.entryExport || semantics.entryExport === execution.entryExport,
      entryArgs: !Array.isArray(semantics?.entryArgs) || compareSerializedArray(execution.entryArgs || [], semantics.entryArgs),
      entryResult: !semantics || !Object.prototype.hasOwnProperty.call(semantics, 'expectedEntryResult')
        || compareSerializedScalar(execution.entryResult, semantics.expectedEntryResult),
      stdoutByteLength: !Number.isFinite(Number(stdout.byteLength)) || Number(stdout.byteLength) === outputByteLength,
      stdoutSha256: !stdout.sha256 || stdout.sha256 === outputSha256,
      stdoutText: typeof stdout.expectedText !== 'string' || stdout.expectedText === outputText
    },
    blockers,
    scientificExecution: false
  };
}

async function executeScenarioClosureHostRuntime(module, observedImports = [], options = {}) {
  const runtime = createScenarioClosureHostRuntimeExecutionImports(observedImports, options);
  const entryExport = options.entryExport || 'main';
  const entryArgs = Array.isArray(options.entryArgs)
    ? options.entryArgs
    : entryArgsForSignature(options.entrySignature || {}, entryExport);
  let instance = null;
  let entryResult = null;
  let error = null;
  let entryInvoked = false;
  try {
    instance = await WebAssembly.instantiate(module, runtime.importObject);
    const entry = instance?.exports?.[entryExport];
    if (typeof entry !== 'function') {
      throw new Error(`Eshkol entry export is not callable: ${entryExport}`);
    }
    entryResult = serializeWasmValue(entry(...entryArgs));
    entryInvoked = true;
  } catch (err) {
    error = err?.message || String(err);
  }
  const outputText = runtime.output.join('');
  const serializedEntryArgs = entryArgs.map(serializeWasmValue);
  const outputByteLength = new TextEncoder().encode(outputText).length;
  const ready = Boolean(instance && entryInvoked && !error);
  const outputSemanticsValidation = await validateScenarioClosureOutputSemantics({
    ready,
    entryExport,
    entryArgs: serializedEntryArgs,
    entryResult,
    outputText,
    outputByteLength
  }, options.outputSemantics || null);
  return {
    schema: 'peercompute.multiscale.scenario-closure-host-runtime-execution.v0',
    status: ready ? 'host-runtime-execution-ready' : 'host-runtime-execution-pending',
    ready,
    mode: 'dom-free-eshkol-host-imports-v0',
    instantiated: Boolean(instance),
    entryInvoked,
    entryExport,
    entryArgs: serializedEntryArgs,
    entryResult,
    outputPreview: outputText.slice(0, 160),
    outputByteLength,
    outputSemanticsValidation,
    runtimeCallCount: runtime.calls.length,
    calledImports: [...new Set(runtime.calls.map((call) => call.name))],
    mainInvoked: entryExport === 'main' && entryInvoked,
    scientificExecution: false,
    error
  };
}

async function probeScenarioClosureModule(artifact = {}, options = {}) {
  const execution = artifact.execution && typeof artifact.execution === 'object' ? artifact.execution : {};
  const importEntries = Array.isArray(execution.imports) ? execution.imports : [];
  const expectedImports = importEntries.map(normalizeWasmImportEntry);
  const expectedExports = Array.isArray(execution.exports)
    ? execution.exports.map(normalizeWasmExportEntry)
    : [];
  const entryExport = options.entryExport || execution.entryExport || 'main';
  const moduleUrl = resolveScenarioClosureModuleUrl(artifact, options);
  let moduleSource = 'fetched-wasm-url';
  let report;

  try {
    let wasmBytes = normalizeScenarioClosureWasmBytes(options.wasmBytes || artifact.wasmBytes || null);
    if (!wasmBytes && !moduleUrl) {
      throw new Error('Missing Eshkol closure module URL');
    }
    if (wasmBytes) {
      moduleSource = 'provided-wasm-bytes';
    } else {
      const response = await fetch(moduleUrl, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Failed to fetch Eshkol closure module: ${response.status}`);
      }
      wasmBytes = await response.arrayBuffer();
    }
    const startFunctionIndex = getWasmStartFunctionIndex(wasmBytes);
    const module = new WebAssembly.Module(wasmBytes);
    const observedImports = WebAssembly.Module.imports(module).map(normalizeWasmImportEntry);
    const observedExports = WebAssembly.Module.exports(module).map(normalizeWasmExportEntry);
    const observedImportKeys = new Set(observedImports.map(wasmEntryKey));
    const observedExportKeys = new Set(observedExports.map(wasmExportKey));
    const expectedImportKeys = expectedImports.map(wasmEntryKey);
    const expectedExportKeys = expectedExports.map(wasmExportKey);
    const importMetadataMatches = expectedImportKeys.every((key) => observedImportKeys.has(key))
      && observedImports.length === expectedImports.length;
    const exportMetadataMatches = expectedExports.length === 0
      ? observedExports.some((entry) => entry.name === entryExport)
      : expectedExportKeys.every((key) => observedExportKeys.has(key));
    const entryExportAvailable = observedExports.some((entry) => entry.name === entryExport && entry.kind === 'function');
    const importSummary = {
      expectedCount: expectedImports.length,
      observedCount: observedImports.length,
      functionCount: observedImports.filter((entry) => entry.kind === 'function').length,
      memoryCount: observedImports.filter((entry) => entry.kind === 'memory').length,
      globalCount: observedImports.filter((entry) => entry.kind === 'global').length,
      tableCount: observedImports.filter((entry) => entry.kind === 'table').length
    };
    const exportSummary = {
      expectedCount: expectedExports.length,
      observedCount: observedExports.length,
      functionCount: observedExports.filter((entry) => entry.kind === 'function').length
    };
    const hostRuntimeProbe = (options.dryInstantiateHostRuntime === true || options.probeHostRuntime === true)
      ? (startFunctionIndex === null
          ? await dryProbeScenarioClosureHostRuntime(module, observedImports, { ...options, entryExport })
          : {
              schema: 'peercompute.multiscale.scenario-closure-host-runtime-probe.v0',
              status: 'host-runtime-probe-blocked-start-section',
              ready: false,
              mode: 'stub-import-dry-instantiate-v0',
              stubbed: false,
              importObjectCreated: false,
              instantiated: false,
              importCount: observedImports.length,
              functionStubCount: 0,
              memoryStubCount: 0,
              globalStubCount: 0,
              tableStubCount: 0,
              stubCallCount: 0,
              startFunctionIndex,
              entryExport,
              entryExportAvailable,
              mainInvoked: false,
              scientificExecution: false,
              error: 'WASM start section present; dry instantiate with inert host imports is blocked.'
            })
      : null;
    const hostRuntimeExecution = (options.executeHostRuntime === true || options.executeScenarioClosure === true)
      ? (startFunctionIndex === null
          ? await executeScenarioClosureHostRuntime(module, observedImports, {
              ...options,
              entryExport,
              entrySignature: options.entrySignature || execution.entrySignature || null,
              outputSemantics: options.outputSemantics || artifact.validation?.outputSemantics || null
            })
          : {
              schema: 'peercompute.multiscale.scenario-closure-host-runtime-execution.v0',
              status: 'host-runtime-execution-blocked-start-section',
              ready: false,
              mode: 'dom-free-eshkol-host-imports-v0',
              instantiated: false,
              entryInvoked: false,
              entryExport,
              entryArgs: [],
              entryResult: null,
              outputPreview: '',
              outputByteLength: 0,
              runtimeCallCount: 0,
              calledImports: [],
              startFunctionIndex,
              mainInvoked: false,
              scientificExecution: false,
              error: 'WASM start section present; host-runtime execution is blocked.'
            })
      : null;
    report = {
      scenarioId: options.scenarioId || 'magnetar',
      provider: options.provider || artifact.sourceService || 'eshkol',
      artifactId: artifact.closureId || artifact.artifactId || null,
      closureKind: artifact.closureKind || null,
      moduleUrl,
      moduleSource,
      moduleSha256: execution.module?.sha256 || null,
      entryExport,
      importSummary,
      exportSummary,
      observedImports,
      observedExports,
      importMetadataMatches,
      exportMetadataMatches,
      entryExportAvailable,
      startFunctionIndex,
      moduleCompiled: true,
      ready: importMetadataMatches && exportMetadataMatches && entryExportAvailable,
      serviceWorkerSafe: execution.serviceWorkerSafe === true,
      requiresHostImports: artifact.validity?.requiresHostImports ?? importEntries.some((entry) => entry.kind === 'function'),
      hostRuntimeRequired: artifact.validity?.requiresHostImports === true || observedImports.length > 0,
      closureDescriptor: cloneJson(options.closureDescriptor || null),
      hostRuntimeProbe,
      hostRuntimeExecution,
      probeMode: 'browser-webassembly-module-abi-v0',
      error: null
    };
  } catch (error) {
    report = {
      scenarioId: options.scenarioId || 'magnetar',
      provider: options.provider || artifact.sourceService || 'eshkol',
      artifactId: artifact.closureId || artifact.artifactId || null,
      closureKind: artifact.closureKind || null,
      moduleUrl,
      moduleSource,
      moduleSha256: execution.module?.sha256 || null,
      entryExport,
      importSummary: {
        expectedCount: expectedImports.length,
        observedCount: 0,
        functionCount: 0,
        memoryCount: 0,
        globalCount: 0,
        tableCount: 0
      },
      exportSummary: {
        expectedCount: expectedExports.length,
        observedCount: 0,
        functionCount: 0
      },
      observedImports: [],
      observedExports: [],
      importMetadataMatches: false,
      exportMetadataMatches: false,
      entryExportAvailable: false,
      moduleCompiled: false,
      ready: false,
      serviceWorkerSafe: execution.serviceWorkerSafe === true,
      requiresHostImports: artifact.validity?.requiresHostImports ?? importEntries.some((entry) => entry.kind === 'function'),
      hostRuntimeRequired: artifact.validity?.requiresHostImports === true || expectedImports.length > 0,
      closureDescriptor: cloneJson(options.closureDescriptor || null),
      hostRuntimeProbe: null,
      hostRuntimeExecution: null,
      probeMode: 'browser-webassembly-module-abi-v0',
      error: error?.message || String(error)
    };
  }

  return ingestScenarioClosureModuleProbeReport(report, options);
}

function normalizeEnvironmentValues(values = {}) {
  return Object.fromEntries(
    Object.entries(values)
      .map(([key, value]) => [key, Number(value)])
      .filter(([, value]) => Number.isFinite(value))
  );
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizePositiveInteger(value, fallback, min, max) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeElementSymbol(value, fallback = 'H') {
  const raw = String(value || '').trim();
  if (!raw) return fallback;
  const normalized = raw.slice(0, 1).toUpperCase() + raw.slice(1).toLowerCase();
  const match = SUPPORTED_MOLECULAR_ELEMENTS.find((element) => element.symbol === normalized);
  return match ? match.symbol : fallback;
}

function normalizeCompositionObject(composition = {}) {
  const next = {};
  for (const [key, value] of Object.entries(composition || {})) {
    const symbol = normalizeElementSymbol(key, null);
    if (!symbol) continue;
    const count = normalizePositiveInteger(value, 0, 0, 32768);
    if (count > 0) next[symbol] = (next[symbol] || 0) + count;
  }
  const total = Object.values(next).reduce((sum, value) => sum + value, 0);
  if (total >= 3) return next;
  return createDefaultMolecularComposition(solverBudget?.molecularDynamics?.atomCount || 72);
}

function createDefaultMolecularComposition(atomTarget = 72) {
  const moleculeCount = Math.max(1, Math.floor(normalizePositiveInteger(atomTarget, 72, 3, 32768) / 3));
  return {
    H: moleculeCount * 2,
    O: moleculeCount
  };
}

function formatMolecularComposition(composition = molecularComposition) {
  return SUPPORTED_MOLECULAR_ELEMENTS
    .map(({ symbol }) => [symbol, Number(composition?.[symbol] || 0)])
    .filter(([, count]) => count > 0)
    .map(([symbol, count]) => `${symbol}${count}`)
    .join(' ') || 'empty';
}

function countMolecularComposition(composition = molecularComposition) {
  return Object.values(composition || {}).reduce((sum, value) => sum + Math.max(0, Math.floor(Number(value) || 0)), 0);
}

function readInitialMolecularComposition(search, atomTarget = 72) {
  const params = new URLSearchParams(search || '');
  const composition = {};
  for (const { symbol } of SUPPORTED_MOLECULAR_ELEMENTS) {
    const keys = [
      `molecular${symbol}`,
      `md${symbol}`,
      `atom${symbol}`,
      symbol
    ];
    for (const key of keys) {
      const value = params.get(key) ?? params.get(key.toLowerCase());
      if (value == null || value === '') continue;
      const count = normalizePositiveInteger(value, 0, 0, 32768);
      if (count > 0) composition[symbol] = (composition[symbol] || 0) + count;
    }
  }
  return normalizeCompositionObject(
    Object.keys(composition).length > 0 ? composition : createDefaultMolecularComposition(atomTarget)
  );
}

function readInitialQuantumOrbital(search) {
  const params = new URLSearchParams(search || '');
  const elementSymbol = params.get('orbitalElement')
    || params.get('quantumElement')
    || params.get('orbitalElementSymbol');
  const principalN = params.get('orbitalN') ?? params.get('quantumN');
  const angularL = params.get('orbitalL') ?? params.get('quantumL');
  const magneticM = params.get('orbitalM') ?? params.get('quantumM');
  const finiteGridSize = params.get('orbitalGrid') ?? params.get('quantumGrid');
  const hasAny = [elementSymbol, principalN, angularL, magneticM, finiteGridSize]
    .some((value) => value != null && value !== '');
  if (!hasAny) return null;
  return {
    elementSymbol: elementSymbol || undefined,
    principalN: principalN == null ? undefined : Number(principalN),
    angularL: angularL == null ? undefined : Number(angularL),
    magneticM: magneticM == null ? undefined : Number(magneticM),
    finiteGridSize: finiteGridSize == null ? undefined : Number(finiteGridSize)
  };
}

function hasMolecularCompositionOverride(search) {
  const params = new URLSearchParams(search || '');
  for (const { symbol } of SUPPORTED_MOLECULAR_ELEMENTS) {
    const keys = [`molecular${symbol}`, `md${symbol}`, `atom${symbol}`, symbol];
    if (keys.some((key) => params.has(key) || params.has(key.toLowerCase()))) return true;
  }
  return false;
}

function updateMolecularControls() {
  if (moleculeRecipe) {
    moleculeRecipe.textContent = `${formatMolecularComposition()} / ${countMolecularComposition()} atoms`;
  }
}

function updateQuantumOrbitalControls() {
  const orbital = model.state.orbital;
  if (orbitalElement) orbitalElement.value = orbital.elementSymbol || 'O';
  if (orbitalN) orbitalN.value = String(orbital.principalN ?? 2);
  if (orbitalL) orbitalL.value = String(orbital.angularL ?? 1);
  if (orbitalM) orbitalM.value = String(orbital.magneticM ?? 0);
  if (orbitalGrid) orbitalGrid.value = String(orbital.finiteGridSize ?? 18);
  if (orbitalStatus) {
    orbitalStatus.textContent = `${orbital.elementSymbol || 'O'} ${orbital.activeOrbitalLabel || `${orbital.principalN || 2}p`} / grid ${orbital.finiteGridSize || 18} / boundary ${formatExp(orbital.finiteGridBoundaryMass || 0, 2)}`;
  }
}

function applyQuantumOrbitalControls(values = {}) {
  const next = model.setQuantumOrbital({
    elementSymbol: values.elementSymbol ?? orbitalElement?.value ?? model.state.orbital.elementSymbol,
    principalN: values.principalN ?? orbitalN?.value ?? model.state.orbital.principalN,
    angularL: values.angularL ?? orbitalL?.value ?? model.state.orbital.angularL,
    magneticM: values.magneticM ?? orbitalM?.value ?? model.state.orbital.magneticM,
    finiteGridSize: values.finiteGridSize ?? orbitalGrid?.value ?? model.state.orbital.finiteGridSize
  });
  quantumOrbitalGridLastInputKey = null;
  quantumOrbitalGridLastResult = null;
  quantumOrbitalGridLastError = null;
  quantumOrbitalGridCompleted = 0;
  quantumOrbitalGridFailed = 0;
  quantumMaterialPotentialLastInputKey = null;
  quantumMaterialPotentialLastResult = null;
  quantumMaterialPotentialLastError = null;
  quantumMaterialPotentialCompleted = 0;
  quantumMaterialPotentialFailed = 0;
  ulgRuntimeLastInputKey = null;
  ulgRuntimeLastResult = null;
  ulgRuntimeLastError = null;
  ulgRuntimeCompleted = 0;
  ulgRuntimeFailed = 0;
  model.state.ulgRuntimeExecution = null;
  model.state.ulgRuntimeStateDelta = null;
  updateQuantumOrbitalControls();
  renderReadout();
  return {
    ok: true,
    reason: values.reason || 'set-quantum-orbital',
    orbital: cloneJson(next)
  };
}

function resetMolecularDynamicsRuntime(composition = molecularComposition, { reason = 'manual', manual = true } = {}) {
  if (molecularDynamicsSolverPending) {
    return {
      ok: false,
      reason: 'molecular-solver-pending',
      composition: { ...molecularComposition }
    };
  }
  molecularComposition = normalizeCompositionObject(composition);
  molecularCompositionManual = manual;
  const atomTotal = countMolecularComposition(molecularComposition);
  solverBudget = {
    ...solverBudget,
    molecularDynamics: {
      ...solverBudget.molecularDynamics,
      atomCount: atomTotal
    }
  };
  solverGovernorStatus = solverGovernor.setBudget(solverBudget);
  molecularDynamicsSolverState = makeMolecularDynamicsInitialState({
    atomCount: atomTotal,
    seed: 20260529 + atomTotal,
    environment: model.environment,
    composition: molecularComposition,
    coupling: {
      fireIntensity: model.state.surface.fireIntensity,
      waterContact: model.state.surface.waterContact,
      radiativeHeatFlux: model.state.surface.radiativeHeatFlux,
      reactionProgress: model.state.molecular.reactionProgress,
      ulgRuntimeStateDelta: model.state.ulgRuntimeStateDelta
    }
  });
  molecularDynamicsSolverSubmitted = 0;
  molecularDynamicsSolverCompleted = 0;
  molecularDynamicsSolverFailed = 0;
  molecularDynamicsSolverLastError = null;
  molecularDynamicsSolverLastResult = null;
  scene.setMolecularDynamicsOverlayWaiting?.(`recipe reset:${reason}`);
  updateMolecularControls();
  updateSolverRuntimeStatus();
  renderReadout();
  return {
    ok: true,
    reason,
    atomCount: atomTotal,
    composition: { ...molecularComposition },
    solverBudget: cloneJson(solverBudget.molecularDynamics)
  };
}

function roundSolverGrid(value) {
  return normalizePositiveInteger(Math.round(value / 2) * 2, 16, 4, 128);
}

function getSolverWorkloadMultiplier(key) {
  return clampNumber(Number(solverWorkloadMultipliers[key]) || 1, 0.5, 1.5);
}

function setSolverWorkloadMultiplier(key, value) {
  if (!SCALABLE_SOLVER_KEYS.includes(key)) return { ok: false, reason: 'solver-not-scalable' };
  const multiplier = clampNumber(Number(value) || 1, 0.5, 1.5);
  solverWorkloadMultipliers = { ...solverWorkloadMultipliers };
  if (Math.abs(multiplier - 1) <= 1e-6) {
    delete solverWorkloadMultipliers[key];
  } else {
    solverWorkloadMultipliers[key] = multiplier;
  }
  return { ok: true, solverKey: key, solverWorkloadMultiplier: multiplier };
}

function getLockedSolverLoadKeys() {
  return [
    ...NON_SCALABLE_SOLVER_KEYS,
    ...(molecularCompositionManual ? ['molecularDynamics'] : [])
  ];
}

function refreshSolverLoadReport() {
  solverLoadReport = createSolverLoadReport({
    solverRuntime: solverRuntimeStatus,
    solverBudget,
    lockedSolvers: getLockedSolverLoadKeys()
  });
  return solverLoadReport;
}

function refreshSolverAdmissionReport({
  solverLoad = solverLoadReport || refreshSolverLoadReport(),
  memoryPressure = memoryPressureReport,
  managerStats = computeStatus.peercompute?.managerCapabilities?.stats || computeManager.getStats?.() || null
} = {}) {
  solverAdmissionReport = createSolverAdmissionReport({
    solverBudget,
    solverLoad,
    memoryPressure,
    managerStats,
    computeBudget,
    resourceProfile: computeManager.getResourceProfile?.() || computeBudget?.resourceProfile || {},
    solverScales: solverWorkloadMultipliers,
    nowMs: Date.now()
  });
  return solverAdmissionReport;
}

function formatSolverWorkloadScales() {
  const entries = Object.entries(solverWorkloadMultipliers)
    .filter(([, value]) => Math.abs(Number(value) - 1) > 1e-6)
    .map(([key, value]) => `${key} ${Number(value).toFixed(2)}x`);
  return entries.length > 0 ? entries.join(' / ') : 'all 1.00x';
}

function formatSolverAdmission(report = solverAdmissionReport) {
  if (!report || report.schema !== 'peercompute.multiscale.solver-admission.v0') return 'warming';
  const dominant = report.dominantSolver || 'none';
  return `${report.recommendedAction || 'hold'} / p ${formatFixed(report.pressure, 2, '0.00')} / ${dominant} / ${report.dominantLimiter || 'headroom'}`;
}

function formatLowerScaleRefinement(report = lowerScaleRefinementReport) {
  if (!report || report.schema !== 'peercompute.multiscale.lower-scale-refinement.v0') return 'warming';
  const solvers = Array.isArray(report.triggeredSolvers) && report.triggeredSolvers.length > 0
    ? report.triggeredSolvers.join(',')
    : 'none';
  return `${report.status} / ${report.policy || MULTISCALE_LOWER_SCALE_REFINEMENT_POLICY} / event ${report.eventTriggerCount || 0}/${report.eventBudget || 0} / sample ${report.sampleTriggerCount || 0}/${report.sampleBudget || 0} / ${solvers}`;
}

function formatSolverSubmissionBudget(report = solverSubmissionBudgetReport) {
  if (!report || report.schema !== 'peercompute.multiscale.solver-submission-budget.v0') return 'warming';
  const admitted = Array.isArray(report.admittedSolvers) && report.admittedSolvers.length > 0
    ? report.admittedSolvers.join(',')
    : 'none';
  return `${report.status || 'budgeted'} / p ${formatFixed(report.pressure, 2, '0.00')} / q ${formatFixed(report.queuePressure, 2, '0.00')} / ${report.admittedCount ?? 0}/${report.candidateCount ?? 0} submit / max ${report.maxSubmissions ?? 0} / ${admitted}`;
}

function formatRenderBudget(report = renderBudgetReport) {
  if (!report || report.schema !== MULTISCALE_RENDER_BUDGET_SCHEMA) return 'warming';
  const applications = Object.values(report.applications || {});
  const visible = report.visibleFamilyCount ?? applications.filter((entry) => entry?.visible).length;
  const skipped = report.skippedHiddenCount ?? applications.filter((entry) => entry?.skipped).length;
  const largest = applications
    .filter((entry) => Number.isFinite(entry?.sourceCount))
    .sort((a, b) => (b.sourceCount || 0) - (a.sourceCount || 0))[0]
    || report.dominantApplication;
  const dominant = largest
    ? `${largest.family} ${largest.acceptedCount ?? 0}/${largest.sourceCount ?? 0}`
    : 'warming';
  const reuse = report.reusedCommitCount ? ` reuse ${report.reusedCommitCount}` : ' reuse 0';
  const commit = `commit ${report.visibleCommitCount ?? 0}/${report.maxVisibleCommitsPerFrame ?? 0} @${report.commitIntervalFrames ?? 1}f`;
  const overlayDataUpdate = report.overlayDataUpdate;
  const upload = overlayDataUpdate?.schema
    ? `upd ${overlayDataUpdate.partialUpdateCount ?? 0}p/${overlayDataUpdate.fullUploadCount ?? 0}f calls ${overlayDataUpdate.updateCallCount ?? 0}`
    : 'upd warming';
  const pixel = `px ${formatFixed(report.effectivePixelRatio ?? report.pixelRatioScale, 2, '1.00')}${Number.isFinite(report.effectivePixelRatio) ? 'x' : ' scale'}`;
  const dynamic = `dyn @${report.dynamicVisualIntervalFrames ?? 1}f skip ${report.dynamicVisualSkipCount ?? 0}`;
  const rescue = report.severeFrameRescue
    ? ` / rescue ${report.rescueLevel || 'high'} min ${formatFixed(report.minVisibleScale, 2, '1.00')}x`
    : ` / min ${formatFixed(report.minVisibleScale, 2, '1.00')}x`;
  return `${report.status || 'budgeted'} / p ${formatFixed(report.pressure, 2, '0.00')}${rescue} / pts ${formatFixed(report.pointScale, 2, '1.00')}x / ${pixel} / ${dynamic} / ${commit}${reuse} / ${upload} / hidden ${report.updateHiddenOverlays ? 'update' : 'skip'} / vis ${visible} skip ${skipped} / ${dominant}`;
}

function formatReadbackBudget(report = readbackBudgetReport) {
  if (!report || report.schema !== MULTISCALE_READBACK_BUDGET_SCHEMA) return 'warming';
  const backlog = report.readbackBacklogFrames ?? 0;
  const pending = report.pendingReadbacks ?? 0;
  const change = report.changed ? ` prev ${report.previousReadbackInterval}` : ' steady';
  return `${report.status || 'nominal'} / p ${formatFixed(report.pressure, 2, '0.00')} / interval ${report.readbackInterval}f${change} / pending ${pending} / backlog ${backlog} / stale ${report.staleFrameEstimate ?? report.readbackInterval}f`;
}

function formatStatePublicationBudget(report = statePublicationBudgetReport) {
  if (!report || report.schema !== MULTISCALE_STATE_PUBLICATION_BUDGET_SCHEMA) return 'warming';
  const action = report.shouldPublish ? 'publish' : 'defer';
  const age = report.framesSincePublish == null ? 'new' : `${report.framesSincePublish}f`;
  return `${report.status || action} / ${action} @${report.packetIntervalFrames ?? 1}f / age ${age} / p ${formatFixed(report.pressure, 2, '0.00')} / q ${formatFixed(report.queuePressure, 2, '0.00')} / count ${report.publishCount ?? 0} skip ${report.skippedFrameCount ?? 0} / last ${formatFixed(report.lastDurationMs, 2, '0.00')}ms`;
}

function formatRuntimeDiagnosticsBudget(report = runtimeDiagnosticsBudgetReport) {
  if (!report || report.schema !== MULTISCALE_RUNTIME_DIAGNOSTICS_BUDGET_SCHEMA) return 'warming';
  const action = report.shouldRefresh ? 'refresh' : 'cache';
  const age = report.framesSinceSnapshot == null ? 'new' : `${report.framesSinceSnapshot}f`;
  return `${report.status || action} / ${action} @${report.snapshotIntervalFrames ?? 1}f/${report.snapshotIntervalMs ?? 0}ms / age ${age} / p ${formatFixed(report.pressure, 2, '0.00')} / build ${report.snapshotBuildCount ?? 0} reuse ${report.snapshotReuseCount ?? 0} / last ${formatFixed(report.lastDurationMs, 2, '0.00')}ms`;
}

function createFramePhaseTimingReport({
  frame = 0,
  totalMs = 0,
  phases = {},
  previous = null,
  reason = 'initial'
} = {}) {
  const previousPhases = previous?.phases || {};
  const normalizedTotal = Math.max(0, Number(totalMs) || 0);
  const phaseEntries = Object.entries(phases)
    .map(([name, value]) => [name, Math.max(0, Number(value) || 0)])
    .filter(([, value]) => Number.isFinite(value));
  const normalizedPhases = {};
  let topPhase = {
    name: 'none',
    lastMs: 0,
    avgMs: 0,
    share: 0
  };
  for (const [name, lastMs] of phaseEntries) {
    const previousPhase = previousPhases[name] || {};
    const previousAvg = Number.isFinite(previousPhase.avgMs) ? previousPhase.avgMs : lastMs;
    const avgMs = previousAvg * (1 - FRAME_PHASE_TIMING_ALPHA) + lastMs * FRAME_PHASE_TIMING_ALPHA;
    const maxMs = Math.max(Number(previousPhase.maxMs) || 0, lastMs);
    const share = normalizedTotal > 0 ? lastMs / normalizedTotal : 0;
    const phase = {
      lastMs: Number(lastMs.toFixed(3)),
      avgMs: Number(avgMs.toFixed(3)),
      maxMs: Number(maxMs.toFixed(3)),
      share: Number(share.toFixed(3))
    };
    normalizedPhases[name] = phase;
    if (phase.lastMs > topPhase.lastMs) {
      topPhase = {
        name,
        lastMs: phase.lastMs,
        avgMs: phase.avgMs,
        share: phase.share
      };
    }
  }
  const previousTotalAvg = Number.isFinite(previous?.totalAvgMs) ? previous.totalAvgMs : normalizedTotal;
  const totalAvgMs = previousTotalAvg * (1 - FRAME_PHASE_TIMING_ALPHA) + normalizedTotal * FRAME_PHASE_TIMING_ALPHA;
  return {
    schema: FRAME_PHASE_TIMING_SCHEMA,
    policy: 'animation-loop-phase-timing-v0',
    reason,
    frame: Math.max(0, Math.floor(Number(frame) || 0)),
    totalMs: Number(normalizedTotal.toFixed(3)),
    totalAvgMs: Number(totalAvgMs.toFixed(3)),
    topPhase,
    phaseCount: Object.keys(normalizedPhases).length,
    phases: normalizedPhases,
    updatedAt: Date.now()
  };
}

function formatFramePhaseTiming(report = framePhaseTimingReport) {
  if (!report || report.schema !== FRAME_PHASE_TIMING_SCHEMA) return 'warming';
  const top = report.topPhase || {};
  return `${top.name || 'none'} ${formatFixed(top.lastMs, 2, '0.00')}ms / avg ${formatFixed(top.avgMs, 2, '0.00')}ms / total ${formatFixed(report.totalMs, 2, '0.00')}ms`;
}

function createScaledSolverOverrides(multiplier = solverQualityMultiplier) {
  const safeMultiplier = clampNumber(Number(multiplier) || 1, 0.25, 4);
  const baseBudget = createMultiscaleSolverBudget(computeManager, {
    computeBudget,
    overrides: computeOverrides
  });
  return {
    ...computeOverrides,
    nbodyBodies: normalizePositiveInteger(baseBudget.nbody.bodyCount * safeMultiplier * getSolverWorkloadMultiplier('nbody'), baseBudget.nbody.bodyCount, 2, 2048),
    maxwellGrid: roundSolverGrid(baseBudget.maxwell.width * Math.sqrt(safeMultiplier * getSolverWorkloadMultiplier('maxwell'))),
    cosmologySamples: normalizePositiveInteger(baseBudget.cosmologyExpansion.sampleCount * safeMultiplier * getSolverWorkloadMultiplier('cosmologyExpansion'), baseBudget.cosmologyExpansion.sampleCount, 8, 32768),
    molecularAtoms: normalizePositiveInteger(baseBudget.molecularDynamics.atomCount * safeMultiplier * getSolverWorkloadMultiplier('molecularDynamics'), baseBudget.molecularDynamics.atomCount, 3, 32768),
    quantumMaterialSamples: normalizePositiveInteger(baseBudget.quantumMaterialPotential.sampleCount * safeMultiplier * getSolverWorkloadMultiplier('quantumMaterialPotential'), baseBudget.quantumMaterialPotential.sampleCount, 16, 65536),
    sphParticles: normalizePositiveInteger(baseBudget.sphMaterial.particleCount * safeMultiplier * getSolverWorkloadMultiplier('sphMaterial'), baseBudget.sphMaterial.particleCount, 16, 4096),
    hydroGrid: roundSolverGrid(baseBudget.hydroAtmosphere.width * Math.sqrt(safeMultiplier * getSolverWorkloadMultiplier('hydroAtmosphere'))),
    radiationGrid: roundSolverGrid(baseBudget.radiationOpacity.width * Math.sqrt(safeMultiplier * getSolverWorkloadMultiplier('radiationOpacity'))),
    stellarGrid: roundSolverGrid(baseBudget.stellarFusion.width * Math.sqrt(safeMultiplier * getSolverWorkloadMultiplier('stellarFusion'))),
    magnetosphereGrid: roundSolverGrid(baseBudget.magnetospherePlasma.width * Math.sqrt(safeMultiplier * getSolverWorkloadMultiplier('magnetospherePlasma'))),
    picGrid: roundSolverGrid(baseBudget.picPlasmaPatch.gridWidth * Math.sqrt(safeMultiplier * getSolverWorkloadMultiplier('picPlasmaPatch'))),
    picParticles: normalizePositiveInteger(baseBudget.picPlasmaPatch.particleCount * safeMultiplier * getSolverWorkloadMultiplier('picPlasmaPatch'), baseBudget.picPlasmaPatch.particleCount, 8, 8192),
    relativitySamples: normalizePositiveInteger(baseBudget.relativisticCorrection.sampleCount * safeMultiplier * getSolverWorkloadMultiplier('relativisticCorrection'), baseBudget.relativisticCorrection.sampleCount, 4, 16384),
    combustionGrid: roundSolverGrid(baseBudget.combustionPlume.width * Math.sqrt(safeMultiplier * getSolverWorkloadMultiplier('combustionPlume'))),
    membraneSegments: normalizePositiveInteger(baseBudget.membraneShell.segmentCount * safeMultiplier * getSolverWorkloadMultiplier('membraneShell'), baseBudget.membraneShell.segmentCount, 8, 4096)
  };
}

function solversBusy() {
  return nbodySolverPending
    || reactiveSolverPending
    || maxwellSolverPending
    || cosmologyExpansionSolverPending
    || molecularDynamicsSolverPending
    || quantumOrbitalGridPending
    || quantumMaterialPotentialPending
    || ulgRuntimePending
    || sphMaterialSolverPending
    || hydroAtmosphereSolverPending
    || radiationOpacitySolverPending
    || stellarFusionSolverPending
    || magnetospherePlasmaSolverPending
    || picPlasmaPatchSolverPending
    || relativisticCorrectionSolverPending
    || combustionPlumeSolverPending
    || membraneShellSolverPending;
}

const singleCellReactiveFields = [
  'temperatureK',
  'pressurePa',
  'fuelFraction',
  'oxygenFraction',
  'productFraction',
  'waterLiquidFraction',
  'waterVaporFraction',
  'reactionProgress',
  'heatReleaseNorm'
];

const scalarGridFields = (fields) => fields.map((field) => ({ field, preserveMean: true }));

const solverRemapInvariantSpecs = {
  'nbody-gravity': [
    { name: 'mass', type: 'sum', field: 'masses', units: 'mass-proxy' },
    { name: 'momentumMagnitude', type: 'packed-momentum', massField: 'masses', velocityField: 'velocities', components: 3, units: 'momentum-proxy' },
    { name: 'kineticEnergy', type: 'packed-kinetic', massField: 'masses', velocityField: 'velocities', components: 3, units: 'energy-proxy' }
  ],
  'reactive-thermal-cell': [
    { name: 'fuel', type: 'sum', field: 'fuelFraction', units: 'fraction' },
    { name: 'oxygen', type: 'sum', field: 'oxygenFraction', units: 'fraction' },
    { name: 'waterLiquid', type: 'sum', field: 'waterLiquidFraction', units: 'fraction' },
    { name: 'waterVapor', type: 'sum', field: 'waterVaporFraction', units: 'fraction' },
    { name: 'heatRelease', type: 'sum', field: 'heatReleaseNorm', units: 'heat-proxy' }
  ],
  'maxwell-em': [
    { name: 'charge', type: 'sum', field: 'chargeDensity', units: 'charge-proxy' },
    { name: 'fieldEnergy', type: 'packed-vector-energy', field: 'electric', components: 3, units: 'field-energy-proxy' },
    { name: 'magneticEnergy', type: 'packed-vector-energy', field: 'magnetic', components: 3, units: 'field-energy-proxy' },
    { name: 'currentEnergy', type: 'packed-vector-energy', field: 'currentDensity', components: 3, units: 'current-proxy' }
  ],
  'cosmology-expansion': [
    { name: 'sampleCount', type: 'count', field: 'positionsX', units: 'samples' },
    { name: 'densityContrast', type: 'sum', field: 'densityContrast', units: 'density-proxy' },
    { name: 'temperature', type: 'sum', field: 'temperatureK', units: 'thermal-proxy' },
    { name: 'expansionRate', type: 'sum', field: 'expansionRateProxy', units: 'expansion-proxy' }
  ],
  'molecular-dynamics': [
    { name: 'atomCount', type: 'count', field: 'positionsX', units: 'atoms' },
    { name: 'mass', type: 'sum', field: 'massesAmu', units: 'amu' },
    { name: 'charge', type: 'sum', field: 'partialCharge', units: 'charge-proxy' },
    { name: 'momentumMagnitude', type: 'split-momentum', massField: 'massesAmu', velocityFields: ['velocitiesX', 'velocitiesY', 'velocitiesZ'], units: 'momentum-proxy' },
    { name: 'kineticEnergy', type: 'split-kinetic', massField: 'massesAmu', velocityFields: ['velocitiesX', 'velocitiesY', 'velocitiesZ'], units: 'energy-proxy' },
    { name: 'thermalEnergy', type: 'weighted-sum', valueField: 'temperatureK', weightField: 'massesAmu', units: 'thermal-proxy' }
  ],
  'sph-material': [
    { name: 'particleCount', type: 'count', field: 'temperatures', units: 'particles' },
    { name: 'mass', type: 'sum', field: 'masses', units: 'mass-proxy' },
    { name: 'momentumMagnitude', type: 'packed-momentum', massField: 'masses', velocityField: 'velocities', components: 3, units: 'momentum-proxy' },
    { name: 'kineticEnergy', type: 'packed-kinetic', massField: 'masses', velocityField: 'velocities', components: 3, units: 'energy-proxy' },
    { name: 'thermalEnergy', type: 'weighted-sum', valueField: 'temperatures', weightField: 'masses', units: 'thermal-proxy' },
    { name: 'phase', type: 'sum', field: 'phases', units: 'phase-proxy' }
  ],
  'hydro-atmosphere': [
    { name: 'columnMass', type: 'sum', field: 'columnMass', units: 'mass-proxy' },
    { name: 'momentumX', type: 'sum', field: 'momentumX', units: 'momentum-proxy' },
    { name: 'momentumY', type: 'sum', field: 'momentumY', units: 'momentum-proxy' },
    { name: 'waterInventory', type: 'sum', field: 'waterVapor', units: 'water-proxy' },
    { name: 'temperature', type: 'sum', field: 'temperatureK', units: 'thermal-proxy' }
  ],
  'radiation-opacity': [
    { name: 'radiationEnergy', type: 'sum', field: 'radiationEnergy', units: 'energy-proxy' },
    { name: 'absorbedPower', type: 'sum', field: 'absorbedPower', units: 'power-proxy' },
    { name: 'emittedPower', type: 'sum', field: 'emittedPower', units: 'power-proxy' },
    { name: 'materialTemperature', type: 'sum', field: 'materialTemperatureK', units: 'thermal-proxy' }
  ],
  'stellar-fusion': [
    { name: 'density', type: 'sum', field: 'densityKgM3', units: 'density-proxy' },
    { name: 'energyDensity', type: 'sum', field: 'energyDensity', units: 'energy-proxy' },
    { name: 'hydrogen', type: 'sum', field: 'hydrogenFraction', units: 'species-proxy' },
    { name: 'helium', type: 'sum', field: 'heliumFraction', units: 'species-proxy' },
    { name: 'fusionRate', type: 'sum', field: 'fusionRate', units: 'reaction-proxy' }
  ],
  'magnetosphere-plasma': [
    { name: 'plasmaDensity', type: 'sum', field: 'plasmaDensity', units: 'density-proxy' },
    { name: 'thermalEnergy', type: 'sum', field: 'temperatureK', units: 'thermal-proxy' },
    { name: 'magneticEnergy', type: 'split-vector-energy', fields: ['magneticX', 'magneticY', 'magneticZ'], units: 'field-energy-proxy' },
    { name: 'plasmaEnergy', type: 'sum', field: 'energyDensity', units: 'energy-proxy' },
    { name: 'ionization', type: 'sum', field: 'ionizationFraction', units: 'ionization-proxy' }
  ],
  'pic-plasma-patch': [
    { name: 'particleCount', type: 'count', field: 'positionsX', units: 'particles' },
    { name: 'particleCharge', type: 'sum', field: 'charges', units: 'charge-proxy' },
    { name: 'gridCharge', type: 'sum', field: 'chargeDensity', units: 'charge-proxy' },
    { name: 'kineticEnergy', type: 'split-kinetic', massField: 'masses', velocityFields: ['velocitiesX', 'velocitiesY'], units: 'energy-proxy' },
    { name: 'fieldEnergy', type: 'sum', field: 'fieldEnergy', units: 'field-energy-proxy' }
  ],
  'relativistic-correction': [
    { name: 'sampleCount', type: 'count', field: 'radiiAu', units: 'samples' },
    { name: 'speedFraction', type: 'sum', field: 'speedFractionC', units: 'relativity-proxy' },
    { name: 'timeDilation', type: 'sum', field: 'timeDilationFactor', units: 'relativity-proxy' },
    { name: 'redshift', type: 'sum', field: 'gravitationalRedshiftProxy', units: 'relativity-proxy' }
  ],
  'combustion-plume': [
    { name: 'fuel', type: 'sum', field: 'fuel', units: 'species-proxy' },
    { name: 'oxygen', type: 'sum', field: 'oxygenFraction', units: 'species-proxy' },
    { name: 'smoke', type: 'sum', field: 'smoke', units: 'species-proxy' },
    { name: 'water', type: 'sum', field: 'water', units: 'water-proxy' },
    { name: 'heatRelease', type: 'sum', field: 'heatRelease', units: 'heat-proxy' }
  ],
  'membrane-shell': [
    { name: 'segmentCount', type: 'count', field: 'strain', units: 'segments' },
    { name: 'stress', type: 'sum', field: 'stressPa', units: 'stress-proxy' },
    { name: 'damage', type: 'sum', field: 'damage', units: 'damage-proxy' },
    { name: 'temperature', type: 'sum', field: 'temperatureK', units: 'thermal-proxy' },
    { name: 'radialVelocity', type: 'sum', field: 'radialVelocity', units: 'momentum-proxy' }
  ]
};

function captureSolverStates() {
  return {
    nbody: nbodySolverState,
    reactiveThermal: reactiveSolverState,
    maxwell: maxwellSolverState,
    cosmologyExpansion: cosmologyExpansionSolverState,
    molecularDynamics: molecularDynamicsSolverState,
    sphMaterial: sphMaterialSolverState,
    hydroAtmosphere: hydroAtmosphereSolverState,
    radiationOpacity: radiationOpacitySolverState,
    stellarFusion: stellarFusionSolverState,
    magnetospherePlasma: magnetospherePlasmaSolverState,
    picPlasmaPatch: picPlasmaPatchSolverState,
    relativisticCorrection: relativisticCorrectionSolverState,
    combustionPlume: combustionPlumeSolverState,
    membraneShell: membraneShellSolverState
  };
}

function copyScalarFields(previous, next, fields = []) {
  if (!previous || !next) return [];
  const stats = [];
  for (const field of fields) {
    if (!Number.isFinite(previous[field])) continue;
    next[field] = previous[field];
    stats.push({
      field,
      kind: 'scalar-copy',
      copiedRecords: 1,
      sourceRecords: 1,
      targetRecords: 1
    });
  }
  return stats;
}

function summarizeRemapWithInvariants(solverKey, previous, next, fieldStats) {
  return summarizeSolverRemap({
    solverKey,
    previous,
    next,
    fieldStats,
    invariantStats: summarizeSolverInvariants(previous, next, solverRemapInvariantSpecs[solverKey] || [])
  });
}

function remapRecordSolver(solverKey, previous, next, fields) {
  if (!previous || !next) return null;
  carrySolverTimeline(previous, next);
  const fieldStats = copyRecordFields(previous, next, fields);
  return summarizeRemapWithInvariants(solverKey, previous, next, fieldStats);
}

function remapGridSolver(solverKey, previous, next, fields, keys = {}) {
  if (!previous || !next) return null;
  carrySolverTimeline(previous, next);
  const fieldStats = remapGridFields(previous, next, fields, keys);
  return summarizeRemapWithInvariants(solverKey, previous, next, fieldStats);
}

function remapMixedSolver(solverKey, previous, next, { recordFields = [], gridFields = [], gridKeys = {} } = {}) {
  if (!previous || !next) return null;
  carrySolverTimeline(previous, next);
  const recordStats = copyRecordFields(previous, next, recordFields);
  const gridStats = remapGridFields(previous, next, gridFields, gridKeys);
  return summarizeRemapWithInvariants(solverKey, previous, next, [...recordStats, ...gridStats]);
}

function remapScalarSolver(solverKey, previous, next, fields) {
  if (!previous || !next) return null;
  carrySolverTimeline(previous, next);
  const fieldStats = copyScalarFields(previous, next, fields);
  return summarizeRemapWithInvariants(solverKey, previous, next, fieldStats);
}

function createSolverRemapReport(previousStates, reason = 'solver-workload-resize') {
  const solvers = [
    remapRecordSolver('nbody-gravity', previousStates.nbody, nbodySolverState, [
      { field: 'masses' },
      { field: 'positions', components: 3 },
      { field: 'velocities', components: 3 }
    ]),
    remapScalarSolver('reactive-thermal-cell', previousStates.reactiveThermal, reactiveSolverState, singleCellReactiveFields),
    remapGridSolver('maxwell-em', previousStates.maxwell, maxwellSolverState, [
      { field: 'electric', components: 3, preserveMean: true },
      { field: 'magnetic', components: 3, preserveMean: true },
      { field: 'chargeDensity', preserveMean: true },
      { field: 'currentDensity', components: 3, preserveMean: true }
    ]),
    remapRecordSolver('cosmology-expansion', previousStates.cosmologyExpansion, cosmologyExpansionSolverState, [
      'positionsX',
      'positionsY',
      'positionsZ',
      'densityContrast',
      'temperatureK',
      'velocityDivergence',
      'potentialProxy',
      'expansionRateProxy'
    ]),
    remapRecordSolver('molecular-dynamics', previousStates.molecularDynamics, molecularDynamicsSolverState, [
      'positionsX',
      'positionsY',
      'positionsZ',
      'velocitiesX',
      'velocitiesY',
      'velocitiesZ',
      'partialCharge',
      'temperatureK'
    ]),
    remapRecordSolver('sph-material', previousStates.sphMaterial, sphMaterialSolverState, [
      { field: 'positions', components: 3 },
      { field: 'velocities', components: 3 },
      'temperatures',
      'phases',
      'densities'
    ]),
    remapGridSolver('hydro-atmosphere', previousStates.hydroAtmosphere, hydroAtmosphereSolverState, scalarGridFields([
      'columnMass',
      'momentumX',
      'momentumY',
      'temperatureK',
      'waterVapor',
      'cloudWater',
      'precipitation',
      'terrain'
    ])),
    remapGridSolver('radiation-opacity', previousStates.radiationOpacity, radiationOpacitySolverState, scalarGridFields([
      'radiationEnergy',
      'materialTemperatureK',
      'opacity',
      'sourceStrength',
      'fluxX',
      'fluxY',
      'absorbedPower',
      'emittedPower'
    ])),
    remapGridSolver('stellar-fusion', previousStates.stellarFusion, stellarFusionSolverState, scalarGridFields([
      'temperatureK',
      'densityKgM3',
      'hydrogenFraction',
      'heliumFraction',
      'energyDensity',
      'pressurePa',
      'fusionRate',
      'neutrinoLoss'
    ])),
    remapGridSolver('magnetosphere-plasma', previousStates.magnetospherePlasma, magnetospherePlasmaSolverState, scalarGridFields([
      'plasmaDensity',
      'temperatureK',
      'velocityX',
      'velocityY',
      'magneticX',
      'magneticY',
      'magneticZ',
      'ionizationFraction',
      'pressurePa',
      'currentDensity',
      'energyDensity'
    ])),
    remapMixedSolver('pic-plasma-patch', previousStates.picPlasmaPatch, picPlasmaPatchSolverState, {
      recordFields: [
        'positionsX',
        'positionsY',
        'velocitiesX',
        'velocitiesY',
        'charges',
        'masses',
        'species',
        'escaped'
      ],
      gridFields: scalarGridFields([
        'electricX',
        'electricY',
        'magneticZ',
        'chargeDensity',
        'currentX',
        'currentY',
        'particleDensity',
        'fieldEnergy'
      ]),
      gridKeys: { widthKey: 'gridWidth', heightKey: 'gridHeight' }
    }),
    remapRecordSolver('relativistic-correction', previousStates.relativisticCorrection, relativisticCorrectionSolverState, [
      'radiiAu',
      'speedFractionC',
      'phase',
      'precessionRad',
      'potentialProxy',
      'timeDilationFactor',
      'gravitationalRedshiftProxy',
      'frameDraggingProxy'
    ]),
    remapGridSolver('combustion-plume', previousStates.combustionPlume, combustionPlumeSolverState, scalarGridFields([
      'temperatureK',
      'fuel',
      'oxygenFraction',
      'smoke',
      'water',
      'heatRelease',
      'windX',
      'windY'
    ])),
    remapMixedSolver('membrane-shell', previousStates.membraneShell, membraneShellSolverState, {
      recordFields: [
        'strain',
        'stressPa',
        'temperatureK',
        'damage',
        'radialDisplacement',
        'radialVelocity',
        'heatFluxWm2',
        'coolingFactor'
      ]
    })
  ].filter(Boolean);
  const retainedSolverCount = solvers.filter((entry) => entry.remapped).length;
  const invariantStats = solvers.flatMap((entry) => entry.invariantStats || []);
  const maxRelativeInvariantDelta = invariantStats.reduce((max, entry) => (
    Math.max(max, Math.abs(Number(entry.relativeDelta) || 0))
  ), 0);
  const maxAbsoluteInvariantDelta = invariantStats.reduce((max, entry) => (
    Math.max(max, Math.abs(Number(entry.delta) || 0))
  ), 0);
  return {
    schema: SOLVER_STATE_REMAP_SCHEMA,
    sequence: (lastSolverRemapReport.sequence || 0) + 1,
    reason,
    remappedAt: Date.now(),
    retainedSolverCount,
    invariantCount: invariantStats.length,
    maxRelativeInvariantDelta,
    maxAbsoluteInvariantDelta,
    solvers
  };
}

function compactSolverRemapReport(report = lastSolverRemapReport) {
  const solvers = (report?.solvers || []).map((entry) => {
    const fieldStats = entry.fieldStats || [];
    const invariantStats = entry.invariantStats || [];
    return {
      solverKey: entry.solverKey,
      remapped: entry.remapped === true,
      previousSequence: entry.previousSequence,
      nextSequence: entry.nextSequence,
      fieldCount: fieldStats.length,
      copiedRecords: fieldStats.reduce((sum, field) => sum + (Number(field.copiedRecords) || 0), 0),
      remappedCells: fieldStats.reduce((sum, field) => sum + (Number(field.remappedCells) || 0), 0),
      invariantCount: invariantStats.length,
      maxRelativeInvariantDelta: invariantStats.reduce((max, invariant) => (
        Math.max(max, Math.abs(Number(invariant.relativeDelta) || 0))
      ), 0),
      maxAbsoluteInvariantDelta: invariantStats.reduce((max, invariant) => (
        Math.max(max, Math.abs(Number(invariant.delta) || 0))
      ), 0),
      invariants: invariantStats.map((invariant) => ({
        name: invariant.name,
        units: invariant.units,
        delta: invariant.delta,
        relativeDelta: invariant.relativeDelta
      }))
    };
  });
  return {
    schema: report?.schema || SOLVER_STATE_REMAP_SCHEMA,
    sequence: report?.sequence || 0,
    reason: report?.reason || 'none',
    remappedAt: report?.remappedAt || 0,
    retainedSolverCount: Number.isFinite(report?.retainedSolverCount)
      ? report.retainedSolverCount
      : solvers.filter((entry) => entry.remapped).length,
    invariantCount: Number.isFinite(report?.invariantCount)
      ? report.invariantCount
      : solvers.reduce((sum, entry) => sum + entry.invariantCount, 0),
    maxRelativeInvariantDelta: Number.isFinite(report?.maxRelativeInvariantDelta)
      ? report.maxRelativeInvariantDelta
      : solvers.reduce((max, entry) => Math.max(max, entry.maxRelativeInvariantDelta), 0),
    maxAbsoluteInvariantDelta: Number.isFinite(report?.maxAbsoluteInvariantDelta)
      ? report.maxAbsoluteInvariantDelta
      : solvers.reduce((max, entry) => Math.max(max, entry.maxAbsoluteInvariantDelta), 0),
    solvers
  };
}

function resetSolverRuntimeFromBudget({ reason = 'solver-workload-resize' } = {}) {
  const previousStates = captureSolverStates();
  nbodySolverState = makeNBodyInitialState({
    count: solverBudget.nbody.bodyCount,
    seed: 20260529,
    radius: 1.8,
    centralMass: 38,
    orbitalMass: 0.8,
    gravitationalConstant: 1
  });
  nbodySolverSubmitted = 0;
  nbodySolverCompleted = 0;
  nbodySolverFailed = 0;
  nbodySolverLastError = null;
  nbodySolverLastResult = null;

  reactiveSolverState = makeReactiveThermalInitialState({
    environment: model.environment,
    coupling: {
      fireIntensity: model.state.surface.fireIntensity,
      fuelFraction: model.state.surface.fuelFraction,
      flameTemperatureK: model.state.surface.flameTemperatureK,
      waterContact: model.state.surface.waterContact,
      steamFraction: model.state.balloon.steamMassKg
    }
  });
  reactiveSolverSubmitted = 0;
  reactiveSolverCompleted = 0;
  reactiveSolverFailed = 0;
  reactiveSolverLastError = null;
  reactiveSolverLastResult = null;

  maxwellSolverState = makeMaxwellInitialState({
    width: solverBudget.maxwell.width,
    height: solverBudget.maxwell.height,
    seed: 20260529,
    amplitude: 0.32
  });
  maxwellSolverSubmitted = 0;
  maxwellSolverCompleted = 0;
  maxwellSolverFailed = 0;
  maxwellSolverLastError = null;
  maxwellSolverLastResult = null;

  cosmologyExpansionSolverState = makeCosmologyExpansionInitialState({
    sampleCount: solverBudget.cosmologyExpansion.sampleCount,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      galaxyTurbulence: model.state.galaxy.gasTurbulence,
      starFormationRate: model.state.galaxy.starFormationRate,
      maxwellFieldEnergy: model.state.galaxy.maxwell.fieldEnergy,
      poyntingFlux: model.state.galaxy.maxwell.poyntingFlux,
      relativisticLensing: model.state.solar.relativity.lensingDeflectionArcsecProxy,
      relativisticRedshift: model.state.solar.relativity.gravitationalRedshiftProxy,
      radiationPressure: model.state.solar.radiationPressure
    }
  });
  cosmologyExpansionSolverSubmitted = 0;
  cosmologyExpansionSolverCompleted = 0;
  cosmologyExpansionSolverFailed = 0;
  cosmologyExpansionSolverLastError = null;
  cosmologyExpansionSolverLastResult = null;

  molecularDynamicsSolverState = makeMolecularDynamicsInitialState({
    atomCount: countMolecularComposition(molecularComposition) || solverBudget.molecularDynamics.atomCount,
    seed: 20260529,
    environment: model.environment,
    composition: molecularComposition,
    coupling: {
      fireIntensity: model.state.surface.fireIntensity,
      waterContact: model.state.surface.waterContact,
      radiativeHeatFlux: model.state.surface.radiativeHeatFlux,
      reactionProgress: model.state.molecular.reactionProgress
    }
  });
  molecularDynamicsSolverSubmitted = 0;
  molecularDynamicsSolverCompleted = 0;
  molecularDynamicsSolverFailed = 0;
  molecularDynamicsSolverLastError = null;
  molecularDynamicsSolverLastResult = null;
  quantumOrbitalGridSubmitted = 0;
  quantumOrbitalGridCompleted = 0;
  quantumOrbitalGridFailed = 0;
  quantumOrbitalGridLastError = null;
  quantumOrbitalGridLastResult = null;
  quantumOrbitalGridLastInputKey = null;
  quantumMaterialPotentialSubmitted = 0;
  quantumMaterialPotentialCompleted = 0;
  quantumMaterialPotentialFailed = 0;
  quantumMaterialPotentialLastError = null;
  quantumMaterialPotentialLastResult = null;
  quantumMaterialPotentialLastInputKey = null;
  ulgRuntimeSubmitted = 0;
  ulgRuntimeCompleted = 0;
  ulgRuntimeFailed = 0;
  ulgRuntimeLastError = null;
  ulgRuntimeLastResult = null;
  ulgRuntimeLastInputKey = null;
  model.state.ulgRuntimeExecution = null;
  model.state.ulgRuntimeStateDelta = null;

  sphMaterialSolverState = makeSphMaterialInitialState({
    count: solverBudget.sphMaterial.particleCount,
    seed: 20260529,
    environment: model.environment
  });
  sphMaterialSolverSubmitted = 0;
  sphMaterialSolverCompleted = 0;
  sphMaterialSolverFailed = 0;
  sphMaterialSolverLastError = null;
  sphMaterialSolverLastResult = null;

  hydroAtmosphereSolverState = makeHydroAtmosphereInitialState({
    width: solverBudget.hydroAtmosphere.width,
    height: solverBudget.hydroAtmosphere.height,
    seed: 20260529,
    environment: model.environment,
    oceanHeat: model.state.planet.oceanHeat
  });
  hydroAtmosphereSolverSubmitted = 0;
  hydroAtmosphereSolverCompleted = 0;
  hydroAtmosphereSolverFailed = 0;
  hydroAtmosphereSolverLastError = null;
  hydroAtmosphereSolverLastResult = null;

  radiationOpacitySolverState = makeRadiationOpacityInitialState({
    width: solverBudget.radiationOpacity.width,
    height: solverBudget.radiationOpacity.height,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      fireIntensity: model.state.surface.fireIntensity,
      cloudCover: model.state.planet.cloudCover,
      smokeFraction: model.state.surface.smokeFraction
    }
  });
  radiationOpacitySolverSubmitted = 0;
  radiationOpacitySolverCompleted = 0;
  radiationOpacitySolverFailed = 0;
  radiationOpacitySolverLastError = null;
  radiationOpacitySolverLastResult = null;

  stellarFusionSolverState = makeStellarFusionInitialState({
    width: solverBudget.stellarFusion.width,
    height: solverBudget.stellarFusion.height,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      metallicity: model.state.galaxy.metallicity,
      radiationPressure: model.state.solar.radiationPressure,
      opacity: model.state.solar.radiationOpacity.meanOpacity
    }
  });
  stellarFusionSolverSubmitted = 0;
  stellarFusionSolverCompleted = 0;
  stellarFusionSolverFailed = 0;
  stellarFusionSolverLastError = null;
  stellarFusionSolverLastResult = null;

  magnetospherePlasmaSolverState = makeMagnetospherePlasmaInitialState({
    width: solverBudget.magnetospherePlasma.width,
    height: solverBudget.magnetospherePlasma.height,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      stellarLuminosityFactor: model.state.solar.stellarFusion.luminosityFactor,
      radiationPressure: model.state.solar.radiationPressure,
      maxwellFieldEnergy: model.state.galaxy.maxwell.fieldEnergy,
      poyntingFlux: model.state.galaxy.maxwell.poyntingFlux
    }
  });
  magnetospherePlasmaSolverSubmitted = 0;
  magnetospherePlasmaSolverCompleted = 0;
  magnetospherePlasmaSolverFailed = 0;
  magnetospherePlasmaSolverLastError = null;
  magnetospherePlasmaSolverLastResult = null;

  picPlasmaPatchSolverState = makePicPlasmaPatchInitialState({
    particleCount: solverBudget.picPlasmaPatch.particleCount,
    gridWidth: solverBudget.picPlasmaPatch.gridWidth,
    gridHeight: solverBudget.picPlasmaPatch.gridHeight,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      reconnectionRate: model.state.solar.magnetosphere.reconnectionRate,
      solarWindPressure: model.state.solar.magnetosphere.solarWindPressure,
      ionization: model.state.solar.magnetosphere.meanIonizationFraction,
      alfvenSpeed: model.state.solar.magnetosphere.alfvenSpeed,
      meanTemperatureK: model.state.solar.magnetosphere.meanTemperatureK,
      maxwellFieldEnergy: model.state.galaxy.maxwell.fieldEnergy,
      poyntingFlux: model.state.galaxy.maxwell.poyntingFlux
    }
  });
  picPlasmaPatchSolverSubmitted = 0;
  picPlasmaPatchSolverCompleted = 0;
  picPlasmaPatchSolverFailed = 0;
  picPlasmaPatchSolverLastError = null;
  picPlasmaPatchSolverLastResult = null;

  relativisticCorrectionSolverState = makeRelativisticCorrectionInitialState({
    sampleCount: solverBudget.relativisticCorrection.sampleCount,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      stellarLuminosityFactor: model.state.solar.stellarFusion.luminosityFactor,
      radiationPressure: model.state.solar.radiationPressure,
      solarWindPressure: model.state.solar.magnetosphere.solarWindPressure,
      alfvenSpeed: model.state.solar.magnetosphere.alfvenSpeed,
      maxwellFieldEnergy: model.state.galaxy.maxwell.fieldEnergy,
      poyntingFlux: model.state.galaxy.maxwell.poyntingFlux,
      picKineticEnergy: model.state.solar.picPlasmaPatch.kineticEnergy,
      picParticleEscapeFraction: model.state.solar.picPlasmaPatch.particleEscapeFraction
    }
  });
  relativisticCorrectionSolverSubmitted = 0;
  relativisticCorrectionSolverCompleted = 0;
  relativisticCorrectionSolverFailed = 0;
  relativisticCorrectionSolverLastError = null;
  relativisticCorrectionSolverLastResult = null;

  combustionPlumeSolverState = makeCombustionPlumeInitialState({
    width: solverBudget.combustionPlume.width,
    height: solverBudget.combustionPlume.height,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      fireIntensity: model.state.surface.fireIntensity,
      waterContact: model.state.surface.waterContact,
      radiativeHeatFlux: model.state.surface.radiativeHeatFlux
    }
  });
  combustionPlumeSolverSubmitted = 0;
  combustionPlumeSolverCompleted = 0;
  combustionPlumeSolverFailed = 0;
  combustionPlumeSolverLastError = null;
  combustionPlumeSolverLastResult = null;

  membraneShellSolverState = makeMembraneShellInitialState({
    segmentCount: solverBudget.membraneShell.segmentCount,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      membraneIntegrity: model.state.balloon.membraneIntegrity,
      internalPressurePa: model.state.balloon.internalPressurePa,
      waterTemperatureK: model.state.balloon.waterTemperatureK,
      steamMassKg: model.state.balloon.steamMassKg,
      waterMassKg: model.state.balloon.waterMassKg,
      fireIntensity: model.state.surface.fireIntensity,
      flameTemperatureK: model.state.surface.flameTemperatureK,
      radiativeHeatFlux: model.state.surface.radiativeHeatFlux
    }
  });
  membraneShellSolverSubmitted = 0;
  membraneShellSolverCompleted = 0;
  membraneShellSolverFailed = 0;
  membraneShellSolverLastError = null;
  membraneShellSolverLastResult = null;
  lastSolverRemapReport = createSolverRemapReport(previousStates, reason);
  solverFrame = 0;
  renderFrame = 0;
  remoteSolverPlacementRefreshSolverKeys.clear();
  updateSolverRuntimeStatus();
}

function resizeSolverWorkloads(overrides = {}, { qualityMultiplier = solverQualityMultiplier } = {}) {
  if (solversBusy()) {
    return {
      ok: false,
      reason: 'solver-pending',
      solverBudget: cloneJson(solverBudget)
    };
  }
  solverQualityMultiplier = clampNumber(Number(qualityMultiplier) || 1, 0.25, 4);
  admittedSolverBudget = createAdmittedMultiscaleSolverBudget(computeManager, {
    computeBudget,
    overrides: {
      ...createScaledSolverOverrides(solverQualityMultiplier),
      ...overrides
    }
  });
  solverBudget = admittedSolverBudget.solverBudget;
  solverAdmissionReport = admittedSolverBudget.admission;
  if (!molecularCompositionManual) {
    molecularComposition = createDefaultMolecularComposition(solverBudget.molecularDynamics.atomCount);
  } else {
    solverBudget = {
      ...solverBudget,
      molecularDynamics: {
        ...solverBudget.molecularDynamics,
        atomCount: countMolecularComposition(molecularComposition)
      }
    };
  }
  runtimeScaler.setQuality(solverQualityMultiplier);
  solverGovernorStatus = solverGovernor.setBudget(solverBudget);
  resetSolverRuntimeFromBudget({ reason: 'resizeSolverWorkloads' });
  refreshSolverLoadReport();
  refreshSolverAdmissionReport();
  renderReadout();
  return {
    ok: true,
    qualityMultiplier: solverQualityMultiplier,
    solverBudget: cloneJson(solverBudget),
    solverGovernor: cloneJson(solverGovernorStatus),
    solverWorkloadMultipliers: cloneJson(solverWorkloadMultipliers),
    solverLoad: cloneJson(solverLoadReport),
    solverAdmission: cloneJson(solverAdmissionReport),
    solverRemap: compactSolverRemapReport(lastSolverRemapReport)
  };
}

function scaleSolverQuality(direction) {
  const ladder = [0.5, 0.75, 1, 1.5, 2, 3, 4];
  const currentIndex = ladder.findIndex((value) => value >= solverQualityMultiplier - 1e-6);
  const index = currentIndex === -1 ? 2 : currentIndex;
  const nextIndex = clampNumber(index + direction, 0, ladder.length - 1);
  return resizeSolverWorkloads({}, { qualityMultiplier: ladder[nextIndex] });
}

function refreshComputeStatus() {
  const status = compute.getStatus();
  const memoryPressure = refreshMemoryPressure();
  const networkCapacity = refreshNetworkCapacity();
  const solverAdmission = refreshSolverAdmissionReport({
    memoryPressure,
    managerStats: status.peercompute?.managerCapabilities?.stats || computeManager.getStats?.() || null
  });
  const placementPlan = refreshPlacementPlan({
    memoryPressure,
    networkCapacity,
    managerStats: status.peercompute?.managerCapabilities?.stats || computeManager.getStats?.() || null
  });
  const remotePlacementReadiness = refreshRemotePlacementReadiness({
    networkCapacity,
    placementPlan,
    managerCapabilities: status.peercompute?.managerCapabilities || computeManager.getCapabilities?.() || null
  });
  const remoteSolverPlacementPolicy = refreshRemoteSolverPlacementPolicy({
    readiness: remotePlacementReadiness,
    placementPlan
  });
  readbackBudgetReport = createMultiscaleReadbackBudget({
    activeLayerId: model.activeLayer?.id || null,
    hudMode,
    runtimeScaler: runtimeScalerStatus,
    renderBudget: renderBudgetReport || refreshRenderBudget({ reason: 'compute-status' }),
    computeStatus: status,
    previousReadbackInterval: readbackBudgetReport?.readbackInterval ?? status.readbackInterval,
    reason: 'compute-status'
  });
  applyReadbackIntervalIfChanged(readbackBudgetReport, readbackBudgetReport.reason);
  const statePublicationBudget = refreshStatePublicationBudget({ reason: 'compute-status' });
  const runtimeDiagnosticsBudget = refreshRuntimeDiagnosticsBudget({ reason: 'compute-status' });
  computeStatus = {
    ...status,
    lastError: status.lastError || lastComputeStepError,
    peercompute: status.peercompute
      ? {
        ...status.peercompute,
        memoryPressure,
        networkCapacity,
        placementPlan,
        remotePlacementReadiness,
        remotePlacementConfiguration: remotePlacementConfigurationReport
          ? cloneJson(remotePlacementConfigurationReport)
          : null,
        remotePeerPlacementPlan: cloneJson(remotePeerPlacementPlan),
        remoteSolverPlacementPolicy: cloneJson(remoteSolverPlacementPolicy),
        remoteSolverPlacementDecisions: cloneJson(remoteSolverPlacementDecisionReport),
        nodeKernel: cloneJson(refreshNodeKernelStatus()),
        solverAdmission,
        lowerScaleRefinement: cloneJson(lowerScaleRefinementReport),
        solverSubmissionBudget: cloneJson(solverSubmissionBudgetReport),
        renderBudget: cloneJson(renderBudgetReport || refreshRenderBudget({ reason: 'compute-status' })),
        readbackBudget: cloneJson(readbackBudgetReport),
        statePublicationBudget: cloneJson(statePublicationBudget),
        runtimeDiagnosticsBudget: cloneJson(runtimeDiagnosticsBudget)
      }
      : status.peercompute
  };
  return computeStatus;
}

function refreshSolverBudgetFromComputeCapacity() {
  admittedSolverBudget = createAdmittedMultiscaleSolverBudget(computeManager, {
    computeBudget,
    overrides: createScaledSolverOverrides(solverQualityMultiplier)
  });
  solverBudget = admittedSolverBudget.solverBudget;
  solverAdmissionReport = admittedSolverBudget.admission;
  if (molecularCompositionManual) {
    solverBudget = {
      ...solverBudget,
      molecularDynamics: {
        ...solverBudget.molecularDynamics,
        atomCount: countMolecularComposition(molecularComposition)
      }
    };
  } else {
    molecularComposition = createDefaultMolecularComposition(solverBudget.molecularDynamics.atomCount);
  }
  solverGovernorStatus = solverGovernor.setBudget(solverBudget);
  refreshSolverLoadReport();
  refreshSolverAdmissionReport();
}

function applyComputeCapacityResize({
  reason = 'manual',
  capabilities = computeManager.getCapabilities?.()
} = {}) {
  const previousBudget = computeBudget;
  computeBudget = createMultiscaleComputeBudget(computeManager, {
    layerCount: SCALE_LAYERS.length,
    overrides: computeOverrides
  });
  refreshSolverBudgetFromComputeCapacity();
  runtimeScaler.setWorkerPolicy(computeManager.getWorkerPolicy());
  const sequence = computeCapacityResizeSequence + 1;
  computeCapacityResizeSequence = sequence;
  const resizeRecord = {
    schema: COMPUTE_CAPACITY_RESIZE_SCHEMA,
    sequence,
    reason,
    pending: true,
    previous: {
      workersPerScale: previousBudget.workersPerScale,
      totalParticleCount: previousBudget.totalParticleCount,
      plannedWorkers: previousBudget.plannedWorkers,
      managerTargetWorkers: previousBudget.managerTargetWorkers
    },
    next: {
      workersPerScale: computeBudget.workersPerScale,
      totalParticleCount: computeBudget.totalParticleCount,
      plannedWorkers: computeBudget.plannedWorkers,
      managerTargetWorkers: computeBudget.managerTargetWorkers
    },
    workerPoolRevision: capabilities?.workerPoolRevision ?? null,
    startedAt: Date.now(),
    completedAt: null,
    error: null
  };
  lastComputeCapacityResize = resizeRecord;
  computeCapacityResizePromise = compute.resizePool({
    workersPerScale: computeBudget.workersPerScale,
    totalParticleCount: computeBudget.totalParticleCount,
    computeBudget,
    reason
  })
    .then((status) => {
      if (lastComputeCapacityResize?.sequence === sequence) {
        lastComputeCapacityResize = {
          ...lastComputeCapacityResize,
          pending: false,
          completedAt: Date.now(),
          status: {
            workerCount: status.peercompute?.workerCount ?? null,
            plannedWorkers: status.peercompute?.plannedWorkers ?? null,
            plannedShardTasks: status.peercompute?.plannedShardTasks ?? null,
            activeShardCount: status.peercompute?.activeShardCount ?? null
          }
        };
      }
      refreshComputeStatus();
      renderReadout();
      return lastComputeCapacityResize;
    })
    .catch((error) => {
      if (lastComputeCapacityResize?.sequence === sequence) {
        lastComputeCapacityResize = {
          ...lastComputeCapacityResize,
          pending: false,
          completedAt: Date.now(),
          error: error instanceof Error ? error.message : String(error)
        };
      }
      lastComputeStepError = lastComputeCapacityResize?.error || lastComputeStepError;
      refreshComputeStatus();
      renderReadout();
      return lastComputeCapacityResize;
    });
  refreshComputeStatus();
  renderReadout();
  return cloneJson(lastComputeCapacityResize);
}

function applyRuntimeScalerRequest(request) {
  if (!request) return;
  if (request.action === 'scale-workers-up' || request.action === 'scale-workers-down') {
    const reason = `adaptive-runtime:${request.reason || request.action}`;
    const capabilities = computeManager.resizeWorkers(request.workerTarget, {
      reason
    });
    const computeResize = applyComputeCapacityResize({ reason, capabilities });
    runtimeScalerStatus = runtimeScaler.noteApplied({
      ...request,
      ok: true,
      workerTarget: capabilities.targetWorkers ?? request.workerTarget,
      computeResize
    });
    return;
  }

  if (request.action === 'scale-workload-up' || request.action === 'scale-workload-down') {
    const result = resizeSolverWorkloads({}, {
      qualityMultiplier: request.qualityMultiplier
    });
    runtimeScalerStatus = runtimeScaler.noteApplied({
      ...request,
      ...result,
      action: request.action
    });
    return;
  }

  if (request.action === 'scale-solver-workload-up' || request.action === 'scale-solver-workload-down') {
    const scaleResult = setSolverWorkloadMultiplier(request.solverKey, request.solverWorkloadMultiplier);
    if (!scaleResult.ok) {
      runtimeScalerStatus = runtimeScaler.noteApplied({
        ...request,
        ...scaleResult,
        action: request.action
      });
      return;
    }
    const result = resizeSolverWorkloads({}, {
      qualityMultiplier: solverQualityMultiplier
    });
    runtimeScalerStatus = runtimeScaler.noteApplied({
      ...request,
      ...result,
      ...scaleResult,
      action: request.action
    });
  }
}

function writeDefinitionRows(target, rows) {
  const fragment = document.createDocumentFragment();
  for (const [key, value] of rows) {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = key;
    dd.textContent = String(value);
    fragment.append(dt, dd);
  }
  target.replaceChildren(fragment);
}

const FOCUS_LAYER_READOUT_ROWS = new Set([
  'scale',
  'visual reference',
  'zoom continuity',
  'solver target',
  'compute',
  'environment',
  'scenario',
  'law graph',
  'ulg spec',
  'root contracts',
  'ulg runtime',
  'particle budget',
  'memory pressure',
  'remote peer',
  'remote peer plan',
  'remote reliability',
  'remote solver',
  'remote decisions',
  'solver load',
  'solver focus',
  'refinement schedule',
  'solver submit',
  'render budget',
  'readback budget',
  'state publish',
  'runtime diag',
  'hud mode',
  'runtime scaler',
  'frame phases',
  'compute resize',
  'solver remap',
  'validation',
  'refinements'
]);

const FOCUS_LAYER_READOUT_ROWS_BY_LAYER = {
  supergalactic: ['cosmology web', 'cosmology overlay', 'relativity law', 'relativity overlay'],
  galactic: ['maxwell tile', 'maxwell overlay', 'cosmology web', 'relativity law'],
  solar: ['nbody solver', 'nbody overlay', 'stellar fusion', 'stellar overlay', 'mhd plasma', 'mhd overlay', 'pic patch', 'pic overlay', 'relativity law', 'relativity overlay'],
  planet: ['hydro tile', 'hydro overlay', 'radiation tile', 'radiation overlay'],
  surface: ['reactive cell', 'sph material', 'sph overlay', 'membrane shell', 'combustion plume', 'combustion overlay'],
  mpm: ['sph material', 'sph overlay', 'combustion plume', 'combustion overlay', 'membrane shell'],
  molecular: [
    'molecular recipe', 'molecular md', 'molecular ulg', 'molecular force', 'molecular geometry', 'molecular energy', 'molecular phase', 'molecular eos',
    'molecular ledger', 'molecular balance', 'molecular equation', 'molecular transfer',
    'molecular apply', 'molecular txn', 'molecular preview', 'molecular mutators',
    'molecular preflight', 'molecular op plan', 'molecular invariants', 'molecular commit',
    'molecular dispatch', 'molecular apply val', 'molecular apply exec', 'molecular intake',
    'molecular response', 'molecular reconcile', 'molecular buffer', 'molecular buffer apply',
    'molecular qmat buffer', 'qmat deriv buffer',
    'molecular buffer accept', 'molecular buffer writeback', 'molecular buffer replay',
    'molecular buffer mutate', 'molecular buffer queue', 'molecular buffer writer',
    'molecular buffer verify', 'molecular sci gate', 'molecular sci manifest',
    'molecular bonds', 'molecular electrical', 'molecular qeq', 'qmat electronic', 'qmat barrier', 'molecular quantum', 'molecular qgrid stat', 'molecular qmat', 'qmat derivatives',
    'molecular search', 'molecular overlay', 'quantum basis', 'quantum grid',
    'quantum residual', 'quantum worker', 'quantum evolve', 'quantum qgrid stat', 'quantum radial', 'quantum closure', 'quantum material', 'quantum ensemble',
    'ulg spec', 'root contracts', 'ulg runtime'
  ],
  orbital: [
    'quantum basis', 'quantum shell', 'quantum EM', 'quantum grid',
    'quantum residual', 'quantum worker', 'quantum evolve', 'quantum qgrid stat', 'quantum radial', 'quantum closure', 'quantum material', 'quantum ensemble',
    'molecular force', 'molecular geometry', 'molecular energy', 'molecular phase', 'molecular eos', 'molecular ledger',
    'molecular balance', 'molecular equation', 'molecular transfer', 'molecular apply',
    'molecular txn', 'molecular preview', 'molecular mutators', 'molecular preflight',
    'molecular op plan', 'molecular invariants', 'molecular commit', 'molecular dispatch',
    'molecular apply val', 'molecular apply exec', 'molecular intake', 'molecular response',
    'molecular reconcile', 'molecular buffer', 'molecular buffer apply', 'molecular buffer accept',
    'molecular qmat buffer', 'qmat deriv buffer',
    'molecular buffer writeback', 'molecular buffer replay', 'molecular buffer mutate',
    'molecular buffer queue', 'molecular buffer writer', 'molecular buffer verify',
    'molecular sci gate', 'molecular sci manifest', 'molecular bonds', 'molecular electrical',
    'molecular qeq', 'qmat electronic', 'qmat barrier', 'molecular quantum', 'molecular qgrid stat', 'molecular qmat', 'qmat derivatives', 'molecular overlay', 'ulg spec', 'root contracts', 'ulg runtime'
  ]
};

function selectLayerReadoutRows(rows, layerId = null) {
  if (hudMode !== 'focus') return rows;
  const layerRows = FOCUS_LAYER_READOUT_ROWS_BY_LAYER[layerId] || [];
  const labels = new Set(FOCUS_LAYER_READOUT_ROWS);
  for (const label of layerRows) {
    labels.add(label);
  }
  const filteredRows = rows.filter(([key]) => labels.has(key));
  if (!layerRows.length) return filteredRows;

  const leadingLabels = new Set([
    'scale',
    'visual reference',
    'zoom continuity',
    'solver target',
    'compute',
    'environment',
    'scenario'
  ]);
  const layerLabels = new Set(layerRows);
  const leadingRows = filteredRows.filter(([key]) => leadingLabels.has(key));
  const activeLayerRows = layerRows
    .map((label) => filteredRows.find(([key]) => key === label))
    .filter(Boolean);
  const trailingRows = filteredRows.filter(([key]) => !leadingLabels.has(key) && !layerLabels.has(key));
  return [...leadingRows, ...activeLayerRows, ...trailingRows];
}

function getComputeResizeConservationSource() {
  return computeStatus?.peercompute?.lastResize || null;
}

function getLawGraphExecutionEvidence() {
  return {
    solverRuntimeEvidence: updateSolverRuntimeStatus(),
    solverWarmDeltas: getSolverDeltaSummary()
  };
}

function createModelPacketWithRuntimeEvidence({ publishLawGraph = false } = {}) {
  const packet = model.createPacket({
    computeResize: getComputeResizeConservationSource(),
    ...getLawGraphExecutionEvidence()
  });
  if (publishLawGraph && stateManager.isInitialized) {
    publishLawGraphDelta(packet.lawGraph);
    publishUlgRuntimeDelta(packet.ulgRuntime);
  }
  return packet;
}

function createUiPacket() {
  const packet = createModelPacketWithRuntimeEvidence();
  return {
    ...packet,
    compute: {
      ...computeStatus,
      snapshot: scene.getOverlayStatus(),
      nbodyOverlay: scene.getNBodyOverlayStatus(),
      maxwellOverlay: scene.getMaxwellOverlayStatus(),
      cosmologyExpansionOverlay: scene.getCosmologyExpansionOverlayStatus(),
      molecularDynamicsOverlay: scene.getMolecularDynamicsOverlayStatus(),
      sphMaterialOverlay: scene.getSphMaterialOverlayStatus(),
      hydroAtmosphereOverlay: scene.getHydroAtmosphereOverlayStatus(),
      radiationOpacityOverlay: scene.getRadiationOpacityOverlayStatus(),
      stellarFusionOverlay: scene.getStellarFusionOverlayStatus(),
      magnetospherePlasmaOverlay: scene.getMagnetospherePlasmaOverlayStatus(),
      picPlasmaPatchOverlay: scene.getPicPlasmaPatchOverlayStatus(),
      relativisticCorrectionOverlay: scene.getRelativisticCorrectionOverlayStatus(),
      combustionPlumeOverlay: scene.getCombustionPlumeOverlayStatus(),
      solverBudget,
      molecularComposition: {
        composition: { ...molecularComposition },
        atomCount: countMolecularComposition(molecularComposition),
        manual: molecularCompositionManual,
        label: formatMolecularComposition()
      },
      molecularTransferApplicationConfig: model.getMolecularTransferApplicationConfig(),
      molecularTransferTransactionConfig: model.getMolecularTransferTransactionConfig(),
      molecularTargetMutationApplyConfig: model.getMolecularTargetMutationApplyConfig(),
      solverQuality: {
        multiplier: solverQualityMultiplier,
        solverWorkloadMultipliers: { ...solverWorkloadMultipliers }
      },
      solverGovernor: solverGovernorStatus,
      lowerScaleRefinement: lowerScaleRefinementReport,
      solverSubmissionBudget: solverSubmissionBudgetReport,
      statePublicationBudget: statePublicationBudgetReport,
      runtimeDiagnosticsBudget: runtimeDiagnosticsBudgetReport,
      runtimeScaler: runtimeScalerStatus,
      computeCapacityResize: lastComputeCapacityResize ? cloneJson(lastComputeCapacityResize) : null,
      solverLoad: solverLoadReport,
      solverRemap: compactSolverRemapReport(lastSolverRemapReport),
      solverRuntime: solverRuntimeStatus
    }
  };
}

function formatPacketPreview(packet = {}) {
  const aggregate = packet.upward?.aggregateState || {};
  const closures = packet.upward?.closures || {};
  const compute = packet.compute || {};
  const solverGovernor = compute.solverGovernor || solverGovernorStatus;
  const refinement = compute.lowerScaleRefinement || lowerScaleRefinementReport;
  return JSON.stringify({
    schema: PACKET_PREVIEW_SCHEMA,
    packetSchema: packet.schema || null,
    mode: 'compact-dom-preview',
    activeLayer: packet.activeLayer || model.activeLayer?.id || null,
    timeSeconds: Number(finiteNumber(packet.timeSeconds, model.time).toFixed(3)),
    modelTier: packet.modelTier || null,
    focus: {
      solverFocus: solverGovernor?.activeLayerId || model.activeLayer?.id || null,
      cadencePolicy: solverGovernor?.activeLayerPolicy || MULTISCALE_SOLVER_ACTIVE_LAYER_POLICY,
      refinementStatus: refinement?.status || 'warming',
      triggeredSolvers: Array.isArray(refinement?.triggeredSolvers) ? refinement.triggeredSolvers : []
    },
    material: {
      heatReleaseNorm: finiteNumber(closures.heatReleaseNorm, aggregate.closures?.heatReleaseNorm ?? 0),
      reactionProgress: finiteNumber(closures.reactionProgress, aggregate.closures?.reactionProgress ?? 0),
      molecularAtoms: finiteNumber(closures.molecularAtomCount, aggregate.molecularDynamics?.atomCount ?? 0),
      molecularBonds: finiteNumber(closures.molecularBondCount, aggregate.molecularDynamics?.bondCount ?? 0),
      fireIntensity: finiteNumber(aggregate.fireIntensity, model.state.surface.fireIntensity),
      waterContact: finiteNumber(aggregate.waterContact, model.state.surface.waterContact),
      sphFireContact: finiteNumber(aggregate.sphMaterial?.fireContactFraction, model.state.mpm.sphMaterial.fireContactFraction)
    },
    compute: {
      backend: compute.backend || computeStatus.backend || null,
      workers: compute.peercompute?.workerCount ?? computeStatus.peercompute?.workerCount ?? null,
      targetWorkers: compute.peercompute?.plannedWorkers ?? computeStatus.peercompute?.plannedWorkers ?? null,
      readPending: compute.readPending ?? computeStatus.readPending ?? null
    },
    downward: {
      refinementRequests: Array.isArray(packet.downward?.refinementRequests)
        ? packet.downward.refinementRequests
        : []
    }
  }, null, 2);
}

function formatComputeLine(status, overlay) {
  const readState = status.readPending ? 'read pending' : 'read ready';
  const readbackInterval = status.readbackInterval ?? status.peercompute?.readbackBudget?.readbackInterval;
  const execution = status.peercompute?.execution || 'unmanaged';
  const workerCount = status.peercompute?.workerCount ?? 0;
  const plannedWorkers = status.peercompute?.plannedWorkers ?? workerCount;
  const snapshotState = overlay.accepted
    ? `snapshot L${overlay.layerIndex + 1} ${overlay.acceptedPoints}/${overlay.capacity}`
    : `snapshot ${overlay.reason}`;
  const error = status.lastError ? ` / ${status.lastError}` : '';
  const nbody = solverRuntimeStatus.nbody?.lastResult;
  const solverLine = nbody
    ? ` / nbody ${nbody.backend} step ${nbody.sequence} drift ${nbody.conservation.relativeEnergyDrift.toExponential(2)}`
    : ' / nbody warming';
  return `compute ${status.backend} via ${execution} / workers ${workerCount}/${plannedWorkers} / ${readState} rb ${readbackInterval ?? 'n/a'}f / ${snapshotState}${solverLine}${error}`;
}

function formatFixed(value, digits = 2, fallback = 'warming') {
  return Number.isFinite(value) ? value.toFixed(digits) : fallback;
}

function formatExp(value, digits = 2, fallback = 'warming') {
  return Number.isFinite(value) ? value.toExponential(digits) : fallback;
}

function formatResizeCorrectionSummary(summary) {
  if (!summary || !(summary.correctedShardCount > 0)) return 'none';
  const beforeMomentum = formatFixed(summary.maxAbsMomentumDeltaBefore, 2, 'n/a');
  const afterMomentum = formatFixed(summary.maxAbsMomentumDeltaAfter, 2, 'n/a');
  const beforeKinetic = formatFixed(summary.maxAbsKineticEnergyDeltaBefore, 2, 'n/a');
  const afterKinetic = formatFixed(summary.maxAbsKineticEnergyDeltaAfter, 2, 'n/a');
  const beforeMass = formatFixed(
    Number.isFinite(summary.maxAbsMassProxyDeltaBefore)
      ? summary.maxAbsMassProxyDeltaBefore
      : summary.maxAbsMassProxyDelta,
    2,
    '0.00'
  );
  const afterMass = formatFixed(
    Number.isFinite(summary.maxAbsMassProxyDeltaAfter)
      ? summary.maxAbsMassProxyDeltaAfter
      : summary.maxAbsMassProxyDelta,
    2,
    '0.00'
  );
  return `${summary.appliedShardCount || 0}/${summary.correctedShardCount} applied / m ${beforeMass}->${afterMass} / p ${beforeMomentum}->${afterMomentum} / ke ${beforeKinetic}->${afterKinetic}`;
}

function sampleMemoryPressure() {
  return createMemoryPressureReport({
    performanceMemory: globalThis.performance?.memory || null,
    resourceProfile: computeManager.getResourceProfile?.() || computeBudget?.resourceProfile || {},
    computeBudget,
    nowMs: Date.now()
  });
}

function refreshMemoryPressure() {
  memoryPressureReport = sampleMemoryPressure();
  return memoryPressureReport;
}

function formatMemoryPressure(report = memoryPressureReport) {
  if (!report) return 'warming';
  const source = report.available ? 'heap' : 'unavailable';
  const used = Number.isFinite(report.usedJSHeapSizeMB) ? `${formatFixed(report.usedJSHeapSizeMB, 0, '0')}MB` : 'n/a';
  const budget = Number.isFinite(report.memoryBudgetMB) && report.memoryBudgetMB > 0
    ? `${formatFixed(report.memoryBudgetMB, 0, '0')}MB`
    : 'n/a';
  return `${report.level || 'nominal'} / ${source} ${used}/${budget} / p ${formatFixed(report.pressure, 2, '0.00')}`;
}

function getNetworkInformationConnection() {
  return globalThis.navigator?.connection
    || globalThis.navigator?.mozConnection
    || globalThis.navigator?.webkitConnection
    || null;
}

function sampleNetworkCapacity() {
  return createNetworkCapacityReport({
    connection: getNetworkInformationConnection(),
    overrides: computeOverrides,
    computeBudget,
    managerStats: computeStatus.peercompute?.managerCapabilities?.stats || computeManager.getStats?.() || null,
    nowMs: Date.now()
  });
}

function refreshNetworkCapacity() {
  networkCapacityReport = sampleNetworkCapacity();
  return networkCapacityReport;
}

function formatNetworkCapacity(report = networkCapacityReport) {
  if (!report) return 'warming';
  const bandwidth = report.downlinkMbps > 0
    ? `${formatFixed(report.downlinkMbps, 1, '0.0')}Mbps`
    : report.effectiveType || 'unknown';
  const rtt = report.rttMs > 0 ? `${formatFixed(report.rttMs, 0, '0')}ms` : 'rtt n/a';
  const cluster = report.remoteWorkerCapacity > 0
    ? `${report.clusterNodeCount}n/${report.clusterGpuCount}g`
    : 'local';
  return `${report.placementMode || 'local-only'} / ${bandwidth} / ${rtt} / ${cluster} / score ${formatFixed(report.capacityScore, 2, '0.00')}`;
}

function samplePlacementPlan({
  memoryPressure = memoryPressureReport,
  networkCapacity = networkCapacityReport,
  managerStats = computeStatus.peercompute?.managerCapabilities?.stats || computeManager.getStats?.() || null
} = {}) {
  const loadReport = solverLoadReport || refreshSolverLoadReport();
  return createPlacementPlan({
    resourceProfile: computeManager.getResourceProfile?.() || computeBudget?.resourceProfile || {},
    workerPolicy: computeManager.getWorkerPolicy?.() || {},
    managerStats,
    solverLoad: loadReport,
    memoryPressure,
    networkCapacity,
    solverBudget,
    solverRegistry: getSolverRegistrySummary(),
    computeBudget,
    nowMs: Date.now()
  });
}

function refreshPlacementPlan(options = {}) {
  placementPlanReport = samplePlacementPlan(options);
  return placementPlanReport;
}

function hasConfigValue(config, key) {
  return Object.prototype.hasOwnProperty.call(config || {}, key);
}

function firstConfigValue(config, keys) {
  for (const key of keys) {
    if (hasConfigValue(config, key)) return { found: true, value: config[key], key };
  }
  return { found: false, value: undefined, key: null };
}

function normalizeRemotePlacementBoolean(value, fallback) {
  if (typeof value === 'boolean') return value;
  if (value == null || value === '') return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return fallback;
}

function applyPeerNetworkRuntimeOverrideConfig(config = {}) {
  if (config.clearPeerNetworkOverrides === true || config.clearOverrides === true) {
    peerNetworkRuntimeOverrides = { ...peerNetworkInitialOverrides };
    return peerNetworkRuntimeOverrides;
  }
  const next = {};
  const enabled = firstConfigValue(config, [
    'enablePeerNetwork',
    'enableNodeKernel',
    'enableMultiscaleKernel',
    'peercomputeNetwork',
    'enabled'
  ]);
  if (enabled.found) {
    next.enablePeerNetwork = normalizeRemotePlacementBoolean(
      enabled.value,
      peerNetworkRuntimeOverrides.enablePeerNetwork === true
    );
  }
  const responder = firstConfigValue(config, ['enableRemoteComputeResponder', 'remoteComputeResponder']);
  if (responder.found) {
    next.enableRemoteComputeResponder = normalizeRemotePlacementBoolean(
      responder.value,
      peerNetworkRuntimeOverrides.enableRemoteComputeResponder === true
    );
  }
  const functionTasks = firstConfigValue(config, ['allowRemoteFunctionTasks', 'remoteFunctionTasks']);
  if (functionTasks.found) {
    next.allowRemoteFunctionTasks = normalizeRemotePlacementBoolean(functionTasks.value, false);
  }
  const autoWire = firstConfigValue(config, ['autoWireRemotePlacement', 'autoWireNodeKernelPlacement']);
  if (autoWire.found) {
    next.autoWireRemotePlacement = normalizeRemotePlacementBoolean(
      autoWire.value,
      peerNetworkRuntimeOverrides.autoWireRemotePlacement !== false
    );
  }
  for (const [field, keys] of [
    ['roomId', ['peerRoomId', 'roomId', 'room']],
    ['topologyId', ['peerTopologyId', 'topologyId']],
    ['topology', ['peerTopology', 'topologyType', 'topology']],
    ['stateTopic', ['peerStateTopic', 'stateTopic']]
  ]) {
    const entry = firstConfigValue(config, keys);
    if (entry.found) {
      const value = String(entry.value || '').trim();
      if (value) next[field] = value;
    }
  }
  const timeout = firstConfigValue(config, ['remoteComputeTimeoutMs', 'nodeKernelRemoteTimeoutMs', 'timeoutMs']);
  if (timeout.found) {
    const timeoutMs = Number(timeout.value);
    if (Number.isFinite(timeoutMs)) next.remoteComputeTimeoutMs = clampNumber(Math.round(timeoutMs), 1000, 3600000);
  }
  peerNetworkRuntimeOverrides = {
    ...peerNetworkRuntimeOverrides,
    ...next
  };
  refreshRemotePeerReliabilityScopeFromOverrides({ nowMs: Date.now() });
  return peerNetworkRuntimeOverrides;
}

function createNodeKernelStatusReport(options = {}) {
  const overrides = options.overrides || peerNetworkRuntimeOverrides || {};
  const relayConfig = options.relayConfig || nodeKernelRelayConfig || {};
  const kernelStatus = options.kernelStatus || multiscaleNodeKernel?.getStatus?.() || null;
  const network = kernelStatus?.network || {};
  const remoteExecutorAttached = options.remoteExecutorAttached
    ?? Boolean(
      remotePlacementConfigurationReport?.executorId?.startsWith?.('nodekernel-network-placement:')
      || remotePlacementConfigurationReport?.executorId?.startsWith?.('nodekernel-redundant-network-placement:')
    );
  const enabled = options.enabled ?? overrides.enablePeerNetwork === true;
  const state = options.state
    || (kernelStatus?.isStarted ? 'started' : kernelStatus?.isInitialized ? 'initialized' : enabled ? 'configured' : 'disabled');
  const error = options.error || null;
  return {
    schema: MULTISCALE_NODE_KERNEL_STATUS_SCHEMA,
    sampledAtMs: Date.now(),
    enabled,
    state,
    reason: options.reason || (error ? 'error' : enabled ? 'ready-for-start' : 'disabled-by-default'),
    nodeId: kernelStatus?.nodeId || null,
    peerId: network.peerId || null,
    isInitialized: kernelStatus?.isInitialized === true,
    isStarted: kernelStatus?.isStarted === true,
    roomId: overrides.roomId || 'multiscale',
    topologyId: overrides.topologyId || 'multiscale-ladder',
    topology: overrides.topology || 'distributed',
    stateTopic: overrides.stateTopic || `pc.${overrides.topologyId || 'multiscale-ladder'}.${overrides.roomId || 'multiscale'}.state`,
    bootstrapPeerCount: normalizeBootstrapPeers(relayConfig.bootstrapPeers).length,
    peerCount: Number.isFinite(network.peerCount) ? network.peerCount : 0,
    logicalPeerCount: Number.isFinite(network.logicalPeerCount) ? network.logicalPeerCount : 0,
    activeDialedPeerCount: Number.isFinite(network.activeDialedPeerCount) ? network.activeDialedPeerCount : 0,
    connectedPeerIds: Array.isArray(kernelStatus?.connectedPeerIds) ? [...kernelStatus.connectedPeerIds] : [],
    peerCapabilities: cloneJson(kernelStatus?.peerCapabilities || {}),
    localCapabilities: cloneJson(kernelStatus?.localCapabilities || null),
    networkConnected: network.isConnected === true,
    remoteCompute: kernelStatus?.remoteCompute || {
      responderEnabled: overrides.enableRemoteComputeResponder === true,
      allowFunctionTasks: overrides.allowRemoteFunctionTasks === true,
      pendingRequestCount: 0
    },
    computeStats: kernelStatus?.compute?.stats || null,
    responderEnabled: overrides.enableRemoteComputeResponder === true,
    allowRemoteFunctionTasks: overrides.allowRemoteFunctionTasks === true,
    autoWireRemotePlacement: overrides.autoWireRemotePlacement !== false,
    remoteExecutorAttached,
    remotePlacementPeerId: getRemotePlacementOverrides().remotePlacementPeerId
      || remotePlacementConfigurationReport?.peerId
      || remotePeerPlacementPlan?.primaryPeerId
      || null,
    remoteComputeTimeoutMs: overrides.remoteComputeTimeoutMs || 30000,
    errorMessage: error ? String(error.message || error) : null
  };
}

function refreshNodeKernelStatus(options = {}) {
  nodeKernelStatusReport = createNodeKernelStatusReport(options);
  return nodeKernelStatusReport;
}

function formatNodeKernelStatus(report = nodeKernelStatusReport) {
  if (!report) return 'warming';
  const peer = report.peerId ? report.peerId.slice(0, 8) : 'peer n/a';
  const remote = report.remoteExecutorAttached ? 'remote-exec wired' : 'local-compute';
  return `${report.enabled ? report.state : 'off'} / ${peer} / peers ${report.peerCount ?? 0} / ${remote}`;
}

function getRemotePlacementOverrides() {
  return {
    ...computeOverrides,
    ...remotePlacementRuntimeOverrides
  };
}

function getRemotePeerReliabilityStorage() {
  try {
    return globalThis.localStorage || null;
  } catch {
    return null;
  }
}

function getRemotePeerReliabilityScope(overrides = peerNetworkRuntimeOverrides) {
  return createRemotePeerReliabilityScope({
    roomId: overrides?.roomId || 'multiscale',
    topologyId: overrides?.topologyId || 'multiscale-ladder',
    topology: overrides?.topology || 'distributed'
  });
}

function rebuildRemotePeerReliabilityReport({
  nowMs = Date.now(),
  persistence = remotePeerReliabilityPersistence,
  peers = remotePeerReliabilityReport?.peers || {}
} = {}) {
  remotePeerReliabilityReport = createRemotePeerReliabilityReport({
    peers,
    generatedAtMs: nowMs,
    scopeId: remotePeerReliabilityScopeId,
    storageKey: remotePeerReliabilityStorageKey,
    priorScore: remotePeerReliabilityReport?.priorScore,
    priorWeight: remotePeerReliabilityReport?.priorWeight,
    decayHalfLifeMs: remotePeerReliabilityReport?.decayHalfLifeMs,
    maxEntryAgeMs: remotePeerReliabilityReport?.maxEntryAgeMs,
    persistence
  });
  return remotePeerReliabilityReport;
}

function persistRemotePeerReliabilityReport({ reason = 'update', nowMs = Date.now() } = {}) {
  const persistence = saveRemotePeerReliabilityReportToStorage(remotePeerReliabilityReport, {
    storage: remotePeerReliabilityStorage,
    storageKey: remotePeerReliabilityStorageKey,
    scopeId: remotePeerReliabilityScopeId,
    nowMs
  });
  remotePeerReliabilityPersistence = {
    ...persistence,
    reason
  };
  return rebuildRemotePeerReliabilityReport({
    nowMs,
    persistence: remotePeerReliabilityPersistence
  });
}

function refreshRemotePeerReliabilityScopeFromOverrides({ force = false, nowMs = Date.now() } = {}) {
  const nextScopeId = getRemotePeerReliabilityScope();
  const nextStorageKey = createRemotePeerReliabilityStorageKey(nextScopeId);
  if (!force
    && nextScopeId === remotePeerReliabilityScopeId
    && nextStorageKey === remotePeerReliabilityStorageKey) {
    return remotePeerReliabilityReport;
  }
  remotePeerReliabilityScopeId = nextScopeId;
  remotePeerReliabilityStorageKey = nextStorageKey;
  const loaded = loadRemotePeerReliabilityReportFromStorage({
    storage: remotePeerReliabilityStorage,
    storageKey: remotePeerReliabilityStorageKey,
    scopeId: remotePeerReliabilityScopeId,
    nowMs
  });
  remotePeerReliabilityPersistence = loaded.persistence;
  remotePeerReliabilityReport = loaded.report;
  lastRemoteReliabilityObservationKey = null;
  return remotePeerReliabilityReport;
}

function applyRemotePlacementOverrideConfig(config = {}) {
  if (config.clearOverrides === true) {
    remotePlacementRuntimeOverrides = {};
    return getRemotePlacementOverrides();
  }
  const next = {};
  const enabled = firstConfigValue(config, ['enableRemotePlacement', 'enabled', 'remotePlacement']);
  if (enabled.found) {
    next.enableRemotePlacement = normalizeRemotePlacementBoolean(
      enabled.value,
      computeOverrides.enableRemotePlacement === true
    );
  }
  const loopback = firstConfigValue(config, [
    'enableLoopbackRemotePlacement',
    'remotePlacementLoopback',
    'loopbackExecutor'
  ]);
  if (loopback.found) {
    next.enableLoopbackRemotePlacement = normalizeRemotePlacementBoolean(
      loopback.value,
      computeOverrides.enableLoopbackRemotePlacement === true
    );
    if (next.enableLoopbackRemotePlacement) {
      next.enableRemotePlacement = true;
      next.remotePlacementPeerId = next.remotePlacementPeerId
        || remotePlacementRuntimeOverrides.remotePlacementPeerId
        || computeOverrides.remotePlacementPeerId
        || 'loopback-peer';
      next.remotePlacementExecutorMode = 'loopback';
    }
  }
  const executorMode = firstConfigValue(config, ['remotePlacementExecutorMode', 'placementExecutorMode', 'executorMode']);
  if (executorMode.found) next.remotePlacementExecutorMode = String(executorMode.value || '').trim() || undefined;
  const peerId = firstConfigValue(config, ['remotePlacementPeerId', 'remotePeerId', 'peerId']);
  if (peerId.found) next.remotePlacementPeerId = String(peerId.value || '').trim() || undefined;
  const autoSelectPeer = firstConfigValue(config, [
    'autoSelectRemotePlacementPeer',
    'remotePlacementAutoSelectPeer',
    'autoSelectRemotePeer'
  ]);
  if (autoSelectPeer.found) {
    next.autoSelectRemotePlacementPeer = normalizeRemotePlacementBoolean(
      autoSelectPeer.value,
      computeOverrides.autoSelectRemotePlacementPeer === true
    );
  }
  const balancePeers = firstConfigValue(config, [
    'balanceRemotePlacementPeers',
    'remotePlacementBalancePeers',
    'remotePeerLoadBalance'
  ]);
  if (balancePeers.found) {
    next.balanceRemotePlacementPeers = normalizeRemotePlacementBoolean(
      balancePeers.value,
      computeOverrides.balanceRemotePlacementPeers === true
    );
  }
  const balanceSeed = firstConfigValue(config, [
    'remotePlacementBalanceSeed',
    'remotePeerBalanceSeed',
    'balanceSeed'
  ]);
  if (balanceSeed.found) {
    next.remotePlacementBalanceSeed = normalizePositiveInteger(
      balanceSeed.value,
      0,
      0,
      1000000000
    );
  }
  const mode = firstConfigValue(config, ['remotePlacementMode', 'mode']);
  if (mode.found) next.remotePlacementMode = String(mode.value || '').trim() || undefined;
  const timeout = firstConfigValue(config, ['remotePlacementTimeoutMs', 'remoteComputeTimeoutMs', 'timeoutMs']);
  if (timeout.found) {
    const timeoutMs = Number(timeout.value);
    if (Number.isFinite(timeoutMs)) next.remotePlacementTimeoutMs = clampNumber(Math.round(timeoutMs), 1000, 3600000);
  }
  const primaryTimeout = firstConfigValue(config, [
    'remotePlacementPrimaryTimeoutMs',
    'remotePrimaryTimeoutMs',
    'primaryTimeoutMs'
  ]);
  if (primaryTimeout.found) {
    const timeoutMs = Number(primaryTimeout.value);
    if (Number.isFinite(timeoutMs)) next.remotePlacementPrimaryTimeoutMs = clampNumber(Math.round(timeoutMs), 250, 3600000);
  }
  const replicaTimeout = firstConfigValue(config, [
    'remotePlacementReplicaTimeoutMs',
    'remoteReplicaTimeoutMs',
    'replicaTimeoutMs'
  ]);
  if (replicaTimeout.found) {
    const timeoutMs = Number(replicaTimeout.value);
    if (Number.isFinite(timeoutMs)) next.remotePlacementReplicaTimeoutMs = clampNumber(Math.round(timeoutMs), 1000, 3600000);
  }
  const replicaPeerIds = firstConfigValue(config, [
    'remotePlacementReplicaPeerIds',
    'remoteReplicaPeerIds',
    'replicaPeerIds'
  ]);
  if (replicaPeerIds.found) {
    next.remotePlacementReplicaPeerIds = normalizeRemotePeerIdList(replicaPeerIds.value);
  }
  const targetReplicaCount = firstConfigValue(config, [
    'remotePlacementTargetReplicaCount',
    'remoteTargetReplicaCount',
    'targetReplicaCount'
  ]);
  if (targetReplicaCount.found) {
    next.remotePlacementTargetReplicaCount = normalizePositiveInteger(
      targetReplicaCount.value,
      1,
      1,
      16
    );
  }
  const quorumResultCount = firstConfigValue(config, [
    'remotePlacementQuorumResultCount',
    'remoteQuorumResultCount',
    'quorumResultCount'
  ]);
  if (quorumResultCount.found) {
    next.remotePlacementQuorumResultCount = normalizePositiveInteger(
      quorumResultCount.value,
      1,
      1,
      16
    );
  }
  remotePlacementRuntimeOverrides = {
    ...remotePlacementRuntimeOverrides,
    ...next
  };
  return getRemotePlacementOverrides();
}

function createMetadataPlacementSigner(signerId = 'multiscale-demo-metadata-signer') {
  const signer = (taskPacket) => ({
    signed: true,
    signerId,
    signature: `metadata:${taskPacket?.taskHash || 'unknown-task'}`,
    signatureAlgorithm: 'metadata-only-demo-signature'
  });
  signer.placementTaskSignerId = signerId;
  return signer;
}

function buildRemotePlacementHookConfig(config = {}) {
  const hookConfig = {};
  const clearHooks = config.clearHooks === true || config.clear === true;
  if (clearHooks) {
    return {
      placementExecutor: null,
      placementAdmission: null,
      placementTaskSigner: null,
      placementResultValidator: null
    };
  }

  const executor = firstConfigValue(config, ['placementExecutor', 'remotePlacementExecutor', 'executor']);
  if (executor.found) {
    hookConfig.placementExecutor = executor.value;
    hookConfig.placementExecutorId = config.placementExecutorId
      || config.remotePlacementExecutorId
      || config.executorId
      || undefined;
  } else if (isLoopbackRemotePlacementConfig({
    ...getRemotePlacementOverrides(),
    ...config
  })) {
    const overrides = getRemotePlacementOverrides();
    const peerId = config.remotePlacementPeerId
      || config.remotePeerId
      || config.peerId
      || overrides.remotePlacementPeerId
      || 'loopback-peer';
    const executorId = config.placementExecutorId
      || config.remotePlacementExecutorId
      || config.executorId
      || 'multiscale-loopback-placement';
    const loopbackExecutor = createLoopbackRemotePlacementExecutor({
      executorId,
      peerId
    });
    hookConfig.placementExecutor = loopbackExecutor;
    hookConfig.placementExecutorId = loopbackExecutor.placementExecutorId;
  }

  const admission = firstConfigValue(config, ['placementAdmission', 'remotePlacementAdmission', 'admission']);
  if (admission.found) {
    hookConfig.placementAdmission = admission.value;
    hookConfig.placementAdmissionId = config.placementAdmissionId
      || config.remotePlacementAdmissionId
      || config.admissionId
      || undefined;
  } else if (config.admissionPolicy && typeof config.admissionPolicy === 'object') {
    const admissionOptions = { ...config.admissionPolicy };
    const admissionPeerId = String(
      config.remotePlacementPeerId
        || config.remotePeerId
        || config.peerId
        || getRemotePlacementOverrides().remotePlacementPeerId
        || ''
    ).trim();
    hookConfig.placementAdmission = createPlacementAdmissionPolicy({
      policyId: admissionOptions.policyId || admissionOptions.id || 'multiscale-remote-placement-admission',
      trustedPeerIds: getRemotePlacementOverrides().remotePlacementPeerId
        ? [getRemotePlacementOverrides().remotePlacementPeerId]
        : [],
      ...admissionOptions,
      networkCapacity: buildRemoteAdmissionNetworkCapacity(
        admissionPeerId,
        admissionOptions.networkCapacity || networkCapacityReport || sampleNetworkCapacity()
      )
    });
    hookConfig.placementAdmissionId = hookConfig.placementAdmission.placementAdmissionId;
  }

  const signer = firstConfigValue(config, ['placementTaskSigner', 'remoteTaskSigner', 'taskSigner', 'signer']);
  if (signer.found) {
    hookConfig.placementTaskSigner = signer.value;
    hookConfig.placementTaskSignerId = config.placementTaskSignerId
      || config.remoteTaskSignerId
      || config.taskSignerId
      || config.signerId
      || undefined;
  } else if (config.metadataSigner === true || config.signingMode === 'metadata') {
    const metadataSigner = createMetadataPlacementSigner(
      config.placementTaskSignerId || config.remoteTaskSignerId || config.signerId || 'multiscale-demo-metadata-signer'
    );
    hookConfig.placementTaskSigner = metadataSigner;
    hookConfig.placementTaskSignerId = metadataSigner.placementTaskSignerId;
  }

  const resultValidator = firstConfigValue(
    config,
    ['placementResultValidator', 'remotePlacementResultValidator', 'resultValidator', 'validator']
  );
  if (resultValidator.found) {
    hookConfig.placementResultValidator = resultValidator.value;
    hookConfig.placementResultValidatorId = config.placementResultValidatorId
      || config.remotePlacementResultValidatorId
      || config.resultValidatorId
      || config.validatorId
      || undefined;
  } else if (config.quorumValidator && typeof config.quorumValidator === 'object') {
    hookConfig.placementResultValidator = createRemoteResultQuorumValidator({
      validationId: config.quorumValidator.validationId
        || config.quorumValidator.id
        || 'multiscale-remote-result-quorum',
      minReplicaCount: 1,
      minMatchingReplicas: 1,
      ...config.quorumValidator
    });
    hookConfig.placementResultValidatorId = hookConfig.placementResultValidator.placementResultValidatorId;
  }

  const timeout = firstConfigValue(config, ['placementTimeoutMs', 'remotePlacementTimeoutMs', 'timeoutMs']);
  if (timeout.found) hookConfig.placementTimeoutMs = timeout.value;
  const retryPolicy = firstConfigValue(config, ['placementRetryPolicy', 'remotePlacementRetryPolicy']);
  if (retryPolicy.found) hookConfig.placementRetryPolicy = retryPolicy.value;
  if (hasConfigValue(config, 'remoteResultVerification')) {
    hookConfig.remoteResultVerification = config.remoteResultVerification;
  }
  if (hasConfigValue(config, 'placementResultVerification')) {
    hookConfig.placementResultVerification = config.placementResultVerification;
  }
  return hookConfig;
}

function configureRemotePlacementRuntime(config = {}) {
  const previousRuntimeOverrides = remotePlacementRuntimeOverrides;
  const overrides = applyRemotePlacementOverrideConfig(config);
  const hookConfig = buildRemotePlacementHookConfig(config);
  const hasHookConfig = Object.keys(hookConfig).length > 0;
  const capabilities = hasHookConfig && typeof computeManager.configurePlacementHooks === 'function'
    ? computeManager.configurePlacementHooks(hookConfig)
    : computeManager.getCapabilities?.() || null;
  const memoryPressure = refreshMemoryPressure();
  const networkCapacity = refreshNetworkCapacity();
  const placementPlan = refreshPlacementPlan({
    memoryPressure,
    networkCapacity,
    managerStats: capabilities?.stats || computeManager.getStats?.() || null
  });
  const readiness = createRemotePlacementReadiness({
    overrides,
    networkCapacity,
    placementPlan,
    managerCapabilities: capabilities,
    nowMs: Date.now()
  });
  remotePlacementReadinessReport = readiness;
  const peerSelection = refreshRemotePeerSelectionReport({
    networkCapacity,
    managerStats: capabilities?.stats || computeManager.getStats?.() || null,
    remoteOverrides: overrides
  });
  const peerPlacementPlan = config.remotePeerPlacementPlan && typeof config.remotePeerPlacementPlan === 'object'
    ? config.remotePeerPlacementPlan
    : refreshRemotePeerPlacementPlan({
      selectionReport: peerSelection,
      remoteOverrides: overrides
    });
  remotePeerPlacementPlan = peerPlacementPlan;
  remotePlacementConfigurationReport = {
    schema: 'peercompute.multiscale.remote-placement-configuration.v0',
    configuredAtMs: Date.now(),
    hooksUpdated: hasHookConfig,
    enabled: readiness.enabled,
    requestedMode: readiness.requestedMode,
    peerId: readiness.peerId,
    replicaPeerIds: normalizeRemotePeerIdList(overrides.remotePlacementReplicaPeerIds),
    targetReplicaCount: normalizePositiveInteger(overrides.remotePlacementTargetReplicaCount, 1, 1, 16),
    quorumResultCount: normalizePositiveInteger(
      overrides.remotePlacementQuorumResultCount,
      normalizePositiveInteger(overrides.remotePlacementTargetReplicaCount, 1, 1, 16),
      1,
      16
    ),
    primaryTimeoutMs: overrides.remotePlacementPrimaryTimeoutMs || null,
    replicaTimeoutMs: overrides.remotePlacementReplicaTimeoutMs || null,
    redundantPlacementEnabled: String(readiness.executorId || '').startsWith('nodekernel-redundant-network-placement:'),
    redundantPlacementSchema: String(readiness.executorId || '').startsWith('nodekernel-redundant-network-placement:')
      ? NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA
      : null,
    executorConfigured: readiness.executorConfigured,
    executorId: readiness.executorId,
    admissionConfigured: readiness.admissionConfigured,
    admissionId: readiness.admissionId,
    signerConfigured: readiness.signerConfigured,
    signerId: readiness.signerId,
    resultValidatorConfigured: readiness.resultValidatorConfigured,
    resultValidatorId: readiness.resultValidatorId,
    loopbackEnabled: readiness.loopbackEnabled === true,
    loopbackSchema: readiness.loopbackEnabled === true ? MULTISCALE_LOOPBACK_REMOTE_PLACEMENT_SCHEMA : null,
    autoSelectRemotePlacementPeer: overrides.autoSelectRemotePlacementPeer === true,
    balanceRemotePlacementPeers: overrides.balanceRemotePlacementPeers === true,
    remotePlacementBalanceSeed: Number.isFinite(Number(overrides.remotePlacementBalanceSeed))
      ? Number(overrides.remotePlacementBalanceSeed)
      : null,
    remotePeerSelection: cloneJson(peerSelection),
    remotePeerPlacementPlan: cloneJson(peerPlacementPlan),
    dispatchReady: readiness.dispatchReady,
    reason: readiness.reason,
    reasons: [...readiness.reasons]
  };
  refreshComputeStatus();
  renderReadout();
  if (config.ephemeralRemotePlacement === true) {
    remotePlacementRuntimeOverrides = previousRuntimeOverrides;
  }
  return {
    ok: true,
    configuration: cloneJson(remotePlacementConfigurationReport),
    remotePlacementReadiness: cloneJson(remotePlacementReadinessReport),
    capabilities: cloneJson(capabilities)
  };
}

function normalizeRemotePeerIdList(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry || '').trim()).filter(Boolean);
  }
  if (value == null || value === '') return [];
  return String(value)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function buildRemotePeerCapacityMap(peerCapabilities = {}) {
  if (!peerCapabilities || typeof peerCapabilities !== 'object') return {};
  const map = {};
  for (const [peerId, capabilities] of Object.entries(peerCapabilities)) {
    const cleanPeerId = String(peerId || '').trim();
    if (!cleanPeerId || !capabilities || typeof capabilities !== 'object') continue;
    const compute = capabilities.compute && typeof capabilities.compute === 'object'
      ? capabilities.compute
      : capabilities;
    map[cleanPeerId] = {
      workerCount: compute.workerCount,
      workers: compute.workers,
      targetWorkers: compute.targetWorkers,
      remoteWorkerCapacity: compute.remoteWorkerCapacity ?? compute.targetWorkers ?? compute.workerCount,
      gpuCount: compute.gpuCount ?? (compute.gpuAvailable === true || compute.webgpuAvailable === true ? 1 : 0),
      bandwidthMbps: compute.bandwidthMbps ?? capabilities.network?.bandwidthMbps,
      downlinkMbps: compute.downlinkMbps ?? capabilities.network?.downlinkMbps,
      rttMs: compute.rttMs ?? capabilities.network?.rttMs,
      reliability: getRemotePeerReliability(remotePeerReliabilityReport, cleanPeerId)
        ?? compute.reliability
        ?? capabilities.network?.reliability
    };
  }
  return map;
}

function refreshRemotePeerReliabilityFromTaskPlacement(taskPlacement = null, nowMs = Date.now()) {
  refreshRemotePeerReliabilityScopeFromOverrides({ nowMs });
  const placement = taskPlacement?.lastRemotePlacement
    || (String(taskPlacement?.lastPlacement?.actualPlacement || '').startsWith('remote-')
      ? taskPlacement.lastPlacement
      : null);
  const observationKey = createRemotePlacementObservationKey(placement || {});
  if (placement && observationKey && observationKey !== lastRemoteReliabilityObservationKey) {
    remotePeerReliabilityReport = updateRemotePeerReliabilityFromPlacement(
      remotePeerReliabilityReport,
      placement,
      { nowMs }
    );
    persistRemotePeerReliabilityReport({
      reason: 'remote-placement-observed',
      nowMs
    });
    lastRemoteReliabilityObservationKey = observationKey;
  } else {
    rebuildRemotePeerReliabilityReport({ nowMs });
  }
  return remotePeerReliabilityReport;
}

function firstFiniteCapacityNumber(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number)) return Math.max(0, number);
  }
  return null;
}

function buildRemoteAdmissionNetworkCapacity(peerId, networkCapacity = networkCapacityReport || sampleNetworkCapacity()) {
  const cleanPeerId = String(peerId || '').trim();
  const base = networkCapacity && typeof networkCapacity === 'object' ? { ...networkCapacity } : {};
  if (!cleanPeerId) return base;
  const kernelStatus = multiscaleNodeKernel?.getStatus?.() || null;
  const peerCapacity = buildRemotePeerCapacityMap(kernelStatus?.peerCapabilities)[cleanPeerId] || {};
  const remoteWorkerCapacity = firstFiniteCapacityNumber(
    peerCapacity.remoteWorkerCapacity,
    peerCapacity.workerCount,
    peerCapacity.targetWorkers,
    base.remoteWorkerCapacity,
    base.remoteWorkers
  );
  const peerGpuCount = firstFiniteCapacityNumber(
    peerCapacity.gpuCount,
    base.peerGpuCount,
    base.gpuCount
  );
  const reliability = firstFiniteCapacityNumber(
    getRemotePeerReliability(remotePeerReliabilityReport, cleanPeerId),
    peerCapacity.reliability,
    base.reliability
  );
  return {
    ...base,
    peerId: cleanPeerId,
    ...(remoteWorkerCapacity != null
      ? {
        remoteWorkerCapacity,
        remoteWorkers: remoteWorkerCapacity
      }
      : {}),
    ...(peerGpuCount != null
      ? {
        peerGpuCount,
        gpuCount: peerGpuCount
      }
      : {}),
    ...(reliability != null
      ? {
        reliability
      }
      : {})
  };
}

function refreshRemotePeerSelectionReport({
  kernelStatus = multiscaleNodeKernel?.getStatus?.() || null,
  networkCapacity = networkCapacityReport || sampleNetworkCapacity(),
  managerStats = computeStatus.peercompute?.managerCapabilities?.stats || computeManager.getStats?.() || null,
  remoteOverrides = getRemotePlacementOverrides(),
  nowMs = Date.now()
} = {}) {
  const preferredPeerIds = normalizeRemotePeerIdList(
    remoteOverrides.preferredRemotePlacementPeerIds
      ?? remoteOverrides.remotePlacementPreferredPeerIds
      ?? remoteOverrides.preferredRemotePeerIds
  );
  refreshRemotePeerReliabilityFromTaskPlacement(managerStats?.taskPlacement, nowMs);
  const explicitPeerId = String(remoteOverrides.remotePlacementPeerId || '').trim();
  remotePeerSelectionReport = createRemotePeerSelectionReport({
    connectedPeerIds: Array.isArray(kernelStatus?.connectedPeerIds) ? kernelStatus.connectedPeerIds : [],
    localPeerId: kernelStatus?.network?.peerId || null,
    bootstrapPeers: normalizeBootstrapPeers(nodeKernelRelayConfig?.bootstrapPeers),
    networkCapacity,
    managerStats,
    trustedPeerIds: explicitPeerId ? [explicitPeerId] : [],
    preferredPeerIds,
    previousPeerId: explicitPeerId || remotePeerSelectionReport?.selectedPeerId || null,
    peerCapacity: buildRemotePeerCapacityMap(kernelStatus?.peerCapabilities),
    nowMs
  });
  return remotePeerSelectionReport;
}

function refreshRemotePeerPlacementPlan({
  selectionReport = remotePeerSelectionReport || refreshRemotePeerSelectionReport(),
  remoteOverrides = getRemotePlacementOverrides(),
  requestedPrimaryPeerId = remoteOverrides.remotePlacementPeerId,
  requestedReplicaPeerIds = remoteOverrides.remotePlacementReplicaPeerIds,
  targetReplicaCount = remoteOverrides.remotePlacementTargetReplicaCount,
  balanceSeed = Number.isFinite(Number(remoteOverrides.remotePlacementBalanceSeed))
    ? Number(remoteOverrides.remotePlacementBalanceSeed)
    : remotePeerPlacementBalanceCounter,
  nowMs = Date.now()
} = {}) {
  remotePeerPlacementPlan = createRemotePeerPlacementPlan({
    selectionReport,
    requestedPrimaryPeerId,
    requestedReplicaPeerIds,
    targetReplicaCount: normalizePositiveInteger(targetReplicaCount, 1, 1, 16),
    balanceRemotePlacementPeers: remoteOverrides.balanceRemotePlacementPeers === true,
    balanceSeed,
    nowMs
  });
  return remotePeerPlacementPlan;
}

function getAutoRemotePlacementPeerCandidate() {
  const selection = refreshRemotePeerSelectionReport();
  return selection.selectedPeerId || null;
}

function maybeAttachNodeKernelPlacementExecutor() {
  if (!multiscaleNodeKernel?.isStarted || peerNetworkRuntimeOverrides.autoWireRemotePlacement === false) {
    return { attached: false, reason: 'node-kernel-not-ready' };
  }
  let remoteOverrides = getRemotePlacementOverrides();
  if (remoteOverrides.enableRemotePlacement !== true) {
    return { attached: false, reason: 'remote-placement-disabled' };
  }
  const explicitTargetPeerId = String(remoteOverrides.remotePlacementPeerId || '').trim();
  let targetPeerId = explicitTargetPeerId;
  let autoSelectedPeerId = null;
  const requestedReplicaPeerIds = normalizeRemotePeerIdList(remoteOverrides.remotePlacementReplicaPeerIds);
  const targetReplicaCount = normalizePositiveInteger(
    remoteOverrides.remotePlacementTargetReplicaCount,
    1,
    1,
    16
  );
  const balanceRemotePlacementPeers = remoteOverrides.balanceRemotePlacementPeers === true && !explicitTargetPeerId;
  const balanceSeed = Number.isFinite(Number(remoteOverrides.remotePlacementBalanceSeed))
    ? Number(remoteOverrides.remotePlacementBalanceSeed)
    : remotePeerPlacementBalanceCounter;
  const peerSelection = refreshRemotePeerSelectionReport({ remoteOverrides });
  let placementPlan = createRemotePeerPlacementPlan({
    selectionReport: peerSelection,
    requestedPrimaryPeerId: targetPeerId,
    requestedReplicaPeerIds,
    targetReplicaCount,
    balanceRemotePlacementPeers,
    balanceSeed
  });
  remotePeerPlacementPlan = placementPlan;
  if (!targetPeerId && remoteOverrides.autoSelectRemotePlacementPeer === true) {
    autoSelectedPeerId = placementPlan.primaryPeerId;
    if (autoSelectedPeerId) {
      targetPeerId = autoSelectedPeerId;
      if (!balanceRemotePlacementPeers) {
        applyRemotePlacementOverrideConfig({ remotePlacementPeerId: autoSelectedPeerId });
        remoteOverrides = getRemotePlacementOverrides();
        placementPlan = refreshRemotePeerPlacementPlan({
          selectionReport: peerSelection,
          remoteOverrides,
          requestedPrimaryPeerId: targetPeerId,
          requestedReplicaPeerIds,
          targetReplicaCount,
          balanceSeed
        });
      }
    }
  }
  if (!targetPeerId) {
    return {
      attached: false,
      reason: remoteOverrides.autoSelectRemotePlacementPeer === true
        ? remotePeerSelectionReport?.reason || 'no-auto-peer-candidate'
        : 'missing-remote-peer',
      remotePeerSelection: cloneJson(remotePeerSelectionReport),
      remotePeerPlacementPlan: cloneJson(remotePeerPlacementPlan)
    };
  }
  if (placementPlan.primaryPeerId !== targetPeerId) {
    placementPlan = createRemotePeerPlacementPlan({
      selectionReport: remotePeerSelectionReport,
      requestedPrimaryPeerId: targetPeerId,
      requestedReplicaPeerIds,
      targetReplicaCount,
      balanceRemotePlacementPeers: false,
      balanceSeed
    });
    remotePeerPlacementPlan = placementPlan;
  }
  const replicaPeerIds = normalizeRemotePeerIdList(placementPlan.replicaPeerIds)
    .filter((peerId) => peerId !== targetPeerId)
    .slice(0, Math.max(0, targetReplicaCount - 1));
  const redundantPlacementEnabled = replicaPeerIds.length > 0;
  const resultQuorumCount = normalizePositiveInteger(
    remoteOverrides.remotePlacementQuorumResultCount,
    1 + replicaPeerIds.length,
    1,
    1 + replicaPeerIds.length
  );
  const executorId = redundantPlacementEnabled
    ? `nodekernel-redundant-network-placement:${targetPeerId}:${replicaPeerIds.join(',')}`
    : `nodekernel-network-placement:${targetPeerId}`;
  const executor = redundantPlacementEnabled
    ? multiscaleNodeKernel.createRedundantNetworkPlacementExecutor([targetPeerId, ...replicaPeerIds], {
      timeoutMs: remoteOverrides.remotePlacementTimeoutMs || peerNetworkRuntimeOverrides.remoteComputeTimeoutMs,
      primaryTimeoutMs: remoteOverrides.remotePlacementPrimaryTimeoutMs
        || remoteOverrides.remotePlacementTimeoutMs
        || peerNetworkRuntimeOverrides.remoteComputeTimeoutMs,
      replicaTimeoutMs: remoteOverrides.remotePlacementReplicaTimeoutMs
        || remoteOverrides.remotePlacementTimeoutMs
        || peerNetworkRuntimeOverrides.remoteComputeTimeoutMs,
      executorId,
      targetReplicaCount: 1 + replicaPeerIds.length
    })
    : multiscaleNodeKernel.createNetworkPlacementExecutor(targetPeerId, {
      timeoutMs: remoteOverrides.remotePlacementTimeoutMs || peerNetworkRuntimeOverrides.remoteComputeTimeoutMs,
      executorId
    });
  const configuration = configureRemotePlacementRuntime({
    enableRemotePlacement: true,
    peerId: targetPeerId,
    remotePlacementReplicaPeerIds: replicaPeerIds,
    remotePlacementTargetReplicaCount: 1 + replicaPeerIds.length,
    remotePlacementQuorumResultCount: resultQuorumCount,
    balanceRemotePlacementPeers: remoteOverrides.balanceRemotePlacementPeers === true,
    remotePeerPlacementPlan: placementPlan,
    ephemeralRemotePlacement: balanceRemotePlacementPeers,
    mode: remoteOverrides.remotePlacementMode || 'peer',
    timeoutMs: remoteOverrides.remotePlacementTimeoutMs || peerNetworkRuntimeOverrides.remoteComputeTimeoutMs,
    placementExecutor: executor,
    placementExecutorId: executorId,
    admissionPolicy: {
      policyId: 'multiscale-nodekernel-admission',
      allowUnknownNetwork: true,
      requireTrustedPeer: true,
      trustedPeerIds: [targetPeerId, ...replicaPeerIds],
      minRemoteWorkers: 0,
      networkCapacity: networkCapacityReport || sampleNetworkCapacity()
    },
    metadataSigner: true,
    signerId: 'multiscale-nodekernel-metadata-signer',
    quorumValidator: {
      validationId: 'multiscale-nodekernel-quorum',
      minReplicaCount: resultQuorumCount,
      minMatchingReplicas: resultQuorumCount,
      compareCommitDeltaHash: !redundantPlacementEnabled
    },
    remoteResultVerification: true
  });
  if (balanceRemotePlacementPeers) {
    remotePeerPlacementBalanceCounter += 1;
  }
  return {
    attached: true,
    reason: 'attached',
    targetPeerId,
    replicaPeerIds,
    redundantPlacementEnabled,
    redundantPlacementSchema: redundantPlacementEnabled ? NODE_KERNEL_REDUNDANT_PLACEMENT_SCHEMA : null,
    autoSelectedPeerId,
    executorId,
    configuration,
    remotePeerSelection: cloneJson(remotePeerSelectionReport),
    remotePeerPlacementPlan: cloneJson(remotePeerPlacementPlan)
  };
}

async function startPeerNetwork(config = {}) {
  applyPeerNetworkRuntimeOverrideConfig({
    enablePeerNetwork: true,
    ...config
  });
  if (multiscaleNodeKernel?.isStarted) {
    const attach = maybeAttachNodeKernelPlacementExecutor();
    const status = refreshNodeKernelStatus({
      state: 'started',
      reason: attach.attached ? 'started-remote-executor-attached' : 'started',
      remoteExecutorAttached: attach.attached || undefined
    });
    renderReadout();
    return cloneJson(status);
  }
  if (multiscaleNodeKernelStartPromise) return multiscaleNodeKernelStartPromise;

  multiscaleNodeKernelStartPromise = (async () => {
    refreshNodeKernelStatus({ enabled: true, state: 'initializing', reason: 'loading-relay-config' });
    renderReadout();
    nodeKernelRelayConfig = await loadRelayConfig({
      search: globalThis.location?.search || '',
      fetchFn: globalThis.fetch?.bind(globalThis)
    });
    const bootstrapPeers = normalizeBootstrapPeers(nodeKernelRelayConfig.bootstrapPeers);
    const node = new NodeKernel({
      bootstrapPeers,
      enablePersistence: false,
      enableWebGPU: true,
      enableWorkers: true,
      workerBootstrapURL: resolvePeerComputeWorkerBootstrapUrl(),
      transportManager: NO_FATAL_TRANSPORT_MANAGER,
      gameId: 'multiscale',
      roomId: peerNetworkRuntimeOverrides.roomId,
      topologyId: peerNetworkRuntimeOverrides.topologyId,
      topology: peerNetworkRuntimeOverrides.topology,
      stateTopic: peerNetworkRuntimeOverrides.stateTopic,
      enableRemoteComputeResponder: peerNetworkRuntimeOverrides.enableRemoteComputeResponder === true,
      allowRemoteFunctionTasks: peerNetworkRuntimeOverrides.allowRemoteFunctionTasks === true,
      remoteComputeTimeoutMs: peerNetworkRuntimeOverrides.remoteComputeTimeoutMs,
      enableNetVizSessionBroadcast: true,
      enableNetVizDebugTelemetry: true,
      debugOutput: peerNetworkRuntimeOverrides.debugOutput === true,
      ...(nodeKernelRelayConfig.pubsubType ? { pubsubType: nodeKernelRelayConfig.pubsubType } : {}),
      ...(nodeKernelRelayConfig.gossipsub ? { gossipsub: nodeKernelRelayConfig.gossipsub } : {}),
      ...(nodeKernelRelayConfig.webrtc ? { webrtc: nodeKernelRelayConfig.webrtc } : {})
    });
    multiscaleNodeKernel = node;
    refreshNodeKernelStatus({ enabled: true, state: 'initializing', reason: 'initializing-node', relayConfig: nodeKernelRelayConfig });
    renderReadout();
    await node.initialize();
    refreshNodeKernelStatus({ enabled: true, state: 'starting', reason: 'starting-network', relayConfig: nodeKernelRelayConfig });
    renderReadout();
    await node.start();
    const attach = maybeAttachNodeKernelPlacementExecutor();
    const status = refreshNodeKernelStatus({
      enabled: true,
      state: 'started',
      reason: attach.attached ? 'started-remote-executor-attached' : 'started',
      relayConfig: nodeKernelRelayConfig,
      remoteExecutorAttached: attach.attached || undefined
    });
    refreshComputeStatus();
    publishNetVizRuntimeSession(true);
    renderReadout();
    return cloneJson(status);
  })().catch((error) => {
    refreshNodeKernelStatus({
      enabled: true,
      state: 'error',
      reason: 'start-failed',
      error
    });
    renderReadout();
    throw error;
  }).finally(() => {
    multiscaleNodeKernelStartPromise = null;
  });
  return multiscaleNodeKernelStartPromise;
}

async function stopPeerNetwork(config = {}) {
  if (multiscaleNodeKernelStartPromise) {
    await multiscaleNodeKernelStartPromise.catch(() => null);
  }
  const shouldClearHooks = config.clearRemotePlacementHooks === true || config.clearHooks === true;
  const node = multiscaleNodeKernel;
  multiscaleNodeKernel = null;
  if (node?.isStarted) {
    await node.stop();
  }
  if (shouldClearHooks) {
    configureRemotePlacementRuntime({ clearHooks: true });
  }
  peerNetworkRuntimeOverrides = {
    ...peerNetworkRuntimeOverrides,
    enablePeerNetwork: false
  };
  const status = refreshNodeKernelStatus({
    enabled: false,
    state: 'stopped',
    reason: config.reason || 'stopped'
  });
  refreshComputeStatus();
  publishNetVizRuntimeSession(true);
  renderReadout();
  return cloneJson(status);
}

function sampleRemotePlacementReadiness({
  networkCapacity = networkCapacityReport,
  placementPlan = placementPlanReport,
  managerCapabilities = computeStatus.peercompute?.managerCapabilities || computeManager.getCapabilities?.() || null
} = {}) {
  const baseOverrides = getRemotePlacementOverrides();
  const activeConfiguration = remotePlacementConfigurationReport;
  const activeExecutorStillInstalled = activeConfiguration?.executorConfigured === true
    && activeConfiguration?.peerId
    && managerCapabilities?.placementExecutor === true
    && (
      !managerCapabilities?.placementExecutorId
      || !activeConfiguration?.executorId
      || managerCapabilities.placementExecutorId === activeConfiguration.executorId
    );
  const overrides = activeExecutorStillInstalled
    ? {
      ...baseOverrides,
      enableRemotePlacement: true,
      remotePlacementPeerId: activeConfiguration.peerId,
      remotePlacementMode: activeConfiguration.requestedMode || baseOverrides.remotePlacementMode,
      remotePlacementReplicaPeerIds: activeConfiguration.replicaPeerIds || baseOverrides.remotePlacementReplicaPeerIds,
      remotePlacementTargetReplicaCount: activeConfiguration.targetReplicaCount || baseOverrides.remotePlacementTargetReplicaCount,
      remotePlacementQuorumResultCount: activeConfiguration.quorumResultCount || baseOverrides.remotePlacementQuorumResultCount
    }
    : baseOverrides;
  return createRemotePlacementReadiness({
    overrides,
    networkCapacity,
    placementPlan,
    managerCapabilities,
    nowMs: Date.now()
  });
}

function refreshRemotePlacementReadiness(options = {}) {
  remotePlacementReadinessReport = sampleRemotePlacementReadiness(options);
  return remotePlacementReadinessReport;
}

function getRemoteSolverPlacementOverrides() {
  return {
    ...remoteSolverPlacementInitialOverrides,
    ...remoteSolverPlacementRuntimeOverrides
  };
}

function applyRemoteSolverPlacementOverrideConfig(config = {}) {
  if (config.clearRemoteSolverPlacementOverrides === true || config.clearOverrides === true) {
    remoteSolverPlacementRuntimeOverrides = {};
    return getRemoteSolverPlacementOverrides();
  }
  remoteSolverPlacementRuntimeOverrides = {
    ...remoteSolverPlacementRuntimeOverrides,
    ...config,
    source: config.source || 'runtime-api'
  };
  return getRemoteSolverPlacementOverrides();
}

function refreshRemoteSolverPlacementPolicy({
  readiness = remotePlacementReadinessReport,
  placementPlan = placementPlanReport,
  nowMs = Date.now()
} = {}) {
  remoteSolverPlacementPolicyReport = createRemoteSolverPlacementPolicy({
    ...getRemoteSolverPlacementOverrides(),
    readiness,
    placementPlan,
    nowMs
  });
  remoteSolverPlacementDecisionReport = createRemoteSolverPlacementDecisionReport({
    placementPlan,
    readiness,
    policy: remoteSolverPlacementPolicyReport,
    nowMs
  });
  return remoteSolverPlacementPolicyReport;
}

function refreshRemoteSolverPlacementDecisions({
  readiness = remotePlacementReadinessReport,
  placementPlan = placementPlanReport,
  policy = remoteSolverPlacementPolicyReport,
  nowMs = Date.now()
} = {}) {
  remoteSolverPlacementDecisionReport = createRemoteSolverPlacementDecisionReport({
    placementPlan,
    readiness,
    policy,
    nowMs
  });
  return remoteSolverPlacementDecisionReport;
}

function queueRemoteSolverPlacementRefreshes(decisionReport = remoteSolverPlacementDecisionReport) {
  const promotedKeys = Array.isArray(decisionReport?.promotedKeys)
    ? decisionReport.promotedKeys
    : [];
  for (const key of promotedKeys) {
    if (getSolverStepEntries().some((entry) => entry.key === key)) {
      remoteSolverPlacementRefreshSolverKeys.add(key);
    }
  }
  return promotedKeys;
}

function configureRemoteSolverPlacementRuntime(config = {}) {
  applyRemoteSolverPlacementOverrideConfig(config);
  const activeReadiness = refreshRemotePlacementReadiness();
  const nodeKernelAttach = activeReadiness.dispatchReady === true
    ? { attached: false, reason: 'remote-placement-already-ready' }
    : maybeAttachNodeKernelPlacementExecutor();
  const placementPlan = placementPlanReport || refreshPlacementPlan();
  const readiness = refreshRemotePlacementReadiness({ placementPlan });
  const policy = refreshRemoteSolverPlacementPolicy({
    readiness,
    placementPlan
  });
  const remoteSolverPlacementRefreshKeys = queueRemoteSolverPlacementRefreshes(remoteSolverPlacementDecisionReport);
  refreshComputeStatus();
  renderReadout();
  return {
    ok: true,
    policy: cloneJson(policy),
    decisions: cloneJson(remoteSolverPlacementDecisionReport),
    remotePlacementReadiness: cloneJson(readiness),
    placementPlan: cloneJson(placementPlan),
    nodeKernelAttach: cloneJson(nodeKernelAttach),
    remoteSolverPlacementRefreshKeys
  };
}

function getSolverPlacementHint(solverKey) {
  const plan = placementPlanReport || refreshPlacementPlan();
  const entry = plan?.entries?.[solverKey];
  if (!entry) return null;
  const readiness = remotePlacementReadinessReport || refreshRemotePlacementReadiness({ placementPlan: plan });
  const policy = refreshRemoteSolverPlacementPolicy({
    readiness,
    placementPlan: plan
  });
  const hint = {
    ...cloneJson(entry),
    placementPlanSchema: plan.schema,
    placementPlanSource: plan.source,
    advisoryOnly: plan.advisoryOnly !== false
  };
  return promoteSolverPlacementHint(hint, {
    solverKey,
    readiness,
    policy
  });
}

function formatPlacementPlan(report = placementPlanReport) {
  return summarizePlacementPlan(report);
}

function formatFieldAdapterPlan(report) {
  if (!report) return 'warming';
  return `${report.status || 'unknown'} / ready ${report.readyAdapterCount || 0}/${report.adapterCount || 0} / named ${report.readyNamedAdapterCount || 0} / stubs ${report.stubRequiredCount || 0} / blocked ${report.blockedAdapterCount || 0} / cons ${report.conservativeReadyCount || 0}`;
}

function formatFieldTransferReport(report) {
  if (!report) return 'warming';
  return `${report.status || 'unknown'} / exec ${report.executedTransferCount || 0}/${report.transferCount || 0} / named ${report.namedExecutedTransferCount || 0} / stubs ${report.skippedStubTransferCount || 0} / blocked ${report.blockedTransferCount || 0} / maxd ${formatFixed(report.maxAbsResidual || 0, 3, '0.000')}`;
}

function formatRemotePlacementReadiness(report = remotePlacementReadinessReport) {
  return summarizeRemotePlacementReadiness(report);
}

function formatRemotePlacementConfiguration(report = remotePlacementConfigurationReport) {
  if (!report) return 'none';
  const hooks = [
    report.executorConfigured ? 'exec' : null,
    report.admissionConfigured ? 'admit' : null,
    report.signerConfigured ? 'sign' : null,
    report.resultValidatorConfigured ? 'valid' : null,
    report.loopbackEnabled ? 'loopback' : null,
    report.redundantPlacementEnabled ? `redundant:${Math.max(1, report.targetReplicaCount || 1)}` : null
  ].filter(Boolean).join('+') || 'no-hooks';
  return `${report.hooksUpdated ? 'configured' : 'observed'} / ${hooks} / ${report.reason || 'unknown'}`;
}

function formatRemotePeerSelection(report = remotePeerSelectionReport) {
  if (!report) return 'none';
  const selected = report.selectedPeerId ? report.selectedPeerId.slice(0, 8) : 'none';
  const score = Number.isFinite(report.selectedScore) ? report.selectedScore : 0;
  return `${selected} / cand ${report.candidateCount || 0} / score ${formatFixed(score, 1, '0.0')} / ${report.reason || 'unknown'}`;
}

function formatRemotePeerPlacementPlan(report = remotePeerPlacementPlan) {
  if (!report) return 'none';
  const primary = report.primaryPeerId ? report.primaryPeerId.slice(0, 8) : 'none';
  const replicas = Array.isArray(report.replicaPeerIds) ? report.replicaPeerIds.length : 0;
  const balance = report.balanceRemotePlacementPeers ? 'balanced' : 'ranked';
  return `${primary} / repl ${replicas} / ${balance} / ${report.reason || 'unknown'}`;
}

function formatRemotePeerReliability(report = remotePeerReliabilityReport) {
  if (!report || report.schema !== MULTISCALE_REMOTE_PEER_RELIABILITY_SCHEMA) return 'none';
  const persistence = report.persistence?.status ? ` / ${report.persistence.status}` : '';
  const top = Array.isArray(report.rankedPeers) ? report.rankedPeers[0] : null;
  if (!top) return `peers 0 / attempts ${report.totalAttempts || 0}${persistence}`;
  const score = Number.isFinite(top.reliabilityScore) ? top.reliabilityScore : 0;
  return `${String(top.peerId || 'unknown').slice(0, 8)} / score ${formatFixed(score, 2, '0.00')} / ok ${top.successes || 0}/${top.attempts || 0}${persistence}`;
}

function formatRemoteSolverPlacementPolicy(report = remoteSolverPlacementPolicyReport) {
  return summarizeRemoteSolverPlacementPolicy(report);
}

function formatSolverRemapSummary(report = lastSolverRemapReport) {
  const retained = Number.isFinite(report?.retainedSolverCount)
    ? report.retainedSolverCount
    : report?.solvers?.filter((entry) => entry.remapped).length || 0;
  const invariant = Number.isFinite(report?.maxRelativeInvariantDelta)
    ? ` / inv ${formatExp(report.maxRelativeInvariantDelta, 1, '0.0e+0')}`
    : '';
  return `${report?.reason || 'none'} / ${retained} retained${invariant}`;
}

async function runLoopbackRemotePlacementProbe(config = {}) {
  await compute.initialize();
  const mode = String(config.mode || config.remotePlacementMode || 'peer').trim().toLowerCase() === 'cluster'
    ? 'cluster'
    : 'peer';
  const peerId = String(config.remotePlacementPeerId || config.peerId || 'loopback-peer').trim() || 'loopback-peer';
  const configuration = configureRemotePlacementRuntime({
    enableRemotePlacement: true,
    enableLoopbackRemotePlacement: true,
    remotePlacementPeerId: peerId,
    remotePlacementMode: mode,
    remotePlacementTimeoutMs: config.remotePlacementTimeoutMs || config.timeoutMs || 30000,
    placementExecutorId: config.placementExecutorId || 'multiscale-loopback-placement',
    metadataSigner: config.metadataSigner !== false,
    signerId: config.signerId || 'multiscale-loopback-metadata-signer',
    quorumValidator: config.quorumValidator === false
      ? undefined
      : {
        validationId: config.validationId || 'multiscale-loopback-quorum',
        minReplicaCount: 1,
        minMatchingReplicas: 1
      },
    remoteResultVerification: config.remoteResultVerification !== false,
    placementRetryPolicy: config.placementRetryPolicy || {
      maxAttempts: 1,
      baseDelayMs: 0,
      maxDelayMs: 0
    }
  });
  const stateKey = String(config.stateKey || 'loopback:cosmology:probe');
  const taskId = String(config.taskId || `solver:cosmology-expansion:loopback-probe:${Date.now()}`);
  const sampleCount = normalizePositiveInteger(config.sampleCount, 8, 8, 64);
  const deltasBefore = stateManager.getWarmDeltas(SOLVER_DELTA_SCOPE).length;
  const result = await computeManager.submitSolverTask(COSMOLOGY_EXPANSION_SOLVER_ID, {
    id: taskId,
    stateKey,
    input: {
      stateKey,
      taskId,
      reset: true,
      emitCommitDelta: true,
      dt: Number.isFinite(Number(config.dt)) ? Number(config.dt) : 0.02,
      state: makeCosmologyExpansionInitialState({
        sampleCount,
        seed: Number.isFinite(Number(config.seed)) ? Number(config.seed) : 20260530
      })
    },
    placementHint: {
      solverKey: 'cosmologyExpansion',
      solverId: COSMOLOGY_EXPANSION_SOLVER_ID,
      label: 'Cosmology expansion',
      requestedPlacement: mode,
      recommendedPlacement: mode,
      executionMode: 'non-advisory-remote',
      syncMode: 'coarse-sync',
      advisoryOnly: false,
      confidence: 0.99,
      targetReplicaCount: 1,
      coupling: 'loose',
      remoteClass: 'coarse',
      reasons: ['loopback-remote-placement-probe']
    }
  });
  refreshComputeStatus();
  renderReadout();
  const stats = computeManager.getStats?.() || {};
  const deltasAfter = stateManager.getWarmDeltas(SOLVER_DELTA_SCOPE).length;
  return {
    ok: true,
    schema: MULTISCALE_LOOPBACK_REMOTE_PLACEMENT_SCHEMA,
    mode,
    peerId,
    configuration: cloneJson(configuration),
    result: cloneJson(result),
    deltasCommitted: Math.max(0, deltasAfter - deltasBefore),
    taskPlacement: cloneJson(stats.taskPlacement?.lastPlacement || null),
    taskPlacementStats: cloneJson(stats.taskPlacement || null),
    remoteTasksCompleted: stats.remoteTasksCompleted || 0,
    remoteTaskAttempts: stats.remoteTaskAttempts || 0
  };
}

async function runLoopbackRemoteSolverPlacementProbe(config = {}) {
  await compute.initialize();
  const mode = String(config.mode || config.remotePlacementMode || 'peer').trim().toLowerCase() === 'cluster'
    ? 'cluster'
    : 'peer';
  const peerId = String(config.remotePlacementPeerId || config.peerId || 'loopback-peer').trim() || 'loopback-peer';
  const placementConfiguration = configureRemotePlacementRuntime({
    enableRemotePlacement: true,
    enableLoopbackRemotePlacement: true,
    remotePlacementPeerId: peerId,
    remotePlacementMode: mode,
    remotePlacementTimeoutMs: config.remotePlacementTimeoutMs || config.timeoutMs || 30000,
    placementExecutorId: config.placementExecutorId || 'multiscale-loopback-placement',
    metadataSigner: config.metadataSigner !== false,
    signerId: config.signerId || 'multiscale-loopback-metadata-signer',
    quorumValidator: config.quorumValidator === false
      ? undefined
      : {
        validationId: config.validationId || 'multiscale-loopback-solver-quorum',
        minReplicaCount: 1,
        minMatchingReplicas: 1
      },
    remoteResultVerification: config.remoteResultVerification !== false,
    placementRetryPolicy: config.placementRetryPolicy || {
      maxAttempts: 1,
      baseDelayMs: 0,
      maxDelayMs: 0
    }
  });
  const solverConfiguration = configureRemoteSolverPlacementRuntime({
    enabled: true,
    families: ['cosmologyExpansion'],
    mode,
    nonAdvisory: true,
    minimumConfidence: Number.isFinite(Number(config.minimumConfidence)) ? Number(config.minimumConfidence) : 0.4,
    allowLocalPlanPromotion: config.allowLocalPlanPromotion !== false,
    allowedRemoteClasses: ['coarse'],
    source: 'loopback-remote-solver-probe'
  });
  const placementHint = getSolverPlacementHint('cosmologyExpansion');
  const stateKey = String(config.stateKey || 'loopback:cosmology:policy-probe');
  const taskId = String(config.taskId || `solver:cosmology-expansion:loopback-policy-probe:${Date.now()}`);
  const sampleCount = normalizePositiveInteger(config.sampleCount, 8, 8, 64);
  const deltasBefore = stateManager.getWarmDeltas(SOLVER_DELTA_SCOPE).length;
  const result = await computeManager.submitSolverTask(COSMOLOGY_EXPANSION_SOLVER_ID, {
    id: taskId,
    stateKey,
    input: {
      stateKey,
      taskId,
      reset: true,
      emitCommitDelta: true,
      dt: Number.isFinite(Number(config.dt)) ? Number(config.dt) : 0.02,
      state: makeCosmologyExpansionInitialState({
        sampleCount,
        seed: Number.isFinite(Number(config.seed)) ? Number(config.seed) : 20260531
      })
    },
    placementHint
  });
  refreshComputeStatus();
  renderReadout();
  const stats = computeManager.getStats?.() || {};
  const deltasAfter = stateManager.getWarmDeltas(SOLVER_DELTA_SCOPE).length;
  return {
    ok: true,
    schema: 'peercompute.multiscale.loopback-remote-solver-placement-probe.v0',
    mode,
    peerId,
    placementConfiguration: cloneJson(placementConfiguration),
    solverConfiguration: cloneJson(solverConfiguration),
    placementHint: cloneJson(placementHint),
    result: cloneJson(result),
    deltasCommitted: Math.max(0, deltasAfter - deltasBefore),
    taskPlacement: cloneJson(stats.taskPlacement?.lastPlacement || null),
    taskPlacementStats: cloneJson(stats.taskPlacement || null),
    remoteTasksCompleted: stats.remoteTasksCompleted || 0,
    remoteTaskAttempts: stats.remoteTaskAttempts || 0
  };
}

async function runRemoteSolverPlacementProbe(config = {}) {
  await compute.initialize();
  const mode = String(config.mode || config.remotePlacementMode || 'peer').trim().toLowerCase() === 'cluster'
    ? 'cluster'
    : 'peer';
  const peerId = String(
    config.remotePlacementPeerId
      || config.remotePeerId
      || config.peerId
      || getRemotePlacementOverrides().remotePlacementPeerId
      || ''
  ).trim();
  if (!peerId) {
    return {
      ok: false,
      schema: MULTISCALE_REMOTE_SOLVER_PLACEMENT_PROBE_SCHEMA,
      reason: 'missing-remote-peer'
    };
  }

  let placementConfiguration = remotePlacementConfigurationReport;
  if (config.configureRemotePlacement !== false || getRemotePlacementOverrides().enableRemotePlacement !== true) {
    placementConfiguration = configureRemotePlacementRuntime({
      enableRemotePlacement: true,
      remotePlacementPeerId: peerId,
      remotePlacementMode: mode,
      remotePlacementTimeoutMs: config.remotePlacementTimeoutMs || config.timeoutMs || 30000,
      metadataSigner: config.metadataSigner !== false,
      signerId: config.signerId || 'multiscale-remote-probe-metadata-signer',
      quorumValidator: config.quorumValidator === false
        ? undefined
        : {
          validationId: config.validationId || 'multiscale-remote-probe-quorum',
          minReplicaCount: 1,
          minMatchingReplicas: 1
        },
      remoteResultVerification: config.remoteResultVerification !== false,
      placementRetryPolicy: config.placementRetryPolicy || {
        maxAttempts: 1,
        baseDelayMs: 0,
        maxDelayMs: 0
      }
    });
  }

  const attach = config.attachNodeKernelExecutor === false
    ? { attached: false, reason: 'attach-disabled' }
    : maybeAttachNodeKernelPlacementExecutor();
  const readiness = refreshRemotePlacementReadiness();
  const solverConfiguration = configureRemoteSolverPlacementRuntime({
    enabled: true,
    families: ['cosmologyExpansion'],
    mode,
    nonAdvisory: true,
    minimumConfidence: Number.isFinite(Number(config.minimumConfidence)) ? Number(config.minimumConfidence) : 0.4,
    allowLocalPlanPromotion: config.allowLocalPlanPromotion !== false,
    allowedRemoteClasses: ['coarse'],
    source: 'remote-solver-placement-probe'
  });
  const placementHint = getSolverPlacementHint('cosmologyExpansion');

  if (readiness.dispatchReady !== true || placementHint?.remoteSolverPlacement?.promoted !== true) {
    refreshComputeStatus();
    renderReadout();
    return {
      ok: false,
      schema: MULTISCALE_REMOTE_SOLVER_PLACEMENT_PROBE_SCHEMA,
      reason: readiness.dispatchReady !== true ? 'remote-placement-not-dispatch-ready' : 'solver-placement-not-promoted',
      mode,
      peerId,
      attach: cloneJson(attach),
      placementConfiguration: cloneJson(placementConfiguration),
      solverConfiguration: cloneJson(solverConfiguration),
      remotePlacementReadiness: cloneJson(readiness),
      placementHint: cloneJson(placementHint)
    };
  }

  const stateKey = String(config.stateKey || 'remote:cosmology:policy-probe');
  const taskId = String(config.taskId || `solver:cosmology-expansion:remote-policy-probe:${Date.now()}`);
  const sampleCount = normalizePositiveInteger(config.sampleCount, 8, 8, 64);
  const deltasBefore = stateManager.getWarmDeltas(SOLVER_DELTA_SCOPE).length;
  const result = await computeManager.submitSolverTask(COSMOLOGY_EXPANSION_SOLVER_ID, {
    id: taskId,
    stateKey,
    input: {
      stateKey,
      taskId,
      reset: true,
      emitCommitDelta: true,
      dt: Number.isFinite(Number(config.dt)) ? Number(config.dt) : 0.02,
      state: makeCosmologyExpansionInitialState({
        sampleCount,
        seed: Number.isFinite(Number(config.seed)) ? Number(config.seed) : 20260532
      })
    },
    placementHint
  });
  refreshComputeStatus();
  renderReadout();
  const stats = computeManager.getStats?.() || {};
  const deltasAfter = stateManager.getWarmDeltas(SOLVER_DELTA_SCOPE).length;
  return {
    ok: true,
    schema: MULTISCALE_REMOTE_SOLVER_PLACEMENT_PROBE_SCHEMA,
    mode,
    peerId,
    attach: cloneJson(attach),
    placementConfiguration: cloneJson(placementConfiguration),
    solverConfiguration: cloneJson(solverConfiguration),
    remotePlacementReadiness: cloneJson(remotePlacementReadinessReport),
    placementHint: cloneJson(placementHint),
    result: cloneJson(result),
    deltasCommitted: Math.max(0, deltasAfter - deltasBefore),
    taskPlacement: cloneJson(stats.taskPlacement?.lastPlacement || null),
    taskPlacementStats: cloneJson(stats.taskPlacement || null),
    remoteTasksCompleted: stats.remoteTasksCompleted || 0,
    remoteTaskAttempts: stats.remoteTaskAttempts || 0
  };
}

function getManagerTaskFamilyEntries(stats, limit = 6) {
  const entries = Object.entries(stats?.byTaskFamily || {})
    .filter(([, value]) => Number.isFinite(value?.submitted) && value.submitted > 0)
    .sort(([, a], [, b]) => (b.completed || 0) - (a.completed || 0))
    .slice(0, limit)
    .map(([family, value]) => ({
      family,
      submitted: value.submitted || 0,
      completed: value.completed || 0,
      failed: value.failed || 0,
      averageTaskDurationMs: Number.isFinite(value.averageTaskDurationMs)
        ? value.averageTaskDurationMs
        : Number.isFinite(value.averageDurationMs) ? value.averageDurationMs : 0,
      lastTaskDurationMs: Number.isFinite(value.lastTaskDurationMs)
        ? value.lastTaskDurationMs
        : Number.isFinite(value.lastDurationMs) ? value.lastDurationMs : 0
    }));
  return entries;
}

function formatManagerTaskFamilies(stats) {
  const entries = getManagerTaskFamilyEntries(stats, 3)
    .map((entry) => `${entry.family} ${entry.completed}/${entry.submitted}`);
  return entries.length > 0 ? entries.join(' / ') : 'warming';
}

function findBusiestExecutor(utilization) {
  if (!utilization || utilization.schema !== 'peercompute.compute.worker-utilization.v0') return null;
  const executors = [
    utilization.inline,
    ...(Array.isArray(utilization.workers) ? utilization.workers : [])
  ].filter(Boolean);
  return executors.sort((a, b) => (
    (b.activeTaskCount || 0) - (a.activeTaskCount || 0)
    || (b.completed || 0) - (a.completed || 0)
    || (b.submitted || 0) - (a.submitted || 0)
  ))[0] || null;
}

function formatWorkerUtilization(utilization) {
  if (!utilization || utilization.schema !== 'peercompute.compute.worker-utilization.v0') return 'warming';
  const summary = utilization.summary || {};
  const workerCount = summary.workerCount ?? utilization.workers?.length ?? 0;
  const activeTasks = summary.activeTaskCount ?? 0;
  const top = findBusiestExecutor(utilization);
  const inlineCompleted = utilization.inline?.completed ?? 0;
  const retired = summary.retiredWorkerCount ? ` / retired ${summary.retiredWorkerCount}` : '';
  return `busy ${activeTasks}/${workerCount}w / top ${top?.executorId || 'none'} ${top?.completed ?? 0} done / inline ${inlineCompleted}${retired}`;
}

function formatTaskPlacement(report) {
  if (!report || report.schema !== 'peercompute.compute.task-placement.v0') return 'warming';
  const actualEntries = Object.entries(report.byActualPlacement || {})
    .sort(([, a], [, b]) => (b.completed || 0) - (a.completed || 0));
  const [actualName, actualStats] = actualEntries[0] || ['none', { completed: 0 }];
  return `${report.totalCompleted}/${report.totalSubmitted} done / req L${report.localSubmitted || 0} R${report.remoteRequested || 0} / actual ${actualName} ${actualStats.completed || 0}`;
}

function formatLawGraphReport(report) {
  if (!report || report.schema !== 'peercompute.multiscale.law-graph-consistency.v0') return 'warming';
  const proxy = report.proxyConsistent ? 'proxy ok' : 'proxy blocked';
  const science = report.scientificReady ? 'sci ready' : `sci block ${report.scientificBlockingConstraintCount ?? 0}`;
  const plan = report.updatePlan
    ? `plan ${report.updatePlan.runnableOperationCount ?? 0}/${report.updatePlan.operationCount ?? 0} ops p${report.updatePlan.phaseCount ?? 0}`
    : 'plan n/a';
  const solve = report.consistencySolve
    ? `solve ${report.consistencySolve.iterationCount ?? 0}i ${report.consistencySolve.convergedProxy ? 'proxy' : 'blocked'} upd ${report.consistencySolve.proposedStateUpdateCount ?? 0}`
    : 'solve n/a';
  const admission = report.proposalAdmission
    ? `admit ${report.proposalAdmission.proxyWarmDeltaReadyCount ?? 0} warm / ${report.proposalAdmission.computeManagerDispatchReadyCount ?? 0} dispatch`
    : 'admit n/a';
  const queue = report.dispatchQueue
    ? `queue ${report.dispatchQueue.readyEntryCount ?? 0}/${report.dispatchQueue.queueEntryCount ?? 0} ready / cm ${report.dispatchQueue.computeManagerReadyCount ?? 0}`
    : 'queue n/a';
  const scheduler = report.schedulerManifest
    ? `sched ${report.schedulerManifest.schedulerReadyCount ?? 0}/${report.schedulerManifest.manifestEntryCount ?? 0} map / res ${report.schedulerManifest.resolvedDescriptorCount ?? 0}`
    : 'sched n/a';
  const execution = report.schedulerExecutionAudit
    ? `exec ${report.schedulerExecutionAudit.executionObservedCount ?? 0}/${report.schedulerExecutionAudit.executionRequiredCount ?? 0} seen / warm ${report.schedulerExecutionAudit.warmDeltaMatchedCount ?? 0}`
    : 'exec n/a';
  const resultAdmission = report.resultAdmission
    ? `result ${report.resultAdmission.proxyAdmittedCount ?? 0}/${report.resultAdmission.resultAdmissionRequiredCount ?? 0} admit`
    : 'result n/a';
  const stateApplication = report.stateApplicationPreflight
    ? `apply ${report.stateApplicationPreflight.proxyApplicationReadyCount ?? 0}/${report.stateApplicationPreflight.applicationPreflightRequiredCount ?? 0} pre`
    : 'apply n/a';
  const next = report.update?.nextRequiredStep || 'none';
  return `${report.status} / ${proxy} / ${science} / ${plan} / ${solve} / ${admission} / ${queue} / ${scheduler} / ${execution} / ${resultAdmission} / ${stateApplication} / nodes ${report.stateNodeCount ?? 0}+${report.lawNodeCount ?? 0}+${report.constraintNodeCount ?? 0} / edges ${report.edgeCount ?? 0} / next ${next}`;
}

function formatUlgRuntime(report) {
  if (!report || report.schema !== 'peercompute.ulg.runtime-manifest.v0') return 'warming';
  const passText = `passes ${report.webgpuPassCount ?? 0}/${report.passCount ?? 0} wgsl`;
  const coreText = report.requiredCorePassCount
    ? `core ${report.implementedCorePassCount ?? 0}/${report.requiredCorePassCount}`
    : 'core n/a';
  const channelText = `channels ${report.stateChannelCount ?? 0}`;
  const closureText = `closures ${report.materialClosureReadyCount ?? 0} ready/${report.scientificBlockedClosureCount ?? 0} blocked`;
  const dagText = report.passDagStatus || 'dag n/a';
  const quantumText = report.quantumTaskStatus || 'quantum n/a';
  const next = report.nextRequiredStep || 'none';
  return `${report.status} / v${report.specVersion || '?'} / ${report.liveBackendPolicy || 'backend?'} / ${passText} / ${coreText} / ${channelText} / ${closureText} / ${dagText} / ${quantumText} / next ${next}`;
}

function formatUlgSpecContracts(report) {
  if (!report || report.schema !== 'peercompute.ulg.spec-contract-report.v0') return 'warming';
  const handoff = report.handoffs?.ulgToMolecularDynamics || {};
  const bridge = report.bridgeReady ? 'bridge ready' : 'bridge partial';
  const passAudit = report.passContractAudit || {};
  const passText = passAudit.passCount
    ? `passes ${passAudit.implementedCorePassCount ?? 0}/${passAudit.requiredCorePassCount ?? 0} core ${passAudit.allPassContractsComplete ? 'ok' : 'gap'}`
    : 'passes warming';
  const checklistText = report.complianceChecklistCount
    ? `check ${report.complianceChecklistReadyCount ?? 0}/${report.complianceChecklistCount}`
    : 'check warming';
  const handoffText = handoff.applied
    ? `handoff ${handoff.appliedChannelUpdateCount ?? 0}ch ${handoff.applicationMode || 'applied'}`
    : 'handoff idle';
  return `v${report.specVersion || '?'} / ${report.status || 'unknown'} / roots ${report.activeRootContractCount ?? 0}/${report.rootContractCount ?? 0} active / ${passText} / ${checklistText} / proxy ${report.proxyRootContractCount ?? 0} / sci ${report.scientificReadyRootContractCount ?? 0} / ${bridge} / ${handoffText}`;
}

function formatUlgRootContracts(report) {
  if (!report || report.schema !== 'peercompute.ulg.spec-contract-report.v0') return 'warming';
  const active = (report.rootContracts || [])
    .filter((contract) => contract.active)
    .map((contract) => contract.label)
    .slice(0, 4)
    .join(', ');
  const blocked = (report.rootContracts || [])
    .filter((contract) => contract.blockerCount > 0)
    .map((contract) => contract.label)
    .slice(0, 3)
    .join(', ');
  const missingPasses = report.passContractAudit?.missingCorePassIds || [];
  const passGaps = missingPasses.length ? ` / pass gaps ${missingPasses.slice(0, 3).join(',')}` : '';
  return `active ${active || 'none'} / blocked ${report.blockedRootContractCount ?? 0}${blocked ? ` (${blocked})` : ''}${passGaps} / next ${report.nextRequiredStep || 'none'}`;
}

function formatUlgRuntimeExecution(report) {
  if (!report || report.schema !== 'peercompute.ulg.webgpu-execution-result.v0') return 'warming';
  const status = report.status || 'unknown';
  const backend = report.backend || 'backend?';
  const passes = `exec ${report.executedPassCount ?? 0}/${report.passCount ?? 0}`;
  const invalid = `invalid ${report.invalidLivePassCount ?? 0}`;
  const work = `work ${formatExp(report.totalWorkItems || 0, 2)}`;
  const stateDelta = report.stateDelta || model.state.ulgRuntimeStateDelta || null;
  const delta = stateDelta
    ? `delta ${stateDelta.appliedChannelUpdateCount ?? 0}/${stateDelta.channelUpdateCount ?? 0} r${Number(stateDelta.readiness ?? 0).toFixed(2)}`
    : 'delta n/a';
  const hash = String(report.evidenceHash || 'hash?').slice(0, 15);
  const webgpuStatus = report.webgpuStatus?.status || status;
  return `${status} / ${backend} / ${passes} / ${invalid} / ${work} / ${delta} / ${webgpuStatus} / ${hash}`;
}

function countPendingSolverFamilies(status = solverRuntimeStatus) {
  return Object.values(status)
    .filter((entry) => entry && typeof entry === 'object' && entry.pending)
    .length;
}

function countWarmDeltaEntries(scope) {
  return Object.keys(stateManager.getWarmDeltas(scope)).length;
}

function getClockMs() {
  return globalThis.performance?.now?.() ?? Date.now();
}

function getReadoutCadenceSnapshot(nowMs = getClockMs()) {
  return {
    schema: READOUT_CADENCE_SCHEMA,
    mode: 'throttled-automatic',
    throttleMs: READOUT_RENDER_INTERVAL_MS,
    renderCount: readoutRenderCount,
    lastRenderAgeMs: Number.isFinite(lastReadoutRenderMs)
      ? Math.max(0, nowMs - lastReadoutRenderMs)
      : null,
    runtimeDebugThrottleMs: RUNTIME_DEBUG_RENDER_INTERVAL_MS,
    runtimeDebugRenderCount,
    lastRuntimeDebugRenderAgeMs: Number.isFinite(lastRuntimeDebugRenderMs)
      ? Math.max(0, nowMs - lastRuntimeDebugRenderMs)
      : null
  };
}

function maybeRenderReadout(nowMs = getClockMs()) {
  if (Number.isFinite(lastReadoutRenderMs) && nowMs - lastReadoutRenderMs < READOUT_RENDER_INTERVAL_MS) {
    return false;
  }
  renderReadout(nowMs, { forceRuntimeDebug: false });
  return true;
}

function createRuntimeDebugSnapshot({ force = false, reason = 'runtime-debug' } = {}) {
  const nowMs = getClockMs();
  const admission = refreshRuntimeDiagnosticsBudget({ reason, force, nowMs });
  if (!admission.shouldRefresh && lastRuntimeDebugSnapshot) {
    runtimeDebugSnapshotReuseCount += 1;
    runtimeDiagnosticsBudgetReport = {
      ...refreshRuntimeDiagnosticsBudget({ reason: `${reason}-cached`, nowMs }),
      shouldRefresh: false,
      reusedThisCall: true,
      refreshedThisCall: false,
      status: admission.status || 'cached'
    };
    lastRuntimeDebugSnapshot = {
      ...lastRuntimeDebugSnapshot,
      runtimeDiagnosticsBudget: cloneJson(runtimeDiagnosticsBudgetReport),
      readout: getReadoutCadenceSnapshot(nowMs),
      hud: {
        ...(lastRuntimeDebugSnapshot.hud || {}),
        mode: hudMode,
        packetPreviewSchema: PACKET_PREVIEW_SCHEMA,
        runtimeDebugThrottleMs: RUNTIME_DEBUG_RENDER_INTERVAL_MS,
        runtimeDebugRenderCount,
        layerReadoutRowCount: lastLayerReadoutRowCount,
        layerReadoutTotalRowCount: lastLayerReadoutTotalRowCount,
        outputPanels: getOutputPanelVisibility()
      }
    };
    return lastRuntimeDebugSnapshot;
  }

  const buildStartMs = getClockMs();
  const snapshot = buildRuntimeDebugSnapshot(nowMs);
  runtimeDebugSnapshotLastDurationMs = Math.max(0, getClockMs() - buildStartMs);
  runtimeDebugSnapshotLastFrame = renderFrame;
  runtimeDebugSnapshotLastMs = nowMs;
  runtimeDebugSnapshotBuildCount += 1;
  runtimeDiagnosticsBudgetReport = {
    ...refreshRuntimeDiagnosticsBudget({ reason: `${reason}-built`, nowMs }),
    shouldRefresh: true,
    reusedThisCall: false,
    refreshedThisCall: true,
    status: admission.status || 'refreshed'
  };
  snapshot.runtimeDiagnosticsBudget = cloneJson(runtimeDiagnosticsBudgetReport);
  lastRuntimeDebugSnapshot = snapshot;
  return snapshot;
}

function buildRuntimeDebugSnapshot(nowMs = getClockMs()) {
  const managerStats = computeStatus.peercompute?.managerCapabilities?.stats || computeManager.getStats?.() || null;
  const remotePeerReliability = refreshRemotePeerReliabilityFromTaskPlacement(
    managerStats?.taskPlacement,
    Date.now()
  );
  const workerUtilization = managerStats?.workerUtilization || null;
  const workerPolicy = computeManager.getWorkerPolicy?.() || {};
  const taskFamilies = getManagerTaskFamilyEntries(managerStats, Number.POSITIVE_INFINITY);
  const topFamilies = taskFamilies.slice(0, 5);
  const loadReport = refreshSolverLoadReport();
  const memoryPressure = memoryPressureReport || refreshMemoryPressure();
  const networkCapacity = networkCapacityReport || refreshNetworkCapacity();
  const placementPlan = placementPlanReport || refreshPlacementPlan({
    memoryPressure,
    networkCapacity,
    managerStats: managerStats || null
  });
  const remotePlacementReadiness = remotePlacementReadinessReport || refreshRemotePlacementReadiness({
    networkCapacity,
    placementPlan,
    managerCapabilities: computeStatus.peercompute?.managerCapabilities || computeManager.getCapabilities?.() || null
  });
  const remotePeerSelection = refreshRemotePeerSelectionReport({
    networkCapacity,
    managerStats: managerStats || null
  });
  const remotePeerPlan = remotePlacementConfigurationReport?.remotePeerPlacementPlan
    || remotePeerPlacementPlan
    || refreshRemotePeerPlacementPlan({
      selectionReport: remotePeerSelection,
      remoteOverrides: getRemotePlacementOverrides()
    });
  const remoteSolverPlacementPolicy = remoteSolverPlacementPolicyReport || refreshRemoteSolverPlacementPolicy({
    readiness: remotePlacementReadiness,
    placementPlan
  });
  const remoteSolverPlacementDecisions = refreshRemoteSolverPlacementDecisions({
    readiness: remotePlacementReadiness,
    placementPlan,
    policy: remoteSolverPlacementPolicy
  });
  const coupling = model.estimateCoupling();
  const lawGraph = model.estimateLawGraph({
    coupling,
    ...getLawGraphExecutionEvidence()
  });
  model.state.lawGraph = lawGraph;
  model.state.lawGraphUpdatePlan = lawGraph.updatePlan || null;
  model.state.lawGraphConsistencySolve = lawGraph.consistencySolve || null;
  model.state.lawGraphProposalAdmission = lawGraph.proposalAdmission || null;
  model.state.lawGraphDispatchQueue = lawGraph.dispatchQueue || null;
  model.state.lawGraphSchedulerManifest = lawGraph.schedulerManifest || null;
  model.state.lawGraphSchedulerExecutionAudit = lawGraph.schedulerExecutionAudit || null;
  model.state.lawGraphResultAdmission = lawGraph.resultAdmission || null;
  model.state.lawGraphStateApplicationPreflight = lawGraph.stateApplicationPreflight || null;
  const ulgRuntime = model.state.ulgRuntime || null;
  const ulgRuntimeExecution = model.state.ulgRuntimeExecution || solverRuntimeStatus.ulgRuntime?.lastResult || null;
  const visualReference = scene.getVisualReferenceStatus();
  const solverAdmission = solverAdmissionReport || refreshSolverAdmissionReport({
    solverLoad: loadReport,
    memoryPressure,
    managerStats: managerStats || null
  });
  return {
    schema: RUNTIME_DEBUG_SCHEMA,
    manager: {
      workerCount: managerStats?.workerCount ?? computeStatus.peercompute?.workerCount ?? 0,
      targetWorkers: managerStats?.targetWorkers ?? computeStatus.peercompute?.plannedWorkers ?? 0,
      minWorkers: workerPolicy.minWorkers ?? 0,
      maxWorkers: workerPolicy.maxWorkers ?? 0,
      activeTasks: managerStats?.activeTaskCount ?? managerStats?.activeTasks ?? 0,
      queuedTasks: managerStats?.queuedTaskCount ?? managerStats?.queuedTasks ?? 0,
      currentLoad: managerStats?.currentLoad ?? 0,
      totalTasksSubmitted: managerStats?.totalTasksSubmitted ?? 0,
      totalTasksCompleted: managerStats?.totalTasksCompleted ?? 0,
      totalTasksFailed: managerStats?.totalTasksFailed ?? 0,
      averageTaskDurationMs: managerStats?.averageTaskDurationMs ?? 0,
      workerPoolRevision: managerStats?.workerPoolRevision ?? computeStatus.peercompute?.managerCapabilities?.workerPoolRevision ?? 0,
      lastWorkerResize: managerStats?.lastWorkerResize || computeStatus.peercompute?.managerCapabilities?.lastWorkerResize || null,
      workerAutoScaleHold: managerStats?.workerAutoScaleHold || computeStatus.peercompute?.managerCapabilities?.workerAutoScaleHold || null
    },
    workerUtilization: cloneJson(workerUtilization),
    taskPlacement: cloneJson(managerStats?.taskPlacement || null),
    taskFamilies,
    topTaskFamilies: topFamilies,
    solverLoad: {
      dominantSolver: loadReport?.dominantSolver || 'warming',
      dominantPressure: loadReport?.dominantPressure ?? 0,
      totalPressure: loadReport?.totalPressure ?? 0,
      pendingFamilies: countPendingSolverFamilies(solverRuntimeStatus)
    },
    solverGovernor: cloneJson(solverGovernorStatus),
    lowerScaleRefinement: cloneJson(lowerScaleRefinementReport),
    solverSubmissionBudget: cloneJson(solverSubmissionBudgetReport),
    visualReference: cloneJson(visualReference),
    renderBudget: cloneJson(renderBudgetReport || refreshRenderBudget({ reason: 'runtime-debug' })),
    readbackBudget: cloneJson(readbackBudgetReport || refreshReadbackBudget({ reason: 'runtime-debug' })),
    statePublicationBudget: cloneJson(statePublicationBudgetReport || refreshStatePublicationBudget({ reason: 'runtime-debug' })),
    runtimeDiagnosticsBudget: cloneJson(runtimeDiagnosticsBudgetReport || refreshRuntimeDiagnosticsBudget({ reason: 'runtime-debug', nowMs })),
    memoryPressure: cloneJson(memoryPressure),
    networkCapacity: cloneJson(networkCapacity),
    placementPlan: cloneJson(placementPlan),
    remotePlacementReadiness: cloneJson(remotePlacementReadiness),
    remotePlacementConfiguration: cloneJson(remotePlacementConfigurationReport),
    remotePeerSelection: cloneJson(remotePeerSelection),
    remotePeerPlacementPlan: cloneJson(remotePeerPlan),
    remotePeerReliability: cloneJson(remotePeerReliability),
    remoteSolverPlacementPolicy: cloneJson(remoteSolverPlacementPolicy),
    remoteSolverPlacementDecisions: cloneJson(remoteSolverPlacementDecisions),
    nodeKernel: cloneJson(refreshNodeKernelStatus()),
    solverAdmission: cloneJson(solverAdmission),
    crossScaleCoupling: {
      schema: coupling.schema,
      status: coupling.status,
      activeLinkCount: coupling.activeLinkCount,
      linkCount: coupling.linkCount,
      strongestLinks: cloneJson(coupling.strongestLinks || []),
      fieldAdapterPlan: coupling.fieldAdapterPlan ? {
        schema: coupling.fieldAdapterPlan.schema,
        status: coupling.fieldAdapterPlan.status,
        adapterCount: coupling.fieldAdapterPlan.adapterCount,
        readyAdapterCount: coupling.fieldAdapterPlan.readyAdapterCount,
        namedAdapterCount: coupling.fieldAdapterPlan.namedAdapterCount,
        readyNamedAdapterCount: coupling.fieldAdapterPlan.readyNamedAdapterCount,
        stubRequiredCount: coupling.fieldAdapterPlan.stubRequiredCount,
        blockedAdapterCount: coupling.fieldAdapterPlan.blockedAdapterCount,
        conservativeReadyCount: coupling.fieldAdapterPlan.conservativeReadyCount
      } : null,
      fieldTransfer: coupling.fieldTransfer ? {
        schema: coupling.fieldTransfer.schema,
        status: coupling.fieldTransfer.status,
        transferCount: coupling.fieldTransfer.transferCount,
        executedTransferCount: coupling.fieldTransfer.executedTransferCount,
        namedExecutedTransferCount: coupling.fieldTransfer.namedExecutedTransferCount,
        skippedStubTransferCount: coupling.fieldTransfer.skippedStubTransferCount,
        blockedTransferCount: coupling.fieldTransfer.blockedTransferCount,
        conservativeExecutedTransferCount: coupling.fieldTransfer.conservativeExecutedTransferCount,
        maxAbsResidual: coupling.fieldTransfer.maxAbsResidual
      } : null
    },
    lawGraph: lawGraph ? {
      schema: lawGraph.schema,
      status: lawGraph.status,
      proxyConsistent: lawGraph.proxyConsistent,
      scientificReady: lawGraph.scientificReady,
      stateNodeCount: lawGraph.stateNodeCount,
      lawNodeCount: lawGraph.lawNodeCount,
      constraintNodeCount: lawGraph.constraintNodeCount,
      edgeCount: lawGraph.edgeCount,
      blockedConstraintCount: lawGraph.blockedConstraintCount,
      scientificBlockingConstraintCount: lawGraph.scientificBlockingConstraintCount,
      consistencyScore: lawGraph.consistencyScore,
      nextRequiredStep: lawGraph.update?.nextRequiredStep || null,
      updatePlan: lawGraph.updatePlan ? {
        schema: lawGraph.updatePlan.schema,
        status: lawGraph.updatePlan.status,
        operationCount: lawGraph.updatePlan.operationCount,
        runnableOperationCount: lawGraph.updatePlan.runnableOperationCount,
        blockedOperationCount: lawGraph.updatePlan.blockedOperationCount,
        proxyBlockedOperationCount: lawGraph.updatePlan.proxyBlockedOperationCount,
        scientificBlockedOperationCount: lawGraph.updatePlan.scientificBlockedOperationCount,
        dispatchReadyOperationCount: lawGraph.updatePlan.dispatchReadyOperationCount,
        computeManagerOperationCount: lawGraph.updatePlan.computeManagerOperationCount,
        phaseCount: lawGraph.updatePlan.phaseCount,
        authoritativeMutationReady: lawGraph.updatePlan.authoritativeMutationReady,
        nextRunnableOperationId: lawGraph.updatePlan.nextRunnableOperationId,
        nextBlockedOperationId: lawGraph.updatePlan.nextBlockedOperationId
      } : null,
      consistencySolve: lawGraph.consistencySolve ? {
        schema: lawGraph.consistencySolve.schema,
        status: lawGraph.consistencySolve.status,
        convergedProxy: lawGraph.consistencySolve.convergedProxy,
        convergedScientific: lawGraph.consistencySolve.convergedScientific,
        iterationCount: lawGraph.consistencySolve.iterationCount,
        proposedStateUpdateCount: lawGraph.consistencySolve.proposedStateUpdateCount,
        proxyAcceptedUpdateCount: lawGraph.consistencySolve.proxyAcceptedUpdateCount,
        authoritativeReadyUpdateCount: lawGraph.consistencySolve.authoritativeReadyUpdateCount,
        closedResidualProxy: lawGraph.consistencySolve.closedResidualProxy,
        scientificResidual: lawGraph.consistencySolve.scientificResidual,
        nextRunnableOperationId: lawGraph.consistencySolve.nextRunnableOperationId,
        nextBlockedOperationId: lawGraph.consistencySolve.nextBlockedOperationId
      } : null,
      proposalAdmission: lawGraph.proposalAdmission ? {
        schema: lawGraph.proposalAdmission.schema,
        status: lawGraph.proposalAdmission.status,
        proxyConverged: lawGraph.proposalAdmission.proxyConverged,
        scientificConverged: lawGraph.proposalAdmission.scientificConverged,
        authoritativeMutationReady: lawGraph.proposalAdmission.authoritativeMutationReady,
        proposalCount: lawGraph.proposalAdmission.proposalCount,
        stateApplicationCount: lawGraph.proposalAdmission.stateApplicationCount,
        proxyWarmDeltaReadyCount: lawGraph.proposalAdmission.proxyWarmDeltaReadyCount,
        scientificBlockedApplicationCount: lawGraph.proposalAdmission.scientificBlockedApplicationCount,
        authoritativeReadyApplicationCount: lawGraph.proposalAdmission.authoritativeReadyApplicationCount,
        dispatchAdmissionCount: lawGraph.proposalAdmission.dispatchAdmissionCount,
        computeManagerDispatchReadyCount: lawGraph.proposalAdmission.computeManagerDispatchReadyCount,
        authoritativeMutationBlockedCount: lawGraph.proposalAdmission.authoritativeMutationBlockedCount,
        calibratedLawBlockedCount: lawGraph.proposalAdmission.calibratedLawBlockedCount,
        nextAdmissionAction: lawGraph.proposalAdmission.nextAdmissionAction
      } : null,
      dispatchQueue: lawGraph.dispatchQueue ? {
        schema: lawGraph.dispatchQueue.schema,
        status: lawGraph.dispatchQueue.status,
        proxyConverged: lawGraph.dispatchQueue.proxyConverged,
        scientificConverged: lawGraph.dispatchQueue.scientificConverged,
        authoritativeMutationReady: lawGraph.dispatchQueue.authoritativeMutationReady,
        queueEntryCount: lawGraph.dispatchQueue.queueEntryCount,
        readyEntryCount: lawGraph.dispatchQueue.readyEntryCount,
        blockedEntryCount: lawGraph.dispatchQueue.blockedEntryCount,
        computeManagerReadyCount: lawGraph.dispatchQueue.computeManagerReadyCount,
        modelLocalReadyCount: lawGraph.dispatchQueue.modelLocalReadyCount,
        partialProxyReadyCount: lawGraph.dispatchQueue.partialProxyReadyCount,
        scientificBlockedEntryCount: lawGraph.dispatchQueue.scientificBlockedEntryCount,
        batchCount: lawGraph.dispatchQueue.batchCount,
        nextDispatchEntryId: lawGraph.dispatchQueue.nextDispatchEntryId,
        nextBlockedDispatchEntryId: lawGraph.dispatchQueue.nextBlockedDispatchEntryId,
        nextQueueAction: lawGraph.dispatchQueue.nextQueueAction
      } : null,
      schedulerManifest: lawGraph.schedulerManifest ? {
        schema: lawGraph.schedulerManifest.schema,
        status: lawGraph.schedulerManifest.status,
        proxyConverged: lawGraph.schedulerManifest.proxyConverged,
        scientificConverged: lawGraph.schedulerManifest.scientificConverged,
        authoritativeMutationReady: lawGraph.schedulerManifest.authoritativeMutationReady,
        manifestEntryCount: lawGraph.schedulerManifest.manifestEntryCount,
        readyManifestEntryCount: lawGraph.schedulerManifest.readyManifestEntryCount,
        schedulerReadyCount: lawGraph.schedulerManifest.schedulerReadyCount,
        computeManagerReadyCount: lawGraph.schedulerManifest.computeManagerReadyCount,
        modelLocalReadyCount: lawGraph.schedulerManifest.modelLocalReadyCount,
        resolvedDescriptorCount: lawGraph.schedulerManifest.resolvedDescriptorCount,
        unresolvedDescriptorCount: lawGraph.schedulerManifest.unresolvedDescriptorCount,
        executorMissingCount: lawGraph.schedulerManifest.executorMissingCount,
        scientificBlockedEntryCount: lawGraph.schedulerManifest.scientificBlockedEntryCount,
        blockedManifestEntryCount: lawGraph.schedulerManifest.blockedManifestEntryCount,
        batchCount: lawGraph.schedulerManifest.batchCount,
        nextSchedulableEntryId: lawGraph.schedulerManifest.nextSchedulableEntryId,
        nextBlockedManifestEntryId: lawGraph.schedulerManifest.nextBlockedManifestEntryId,
        nextSchedulerAction: lawGraph.schedulerManifest.nextSchedulerAction
      } : null,
      schedulerExecutionAudit: lawGraph.schedulerExecutionAudit ? {
        schema: lawGraph.schedulerExecutionAudit.schema,
        status: lawGraph.schedulerExecutionAudit.status,
        proxyConverged: lawGraph.schedulerExecutionAudit.proxyConverged,
        scientificConverged: lawGraph.schedulerExecutionAudit.scientificConverged,
        authoritativeMutationReady: lawGraph.schedulerExecutionAudit.authoritativeMutationReady,
        evidenceAvailable: lawGraph.schedulerExecutionAudit.evidenceAvailable,
        auditEntryCount: lawGraph.schedulerExecutionAudit.auditEntryCount,
        executionRequiredCount: lawGraph.schedulerExecutionAudit.executionRequiredCount,
        schedulerReadyCount: lawGraph.schedulerExecutionAudit.schedulerReadyCount,
        runtimeMatchedCount: lawGraph.schedulerExecutionAudit.runtimeMatchedCount,
        warmDeltaMatchedCount: lawGraph.schedulerExecutionAudit.warmDeltaMatchedCount,
        executionObservedCount: lawGraph.schedulerExecutionAudit.executionObservedCount,
        fullyObservedCount: lawGraph.schedulerExecutionAudit.fullyObservedCount,
        pendingRuntimeCount: lawGraph.schedulerExecutionAudit.pendingRuntimeCount,
        failedRuntimeCount: lawGraph.schedulerExecutionAudit.failedRuntimeCount,
        missingRuntimeCount: lawGraph.schedulerExecutionAudit.missingRuntimeCount,
        missingWarmDeltaCount: lawGraph.schedulerExecutionAudit.missingWarmDeltaCount,
        nextExecutionAction: lawGraph.schedulerExecutionAudit.nextExecutionAction
      } : null,
      resultAdmission: lawGraph.resultAdmission ? {
        schema: lawGraph.resultAdmission.schema,
        status: lawGraph.resultAdmission.status,
        proxyConverged: lawGraph.resultAdmission.proxyConverged,
        scientificConverged: lawGraph.resultAdmission.scientificConverged,
        authoritativeMutationReady: lawGraph.resultAdmission.authoritativeMutationReady,
        evidenceAvailable: lawGraph.resultAdmission.evidenceAvailable,
        resultAdmissionEntryCount: lawGraph.resultAdmission.resultAdmissionEntryCount,
        resultAdmissionRequiredCount: lawGraph.resultAdmission.resultAdmissionRequiredCount,
        proxyAdmittedCount: lawGraph.resultAdmission.proxyAdmittedCount,
        missingRuntimeCount: lawGraph.resultAdmission.missingRuntimeCount,
        missingWarmDeltaCount: lawGraph.resultAdmission.missingWarmDeltaCount,
        scientificBlockedAdmissionCount: lawGraph.resultAdmission.scientificBlockedAdmissionCount,
        nextResultAdmissionAction: lawGraph.resultAdmission.nextResultAdmissionAction
      } : null,
      stateApplicationPreflight: lawGraph.stateApplicationPreflight ? {
        schema: lawGraph.stateApplicationPreflight.schema,
        status: lawGraph.stateApplicationPreflight.status,
        proxyConverged: lawGraph.stateApplicationPreflight.proxyConverged,
        scientificConverged: lawGraph.stateApplicationPreflight.scientificConverged,
        authoritativeMutationReady: lawGraph.stateApplicationPreflight.authoritativeMutationReady,
        evidenceAvailable: lawGraph.stateApplicationPreflight.evidenceAvailable,
        preflightEntryCount: lawGraph.stateApplicationPreflight.preflightEntryCount,
        applicationPreflightRequiredCount: lawGraph.stateApplicationPreflight.applicationPreflightRequiredCount,
        proxyApplicationReadyCount: lawGraph.stateApplicationPreflight.proxyApplicationReadyCount,
        waitingResultAdmissionCount: lawGraph.stateApplicationPreflight.waitingResultAdmissionCount,
        missingStateApplicationLinkCount: lawGraph.stateApplicationPreflight.missingStateApplicationLinkCount,
        stateApplicationLinkCount: lawGraph.stateApplicationPreflight.stateApplicationLinkCount,
        scientificBlockedApplicationCount: lawGraph.stateApplicationPreflight.scientificBlockedApplicationCount,
        nextStateApplicationAction: lawGraph.stateApplicationPreflight.nextStateApplicationAction
      } : null,
      blockers: cloneJson(lawGraph.blockers || [])
    } : null,
    ulgRuntime: ulgRuntime ? {
      schema: ulgRuntime.schema,
      modelId: ulgRuntime.modelId,
      status: ulgRuntime.status,
      liveBackendPolicy: ulgRuntime.liveBackendPolicy,
      carrierKindCount: ulgRuntime.carrierKindCount,
      stateChannelCount: ulgRuntime.stateChannelCount,
      passCount: ulgRuntime.passCount,
      webgpuPassCount: ulgRuntime.webgpuPassCount,
      invalidLivePassCount: ulgRuntime.invalidLivePassCount,
      materialClosureReadyCount: ulgRuntime.materialClosureReadyCount,
      scientificBlockedClosureCount: ulgRuntime.scientificBlockedClosureCount,
      hamiltonianHash: ulgRuntime.hamiltonian?.hamiltonianHash || null,
      closureHash: ulgRuntime.materialClosures?.[0]?.closureHash || null,
      passDagStatus: ulgRuntime.passDag?.status || null,
      quantumTaskStatus: ulgRuntime.quantumTaskCapsule?.validation?.status || null,
      lawTaskStatus: ulgRuntime.lawTaskCapsule?.validation?.status || null,
      nextRequiredStep: ulgRuntime.nextRequiredStep
    } : null,
    ulgRuntimeExecution: ulgRuntimeExecution ? {
      schema: ulgRuntimeExecution.schema,
      status: ulgRuntimeExecution.status,
      ok: ulgRuntimeExecution.ok === true,
      backend: ulgRuntimeExecution.backend,
      liveBackendPolicy: ulgRuntimeExecution.liveBackendPolicy,
      manifestHash: ulgRuntimeExecution.manifestHash,
      activeLayerId: ulgRuntimeExecution.activeLayerId,
      passDagStatus: ulgRuntimeExecution.passDagStatus,
      passCount: ulgRuntimeExecution.passCount,
      executedPassCount: ulgRuntimeExecution.executedPassCount,
      invalidLivePassCount: ulgRuntimeExecution.invalidLivePassCount,
      totalWorkItems: ulgRuntimeExecution.totalWorkItems,
      evidenceHash: ulgRuntimeExecution.evidenceHash,
      stateDelta: ulgRuntimeExecution.stateDelta ? {
        schema: ulgRuntimeExecution.stateDelta.schema,
        status: ulgRuntimeExecution.stateDelta.status,
        ok: ulgRuntimeExecution.stateDelta.ok === true,
        mutationMode: ulgRuntimeExecution.stateDelta.mutationMode,
        proxyStateReady: ulgRuntimeExecution.stateDelta.proxyStateReady === true,
        proxyStateApplied: ulgRuntimeExecution.stateDelta.proxyStateApplied === true,
        authoritativeWorkerBufferMutation: ulgRuntimeExecution.stateDelta.authoritativeWorkerBufferMutation === true,
        scientificMutationReady: ulgRuntimeExecution.stateDelta.scientificMutationReady === true,
        readiness: ulgRuntimeExecution.stateDelta.readiness ?? 0,
        executedFraction: ulgRuntimeExecution.stateDelta.executedFraction ?? 0,
        channelUpdateCount: ulgRuntimeExecution.stateDelta.channelUpdateCount ?? 0,
        appliedChannelUpdateCount: ulgRuntimeExecution.stateDelta.appliedChannelUpdateCount ?? 0,
        stateDeltaHash: ulgRuntimeExecution.stateDelta.stateDeltaHash || null,
        residuals: ulgRuntimeExecution.stateDelta.residuals || null,
        materialResponse: ulgRuntimeExecution.stateDelta.materialResponse || null,
        blocker: ulgRuntimeExecution.stateDelta.blocker || null
      } : null,
      webgpuStatus: ulgRuntimeExecution.webgpuStatus ? {
        schema: ulgRuntimeExecution.webgpuStatus.schema,
        status: ulgRuntimeExecution.webgpuStatus.status,
        kernelMode: ulgRuntimeExecution.webgpuStatus.kernelMode,
        dispatchWorkgroups: ulgRuntimeExecution.webgpuStatus.dispatchWorkgroups ?? null,
        passCount: ulgRuntimeExecution.webgpuStatus.passCount ?? null,
        executedPassCount: ulgRuntimeExecution.webgpuStatus.executedPassCount ?? null,
        invalidLivePassCount: ulgRuntimeExecution.webgpuStatus.invalidLivePassCount ?? null
      } : null,
      webgpuError: ulgRuntimeExecution.webgpuError || null
    } : null,
    scaler: {
      enabled: runtimeScalerStatus.enabled !== false,
      lastAction: runtimeScalerStatus.lastAction || 'none',
      pressure: runtimeScalerStatus.pressure ?? 0,
      frameMsAvg: runtimeScalerStatus.frameMsAvg ?? 0,
      lastRequestAction: runtimeScalerStatus.lastRequest?.action || 'none',
      cooldownFrames: runtimeScalerStatus.cooldownFrames ?? 0,
      workerCooldownFrames: runtimeScalerStatus.workerCooldownFrames ?? 0
    },
    framePhaseTiming: cloneJson(framePhaseTimingReport),
    readout: getReadoutCadenceSnapshot(nowMs),
    hud: {
      mode: hudMode,
      packetPreviewSchema: PACKET_PREVIEW_SCHEMA,
      runtimeDebugThrottleMs: RUNTIME_DEBUG_RENDER_INTERVAL_MS,
      runtimeDebugRenderCount,
      layerReadoutRowCount: lastLayerReadoutRowCount,
      layerReadoutTotalRowCount: lastLayerReadoutTotalRowCount,
      outputPanels: getOutputPanelVisibility()
    },
    computeResize: lastComputeCapacityResize ? cloneJson(lastComputeCapacityResize) : null,
    resizeCorrection: computeStatus.peercompute?.lastResize?.resizeCorrectionSummary
      ? cloneJson(computeStatus.peercompute.lastResize.resizeCorrectionSummary)
      : null,
    warmDeltas: {
      compute: countWarmDeltaEntries(COMPUTE_DELTA_SCOPE),
      solver: countWarmDeltaEntries(SOLVER_DELTA_SCOPE),
      closure: countWarmDeltaEntries(CLOSURE_DELTA_SCOPE),
      conservation: countWarmDeltaEntries(CONSERVATION_DELTA_SCOPE),
      coupling: countWarmDeltaEntries(COUPLING_DELTA_SCOPE),
      lawGraph: countWarmDeltaEntries(LAW_GRAPH_DELTA_SCOPE),
      ulgRuntime: countWarmDeltaEntries(ULG_RUNTIME_DELTA_SCOPE),
      ulgRuntimeExecution: countWarmDeltaEntries(ULG_RUNTIME_EXECUTION_DELTA_SCOPE),
      sourceSinkBalance: countWarmDeltaEntries(SOURCE_SINK_BALANCE_DELTA_SCOPE),
      sourceTransfer: countWarmDeltaEntries(SOURCE_TRANSFER_DELTA_SCOPE),
      sourceTransferApplication: countWarmDeltaEntries(SOURCE_TRANSFER_APPLICATION_DELTA_SCOPE),
      sourceTransferTransaction: countWarmDeltaEntries(SOURCE_TRANSFER_TRANSACTION_DELTA_SCOPE),
      sourceTransferTargetPreview: countWarmDeltaEntries(SOURCE_TRANSFER_TARGET_PREVIEW_DELTA_SCOPE),
      sourceTransferTargetMutatorRegistry: countWarmDeltaEntries(SOURCE_TRANSFER_TARGET_MUTATOR_REGISTRY_DELTA_SCOPE),
      sourceTransferTargetMutationPreflight: countWarmDeltaEntries(SOURCE_TRANSFER_TARGET_MUTATION_PREFLIGHT_DELTA_SCOPE),
      sourceTransferTargetMutationOperationPlan: countWarmDeltaEntries(SOURCE_TRANSFER_TARGET_MUTATION_OPERATION_PLAN_DELTA_SCOPE),
      sourceTransferTargetMutationInvariantCheck: countWarmDeltaEntries(SOURCE_TRANSFER_TARGET_MUTATION_INVARIANT_CHECK_DELTA_SCOPE),
      sourceTransferTargetMutationCommit: countWarmDeltaEntries(SOURCE_TRANSFER_TARGET_MUTATION_COMMIT_DELTA_SCOPE),
      sourceTransferTargetMutationDispatch: countWarmDeltaEntries(SOURCE_TRANSFER_TARGET_MUTATION_DISPATCH_DELTA_SCOPE),
      sourceTransferTargetMutationApplyValidation: countWarmDeltaEntries(SOURCE_TRANSFER_TARGET_MUTATION_APPLY_VALIDATION_DELTA_SCOPE),
      sourceTransferTargetMutationApplyExecution: countWarmDeltaEntries(SOURCE_TRANSFER_TARGET_MUTATION_APPLY_EXECUTION_DELTA_SCOPE),
      sourceTransferTargetSourceIntake: countWarmDeltaEntries(SOURCE_TRANSFER_TARGET_SOURCE_INTAKE_DELTA_SCOPE),
      sourceTransferTargetSourceResponse: countWarmDeltaEntries(SOURCE_TRANSFER_TARGET_SOURCE_RESPONSE_DELTA_SCOPE),
      sourceTransferTargetSourceReconciliation: countWarmDeltaEntries(SOURCE_TRANSFER_TARGET_SOURCE_RECONCILIATION_DELTA_SCOPE),
      conservativeSourceBuffer: countWarmDeltaEntries(CONSERVATIVE_SOURCE_BUFFER_DELTA_SCOPE),
      sourceBufferApplication: countWarmDeltaEntries(SOURCE_BUFFER_APPLICATION_DELTA_SCOPE),
      sourceBufferAcceptance: countWarmDeltaEntries(SOURCE_BUFFER_ACCEPTANCE_DELTA_SCOPE),
      sourceBufferWritebackValidation: countWarmDeltaEntries(SOURCE_BUFFER_WRITEBACK_VALIDATION_DELTA_SCOPE),
      targetBufferReplayValidation: countWarmDeltaEntries(TARGET_BUFFER_REPLAY_VALIDATION_DELTA_SCOPE),
      targetBufferMutationAudit: countWarmDeltaEntries(TARGET_BUFFER_MUTATION_AUDIT_DELTA_SCOPE),
      targetBufferWorkerWriteQueue: countWarmDeltaEntries(TARGET_BUFFER_WORKER_WRITE_QUEUE_DELTA_SCOPE),
      targetBufferWorkerWriteExecution: countWarmDeltaEntries(TARGET_BUFFER_WORKER_WRITE_EXECUTION_DELTA_SCOPE),
      targetBufferWorkerWriteVerification: countWarmDeltaEntries(TARGET_BUFFER_WORKER_WRITE_VERIFICATION_DELTA_SCOPE),
      scientificInvariantGate: countWarmDeltaEntries(SCIENTIFIC_INVARIANT_GATE_DELTA_SCOPE),
      scientificReadinessManifest: countWarmDeltaEntries(SCIENTIFIC_READINESS_MANIFEST_DELTA_SCOPE)
    },
    solverRemap: compactSolverRemapReport(lastSolverRemapReport),
    solverQuality: {
      global: solverQualityMultiplier,
      targeted: { ...solverWorkloadMultipliers }
    }
  };
}

function renderRuntimeDebugPanel(nowMs = getClockMs(), { force = false } = {}) {
  if (!runtimeDebugReadout) return null;
  if (
    !force
    && lastRuntimeDebugSnapshot
    && Number.isFinite(lastRuntimeDebugRenderMs)
    && nowMs - lastRuntimeDebugRenderMs < RUNTIME_DEBUG_RENDER_INTERVAL_MS
  ) {
    return lastRuntimeDebugSnapshot;
  }
  runtimeDebugRenderCount += 1;
  const snapshot = createRuntimeDebugSnapshot({ force, reason: 'panel' });
  lastRuntimeDebugRenderMs = nowMs;
  lastRuntimeDebugSnapshot = snapshot;
  const familyRows = snapshot.topTaskFamilies.length > 0
    ? snapshot.topTaskFamilies.map((entry, index) => [
      `family ${index + 1}`,
      `${entry.family} ${entry.completed}/${entry.submitted} fail ${entry.failed} avg ${formatFixed(entry.averageTaskDurationMs, 2, '0.00')}ms`
    ])
    : [['family 1', 'warming']];
  writeDefinitionRows(runtimeDebugReadout, [
    ['schema', snapshot.schema],
    ['workers', `${snapshot.manager.workerCount}/${snapshot.manager.targetWorkers} target / policy ${snapshot.manager.minWorkers}-${snapshot.manager.maxWorkers}`],
    ['manager load', `${formatFixed(snapshot.manager.currentLoad, 2, '0.00')} / active ${snapshot.manager.activeTasks} / queued ${snapshot.manager.queuedTasks}`],
    ['task totals', `${snapshot.manager.totalTasksCompleted}/${snapshot.manager.totalTasksSubmitted} done / fail ${snapshot.manager.totalTasksFailed} / avg ${formatFixed(snapshot.manager.averageTaskDurationMs, 2, '0.00')}ms`],
    ['worker util', formatWorkerUtilization(snapshot.workerUtilization)],
    ['task placement', formatTaskPlacement(snapshot.taskPlacement)],
    ['worker resize', `rev ${snapshot.manager.workerPoolRevision} / ${snapshot.manager.lastWorkerResize?.reason || 'initial'}`],
    ['worker hold', snapshot.manager.workerAutoScaleHold?.active
      ? `${snapshot.manager.workerAutoScaleHold.reason} / ${Math.ceil(snapshot.manager.workerAutoScaleHold.remainingMs / 1000)}s`
      : 'none'],
    ['memory pressure', formatMemoryPressure(snapshot.memoryPressure)],
    ['network capacity', formatNetworkCapacity(snapshot.networkCapacity)],
    ['placement plan', formatPlacementPlan(snapshot.placementPlan)],
    ['remote place', formatRemotePlacementReadiness(snapshot.remotePlacementReadiness)],
    ['remote config', formatRemotePlacementConfiguration(snapshot.remotePlacementConfiguration)],
    ['remote peer', formatRemotePeerSelection(snapshot.remotePeerSelection)],
    ['remote peer plan', formatRemotePeerPlacementPlan(snapshot.remotePeerPlacementPlan)],
    ['remote reliability', formatRemotePeerReliability(snapshot.remotePeerReliability)],
    ['remote solver', formatRemoteSolverPlacementPolicy(snapshot.remoteSolverPlacementPolicy)],
    ['remote decisions', summarizeRemoteSolverPlacementDecisions(snapshot.remoteSolverPlacementDecisions)],
    ['node kernel', formatNodeKernelStatus(snapshot.nodeKernel)],
    ['solver admission', formatSolverAdmission(snapshot.solverAdmission)],
    ['cross coupling', snapshot.crossScaleCoupling
      ? `${snapshot.crossScaleCoupling.status} / active ${snapshot.crossScaleCoupling.activeLinkCount}/${snapshot.crossScaleCoupling.linkCount} / top ${snapshot.crossScaleCoupling.strongestLinks?.[0]?.id || 'none'}`
      : 'warming'],
    ['law graph', formatLawGraphReport(snapshot.lawGraph)],
    ['ulg runtime', formatUlgRuntime(snapshot.ulgRuntime)],
    ['ulg exec', formatUlgRuntimeExecution(snapshot.ulgRuntimeExecution)],
    ['field adapters', formatFieldAdapterPlan(snapshot.crossScaleCoupling?.fieldAdapterPlan)],
    ['field transfer', formatFieldTransferReport(snapshot.crossScaleCoupling?.fieldTransfer)],
    ...familyRows,
    ['solver pressure', `${snapshot.solverLoad.dominantSolver} ${formatFixed(snapshot.solverLoad.dominantPressure, 2, '0.00')} / total ${formatFixed(snapshot.solverLoad.totalPressure, 2, '0.00')} / pending ${snapshot.solverLoad.pendingFamilies}`],
    ['solver focus', `${snapshot.solverGovernor.activeLayerId || model.activeLayer?.id || 'none'} / ${snapshot.solverGovernor.activeLayerPolicy || MULTISCALE_SOLVER_ACTIVE_LAYER_POLICY}`],
    ['refinement schedule', formatLowerScaleRefinement(snapshot.lowerScaleRefinement)],
    ['solver submit', formatSolverSubmissionBudget(snapshot.solverSubmissionBudget)],
    ['render budget', formatRenderBudget(snapshot.renderBudget)],
    ['readback budget', formatReadbackBudget(snapshot.readbackBudget)],
    ['state publish', formatStatePublicationBudget(snapshot.statePublicationBudget)],
    ['runtime diag', formatRuntimeDiagnosticsBudget(snapshot.runtimeDiagnosticsBudget)],
    ['hud mode', `${snapshot.hud.mode} / debug ${snapshot.hud.runtimeDebugThrottleMs}ms / render ${snapshot.hud.runtimeDebugRenderCount}`],
    ['autoscale', `${snapshot.scaler.enabled ? 'auto' : 'manual'} / ${snapshot.scaler.lastAction} / request ${snapshot.scaler.lastRequestAction} / wcool ${snapshot.scaler.workerCooldownFrames}`],
    ['frame pressure', `${formatFixed(snapshot.scaler.pressure, 2, '0.00')} / avg ${formatFixed(snapshot.scaler.frameMsAvg, 1, '0.0')}ms`],
    ['readout cadence', `${snapshot.readout.throttleMs}ms / render ${snapshot.readout.renderCount}`],
    ['compute resize', snapshot.computeResize
      ? `${snapshot.computeResize.reason} / ${snapshot.computeResize.pending ? 'pending' : 'ready'} / shards ${snapshot.computeResize.next?.plannedWorkers ?? 'n/a'}`
      : 'none'],
    ['resize corr', formatResizeCorrectionSummary(snapshot.resizeCorrection)],
    ['state remap', formatSolverRemapSummary(snapshot.solverRemap)],
    ['warm deltas', `compute ${snapshot.warmDeltas.compute} / solver ${snapshot.warmDeltas.solver} / closure ${snapshot.warmDeltas.closure} / conservation ${snapshot.warmDeltas.conservation} / coupling ${snapshot.warmDeltas.coupling} / graph ${snapshot.warmDeltas.lawGraph} / ulg ${snapshot.warmDeltas.ulgRuntime}`],
    ['quality', `${formatFixed(snapshot.solverQuality.global, 2, '1.00')}x / ${formatSolverWorkloadScales()}`]
  ]);
  return snapshot;
}

function getMultiscaleNetVizAttachUrl() {
  if (!globalThis.location?.origin) return null;
  try {
    const currentPath = globalThis.location.pathname || '/';
    const docsPath = currentPath.includes('/multiscale')
      ? currentPath.replace(/\/multiscale\/?.*$/, '/netviz/')
      : '/netviz/';
    const url = new URL(docsPath, globalThis.location.origin);
    url.searchParams.set('topologyType', peerNetworkRuntimeOverrides.topology || 'distributed');
    url.searchParams.set('topologyId', peerNetworkRuntimeOverrides.topologyId || 'multiscale-ladder');
    url.searchParams.set('room', peerNetworkRuntimeOverrides.roomId || 'multiscale');
    url.searchParams.set('autoConnect', '1');
    url.searchParams.set('attachSession', NETVIZ_SESSION_ID);
    return url.toString();
  } catch (_) {
    return null;
  }
}

function createNetVizRuntimeSession(isStarted = true) {
  const runtimeDebug = createRuntimeDebugSnapshot({ reason: 'netviz-session' });
  const nodeKernel = nodeKernelStatusReport || refreshNodeKernelStatus();
  return {
    sessionId: NETVIZ_SESSION_ID,
    nodeId: nodeKernel.nodeId || 'browser-multiscale-demo',
    peerId: nodeKernel.peerId || null,
    gameId: 'multiscale',
    roomId: nodeKernel.roomId || 'multiscale',
    topologyId: nodeKernel.topologyId || 'multiscale-ladder',
    topologyType: nodeKernel.topology || 'distributed',
    isStarted,
    attachUrl: getMultiscaleNetVizAttachUrl(),
    metadata: {
      schema: NETVIZ_SESSION_SCHEMA,
      runtimeDebug,
      nodeKernel: cloneJson(nodeKernel),
      activeLayerId: model.activeLayer?.id || null,
      computeBackend: computeStatus.backend || null,
      solverCount: computeStatus.peercompute?.solverRegistry?.solverCount ?? 0,
      workerCount: runtimeDebug.manager.workerCount,
      targetWorkers: runtimeDebug.manager.targetWorkers,
      dominantSolver: runtimeDebug.solverLoad.dominantSolver,
      dominantPressure: runtimeDebug.solverLoad.dominantPressure,
      crossScaleCoupling: cloneJson(runtimeDebug.crossScaleCoupling),
      lawGraph: cloneJson(runtimeDebug.lawGraph),
      lowerScaleRefinement: cloneJson(runtimeDebug.lowerScaleRefinement),
      solverSubmissionBudget: cloneJson(runtimeDebug.solverSubmissionBudget),
      renderBudget: cloneJson(runtimeDebug.renderBudget),
      readbackBudget: cloneJson(runtimeDebug.readbackBudget),
      statePublicationBudget: cloneJson(runtimeDebug.statePublicationBudget),
      runtimeDiagnosticsBudget: cloneJson(runtimeDebug.runtimeDiagnosticsBudget)
    },
    ts: Date.now()
  };
}

function publishNetVizRuntimeSession(isStarted = true) {
  if (!netVizSessionChannel) return null;
  const session = createNetVizRuntimeSession(isStarted);
  netVizSessionChannel.postMessage({
    type: isStarted ? 'session-upsert' : 'session-remove',
    ts: Date.now(),
    session,
    sessionId: session.sessionId
  });
  return session;
}

function startNetVizRuntimeSessionBroadcast() {
  if (typeof BroadcastChannel === 'undefined') return;
  try {
    netVizSessionChannel = new BroadcastChannel(NETVIZ_DEBUG_CHANNEL);
  } catch (_) {
    netVizSessionChannel = null;
    return;
  }
  publishNetVizRuntimeSession(true);
  netVizSessionTimer = setInterval(() => {
    publishNetVizRuntimeSession(true);
  }, NETVIZ_SESSION_BROADCAST_MS);
}

function stopNetVizRuntimeSessionBroadcast() {
  if (netVizSessionTimer) {
    clearInterval(netVizSessionTimer);
    netVizSessionTimer = null;
  }
  if (!netVizSessionChannel) return;
  try {
    publishNetVizRuntimeSession(false);
    netVizSessionChannel.close();
  } catch (_) {
    // Best-effort same-origin NetViz hint only.
  }
  netVizSessionChannel = null;
}

function renderReadout(nowMs = getClockMs(), { forceRuntimeDebug = true } = {}) {
  lastReadoutRenderMs = nowMs;
  readoutRenderCount += 1;
  const status = model.getLayerStatus();
  const overlay = scene.getOverlayStatus();
  const nbodyOverlay = scene.getNBodyOverlayStatus();
  const visualReference = scene.getVisualReferenceStatus();
  const packet = createUiPacket();
  const scenario = packet.scenario || model.getScenario();
  renderScenarioAffordance(scenario);
  const molecularResult = solverRuntimeStatus.molecularDynamics?.lastResult;
  const molecularTelemetry = packet.upward?.aggregateState?.molecularDynamics || molecularResult;
  const molecularBalance = packet.upward?.aggregateState?.molecularSourceSinkBalance || packet.sourceSinkBalance || null;
  const molecularEquation = packet.upward?.aggregateState?.molecularSourceEquation || packet.sourceEquation || null;
  const molecularTransfer = packet.upward?.aggregateState?.molecularSourceTransfer || packet.sourceTransfer || null;
  const molecularTransferApplication = packet.upward?.aggregateState?.molecularSourceTransferApplication || packet.sourceTransferApplication || null;
  const molecularTransferTransaction = packet.upward?.aggregateState?.molecularSourceTransferTransaction || packet.sourceTransferTransaction || null;
  const molecularTransferTargetPreview = packet.upward?.aggregateState?.molecularSourceTransferTargetPreview || packet.sourceTransferTargetPreview || null;
  const molecularTargetMutatorRegistry = packet.upward?.aggregateState?.molecularTargetMutatorRegistry || packet.sourceTransferTargetMutatorRegistry || null;
  const molecularTargetMutationPreflight = packet.upward?.aggregateState?.molecularTargetMutationPreflight || packet.sourceTransferTargetMutationPreflight || null;
  const molecularTargetMutationOperationPlan = packet.upward?.aggregateState?.molecularTargetMutationOperationPlan || packet.sourceTransferTargetMutationOperationPlan || null;
  const molecularTargetMutationInvariantCheck = packet.upward?.aggregateState?.molecularTargetMutationInvariantCheck || packet.sourceTransferTargetMutationInvariantCheck || null;
  const molecularTargetMutationCommit = packet.upward?.aggregateState?.molecularTargetMutationCommit || packet.sourceTransferTargetMutationCommit || null;
  const molecularTargetMutationDispatch = packet.upward?.aggregateState?.molecularTargetMutationDispatch || packet.sourceTransferTargetMutationDispatch || null;
  const molecularTargetMutationApplyValidation = packet.upward?.aggregateState?.molecularTargetMutationApplyValidation || packet.sourceTransferTargetMutationApplyValidation || null;
  const molecularTargetMutationApplyExecution = packet.upward?.aggregateState?.molecularTargetMutationApplyExecution || packet.sourceTransferTargetMutationApplyExecution || null;
  const molecularTargetSourceIntake = packet.upward?.aggregateState?.molecularTargetSourceIntake || packet.sourceTransferTargetSourceIntake || null;
  const molecularTargetSourceResponse = packet.upward?.aggregateState?.molecularTargetSourceResponse || packet.sourceTransferTargetSourceResponse || null;
  const molecularTargetSourceReconciliation = packet.upward?.aggregateState?.molecularTargetSourceReconciliation || packet.sourceTransferTargetSourceReconciliation || null;
  const molecularConservativeSourceBuffer = packet.upward?.aggregateState?.molecularConservativeSourceBuffer || packet.conservativeSourceBuffer || null;
  const molecularSourceBufferApplication = packet.upward?.aggregateState?.molecularSourceBufferApplication || null;
  const molecularSourceBufferQmatSource =
    molecularSourceBufferApplication?.quantumMaterialPropertySource
    || molecularConservativeSourceBuffer?.quantumMaterialPropertySource
    || null;
  const molecularSourceBufferQmatThermalFlux =
    molecularSourceBufferApplication?.quantumMaterialPropertyThermalFluxBoostProxy
    ?? molecularConservativeSourceBuffer?.quantumMaterialPropertyThermalFluxBoostProxy
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumMaterialThermalFluxBoostProxy
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumMaterialThermalFluxBoostProxy
    ?? 0;
  const molecularSourceBufferQmatPhaseDrive =
    molecularSourceBufferApplication?.quantumMaterialPropertyPhaseDriveBoostProxy
    ?? molecularConservativeSourceBuffer?.quantumMaterialPropertyPhaseDriveBoostProxy
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumMaterialPhaseDriveBoostProxy
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumMaterialPhaseDriveBoostProxy
    ?? 0;
  const molecularSourceBufferQmatElectricalDrive =
    molecularSourceBufferApplication?.quantumMaterialPropertyElectricalDrive
    ?? molecularConservativeSourceBuffer?.quantumMaterialPropertyElectricalDrive
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumMaterialElectricalDrive
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumMaterialElectricalDrive
    ?? 0;
  const molecularSourceBufferQmatMechanicalDrive =
    molecularSourceBufferApplication?.quantumMaterialPropertyMechanicalStiffnessDrive
    ?? molecularConservativeSourceBuffer?.quantumMaterialPropertyMechanicalStiffnessDrive
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumMaterialMechanicalStiffnessDrive
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumMaterialMechanicalStiffnessDrive
    ?? 0;
  const molecularSourceBufferQmatActiveTargetCount =
    molecularSourceBufferApplication?.quantumMaterialPropertyActiveTargetCount
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumMaterialActiveTargetCount
    ?? 0;
  const molecularSourceBufferQstatSource =
    molecularSourceBufferApplication?.quantumMaterialStatisticalSource
    || molecularConservativeSourceBuffer?.quantumMaterialStatisticalSource
    || null;
  const molecularSourceBufferQstatActiveTargetCount =
    molecularSourceBufferApplication?.quantumMaterialStatisticalActiveTargetCount
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumStatisticalActiveTargetCount
    ?? 0;
  const molecularSourceBufferQstatChannelCount =
    molecularSourceBufferApplication?.quantumMaterialStatisticalSourceChannelCount
    ?? molecularConservativeSourceBuffer?.quantumMaterialStatisticalSourceChannelCount
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumStatisticalSourceChannelCount
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumStatisticalSourceChannelCount
    ?? 0;
  const molecularSourceBufferQstatPressure =
    molecularSourceBufferApplication?.quantumMaterialStatisticalPressureDriveProxy
    ?? molecularConservativeSourceBuffer?.quantumMaterialStatisticalPressureDriveProxy
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumStatisticalPressureDriveProxy
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumStatisticalPressureDriveProxy
    ?? 0;
  const molecularSourceBufferQstatOpacity =
    molecularSourceBufferApplication?.quantumMaterialStatisticalOpacityDriveProxy
    ?? molecularConservativeSourceBuffer?.quantumMaterialStatisticalOpacityDriveProxy
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumStatisticalOpacityDriveProxy
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumStatisticalOpacityDriveProxy
    ?? 0;
  const molecularSourceBufferQstatDegeneracy =
    molecularSourceBufferApplication?.quantumMaterialStatisticalDegeneracyPressureDriveProxy
    ?? molecularConservativeSourceBuffer?.quantumMaterialStatisticalDegeneracyPressureDriveProxy
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumStatisticalDegeneracyPressureDriveProxy
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumStatisticalDegeneracyPressureDriveProxy
    ?? 0;
  const molecularSourceBufferQstatTemperature =
    molecularSourceBufferApplication?.quantumMaterialStatisticalTemperatureDeltaKProxy
    ?? molecularConservativeSourceBuffer?.quantumMaterialStatisticalTemperatureDeltaKProxy
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumStatisticalTemperatureDeltaKProxy
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumStatisticalTemperatureDeltaKProxy
    ?? 0;
  const molecularSourceBufferQderivSource =
    molecularSourceBufferApplication?.quantumMaterialResponseDerivativeSource
    || molecularConservativeSourceBuffer?.quantumMaterialResponseDerivativeSource
    || null;
  const molecularSourceBufferQderivActiveTargetCount =
    molecularSourceBufferApplication?.quantumMaterialResponseDerivativeActiveTargetCount
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumResponseDerivativeActiveTargetCount
    ?? 0;
  const molecularSourceBufferQderivTemperatureDrive =
    molecularSourceBufferApplication?.quantumMaterialResponseDerivativeTemperatureDrive
    ?? molecularConservativeSourceBuffer?.quantumMaterialResponseDerivativeTemperatureDrive
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumResponseDerivativeTemperatureDrive
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumResponseDerivativeTemperatureDrive
    ?? 0;
  const molecularSourceBufferQderivPressureDrive =
    molecularSourceBufferApplication?.quantumMaterialResponseDerivativePressureDrive
    ?? molecularConservativeSourceBuffer?.quantumMaterialResponseDerivativePressureDrive
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumResponseDerivativePressureDrive
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumResponseDerivativePressureDrive
    ?? 0;
  const molecularSourceBufferQderivFieldDrive =
    molecularSourceBufferApplication?.quantumMaterialResponseDerivativeFieldDrive
    ?? molecularConservativeSourceBuffer?.quantumMaterialResponseDerivativeFieldDrive
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumResponseDerivativeFieldDrive
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumResponseDerivativeFieldDrive
    ?? 0;
  const molecularSourceBufferQderivRadiationDrive =
    molecularSourceBufferApplication?.quantumMaterialResponseDerivativeRadiationDrive
    ?? molecularConservativeSourceBuffer?.quantumMaterialResponseDerivativeRadiationDrive
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumResponseDerivativeRadiationDrive
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumResponseDerivativeRadiationDrive
    ?? 0;
  const molecularSourceBufferQderivThermalFlux =
    molecularSourceBufferApplication?.quantumMaterialResponseDerivativeThermalFluxBoostProxy
    ?? molecularConservativeSourceBuffer?.quantumMaterialResponseDerivativeThermalFluxBoostProxy
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumResponseDerivativeThermalFluxBoostProxy
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumResponseDerivativeThermalFluxBoostProxy
    ?? 0;
  const molecularSourceBufferQderivPhaseDrive =
    molecularSourceBufferApplication?.quantumMaterialResponseDerivativePhaseDriveBoostProxy
    ?? molecularConservativeSourceBuffer?.quantumMaterialResponseDerivativePhaseDriveBoostProxy
    ?? packet.upward?.aggregateState?.molecularSourceBufferApplicationQuantumResponseDerivativePhaseDriveBoostProxy
    ?? packet.upward?.aggregateState?.molecularConservativeSourceBufferQuantumResponseDerivativePhaseDriveBoostProxy
    ?? 0;
  const molecularSourceBufferAcceptance = packet.upward?.aggregateState?.molecularSourceBufferAcceptance || packet.sourceBufferAcceptance || null;
  const molecularSourceBufferWritebackValidation = packet.upward?.aggregateState?.molecularSourceBufferWritebackValidation || packet.sourceBufferWritebackValidation || null;
  const molecularTargetBufferReplayValidation = packet.upward?.aggregateState?.molecularTargetBufferReplayValidation || packet.targetBufferReplayValidation || null;
  const molecularTargetBufferMutationAudit = packet.upward?.aggregateState?.molecularTargetBufferMutationAudit || packet.targetBufferMutationAudit || null;
  const molecularTargetBufferWorkerWriteQueue = packet.upward?.aggregateState?.molecularTargetBufferWorkerWriteQueue || packet.targetBufferWorkerWriteQueue || null;
  const molecularTargetBufferWorkerWriteExecution = packet.upward?.aggregateState?.molecularTargetBufferWorkerWriteExecution || packet.targetBufferWorkerWriteExecution || null;
  const molecularTargetBufferWorkerWriteVerification = packet.upward?.aggregateState?.molecularTargetBufferWorkerWriteVerification || packet.targetBufferWorkerWriteVerification || null;
  const molecularScientificInvariantGate = packet.upward?.aggregateState?.molecularScientificInvariantGate || packet.molecularScientificInvariantGate || null;
  const molecularScientificReadinessManifest = packet.upward?.aggregateState?.molecularScientificReadinessManifest || packet.molecularScientificReadinessManifest || null;
  const quantumTelemetry = packet.upward?.aggregateState?.quantumOrbital || model.state.orbital;
  const quantumMaterialTelemetry = packet.upward?.aggregateState?.quantumMaterialPotential || model.state.orbital.materialPotential || null;
  const effectiveCadence = solverGovernorStatus.effectiveCadenceFrames || solverGovernorStatus.cadenceFrames;
  const quantumGridRuntime = solverRuntimeStatus.quantumOrbitalGrid || null;
  const quantumGridWorkerResult = quantumGridRuntime?.lastResult || null;
  const quantumGridWorkerStatus = quantumGridWorkerResult?.webgpuStatus || {};
  const quantumMaterialRuntime = solverRuntimeStatus.quantumMaterialPotential || null;
  const quantumMaterialWorkerResult = quantumMaterialRuntime?.lastResult || null;
  const quantumMaterialForcePreview = quantumMaterialWorkerResult?.batch?.forceSurfacePreview
    || quantumMaterialTelemetry?.concurrentForceSurfacePreview
    || quantumMaterialTelemetry?.concurrentBatch?.forceSurfacePreview
    || quantumMaterialTelemetry?.forceSurfacePreview
    || null;
  const quantumMaterialLawGraph = quantumMaterialTelemetry?.lawGraphFragment
    || quantumMaterialTelemetry?.lawGraph
    || null;
  const quantumStatisticalEnsemble = quantumMaterialWorkerResult?.batch?.statisticalEnsemble
    || quantumMaterialTelemetry?.concurrentStatisticalEnsemble
    || quantumMaterialTelemetry?.concurrentBatch?.statisticalEnsemble
    || quantumMaterialTelemetry?.statisticalEnsemble
    || null;
  const quantumStatisticalSourceEquation = quantumMaterialWorkerResult?.batch?.statisticalSourceEquation
    || quantumStatisticalEnsemble?.sourceEquation
    || quantumMaterialTelemetry?.concurrentBatch?.statisticalSourceEquation
    || quantumMaterialTelemetry?.statisticalSourceEquation
    || null;
  const lawGraphReport = packet.lawGraph || model.state.lawGraph || null;
  const ulgRuntimeReport = packet.ulgRuntime || model.state.ulgRuntime || null;
  const ulgSpecContractReport = packet.upward?.aggregateState?.ulgSpecContracts || model.state.ulgSpecContracts || null;
  const quantumGridCadence = effectiveCadence.quantumOrbitalGrid
    ?? solverBudget.quantumOrbitalGrid?.cadenceFrames
    ?? 3;
  const quantumMaterialCadence = effectiveCadence.quantumMaterialPotential
    ?? solverBudget.quantumMaterialPotential?.cadenceFrames
    ?? 3;
  const molecularGpuStatus = molecularResult?.webgpuStatus || {};
  const managerStats = computeStatus.peercompute?.managerCapabilities?.stats;
  computeStatusReadout.textContent = formatComputeLine(computeStatus, overlay);
  const runtimeDebug = renderRuntimeDebugPanel(nowMs, { force: forceRuntimeDebug });
  const rows = [
    ['scale', status.layer.scale],
    ['representation', status.layer.representation],
    ['solver target', status.layer.solver],
    ['model tier', status.layer.modelTier],
    ['visual reference', visualReference?.activeReference
      ? `${visualReference.activeReference.sourceDemo} / band ${visualReference.activeReference.scaleBand} / ${visualReference.activeReference.bottomUpPriority}`
      : 'unmapped'],
    ['zoom continuity', visualReference?.zoomContinuity
      ? `${visualReference.zoomContinuity.mode} / ${visualReference.zoomContinuity.active ? `transition ${formatFixed(visualReference.zoomContinuity.progress, 2, '0.00')}` : 'settled'}`
      : 'warming'],
    ['compute', computeStatus.backend],
    ['manager', computeStatus.peercompute?.manager || 'unmanaged'],
    ['execution', computeStatus.peercompute?.execution || 'unmanaged'],
    ['workers', `${computeStatus.peercompute?.workerCount ?? 0}/${computeStatus.peercompute?.plannedWorkers ?? 0}`],
    ['manager stats', managerStats
      ? `${managerStats.totalTasksCompleted} done / ${managerStats.totalTasksFailed} fail / avg ${formatFixed(managerStats.averageTaskDurationMs, 2, '0.00')}ms / load ${formatFixed(managerStats.currentLoad, 2, '0.00')}`
      : 'warming'],
    ['manager families', formatManagerTaskFamilies(managerStats)],
    ['worker util', formatWorkerUtilization(managerStats?.workerUtilization)],
    ['task placement', formatTaskPlacement(managerStats?.taskPlacement)],
    ['device tier', computeStatus.peercompute?.computeBudget?.resourceTier || 'unknown'],
    ['environment', `${formatFixed(model.environment.ambientTemperatureK, 0)}K / ${formatFixed(model.environment.ambientPressurePa, 0)}Pa / O2 ${formatFixed(model.environment.oxygenFraction * 100, 0)}% / g ${formatFixed(model.environment.gravityMps2, 1)} / E ${formatExp(model.environment.electricFieldVm || 0, 2)}V/m / B ${formatFixed(model.environment.magneticFieldT || 0, 2)}T`],
    ['scenario', scenario?.active
      ? `${scenario.id} / ${scenario.modelTier} / ${scenario.normalization?.status || 'untracked'} / cal ${scenario.validation?.calibrationStatus || 'handoff-pending'} / ref ${scenario.handoffReadiness?.referenceInventory?.status || 'reference-pending'} / tol ${scenario.handoffReadiness?.toleranceSuite?.status || 'tolerance-pending'} / closure ${scenario.validation?.closureStatus || 'handoff-pending'} / probe ${scenario.validation?.closureModuleProbeStatus || 'probe-pending'} / host ${scenario.closureModuleProbe?.hostRuntimeProbe?.status || 'host-pending'} / exec ${scenario.closureModuleProbe?.hostRuntimeExecution?.status || 'exec-pending'} / xfer ${scenario.handoffReadiness?.transferManifest?.status || 'transfer-pending'} / runtime ${scenario.handoffReadiness?.scientificRuntimeGate?.status || 'runtime-pending'} / handoff ${scenario.handoffReadiness?.status || 'handoff-pending'} / blockers ${scenario.handoffReadiness?.blockerCount ?? '?'}`
      : 'default'],
    ['particle budget', computeStatus.peercompute?.computeBudget
      ? `${computeStatus.peercompute.computeBudget.totalParticleCount} x${computeStatus.peercompute.computeBudget.workersPerScale}/scale / cap ${formatFixed(computeStatus.peercompute.computeBudget.capacity?.budgetScale ?? 1, 2, '1.00')}x`
      : 'unknown'],
    ['memory pressure', formatMemoryPressure(memoryPressureReport)],
    ['network capacity', formatNetworkCapacity(networkCapacityReport)],
    ['placement plan', formatPlacementPlan(placementPlanReport)],
    ['remote place', formatRemotePlacementReadiness(remotePlacementReadinessReport)],
    ['remote config', formatRemotePlacementConfiguration(remotePlacementConfigurationReport)],
    ['remote peer', formatRemotePeerSelection(remotePeerSelectionReport)],
    ['remote peer plan', formatRemotePeerPlacementPlan(remotePeerPlacementPlan)],
    ['remote reliability', formatRemotePeerReliability(remotePeerReliabilityReport)],
    ['remote solver', formatRemoteSolverPlacementPolicy(remoteSolverPlacementPolicyReport)],
    ['remote decisions', summarizeRemoteSolverPlacementDecisions(remoteSolverPlacementDecisionReport)],
    ['node kernel', formatNodeKernelStatus(nodeKernelStatusReport)],
    ['solver admission', formatSolverAdmission(solverAdmissionReport)],
    ['compute resize', lastComputeCapacityResize
      ? `${lastComputeCapacityResize.reason} / ${lastComputeCapacityResize.pending ? 'pending' : 'ready'} / ${lastComputeCapacityResize.next?.plannedWorkers ?? 0} shards`
      : 'none'],
    ['resize corr', formatResizeCorrectionSummary(computeStatus.peercompute?.lastResize?.resizeCorrectionSummary)],
    ['sim quality', `${solverQualityMultiplier.toFixed(2)}x`],
    ['solver load', solverLoadReport?.dominantSolver
      ? `${solverLoadReport.dominantSolver} ${solverLoadReport.dominantPressure.toFixed(2)} / total ${solverLoadReport.totalPressure.toFixed(2)}`
      : 'warming'],
    ['solver scales', formatSolverWorkloadScales()],
    ['solver remap', formatSolverRemapSummary(lastSolverRemapReport)],
    ['solver budget', `${solverBudget.nbody.bodyCount} bodies ${solverBudget.nbody.gravityMode} / ${solverBudget.maxwell.width}x${solverBudget.maxwell.height} field / ${solverBudget.cosmologyExpansion.sampleCount} cos / ${solverBudget.molecularDynamics.atomCount} md / ${solverBudget.quantumOrbitalGrid?.gridSize || model.state.orbital.finiteGridSize}^3 qgrid / ${solverBudget.quantumMaterialPotential?.sampleCount || 0} qmat / ${solverBudget.sphMaterial.particleCount} sph / ${solverBudget.membraneShell.segmentCount} shell / ${solverBudget.hydroAtmosphere.width}x${solverBudget.hydroAtmosphere.height} hydro / ${solverBudget.radiationOpacity.width}x${solverBudget.radiationOpacity.height} rad / ${solverBudget.stellarFusion.width}x${solverBudget.stellarFusion.height} fusion / ${solverBudget.magnetospherePlasma.width}x${solverBudget.magnetospherePlasma.height} mhd / ${solverBudget.picPlasmaPatch.particleCount} pic ${solverBudget.picPlasmaPatch.gridWidth}x${solverBudget.picPlasmaPatch.gridHeight} / ${solverBudget.relativisticCorrection.sampleCount} rel / ${solverBudget.combustionPlume.width}x${solverBudget.combustionPlume.height} fire`],
    ['solver cadence', `n${effectiveCadence.nbody} m${effectiveCadence.maxwell} c${effectiveCadence.cosmologyExpansion} d${effectiveCadence.molecularDynamics} o${quantumGridCadence} r${effectiveCadence.reactiveThermal} s${effectiveCadence.sphMaterial} k${effectiveCadence.membraneShell} h${effectiveCadence.hydroAtmosphere} q${effectiveCadence.radiationOpacity} u${effectiveCadence.stellarFusion} p${effectiveCadence.magnetospherePlasma} x${effectiveCadence.picPlasmaPatch} z${effectiveCadence.relativisticCorrection} f${effectiveCadence.combustionPlume}`],
    ['solver focus', `${solverGovernorStatus.activeLayerId || status.layer.id} / ${solverGovernorStatus.activeLayerPolicy || MULTISCALE_SOLVER_ACTIVE_LAYER_POLICY}`],
    ['refinement schedule', formatLowerScaleRefinement(lowerScaleRefinementReport)],
    ['solver submit', formatSolverSubmissionBudget(solverSubmissionBudgetReport)],
    ['render budget', formatRenderBudget(renderBudgetReport)],
    ['readback budget', formatReadbackBudget(readbackBudgetReport)],
    ['state publish', formatStatePublicationBudget(statePublicationBudgetReport)],
    ['runtime diag', formatRuntimeDiagnosticsBudget(runtimeDiagnosticsBudgetReport)],
    ['hud mode', `${hudMode} / packet ${PACKET_PREVIEW_SCHEMA} / debug ${RUNTIME_DEBUG_RENDER_INTERVAL_MS}ms`],
    ['runtime scaler', `${runtimeScalerStatus.lastAction} / pressure ${runtimeScalerStatus.pressure.toFixed(2)} / avg ${runtimeScalerStatus.frameMsAvg.toFixed(1)}ms / wcool ${runtimeScalerStatus.workerCooldownFrames ?? 0}`],
    ['frame phases', formatFramePhaseTiming(framePhaseTimingReport)],
    ['readout cadence', `${READOUT_RENDER_INTERVAL_MS}ms / render ${readoutRenderCount}`],
    ['runtime debug', runtimeDebug?.schema || RUNTIME_DEBUG_SCHEMA],
    ['solver workers', `${computeStatus.peercompute?.solverRegistry?.solverCount ?? 0} registered`],
    ['closure deltas', `${Object.keys(getClosureDeltaSummary()).length} warm / ${CLOSURE_DELTA_SCOPE}`],
    ['conservation deltas', `${Object.keys(getConservationDeltaSummary()).length} warm / ${CONSERVATION_DELTA_SCOPE}`],
    ['conservation audit', packet.conservation?.schema
      ? `${packet.conservation.status} / energy ${packet.conservation.energyResidualProxy.toExponential(2)} / mass ${packet.conservation.massRelativeError.toExponential(2)}`
      : 'warming'],
    ['coupling deltas', `${Object.keys(getCouplingDeltaSummary()).length} warm / ${COUPLING_DELTA_SCOPE}`],
    ['source balances', `${Object.keys(getSourceSinkBalanceDeltaSummary()).length} warm / ${SOURCE_SINK_BALANCE_DELTA_SCOPE}`],
    ['source transfers', `${Object.keys(getSourceTransferDeltaSummary()).length} warm / ${SOURCE_TRANSFER_DELTA_SCOPE}`],
    ['transfer apply', `${Object.keys(getSourceTransferApplicationDeltaSummary()).length} warm / ${SOURCE_TRANSFER_APPLICATION_DELTA_SCOPE}`],
    ['transfer txn', `${Object.keys(getSourceTransferTransactionDeltaSummary()).length} warm / ${SOURCE_TRANSFER_TRANSACTION_DELTA_SCOPE}`],
    ['transfer preview', `${Object.keys(getSourceTransferTargetPreviewDeltaSummary()).length} warm / ${SOURCE_TRANSFER_TARGET_PREVIEW_DELTA_SCOPE}`],
    ['target mutators', `${Object.keys(getSourceTransferTargetMutatorRegistryDeltaSummary()).length} warm / ${SOURCE_TRANSFER_TARGET_MUTATOR_REGISTRY_DELTA_SCOPE}`],
    ['target preflight', `${Object.keys(getSourceTransferTargetMutationPreflightDeltaSummary()).length} warm / ${SOURCE_TRANSFER_TARGET_MUTATION_PREFLIGHT_DELTA_SCOPE}`],
    ['target op plan', `${Object.keys(getSourceTransferTargetMutationOperationPlanDeltaSummary()).length} warm / ${SOURCE_TRANSFER_TARGET_MUTATION_OPERATION_PLAN_DELTA_SCOPE}`],
    ['target invariants', `${Object.keys(getSourceTransferTargetMutationInvariantCheckDeltaSummary()).length} warm / ${SOURCE_TRANSFER_TARGET_MUTATION_INVARIANT_CHECK_DELTA_SCOPE}`],
    ['target commits', `${Object.keys(getSourceTransferTargetMutationCommitDeltaSummary()).length} warm / ${SOURCE_TRANSFER_TARGET_MUTATION_COMMIT_DELTA_SCOPE}`],
    ['target dispatch', `${Object.keys(getSourceTransferTargetMutationDispatchDeltaSummary()).length} warm / ${SOURCE_TRANSFER_TARGET_MUTATION_DISPATCH_DELTA_SCOPE}`],
    ['target apply val', `${Object.keys(getSourceTransferTargetMutationApplyValidationDeltaSummary()).length} warm / ${SOURCE_TRANSFER_TARGET_MUTATION_APPLY_VALIDATION_DELTA_SCOPE}`],
    ['target apply exec', `${Object.keys(getSourceTransferTargetMutationApplyExecutionDeltaSummary()).length} warm / ${SOURCE_TRANSFER_TARGET_MUTATION_APPLY_EXECUTION_DELTA_SCOPE}`],
    ['target intake', `${Object.keys(getSourceTransferTargetSourceIntakeDeltaSummary()).length} warm / ${SOURCE_TRANSFER_TARGET_SOURCE_INTAKE_DELTA_SCOPE}`],
    ['target response', `${Object.keys(getSourceTransferTargetSourceResponseDeltaSummary()).length} warm / ${SOURCE_TRANSFER_TARGET_SOURCE_RESPONSE_DELTA_SCOPE}`],
    ['target reconcile', `${Object.keys(getSourceTransferTargetSourceReconciliationDeltaSummary()).length} warm / ${SOURCE_TRANSFER_TARGET_SOURCE_RECONCILIATION_DELTA_SCOPE}`],
    ['source buffers', `${Object.keys(getConservativeSourceBufferDeltaSummary()).length} warm / ${CONSERVATIVE_SOURCE_BUFFER_DELTA_SCOPE}`],
    ['buffer apply', `${Object.keys(getSourceBufferApplicationDeltaSummary()).length} warm / ${SOURCE_BUFFER_APPLICATION_DELTA_SCOPE}`],
    ['buffer accept', `${Object.keys(getSourceBufferAcceptanceDeltaSummary()).length} warm / ${SOURCE_BUFFER_ACCEPTANCE_DELTA_SCOPE}`],
    ['buffer writeback', `${Object.keys(getSourceBufferWritebackValidationDeltaSummary()).length} warm / ${SOURCE_BUFFER_WRITEBACK_VALIDATION_DELTA_SCOPE}`],
    ['buffer replay', `${Object.keys(getTargetBufferReplayValidationDeltaSummary()).length} warm / ${TARGET_BUFFER_REPLAY_VALIDATION_DELTA_SCOPE}`],
    ['buffer mutate', `${Object.keys(getTargetBufferMutationAuditDeltaSummary()).length} warm / ${TARGET_BUFFER_MUTATION_AUDIT_DELTA_SCOPE}`],
    ['buffer queue', `${Object.keys(getTargetBufferWorkerWriteQueueDeltaSummary()).length} warm / ${TARGET_BUFFER_WORKER_WRITE_QUEUE_DELTA_SCOPE}`],
    ['buffer writer', `${Object.keys(getTargetBufferWorkerWriteExecutionDeltaSummary()).length} warm / ${TARGET_BUFFER_WORKER_WRITE_EXECUTION_DELTA_SCOPE}`],
    ['buffer verify', `${Object.keys(getTargetBufferWorkerWriteVerificationDeltaSummary()).length} warm / ${TARGET_BUFFER_WORKER_WRITE_VERIFICATION_DELTA_SCOPE}`],
    ['sci invariant gates', `${Object.keys(getScientificInvariantGateDeltaSummary()).length} warm / ${SCIENTIFIC_INVARIANT_GATE_DELTA_SCOPE}`],
    ['sci manifests', `${Object.keys(getScientificReadinessManifestDeltaSummary()).length} warm / ${SCIENTIFIC_READINESS_MANIFEST_DELTA_SCOPE}`],
    ['cross coupling', packet.coupling?.schema
      ? `${packet.coupling.status} / active ${packet.coupling.activeLinkCount}/${packet.coupling.linkCount} / top ${packet.coupling.strongestLinks?.[0]?.id || 'none'}`
      : 'warming'],
    ['law graph', formatLawGraphReport(lawGraphReport)],
    ['ulg spec', formatUlgSpecContracts(ulgSpecContractReport)],
    ['root contracts', formatUlgRootContracts(ulgSpecContractReport)],
    ['ulg runtime', formatUlgRuntime(ulgRuntimeReport)],
    ['ulg exec', formatUlgRuntimeExecution(solverRuntimeStatus.ulgRuntime?.lastResult || model.state.ulgRuntimeExecution)],
    ['field adapters', formatFieldAdapterPlan(packet.coupling?.fieldAdapterPlan)],
    ['field transfer', formatFieldTransferReport(packet.coupling?.fieldTransfer)],
    ['nbody solver', solverRuntimeStatus.nbody?.lastResult
      ? `${solverRuntimeStatus.nbody.lastResult.backend} / ${solverRuntimeStatus.nbody.lastResult.approximation?.mode || 'direct'} / step ${solverRuntimeStatus.nbody.lastResult.sequence} / energy drift ${solverRuntimeStatus.nbody.lastResult.conservation.relativeEnergyDrift.toExponential(2)}`
      : solverRuntimeStatus.nbody?.pending ? 'pending' : 'warming'],
    ['nbody overlay', nbodyOverlay.accepted
      ? `${nbodyOverlay.visible ? 'visible' : 'hidden'} / ${nbodyOverlay.bodyCount} bodies / ${nbodyOverlay.backend}`
      : nbodyOverlay.reason],
    ['reactive cell', solverRuntimeStatus.reactiveThermal?.lastResult
      ? `${solverRuntimeStatus.reactiveThermal.lastResult.backend} / ${solverRuntimeStatus.reactiveThermal.lastResult.temperatureK.toFixed(0)}K / heat ${solverRuntimeStatus.reactiveThermal.lastResult.heatReleaseNorm.toFixed(2)}`
      : solverRuntimeStatus.reactiveThermal?.pending ? 'pending' : 'warming'],
    ['sph material', solverRuntimeStatus.sphMaterial?.lastResult
      ? `${solverRuntimeStatus.sphMaterial.lastResult.backend} / ${solverRuntimeStatus.sphMaterial.lastResult.particleCount} particles / contact ${solverRuntimeStatus.sphMaterial.lastResult.fireContactFraction.toFixed(2)}`
      : solverRuntimeStatus.sphMaterial?.pending ? 'pending' : 'warming'],
    ['sph overlay', scene.getSphMaterialOverlayStatus().accepted
      ? `${scene.getSphMaterialOverlayStatus().visible ? 'visible' : 'hidden'} / ${scene.getSphMaterialOverlayStatus().particleCount} particles`
      : scene.getSphMaterialOverlayStatus().reason],
    ['membrane shell', solverRuntimeStatus.membraneShell?.lastResult
      ? `${solverRuntimeStatus.membraneShell.lastResult.backend} / ${solverRuntimeStatus.membraneShell.lastResult.segmentCount} seg / risk ${solverRuntimeStatus.membraneShell.lastResult.ruptureRisk.toFixed(2)} / integrity ${solverRuntimeStatus.membraneShell.lastResult.membraneIntegrity.toFixed(2)}`
      : solverRuntimeStatus.membraneShell?.pending ? 'pending' : 'warming'],
    ['maxwell tile', solverRuntimeStatus.maxwell?.lastResult
      ? `${solverRuntimeStatus.maxwell.lastResult.backend} / energy ${solverRuntimeStatus.maxwell.lastResult.fieldEnergy.toExponential(2)}`
      : solverRuntimeStatus.maxwell?.pending ? 'pending' : 'warming'],
    ['maxwell overlay', scene.getMaxwellOverlayStatus().accepted
      ? `${scene.getMaxwellOverlayStatus().visible ? 'visible' : 'hidden'} / ${scene.getMaxwellOverlayStatus().vectorCount} vectors`
      : scene.getMaxwellOverlayStatus().reason],
    ['cosmology web', solverRuntimeStatus.cosmologyExpansion?.lastResult
      ? `${solverRuntimeStatus.cosmologyExpansion.lastResult.backend} / a ${solverRuntimeStatus.cosmologyExpansion.lastResult.scaleFactor.toFixed(3)} / H ${solverRuntimeStatus.cosmologyExpansion.lastResult.hubbleRate.toFixed(3)} / void ${solverRuntimeStatus.cosmologyExpansion.lastResult.voidFraction.toFixed(2)}`
      : solverRuntimeStatus.cosmologyExpansion?.pending ? 'pending' : 'warming'],
    ['cosmology overlay', scene.getCosmologyExpansionOverlayStatus().accepted
      ? `${scene.getCosmologyExpansionOverlayStatus().visible ? 'visible' : 'hidden'} / ${scene.getCosmologyExpansionOverlayStatus().sampleCount} samples`
      : scene.getCosmologyExpansionOverlayStatus().reason],
    ['molecular recipe', `${formatMolecularComposition()} / ${countMolecularComposition()} atoms`],
    ['molecular md', solverRuntimeStatus.molecularDynamics?.lastResult
      ? `${solverRuntimeStatus.molecularDynamics.lastResult.backend} / ${solverRuntimeStatus.molecularDynamics.lastResult.webgpuStatus?.kernelMode || 'cpu-fallback'} / ${solverRuntimeStatus.molecularDynamics.lastResult.atomCount} atoms / ${solverRuntimeStatus.molecularDynamics.lastResult.bondCount} bonds / ${solverRuntimeStatus.molecularDynamics.lastResult.meanTemperatureK.toFixed(0)}K`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular ulg', molecularTelemetry
      ? `${molecularTelemetry.ulgStateDeltaApplied ? 'applied' : 'idle'} / ${molecularTelemetry.ulgStateDeltaApplicationMode || 'unavailable'} / kernel ${molecularTelemetry.ulgStateDeltaWebgpuKernelApplied ? 'webgpu' : 'none'} / ch ${molecularTelemetry.ulgStateDeltaAppliedChannelCount ?? 0} / dT ${formatFixed(molecularTelemetry.ulgStateDeltaTemperatureDeltaK ?? 0, 4)}K / hash ${molecularTelemetry.ulgStateDeltaHash || 'none'}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular force', molecularTelemetry
      ? `${molecularTelemetry.forceFieldForceLawModelId || molecularTelemetry.forceFieldForceLaw?.modelId || 'force-law-n/a'} / rest ${formatFixed(molecularTelemetry.forceFieldMeanPairRestLengthReducedNm ?? molecularTelemetry.forceFieldForceLaw?.meanPairRestLengthReducedNm ?? 0, 4)} / aff ${formatFixed(molecularTelemetry.forceFieldMeanPairAffinity ?? molecularTelemetry.forceFieldForceLaw?.meanPairAffinity ?? 0, 3)} / ionic ${molecularTelemetry.forceFieldIonicPairCandidateCount ?? molecularTelemetry.forceFieldForceLaw?.ionicPairCandidateCount ?? 0} / polar ${molecularTelemetry.forceFieldPolarPairCandidateCount ?? molecularTelemetry.forceFieldForceLaw?.polarPairCandidateCount ?? 0} / weak ${molecularTelemetry.forceFieldWeakPairCandidateCount ?? molecularTelemetry.forceFieldForceLaw?.weakPairCandidateCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular geometry', molecularTelemetry
      ? `${molecularTelemetry.waterGeometrySourceApplied ? 'qmat' : 'md-ref'} / ${molecularTelemetry.molecularGeometryForceLawModelId || molecularTelemetry.molecularGeometryForceLaw?.modelId || 'geometry-n/a'} / H2O ${molecularTelemetry.waterGeometryTripletCount ?? 0} / target ${formatFixed(molecularTelemetry.waterGeometryTargetAngleDeg ?? molecularTelemetry.molecularGeometryForceLaw?.targetAngleDeg ?? 0, 2)}deg / angle ${formatFixed(molecularTelemetry.waterGeometryMeanAngleDeg ?? 0, 2)}deg / err ${formatFixed(molecularTelemetry.waterGeometryMeanAbsAngleErrorDeg ?? 0, 2)}deg / OH ${formatFixed(molecularTelemetry.waterGeometryMeanOhDistanceReducedNm ?? 0, 4)}:${formatFixed(molecularTelemetry.waterGeometryTargetOhDistanceReducedNm ?? 0, 4)} / HH ${formatFixed(molecularTelemetry.waterGeometryMeanHhDistanceReducedNm ?? 0, 4)}:${formatFixed(molecularTelemetry.waterGeometryTargetHhDistanceReducedNm ?? 0, 4)} / close ${formatFixed(molecularTelemetry.waterGeometryClosureFraction ?? 0, 2)} / E ${formatExp(molecularTelemetry.waterGeometryEnergyProxy ?? 0, 2)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular energy', molecularTelemetry
      ? `E ${formatExp(molecularTelemetry.forceFieldTotalEnergyProxy ?? molecularTelemetry.totalEnergyProxy ?? 0, 2)} / U ${formatExp(molecularTelemetry.forceFieldPotentialEnergyProxy ?? molecularTelemetry.potentialEnergyProxy ?? 0, 2)} / bond ${formatExp(molecularTelemetry.forceFieldBondedAttractionEnergyProxy ?? 0, 2)} / geom ${formatExp(molecularTelemetry.waterGeometryEnergyProxy ?? molecularTelemetry.forceEnergyLedger?.waterGeometryEnergyProxy ?? 0, 2)} / elec ${formatExp(molecularTelemetry.forceFieldElectrostaticEnergyProxy ?? 0, 2)} / rep ${formatExp(molecularTelemetry.forceFieldRepulsionEnergyProxy ?? 0, 2)} / qeq ${formatExp(molecularTelemetry.forceFieldQeqResidualPenaltyProxy ?? 0, 2)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular phase', molecularTelemetry
      ? `${molecularTelemetry.phaseRegime || molecularTelemetry.thermoPhaseLedger?.phaseRegime || 'unknown'} / ice ${formatFixed(molecularTelemetry.solidFraction ?? molecularTelemetry.thermoPhaseLedger?.solidFraction ?? 0, 2)} / liq ${formatFixed(molecularTelemetry.liquidFraction ?? molecularTelemetry.thermoPhaseLedger?.liquidFraction ?? 0, 2)} / vap ${formatFixed(molecularTelemetry.vaporFraction ?? molecularTelemetry.thermoPhaseLedger?.vaporFraction ?? 0, 2)} / plasma ${formatFixed(molecularTelemetry.plasmaFraction ?? molecularTelemetry.thermoPhaseLedger?.plasmaFraction ?? 0, 2)} / latent ${formatExp(molecularTelemetry.latentHeatSinkProxy ?? molecularTelemetry.thermoPhaseLedger?.latentHeatSinkProxy ?? 0, 2)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular eos', molecularTelemetry
      ? `F ${formatExp(molecularTelemetry.specificFreeEnergyProxy ?? molecularTelemetry.thermoPhaseLedger?.specificFreeEnergyProxy ?? molecularTelemetry.molecularPhaseEosFreeEnergyProxy ?? 0, 2)} / H ${formatExp(molecularTelemetry.specificEnthalpyProxy ?? molecularTelemetry.thermoPhaseLedger?.specificEnthalpyProxy ?? molecularTelemetry.molecularPhaseEosEnthalpyProxy ?? 0, 2)} / dE ${formatExp(molecularTelemetry.phaseEnergyRateProxy ?? molecularTelemetry.thermoPhaseLedger?.phaseEnergyRateProxy ?? molecularEquation?.phaseEnergyRateWProxy ?? 0, 2)} / resid ${formatFixed(molecularTelemetry.phaseStabilityResidualProxy ?? molecularTelemetry.thermoPhaseLedger?.phaseStabilityResidualProxy ?? molecularEquation?.phaseEosStabilityResidualProxy ?? 0, 3)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular ledger', molecularTelemetry
      ? `${molecularTelemetry.dominantMolecule || 'none'} / comps ${molecularTelemetry.reactionLedger?.componentCount ?? 0} / closed ${molecularTelemetry.reactionLedger?.stoichiometryClosed === true ? 'yes' : 'no'} / resid ${formatFixed(molecularTelemetry.stoichiometryResidualProxy ?? 0, 3)} / evt ${molecularTelemetry.reactionEventCount ?? 0} / src ${formatFixed(molecularTelemetry.reactionHeatSourceProxy ?? 0, 2)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular balance', molecularBalance
      ? `${molecularBalance.status || 'tracked'} / cov ${formatFixed(molecularBalance.sourceDriveCoverage ?? molecularBalance.coverage?.sourceDriveCoverage ?? 0, 2)} / resid ${formatFixed(molecularBalance.balanceResidualProxy ?? molecularBalance.residuals?.balanceResidualProxy ?? 0, 3)} / targets ${molecularBalance.activeTargetCount ?? molecularBalance.coverage?.activeTargetCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular equation', molecularEquation
      ? `${molecularEquation.status || 'tracked'} / dT ${formatFixed(molecularEquation.temperatureRateKPerSProxy ?? molecularEquation.terms?.energy?.temperatureRateKPerSProxy ?? 0, 3)}K/s / Q ${formatExp(molecularEquation.sourceRateWProxy ?? molecularEquation.terms?.energy?.sourceRateWProxy ?? 0, 2)}W / R ${formatExp(molecularEquation.sourceRateCountPerSProxy ?? molecularEquation.terms?.species?.sourceRateCountPerSProxy ?? 0, 2)}/s`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular transfer', molecularTransfer
      ? `${molecularTransfer.status || 'dry-run'} / dry ${molecularTransfer.dryRun === true ? 'yes' : 'no'} / alloc ${molecularTransfer.allocationCount ?? molecularTransfer.allocations?.length ?? 0} / resid ${formatFixed(molecularTransfer.closedSystemResidualProxy ?? molecularTransfer.residuals?.closedSystemResidualProxy ?? 0, 3)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular apply', molecularTransferApplication
      ? `${molecularTransferApplication.status || 'gated'} / can ${molecularTransferApplication.canApply ? 'yes' : 'no'} / ready ${molecularTransferApplication.readyTargetCount ?? 0}/${molecularTransferApplication.allocationCount ?? 0} / block ${molecularTransferApplication.blockerCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular txn', molecularTransferTransaction
      ? `${molecularTransferTransaction.status || 'blocked'} / allow ${molecularTransferTransaction.allowed ? 'yes' : 'no'} / applied ${molecularTransferTransaction.appliedTargetCount ?? 0}/${molecularTransferTransaction.targetCount ?? 0} / block ${molecularTransferTransaction.blockerCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular preview', molecularTransferTargetPreview
      ? `${molecularTransferTargetPreview.status || 'preview'} / targets ${molecularTransferTargetPreview.previewTargetCount ?? molecularTransferTargetPreview.targets?.length ?? 0} / dT ${formatFixed(molecularTransferTargetPreview.maxAbsTemperatureDeltaKProxy ?? molecularTransferTargetPreview.sourceTerms?.maxAbsTemperatureDeltaKProxy ?? 0, 4)}K / applied ${molecularTransferTargetPreview.appliedTargetCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular mutators', molecularTargetMutatorRegistry
      ? `${molecularTargetMutatorRegistry.status || 'registry'} / reg ${molecularTargetMutatorRegistry.registeredMutatorCount ?? 0}/${molecularTargetMutatorRegistry.targetCount ?? 0} / valid ${molecularTargetMutatorRegistry.validatedMutatorCount ?? 0} / block ${molecularTargetMutatorRegistry.blockerCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular preflight', molecularTargetMutationPreflight
      ? `${molecularTargetMutationPreflight.status || 'preflight'} / pass ${molecularTargetMutationPreflight.passedTargetCount ?? 0}/${molecularTargetMutationPreflight.targetCount ?? 0} / risk ${formatFixed(molecularTargetMutationPreflight.maxResidualRiskProxy ?? 0, 3)} / block ${molecularTargetMutationPreflight.blockerCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular op plan', molecularTargetMutationOperationPlan
      ? `${molecularTargetMutationOperationPlan.status || 'op-plan'} / ops ${molecularTargetMutationOperationPlan.operationCount ?? 0} / allow ${molecularTargetMutationOperationPlan.allowedByRegistryOperationCount ?? 0} / block ${molecularTargetMutationOperationPlan.blockedOperationCount ?? 0} / d ${formatFixed(molecularTargetMutationOperationPlan.maxAbsFieldDeltaProxy ?? 0, 3)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular invariants', molecularTargetMutationInvariantCheck
      ? `${molecularTargetMutationInvariantCheck.status || 'invariants'} / pass ${molecularTargetMutationInvariantCheck.passedTargetCount ?? 0}/${molecularTargetMutationInvariantCheck.targetCount ?? 0} / miss ${molecularTargetMutationInvariantCheck.missingInvariantScopeCount ?? 0} / res ${formatFixed(molecularTargetMutationInvariantCheck.maxResidualProxy ?? 0, 3)} / block ${molecularTargetMutationInvariantCheck.blockerCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular commit', molecularTargetMutationCommit
      ? `${molecularTargetMutationCommit.status || 'commit'} / elig ${molecularTargetMutationCommit.invariantEligibleTargetCount ?? 0}/${molecularTargetMutationCommit.targetCount ?? 0} / can ${molecularTargetMutationCommit.committableTargetCount ?? 0} / ops ${molecularTargetMutationCommit.committedOperationCount ?? 0}/${molecularTargetMutationCommit.plannedOperationCount ?? 0} / block ${molecularTargetMutationCommit.blockerCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular dispatch', molecularTargetMutationDispatch
      ? `${molecularTargetMutationDispatch.status || 'dispatch'} / batch ${molecularTargetMutationDispatch.invariantEligibleBatchCount ?? 0}/${molecularTargetMutationDispatch.batchCount ?? 0} / can ${molecularTargetMutationDispatch.dispatchableBatchCount ?? 0} / ops ${molecularTargetMutationDispatch.dispatchedOperationCount ?? 0}/${molecularTargetMutationDispatch.operationCount ?? 0} / block ${molecularTargetMutationDispatch.blockerCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular apply val', molecularTargetMutationApplyValidation
      ? `${molecularTargetMutationApplyValidation.status || 'apply-validation'} / valid ${molecularTargetMutationApplyValidation.validatedTargetCount ?? 0}/${molecularTargetMutationApplyValidation.targetCount ?? 0} / ready ${molecularTargetMutationApplyValidation.applyReadyTargetCount ?? 0} / ops ${molecularTargetMutationApplyValidation.appliedOperationCount ?? 0}/${molecularTargetMutationApplyValidation.operationCount ?? 0} / res ${formatFixed(molecularTargetMutationApplyValidation.maxBeforeAfterResidualProxy ?? 0, 3)} / block ${molecularTargetMutationApplyValidation.blockerCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular apply exec', molecularTargetMutationApplyExecution
      ? `${molecularTargetMutationApplyExecution.status || 'apply-exec'} / applied ${molecularTargetMutationApplyExecution.appliedTargetCount ?? 0}/${molecularTargetMutationApplyExecution.targetCount ?? 0} / ops ${molecularTargetMutationApplyExecution.appliedOperationCount ?? 0}/${molecularTargetMutationApplyExecution.operationCount ?? 0} / res ${formatFixed(molecularTargetMutationApplyExecution.maxBeforeAfterResidualProxy ?? 0, 3)} / block ${molecularTargetMutationApplyExecution.blockerCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular intake', molecularTargetSourceIntake
      ? `${molecularTargetSourceIntake.status || 'intake'} / active ${molecularTargetSourceIntake.activeTargetCount ?? 0}/${molecularTargetSourceIntake.targetCount ?? 0} / ops ${molecularTargetSourceIntake.appliedOperationCount ?? 0}/${molecularTargetSourceIntake.operationCount ?? 0} / heat ${formatFixed(molecularTargetSourceIntake.totalHeatRateWProxy ?? 0, 3)} / drive ${formatFixed(molecularTargetSourceIntake.maxThermalDrive ?? 0, 3)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular response', molecularTargetSourceResponse
      ? `${molecularTargetSourceResponse.status || 'response'} / ack ${molecularTargetSourceResponse.respondedTargetCount ?? 0}/${molecularTargetSourceResponse.activeTargetCount ?? 0} / pending ${molecularTargetSourceResponse.pendingTargetCount ?? 0} / drive ${formatFixed(molecularTargetSourceResponse.totalResponseThermalDrive ?? 0, 3)} / flux ${formatFixed(molecularTargetSourceResponse.totalHeatFluxResponseProxy ?? 0, 2)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular reconcile', molecularTargetSourceReconciliation
      ? `${molecularTargetSourceReconciliation.status || 'reconcile'} / ok ${molecularTargetSourceReconciliation.reconciledTargetCount ?? 0}/${molecularTargetSourceReconciliation.activeTargetCount ?? 0} / pending ${molecularTargetSourceReconciliation.pendingTargetCount ?? 0} / res ${formatFixed(molecularTargetSourceReconciliation.reconciliationResidualProxy ?? 0, 3)} / unack ${formatFixed(molecularTargetSourceReconciliation.unacknowledgedThermalDrive ?? 0, 3)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular buffer', molecularConservativeSourceBuffer
      ? `${molecularConservativeSourceBuffer.status || 'buffer'} / dispatch ${molecularConservativeSourceBuffer.dispatchableTargetCount ?? 0}/${molecularConservativeSourceBuffer.activeTargetCount ?? 0} / terms ${molecularConservativeSourceBuffer.sourceTermCount ?? 0} / heat ${formatFixed(molecularConservativeSourceBuffer.totalHeatRateWProxy ?? 0, 3)} / res ${formatFixed(molecularConservativeSourceBuffer.sourceBufferResidualProxy ?? 0, 3)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular qmat buffer', molecularConservativeSourceBuffer
      ? `${molecularSourceBufferQmatSource?.active ? 'active' : 'idle'} / targets ${molecularSourceBufferQmatActiveTargetCount}/${molecularConservativeSourceBuffer.dispatchableTargetCount ?? 0} / stride ${molecularConservativeSourceBuffer.bufferStrideFloats ?? 0} / qmat ${molecularSourceBufferQmatSource?.schema || 'none'} / flux ${formatFixed(molecularSourceBufferQmatThermalFlux, 3)} / phase ${formatFixed(molecularSourceBufferQmatPhaseDrive, 3)} / elec ${formatExp(molecularSourceBufferQmatElectricalDrive, 2)} / mech ${formatExp(molecularSourceBufferQmatMechanicalDrive, 2)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular qstat buffer', molecularConservativeSourceBuffer
      ? `${molecularSourceBufferQstatSource?.active ? 'active' : 'idle'} / targets ${molecularSourceBufferQstatActiveTargetCount}/${molecularConservativeSourceBuffer.dispatchableTargetCount ?? 0} / ch ${molecularSourceBufferQstatChannelCount} / press ${formatFixed(molecularSourceBufferQstatPressure, 3)} / opac ${formatFixed(molecularSourceBufferQstatOpacity, 3)} / deg ${formatFixed(molecularSourceBufferQstatDegeneracy, 3)} / dT ${formatFixed(molecularSourceBufferQstatTemperature, 3)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['qmat deriv buffer', molecularConservativeSourceBuffer
      ? `${molecularSourceBufferQderivSource?.active ? 'active' : 'idle'} / targets ${molecularSourceBufferQderivActiveTargetCount}/${molecularConservativeSourceBuffer.dispatchableTargetCount ?? 0} / T ${formatExp(molecularSourceBufferQderivTemperatureDrive, 2)} P ${formatExp(molecularSourceBufferQderivPressureDrive, 2)} F ${formatExp(molecularSourceBufferQderivFieldDrive, 2)} R ${formatExp(molecularSourceBufferQderivRadiationDrive, 2)} / flux ${formatFixed(molecularSourceBufferQderivThermalFlux, 3)} / phase ${formatFixed(molecularSourceBufferQderivPhaseDrive, 3)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular buffer apply', molecularSourceBufferApplication
      ? `applied ${molecularSourceBufferApplication.appliedTargetCount ?? 0} targets / fields ${molecularSourceBufferApplication.appliedFieldCount ?? 0} / terms ${molecularSourceBufferApplication.sourceTermCount ?? 0} / drive ${formatFixed(molecularSourceBufferApplication.thermalDrive ?? 0, 3)} / res ${formatFixed(molecularSourceBufferApplication.residual ?? 0, 3)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular buffer accept', molecularSourceBufferAcceptance
      ? `${molecularSourceBufferAcceptance.status || 'acceptance'} / accept ${molecularSourceBufferAcceptance.acceptedTargetCount ?? 0}/${molecularSourceBufferAcceptance.targetCount ?? 0} / can ${molecularSourceBufferAcceptance.canMutateProxy ? 'yes' : 'no'} / res ${formatFixed(molecularSourceBufferAcceptance.maxApplicationResidualProxy ?? 0, 3)} / block ${molecularSourceBufferAcceptance.blockerCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular buffer writeback', molecularSourceBufferWritebackValidation
      ? `${molecularSourceBufferWritebackValidation.status || 'writeback'} / valid ${molecularSourceBufferWritebackValidation.validatedTargetCount ?? 0}/${molecularSourceBufferWritebackValidation.targetCount ?? 0} / can ${molecularSourceBufferWritebackValidation.canWritebackProxy ? 'yes' : 'no'} / res ${formatFixed(molecularSourceBufferWritebackValidation.maxWritebackResidualProxy ?? 0, 3)} / block ${molecularSourceBufferWritebackValidation.blockerCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular buffer replay', molecularTargetBufferReplayValidation
      ? `${molecularTargetBufferReplayValidation.status || 'replay'} / valid ${molecularTargetBufferReplayValidation.replayedTargetCount ?? 0}/${molecularTargetBufferReplayValidation.targetCount ?? 0} / fields ${molecularTargetBufferReplayValidation.replayedFieldCount ?? 0}/${molecularTargetBufferReplayValidation.applicationFieldCount ?? 0} / can ${molecularTargetBufferReplayValidation.canReplayProxy ? 'yes' : 'no'} / res ${formatFixed(molecularTargetBufferReplayValidation.maxReplayResidualProxy ?? 0, 3)} / block ${molecularTargetBufferReplayValidation.blockerCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular buffer mutate', molecularTargetBufferMutationAudit
      ? `${molecularTargetBufferMutationAudit.status || 'audit'} / ready ${molecularTargetBufferMutationAudit.readyTargetCount ?? 0}/${molecularTargetBufferMutationAudit.targetCount ?? 0} / intents ${molecularTargetBufferMutationAudit.readyWriteIntentCount ?? 0}/${molecularTargetBufferMutationAudit.writeIntentCount ?? 0} / proxy ${molecularTargetBufferMutationAudit.canMutateProxy ? 'yes' : 'no'} / worker ${molecularTargetBufferMutationAudit.canQueueWorkerWrite ? 'queue' : 'blocked'} / sci ${molecularTargetBufferMutationAudit.scientificMutationReady ? 'yes' : 'no'}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular buffer queue', molecularTargetBufferWorkerWriteQueue
      ? `${molecularTargetBufferWorkerWriteQueue.status || 'queue'} / batches ${molecularTargetBufferWorkerWriteQueue.queueReadyBatchCount ?? 0}/${molecularTargetBufferWorkerWriteQueue.targetBatchCount ?? 0} / intents ${molecularTargetBufferWorkerWriteQueue.queueReadyWriteIntentCount ?? 0}/${molecularTargetBufferWorkerWriteQueue.writeIntentCount ?? 0} / plan ${molecularTargetBufferWorkerWriteQueue.canPlanWorkerWrite ? 'yes' : 'no'} / worker ${molecularTargetBufferWorkerWriteQueue.canQueueWorkerWrite ? 'queue' : 'blocked'} / sci ${molecularTargetBufferWorkerWriteQueue.scientificMutationReady ? 'yes' : 'no'}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['buffer writer ctrl', `${molecularBufferWriterAutoEnabled ? 'auto' : 'manual'} / every ${molecularBufferWriterAutoIntervalFrames}f / run ${molecularBufferWriterRunCount} / ${molecularBufferWriterLastReason}`],
    ['molecular buffer writer', molecularTargetBufferWorkerWriteExecution
      ? `${molecularTargetBufferWorkerWriteExecution.status || 'writer'} / batches ${molecularTargetBufferWorkerWriteExecution.appliedBatchCount ?? 0}/${molecularTargetBufferWorkerWriteExecution.targetBatchCount ?? 0} / intents ${molecularTargetBufferWorkerWriteExecution.appliedWriteIntentCount ?? 0}/${molecularTargetBufferWorkerWriteExecution.writeIntentCount ?? 0} / exec ${molecularTargetBufferWorkerWriteExecution.canExecuteProxy ? 'yes' : 'no'} / applied ${molecularTargetBufferWorkerWriteExecution.applied ? 'yes' : 'no'} / sci ${molecularTargetBufferWorkerWriteExecution.scientificMutationReady ? 'yes' : 'no'}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular buffer verify', molecularTargetBufferWorkerWriteVerification
      ? `${molecularTargetBufferWorkerWriteVerification.status || 'verify'} / targets ${molecularTargetBufferWorkerWriteVerification.verifiedTargetCount ?? 0}/${molecularTargetBufferWorkerWriteVerification.targetBatchCount ?? 0} / fields ${molecularTargetBufferWorkerWriteVerification.verifiedFieldWriteCount ?? 0}/${molecularTargetBufferWorkerWriteVerification.fieldWriteCount ?? 0} / can ${molecularTargetBufferWorkerWriteVerification.canVerifyProxy ? 'yes' : 'no'} / verified ${molecularTargetBufferWorkerWriteVerification.verified ? 'yes' : 'no'} / sci ${molecularTargetBufferWorkerWriteVerification.scientificMutationReady ? 'yes' : 'no'}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular sci gate', molecularScientificInvariantGate
      ? `${molecularScientificInvariantGate.status || 'gate'} / proxy ${molecularScientificInvariantGate.proxySatisfiedScopeCount ?? 0}/${molecularScientificInvariantGate.requiredScopeCount ?? 0} / auth ${molecularScientificInvariantGate.authoritativeSatisfiedScopeCount ?? 0}/${molecularScientificInvariantGate.requiredScopeCount ?? 0} / block ${molecularScientificInvariantGate.blockedScopeCount ?? 0} / promote ${molecularScientificInvariantGate.canPromoteProxy ? 'proxy' : 'no'} / sci ${molecularScientificInvariantGate.scientificMutationReady ? 'yes' : 'no'}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular sci manifest', molecularScientificReadinessManifest
      ? `${molecularScientificReadinessManifest.status || 'manifest'} / proxy ${molecularScientificReadinessManifest.proxySatisfiedArtifactCount ?? 0}/${molecularScientificReadinessManifest.requiredArtifactCount ?? 0} / auth ${molecularScientificReadinessManifest.authoritativeReadyArtifactCount ?? 0}/${molecularScientificReadinessManifest.requiredArtifactCount ?? 0} / block ${molecularScientificReadinessManifest.blockedArtifactCount ?? 0} / next ${molecularScientificReadinessManifest.nextRequiredArtifactId || 'none'}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular bonds', molecularTelemetry
      ? `ionic ${molecularTelemetry.ionicBondCount ?? 0} / covalent ${molecularTelemetry.covalentBondCount ?? 0} / polar ${formatFixed(molecularTelemetry.polarBondFraction)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular electrical', molecularTelemetry
      ? `dipole ${formatFixed(molecularTelemetry.dipoleMomentProxy, 3)} / sigma ${formatFixed(molecularTelemetry.electricalConductivityProxy, 3)} / eps ${formatFixed(molecularTelemetry.dielectricConstantProxy ?? 1, 2)} / n ${formatFixed(molecularTelemetry.refractiveIndexProxy ?? 1, 2)} / |q| ${formatExp(molecularTelemetry.meanAbsCharge, 2)} / valence ${formatFixed(molecularTelemetry.valenceSaturation)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular qeq', molecularTelemetry
      ? `${molecularTelemetry.chargeEquilibration?.mode || 'qeq'} / rms ${formatExp(molecularTelemetry.chargeEquilibrationResidualRms ?? 0, 2)} / dq ${formatExp(molecularTelemetry.chargeEquilibrationChargeRmsDelta ?? 0, 2)} / neutral ${formatExp(molecularTelemetry.chargeEquilibrationNeutralizationCharge ?? 0, 2)} / resq ${formatExp(molecularTelemetry.chargeEquilibrationNeutralizationResidualCharge ?? 0, 2)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['qmat electronic', molecularTelemetry
      ? `${molecularTelemetry.quantumMaterialElectronicChargeSourceApplied ? 'qmat' : 'idle'} / ${molecularTelemetry.quantumMaterialElectronicChargeSourceModelId || molecularTelemetry.quantumMaterialElectronicChargeSourceSchema || 'unavailable'} / pair ${molecularTelemetry.quantumMaterialElectronicChargeTargetPairLabel || 'all'} / q ${formatExp(molecularTelemetry.quantumMaterialElectronicChargeDeltaProxy ?? 0, 2)} / ion ${formatExp(molecularTelemetry.quantumMaterialElectronicIonizationDriveProxy ?? 0, 2)} / mob ${formatExp(molecularTelemetry.quantumMaterialElectronicChargeMobilityProxy ?? 0, 2)} / soft ${formatExp(molecularTelemetry.quantumMaterialElectronicHardnessSofteningProxy ?? 0, 2)} / screen ${formatFixed(molecularTelemetry.quantumMaterialElectronicScreeningDampingScale ?? 1, 3)} / qeq ${formatExp(molecularTelemetry.quantumMaterialElectronicQeqMixProxy ?? 0, 2)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['qmat barrier', molecularTelemetry
      ? `${molecularTelemetry.quantumMaterialReactionBarrierSurfaceApplied ? 'gate' : 'idle'} / ${molecularTelemetry.quantumMaterialReactionBarrierSurfaceModelId || molecularTelemetry.quantumMaterialReactionBarrierSurfaceSchema || 'unavailable'} / rxn ${molecularTelemetry.quantumMaterialReactionBarrierTargetReactionId || 'n/a'} / pair ${molecularTelemetry.quantumMaterialReactionBarrierTargetPairLabel || 'all'} / Ea ${formatExp(molecularTelemetry.quantumMaterialReactionBarrierActivationEnergyEvProxy ?? 0, 2)}eV / p ${formatExp(molecularTelemetry.quantumMaterialReactionBarrierProbabilityProxy ?? 0, 2)} / damp ${formatFixed(molecularTelemetry.quantumMaterialReactionBarrierGateDampingScale ?? 1, 3)} / gate ${formatFixed(molecularTelemetry.quantumMaterialReactionBarrierGateProxy ?? 0, 3)} / blockers ${molecularTelemetry.quantumMaterialReactionBarrierUnsupportedProductBlockerCount ?? 0} / gated ${molecularTelemetry.reactionBarrierGatedCandidateCount ?? 0}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular quantum', molecularTelemetry
      ? `${molecularTelemetry.quantumCouplingApplied ? 'coupled' : 'idle'} ${molecularTelemetry.quantumCouplingElementSymbol || quantumTelemetry?.elementSymbol || 'n/a'} / atoms ${molecularTelemetry.quantumCouplingMatchedAtomCount ?? 0} / src ${molecularTelemetry.quantumWavefunctionEvolutionSource || 'unavailable'} / radial ${molecularTelemetry.quantumRadialEigenstateWebgpuExecuted ? 'webgpu' : 'off'} / kernel ${molecularTelemetry.quantumCouplingWebgpuKernelApplied ? 'webgpu' : 'none'} / ${molecularTelemetry.quantumCouplingApplicationMode || 'unavailable'} / dT ${formatFixed(molecularTelemetry.quantumCouplingTemperatureDeltaK ?? 0, 4)}K / evo ${formatExp(molecularTelemetry.quantumEvolutionDrive ?? 0, 2)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular qgrid stat', molecularTelemetry
      ? `${molecularTelemetry.quantumStatisticalBridgeWebgpuExecuted ? 'webgpu' : 'idle'} / ${molecularTelemetry.quantumStatisticalBridgeStatus || 'unavailable'} / Zlog ${formatFixed(molecularTelemetry.quantumStatisticalBridgePartitionFunctionLog ?? 0, 3)} / ex ${formatExp(molecularTelemetry.quantumStatisticalBridgeExcitedOccupation ?? 0, 2)} / Cv ${formatExp(molecularTelemetry.quantumStatisticalBridgeHeatCapacityProxy ?? 0, 2)} / ion ${formatExp(molecularTelemetry.quantumStatisticalBridgeIonizationFraction ?? 0, 2)} / op ${formatExp(molecularTelemetry.quantumStatisticalBridgeOpacityPopulationProxy ?? 0, 2)} / deg ${formatExp(molecularTelemetry.quantumStatisticalBridgeDegeneracyParameter ?? 0, 2)} / dT ${formatFixed(molecularTelemetry.quantumStatisticalBridgeTemperatureDeltaKProxy ?? 0, 4)}K / q ${formatExp(molecularTelemetry.quantumStatisticalBridgeChargeDeltaProxy ?? 0, 2)} / drive ${formatExp(molecularTelemetry.quantumStatisticalBridgeDrive ?? 0, 2)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular qmat', molecularTelemetry
      ? `${molecularTelemetry.quantumMaterialSourceApplied ? 'coupled' : 'idle'} ${molecularTelemetry.quantumMaterialSourceDominantFormula || molecularTelemetry.quantumMaterialSourceElementSymbol || quantumMaterialTelemetry?.dominantFormula || quantumMaterialTelemetry?.elementSymbol || 'n/a'} / ${molecularTelemetry.quantumMaterialSourceBackend || 'unavailable'} / rec ${molecularTelemetry.quantumMaterialSourceRecordCount ?? 0} / kernel ${molecularTelemetry.quantumMaterialSourceWebgpuKernelApplied ? 'webgpu' : 'none'} / ${molecularTelemetry.quantumMaterialSourceMode || 'unavailable'} / target ${molecularTelemetry.quantumMaterialSourceTargetPairLabel || 'all'} atoms ${molecularTelemetry.quantumMaterialSourceTargetAtomCount ?? 0}+${molecularTelemetry.quantumMaterialSourceTargetFallbackAtomCount ?? 0} mean ${formatFixed(molecularTelemetry.quantumMaterialSourceTargetAtomMeanFactor ?? 0, 2)} / pairs ${molecularTelemetry.quantumMaterialSourceTargetPairSelectedCount ?? 0}/${molecularTelemetry.quantumMaterialSourceTargetPairCandidateCount ?? 0} sel ${formatFixed(molecularTelemetry.quantumMaterialSourcePairSelectivity ?? 0, 2)} / F ${formatExp(molecularTelemetry.quantumMaterialSourceMeanForceGradientEvPerAngstrom ?? 0, 2)} / bond ${formatFixed(molecularTelemetry.quantumMaterialSourceBondOrderScale ?? 1, 3)} / pair ${formatFixed(molecularTelemetry.quantumMaterialSourcePairForceScale ?? 1, 3)} rest ${formatExp(molecularTelemetry.quantumMaterialSourceRestLengthDeltaAngstrom ?? 0, 2)} mix ${formatFixed(molecularTelemetry.quantumMaterialSourcePairForceMix ?? 0, 3)} / prop sigma ${formatExp(molecularTelemetry.quantumMaterialSourceElectricalConductivitySpm ?? 0, 2)} eps ${formatFixed(molecularTelemetry.quantumMaterialSourceDielectricConstant ?? 1, 2)} n ${formatFixed(molecularTelemetry.quantumMaterialSourceRefractiveIndex ?? 1, 2)} stiff ${formatExp(molecularTelemetry.quantumMaterialSourceMechanicalResponsePa ?? 0, 2)} / drives c ${formatExp(molecularTelemetry.quantumMaterialSourceConductivityDrive ?? 0, 2)} d ${formatExp(molecularTelemetry.quantumMaterialSourceDielectricDrive ?? 0, 2)} k ${formatExp(molecularTelemetry.quantumMaterialSourceMechanicalStiffnessDrive ?? 0, 2)} op ${formatExp(molecularTelemetry.quantumMaterialSourceOpticalAbsorptionDrive ?? 0, 2)} / ensP ${formatFixed(molecularTelemetry.quantumMaterialSourceEnsemblePressureRatio ?? 1, 3)} drive ${formatExp(molecularTelemetry.quantumMaterialSourceEnsemblePressureDrive ?? 0, 2)} Cv ${formatExp(molecularTelemetry.quantumMaterialSourceHeatCapacityProxy ?? 0, 2)} damp ${formatFixed(molecularTelemetry.quantumMaterialSourceThermalDampingScale ?? 1, 3)} / stat ${molecularTelemetry.quantumMaterialSourceStatisticalSourceChannelCount ?? 0} p ${formatExp(molecularTelemetry.quantumMaterialSourceStatisticalPressureDriveProxy ?? 0, 2)} op ${formatExp(molecularTelemetry.quantumMaterialSourceStatisticalOpacityDriveProxy ?? 0, 2)} deg ${formatExp(molecularTelemetry.quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy ?? 0, 2)} / dT ${formatFixed(molecularTelemetry.quantumMaterialSourceTemperatureDeltaK ?? 0, 4)}K / q ${formatExp(molecularTelemetry.quantumMaterialSourceChargeDeltaProxy ?? 0, 2)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['qmat derivatives', molecularTelemetry
      ? `${molecularTelemetry.quantumMaterialSourceResponseDerivativesSchema ? 'active' : 'idle'} / dRho/dT ${formatExp(molecularTelemetry.quantumMaterialSourceDensityTemperatureDerivativeKgM3PerK ?? 0, 2)} / dK/dlogP ${formatExp(molecularTelemetry.quantumMaterialSourceMechanicalPressureDerivativePaPerLog2Pressure ?? 0, 2)} / dSigma/dF ${formatExp(molecularTelemetry.quantumMaterialSourceConductivityFieldDerivativeSpmPerNorm ?? 0, 2)} / dOp/dRad ${formatExp(molecularTelemetry.quantumMaterialSourceOpacityRadiationDerivativePerNorm ?? 0, 2)} / drives T ${formatExp(molecularTelemetry.quantumMaterialSourceResponseDerivativeTemperatureDrive ?? 0, 2)} P ${formatExp(molecularTelemetry.quantumMaterialSourceResponseDerivativePressureDrive ?? 0, 2)} F ${formatExp(molecularTelemetry.quantumMaterialSourceResponseDerivativeFieldDrive ?? 0, 2)} R ${formatExp(molecularTelemetry.quantumMaterialSourceResponseDerivativeRadiationDrive ?? 0, 2)}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular search', molecularTelemetry
      ? `${molecularTelemetry.pairSearchMode || 'unknown'} / pairs ${molecularTelemetry.neighborCandidatePairCount ?? 0} / cells ${molecularTelemetry.spatialCellCount ?? 0}${Number.isFinite(molecularGpuStatus.acceptedNeighborPairCount) ? ` / gpu pairs ${molecularGpuStatus.acceptedNeighborPairCount}` : ''}${Number.isFinite(molecularGpuStatus.overflowAtoms) ? ` / overflow ${molecularGpuStatus.overflowAtoms + (molecularGpuStatus.overflowCells || 0)}` : ''}`
      : solverRuntimeStatus.molecularDynamics?.pending ? 'pending' : 'warming'],
    ['molecular overlay', scene.getMolecularDynamicsOverlayStatus().accepted
      ? `${scene.getMolecularDynamicsOverlayStatus().visible ? 'visible' : 'hidden'} / ${scene.getMolecularDynamicsOverlayStatus().atomCount} atoms / ${scene.getMolecularDynamicsOverlayStatus().bondCount} bonds`
      : scene.getMolecularDynamicsOverlayStatus().reason],
    ['quantum basis', quantumTelemetry
      ? `${quantumTelemetry.elementSymbol || 'O'} ${quantumTelemetry.activeOrbital || quantumTelemetry.activeOrbitalLabel || '2p'} / Z ${quantumTelemetry.atomicNumber ?? quantumTelemetry.electronCount ?? 0} / e ${quantumTelemetry.electronCount ?? 0}`
      : 'warming'],
    ['quantum shell', quantumTelemetry
      ? `${quantumTelemetry.electronConfiguration || 'unknown'} / valence ${quantumTelemetry.valenceElectronCount ?? 0} / unpaired ${quantumTelemetry.unpairedElectronCount ?? 0}`
      : 'warming'],
    ['quantum EM', quantumTelemetry
      ? `chi ${formatExp(quantumTelemetry.magneticSusceptibility, 2)} / eps ${formatFixed(quantumTelemetry.dielectricConstant, 2)} / sigma ${formatExp(quantumTelemetry.electricalConductivityProxy, 2)}`
      : 'warming'],
    ['quantum grid', quantumTelemetry
      ? `${quantumTelemetry.finiteGridBackend || 'grid-wait'} / ${quantumTelemetry.finiteGridSize || 0}^3 / ${quantumTelemetry.finiteGridReductionMode || 'waiting'} / norm ${formatExp(quantumTelemetry.finiteGridNormError, 2)} / edge ${formatExp(quantumTelemetry.finiteGridBoundaryMass, 2)} / r ${formatFixed(quantumTelemetry.finiteGridMeanRadiusBohr, 2)}a0`
      : 'warming'],
    ['quantum residual', quantumTelemetry
      ? `${quantumTelemetry.finiteGridEigenResidualStatus || 'warming'} / rel ${formatExp(quantumTelemetry.finiteGridEigenResidualRelativeL2, 2)} / dE ${formatExp(quantumTelemetry.finiteGridEigenResidualWeightedMeanEv, 2)}eV / n ${quantumTelemetry.finiteGridEigenResidualInteriorSampleCount || 0} / gpu ${quantumTelemetry.finiteGridEigenResidualWebgpuSchema ? 'on' : 'off'}`
      : 'warming'],
    ['quantum worker', quantumGridWorkerResult
      ? `${quantumGridWorkerResult.status || 'worker'} / ${quantumGridWorkerResult.backend || quantumTelemetry?.finiteGridBackend || 'worker'} / ${quantumGridWorkerStatus.kernelMode || quantumGridWorkerResult.reductionMode || 'none'} / step ${quantumGridWorkerResult.sequence ?? 0} / ${quantumGridWorkerResult.liveBackendPolicy || 'policy-n/a'}`
      : quantumGridRuntime?.pending ? 'pending' : 'warming'],
    ['quantum evolve', quantumTelemetry
      ? `${quantumTelemetry.finiteGridWavefunctionEvolutionStatus || 'warming'} / norm ${formatExp(quantumTelemetry.finiteGridWavefunctionEvolutionNormDrift, 2)} / rho ${formatExp(quantumTelemetry.finiteGridWavefunctionEvolutionDensityDriftL1, 2)} / E ${formatExp(quantumTelemetry.finiteGridWavefunctionEvolutionEnergyExpectationEv, 2)}eV / field ${formatExp(quantumTelemetry.finiteGridWavefunctionEvolutionElectricFieldVm ?? 0, 2)}V/m dE ${formatExp(quantumTelemetry.finiteGridWavefunctionEvolutionFieldEnergyExpectationEv ?? 0, 2)}eV dip ${formatExp(quantumTelemetry.finiteGridWavefunctionEvolutionDipoleMomentZBohrElectron ?? 0, 2)} alpha ${formatExp(quantumTelemetry.finiteGridWavefunctionEvolutionPolarizabilityProxyBohr3 ?? 0, 2)} / B ${formatExp(quantumTelemetry.finiteGridWavefunctionEvolutionMagneticFieldT ?? 0, 2)}T zE ${formatExp(quantumTelemetry.finiteGridWavefunctionEvolutionZeemanEnergyExpectationEv ?? 0, 2)}eV mu ${formatExp(quantumTelemetry.finiteGridWavefunctionEvolutionMagneticMomentProjectionBohrMagneton ?? 0, 2)} / phase ${formatExp(quantumTelemetry.finiteGridWavefunctionEvolutionPhaseRotationRad, 2)} / dt ${formatExp(quantumTelemetry.finiteGridWavefunctionEvolutionDtAtomicUnits, 2)}au / gpu ${quantumTelemetry.finiteGridWavefunctionEvolutionWebgpuSchema ? 'on' : 'off'}`
      : 'warming'],
    ['quantum qgrid stat', quantumTelemetry
      ? `${quantumTelemetry.finiteGridStatisticalBridgeSchema ? 'active' : 'idle'} / ${quantumTelemetry.finiteGridStatisticalBridgeStatus || 'unavailable'} / Zlog ${formatFixed(quantumTelemetry.finiteGridStatisticalBridgePartitionFunctionLog ?? 0, 3)} / ex ${formatExp(quantumTelemetry.finiteGridStatisticalBridgeExcitedOccupation ?? 0, 2)} / F ${formatExp(quantumTelemetry.finiteGridStatisticalBridgeFreeEnergyEv ?? 0, 2)}eV / Cv ${formatExp(quantumTelemetry.finiteGridStatisticalBridgeHeatCapacityProxy ?? 0, 2)} / ion ${formatExp(quantumTelemetry.finiteGridStatisticalBridgeIonizationFraction ?? 0, 2)} / op ${formatExp(quantumTelemetry.finiteGridStatisticalBridgeOpacityPopulationProxy ?? 0, 2)} / deg ${formatExp(quantumTelemetry.finiteGridStatisticalBridgeDegeneracyParameter ?? 0, 2)} / P ${formatExp(quantumTelemetry.finiteGridStatisticalBridgeEnsemblePressurePa ?? 0, 2)}Pa / dT ${formatFixed(quantumTelemetry.finiteGridStatisticalBridgeTemperatureDeltaKProxy ?? 0, 4)}K / q ${formatExp(quantumTelemetry.finiteGridStatisticalBridgeChargeDeltaProxy ?? 0, 2)}`
      : 'warming'],
    ['quantum radial', quantumTelemetry
      ? `${quantumTelemetry.finiteGridRadialEigenstateStatus || 'warming'} / E ${formatFixed(quantumTelemetry.finiteGridRadialEigenstateEnergyEv, 3)}eV / err ${formatExp(quantumTelemetry.finiteGridRadialEigenstateEnergyErrorEv, 2)}eV / rel ${formatExp(quantumTelemetry.finiteGridRadialEigenstateResidualRelativeL2, 2)} / nodes ${quantumTelemetry.finiteGridRadialEigenstateNodeCountObserved ?? 0}/${quantumTelemetry.finiteGridRadialEigenstateNodeCountTarget ?? 0} / gpu ${quantumTelemetry.finiteGridRadialEigenstateSchema === 'peercompute.schrodinger.radial-webgpu-eigensolver.v0' ? 'on' : 'off'}`
      : 'warming'],
    ['quantum closure', quantumTelemetry
      ? `${quantumTelemetry.backend || quantumTelemetry.closureBackend || 'cpu-screened'} / E ${formatFixed(quantumTelemetry.energyEv, 3)}eV / Zeff ${formatFixed(quantumTelemetry.zEff, 2)} / ion ${formatFixed(quantumTelemetry.ionizationFraction, 4)} / ${quantumTelemetry.bondingTendency || 'bonding'}`
      : 'warming'],
    ['quantum material', quantumMaterialTelemetry
      ? `${quantumMaterialTelemetry.status || quantumMaterialTelemetry.materialPotentialStatus || 'material'} / ${quantumMaterialTelemetry.materialId || quantumMaterialTelemetry.materialPotentialMaterialId || 'unknown'} / ${quantumMaterialTelemetry.phase || 'phase'} / rho ${formatExp(quantumMaterialTelemetry.densityKgM3 ?? 0, 2)} / K ${formatExp(quantumMaterialTelemetry.bulkModulusPa ?? 0, 2)} / Y ${formatExp(quantumMaterialTelemetry.youngsModulusPa ?? 0, 2)} / n ${formatFixed(quantumMaterialTelemetry.refractiveIndex ?? 0, 3)} / qmat ${quantumMaterialWorkerResult?.backend || quantumMaterialTelemetry.concurrentBackend || quantumMaterialTelemetry.concurrentBatch?.backend || 'waiting'} ${quantumMaterialWorkerResult?.batch?.recordCount ?? quantumMaterialTelemetry.concurrentRecordCount ?? quantumMaterialTelemetry.concurrentBatch?.recordCount ?? 0}@${quantumMaterialCadence}f / drive ${formatExp(quantumMaterialWorkerResult?.batch?.meanBehaviorDrive ?? quantumMaterialTelemetry.concurrentBehaviorDrive ?? quantumMaterialTelemetry.concurrentBatch?.meanBehaviorDrive ?? 0, 2)} / fs ${quantumMaterialForcePreview?.status || 'no-force'} F ${formatExp(quantumMaterialForcePreview?.meanForceGradientEvPerAngstrom ?? quantumMaterialTelemetry.concurrentForceGradientEvPerAngstrom ?? 0, 2)} / graph ${quantumMaterialLawGraph?.consistency?.status || quantumMaterialTelemetry.lawGraphConsistency || 'n/a'} / blocks ${quantumMaterialTelemetry.unsupportedChemistry?.blockedInteractionCount ?? quantumMaterialTelemetry.materialPotentialBlockedInteractionCount ?? 0} / BO ${quantumMaterialTelemetry.potentialTerms?.bornOppenheimerForcesAvailable ? 'yes' : 'no'} / barrier ${quantumMaterialTelemetry.potentialTerms?.reactionBarrierSurfaceAvailable ? 'yes' : 'no'}`
      : 'warming'],
    ['quantum ensemble', quantumStatisticalEnsemble
      ? `${quantumStatisticalEnsemble.status || 'ensemble'} / ion ${formatFixed(quantumStatisticalEnsemble.ionizationFraction ?? 0, 4)} / op ${formatFixed(quantumStatisticalEnsemble.opacityProxy ?? 0, 3)} / deg ${formatFixed(quantumStatisticalEnsemble.degeneracyParameter ?? 0, 3)} ${quantumStatisticalEnsemble.degeneracyRegime || 'classical'} / P ${formatExp(quantumStatisticalEnsemble.ensemblePressurePa ?? quantumStatisticalEnsemble.pressurePa ?? 0, 2)}Pa / Zlog ${formatFixed(quantumStatisticalEnsemble.partitionFunctionLog ?? 0, 3)} / ${quantumStatisticalEnsemble.backend || quantumMaterialWorkerResult?.backend || 'closure'}`
      : quantumMaterialRuntime?.pending ? 'pending' : 'warming'],
    ['quantum stat source', quantumStatisticalSourceEquation
      ? `${quantumStatisticalSourceEquation.status || 'source'} / ${quantumStatisticalSourceEquation.channelCount ?? quantumStatisticalSourceEquation.channels?.length ?? 0} ch / P ${formatExp(quantumStatisticalSourceEquation.sourceTerms?.pressureDriveProxy ?? 0, 2)} / op ${formatExp(quantumStatisticalSourceEquation.sourceTerms?.opacityDriveProxy ?? 0, 2)} / ion ${formatExp(quantumStatisticalSourceEquation.sourceTerms?.ionizationDriveProxy ?? 0, 2)} / deg ${formatExp(quantumStatisticalSourceEquation.sourceTerms?.degeneracyPressureDriveProxy ?? 0, 2)} / dT ${formatFixed(quantumStatisticalSourceEquation.sourceTerms?.temperatureDeltaKProxy ?? 0, 4)}K`
      : quantumMaterialRuntime?.pending ? 'pending' : 'warming'],
    ['hydro tile', solverRuntimeStatus.hydroAtmosphere?.lastResult
      ? `${solverRuntimeStatus.hydroAtmosphere.lastResult.backend} / cloud ${solverRuntimeStatus.hydroAtmosphere.lastResult.cloudCover.toFixed(2)} / wind ${solverRuntimeStatus.hydroAtmosphere.lastResult.maxWindMps.toFixed(1)}`
      : solverRuntimeStatus.hydroAtmosphere?.pending ? 'pending' : 'warming'],
    ['hydro overlay', scene.getHydroAtmosphereOverlayStatus().accepted
      ? `${scene.getHydroAtmosphereOverlayStatus().visible ? 'visible' : 'hidden'} / ${scene.getHydroAtmosphereOverlayStatus().cellCount} cells`
      : scene.getHydroAtmosphereOverlayStatus().reason],
    ['radiation tile', solverRuntimeStatus.radiationOpacity?.lastResult
      ? `${solverRuntimeStatus.radiationOpacity.lastResult.backend} / tau ${solverRuntimeStatus.radiationOpacity.lastResult.opticalDepth.toFixed(2)} / flux ${solverRuntimeStatus.radiationOpacity.lastResult.surfaceRadiativeHeatFlux.toFixed(1)}`
      : solverRuntimeStatus.radiationOpacity?.pending ? 'pending' : 'warming'],
    ['radiation overlay', scene.getRadiationOpacityOverlayStatus().accepted
      ? `${scene.getRadiationOpacityOverlayStatus().visible ? 'visible' : 'hidden'} / ${scene.getRadiationOpacityOverlayStatus().cellCount} cells`
      : scene.getRadiationOpacityOverlayStatus().reason],
    ['stellar fusion', solverRuntimeStatus.stellarFusion?.lastResult
      ? `${solverRuntimeStatus.stellarFusion.lastResult.backend} / core ${solverRuntimeStatus.stellarFusion.lastResult.coreTemperatureK.toExponential(2)}K / lum ${solverRuntimeStatus.stellarFusion.lastResult.luminosityFactor.toFixed(2)}`
      : solverRuntimeStatus.stellarFusion?.pending ? 'pending' : 'warming'],
    ['stellar overlay', scene.getStellarFusionOverlayStatus().accepted
      ? `${scene.getStellarFusionOverlayStatus().visible ? 'visible' : 'hidden'} / ${scene.getStellarFusionOverlayStatus().cellCount} cells`
      : scene.getStellarFusionOverlayStatus().reason],
    ['mhd plasma', solverRuntimeStatus.magnetospherePlasma?.lastResult
      ? `${solverRuntimeStatus.magnetospherePlasma.lastResult.backend} / wind ${solverRuntimeStatus.magnetospherePlasma.lastResult.solarWindPressure.toFixed(2)} / recon ${solverRuntimeStatus.magnetospherePlasma.lastResult.reconnectionRate.toFixed(2)}`
      : solverRuntimeStatus.magnetospherePlasma?.pending ? 'pending' : 'warming'],
    ['mhd overlay', scene.getMagnetospherePlasmaOverlayStatus().accepted
      ? `${scene.getMagnetospherePlasmaOverlayStatus().visible ? 'visible' : 'hidden'} / ${scene.getMagnetospherePlasmaOverlayStatus().cellCount} cells`
      : scene.getMagnetospherePlasmaOverlayStatus().reason],
    ['pic patch', solverRuntimeStatus.picPlasmaPatch?.lastResult
      ? `${solverRuntimeStatus.picPlasmaPatch.lastResult.backend} / ${solverRuntimeStatus.picPlasmaPatch.lastResult.particleCount} particles / q ${solverRuntimeStatus.picPlasmaPatch.lastResult.chargeImbalance.toExponential(2)} / heat ${solverRuntimeStatus.picPlasmaPatch.lastResult.reconnectionHeating.toExponential(2)}`
      : solverRuntimeStatus.picPlasmaPatch?.pending ? 'pending' : 'warming'],
    ['pic overlay', scene.getPicPlasmaPatchOverlayStatus().accepted
      ? `${scene.getPicPlasmaPatchOverlayStatus().visible ? 'visible' : 'hidden'} / ${scene.getPicPlasmaPatchOverlayStatus().particleCount} particles`
      : scene.getPicPlasmaPatchOverlayStatus().reason],
    ['relativity law', solverRuntimeStatus.relativisticCorrection?.lastResult
      ? `${solverRuntimeStatus.relativisticCorrection.lastResult.backend} / beta ${solverRuntimeStatus.relativisticCorrection.lastResult.maxSpeedFractionC.toFixed(3)} / gamma ${solverRuntimeStatus.relativisticCorrection.lastResult.maxLorentzFactor.toFixed(2)} / z ${solverRuntimeStatus.relativisticCorrection.lastResult.gravitationalRedshiftProxy.toExponential(2)}`
      : solverRuntimeStatus.relativisticCorrection?.pending ? 'pending' : 'warming'],
    ['relativity overlay', scene.getRelativisticCorrectionOverlayStatus().accepted
      ? `${scene.getRelativisticCorrectionOverlayStatus().visible ? 'visible' : 'hidden'} / ${scene.getRelativisticCorrectionOverlayStatus().sampleCount} samples`
      : scene.getRelativisticCorrectionOverlayStatus().reason],
    ['combustion plume', solverRuntimeStatus.combustionPlume?.lastResult
      ? `${solverRuntimeStatus.combustionPlume.lastResult.backend} / fire ${solverRuntimeStatus.combustionPlume.lastResult.fireAreaFraction.toFixed(2)} / smoke ${solverRuntimeStatus.combustionPlume.lastResult.smokeColumn.toFixed(2)} / rise ${solverRuntimeStatus.combustionPlume.lastResult.plumeRise.toFixed(2)}`
      : solverRuntimeStatus.combustionPlume?.pending ? 'pending' : 'warming'],
    ['combustion overlay', scene.getCombustionPlumeOverlayStatus().accepted
      ? `${scene.getCombustionPlumeOverlayStatus().visible ? 'visible' : 'hidden'} / ${scene.getCombustionPlumeOverlayStatus().cellCount} cells`
      : scene.getCombustionPlumeOverlayStatus().reason],
    ['active pool', `${computeStatus.peercompute?.activeLayerId || status.layer.id} x${computeStatus.peercompute?.activeShardCount ?? 0}`],
    ['live layers', `${computeStatus.peercompute?.liveLayers ?? 0}/${computeStatus.peercompute?.totalLayers ?? SCALE_LAYERS.length}`],
    ['readback', `${computeStatus.readPending ? 'pending' : 'ready'} / ${computeStatus.readbackInterval ?? readbackBudgetReport?.readbackInterval ?? 'n/a'}f`],
    ['snapshot', overlay.accepted ? `layer ${overlay.layerIndex + 1} / ${overlay.backend}` : overlay.reason],
    ['headline', status.headline],
    ['validation', status.validation.status],
    ['refinements', packet.downward.refinementRequests.join(', ') || 'none']
  ];
  const visibleRows = selectLayerReadoutRows(rows, status.layer.id);
  lastLayerReadoutRowCount = visibleRows.length;
  lastLayerReadoutTotalRowCount = rows.length;
  writeDefinitionRows(layerReadout, visibleRows);
  if (packetReadout) {
    packetReadout.textContent = formatPacketPreview(packet);
  }
}

function getEffectiveSolverCadenceFrames(key, fallback) {
  return solverGovernorStatus.effectiveCadenceFrames?.[key]
    ?? solverGovernorStatus.cadenceFrames?.[key]
    ?? fallback;
}

function createSolverRuntimeStatus() {
  return {
    schema: 'peercompute.multiscale.solver-runtime.v0',
    scope: SOLVER_DELTA_SCOPE,
    nbody: {
      solverId: N_BODY_SOLVER_ID,
      stateKey: N_BODY_STATE_KEY,
      taskId: N_BODY_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('nbody', solverBudget.nbody.cadenceFrames),
      pending: nbodySolverPending,
      submittedTasks: nbodySolverSubmitted,
      completedTasks: nbodySolverCompleted,
      failedTasks: nbodySolverFailed,
      lastError: nbodySolverLastError,
      lastResult: nbodySolverLastResult
    },
    reactiveThermal: {
      solverId: REACTIVE_SOLVER_ID,
      stateKey: REACTIVE_STATE_KEY,
      taskId: REACTIVE_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('reactiveThermal', solverBudget.reactiveThermal.cadenceFrames),
      pending: reactiveSolverPending,
      submittedTasks: reactiveSolverSubmitted,
      completedTasks: reactiveSolverCompleted,
      failedTasks: reactiveSolverFailed,
      lastError: reactiveSolverLastError,
      lastResult: reactiveSolverLastResult
    },
    maxwell: {
      solverId: MAXWELL_SOLVER_ID,
      stateKey: MAXWELL_STATE_KEY,
      taskId: MAXWELL_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('maxwell', solverBudget.maxwell.cadenceFrames),
      pending: maxwellSolverPending,
      submittedTasks: maxwellSolverSubmitted,
      completedTasks: maxwellSolverCompleted,
      failedTasks: maxwellSolverFailed,
      lastError: maxwellSolverLastError,
      lastResult: maxwellSolverLastResult
    },
    cosmologyExpansion: {
      solverId: COSMOLOGY_EXPANSION_SOLVER_ID,
      stateKey: COSMOLOGY_EXPANSION_STATE_KEY,
      taskId: COSMOLOGY_EXPANSION_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('cosmologyExpansion', solverBudget.cosmologyExpansion.cadenceFrames),
      pending: cosmologyExpansionSolverPending,
      submittedTasks: cosmologyExpansionSolverSubmitted,
      completedTasks: cosmologyExpansionSolverCompleted,
      failedTasks: cosmologyExpansionSolverFailed,
      lastError: cosmologyExpansionSolverLastError,
      lastResult: cosmologyExpansionSolverLastResult
    },
    molecularDynamics: {
      solverId: MOLECULAR_DYNAMICS_SOLVER_ID,
      stateKey: MOLECULAR_DYNAMICS_STATE_KEY,
      taskId: MOLECULAR_DYNAMICS_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('molecularDynamics', solverBudget.molecularDynamics.cadenceFrames),
      pending: molecularDynamicsSolverPending,
      submittedTasks: molecularDynamicsSolverSubmitted,
      completedTasks: molecularDynamicsSolverCompleted,
      failedTasks: molecularDynamicsSolverFailed,
      lastError: molecularDynamicsSolverLastError,
      lastResult: molecularDynamicsSolverLastResult
    },
    quantumOrbitalGrid: {
      solverId: QUANTUM_ORBITAL_GRID_SOLVER_ID,
      stateKey: QUANTUM_ORBITAL_GRID_STATE_KEY,
      taskId: QUANTUM_ORBITAL_GRID_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('quantumOrbitalGrid', solverBudget.quantumOrbitalGrid?.cadenceFrames || 3),
      pending: quantumOrbitalGridPending,
      submittedTasks: quantumOrbitalGridSubmitted,
      completedTasks: quantumOrbitalGridCompleted,
      failedTasks: quantumOrbitalGridFailed,
      lastError: quantumOrbitalGridLastError,
      lastResult: quantumOrbitalGridLastResult
    },
    quantumMaterialPotential: {
      solverId: QUANTUM_MATERIAL_POTENTIAL_SOLVER_ID,
      stateKey: QUANTUM_MATERIAL_POTENTIAL_STATE_KEY,
      taskId: QUANTUM_MATERIAL_POTENTIAL_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('quantumMaterialPotential', solverBudget.quantumMaterialPotential?.cadenceFrames || 3),
      pending: quantumMaterialPotentialPending,
      submittedTasks: quantumMaterialPotentialSubmitted,
      completedTasks: quantumMaterialPotentialCompleted,
      failedTasks: quantumMaterialPotentialFailed,
      lastError: quantumMaterialPotentialLastError,
      lastResult: quantumMaterialPotentialLastResult
    },
    ulgRuntime: {
      solverId: ULG_RUNTIME_SOLVER_ID,
      stateKey: ULG_RUNTIME_STATE_KEY,
      taskId: ULG_RUNTIME_TASK_ID,
      cadenceFrames: 'manifest-triggered',
      pending: ulgRuntimePending,
      submittedTasks: ulgRuntimeSubmitted,
      completedTasks: ulgRuntimeCompleted,
      failedTasks: ulgRuntimeFailed,
      lastError: ulgRuntimeLastError,
      lastResult: ulgRuntimeLastResult
    },
    sphMaterial: {
      solverId: SPH_MATERIAL_SOLVER_ID,
      stateKey: SPH_MATERIAL_STATE_KEY,
      taskId: SPH_MATERIAL_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('sphMaterial', solverBudget.sphMaterial.cadenceFrames),
      pending: sphMaterialSolverPending,
      submittedTasks: sphMaterialSolverSubmitted,
      completedTasks: sphMaterialSolverCompleted,
      failedTasks: sphMaterialSolverFailed,
      lastError: sphMaterialSolverLastError,
      lastResult: sphMaterialSolverLastResult
    },
    membraneShell: {
      solverId: MEMBRANE_SHELL_SOLVER_ID,
      stateKey: MEMBRANE_SHELL_STATE_KEY,
      taskId: MEMBRANE_SHELL_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('membraneShell', solverBudget.membraneShell.cadenceFrames),
      pending: membraneShellSolverPending,
      submittedTasks: membraneShellSolverSubmitted,
      completedTasks: membraneShellSolverCompleted,
      failedTasks: membraneShellSolverFailed,
      lastError: membraneShellSolverLastError,
      lastResult: membraneShellSolverLastResult
    },
    hydroAtmosphere: {
      solverId: HYDRO_ATMOSPHERE_SOLVER_ID,
      stateKey: HYDRO_ATMOSPHERE_STATE_KEY,
      taskId: HYDRO_ATMOSPHERE_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('hydroAtmosphere', solverBudget.hydroAtmosphere.cadenceFrames),
      pending: hydroAtmosphereSolverPending,
      submittedTasks: hydroAtmosphereSolverSubmitted,
      completedTasks: hydroAtmosphereSolverCompleted,
      failedTasks: hydroAtmosphereSolverFailed,
      lastError: hydroAtmosphereSolverLastError,
      lastResult: hydroAtmosphereSolverLastResult
    },
    radiationOpacity: {
      solverId: RADIATION_OPACITY_SOLVER_ID,
      stateKey: RADIATION_OPACITY_STATE_KEY,
      taskId: RADIATION_OPACITY_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('radiationOpacity', solverBudget.radiationOpacity.cadenceFrames),
      pending: radiationOpacitySolverPending,
      submittedTasks: radiationOpacitySolverSubmitted,
      completedTasks: radiationOpacitySolverCompleted,
      failedTasks: radiationOpacitySolverFailed,
      lastError: radiationOpacitySolverLastError,
      lastResult: radiationOpacitySolverLastResult
    },
    stellarFusion: {
      solverId: STELLAR_FUSION_SOLVER_ID,
      stateKey: STELLAR_FUSION_STATE_KEY,
      taskId: STELLAR_FUSION_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('stellarFusion', solverBudget.stellarFusion.cadenceFrames),
      pending: stellarFusionSolverPending,
      submittedTasks: stellarFusionSolverSubmitted,
      completedTasks: stellarFusionSolverCompleted,
      failedTasks: stellarFusionSolverFailed,
      lastError: stellarFusionSolverLastError,
      lastResult: stellarFusionSolverLastResult
    },
    magnetospherePlasma: {
      solverId: MAGNETOSPHERE_PLASMA_SOLVER_ID,
      stateKey: MAGNETOSPHERE_PLASMA_STATE_KEY,
      taskId: MAGNETOSPHERE_PLASMA_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('magnetospherePlasma', solverBudget.magnetospherePlasma.cadenceFrames),
      pending: magnetospherePlasmaSolverPending,
      submittedTasks: magnetospherePlasmaSolverSubmitted,
      completedTasks: magnetospherePlasmaSolverCompleted,
      failedTasks: magnetospherePlasmaSolverFailed,
      lastError: magnetospherePlasmaSolverLastError,
      lastResult: magnetospherePlasmaSolverLastResult
    },
    picPlasmaPatch: {
      solverId: PIC_PLASMA_PATCH_SOLVER_ID,
      stateKey: PIC_PLASMA_PATCH_STATE_KEY,
      taskId: PIC_PLASMA_PATCH_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('picPlasmaPatch', solverBudget.picPlasmaPatch.cadenceFrames),
      pending: picPlasmaPatchSolverPending,
      submittedTasks: picPlasmaPatchSolverSubmitted,
      completedTasks: picPlasmaPatchSolverCompleted,
      failedTasks: picPlasmaPatchSolverFailed,
      lastError: picPlasmaPatchSolverLastError,
      lastResult: picPlasmaPatchSolverLastResult
    },
    relativisticCorrection: {
      solverId: RELATIVISTIC_CORRECTION_SOLVER_ID,
      stateKey: RELATIVISTIC_CORRECTION_STATE_KEY,
      taskId: RELATIVISTIC_CORRECTION_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('relativisticCorrection', solverBudget.relativisticCorrection.cadenceFrames),
      pending: relativisticCorrectionSolverPending,
      submittedTasks: relativisticCorrectionSolverSubmitted,
      completedTasks: relativisticCorrectionSolverCompleted,
      failedTasks: relativisticCorrectionSolverFailed,
      lastError: relativisticCorrectionSolverLastError,
      lastResult: relativisticCorrectionSolverLastResult
    },
    combustionPlume: {
      solverId: COMBUSTION_PLUME_SOLVER_ID,
      stateKey: COMBUSTION_PLUME_STATE_KEY,
      taskId: COMBUSTION_PLUME_TASK_ID,
      cadenceFrames: getEffectiveSolverCadenceFrames('combustionPlume', solverBudget.combustionPlume.cadenceFrames),
      pending: combustionPlumeSolverPending,
      submittedTasks: combustionPlumeSolverSubmitted,
      completedTasks: combustionPlumeSolverCompleted,
      failedTasks: combustionPlumeSolverFailed,
      lastError: combustionPlumeSolverLastError,
      lastResult: combustionPlumeSolverLastResult
    }
  };
}

function updateSolverRuntimeStatus() {
  solverRuntimeStatus = createSolverRuntimeStatus();
  return solverRuntimeStatus;
}

function publishClosureDelta(taskId, closureResult) {
  if (!stateManager.isInitialized || !closureResult?.schema) return;
  stateManager.commitDelta({
    taskId,
    scope: CLOSURE_DELTA_SCOPE,
    version: closureResult.source?.sequence ?? closureResult.state?.sequence ?? Date.now(),
    timestamp: Date.now(),
    payload: closureResult
  });
}

function publishConservationDelta(audit) {
  if (!stateManager.isInitialized || !audit?.schema) return;
  stateManager.commitDelta({
    taskId: 'conservation:multiscale-audit',
    scope: CONSERVATION_DELTA_SCOPE,
    version: Math.round(Number(audit.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: audit
  });
}

function publishCouplingDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'coupling:cross-scale-handoffs',
    scope: COUPLING_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishLawGraphDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'law-graph:multiscale-consistency',
    scope: LAW_GRAPH_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishUlgRuntimeDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'ulg-runtime:manifest',
    scope: ULG_RUNTIME_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceSinkBalanceDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-sink:molecular-balance',
    scope: SOURCE_SINK_BALANCE_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer:molecular-conservative-dry-run',
    scope: SOURCE_TRANSFER_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferApplicationDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer-application:molecular-gate',
    scope: SOURCE_TRANSFER_APPLICATION_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferTransactionDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer-transaction:molecular-apply-scaffold',
    scope: SOURCE_TRANSFER_TRANSACTION_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferTargetPreviewDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer-target-preview:molecular-mutator-dry-run',
    scope: SOURCE_TRANSFER_TARGET_PREVIEW_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferTargetMutatorRegistryDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer-target-mutators:molecular-registry',
    scope: SOURCE_TRANSFER_TARGET_MUTATOR_REGISTRY_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferTargetMutationPreflightDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer-target-preflight:molecular-mutator',
    scope: SOURCE_TRANSFER_TARGET_MUTATION_PREFLIGHT_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferTargetMutationOperationPlanDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer-target-operation-plan:molecular-mutator',
    scope: SOURCE_TRANSFER_TARGET_MUTATION_OPERATION_PLAN_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferTargetMutationInvariantCheckDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer-target-invariant-check:molecular-mutator',
    scope: SOURCE_TRANSFER_TARGET_MUTATION_INVARIANT_CHECK_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferTargetMutationCommitDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer-target-commit:molecular-mutator',
    scope: SOURCE_TRANSFER_TARGET_MUTATION_COMMIT_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferTargetMutationDispatchDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer-target-dispatch:molecular-mutator',
    scope: SOURCE_TRANSFER_TARGET_MUTATION_DISPATCH_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferTargetMutationApplyValidationDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer-target-apply-validation:molecular-mutator',
    scope: SOURCE_TRANSFER_TARGET_MUTATION_APPLY_VALIDATION_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferTargetMutationApplyExecutionDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer-target-apply-execution:molecular-mutator',
    scope: SOURCE_TRANSFER_TARGET_MUTATION_APPLY_EXECUTION_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferTargetSourceIntakeDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer-target-source-intake:molecular-mutator',
    scope: SOURCE_TRANSFER_TARGET_SOURCE_INTAKE_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferTargetSourceResponseDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer-target-source-response:molecular-mutator',
    scope: SOURCE_TRANSFER_TARGET_SOURCE_RESPONSE_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceTransferTargetSourceReconciliationDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'source-transfer-target-source-reconciliation:molecular-mutator',
    scope: SOURCE_TRANSFER_TARGET_SOURCE_RECONCILIATION_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishConservativeSourceBufferDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  stateManager.commitDelta({
    taskId: 'conservative-source-buffer:molecular-targets',
    scope: CONSERVATIVE_SOURCE_BUFFER_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceBufferApplicationDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  const appliedTargetCount = Number(report.appliedTargetCount || 0);
  const hasTargetReport = !!report.reactive?.schema || !!report.sph?.schema;
  if (appliedTargetCount <= 0 && !hasTargetReport) return;
  stateManager.commitDelta({
    taskId: 'source-buffer-application:molecular-targets',
    scope: SOURCE_BUFFER_APPLICATION_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceBufferAcceptanceDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  const targetCount = Number(report.targetCount || 0);
  if (targetCount <= 0 && report.status === 'idle') return;
  stateManager.commitDelta({
    taskId: 'source-buffer-acceptance:molecular-targets',
    scope: SOURCE_BUFFER_ACCEPTANCE_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishSourceBufferWritebackValidationDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  const targetCount = Number(report.targetCount || 0);
  if (targetCount <= 0 && report.status === 'idle') return;
  stateManager.commitDelta({
    taskId: 'source-buffer-writeback-validation:molecular-targets',
    scope: SOURCE_BUFFER_WRITEBACK_VALIDATION_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishTargetBufferReplayValidationDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  const targetCount = Number(report.targetCount || 0);
  if (targetCount <= 0 && report.status === 'idle') return;
  stateManager.commitDelta({
    taskId: 'target-buffer-replay-validation:molecular-targets',
    scope: TARGET_BUFFER_REPLAY_VALIDATION_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishTargetBufferMutationAuditDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  const targetCount = Number(report.targetCount || 0);
  if (targetCount <= 0 && report.status === 'idle') return;
  stateManager.commitDelta({
    taskId: 'target-buffer-mutation-audit:molecular-targets',
    scope: TARGET_BUFFER_MUTATION_AUDIT_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishTargetBufferWorkerWriteQueueDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  const targetBatchCount = Number(report.targetBatchCount || 0);
  if (targetBatchCount <= 0 && report.status === 'idle') return;
  stateManager.commitDelta({
    taskId: 'target-buffer-worker-write-queue:molecular-targets',
    scope: TARGET_BUFFER_WORKER_WRITE_QUEUE_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishTargetBufferWorkerWriteExecutionDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  const targetBatchCount = Number(report.targetBatchCount || 0);
  if (targetBatchCount <= 0 && report.status === 'idle') return;
  stateManager.commitDelta({
    taskId: 'target-buffer-worker-write-execution:molecular-targets',
    scope: TARGET_BUFFER_WORKER_WRITE_EXECUTION_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishTargetBufferWorkerWriteVerificationDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  const targetBatchCount = Number(report.targetBatchCount || report.targetCount || 0);
  if (targetBatchCount <= 0 && report.status === 'idle') return;
  stateManager.commitDelta({
    taskId: 'target-buffer-worker-write-verification:molecular-targets',
    scope: TARGET_BUFFER_WORKER_WRITE_VERIFICATION_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishScientificInvariantGateDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  const requiredScopeCount = Number(report.requiredScopeCount || 0);
  if (requiredScopeCount <= 0 && report.status === 'idle') return;
  stateManager.commitDelta({
    taskId: 'scientific-invariant-gate:molecular-targets',
    scope: SCIENTIFIC_INVARIANT_GATE_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishScientificReadinessManifestDelta(report) {
  if (!stateManager.isInitialized || !report?.schema) return;
  const requiredArtifactCount = Number(report.requiredArtifactCount || 0);
  if (requiredArtifactCount <= 0 && report.status === 'idle') return;
  stateManager.commitDelta({
    taskId: 'scientific-readiness-manifest:molecular-targets',
    scope: SCIENTIFIC_READINESS_MANIFEST_DELTA_SCOPE,
    version: Math.round(Number(report.timeSeconds || model.time) * 1000),
    timestamp: Date.now(),
    payload: report
  });
}

function publishCurrentSourceBufferApplicationDelta() {
  if (!stateManager.isInitialized) return;
  const packet = createModelPacketWithRuntimeEvidence();
  publishSourceBufferApplicationDelta(packet.upward?.aggregateState?.molecularSourceBufferApplication);
  publishSourceBufferAcceptanceDelta(packet.sourceBufferAcceptance);
  publishSourceBufferWritebackValidationDelta(packet.sourceBufferWritebackValidation);
  publishTargetBufferReplayValidationDelta(packet.targetBufferReplayValidation);
  publishTargetBufferMutationAuditDelta(packet.targetBufferMutationAudit);
  publishTargetBufferWorkerWriteQueueDelta(packet.targetBufferWorkerWriteQueue);
  publishTargetBufferWorkerWriteExecutionDelta(packet.targetBufferWorkerWriteExecution);
  publishTargetBufferWorkerWriteVerificationDelta(packet.targetBufferWorkerWriteVerification);
  publishScientificInvariantGateDelta(packet.molecularScientificInvariantGate);
  publishScientificReadinessManifestDelta(packet.molecularScientificReadinessManifest);
}

function publishMolecularSourceBufferWarmDeltas(packet = createModelPacketWithRuntimeEvidence()) {
  publishSourceSinkBalanceDelta(packet.sourceSinkBalance);
  publishSourceTransferDelta(packet.sourceTransfer);
  publishSourceTransferApplicationDelta(packet.sourceTransferApplication);
  publishSourceTransferTransactionDelta(packet.sourceTransferTransaction);
  publishSourceTransferTargetPreviewDelta(packet.sourceTransferTargetPreview);
  publishSourceTransferTargetMutatorRegistryDelta(packet.sourceTransferTargetMutatorRegistry);
  publishSourceTransferTargetMutationPreflightDelta(packet.sourceTransferTargetMutationPreflight);
  publishSourceTransferTargetMutationOperationPlanDelta(packet.sourceTransferTargetMutationOperationPlan);
  publishSourceTransferTargetMutationInvariantCheckDelta(packet.sourceTransferTargetMutationInvariantCheck);
  publishSourceTransferTargetMutationCommitDelta(packet.sourceTransferTargetMutationCommit);
  publishSourceTransferTargetMutationDispatchDelta(packet.sourceTransferTargetMutationDispatch);
  publishSourceTransferTargetMutationApplyValidationDelta(packet.sourceTransferTargetMutationApplyValidation);
  publishSourceTransferTargetMutationApplyExecutionDelta(packet.sourceTransferTargetMutationApplyExecution);
  publishSourceTransferTargetSourceIntakeDelta(packet.sourceTransferTargetSourceIntake);
  publishSourceTransferTargetSourceResponseDelta(packet.sourceTransferTargetSourceResponse);
  publishSourceTransferTargetSourceReconciliationDelta(packet.sourceTransferTargetSourceReconciliation);
  publishConservativeSourceBufferDelta(packet.conservativeSourceBuffer);
  publishSourceBufferApplicationDelta(packet.upward?.aggregateState?.molecularSourceBufferApplication);
  publishSourceBufferAcceptanceDelta(packet.sourceBufferAcceptance);
  publishSourceBufferWritebackValidationDelta(packet.sourceBufferWritebackValidation);
  publishTargetBufferReplayValidationDelta(packet.targetBufferReplayValidation);
  publishTargetBufferMutationAuditDelta(packet.targetBufferMutationAudit);
  publishTargetBufferWorkerWriteQueueDelta(packet.targetBufferWorkerWriteQueue);
  publishTargetBufferWorkerWriteExecutionDelta(packet.targetBufferWorkerWriteExecution);
  publishTargetBufferWorkerWriteVerificationDelta(packet.targetBufferWorkerWriteVerification);
  publishScientificInvariantGateDelta(packet.molecularScientificInvariantGate);
  publishScientificReadinessManifestDelta(packet.molecularScientificReadinessManifest);
  return packet;
}

function updateMolecularBufferWriterControls() {
  molecularBufferAuto?.classList.toggle('active', molecularBufferWriterAutoEnabled);
  molecularBufferAuto?.setAttribute('aria-pressed', String(molecularBufferWriterAutoEnabled));
  if (molecularBufferStatus) {
    const report = molecularBufferWriterLastReport;
    const state = report?.applied
      ? `applied ${report.appliedBatchCount ?? 0}/${report.targetBatchCount ?? 0}`
      : report?.schema
        ? `blocked ${report.blockedBatchCount ?? 0}/${report.targetBatchCount ?? 0}`
        : 'idle';
    molecularBufferStatus.textContent = `${molecularBufferWriterAutoEnabled ? 'auto' : 'manual'} / ${state} / run ${molecularBufferWriterRunCount} / ${molecularBufferWriterLastReason}`;
  }
  return {
    schema: 'peercompute.multiscale.molecular-buffer-writer-runtime.v0',
    autoEnabled: molecularBufferWriterAutoEnabled,
    intervalFrames: molecularBufferWriterAutoIntervalFrames,
    runCount: molecularBufferWriterRunCount,
    lastFrame: Number.isFinite(molecularBufferWriterLastFrame) ? molecularBufferWriterLastFrame : null,
    lastReason: molecularBufferWriterLastReason,
    lastSourceApplyReport: molecularBufferWriterLastSourceApplyReport,
    lastReport: molecularBufferWriterLastReport
  };
}

function prepareMolecularBufferWriterSourceIntake({
  reason = 'buffer-writer-source-prepare',
  transferApplicationConfig = {},
  transferTransactionConfig = {},
  applyConfig = {}
} = {}) {
  model.setMolecularTransferApplicationConfig({
    applicationRequested: true,
    mutationEnabled: true,
    scientificMode: true,
    targetAdaptersValidated: true,
    closedResidualToleranceProxy: 0.5,
    ...transferApplicationConfig
  });
  model.setMolecularTransferTransactionConfig({
    transactionEnabled: true,
    mutatorId: 'reactive-sph-source-preview-v0',
    ...transferTransactionConfig
  });
  model.setMolecularTargetMutationApplyConfig({
    executionRequested: true,
    proxyApplyEnabled: true,
    targetApplyImplemented: true,
    ...applyConfig
  });
  const report = model.executeMolecularTargetMutationApply({
    reason
  });
  molecularBufferWriterLastSourceApplyReport = report;
  publishSourceTransferTargetMutationApplyExecutionDelta(report);
  publishSourceTransferTargetSourceIntakeDelta(model.state.molecular.targetSourceIntake);
  publishSourceTransferTargetSourceResponseDelta(model.state.molecular.targetSourceResponse);
  publishSourceTransferTargetSourceReconciliationDelta(model.state.molecular.targetSourceReconciliation);
  publishConservativeSourceBufferDelta(model.state.molecular.conservativeSourceBuffer);
  return report;
}

function warmMolecularSourceBufferTargets({
  reason = 'demo-api-source-buffer-warm',
  transferApplicationConfig = {},
  transferTransactionConfig = {},
  applyConfig = {}
} = {}) {
  const sourceApplyReport = prepareMolecularBufferWriterSourceIntake({
    reason,
    transferApplicationConfig,
    transferTransactionConfig,
    applyConfig
  });
  let packet = publishMolecularSourceBufferWarmDeltas();
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const queue = packet?.targetBufferWorkerWriteQueue;
    const queueReady = queue?.canPlanWorkerWrite === true
      && Number(queue.queueReadyBatchCount || 0) === Number(queue.targetBatchCount || 0)
      && Number(queue.writeIntentCount || 0) > 0
      && Number(queue.queueReadyWriteIntentCount || 0) === Number(queue.writeIntentCount || 0);
    const replayReady = packet?.targetBufferReplayValidation?.canReplayProxy === true
      && Number(packet.targetBufferReplayValidation.replayedTargetCount || 0) === Number(packet.targetBufferReplayValidation.targetCount || 0);
    if (queueReady && replayReady) break;
    packet = publishMolecularSourceBufferWarmDeltas();
  }
  molecularBufferWriterLastReason = reason;
  renderReadout();
  return {
    schema: 'peercompute.multiscale.molecular-source-buffer-warm-api.v0',
    status: sourceApplyReport?.status || 'unknown',
    reason,
    sourceApplyReport,
    conservativeSourceBuffer: packet.conservativeSourceBuffer,
    sourceBufferApplication: packet.upward?.aggregateState?.molecularSourceBufferApplication,
    sourceBufferAcceptance: packet.sourceBufferAcceptance,
    sourceBufferWritebackValidation: packet.sourceBufferWritebackValidation,
    targetBufferReplayValidation: packet.targetBufferReplayValidation,
    targetBufferMutationAudit: packet.targetBufferMutationAudit,
    targetBufferWorkerWriteQueue: packet.targetBufferWorkerWriteQueue,
    scientificInvariantGate: packet.molecularScientificInvariantGate,
    scientificReadinessManifest: packet.molecularScientificReadinessManifest,
    writerRuntime: updateMolecularBufferWriterControls()
  };
}

function executeMolecularBufferWriter({
  reason = 'ui-buffer-writer',
  force = false,
  prepareSource = true
} = {}) {
  if (prepareSource && (force || molecularBufferWriterAutoEnabled)) {
    prepareMolecularBufferWriterSourceIntake({ reason: `${reason}-source-prepare` });
  }
  const packet = createModelPacketWithRuntimeEvidence();
  const queue = packet.targetBufferWorkerWriteQueue;
  const queueReady = queue?.canPlanWorkerWrite === true
    && Number(queue.queueReadyBatchCount || 0) === Number(queue.targetBatchCount || 0)
    && Number(queue.writeIntentCount || 0) > 0
    && Number(queue.queueReadyWriteIntentCount || 0) === Number(queue.writeIntentCount || 0);
  const alreadyApplied = packet.targetBufferWorkerWriteExecution?.applied === true
    && packet.targetBufferWorkerWriteVerification?.verified === true;
  if (!force && (!queueReady || alreadyApplied)) {
    molecularBufferWriterLastReport = packet.targetBufferWorkerWriteExecution || null;
    molecularBufferWriterLastFrame = renderFrame;
    molecularBufferWriterLastReason = alreadyApplied ? `${reason}-already-applied` : `${reason}-queue-not-ready`;
    return updateMolecularBufferWriterControls();
  }
  const report = model.executeMolecularTargetBufferWorkerWrite({
    reason,
    config: {
      executionRequested: true,
      proxyWorkerWriteEnabled: true,
      targetWorkerWriteImplemented: true
    }
  });
  molecularBufferWriterLastReport = report;
  molecularBufferWriterLastFrame = renderFrame;
  molecularBufferWriterLastReason = reason;
  if (report.applied === true) molecularBufferWriterRunCount += 1;
  publishTargetBufferWorkerWriteExecutionDelta(report);
  publishCurrentSourceBufferApplicationDelta();
  renderReadout();
  return updateMolecularBufferWriterControls();
}

function setMolecularBufferWriterAuto(enabled = true, options = {}) {
  molecularBufferWriterAutoEnabled = enabled === true;
  if (Number.isFinite(Number(options.intervalFrames))) {
    molecularBufferWriterAutoIntervalFrames = Math.min(1800, Math.max(30, Math.floor(Number(options.intervalFrames))));
  }
  molecularBufferWriterLastReason = molecularBufferWriterAutoEnabled ? 'auto-enabled' : 'auto-disabled';
  return updateMolecularBufferWriterControls();
}

function maybeRunMolecularBufferWriterAuto() {
  if (!molecularBufferWriterAutoEnabled) return null;
  if (!stateManager.isInitialized) return null;
  if (renderFrame - molecularBufferWriterLastFrame < molecularBufferWriterAutoIntervalFrames) return null;
  return executeMolecularBufferWriter({
    reason: 'auto-buffer-writer',
    force: false,
    prepareSource: true
  });
}

function maybePublishStatePacket({ force = false, reason = 'frame' } = {}) {
  const admission = refreshStatePublicationBudget({ reason, force });
  if (!admission.shouldPublish) {
    statePublicationSkippedFrameCount += 1;
    statePublicationBudgetReport = {
      ...refreshStatePublicationBudget({ reason: `${reason}-deferred` }),
      publishedThisFrame: false
    };
    return null;
  }

  const publishStart = performance.now();
  const packet = createModelPacketWithRuntimeEvidence();
  if (admission.shouldPublishWarmDeltas) {
    publishSourceSinkBalanceDelta(packet.sourceSinkBalance);
    publishSourceTransferDelta(packet.sourceTransfer);
    publishSourceTransferApplicationDelta(packet.sourceTransferApplication);
    publishSourceTransferTransactionDelta(packet.sourceTransferTransaction);
    publishSourceTransferTargetPreviewDelta(packet.sourceTransferTargetPreview);
    publishSourceTransferTargetMutatorRegistryDelta(packet.sourceTransferTargetMutatorRegistry);
    publishSourceTransferTargetMutationPreflightDelta(packet.sourceTransferTargetMutationPreflight);
    publishSourceTransferTargetMutationOperationPlanDelta(packet.sourceTransferTargetMutationOperationPlan);
    publishSourceTransferTargetMutationInvariantCheckDelta(packet.sourceTransferTargetMutationInvariantCheck);
    publishSourceTransferTargetMutationCommitDelta(packet.sourceTransferTargetMutationCommit);
    publishSourceTransferTargetMutationDispatchDelta(packet.sourceTransferTargetMutationDispatch);
    publishSourceTransferTargetMutationApplyValidationDelta(packet.sourceTransferTargetMutationApplyValidation);
    publishSourceTransferTargetMutationApplyExecutionDelta(packet.sourceTransferTargetMutationApplyExecution);
    publishSourceTransferTargetSourceIntakeDelta(packet.sourceTransferTargetSourceIntake);
    publishSourceTransferTargetSourceResponseDelta(packet.sourceTransferTargetSourceResponse);
    publishSourceTransferTargetSourceReconciliationDelta(packet.sourceTransferTargetSourceReconciliation);
    publishConservativeSourceBufferDelta(packet.conservativeSourceBuffer);
    publishSourceBufferApplicationDelta(packet.upward?.aggregateState?.molecularSourceBufferApplication);
    publishSourceBufferAcceptanceDelta(packet.sourceBufferAcceptance);
    publishSourceBufferWritebackValidationDelta(packet.sourceBufferWritebackValidation);
    publishTargetBufferReplayValidationDelta(packet.targetBufferReplayValidation);
    publishTargetBufferMutationAuditDelta(packet.targetBufferMutationAudit);
    publishTargetBufferWorkerWriteQueueDelta(packet.targetBufferWorkerWriteQueue);
    publishTargetBufferWorkerWriteExecutionDelta(packet.targetBufferWorkerWriteExecution);
    publishTargetBufferWorkerWriteVerificationDelta(packet.targetBufferWorkerWriteVerification);
    publishScientificInvariantGateDelta(packet.molecularScientificInvariantGate);
    publishScientificReadinessManifestDelta(packet.molecularScientificReadinessManifest);
    publishLawGraphDelta(packet.lawGraph);
    publishUlgRuntimeDelta(packet.ulgRuntime);
    publishConservationDelta(packet.conservation);
    publishCouplingDelta(packet.coupling);
    publishClosureDelta('closure:quantum-orbital', packet.upward?.closureResults?.quantumOrbital);
    publishClosureDelta('closure:quantum-material-potential', packet.upward?.closureResults?.quantumMaterialPotential);
  }
  statePublicationLastDurationMs = performance.now() - publishStart;
  statePublicationLastPublishedFrame = renderFrame;
  statePublicationPublishCount += 1;
  statePublicationBudgetReport = {
    ...refreshStatePublicationBudget({ reason: `${reason}-published` }),
    shouldPublish: true,
    shouldPublishWarmDeltas: admission.shouldPublishWarmDeltas,
    publishedThisFrame: true,
    status: admission.packetIntervalFrames > 1 ? 'published-throttled' : 'live'
  };
  return packet;
}

function refreshLowerScaleRefinementReport(frame = solverFrame, activeLayerId = model.activeLayer?.id || null) {
  const refinementRequests = model.estimateRefinementRequests();
  lowerScaleRefinementReport = lowerScaleRefinementScheduler.evaluate({
    frame,
    activeLayerId,
    refinementRequests,
    state: model.state,
    environment: model.environment,
    runtimeScaler: runtimeScalerStatus,
    solverGovernor: solverGovernorStatus,
    solverRuntime: solverRuntimeStatus,
    frameMsAvg: runtimeScalerStatus?.frameMsAvg ?? solverGovernorStatus?.frameMsAvg ?? null
  });
  return lowerScaleRefinementReport;
}

function shouldRunSolverForFrame(key, frame, cadenceContext, refinementReport) {
  return solverGovernor.shouldRun(key, frame, cadenceContext)
    || shouldRunLowerScaleRefinementSolver(refinementReport, key);
}

function shouldRunActiveLayerWarmupSolver(key, activeLayerId) {
  if (!activeLayerId || SOLVER_LAYER_AFFINITY[key] !== activeLayerId) return false;
  const runtime = solverRuntimeStatus?.[key] || null;
  return runtime?.pending !== true
    && (activeLayerRefreshSolverKeys.has(key) || Number(runtime?.completedTasks || 0) === 0);
}

function hasWebgpuQuantumOrbitalSourceForMolecularDynamics() {
  const orbital = model.state.orbital || {};
  return String(orbital.finiteGridBackend || '').startsWith('webgpu')
    && Number(orbital.finiteGridSampleCount || 0) > 0;
}

function hasWebgpuQuantumMaterialSourceForMolecularDynamics() {
  const orbital = model.state.orbital || {};
  const materialPotential = orbital.materialPotential || {};
  const batch = materialPotential.concurrentBatch || orbital.materialPotentialConcurrentBatch || null;
  const recordCount = Number(batch?.recordCount ?? orbital.materialPotentialConcurrentRecordCount ?? 0);
  const backend = String(batch?.backend || orbital.materialPotentialConcurrentBackend || materialPotential.concurrentBackend || '');
  return batch?.schema === 'peercompute.multiscale.quantum-material-potential.concurrent-batch.v0'
    && recordCount > 0
    && backend.startsWith('webgpu');
}

function getMolecularLowerLawDependencyDecision(key, activeLayerId) {
  if (activeLayerId !== 'molecular') return null;
  if (key === 'quantumOrbitalGrid' && !hasWebgpuQuantumOrbitalSourceForMolecularDynamics()) {
    return {
      shouldRun: true,
      triggerType: 'dependency',
      request: 'molecular-lower-law-source',
      reason: 'molecular-md-quantum-orbital-source-missing',
      consumerSolverKey: 'molecularDynamics',
      requiredSourceSchema: 'peercompute.multiscale.quantum-orbital-grid.result.v0',
      priority: 34
    };
  }
  if (key === 'quantumMaterialPotential' && !hasWebgpuQuantumMaterialSourceForMolecularDynamics()) {
    return {
      shouldRun: true,
      triggerType: 'dependency',
      request: 'molecular-lower-law-source',
      reason: 'molecular-md-qmat-source-missing',
      consumerSolverKey: 'molecularDynamics',
      requiredSourceSchema: 'peercompute.multiscale.quantum-material-potential.concurrent-batch.v0',
      priority: 38
    };
  }
  return null;
}

function getSolverStepEntries() {
  return [
    { key: 'nbody', step: stepNBodySolverWorker },
    { key: 'reactiveThermal', step: stepReactiveThermalWorker },
    { key: 'maxwell', step: stepMaxwellFieldWorker },
    { key: 'cosmologyExpansion', step: stepCosmologyExpansionWorker },
    { key: 'molecularDynamics', step: stepMolecularDynamicsWorker },
    { key: 'quantumOrbitalGrid', step: stepQuantumOrbitalGridWorker },
    { key: 'quantumMaterialPotential', step: stepQuantumMaterialPotentialWorker },
    { key: 'sphMaterial', step: stepSphMaterialWorker },
    { key: 'membraneShell', step: stepMembraneShellWorker },
    { key: 'hydroAtmosphere', step: stepHydroAtmosphereWorker },
    { key: 'radiationOpacity', step: stepRadiationOpacityWorker },
    { key: 'stellarFusion', step: stepStellarFusionWorker },
    { key: 'magnetospherePlasma', step: stepMagnetospherePlasmaWorker },
    { key: 'picPlasmaPatch', step: stepPicPlasmaPatchWorker },
    { key: 'relativisticCorrection', step: stepRelativisticCorrectionWorker },
    { key: 'combustionPlume', step: stepCombustionPlumeWorker }
  ];
}

function createSolverSubmissionCandidates(frame, cadenceContext, refinementReport) {
  return getSolverStepEntries()
    .map(({ key }) => {
      const cadenceRun = solverGovernor.shouldRun(key, frame, cadenceContext);
      const refinementRun = shouldRunLowerScaleRefinementSolver(refinementReport, key);
      const warmupRun = shouldRunActiveLayerWarmupSolver(key, cadenceContext.activeLayerId);
      const dependencyDecision = getMolecularLowerLawDependencyDecision(key, cadenceContext.activeLayerId);
      const dependencyRun = dependencyDecision?.shouldRun === true;
      const remoteSolverPlacementRun = remoteSolverPlacementRefreshSolverKeys.has(key);
      if (!cadenceRun && !refinementRun && !warmupRun && !dependencyRun && !remoteSolverPlacementRun) return null;
      return {
        key,
        cadenceRun,
        warmupRun,
        refinementRun,
        dependencyRun,
        remoteSolverPlacementRun,
        dependencyDecision,
        remoteSolverPlacementDecision: remoteSolverPlacementRun
          ? {
            triggerType: 'remote-solver-placement',
            reason: 'promoted-remote-solver-refresh',
            priority: 96,
            decision: remoteSolverPlacementDecisionReport?.entries?.[key] || null
          }
          : null,
        refinementDecision: refinementReport?.solverDecisions?.[key] || null,
        pending: solverRuntimeStatus?.[key]?.pending === true
      };
    })
    .filter(Boolean);
}

function refreshActiveLayerSolverSet(activeLayerId) {
  if (!activeLayerId || activeLayerRefreshLayerId === activeLayerId) return;
  activeLayerRefreshLayerId = activeLayerId;
  activeLayerRefreshSolverKeys.clear();
  for (const { key } of getSolverStepEntries()) {
    if (SOLVER_LAYER_AFFINITY[key] === activeLayerId) {
      activeLayerRefreshSolverKeys.add(key);
    }
  }
}

function stepSolverWorkers() {
  const frame = solverFrame;
  solverFrame += 1;
  const activeLayerId = model.activeLayer?.id || null;
  solverGovernorStatus = solverGovernor.setActiveLayer(activeLayerId, frame);
  refreshActiveLayerSolverSet(activeLayerId);
  const cadenceContext = { activeLayerId };
  const refinementReport = refreshLowerScaleRefinementReport(frame, activeLayerId);
  const candidates = createSolverSubmissionCandidates(frame, cadenceContext, refinementReport);
  const managerStats = computeStatus.peercompute?.managerCapabilities?.stats || computeManager.getStats?.() || null;
  solverSubmissionBudgetReport = createSolverSubmissionBudget({
    frame,
    activeLayerId,
    candidates,
    runtimeScaler: runtimeScalerStatus,
    solverGovernor: solverGovernorStatus,
    managerStats,
    computeStatus,
    reason: 'solver-frame'
  });
  for (const { key, step } of getSolverStepEntries()) {
    if (shouldSubmitSolver(solverSubmissionBudgetReport, key)) {
      step();
      if (stateManager.isInitialized) {
        activeLayerRefreshSolverKeys.delete(key);
        remoteSolverPlacementRefreshSolverKeys.delete(key);
      }
    }
  }
  stepUlgRuntimeWorker();
}

function stepNBodySolverWorker() {
  if (!stateManager.isInitialized || nbodySolverPending) return;
  nbodySolverPending = true;
  nbodySolverSubmitted += 1;
  updateSolverRuntimeStatus();

  const firstStep = nbodySolverCompleted === 0 && nbodySolverFailed === 0;
  computeManager.submitSolverTask(N_BODY_SOLVER_ID, {
    id: `${N_BODY_TASK_ID}:step:${nbodySolverSubmitted}`,
    stateKey: N_BODY_STATE_KEY,
    placementHint: getSolverPlacementHint('nbody'),
    input: {
      taskId: N_BODY_TASK_ID,
      stateKey: N_BODY_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      dt: 0.006,
      substeps: 4,
      gravitationalConstant: 1,
      softening: 0.025,
      gravityMode: solverBudget.nbody.gravityMode,
      treeTheta: solverBudget.nbody.treeTheta,
      treeThreshold: solverBudget.nbody.treeThreshold,
      treeLeafSize: solverBudget.nbody.treeLeafSize,
      state: firstStep ? nbodySolverState : undefined
    }
  })
    .then((result) => {
      nbodySolverCompleted += 1;
      nbodySolverLastError = null;
      if (result?.state) {
        nbodySolverState = result.state;
      }
      model.applyNBodySolverResult(result);
      nbodySolverLastResult = result
        ? {
          schema: result.schema,
          executionContext: result.executionContext,
          backend: result.backend,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          bodyCount: result.state?.masses?.length ?? result.diagnostics?.count ?? null,
          diagnostics: result.diagnostics,
          conservation: result.conservation,
          approximation: result.approximation,
          webgpuStatus: result.webgpuStatus,
          webgpuError: result.webgpuError
        }
        : null;
      if (result) {
        scene.applyNBodySolverState(result);
      }
    })
    .catch((error) => {
      nbodySolverFailed += 1;
      nbodySolverLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      nbodySolverPending = false;
      updateSolverRuntimeStatus();
    });
}

function stepReactiveThermalWorker() {
  if (!stateManager.isInitialized || reactiveSolverPending) return;
  reactiveSolverPending = true;
  reactiveSolverSubmitted += 1;
  updateSolverRuntimeStatus();

  const firstStep = reactiveSolverCompleted === 0 && reactiveSolverFailed === 0;
  computeManager.submitSolverTask(REACTIVE_SOLVER_ID, {
    id: `${REACTIVE_TASK_ID}:step:${reactiveSolverSubmitted}`,
    stateKey: REACTIVE_STATE_KEY,
    placementHint: getSolverPlacementHint('reactiveThermal'),
    input: {
      taskId: REACTIVE_TASK_ID,
      stateKey: REACTIVE_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      dt: 1 / 30,
      environment: model.environment,
      coupling: {
        fireIntensity: model.state.surface.fireIntensity,
        fuelFraction: model.state.surface.fuelFraction,
        flameTemperatureK: model.state.surface.flameTemperatureK,
        radiativeHeatFlux: model.state.surface.radiativeHeatFlux,
        waterContact: model.state.surface.waterContact,
        steamFraction: model.state.balloon.steamMassKg,
        reactionProgress: model.state.molecular.reactionProgress,
        molecularDynamicsClosure: model.state.closures.molecularDynamics,
        molecularTargetSourceIntake: model.getMolecularTargetSourceIntakeFor('reactive-thermal-cell'),
        molecularConservativeSourceBuffer: model.getMolecularConservativeSourceBufferFor('reactive-thermal-cell')
      },
      state: firstStep ? reactiveSolverState : undefined
    }
  })
    .then((result) => {
      reactiveSolverCompleted += 1;
      reactiveSolverLastError = null;
      if (result?.state) {
        reactiveSolverState = result.state;
      }
      model.applyReactiveThermalResult(result);
      publishClosureDelta('closure:reactive-thermal-cell', model.state.closures.reactiveThermal);
      publishCurrentSourceBufferApplicationDelta();
      reactiveSolverLastResult = result
        ? {
          schema: result.schema,
          executionContext: result.executionContext,
          backend: result.backend,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          temperatureK: result.closure?.temperatureK ?? result.state?.temperatureK ?? 0,
          pressurePa: result.closure?.pressurePa ?? result.state?.pressurePa ?? 0,
          heatReleaseNorm: result.closure?.heatReleaseNorm ?? result.state?.heatReleaseNorm ?? 0,
          steamFraction: result.closure?.steamFraction ?? result.state?.waterVaporFraction ?? 0,
          speciesInventoryDelta: result.conservation?.speciesInventoryDelta ?? 0
        }
        : null;
    })
    .catch((error) => {
      reactiveSolverFailed += 1;
      reactiveSolverLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      reactiveSolverPending = false;
      updateSolverRuntimeStatus();
    });
}

function stepMaxwellFieldWorker() {
  if (!stateManager.isInitialized || maxwellSolverPending) return;
  maxwellSolverPending = true;
  maxwellSolverSubmitted += 1;
  updateSolverRuntimeStatus();

  const firstStep = maxwellSolverCompleted === 0 && maxwellSolverFailed === 0;
  computeManager.submitSolverTask(MAXWELL_SOLVER_ID, {
    id: `${MAXWELL_TASK_ID}:step:${maxwellSolverSubmitted}`,
    stateKey: MAXWELL_STATE_KEY,
    placementHint: getSolverPlacementHint('maxwell'),
    input: {
      taskId: MAXWELL_TASK_ID,
      stateKey: MAXWELL_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      dt: 0.018,
      lightSpeed: 1,
      damping: 0.995,
      state: firstStep ? maxwellSolverState : undefined
    }
  })
    .then((result) => {
      maxwellSolverCompleted += 1;
      maxwellSolverLastError = null;
      if (result?.state) {
        maxwellSolverState = result.state;
      }
      model.applyMaxwellFieldResult(result);
      if (result) {
        scene.applyMaxwellFieldState(result);
      }
      maxwellSolverLastResult = result
        ? {
          schema: result.schema,
          executionContext: result.executionContext,
          backend: result.backend,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          fieldEnergy: result.diagnostics?.fieldEnergy ?? 0,
          netCharge: result.diagnostics?.netCharge ?? 0,
          poyntingFlux: result.diagnostics?.poyntingFlux || [0, 0, 0],
          webgpuStatus: result.webgpuStatus,
          webgpuError: result.webgpuError
        }
        : null;
    })
    .catch((error) => {
      maxwellSolverFailed += 1;
      maxwellSolverLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      maxwellSolverPending = false;
      updateSolverRuntimeStatus();
    });
}

function stepCosmologyExpansionWorker() {
  if (!stateManager.isInitialized || cosmologyExpansionSolverPending) return;
  cosmologyExpansionSolverPending = true;
  cosmologyExpansionSolverSubmitted += 1;
  updateSolverRuntimeStatus();

  const firstStep = cosmologyExpansionSolverCompleted === 0 && cosmologyExpansionSolverFailed === 0;
  computeManager.submitSolverTask(COSMOLOGY_EXPANSION_SOLVER_ID, {
    id: `${COSMOLOGY_EXPANSION_TASK_ID}:step:${cosmologyExpansionSolverSubmitted}`,
    stateKey: COSMOLOGY_EXPANSION_STATE_KEY,
    placementHint: getSolverPlacementHint('cosmologyExpansion'),
    input: {
      taskId: COSMOLOGY_EXPANSION_TASK_ID,
      stateKey: COSMOLOGY_EXPANSION_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      dt: 1 / 90,
      environment: model.environment,
      coupling: {
        scaleFactor: model.state.cosmology.expansion.scaleFactor,
        hubbleRate: model.state.cosmology.expansion.hubbleRate,
        matterOmega: model.state.cosmology.expansion.matterOmega,
        darkEnergyOmega: model.state.cosmology.expansion.darkEnergyOmega,
        galaxyTurbulence: model.state.galaxy.gasTurbulence,
        starFormationRate: model.state.galaxy.starFormationRate,
        maxwellFieldEnergy: model.state.galaxy.maxwell.fieldEnergy,
        poyntingFlux: model.state.galaxy.maxwell.poyntingFlux,
        relativisticLensing: model.state.solar.relativity.lensingDeflectionArcsecProxy,
        relativisticRedshift: model.state.solar.relativity.gravitationalRedshiftProxy,
        stellarLuminosityFactor: model.state.solar.stellarFusion.luminosityFactor,
        radiationPressure: model.state.solar.radiationPressure
      },
      state: firstStep ? cosmologyExpansionSolverState : undefined
    }
  })
    .then((result) => {
      cosmologyExpansionSolverCompleted += 1;
      cosmologyExpansionSolverLastError = null;
      if (result?.state) {
        cosmologyExpansionSolverState = result.state;
      }
      model.applyCosmologyExpansionResult(result);
      if (result) {
        scene.applyCosmologyExpansionState(result);
      }
      cosmologyExpansionSolverLastResult = result
        ? {
          schema: result.schema,
          executionContext: result.executionContext,
          backend: result.backend,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          sampleCount: result.diagnostics?.sampleCount ?? result.state?.sampleCount ?? 0,
          scaleFactor: result.diagnostics?.scaleFactor ?? result.state?.scaleFactor ?? 1,
          redshift: result.diagnostics?.redshift ?? 0,
          hubbleRate: result.diagnostics?.hubbleRate ?? result.state?.hubbleRate ?? 0,
          matterOmega: result.diagnostics?.matterOmega ?? result.state?.matterOmega ?? 0,
          darkEnergyOmega: result.diagnostics?.darkEnergyOmega ?? result.state?.darkEnergyOmega ?? 0,
          meanDensityContrast: result.diagnostics?.meanDensityContrast ?? 0,
          maxDensityContrast: result.diagnostics?.maxDensityContrast ?? 0,
          voidFraction: result.diagnostics?.voidFraction ?? 0,
          meanTemperatureK: result.diagnostics?.meanTemperatureK ?? 0,
          meanVelocityDivergence: result.diagnostics?.meanVelocityDivergence ?? 0,
          filamentEnergy: result.diagnostics?.filamentEnergy ?? 0,
          structureGrowthProxy: result.diagnostics?.structureGrowthProxy ?? 0,
          expansionWorkProxy: result.diagnostics?.expansionWorkProxy ?? 0,
          hubbleTensionProxy: result.diagnostics?.hubbleTensionProxy ?? 0,
          conservation: result.conservation,
          webgpuStatus: result.webgpuStatus,
          webgpuError: result.webgpuError
        }
        : null;
    })
    .catch((error) => {
      cosmologyExpansionSolverFailed += 1;
      cosmologyExpansionSolverLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      cosmologyExpansionSolverPending = false;
      updateSolverRuntimeStatus();
    });
}

function stepMolecularDynamicsWorker() {
  if (!stateManager.isInitialized || molecularDynamicsSolverPending) return;
  molecularDynamicsSolverPending = true;
  molecularDynamicsSolverSubmitted += 1;
  updateSolverRuntimeStatus();

  const firstStep = molecularDynamicsSolverCompleted === 0 && molecularDynamicsSolverFailed === 0;
  computeManager.submitSolverTask(MOLECULAR_DYNAMICS_SOLVER_ID, {
    id: `${MOLECULAR_DYNAMICS_TASK_ID}:step:${molecularDynamicsSolverSubmitted}`,
    stateKey: MOLECULAR_DYNAMICS_STATE_KEY,
    placementHint: getSolverPlacementHint('molecularDynamics'),
    input: {
      taskId: MOLECULAR_DYNAMICS_TASK_ID,
      stateKey: MOLECULAR_DYNAMICS_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      dt: 1 / 90,
      environment: model.environment,
      coupling: {
        fireIntensity: model.state.surface.fireIntensity,
        waterContact: model.state.surface.waterContact,
        radiativeHeatFlux: model.state.surface.radiativeHeatFlux,
        reactionProgress: model.state.molecular.reactionProgress,
        heatReleaseNorm: model.state.molecular.heatReleaseNorm,
        combustionHeatRelease: model.state.surface.combustionPlume.heatReleaseMean,
        reactiveTemperatureK: model.state.surface.reactiveCell.temperatureK,
        sphCoolingPotential: model.state.mpm.sphMaterial.coolingPotential,
        quantumOrbital: model.state.orbital,
        quantumOrbitalClosure: model.state.closures.quantumOrbital,
        quantumMaterialPotential: model.state.orbital.materialPotential,
        quantumMaterialPotentialClosure: model.state.closures.quantumMaterialPotential,
        ulgRuntimeStateDelta: model.state.ulgRuntimeStateDelta,
        ulgRuntimeExecution: model.state.ulgRuntimeExecution
      },
      state: firstStep ? molecularDynamicsSolverState : undefined
    }
  })
    .then((result) => {
      molecularDynamicsSolverCompleted += 1;
      molecularDynamicsSolverLastError = null;
      if (result?.state) {
        molecularDynamicsSolverState = result.state;
      }
      model.applyMolecularDynamicsResult(result);
      publishClosureDelta('closure:molecular-dynamics', model.state.closures.molecularDynamics);
      if (result) {
        scene.applyMolecularDynamicsState(result);
      }
      molecularDynamicsSolverLastResult = result
        ? {
          schema: result.schema,
          executionContext: result.executionContext,
          backend: result.backend,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          atomCount: result.diagnostics?.atomCount ?? result.state?.atomCount ?? 0,
          bondCount: result.diagnostics?.bondCount ?? 0,
          meanBondOrder: result.diagnostics?.meanBondOrder ?? 0,
          reactionProgress: result.diagnostics?.reactionProgress ?? 0,
          heatReleaseProxy: result.diagnostics?.heatReleaseProxy ?? 0,
          meanTemperatureK: result.diagnostics?.meanTemperatureK ?? 0,
          maxTemperatureK: result.diagnostics?.maxTemperatureK ?? 0,
          totalCharge: result.diagnostics?.totalCharge ?? 0,
          ionizationFraction: result.diagnostics?.ionizationFraction ?? 0,
          meanAbsCharge: result.diagnostics?.meanAbsCharge ?? 0,
          dipoleMomentProxy: result.diagnostics?.dipoleMomentProxy ?? 0,
          electricalConductivityProxy: result.diagnostics?.electricalConductivityProxy ?? 0,
          forceEnergyLedger: result.diagnostics?.forceEnergyLedger || null,
          thermoPhaseLedger: result.diagnostics?.thermoPhaseLedger || null,
          phaseFractions: result.diagnostics?.phaseFractions || result.diagnostics?.thermoPhaseLedger?.phaseFractions || null,
          phaseRegime: result.diagnostics?.phaseRegime || result.diagnostics?.thermoPhaseLedger?.phaseRegime || 'unknown',
          solidFraction: result.diagnostics?.solidFraction ?? result.diagnostics?.thermoPhaseLedger?.solidFraction ?? 0,
          liquidFraction: result.diagnostics?.liquidFraction ?? result.diagnostics?.thermoPhaseLedger?.liquidFraction ?? 0,
          vaporFraction: result.diagnostics?.vaporFraction ?? result.diagnostics?.thermoPhaseLedger?.vaporFraction ?? 0,
          plasmaFraction: result.diagnostics?.plasmaFraction ?? result.diagnostics?.thermoPhaseLedger?.plasmaFraction ?? 0,
          phaseChangeRateProxy: result.diagnostics?.phaseChangeRateProxy ?? result.diagnostics?.thermoPhaseLedger?.phaseChangeRateProxy ?? 0,
          latentHeatSinkProxy: result.diagnostics?.latentHeatSinkProxy ?? result.diagnostics?.thermoPhaseLedger?.latentHeatSinkProxy ?? 0,
          latentHeatReleaseProxy: result.diagnostics?.latentHeatReleaseProxy ?? result.diagnostics?.thermoPhaseLedger?.latentHeatReleaseProxy ?? 0,
          waterMoleculeFraction: result.diagnostics?.waterMoleculeFraction ?? result.diagnostics?.thermoPhaseLedger?.waterMoleculeFraction ?? 0,
          condensationOrderProxy: result.diagnostics?.condensationOrderProxy ?? result.diagnostics?.thermoPhaseLedger?.condensationOrderProxy ?? 0,
          forceFieldPotentialEnergyProxy: result.diagnostics?.forceFieldPotentialEnergyProxy ?? result.diagnostics?.potentialEnergyProxy ?? 0,
          forceFieldTotalEnergyProxy: result.diagnostics?.forceFieldTotalEnergyProxy ?? result.diagnostics?.totalEnergyProxy ?? 0,
          forceFieldBondedAttractionEnergyProxy: result.diagnostics?.forceFieldBondedAttractionEnergyProxy ?? 0,
          forceFieldBondStrainEnergyProxy: result.diagnostics?.forceFieldBondStrainEnergyProxy ?? 0,
          forceFieldElectrostaticEnergyProxy: result.diagnostics?.forceFieldElectrostaticEnergyProxy ?? 0,
          forceFieldRepulsionEnergyProxy: result.diagnostics?.forceFieldRepulsionEnergyProxy ?? 0,
          forceFieldQeqResidualPenaltyProxy: result.diagnostics?.forceFieldQeqResidualPenaltyProxy ?? 0,
          forceFieldQuantumCouplingBiasEnergyProxy: result.diagnostics?.forceFieldQuantumCouplingBiasEnergyProxy ?? 0,
          forceFieldQuantumMaterialSourceBiasEnergyProxy: result.diagnostics?.forceFieldQuantumMaterialSourceBiasEnergyProxy ?? 0,
          forceFieldQuantumMaterialPairForceBiasEnergyProxy: result.diagnostics?.forceFieldQuantumMaterialPairForceBiasEnergyProxy ?? 0,
          forceFieldQuantumMaterialBiasEnergyProxy: result.diagnostics?.forceFieldQuantumMaterialBiasEnergyProxy ?? 0,
          forceFieldPairCount: result.diagnostics?.forceFieldPairCount ?? 0,
          forceFieldCandidatePairCount: result.diagnostics?.forceFieldCandidatePairCount ?? 0,
          forceFieldClosePairCount: result.diagnostics?.forceFieldClosePairCount ?? 0,
          forceFieldForceLaw: result.diagnostics?.forceFieldForceLaw || null,
          forceFieldForceLawSchema: result.diagnostics?.forceFieldForceLawSchema || null,
          forceFieldForceLawModelId: result.diagnostics?.forceFieldForceLawModelId || null,
          forceFieldMeanPairRestLengthReducedNm: result.diagnostics?.forceFieldMeanPairRestLengthReducedNm ?? 0,
          forceFieldMeanPairAffinity: result.diagnostics?.forceFieldMeanPairAffinity ?? 0,
          forceFieldIonicPairCandidateCount: result.diagnostics?.forceFieldIonicPairCandidateCount ?? 0,
          forceFieldPolarPairCandidateCount: result.diagnostics?.forceFieldPolarPairCandidateCount ?? 0,
          forceFieldCovalentPairCandidateCount: result.diagnostics?.forceFieldCovalentPairCandidateCount ?? 0,
          forceFieldWeakPairCandidateCount: result.diagnostics?.forceFieldWeakPairCandidateCount ?? 0,
          forceFieldMaxBondStrain: result.diagnostics?.forceFieldMaxBondStrain ?? 0,
          forceFieldMeanBondStrain: result.diagnostics?.forceFieldMeanBondStrain ?? 0,
          molecularGeometryForceLaw: result.diagnostics?.molecularGeometryForceLaw || null,
          molecularGeometryForceLawSchema: result.diagnostics?.molecularGeometryForceLawSchema || null,
          molecularGeometryForceLawModelId: result.diagnostics?.molecularGeometryForceLawModelId || null,
          waterGeometryTripletCount: result.diagnostics?.waterGeometryTripletCount ?? 0,
          waterGeometryCompleteTripletCount: result.diagnostics?.waterGeometryCompleteTripletCount ?? 0,
          waterGeometryMeanAngleDeg: result.diagnostics?.waterGeometryMeanAngleDeg ?? 0,
          waterGeometryMeanAbsAngleErrorDeg: result.diagnostics?.waterGeometryMeanAbsAngleErrorDeg ?? 0,
          waterGeometryRmsAngleErrorDeg: result.diagnostics?.waterGeometryRmsAngleErrorDeg ?? 0,
          waterGeometryMaxAbsAngleErrorDeg: result.diagnostics?.waterGeometryMaxAbsAngleErrorDeg ?? 0,
          waterGeometryMeanOhDistanceReducedNm: result.diagnostics?.waterGeometryMeanOhDistanceReducedNm ?? 0,
          waterGeometryMeanHhDistanceReducedNm: result.diagnostics?.waterGeometryMeanHhDistanceReducedNm ?? 0,
          waterGeometryClosureFraction: result.diagnostics?.waterGeometryClosureFraction ?? 0,
          waterGeometryStiffnessProxy: result.diagnostics?.waterGeometryStiffnessProxy ?? 0,
          waterGeometryEnergyProxy: result.diagnostics?.waterGeometryEnergyProxy ?? 0,
          chargeEquilibration: result.diagnostics?.chargeEquilibration || null,
          chargeEquilibrationResidualRms: result.diagnostics?.chargeEquilibrationResidualRms ?? 0,
          chargeEquilibrationChargeRmsDelta: result.diagnostics?.chargeEquilibrationChargeRmsDelta ?? 0,
          chargeEquilibrationNeutralizationCharge: result.diagnostics?.chargeEquilibration?.neutralizationCharge ?? 0,
          chargeEquilibrationNeutralizationResidualCharge: result.diagnostics?.chargeEquilibration?.neutralizationResidualCharge ?? 0,
          quantumMaterialElectronicChargeSourceApplied: result.diagnostics?.quantumMaterialElectronicChargeSourceApplied === true,
          quantumMaterialElectronicChargeSourceSchema: result.diagnostics?.quantumMaterialElectronicChargeSourceSchema || null,
          quantumMaterialElectronicChargeSourceModelId: result.diagnostics?.quantumMaterialElectronicChargeSourceModelId || null,
          quantumMaterialElectronicChargeTargetPairLabel: result.diagnostics?.quantumMaterialElectronicChargeTargetPairLabel || 'all-pairs',
          quantumMaterialElectronicChargeDeltaProxy: result.diagnostics?.quantumMaterialElectronicChargeDeltaProxy ?? 0,
          quantumMaterialElectronicIonizationDriveProxy: result.diagnostics?.quantumMaterialElectronicIonizationDriveProxy ?? 0,
          quantumMaterialElectronicChargeMobilityProxy: result.diagnostics?.quantumMaterialElectronicChargeMobilityProxy ?? 0,
          quantumMaterialElectronicHardnessSofteningProxy: result.diagnostics?.quantumMaterialElectronicHardnessSofteningProxy ?? 0,
          quantumMaterialElectronicScreeningDampingScale: result.diagnostics?.quantumMaterialElectronicScreeningDampingScale ?? 1,
          quantumMaterialElectronicQeqMixProxy: result.diagnostics?.quantumMaterialElectronicQeqMixProxy ?? 0,
          quantumMaterialElectronicChargeTransferPotentialProxy: result.diagnostics?.quantumMaterialElectronicChargeTransferPotentialProxy ?? 0,
          quantumMaterialElectronicChargeSourceConfidence: result.diagnostics?.quantumMaterialElectronicChargeSourceConfidence ?? 0,
          quantumMaterialReactionBarrierSurfaceApplied: result.diagnostics?.quantumMaterialReactionBarrierSurfaceApplied === true,
          quantumMaterialReactionBarrierSurfaceSchema: result.diagnostics?.quantumMaterialReactionBarrierSurfaceSchema || null,
          quantumMaterialReactionBarrierSurfaceModelId: result.diagnostics?.quantumMaterialReactionBarrierSurfaceModelId || null,
          quantumMaterialReactionBarrierTargetReactionId: result.diagnostics?.quantumMaterialReactionBarrierTargetReactionId || null,
          quantumMaterialReactionBarrierTargetPairLabel: result.diagnostics?.quantumMaterialReactionBarrierTargetPairLabel || 'all-pairs',
          quantumMaterialReactionBarrierActivationEnergyEvProxy: result.diagnostics?.quantumMaterialReactionBarrierActivationEnergyEvProxy ?? 0,
          quantumMaterialReactionBarrierProbabilityProxy: result.diagnostics?.quantumMaterialReactionBarrierProbabilityProxy ?? 0,
          quantumMaterialReactionBarrierGateDampingScale: result.diagnostics?.quantumMaterialReactionBarrierGateDampingScale ?? 1,
          quantumMaterialReactionBarrierGateProxy: result.diagnostics?.quantumMaterialReactionBarrierGateProxy ?? 0,
          quantumMaterialReactionBarrierUnsupportedProductBlockerCount: result.diagnostics?.quantumMaterialReactionBarrierUnsupportedProductBlockerCount ?? 0,
          reactionBarrierGatedCandidateCount: result.diagnostics?.reactionBarrierGatedCandidateCount ?? 0,
          reactionBarrierSuppressedCandidateCount: result.diagnostics?.reactionBarrierSuppressedCandidateCount ?? 0,
          reactionBarrierMeanDamping: result.diagnostics?.reactionBarrierMeanDamping ?? 1,
          ionicBondCount: result.diagnostics?.ionicBondCount ?? 0,
          covalentBondCount: result.diagnostics?.covalentBondCount ?? 0,
          polarBondFraction: result.diagnostics?.polarBondFraction ?? 0,
          valenceSaturation: result.diagnostics?.valenceSaturation ?? 0,
          quantumCouplingApplied: result.diagnostics?.quantumCouplingApplied === true,
          quantumCouplingApplication: result.diagnostics?.quantumCouplingApplication || null,
          quantumCouplingApplicationMode: result.diagnostics?.quantumCouplingApplicationMode || 'unavailable',
          quantumCouplingWebgpuKernelApplied: result.diagnostics?.quantumCouplingWebgpuKernelApplied === true,
          quantumCouplingTemperatureDeltaK: result.diagnostics?.quantumCouplingTemperatureDeltaK ?? 0,
          quantumCouplingTargetCharge: result.diagnostics?.quantumCouplingTargetCharge ?? 0,
          quantumCouplingChargeMix: result.diagnostics?.quantumCouplingChargeMix ?? 0,
          quantumCouplingElementSymbol: result.diagnostics?.quantumCouplingElementSymbol || null,
          quantumCouplingMatchedAtomCount: result.diagnostics?.quantumCouplingMatchedAtomCount ?? 0,
          quantumElectronegativityShift: result.diagnostics?.quantumElectronegativityShift ?? 0,
          quantumChargeBias: result.diagnostics?.quantumChargeBias ?? 0,
          quantumBondOrderScale: result.diagnostics?.quantumBondOrderScale ?? 1,
          quantumIonizationDrive: result.diagnostics?.quantumIonizationDrive ?? 0,
          quantumEvolutionDrive: result.diagnostics?.quantumEvolutionDrive ?? 0,
          quantumWavefunctionEvolutionSource: result.diagnostics?.quantumWavefunctionEvolutionSource || 'unavailable',
          quantumWavefunctionEvolutionBackend: result.diagnostics?.quantumWavefunctionEvolutionBackend || null,
          quantumWavefunctionEvolutionNormDrift: result.diagnostics?.quantumWavefunctionEvolutionNormDrift ?? 0,
          quantumWavefunctionEvolutionFieldEnergyExpectationEv: result.diagnostics?.quantumWavefunctionEvolutionFieldEnergyExpectationEv ?? 0,
          quantumWavefunctionEvolutionElectricFieldVm: result.diagnostics?.quantumWavefunctionEvolutionElectricFieldVm ?? 0,
          quantumWavefunctionEvolutionDipoleMomentZBohrElectron: result.diagnostics?.quantumWavefunctionEvolutionDipoleMomentZBohrElectron ?? 0,
          quantumWavefunctionEvolutionPolarizabilityProxyBohr3: result.diagnostics?.quantumWavefunctionEvolutionPolarizabilityProxyBohr3 ?? 0,
          quantumWavefunctionEvolutionFieldResponseSchema: result.diagnostics?.quantumWavefunctionEvolutionFieldResponseSchema || null,
          quantumWavefunctionEvolutionMagneticFieldT: result.diagnostics?.quantumWavefunctionEvolutionMagneticFieldT ?? 0,
          quantumWavefunctionEvolutionZeemanEnergyExpectationEv: result.diagnostics?.quantumWavefunctionEvolutionZeemanEnergyExpectationEv ?? 0,
          quantumWavefunctionEvolutionMagneticMomentProjectionBohrMagneton: result.diagnostics?.quantumWavefunctionEvolutionMagneticMomentProjectionBohrMagneton ?? 0,
          quantumWavefunctionEvolutionMagneticResponseSchema: result.diagnostics?.quantumWavefunctionEvolutionMagneticResponseSchema || null,
          quantumWavefunctionEvolutionWebgpuParityOk: result.diagnostics?.quantumWavefunctionEvolutionWebgpuParityOk ?? null,
          quantumWavefunctionEvolutionWebgpuExecuted: result.diagnostics?.quantumWavefunctionEvolutionWebgpuExecuted === true,
          quantumWavefunctionEvolutionLiveBackendPolicy: result.diagnostics?.quantumWavefunctionEvolutionLiveBackendPolicy || null,
          quantumRadialEigenstateSchema: result.diagnostics?.quantumRadialEigenstateSchema || null,
          quantumRadialEigenstateSource: result.diagnostics?.quantumRadialEigenstateSource || 'unavailable',
          quantumRadialEigenstateResidualRelativeL2: result.diagnostics?.quantumRadialEigenstateResidualRelativeL2 ?? 0,
          quantumRadialEigenstateWebgpuExecuted: result.diagnostics?.quantumRadialEigenstateWebgpuExecuted === true,
          quantumCouplingConfidence: result.diagnostics?.quantumCouplingConfidence ?? 0,
          quantumMaterialSource: result.diagnostics?.quantumMaterialSource || null,
          quantumMaterialSourceApplied: result.diagnostics?.quantumMaterialSourceApplied === true,
          quantumMaterialSourceMode: result.diagnostics?.quantumMaterialSourceMode || 'unavailable',
          quantumMaterialSourceWebgpuKernelApplied: result.diagnostics?.quantumMaterialSourceWebgpuKernelApplied === true,
          quantumMaterialSourceBackend: result.diagnostics?.quantumMaterialSourceBackend || 'unavailable',
          quantumMaterialSourceLiveBackendPolicy: result.diagnostics?.quantumMaterialSourceLiveBackendPolicy || null,
          quantumMaterialSourceMaterialId: result.diagnostics?.quantumMaterialSourceMaterialId || null,
          quantumMaterialSourceElementSymbol: result.diagnostics?.quantumMaterialSourceElementSymbol || null,
          quantumMaterialSourceDominantFormula: result.diagnostics?.quantumMaterialSourceDominantFormula || null,
          quantumMaterialSourceRecordCount: result.diagnostics?.quantumMaterialSourceRecordCount ?? 0,
          quantumMaterialSourceReducedEnergyGradientAvailable: result.diagnostics?.quantumMaterialSourceReducedEnergyGradientAvailable === true,
          quantumMaterialSourceMeanForceGradientEvPerAngstrom: result.diagnostics?.quantumMaterialSourceMeanForceGradientEvPerAngstrom ?? 0,
          quantumMaterialSourceBondOrderScale: result.diagnostics?.quantumMaterialSourceBondOrderScale ?? 1,
          quantumMaterialSourcePairForceScale: result.diagnostics?.quantumMaterialSourcePairForceScale ?? 1,
          quantumMaterialSourceRestLengthDeltaAngstrom: result.diagnostics?.quantumMaterialSourceRestLengthDeltaAngstrom ?? 0,
          quantumMaterialSourcePairForceMix: result.diagnostics?.quantumMaterialSourcePairForceMix ?? 0,
          quantumMaterialSourceTargetPairLabel: result.diagnostics?.quantumMaterialSourceTargetPairLabel || 'all-pairs',
          quantumMaterialSourcePrimaryElementZ: result.diagnostics?.quantumMaterialSourcePrimaryElementZ ?? 0,
          quantumMaterialSourceSecondaryElementZ: result.diagnostics?.quantumMaterialSourceSecondaryElementZ ?? 0,
          quantumMaterialSourcePairSelectivity: result.diagnostics?.quantumMaterialSourcePairSelectivity ?? 0,
          quantumMaterialSourcePairFallbackFactor: result.diagnostics?.quantumMaterialSourcePairFallbackFactor ?? 1,
          quantumMaterialSourceTargetAtomCount: result.diagnostics?.quantumMaterialSourceTargetAtomCount ?? 0,
          quantumMaterialSourceTargetFallbackAtomCount: result.diagnostics?.quantumMaterialSourceTargetFallbackAtomCount ?? 0,
          quantumMaterialSourceTargetAtomWeightedFactorSum: result.diagnostics?.quantumMaterialSourceTargetAtomWeightedFactorSum ?? 0,
          quantumMaterialSourceTargetAtomMeanFactor: result.diagnostics?.quantumMaterialSourceTargetAtomMeanFactor ?? 0,
          quantumMaterialSourceTargetPairCandidateCount: result.diagnostics?.quantumMaterialSourceTargetPairCandidateCount ?? 0,
          quantumMaterialSourceTargetPairSelectedCount: result.diagnostics?.quantumMaterialSourceTargetPairSelectedCount ?? 0,
          quantumMaterialSourceTargetPairFallbackCount: result.diagnostics?.quantumMaterialSourceTargetPairFallbackCount ?? 0,
          quantumMaterialSourceTargetPairMeanFactor: result.diagnostics?.quantumMaterialSourceTargetPairMeanFactor ?? 0,
          quantumMaterialSourceTemperatureDeltaK: result.diagnostics?.quantumMaterialSourceTemperatureDeltaK ?? 0,
          quantumMaterialSourceChargeDeltaProxy: result.diagnostics?.quantumMaterialSourceChargeDeltaProxy ?? 0,
          quantumMaterialSourceIonizationDrive: result.diagnostics?.quantumMaterialSourceIonizationDrive ?? 0,
          quantumMaterialSourceForceGradientDrive: result.diagnostics?.quantumMaterialSourceForceGradientDrive ?? 0,
          quantumMaterialSourceBehaviorDrive: result.diagnostics?.quantumMaterialSourceBehaviorDrive ?? 0,
          quantumMaterialSourceIonizationFraction: result.diagnostics?.quantumMaterialSourceIonizationFraction ?? 0,
          quantumMaterialSourceEnsemblePressurePa: result.diagnostics?.quantumMaterialSourceEnsemblePressurePa ?? 0,
          quantumMaterialSourceEnsemblePressureRatio: result.diagnostics?.quantumMaterialSourceEnsemblePressureRatio ?? 1,
          quantumMaterialSourceEnsemblePressureDrive: result.diagnostics?.quantumMaterialSourceEnsemblePressureDrive ?? 0,
          quantumMaterialSourceHeatCapacityProxy: result.diagnostics?.quantumMaterialSourceHeatCapacityProxy ?? 0,
          quantumMaterialSourceThermalDampingScale: result.diagnostics?.quantumMaterialSourceThermalDampingScale ?? 1,
          quantumMaterialSourceElectricalConductivitySpm: result.diagnostics?.quantumMaterialSourceElectricalConductivitySpm ?? 0,
          quantumMaterialSourceDielectricConstant: result.diagnostics?.quantumMaterialSourceDielectricConstant ?? 1,
          quantumMaterialSourceRefractiveIndex: result.diagnostics?.quantumMaterialSourceRefractiveIndex ?? 1,
          quantumMaterialSourceMechanicalResponsePa: result.diagnostics?.quantumMaterialSourceMechanicalResponsePa ?? 0,
          quantumMaterialSourceBulkModulusPa: result.diagnostics?.quantumMaterialSourceBulkModulusPa ?? 0,
          quantumMaterialSourceYoungsModulusPa: result.diagnostics?.quantumMaterialSourceYoungsModulusPa ?? 0,
          quantumMaterialSourceConductivityDrive: result.diagnostics?.quantumMaterialSourceConductivityDrive ?? 0,
          quantumMaterialSourceDielectricDrive: result.diagnostics?.quantumMaterialSourceDielectricDrive ?? 0,
          quantumMaterialSourceMechanicalStiffnessDrive: result.diagnostics?.quantumMaterialSourceMechanicalStiffnessDrive ?? 0,
          quantumMaterialSourceOpticalAbsorptionDrive: result.diagnostics?.quantumMaterialSourceOpticalAbsorptionDrive ?? 0,
          ulgStateDeltaApplied: result.diagnostics?.ulgStateDeltaApplied === true,
          ulgStateDeltaAppliedChannelCount: result.diagnostics?.ulgStateDeltaAppliedChannelCount ?? 0,
          ulgStateDeltaTemperatureDeltaK: result.diagnostics?.ulgStateDeltaTemperatureDeltaK ?? 0,
          ulgStateDeltaChargeDeltaProxy: result.diagnostics?.ulgStateDeltaChargeDeltaProxy ?? 0,
          ulgStateDeltaVelocityDeltaProxy: result.diagnostics?.ulgStateDeltaVelocityDeltaProxy ?? 0,
          ulgStateDeltaHash: result.diagnostics?.ulgStateDeltaHash || null,
          ulgStateDeltaApplicationMode: result.diagnostics?.ulgStateDeltaApplicationMode || 'unavailable',
          ulgStateDeltaWebgpuKernelApplied: result.diagnostics?.ulgStateDeltaWebgpuKernelApplied === true,
          ulgStateDeltaSource: result.diagnostics?.ulgStateDeltaSource || null,
          neighborCandidatePairCount: result.diagnostics?.neighborCandidatePairCount ?? 0,
          bondCandidateCount: result.diagnostics?.bondCandidateCount ?? 0,
          spatialCellCount: result.diagnostics?.spatialCellCount ?? 0,
          pairSearchMode: result.diagnostics?.pairSearchMode || 'unknown',
          energyDelta: result.conservation?.energyDelta ?? 0,
          chargeDrift: result.conservation?.chargeDrift ?? 0,
          bondCountDelta: result.conservation?.bondCountDelta ?? 0,
          reactionEventCount: result.diagnostics?.reactionEventCount ?? 0,
          formedBondCount: result.diagnostics?.formedBondCount ?? 0,
          brokenBondCount: result.diagnostics?.brokenBondCount ?? 0,
          reactionEventLedger: result.diagnostics?.reactionEventLedger || null,
          reactionSource: result.diagnostics?.reactionSource || null,
          reactionHeatSourceProxy: result.diagnostics?.reactionHeatSourceProxy ?? 0,
          reactionSpeciesRateProxy: result.diagnostics?.reactionSpeciesRateProxy ?? 0,
          conservation: result.conservation,
          webgpuStatus: result.webgpuStatus,
          webgpuError: result.webgpuError
        }
        : null;
    })
    .catch((error) => {
      molecularDynamicsSolverFailed += 1;
      molecularDynamicsSolverLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      molecularDynamicsSolverPending = false;
      updateSolverRuntimeStatus();
    });
}

function getQuantumOrbitalGridInputKey() {
  const orbital = model.state.orbital || {};
  const elementSymbol = orbital.elementSymbol || 'O';
  const principalN = Math.round(Number(orbital.principalN || 2));
  const angularL = Math.round(Number(orbital.angularL || 1));
  const magneticM = Math.round(Number(orbital.magneticM || 0));
  const finiteGridSize = Math.round(Number(orbital.finiteGridSize || 18));
  const relativisticSpinOrbit = Number(orbital.atomicNumber || 0) >= 30;
  const correlationMixing = Number(orbital.atomicNumber || 0) >= 6;
  const environment = model.environment || {};
  return [
    elementSymbol,
    principalN,
    angularL,
    magneticM,
    finiteGridSize,
    true,
    relativisticSpinOrbit,
    correlationMixing,
    Math.round(Number(environment.electricFieldVm || environment.electricFieldVpm || 0) / 1000),
    Math.round(Number(environment.magneticFieldT || 0) * 1000)
  ].join(':');
}

function getQuantumMaterialPotentialInputKey() {
  const orbital = model.state.orbital || {};
  const molecular = model.state.molecular.molecularDynamics || {};
  const environment = model.environment || {};
  const species = molecular.species || {};
  const molecules = molecular.molecularSpecies || {};
  return [
    orbital.elementSymbol || 'O',
    orbital.activeOrbitalLabel || `${orbital.principalN || 2}${['s', 'p', 'd', 'f'][orbital.angularL || 1] || 'p'}`,
    Math.round(Number(environment.ambientTemperatureK || 293.15)),
    Math.round(Number(environment.ambientPressurePa || 101325) / 100),
    Math.round(Number(environment.gravityMps2 || 9.81) * 10),
    Math.round(Number(environment.electricFieldVm || environment.electricFieldVpm || 0) / 1000),
    Math.round(Number(environment.magneticFieldT || 0) * 1000),
    Math.round(Number(environment.radiativeHeatFlux || 0)),
    Math.round(Number(molecular.atomCount || 0)),
    Math.round(Number(molecular.meanTemperatureK || 0)),
    Object.entries(species).sort().map(([key, value]) => `${key}${Math.round(Number(value) || 0)}`).join(','),
    Object.entries(molecules).sort().map(([key, value]) => `${key}${Math.round(Number(value) || 0)}`).join(','),
    solverBudget.quantumMaterialPotential?.sampleCount || 0
  ].join(':');
}

function stepQuantumOrbitalGridWorker() {
  if (!stateManager.isInitialized || quantumOrbitalGridPending) return;
  const inputKey = getQuantumOrbitalGridInputKey();
  if (quantumOrbitalGridLastInputKey === inputKey && quantumOrbitalGridLastResult) return;
  quantumOrbitalGridPending = true;
  quantumOrbitalGridSubmitted += 1;
  updateSolverRuntimeStatus();

  const orbital = model.state.orbital || {};
  computeManager.submitSolverTask(QUANTUM_ORBITAL_GRID_SOLVER_ID, {
    id: `${QUANTUM_ORBITAL_GRID_TASK_ID}:step:${quantumOrbitalGridSubmitted}`,
    stateKey: QUANTUM_ORBITAL_GRID_STATE_KEY,
    placementHint: getSolverPlacementHint('quantumOrbitalGrid'),
    input: {
      taskId: QUANTUM_ORBITAL_GRID_TASK_ID,
      stateKey: QUANTUM_ORBITAL_GRID_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      elementSymbol: orbital.elementSymbol || 'O',
      principalN: orbital.principalN || 2,
      angularL: orbital.angularL || 1,
      magneticM: orbital.magneticM || 0,
      finiteGridSize: orbital.finiteGridSize || solverBudget.quantumOrbitalGrid?.gridSize || 18,
      environment: model.environment,
      electricFieldVm: model.environment.electricFieldVm || 0,
      magneticFieldT: model.environment.magneticFieldT || 0,
      options: {
        screeningExchange: true,
        relativisticSpinOrbit: Number(orbital.atomicNumber || 0) >= 30,
        correlationMixing: Number(orbital.atomicNumber || 0) >= 6,
        electricFieldVm: model.environment.electricFieldVm || 0,
        magneticFieldT: model.environment.magneticFieldT || 0
      }
    }
  })
    .then((result) => {
      quantumOrbitalGridCompleted += 1;
      quantumOrbitalGridLastError = null;
      quantumOrbitalGridLastInputKey = inputKey;
      model.applyQuantumOrbitalGridResult(result);
      publishClosureDelta('closure:quantum-orbital', model.state.closures.quantumOrbital);
      updateQuantumOrbitalControls();
      quantumOrbitalGridLastResult = result
        ? {
          schema: result.schema || QUANTUM_ORBITAL_GRID_RESULT_SCHEMA,
          executionContext: result.executionContext,
          ok: result.ok,
          status: result.status,
          backend: result.backend,
          liveBackendPolicy: result.liveBackendPolicy || QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          inputKey: result.inputKey || inputKey,
          parameters: result.parameters || null,
          finiteGrid: result.finiteGrid || null,
          elementSymbol: result.parameters?.elementSymbol || orbital.elementSymbol || 'O',
          activeOrbital: `${result.parameters?.principalN || orbital.principalN || 2}${['s', 'p', 'd', 'f', 'g'][result.parameters?.angularL ?? orbital.angularL ?? 1] || 'p'}`,
          gridSize: result.finiteGrid?.gridSize ?? orbital.finiteGridSize ?? 0,
          sampleCount: result.finiteGrid?.sampleCount ?? 0,
          probabilityMass: result.finiteGrid?.probabilityMass ?? result.diagnostics?.probabilityMass ?? 0,
          normalizationError: result.finiteGrid?.normalizationError ?? result.diagnostics?.normalizationError ?? 0,
          boundaryMass: result.finiteGrid?.boundaryMass ?? result.diagnostics?.boundaryMass ?? 0,
          meanRadiusBohr: result.finiteGrid?.meanRadiusBohr ?? result.diagnostics?.meanRadiusBohr ?? 0,
          rmsRadiusBohr: result.finiteGrid?.rmsRadiusBohr ?? result.diagnostics?.rmsRadiusBohr ?? 0,
          reductionMode: result.finiteGrid?.reductionMode || result.diagnostics?.reductionMode || 'unknown',
          parity: result.finiteGrid?.parity || result.diagnostics?.parity || null,
          webgpuStatus: result.webgpuStatus || result.finiteGrid?.webgpuStatus || null,
          webgpuError: result.webgpuError || result.finiteGrid?.webgpuError || null
        }
        : null;
    })
    .catch((error) => {
      quantumOrbitalGridFailed += 1;
      quantumOrbitalGridLastInputKey = inputKey;
      quantumOrbitalGridLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      quantumOrbitalGridPending = false;
      updateSolverRuntimeStatus();
      renderReadout();
    });
}

function stepQuantumMaterialPotentialWorker() {
  if (!stateManager.isInitialized || quantumMaterialPotentialPending) return;
  const inputKey = getQuantumMaterialPotentialInputKey();
  if (quantumMaterialPotentialLastInputKey === inputKey && quantumMaterialPotentialLastResult) return;
  quantumMaterialPotentialPending = true;
  quantumMaterialPotentialSubmitted += 1;
  updateSolverRuntimeStatus();

  computeManager.submitSolverTask(QUANTUM_MATERIAL_POTENTIAL_SOLVER_ID, {
    id: `${QUANTUM_MATERIAL_POTENTIAL_TASK_ID}:step:${quantumMaterialPotentialSubmitted}`,
    stateKey: QUANTUM_MATERIAL_POTENTIAL_STATE_KEY,
    placementHint: getSolverPlacementHint('quantumMaterialPotential'),
    input: {
      taskId: QUANTUM_MATERIAL_POTENTIAL_TASK_ID,
      stateKey: QUANTUM_MATERIAL_POTENTIAL_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      sampleCount: solverBudget.quantumMaterialPotential?.sampleCount || 128,
      timeSeconds: model.time,
      environment: model.environment,
      quantumOrbital: model.state.orbital,
      molecularDynamics: model.state.molecular.molecularDynamics
    }
  })
    .then((result) => {
      quantumMaterialPotentialCompleted += 1;
      quantumMaterialPotentialLastError = null;
      quantumMaterialPotentialLastInputKey = inputKey;
      model.applyQuantumMaterialPotentialResult(result);
      publishClosureDelta('closure:quantum-material-potential', model.state.closures.quantumMaterialPotential);
      quantumMaterialPotentialLastResult = result
        ? {
          schema: result.schema || QUANTUM_MATERIAL_POTENTIAL_RESULT_SCHEMA,
          ok: result.ok === true,
          status: result.status || 'unknown',
          executionContext: result.executionContext,
          backend: result.backend,
          liveBackendPolicy: result.liveBackendPolicy || null,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          inputKey,
          materialId: result.potential?.materialId || result.diagnostics?.materialId || null,
          elementSymbol: result.potential?.elementSymbol || result.diagnostics?.elementSymbol || null,
          dominantFormula: result.potential?.dominantFormula || result.diagnostics?.dominantFormula || null,
          batch: result.batch || result.diagnostics?.batch || null,
          recordCount: result.batch?.recordCount ?? result.diagnostics?.batch?.recordCount ?? 0,
          meanBehaviorDrive: result.batch?.meanBehaviorDrive ?? result.diagnostics?.batch?.meanBehaviorDrive ?? 0,
          workgroupSize: result.batch?.workgroupSize ?? 0,
          workgroupCount: result.batch?.workgroupCount ?? 0,
          concurrencyMode: result.batch?.concurrency?.mode || 'unknown',
          webgpuStatus: result.webgpuStatus || result.batch?.webgpuStatus || null,
          webgpuError: result.webgpuError || result.batch?.webgpuError || null
        }
        : null;
    })
    .catch((error) => {
      quantumMaterialPotentialFailed += 1;
      quantumMaterialPotentialLastInputKey = inputKey;
      quantumMaterialPotentialLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      quantumMaterialPotentialPending = false;
      updateSolverRuntimeStatus();
      renderReadout();
    });
}

function getUlgRuntimeExecutionInputKey(manifest = model.state.ulgRuntime) {
  if (!manifest) return 'ulg-runtime:none';
  const passDag = manifest.passDag || {};
  const closureHashes = Array.isArray(manifest.materialClosures)
    ? manifest.materialClosures.map((closure) => closure?.closureHash || 'none').join(',')
    : 'none';
  const passHashes = Array.isArray(passDag.passes)
    ? passDag.passes.map((pass) => pass?.passHash || pass?.id || 'none').join(',')
    : (Array.isArray(passDag.passIds) ? passDag.passIds.join(',') : 'none');
  return [
    manifest.schema || 'unknown',
    manifest.modelId || 'unknown',
    manifest.activeLayerId || model.activeLayer?.id || 'unknown',
    manifest.status || 'unknown',
    manifest.liveBackendPolicy || 'unknown',
    manifest.hamiltonian?.hamiltonianHash || 'none',
    closureHashes,
    passDag.status || 'unknown',
    passDag.passCount || 0,
    passDag.webgpuPassCount || 0,
    passDag.invalidLivePassCount || 0,
    passHashes
  ].join(':');
}

function compactUlgRuntimeExecutionResult(result, inputKey) {
  if (!result) return null;
  return {
    schema: result.schema || 'peercompute.ulg.webgpu-execution-result.v0',
    executionContext: result.executionContext || null,
    ok: result.ok === true,
    status: result.status || 'unknown',
    backend: result.backend || 'unknown',
    sequence: result.sequence || 0,
    inputKey,
    stateKey: result.stateKey || ULG_RUNTIME_STATE_KEY,
    liveBackendPolicy: result.liveBackendPolicy || 'webgpu-only-no-cpu-fallback',
    manifestHash: result.manifestHash || null,
    activeLayerId: result.activeLayerId || null,
    timeSeconds: result.timeSeconds ?? null,
    passDagStatus: result.passDagStatus || null,
    passCount: result.passCount ?? 0,
    executedPassCount: result.executedPassCount ?? 0,
    invalidLivePassCount: result.invalidLivePassCount ?? 0,
    totalWorkItems: result.totalWorkItems ?? 0,
    weightedEvidence: result.weightedEvidence ?? 0,
    evidenceHash: result.evidenceHash || null,
    passEvidencePreview: Array.isArray(result.passEvidencePreview)
      ? result.passEvidencePreview.slice(0, 5)
      : [],
    stateDelta: result.stateDelta ? {
      schema: result.stateDelta.schema || 'peercompute.ulg.webgpu-state-delta.v0',
      status: result.stateDelta.status || 'unknown',
      ok: result.stateDelta.ok === true,
      mutationMode: result.stateDelta.mutationMode || null,
      proxyStateReady: result.stateDelta.proxyStateReady === true,
      proxyStateApplied: result.stateDelta.proxyStateApplied === true,
      authoritativeWorkerBufferMutation: result.stateDelta.authoritativeWorkerBufferMutation === true,
      scientificMutationReady: result.stateDelta.scientificMutationReady === true,
      readiness: result.stateDelta.readiness ?? 0,
      executedFraction: result.stateDelta.executedFraction ?? 0,
      channelUpdateCount: result.stateDelta.channelUpdateCount ?? 0,
      appliedChannelUpdateCount: result.stateDelta.appliedChannelUpdateCount ?? 0,
      residuals: result.stateDelta.residuals || null,
      materialResponse: result.stateDelta.materialResponse || null,
      stateDeltaHash: result.stateDelta.stateDeltaHash || null,
      blocker: result.stateDelta.blocker || null,
      channelUpdates: Array.isArray(result.stateDelta.channelUpdates)
        ? result.stateDelta.channelUpdates.slice(0, 6)
        : []
    } : null,
    webgpuStatus: result.webgpuStatus || null,
    webgpuError: result.webgpuError || null
  };
}

function stepUlgRuntimeWorker() {
  if (!stateManager.isInitialized || ulgRuntimePending) return;
  const manifest = model.state.ulgRuntime || createModelPacketWithRuntimeEvidence().ulgRuntime;
  if (!manifest?.schema) return;
  const inputKey = getUlgRuntimeExecutionInputKey(manifest);
  if (ulgRuntimeLastInputKey === inputKey && ulgRuntimeLastResult) return;
  ulgRuntimePending = true;
  ulgRuntimeSubmitted += 1;
  updateSolverRuntimeStatus();

  computeManager.submitSolverTask(ULG_RUNTIME_SOLVER_ID, {
    id: `${ULG_RUNTIME_TASK_ID}:step:${ulgRuntimeSubmitted}`,
    stateKey: ULG_RUNTIME_STATE_KEY,
    placementHint: getSolverPlacementHint('ulgRuntime'),
    input: {
      taskId: ULG_RUNTIME_TASK_ID,
      stateKey: ULG_RUNTIME_STATE_KEY,
      scope: ULG_RUNTIME_EXECUTION_DELTA_SCOPE,
      emitCommitDelta: true,
      sequence: ulgRuntimeSubmitted,
      timeSeconds: model.time,
      manifest
    }
  })
    .then((result) => {
      ulgRuntimeCompleted += 1;
      ulgRuntimeLastError = null;
      ulgRuntimeLastInputKey = inputKey;
      model.applyUlgRuntimeExecutionResult(result);
      ulgRuntimeLastResult = compactUlgRuntimeExecutionResult(result, inputKey);
    })
    .catch((error) => {
      ulgRuntimeFailed += 1;
      ulgRuntimeLastInputKey = inputKey;
      ulgRuntimeLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      ulgRuntimePending = false;
      updateSolverRuntimeStatus();
      renderReadout();
    });
}

function stepHydroAtmosphereWorker() {
  if (!stateManager.isInitialized || hydroAtmosphereSolverPending) return;
  hydroAtmosphereSolverPending = true;
  hydroAtmosphereSolverSubmitted += 1;
  updateSolverRuntimeStatus();

  const firstStep = hydroAtmosphereSolverCompleted === 0 && hydroAtmosphereSolverFailed === 0;
  computeManager.submitSolverTask(HYDRO_ATMOSPHERE_SOLVER_ID, {
    id: `${HYDRO_ATMOSPHERE_TASK_ID}:step:${hydroAtmosphereSolverSubmitted}`,
    stateKey: HYDRO_ATMOSPHERE_STATE_KEY,
    placementHint: getSolverPlacementHint('hydroAtmosphere'),
    input: {
      taskId: HYDRO_ATMOSPHERE_TASK_ID,
      stateKey: HYDRO_ATMOSPHERE_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      dt: 0.035,
      damping: 0.992,
      environment: model.environment,
      coupling: {
        oceanHeat: model.state.planet.oceanHeat,
        cloudCover: model.state.planet.cloudCover,
        precipitation: model.state.planet.precipitation
      },
      state: firstStep ? hydroAtmosphereSolverState : undefined
    }
  })
    .then((result) => {
      hydroAtmosphereSolverCompleted += 1;
      hydroAtmosphereSolverLastError = null;
      if (result?.state) {
        hydroAtmosphereSolverState = result.state;
      }
      model.applyHydroAtmosphereResult(result);
      if (result) {
        scene.applyHydroAtmosphereState(result);
      }
      hydroAtmosphereSolverLastResult = result
        ? {
          schema: result.schema,
          executionContext: result.executionContext,
          backend: result.backend,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          width: result.diagnostics?.width ?? result.state?.width ?? 0,
          height: result.diagnostics?.height ?? result.state?.height ?? 0,
          cellCount: result.diagnostics?.cellCount ?? 0,
          cloudCover: result.diagnostics?.cloudCover ?? 0,
          precipitationMean: result.diagnostics?.precipitationMean ?? 0,
          maxWindMps: result.diagnostics?.maxWindMps ?? 0,
          stormEnergy: result.diagnostics?.stormEnergy ?? 0,
          conservation: result.conservation,
          webgpuStatus: result.webgpuStatus
        }
        : null;
    })
    .catch((error) => {
      hydroAtmosphereSolverFailed += 1;
      hydroAtmosphereSolverLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      hydroAtmosphereSolverPending = false;
      updateSolverRuntimeStatus();
    });
}

function stepRadiationOpacityWorker() {
  if (!stateManager.isInitialized || radiationOpacitySolverPending) return;
  radiationOpacitySolverPending = true;
  radiationOpacitySolverSubmitted += 1;
  updateSolverRuntimeStatus();

  const firstStep = radiationOpacitySolverCompleted === 0 && radiationOpacitySolverFailed === 0;
  computeManager.submitSolverTask(RADIATION_OPACITY_SOLVER_ID, {
    id: `${RADIATION_OPACITY_TASK_ID}:step:${radiationOpacitySolverSubmitted}`,
    stateKey: RADIATION_OPACITY_STATE_KEY,
    placementHint: getSolverPlacementHint('radiationOpacity'),
    input: {
      taskId: RADIATION_OPACITY_TASK_ID,
      stateKey: RADIATION_OPACITY_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      dt: 1 / 45,
      environment: {
        ...model.environment,
        stellarFlux: model.environment.stellarFlux * model.state.solar.stellarFusion.luminosityFactor
      },
      coupling: {
        fireIntensity: model.state.surface.fireIntensity,
        cloudCover: model.state.planet.cloudCover,
        smokeFraction: model.state.surface.smokeFraction,
        oceanHeat: model.state.planet.oceanHeat,
        stellarLuminosityFactor: model.state.solar.stellarFusion.luminosityFactor,
        stellarFusionPower: model.state.solar.stellarFusion.fusionPowerProxy
      },
      state: firstStep ? radiationOpacitySolverState : undefined
    }
  })
    .then((result) => {
      radiationOpacitySolverCompleted += 1;
      radiationOpacitySolverLastError = null;
      if (result?.state) {
        radiationOpacitySolverState = result.state;
      }
      model.applyRadiationOpacityResult(result);
      if (result) {
        scene.applyRadiationOpacityState(result);
      }
      radiationOpacitySolverLastResult = result
        ? {
          schema: result.schema,
          executionContext: result.executionContext,
          backend: result.backend,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          width: result.diagnostics?.width ?? result.state?.width ?? 0,
          height: result.diagnostics?.height ?? result.state?.height ?? 0,
          cellCount: result.diagnostics?.cellCount ?? 0,
          opticalDepth: result.diagnostics?.opticalDepth ?? 0,
          greenhouseFactor: result.diagnostics?.greenhouseFactor ?? 0,
          meanTemperatureK: result.diagnostics?.meanTemperatureK ?? 0,
          surfaceRadiativeHeatFlux: model.state.surface.radiativeHeatFlux,
          netHeatingPower: (result.diagnostics?.totalAbsorbedPower ?? 0) - (result.diagnostics?.totalEmittedPower ?? 0),
          conservation: result.conservation,
          webgpuStatus: result.webgpuStatus
        }
        : null;
    })
    .catch((error) => {
      radiationOpacitySolverFailed += 1;
      radiationOpacitySolverLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      radiationOpacitySolverPending = false;
      updateSolverRuntimeStatus();
    });
}

function stepStellarFusionWorker() {
  if (!stateManager.isInitialized || stellarFusionSolverPending) return;
  stellarFusionSolverPending = true;
  stellarFusionSolverSubmitted += 1;
  updateSolverRuntimeStatus();

  const firstStep = stellarFusionSolverCompleted === 0 && stellarFusionSolverFailed === 0;
  computeManager.submitSolverTask(STELLAR_FUSION_SOLVER_ID, {
    id: `${STELLAR_FUSION_TASK_ID}:step:${stellarFusionSolverSubmitted}`,
    stateKey: STELLAR_FUSION_STATE_KEY,
    placementHint: getSolverPlacementHint('stellarFusion'),
    input: {
      taskId: STELLAR_FUSION_TASK_ID,
      stateKey: STELLAR_FUSION_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      dt: 1 / 90,
      environment: model.environment,
      coupling: {
        metallicity: model.state.galaxy.metallicity,
        radiationPressure: model.state.solar.radiationPressure,
        opacity: model.state.solar.radiationOpacity.meanOpacity,
        densityCompression: clampNumber(model.state.solar.nbody.bodyCount / 32, 0.15, 1.6),
        coreTemperatureBias: clampNumber(model.environment.stellarFlux, 0.4, 1.8),
        magneticActivity: clampNumber(model.state.galaxy.maxwell.fieldEnergy, 0, 3)
      },
      state: firstStep ? stellarFusionSolverState : undefined
    }
  })
    .then((result) => {
      stellarFusionSolverCompleted += 1;
      stellarFusionSolverLastError = null;
      if (result?.state) {
        stellarFusionSolverState = result.state;
      }
      model.applyStellarFusionResult(result);
      if (result) {
        scene.applyStellarFusionState(result);
      }
      stellarFusionSolverLastResult = result
        ? {
          schema: result.schema,
          executionContext: result.executionContext,
          backend: result.backend,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          width: result.diagnostics?.width ?? result.state?.width ?? 0,
          height: result.diagnostics?.height ?? result.state?.height ?? 0,
          cellCount: result.diagnostics?.cellCount ?? 0,
          coreTemperatureK: result.diagnostics?.coreTemperatureK ?? 0,
          meanTemperatureK: result.diagnostics?.meanTemperatureK ?? 0,
          meanDensityKgM3: result.diagnostics?.meanDensityKgM3 ?? 0,
          meanHydrogenFraction: result.diagnostics?.meanHydrogenFraction ?? 0,
          meanHeliumFraction: result.diagnostics?.meanHeliumFraction ?? 0,
          fusionPowerProxy: result.diagnostics?.fusionPowerProxy ?? 0,
          luminosityProxy: result.diagnostics?.luminosityProxy ?? 0,
          luminosityFactor: model.state.solar.stellarFusion.luminosityFactor,
          neutrinoLossProxy: result.diagnostics?.neutrinoLossProxy ?? 0,
          conservation: result.conservation,
          webgpuStatus: result.webgpuStatus,
          webgpuError: result.webgpuError
        }
        : null;
    })
    .catch((error) => {
      stellarFusionSolverFailed += 1;
      stellarFusionSolverLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      stellarFusionSolverPending = false;
      updateSolverRuntimeStatus();
    });
}

function stepMagnetospherePlasmaWorker() {
  if (!stateManager.isInitialized || magnetospherePlasmaSolverPending) return;
  magnetospherePlasmaSolverPending = true;
  magnetospherePlasmaSolverSubmitted += 1;
  updateSolverRuntimeStatus();

  const firstStep = magnetospherePlasmaSolverCompleted === 0 && magnetospherePlasmaSolverFailed === 0;
  computeManager.submitSolverTask(MAGNETOSPHERE_PLASMA_SOLVER_ID, {
    id: `${MAGNETOSPHERE_PLASMA_TASK_ID}:step:${magnetospherePlasmaSolverSubmitted}`,
    stateKey: MAGNETOSPHERE_PLASMA_STATE_KEY,
    placementHint: getSolverPlacementHint('magnetospherePlasma'),
    input: {
      taskId: MAGNETOSPHERE_PLASMA_TASK_ID,
      stateKey: MAGNETOSPHERE_PLASMA_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      dt: 1 / 80,
      environment: model.environment,
      coupling: {
        stellarLuminosityFactor: model.state.solar.stellarFusion.luminosityFactor,
        stellarFusionPower: model.state.solar.stellarFusion.fusionPowerProxy,
        radiationPressure: model.state.solar.radiationPressure,
        maxwellFieldEnergy: model.state.galaxy.maxwell.fieldEnergy,
        poyntingFlux: model.state.galaxy.maxwell.poyntingFlux,
        magneticSeed: model.state.galaxy.gasTurbulence
      },
      state: firstStep ? magnetospherePlasmaSolverState : undefined
    }
  })
    .then((result) => {
      magnetospherePlasmaSolverCompleted += 1;
      magnetospherePlasmaSolverLastError = null;
      if (result?.state) {
        magnetospherePlasmaSolverState = result.state;
      }
      model.applyMagnetospherePlasmaResult(result);
      if (result) {
        scene.applyMagnetospherePlasmaState(result);
      }
      magnetospherePlasmaSolverLastResult = result
        ? {
          schema: result.schema,
          executionContext: result.executionContext,
          backend: result.backend,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          width: result.diagnostics?.width ?? result.state?.width ?? 0,
          height: result.diagnostics?.height ?? result.state?.height ?? 0,
          cellCount: result.diagnostics?.cellCount ?? 0,
          meanDensity: result.diagnostics?.meanDensity ?? 0,
          meanTemperatureK: result.diagnostics?.meanTemperatureK ?? 0,
          meanIonizationFraction: result.diagnostics?.meanIonizationFraction ?? 0,
          magneticEnergy: result.diagnostics?.magneticEnergy ?? 0,
          kineticEnergy: result.diagnostics?.kineticEnergy ?? 0,
          alfvenSpeed: result.diagnostics?.alfvenSpeed ?? 0,
          solarWindPressure: result.diagnostics?.solarWindPressure ?? 0,
          magnetopauseRadius: result.diagnostics?.magnetopauseRadius ?? 0,
          reconnectionRate: result.diagnostics?.reconnectionRate ?? 0,
          currentSheetIntensity: result.diagnostics?.currentSheetIntensity ?? 0,
          divergenceBProxy: result.diagnostics?.divergenceBProxy ?? 0,
          conservation: result.conservation,
          webgpuStatus: result.webgpuStatus,
          webgpuError: result.webgpuError
        }
        : null;
    })
    .catch((error) => {
      magnetospherePlasmaSolverFailed += 1;
      magnetospherePlasmaSolverLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      magnetospherePlasmaSolverPending = false;
      updateSolverRuntimeStatus();
    });
}

function stepPicPlasmaPatchWorker() {
  if (!stateManager.isInitialized || picPlasmaPatchSolverPending) return;
  picPlasmaPatchSolverPending = true;
  picPlasmaPatchSolverSubmitted += 1;
  updateSolverRuntimeStatus();

  const firstStep = picPlasmaPatchSolverCompleted === 0 && picPlasmaPatchSolverFailed === 0;
  computeManager.submitSolverTask(PIC_PLASMA_PATCH_SOLVER_ID, {
    id: `${PIC_PLASMA_PATCH_TASK_ID}:step:${picPlasmaPatchSolverSubmitted}`,
    stateKey: PIC_PLASMA_PATCH_STATE_KEY,
    placementHint: getSolverPlacementHint('picPlasmaPatch'),
    input: {
      taskId: PIC_PLASMA_PATCH_TASK_ID,
      stateKey: PIC_PLASMA_PATCH_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      dt: 1 / 140,
      environment: model.environment,
      coupling: {
        reconnectionRate: model.state.solar.magnetosphere.reconnectionRate,
        solarWindPressure: model.state.solar.magnetosphere.solarWindPressure,
        ionization: model.state.solar.magnetosphere.meanIonizationFraction,
        alfvenSpeed: model.state.solar.magnetosphere.alfvenSpeed,
        meanTemperatureK: model.state.solar.magnetosphere.meanTemperatureK,
        maxwellFieldEnergy: model.state.galaxy.maxwell.fieldEnergy,
        poyntingFlux: model.state.galaxy.maxwell.poyntingFlux
      },
      state: firstStep ? picPlasmaPatchSolverState : undefined
    }
  })
    .then((result) => {
      picPlasmaPatchSolverCompleted += 1;
      picPlasmaPatchSolverLastError = null;
      if (result?.state) {
        picPlasmaPatchSolverState = result.state;
      }
      model.applyPicPlasmaPatchResult(result);
      if (result) {
        scene.applyPicPlasmaPatchState(result);
      }
      picPlasmaPatchSolverLastResult = result
        ? {
          schema: result.schema,
          executionContext: result.executionContext,
          backend: result.backend,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          particleCount: result.diagnostics?.particleCount ?? result.state?.particleCount ?? 0,
          gridWidth: result.diagnostics?.gridWidth ?? result.state?.gridWidth ?? 0,
          gridHeight: result.diagnostics?.gridHeight ?? result.state?.gridHeight ?? 0,
          cellCount: result.diagnostics?.cellCount ?? 0,
          chargeImbalance: result.diagnostics?.chargeImbalance ?? 0,
          totalCharge: result.diagnostics?.totalCharge ?? 0,
          kineticEnergy: result.diagnostics?.kineticEnergy ?? 0,
          fieldEnergy: result.diagnostics?.fieldEnergy ?? 0,
          currentDensity: result.diagnostics?.currentDensity ?? 0,
          particleEscapeFraction: result.diagnostics?.particleEscapeFraction ?? 0,
          debyeLengthProxy: result.diagnostics?.debyeLengthProxy ?? 0,
          larmorRadiusProxy: result.diagnostics?.larmorRadiusProxy ?? 0,
          reconnectionHeating: result.diagnostics?.reconnectionHeating ?? 0,
          divergenceEProxy: result.diagnostics?.divergenceEProxy ?? 0,
          conservation: result.conservation,
          webgpuStatus: result.webgpuStatus,
          webgpuError: result.webgpuError
        }
        : null;
    })
    .catch((error) => {
      picPlasmaPatchSolverFailed += 1;
      picPlasmaPatchSolverLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      picPlasmaPatchSolverPending = false;
      updateSolverRuntimeStatus();
    });
}

function stepRelativisticCorrectionWorker() {
  if (!stateManager.isInitialized || relativisticCorrectionSolverPending) return;
  relativisticCorrectionSolverPending = true;
  relativisticCorrectionSolverSubmitted += 1;
  updateSolverRuntimeStatus();

  const firstStep = relativisticCorrectionSolverCompleted === 0 && relativisticCorrectionSolverFailed === 0;
  computeManager.submitSolverTask(RELATIVISTIC_CORRECTION_SOLVER_ID, {
    id: `${RELATIVISTIC_CORRECTION_TASK_ID}:step:${relativisticCorrectionSolverSubmitted}`,
    stateKey: RELATIVISTIC_CORRECTION_STATE_KEY,
    placementHint: getSolverPlacementHint('relativisticCorrection'),
    input: {
      taskId: RELATIVISTIC_CORRECTION_TASK_ID,
      stateKey: RELATIVISTIC_CORRECTION_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      dt: 1 / 120,
      environment: model.environment,
      coupling: {
        stellarLuminosityFactor: model.state.solar.stellarFusion.luminosityFactor,
        radiationPressure: model.state.solar.radiationPressure,
        centralMassSolar: Math.max(1, model.state.solar.nbody.bodyCount * 0.22),
        spin: clampNumber(model.state.galaxy.gasTurbulence * 1.4 - 0.2, -1, 1),
        solarWindPressure: model.state.solar.magnetosphere.solarWindPressure,
        alfvenSpeed: model.state.solar.magnetosphere.alfvenSpeed,
        maxwellFieldEnergy: model.state.galaxy.maxwell.fieldEnergy,
        poyntingFlux: model.state.galaxy.maxwell.poyntingFlux,
        picKineticEnergy: model.state.solar.picPlasmaPatch.kineticEnergy,
        picParticleEscapeFraction: model.state.solar.picPlasmaPatch.particleEscapeFraction
      },
      state: firstStep ? relativisticCorrectionSolverState : undefined
    }
  })
    .then((result) => {
      relativisticCorrectionSolverCompleted += 1;
      relativisticCorrectionSolverLastError = null;
      if (result?.state) {
        relativisticCorrectionSolverState = result.state;
      }
      model.applyRelativisticCorrectionResult(result);
      if (result) {
        scene.applyRelativisticCorrectionState(result);
      }
      relativisticCorrectionSolverLastResult = result
        ? {
          schema: result.schema,
          executionContext: result.executionContext,
          backend: result.backend,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          sampleCount: result.diagnostics?.sampleCount ?? result.state?.sampleCount ?? 0,
          meanSpeedFractionC: result.diagnostics?.meanSpeedFractionC ?? 0,
          maxSpeedFractionC: result.diagnostics?.maxSpeedFractionC ?? 0,
          meanLorentzFactor: result.diagnostics?.meanLorentzFactor ?? 1,
          maxLorentzFactor: result.diagnostics?.maxLorentzFactor ?? 1,
          meanTimeDilation: result.diagnostics?.meanTimeDilation ?? 1,
          gravitationalRedshiftProxy: result.diagnostics?.gravitationalRedshiftProxy ?? 0,
          perihelionPrecessionArcsecProxy: result.diagnostics?.perihelionPrecessionArcsecProxy ?? 0,
          frameDraggingProxy: result.diagnostics?.frameDraggingProxy ?? 0,
          lensingDeflectionArcsecProxy: result.diagnostics?.lensingDeflectionArcsecProxy ?? 0,
          shapiroDelayProxy: result.diagnostics?.shapiroDelayProxy ?? 0,
          relativisticEnergyProxy: result.diagnostics?.relativisticEnergyProxy ?? 0,
          conservation: result.conservation,
          webgpuStatus: result.webgpuStatus,
          webgpuError: result.webgpuError
        }
        : null;
    })
    .catch((error) => {
      relativisticCorrectionSolverFailed += 1;
      relativisticCorrectionSolverLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      relativisticCorrectionSolverPending = false;
      updateSolverRuntimeStatus();
    });
}

function stepCombustionPlumeWorker() {
  if (!stateManager.isInitialized || combustionPlumeSolverPending) return;
  combustionPlumeSolverPending = true;
  combustionPlumeSolverSubmitted += 1;
  updateSolverRuntimeStatus();

  const firstStep = combustionPlumeSolverCompleted === 0 && combustionPlumeSolverFailed === 0;
  const hydroWind = [
    (model.state.planet.hydroAtmosphere.maxWindMps || 0) * 0.02,
    0.2 + (model.state.planet.stormEnergy || 0) * 0.18
  ];
  computeManager.submitSolverTask(COMBUSTION_PLUME_SOLVER_ID, {
    id: `${COMBUSTION_PLUME_TASK_ID}:step:${combustionPlumeSolverSubmitted}`,
    stateKey: COMBUSTION_PLUME_STATE_KEY,
    placementHint: getSolverPlacementHint('combustionPlume'),
    input: {
      taskId: COMBUSTION_PLUME_TASK_ID,
      stateKey: COMBUSTION_PLUME_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      dt: 1 / 45,
      environment: model.environment,
      coupling: {
        fireIntensity: model.state.surface.fireIntensity,
        waterContact: model.state.surface.waterContact,
        coolingPotential: model.state.mpm.sphMaterial.coolingPotential,
        radiativeHeatFlux: model.state.surface.radiativeHeatFlux,
        wind: hydroWind
      },
      state: firstStep ? combustionPlumeSolverState : undefined
    }
  })
    .then((result) => {
      combustionPlumeSolverCompleted += 1;
      combustionPlumeSolverLastError = null;
      if (result?.state) {
        combustionPlumeSolverState = result.state;
      }
      model.applyCombustionPlumeResult(result);
      if (result) {
        scene.applyCombustionPlumeState(result);
      }
      combustionPlumeSolverLastResult = result
        ? {
          schema: result.schema,
          executionContext: result.executionContext,
          backend: result.backend,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          width: result.diagnostics?.width ?? result.state?.width ?? 0,
          height: result.diagnostics?.height ?? result.state?.height ?? 0,
          cellCount: result.diagnostics?.cellCount ?? 0,
          fireAreaFraction: result.diagnostics?.fireAreaFraction ?? 0,
          smokeColumn: result.diagnostics?.smokeColumn ?? 0,
          fuelRemaining: result.diagnostics?.fuelRemaining ?? 0,
          heatReleaseMean: result.diagnostics?.heatReleaseMean ?? 0,
          maxTemperatureK: result.diagnostics?.maxTemperatureK ?? 0,
          smokeCentroidX: result.diagnostics?.smokeCentroidX ?? 0,
          smokeCentroidY: result.diagnostics?.smokeCentroidY ?? 0,
          plumeRise: result.diagnostics?.plumeRise ?? 0,
          buoyancyFlux: result.diagnostics?.buoyancyFlux ?? 0,
          oxygenDepletion: result.diagnostics?.oxygenDepletion ?? 0,
          suppressionMean: result.diagnostics?.suppressionMean ?? 0,
          conservation: result.conservation,
          webgpuStatus: result.webgpuStatus,
          webgpuError: result.webgpuError
        }
        : null;
    })
    .catch((error) => {
      combustionPlumeSolverFailed += 1;
      combustionPlumeSolverLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      combustionPlumeSolverPending = false;
      updateSolverRuntimeStatus();
    });
}

function stepSphMaterialWorker() {
  if (!stateManager.isInitialized || sphMaterialSolverPending) return;
  sphMaterialSolverPending = true;
  sphMaterialSolverSubmitted += 1;
  updateSolverRuntimeStatus();

  const firstStep = sphMaterialSolverCompleted === 0 && sphMaterialSolverFailed === 0;
  computeManager.submitSolverTask(SPH_MATERIAL_SOLVER_ID, {
    id: `${SPH_MATERIAL_TASK_ID}:step:${sphMaterialSolverSubmitted}`,
    stateKey: SPH_MATERIAL_STATE_KEY,
    placementHint: getSolverPlacementHint('sphMaterial'),
    input: {
      taskId: SPH_MATERIAL_TASK_ID,
      stateKey: SPH_MATERIAL_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      dt: 1 / 120,
      smoothingRadius: 0.58,
      pressureScale: 10.5,
      viscosity: 1.35,
      thermalDiffusion: 0.18,
      environment: model.environment,
      coupling: {
        fireIntensity: model.state.surface.fireIntensity,
        flameTemperatureK: model.state.surface.flameTemperatureK,
        radiativeHeatFlux: model.state.surface.radiativeHeatFlux,
        membraneIntegrity: model.state.balloon.membraneIntegrity,
        ruptured: model.state.balloon.ruptured,
        waterContact: model.state.surface.waterContact,
        steamFraction: model.state.balloon.steamMassKg,
        spillImpulse: model.state.balloon.spillImpulse,
        ruptureAge: model.state.balloon.spillProgress,
        membraneRuptureRisk: model.state.balloon.membraneShell.ruptureRisk,
        molecularDynamicsClosure: model.state.closures.molecularDynamics,
        molecularTargetSourceIntake: model.getMolecularTargetSourceIntakeFor('sph-material'),
        molecularConservativeSourceBuffer: model.getMolecularConservativeSourceBufferFor('sph-material')
      },
      state: firstStep ? sphMaterialSolverState : undefined
    }
  })
    .then((result) => {
      sphMaterialSolverCompleted += 1;
      sphMaterialSolverLastError = null;
      if (result?.state) {
        sphMaterialSolverState = result.state;
      }
      model.applySphMaterialResult(result);
      publishClosureDelta('closure:sph-material', model.state.closures.sphMaterial);
      publishCurrentSourceBufferApplicationDelta();
      if (result) {
        scene.applySphMaterialState(result);
      }
      sphMaterialSolverLastResult = result
        ? {
          schema: result.schema,
          executionContext: result.executionContext,
          backend: result.backend,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          particleCount: result.diagnostics?.count ?? result.state?.masses?.length ?? 0,
          averageTemperatureK: result.diagnostics?.averageTemperatureK ?? 0,
          vaporFraction: result.diagnostics?.vaporFraction ?? 0,
          fireContactFraction: result.diagnostics?.fireContactFraction ?? 0,
          coolingPotential: result.diagnostics?.coolingPotential ?? 0,
          groundContactFraction: result.diagnostics?.groundContactFraction ?? 0,
          spillImpulse: result.diagnostics?.spillImpulse ?? 0,
          centerToFireDistance: result.diagnostics?.centerToFireDistance ?? 0,
          kineticEnergy: result.diagnostics?.kineticEnergy ?? 0,
          momentumDrift: result.conservation?.momentumDrift ?? 0,
          kineticEnergyDrift: result.conservation?.kineticEnergyDrift ?? 0,
          conservation: result.conservation,
          webgpuStatus: result.webgpuStatus,
          webgpuError: result.webgpuError
        }
        : null;
    })
    .catch((error) => {
      sphMaterialSolverFailed += 1;
      sphMaterialSolverLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      sphMaterialSolverPending = false;
      updateSolverRuntimeStatus();
    });
}

function stepMembraneShellWorker() {
  if (!stateManager.isInitialized || membraneShellSolverPending) return;
  membraneShellSolverPending = true;
  membraneShellSolverSubmitted += 1;
  updateSolverRuntimeStatus();

  const firstStep = membraneShellSolverCompleted === 0 && membraneShellSolverFailed === 0;
  computeManager.submitSolverTask(MEMBRANE_SHELL_SOLVER_ID, {
    id: `${MEMBRANE_SHELL_TASK_ID}:step:${membraneShellSolverSubmitted}`,
    stateKey: MEMBRANE_SHELL_STATE_KEY,
    placementHint: getSolverPlacementHint('membraneShell'),
    input: {
      taskId: MEMBRANE_SHELL_TASK_ID,
      stateKey: MEMBRANE_SHELL_STATE_KEY,
      scope: SOLVER_DELTA_SCOPE,
      emitCommitDelta: true,
      dt: 1 / 90,
      environment: model.environment,
      coupling: {
        internalPressurePa: model.state.balloon.internalPressurePa,
        waterTemperatureK: model.state.balloon.waterTemperatureK,
        waterMassKg: model.state.balloon.waterMassKg,
        steamMassKg: model.state.balloon.steamMassKg,
        membraneIntegrity: model.state.balloon.membraneIntegrity,
        ruptured: model.state.balloon.ruptured,
        fireIntensity: model.state.surface.fireIntensity,
        flameTemperatureK: model.state.surface.flameTemperatureK,
        radiativeHeatFlux: model.state.surface.radiativeHeatFlux,
        waterContact: model.state.surface.waterContact,
        coolingPotential: model.state.mpm.sphMaterial.coolingPotential
      },
      state: firstStep ? membraneShellSolverState : undefined
    }
  })
    .then((result) => {
      membraneShellSolverCompleted += 1;
      membraneShellSolverLastError = null;
      if (result?.state) {
        membraneShellSolverState = result.state;
      }
      model.applyMembraneShellResult(result);
      membraneShellSolverLastResult = result
        ? {
          schema: result.schema,
          executionContext: result.executionContext,
          backend: result.backend,
          sequence: result.sequence,
          elapsedTime: result.elapsedTime,
          segmentCount: result.diagnostics?.segmentCount ?? result.state?.segmentCount ?? 0,
          membraneIntegrity: result.diagnostics?.membraneIntegrity ?? model.state.balloon.membraneIntegrity,
          ruptureRisk: result.diagnostics?.ruptureRisk ?? 0,
          ruptured: result.diagnostics?.ruptured === true || result.diagnostics?.burst === true,
          maxStressPa: result.diagnostics?.maxStressPa ?? 0,
          meanStressPa: result.diagnostics?.meanStressPa ?? 0,
          maxStrain: result.diagnostics?.maxStrain ?? 0,
          damageMean: result.diagnostics?.damageMean ?? 0,
          damageMax: result.diagnostics?.damageMax ?? 0,
          meanTemperatureK: result.diagnostics?.meanTemperatureK ?? 0,
          maxTemperatureK: result.diagnostics?.maxTemperatureK ?? 0,
          heatFluxMean: result.diagnostics?.heatFluxMean ?? 0,
          conservation: result.conservation,
          webgpuStatus: result.webgpuStatus,
          webgpuError: result.webgpuError
        }
        : null;
    })
    .catch((error) => {
      membraneShellSolverFailed += 1;
      membraneShellSolverLastError = error instanceof Error ? error.message : String(error);
    })
    .finally(() => {
      membraneShellSolverPending = false;
      updateSolverRuntimeStatus();
    });
}

function stepCompute() {
  try {
    const snapshot = compute.step({
      time: model.time,
      dt: 1 / 60,
      layerIndex: model.layerIndex,
      environment: model.environment,
      readbackInterval: readbackBudgetReport?.readbackInterval,
      readbackReason: readbackBudgetReport?.reason,
      readbackBudget: readbackBudgetReport
    });
    lastComputeStepError = null;
    scene.applyComputeSnapshot(snapshot);
  } catch (error) {
    lastComputeStepError = error instanceof Error ? error.message : String(error);
    scene.applyComputeSnapshot(null);
  }
  refreshComputeStatus();
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function getComputeDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(COMPUTE_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    backend: entry?.payload?.backend || null,
    layerIndex: entry?.payload?.layerIndex ?? null,
    layerId: entry?.payload?.layerId || null,
    shardIndex: entry?.payload?.shardIndex ?? null,
    count: entry?.payload?.count ?? null,
    positionFloats: entry?.payload?.positionFloats ?? null
  }]));
}

function getSolverDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOLVER_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    solverId: entry?.payload?.solverId || null,
    backend: entry?.payload?.backend || null,
    sequence: entry?.payload?.sequence ?? null,
    bodyCount: entry?.payload?.bodyCount ?? null,
    approximation: entry?.payload?.approximation?.mode || null,
    interactionCount: entry?.payload?.approximation?.interactionCount ?? null,
    forceErrorEstimate: entry?.payload?.approximation?.forceErrorEstimate ?? null,
    particleCount: entry?.payload?.particleCount ?? null,
    segmentCount: entry?.payload?.segmentCount ?? null,
    elapsedTime: entry?.payload?.elapsedTime ?? null,
    temperatureK: entry?.payload?.closure?.temperatureK ?? null,
    heatReleaseNorm: entry?.payload?.closure?.heatReleaseNorm ?? null,
    fieldEnergy: entry?.payload?.diagnostics?.fieldEnergy ?? null,
    netCharge: entry?.payload?.diagnostics?.netCharge ?? null,
    cosmologySampleCount: entry?.payload?.sampleCount ?? null,
    cosmologyScaleFactor: entry?.payload?.diagnostics?.scaleFactor ?? null,
    cosmologyHubbleRate: entry?.payload?.diagnostics?.hubbleRate ?? null,
    cosmologyFilamentEnergy: entry?.payload?.diagnostics?.filamentEnergy ?? null,
    cosmologyStructureGrowth: entry?.payload?.diagnostics?.structureGrowthProxy ?? null,
    cosmologyExpansionWork: entry?.payload?.diagnostics?.expansionWorkProxy ?? null,
    cosmologyExpansionEnergyDelta: entry?.payload?.conservation?.expansionEnergyDelta ?? null,
    molecularAtomCount: entry?.payload?.atomCount ?? null,
    molecularBondCount: entry?.payload?.bondCount ?? null,
    molecularMeanBondOrder: entry?.payload?.diagnostics?.meanBondOrder ?? null,
    molecularReactionProgress: entry?.payload?.diagnostics?.reactionProgress ?? null,
    molecularHeatReleaseProxy: entry?.payload?.diagnostics?.heatReleaseProxy ?? null,
    molecularMeanTemperatureK: entry?.payload?.diagnostics?.meanTemperatureK ?? null,
    molecularIonizationFraction: entry?.payload?.diagnostics?.ionizationFraction ?? null,
    molecularEnergyDelta: entry?.payload?.conservation?.energyDelta ?? null,
    molecularChargeDrift: entry?.payload?.conservation?.chargeDrift ?? null,
    averageTemperatureK: entry?.payload?.diagnostics?.averageTemperatureK ?? null,
    vaporFraction: entry?.payload?.diagnostics?.vaporFraction ?? null,
    fireContactFraction: entry?.payload?.diagnostics?.fireContactFraction ?? null,
    coolingPotential: entry?.payload?.diagnostics?.coolingPotential ?? null,
    groundContactFraction: entry?.payload?.diagnostics?.groundContactFraction ?? null,
    spillImpulse: entry?.payload?.diagnostics?.spillImpulse ?? null,
    centerToFireDistance: entry?.payload?.diagnostics?.centerToFireDistance ?? null,
    opticalDepth: entry?.payload?.diagnostics?.opticalDepth ?? null,
    greenhouseFactor: entry?.payload?.diagnostics?.greenhouseFactor ?? null,
    radiationEnergyDelta: entry?.payload?.conservation?.radiationEnergyDelta ?? null,
    stellarCoreTemperatureK: entry?.payload?.diagnostics?.coreTemperatureK ?? null,
    stellarFusionPowerProxy: entry?.payload?.diagnostics?.fusionPowerProxy ?? null,
    stellarLuminosityProxy: entry?.payload?.diagnostics?.luminosityProxy ?? null,
    stellarHydrogenFraction: entry?.payload?.diagnostics?.meanHydrogenFraction ?? null,
    stellarHeliumFraction: entry?.payload?.diagnostics?.meanHeliumFraction ?? null,
    stellarFusionEnergyDelta: entry?.payload?.conservation?.fusionEnergyDelta ?? null,
    stellarSpeciesDrift: Math.abs(entry?.payload?.conservation?.hydrogenBurnedDelta ?? 0)
      + Math.abs(entry?.payload?.conservation?.heliumProducedDelta ?? 0),
    magnetosphereSolarWindPressure: entry?.payload?.diagnostics?.solarWindPressure ?? null,
    magnetosphereReconnectionRate: entry?.payload?.diagnostics?.reconnectionRate ?? null,
    magnetosphereMagneticEnergy: entry?.payload?.diagnostics?.magneticEnergy ?? null,
    magnetosphereIonizationFraction: entry?.payload?.diagnostics?.meanIonizationFraction ?? null,
    magnetosphereDivergenceBProxy: entry?.payload?.conservation?.divergenceBProxy ?? null,
    picParticleCount: entry?.payload?.particleCount ?? null,
    picChargeImbalance: entry?.payload?.diagnostics?.chargeImbalance ?? null,
    picCurrentDensity: entry?.payload?.diagnostics?.currentDensity ?? null,
    picKineticEnergy: entry?.payload?.diagnostics?.kineticEnergy ?? null,
    picFieldEnergy: entry?.payload?.diagnostics?.fieldEnergy ?? null,
    picReconnectionHeating: entry?.payload?.diagnostics?.reconnectionHeating ?? null,
    picDivergenceEProxy: entry?.payload?.conservation?.divergenceEProxy ?? null,
    relativisticSampleCount: entry?.payload?.sampleCount ?? null,
    relativisticMaxSpeedFractionC: entry?.payload?.diagnostics?.maxSpeedFractionC ?? null,
    relativisticMeanLorentzFactor: entry?.payload?.diagnostics?.meanLorentzFactor ?? null,
    relativisticTimeDilation: entry?.payload?.diagnostics?.meanTimeDilation ?? null,
    relativisticRedshift: entry?.payload?.diagnostics?.gravitationalRedshiftProxy ?? null,
    relativisticPrecession: entry?.payload?.diagnostics?.perihelionPrecessionArcsecProxy ?? null,
    relativisticEnergyDelta: entry?.payload?.conservation?.relativisticEnergyDelta ?? null,
    fireAreaFraction: entry?.payload?.diagnostics?.fireAreaFraction ?? null,
    smokeColumn: entry?.payload?.diagnostics?.smokeColumn ?? null,
    fuelRemaining: entry?.payload?.diagnostics?.fuelRemaining ?? null,
    smokeCentroidX: entry?.payload?.diagnostics?.smokeCentroidX ?? null,
    smokeCentroidY: entry?.payload?.diagnostics?.smokeCentroidY ?? null,
    plumeRise: entry?.payload?.diagnostics?.plumeRise ?? null,
    buoyancyFlux: entry?.payload?.diagnostics?.buoyancyFlux ?? null,
    oxygenDepletion: entry?.payload?.diagnostics?.oxygenDepletion ?? null,
    suppressionMean: entry?.payload?.diagnostics?.suppressionMean ?? null,
    membraneIntegrity: entry?.payload?.diagnostics?.membraneIntegrity ?? null,
    ruptureRisk: entry?.payload?.diagnostics?.ruptureRisk ?? null,
    maxStressPa: entry?.payload?.diagnostics?.maxStressPa ?? null,
    maxStrain: entry?.payload?.diagnostics?.maxStrain ?? null,
    damageMean: entry?.payload?.diagnostics?.damageMean ?? null,
    relativeEnergyDrift: entry?.payload?.conservation?.relativeEnergyDrift ?? null,
    momentumDrift: entry?.payload?.conservation?.momentumDrift ?? null,
    kineticEnergyDrift: entry?.payload?.conservation?.kineticEnergyDrift ?? null,
    massDrift: entry?.payload?.conservation?.massDrift ?? null,
    webgpuError: entry?.payload?.webgpuError || null
  }]));
}

function getClosureDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(CLOSURE_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    modelId: entry?.payload?.modelId || null,
    solverId: entry?.payload?.source?.solverId || null,
    backend: entry?.payload?.source?.backend || null,
    sequence: entry?.payload?.source?.sequence ?? null,
    temperatureK: entry?.payload?.thermodynamics?.temperatureK ?? null,
    pressurePa: entry?.payload?.thermodynamics?.pressurePa ?? null,
    vaporFraction: entry?.payload?.phase?.vaporFraction ?? null,
    validity: entry?.payload?.validity?.status || null,
    confidence: entry?.payload?.uncertainty?.confidence ?? null
  }]));
}

function getConservationDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(CONSERVATION_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    massRelativeError: entry?.payload?.massRelativeError ?? null,
    energyResidualProxy: entry?.payload?.energyResidualProxy ?? null,
    speciesResidualProxy: entry?.payload?.speciesResidualProxy ?? null,
    waterInventoryKg: entry?.payload?.water?.inventoryKg ?? null,
    surfaceRadiativeHeatFlux: entry?.payload?.exchange?.surfaceRadiativeHeatFlux ?? null,
    stellarFusionPowerProxy: entry?.payload?.exchange?.stellarFusionPowerProxy ?? null,
    stellarLuminosityFactor: entry?.payload?.exchange?.stellarLuminosityFactor ?? null,
    cosmologyHubbleRate: entry?.payload?.exchange?.cosmologyHubbleRate ?? null,
    cosmologyScaleFactor: entry?.payload?.exchange?.cosmologyScaleFactor ?? null,
    cosmologyFilamentEnergy: entry?.payload?.exchange?.cosmologyFilamentEnergy ?? null,
    magnetosphereSolarWindPressure: entry?.payload?.exchange?.magnetosphereSolarWindPressure ?? null,
    magnetosphereReconnectionRate: entry?.payload?.exchange?.magnetosphereReconnectionRate ?? null,
    picChargeImbalance: entry?.payload?.exchange?.picChargeImbalance ?? null,
    picReconnectionHeating: entry?.payload?.exchange?.picReconnectionHeating ?? null,
    relativisticMaxSpeedFractionC: entry?.payload?.exchange?.relativisticMaxSpeedFractionC ?? null,
    relativisticTimeDilation: entry?.payload?.exchange?.relativisticMeanTimeDilation ?? null,
    relativisticRedshift: entry?.payload?.exchange?.relativisticGravitationalRedshift ?? null,
    molecularBondCount: entry?.payload?.exchange?.molecularBondCount ?? null,
    molecularHeatReleaseProxy: entry?.payload?.exchange?.molecularHeatReleaseProxy ?? null,
    molecularIonizationFraction: entry?.payload?.exchange?.molecularIonizationFraction ?? null,
    molecularMeanTemperatureK: entry?.payload?.exchange?.molecularMeanTemperatureK ?? null,
    trackedCouplingCount: Array.isArray(entry?.payload?.trackedCouplings) ? entry.payload.trackedCouplings.length : 0
  }]));
}

function getCouplingDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(COUPLING_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    linkCount: entry?.payload?.linkCount ?? null,
    activeLinkCount: entry?.payload?.activeLinkCount ?? null,
    upwardActiveLinkCount: entry?.payload?.activeDirectionCounts?.upward ?? null,
    downwardActiveLinkCount: entry?.payload?.activeDirectionCounts?.downward ?? null,
    strongestLinkId: entry?.payload?.strongestLinks?.[0]?.id || null,
    strongestSourceLayer: entry?.payload?.strongestLinks?.[0]?.sourceLayer || null,
    strongestTargetLayer: entry?.payload?.strongestLinks?.[0]?.targetLayer || null,
    strongestActiveScore: entry?.payload?.strongestLinks?.[0]?.activeScore ?? null,
    surfaceWaterContact: entry?.payload?.exchange?.surfaceWaterContact ?? null,
    sphCoolingPotential: entry?.payload?.exchange?.sphCoolingPotential ?? null,
    molecularHeatReleaseProxy: entry?.payload?.exchange?.molecularHeatReleaseProxy ?? null,
    reactiveHeatReleaseNorm: entry?.payload?.exchange?.reactiveHeatReleaseNorm ?? null,
    stellarLuminosityFactor: entry?.payload?.exchange?.stellarLuminosityFactor ?? null,
    ambientTemperatureK: entry?.payload?.environment?.ambientTemperatureK ?? null,
    ambientPressurePa: entry?.payload?.environment?.ambientPressurePa ?? null,
    oxygenFraction: entry?.payload?.environment?.oxygenFraction ?? null
  }]));
}

function getLawGraphDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(LAW_GRAPH_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    proxyConsistent: entry?.payload?.proxyConsistent ?? null,
    scientificReady: entry?.payload?.scientificReady ?? null,
    stateNodeCount: entry?.payload?.stateNodeCount ?? null,
    lawNodeCount: entry?.payload?.lawNodeCount ?? null,
    constraintNodeCount: entry?.payload?.constraintNodeCount ?? null,
    edgeCount: entry?.payload?.edgeCount ?? null,
    blockedConstraintCount: entry?.payload?.blockedConstraintCount ?? null,
    scientificBlockingConstraintCount: entry?.payload?.scientificBlockingConstraintCount ?? null,
    updatePlanStatus: entry?.payload?.updatePlan?.status || null,
    updatePlanOperationCount: entry?.payload?.updatePlan?.operationCount ?? null,
    updatePlanRunnableOperationCount: entry?.payload?.updatePlan?.runnableOperationCount ?? null,
    updatePlanBlockedOperationCount: entry?.payload?.updatePlan?.blockedOperationCount ?? null,
    updatePlanDispatchReadyOperationCount: entry?.payload?.updatePlan?.dispatchReadyOperationCount ?? null,
    updatePlanPhaseCount: entry?.payload?.updatePlan?.phaseCount ?? null,
    updatePlanAuthoritativeMutationReady: entry?.payload?.updatePlan?.authoritativeMutationReady ?? null,
    updatePlanNextRunnableOperationId: entry?.payload?.updatePlan?.nextRunnableOperationId || null,
    updatePlanNextBlockedOperationId: entry?.payload?.updatePlan?.nextBlockedOperationId || null,
    consistencySolveStatus: entry?.payload?.consistencySolve?.status || null,
    consistencySolveIterationCount: entry?.payload?.consistencySolve?.iterationCount ?? null,
    consistencySolveProposedStateUpdateCount: entry?.payload?.consistencySolve?.proposedStateUpdateCount ?? null,
    consistencySolveConvergedProxy: entry?.payload?.consistencySolve?.convergedProxy ?? null,
    consistencySolveConvergedScientific: entry?.payload?.consistencySolve?.convergedScientific ?? null,
    consistencySolveClosedResidualProxy: entry?.payload?.consistencySolve?.closedResidualProxy ?? null,
    consistencySolveScientificResidual: entry?.payload?.consistencySolve?.scientificResidual ?? null,
    proposalAdmissionStatus: entry?.payload?.proposalAdmission?.status || null,
    proposalAdmissionProposalCount: entry?.payload?.proposalAdmission?.proposalCount ?? null,
    proposalAdmissionProxyWarmDeltaReadyCount: entry?.payload?.proposalAdmission?.proxyWarmDeltaReadyCount ?? null,
    proposalAdmissionComputeManagerDispatchReadyCount: entry?.payload?.proposalAdmission?.computeManagerDispatchReadyCount ?? null,
    proposalAdmissionScientificBlockedApplicationCount: entry?.payload?.proposalAdmission?.scientificBlockedApplicationCount ?? null,
    proposalAdmissionAuthoritativeMutationBlockedCount: entry?.payload?.proposalAdmission?.authoritativeMutationBlockedCount ?? null,
    proposalAdmissionNextAdmissionAction: entry?.payload?.proposalAdmission?.nextAdmissionAction || null,
    dispatchQueueStatus: entry?.payload?.dispatchQueue?.status || null,
    dispatchQueueEntryCount: entry?.payload?.dispatchQueue?.queueEntryCount ?? null,
    dispatchQueueReadyEntryCount: entry?.payload?.dispatchQueue?.readyEntryCount ?? null,
    dispatchQueueComputeManagerReadyCount: entry?.payload?.dispatchQueue?.computeManagerReadyCount ?? null,
    dispatchQueueModelLocalReadyCount: entry?.payload?.dispatchQueue?.modelLocalReadyCount ?? null,
    dispatchQueuePartialProxyReadyCount: entry?.payload?.dispatchQueue?.partialProxyReadyCount ?? null,
    dispatchQueueScientificBlockedEntryCount: entry?.payload?.dispatchQueue?.scientificBlockedEntryCount ?? null,
    dispatchQueueNextQueueAction: entry?.payload?.dispatchQueue?.nextQueueAction || null,
    schedulerManifestStatus: entry?.payload?.schedulerManifest?.status || null,
    schedulerManifestEntryCount: entry?.payload?.schedulerManifest?.manifestEntryCount ?? null,
    schedulerManifestReadyEntryCount: entry?.payload?.schedulerManifest?.readyManifestEntryCount ?? null,
    schedulerManifestSchedulerReadyCount: entry?.payload?.schedulerManifest?.schedulerReadyCount ?? null,
    schedulerManifestComputeManagerReadyCount: entry?.payload?.schedulerManifest?.computeManagerReadyCount ?? null,
    schedulerManifestModelLocalReadyCount: entry?.payload?.schedulerManifest?.modelLocalReadyCount ?? null,
    schedulerManifestResolvedDescriptorCount: entry?.payload?.schedulerManifest?.resolvedDescriptorCount ?? null,
    schedulerManifestUnresolvedDescriptorCount: entry?.payload?.schedulerManifest?.unresolvedDescriptorCount ?? null,
    schedulerManifestExecutorMissingCount: entry?.payload?.schedulerManifest?.executorMissingCount ?? null,
    schedulerManifestScientificBlockedEntryCount: entry?.payload?.schedulerManifest?.scientificBlockedEntryCount ?? null,
    schedulerManifestNextSchedulerAction: entry?.payload?.schedulerManifest?.nextSchedulerAction || null,
    schedulerExecutionAuditStatus: entry?.payload?.schedulerExecutionAudit?.status || null,
    schedulerExecutionEvidenceAvailable: entry?.payload?.schedulerExecutionAudit?.evidenceAvailable ?? null,
    schedulerExecutionRequiredCount: entry?.payload?.schedulerExecutionAudit?.executionRequiredCount ?? null,
    schedulerExecutionObservedCount: entry?.payload?.schedulerExecutionAudit?.executionObservedCount ?? null,
    schedulerExecutionFullyObservedCount: entry?.payload?.schedulerExecutionAudit?.fullyObservedCount ?? null,
    schedulerExecutionRuntimeMatchedCount: entry?.payload?.schedulerExecutionAudit?.runtimeMatchedCount ?? null,
    schedulerExecutionWarmDeltaMatchedCount: entry?.payload?.schedulerExecutionAudit?.warmDeltaMatchedCount ?? null,
    schedulerExecutionMissingRuntimeCount: entry?.payload?.schedulerExecutionAudit?.missingRuntimeCount ?? null,
    schedulerExecutionMissingWarmDeltaCount: entry?.payload?.schedulerExecutionAudit?.missingWarmDeltaCount ?? null,
    schedulerExecutionNextAction: entry?.payload?.schedulerExecutionAudit?.nextExecutionAction || null,
    resultAdmissionStatus: entry?.payload?.resultAdmission?.status || null,
    resultAdmissionRequiredCount: entry?.payload?.resultAdmission?.resultAdmissionRequiredCount ?? null,
    resultAdmissionProxyAdmittedCount: entry?.payload?.resultAdmission?.proxyAdmittedCount ?? null,
    resultAdmissionMissingRuntimeCount: entry?.payload?.resultAdmission?.missingRuntimeCount ?? null,
    resultAdmissionMissingWarmDeltaCount: entry?.payload?.resultAdmission?.missingWarmDeltaCount ?? null,
    resultAdmissionScientificBlockedCount: entry?.payload?.resultAdmission?.scientificBlockedAdmissionCount ?? null,
    resultAdmissionNextAction: entry?.payload?.resultAdmission?.nextResultAdmissionAction || null,
    stateApplicationPreflightStatus: entry?.payload?.stateApplicationPreflight?.status || null,
    stateApplicationRequiredCount: entry?.payload?.stateApplicationPreflight?.applicationPreflightRequiredCount ?? null,
    stateApplicationProxyReadyCount: entry?.payload?.stateApplicationPreflight?.proxyApplicationReadyCount ?? null,
    stateApplicationWaitingResultCount: entry?.payload?.stateApplicationPreflight?.waitingResultAdmissionCount ?? null,
    stateApplicationMissingLinkCount: entry?.payload?.stateApplicationPreflight?.missingStateApplicationLinkCount ?? null,
    stateApplicationScientificBlockedCount: entry?.payload?.stateApplicationPreflight?.scientificBlockedApplicationCount ?? null,
    stateApplicationNextAction: entry?.payload?.stateApplicationPreflight?.nextStateApplicationAction || null,
    nextRequiredStep: entry?.payload?.update?.nextRequiredStep || null
  }]));
}

function getUlgRuntimeDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(ULG_RUNTIME_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    modelId: entry?.payload?.modelId || null,
    activeLayerId: entry?.payload?.activeLayerId || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    liveBackendPolicy: entry?.payload?.liveBackendPolicy || null,
    carrierKindCount: entry?.payload?.carrierKindCount ?? null,
    stateChannelCount: entry?.payload?.stateChannelCount ?? null,
    passCount: entry?.payload?.passCount ?? null,
    webgpuPassCount: entry?.payload?.webgpuPassCount ?? null,
    invalidLivePassCount: entry?.payload?.invalidLivePassCount ?? null,
    materialClosureReadyCount: entry?.payload?.materialClosureReadyCount ?? null,
    scientificBlockedClosureCount: entry?.payload?.scientificBlockedClosureCount ?? null,
    hamiltonianHash: entry?.payload?.hamiltonian?.hamiltonianHash || null,
    closureHash: entry?.payload?.materialClosures?.[0]?.closureHash || null,
    passDagStatus: entry?.payload?.passDag?.status || null,
    quantumTaskStatus: entry?.payload?.quantumTaskCapsule?.validation?.status || null,
    lawTaskStatus: entry?.payload?.lawTaskCapsule?.validation?.status || null,
    invariantStatus: entry?.payload?.invariantReport?.status || null,
    nextRequiredStep: entry?.payload?.nextRequiredStep || null
  }]));
}

function getUlgRuntimeExecutionDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(ULG_RUNTIME_EXECUTION_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    ok: entry?.payload?.ok === true,
    backend: entry?.payload?.backend || null,
    manifestHash: entry?.payload?.manifestHash || null,
    activeLayerId: entry?.payload?.activeLayerId || null,
    passDagStatus: entry?.payload?.passDagStatus || null,
    passCount: entry?.payload?.passCount ?? null,
    executedPassCount: entry?.payload?.executedPassCount ?? null,
    invalidLivePassCount: entry?.payload?.invalidLivePassCount ?? null,
    totalWorkItems: entry?.payload?.totalWorkItems ?? null,
    evidenceHash: entry?.payload?.evidenceHash || null,
    stateDelta: entry?.payload?.stateDelta ? {
      schema: entry.payload.stateDelta.schema,
      status: entry.payload.stateDelta.status,
      ok: entry.payload.stateDelta.ok === true,
      mutationMode: entry.payload.stateDelta.mutationMode || null,
      proxyStateApplied: entry.payload.stateDelta.proxyStateApplied === true,
      authoritativeWorkerBufferMutation: entry.payload.stateDelta.authoritativeWorkerBufferMutation === true,
      scientificMutationReady: entry.payload.stateDelta.scientificMutationReady === true,
      readiness: entry.payload.stateDelta.readiness ?? 0,
      channelUpdateCount: entry.payload.stateDelta.channelUpdateCount ?? 0,
      appliedChannelUpdateCount: entry.payload.stateDelta.appliedChannelUpdateCount ?? 0,
      stateDeltaHash: entry.payload.stateDelta.stateDeltaHash || null,
      blocker: entry.payload.stateDelta.blocker || null
    } : null,
    webgpuStatus: entry?.payload?.webgpuStatus?.status || null,
    webgpuKernelMode: entry?.payload?.webgpuStatus?.kernelMode || null,
    webgpuError: entry?.payload?.webgpuError || null
  }]));
}

function getSourceSinkBalanceDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_SINK_BALANCE_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    activeTargetCount: entry?.payload?.coverage?.activeTargetCount ?? null,
    sourceDriveCoverage: entry?.payload?.coverage?.sourceDriveCoverage ?? null,
    coolingDriveCoverage: entry?.payload?.coverage?.coolingDriveCoverage ?? null,
    heatProxyCoverage: entry?.payload?.coverage?.heatProxyCoverage ?? null,
    speciesRateCoverage: entry?.payload?.coverage?.speciesRateCoverage ?? null,
    reactionHeatSourceProxy: entry?.payload?.source?.reactionHeatSourceProxy ?? null,
    reactionSpeciesRateProxy: entry?.payload?.source?.reactionSpeciesRateProxy ?? null,
    balanceResidualProxy: entry?.payload?.residuals?.balanceResidualProxy ?? null,
    heatProxyResidual: entry?.payload?.residuals?.heatProxyResidual ?? null,
    speciesRateResidualProxy: entry?.payload?.residuals?.speciesRateResidualProxy ?? null,
    fanoutOversubscriptionProxy: entry?.payload?.residuals?.fanoutOversubscriptionProxy ?? null
  }]));
}

function getSourceTransferDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    dryRun: entry?.payload?.dryRun === true,
    applied: entry?.payload?.applied === true,
    allocationCount: entry?.payload?.allocations?.length ?? 0,
    heatUnit: entry?.payload?.units?.heatRate?.unit || null,
    speciesUnit: entry?.payload?.units?.speciesRate?.unit || null,
    sourceHeatRateWProxy: entry?.payload?.sourceTerms?.sourceHeatRateWProxy ?? null,
    sourceSpeciesRateProxy: entry?.payload?.sourceTerms?.sourceSpeciesRateProxy ?? null,
    unallocatedHeatRateWProxy: entry?.payload?.residuals?.unallocatedHeatRateWProxy ?? null,
    unallocatedSpeciesRateCountPerSProxy: entry?.payload?.residuals?.unallocatedSpeciesRateCountPerSProxy ?? null,
    closedSystemResidualProxy: entry?.payload?.residuals?.closedSystemResidualProxy ?? null
  }]));
}

function getSourceTransferApplicationDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_APPLICATION_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    canApply: entry?.payload?.canApply === true,
    applied: entry?.payload?.applied === true,
    dryRun: entry?.payload?.dryRun === true,
    applicationRequested: entry?.payload?.applicationRequested === true,
    mutationEnabled: entry?.payload?.mutationEnabled === true,
    scientificMode: entry?.payload?.scientificMode === true,
    targetAdaptersValidated: entry?.payload?.targetAdaptersValidated === true,
    allocationCount: entry?.payload?.allocationCount ?? entry?.payload?.targets?.length ?? 0,
    readyTargetCount: entry?.payload?.readyTargetCount ?? 0,
    blockedTargetCount: entry?.payload?.blockedTargetCount ?? 0,
    appliedTargetCount: entry?.payload?.appliedTargetCount ?? 0,
    blockerCount: entry?.payload?.blockers?.length ?? 0,
    closedSystemResidualProxy: entry?.payload?.closedSystemResidualProxy ?? null,
    closedResidualToleranceProxy: entry?.payload?.closedResidualToleranceProxy ?? null
  }]));
}

function getSourceTransferTransactionDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_TRANSACTION_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    allowed: entry?.payload?.allowed === true,
    mutationAttempted: entry?.payload?.mutationAttempted === true,
    applied: entry?.payload?.applied === true,
    transactionEnabled: entry?.payload?.transactionEnabled === true,
    applicationRequested: entry?.payload?.applicationRequested === true,
    applicationCanApply: entry?.payload?.applicationCanApply === true,
    targetCount: entry?.payload?.targetCount ?? entry?.payload?.targets?.length ?? 0,
    readyTargetCount: entry?.payload?.readyTargetCount ?? 0,
    blockedTargetCount: entry?.payload?.blockedTargetCount ?? 0,
    appliedTargetCount: entry?.payload?.appliedTargetCount ?? 0,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getSourceTransferTargetPreviewDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_PREVIEW_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceTransactionSchema: entry?.payload?.sourceTransactionSchema || null,
    transactionAllowed: entry?.payload?.transactionAllowed === true,
    mutationAttempted: entry?.payload?.mutationAttempted === true,
    dryRun: entry?.payload?.dryRun === true,
    applied: entry?.payload?.applied === true,
    mutationEnabled: entry?.payload?.mutationEnabled === true,
    previewTargetCount: entry?.payload?.previewTargetCount ?? entry?.payload?.targets?.length ?? 0,
    blockedTargetCount: entry?.payload?.blockedTargetCount ?? entry?.payload?.targets?.length ?? 0,
    appliedTargetCount: entry?.payload?.appliedTargetCount ?? 0,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0,
    totalHeatRateWProxy: entry?.payload?.sourceTerms?.totalHeatRateWProxy ?? null,
    totalSpeciesRateCountPerSProxy: entry?.payload?.sourceTerms?.totalSpeciesRateCountPerSProxy ?? null,
    maxAbsTemperatureDeltaKProxy: entry?.payload?.sourceTerms?.maxAbsTemperatureDeltaKProxy ?? null,
    maxPhaseDriveDeltaProxy: entry?.payload?.sourceTerms?.maxPhaseDriveDeltaProxy ?? null
  }]));
}

function getSourceTransferTargetMutatorRegistryDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATOR_REGISTRY_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourcePreviewSchema: entry?.payload?.sourcePreviewSchema || null,
    dryRun: entry?.payload?.dryRun === true,
    mutationEnabled: entry?.payload?.mutationEnabled === true,
    canMutate: entry?.payload?.canMutate === true,
    applied: entry?.payload?.applied === true,
    targetCount: entry?.payload?.targetCount ?? entry?.payload?.targets?.length ?? 0,
    registeredMutatorCount: entry?.payload?.registeredMutatorCount ?? 0,
    validatedMutatorCount: entry?.payload?.validatedMutatorCount ?? 0,
    blockedMutatorCount: entry?.payload?.blockedMutatorCount ?? 0,
    declaredFieldCount: entry?.payload?.declaredFieldCount ?? 0,
    invariantScopeCount: entry?.payload?.invariantScopeCount ?? 0,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getSourceTransferTargetMutationPreflightDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATION_PREFLIGHT_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceRegistrySchema: entry?.payload?.sourceRegistrySchema || null,
    sourcePreviewSchema: entry?.payload?.sourcePreviewSchema || null,
    dryRun: entry?.payload?.dryRun === true,
    canMutate: entry?.payload?.canMutate === true,
    applied: entry?.payload?.applied === true,
    targetCount: entry?.payload?.targetCount ?? entry?.payload?.targets?.length ?? 0,
    checkedTargetCount: entry?.payload?.checkedTargetCount ?? entry?.payload?.targets?.length ?? 0,
    passedTargetCount: entry?.payload?.passedTargetCount ?? 0,
    blockedTargetCount: entry?.payload?.blockedTargetCount ?? 0,
    residualBudgetPassCount: entry?.payload?.residualBudgetPassCount ?? 0,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0,
    residualToleranceProxy: entry?.payload?.residualToleranceProxy ?? null,
    maxResidualRiskProxy: entry?.payload?.maxResidualRiskProxy ?? null,
    maxAbsTemperatureDeltaKProxy: entry?.payload?.maxAbsTemperatureDeltaKProxy ?? null
  }]));
}

function getSourceTransferTargetMutationOperationPlanDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATION_OPERATION_PLAN_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourcePreflightSchema: entry?.payload?.sourcePreflightSchema || null,
    sourceRegistrySchema: entry?.payload?.sourceRegistrySchema || null,
    sourcePreviewSchema: entry?.payload?.sourcePreviewSchema || null,
    dryRun: entry?.payload?.dryRun === true,
    canApply: entry?.payload?.canApply === true,
    applied: entry?.payload?.applied === true,
    targetCount: entry?.payload?.targetCount ?? entry?.payload?.targets?.length ?? 0,
    operationCount: entry?.payload?.operationCount ?? 0,
    allowedByRegistryOperationCount: entry?.payload?.allowedByRegistryOperationCount ?? 0,
    blockedOperationCount: entry?.payload?.blockedOperationCount ?? 0,
    appliedOperationCount: entry?.payload?.appliedOperationCount ?? 0,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0,
    maxAbsFieldDeltaProxy: entry?.payload?.maxAbsFieldDeltaProxy ?? null,
    maxAbsTemperatureDeltaKProxy: entry?.payload?.maxAbsTemperatureDeltaKProxy ?? null
  }]));
}

function getSourceTransferTargetMutationInvariantCheckDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATION_INVARIANT_CHECK_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceOperationPlanSchema: entry?.payload?.sourceOperationPlanSchema || null,
    sourcePreflightSchema: entry?.payload?.sourcePreflightSchema || null,
    sourceRegistrySchema: entry?.payload?.sourceRegistrySchema || null,
    dryRun: entry?.payload?.dryRun === true,
    canApply: entry?.payload?.canApply === true,
    applied: entry?.payload?.applied === true,
    targetCount: entry?.payload?.targetCount ?? entry?.payload?.targets?.length ?? 0,
    checkedTargetCount: entry?.payload?.checkedTargetCount ?? entry?.payload?.targets?.length ?? 0,
    passedTargetCount: entry?.payload?.passedTargetCount ?? 0,
    blockedTargetCount: entry?.payload?.blockedTargetCount ?? 0,
    operationCount: entry?.payload?.operationCount ?? 0,
    coveredInvariantScopeCount: entry?.payload?.coveredInvariantScopeCount ?? 0,
    missingInvariantScopeCount: entry?.payload?.missingInvariantScopeCount ?? 0,
    residualBudgetPassCount: entry?.payload?.residualBudgetPassCount ?? 0,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0,
    maxResidualProxy: entry?.payload?.maxResidualProxy ?? null
  }]));
}

function getSourceTransferTargetMutationCommitDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATION_COMMIT_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceInvariantCheckSchema: entry?.payload?.sourceInvariantCheckSchema || null,
    sourceOperationPlanSchema: entry?.payload?.sourceOperationPlanSchema || null,
    dryRun: entry?.payload?.dryRun === true,
    canCommit: entry?.payload?.canCommit === true,
    committed: entry?.payload?.committed === true,
    targetCount: entry?.payload?.targetCount ?? entry?.payload?.targets?.length ?? 0,
    invariantEligibleTargetCount: entry?.payload?.invariantEligibleTargetCount ?? 0,
    committableTargetCount: entry?.payload?.committableTargetCount ?? 0,
    blockedTargetCount: entry?.payload?.blockedTargetCount ?? 0,
    committedTargetCount: entry?.payload?.committedTargetCount ?? 0,
    plannedOperationCount: entry?.payload?.plannedOperationCount ?? 0,
    committedOperationCount: entry?.payload?.committedOperationCount ?? 0,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0,
    maxResidualProxy: entry?.payload?.maxResidualProxy ?? null
  }]));
}

function getSourceTransferTargetMutationDispatchDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATION_DISPATCH_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceCommitSchema: entry?.payload?.sourceCommitSchema || null,
    sourceOperationPlanSchema: entry?.payload?.sourceOperationPlanSchema || null,
    dryRun: entry?.payload?.dryRun === true,
    dispatchEnabled: entry?.payload?.dispatchEnabled === true,
    canDispatch: entry?.payload?.canDispatch === true,
    queued: entry?.payload?.queued === true,
    dispatched: entry?.payload?.dispatched === true,
    batchCount: entry?.payload?.batchCount ?? entry?.payload?.batches?.length ?? 0,
    invariantEligibleBatchCount: entry?.payload?.invariantEligibleBatchCount ?? 0,
    dispatchableBatchCount: entry?.payload?.dispatchableBatchCount ?? 0,
    blockedBatchCount: entry?.payload?.blockedBatchCount ?? 0,
    operationCount: entry?.payload?.operationCount ?? 0,
    dispatchableOperationCount: entry?.payload?.dispatchableOperationCount ?? 0,
    dispatchedOperationCount: entry?.payload?.dispatchedOperationCount ?? 0,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0,
    maxAbsFieldDeltaProxy: entry?.payload?.maxAbsFieldDeltaProxy ?? null,
    maxAbsTemperatureDeltaKProxy: entry?.payload?.maxAbsTemperatureDeltaKProxy ?? null
  }]));
}

function getSourceTransferTargetMutationApplyValidationDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATION_APPLY_VALIDATION_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceDispatchSchema: entry?.payload?.sourceDispatchSchema || null,
    sourceOperationPlanSchema: entry?.payload?.sourceOperationPlanSchema || null,
    dryRun: entry?.payload?.dryRun === true,
    applyEnabled: entry?.payload?.applyEnabled === true,
    canApply: entry?.payload?.canApply === true,
    applied: entry?.payload?.applied === true,
    targetCount: entry?.payload?.targetCount ?? entry?.payload?.targets?.length ?? 0,
    validatedTargetCount: entry?.payload?.validatedTargetCount ?? 0,
    applyReadyTargetCount: entry?.payload?.applyReadyTargetCount ?? 0,
    blockedTargetCount: entry?.payload?.blockedTargetCount ?? 0,
    operationCount: entry?.payload?.operationCount ?? 0,
    validatedOperationCount: entry?.payload?.validatedOperationCount ?? 0,
    appliedOperationCount: entry?.payload?.appliedOperationCount ?? 0,
    stateWriteSetCount: entry?.payload?.stateWriteSetCount ?? 0,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0,
    maxBeforeAfterResidualProxy: entry?.payload?.maxBeforeAfterResidualProxy ?? null,
    maxAbsTemperatureDeltaKProxy: entry?.payload?.maxAbsTemperatureDeltaKProxy ?? null
  }]));
}

function getSourceTransferTargetMutationApplyExecutionDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATION_APPLY_EXECUTION_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sequence: entry?.payload?.sequence ?? null,
    reason: entry?.payload?.reason || null,
    sourceApplyValidationSchema: entry?.payload?.sourceApplyValidationSchema || null,
    executionRequested: entry?.payload?.executionRequested === true,
    proxyApplyEnabled: entry?.payload?.proxyApplyEnabled === true,
    targetApplyImplemented: entry?.payload?.targetApplyImplemented === true,
    validationPassed: entry?.payload?.validationPassed === true,
    canExecute: entry?.payload?.canExecute === true,
    dryRun: entry?.payload?.dryRun === true,
    applied: entry?.payload?.applied === true,
    targetCount: entry?.payload?.targetCount ?? entry?.payload?.targets?.length ?? 0,
    validatedTargetCount: entry?.payload?.validatedTargetCount ?? 0,
    executionReadyTargetCount: entry?.payload?.executionReadyTargetCount ?? 0,
    appliedTargetCount: entry?.payload?.appliedTargetCount ?? 0,
    blockedTargetCount: entry?.payload?.blockedTargetCount ?? 0,
    operationCount: entry?.payload?.operationCount ?? 0,
    validatedOperationCount: entry?.payload?.validatedOperationCount ?? 0,
    appliedOperationCount: entry?.payload?.appliedOperationCount ?? 0,
    stateWriteSetCount: entry?.payload?.stateWriteSetCount ?? 0,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0,
    upstreamBlockerCount: entry?.payload?.upstreamBlockerCount ?? entry?.payload?.upstreamBlockers?.length ?? 0,
    maxBeforeAfterResidualProxy: entry?.payload?.maxBeforeAfterResidualProxy ?? null
  }]));
}

function getSourceTransferTargetSourceIntakeDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_SOURCE_INTAKE_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceApplyExecutionSchema: entry?.payload?.sourceApplyExecutionSchema || null,
    sourceApplyExecutionStatus: entry?.payload?.sourceApplyExecutionStatus || null,
    sourceApplyExecutionSequence: entry?.payload?.sourceApplyExecutionSequence ?? null,
    active: entry?.payload?.active === true,
    targetCount: entry?.payload?.targetCount ?? entry?.payload?.targets?.length ?? 0,
    activeTargetCount: entry?.payload?.activeTargetCount ?? 0,
    operationCount: entry?.payload?.operationCount ?? 0,
    appliedOperationCount: entry?.payload?.appliedOperationCount ?? 0,
    totalHeatRateWProxy: entry?.payload?.totalHeatRateWProxy ?? null,
    totalSpeciesRateCountPerSProxy: entry?.payload?.totalSpeciesRateCountPerSProxy ?? null,
    maxTemperatureDeltaKProxy: entry?.payload?.maxTemperatureDeltaKProxy ?? null,
    maxPhaseDriveDeltaProxy: entry?.payload?.maxPhaseDriveDeltaProxy ?? null,
    maxThermalDrive: entry?.payload?.maxThermalDrive ?? null,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getSourceTransferTargetSourceResponseDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_SOURCE_RESPONSE_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceIntakeSchema: entry?.payload?.sourceIntakeSchema || null,
    sourceIntakeStatus: entry?.payload?.sourceIntakeStatus || null,
    sourceApplyExecutionSequence: entry?.payload?.sourceApplyExecutionSequence ?? null,
    active: entry?.payload?.active === true,
    targetCount: entry?.payload?.targetCount ?? entry?.payload?.targets?.length ?? 0,
    activeTargetCount: entry?.payload?.activeTargetCount ?? 0,
    respondedTargetCount: entry?.payload?.respondedTargetCount ?? 0,
    pendingTargetCount: entry?.payload?.pendingTargetCount ?? 0,
    totalIntakeThermalDrive: entry?.payload?.totalIntakeThermalDrive ?? null,
    totalResponseThermalDrive: entry?.payload?.totalResponseThermalDrive ?? null,
    maxResponseThermalDrive: entry?.payload?.maxResponseThermalDrive ?? null,
    totalHeatFluxResponseProxy: entry?.payload?.totalHeatFluxResponseProxy ?? null,
    maxTemperatureK: entry?.payload?.maxTemperatureK ?? null,
    maxPhaseResponseProxy: entry?.payload?.maxPhaseResponseProxy ?? null,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getSourceTransferTargetSourceReconciliationDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_SOURCE_RECONCILIATION_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceIntakeSchema: entry?.payload?.sourceIntakeSchema || null,
    targetResponseSchema: entry?.payload?.targetResponseSchema || null,
    sourceApplyExecutionSequence: entry?.payload?.sourceApplyExecutionSequence ?? null,
    active: entry?.payload?.active === true,
    targetCount: entry?.payload?.targetCount ?? entry?.payload?.targets?.length ?? 0,
    activeTargetCount: entry?.payload?.activeTargetCount ?? 0,
    reconciledTargetCount: entry?.payload?.reconciledTargetCount ?? 0,
    pendingTargetCount: entry?.payload?.pendingTargetCount ?? 0,
    sequenceMismatchCount: entry?.payload?.sequenceMismatchCount ?? 0,
    totalIntakeThermalDrive: entry?.payload?.totalIntakeThermalDrive ?? null,
    totalResponseThermalDrive: entry?.payload?.totalResponseThermalDrive ?? null,
    unacknowledgedThermalDrive: entry?.payload?.unacknowledgedThermalDrive ?? null,
    totalHeatRateWProxy: entry?.payload?.totalHeatRateWProxy ?? null,
    totalHeatFluxResponseProxy: entry?.payload?.totalHeatFluxResponseProxy ?? null,
    reconciliationResidualProxy: entry?.payload?.reconciliationResidualProxy ?? null,
    residualPassed: entry?.payload?.residualPassed === true,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getConservativeSourceBufferDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(CONSERVATIVE_SOURCE_BUFFER_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceEquationSchema: entry?.payload?.sourceEquationSchema || null,
    sourceIntakeSchema: entry?.payload?.sourceIntakeSchema || null,
    targetReconciliationSchema: entry?.payload?.targetReconciliationSchema || null,
    sourceApplyExecutionSequence: entry?.payload?.sourceApplyExecutionSequence ?? null,
    active: entry?.payload?.active === true,
    targetCount: entry?.payload?.targetCount ?? entry?.payload?.targets?.length ?? 0,
    activeTargetCount: entry?.payload?.activeTargetCount ?? 0,
    dispatchableTargetCount: entry?.payload?.dispatchableTargetCount ?? 0,
    reconciledTargetCount: entry?.payload?.reconciledTargetCount ?? 0,
    pendingTargetCount: entry?.payload?.pendingTargetCount ?? 0,
    sourceTermCount: entry?.payload?.sourceTermCount ?? 0,
    bufferStrideFloats: entry?.payload?.bufferStrideFloats ?? 0,
    totalHeatRateWProxy: entry?.payload?.totalHeatRateWProxy ?? null,
    totalSpeciesRateCountPerSProxy: entry?.payload?.totalSpeciesRateCountPerSProxy ?? null,
    sourceBufferResidualProxy: entry?.payload?.sourceBufferResidualProxy ?? null,
    unacknowledgedThermalDrive: entry?.payload?.unacknowledgedThermalDrive ?? null,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getSourceBufferApplicationDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_BUFFER_APPLICATION_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceBufferSchema: entry?.payload?.sourceBufferSchema || null,
    sourceBufferStatus: entry?.payload?.sourceBufferStatus || null,
    sourceApplyExecutionSequence: entry?.payload?.sourceApplyExecutionSequence ?? null,
    targetCount: entry?.payload?.targetCount ?? 0,
    appliedTargetCount: entry?.payload?.appliedTargetCount ?? 0,
    appliedFieldCount: entry?.payload?.appliedFieldCount ?? 0,
    sourceTermCount: entry?.payload?.sourceTermCount ?? 0,
    thermalDrive: entry?.payload?.thermalDrive ?? null,
    residual: entry?.payload?.residual ?? null,
    maxDelta: entry?.payload?.maxDelta ?? null,
    reactiveSchema: entry?.payload?.reactive?.schema || null,
    reactiveApplied: entry?.payload?.reactive?.applied === true,
    sphSchema: entry?.payload?.sph?.schema || null,
    sphApplied: entry?.payload?.sph?.applied === true
  }]));
}

function getSourceBufferAcceptanceDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_BUFFER_ACCEPTANCE_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceBufferSchema: entry?.payload?.sourceBufferSchema || null,
    sourceBufferApplicationAggregateSchema: entry?.payload?.sourceBufferApplicationAggregateSchema || null,
    sourceApplyExecutionSequence: entry?.payload?.sourceApplyExecutionSequence ?? null,
    canMutateProxy: entry?.payload?.canMutateProxy === true,
    scientificMutationReady: entry?.payload?.scientificMutationReady === true,
    targetCount: entry?.payload?.targetCount ?? 0,
    acceptedTargetCount: entry?.payload?.acceptedTargetCount ?? 0,
    blockedTargetCount: entry?.payload?.blockedTargetCount ?? 0,
    missingTargetCount: entry?.payload?.missingTargetCount ?? 0,
    appliedFieldCount: entry?.payload?.appliedFieldCount ?? 0,
    finiteFieldDeltaCount: entry?.payload?.finiteFieldDeltaCount ?? 0,
    sourceTermCount: entry?.payload?.sourceTermCount ?? 0,
    expectedSourceTermCount: entry?.payload?.expectedSourceTermCount ?? 0,
    maxApplicationResidualProxy: entry?.payload?.maxApplicationResidualProxy ?? null,
    maxAbsFieldDeltaProxy: entry?.payload?.maxAbsFieldDeltaProxy ?? null,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getSourceBufferWritebackValidationDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SOURCE_BUFFER_WRITEBACK_VALIDATION_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceBufferSchema: entry?.payload?.sourceBufferSchema || null,
    sourceBufferApplicationAggregateSchema: entry?.payload?.sourceBufferApplicationAggregateSchema || null,
    sourceBufferAcceptanceSchema: entry?.payload?.sourceBufferAcceptanceSchema || null,
    sourceApplyExecutionSequence: entry?.payload?.sourceApplyExecutionSequence ?? null,
    canWritebackProxy: entry?.payload?.canWritebackProxy === true,
    validatedProxyWriteback: entry?.payload?.validatedProxyWriteback === true,
    scientificWritebackReady: entry?.payload?.scientificWritebackReady === true,
    targetCount: entry?.payload?.targetCount ?? 0,
    observedTargetCount: entry?.payload?.observedTargetCount ?? 0,
    validatedTargetCount: entry?.payload?.validatedTargetCount ?? 0,
    blockedTargetCount: entry?.payload?.blockedTargetCount ?? 0,
    fieldDeltaCoveredTargetCount: entry?.payload?.fieldDeltaCoveredTargetCount ?? 0,
    acceptedTargetCount: entry?.payload?.acceptedTargetCount ?? 0,
    appliedFieldCount: entry?.payload?.appliedFieldCount ?? 0,
    finiteFieldDeltaCount: entry?.payload?.finiteFieldDeltaCount ?? 0,
    sourceTermCount: entry?.payload?.sourceTermCount ?? 0,
    expectedSourceTermCount: entry?.payload?.expectedSourceTermCount ?? 0,
    maxWritebackResidualProxy: entry?.payload?.maxWritebackResidualProxy ?? null,
    maxAbsFieldDeltaProxy: entry?.payload?.maxAbsFieldDeltaProxy ?? null,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getTargetBufferReplayValidationDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(TARGET_BUFFER_REPLAY_VALIDATION_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceBufferApplicationAggregateSchema: entry?.payload?.sourceBufferApplicationAggregateSchema || null,
    sourceBufferWritebackValidationSchema: entry?.payload?.sourceBufferWritebackValidationSchema || null,
    sourceApplyExecutionSequence: entry?.payload?.sourceApplyExecutionSequence ?? null,
    canReplayProxy: entry?.payload?.canReplayProxy === true,
    scientificReplayReady: entry?.payload?.scientificReplayReady === true,
    targetCount: entry?.payload?.targetCount ?? 0,
    replayedTargetCount: entry?.payload?.replayedTargetCount ?? 0,
    blockedTargetCount: entry?.payload?.blockedTargetCount ?? 0,
    snapshotTargetCount: entry?.payload?.snapshotTargetCount ?? 0,
    applicationReportCount: entry?.payload?.applicationReportCount ?? 0,
    applicationFieldCount: entry?.payload?.applicationFieldCount ?? 0,
    replayedFieldCount: entry?.payload?.replayedFieldCount ?? 0,
    missingFieldCount: entry?.payload?.missingFieldCount ?? 0,
    maxReplayResidualProxy: entry?.payload?.maxReplayResidualProxy ?? null,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getTargetBufferMutationAuditDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(TARGET_BUFFER_MUTATION_AUDIT_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceTargetBufferReplayValidationSchema: entry?.payload?.sourceTargetBufferReplayValidationSchema || null,
    sourceBufferApplicationAggregateSchema: entry?.payload?.sourceBufferApplicationAggregateSchema || null,
    sourceBufferWritebackValidationSchema: entry?.payload?.sourceBufferWritebackValidationSchema || null,
    sourceApplyExecutionSequence: entry?.payload?.sourceApplyExecutionSequence ?? null,
    mutationAudited: entry?.payload?.mutationAudited === true,
    canMutateProxy: entry?.payload?.canMutateProxy === true,
    canQueueWorkerWrite: entry?.payload?.canQueueWorkerWrite === true,
    workerWriteReady: entry?.payload?.workerWriteReady === true,
    scientificMutationReady: entry?.payload?.scientificMutationReady === true,
    mutationApplied: entry?.payload?.mutationApplied === true,
    targetCount: entry?.payload?.targetCount ?? 0,
    readyTargetCount: entry?.payload?.readyTargetCount ?? 0,
    blockedTargetCount: entry?.payload?.blockedTargetCount ?? 0,
    replayValidatedTargetCount: entry?.payload?.replayValidatedTargetCount ?? 0,
    replayBlockedTargetCount: entry?.payload?.replayBlockedTargetCount ?? 0,
    writeIntentCount: entry?.payload?.writeIntentCount ?? 0,
    readyWriteIntentCount: entry?.payload?.readyWriteIntentCount ?? 0,
    blockedWriteIntentCount: entry?.payload?.blockedWriteIntentCount ?? 0,
    queuedWriteIntentCount: entry?.payload?.queuedWriteIntentCount ?? 0,
    appliedWriteIntentCount: entry?.payload?.appliedWriteIntentCount ?? 0,
    maxMutationAuditResidualProxy: entry?.payload?.maxMutationAuditResidualProxy ?? null,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getTargetBufferWorkerWriteQueueDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(TARGET_BUFFER_WORKER_WRITE_QUEUE_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceTargetBufferMutationAuditSchema: entry?.payload?.sourceTargetBufferMutationAuditSchema || null,
    sourceTargetBufferReplayValidationSchema: entry?.payload?.sourceTargetBufferReplayValidationSchema || null,
    sourceBufferApplicationAggregateSchema: entry?.payload?.sourceBufferApplicationAggregateSchema || null,
    sourceBufferWritebackValidationSchema: entry?.payload?.sourceBufferWritebackValidationSchema || null,
    sourceApplyExecutionSequence: entry?.payload?.sourceApplyExecutionSequence ?? null,
    queuePlanned: entry?.payload?.queuePlanned === true,
    canPlanWorkerWrite: entry?.payload?.canPlanWorkerWrite === true,
    canQueueWorkerWrite: entry?.payload?.canQueueWorkerWrite === true,
    workerWriteReady: entry?.payload?.workerWriteReady === true,
    scientificMutationReady: entry?.payload?.scientificMutationReady === true,
    queued: entry?.payload?.queued === true,
    dispatched: entry?.payload?.dispatched === true,
    applied: entry?.payload?.applied === true,
    targetBatchCount: entry?.payload?.targetBatchCount ?? 0,
    queueReadyBatchCount: entry?.payload?.queueReadyBatchCount ?? 0,
    queueBlockedBatchCount: entry?.payload?.queueBlockedBatchCount ?? 0,
    writeIntentCount: entry?.payload?.writeIntentCount ?? 0,
    queueReadyWriteIntentCount: entry?.payload?.queueReadyWriteIntentCount ?? 0,
    blockedWriteIntentCount: entry?.payload?.blockedWriteIntentCount ?? 0,
    queuedWriteIntentCount: entry?.payload?.queuedWriteIntentCount ?? 0,
    dispatchedWriteIntentCount: entry?.payload?.dispatchedWriteIntentCount ?? 0,
    appliedWriteIntentCount: entry?.payload?.appliedWriteIntentCount ?? 0,
    estimatedPackedFloatCount: entry?.payload?.estimatedPackedFloatCount ?? 0,
    maxQueueResidualProxy: entry?.payload?.maxQueueResidualProxy ?? null,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getTargetBufferWorkerWriteExecutionDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(TARGET_BUFFER_WORKER_WRITE_EXECUTION_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceTargetBufferWorkerWriteQueueSchema: entry?.payload?.sourceTargetBufferWorkerWriteQueueSchema || null,
    sourceTargetBufferMutationAuditSchema: entry?.payload?.sourceTargetBufferMutationAuditSchema || null,
    sourceTargetBufferReplayValidationSchema: entry?.payload?.sourceTargetBufferReplayValidationSchema || null,
    sourceBufferApplicationAggregateSchema: entry?.payload?.sourceBufferApplicationAggregateSchema || null,
    sourceBufferWritebackValidationSchema: entry?.payload?.sourceBufferWritebackValidationSchema || null,
    sourceApplyExecutionSequence: entry?.payload?.sourceApplyExecutionSequence ?? null,
    executionRequested: entry?.payload?.executionRequested === true,
    proxyWorkerWriteEnabled: entry?.payload?.proxyWorkerWriteEnabled === true,
    targetWorkerWriteImplemented: entry?.payload?.targetWorkerWriteImplemented === true,
    canPlanWorkerWrite: entry?.payload?.canPlanWorkerWrite === true,
    canExecuteProxy: entry?.payload?.canExecuteProxy === true,
    workerWriteExecuted: entry?.payload?.workerWriteExecuted === true,
    workerWriteReady: entry?.payload?.workerWriteReady === true,
    scientificMutationReady: entry?.payload?.scientificMutationReady === true,
    queued: entry?.payload?.queued === true,
    dispatched: entry?.payload?.dispatched === true,
    applied: entry?.payload?.applied === true,
    targetBatchCount: entry?.payload?.targetBatchCount ?? 0,
    queueReadyBatchCount: entry?.payload?.queueReadyBatchCount ?? 0,
    appliedBatchCount: entry?.payload?.appliedBatchCount ?? 0,
    blockedBatchCount: entry?.payload?.blockedBatchCount ?? 0,
    writeIntentCount: entry?.payload?.writeIntentCount ?? 0,
    queuedWriteIntentCount: entry?.payload?.queuedWriteIntentCount ?? 0,
    dispatchedWriteIntentCount: entry?.payload?.dispatchedWriteIntentCount ?? 0,
    appliedWriteIntentCount: entry?.payload?.appliedWriteIntentCount ?? 0,
    skippedWriteIntentCount: entry?.payload?.skippedWriteIntentCount ?? 0,
    stateWriteSetCount: entry?.payload?.stateWriteSetCount ?? 0,
    maxWorkerWriteResidualProxy: entry?.payload?.maxWorkerWriteResidualProxy ?? null,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getTargetBufferWorkerWriteVerificationDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(TARGET_BUFFER_WORKER_WRITE_VERIFICATION_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    sourceTargetBufferWorkerWriteExecutionSchema: entry?.payload?.sourceTargetBufferWorkerWriteExecutionSchema || null,
    sourceTargetBufferWorkerWriteQueueSchema: entry?.payload?.sourceTargetBufferWorkerWriteQueueSchema || null,
    sourceTargetBufferMutationAuditSchema: entry?.payload?.sourceTargetBufferMutationAuditSchema || null,
    sourceTargetBufferReplayValidationSchema: entry?.payload?.sourceTargetBufferReplayValidationSchema || null,
    sourceBufferApplicationAggregateSchema: entry?.payload?.sourceBufferApplicationAggregateSchema || null,
    sourceBufferWritebackValidationSchema: entry?.payload?.sourceBufferWritebackValidationSchema || null,
    sourceApplyExecutionSequence: entry?.payload?.sourceApplyExecutionSequence ?? null,
    executionSequence: entry?.payload?.executionSequence ?? null,
    executionApplied: entry?.payload?.executionApplied === true,
    workerWriteExecuted: entry?.payload?.workerWriteExecuted === true,
    canVerifyProxy: entry?.payload?.canVerifyProxy === true,
    verified: entry?.payload?.verified === true,
    scientificMutationReady: entry?.payload?.scientificMutationReady === true,
    targetBatchCount: entry?.payload?.targetBatchCount ?? entry?.payload?.targetCount ?? 0,
    targetCount: entry?.payload?.targetCount ?? entry?.payload?.targetBatchCount ?? 0,
    verifiedTargetCount: entry?.payload?.verifiedTargetCount ?? 0,
    blockedTargetCount: entry?.payload?.blockedTargetCount ?? 0,
    snapshotTargetCount: entry?.payload?.snapshotTargetCount ?? 0,
    fieldWriteCount: entry?.payload?.fieldWriteCount ?? 0,
    appliedFieldWriteCount: entry?.payload?.appliedFieldWriteCount ?? 0,
    verifiedFieldWriteCount: entry?.payload?.verifiedFieldWriteCount ?? 0,
    skippedFieldWriteCount: entry?.payload?.skippedFieldWriteCount ?? 0,
    missingFieldWriteCount: entry?.payload?.missingFieldWriteCount ?? 0,
    mismatchedFieldWriteCount: entry?.payload?.mismatchedFieldWriteCount ?? 0,
    maxVerificationResidualProxy: entry?.payload?.maxVerificationResidualProxy ?? null,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getScientificInvariantGateDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SCIENTIFIC_INVARIANT_GATE_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    scientificMutationReady: entry?.payload?.scientificMutationReady === true,
    canPromoteProxy: entry?.payload?.canPromoteProxy === true,
    promotionBlocked: entry?.payload?.promotionBlocked !== false,
    targetCount: entry?.payload?.targetCount ?? 0,
    requiredScopeCount: entry?.payload?.requiredScopeCount ?? 0,
    proxySatisfiedScopeCount: entry?.payload?.proxySatisfiedScopeCount ?? 0,
    authoritativeSatisfiedScopeCount: entry?.payload?.authoritativeSatisfiedScopeCount ?? 0,
    blockedScopeCount: entry?.payload?.blockedScopeCount ?? 0,
    missingAuthoritativeScopeCount: entry?.payload?.missingAuthoritativeScopeCount ?? 0,
    workerWriteVerified: entry?.payload?.workerWriteVerified === true,
    replayVerified: entry?.payload?.replayVerified === true,
    writebackValidated: entry?.payload?.writebackValidated === true,
    sourceBufferAccepted: entry?.payload?.sourceBufferAccepted === true,
    invariantCoverageProxy: entry?.payload?.invariantCoverageProxy === true,
    unitMetadataProxy: entry?.payload?.unitMetadataProxy === true,
    provenanceReplayProxy: entry?.payload?.provenanceReplayProxy === true,
    maxVerificationResidualProxy: entry?.payload?.maxVerificationResidualProxy ?? null,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getScientificReadinessManifestDeltaSummary() {
  const deltas = stateManager.getWarmDeltas(SCIENTIFIC_READINESS_MANIFEST_DELTA_SCOPE);
  return Object.fromEntries(Object.entries(deltas).map(([key, entry]) => [key, {
    version: entry?.version ?? null,
    ts: entry?.ts ?? null,
    schema: entry?.payload?.schema || null,
    status: entry?.payload?.status || null,
    mode: entry?.payload?.mode || null,
    timeSeconds: entry?.payload?.timeSeconds ?? null,
    scientificMutationReady: entry?.payload?.scientificMutationReady === true,
    canPromoteProxy: entry?.payload?.canPromoteProxy === true,
    manifestComplete: entry?.payload?.manifestComplete === true,
    requiredArtifactCount: entry?.payload?.requiredArtifactCount ?? 0,
    proxySatisfiedArtifactCount: entry?.payload?.proxySatisfiedArtifactCount ?? 0,
    authoritativeReadyArtifactCount: entry?.payload?.authoritativeReadyArtifactCount ?? 0,
    blockedArtifactCount: entry?.payload?.blockedArtifactCount ?? 0,
    missingAuthoritativeArtifactCount: entry?.payload?.missingAuthoritativeArtifactCount ?? 0,
    nextRequiredArtifactId: entry?.payload?.nextRequiredArtifactId || null,
    nextRequiredArtifactCategory: entry?.payload?.nextRequiredArtifactCategory || null,
    blockerCount: entry?.payload?.blockerCount ?? entry?.payload?.blockers?.length ?? 0
  }]));
}

function getSolverRegistrySummary() {
  const solvers = computeManager.listSolvers();
  return {
    schema: MULTISCALE_SOLVER_DESCRIPTORS_SCHEMA,
    solverCount: solvers.length,
    solvers: solvers.map((solver) => ({
      id: solver.id,
      kind: solver.kind,
      version: solver.version,
      inputFields: solver.inputFields.map((field) => field.name),
      outputFields: solver.outputFields.map((field) => field.name),
      conservedFields: solver.conservedFields.map((field) => field.name),
      warmDelta: solver.warmDelta,
      hasExecutor: solver.hasExecutor
    }))
  };
}

function animate() {
  requestAnimationFrame(animate);
  renderFrame += 1;
  const frameStart = performance.now();
  const phaseDurations = {};
  let phaseMark = frameStart;
  const markPhase = (name) => {
    const now = performance.now();
    phaseDurations[name] = (phaseDurations[name] || 0) + Math.max(0, now - phaseMark);
    phaseMark = now;
    return now;
  };
  if (tourEnabled && model.time - lastTourStep > 4.5) {
    lastTourStep = model.time;
    setLayer((model.layerIndex + 1) % SCALE_LAYERS.length);
  }
  markPhase('tour');
  setEnvironmentFromUi();
  markPhase('environment');
  refreshRenderBudget({ reason: 'frame' });
  markPhase('renderBudget');
  if (!readbackBudgetReport
    || readbackBudgetReport.changed
    || renderFrame - lastFrameReadbackBudgetRefreshFrame >= FRAME_READBACK_BUDGET_INTERVAL_FRAMES) {
    refreshReadbackBudget({ reason: 'frame' });
  }
  markPhase('readbackBudget');
  stepCompute();
  markPhase('computeStep');
  stepSolverWorkers();
  markPhase('solverSchedule');
  scene.update();
  markPhase('sceneUpdate');
  maybePublishStatePacket({ reason: 'frame' });
  markPhase('statePublish');
  maybeRunMolecularBufferWriterAuto();
  markPhase('bufferWriterAuto');
  solverGovernorStatus = solverGovernor.update({
    frameMs: performance.now() - frameStart,
    solverRuntime: solverRuntimeStatus,
    computeStatus
  });
  markPhase('solverGovernor');
  const currentSolverLoad = refreshSolverLoadReport();
  const currentMemoryPressure = memoryPressureReport || refreshMemoryPressure();
  const currentSolverAdmission = refreshSolverAdmissionReport({
    solverLoad: currentSolverLoad,
    memoryPressure: currentMemoryPressure
  });
  markPhase('loadAdmission');
  runtimeScalerStatus = runtimeScaler.update({
    frameMs: performance.now() - frameStart,
    computeStatus,
    solverRuntime: solverRuntimeStatus,
    solverGovernor: solverGovernorStatus,
    solverLoad: currentSolverLoad,
    solverAdmission: currentSolverAdmission,
    memoryPressure: currentMemoryPressure,
    solverQualityMultiplier,
    simBusy: solversBusy()
  });
  applyRuntimeScalerRequest(runtimeScalerStatus.lastRequest);
  markPhase('runtimeScaler');
  // The updated scaler feeds the next frame's pre-budget pass. Applying it here
  // would resize renderer buffers after the scene has already rendered.
  markPhase('postBudget');
  maybeRenderReadout(performance.now());
  markPhase('readout');
  framePhaseTimingReport = createFramePhaseTimingReport({
    frame: renderFrame,
    totalMs: performance.now() - frameStart,
    phases: phaseDurations,
    previous: framePhaseTimingReport,
    reason: 'animation-frame'
  });
}

window.addEventListener('resize', () => scene.resize());

slider.addEventListener('input', (event) => setLayer(Number(event.target.value)));
document.querySelector('#zoom-out').addEventListener('click', () => setLayer(model.layerIndex - 1));
document.querySelector('#zoom-in').addEventListener('click', () => setLayer(model.layerIndex + 1));
document.querySelector('#rupture').addEventListener('click', () => model.triggerRupture());
autoTour.addEventListener('click', () => {
  tourEnabled = !tourEnabled;
  autoTour.classList.toggle('active', tourEnabled);
  autoTour.setAttribute('aria-pressed', String(tourEnabled));
  lastTourStep = model.time;
});
qualityDown.addEventListener('click', () => scaleSolverQuality(-1));
qualityUp.addEventListener('click', () => scaleSolverQuality(1));
scenarioMagnetar?.addEventListener('click', () => applyScenarioPreset('magnetar'));
hudFocus?.addEventListener('click', () => {
  applyHudMode('focus');
  renderReadout();
});
hudTelemetry?.addEventListener('click', () => {
  applyHudMode('telemetry');
  renderReadout();
});
atomAdd?.addEventListener('click', () => {
  addAtomsToMolecularComposition(atomSymbol?.value || 'H', atomCount?.value || 1);
});
atomWater?.addEventListener('click', () => resetMolecularDynamicsRuntime({ H: 10, O: 5 }, {
  reason: 'preset-water',
  manual: true
}));
atomCarbonDioxide?.addEventListener('click', () => resetMolecularDynamicsRuntime({ C: 4, O: 8 }, {
  reason: 'preset-co2',
  manual: true
}));
atomAir?.addEventListener('click', () => resetMolecularDynamicsRuntime({ N: 24, O: 8, C: 1 }, {
  reason: 'preset-air',
  manual: true
}));
atomReset?.addEventListener('click', () => resetMolecularDynamicsRuntime(
  createDefaultMolecularComposition(solverBudget.molecularDynamics.atomCount),
  {
    reason: 'preset-default',
    manual: false
  }
));
molecularBufferApply?.addEventListener('click', () => executeMolecularBufferWriter({
  reason: 'ui-buffer-apply',
  force: true
}));
molecularBufferAuto?.addEventListener('click', () => {
  setMolecularBufferWriterAuto(!molecularBufferWriterAutoEnabled);
  renderReadout();
});
orbitalApply?.addEventListener('click', () => applyQuantumOrbitalControls({ reason: 'ui-apply-orbital' }));
updateMolecularBufferWriterControls();

window.__multiscaleDemo = {
  setLayer,
  setLayerById(id) {
    model.setLayerById(id);
    return setLayer(model.layerIndex);
  },
  setEnvironment(values) {
    const environment = model.setEnvironment(normalizeEnvironmentValues(values));
    syncEnvironmentControls();
    renderReadout();
    return environment;
  },
  applyScenarioPreset(id = 'magnetar', options = {}) {
    return applyScenarioPreset(id, options);
  },
  ingestScenarioCalibrationSummary(summary = {}, options = {}) {
    return ingestScenarioCalibrationSummary(summary, options);
  },
  ingestScenarioClosureSummary(summary = {}, options = {}) {
    return ingestScenarioClosureSummary(summary, options);
  },
  ingestScenarioClosureModuleProbeReport(report = {}, options = {}) {
    return ingestScenarioClosureModuleProbeReport(report, options);
  },
  ingestScenarioTransferManifest(manifest = {}, options = {}) {
    return ingestScenarioTransferManifest(manifest, options);
  },
  ingestScenarioRuntimeEvidenceManifest(manifest = {}, options = {}) {
    return ingestScenarioRuntimeEvidenceManifest(manifest, options);
  },
  refreshScenarioRuntimeEvidence(options = {}) {
    return refreshScenarioRuntimeEvidence(options);
  },
  getScenarioRuntimeEvidenceRequirements(options = {}) {
    return getScenarioRuntimeEvidenceRequirements(options);
  },
  createScenarioBoundedProxyRuntimeEvidenceManifest(options = {}) {
    return createScenarioBoundedProxyRuntimeEvidenceManifest(options);
  },
  refreshScenarioBoundedProxyRuntimeEvidence(options = {}) {
    return refreshScenarioBoundedProxyRuntimeEvidence(options);
  },
  refreshBoundedProxyRuntimeEvidence(options = {}) {
    return refreshScenarioBoundedProxyRuntimeEvidence(options);
  },
  createScenarioCalibratedRuntimeEvidenceManifest(options = {}) {
    return createScenarioCalibratedRuntimeEvidenceManifest(options);
  },
  refreshScenarioCalibratedRuntimeEvidence(options = {}) {
    return refreshScenarioCalibratedRuntimeEvidence(options);
  },
  refreshCalibratedRuntimeEvidence(options = {}) {
    return refreshScenarioCalibratedRuntimeEvidence(options);
  },
  probeScenarioClosureModule(artifact = {}, options = {}) {
    return probeScenarioClosureModule(artifact, options);
  },
  probeScenarioClosureHostRuntime(artifact = {}, options = {}) {
    return probeScenarioClosureModule(artifact, { ...options, dryInstantiateHostRuntime: true });
  },
  executeScenarioClosureHostRuntime(artifact = {}, options = {}) {
    return probeScenarioClosureModule(artifact, { ...options, dryInstantiateHostRuntime: true, executeHostRuntime: true });
  },
  executeScenarioClosureHostRuntimeProbe(artifact = {}, options = {}) {
    return probeScenarioClosureModule(artifact, { ...options, dryInstantiateHostRuntime: true, executeHostRuntime: true });
  },
  probeScenarioClosureHostRuntimeProbe(artifact = {}, options = {}) {
    return probeScenarioClosureModule(artifact, { ...options, dryInstantiateHostRuntime: true });
  },
  probeScenarioClosureModuleProbe(artifact = {}, options = {}) {
    return probeScenarioClosureModule(artifact, options);
  },
  getScenarioHandoffReadiness() {
    return cloneJson(model.getScenario().handoffReadiness || null);
  },
  ingestUlgArtifactForScenario(artifact = {}, options = {}) {
    return ingestUlgArtifactForScenario(artifact, options);
  },
  executeUlgClosureArtifactForScenario(artifact = {}, options = {}) {
    return executeUlgClosureArtifactForScenario(artifact, options);
  },
  executeUlgClosureArtifactForScenarioProbe(artifact = {}, options = {}) {
    return executeUlgClosureArtifactForScenario(artifact, options);
  },
  applyUlgDemoHandoffForScenario(handoff = {}, options = {}) {
    return applyUlgDemoHandoffForScenario(handoff, options);
  },
  ingestUlgDemoHandoffForScenario(handoff = {}, options = {}) {
    return applyUlgDemoHandoffForScenario(handoff, options);
  },
  applyUlgDemoHandoffAndRefreshCalibratedRuntimeEvidence(handoff = {}, options = {}) {
    return applyUlgDemoHandoffAndRefreshCalibratedRuntimeEvidence(handoff, options);
  },
  runUlgMagnetarCalibratedDemo(handoff = {}, options = {}) {
    return applyUlgDemoHandoffAndRefreshCalibratedRuntimeEvidence(handoff, options);
  },
  normalizeUlgDemoHandoff(handoff = {}, options = {}) {
    return cloneJson(normalizePeerComputeUlgDemoHandoff(handoff, options));
  },
  createUlgHandoffServiceEnvelope(handoff = {}, options = {}) {
    return cloneJson(createPeerComputeUlgHandoffServiceEnvelope(handoff, {
      origin: window.location.origin,
      url: window.location.href,
      ...options
    }));
  },
  normalizeUlgHandoffServiceEnvelope(handoff = {}, options = {}) {
    return cloneJson(createPeerComputeUlgHandoffServiceEnvelope(handoff, {
      origin: window.location.origin,
      url: window.location.href,
      ...options
    }));
  },
  createUlgHandoffServiceDispatchPlan(handoff = {}, options = {}) {
    const envelope = handoff?.schema === 'peercompute.ulg.handoff-service-envelope.v0'
      ? handoff
      : createPeerComputeUlgHandoffServiceEnvelope(handoff, {
        origin: window.location.origin,
        url: window.location.href,
        ...options
      });
    return cloneJson(createPeerComputeUlgHandoffServiceDispatchPlan(envelope, options));
  },
  runUlgDispatchServiceAdapterProbe(handoff = {}, options = {}) {
    return runUlgDispatchServiceAdapterProbe(handoff, options);
  },
  executeUlgHandoffDispatchServices(handoff = {}, options = {}) {
    return runUlgDispatchServiceAdapterProbe(handoff, options);
  },
  getUlgDispatchServiceWorkerModules() {
    return cloneJson(ULG_DISPATCH_WORKER_MODULES);
  },
  summarizeUlgArtifact(artifact = {}, artifactKind = 'quantum-response') {
    return cloneJson(summarizePeerComputeUlgArtifact(artifactKind, artifact));
  },
  getScenario() {
    return cloneJson(model.getScenario());
  },
  getScenarioPresets() {
    return cloneJson(MULTISCALE_SCENARIO_PRESETS);
  },
  triggerRupture() {
    model.triggerRupture();
    renderReadout();
    return createUiPacket();
  },
  getPacket() {
    return createUiPacket();
  },
  getPacketPreview() {
    return formatPacketPreview(createUiPacket());
  },
  runMolecularBufferWriter(options = {}) {
    return cloneJson(executeMolecularBufferWriter({
      reason: options.reason || 'demo-api-buffer-writer',
      force: options.force === true,
      prepareSource: options.prepareSource !== false
    }));
  },
  setMolecularBufferWriterAuto(enabled = true, options = {}) {
    return cloneJson(setMolecularBufferWriterAuto(enabled === true, options));
  },
  getMolecularBufferWriterRuntime() {
    return cloneJson(updateMolecularBufferWriterControls());
  },
  setHudMode(mode = 'focus') {
    applyHudMode(mode);
    renderReadout();
    return cloneJson({
      mode: hudMode,
      packetPreviewSchema: PACKET_PREVIEW_SCHEMA,
      runtimeDebugThrottleMs: RUNTIME_DEBUG_RENDER_INTERVAL_MS,
      runtimeDebugRenderCount,
      layerReadoutRowCount: lastLayerReadoutRowCount,
      layerReadoutTotalRowCount: lastLayerReadoutTotalRowCount,
      outputPanels: getOutputPanelVisibility()
    });
  },
  getHudMode() {
    return cloneJson({
      mode: hudMode,
      packetPreviewSchema: PACKET_PREVIEW_SCHEMA,
      runtimeDebugThrottleMs: RUNTIME_DEBUG_RENDER_INTERVAL_MS,
      runtimeDebugRenderCount,
      layerReadoutRowCount: lastLayerReadoutRowCount,
      layerReadoutTotalRowCount: lastLayerReadoutTotalRowCount,
      outputPanels: getOutputPanelVisibility()
    });
  },
  getOutputPanels() {
    return cloneJson({
      schema: 'peercompute.multiscale.output-panel-visibility.v0',
      panels: getOutputPanelVisibility()
    });
  },
  setOutputPanelVisibility(id, visible = true) {
    return cloneJson({
      schema: 'peercompute.multiscale.output-panel-visibility.v0',
      ...applyOutputPanelVisibility(id, visible)
    });
  },
  setOutputPanelsVisibility(visibility = true) {
    return cloneJson({
      schema: 'peercompute.multiscale.output-panel-visibility.v0',
      ...applyOutputPanelsVisibilityState(visibility)
    });
  },
  toggleOutputPanel(id) {
    return cloneJson({
      schema: 'peercompute.multiscale.output-panel-visibility.v0',
      ...toggleOutputPanelVisibility(id)
    });
  },
  getComputeDeltas() {
    return stateManager.getWarmDeltas(COMPUTE_DELTA_SCOPE);
  },
  getSolverDeltas() {
    return stateManager.getWarmDeltas(SOLVER_DELTA_SCOPE);
  },
  getClosureDeltas() {
    return stateManager.getWarmDeltas(CLOSURE_DELTA_SCOPE);
  },
  getConservationDeltas() {
    return stateManager.getWarmDeltas(CONSERVATION_DELTA_SCOPE);
  },
  getCouplingDeltas() {
    return stateManager.getWarmDeltas(COUPLING_DELTA_SCOPE);
  },
  getLawGraphDeltas() {
    createModelPacketWithRuntimeEvidence({ publishLawGraph: true });
    return stateManager.getWarmDeltas(LAW_GRAPH_DELTA_SCOPE);
  },
  getUlgRuntimeDeltas() {
    createModelPacketWithRuntimeEvidence({ publishLawGraph: true });
    return stateManager.getWarmDeltas(ULG_RUNTIME_DELTA_SCOPE);
  },
  getUlgRuntime() {
    const packet = createModelPacketWithRuntimeEvidence({ publishLawGraph: true });
    return cloneJson(packet.ulgRuntime || model.state.ulgRuntime || null);
  },
  getUlgRuntimeExecutionDeltas() {
    return stateManager.getWarmDeltas(ULG_RUNTIME_EXECUTION_DELTA_SCOPE);
  },
  getUlgRuntimeExecution() {
    return cloneJson(model.state.ulgRuntimeExecution || solverRuntimeStatus.ulgRuntime?.lastResult || null);
  },
  getUlgRuntimeStateDelta() {
    const execution = model.state.ulgRuntimeExecution || solverRuntimeStatus.ulgRuntime?.lastResult || null;
    return cloneJson(model.state.ulgRuntimeStateDelta || execution?.stateDelta || null);
  },
  getLawGraphUpdatePlan() {
    const packet = createModelPacketWithRuntimeEvidence({ publishLawGraph: true });
    return cloneJson(packet.lawGraph?.updatePlan || null);
  },
  getLawGraphConsistencySolve() {
    const packet = createModelPacketWithRuntimeEvidence({ publishLawGraph: true });
    return cloneJson(packet.lawGraph?.consistencySolve || null);
  },
  getLawGraphProposalAdmission() {
    const packet = createModelPacketWithRuntimeEvidence({ publishLawGraph: true });
    return cloneJson(packet.lawGraph?.proposalAdmission || null);
  },
  getLawGraphDispatchQueue() {
    const packet = createModelPacketWithRuntimeEvidence({ publishLawGraph: true });
    return cloneJson(packet.lawGraph?.dispatchQueue || null);
  },
  getLawGraphSchedulerManifest() {
    const packet = createModelPacketWithRuntimeEvidence({ publishLawGraph: true });
    return cloneJson(packet.lawGraph?.schedulerManifest || null);
  },
  getLawGraphSchedulerExecutionAudit() {
    const packet = createModelPacketWithRuntimeEvidence({ publishLawGraph: true });
    return cloneJson(packet.lawGraph?.schedulerExecutionAudit || null);
  },
  getLawGraphResultAdmission() {
    const packet = createModelPacketWithRuntimeEvidence({ publishLawGraph: true });
    return cloneJson(packet.lawGraph?.resultAdmission || null);
  },
  getLawGraphStateApplicationPreflight() {
    const packet = createModelPacketWithRuntimeEvidence({ publishLawGraph: true });
    return cloneJson(packet.lawGraph?.stateApplicationPreflight || null);
  },
  getSourceSinkBalanceDeltas() {
    return stateManager.getWarmDeltas(SOURCE_SINK_BALANCE_DELTA_SCOPE);
  },
  getSourceTransferDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_DELTA_SCOPE);
  },
  getSourceTransferApplicationDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_APPLICATION_DELTA_SCOPE);
  },
  getSourceTransferTransactionDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_TRANSACTION_DELTA_SCOPE);
  },
  getSourceTransferTargetPreviewDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_PREVIEW_DELTA_SCOPE);
  },
  getSourceTransferTargetMutatorRegistryDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATOR_REGISTRY_DELTA_SCOPE);
  },
  getSourceTransferTargetMutationPreflightDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATION_PREFLIGHT_DELTA_SCOPE);
  },
  getSourceTransferTargetMutationOperationPlanDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATION_OPERATION_PLAN_DELTA_SCOPE);
  },
  getSourceTransferTargetMutationInvariantCheckDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATION_INVARIANT_CHECK_DELTA_SCOPE);
  },
  getSourceTransferTargetMutationCommitDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATION_COMMIT_DELTA_SCOPE);
  },
  getSourceTransferTargetMutationDispatchDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATION_DISPATCH_DELTA_SCOPE);
  },
  getSourceTransferTargetMutationApplyValidationDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATION_APPLY_VALIDATION_DELTA_SCOPE);
  },
  getSourceTransferTargetMutationApplyExecutionDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_MUTATION_APPLY_EXECUTION_DELTA_SCOPE);
  },
  getSourceTransferTargetSourceIntakeDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_SOURCE_INTAKE_DELTA_SCOPE);
  },
  getSourceTransferTargetSourceResponseDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_SOURCE_RESPONSE_DELTA_SCOPE);
  },
  getSourceTransferTargetSourceReconciliationDeltas() {
    return stateManager.getWarmDeltas(SOURCE_TRANSFER_TARGET_SOURCE_RECONCILIATION_DELTA_SCOPE);
  },
  getConservativeSourceBufferDeltas() {
    return stateManager.getWarmDeltas(CONSERVATIVE_SOURCE_BUFFER_DELTA_SCOPE);
  },
  getSourceBufferApplicationDeltas() {
    return stateManager.getWarmDeltas(SOURCE_BUFFER_APPLICATION_DELTA_SCOPE);
  },
  getSourceBufferAcceptanceDeltas() {
    return stateManager.getWarmDeltas(SOURCE_BUFFER_ACCEPTANCE_DELTA_SCOPE);
  },
  getSourceBufferWritebackValidationDeltas() {
    return stateManager.getWarmDeltas(SOURCE_BUFFER_WRITEBACK_VALIDATION_DELTA_SCOPE);
  },
  getTargetBufferReplayValidationDeltas() {
    return stateManager.getWarmDeltas(TARGET_BUFFER_REPLAY_VALIDATION_DELTA_SCOPE);
  },
  getTargetBufferMutationAuditDeltas() {
    return stateManager.getWarmDeltas(TARGET_BUFFER_MUTATION_AUDIT_DELTA_SCOPE);
  },
  getTargetBufferWorkerWriteQueueDeltas() {
    return stateManager.getWarmDeltas(TARGET_BUFFER_WORKER_WRITE_QUEUE_DELTA_SCOPE);
  },
  getTargetBufferWorkerWriteExecutionDeltas() {
    return stateManager.getWarmDeltas(TARGET_BUFFER_WORKER_WRITE_EXECUTION_DELTA_SCOPE);
  },
  getTargetBufferWorkerWriteVerificationDeltas() {
    return stateManager.getWarmDeltas(TARGET_BUFFER_WORKER_WRITE_VERIFICATION_DELTA_SCOPE);
  },
  getScientificInvariantGateDeltas() {
    return stateManager.getWarmDeltas(SCIENTIFIC_INVARIANT_GATE_DELTA_SCOPE);
  },
  getScientificReadinessManifestDeltas() {
    return stateManager.getWarmDeltas(SCIENTIFIC_READINESS_MANIFEST_DELTA_SCOPE);
  },
  configureMolecularTransferApplication(config = {}) {
    const next = model.setMolecularTransferApplicationConfig(config);
    renderReadout();
    return cloneJson(next);
  },
  getMolecularTransferApplicationConfig() {
    return cloneJson(model.getMolecularTransferApplicationConfig());
  },
  configureMolecularTransferTransaction(config = {}) {
    const next = model.setMolecularTransferTransactionConfig(config);
    renderReadout();
    return cloneJson(next);
  },
  getMolecularTransferTransactionConfig() {
    return cloneJson(model.getMolecularTransferTransactionConfig());
  },
  configureMolecularTargetMutationApply(config = {}) {
    const next = model.setMolecularTargetMutationApplyConfig(config);
    renderReadout();
    return cloneJson(next);
  },
  getMolecularTargetMutationApplyConfig() {
    return cloneJson(model.getMolecularTargetMutationApplyConfig());
  },
  configureMolecularTargetBufferWorkerWrite(config = {}) {
    const next = model.setMolecularTargetBufferWorkerWriteConfig(config);
    renderReadout();
    return cloneJson(next);
  },
  getMolecularTargetBufferWorkerWriteConfig() {
    return cloneJson(model.getMolecularTargetBufferWorkerWriteConfig());
  },
  executeMolecularTargetMutationApply(config = {}) {
    if (config?.prepareSource !== false) {
      const warmReport = warmMolecularSourceBufferTargets({
        reason: config.reason || 'demo-api-source-buffer-warm',
        transferApplicationConfig: config.transferApplicationConfig || config.applicationConfig || {},
        transferTransactionConfig: config.transferTransactionConfig || config.transactionConfig || {},
        applyConfig: config
      });
      return cloneJson(warmReport.sourceApplyReport);
    }
    const report = model.executeMolecularTargetMutationApply({
      reason: 'demo-api',
      config
    });
    publishSourceTransferTargetMutationApplyExecutionDelta(report);
    publishSourceTransferTargetSourceIntakeDelta(model.state.molecular.targetSourceIntake);
    publishSourceTransferTargetSourceResponseDelta(model.state.molecular.targetSourceResponse);
    publishSourceTransferTargetSourceReconciliationDelta(model.state.molecular.targetSourceReconciliation);
    publishConservativeSourceBufferDelta(model.state.molecular.conservativeSourceBuffer);
    publishMolecularSourceBufferWarmDeltas();
    renderReadout();
    return cloneJson(report);
  },
  warmMolecularSourceBufferTargets(options = {}) {
    return cloneJson(warmMolecularSourceBufferTargets(options));
  },
  executeMolecularTargetBufferWorkerWrite(config = {}) {
    if (config?.prepareSource !== false) {
      warmMolecularSourceBufferTargets({
        reason: config.reason || 'demo-api-buffer-writer-source-warm',
        transferApplicationConfig: config.transferApplicationConfig || config.applicationConfig || {},
        transferTransactionConfig: config.transferTransactionConfig || config.transactionConfig || {},
        applyConfig: config.applyConfig || {}
      });
    }
    const report = model.executeMolecularTargetBufferWorkerWrite({
      reason: 'demo-api',
      config
    });
    publishTargetBufferWorkerWriteExecutionDelta(report);
    publishCurrentSourceBufferApplicationDelta();
    renderReadout();
    return cloneJson(report);
  },
  resizeSolverWorkloads(overrides = {}) {
    const explicitQuality = Number(overrides.qualityMultiplier);
    const nextOverrides = { ...overrides };
    delete nextOverrides.qualityMultiplier;
    return resizeSolverWorkloads(nextOverrides, {
      qualityMultiplier: Number.isFinite(explicitQuality) ? explicitQuality : solverQualityMultiplier
    });
  },
  scaleSolverQuality(direction = 1) {
    return scaleSolverQuality(Number(direction) >= 0 ? 1 : -1);
  },
  resizeComputeWorkers(targetWorkers) {
    const capabilities = computeManager.resizeWorkers(targetWorkers, { reason: 'demo-api' });
    const computeResize = applyComputeCapacityResize({
      reason: 'demo-api',
      capabilities
    });
    runtimeScalerStatus = runtimeScaler.noteApplied({
      action: 'manual-worker-resize',
      workerTarget: capabilities.targetWorkers ?? targetWorkers,
      ok: true,
      computeResize
    });
    renderReadout();
    return {
      ...capabilities,
      computeResize,
      computeBudget: cloneJson(computeBudget)
    };
  },
  setAutoScale(enabled = true) {
    runtimeScalerStatus = runtimeScaler.setEnabled(enabled !== false);
    renderReadout();
    return cloneJson(runtimeScalerStatus);
  },
  setMolecularComposition(composition = {}) {
    return resetMolecularDynamicsRuntime(composition, {
      reason: 'api-set-composition',
      manual: true
    });
  },
  addMolecularAtoms(symbol = 'H', count = 1) {
    return addAtomsToMolecularComposition(symbol, count);
  },
  getMolecularComposition() {
    return {
      composition: { ...molecularComposition },
      atomCount: countMolecularComposition(molecularComposition),
      manual: molecularCompositionManual,
      label: formatMolecularComposition()
    };
  },
  setQuantumOrbital(values = {}) {
    return applyQuantumOrbitalControls({
      ...values,
      reason: values.reason || 'api-set-quantum-orbital'
    });
  },
  getQuantumOrbital() {
    return cloneJson(model.state.orbital);
  },
  getRuntimeDebug(options = {}) {
    createModelPacketWithRuntimeEvidence({ publishLawGraph: true });
    return cloneJson(createRuntimeDebugSnapshot({
      force: options?.force !== false,
      reason: options?.reason || 'api'
    }));
  },
  refreshReadout(options = {}) {
    renderReadout(getClockMs(), {
      forceRuntimeDebug: options?.forceRuntimeDebug !== false
    });
    return {
      readoutText: layerReadout?.textContent || '',
      runtimeDebugText: runtimeDebugReadout?.textContent || '',
      rowCount: lastLayerReadoutRowCount,
      totalRowCount: lastLayerReadoutTotalRowCount
    };
  },
  getRenderBudget() {
    return cloneJson(renderBudgetReport || refreshRenderBudget({ reason: 'api' }));
  },
  getReadbackBudget() {
    return cloneJson(readbackBudgetReport || refreshReadbackBudget({ reason: 'api' }));
  },
  getSolverSubmissionBudget() {
    return cloneJson(solverSubmissionBudgetReport);
  },
  getStatePublicationBudget() {
    return cloneJson(statePublicationBudgetReport || refreshStatePublicationBudget({ reason: 'api' }));
  },
  getRuntimeDiagnosticsBudget() {
    return cloneJson(runtimeDiagnosticsBudgetReport || refreshRuntimeDiagnosticsBudget({ reason: 'api' }));
  },
  getFramePhaseTiming() {
    return cloneJson(framePhaseTimingReport);
  },
  configureRemotePlacement(config = {}) {
    return configureRemotePlacementRuntime(config);
  },
  runLoopbackRemotePlacementProbe(config = {}) {
    return runLoopbackRemotePlacementProbe(config);
  },
  runLoopbackRemoteSolverPlacementProbe(config = {}) {
    return runLoopbackRemoteSolverPlacementProbe(config);
  },
  runRemoteSolverPlacementProbe(config = {}) {
    return runRemoteSolverPlacementProbe(config);
  },
  getRemotePlacementConfiguration() {
    return cloneJson(remotePlacementConfigurationReport);
  },
  getRemotePeerPlacementPlan() {
    return cloneJson(remotePlacementConfigurationReport?.remotePeerPlacementPlan || remotePeerPlacementPlan || refreshRemotePeerPlacementPlan());
  },
  getRemotePeerReliability() {
    return cloneJson(refreshRemotePeerReliabilityFromTaskPlacement(
      computeManager.getStats?.()?.taskPlacement,
      Date.now()
    ));
  },
  configureRemoteSolverPlacement(config = {}) {
    return configureRemoteSolverPlacementRuntime(config);
  },
  getRemoteSolverPlacementPolicy() {
    return cloneJson(refreshRemoteSolverPlacementPolicy());
  },
  getRemoteSolverPlacementDecisions() {
    return cloneJson(refreshRemoteSolverPlacementDecisions());
  },
  startPeerNetwork(config = {}) {
    return startPeerNetwork(config);
  },
  stopPeerNetwork(config = {}) {
    return stopPeerNetwork(config);
  },
  getPeerNetworkStatus() {
    return cloneJson(refreshNodeKernelStatus());
  },
  getNodeKernelStatus() {
    return cloneJson(refreshNodeKernelStatus());
  },
  getSolverRemapReport() {
    return cloneJson(lastSolverRemapReport);
  },
  getSolverRemapSummary() {
    return cloneJson(compactSolverRemapReport(lastSolverRemapReport));
  },
  getNetVizSession() {
    return cloneJson(createNetVizRuntimeSession(true));
  },
  getState() {
    refreshSolverLoadReport();
    const packet = createModelPacketWithRuntimeEvidence({ publishLawGraph: true });
    const solverDeltas = getSolverDeltaSummary();
    const runtimeDebug = createRuntimeDebugSnapshot({ force: true, reason: 'state' });
    const deltas = getComputeDeltaSummary();
    const closureDeltas = getClosureDeltaSummary();
    const conservationDeltas = getConservationDeltaSummary();
    const couplingDeltas = getCouplingDeltaSummary();
    const lawGraphDeltas = getLawGraphDeltaSummary();
    const ulgRuntimeDeltas = getUlgRuntimeDeltaSummary();
    const ulgRuntimeExecutionDeltas = getUlgRuntimeExecutionDeltaSummary();
    const sourceSinkBalanceDeltas = getSourceSinkBalanceDeltaSummary();
    const sourceTransferDeltas = getSourceTransferDeltaSummary();
    const sourceTransferApplicationDeltas = getSourceTransferApplicationDeltaSummary();
    const sourceTransferTransactionDeltas = getSourceTransferTransactionDeltaSummary();
    const sourceTransferTargetPreviewDeltas = getSourceTransferTargetPreviewDeltaSummary();
    const sourceTransferTargetMutatorRegistryDeltas = getSourceTransferTargetMutatorRegistryDeltaSummary();
    const sourceTransferTargetMutationPreflightDeltas = getSourceTransferTargetMutationPreflightDeltaSummary();
    const sourceTransferTargetMutationOperationPlanDeltas = getSourceTransferTargetMutationOperationPlanDeltaSummary();
    const sourceTransferTargetMutationInvariantCheckDeltas = getSourceTransferTargetMutationInvariantCheckDeltaSummary();
    const sourceTransferTargetMutationCommitDeltas = getSourceTransferTargetMutationCommitDeltaSummary();
    const sourceTransferTargetMutationDispatchDeltas = getSourceTransferTargetMutationDispatchDeltaSummary();
    const sourceTransferTargetMutationApplyValidationDeltas = getSourceTransferTargetMutationApplyValidationDeltaSummary();
    const sourceTransferTargetMutationApplyExecutionDeltas = getSourceTransferTargetMutationApplyExecutionDeltaSummary();
    const sourceTransferTargetSourceIntakeDeltas = getSourceTransferTargetSourceIntakeDeltaSummary();
    const sourceTransferTargetSourceResponseDeltas = getSourceTransferTargetSourceResponseDeltaSummary();
    const sourceTransferTargetSourceReconciliationDeltas = getSourceTransferTargetSourceReconciliationDeltaSummary();
    const conservativeSourceBufferDeltas = getConservativeSourceBufferDeltaSummary();
    const sourceBufferApplicationDeltas = getSourceBufferApplicationDeltaSummary();
    const sourceBufferAcceptanceDeltas = getSourceBufferAcceptanceDeltaSummary();
    const sourceBufferWritebackValidationDeltas = getSourceBufferWritebackValidationDeltaSummary();
    const targetBufferReplayValidationDeltas = getTargetBufferReplayValidationDeltaSummary();
    const targetBufferMutationAuditDeltas = getTargetBufferMutationAuditDeltaSummary();
    const targetBufferWorkerWriteQueueDeltas = getTargetBufferWorkerWriteQueueDeltaSummary();
    const targetBufferWorkerWriteExecutionDeltas = getTargetBufferWorkerWriteExecutionDeltaSummary();
    const targetBufferWorkerWriteVerificationDeltas = getTargetBufferWorkerWriteVerificationDeltaSummary();
    const scientificInvariantGateDeltas = getScientificInvariantGateDeltaSummary();
    const scientificReadinessManifestDeltas = getScientificReadinessManifestDeltaSummary();
    const crossScaleCoupling = runtimeDebug.crossScaleCoupling;
    const lawGraph = model.state.lawGraph || packet.lawGraph || runtimeDebug.lawGraph || null;
    const ulgRuntime = model.state.ulgRuntime || packet.ulgRuntime || runtimeDebug.ulgRuntime || null;
    const ulgRuntimeExecution = model.state.ulgRuntimeExecution || packet.ulgRuntimeExecution || runtimeDebug.ulgRuntimeExecution || null;
    const ulgRuntimeStateDelta = model.state.ulgRuntimeStateDelta || packet.ulgRuntimeStateDelta || ulgRuntimeExecution?.stateDelta || null;
    return {
      layerIndex: model.layerIndex,
      layer: { ...model.activeLayer },
      environment: { ...model.environment },
      scenario: model.getScenario(),
      scenarioRuntimeEvidenceRequirements: model.getScenarioRuntimeEvidenceRequirements(),
      state: cloneJson(model.state),
      compute: { ...computeStatus },
      computeBudget: cloneJson(computeBudget),
      memoryPressure: cloneJson(memoryPressureReport || refreshMemoryPressure()),
      networkCapacity: cloneJson(networkCapacityReport || refreshNetworkCapacity()),
      placementPlan: cloneJson(placementPlanReport || refreshPlacementPlan()),
      remotePlacementReadiness: cloneJson(remotePlacementReadinessReport || refreshRemotePlacementReadiness()),
      remotePlacementConfiguration: cloneJson(remotePlacementConfigurationReport),
      remotePeerSelection: cloneJson(remotePeerSelectionReport || refreshRemotePeerSelectionReport()),
      remotePeerPlacementPlan: cloneJson(remotePlacementConfigurationReport?.remotePeerPlacementPlan || remotePeerPlacementPlan || refreshRemotePeerPlacementPlan()),
      remotePeerReliability: cloneJson(remotePeerReliabilityReport),
      remoteSolverPlacementPolicy: cloneJson(remoteSolverPlacementPolicyReport || refreshRemoteSolverPlacementPolicy()),
      remoteSolverPlacementDecisions: cloneJson(refreshRemoteSolverPlacementDecisions()),
      nodeKernel: cloneJson(refreshNodeKernelStatus()),
      solverAdmission: cloneJson(solverAdmissionReport || refreshSolverAdmissionReport()),
      workerUtilization: cloneJson(runtimeDebug.workerUtilization),
      taskPlacement: cloneJson(runtimeDebug.taskPlacement),
      computeCapacityResize: lastComputeCapacityResize ? cloneJson(lastComputeCapacityResize) : null,
      computeCapacityResizePending: !!computeCapacityResizePromise && !!lastComputeCapacityResize?.pending,
      molecularComposition: {
        composition: { ...molecularComposition },
        atomCount: countMolecularComposition(molecularComposition),
        manual: molecularCompositionManual,
        label: formatMolecularComposition()
      },
      molecularTransferApplicationConfig: model.getMolecularTransferApplicationConfig(),
      molecularTransferTransactionConfig: model.getMolecularTransferTransactionConfig(),
      molecularTargetMutationApplyConfig: model.getMolecularTargetMutationApplyConfig(),
      molecularTargetBufferWorkerWriteConfig: model.getMolecularTargetBufferWorkerWriteConfig(),
      solverQuality: {
        multiplier: solverQualityMultiplier,
        solverWorkloadMultipliers: { ...solverWorkloadMultipliers }
      },
      hud: {
        mode: hudMode,
        packetPreviewSchema: PACKET_PREVIEW_SCHEMA,
        runtimeDebugThrottleMs: RUNTIME_DEBUG_RENDER_INTERVAL_MS,
        runtimeDebugRenderCount,
        layerReadoutRowCount: lastLayerReadoutRowCount,
        layerReadoutTotalRowCount: lastLayerReadoutTotalRowCount,
        outputPanels: getOutputPanelVisibility()
      },
      solverBudget: cloneJson(solverBudget),
      solverGovernor: cloneJson(solverGovernorStatus),
      lowerScaleRefinement: cloneJson(lowerScaleRefinementReport),
      solverSubmissionBudget: cloneJson(solverSubmissionBudgetReport),
      visualReference: cloneJson(scene.getVisualReferenceStatus()),
      statePublicationBudget: cloneJson(statePublicationBudgetReport || refreshStatePublicationBudget({ reason: 'state' })),
      runtimeDiagnosticsBudget: cloneJson(runtimeDiagnosticsBudgetReport || refreshRuntimeDiagnosticsBudget({ reason: 'state' })),
      framePhaseTiming: cloneJson(framePhaseTimingReport),
      renderBudget: cloneJson(renderBudgetReport || refreshRenderBudget({ reason: 'state' })),
      readbackBudget: cloneJson(readbackBudgetReport || refreshReadbackBudget({ reason: 'state' })),
      runtimeScaler: cloneJson(runtimeScalerStatus),
      solverLoad: cloneJson(solverLoadReport),
      solverRemap: cloneJson(lastSolverRemapReport),
      solverRemapSummary: cloneJson(compactSolverRemapReport(lastSolverRemapReport)),
      runtimeDebug: cloneJson(runtimeDebug),
      crossScaleCoupling: cloneJson(crossScaleCoupling),
      lawGraph: cloneJson(lawGraph),
      lawGraphUpdatePlan: cloneJson(lawGraph?.updatePlan || null),
      lawGraphConsistencySolve: cloneJson(lawGraph?.consistencySolve || null),
      lawGraphProposalAdmission: cloneJson(lawGraph?.proposalAdmission || null),
      lawGraphDispatchQueue: cloneJson(lawGraph?.dispatchQueue || null),
      lawGraphSchedulerManifest: cloneJson(lawGraph?.schedulerManifest || null),
      lawGraphSchedulerExecutionAudit: cloneJson(lawGraph?.schedulerExecutionAudit || null),
      lawGraphResultAdmission: cloneJson(lawGraph?.resultAdmission || null),
      lawGraphStateApplicationPreflight: cloneJson(lawGraph?.stateApplicationPreflight || null),
      ulgRuntime: cloneJson(ulgRuntime),
      ulgRuntimeExecution: cloneJson(ulgRuntimeExecution),
      ulgRuntimeStateDelta: cloneJson(ulgRuntimeStateDelta),
      sourceBufferAcceptance: cloneJson(packet.sourceBufferAcceptance || null),
      sourceBufferWritebackValidation: cloneJson(packet.sourceBufferWritebackValidation || null),
      targetBufferReplayValidation: cloneJson(packet.targetBufferReplayValidation || null),
      targetBufferMutationAudit: cloneJson(packet.targetBufferMutationAudit || null),
      targetBufferWorkerWriteQueue: cloneJson(packet.targetBufferWorkerWriteQueue || null),
      targetBufferWorkerWriteExecution: cloneJson(packet.targetBufferWorkerWriteExecution || null),
      targetBufferWorkerWriteVerification: cloneJson(packet.targetBufferWorkerWriteVerification || null),
      molecularScientificInvariantGate: cloneJson(packet.molecularScientificInvariantGate || null),
      molecularScientificReadinessManifest: cloneJson(packet.molecularScientificReadinessManifest || null),
      netVizSession: cloneJson(createNetVizRuntimeSession(true)),
      solverRegistry: getSolverRegistrySummary(),
      solverRuntime: cloneJson(updateSolverRuntimeStatus()),
      nbodyOverlay: scene.getNBodyOverlayStatus(),
      maxwellOverlay: scene.getMaxwellOverlayStatus(),
      cosmologyExpansionOverlay: scene.getCosmologyExpansionOverlayStatus(),
      molecularDynamicsOverlay: scene.getMolecularDynamicsOverlayStatus(),
      hydroAtmosphereOverlay: scene.getHydroAtmosphereOverlayStatus(),
      radiationOpacityOverlay: scene.getRadiationOpacityOverlayStatus(),
      stellarFusionOverlay: scene.getStellarFusionOverlayStatus(),
      magnetospherePlasmaOverlay: scene.getMagnetospherePlasmaOverlayStatus(),
      picPlasmaPatchOverlay: scene.getPicPlasmaPatchOverlayStatus(),
      relativisticCorrectionOverlay: scene.getRelativisticCorrectionOverlayStatus(),
      combustionPlumeOverlay: scene.getCombustionPlumeOverlayStatus(),
      sphMaterialOverlay: scene.getSphMaterialOverlayStatus(),
      solverState: {
        scope: SOLVER_DELTA_SCOPE,
        warmDeltaCount: Object.keys(solverDeltas).length,
        deltas: solverDeltas
      },
      closureState: {
        scope: CLOSURE_DELTA_SCOPE,
        warmDeltaCount: Object.keys(closureDeltas).length,
        deltas: closureDeltas
      },
      conservationState: {
        scope: CONSERVATION_DELTA_SCOPE,
        warmDeltaCount: Object.keys(conservationDeltas).length,
        deltas: conservationDeltas
      },
      couplingState: {
        scope: COUPLING_DELTA_SCOPE,
        warmDeltaCount: Object.keys(couplingDeltas).length,
        deltas: couplingDeltas
      },
      lawGraphState: {
        scope: LAW_GRAPH_DELTA_SCOPE,
        warmDeltaCount: Object.keys(lawGraphDeltas).length,
        deltas: lawGraphDeltas
      },
      ulgRuntimeState: {
        scope: ULG_RUNTIME_DELTA_SCOPE,
        warmDeltaCount: Object.keys(ulgRuntimeDeltas).length,
        deltas: ulgRuntimeDeltas
      },
      ulgRuntimeExecutionState: {
        scope: ULG_RUNTIME_EXECUTION_DELTA_SCOPE,
        warmDeltaCount: Object.keys(ulgRuntimeExecutionDeltas).length,
        deltas: ulgRuntimeExecutionDeltas
      },
      sourceSinkBalanceState: {
        scope: SOURCE_SINK_BALANCE_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceSinkBalanceDeltas).length,
        deltas: sourceSinkBalanceDeltas
      },
      sourceTransferState: {
        scope: SOURCE_TRANSFER_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferDeltas).length,
        deltas: sourceTransferDeltas
      },
      sourceTransferApplicationState: {
        scope: SOURCE_TRANSFER_APPLICATION_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferApplicationDeltas).length,
        deltas: sourceTransferApplicationDeltas
      },
      sourceTransferTransactionState: {
        scope: SOURCE_TRANSFER_TRANSACTION_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferTransactionDeltas).length,
        deltas: sourceTransferTransactionDeltas
      },
      sourceTransferTargetPreviewState: {
        scope: SOURCE_TRANSFER_TARGET_PREVIEW_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferTargetPreviewDeltas).length,
        deltas: sourceTransferTargetPreviewDeltas
      },
      sourceTransferTargetMutatorRegistryState: {
        scope: SOURCE_TRANSFER_TARGET_MUTATOR_REGISTRY_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferTargetMutatorRegistryDeltas).length,
        deltas: sourceTransferTargetMutatorRegistryDeltas
      },
      sourceTransferTargetMutationPreflightState: {
        scope: SOURCE_TRANSFER_TARGET_MUTATION_PREFLIGHT_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferTargetMutationPreflightDeltas).length,
        deltas: sourceTransferTargetMutationPreflightDeltas
      },
      sourceTransferTargetMutationOperationPlanState: {
        scope: SOURCE_TRANSFER_TARGET_MUTATION_OPERATION_PLAN_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferTargetMutationOperationPlanDeltas).length,
        deltas: sourceTransferTargetMutationOperationPlanDeltas
      },
      sourceTransferTargetMutationInvariantCheckState: {
        scope: SOURCE_TRANSFER_TARGET_MUTATION_INVARIANT_CHECK_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferTargetMutationInvariantCheckDeltas).length,
        deltas: sourceTransferTargetMutationInvariantCheckDeltas
      },
      sourceTransferTargetMutationCommitState: {
        scope: SOURCE_TRANSFER_TARGET_MUTATION_COMMIT_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferTargetMutationCommitDeltas).length,
        deltas: sourceTransferTargetMutationCommitDeltas
      },
      sourceTransferTargetMutationDispatchState: {
        scope: SOURCE_TRANSFER_TARGET_MUTATION_DISPATCH_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferTargetMutationDispatchDeltas).length,
        deltas: sourceTransferTargetMutationDispatchDeltas
      },
      sourceTransferTargetMutationApplyValidationState: {
        scope: SOURCE_TRANSFER_TARGET_MUTATION_APPLY_VALIDATION_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferTargetMutationApplyValidationDeltas).length,
        deltas: sourceTransferTargetMutationApplyValidationDeltas
      },
      sourceTransferTargetMutationApplyExecutionState: {
        scope: SOURCE_TRANSFER_TARGET_MUTATION_APPLY_EXECUTION_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferTargetMutationApplyExecutionDeltas).length,
        deltas: sourceTransferTargetMutationApplyExecutionDeltas
      },
      sourceTransferTargetSourceIntakeState: {
        scope: SOURCE_TRANSFER_TARGET_SOURCE_INTAKE_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferTargetSourceIntakeDeltas).length,
        deltas: sourceTransferTargetSourceIntakeDeltas
      },
      sourceTransferTargetSourceResponseState: {
        scope: SOURCE_TRANSFER_TARGET_SOURCE_RESPONSE_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferTargetSourceResponseDeltas).length,
        deltas: sourceTransferTargetSourceResponseDeltas
      },
      sourceTransferTargetSourceReconciliationState: {
        scope: SOURCE_TRANSFER_TARGET_SOURCE_RECONCILIATION_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceTransferTargetSourceReconciliationDeltas).length,
        deltas: sourceTransferTargetSourceReconciliationDeltas
      },
      conservativeSourceBufferState: {
        scope: CONSERVATIVE_SOURCE_BUFFER_DELTA_SCOPE,
        warmDeltaCount: Object.keys(conservativeSourceBufferDeltas).length,
        deltas: conservativeSourceBufferDeltas
      },
      sourceBufferApplicationState: {
        scope: SOURCE_BUFFER_APPLICATION_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceBufferApplicationDeltas).length,
        deltas: sourceBufferApplicationDeltas
      },
      sourceBufferAcceptanceState: {
        scope: SOURCE_BUFFER_ACCEPTANCE_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceBufferAcceptanceDeltas).length,
        deltas: sourceBufferAcceptanceDeltas
      },
      sourceBufferWritebackValidationState: {
        scope: SOURCE_BUFFER_WRITEBACK_VALIDATION_DELTA_SCOPE,
        warmDeltaCount: Object.keys(sourceBufferWritebackValidationDeltas).length,
        deltas: sourceBufferWritebackValidationDeltas
      },
      targetBufferReplayValidationState: {
        scope: TARGET_BUFFER_REPLAY_VALIDATION_DELTA_SCOPE,
        warmDeltaCount: Object.keys(targetBufferReplayValidationDeltas).length,
        deltas: targetBufferReplayValidationDeltas
      },
      targetBufferMutationAuditState: {
        scope: TARGET_BUFFER_MUTATION_AUDIT_DELTA_SCOPE,
        warmDeltaCount: Object.keys(targetBufferMutationAuditDeltas).length,
        deltas: targetBufferMutationAuditDeltas
      },
      targetBufferWorkerWriteQueueState: {
        scope: TARGET_BUFFER_WORKER_WRITE_QUEUE_DELTA_SCOPE,
        warmDeltaCount: Object.keys(targetBufferWorkerWriteQueueDeltas).length,
        deltas: targetBufferWorkerWriteQueueDeltas
      },
      targetBufferWorkerWriteExecutionState: {
        scope: TARGET_BUFFER_WORKER_WRITE_EXECUTION_DELTA_SCOPE,
        warmDeltaCount: Object.keys(targetBufferWorkerWriteExecutionDeltas).length,
        deltas: targetBufferWorkerWriteExecutionDeltas
      },
      targetBufferWorkerWriteVerificationState: {
        scope: TARGET_BUFFER_WORKER_WRITE_VERIFICATION_DELTA_SCOPE,
        warmDeltaCount: Object.keys(targetBufferWorkerWriteVerificationDeltas).length,
        deltas: targetBufferWorkerWriteVerificationDeltas
      },
      scientificInvariantGateState: {
        scope: SCIENTIFIC_INVARIANT_GATE_DELTA_SCOPE,
        warmDeltaCount: Object.keys(scientificInvariantGateDeltas).length,
        deltas: scientificInvariantGateDeltas
      },
      scientificReadinessManifestState: {
        scope: SCIENTIFIC_READINESS_MANIFEST_DELTA_SCOPE,
        warmDeltaCount: Object.keys(scientificReadinessManifestDeltas).length,
        deltas: scientificReadinessManifestDeltas
      },
      computeState: {
        scope: COMPUTE_DELTA_SCOPE,
        warmDeltaCount: Object.keys(deltas).length,
        deltas
      },
      snapshot: scene.getOverlayStatus()
    };
  }
};

window.addEventListener('pagehide', () => {
  persistRemotePeerReliabilityReport({ reason: 'pagehide' });
  stopNetVizRuntimeSessionBroadcast();
  if (multiscaleNodeKernel || multiscaleNodeKernelStartPromise) {
    stopPeerNetwork({ reason: 'pagehide' }).catch(() => {});
  }
});
createScaleButtons();
initializeMolecularControls();
initializeQuantumOrbitalControls();
initializeOutputPanelToggles();
applyHudMode(readInitialHudMode(initialSearch));
const initialScenarioPreset = readInitialScenarioPreset(initialSearch);
if (initialScenarioPreset) {
  applyScenarioPreset(initialScenarioPreset);
} else {
  setLayer(0);
  syncScenarioControls();
}
startNetVizRuntimeSessionBroadcast();
if (peerNetworkRuntimeOverrides.enablePeerNetwork === true) {
  startPeerNetwork().catch((error) => {
    console.warn('[Multiscale] Peer network start failed:', error);
  });
}
compute.initialize().then((status) => {
  computeStatus = status;
  if (computeOverrides.enableLoopbackRemotePlacement === true
    || String(computeOverrides.remotePlacementExecutorMode || '').toLowerCase() === 'loopback') {
    configureRemotePlacementRuntime({
      enableRemotePlacement: true,
      enableLoopbackRemotePlacement: true,
      remotePlacementPeerId: computeOverrides.remotePlacementPeerId || 'loopback-peer',
      remotePlacementMode: computeOverrides.remotePlacementMode || 'peer',
      remotePlacementTimeoutMs: computeOverrides.remotePlacementTimeoutMs || 30000,
      metadataSigner: true,
      signerId: 'multiscale-loopback-metadata-signer',
      quorumValidator: {
        validationId: 'multiscale-loopback-quorum',
        minReplicaCount: 1,
        minMatchingReplicas: 1
      },
      remoteResultVerification: true
    });
  }
  renderReadout();
  computeManager.refreshGpuLimits?.()
    .then((profile) => {
      if (profile?.gpuLimits?.maxBufferSize && profile.gpuLimitsSource === 'adapter') {
        applyComputeCapacityResize({
          reason: 'gpu-limits-probe',
          capabilities: computeManager.getCapabilities?.()
        });
      }
    })
    .catch(() => {});
}).catch((error) => {
  lastComputeStepError = error instanceof Error ? error.message : String(error);
  refreshComputeStatus();
  renderReadout();
});
animate();
