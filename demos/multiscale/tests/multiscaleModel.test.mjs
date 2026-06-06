import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  COMPUTE_REMOTE_PLACEMENT_PROVENANCE_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA,
  COMPUTE_REMOTE_PLACEMENT_VERIFICATION_SCHEMA,
  COMPUTE_TASK_PACKET_SCHEMA,
  ComputeManager
} from '../../../peercompute/src/peercompute/computeManager/ComputeManager.js';
import { StateManager } from '../../../peercompute/src/peercompute/stateManager/StateManager.js';
import { MultiscaleModel, SCALE_LAYERS } from '../src/simulation/multiscaleModel.js';
import {
  MULTISCALE_COMPUTE_RESIZE_CONSERVATION_SCHEMA,
  MULTISCALE_CONSERVATION_AUDIT_SCHEMA,
  createConservationAudit
} from '../src/simulation/conservationAudit.js';
import {
  MULTISCALE_CROSS_SCALE_COUPLING_SCHEMA,
  createCrossScaleCouplingReport
} from '../src/simulation/crossScaleCoupling.js';
import {
  MULTISCALE_LAW_GRAPH_CONSISTENCY_SCHEMA,
  MULTISCALE_LAW_GRAPH_CONSISTENCY_SOLVE_SCHEMA,
  MULTISCALE_LAW_GRAPH_DISPATCH_QUEUE_SCHEMA,
  MULTISCALE_LAW_GRAPH_PROPOSAL_ADMISSION_SCHEMA,
  MULTISCALE_LAW_GRAPH_RESULT_ADMISSION_SCHEMA,
  MULTISCALE_LAW_GRAPH_SCHEDULER_EXECUTION_AUDIT_SCHEMA,
  MULTISCALE_LAW_GRAPH_SCHEDULER_MANIFEST_SCHEMA,
  MULTISCALE_LAW_GRAPH_STATE_APPLICATION_PREFLIGHT_SCHEMA,
  MULTISCALE_LAW_GRAPH_UPDATE_PLAN_SCHEMA,
  createLawGraphConsistencyReport
} from '../src/simulation/lawGraph.js';
import {
  MULTISCALE_FIELD_ADAPTER_PLAN_SCHEMA,
  MULTISCALE_FIELD_COMPATIBILITY_REPORT_SCHEMA,
  MULTISCALE_FIELD_METADATA_REPORT_SCHEMA,
  MULTISCALE_FIELD_TRANSFER_REPORT_SCHEMA,
  createFieldAdapterPlanReport,
  createFieldTransferReport,
  evaluateFieldCompatibility
} from '../src/simulation/fieldMetadata.js';
import {
  QUANTUM_ORBITAL_CLOSURE_SCHEMA,
  QUANTUM_ORBITAL_EIGEN_RESIDUAL_SCHEMA,
  QUANTUM_ORBITAL_FINITE_GRID_SCHEMA,
  QUANTUM_ORBITAL_MODEL_ID,
  QUANTUM_ORBITAL_RADIAL_EIGENSTATE_SCHEMA,
  QUANTUM_ORBITAL_WAVEFUNCTION_EVOLUTION_SCHEMA,
  buildElectronConfiguration,
  createQuantumOrbitalClosure,
  summarizeElectronConfiguration
} from '../src/simulation/quantumOrbitalClosure.js';
import {
  QUANTUM_MATERIAL_FORCE_SURFACE_SCHEMA,
  QUANTUM_MATERIAL_LAW_GRAPH_FRAGMENT_SCHEMA,
  QUANTUM_MATERIAL_POTENTIAL_MODEL_ID,
  QUANTUM_MATERIAL_POTENTIAL_SCHEMA,
  QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA,
  QUANTUM_STATISTICAL_CLOSURE_SCHEMA,
  QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA,
  QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA,
  createQuantumMaterialPotential
} from '../src/simulation/quantumMaterialPotential.js';
import {
  ULG_KERNEL_PASS_SPEC_SCHEMA,
  ULG_PASS_DAG_SCHEMA,
  ULG_RUNTIME_MANIFEST_SCHEMA,
  createKernelPassSpec
} from '../src/simulation/ulgRuntime.js';
import {
  WEBGPU_PARTICLE_COUNT,
  WEBGPU_PARTICLE_FLOATS,
  WEBGPU_PARTICLE_RECORD_BYTES,
  WEBGPU_SNAPSHOT_POSITION_FLOATS,
  WEBGPU_SNAPSHOT_RECORD_FLOATS,
  WEBGPU_COMPUTE_STATUS_SCHEMA,
  WEBGPU_COMPUTE_SNAPSHOT_SCHEMA,
  WebGpuLadderCompute,
  applyParticleRecordResizeConservation,
  buildInitialParticleState,
  buildParticleStateFromRecords,
  buildParticleStateFromPositions,
  extractParticleRecords,
  extractPositions,
  summarizeParticleRecordResize
} from '../src/compute/webgpuLadderCompute.js';
import {
  PEERCOMPUTE_LADDER_RUNTIME_SCHEMA,
  PeerComputeLadderRuntime
} from '../src/compute/peercomputeLadderRuntime.js';
import {
  SCALE_COMPUTE_POOL_SCHEMA,
  ScaleComputeOrchestrator
} from '../src/compute/scaleComputeOrchestrator.js';
import {
  MULTISCALE_COMPUTE_BUDGET_SCHEMA,
  MULTISCALE_SOLVER_ADMISSION_SCHEMA,
  MULTISCALE_SOLVER_BUDGET_SCHEMA,
  createAdmittedMultiscaleSolverBudget,
  createMultiscaleComputeBudget,
  createMultiscaleSolverBudget,
  readComputeOverrides
} from '../src/compute/adaptiveComputeBudget.js';
import {
  MULTISCALE_SOLVER_DESCRIPTORS,
  MULTISCALE_SOLVER_DESCRIPTORS_SCHEMA,
  createMultiscaleSolverDescriptors
} from '../src/compute/solverWorkerDescriptors.js';
import {
  AdaptiveSolverGovernor,
  MULTISCALE_SOLVER_ACTIVE_LAYER_POLICY,
  MULTISCALE_SOLVER_CADENCE_POLICY,
  MULTISCALE_SOLVER_GOVERNOR_SCHEMA,
  SOLVER_LAYER_AFFINITY
} from '../src/compute/solverRuntimeGovernor.js';
import {
  MULTISCALE_LOWER_SCALE_REFINEMENT_POLICY,
  MULTISCALE_LOWER_SCALE_REFINEMENT_SCHEMA,
  createLowerScaleRefinementScheduler,
  shouldRunLowerScaleRefinementSolver
} from '../src/compute/lowerScaleRefinementScheduler.js';
import {
  MULTISCALE_SOLVER_SUBMISSION_BUDGET_POLICY,
  MULTISCALE_SOLVER_SUBMISSION_BUDGET_SCHEMA,
  createSolverSubmissionBudget,
  shouldSubmitSolver
} from '../src/compute/solverSubmissionBudget.js';
import {
  MULTISCALE_RENDER_BUDGET_POLICY,
  MULTISCALE_RENDER_BUDGET_SCHEMA,
  createMultiscaleRenderBudget
} from '../src/visualization/renderBudget.js';
import {
  MULTISCALE_VISUAL_REFERENCE_SCHEMA,
  SCALE_VISUAL_REFERENCE_POLICY,
  getScaleVisualReference
} from '../src/visualization/multiscaleScene.js';
import {
  MULTISCALE_OVERLAY_DATA_UPDATE_POLICY,
  MULTISCALE_OVERLAY_DATA_UPDATE_SCHEMA,
  createOverlayDataUpdateLedger,
  markOverlayAttributeUpdate,
  resetOverlayDataUpdateLedger,
  snapshotOverlayDataUpdateLedger
} from '../src/visualization/overlayBufferUpdate.js';
import {
  MULTISCALE_READBACK_BUDGET_POLICY,
  MULTISCALE_READBACK_BUDGET_SCHEMA,
  createMultiscaleReadbackBudget
} from '../src/compute/readbackBudget.js';
import {
  MULTISCALE_STATE_PUBLICATION_BUDGET_POLICY,
  MULTISCALE_STATE_PUBLICATION_BUDGET_SCHEMA,
  createStatePublicationBudget
} from '../src/compute/statePublicationBudget.js';
import {
  MULTISCALE_RUNTIME_DIAGNOSTICS_BUDGET_POLICY,
  MULTISCALE_RUNTIME_DIAGNOSTICS_BUDGET_SCHEMA,
  createRuntimeDiagnosticsBudget
} from '../src/compute/runtimeDiagnosticsBudget.js';
import {
  AdaptiveRuntimeScaler,
  MULTISCALE_MEMORY_PRESSURE_SCHEMA,
  MULTISCALE_NETWORK_CAPACITY_SCHEMA,
  MULTISCALE_RUNTIME_SCALER_SCHEMA,
  MULTISCALE_SOLVER_LOAD_SCHEMA,
  MULTISCALE_WORKER_UTILIZATION_PRESSURE_SCHEMA,
  createMemoryPressureReport,
  createNetworkCapacityReport,
  createSolverAdmissionReport,
  createSolverLoadReport
} from '../src/compute/adaptiveRuntimeScaler.js';
import {
  MULTISCALE_PLACEMENT_PLAN_SCHEMA,
  MULTISCALE_REMOTE_PLACEMENT_READINESS_SCHEMA,
  createPlacementPlan,
  createRemotePlacementReadiness
} from '../src/compute/placementPlan.js';
import {
  MULTISCALE_REMOTE_SOLVER_PLACEMENT_DECISIONS_SCHEMA,
  MULTISCALE_REMOTE_SOLVER_PLACEMENT_POLICY_SCHEMA,
  createRemoteSolverPlacementDecisionReport,
  createRemoteSolverPlacementPolicy,
  promoteSolverPlacementHint,
  readRemoteSolverPlacementOverrides
} from '../src/compute/remoteSolverPlacement.js';
import {
  MULTISCALE_REMOTE_PEER_PLACEMENT_PLAN_SCHEMA,
  MULTISCALE_REMOTE_PEER_SELECTION_SCHEMA,
  createRemotePeerPlacementPlan,
  createRemotePeerSelectionReport,
  extractPeerIdFromMultiaddr
} from '../src/compute/remotePeerSelection.js';
import {
  MULTISCALE_REMOTE_PEER_RELIABILITY_SCHEMA,
  MULTISCALE_REMOTE_PEER_RELIABILITY_STORE_SCHEMA,
  createRemotePeerReliabilityScope,
  createRemotePeerReliabilityStorageKey,
  createRemotePeerReliabilityReport,
  getRemotePeerReliability,
  loadRemotePeerReliabilityReportFromStorage,
  saveRemotePeerReliabilityReportToStorage,
  updateRemotePeerReliabilityFromPlacement
} from '../src/compute/remotePeerReliability.js';
import {
  MULTISCALE_LOOPBACK_REMOTE_PLACEMENT_SCHEMA,
  createLoopbackRemotePlacementExecutor
} from '../src/compute/loopbackRemotePlacement.js';
import {
  loadRelayConfig,
  normalizeBootstrapPeers,
  readPeerNetworkOverrides
} from '../src/peercompute/relayConfig.js';
import {
  SOLVER_STATE_REMAP_SCHEMA,
  carrySolverTimeline,
  copyRecordFields,
  remapGridFields,
  summarizeInvariantDelta,
  summarizeSolverInvariants,
  summarizeSolverRemap
} from '../src/compute/solverStateRemap.js';
import {
  N_BODY_GRAVITY_DELTA_SCHEMA,
  N_BODY_GRAVITY_RESULT_SCHEMA,
  N_BODY_GRAVITY_TREE_SCHEMA,
  computeNBodyDiagnostics,
  makeNBodyInitialState,
  resetNBodyGravity,
  stepNBodyGravity
} from '../src/compute/nbodyGravityTasks.js';
import {
  REACTIVE_THERMAL_DELTA_SCHEMA,
  REACTIVE_THERMAL_RESULT_SCHEMA,
  REACTIVE_THERMAL_WEBGPU_MAX_CELLS,
  makeReactiveThermalInitialState,
  resetReactiveThermalCell,
  stepReactiveThermalCell
} from '../src/compute/reactiveThermalTasks.js';
import {
  MAXWELL_FIELD_DELTA_SCHEMA,
  MAXWELL_FIELD_RESULT_SCHEMA,
  computeMaxwellDiagnostics,
  makeMaxwellInitialState,
  resetMaxwellFields,
  stepMaxwellFields
} from '../src/compute/maxwellTasks.js';
import {
  COSMOLOGY_EXPANSION_DELTA_SCHEMA,
  COSMOLOGY_EXPANSION_RESULT_SCHEMA,
  COSMOLOGY_EXPANSION_WEBGPU_MAX_SAMPLES,
  computeCosmologyExpansionDiagnostics,
  makeCosmologyExpansionInitialState,
  resetCosmologyExpansion,
  stepCosmologyExpansion
} from '../src/compute/cosmologyExpansionTasks.js';
import {
  MOLECULAR_CHARGE_EQUILIBRATION_SCHEMA,
  MOLECULAR_DYNAMICS_DELTA_SCHEMA,
  MOLECULAR_DYNAMICS_ATOM_FLOAT_STRIDE,
  MOLECULAR_DYNAMICS_RESULT_SCHEMA,
  MOLECULAR_DYNAMICS_WEBGPU_MAX_ATOMS,
  MOLECULAR_FORCE_ENERGY_LEDGER_SCHEMA,
  MOLECULAR_GEOMETRY_FORCE_LAW_SCHEMA,
  MOLECULAR_FORCE_LAW_SCHEMA,
  MOLECULAR_THERMO_PHASE_LEDGER_SCHEMA,
  MOLECULAR_QUANTUM_COUPLING_SCHEMA,
  MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA,
  MOLECULAR_QUANTUM_SOURCE_SCHEMA,
  MOLECULAR_QMAT_PRODUCT_CONSERVATION_AUDIT_SCHEMA,
  MOLECULAR_QMAT_PRODUCT_TOPOLOGY_GPU_WRITEBACK_SCHEMA,
  MOLECULAR_QMAT_PRODUCT_TOPOLOGY_MUTATION_SCHEMA,
  MOLECULAR_REACTION_EVENT_LEDGER_SCHEMA,
  MOLECULAR_REACTION_LEDGER_SCHEMA,
  MOLECULAR_REACTION_SOURCE_SCHEMA,
  MOLECULAR_ULG_STATE_SOURCE_SCHEMA,
  SUPPORTED_MOLECULAR_ELEMENTS,
  appendMolecularAtomsToState,
  computeMolecularDynamicsDiagnostics,
  createMolecularReactionEventLedger,
  createMolecularReactionSourceTerms,
  getMolecularPairForceLawPreview,
  getMolecularNeighborGridLayout,
  makeMolecularDynamicsInitialState,
  normalizeMolecularQuantumCoupling,
  normalizeMolecularComposition,
  resetMolecularDynamics,
  stepMolecularDynamics
} from '../src/compute/molecularDynamicsTasks.js';
import {
  QUANTUM_ORBITAL_GRID_EIGEN_RESIDUAL_WEBGPU_SCHEMA,
  QUANTUM_ORBITAL_GRID_DELTA_SCHEMA,
  QUANTUM_ORBITAL_GRID_FIELD_RESPONSE_WEBGPU_SCHEMA,
  QUANTUM_ORBITAL_GRID_HAMILTONIAN_COMPONENTS_WEBGPU_SCHEMA,
  QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
  QUANTUM_ORBITAL_GRID_MAGNETIC_RESPONSE_WEBGPU_SCHEMA,
  QUANTUM_ORBITAL_GRID_RADIAL_WEBGPU_SCHEMA,
  QUANTUM_ORBITAL_GRID_RESULT_SCHEMA,
  QUANTUM_ORBITAL_GRID_STATISTICAL_BRIDGE_SCHEMA,
  QUANTUM_ORBITAL_GRID_WEBGPU_SCHEMA,
  QUANTUM_ORBITAL_GRID_WAVEFUNCTION_EVOLUTION_WEBGPU_SCHEMA,
  resetQuantumOrbitalGrid,
  stepQuantumOrbitalGrid
} from '../src/compute/quantumOrbitalGridTasks.js';
import {
  QUANTUM_MATERIAL_POTENTIAL_BATCH_SCHEMA,
  QUANTUM_MATERIAL_POTENTIAL_DELTA_SCHEMA,
  QUANTUM_MATERIAL_POTENTIAL_LIVE_BACKEND_POLICY,
	  QUANTUM_MATERIAL_POTENTIAL_RESULT_SCHEMA,
	  QUANTUM_MATERIAL_POTENTIAL_WEBGPU_SCHEMA,
	  QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA,
	  QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA,
	  QUANTUM_MATERIAL_PROPERTY_RESPONSE_SCHEMA,
	  QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA,
	  QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA,
	  createQuantumMaterialBatchRecords,
	  getQuantumMaterialPotentialShaderSource,
  resetQuantumMaterialPotential,
  stepQuantumMaterialPotential
} from '../src/compute/quantumMaterialPotentialTasks.js';
import {
  ULG_RUNTIME_EXECUTION_DELTA_SCHEMA,
  ULG_RUNTIME_EXECUTION_RESULT_SCHEMA,
  ULG_RUNTIME_EXECUTION_WEBGPU_SCHEMA,
  ULG_RUNTIME_STATE_DELTA_SCHEMA,
  stepUlgRuntime
} from '../src/compute/ulgRuntimeTasks.js';
import {
  ULG_SPEC_CONTRACT_REPORT_SCHEMA
} from '../src/simulation/ulgSpecContracts.js';
import {
  SPH_MATERIAL_DELTA_SCHEMA,
  SPH_MATERIAL_RESULT_SCHEMA,
  computeSphMaterialDiagnostics,
  makeSphMaterialInitialState,
  resetSphMaterial,
  stepSphMaterial
} from '../src/compute/sphMaterialTasks.js';
import {
  HYDRO_ATMOSPHERE_DELTA_SCHEMA,
  HYDRO_ATMOSPHERE_RESULT_SCHEMA,
  HYDRO_ATMOSPHERE_WEBGPU_MAX_CELLS,
  computeHydroAtmosphereDiagnostics,
  makeHydroAtmosphereInitialState,
  resetHydroAtmosphere,
  stepHydroAtmosphere
} from '../src/compute/hydroAtmosphereTasks.js';
import {
  RADIATION_OPACITY_DELTA_SCHEMA,
  RADIATION_OPACITY_RESULT_SCHEMA,
  RADIATION_OPACITY_WEBGPU_MAX_CELLS,
  computeRadiationOpacityDiagnostics,
  makeRadiationOpacityInitialState,
  resetRadiationOpacity,
  stepRadiationOpacity
} from '../src/compute/radiationOpacityTasks.js';
import {
  STELLAR_FUSION_DELTA_SCHEMA,
  STELLAR_FUSION_RESULT_SCHEMA,
  STELLAR_FUSION_WEBGPU_MAX_CELLS,
  computeStellarFusionDiagnostics,
  makeStellarFusionInitialState,
  resetStellarFusion,
  stepStellarFusion
} from '../src/compute/stellarFusionTasks.js';
import {
  MAGNETOSPHERE_PLASMA_DELTA_SCHEMA,
  MAGNETOSPHERE_PLASMA_RESULT_SCHEMA,
  MAGNETOSPHERE_PLASMA_WEBGPU_MAX_CELLS,
  computeMagnetosphereDiagnostics,
  makeMagnetospherePlasmaInitialState,
  resetMagnetospherePlasma,
  stepMagnetospherePlasma
} from '../src/compute/magnetospherePlasmaTasks.js';
import {
  PIC_PLASMA_PATCH_DELTA_SCHEMA,
  PIC_PLASMA_PATCH_RESULT_SCHEMA,
  PIC_PLASMA_PATCH_WEBGPU_MAX_CELLS,
  PIC_PLASMA_PATCH_WEBGPU_MAX_PARTICLES,
  computePicPlasmaDiagnostics,
  makePicPlasmaPatchInitialState,
  resetPicPlasmaPatch,
  stepPicPlasmaPatch
} from '../src/compute/picPlasmaPatchTasks.js';
import {
  RELATIVISTIC_CORRECTION_DELTA_SCHEMA,
  RELATIVISTIC_CORRECTION_RESULT_SCHEMA,
  RELATIVISTIC_CORRECTION_WEBGPU_MAX_SAMPLES,
  computeRelativisticCorrectionDiagnostics,
  makeRelativisticCorrectionInitialState,
  resetRelativisticCorrection,
  stepRelativisticCorrection
} from '../src/compute/relativisticCorrectionTasks.js';
import {
  COMBUSTION_PLUME_DELTA_SCHEMA,
  COMBUSTION_PLUME_RESULT_SCHEMA,
  COMBUSTION_PLUME_WEBGPU_MAX_CELLS,
  computeCombustionPlumeDiagnostics,
  makeCombustionPlumeInitialState,
  resetCombustionPlume,
  stepCombustionPlume
} from '../src/compute/combustionPlumeTasks.js';
import {
  MEMBRANE_SHELL_DELTA_SCHEMA,
  MEMBRANE_SHELL_RESULT_SCHEMA,
  MEMBRANE_SHELL_WEBGPU_MAX_SEGMENTS,
  computeMembraneShellDiagnostics,
  makeMembraneShellInitialState,
  resetMembraneShell,
  stepMembraneShell
} from '../src/compute/membraneShellTasks.js';
import {
  CLOSURE_RESULT_SCHEMA,
  CLOSURE_STATE_SCHEMA,
  closureResultFromMolecularDynamics,
  closureResultFromReactiveThermal,
  closureResultFromSphMaterial,
  validateClosureResult
} from '../../shared/closureContract.js';
import {
  MOLECULAR_CONSERVATIVE_TRANSFER_SCHEMA,
  MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA,
  MOLECULAR_PHASE_EOS_BASIS_SCHEMA,
  MOLECULAR_SOURCE_BUFFER_ACCEPTANCE_SCHEMA,
  MOLECULAR_SOURCE_BUFFER_APPLICATION_AGGREGATE_SCHEMA,
  MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA,
  MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA,
  MOLECULAR_TARGET_BUFFER_REPLAY_VALIDATION_SCHEMA,
  MOLECULAR_TARGET_BUFFER_MUTATION_AUDIT_SCHEMA,
  MOLECULAR_TARGET_BUFFER_WORKER_WRITE_QUEUE_SCHEMA,
  MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA,
  MOLECULAR_TARGET_BUFFER_WORKER_WRITE_VERIFICATION_SCHEMA,
  MOLECULAR_SCIENTIFIC_INVARIANT_GATE_SCHEMA,
  MOLECULAR_SCIENTIFIC_READINESS_MANIFEST_SCHEMA,
  MOLECULAR_SOURCE_EQUATION_SCHEMA,
  MOLECULAR_SOURCE_SINK_BALANCE_SCHEMA,
  MOLECULAR_SOURCE_SINK_SCHEMA,
  MOLECULAR_TARGET_MUTATION_APPLY_EXECUTION_SCHEMA,
  MOLECULAR_TARGET_MUTATION_APPLY_VALIDATION_SCHEMA,
  MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA,
  MOLECULAR_TARGET_SOURCE_RECONCILIATION_SCHEMA,
  MOLECULAR_TARGET_SOURCE_RESPONSE_SCHEMA,
  MOLECULAR_TARGET_MUTATION_COMMIT_SCHEMA,
  MOLECULAR_TARGET_MUTATION_DISPATCH_SCHEMA,
  MOLECULAR_TARGET_MUTATION_INVARIANT_CHECK_SCHEMA,
  MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA,
  MOLECULAR_TARGET_MUTATION_PREFLIGHT_SCHEMA,
  MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA,
  MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA,
  MOLECULAR_TRANSFER_APPLICATION_SCHEMA,
  MOLECULAR_TRANSFER_TRANSACTION_SCHEMA
} from '../../shared/sourceSinkContract.js';
import {
  initLadderCompute,
  resetLadderCompute,
  stepLadderCompute
} from '../src/compute/peercomputeLadderTasks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nbodyTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/nbodyGravityTasks.js')
).href;
const reactiveThermalTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/reactiveThermalTasks.js')
).href;
const maxwellTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/maxwellTasks.js')
).href;
const cosmologyExpansionTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/cosmologyExpansionTasks.js')
).href;
const molecularDynamicsTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/molecularDynamicsTasks.js')
).href;
const quantumOrbitalGridTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/quantumOrbitalGridTasks.js')
).href;
const quantumMaterialPotentialTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/quantumMaterialPotentialTasks.js')
).href;
const ulgRuntimeTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/ulgRuntimeTasks.js')
).href;
const sphMaterialTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/sphMaterialTasks.js')
).href;
const hydroAtmosphereTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/hydroAtmosphereTasks.js')
).href;
const radiationOpacityTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/radiationOpacityTasks.js')
).href;
const stellarFusionTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/stellarFusionTasks.js')
).href;
const magnetospherePlasmaTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/magnetospherePlasmaTasks.js')
).href;
const picPlasmaPatchTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/picPlasmaPatchTasks.js')
).href;
const relativisticCorrectionTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/relativisticCorrectionTasks.js')
).href;
const combustionPlumeTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/combustionPlumeTasks.js')
).href;
const membraneShellTaskModuleUrl = pathToFileURL(
  path.resolve(__dirname, '../src/compute/membraneShellTasks.js')
).href;

class InlineManagerStub {
  constructor() {
    this.initialized = false;
    this.submissions = 0;
  }

  async initialize() {
    this.initialized = true;
  }

  async submitTask({ exportName, data }) {
    this.submissions += 1;
    if (exportName === 'initLadderCompute') return initLadderCompute(data);
    if (exportName === 'stepLadderCompute') return stepLadderCompute(data);
    throw new Error(`Unexpected export ${exportName}`);
  }

  getCapabilities() {
    return {
      cpu: true,
      wasm: true,
      webgpu: false,
      wasmWebgpu: false,
      workers: 1,
      activeTaskCount: 0,
      queuedTaskCount: 0
    };
  }
}

class SharedInlineManagerStub {
  constructor({ workers = 6 } = {}) {
    this.initialized = false;
    this.workers = workers;
    this.affinities = new Set();
    this.submissions = 0;
    this.commitDeltaHandler = null;
  }

  async initialize() {
    this.initialized = true;
  }

  setCommitDeltaHandler(handler) {
    this.commitDeltaHandler = handler;
  }

  async submitTask({ exportName, data, affinityKey }) {
    this.submissions += 1;
    if (affinityKey) this.affinities.add(affinityKey);
    let result;
    if (exportName === 'initLadderCompute') {
      result = await initLadderCompute(data);
    } else if (exportName === 'stepLadderCompute') {
      result = await stepLadderCompute(data);
    } else {
      throw new Error(`Unexpected export ${exportName}`);
    }
    if (result && typeof result === 'object' && Object.prototype.hasOwnProperty.call(result, 'commitDelta')) {
      this.commitDeltaHandler?.(result.commitDelta);
      return Object.prototype.hasOwnProperty.call(result, 'value') ? result.value : result.result;
    }
    return result;
  }

  getCapabilities() {
    return {
      cpu: true,
      wasm: true,
      webgpu: false,
      wasmWebgpu: false,
      workers: this.workers,
      affinityCount: this.affinities.size,
      activeTaskCount: 0,
      queuedTaskCount: 0
    };
  }
}

test('scale ladder spans atomic through supergalactic levels', () => {
  assert.deepEqual(
    SCALE_LAYERS.map((layer) => layer.id),
    ['supergalactic', 'galactic', 'solar', 'planet', 'surface', 'mpm', 'molecular', 'orbital']
  );
});

test('scale visual references follow existing demos and bottom-up priority', () => {
  assert.equal(MULTISCALE_VISUAL_REFERENCE_SCHEMA, 'peercompute.multiscale.visual-reference.v0');
  assert.equal(getScaleVisualReference('supergalactic')?.sourceDemo, 'universes');
  assert.equal(getScaleVisualReference('galactic')?.sourceDemo, 'universes');
  assert.equal(getScaleVisualReference('solar')?.sourceDemo, 'universes');
  assert.equal(getScaleVisualReference('planet')?.sourceDemo, 'planetgen');
  assert.match(getScaleVisualReference('surface')?.sourceDemo || '', /planetgen/);
  assert.match(getScaleVisualReference('surface')?.sourceDemo || '', /webgpuphys/);
  assert.match(getScaleVisualReference('mpm')?.sourceDemo || '', /webgpuphys/);
  assert.match(getScaleVisualReference('molecular')?.sourceDemo || '', /schrodinger|webgpuphys/);
  assert.equal(getScaleVisualReference('orbital')?.sourceDemo, 'schrodinger');
  assert.equal(getScaleVisualReference('orbital')?.bottomUpPriority, 'base-layer');
  assert.equal(getScaleVisualReference('molecular')?.bottomUpPriority, 'base-layer');
  assert.equal(Object.keys(SCALE_VISUAL_REFERENCE_POLICY).length, SCALE_LAYERS.length);
});

test('quantum orbital closure reports electron shell and screened hydrogenic basis', () => {
  const oxygenShells = buildElectronConfiguration(8);
  assert.equal(summarizeElectronConfiguration(oxygenShells), '1s2 2s2 2p4');

  const oxygen = createQuantumOrbitalClosure({
    orbital: { elementSymbol: 'O', principalN: 2, angularL: 1, magneticM: 0, finiteGridSize: 16, normError: 0.001 },
    environment: { ambientTemperatureK: 294, ambientPressurePa: 101325 },
    molecularDynamics: { meanTemperatureK: 294, ionizationFraction: 0 },
    timeSeconds: 1.25
  });
  assert.equal(oxygen.schema, QUANTUM_ORBITAL_CLOSURE_SCHEMA);
  assert.equal(oxygen.modelId, QUANTUM_ORBITAL_MODEL_ID);
  assert.equal(oxygen.element.symbol, 'O');
  assert.equal(oxygen.electronConfiguration, '1s2 2s2 2p4');
  assert.equal(oxygen.activeOrbital.label, '2p');
  assert.equal(oxygen.valenceElectronCount, 6);
  assert.equal(oxygen.unpairedElectronCount, 2);
  assert.ok(Number.isFinite(oxygen.energyEv));
  assert.ok(oxygen.energyEv < 0);
  assert.ok(Number.isFinite(oxygen.zEff));
  assert.ok(oxygen.zEff > 1);
  assert.ok(Number.isFinite(oxygen.ionizationEnergyProxyEv));
  assert.ok(oxygen.ionizationEnergyProxyEv > 0);
  assert.equal(oxygen.bondingTendency, 'polar-covalent-acceptor');
  assert.equal(oxygen.finiteGrid.schema, QUANTUM_ORBITAL_FINITE_GRID_SCHEMA);
  assert.equal(oxygen.finiteGrid.gridSize, 16);
  assert.equal(oxygen.finiteGrid.sampleCount, 4096);
  assert.ok(Number.isFinite(oxygen.finiteGrid.normalizationError));
  assert.ok(oxygen.finiteGrid.normalizationError < 1e-9);
  assert.ok(Number.isFinite(oxygen.finiteGrid.boundaryMass));
  assert.ok(oxygen.finiteGrid.boundaryMass >= 0);
  assert.ok(Number.isFinite(oxygen.finiteGrid.meanRadiusBohr));
  assert.ok(oxygen.finiteGrid.meanRadiusBohr > 0);
  assert.equal(oxygen.finiteGrid.radialEigenstate.schema, QUANTUM_ORBITAL_RADIAL_EIGENSTATE_SCHEMA);
  assert.equal(oxygen.finiteGrid.radialEigenstate.mode, 'time-independent-radial-schrodinger');
  assert.ok(Number.isFinite(oxygen.finiteGrid.radialEigenstateEnergyEv));
  assert.ok(Number.isFinite(oxygen.finiteGrid.radialEigenstateEnergyErrorEv));
  assert.ok(Number.isFinite(oxygen.finiteGrid.radialEigenstateResidualRelativeL2));
  assert.equal(oxygen.finiteGrid.radialEigenstateNodeCountObserved, 0);
  assert.equal(oxygen.finiteGrid.radialEigenstateNodeCountTarget, 0);
  assert.equal(oxygen.closureResult.diagnostics.radialEigenstate.schema, QUANTUM_ORBITAL_RADIAL_EIGENSTATE_SCHEMA);
  assert.equal(oxygen.closureResult.schema, CLOSURE_RESULT_SCHEMA);
  assert.equal(oxygen.closureResult.source.solverId, 'quantum-orbital-closure');
  assert.equal(oxygen.closureResult.chemistry.elementSymbol, 'O');
  assert.equal(oxygen.closureResult.validity.status, 'interactive-proxy');

  const hydrogen = createQuantumOrbitalClosure({
    orbital: { elementSymbol: 'H', principalN: 1, angularL: 0, magneticM: 0 },
    environment: { ambientTemperatureK: 294, ambientPressurePa: 101325 }
  });
  assert.equal(hydrogen.electronConfiguration, '1s1');
  assert.equal(hydrogen.activeOrbital.label, '1s');
  assert.ok(Math.abs(hydrogen.energyEv + 13.605693122994) < 1e-6);
  assert.ok(hydrogen.closureResult.uncertainty.confidence > oxygen.closureResult.uncertainty.confidence);
});

test('quantum orbital grid task is WebGPU-only and model accepts WebGPU summaries', async () => {
  resetQuantumOrbitalGrid({ stateKey: 'orbital:unit:oxygen' });
  const blocked = await stepQuantumOrbitalGrid({
    input: {
      taskId: 'orbital:unit',
      stateKey: 'orbital:unit:oxygen',
      elementSymbol: 'O',
      principalN: 2,
      angularL: 1,
      magneticM: 0,
      finiteGridSize: 12,
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(blocked.value.schema, QUANTUM_ORBITAL_GRID_RESULT_SCHEMA);
  assert.equal(blocked.value.ok, false);
  assert.equal(blocked.value.status, 'blocked-webgpu-unavailable');
  assert.equal(blocked.value.backend, 'webgpu-unavailable');
  assert.equal(blocked.value.liveBackendPolicy, QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY);
  assert.equal(blocked.value.finiteGrid, null);
  assert.equal(blocked.value.webgpuStatus.schema, QUANTUM_ORBITAL_GRID_WEBGPU_SCHEMA);
  assert.equal(blocked.value.webgpuStatus.liveBackendPolicy, QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY);
  assert.equal(blocked.value.webgpuStatus.fallback, false);
  assert.equal(blocked.value.webgpuStatus.sampleCount, 1728);
  assert.match(blocked.value.webgpuStatus.reason, /WebGPU|enableWebGPU=false|no CPU fallback/i);
  assert.equal(blocked.value.conservation.mode, 'blocked-webgpu-only-orbital-grid-evaluation');
  assert.equal(blocked.commitDelta.payload.schema, QUANTUM_ORBITAL_GRID_DELTA_SCHEMA);
  assert.equal(blocked.commitDelta.payload.status, 'blocked-webgpu-unavailable');
  assert.equal(blocked.commitDelta.payload.liveBackendPolicy, QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY);
  assert.equal(blocked.commitDelta.payload.finiteGrid, null);

  const model = new MultiscaleModel();
  model.setQuantumOrbital({
    elementSymbol: 'O',
    principalN: 2,
    angularL: 1,
    magneticM: 0,
    finiteGridSize: 12
  });
  const finiteGrid = {
    schema: QUANTUM_ORBITAL_FINITE_GRID_SCHEMA,
    liveBackendPolicy: QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
    backend: 'webgpu-orbital-grid-probability-evaluation',
    elementSymbol: 'O',
    atomicNumber: 8,
    principalN: 2,
    angularL: 1,
    magneticM: 0,
    gridSize: 12,
    sampleCount: 1728,
    extentBohr: 7.25,
    spacingBohr: 1.31818,
    zEff: 4.715,
    energyEv: -75.6,
    normalization: 1,
    normalizationError: 0,
    boundaryMass: 0.0025,
    maxProbability: null,
    maxRadiusBohr: null,
    meanRadiusBohr: 1.82,
    rmsRadiusBohr: 2.14,
    probabilityMass: 1,
    rawProbabilityMass: 13.25,
    rawBoundaryMass: 0.033,
    rawNormalizationMode: 'webgpu-self-normalized-density-moments',
    reductionMode: 'webgpu-float32-orbital-evaluation-reduction',
    webgpuStatus: {
      schema: QUANTUM_ORBITAL_GRID_WEBGPU_SCHEMA,
      kernelMode: 'workgroup-probability-evaluation-reduction',
      evaluationMode: 'wgsl-screened-hydrogenic-density',
      reductionMode: 'webgpu-float32-orbital-evaluation-reduction',
      normalizationMode: 'gpu-self-normalized-density-moments',
      liveBackendPolicy: QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
      fallback: false
    },
    webgpuError: null,
    reference: null,
    parity: null,
    eigenResidual: {
      schema: QUANTUM_ORBITAL_GRID_EIGEN_RESIDUAL_WEBGPU_SCHEMA,
      backend: 'webgpu-orbital-grid-eigen-residual-reduction',
      status: 'finite-grid-watch',
      relativeL2: 0.032,
      weightedMeanResidualEv: 0.014,
      interiorSampleCount: 1000
    },
    eigenResidualSchema: QUANTUM_ORBITAL_GRID_EIGEN_RESIDUAL_WEBGPU_SCHEMA,
    eigenResidualStatus: 'finite-grid-watch',
    eigenResidualRelativeL2: 0.032,
    eigenResidualWeightedMeanEv: 0.014,
    eigenResidualInteriorSampleCount: 1000,
    eigenResidualWebgpuSchema: QUANTUM_ORBITAL_GRID_EIGEN_RESIDUAL_WEBGPU_SCHEMA,
    eigenResidualWebgpuStatus: 'finite-grid-watch',
    eigenResidualWebgpuRelativeL2: 0.032,
    eigenResidualWebgpuWeightedMeanEv: 0.014,
    eigenResidualWebgpuParityOk: null,
    wavefunctionEvolution: {
      schema: QUANTUM_ORBITAL_GRID_WAVEFUNCTION_EVOLUTION_WEBGPU_SCHEMA,
      backend: 'webgpu-orbital-grid-wavefunction-evolution-reduction',
      status: 'finite-difference-watch',
      normDrift: 0.00021,
      densityDriftL1: 0.0017,
      energyExpectationEv: -74.9,
      kineticExpectationEv: 75.1,
      potentialExpectationEv: -150,
      fieldEnergyExpectationEv: 0.004,
      absFieldEnergyExpectationEv: 0.0048,
      electricFieldVm: 250000000,
      electricFieldAtomicUnits: 0.000486,
      dipoleMomentZBohrElectron: 0.012,
      fieldRmsExtentBohr: 1.44,
      polarizabilityProxyBohr3: 24,
      starkShiftProxyEv: -0.000077,
      magneticFieldT: 5,
      magneticFieldAtomicUnits: 0.0000213,
      zeemanEnergyExpectationEv: 0.00029,
      absZeemanEnergyExpectationEv: 0.00029,
      magneticMomentProjectionBohrMagneton: -1,
      zeemanProjection: 1,
      spinProjection: 0.5,
      larmorAngularFrequencyProxyAu: 0.0000213,
      magneticResponse: {
        schema: QUANTUM_ORBITAL_GRID_MAGNETIC_RESPONSE_WEBGPU_SCHEMA,
        backend: 'webgpu-orbital-grid-wavefunction-evolution-reduction',
        magneticFieldT: 5,
        magneticFieldAtomicUnits: 0.0000213,
        zeemanEnergyExpectationEv: 0.00029,
        absZeemanEnergyExpectationEv: 0.00029,
        magneticMomentProjectionBohrMagneton: -1,
        zeemanProjection: 1,
        spinProjection: 0.5,
        larmorAngularFrequencyProxyAu: 0.0000213
      },
      magneticResponseSchema: QUANTUM_ORBITAL_GRID_MAGNETIC_RESPONSE_WEBGPU_SCHEMA,
      fieldResponse: {
        schema: QUANTUM_ORBITAL_GRID_FIELD_RESPONSE_WEBGPU_SCHEMA,
        backend: 'webgpu-orbital-grid-wavefunction-evolution-reduction',
        electricFieldVm: 250000000,
        electricFieldAtomicUnits: 0.000486,
        dipoleMomentZBohrElectron: 0.012,
        fieldEnergyExpectationEv: 0.004,
        absFieldEnergyExpectationEv: 0.0048,
        fieldRmsExtentBohr: 1.44,
        polarizabilityProxyBohr3: 24,
        starkShiftProxyEv: -0.000077
      },
      fieldResponseSchema: QUANTUM_ORBITAL_GRID_FIELD_RESPONSE_WEBGPU_SCHEMA,
      componentEnergyExpectationEv: -74.89571,
      hamiltonianComponentResidualEv: 0.00429,
      virialResidualEv: 0.2,
      hamiltonianComponents: {
        schema: QUANTUM_ORBITAL_GRID_HAMILTONIAN_COMPONENTS_WEBGPU_SCHEMA,
        backend: 'webgpu-orbital-grid-wavefunction-evolution-reduction',
        kineticExpectationEv: 75.1,
        potentialExpectationEv: -150,
        fieldEnergyExpectationEv: 0.004,
        zeemanEnergyExpectationEv: 0.00029,
        componentEnergyExpectationEv: -74.89571,
        hamiltonianComponentResidualEv: 0.00429,
        virialResidualEv: 0.2
      },
      phaseRotationRad: 0.0055,
      dtAtomicUnits: 0.002,
      interiorSampleCount: 1000
    },
    wavefunctionEvolutionSchema: QUANTUM_ORBITAL_GRID_WAVEFUNCTION_EVOLUTION_WEBGPU_SCHEMA,
    wavefunctionEvolutionStatus: 'finite-difference-watch',
    wavefunctionEvolutionNormDrift: 0.00021,
    wavefunctionEvolutionDensityDriftL1: 0.0017,
    wavefunctionEvolutionEnergyExpectationEv: -74.9,
    wavefunctionEvolutionKineticExpectationEv: 75.1,
    wavefunctionEvolutionPotentialExpectationEv: -150,
    wavefunctionEvolutionFieldEnergyExpectationEv: 0.004,
    wavefunctionEvolutionAbsFieldEnergyExpectationEv: 0.0048,
    wavefunctionEvolutionElectricFieldVm: 250000000,
    wavefunctionEvolutionElectricFieldAtomicUnits: 0.000486,
    wavefunctionEvolutionDipoleMomentZBohrElectron: 0.012,
    wavefunctionEvolutionFieldRmsExtentBohr: 1.44,
    wavefunctionEvolutionPolarizabilityProxyBohr3: 24,
    wavefunctionEvolutionStarkShiftProxyEv: -0.000077,
    wavefunctionEvolutionFieldResponseSchema: QUANTUM_ORBITAL_GRID_FIELD_RESPONSE_WEBGPU_SCHEMA,
    wavefunctionEvolutionMagneticFieldT: 5,
    wavefunctionEvolutionMagneticFieldAtomicUnits: 0.0000213,
    wavefunctionEvolutionZeemanEnergyExpectationEv: 0.00029,
    wavefunctionEvolutionAbsZeemanEnergyExpectationEv: 0.00029,
    wavefunctionEvolutionMagneticMomentProjectionBohrMagneton: -1,
    wavefunctionEvolutionZeemanProjection: 1,
    wavefunctionEvolutionSpinProjection: 0.5,
    wavefunctionEvolutionLarmorAngularFrequencyProxyAu: 0.0000213,
    wavefunctionEvolutionMagneticResponseSchema: QUANTUM_ORBITAL_GRID_MAGNETIC_RESPONSE_WEBGPU_SCHEMA,
    wavefunctionEvolutionComponentEnergyExpectationEv: -74.89571,
    wavefunctionEvolutionHamiltonianComponentResidualEv: 0.00429,
    wavefunctionEvolutionVirialResidualEv: 0.2,
    wavefunctionEvolutionHamiltonianComponentsSchema: QUANTUM_ORBITAL_GRID_HAMILTONIAN_COMPONENTS_WEBGPU_SCHEMA,
    wavefunctionEvolutionPhaseRotationRad: 0.0055,
    wavefunctionEvolutionDtAtomicUnits: 0.002,
    wavefunctionEvolutionInteriorSampleCount: 1000,
    wavefunctionEvolutionWebgpuSchema: QUANTUM_ORBITAL_GRID_WAVEFUNCTION_EVOLUTION_WEBGPU_SCHEMA,
    wavefunctionEvolutionWebgpuStatus: 'finite-difference-watch',
    wavefunctionEvolutionWebgpuNormDrift: 0.00021,
    wavefunctionEvolutionWebgpuDensityDriftL1: 0.0017,
    wavefunctionEvolutionWebgpuEnergyExpectationEv: -74.9,
    wavefunctionEvolutionWebgpuKineticExpectationEv: 75.1,
    wavefunctionEvolutionWebgpuPotentialExpectationEv: -150,
    wavefunctionEvolutionWebgpuFieldEnergyExpectationEv: 0.004,
    wavefunctionEvolutionWebgpuAbsFieldEnergyExpectationEv: 0.0048,
    wavefunctionEvolutionWebgpuElectricFieldVm: 250000000,
    wavefunctionEvolutionWebgpuElectricFieldAtomicUnits: 0.000486,
    wavefunctionEvolutionWebgpuDipoleMomentZBohrElectron: 0.012,
    wavefunctionEvolutionWebgpuFieldRmsExtentBohr: 1.44,
    wavefunctionEvolutionWebgpuPolarizabilityProxyBohr3: 24,
    wavefunctionEvolutionWebgpuStarkShiftProxyEv: -0.000077,
    wavefunctionEvolutionWebgpuFieldResponseSchema: QUANTUM_ORBITAL_GRID_FIELD_RESPONSE_WEBGPU_SCHEMA,
    wavefunctionEvolutionWebgpuMagneticFieldT: 5,
    wavefunctionEvolutionWebgpuMagneticFieldAtomicUnits: 0.0000213,
    wavefunctionEvolutionWebgpuZeemanEnergyExpectationEv: 0.00029,
    wavefunctionEvolutionWebgpuAbsZeemanEnergyExpectationEv: 0.00029,
    wavefunctionEvolutionWebgpuMagneticMomentProjectionBohrMagneton: -1,
    wavefunctionEvolutionWebgpuZeemanProjection: 1,
    wavefunctionEvolutionWebgpuSpinProjection: 0.5,
    wavefunctionEvolutionWebgpuLarmorAngularFrequencyProxyAu: 0.0000213,
    wavefunctionEvolutionWebgpuMagneticResponseSchema: QUANTUM_ORBITAL_GRID_MAGNETIC_RESPONSE_WEBGPU_SCHEMA,
    wavefunctionEvolutionWebgpuComponentEnergyExpectationEv: -74.89571,
    wavefunctionEvolutionWebgpuHamiltonianComponentResidualEv: 0.00429,
    wavefunctionEvolutionWebgpuVirialResidualEv: 0.2,
    wavefunctionEvolutionWebgpuHamiltonianComponentsSchema: QUANTUM_ORBITAL_GRID_HAMILTONIAN_COMPONENTS_WEBGPU_SCHEMA,
    wavefunctionEvolutionWebgpuPhaseRotationRad: 0.0055,
    wavefunctionEvolutionWebgpuDtAtomicUnits: 0.002,
    wavefunctionEvolutionWebgpuInteriorSampleCount: 1000,
    wavefunctionEvolutionWebgpuParityOk: null,
    statisticalBridge: {
      schema: QUANTUM_ORBITAL_GRID_STATISTICAL_BRIDGE_SCHEMA,
      backend: 'webgpu-orbital-grid-wavefunction-evolution-reduction',
      status: 'webgpu-energy-derived-ensemble-ready',
      distribution: 'reduced-boltzmann-two-level-saha-degeneracy',
      partitionFunctionLog: 1.79176,
      groundOccupation: 0.9992,
      excitedOccupation: 0.0008,
      freeEnergyEv: -75.446,
      internalEnergyEv: -75.392,
      heatCapacityProxy: 0.087,
      entropyProxyKb: 1.803,
      ionizationFraction: 0.0032,
      opacityPopulationProxy: 0.019,
      degeneracyParameter: 0.00074,
      ensemblePressurePa: 101371,
      sourceTerms: {
        temperatureDeltaKProxy: 0.54,
        chargeDeltaProxy: 0.00027,
        thermalDampingScale: 0.99978
      }
    },
    statisticalBridgeSchema: QUANTUM_ORBITAL_GRID_STATISTICAL_BRIDGE_SCHEMA,
    statisticalBridgeStatus: 'webgpu-energy-derived-ensemble-ready',
    statisticalBridgeBackend: 'webgpu-orbital-grid-wavefunction-evolution-reduction',
    statisticalBridgePartitionFunctionLog: 1.79176,
    statisticalBridgeGroundOccupation: 0.9992,
    statisticalBridgeExcitedOccupation: 0.0008,
    statisticalBridgeFreeEnergyEv: -75.446,
    statisticalBridgeInternalEnergyEv: -75.392,
    statisticalBridgeHeatCapacityProxy: 0.087,
    statisticalBridgeEntropyProxyKb: 1.803,
    statisticalBridgeIonizationFraction: 0.0032,
    statisticalBridgeOpacityPopulationProxy: 0.019,
    statisticalBridgeDegeneracyParameter: 0.00074,
    statisticalBridgeEnsemblePressurePa: 101371,
    statisticalBridgeTemperatureDeltaKProxy: 0.54,
    statisticalBridgeChargeDeltaProxy: 0.00027,
    statisticalBridgeThermalDampingScale: 0.99978,
    radialEigenstate: {
      schema: QUANTUM_ORBITAL_GRID_RADIAL_WEBGPU_SCHEMA,
      backend: 'webgpu-radial-schrodinger',
      status: 'webgpu-watch',
      mode: 'time-independent-radial-schrodinger',
      energyEv: -75.4,
      analyticEnergyEv: -75.6,
      energyErrorEv: 0.2,
      residualRelativeL2: 0.0015,
      meanRadiusBohr: 1.7,
      gridPointCount: 192,
      radialNodeCountObserved: 0,
      radialNodeCountTarget: 0,
      webgpuStatus: {
        kernelMode: 'webgpu-radial-hamiltonian',
        reductionMode: 'webgpu-workgroup-partials-js-final-sum',
        workgroupSize: 128,
        partialCount: 2
      }
    },
    radialEigenstateSchema: QUANTUM_ORBITAL_GRID_RADIAL_WEBGPU_SCHEMA,
    radialEigenstateStatus: 'webgpu-watch',
    radialEigenstateEnergyEv: -75.4,
    radialEigenstateAnalyticEnergyEv: -75.6,
    radialEigenstateEnergyErrorEv: 0.2,
    radialEigenstateResidualRelativeL2: 0.0015,
    radialEigenstateMeanRadiusBohr: 1.7,
    radialEigenstateGridPointCount: 192,
    radialEigenstateNodeCountObserved: 0,
    radialEigenstateNodeCountTarget: 0,
    radialEigenstateWebgpuSchema: QUANTUM_ORBITAL_GRID_RADIAL_WEBGPU_SCHEMA,
    radialEigenstateWebgpuStatus: 'webgpu-watch',
    radialEigenstateWebgpuResidualRelativeL2: 0.0015,
    radialEigenstateWebgpuEnergyErrorEv: 0.2
  };
  const webgpuResult = {
    ok: true,
    status: 'webgpu-executed',
    schema: QUANTUM_ORBITAL_GRID_RESULT_SCHEMA,
    backend: 'webgpu-orbital-grid-probability-evaluation',
    liveBackendPolicy: QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,
    sequence: 2,
    finiteGrid,
    parameters: {
      elementSymbol: 'O',
      principalN: 2,
      angularL: 1,
      magneticM: 0,
      gridSize: 12
    }
  };
  const orbital = model.applyQuantumOrbitalGridResult(webgpuResult);
  assert.equal(orbital.finiteGridBackend, 'webgpu-orbital-grid-probability-evaluation');
  assert.equal(orbital.finiteGridReductionMode, 'webgpu-float32-orbital-evaluation-reduction');
  assert.equal(orbital.finiteGridSequence, webgpuResult.sequence);
  assert.equal(orbital.finiteGridSampleCount, 1728);
  assert.equal(orbital.finiteGridEigenResidualSchema, QUANTUM_ORBITAL_GRID_EIGEN_RESIDUAL_WEBGPU_SCHEMA);
  assert.ok(Number.isFinite(orbital.finiteGridEigenResidualRelativeL2));
  assert.equal(orbital.finiteGridWavefunctionEvolutionSchema, QUANTUM_ORBITAL_GRID_WAVEFUNCTION_EVOLUTION_WEBGPU_SCHEMA);
  assert.ok(Number.isFinite(orbital.finiteGridWavefunctionEvolutionNormDrift));
  assert.ok(Number.isFinite(orbital.finiteGridWavefunctionEvolutionDensityDriftL1));
  assert.ok(Number.isFinite(orbital.finiteGridWavefunctionEvolutionEnergyExpectationEv));
  assert.equal(orbital.finiteGridWavefunctionEvolutionKineticExpectationEv, 75.1);
  assert.equal(orbital.finiteGridWavefunctionEvolutionPotentialExpectationEv, -150);
  assert.equal(orbital.finiteGridWavefunctionEvolutionFieldEnergyExpectationEv, 0.004);
  assert.equal(orbital.finiteGridWavefunctionEvolutionElectricFieldVm, 250000000);
  assert.equal(orbital.finiteGridWavefunctionEvolutionDipoleMomentZBohrElectron, 0.012);
  assert.equal(orbital.finiteGridWavefunctionEvolutionPolarizabilityProxyBohr3, 24);
  assert.equal(orbital.finiteGridWavefunctionEvolutionFieldResponseSchema, QUANTUM_ORBITAL_GRID_FIELD_RESPONSE_WEBGPU_SCHEMA);
  assert.equal(orbital.finiteGridWavefunctionEvolutionMagneticFieldT, 5);
  assert.equal(orbital.finiteGridWavefunctionEvolutionZeemanEnergyExpectationEv, 0.00029);
  assert.equal(orbital.finiteGridWavefunctionEvolutionMagneticMomentProjectionBohrMagneton, -1);
  assert.equal(orbital.finiteGridWavefunctionEvolutionMagneticResponseSchema, QUANTUM_ORBITAL_GRID_MAGNETIC_RESPONSE_WEBGPU_SCHEMA);
  assert.equal(orbital.finiteGridWavefunctionEvolutionComponentEnergyExpectationEv, -74.89571);
  assert.equal(orbital.finiteGridWavefunctionEvolutionHamiltonianComponentResidualEv, 0.00429);
  assert.equal(orbital.finiteGridWavefunctionEvolutionVirialResidualEv, 0.2);
  assert.equal(orbital.finiteGridWavefunctionEvolutionHamiltonianComponentsSchema, QUANTUM_ORBITAL_GRID_HAMILTONIAN_COMPONENTS_WEBGPU_SCHEMA);
  assert.equal(orbital.finiteGridWavefunctionEvolutionWebgpuKineticExpectationEv, 75.1);
  assert.equal(orbital.finiteGridWavefunctionEvolutionWebgpuFieldResponseSchema, QUANTUM_ORBITAL_GRID_FIELD_RESPONSE_WEBGPU_SCHEMA);
  assert.equal(orbital.finiteGridWavefunctionEvolutionWebgpuMagneticResponseSchema, QUANTUM_ORBITAL_GRID_MAGNETIC_RESPONSE_WEBGPU_SCHEMA);
  assert.equal(orbital.finiteGridWavefunctionEvolutionWebgpuHamiltonianComponentsSchema, QUANTUM_ORBITAL_GRID_HAMILTONIAN_COMPONENTS_WEBGPU_SCHEMA);
  assert.equal(orbital.finiteGridStatisticalBridgeSchema, QUANTUM_ORBITAL_GRID_STATISTICAL_BRIDGE_SCHEMA);
  assert.equal(orbital.finiteGridStatisticalBridgeStatus, 'webgpu-energy-derived-ensemble-ready');
  assert.equal(orbital.finiteGridStatisticalBridgePartitionFunctionLog, 1.79176);
  assert.equal(orbital.finiteGridStatisticalBridgeHeatCapacityProxy, 0.087);
  assert.equal(orbital.finiteGridStatisticalBridgeTemperatureDeltaKProxy, 0.54);
  assert.equal(orbital.finiteGridRadialEigenstateSchema, QUANTUM_ORBITAL_GRID_RADIAL_WEBGPU_SCHEMA);
  assert.equal(orbital.finiteGridRadialEigenstateStatus, 'webgpu-watch');
  assert.equal(orbital.finiteGridRadialEigenstateEnergyEv, -75.4);
  assert.equal(orbital.finiteGridRadialEigenstateEnergyErrorEv, 0.2);
  assert.equal(orbital.finiteGridRadialEigenstateResidualRelativeL2, 0.0015);
  assert.equal(orbital.finiteGridRadialEigenstateMeanRadiusBohr, 1.7);
  assert.equal(orbital.finiteGridRadialEigenstateGridPointCount, 192);
  assert.equal(orbital.closureBackend, 'webgpu-screened-hydrogenic-density-evaluation');
  const packet = model.update(0.016);
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridBackend, 'webgpu-orbital-grid-probability-evaluation');
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridReductionMode, 'webgpu-float32-orbital-evaluation-reduction');
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridEigenResidualSchema, QUANTUM_ORBITAL_GRID_EIGEN_RESIDUAL_WEBGPU_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridWavefunctionEvolutionSchema, QUANTUM_ORBITAL_GRID_WAVEFUNCTION_EVOLUTION_WEBGPU_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridWavefunctionEvolutionKineticExpectationEv, 75.1);
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridWavefunctionEvolutionFieldEnergyExpectationEv, 0.004);
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridWavefunctionEvolutionFieldResponseSchema, QUANTUM_ORBITAL_GRID_FIELD_RESPONSE_WEBGPU_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridWavefunctionEvolutionZeemanEnergyExpectationEv, 0.00029);
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridWavefunctionEvolutionMagneticResponseSchema, QUANTUM_ORBITAL_GRID_MAGNETIC_RESPONSE_WEBGPU_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridWavefunctionEvolutionVirialResidualEv, 0.2);
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridWavefunctionEvolutionHamiltonianComponentsSchema, QUANTUM_ORBITAL_GRID_HAMILTONIAN_COMPONENTS_WEBGPU_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridStatisticalBridgeSchema, QUANTUM_ORBITAL_GRID_STATISTICAL_BRIDGE_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridStatisticalBridgeHeatCapacityProxy, 0.087);
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridRadialEigenstateSchema, QUANTUM_ORBITAL_GRID_RADIAL_WEBGPU_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridRadialEigenstateEnergyEv, -75.4);
  assert.equal(typeof packet.upward.closures.quantumFiniteGridEigenResidualRelativeL2, 'number');
  assert.equal(typeof packet.upward.closures.quantumFiniteGridWavefunctionEvolutionNormDrift, 'number');
  assert.equal(packet.upward.closures.quantumFiniteGridWavefunctionEvolutionKineticExpectationEv, 75.1);
  assert.equal(packet.upward.closures.quantumFiniteGridWavefunctionEvolutionFieldEnergyExpectationEv, 0.004);
  assert.equal(packet.upward.closures.quantumFiniteGridWavefunctionEvolutionElectricFieldVm, 250000000);
  assert.equal(packet.upward.closures.quantumFiniteGridWavefunctionEvolutionPolarizabilityProxyBohr3, 24);
  assert.equal(packet.upward.closures.quantumFiniteGridWavefunctionEvolutionZeemanEnergyExpectationEv, 0.00029);
  assert.equal(packet.upward.closures.quantumFiniteGridWavefunctionEvolutionMagneticMomentProjectionBohrMagneton, -1);
  assert.equal(packet.upward.closures.quantumFiniteGridWavefunctionEvolutionVirialResidualEv, 0.2);
  assert.equal(packet.upward.closures.quantumFiniteGridStatisticalBridgeTemperatureDeltaKProxy, 0.54);
  assert.equal(packet.upward.closures.quantumFiniteGridRadialEigenstateEnergyEv, -75.4);

  const molecularCoupling = normalizeMolecularQuantumCoupling(model.state.closures.quantumOrbital);
  assert.equal(molecularCoupling.schema, MOLECULAR_QUANTUM_COUPLING_SCHEMA);
  assert.equal(molecularCoupling.active, true);
  assert.equal(molecularCoupling.elementSymbol, 'O');
  assert.equal(molecularCoupling.wavefunctionEvolutionSchema, QUANTUM_ORBITAL_GRID_WAVEFUNCTION_EVOLUTION_WEBGPU_SCHEMA);
  assert.equal(molecularCoupling.wavefunctionEvolutionSource, 'webgpu-worker');
  assert.equal(molecularCoupling.wavefunctionEvolutionBackend, 'webgpu-orbital-grid-wavefunction-evolution-reduction');
  assert.equal(molecularCoupling.wavefunctionEvolutionWebgpuExecuted, true);
  assert.equal(molecularCoupling.wavefunctionEvolutionLiveBackendPolicy, QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY);
  assert.equal(molecularCoupling.wavefunctionEvolutionKineticExpectationEv, 75.1);
  assert.equal(molecularCoupling.wavefunctionEvolutionPotentialExpectationEv, -150);
  assert.equal(molecularCoupling.wavefunctionEvolutionFieldEnergyExpectationEv, 0.004);
  assert.equal(molecularCoupling.wavefunctionEvolutionElectricFieldVm, 250000000);
  assert.equal(molecularCoupling.wavefunctionEvolutionDipoleMomentZBohrElectron, 0.012);
  assert.equal(molecularCoupling.wavefunctionEvolutionPolarizabilityProxyBohr3, 24);
  assert.equal(molecularCoupling.wavefunctionEvolutionFieldResponseSchema, QUANTUM_ORBITAL_GRID_FIELD_RESPONSE_WEBGPU_SCHEMA);
  assert.equal(molecularCoupling.wavefunctionEvolutionMagneticFieldT, 5);
  assert.equal(molecularCoupling.wavefunctionEvolutionZeemanEnergyExpectationEv, 0.00029);
  assert.equal(molecularCoupling.wavefunctionEvolutionMagneticMomentProjectionBohrMagneton, -1);
  assert.equal(molecularCoupling.wavefunctionEvolutionMagneticResponseSchema, QUANTUM_ORBITAL_GRID_MAGNETIC_RESPONSE_WEBGPU_SCHEMA);
  assert.equal(molecularCoupling.wavefunctionEvolutionVirialResidualEv, 0.2);
  assert.equal(molecularCoupling.wavefunctionEvolutionHamiltonianComponentsSchema, QUANTUM_ORBITAL_GRID_HAMILTONIAN_COMPONENTS_WEBGPU_SCHEMA);
  assert.equal(molecularCoupling.statisticalBridgeSchema, QUANTUM_ORBITAL_GRID_STATISTICAL_BRIDGE_SCHEMA);
  assert.equal(molecularCoupling.statisticalBridgeSource, 'webgpu-worker');
  assert.equal(molecularCoupling.statisticalBridgeWebgpuExecuted, true);
  assert.equal(molecularCoupling.statisticalBridgeHeatCapacityProxy, 0.087);
  assert.equal(molecularCoupling.statisticalBridgeTemperatureDeltaKProxy, 0.54);
  assert.ok(molecularCoupling.statisticalBridgeDrive > 0);
  assert.equal(molecularCoupling.radialEigenstateSchema, QUANTUM_ORBITAL_GRID_RADIAL_WEBGPU_SCHEMA);
  assert.equal(molecularCoupling.radialEigenstateSource, 'webgpu-worker');
  assert.equal(molecularCoupling.radialEigenstateWebgpuExecuted, true);
  assert.equal(molecularCoupling.radialEigenstateEnergyEv, -75.4);
  assert.equal(molecularCoupling.radialEigenstateResidualRelativeL2, 0.0015);

  resetMolecularDynamics();
  const molecularResult = await stepMolecularDynamics({
    stateKey: 'molecular:qgrid-webgpu-coupling:test',
    input: {
      stateKey: 'molecular:qgrid-webgpu-coupling:test',
      state: makeMolecularDynamicsInitialState({
        composition: { O: 3, H: 6 },
        seed: 515,
        environment: model.environment,
        coupling: { fireIntensity: 0.05, reactionProgress: 0.08 }
      }),
      dt: 0.025,
      environment: model.environment,
      coupling: {
        fireIntensity: 0.05,
        reactionProgress: 0.08,
        quantumOrbitalClosure: model.state.closures.quantumOrbital
      },
      enableWebGPU: false
    }
  });
  assert.equal(molecularResult.diagnostics.quantumCouplingApplied, true);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionSource, 'webgpu-worker');
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionBackend, 'webgpu-orbital-grid-wavefunction-evolution-reduction');
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionWebgpuExecuted, true);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionLiveBackendPolicy, QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionKineticExpectationEv, 75.1);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionPotentialExpectationEv, -150);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionFieldEnergyExpectationEv, 0.004);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionElectricFieldVm, 250000000);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionDipoleMomentZBohrElectron, 0.012);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionPolarizabilityProxyBohr3, 24);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionFieldResponseSchema, QUANTUM_ORBITAL_GRID_FIELD_RESPONSE_WEBGPU_SCHEMA);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionMagneticFieldT, 5);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionZeemanEnergyExpectationEv, 0.00029);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionMagneticMomentProjectionBohrMagneton, -1);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionMagneticResponseSchema, QUANTUM_ORBITAL_GRID_MAGNETIC_RESPONSE_WEBGPU_SCHEMA);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionVirialResidualEv, 0.2);
  assert.equal(molecularResult.diagnostics.quantumWavefunctionEvolutionHamiltonianComponentsSchema, QUANTUM_ORBITAL_GRID_HAMILTONIAN_COMPONENTS_WEBGPU_SCHEMA);
  assert.equal(molecularResult.diagnostics.quantumStatisticalBridgeSchema, QUANTUM_ORBITAL_GRID_STATISTICAL_BRIDGE_SCHEMA);
  assert.equal(molecularResult.diagnostics.quantumStatisticalBridgeSource, 'webgpu-worker');
  assert.equal(molecularResult.diagnostics.quantumStatisticalBridgeWebgpuExecuted, true);
  assert.equal(molecularResult.diagnostics.quantumStatisticalBridgeHeatCapacityProxy, 0.087);
  assert.equal(molecularResult.diagnostics.quantumStatisticalBridgeTemperatureDeltaKProxy, 0.54);
  assert.equal(molecularResult.diagnostics.quantumRadialEigenstateSchema, QUANTUM_ORBITAL_GRID_RADIAL_WEBGPU_SCHEMA);
  assert.equal(molecularResult.diagnostics.quantumRadialEigenstateSource, 'webgpu-worker');
  assert.equal(molecularResult.diagnostics.quantumRadialEigenstateWebgpuExecuted, true);
  assert.equal(molecularResult.diagnostics.quantumRadialEigenstateEnergyEv, -75.4);
  assert.equal(molecularResult.diagnostics.quantumCouplingApplication.wavefunctionEvolutionSource, 'webgpu-worker');
  assert.equal(molecularResult.diagnostics.quantumCouplingApplication.wavefunctionEvolutionKineticExpectationEv, 75.1);
  assert.equal(molecularResult.diagnostics.quantumCouplingApplication.wavefunctionEvolutionFieldEnergyExpectationEv, 0.004);
  assert.equal(molecularResult.diagnostics.quantumCouplingApplication.wavefunctionEvolutionFieldResponseSchema, QUANTUM_ORBITAL_GRID_FIELD_RESPONSE_WEBGPU_SCHEMA);
  assert.equal(molecularResult.diagnostics.quantumCouplingApplication.wavefunctionEvolutionZeemanEnergyExpectationEv, 0.00029);
  assert.equal(molecularResult.diagnostics.quantumCouplingApplication.wavefunctionEvolutionMagneticResponseSchema, QUANTUM_ORBITAL_GRID_MAGNETIC_RESPONSE_WEBGPU_SCHEMA);
  assert.equal(molecularResult.diagnostics.quantumCouplingApplication.wavefunctionEvolutionVirialResidualEv, 0.2);
  assert.equal(molecularResult.diagnostics.quantumCouplingApplication.statisticalBridgeSchema, QUANTUM_ORBITAL_GRID_STATISTICAL_BRIDGE_SCHEMA);
  assert.equal(molecularResult.diagnostics.quantumCouplingApplication.statisticalBridgeSource, 'webgpu-worker');
  assert.equal(molecularResult.diagnostics.quantumCouplingApplication.statisticalBridgeTemperatureDeltaKProxy, 0.54);
  assert.equal(molecularResult.diagnostics.quantumCouplingApplication.radialEigenstateSource, 'webgpu-worker');
});

test('model emits solver-agnostic multiscale packets', () => {
  const model = new MultiscaleModel();
  model.setLayerById('surface');
  model.setEnvironment({
    oxygenFraction: 0.25,
    gravityMps2: 12,
    stellarFlux: 1.4,
    ambientTemperatureK: 360,
    ambientPressurePa: 150000
  });
  const packet = model.update(0.1);
  assert.equal(packet.schema, 'peercompute.multiscale.packet.v0');
  assert.equal(packet.activeLayer, 'surface');
  assert.equal(packet.downward.boundaryConditions.oxygenFraction, 0.25);
  assert.equal(packet.downward.boundaryConditions.ambientTemperatureK, 360);
  assert.equal(packet.downward.boundaryConditions.ambientPressurePa, 150000);
  assert.ok(packet.upward.closures.fireIntensity > 0);
  assert.equal(packet.upward.aggregateState.quantumOrbital.schema, QUANTUM_ORBITAL_CLOSURE_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumOrbital.modelId, QUANTUM_ORBITAL_MODEL_ID);
  assert.equal(packet.upward.aggregateState.quantumOrbital.elementSymbol, 'O');
  assert.equal(packet.upward.aggregateState.quantumOrbital.activeOrbital, '2p');
  assert.equal(packet.upward.aggregateState.quantumOrbital.electronConfiguration, '1s2 2s2 2p4');
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridSchema, QUANTUM_ORBITAL_FINITE_GRID_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridBackend, 'cpu-finite-grid-reference');
  assert.ok(packet.upward.aggregateState.quantumOrbital.finiteGridSampleCount > 0);
  assert.ok(Number.isFinite(packet.upward.aggregateState.quantumOrbital.finiteGridNormError));
  assert.ok(Number.isFinite(packet.upward.aggregateState.quantumOrbital.finiteGridBoundaryMass));
  assert.ok(Number.isFinite(packet.upward.aggregateState.quantumOrbital.finiteGridMeanRadiusBohr));
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridEigenResidualSchema, QUANTUM_ORBITAL_EIGEN_RESIDUAL_SCHEMA);
  assert.ok(Number.isFinite(packet.upward.aggregateState.quantumOrbital.finiteGridEigenResidualRelativeL2));
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridWavefunctionEvolutionSchema, QUANTUM_ORBITAL_WAVEFUNCTION_EVOLUTION_SCHEMA);
  assert.ok(Number.isFinite(packet.upward.aggregateState.quantumOrbital.finiteGridWavefunctionEvolutionNormDrift));
  assert.ok(Number.isFinite(packet.upward.aggregateState.quantumOrbital.finiteGridWavefunctionEvolutionDensityDriftL1));
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridRadialEigenstateSchema, QUANTUM_ORBITAL_RADIAL_EIGENSTATE_SCHEMA);
  assert.ok(Number.isFinite(packet.upward.aggregateState.quantumOrbital.finiteGridRadialEigenstateEnergyEv));
  assert.ok(Number.isFinite(packet.upward.aggregateState.quantumOrbital.finiteGridRadialEigenstateResidualRelativeL2));
  assert.equal(packet.upward.aggregateState.quantumOrbital.bondingTendency, 'polar-covalent-acceptor');
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.schema, QUANTUM_MATERIAL_POTENTIAL_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.modelId, QUANTUM_MATERIAL_POTENTIAL_MODEL_ID);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.materialId, 'element.o.reference-table-v0');
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.elementSymbol, 'O');
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.potentialTerms.materialPropertiesAvailable, true);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.potentialTerms.statisticalEnsembleAvailable, true);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.potentialTerms.statisticalEnsembleSchema, QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.potentialTerms.bornOppenheimerForcesAvailable, false);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.potentialTerms.reducedEnergyGradientAvailable, false);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.potentialTerms.reactionBarrierSurfaceAvailable, false);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.forceSurfacePreview.schema, QUANTUM_MATERIAL_FORCE_SURFACE_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.forceSurfacePreview.bornOppenheimerForcesAvailable, false);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.forceSurfacePreview.reducedEnergyGradientAvailable, false);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.statisticalEnsemble.schema, QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.statisticalEnsemble.firstPrinciplesUniversal, false);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.statisticalEnsemble.acceptableClosureIfLabeled, true);
  assert.ok(Number.isFinite(packet.upward.aggregateState.quantumMaterialPotential.statisticalEnsemble.partitionFunctionLog));
  assert.ok(Number.isFinite(packet.upward.aggregateState.quantumMaterialPotential.statisticalEnsemble.opacityProxy));
  assert.ok(Number.isFinite(packet.upward.aggregateState.quantumMaterialPotential.statisticalEnsemble.ensemblePressurePa));
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.lawGraphFragment.schema, QUANTUM_MATERIAL_LAW_GRAPH_FRAGMENT_SCHEMA);
  assert.ok(packet.upward.aggregateState.quantumMaterialPotential.lawGraphFragment.stateNodeCount > 0);
  assert.ok(packet.upward.aggregateState.quantumMaterialPotential.lawGraphFragment.lawNodeCount > 0);
  assert.ok(packet.upward.aggregateState.quantumMaterialPotential.lawGraphFragment.lawNodes.some((node) => node.id === 'law:quantum-statistical-ensemble-bridge'));
  assert.equal(packet.lawGraph.schema, MULTISCALE_LAW_GRAPH_CONSISTENCY_SCHEMA);
  assert.equal(packet.lawGraph.modelId, 'bipartite-state-law-consistency-v0');
  assert.equal(packet.lawGraph.proxyConsistent, true);
  assert.equal(packet.lawGraph.scientificReady, false);
  assert.equal(packet.lawGraph.updatePlan.schema, MULTISCALE_LAW_GRAPH_UPDATE_PLAN_SCHEMA);
  assert.equal(packet.lawGraph.updatePlan.modelId, 'bipartite-state-law-update-planner-v0');
  assert.equal(packet.lawGraph.updatePlan.status, 'proxy-update-plan-ready-scientific-blocked');
  assert.ok(packet.lawGraph.updatePlan.operationCount > 0);
  assert.ok(packet.lawGraph.updatePlan.runnableOperationCount > 0);
  assert.ok(packet.lawGraph.updatePlan.dispatchReadyOperationCount > 0);
  assert.ok(packet.lawGraph.updatePlan.phaseCount > 0);
  assert.equal(packet.lawGraph.updatePlan.authoritativeMutationReady, false);
  assert.ok(packet.lawGraph.updatePlan.operations.some((operation) => operation.lawNodeId === 'law:quantum-material-potential' && operation.dispatchKind === 'compute-manager-solver-task'));
  assert.ok(packet.lawGraph.updatePlan.operations.some((operation) => operation.lawNodeId === 'law:molecular-source-equation' && operation.scientificBlocked === true));
  assert.equal(packet.lawGraph.consistencySolve.schema, MULTISCALE_LAW_GRAPH_CONSISTENCY_SOLVE_SCHEMA);
  assert.equal(packet.lawGraph.consistencySolve.modelId, 'bipartite-state-law-fixed-point-proxy-v0');
  assert.equal(packet.lawGraph.consistencySolve.status, 'proxy-solve-converged-scientific-blocked');
  assert.equal(packet.lawGraph.consistencySolve.convergedProxy, true);
  assert.equal(packet.lawGraph.consistencySolve.convergedScientific, false);
  assert.ok(packet.lawGraph.consistencySolve.iterationCount > 0);
  assert.ok(packet.lawGraph.consistencySolve.proposedStateUpdateCount > 0);
  assert.equal(packet.lawGraph.consistencySolve.closedResidualProxy, 0);
  assert.ok(packet.lawGraph.consistencySolve.scientificResidual > 0);
  assert.ok(packet.lawGraph.consistencySolve.operationSolves.some((operation) => operation.lawNodeId === 'law:molecular-source-equation' && operation.status === 'proxy-solved-scientific-blocked'));
  assert.ok(packet.lawGraph.consistencySolve.proposedStateUpdates.some((proposal) => proposal.stateNodeId === 'state:quantum-material-potential'));
  assert.equal(packet.lawGraph.proposalAdmission.schema, MULTISCALE_LAW_GRAPH_PROPOSAL_ADMISSION_SCHEMA);
  assert.equal(packet.lawGraph.proposalAdmission.modelId, 'bipartite-state-update-admission-v0');
  assert.equal(packet.lawGraph.proposalAdmission.status, 'proxy-admission-ready-scientific-blocked');
  assert.equal(packet.lawGraph.proposalAdmission.proxyConverged, true);
  assert.equal(packet.lawGraph.proposalAdmission.scientificConverged, false);
  assert.ok(packet.lawGraph.proposalAdmission.proxyWarmDeltaReadyCount > 0);
  assert.ok(packet.lawGraph.proposalAdmission.computeManagerDispatchReadyCount > 0);
  assert.ok(packet.lawGraph.proposalAdmission.scientificBlockedApplicationCount > 0);
  assert.ok(packet.lawGraph.proposalAdmission.stateApplications.some((application) => application.stateNodeId === 'state:quantum-material-potential' && application.canPublishWarmDelta === true));
  assert.ok(packet.lawGraph.proposalAdmission.dispatchAdmissions.some((admission) => admission.solverId === 'quantum-material-potential' && admission.canSubmitToComputeManager === true));
  assert.equal(packet.lawGraph.dispatchQueue.schema, MULTISCALE_LAW_GRAPH_DISPATCH_QUEUE_SCHEMA);
  assert.equal(packet.lawGraph.dispatchQueue.modelId, 'bipartite-law-operation-dispatch-queue-v0');
  assert.equal(packet.lawGraph.dispatchQueue.status, 'proxy-dispatch-ready-scientific-blocked');
  assert.equal(packet.lawGraph.dispatchQueue.proxyConverged, true);
  assert.ok(packet.lawGraph.dispatchQueue.readyEntryCount > 0);
  assert.ok(packet.lawGraph.dispatchQueue.computeManagerReadyCount > 0);
  assert.ok(packet.lawGraph.dispatchQueue.modelLocalReadyCount > 0);
  assert.ok(packet.lawGraph.dispatchQueue.scientificBlockedEntryCount > 0);
  assert.ok(packet.lawGraph.dispatchQueue.entries.some((entry) => entry.solverId === 'quantum-material-potential' && entry.computeManagerReady === true));
  assert.ok(packet.lawGraph.dispatchQueue.batches.some((batch) => batch.executor === 'compute-manager' && batch.computeManagerReadyCount > 0));
  assert.equal(packet.lawGraph.schedulerManifest.schema, MULTISCALE_LAW_GRAPH_SCHEDULER_MANIFEST_SCHEMA);
  assert.equal(packet.lawGraph.schedulerManifest.modelId, 'bipartite-law-operation-scheduler-manifest-v0');
  assert.equal(packet.lawGraph.schedulerManifest.status, 'proxy-scheduler-ready-scientific-blocked');
  assert.equal(packet.lawGraph.schedulerManifest.proxyConverged, true);
  assert.ok(packet.lawGraph.schedulerManifest.readyManifestEntryCount > 0);
  assert.ok(packet.lawGraph.schedulerManifest.schedulerReadyCount > 0);
  assert.ok(packet.lawGraph.schedulerManifest.computeManagerReadyCount > 0);
  assert.ok(packet.lawGraph.schedulerManifest.modelLocalReadyCount > 0);
  assert.ok(packet.lawGraph.schedulerManifest.resolvedDescriptorCount > 0);
  assert.equal(packet.lawGraph.schedulerManifest.unresolvedDescriptorCount, 0);
  assert.equal(packet.lawGraph.schedulerManifest.executorMissingCount, 0);
  assert.ok(packet.lawGraph.schedulerManifest.scientificBlockedEntryCount > 0);
  assert.ok(packet.lawGraph.schedulerManifest.entries.some((entry) => (
    entry.solverId === 'quantum-material-potential'
    && entry.descriptorResolved === true
    && entry.hasExecutor === true
    && entry.readyForScheduler === true
    && entry.warmDeltaScope === 'multiscale-solver-deltas'
    && entry.warmDeltaSchema === 'peercompute.multiscale.quantum-material-potential.delta.v0'
  )));
  assert.ok(packet.lawGraph.schedulerManifest.batches.some((batch) => (
    batch.schedulerLane === 'compute-manager'
    && batch.schedulerReadyCount > 0
  )));
  assert.equal(packet.lawGraph.schedulerExecutionAudit.schema, MULTISCALE_LAW_GRAPH_SCHEDULER_EXECUTION_AUDIT_SCHEMA);
  assert.equal(packet.lawGraph.schedulerExecutionAudit.modelId, 'bipartite-law-operation-scheduler-execution-audit-v0');
  assert.equal(packet.lawGraph.schedulerExecutionAudit.status, 'scheduler-execution-evidence-unavailable');
  assert.equal(packet.lawGraph.schedulerExecutionAudit.evidenceAvailable, false);
  assert.equal(packet.lawGraph.schedulerExecutionAudit.executionRequiredCount, packet.lawGraph.schedulerManifest.schedulerReadyCount);
  assert.equal(packet.lawGraph.schedulerExecutionAudit.executionObservedCount, 0);
  assert.ok(packet.lawGraph.schedulerExecutionAudit.missingRuntimeCount > 0);
  assert.equal(packet.lawGraph.resultAdmission.schema, MULTISCALE_LAW_GRAPH_RESULT_ADMISSION_SCHEMA);
  assert.equal(packet.lawGraph.resultAdmission.modelId, 'bipartite-law-operation-result-admission-v0');
  assert.equal(packet.lawGraph.resultAdmission.status, 'result-admission-evidence-unavailable');
  assert.equal(packet.lawGraph.resultAdmission.evidenceAvailable, false);
  const workerResultAdmissionRequiredCount = packet.lawGraph.schedulerExecutionAudit.entries
    .filter((entry) => entry.executionRequired && entry.resultAdmissionRequired).length;
  assert.equal(packet.lawGraph.resultAdmission.resultAdmissionRequiredCount, workerResultAdmissionRequiredCount);
  assert.ok(packet.lawGraph.resultAdmission.resultAdmissionRequiredCount <= packet.lawGraph.schedulerExecutionAudit.resultAdmissionRequiredCount);
  assert.equal(packet.lawGraph.resultAdmission.proxyAdmittedCount, 0);
  assert.ok(packet.lawGraph.resultAdmission.missingRuntimeCount > 0);
  assert.equal(packet.lawGraph.stateApplicationPreflight.schema, MULTISCALE_LAW_GRAPH_STATE_APPLICATION_PREFLIGHT_SCHEMA);
  assert.equal(packet.lawGraph.stateApplicationPreflight.modelId, 'bipartite-law-operation-state-application-preflight-v0');
  assert.equal(packet.lawGraph.stateApplicationPreflight.status, 'state-application-evidence-unavailable');
  assert.equal(packet.lawGraph.stateApplicationPreflight.evidenceAvailable, false);
  assert.equal(packet.lawGraph.stateApplicationPreflight.applicationPreflightRequiredCount, packet.lawGraph.resultAdmission.resultAdmissionRequiredCount);
  assert.equal(packet.lawGraph.stateApplicationPreflight.proxyApplicationReadyCount, 0);
  assert.ok(packet.lawGraph.stateApplicationPreflight.waitingResultAdmissionCount > 0);
  const evidencePacket = model.createPacket({
    solverRuntimeEvidence: {
      schema: 'peercompute.multiscale.solver-runtime.v0',
      quantumMaterialPotential: {
        solverId: 'quantum-material-potential',
        taskId: 'solver:quantum-material-potential',
        stateKey: 'quantum-material-potential:default',
        pending: false,
        submittedTasks: 1,
        completedTasks: 1,
        failedTasks: 0,
        cadenceFrames: 2,
        lastResult: {
          schema: 'peercompute.multiscale.quantum-material-potential.result.v0',
          solverId: 'quantum-material-potential',
          backend: 'cpu-reference',
          sequence: 7
        }
      }
    },
    solverWarmDeltas: {
      'solver:quantum-material-potential': {
        schema: 'peercompute.multiscale.quantum-material-potential.delta.v0',
        solverId: 'quantum-material-potential',
        backend: 'cpu-reference',
        sequence: 7,
        version: 7
      }
    }
  });
  assert.equal(evidencePacket.lawGraph.schedulerExecutionAudit.schema, MULTISCALE_LAW_GRAPH_SCHEDULER_EXECUTION_AUDIT_SCHEMA);
  assert.equal(evidencePacket.lawGraph.schedulerExecutionAudit.status, 'scheduler-execution-partial');
  assert.equal(evidencePacket.lawGraph.schedulerExecutionAudit.evidenceAvailable, true);
  assert.ok(evidencePacket.lawGraph.schedulerExecutionAudit.executionObservedCount >= 1);
  assert.ok(evidencePacket.lawGraph.schedulerExecutionAudit.runtimeMatchedCount >= 1);
  assert.ok(evidencePacket.lawGraph.schedulerExecutionAudit.warmDeltaMatchedCount >= 1);
  assert.ok(evidencePacket.lawGraph.schedulerExecutionAudit.entries.some((entry) => (
    entry.solverDescriptorId === 'quantum-material-potential'
    && entry.status === 'worker-result-and-warm-delta-observed'
    && entry.resultBackend === 'cpu-reference'
    && entry.warmDeltaSchema === 'peercompute.multiscale.quantum-material-potential.delta.v0'
  )));
  assert.equal(evidencePacket.lawGraph.resultAdmission.schema, MULTISCALE_LAW_GRAPH_RESULT_ADMISSION_SCHEMA);
  assert.equal(evidencePacket.lawGraph.resultAdmission.evidenceAvailable, true);
  assert.ok(evidencePacket.lawGraph.resultAdmission.proxyAdmittedCount >= 1);
  assert.ok([
    'result-admission-partial-scientific-blocked',
    'result-admission-partial',
    'proxy-result-admission-ready-scientific-blocked',
    'proxy-result-admission-ready'
  ].includes(evidencePacket.lawGraph.resultAdmission.status));
  assert.ok(evidencePacket.lawGraph.resultAdmission.entries.some((entry) => (
    entry.solverDescriptorId === 'quantum-material-potential'
    && entry.proxyAdmitted === true
    && ['proxy-result-admitted-scientific-blocked', 'proxy-result-admitted'].includes(entry.status)
    && entry.resultSchema === 'peercompute.multiscale.quantum-material-potential.result.v0'
    && entry.warmDeltaSchema === 'peercompute.multiscale.quantum-material-potential.delta.v0'
  )));
  assert.equal(evidencePacket.lawGraph.stateApplicationPreflight.schema, MULTISCALE_LAW_GRAPH_STATE_APPLICATION_PREFLIGHT_SCHEMA);
  assert.equal(evidencePacket.lawGraph.stateApplicationPreflight.evidenceAvailable, true);
  assert.ok(evidencePacket.lawGraph.stateApplicationPreflight.proxyApplicationReadyCount >= 1);
  assert.ok(evidencePacket.lawGraph.stateApplicationPreflight.stateApplicationLinkCount >= 1);
  assert.ok([
    'state-application-partial-scientific-blocked',
    'state-application-partial',
    'proxy-state-application-ready-scientific-blocked',
    'proxy-state-application-ready'
  ].includes(evidencePacket.lawGraph.stateApplicationPreflight.status));
  assert.ok(evidencePacket.lawGraph.stateApplicationPreflight.entries.some((entry) => (
    entry.solverDescriptorId === 'quantum-material-potential'
    && entry.proxyApplicationReady === true
    && entry.stateApplicationLinked === true
    && entry.stateApplicationIds.length > 0
    && entry.stateManagerScopes.includes('multiscale-closures')
    && ['proxy-state-application-ready-scientific-blocked', 'proxy-state-application-ready'].includes(entry.status)
  )));
  assert.ok(packet.lawGraph.stateNodeCount >= packet.upward.aggregateState.quantumMaterialPotential.lawGraphFragment.stateNodeCount);
  assert.ok(packet.lawGraph.lawNodeCount > 0);
  assert.ok(packet.lawGraph.constraintNodeCount > 0);
  assert.ok(packet.lawGraph.edgeCount > packet.upward.aggregateState.quantumMaterialPotential.lawGraphFragment.edgeCount);
  assert.ok(packet.lawGraph.fragments.some((fragment) => fragment.schema === QUANTUM_MATERIAL_LAW_GRAPH_FRAGMENT_SCHEMA));
  assert.ok(packet.lawGraph.edges.some((edge) => edge.sourceNodeId === 'state:quantum-material-potential' && edge.targetNodeId === 'law:molecular-dynamics'));
  assert.equal(packet.upward.aggregateState.lawGraph.schema, MULTISCALE_LAW_GRAPH_CONSISTENCY_SCHEMA);
  assert.equal(packet.upward.aggregateState.lawGraph.proxyConsistent, true);
  assert.equal(packet.upward.aggregateState.lawGraph.scientificReady, false);
  assert.equal(packet.upward.aggregateState.lawGraph.updatePlan.schema, MULTISCALE_LAW_GRAPH_UPDATE_PLAN_SCHEMA);
  assert.equal(packet.upward.aggregateState.lawGraph.updatePlan.operationCount, packet.lawGraph.updatePlan.operationCount);
  assert.equal(packet.upward.aggregateState.lawGraph.consistencySolve.schema, MULTISCALE_LAW_GRAPH_CONSISTENCY_SOLVE_SCHEMA);
  assert.equal(packet.upward.aggregateState.lawGraph.consistencySolve.proposedStateUpdateCount, packet.lawGraph.consistencySolve.proposedStateUpdateCount);
  assert.equal(packet.upward.aggregateState.lawGraph.proposalAdmission.schema, MULTISCALE_LAW_GRAPH_PROPOSAL_ADMISSION_SCHEMA);
  assert.equal(packet.upward.aggregateState.lawGraph.proposalAdmission.proxyWarmDeltaReadyCount, packet.lawGraph.proposalAdmission.proxyWarmDeltaReadyCount);
  assert.equal(packet.upward.aggregateState.lawGraph.dispatchQueue.schema, MULTISCALE_LAW_GRAPH_DISPATCH_QUEUE_SCHEMA);
  assert.equal(packet.upward.aggregateState.lawGraph.dispatchQueue.computeManagerReadyCount, packet.lawGraph.dispatchQueue.computeManagerReadyCount);
  assert.equal(packet.upward.aggregateState.lawGraph.schedulerManifest.schema, MULTISCALE_LAW_GRAPH_SCHEDULER_MANIFEST_SCHEMA);
  assert.equal(packet.upward.aggregateState.lawGraph.schedulerManifest.resolvedDescriptorCount, packet.lawGraph.schedulerManifest.resolvedDescriptorCount);
  assert.equal(packet.upward.aggregateState.lawGraph.schedulerExecutionAudit.schema, MULTISCALE_LAW_GRAPH_SCHEDULER_EXECUTION_AUDIT_SCHEMA);
  assert.equal(packet.upward.aggregateState.lawGraph.schedulerExecutionAudit.executionObservedCount, packet.lawGraph.schedulerExecutionAudit.executionObservedCount);
  assert.equal(packet.upward.aggregateState.lawGraph.resultAdmission.schema, MULTISCALE_LAW_GRAPH_RESULT_ADMISSION_SCHEMA);
  assert.equal(packet.upward.aggregateState.lawGraph.resultAdmission.proxyAdmittedCount, packet.lawGraph.resultAdmission.proxyAdmittedCount);
  assert.equal(packet.upward.aggregateState.lawGraph.stateApplicationPreflight.schema, MULTISCALE_LAW_GRAPH_STATE_APPLICATION_PREFLIGHT_SCHEMA);
  assert.equal(packet.upward.aggregateState.lawGraph.stateApplicationPreflight.proxyApplicationReadyCount, packet.lawGraph.stateApplicationPreflight.proxyApplicationReadyCount);
  assert.equal(packet.upward.closures.lawGraphStateNodeCount, packet.lawGraph.stateNodeCount);
  assert.equal(packet.upward.closures.lawGraphScientificReady, 0);
  assert.equal(packet.upward.closures.lawGraphUpdatePlanOperationCount, packet.lawGraph.updatePlan.operationCount);
  assert.equal(packet.upward.closures.lawGraphUpdatePlanAuthoritativeMutationReady, 0);
  assert.equal(packet.upward.closures.lawGraphConsistencySolveProxyConverged, 1);
  assert.equal(packet.upward.closures.lawGraphConsistencySolveScientificConverged, 0);
  assert.equal(packet.upward.closures.lawGraphConsistencySolveClosedResidualProxy, 0);
  assert.ok(packet.upward.closures.lawGraphConsistencySolveProposedStateUpdateCount > 0);
  assert.equal(packet.upward.closures.lawGraphProposalAdmissionProxyWarmDeltaReadyCount, packet.lawGraph.proposalAdmission.proxyWarmDeltaReadyCount);
  assert.equal(packet.upward.closures.lawGraphProposalAdmissionComputeManagerDispatchReadyCount, packet.lawGraph.proposalAdmission.computeManagerDispatchReadyCount);
  assert.ok(packet.upward.closures.lawGraphProposalAdmissionScientificBlockedApplicationCount > 0);
  assert.equal(packet.upward.closures.lawGraphDispatchQueueComputeManagerReadyCount, packet.lawGraph.dispatchQueue.computeManagerReadyCount);
  assert.ok(packet.upward.closures.lawGraphDispatchQueueReadyEntryCount > 0);
  assert.ok(packet.upward.closures.lawGraphDispatchQueueScientificBlockedEntryCount > 0);
  assert.equal(packet.upward.closures.lawGraphSchedulerManifestComputeManagerReadyCount, packet.lawGraph.schedulerManifest.computeManagerReadyCount);
  assert.equal(packet.upward.closures.lawGraphSchedulerManifestResolvedDescriptorCount, packet.lawGraph.schedulerManifest.resolvedDescriptorCount);
  assert.ok(packet.upward.closures.lawGraphSchedulerManifestReadyEntryCount > 0);
  assert.ok(packet.upward.closures.lawGraphSchedulerManifestScientificBlockedEntryCount > 0);
  assert.equal(packet.upward.closures.lawGraphSchedulerExecutionAuditObservedCount, packet.lawGraph.schedulerExecutionAudit.executionObservedCount);
  assert.equal(packet.upward.closures.lawGraphSchedulerExecutionAuditMissingRuntimeCount, packet.lawGraph.schedulerExecutionAudit.missingRuntimeCount);
  assert.equal(packet.upward.closures.lawGraphResultAdmissionProxyAdmittedCount, packet.lawGraph.resultAdmission.proxyAdmittedCount);
  assert.equal(packet.upward.closures.lawGraphResultAdmissionMissingRuntimeCount, packet.lawGraph.resultAdmission.missingRuntimeCount);
  assert.equal(packet.upward.closures.lawGraphStateApplicationProxyReadyCount, packet.lawGraph.stateApplicationPreflight.proxyApplicationReadyCount);
  assert.equal(packet.upward.closures.lawGraphStateApplicationWaitingResultCount, packet.lawGraph.stateApplicationPreflight.waitingResultAdmissionCount);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.behaviorSurface.behaviorHooks.opticalResponse, true);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.conditions.temperatureK, 360);
  assert.equal(packet.upward.closureResults.quantumMaterialPotential.schema, CLOSURE_RESULT_SCHEMA);
  assert.equal(typeof packet.upward.closures.quantumOrbitalEnergyEv, 'number');
  assert.equal(packet.upward.closures.quantumMaterialPotentialStatus, 'property-ready-proxy-force-missing');
  assert.equal(typeof packet.upward.closures.quantumMaterialPotentialDensityKgM3, 'number');
  assert.equal(packet.upward.closures.quantumMaterialPotentialReducedForceGradientAvailable, 0);
  assert.ok(packet.upward.closures.quantumMaterialPotentialForceSurfaceMeanGradientEvPerAngstrom >= 0);
  assert.ok(packet.upward.closures.quantumMaterialPotentialLawGraphStateNodeCount > 0);
  assert.equal(packet.upward.closures.quantumStatisticalEnsembleStatus, 'ensemble-bridge-proxy-ready');
  assert.equal(typeof packet.upward.closures.quantumStatisticalEnsembleIonizationFraction, 'number');
  assert.equal(typeof packet.upward.closures.quantumStatisticalEnsembleOpacityProxy, 'number');
  assert.equal(typeof packet.upward.closures.quantumStatisticalEnsembleDegeneracyParameter, 'number');
  assert.equal(typeof packet.upward.closures.quantumStatisticalEnsemblePressurePa, 'number');
  assert.equal(packet.upward.closureResults.quantumMaterialPotential.statistical.schema, QUANTUM_STATISTICAL_CLOSURE_SCHEMA);
  assert.equal(packet.upward.closureResults.quantumMaterialPotential.statistical.ensembleSchema, QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA);
  assert.equal(packet.upward.closureResults.quantumMaterialPotential.statistical.sourceEquation.schema, QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA);
  assert.equal(packet.upward.closureResults.quantumMaterialPotential.statistical.sourceEquation.adapterSchema, MOLECULAR_SOURCE_EQUATION_SCHEMA);
  assert.equal(packet.upward.closureResults.quantumMaterialPotential.statistical.sourceEquation.channelCount, 5);
  assert.equal(typeof packet.upward.closureResults.quantumMaterialPotential.statistical.ensemblePressurePa, 'number');
  assert.equal(typeof packet.upward.closureResults.quantumMaterialPotential.statistical.opacityProxy, 'number');
  assert.equal(typeof packet.upward.closureResults.quantumMaterialPotential.statistical.ionizationFraction, 'number');
  assert.equal(typeof packet.upward.closureResults.quantumMaterialPotential.statistical.degeneracyParameter, 'number');
  assert.equal(typeof packet.upward.closureResults.quantumMaterialPotential.statistical.heatCapacityProxy, 'number');
  assert.equal(packet.upward.closureResults.quantumMaterialPotential.chemistry.statisticalEnsemble.schema, QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA);
  assert.equal(typeof packet.upward.closures.quantumEffectiveZ, 'number');
  assert.equal(typeof packet.upward.closures.quantumIonizationFraction, 'number');
  assert.equal(typeof packet.upward.closures.quantumFiniteGridNormError, 'number');
  assert.equal(typeof packet.upward.closures.quantumFiniteGridBoundaryMass, 'number');
  assert.equal(typeof packet.upward.closures.quantumFiniteGridEigenResidualRelativeL2, 'number');
  assert.equal(typeof packet.upward.closures.quantumFiniteGridWavefunctionEvolutionNormDrift, 'number');
  assert.equal(packet.upward.closureResults.quantumOrbital.schema, CLOSURE_RESULT_SCHEMA);
  assert.equal(packet.upward.closureResults.quantumOrbital.source.solverId, 'quantum-orbital-closure');
  assert.ok('conservation' in packet);
  assert.equal(packet.conservation.schema, MULTISCALE_CONSERVATION_AUDIT_SCHEMA);
  assert.equal(packet.conservation.mode, 'interactive-proxy');
  assert.ok(Number.isFinite(packet.conservation.massRelativeError));
  assert.ok(Number.isFinite(packet.conservation.energyResidualProxy));
  assert.ok(Array.isArray(packet.conservation.trackedCouplings));
  assert.equal(packet.conservation.fieldMetadata.schema, MULTISCALE_FIELD_METADATA_REPORT_SCHEMA);
  assert.equal(packet.conservation.residuals.massRelativeError.metadata.unit, '1');
  assert.equal(packet.conservation.residuals.energyResidualProxy.metadata.unitStatus, 'reduced-proxy');
  assert.equal(packet.coupling.schema, MULTISCALE_CROSS_SCALE_COUPLING_SCHEMA);
  assert.equal(packet.coupling.mode, 'interactive-proxy');
  assert.ok(packet.coupling.linkCount >= 10);
  assert.ok(packet.coupling.activeLinkCount > 0);
  assert.equal(packet.coupling.fieldMetadata.schema, MULTISCALE_FIELD_METADATA_REPORT_SCHEMA);
  assert.ok(packet.coupling.fieldMetadata.fieldCount >= packet.coupling.linkCount);
  assert.equal(packet.coupling.fieldCompatibility.schema, MULTISCALE_FIELD_COMPATIBILITY_REPORT_SCHEMA);
  assert.equal(packet.coupling.fieldCompatibility.checkCount, packet.coupling.linkCount);
  assert.equal(packet.coupling.fieldCompatibility.criticalIssueCount, 0);
  assert.ok(packet.coupling.fieldCompatibility.adapterRequiredCount > 0);
  assert.equal(packet.coupling.fieldAdapterPlan.schema, MULTISCALE_FIELD_ADAPTER_PLAN_SCHEMA);
  assert.equal(packet.coupling.fieldAdapterPlan.adapterCount, packet.coupling.linkCount);
  assert.equal(packet.coupling.fieldAdapterPlan.blockedAdapterCount, 0);
  assert.ok(packet.coupling.fieldAdapterPlan.stubRequiredCount > 0);
  assert.equal(packet.coupling.fieldTransfer.schema, MULTISCALE_FIELD_TRANSFER_REPORT_SCHEMA);
  assert.equal(packet.coupling.fieldTransfer.transferCount, packet.coupling.linkCount);
  assert.ok(packet.coupling.fieldTransfer.executedTransferCount > 0);
  assert.ok(packet.coupling.fieldTransfer.skippedStubTransferCount > 0);
  assert.equal(packet.coupling.fieldTransfer.blockedTransferCount, 0);
  assert.equal(packet.coupling.environment.ambientTemperatureK, 360);
  assert.equal(packet.coupling.environment.ambientPressurePa, 150000);
  assert.ok(packet.coupling.links.some((link) => link.id === 'environment-to-atomic-material'));

  const clamped = model.setEnvironment({
    ambientTemperatureK: 12,
    ambientPressurePa: -10,
    oxygenFraction: 2,
    gravityMps2: 99,
    stellarFlux: 99
  });
  assert.equal(clamped.ambientTemperatureK, 80);
  assert.equal(clamped.ambientPressurePa, 100);
  assert.equal(clamped.oxygenFraction, 0.35);
  assert.equal(clamped.gravityMps2, 24);
  assert.equal(clamped.stellarFlux, 2.8);
});

test('ULG live kernel passes are WebGPU-only', () => {
  const pass = createKernelPassSpec({
    id: 'test:cpu-live-pass',
    backend: 'cpu_reference',
    executionMode: 'live'
  });

  assert.equal(pass.schema, ULG_KERNEL_PASS_SPEC_SCHEMA);
  assert.equal(pass.validation.ok, false);
  assert.equal(pass.validation.status, 'blocked-live-backend');
  assert.equal(pass.contractValidation.ok, false);
  assert.ok(pass.contractValidation.missing.includes('reads'));
});

test('multiscale packets expose ULG runtime manifest from the Schrodinger material state', () => {
  const model = new MultiscaleModel({ seed: 9 });
  model.setLayerById('orbital');
  model.setEnvironment({
    ambientTemperatureK: 360,
    ambientPressurePa: 150000,
    electricFieldVm: 12,
    magneticFieldT: 0.4,
    gravityMps2: 9.8
  });
  model.setQuantumOrbital({
    elementSymbol: 'O',
    principalN: 2,
    angularL: 1,
    magneticM: 0,
    finiteGridSize: 16
  });

  const packet = model.createPacket();
  const manifest = packet.ulgRuntime;

  assert.equal(manifest.schema, ULG_RUNTIME_MANIFEST_SCHEMA);
  assert.equal(manifest.specVersion, '0.4');
  assert.equal(manifest.liveBackendPolicy, 'webgpu-only-no-cpu-fallback');
  assert.equal(manifest.passDag.schema, ULG_PASS_DAG_SCHEMA);
  assert.equal(manifest.passDag.invalidLivePassCount, 0);
  assert.equal(manifest.passDag.webgpuPassCount, manifest.passDag.passCount);
  assert.equal(manifest.passDag.requiredCorePassCount, 14);
  assert.equal(manifest.passDag.implementedCorePassCount, 14);
  assert.deepEqual(manifest.passDag.missingCorePassIds, []);
  assert.ok(manifest.passDag.passIds.includes('ulg:observeCoarseState'));
  assert.ok(manifest.passDag.passIds.includes('ulg:packPeerDelta'));
  assert.ok(manifest.passDag.passes.every((pass) => pass.backend === 'webgpu'));
  assert.ok(manifest.passDag.passes.every((pass) => pass.executionMode === 'live'));
  assert.ok(manifest.passDag.passes.every((pass) => pass.contractValidation.ok === true));
  assert.ok(manifest.passDag.passes.every((pass) => pass.precision === 'f32'));
  assert.ok(manifest.passDag.passes.every((pass) => pass.deterministic === true));
  assert.ok(manifest.passDag.passes.every((pass) => Array.isArray(pass.validates) && pass.validates.length > 0));
  assert.equal(manifest.quantumTaskCapsule.validation.status, 'ready');
  assert.equal(manifest.lawTaskCapsule.validation.status, 'ready');
  assert.ok(manifest.hamiltonian.hamiltonianHash.startsWith('sha256:'));
  assert.ok(manifest.materialClosures[0].closureHash.startsWith('sha256:'));
  assert.equal(manifest.materialClosures[0].validity.hasQuantumOrAtomicProvenance, true);
  assert.equal(manifest.materialClosures[0].validity.proxyReady, true);
  assert.equal(manifest.status, 'proxy-runtime-ready-scientific-blocked');
  assert.equal(packet.upward.aggregateState.ulgRuntime.schema, ULG_RUNTIME_MANIFEST_SCHEMA);
  assert.equal(packet.upward.aggregateState.ulgRuntime.specVersion, '0.4');
  assert.equal(packet.upward.aggregateState.ulgRuntime.webgpuPassCount, manifest.webgpuPassCount);
  assert.equal(packet.upward.aggregateState.ulgRuntime.implementedCorePassCount, 14);
  assert.equal(model.state.ulgRuntime.schema, ULG_RUNTIME_MANIFEST_SCHEMA);
});

test('ULG runtime worker is WebGPU-only and publishes compact execution deltas', async () => {
  const model = new MultiscaleModel({ seed: 10 });
  model.setLayerById('orbital');
  model.setEnvironment({
    ambientTemperatureK: 330,
    ambientPressurePa: 125000,
    gravityMps2: 9.8,
    electricFieldVm: 2,
    magneticFieldT: 0.05
  });
  const packet = model.createPacket();
  const result = await stepUlgRuntime({
    solver: { id: 'ulg-runtime' },
    input: {
      taskId: 'ulg:test',
      stateKey: 'ulg:test',
      scope: 'test-ulg-runtime-execution',
      emitCommitDelta: true,
      sequence: 7,
      timeSeconds: model.time,
      manifest: packet.ulgRuntime
    }
  });

  assert.equal(result.value.schema, ULG_RUNTIME_EXECUTION_RESULT_SCHEMA);
  assert.equal(result.value.liveBackendPolicy, 'webgpu-only-no-cpu-fallback');
  assert.equal(result.value.webgpuStatus.schema, ULG_RUNTIME_EXECUTION_WEBGPU_SCHEMA);
  assert.equal(result.value.stateDelta.schema, ULG_RUNTIME_STATE_DELTA_SCHEMA);
  assert.equal(result.value.passCount, packet.ulgRuntime.passDag.passCount);
  assert.equal(result.value.manifestHash.startsWith('sha256:'), true);
  assert.equal(result.commitDelta.payload.schema, ULG_RUNTIME_EXECUTION_DELTA_SCHEMA);
  assert.equal(result.commitDelta.payload.liveBackendPolicy, 'webgpu-only-no-cpu-fallback');
  assert.equal(result.commitDelta.payload.passCount, packet.ulgRuntime.passDag.passCount);
  assert.equal(result.commitDelta.payload.stateDelta.schema, ULG_RUNTIME_STATE_DELTA_SCHEMA);

  if (result.value.status === 'webgpu-executed') {
    assert.equal(result.value.ok, true);
    assert.equal(result.value.backend, 'webgpu-ulg-pass-dag-state-delta');
    assert.equal(result.value.executedPassCount, packet.ulgRuntime.passDag.passCount);
    assert.ok(result.value.totalWorkItems > 0);
    assert.equal(result.value.stateDelta.status, 'webgpu-reduced-state-delta-applied');
    assert.ok(result.value.stateDelta.channelUpdateCount > 0);
    assert.equal(result.value.stateDelta.appliedChannelUpdateCount, result.value.stateDelta.channelUpdateCount);
    assert.equal(result.value.stateDelta.authoritativeWorkerBufferMutation, false);
  } else {
    assert.equal(result.value.ok, false);
    assert.equal(result.value.status, 'blocked-webgpu-unavailable');
    assert.equal(result.value.backend, 'webgpu-unavailable');
    assert.equal(result.value.executedPassCount, 0);
    assert.match(result.value.webgpuStatus.reason, /WebGPU|navigator\.gpu|no CPU fallback/i);
    assert.equal(result.value.stateDelta.status, 'blocked-webgpu-unavailable');
    assert.equal(result.value.stateDelta.channelUpdateCount, 0);
    assert.equal(result.value.stateDelta.proxyStateApplied, false);
  }

  model.applyUlgRuntimeExecutionResult(result.value);
  const packetWithExecution = model.createPacket();
  assert.equal(packetWithExecution.ulgRuntimeExecution.schema, ULG_RUNTIME_EXECUTION_RESULT_SCHEMA);
  assert.equal(packetWithExecution.ulgRuntimeStateDelta.schema, ULG_RUNTIME_STATE_DELTA_SCHEMA);
  assert.equal(packetWithExecution.upward.aggregateState.ulgRuntimeExecution.schema, ULG_RUNTIME_EXECUTION_RESULT_SCHEMA);
  assert.equal(packetWithExecution.upward.aggregateState.ulgRuntimeExecution.status, result.value.status);
  assert.equal(packetWithExecution.upward.aggregateState.ulgRuntimeStateDelta.schema, ULG_RUNTIME_STATE_DELTA_SCHEMA);
  assert.equal(packetWithExecution.upward.aggregateState.ulgRuntimeStateDelta.status, result.value.stateDelta.status);
});

test('model can switch quantum orbital element and finite-grid controls', () => {
  const model = new MultiscaleModel();
  const orbital = model.setQuantumOrbital({
    elementSymbol: 'Cl',
    principalN: 3,
    angularL: 1,
    magneticM: -1,
    finiteGridSize: 14
  });
  assert.equal(orbital.elementSymbol, 'Cl');
  assert.equal(orbital.activeOrbitalLabel, '3p');
  assert.equal(orbital.magneticM, -1);
  assert.equal(orbital.finiteGridSize, 14);
  assert.equal(orbital.finiteGridSampleCount, 2744);
  assert.equal(orbital.finiteGridSchema, QUANTUM_ORBITAL_FINITE_GRID_SCHEMA);
  assert.equal(orbital.bondingTendency, 'ionic-acceptor');
  const packet = model.update(0.016);
  assert.equal(packet.upward.aggregateState.quantumOrbital.elementSymbol, 'Cl');
  assert.equal(packet.upward.aggregateState.quantumOrbital.activeOrbital, '3p');
  assert.equal(packet.upward.aggregateState.quantumOrbital.finiteGridSize, 14);
  assert.equal(packet.upward.aggregateState.quantumOrbital.bondingTendency, 'ionic-acceptor');
});

test('conservation audit reports coupled open-system residuals', () => {
  const model = new MultiscaleModel();
  model.state.balloon.waterMassKg = 0.37;
  model.state.balloon.steamMassKg = 0.02;
  model.state.balloon.spillReleasedKg = 0.01;
  model.state.surface.radiativeHeatFlux = 120;
  model.state.surface.waterContact = 0.35;
  model.state.surface.reactiveCell = {
    ...model.state.surface.reactiveCell,
    heatReleaseNorm: 0.72,
    speciesInventoryDelta: -0.012
  };
  model.state.surface.combustionPlume = {
    ...model.state.surface.combustionPlume,
    backend: 'cpu-combustion-plume',
    heatReleaseMean: 1400,
    buoyancyFlux: 9.4,
    oxygenDepletion: 0.08,
    fuelRemaining: 0.63,
    suppressionMean: 0.18
  };
  model.state.mpm.sphMaterial = {
    ...model.state.mpm.sphMaterial,
    coolingPotential: 0.42,
    fireContactFraction: 0.18,
    spillImpulse: 0.62,
    groundContactFraction: 0.24,
    momentumDrift: 0.031,
    kineticEnergyDrift: 4.2,
    massDrift: 0.0005
  };
  model.state.planet.hydroAtmosphere.massDrift = 0.002;
  model.state.solar.radiationOpacity.radiationEnergyDrift = 0.004;
  model.state.solar.nbody.relativeEnergyDrift = 0.00002;
  model.state.molecular.molecularDynamics = {
    ...model.state.molecular.molecularDynamics,
    backend: 'cpu-molecular-dynamics',
    atomCount: 24,
    bondCount: 18,
    meanBondOrder: 0.64,
    heatReleaseProxy: 0.42,
    ionizationFraction: 0.03,
    meanTemperatureK: 340,
    energyDelta: 0.02,
    chargeDrift: 0.001
  };

  const audit = createConservationAudit({
    state: model.state,
    environment: model.environment,
    timeSeconds: 12.345
  });

  assert.equal(audit.schema, MULTISCALE_CONSERVATION_AUDIT_SCHEMA);
  assert.ok(['interactive-pass', 'interactive-watch', 'interactive-divergent'].includes(audit.status));
  assert.ok(Number.isFinite(audit.massRelativeError));
  assert.ok(Number.isFinite(audit.energyResidualProxy));
  assert.ok(Number.isFinite(audit.speciesResidualProxy));
  assert.equal(audit.water.inventoryKg, 0.4);
  assert.equal(audit.water.releasedKg, 0.01);
  assert.equal(audit.exchange.surfaceRadiativeHeatFlux, 120);
  assert.equal(audit.exchange.sphSpillImpulse, 0.62);
  assert.equal(audit.exchange.molecularBondCount, 18);
  assert.equal(audit.exchange.molecularMeanBondOrder, 0.64);
  assert.equal(audit.fieldMetadata.schema, MULTISCALE_FIELD_METADATA_REPORT_SCHEMA);
  assert.ok(audit.fieldMetadata.physicalFieldCount >= 1);
  assert.ok(audit.fieldMetadata.proxyFieldCount >= 1);
  assert.equal(audit.residuals.massRelativeError.metadata.dimensions, '1');
  assert.equal(audit.exchangeMetadata.surfaceRadiativeHeatFlux.dimensions, 'M T^-3');
  assert.equal(audit.exchangeMetadata.sphSpillImpulse.unitStatus, 'reduced-proxy');
  assert.equal(audit.solverDrift.molecularEnergyDelta, 0.02);
  assert.equal(audit.solverDrift.sphKineticEnergyDrift, 4.2);
  assert.equal(audit.exchange.sphKineticEnergyDrift, 4.2);
  assert.equal(audit.solverDrift.reactiveSpeciesInventoryDelta, -0.012);
  assert.ok(audit.trackedCouplings.some((entry) => entry.includes('radiation-opacity')));
});

test('cross-scale coupling report exposes structured solver handoffs', () => {
  const model = new MultiscaleModel();
  model.setLayerById('mpm');
  model.setEnvironment({
    ambientTemperatureK: 420,
    ambientPressurePa: 180000,
    oxygenFraction: 0.31,
    gravityMps2: 14,
    stellarFlux: 1.8
  });
  model.state.surface.fireIntensity = 0.64;
  model.state.surface.waterContact = 0.48;
  model.state.surface.radiativeHeatFlux = 112;
  model.state.surface.reactiveCell = {
    ...model.state.surface.reactiveCell,
    backend: 'cpu-reactive-thermal',
    heatReleaseNorm: 0.58,
    temperatureK: 1120,
    pressurePa: 160000
  };
  model.state.surface.combustionPlume = {
    ...model.state.surface.combustionPlume,
    backend: 'cpu-combustion-plume',
    fireAreaFraction: 0.36,
    smokeColumn: 0.42,
    heatReleaseMean: 1500,
    plumeRise: 0.58,
    buoyancyFlux: 12,
    oxygenDepletion: 0.08
  };
  model.state.planet.cloudCover = 0.31;
  model.state.planet.precipitation = 0.05;
  model.state.planet.stormEnergy = 0.24;
  model.state.planet.hydroAtmosphere = {
    ...model.state.planet.hydroAtmosphere,
    backend: 'cpu-hydro-atmosphere',
    cloudCover: 0.28,
    precipitationMean: 0.04,
    maxWindMps: 12,
    stormEnergy: 0.22
  };
  model.state.mpm.sphMaterial = {
    ...model.state.mpm.sphMaterial,
    backend: 'cpu-sph-material',
    coolingPotential: 0.72,
    vaporFraction: 0.18,
    fireContactFraction: 0.44
  };
  model.state.molecular.molecularDynamics = {
    ...model.state.molecular.molecularDynamics,
    backend: 'cpu-molecular-dynamics',
    heatReleaseProxy: 0.43,
    meanTemperatureK: 640,
    maxTemperatureK: 760,
    bondCount: 16,
    meanBondOrder: 0.64,
    reactionProgress: 0.37,
    ionizationFraction: 0.02,
    electricalConductivityProxy: 0.05,
    pressureProxy: 0.42,
    energyDelta: 0.018,
    heatReleaseDelta: 0.015,
    species: { H: 10, O: 5 }
  };
  model.state.balloon = {
    ...model.state.balloon,
    internalPressurePa: 154000,
    waterMassKg: 0.36,
    steamMassKg: 0.04,
    membraneIntegrity: 0.46,
    spillImpulse: 0.12,
    membraneShell: {
      ...model.state.balloon.membraneShell,
      backend: 'cpu-membrane-shell',
      membraneIntegrity: 0.46,
      ruptureRisk: 0.68,
      heatFluxMean: 2600,
      ruptured: false
    }
  };
  model.state.solar.radiationPressure = 1.18;
  model.state.solar.stellarFusion = {
    ...model.state.solar.stellarFusion,
    backend: 'cpu-stellar-fusion',
    luminosityFactor: 1.72,
    fusionPowerProxy: 1600,
    coreTemperatureK: 19000000,
    coreDensityKgM3: 84000
  };
  model.state.solar.radiationOpacity = {
    ...model.state.solar.radiationOpacity,
    backend: 'cpu-radiation-opacity',
    sequence: 4,
    width: 16,
    height: 8,
    cellCount: 128,
    meanTemperatureK: 430,
    meanOpacity: 0.12,
    opticalDepth: 1.36,
    greenhouseFactor: 0.54,
    netHeatingPower: 96,
    radiationEnergyDrift: 0.02
  };
  model.state.galaxy.maxwell = {
    ...model.state.galaxy.maxwell,
    backend: 'cpu-maxwell-fdtd',
    fieldEnergy: 1.4,
    poyntingFlux: [0.6, 0.2, 0.1]
  };
  model.state.solar.magnetosphere = {
    ...model.state.solar.magnetosphere,
    backend: 'cpu-magnetosphere-plasma',
    magneticEnergy: 0.82,
    solarWindPressure: 1.6,
    reconnectionRate: 0.34,
    currentSheetIntensity: 0.42,
    meanIonizationFraction: 0.28
  };
  model.state.solar.picPlasmaPatch = {
    ...model.state.solar.picPlasmaPatch,
    backend: 'cpu-pic-plasma-patch',
    reconnectionHeating: 0.018,
    currentDensity: 0.14,
    fieldEnergy: 1.8,
    chargeImbalance: 0.06,
    chargeSeparation: 0.22,
    particleEscapeFraction: 0.08,
    divergenceEProxy: 0.015,
    kineticEnergy: 0.7
  };

  const report = createCrossScaleCouplingReport({
    state: model.state,
    environment: model.environment,
    timeSeconds: 2.5,
    activeLayerId: model.activeLayer.id,
    refinementRequests: ['surface-sph-refinement']
  });

  assert.equal(report.schema, MULTISCALE_CROSS_SCALE_COUPLING_SCHEMA);
  assert.equal(report.activeLayerId, 'mpm');
  assert.equal(report.environment.oxygenFraction, 0.31);
  assert.equal(report.environment.ambientPressurePa, 180000);
  assert.ok(report.activeLinkCount > 0);
  assert.ok(report.activeDirectionCounts.upward > 0);
  assert.ok(report.activeDirectionCounts.downward > 0);
  assert.ok(report.strongestLinks.length > 0);
  assert.ok(report.refinementRequests.includes('surface-sph-refinement'));

  const suppression = report.links.find((link) => link.id === 'sph-water-to-fire-suppression');
  assert.equal(suppression.status, 'active');
  assert.equal(suppression.source.status, 'solver-backed');
  assert.equal(suppression.source.value, 0.72);
  assert.equal(suppression.source.metadata.schema, 'peercompute.multiscale.field-metadata.v0');
  assert.equal(suppression.source.metadata.unit, '1');
  assert.equal(suppression.source.metadata.dimensions, '1');
  assert.equal(suppression.source.metadata.unitStatus, 'dimensionless');
  assert.equal(suppression.target.value, 0.48);
  assert.equal(suppression.target.metadata.quantity, 'water contact suppression fraction');
  assert.ok(suppression.conservation.includes('energy'));

  const boundary = report.links.find((link) => link.id === 'environment-to-atomic-material');
  assert.equal(boundary.direction, 'downward');
  assert.equal(boundary.status, 'active');
  assert.equal(boundary.source.status, 'solver-backed');
  assert.ok(boundary.source.value > 1);
  assert.ok(report.sourceLayerCounts.mpm >= 1);
  assert.ok(report.targetLayerCounts.surface >= 1);
  assert.equal(report.fieldMetadata.schema, MULTISCALE_FIELD_METADATA_REPORT_SCHEMA);
  assert.ok(report.fieldMetadata.physicalFieldCount >= 1);
  assert.ok(report.fieldMetadata.proxyFieldCount >= 1);
  assert.ok(report.fieldMetadata.units['1'] >= 1);
  assert.equal(report.fieldCompatibility.schema, MULTISCALE_FIELD_COMPATIBILITY_REPORT_SCHEMA);
  assert.equal(report.fieldCompatibility.checkCount, report.linkCount);
  assert.equal(report.fieldCompatibility.status, 'adapters-required');
  assert.equal(report.fieldCompatibility.criticalIssueCount, 0);
  assert.ok(report.fieldCompatibility.adapterRequiredCount > 0);
  assert.ok(report.fieldCompatibility.compatibleCount > 0);
  assert.equal(report.fieldAdapterPlan.schema, MULTISCALE_FIELD_ADAPTER_PLAN_SCHEMA);
  assert.equal(report.fieldAdapterPlan.adapterCount, report.linkCount);
  assert.equal(report.fieldAdapterPlan.status, 'adapter-stubs-required');
  assert.equal(report.fieldAdapterPlan.blockedAdapterCount, 0);
  assert.ok(report.fieldAdapterPlan.readyAdapterCount > 0);
  assert.ok(report.fieldAdapterPlan.readyNamedAdapterCount >= 9);
  assert.ok(report.fieldAdapterPlan.stubRequiredCount > 0);
  assert.equal(report.fieldTransfer.schema, MULTISCALE_FIELD_TRANSFER_REPORT_SCHEMA);
  assert.equal(report.fieldTransfer.transferCount, report.linkCount);
  assert.equal(report.fieldTransfer.status, 'partial-with-stubs');
  assert.ok(report.fieldTransfer.executedTransferCount > 0);
  assert.ok(report.fieldTransfer.namedExecutedTransferCount >= 9);
  assert.ok(report.fieldTransfer.skippedStubTransferCount > 0);
  assert.equal(report.fieldTransfer.blockedTransferCount, 0);
  const molecularCompatibility = report.fieldCompatibility.checks.find((check) => check.id === 'molecular-heat-to-reactive-thermal');
  assert.equal(molecularCompatibility.status, 'compatible');
  const molecularAdapter = report.fieldAdapterPlan.adapters.find((adapter) => adapter.id === 'molecular-heat-to-reactive-thermal');
  assert.equal(molecularAdapter.adapterKind, 'reduced-proxy-adapter');
  assert.equal(molecularAdapter.status, 'ready');
  assert.equal(molecularAdapter.executionMode, 'named-response-adapter');
  assert.equal(molecularAdapter.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.molecular-reactive-thermal-source-response.v0');
  assert.ok(molecularAdapter.validationGates.includes('reactive-source-reference-tolerance'));
  const molecularTransfer = report.fieldTransfer.transfers.find((transfer) => transfer.id === 'molecular-heat-to-reactive-thermal');
  assert.equal(molecularTransfer.status, 'executed');
  assert.equal(molecularTransfer.executionMode, 'named-response-adapter');
  assert.equal(molecularTransfer.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.molecular-reactive-thermal-source-response.v0');
  assert.equal(molecularTransfer.source.value, 0.43);
  assert.ok(molecularTransfer.target.predictedValue > 0.4);
  assert.ok(molecularTransfer.target.predictedValue <= 1);
  assert.equal(molecularTransfer.target.observedValue, 0.58);
  assert.equal(molecularTransfer.transform.context.reactionProgress, 0.37);
  assert.equal(molecularTransfer.transform.context.bondCount, 16);
  assert.equal(molecularTransfer.transform.context.species.O, 5);
  assert.equal(molecularTransfer.conservationImpact.mode, 'named-open-system-response');
  assert.equal(molecularTransfer.conservationImpact.sourceSinkMode, 'open-system-molecular-thermal-response');
  assert.equal(molecularTransfer.skippedReason, null);
  const suppressionCompatibility = report.fieldCompatibility.checks.find((check) => check.id === 'sph-water-to-fire-suppression');
  assert.equal(suppressionCompatibility.status, 'compatible');
  const suppressionAdapter = report.fieldAdapterPlan.adapters.find((adapter) => adapter.id === 'sph-water-to-fire-suppression');
  assert.equal(suppressionAdapter.adapterKind, 'dimensionless-response-adapter');
  assert.equal(suppressionAdapter.status, 'ready');
  assert.equal(suppressionAdapter.executionMode, 'named-response-adapter');
  assert.equal(suppressionAdapter.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.sph-water-suppression-response.v0');
  assert.ok(suppressionAdapter.validationGates.includes('suppression-reference-tolerance'));
  assert.equal(suppressionAdapter.conservativeTransferReady, false);
  const suppressionTransfer = report.fieldTransfer.transfers.find((transfer) => transfer.id === 'sph-water-to-fire-suppression');
  assert.equal(suppressionTransfer.status, 'executed');
  assert.equal(suppressionTransfer.executionMode, 'named-response-adapter');
  assert.equal(suppressionTransfer.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.sph-water-suppression-response.v0');
  assert.equal(suppressionTransfer.source.value, 0.72);
  assert.ok(suppressionTransfer.target.predictedValue > 0.48);
  assert.ok(suppressionTransfer.target.predictedValue <= 1);
  assert.equal(suppressionTransfer.target.observedValue, 0.48);
  assert.equal(suppressionTransfer.transform.context.fireContactFraction, 0.44);
  assert.equal(suppressionTransfer.conservationImpact.mode, 'named-open-system-response');
  assert.equal(suppressionTransfer.conservationImpact.sourceSinkMode, 'open-system-water-suppression-response');
  const reactiveCompatibility = report.fieldCompatibility.checks.find((check) => check.id === 'reactive-thermal-to-combustion');
  assert.equal(reactiveCompatibility.status, 'dimensionless-adapter-required');
  assert.equal(reactiveCompatibility.adapterRequired, true);
  const reactiveAdapter = report.fieldAdapterPlan.adapters.find((adapter) => adapter.id === 'reactive-thermal-to-combustion');
  assert.equal(reactiveAdapter.adapterKind, 'dimensionless-response-adapter');
  assert.equal(reactiveAdapter.status, 'ready');
  assert.equal(reactiveAdapter.executionMode, 'named-response-adapter');
  assert.equal(reactiveAdapter.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.thermal-ignition-response.v0');
  assert.ok(reactiveAdapter.validationGates.includes('source-sink-accounting'));
  const reactiveTransfer = report.fieldTransfer.transfers.find((transfer) => transfer.id === 'reactive-thermal-to-combustion');
  assert.equal(reactiveTransfer.status, 'executed');
  assert.equal(reactiveTransfer.executionMode, 'named-response-adapter');
  assert.equal(reactiveTransfer.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.thermal-ignition-response.v0');
  assert.equal(reactiveTransfer.source.value, 1120);
  assert.ok(reactiveTransfer.target.predictedValue > 0);
  assert.ok(reactiveTransfer.target.predictedValue <= 1);
  assert.equal(reactiveTransfer.conservationImpact.mode, 'named-open-system-response');
  assert.equal(reactiveTransfer.conservationImpact.sourceSinkMode, 'open-system-thermal-response');
  assert.equal(reactiveTransfer.skippedReason, null);
  const ruptureCompatibility = report.fieldCompatibility.checks.find((check) => check.id === 'membrane-rupture-to-sph-release');
  assert.equal(ruptureCompatibility.status, 'proxy-adapter-required');
  const ruptureAdapter = report.fieldAdapterPlan.adapters.find((adapter) => adapter.id === 'membrane-rupture-to-sph-release');
  assert.equal(ruptureAdapter.adapterKind, 'reduced-proxy-adapter');
  assert.equal(ruptureAdapter.status, 'ready');
  assert.equal(ruptureAdapter.executionMode, 'named-response-adapter');
  assert.equal(ruptureAdapter.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.membrane-rupture-spill-response.v0');
  assert.ok(ruptureAdapter.validationGates.includes('momentum-transfer-reference-tolerance'));
  const ruptureTransfer = report.fieldTransfer.transfers.find((transfer) => transfer.id === 'membrane-rupture-to-sph-release');
  assert.equal(ruptureTransfer.status, 'executed');
  assert.equal(ruptureTransfer.executionMode, 'named-response-adapter');
  assert.equal(ruptureTransfer.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.membrane-rupture-spill-response.v0');
  assert.equal(ruptureTransfer.source.value, 0.68);
  assert.ok(ruptureTransfer.target.predictedValue > 0.5);
  assert.ok(ruptureTransfer.target.predictedValue <= 2);
  assert.equal(ruptureTransfer.transform.context.internalPressurePa, 154000);
  assert.equal(ruptureTransfer.transform.context.waterMassKg, 0.36);
  assert.equal(ruptureTransfer.conservationImpact.mode, 'named-open-system-response');
  assert.equal(ruptureTransfer.conservationImpact.sourceSinkMode, 'open-system-mass-momentum-release');
  assert.equal(ruptureTransfer.skippedReason, null);
  const plumeCompatibility = report.fieldCompatibility.checks.find((check) => check.id === 'combustion-plume-to-weather');
  assert.equal(plumeCompatibility.status, 'proxy-adapter-required');
  const plumeAdapter = report.fieldAdapterPlan.adapters.find((adapter) => adapter.id === 'combustion-plume-to-weather');
  assert.equal(plumeAdapter.adapterKind, 'reduced-proxy-adapter');
  assert.equal(plumeAdapter.status, 'ready');
  assert.equal(plumeAdapter.executionMode, 'named-response-adapter');
  assert.equal(plumeAdapter.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.plume-weather-cloud-response.v0');
  assert.ok(plumeAdapter.validationGates.includes('weather-reference-tolerance'));
  const plumeTransfer = report.fieldTransfer.transfers.find((transfer) => transfer.id === 'combustion-plume-to-weather');
  assert.equal(plumeTransfer.status, 'executed');
  assert.equal(plumeTransfer.executionMode, 'named-response-adapter');
  assert.equal(plumeTransfer.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.plume-weather-cloud-response.v0');
  assert.equal(plumeTransfer.source.value, 12);
  assert.ok(plumeTransfer.target.predictedValue > 0.28);
  assert.ok(plumeTransfer.target.predictedValue <= 1);
  assert.equal(plumeTransfer.transform.context.smokeColumn, 0.42);
  assert.equal(plumeTransfer.transform.context.maxWindMps, 12);
  assert.equal(plumeTransfer.conservationImpact.mode, 'named-open-system-response');
  assert.equal(plumeTransfer.conservationImpact.sourceSinkMode, 'open-system-plume-weather-response');
  assert.equal(plumeTransfer.skippedReason, null);
  const radiationCompatibility = report.fieldCompatibility.checks.find((check) => check.id === 'radiation-opacity-to-surface-heating');
  assert.equal(radiationCompatibility.status, 'proxy-adapter-required');
  const radiationAdapter = report.fieldAdapterPlan.adapters.find((adapter) => adapter.id === 'radiation-opacity-to-surface-heating');
  assert.equal(radiationAdapter.adapterKind, 'reduced-proxy-adapter');
  assert.equal(radiationAdapter.status, 'ready');
  assert.equal(radiationAdapter.executionMode, 'named-response-adapter');
  assert.equal(radiationAdapter.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.radiation-surface-heat-response.v0');
  assert.ok(radiationAdapter.validationGates.includes('radiative-transfer-reference-tolerance'));
  const radiationTransfer = report.fieldTransfer.transfers.find((transfer) => transfer.id === 'radiation-opacity-to-surface-heating');
  assert.equal(radiationTransfer.status, 'executed');
  assert.equal(radiationTransfer.executionMode, 'named-response-adapter');
  assert.equal(radiationTransfer.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.radiation-surface-heat-response.v0');
  assert.equal(radiationTransfer.source.value, 96);
  assert.ok(radiationTransfer.target.predictedValue > 0);
  assert.ok(radiationTransfer.target.predictedValue <= 260);
  assert.equal(radiationTransfer.transform.context.greenhouseFactor, 0.54);
  assert.equal(radiationTransfer.transform.context.cellCount, 128);
  assert.equal(radiationTransfer.conservationImpact.mode, 'named-open-system-response');
  assert.equal(radiationTransfer.conservationImpact.sourceSinkMode, 'open-system-radiation-thermal-response');
  assert.equal(radiationTransfer.skippedReason, null);
  const stellarCompatibility = report.fieldCompatibility.checks.find((check) => check.id === 'stellar-fusion-to-radiation-pressure');
  assert.equal(stellarCompatibility.status, 'compatible');
  const stellarAdapter = report.fieldAdapterPlan.adapters.find((adapter) => adapter.id === 'stellar-fusion-to-radiation-pressure');
  assert.equal(stellarAdapter.adapterKind, 'dimensionless-response-adapter');
  assert.equal(stellarAdapter.status, 'ready');
  assert.equal(stellarAdapter.executionMode, 'named-response-adapter');
  assert.equal(stellarAdapter.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.stellar-radiation-pressure-response.v0');
  assert.ok(stellarAdapter.validationGates.includes('stellar-radiation-reference-tolerance'));
  const stellarTransfer = report.fieldTransfer.transfers.find((transfer) => transfer.id === 'stellar-fusion-to-radiation-pressure');
  assert.equal(stellarTransfer.status, 'executed');
  assert.equal(stellarTransfer.executionMode, 'named-response-adapter');
  assert.equal(stellarTransfer.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.stellar-radiation-pressure-response.v0');
  assert.equal(stellarTransfer.source.value, 1.72);
  assert.ok(stellarTransfer.target.predictedValue > 1.18);
  assert.ok(stellarTransfer.target.predictedValue <= 3.2);
  assert.equal(stellarTransfer.transform.context.fusionPowerProxy, 1600);
  assert.equal(stellarTransfer.transform.context.coreTemperatureK, 19000000);
  assert.equal(stellarTransfer.conservationImpact.mode, 'named-open-system-response');
  assert.equal(stellarTransfer.conservationImpact.sourceSinkMode, 'open-system-stellar-radiation-response');
  assert.equal(stellarTransfer.skippedReason, null);
  const maxwellCompatibility = report.fieldCompatibility.checks.find((check) => check.id === 'maxwell-field-to-magnetosphere');
  assert.equal(maxwellCompatibility.status, 'compatible');
  const maxwellAdapter = report.fieldAdapterPlan.adapters.find((adapter) => adapter.id === 'maxwell-field-to-magnetosphere');
  assert.equal(maxwellAdapter.adapterKind, 'reduced-proxy-adapter');
  assert.equal(maxwellAdapter.status, 'ready');
  assert.equal(maxwellAdapter.executionMode, 'named-response-adapter');
  assert.equal(maxwellAdapter.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.maxwell-magnetosphere-boundary-response.v0');
  assert.ok(maxwellAdapter.validationGates.includes('mhd-boundary-reference-tolerance'));
  const maxwellTransfer = report.fieldTransfer.transfers.find((transfer) => transfer.id === 'maxwell-field-to-magnetosphere');
  assert.equal(maxwellTransfer.status, 'executed');
  assert.equal(maxwellTransfer.executionMode, 'named-response-adapter');
  assert.equal(maxwellTransfer.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.maxwell-magnetosphere-boundary-response.v0');
  assert.equal(maxwellTransfer.source.value, 1.4);
  assert.ok(maxwellTransfer.target.predictedValue > 0.6);
  assert.ok(maxwellTransfer.target.predictedValue <= 4);
  assert.equal(maxwellTransfer.transform.context.magneticEnergy, 0.82);
  assert.deepEqual(maxwellTransfer.transform.context.poyntingFlux, [0.6, 0.2, 0.1]);
  assert.equal(maxwellTransfer.conservationImpact.mode, 'named-open-system-response');
  assert.equal(maxwellTransfer.conservationImpact.sourceSinkMode, 'open-system-electromagnetic-mhd-boundary-response');
  assert.equal(maxwellTransfer.skippedReason, null);
  const picCompatibility = report.fieldCompatibility.checks.find((check) => check.id === 'pic-kinetic-to-mhd-feedback');
  assert.equal(picCompatibility.status, 'proxy-adapter-required');
  const picAdapter = report.fieldAdapterPlan.adapters.find((adapter) => adapter.id === 'pic-kinetic-to-mhd-feedback');
  assert.equal(picAdapter.adapterKind, 'reduced-proxy-adapter');
  assert.equal(picAdapter.status, 'ready');
  assert.equal(picAdapter.executionMode, 'named-response-adapter');
  assert.equal(picAdapter.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.pic-mhd-reconnection-feedback.v0');
  assert.ok(picAdapter.validationGates.includes('kinetic-mhd-reference-tolerance'));
  const picTransfer = report.fieldTransfer.transfers.find((transfer) => transfer.id === 'pic-kinetic-to-mhd-feedback');
  assert.equal(picTransfer.status, 'executed');
  assert.equal(picTransfer.executionMode, 'named-response-adapter');
  assert.equal(picTransfer.namedAdapterEquation.adapterEquationId, 'peercompute.multiscale.adapter.pic-mhd-reconnection-feedback.v0');
  assert.equal(picTransfer.source.value, 0.018);
  assert.ok(picTransfer.target.predictedValue > 0.34);
  assert.ok(picTransfer.target.predictedValue <= 4);
  assert.equal(picTransfer.transform.context.currentDensity, 0.14);
  assert.equal(picTransfer.transform.context.fieldEnergy, 1.8);
  assert.equal(picTransfer.transform.context.currentSheetIntensity, 0.42);
  assert.equal(picTransfer.conservationImpact.mode, 'named-open-system-response');
  assert.equal(picTransfer.conservationImpact.sourceSinkMode, 'open-system-kinetic-mhd-feedback');
  assert.equal(picTransfer.skippedReason, null);

  const packet = model.createPacket();
  assert.equal(packet.coupling.schema, MULTISCALE_CROSS_SCALE_COUPLING_SCHEMA);
  assert.ok(packet.coupling.links.some((link) => link.id === 'sph-water-to-fire-suppression'));
  assert.equal(packet.coupling.exchange.sphCoolingPotential, 0.72);
  assert.equal(packet.coupling.exchange.surfaceWaterContact, 0.48);
});

test('field compatibility distinguishes proxy adapters from physical dimension errors', () => {
  const strictMismatch = evaluateFieldCompatibility({
    id: 'strict-pressure-to-temperature',
    sourceMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'reactive-thermal-cell',
      field: 'pressurePa',
      unit: 'Pa',
      dimensions: 'M L^-1 T^-2',
      unitStatus: 'physical',
      metadataSource: 'unit-test'
    },
    targetMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'reactive-thermal-cell',
      field: 'temperatureK',
      unit: 'K',
      dimensions: 'Theta',
      unitStatus: 'physical',
      metadataSource: 'unit-test'
    }
  });
  assert.equal(strictMismatch.status, 'dimension-mismatch');
  assert.equal(strictMismatch.severity, 'error');
  assert.equal(strictMismatch.adapterRequired, true);

  const proxyAdapter = evaluateFieldCompatibility({
    id: 'proxy-heat-to-temperature',
    sourceMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'molecular-dynamics',
      field: 'heatReleaseProxy',
      unit: 'reduced-eV/step',
      dimensions: 'mixed',
      unitStatus: 'reduced-proxy',
      metadataSource: 'unit-test'
    },
    targetMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'reactive-thermal-cell',
      field: 'temperatureK',
      unit: 'K',
      dimensions: 'Theta',
      unitStatus: 'physical',
      metadataSource: 'unit-test'
    }
  });
  assert.equal(proxyAdapter.status, 'proxy-adapter-required');
  assert.equal(proxyAdapter.severity, 'info');
  assert.equal(proxyAdapter.adapterRequired, true);

  const adapterPlan = createFieldAdapterPlanReport([strictMismatch, proxyAdapter]);
  assert.equal(adapterPlan.schema, MULTISCALE_FIELD_ADAPTER_PLAN_SCHEMA);
  assert.equal(adapterPlan.adapterCount, 2);
  assert.equal(adapterPlan.status, 'blocked');
  assert.equal(adapterPlan.blockedAdapterCount, 1);
  assert.equal(adapterPlan.stubRequiredCount, 1);
  const blocked = adapterPlan.adapters.find((adapter) => adapter.id === 'strict-pressure-to-temperature');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.executionMode, 'blocked-physical-dimension-mismatch');
  const stub = adapterPlan.adapters.find((adapter) => adapter.id === 'proxy-heat-to-temperature');
  assert.equal(stub.status, 'stub-required');
  assert.equal(stub.requiresCalibration, true);
});

test('field adapter plan can promote known physical unit conversions', () => {
  const pressureConversion = evaluateFieldCompatibility({
    id: 'pressure-pa-to-kpa',
    sourceMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'reactive-thermal-cell',
      field: 'pressurePa',
      unit: 'Pa',
      dimensions: 'M L^-1 T^-2',
      unitStatus: 'physical',
      metadataSource: 'unit-test'
    },
    targetMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'hydro-atmosphere',
      field: 'pressureKpa',
      unit: 'kPa',
      dimensions: 'M L^-1 T^-2',
      unitStatus: 'physical',
      metadataSource: 'unit-test'
    }
  });
  assert.equal(pressureConversion.status, 'unit-conversion-required');

  const plan = createFieldAdapterPlanReport([pressureConversion]);
  assert.equal(plan.status, 'ready-with-unit-conversions');
  assert.equal(plan.readyAdapterCount, 1);
  assert.equal(plan.readyUnitConversionCount, 1);
  assert.equal(plan.scientificModeReadyCount, 1);
  assert.equal(plan.conservativeReadyCount, 1);
  const adapter = plan.adapters[0];
  assert.equal(adapter.adapterKind, 'unit-conversion');
  assert.equal(adapter.status, 'ready');
  assert.equal(adapter.executionMode, 'affine-unit-conversion');
  assert.equal(adapter.transform.mode, 'scale');
  assert.equal(adapter.transform.scale, 0.001);
  assert.equal(adapter.transform.offset, 0);
  assert.equal(adapter.scientificModeReady, true);

  const transfer = createFieldTransferReport({
    links: [{
      id: 'pressure-pa-to-kpa',
      direction: 'upward',
      source: {
        solver: 'reactive-thermal-cell',
        field: 'pressurePa',
        value: 250000,
        unit: 'Pa',
        dimensions: 'M L^-1 T^-2'
      },
      target: {
        solver: 'hydro-atmosphere',
        field: 'pressureKpa',
        value: 250,
        unit: 'kPa',
        dimensions: 'M L^-1 T^-2'
      },
      conservation: ['momentum', 'energy']
    }],
    fieldAdapterPlan: plan
  });
  assert.equal(transfer.schema, MULTISCALE_FIELD_TRANSFER_REPORT_SCHEMA);
  assert.equal(transfer.status, 'executed');
  assert.equal(transfer.executedTransferCount, 1);
  assert.equal(transfer.conservativeExecutedTransferCount, 1);
  assert.equal(transfer.maxAbsResidual, 0);
  assert.equal(transfer.transfers[0].target.predictedValue, 250);
  assert.equal(transfer.transfers[0].conservationImpact.mode, 'conservative-transform-ready');
});

test('field adapter plan can execute named thermal ignition response adapters', () => {
  const thermalIgnition = evaluateFieldCompatibility({
    id: 'reactive-thermal-to-combustion',
    sourceMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'reactive-thermal-cell',
      field: 'temperatureK',
      unit: 'K',
      dimensions: 'Theta',
      unitStatus: 'physical',
      metadataSource: 'unit-test'
    },
    targetMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'combustion-plume',
      field: 'fireAreaFraction',
      unit: '1',
      dimensions: '1',
      unitStatus: 'dimensionless',
      metadataSource: 'unit-test'
    }
  });
  assert.equal(thermalIgnition.status, 'dimensionless-adapter-required');

  const plan = createFieldAdapterPlanReport([thermalIgnition]);
  assert.equal(plan.readyNamedAdapterCount, 1);
  assert.equal(plan.stubRequiredCount, 0);
  const adapter = plan.adapters[0];
  assert.equal(adapter.status, 'ready');
  assert.equal(adapter.executionMode, 'named-response-adapter');
  assert.equal(adapter.requiresCalibration, true);
  assert.equal(adapter.namedAdapterEquation.equationType, 'thermal-ignition-logistic-response');

  const lowOxygenTransfer = createFieldTransferReport({
    links: [{
      id: 'reactive-thermal-to-combustion',
      direction: 'upward',
      source: {
        solver: 'reactive-thermal-cell',
        field: 'temperatureK',
        value: 900,
        unit: 'K',
        dimensions: 'Theta'
      },
      target: {
        solver: 'combustion-plume',
        field: 'fireAreaFraction',
        value: 0.1,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        oxygenFraction: 0.04,
        ambientPressurePa: 101325,
        waterContact: 0,
        radiativeHeatFlux: 0
      },
      conservation: ['energy', 'species']
    }],
    fieldAdapterPlan: plan
  });
  assert.equal(lowOxygenTransfer.namedExecutedTransferCount, 1);
  assert.equal(lowOxygenTransfer.transfers[0].status, 'executed');
  assert.equal(lowOxygenTransfer.transfers[0].target.predictedValue, 0);

  const oxygenRichTransfer = createFieldTransferReport({
    links: [{
      id: 'reactive-thermal-to-combustion',
      direction: 'upward',
      source: {
        solver: 'reactive-thermal-cell',
        field: 'temperatureK',
        value: 900,
        unit: 'K',
        dimensions: 'Theta'
      },
      target: {
        solver: 'combustion-plume',
        field: 'fireAreaFraction',
        value: 0.1,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        oxygenFraction: 0.3,
        ambientPressurePa: 130000,
        waterContact: 0,
        radiativeHeatFlux: 0
      },
      conservation: ['energy', 'species']
    }],
    fieldAdapterPlan: plan
  });
  assert.ok(oxygenRichTransfer.transfers[0].target.predictedValue > 0.7);
  assert.equal(oxygenRichTransfer.transfers[0].conservationImpact.mode, 'named-open-system-response');

  const suppressedTransfer = createFieldTransferReport({
    links: [{
      id: 'reactive-thermal-to-combustion',
      direction: 'upward',
      source: {
        solver: 'reactive-thermal-cell',
        field: 'temperatureK',
        value: 900,
        unit: 'K',
        dimensions: 'Theta'
      },
      target: {
        solver: 'combustion-plume',
        field: 'fireAreaFraction',
        value: 0.1,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        oxygenFraction: 0.3,
        ambientPressurePa: 130000,
        waterContact: 0.8,
        radiativeHeatFlux: 0
      },
      conservation: ['energy', 'species']
    }],
    fieldAdapterPlan: plan
  });
  assert.ok(suppressedTransfer.transfers[0].target.predictedValue < oxygenRichTransfer.transfers[0].target.predictedValue);
  assert.equal(suppressedTransfer.transfers[0].transform.context.waterContact, 0.8);
});

test('field adapter plan can execute named SPH water suppression response adapters', () => {
  const suppressionLink = evaluateFieldCompatibility({
    id: 'sph-water-to-fire-suppression',
    sourceMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'sph-material',
      field: 'coolingPotential',
      unit: '1',
      dimensions: '1',
      unitStatus: 'dimensionless',
      metadataSource: 'unit-test'
    },
    targetMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'combustion-plume',
      field: 'waterContact',
      unit: '1',
      dimensions: '1',
      unitStatus: 'dimensionless',
      metadataSource: 'unit-test'
    }
  });
  assert.equal(suppressionLink.status, 'compatible');

  const plan = createFieldAdapterPlanReport([suppressionLink]);
  assert.equal(plan.readyNamedAdapterCount, 1);
  assert.equal(plan.identityAdapterCount, 0);
  assert.equal(plan.stubRequiredCount, 0);
  const adapter = plan.adapters[0];
  assert.equal(adapter.status, 'ready');
  assert.equal(adapter.adapterKind, 'dimensionless-response-adapter');
  assert.equal(adapter.executionMode, 'named-response-adapter');
  assert.equal(adapter.requiresCalibration, true);
  assert.equal(adapter.namedAdapterEquation.equationType, 'water-contact-suppression-response');

  const dryNoContactTransfer = createFieldTransferReport({
    links: [{
      id: 'sph-water-to-fire-suppression',
      direction: 'upward',
      source: {
        solver: 'sph-material',
        field: 'coolingPotential',
        value: 0,
        unit: '1',
        dimensions: '1'
      },
      target: {
        solver: 'combustion-plume',
        field: 'waterContact',
        value: 0,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        waterContact: 0,
        fireContactFraction: 0,
        hotContactFraction: 0,
        vaporFraction: 0,
        liquidFraction: 1,
        fireIntensity: 0.7,
        flameTemperatureK: 1200,
        ambientTemperatureK: 300,
        spillImpulse: 0
      },
      conservation: ['mass', 'energy']
    }],
    fieldAdapterPlan: plan
  });
  assert.equal(dryNoContactTransfer.namedExecutedTransferCount, 1);
  assert.equal(dryNoContactTransfer.transfers[0].status, 'executed');
  assert.equal(dryNoContactTransfer.transfers[0].target.predictedValue, 0);

  const coolingTransfer = createFieldTransferReport({
    links: [{
      id: 'sph-water-to-fire-suppression',
      direction: 'upward',
      source: {
        solver: 'sph-material',
        field: 'coolingPotential',
        value: 0.72,
        unit: '1',
        dimensions: '1'
      },
      target: {
        solver: 'combustion-plume',
        field: 'waterContact',
        value: 0.2,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        waterContact: 0.2,
        fireContactFraction: 0.5,
        hotContactFraction: 0.05,
        vaporFraction: 0.12,
        liquidFraction: 0.78,
        fireIntensity: 0.75,
        flameTemperatureK: 1300,
        ambientTemperatureK: 300,
        spillImpulse: 0.35
      },
      conservation: ['mass', 'energy']
    }],
    fieldAdapterPlan: plan
  });
  const coolingValue = coolingTransfer.transfers[0].target.predictedValue;
  assert.ok(coolingValue > 0.4);
  assert.ok(coolingValue <= 1);
  assert.equal(coolingTransfer.transfers[0].conservationImpact.mode, 'named-open-system-response');
  assert.equal(coolingTransfer.transfers[0].conservationImpact.sourceSinkMode, 'open-system-water-suppression-response');

  const hotVaporTransfer = createFieldTransferReport({
    links: [{
      id: 'sph-water-to-fire-suppression',
      direction: 'upward',
      source: {
        solver: 'sph-material',
        field: 'coolingPotential',
        value: 0.72,
        unit: '1',
        dimensions: '1'
      },
      target: {
        solver: 'combustion-plume',
        field: 'waterContact',
        value: 0.2,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        waterContact: 0.2,
        fireContactFraction: 0.5,
        hotContactFraction: 0.85,
        vaporFraction: 0.65,
        liquidFraction: 0.2,
        fireIntensity: 0.75,
        flameTemperatureK: 1300,
        ambientTemperatureK: 300,
        spillImpulse: 0.35
      },
      conservation: ['mass', 'energy']
    }],
    fieldAdapterPlan: plan
  });
  assert.ok(hotVaporTransfer.transfers[0].target.predictedValue < coolingValue);
  assert.equal(hotVaporTransfer.transfers[0].transform.context.hotContactFraction, 0.85);
});

test('field adapter plan can execute named combustion plume weather response adapters', () => {
  const plumeWeatherLink = evaluateFieldCompatibility({
    id: 'combustion-plume-to-weather',
    sourceMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'combustion-plume',
      field: 'buoyancyFlux',
      unit: 'reduced W/m^2',
      dimensions: 'M T^-3',
      unitStatus: 'reduced-proxy',
      metadataSource: 'unit-test'
    },
    targetMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'hydro-atmosphere',
      field: 'cloudCover',
      unit: '1',
      dimensions: '1',
      unitStatus: 'dimensionless',
      metadataSource: 'unit-test'
    }
  });
  assert.equal(plumeWeatherLink.status, 'proxy-adapter-required');

  const plan = createFieldAdapterPlanReport([plumeWeatherLink]);
  assert.equal(plan.readyNamedAdapterCount, 1);
  assert.equal(plan.stubRequiredCount, 0);
  const adapter = plan.adapters[0];
  assert.equal(adapter.status, 'ready');
  assert.equal(adapter.adapterKind, 'reduced-proxy-adapter');
  assert.equal(adapter.executionMode, 'named-response-adapter');
  assert.equal(adapter.requiresCalibration, true);
  assert.equal(adapter.namedAdapterEquation.equationType, 'combustion-plume-weather-cloud-response');

  const noPlumeTransfer = createFieldTransferReport({
    links: [{
      id: 'combustion-plume-to-weather',
      direction: 'upward',
      source: {
        solver: 'combustion-plume',
        field: 'buoyancyFlux',
        value: 0,
        unit: 'reduced W/m^2',
        dimensions: 'M T^-3'
      },
      target: {
        solver: 'hydro-atmosphere',
        field: 'cloudCover',
        value: 0,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        smokeColumn: 0,
        heatReleaseMean: 0,
        plumeRise: 0,
        cloudCover: 0,
        stormEnergy: 0,
        precipitationMean: 0,
        maxWindMps: 0,
        waterContact: 0,
        ambientPressurePa: 101325,
        ambientTemperatureK: 294
      },
      conservation: ['energy', 'species']
    }],
    fieldAdapterPlan: plan
  });
  assert.equal(noPlumeTransfer.namedExecutedTransferCount, 1);
  assert.equal(noPlumeTransfer.transfers[0].status, 'executed');
  assert.equal(noPlumeTransfer.transfers[0].target.predictedValue, 0);

  const calmPlumeTransfer = createFieldTransferReport({
    links: [{
      id: 'combustion-plume-to-weather',
      direction: 'upward',
      source: {
        solver: 'combustion-plume',
        field: 'buoyancyFlux',
        value: 18,
        unit: 'reduced W/m^2',
        dimensions: 'M T^-3'
      },
      target: {
        solver: 'hydro-atmosphere',
        field: 'cloudCover',
        value: 0.18,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        smokeColumn: 0.5,
        heatReleaseMean: 1600,
        plumeRise: 0.7,
        cloudCover: 0.18,
        stormEnergy: 0.24,
        precipitationMean: 0.02,
        maxWindMps: 8,
        waterContact: 0.18,
        ambientPressurePa: 101325,
        ambientTemperatureK: 310
      },
      conservation: ['energy', 'species']
    }],
    fieldAdapterPlan: plan
  });
  const calmValue = calmPlumeTransfer.transfers[0].target.predictedValue;
  assert.ok(calmValue > 0.42);
  assert.ok(calmValue <= 1);
  assert.equal(calmPlumeTransfer.transfers[0].conservationImpact.mode, 'named-open-system-response');
  assert.equal(calmPlumeTransfer.transfers[0].conservationImpact.sourceSinkMode, 'open-system-plume-weather-response');

  const washoutTransfer = createFieldTransferReport({
    links: [{
      id: 'combustion-plume-to-weather',
      direction: 'upward',
      source: {
        solver: 'combustion-plume',
        field: 'buoyancyFlux',
        value: 18,
        unit: 'reduced W/m^2',
        dimensions: 'M T^-3'
      },
      target: {
        solver: 'hydro-atmosphere',
        field: 'cloudCover',
        value: 0.18,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        smokeColumn: 0.5,
        heatReleaseMean: 1600,
        plumeRise: 0.7,
        cloudCover: 0.18,
        stormEnergy: 0.24,
        precipitationMean: 0.75,
        maxWindMps: 48,
        waterContact: 0.18,
        ambientPressurePa: 101325,
        ambientTemperatureK: 310
      },
      conservation: ['energy', 'species']
    }],
    fieldAdapterPlan: plan
  });
  assert.ok(washoutTransfer.transfers[0].target.predictedValue < calmValue);
  assert.equal(washoutTransfer.transfers[0].transform.context.precipitationMean, 0.75);
});

test('field adapter plan can execute named membrane rupture spill response adapters', () => {
  const ruptureLink = evaluateFieldCompatibility({
    id: 'membrane-rupture-to-sph-release',
    sourceMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'membrane-shell',
      field: 'ruptureRisk',
      unit: '1',
      dimensions: '1',
      unitStatus: 'dimensionless',
      metadataSource: 'unit-test'
    },
    targetMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'sph-material',
      field: 'spillImpulse',
      unit: 'reduced N s',
      dimensions: 'M L T^-1',
      unitStatus: 'reduced-proxy',
      metadataSource: 'unit-test'
    }
  });
  assert.equal(ruptureLink.status, 'proxy-adapter-required');

  const plan = createFieldAdapterPlanReport([ruptureLink]);
  assert.equal(plan.readyNamedAdapterCount, 1);
  assert.equal(plan.stubRequiredCount, 0);
  const adapter = plan.adapters[0];
  assert.equal(adapter.status, 'ready');
  assert.equal(adapter.executionMode, 'named-response-adapter');
  assert.equal(adapter.requiresCalibration, true);
  assert.equal(adapter.namedAdapterEquation.equationType, 'membrane-rupture-spill-saturating-response');

  const noWaterTransfer = createFieldTransferReport({
    links: [{
      id: 'membrane-rupture-to-sph-release',
      direction: 'downward',
      source: {
        solver: 'membrane-shell',
        field: 'ruptureRisk',
        value: 0.92,
        unit: '1',
        dimensions: '1'
      },
      target: {
        solver: 'sph-material',
        field: 'spillImpulse',
        value: 0,
        unit: 'reduced N s',
        dimensions: 'M L T^-1'
      },
      adapterContext: {
        ambientPressurePa: 101325,
        internalPressurePa: 160000,
        membraneIntegrity: 0.2,
        heatFluxMean: 3000,
        waterMassKg: 0,
        steamMassKg: 0,
        previousSpillImpulse: 0,
        ruptured: true
      },
      conservation: ['mass', 'momentum', 'energy']
    }],
    fieldAdapterPlan: plan
  });
  assert.equal(noWaterTransfer.namedExecutedTransferCount, 1);
  assert.equal(noWaterTransfer.transfers[0].status, 'executed');
  assert.equal(noWaterTransfer.transfers[0].target.predictedValue, 0);

  const lowRiskTransfer = createFieldTransferReport({
    links: [{
      id: 'membrane-rupture-to-sph-release',
      direction: 'downward',
      source: {
        solver: 'membrane-shell',
        field: 'ruptureRisk',
        value: 0.12,
        unit: '1',
        dimensions: '1'
      },
      target: {
        solver: 'sph-material',
        field: 'spillImpulse',
        value: 0,
        unit: 'reduced N s',
        dimensions: 'M L T^-1'
      },
      adapterContext: {
        ambientPressurePa: 101325,
        internalPressurePa: 110000,
        membraneIntegrity: 0.95,
        heatFluxMean: 0,
        waterMassKg: 0.42,
        steamMassKg: 0,
        previousSpillImpulse: 0,
        ruptured: false
      },
      conservation: ['mass', 'momentum', 'energy']
    }],
    fieldAdapterPlan: plan
  });
  assert.ok(lowRiskTransfer.transfers[0].target.predictedValue < 0.05);

  const highRiskTransfer = createFieldTransferReport({
    links: [{
      id: 'membrane-rupture-to-sph-release',
      direction: 'downward',
      source: {
        solver: 'membrane-shell',
        field: 'ruptureRisk',
        value: 0.86,
        unit: '1',
        dimensions: '1'
      },
      target: {
        solver: 'sph-material',
        field: 'spillImpulse',
        value: 0.2,
        unit: 'reduced N s',
        dimensions: 'M L T^-1'
      },
      adapterContext: {
        ambientPressurePa: 101325,
        internalPressurePa: 170000,
        membraneIntegrity: 0.24,
        heatFluxMean: 3600,
        waterMassKg: 0.36,
        steamMassKg: 0.04,
        previousSpillImpulse: 0.18,
        ruptured: true
      },
      conservation: ['mass', 'momentum', 'energy']
    }],
    fieldAdapterPlan: plan
  });
  assert.ok(highRiskTransfer.transfers[0].target.predictedValue > 0.9);
  assert.ok(highRiskTransfer.transfers[0].target.predictedValue <= 2);
  assert.equal(highRiskTransfer.transfers[0].conservationImpact.mode, 'named-open-system-response');
  assert.equal(highRiskTransfer.transfers[0].conservationImpact.sourceSinkMode, 'open-system-mass-momentum-release');
  assert.equal(highRiskTransfer.transfers[0].transform.context.ruptured, true);
  assert.ok(highRiskTransfer.transfers[0].target.predictedValue > lowRiskTransfer.transfers[0].target.predictedValue);
});

test('field adapter plan can execute named stellar radiation pressure response adapters', () => {
  const stellarLink = evaluateFieldCompatibility({
    id: 'stellar-fusion-to-radiation-pressure',
    sourceMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'stellar-fusion',
      field: 'luminosityFactor',
      unit: '1',
      dimensions: '1',
      unitStatus: 'dimensionless',
      metadataSource: 'unit-test'
    },
    targetMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'radiation-opacity',
      field: 'radiationPressure',
      unit: '1',
      dimensions: '1',
      unitStatus: 'dimensionless',
      metadataSource: 'unit-test'
    }
  });
  assert.equal(stellarLink.status, 'compatible');

  const plan = createFieldAdapterPlanReport([stellarLink]);
  assert.equal(plan.readyNamedAdapterCount, 1);
  assert.equal(plan.identityAdapterCount, 0);
  assert.equal(plan.stubRequiredCount, 0);
  const adapter = plan.adapters[0];
  assert.equal(adapter.status, 'ready');
  assert.equal(adapter.adapterKind, 'dimensionless-response-adapter');
  assert.equal(adapter.executionMode, 'named-response-adapter');
  assert.equal(adapter.requiresCalibration, true);
  assert.equal(adapter.namedAdapterEquation.equationType, 'stellar-luminosity-radiation-pressure-response');

  const noLuminosityTransfer = createFieldTransferReport({
    links: [{
      id: 'stellar-fusion-to-radiation-pressure',
      direction: 'upward',
      source: {
        solver: 'stellar-fusion',
        field: 'luminosityFactor',
        value: 0,
        unit: '1',
        dimensions: '1'
      },
      target: {
        solver: 'radiation-opacity',
        field: 'radiationPressure',
        value: 0,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        radiationPressure: 0,
        fusionPowerProxy: 0,
        coreTemperatureK: 15000000,
        stellarFlux: 1,
        opticalDepth: 0,
        meanOpacity: 0
      },
      conservation: ['energy', 'species']
    }],
    fieldAdapterPlan: plan
  });
  assert.equal(noLuminosityTransfer.namedExecutedTransferCount, 1);
  assert.equal(noLuminosityTransfer.transfers[0].status, 'executed');
  assert.equal(noLuminosityTransfer.transfers[0].target.predictedValue, 0);

  const moderateTransfer = createFieldTransferReport({
    links: [{
      id: 'stellar-fusion-to-radiation-pressure',
      direction: 'upward',
      source: {
        solver: 'stellar-fusion',
        field: 'luminosityFactor',
        value: 0.72,
        unit: '1',
        dimensions: '1'
      },
      target: {
        solver: 'radiation-opacity',
        field: 'radiationPressure',
        value: 0.4,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        radiationPressure: 0.4,
        fusionPowerProxy: 720,
        coreTemperatureK: 15000000,
        stellarFlux: 1,
        opticalDepth: 0.1,
        meanOpacity: 0.04
      },
      conservation: ['energy', 'species']
    }],
    fieldAdapterPlan: plan
  });
  const moderateValue = moderateTransfer.transfers[0].target.predictedValue;
  assert.ok(moderateValue > 0.5);
  assert.ok(moderateValue <= 3.2);
  assert.equal(moderateTransfer.transfers[0].conservationImpact.mode, 'named-open-system-response');
  assert.equal(moderateTransfer.transfers[0].conservationImpact.sourceSinkMode, 'open-system-stellar-radiation-response');

  const trappedTransfer = createFieldTransferReport({
    links: [{
      id: 'stellar-fusion-to-radiation-pressure',
      direction: 'upward',
      source: {
        solver: 'stellar-fusion',
        field: 'luminosityFactor',
        value: 2.2,
        unit: '1',
        dimensions: '1'
      },
      target: {
        solver: 'radiation-opacity',
        field: 'radiationPressure',
        value: 0.4,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        radiationPressure: 0.4,
        fusionPowerProxy: 2200,
        coreTemperatureK: 22000000,
        stellarFlux: 1.6,
        opticalDepth: 1.8,
        meanOpacity: 0.24
      },
      conservation: ['energy', 'species']
    }],
    fieldAdapterPlan: plan
  });
  assert.ok(trappedTransfer.transfers[0].target.predictedValue > moderateValue);
  assert.ok(trappedTransfer.transfers[0].target.predictedValue <= 3.2);
  assert.equal(trappedTransfer.transfers[0].transform.context.opticalDepth, 1.8);
});

test('field adapter plan can execute named Maxwell magnetosphere boundary response adapters', () => {
  const maxwellLink = evaluateFieldCompatibility({
    id: 'maxwell-field-to-magnetosphere',
    sourceMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'maxwell-em',
      field: 'fieldEnergy',
      unit: 'J/m^3-proxy',
      dimensions: 'M L^-1 T^-2',
      unitStatus: 'reduced-proxy',
      metadataSource: 'unit-test'
    },
    targetMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'magnetosphere-plasma',
      field: 'magneticEnergy',
      unit: 'J/m^3-proxy',
      dimensions: 'M L^-1 T^-2',
      unitStatus: 'reduced-proxy',
      metadataSource: 'unit-test'
    }
  });
  assert.equal(maxwellLink.status, 'compatible');

  const plan = createFieldAdapterPlanReport([maxwellLink]);
  assert.equal(plan.readyNamedAdapterCount, 1);
  assert.equal(plan.identityAdapterCount, 0);
  assert.equal(plan.stubRequiredCount, 0);
  const adapter = plan.adapters[0];
  assert.equal(adapter.status, 'ready');
  assert.equal(adapter.adapterKind, 'reduced-proxy-adapter');
  assert.equal(adapter.executionMode, 'named-response-adapter');
  assert.equal(adapter.requiresCalibration, true);
  assert.equal(adapter.namedAdapterEquation.equationType, 'electromagnetic-field-magnetosphere-boundary-response');

  const quietTransfer = createFieldTransferReport({
    links: [{
      id: 'maxwell-field-to-magnetosphere',
      direction: 'downward',
      source: {
        solver: 'maxwell-em',
        field: 'fieldEnergy',
        value: 0,
        unit: 'J/m^3-proxy',
        dimensions: 'M L^-1 T^-2'
      },
      target: {
        solver: 'magnetosphere-plasma',
        field: 'magneticEnergy',
        value: 0,
        unit: 'J/m^3-proxy',
        dimensions: 'M L^-1 T^-2'
      },
      adapterContext: {
        magneticEnergy: 0,
        poyntingFlux: [0, 0, 0],
        solarWindPressure: 0,
        reconnectionRate: 0,
        radiationPressure: 1,
        stellarFlux: 1
      },
      conservation: ['field-energy', 'charge']
    }],
    fieldAdapterPlan: plan
  });
  assert.equal(quietTransfer.namedExecutedTransferCount, 1);
  assert.equal(quietTransfer.transfers[0].status, 'executed');
  assert.equal(quietTransfer.transfers[0].target.predictedValue, 0);

  const moderateTransfer = createFieldTransferReport({
    links: [{
      id: 'maxwell-field-to-magnetosphere',
      direction: 'downward',
      source: {
        solver: 'maxwell-em',
        field: 'fieldEnergy',
        value: 0.8,
        unit: 'J/m^3-proxy',
        dimensions: 'M L^-1 T^-2'
      },
      target: {
        solver: 'magnetosphere-plasma',
        field: 'magneticEnergy',
        value: 0.25,
        unit: 'J/m^3-proxy',
        dimensions: 'M L^-1 T^-2'
      },
      adapterContext: {
        magneticEnergy: 0.25,
        poyntingFlux: [0.2, 0.05, 0],
        solarWindPressure: 0.5,
        reconnectionRate: 0.08,
        radiationPressure: 1.1,
        stellarFlux: 1
      },
      conservation: ['field-energy', 'charge']
    }],
    fieldAdapterPlan: plan
  });
  const moderateValue = moderateTransfer.transfers[0].target.predictedValue;
  assert.ok(moderateValue > 0.3);
  assert.ok(moderateValue <= 4);
  assert.equal(moderateTransfer.transfers[0].conservationImpact.mode, 'named-open-system-response');
  assert.equal(moderateTransfer.transfers[0].conservationImpact.sourceSinkMode, 'open-system-electromagnetic-mhd-boundary-response');

  const drivenTransfer = createFieldTransferReport({
    links: [{
      id: 'maxwell-field-to-magnetosphere',
      direction: 'downward',
      source: {
        solver: 'maxwell-em',
        field: 'fieldEnergy',
        value: 2.8,
        unit: 'J/m^3-proxy',
        dimensions: 'M L^-1 T^-2'
      },
      target: {
        solver: 'magnetosphere-plasma',
        field: 'magneticEnergy',
        value: 0.25,
        unit: 'J/m^3-proxy',
        dimensions: 'M L^-1 T^-2'
      },
      adapterContext: {
        magneticEnergy: 0.25,
        poyntingFlux: [1.2, 0.5, 0.2],
        solarWindPressure: 3.2,
        reconnectionRate: 0.62,
        radiationPressure: 1.8,
        stellarFlux: 1.4
      },
      conservation: ['field-energy', 'charge']
    }],
    fieldAdapterPlan: plan
  });
  assert.ok(drivenTransfer.transfers[0].target.predictedValue > moderateValue);
  assert.ok(drivenTransfer.transfers[0].target.predictedValue <= 4);
  assert.deepEqual(drivenTransfer.transfers[0].transform.context.poyntingFlux, [1.2, 0.5, 0.2]);
});

test('field adapter plan can execute named PIC MHD reconnection feedback adapters', () => {
  const picLink = evaluateFieldCompatibility({
    id: 'pic-kinetic-to-mhd-feedback',
    sourceMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'pic-plasma-patch',
      field: 'reconnectionHeating',
      unit: 'W/m^3-proxy',
      dimensions: 'M L^-1 T^-3',
      unitStatus: 'reduced-proxy',
      metadataSource: 'unit-test'
    },
    targetMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'magnetosphere-plasma',
      field: 'reconnectionRate',
      unit: 'reduced s^-1',
      dimensions: 'T^-1',
      unitStatus: 'reduced-proxy',
      metadataSource: 'unit-test'
    }
  });
  assert.equal(picLink.status, 'proxy-adapter-required');

  const plan = createFieldAdapterPlanReport([picLink]);
  assert.equal(plan.readyNamedAdapterCount, 1);
  assert.equal(plan.stubRequiredCount, 0);
  const adapter = plan.adapters[0];
  assert.equal(adapter.status, 'ready');
  assert.equal(adapter.adapterKind, 'reduced-proxy-adapter');
  assert.equal(adapter.executionMode, 'named-response-adapter');
  assert.equal(adapter.requiresCalibration, true);
  assert.equal(adapter.namedAdapterEquation.equationType, 'kinetic-plasma-mhd-reconnection-feedback');

  const quietTransfer = createFieldTransferReport({
    links: [{
      id: 'pic-kinetic-to-mhd-feedback',
      direction: 'upward',
      source: {
        solver: 'pic-plasma-patch',
        field: 'reconnectionHeating',
        value: 0,
        unit: 'W/m^3-proxy',
        dimensions: 'M L^-1 T^-3'
      },
      target: {
        solver: 'magnetosphere-plasma',
        field: 'reconnectionRate',
        value: 0,
        unit: 'reduced s^-1',
        dimensions: 'T^-1'
      },
      adapterContext: {
        reconnectionRate: 0,
        currentDensity: 0,
        fieldEnergy: 0,
        chargeImbalance: 0,
        chargeSeparation: 0,
        particleEscapeFraction: 0,
        currentSheetIntensity: 0,
        solarWindPressure: 0,
        divergenceEProxy: 0
      },
      conservation: ['charge', 'field-energy', 'particle-energy']
    }],
    fieldAdapterPlan: plan
  });
  assert.equal(quietTransfer.namedExecutedTransferCount, 1);
  assert.equal(quietTransfer.transfers[0].status, 'executed');
  assert.equal(quietTransfer.transfers[0].target.predictedValue, 0);

  const moderateTransfer = createFieldTransferReport({
    links: [{
      id: 'pic-kinetic-to-mhd-feedback',
      direction: 'upward',
      source: {
        solver: 'pic-plasma-patch',
        field: 'reconnectionHeating',
        value: 0.008,
        unit: 'W/m^3-proxy',
        dimensions: 'M L^-1 T^-3'
      },
      target: {
        solver: 'magnetosphere-plasma',
        field: 'reconnectionRate',
        value: 0.12,
        unit: 'reduced s^-1',
        dimensions: 'T^-1'
      },
      adapterContext: {
        reconnectionRate: 0.12,
        currentDensity: 0.05,
        fieldEnergy: 0.8,
        chargeImbalance: 0.02,
        chargeSeparation: 0.1,
        particleEscapeFraction: 0.02,
        currentSheetIntensity: 0.2,
        solarWindPressure: 1,
        divergenceEProxy: 0.01
      },
      conservation: ['charge', 'field-energy', 'particle-energy']
    }],
    fieldAdapterPlan: plan
  });
  const moderateValue = moderateTransfer.transfers[0].target.predictedValue;
  assert.ok(moderateValue > 0.2);
  assert.ok(moderateValue <= 4);
  assert.equal(moderateTransfer.transfers[0].conservationImpact.mode, 'named-open-system-response');
  assert.equal(moderateTransfer.transfers[0].conservationImpact.sourceSinkMode, 'open-system-kinetic-mhd-feedback');

  const drivenTransfer = createFieldTransferReport({
    links: [{
      id: 'pic-kinetic-to-mhd-feedback',
      direction: 'upward',
      source: {
        solver: 'pic-plasma-patch',
        field: 'reconnectionHeating',
        value: 0.06,
        unit: 'W/m^3-proxy',
        dimensions: 'M L^-1 T^-3'
      },
      target: {
        solver: 'magnetosphere-plasma',
        field: 'reconnectionRate',
        value: 0.12,
        unit: 'reduced s^-1',
        dimensions: 'T^-1'
      },
      adapterContext: {
        reconnectionRate: 0.12,
        currentDensity: 0.25,
        fieldEnergy: 2.4,
        chargeImbalance: 0.1,
        chargeSeparation: 0.35,
        particleEscapeFraction: 0.18,
        currentSheetIntensity: 1.2,
        solarWindPressure: 4.8,
        divergenceEProxy: 0.02
      },
      conservation: ['charge', 'field-energy', 'particle-energy']
    }],
    fieldAdapterPlan: plan
  });
  assert.ok(drivenTransfer.transfers[0].target.predictedValue > moderateValue);
  assert.ok(drivenTransfer.transfers[0].target.predictedValue <= 4);
  assert.equal(drivenTransfer.transfers[0].transform.context.currentDensity, 0.25);
  assert.equal(drivenTransfer.transfers[0].transform.context.particleEscapeFraction, 0.18);
});

test('field adapter plan can execute named molecular reactive thermal source response adapters', () => {
  const molecularLink = evaluateFieldCompatibility({
    id: 'molecular-heat-to-reactive-thermal',
    sourceMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'molecular-dynamics',
      field: 'heatReleaseProxy',
      unit: '1',
      dimensions: '1',
      unitStatus: 'reduced-proxy',
      metadataSource: 'unit-test'
    },
    targetMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'reactive-thermal-cell',
      field: 'heatReleaseNorm',
      unit: '1',
      dimensions: '1',
      unitStatus: 'reduced-proxy',
      metadataSource: 'unit-test'
    }
  });
  assert.equal(molecularLink.status, 'compatible');

  const plan = createFieldAdapterPlanReport([molecularLink]);
  assert.equal(plan.readyNamedAdapterCount, 1);
  assert.equal(plan.stubRequiredCount, 0);
  const adapter = plan.adapters[0];
  assert.equal(adapter.status, 'ready');
  assert.equal(adapter.adapterKind, 'reduced-proxy-adapter');
  assert.equal(adapter.executionMode, 'named-response-adapter');
  assert.equal(adapter.requiresCalibration, true);
  assert.equal(adapter.namedAdapterEquation.equationType, 'molecular-heat-reactive-source-response');

  const quietTransfer = createFieldTransferReport({
    links: [{
      id: 'molecular-heat-to-reactive-thermal',
      direction: 'upward',
      source: {
        solver: 'molecular-dynamics',
        field: 'heatReleaseProxy',
        value: 0,
        unit: '1',
        dimensions: '1'
      },
      target: {
        solver: 'reactive-thermal-cell',
        field: 'heatReleaseNorm',
        value: 0,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        heatReleaseNorm: 0,
        molecularMeanTemperatureK: 294,
        ambientTemperatureK: 294,
        reactionProgress: 0,
        bondCount: 0,
        meanBondOrder: 0,
        ionizationFraction: 0,
        electricalConductivityProxy: 0,
        pressureProxy: 0,
        oxygenFraction: 0.21,
        waterContact: 0,
        radiativeHeatFlux: 0
      },
      conservation: ['energy', 'species']
    }],
    fieldAdapterPlan: plan
  });
  assert.equal(quietTransfer.namedExecutedTransferCount, 1);
  assert.equal(quietTransfer.transfers[0].status, 'executed');
  assert.equal(quietTransfer.transfers[0].target.predictedValue, 0);

  const moderateTransfer = createFieldTransferReport({
    links: [{
      id: 'molecular-heat-to-reactive-thermal',
      direction: 'upward',
      source: {
        solver: 'molecular-dynamics',
        field: 'heatReleaseProxy',
        value: 0.35,
        unit: '1',
        dimensions: '1'
      },
      target: {
        solver: 'reactive-thermal-cell',
        field: 'heatReleaseNorm',
        value: 0.22,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        heatReleaseNorm: 0.22,
        molecularMeanTemperatureK: 540,
        ambientTemperatureK: 294,
        reactionProgress: 0.3,
        bondCount: 12,
        meanBondOrder: 0.7,
        ionizationFraction: 0.04,
        electricalConductivityProxy: 0.18,
        pressureProxy: 0.5,
        oxygenFraction: 0.24,
        waterContact: 0.05,
        radiativeHeatFlux: 80
      },
      conservation: ['energy', 'species']
    }],
    fieldAdapterPlan: plan
  });
  const moderateValue = moderateTransfer.transfers[0].target.predictedValue;
  assert.ok(moderateValue > 0.2);
  assert.ok(moderateValue <= 1);
  assert.equal(moderateTransfer.transfers[0].conservationImpact.mode, 'named-open-system-response');
  assert.equal(moderateTransfer.transfers[0].conservationImpact.sourceSinkMode, 'open-system-molecular-thermal-response');

  const transferPreview = createFieldTransferReport({
    links: [{
      id: 'molecular-heat-to-reactive-thermal',
      direction: 'upward',
      source: {
        solver: 'molecular-dynamics',
        field: 'heatReleaseProxy',
        value: 0.35,
        unit: '1',
        dimensions: '1'
      },
      target: {
        solver: 'reactive-thermal-cell',
        field: 'heatReleaseNorm',
        value: 0.22,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        heatReleaseNorm: 0.22,
        molecularMeanTemperatureK: 540,
        ambientTemperatureK: 294,
        reactionProgress: 0.3,
        bondCount: 12,
        meanBondOrder: 0.7,
        ionizationFraction: 0.04,
        electricalConductivityProxy: 0.18,
        pressureProxy: 0.5,
        oxygenFraction: 0.24,
        waterContact: 0.05,
        radiativeHeatFlux: 80,
        sourceTransfer: {
          schema: MOLECULAR_CONSERVATIVE_TRANSFER_SCHEMA,
          allocations: [{
            targetSolverId: 'reactive-thermal-cell',
            targetField: 'molecularClosureHeatFluxProxy',
            fraction: 0.5,
            heatRateWProxy: 0.00005,
            speciesRateCountPerSProxy: 4,
            applied: false
          }],
          residuals: {
            closedSystemResidualProxy: 0.001
          }
        }
      },
      conservation: ['energy', 'species']
    }],
    fieldAdapterPlan: plan
  });
  assert.ok(transferPreview.transfers[0].target.predictedValue > moderateValue);
  assert.equal(transferPreview.transfers[0].transform.context.sourceTransfer.schema, MOLECULAR_CONSERVATIVE_TRANSFER_SCHEMA);

  const drivenTransfer = createFieldTransferReport({
    links: [{
      id: 'molecular-heat-to-reactive-thermal',
      direction: 'upward',
      source: {
        solver: 'molecular-dynamics',
        field: 'heatReleaseProxy',
        value: 0.75,
        unit: '1',
        dimensions: '1'
      },
      target: {
        solver: 'reactive-thermal-cell',
        field: 'heatReleaseNorm',
        value: 0.22,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        heatReleaseNorm: 0.22,
        molecularMeanTemperatureK: 1200,
        ambientTemperatureK: 294,
        reactionProgress: 0.7,
        bondCount: 24,
        meanBondOrder: 0.95,
        ionizationFraction: 0.2,
        electricalConductivityProxy: 0.5,
        pressureProxy: 1.2,
        oxygenFraction: 0.32,
        waterContact: 0,
        radiativeHeatFlux: 1200
      },
      conservation: ['energy', 'species']
    }],
    fieldAdapterPlan: plan
  });
  const drivenValue = drivenTransfer.transfers[0].target.predictedValue;
  assert.ok(drivenValue > moderateValue);
  assert.ok(drivenValue <= 1);
  assert.equal(drivenTransfer.transfers[0].transform.context.bondCount, 24);
  assert.equal(drivenTransfer.transfers[0].transform.context.ionizationFraction, 0.2);

  const wetTransfer = createFieldTransferReport({
    links: [{
      id: 'molecular-heat-to-reactive-thermal',
      direction: 'upward',
      source: {
        solver: 'molecular-dynamics',
        field: 'heatReleaseProxy',
        value: 0.75,
        unit: '1',
        dimensions: '1'
      },
      target: {
        solver: 'reactive-thermal-cell',
        field: 'heatReleaseNorm',
        value: 0.22,
        unit: '1',
        dimensions: '1'
      },
      adapterContext: {
        heatReleaseNorm: 0.22,
        molecularMeanTemperatureK: 1200,
        ambientTemperatureK: 294,
        reactionProgress: 0.7,
        bondCount: 24,
        meanBondOrder: 0.95,
        ionizationFraction: 0.2,
        electricalConductivityProxy: 0.5,
        pressureProxy: 1.2,
        oxygenFraction: 0.32,
        waterContact: 0.8,
        radiativeHeatFlux: 1200
      },
      conservation: ['energy', 'species']
    }],
    fieldAdapterPlan: plan
  });
  assert.ok(wetTransfer.transfers[0].target.predictedValue < drivenValue);
  assert.equal(wetTransfer.transfers[0].transform.context.waterContact, 0.8);
});

test('field adapter plan can execute named radiation surface heat response adapters', () => {
  const radiationLink = evaluateFieldCompatibility({
    id: 'radiation-opacity-to-surface-heating',
    sourceMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'radiation-opacity',
      field: 'netHeatingPower',
      unit: 'W/m^3-proxy',
      dimensions: 'M L^-1 T^-3',
      unitStatus: 'reduced-proxy',
      metadataSource: 'unit-test'
    },
    targetMetadata: {
      schema: 'peercompute.multiscale.field-metadata.v0',
      solverId: 'reactive-thermal-cell',
      field: 'radiativeHeatFlux',
      unit: 'W/m^2-proxy',
      dimensions: 'M T^-3',
      unitStatus: 'reduced-proxy',
      metadataSource: 'unit-test'
    }
  });
  assert.equal(radiationLink.status, 'proxy-adapter-required');

  const plan = createFieldAdapterPlanReport([radiationLink]);
  assert.equal(plan.readyNamedAdapterCount, 1);
  assert.equal(plan.stubRequiredCount, 0);
  const adapter = plan.adapters[0];
  assert.equal(adapter.status, 'ready');
  assert.equal(adapter.executionMode, 'named-response-adapter');
  assert.equal(adapter.requiresCalibration, true);
  assert.equal(adapter.namedAdapterEquation.equationType, 'grey-radiation-surface-heat-response');

  const coolingOnlyTransfer = createFieldTransferReport({
    links: [{
      id: 'radiation-opacity-to-surface-heating',
      direction: 'downward',
      source: {
        solver: 'radiation-opacity',
        field: 'netHeatingPower',
        value: -64,
        unit: 'W/m^3-proxy',
        dimensions: 'M L^-1 T^-3'
      },
      target: {
        solver: 'reactive-thermal-cell',
        field: 'radiativeHeatFlux',
        value: 0,
        unit: 'W/m^2-proxy',
        dimensions: 'M T^-3'
      },
      adapterContext: {
        cellCount: 128,
        greenhouseFactor: 0,
        stellarFlux: 1,
        radiationPressure: 1,
        waterContact: 0,
        ambientTemperatureK: 294,
        meanMaterialTemperatureK: 294
      },
      conservation: ['radiation-energy', 'thermal-energy']
    }],
    fieldAdapterPlan: plan
  });
  assert.equal(coolingOnlyTransfer.namedExecutedTransferCount, 1);
  assert.equal(coolingOnlyTransfer.transfers[0].status, 'executed');
  assert.equal(coolingOnlyTransfer.transfers[0].target.predictedValue, 0);

  const greenhouseTransfer = createFieldTransferReport({
    links: [{
      id: 'radiation-opacity-to-surface-heating',
      direction: 'downward',
      source: {
        solver: 'radiation-opacity',
        field: 'netHeatingPower',
        value: 0,
        unit: 'W/m^3-proxy',
        dimensions: 'M L^-1 T^-3'
      },
      target: {
        solver: 'reactive-thermal-cell',
        field: 'radiativeHeatFlux',
        value: 0,
        unit: 'W/m^2-proxy',
        dimensions: 'M T^-3'
      },
      adapterContext: {
        cellCount: 128,
        greenhouseFactor: 0.5,
        stellarFlux: 1,
        radiationPressure: 1,
        waterContact: 0,
        ambientTemperatureK: 294,
        meanMaterialTemperatureK: 294
      },
      conservation: ['radiation-energy', 'thermal-energy']
    }],
    fieldAdapterPlan: plan
  });
  assert.ok(greenhouseTransfer.transfers[0].target.predictedValue > 8);

  const heatingTransfer = createFieldTransferReport({
    links: [{
      id: 'radiation-opacity-to-surface-heating',
      direction: 'downward',
      source: {
        solver: 'radiation-opacity',
        field: 'netHeatingPower',
        value: 256,
        unit: 'W/m^3-proxy',
        dimensions: 'M L^-1 T^-3'
      },
      target: {
        solver: 'reactive-thermal-cell',
        field: 'radiativeHeatFlux',
        value: 40,
        unit: 'W/m^2-proxy',
        dimensions: 'M T^-3'
      },
      adapterContext: {
        cellCount: 128,
        greenhouseFactor: 0.5,
        stellarFlux: 1.4,
        radiationPressure: 1.2,
        waterContact: 0,
        ambientTemperatureK: 294,
        meanMaterialTemperatureK: 420
      },
      conservation: ['radiation-energy', 'thermal-energy']
    }],
    fieldAdapterPlan: plan
  });
  assert.ok(heatingTransfer.transfers[0].target.predictedValue > greenhouseTransfer.transfers[0].target.predictedValue);
  assert.ok(heatingTransfer.transfers[0].target.predictedValue <= 260);
  assert.equal(heatingTransfer.transfers[0].conservationImpact.mode, 'named-open-system-response');
  assert.equal(heatingTransfer.transfers[0].conservationImpact.sourceSinkMode, 'open-system-radiation-thermal-response');

  const waterAttenuatedTransfer = createFieldTransferReport({
    links: [{
      id: 'radiation-opacity-to-surface-heating',
      direction: 'downward',
      source: {
        solver: 'radiation-opacity',
        field: 'netHeatingPower',
        value: 256,
        unit: 'W/m^3-proxy',
        dimensions: 'M L^-1 T^-3'
      },
      target: {
        solver: 'reactive-thermal-cell',
        field: 'radiativeHeatFlux',
        value: 40,
        unit: 'W/m^2-proxy',
        dimensions: 'M T^-3'
      },
      adapterContext: {
        cellCount: 128,
        greenhouseFactor: 0.5,
        stellarFlux: 1.4,
        radiationPressure: 1.2,
        waterContact: 0.9,
        ambientTemperatureK: 294,
        meanMaterialTemperatureK: 420
      },
      conservation: ['radiation-energy', 'thermal-energy']
    }],
    fieldAdapterPlan: plan
  });
  assert.ok(waterAttenuatedTransfer.transfers[0].target.predictedValue < heatingTransfer.transfers[0].target.predictedValue);
  assert.equal(waterAttenuatedTransfer.transfers[0].transform.context.waterContact, 0.9);
});

test('conservation audit can include compute-capacity resize residuals', () => {
  const model = new MultiscaleModel();
  const audit = createConservationAudit({
    state: model.state,
    environment: model.environment,
    timeSeconds: 8,
    computeResize: {
      schema: 'peercompute.multiscale.scale-worker-pool-resize.v0',
      reason: 'unit-particle-resize',
      changed: true,
      previous: {
        totalParticleCount: 6144,
        plannedShardTasks: 8
      },
      next: {
        totalParticleCount: 5632,
        plannedShardTasks: 8
      },
      carriedForwardShardCount: 8,
      carriedForwardRecordShardCount: 8,
      resizeAuditSummary: {
        schema: 'peercompute.multiscale.compute.particle-resize-audit-summary.v0',
        auditedShardCount: 8,
        massProxySource: 'record-scale',
        momentumMode: 'scale-weighted',
        kineticEnergyMode: 'scale-weighted'
      },
      resizeCorrectionSummary: {
        schema: 'peercompute.multiscale.compute.particle-resize-correction-summary.v0',
        massProxySource: 'record-scale',
        momentumMode: 'scale-weighted',
        kineticEnergyMode: 'scale-weighted',
        correctedShardCount: 8,
        appliedShardCount: 8,
        massConservedShardCount: 8,
        massConservationMode: 'all-record-scale',
        maxAbsMassProxyDeltaBefore: 512,
        maxAbsMassProxyDeltaAfter: 0.00018,
        maxMassScaleDelta: 0.0909,
        maxAbsMomentumDeltaBefore: 56.9,
        maxAbsMomentumDeltaAfter: 0.00016,
        maxAbsKineticEnergyDeltaBefore: 778.6,
        maxAbsKineticEnergyDeltaAfter: 0.000008
      }
    }
  });

  assert.equal(audit.computeResize.schema, MULTISCALE_COMPUTE_RESIZE_CONSERVATION_SCHEMA);
  assert.equal(audit.computeResize.reason, 'unit-particle-resize');
  assert.equal(audit.computeResize.massConservationMode, 'all-record-scale');
  assert.equal(audit.computeResize.massConservedShardCount, 8);
  assert.equal(audit.computeResize.maxAbsMassProxyDeltaBefore, 512);
  assert.equal(audit.computeResize.maxAbsMassProxyDeltaAfter, 0.00018);
  assert.equal(audit.exchange.computeResizeParticleCountBefore, 6144);
  assert.equal(audit.exchange.computeResizeParticleCountAfter, 5632);
  assert.equal(audit.exchange.computeResizeMassConservedShardCount, 8);
  assert.equal(audit.solverDrift.computeResizeMassProxyDeltaBefore, 512);
  assert.equal(audit.solverDrift.computeResizeMassProxyDeltaAfter, 0.00018);
  assert.ok(audit.trackedCouplings.some((entry) => entry.includes('compute-capacity resize')));
  assert.ok(audit.warnings.some((entry) => entry.includes('Compute resize conservation')));
});

test('water rupture increases fire suppression request path', () => {
  const model = new MultiscaleModel();
  const before = model.state.surface.fireIntensity;
  model.triggerRupture();
  for (let i = 0; i < 180; i += 1) model.update(1 / 30);
  const packet = model.createPacket();
  assert.equal(model.state.balloon.ruptured, true);
  assert.ok(model.state.balloon.spillReleasedKg > 0);
  assert.ok(model.state.surface.waterContact > 0.9);
  assert.ok(model.state.surface.fireIntensity < before);
  assert.ok(packet.downward.refinementRequests.includes('surface-sph-refinement'));
  assert.ok(Number.isFinite(packet.upward.aggregateState.spillImpulse));
  assert.ok(Number.isFinite(packet.upward.aggregateState.spillReleasedKg));
});

test('stellar flux drives planetary weather proxy', () => {
  const model = new MultiscaleModel();
  model.setLayerById('planet');
  model.setEnvironment({ stellarFlux: 2.4 });
  for (let i = 0; i < 240; i += 1) model.update(1 / 20);
  assert.ok(model.state.planet.cloudCover > 0.45);
  assert.ok(model.state.planet.stormEnergy > 0.35);
});

test('webgpu compute buffers use stable float32 particle layout', () => {
  const data = buildInitialParticleState(32, 42);
  const positions = extractPositions(data, 32);
  assert.equal(WEBGPU_PARTICLE_COUNT, 4096);
  assert.equal(WEBGPU_PARTICLE_FLOATS, 8);
  assert.equal(WEBGPU_PARTICLE_RECORD_BYTES, 32);
  assert.equal(WEBGPU_SNAPSHOT_POSITION_FLOATS, 3);
  assert.equal(WEBGPU_SNAPSHOT_RECORD_FLOATS, WEBGPU_PARTICLE_FLOATS);
  assert.equal(data.BYTES_PER_ELEMENT, Float32Array.BYTES_PER_ELEMENT);
  assert.equal(data.length, 32 * WEBGPU_PARTICLE_FLOATS);
  assert.equal(data.byteLength, 32 * WEBGPU_PARTICLE_RECORD_BYTES);
  assert.equal(positions.length, 32 * WEBGPU_SNAPSHOT_POSITION_FLOATS);
  assert.equal(extractParticleRecords(data, 32).length, 32 * WEBGPU_SNAPSHOT_RECORD_FLOATS);
  assert.equal(data[7], 1);
  assert.ok(positions.some((value) => Math.abs(value) > 0.001));
});

test('webgpu compute initial particle state is deterministic by seed', () => {
  const a = buildInitialParticleState(16, 20260529);
  const b = buildInitialParticleState(16, 20260529);
  const c = buildInitialParticleState(16, 20260530);
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
});

test('webgpu compute can seed resized particles from prior positions', () => {
  const previousPositions = new Float32Array([
    1, 2, 3,
    -4, 5, -6
  ]);
  const data = buildParticleStateFromPositions(previousPositions, 4, 123);
  assert.equal(data.length, 4 * WEBGPU_PARTICLE_FLOATS);
  assert.equal(data[0], 1);
  assert.equal(data[1], 2);
  assert.equal(data[2], 3);
  assert.equal(data[WEBGPU_PARTICLE_FLOATS], -4);
  assert.equal(data[WEBGPU_PARTICLE_FLOATS + 1], 5);
  assert.equal(data[WEBGPU_PARTICLE_FLOATS + 2], -6);
  assert.notEqual(data[WEBGPU_PARTICLE_FLOATS * 2], 0);
});

test('webgpu compute can seed resized particles from full prior records', () => {
  const previousRecords = new Float32Array([
    1, 2, 3, 0.25, 0.1, -0.2, 0.3, 1.5,
    -4, 5, -6, 0.75, -0.4, 0.5, -0.6, 2.5
  ]);
  const data = buildParticleStateFromRecords(previousRecords, 4, 456);
  assert.equal(data.length, 4 * WEBGPU_PARTICLE_FLOATS);
  for (let i = 0; i < previousRecords.length; i += 1) {
    assert.equal(data[i], previousRecords[i]);
  }
  assert.notEqual(data[WEBGPU_PARTICLE_FLOATS * 2], 0);
});

test('webgpu compute audits particle-record resize continuity', () => {
  const before = new Float32Array([
    1, 2, 3, 0.25, 0.1, -0.2, 0.3, 1.5,
    -4, 5, -6, 0.75, -0.4, 0.5, -0.6, 2.5
  ]);
  const after = buildParticleStateFromRecords(before, 3, 789);
  const audit = summarizeParticleRecordResize(before, after);
  assert.equal(audit.schema, 'peercompute.multiscale.compute.particle-resize-audit.v0');
  assert.equal(audit.massProxySource, 'record-scale');
  assert.equal(audit.momentumMode, 'scale-weighted');
  assert.equal(audit.kineticEnergyMode, 'scale-weighted');
  assert.equal(audit.beforeCount, 2);
  assert.equal(audit.afterCount, 3);
  assert.equal(audit.prefixCount, 2);
  assert.equal(audit.addedRecords, 1);
  assert.equal(audit.droppedRecords, 0);
  assert.equal(audit.maxPositionDelta, 0);
  assert.equal(audit.maxVelocityDelta, 0);
  assert.equal(audit.maxScaleDelta, 0);
  assert.equal(audit.beforeMassProxy, 4);
  assert.equal(audit.afterMassProxy, 5);
  assert.equal(audit.massProxyDelta, 1);
  assert.ok(Number.isFinite(audit.kineticEnergyDelta));
});

test('webgpu compute corrects resize momentum and kinetic proxies when possible', () => {
  const before = new Float32Array([
    0, 0, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 0, -1, 0, 0, 1,
    0, 1, 0, 0, 0, 2, 0, 1,
    0, -1, 0, 0, 0, -2, 0, 1
  ]);
  const after = buildParticleStateFromRecords(before, 2, 2468);
  const uncorrectedAudit = summarizeParticleRecordResize(before, after);
  const corrected = applyParticleRecordResizeConservation(before, after);
  assert.equal(corrected.correction.schema, 'peercompute.multiscale.compute.particle-resize-correction.v0');
  assert.equal(corrected.correction.massProxySource, 'record-scale');
  assert.equal(corrected.correction.momentumMode, 'scale-weighted');
  assert.equal(corrected.correction.kineticEnergyMode, 'scale-weighted');
  assert.equal(corrected.correction.mode, 'remaining-records');
  assert.equal(corrected.correction.applied, true);
  assert.equal(corrected.correction.massConservationApplied, true);
  assert.equal(corrected.correction.massConservationMode, 'all-record-scale');
  assert.equal(corrected.correction.massProxyDeltaBefore, -2);
  assert.ok(Math.abs(corrected.correction.massProxyDeltaAfter) < 1e-5);
  assert.equal(corrected.audit.beforeCount, 4);
  assert.equal(corrected.audit.afterCount, 2);
  assert.equal(corrected.audit.droppedRecords, 2);
  assert.ok(corrected.audit.maxVelocityDelta > 0);
  assert.ok(Math.hypot(...corrected.audit.momentumDelta) < 1e-5);
  assert.ok(Math.abs(corrected.audit.kineticEnergyDelta) < 1e-5);
  assert.ok(Math.abs(corrected.audit.kineticEnergyDelta) < Math.abs(uncorrectedAudit.kineticEnergyDelta));
});

test('webgpu compute corrects resize proxies with scale as mass', () => {
  const before = new Float32Array([
    0, 0, 0, 0, 1, 0, 0, 2,
    1, 0, 0, 0, -2, 0, 0, 1,
    0, 1, 0, 0, 0, 1, 0, 3,
    0, -1, 0, 0, 0, -3, 0, 1
  ]);
  const after = buildParticleStateFromRecords(before, 2, 9753);
  const uncorrectedAudit = summarizeParticleRecordResize(before, after);
  const corrected = applyParticleRecordResizeConservation(before, after);
  assert.equal(uncorrectedAudit.massProxySource, 'record-scale');
  assert.equal(uncorrectedAudit.momentumMode, 'scale-weighted');
  assert.equal(uncorrectedAudit.beforeMassProxy, 7);
  assert.equal(uncorrectedAudit.afterMassProxy, 3);
  assert.equal(corrected.correction.massProxySource, 'record-scale');
  assert.equal(corrected.correction.momentumMode, 'scale-weighted');
  assert.equal(corrected.correction.beforeMassProxy, 7);
  assert.equal(corrected.correction.uncorrectedAfterMassProxy, 3);
  assert.ok(Math.abs(corrected.correction.afterMassProxy - 7) < 1e-5);
  assert.ok(Math.abs(corrected.correction.correctedAfterMassProxy - 7) < 1e-5);
  assert.ok(Math.abs(corrected.correction.mutableMassProxy - 7) < 1e-5);
  assert.ok(Math.abs(corrected.correction.massScale - (7 / 3)) < 1e-6);
  assert.equal(corrected.correction.massConservationApplied, true);
  assert.equal(corrected.correction.massConservationMode, 'all-record-scale');
  assert.equal(corrected.correction.massProxyDeltaBefore, -4);
  assert.ok(Math.abs(corrected.correction.massProxyDeltaAfter) < 1e-5);
  assert.ok(Math.abs(corrected.correction.massProxyDelta) < 1e-5);
  assert.ok(Math.abs(corrected.audit.massProxyDelta) < 1e-5);
  assert.ok(Math.hypot(...corrected.audit.momentumDelta) < 1e-5);
  assert.ok(Math.abs(corrected.audit.kineticEnergyDelta) < 1e-5);
  assert.ok(Math.abs(corrected.audit.kineticEnergyDelta) < Math.abs(uncorrectedAudit.kineticEnergyDelta));
});

test('webgpu compute tries navigator.gpu before CPU fallback', async () => {
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  let requestAdapterCalled = false;
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: {
      gpu: {
        async requestAdapter() {
          requestAdapterCalled = true;
          return null;
        }
      }
    }
  });

  try {
    const compute = new WebGpuLadderCompute({ count: 8, seed: 1 });
    const status = await compute.initialize();
    assert.equal(requestAdapterCalled, true);
    assert.equal(status.backend, 'cpu-fallback');
    assert.match(status.lastError, /No WebGPU adapter available/);
  } finally {
    if (originalNavigator) {
      Object.defineProperty(globalThis, 'navigator', originalNavigator);
    } else {
      delete globalThis.navigator;
    }
  }
});

test('webgpu compute CPU fallback steps compact snapshots', () => {
  const compute = new WebGpuLadderCompute({ count: 24, seed: 99 });
  compute.fallbackToCpu();
  const before = compute.lastSnapshot.positions.slice();
  const snapshot = compute.step({
    time: 1.25,
    dt: 1 / 30,
    layerIndex: 4,
    environment: { oxygenFraction: 0.24, gravityMps2: 9.8, stellarFlux: 1.3 }
  });

  assert.equal(snapshot.schema, WEBGPU_COMPUTE_SNAPSHOT_SCHEMA);
  assert.equal(snapshot.backend, 'cpu-fallback');
  assert.equal(snapshot.count, 24);
  assert.equal(snapshot.layerIndex, 4);
  assert.equal(snapshot.positionFloats, WEBGPU_SNAPSHOT_POSITION_FLOATS);
  assert.equal(snapshot.positions.length, 24 * WEBGPU_SNAPSHOT_POSITION_FLOATS);
  assert.ok(snapshot.positions instanceof Float32Array);
  assert.ok(!('particles' in snapshot));
  assert.notDeepEqual(snapshot.positions, before);
});

test('webgpu compute snapshot preserves active layer index', () => {
  const compute = new WebGpuLadderCompute({ count: 8, seed: 7 });
  compute.fallbackToCpu();
  const snapshot = compute.step({
    time: 0.5,
    dt: 1 / 60,
    layerIndex: 6,
    environment: { oxygenFraction: 0.21, gravityMps2: 9.8, stellarFlux: 1 }
  });
  assert.equal(snapshot.layerIndex, 6);
  assert.equal(compute.lastSnapshot.layerIndex, 6);
});

test('webgpu compute status fields are packet-compatible', () => {
  const compute = new WebGpuLadderCompute({ count: 12, seed: 5, readbackInterval: 2 });
  compute.fallbackToCpu();
  const status = compute.getStatus();
  const encoded = JSON.parse(JSON.stringify(status));

  assert.deepEqual(encoded, status);
  assert.equal(status.schema, WEBGPU_COMPUTE_STATUS_SCHEMA);
  assert.equal(status.backend, 'cpu-fallback');
  assert.equal(status.particleCount, 12);
  assert.equal(status.particleFloats, WEBGPU_PARTICLE_FLOATS);
  assert.equal(status.particleStrideBytes, WEBGPU_PARTICLE_RECORD_BYTES);
  assert.equal(status.snapshotPositionFloats, WEBGPU_SNAPSHOT_POSITION_FLOATS);
  assert.equal(status.readbackInterval, 2);
  assert.equal(status.readbackIntervalReason, 'initial');
  assert.equal(status.readbackIntervalRevision, 0);
  assert.equal(typeof status.readbackBacklogFrames, 'number');
  assert.equal(typeof status.readPending, 'boolean');
  assert.equal(typeof status.webgpuAvailable, 'boolean');
  assert.equal(typeof status.deviceLost, 'boolean');
  assert.ok(!('device' in status));
  assert.ok(!('positions' in status));
});

test('webgpu compute accepts runtime readback cadence updates', () => {
  const compute = new WebGpuLadderCompute({ count: 12, seed: 6, readbackInterval: 3 });
  compute.fallbackToCpu();
  const status = compute.setReadbackInterval(9, 'unit-pressure');

  assert.equal(status.readbackInterval, 9);
  assert.equal(status.readbackIntervalReason, 'unit-pressure');
  assert.equal(status.readbackIntervalRevision, 1);

  compute.step({
    time: 0.25,
    dt: 1 / 60,
    layerIndex: 4,
    environment: { oxygenFraction: 0.21, gravityMps2: 9.8, stellarFlux: 1 },
    readbackInterval: 6,
    readbackReason: 'step-budget'
  });
  const nextStatus = compute.getStatus();
  assert.equal(nextStatus.readbackInterval, 6);
  assert.equal(nextStatus.readbackIntervalReason, 'step-budget');
  assert.equal(nextStatus.readbackIntervalRevision, 2);
});

test('adaptive multiscale budget derives shard and particle counts from manager profile', () => {
  const budget = createMultiscaleComputeBudget({
    estimateWorkloadBudget() {
      return {
        itemCount: 8192,
        shardsPerLayer: 2,
        workerCount: 16,
        plannedWorkerTasks: 16,
        resourceProfile: { tier: 'workstation', cpuCores: 16, gpuAvailable: true },
        workerPolicy: { minWorkers: 2, targetWorkers: 16, maxWorkers: 32 }
      };
    },
    getResourceProfile() {
      return { tier: 'workstation', cpuCores: 16, gpuAvailable: true };
    },
    getWorkerPolicy() {
      return { minWorkers: 2, targetWorkers: 16, maxWorkers: 32 };
    }
  }, {
    layerCount: 8
  });

  assert.equal(budget.schema, MULTISCALE_COMPUTE_BUDGET_SCHEMA);
  assert.equal(budget.resourceTier, 'workstation');
  assert.equal(budget.workersPerScale, 2);
  assert.equal(budget.plannedWorkers, 16);
  assert.equal(budget.totalParticleCount, 8192);
});

test('adaptive multiscale budget scales from declared memory and GPU capacity', () => {
  const manager = new ComputeManager({
    enableWorkers: false,
    minWorkers: 1,
    targetWorkers: 2,
    maxWorkers: 4,
    resourceProfile: {
      tier: 'workstation',
      cpuCores: 16,
      deviceMemoryGB: 32,
      memoryBudgetMB: 1,
      gpuMemoryBudgetMB: 8,
      gpuAvailable: true,
      gpuLimits: {
        maxBufferSize: 65536,
        maxStorageBufferBindingSize: 65536
      }
    }
  });

  const computeBudget = createMultiscaleComputeBudget(manager, {
    layerCount: 8,
    minParticleCount: 16,
    overrides: { maxParticles: 16384 }
  });
  assert.equal(computeBudget.capacity.budgetScale, 0.25);
  assert.equal(computeBudget.resourceProfile.gpuLimits.maxBufferSize, 65536);
  assert.equal(computeBudget.totalParticleCount, 102);
  assert.equal(computeBudget.workload.effectiveMaxItems, 102);

  const solverBudget = createMultiscaleSolverBudget(manager, { computeBudget });
  assert.equal(solverBudget.capacityScale, 0.25);
  assert.equal(solverBudget.maxwell.width, 5);
  assert.equal(solverBudget.molecularDynamics.atomCount, 24);
  assert.ok(solverBudget.quantumOrbitalGrid.gridSize >= 8);
  assert.equal(solverBudget.quantumOrbitalGrid.sampleCount, solverBudget.quantumOrbitalGrid.gridSize ** 3);
  assert.ok(solverBudget.quantumMaterialPotential.sampleCount >= 16);
  assert.equal(solverBudget.sphMaterial.particleCount, 40);
  assert.equal(solverBudget.cadencePolicy, 'scale-separated-defaults-v0');
  assert.equal(solverBudget.sphMaterial.cadenceFrames, 1);
  assert.equal(solverBudget.reactiveThermal.cadenceFrames, 1);
  assert.equal(solverBudget.molecularDynamics.cadenceFrames, 2);
  assert.equal(solverBudget.quantumMaterialPotential.cadenceFrames, 2);
  assert.ok(solverBudget.quantumOrbitalGrid.cadenceFrames >= 1);
  assert.equal(solverBudget.nbody.cadenceFrames, 2);
  assert.equal(solverBudget.maxwell.cadenceFrames, 3);
  assert.equal(solverBudget.hydroAtmosphere.cadenceFrames, 3);
  assert.equal(solverBudget.radiationOpacity.cadenceFrames, 3);
  assert.equal(solverBudget.stellarFusion.cadenceFrames, 4);
  assert.equal(solverBudget.magnetospherePlasma.cadenceFrames, 4);
  assert.equal(solverBudget.picPlasmaPatch.cadenceFrames, 3);
  assert.equal(solverBudget.relativisticCorrection.cadenceFrames, 5);
  assert.equal(solverBudget.cosmologyExpansion.cadenceFrames, 6);

  const overrideBudget = createMultiscaleComputeBudget(manager, {
    layerCount: 8,
    minParticleCount: 16,
    overrides: {
      maxParticles: 16384,
      particleCount: 4096
    }
  });
  assert.equal(overrideBudget.totalParticleCount, overrideBudget.workload.effectiveMaxItems);
  assert.equal(overrideBudget.totalParticleCount, 102);
});

test('memory pressure report normalizes browser heap samples against resource budget', () => {
  const report = createMemoryPressureReport({
    performanceMemory: {
      usedJSHeapSize: 920 * 1024 * 1024,
      totalJSHeapSize: 960 * 1024 * 1024,
      jsHeapSizeLimit: 1024 * 1024 * 1024
    },
    resourceProfile: {
      deviceMemoryGB: 8,
      memoryBudgetMB: 1024,
      gpuMemoryBudgetMB: 512
    },
    nowMs: 42
  });

  assert.equal(report.schema, MULTISCALE_MEMORY_PRESSURE_SCHEMA);
  assert.equal(report.source, 'performance.memory');
  assert.equal(report.available, true);
  assert.equal(report.sampledAtMs, 42);
  assert.equal(report.level, 'high');
  assert.equal(report.usedJSHeapSizeMB, 920);
  assert.equal(report.memoryBudgetMB, 1024);
  assert.equal(report.gpuMemoryBudgetMB, 512);
  assert.ok(report.usageRatio > 0.89);
  assert.ok(report.pressure > 1.7);

  const unavailable = createMemoryPressureReport({
    resourceProfile: { memoryBudgetMB: 2048 }
  });
  assert.equal(unavailable.schema, MULTISCALE_MEMORY_PRESSURE_SCHEMA);
  assert.equal(unavailable.available, false);
  assert.equal(unavailable.source, 'unavailable');
  assert.equal(unavailable.pressure, 0);
});

test('network capacity report normalizes browser connection and cluster hints', () => {
  const report = createNetworkCapacityReport({
    connection: {
      effectiveType: '4g',
      downlink: 250,
      rtt: 6,
      saveData: false
    },
    overrides: {
      clusterNodes: 4,
      clusterGpus: 2
    },
    computeBudget: {
      managerTargetWorkers: 12
    },
    nowMs: 84
  });

  assert.equal(report.schema, MULTISCALE_NETWORK_CAPACITY_SCHEMA);
  assert.equal(report.source, 'query-overrides+network-information');
  assert.equal(report.available, true);
  assert.equal(report.sampledAtMs, 84);
  assert.equal(report.bandwidthTier, 'high');
  assert.equal(report.latencyTier, 'lan');
  assert.equal(report.placementMode, 'cluster-lan');
  assert.equal(report.recommendation, 'cluster-shards');
  assert.equal(report.clusterNodeCount, 4);
  assert.equal(report.clusterGpuCount, 2);
  assert.equal(report.localWorkerTarget, 12);
  assert.ok(report.remoteWorkerCapacity > 0);
  assert.ok(report.capacityScore >= 1);

  const unavailable = createNetworkCapacityReport();
  assert.equal(unavailable.schema, MULTISCALE_NETWORK_CAPACITY_SCHEMA);
  assert.equal(unavailable.available, false);
  assert.equal(unavailable.placementMode, 'local-only');
});

test('placement plan stays advisory and defaults to local without remote capacity', () => {
  const plan = createPlacementPlan({
    solverBudget: {
      nbody: { bodyCount: 16 },
      cosmologyExpansion: { sampleCount: 64 },
      reactiveThermal: { cellCount: 1 }
    },
    solverRegistry: {
      solvers: createMultiscaleSolverDescriptors()
    },
    networkCapacity: createNetworkCapacityReport(),
    nowMs: 128
  });

  assert.equal(plan.schema, MULTISCALE_PLACEMENT_PLAN_SCHEMA);
  assert.equal(plan.sampledAtMs, 128);
  assert.equal(plan.advisoryOnly, true);
  assert.equal(Object.keys(plan.entries).length, 16);
  assert.equal(plan.counts.local, 16);
  assert.equal(plan.counts.peer, 0);
  assert.equal(plan.counts.cluster, 0);
  assert.equal(plan.entries.quantumOrbitalGrid.recommendedPlacement, 'local');
  assert.equal(plan.entries.quantumOrbitalGrid.executionMode, 'advisory-only');
  assert.equal(plan.entries.reactiveThermal.recommendedPlacement, 'local');
  assert.equal(plan.entries.reactiveThermal.executionMode, 'advisory-only');
  assert.ok(plan.entries.reactiveThermal.reasons.includes('pinned-local-coupling'));
});

test('placement plan recommends cluster candidates only when cluster network is strong', () => {
  const solverBudget = {
    cosmologyExpansion: { sampleCount: 2048, cadenceFrames: 1 },
    molecularDynamics: { atomCount: 512, cadenceFrames: 1 },
    reactiveThermal: { cellCount: 1, cadenceFrames: 1 },
    membraneShell: { segmentCount: 96, cadenceFrames: 1 }
  };
  const solverLoad = createSolverLoadReport({
    solverBudget,
    solverRuntime: {
      cosmologyExpansion: {
        cadenceFrames: 1,
        lastResult: { backend: 'webgpu-cosmology-expansion', elapsedTime: 24, sampleCount: 2048 }
      },
      molecularDynamics: {
        cadenceFrames: 1,
        lastResult: {
          backend: 'webgpu-molecular-dynamics',
          elapsedTime: 24,
          atomCount: 512,
          diagnostics: { neighborCandidatePairCount: 8192 },
          webgpuStatus: {
            acceptedNeighborPairCount: 4096,
            candidatePairCount: 8192,
            neighborCapacity: 16384
          }
        }
      }
    }
  });
  const plan = createPlacementPlan({
    solverBudget,
    solverLoad,
    memoryPressure: {
      schema: MULTISCALE_MEMORY_PRESSURE_SCHEMA,
      level: 'elevated',
      pressure: 1.2
    },
    networkCapacity: createNetworkCapacityReport({
      connection: { effectiveType: '4g', downlink: 1000, rtt: 5, saveData: false },
      overrides: { clusterNodes: 6, clusterGpus: 4 },
      computeBudget: { managerTargetWorkers: 8 }
    }),
    managerStats: {
      workerCount: 8,
      targetWorkers: 8,
      currentLoad: 1.1,
      activeTaskCount: 8,
      queuedTaskCount: 4,
      averageTaskDurationMs: 160
    }
  });

  assert.equal(plan.advisoryOnly, true);
  assert.equal(plan.entries.cosmologyExpansion.recommendedPlacement, 'cluster');
  assert.equal(plan.entries.cosmologyExpansion.syncMode, 'coarse-sync');
  assert.equal(plan.entries.reactiveThermal.recommendedPlacement, 'local');
  assert.equal(plan.entries.membraneShell.recommendedPlacement, 'local');
  assert.ok(plan.counts.cluster > 0);
  assert.ok(plan.dominantCandidate);
});

test('placement plan uses peer only for peer-friendly solver classes', () => {
  const solverBudget = {
    cosmologyExpansion: { sampleCount: 1024, cadenceFrames: 1 },
    molecularDynamics: { atomCount: 512, cadenceFrames: 1 }
  };
  const solverLoad = createSolverLoadReport({
    solverBudget,
    solverRuntime: {
      cosmologyExpansion: {
        cadenceFrames: 1,
        lastResult: { backend: 'webgpu-cosmology-expansion', elapsedTime: 20, sampleCount: 1024 }
      },
      molecularDynamics: {
        cadenceFrames: 1,
        lastResult: {
          backend: 'webgpu-molecular-dynamics',
          elapsedTime: 22,
          atomCount: 512,
          diagnostics: { neighborCandidatePairCount: 8192 },
          webgpuStatus: {
            acceptedNeighborPairCount: 4096,
            candidatePairCount: 8192,
            neighborCapacity: 16384
          }
        }
      }
    }
  });
  const plan = createPlacementPlan({
    solverBudget,
    solverLoad,
    networkCapacity: createNetworkCapacityReport({
      connection: { effectiveType: '4g', downlink: 1000, rtt: 25, saveData: false },
      computeBudget: { managerTargetWorkers: 6 }
    }),
    managerStats: {
      workerCount: 6,
      targetWorkers: 6,
      currentLoad: 1,
      activeTaskCount: 6,
      queuedTaskCount: 2,
      averageTaskDurationMs: 130
    }
  });

  assert.equal(plan.networkRecommendation, 'peer-shards');
  assert.equal(plan.entries.cosmologyExpansion.recommendedPlacement, 'peer');
  assert.equal(plan.entries.cosmologyExpansion.syncMode, 'coarse-sync');
  assert.equal(plan.entries.molecularDynamics.recommendedPlacement, 'local');
  assert.ok(plan.entries.molecularDynamics.constraints.includes('lan-required-for-tight-coupling'));
});

test('remote placement readiness remains guarded until explicitly configured', () => {
  const disabled = createRemotePlacementReadiness({
    overrides: {},
    networkCapacity: createNetworkCapacityReport(),
    placementPlan: {
      counts: { local: 14, peer: 0, cluster: 0 }
    },
    managerCapabilities: {},
    nowMs: 256
  });
  assert.equal(disabled.schema, MULTISCALE_REMOTE_PLACEMENT_READINESS_SCHEMA);
  assert.equal(disabled.sampledAtMs, 256);
  assert.equal(disabled.enabled, false);
  assert.equal(disabled.armed, false);
  assert.equal(disabled.dispatchReady, false);
  assert.equal(disabled.advisoryOnly, true);
  assert.equal(disabled.reason, 'disabled-by-default');
  assert.equal(disabled.requestSchema, 'peercompute.compute.remote-request.v0');
  assert.equal(disabled.resultSchema, 'peercompute.compute.remote-result.v0');
  assert.deepEqual(disabled.allowedTaskTypes, ['module', 'wasm']);
  assert.equal(disabled.functionTasksAllowed, false);

  const armed = createRemotePlacementReadiness({
    overrides: {
      enableRemotePlacement: true,
      remotePlacementPeerId: 'peer-alpha',
      remotePlacementTimeoutMs: 12000
    },
    networkCapacity: createNetworkCapacityReport({
      connection: { effectiveType: '4g', downlink: 250, rtt: 8, saveData: false },
      computeBudget: { managerTargetWorkers: 8 },
      nowMs: 300
    }),
    placementPlan: {
      counts: { local: 10, peer: 3, cluster: 1 }
    },
    managerCapabilities: {
      placementExecutor: true,
      placementExecutorId: 'network-placement:peer-alpha',
      placementAdmission: true,
      placementAdmissionId: 'trust-gate',
      placementResultValidator: true,
      placementResultValidatorId: 'quorum',
      placementTaskSigner: true,
      placementTaskSignerId: 'local-demo-key'
    },
    nowMs: 301
  });
  assert.equal(armed.enabled, true);
  assert.equal(armed.armed, true);
  assert.equal(armed.dispatchReady, true);
  assert.equal(armed.advisoryOnly, false);
  assert.equal(armed.peerId, 'peer-alpha');
  assert.equal(armed.timeoutMs, 12000);
  assert.equal(armed.executorConfigured, true);
  assert.equal(armed.admissionConfigured, true);
  assert.equal(armed.signerConfigured, true);
  assert.equal(armed.resultValidatorConfigured, true);
  assert.equal(armed.remoteCandidateCount, 4);
  assert.equal(armed.reason, 'ready');

  const explicitPeer = createRemotePlacementReadiness({
    overrides: {
      enableRemotePlacement: true,
      remotePlacementPeerId: 'peer-direct',
      remotePlacementMode: 'peer'
    },
    networkCapacity: createNetworkCapacityReport({
      connection: { effectiveType: '4g', downlink: 100, rtt: 12, saveData: false },
      computeBudget: { managerTargetWorkers: 8 },
      nowMs: 302
    }),
    placementPlan: {
      counts: { local: 14, peer: 0, cluster: 0 }
    },
    managerCapabilities: {
      placementExecutor: true,
      placementExecutorId: 'nodekernel-network-placement:peer-direct',
      placementAdmission: true,
      placementResultValidator: true,
      placementTaskSigner: true
    },
    nowMs: 302
  });
  assert.equal(explicitPeer.dispatchReady, true);
  assert.equal(explicitPeer.remoteCandidateCount, 1);
  assert.equal(explicitPeer.peerCandidateCount, 1);
  assert.equal(explicitPeer.clusterCandidateCount, 0);
  assert.equal(explicitPeer.explicitPeerTargetConfigured, true);
  assert.equal(explicitPeer.reason, 'ready');

  const loopback = createRemotePlacementReadiness({
    overrides: {
      enableRemotePlacement: true,
      enableLoopbackRemotePlacement: true,
      remotePlacementPeerId: 'loopback-peer',
      remotePlacementExecutorMode: 'loopback'
    },
    networkCapacity: createNetworkCapacityReport(),
    placementPlan: {
      counts: { local: 14, peer: 0, cluster: 0 }
    },
    managerCapabilities: {
      placementExecutor: true,
      placementExecutorId: 'multiscale-loopback-placement'
    },
    nowMs: 303
  });
  assert.equal(loopback.enabled, true);
  assert.equal(loopback.loopbackEnabled, true);
  assert.equal(loopback.dispatchReady, true);
  assert.equal(loopback.remoteCandidateCount, 1);
  assert.equal(loopback.peerCandidateCount, 1);
  assert.equal(loopback.reason, 'ready');
  assert.match(loopback.note, /Loopback remote placement/);
});

test('remote peer selection scores connected non-relay peers deterministically', () => {
  assert.equal(extractPeerIdFromMultiaddr('/ip4/127.0.0.1/tcp/4001/p2p/relay-peer'), 'relay-peer');
  const report = createRemotePeerSelectionReport({
    connectedPeerIds: ['local-peer', 'relay-peer', 'peer-beta', 'peer-alpha', 'peer-beta'],
    localPeerId: 'local-peer',
    bootstrapPeers: ['/ip4/127.0.0.1/tcp/4100/p2p/relay-peer'],
    networkCapacity: {
      capacityScore: 2,
      remoteWorkerCapacity: 12
    },
    managerStats: {
      workerCount: 4,
      targetWorkers: 4,
      currentLoad: 1.5,
      queuedTaskCount: 3
    },
    preferredPeerIds: ['peer-alpha'],
    trustedPeerIds: ['peer-beta'],
    peerCapacity: {
      'peer-alpha': {
        workerCount: 8,
        gpuCount: 1,
        bandwidthMbps: 500,
        rttMs: 12,
        reliability: 0.97
      },
      'peer-beta': {
        workerCount: 2
      }
    },
    nowMs: 512
  });

  assert.equal(report.schema, MULTISCALE_REMOTE_PEER_SELECTION_SCHEMA);
  assert.equal(report.sampledAtMs, 512);
  assert.equal(report.selectedPeerId, 'peer-alpha');
  assert.equal(report.candidateCount, 2);
  assert.equal(report.rejectedCount, 3);
  assert.equal(report.candidates[0].rank, 1);
  assert.equal(report.candidates[0].preferred, true);
  assert.ok(report.candidates[0].score > report.candidates[1].score);
  assert.ok(report.candidates[0].reasons.includes('advertised-capacity'));
  assert.ok(report.rejected.some((entry) => entry.peerId === 'relay-peer' && entry.reason === 'bootstrap-relay-peer'));
  assert.ok(report.rejected.some((entry) => entry.peerId === 'local-peer' && entry.reason === 'local-peer'));
  assert.ok(report.rejected.some((entry) => entry.peerId === 'peer-beta' && entry.reason === 'duplicate-peer-id'));

  const scalablePoolReport = createRemotePeerSelectionReport({
    connectedPeerIds: ['peer-scalable'],
    peerCapacity: {
      'peer-scalable': {
        workerCount: 0,
        remoteWorkerCapacity: 12,
        targetWorkers: 12,
        gpuCount: 1
      }
    }
  });
  assert.equal(scalablePoolReport.selectedPeerId, 'peer-scalable');
  assert.equal(scalablePoolReport.candidates[0].capacity.workerCount, 12);
  assert.ok(scalablePoolReport.candidates[0].reasons.includes('advertised-capacity'));
});

test('remote peer reliability records outcomes and can drive peer selection', () => {
  let reliability = createRemotePeerReliabilityReport({ generatedAtMs: 100 });
  assert.equal(reliability.schema, MULTISCALE_REMOTE_PEER_RELIABILITY_SCHEMA);
  assert.equal(reliability.peerCount, 0);

  reliability = updateRemotePeerReliabilityFromPlacement(reliability, {
    actualPlacement: 'remote-peer',
    ok: true,
    peerId: 'peer-reliable',
    taskId: 'solver:cosmology:1',
    completedAt: 120,
    provenance: {
      taskId: 'solver:cosmology:1',
      peerId: 'peer-reliable',
      workerId: 'worker-1',
      durationMs: 10,
      verification: { verified: true },
      validation: { valid: true }
    }
  }, { nowMs: 121 });

  reliability = updateRemotePeerReliabilityFromPlacement(reliability, {
    actualPlacement: 'remote-peer',
    ok: false,
    errorKind: 'validation-failed',
    peerId: 'peer-flaky',
    taskId: 'solver:cosmology:2',
    completedAt: 130,
    provenance: {
      taskId: 'solver:cosmology:2',
      peerId: 'peer-flaky',
      durationMs: 30,
      verification: { verified: true },
      validation: { valid: false }
    }
  }, { nowMs: 131 });

  const reliable = reliability.peers['peer-reliable'];
  const flaky = reliability.peers['peer-flaky'];
  assert.equal(reliability.peerCount, 2);
  assert.equal(reliable.successes, 1);
  assert.equal(reliable.failures, 0);
  assert.equal(reliable.lastWorkerId, 'worker-1');
  assert.equal(flaky.validationFailed, 1);
  assert.ok(getRemotePeerReliability(reliability, 'peer-reliable') > getRemotePeerReliability(reliability, 'peer-flaky'));

  const selection = createRemotePeerSelectionReport({
    connectedPeerIds: ['peer-flaky', 'peer-reliable'],
    peerCapacity: {
      'peer-flaky': {
        workerCount: 4,
        reliability: getRemotePeerReliability(reliability, 'peer-flaky')
      },
      'peer-reliable': {
        workerCount: 4,
        reliability: getRemotePeerReliability(reliability, 'peer-reliable')
      }
    },
    nowMs: 140
  });
  assert.equal(selection.selectedPeerId, 'peer-reliable');
  assert.equal(selection.candidates[0].capacity.reliability, reliable.reliabilityScore);
  assert.ok(selection.candidates[0].score > selection.candidates[1].score);
});

test('remote peer placement plan rotates balanced primaries while preserving manual pins', () => {
  const selection = createRemotePeerSelectionReport({
    connectedPeerIds: ['peer-alpha', 'peer-beta', 'peer-gamma'],
    preferredPeerIds: ['peer-alpha'],
    peerCapacity: {
      'peer-alpha': { workerCount: 8, reliability: 0.95 },
      'peer-beta': { workerCount: 8, reliability: 0.94 },
      'peer-gamma': { workerCount: 4, reliability: 0.93 }
    },
    nowMs: 600
  });
  assert.equal(selection.selectedPeerId, 'peer-alpha');

  const first = createRemotePeerPlacementPlan({
    selectionReport: selection,
    requestedReplicaPeerIds: ['peer-gamma'],
    targetReplicaCount: 3,
    balanceRemotePlacementPeers: true,
    balanceSeed: 0,
    nowMs: 610
  });
  assert.equal(first.schema, MULTISCALE_REMOTE_PEER_PLACEMENT_PLAN_SCHEMA);
  assert.equal(first.primaryPeerId, 'peer-alpha');
  assert.deepEqual(first.replicaPeerIds, ['peer-gamma', 'peer-beta']);
  assert.deepEqual(first.peerIds, ['peer-alpha', 'peer-gamma', 'peer-beta']);
  assert.equal(first.reason, 'balanced-remote-primary');
  assert.equal(first.balanceRemotePlacementPeers, true);

  const rotated = createRemotePeerPlacementPlan({
    selectionReport: selection,
    requestedReplicaPeerIds: ['peer-gamma'],
    targetReplicaCount: 3,
    balanceRemotePlacementPeers: true,
    balanceSeed: 1,
    nowMs: 611
  });
  assert.equal(rotated.primaryPeerId, 'peer-beta');
  assert.deepEqual(rotated.replicaPeerIds, ['peer-gamma', 'peer-alpha']);
  assert.equal(rotated.primarySource, 'balanced-candidate');

  const pinned = createRemotePeerPlacementPlan({
    selectionReport: selection,
    requestedPrimaryPeerId: 'peer-manual',
    requestedReplicaPeerIds: ['peer-gamma'],
    targetReplicaCount: 2,
    balanceRemotePlacementPeers: true,
    balanceSeed: 99,
    nowMs: 612
  });
  assert.equal(pinned.primaryPeerId, 'peer-manual');
  assert.deepEqual(pinned.replicaPeerIds, ['peer-gamma']);
  assert.equal(pinned.reason, 'explicit-primary');
  assert.equal(pinned.primarySource, 'requested-primary');
});

test('remote peer reliability persists by scope and decays stale outcomes', () => {
  const memory = new Map();
  const storage = {
    getItem: (key) => memory.has(key) ? memory.get(key) : null,
    setItem: (key, value) => memory.set(key, value)
  };
  const scopeId = createRemotePeerReliabilityScope({
    roomId: 'alpha room',
    topologyId: 'ladder',
    topology: 'distributed'
  });
  const storageKey = createRemotePeerReliabilityStorageKey(scopeId);
  let reliability = createRemotePeerReliabilityReport({
    generatedAtMs: 1000,
    scopeId,
    storageKey,
    decayHalfLifeMs: 1000,
    maxEntryAgeMs: 100000
  });
  reliability = updateRemotePeerReliabilityFromPlacement(reliability, {
    actualPlacement: 'remote-peer',
    ok: true,
    peerId: 'peer-stored',
    taskId: 'solver:cosmology:persist',
    completedAt: 1000,
    provenance: {
      peerId: 'peer-stored',
      workerId: 'worker-1',
      durationMs: 20,
      verification: { verified: true },
      validation: { valid: true }
    }
  }, { nowMs: 1000 });

  const saveStatus = saveRemotePeerReliabilityReportToStorage(reliability, {
    storage,
    storageKey,
    scopeId,
    nowMs: 1100
  });
  assert.equal(saveStatus.schema, MULTISCALE_REMOTE_PEER_RELIABILITY_STORE_SCHEMA);
  assert.equal(saveStatus.status, 'saved');
  assert.ok(memory.has(storageKey));

  const loaded = loadRemotePeerReliabilityReportFromStorage({
    storage,
    storageKey,
    scopeId,
    nowMs: 2000,
    decayHalfLifeMs: 1000,
    maxEntryAgeMs: 100000
  });
  assert.equal(loaded.persistence.status, 'loaded');
  assert.equal(loaded.report.scopeId, scopeId);
  assert.equal(loaded.report.storageKey, storageKey);
  assert.equal(loaded.report.peers['peer-stored'].successes, 1);
  assert.ok(loaded.report.peers['peer-stored'].reliabilityScore < reliability.peers['peer-stored'].reliabilityScore);
  assert.ok(loaded.report.peers['peer-stored'].reliabilityScore > 0.74);

  const expired = loadRemotePeerReliabilityReportFromStorage({
    storage,
    storageKey,
    scopeId,
    nowMs: 200000,
    decayHalfLifeMs: 1000,
    maxEntryAgeMs: 1000
  });
  assert.equal(expired.report.peerCount, 0);
});

test('remote peer selection reports empty candidate sets without fabricating a target', () => {
  const report = createRemotePeerSelectionReport({
    connectedPeerIds: ['local-peer', 'relay-peer', 'raw-relay-peer'],
    localPeerId: 'local-peer',
    bootstrapPeers: ['/dns4/relay.example/tcp/443/wss/p2p/relay-peer', 'raw-relay-peer'],
    nowMs: 700
  });

  assert.equal(report.schema, MULTISCALE_REMOTE_PEER_SELECTION_SCHEMA);
  assert.equal(report.selectedPeerId, null);
  assert.equal(report.selectedScore, 0);
  assert.equal(report.reason, 'no-connected-peer-candidates');
  assert.equal(report.candidateCount, 0);
  assert.equal(report.rejectedCount, 3);
  assert.deepEqual(report.limitations, ['per-peer-capacity-advertisement-unavailable']);
});

test('remote solver placement policy promotes only explicit coarse solver families', () => {
  const readiness = {
    schema: MULTISCALE_REMOTE_PLACEMENT_READINESS_SCHEMA,
    enabled: true,
    armed: true,
    dispatchReady: true,
    advisoryOnly: false,
    requestedMode: 'peer',
    peerId: 'peer-alpha',
    timeoutMs: 12000,
    reason: 'ready'
  };
  const disabledPolicy = createRemoteSolverPlacementPolicy({
    readiness,
    nowMs: 350
  });
  assert.equal(disabledPolicy.schema, MULTISCALE_REMOTE_SOLVER_PLACEMENT_POLICY_SCHEMA);
  assert.equal(disabledPolicy.sampledAtMs, 350);
  assert.equal(disabledPolicy.enabled, false);
  assert.equal(disabledPolicy.active, false);
  assert.equal(disabledPolicy.advisoryOnly, true);

  const baseCosmologyHint = {
    solverKey: 'cosmologyExpansion',
    solverId: 'cosmology-expansion',
    recommendedPlacement: 'peer',
    executionMode: 'advisory-only',
    syncMode: 'coarse-sync',
    confidence: 0.82,
    targetReplicaCount: 1,
    coupling: 'loose',
    remoteClass: 'coarse',
    advisoryOnly: true
  };
  const disabledHint = promoteSolverPlacementHint(baseCosmologyHint, {
    solverKey: 'cosmologyExpansion',
    readiness,
    policy: disabledPolicy,
    nowMs: 351
  });
  assert.equal(disabledHint.advisoryOnly, true);
  assert.equal(disabledHint.remoteSolverPlacement.promoted, false);
  assert.equal(disabledHint.remoteSolverPlacement.reason, 'policy-disabled');

  const activePolicy = createRemoteSolverPlacementPolicy({
    enabled: true,
    families: ['cosmologyExpansion', 'nbody'],
    mode: 'auto',
    readiness,
    nowMs: 352
  });
  assert.equal(activePolicy.enabled, true);
  assert.equal(activePolicy.active, true);
  assert.equal(activePolicy.advisoryOnly, false);
  assert.deepEqual(activePolicy.families, ['cosmologyExpansion', 'nbody']);

  const promoted = promoteSolverPlacementHint(baseCosmologyHint, {
    solverKey: 'cosmologyExpansion',
    readiness,
    policy: activePolicy,
    nowMs: 353
  });
  assert.equal(promoted.advisoryOnly, false);
  assert.equal(promoted.executionMode, 'non-advisory-remote');
  assert.equal(promoted.requestedPlacement, 'peer');
  assert.equal(promoted.recommendedPlacement, 'peer');
  assert.equal(promoted.peerId, 'peer-alpha');
  assert.equal(promoted.timeoutMs, 12000);
  assert.equal(promoted.remoteSolverPlacement.promoted, true);
  assert.equal(promoted.remoteSolverPlacement.schema, MULTISCALE_REMOTE_SOLVER_PLACEMENT_POLICY_SCHEMA);

  const decisions = createRemoteSolverPlacementDecisionReport({
    placementPlan: {
      schema: MULTISCALE_PLACEMENT_PLAN_SCHEMA,
      entries: {
        cosmologyExpansion: baseCosmologyHint,
        molecularDynamics: {
          solverKey: 'molecularDynamics',
          solverId: 'molecular-dynamics',
          recommendedPlacement: 'peer',
          confidence: 0.95,
          remoteClass: 'lan',
          coupling: 'tight',
          advisoryOnly: true
        }
      }
    },
    readiness,
    policy: activePolicy,
    nowMs: 354
  });
  assert.equal(decisions.schema, MULTISCALE_REMOTE_SOLVER_PLACEMENT_DECISIONS_SCHEMA);
  assert.equal(decisions.sampledAtMs, 354);
  assert.equal(decisions.counts.promoted, 1);
  assert.equal(decisions.counts.advisory, 1);
  assert.equal(decisions.entries.cosmologyExpansion.promoted, true);
  assert.equal(decisions.entries.molecularDynamics.promoted, false);
  assert.equal(decisions.entries.molecularDynamics.reason, 'solver-family-not-allowed');

  const molecularDenied = promoteSolverPlacementHint({
    solverKey: 'molecularDynamics',
    solverId: 'molecular-dynamics',
    recommendedPlacement: 'peer',
    confidence: 0.95,
    remoteClass: 'lan',
    coupling: 'tight',
    advisoryOnly: true
  }, {
    solverKey: 'molecularDynamics',
    readiness,
    policy: createRemoteSolverPlacementPolicy({
      enabled: true,
      families: ['molecularDynamics'],
      readiness
    })
  });
  assert.equal(molecularDenied.advisoryOnly, true);
  assert.equal(molecularDenied.remoteSolverPlacement.promoted, false);
  assert.equal(molecularDenied.remoteSolverPlacement.reason, 'remote-class-not-allowed');

  const blockedPolicy = createRemoteSolverPlacementPolicy({
    enabled: true,
    families: ['cosmologyExpansion'],
    readiness: {
      dispatchReady: false,
      reason: 'network-placement-executor-not-configured'
    }
  });
  const blockedHint = promoteSolverPlacementHint(baseCosmologyHint, {
    solverKey: 'cosmologyExpansion',
    readiness,
    policy: blockedPolicy
  });
  assert.equal(blockedPolicy.active, false);
  assert.equal(blockedHint.advisoryOnly, true);
  assert.equal(blockedHint.remoteSolverPlacement.reason, 'network-placement-executor-not-configured');
});

test('remote solver placement query overrides parse selectable non-advisory families', () => {
  const overrides = readRemoteSolverPlacementOverrides('?enableRemoteSolverPlacement=1&remoteSolverFamilies=cosmologyExpansion,nbody,cosmologyExpansion&remoteSolverPlacementMode=cluster&remoteSolverNonAdvisory=0&remoteSolverPlacementConfidence=0.7&remoteSolverClasses=coarse,moderate');
  assert.equal(overrides.enabled, true);
  assert.deepEqual(overrides.families, ['cosmologyExpansion', 'nbody']);
  assert.equal(overrides.mode, 'cluster');
  assert.equal(overrides.nonAdvisory, false);
  assert.equal(overrides.minimumConfidence, 0.7);
  assert.deepEqual(overrides.allowedRemoteClasses, ['coarse', 'moderate']);
});

test('loopback remote placement executor runs a solver through the non-advisory manager path', async () => {
  resetCosmologyExpansion();
  const solverId = 'cosmology-expansion';
  const executor = createLoopbackRemotePlacementExecutor({
    executorId: 'multiscale-loopback-test',
    peerId: 'loopback-peer-alpha'
  });
  const manager = new ComputeManager({
    enableWorkers: false,
    placementExecutor: executor,
    placementExecutorId: executor.placementExecutorId,
    placementTimeoutMs: 15000,
    remoteResultVerification: true,
    placementResultValidator: (result, context) => {
      assert.equal(result.schema, COSMOLOGY_EXPANSION_RESULT_SCHEMA);
      assert.equal(context.provenance.executorId, 'multiscale-loopback-test');
      assert.equal(context.provenance.peerId, 'loopback-peer-alpha');
      assert.equal(context.taskPacket.schema, COMPUTE_TASK_PACKET_SCHEMA);
      return {
        schema: COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA,
        valid: true,
        reason: 'loopback-test-accepted'
      };
    },
    placementResultValidatorId: 'loopback-test-validator'
  });
  for (const descriptor of createMultiscaleSolverDescriptors()) {
    manager.registerSolver(descriptor);
  }
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask(solverId, {
    id: 'loopback-cosmology-task',
    stateKey: 'loopback:cosmology:test',
    input: {
      stateKey: 'loopback:cosmology:test',
      taskId: 'loopback-cosmology-task',
      reset: true,
      emitCommitDelta: true,
      dt: 0.02,
      state: makeCosmologyExpansionInitialState({
        sampleCount: 8,
        seed: 42
      })
    },
    placementHint: {
      solverKey: 'cosmologyExpansion',
      solverId,
      requestedPlacement: 'peer',
      recommendedPlacement: 'peer',
      executionMode: 'non-advisory-remote',
      syncMode: 'coarse-sync',
      advisoryOnly: false,
      confidence: 0.99,
      targetReplicaCount: 1,
      coupling: 'loose',
      remoteClass: 'coarse',
      reasons: ['unit-loopback-remote-placement']
    }
  });

  assert.equal(executor.schema, MULTISCALE_LOOPBACK_REMOTE_PLACEMENT_SCHEMA);
  assert.equal(result.schema, COSMOLOGY_EXPANSION_RESULT_SCHEMA);
  assert.equal(result.solverId, solverId);
  assert.equal(result.stateKey, 'loopback:cosmology:test');
  assert.equal(result.sequence, 1);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].scope, 'multiscale-solver-deltas');
  assert.equal(deltas[0].payload.schema, COSMOLOGY_EXPANSION_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.solverId, solverId);

  const stats = manager.getStats();
  assert.equal(stats.totalTasksSubmitted, 1);
  assert.equal(stats.totalTasksCompleted, 1);
  assert.equal(stats.remoteTasksCompleted, 1);
  assert.equal(stats.inlineTasksCompleted, 0);
  assert.equal(stats.taskPlacement.remoteRequested, 1);
  assert.equal(stats.taskPlacement.remoteExecuted, 1);
  assert.equal(stats.taskPlacement.remoteAttempts, 1);
  assert.equal(stats.taskPlacement.byRecommendedPlacement.peer.completed, 1);
  assert.equal(stats.taskPlacement.byActualPlacement['remote-peer'].completed, 1);
  const placement = stats.taskPlacement.lastPlacement;
  assert.equal(placement.actualPlacement, 'remote-peer');
  assert.equal(placement.provenance.schema, COMPUTE_REMOTE_PLACEMENT_PROVENANCE_SCHEMA);
  assert.equal(placement.provenance.taskPacketSchema, COMPUTE_TASK_PACKET_SCHEMA);
  assert.equal(placement.provenance.executorId, 'multiscale-loopback-test');
  assert.equal(placement.provenance.peerId, 'loopback-peer-alpha');
  assert.equal(placement.provenance.workerId, 'loopback-main-thread');
  assert.equal(placement.provenance.trustLevel, 'local-loopback-test');
  assert.equal(placement.provenance.resultSchema, COSMOLOGY_EXPANSION_RESULT_SCHEMA);
  assert.equal(placement.provenance.verification.schema, COMPUTE_REMOTE_PLACEMENT_VERIFICATION_SCHEMA);
  assert.equal(placement.provenance.verification.verified, true);
  assert.equal(placement.provenance.validation.schema, COMPUTE_REMOTE_PLACEMENT_VALIDATION_SCHEMA);
  assert.equal(placement.provenance.validation.valid, true);
  assert.equal(placement.provenance.validation.reason, 'loopback-test-accepted');
  assert.match(placement.provenance.codeHash, /^fnv1a32-/);
  assert.match(placement.provenance.inputHash, /^fnv1a32-/);
  assert.match(placement.provenance.taskHash, /^fnv1a32-/);
  assert.match(placement.provenance.outputHash, /^fnv1a32-/);
  assert.match(placement.provenance.commitDeltaHash, /^fnv1a32-/);
});

test('peer network overrides default off and parse opt-in NodeKernel flags', () => {
  const defaults = readPeerNetworkOverrides('');
  assert.equal(defaults.enablePeerNetwork, false);
  assert.equal(defaults.roomId, 'multiscale');
  assert.equal(defaults.topologyId, 'multiscale-ladder');
  assert.equal(defaults.topology, 'distributed');
  assert.equal(defaults.enableRemoteComputeResponder, false);
  assert.equal(defaults.allowRemoteFunctionTasks, false);
  assert.equal(defaults.autoWireRemotePlacement, true);

  const overrides = readPeerNetworkOverrides('?enablePeerNetwork=1&peerRoomId=lab&peerTopologyId=ladder-lab&peerTopology=hierarchy&peerStateTopic=pc.lab.state&enableRemoteComputeResponder=yes&allowRemoteFunctionTasks=false&autoWireRemotePlacement=0&remoteComputeTimeoutMs=12000');
  assert.equal(overrides.enablePeerNetwork, true);
  assert.equal(overrides.roomId, 'lab');
  assert.equal(overrides.topologyId, 'ladder-lab');
  assert.equal(overrides.topology, 'hierarchy');
  assert.equal(overrides.stateTopic, 'pc.lab.state');
  assert.equal(overrides.enableRemoteComputeResponder, true);
  assert.equal(overrides.allowRemoteFunctionTasks, false);
  assert.equal(overrides.autoWireRemotePlacement, false);
  assert.equal(overrides.remoteComputeTimeoutMs, 12000);
});

test('multiscale relay config loader follows override, source, local fallback order', async () => {
  const responses = new Map([
    ['https://relay.example/config.json', {
      bootstrapPeers: [' /dns4/example.com/tcp/443/wss/p2p/relay ', '']
    }],
    ['./relay-config-source.json', {
      relayConfigUrl: 'https://relay.example/from-source.json'
    }],
    ['https://relay.example/from-source.json', {
      bootstrapPeers: ['/dns4/source.example/tcp/443/wss/p2p/source']
    }],
    ['./relay-config.json', {
      bootstrapPeers: ['/dns4/local.example/tcp/443/wss/p2p/local']
    }]
  ]);
  const requested = [];
  const fetchFn = async (url) => {
    requested.push(url);
    const body = responses.get(url);
    return body
      ? { ok: true, json: async () => body }
      : { ok: false, json: async () => ({}) };
  };

  const override = await loadRelayConfig({
    search: '?relayConfig=https://relay.example/config.json',
    fetchFn
  });
  assert.deepEqual(
    normalizeBootstrapPeers(override.bootstrapPeers),
    ['/dns4/example.com/tcp/443/wss/p2p/relay']
  );

  const source = await loadRelayConfig({ search: '', fetchFn });
  assert.deepEqual(source.bootstrapPeers, ['/dns4/source.example/tcp/443/wss/p2p/source']);
  assert.ok(requested.includes('./relay-config-source.json'));
  assert.ok(requested.includes('https://relay.example/from-source.json'));
});

test('bootstrap peer normalization trims duplicates and drops empty entries', () => {
  assert.deepEqual(
    normalizeBootstrapPeers([' /dns4/a/tcp/1 ', '', null, '/dns4/a/tcp/1', '/dns4/b/tcp/2']),
    ['/dns4/a/tcp/1', '/dns4/b/tcp/2']
  );
});

test('adaptive solver budget sizes law workers from device profile and overrides', () => {
  const manager = {
    getResourceProfile() {
      return { tier: 'workstation', cpuCores: 16, gpuAvailable: true };
    }
  };
  const budget = createMultiscaleSolverBudget(manager, {
    overrides: {
      nbodyBodies: 21,
      nbodyMode: 'tree',
      nbodyTheta: 0.4,
      nbodyTreeThreshold: 64,
      maxwellGrid: 18,
      cosmologySamples: 144,
      molecularAtoms: 66,
      quantumGrid: 20,
      quantumMaterialSamples: 192,
      sphParticles: 144,
      hydroGrid: 16,
      radiationGrid: 12,
      stellarGrid: 14,
      magnetosphereGrid: 12,
      picGrid: 10,
      picParticles: 72,
      relativitySamples: 88,
      combustionGrid: 10,
      membraneSegments: 48,
      solverCadence: 3,
      sphCadence: 1,
      hydroCadence: 2,
      radiationCadence: 4,
      stellarCadence: 6,
      magnetosphereCadence: 7,
      picCadence: 8,
      relativityCadence: 9,
      cosmologyCadence: 8,
      molecularCadence: 6,
      quantumGridCadence: 4,
      quantumMaterialCadence: 5,
      combustionCadence: 5,
      membraneCadence: 2
    }
  });

  assert.equal(budget.schema, MULTISCALE_SOLVER_BUDGET_SCHEMA);
  assert.equal(budget.resourceTier, 'workstation');
  assert.equal(budget.nbody.bodyCount, 21);
  assert.equal(budget.nbody.cadenceFrames, 3);
  assert.equal(budget.nbody.gravityMode, 'tree');
  assert.equal(budget.nbody.treeTheta, 0.4);
  assert.equal(budget.nbody.treeThreshold, 64);
  assert.equal(budget.maxwell.width, 18);
  assert.equal(budget.maxwell.cellCount, 18 * 18);
  assert.equal(budget.cosmologyExpansion.sampleCount, 144);
  assert.equal(budget.cosmologyExpansion.cadenceFrames, 8);
  assert.equal(budget.molecularDynamics.atomCount, 66);
  assert.equal(budget.molecularDynamics.cadenceFrames, 6);
  assert.equal(budget.quantumOrbitalGrid.gridSize, 20);
  assert.equal(budget.quantumOrbitalGrid.sampleCount, 8000);
  assert.equal(budget.quantumOrbitalGrid.cadenceFrames, 4);
  assert.equal(budget.quantumMaterialPotential.sampleCount, 192);
  assert.equal(budget.quantumMaterialPotential.cadenceFrames, 5);
  assert.equal(budget.reactiveThermal.cadenceFrames, 3);
  assert.equal(budget.sphMaterial.particleCount, 144);
  assert.equal(budget.sphMaterial.cadenceFrames, 1);
  assert.equal(budget.hydroAtmosphere.width, 16);
  assert.equal(budget.hydroAtmosphere.height, 8);
  assert.equal(budget.hydroAtmosphere.cellCount, 16 * 8);
  assert.equal(budget.hydroAtmosphere.cadenceFrames, 2);
  assert.equal(budget.radiationOpacity.width, 12);
  assert.equal(budget.radiationOpacity.height, 6);
  assert.equal(budget.radiationOpacity.cellCount, 12 * 6);
  assert.equal(budget.radiationOpacity.cadenceFrames, 4);
  assert.equal(budget.stellarFusion.width, 14);
  assert.equal(budget.stellarFusion.height, 7);
  assert.equal(budget.stellarFusion.cellCount, 14 * 7);
  assert.equal(budget.stellarFusion.cadenceFrames, 6);
  assert.equal(budget.magnetospherePlasma.width, 12);
  assert.equal(budget.magnetospherePlasma.height, 6);
  assert.equal(budget.magnetospherePlasma.cellCount, 12 * 6);
  assert.equal(budget.magnetospherePlasma.cadenceFrames, 7);
  assert.equal(budget.picPlasmaPatch.particleCount, 72);
  assert.equal(budget.picPlasmaPatch.gridWidth, 10);
  assert.equal(budget.picPlasmaPatch.gridHeight, 5);
  assert.equal(budget.picPlasmaPatch.cellCount, 10 * 5);
  assert.equal(budget.picPlasmaPatch.cadenceFrames, 8);
  assert.equal(budget.relativisticCorrection.sampleCount, 88);
  assert.equal(budget.relativisticCorrection.cadenceFrames, 9);
  assert.equal(budget.combustionPlume.width, 10);
  assert.equal(budget.combustionPlume.height, 5);
  assert.equal(budget.combustionPlume.cellCount, 10 * 5);
  assert.equal(budget.combustionPlume.cadenceFrames, 5);
  assert.equal(budget.membraneShell.segmentCount, 48);
  assert.equal(budget.membraneShell.cadenceFrames, 2);
});

test('admitted solver budget clamps oversized law workers to resource envelope', () => {
  const manager = new ComputeManager({
    enableWorkers: false,
    resourceProfile: {
      tier: 'workstation',
      cpuCores: 16,
      memoryBudgetMB: 2,
      gpuMemoryBudgetMB: 1,
      gpuAvailable: true,
      gpuLimits: {
        maxBufferSize: 4096,
        maxStorageBufferBindingSize: 4096
      }
    }
  });
  const { solverBudget, admission, requestedBudget } = createAdmittedMultiscaleSolverBudget(manager, {
    overrides: {
      maxwellGrid: 128,
      molecularAtoms: 32768,
      sphParticles: 4096,
      picGrid: 128,
      picParticles: 8192
    }
  });

  assert.equal(admission.schema, MULTISCALE_SOLVER_ADMISSION_SCHEMA);
  assert.equal(admission.source, 'budget-admission-v0');
  assert.equal(admission.status, 'clamped');
  assert.ok(admission.clampedSolverCount >= 4);
  assert.ok(admission.entries.maxwell.clamped);
  assert.ok(admission.entries.molecularDynamics.clamped);
  assert.ok(admission.entries.sphMaterial.clamped);
  assert.ok(admission.entries.picPlasmaPatch.clamped);
  assert.ok(solverBudget.maxwell.cellCount < requestedBudget.maxwell.cellCount);
  assert.ok(solverBudget.molecularDynamics.atomCount < requestedBudget.molecularDynamics.atomCount);
  assert.ok(solverBudget.sphMaterial.particleCount < requestedBudget.sphMaterial.particleCount);
  assert.ok(solverBudget.picPlasmaPatch.particleCount < requestedBudget.picPlasmaPatch.particleCount);
  assert.ok(solverBudget.picPlasmaPatch.cellCount < requestedBudget.picPlasmaPatch.cellCount);
});

test('solver state remap preserves particle records and solver timeline across resize', () => {
  const previous = {
    schema: 'test.state',
    sequence: 17,
    elapsedTime: 3.5,
    positions: [1, 2, 3, 4, 5, 6],
    velocities: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
    temperatureK: [310, 320]
  };
  const next = {
    schema: 'test.state',
    sequence: 0,
    elapsedTime: 0,
    positions: [9, 9, 9, 8, 8, 8, 7, 7, 7],
    velocities: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    temperatureK: [294, 294, 294]
  };
  carrySolverTimeline(previous, next);
  const fieldStats = copyRecordFields(previous, next, [
    { field: 'positions', components: 3 },
    { field: 'velocities', components: 3 },
    'temperatureK'
  ]);
  const summary = summarizeSolverRemap({
    solverKey: 'test-particles',
    previous,
    next,
    fieldStats
  });

  assert.equal(summary.remapped, true);
  assert.equal(summary.nextSequence, 17);
  assert.equal(summary.nextElapsedTime, 3.5);
  assert.deepEqual(next.positions.slice(0, 6), previous.positions);
  assert.deepEqual(next.velocities.slice(0, 6), previous.velocities);
  assert.deepEqual(next.temperatureK.slice(0, 2), previous.temperatureK);
  assert.deepEqual(next.positions.slice(6), [7, 7, 7]);
});

test('solver state remap resamples grid fields while preserving component means', () => {
  const previous = {
    schema: 'test.grid',
    sequence: 4,
    elapsedTime: 1.25,
    width: 2,
    height: 2,
    scalar: [1, 2, 3, 4],
    vector: [1, 10, 2, 20, 3, 30, 4, 40]
  };
  const next = {
    schema: 'test.grid',
    sequence: 0,
    elapsedTime: 0,
    width: 4,
    height: 4,
    scalar: new Array(16).fill(0),
    vector: new Array(32).fill(0)
  };
  carrySolverTimeline(previous, next);
  const fieldStats = remapGridFields(previous, next, [
    { field: 'scalar', preserveMean: true },
    { field: 'vector', components: 2, preserveMean: true }
  ]);
  const summary = summarizeSolverRemap({
    solverKey: 'test-grid',
    previous,
    next,
    fieldStats
  });
  const scalarMean = next.scalar.reduce((sum, value) => sum + value, 0) / next.scalar.length;
  const vectorMean0 = next.vector.filter((_, index) => index % 2 === 0)
    .reduce((sum, value) => sum + value, 0) / 16;
  const vectorMean1 = next.vector.filter((_, index) => index % 2 === 1)
    .reduce((sum, value) => sum + value, 0) / 16;

  assert.equal(summary.solverKey, 'test-grid');
  assert.equal(summary.remapped, true);
  assert.equal(summary.nextSequence, 4);
  assert.equal(summary.nextElapsedTime, 1.25);
  assert.equal(fieldStats[0].remappedCells, 16);
  assert.ok(Math.abs(scalarMean - 2.5) < 1e-10);
  assert.ok(Math.abs(vectorMean0 - 2.5) < 1e-10);
  assert.ok(Math.abs(vectorMean1 - 25) < 1e-10);
  assert.equal(SOLVER_STATE_REMAP_SCHEMA, 'peercompute.multiscale.solver-state-remap.v0');
});

test('solver state remap invariant summaries report compact conservation deltas', () => {
  const previous = {
    masses: [2, 1],
    velocities: [1, 0, 0, 0, 2, 0],
    partialCharge: [1, -0.5],
    electric: [1, 0, 0, 0, 2, 0],
    temperatureK: [300, 400]
  };
  const next = {
    masses: [2, 1, 4],
    velocities: [1, 0, 0, 0, 2, 0, 0, 0, 0],
    partialCharge: [1, -0.5, 0.25],
    electric: [1, 0, 0, 0, 2, 0, 0, 0, 0],
    temperatureK: [300, 400, 500]
  };
  const invariantStats = summarizeSolverInvariants(previous, next, [
    { name: 'mass', type: 'sum', field: 'masses', units: 'mass-proxy' },
    { name: 'charge', type: 'sum', field: 'partialCharge', units: 'charge-proxy' },
    { name: 'momentum', type: 'packed-momentum', massField: 'masses', velocityField: 'velocities', components: 3 },
    { name: 'kineticEnergy', type: 'packed-kinetic', massField: 'masses', velocityField: 'velocities', components: 3 },
    { name: 'fieldEnergy', type: 'packed-vector-energy', field: 'electric', components: 3 },
    { name: 'thermalEnergy', type: 'weighted-sum', valueField: 'temperatureK', weightField: 'masses' }
  ]);
  const summary = summarizeSolverRemap({
    solverKey: 'test-invariants',
    previous,
    next,
    fieldStats: [{ field: 'masses', kind: 'record-prefix', copiedRecords: 2 }],
    invariantStats
  });
  const byName = Object.fromEntries(summary.invariantStats.map((entry) => [entry.name, entry]));
  const direct = summarizeInvariantDelta('manual', 10, 12, 'unit');

  assert.equal(summary.invariantStats.length, 6);
  assert.equal(byName.mass.previous, 3);
  assert.equal(byName.mass.next, 7);
  assert.equal(byName.charge.delta, 0.25);
  assert.equal(byName.kineticEnergy.delta, 0);
  assert.equal(byName.fieldEnergy.delta, 0);
  assert.equal(byName.thermalEnergy.delta, 2000);
  assert.equal(byName.mass.units, 'mass-proxy');
  assert.equal(direct.relativeDelta, 0.2);
  assert.equal(summary.remapped, true);
});

test('compute override reader includes adaptive scaler and tree-gravity flags', () => {
  const overrides = readComputeOverrides('?autoScale=0&autoScaleWorkers=1&autoScaleWorkloads=false&hydroGrid=18&radiationGrid=16&radiationCadence=2&stellarGrid=18&stellarCadence=3&magnetosphereGrid=18&magnetosphereCadence=4&picGrid=12&picParticles=96&picCadence=5&relativitySamples=80&relativityCadence=6&cosmologySamples=112&cosmologyCadence=7&molecularAtoms=44&molecularCadence=4&combustionGrid=20&combustionCadence=3&membraneSegments=72&membraneCadence=2&nbodyMode=tree&nbodyTheta=0.42&clusterNodes=4&clusterGpus=2&networkBandwidthMbps=250&networkRttMs=6&networkEffectiveType=4g&networkSaveData=0&enableRemotePlacement=1&enableLoopbackRemotePlacement=1&remotePlacementExecutorMode=loopback&remotePlacementPeerId=peer-alpha&remotePlacementMode=peer&remotePlacementTimeoutMs=12000&remotePlacementPrimaryTimeoutMs=3000&remotePlacementReplicaTimeoutMs=11000&autoSelectRemotePlacementPeer=1&balanceRemotePlacementPeers=1&remotePlacementBalanceSeed=7&remotePlacementReplicaPeerIds=peer-beta,peer-gamma&remotePlacementTargetReplicaCount=3&remotePlacementQuorumResultCount=2');
  assert.equal(overrides.autoScaleWorkers, true);
  assert.equal(overrides.autoScaleWorkloads, false);
  assert.equal(overrides.hydroGrid, 18);
  assert.equal(overrides.radiationGrid, 16);
  assert.equal(overrides.radiationCadence, 2);
  assert.equal(overrides.stellarGrid, 18);
  assert.equal(overrides.stellarCadence, 3);
  assert.equal(overrides.magnetosphereGrid, 18);
  assert.equal(overrides.magnetosphereCadence, 4);
  assert.equal(overrides.picGrid, 12);
  assert.equal(overrides.picParticles, 96);
  assert.equal(overrides.picCadence, 5);
  assert.equal(overrides.relativitySamples, 80);
  assert.equal(overrides.relativityCadence, 6);
  assert.equal(overrides.cosmologySamples, 112);
  assert.equal(overrides.cosmologyCadence, 7);
  assert.equal(overrides.molecularAtoms, 44);
  assert.equal(overrides.molecularCadence, 4);
  assert.equal(overrides.combustionGrid, 20);
  assert.equal(overrides.combustionCadence, 3);
  assert.equal(overrides.membraneSegments, 72);
  assert.equal(overrides.membraneCadence, 2);
  assert.equal(overrides.nbodyMode, 'tree');
  assert.equal(overrides.nbodyTheta, 0.42);
  assert.equal(overrides.clusterNodes, 4);
  assert.equal(overrides.clusterGpus, 2);
  assert.equal(overrides.networkBandwidthMbps, 250);
  assert.equal(overrides.networkRttMs, 6);
  assert.equal(overrides.networkEffectiveType, '4g');
  assert.equal(overrides.networkSaveData, false);
  assert.equal(overrides.enableRemotePlacement, true);
  assert.equal(overrides.enableLoopbackRemotePlacement, true);
  assert.equal(overrides.remotePlacementExecutorMode, 'loopback');
  assert.equal(overrides.remotePlacementPeerId, 'peer-alpha');
  assert.equal(overrides.remotePlacementMode, 'peer');
  assert.equal(overrides.remotePlacementTimeoutMs, 12000);
  assert.equal(overrides.remotePlacementPrimaryTimeoutMs, 3000);
  assert.equal(overrides.remotePlacementReplicaTimeoutMs, 11000);
  assert.equal(overrides.autoSelectRemotePlacementPeer, true);
  assert.equal(overrides.balanceRemotePlacementPeers, true);
  assert.equal(overrides.remotePlacementBalanceSeed, 7);
  assert.deepEqual(overrides.remotePlacementReplicaPeerIds, ['peer-beta', 'peer-gamma']);
  assert.equal(overrides.remotePlacementTargetReplicaCount, 3);
  assert.equal(overrides.remotePlacementQuorumResultCount, 2);
});

test('adaptive solver governor raises cadence under pressure and relaxes to baseline', () => {
  const governor = new AdaptiveSolverGovernor({
    budget: {
      nbody: { cadenceFrames: 1 },
      maxwell: { cadenceFrames: 1 },
      cosmologyExpansion: { cadenceFrames: 2 },
      molecularDynamics: { cadenceFrames: 2 },
      quantumOrbitalGrid: { cadenceFrames: 2 },
      reactiveThermal: { cadenceFrames: 2 },
      sphMaterial: { cadenceFrames: 1 },
      hydroAtmosphere: { cadenceFrames: 1 },
      radiationOpacity: { cadenceFrames: 1 },
      stellarFusion: { cadenceFrames: 1 },
      magnetospherePlasma: { cadenceFrames: 1 },
      picPlasmaPatch: { cadenceFrames: 2 },
      relativisticCorrection: { cadenceFrames: 2 },
      combustionPlume: { cadenceFrames: 1 },
      membraneShell: { cadenceFrames: 1 }
    },
    targetFrameMs: 30,
    relaxFrameMs: 16,
    sampleAlpha: 1,
    adjustCooldownFrames: 1
  });

  const overloaded = governor.update({
    frameMs: 60,
    solverRuntime: { nbody: { pending: true }, maxwell: { pending: true }, cosmologyExpansion: { pending: true }, molecularDynamics: { pending: true }, quantumOrbitalGrid: { pending: true }, reactiveThermal: { pending: true }, picPlasmaPatch: { pending: true }, relativisticCorrection: { pending: true } },
    computeStatus: { peercompute: { managerCapabilities: { queuedTaskCount: 3, activeTaskCount: 2 } } }
  });
  assert.equal(overloaded.schema, MULTISCALE_SOLVER_GOVERNOR_SCHEMA);
  assert.equal(overloaded.cadencePolicy, MULTISCALE_SOLVER_CADENCE_POLICY);
  assert.ok(overloaded.cadenceFrames.nbody > 1);
  assert.ok(overloaded.cadenceFrames.reactiveThermal > 2);
  assert.equal(overloaded.cadenceScaleWeights.cosmologyExpansion, 3);
  assert.equal(overloaded.cadenceScaleWeights.relativisticCorrection, 3);
  assert.equal(overloaded.solverLayerAffinity.quantumOrbitalGrid, 'orbital');
  assert.equal(overloaded.cadenceFrames.molecularDynamics, 3);
  assert.equal(overloaded.cadenceFrames.cosmologyExpansion, 5);
  assert.equal(overloaded.cadenceFrames.relativisticCorrection, 5);
  assert.ok(overloaded.cadenceFrames.cosmologyExpansion > overloaded.cadenceFrames.molecularDynamics);
  assert.equal(governor.shouldRun('nbody', overloaded.cadenceFrames.nbody), true);

  for (let i = 0; i < 8; i += 1) {
    governor.update({
      frameMs: 8,
      solverRuntime: {},
      computeStatus: { peercompute: { managerCapabilities: { queuedTaskCount: 0, activeTaskCount: 0 } } }
    });
  }
  const relaxed = governor.getStatus();
  assert.equal(relaxed.cadenceFrames.nbody, 1);
  assert.equal(relaxed.cadenceFrames.reactiveThermal, 2);
  const rebudgeted = governor.setBudget({
    nbody: { cadenceFrames: 3 },
    maxwell: { cadenceFrames: 4 },
    cosmologyExpansion: { cadenceFrames: 4 },
    molecularDynamics: { cadenceFrames: 6 },
    quantumOrbitalGrid: { cadenceFrames: 5 },
    reactiveThermal: { cadenceFrames: 5 },
    sphMaterial: { cadenceFrames: 2 },
    hydroAtmosphere: { cadenceFrames: 4 },
    radiationOpacity: { cadenceFrames: 6 },
    stellarFusion: { cadenceFrames: 8 },
    magnetospherePlasma: { cadenceFrames: 9 },
    picPlasmaPatch: { cadenceFrames: 6 },
    relativisticCorrection: { cadenceFrames: 5 },
    combustionPlume: { cadenceFrames: 7 },
    membraneShell: { cadenceFrames: 2 }
  });
  assert.equal(rebudgeted.lastAction, 'budget-update');
  assert.equal(rebudgeted.baseCadenceFrames.nbody, 3);
  assert.equal(rebudgeted.cadenceFrames.nbody, 3);
  assert.equal(rebudgeted.baseCadenceFrames.cosmologyExpansion, 4);
  assert.equal(rebudgeted.cadenceFrames.cosmologyExpansion, 4);
  assert.equal(rebudgeted.baseCadenceFrames.molecularDynamics, 6);
  assert.equal(rebudgeted.cadenceFrames.molecularDynamics, 6);
  assert.equal(rebudgeted.baseCadenceFrames.quantumOrbitalGrid, 5);
  assert.equal(rebudgeted.cadenceFrames.sphMaterial, 2);
  assert.equal(rebudgeted.baseCadenceFrames.hydroAtmosphere, 4);
  assert.equal(rebudgeted.baseCadenceFrames.radiationOpacity, 6);
  assert.equal(rebudgeted.baseCadenceFrames.stellarFusion, 8);
  assert.equal(rebudgeted.baseCadenceFrames.magnetospherePlasma, 9);
  assert.equal(rebudgeted.baseCadenceFrames.picPlasmaPatch, 6);
  assert.equal(rebudgeted.baseCadenceFrames.relativisticCorrection, 5);
  assert.equal(rebudgeted.baseCadenceFrames.combustionPlume, 7);
  assert.equal(rebudgeted.baseCadenceFrames.membraneShell, 2);
});

test('adaptive solver governor prioritizes active-layer solvers over distant scales', () => {
  const budget = {
    nbody: { cadenceFrames: 2 },
    maxwell: { cadenceFrames: 2 },
    cosmologyExpansion: { cadenceFrames: 2 },
    molecularDynamics: { cadenceFrames: 2 },
    quantumOrbitalGrid: { cadenceFrames: 2 },
    reactiveThermal: { cadenceFrames: 2 },
    sphMaterial: { cadenceFrames: 2 },
    hydroAtmosphere: { cadenceFrames: 2 },
    radiationOpacity: { cadenceFrames: 2 },
    stellarFusion: { cadenceFrames: 2 },
    magnetospherePlasma: { cadenceFrames: 2 },
    picPlasmaPatch: { cadenceFrames: 2 },
    relativisticCorrection: { cadenceFrames: 2 },
    combustionPlume: { cadenceFrames: 2 },
    membraneShell: { cadenceFrames: 2 }
  };
  const governor = new AdaptiveSolverGovernor({
    budget,
    activeLayerId: 'surface',
    maxEffectiveCadenceFrames: 120
  });
  const surfaceStatus = governor.getStatus();
  assert.equal(surfaceStatus.activeLayerPolicy, MULTISCALE_SOLVER_ACTIVE_LAYER_POLICY);
  assert.equal(surfaceStatus.activeLayerId, 'surface');
  assert.equal(surfaceStatus.solverLayerAffinity.sphMaterial, 'surface');
  assert.equal(SOLVER_LAYER_AFFINITY.cosmologyExpansion, 'supergalactic');
  assert.equal(surfaceStatus.effectiveCadenceFrames.sphMaterial, 2);
  assert.equal(surfaceStatus.layerDistances.sphMaterial, 0);
  assert.ok(surfaceStatus.layerDistances.cosmologyExpansion > surfaceStatus.layerDistances.sphMaterial);
  assert.ok(surfaceStatus.effectiveCadenceFrames.cosmologyExpansion > surfaceStatus.effectiveCadenceFrames.sphMaterial);
  assert.equal(governor.shouldRun('sphMaterial', 2, { activeLayerId: 'surface' }), true);
  assert.equal(governor.shouldRun('cosmologyExpansion', 2, { activeLayerId: 'surface' }), false);

  const molecularStatus = governor.setActiveLayer('molecular', 7);
  assert.equal(molecularStatus.activeLayerId, 'molecular');
  assert.equal(molecularStatus.activeLayerChangeFrame, 7);
  assert.equal(molecularStatus.effectiveCadenceFrames.molecularDynamics, 2);
  assert.ok(molecularStatus.effectiveCadenceFrames.sphMaterial > molecularStatus.effectiveCadenceFrames.molecularDynamics);
  assert.equal(governor.shouldRun('molecularDynamics', 7, { activeLayerId: 'molecular' }), true);
  assert.equal(governor.shouldRun('sphMaterial', 7, { activeLayerId: 'molecular' }), false);
  const orbitalStatus = governor.setActiveLayer('orbital', 9);
  assert.equal(orbitalStatus.effectiveCadenceFrames.quantumOrbitalGrid, 2);
  assert.equal(orbitalStatus.layerDistances.quantumOrbitalGrid, 0);
  assert.equal(governor.shouldRun('quantumOrbitalGrid', 9, { activeLayerId: 'orbital' }), true);

  const solarStatus = governor.setActiveLayer('solar', 11);
  assert.equal(solarStatus.activeLayerId, 'solar');
  assert.equal(solarStatus.effectiveCadenceFrames.nbody, 2);
  assert.equal(solarStatus.layerDistances.nbody, 0);
  assert.equal(governor.shouldRun('nbody', 11, { activeLayerId: 'solar' }), true);
  assert.equal(governor.shouldRun('cosmologyExpansion', 11, { activeLayerId: 'solar' }), false);
});

test('lower-scale refinement scheduler prioritizes event triggers under frame pressure', () => {
  const scheduler = createLowerScaleRefinementScheduler({
    activeLayerId: 'surface',
    sampleIntervalFrames: 4,
    eventCooldownFrames: 2,
    sampleCooldownFrames: 8
  });
  const report = scheduler.evaluate({
    frame: 8,
    activeLayerId: 'surface',
    refinementRequests: ['surface-sph-refinement'],
    state: {
      surface: {
        fireIntensity: 0.82,
        fuelFraction: 0.8,
        flameTemperatureK: 1180,
        radiativeHeatFlux: 0
      },
      balloon: {
        ruptured: true,
        spillImpulse: 1,
        membraneShell: { ruptureRisk: 0.2 }
      },
      mpm: {
        sphMaterial: {
          fireContactFraction: 0.08,
          coolingPotential: 0.05,
          phaseChangeRateProxy: 0
        }
      },
      molecular: {
        reactionProgress: 0.1,
        molecularDynamics: {}
      }
    },
    environment: {
      oxygenFraction: 0.21,
      refinementThreshold: 0.42
    },
    runtimeScaler: {
      pressure: 2.4,
      frameMsAvg: 52
    },
    solverGovernor: {
      pressure: 2.2
    },
    solverRuntime: {}
  });

  assert.equal(report.schema, MULTISCALE_LOWER_SCALE_REFINEMENT_SCHEMA);
  assert.equal(report.policy, MULTISCALE_LOWER_SCALE_REFINEMENT_POLICY);
  assert.equal(report.activeLayerId, 'surface');
  assert.equal(report.sampleBudget, 0);
  assert.equal(report.eventBudget, 2);
  assert.ok(report.requests.includes('surface-sph-refinement'));
  assert.ok(report.implicitRequests.includes('combustion-chemistry-refinement'));
  assert.ok(report.triggeredSolvers.includes('sphMaterial'));
  assert.ok(report.triggeredSolvers.includes('combustionPlume'));
  assert.equal(report.solverDecisions.sphMaterial.triggerType, 'event');
  assert.equal(shouldRunLowerScaleRefinementSolver(report, 'sphMaterial'), true);
  assert.equal(shouldRunLowerScaleRefinementSolver(report, 'cosmologyExpansion'), false);
});

test('lower-scale refinement scheduler rotates spot checks only when frame budget allows', () => {
  const scheduler = createLowerScaleRefinementScheduler({
    activeLayerId: 'surface',
    sampleIntervalFrames: 5,
    eventCooldownFrames: 2,
    sampleCooldownFrames: 5
  });
  const lowPressure = scheduler.evaluate({
    frame: 10,
    activeLayerId: 'surface',
    state: {
      surface: { fireIntensity: 0.2, fuelFraction: 1 },
      balloon: { ruptured: false, spillImpulse: 0, membraneShell: { ruptureRisk: 0 } },
      mpm: { sphMaterial: {} },
      molecular: { reactionProgress: 0, molecularDynamics: {} }
    },
    environment: { oxygenFraction: 0.21, refinementThreshold: 0.42 },
    runtimeScaler: { pressure: 0.2, frameMsAvg: 12 },
    solverGovernor: { pressure: 0.1 },
    solverRuntime: {}
  });

  assert.equal(lowPressure.status, 'scheduled');
  assert.equal(lowPressure.eventTriggerCount, 0);
  assert.equal(lowPressure.sampleBudget, 2);
  assert.equal(lowPressure.sampleTriggerCount, 2);
  assert.deepEqual(lowPressure.triggeredSolvers, ['reactiveThermal', 'combustionPlume']);

  const highPressure = scheduler.evaluate({
    frame: 15,
    activeLayerId: 'surface',
    state: {
      surface: { fireIntensity: 0.2, fuelFraction: 1 },
      balloon: { ruptured: false, spillImpulse: 0, membraneShell: { ruptureRisk: 0 } },
      mpm: { sphMaterial: {} },
      molecular: { reactionProgress: 0, molecularDynamics: {} }
    },
    environment: { oxygenFraction: 0.21, refinementThreshold: 0.42 },
    runtimeScaler: { pressure: 2.1, frameMsAvg: 48 },
    solverGovernor: { pressure: 1.8 },
    solverRuntime: {}
  });

  assert.equal(highPressure.sampleBudget, 0);
  assert.equal(highPressure.sampleTriggerCount, 0);
  assert.equal(highPressure.triggeredSolvers.length, 0);
  assert.equal(highPressure.status, 'pressure-limited');
});

test('solver submission budget admits active and event work first under pressure', () => {
  const budget = createSolverSubmissionBudget({
    frame: 24,
    activeLayerId: 'surface',
    runtimeScaler: { pressure: 3.2, frameMsAvg: 68 },
    solverGovernor: { pressure: 2.4 },
    managerStats: {
      targetWorkers: 8,
      activeTaskCount: 4,
      queuedTaskCount: 1,
      currentLoad: 0.7
    },
    candidates: [
      { key: 'cosmologyExpansion', cadenceRun: true },
      { key: 'sphMaterial', cadenceRun: true },
      {
        key: 'combustionPlume',
        refinementRun: true,
        refinementDecision: { triggerType: 'event', priority: 0.8 }
      },
      { key: 'molecularDynamics', cadenceRun: true }
    ]
  });

  assert.equal(budget.schema, MULTISCALE_SOLVER_SUBMISSION_BUDGET_SCHEMA);
  assert.equal(budget.policy, MULTISCALE_SOLVER_SUBMISSION_BUDGET_POLICY);
  assert.equal(budget.status, 'budgeted');
  assert.equal(budget.maxSubmissions, 1);
  assert.equal(budget.admittedCount, 1);
  assert.deepEqual(budget.admittedSolvers, ['combustionPlume']);
  assert.equal(shouldSubmitSolver(budget, 'combustionPlume'), true);
  assert.equal(shouldSubmitSolver(budget, 'sphMaterial'), false);
  assert.equal(budget.decisions.sphMaterial.reason, 'budget-deferred');
  assert.equal(budget.decisions.cosmologyExpansion.layerDistance, 4);
});

test('solver submission budget keeps one urgent active or event lane during manager backlog', () => {
  const budget = createSolverSubmissionBudget({
    frame: 25,
    activeLayerId: 'molecular',
    runtimeScaler: { pressure: 4.2, frameMsAvg: 96 },
    managerStats: {
      targetWorkers: 4,
      activeTaskCount: 4,
      queuedTaskCount: 6,
      currentLoad: 2
    },
    candidates: [
      { key: 'molecularDynamics', cadenceRun: true },
      {
        key: 'reactiveThermal',
        refinementRun: true,
        refinementDecision: { triggerType: 'event', priority: 1 }
      }
    ]
  });

  assert.equal(budget.schema, MULTISCALE_SOLVER_SUBMISSION_BUDGET_SCHEMA);
  assert.equal(budget.status, 'budgeted');
  assert.equal(budget.maxSubmissions, 1);
  assert.equal(budget.urgentCandidateCount, 2);
  assert.equal(budget.admittedCount, 1);
  assert.deepEqual(budget.admittedSolvers, ['reactiveThermal']);
  assert.equal(budget.decisions.molecularDynamics.reason, 'budget-deferred');
  assert.equal(shouldSubmitSolver(budget, 'reactiveThermal'), true);
});

test('solver submission budget admits molecular lower-law dependency work during backlog', () => {
  const budget = createSolverSubmissionBudget({
    frame: 27,
    activeLayerId: 'molecular',
    runtimeScaler: { pressure: 4.2, frameMsAvg: 96 },
    managerStats: {
      targetWorkers: 4,
      activeTaskCount: 4,
      queuedTaskCount: 6,
      currentLoad: 2
    },
    candidates: [
      { key: 'molecularDynamics', cadenceRun: true, pending: true },
      {
        key: 'quantumMaterialPotential',
        dependencyRun: true,
        dependencyDecision: {
          triggerType: 'dependency',
          request: 'molecular-lower-law-source',
          reason: 'molecular-md-qmat-source-missing',
          consumerSolverKey: 'molecularDynamics',
          requiredSourceSchema: 'peercompute.multiscale.quantum-material-potential.concurrent-batch.v0',
          priority: 38
        }
      },
      { key: 'cosmologyExpansion', cadenceRun: true }
    ]
  });

  assert.equal(budget.schema, MULTISCALE_SOLVER_SUBMISSION_BUDGET_SCHEMA);
  assert.equal(budget.maxSubmissions, 1);
  assert.equal(budget.urgentCandidateCount, 1);
  assert.deepEqual(budget.admittedSolvers, ['quantumMaterialPotential']);
  assert.equal(budget.decisions.quantumMaterialPotential.source, 'dependency');
  assert.equal(budget.decisions.quantumMaterialPotential.dependencyRun, true);
  assert.equal(budget.decisions.quantumMaterialPotential.triggerType, 'dependency');
  assert.equal(budget.decisions.quantumMaterialPotential.dependencyDecision.reason, 'molecular-md-qmat-source-missing');
  assert.equal(budget.decisions.quantumMaterialPotential.dependencyDecision.consumerSolverKey, 'molecularDynamics');
  assert.equal(shouldSubmitSolver(budget, 'quantumMaterialPotential'), true);
  assert.equal(shouldSubmitSolver(budget, 'molecularDynamics'), false);
});

test('solver submission budget prioritizes active-layer warmup over repeated cadence work', () => {
  const budget = createSolverSubmissionBudget({
    frame: 31,
    activeLayerId: 'solar',
    runtimeScaler: { pressure: 4.2, frameMsAvg: 96 },
    managerStats: {
      targetWorkers: 8,
      activeTaskCount: 3,
      queuedTaskCount: 0,
      currentLoad: 0.5
    },
    candidates: [
      { key: 'nbody', cadenceRun: true },
      { key: 'magnetospherePlasma', warmupRun: true },
      { key: 'stellarFusion', cadenceRun: true }
    ]
  });

  assert.equal(budget.schema, MULTISCALE_SOLVER_SUBMISSION_BUDGET_SCHEMA);
  assert.equal(budget.maxSubmissions, 1);
  assert.deepEqual(budget.admittedSolvers, ['magnetospherePlasma']);
  assert.equal(budget.decisions.magnetospherePlasma.source, 'warmup');
  assert.equal(shouldSubmitSolver(budget, 'magnetospherePlasma'), true);
  assert.equal(shouldSubmitSolver(budget, 'nbody'), false);
});

test('solver submission budget admits promoted remote solver refreshes under backlog', () => {
  const budget = createSolverSubmissionBudget({
    frame: 32,
    activeLayerId: 'molecular',
    runtimeScaler: { pressure: 4.2, frameMsAvg: 96 },
    managerStats: {
      targetWorkers: 4,
      activeTaskCount: 4,
      queuedTaskCount: 6,
      currentLoad: 2
    },
    candidates: [
      { key: 'molecularDynamics', cadenceRun: true },
      {
        key: 'cosmologyExpansion',
        remoteSolverPlacementRun: true,
        remoteSolverPlacementDecision: {
          triggerType: 'remote-solver-placement',
          reason: 'promoted-remote-solver-refresh',
          priority: 96
        }
      },
      { key: 'hydroAtmosphere', cadenceRun: true }
    ]
  });

  assert.equal(budget.schema, MULTISCALE_SOLVER_SUBMISSION_BUDGET_SCHEMA);
  assert.equal(budget.maxSubmissions, 1);
  assert.equal(budget.urgentCandidateCount, 2);
  assert.deepEqual(budget.admittedSolvers, ['cosmologyExpansion']);
  assert.equal(budget.decisions.cosmologyExpansion.source, 'remote-solver-placement');
  assert.equal(budget.decisions.cosmologyExpansion.remoteSolverPlacementRun, true);
  assert.equal(budget.decisions.cosmologyExpansion.triggerType, 'remote-solver-placement');
  assert.equal(
    budget.decisions.cosmologyExpansion.remoteSolverPlacementDecision.reason,
    'promoted-remote-solver-refresh'
  );
  assert.equal(shouldSubmitSolver(budget, 'cosmologyExpansion'), true);
  assert.equal(shouldSubmitSolver(budget, 'molecularDynamics'), false);
});

test('solver submission budget holds distant background work during manager backlog', () => {
  const budget = createSolverSubmissionBudget({
    frame: 26,
    activeLayerId: 'molecular',
    runtimeScaler: { pressure: 4.2, frameMsAvg: 96 },
    managerStats: {
      targetWorkers: 4,
      activeTaskCount: 4,
      queuedTaskCount: 6,
      currentLoad: 2
    },
    candidates: [
      { key: 'cosmologyExpansion', cadenceRun: true },
      { key: 'hydroAtmosphere', cadenceRun: true }
    ]
  });

  assert.equal(budget.schema, MULTISCALE_SOLVER_SUBMISSION_BUDGET_SCHEMA);
  assert.equal(budget.status, 'backlog-hold');
  assert.equal(budget.maxSubmissions, 0);
  assert.equal(budget.urgentCandidateCount, 0);
  assert.equal(budget.admittedCount, 0);
  assert.deepEqual(budget.deferredSolvers, ['cosmologyExpansion', 'hydroAtmosphere']);
  assert.equal(budget.decisions.cosmologyExpansion.reason, 'manager-backlog');
  assert.equal(shouldSubmitSolver(budget, 'cosmologyExpansion'), false);
});

test('state publication budget throttles packet commits under high pressure', () => {
  const budget = createStatePublicationBudget({
    frame: 42,
    hudMode: 'focus',
    runtimeScaler: {
      pressure: 3.4,
      frameMsAvg: 74
    },
    renderBudget: {
      pressure: 3.2
    },
    solverSubmissionBudget: {
      queuePressure: 1.4
    },
    managerStats: {
      currentLoad: 1.2
    },
    lastPublishedFrame: 40,
    publishCount: 7,
    skippedFrameCount: 13,
    lastDurationMs: 2.42
  });

  assert.equal(budget.schema, MULTISCALE_STATE_PUBLICATION_BUDGET_SCHEMA);
  assert.equal(budget.policy, MULTISCALE_STATE_PUBLICATION_BUDGET_POLICY);
  assert.equal(budget.hudMode, 'focus');
  assert.equal(budget.status, 'pressure-deferred');
  assert.equal(budget.packetIntervalFrames, 10);
  assert.equal(budget.deltaIntervalFrames, 10);
  assert.equal(budget.framesSincePublish, 2);
  assert.equal(budget.shouldPublish, false);
  assert.equal(budget.shouldPublishWarmDeltas, false);
  assert.equal(budget.publishCount, 7);
  assert.equal(budget.skippedFrameCount, 13);
  assert.equal(budget.lastDurationMs, 2.42);
});

test('state publication budget admits first and due publications', () => {
  const first = createStatePublicationBudget({
    frame: 1,
    hudMode: 'focus',
    runtimeScaler: {
      pressure: 4.2,
      frameMsAvg: 96
    },
    lastPublishedFrame: -1
  });
  assert.equal(first.packetIntervalFrames, 10);
  assert.equal(first.shouldPublish, true);
  assert.equal(first.shouldPublishWarmDeltas, true);
  assert.equal(first.status, 'published-throttled');

  const due = createStatePublicationBudget({
    frame: 32,
    hudMode: 'telemetry',
    runtimeScaler: {
      pressure: 2.6,
      frameMsAvg: 38
    },
    lastPublishedFrame: 29
  });
  assert.equal(due.hudMode, 'telemetry');
  assert.equal(due.packetIntervalFrames, 3);
  assert.equal(due.framesSincePublish, 3);
  assert.equal(due.shouldPublish, true);
  assert.equal(due.status, 'published-throttled');
});

test('runtime diagnostics budget caches snapshots under high pressure', () => {
  const budget = createRuntimeDiagnosticsBudget({
    frame: 108,
    nowMs: 2000,
    hudMode: 'focus',
    runtimeScaler: {
      pressure: 4.3,
      frameMsAvg: 128
    },
    renderBudget: {
      pressure: 4
    },
    statePublicationBudget: {
      pressure: 4.1
    },
    managerStats: {
      currentLoad: 1.3
    },
    lastSnapshotFrame: 100,
    lastSnapshotAtMs: 1600,
    snapshotBuildCount: 5,
    snapshotReuseCount: 21,
    lastDurationMs: 3.5
  });

  assert.equal(budget.schema, MULTISCALE_RUNTIME_DIAGNOSTICS_BUDGET_SCHEMA);
  assert.equal(budget.policy, MULTISCALE_RUNTIME_DIAGNOSTICS_BUDGET_POLICY);
  assert.equal(budget.hudMode, 'focus');
  assert.equal(budget.snapshotIntervalFrames, 48);
  assert.equal(budget.snapshotIntervalMs, 800);
  assert.equal(budget.framesSinceSnapshot, 8);
  assert.equal(budget.snapshotAgeMs, 400);
  assert.equal(budget.shouldRefresh, false);
  assert.equal(budget.status, 'pressure-cached');
  assert.equal(budget.snapshotBuildCount, 5);
  assert.equal(budget.snapshotReuseCount, 21);
  assert.equal(budget.lastDurationMs, 3.5);
});

test('runtime diagnostics budget refreshes when due or forced', () => {
  const due = createRuntimeDiagnosticsBudget({
    frame: 18,
    nowMs: 1500,
    hudMode: 'telemetry',
    runtimeScaler: {
      pressure: 2.6,
      frameMsAvg: 42
    },
    lastSnapshotFrame: 10,
    lastSnapshotAtMs: 200
  });

  assert.equal(due.hudMode, 'telemetry');
  assert.equal(due.snapshotIntervalFrames, 6);
  assert.equal(due.shouldRefresh, true);
  assert.equal(due.dueByFrame, true);
  assert.equal(due.dueByTime, true);
  assert.equal(due.status, 'pressure-refresh');

  const forced = createRuntimeDiagnosticsBudget({
    frame: 12,
    nowMs: 300,
    hudMode: 'focus',
    runtimeScaler: {
      pressure: 1,
      frameMsAvg: 15
    },
    lastSnapshotFrame: 11,
    lastSnapshotAtMs: 250,
    force: true
  });
  assert.equal(forced.shouldRefresh, true);
  assert.equal(forced.force, true);
});

test('render budget decimates focus overlays from frame pressure', () => {
  const budget = createMultiscaleRenderBudget({
    activeLayerId: 'surface',
    hudMode: 'focus',
    runtimeScaler: {
      pressure: 2.6,
      frameMsAvg: 48
    }
  });

  assert.equal(budget.schema, MULTISCALE_RENDER_BUDGET_SCHEMA);
  assert.equal(budget.policy, MULTISCALE_RENDER_BUDGET_POLICY);
  assert.equal(budget.activeLayerId, 'surface');
  assert.equal(budget.hudMode, 'focus');
  assert.equal(budget.updateHiddenOverlays, false);
  assert.equal(budget.status, 'budgeted');
  assert.ok(budget.pointScale < 1);
  assert.equal(budget.minVisibleScale, 1);
  assert.ok(budget.pressure >= 2.6);
  assert.equal(budget.commitIntervalFrames, 3);
  assert.equal(budget.maxVisibleCommitsPerFrame, 3);
  assert.equal(budget.severeFrameRescue, false);
  assert.equal(budget.rescueLevel, 'off');
  assert.equal(budget.activeOverlayThrottling, true);
  assert.equal(budget.pixelRatioScale, 0.72);
  assert.equal(budget.dynamicVisualIntervalFrames, 2);
  assert.equal(budget.renderQualityThrottling, true);
});

test('render budget keeps telemetry overlay capture less aggressive', () => {
  const budget = createMultiscaleRenderBudget({
    activeLayerId: 'solar',
    hudMode: 'telemetry',
    runtimeScaler: {
      pressure: 3.5,
      frameMsAvg: 72
    }
  });

  assert.equal(budget.schema, MULTISCALE_RENDER_BUDGET_SCHEMA);
  assert.equal(budget.hudMode, 'telemetry');
  assert.equal(budget.updateHiddenOverlays, true);
  assert.ok(budget.pointScale >= 0.67);
  assert.equal(budget.minVisibleScale, 0.75);
  assert.equal(budget.commitIntervalFrames, 2);
  assert.equal(budget.maxVisibleCommitsPerFrame, 5);
  assert.equal(budget.pixelRatioScale, 0.66);
  assert.equal(budget.dynamicVisualIntervalFrames, 2);
  assert.equal(budget.severeFrameRescue, true);
  assert.equal(budget.rescueLevel, 'high');
  assert.equal(budget.dynamicVisualThrottling, true);
  assert.equal(budget.status, 'rescue');
});

test('render budget stays full cadence near the frame target', () => {
  const budget = createMultiscaleRenderBudget({
    activeLayerId: 'planet',
    hudMode: 'focus',
    frame: 42,
    runtimeScaler: {
      pressure: 1,
      frameMsAvg: 15
    }
  });

  assert.equal(budget.frame, 42);
  assert.equal(budget.pointScale, 1);
  assert.equal(budget.minVisibleScale, 1);
  assert.equal(budget.commitIntervalFrames, 1);
  assert.equal(budget.maxVisibleCommitsPerFrame, 12);
  assert.equal(budget.severeFrameRescue, false);
  assert.equal(budget.activeOverlayThrottling, false);
  assert.equal(budget.pixelRatioScale, 1);
  assert.equal(budget.dynamicVisualIntervalFrames, 1);
  assert.equal(budget.renderQualityThrottling, false);
  assert.equal(budget.status, 'budgeted');
});

test('render budget lowers render quality at extreme pressure', () => {
  const budget = createMultiscaleRenderBudget({
    activeLayerId: 'surface',
    hudMode: 'focus',
    runtimeScaler: {
      pressure: 4.4,
      frameMsAvg: 90
    }
  });

  assert.equal(budget.schema, MULTISCALE_RENDER_BUDGET_SCHEMA);
  assert.equal(budget.pointScale, 0.16);
  assert.equal(budget.minVisibleScale, 0.375);
  assert.equal(budget.pixelRatioScale, 0.42);
  assert.equal(budget.commitIntervalFrames, 6);
  assert.equal(budget.maxVisibleCommitsPerFrame, 1);
  assert.equal(budget.dynamicVisualIntervalFrames, 6);
  assert.equal(budget.severeFrameRescue, true);
  assert.equal(budget.rescueLevel, 'high');
  assert.equal(budget.dynamicVisualThrottling, true);
  assert.equal(budget.renderQualityThrottling, true);
  assert.equal(budget.status, 'rescue');
});

test('overlay data-update helper uses modern partial update ranges', () => {
  const ledger = createOverlayDataUpdateLedger({ frame: 7 });
  const attribute = {
    array: new Float32Array(24),
    needsUpdate: false,
    updateRanges: [{ start: 0, count: 24 }],
    clearUpdateRanges() {
      this.updateRanges = [];
    },
    addUpdateRange(start, count) {
      this.updateRanges.push({ start, count });
    }
  };

  const result = markOverlayAttributeUpdate(attribute, {
    offset: 3,
    count: 9,
    family: 'maxwell',
    ledger
  });

  assert.equal(result.updated, true);
  assert.equal(result.mode, 'partial-update-ranges');
  assert.equal(attribute.needsUpdate, true);
  assert.deepEqual(attribute.updateRanges, [{ start: 3, count: 9 }]);
  assert.equal(ledger.schema, MULTISCALE_OVERLAY_DATA_UPDATE_SCHEMA);
  assert.equal(ledger.policy, MULTISCALE_OVERLAY_DATA_UPDATE_POLICY);
  assert.equal(ledger.partialUpdateCount, 1);
  assert.equal(ledger.fullUploadCount, 0);
  assert.equal(ledger.updatedComponentCount, 9);
  assert.equal(ledger.updatedFamilies.maxwell.updateCount, 1);
  assert.equal(ledger.updatedFamilies.maxwell.partialUpdateCount, 1);

  const snapshot = snapshotOverlayDataUpdateLedger(ledger);
  assert.equal(snapshot.schema, MULTISCALE_OVERLAY_DATA_UPDATE_SCHEMA);
  assert.equal(snapshot.updatedFamilies.maxwell.updatedComponentCount, 9);
  snapshot.updatedFamilies.maxwell.updatedComponentCount = 0;
  assert.equal(ledger.updatedFamilies.maxwell.updatedComponentCount, 9);
});

test('overlay data-update helper supports legacy updateRange and fallback uploads', () => {
  const ledger = createOverlayDataUpdateLedger({ frame: 2 });
  const legacyAttribute = {
    array: new Float32Array(12),
    needsUpdate: false,
    updateRange: { offset: 0, count: -1 }
  };
  const legacy = markOverlayAttributeUpdate(legacyAttribute, {
    offset: 2,
    count: 5,
    family: 'legacyField',
    ledger
  });

  assert.equal(legacy.updated, true);
  assert.equal(legacy.mode, 'partial-update-range');
  assert.equal(legacyAttribute.needsUpdate, true);
  assert.deepEqual(legacyAttribute.updateRange, { offset: 2, count: 5 });

  const fallbackAttribute = {
    array: new Float32Array(15),
    needsUpdate: false
  };
  const fallback = markOverlayAttributeUpdate(fallbackAttribute, {
    count: 6,
    family: 'fallbackField',
    ledger
  });

  assert.equal(fallback.updated, true);
  assert.equal(fallback.mode, 'full-needs-update');
  assert.equal(fallbackAttribute.needsUpdate, true);
  assert.equal(ledger.partialUpdateCount, 1);
  assert.equal(ledger.fullUploadCount, 1);
  assert.equal(ledger.fullUploadComponentCount, 15);
  assert.equal(ledger.updatedFamilies.fallbackField.fullUploadCount, 1);
  assert.equal(ledger.updatedFamilies.fallbackField.fullUploadComponentCount, 15);

  resetOverlayDataUpdateLedger(ledger, { frame: 3 });
  const empty = markOverlayAttributeUpdate(fallbackAttribute, {
    count: 0,
    family: 'emptyField',
    ledger
  });
  assert.equal(empty.updated, false);
  assert.equal(empty.mode, 'empty-range');
  assert.equal(ledger.frame, 3);
  assert.equal(ledger.skippedUpdateCount, 1);
  assert.equal(Object.keys(ledger.updatedFamilies).length, 0);
});

test('readback budget keeps active view fresh near frame target', () => {
  const budget = createMultiscaleReadbackBudget({
    activeLayerId: 'molecular',
    hudMode: 'focus',
    runtimeScaler: {
      pressure: 1,
      frameMsAvg: 14
    },
    computeStatus: {
      readbackInterval: 3,
      pendingReadbacks: 0,
      submittedFrames: 30,
      completedReadbacks: 29
    }
  });

  assert.equal(budget.schema, MULTISCALE_READBACK_BUDGET_SCHEMA);
  assert.equal(budget.policy, MULTISCALE_READBACK_BUDGET_POLICY);
  assert.equal(budget.activeLayerId, 'molecular');
  assert.equal(budget.readbackInterval, 2);
  assert.equal(budget.previousReadbackInterval, 3);
  assert.equal(budget.status, 'fresh');
  assert.equal(budget.pendingReadbackThrottling, false);
});

test('readback budget throttles GPU readback cadence under pressure and backlog', () => {
  const budget = createMultiscaleReadbackBudget({
    activeLayerId: 'surface',
    hudMode: 'focus',
    runtimeScaler: {
      pressure: 2.2,
      frameMsAvg: 52
    },
    renderBudget: {
      pressure: 3.4,
      frameMsAvg: 52
    },
    computeStatus: {
      readbackInterval: 3,
      pendingReadbacks: 2,
      submittedFrames: 120,
      completedReadbacks: 100
    }
  });

  assert.equal(budget.schema, MULTISCALE_READBACK_BUDGET_SCHEMA);
  assert.equal(budget.readbackInterval, 9);
  assert.equal(budget.status, 'backlog-throttled');
  assert.equal(budget.pendingReadbackThrottling, true);
  assert.equal(budget.pendingReadbacks, 2);
  assert.equal(budget.readbackBacklogFrames, 20);
  assert.ok(budget.pressure >= 3.4);
});

test('adaptive runtime scaler requests worker and workload resizing from pressure signals', () => {
  const workerScaler = new AdaptiveRuntimeScaler({
    workerPolicy: { minWorkers: 1, targetWorkers: 2, maxWorkers: 5 },
    initialQuality: 2,
    warmupFrames: 0,
    sampleAlpha: 1
  });
  const workerStatus = workerScaler.update({
    frameMs: 20,
    computeStatus: {
      peercompute: {
        managerCapabilities: {
          workers: 2,
          targetWorkers: 2,
          queuedTaskCount: 3,
          activeTaskCount: 0
        }
      }
    },
    solverRuntime: {},
    solverGovernor: { pressure: 0 },
    solverQualityMultiplier: 2
  });
  assert.equal(workerStatus.schema, MULTISCALE_RUNTIME_SCALER_SCHEMA);
  assert.equal(workerStatus.lastRequest.action, 'scale-workers-up');
  assert.equal(workerStatus.lastRequest.workerTarget, 3);
  assert.equal(workerScaler.noteApplied({ action: 'scale-workers-up', workerTarget: 3 }).lastApplied.workerTarget, 3);

  const manualWorkerScaler = new AdaptiveRuntimeScaler({
    workerPolicy: { minWorkers: 1, targetWorkers: 2, maxWorkers: 5 },
    initialQuality: 2,
    warmupFrames: 0,
    sampleAlpha: 1,
    manualWorkerCooldownFrames: 4
  });
  const manualApplied = manualWorkerScaler.noteApplied({
    action: 'manual-worker-resize',
    workerTarget: 1
  });
  assert.equal(manualApplied.workerCooldownFrames, 4);
  const manualCooldownStatus = manualWorkerScaler.update({
    frameMs: 20,
    computeStatus: {
      peercompute: {
        managerCapabilities: {
          workers: 2,
          targetWorkers: 1,
          queuedTaskCount: 4,
          activeTaskCount: 0
        }
      }
    },
    solverRuntime: {},
    solverGovernor: { pressure: 0 },
    solverQualityMultiplier: 2,
    simBusy: true
  });
  assert.equal(manualCooldownStatus.lastRequest, null);
  assert.equal(manualCooldownStatus.workerCooldownFrames, 3);

  const managerLoadScaler = new AdaptiveRuntimeScaler({
    workerPolicy: { minWorkers: 1, targetWorkers: 2, maxWorkers: 5 },
    initialQuality: 2,
    warmupFrames: 0,
    sampleAlpha: 1
  });
  const managerLoadStatus = managerLoadScaler.update({
    frameMs: 20,
    computeStatus: {
      peercompute: {
        managerCapabilities: {
          workers: 2,
          targetWorkers: 2,
          queuedTaskCount: 0,
          activeTaskCount: 0,
          stats: {
            schema: 'peercompute.compute.manager-stats.v0',
            currentLoad: 1,
            averageTaskDurationMs: 18,
            totalTasksCompleted: 12
          }
        }
      }
    },
    solverRuntime: {},
    solverGovernor: { pressure: 0 },
    solverQualityMultiplier: 2
  });
  assert.equal(managerLoadStatus.lastRequest.action, 'scale-workers-up');
  assert.equal(managerLoadStatus.lastRequest.reason, 'manager-load-pressure');
  assert.equal(managerLoadStatus.lastRequest.workerTarget, 3);
  assert.ok(managerLoadStatus.pressure >= 1);

  const workerUtilizationScaler = new AdaptiveRuntimeScaler({
    workerPolicy: { minWorkers: 1, targetWorkers: 2, maxWorkers: 5 },
    initialQuality: 2,
    warmupFrames: 0,
    sampleAlpha: 1
  });
  const workerUtilizationStatus = workerUtilizationScaler.update({
    frameMs: 20,
    computeStatus: {
      peercompute: {
        managerCapabilities: {
          workers: 2,
          targetWorkers: 2,
          queuedTaskCount: 0,
          activeTaskCount: 0,
          stats: {
            schema: 'peercompute.compute.manager-stats.v0',
            currentLoad: 0.1,
            averageTaskDurationMs: 4,
            totalTasksCompleted: 12,
            workerUtilization: {
              schema: 'peercompute.compute.worker-utilization.v0',
              inline: { executorId: 'inline', activeTaskCount: 0, completed: 0 },
              workers: [
                { executorId: 'worker-1', status: 'active', activeTaskCount: 1, submitted: 8, completed: 8, failed: 0, abandoned: 0 },
                { executorId: 'worker-2', status: 'active', activeTaskCount: 1, submitted: 8, completed: 8, failed: 0, abandoned: 0 }
              ],
              summary: {
                workerCount: 2,
                activeWorkerCount: 2,
                retiredWorkerCount: 0,
                retainedWorkerCount: 2,
                activeTaskCount: 2,
                workerActiveTaskCount: 2,
                inlineActiveTaskCount: 0,
                totalSubmitted: 16,
                totalCompleted: 16,
                totalFailed: 0,
                busiestExecutorId: 'worker-1'
              }
            }
          }
        }
      }
    },
    solverRuntime: {},
    solverGovernor: { pressure: 0 },
    solverQualityMultiplier: 2
  });
  assert.equal(workerUtilizationStatus.workerUtilizationPressure.schema, MULTISCALE_WORKER_UTILIZATION_PRESSURE_SCHEMA);
  assert.equal(workerUtilizationStatus.workerUtilizationPressure.saturation, 1);
  assert.equal(workerUtilizationStatus.lastRequest.action, 'scale-workers-up');
  assert.equal(workerUtilizationStatus.lastRequest.reason, 'worker-utilization-pressure');
  assert.equal(workerUtilizationStatus.lastRequest.workerTarget, 3);

  const memoryPressureReport = createMemoryPressureReport({
    performanceMemory: {
      usedJSHeapSize: 930 * 1024 * 1024,
      totalJSHeapSize: 960 * 1024 * 1024,
      jsHeapSizeLimit: 1024 * 1024 * 1024
    },
    resourceProfile: {
      memoryBudgetMB: 1024,
      gpuMemoryBudgetMB: 512
    }
  });
  const memoryPressureScaler = new AdaptiveRuntimeScaler({
    workerPolicy: { minWorkers: 1, targetWorkers: 2, maxWorkers: 5 },
    initialQuality: 2,
    warmupFrames: 0,
    cooldownFrames: 1,
    sampleAlpha: 1
  });
  const memoryPressureStatus = memoryPressureScaler.update({
    frameMs: 20,
    computeStatus: {
      peercompute: {
        managerCapabilities: {
          workers: 2,
          targetWorkers: 2,
          queuedTaskCount: 4,
          activeTaskCount: 0
        }
      }
    },
    solverRuntime: {},
    solverGovernor: { pressure: 0 },
    memoryPressure: memoryPressureReport,
    solverQualityMultiplier: 2,
    simBusy: false
  });
  assert.equal(memoryPressureStatus.memoryPressure.schema, MULTISCALE_MEMORY_PRESSURE_SCHEMA);
  assert.equal(memoryPressureStatus.lastRequest.action, 'scale-workload-down');
  assert.equal(memoryPressureStatus.lastRequest.reason, 'memory-pressure');
  assert.equal(memoryPressureStatus.lastRequest.qualityMultiplier, 1.5);

  const pressureScaler = new AdaptiveRuntimeScaler({
    workerPolicy: { minWorkers: 1, targetWorkers: 2, maxWorkers: 5 },
    initialQuality: 2,
    warmupFrames: 0,
    cooldownFrames: 1,
    sampleAlpha: 1,
    targetFrameMs: 30,
    relaxFrameMs: 15
  });
  const pressureStatus = pressureScaler.update({
    frameMs: 72,
    computeStatus: {
      peercompute: {
        managerCapabilities: {
          workers: 2,
          targetWorkers: 2,
          queuedTaskCount: 0,
          activeTaskCount: 0
        }
      }
    },
    solverRuntime: {},
    solverGovernor: { pressure: 2 },
    solverQualityMultiplier: 2,
    simBusy: false
  });
  assert.equal(pressureStatus.lastRequest.action, 'scale-workload-down');
  assert.equal(pressureStatus.lastRequest.qualityMultiplier, 1.5);

  const headroomScaler = new AdaptiveRuntimeScaler({
    workerPolicy: { minWorkers: 1, targetWorkers: 2, maxWorkers: 5 },
    initialQuality: 1,
    warmupFrames: 0,
    cooldownFrames: 1,
    sampleAlpha: 1,
    targetFrameMs: 30,
    relaxFrameMs: 15
  });
  const headroomStatus = headroomScaler.update({
    frameMs: 8,
    computeStatus: {
      peercompute: {
        managerCapabilities: {
          workers: 2,
          targetWorkers: 2,
          queuedTaskCount: 0,
          activeTaskCount: 0
        }
      }
    },
    solverRuntime: {},
    solverGovernor: { pressure: 0 },
    solverQualityMultiplier: 1,
    simBusy: false
  });
  assert.equal(headroomStatus.lastRequest.action, 'scale-workload-up');
  assert.equal(headroomStatus.lastRequest.qualityMultiplier, 1.5);

  const workerHeadroomScaler = new AdaptiveRuntimeScaler({
    workerPolicy: { minWorkers: 1, targetWorkers: 2, maxWorkers: 5 },
    initialQuality: 4,
    maxQuality: 4,
    warmupFrames: 0,
    cooldownFrames: 1,
    sampleAlpha: 1,
    targetFrameMs: 30,
    relaxFrameMs: 15
  });
  const workerHeadroomStatus = workerHeadroomScaler.update({
    frameMs: 8,
    computeStatus: {
      peercompute: {
        managerCapabilities: {
          workers: 4,
          targetWorkers: 4,
          queuedTaskCount: 0,
          activeTaskCount: 0,
          stats: {
            schema: 'peercompute.compute.manager-stats.v0',
            currentLoad: 0,
            averageTaskDurationMs: 1,
            totalTasksCompleted: 20,
            workerUtilization: {
              schema: 'peercompute.compute.worker-utilization.v0',
              inline: { executorId: 'inline', activeTaskCount: 0, completed: 0 },
              workers: [
                { executorId: 'worker-1', status: 'active', activeTaskCount: 0, submitted: 4, completed: 4, failed: 0, abandoned: 0 },
                { executorId: 'worker-2', status: 'active', activeTaskCount: 0, submitted: 4, completed: 4, failed: 0, abandoned: 0 },
                { executorId: 'worker-3', status: 'active', activeTaskCount: 0, submitted: 4, completed: 4, failed: 0, abandoned: 0 },
                { executorId: 'worker-4', status: 'active', activeTaskCount: 0, submitted: 4, completed: 4, failed: 0, abandoned: 0 }
              ],
              summary: {
                workerCount: 4,
                activeWorkerCount: 4,
                retiredWorkerCount: 0,
                retainedWorkerCount: 4,
                activeTaskCount: 0,
                workerActiveTaskCount: 0,
                inlineActiveTaskCount: 0,
                totalSubmitted: 16,
                totalCompleted: 16,
                totalFailed: 0,
                busiestExecutorId: 'worker-1'
              }
            }
          }
        }
      }
    },
    solverRuntime: {},
    solverGovernor: { pressure: 0 },
    solverQualityMultiplier: 4,
    simBusy: false
  });
  assert.equal(workerHeadroomStatus.lastRequest.action, 'scale-workers-down');
  assert.equal(workerHeadroomStatus.lastRequest.reason, 'worker-utilization-headroom');
  assert.equal(workerHeadroomStatus.lastRequest.workerTarget, 3);

  const admissionScaler = new AdaptiveRuntimeScaler({
    workerPolicy: { minWorkers: 1, targetWorkers: 2, maxWorkers: 5 },
    initialQuality: 1,
    warmupFrames: 0,
    cooldownFrames: 1,
    sampleAlpha: 1
  });
  const admissionStatus = admissionScaler.update({
    frameMs: 20,
    computeStatus: {
      peercompute: {
        managerCapabilities: {
          workers: 2,
          targetWorkers: 2,
          queuedTaskCount: 0,
          activeTaskCount: 0
        }
      }
    },
    solverRuntime: {},
    solverGovernor: { pressure: 0 },
    solverAdmission: {
      schema: MULTISCALE_SOLVER_ADMISSION_SCHEMA,
      recommendedAction: 'scale-down',
      dominantSolver: 'molecularDynamics',
      dominantLimiter: 'memory-budget',
      pressure: 2,
      entries: {}
    },
    solverQualityMultiplier: 1,
    simBusy: false
  });
  assert.equal(admissionStatus.solverAdmission.schema, MULTISCALE_SOLVER_ADMISSION_SCHEMA);
  assert.equal(admissionStatus.lastRequest.action, 'scale-solver-workload-down');
  assert.equal(admissionStatus.lastRequest.reason, 'solver-admission-pressure');
  assert.equal(admissionStatus.lastRequest.solverKey, 'molecularDynamics');
  assert.equal(admissionStatus.lastRequest.solverWorkloadMultiplier, 0.75);
});

test('solver load report exposes dominant scalable law pressure', () => {
  const report = createSolverLoadReport({
    solverBudget: {
      molecularDynamics: { atomCount: 512, cadenceFrames: 1 },
      nbody: { bodyCount: 16, cadenceFrames: 2 },
      maxwell: { width: 16, height: 16, cellCount: 256, cadenceFrames: 2 }
    },
    solverRuntime: {
      molecularDynamics: {
        cadenceFrames: 1,
        lastResult: {
          backend: 'webgpu-molecular-dynamics',
          elapsedTime: 24,
          atomCount: 512,
          diagnostics: {
            neighborCandidatePairCount: 8192
          },
          webgpuStatus: {
            kernelMode: 'cell-neighbor-list',
            neighborListMode: 'active',
            acceptedNeighborPairCount: 4096,
            candidatePairCount: 8192,
            overflowAtoms: 0,
            overflowCells: 0,
            neighborCapacity: 49152
          }
        }
      },
      nbody: {
        cadenceFrames: 2,
        lastResult: {
          backend: 'cpu-nbody',
          elapsedTime: 2,
          bodyCount: 16
        }
      }
    }
  });

  assert.equal(report.schema, MULTISCALE_SOLVER_LOAD_SCHEMA);
  assert.equal(report.dominantSolver, 'molecularDynamics');
  assert.ok(report.dominantPressure > 1.25);
  assert.equal(report.entries.molecularDynamics.atomCount, 512);
  assert.equal(report.entries.molecularDynamics.neighborCandidatePairCount, 8192);
  assert.equal(report.entries.molecularDynamics.kernelMode, 'cell-neighbor-list');
  assert.equal(report.entries.molecularDynamics.neighborListMode, 'active');
  assert.equal(report.entries.molecularDynamics.acceptedNeighborPairCount, 4096);
  assert.equal(report.entries.molecularDynamics.webgpuCandidatePairCount, 8192);
  assert.equal(report.entries.molecularDynamics.webgpuOverflowAtoms, 0);
  assert.equal(report.entries.molecularDynamics.webgpuOverflowCells, 0);
  assert.equal(report.entries.molecularDynamics.webgpuNeighborCapacity, 49152);
  assert.equal(report.entries.molecularDynamics.webgpuNeighborCapacityUsage, 0.0833);
  assert.equal(report.entries.molecularDynamics.molecularPairPressure, 2);
  assert.equal(report.entries.molecularDynamics.molecularOverflowPressure, 0);

  const locked = createSolverLoadReport({
    solverBudget: {
      molecularDynamics: { atomCount: 512, cadenceFrames: 1 },
      nbody: { bodyCount: 16, cadenceFrames: 1 }
    },
    solverRuntime: report.entries,
    lockedSolvers: ['molecularDynamics']
  });
  assert.notEqual(locked.dominantSolver, 'molecularDynamics');
  assert.equal(locked.entries.molecularDynamics.locked, true);
});

test('solver load report uses WebGPU molecular neighbor pressure before CPU candidates', () => {
  const report = createSolverLoadReport({
    solverBudget: {
      molecularDynamics: { atomCount: 512, cadenceFrames: 1 }
    },
    solverRuntime: {
      molecularDynamics: {
        cadenceFrames: 1,
        lastResult: {
          backend: 'webgpu-molecular-dynamics',
          elapsedTime: 0.5,
          atomCount: 512,
          diagnostics: {
            neighborCandidatePairCount: 64
          },
          webgpuStatus: {
            kernelMode: 'cell-neighbor-list',
            neighborListMode: 'active',
            acceptedNeighborPairCount: 12288,
            candidatePairCount: 16384,
            overflowAtoms: 0,
            overflowCells: 0,
            neighborCapacity: 16384
          }
        }
      }
    }
  });

  const molecular = report.entries.molecularDynamics;
  assert.equal(report.dominantSolver, 'molecularDynamics');
  assert.equal(molecular.workloadUnits, 16384);
  assert.equal(molecular.neighborCandidatePairCount, 64);
  assert.equal(molecular.webgpuCandidatePairCount, 16384);
  assert.equal(molecular.acceptedNeighborPairCount, 12288);
  assert.equal(molecular.webgpuNeighborCapacityUsage, 0.75);
  assert.equal(molecular.molecularPairPressure, 2.5);
  assert.equal(molecular.molecularOverflowPressure, 0);
  assert.ok(molecular.pressure > 2.5);
});

test('solver admission report blocks workload growth under memory and worker pressure', () => {
  const solverLoad = createSolverLoadReport({
    solverBudget: {
      molecularDynamics: { atomCount: 512, cadenceFrames: 1 },
      maxwell: { width: 16, height: 16, cellCount: 256, cadenceFrames: 1 }
    },
    solverRuntime: {
      molecularDynamics: {
        cadenceFrames: 1,
        lastResult: {
          backend: 'webgpu-molecular-dynamics',
          elapsedTime: 18,
          atomCount: 512,
          webgpuStatus: {
            kernelMode: 'cell-neighbor-list',
            neighborListMode: 'active',
            acceptedNeighborPairCount: 16384,
            candidatePairCount: 24576,
            overflowAtoms: 0,
            overflowCells: 0,
            neighborCapacity: 24576
          }
        }
      }
    }
  });
  const admission = createSolverAdmissionReport({
    solverBudget: {
      molecularDynamics: { atomCount: 512, cadenceFrames: 1 },
      maxwell: { width: 16, height: 16, cellCount: 256, cadenceFrames: 1 }
    },
    solverLoad,
    memoryPressure: {
      schema: MULTISCALE_MEMORY_PRESSURE_SCHEMA,
      level: 'critical',
      pressure: 2,
      memoryBudgetMB: 512,
      gpuMemoryBudgetMB: 128
    },
    workerUtilizationPressure: {
      schema: MULTISCALE_WORKER_UTILIZATION_PRESSURE_SCHEMA,
      available: true,
      workerCount: 2,
      saturation: 1,
      pressure: 1.2
    },
    solverScales: { molecularDynamics: 1 }
  });

  assert.equal(admission.schema, MULTISCALE_SOLVER_ADMISSION_SCHEMA);
  assert.equal(admission.recommendedAction, 'scale-down');
  assert.equal(admission.dominantLimiter, 'memory-pressure');
  assert.ok(admission.pressure >= 1);
  assert.equal(admission.entries.molecularDynamics.state, 'reduce');
  assert.ok(admission.entries.molecularDynamics.admittedScale < admission.entries.molecularDynamics.currentScale);
});

test('adaptive runtime scaler can target a single hot solver workload', () => {
  const scaler = new AdaptiveRuntimeScaler({
    workerPolicy: { minWorkers: 1, targetWorkers: 2, maxWorkers: 5 },
    initialQuality: 1,
    warmupFrames: 0,
    cooldownFrames: 1,
    sampleAlpha: 1,
    solverPressureScaleUp: 1,
    solverPressureScaleDown: 0.25
  });
  const pressureStatus = scaler.update({
    frameMs: 20,
    computeStatus: {
      peercompute: {
        managerCapabilities: {
          workers: 2,
          targetWorkers: 2,
          queuedTaskCount: 0,
          activeTaskCount: 0
        }
      }
    },
    solverRuntime: {},
    solverGovernor: { pressure: 0 },
    solverLoad: {
      schema: MULTISCALE_SOLVER_LOAD_SCHEMA,
      dominantSolver: 'molecularDynamics',
      dominantPressure: 2.4,
      totalPressure: 2.4,
      entries: {}
    },
    solverQualityMultiplier: 1,
    simBusy: false
  });
  assert.equal(pressureStatus.lastRequest.action, 'scale-solver-workload-down');
  assert.equal(pressureStatus.lastRequest.solverKey, 'molecularDynamics');
  assert.equal(pressureStatus.lastRequest.solverWorkloadMultiplier, 0.75);
  assert.equal(pressureStatus.solverWorkloadScales.molecularDynamics, 0.75);
  assert.equal(
    scaler.noteApplied({
      action: 'scale-solver-workload-down',
      solverKey: 'molecularDynamics',
      solverWorkloadMultiplier: 0.75
    }).lastApplied.solverKey,
    'molecularDynamics'
  );

  const headroomScaler = new AdaptiveRuntimeScaler({
    workerPolicy: { minWorkers: 1, targetWorkers: 2, maxWorkers: 5 },
    initialQuality: 1,
    initialSolverScales: { molecularDynamics: 0.75 },
    warmupFrames: 0,
    cooldownFrames: 1,
    sampleAlpha: 1,
    solverPressureScaleDown: 0.4
  });
  const headroomStatus = headroomScaler.update({
    frameMs: 12,
    computeStatus: {
      peercompute: {
        managerCapabilities: {
          workers: 2,
          targetWorkers: 2,
          queuedTaskCount: 0,
          activeTaskCount: 0
        }
      }
    },
    solverRuntime: {},
    solverGovernor: { pressure: 0 },
    solverLoad: {
      schema: MULTISCALE_SOLVER_LOAD_SCHEMA,
      dominantSolver: 'nbody',
      dominantPressure: 0.1,
      totalPressure: 0.1,
      entries: {}
    },
    solverQualityMultiplier: 1,
    simBusy: false
  });
  assert.equal(headroomStatus.lastRequest.action, 'scale-solver-workload-up');
  assert.equal(headroomStatus.lastRequest.solverKey, 'molecularDynamics');
  assert.equal(headroomStatus.lastRequest.solverWorkloadMultiplier, 1);
  assert.deepEqual(headroomStatus.solverWorkloadScales, {});
});

test('multiscale solver descriptors define first law-worker families', () => {
  assert.equal(MULTISCALE_SOLVER_DESCRIPTORS_SCHEMA, 'peercompute.multiscale.solver-descriptors.v0');
  assert.deepEqual(
    MULTISCALE_SOLVER_DESCRIPTORS.map((solver) => solver.id),
    ['nbody-gravity', 'maxwell-em', 'cosmology-expansion', 'reactive-thermal-cell', 'molecular-dynamics', 'quantum-orbital-grid', 'quantum-material-potential', 'ulg-runtime', 'sph-material', 'membrane-shell', 'hydro-atmosphere', 'radiation-opacity', 'stellar-fusion', 'magnetosphere-plasma', 'pic-plasma-patch', 'relativistic-correction', 'combustion-plume']
  );
  for (const solver of MULTISCALE_SOLVER_DESCRIPTORS) {
    assert.ok(solver.inputFields.length > 0, `${solver.id} missing inputs`);
    assert.ok(solver.outputFields.length > 0, `${solver.id} missing outputs`);
    assert.ok(solver.conservedFields.length > 0, `${solver.id} missing conserved fields`);
    assert.ok(solver.warmDelta.schema.includes('peercompute.multiscale') || solver.warmDelta.schema.includes('peercompute.ulg'), `${solver.id} missing warm-delta schema`);
  }
});

test('multiscale solver descriptors can attach executable solver task modules', () => {
  const solvers = createMultiscaleSolverDescriptors({
    nbodyModuleUrl: nbodyTaskModuleUrl,
    reactiveThermalModuleUrl: reactiveThermalTaskModuleUrl,
    molecularDynamicsModuleUrl: molecularDynamicsTaskModuleUrl,
    quantumOrbitalGridModuleUrl: quantumOrbitalGridTaskModuleUrl,
    quantumMaterialPotentialModuleUrl: quantumMaterialPotentialTaskModuleUrl,
    ulgRuntimeModuleUrl: ulgRuntimeTaskModuleUrl,
    maxwellModuleUrl: maxwellTaskModuleUrl,
    cosmologyExpansionModuleUrl: cosmologyExpansionTaskModuleUrl,
    sphMaterialModuleUrl: sphMaterialTaskModuleUrl,
    hydroAtmosphereModuleUrl: hydroAtmosphereTaskModuleUrl,
    radiationOpacityModuleUrl: radiationOpacityTaskModuleUrl,
    stellarFusionModuleUrl: stellarFusionTaskModuleUrl,
    magnetospherePlasmaModuleUrl: magnetospherePlasmaTaskModuleUrl,
    picPlasmaPatchModuleUrl: picPlasmaPatchTaskModuleUrl,
    relativisticCorrectionModuleUrl: relativisticCorrectionTaskModuleUrl,
    combustionPlumeModuleUrl: combustionPlumeTaskModuleUrl,
    membraneShellModuleUrl: membraneShellTaskModuleUrl
  });
  const nbody = solvers.find((solver) => solver.id === 'nbody-gravity');
  const reactive = solvers.find((solver) => solver.id === 'reactive-thermal-cell');
  const molecular = solvers.find((solver) => solver.id === 'molecular-dynamics');
  const quantumOrbitalGrid = solvers.find((solver) => solver.id === 'quantum-orbital-grid');
  const quantumMaterialPotential = solvers.find((solver) => solver.id === 'quantum-material-potential');
  const ulgRuntime = solvers.find((solver) => solver.id === 'ulg-runtime');
  const maxwell = solvers.find((solver) => solver.id === 'maxwell-em');
  const cosmology = solvers.find((solver) => solver.id === 'cosmology-expansion');
  const sph = solvers.find((solver) => solver.id === 'sph-material');
  const membrane = solvers.find((solver) => solver.id === 'membrane-shell');
  const hydro = solvers.find((solver) => solver.id === 'hydro-atmosphere');
  const radiation = solvers.find((solver) => solver.id === 'radiation-opacity');
  const stellar = solvers.find((solver) => solver.id === 'stellar-fusion');
  const magnetosphere = solvers.find((solver) => solver.id === 'magnetosphere-plasma');
  const pic = solvers.find((solver) => solver.id === 'pic-plasma-patch');
  const relativity = solvers.find((solver) => solver.id === 'relativistic-correction');
  const combustion = solvers.find((solver) => solver.id === 'combustion-plume');

  assert.equal(nbody.module, nbodyTaskModuleUrl);
  assert.equal(nbody.exportName, 'stepNBodyGravity');
  assert.equal(nbody.warmDelta.schema, N_BODY_GRAVITY_DELTA_SCHEMA);
  assert.equal(nbody.validity.approximation, 'webgpu-direct-sum-reference-or-cpu-barnes-hut');
  assert.equal(reactive.module, reactiveThermalTaskModuleUrl);
  assert.equal(reactive.exportName, 'stepReactiveThermalCell');
  assert.equal(reactive.warmDelta.schema, REACTIVE_THERMAL_DELTA_SCHEMA);
  assert.equal(reactive.validity.approximation, 'reduced-reactive-thermal-cell');
  assert.equal(molecular.module, molecularDynamicsTaskModuleUrl);
  assert.equal(molecular.exportName, 'stepMolecularDynamics');
  assert.equal(molecular.warmDelta.schema, MOLECULAR_DYNAMICS_DELTA_SCHEMA);
  assert.equal(molecular.validity.approximation, 'webgpu-reduced-molecular-dynamics');
  assert.equal(quantumOrbitalGrid.module, quantumOrbitalGridTaskModuleUrl);
  assert.equal(quantumOrbitalGrid.exportName, 'stepQuantumOrbitalGrid');
  assert.equal(quantumOrbitalGrid.warmDelta.schema, QUANTUM_ORBITAL_GRID_DELTA_SCHEMA);
  assert.equal(quantumOrbitalGrid.validity.approximation, 'webgpu-screened-hydrogenic-density-evaluation-no-cpu-fallback');
  assert.equal(quantumMaterialPotential.module, quantumMaterialPotentialTaskModuleUrl);
  assert.equal(quantumMaterialPotential.exportName, 'stepQuantumMaterialPotential');
  assert.equal(quantumMaterialPotential.warmDelta.schema, QUANTUM_MATERIAL_POTENTIAL_DELTA_SCHEMA);
  assert.equal(quantumMaterialPotential.validity.approximation, 'webgpu-reference-property-force-and-ensemble-batch');
  assert.ok(quantumMaterialPotential.outputFields.some((field) => field.name === 'partitionFunctionLog'));
  assert.ok(quantumMaterialPotential.outputFields.some((field) => field.name === 'opacityProxy'));
  assert.ok(quantumMaterialPotential.outputFields.some((field) => field.name === 'degeneracyParameter'));
  assert.equal(ulgRuntime.module, ulgRuntimeTaskModuleUrl);
  assert.equal(ulgRuntime.exportName, 'stepUlgRuntime');
  assert.equal(ulgRuntime.warmDelta.schema, ULG_RUNTIME_EXECUTION_DELTA_SCHEMA);
  assert.equal(ulgRuntime.validity.approximation, 'webgpu-pass-dag-state-delta-no-cpu-fallback');
  assert.equal(maxwell.module, maxwellTaskModuleUrl);
  assert.equal(maxwell.exportName, 'stepMaxwellFields');
  assert.equal(maxwell.warmDelta.schema, MAXWELL_FIELD_DELTA_SCHEMA);
  assert.equal(maxwell.validity.approximation, 'reduced-periodic-fdtd-tile');
  assert.equal(cosmology.module, cosmologyExpansionTaskModuleUrl);
  assert.equal(cosmology.exportName, 'stepCosmologyExpansion');
  assert.equal(cosmology.warmDelta.schema, COSMOLOGY_EXPANSION_DELTA_SCHEMA);
  assert.equal(cosmology.validity.approximation, 'webgpu-reduced-cosmology-expansion');
  assert.equal(sph.module, sphMaterialTaskModuleUrl);
  assert.equal(sph.exportName, 'stepSphMaterial');
  assert.equal(sph.warmDelta.schema, SPH_MATERIAL_DELTA_SCHEMA);
  assert.equal(sph.validity.approximation, 'webgpu-reduced-sph-material');
  assert.equal(membrane.module, membraneShellTaskModuleUrl);
  assert.equal(membrane.exportName, 'stepMembraneShell');
  assert.equal(membrane.warmDelta.schema, MEMBRANE_SHELL_DELTA_SCHEMA);
  assert.equal(membrane.validity.approximation, 'webgpu-reduced-membrane-shell');
  assert.equal(hydro.module, hydroAtmosphereTaskModuleUrl);
  assert.equal(hydro.exportName, 'stepHydroAtmosphere');
  assert.equal(hydro.warmDelta.schema, HYDRO_ATMOSPHERE_DELTA_SCHEMA);
  assert.equal(hydro.validity.approximation, 'webgpu-reduced-moist-shallow-water');
  assert.equal(radiation.module, radiationOpacityTaskModuleUrl);
  assert.equal(radiation.exportName, 'stepRadiationOpacity');
  assert.equal(radiation.warmDelta.schema, RADIATION_OPACITY_DELTA_SCHEMA);
  assert.equal(radiation.validity.approximation, 'webgpu-reduced-grey-radiation-opacity');
  assert.equal(stellar.module, stellarFusionTaskModuleUrl);
  assert.equal(stellar.exportName, 'stepStellarFusion');
  assert.equal(stellar.warmDelta.schema, STELLAR_FUSION_DELTA_SCHEMA);
  assert.equal(stellar.validity.approximation, 'webgpu-reduced-stellar-fusion');
  assert.equal(magnetosphere.module, magnetospherePlasmaTaskModuleUrl);
  assert.equal(magnetosphere.exportName, 'stepMagnetospherePlasma');
  assert.equal(magnetosphere.warmDelta.schema, MAGNETOSPHERE_PLASMA_DELTA_SCHEMA);
  assert.equal(magnetosphere.validity.approximation, 'reduced-ideal-mhd-plasma');
  assert.equal(pic.module, picPlasmaPatchTaskModuleUrl);
  assert.equal(pic.exportName, 'stepPicPlasmaPatch');
  assert.equal(pic.warmDelta.schema, PIC_PLASMA_PATCH_DELTA_SCHEMA);
  assert.equal(pic.validity.approximation, 'webgpu-reduced-pic-plasma-patch');
  assert.equal(relativity.module, relativisticCorrectionTaskModuleUrl);
  assert.equal(relativity.exportName, 'stepRelativisticCorrection');
  assert.equal(relativity.warmDelta.schema, RELATIVISTIC_CORRECTION_DELTA_SCHEMA);
  assert.equal(relativity.validity.approximation, 'webgpu-reduced-post-newtonian-correction');
  assert.equal(combustion.module, combustionPlumeTaskModuleUrl);
  assert.equal(combustion.exportName, 'stepCombustionPlume');
  assert.equal(combustion.warmDelta.schema, COMBUSTION_PLUME_DELTA_SCHEMA);
  assert.equal(combustion.validity.approximation, 'webgpu-reduced-combustion-plume');
});

test('N-body gravity task advances deterministic state with conservation diagnostics', async () => {
  resetNBodyGravity();
  const state = {
    masses: [1, 1],
    positions: [-0.5, 0, 0, 0.5, 0, 0],
    velocities: [0, -0.5, 0, 0, 0.5, 0],
    sequence: 0,
    elapsedTime: 0
  };
  const before = computeNBodyDiagnostics(state, { gravitationalConstant: 1, softening: 0.001 });
  const result = await stepNBodyGravity({
    stateKey: 'nbody:test:two-body',
    input: {
      stateKey: 'nbody:test:two-body',
      taskId: 'nbody:test:two-body',
      state,
      dt: 0.01,
      substeps: 4,
      gravitationalConstant: 1,
      softening: 0.001,
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.schema, N_BODY_GRAVITY_RESULT_SCHEMA);
  assert.equal(result.value.backend, 'cpu-direct-sum');
  assert.equal(result.value.sequence, 1);
  assert.equal(result.value.state.masses.length, 2);
  assert.equal(result.commitDelta.payload.schema, N_BODY_GRAVITY_DELTA_SCHEMA);
  assert.equal(result.commitDelta.payload.backend, 'cpu-direct-sum');
  assert.equal(result.commitDelta.payload.bodyCount, 2);
  assert.ok(Math.abs(result.value.diagnostics.totalMass - before.totalMass) < 1e-12);
  assert.ok(result.value.conservation.momentumDrift < 1e-12);
  assert.ok(Math.abs(result.value.conservation.relativeEnergyDrift) < 1e-5);
});

test('N-body Barnes-Hut tree mode tracks direct-sum reference for tight theta', async () => {
  resetNBodyGravity();
  const initial = makeNBodyInitialState({
    count: 32,
    seed: 20260530,
    radius: 2.2,
    centralMass: 42,
    orbitalMass: 0.7,
    gravitationalConstant: 1
  });
  const direct = await stepNBodyGravity({
    stateKey: 'nbody:direct:reference',
    input: {
      stateKey: 'nbody:direct:reference',
      taskId: 'nbody:direct:reference',
      state: JSON.parse(JSON.stringify(initial)),
      dt: 0.004,
      substeps: 2,
      gravitationalConstant: 1,
      softening: 0.025,
      gravityMode: 'direct',
      enableWebGPU: false
    }
  });
  const tree = await stepNBodyGravity({
    stateKey: 'nbody:tree:tight',
    input: {
      stateKey: 'nbody:tree:tight',
      taskId: 'nbody:tree:tight',
      state: JSON.parse(JSON.stringify(initial)),
      dt: 0.004,
      substeps: 2,
      gravitationalConstant: 1,
      softening: 0.025,
      gravityMode: 'tree',
      treeTheta: 0.05,
      treeLeafSize: 1,
      enableWebGPU: false
    }
  });

  assert.equal(tree.schema, N_BODY_GRAVITY_RESULT_SCHEMA);
  assert.equal(tree.backend, 'cpu-barnes-hut');
  assert.equal(tree.approximation.schema, N_BODY_GRAVITY_TREE_SCHEMA);
  assert.equal(tree.approximation.mode, 'barnes-hut');
  assert.ok(tree.approximation.interactionCount <= direct.approximation.interactionCount);
  const rmsPositionError = Math.sqrt(tree.state.positions.reduce((sum, value, index) => {
    const diff = value - direct.state.positions[index];
    return sum + diff * diff;
  }, 0) / tree.state.positions.length);
  assert.ok(rmsPositionError < 0.01, `tree/direct rms position error ${rmsPositionError}`);
});

test('N-body Barnes-Hut tree mode reduces large-N interactions and emits approximation diagnostics', async () => {
  resetNBodyGravity();
  const result = await stepNBodyGravity({
    stateKey: 'nbody:tree:large',
    input: {
      stateKey: 'nbody:tree:large',
      taskId: 'nbody:tree:large',
      state: makeNBodyInitialState({
        count: 128,
        seed: 31,
        radius: 3.5,
        centralMass: 80,
        orbitalMass: 0.45
      }),
      dt: 0.003,
      substeps: 1,
      gravitationalConstant: 1,
      softening: 0.04,
      gravityMode: 'tree',
      treeTheta: 0.7,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.backend, 'cpu-barnes-hut');
  assert.equal(result.value.approximation.schema, N_BODY_GRAVITY_TREE_SCHEMA);
  assert.ok(result.value.approximation.treeNodeCount > 1);
  assert.ok(result.value.approximation.acceptedCellCount > 0);
  assert.ok(result.value.approximation.interactionCount < 128 * 127);
  assert.ok(Number.isFinite(result.value.approximation.forceErrorEstimate));
  assert.equal(result.commitDelta.payload.approximation.mode, 'barnes-hut');
  assert.equal(result.commitDelta.payload.approximation.interactionCount, result.value.approximation.interactionCount);
});

test('model packet consumes N-body solver aggregate state', async () => {
  resetNBodyGravity();
  const model = new MultiscaleModel();
  const result = await stepNBodyGravity({
    stateKey: 'nbody:model:aggregate',
    input: {
      stateKey: 'nbody:model:aggregate',
      taskId: 'nbody:model:aggregate',
      state: makeNBodyInitialState({ count: 5, seed: 77 }),
      dt: 0.01,
      substeps: 2,
      enableWebGPU: false
    }
  });

  const nbody = model.applyNBodySolverResult(result);
  const packet = model.createPacket();
  assert.equal(nbody.bodyCount, 5);
  assert.equal(nbody.backend, 'cpu-direct-sum');
  assert.equal(packet.upward.aggregateState.nbody.bodyCount, 5);
  assert.equal(packet.upward.aggregateState.nbody.backend, 'cpu-direct-sum');
  assert.equal(packet.upward.aggregateState.nbody.approximation, 'direct-sum');
  assert.equal(packet.upward.aggregateState.nbody.sequence, result.sequence);
  assert.equal(typeof packet.upward.closures.nbodyRelativeEnergyDrift, 'number');
});

test('reactive thermal cell task emits closure and updates model packet state', async () => {
  resetReactiveThermalCell();
  const model = new MultiscaleModel();
  const initialState = makeReactiveThermalInitialState({
    environment: model.environment,
    coupling: {
      fireIntensity: 0.9,
      fuelFraction: 0.8,
      flameTemperatureK: 1120,
      waterContact: 0.1
    }
  });
  const result = await stepReactiveThermalCell({
    stateKey: 'reactive:model:cell',
    input: {
      stateKey: 'reactive:model:cell',
      taskId: 'reactive:model:cell',
      state: initialState,
      dt: 1 / 30,
      environment: model.environment,
      coupling: {
        fireIntensity: 0.9,
        fuelFraction: 0.8,
        flameTemperatureK: 1120,
        waterContact: 0.12,
        reactionProgress: 0.2
      },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.schema, REACTIVE_THERMAL_RESULT_SCHEMA);
  assert.equal(result.value.backend, 'cpu-reactive-thermal');
  assert.equal(result.commitDelta.payload.schema, REACTIVE_THERMAL_DELTA_SCHEMA);
  assert.ok(result.value.closure.temperatureK > 294);
  assert.ok(result.value.closure.heatSource >= 0);
  assert.ok(Number.isFinite(result.value.conservation.speciesInventoryDelta));

  const reactive = model.applyReactiveThermalResult(result.value);
  const packet = model.createPacket();
  assert.equal(reactive.backend, 'cpu-reactive-thermal');
  assert.equal(packet.upward.aggregateState.reactiveCell.backend, 'cpu-reactive-thermal');
  assert.equal(packet.upward.aggregateState.reactiveCell.sequence, result.value.sequence);
  assert.equal(typeof packet.upward.closures.reactiveHeatReleaseNorm, 'number');
});

test('reactive thermal cell has a WebGPU-first backend with CPU fallback status', async () => {
  resetReactiveThermalCell();
  const result = await stepReactiveThermalCell({
    stateKey: 'reactive:webgpu:probe',
    input: {
      stateKey: 'reactive:webgpu:probe',
      state: makeReactiveThermalInitialState({
        environment: { ambientTemperatureK: 294, ambientPressurePa: 101325, oxygenFraction: 0.22 },
        coupling: { fireIntensity: 0.7, fuelFraction: 0.8, waterContact: 0.05, flameTemperatureK: 980 }
      }),
      dt: 1 / 60,
      environment: { ambientTemperatureK: 294, ambientPressurePa: 101325, oxygenFraction: 0.22 },
      coupling: { fireIntensity: 0.7, fuelFraction: 0.8, waterContact: 0.05, flameTemperatureK: 980 },
      emitCommitDelta: false
    }
  });

  assert.equal(result.schema, REACTIVE_THERMAL_RESULT_SCHEMA);
  assert.equal(REACTIVE_THERMAL_WEBGPU_MAX_CELLS, 1);
  assert.ok(['webgpu-reactive-thermal', 'cpu-reactive-thermal'].includes(result.backend));
  if (result.backend === 'cpu-reactive-thermal') {
    assert.equal(result.webgpuStatus?.fallback, true);
    assert.equal(typeof result.webgpuStatus.disabledReason, 'string');
  } else {
    assert.equal(result.webgpuStatus?.cellCount, REACTIVE_THERMAL_WEBGPU_MAX_CELLS);
  }
});

test('Maxwell field task advances field tile and updates model packet state', async () => {
  resetMaxwellFields();
  const model = new MultiscaleModel();
  const initialState = makeMaxwellInitialState({ width: 8, height: 8, seed: 9, amplitude: 0.3 });
  const before = computeMaxwellDiagnostics(initialState);
  const result = await stepMaxwellFields({
    stateKey: 'maxwell:model:tile',
    input: {
      stateKey: 'maxwell:model:tile',
      taskId: 'maxwell:model:tile',
      state: initialState,
      dt: 0.02,
      lightSpeed: 1,
      damping: 0.996,
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.schema, MAXWELL_FIELD_RESULT_SCHEMA);
  assert.equal(result.value.backend, 'cpu-maxwell-fdtd');
  assert.equal(result.commitDelta.payload.schema, MAXWELL_FIELD_DELTA_SCHEMA);
  assert.equal(result.value.diagnostics.cellCount, 64);
  assert.ok(result.value.diagnostics.fieldEnergy > 0);
  assert.notEqual(result.value.diagnostics.fieldEnergy, before.fieldEnergy);

  const maxwell = model.applyMaxwellFieldResult(result.value);
  const packet = model.createPacket();
  assert.equal(maxwell.backend, 'cpu-maxwell-fdtd');
  assert.equal(packet.upward.aggregateState.maxwell.backend, 'cpu-maxwell-fdtd');
  assert.equal(packet.upward.aggregateState.maxwell.sequence, result.value.sequence);
  assert.equal(typeof packet.upward.closures.maxwellFieldEnergy, 'number');
});

test('cosmology expansion task advances supergalactic samples and updates model packet state', async () => {
  resetCosmologyExpansion();
  const model = new MultiscaleModel();
  model.applyMaxwellFieldResult({
    backend: 'test-maxwell',
    sequence: 1,
    diagnostics: {
      width: 4,
      height: 4,
      cellCount: 16,
      fieldEnergy: 0.8,
      netCharge: 0.03,
      poyntingFlux: [0.1, 0.04, 0]
    },
    conservation: { fieldEnergyDelta: 0.01, chargeDrift: 0.001 }
  });
  model.applyRelativisticCorrectionResult({
    backend: 'test-relativity',
    sequence: 1,
    diagnostics: {
      sampleCount: 16,
      maxSpeedFractionC: 0.05,
      meanLorentzFactor: 1.002,
      meanTimeDilation: 1.002,
      gravitationalRedshiftProxy: 0.012,
      lensingDeflectionArcsecProxy: 2200,
      relativisticEnergyProxy: 0.2
    },
    conservation: { relativisticEnergyDelta: 0.01, timeDilationDrift: 0.001, precessionDelta: 0.001 }
  });
  const initialState = makeCosmologyExpansionInitialState({
    sampleCount: 40,
    seed: 20260529,
    coupling: {
      galaxyTurbulence: model.state.galaxy.gasTurbulence,
      starFormationRate: model.state.galaxy.starFormationRate,
      maxwellFieldEnergy: model.state.galaxy.maxwell.fieldEnergy,
      relativisticLensing: model.state.solar.relativity.lensingDeflectionArcsecProxy,
      relativisticRedshift: model.state.solar.relativity.gravitationalRedshiftProxy,
      radiationPressure: model.state.solar.radiationPressure
    }
  });
  const before = computeCosmologyExpansionDiagnostics(initialState);
  const result = await stepCosmologyExpansion({
    stateKey: 'cosmology:model:web',
    input: {
      stateKey: 'cosmology:model:web',
      taskId: 'cosmology:model:web',
      state: initialState,
      dt: 0.04,
      coupling: {
        galaxyTurbulence: model.state.galaxy.gasTurbulence,
        starFormationRate: model.state.galaxy.starFormationRate,
        maxwellFieldEnergy: model.state.galaxy.maxwell.fieldEnergy,
        poyntingFlux: model.state.galaxy.maxwell.poyntingFlux,
        relativisticLensing: model.state.solar.relativity.lensingDeflectionArcsecProxy,
        relativisticRedshift: model.state.solar.relativity.gravitationalRedshiftProxy,
        radiationPressure: model.state.solar.radiationPressure
      },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.schema, COSMOLOGY_EXPANSION_RESULT_SCHEMA);
  assert.equal(result.value.backend, 'cpu-cosmology-expansion');
  assert.equal(result.commitDelta.payload.schema, COSMOLOGY_EXPANSION_DELTA_SCHEMA);
  assert.equal(result.value.diagnostics.sampleCount, 40);
  assert.ok(Number.isFinite(result.value.diagnostics.scaleFactor));
  assert.ok(Number.isFinite(result.value.diagnostics.hubbleRate));
  assert.ok(Number.isFinite(result.value.diagnostics.structureGrowthProxy));
  assert.notEqual(result.value.diagnostics.expansionWorkProxy, before.expansionWorkProxy);

  const cosmology = model.applyCosmologyExpansionResult(result.value);
  const packet = model.createPacket();
  assert.equal(cosmology.backend, 'cpu-cosmology-expansion');
  assert.equal(packet.upward.aggregateState.cosmologyExpansion.backend, 'cpu-cosmology-expansion');
  assert.equal(packet.upward.aggregateState.cosmologyExpansion.sampleCount, 40);
  assert.equal(typeof packet.upward.closures.cosmologyScaleFactor, 'number');
  assert.equal(typeof packet.upward.closures.cosmologyHubbleRate, 'number');
  assert.equal(typeof packet.upward.closures.cosmologyStructureGrowth, 'number');
});

test('cosmology expansion task has a WebGPU-first backend with CPU fallback status', async () => {
  resetCosmologyExpansion();
  const result = await stepCosmologyExpansion({
    stateKey: 'cosmology:webgpu:probe',
    input: {
      stateKey: 'cosmology:webgpu:probe',
      state: makeCosmologyExpansionInitialState({ sampleCount: 32, seed: 4 }),
      dt: 0.02,
      environment: { hubbleRate: 0.071 },
      coupling: { galaxyTurbulence: 0.3, starFormationRate: 1.1, maxwellFieldEnergy: 0.1, relativisticLensing: 900, relativisticRedshift: 0.003 },
      emitCommitDelta: false
    }
  });

  assert.equal(result.schema, COSMOLOGY_EXPANSION_RESULT_SCHEMA);
  assert.ok(COSMOLOGY_EXPANSION_WEBGPU_MAX_SAMPLES >= 32);
  assert.ok(['webgpu-cosmology-expansion', 'cpu-cosmology-expansion'].includes(result.backend));
  if (result.backend === 'cpu-cosmology-expansion') {
    assert.equal(result.webgpuStatus, null);
    assert.equal(typeof result.webgpuError, 'string');
  } else {
    assert.equal(result.webgpuStatus?.sampleCount, 32);
  }
});

test('cosmology expansion responds to relativistic and galactic forcing', async () => {
  resetCosmologyExpansion();
  const base = makeCosmologyExpansionInitialState({
    sampleCount: 48,
    seed: 77,
    coupling: { galaxyTurbulence: 0.2, starFormationRate: 0.8, maxwellFieldEnergy: 0.02 }
  });
  const calm = await stepCosmologyExpansion({
    stateKey: 'cosmology:response:calm',
    input: {
      stateKey: 'cosmology:response:calm',
      state: structuredClone(base),
      dt: 0.06,
      environment: { hubbleRate: 0.071 },
      coupling: { galaxyTurbulence: 0.2, starFormationRate: 0.8, maxwellFieldEnergy: 0.02, relativisticLensing: 0, relativisticRedshift: 0 },
      enableWebGPU: false
    }
  });
  const driven = await stepCosmologyExpansion({
    stateKey: 'cosmology:response:driven',
    input: {
      stateKey: 'cosmology:response:driven',
      state: structuredClone(base),
      dt: 0.06,
      environment: { hubbleRate: 0.071 },
      coupling: { galaxyTurbulence: 1.8, starFormationRate: 3.5, maxwellFieldEnergy: 2.0, poyntingFlux: [0.8, 0.3, 0.1], relativisticLensing: 12000, relativisticRedshift: 0.02, radiationPressure: 1.8 },
      enableWebGPU: false
    }
  });

  assert.ok(driven.diagnostics.hubbleRate > calm.diagnostics.hubbleRate);
  assert.ok(driven.diagnostics.expansionWorkProxy >= calm.diagnostics.expansionWorkProxy);
  assert.ok(driven.diagnostics.meanExpansionRateProxy >= calm.diagnostics.meanExpansionRateProxy);
});

test('molecular dynamics task advances atom patch and updates model packet state', async () => {
  resetMolecularDynamics();
  const model = new MultiscaleModel();
  model.state.surface.fireIntensity = 0.72;
  model.state.surface.radiativeHeatFlux = 120;
  const initialState = makeMolecularDynamicsInitialState({
    atomCount: 30,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      fireIntensity: model.state.surface.fireIntensity,
      waterContact: model.state.surface.waterContact,
      radiativeHeatFlux: model.state.surface.radiativeHeatFlux,
      reactionProgress: model.state.molecular.reactionProgress
    }
  });
  const before = computeMolecularDynamicsDiagnostics(initialState);
  const result = await stepMolecularDynamics({
    stateKey: 'molecular:model:patch',
    input: {
      stateKey: 'molecular:model:patch',
      taskId: 'molecular:model:patch',
      state: initialState,
      dt: 0.08,
      environment: model.environment,
      coupling: {
        fireIntensity: model.state.surface.fireIntensity,
        waterContact: model.state.surface.waterContact,
        radiativeHeatFlux: model.state.surface.radiativeHeatFlux,
        reactionProgress: model.state.molecular.reactionProgress
      },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.schema, MOLECULAR_DYNAMICS_RESULT_SCHEMA);
  assert.equal(result.value.backend, 'cpu-molecular-dynamics');
  assert.equal(result.commitDelta.payload.schema, MOLECULAR_DYNAMICS_DELTA_SCHEMA);
  assert.equal(result.value.diagnostics.atomCount, 30);
  assert.ok(result.value.diagnostics.bondCount > 0);
  assert.ok(Number.isFinite(result.value.diagnostics.meanBondOrder));
  assert.ok(Number.isFinite(result.value.diagnostics.heatReleaseProxy));
  assert.ok(Number.isFinite(result.value.diagnostics.dipoleMomentProxy));
  assert.ok(Number.isFinite(result.value.diagnostics.electricalConductivityProxy));
  assert.equal(result.value.diagnostics.chargeEquilibration.schema, MOLECULAR_CHARGE_EQUILIBRATION_SCHEMA);
  assert.equal(result.value.diagnostics.chargeEquilibration.mode, 'applied-bond-graph-qeq-relaxation');
  assert.ok(Number.isFinite(result.value.diagnostics.chargeEquilibrationResidualRms));
  assert.ok(Number.isFinite(result.value.diagnostics.chargeEquilibrationChargeRmsDelta));
  assert.ok(Math.abs(result.value.diagnostics.chargeEquilibration.totalChargeAfter) < 1e-6);
  assert.ok(Math.abs(result.value.diagnostics.chargeEquilibration.neutralizationResidualCharge) < 1e-6);
  assert.equal(result.value.diagnostics.forceEnergyLedger.schema, MOLECULAR_FORCE_ENERGY_LEDGER_SCHEMA);
  assert.ok(Number.isFinite(result.value.diagnostics.forceEnergyLedger.totalEnergyProxy));
  assert.ok(Number.isFinite(result.value.diagnostics.forceEnergyLedger.totalPotentialEnergyProxy));
  assert.ok(Number.isFinite(result.value.diagnostics.forceEnergyLedger.components.bondedAttractionEnergyProxy));
  assert.ok(Number.isFinite(result.value.diagnostics.forceEnergyLedger.components.electrostaticEnergyProxy));
  assert.ok(Number.isFinite(result.value.diagnostics.forceEnergyLedger.components.repulsionEnergyProxy));
  assert.ok(Number.isFinite(result.value.diagnostics.forceEnergyLedger.components.qeqResidualPenaltyProxy));
  assert.equal(result.value.diagnostics.forceFieldTotalEnergyProxy, result.value.diagnostics.forceEnergyLedger.totalEnergyProxy);
  assert.equal(result.value.diagnostics.forceFieldPotentialEnergyProxy, result.value.diagnostics.forceEnergyLedger.totalPotentialEnergyProxy);
  assert.ok(Math.abs(result.value.diagnostics.totalEnergyProxy - result.value.diagnostics.forceEnergyLedger.totalEnergyProxy) < 1e-9);
  assert.equal(result.value.diagnostics.thermoPhaseLedger.schema, MOLECULAR_THERMO_PHASE_LEDGER_SCHEMA);
  assert.equal(result.value.diagnostics.thermoPhaseLedger.energyLedgerSchema, MOLECULAR_FORCE_ENERGY_LEDGER_SCHEMA);
  assert.ok(Number.isFinite(result.value.diagnostics.thermoPhaseLedger.phaseChangeRateProxy));
  assert.ok(Number.isFinite(result.value.diagnostics.thermoPhaseLedger.latentHeatSinkProxy));
  assert.ok(Number.isFinite(result.value.diagnostics.thermoPhaseLedger.specificEnthalpyProxy));
  assert.equal(typeof result.value.diagnostics.phaseRegime, 'string');
  assert.ok(Number.isFinite(result.value.diagnostics.liquidFraction));
  assert.ok(Number.isFinite(result.value.diagnostics.vaporFraction));
  const molecularPhaseTotal = result.value.diagnostics.solidFraction
    + result.value.diagnostics.liquidFraction
    + result.value.diagnostics.vaporFraction
    + result.value.diagnostics.plasmaFraction;
  assert.ok(Math.abs(molecularPhaseTotal - 1) < 1e-9);
  assert.ok(Number.isFinite(result.value.diagnostics.valenceSaturation));
  assert.equal(result.value.diagnostics.pairSearchMode, 'cell-list');
  assert.ok(result.value.diagnostics.neighborCandidatePairCount > 0);
  assert.ok(result.value.diagnostics.bondCandidateCount >= result.value.diagnostics.bondCount);
  assert.ok(result.value.diagnostics.spatialCellCount > 0);
  assert.equal(result.value.diagnostics.reactionEventLedger.schema, MOLECULAR_REACTION_EVENT_LEDGER_SCHEMA);
  assert.equal(result.value.diagnostics.reactionSource.schema, MOLECULAR_REACTION_SOURCE_SCHEMA);
  assert.equal(result.value.diagnostics.reactionEventCount, result.value.diagnostics.reactionEventLedger.bondEventCount);
  assert.equal(typeof result.value.diagnostics.reactionEventLedger.eventIntensityProxy, 'number');
  assert.equal(typeof result.value.diagnostics.reactionHeatSourceProxy, 'number');
  assert.equal(typeof result.value.diagnostics.reactionSpeciesRateProxy, 'number');
  assert.ok(Number.isFinite(result.value.conservation.energyDelta));
  assert.equal(typeof result.value.conservation.reactionEventCount, 'number');
  assert.equal(typeof result.value.conservation.reactionEventIntensityProxy, 'number');
  assert.equal(typeof result.value.conservation.reactionHeatSourceProxy, 'number');
  assert.notEqual(result.value.diagnostics.totalEnergyProxy, before.totalEnergyProxy);

  const molecular = model.applyMolecularDynamicsResult(result.value);
  const packet = model.createPacket();
  assert.equal(molecular.backend, 'cpu-molecular-dynamics');
  assert.equal(model.state.closures.molecularDynamics.schema, CLOSURE_RESULT_SCHEMA);
  assert.equal(model.state.closures.molecularDynamics.source.solverId, 'molecular-dynamics');
  assert.equal(model.state.closures.molecularDynamics.chemistry.atomCount, 30);
  assert.equal(model.state.closures.molecularDynamics.chemistry.bondCount, result.value.diagnostics.bondCount);
  assert.equal(typeof model.state.closures.molecularDynamics.transport.electricalConductivitySm, 'number');
  assert.equal(model.state.closures.molecularDynamics.chemistry.chargeEquilibration.schema, MOLECULAR_CHARGE_EQUILIBRATION_SCHEMA);
  assert.equal(model.state.closures.molecularDynamics.chemistry.forceEnergyLedger.schema, MOLECULAR_FORCE_ENERGY_LEDGER_SCHEMA);
  assert.equal(model.state.closures.molecularDynamics.chemistry.thermoPhaseLedger.schema, MOLECULAR_THERMO_PHASE_LEDGER_SCHEMA);
  assert.equal(model.state.closures.molecularDynamics.state.conserved.forceEnergyLedger.schema, MOLECULAR_FORCE_ENERGY_LEDGER_SCHEMA);
  assert.equal(model.state.closures.molecularDynamics.state.conserved.thermoPhaseLedger.schema, MOLECULAR_THERMO_PHASE_LEDGER_SCHEMA);
  assert.equal(model.state.closures.molecularDynamics.phase.phaseRegime, result.value.diagnostics.phaseRegime);
  assert.equal(typeof model.state.closures.molecularDynamics.thermodynamics.latentHeatSinkProxy, 'number');
  assert.ok(Math.abs(model.state.closures.molecularDynamics.chemistry.chargeEquilibrationNeutralizationResidualCharge) < 1e-6);
  assert.deepEqual(validateClosureResult(model.state.closures.molecularDynamics), { ok: true, errors: [] });
  assert.equal(packet.upward.aggregateState.molecularDynamics.backend, 'cpu-molecular-dynamics');
  assert.equal(packet.upward.aggregateState.molecularDynamics.atomCount, 30);
  assert.equal(packet.upward.aggregateState.molecularDynamics.bondCount, result.value.diagnostics.bondCount);
  assert.equal(packet.upward.aggregateState.molecularDynamics.dipoleMomentProxy, Number(result.value.diagnostics.dipoleMomentProxy.toFixed(4)));
  assert.equal(typeof packet.upward.aggregateState.molecularDynamics.electricalConductivityProxy, 'number');
  assert.equal(packet.upward.aggregateState.molecularDynamics.chargeEquilibration.schema, MOLECULAR_CHARGE_EQUILIBRATION_SCHEMA);
  assert.equal(typeof packet.upward.aggregateState.molecularDynamics.chargeEquilibrationResidualRms, 'number');
  assert.ok(Math.abs(packet.upward.aggregateState.molecularDynamics.chargeEquilibrationNeutralizationResidualCharge) < 1e-6);
  assert.equal(packet.upward.aggregateState.molecularDynamics.forceEnergyLedger.schema, MOLECULAR_FORCE_ENERGY_LEDGER_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.thermoPhaseLedger.schema, MOLECULAR_THERMO_PHASE_LEDGER_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.phaseRegime, result.value.diagnostics.phaseRegime);
  assert.equal(typeof packet.upward.aggregateState.molecularDynamics.phaseChangeRateProxy, 'number');
  assert.equal(typeof packet.upward.aggregateState.molecularDynamics.latentHeatSinkProxy, 'number');
  assert.equal(typeof packet.upward.aggregateState.molecularDynamics.forceFieldTotalEnergyProxy, 'number');
  assert.equal(typeof packet.upward.aggregateState.molecularDynamics.forceFieldPotentialEnergyProxy, 'number');
  assert.equal(typeof packet.upward.closures.molecularChargeEquilibrationResidualRms, 'number');
  assert.equal(typeof packet.upward.closures.molecularForceEnergyTotal, 'number');
  assert.equal(typeof packet.upward.closures.molecularForceEnergyPotential, 'number');
  assert.equal(typeof packet.upward.closures.molecularPhaseChangeRateProxy, 'number');
  assert.equal(typeof packet.upward.closures.molecularLatentHeatSinkProxy, 'number');
  assert.equal(packet.upward.aggregateState.molecularDynamics.pairSearchMode, 'cell-list');
  assert.equal(packet.upward.aggregateState.molecularDynamics.neighborCandidatePairCount, result.value.diagnostics.neighborCandidatePairCount);
  assert.equal(packet.upward.aggregateState.molecularDynamics.webgpuKernelMode, 'none');
  assert.equal(packet.upward.aggregateState.molecularDynamics.webgpuAcceptedNeighborPairCount, 0);
  assert.equal(packet.upward.aggregateState.molecularDynamics.reactionEventLedger.schema, MOLECULAR_REACTION_EVENT_LEDGER_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.reactionSource.schema, MOLECULAR_REACTION_SOURCE_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.reactionEventCount, result.value.diagnostics.reactionEventCount);
  assert.equal(typeof packet.upward.closures.molecularBondCount, 'number');
  assert.equal(typeof packet.upward.closures.molecularReactionEventCount, 'number');
  assert.equal(typeof packet.upward.closures.molecularReactionHeatSourceProxy, 'number');
  assert.equal(typeof packet.upward.closures.molecularHeatReleaseProxy, 'number');
  assert.equal(typeof packet.upward.closures.molecularIonizationFraction, 'number');
  assert.equal(typeof packet.upward.closures.molecularConductivityProxy, 'number');
  assert.equal(packet.upward.closureResults.molecularDynamics.schema, CLOSURE_RESULT_SCHEMA);
  assert.equal(packet.upward.closureResults.molecularDynamics.chemistry.atomCount, 30);
  assert.equal(packet.conservation.chargeAudit, 'reduced-pic-and-molecular-proxy');
});

test('quantum material potential provides condition-aware material properties and reduced Na-water product handoff', () => {
  const environment = {
    ambientTemperatureK: 298,
    ambientPressurePa: 101325,
    oxygenFraction: 0.21,
    gravityMps2: 9.81,
    electricFieldVm: 0,
    magneticFieldT: 0
  };
  const oxygenClosure = createQuantumOrbitalClosure({
    orbital: { elementSymbol: 'O', principalN: 2, angularL: 1, magneticM: 0, finiteGridSize: 10 },
    environment,
    molecularDynamics: { meanTemperatureK: 298, ionizationFraction: 0 },
    timeSeconds: 0.25
  });
  const waterPotential = createQuantumMaterialPotential({
    quantumOrbital: oxygenClosure,
    environment,
    molecularDynamics: {
      atomCount: 15,
      species: { H: 10, O: 5, other: 0 },
      molecularSpecies: { H2O: 5 },
      phaseFractions: { liquid: 1 },
      meanTemperatureK: 298,
      ionizationFraction: 0,
      reactionProgress: 0
    },
    timeSeconds: 0.25
  });

  assert.equal(waterPotential.schema, QUANTUM_MATERIAL_POTENTIAL_SCHEMA);
  assert.equal(waterPotential.materialId, 'water.h2o.reference-eos-v0');
  assert.equal(waterPotential.dominantFormula, 'H2O');
  assert.equal(waterPotential.phase, 'liquid');
  assert.ok(waterPotential.densityKgM3 > 900);
  assert.ok(waterPotential.bulkModulusPa > 1e9);
  assert.equal(waterPotential.youngsModulusPa, null);
  assert.ok(waterPotential.refractiveIndex > 1.2);
  assert.ok(waterPotential.dielectricConstant > 40);
  assert.ok(waterPotential.bondStrengthTerms.some((term) => term.atoms.includes('O') && term.atoms.includes('H')));
  assert.equal(waterPotential.potentialTerms.materialPropertiesAvailable, true);
  assert.equal(waterPotential.potentialTerms.forceSurfacePreviewAvailable, true);
  assert.equal(waterPotential.potentialTerms.reducedEnergyGradientAvailable, true);
  assert.equal(waterPotential.potentialTerms.bornOppenheimerForcesAvailable, false);
  assert.equal(waterPotential.forceSurfacePreview.schema, QUANTUM_MATERIAL_FORCE_SURFACE_SCHEMA);
  assert.equal(waterPotential.forceSurfacePreview.status, 'reduced-force-preview-ready');
  assert.equal(waterPotential.forceSurfacePreview.reducedEnergyGradientAvailable, true);
  assert.equal(waterPotential.forceSurfacePreview.bornOppenheimerForcesAvailable, false);
  assert.ok(waterPotential.forceSurfacePreview.termCount > 0);
  assert.ok(waterPotential.forceSurfacePreview.meanForceGradientEvPerAngstrom >= 0);
  assert.equal(waterPotential.statisticalEnsemble.schema, QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA);
  assert.equal(waterPotential.statisticalEnsemble.sourceEquation.schema, QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA);
  assert.equal(waterPotential.statisticalEnsemble.sourceEquation.adapterSchema, MOLECULAR_SOURCE_EQUATION_SCHEMA);
  assert.equal(waterPotential.statisticalEnsemble.sourceEquation.channelCount, 5);
  assert.ok(waterPotential.statisticalEnsemble.sourceEquation.channels.some((channel) => channel.id === 'ensemble-pressure'));
  assert.ok(waterPotential.statisticalEnsemble.sourceEquation.channels.some((channel) => channel.id === 'ionization-population'));
  assert.ok(Number.isFinite(waterPotential.statisticalEnsemble.sourceEquation.sourceTerms.pressureDriveProxy));
  assert.ok(Number.isFinite(waterPotential.statisticalEnsemble.sourceEquation.sourceTerms.temperatureDeltaKProxy));
  assert.equal(waterPotential.lawGraphFragment.schema, QUANTUM_MATERIAL_LAW_GRAPH_FRAGMENT_SCHEMA);
  assert.equal(waterPotential.lawGraphFragment.consistency.status, 'consistent-reduced-preview');
  assert.ok(waterPotential.lawGraphFragment.stateNodes.some((node) => node.id === 'state:molecular-composition'));
  assert.ok(waterPotential.lawGraphFragment.lawNodes.some((node) => node.id === 'law:reduced-morse-force-surface-preview'));
  assert.equal(waterPotential.behaviorSurface.behaviorHooks.phaseChange, true);
  assert.equal(waterPotential.behaviorSurface.behaviorHooks.liveForceGradient, false);
  assert.equal(waterPotential.unsupportedChemistry.unsupportedReactiveChemistry, false);
  assert.equal(waterPotential.closureResult.schema, CLOSURE_RESULT_SCHEMA);
  assert.equal(waterPotential.closureResult.mechanics.bulkModulusPa, waterPotential.bulkModulusPa);
  assert.equal(waterPotential.closureResult.statistical.schema, QUANTUM_STATISTICAL_CLOSURE_SCHEMA);
  assert.equal(waterPotential.closureResult.statistical.ensembleSchema, QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA);
  assert.equal(waterPotential.closureResult.statistical.sourceEquation.schema, QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA);
  assert.equal(waterPotential.closureResult.statistical.sourceEquation.adapterSchema, MOLECULAR_SOURCE_EQUATION_SCHEMA);
  assert.equal(waterPotential.closureResult.statistical.sourceEquation.channelCount, 5);
  assert.equal(waterPotential.closureResult.statistical.ensemblePressurePa, waterPotential.statisticalEnsemble.ensemblePressurePa);
  assert.equal(waterPotential.closureResult.statistical.opacityProxy, waterPotential.statisticalEnsemble.opacityProxy);
  assert.equal(waterPotential.closureResult.statistical.ionizationFraction, waterPotential.statisticalEnsemble.ionizationFraction);
  assert.equal(waterPotential.closureResult.statistical.degeneracyParameter, waterPotential.statisticalEnsemble.degeneracyParameter);
  assert.equal(waterPotential.closureResult.statistical.heatCapacityProxy, waterPotential.statisticalEnsemble.heatCapacityProxy);
  assert.equal(waterPotential.closureResult.chemistry.forceSurfacePreview.schema, QUANTUM_MATERIAL_FORCE_SURFACE_SCHEMA);
  assert.equal(waterPotential.closureResult.chemistry.lawGraphFragment.schema, QUANTUM_MATERIAL_LAW_GRAPH_FRAGMENT_SCHEMA);

  const sodiumWaterMolecularDynamics = {
    atomCount: 16,
    species: { H: 10, O: 5, Na: 1, other: 0 },
    molecularSpecies: { H2O: 5, Na: 1 },
    phaseFractions: { liquid: 1 },
    meanTemperatureK: 298,
    ionizationFraction: 0.02,
    reactionProgress: 0
  };
  const sodiumWaterPotential = createQuantumMaterialPotential({
    quantumOrbital: oxygenClosure,
    environment,
    molecularDynamics: sodiumWaterMolecularDynamics,
    timeSeconds: 0.5
  });

  assert.equal(sodiumWaterPotential.unsupportedChemistry.unsupportedReactiveChemistry, false);
  assert.equal(sodiumWaterPotential.unsupportedChemistry.blockedInteractionCount, 0);
  assert.equal(sodiumWaterPotential.unsupportedChemistry.resolvedInteractions[0].id, 'na-water-reactive-charge-transfer');
  assert.equal(sodiumWaterPotential.potentialTerms.unsupportedReactiveChemistry, false);
  assert.equal(sodiumWaterPotential.potentialTerms.reactionBarrierSurfaceAvailable, true);
  assert.equal(sodiumWaterPotential.potentialTerms.productStoichiometryAvailable, true);
  assert.equal(sodiumWaterPotential.potentialTerms.productTopologyAvailable, true);
  assert.equal(sodiumWaterPotential.forceSurfacePreview.status, 'reduced-force-preview-ready');
  assert.equal(sodiumWaterPotential.forceSurfacePreview.productStoichiometryAvailable, true);
  assert.equal(sodiumWaterPotential.reactionBarrierSurface.schema, QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA);
  assert.equal(sodiumWaterPotential.reactionBarrierSurface.productStoichiometryAvailable, true);
  assert.equal(sodiumWaterPotential.reactionBarrierSurface.productTopologyAvailable, true);
  assert.equal(sodiumWaterPotential.reactionBarrierSurface.productTopology.schema, QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA);
  assert.equal(sodiumWaterPotential.reactionBarrierSurface.productTopology.status, 'reduced-product-topology-ready');
  assert.equal(sodiumWaterPotential.reactionBarrierSurface.productTopology.products[0].formula, 'NaOH');
  assert.equal(sodiumWaterPotential.reactionBarrierSurface.productTopology.products[1].formula, 'H2');
  assert.equal(sodiumWaterPotential.reactionBarrierSurface.productStoichiometry.reactionId, 'na-h2o-to-naoh-h2-reduced-stoichiometry');
  assert.equal(sodiumWaterPotential.reactionBarrierSurface.productStoichiometry.products.NaOH, 1);
  assert.equal(sodiumWaterPotential.reactionBarrierSurface.productStoichiometry.products.H2, 0.5);
  assert.ok(sodiumWaterPotential.reactionBarrierSurface.productHeatReleaseProxy > 0);
  assert.ok(sodiumWaterPotential.reactionBarrierSurface.productChargeDeltaProxy > 0);
  assert.equal(sodiumWaterPotential.reactionBarrierSurface.productGasFormula, 'H2');
  assert.equal(sodiumWaterPotential.lawGraphFragment.consistency.status, 'consistent-reduced-preview');
  assert.ok(sodiumWaterPotential.lawGraphFragment.stateNodes.some((node) => node.id === 'state:reaction-product-stoichiometry'));
  assert.ok(sodiumWaterPotential.lawGraphFragment.lawNodes.some((node) => node.id === 'law:reduced-reaction-product-stoichiometry'));
  const sodiumWaterLawGraph = createLawGraphConsistencyReport({
    state: {
      orbital: {
        elementSymbol: 'O',
        materialPotential: sodiumWaterPotential,
        materialPotentialLawGraphFragment: sodiumWaterPotential.lawGraphFragment
      },
      molecular: { molecularDynamics: sodiumWaterMolecularDynamics },
      surface: { reactiveCell: {} },
      mpm: { sphMaterial: {} }
    },
    environment,
    fragments: [sodiumWaterPotential.lawGraphFragment],
    coupling: { status: 'warming', linkCount: 0, activeLinkCount: 0, fieldAdapterPlan: { blockedAdapterCount: 0 } },
    conservation: { status: 'warming', mode: 'interactive-proxy' },
    timeSeconds: 0.5,
    activeLayerId: 'molecular',
    solverDescriptors: createMultiscaleSolverDescriptors()
  });
  assert.equal(sodiumWaterLawGraph.schema, MULTISCALE_LAW_GRAPH_CONSISTENCY_SCHEMA);
  assert.equal(sodiumWaterLawGraph.proxyConsistent, true);
  assert.equal(sodiumWaterLawGraph.status, 'proxy-consistent-scientific-blocked');
  assert.equal(sodiumWaterLawGraph.updatePlan.schema, MULTISCALE_LAW_GRAPH_UPDATE_PLAN_SCHEMA);
  assert.equal(sodiumWaterLawGraph.updatePlan.status, 'proxy-update-plan-ready-scientific-blocked');
  assert.equal(sodiumWaterLawGraph.updatePlan.proxyBlockedOperationCount, 0);
  assert.equal(sodiumWaterLawGraph.consistencySolve.schema, MULTISCALE_LAW_GRAPH_CONSISTENCY_SOLVE_SCHEMA);
  assert.equal(sodiumWaterLawGraph.consistencySolve.status, 'proxy-solve-converged-scientific-blocked');
  assert.equal(sodiumWaterLawGraph.consistencySolve.convergedProxy, true);
  assert.equal(sodiumWaterLawGraph.consistencySolve.closedResidualProxy, 0);
  assert.equal(sodiumWaterLawGraph.proposalAdmission.schema, MULTISCALE_LAW_GRAPH_PROPOSAL_ADMISSION_SCHEMA);
  assert.equal(sodiumWaterLawGraph.proposalAdmission.status, 'proxy-admission-ready-scientific-blocked');
  assert.equal(sodiumWaterLawGraph.proposalAdmission.proxyConverged, true);
  assert.ok(sodiumWaterLawGraph.proposalAdmission.proposalCount > 0);
  assert.ok(sodiumWaterLawGraph.proposalAdmission.nextAdmissionAction.startsWith('dispatch:op:'));
  assert.equal(sodiumWaterLawGraph.dispatchQueue.schema, MULTISCALE_LAW_GRAPH_DISPATCH_QUEUE_SCHEMA);
  assert.equal(sodiumWaterLawGraph.dispatchQueue.status, 'proxy-dispatch-ready-scientific-blocked');
  assert.equal(sodiumWaterLawGraph.dispatchQueue.proxyConverged, true);
  assert.ok(sodiumWaterLawGraph.dispatchQueue.readyEntryCount > 0);
  assert.equal(sodiumWaterLawGraph.dispatchQueue.partialProxyReadyCount, 0);
  assert.ok(sodiumWaterLawGraph.dispatchQueue.computeManagerReadyCount > 0);
  assert.ok(sodiumWaterLawGraph.dispatchQueue.nextQueueAction.startsWith('dispatch:op:'));
  assert.equal(sodiumWaterLawGraph.schedulerManifest.schema, MULTISCALE_LAW_GRAPH_SCHEDULER_MANIFEST_SCHEMA);
  assert.equal(sodiumWaterLawGraph.schedulerManifest.status, 'proxy-scheduler-ready-scientific-blocked');
  assert.equal(sodiumWaterLawGraph.schedulerManifest.proxyConverged, true);
  assert.ok(sodiumWaterLawGraph.schedulerManifest.readyManifestEntryCount > 0);
  assert.ok(sodiumWaterLawGraph.schedulerManifest.schedulerReadyCount > 0);
  assert.equal(sodiumWaterLawGraph.schedulerManifest.unresolvedDescriptorCount, 0);
  assert.equal(sodiumWaterLawGraph.schedulerManifest.executorMissingCount, 0);
  assert.ok(sodiumWaterLawGraph.schedulerManifest.nextSchedulerAction.startsWith('schedule:'));
  assert.equal(sodiumWaterLawGraph.schedulerExecutionAudit.schema, MULTISCALE_LAW_GRAPH_SCHEDULER_EXECUTION_AUDIT_SCHEMA);
  assert.equal(sodiumWaterLawGraph.schedulerExecutionAudit.status, 'scheduler-execution-evidence-unavailable');
  assert.equal(sodiumWaterLawGraph.schedulerExecutionAudit.evidenceAvailable, false);
  assert.equal(sodiumWaterLawGraph.schedulerExecutionAudit.proxyConverged, true);
  assert.ok(sodiumWaterLawGraph.schedulerExecutionAudit.executionRequiredCount > 0);
  assert.equal(sodiumWaterLawGraph.resultAdmission.schema, MULTISCALE_LAW_GRAPH_RESULT_ADMISSION_SCHEMA);
  assert.equal(sodiumWaterLawGraph.resultAdmission.status, 'result-admission-evidence-unavailable');
  assert.equal(sodiumWaterLawGraph.resultAdmission.evidenceAvailable, false);
  assert.equal(sodiumWaterLawGraph.resultAdmission.proxyConverged, true);
  assert.ok(sodiumWaterLawGraph.resultAdmission.resultAdmissionRequiredCount > 0);
  assert.equal(sodiumWaterLawGraph.resultAdmission.proxyAdmittedCount, 0);
  assert.equal(sodiumWaterLawGraph.stateApplicationPreflight.schema, MULTISCALE_LAW_GRAPH_STATE_APPLICATION_PREFLIGHT_SCHEMA);
  assert.equal(sodiumWaterLawGraph.stateApplicationPreflight.status, 'state-application-evidence-unavailable');
  assert.equal(sodiumWaterLawGraph.stateApplicationPreflight.evidenceAvailable, false);
  assert.equal(sodiumWaterLawGraph.stateApplicationPreflight.proxyConverged, true);
  assert.ok(sodiumWaterLawGraph.stateApplicationPreflight.applicationPreflightRequiredCount > 0);
  assert.equal(sodiumWaterLawGraph.stateApplicationPreflight.proxyApplicationReadyCount, 0);
  assert.equal(sodiumWaterLawGraph.blockers.some((blocker) => blocker.id === 'constraint:qmat-reactive-chemistry'), false);
  assert.equal(sodiumWaterPotential.behaviorSurface.status, 'proxy-behavior-ready');
  assert.equal(sodiumWaterPotential.behaviorSurface.productStoichiometryAvailable, true);
  assert.equal(sodiumWaterPotential.behaviorSurface.productTopologyAvailable, true);
  assert.equal(sodiumWaterPotential.behaviorSurface.behaviorHooks.liveReactionPath, true);
  assert.equal(sodiumWaterPotential.closureResult.validity.status, 'property-ready-reduced-force-preview');
  assert.equal(sodiumWaterPotential.closureResult.conservation.reactionProductStoichiometryAvailable, true);
  assert.equal(sodiumWaterPotential.closureResult.conservation.reactionProductTopologyAvailable, true);
});

test('quantum material WebGPU batch updates shared statistical closure section', () => {
  const model = new MultiscaleModel();
  model.setEnvironment({
    ambientTemperatureK: 420,
    ambientPressurePa: 120000,
    oxygenFraction: 0.24,
    gravityMps2: 9.81
  });
  model.applyMolecularDynamicsResult({
    backend: 'test-molecular-dynamics',
    sequence: 1,
    diagnostics: {
      atomCount: 15,
      bondCount: 10,
      species: { H: 10, O: 5, other: 0 },
      molecularSpecies: { H2O: 5 },
      phaseFractions: { liquid: 1 },
      meanTemperatureK: 420,
      ionizationFraction: 0.01,
      reactionProgress: 0
    },
    state: { atomCount: 15 }
  });
  const initialPacket = model.update(0.1);
  const initialStatistical = initialPacket.upward.closureResults.quantumMaterialPotential.statistical;
  assert.equal(initialStatistical.schema, QUANTUM_STATISTICAL_CLOSURE_SCHEMA);
  assert.equal(initialStatistical.ensembleSchema, QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA);

  const batch = {
    schema: QUANTUM_MATERIAL_POTENTIAL_BATCH_SCHEMA,
    backend: 'webgpu-quantum-material-property-batch',
    recordCount: 96,
    meanDensityKgM3: 997,
    meanMechanicalResponsePa: 2.45e9,
    meanOpticalElectricalResponse: 2.1,
    meanBehaviorDrive: 0.22,
    meanForceGradientEvPerAngstrom: 1.6,
    responseDerivatives: {
      schema: QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA,
      status: 'webgpu-response-derivatives-ready',
      backend: 'webgpu-quantum-material-property-batch',
      recordCount: 96,
      meanDensityTemperatureDerivativeKgM3PerK: -0.012,
      meanMechanicalPressureDerivativePaPerLog2Pressure: 22000000,
      meanConductivityFieldDerivativeSpmPerNorm: 0.018,
      meanOpacityRadiationDerivativePerNorm: 0.04,
      jacobian: {
        densityKgM3: { temperatureK: -0.012 },
        mechanicalResponsePa: { log2PressureRatio: 22000000 },
        electricalConductivitySpm: { fieldDriveNorm: 0.018 },
        opacityProxy: { radiationNorm: 0.04 }
      }
    },
    forceSurfacePreview: {
      schema: QUANTUM_MATERIAL_FORCE_SURFACE_SCHEMA,
      status: 'batch-reduced-force-preview-ready',
      calibrated: false,
      bornOppenheimerForcesAvailable: false,
      reducedEnergyGradientAvailable: true,
      reactionBarrierSurfaceAvailable: false,
      productStoichiometryAvailable: false,
      recordCount: 96,
      bondRecordCount: 48,
      meanPotentialEnergyEv: -3.2,
      meanForceGradientEvPerAngstrom: 1.6,
      maxForceGradientEvPerAngstrom: 2.8,
      meanCurvatureEvPerAngstrom2: 0.7,
      meanUncertainty: 0.18
    },
    statisticalEnsemble: {
      schema: QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA,
      modelId: 'test-webgpu-qstat-ensemble',
      status: 'webgpu-ensemble-bridge-ready',
      backend: 'webgpu-quantum-material-property-batch',
      calibrated: false,
      firstPrinciplesUniversal: false,
      acceptableClosureIfLabeled: true,
      recordCount: 96,
      temperatureK: 420,
      pressurePa: 120000,
      partitionFunctionLog: 1.75,
      excitedStatePopulation: 0.08,
      ionizationFraction: 0.18,
      meanExcitationEnergyEv: 0.42,
      ensemblePressurePa: 132000,
      opacityProxy: 0.42,
      degeneracyParameter: 0.14,
      degeneracyRegime: 'partially-degenerate',
      heatCapacityProxy: 1.8,
      source: {
        hamiltonian: 'test-hamiltonian',
        distribution: 'reduced-boltzmann-saha-degeneracy'
      },
      closureOutputs: {
        pressurePa: 132000,
        opacityProxy: 0.42,
        ionizationFraction: 0.18,
        degeneracyParameter: 0.14,
        degeneracyRegime: 'partially-degenerate',
        heatCapacityProxy: 1.8
      }
    }
  };

  model.applyQuantumMaterialPotentialResult({
    schema: QUANTUM_MATERIAL_POTENTIAL_RESULT_SCHEMA,
    ok: true,
    status: 'webgpu-executed',
    backend: 'webgpu-quantum-material-property-batch',
    sequence: 3,
    potential: {
      schema: QUANTUM_MATERIAL_POTENTIAL_SCHEMA,
      materialId: 'water.h2o.reference-eos-v0',
      elementSymbol: 'O',
      dominantFormula: 'H2O'
    },
    batch,
    diagnostics: { batch }
  });
  const packet = model.createPacket();
  const statistical = packet.upward.closureResults.quantumMaterialPotential.statistical;
  assert.equal(statistical.schema, QUANTUM_STATISTICAL_CLOSURE_SCHEMA);
  assert.equal(statistical.ensembleSchema, QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA);
  assert.equal(statistical.modelId, 'test-webgpu-qstat-ensemble');
  assert.equal(statistical.backend, 'webgpu-quantum-material-property-batch');
  assert.equal(statistical.ensemblePressurePa, 132000);
  assert.equal(statistical.pressureRatio, 1.1);
  assert.equal(statistical.opacityProxy, 0.42);
  assert.equal(statistical.ionizationFraction, 0.18);
  assert.equal(statistical.degeneracyParameter, 0.14);
  assert.equal(statistical.degeneracyRegime, 'partially-degenerate');
  assert.equal(statistical.heatCapacityProxy, 1.8);
  assert.equal(statistical.sourceEquation.schema, QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA);
  assert.equal(statistical.sourceEquation.adapterSchema, MOLECULAR_SOURCE_EQUATION_SCHEMA);
  assert.equal(statistical.sourceEquation.channelCount, 5);
  assert.equal(statistical.sourceTerms.heatCapacityProxy, 1.8);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.concurrentStatisticalClosure.schema, QUANTUM_STATISTICAL_CLOSURE_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.concurrentStatisticalClosure.backend, 'webgpu-quantum-material-property-batch');
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.concurrentResponseDerivatives.schema, QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA);
  assert.equal(packet.upward.aggregateState.quantumMaterialPotential.concurrentResponseDerivatives.meanMechanicalPressureDerivativePaPerLog2Pressure, 22000000);
});

test('quantum material potential worker is WebGPU-only and blocks no-adapter runs', async () => {
  resetQuantumMaterialPotential();
  const environment = {
    ambientTemperatureK: 640,
    ambientPressurePa: 202650,
    oxygenFraction: 0.27,
    gravityMps2: 9.81,
    electricFieldVm: 2.5e6,
    magneticFieldT: 0.08,
    radiativeHeatFlux: 1500
  };
  const quantumOrbital = createQuantumOrbitalClosure({
    orbital: { elementSymbol: 'O', principalN: 2, angularL: 1, magneticM: 0, finiteGridSize: 10 },
    environment,
    molecularDynamics: { meanTemperatureK: 640, ionizationFraction: 0.08 },
    timeSeconds: 1
  });
  const molecularDynamics = {
    atomCount: 15,
    species: { H: 10, O: 5, other: 0 },
    molecularSpecies: { H2O: 5 },
    phaseFractions: { liquid: 0.7, vapor: 0.3 },
    meanTemperatureK: 640,
    ionizationFraction: 0.08,
    reactionProgress: 0.12
  };
  const referencePotential = createQuantumMaterialPotential({
    quantumOrbital,
    environment,
    molecularDynamics,
    timeSeconds: 1
  });
  const records = createQuantumMaterialBatchRecords(referencePotential, 96);
  assert.equal(records.length, 96);
  assert.ok(records.some((record) => record.kind === 'bond'));
  const shaderSource = getQuantumMaterialPotentialShaderSource();
  assert.match(shaderSource, /\blet\s+partitionFn\b/);
  assert.match(shaderSource, /outputs\[index \* 6u \+ 4u\]/);
  assert.match(shaderSource, /outputs\[index \* 6u \+ 5u\]/);
  assert.match(shaderSource, /\bdensityTemperatureDerivative\b/);
  assert.doesNotMatch(shaderSource, /outputs\[index \* 5u \+/);
  assert.doesNotMatch(shaderSource, /\blet\s+partition\b/);
  assert.doesNotMatch(shaderSource, /\$\{WORKGROUP_SIZE\}/);

  const result = await stepQuantumMaterialPotential({
    solver: { id: 'quantum-material-potential' },
    input: {
      taskId: 'qmat:direct',
      stateKey: 'qmat:direct',
      scope: 'test-deltas',
      emitCommitDelta: true,
      sampleCount: 96,
      environment,
      quantumOrbital,
      molecularDynamics,
      timeSeconds: 1
    }
  });

  assert.equal(result.value.schema, QUANTUM_MATERIAL_POTENTIAL_RESULT_SCHEMA);
  assert.equal(result.value.ok, false);
  assert.equal(result.value.status, 'blocked-webgpu-unavailable');
  assert.equal(result.value.backend, 'webgpu-unavailable');
  assert.equal(result.value.liveBackendPolicy, QUANTUM_MATERIAL_POTENTIAL_LIVE_BACKEND_POLICY);
  assert.equal(result.value.potential.schema, QUANTUM_MATERIAL_POTENTIAL_SCHEMA);
  assert.equal(result.value.potential.materialId, 'water.h2o.reference-eos-v0');
  assert.equal(result.value.batch, null);
  assert.equal(result.value.diagnostics.batch, null);
  assert.equal(result.value.webgpuStatus.schema, QUANTUM_MATERIAL_POTENTIAL_WEBGPU_SCHEMA);
  assert.equal(result.value.webgpuStatus.liveBackendPolicy, QUANTUM_MATERIAL_POTENTIAL_LIVE_BACKEND_POLICY);
  assert.equal(result.value.webgpuStatus.recordCount, 96);
  assert.match(result.value.webgpuStatus.reason, /WebGPU|navigator\.gpu|no CPU fallback/i);
  assert.equal(result.value.potential.lawGraphFragment.schema, QUANTUM_MATERIAL_LAW_GRAPH_FRAGMENT_SCHEMA);
  assert.equal(result.value.conservation.mode, 'blocked-webgpu-only-property-evaluation');
  assert.equal(result.value.conservation.reducedEnergyGradientAvailable, false);
  assert.equal(result.value.conservation.statisticalEnsembleBridgeAvailable, false);
  assert.equal(result.value.conservation.ensembleBridgeMutatesState, false);
  assert.equal(result.commitDelta.payload.schema, QUANTUM_MATERIAL_POTENTIAL_DELTA_SCHEMA);
  assert.equal(result.commitDelta.payload.status, 'blocked-webgpu-unavailable');
  assert.equal(result.commitDelta.payload.liveBackendPolicy, QUANTUM_MATERIAL_POTENTIAL_LIVE_BACKEND_POLICY);
  assert.equal(result.commitDelta.payload.batch, null);
  assert.equal(result.commitDelta.payload.diagnostics.batch, null);
  assert.equal(result.commitDelta.payload.webgpuStatus.schema, QUANTUM_MATERIAL_POTENTIAL_WEBGPU_SCHEMA);
});

test('molecular dynamics consumes quantum orbital closure as bottom-up coupling', async () => {
  resetMolecularDynamics();
  const model = new MultiscaleModel();
  model.setEnvironment({ ambientTemperatureK: 360, ambientPressurePa: 101325, oxygenFraction: 0.24 });
  const oxygenClosure = createQuantumOrbitalClosure({
    orbital: { elementSymbol: 'O', principalN: 2, angularL: 1, magneticM: 0, finiteGridSize: 12 },
    environment: model.environment,
    molecularDynamics: { meanTemperatureK: 360, ionizationFraction: 0.04 },
    timeSeconds: 1.25
  });
  const quantumCoupling = normalizeMolecularQuantumCoupling(oxygenClosure.closureResult);
  assert.equal(quantumCoupling.schema, MOLECULAR_QUANTUM_COUPLING_SCHEMA);
  assert.equal(quantumCoupling.active, true);
  assert.equal(quantumCoupling.elementSymbol, 'O');
  assert.equal(quantumCoupling.wavefunctionEvolutionSchema, QUANTUM_ORBITAL_WAVEFUNCTION_EVOLUTION_SCHEMA);
  assert.equal(quantumCoupling.wavefunctionEvolutionSource, 'cpu-reference');
  assert.ok(Number.isFinite(quantumCoupling.wavefunctionEvolutionNormDrift));
  assert.ok(Number.isFinite(quantumCoupling.wavefunctionEvolutionDrive));
  assert.ok(quantumCoupling.wavefunctionEvolutionDrive > 0);

  const base = makeMolecularDynamicsInitialState({
    composition: { O: 5, H: 10 },
    seed: 909,
    environment: model.environment,
    coupling: { fireIntensity: 0.1, reactionProgress: 0.18 }
  });
  const uncoupled = await stepMolecularDynamics({
    stateKey: 'molecular:quantum:uncoupled',
    input: {
      stateKey: 'molecular:quantum:uncoupled',
      state: structuredClone(base),
      dt: 0.05,
      environment: model.environment,
      coupling: { fireIntensity: 0.1, reactionProgress: 0.18 },
      enableWebGPU: false
    }
  });
  const coupled = await stepMolecularDynamics({
    stateKey: 'molecular:quantum:coupled',
    input: {
      stateKey: 'molecular:quantum:coupled',
      state: structuredClone(base),
      dt: 0.05,
      environment: model.environment,
      coupling: {
        fireIntensity: 0.1,
        reactionProgress: 0.18,
        quantumOrbital: oxygenClosure,
        quantumOrbitalClosure: oxygenClosure.closureResult
      },
      enableWebGPU: false
    }
  });

  assert.equal(coupled.diagnostics.quantumCoupling.schema, MOLECULAR_QUANTUM_COUPLING_SCHEMA);
  assert.equal(coupled.diagnostics.quantumCouplingApplication.schema, MOLECULAR_QUANTUM_SOURCE_SCHEMA);
  assert.equal(coupled.diagnostics.quantumCouplingApplied, true);
  assert.equal(coupled.diagnostics.quantumCouplingApplicationMode, 'cpu-md-quantum-source-term');
  assert.equal(coupled.diagnostics.quantumCouplingWebgpuKernelApplied, false);
  assert.ok(coupled.diagnostics.quantumCouplingTemperatureDeltaK > 0);
  assert.equal(coupled.diagnostics.quantumCouplingElementSymbol, 'O');
  assert.equal(coupled.diagnostics.quantumCouplingMatchedAtomCount, 5);
  assert.ok(Number.isFinite(coupled.diagnostics.quantumElectronegativityShift));
  assert.ok(coupled.diagnostics.quantumBondOrderScale > 1);
  assert.equal(coupled.diagnostics.quantumCoupling.wavefunctionEvolutionSchema, QUANTUM_ORBITAL_WAVEFUNCTION_EVOLUTION_SCHEMA);
  assert.equal(coupled.diagnostics.quantumWavefunctionEvolutionSource, 'cpu-reference');
  assert.ok(Number.isFinite(coupled.diagnostics.quantumWavefunctionEvolutionNormDrift));
  assert.ok(Number.isFinite(coupled.diagnostics.quantumEvolutionDrive));
  assert.ok(coupled.diagnostics.quantumEvolutionDrive > 0);
  assert.equal(coupled.diagnostics.chargeEquilibration.schema, MOLECULAR_CHARGE_EQUILIBRATION_SCHEMA);
  assert.equal(coupled.diagnostics.chargeEquilibration.quantumCouplingApplied, true);
  assert.equal(coupled.diagnostics.chargeEquilibration.matchedQuantumAtomCount, 5);
  assert.ok(coupled.diagnostics.chargeEquilibration.quantumEvolutionDrive > 0);
  assert.ok(coupled.diagnostics.quantumCouplingConfidence > 0);
  assert.notEqual(coupled.diagnostics.meanAbsCharge, uncoupled.diagnostics.meanAbsCharge);
  assert.equal(coupled.conservation.quantumCouplingApplicationMode, 'cpu-md-quantum-source-term');
  assert.equal(coupled.conservation.quantumCouplingWebgpuKernelApplied, false);

  const molecular = model.applyMolecularDynamicsResult(coupled);
  const packet = model.createPacket();
  assert.equal(molecular.quantumCouplingApplied, true);
  assert.equal(molecular.quantumCouplingApplicationMode, 'cpu-md-quantum-source-term');
  assert.equal(molecular.quantumCouplingWebgpuKernelApplied, false);
  assert.ok(molecular.quantumEvolutionDrive > 0);
  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumCoupling.applied, true);
  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumCoupling.elementSymbol, 'O');
  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumCoupling.matchedAtomCount, 5);
  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumCoupling.wavefunctionEvolutionSchema, QUANTUM_ORBITAL_WAVEFUNCTION_EVOLUTION_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumCouplingApplied, true);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumCouplingApplicationMode, 'cpu-md-quantum-source-term');
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumCouplingWebgpuKernelApplied, false);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumCouplingElementSymbol, 'O');
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumCouplingMatchedAtomCount, 5);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumEvolutionDrive > 0);
  assert.equal(packet.upward.closures.molecularQuantumMatchedAtoms, 5);
  assert.equal(packet.upward.closures.molecularQuantumApplicationMode, 'cpu-md-quantum-source-term');
  assert.equal(packet.upward.closures.molecularQuantumWebgpuKernelApplied, 0);
  assert.equal(typeof packet.upward.closures.molecularQuantumChargeBias, 'number');
  assert.equal(typeof packet.upward.closures.molecularQuantumEvolutionDrive, 'number');
});

function createTestWaterQmatBatchWithBarrier({
  productStoichiometryAvailable = false,
  productTopologyAvailable = productStoichiometryAvailable
} = {}) {
  const productTopology = productStoichiometryAvailable && productTopologyAvailable ? {
    schema: QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA,
    modelId: 'test-qmat-reduced-naoh-h2-product-topology-v0',
    status: 'reduced-product-topology-ready',
    calibrated: false,
    webgpuDerived: true,
    reactionId: 'na-h2o-to-naoh-h2-reduced-stoichiometry',
    topologyMode: 'reduced-bond-graph-overlay',
    authoritativeAtomMutationReady: false,
    conservativeTopologyMutation: false,
    reducedBondGraphOverlayAvailable: true,
    reactionSiteCount: 2,
    maxReactionSiteCount: 2,
    products: [
      { formula: 'NaOH', moleculeType: 'sodium-hydroxide', atomCounts: { Na: 1, O: 1, H: 1 }, expectedBondCount: 2 },
      { formula: 'H2', moleculeType: 'hydrogen', atomCounts: { H: 2 }, expectedBondCount: 1, moleculeFractionPerNa: 0.5 }
    ],
    productBonds: [
      { productFormula: 'NaOH', pairLabel: 'Na-O', elements: ['Na', 'O'], order: 0.72, bondClass: 'ionic', targetDistanceReducedNm: 0.24 },
      { productFormula: 'NaOH', pairLabel: 'O-H', elements: ['O', 'H'], order: 0.96, bondClass: 'polar-covalent', targetDistanceReducedNm: 0.096 },
      { productFormula: 'H2', pairLabel: 'H-H', elements: ['H', 'H'], order: 1, bondClass: 'covalent', targetDistanceReducedNm: 0.074 }
    ]
  } : null;
  const productStoichiometry = productStoichiometryAvailable ? {
    schema: 'peercompute.multiscale.quantum-material-product-stoichiometry.v0',
    modelId: 'test-reduced-na-water-product-stoichiometry-v0',
    status: 'reduced-product-stoichiometry-ready',
    calibrated: false,
    reactionId: 'na-h2o-to-naoh-h2-reduced-stoichiometry',
    reactants: { Na: 1, H2O: 1 },
    products: { NaOH: 1, H2: 0.5 },
    integerReaction: {
      reactants: { Na: 2, H2O: 2 },
      products: { NaOH: 2, H2: 1 }
    },
    limitingReactant: 'Na',
    limitingExtentMoleculeCount: 1,
    waterCount: 5,
    sodiumCount: 1,
    chargeTransferElectronCount: 1,
    gasProductFormula: 'H2',
    gasProductMoleculeFractionPerNa: 0.5,
    enthalpyDeltaKjPerMolNaProxy: -184,
    heatReleaseEvPerNaProxy: 1.9,
    heatReleaseProxy: 0.34,
    chargeDeltaProxy: 0.024,
    extentProxy: 0.18,
    topologyProductAvailable: productTopologyAvailable,
    productTopologySchema: productTopology?.schema || null,
    productTopologyModelId: productTopology?.modelId || null,
    productTopology,
    productTopologyRequired: true
  } : null;
  return {
    schema: QUANTUM_MATERIAL_POTENTIAL_BATCH_SCHEMA,
    backend: 'webgpu-quantum-material-property-batch',
    recordCount: 96,
    meanBehaviorDrive: 2.4,
    meanForceGradientEvPerAngstrom: 1.6,
    maxForceGradientEvPerAngstrom: 2.8,
    meanCurvatureEvPerAngstrom2: 0.7,
    meanForceSurfaceUncertainty: 0.18,
    forceSurfacePreview: {
      schema: QUANTUM_MATERIAL_FORCE_SURFACE_SCHEMA,
      status: 'batch-reduced-force-preview-ready',
      calibrated: false,
      bornOppenheimerForcesAvailable: false,
      reducedEnergyGradientAvailable: true,
      reactionBarrierSurfaceAvailable: true,
      productStoichiometryAvailable,
      recordCount: 96,
      bondRecordCount: 48,
      meanPotentialEnergyEv: -3.2,
      meanForceGradientEvPerAngstrom: 1.6,
      maxForceGradientEvPerAngstrom: 2.8,
      meanCurvatureEvPerAngstrom2: 0.7,
      meanUncertainty: 0.18
    },
    statisticalEnsemble: {
      schema: QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA,
      status: 'webgpu-ensemble-bridge-ready',
      backend: 'webgpu-quantum-material-property-batch',
      recordCount: 96,
      ionizationFraction: 0.18,
      opacityProxy: 0.42,
      degeneracyParameter: 0.14,
      ensemblePressurePa: 101900,
      heatCapacityProxy: 1.8
    },
    responseDerivatives: {
      schema: QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA,
      modelId: 'test-webgpu-condition-response-derivatives-v0',
      status: 'webgpu-response-derivatives-ready',
      backend: 'webgpu-quantum-material-property-batch',
      recordCount: 96,
      meanDensityTemperatureDerivativeKgM3PerK: -0.014,
      meanMechanicalPressureDerivativePaPerLog2Pressure: 3.1e7,
      meanConductivityFieldDerivativeSpmPerNorm: 0.028,
      meanOpacityRadiationDerivativePerNorm: 0.04,
      jacobian: {
        densityKgM3: { temperatureK: -0.014 },
        mechanicalResponsePa: { log2PressureRatio: 3.1e7 },
        electricalConductivitySpm: { fieldDriveNorm: 0.028 },
        opacityProxy: { radiationNorm: 0.04 }
      }
    },
    molecularGeometrySource: {
      schema: QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA,
      modelId: 'test-webgpu-qmat-water-geometry-source-v0',
      status: 'webgpu-geometry-source-ready',
      backend: 'webgpu-quantum-material-property-batch',
      calibrated: false,
      targetMolecule: 'H2O',
      targetFormula: 'H2O',
      targetPairLabel: 'O-H',
      targetAngleDeg: 104.52,
      targetAngleCos: Math.cos(104.52 * Math.PI / 180),
      targetOhDistanceAngstrom: 0.96,
      targetOhDistanceReducedNm: 0.096,
      targetHhDistanceAngstrom: 1.514,
      targetHhDistanceReducedNm: 0.1514,
      distanceStiffnessProxy: 1.18,
      angleStiffnessProxy: 1.12,
      confidence: 0.84,
      sourceRecordCount: 96,
      bondRecordCount: 48,
      geometryRecordCount: 24
    },
    electronicChargeSource: {
      schema: QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA,
      modelId: 'test-webgpu-qmat-electronic-charge-source-v0',
      status: 'webgpu-electronic-charge-source-ready',
      backend: 'webgpu-quantum-material-property-batch',
      calibrated: false,
      webgpuDerived: true,
      sourceRecordCount: 96,
      atomLikeRecordCount: 48,
      pairRecordCount: 24,
      targetPairLabel: 'O-H',
      electronDonorElementZ: 1,
      electronDonorElementSymbol: 'H',
      electronAcceptorElementZ: 8,
      electronAcceptorElementSymbol: 'O',
      meanElectronegativityProxy: 2.82,
      meanHardnessProxyEv: 8.4,
      meanPairElectronegativityDeltaProxy: 1.24,
      donorDriveProxy: 0.2,
      acceptorDriveProxy: 0.88,
      chargeTransferPotentialProxy: 0.42,
      chargeDeltaProxy: 0.035,
      ionizationDriveProxy: 0.11,
      chargeMobilityProxy: 0.24,
      hardnessSofteningProxy: 0.08,
      screeningDampingScale: 0.96,
      qeqMixProxy: 0.16,
      confidence: 0.82
    },
    reactionBarrierSurface: {
      schema: QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA,
      modelId: 'test-webgpu-qmat-reaction-barrier-surface-v0',
      status: productStoichiometryAvailable ? 'reduced-product-stoichiometry-ready' : 'webgpu-reaction-barrier-proxy-ready',
      backend: 'webgpu-quantum-material-property-batch',
      calibrated: false,
      webgpuDerived: true,
      barrierAvailable: true,
      productStoichiometryAvailable,
      productTopologyAvailable,
      productStoichiometry,
      productTopology,
      chargeTransferRequired: true,
      targetReactionId: productStoichiometryAvailable
        ? 'na-h2o-to-naoh-h2-reduced-stoichiometry'
        : 'water-charge-transfer-product-gate-proxy',
      targetPairLabel: productStoichiometryAvailable ? 'Na-H2O' : 'O-H',
      reactantBasis: productStoichiometryAvailable ? ['Na', 'H2O'] : ['O', 'H'],
      productBasis: productStoichiometryAvailable ? ['NaOH', 'H2'] : [],
      activationEnergyEvProxy: 0.62,
      reactionProbabilityProxy: 0.18,
      reactionCoordinateForceProxy: 1.6,
      reactionCoordinateCurvatureProxy: 0.7,
      chargeTransferGateProxy: 0.33,
      gateDampingScale: productStoichiometryAvailable ? 0.82 : 0.62,
      reactionBarrierGateProxy: productStoichiometryAvailable ? 0.18 : 0.38,
      unsupportedProductBlockerCount: productStoichiometryAvailable ? 0 : 1,
      productHeatReleaseEvPerNaProxy: productStoichiometry?.heatReleaseEvPerNaProxy || 0,
      productHeatReleaseProxy: productStoichiometry?.heatReleaseProxy || 0,
      productChargeDeltaProxy: productStoichiometry?.chargeDeltaProxy || 0,
      productExtentProxy: productStoichiometry?.extentProxy || 0,
      productGasFormula: productStoichiometry?.gasProductFormula || null,
      productGasMoleculeFractionPerNa: productStoichiometry?.gasProductMoleculeFractionPerNa || 0,
      productChargeTransferElectronCount: productStoichiometry?.chargeTransferElectronCount || 0,
      productEnthalpyDeltaKjPerMolNaProxy: productStoichiometry?.enthalpyDeltaKjPerMolNaProxy || 0,
      productTopologySchema: productTopology?.schema || null,
      productTopologyModelId: productTopology?.modelId || null,
      productTopologyMode: productTopology?.topologyMode || null,
      productTopologyReactionSiteCount: productTopology?.reactionSiteCount || 0,
      productTopologyReducedBondCount: productTopology?.productBonds?.length || 0,
      confidence: 0.79
    },
    propertyResponse: {
      schema: QUANTUM_MATERIAL_PROPERTY_RESPONSE_SCHEMA,
      status: 'webgpu-property-response-ready',
      backend: 'webgpu-quantum-material-property-batch',
      recordCount: 96,
      meanDensityKgM3: 997,
      meanMechanicalResponsePa: 2.45e9,
      meanBulkModulusPa: 2.2e9,
      meanYoungsModulusPa: 1.1e9,
      meanElectricalConductivitySpm: 0.085,
      meanRefractiveIndex: 1.333,
      meanDielectricConstant: 1.776,
      meanOpticalAbsorptionProxy: 0.42,
      responseDerivatives: {
        schema: QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA,
        meanDensityTemperatureDerivativeKgM3PerK: -0.014,
        meanMechanicalPressureDerivativePaPerLog2Pressure: 3.1e7,
        meanConductivityFieldDerivativeSpmPerNorm: 0.028,
        meanOpacityRadiationDerivativePerNorm: 0.04
      }
    }
  };
}

function createTestWaterQuantumMaterialPotential(qmatBatch = createTestWaterQmatBatchWithBarrier()) {
  return {
    schema: QUANTUM_MATERIAL_POTENTIAL_SCHEMA,
    materialId: 'water.h2o.reference-eos-v0',
    elementSymbol: 'O',
    dominantFormula: 'H2O',
    concurrentBatch: qmatBatch,
    concurrentForceSurfacePreview: qmatBatch.forceSurfacePreview,
    concurrentStatisticalEnsemble: qmatBatch.statisticalEnsemble,
    concurrentBackend: qmatBatch.backend,
    concurrentRecordCount: qmatBatch.recordCount,
    concurrentBehaviorDrive: qmatBatch.meanBehaviorDrive,
    concurrentForceGradientEvPerAngstrom: qmatBatch.meanForceGradientEvPerAngstrom
  };
}

test('molecular dynamics consumes quantum material force surface as lower-layer source', async () => {
  resetMolecularDynamics();
  const model = new MultiscaleModel();
  model.setEnvironment({ ambientTemperatureK: 335, ambientPressurePa: 101325, oxygenFraction: 0.24 });
  const base = makeMolecularDynamicsInitialState({
    composition: { O: 5, H: 10, Na: 1 },
    seed: 923,
    environment: model.environment,
    coupling: { fireIntensity: 0.04, reactionProgress: 0.1 }
  });
  const qmatBatch = createTestWaterQmatBatchWithBarrier();
  const quantumMaterialPotential = createTestWaterQuantumMaterialPotential(qmatBatch);

  const uncoupled = await stepMolecularDynamics({
    stateKey: 'molecular:qmat:uncoupled',
    input: {
      stateKey: 'molecular:qmat:uncoupled',
      state: structuredClone(base),
      dt: 0.05,
      environment: model.environment,
      coupling: { fireIntensity: 0.04, reactionProgress: 0.1 },
      enableWebGPU: false
    }
  });
  const coupled = await stepMolecularDynamics({
    stateKey: 'molecular:qmat:coupled',
    input: {
      stateKey: 'molecular:qmat:coupled',
      state: structuredClone(base),
      dt: 0.05,
      environment: model.environment,
      coupling: {
        fireIntensity: 0.04,
        reactionProgress: 0.1,
        quantumMaterialPotential
      },
      enableWebGPU: false
    }
  });

  assert.equal(coupled.diagnostics.quantumMaterialSource.schema, MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA);
  assert.equal(coupled.diagnostics.quantumMaterialSourceApplied, true);
  assert.equal(coupled.diagnostics.quantumMaterialSourceMode, 'cpu-md-quantum-material-source-term');
  assert.equal(coupled.diagnostics.quantumMaterialSourceWebgpuKernelApplied, false);
  assert.equal(coupled.diagnostics.quantumMaterialSourceBackend, 'webgpu-quantum-material-property-batch');
	  assert.equal(coupled.diagnostics.quantumMaterialSourceRecordCount, 96);
	  assert.equal(coupled.diagnostics.quantumMaterialSourceReducedEnergyGradientAvailable, true);
	  assert.equal(coupled.diagnostics.quantumMaterialSourceBornOppenheimerForcesAvailable, false);
	  assert.equal(coupled.diagnostics.quantumMaterialSourceReactionBarrierSurfaceAvailable, true);
	  assert.ok(coupled.diagnostics.quantumMaterialSourceBondOrderScale > 1);
	  assert.ok(coupled.diagnostics.quantumMaterialSourcePairForceScale > 1);
	  assert.ok(coupled.diagnostics.quantumMaterialSourceRestLengthDeltaAngstrom < 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourcePairForceMix > 0);
  assert.equal(coupled.diagnostics.quantumMaterialSourceTargetPairLabel, 'O-H');
  assert.equal(coupled.diagnostics.quantumMaterialSourcePrimaryElementZ, 8);
  assert.equal(coupled.diagnostics.quantumMaterialSourceSecondaryElementZ, 1);
  assert.equal(coupled.diagnostics.quantumMaterialSource.molecularGeometrySource.schema, QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA);
  assert.equal(coupled.diagnostics.quantumMaterialGeometrySourceApplied, true);
  assert.equal(coupled.diagnostics.quantumMaterialGeometrySourceSchema, QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA);
  assert.equal(coupled.diagnostics.quantumMaterialGeometrySourceModelId, 'test-webgpu-qmat-water-geometry-source-v0');
  assert.equal(coupled.diagnostics.quantumMaterialGeometryTargetSource, 'quantum-material-molecular-geometry-source');
  assert.equal(coupled.diagnostics.quantumMaterialGeometryTargetOhDistanceReducedNm, 0.096);
  assert.equal(coupled.diagnostics.quantumMaterialGeometryTargetHhDistanceReducedNm, 0.1514);
  assert.equal(coupled.diagnostics.quantumMaterialGeometryTargetAngleDeg, 104.52);
  assert.equal(coupled.diagnostics.quantumMaterialGeometrySourceConfidence, 0.84);
  assert.equal(coupled.diagnostics.quantumMaterialSource.electronicChargeSource.schema, QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA);
  assert.equal(coupled.diagnostics.quantumMaterialElectronicChargeSourceApplied, true);
  assert.equal(coupled.diagnostics.quantumMaterialElectronicChargeSourceSchema, QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA);
  assert.equal(coupled.diagnostics.quantumMaterialElectronicChargeSourceModelId, 'test-webgpu-qmat-electronic-charge-source-v0');
  assert.equal(coupled.diagnostics.quantumMaterialElectronicChargeTargetPairLabel, 'O-H');
  assert.equal(coupled.diagnostics.quantumMaterialElectronicChargeDeltaProxy, 0.035);
  assert.equal(coupled.diagnostics.quantumMaterialElectronicIonizationDriveProxy, 0.11);
  assert.equal(coupled.diagnostics.quantumMaterialElectronicChargeMobilityProxy, 0.24);
  assert.equal(coupled.diagnostics.quantumMaterialElectronicScreeningDampingScale, 0.96);
  assert.equal(coupled.diagnostics.quantumMaterialElectronicQeqMixProxy, 0.16);
  assert.equal(coupled.diagnostics.chargeEquilibration.quantumMaterialElectronicChargeSourceApplied, true);
	  assert.equal(coupled.diagnostics.chargeEquilibration.quantumMaterialElectronicChargeSourceSchema, QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA);
	  assert.ok(coupled.diagnostics.chargeEquilibration.quantumMaterialElectronicMatchedAtomCount > 0);
	  assert.ok(coupled.diagnostics.chargeEquilibration.quantumMaterialElectronicChargeDrive > 0);
	  assert.equal(coupled.diagnostics.quantumMaterialSource.reactionBarrierSurface.schema, QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA);
	  assert.equal(coupled.diagnostics.quantumMaterialReactionBarrierSurfaceApplied, true);
	  assert.equal(coupled.diagnostics.quantumMaterialReactionBarrierSurfaceSchema, QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA);
	  assert.equal(coupled.diagnostics.quantumMaterialReactionBarrierSurfaceModelId, 'test-webgpu-qmat-reaction-barrier-surface-v0');
	  assert.equal(coupled.diagnostics.quantumMaterialReactionBarrierTargetReactionId, 'water-charge-transfer-product-gate-proxy');
	  assert.equal(coupled.diagnostics.quantumMaterialReactionBarrierTargetPairLabel, 'O-H');
	  assert.equal(coupled.diagnostics.quantumMaterialReactionBarrierActivationEnergyEvProxy, 0.62);
	  assert.equal(coupled.diagnostics.quantumMaterialReactionBarrierProbabilityProxy, 0.18);
	  assert.equal(coupled.diagnostics.quantumMaterialReactionBarrierGateDampingScale, 0.62);
	  assert.equal(coupled.diagnostics.quantumMaterialReactionBarrierGateProxy, 0.38);
	  assert.equal(coupled.diagnostics.quantumMaterialReactionBarrierChargeTransferGateProxy, 0.33);
	  assert.equal(coupled.diagnostics.quantumMaterialReactionBarrierUnsupportedProductBlockerCount, 1);
	  assert.equal(coupled.diagnostics.quantumMaterialReactionBarrierProductStoichiometryAvailable, false);
	  assert.equal(coupled.diagnostics.quantumMaterialReactionBarrierChargeTransferRequired, true);
	  assert.equal(coupled.diagnostics.quantumMaterialReactionBarrierConfidence, 0.79);
	  assert.ok(Number.isFinite(coupled.diagnostics.reactionBarrierGatedCandidateCount));
	  assert.ok(Number.isFinite(coupled.diagnostics.reactionBarrierMeanDamping));
	  assert.equal(coupled.diagnostics.molecularGeometryForceLaw.sourceApplied, true);
  assert.equal(coupled.diagnostics.molecularGeometryForceLaw.sourceSchema, QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA);
  assert.equal(coupled.diagnostics.molecularGeometryForceLaw.targetSource, 'quantum-material-molecular-geometry-source');
  assert.equal(coupled.diagnostics.waterGeometrySourceApplied, true);
  assert.equal(coupled.diagnostics.waterGeometrySourceSchema, QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA);
  assert.equal(coupled.diagnostics.waterGeometryTargetSource, 'quantum-material-molecular-geometry-source');
  assert.equal(coupled.diagnostics.waterGeometryTargetOhDistanceReducedNm, 0.096);
  assert.equal(coupled.diagnostics.waterGeometryTargetAngleDeg, 104.52);
  assert.ok(coupled.diagnostics.quantumMaterialSourcePairSelectivity > 0.55);
  assert.ok(coupled.diagnostics.quantumMaterialSourcePairFallbackFactor < 0.35);
  assert.equal(coupled.diagnostics.quantumMaterialSourceTargetAtomCount, 15);
  assert.equal(coupled.diagnostics.quantumMaterialSourceTargetFallbackAtomCount, 1);
  assert.ok(coupled.diagnostics.quantumMaterialSourceTargetAtomWeightedFactorSum < coupled.state.atomCount);
  assert.ok(coupled.diagnostics.quantumMaterialSourceTargetAtomMeanFactor > 0.9);
  assert.ok(coupled.diagnostics.quantumMaterialSourceTargetAtomMeanFactor < 1);
  assert.ok(coupled.diagnostics.quantumMaterialSourceTargetPairCandidateCount > 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourceTargetPairSelectedCount > 0);
  assert.ok(
    coupled.diagnostics.quantumMaterialSourceTargetPairSelectedCount
      < coupled.diagnostics.quantumMaterialSourceTargetPairCandidateCount
  );
  assert.ok(coupled.diagnostics.quantumMaterialSourceTargetPairMeanFactor > coupled.diagnostics.quantumMaterialSourcePairFallbackFactor);
  assert.equal(coupled.diagnostics.forceFieldQuantumMaterialTargetPairCount, coupled.diagnostics.forceEnergyLedger.quantumMaterialTargetPairCount);
  assert.ok(coupled.diagnostics.forceFieldQuantumMaterialTargetPairCount > 0);
  assert.ok(coupled.diagnostics.forceFieldQuantumMaterialMeanPairFactor > 0);
  assert.equal(coupled.diagnostics.forceFieldForceLawSchema, MOLECULAR_FORCE_LAW_SCHEMA);
  assert.equal(coupled.diagnostics.forceFieldForceLawModelId, 'element-aware-covalent-radius-affinity-v0');
  assert.ok(coupled.diagnostics.forceFieldMeanPairRestLengthReducedNm > 0.1);
  assert.ok(coupled.diagnostics.forceFieldMeanPairAffinity > 0.5);
  assert.ok(coupled.diagnostics.forceFieldPolarPairCandidateCount > 0);
  assert.ok(coupled.diagnostics.forceEnergyLedger.forceLaw.meanPairRestLengthReducedNm > 0.1);
  assert.equal(coupled.diagnostics.forceFieldQuantumMaterialTargetAtomCount, 15);
  assert.equal(coupled.diagnostics.forceFieldQuantumMaterialFallbackAtomCount, 1);
  assert.ok(coupled.diagnostics.forceFieldQuantumMaterialMeanAtomFactor < 1);
  assert.ok(coupled.diagnostics.quantumMaterialSourceTemperatureDeltaK > 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourceChargeDeltaProxy > 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourceEnsemblePressurePa > model.environment.ambientPressurePa);
  assert.ok(coupled.diagnostics.quantumMaterialSourceEnsemblePressureRatio > 1);
  assert.ok(coupled.diagnostics.quantumMaterialSourceEnsemblePressureDrive > 0);
  assert.equal(coupled.diagnostics.quantumMaterialSourceStatisticalSourceEquation.schema, QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA);
  assert.equal(coupled.diagnostics.quantumMaterialSourceStatisticalSourceEquation.adapterSchema, MOLECULAR_SOURCE_EQUATION_SCHEMA);
  assert.equal(coupled.diagnostics.quantumMaterialSourceStatisticalSourceEquation.source.ensembleSchema, QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA);
  assert.equal(coupled.diagnostics.quantumMaterialSourceStatisticalSourceChannelCount, 5);
  assert.ok(coupled.diagnostics.quantumMaterialSourceStatisticalSourceEquation.channels.some((channel) => channel.id === 'ensemble-pressure'));
  assert.ok(coupled.diagnostics.quantumMaterialSourceStatisticalSourceEquation.channels.some((channel) => channel.id === 'opacity-population'));
  assert.ok(coupled.diagnostics.quantumMaterialSourceStatisticalSourceEquation.channels.some((channel) => channel.id === 'degeneracy-pressure'));
  assert.ok(coupled.diagnostics.quantumMaterialSourceStatisticalPressureDriveProxy > 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourceStatisticalOpacityDriveProxy > 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourceStatisticalIonizationDriveProxy > 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy > 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourceStatisticalTemperatureDeltaKProxy > 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourceStatisticalChargeDeltaProxy > 0);
  assert.equal(coupled.diagnostics.quantumMaterialSourceHeatCapacityProxy, 1.8);
  assert.ok(coupled.diagnostics.quantumMaterialSourceThermalDampingScale > 1);
  assert.equal(coupled.diagnostics.quantumMaterialSourcePropertyResponse.schema, QUANTUM_MATERIAL_PROPERTY_RESPONSE_SCHEMA);
  assert.equal(coupled.diagnostics.quantumMaterialSourceResponseDerivatives.schema, QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA);
  assert.equal(coupled.diagnostics.quantumMaterialSourceResponseDerivativesSchema, QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA);
  assert.equal(coupled.diagnostics.quantumMaterialSourceDensityTemperatureDerivativeKgM3PerK, -0.014);
  assert.equal(coupled.diagnostics.quantumMaterialSourceMechanicalPressureDerivativePaPerLog2Pressure, 3.1e7);
  assert.equal(coupled.diagnostics.quantumMaterialSourceConductivityFieldDerivativeSpmPerNorm, 0.028);
  assert.equal(coupled.diagnostics.quantumMaterialSourceOpacityRadiationDerivativePerNorm, 0.04);
  assert.ok(coupled.diagnostics.quantumMaterialSourceResponseDerivativeTemperatureDrive > 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourceResponseDerivativePressureDrive > 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourceResponseDerivativeFieldDrive > 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourceResponseDerivativeRadiationDrive > 0);
  assert.equal(coupled.diagnostics.quantumMaterialSourceElectricalConductivitySpm, 0.085);
  assert.equal(coupled.diagnostics.quantumMaterialSourceDielectricConstant, 1.776);
  assert.equal(coupled.diagnostics.quantumMaterialSourceRefractiveIndex, 1.333);
  assert.equal(coupled.diagnostics.quantumMaterialSourceMechanicalResponsePa, 2.45e9);
  assert.equal(coupled.diagnostics.quantumMaterialSourceBulkModulusPa, 2.2e9);
  assert.equal(coupled.diagnostics.quantumMaterialSourceYoungsModulusPa, 1.1e9);
  assert.ok(coupled.diagnostics.quantumMaterialSourceConductivityDrive > 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourceDielectricDrive > 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourceMechanicalStiffnessDrive > 0);
  assert.ok(coupled.diagnostics.quantumMaterialSourceOpticalAbsorptionDrive > 0);
  assert.ok(coupled.diagnostics.dielectricConstantProxy > 1);
  assert.ok(coupled.diagnostics.refractiveIndexProxy > 1);
  assert.ok(coupled.diagnostics.forceFieldQuantumMaterialEnsembleBiasEnergyProxy < 0);
  assert.ok(coupled.diagnostics.forceFieldQuantumMaterialPairForceBiasEnergyProxy < 0);
  assert.ok(coupled.diagnostics.forceFieldQuantumMaterialBiasEnergyProxy < 0);
  assert.equal(
    coupled.diagnostics.forceEnergyLedger.quantumMaterialPairForceBiasEnergyProxy,
    coupled.diagnostics.forceFieldQuantumMaterialPairForceBiasEnergyProxy
  );
  assert.notEqual(coupled.diagnostics.meanTemperatureK, uncoupled.diagnostics.meanTemperatureK);
  assert.notEqual(coupled.diagnostics.meanAbsCharge, uncoupled.diagnostics.meanAbsCharge);
  assert.notEqual(coupled.diagnostics.forceFieldTotalEnergyProxy, uncoupled.diagnostics.forceFieldTotalEnergyProxy);
  const qmatPositionDeltaRms = Math.sqrt(
    coupled.state.positionsX.reduce((sum, x, index) => {
      const dx = x - uncoupled.state.positionsX[index];
      const dy = coupled.state.positionsY[index] - uncoupled.state.positionsY[index];
      const dz = coupled.state.positionsZ[index] - uncoupled.state.positionsZ[index];
      return sum + dx * dx + dy * dy + dz * dz;
    }, 0) / Math.max(1, coupled.state.atomCount)
  );
  assert.ok(qmatPositionDeltaRms > 1e-9, `expected qmat pair-force path to move atoms, got ${qmatPositionDeltaRms}`);
  assert.equal(coupled.conservation.quantumMaterialSourceApplied, true);
  assert.equal(coupled.conservation.quantumMaterialSourceMode, 'cpu-md-quantum-material-source-term');
  assert.equal(coupled.conservation.quantumMaterialSourceWebgpuKernelApplied, false);
  assert.equal(coupled.conservation.quantumMaterialSourceRecordCount, 96);
  assert.ok(coupled.conservation.quantumMaterialSourcePairForceScale > 1);
  assert.ok(coupled.conservation.quantumMaterialSourceRestLengthDeltaAngstrom < 0);
  assert.ok(coupled.conservation.quantumMaterialSourcePairForceMix > 0);
  assert.equal(coupled.conservation.quantumMaterialSourceTargetPairLabel, 'O-H');
  assert.equal(coupled.conservation.quantumMaterialSourcePrimaryElementZ, 8);
  assert.equal(coupled.conservation.quantumMaterialSourceSecondaryElementZ, 1);
  assert.equal(coupled.conservation.quantumMaterialGeometrySourceApplied, true);
  assert.equal(coupled.conservation.quantumMaterialGeometrySourceSchema, QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA);
  assert.equal(coupled.conservation.quantumMaterialElectronicChargeSourceApplied, true);
  assert.equal(coupled.conservation.quantumMaterialElectronicChargeSourceSchema, QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA);
  assert.equal(coupled.conservation.quantumMaterialElectronicChargeSourceModelId, 'test-webgpu-qmat-electronic-charge-source-v0');
  assert.equal(coupled.conservation.quantumMaterialElectronicChargeDeltaProxy, 0.035);
  assert.equal(coupled.conservation.quantumMaterialElectronicIonizationDriveProxy, 0.11);
	  assert.equal(coupled.conservation.quantumMaterialElectronicChargeMobilityProxy, 0.24);
	  assert.equal(coupled.conservation.quantumMaterialElectronicScreeningDampingScale, 0.96);
	  assert.equal(coupled.conservation.quantumMaterialElectronicQeqMixProxy, 0.16);
	  assert.equal(coupled.conservation.quantumMaterialReactionBarrierSurfaceApplied, true);
	  assert.equal(coupled.conservation.quantumMaterialReactionBarrierSurfaceSchema, QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA);
	  assert.equal(coupled.conservation.quantumMaterialReactionBarrierSurfaceModelId, 'test-webgpu-qmat-reaction-barrier-surface-v0');
	  assert.equal(coupled.conservation.quantumMaterialReactionBarrierActivationEnergyEvProxy, 0.62);
	  assert.equal(coupled.conservation.quantumMaterialReactionBarrierGateDampingScale, 0.62);
	  assert.equal(coupled.conservation.quantumMaterialReactionBarrierGateProxy, 0.38);
	  assert.equal(coupled.conservation.quantumMaterialReactionBarrierUnsupportedProductBlockerCount, 1);
	  assert.equal(coupled.conservation.quantumMaterialReactionBarrierProductStoichiometryAvailable, false);
	  assert.equal(coupled.conservation.quantumMaterialReactionBarrierChargeTransferRequired, true);
	  assert.ok(Number.isFinite(coupled.conservation.reactionBarrierGatedCandidateCount));
	  assert.equal(coupled.conservation.waterGeometrySourceApplied, true);
  assert.equal(coupled.conservation.waterGeometryTargetSource, 'quantum-material-molecular-geometry-source');
  assert.equal(coupled.conservation.waterGeometryTargetOhDistanceReducedNm, 0.096);
  assert.ok(coupled.conservation.quantumMaterialSourcePairSelectivity > 0.55);
  assert.equal(coupled.conservation.quantumMaterialSourceTargetAtomCount, 15);
  assert.equal(coupled.conservation.quantumMaterialSourceTargetFallbackAtomCount, 1);
  assert.ok(coupled.conservation.quantumMaterialSourceTargetAtomMeanFactor < 1);
  assert.ok(coupled.conservation.quantumMaterialSourceTargetPairSelectedCount > 0);
  assert.ok(Number.isFinite(coupled.conservation.quantumMaterialPairForceBiasEnergyDelta));
  assert.ok(coupled.conservation.quantumMaterialSourceEnsemblePressureRatio > 1);
  assert.ok(coupled.conservation.quantumMaterialSourceEnsemblePressureDrive > 0);
  assert.equal(coupled.conservation.quantumMaterialSourceStatisticalSourceEquationSchema, QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA);
  assert.equal(coupled.conservation.quantumMaterialSourceStatisticalSourceChannelCount, 5);
  assert.ok(coupled.conservation.quantumMaterialSourceStatisticalPressureDriveProxy > 0);
  assert.ok(coupled.conservation.quantumMaterialSourceStatisticalOpacityDriveProxy > 0);
  assert.ok(coupled.conservation.quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy > 0);
  assert.equal(coupled.conservation.quantumMaterialSourceHeatCapacityProxy, 1.8);
  assert.ok(coupled.conservation.quantumMaterialSourceThermalDampingScale > 1);
  assert.equal(coupled.conservation.quantumMaterialSourceElectricalConductivitySpm, 0.085);
  assert.equal(coupled.conservation.quantumMaterialSourceDielectricConstant, 1.776);
  assert.equal(coupled.conservation.quantumMaterialSourceMechanicalResponsePa, 2.45e9);
  assert.equal(coupled.conservation.quantumMaterialSourceResponseDerivativesSchema, QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA);
  assert.equal(coupled.conservation.quantumMaterialSourceDensityTemperatureDerivativeKgM3PerK, -0.014);
  assert.equal(coupled.conservation.quantumMaterialSourceMechanicalPressureDerivativePaPerLog2Pressure, 3.1e7);
  assert.equal(coupled.conservation.quantumMaterialSourceConductivityFieldDerivativeSpmPerNorm, 0.028);
  assert.equal(coupled.conservation.quantumMaterialSourceOpacityRadiationDerivativePerNorm, 0.04);
  assert.ok(coupled.conservation.quantumMaterialSourceResponseDerivativeTemperatureDrive > 0);
  assert.ok(coupled.conservation.quantumMaterialSourceResponseDerivativePressureDrive > 0);
  assert.ok(coupled.conservation.quantumMaterialSourceResponseDerivativeFieldDrive > 0);
  assert.ok(coupled.conservation.quantumMaterialSourceResponseDerivativeRadiationDrive > 0);
  assert.ok(coupled.conservation.quantumMaterialSourceConductivityDrive > 0);
  assert.ok(coupled.conservation.quantumMaterialSourceDielectricDrive > 0);
  assert.ok(coupled.conservation.quantumMaterialSourceMechanicalStiffnessDrive > 0);
  assert.ok(coupled.conservation.quantumMaterialSourceOpticalAbsorptionDrive > 0);
  assert.ok(Number.isFinite(coupled.conservation.quantumMaterialEnsembleBiasEnergyDelta));
  assert.equal(coupled.conservation.forceFieldForceLawSchema, MOLECULAR_FORCE_LAW_SCHEMA);
  assert.ok(coupled.conservation.forceFieldMeanPairAffinity > 0.5);
  assert.ok(coupled.conservation.quantumMaterialSourceTemperatureDeltaK > 0);

  const molecular = model.applyMolecularDynamicsResult(coupled);
  const packet = model.createPacket();
  assert.equal(molecular.quantumMaterialSourceApplied, true);
  assert.equal(molecular.quantumMaterialSourceMode, 'cpu-md-quantum-material-source-term');
  assert.equal(molecular.quantumMaterialSourceRecordCount, 96);
  assert.ok(molecular.quantumMaterialSourcePairForceScale > 1);
  assert.ok(molecular.quantumMaterialSourceRestLengthDeltaAngstrom < 0);
  assert.ok(molecular.quantumMaterialSourcePairForceMix > 0);
  assert.equal(molecular.quantumMaterialSourceTargetPairLabel, 'O-H');
  assert.equal(molecular.quantumMaterialSourcePrimaryElementZ, 8);
  assert.equal(molecular.quantumMaterialSourceSecondaryElementZ, 1);
  assert.equal(molecular.quantumMaterialGeometrySourceApplied, true);
  assert.equal(molecular.quantumMaterialGeometrySourceSchema, QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA);
  assert.equal(molecular.quantumMaterialGeometryTargetSource, 'quantum-material-molecular-geometry-source');
  assert.equal(molecular.quantumMaterialElectronicChargeSourceApplied, true);
  assert.equal(molecular.quantumMaterialElectronicChargeSourceSchema, QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA);
	  assert.equal(molecular.quantumMaterialElectronicChargeDeltaProxy, 0.035);
	  assert.equal(molecular.quantumMaterialElectronicIonizationDriveProxy, 0.11);
	  assert.equal(molecular.quantumMaterialElectronicQeqMixProxy, 0.16);
	  assert.equal(molecular.quantumMaterialReactionBarrierSurfaceApplied, true);
	  assert.equal(molecular.quantumMaterialReactionBarrierSurfaceSchema, QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA);
	  assert.equal(molecular.quantumMaterialReactionBarrierSurfaceModelId, 'test-webgpu-qmat-reaction-barrier-surface-v0');
	  assert.equal(molecular.quantumMaterialReactionBarrierActivationEnergyEvProxy, 0.62);
	  assert.equal(molecular.quantumMaterialReactionBarrierGateDampingScale, 0.62);
	  assert.equal(molecular.quantumMaterialReactionBarrierGateProxy, 0.38);
	  assert.equal(molecular.quantumMaterialReactionBarrierUnsupportedProductBlockerCount, 1);
	  assert.equal(molecular.quantumMaterialReactionBarrierProductStoichiometryAvailable, false);
	  assert.equal(molecular.quantumMaterialReactionBarrierChargeTransferRequired, true);
	  assert.ok(Number.isFinite(molecular.reactionBarrierGatedCandidateCount));
	  assert.equal(molecular.waterGeometrySourceApplied, true);
  assert.equal(molecular.waterGeometryTargetSource, 'quantum-material-molecular-geometry-source');
  assert.equal(molecular.waterGeometryTargetOhDistanceReducedNm, 0.096);
  assert.ok(molecular.quantumMaterialSourcePairSelectivity > 0.55);
  assert.equal(molecular.quantumMaterialSourceTargetAtomCount, 15);
  assert.equal(molecular.quantumMaterialSourceTargetFallbackAtomCount, 1);
  assert.ok(molecular.quantumMaterialSourceTargetAtomMeanFactor < 1);
  assert.ok(molecular.quantumMaterialSourceTargetPairSelectedCount > 0);
  assert.equal(molecular.forceFieldForceLawSchema, MOLECULAR_FORCE_LAW_SCHEMA);
  assert.ok(molecular.forceFieldMeanPairRestLengthReducedNm > 0.1);
  assert.ok(molecular.forceFieldMeanPairAffinity > 0.5);
  assert.ok(molecular.forceFieldQuantumMaterialPairForceBiasEnergyProxy < 0);
  assert.ok(molecular.quantumMaterialSourceEnsemblePressureRatio > 1);
  assert.ok(molecular.quantumMaterialSourceEnsemblePressureDrive > 0);
  assert.equal(molecular.quantumMaterialSourceStatisticalSourceEquationSchema, QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA);
  assert.equal(molecular.quantumMaterialSourceStatisticalSourceChannelCount, 5);
  assert.ok(molecular.quantumMaterialSourceStatisticalPressureDriveProxy > 0);
  assert.ok(molecular.quantumMaterialSourceStatisticalOpacityDriveProxy > 0);
  assert.ok(molecular.quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy > 0);
  assert.equal(molecular.quantumMaterialSourceHeatCapacityProxy, 1.8);
  assert.ok(molecular.quantumMaterialSourceThermalDampingScale > 1);
  assert.equal(molecular.quantumMaterialSourceElectricalConductivitySpm, 0.085);
  assert.equal(molecular.quantumMaterialSourceDielectricConstant, 1.776);
  assert.equal(molecular.quantumMaterialSourceRefractiveIndex, 1.333);
  assert.equal(molecular.quantumMaterialSourceMechanicalResponsePa, 2.45e9);
  assert.equal(molecular.quantumMaterialSourceResponseDerivativesSchema, QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA);
  assert.equal(molecular.quantumMaterialSourceDensityTemperatureDerivativeKgM3PerK, -0.014);
  assert.equal(molecular.quantumMaterialSourceMechanicalPressureDerivativePaPerLog2Pressure, 3.1e7);
  assert.equal(molecular.quantumMaterialSourceConductivityFieldDerivativeSpmPerNorm, 0.028);
  assert.equal(molecular.quantumMaterialSourceOpacityRadiationDerivativePerNorm, 0.04);
  assert.ok(molecular.quantumMaterialSourceResponseDerivativeTemperatureDrive > 0);
  assert.ok(molecular.quantumMaterialSourceResponseDerivativePressureDrive > 0);
  assert.ok(molecular.quantumMaterialSourceResponseDerivativeFieldDrive > 0);
  assert.ok(molecular.quantumMaterialSourceResponseDerivativeRadiationDrive > 0);
  assert.ok(molecular.quantumMaterialSourceConductivityDrive > 0);
  assert.ok(molecular.quantumMaterialSourceDielectricDrive > 0);
  assert.ok(molecular.quantumMaterialSourceMechanicalStiffnessDrive > 0);
  assert.ok(molecular.quantumMaterialSourceOpticalAbsorptionDrive > 0);
  assert.ok(molecular.dielectricConstantProxy > 1);
  assert.ok(molecular.refractiveIndexProxy > 1);
  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumMaterialSource.schema, MOLECULAR_QUANTUM_MATERIAL_SOURCE_SCHEMA);
  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumMaterialSource.applied, true);
  assert.ok(model.state.closures.molecularDynamics.chemistry.quantumMaterialSource.pairForceScale > 1);
  assert.ok(model.state.closures.molecularDynamics.chemistry.quantumMaterialSource.ensemblePressureDrive > 0);
  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumMaterialSource.statisticalSourceEquation.schema, QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA);
  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumMaterialSource.targetPairLabel, 'O-H');
  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumMaterialSource.molecularGeometrySource.schema, QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA);
  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumMaterialSource.electronicChargeSource.schema, QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA);
	  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumMaterialElectronicChargeSourceApplied, true);
	  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumMaterialElectronicChargeSourceSchema, QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA);
	  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumMaterialElectronicChargeDeltaProxy, 0.035);
	  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumMaterialReactionBarrierSurfaceApplied, true);
	  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumMaterialReactionBarrierSurfaceSchema, QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA);
	  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialReactionBarrierSurfaceApplied, true);
	  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialReactionBarrierSurfaceSchema, QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA);
	  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialReactionBarrierGateDampingScale, 0.62);
	  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialElectronicChargeSourceSchema, QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA);
  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialElectronicChargeSourceApplied, true);
  assert.equal(model.state.closures.molecularDynamics.state.fields.waterGeometrySourceApplied, true);
  assert.equal(model.state.closures.molecularDynamics.state.fields.waterGeometryTargetSource, 'quantum-material-molecular-geometry-source');
  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialGeometrySourceSchema, QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA);
  assert.equal(model.state.closures.molecularDynamics.mechanics.bulkModulusPa, 2.2e9);
  assert.equal(model.state.closures.molecularDynamics.mechanics.youngsModulusPa, 1.1e9);
  assert.ok(model.state.closures.molecularDynamics.electromagnetics.dielectricConstant > 1);
  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialPropertyResponse.schema, QUANTUM_MATERIAL_PROPERTY_RESPONSE_SCHEMA);
  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialResponseDerivatives.schema, QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA);
  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialResponseDerivativesSchema, QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA);
  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialDensityTemperatureDerivativeKgM3PerK, -0.014);
  assert.ok(model.state.closures.molecularDynamics.state.fields.quantumMaterialConductivityDrive > 0);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceApplied, true);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceMode, 'cpu-md-quantum-material-source-term');
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceBackend, 'webgpu-quantum-material-property-batch');
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceRecordCount, 96);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourcePairForceScale > 1);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceRestLengthDeltaAngstrom < 0);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceTargetPairLabel, 'O-H');
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourcePrimaryElementZ, 8);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceSecondaryElementZ, 1);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialGeometrySourceApplied, true);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialGeometrySourceSchema, QUANTUM_MATERIAL_MOLECULAR_GEOMETRY_SOURCE_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialGeometryTargetSource, 'quantum-material-molecular-geometry-source');
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialElectronicChargeSourceApplied, true);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialElectronicChargeSourceSchema, QUANTUM_MATERIAL_ELECTRONIC_CHARGE_SOURCE_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialElectronicChargeSourceModelId, 'test-webgpu-qmat-electronic-charge-source-v0');
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialElectronicChargeTargetPairLabel, 'O-H');
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialElectronicChargeDeltaProxy, 0.035);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialElectronicIonizationDriveProxy, 0.11);
	  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialElectronicChargeMobilityProxy, 0.24);
	  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialElectronicScreeningDampingScale, 0.96);
	  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialElectronicQeqMixProxy, 0.16);
	  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionBarrierSurfaceApplied, true);
	  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionBarrierSurfaceSchema, QUANTUM_MATERIAL_REACTION_BARRIER_SURFACE_SCHEMA);
	  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionBarrierSurfaceModelId, 'test-webgpu-qmat-reaction-barrier-surface-v0');
	  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionBarrierActivationEnergyEvProxy, 0.62);
	  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionBarrierGateDampingScale, 0.62);
	  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionBarrierGateProxy, 0.38);
	  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionBarrierUnsupportedProductBlockerCount, 1);
	  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionBarrierProductStoichiometryAvailable, false);
	  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionBarrierChargeTransferRequired, true);
	  assert.ok(Number.isFinite(packet.upward.aggregateState.molecularDynamics.reactionBarrierGatedCandidateCount));
	  assert.equal(packet.upward.aggregateState.molecularDynamics.waterGeometrySourceApplied, true);
  assert.equal(packet.upward.aggregateState.molecularDynamics.waterGeometryTargetSource, 'quantum-material-molecular-geometry-source');
  assert.equal(packet.upward.aggregateState.molecularDynamics.waterGeometryTargetOhDistanceReducedNm, 0.096);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourcePairSelectivity > 0.55);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceTargetAtomCount, 15);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceTargetFallbackAtomCount, 1);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceTargetAtomMeanFactor < 1);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceTargetPairSelectedCount > 0);
  assert.equal(packet.upward.aggregateState.molecularDynamics.forceFieldForceLawSchema, MOLECULAR_FORCE_LAW_SCHEMA);
  assert.ok(packet.upward.aggregateState.molecularDynamics.forceFieldMeanPairRestLengthReducedNm > 0.1);
  assert.ok(packet.upward.aggregateState.molecularDynamics.forceFieldMeanPairAffinity > 0.5);
  assert.ok(packet.upward.aggregateState.molecularDynamics.forceFieldQuantumMaterialPairForceBiasEnergyProxy < 0);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceEnsemblePressureRatio > 1);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceEnsemblePressureDrive > 0);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceStatisticalSourceEquation.schema, QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceStatisticalSourceEquationSchema, QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceStatisticalSourceChannelCount, 5);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceStatisticalPressureDriveProxy > 0);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceStatisticalOpacityDriveProxy > 0);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy > 0);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceHeatCapacityProxy, 1.8);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceThermalDampingScale > 1);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceElectricalConductivitySpm, 0.085);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceDielectricConstant, 1.776);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceMechanicalResponsePa, 2.45e9);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceResponseDerivatives.schema, QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceResponseDerivativesSchema, QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceDensityTemperatureDerivativeKgM3PerK, -0.014);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceMechanicalPressureDerivativePaPerLog2Pressure, 3.1e7);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceConductivityFieldDerivativeSpmPerNorm, 0.028);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceOpacityRadiationDerivativePerNorm, 0.04);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceResponseDerivativeTemperatureDrive > 0);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceResponseDerivativePressureDrive > 0);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceResponseDerivativeFieldDrive > 0);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceResponseDerivativeRadiationDrive > 0);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceConductivityDrive > 0);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceDielectricDrive > 0);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceMechanicalStiffnessDrive > 0);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialSourceOpticalAbsorptionDrive > 0);
  assert.equal(packet.upward.closures.molecularQuantumMaterialSourceApplied, 1);
  assert.equal(packet.upward.closures.molecularQuantumMaterialSourceRecordCount, 96);
  assert.ok(packet.upward.closures.molecularQuantumMaterialPairForceScale > 1);
  assert.ok(packet.upward.closures.molecularQuantumMaterialRestLengthDeltaAngstrom < 0);
  assert.ok(packet.upward.closures.molecularQuantumMaterialPairForceMix > 0);
  assert.equal(packet.upward.closures.molecularQuantumMaterialPrimaryElementZ, 8);
  assert.equal(packet.upward.closures.molecularQuantumMaterialSecondaryElementZ, 1);
  assert.ok(packet.upward.closures.molecularQuantumMaterialPairSelectivity > 0.55);
  assert.equal(packet.upward.closures.molecularQuantumMaterialTargetAtomCount, 15);
  assert.equal(packet.upward.closures.molecularQuantumMaterialTargetFallbackAtomCount, 1);
  assert.ok(packet.upward.closures.molecularQuantumMaterialTargetAtomMeanFactor < 1);
  assert.ok(packet.upward.closures.molecularQuantumMaterialTargetPairSelectedCount > 0);
  assert.ok(packet.upward.closures.molecularQuantumMaterialTemperatureDeltaK > 0);
  assert.ok(packet.upward.closures.molecularQuantumMaterialEnsemblePressureRatio > 1);
  assert.ok(packet.upward.closures.molecularQuantumMaterialEnsemblePressureDrive > 0);
  assert.equal(packet.upward.closures.molecularQuantumMaterialStatSourceChannels, 5);
  assert.ok(packet.upward.closures.molecularQuantumMaterialStatPressureDrive > 0);
  assert.ok(packet.upward.closures.molecularQuantumMaterialStatOpacityDrive > 0);
  assert.ok(packet.upward.closures.molecularQuantumMaterialStatDegeneracyDrive > 0);
  assert.equal(packet.upward.closures.molecularQuantumMaterialHeatCapacity, 1.8);
  assert.ok(packet.upward.closures.molecularQuantumMaterialThermalDampingScale > 1);
  assert.equal(packet.upward.closures.molecularQuantumMaterialElectricalConductivitySpm, 0.085);
  assert.equal(packet.upward.closures.molecularQuantumMaterialDielectricConstant, 1.776);
  assert.equal(packet.upward.closures.molecularQuantumMaterialRefractiveIndex, 1.333);
  assert.equal(packet.upward.closures.molecularQuantumMaterialMechanicalResponsePa, 2.45e9);
  assert.ok(packet.upward.closures.molecularQuantumMaterialResponseDerivativeTemperatureDrive > 0);
  assert.ok(packet.upward.closures.molecularQuantumMaterialResponseDerivativePressureDrive > 0);
  assert.ok(packet.upward.closures.molecularQuantumMaterialResponseDerivativeFieldDrive > 0);
  assert.ok(packet.upward.closures.molecularQuantumMaterialResponseDerivativeRadiationDrive > 0);
  assert.ok(packet.upward.closures.molecularQuantumMaterialConductivityDrive > 0);
  assert.ok(packet.upward.closures.molecularQuantumMaterialDielectricDrive > 0);
	  assert.ok(packet.upward.closures.molecularQuantumMaterialMechanicalStiffnessDrive > 0);
	  assert.ok(packet.upward.closures.molecularQuantumMaterialOpticalAbsorptionDrive > 0);
	  assert.equal(packet.upward.closures.molecularQuantumMaterialReactionBarrierApplied, 1);
	  assert.equal(packet.upward.closures.molecularQuantumMaterialReactionBarrierActivationEv, 0.62);
	  assert.equal(packet.upward.closures.molecularQuantumMaterialReactionBarrierGate, 0.38);
	  assert.equal(packet.upward.closures.molecularQuantumMaterialReactionBarrierDamping, 0.62);
	  assert.equal(packet.upward.closures.molecularQuantumMaterialReactionBarrierBlockers, 1);
	  assert.ok(Number.isFinite(packet.upward.closures.molecularReactionBarrierGatedCandidateCount));
		});

test('molecular dynamics qmat barrier keeps sodium from disintegrating water without product stoichiometry', async () => {
  resetMolecularDynamics();
  const model = new MultiscaleModel();
  model.setEnvironment({ ambientTemperatureK: 335, ambientPressurePa: 101325, oxygenFraction: 0.24 });
  const quantumMaterialPotential = createTestWaterQuantumMaterialPotential();
  let state = makeMolecularDynamicsInitialState({
    composition: { O: 5, H: 10, Na: 1 },
    seed: 923,
    environment: model.environment,
    coupling: { fireIntensity: 0.04, reactionProgress: 0.1 }
  });
  const initialDiagnostics = computeMolecularDynamicsDiagnostics(state);
  assert.equal(initialDiagnostics.reactionLedger.species.H2O, 5);
  assert.equal(initialDiagnostics.waterGeometryTripletCount, 5);

  let result = null;
  for (let step = 0; step < 60; step += 1) {
    result = await stepMolecularDynamics({
      stateKey: 'molecular:qmat:na-water-stability',
      input: {
        stateKey: 'molecular:qmat:na-water-stability',
        state,
        dt: 0.05,
        environment: model.environment,
        coupling: {
          fireIntensity: 0.04,
          reactionProgress: 0.1,
          quantumMaterialPotential
        },
        enableWebGPU: false
      }
    });
    state = structuredClone(result.state);
  }

  const diagnostics = result.diagnostics;
  const status = {
    h2o: diagnostics.reactionLedger.species.H2O || 0,
    waterGeometryTripletCount: diagnostics.waterGeometryTripletCount,
    waterGeometryCompleteTripletCount: diagnostics.waterGeometryCompleteTripletCount,
    stoichiometryResidualProxy: diagnostics.stoichiometryResidualProxy,
    componentClosureFraction: diagnostics.componentClosureFraction,
    reactionBarrierGatedCandidateCount: diagnostics.reactionBarrierGatedCandidateCount,
    reactionBarrierSuppressedCandidateCount: diagnostics.reactionBarrierSuppressedCandidateCount,
    reactionBarrierMeanDamping: diagnostics.reactionBarrierMeanDamping
  };
  assert.equal(diagnostics.quantumMaterialReactionBarrierSurfaceApplied, true);
  assert.equal(diagnostics.quantumMaterialReactionBarrierProductStoichiometryAvailable, false);
  assert.ok(diagnostics.reactionBarrierGatedCandidateCount > 0, `expected Na-water candidates to be gated: ${JSON.stringify(status)}`);
  assert.ok(diagnostics.reactionBarrierMeanDamping < 0.65, `expected unsupported Na-water gate to damp strongly: ${JSON.stringify(status)}`);
  assert.ok(
    (diagnostics.reactionLedger.species.H2O || 0) >= 4,
    `expected at least four water molecules to survive qmat-gated sodium contact: ${JSON.stringify(status)}`
  );
  assert.ok(
    diagnostics.waterGeometryTripletCount >= 4,
    `expected water geometry triplets to remain recognizable: ${JSON.stringify(status)}`
  );
  assert.ok(
    diagnostics.componentClosureFraction >= 0.75,
    `expected molecule components to remain mostly closed: ${JSON.stringify(status)}`
  );
  assert.ok(
    diagnostics.stoichiometryResidualProxy <= 0.25,
    `expected unsupported Na-water chemistry not to create large stoichiometry debt: ${JSON.stringify(status)}`
  );
});

test('molecular dynamics consumes qmat Na-water product stoichiometry as source metadata', async () => {
  resetMolecularDynamics();
  const model = new MultiscaleModel();
  model.setEnvironment({ ambientTemperatureK: 335, ambientPressurePa: 101325, oxygenFraction: 0.24 });
  const quantumMaterialPotential = createTestWaterQuantumMaterialPotential(
    createTestWaterQmatBatchWithBarrier({
      productStoichiometryAvailable: true,
      productTopologyAvailable: false
    })
  );
  let state = makeMolecularDynamicsInitialState({
    composition: { O: 5, H: 10, Na: 1 },
    seed: 924,
    environment: model.environment,
    coupling: { fireIntensity: 0.04, reactionProgress: 0.1 }
  });

  let result = null;
  for (let step = 0; step < 8; step += 1) {
    result = await stepMolecularDynamics({
      stateKey: 'molecular:qmat:na-water-product-source',
      input: {
        stateKey: 'molecular:qmat:na-water-product-source',
        state,
        dt: 0.05,
        environment: model.environment,
        coupling: {
          fireIntensity: 0.04,
          reactionProgress: 0.1,
          quantumMaterialPotential
        },
        enableWebGPU: false
      }
    });
    state = structuredClone(result.state);
  }

  const diagnostics = result.diagnostics;
  const status = {
    h2o: diagnostics.reactionLedger.species.H2O || 0,
    waterGeometryTripletCount: diagnostics.waterGeometryTripletCount,
    waterGeometryCompleteTripletCount: diagnostics.waterGeometryCompleteTripletCount,
    productSource: diagnostics.quantumMaterialReactionProductSource
  };
  assert.equal(diagnostics.quantumMaterialReactionBarrierSurfaceApplied, true);
  assert.equal(diagnostics.quantumMaterialReactionBarrierProductStoichiometryAvailable, true);
  assert.equal(diagnostics.quantumMaterialReactionBarrierProductTopologyAvailable, false);
  assert.equal(diagnostics.quantumMaterialReactionProductSourceApplied, true);
  assert.equal(diagnostics.quantumMaterialReactionProductTargetReactionId, 'na-h2o-to-naoh-h2-reduced-stoichiometry');
  assert.equal(diagnostics.quantumMaterialReactionProductGasFormula, 'H2');
  assert.equal(diagnostics.quantumMaterialReactionProductGasMoleculeFractionPerNa, 0.5);
  assert.equal(diagnostics.quantumMaterialReactionProductChargeTransferElectronCount, 1);
  assert.equal(diagnostics.quantumMaterialReactionProductTopologyAvailable, false);
  assert.equal(diagnostics.quantumMaterialReactionProductTopologyRequired, true);
  assert.ok(diagnostics.quantumMaterialReactionProductHeatReleaseProxy > 0);
  assert.ok(diagnostics.quantumMaterialReactionProductChargeDeltaProxy > 0);
  assert.ok(diagnostics.quantumMaterialReactionProductExtentProxy > 0);
  assert.ok(diagnostics.quantumMaterialReactionProductProgressDriveProxy > 0);
  assert.equal(diagnostics.quantumMaterialReactionBarrierProductStoichiometry.products.NaOH, 1);
  assert.equal(diagnostics.quantumMaterialReactionBarrierProductStoichiometry.products.H2, 0.5);
  assert.ok(
    diagnostics.waterGeometryTripletCount >= 4,
    `expected topology guard to keep water geometry recognizable while product topology is pending: ${JSON.stringify(status)}`
  );

  const molecular = model.applyMolecularDynamicsResult(result);
  const packet = model.createPacket();
  assert.equal(molecular.quantumMaterialReactionProductSourceApplied, true);
  assert.equal(molecular.quantumMaterialReactionProductTargetReactionId, 'na-h2o-to-naoh-h2-reduced-stoichiometry');
  assert.equal(molecular.quantumMaterialReactionProductGasFormula, 'H2');
  assert.equal(molecular.quantumMaterialReactionProductTopologyRequired, true);
  assert.ok(molecular.quantumMaterialReactionProductHeatReleaseProxy > 0);
  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialReactionProductSourceApplied, true);
  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialReactionProductGasFormula, 'H2');
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductSourceApplied, true);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductTargetReactionId, 'na-h2o-to-naoh-h2-reduced-stoichiometry');
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductGasFormula, 'H2');
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductTopologyRequired, true);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductHeatReleaseProxy > 0);
  assert.equal(packet.upward.closures.molecularQuantumMaterialReactionProductSourceApplied, 1);
  assert.equal(packet.upward.closures.molecularQuantumMaterialReactionProductTopologyRequired, 1);
  assert.ok(packet.upward.closures.molecularQuantumMaterialReactionProductHeatReleaseProxy > 0);
});

test('molecular dynamics applies qmat Na-water product topology overlay', async () => {
  resetMolecularDynamics();
  const model = new MultiscaleModel();
  model.setEnvironment({ ambientTemperatureK: 335, ambientPressurePa: 101325, oxygenFraction: 0.24 });
  const quantumMaterialPotential = createTestWaterQuantumMaterialPotential(
    createTestWaterQmatBatchWithBarrier({
      productStoichiometryAvailable: true,
      productTopologyAvailable: true
    })
  );
  let state = makeMolecularDynamicsInitialState({
    composition: { O: 5, H: 10, Na: 2 },
    seed: 925,
    environment: model.environment,
    coupling: { fireIntensity: 0.04, reactionProgress: 0.1 }
  });

  let result = null;
  for (let step = 0; step < 2; step += 1) {
    result = await stepMolecularDynamics({
      stateKey: 'molecular:qmat:na-water-product-topology',
      input: {
        stateKey: 'molecular:qmat:na-water-product-topology',
        state,
        dt: 0.05,
        environment: model.environment,
        coupling: {
          fireIntensity: 0.04,
          reactionProgress: 0.1,
          quantumMaterialPotential
        },
        enableWebGPU: false
      }
    });
    state = structuredClone(result.state);
  }

  const diagnostics = result.diagnostics;
  const species = diagnostics.reactionLedger.species;
  const status = {
    species,
    overlay: diagnostics.quantumMaterialReactionProductTopologyOverlay,
    bonds: diagnostics.bonds
  };
  assert.equal(diagnostics.quantumMaterialReactionBarrierSurfaceApplied, true);
  assert.equal(diagnostics.quantumMaterialReactionBarrierProductStoichiometryAvailable, true);
  assert.equal(diagnostics.quantumMaterialReactionBarrierProductTopologyAvailable, true);
  assert.equal(diagnostics.quantumMaterialReactionProductTopologyAvailable, true);
  assert.equal(diagnostics.quantumMaterialReactionProductTopologyRequired, false);
  assert.equal(diagnostics.quantumMaterialReactionProductTopologySchema, QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA);
  assert.equal(diagnostics.quantumMaterialReactionProductTopologyOverlayApplied, true);
  assert.ok(diagnostics.quantumMaterialReactionProductTopologyOverlayBondCount >= 5);
  assert.ok(diagnostics.quantumMaterialReactionProductTopologyNaohMoleculeCount >= 2);
  assert.ok(diagnostics.quantumMaterialReactionProductTopologyH2MoleculeCount >= 1);
  assert.equal(diagnostics.quantumMaterialReactionProductTopologyPartialHydrogenSiteCount, 0);
  assert.equal(diagnostics.quantumMaterialReactionProductTopologyMutationSchema, MOLECULAR_QMAT_PRODUCT_TOPOLOGY_MUTATION_SCHEMA);
  assert.equal(diagnostics.quantumMaterialReactionProductTopologyMutationApplied, true);
  assert.ok(diagnostics.quantumMaterialReactionProductTopologyMutatedAtomCount >= 8);
  assert.ok(diagnostics.quantumMaterialReactionProductTopologyRetiredWaterGroupCount >= 2);
  assert.equal(diagnostics.quantumMaterialReactionProductTopologyMutationAtomInventoryConserved, true);
  assert.equal(diagnostics.quantumMaterialReactionProductTopologyScientificMutation, false);
  assert.equal(result.state.quantumMaterialProductTopologyMutation.schema, MOLECULAR_QMAT_PRODUCT_TOPOLOGY_MUTATION_SCHEMA);
  assert.equal(result.state.quantumMaterialProductTopologyMutation.applied, true);
  assert.equal(
    diagnostics.quantumMaterialReactionProductConservationAuditSchema,
    MOLECULAR_QMAT_PRODUCT_CONSERVATION_AUDIT_SCHEMA
  );
  assert.equal(diagnostics.quantumMaterialReactionProductConservationClosed, true);
  assert.equal(diagnostics.quantumMaterialReactionProductGraphComplete, true);
  assert.equal(diagnostics.quantumMaterialReactionProductConservativeProductGraphReady, true);
  assert.equal(diagnostics.quantumMaterialReactionProductAtomResidualProxy, 0);
  assert.equal(diagnostics.quantumMaterialReactionProductHeatBudgetResidualProxy, 0);
  assert.equal(diagnostics.quantumMaterialReactionProductChargeBudgetResidualProxy, 0);
  assert.equal(diagnostics.quantumMaterialReactionProductSiteCoverageFraction, 1);
  assert.ok(diagnostics.quantumMaterialReactionProductWaterConsumedCount >= 2);
  assert.ok(diagnostics.quantumMaterialReactionProductWaterRemainingEstimate <= 3);
  assert.equal(diagnostics.quantumMaterialReactionProductConservationAudit.expectedReactantAtoms.Na, 2);
  assert.equal(diagnostics.quantumMaterialReactionProductConservationAudit.expectedReactantAtoms.O, 2);
  assert.equal(diagnostics.quantumMaterialReactionProductConservationAudit.expectedReactantAtoms.H, 4);
  assert.equal(diagnostics.quantumMaterialReactionProductConservationAudit.observedProductSpecies.NaOH, 2);
  assert.equal(diagnostics.quantumMaterialReactionProductConservationAudit.observedProductSpecies.H2, 1);
  assert.ok((species.NaOH || 0) >= 2, `expected NaOH products in reaction ledger: ${JSON.stringify(status)}`);
  assert.ok((species.H2 || 0) >= 1, `expected H2 product in reaction ledger: ${JSON.stringify(status)}`);
  assert.ok((species.H2O || 0) <= 3, `expected consumed water count to drop: ${JSON.stringify(status)}`);

  const molecular = model.applyMolecularDynamicsResult(result);
  const packet = model.createPacket();
  assert.equal(molecular.quantumMaterialReactionProductTopologyAvailable, true);
  assert.equal(molecular.quantumMaterialReactionProductTopologyRequired, false);
  assert.equal(molecular.quantumMaterialReactionProductTopologyOverlayApplied, true);
  assert.ok(molecular.quantumMaterialReactionProductTopologyNaohMoleculeCount >= 2);
  assert.equal(molecular.quantumMaterialReactionProductTopologyMutationSchema, MOLECULAR_QMAT_PRODUCT_TOPOLOGY_MUTATION_SCHEMA);
  assert.equal(molecular.quantumMaterialReactionProductTopologyMutationApplied, true);
  assert.ok(molecular.quantumMaterialReactionProductTopologyMutatedAtomCount >= 8);
  assert.ok(molecular.quantumMaterialReactionProductTopologyRetiredWaterGroupCount >= 2);
  assert.equal(molecular.quantumMaterialReactionProductTopologyMutationAtomInventoryConserved, true);
  assert.equal(molecular.quantumMaterialReactionProductConservationAuditSchema, MOLECULAR_QMAT_PRODUCT_CONSERVATION_AUDIT_SCHEMA);
  assert.equal(molecular.quantumMaterialReactionProductConservationClosed, true);
  assert.equal(molecular.quantumMaterialReactionProductGraphComplete, true);
  assert.equal(molecular.quantumMaterialReactionProductAtomResidualProxy, 0);
  assert.ok(molecular.molecularSpecies.NaOH >= 2);
  assert.ok(molecular.molecularSpecies.H2 >= 1);
  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialReactionProductTopologyOverlayApplied, true);
  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialReactionProductTopologySchema, QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA);
  assert.equal(
    model.state.closures.molecularDynamics.state.fields.quantumMaterialReactionProductTopologyMutationSchema,
    MOLECULAR_QMAT_PRODUCT_TOPOLOGY_MUTATION_SCHEMA
  );
  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialReactionProductTopologyMutationApplied, true);
  assert.ok(model.state.closures.molecularDynamics.state.fields.quantumMaterialReactionProductTopologyMutatedAtomCount >= 8);
  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumMaterialReactionProductTopologyMutationApplied, true);
  assert.equal(
    model.state.closures.molecularDynamics.state.fields.quantumMaterialReactionProductConservationAuditSchema,
    MOLECULAR_QMAT_PRODUCT_CONSERVATION_AUDIT_SCHEMA
  );
  assert.equal(model.state.closures.molecularDynamics.state.fields.quantumMaterialReactionProductConservationClosed, true);
  assert.equal(model.state.closures.molecularDynamics.chemistry.quantumMaterialReactionProductConservationClosed, true);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductTopologyAvailable, true);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductTopologyOverlayApplied, true);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductTopologyNaohMoleculeCount >= 2);
  assert.equal(
    packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductTopologyMutationSchema,
    MOLECULAR_QMAT_PRODUCT_TOPOLOGY_MUTATION_SCHEMA
  );
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductTopologyMutationApplied, true);
  assert.ok(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductTopologyMutatedAtomCount >= 8);
  assert.equal(
    packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductConservationAuditSchema,
    MOLECULAR_QMAT_PRODUCT_CONSERVATION_AUDIT_SCHEMA
  );
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductConservationClosed, true);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductGraphComplete, true);
  assert.equal(packet.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductAtomResidualProxy, 0);
  assert.equal(packet.upward.closures.molecularQuantumMaterialReactionProductTopologyAvailable, 1);
  assert.equal(packet.upward.closures.molecularQuantumMaterialReactionProductTopologyOverlayApplied, 1);
  assert.equal(packet.upward.closures.molecularQuantumMaterialReactionProductTopologyMutationApplied, 1);
  assert.ok(packet.upward.closures.molecularQuantumMaterialReactionProductTopologyMutatedAtomCount >= 8);
  assert.ok(packet.upward.closures.molecularQuantumMaterialReactionProductTopologyRetiredWaterGroupCount >= 2);
  assert.ok(packet.upward.closures.molecularQuantumMaterialReactionProductTopologyNaohCount >= 2);
  assert.ok(packet.upward.closures.molecularQuantumMaterialReactionProductTopologyH2Count >= 1);
  assert.equal(packet.upward.closures.molecularQuantumMaterialReactionProductConservationClosed, 1);
  assert.equal(packet.upward.closures.molecularQuantumMaterialReactionProductGraphComplete, 1);
  assert.equal(packet.upward.closures.molecularQuantumMaterialReactionProductAtomResidualProxy, 0);
  assert.equal(packet.upward.closures.molecularQuantumMaterialReactionProductSiteCoverageFraction, 1);

  const gpuVisibleModel = new MultiscaleModel();
  const gpuVisibleResult = structuredClone(result);
  gpuVisibleResult.backend = 'webgpu-molecular-dynamics';
  gpuVisibleResult.state.quantumMaterialProductTopologyGpuWriteback = {
    schema: MOLECULAR_QMAT_PRODUCT_TOPOLOGY_GPU_WRITEBACK_SCHEMA,
    modelId: 'qmat-na-water-webgpu-product-topology-writeback-v0',
    mode: 'webgpu-neighbor-product-topology-command-buffer',
    status: 'webgpu-command-buffer-dispatched',
    applied: true,
    webgpuCommandBufferReady: true,
    webgpuKernelApplied: true,
    commandCount: 10,
    commandFloatStride: 4,
    commandHeaderFloatCount: 4,
    commandBufferFloatCount: 44,
    targetAtomCount: result.state.atomCount,
    topologyMetadataFloatOffset: 10,
    topologyMetadataFloatCount: 3,
    topologyMetadataFields: ['moleculeGroupId', 'moleculeGroupType', 'moleculeLocalIndex'],
    productTopologySchema: QUANTUM_MATERIAL_PRODUCT_TOPOLOGY_SCHEMA,
    productTopologyMode: 'reduced-bond-graph-overlay',
    productSiteCount: 2,
    h2SiteCount: 1,
    plannedNaohMoleculeCount: 2,
    plannedH2MoleculeCount: 1,
    mutatedAtomCount: 8,
    retiredWaterGroupCount: 2,
    reducedAtomInventoryConserved: true,
    authoritativeAtomMutationReady: false,
    scientificMutation: false,
    commandsPreview: []
  };
  gpuVisibleResult.state.quantumMaterialProductTopologyMutation = {
    ...gpuVisibleResult.state.quantumMaterialProductTopologyMutation,
    webgpuWritebackApplied: true,
    webgpuWritebackKernelApplied: true,
    gpuWritebackSchema: MOLECULAR_QMAT_PRODUCT_TOPOLOGY_GPU_WRITEBACK_SCHEMA,
    gpuWritebackStatus: 'webgpu-command-buffer-dispatched',
    gpuWritebackCommandCount: 10,
    gpuWritebackCommandFloatStride: 4,
    gpuWritebackCommandHeaderFloatCount: 4,
    gpuWritebackTargetAtomCount: result.state.atomCount,
    gpuWriteback: gpuVisibleResult.state.quantumMaterialProductTopologyGpuWriteback
  };
  gpuVisibleResult.webgpuStatus = {
    atomFloatStride: MOLECULAR_DYNAMICS_ATOM_FLOAT_STRIDE,
    topologyMetadataFloatOffset: 10,
    topologyMetadataFloatCount: 3,
    topologyMetadataFields: ['moleculeGroupId', 'moleculeGroupType', 'moleculeLocalIndex'],
    topologyMetadataGpuVisible: true,
    topologyMetadataRoundTripApplied: true
  };
  gpuVisibleResult.diagnostics = {
    ...gpuVisibleResult.diagnostics,
    molecularTopologyBufferAtomFloatStride: MOLECULAR_DYNAMICS_ATOM_FLOAT_STRIDE,
    molecularTopologyBufferMetadataFloatOffset: 10,
    molecularTopologyBufferMetadataFloatCount: 3,
    molecularTopologyBufferMetadataFields: ['moleculeGroupId', 'moleculeGroupType', 'moleculeLocalIndex'],
    molecularTopologyBufferGpuVisible: true,
    molecularTopologyBufferRoundTripApplied: true,
    quantumMaterialReactionProductTopologyGpuWriteback: gpuVisibleResult.state.quantumMaterialProductTopologyGpuWriteback,
    quantumMaterialReactionProductTopologyGpuWritebackSchema: MOLECULAR_QMAT_PRODUCT_TOPOLOGY_GPU_WRITEBACK_SCHEMA,
    quantumMaterialReactionProductTopologyGpuWritebackStatus: 'webgpu-command-buffer-dispatched',
    quantumMaterialReactionProductTopologyGpuWritebackApplied: true,
    quantumMaterialReactionProductTopologyGpuWritebackKernelApplied: true,
    quantumMaterialReactionProductTopologyGpuWritebackCommandCount: 10,
    quantumMaterialReactionProductTopologyGpuWritebackCommandFloatStride: 4,
    quantumMaterialReactionProductTopologyGpuWritebackCommandHeaderFloatCount: 4,
    quantumMaterialReactionProductTopologyGpuWritebackTargetAtomCount: result.state.atomCount,
    quantumMaterialReactionProductTopologyGpuWritebackMutationReady: true
  };
  const gpuVisibleMolecular = gpuVisibleModel.applyMolecularDynamicsResult(gpuVisibleResult);
  const gpuVisiblePacket = gpuVisibleModel.createPacket();
  assert.equal(gpuVisibleMolecular.molecularTopologyBufferGpuVisible, true);
  assert.equal(gpuVisibleMolecular.molecularTopologyBufferRoundTripApplied, true);
  assert.equal(gpuVisibleMolecular.molecularTopologyBufferAtomFloatStride, MOLECULAR_DYNAMICS_ATOM_FLOAT_STRIDE);
  assert.equal(
    gpuVisibleModel.state.closures.molecularDynamics.state.fields.molecularTopologyBufferGpuVisible,
    true
  );
  assert.equal(gpuVisiblePacket.upward.closures.molecularTopologyBufferGpuVisible, 1);
  assert.equal(gpuVisiblePacket.upward.closures.molecularTopologyBufferRoundTripApplied, 1);
  assert.equal(
    gpuVisiblePacket.upward.aggregateState.molecularDynamics.molecularTopologyBufferAtomFloatStride,
    MOLECULAR_DYNAMICS_ATOM_FLOAT_STRIDE
  );
  assert.equal(gpuVisibleMolecular.quantumMaterialReactionProductTopologyGpuWritebackSchema, MOLECULAR_QMAT_PRODUCT_TOPOLOGY_GPU_WRITEBACK_SCHEMA);
  assert.equal(gpuVisibleMolecular.quantumMaterialReactionProductTopologyGpuWritebackApplied, true);
  assert.equal(gpuVisibleMolecular.quantumMaterialReactionProductTopologyGpuWritebackKernelApplied, true);
  assert.equal(gpuVisibleMolecular.quantumMaterialReactionProductTopologyGpuWritebackCommandCount, 10);
  assert.equal(
    gpuVisibleModel.state.closures.molecularDynamics.state.fields.quantumMaterialReactionProductTopologyGpuWritebackSchema,
    MOLECULAR_QMAT_PRODUCT_TOPOLOGY_GPU_WRITEBACK_SCHEMA
  );
  assert.equal(
    gpuVisibleModel.state.closures.molecularDynamics.state.fields.quantumMaterialReactionProductTopologyGpuWritebackKernelApplied,
    true
  );
  assert.equal(gpuVisibleModel.state.closures.molecularDynamics.chemistry.quantumMaterialReactionProductTopologyGpuWritebackKernelApplied, true);
  assert.equal(gpuVisiblePacket.upward.closures.molecularQuantumMaterialReactionProductTopologyGpuWritebackKernelApplied, 1);
  assert.equal(gpuVisiblePacket.upward.closures.molecularQuantumMaterialReactionProductTopologyGpuWritebackCommandCount, 10);
  assert.equal(
    gpuVisiblePacket.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductTopologyGpuWritebackSchema,
    MOLECULAR_QMAT_PRODUCT_TOPOLOGY_GPU_WRITEBACK_SCHEMA
  );
  assert.equal(gpuVisiblePacket.upward.aggregateState.molecularDynamics.quantumMaterialReactionProductTopologyGpuWritebackKernelApplied, true);
});

test('molecular dynamics consumes ULG state deltas as lower-layer source terms', async () => {
  resetMolecularDynamics();
  const model = new MultiscaleModel();
  model.setEnvironment({ ambientTemperatureK: 294, ambientPressurePa: 101325, oxygenFraction: 0.24 });
  const base = makeMolecularDynamicsInitialState({
    composition: { O: 5, H: 10 },
    seed: 922,
    environment: model.environment,
    coupling: { fireIntensity: 0.05, reactionProgress: 0.12 }
  });
  const ulgStateDelta = {
    schema: ULG_RUNTIME_STATE_DELTA_SCHEMA,
    ok: true,
    status: 'webgpu-reduced-state-delta-applied',
    mutationMode: 'state-manager-ulg-lane',
    proxyStateReady: true,
    proxyStateApplied: true,
    authoritativeWorkerBufferMutation: false,
    scientificMutationReady: false,
    readiness: 1,
    executedFraction: 1,
    channelUpdateCount: 6,
    appliedChannelUpdateCount: 6,
    stateDeltaHash: 'sha256:testulgmd',
    channelUpdates: [
      { channelId: 'channel:temperature', quantity: 'temperature', unit: 'K', delta: 48, status: 'applied-to-ulg-state-lane' },
      { channelId: 'channel:internal-energy', quantity: 'specific-internal-energy', unit: 'reduced', delta: 0.42, status: 'applied-to-ulg-state-lane' },
      { channelId: 'channel:charge', quantity: 'charge', unit: 'reduced', delta: 0.18, status: 'applied-to-ulg-state-lane' },
      { channelId: 'channel:v', quantity: 'velocity', unit: 'reduced', delta: 0.03, status: 'applied-to-ulg-state-lane' },
      { channelId: 'channel:magnetic-field', quantity: 'magnetic-field', unit: 'reduced', delta: 0.02, status: 'applied-to-ulg-state-lane' },
      { channelId: 'channel:wavefunction-normalization', quantity: 'wavefunction-normalization', unit: 'dimensionless', delta: -0.001, status: 'applied-to-ulg-state-lane' }
    ]
  };

  const uncoupled = await stepMolecularDynamics({
    stateKey: 'molecular:ulg:uncoupled',
    input: {
      stateKey: 'molecular:ulg:uncoupled',
      state: structuredClone(base),
      dt: 0.05,
      environment: model.environment,
      coupling: { fireIntensity: 0.05, reactionProgress: 0.12 },
      enableWebGPU: false
    }
  });
  const coupled = await stepMolecularDynamics({
    stateKey: 'molecular:ulg:coupled',
    input: {
      stateKey: 'molecular:ulg:coupled',
      state: structuredClone(base),
      dt: 0.05,
      environment: model.environment,
      coupling: {
        fireIntensity: 0.05,
        reactionProgress: 0.12,
        ulgRuntimeStateDelta: ulgStateDelta
      },
      enableWebGPU: false
    }
  });

  assert.equal(uncoupled.diagnostics.ulgStateDeltaSource.schema, MOLECULAR_ULG_STATE_SOURCE_SCHEMA);
  assert.equal(uncoupled.diagnostics.ulgStateDeltaSource.sourceSchema, null);
  assert.equal(uncoupled.diagnostics.ulgStateDeltaApplied, false);
  assert.equal(uncoupled.diagnostics.ulgStateDeltaAppliedChannelCount, 0);
  assert.equal(uncoupled.diagnostics.ulgStateDeltaApplicationMode, 'unavailable');
  assert.equal(uncoupled.diagnostics.ulgStateDeltaTemperatureDeltaK, 0);
  assert.equal(uncoupled.diagnostics.ulgStateDeltaChargeDeltaProxy, 0);

  assert.equal(coupled.diagnostics.ulgStateDeltaSource.schema, MOLECULAR_ULG_STATE_SOURCE_SCHEMA);
  assert.equal(coupled.diagnostics.ulgStateDeltaSource.sourceSchema, ULG_RUNTIME_STATE_DELTA_SCHEMA);
  assert.equal(coupled.diagnostics.ulgStateDeltaApplied, true);
  assert.equal(coupled.diagnostics.ulgStateDeltaAppliedChannelCount, 6);
  assert.equal(coupled.diagnostics.ulgStateDeltaHash, 'sha256:testulgmd');
  assert.equal(coupled.diagnostics.ulgStateDeltaApplicationMode, 'cpu-md-source-term');
  assert.equal(coupled.diagnostics.ulgStateDeltaWebgpuKernelApplied, false);
  assert.equal(coupled.diagnostics.ulgStateDeltaSource.channelUpdateCount, 6);
  assert.equal(coupled.diagnostics.ulgStateDeltaSource.appliedChannelUpdateCount, 6);
  assert.equal(coupled.diagnostics.ulgStateDeltaSource.channelUpdates.length, 6);
  assert.equal(coupled.diagnostics.ulgStateDeltaSource.temperatureDeltaK, 48);
  assert.equal(coupled.diagnostics.ulgStateDeltaSource.chargeDeltaProxy, 0.18);
  assert.ok(coupled.diagnostics.ulgStateDeltaTemperatureDeltaK > 0);
  assert.notEqual(coupled.diagnostics.ulgStateDeltaTemperatureDeltaK, uncoupled.diagnostics.ulgStateDeltaTemperatureDeltaK);
  assert.notEqual(coupled.diagnostics.ulgStateDeltaChargeDeltaProxy, uncoupled.diagnostics.ulgStateDeltaChargeDeltaProxy);
  assert.ok(coupled.diagnostics.meanTemperatureK > uncoupled.diagnostics.meanTemperatureK);
  assert.notEqual(coupled.diagnostics.meanAbsCharge, uncoupled.diagnostics.meanAbsCharge);
  assert.notEqual(coupled.conservation.ulgStateDeltaTemperatureDeltaK, 0);
  assert.notEqual(coupled.conservation.ulgStateDeltaChargeDeltaProxy, 0);
  assert.equal(coupled.conservation.ulgStateDeltaApplied, true);

  const uncoupledModel = new MultiscaleModel();
  uncoupledModel.setEnvironment({ ambientTemperatureK: 294, ambientPressurePa: 101325, oxygenFraction: 0.24 });
  uncoupledModel.applyMolecularDynamicsResult(uncoupled);
  uncoupledModel.updateQuantumOrbitalClosure();
  const uncoupledPacket = uncoupledModel.createPacket();
  assert.equal(uncoupledModel.state.molecular.molecularDynamics.ulgStateDeltaApplied, false);
  assert.equal(uncoupledModel.state.molecular.molecularDynamics.ulgStateDeltaAppliedChannelCount, 0);
  assert.equal(uncoupledModel.state.molecular.molecularDynamics.ulgStateDeltaApplicationMode, 'unavailable');
  assert.equal(uncoupledPacket.upward.aggregateState.molecularDynamics.ulgStateDeltaApplied, false);
  assert.equal(uncoupledPacket.upward.aggregateState.molecularDynamics.ulgStateDeltaAppliedChannelCount, 0);
  assert.equal(uncoupledPacket.upward.aggregateState.molecularDynamics.ulgStateDeltaSource.schema, MOLECULAR_ULG_STATE_SOURCE_SCHEMA);
  assert.equal(uncoupledPacket.upward.aggregateState.molecularDynamics.ulgStateDeltaSource.sourceSchema, null);
  assert.equal(uncoupledPacket.upward.closures.molecularUlgStateDeltaApplied, 0);
  assert.equal(uncoupledPacket.upward.closures.molecularUlgStateDeltaAppliedChannels, 0);
  assert.equal(uncoupledPacket.upward.closures.molecularUlgStateDeltaTemperatureDeltaK, 0);
  assert.equal(uncoupledPacket.upward.closures.molecularUlgStateDeltaChargeDelta, 0);
  assert.equal(uncoupledPacket.upward.aggregateState.ulgSpecContracts.handoffs.ulgToMolecularDynamics.applied, false);
  assert.equal(uncoupledPacket.upward.aggregateState.ulgSpecContracts.handoffs.ulgToMolecularDynamics.stateDeltaHash, null);

  model.applyMolecularDynamicsResult(coupled);
  model.updateQuantumOrbitalClosure();
  const packet = model.createPacket();
  assert.equal(model.state.molecular.molecularDynamics.ulgStateDeltaApplied, true);
  assert.equal(model.state.molecular.molecularDynamics.ulgStateDeltaAppliedChannelCount, 6);
  assert.equal(model.state.molecular.molecularDynamics.ulgStateDeltaApplicationMode, 'cpu-md-source-term');
  assert.equal(model.state.molecular.molecularDynamics.ulgStateDeltaWebgpuKernelApplied, false);
  assert.equal(packet.upward.aggregateState.molecularDynamics.ulgStateDeltaApplied, true);
  assert.equal(packet.upward.aggregateState.molecularDynamics.ulgStateDeltaAppliedChannelCount, 6);
  assert.equal(packet.upward.aggregateState.molecularDynamics.ulgStateDeltaHash, 'sha256:testulgmd');
  assert.equal(packet.upward.aggregateState.molecularDynamics.ulgStateDeltaApplicationMode, 'cpu-md-source-term');
  assert.equal(packet.upward.aggregateState.molecularDynamics.ulgStateDeltaSource.schema, MOLECULAR_ULG_STATE_SOURCE_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.ulgStateDeltaSource.sourceSchema, ULG_RUNTIME_STATE_DELTA_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.ulgStateDeltaSource.stateDeltaHash, 'sha256:testulgmd');
  assert.ok(
    packet.upward.aggregateState.molecularDynamics.meanTemperatureK
      > uncoupledPacket.upward.aggregateState.molecularDynamics.meanTemperatureK
  );
  assert.ok(packet.upward.aggregateState.molecularDynamics.ulgStateDeltaSource.chargeDeltaProxy > 0);
  assert.notEqual(
    packet.upward.aggregateState.molecularDynamics.ulgStateDeltaChargeDeltaProxy,
    uncoupledPacket.upward.aggregateState.molecularDynamics.ulgStateDeltaChargeDeltaProxy
  );
  assert.equal(packet.upward.closures.molecularUlgStateDeltaApplicationMode, 'cpu-md-source-term');
  assert.equal(packet.upward.closures.molecularUlgStateDeltaWebgpuKernelApplied, 0);
  assert.equal(packet.upward.closures.molecularUlgStateDeltaApplied, 1);
  assert.equal(packet.upward.closures.molecularUlgStateDeltaAppliedChannels, 6);
  assert.ok(packet.upward.closures.molecularUlgStateDeltaTemperatureDeltaK > 0);
  assert.notEqual(
    packet.upward.closures.molecularUlgStateDeltaChargeDelta,
    uncoupledPacket.upward.closures.molecularUlgStateDeltaChargeDelta
  );
  assert.equal(packet.upward.aggregateState.ulgSpecContracts.schema, ULG_SPEC_CONTRACT_REPORT_SCHEMA);
  assert.equal(packet.upward.aggregateState.ulgSpecContracts.specVersion, '0.4');
  assert.equal(packet.upward.aggregateState.ulgSpecContracts.passContractAudit.schema, 'peercompute.ulg.v04-pass-contract-audit.v0');
  assert.equal(packet.upward.aggregateState.ulgSpecContracts.passContractAudit.allCorePassesPresent, true);
  assert.equal(packet.upward.aggregateState.ulgSpecContracts.passContractAudit.allPassContractsComplete, true);
  assert.equal(packet.upward.aggregateState.ulgSpecContracts.passContractAudit.implementedCorePassCount, 14);
  assert.equal(packet.upward.aggregateState.ulgSpecContracts.complianceChecklistCount, 12);
  assert.ok(packet.upward.aggregateState.ulgSpecContracts.complianceChecklistReadyCount >= 10);
  assert.ok(packet.upward.aggregateState.ulgSpecContracts.hardRules.some((rule) => rule.id === 'rule:schrodinger-foundational-not-universal'));
  assert.equal(packet.upward.aggregateState.ulgSpecContracts.hotWarmColdLayout.fullHotBufferReplicationPerTick, false);
  assert.equal(packet.upward.aggregateState.ulgSpecContracts.handoffs.ulgToMolecularDynamics.applied, true);
  assert.equal(packet.upward.aggregateState.ulgSpecContracts.handoffs.ulgToMolecularDynamics.stateDeltaHash, 'sha256:testulgmd');
  assert.ok(packet.upward.aggregateState.ulgSpecContracts.rootContractCount >= 8);
  assert.ok(packet.upward.aggregateState.ulgSpecContracts.activeRootContractIds.includes('root:quantum-statistical-ensemble'));
});

test('molecular dynamics initializer honors periodic-table composition recipes', () => {
  const composition = normalizeMolecularComposition({ O: 5, H: 10, Na: 2, Cl: 2 });
  assert.deepEqual(composition, { O: 5, H: 10, Na: 2, Cl: 2 });
  assert.ok(SUPPORTED_MOLECULAR_ELEMENTS.some((element) => element.symbol === 'Na'));
  assert.ok(SUPPORTED_MOLECULAR_ELEMENTS.some((element) => element.symbol === 'Cl'));

  const water = makeMolecularDynamicsInitialState({
    composition: { O: 5, H: 10 },
    seed: 101,
    environment: { ambientTemperatureK: 294 }
  });
  const diagnostics = computeMolecularDynamicsDiagnostics(water);
  assert.equal(water.atomCount, 15);
  assert.equal(diagnostics.species.O, 5);
  assert.equal(diagnostics.species.H, 10);
  assert.equal(diagnostics.bondCount, 10);
  assert.equal(diagnostics.reactionLedger.schema, MOLECULAR_REACTION_LEDGER_SCHEMA);
  assert.equal(diagnostics.reactionLedger.species.H2O, 5);
  assert.equal(diagnostics.reactionLedger.recognizedMoleculeCount, 5);
  assert.equal(diagnostics.reactionLedger.stoichiometryClosed, true);
  assert.equal(diagnostics.dominantMolecule, 'H2O');
  assert.equal(diagnostics.stoichiometryResidualProxy, 0);
  assert.equal(diagnostics.molecularGeometryForceLaw.schema, MOLECULAR_GEOMETRY_FORCE_LAW_SCHEMA);
  assert.equal(diagnostics.molecularGeometryForceLawModelId, 'reduced-water-hoh-angle-distance-constraint-v0');
  assert.equal(diagnostics.waterGeometryTripletCount, 5);
  assert.equal(diagnostics.waterGeometryCompleteTripletCount, 5);
  assert.ok(Math.abs(diagnostics.waterGeometryMeanAngleDeg - 104.52) < 3);
  assert.ok(diagnostics.waterGeometryMeanAbsAngleErrorDeg < 3);
  assert.ok(diagnostics.waterGeometryClosureFraction > 0.98);
  assert.ok(diagnostics.waterGeometryEnergyProxy >= 0);
  assert.equal(water.requestedComposition.O, 5);
  assert.equal(water.requestedComposition.H, 10);

  const salt = makeMolecularDynamicsInitialState({
    composition: { Na: 3, Cl: 3 },
    seed: 102
  });
  const saltDiagnostics = computeMolecularDynamicsDiagnostics(salt);
  assert.equal(salt.atomCount, 6);
  assert.equal(saltDiagnostics.species.Na, 3);
  assert.equal(saltDiagnostics.species.Cl, 3);
  assert.ok(saltDiagnostics.bondCount > 0);
  assert.equal(saltDiagnostics.reactionLedger.species.NaCl, 3);
  assert.equal(saltDiagnostics.reactionLedger.stoichiometryClosed, true);

  const carbonDioxide = makeMolecularDynamicsInitialState({
    composition: { C: 3, O: 6 },
    seed: 103
  });
  const carbonDioxideDiagnostics = computeMolecularDynamicsDiagnostics(carbonDioxide);
  assert.equal(carbonDioxide.atomCount, 9);
  assert.equal(carbonDioxideDiagnostics.species.C, 3);
  assert.equal(carbonDioxideDiagnostics.species.O, 6);
  assert.equal(carbonDioxideDiagnostics.bondCount, 6);
  assert.equal(carbonDioxideDiagnostics.reactionLedger.species.CO2, 3);
  assert.equal(carbonDioxideDiagnostics.reactionLedger.stoichiometryClosed, true);
});

test('molecular dynamics force law uses element-aware pair rest lengths and affinity', () => {
  const oh = getMolecularPairForceLawPreview(8, 1);
  const nacl = getMolecularPairForceLawPreview(11, 17);
  const oo = getMolecularPairForceLawPreview(8, 8);

  assert.equal(oh.schema, MOLECULAR_FORCE_LAW_SCHEMA);
  assert.equal(oh.modelId, 'element-aware-covalent-radius-affinity-v0');
  assert.equal(oh.pairClass, 'polar-covalent-candidate');
  assert.ok(oh.restLengthReducedNm > 0.1 && oh.restLengthReducedNm < 0.12);
  assert.ok(oh.affinity > 1);
  assert.equal(nacl.pairClass, 'ionic-candidate');
  assert.ok(nacl.restLengthReducedNm > oh.restLengthReducedNm * 2.5);
  assert.ok(nacl.affinity > oo.affinity);
  assert.equal(oo.pairClass, 'weak-contact-candidate');

  const state = makeMolecularDynamicsInitialState({
    composition: { O: 5, H: 10, Na: 1, Cl: 1 },
    seed: 104,
    environment: { ambientTemperatureK: 294 }
  });
  const diagnostics = computeMolecularDynamicsDiagnostics(state);
  assert.equal(diagnostics.forceFieldForceLaw.schema, MOLECULAR_FORCE_LAW_SCHEMA);
  assert.equal(diagnostics.forceFieldForceLawModelId, 'element-aware-covalent-radius-affinity-v0');
  assert.ok(diagnostics.forceFieldMeanPairRestLengthReducedNm > 0);
  assert.ok(diagnostics.forceFieldMeanPairAffinity > 0);
  assert.ok(diagnostics.forceFieldIonicPairCandidateCount > 0);
  assert.ok(diagnostics.forceFieldPolarPairCandidateCount > 0);
  assert.ok(diagnostics.forceFieldWeakPairCandidateCount > 0);
  assert.equal(diagnostics.molecularGeometryForceLawSchema, MOLECULAR_GEOMETRY_FORCE_LAW_SCHEMA);
  assert.equal(diagnostics.forceEnergyLedger.geometryForceLaw.schema, MOLECULAR_GEOMETRY_FORCE_LAW_SCHEMA);
  assert.equal(diagnostics.waterGeometryTripletCount, 5);
  assert.ok(diagnostics.waterGeometryMeanAngleDeg > 98 && diagnostics.waterGeometryMeanAngleDeg < 111);
  assert.ok(diagnostics.waterGeometryMeanOhDistanceReducedNm > 0.09);
  assert.ok(diagnostics.waterGeometryMeanHhDistanceReducedNm > 0.13);

  const model = new MultiscaleModel();
  const molecular = model.applyMolecularDynamicsResult({ diagnostics, state });
  const packet = model.createPacket();
  assert.equal(molecular.forceFieldForceLawSchema, MOLECULAR_FORCE_LAW_SCHEMA);
  assert.equal(molecular.molecularGeometryForceLawSchema, MOLECULAR_GEOMETRY_FORCE_LAW_SCHEMA);
  assert.equal(molecular.waterGeometryTripletCount, 5);
  assert.equal(packet.upward.aggregateState.molecularDynamics.forceFieldForceLawSchema, MOLECULAR_FORCE_LAW_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.molecularGeometryForceLawSchema, MOLECULAR_GEOMETRY_FORCE_LAW_SCHEMA);
  assert.ok(packet.upward.aggregateState.molecularDynamics.forceFieldMeanPairRestLengthReducedNm > 0);
  assert.ok(packet.upward.aggregateState.molecularDynamics.forceFieldMeanPairAffinity > 0);
  assert.ok(packet.upward.aggregateState.molecularDynamics.forceFieldIonicPairCandidateCount > 0);
  assert.equal(packet.upward.aggregateState.molecularDynamics.waterGeometryTripletCount, 5);
  assert.ok(packet.upward.aggregateState.molecularDynamics.waterGeometryMeanAbsAngleErrorDeg < 3);
});

test('molecular dynamics bond diagnostics use deterministic spatial candidate search', () => {
  const waterPatch = makeMolecularDynamicsInitialState({
    composition: { O: 40, H: 80 },
    seed: 301,
    environment: { ambientTemperatureK: 294 }
  });
  const diagnostics = computeMolecularDynamicsDiagnostics(waterPatch);
  const allPairs = waterPatch.atomCount * (waterPatch.atomCount - 1) / 2;

  assert.equal(waterPatch.atomCount, 120);
  assert.equal(diagnostics.pairSearchMode, 'cell-list');
  assert.ok(diagnostics.spatialCellCount > 1);
  assert.ok(diagnostics.neighborCandidatePairCount > diagnostics.bondCount);
  assert.ok(diagnostics.neighborCandidatePairCount < allPairs);
  assert.ok(diagnostics.bondCandidateCount >= diagnostics.bondCount);
  assert.equal(diagnostics.bondCount, 80);
});

test('molecular dynamics GPU neighbor-list layout is deterministic and bounded', () => {
  const layout = getMolecularNeighborGridLayout({ atomCount: 120 });

  assert.equal(layout.schema, 'peercompute.multiscale.molecular-neighbor-grid-layout.v0');
  assert.equal(layout.gridDimX, 10);
  assert.equal(layout.gridDimY, 10);
  assert.equal(layout.gridDimZ, 10);
  assert.equal(layout.cellCount, 1000);
  assert.equal(layout.maxCellOccupancy, 64);
  assert.equal(layout.maxNeighborsPerAtom, 96);
  assert.equal(layout.neighborCapacity, 120 * 96);
  assert.equal(layout.cellAtomCapacity, 1000 * 64);
  assert.ok(layout.searchRadius > layout.cellSize);

  const shifted = makeMolecularDynamicsInitialState({
    composition: { O: 5, H: 10 },
    seed: 304
  });
  for (let i = 0; i < shifted.atomCount; i += 1) {
    shifted.positionsX[i] += 3.2;
    shifted.positionsY[i] += 2.8;
    shifted.positionsZ[i] += 3.5;
  }
  const shiftedLayout = getMolecularNeighborGridLayout({
    atomCount: shifted.atomCount,
    state: shifted
  });
  assert.equal(shiftedLayout.cellCount, layout.cellCount);
  assert.equal(shiftedLayout.neighborCapacity, shifted.atomCount * 96);
  assert.equal(shiftedLayout.dynamicBounds, true);
  assert.ok(shiftedLayout.gridOrigin > layout.gridOrigin);
  assert.ok(shiftedLayout.boundsMin >= shiftedLayout.gridOrigin - 1e-6);
  assert.ok(shiftedLayout.boundsMax <= shiftedLayout.gridOrigin + shiftedLayout.gridExtent + 1e-6);
});

test('molecular dynamics append preserves live atoms while adding new species', () => {
  const water = makeMolecularDynamicsInitialState({
    composition: { O: 5, H: 10 },
    seed: 201,
    environment: { ambientTemperatureK: 294 }
  });
  const beforeDiagnostics = computeMolecularDynamicsDiagnostics(water);
  const firstPositions = water.positionsX.slice(0, water.atomCount);
  const appended = appendMolecularAtomsToState(water, {
    composition: { Na: 1, Cl: 1 },
    seed: 202,
    environment: { ambientTemperatureK: 294 }
  });
  const diagnostics = computeMolecularDynamicsDiagnostics(appended);
  const eventLedger = createMolecularReactionEventLedger(beforeDiagnostics, diagnostics);
  const sourceTerms = createMolecularReactionSourceTerms({
    beforeDiagnostics,
    afterDiagnostics: diagnostics,
    eventLedger,
    dt: 0.05
  });

  assert.equal(appended.atomCount, 17);
  assert.deepEqual(appended.positionsX.slice(0, water.atomCount), firstPositions);
  assert.equal(diagnostics.species.O, 5);
  assert.equal(diagnostics.species.H, 10);
  assert.equal(diagnostics.species.Na, 1);
  assert.equal(diagnostics.species.Cl, 1);
  assert.equal(diagnostics.molecularSpecies.H2O, 5);
  assert.equal(diagnostics.molecularSpecies.NaCl, 1);
  assert.equal(diagnostics.reactionLedger.stoichiometryClosed, true);
  assert.equal(eventLedger.schema, MOLECULAR_REACTION_EVENT_LEDGER_SCHEMA);
  assert.equal(eventLedger.formedBondCount, 1);
  assert.equal(eventLedger.brokenBondCount, 0);
  assert.equal(eventLedger.netBondCountDelta, 1);
  assert.equal(eventLedger.moleculeSpeciesDelta.NaCl, 1);
  assert.equal(eventLedger.eventIntensityProxy > 0, true);
  assert.equal(sourceTerms.schema, MOLECULAR_REACTION_SOURCE_SCHEMA);
  assert.equal(sourceTerms.rates.speciesRates.NaCl, 20);
  assert.ok(sourceTerms.rates.bondFormationRate > 0);
  assert.ok(sourceTerms.heat.heatSourceProxy > 0);
  assert.ok(sourceTerms.rates.speciesRateProxy > 0);
  assert.equal(appended.requestedComposition.Na, 1);
  assert.equal(appended.requestedComposition.Cl, 1);
  assert.equal(diagnostics.bondCount >= 11, true);
  assert.equal(diagnostics.ionicBondCount >= 1, true);
  assert.equal(diagnostics.electricalConductivityProxy > 0, true);
  assert.ok(diagnostics.bonds.some((bond) => {
    const pair = [appended.elementZ[bond.a], appended.elementZ[bond.b]].sort((a, b) => a - b);
    return pair[0] === 11 && pair[1] === 17;
  }));
});

test('molecular dynamics task has a WebGPU-first backend with CPU fallback status', async () => {
  resetMolecularDynamics();
  const result = await stepMolecularDynamics({
    stateKey: 'molecular:webgpu:probe',
    input: {
      stateKey: 'molecular:webgpu:probe',
      state: makeMolecularDynamicsInitialState({
        atomCount: 24,
        seed: 4,
        environment: { ambientTemperatureK: 294, ambientPressurePa: 101325, oxygenFraction: 0.22 },
        coupling: { fireIntensity: 0.5, reactionProgress: 0.25 }
      }),
      dt: 0.03,
      environment: { ambientTemperatureK: 294, ambientPressurePa: 101325, oxygenFraction: 0.22 },
      coupling: { fireIntensity: 0.5, radiativeHeatFlux: 50, reactionProgress: 0.25 },
      emitCommitDelta: false
    }
  });

  assert.equal(result.schema, MOLECULAR_DYNAMICS_RESULT_SCHEMA);
  assert.ok(MOLECULAR_DYNAMICS_WEBGPU_MAX_ATOMS >= 24);
  assert.ok(['webgpu-molecular-dynamics', 'cpu-molecular-dynamics'].includes(result.backend));
  if (result.backend === 'cpu-molecular-dynamics') {
    assert.equal(result.webgpuStatus, null);
    assert.equal(typeof result.webgpuError, 'string');
  } else {
    assert.equal(result.webgpuStatus?.atomCount, 24);
    assert.ok(['cell-neighbor-list', 'tiled-workgroup-all-pairs'].includes(result.webgpuStatus?.kernelMode));
    assert.equal(result.webgpuStatus?.workgroupSize, 64);
    assert.equal(result.webgpuStatus?.atomFloatStride, MOLECULAR_DYNAMICS_ATOM_FLOAT_STRIDE);
    assert.equal(result.webgpuStatus?.topologyMetadataFloatOffset, 10);
    assert.equal(result.webgpuStatus?.topologyMetadataFloatCount, 3);
    assert.deepEqual(result.webgpuStatus?.topologyMetadataFields, [
      'moleculeGroupId',
      'moleculeGroupType',
      'moleculeLocalIndex'
    ]);
    assert.equal(result.webgpuStatus?.topologyMetadataGpuVisible, true);
    assert.equal(result.webgpuStatus?.topologyMetadataRoundTripApplied, true);
    assert.equal(result.diagnostics.molecularTopologyBufferAtomFloatStride, MOLECULAR_DYNAMICS_ATOM_FLOAT_STRIDE);
    assert.equal(result.diagnostics.molecularTopologyBufferMetadataFloatCount, 3);
    assert.equal(result.diagnostics.molecularTopologyBufferGpuVisible, true);
    assert.equal(result.diagnostics.molecularTopologyBufferRoundTripApplied, true);
    if (result.webgpuStatus?.kernelMode === 'cell-neighbor-list') {
      assert.equal(result.webgpuStatus.neighborListMode, 'active');
      assert.equal(result.webgpuStatus.maxNeighborsPerAtom, 96);
      assert.equal(result.webgpuStatus.maxCellOccupancy, 64);
      assert.equal(result.webgpuStatus.overflowAtoms, 0);
      assert.equal(result.webgpuStatus.overflowCells, 0);
      assert.ok(result.webgpuStatus.candidatePairCount > 0);
      assert.ok(result.webgpuStatus.acceptedNeighborPairCount > 0);
    }
  }
});

test('molecular dynamics responds to fire and radiation forcing', async () => {
  resetMolecularDynamics();
  const base = makeMolecularDynamicsInitialState({
    atomCount: 36,
    seed: 77,
    environment: { ambientTemperatureK: 294, oxygenFraction: 0.21 },
    coupling: { fireIntensity: 0, reactionProgress: 0.18 }
  });
  const calm = await stepMolecularDynamics({
    stateKey: 'molecular:response:calm',
    input: {
      stateKey: 'molecular:response:calm',
      state: structuredClone(base),
      dt: 0.2,
      environment: { ambientTemperatureK: 294, ambientPressurePa: 101325, oxygenFraction: 0.21 },
      coupling: { fireIntensity: 0, radiativeHeatFlux: 0, waterContact: 0.1, reactionProgress: 0.18 },
      enableWebGPU: false
    }
  });
  const driven = await stepMolecularDynamics({
    stateKey: 'molecular:response:driven',
    input: {
      stateKey: 'molecular:response:driven',
      state: structuredClone(base),
      dt: 0.2,
      environment: { ambientTemperatureK: 900, ambientPressurePa: 60000, oxygenFraction: 0.8 },
      coupling: { fireIntensity: 2.4, radiativeHeatFlux: 2200, waterContact: 0, reactionProgress: 0.72 },
      enableWebGPU: false
    }
  });

  assert.ok(driven.diagnostics.meanTemperatureK > calm.diagnostics.meanTemperatureK);
  assert.ok(driven.diagnostics.maxTemperatureK > calm.diagnostics.maxTemperatureK);
  assert.ok(driven.diagnostics.reactionProgress > calm.diagnostics.reactionProgress);
  assert.ok(driven.diagnostics.ionizationFraction >= calm.diagnostics.ionizationFraction);
});

test('hydro atmosphere task advances planet weather tile and updates model packet state', async () => {
  resetHydroAtmosphere();
  const model = new MultiscaleModel();
  const initialState = makeHydroAtmosphereInitialState({
    width: 8,
    height: 4,
    seed: 20260529,
    environment: model.environment,
    oceanHeat: model.state.planet.oceanHeat
  });
  const before = computeHydroAtmosphereDiagnostics(initialState);
  const result = await stepHydroAtmosphere({
    stateKey: 'hydro:model:tile',
    input: {
      stateKey: 'hydro:model:tile',
      taskId: 'hydro:model:tile',
      state: initialState,
      dt: 0.04,
      environment: model.environment,
      coupling: { oceanHeat: model.state.planet.oceanHeat },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.schema, HYDRO_ATMOSPHERE_RESULT_SCHEMA);
  assert.equal(result.value.backend, 'cpu-hydro-atmosphere');
  assert.equal(result.commitDelta.payload.schema, HYDRO_ATMOSPHERE_DELTA_SCHEMA);
  assert.equal(result.value.diagnostics.cellCount, 32);
  assert.ok(Number.isFinite(result.value.diagnostics.cloudCover));
  assert.ok(Number.isFinite(result.value.diagnostics.maxWindMps));
  assert.notEqual(result.value.diagnostics.kineticEnergy, before.kineticEnergy);

  const hydro = model.applyHydroAtmosphereResult(result.value);
  const packet = model.createPacket();
  assert.equal(hydro.backend, 'cpu-hydro-atmosphere');
  assert.equal(packet.upward.aggregateState.hydroAtmosphere.backend, 'cpu-hydro-atmosphere');
  assert.equal(packet.upward.aggregateState.hydroAtmosphere.cellCount, 32);
  assert.equal(typeof packet.upward.closures.weatherCloudCover, 'number');
});

test('hydro atmosphere task has a WebGPU-first backend with CPU fallback status', async () => {
  resetHydroAtmosphere();
  const result = await stepHydroAtmosphere({
    stateKey: 'hydro:webgpu:probe',
    input: {
      stateKey: 'hydro:webgpu:probe',
      state: makeHydroAtmosphereInitialState({ width: 8, height: 4, seed: 4 }),
      dt: 0.02,
      environment: { ambientTemperatureK: 294, stellarFlux: 1, gravityMps2: 9.8 },
      coupling: { oceanHeat: 0.5 },
      emitCommitDelta: false
    }
  });

  assert.equal(result.schema, HYDRO_ATMOSPHERE_RESULT_SCHEMA);
  assert.ok(HYDRO_ATMOSPHERE_WEBGPU_MAX_CELLS >= 8 * 4);
  assert.ok(['webgpu-hydro-atmosphere', 'cpu-hydro-atmosphere'].includes(result.backend));
  if (result.backend === 'cpu-hydro-atmosphere') {
    assert.equal(result.webgpuStatus?.fallback, true);
    assert.equal(typeof result.webgpuStatus.disabledReason, 'string');
  } else {
    assert.equal(result.webgpuStatus?.width, 8);
    assert.equal(result.webgpuStatus?.height, 4);
  }
});

test('radiation opacity task advances radiative tile and updates model packet state', async () => {
  resetRadiationOpacity();
  const model = new MultiscaleModel();
  const initialState = makeRadiationOpacityInitialState({
    width: 8,
    height: 4,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      fireIntensity: model.state.surface.fireIntensity,
      cloudCover: model.state.planet.cloudCover,
      smokeFraction: model.state.surface.smokeFraction
    }
  });
  const before = computeRadiationOpacityDiagnostics(initialState);
  const result = await stepRadiationOpacity({
    stateKey: 'radiation:model:tile',
    input: {
      stateKey: 'radiation:model:tile',
      taskId: 'radiation:model:tile',
      state: initialState,
      dt: 0.03,
      environment: model.environment,
      coupling: {
        fireIntensity: model.state.surface.fireIntensity,
        cloudCover: model.state.planet.cloudCover,
        smokeFraction: model.state.surface.smokeFraction
      },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.schema, RADIATION_OPACITY_RESULT_SCHEMA);
  assert.equal(result.value.backend, 'cpu-radiation-opacity');
  assert.equal(result.commitDelta.payload.schema, RADIATION_OPACITY_DELTA_SCHEMA);
  assert.equal(result.value.diagnostics.cellCount, 32);
  assert.ok(Number.isFinite(result.value.diagnostics.opticalDepth));
  assert.ok(Number.isFinite(result.value.diagnostics.greenhouseFactor));
  assert.notEqual(result.value.diagnostics.totalRadiationEnergy, before.totalRadiationEnergy);

  const radiation = model.applyRadiationOpacityResult(result.value);
  const packet = model.createPacket();
  assert.equal(radiation.backend, 'cpu-radiation-opacity');
  assert.ok(model.state.surface.radiativeHeatFlux > 0);
  assert.equal(packet.upward.aggregateState.radiationOpacity.backend, 'cpu-radiation-opacity');
  assert.equal(packet.upward.aggregateState.radiationOpacity.cellCount, 32);
  assert.equal(typeof packet.upward.closures.radiationOpticalDepth, 'number');
  assert.equal(typeof packet.upward.closures.surfaceRadiativeHeatFlux, 'number');
});

test('radiation opacity task has a WebGPU-first backend with CPU fallback status', async () => {
  resetRadiationOpacity();
  const result = await stepRadiationOpacity({
    stateKey: 'radiation:webgpu:probe',
    input: {
      stateKey: 'radiation:webgpu:probe',
      state: makeRadiationOpacityInitialState({ width: 8, height: 4, seed: 4 }),
      dt: 0.02,
      environment: { ambientTemperatureK: 294, stellarFlux: 1 },
      coupling: { fireIntensity: 0.7, cloudCover: 0.5, smokeFraction: 0.12 },
      emitCommitDelta: false
    }
  });

  assert.equal(result.schema, RADIATION_OPACITY_RESULT_SCHEMA);
  assert.ok(RADIATION_OPACITY_WEBGPU_MAX_CELLS >= 8 * 4);
  assert.ok(['webgpu-radiation-opacity', 'cpu-radiation-opacity'].includes(result.backend));
  if (result.backend === 'cpu-radiation-opacity') {
    assert.equal(result.webgpuStatus, null);
    assert.equal(typeof result.webgpuError, 'string');
  } else {
    assert.equal(result.webgpuStatus?.width, 8);
    assert.equal(result.webgpuStatus?.height, 4);
  }
});

test('radiation opacity responds monotonically to opacity and temperature inputs', async () => {
  resetRadiationOpacity();
  const baseState = makeRadiationOpacityInitialState({
    width: 6,
    height: 4,
    seed: 8,
    environment: { ambientTemperatureK: 294, stellarFlux: 1 },
    coupling: { fireIntensity: 0.4, cloudCover: 0.2, smokeFraction: 0.02 }
  });
  const lowOpacity = await stepRadiationOpacity({
    stateKey: 'radiation:low-opacity',
    input: {
      stateKey: 'radiation:low-opacity',
      state: { ...baseState, opacity: new Array(baseState.width * baseState.height).fill(0.03) },
      dt: 0.02,
      environment: { ambientTemperatureK: 294, stellarFlux: 1 },
      coupling: { fireIntensity: 0.4, cloudCover: 0.1, smokeFraction: 0.01 },
      enableWebGPU: false
    }
  });
  const highOpacity = await stepRadiationOpacity({
    stateKey: 'radiation:high-opacity',
    input: {
      stateKey: 'radiation:high-opacity',
      state: { ...baseState, opacity: new Array(baseState.width * baseState.height).fill(0.8) },
      dt: 0.02,
      environment: { ambientTemperatureK: 294, stellarFlux: 1 },
      coupling: { fireIntensity: 0.4, cloudCover: 0.9, smokeFraction: 0.5 },
      enableWebGPU: false
    }
  });
  assert.ok(highOpacity.diagnostics.opticalDepth > lowOpacity.diagnostics.opticalDepth);
  assert.ok(highOpacity.diagnostics.greenhouseFactor > lowOpacity.diagnostics.greenhouseFactor);

  const cool = makeRadiationOpacityInitialState({ width: 4, height: 4, seed: 9 });
  const hot = makeRadiationOpacityInitialState({ width: 4, height: 4, seed: 9 });
  hot.materialTemperatureK = hot.materialTemperatureK.map((value) => value + 320);
  const coolDiag = computeRadiationOpacityDiagnostics(cool);
  const hotResult = await stepRadiationOpacity({
    stateKey: 'radiation:hot',
    input: {
      stateKey: 'radiation:hot',
      state: hot,
      dt: 0.02,
      enableWebGPU: false
    }
  });
  assert.ok(hotResult.diagnostics.totalEmittedPower > coolDiag.totalEmittedPower);
});

test('stellar fusion task advances plasma tile and updates model packet state', async () => {
  resetStellarFusion();
  const model = new MultiscaleModel();
  const initialState = makeStellarFusionInitialState({
    width: 8,
    height: 4,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      metallicity: model.state.galaxy.metallicity,
      radiationPressure: model.state.solar.radiationPressure
    }
  });
  const before = computeStellarFusionDiagnostics(initialState);
  const result = await stepStellarFusion({
    stateKey: 'stellar:model:core',
    input: {
      stateKey: 'stellar:model:core',
      taskId: 'stellar:model:core',
      state: initialState,
      dt: 0.04,
      environment: model.environment,
      coupling: {
        metallicity: model.state.galaxy.metallicity,
        radiationPressure: model.state.solar.radiationPressure,
        opacity: 0.08,
        densityCompression: 0.5,
        coreTemperatureBias: 1
      },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.schema, STELLAR_FUSION_RESULT_SCHEMA);
  assert.equal(result.value.backend, 'cpu-stellar-fusion');
  assert.equal(result.commitDelta.payload.schema, STELLAR_FUSION_DELTA_SCHEMA);
  assert.equal(result.value.diagnostics.cellCount, 32);
  assert.ok(Number.isFinite(result.value.diagnostics.coreTemperatureK));
  assert.ok(Number.isFinite(result.value.diagnostics.fusionPowerProxy));
  assert.ok(result.value.diagnostics.fusionPowerProxy >= 0);
  assert.notEqual(result.value.diagnostics.totalEnergyDensity, before.totalEnergyDensity);

  const stellar = model.applyStellarFusionResult(result.value);
  const packet = model.createPacket();
  assert.equal(stellar.backend, 'cpu-stellar-fusion');
  assert.equal(packet.upward.aggregateState.stellarFusion.backend, 'cpu-stellar-fusion');
  assert.equal(packet.upward.aggregateState.stellarFusion.cellCount, 32);
  assert.equal(typeof packet.upward.closures.stellarFusionPower, 'number');
  assert.equal(typeof packet.upward.closures.stellarCoreTemperatureK, 'number');
  assert.equal(typeof packet.upward.closures.stellarHydrogenFraction, 'number');
});

test('stellar fusion task has a WebGPU-first backend with CPU fallback status', async () => {
  resetStellarFusion();
  const result = await stepStellarFusion({
    stateKey: 'stellar:webgpu:probe',
    input: {
      stateKey: 'stellar:webgpu:probe',
      state: makeStellarFusionInitialState({ width: 8, height: 4, seed: 4 }),
      dt: 0.02,
      environment: { stellarFlux: 1, gravityMps2: 9.8 },
      coupling: { metallicity: 0.013, radiationPressure: 1, opacity: 0.08 },
      emitCommitDelta: false
    }
  });

  assert.equal(result.schema, STELLAR_FUSION_RESULT_SCHEMA);
  assert.ok(STELLAR_FUSION_WEBGPU_MAX_CELLS >= 8 * 4);
  assert.ok(['webgpu-stellar-fusion', 'cpu-stellar-fusion'].includes(result.backend));
  if (result.backend === 'cpu-stellar-fusion') {
    assert.equal(result.webgpuStatus, null);
    assert.equal(typeof result.webgpuError, 'string');
  } else {
    assert.equal(result.webgpuStatus?.width, 8);
    assert.equal(result.webgpuStatus?.height, 4);
  }
});

test('stellar fusion power responds to hotter denser core state', async () => {
  resetStellarFusion();
  const base = makeStellarFusionInitialState({
    width: 6,
    height: 4,
    seed: 77,
    environment: { stellarFlux: 1 },
    coupling: { coreTemperatureBias: 0.8 }
  });
  const boosted = structuredClone(base);
  boosted.temperatureK = boosted.temperatureK.map((value) => value * 1.28);
  boosted.densityKgM3 = boosted.densityKgM3.map((value) => value * 1.18);
  const calm = await stepStellarFusion({
    stateKey: 'stellar:response:calm',
    input: {
      stateKey: 'stellar:response:calm',
      state: base,
      dt: 0.02,
      enableWebGPU: false
    }
  });
  const hot = await stepStellarFusion({
    stateKey: 'stellar:response:hot',
    input: {
      stateKey: 'stellar:response:hot',
      state: boosted,
      dt: 0.02,
      enableWebGPU: false
    }
  });

  assert.ok(hot.diagnostics.fusionPowerProxy > calm.diagnostics.fusionPowerProxy);
  assert.ok(hot.diagnostics.coreTemperatureK > calm.diagnostics.coreTemperatureK);
});

test('magnetosphere plasma task advances MHD tile and updates model packet state', async () => {
  resetMagnetospherePlasma();
  const model = new MultiscaleModel();
  model.applyStellarFusionResult({
    backend: 'test-stellar',
    sequence: 1,
    diagnostics: {
      width: 4,
      height: 4,
      cellCount: 16,
      meanTemperatureK: 12000000,
      coreTemperatureK: 18000000,
      meanDensityKgM3: 120000,
      coreDensityKgM3: 150000,
      meanHydrogenFraction: 0.68,
      meanHeliumFraction: 0.3,
      meanPressurePa: 1e16,
      fusionPowerProxy: 40,
      luminosityProxy: 40,
      neutrinoLossProxy: 0.02
    },
    conservation: { fusionEnergyDelta: 1, hydrogenBurnedDelta: 0.01, heliumProducedDelta: 0.009 }
  });
  const initialState = makeMagnetospherePlasmaInitialState({
    width: 8,
    height: 4,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      stellarLuminosityFactor: model.state.solar.stellarFusion.luminosityFactor,
      radiationPressure: model.state.solar.radiationPressure,
      maxwellFieldEnergy: 0.5,
      poyntingFlux: [0.1, 0.02, 0]
    }
  });
  const before = computeMagnetosphereDiagnostics(initialState);
  const result = await stepMagnetospherePlasma({
    stateKey: 'mhd:model:tile',
    input: {
      stateKey: 'mhd:model:tile',
      taskId: 'mhd:model:tile',
      state: initialState,
      dt: 0.05,
      environment: model.environment,
      coupling: {
        stellarLuminosityFactor: model.state.solar.stellarFusion.luminosityFactor,
        radiationPressure: model.state.solar.radiationPressure,
        maxwellFieldEnergy: 0.5,
        poyntingFlux: [0.1, 0.02, 0],
        magneticSeed: 0.4
      },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.schema, MAGNETOSPHERE_PLASMA_RESULT_SCHEMA);
  assert.equal(result.value.backend, 'cpu-magnetosphere-plasma');
  assert.equal(result.commitDelta.payload.schema, MAGNETOSPHERE_PLASMA_DELTA_SCHEMA);
  assert.equal(result.value.diagnostics.cellCount, 32);
  assert.ok(Number.isFinite(result.value.diagnostics.solarWindPressure));
  assert.ok(Number.isFinite(result.value.diagnostics.reconnectionRate));
  assert.ok(Number.isFinite(result.value.diagnostics.alfvenSpeed));
  assert.notEqual(result.value.diagnostics.plasmaEnergy, before.plasmaEnergy);

  const mhd = model.applyMagnetospherePlasmaResult(result.value);
  const packet = model.createPacket();
  assert.equal(mhd.backend, 'cpu-magnetosphere-plasma');
  assert.equal(packet.upward.aggregateState.magnetosphere.backend, 'cpu-magnetosphere-plasma');
  assert.equal(packet.upward.aggregateState.magnetosphere.cellCount, 32);
  assert.equal(typeof packet.upward.closures.magnetosphereSolarWindPressure, 'number');
  assert.equal(typeof packet.upward.closures.magnetosphereReconnectionRate, 'number');
  assert.equal(typeof packet.upward.closures.magnetosphereIonization, 'number');
});

test('magnetosphere plasma task has a WebGPU-first backend with CPU fallback status', async () => {
  resetMagnetospherePlasma();
  const result = await stepMagnetospherePlasma({
    stateKey: 'mhd:webgpu:probe',
    input: {
      stateKey: 'mhd:webgpu:probe',
      state: makeMagnetospherePlasmaInitialState({ width: 8, height: 4, seed: 4 }),
      dt: 0.02,
      environment: { stellarFlux: 1.1, gravityMps2: 9.8, ambientPressurePa: 101325 },
      coupling: { stellarLuminosityFactor: 1.2, radiationPressure: 1.1, maxwellFieldEnergy: 0.2 },
      emitCommitDelta: false
    }
  });

  assert.equal(result.schema, MAGNETOSPHERE_PLASMA_RESULT_SCHEMA);
  assert.ok(MAGNETOSPHERE_PLASMA_WEBGPU_MAX_CELLS >= 8 * 4);
  assert.ok(['webgpu-magnetosphere-plasma', 'cpu-magnetosphere-plasma'].includes(result.backend));
  if (result.backend === 'cpu-magnetosphere-plasma') {
    assert.equal(result.webgpuStatus, null);
    assert.equal(typeof result.webgpuError, 'string');
  } else {
    assert.equal(result.webgpuStatus?.width, 8);
    assert.equal(result.webgpuStatus?.height, 4);
  }
});

test('magnetosphere plasma responds to stronger stellar and Maxwell forcing', async () => {
  resetMagnetospherePlasma();
  const base = makeMagnetospherePlasmaInitialState({
    width: 8,
    height: 4,
    seed: 77,
    environment: { stellarFlux: 0.8 },
    coupling: { stellarLuminosityFactor: 0.8, radiationPressure: 0.5, maxwellFieldEnergy: 0.01 }
  });
  const calm = await stepMagnetospherePlasma({
    stateKey: 'mhd:response:calm',
    input: {
      stateKey: 'mhd:response:calm',
      state: structuredClone(base),
      dt: 0.08,
      environment: { stellarFlux: 0.8, ambientPressurePa: 101325 },
      coupling: { stellarLuminosityFactor: 0.8, radiationPressure: 0.5, maxwellFieldEnergy: 0.01 },
      enableWebGPU: false
    }
  });
  const active = await stepMagnetospherePlasma({
    stateKey: 'mhd:response:active',
    input: {
      stateKey: 'mhd:response:active',
      state: structuredClone(base),
      dt: 0.08,
      environment: { stellarFlux: 1.8, ambientPressurePa: 101325 },
      coupling: { stellarLuminosityFactor: 2.2, radiationPressure: 2, maxwellFieldEnergy: 2, poyntingFlux: [1, 0.4, 0] },
      enableWebGPU: false
    }
  });

  assert.ok(active.diagnostics.meanTemperatureK > calm.diagnostics.meanTemperatureK);
  assert.ok(active.diagnostics.solarWindPressure > calm.diagnostics.solarWindPressure);
  assert.ok(active.diagnostics.reconnectionRate >= calm.diagnostics.reconnectionRate);
});

test('PIC plasma patch task advances kinetic patch and updates model packet state', async () => {
  resetPicPlasmaPatch();
  const model = new MultiscaleModel();
  model.applyMagnetospherePlasmaResult({
    backend: 'test-mhd',
    sequence: 3,
    diagnostics: {
      width: 8,
      height: 4,
      cellCount: 32,
      meanDensity: 0.3,
      meanTemperatureK: 8200,
      meanIonizationFraction: 0.46,
      magneticEnergy: 0.8,
      kineticEnergy: 0.3,
      plasmaEnergy: 0.4,
      alfvenSpeed: 1.2,
      solarWindPressure: 2.4,
      magnetopauseRadius: 9.1,
      reconnectionRate: 0.9,
      currentSheetIntensity: 0.5,
      divergenceBProxy: 0.02
    },
    conservation: { massDrift: 0, magneticEnergyDelta: 0.01, plasmaEnergyDelta: 0.02 }
  });
  const initialState = makePicPlasmaPatchInitialState({
    particleCount: 32,
    gridWidth: 8,
    gridHeight: 4,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      reconnectionRate: model.state.solar.magnetosphere.reconnectionRate,
      solarWindPressure: model.state.solar.magnetosphere.solarWindPressure,
      ionization: model.state.solar.magnetosphere.meanIonizationFraction,
      alfvenSpeed: model.state.solar.magnetosphere.alfvenSpeed,
      maxwellFieldEnergy: 0.3,
      poyntingFlux: [0.08, 0.02, 0]
    }
  });
  const before = computePicPlasmaDiagnostics(initialState);
  const result = await stepPicPlasmaPatch({
    stateKey: 'pic:model:patch',
    input: {
      stateKey: 'pic:model:patch',
      taskId: 'pic:model:patch',
      state: initialState,
      dt: 0.04,
      environment: model.environment,
      coupling: {
        reconnectionRate: model.state.solar.magnetosphere.reconnectionRate,
        solarWindPressure: model.state.solar.magnetosphere.solarWindPressure,
        ionization: model.state.solar.magnetosphere.meanIonizationFraction,
        alfvenSpeed: model.state.solar.magnetosphere.alfvenSpeed,
        meanTemperatureK: model.state.solar.magnetosphere.meanTemperatureK,
        maxwellFieldEnergy: 0.3,
        poyntingFlux: [0.08, 0.02, 0]
      },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.schema, PIC_PLASMA_PATCH_RESULT_SCHEMA);
  assert.equal(result.value.backend, 'cpu-pic-plasma-patch');
  assert.equal(result.commitDelta.payload.schema, PIC_PLASMA_PATCH_DELTA_SCHEMA);
  assert.equal(result.value.diagnostics.particleCount, 32);
  assert.equal(result.value.diagnostics.cellCount, 32);
  assert.ok(Number.isFinite(result.value.diagnostics.currentDensity));
  assert.ok(Number.isFinite(result.value.diagnostics.reconnectionHeating));
  assert.notEqual(result.value.diagnostics.fieldEnergy, before.fieldEnergy);

  const pic = model.applyPicPlasmaPatchResult(result.value);
  const packet = model.createPacket();
  assert.equal(pic.backend, 'cpu-pic-plasma-patch');
  assert.equal(packet.upward.aggregateState.picPlasmaPatch.backend, 'cpu-pic-plasma-patch');
  assert.equal(packet.upward.aggregateState.picPlasmaPatch.particleCount, 32);
  assert.equal(typeof packet.upward.closures.picChargeImbalance, 'number');
  assert.equal(typeof packet.upward.closures.picCurrentDensity, 'number');
  assert.equal(typeof packet.upward.closures.picReconnectionHeating, 'number');
  assert.equal(packet.conservation.chargeAudit, 'reduced-pic-and-molecular-proxy');
});

test('PIC plasma patch task has a WebGPU-first backend with CPU fallback status', async () => {
  resetPicPlasmaPatch();
  const result = await stepPicPlasmaPatch({
    stateKey: 'pic:webgpu:probe',
    input: {
      stateKey: 'pic:webgpu:probe',
      state: makePicPlasmaPatchInitialState({ particleCount: 32, gridWidth: 8, gridHeight: 4, seed: 4 }),
      dt: 0.02,
      environment: { stellarFlux: 1.1, gravityMps2: 9.8, ambientPressurePa: 101325 },
      coupling: { reconnectionRate: 0.6, solarWindPressure: 1.4, ionization: 0.3, alfvenSpeed: 0.8, maxwellFieldEnergy: 0.2 },
      emitCommitDelta: false
    }
  });

  assert.equal(result.schema, PIC_PLASMA_PATCH_RESULT_SCHEMA);
  assert.ok(PIC_PLASMA_PATCH_WEBGPU_MAX_PARTICLES >= 32);
  assert.ok(PIC_PLASMA_PATCH_WEBGPU_MAX_CELLS >= 8 * 4);
  assert.ok(['webgpu-pic-plasma-patch', 'cpu-pic-plasma-patch'].includes(result.backend));
  if (result.backend === 'cpu-pic-plasma-patch') {
    assert.equal(result.webgpuStatus, null);
    assert.equal(typeof result.webgpuError, 'string');
  } else {
    assert.equal(result.webgpuStatus?.particleCount, 32);
    assert.equal(result.webgpuStatus?.gridWidth, 8);
  }
});

test('PIC plasma patch responds to stronger reconnection forcing', async () => {
  resetPicPlasmaPatch();
  const base = makePicPlasmaPatchInitialState({
    particleCount: 48,
    gridWidth: 8,
    gridHeight: 4,
    seed: 77,
    environment: { ambientTemperatureK: 294 },
    coupling: { reconnectionRate: 0.08, solarWindPressure: 0.4, ionization: 0.15, alfvenSpeed: 0.2 }
  });
  const calm = await stepPicPlasmaPatch({
    stateKey: 'pic:response:calm',
    input: {
      stateKey: 'pic:response:calm',
      state: structuredClone(base),
      dt: 0.06,
      environment: { ambientTemperatureK: 294 },
      coupling: { reconnectionRate: 0.08, solarWindPressure: 0.4, ionization: 0.15, alfvenSpeed: 0.2, maxwellFieldEnergy: 0.01 },
      enableWebGPU: false
    }
  });
  const active = await stepPicPlasmaPatch({
    stateKey: 'pic:response:active',
    input: {
      stateKey: 'pic:response:active',
      state: structuredClone(base),
      dt: 0.06,
      environment: { ambientTemperatureK: 900 },
      coupling: { reconnectionRate: 1.8, solarWindPressure: 4, ionization: 0.6, alfvenSpeed: 2.2, maxwellFieldEnergy: 1.5, poyntingFlux: [0.6, 0.2, 0] },
      enableWebGPU: false
    }
  });

  assert.ok(active.diagnostics.kineticEnergy > calm.diagnostics.kineticEnergy);
  assert.ok(active.diagnostics.currentDensity >= calm.diagnostics.currentDensity);
  assert.ok(active.diagnostics.reconnectionHeating >= calm.diagnostics.reconnectionHeating);
});

test('relativistic correction task advances orbital samples and updates model packet state', async () => {
  resetRelativisticCorrection();
  const model = new MultiscaleModel();
  model.applyStellarFusionResult({
    backend: 'test-stellar',
    sequence: 1,
    diagnostics: {
      width: 4,
      height: 4,
      cellCount: 16,
      meanTemperatureK: 14000000,
      coreTemperatureK: 21000000,
      meanDensityKgM3: 140000,
      coreDensityKgM3: 180000,
      meanHydrogenFraction: 0.67,
      meanHeliumFraction: 0.31,
      meanPressurePa: 1e16,
      fusionPowerProxy: 52,
      luminosityProxy: 52,
      neutrinoLossProxy: 0.02
    },
    conservation: { fusionEnergyDelta: 1, hydrogenBurnedDelta: 0.01, heliumProducedDelta: 0.009 }
  });
  const initialState = makeRelativisticCorrectionInitialState({
    sampleCount: 32,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      stellarLuminosityFactor: model.state.solar.stellarFusion.luminosityFactor,
      radiationPressure: model.state.solar.radiationPressure,
      solarWindPressure: 1.4,
      alfvenSpeed: 0.8,
      maxwellFieldEnergy: 0.3,
      picKineticEnergy: 0.2
    }
  });
  const before = computeRelativisticCorrectionDiagnostics(initialState);
  const result = await stepRelativisticCorrection({
    stateKey: 'relativity:model:shell',
    input: {
      stateKey: 'relativity:model:shell',
      taskId: 'relativity:model:shell',
      state: initialState,
      dt: 0.04,
      environment: model.environment,
      coupling: {
        stellarLuminosityFactor: model.state.solar.stellarFusion.luminosityFactor,
        radiationPressure: model.state.solar.radiationPressure,
        solarWindPressure: 1.4,
        alfvenSpeed: 0.8,
        maxwellFieldEnergy: 0.3,
        poyntingFlux: [0.08, 0.02, 0],
        picKineticEnergy: 0.2,
        picParticleEscapeFraction: 0.03
      },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.schema, RELATIVISTIC_CORRECTION_RESULT_SCHEMA);
  assert.equal(result.value.backend, 'cpu-relativistic-correction');
  assert.equal(result.commitDelta.payload.schema, RELATIVISTIC_CORRECTION_DELTA_SCHEMA);
  assert.equal(result.value.diagnostics.sampleCount, 32);
  assert.ok(Number.isFinite(result.value.diagnostics.maxSpeedFractionC));
  assert.ok(Number.isFinite(result.value.diagnostics.meanLorentzFactor));
  assert.ok(Number.isFinite(result.value.diagnostics.gravitationalRedshiftProxy));
  assert.notEqual(result.value.diagnostics.relativisticEnergyProxy, before.relativisticEnergyProxy);

  const relativity = model.applyRelativisticCorrectionResult(result.value);
  const packet = model.createPacket();
  assert.equal(relativity.backend, 'cpu-relativistic-correction');
  assert.equal(packet.upward.aggregateState.relativity.backend, 'cpu-relativistic-correction');
  assert.equal(packet.upward.aggregateState.relativity.sampleCount, 32);
  assert.equal(typeof packet.upward.closures.relativisticMaxSpeedFractionC, 'number');
  assert.equal(typeof packet.upward.closures.relativisticTimeDilation, 'number');
  assert.equal(typeof packet.upward.closures.relativisticLensing, 'number');
});

test('relativistic correction task has a WebGPU-first backend with CPU fallback status', async () => {
  resetRelativisticCorrection();
  const result = await stepRelativisticCorrection({
    stateKey: 'relativity:webgpu:probe',
    input: {
      stateKey: 'relativity:webgpu:probe',
      state: makeRelativisticCorrectionInitialState({ sampleCount: 32, seed: 4 }),
      dt: 0.02,
      environment: { stellarFlux: 1.1, gravityMps2: 9.8, ambientPressurePa: 101325 },
      coupling: { stellarLuminosityFactor: 1.1, radiationPressure: 1.2, maxwellFieldEnergy: 0.2, alfvenSpeed: 0.8 },
      emitCommitDelta: false
    }
  });

  assert.equal(result.schema, RELATIVISTIC_CORRECTION_RESULT_SCHEMA);
  assert.ok(RELATIVISTIC_CORRECTION_WEBGPU_MAX_SAMPLES >= 32);
  assert.ok(['webgpu-relativistic-correction', 'cpu-relativistic-correction'].includes(result.backend));
  if (result.backend === 'cpu-relativistic-correction') {
    assert.equal(result.webgpuStatus, null);
    assert.equal(typeof result.webgpuError, 'string');
  } else {
    assert.equal(result.webgpuStatus?.sampleCount, 32);
  }
});

test('relativistic correction responds to compact high-field forcing', async () => {
  resetRelativisticCorrection();
  const base = makeRelativisticCorrectionInitialState({
    sampleCount: 48,
    seed: 77,
    environment: { stellarFlux: 0.8 },
    coupling: { compactness: 0.001, radiationPressure: 0.4, maxwellFieldEnergy: 0.01 }
  });
  const calm = await stepRelativisticCorrection({
    stateKey: 'relativity:response:calm',
    input: {
      stateKey: 'relativity:response:calm',
      state: structuredClone(base),
      dt: 0.06,
      environment: { stellarFlux: 0.8 },
      coupling: { compactness: 0.001, radiationPressure: 0.4, maxwellFieldEnergy: 0.01 },
      enableWebGPU: false
    }
  });
  const compact = await stepRelativisticCorrection({
    stateKey: 'relativity:response:compact',
    input: {
      stateKey: 'relativity:response:compact',
      state: structuredClone(base),
      dt: 0.06,
      environment: { stellarFlux: 1.8 },
      coupling: { compactness: 0.02, radiationPressure: 2, maxwellFieldEnergy: 2, poyntingFlux: [0.6, 0.2, 0], alfvenSpeed: 2.2, picKineticEnergy: 1.5 },
      enableWebGPU: false
    }
  });

  assert.ok(compact.diagnostics.maxSpeedFractionC > calm.diagnostics.maxSpeedFractionC);
  assert.ok(compact.diagnostics.meanLorentzFactor > calm.diagnostics.meanLorentzFactor);
  assert.ok(compact.diagnostics.gravitationalRedshiftProxy > calm.diagnostics.gravitationalRedshiftProxy);
  assert.ok(compact.diagnostics.lensingDeflectionArcsecProxy > calm.diagnostics.lensingDeflectionArcsecProxy);
});

test('combustion plume task advances fire tile and updates model packet state', async () => {
  resetCombustionPlume();
  const model = new MultiscaleModel();
  const initialState = makeCombustionPlumeInitialState({
    width: 8,
    height: 4,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      fireIntensity: 0.9,
      waterContact: 0.02,
      radiativeHeatFlux: 80
    }
  });
  const before = computeCombustionPlumeDiagnostics(initialState);
  const result = await stepCombustionPlume({
    stateKey: 'combustion:model:tile',
    input: {
      stateKey: 'combustion:model:tile',
      taskId: 'combustion:model:tile',
      state: initialState,
      dt: 0.04,
      environment: model.environment,
      coupling: {
        fireIntensity: 0.9,
        waterContact: 0.02,
        radiativeHeatFlux: 80
      },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.schema, COMBUSTION_PLUME_RESULT_SCHEMA);
  assert.equal(result.value.backend, 'cpu-combustion-plume');
  assert.equal(result.commitDelta.payload.schema, COMBUSTION_PLUME_DELTA_SCHEMA);
  assert.equal(result.value.diagnostics.cellCount, 32);
  assert.ok(Number.isFinite(result.value.diagnostics.fireAreaFraction));
  assert.ok(Number.isFinite(result.value.diagnostics.smokeColumn));
  assert.ok(Number.isFinite(result.value.diagnostics.fuelRemaining));
  assert.ok(Number.isFinite(result.value.diagnostics.plumeRise));
  assert.ok(Number.isFinite(result.value.diagnostics.buoyancyFlux));
  assert.ok(Number.isFinite(result.value.diagnostics.oxygenDepletion));
  assert.ok(result.value.diagnostics.heatReleaseMean >= before.heatReleaseMean);

  const plume = model.applyCombustionPlumeResult(result.value);
  const packet = model.createPacket();
  assert.equal(plume.backend, 'cpu-combustion-plume');
  assert.equal(packet.upward.aggregateState.combustionPlume.backend, 'cpu-combustion-plume');
  assert.equal(packet.upward.aggregateState.combustionPlume.cellCount, 32);
  assert.equal(typeof packet.upward.aggregateState.combustionPlume.plumeRise, 'number');
  assert.equal(typeof packet.upward.aggregateState.combustionPlume.buoyancyFlux, 'number');
  assert.equal(typeof packet.upward.aggregateState.combustionPlume.oxygenDepletion, 'number');
  assert.equal(typeof packet.upward.closures.combustionFireArea, 'number');
  assert.equal(typeof packet.upward.closures.combustionSmokeColumn, 'number');
  assert.equal(typeof packet.upward.closures.combustionPlumeRise, 'number');
  assert.equal(typeof packet.upward.closures.combustionBuoyancyFlux, 'number');
  assert.equal(typeof packet.upward.closures.combustionOxygenDepletion, 'number');
});

test('combustion plume task has a WebGPU-first backend with CPU fallback status', async () => {
  resetCombustionPlume();
  const result = await stepCombustionPlume({
    stateKey: 'combustion:webgpu:probe',
    input: {
      stateKey: 'combustion:webgpu:probe',
      state: makeCombustionPlumeInitialState({ width: 8, height: 4, seed: 4 }),
      dt: 0.02,
      environment: { ambientTemperatureK: 294, oxygenFraction: 0.21 },
      coupling: { fireIntensity: 0.7, waterContact: 0.04, radiativeHeatFlux: 40 },
      emitCommitDelta: false
    }
  });

  assert.equal(result.schema, COMBUSTION_PLUME_RESULT_SCHEMA);
  assert.ok(COMBUSTION_PLUME_WEBGPU_MAX_CELLS >= 8 * 4);
  assert.ok(['webgpu-combustion-plume', 'cpu-combustion-plume'].includes(result.backend));
  if (result.backend === 'cpu-combustion-plume') {
    assert.equal(result.webgpuStatus, null);
    assert.equal(typeof result.webgpuError, 'string');
  } else {
    assert.equal(result.webgpuStatus?.width, 8);
    assert.equal(result.webgpuStatus?.height, 4);
  }
});

test('combustion plume wind advects smoke centroid and emits buoyancy diagnostics', async () => {
  resetCombustionPlume();
  const environment = { ambientTemperatureK: 294, oxygenFraction: 0.21 };
  const makePlumeState = () => {
    const state = makeCombustionPlumeInitialState({
      width: 12,
      height: 6,
      seed: 99,
      environment,
      coupling: { fireIntensity: 0, waterContact: 0 }
    });
    state.temperatureK.fill(294);
    state.fuel.fill(0.4);
    state.oxygenFraction.fill(0.21);
    state.smoke.fill(0);
    state.water.fill(0);
    state.heatRelease.fill(0);
    state.windX.fill(0);
    state.windY.fill(0);
    for (const [x, y, smoke, temperatureK] of [
      [3, 3, 1.4, 900],
      [3, 2, 0.9, 860],
      [4, 3, 0.7, 820]
    ]) {
      const cell = y * state.width + x;
      state.smoke[cell] = smoke;
      state.temperatureK[cell] = temperatureK;
    }
    return state;
  };
  const run = async (stateKey, wind) => {
    let result = null;
    for (let step = 0; step < 8; step += 1) {
      result = await stepCombustionPlume({
        stateKey,
        input: {
          stateKey,
          state: step === 0 ? makePlumeState() : undefined,
          dt: 0.16,
          environment,
          coupling: { fireIntensity: 0, waterContact: 0, wind },
          enableWebGPU: false
        }
      });
    }
    return result.diagnostics;
  };

  const calm = await run('combustion:wind:calm', [0, 0]);
  const east = await run('combustion:wind:east', [10, 0]);
  const west = await run('combustion:wind:west', [-10, 0]);

  assert.ok(Number.isFinite(east.smokeCentroidX));
  assert.ok(Number.isFinite(east.smokeCentroidY));
  assert.ok(Number.isFinite(east.plumeRise));
  assert.ok(Number.isFinite(east.buoyancyFlux));
  assert.ok(Number.isFinite(east.oxygenDepletion));
  assert.ok(east.smokeCentroidX > calm.smokeCentroidX + 0.03);
  assert.ok(west.smokeCentroidX < calm.smokeCentroidX - 0.03);
  assert.ok(east.plumeRise >= 0 && east.plumeRise <= 1);
  assert.ok(east.buoyancyFlux > 0);
});

test('combustion plume water contact suppresses heat release and fire area', async () => {
  resetCombustionPlume();
  const environment = { ambientTemperatureK: 294, oxygenFraction: 0.21 };
  const dry = await stepCombustionPlume({
    stateKey: 'combustion:suppression:dry',
    input: {
      stateKey: 'combustion:suppression:dry',
      state: makeCombustionPlumeInitialState({
        width: 8,
        height: 4,
        seed: 11,
        environment,
        coupling: { fireIntensity: 1, waterContact: 0 }
      }),
      dt: 0.08,
      environment,
      coupling: { fireIntensity: 1, waterContact: 0 },
      enableWebGPU: false
    }
  });
  const wet = await stepCombustionPlume({
    stateKey: 'combustion:suppression:wet',
    input: {
      stateKey: 'combustion:suppression:wet',
      state: makeCombustionPlumeInitialState({
        width: 8,
        height: 4,
        seed: 11,
        environment,
        coupling: { fireIntensity: 1, waterContact: 1.2 }
      }),
      dt: 0.08,
      environment,
      coupling: { fireIntensity: 1, waterContact: 1.2 },
      enableWebGPU: false
    }
  });

  assert.ok(wet.diagnostics.heatReleaseMean < dry.diagnostics.heatReleaseMean);
  assert.ok(wet.diagnostics.maxTemperatureK <= dry.diagnostics.maxTemperatureK);
  assert.ok(wet.diagnostics.fireAreaFraction <= dry.diagnostics.fireAreaFraction);
});

test('membrane shell task advances stress damage and updates model packet state', async () => {
  resetMembraneShell();
  const model = new MultiscaleModel();
  const initialState = makeMembraneShellInitialState({
    segmentCount: 24,
    seed: 20260529,
    environment: model.environment,
    coupling: {
      internalPressurePa: 122000,
      waterTemperatureK: 334,
      fireIntensity: 0.75,
      flameTemperatureK: 1120,
      radiativeHeatFlux: 120
    }
  });
  const before = computeMembraneShellDiagnostics(initialState);
  const result = await stepMembraneShell({
    stateKey: 'membrane:model:shell',
    input: {
      stateKey: 'membrane:model:shell',
      taskId: 'membrane:model:shell',
      state: initialState,
      dt: 1 / 45,
      environment: model.environment,
      coupling: {
        internalPressurePa: 122000,
        waterTemperatureK: 334,
        waterMassKg: 0.42,
        steamMassKg: 0.01,
        membraneIntegrity: 1,
        fireIntensity: 0.82,
        flameTemperatureK: 1120,
        radiativeHeatFlux: 120,
        waterContact: 0.02
      },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.schema, MEMBRANE_SHELL_RESULT_SCHEMA);
  assert.equal(result.value.backend, 'cpu-membrane-shell');
  assert.equal(result.commitDelta.payload.schema, MEMBRANE_SHELL_DELTA_SCHEMA);
  assert.equal(result.value.diagnostics.segmentCount, 24);
  assert.ok(Number.isFinite(result.value.diagnostics.maxStressPa));
  assert.ok(Number.isFinite(result.value.diagnostics.maxStrain));
  assert.ok(Number.isFinite(result.value.diagnostics.ruptureRisk));
  assert.ok(result.value.diagnostics.meanTemperatureK >= before.meanTemperatureK - 0.1);

  const shell = model.applyMembraneShellResult(result.value);
  const packet = model.createPacket();
  assert.equal(shell.backend, 'cpu-membrane-shell');
  assert.equal(packet.upward.aggregateState.membraneShell.backend, 'cpu-membrane-shell');
  assert.equal(packet.upward.aggregateState.membraneShell.segmentCount, 24);
  assert.equal(typeof packet.upward.closures.membraneRuptureRisk, 'number');
  assert.equal(typeof packet.upward.closures.membraneMaxStressPa, 'number');
  assert.equal(typeof packet.upward.aggregateState.membraneRuptureRisk, 'number');
});

test('membrane shell task has a WebGPU-first backend with CPU fallback status', async () => {
  resetMembraneShell();
  const result = await stepMembraneShell({
    stateKey: 'membrane:webgpu:probe',
    input: {
      stateKey: 'membrane:webgpu:probe',
      state: makeMembraneShellInitialState({ segmentCount: 16, seed: 4 }),
      dt: 1 / 90,
      environment: { ambientTemperatureK: 294, ambientPressurePa: 101325, gravityMps2: 9.8 },
      coupling: {
        internalPressurePa: 118000,
        waterTemperatureK: 320,
        waterMassKg: 0.42,
        fireIntensity: 0.6,
        flameTemperatureK: 900,
        radiativeHeatFlux: 60
      },
      emitCommitDelta: false
    }
  });

  assert.equal(result.schema, MEMBRANE_SHELL_RESULT_SCHEMA);
  assert.ok(MEMBRANE_SHELL_WEBGPU_MAX_SEGMENTS >= 16);
  assert.ok(['webgpu-membrane-shell', 'cpu-membrane-shell'].includes(result.backend));
  if (result.backend === 'cpu-membrane-shell') {
    assert.equal(result.webgpuStatus, null);
    assert.equal(typeof result.webgpuError, 'string');
  } else {
    assert.equal(result.webgpuStatus?.segmentCount, 16);
  }
});

test('membrane shell pressure and heat increase rupture risk', async () => {
  resetMembraneShell();
  const environment = { ambientTemperatureK: 294, ambientPressurePa: 101325, gravityMps2: 9.8 };
  const baseState = makeMembraneShellInitialState({
    segmentCount: 32,
    seed: 22,
    environment,
    coupling: { internalPressurePa: 108000, waterTemperatureK: 300 }
  });
  const calm = await stepMembraneShell({
    stateKey: 'membrane:risk:calm',
    input: {
      stateKey: 'membrane:risk:calm',
      state: structuredClone(baseState),
      dt: 0.05,
      environment,
      coupling: {
        internalPressurePa: 108000,
        waterTemperatureK: 300,
        fireIntensity: 0,
        flameTemperatureK: 500,
        radiativeHeatFlux: 0,
        membraneIntegrity: 1
      },
      enableWebGPU: false
    }
  });
  const stressed = await stepMembraneShell({
    stateKey: 'membrane:risk:stressed',
    input: {
      stateKey: 'membrane:risk:stressed',
      state: structuredClone(baseState),
      dt: 0.05,
      environment,
      coupling: {
        internalPressurePa: 150000,
        waterTemperatureK: 365,
        fireIntensity: 1,
        flameTemperatureK: 1250,
        radiativeHeatFlux: 900,
        membraneIntegrity: 1,
        steamMassKg: 0.04
      },
      enableWebGPU: false
    }
  });

  assert.ok(stressed.diagnostics.maxStressPa > calm.diagnostics.maxStressPa);
  assert.ok(stressed.diagnostics.maxTemperatureK > calm.diagnostics.maxTemperatureK);
  assert.ok(stressed.diagnostics.ruptureRisk > calm.diagnostics.ruptureRisk);
});

test('radiative heat flux couples into reactive and SPH material workers', async () => {
  resetReactiveThermalCell();
  resetSphMaterial();
  const environment = {
    ambientTemperatureK: 294,
    ambientPressurePa: 101325,
    oxygenFraction: 0.21,
    gravityMps2: 9.8
  };
  const reactiveState = makeReactiveThermalInitialState({
    environment,
    coupling: {
      fireIntensity: 0,
      fuelFraction: 0,
      flameTemperatureK: 650,
      waterContact: 0
    }
  });
  const reactiveInput = {
    dt: 0.1,
    environment,
    coupling: {
      fireIntensity: 0,
      fuelFraction: 0,
      waterContact: 0
    },
    enableWebGPU: false
  };
  const reactiveBase = await stepReactiveThermalCell({
    stateKey: 'reactive:radiative:base',
    input: {
      ...reactiveInput,
      stateKey: 'reactive:radiative:base',
      state: structuredClone(reactiveState)
    }
  });
  const reactiveHeated = await stepReactiveThermalCell({
    stateKey: 'reactive:radiative:heated',
    input: {
      ...reactiveInput,
      stateKey: 'reactive:radiative:heated',
      state: structuredClone(reactiveState),
      coupling: {
        ...reactiveInput.coupling,
        radiativeHeatFlux: 1200
      }
    }
  });
  assert.ok(reactiveHeated.closure.temperatureK > reactiveBase.closure.temperatureK);
  assert.ok(reactiveHeated.closure.heatSource > reactiveBase.closure.heatSource);

  const sphState = makeSphMaterialInitialState({
    count: 16,
    seed: 42,
    environment
  });
  const sphInput = {
    dt: 1 / 60,
    environment,
    coupling: {
      fireIntensity: 0,
      flameTemperatureK: 294,
      membraneIntegrity: 1,
      ruptured: false
    },
    enableWebGPU: false
  };
  const sphBase = await stepSphMaterial({
    stateKey: 'sph:radiative:base',
    input: {
      ...sphInput,
      stateKey: 'sph:radiative:base',
      state: structuredClone(sphState)
    }
  });
  const sphHeated = await stepSphMaterial({
    stateKey: 'sph:radiative:heated',
    input: {
      ...sphInput,
      stateKey: 'sph:radiative:heated',
      state: structuredClone(sphState),
      coupling: {
        ...sphInput.coupling,
        radiativeHeatFlux: 1200
      }
    }
  });
  assert.ok(sphHeated.diagnostics.averageTemperatureK > sphBase.diagnostics.averageTemperatureK);
});

test('molecular closure drives reactive and SPH material consumers', async () => {
  resetReactiveThermalCell();
  resetSphMaterial();
  const environment = {
    ambientTemperatureK: 294,
    ambientPressurePa: 101325,
    oxygenFraction: 0.23,
    gravityMps2: 9.8
  };
  const molecularClosure = closureResultFromMolecularDynamics({
    solverId: 'molecular-dynamics',
    stateKey: 'molecular:hot-closure',
    backend: 'cpu-molecular-dynamics',
    sequence: 7,
    diagnostics: {
      atomCount: 12,
      bondCount: 8,
      meanBondOrder: 0.9,
      reactionProgress: 0.72,
      heatReleaseProxy: 3.8,
      kineticEnergy: 0.04,
      potentialEnergyProxy: -2.5,
      thermalEnergyProxy: 8.4,
      totalEnergyProxy: 5.94,
      meanTemperatureK: 1840,
      maxTemperatureK: 1920,
      totalCharge: 0,
      ionizationFraction: 0.42,
      meanAbsCharge: 0.34,
      dipoleMomentProxy: 0.62,
      electricalConductivityProxy: 0.86,
      ionicBondCount: 2,
      covalentBondCount: 6,
      polarBondFraction: 0.75,
      valenceSaturation: 0.82,
      pressureProxy: 2.2,
      phaseFractions: {
        solid: 0.05,
        liquid: 0.45,
        vapor: 0.2,
        plasma: 0.3
      },
      solidFraction: 0.05,
      liquidFraction: 0.45,
      vaporFraction: 0.2,
      plasmaFraction: 0.3,
      phaseRegime: 'plasma',
      phaseChangeRateProxy: 0.63,
      latentHeatSinkProxy: 0.24,
      latentHeatReleaseProxy: 0.18,
      waterMoleculeFraction: 0.7,
      condensationOrderProxy: 0.34,
      vaporizationDriveProxy: 0.41,
      freezingDriveProxy: 0.08,
      plasmaDriveProxy: 0.36,
      species: { C: 2, H: 6, O: 4, N: 0, other: 0 },
      molecularSpecies: { CO2: 2, H2O: 3 },
      dominantMolecule: 'H2O',
      recognizedMoleculeCount: 5,
      stoichiometryResidualProxy: 0.12,
      componentClosureFraction: 0.88,
      reactionEventLedger: {
        schema: MOLECULAR_REACTION_EVENT_LEDGER_SCHEMA,
        bondEventCount: 3,
        formedBondCount: 3,
        brokenBondCount: 0,
        moleculeSpeciesDelta: { H2O: 2 },
        eventIntensityProxy: 0.7
      },
      reactionSource: {
        schema: MOLECULAR_REACTION_SOURCE_SCHEMA,
        modelId: 'test-positive-reaction-source',
        mode: 'event-ledger-source-proxy',
        dt: 0.05,
        rates: {
          bondFormationRate: 40,
          bondBreakageRate: 0,
          netBondRate: 40,
          reactionProgressRate: 1.4,
          heatReleaseRateProxy: 8.4,
          speciesRateProxy: 12,
          speciesRates: { H2O: 8 },
          atomSpeciesRates: { H: -16, O: -8 }
        },
        heat: {
          heatSourceProxy: 0.42,
          coolingSinkProxy: 0,
          netHeatSourceProxy: 0.42
        },
        eventIntensityProxy: 0.7
      },
      reactionHeatSourceProxy: 0.42,
      reactionSpeciesRateProxy: 12,
      reactionLedger: {
        schema: MOLECULAR_REACTION_LEDGER_SCHEMA,
        species: { CO2: 2, H2O: 3 },
        dominantFormula: 'H2O',
        recognizedMoleculeCount: 5,
        stoichiometryResidualProxy: 0.12,
        componentClosureFraction: 0.88,
        stoichiometryClosed: false
      },
      quantumMaterialSourceApplied: true,
      quantumMaterialSourcePropertyResponse: {
        schema: QUANTUM_MATERIAL_PROPERTY_RESPONSE_SCHEMA,
        modelId: 'test-qmat-property-response',
        status: 'test-property-response-ready',
        backend: 'test-qmat-property-batch',
        recordCount: 64,
        calibrated: false,
        meanElectricalConductivitySpm: 0.42,
        meanDielectricConstant: 3.2,
        meanRefractiveIndex: 1.55,
        meanMechanicalResponsePa: 2.4e9,
        meanBulkModulusPa: 2.2e9,
        meanYoungsModulusPa: 1.1e9,
        meanOpticalAbsorptionProxy: 0.8
      },
      quantumMaterialSourceElectricalConductivitySpm: 0.42,
      quantumMaterialSourceDielectricConstant: 3.2,
      quantumMaterialSourceRefractiveIndex: 1.55,
      quantumMaterialSourceMechanicalResponsePa: 2.4e9,
      quantumMaterialSourceBulkModulusPa: 2.2e9,
      quantumMaterialSourceYoungsModulusPa: 1.1e9,
      quantumMaterialSourceOpticalAbsorptionProxy: 0.8,
      quantumMaterialSourceConductivityDrive: 0.2,
      quantumMaterialSourceDielectricDrive: 0.3,
      quantumMaterialSourceMechanicalStiffnessDrive: 0.5,
      quantumMaterialSourceOpticalAbsorptionDrive: 0.4,
      quantumMaterialSourceResponseDerivatives: {
        schema: QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA,
        modelId: 'test-qmat-response-derivatives',
        status: 'test-response-derivatives-ready',
        backend: 'test-qmat-property-batch',
        recordCount: 64,
        calibrated: false,
        meanDensityTemperatureDerivativeKgM3PerK: -0.018,
        meanMechanicalPressureDerivativePaPerLog2Pressure: 2.8e7,
        meanConductivityFieldDerivativeSpmPerNorm: 0.034,
        meanOpacityRadiationDerivativePerNorm: 0.052
      },
      quantumMaterialSourceResponseDerivativesSchema: QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA,
      quantumMaterialSourceDensityTemperatureDerivativeKgM3PerK: -0.018,
      quantumMaterialSourceMechanicalPressureDerivativePaPerLog2Pressure: 2.8e7,
      quantumMaterialSourceConductivityFieldDerivativeSpmPerNorm: 0.034,
      quantumMaterialSourceOpacityRadiationDerivativePerNorm: 0.052,
      quantumMaterialSourceResponseDerivativeTemperatureDrive: 0.18,
      quantumMaterialSourceResponseDerivativePressureDrive: 0.16,
      quantumMaterialSourceResponseDerivativeFieldDrive: 0.12,
      quantumMaterialSourceResponseDerivativeRadiationDrive: 0.21,
      quantumMaterialSourceStatisticalSourceEquation: {
        schema: QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA,
        adapterSchema: MOLECULAR_SOURCE_EQUATION_SCHEMA,
        source: {
          ensembleSchema: QUANTUM_STATISTICAL_ENSEMBLE_SCHEMA,
          modelId: 'test-qstat-ensemble',
          backend: 'test-qmat-property-batch',
          recordCount: 64,
          distribution: 'reduced-boltzmann-saha-degeneracy'
        },
        channelCount: 5,
        channels: [
          { id: 'ensemble-pressure', quantity: 'pressure', unit: 'Pa', driveProxy: 0.19 },
          { id: 'ionization-population', quantity: 'ionization-fraction', unit: 'dimensionless', driveProxy: 0.12 },
          { id: 'opacity-population', quantity: 'opacity-proxy', unit: 'reduced', driveProxy: 0.26 },
          { id: 'degeneracy-pressure', quantity: 'degeneracy-parameter', unit: 'dimensionless', driveProxy: 0.08 },
          { id: 'heat-capacity', quantity: 'heat-capacity-proxy', unit: 'reduced', driveProxy: 1.05 }
        ],
        sourceTerms: {
          pressureDriveProxy: 0.19,
          opacityDriveProxy: 0.26,
          ionizationDriveProxy: 0.12,
          degeneracyPressureDriveProxy: 0.08,
          temperatureDeltaKProxy: 18,
          chargeDeltaProxy: 0.022,
          heatCapacityProxy: 1.8,
          thermalDampingScale: 1.05,
          pressureRatio: 1.7
        }
      },
      quantumMaterialSourceStatisticalSourceEquationSchema: QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA,
      quantumMaterialSourceStatisticalSourceChannelCount: 5,
      quantumMaterialSourceStatisticalPressureDriveProxy: 0.19,
      quantumMaterialSourceStatisticalOpacityDriveProxy: 0.26,
      quantumMaterialSourceStatisticalIonizationDriveProxy: 0.12,
      quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy: 0.08,
      quantumMaterialSourceStatisticalTemperatureDeltaKProxy: 18,
      quantumMaterialSourceStatisticalChargeDeltaProxy: 0.022,
      quantumMaterialSourceStatisticalThermalDampingScale: 1.05
    },
    conservation: { energyDelta: 0.02, chargeDrift: 0 }
  }, { environment });

  const reactiveState = makeReactiveThermalInitialState({
    environment,
    coupling: {
      fireIntensity: 0,
      fuelFraction: 0,
      flameTemperatureK: 650,
      waterContact: 0
    }
  });
  const reactiveInput = {
    dt: 0.1,
    environment,
    coupling: {
      fireIntensity: 0,
      fuelFraction: 0,
      waterContact: 0
    },
    enableWebGPU: false
  };
  const reactiveBase = await stepReactiveThermalCell({
    stateKey: 'reactive:molecular-closure:base',
    input: {
      ...reactiveInput,
      state: structuredClone(reactiveState)
    }
  });
  const reactiveDriven = await stepReactiveThermalCell({
    stateKey: 'reactive:molecular-closure:driven',
    input: {
      ...reactiveInput,
      state: structuredClone(reactiveState),
      coupling: {
        ...reactiveInput.coupling,
        molecularDynamicsClosure: molecularClosure
      }
    }
  });
  assert.equal(reactiveDriven.closure.molecularClosure.applied, true);
  assert.equal(reactiveDriven.closure.molecularClosure.sourceSink.schema, MOLECULAR_SOURCE_SINK_SCHEMA);
  assert.equal(reactiveDriven.closure.molecularClosure.sourceSink.target.solverId, 'reactive-thermal-cell');
  assert.ok(reactiveDriven.closure.molecularClosure.sourceSink.energy.heatFluxProxyWm2 > 0);
  assert.equal(reactiveDriven.closure.molecularClosure.sourceSink.energy.reactionHeatSourceProxy, 0.42);
  assert.equal(reactiveDriven.closure.molecularClosure.reactionSourceSchema, MOLECULAR_REACTION_SOURCE_SCHEMA);
  assert.equal(reactiveDriven.closure.molecularClosure.reactionHeatSourceProxy, 0.42);
  assert.equal(reactiveDriven.closure.molecularClosure.reactionSpeciesRateProxy, 12);
  assert.ok(reactiveDriven.closure.molecularClosure.reactionSourceDrive > 0.5);
  assert.equal(reactiveDriven.closure.molecularClosure.sourceSink.species.dominantMolecule, 'H2O');
  assert.equal(reactiveDriven.closure.molecularClosure.sourceSink.species.reactionSpeciesRateProxy, 12);
  assert.equal(reactiveDriven.closure.molecularClosure.sourceSink.species.stoichiometryResidualProxy, 0.12);
  assert.equal(reactiveDriven.closure.molecularClosure.sourceSink.phase.phaseRegime, 'plasma');
  assert.ok(reactiveDriven.closure.molecularClosure.sourceSink.phase.phaseDriveProxy > 0);
  assert.ok(reactiveDriven.closure.molecularClosure.sourceSink.phase.latentHeatSinkProxy > 0);
  assert.ok(reactiveDriven.closure.molecularClosure.sourceSink.phase.latentHeatReleaseProxy > 0);
  assert.equal(
    reactiveDriven.closure.molecularClosure.sourceSink.material.quantumMaterialPropertySource.schema,
    QUANTUM_MATERIAL_PROPERTY_RESPONSE_SCHEMA
  );
  assert.equal(reactiveDriven.closure.molecularClosure.sourceSink.material.quantumMaterialPropertySource.active, true);
  assert.ok(reactiveDriven.closure.molecularClosure.sourceSink.material.thermalFluxBoostProxy > 0);
  assert.ok(reactiveDriven.closure.molecularClosure.sourceSink.material.phaseDriveBoostProxy > 0);
  assert.equal(
    reactiveDriven.closure.molecularClosure.sourceSink.material.quantumMaterialResponseDerivativeSource.schema,
    QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA
  );
  assert.equal(reactiveDriven.closure.molecularClosure.sourceSink.material.quantumMaterialResponseDerivativeSource.active, true);
  assert.ok(reactiveDriven.closure.molecularClosure.sourceSink.material.responseDerivativeTemperatureDrive > 0);
  assert.ok(reactiveDriven.closure.molecularClosure.sourceSink.material.responseDerivativeThermalFluxBoostProxy > 0);
  assert.ok(reactiveDriven.closure.molecularClosure.sourceSink.conservation.energyResidualProxy > 0);
  assert.equal(reactiveDriven.conservation.molecularClosureApplied, true);
  assert.equal(reactiveDriven.conservation.molecularSourceSink.schema, MOLECULAR_SOURCE_SINK_SCHEMA);
  assert.equal(reactiveDriven.conservation.molecularReactionSourceSchema, MOLECULAR_REACTION_SOURCE_SCHEMA);
  assert.equal(reactiveDriven.conservation.molecularReactionHeatSourceProxy, 0.42);
  assert.equal(reactiveDriven.conservation.molecularReactionSpeciesRateProxy, 12);
  assert.ok(reactiveDriven.conservation.molecularReactionSourceDrive > 0.5);
  assert.equal(reactiveDriven.conservation.molecularPhaseRegime, 'plasma');
  assert.ok(reactiveDriven.conservation.molecularPhaseDriveProxy > 0);
  assert.ok(reactiveDriven.conservation.molecularLatentHeatSinkProxy > 0);
  assert.ok(reactiveDriven.conservation.molecularLatentHeatReleaseProxy > 0);
  assert.equal(reactiveDriven.conservation.molecularQuantumMaterialPropertySource.active, true);
  assert.equal(
    reactiveDriven.conservation.molecularQuantumMaterialPropertySource.schema,
    QUANTUM_MATERIAL_PROPERTY_RESPONSE_SCHEMA
  );
  assert.ok(reactiveDriven.conservation.molecularQuantumMaterialPropertyThermalFluxBoostProxy > 0);
  assert.ok(reactiveDriven.conservation.molecularQuantumMaterialPropertyPhaseDriveBoostProxy > 0);
  assert.ok(reactiveDriven.conservation.molecularQuantumMaterialPropertyElectricalDrive > 0);
  assert.ok(reactiveDriven.conservation.molecularQuantumMaterialPropertyOpticalHeatingDrive > 0);
  assert.equal(reactiveDriven.conservation.molecularQuantumMaterialResponseDerivativeSource.active, true);
  assert.equal(
    reactiveDriven.conservation.molecularQuantumMaterialResponseDerivativeSource.schema,
    QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA
  );
  assert.ok(reactiveDriven.conservation.molecularQuantumMaterialResponseDerivativeTemperatureDrive > 0);
  assert.ok(reactiveDriven.conservation.molecularQuantumMaterialResponseDerivativeThermalFluxBoostProxy > 0);
  assert.ok(reactiveDriven.closure.molecularClosure.thermalDrive > 0.5);
  assert.ok(reactiveDriven.closure.temperatureK > reactiveBase.closure.temperatureK);
  assert.ok(reactiveDriven.closure.heatSource > reactiveBase.closure.heatSource);

  const sphState = makeSphMaterialInitialState({
    count: 16,
    seed: 242,
    environment
  });
  const sphInput = {
    dt: 0.05,
    environment,
    coupling: {
      fireIntensity: 0,
      flameTemperatureK: 294,
      membraneIntegrity: 1,
      ruptured: false
    },
    enableWebGPU: false
  };
  const sphBase = await stepSphMaterial({
    stateKey: 'sph:molecular-closure:base',
    input: {
      ...sphInput,
      state: structuredClone(sphState)
    }
  });
  const sphDriven = await stepSphMaterial({
    stateKey: 'sph:molecular-closure:driven',
    input: {
      ...sphInput,
      state: structuredClone(sphState),
      coupling: {
        ...sphInput.coupling,
        molecularDynamicsClosure: molecularClosure
      }
    }
  });
  assert.equal(sphDriven.diagnostics.molecularClosureApplied, true);
  assert.equal(sphDriven.diagnostics.molecularSourceSink.schema, MOLECULAR_SOURCE_SINK_SCHEMA);
  assert.equal(sphDriven.diagnostics.molecularSourceSink.target.solverId, 'sph-material');
  assert.ok(sphDriven.diagnostics.molecularSourceSink.energy.heatFluxProxyWm2 > 0);
  assert.equal(sphDriven.diagnostics.molecularSourceSink.energy.reactionHeatSourceProxy, 0.42);
  assert.equal(sphDriven.diagnostics.molecularReactionSourceSchema, MOLECULAR_REACTION_SOURCE_SCHEMA);
  assert.equal(sphDriven.diagnostics.molecularReactionHeatSourceProxy, 0.42);
  assert.equal(sphDriven.diagnostics.molecularReactionSpeciesRateProxy, 12);
  assert.ok(sphDriven.diagnostics.molecularReactionSourceDrive > 0.5);
  assert.equal(sphDriven.diagnostics.molecularSourceSink.species.stoichiometryResidualProxy, 0.12);
  assert.equal(sphDriven.diagnostics.molecularSourceSink.species.reactionSpeciesRateProxy, 12);
  assert.equal(sphDriven.diagnostics.molecularSourceSink.phase.phaseRegime, 'plasma');
  assert.ok(sphDriven.diagnostics.molecularSourceSink.phase.phaseDriveProxy > 0);
  assert.equal(
    sphDriven.diagnostics.molecularSourceSink.material.quantumMaterialPropertySource.schema,
    QUANTUM_MATERIAL_PROPERTY_RESPONSE_SCHEMA
  );
  assert.equal(sphDriven.diagnostics.molecularSourceSink.material.quantumMaterialPropertySource.active, true);
  assert.ok(sphDriven.diagnostics.molecularSourceSink.material.thermalFluxBoostProxy > 0);
  assert.equal(
    sphDriven.diagnostics.molecularSourceSink.material.quantumMaterialResponseDerivativeSource.schema,
    QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA
  );
  assert.equal(sphDriven.diagnostics.molecularSourceSink.material.quantumMaterialResponseDerivativeSource.active, true);
  assert.ok(sphDriven.diagnostics.molecularSourceSink.material.responseDerivativeTemperatureDrive > 0);
  assert.ok(sphDriven.diagnostics.molecularPhaseDriveProxy > 0);
  assert.ok(sphDriven.diagnostics.molecularLatentHeatSinkProxy > 0);
  assert.ok(sphDriven.diagnostics.molecularLatentHeatReleaseProxy > 0);
  assert.equal(sphDriven.diagnostics.molecularQuantumMaterialPropertySource.active, true);
  assert.ok(sphDriven.diagnostics.molecularQuantumMaterialPropertyThermalFluxBoostProxy > 0);
  assert.ok(sphDriven.diagnostics.molecularQuantumMaterialPropertyMechanicalStiffnessDrive > 0);
  assert.equal(sphDriven.diagnostics.molecularQuantumMaterialResponseDerivativeSource.active, true);
  assert.ok(sphDriven.diagnostics.molecularQuantumMaterialResponseDerivativeThermalFluxBoostProxy > 0);
  assert.ok(sphDriven.diagnostics.molecularSourceSink.conservation.energyResidualProxy > 0);
  assert.ok(sphDriven.diagnostics.molecularClosureThermalDrive > 0.5);
  assert.ok(sphDriven.diagnostics.averageTemperatureK > sphBase.diagnostics.averageTemperatureK);

  const intakeModel = new MultiscaleModel();
  intakeModel.applyReactiveThermalResult(reactiveDriven);
  intakeModel.applySphMaterialResult(sphDriven);
  intakeModel.setMolecularTransferApplicationConfig({
    applicationRequested: true,
    mutationEnabled: true,
    scientificMode: true,
    targetAdaptersValidated: true,
    closedResidualToleranceProxy: 0.5
  });
  intakeModel.setMolecularTransferTransactionConfig({
    transactionEnabled: true,
    mutatorId: 'reactive-sph-source-preview-v0'
  });
  intakeModel.setMolecularTargetMutationApplyConfig({
    executionRequested: true,
    proxyApplyEnabled: true,
    targetApplyImplemented: true
  });
  const intakeExecution = intakeModel.executeMolecularTargetMutationApply({ reason: 'consumer-test' });
  assert.equal(intakeExecution.status, 'applied-proxy');
  const reactiveIntake = intakeModel.getMolecularTargetSourceIntakeFor('reactive-thermal-cell');
  const sphIntake = intakeModel.getMolecularTargetSourceIntakeFor('sph-material');
  const reactiveSourceBuffer = intakeModel.getMolecularConservativeSourceBufferFor('reactive-thermal-cell');
  const sphSourceBuffer = intakeModel.getMolecularConservativeSourceBufferFor('sph-material');
  assert.equal(reactiveIntake.schema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.equal(sphIntake.schema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.equal(reactiveIntake.active, true);
  assert.equal(sphIntake.active, true);
  assert.equal(reactiveSourceBuffer.schema, MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA);
  assert.equal(sphSourceBuffer.schema, MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA);
  assert.equal(reactiveSourceBuffer.active, true);
  assert.equal(sphSourceBuffer.active, true);
  assert.equal(reactiveSourceBuffer.bufferStrideFloats, 8);
  assert.equal(sphSourceBuffer.bufferStrideFloats, 8);
  assert.equal(reactiveSourceBuffer.sourceVectorF32.length, 8);
  assert.equal(sphSourceBuffer.sourceVectorF32.length, 8);
  assert.equal(reactiveSourceBuffer.quantumMaterialPropertySource.active, true);
  assert.equal(reactiveSourceBuffer.quantumMaterialPropertySource.schema, QUANTUM_MATERIAL_PROPERTY_RESPONSE_SCHEMA);
  assert.ok(reactiveSourceBuffer.quantumMaterialPropertyThermalFluxBoostProxy > 0);
  assert.ok(reactiveSourceBuffer.quantumMaterialPropertyPhaseDriveBoostProxy > 0);
  assert.equal(reactiveSourceBuffer.quantumMaterialStatisticalSource.active, true);
  assert.equal(reactiveSourceBuffer.quantumMaterialStatisticalSource.schema, QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA);
  assert.equal(reactiveSourceBuffer.quantumMaterialStatisticalSourceChannelCount, 5);
  assert.ok(reactiveSourceBuffer.quantumMaterialStatisticalPressureDriveProxy > 0);
  assert.ok(reactiveSourceBuffer.quantumMaterialStatisticalOpacityDriveProxy > 0);
  assert.ok(reactiveSourceBuffer.quantumMaterialStatisticalIonizationDriveProxy > 0);
  assert.ok(reactiveSourceBuffer.quantumMaterialStatisticalDegeneracyPressureDriveProxy > 0);
  assert.ok(reactiveSourceBuffer.quantumMaterialStatisticalTemperatureDeltaKProxy > 0);
  assert.equal(reactiveSourceBuffer.quantumMaterialResponseDerivativeSource.active, true);
  assert.equal(reactiveSourceBuffer.quantumMaterialResponseDerivativeSource.schema, QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA);
  assert.ok(reactiveSourceBuffer.quantumMaterialResponseDerivativeTemperatureDrive > 0);
  assert.ok(reactiveSourceBuffer.quantumMaterialResponseDerivativeThermalFluxBoostProxy > 0);
  assert.equal(sphSourceBuffer.quantumMaterialPropertySource.active, true);
  assert.ok(sphSourceBuffer.quantumMaterialPropertyThermalFluxBoostProxy > 0);
  assert.equal(sphSourceBuffer.quantumMaterialStatisticalSource.active, true);
  assert.equal(sphSourceBuffer.quantumMaterialStatisticalSourceChannelCount, 5);
  assert.ok(sphSourceBuffer.quantumMaterialStatisticalPressureDriveProxy > 0);
  assert.equal(sphSourceBuffer.quantumMaterialResponseDerivativeSource.active, true);
  assert.ok(sphSourceBuffer.quantumMaterialResponseDerivativeFieldDrive > 0);

  const reactiveIntakeBase = await stepReactiveThermalCell({
    stateKey: 'reactive:source-intake:base',
    input: {
      ...reactiveInput,
      state: structuredClone(reactiveState)
    }
  });
  const reactiveIntakeDriven = await stepReactiveThermalCell({
    stateKey: 'reactive:source-intake:driven',
    input: {
      ...reactiveInput,
      state: structuredClone(reactiveState),
      coupling: {
        ...reactiveInput.coupling,
        molecularTargetSourceIntake: reactiveIntake,
        molecularConservativeSourceBuffer: reactiveSourceBuffer
      }
    }
  });
  assert.equal(reactiveIntakeDriven.closure.molecularClosure.targetSourceIntakeSchema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.equal(reactiveIntakeDriven.conservation.molecularTargetSourceIntakeSchema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.ok(reactiveIntakeDriven.conservation.molecularTargetSourceIntakeThermalDrive > 0);
  assert.equal(reactiveIntakeDriven.closure.molecularClosure.conservativeSourceBufferSchema, MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA);
  assert.equal(reactiveIntakeDriven.conservation.molecularConservativeSourceBufferSchema, MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA);
  assert.equal(reactiveIntakeDriven.conservation.molecularConservativeSourceBufferVectorStride, 8);
  assert.ok(reactiveIntakeDriven.conservation.molecularConservativeSourceBufferThermalDrive > 0);
  assert.equal(reactiveIntakeDriven.conservation.molecularQuantumMaterialPropertySource.active, true);
  assert.ok(reactiveIntakeDriven.conservation.molecularQuantumMaterialPropertyThermalFluxBoostProxy > 0);
  assert.ok(reactiveIntakeDriven.conservation.molecularQuantumMaterialPropertyElectricalDrive > 0);
  assert.equal(reactiveIntakeDriven.conservation.molecularQuantumMaterialStatisticalSource.active, true);
  assert.equal(reactiveIntakeDriven.conservation.molecularQuantumMaterialStatisticalSourceChannelCount, 5);
  assert.ok(reactiveIntakeDriven.conservation.molecularQuantumMaterialStatisticalPressureDriveProxy > 0);
  assert.ok(reactiveIntakeDriven.conservation.molecularQuantumMaterialStatisticalOpacityDriveProxy > 0);
  assert.ok(reactiveIntakeDriven.conservation.molecularQuantumMaterialStatisticalIonizationDriveProxy > 0);
  assert.ok(reactiveIntakeDriven.conservation.molecularQuantumMaterialStatisticalTemperatureDeltaKProxy > 0);
  assert.equal(reactiveIntakeDriven.conservation.molecularQuantumMaterialResponseDerivativeSource.active, true);
  assert.ok(reactiveIntakeDriven.conservation.molecularQuantumMaterialResponseDerivativeTemperatureDrive > 0);
  assert.ok(reactiveIntakeDriven.conservation.molecularQuantumMaterialResponseDerivativeRadiationDrive > 0);
  assert.equal(reactiveIntakeDriven.conservation.molecularSourceBufferApplicationSchema, MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA);
  assert.equal(reactiveIntakeDriven.conservation.molecularSourceBufferApplication?.schema, MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA);
  assert.equal(reactiveIntakeDriven.conservation.molecularSourceBufferApplicationApplied, true);
  assert.ok(reactiveIntakeDriven.conservation.molecularSourceBufferApplicationAppliedFieldCount >= 27);
  assert.equal(reactiveIntakeDriven.conservation.molecularSourceBufferApplicationSourceTermCount, 8);
  assert.equal(
    reactiveIntakeDriven.conservation.molecularSourceBufferApplication.appliedQuantumMaterialStatisticalSourceChannelCount,
    5
  );
  assert.ok(reactiveIntakeDriven.conservation.molecularSourceBufferApplication.appliedQuantumMaterialStatisticalPressureDriveProxy > 0);
  assert.ok(reactiveIntakeDriven.conservation.molecularSourceBufferApplication.appliedQuantumMaterialStatisticalOpacityDriveProxy > 0);
  const reactiveApplicationFields = reactiveIntakeDriven.conservation.molecularSourceBufferApplication.fields
    .map((field) => field.field);
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialPropertyThermalFluxBoostProxy'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialPropertyPhaseDriveBoostProxy'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialPropertyElectricalDrive'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialPropertyOpticalHeatingDrive'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialPropertyMechanicalStiffnessDrive'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialPropertyDampingScale'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialStatisticalPressureDriveProxy'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialStatisticalOpacityDriveProxy'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialStatisticalIonizationDriveProxy'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialStatisticalDegeneracyPressureDriveProxy'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialStatisticalTemperatureDeltaKProxy'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialStatisticalChargeDeltaProxy'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialStatisticalThermalDampingScale'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialResponseDerivativeTemperatureDrive'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialResponseDerivativePressureDrive'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialResponseDerivativeFieldDrive'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialResponseDerivativeRadiationDrive'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialResponseDerivativeThermalFluxBoostProxy'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialResponseDerivativePhaseDriveBoostProxy'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialResponseDerivativeElectricalDrive'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialResponseDerivativeMechanicalDrive'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialResponseDerivativeOpticalDrive'));
  assert.ok(reactiveApplicationFields.includes('molecularQuantumMaterialResponseDerivativeDampingScale'));
  assert.ok(Number.isFinite(reactiveIntakeDriven.conservation.molecularSourceBufferApplicationResidual));
  assert.ok(reactiveIntakeDriven.closure.temperatureK > reactiveIntakeBase.closure.temperatureK);

  const sphIntakeBase = await stepSphMaterial({
    stateKey: 'sph:source-intake:base',
    input: {
      ...sphInput,
      state: structuredClone(sphState)
    }
  });
  const sphIntakeDriven = await stepSphMaterial({
    stateKey: 'sph:source-intake:driven',
    input: {
      ...sphInput,
      state: structuredClone(sphState),
      coupling: {
        ...sphInput.coupling,
        molecularTargetSourceIntake: sphIntake,
        molecularConservativeSourceBuffer: sphSourceBuffer
      }
    }
  });
  assert.equal(sphIntakeDriven.diagnostics.molecularTargetSourceIntakeSchema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.ok(sphIntakeDriven.diagnostics.molecularTargetSourceIntakeThermalDrive > 0);
  assert.equal(sphIntakeDriven.diagnostics.molecularConservativeSourceBufferSchema, MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA);
  assert.equal(sphIntakeDriven.diagnostics.molecularConservativeSourceBufferVectorStride, 8);
  assert.ok(sphIntakeDriven.diagnostics.molecularConservativeSourceBufferThermalDrive > 0);
  assert.equal(sphIntakeDriven.diagnostics.molecularQuantumMaterialPropertySource.active, true);
  assert.ok(sphIntakeDriven.diagnostics.molecularQuantumMaterialPropertyThermalFluxBoostProxy > 0);
  assert.ok(sphIntakeDriven.diagnostics.molecularQuantumMaterialPropertyMechanicalStiffnessDrive > 0);
  assert.equal(sphIntakeDriven.diagnostics.molecularQuantumMaterialStatisticalSource.active, true);
  assert.equal(sphIntakeDriven.diagnostics.molecularQuantumMaterialStatisticalSourceChannelCount, 5);
  assert.ok(sphIntakeDriven.diagnostics.molecularQuantumMaterialStatisticalPressureDriveProxy > 0);
  assert.ok(sphIntakeDriven.diagnostics.molecularQuantumMaterialStatisticalOpacityDriveProxy > 0);
  assert.ok(sphIntakeDriven.diagnostics.molecularQuantumMaterialStatisticalDegeneracyPressureDriveProxy > 0);
  assert.equal(sphIntakeDriven.diagnostics.molecularQuantumMaterialResponseDerivativeSource.active, true);
  assert.ok(sphIntakeDriven.diagnostics.molecularQuantumMaterialResponseDerivativeTemperatureDrive > 0);
  assert.ok(sphIntakeDriven.diagnostics.molecularQuantumMaterialResponseDerivativeFieldDrive > 0);
  assert.equal(sphIntakeDriven.diagnostics.molecularSourceBufferApplicationSchema, MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA);
  assert.equal(sphIntakeDriven.diagnostics.molecularSourceBufferApplication?.schema, MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA);
  assert.equal(sphIntakeDriven.diagnostics.molecularSourceBufferApplicationApplied, true);
  assert.ok(sphIntakeDriven.diagnostics.molecularSourceBufferApplicationAppliedFieldCount >= 28);
  assert.equal(sphIntakeDriven.diagnostics.molecularSourceBufferApplicationSourceTermCount, 8);
  assert.equal(sphIntakeDriven.diagnostics.molecularSourceBufferApplication.appliedQuantumMaterialStatisticalSourceChannelCount, 5);
  assert.ok(sphIntakeDriven.diagnostics.molecularSourceBufferApplication.appliedQuantumMaterialStatisticalPressureDriveProxy > 0);
  assert.ok(sphIntakeDriven.diagnostics.molecularSourceBufferApplication.appliedQuantumMaterialStatisticalDegeneracyPressureDriveProxy > 0);
  const sphApplicationFields = sphIntakeDriven.diagnostics.molecularSourceBufferApplication.fields
    .map((field) => field.field);
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialPropertyThermalFluxBoostProxy'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialPropertyPhaseDriveBoostProxy'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialPropertyElectricalDrive'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialPropertyOpticalHeatingDrive'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialPropertyMechanicalStiffnessDrive'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialPropertyDampingScale'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialStatisticalPressureDriveProxy'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialStatisticalOpacityDriveProxy'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialStatisticalDegeneracyPressureDriveProxy'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialStatisticalTemperatureDeltaKProxy'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialResponseDerivativeTemperatureDrive'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialResponseDerivativePressureDrive'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialResponseDerivativeFieldDrive'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialResponseDerivativeRadiationDrive'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialResponseDerivativeThermalFluxBoostProxy'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialResponseDerivativePhaseDriveBoostProxy'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialResponseDerivativeElectricalDrive'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialResponseDerivativeMechanicalDrive'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialResponseDerivativeOpticalDrive'));
  assert.ok(sphApplicationFields.includes('molecularQuantumMaterialResponseDerivativeDampingScale'));
  assert.ok(Number.isFinite(sphIntakeDriven.diagnostics.molecularSourceBufferApplicationResidual));
  assert.ok(sphIntakeDriven.diagnostics.averageTemperatureK > sphIntakeBase.diagnostics.averageTemperatureK);
  intakeModel.applyReactiveThermalResult(reactiveIntakeDriven);
  intakeModel.applySphMaterialResult(sphIntakeDriven);
  assert.equal(intakeModel.state.surface.reactiveCell.molecularSourceBufferApplicationSchema, MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA);
  assert.equal(intakeModel.state.mpm.sphMaterial.molecularSourceBufferApplicationSchema, MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA);
  assert.equal(intakeModel.state.surface.reactiveCell.molecularSourceBufferApplicationApplied, true);
  assert.equal(intakeModel.state.mpm.sphMaterial.molecularSourceBufferApplicationApplied, true);
  const targetSourceResponse = intakeModel.estimateMolecularTargetSourceResponse();
  assert.equal(targetSourceResponse.schema, MOLECULAR_TARGET_SOURCE_RESPONSE_SCHEMA);
  assert.equal(targetSourceResponse.sourceIntakeSchema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.equal(targetSourceResponse.sourceApplyExecutionSequence, intakeExecution.sequence);
  assert.equal(targetSourceResponse.activeTargetCount, 2);
  assert.equal(targetSourceResponse.respondedTargetCount, 2);
  assert.equal(targetSourceResponse.pendingTargetCount, 0);
  assert.ok(targetSourceResponse.totalIntakeThermalDrive > 0);
  assert.ok(targetSourceResponse.totalResponseThermalDrive > 0);
  assert.ok(targetSourceResponse.totalHeatFluxResponseProxy > 0);
  assert.equal(targetSourceResponse.targets.every((target) => target.responseAcknowledged), true);
  assert.equal(targetSourceResponse.sourceBufferAcknowledgedTargetCount, 2);
  assert.equal(targetSourceResponse.targets.every((target) => target.sourceApplyExecutionSequence === intakeExecution.sequence), true);
  const targetSourceReconciliation = intakeModel.estimateMolecularTargetSourceReconciliation({
    molecularTargetSourceIntake: intakeModel.state.molecular.targetSourceIntake,
    molecularTargetSourceResponse: targetSourceResponse
  });
  assert.equal(targetSourceReconciliation.schema, MOLECULAR_TARGET_SOURCE_RECONCILIATION_SCHEMA);
  assert.equal(targetSourceReconciliation.sourceIntakeSchema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.equal(targetSourceReconciliation.targetResponseSchema, MOLECULAR_TARGET_SOURCE_RESPONSE_SCHEMA);
  assert.equal(targetSourceReconciliation.activeTargetCount, 2);
  assert.equal(targetSourceReconciliation.reconciledTargetCount, 2);
  assert.equal(targetSourceReconciliation.pendingTargetCount, 0);
  assert.equal(targetSourceReconciliation.sequenceMismatchCount, 0);
  assert.equal(targetSourceReconciliation.residualPassed, true);
  assert.ok(Number.isFinite(targetSourceReconciliation.reconciliationResidualProxy));
  const intakeResponsePacket = intakeModel.createPacket();
  assert.equal(intakeResponsePacket.sourceTransferTargetSourceReconciliation.schema, MOLECULAR_TARGET_SOURCE_RECONCILIATION_SCHEMA);
  assert.equal(intakeResponsePacket.sourceTransferTargetSourceReconciliation.reconciledTargetCount, 2);
  assert.equal(intakeResponsePacket.sourceTransferTargetSourceReconciliation.pendingTargetCount, 0);
  assert.equal(intakeResponsePacket.conservativeSourceBuffer.schema, MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA);
  assert.equal(intakeResponsePacket.conservativeSourceBuffer.activeTargetCount, 2);
  assert.equal(intakeResponsePacket.conservativeSourceBuffer.dispatchableTargetCount, 2);
  assert.equal(intakeResponsePacket.conservativeSourceBuffer.reconciledTargetCount, 2);
  assert.equal(intakeResponsePacket.conservativeSourceBuffer.bufferStrideFloats, 8);
  assert.equal(intakeResponsePacket.conservativeSourceBuffer.targets.every((target) => target.sourceVectorF32.length === 8), true);
  assert.equal(intakeResponsePacket.conservativeSourceBuffer.quantumMaterialPropertySource.active, true);
  assert.ok(intakeResponsePacket.conservativeSourceBuffer.quantumMaterialPropertyThermalFluxBoostProxy > 0);
  assert.ok(intakeResponsePacket.conservativeSourceBuffer.targets.every((target) => target.quantumMaterialPropertySource.active === true));
  assert.equal(intakeResponsePacket.conservativeSourceBuffer.quantumMaterialStatisticalSource.active, true);
  assert.equal(intakeResponsePacket.conservativeSourceBuffer.quantumMaterialStatisticalSource.schema, QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA);
  assert.equal(intakeResponsePacket.conservativeSourceBuffer.quantumMaterialStatisticalSourceChannelCount, 5);
  assert.ok(intakeResponsePacket.conservativeSourceBuffer.quantumMaterialStatisticalPressureDriveProxy > 0);
  assert.ok(intakeResponsePacket.conservativeSourceBuffer.quantumMaterialStatisticalOpacityDriveProxy > 0);
  assert.ok(intakeResponsePacket.conservativeSourceBuffer.targets.every((target) => target.quantumMaterialStatisticalSource.active === true));
  assert.equal(intakeResponsePacket.conservativeSourceBuffer.quantumMaterialResponseDerivativeSource.active, true);
  assert.equal(intakeResponsePacket.conservativeSourceBuffer.quantumMaterialResponseDerivativeSource.schema, QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA);
  assert.ok(intakeResponsePacket.conservativeSourceBuffer.quantumMaterialResponseDerivativeTemperatureDrive > 0);
  assert.ok(intakeResponsePacket.conservativeSourceBuffer.quantumMaterialResponseDerivativeThermalFluxBoostProxy > 0);
  assert.ok(intakeResponsePacket.conservativeSourceBuffer.targets.every((target) => target.quantumMaterialResponseDerivativeSource.active === true));
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularTargetSourceReconciliation.schema, MOLECULAR_TARGET_SOURCE_RECONCILIATION_SCHEMA);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularConservativeSourceBuffer.schema, MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularConservativeSourceBufferQuantumMaterialActive, 1);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularConservativeSourceBufferQuantumMaterialThermalFluxBoostProxy > 0);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularConservativeSourceBufferQuantumMaterialPhaseDriveBoostProxy > 0);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularConservativeSourceBufferQuantumMaterialElectricalDrive > 0);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularConservativeSourceBufferQuantumStatisticalActive, 1);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularConservativeSourceBufferQuantumResponseDerivativeActive, 1);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularConservativeSourceBufferQuantumResponseDerivativeTemperatureDrive > 0);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularConservativeSourceBufferQuantumResponseDerivativeThermalFluxBoostProxy > 0);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularConservativeSourceBufferQuantumStatisticalSourceChannelCount, 5);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularConservativeSourceBufferQuantumStatisticalPressureDriveProxy > 0);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularConservativeSourceBufferQuantumStatisticalOpacityDriveProxy > 0);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularConservativeSourceBufferQuantumStatisticalDegeneracyPressureDriveProxy > 0);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.schema, MOLECULAR_SOURCE_BUFFER_APPLICATION_AGGREGATE_SCHEMA);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.reactive.schema, MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.sph.schema, MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.reactiveReport.schema, MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.sphReport.schema, MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialPropertySource.active, true);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialPropertyActiveTargetCount, 2);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialPropertyThermalFluxBoostProxy > 0);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialPropertyElectricalDrive > 0);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialStatisticalSource.active, true);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialStatisticalActiveTargetCount, 2);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialStatisticalSourceChannelCount, 5);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialStatisticalPressureDriveProxy > 0);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialStatisticalOpacityDriveProxy > 0);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialResponseDerivativeSource.active, true);
  assert.equal(
    intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialResponseDerivativeSource.schema,
    QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA
  );
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialResponseDerivativeActiveTargetCount, 2);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialResponseDerivativeTemperatureDrive > 0);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialResponseDerivativeThermalFluxBoostProxy > 0);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplicationQuantumMaterialActiveTargetCount, 2);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplicationQuantumMaterialThermalFluxBoostProxy > 0);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplicationQuantumMaterialMechanicalStiffnessDrive > 0);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplicationQuantumStatisticalActiveTargetCount, 2);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplicationQuantumStatisticalSourceChannelCount, 5);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplicationQuantumStatisticalPressureDriveProxy > 0);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplicationQuantumStatisticalDegeneracyPressureDriveProxy > 0);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplicationQuantumResponseDerivativeActiveTargetCount, 2);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplicationQuantumResponseDerivativeTemperatureDrive > 0);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplicationQuantumResponseDerivativeRadiationDrive > 0);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.reactiveReport.fields.length >= 27);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.sphReport.fields.length >= 28);
  const reactivePacketFields = intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.reactiveReport.fields
    .map((field) => field.field);
  const sphPacketFields = intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.sphReport.fields
    .map((field) => field.field);
  assert.ok(reactivePacketFields.includes('molecularQuantumMaterialPropertyThermalFluxBoostProxy'));
  assert.ok(reactivePacketFields.includes('molecularQuantumMaterialPropertyElectricalDrive'));
  assert.ok(reactivePacketFields.includes('molecularQuantumMaterialStatisticalPressureDriveProxy'));
  assert.ok(reactivePacketFields.includes('molecularQuantumMaterialStatisticalOpacityDriveProxy'));
  assert.ok(reactivePacketFields.includes('molecularQuantumMaterialStatisticalIonizationDriveProxy'));
  assert.ok(reactivePacketFields.includes('molecularQuantumMaterialResponseDerivativeTemperatureDrive'));
  assert.ok(reactivePacketFields.includes('molecularQuantumMaterialResponseDerivativeRadiationDrive'));
  assert.ok(reactivePacketFields.includes('molecularQuantumMaterialResponseDerivativeThermalFluxBoostProxy'));
  assert.ok(reactivePacketFields.includes('molecularQuantumMaterialResponseDerivativeElectricalDrive'));
  assert.ok(reactivePacketFields.includes('molecularQuantumMaterialResponseDerivativeDampingScale'));
  assert.ok(sphPacketFields.includes('molecularQuantumMaterialPropertyMechanicalStiffnessDrive'));
  assert.ok(sphPacketFields.includes('molecularQuantumMaterialPropertyDampingScale'));
  assert.ok(sphPacketFields.includes('molecularQuantumMaterialStatisticalDegeneracyPressureDriveProxy'));
  assert.ok(sphPacketFields.includes('molecularQuantumMaterialStatisticalTemperatureDeltaKProxy'));
  assert.ok(sphPacketFields.includes('molecularQuantumMaterialResponseDerivativeFieldDrive'));
  assert.ok(sphPacketFields.includes('molecularQuantumMaterialResponseDerivativePressureDrive'));
  assert.ok(sphPacketFields.includes('molecularQuantumMaterialResponseDerivativePhaseDriveBoostProxy'));
  assert.ok(sphPacketFields.includes('molecularQuantumMaterialResponseDerivativeMechanicalDrive'));
  assert.ok(sphPacketFields.includes('molecularQuantumMaterialResponseDerivativeOpticalDrive'));
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.targetReports.length, 2);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.appliedTargetCount, 2);
  assert.ok(intakeResponsePacket.upward.aggregateState.molecularSourceBufferApplication.appliedFieldCount >= 55);
  assert.equal(intakeResponsePacket.sourceBufferAcceptance.schema, MOLECULAR_SOURCE_BUFFER_ACCEPTANCE_SCHEMA);
  assert.equal(intakeResponsePacket.sourceBufferAcceptance.sourceBufferApplicationAggregateSchema, MOLECULAR_SOURCE_BUFFER_APPLICATION_AGGREGATE_SCHEMA);
  assert.equal(intakeResponsePacket.sourceBufferAcceptance.targetCount, 2);
  assert.equal(intakeResponsePacket.sourceBufferAcceptance.acceptedTargetCount, 2);
  assert.equal(intakeResponsePacket.sourceBufferAcceptance.blockedTargetCount, 0);
  assert.equal(intakeResponsePacket.sourceBufferAcceptance.canMutateProxy, true);
  assert.equal(intakeResponsePacket.sourceBufferAcceptance.scientificMutationReady, false);
  assert.equal(intakeResponsePacket.sourceBufferAcceptance.sourceTermCount, 16);
  assert.equal(intakeResponsePacket.sourceBufferAcceptance.expectedSourceTermCount, 16);
  assert.ok(intakeResponsePacket.sourceBufferAcceptance.targets.every((target) => target.accepted === true));
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferAcceptance.schema, MOLECULAR_SOURCE_BUFFER_ACCEPTANCE_SCHEMA);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferAcceptance.acceptedTargetCount, 2);
  assert.equal(intakeResponsePacket.sourceBufferWritebackValidation.schema, MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA);
  assert.equal(intakeResponsePacket.sourceBufferWritebackValidation.sourceBufferAcceptanceSchema, MOLECULAR_SOURCE_BUFFER_ACCEPTANCE_SCHEMA);
  assert.equal(intakeResponsePacket.sourceBufferWritebackValidation.sourceBufferApplicationAggregateSchema, MOLECULAR_SOURCE_BUFFER_APPLICATION_AGGREGATE_SCHEMA);
  assert.equal(intakeResponsePacket.sourceBufferWritebackValidation.targetCount, 2);
  assert.equal(intakeResponsePacket.sourceBufferWritebackValidation.validatedTargetCount, 2);
  assert.equal(intakeResponsePacket.sourceBufferWritebackValidation.blockedTargetCount, 0);
  assert.equal(intakeResponsePacket.sourceBufferWritebackValidation.canWritebackProxy, true);
  assert.equal(intakeResponsePacket.sourceBufferWritebackValidation.scientificWritebackReady, false);
  assert.equal(intakeResponsePacket.sourceBufferWritebackValidation.sourceTermCount, 16);
  assert.equal(intakeResponsePacket.sourceBufferWritebackValidation.expectedSourceTermCount, 16);
  assert.ok(intakeResponsePacket.sourceBufferWritebackValidation.targets.every((target) => target.validated === true));
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferWritebackValidation.schema, MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularSourceBufferWritebackValidation.validatedTargetCount, 2);
  assert.equal(intakeResponsePacket.targetBufferReplayValidation.schema, MOLECULAR_TARGET_BUFFER_REPLAY_VALIDATION_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferReplayValidation.sourceBufferWritebackValidationSchema, MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferReplayValidation.sourceBufferApplicationAggregateSchema, MOLECULAR_SOURCE_BUFFER_APPLICATION_AGGREGATE_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferReplayValidation.targetCount, 2);
  assert.equal(intakeResponsePacket.targetBufferReplayValidation.replayedTargetCount, 2);
  assert.equal(intakeResponsePacket.targetBufferReplayValidation.blockedTargetCount, 0);
  assert.equal(intakeResponsePacket.targetBufferReplayValidation.canReplayProxy, true);
  assert.equal(intakeResponsePacket.targetBufferReplayValidation.scientificReplayReady, false);
  assert.ok(intakeResponsePacket.targetBufferReplayValidation.applicationFieldCount >= 55);
  assert.equal(
    intakeResponsePacket.targetBufferReplayValidation.replayedFieldCount,
    intakeResponsePacket.targetBufferReplayValidation.applicationFieldCount
  );
  assert.equal(intakeResponsePacket.targetBufferReplayValidation.missingFieldCount, 0);
  assert.ok(intakeResponsePacket.targetBufferReplayValidation.targets.every((target) => target.replayed === true));
  assert.ok(intakeResponsePacket.targetBufferReplayValidation.targets.every((target) => target.fields.length > 0));
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularTargetBufferReplayValidation.schema, MOLECULAR_TARGET_BUFFER_REPLAY_VALIDATION_SCHEMA);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularTargetBufferReplayValidation.replayedTargetCount, 2);
  assert.equal(intakeResponsePacket.targetBufferMutationAudit.schema, MOLECULAR_TARGET_BUFFER_MUTATION_AUDIT_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferMutationAudit.sourceTargetBufferReplayValidationSchema, MOLECULAR_TARGET_BUFFER_REPLAY_VALIDATION_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferMutationAudit.sourceBufferWritebackValidationSchema, MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferMutationAudit.sourceBufferApplicationAggregateSchema, MOLECULAR_SOURCE_BUFFER_APPLICATION_AGGREGATE_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferMutationAudit.targetCount, 2);
  assert.equal(intakeResponsePacket.targetBufferMutationAudit.readyTargetCount, 2);
  assert.equal(intakeResponsePacket.targetBufferMutationAudit.blockedTargetCount, 0);
  assert.equal(intakeResponsePacket.targetBufferMutationAudit.canMutateProxy, true);
  assert.equal(intakeResponsePacket.targetBufferMutationAudit.canQueueWorkerWrite, false);
  assert.equal(intakeResponsePacket.targetBufferMutationAudit.workerWriteReady, false);
  assert.equal(intakeResponsePacket.targetBufferMutationAudit.scientificMutationReady, false);
  assert.ok(intakeResponsePacket.targetBufferMutationAudit.writeIntentCount >= 55);
  assert.equal(
    intakeResponsePacket.targetBufferMutationAudit.readyWriteIntentCount,
    intakeResponsePacket.targetBufferMutationAudit.writeIntentCount
  );
  assert.equal(intakeResponsePacket.targetBufferMutationAudit.blockedWriteIntentCount, 0);
  assert.equal(intakeResponsePacket.targetBufferMutationAudit.queuedWriteIntentCount, 0);
  assert.equal(intakeResponsePacket.targetBufferMutationAudit.appliedWriteIntentCount, 0);
  assert.ok(intakeResponsePacket.targetBufferMutationAudit.targets.every((target) => target.ready === true));
  assert.ok(intakeResponsePacket.targetBufferMutationAudit.targets.every((target) => target.writeIntents.length > 0));
  const mutationAuditFields = intakeResponsePacket.targetBufferMutationAudit.targets
    .flatMap((target) => target.writeIntents.map((intent) => intent.field));
  assert.ok(mutationAuditFields.includes('molecularQuantumMaterialPropertyThermalFluxBoostProxy'));
  assert.ok(mutationAuditFields.includes('molecularQuantumMaterialPropertyElectricalDrive'));
  assert.ok(mutationAuditFields.includes('molecularQuantumMaterialPropertyMechanicalStiffnessDrive'));
  assert.ok(mutationAuditFields.includes('molecularQuantumMaterialPropertyDampingScale'));
  assert.ok(mutationAuditFields.includes('molecularQuantumMaterialStatisticalPressureDriveProxy'));
  assert.ok(mutationAuditFields.includes('molecularQuantumMaterialStatisticalOpacityDriveProxy'));
  assert.ok(mutationAuditFields.includes('molecularQuantumMaterialStatisticalTemperatureDeltaKProxy'));
  assert.ok(mutationAuditFields.includes('molecularQuantumMaterialResponseDerivativeTemperatureDrive'));
  assert.ok(mutationAuditFields.includes('molecularQuantumMaterialResponseDerivativeThermalFluxBoostProxy'));
  assert.ok(mutationAuditFields.includes('molecularQuantumMaterialResponseDerivativePhaseDriveBoostProxy'));
  assert.ok(mutationAuditFields.includes('molecularQuantumMaterialResponseDerivativeElectricalDrive'));
  assert.ok(mutationAuditFields.includes('molecularQuantumMaterialResponseDerivativeMechanicalDrive'));
  assert.ok(mutationAuditFields.includes('molecularQuantumMaterialResponseDerivativeOpticalDrive'));
  assert.ok(mutationAuditFields.includes('molecularQuantumMaterialResponseDerivativeDampingScale'));
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularTargetBufferMutationAudit.schema, MOLECULAR_TARGET_BUFFER_MUTATION_AUDIT_SCHEMA);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularTargetBufferMutationAudit.readyTargetCount, 2);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.schema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_QUEUE_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.sourceTargetBufferMutationAuditSchema, MOLECULAR_TARGET_BUFFER_MUTATION_AUDIT_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.sourceTargetBufferReplayValidationSchema, MOLECULAR_TARGET_BUFFER_REPLAY_VALIDATION_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.sourceBufferWritebackValidationSchema, MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.targetBatchCount, 2);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.queueReadyBatchCount, 2);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.queueBlockedBatchCount, 0);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.canPlanWorkerWrite, true);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.canQueueWorkerWrite, false);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.workerWriteReady, false);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.scientificMutationReady, false);
  assert.ok(intakeResponsePacket.targetBufferWorkerWriteQueue.writeIntentCount >= 55);
  assert.equal(
    intakeResponsePacket.targetBufferWorkerWriteQueue.queueReadyWriteIntentCount,
    intakeResponsePacket.targetBufferWorkerWriteQueue.writeIntentCount
  );
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.blockedWriteIntentCount, 0);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.queuedWriteIntentCount, 0);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.dispatchedWriteIntentCount, 0);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteQueue.appliedWriteIntentCount, 0);
  assert.ok(intakeResponsePacket.targetBufferWorkerWriteQueue.blockers.includes('worker-buffer-write-path-not-implemented'));
  assert.ok(intakeResponsePacket.targetBufferWorkerWriteQueue.targetBatches.every((batch) => batch.queueReady === true));
  const workerQueueFields = intakeResponsePacket.targetBufferWorkerWriteQueue.targetBatches
    .flatMap((batch) => batch.fieldWrites.map((write) => write.field));
  assert.ok(workerQueueFields.includes('molecularQuantumMaterialPropertyThermalFluxBoostProxy'));
  assert.ok(workerQueueFields.includes('molecularQuantumMaterialPropertyOpticalHeatingDrive'));
  assert.ok(workerQueueFields.includes('molecularQuantumMaterialPropertyMechanicalStiffnessDrive'));
  assert.ok(workerQueueFields.includes('molecularQuantumMaterialStatisticalPressureDriveProxy'));
  assert.ok(workerQueueFields.includes('molecularQuantumMaterialStatisticalDegeneracyPressureDriveProxy'));
  assert.ok(workerQueueFields.includes('molecularQuantumMaterialResponseDerivativeRadiationDrive'));
  assert.ok(workerQueueFields.includes('molecularQuantumMaterialResponseDerivativeThermalFluxBoostProxy'));
  assert.ok(workerQueueFields.includes('molecularQuantumMaterialResponseDerivativePhaseDriveBoostProxy'));
  assert.ok(workerQueueFields.includes('molecularQuantumMaterialResponseDerivativeElectricalDrive'));
  assert.ok(workerQueueFields.includes('molecularQuantumMaterialResponseDerivativeMechanicalDrive'));
  assert.ok(workerQueueFields.includes('molecularQuantumMaterialResponseDerivativeOpticalDrive'));
  assert.ok(workerQueueFields.includes('molecularQuantumMaterialResponseDerivativeDampingScale'));
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularTargetBufferWorkerWriteQueue.schema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_QUEUE_SCHEMA);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularTargetBufferWorkerWriteQueue.queueReadyBatchCount, 2);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteExecution.schema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteExecution.sourceTargetBufferWorkerWriteQueueSchema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_QUEUE_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteExecution.sourceTargetBufferMutationAuditSchema, MOLECULAR_TARGET_BUFFER_MUTATION_AUDIT_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteExecution.targetBatchCount, 2);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteExecution.queueReadyBatchCount, 2);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteExecution.appliedBatchCount, 0);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteExecution.blockedBatchCount, 2);
  assert.ok(intakeResponsePacket.targetBufferWorkerWriteExecution.writeIntentCount >= 55);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteExecution.queuedWriteIntentCount, 0);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteExecution.dispatchedWriteIntentCount, 0);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteExecution.appliedWriteIntentCount, 0);
  assert.equal(
    intakeResponsePacket.targetBufferWorkerWriteExecution.skippedWriteIntentCount,
    intakeResponsePacket.targetBufferWorkerWriteExecution.writeIntentCount
  );
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteExecution.canExecuteProxy, false);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteExecution.workerWriteExecuted, false);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteExecution.applied, false);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteExecution.scientificMutationReady, false);
  assert.ok(intakeResponsePacket.targetBufferWorkerWriteExecution.blockers.includes('worker-write-execution-not-requested'));
  assert.ok(intakeResponsePacket.targetBufferWorkerWriteExecution.blockers.includes('target-worker-write-batch-blocked'));
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularTargetBufferWorkerWriteExecution.schema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularTargetBufferWorkerWriteExecution.blockedBatchCount, 2);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteVerification.schema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_VERIFICATION_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteVerification.sourceTargetBufferWorkerWriteExecutionSchema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteVerification.sourceTargetBufferWorkerWriteQueueSchema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_QUEUE_SCHEMA);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteVerification.targetBatchCount, 2);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteVerification.verifiedTargetCount, 0);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteVerification.blockedTargetCount, 2);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteVerification.fieldWriteCount, 0);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteVerification.verifiedFieldWriteCount, 0);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteVerification.canVerifyProxy, false);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteVerification.verified, false);
  assert.equal(intakeResponsePacket.targetBufferWorkerWriteVerification.scientificMutationReady, false);
  assert.ok(intakeResponsePacket.targetBufferWorkerWriteVerification.blockers.includes('worker-write-execution-not-applied'));
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularTargetBufferWorkerWriteVerification.schema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_VERIFICATION_SCHEMA);
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularTargetBufferWorkerWriteVerification.blockedTargetCount, 2);
  assert.equal(intakeResponsePacket.molecularScientificInvariantGate.schema, MOLECULAR_SCIENTIFIC_INVARIANT_GATE_SCHEMA);
  assert.equal(intakeResponsePacket.molecularScientificInvariantGate.scientificMutationReady, false);
  assert.equal(intakeResponsePacket.molecularScientificInvariantGate.canPromoteProxy, false);
  assert.equal(intakeResponsePacket.molecularScientificInvariantGate.workerWriteVerified, false);
  assert.ok(intakeResponsePacket.molecularScientificInvariantGate.requiredScopeCount >= 7);
  assert.ok(intakeResponsePacket.molecularScientificInvariantGate.blockedScopeCount >= 1);
  assert.ok(intakeResponsePacket.molecularScientificInvariantGate.scientificBlockers.includes('authoritative-gpu-buffer-mutation-required'));
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularScientificInvariantGate.schema, MOLECULAR_SCIENTIFIC_INVARIANT_GATE_SCHEMA);
  assert.equal(intakeResponsePacket.molecularScientificReadinessManifest.schema, MOLECULAR_SCIENTIFIC_READINESS_MANIFEST_SCHEMA);
  assert.equal(intakeResponsePacket.molecularScientificReadinessManifest.scientificMutationReady, false);
  assert.equal(intakeResponsePacket.molecularScientificReadinessManifest.canPromoteProxy, false);
  assert.equal(intakeResponsePacket.molecularScientificReadinessManifest.manifestComplete, false);
  assert.ok(intakeResponsePacket.molecularScientificReadinessManifest.requiredArtifactCount >= 7);
  assert.ok(intakeResponsePacket.molecularScientificReadinessManifest.blockedArtifactCount >= 1);
  assert.equal(
    intakeResponsePacket.molecularScientificReadinessManifest.nextRequiredArtifactId,
    'authoritative-gpu-worker-buffer-writer'
  );
  assert.ok(intakeResponsePacket.molecularScientificReadinessManifest.blockers.includes('authoritative-gpu-buffer-mutation-required'));
  assert.equal(intakeResponsePacket.upward.aggregateState.molecularScientificReadinessManifest.schema, MOLECULAR_SCIENTIFIC_READINESS_MANIFEST_SCHEMA);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetSourceReconciliationReconciledTargetCount, 2);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetSourceReconciliationPendingTargetCount, 0);
  assert.ok(Number.isFinite(intakeResponsePacket.upward.closures.molecularTargetSourceReconciliationResidual));
  assert.equal(intakeResponsePacket.upward.closures.molecularConservativeSourceBufferDispatchableTargetCount, 2);
  assert.equal(intakeResponsePacket.upward.closures.molecularConservativeSourceBufferStrideFloats, 8);
  assert.ok(Number.isFinite(intakeResponsePacket.upward.closures.molecularConservativeSourceBufferResidual));
  assert.equal(intakeResponsePacket.upward.closures.molecularSourceBufferApplicationAppliedTargetCount, 2);
  assert.ok(intakeResponsePacket.upward.closures.molecularSourceBufferApplicationAppliedFieldCount >= 55);
  assert.ok(Number.isFinite(intakeResponsePacket.upward.closures.molecularSourceBufferApplicationResidual));
  assert.equal(intakeResponsePacket.upward.closures.molecularSourceBufferAcceptanceAcceptedTargetCount, 2);
  assert.equal(intakeResponsePacket.upward.closures.molecularSourceBufferAcceptanceBlockedTargetCount, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularSourceBufferAcceptanceCanMutateProxy, 1);
  assert.ok(Number.isFinite(intakeResponsePacket.upward.closures.molecularSourceBufferAcceptanceResidual));
  assert.equal(intakeResponsePacket.upward.closures.molecularSourceBufferWritebackValidatedTargetCount, 2);
  assert.equal(intakeResponsePacket.upward.closures.molecularSourceBufferWritebackBlockedTargetCount, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularSourceBufferWritebackCanWritebackProxy, 1);
  assert.ok(Number.isFinite(intakeResponsePacket.upward.closures.molecularSourceBufferWritebackResidual));
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferReplayValidatedTargetCount, 2);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferReplayBlockedTargetCount, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferReplayCanReplayProxy, 1);
  assert.ok(intakeResponsePacket.upward.closures.molecularTargetBufferReplayFieldCount >= 55);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferReplayMissingFieldCount, 0);
  assert.ok(Number.isFinite(intakeResponsePacket.upward.closures.molecularTargetBufferReplayResidual));
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferMutationAuditReadyTargetCount, 2);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferMutationAuditBlockedTargetCount, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferMutationAuditCanMutateProxy, 1);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferMutationAuditCanQueueWorkerWrite, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferMutationAuditScientificReady, 0);
  assert.ok(intakeResponsePacket.upward.closures.molecularTargetBufferMutationAuditWriteIntentCount >= 55);
  assert.ok(intakeResponsePacket.upward.closures.molecularTargetBufferMutationAuditReadyWriteIntentCount >= 55);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferMutationAuditBlockedWriteIntentCount, 0);
  assert.ok(Number.isFinite(intakeResponsePacket.upward.closures.molecularTargetBufferMutationAuditResidual));
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteQueueBatchCount, 2);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteQueueReadyBatchCount, 2);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteQueueBlockedBatchCount, 0);
  assert.ok(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteQueueWriteIntentCount >= 55);
  assert.ok(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteQueueReadyWriteIntentCount >= 55);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteQueueBlockedWriteIntentCount, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteQueueQueuedWriteIntentCount, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteQueueCanPlan, 1);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteQueueCanQueueWorkerWrite, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteQueueScientificReady, 0);
  assert.ok(Number.isFinite(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteQueueResidual));
  assert.ok(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteQueueBlockerCount >= 1);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteExecutionBatchCount, 2);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteExecutionAppliedBatchCount, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteExecutionBlockedBatchCount, 2);
  assert.ok(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteExecutionWriteIntentCount >= 55);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteExecutionQueuedWriteIntentCount, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteExecutionDispatchedWriteIntentCount, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteExecutionAppliedWriteIntentCount, 0);
  assert.ok(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteExecutionSkippedWriteIntentCount >= 55);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteExecutionCanExecute, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteExecutionApplied, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteExecutionScientificReady, 0);
  assert.ok(Number.isFinite(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteExecutionResidual));
  assert.ok(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteExecutionBlockerCount >= 1);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteVerificationTargetCount, 2);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteVerificationBlockedTargetCount, 2);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteVerificationFieldWriteCount, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteVerificationCanVerify, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteVerificationVerified, 0);
  assert.equal(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteVerificationScientificReady, 0);
  assert.ok(Number.isFinite(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteVerificationResidual));
  assert.ok(intakeResponsePacket.upward.closures.molecularTargetBufferWorkerWriteVerificationBlockerCount >= 1);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetSourceIntakeActiveCount, 2);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetSourceIntakeAppliedOperationCount, intakeExecution.appliedOperationCount);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetSourceResponseRespondedCount, 2);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetSourceResponsePendingCount, 0);
  assert.ok(intakeResponsePacket.conservation.exchange.molecularTargetSourceResponseThermalDrive > 0);
  assert.ok(intakeResponsePacket.conservation.exchange.molecularTargetSourceResponseHeatFlux > 0);
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularTargetSourceResponseRespondedCount.unit, '1');
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularTargetSourceResponseHeatFlux.unit, 'W/m^2-proxy');
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetSourceReconciliationReconciledCount, 2);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetSourceReconciliationPendingCount, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetSourceReconciliationSequenceMismatchCount, 0);
  assert.ok(Number.isFinite(intakeResponsePacket.conservation.exchange.molecularTargetSourceReconciliationResidual));
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularTargetSourceReconciliationHeatFlux.unit, 'W/m^2-proxy');
  assert.equal(intakeResponsePacket.conservation.exchange.molecularConservativeSourceBufferDispatchableCount, 2);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularConservativeSourceBufferSourceTermCount, 16);
  assert.ok(Number.isFinite(intakeResponsePacket.conservation.exchange.molecularConservativeSourceBufferResidual));
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularConservativeSourceBufferHeatRate.unit, 'W-proxy');
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularConservativeSourceBufferSpeciesRate.unit, 'count/s-proxy');
  assert.equal(intakeResponsePacket.conservation.exchange.molecularSourceBufferApplicationAppliedCount, 2);
  assert.ok(intakeResponsePacket.conservation.exchange.molecularSourceBufferApplicationAppliedFieldCount >= 55);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularSourceBufferApplicationSourceTermCount, 16);
  assert.ok(Number.isFinite(intakeResponsePacket.conservation.exchange.molecularSourceBufferApplicationResidual));
  assert.equal(intakeResponsePacket.conservation.exchange.molecularSourceBufferAcceptanceAcceptedCount, 2);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularSourceBufferAcceptanceBlockedCount, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularSourceBufferAcceptanceCanMutateProxy, 1);
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularSourceBufferAcceptanceAcceptedCount.unit, '1');
  assert.ok(Number.isFinite(intakeResponsePacket.conservation.exchange.molecularSourceBufferAcceptanceResidual));
  assert.equal(intakeResponsePacket.conservation.exchange.molecularSourceBufferWritebackValidatedCount, 2);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularSourceBufferWritebackBlockedCount, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularSourceBufferWritebackCanWritebackProxy, 1);
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularSourceBufferWritebackValidatedCount.unit, '1');
  assert.ok(Number.isFinite(intakeResponsePacket.conservation.exchange.molecularSourceBufferWritebackResidual));
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferReplayValidatedCount, 2);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferReplayBlockedCount, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferReplayCanReplayProxy, 1);
  assert.ok(intakeResponsePacket.conservation.exchange.molecularTargetBufferReplayFieldCount >= 55);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferReplayMissingFieldCount, 0);
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularTargetBufferReplayValidatedCount.unit, '1');
  assert.ok(Number.isFinite(intakeResponsePacket.conservation.exchange.molecularTargetBufferReplayResidual));
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferMutationAuditReadyCount, 2);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferMutationAuditBlockedCount, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferMutationAuditCanMutateProxy, 1);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferMutationAuditCanQueueWorkerWrite, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferMutationAuditScientificReady, 0);
  assert.ok(intakeResponsePacket.conservation.exchange.molecularTargetBufferMutationAuditWriteIntentCount >= 55);
  assert.ok(intakeResponsePacket.conservation.exchange.molecularTargetBufferMutationAuditReadyWriteIntentCount >= 55);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferMutationAuditBlockedWriteIntentCount, 0);
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularTargetBufferMutationAuditReadyCount.unit, '1');
  assert.ok(Number.isFinite(intakeResponsePacket.conservation.exchange.molecularTargetBufferMutationAuditResidual));
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteQueueBatchCount, 2);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteQueueReadyBatchCount, 2);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteQueueBlockedBatchCount, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteQueueCanPlan, 1);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteQueueCanQueueWorkerWrite, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteQueueScientificReady, 0);
  assert.ok(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteQueueWriteIntentCount >= 55);
  assert.ok(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteQueueReadyWriteIntentCount >= 55);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteQueueBlockedWriteIntentCount, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteQueueQueuedWriteIntentCount, 0);
  assert.ok(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteQueueBlockerCount >= 1);
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularTargetBufferWorkerWriteQueueBatchCount.unit, '1');
  assert.ok(Number.isFinite(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteQueueResidual));
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteExecutionBatchCount, 2);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteExecutionAppliedBatchCount, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteExecutionBlockedBatchCount, 2);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteExecutionCanExecute, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteExecutionApplied, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteExecutionScientificReady, 0);
  assert.ok(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteExecutionWriteIntentCount >= 55);
  assert.ok(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteExecutionSkippedWriteIntentCount >= 55);
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularTargetBufferWorkerWriteExecutionBatchCount.unit, '1');
  assert.ok(Number.isFinite(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteExecutionResidual));
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteVerificationTargetCount, 2);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteVerificationBlockedTargetCount, 2);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteVerificationCanVerify, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteVerificationVerified, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteVerificationScientificReady, 0);
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularTargetBufferWorkerWriteVerificationTargetCount.unit, '1');
  assert.ok(Number.isFinite(intakeResponsePacket.conservation.exchange.molecularTargetBufferWorkerWriteVerificationResidual));
  assert.equal(intakeResponsePacket.conservation.exchange.molecularScientificInvariantGateCanPromoteProxy, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularScientificInvariantGateScientificReady, 0);
  assert.equal(intakeResponsePacket.conservation.exchange.molecularScientificInvariantGateAuthoritativeSatisfiedScopeCount, 0);
  assert.ok(intakeResponsePacket.conservation.exchange.molecularScientificInvariantGateBlockedScopeCount >= 1);
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularScientificInvariantGateCanPromoteProxy.unitStatus, 'boolean-proxy');
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularScientificInvariantGateScientificReady.confidence, 0.03);
  assert.equal(intakeResponsePacket.conservation.exchangeMetadata.molecularScientificInvariantGateBlockedScopeCount.unit, '1');
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetSourceResponseRespondedCount, 2);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetSourceResponsePendingCount, 0);
  assert.ok(intakeResponsePacket.coupling.exchange.molecularTargetSourceResponseHeatFlux > 0);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetSourceReconciliationReconciledCount, 2);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetSourceReconciliationPendingCount, 0);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularConservativeSourceBufferDispatchableCount, 2);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularConservativeSourceBufferSourceTermCount, 16);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularSourceBufferApplicationAppliedCount, 2);
  assert.ok(intakeResponsePacket.coupling.exchange.molecularSourceBufferApplicationAppliedFieldCount >= 55);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularSourceBufferApplicationSourceTermCount, 16);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularSourceBufferAcceptanceAcceptedCount, 2);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularSourceBufferAcceptanceBlockedCount, 0);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularSourceBufferAcceptanceCanMutateProxy, 1);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularSourceBufferWritebackValidatedCount, 2);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularSourceBufferWritebackBlockedCount, 0);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularSourceBufferWritebackCanWritebackProxy, 1);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferReplayValidatedCount, 2);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferReplayBlockedCount, 0);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferReplayCanReplayProxy, 1);
  assert.ok(intakeResponsePacket.coupling.exchange.molecularTargetBufferReplayFieldCount >= 55);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferMutationAuditReadyCount, 2);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferMutationAuditBlockedCount, 0);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferMutationAuditCanMutateProxy, 1);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferMutationAuditCanQueueWorkerWrite, 0);
  assert.ok(intakeResponsePacket.coupling.exchange.molecularTargetBufferMutationAuditWriteIntentCount >= 55);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteQueueBatchCount, 2);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteQueueReadyBatchCount, 2);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteQueueCanPlan, 1);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteQueueCanQueueWorkerWrite, 0);
  assert.ok(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteQueueWriteIntentCount >= 55);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteExecutionBatchCount, 2);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteExecutionAppliedBatchCount, 0);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteExecutionBlockedBatchCount, 2);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteExecutionCanExecute, 0);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteExecutionApplied, 0);
  assert.ok(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteExecutionWriteIntentCount >= 55);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteVerificationTargetCount, 2);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount, 0);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteVerificationBlockedTargetCount, 2);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteVerificationCanVerify, 0);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularTargetBufferWorkerWriteVerificationVerified, 0);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularScientificInvariantGateCanPromoteProxy, 0);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularScientificInvariantGateScientificReady, 0);
  assert.equal(intakeResponsePacket.coupling.exchange.molecularScientificInvariantGateAuthoritativeSatisfiedScopeCount, 0);
  assert.ok(intakeResponsePacket.coupling.exchange.molecularScientificInvariantGateBlockedScopeCount >= 1);
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')
      ?.adapterContext.targetSourceResponse.schema,
    MOLECULAR_TARGET_SOURCE_RESPONSE_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')
      ?.adapterContext.targetSourceReconciliation.schema,
    MOLECULAR_TARGET_SOURCE_RECONCILIATION_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')
      ?.adapterContext.conservativeSourceBuffer.schema,
    MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')
      ?.adapterContext.sourceBufferApplicationSummary.schema,
    MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')
      ?.adapterContext.sourceBufferAcceptance.schema,
    MOLECULAR_SOURCE_BUFFER_ACCEPTANCE_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')
      ?.adapterContext.sourceBufferWritebackValidation.schema,
    MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')
      ?.adapterContext.targetBufferReplayValidation.schema,
    MOLECULAR_TARGET_BUFFER_REPLAY_VALIDATION_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')
      ?.adapterContext.targetBufferMutationAudit.schema,
    MOLECULAR_TARGET_BUFFER_MUTATION_AUDIT_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')
      ?.adapterContext.targetBufferWorkerWriteQueue.schema,
    MOLECULAR_TARGET_BUFFER_WORKER_WRITE_QUEUE_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')
      ?.adapterContext.targetBufferWorkerWriteExecution.schema,
    MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')
      ?.adapterContext.targetBufferWorkerWriteVerification.schema,
    MOLECULAR_TARGET_BUFFER_WORKER_WRITE_VERIFICATION_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')
      ?.adapterContext.targetSourceResponseSummary.schema,
    MOLECULAR_TARGET_SOURCE_RESPONSE_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')
      ?.adapterContext.targetSourceReconciliationSummary.schema,
    MOLECULAR_TARGET_SOURCE_RECONCILIATION_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')
      ?.adapterContext.sourceBufferApplicationSummary.schema,
    MOLECULAR_SOURCE_BUFFER_APPLICATION_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')
      ?.adapterContext.sourceBufferWritebackValidation.schema,
    MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')
      ?.adapterContext.targetBufferReplayValidation.schema,
    MOLECULAR_TARGET_BUFFER_REPLAY_VALIDATION_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')
      ?.adapterContext.targetBufferMutationAudit.schema,
    MOLECULAR_TARGET_BUFFER_MUTATION_AUDIT_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')
      ?.adapterContext.targetBufferWorkerWriteQueue.schema,
    MOLECULAR_TARGET_BUFFER_WORKER_WRITE_QUEUE_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')
      ?.adapterContext.targetBufferWorkerWriteExecution.schema,
    MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA
  );
  assert.equal(
    intakeResponsePacket.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')
      ?.adapterContext.targetBufferWorkerWriteVerification.schema,
    MOLECULAR_TARGET_BUFFER_WORKER_WRITE_VERIFICATION_SCHEMA
  );

  const workerWriteExecution = intakeModel.executeMolecularTargetBufferWorkerWrite({
    reason: 'unit-test',
    config: {
      executionRequested: true,
      proxyWorkerWriteEnabled: true,
      targetWorkerWriteImplemented: true
    }
  });
  assert.equal(workerWriteExecution.schema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA);
  assert.equal(workerWriteExecution.status, 'applied-reduced-worker-write-proxy');
  assert.equal(workerWriteExecution.canExecuteProxy, true);
  assert.equal(workerWriteExecution.workerWriteExecuted, true);
  assert.equal(workerWriteExecution.applied, true);
  assert.equal(workerWriteExecution.scientificMutationReady, false);
  assert.equal(workerWriteExecution.targetBatchCount, 2);
  assert.equal(workerWriteExecution.appliedBatchCount, 2);
  assert.equal(workerWriteExecution.blockedBatchCount, 0);
  assert.equal(workerWriteExecution.queuedWriteIntentCount, workerWriteExecution.writeIntentCount);
  assert.equal(workerWriteExecution.dispatchedWriteIntentCount, workerWriteExecution.writeIntentCount);
  assert.equal(workerWriteExecution.appliedWriteIntentCount, workerWriteExecution.writeIntentCount);
  assert.equal(workerWriteExecution.skippedWriteIntentCount, 0);
  assert.ok(workerWriteExecution.stateWriteSetCount >= 55);
  assert.equal(workerWriteExecution.maxWorkerWriteResidualProxy, 0);
  assert.equal(workerWriteExecution.blockerCount, 0);
  assert.equal(workerWriteExecution.targets.every((target) => target.applied === true), true);
  assert.equal(workerWriteExecution.targets.every((target) => target.fieldWrites.length > 0), true);
  const workerWriteFields = workerWriteExecution.targets
    .flatMap((target) => target.fieldWrites.map((write) => write.field));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialPropertyThermalFluxBoostProxy'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialPropertyElectricalDrive'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialPropertyMechanicalStiffnessDrive'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialPropertyDampingScale'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialStatisticalPressureDriveProxy'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialStatisticalOpacityDriveProxy'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialStatisticalDegeneracyPressureDriveProxy'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialResponseDerivativeTemperatureDrive'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialResponseDerivativePressureDrive'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialResponseDerivativeFieldDrive'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialResponseDerivativeRadiationDrive'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialResponseDerivativeThermalFluxBoostProxy'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialResponseDerivativePhaseDriveBoostProxy'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialResponseDerivativeElectricalDrive'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialResponseDerivativeMechanicalDrive'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialResponseDerivativeOpticalDrive'));
  assert.ok(workerWriteFields.includes('molecularQuantumMaterialResponseDerivativeDampingScale'));
  const packetAfterWorkerWrite = intakeModel.createPacket();
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteExecution.schema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteExecution.applied, true);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteExecution.appliedBatchCount, 2);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteExecution.appliedWriteIntentCount, workerWriteExecution.writeIntentCount);
  assert.equal(packetAfterWorkerWrite.upward.aggregateState.molecularTargetBufferWorkerWriteExecution.schema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA);
  assert.equal(packetAfterWorkerWrite.upward.aggregateState.molecularTargetBufferWorkerWriteExecution.appliedBatchCount, 2);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteVerification.schema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_VERIFICATION_SCHEMA);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteVerification.status, 'validated-reduced-worker-write-verification-proxy');
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteVerification.canVerifyProxy, true);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteVerification.verified, true);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteVerification.scientificMutationReady, false);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteVerification.targetBatchCount, 2);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteVerification.verifiedTargetCount, 2);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteVerification.blockedTargetCount, 0);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteVerification.fieldWriteCount, workerWriteExecution.writeIntentCount);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteVerification.verifiedFieldWriteCount, workerWriteExecution.writeIntentCount);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteVerification.skippedFieldWriteCount, 0);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteVerification.missingFieldWriteCount, 0);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteVerification.mismatchedFieldWriteCount, 0);
  assert.equal(packetAfterWorkerWrite.targetBufferWorkerWriteVerification.maxVerificationResidualProxy, 0);
  assert.equal(packetAfterWorkerWrite.upward.aggregateState.molecularTargetBufferWorkerWriteVerification.schema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_VERIFICATION_SCHEMA);
  assert.equal(packetAfterWorkerWrite.upward.aggregateState.molecularTargetBufferWorkerWriteVerification.verifiedTargetCount, 2);
  assert.equal(packetAfterWorkerWrite.molecularScientificInvariantGate.schema, MOLECULAR_SCIENTIFIC_INVARIANT_GATE_SCHEMA);
  assert.equal(packetAfterWorkerWrite.molecularScientificInvariantGate.status, 'proxy-verified-scientific-blocked');
  assert.equal(packetAfterWorkerWrite.molecularScientificInvariantGate.workerWriteVerified, true);
  assert.equal(packetAfterWorkerWrite.molecularScientificInvariantGate.canPromoteProxy, true);
  assert.equal(packetAfterWorkerWrite.molecularScientificInvariantGate.scientificMutationReady, false);
  assert.ok(packetAfterWorkerWrite.molecularScientificInvariantGate.proxySatisfiedScopeCount >= 4);
  assert.equal(packetAfterWorkerWrite.molecularScientificInvariantGate.authoritativeSatisfiedScopeCount, 0);
  assert.equal(
    packetAfterWorkerWrite.molecularScientificInvariantGate.blockedScopeCount,
    packetAfterWorkerWrite.molecularScientificInvariantGate.requiredScopeCount
  );
  assert.ok(packetAfterWorkerWrite.molecularScientificInvariantGate.scientificBlockers.includes('calibrated-heat-capacity-enthalpy-model-required'));
  assert.ok(packetAfterWorkerWrite.molecularScientificInvariantGate.scopes.some((scope) => (
    scope.scope === 'authoritative-gpu-worker-buffer'
    && scope.proxySatisfied === true
    && scope.authoritativeSatisfied === false
  )));
  assert.equal(packetAfterWorkerWrite.upward.aggregateState.molecularScientificInvariantGate.schema, MOLECULAR_SCIENTIFIC_INVARIANT_GATE_SCHEMA);
  assert.equal(packetAfterWorkerWrite.upward.aggregateState.molecularScientificInvariantGate.canPromoteProxy, true);
  assert.equal(packetAfterWorkerWrite.molecularScientificReadinessManifest.schema, MOLECULAR_SCIENTIFIC_READINESS_MANIFEST_SCHEMA);
  assert.equal(packetAfterWorkerWrite.molecularScientificReadinessManifest.status, 'proxy-promotable-authoritative-artifacts-blocked');
  assert.equal(packetAfterWorkerWrite.molecularScientificReadinessManifest.canPromoteProxy, true);
  assert.equal(packetAfterWorkerWrite.molecularScientificReadinessManifest.scientificMutationReady, false);
  assert.equal(packetAfterWorkerWrite.molecularScientificReadinessManifest.manifestComplete, false);
  assert.ok(packetAfterWorkerWrite.molecularScientificReadinessManifest.proxySatisfiedArtifactCount >= 4);
  assert.equal(packetAfterWorkerWrite.molecularScientificReadinessManifest.authoritativeReadyArtifactCount, 0);
  assert.equal(
    packetAfterWorkerWrite.molecularScientificReadinessManifest.blockedArtifactCount,
    packetAfterWorkerWrite.molecularScientificReadinessManifest.requiredArtifactCount
  );
  assert.equal(
    packetAfterWorkerWrite.molecularScientificReadinessManifest.nextRequiredArtifactId,
    'authoritative-gpu-worker-buffer-writer'
  );
  assert.ok(packetAfterWorkerWrite.molecularScientificReadinessManifest.artifacts.some((artifact) => (
    artifact.artifactId === 'authoritative-gpu-worker-buffer-writer'
    && artifact.proxySatisfied === true
    && artifact.authoritativeSatisfied === false
  )));
  assert.ok(packetAfterWorkerWrite.molecularScientificReadinessManifest.blockers.includes('worker-buffer-writeback-hook-required'));
  assert.equal(packetAfterWorkerWrite.upward.aggregateState.molecularScientificReadinessManifest.schema, MOLECULAR_SCIENTIFIC_READINESS_MANIFEST_SCHEMA);
  assert.equal(packetAfterWorkerWrite.upward.aggregateState.molecularScientificReadinessManifest.canPromoteProxy, true);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularScientificReadinessRequiredArtifactCount, packetAfterWorkerWrite.molecularScientificReadinessManifest.requiredArtifactCount);
  assert.ok(packetAfterWorkerWrite.upward.closures.molecularScientificReadinessBlockedArtifactCount >= 1);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularScientificReadinessManifestComplete, 0);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularTargetBufferWorkerWriteExecutionCanExecute, 1);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularTargetBufferWorkerWriteExecutionApplied, 1);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularTargetBufferWorkerWriteExecutionAppliedBatchCount, 2);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularTargetBufferWorkerWriteExecutionBlockedBatchCount, 0);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularTargetBufferWorkerWriteExecutionAppliedWriteIntentCount, workerWriteExecution.writeIntentCount);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularTargetBufferWorkerWriteExecutionSkippedWriteIntentCount, 0);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularTargetBufferWorkerWriteVerificationCanVerify, 1);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularTargetBufferWorkerWriteVerificationVerified, 1);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount, 2);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularTargetBufferWorkerWriteVerificationBlockedTargetCount, 0);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularTargetBufferWorkerWriteVerificationVerifiedFieldWriteCount, workerWriteExecution.writeIntentCount);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularTargetBufferWorkerWriteVerificationMissingFieldWriteCount, 0);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularTargetBufferWorkerWriteVerificationMismatchedFieldWriteCount, 0);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularScientificInvariantGateCanPromoteProxy, 1);
  assert.equal(packetAfterWorkerWrite.upward.closures.molecularScientificInvariantGateScientificReady, 0);
  assert.ok(packetAfterWorkerWrite.upward.closures.molecularScientificInvariantGateBlockedScopeCount >= 1);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularTargetBufferWorkerWriteExecutionCanExecute, 1);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularTargetBufferWorkerWriteExecutionApplied, 1);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularTargetBufferWorkerWriteExecutionAppliedBatchCount, 2);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularTargetBufferWorkerWriteExecutionBlockedBatchCount, 0);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularTargetBufferWorkerWriteExecutionAppliedWriteIntentCount, workerWriteExecution.writeIntentCount);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularTargetBufferWorkerWriteExecutionSkippedWriteIntentCount, 0);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularTargetBufferWorkerWriteVerificationCanVerify, 1);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularTargetBufferWorkerWriteVerificationVerified, 1);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount, 2);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularTargetBufferWorkerWriteVerificationBlockedTargetCount, 0);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularTargetBufferWorkerWriteVerificationVerifiedFieldWriteCount, workerWriteExecution.writeIntentCount);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularTargetBufferWorkerWriteVerificationMissingFieldWriteCount, 0);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularTargetBufferWorkerWriteVerificationMismatchedFieldWriteCount, 0);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularScientificInvariantGateCanPromoteProxy, 1);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularScientificInvariantGateScientificReady, 0);
  assert.ok(packetAfterWorkerWrite.conservation.exchange.molecularScientificInvariantGateProxySatisfiedScopeCount >= 4);
  assert.equal(packetAfterWorkerWrite.conservation.exchange.molecularScientificInvariantGateAuthoritativeSatisfiedScopeCount, 0);
  assert.equal(
    packetAfterWorkerWrite.conservation.exchange.molecularScientificInvariantGateBlockedScopeCount,
    packetAfterWorkerWrite.molecularScientificInvariantGate.requiredScopeCount
  );
  assert.equal(packetAfterWorkerWrite.conservation.exchangeMetadata.molecularScientificInvariantGateCanPromoteProxy.unitStatus, 'boolean-proxy');
  assert.equal(packetAfterWorkerWrite.conservation.exchangeMetadata.molecularScientificInvariantGateAuthoritativeSatisfiedScopeCount.unitStatus, 'count');
  assert.equal(packetAfterWorkerWrite.coupling.exchange.molecularTargetBufferWorkerWriteExecutionCanExecute, 1);
  assert.equal(packetAfterWorkerWrite.coupling.exchange.molecularTargetBufferWorkerWriteExecutionApplied, 1);
  assert.equal(packetAfterWorkerWrite.coupling.exchange.molecularTargetBufferWorkerWriteExecutionAppliedBatchCount, 2);
  assert.equal(packetAfterWorkerWrite.coupling.exchange.molecularTargetBufferWorkerWriteExecutionBlockedBatchCount, 0);
  assert.equal(packetAfterWorkerWrite.coupling.exchange.molecularTargetBufferWorkerWriteVerificationCanVerify, 1);
  assert.equal(packetAfterWorkerWrite.coupling.exchange.molecularTargetBufferWorkerWriteVerificationVerified, 1);
  assert.equal(packetAfterWorkerWrite.coupling.exchange.molecularTargetBufferWorkerWriteVerificationVerifiedTargetCount, 2);
  assert.equal(packetAfterWorkerWrite.coupling.exchange.molecularTargetBufferWorkerWriteVerificationBlockedTargetCount, 0);
  assert.equal(packetAfterWorkerWrite.coupling.exchange.molecularScientificInvariantGateCanPromoteProxy, 1);
  assert.equal(packetAfterWorkerWrite.coupling.exchange.molecularScientificInvariantGateScientificReady, 0);
  assert.ok(packetAfterWorkerWrite.coupling.exchange.molecularScientificInvariantGateProxySatisfiedScopeCount >= 4);
  assert.equal(packetAfterWorkerWrite.coupling.exchange.molecularScientificInvariantGateAuthoritativeSatisfiedScopeCount, 0);
  assert.equal(
    packetAfterWorkerWrite.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')
      ?.adapterContext.targetBufferWorkerWriteExecution.applied,
    true
  );
  assert.equal(
    packetAfterWorkerWrite.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')
      ?.adapterContext.targetBufferWorkerWriteVerification.verified,
    true
  );
  assert.equal(
    packetAfterWorkerWrite.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')
      ?.adapterContext.targetBufferWorkerWriteExecution.applied,
    true
  );
  assert.equal(
    packetAfterWorkerWrite.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')
      ?.adapterContext.targetBufferWorkerWriteVerification.verified,
    true
  );

  const model = new MultiscaleModel();
  model.setEnvironment(environment);
  model.applyReactiveThermalResult(reactiveDriven);
  model.applySphMaterialResult(sphDriven);
  const packet = model.createPacket();
  assert.equal(model.state.surface.reactiveCell.molecularClosureApplied, true);
  assert.equal(model.state.mpm.sphMaterial.molecularClosureApplied, true);
  assert.ok(model.state.surface.reactiveCell.molecularClosureHeatFluxProxy > 0);
  assert.ok(model.state.mpm.sphMaterial.molecularClosureRadiativeHeatFluxBoost > 0);
  assert.equal(model.state.surface.reactiveCell.molecularReactionSourceSchema, MOLECULAR_REACTION_SOURCE_SCHEMA);
  assert.equal(model.state.mpm.sphMaterial.molecularReactionSourceSchema, MOLECULAR_REACTION_SOURCE_SCHEMA);
  assert.equal(model.state.surface.reactiveCell.molecularReactionHeatSourceProxy, 0.42);
  assert.equal(model.state.mpm.sphMaterial.molecularReactionHeatSourceProxy, 0.42);
  assert.equal(model.state.surface.reactiveCell.molecularPhaseRegime, 'plasma');
  assert.equal(model.state.mpm.sphMaterial.molecularPhaseRegime, 'plasma');
  assert.ok(model.state.surface.reactiveCell.molecularPhaseDriveProxy > 0);
  assert.ok(model.state.mpm.sphMaterial.molecularPhaseDriveProxy > 0);
  assert.ok(model.state.surface.reactiveCell.molecularLatentHeatSinkProxy > 0);
  assert.ok(model.state.mpm.sphMaterial.molecularLatentHeatReleaseProxy > 0);
  assert.equal(packet.upward.aggregateState.reactiveCell.molecularClosureApplied, true);
  assert.equal(packet.upward.aggregateState.sphMaterial.molecularClosureApplied, true);
  assert.equal(packet.upward.aggregateState.reactiveCell.molecularReactionSourceSchema, MOLECULAR_REACTION_SOURCE_SCHEMA);
  assert.equal(packet.upward.aggregateState.sphMaterial.molecularReactionSourceSchema, MOLECULAR_REACTION_SOURCE_SCHEMA);
  assert.equal(packet.upward.aggregateState.reactiveCell.molecularReactionHeatSourceProxy, 0.42);
  assert.equal(packet.upward.aggregateState.sphMaterial.molecularReactionHeatSourceProxy, 0.42);
  assert.equal(packet.upward.aggregateState.reactiveCell.molecularPhaseRegime, 'plasma');
  assert.equal(packet.upward.aggregateState.sphMaterial.molecularPhaseRegime, 'plasma');
  assert.ok(packet.upward.aggregateState.reactiveCell.molecularPhaseDriveProxy > 0);
  assert.ok(packet.upward.aggregateState.sphMaterial.molecularPhaseDriveProxy > 0);
  assert.ok(packet.upward.closures.reactiveMolecularPhaseDrive > 0);
  assert.ok(packet.upward.closures.sphMolecularPhaseDrive > 0);
  assert.equal(packet.upward.aggregateState.reactiveCell.molecularSourceSink.schema, MOLECULAR_SOURCE_SINK_SCHEMA);
  assert.equal(packet.upward.aggregateState.sphMaterial.molecularSourceSink.schema, MOLECULAR_SOURCE_SINK_SCHEMA);
  assert.equal(packet.upward.aggregateState.reactiveCell.molecularSourceSink.dominantMolecule, 'H2O');
  assert.equal(packet.upward.aggregateState.sphMaterial.molecularSourceSink.stoichiometryResidualProxy, 0.12);
  assert.ok(packet.conservation.exchange.molecularPhaseDrive > 0);
  assert.ok(packet.conservation.exchange.molecularLatentHeatSinkProxy > 0);
  assert.ok(packet.conservation.exchange.molecularLatentHeatReleaseProxy > 0);
  assert.equal(packet.conservation.exchangeMetadata.molecularPhaseDrive.unit, '1');
  assert.equal(packet.sourceSinkBalance.schema, MOLECULAR_SOURCE_SINK_BALANCE_SCHEMA);
  assert.equal(packet.sourceSinkBalance.source.inferredFromConsumers, true);
  assert.equal(packet.sourceSinkBalance.coverage.activeTargetCount, 2);
  assert.equal(packet.sourceSinkBalance.coverage.sourceDriveCoverage, 1);
  assert.equal(packet.sourceEquation.schema, MOLECULAR_SOURCE_EQUATION_SCHEMA);
  assert.equal(packet.sourceEquation.basis.sourceBalanceSchema, MOLECULAR_SOURCE_SINK_BALANCE_SCHEMA);
  assert.equal(packet.sourceEquation.basis.closedSystem, false);
  assert.equal(packet.sourceEquation.basis.phaseEosSchema, MOLECULAR_PHASE_EOS_BASIS_SCHEMA);
  assert.equal(packet.sourceEquation.terms.energy.unit, 'W-proxy');
  assert.equal(packet.sourceEquation.terms.energy.dimensions, 'M L^2 T^-3');
  assert.equal(packet.sourceEquation.terms.species.dimensions, 'T^-1');
  assert.ok(Number.isFinite(packet.sourceEquation.terms.energy.temperatureRateKPerSProxy));
  assert.ok(Number.isFinite(packet.sourceEquation.terms.energy.phaseEnergyRateWProxy));
  assert.ok(Number.isFinite(packet.sourceEquation.terms.energy.phaseEosSpecificFreeEnergyProxy));
  assert.ok(Number.isFinite(packet.sourceEquation.terms.energy.phaseEosStabilityResidualProxy));
  assert.ok(packet.sourceEquation.terms.species.sourceRateCountPerSProxy > 0);
  assert.equal(packet.sourceTransfer.schema, MOLECULAR_CONSERVATIVE_TRANSFER_SCHEMA);
  assert.equal(packet.sourceTransfer.dryRun, true);
  assert.equal(packet.sourceTransfer.applied, false);
  assert.equal(packet.sourceTransfer.allocations.length, 2);
  assert.equal(packet.sourceTransfer.units.heatRate.unit, 'W-proxy');
  assert.equal(packet.sourceTransfer.units.speciesRate.dimensions, 'T^-1');
  assert.ok(Number.isFinite(packet.sourceTransfer.residuals.closedSystemResidualProxy));
  assert.equal(packet.sourceTransferApplication.schema, MOLECULAR_TRANSFER_APPLICATION_SCHEMA);
  assert.equal(packet.sourceTransferApplication.sourceTransferSchema, MOLECULAR_CONSERVATIVE_TRANSFER_SCHEMA);
  assert.equal(packet.sourceTransferApplication.canApply, false);
  assert.equal(packet.sourceTransferApplication.applied, false);
  assert.equal(packet.sourceTransferApplication.allocationCount, 2);
  assert.equal(packet.sourceTransferApplication.blockedTargetCount, 2);
  assert.equal(packet.sourceTransferApplication.readyTargetCount, 0);
  assert.equal(packet.sourceTransferApplication.appliedTargetCount, 0);
  assert.ok(packet.sourceTransferApplication.blockers.includes('dry-run-disabled'));
  assert.ok(packet.sourceTransferApplication.blockers.includes('mutation-enabled'));
  assert.equal(packet.sourceTransferApplication.targets.every((target) => target.applied === false), true);
  assert.equal(packet.sourceTransferTransaction.schema, MOLECULAR_TRANSFER_TRANSACTION_SCHEMA);
  assert.equal(packet.sourceTransferTransaction.sourceApplicationSchema, MOLECULAR_TRANSFER_APPLICATION_SCHEMA);
  assert.equal(packet.sourceTransferTransaction.allowed, false);
  assert.equal(packet.sourceTransferTransaction.applied, false);
  assert.equal(packet.sourceTransferTransaction.transactionEnabled, false);
  assert.equal(packet.sourceTransferTransaction.applicationRequested, false);
  assert.equal(packet.sourceTransferTransaction.applicationCanApply, false);
  assert.equal(packet.sourceTransferTransaction.targetCount, 2);
  assert.equal(packet.sourceTransferTransaction.blockedTargetCount, 2);
  assert.equal(packet.sourceTransferTransaction.appliedTargetCount, 0);
  assert.ok(packet.sourceTransferTransaction.blockers.includes('application-not-requested'));
  assert.ok(packet.sourceTransferTransaction.blockers.includes('application-gate-blocked'));
  assert.ok(packet.sourceTransferTransaction.blockers.includes('transaction-disabled'));
  assert.ok(packet.sourceTransferTransaction.blockers.includes('mutator-unavailable'));
  assert.equal(packet.sourceTransferTargetPreview.schema, MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA);
  assert.equal(packet.sourceTransferTargetPreview.sourceTransactionSchema, MOLECULAR_TRANSFER_TRANSACTION_SCHEMA);
  assert.equal(packet.sourceTransferTargetPreview.dryRun, true);
  assert.equal(packet.sourceTransferTargetPreview.applied, false);
  assert.equal(packet.sourceTransferTargetPreview.mutationEnabled, false);
  assert.equal(packet.sourceTransferTargetPreview.previewTargetCount, 2);
  assert.equal(packet.sourceTransferTargetPreview.blockedTargetCount, 2);
  assert.equal(packet.sourceTransferTargetPreview.appliedTargetCount, 0);
  assert.ok(packet.sourceTransferTargetPreview.blockers.includes('target-mutator-not-validated'));
  assert.ok(packet.sourceTransferTargetPreview.blockers.includes('preview-only-non-mutating'));
  assert.ok(Number.isFinite(packet.sourceTransferTargetPreview.sourceTerms.maxAbsTemperatureDeltaKProxy));
  assert.ok(packet.sourceTransferTargetPreview.sourceTerms.maxAbsTemperatureDeltaKProxy > 0);
  const reactivePreview = packet.sourceTransferTargetPreview.targets.find((target) => target.targetSolverId === 'reactive-thermal-cell');
  const sphPreview = packet.sourceTransferTargetPreview.targets.find((target) => target.targetSolverId === 'sph-material');
  assert.equal(reactivePreview.stateKey, 'surface:reactive-thermal:campfire');
  assert.equal(sphPreview.stateKey, 'mpm:sph-material:water-balloon');
  assert.equal(reactivePreview.applied, false);
  assert.equal(sphPreview.applied, false);
  assert.ok(reactivePreview.blockers.includes('preview-only-non-mutating'));
  assert.ok(sphPreview.blockers.includes('target-mutator-not-validated'));
  assert.ok(Number.isFinite(reactivePreview.before.temperatureK));
  assert.ok(reactivePreview.after.temperatureK >= reactivePreview.before.temperatureK);
  assert.ok(Number.isFinite(sphPreview.before.averageTemperatureK));
  assert.ok(sphPreview.after.averageTemperatureK >= sphPreview.before.averageTemperatureK);
  assert.ok(Number.isFinite(sphPreview.sourceTerms.phaseDriveDeltaProxy));
  assert.equal(packet.sourceTransferTargetMutatorRegistry.schema, MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutatorRegistry.sourcePreviewSchema, MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutatorRegistry.dryRun, true);
  assert.equal(packet.sourceTransferTargetMutatorRegistry.mutationEnabled, false);
  assert.equal(packet.sourceTransferTargetMutatorRegistry.canMutate, false);
  assert.equal(packet.sourceTransferTargetMutatorRegistry.applied, false);
  assert.equal(packet.sourceTransferTargetMutatorRegistry.targetCount, 2);
  assert.equal(packet.sourceTransferTargetMutatorRegistry.registeredMutatorCount, 2);
  assert.equal(packet.sourceTransferTargetMutatorRegistry.validatedMutatorCount, 0);
  assert.equal(packet.sourceTransferTargetMutatorRegistry.blockedMutatorCount, 2);
  assert.ok(packet.sourceTransferTargetMutatorRegistry.declaredFieldCount >= 10);
  assert.ok(packet.sourceTransferTargetMutatorRegistry.invariantScopeCount >= 3);
  assert.ok(packet.sourceTransferTargetMutatorRegistry.blockers.includes('target-mutator-validation-pending'));
  assert.ok(packet.sourceTransferTargetMutatorRegistry.blockers.includes('conservative-accounting-not-validated'));
  assert.ok(packet.sourceTransferTargetMutatorRegistry.blockers.includes('source-state-mutation-disabled'));
  const reactiveRegistry = packet.sourceTransferTargetMutatorRegistry.targets.find((target) => target.targetSolverId === 'reactive-thermal-cell');
  const sphRegistry = packet.sourceTransferTargetMutatorRegistry.targets.find((target) => target.targetSolverId === 'sph-material');
  assert.equal(reactiveRegistry.registered, true);
  assert.equal(sphRegistry.registered, true);
  assert.equal(reactiveRegistry.validated, false);
  assert.equal(sphRegistry.validated, false);
  assert.ok(reactiveRegistry.fields.some((field) => field.field === 'temperatureK' && field.unit === 'K'));
  assert.ok(reactiveRegistry.fields.some((field) => field.field === 'molecularReactionSpeciesRateProxy' && field.dimensions === 'T^-1'));
  assert.ok(sphRegistry.fields.some((field) => field.field === 'phaseChangeRateProxy' && field.sourceTerm === 'phaseDriveDeltaProxy'));
  assert.ok(sphRegistry.invariants.required.includes('phase-proxy'));
  assert.equal(packet.sourceTransferTargetMutationPreflight.schema, MOLECULAR_TARGET_MUTATION_PREFLIGHT_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationPreflight.sourceRegistrySchema, MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationPreflight.sourcePreviewSchema, MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationPreflight.dryRun, true);
  assert.equal(packet.sourceTransferTargetMutationPreflight.canMutate, false);
  assert.equal(packet.sourceTransferTargetMutationPreflight.applied, false);
  assert.equal(packet.sourceTransferTargetMutationPreflight.targetCount, 2);
  assert.equal(packet.sourceTransferTargetMutationPreflight.checkedTargetCount, 2);
  assert.equal(packet.sourceTransferTargetMutationPreflight.passedTargetCount, 0);
  assert.equal(packet.sourceTransferTargetMutationPreflight.blockedTargetCount, 2);
  assert.equal(packet.sourceTransferTargetMutationPreflight.appliedTargetCount, 0);
  assert.equal(packet.sourceTransferTargetMutationPreflight.registeredMutatorCount, 2);
  assert.equal(packet.sourceTransferTargetMutationPreflight.validatedMutatorCount, 0);
  assert.ok(packet.sourceTransferTargetMutationPreflight.declaredFieldCount >= 10);
  assert.ok(packet.sourceTransferTargetMutationPreflight.invariantScopeCount >= 3);
  assert.ok(Number.isFinite(packet.sourceTransferTargetMutationPreflight.maxResidualRiskProxy));
  assert.ok(Number.isFinite(packet.sourceTransferTargetMutationPreflight.residualToleranceProxy));
  assert.ok(packet.sourceTransferTargetMutationPreflight.blockers.includes('preflight-non-mutating'));
  assert.ok(packet.sourceTransferTargetMutationPreflight.blockers.includes('target-mutator-validation-pending'));
  assert.ok(packet.sourceTransferTargetMutationPreflight.blockers.includes('conservative-accounting-not-validated'));
  assert.ok(packet.sourceTransferTargetMutationPreflight.targets.some((target) => (
    target.targetSolverId === 'reactive-thermal-cell'
    && target.declaredFieldCount >= 6
    && target.checks.some((check) => check.id === 'declared-fields' && check.passed === true)
    && target.checks.some((check) => check.id === 'preflight-non-mutating' && check.passed === false)
  )));
  assert.ok(packet.sourceTransferTargetMutationPreflight.targets.some((target) => (
    target.targetSolverId === 'sph-material'
    && target.invariantScopeCount >= 4
    && Number.isFinite(target.residuals.residualRiskProxy)
    && target.blockers.includes('source-state-mutation-disabled')
  )));
  assert.equal(packet.sourceTransferTargetMutationOperationPlan.schema, MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationOperationPlan.sourcePreflightSchema, MOLECULAR_TARGET_MUTATION_PREFLIGHT_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationOperationPlan.sourceRegistrySchema, MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationOperationPlan.sourcePreviewSchema, MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationOperationPlan.dryRun, true);
  assert.equal(packet.sourceTransferTargetMutationOperationPlan.canApply, false);
  assert.equal(packet.sourceTransferTargetMutationOperationPlan.applied, false);
  assert.equal(packet.sourceTransferTargetMutationOperationPlan.targetCount, 2);
  assert.ok(packet.sourceTransferTargetMutationOperationPlan.operationCount >= 10);
  assert.equal(packet.sourceTransferTargetMutationOperationPlan.allowedByRegistryOperationCount, packet.sourceTransferTargetMutationOperationPlan.operationCount);
  assert.equal(packet.sourceTransferTargetMutationOperationPlan.blockedOperationCount, packet.sourceTransferTargetMutationOperationPlan.operationCount);
  assert.equal(packet.sourceTransferTargetMutationOperationPlan.appliedOperationCount, 0);
  assert.ok(Number.isFinite(packet.sourceTransferTargetMutationOperationPlan.maxAbsFieldDeltaProxy));
  assert.ok(packet.sourceTransferTargetMutationOperationPlan.blockers.includes('operation-plan-non-mutating'));
  const reactiveOperationPlan = packet.sourceTransferTargetMutationOperationPlan.targets.find((target) => target.targetSolverId === 'reactive-thermal-cell');
  const sphOperationPlan = packet.sourceTransferTargetMutationOperationPlan.targets.find((target) => target.targetSolverId === 'sph-material');
  assert.ok(reactiveOperationPlan.operations.some((operation) => (
    operation.field === 'temperatureK'
    && operation.unit === 'K'
    && operation.allowedByRegistry === true
    && operation.applied === false
    && operation.blockers.includes('operation-plan-non-mutating')
  )));
  assert.ok(sphOperationPlan.operations.some((operation) => (
    operation.field === 'phaseChangeRateProxy'
    && operation.sourceTerm === 'phaseDriveDeltaProxy'
    && operation.canApply === false
  )));
  assert.equal(packet.sourceTransferTargetMutationInvariantCheck.schema, MOLECULAR_TARGET_MUTATION_INVARIANT_CHECK_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationInvariantCheck.sourceOperationPlanSchema, MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationInvariantCheck.sourcePreflightSchema, MOLECULAR_TARGET_MUTATION_PREFLIGHT_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationInvariantCheck.sourceRegistrySchema, MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationInvariantCheck.dryRun, true);
  assert.equal(packet.sourceTransferTargetMutationInvariantCheck.canApply, false);
  assert.equal(packet.sourceTransferTargetMutationInvariantCheck.applied, false);
  assert.equal(packet.sourceTransferTargetMutationInvariantCheck.targetCount, 2);
  assert.equal(packet.sourceTransferTargetMutationInvariantCheck.checkedTargetCount, 2);
  assert.equal(packet.sourceTransferTargetMutationInvariantCheck.passedTargetCount, 2);
  assert.equal(packet.sourceTransferTargetMutationInvariantCheck.blockedTargetCount, 2);
  assert.equal(packet.sourceTransferTargetMutationInvariantCheck.appliedTargetCount, 0);
  assert.ok(packet.sourceTransferTargetMutationInvariantCheck.operationCount >= 10);
  assert.ok(packet.sourceTransferTargetMutationInvariantCheck.coveredInvariantScopeCount >= 7);
  assert.equal(packet.sourceTransferTargetMutationInvariantCheck.missingInvariantScopeCount, 0);
  assert.equal(packet.sourceTransferTargetMutationInvariantCheck.residualBudgetPassCount, 2);
  assert.ok(Number.isFinite(packet.sourceTransferTargetMutationInvariantCheck.maxResidualProxy));
  assert.ok(packet.sourceTransferTargetMutationInvariantCheck.blockers.includes('invariant-check-non-mutating'));
  assert.ok(packet.sourceTransferTargetMutationInvariantCheck.blockers.includes('operation-plan-blocked'));
  assert.ok(packet.sourceTransferTargetMutationInvariantCheck.targets.some((target) => (
    target.targetSolverId === 'reactive-thermal-cell'
    && target.invariantCoveragePassed === true
    && target.scopeChecks.some((check) => check.scope === 'energy-proxy' && check.passed === true)
    && target.scopeChecks.some((check) => check.scope === 'species-proxy' && check.passed === true)
    && target.scopeChecks.some((check) => check.scope === 'provenance' && check.passed === true)
  )));
  assert.ok(packet.sourceTransferTargetMutationInvariantCheck.targets.some((target) => (
    target.targetSolverId === 'sph-material'
    && target.invariantCoveragePassed === true
    && target.scopeChecks.some((check) => check.scope === 'phase-proxy' && check.passed === true)
    && target.residualBudgetPassed === true
  )));
  assert.equal(packet.sourceTransferTargetMutationCommit.schema, MOLECULAR_TARGET_MUTATION_COMMIT_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationCommit.sourceInvariantCheckSchema, MOLECULAR_TARGET_MUTATION_INVARIANT_CHECK_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationCommit.sourceOperationPlanSchema, MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationCommit.dryRun, true);
  assert.equal(packet.sourceTransferTargetMutationCommit.canCommit, false);
  assert.equal(packet.sourceTransferTargetMutationCommit.committed, false);
  assert.equal(packet.sourceTransferTargetMutationCommit.targetCount, 2);
  assert.equal(packet.sourceTransferTargetMutationCommit.invariantEligibleTargetCount, 2);
  assert.equal(packet.sourceTransferTargetMutationCommit.committableTargetCount, 0);
  assert.equal(packet.sourceTransferTargetMutationCommit.blockedTargetCount, 2);
  assert.equal(packet.sourceTransferTargetMutationCommit.committedTargetCount, 0);
  assert.ok(packet.sourceTransferTargetMutationCommit.plannedOperationCount >= 10);
  assert.equal(packet.sourceTransferTargetMutationCommit.committedOperationCount, 0);
  assert.equal(packet.sourceTransferTargetMutationCommit.blockedOperationCount, packet.sourceTransferTargetMutationCommit.plannedOperationCount);
  assert.ok(packet.sourceTransferTargetMutationCommit.blockers.includes('commit-dispatch-not-enabled'));
  assert.ok(packet.sourceTransferTargetMutationCommit.blockers.includes('target-mutator-apply-not-implemented'));
  assert.ok(packet.sourceTransferTargetMutationCommit.targets.every((target) => (
    target.invariantEligible === true
    && target.canCommit === false
    && target.committed === false
    && target.status === 'commit-blocked'
  )));
  assert.equal(packet.sourceTransferTargetMutationDispatch.schema, MOLECULAR_TARGET_MUTATION_DISPATCH_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationDispatch.sourceCommitSchema, MOLECULAR_TARGET_MUTATION_COMMIT_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationDispatch.sourceOperationPlanSchema, MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationDispatch.dryRun, true);
  assert.equal(packet.sourceTransferTargetMutationDispatch.dispatchEnabled, false);
  assert.equal(packet.sourceTransferTargetMutationDispatch.canDispatch, false);
  assert.equal(packet.sourceTransferTargetMutationDispatch.queued, false);
  assert.equal(packet.sourceTransferTargetMutationDispatch.dispatched, false);
  assert.equal(packet.sourceTransferTargetMutationDispatch.batchCount, 2);
  assert.equal(packet.sourceTransferTargetMutationDispatch.invariantEligibleBatchCount, 2);
  assert.equal(packet.sourceTransferTargetMutationDispatch.dispatchableBatchCount, 0);
  assert.equal(packet.sourceTransferTargetMutationDispatch.blockedBatchCount, 2);
  assert.ok(packet.sourceTransferTargetMutationDispatch.operationCount >= 10);
  assert.equal(packet.sourceTransferTargetMutationDispatch.dispatchedOperationCount, 0);
  assert.equal(packet.sourceTransferTargetMutationDispatch.blockedOperationCount, packet.sourceTransferTargetMutationDispatch.operationCount);
  assert.ok(packet.sourceTransferTargetMutationDispatch.blockers.includes('dispatch-disabled'));
  assert.ok(packet.sourceTransferTargetMutationDispatch.blockers.includes('target-mutator-apply-not-implemented'));
  assert.ok(packet.sourceTransferTargetMutationDispatch.batches.every((batch) => (
    batch.invariantEligible === true
    && batch.canDispatch === false
    && batch.queued === false
    && batch.dispatched === false
    && batch.status === 'dispatch-blocked'
    && batch.operations.length > 0
  )));
  assert.equal(packet.sourceTransferTargetMutationApplyValidation.schema, MOLECULAR_TARGET_MUTATION_APPLY_VALIDATION_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationApplyValidation.sourceDispatchSchema, MOLECULAR_TARGET_MUTATION_DISPATCH_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationApplyValidation.sourceOperationPlanSchema, MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationApplyValidation.dryRun, true);
  assert.equal(packet.sourceTransferTargetMutationApplyValidation.applyEnabled, false);
  assert.equal(packet.sourceTransferTargetMutationApplyValidation.canApply, false);
  assert.equal(packet.sourceTransferTargetMutationApplyValidation.applied, false);
  assert.equal(packet.sourceTransferTargetMutationApplyValidation.targetCount, 2);
  assert.equal(packet.sourceTransferTargetMutationApplyValidation.validatedTargetCount, 2);
  assert.equal(packet.sourceTransferTargetMutationApplyValidation.applyReadyTargetCount, 0);
  assert.equal(packet.sourceTransferTargetMutationApplyValidation.blockedTargetCount, 2);
  assert.ok(packet.sourceTransferTargetMutationApplyValidation.operationCount >= 10);
  assert.equal(packet.sourceTransferTargetMutationApplyValidation.validatedOperationCount, packet.sourceTransferTargetMutationApplyValidation.operationCount);
  assert.equal(packet.sourceTransferTargetMutationApplyValidation.appliedOperationCount, 0);
  assert.ok(packet.sourceTransferTargetMutationApplyValidation.stateWriteSetCount >= 10);
  assert.ok(packet.sourceTransferTargetMutationApplyValidation.maxBeforeAfterResidualProxy <= 1e-9);
  assert.ok(packet.sourceTransferTargetMutationApplyValidation.blockers.includes('apply-disabled'));
  assert.ok(packet.sourceTransferTargetMutationApplyValidation.blockers.includes('target-mutator-apply-not-implemented'));
  assert.ok(packet.sourceTransferTargetMutationApplyValidation.blockers.includes('dispatch-not-ready'));
  assert.ok(packet.sourceTransferTargetMutationApplyValidation.targets.every((target) => (
    target.validated === true
    && target.canApply === false
    && target.applied === false
    && target.status === 'apply-blocked'
    && target.operations.length > 0
  )));
  assert.equal(packet.sourceTransferTargetMutationApplyExecution.schema, MOLECULAR_TARGET_MUTATION_APPLY_EXECUTION_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationApplyExecution.sourceApplyValidationSchema, MOLECULAR_TARGET_MUTATION_APPLY_VALIDATION_SCHEMA);
  assert.equal(packet.sourceTransferTargetMutationApplyExecution.validationPassed, true);
  assert.equal(packet.sourceTransferTargetMutationApplyExecution.executionRequested, false);
  assert.equal(packet.sourceTransferTargetMutationApplyExecution.proxyApplyEnabled, false);
  assert.equal(packet.sourceTransferTargetMutationApplyExecution.targetApplyImplemented, false);
  assert.equal(packet.sourceTransferTargetMutationApplyExecution.canExecute, false);
  assert.equal(packet.sourceTransferTargetMutationApplyExecution.applied, false);
  assert.equal(packet.sourceTransferTargetMutationApplyExecution.dryRun, true);
  assert.equal(packet.sourceTransferTargetMutationApplyExecution.targetCount, 2);
  assert.equal(packet.sourceTransferTargetMutationApplyExecution.appliedTargetCount, 0);
  assert.equal(packet.sourceTransferTargetMutationApplyExecution.operationCount, packet.sourceTransferTargetMutationApplyValidation.operationCount);
  assert.equal(packet.sourceTransferTargetMutationApplyExecution.appliedOperationCount, 0);
  assert.ok(packet.sourceTransferTargetMutationApplyExecution.maxBeforeAfterResidualProxy <= 1e-9);
  assert.ok(packet.sourceTransferTargetMutationApplyExecution.blockers.includes('execution-not-requested'));
  assert.ok(packet.sourceTransferTargetMutationApplyExecution.blockers.includes('proxy-apply-disabled'));
  assert.ok(packet.sourceTransferTargetMutationApplyExecution.blockers.includes('target-mutator-apply-not-implemented'));
  assert.equal(model.getMolecularTransferTransactionConfig().transactionEnabled, false);
  assert.equal(model.getMolecularTransferTransactionConfig().mutatorId, null);
  assert.equal(model.getMolecularTransferApplicationConfig().applicationRequested, false);
  assert.equal(model.getMolecularTransferApplicationConfig().mutationEnabled, false);
  assert.equal(model.getMolecularTransferApplicationConfig().scientificMode, false);
  assert.equal(model.getMolecularTransferApplicationConfig().targetAdaptersValidated, false);
  assert.equal(model.getMolecularTransferApplicationConfig().closedResidualToleranceProxy, 0.02);
  assert.equal(model.getMolecularTargetMutationApplyConfig().executionRequested, false);
  assert.equal(model.getMolecularTargetMutationApplyConfig().proxyApplyEnabled, false);
  assert.equal(model.getMolecularTargetMutationApplyConfig().targetApplyImplemented, false);
  assert.equal(model.getMolecularTargetMutationApplyConfig().residualToleranceProxy, 1e-9);
  const configuredApplication = model.setMolecularTransferApplicationConfig({
    applicationRequested: true,
    mutationEnabled: true,
    scientificMode: true,
    targetAdaptersValidated: true,
    closedResidualToleranceProxy: 0.5
  });
  assert.equal(configuredApplication.applicationRequested, true);
  assert.equal(configuredApplication.mutationEnabled, true);
  assert.equal(configuredApplication.scientificMode, true);
  assert.equal(configuredApplication.targetAdaptersValidated, true);
  assert.equal(configuredApplication.closedResidualToleranceProxy, 0.5);
  const configuredTransaction = model.setMolecularTransferTransactionConfig({
    transactionEnabled: true,
    mutatorId: 'reactive-sph-source-preview-v0'
  });
  assert.equal(configuredTransaction.transactionEnabled, true);
  assert.equal(configuredTransaction.mutatorId, 'reactive-sph-source-preview-v0');
  const configuredPacket = model.createPacket();
  assert.equal(configuredPacket.sourceTransferApplication.applicationRequested, true);
  assert.equal(configuredPacket.sourceTransferApplication.mutationEnabled, true);
  assert.equal(configuredPacket.sourceTransferApplication.scientificMode, true);
  assert.equal(configuredPacket.sourceTransferApplication.targetAdaptersValidated, true);
  assert.equal(configuredPacket.sourceTransferApplication.canApply, false);
  assert.equal(configuredPacket.sourceTransferApplication.applied, false);
  assert.ok(configuredPacket.sourceTransferApplication.blockers.includes('dry-run-disabled'));
  assert.equal(configuredPacket.sourceTransferApplication.blockers.includes('mutation-enabled'), false);
  assert.equal(configuredPacket.sourceTransferApplication.blockers.includes('scientific-mode-enabled'), false);
  assert.equal(configuredPacket.sourceTransferApplication.blockers.includes('target-adapters-validated'), false);
  assert.equal(configuredPacket.sourceTransferTransaction.schema, MOLECULAR_TRANSFER_TRANSACTION_SCHEMA);
  assert.equal(configuredPacket.sourceTransferTransaction.applicationRequested, true);
  assert.equal(configuredPacket.sourceTransferTransaction.applicationCanApply, false);
  assert.equal(configuredPacket.sourceTransferTransaction.allowed, false);
  assert.equal(configuredPacket.sourceTransferTransaction.applied, false);
  assert.equal(configuredPacket.sourceTransferTransaction.transactionEnabled, true);
  assert.equal(configuredPacket.sourceTransferTransaction.mutatorId, 'reactive-sph-source-preview-v0');
  assert.equal(configuredPacket.sourceTransferTransaction.mutationAttempted, true);
  assert.ok(configuredPacket.sourceTransferTransaction.blockers.includes('application-gate-blocked'));
  assert.equal(configuredPacket.sourceTransferTransaction.blockers.includes('transaction-disabled'), false);
  assert.equal(configuredPacket.sourceTransferTransaction.blockers.includes('mutator-unavailable'), false);
  assert.equal(configuredPacket.sourceTransferTransaction.blockers.includes('application-not-requested'), false);
  assert.equal(configuredPacket.sourceTransferTargetPreview.schema, MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA);
  assert.equal(configuredPacket.sourceTransferTargetPreview.mutationAttempted, true);
  assert.equal(configuredPacket.sourceTransferTargetPreview.applied, false);
  assert.ok(configuredPacket.sourceTransferTargetPreview.blockers.includes('target-mutator-not-validated'));
  assert.equal(configuredPacket.sourceTransferTargetMutatorRegistry.schema, MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA);
  assert.equal(configuredPacket.sourceTransferTargetMutatorRegistry.canMutate, false);
  assert.ok(configuredPacket.sourceTransferTargetMutatorRegistry.blockers.includes('conservative-accounting-not-validated'));
  assert.equal(configuredPacket.sourceTransferTargetMutationPreflight.schema, MOLECULAR_TARGET_MUTATION_PREFLIGHT_SCHEMA);
  assert.equal(configuredPacket.sourceTransferTargetMutationPreflight.canMutate, false);
  assert.equal(configuredPacket.sourceTransferTargetMutationPreflight.applied, false);
  assert.ok(configuredPacket.sourceTransferTargetMutationPreflight.blockers.includes('preflight-non-mutating'));
  assert.equal(configuredPacket.sourceTransferTargetMutationOperationPlan.schema, MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA);
  assert.equal(configuredPacket.sourceTransferTargetMutationOperationPlan.canApply, false);
  assert.equal(configuredPacket.sourceTransferTargetMutationOperationPlan.appliedOperationCount, 0);
  assert.ok(configuredPacket.sourceTransferTargetMutationOperationPlan.blockers.includes('operation-plan-non-mutating'));
  assert.equal(configuredPacket.sourceTransferTargetMutationInvariantCheck.schema, MOLECULAR_TARGET_MUTATION_INVARIANT_CHECK_SCHEMA);
  assert.equal(configuredPacket.sourceTransferTargetMutationInvariantCheck.canApply, false);
  assert.equal(configuredPacket.sourceTransferTargetMutationInvariantCheck.appliedTargetCount, 0);
  assert.ok(configuredPacket.sourceTransferTargetMutationInvariantCheck.blockers.includes('invariant-check-non-mutating'));
  assert.equal(configuredPacket.sourceTransferTargetMutationCommit.schema, MOLECULAR_TARGET_MUTATION_COMMIT_SCHEMA);
  assert.equal(configuredPacket.sourceTransferTargetMutationCommit.canCommit, false);
  assert.equal(configuredPacket.sourceTransferTargetMutationCommit.committedOperationCount, 0);
  assert.ok(configuredPacket.sourceTransferTargetMutationCommit.blockers.includes('commit-dispatch-not-enabled'));
  assert.equal(configuredPacket.sourceTransferTargetMutationDispatch.schema, MOLECULAR_TARGET_MUTATION_DISPATCH_SCHEMA);
  assert.equal(configuredPacket.sourceTransferTargetMutationDispatch.canDispatch, false);
  assert.equal(configuredPacket.sourceTransferTargetMutationDispatch.dispatchedOperationCount, 0);
  assert.ok(configuredPacket.sourceTransferTargetMutationDispatch.blockers.includes('dispatch-disabled'));
  assert.equal(configuredPacket.sourceTransferTargetMutationApplyValidation.schema, MOLECULAR_TARGET_MUTATION_APPLY_VALIDATION_SCHEMA);
  assert.equal(configuredPacket.sourceTransferTargetMutationApplyValidation.canApply, false);
  assert.equal(configuredPacket.sourceTransferTargetMutationApplyValidation.appliedOperationCount, 0);
  assert.ok(configuredPacket.sourceTransferTargetMutationApplyValidation.blockers.includes('apply-disabled'));
  const configuredApply = model.setMolecularTargetMutationApplyConfig({
    executionRequested: true,
    proxyApplyEnabled: true,
    targetApplyImplemented: true
  });
  assert.equal(configuredApply.executionRequested, true);
  assert.equal(configuredApply.proxyApplyEnabled, true);
  assert.equal(configuredApply.targetApplyImplemented, true);
  const applyReadyPacket = model.createPacket();
  assert.equal(applyReadyPacket.sourceTransferTargetMutationApplyExecution.schema, MOLECULAR_TARGET_MUTATION_APPLY_EXECUTION_SCHEMA);
  assert.equal(applyReadyPacket.sourceTransferTargetMutationApplyExecution.canExecute, true);
  assert.equal(applyReadyPacket.sourceTransferTargetMutationApplyExecution.applied, false);
  assert.equal(applyReadyPacket.sourceTransferTargetMutationApplyExecution.status, 'ready-to-execute');
  assert.equal(applyReadyPacket.sourceTransferTargetMutationApplyExecution.blockerCount, 0);
  const execution = model.executeMolecularTargetMutationApply({ reason: 'unit-test' });
  assert.equal(execution.schema, MOLECULAR_TARGET_MUTATION_APPLY_EXECUTION_SCHEMA);
  assert.equal(execution.status, 'applied-proxy');
  assert.equal(execution.applied, true);
  assert.equal(execution.dryRun, false);
  assert.equal(execution.canExecute, true);
  assert.equal(execution.appliedTargetCount, 2);
  assert.equal(execution.appliedTargetCount, execution.targetCount);
  assert.equal(execution.appliedOperationCount, execution.operationCount);
  assert.ok(execution.stateWriteSetCount >= 10);
  assert.equal(execution.blockerCount, 0);
  const reactiveExecution = execution.targets.find((target) => target.targetSolverId === 'reactive-thermal-cell');
  const sphExecution = execution.targets.find((target) => target.targetSolverId === 'sph-material');
  const reactiveTemperatureWrite = reactiveExecution?.operations.find((operation) => operation.field === 'temperatureK');
  const sphTemperatureWrite = sphExecution?.operations.find((operation) => operation.field === 'averageTemperatureK');
  assert.ok(Number.isFinite(reactiveTemperatureWrite?.actualAfterValue));
  assert.ok(Number.isFinite(sphTemperatureWrite?.actualAfterValue));
  assert.ok(Math.abs(model.state.surface.reactiveCell.temperatureK - reactiveTemperatureWrite.actualAfterValue) <= 1e-9);
  assert.ok(Math.abs(model.state.mpm.sphMaterial.averageTemperatureK - sphTemperatureWrite.actualAfterValue) <= 1e-9);
  const packetAfterExecution = model.createPacket();
  assert.equal(packetAfterExecution.upward.aggregateState.molecularTargetMutationApplyExecution.schema, MOLECULAR_TARGET_MUTATION_APPLY_EXECUTION_SCHEMA);
  assert.equal(packetAfterExecution.upward.aggregateState.molecularTargetMutationApplyExecution.appliedTargetCount, 2);
  assert.equal(packetAfterExecution.upward.aggregateState.molecularTargetMutationApplyExecution.appliedOperationCount, execution.operationCount);
  assert.equal(packetAfterExecution.upward.closures.molecularTargetMutationApplyExecutionAppliedTargetCount, 2);
  assert.equal(packetAfterExecution.upward.closures.molecularTargetMutationApplyExecutionAppliedOperationCount, execution.operationCount);
  assert.equal(packetAfterExecution.conservation.exchange.molecularTargetMutationApplyExecutionAppliedTargetCount, 2);
  assert.equal(packetAfterExecution.conservation.exchange.molecularTargetMutationApplyExecutionAppliedOperationCount, execution.operationCount);
  assert.equal(packetAfterExecution.coupling.exchange.molecularTargetMutationApplyExecutionAppliedTargetCount, 2);
  assert.equal(packetAfterExecution.coupling.exchange.molecularTargetMutationApplyExecutionAppliedOperationCount, execution.operationCount);
  assert.equal(packetAfterExecution.sourceTransferTargetSourceIntake.schema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.equal(packetAfterExecution.sourceTransferTargetSourceIntake.status, 'ready');
  assert.equal(packetAfterExecution.sourceTransferTargetSourceIntake.activeTargetCount, 2);
  assert.equal(packetAfterExecution.sourceTransferTargetSourceIntake.appliedOperationCount, execution.operationCount);
  assert.ok(packetAfterExecution.sourceTransferTargetSourceIntake.totalHeatRateWProxy > 0);
  assert.ok(packetAfterExecution.sourceTransferTargetSourceIntake.maxThermalDrive > 0);
  assert.equal(packetAfterExecution.sourceTransferTargetSourceResponse.schema, MOLECULAR_TARGET_SOURCE_RESPONSE_SCHEMA);
  assert.equal(packetAfterExecution.sourceTransferTargetSourceResponse.sourceIntakeSchema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.equal(packetAfterExecution.sourceTransferTargetSourceResponse.activeTargetCount, 2);
  assert.equal(packetAfterExecution.sourceTransferTargetSourceResponse.sourceApplyExecutionSequence, execution.sequence);
  assert.ok(Number.isFinite(packetAfterExecution.sourceTransferTargetSourceResponse.pendingTargetCount));
  assert.equal(packetAfterExecution.sourceTransferTargetSourceReconciliation.schema, MOLECULAR_TARGET_SOURCE_RECONCILIATION_SCHEMA);
  assert.equal(packetAfterExecution.sourceTransferTargetSourceReconciliation.sourceIntakeSchema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.equal(packetAfterExecution.sourceTransferTargetSourceReconciliation.targetResponseSchema, MOLECULAR_TARGET_SOURCE_RESPONSE_SCHEMA);
  assert.equal(packetAfterExecution.sourceTransferTargetSourceReconciliation.activeTargetCount, 2);
  assert.ok(Number.isFinite(packetAfterExecution.sourceTransferTargetSourceReconciliation.pendingTargetCount));
  assert.ok(Number.isFinite(packetAfterExecution.sourceTransferTargetSourceReconciliation.reconciliationResidualProxy));
  assert.equal(packetAfterExecution.conservativeSourceBuffer.schema, MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA);
  assert.equal(packetAfterExecution.conservativeSourceBuffer.sourceEquationSchema, MOLECULAR_SOURCE_EQUATION_SCHEMA);
  assert.equal(packetAfterExecution.conservativeSourceBuffer.sourceIntakeSchema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.equal(packetAfterExecution.conservativeSourceBuffer.targetReconciliationSchema, MOLECULAR_TARGET_SOURCE_RECONCILIATION_SCHEMA);
  assert.equal(packetAfterExecution.conservativeSourceBuffer.activeTargetCount, 2);
  assert.equal(packetAfterExecution.conservativeSourceBuffer.dispatchableTargetCount, 2);
  assert.equal(packetAfterExecution.conservativeSourceBuffer.bufferStrideFloats, 8);
  assert.equal(packetAfterExecution.conservativeSourceBuffer.targets.every((target) => target.sourceVectorF32.length === 8), true);
  assert.equal(packetAfterExecution.upward.aggregateState.molecularTargetSourceIntake.schema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.equal(packetAfterExecution.upward.aggregateState.molecularTargetSourceIntake.activeTargetCount, 2);
  assert.equal(packetAfterExecution.upward.aggregateState.molecularTargetSourceResponse.schema, MOLECULAR_TARGET_SOURCE_RESPONSE_SCHEMA);
  assert.equal(packetAfterExecution.upward.aggregateState.molecularTargetSourceResponse.sourceIntakeSchema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.equal(packetAfterExecution.upward.aggregateState.molecularTargetSourceReconciliation.schema, MOLECULAR_TARGET_SOURCE_RECONCILIATION_SCHEMA);
  assert.equal(packetAfterExecution.upward.aggregateState.molecularConservativeSourceBuffer.schema, MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA);
  assert.equal(packetAfterExecution.upward.closures.molecularTargetSourceIntakeActiveTargetCount, 2);
  assert.equal(packetAfterExecution.upward.closures.molecularTargetSourceIntakeAppliedOperationCount, execution.operationCount);
  assert.ok(Number.isFinite(packetAfterExecution.upward.closures.molecularTargetSourceResponsePendingTargetCount));
  assert.ok(Number.isFinite(packetAfterExecution.upward.closures.molecularTargetSourceReconciliationPendingTargetCount));
  assert.equal(packetAfterExecution.upward.closures.molecularConservativeSourceBufferDispatchableTargetCount, 2);
  assert.equal(packetAfterExecution.upward.closures.molecularConservativeSourceBufferStrideFloats, 8);
  const reactiveExecutionIntake = model.getMolecularTargetSourceIntakeFor('reactive-thermal-cell');
  const sphExecutionIntake = model.getMolecularTargetSourceIntakeFor('sph-material');
  const reactiveExecutionSourceBuffer = model.getMolecularConservativeSourceBufferFor('reactive-thermal-cell');
  const sphExecutionSourceBuffer = model.getMolecularConservativeSourceBufferFor('sph-material');
  assert.equal(reactiveExecutionIntake.schema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.equal(sphExecutionIntake.schema, MOLECULAR_TARGET_SOURCE_INTAKE_SCHEMA);
  assert.equal(reactiveExecutionSourceBuffer.schema, MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA);
  assert.equal(sphExecutionSourceBuffer.schema, MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA);
  assert.equal(reactiveExecutionIntake.active, true);
  assert.equal(sphExecutionIntake.active, true);
  assert.equal(reactiveExecutionSourceBuffer.active, true);
  assert.equal(sphExecutionSourceBuffer.active, true);
  assert.ok(reactiveExecutionIntake.thermalDrive > 0);
  assert.ok(sphExecutionIntake.thermalDrive > 0);
  assert.ok(reactiveExecutionSourceBuffer.thermalDrive > 0);
  assert.ok(sphExecutionSourceBuffer.thermalDrive > 0);
  assert.equal(packet.upward.aggregateState.molecularSourceSinkBalance.schema, MOLECULAR_SOURCE_SINK_BALANCE_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularSourceSinkBalance.activeTargetCount, 2);
  assert.equal(packet.upward.aggregateState.molecularSourceSinkBalance.sourceDriveCoverage, 1);
  assert.ok(packet.upward.aggregateState.molecularSourceSinkBalance.balanceResidualProxy > 0);
  assert.equal(packet.upward.aggregateState.molecularSourceEquation.schema, MOLECULAR_SOURCE_EQUATION_SCHEMA);
  assert.ok(['balanced-proxy', 'tracked'].includes(packet.upward.aggregateState.molecularSourceEquation.sourceBalanceStatus));
  assert.ok(Number.isFinite(packet.upward.aggregateState.molecularSourceEquation.sourceRateWProxy));
  assert.ok(Number.isFinite(packet.upward.aggregateState.molecularSourceEquation.phaseEnergyRateWProxy));
  assert.ok(Number.isFinite(packet.upward.closures.molecularPhaseEosFreeEnergyProxy));
  assert.ok(Number.isFinite(packet.upward.closures.reactiveMolecularPhaseEosEnergyRateProxy));
  assert.ok(Number.isFinite(packet.upward.closures.sphMolecularPhaseEosEnergyRateProxy));
  assert.equal(packet.upward.aggregateState.molecularSourceTransfer.schema, MOLECULAR_CONSERVATIVE_TRANSFER_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularSourceTransfer.dryRun, true);
  assert.equal(packet.upward.aggregateState.molecularSourceTransfer.allocationCount, 2);
  assert.ok(Number.isFinite(packet.upward.aggregateState.molecularSourceTransfer.closedSystemResidualProxy));
  assert.equal(packet.upward.aggregateState.molecularSourceTransferApplication.schema, MOLECULAR_TRANSFER_APPLICATION_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularSourceTransferApplication.canApply, false);
  assert.equal(packet.upward.aggregateState.molecularSourceTransferApplication.blockedTargetCount, 2);
  assert.equal(packet.upward.aggregateState.molecularSourceTransferTransaction.schema, MOLECULAR_TRANSFER_TRANSACTION_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularSourceTransferTransaction.allowed, false);
  assert.equal(packet.upward.aggregateState.molecularSourceTransferTransaction.blockedTargetCount, 2);
  assert.equal(packet.upward.aggregateState.molecularSourceTransferTargetPreview.schema, MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularSourceTransferTargetPreview.previewTargetCount, 2);
  assert.ok(packet.upward.aggregateState.molecularSourceTransferTargetPreview.maxAbsTemperatureDeltaKProxy > 0);
  assert.equal(packet.upward.aggregateState.molecularTargetMutatorRegistry.schema, MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularTargetMutatorRegistry.registeredMutatorCount, 2);
  assert.equal(packet.upward.aggregateState.molecularTargetMutatorRegistry.validatedMutatorCount, 0);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationPreflight.schema, MOLECULAR_TARGET_MUTATION_PREFLIGHT_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationPreflight.targetCount, 2);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationPreflight.passedTargetCount, 0);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationOperationPlan.schema, MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA);
  assert.ok(packet.upward.aggregateState.molecularTargetMutationOperationPlan.operationCount >= 10);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationInvariantCheck.schema, MOLECULAR_TARGET_MUTATION_INVARIANT_CHECK_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationInvariantCheck.missingInvariantScopeCount, 0);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationInvariantCheck.residualBudgetPassCount, 2);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationCommit.schema, MOLECULAR_TARGET_MUTATION_COMMIT_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationCommit.invariantEligibleTargetCount, 2);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationCommit.committableTargetCount, 0);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationDispatch.schema, MOLECULAR_TARGET_MUTATION_DISPATCH_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationDispatch.invariantEligibleBatchCount, 2);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationDispatch.dispatchableBatchCount, 0);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationApplyValidation.schema, MOLECULAR_TARGET_MUTATION_APPLY_VALIDATION_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationApplyValidation.validatedTargetCount, 2);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationApplyValidation.applyReadyTargetCount, 0);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationApplyExecution.schema, MOLECULAR_TARGET_MUTATION_APPLY_EXECUTION_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationApplyExecution.appliedTargetCount, 0);
  assert.equal(packet.upward.aggregateState.molecularTargetMutationApplyExecution.appliedOperationCount, 0);
  assert.equal(packet.upward.closures.molecularTargetMutationDispatchBatchCount, 2);
  assert.equal(packet.upward.closures.molecularTargetMutationDispatchEligibleCount, 2);
  assert.equal(packet.upward.closures.molecularTargetMutationDispatchDispatchableCount, 0);
  assert.equal(packet.upward.closures.molecularTargetMutationDispatchBlockedCount, 2);
  assert.ok(packet.upward.closures.molecularTargetMutationDispatchOperationCount >= 10);
  assert.equal(packet.upward.closures.molecularTargetMutationDispatchDispatchedOperationCount, 0);
  assert.ok(packet.upward.closures.molecularTargetMutationDispatchBlockerCount >= 1);
  assert.equal(packet.upward.closures.molecularTargetMutationApplyValidationTargetCount, 2);
  assert.equal(packet.upward.closures.molecularTargetMutationApplyValidationValidatedCount, 2);
  assert.equal(packet.upward.closures.molecularTargetMutationApplyValidationReadyCount, 0);
  assert.equal(packet.upward.closures.molecularTargetMutationApplyValidationBlockedCount, 2);
  assert.ok(packet.upward.closures.molecularTargetMutationApplyValidationOperationCount >= 10);
  assert.equal(packet.upward.closures.molecularTargetMutationApplyValidationAppliedOperationCount, 0);
  assert.ok(packet.upward.closures.molecularTargetMutationApplyValidationResidual <= 1e-9);
  assert.ok(packet.upward.closures.molecularTargetMutationApplyValidationBlockerCount >= 1);
  assert.equal(packet.upward.closures.molecularTargetMutationApplyExecutionTargetCount, 2);
  assert.equal(packet.upward.closures.molecularTargetMutationApplyExecutionAppliedTargetCount, 0);
  assert.ok(packet.upward.closures.molecularTargetMutationApplyExecutionOperationCount >= 10);
  assert.equal(packet.upward.closures.molecularTargetMutationApplyExecutionAppliedOperationCount, 0);
  assert.ok(packet.upward.closures.molecularTargetMutationApplyExecutionResidual <= 1e-9);
  assert.ok(packet.upward.closures.molecularTargetMutationApplyExecutionBlockerCount >= 1);
  assert.ok(Number.isFinite(packet.upward.closures.molecularSourceEquationTemperatureRateKps));
  assert.equal(packet.upward.closures.molecularSourceTransferApplicationCanApply, 0);
  assert.equal(packet.upward.closures.molecularSourceTransferApplicationBlockedCount, 2);
  assert.equal(packet.upward.closures.molecularSourceTransferApplicationReadyCount, 0);
  assert.ok(packet.upward.closures.molecularSourceTransferApplicationBlockerCount >= 1);
  assert.equal(packet.upward.closures.molecularSourceTransferTransactionAllowed, 0);
  assert.equal(packet.upward.closures.molecularSourceTransferTransactionAppliedCount, 0);
  assert.equal(packet.upward.closures.molecularSourceTransferTransactionBlockedCount, 2);
  assert.ok(packet.upward.closures.molecularSourceTransferTransactionBlockerCount >= 1);
  assert.equal(packet.upward.closures.molecularSourceTransferTargetPreviewCount, 2);
  assert.equal(packet.upward.closures.molecularSourceTransferTargetPreviewAppliedCount, 0);
  assert.equal(packet.upward.closures.molecularSourceTransferTargetPreviewBlockedCount, 2);
  assert.ok(packet.upward.closures.molecularSourceTransferTargetPreviewBlockerCount >= 1);
  assert.ok(packet.upward.closures.molecularSourceTransferTargetPreviewMaxDeltaK > 0);
  assert.equal(packet.upward.closures.molecularTargetMutatorRegistryCount, 2);
  assert.equal(packet.upward.closures.molecularTargetMutatorRegistryRegisteredCount, 2);
  assert.equal(packet.upward.closures.molecularTargetMutatorRegistryValidatedCount, 0);
  assert.equal(packet.upward.closures.molecularTargetMutatorRegistryBlockedCount, 2);
  assert.ok(packet.upward.closures.molecularTargetMutatorRegistryBlockerCount >= 1);
  assert.ok(packet.upward.closures.molecularTargetMutatorRegistryDeclaredFieldCount >= 10);
  assert.equal(packet.upward.closures.molecularTargetMutationPreflightCount, 2);
  assert.equal(packet.upward.closures.molecularTargetMutationPreflightPassedCount, 0);
  assert.equal(packet.upward.closures.molecularTargetMutationPreflightBlockedCount, 2);
  assert.ok(packet.upward.closures.molecularTargetMutationPreflightBlockerCount >= 1);
  assert.ok(Number.isFinite(packet.upward.closures.molecularTargetMutationPreflightMaxResidualRisk));
  assert.ok(packet.upward.closures.molecularTargetMutationOperationPlanCount >= 10);
  assert.equal(packet.upward.closures.molecularTargetMutationOperationPlanAllowedCount, packet.upward.closures.molecularTargetMutationOperationPlanCount);
  assert.equal(packet.upward.closures.molecularTargetMutationOperationPlanBlockedCount, packet.upward.closures.molecularTargetMutationOperationPlanCount);
  assert.ok(packet.upward.closures.molecularTargetMutationOperationPlanBlockerCount >= 1);
  assert.equal(packet.upward.closures.molecularTargetMutationInvariantCheckCount, 2);
  assert.equal(packet.upward.closures.molecularTargetMutationInvariantCheckPassedCount, 2);
  assert.equal(packet.upward.closures.molecularTargetMutationInvariantCheckMissingScopeCount, 0);
  assert.equal(packet.upward.closures.molecularTargetMutationInvariantCheckResidualPassCount, 2);
  assert.ok(packet.upward.closures.molecularTargetMutationInvariantCheckBlockerCount >= 1);
  assert.ok(Number.isFinite(packet.upward.closures.molecularTargetMutationInvariantCheckMaxResidual));
  assert.equal(packet.upward.closures.molecularTargetMutationCommitCount, 2);
  assert.equal(packet.upward.closures.molecularTargetMutationCommitEligibleCount, 2);
  assert.equal(packet.upward.closures.molecularTargetMutationCommitCommittableCount, 0);
  assert.equal(packet.upward.closures.molecularTargetMutationCommitBlockedCount, 2);
  assert.ok(packet.upward.closures.molecularTargetMutationCommitOperationCount >= 10);
  assert.equal(packet.upward.closures.molecularTargetMutationCommitCommittedOperationCount, 0);
  assert.ok(packet.upward.closures.molecularTargetMutationCommitBlockerCount >= 1);
  assert.ok(packet.upward.closures.reactiveMolecularClosureDrive > 0.5);
  assert.ok(packet.upward.closures.reactiveMolecularClosureHeatFlux > 0);
  assert.equal(packet.upward.closures.reactiveMolecularReactionHeatSourceProxy, 0.42);
  assert.equal(packet.upward.closures.reactiveMolecularReactionSpeciesRateProxy, 12);
  assert.ok(packet.upward.closures.reactiveMolecularReactionSourceDrive > 0.5);
  assert.ok(packet.upward.closures.reactiveMolecularSourceSinkEnergyResidual > 0);
  assert.ok(packet.upward.closures.reactiveMolecularSourceSinkSpeciesResidual > 0);
  assert.ok(packet.upward.closures.sphMolecularClosureDrive > 0.5);
  assert.ok(packet.upward.closures.sphMolecularClosureHeatFlux > 0);
  assert.equal(packet.upward.closures.sphMolecularReactionHeatSourceProxy, 0.42);
  assert.equal(packet.upward.closures.sphMolecularReactionSpeciesRateProxy, 12);
  assert.ok(packet.upward.closures.sphMolecularReactionSourceDrive > 0.5);
  assert.ok(packet.upward.closures.sphMolecularSourceSinkEnergyResidual > 0);
  assert.ok(packet.upward.closures.sphMolecularSourceSinkSpeciesResidual > 0);
  assert.equal(packet.conservation.exchange.molecularClosureReactiveApplied, 1);
  assert.equal(packet.conservation.exchange.molecularClosureSphApplied, 1);
  assert.ok(packet.conservation.exchange.molecularClosureReactiveHeatFluxProxy > 0);
  assert.ok(packet.conservation.exchange.molecularClosureSphRadiativeHeatFluxBoost > 0);
  assert.equal(packet.conservation.exchange.molecularClosureReactiveReactionHeatSourceProxy, 0.42);
  assert.equal(packet.conservation.exchange.molecularClosureSphReactionHeatSourceProxy, 0.42);
  assert.equal(packet.conservation.exchange.molecularClosureReactiveReactionSpeciesRateProxy, 12);
  assert.equal(packet.conservation.exchange.molecularClosureSphReactionSpeciesRateProxy, 12);
  assert.ok(packet.conservation.exchange.molecularClosureReactiveReactionSourceDrive > 0.5);
  assert.ok(packet.conservation.exchange.molecularClosureSphReactionSourceDrive > 0.5);
  assert.equal(packet.conservation.exchange.molecularReactionHeatSourceProxy, 0.42);
  assert.equal(packet.conservation.exchange.molecularReactionSpeciesRateProxy, 12);
  assert.ok(packet.conservation.exchange.molecularReactionSourceDrive > 0.5);
  assert.ok(packet.conservation.exchange.molecularClosureReactiveSourceSinkEnergyResidual > 0);
  assert.ok(packet.conservation.exchange.molecularClosureSphSourceSinkEnergyResidual > 0);
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceSinkEnergyResidual.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceSinkSpeciesResidual.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularReactionHeatSourceProxy.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularReactionSpeciesRateProxy.dimensions, 'T^-1');
  assert.equal(packet.conservation.exchangeMetadata.molecularReactionSourceDrive.unit, '1');
  assert.equal(packet.conservation.exchange.molecularSourceSinkBalanceCoverage, 1);
  assert.ok(packet.conservation.exchange.molecularSourceSinkBalanceResidual > 0);
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceSinkBalanceCoverage.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceSinkBalanceSpeciesResidual.dimensions, 'T^-1');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceEquationHeatRateWProxy.unit, 'W-proxy');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceEquationHeatRateWProxy.dimensions, 'M L^2 T^-3');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceEquationTemperatureRateKps.dimensions, 'Theta T^-1');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceEquationSpeciesRateProxy.dimensions, 'T^-1');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceEquationPhaseEnergyRateWProxy.unit, 'W-proxy');
  assert.equal(packet.conservation.exchangeMetadata.molecularPhaseEosStabilityResidual.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularPhaseEosSpecificFreeEnergyProxy.unit, 'J/kg-proxy');
  assert.ok(Number.isFinite(packet.conservation.exchange.molecularSourceEquationHeatRateWProxy));
  assert.ok(Number.isFinite(packet.conservation.exchange.molecularSourceEquationTemperatureRateKps));
  assert.ok(Number.isFinite(packet.conservation.exchange.molecularSourceEquationSpeciesRateProxy));
  assert.ok(Number.isFinite(packet.conservation.exchange.molecularSourceEquationPhaseEnergyRateWProxy));
  assert.ok(Number.isFinite(packet.conservation.exchange.molecularPhaseEosSpecificFreeEnergyProxy));
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceTransferAllocatedHeatRateWProxy.unit, 'W-proxy');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceTransferAllocatedHeatRateWProxy.dimensions, 'M L^2 T^-3');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceTransferAllocatedSpeciesRateProxy.dimensions, 'T^-1');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceTransferClosedResidualWProxy.unit, 'W-proxy');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceTransferApplicationCanApply.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceTransferApplicationBlockedTargetCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceTransferApplicationClosedResidualWProxy.unit, 'W-proxy');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceTransferTargetPreviewCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceTransferTargetPreviewTotalHeatRateWProxy.unit, 'W-proxy');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceTransferTargetPreviewTotalHeatRateWProxy.dimensions, 'M L^2 T^-3');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceTransferTargetPreviewTotalSpeciesRateProxy.dimensions, 'T^-1');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceTransferTargetPreviewMaxDeltaK.unit, 'K-proxy');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceTransferTargetPreviewMaxDeltaK.dimensions, 'Theta');
  assert.equal(packet.conservation.exchangeMetadata.molecularSourceTransferTargetPreviewMaxPhaseDrive.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutatorRegistryTargetCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutatorRegistryRegisteredCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutatorRegistryValidatedCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutatorRegistryDeclaredFieldCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationPreflightTargetCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationPreflightMaxResidualRisk.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationPreflightMaxDeltaK.unit, 'K-proxy');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationPreflightMaxDeltaK.dimensions, 'Theta');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationOperationPlanOperationCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationOperationPlanMaxDelta.unit, 'mixed-proxy');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationOperationPlanMaxDeltaK.unit, 'K-proxy');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationInvariantCheckTargetCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationInvariantCheckCoveredScopeCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationInvariantCheckMaxResidual.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationCommitTargetCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationCommitEligibleCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationCommitBlockerCount.unit, '1');
  assert.equal(packet.conservation.exchange.molecularSourceTransferAllocationCount, 2);
  assert.ok(Number.isFinite(packet.conservation.exchange.molecularSourceTransferAllocationFractionTotal));
  assert.ok(Number.isFinite(packet.conservation.exchange.molecularSourceTransferAllocatedHeatRateWProxy));
  assert.ok(Number.isFinite(packet.conservation.exchange.molecularSourceTransferClosedResidualWProxy));
  assert.equal(packet.conservation.exchange.molecularSourceTransferApplicationCanApply, 0);
  assert.equal(packet.conservation.exchange.molecularSourceTransferApplicationBlockedTargetCount, 2);
  assert.equal(packet.conservation.exchange.molecularSourceTransferApplicationAppliedTargetCount, 0);
  assert.ok(packet.conservation.exchange.molecularSourceTransferApplicationBlockerCount >= 1);
  assert.equal(packet.conservation.exchange.molecularSourceTransferTargetPreviewCount, 2);
  assert.equal(packet.conservation.exchange.molecularSourceTransferTargetPreviewBlockedTargetCount, 2);
  assert.equal(packet.conservation.exchange.molecularSourceTransferTargetPreviewAppliedTargetCount, 0);
  assert.ok(packet.conservation.exchange.molecularSourceTransferTargetPreviewBlockerCount >= 1);
  assert.ok(Number.isFinite(packet.conservation.exchange.molecularSourceTransferTargetPreviewTotalHeatRateWProxy));
  assert.ok(Number.isFinite(packet.conservation.exchange.molecularSourceTransferTargetPreviewTotalSpeciesRateProxy));
  assert.ok(packet.conservation.exchange.molecularSourceTransferTargetPreviewMaxDeltaK > 0);
  assert.ok(packet.conservation.exchange.molecularSourceTransferTargetPreviewMaxPhaseDrive > 0);
  assert.equal(packet.conservation.exchange.molecularTargetMutatorRegistryTargetCount, 2);
  assert.equal(packet.conservation.exchange.molecularTargetMutatorRegistryRegisteredCount, 2);
  assert.equal(packet.conservation.exchange.molecularTargetMutatorRegistryValidatedCount, 0);
  assert.equal(packet.conservation.exchange.molecularTargetMutatorRegistryBlockedCount, 2);
  assert.ok(packet.conservation.exchange.molecularTargetMutatorRegistryDeclaredFieldCount >= 10);
  assert.ok(packet.conservation.exchange.molecularTargetMutatorRegistryInvariantScopeCount >= 3);
  assert.ok(packet.conservation.exchange.molecularTargetMutatorRegistryBlockerCount >= 1);
  assert.equal(packet.conservation.exchange.molecularTargetMutationPreflightTargetCount, 2);
  assert.equal(packet.conservation.exchange.molecularTargetMutationPreflightPassedCount, 0);
  assert.equal(packet.conservation.exchange.molecularTargetMutationPreflightBlockedCount, 2);
  assert.ok(packet.conservation.exchange.molecularTargetMutationPreflightBlockerCount >= 1);
  assert.ok(Number.isFinite(packet.conservation.exchange.molecularTargetMutationPreflightMaxResidualRisk));
  assert.equal(packet.conservation.exchange.molecularTargetMutationOperationPlanTargetCount, 2);
  assert.ok(packet.conservation.exchange.molecularTargetMutationOperationPlanOperationCount >= 10);
  assert.equal(packet.conservation.exchange.molecularTargetMutationOperationPlanAllowedCount, packet.conservation.exchange.molecularTargetMutationOperationPlanOperationCount);
  assert.equal(packet.conservation.exchange.molecularTargetMutationOperationPlanBlockedCount, packet.conservation.exchange.molecularTargetMutationOperationPlanOperationCount);
  assert.ok(packet.conservation.exchange.molecularTargetMutationOperationPlanBlockerCount >= 1);
  assert.ok(Number.isFinite(packet.conservation.exchange.molecularTargetMutationOperationPlanMaxDelta));
  assert.equal(packet.conservation.exchange.molecularTargetMutationInvariantCheckTargetCount, 2);
  assert.equal(packet.conservation.exchange.molecularTargetMutationInvariantCheckPassedCount, 2);
  assert.equal(packet.conservation.exchange.molecularTargetMutationInvariantCheckBlockedCount, 2);
  assert.equal(packet.conservation.exchange.molecularTargetMutationInvariantCheckMissingScopeCount, 0);
  assert.equal(packet.conservation.exchange.molecularTargetMutationInvariantCheckResidualPassCount, 2);
  assert.ok(packet.conservation.exchange.molecularTargetMutationInvariantCheckBlockerCount >= 1);
  assert.ok(Number.isFinite(packet.conservation.exchange.molecularTargetMutationInvariantCheckMaxResidual));
  assert.equal(packet.conservation.exchange.molecularTargetMutationCommitTargetCount, 2);
  assert.equal(packet.conservation.exchange.molecularTargetMutationCommitEligibleCount, 2);
  assert.equal(packet.conservation.exchange.molecularTargetMutationCommitCommittableCount, 0);
  assert.equal(packet.conservation.exchange.molecularTargetMutationCommitBlockedCount, 2);
  assert.ok(packet.conservation.exchange.molecularTargetMutationCommitOperationCount >= 10);
  assert.equal(packet.conservation.exchange.molecularTargetMutationCommitCommittedOperationCount, 0);
  assert.ok(packet.conservation.exchange.molecularTargetMutationCommitBlockerCount >= 1);
  assert.equal(packet.conservation.exchange.molecularTargetMutationDispatchBatchCount, 2);
  assert.equal(packet.conservation.exchange.molecularTargetMutationDispatchEligibleCount, 2);
  assert.equal(packet.conservation.exchange.molecularTargetMutationDispatchDispatchableCount, 0);
  assert.equal(packet.conservation.exchange.molecularTargetMutationDispatchBlockedCount, 2);
  assert.ok(packet.conservation.exchange.molecularTargetMutationDispatchOperationCount >= 10);
  assert.equal(packet.conservation.exchange.molecularTargetMutationDispatchDispatchedOperationCount, 0);
  assert.ok(packet.conservation.exchange.molecularTargetMutationDispatchBlockerCount >= 1);
  assert.equal(packet.conservation.exchange.molecularTargetMutationApplyValidationTargetCount, 2);
  assert.equal(packet.conservation.exchange.molecularTargetMutationApplyValidationValidatedCount, 2);
  assert.equal(packet.conservation.exchange.molecularTargetMutationApplyValidationReadyCount, 0);
  assert.equal(packet.conservation.exchange.molecularTargetMutationApplyValidationBlockedCount, 2);
  assert.ok(packet.conservation.exchange.molecularTargetMutationApplyValidationOperationCount >= 10);
  assert.equal(packet.conservation.exchange.molecularTargetMutationApplyValidationAppliedOperationCount, 0);
  assert.ok(packet.conservation.exchange.molecularTargetMutationApplyValidationStateWriteSetCount >= 10);
  assert.ok(packet.conservation.exchange.molecularTargetMutationApplyValidationMaxResidual <= 1e-9);
  assert.ok(packet.conservation.exchange.molecularTargetMutationApplyValidationBlockerCount >= 1);
  assert.equal(packet.conservation.exchange.molecularTargetMutationApplyExecutionTargetCount, 2);
  assert.equal(packet.conservation.exchange.molecularTargetMutationApplyExecutionAppliedTargetCount, 0);
  assert.ok(packet.conservation.exchange.molecularTargetMutationApplyExecutionOperationCount >= 10);
  assert.equal(packet.conservation.exchange.molecularTargetMutationApplyExecutionAppliedOperationCount, 0);
  assert.equal(packet.conservation.exchange.molecularTargetMutationApplyExecutionStateWriteSetCount, 0);
  assert.ok(packet.conservation.exchange.molecularTargetMutationApplyExecutionMaxResidual <= 1e-9);
  assert.ok(packet.conservation.exchange.molecularTargetMutationApplyExecutionBlockerCount >= 1);
  assert.ok(packet.conservation.trackedCouplings.includes('molecular-dynamics closure -> reactive/SPH thermal source -> material heat telemetry'));
  assert.ok(packet.conservation.trackedCouplings.includes('molecular source/sink balance -> event-derived chemistry coverage/residual telemetry'));
  assert.ok(packet.conservation.trackedCouplings.includes('molecular source equation -> unit-aware heat/species transfer scaffold'));
  assert.ok(packet.conservation.trackedCouplings.includes('molecular conservative transfer dry-run -> reactive/SPH allocation telemetry'));
  assert.ok(packet.conservation.trackedCouplings.includes('molecular transfer application gate -> blocked/ready/applied mutation guard telemetry'));
  assert.ok(packet.conservation.trackedCouplings.includes('molecular target-mutator preview -> reactive/SPH dry-run target delta telemetry'));
  assert.ok(packet.conservation.trackedCouplings.includes('molecular target-mutator registry -> allowed-field/invariant mutation gate telemetry'));
  assert.ok(packet.conservation.trackedCouplings.includes('molecular target-mutation preflight -> residual/blocker readiness telemetry'));
  assert.ok(packet.conservation.trackedCouplings.includes('molecular target-mutation operation plan -> field-level before/after delta telemetry'));
  assert.ok(packet.conservation.trackedCouplings.includes('molecular target-mutation invariant check -> operation-plan invariant coverage and residual telemetry'));
  assert.ok(packet.conservation.trackedCouplings.includes('molecular target-mutation dispatch -> commit-gated target operation batch telemetry'));
  assert.ok(packet.conservation.trackedCouplings.includes('molecular target-mutation apply validation -> before/after write-set residual telemetry'));
  assert.ok(packet.conservation.trackedCouplings.includes('molecular target-mutation apply execution -> explicit reduced target state write telemetry'));
  assert.equal(packet.conservation.exchangeMetadata.molecularClosureReactiveHeatFluxProxy.unit, 'W/m^2-proxy');
  assert.equal(packet.conservation.exchangeMetadata.molecularClosureSphHeatFluxProxy.unit, 'W/m^2-proxy');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationDispatchBatchCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationApplyValidationTargetCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationApplyValidationMaxResidual.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationApplyExecutionTargetCount.unit, '1');
  assert.equal(packet.conservation.exchangeMetadata.molecularTargetMutationApplyExecutionMaxResidual.unit, '1');
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.status, 'active');
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')?.status, 'active');
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.sourceSink.schema, MOLECULAR_SOURCE_SINK_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.sourceSink.phaseEosSchema, MOLECULAR_PHASE_EOS_BASIS_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.sourceSinkBalance.schema, MOLECULAR_SOURCE_SINK_BALANCE_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.sourceEquation.schema, MOLECULAR_SOURCE_EQUATION_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.sourceTransfer.schema, MOLECULAR_CONSERVATIVE_TRANSFER_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.sourceTransferApplication.schema, MOLECULAR_TRANSFER_APPLICATION_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.sourceTransferTargetPreview.schema, MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.sourceTransferTargetPreviewSummary.schema, MOLECULAR_TARGET_MUTATOR_PREVIEW_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutatorRegistry.schema, MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutatorRegistrySummary.schema, MOLECULAR_TARGET_MUTATOR_REGISTRY_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutationPreflight.schema, MOLECULAR_TARGET_MUTATION_PREFLIGHT_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutationPreflightSummary.schema, MOLECULAR_TARGET_MUTATION_PREFLIGHT_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutationOperationPlan.schema, MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutationOperationPlanSummary.schema, MOLECULAR_TARGET_MUTATION_OPERATION_PLAN_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutationInvariantCheck.schema, MOLECULAR_TARGET_MUTATION_INVARIANT_CHECK_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutationInvariantCheckSummary.schema, MOLECULAR_TARGET_MUTATION_INVARIANT_CHECK_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutationCommit.schema, MOLECULAR_TARGET_MUTATION_COMMIT_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutationCommitSummary.schema, MOLECULAR_TARGET_MUTATION_COMMIT_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutationDispatch.schema, MOLECULAR_TARGET_MUTATION_DISPATCH_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutationDispatchSummary.schema, MOLECULAR_TARGET_MUTATION_DISPATCH_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutationApplyValidation.schema, MOLECULAR_TARGET_MUTATION_APPLY_VALIDATION_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutationApplyValidationSummary.schema, MOLECULAR_TARGET_MUTATION_APPLY_VALIDATION_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutationApplyExecution.schema, MOLECULAR_TARGET_MUTATION_APPLY_EXECUTION_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.targetMutationApplyExecutionSummary.schema, MOLECULAR_TARGET_MUTATION_APPLY_EXECUTION_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-heat-to-reactive-thermal')?.adapterContext.sourceTransferTargetPreview.previewTargetCount, 2);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-heat-to-reactive-thermal')?.adapterContext.targetMutatorRegistry.registeredMutatorCount, 2);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-heat-to-reactive-thermal')?.adapterContext.sourceTransferApplication.canApply, false);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')?.adapterContext.sourceSinkBalance.coverage.activeTargetCount, 2);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')?.adapterContext.sourceSink.phaseEosSchema, MOLECULAR_PHASE_EOS_BASIS_SCHEMA);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')?.adapterContext.sourceEquation.terms.energy.unit, 'W-proxy');
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')?.adapterContext.sourceTransfer.allocations.length, 2);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')?.adapterContext.sourceTransferApplication.blockedTargetCount, 2);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')?.adapterContext.sourceTransferTargetPreview.blockedTargetCount, 2);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')?.adapterContext.targetMutatorRegistry.validatedMutatorCount, 0);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')?.adapterContext.targetMutationDispatch.batchCount, 2);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')?.adapterContext.targetMutationApplyValidation.validatedTargetCount, 2);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-reactive-source')?.adapterContext.reactionHeatSourceProxy, 0.42);
  assert.equal(packet.coupling.links.find((link) => link.id === 'molecular-closure-to-sph-material-source')?.adapterContext.reactionSpeciesRateProxy, 12);
  assert.equal(packet.coupling.exchange.molecularReactionHeatSourceProxy, 0.42);
  assert.equal(packet.coupling.exchange.molecularReactionSpeciesRateProxy, 12);
  assert.ok(packet.coupling.exchange.molecularReactionSourceDrive > 0.5);
  assert.equal(packet.coupling.exchange.molecularSourceSinkBalanceCoverage, 1);
  assert.ok(packet.coupling.exchange.molecularSourceSinkBalanceResidual > 0);
  assert.ok(Number.isFinite(packet.coupling.exchange.molecularSourceEquationHeatRateWProxy));
  assert.ok(Number.isFinite(packet.coupling.exchange.molecularSourceEquationTemperatureRateKps));
  assert.ok(Number.isFinite(packet.coupling.exchange.molecularSourceEquationSpeciesRateProxy));
  assert.ok(Number.isFinite(packet.coupling.exchange.molecularSourceEquationPhaseEnergyRateWProxy));
  assert.ok(Number.isFinite(packet.coupling.exchange.molecularPhaseEosStabilityResidual));
  assert.ok(Number.isFinite(packet.coupling.exchange.molecularPhaseEosSpecificFreeEnergyProxy));
  assert.equal(packet.coupling.exchange.molecularSourceTransferAllocationCount, 2);
  assert.ok(Number.isFinite(packet.coupling.exchange.molecularSourceTransferAllocatedHeatRateWProxy));
  assert.ok(Number.isFinite(packet.coupling.exchange.molecularSourceTransferClosedResidualWProxy));
  assert.equal(packet.coupling.exchange.molecularSourceTransferApplicationCanApply, 0);
  assert.equal(packet.coupling.exchange.molecularSourceTransferApplicationBlockedTargetCount, 2);
  assert.equal(packet.coupling.exchange.molecularSourceTransferApplicationAppliedTargetCount, 0);
  assert.ok(packet.coupling.exchange.molecularSourceTransferApplicationBlockerCount >= 1);
  assert.equal(packet.coupling.exchange.molecularSourceTransferTargetPreviewCount, 2);
  assert.equal(packet.coupling.exchange.molecularSourceTransferTargetPreviewBlockedTargetCount, 2);
  assert.equal(packet.coupling.exchange.molecularSourceTransferTargetPreviewAppliedTargetCount, 0);
  assert.ok(packet.coupling.exchange.molecularSourceTransferTargetPreviewBlockerCount >= 1);
  assert.ok(packet.coupling.exchange.molecularSourceTransferTargetPreviewMaxDeltaK > 0);
  assert.ok(packet.coupling.exchange.molecularSourceTransferTargetPreviewMaxPhaseDrive > 0);
  assert.equal(packet.coupling.exchange.molecularTargetMutatorRegistryTargetCount, 2);
  assert.equal(packet.coupling.exchange.molecularTargetMutatorRegistryRegisteredCount, 2);
  assert.equal(packet.coupling.exchange.molecularTargetMutatorRegistryValidatedCount, 0);
  assert.equal(packet.coupling.exchange.molecularTargetMutatorRegistryBlockedCount, 2);
  assert.ok(packet.coupling.exchange.molecularTargetMutatorRegistryDeclaredFieldCount >= 10);
  assert.ok(packet.coupling.exchange.molecularTargetMutatorRegistryInvariantScopeCount >= 3);
  assert.ok(packet.coupling.exchange.molecularTargetMutatorRegistryBlockerCount >= 1);
  assert.equal(packet.coupling.exchange.molecularTargetMutationPreflightTargetCount, 2);
  assert.equal(packet.coupling.exchange.molecularTargetMutationPreflightPassedCount, 0);
  assert.equal(packet.coupling.exchange.molecularTargetMutationPreflightBlockedCount, 2);
  assert.ok(packet.coupling.exchange.molecularTargetMutationPreflightBlockerCount >= 1);
  assert.ok(Number.isFinite(packet.coupling.exchange.molecularTargetMutationPreflightMaxResidualRisk));
  assert.equal(packet.coupling.exchange.molecularTargetMutationOperationPlanTargetCount, 2);
  assert.ok(packet.coupling.exchange.molecularTargetMutationOperationPlanOperationCount >= 10);
  assert.equal(packet.coupling.exchange.molecularTargetMutationOperationPlanAllowedCount, packet.coupling.exchange.molecularTargetMutationOperationPlanOperationCount);
  assert.equal(packet.coupling.exchange.molecularTargetMutationOperationPlanBlockedCount, packet.coupling.exchange.molecularTargetMutationOperationPlanOperationCount);
  assert.ok(Number.isFinite(packet.coupling.exchange.molecularTargetMutationOperationPlanMaxDelta));
  assert.equal(packet.coupling.exchange.molecularTargetMutationInvariantCheckTargetCount, 2);
  assert.equal(packet.coupling.exchange.molecularTargetMutationInvariantCheckPassedCount, 2);
  assert.equal(packet.coupling.exchange.molecularTargetMutationInvariantCheckBlockedCount, 2);
  assert.equal(packet.coupling.exchange.molecularTargetMutationInvariantCheckMissingScopeCount, 0);
  assert.equal(packet.coupling.exchange.molecularTargetMutationInvariantCheckResidualPassCount, 2);
  assert.ok(Number.isFinite(packet.coupling.exchange.molecularTargetMutationInvariantCheckMaxResidual));
  assert.equal(packet.coupling.exchange.molecularTargetMutationCommitTargetCount, 2);
  assert.equal(packet.coupling.exchange.molecularTargetMutationCommitEligibleCount, 2);
  assert.equal(packet.coupling.exchange.molecularTargetMutationCommitCommittableCount, 0);
  assert.equal(packet.coupling.exchange.molecularTargetMutationCommitBlockedCount, 2);
  assert.ok(packet.coupling.exchange.molecularTargetMutationCommitOperationCount >= 10);
  assert.equal(packet.coupling.exchange.molecularTargetMutationCommitCommittedOperationCount, 0);
  assert.equal(packet.coupling.exchange.molecularTargetMutationApplyValidationTargetCount, 2);
  assert.equal(packet.coupling.exchange.molecularTargetMutationApplyValidationValidatedCount, 2);
  assert.equal(packet.coupling.exchange.molecularTargetMutationApplyValidationReadyCount, 0);
  assert.ok(packet.coupling.exchange.molecularTargetMutationApplyValidationOperationCount >= 10);
  assert.equal(packet.coupling.exchange.molecularTargetMutationApplyValidationAppliedOperationCount, 0);
  assert.ok(packet.coupling.exchange.molecularTargetMutationApplyValidationMaxResidual <= 1e-9);
  assert.equal(packet.coupling.exchange.molecularTargetMutationApplyExecutionTargetCount, 2);
  assert.equal(packet.coupling.exchange.molecularTargetMutationApplyExecutionAppliedTargetCount, 0);
  assert.ok(packet.coupling.exchange.molecularTargetMutationApplyExecutionOperationCount >= 10);
  assert.equal(packet.coupling.exchange.molecularTargetMutationApplyExecutionAppliedOperationCount, 0);
  assert.ok(packet.coupling.exchange.molecularTargetMutationApplyExecutionMaxResidual <= 1e-9);
  assert.equal(packet.coupling.exchange.molecularSourceSinkEnergyResidual > 0, true);
});

test('qmat-only molecular source warms source-buffer targets without target reports', () => {
  const model = new MultiscaleModel();
  model.state.surface.reactiveCell.molecularSourceSink = null;
  model.state.mpm.sphMaterial.molecularSourceSink = null;
  model.state.molecular.molecularDynamics = {
    ...model.state.molecular.molecularDynamics,
    atomCount: 15,
    species: { H: 10, O: 5 },
    temperatureK: 294,
    quantumMaterialSourceApplied: true,
    quantumMaterialSourceBehaviorDrive: 0.05,
    quantumMaterialSourceTemperatureDeltaK: 0.12,
    quantumMaterialSourceElectricalConductivitySpm: 0.02,
    quantumMaterialSourceDielectricConstant: 1.12,
    quantumMaterialSourceRefractiveIndex: 1.04,
    quantumMaterialSourceMechanicalResponsePa: 92000,
    quantumMaterialSourceBulkModulusPa: 92000,
    quantumMaterialSourceOpticalAbsorptionDrive: 0.08,
    quantumMaterialSourceMechanicalStiffnessDrive: 0.42,
    quantumMaterialSourceStatisticalSourceChannelCount: 5,
    quantumMaterialSourceStatisticalPressureDriveProxy: 0.0000012,
    quantumMaterialSourceStatisticalOpacityDriveProxy: 0.0000009,
    quantumMaterialSourceStatisticalIonizationDriveProxy: 0.00000006,
    quantumMaterialSourceStatisticalDegeneracyPressureDriveProxy: 0.0000007,
    quantumMaterialSourceStatisticalTemperatureDeltaKProxy: 0.00003,
    quantumMaterialSourceStatisticalChargeDeltaProxy: 0.00000001,
    quantumMaterialSourceStatisticalThermalDampingScale: 0.9999998,
    quantumMaterialSourceResponseDerivativeApplied: true,
    quantumMaterialSourceDensityTemperatureDerivativeKgM3PerK: -0.000016,
    quantumMaterialSourceMechanicalPressureDerivativePaPerLog2Pressure: 3226,
    quantumMaterialSourceConductivityFieldDerivativeSpmPerNorm: 0.001,
    quantumMaterialSourceOpacityRadiationDerivativePerNorm: 0.04,
    quantumMaterialSourceResponseDerivativeTemperatureDrive: 0.004,
    quantumMaterialSourceResponseDerivativePressureDrive: 0.03,
    quantumMaterialSourceResponseDerivativeFieldDrive: 0.002,
    quantumMaterialSourceResponseDerivativeRadiationDrive: 0.06,
    quantumMaterialSource: {
      schema: 'peercompute.multiscale.molecular-quantum-material-source.v0',
      active: true,
      applied: true,
      backend: 'webgpu-quantum-material-property-batch',
      recordCount: 192,
      propertyResponse: {
        schema: QUANTUM_MATERIAL_PROPERTY_RESPONSE_SCHEMA,
        backend: 'webgpu-quantum-material-property-batch',
        calibrated: false,
        recordCount: 192,
        meanMechanicalResponsePa: 92000,
        meanBulkModulusPa: 92000,
        meanElectricalConductivitySpm: 0.02,
        meanRefractiveIndex: 1.04,
        meanDielectricConstant: 1.12,
        meanOpticalAbsorptionProxy: 0.00002
      },
      statisticalSourceEquation: {
        schema: QUANTUM_STATISTICAL_SOURCE_EQUATION_SCHEMA,
        channelCount: 5,
        sourceTerms: {
          temperatureDeltaKProxy: 0.00003,
          chargeDeltaProxy: 0.00000001,
          pressureDriveProxy: 0.0000012,
          opacityDriveProxy: 0.0000009,
          ionizationDriveProxy: 0.00000006,
          degeneracyPressureDriveProxy: 0.0000007,
          thermalDampingScale: 0.9999998
        }
      },
      responseDerivatives: {
        schema: QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA,
        backend: 'webgpu-quantum-material-property-batch',
        calibrated: false,
        recordCount: 192,
        meanDensityTemperatureDerivativeKgM3PerK: -0.000016,
        meanMechanicalPressureDerivativePaPerLog2Pressure: 3226,
        meanConductivityFieldDerivativeSpmPerNorm: 0.001,
        meanOpacityRadiationDerivativePerNorm: 0.04,
        temperatureDrive: 0.004,
        pressureDrive: 0.03,
        fieldDrive: 0.002,
        radiationDrive: 0.06
      }
    }
  };
  model.setMolecularTransferApplicationConfig({
    applicationRequested: true,
    mutationEnabled: true,
    scientificMode: true,
    targetAdaptersValidated: true,
    closedResidualToleranceProxy: 0.5
  });
  model.setMolecularTransferTransactionConfig({
    transactionEnabled: true,
    mutatorId: 'reactive-sph-source-preview-v0'
  });
  model.setMolecularTargetMutationApplyConfig({
    executionRequested: true,
    proxyApplyEnabled: true,
    targetApplyImplemented: true
  });
  const execution = model.executeMolecularTargetMutationApply({ reason: 'qmat-only-source-warm-test' });
  assert.equal(execution.status, 'applied-proxy');
  assert.equal(execution.appliedTargetCount, 2);
  assert.equal(execution.blockerCount, 0);
  const packet = model.createPacket();
  assert.equal(packet.sourceSinkBalance.coverage.activeTargetCount, 2);
  assert.equal(packet.sourceTransfer.allocations.length, 2);
  assert.equal(packet.conservativeSourceBuffer.schema, MOLECULAR_CONSERVATIVE_SOURCE_BUFFER_SCHEMA);
  assert.equal(packet.conservativeSourceBuffer.activeTargetCount, 2);
  assert.equal(packet.conservativeSourceBuffer.dispatchableTargetCount, 2);
  assert.equal(packet.conservativeSourceBuffer.reconciledTargetCount, 2);
  assert.equal(packet.conservativeSourceBuffer.pendingTargetCount, 0);
  assert.equal(packet.conservativeSourceBuffer.bufferStrideFloats, 8);
  assert.equal(packet.conservativeSourceBuffer.quantumMaterialPropertySource.active, true);
  assert.equal(packet.conservativeSourceBuffer.quantumMaterialStatisticalSource.active, true);
  assert.equal(packet.conservativeSourceBuffer.quantumMaterialStatisticalSourceChannelCount, 5);
  assert.equal(packet.conservativeSourceBuffer.quantumMaterialResponseDerivativeSource.active, true);
  assert.equal(packet.conservativeSourceBuffer.quantumMaterialResponseDerivativeSource.schema, QUANTUM_MATERIAL_RESPONSE_DERIVATIVES_SCHEMA);
  assert.equal(packet.sourceTransferTargetSourceResponse.schema, MOLECULAR_TARGET_SOURCE_RESPONSE_SCHEMA);
  assert.equal(packet.sourceTransferTargetSourceResponse.respondedTargetCount, 2);
  assert.equal(packet.sourceTransferTargetSourceResponse.pendingTargetCount, 0);
  assert.equal(packet.sourceTransferTargetSourceResponse.sourceBufferAcknowledgedTargetCount, 2);
  assert.ok(packet.sourceTransferTargetSourceResponse.targets.every((target) => target.responseAcknowledged === true));
  assert.ok(packet.sourceTransferTargetSourceResponse.targets.every((target) => target.responseDriveAcknowledged === true));
  assert.ok(packet.sourceTransferTargetSourceResponse.targets.every((target) => target.quantumMaterialResponseDriveProxy > 0));
  assert.equal(packet.sourceTransferTargetSourceReconciliation.reconciledTargetCount, 2);
  assert.equal(packet.sourceTransferTargetSourceReconciliation.pendingTargetCount, 0);
  assert.equal(packet.sourceTransferTargetSourceReconciliation.residualPassed, true);
  assert.equal(packet.upward.aggregateState.molecularSourceBufferApplication.appliedTargetCount, 2);
  assert.ok(packet.upward.aggregateState.molecularSourceBufferApplication.appliedFieldCount >= 55);
  assert.equal(packet.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialResponseDerivativeActiveTargetCount, 2);
  assert.ok(packet.upward.aggregateState.molecularSourceBufferApplication.quantumMaterialResponseDerivativeTemperatureDrive > 0);
  assert.equal(packet.sourceBufferAcceptance.schema, MOLECULAR_SOURCE_BUFFER_ACCEPTANCE_SCHEMA);
  assert.equal(packet.sourceBufferAcceptance.acceptedTargetCount, 2);
  assert.equal(packet.sourceBufferAcceptance.blockedTargetCount, 0);
  assert.equal(packet.sourceBufferAcceptance.canMutateProxy, true);
  assert.equal(packet.sourceBufferWritebackValidation.schema, MOLECULAR_SOURCE_BUFFER_WRITEBACK_VALIDATION_SCHEMA);
  assert.equal(packet.sourceBufferWritebackValidation.validatedTargetCount, 2);
  assert.equal(packet.sourceBufferWritebackValidation.blockedTargetCount, 0);
  assert.equal(packet.sourceBufferWritebackValidation.canWritebackProxy, true);
  assert.equal(packet.targetBufferReplayValidation.schema, MOLECULAR_TARGET_BUFFER_REPLAY_VALIDATION_SCHEMA);
  assert.equal(packet.targetBufferReplayValidation.replayedTargetCount, 2);
  assert.equal(packet.targetBufferReplayValidation.blockedTargetCount, 0);
  assert.equal(packet.targetBufferReplayValidation.canReplayProxy, true);
  assert.equal(packet.targetBufferWorkerWriteQueue.targetBatchCount, 2);
  assert.equal(packet.targetBufferWorkerWriteQueue.canPlanWorkerWrite, true);
  assert.equal(packet.targetBufferWorkerWriteQueue.queueReadyBatchCount, 2);
  assert.ok(packet.targetBufferWorkerWriteQueue.writeIntentCount >= 55);
  assert.equal(
    packet.targetBufferWorkerWriteQueue.queueReadyWriteIntentCount,
    packet.targetBufferWorkerWriteQueue.writeIntentCount
  );
  model.setMolecularTargetBufferWorkerWriteConfig({
    executionRequested: true,
    proxyWorkerWriteEnabled: true,
    targetWorkerWriteImplemented: true
  });
  const writerExecution = model.executeMolecularTargetBufferWorkerWrite({ reason: 'qmat-only-source-writer-test' });
  assert.equal(writerExecution.schema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_EXECUTION_SCHEMA);
  assert.equal(writerExecution.applied, true);
  assert.equal(writerExecution.appliedBatchCount, 2);
  assert.equal(writerExecution.blockedBatchCount, 0);
  assert.equal(writerExecution.appliedWriteIntentCount, writerExecution.writeIntentCount);
  assert.equal(model.state.molecular.targetBufferWorkerWriteVerification.schema, MOLECULAR_TARGET_BUFFER_WORKER_WRITE_VERIFICATION_SCHEMA);
  assert.equal(model.state.molecular.targetBufferWorkerWriteVerification.verified, true);
  assert.equal(model.state.molecular.targetBufferWorkerWriteVerification.verifiedTargetCount, 2);
});

test('SPH material task advances water particles and updates model packet state', async () => {
  resetSphMaterial();
  const model = new MultiscaleModel();
  const initialState = makeSphMaterialInitialState({
    count: 24,
    seed: 12,
    environment: model.environment
  });
  const before = computeSphMaterialDiagnostics(initialState);
  const result = await stepSphMaterial({
    stateKey: 'sph:model:patch',
    input: {
      stateKey: 'sph:model:patch',
      taskId: 'sph:model:patch',
      state: initialState,
      dt: 1 / 120,
      environment: model.environment,
      coupling: {
        fireIntensity: 0.85,
        flameTemperatureK: 1120,
        membraneIntegrity: 0.8,
        ruptured: false
      },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.value.schema, SPH_MATERIAL_RESULT_SCHEMA);
  assert.equal(result.value.backend, 'cpu-sph-material');
  assert.equal(result.commitDelta.payload.schema, SPH_MATERIAL_DELTA_SCHEMA);
  assert.equal(result.value.diagnostics.count, 24);
  assert.ok(result.value.diagnostics.totalMass > 0);
  assert.ok(Math.abs(result.value.conservation.massDrift) < 1e-9);
  assert.notDeepEqual(result.value.state.positions, initialState.positions);
  assert.ok(result.value.diagnostics.averageTemperatureK >= before.averageTemperatureK - 0.1);

  const sph = model.applySphMaterialResult(result.value);
  const packet = model.createPacket();
  assert.equal(sph.backend, 'cpu-sph-material');
  assert.equal(packet.upward.aggregateState.sphMaterial.backend, 'cpu-sph-material');
  assert.equal(packet.upward.aggregateState.sphMaterial.particleCount, 24);
  assert.equal(typeof packet.upward.closures.sphVaporFraction, 'number');
  assert.equal(typeof packet.upward.closures.sphIceFraction, 'number');
  assert.equal(typeof packet.upward.closures.sphLatentHeatSinkProxy, 'number');
  assert.equal(typeof packet.upward.aggregateState.sphMaterial.phaseChangeRateProxy, 'number');
});

test('SPH material diagnostics classify water phase-change envelope', () => {
  const state = makeSphMaterialInitialState({
    count: 12,
    seed: 311,
    environment: { ambientTemperatureK: 294 }
  });
  for (let i = 0; i < state.masses.length; i += 1) {
    if (i < 4) {
      state.temperatures[i] = 260;
      state.phases[i] = 0;
    } else if (i < 8) {
      state.temperatures[i] = 294;
      state.phases[i] = 0;
    } else {
      state.temperatures[i] = 392;
      state.phases[i] = 0.42;
    }
  }

  const diagnostics = computeSphMaterialDiagnostics({ state });
  const phaseTotal = diagnostics.phaseMix.solid + diagnostics.phaseMix.liquid + diagnostics.phaseMix.vapor;
  assert.ok(diagnostics.iceFraction > 0);
  assert.ok(diagnostics.liquidFraction > 0);
  assert.ok(diagnostics.vaporFraction > 0);
  assert.ok(diagnostics.boilingFraction > 0);
  assert.ok(diagnostics.freezingFraction > 0);
  assert.ok(diagnostics.phaseChangeRateProxy > 0);
  assert.ok(diagnostics.latentHeatSinkProxy > 0);
  assert.ok(diagnostics.latentHeatReleaseProxy >= 0);
  assert.equal(diagnostics.phaseRegime, 'mixed');
  assert.ok(Number.isFinite(diagnostics.meanSpecificEnthalpyProxy));
  assert.ok(Math.abs(phaseTotal - 1) < 1e-9);
});

test('SPH material fire contact feeds surface water suppression state', async () => {
  resetSphMaterial();
  const model = new MultiscaleModel();
  const initialState = makeSphMaterialInitialState({
    count: 12,
    seed: 120,
    environment: model.environment
  });
  for (let i = 0; i < initialState.masses.length; i += 1) {
    const offset = i * 3;
    initialState.positions[offset] = 2.35 + (i % 3) * 0.05;
    initialState.positions[offset + 1] = -0.45 + Math.floor(i / 3) * 0.04;
    initialState.positions[offset + 2] = ((i % 2) - 0.5) * 0.06;
    initialState.velocities[offset] = 0;
    initialState.velocities[offset + 1] = 0;
    initialState.velocities[offset + 2] = 0;
    initialState.temperatures[i] = 300;
    initialState.phases[i] = 0;
  }
  const result = await stepSphMaterial({
    stateKey: 'sph:fire-contact',
    input: {
      stateKey: 'sph:fire-contact',
      state: initialState,
      dt: 1 / 240,
      fireContactRadius: 1.4,
      environment: model.environment,
      coupling: {
        fireIntensity: 0,
        flameTemperatureK: 294,
        membraneIntegrity: 1,
        ruptured: true
      },
      enableWebGPU: false
    }
  });

  assert.ok(result.diagnostics.fireContactFraction > 0.3);
  assert.ok(result.diagnostics.coolingPotential > 0.3);
  const beforeWaterContact = model.state.surface.waterContact;
  model.applySphMaterialResult(result);
  const packet = model.createPacket();
  assert.ok(model.state.surface.waterContact > beforeWaterContact);
  assert.equal(typeof packet.upward.closures.sphFireContactFraction, 'number');
  assert.equal(typeof packet.upward.aggregateState.sphMaterial.coolingPotential, 'number');
  assert.equal(typeof packet.upward.aggregateState.sphMaterial.kineticEnergyDrift, 'number');
});

test('SPH material rupture spill impulse directs released water toward fire', async () => {
  resetSphMaterial();
  const model = new MultiscaleModel();
  const initialState = makeSphMaterialInitialState({
    count: 24,
    seed: 220,
    environment: model.environment
  });
  const baseInput = {
    state: initialState,
    dt: 1 / 60,
    environment: model.environment,
    fireCenter: [2.4, -0.45, 0],
    coupling: {
      fireIntensity: 0,
      flameTemperatureK: 294,
      membraneIntegrity: 0.05,
      ruptured: true,
      ruptureAge: 0
    },
    enableWebGPU: false
  };
  const calm = await stepSphMaterial({
    stateKey: 'sph:spill:calm',
    input: {
      ...baseInput,
      coupling: { ...baseInput.coupling, spillImpulse: 0 }
    }
  });
  const spill = await stepSphMaterial({
    stateKey: 'sph:spill:jet',
    input: {
      ...baseInput,
      coupling: { ...baseInput.coupling, spillImpulse: 1.6 }
    }
  });

  assert.equal(spill.backend, 'cpu-sph-material');
  assert.ok(spill.diagnostics.spillImpulse > calm.diagnostics.spillImpulse);
  assert.ok(spill.diagnostics.momentum[0] > calm.diagnostics.momentum[0] + 0.08);
  assert.ok(spill.diagnostics.centerOfMass[0] > calm.diagnostics.centerOfMass[0]);
  assert.ok(Number.isFinite(spill.diagnostics.centerToFireDistance));
  assert.ok(Number.isFinite(spill.diagnostics.groundContactFraction));

  let streamResult = null;
  for (let i = 0; i < 24; i += 1) {
    streamResult = await stepSphMaterial({
      stateKey: 'sph:spill:stream',
      input: {
        ...baseInput,
        state: i === 0 ? initialState : undefined,
        dt: 1 / 60,
        fireContactRadius: 1.6,
        coupling: {
          ...baseInput.coupling,
          spillImpulse: 1.6,
          ruptureAge: i / 12
        }
      }
    });
  }
  assert.ok(streamResult.diagnostics.fireContactFraction > 0.02);
  assert.ok(streamResult.diagnostics.centerToFireDistance < calm.diagnostics.centerToFireDistance);
});

test('shared closure contract maps molecular, reactive, and SPH solver outputs', async () => {
  resetReactiveThermalCell();
  resetSphMaterial();
  resetMolecularDynamics();
  const model = new MultiscaleModel();
  const molecularTask = await stepMolecularDynamics({
    stateKey: 'closure:molecular',
    input: {
      stateKey: 'closure:molecular',
      state: makeMolecularDynamicsInitialState({
        composition: { O: 4, H: 8 },
        seed: 81,
        environment: model.environment,
        coupling: { fireIntensity: 0.2, reactionProgress: 0.12 }
      }),
      environment: model.environment,
      coupling: { fireIntensity: 0.2, reactionProgress: 0.12 },
      dt: 1 / 90,
      enableWebGPU: false
    }
  });
  const reactiveTask = await stepReactiveThermalCell({
    stateKey: 'closure:reactive',
    input: {
      stateKey: 'closure:reactive',
      state: makeReactiveThermalInitialState({ environment: model.environment }),
      environment: model.environment,
      coupling: { fireIntensity: 0.7, fuelFraction: 0.9, flameTemperatureK: 1000 },
      dt: 1 / 30,
      enableWebGPU: false,
      emitCommitDelta: false
    }
  });
  const sphTask = await stepSphMaterial({
    stateKey: 'closure:sph',
    input: {
      stateKey: 'closure:sph',
      state: makeSphMaterialInitialState({ count: 16, seed: 8, environment: model.environment }),
      environment: model.environment,
      coupling: { fireIntensity: 0.4, flameTemperatureK: 900, membraneIntegrity: 1, ruptured: false },
      dt: 1 / 120,
      enableWebGPU: false
    }
  });

  const molecularClosure = closureResultFromMolecularDynamics(molecularTask, { environment: model.environment });
  const reactiveClosure = closureResultFromReactiveThermal(reactiveTask, { environment: model.environment });
  const sphClosure = closureResultFromSphMaterial(sphTask, { environment: model.environment });
  assert.equal(molecularClosure.schema, CLOSURE_RESULT_SCHEMA);
  assert.equal(molecularClosure.state.schema, CLOSURE_STATE_SCHEMA);
  assert.equal(molecularClosure.source.solverId, 'molecular-dynamics');
  assert.equal(typeof molecularClosure.thermodynamics.temperatureK, 'number');
  assert.equal(typeof molecularClosure.transport.electricalConductivitySm, 'number');
  assert.equal(typeof molecularClosure.chemistry.bondCount, 'number');
  assert.equal(molecularClosure.chemistry.reactionLedger.schema, MOLECULAR_REACTION_LEDGER_SCHEMA);
  assert.equal(molecularClosure.chemistry.reactionEventLedger.schema, MOLECULAR_REACTION_EVENT_LEDGER_SCHEMA);
  assert.equal(molecularClosure.chemistry.reactionSource.schema, MOLECULAR_REACTION_SOURCE_SCHEMA);
  assert.equal(typeof molecularClosure.chemistry.reactionEventCount, 'number');
  assert.equal(typeof molecularClosure.chemistry.reactionHeatSourceProxy, 'number');
  assert.equal(molecularClosure.chemistry.molecularSpecies.H2O, 4);
  assert.equal(molecularClosure.chemistry.stoichiometryResidualProxy, 0);
  assert.equal(typeof molecularClosure.electromagnetics.dielectricConstant, 'number');
  assert.deepEqual(validateClosureResult(molecularClosure), { ok: true, errors: [] });

  assert.equal(reactiveClosure.schema, CLOSURE_RESULT_SCHEMA);
  assert.equal(reactiveClosure.state.schema, CLOSURE_STATE_SCHEMA);
  assert.equal(reactiveClosure.source.solverId, 'reactive-thermal-cell');
  assert.equal(typeof reactiveClosure.thermodynamics.temperatureK, 'number');
  assert.equal(typeof reactiveClosure.transport.thermalConductivityWmK, 'number');
  assert.deepEqual(validateClosureResult(reactiveClosure), { ok: true, errors: [] });

  assert.equal(sphClosure.schema, CLOSURE_RESULT_SCHEMA);
  assert.equal(sphClosure.source.solverId, 'sph-material');
  assert.equal(typeof sphClosure.mechanics.bulkModulusPa, 'number');
  assert.equal(typeof sphClosure.phase.vaporFraction, 'number');
  assert.equal(typeof sphClosure.phase.iceFraction, 'number');
  assert.equal(typeof sphClosure.phase.phaseChangeRateProxy, 'number');
  assert.equal(typeof sphClosure.thermodynamics.latentHeatSinkProxy, 'number');
  assert.deepEqual(validateClosureResult(sphClosure), { ok: true, errors: [] });

  model.applyMolecularDynamicsResult(molecularTask);
  model.applyReactiveThermalResult(reactiveTask);
  model.applySphMaterialResult(sphTask);
  const packet = model.createPacket();
  assert.equal(packet.upward.closureResults.molecularDynamics.schema, CLOSURE_RESULT_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.reactionLedger.schema, MOLECULAR_REACTION_LEDGER_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.reactionEventLedger.schema, MOLECULAR_REACTION_EVENT_LEDGER_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.reactionSource.schema, MOLECULAR_REACTION_SOURCE_SCHEMA);
  assert.equal(packet.upward.aggregateState.molecularDynamics.molecularSpecies.H2O, 4);
  assert.equal(packet.upward.aggregateState.molecularDynamics.dominantMolecule, 'H2O');
  assert.equal(packet.upward.aggregateState.molecularDynamics.stoichiometryResidualProxy, 0);
  assert.equal(packet.upward.closures.molecularRecognizedMoleculeCount, 4);
  assert.equal(typeof packet.upward.closures.molecularReactionEventCount, 'number');
  assert.equal(typeof packet.upward.closures.molecularReactionHeatSourceProxy, 'number');
  assert.equal(packet.upward.closureResults.reactiveThermal.schema, CLOSURE_RESULT_SCHEMA);
  assert.equal(packet.upward.closureResults.sphMaterial.schema, CLOSURE_RESULT_SCHEMA);
  assert.equal(packet.upward.closureResults.reactiveThermal.validity.status, 'interactive-proxy');
});

test('ComputeManager runs executable N-body solver descriptor through warm delta flow', async () => {
  resetNBodyGravity();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({ nbodyModuleUrl: nbodyTaskModuleUrl })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));
  const initialState = makeNBodyInitialState({
    count: 4,
    seed: 20260529,
    radius: 1.5,
    centralMass: 24,
    orbitalMass: 0.75,
    gravitationalConstant: 1
  });

  const first = await manager.submitSolverTask('nbody-gravity', {
    id: 'nbody:manager:first',
    stateKey: 'solar:nbody:test',
    input: {
      taskId: 'nbody:manager',
      stateKey: 'solar:nbody:test',
      state: initialState,
      dt: 0.01,
      substeps: 2,
      gravitationalConstant: 1,
      softening: 0.025,
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });
  const second = await manager.submitSolverTask('nbody-gravity', {
    id: 'nbody:manager:second',
    stateKey: 'solar:nbody:test',
    input: {
      taskId: 'nbody:manager',
      stateKey: 'solar:nbody:test',
      dt: 0.01,
      substeps: 2,
      gravitationalConstant: 1,
      softening: 0.025,
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(first.sequence, 1);
  assert.equal(second.sequence, 2);
  assert.equal(second.backend, 'cpu-direct-sum');
  assert.equal(second.state.masses.length, 4);
  assert.equal(deltas.length, 2);
  assert.equal(deltas[1].taskId, 'nbody:manager');
  assert.equal(deltas[1].scope, 'multiscale-solver-deltas');
  assert.equal(deltas[1].payload.schema, N_BODY_GRAVITY_DELTA_SCHEMA);
  assert.equal(deltas[1].payload.sequence, 2);
  assert.ok(Math.abs(second.conservation.relativeEnergyDrift) < 1e-3);
});

test('ComputeManager runs N-body Barnes-Hut descriptor through warm delta flow', async () => {
  resetNBodyGravity();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({ nbodyModuleUrl: nbodyTaskModuleUrl })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('nbody-gravity', {
    id: 'nbody:manager:tree',
    stateKey: 'solar:nbody:tree-manager',
    input: {
      taskId: 'nbody:manager:tree',
      stateKey: 'solar:nbody:tree-manager',
      state: makeNBodyInitialState({ count: 96, seed: 99, radius: 3, centralMass: 60 }),
      dt: 0.004,
      substeps: 1,
      gravitationalConstant: 1,
      softening: 0.035,
      gravityMode: 'tree',
      treeTheta: 0.75,
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.backend, 'cpu-barnes-hut');
  assert.equal(result.approximation.mode, 'barnes-hut');
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'nbody:manager:tree');
  assert.equal(deltas[0].payload.schema, N_BODY_GRAVITY_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.approximation.mode, 'barnes-hut');
  assert.ok(deltas[0].payload.approximation.interactionCount < 96 * 95);
});

test('ComputeManager runs executable reactive thermal descriptor through warm delta flow', async () => {
  resetReactiveThermalCell();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      nbodyModuleUrl: nbodyTaskModuleUrl,
      reactiveThermalModuleUrl: reactiveThermalTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('reactive-thermal-cell', {
    id: 'reactive:manager:first',
    stateKey: 'surface:reactive:test',
    input: {
      taskId: 'reactive:manager',
      stateKey: 'surface:reactive:test',
      dt: 1 / 30,
      environment: { oxygenFraction: 0.24, ambientTemperatureK: 294, ambientPressurePa: 101325 },
      coupling: { fireIntensity: 0.82, fuelFraction: 0.9, waterContact: 0.08, flameTemperatureK: 1040 },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.backend, 'cpu-reactive-thermal');
  assert.ok(result.closure.temperatureK >= 294);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'reactive:manager');
  assert.equal(deltas[0].payload.schema, REACTIVE_THERMAL_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.backend, 'cpu-reactive-thermal');
});

test('ComputeManager runs executable molecular dynamics descriptor through warm delta flow', async () => {
  resetMolecularDynamics();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      molecularDynamicsModuleUrl: molecularDynamicsTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('molecular-dynamics', {
    id: 'molecular:manager:first',
    stateKey: 'molecular:md:test',
    input: {
      taskId: 'molecular:manager',
      stateKey: 'molecular:md:test',
      state: makeMolecularDynamicsInitialState({ atomCount: 18, seed: 18 }),
      dt: 0.05,
      environment: { ambientTemperatureK: 330, ambientPressurePa: 101325, oxygenFraction: 0.28, gravityMps2: 9.8 },
      coupling: { fireIntensity: 0.7, radiativeHeatFlux: 140, reactionProgress: 0.3 },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.backend, 'cpu-molecular-dynamics');
  assert.equal(result.diagnostics.atomCount, 18);
  assert.ok(result.diagnostics.bondCount > 0);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'molecular:manager');
  assert.equal(deltas[0].payload.schema, MOLECULAR_DYNAMICS_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.backend, 'cpu-molecular-dynamics');
  assert.equal(deltas[0].payload.atomCount, 18);
});

test('ComputeManager runs executable quantum orbital grid descriptor through warm delta flow', async () => {
  resetQuantumOrbitalGrid({ stateKey: 'orbital:manager:test' });
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      quantumOrbitalGridModuleUrl: quantumOrbitalGridTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('quantum-orbital-grid', {
    id: 'orbital:manager:first',
    stateKey: 'orbital:manager:test',
    input: {
      taskId: 'orbital:manager',
      stateKey: 'orbital:manager:test',
      elementSymbol: 'O',
      principalN: 2,
      angularL: 1,
      magneticM: 0,
      finiteGridSize: 12,
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, false);
  assert.equal(result.schema, QUANTUM_ORBITAL_GRID_RESULT_SCHEMA);
  assert.equal(result.status, 'blocked-webgpu-unavailable');
  assert.equal(result.backend, 'webgpu-unavailable');
  assert.equal(result.liveBackendPolicy, QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY);
  assert.equal(result.finiteGrid, null);
  assert.equal(result.webgpuStatus.schema, QUANTUM_ORBITAL_GRID_WEBGPU_SCHEMA);
  assert.equal(result.webgpuStatus.liveBackendPolicy, QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY);
  assert.equal(result.webgpuStatus.sampleCount, 1728);
  assert.match(result.webgpuStatus.reason, /WebGPU|enableWebGPU=false|no CPU fallback/i);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'orbital:manager');
  assert.equal(deltas[0].payload.schema, QUANTUM_ORBITAL_GRID_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.status, 'blocked-webgpu-unavailable');
  assert.equal(deltas[0].payload.backend, 'webgpu-unavailable');
  assert.equal(deltas[0].payload.liveBackendPolicy, QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY);
  assert.equal(deltas[0].payload.finiteGrid, null);
  assert.equal(deltas[0].payload.webgpuStatus.schema, QUANTUM_ORBITAL_GRID_WEBGPU_SCHEMA);
});

test('ComputeManager runs executable quantum material potential descriptor through warm delta flow', async () => {
  resetQuantumMaterialPotential();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      quantumMaterialPotentialModuleUrl: quantumMaterialPotentialTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));
  const environment = {
    ambientTemperatureK: 420,
    ambientPressurePa: 101325,
    oxygenFraction: 0.21,
    gravityMps2: 9.81
  };
  const quantumOrbital = createQuantumOrbitalClosure({
    orbital: { elementSymbol: 'O', principalN: 2, angularL: 1, magneticM: 0, finiteGridSize: 8 },
    environment,
    molecularDynamics: { meanTemperatureK: 420, ionizationFraction: 0.01 },
    timeSeconds: 0
  });

  const result = await manager.submitSolverTask('quantum-material-potential', {
    id: 'qmat:manager:first',
    stateKey: 'qmat:manager:test',
    input: {
      taskId: 'qmat:manager',
      stateKey: 'qmat:manager:test',
      sampleCount: 64,
      environment,
      quantumOrbital,
      molecularDynamics: {
        atomCount: 15,
        species: { H: 10, O: 5, other: 0 },
        molecularSpecies: { H2O: 5 },
        phaseFractions: { liquid: 1 },
        meanTemperatureK: 420,
        ionizationFraction: 0.01
      },
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, false);
  assert.equal(result.schema, QUANTUM_MATERIAL_POTENTIAL_RESULT_SCHEMA);
  assert.equal(result.status, 'blocked-webgpu-unavailable');
  assert.equal(result.backend, 'webgpu-unavailable');
  assert.equal(result.liveBackendPolicy, QUANTUM_MATERIAL_POTENTIAL_LIVE_BACKEND_POLICY);
  assert.equal(result.potential.schema, QUANTUM_MATERIAL_POTENTIAL_SCHEMA);
  assert.equal(result.batch, null);
  assert.equal(result.diagnostics.batch, null);
  assert.equal(result.webgpuStatus.schema, QUANTUM_MATERIAL_POTENTIAL_WEBGPU_SCHEMA);
  assert.equal(result.webgpuStatus.liveBackendPolicy, QUANTUM_MATERIAL_POTENTIAL_LIVE_BACKEND_POLICY);
  assert.equal(result.webgpuStatus.recordCount, 64);
  assert.match(result.webgpuStatus.reason, /WebGPU|navigator\.gpu|no CPU fallback/i);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'qmat:manager');
  assert.equal(deltas[0].payload.schema, QUANTUM_MATERIAL_POTENTIAL_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.status, 'blocked-webgpu-unavailable');
  assert.equal(deltas[0].payload.liveBackendPolicy, QUANTUM_MATERIAL_POTENTIAL_LIVE_BACKEND_POLICY);
  assert.equal(deltas[0].payload.batch, null);
  assert.equal(deltas[0].payload.webgpuStatus.schema, QUANTUM_MATERIAL_POTENTIAL_WEBGPU_SCHEMA);
});

test('ComputeManager runs executable Maxwell descriptor through warm delta flow', async () => {
  resetMaxwellFields();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      nbodyModuleUrl: nbodyTaskModuleUrl,
      reactiveThermalModuleUrl: reactiveThermalTaskModuleUrl,
      maxwellModuleUrl: maxwellTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('maxwell-em', {
    id: 'maxwell:manager:first',
    stateKey: 'galactic:maxwell:test',
    input: {
      taskId: 'maxwell:manager',
      stateKey: 'galactic:maxwell:test',
      width: 8,
      height: 8,
      seed: 10,
      dt: 0.02,
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.backend, 'cpu-maxwell-fdtd');
  assert.ok(result.diagnostics.fieldEnergy > 0);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'maxwell:manager');
  assert.equal(deltas[0].payload.schema, MAXWELL_FIELD_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.backend, 'cpu-maxwell-fdtd');
});

test('ComputeManager runs executable cosmology expansion descriptor through warm delta flow', async () => {
  resetCosmologyExpansion();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      nbodyModuleUrl: nbodyTaskModuleUrl,
      reactiveThermalModuleUrl: reactiveThermalTaskModuleUrl,
      maxwellModuleUrl: maxwellTaskModuleUrl,
      cosmologyExpansionModuleUrl: cosmologyExpansionTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('cosmology-expansion', {
    id: 'cosmology:manager:first',
    stateKey: 'supergalactic:cosmology:test',
    input: {
      taskId: 'cosmology:manager',
      stateKey: 'supergalactic:cosmology:test',
      state: makeCosmologyExpansionInitialState({ sampleCount: 24, seed: 14 }),
      dt: 0.03,
      environment: { hubbleRate: 0.071 },
      coupling: { galaxyTurbulence: 0.45, starFormationRate: 1.6, maxwellFieldEnergy: 0.2, relativisticLensing: 1200, relativisticRedshift: 0.006 },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.backend, 'cpu-cosmology-expansion');
  assert.equal(result.diagnostics.sampleCount, 24);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'cosmology:manager');
  assert.equal(deltas[0].payload.schema, COSMOLOGY_EXPANSION_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.backend, 'cpu-cosmology-expansion');
  assert.equal(deltas[0].payload.diagnostics.sampleCount, 24);
});

test('ComputeManager runs executable SPH material descriptor through warm delta flow', async () => {
  resetSphMaterial();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      nbodyModuleUrl: nbodyTaskModuleUrl,
      reactiveThermalModuleUrl: reactiveThermalTaskModuleUrl,
      maxwellModuleUrl: maxwellTaskModuleUrl,
      sphMaterialModuleUrl: sphMaterialTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('sph-material', {
    id: 'sph:manager:first',
    stateKey: 'surface:sph:test',
    input: {
      taskId: 'sph:manager',
      stateKey: 'surface:sph:test',
      state: makeSphMaterialInitialState({ count: 18, seed: 5 }),
      dt: 1 / 120,
      environment: { oxygenFraction: 0.24, ambientTemperatureK: 294, ambientPressurePa: 101325, gravityMps2: 9.8 },
      coupling: { fireIntensity: 0.82, flameTemperatureK: 1040, membraneIntegrity: 0.9, ruptured: false },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.backend, 'cpu-sph-material');
  assert.equal(result.diagnostics.count, 18);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'sph:manager');
  assert.equal(deltas[0].payload.schema, SPH_MATERIAL_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.backend, 'cpu-sph-material');
  assert.equal(deltas[0].payload.particleCount, 18);
});

test('ComputeManager runs executable membrane shell descriptor through warm delta flow', async () => {
  resetMembraneShell();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      nbodyModuleUrl: nbodyTaskModuleUrl,
      reactiveThermalModuleUrl: reactiveThermalTaskModuleUrl,
      maxwellModuleUrl: maxwellTaskModuleUrl,
      sphMaterialModuleUrl: sphMaterialTaskModuleUrl,
      membraneShellModuleUrl: membraneShellTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('membrane-shell', {
    id: 'membrane:manager:first',
    stateKey: 'surface:membrane:test',
    input: {
      taskId: 'membrane:manager',
      stateKey: 'surface:membrane:test',
      state: makeMembraneShellInitialState({ segmentCount: 20, seed: 5 }),
      dt: 1 / 90,
      environment: { ambientTemperatureK: 294, ambientPressurePa: 101325, gravityMps2: 9.8 },
      coupling: {
        internalPressurePa: 124000,
        waterTemperatureK: 330,
        waterMassKg: 0.42,
        fireIntensity: 0.82,
        flameTemperatureK: 1040,
        radiativeHeatFlux: 80,
        membraneIntegrity: 1
      },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.backend, 'cpu-membrane-shell');
  assert.equal(result.diagnostics.segmentCount, 20);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'membrane:manager');
  assert.equal(deltas[0].payload.schema, MEMBRANE_SHELL_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.backend, 'cpu-membrane-shell');
  assert.equal(deltas[0].payload.segmentCount, 20);
});

test('ComputeManager runs executable hydro atmosphere descriptor through warm delta flow', async () => {
  resetHydroAtmosphere();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      nbodyModuleUrl: nbodyTaskModuleUrl,
      reactiveThermalModuleUrl: reactiveThermalTaskModuleUrl,
      maxwellModuleUrl: maxwellTaskModuleUrl,
      sphMaterialModuleUrl: sphMaterialTaskModuleUrl,
      hydroAtmosphereModuleUrl: hydroAtmosphereTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('hydro-atmosphere', {
    id: 'hydro:manager:first',
    stateKey: 'planet:hydro:test',
    input: {
      taskId: 'hydro:manager',
      stateKey: 'planet:hydro:test',
      state: makeHydroAtmosphereInitialState({ width: 8, height: 4, seed: 14 }),
      dt: 0.03,
      environment: { ambientTemperatureK: 294, stellarFlux: 1.1, gravityMps2: 9.8 },
      coupling: { oceanHeat: 0.58 },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.backend, 'cpu-hydro-atmosphere');
  assert.equal(result.diagnostics.cellCount, 32);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'hydro:manager');
  assert.equal(deltas[0].payload.schema, HYDRO_ATMOSPHERE_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.backend, 'cpu-hydro-atmosphere');
  assert.equal(deltas[0].payload.diagnostics.cellCount, 32);
});

test('ComputeManager runs executable radiation opacity descriptor through warm delta flow', async () => {
  resetRadiationOpacity();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      nbodyModuleUrl: nbodyTaskModuleUrl,
      reactiveThermalModuleUrl: reactiveThermalTaskModuleUrl,
      maxwellModuleUrl: maxwellTaskModuleUrl,
      sphMaterialModuleUrl: sphMaterialTaskModuleUrl,
      hydroAtmosphereModuleUrl: hydroAtmosphereTaskModuleUrl,
      radiationOpacityModuleUrl: radiationOpacityTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('radiation-opacity', {
    id: 'radiation:manager:first',
    stateKey: 'surface:radiation:test',
    input: {
      taskId: 'radiation:manager',
      stateKey: 'surface:radiation:test',
      state: makeRadiationOpacityInitialState({ width: 8, height: 4, seed: 14 }),
      dt: 0.03,
      environment: { ambientTemperatureK: 294, stellarFlux: 1.2 },
      coupling: { fireIntensity: 0.7, cloudCover: 0.5, smokeFraction: 0.15 },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.backend, 'cpu-radiation-opacity');
  assert.equal(result.diagnostics.cellCount, 32);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'radiation:manager');
  assert.equal(deltas[0].payload.schema, RADIATION_OPACITY_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.backend, 'cpu-radiation-opacity');
  assert.equal(deltas[0].payload.diagnostics.cellCount, 32);
});

test('ComputeManager runs executable stellar fusion descriptor through warm delta flow', async () => {
  resetStellarFusion();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      nbodyModuleUrl: nbodyTaskModuleUrl,
      reactiveThermalModuleUrl: reactiveThermalTaskModuleUrl,
      maxwellModuleUrl: maxwellTaskModuleUrl,
      sphMaterialModuleUrl: sphMaterialTaskModuleUrl,
      hydroAtmosphereModuleUrl: hydroAtmosphereTaskModuleUrl,
      radiationOpacityModuleUrl: radiationOpacityTaskModuleUrl,
      stellarFusionModuleUrl: stellarFusionTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('stellar-fusion', {
    id: 'stellar:manager:first',
    stateKey: 'solar:stellar:test',
    input: {
      taskId: 'stellar:manager',
      stateKey: 'solar:stellar:test',
      state: makeStellarFusionInitialState({ width: 8, height: 4, seed: 14 }),
      dt: 0.03,
      environment: { stellarFlux: 1.2, gravityMps2: 9.8 },
      coupling: { metallicity: 0.013, radiationPressure: 1, opacity: 0.08 },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.backend, 'cpu-stellar-fusion');
  assert.equal(result.diagnostics.cellCount, 32);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'stellar:manager');
  assert.equal(deltas[0].payload.schema, STELLAR_FUSION_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.backend, 'cpu-stellar-fusion');
  assert.equal(deltas[0].payload.diagnostics.cellCount, 32);
});

test('ComputeManager runs executable magnetosphere plasma descriptor through warm delta flow', async () => {
  resetMagnetospherePlasma();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      nbodyModuleUrl: nbodyTaskModuleUrl,
      reactiveThermalModuleUrl: reactiveThermalTaskModuleUrl,
      maxwellModuleUrl: maxwellTaskModuleUrl,
      sphMaterialModuleUrl: sphMaterialTaskModuleUrl,
      hydroAtmosphereModuleUrl: hydroAtmosphereTaskModuleUrl,
      radiationOpacityModuleUrl: radiationOpacityTaskModuleUrl,
      stellarFusionModuleUrl: stellarFusionTaskModuleUrl,
      magnetospherePlasmaModuleUrl: magnetospherePlasmaTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('magnetosphere-plasma', {
    id: 'mhd:manager:first',
    stateKey: 'solar:mhd:test',
    input: {
      taskId: 'mhd:manager',
      stateKey: 'solar:mhd:test',
      state: makeMagnetospherePlasmaInitialState({ width: 8, height: 4, seed: 14 }),
      dt: 0.03,
      environment: { stellarFlux: 1.2, gravityMps2: 9.8, ambientPressurePa: 101325 },
      coupling: { stellarLuminosityFactor: 1.1, radiationPressure: 1, maxwellFieldEnergy: 0.2, poyntingFlux: [0.1, 0, 0] },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.backend, 'cpu-magnetosphere-plasma');
  assert.equal(result.diagnostics.cellCount, 32);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'mhd:manager');
  assert.equal(deltas[0].payload.schema, MAGNETOSPHERE_PLASMA_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.backend, 'cpu-magnetosphere-plasma');
  assert.equal(deltas[0].payload.diagnostics.cellCount, 32);
});

test('ComputeManager runs executable PIC plasma patch descriptor through warm delta flow', async () => {
  resetPicPlasmaPatch();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      nbodyModuleUrl: nbodyTaskModuleUrl,
      reactiveThermalModuleUrl: reactiveThermalTaskModuleUrl,
      maxwellModuleUrl: maxwellTaskModuleUrl,
      sphMaterialModuleUrl: sphMaterialTaskModuleUrl,
      hydroAtmosphereModuleUrl: hydroAtmosphereTaskModuleUrl,
      radiationOpacityModuleUrl: radiationOpacityTaskModuleUrl,
      stellarFusionModuleUrl: stellarFusionTaskModuleUrl,
      magnetospherePlasmaModuleUrl: magnetospherePlasmaTaskModuleUrl,
      picPlasmaPatchModuleUrl: picPlasmaPatchTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('pic-plasma-patch', {
    id: 'pic:manager:first',
    stateKey: 'solar:pic:test',
    input: {
      taskId: 'pic:manager',
      stateKey: 'solar:pic:test',
      state: makePicPlasmaPatchInitialState({ particleCount: 32, gridWidth: 8, gridHeight: 4, seed: 14 }),
      dt: 0.03,
      environment: { ambientTemperatureK: 400, gravityMps2: 9.8, ambientPressurePa: 101325 },
      coupling: { reconnectionRate: 0.7, solarWindPressure: 1.4, ionization: 0.35, alfvenSpeed: 0.8, maxwellFieldEnergy: 0.2, poyntingFlux: [0.1, 0, 0] },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.backend, 'cpu-pic-plasma-patch');
  assert.equal(result.diagnostics.particleCount, 32);
  assert.equal(result.diagnostics.cellCount, 32);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'pic:manager');
  assert.equal(deltas[0].payload.schema, PIC_PLASMA_PATCH_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.backend, 'cpu-pic-plasma-patch');
  assert.equal(deltas[0].payload.diagnostics.particleCount, 32);
});

test('ComputeManager runs executable relativistic correction descriptor through warm delta flow', async () => {
  resetRelativisticCorrection();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      nbodyModuleUrl: nbodyTaskModuleUrl,
      reactiveThermalModuleUrl: reactiveThermalTaskModuleUrl,
      maxwellModuleUrl: maxwellTaskModuleUrl,
      sphMaterialModuleUrl: sphMaterialTaskModuleUrl,
      hydroAtmosphereModuleUrl: hydroAtmosphereTaskModuleUrl,
      radiationOpacityModuleUrl: radiationOpacityTaskModuleUrl,
      stellarFusionModuleUrl: stellarFusionTaskModuleUrl,
      magnetospherePlasmaModuleUrl: magnetospherePlasmaTaskModuleUrl,
      picPlasmaPatchModuleUrl: picPlasmaPatchTaskModuleUrl,
      relativisticCorrectionModuleUrl: relativisticCorrectionTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('relativistic-correction', {
    id: 'relativity:manager:first',
    stateKey: 'solar:relativity:test',
    input: {
      taskId: 'relativity:manager',
      stateKey: 'solar:relativity:test',
      state: makeRelativisticCorrectionInitialState({ sampleCount: 32, seed: 14 }),
      dt: 0.03,
      environment: { stellarFlux: 1.2, gravityMps2: 9.8, ambientPressurePa: 101325 },
      coupling: { stellarLuminosityFactor: 1.1, radiationPressure: 1, maxwellFieldEnergy: 0.2, poyntingFlux: [0.1, 0, 0], alfvenSpeed: 0.8 },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.backend, 'cpu-relativistic-correction');
  assert.equal(result.diagnostics.sampleCount, 32);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'relativity:manager');
  assert.equal(deltas[0].payload.schema, RELATIVISTIC_CORRECTION_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.backend, 'cpu-relativistic-correction');
  assert.equal(deltas[0].payload.diagnostics.sampleCount, 32);
});

test('ComputeManager runs executable combustion plume descriptor through warm delta flow', async () => {
  resetCombustionPlume();
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: createMultiscaleSolverDescriptors({
      nbodyModuleUrl: nbodyTaskModuleUrl,
      reactiveThermalModuleUrl: reactiveThermalTaskModuleUrl,
      maxwellModuleUrl: maxwellTaskModuleUrl,
      sphMaterialModuleUrl: sphMaterialTaskModuleUrl,
      hydroAtmosphereModuleUrl: hydroAtmosphereTaskModuleUrl,
      radiationOpacityModuleUrl: radiationOpacityTaskModuleUrl,
      combustionPlumeModuleUrl: combustionPlumeTaskModuleUrl
    })
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('combustion-plume', {
    id: 'combustion:manager:first',
    stateKey: 'surface:combustion:test',
    input: {
      taskId: 'combustion:manager',
      stateKey: 'surface:combustion:test',
      state: makeCombustionPlumeInitialState({ width: 8, height: 4, seed: 14 }),
      dt: 0.03,
      environment: { ambientTemperatureK: 294, oxygenFraction: 0.23 },
      coupling: { fireIntensity: 0.8, waterContact: 0.04, radiativeHeatFlux: 55 },
      enableWebGPU: false,
      emitCommitDelta: true
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.backend, 'cpu-combustion-plume');
  assert.equal(result.diagnostics.cellCount, 32);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'combustion:manager');
  assert.equal(deltas[0].payload.schema, COMBUSTION_PLUME_DELTA_SCHEMA);
  assert.equal(deltas[0].payload.backend, 'cpu-combustion-plume');
  assert.equal(deltas[0].payload.diagnostics.cellCount, 32);
});

test('peercompute ladder task module keeps persistent compute state', async () => {
  await resetLadderCompute();
  const init = await initLadderCompute({ count: 10, seed: 12 });
  assert.equal(init.ok, true);
  assert.equal(init.status.backend, 'cpu-fallback');
  assert.equal(init.snapshot.count, 10);

  const step = await stepLadderCompute({
    time: 0.75,
    dt: 1 / 30,
    layerIndex: 5,
    environment: { oxygenFraction: 0.2, gravityMps2: 9.8, stellarFlux: 1.1 }
  });
  assert.equal(step.ok, true);
  assert.equal(step.status.completedReadbacks, 1);
  assert.equal(step.snapshot.layerIndex, 5);
  assert.equal(step.snapshot.positions.length, 10 * WEBGPU_SNAPSHOT_POSITION_FLOATS);
});

test('peercompute ladder runtime reports ComputeManager-managed execution', async () => {
  await resetLadderCompute();
  const manager = new InlineManagerStub();
  const runtime = new PeerComputeLadderRuntime({
    count: 14,
    seed: 44,
    createManager: () => manager
  });

  const initStatus = await runtime.initialize();
  assert.equal(manager.initialized, true);
  assert.equal(initStatus.peercompute.schema, PEERCOMPUTE_LADDER_RUNTIME_SCHEMA);
  assert.equal(initStatus.peercompute.manager, 'peercompute-compute-manager');
  assert.equal(initStatus.peercompute.execution, 'peercompute-inline');
  assert.equal(initStatus.peercompute.workerCount, 1);

  const before = runtime.lastSnapshot.positions.slice();
  runtime.step({
    time: 1.25,
    dt: 1 / 30,
    layerIndex: 6,
    environment: { oxygenFraction: 0.21, gravityMps2: 9.8, stellarFlux: 1 }
  });
  await runtime.whenIdle();

  const after = runtime.lastSnapshot.positions;
  const status = runtime.getStatus();
  assert.equal(status.peercompute.pendingTask, false);
  assert.equal(status.peercompute.submittedTasks, 1);
  assert.equal(status.peercompute.completedTasks, 1);
  assert.equal(status.peercompute.failedTasks, 0);
  assert.equal(status.peercompute.localFallback, false);
  assert.equal(status.backend, 'cpu-fallback');
  assert.equal(runtime.lastSnapshot.layerIndex, 6);
  assert.notDeepEqual(after, before);
});

test('scale compute orchestrator schedules all scale shards through one shared manager and StateManager', async () => {
  await resetLadderCompute();
  const deltaScope = 'multiscale-compute-test';
  const stateManager = new StateManager(null, {
    docName: 'multiscale-orchestrator-test',
    enablePersistence: false,
    disableNetworkProvider: true,
    disableBroadcast: true,
    deltaNamespace: deltaScope
  });
  await stateManager.initialize();
  const manager = new SharedInlineManagerStub({ workers: 6 });
  manager.setCommitDeltaHandler((delta) => stateManager.commitDelta(delta));
  const orchestrator = new ScaleComputeOrchestrator({
    layers: SCALE_LAYERS.slice(0, 3),
    workersPerScale: 2,
    totalParticleCount: 18,
    seed: 100,
    computeManager: manager,
    stateManager,
    deltaScope
  });

  const initStatus = await orchestrator.initialize();
  await orchestrator.whenIdle();
  assert.equal(initStatus.peercompute.poolSchema, SCALE_COMPUTE_POOL_SCHEMA);
  assert.equal(initStatus.peercompute.manager, 'peercompute-scale-worker-pool');
  assert.equal(initStatus.peercompute.workerCount, 6);
  assert.equal(initStatus.peercompute.plannedWorkers, 6);
  assert.equal(initStatus.peercompute.plannedShardTasks, 6);
  assert.equal(initStatus.peercompute.shardRuntimeCount, 6);
  assert.equal(initStatus.peercompute.activeShardCount, 2);
  assert.equal(initStatus.peercompute.totalLayers, 3);
  assert.equal(initStatus.peercompute.managerCapabilities.workers, 6);
  assert.equal(initStatus.peercompute.stateBacked, true);
  assert.equal(initStatus.peercompute.stateScope, deltaScope);

  const warmDelta = stateManager.getDataState().readWarm('multiscale:supergalactic:shard:0', deltaScope);
  assert.equal(warmDelta.payload.layerId, 'supergalactic');
  assert.equal(Array.isArray(warmDelta.payload.positions), true);

  orchestrator.step({
    time: 0.25,
    dt: 1 / 30,
    layerIndex: 0,
    environment: { oxygenFraction: 0.21, gravityMps2: 9.8, stellarFlux: 1 }
  });
  await orchestrator.whenIdle();
  assert.equal(orchestrator.lastSnapshot.layerIndex, 0);
  assert.equal(orchestrator.lastSnapshot.shardCount, 2);
  assert.equal(orchestrator.lastSnapshot.count, 18);
  assert.equal(orchestrator.lastSnapshot.positions.length, 18 * WEBGPU_SNAPSHOT_POSITION_FLOATS);

  await orchestrator.ensureLayerInitialized(2);
  orchestrator.step({
    time: 0.5,
    dt: 1 / 30,
    layerIndex: 2,
    environment: { oxygenFraction: 0.21, gravityMps2: 9.8, stellarFlux: 1 },
    readbackInterval: 7,
    readbackReason: 'unit-readback-budget'
  });
  await orchestrator.whenIdle();
  const status = orchestrator.getStatus();
  assert.equal(orchestrator.lastSnapshot.layerIndex, 2);
  assert.equal(status.readbackInterval, 7);
  assert.equal(status.readbackIntervalReason, 'unit-readback-budget');
  assert.ok(status.readbackIntervalRevision >= 1);
  assert.equal(status.peercompute.activeLayerId, 'solar');
  assert.equal(status.peercompute.activeWorkerCount, 2);
  assert.equal(status.peercompute.execution, 'peercompute-inline-pool');
  assert.equal(status.peercompute.scalePools.length, 3);
  assert.equal(status.peercompute.managerCapabilities.affinityCount, 6);
});

test('scale compute orchestrator resizes shard pool through one shared manager', async () => {
  await resetLadderCompute();
  const deltaScope = 'multiscale-compute-resize-test';
  const stateManager = new StateManager(null, {
    docName: 'multiscale-orchestrator-resize-test',
    enablePersistence: false,
    disableNetworkProvider: true,
    disableBroadcast: true,
    deltaNamespace: deltaScope
  });
  await stateManager.initialize();
  const manager = new SharedInlineManagerStub({ workers: 4 });
  manager.setCommitDeltaHandler((delta) => stateManager.commitDelta(delta));
  const orchestrator = new ScaleComputeOrchestrator({
    layers: SCALE_LAYERS.slice(0, 2),
    workersPerScale: 2,
    totalParticleCount: 12,
    seed: 101,
    computeManager: manager,
    stateManager,
    deltaScope,
    computeBudget: { schema: 'test-budget', workersPerScale: 2, totalParticleCount: 12 }
  });

  await orchestrator.initialize();
  await orchestrator.whenIdle();
  assert.equal(orchestrator.getStatus().peercompute.plannedShardTasks, 4);
  assert.equal(orchestrator.getStatus().peercompute.activeShardCount, 2);

  const resized = await orchestrator.resizePool({
    workersPerScale: 1,
    totalParticleCount: 6,
    computeBudget: { schema: 'test-budget', workersPerScale: 1, totalParticleCount: 6 },
    reason: 'unit-worker-resize'
  });
  await orchestrator.whenIdle();
  const status = orchestrator.getStatus();
  assert.equal(resized.peercompute.plannedShardTasks, 2);
  assert.equal(status.peercompute.activeShardCount, 1);
  assert.equal(status.peercompute.workersPerScale, 1);
  assert.equal(status.peercompute.computeBudget.totalParticleCount, 6);
  assert.equal(status.peercompute.lastResize.reason, 'unit-worker-resize');
  assert.equal(status.peercompute.lastResize.previous.plannedShardTasks, 4);
  assert.equal(status.peercompute.lastResize.next.plannedShardTasks, 2);
  assert.ok(status.peercompute.lastResize.reusedShardCount >= 1);
  assert.equal(orchestrator.lastSnapshot.layerIndex, 0);
  assert.equal(orchestrator.lastSnapshot.shardCount, 1);
  assert.equal(orchestrator.lastSnapshot.count, 6);

  const warmDelta = stateManager.getDataState().readWarm('multiscale:supergalactic:shard:0', deltaScope);
  assert.equal(warmDelta.payload.layerId, 'supergalactic');
  assert.equal(warmDelta.payload.count, 6);

  const carriedBefore = orchestrator.lastSnapshot.positions.slice(0, 6 * WEBGPU_SNAPSHOT_POSITION_FLOATS);
  const carriedRecordsBefore = orchestrator.layerPools[0].shards[0].runtime.lastSnapshot.particleRecords
    .slice(0, 6 * WEBGPU_SNAPSHOT_RECORD_FLOATS);
  await orchestrator.resizePool({
    workersPerScale: 1,
    totalParticleCount: 9,
    computeBudget: { schema: 'test-budget', workersPerScale: 1, totalParticleCount: 9 },
    reason: 'unit-particle-resize'
  });
  await orchestrator.whenIdle();
  const carriedStatus = orchestrator.getStatus();
  assert.equal(carriedStatus.peercompute.lastResize.reason, 'unit-particle-resize');
  assert.equal(carriedStatus.peercompute.lastResize.reusedShardCount, 0);
  assert.ok(carriedStatus.peercompute.lastResize.carriedForwardShardCount >= 1);
  assert.ok(carriedStatus.peercompute.lastResize.carriedForwardRecordShardCount >= 1);
  assert.ok(carriedStatus.peercompute.lastResize.resizeAuditSummary.auditedShardCount >= 1);
  assert.equal(carriedStatus.peercompute.lastResize.resizeAuditSummary.maxPositionDelta, 0);
  assert.equal(carriedStatus.peercompute.lastResize.resizeAuditSummary.maxVelocityDelta, 0);
  assert.ok(carriedStatus.peercompute.lastResize.resizeAuditSummary.addedRecords >= 1);
  assert.ok(Number.isFinite(carriedStatus.peercompute.lastResize.resizeAuditSummary.massProxyDelta));
  assert.ok(Number.isFinite(carriedStatus.peercompute.lastResize.resizeAuditSummary.maxAbsMassProxyDelta));
  assert.equal(carriedStatus.peercompute.lastResize.resizeAuditSummary.massProxySource, 'record-scale');
  assert.equal(carriedStatus.peercompute.lastResize.resizeAuditSummary.momentumMode, 'scale-weighted');
  assert.ok(carriedStatus.peercompute.lastResize.resizeCorrectionSummary.correctedShardCount >= 1);
  assert.ok(carriedStatus.peercompute.lastResize.resizeCorrectionSummary.appliedShardCount >= 1);
  assert.ok(carriedStatus.peercompute.lastResize.resizeCorrectionSummary.massConservedShardCount >= 1);
  assert.equal(carriedStatus.peercompute.lastResize.resizeCorrectionSummary.massConservationMode, 'all-record-scale');
  assert.ok(carriedStatus.peercompute.lastResize.resizeCorrectionSummary.mutableMassProxy > 0);
  assert.ok(Number.isFinite(carriedStatus.peercompute.lastResize.resizeCorrectionSummary.maxAbsMassProxyDeltaBefore));
  assert.ok(Number.isFinite(carriedStatus.peercompute.lastResize.resizeCorrectionSummary.maxAbsMassProxyDeltaAfter));
  assert.ok(Number.isFinite(carriedStatus.peercompute.lastResize.resizeCorrectionSummary.maxAbsMassProxyDelta));
  assert.ok(
    carriedStatus.peercompute.lastResize.resizeCorrectionSummary.maxAbsMassProxyDeltaAfter
      <= carriedStatus.peercompute.lastResize.resizeCorrectionSummary.maxAbsMassProxyDeltaBefore + 1e-5
  );
  assert.equal(carriedStatus.peercompute.lastResize.resizeCorrectionSummary.massProxySource, 'record-scale');
  assert.equal(carriedStatus.peercompute.lastResize.resizeCorrectionSummary.momentumMode, 'scale-weighted');
  assert.ok(
    carriedStatus.peercompute.lastResize.resizeCorrectionSummary.maxAbsMomentumDeltaAfter
      <= carriedStatus.peercompute.lastResize.resizeCorrectionSummary.maxAbsMomentumDeltaBefore + 1e-5
  );
  assert.ok(
    carriedStatus.peercompute.lastResize.resizeCorrectionSummary.maxAbsKineticEnergyDeltaAfter
      <= carriedStatus.peercompute.lastResize.resizeCorrectionSummary.maxAbsKineticEnergyDeltaBefore + 1e-5
  );
  assert.equal(orchestrator.lastSnapshot.count, 9);
  assert.deepEqual(
    Array.from(orchestrator.lastSnapshot.positions.slice(0, carriedBefore.length)),
    Array.from(carriedBefore)
  );
  const carriedRecordsAfter = orchestrator.layerPools[0].shards[0].runtime.lastSnapshot.particleRecords
    .slice(0, carriedRecordsBefore.length);
  for (let offset = 0; offset < carriedRecordsBefore.length; offset += WEBGPU_SNAPSHOT_RECORD_FLOATS) {
    for (let component = 0; component < 7; component += 1) {
      assert.equal(carriedRecordsAfter[offset + component], carriedRecordsBefore[offset + component]);
    }
  }
});
