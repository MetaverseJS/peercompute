export const ULG_FIXTURE_SOURCE = 'peercompute.tests.fixtures.ulgServiceFixtures';
export const ULG_SERVICE_CONTRACT_SCHEMA = 'peercompute.ulg.service-contract.fixture.v0';
export const ULG_SERVICE_TELEMETRY_SCHEMA = 'peercompute.ulg.service-telemetry.fixture.v0';
export const ULG_SERVICE_TASK_RESULT_SCHEMA = 'peercompute.ulg.service-task-result.fixture.v0';
export const ULG_RUNTIME_MANIFEST_SCHEMA = 'peercompute.ulg.runtime-manifest.v0';
export const ULG_LAW_TASK_CAPSULE_SCHEMA = 'peercompute.ulg.law-task-capsule.v0';
export const ULG_QUANTUM_TASK_CAPSULE_SCHEMA = 'peercompute.ulg.quantum-task-capsule.v0';
export const ULG_KERNEL_PASS_SPEC_SCHEMA = 'peercompute.ulg.kernel-pass-spec.v0';
export const ULG_PASS_DAG_SCHEMA = 'peercompute.ulg.worker-pass-dag.v0';
export const ULG_COMPACT_DELTA_SCHEMA = 'peercompute.ulg.compact-delta.v0';
export const ULG_INVARIANT_REPORT_SCHEMA = 'peercompute.ulg.invariant-report.v0';

const ZERO_HASH = 'sha256:00000000';

export function cloneUlgFixture(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export const ULG_SERVICE_CONTRACT_FIXTURE = Object.freeze({
  schema: ULG_SERVICE_CONTRACT_SCHEMA,
  specVersion: '0.4',
  fixtureSource: ULG_FIXTURE_SOURCE,
  runtimeDependency: 'none',
  runtimeManifestSchema: ULG_RUNTIME_MANIFEST_SCHEMA,
  taskCapsuleSchemas: [
    ULG_LAW_TASK_CAPSULE_SCHEMA,
    ULG_QUANTUM_TASK_CAPSULE_SCHEMA
  ],
  resultSchemas: [
    ULG_COMPACT_DELTA_SCHEMA,
    ULG_INVARIANT_REPORT_SCHEMA
  ],
  liveBackendPolicy: 'webgpu-only-no-cpu-fallback',
  stateExchangePolicy: 'hashes-deltas-and-provenance-only'
});

export const ESHKOL_ULG_SERVICE_MANIFEST = Object.freeze({
  serviceId: 'eshkol-ulg-fixture',
  version: '0.4.0-fixture',
  runtime: 'js',
  entry: {
    workerModule: '/peercompute-fixtures/ulg/eshkol-service-host.js',
    adapter: 'worker-supervisor-fixture'
  },
  childWorkers: {
    allowed: true,
    maxChildren: 2,
    allowedModules: ['/peercompute-fixtures/ulg/eshkol-law-pass-worker.js'],
    sameOriginOnly: false
  },
  capabilities: [
    'ulg.law-task.execute',
    'ulg.material-closure.derive'
  ],
  taskKinds: [
    'eshkol.ulg.law-task.execute',
    ULG_LAW_TASK_CAPSULE_SCHEMA
  ],
  abi: {
    specVersion: '0.4',
    runtimeManifestSchema: ULG_RUNTIME_MANIFEST_SCHEMA,
    inputCapsuleSchema: ULG_LAW_TASK_CAPSULE_SCHEMA,
    outputDeltaSchema: ULG_COMPACT_DELTA_SCHEMA,
    supportedDTypes: ['f32'],
    stateChannelSchemas: ['peercompute.ulg.state-channel-decl.v0']
  },
  contract: ULG_SERVICE_CONTRACT_FIXTURE,
  validation: {
    requiresRuntimeManifest: true,
    requiresPassDag: true,
    liveBackendPolicy: 'webgpu-only-no-cpu-fallback'
  },
  metadata: {
    fixture: true,
    fixtureSource: ULG_FIXTURE_SOURCE,
    domain: 'eshkol',
    ulgContract: ULG_SERVICE_CONTRACT_FIXTURE
  }
});

export const MOONLAB_ULG_SERVICE_MANIFEST = Object.freeze({
  serviceId: 'moonlab-ulg-fixture',
  version: '0.4.0-fixture',
  runtime: 'js',
  entry: {
    workerModule: '/peercompute-fixtures/ulg/moonlab-service-host.js',
    adapter: 'worker-supervisor-fixture'
  },
  childWorkers: {
    allowed: true,
    maxChildren: 1,
    allowedModules: ['/peercompute-fixtures/ulg/moonlab-quantum-worker.js'],
    sameOriginOnly: false
  },
  capabilities: [
    'ulg.quantum-state.solve',
    'ulg.quantum-response.preview'
  ],
  taskKinds: [
    'moonlab.ulg.quantum-task.solve',
    ULG_QUANTUM_TASK_CAPSULE_SCHEMA
  ],
  abi: {
    specVersion: '0.4',
    runtimeManifestSchema: ULG_RUNTIME_MANIFEST_SCHEMA,
    inputCapsuleSchema: ULG_QUANTUM_TASK_CAPSULE_SCHEMA,
    outputDeltaSchema: ULG_COMPACT_DELTA_SCHEMA,
    supportedDTypes: ['f32'],
    stateChannelSchemas: ['peercompute.ulg.quantum-state-result.v0']
  },
  contract: ULG_SERVICE_CONTRACT_FIXTURE,
  validation: {
    requiresRuntimeManifest: true,
    requiresHamiltonian: true,
    liveBackendPolicy: 'webgpu-only-no-cpu-fallback'
  },
  metadata: {
    fixture: true,
    fixtureSource: ULG_FIXTURE_SOURCE,
    domain: 'moonlab',
    ulgContract: ULG_SERVICE_CONTRACT_FIXTURE
  }
});

export const ESHKOL_LAW_TASK_CAPSULE_FIXTURE = Object.freeze({
  schema: ULG_LAW_TASK_CAPSULE_SCHEMA,
  taskId: 'lawtask:eshkol-fixture:0001',
  graphId: 'ulg-fixture-graph',
  domainId: 'molecular-material',
  scaleBand: 'molecular',
  timestep: 42,
  dt: 0.001,
  passPlan: [
    {
      schema: ULG_KERNEL_PASS_SPEC_SCHEMA,
      id: 'fixture-material-closure-pass',
      backend: 'webgpu',
      kernel: 'eshkol.fixture.materialClosure',
      dispatch: { x: 1, y: 1, z: 1 },
      reads: [{ binding: 0, stateRef: 'hot:molecular/atoms', dtype: 'f32' }],
      writes: [{ binding: 1, stateRef: 'warm:closures/material', dtype: 'f32' }],
      barriers: [],
      validation: { ok: true, status: 'ready' }
    }
  ],
  inputRefs: [{ stateId: 'hot:molecular/atoms', hash: 'sha256:eshkol-input' }],
  outputRefs: [{ stateId: 'warm:closures/material', hash: ZERO_HASH }],
  closureRefs: [{ closureId: 'closure:material-proxy', hash: 'sha256:closure-proxy' }],
  boundaryRefs: [{ stateId: 'warm:boundary/environment', hash: 'sha256:boundary' }],
  unitSystemHash: 'sha256:si-units-fixture',
  lawGraphHash: 'sha256:ulg-law-graph-fixture',
  closureProvenanceHash: 'sha256:closure-provenance-fixture',
  inputStateHash: 'sha256:eshkol-input',
  seed: 'ulg-fixture-seed-eshkol',
  tolerance: {
    absolute: 1e-5,
    relative: 1e-4,
    invariantDrift: 1e-4,
    closureUncertainty: 0.05
  },
  validation: {
    status: 'ready',
    liveBackendPolicy: 'webgpu-only-no-cpu-fallback'
  },
  commitPolicy: 'local_only'
});

export const MOONLAB_QUANTUM_TASK_CAPSULE_FIXTURE = Object.freeze({
  schema: ULG_QUANTUM_TASK_CAPSULE_SCHEMA,
  taskId: 'qtask:moonlab-fixture:0001',
  regionId: 'orbital',
  hamiltonian: {
    schema: 'peercompute.ulg.hamiltonian-spec.v0',
    id: 'hamiltonian:screened-hydrogen-fixture',
    hamiltonianHash: 'sha256:moonlab-hamiltonian',
    basis: 'radial-grid-fixture',
    potential: 'screened-coulomb-fixture'
  },
  requestedOutputs: [
    'peercompute.ulg.quantum-state-result.v0',
    'peercompute.ulg.derived-material-closure.v0'
  ],
  targetClosureKinds: ['material-response', 'quantum-statistical-bridge'],
  maxWallTimeMs: 12,
  backendPreference: ['webgpu'],
  inputPatchHash: 'sha256:moonlab-input',
  convergenceTarget: {
    residual: 1e-4,
    maxIterations: 8
  },
  commitPolicy: 'cache_only',
  validation: {
    status: 'ready',
    blockedBackends: [],
    liveBackendPolicy: 'webgpu-only-no-cpu-fallback'
  }
});

export const ULG_RUNTIME_MANIFEST_FIXTURE = Object.freeze({
  schema: ULG_RUNTIME_MANIFEST_SCHEMA,
  modelId: 'peercompute-ulg-service-contract-fixture-v0',
  specVersion: '0.4',
  status: 'proxy-runtime-ready-scientific-blocked',
  activeLayerId: 'molecular',
  liveBackendPolicy: 'webgpu-only-no-cpu-fallback',
  passDag: {
    schema: ULG_PASS_DAG_SCHEMA,
    status: 'proxy-pass-dag-ready',
    passCount: 1,
    webgpuPassCount: 1,
    passes: ESHKOL_LAW_TASK_CAPSULE_FIXTURE.passPlan
  },
  lawTaskCapsule: ESHKOL_LAW_TASK_CAPSULE_FIXTURE,
  quantumTaskCapsule: MOONLAB_QUANTUM_TASK_CAPSULE_FIXTURE,
  compactDelta: {
    schema: ULG_COMPACT_DELTA_SCHEMA,
    deltaHash: 'sha256:ulg-fixture-delta',
    stateRefs: ['warm:closures/material']
  }
});

export function createUlgServiceFixtureManifests() {
  return [
    cloneUlgFixture(ESHKOL_ULG_SERVICE_MANIFEST),
    cloneUlgFixture(MOONLAB_ULG_SERVICE_MANIFEST)
  ];
}

export function createUlgServiceFixtureTasks() {
  return {
    eshkol: {
      serviceId: ESHKOL_ULG_SERVICE_MANIFEST.serviceId,
      taskKind: 'eshkol.ulg.law-task.execute',
      taskId: ESHKOL_LAW_TASK_CAPSULE_FIXTURE.taskId,
      rootTaskId: 'root:ulg:eshkol:fixture',
      capsule: cloneUlgFixture(ESHKOL_LAW_TASK_CAPSULE_FIXTURE),
      runtimeManifest: cloneUlgFixture(ULG_RUNTIME_MANIFEST_FIXTURE),
      resources: { childWorkers: 1, memoryBytes: 8 * 1024 * 1024 }
    },
    moonlab: {
      serviceId: MOONLAB_ULG_SERVICE_MANIFEST.serviceId,
      taskKind: 'moonlab.ulg.quantum-task.solve',
      taskId: MOONLAB_QUANTUM_TASK_CAPSULE_FIXTURE.taskId,
      rootTaskId: 'root:ulg:moonlab:fixture',
      capsule: cloneUlgFixture(MOONLAB_QUANTUM_TASK_CAPSULE_FIXTURE),
      runtimeManifest: cloneUlgFixture(ULG_RUNTIME_MANIFEST_FIXTURE),
      resources: { childWorkers: 1, memoryBytes: 16 * 1024 * 1024 }
    }
  };
}
