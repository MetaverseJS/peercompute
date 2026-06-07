import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';
import {
  CHILD_WORKER_LEASE_SCHEMA,
  COMPUTE_MANAGER_SERVICE_ADAPTER_SCHEMA,
  COMPUTE_SERVICE_MANIFEST_SCHEMA,
  COMPUTE_SERVICE_REGISTRY_SCHEMA,
  ComputeServiceRegistry,
  ChildWorkerLeaseManager,
  ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA,
  ULG_DISPATCH_SERVICE_ARTIFACT_SCHEMA,
  ULG_DISPATCH_SERVICE_HANDLER_CONTEXT_SCHEMA,
  ULG_DISPATCH_SERVICE_RESULT_SCHEMA,
  ULG_DISPATCH_SERVICE_TELEMETRY_SCHEMA,
  ULG_ARTIFACT_RESULT_SCHEMA,
  ULG_ARTIFACT_SUMMARY_SCHEMA,
  ULG_DEMO_HANDOFF_ADAPTER_SCHEMA,
  ULG_DEMO_HANDOFF_SCHEMA,
  ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA,
  ULG_HANDOFF_SERVICE_ADAPTER_SCHEMA,
  ULG_HANDOFF_SERVICE_DISPATCH_PLAN_SCHEMA,
  ULG_HANDOFF_SERVICE_DISPATCH_RESULT_SCHEMA,
  ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA,
  ULG_HANDOFF_SERVICE_RESULT_SCHEMA,
  ULG_HANDOFF_SERVICE_TASK_SCHEMA,
  ULG_HANDOFF_TRANSFER_MANIFEST_SCHEMA,
  ULG_HANDOFF_SUPERVISOR_EXECUTOR_SCHEMA,
  ULG_HANDOFF_SUPERVISOR_SERVICE_SUMMARY_SCHEMA,
  MOONLAB_WEBGPU_COMPLEX64_PARITY_SCOPE_SCHEMA,
  ULG_MAGNETAR_DIPOLE_ISING_CALIBRATION_SCHEMA,
  ULG_QUANTUM_RESPONSE_DESCRIPTOR_SCHEMA,
  ULG_QUANTUM_RESPONSE_PARITY_SCHEMA,
  ULG_SERVICE_CONTRACT_ADAPTER_SCHEMA,
  ULG_TASK_CAPSULE_ADAPTER_SCHEMA,
  WORKER_SUPERVISOR_TELEMETRY_SCHEMA,
  WorkerSupervisor,
  UlgDispatchServiceHost,
  UlgHandoffServiceHost,
  adaptUlgV05ComputeServiceManifest,
  adaptUlgV05TaskCapsule,
  createComputeManagerServiceFactory,
  createUlgDispatchServiceManifests,
  createUlgHandoffServiceDispatchPlan,
  createUlgHandoffServiceEnvelope,
  createUlgHandoffServiceManifest,
  createUlgHandoffSupervisorServiceExecutor,
  createUlgV05ArtifactResult,
  ESHKOL_MAGNETAR_CLOSURE_DESCRIPTOR_SCHEMA,
  ESHKOL_PRODUCTION_HANDLER_BOUNDARY_SCHEMA,
  normalizeUlgDemoHandoff,
  normalizeComputeServiceManifest,
  summarizeUlgHandoffSupervisorServiceResult,
  summarizeUlgArtifact
} from '../../src/peercompute/serviceOrchestration/index.js';
import {
  ULG_COMPACT_DELTA_SCHEMA,
  ULG_FIXTURE_SOURCE,
  ULG_LAW_TASK_CAPSULE_SCHEMA,
  ULG_QUANTUM_TASK_CAPSULE_SCHEMA,
  ULG_RUNTIME_MANIFEST_SCHEMA,
  ULG_SERVICE_CONTRACT_SCHEMA,
  ULG_SERVICE_TASK_RESULT_SCHEMA,
  ULG_SERVICE_TELEMETRY_SCHEMA,
  createUlgServiceFixtureManifests,
  createUlgServiceFixtureTasks
} from '../fixtures/ulgServiceFixtures.js';

const MOONLAB_REFERENCE_CONTRACT_HASH = 'sha256:fixture-moonlab-reference-001';
const ESHKOL_DESCRIPTOR_INPUT_IDS = ['magnetar-state-vector', 'closure-control-vector'];
const ESHKOL_DESCRIPTOR_OUTPUT_IDS = ['magnetar-closure-update', 'closure-residual'];
const ESHKOL_PRODUCTION_REQUIRED_NON_STUB_IMPORTS = Object.freeze([
  'eshkol_is_bignum_tagged',
  'eshkol_rational_to_double',
  'eshkol_bignum_to_double',
  'eshkol_bignum_binary_tagged',
  'eshkol_is_rational_tagged_ptr',
  'eshkol_rational_binary_tagged_ptr',
  'eshkol_bignum_from_overflow',
  'arena_allocate',
  'arena_allocate_vector_with_header',
  'eshkol_shapes_equal',
  'arena_allocate_tensor_with_header',
  'eshkol_broadcast_elementwise_f64',
  'arena_allocate_ad_node_with_header',
  'arena_tape_add_node',
  'eshkol_make_exception_with_header',
  'eshkol_raise',
  'eshkol_intern_symbol_lookup',
  'arena_allocate_cons_with_header',
  'arena_tagged_cons_set_ptr',
  'arena_tagged_cons_set_int64',
  'arena_tagged_cons_set_double',
  'arena_tagged_cons_set_null',
  'eshkol_lambda_registry_add'
]);
const ESHKOL_PRODUCTION_READINESS_REQUIREMENTS = Object.freeze([
  'production-magnetar-handler-implementation',
  'non-stub-host-runtime-imports',
  'validated-f64-tensor-memory-imports',
  'full-physics-validation-pass'
]);
const ESHKOL_PRODUCTION_BLOCKERS = Object.freeze([
  'production-magnetar-handler-not-implemented',
  'full-physics-validation-not-run'
]);
const ESHKOL_PRODUCTION_HANDLER_CONTRACT_REQUIRED_EVIDENCE = Object.freeze([
  'content-addressed-wasm-module',
  'entry-export-main-signature-i32-i32-to-i32',
  'production-candidate-host-imports',
  'validated-f64-tensor-memory-binding',
  'production-candidate-runtime-probe',
  'production-magnetar-handler-implementation',
  'production-handler-runtime-execution',
  'full-physics-validation-pass'
]);
const ESHKOL_PRODUCTION_DISPATCH_CHECKS = Object.freeze([
  'artifact-module-sha256-matches-module-ref',
  'entry-export-main-signature-i32-i32-to-i32',
  'production-handler-contract-declared',
  'non-stub-host-imports-present',
  'f64-tensor-memory-binding-validated',
  'production-candidate-runtime-probe-passed',
  'runtime-smoke-stubs-rejected-for-production',
  'handler-ready-flag-true',
  'runtime-execution-flag-true',
  'full-physics-validation-evidence-present'
]);
const ESHKOL_PRODUCTION_DISPATCH_PASSED_CHECKS = Object.freeze([
  'artifact-module-sha256-matches-module-ref',
  'entry-export-main-signature-i32-i32-to-i32',
  'production-handler-contract-declared',
  'non-stub-host-imports-present',
  'f64-tensor-memory-binding-validated',
  'production-candidate-runtime-probe-passed',
  'runtime-smoke-stubs-rejected-for-production'
]);
const ESHKOL_PRODUCTION_DISPATCH_BLOCKED_CHECKS = Object.freeze([
  'handler-ready-flag-true',
  'runtime-execution-flag-true',
  'full-physics-validation-evidence-present'
]);
const ESHKOL_IMPORTED_HOST_IMPORTS_SUMMARY = Object.freeze({
  closureHostImportsModule: '/service-assets/eshkol/closures/magnetar-closure/eshkol-host-imports.js',
  closureHostImportsAssetStatus: 'ready',
  closureHostImportsFactoryStatus: 'ready',
  closureHostImportsFactoryReady: true,
  closureHostImportsRequirementsSchema: 'eshkol.ulg.production-host-import-candidate.v0',
  closureHostImportsRequirementsStatus: 'production-candidate-runtime-imports-implemented',
  closureHostImportsRuntimeScope: 'production-candidate-host-imports',
  closureHostImportsImplementationStatus: 'production-candidate-runtime-imports-present',
  closureHostImportsRequiredNonStubImportCount: 23
});
const MINIMAL_WASM_MAIN_EXPORT_BYTES = [
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
  0x01, 0x04, 0x01, 0x60, 0x00, 0x00,
  0x03, 0x02, 0x01, 0x00,
  0x07, 0x08, 0x01, 0x04, 0x6d, 0x61, 0x69, 0x6e, 0x00, 0x00,
  0x0a, 0x04, 0x01, 0x02, 0x00, 0x0b
];
const MINIMAL_WASM_MAIN_RETURN_ZERO_BYTES = [
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
  0x01, 0x05, 0x01, 0x60, 0x00, 0x01, 0x7f,
  0x03, 0x02, 0x01, 0x00,
  0x07, 0x08, 0x01, 0x04, 0x6d, 0x61, 0x69, 0x6e, 0x00, 0x00,
  0x0a, 0x06, 0x01, 0x04, 0x00, 0x41, 0x00, 0x0b
];
const ULG_STAGED_ESHKOL_MAGNETAR_ARTIFACT_PATH =
  '/home/cos/projects/ulg/public/service-assets/eshkol/closures/magnetar-closure/magnetar-closure.ulg.json';
const ULG_STAGED_ESHKOL_MAGNETAR_WASM_PATH =
  '/home/cos/projects/ulg/public/service-assets/eshkol/closures/magnetar-closure/magnetar-closure.wasm';

function createMoonLabWebGpuComplex64ParityScope(overrides = {}) {
  return {
    schema: MOONLAB_WEBGPU_COMPLEX64_PARITY_SCOPE_SCHEMA,
    status: 'scope-ready-backend-unavailable',
    contractReady: true,
    contractValidation: {
      valid: true
    },
    reducedFixtureOnly: true,
    backendAvailable: false,
    webgpuParity: {
      executed: false,
      passed: false
    },
    complex64Preflight: {
      passed: true
    },
    fidelityRuntimeScope: {
      schema: 'ulg.magnetar.fidelity-runtime-scope.v0',
      fidelityTier: 'reduced-calibrated-runtime-fixture',
      runtimeScope: 'moonlab-webgpu-complex64-no-backend-scope',
      readinessClaim: 'complex64-contract-preflight-only',
      fullFidelityMagnetarSimulation: false,
      fullPhysicsValidation: false
    },
    fullFidelityMagnetarSimulation: false,
    fullPhysicsValidation: false,
    blockers: [
      'browser-webgpu-adapter-unavailable',
      'native-webgpu-operation-coverage-not-yet-recorded',
      'browser-webgpu-kernel-parity-not-executed'
    ],
    ...overrides
  };
}

function createMoonLabBrowserWebGpuComplex64ParityScope(overrides = {}) {
  return {
    schema: MOONLAB_WEBGPU_COMPLEX64_PARITY_SCOPE_SCHEMA,
    status: 'scope-ready-backend-detected',
    contractReady: true,
    contractValidation: {
      valid: true
    },
    reducedFixtureOnly: true,
    backendAvailable: true,
    requireBackend: true,
    browserBackendPreflight: {
      schema: 'moonlab.webgpu.complex64-browser-backend-preflight.v0',
      probeKind: 'browser-webgpu-adapter-device-preflight',
      runtime: 'browser-harness',
      stage: 'device-acquired',
      navigatorGpuAvailable: true,
      adapterAvailable: true,
      deviceAcquired: true
    },
    webgpuParity: {
      executed: true,
      passed: true,
      maxProbabilityAbsDiff: 0,
      tolerance: 0.00001
    },
    browserKernelProbe: {
      schema: 'moonlab.webgpu.complex64-probability-kernel-probe.v0',
      probeKind: 'browser-webgpu-complex64-probability-kernel',
      kernel: 'compute_probabilities',
      executed: true,
      passed: true,
      coveredNativeOperations: ['compute_probabilities'],
      maxProbabilityAbsDiff: 0,
      tolerance: 0.00001
    },
    browserNativeOperationProbe: {
      schema: 'moonlab.webgpu.complex64-native-operation-probe.v0',
      probeKind: 'browser-webgpu-complex64-native-operation-probe',
      executed: true,
      passed: true,
      coveredNativeOperations: ['hadamard', 'pauli_x', 'pauli_z', 'cnot'],
      maxAmplitudeAbsDiff: 2.9802322387695312e-8,
      tolerance: 0.00001,
      operationResults: [
        { operation: 'hadamard', executed: true, passed: true, covered: true, maxAmplitudeAbsDiff: 2.9802322387695312e-8, tolerance: 0.00001 },
        { operation: 'pauli_x', executed: true, passed: true, covered: true, maxAmplitudeAbsDiff: 0, tolerance: 0.00001 },
        { operation: 'pauli_z', executed: true, passed: true, covered: true, maxAmplitudeAbsDiff: 0, tolerance: 0.00001 },
        { operation: 'cnot', executed: true, passed: true, covered: true, maxAmplitudeAbsDiff: 0, tolerance: 0.00001 }
      ]
    },
    coverage: {
      nativeWebGpu: [
        { operation: 'hadamard', covered: true, required: true, fallbackAllowed: false, status: 'covered-by-browser-webgpu' },
        { operation: 'pauli_x', covered: true, required: true, fallbackAllowed: false, status: 'covered-by-browser-webgpu' },
        { operation: 'pauli_z', covered: true, required: true, fallbackAllowed: false, status: 'covered-by-browser-webgpu' },
        { operation: 'cnot', covered: true, required: true, fallbackAllowed: false, status: 'covered-by-browser-webgpu' },
        { operation: 'compute_probabilities', covered: true, required: true, fallbackAllowed: false, status: 'covered-by-browser-webgpu' }
      ]
    },
    complex64Preflight: {
      passed: true
    },
    fidelityRuntimeScope: {
      schema: 'ulg.magnetar.fidelity-runtime-scope.v0',
      fidelityTier: 'reduced-calibrated-runtime-fixture',
      runtimeScope: 'browser-webgpu-complex64-reduced-fixture-parity',
      readinessClaim: 'integration-tolerance-gate-only',
      fullFidelityMagnetarSimulation: false,
      fullPhysicsValidation: false
    },
    fullFidelityMagnetarSimulation: false,
    fullPhysicsValidation: false,
    blockers: [],
    ...overrides
  };
}

function createEshkolProductionHandlerBoundary(overrides = {}) {
  return {
    schema: ESHKOL_PRODUCTION_HANDLER_BOUNDARY_SCHEMA,
    status: 'production-handler-boundary-declared-not-executed',
    boundaryId: 'eshkol:magnetar-production-handler-boundary:v0',
    handlerId: 'eshkol:magnetar-closure:main:v0',
    handlerKind: 'wasm-export-tensor-closure',
    dispatchSchema: 'peercompute.ulg.dispatch-service-handler-context.v0',
    handlerProtocol: 'peercompute.ulg.dispatch-service-handler-context.v0',
    runtimeAbi: 'wasm32-unknown-unknown:eshkol-host-imports-production-candidate-v0',
    tensorMemoryModel: 'host-managed-linear-f64',
    handlerReady: false,
    runtimeExecution: false,
    productionHandlerContract: {
      schema: 'eshkol.ulg.production-handler-contract.v0',
      status: 'declared-not-implemented',
      handlerId: 'eshkol:magnetar-closure:main:v0',
      dispatchSchema: 'peercompute.ulg.dispatch-service-handler-context.v0',
      entryExport: 'main',
      runtimeAbi: 'wasm32-unknown-unknown:eshkol-host-imports-production-candidate-v0',
      tensorMemoryModel: 'host-managed-linear-f64',
      inputTensorIds: [...ESHKOL_DESCRIPTOR_INPUT_IDS],
      outputTensorIds: [...ESHKOL_DESCRIPTOR_OUTPUT_IDS],
      invocation: {
        moduleSource: 'artifact.execution.module',
        entryExport: 'main',
        argumentMode: 'linear-memory-offsets',
        parameterTypes: ['i32', 'i32'],
        resultTypes: ['i32'],
        inputOffsetParam: 0,
        outputOffsetParam: 1,
        expectedReturn: 0
      },
      requiredEvidence: [...ESHKOL_PRODUCTION_HANDLER_CONTRACT_REQUIRED_EVIDENCE],
      blockedBy: [...ESHKOL_PRODUCTION_BLOCKERS]
    },
    hostImports: {
      source: 'bundle.hostImports',
      required: true,
      factory: 'createEshkolHostImportObject',
      runtimeScope: 'production-candidate-host-imports',
      implementationStatus: 'production-candidate-runtime-imports-present',
      productionCandidate: {
        schema: 'eshkol.ulg.production-host-import-candidate.v0',
        status: 'production-candidate-runtime-imports-implemented',
        factory: 'createEshkolHostImportObject',
        smokeRuntimeAbi: 'wasm32-unknown-unknown:eshkol-host-imports-smoke-v0',
        productionRuntimeAbi: 'wasm32-unknown-unknown:eshkol-host-imports-production-candidate-v0',
        runtimeScope: 'production-candidate-host-imports',
        implementationStatus: 'production-candidate-runtime-imports-present',
        runtimeSmokeStubsAllowed: false,
        tensorMemoryImports: ['ulg_read_f64', 'ulg_write_f64'],
        requiredNonStubImports: [...ESHKOL_PRODUCTION_REQUIRED_NON_STUB_IMPORTS],
        readinessRequires: [...ESHKOL_PRODUCTION_READINESS_REQUIREMENTS],
        blockedBy: [...ESHKOL_PRODUCTION_BLOCKERS]
      }
    },
    productionCandidateRuntimeProbe: {
      schema: 'eshkol.ulg.production-candidate-runtime-probe.v0',
      status: 'production-candidate-runtime-smoke-passed',
      runtimeScope: 'production-candidate-host-imports',
      implementationStatus: 'production-candidate-runtime-imports-present',
      executionClaim: 'production-candidate-host-import-runtime-smoke-only',
      entryExport: 'main',
      entryArgs: [131072, 131136],
      expectedEntryResult: 0,
      changedBytesInDeclaredTensorRange: 64,
      outputTensorsProducedByEntryExport: true,
      productionHandlerReady: false,
      productionHandlerRuntimeExecution: false,
      scientificValidation: false,
      fullPhysicsValidation: false,
      fullFidelityMagnetarSimulation: false,
      hostImportOptions: {
        factory: 'createEshkolHostImportObject',
        productionCandidateRuntimeImports: true,
        runtimeSmokeStubs: false,
        f64TensorMemoryImports: true
      },
      hostImportCallCounts: {
        ulg_read_f64: 12,
        ulg_write_f64: 9
      },
      blocker: 'production-candidate-runtime-smoke-only-production-handler-not-ready'
    },
    dispatchPreflight: {
      schema: 'eshkol.ulg.production-handler-dispatch-preflight.v0',
      status: 'blocked',
      ready: false,
      dispatchSchema: 'peercompute.ulg.dispatch-service-handler-context.v0',
      entryExport: 'main',
      currentRuntimeAbi: 'wasm32-unknown-unknown:eshkol-host-imports-production-candidate-v0',
      requiredRuntimeAbi: 'wasm32-unknown-unknown:eshkol-host-imports-production-candidate-v0',
      moduleContentAddressing: 'required',
      moduleSha256Field: 'artifact.execution.module.sha256',
      tensorMemoryBindingSource: 'validation.closureDescriptor.descriptorBinding.closureTensorRuntimeContract.linearMemoryBinding',
      hostImportsCandidateSource: 'productionHandlerBoundary.hostImports.productionCandidate',
      requiredChecks: [...ESHKOL_PRODUCTION_DISPATCH_CHECKS],
      rejectedRuntimeScopes: ['deterministic-runtime-smoke-stubs'],
      runtimeSmokeStubsAllowed: false,
      handlerReadyRequired: true,
      runtimeExecutionRequired: true,
      fullPhysicsValidationRequired: true,
      scientificValidationRequired: true,
      blockedBy: [...ESHKOL_PRODUCTION_BLOCKERS],
      checkResults: [
        {
          check: 'artifact-module-sha256-matches-module-ref',
          status: 'pass',
          ready: true,
          evidenceSource: 'artifact.execution.module.sha256'
        },
        {
          check: 'entry-export-main-signature-i32-i32-to-i32',
          status: 'pass',
          ready: true,
          evidenceSource: 'artifact.execution.entrySignature'
        },
        {
          check: 'production-handler-contract-declared',
          status: 'pass',
          ready: true,
          evidenceSource: 'productionHandlerBoundary.productionHandlerContract'
        },
        {
          check: 'non-stub-host-imports-present',
          status: 'pass',
          ready: true,
          evidenceSource: 'productionHandlerBoundary.hostImports',
          observed: {
            runtimeScope: 'production-candidate-host-imports',
            implementationStatus: 'production-candidate-runtime-imports-present',
            runtimeAbi: 'wasm32-unknown-unknown:eshkol-host-imports-production-candidate-v0',
            productionRuntimeAbi: 'wasm32-unknown-unknown:eshkol-host-imports-production-candidate-v0'
          }
        },
        {
          check: 'f64-tensor-memory-binding-validated',
          status: 'pass',
          ready: true,
          evidenceSource: 'productionHandlerBoundary.tensorMemoryBinding'
        },
        {
          check: 'production-candidate-runtime-probe-passed',
          status: 'pass',
          ready: true,
          evidenceSource: 'productionHandlerBoundary.productionCandidateRuntimeProbe'
        },
        {
          check: 'runtime-smoke-stubs-rejected-for-production',
          status: 'pass',
          ready: true,
          evidenceSource: 'productionHandlerBoundary.dispatchPreflight'
        },
        {
          check: 'handler-ready-flag-true',
          status: 'blocked',
          ready: false,
          evidenceSource: 'productionHandlerBoundary.handlerReady',
          blocker: 'production-magnetar-handler-not-implemented'
        },
        {
          check: 'runtime-execution-flag-true',
          status: 'blocked',
          ready: false,
          evidenceSource: 'productionHandlerBoundary.runtimeExecution',
          blocker: 'production-handler-runtime-execution-not-ready'
        },
        {
          check: 'full-physics-validation-evidence-present',
          status: 'blocked',
          ready: false,
          evidenceSource: 'productionHandlerBoundary.fullPhysicsValidation',
          blocker: 'full-physics-validation-not-run'
        }
      ],
      checkSummary: {
        schema: 'eshkol.ulg.production-handler-dispatch-preflight-check-summary.v0',
        status: 'blocked',
        ready: false,
        totalRequiredCheckCount: ESHKOL_PRODUCTION_DISPATCH_CHECKS.length,
        passedCount: ESHKOL_PRODUCTION_DISPATCH_PASSED_CHECKS.length,
        blockedCount: ESHKOL_PRODUCTION_DISPATCH_BLOCKED_CHECKS.length,
        passedChecks: [...ESHKOL_PRODUCTION_DISPATCH_PASSED_CHECKS],
        blockedChecks: [...ESHKOL_PRODUCTION_DISPATCH_BLOCKED_CHECKS]
      }
    },
    scientificValidation: false,
    fullPhysicsValidation: false,
    fullFidelityMagnetarSimulation: false,
    blockers: [...ESHKOL_PRODUCTION_BLOCKERS],
    ...overrides
  };
}

function createEshkolMagnetarDescriptorArtifact() {
  return {
    closureId: 'eshkol:magnetar-closure-descriptor',
    sourceService: 'eshkol',
    closureKind: 'magnetar-closure-descriptor-fixture',
    inputs: ESHKOL_DESCRIPTOR_INPUT_IDS.map((id) => ({ id, kind: 'tensor' })),
    outputs: ESHKOL_DESCRIPTOR_OUTPUT_IDS.map((id) => ({ id, kind: 'tensor' })),
    execution: {
      target: 'wasm32-unknown-unknown',
      serviceWorkerSafe: true,
      entryExport: 'main'
    },
    validity: {
      requiresJit: false,
      requiresEval: false,
      requiresDynamicCode: false,
      requiresNetwork: false
    },
    validation: {
      status: 'descriptor-only',
      closureDescriptor: {
        schema: ESHKOL_MAGNETAR_CLOSURE_DESCRIPTOR_SCHEMA,
        descriptorRole: 'magnetar-closure-contract-seed',
        entryExport: 'main',
        tensorContract: {
          inputIds: [...ESHKOL_DESCRIPTOR_INPUT_IDS],
          outputIds: [...ESHKOL_DESCRIPTOR_OUTPUT_IDS],
          coordinateSystem: 'normalized-radial-cell',
          interpolation: 'reduced-fixture-table-contract'
        },
        descriptorBinding: {
          schema: 'eshkol.ulg.magnetar-closure-descriptor-binding.v0',
          bindingId: 'eshkol:magnetar-closure-descriptor-binding:v0',
          handoffEnvelope: {
            schema: ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA,
            sourceSchema: ULG_DEMO_HANDOFF_SCHEMA,
            adapterSchema: ULG_DEMO_HANDOFF_ADAPTER_SCHEMA,
            transferManifestSchema: ULG_HANDOFF_TRANSFER_MANIFEST_SCHEMA,
            artifactKind: 'closure',
            sourceService: 'eshkol',
            contentAddressing: 'required',
            relaySafeTransfer: 'required'
          },
          ulgInterpolationTable: {
            schema: 'eshkol.ulg.magnetar-closure-interpolation-table.v0',
            id: 'ulg:magnetar-radial-cell-interpolation-table:v0',
            status: 'computed-fixture',
            tableVersion: 'v0',
            fixtureScope: 'reduced-smoke-fixture-not-magnetar-physics',
            scientificValidation: false,
            coordinateSystem: 'normalized-radial-cell',
            inputTensorIds: [...ESHKOL_DESCRIPTOR_INPUT_IDS],
            outputTensorIds: [...ESHKOL_DESCRIPTOR_OUTPUT_IDS],
            sampleCount: 4,
            sampleIds: [
              'moonlab:magnetosphere-mhd-reference',
              'moonlab:pic-kinetic-plasma-reference',
              'moonlab:radiation-transport-reference',
              'moonlab:relativistic-correction-reference'
            ],
            contentHash: 'sha256:82ca16463d7ffe1d170adb266be61c3959b22a6c352751e99f0f510738a14165',
            samples: [
              { id: 'moonlab:magnetosphere-mhd-reference' },
              { id: 'moonlab:pic-kinetic-plasma-reference' },
              { id: 'moonlab:radiation-transport-reference' },
              { id: 'moonlab:relativistic-correction-reference' }
            ]
          },
          moonlabNormalizedReferenceSuite: {
            schema: 'moonlab.magnetar.normalized-reference-suite.v0',
            assetId: 'moonlab:magnetar-reference-contracts:normalized-suite:v0',
            contentHash: 'sha256:87e078026a9c2233afcccfd5c13f4ceb5d46cd301eb51fa7d0c15ef106a8e029',
            ready: true,
            fidelityRuntimeScope: {
              schema: 'ulg.magnetar.fidelity-runtime-scope.v0',
              fidelityTier: 'reduced-calibrated-runtime-fixture',
              runtimeScope: 'reduced-scalar-reference-suite',
              readinessClaim: 'integration-tolerance-gate-only',
              reducedCalibratedRuntimeFixture: true,
              hostRuntimeSmokeFixture: false,
              fullFidelityMagnetarSimulation: false,
              fullPhysicsValidation: false,
              excludedPhysics: [
                'charge-conserving-pic',
                'spectral-angular-radiation-transport',
                'gr-or-grmhd-spacetime-solve',
                'full-resistive-mhd-or-force-free-magnetosphere',
                'validated-production-magnetar-closure'
              ]
            },
            referenceIds: [
              'magnetosphere-mhd-reference',
              'pic-kinetic-plasma-reference',
              'radiation-transport-reference',
              'relativistic-correction-reference'
            ],
            referenceFamilies: [
              'magnetosphere-mhd',
              'pic-kinetic-plasma',
              'radiation-transport',
              'relativistic-correction'
            ]
          },
          moonlabClosureSurfaceSampleIds: [
            'moonlab:magnetosphere-mhd-reference',
            'moonlab:pic-kinetic-plasma-reference',
            'moonlab:radiation-transport-reference',
            'moonlab:relativistic-correction-reference'
          ],
          peercomputeProductTopologyBinding: {
            schema: 'peercompute.multiscale.product-topology-binding.v0',
            bindingId: 'peercompute:magnetar-closure-product-topology:v0',
            topologyId: 'peercompute.multiscale.magnetar-reduced-product-topology.v0',
            inputTensorIds: [...ESHKOL_DESCRIPTOR_INPUT_IDS],
            outputTensorIds: [...ESHKOL_DESCRIPTOR_OUTPUT_IDS],
            status: 'descriptor-bound-not-executed',
            scientificValidation: false
          },
          closureTensorRuntimeContract: {
            schema: 'eshkol.ulg.magnetar-closure-tensor-runtime-contract.v0',
            contractId: 'eshkol:magnetar-closure-tensor-runtime-contract:v0',
            status: 'declared-fixture-contract',
            runtimeAbi: 'wasm32-unknown-unknown:eshkol-host-imports-production-candidate-v0',
            executionClaim: 'metadata-and-smoke-output-only',
            entryExport: 'main',
            tensorMemoryModel: 'host-managed-linear-f64',
            coordinateSystem: 'normalized-radial-cell',
            inputTensorIds: [...ESHKOL_DESCRIPTOR_INPUT_IDS],
            outputTensorIds: [...ESHKOL_DESCRIPTOR_OUTPUT_IDS],
            tensorDescriptors: {
              'magnetar-state-vector': {
                direction: 'input',
                dtype: 'f64',
                shape: [8],
                layout: 'dense-row-major',
                units: 'normalized',
                componentCount: 8,
                byteLength: 64
              },
              'closure-control-vector': {
                direction: 'input',
                dtype: 'f64',
                shape: [4],
                layout: 'dense-row-major',
                units: 'normalized',
                componentCount: 4,
                byteLength: 32
              },
              'magnetar-closure-update': {
                direction: 'output',
                dtype: 'f64',
                shape: [8],
                layout: 'dense-row-major',
                units: 'normalized delta',
                componentCount: 8,
                byteLength: 64
              },
              'closure-residual': {
                direction: 'output',
                dtype: 'f64',
                shape: [1],
                layout: 'dense-row-major',
                units: 'normalized',
                componentCount: 1,
                byteLength: 8
              }
            },
            interpolationTable: {
              id: 'ulg:magnetar-radial-cell-interpolation-table:v0',
              schema: 'eshkol.ulg.magnetar-closure-interpolation-table.v0',
              contentHash: 'sha256:82ca16463d7ffe1d170adb266be61c3959b22a6c352751e99f0f510738a14165',
              sampleCount: 4
            },
            sampleShapeValidation: {
              schema: 'eshkol.ulg.tensor-sample-shape-validation.v0',
              status: 'pass',
              validatedSampleCount: 4,
              validatedInputTensorIds: [...ESHKOL_DESCRIPTOR_INPUT_IDS],
              validatedOutputTensorIds: [...ESHKOL_DESCRIPTOR_OUTPUT_IDS],
              scientificValidation: false
            },
            contractHash: 'sha256:4b0d9c61ae83f1695978fd2f6b918bdbcab1ccca550b520c0467e7159c805d28',
            runtimeStatus: 'declared-not-executed',
            scientificValidation: false,
            fullPhysicsValidation: false
          },
          runtimeBinding: {
            schema: 'eshkol.ulg.magnetar-closure-runtime-binding.v0',
            runtimeStatus: 'declared-not-executed',
            derivativeStatus: 'declared-not-computed',
            scientificValidation: false
          },
          productionHandlerBoundary: createEshkolProductionHandlerBoundary()
        },
        scientificValidation: false
      }
    },
    contentHash: 'ulg:fixture-magnetar-descriptor-001'
  };
}

function assertEshkolProductionCandidateRuntimeProbeFields(source, prefix = 'eshkolProductionCandidateRuntimeProbe') {
  assert.equal(source[`${prefix}Schema`], 'eshkol.ulg.production-candidate-runtime-probe.v0');
  assert.equal(source[`${prefix}Status`], 'production-candidate-runtime-smoke-passed');
  assert.equal(source[`${prefix}Ready`], true);
  assert.equal(source[`${prefix}RuntimeScope`], 'production-candidate-host-imports');
  assert.equal(source[`${prefix}ExecutionClaim`], 'production-candidate-host-import-runtime-smoke-only');
  assert.deepEqual(source[`${prefix}EntryArgs`], [131072, 131136]);
  assert.equal(source[`${prefix}ExpectedEntryResult`], 0);
  assert.equal(source[`${prefix}ChangedBytesInDeclaredTensorRange`], 64);
  assert.equal(source[`${prefix}OutputTensorsProduced`], true);
  assert.equal(source[`${prefix}ProductionHandlerReady`], false);
  assert.equal(source[`${prefix}ProductionHandlerRuntimeExecution`], false);
  assert.equal(source[`${prefix}ScientificValidation`], false);
  assert.equal(source[`${prefix}FullPhysicsValidation`], false);
  assert.equal(source[`${prefix}FullFidelityMagnetarSimulation`], false);
  assert.equal(source[`${prefix}HostImportOptions`]?.factory, 'createEshkolHostImportObject');
  assert.equal(source[`${prefix}HostImportOptions`]?.productionCandidateRuntimeImports, true);
  assert.equal(source[`${prefix}HostImportOptions`]?.runtimeSmokeStubs, false);
  assert.equal(source[`${prefix}HostImportOptions`]?.f64TensorMemoryImports, true);
  assert.equal(source[`${prefix}HostImportCallCounts`]?.ulg_read_f64, 12);
  assert.equal(source[`${prefix}HostImportCallCounts`]?.ulg_write_f64, 9);
  assert.equal(
    source[`${prefix}Blocker`],
    'production-candidate-runtime-smoke-only-production-handler-not-ready'
  );
}

function assertEshkolProductionHandlerContractFields(source, prefix = 'eshkolProductionHandlerContract') {
  assert.equal(source[`${prefix}Schema`], 'eshkol.ulg.production-handler-contract.v0');
  assert.equal(source[`${prefix}Status`], 'declared-not-implemented');
  assert.equal(source[`${prefix}Declared`], true);
  assert.equal(source[`${prefix}HandlerId`], 'eshkol:magnetar-closure:main:v0');
  assert.equal(source[`${prefix}DispatchSchema`], 'peercompute.ulg.dispatch-service-handler-context.v0');
  assert.equal(source[`${prefix}EntryExport`], 'main');
  assert.equal(source[`${prefix}RuntimeAbi`], 'wasm32-unknown-unknown:eshkol-host-imports-production-candidate-v0');
  assert.equal(source[`${prefix}TensorMemoryModel`], 'host-managed-linear-f64');
  assert.deepEqual(source[`${prefix}InputTensorIds`], [...ESHKOL_DESCRIPTOR_INPUT_IDS]);
  assert.deepEqual(source[`${prefix}OutputTensorIds`], [...ESHKOL_DESCRIPTOR_OUTPUT_IDS]);
  assert.equal(source[`${prefix}InvocationModuleSource`], 'artifact.execution.module');
  assert.equal(source[`${prefix}InvocationEntryExport`], 'main');
  assert.equal(source[`${prefix}InvocationArgumentMode`], 'linear-memory-offsets');
  assert.deepEqual(source[`${prefix}InvocationParameterTypes`], ['i32', 'i32']);
  assert.deepEqual(source[`${prefix}InvocationResultTypes`], ['i32']);
  assert.equal(source[`${prefix}InvocationInputOffsetParam`], 0);
  assert.equal(source[`${prefix}InvocationOutputOffsetParam`], 1);
  assert.equal(source[`${prefix}InvocationExpectedReturn`], 0);
  assert.deepEqual(source[`${prefix}RequiredEvidence`], [...ESHKOL_PRODUCTION_HANDLER_CONTRACT_REQUIRED_EVIDENCE]);
  assert.equal(source[`${prefix}RequiredEvidenceCount`], ESHKOL_PRODUCTION_HANDLER_CONTRACT_REQUIRED_EVIDENCE.length);
  assert.deepEqual(source[`${prefix}BlockedBy`], [...ESHKOL_PRODUCTION_BLOCKERS]);
}

function serviceManifest(overrides = {}) {
  return {
    serviceId: 'eshkol',
    version: '0.1.0-test',
    runtime: 'js',
    entry: { workerModule: '/service.js' },
    childWorkers: {
      allowed: true,
      maxChildren: 2,
      allowedModules: ['/child.js'],
      sameOriginOnly: false
    },
    capabilities: ['ulg.closure.derive'],
    taskKinds: ['eshkol.closure.derive'],
    abi: {
      ulgIrVersion: '0.5',
      gpuAbiVersion: '0.5',
      supportedDTypes: ['f32']
    },
    validation: { requiresCpuReference: true },
    ...overrides
  };
}

class CompletingServiceHost {
  constructor(manifest) {
    this.manifest = manifest;
    this.listeners = {
      message: new Set(),
      error: new Set()
    };
    this.messages = [];
  }

  addEventListener(type, listener) {
    this.listeners[type]?.add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners[type]?.delete(listener);
  }

  postMessage(message) {
    this.messages.push(message);
    if (message.type === 'init') {
      this.workerId = message.workerId;
      this.emit({
        type: 'ready',
        workerId: message.workerId,
        serviceId: this.manifest.serviceId
      });
    }
    if (message.type === 'submit-task') {
      this.task = message.task;
      this.emit({
        type: 'task-status',
        rootTaskId: message.task.rootTaskId,
        status: 'requesting-lease',
        progress: 0,
        children: []
      });
      this.emit({
        type: 'lease-request',
        requestId: `${message.task.rootTaskId}:lease`,
        rootTaskId: message.task.rootTaskId,
        module: this.manifest.childWorkers.allowedModules[0],
        workerType: message.task.workerType,
        count: message.task.resources?.childWorkers || 1
      });
    }
    if (message.type === 'lease-granted') {
      this.emit({
        type: 'task-status',
        rootTaskId: message.lease.rootTaskId,
        status: 'running',
        progress: 0.5,
        children: [{ childId: `${message.lease.rootTaskId}:child-1`, status: 'running', progress: 0.5 }]
      });
      this.emit({ type: 'lease-release', leaseId: message.lease.leaseId });
      this.emit({
        type: 'task-result',
        rootTaskId: message.lease.rootTaskId,
        result: {
          value: {
            ok: true,
            leaseId: message.lease.leaseId
          }
        }
      });
    }
    if (message.type === 'lease-denied') {
      this.emit({
        type: 'task-error',
        rootTaskId: this.task?.rootTaskId,
        error: message.error
      });
    }
  }

  terminate() {
    this.terminated = true;
  }

  emit(data) {
    for (const listener of this.listeners.message) {
      listener({ data });
    }
  }
}

class CancellableServiceHost extends CompletingServiceHost {
  postMessage(message) {
    this.messages.push(message);
    if (message.type === 'init') {
      this.workerId = message.workerId;
      this.emit({
        type: 'ready',
        workerId: message.workerId,
        serviceId: this.manifest.serviceId
      });
    }
    if (message.type === 'submit-task') {
      this.task = message.task;
      this.emit({
        type: 'lease-request',
        requestId: `${message.task.rootTaskId}:lease`,
        rootTaskId: message.task.rootTaskId,
        module: this.manifest.childWorkers.allowedModules[0],
        workerType: message.task.workerType,
        count: 1
      });
    }
    if (message.type === 'lease-granted') {
      this.emit({
        type: 'task-status',
        rootTaskId: message.lease.rootTaskId,
        status: 'running',
        progress: 0.25,
        children: [{ childId: `${message.lease.rootTaskId}:child-1`, status: 'running', progress: 0.25 }]
      });
    }
    if (message.type === 'cancel-task') {
      this.emit({
        type: 'task-cancelled',
        rootTaskId: message.rootTaskId,
        result: { cancelled: true }
      });
    }
  }
}

class UlgContractServiceHost {
  constructor(manifest, { holdUntilCancel = false } = {}) {
    this.manifest = manifest;
    this.contract = manifest.contract || manifest.metadata?.ulgContract || null;
    this.holdUntilCancel = holdUntilCancel;
    this.listeners = {
      message: new Set(),
      error: new Set()
    };
    this.messages = [];
    this.task = null;
    this.lease = null;
  }

  addEventListener(type, listener) {
    this.listeners[type]?.add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners[type]?.delete(listener);
  }

  postMessage(message) {
    this.messages.push(message);
    if (message.type === 'init') {
      this.workerId = message.workerId;
      this.emit({
        type: 'ready',
        workerId: message.workerId,
        serviceId: this.manifest.serviceId
      });
      this.emitHeartbeat('ready');
    }
    if (message.type === 'submit-task') {
      this.task = message.task;
      this.emitHeartbeat('validating-contract', message.task.capsule);
      this.emit({
        type: 'task-status',
        rootTaskId: message.task.rootTaskId,
        status: 'validating-ulg-contract',
        progress: 0.2,
        children: []
      });
      this.emit({
        type: 'lease-request',
        requestId: `${message.task.rootTaskId}:lease`,
        rootTaskId: message.task.rootTaskId,
        module: this.manifest.childWorkers.allowedModules[0],
        workerType: message.task.workerType,
        count: message.task.resources?.childWorkers || 1,
        ttlMs: 5_000,
        resources: {
          capsuleSchema: message.task.capsule?.schema || null,
          runtimeManifestSchema: message.task.runtimeManifest?.schema || null
        }
      });
    }
    if (message.type === 'lease-granted') {
      this.lease = message.lease;
      this.emitHeartbeat('running', this.task?.capsule, message.lease);
      this.emit({
        type: 'task-status',
        rootTaskId: message.lease.rootTaskId,
        status: 'running-ulg-capsule',
        progress: 0.7,
        children: [{
          childId: `${message.lease.rootTaskId}:child-1`,
          leaseId: message.lease.leaseId,
          module: message.lease.module,
          serviceId: this.manifest.serviceId,
          capsuleSchema: this.task?.capsule?.schema || null,
          status: 'running',
          progress: 0.7
        }]
      });
      if (!this.holdUntilCancel) {
        this.emit({ type: 'lease-release', leaseId: message.lease.leaseId });
        this.emit({
          type: 'task-result',
          rootTaskId: message.lease.rootTaskId,
          result: this.createResult('complete', message.lease)
        });
      }
    }
    if (message.type === 'lease-denied') {
      this.emit({
        type: 'task-error',
        rootTaskId: this.task?.rootTaskId,
        error: message.error
      });
    }
    if (message.type === 'cancel-task') {
      this.emitHeartbeat('cancelled', this.task?.capsule, this.lease);
      this.emit({
        type: 'task-cancelled',
        rootTaskId: message.rootTaskId,
        result: this.createResult('cancelled-clean', this.lease, { cancelled: true })
      });
    }
  }

  terminate() {
    this.terminated = true;
  }

  emitHeartbeat(status, capsule = null, lease = null) {
    this.emit({
      type: 'heartbeat',
      telemetry: {
        schema: ULG_SERVICE_TELEMETRY_SCHEMA,
        serviceId: this.manifest.serviceId,
        status,
        fixtureSource: ULG_FIXTURE_SOURCE,
        contract: this.contract,
        abi: this.manifest.abi,
        runtimeManifestSchema: this.task?.runtimeManifest?.schema || ULG_RUNTIME_MANIFEST_SCHEMA,
        lastTaskKind: this.task?.taskKind || null,
        lastCapsuleSchema: capsule?.schema || null,
        activeLeaseId: lease?.leaseId || null
      }
    });
  }

  createResult(status, lease = null, extras = {}) {
    return {
      schema: ULG_SERVICE_TASK_RESULT_SCHEMA,
      serviceId: this.manifest.serviceId,
      status,
      taskId: this.task?.taskId || null,
      taskKind: this.task?.taskKind || null,
      capsuleSchema: this.task?.capsule?.schema || null,
      runtimeManifestSchema: this.task?.runtimeManifest?.schema || null,
      contract: this.contract,
      childLease: lease ? {
        schema: lease.schema,
        leaseId: lease.leaseId,
        module: lease.module,
        count: lease.count
      } : null,
      delta: {
        schema: ULG_COMPACT_DELTA_SCHEMA,
        deltaHash: `sha256:${this.manifest.serviceId}:fixture-delta`,
        stateRefs: ['warm:closures/material']
      },
      residuals: {
        invariantDrift: 0,
        closureUncertainty: 0.01
      },
      performance: {
        backend: 'stub-host',
        childLeaseCount: lease?.count || 0
      },
      ...extras
    };
  }

  emit(data) {
    for (const listener of this.listeners.message) {
      listener({ data });
    }
  }
}

class UlgV05ArtifactServiceHost {
  constructor(manifest) {
    this.manifest = manifest;
    this.listeners = {
      message: new Set(),
      error: new Set()
    };
  }

  addEventListener(type, listener) {
    this.listeners[type]?.add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners[type]?.delete(listener);
  }

  postMessage(message) {
    if (message.type === 'init') {
      this.emit({
        type: 'ready',
        workerId: message.workerId,
        serviceId: this.manifest.serviceId
      });
    }
    if (message.type === 'submit-task') {
      const { task } = message;
      const artifact = {
        artifactId: `artifact:${task.taskId}`,
        sourceService: task.serviceId,
        taskKind: task.taskKind,
        inputHash: task.capsule.inputHash,
        method: 'moonlab.fixture.quantum-response',
        representation: 'bell-state-probability-vector',
        responseDescriptor: {
          schema: ULG_QUANTUM_RESPONSE_DESCRIPTOR_SCHEMA,
          sample: 'bell_phi_plus',
          qubitCount: 2,
          deterministic: true,
          expectedProbabilities: [0.5, 0, 0, 0.5],
          observedProbabilities: [0.5, 0, 0, 0.5],
          invariants: {
            probabilitySum: 1,
            normalizationDelta: 0
          }
        },
        outputs: {
          probabilities: [0.5, 0, 0, 0.5],
          basis: 'computational',
          reference: {
            schema: 'moonlab.magnetar-dipole-ising-reference.v0',
            role: 'peercompute-reference-tolerance-input',
            contractHash: MOONLAB_REFERENCE_CONTRACT_HASH,
            energyUnits: 'normalized-ising',
            hamiltonian: {
              localFields: [0.25, 0.125, 0.0625],
              couplings: [
                { qubit1: 0, qubit2: 1, value: -0.5 },
                { qubit1: 1, qubit2: 2, value: -0.25 }
              ]
            },
            observables: {
              groundState: {
                bitstring: 0,
                bitString: '000',
                referenceEnergy: -0.9375
              },
              energySpectrum: [
                { bitstring: 0, bitString: '000', referenceEnergy: -0.9375 },
                { bitstring: 7, bitString: '111', referenceEnergy: 0.3125 }
              ]
            },
            tolerances: {
              energyAbs: 1e-9,
              maxObservedEnergyDelta: 0
            },
            validation: {
              parityPassed: true,
              maxEnergyDelta: 0,
              evaluatedBitstrings: 8
            }
          }
        },
        calibrationArtifacts: {
          magnetarDipoleIsing: {
            schema: ULG_MAGNETAR_DIPOLE_ISING_CALIBRATION_SCHEMA,
            sample: 'magnetar_dipole_ising',
            validation: {
              status: 'pass'
            },
            parity: {
              status: 'pass',
              metrics: {
                maxEnergyDelta: 0
              }
            },
            summary: {
              groundState: {
                bitString: '000'
              },
              maxEnergyDelta: 0,
              evaluatedBitstrings: 8
            }
          }
        },
        parity: {
          schema: ULG_QUANTUM_RESPONSE_PARITY_SCHEMA,
          sample: 'bell_phi_plus',
          status: 'pass',
          comparisons: [
            { mode: 'moonlab-wasm-core', status: 'pass', maxProbabilityError: 0 },
            {
              mode: 'moonlab-webgpu',
              status: 'unsupported',
              reason: 'moonlab-webgpu-response-kernel-unavailable',
              maxProbabilityError: null
            }
          ],
          metrics: {
            maxProbabilityError: 0,
            normalizationDelta: 0,
            unsupportedModeCount: 1
          }
        },
        validation: {
          status: 'pass',
          toleranceProfile: task.validation.toleranceProfile
        },
        provenance: task.provenance,
        contentHash: 'ulg:fixture-result-moonlab-001'
      };
      this.emit({
        type: 'task-result',
        rootTaskId: task.rootTaskId,
        result: createUlgV05ArtifactResult(task, artifact)
      });
    }
  }

  terminate() {
    this.terminated = true;
  }

  emit(data) {
    for (const listener of this.listeners.message) {
      listener({ data });
    }
  }
}

class InMemoryArtifactCache {
  constructor(now = () => 1) {
    this.now = now;
    this.records = new Map();
  }

  async put(artifact) {
    const artifactHash = artifact.contentHash || `artifact-${this.records.size}`;
    const ref = {
      uri: `artifact://${artifactHash}`,
      artifactHash,
      sourceService: artifact.sourceService,
      createdAt: this.now()
    };
    this.records.set(ref.uri, { ref, artifact });
    return ref;
  }

  async get(ref) {
    return this.records.get(ref.uri)?.artifact;
  }

  list() {
    return [...this.records.values()].map(({ ref, artifact }) => ({
      ref,
      artifactKind: artifact.artifactKind || artifact.taskKind || 'unknown'
    }));
  }
}

async function waitFor(predicate) {
  for (let i = 0; i < 50; i += 1) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  throw new Error('Timed out waiting for condition');
}

test('ComputeServiceRegistry normalizes manifests and resolves task kinds', () => {
  const manifest = normalizeComputeServiceManifest(serviceManifest({
    serviceId: 'moonlab',
    entry: { adapter: 'compute-manager' },
    capabilities: ['ulg.quantum.response'],
    taskKinds: ['moonlab.quantum.response']
  }));
  assert.equal(manifest.schema, COMPUTE_SERVICE_MANIFEST_SCHEMA);
  assert.equal(manifest.runtime, 'js');
  assert.equal(manifest.entry.adapter, 'compute-manager');

  const registry = new ComputeServiceRegistry([manifest]);
  assert.equal(registry.resolve('moonlab.quantum.response')[0].serviceId, 'moonlab');
  assert.equal(registry.resolve('ulg.quantum.response')[0].serviceId, 'moonlab');
  assert.equal(registry.resolveTask({ taskKind: 'moonlab.quantum.response' })[0].serviceId, 'moonlab');

  const copy = registry.get('moonlab');
  copy.manifest.capabilities.push('mutated');
  assert.equal(registry.get('moonlab').manifest.capabilities.includes('mutated'), false);

  const capabilities = registry.listCapabilities();
  assert.equal(capabilities.schema, COMPUTE_SERVICE_REGISTRY_SCHEMA);
  assert.deepEqual(capabilities.capabilities, ['ulg.quantum.response']);
  assert.deepEqual(capabilities.taskKinds, ['moonlab.quantum.response']);
  assert.throws(() => normalizeComputeServiceManifest({ serviceId: 'bad', entry: { adapter: 'x' } }), /capability/);
});

test('ChildWorkerLeaseManager enforces approved modules, quotas, expiry, and root revocation', async () => {
  let now = 1000;
  const leases = new ChildWorkerLeaseManager({ now: () => now });

  const lease = await leases.request('root-worker-a', {
    rootTaskId: 'root-task-a',
    module: '/child.js',
    workerType: 'classic',
    count: 2,
    allowed: true,
    maxChildren: 2,
    allowedModules: ['/child.js'],
    sameOriginOnly: false,
    ttlMs: 100
  });

  assert.equal(lease.schema, CHILD_WORKER_LEASE_SCHEMA);
  assert.equal(lease.count, 2);
  assert.equal(lease.workerType, 'classic');
  assert.equal(leases.activeChildCount('root-worker-a'), 2);
  await assert.rejects(() => leases.request('root-worker-a', {
    rootTaskId: 'root-task-a',
    module: '/child.js',
    count: 1,
    allowed: true,
    maxChildren: 2,
    allowedModules: ['/child.js'],
    sameOriginOnly: false
  }), /quota exceeded/);
  await assert.rejects(() => leases.request('root-worker-b', {
    rootTaskId: 'root-task-b',
    module: '/unapproved.js',
    allowed: true,
    maxChildren: 1,
    allowedModules: ['/child.js'],
    sameOriginOnly: false
  }), /not lease-approved/);
  await assert.rejects(() => leases.request('root-worker-type', {
    rootTaskId: 'root-task-type',
    module: '/child.js',
    workerType: 'shared',
    allowed: true,
    maxChildren: 1,
    allowedModules: ['/child.js'],
    sameOriginOnly: false
  }), /Unsupported child worker type/);

  const sameOriginLease = await leases.request('root-worker-relative', {
    rootTaskId: 'root-task-relative',
    module: '/child.js',
    allowed: true,
    maxChildren: 1,
    allowedModules: ['/child.js'],
    baseUrl: '/service.js'
  });
  assert.equal(sameOriginLease.status, 'active');
  assert.equal(sameOriginLease.workerType, 'module');
  await assert.rejects(() => leases.request('root-worker-foreign', {
    rootTaskId: 'root-task-foreign',
    module: 'https://example.com/child.js',
    allowed: true,
    maxChildren: 1,
    allowedModules: ['https://example.com/child.js'],
    baseUrl: '/service.js'
  }), /same-origin/);

  now = 1201;
  const expired = leases.expireLeases();
  assert.equal(expired[0].status, 'expired');
  assert.equal(leases.activeChildCount('root-worker-a'), 0);

  const revocable = await leases.request('root-worker-a', {
    rootTaskId: 'root-task-c',
    module: '/child.js',
    allowed: true,
    maxChildren: 2,
    allowedModules: ['/child.js'],
    sameOriginOnly: false
  });
  assert.equal(revocable.status, 'active');
  await leases.revokeByRootTask('root-task-c');
  assert.equal(leases.get(revocable.leaseId).status, 'revoked');
});

test('ULG v0.5 adapter normalizes copied fixtures and stores artifact refs through WorkerSupervisor', async () => {
  const fixtureText = readFileSync(new URL('../fixtures/ulg-v0.5-fixtures.json', import.meta.url), 'utf8');
  assert.equal(fixtureText.includes('/home/cos/projects/ulg'), false);
  const fixtures = JSON.parse(fixtureText);
  const moonlabManifest = fixtures.manifests.find((manifest) => manifest.serviceId === 'moonlab');
  const moonlabCapsule = fixtures.tasks.find((task) => task.serviceId === 'moonlab');

  const manifest = adaptUlgV05ComputeServiceManifest(moonlabManifest);
  assert.equal(manifest.schema, COMPUTE_SERVICE_MANIFEST_SCHEMA);
  assert.equal(manifest.serviceId, 'moonlab');
  assert.equal(manifest.runtime, 'wasm');
  assert.equal(manifest.contract.schema, ULG_SERVICE_CONTRACT_ADAPTER_SCHEMA);
  assert.equal(manifest.contract.protocolVersion, '0.5');
  assert.deepEqual(manifest.contract.outputArtifactKinds, ['quantum-response']);
  assert.equal(manifest.entry.serviceAssets.loaderModule, '/service-assets/moonlab/moonlab.js');
  assert.equal(manifest.metadata.serviceAssets.coreProbeWorkerModule, './workers/moonlab-core-probe.worker.js');
  assert.equal(manifest.childWorkers.allowedModules.includes('./workers/moonlab-core-probe.worker.js'), true);

  const task = adaptUlgV05TaskCapsule(moonlabCapsule, { workerType: 'classic' });
  assert.equal(task.schema, ULG_TASK_CAPSULE_ADAPTER_SCHEMA);
  assert.equal(task.workerType, 'classic');
  assert.equal(task.outputs[0].artifactKind, 'quantum-response');
  assert.equal(task.artifactPlan[0].artifactSchema, 'quantum_response_artifact.schema.json');
  assert.equal(task.capsule.methodHash, 'ulg:fixture-method-moonlab-001');

  const registry = new ComputeServiceRegistry([manifest]);
  assert.equal(registry.resolve('moonlab.quantum.response')[0].serviceId, 'moonlab');
  assert.equal(registry.resolveTask(task)[0].serviceId, 'moonlab');

  const artifactCache = new InMemoryArtifactCache(() => 1234);
  const supervisor = new WorkerSupervisor({
    registry,
    artifactCache,
    workerFactory: (serviceManifest) => new UlgV05ArtifactServiceHost(serviceManifest)
  });

  const result = await supervisor.submitTask(task);
  assert.equal(result.schema, ULG_ARTIFACT_RESULT_SCHEMA);
  assert.equal(result.status, 'complete');
  assert.equal(result.outputs[0].artifactKind, 'quantum-response');
  assert.equal(result.outputs[0].artifactRefHint, 'ulg:quantum-response:ulg:fixture-result-moonlab-001');
  assert.equal(result.artifactSummary.schema, ULG_ARTIFACT_SUMMARY_SCHEMA);
  assert.equal(result.artifactSummary.responseDescriptorSchema, ULG_QUANTUM_RESPONSE_DESCRIPTOR_SCHEMA);
  assert.equal(result.artifactSummary.responseDescriptorReady, true);
  assert.equal(result.artifactSummary.paritySchema, ULG_QUANTUM_RESPONSE_PARITY_SCHEMA);
  assert.equal(result.artifactSummary.parityStatus, 'pass');
  assert.equal(result.artifactSummary.parityReady, true);
  assert.equal(result.artifactSummary.parityModeCount, 2);
  assert.equal(result.artifactSummary.unsupportedParityModeCount, 1);
  assert.deepEqual(result.artifactSummary.unsupportedParityModes, ['moonlab-webgpu']);
  assert.equal(result.artifactSummary.magnetarReferenceReady, true);
  assert.equal(result.artifactSummary.magnetarReferenceSchema, 'moonlab.magnetar-dipole-ising-reference.v0');
  assert.equal(result.artifactSummary.magnetarReferenceRole, 'peercompute-reference-tolerance-input');
  assert.equal(result.artifactSummary.magnetarReferenceContractHash, MOONLAB_REFERENCE_CONTRACT_HASH);
  assert.equal(result.artifactSummary.magnetarReferenceEnergyUnits, 'normalized-ising');
  assert.equal(result.artifactSummary.magnetarReferenceGroundStateBitString, '000');
  assert.equal(result.artifactSummary.magnetarReferenceGroundStateEnergy, -0.9375);
  assert.equal(result.artifactSummary.magnetarReferenceToleranceEnergyAbs, 1e-9);
  assert.equal(result.artifactSummary.magnetarReferenceMaxObservedEnergyDelta, 0);
  assert.equal(result.artifactSummary.magnetarReferenceValidationStatus, 'pass');
  assert.equal(result.artifactSummary.calibrationArtifactCount, 1);
  assert.equal(result.artifactSummary.calibrationReadyCount, 1);
  assert.equal(result.artifactSummary.magnetarDipoleIsingReady, true);
  assert.equal(result.artifactSummary.magnetarDipoleIsingStatus, 'pass');
  assert.equal(result.artifactSummary.magnetarDipoleIsingParityStatus, 'pass');
  assert.equal(result.artifactSummary.magnetarDipoleIsingGroundState, '000');
  assert.equal(result.artifactSummary.magnetarDipoleIsingMaxEnergyDelta, 0);
  assert.equal(result.artifactSummary.magnetarDipoleIsingEvaluatedBitstrings, 8);
  assert.equal(result.artifactSummary.calibrationArtifacts[0].schema, ULG_MAGNETAR_DIPOLE_ISING_CALIBRATION_SCHEMA);
  assert.equal(result.outputs[0].artifactSummary.parityStatus, 'pass');
  assert.equal(result.artifact.sourceService, 'moonlab');
  assert.equal(result.artifact.taskKind, 'moonlab.quantum.response');
  assert.equal(result.artifact.responseDescriptor.schema, ULG_QUANTUM_RESPONSE_DESCRIPTOR_SCHEMA);
  assert.equal(result.artifact.parity.schema, ULG_QUANTUM_RESPONSE_PARITY_SCHEMA);
  assert.deepEqual(result.artifact.outputs.probabilities, [0.5, 0, 0, 0.5]);
  assert.equal(result.artifactRef.uri, 'artifact://ulg:fixture-result-moonlab-001');
  assert.equal(result.artifactRef.sourceService, 'moonlab');

  const cached = await artifactCache.get(result.artifactRef);
  assert.equal(cached.artifactId, `artifact:${moonlabCapsule.taskId}`);
  assert.equal(cached.contentHash, 'ulg:fixture-result-moonlab-001');

  const telemetry = supervisor.getTreeTelemetry();
  assert.equal(telemetry.artifacts[0].ref.uri, result.artifactRef.uri);
  assert.equal(telemetry.tasks[0].artifactRef.uri, result.artifactRef.uri);
});

test('ULG artifact summary requires complete MoonLab reference contract before readiness', () => {
  const baseArtifact = {
    outputs: {
      reference: {
        schema: 'moonlab.magnetar-dipole-ising-reference.v0',
        role: 'peercompute-reference-tolerance-input',
        contractHash: MOONLAB_REFERENCE_CONTRACT_HASH,
        energyUnits: 'normalized-ising',
        observables: {
          groundState: {
            bitString: '000',
            referenceEnergy: -0.9375
          }
        },
        tolerances: {
          energyAbs: 1e-9,
          maxObservedEnergyDelta: 0
        },
        validation: {
          parityPassed: true
        }
      }
    }
  };
  const clone = (value) => JSON.parse(JSON.stringify(value));

  assert.equal(summarizeUlgArtifact('quantum-response', baseArtifact).magnetarReferenceReady, true);

  const placeholderHash = clone(baseArtifact);
  placeholderHash.outputs.reference.contractHash = 'ulg:fixture-input-moonlab-001';
  assert.equal(summarizeUlgArtifact('quantum-response', placeholderHash).magnetarReferenceReady, false);

  const missingTolerance = clone(baseArtifact);
  delete missingTolerance.outputs.reference.tolerances.energyAbs;
  assert.equal(summarizeUlgArtifact('quantum-response', missingTolerance).magnetarReferenceReady, false);

  const overTolerance = clone(baseArtifact);
  overTolerance.outputs.reference.tolerances.maxObservedEnergyDelta = 1e-6;
  assert.equal(summarizeUlgArtifact('quantum-response', overTolerance).magnetarReferenceReady, false);
});

test('ULG artifact summary exposes calibrated magnetar reference inventory from outputs.references', () => {
  const baseReference = {
    id: 'magnetosphere-mhd-reference',
    family: 'magnetosphere-mhd',
    solverId: 'moonlab-mhd-calibrated-v0',
    schema: 'moonlab.magnetar.calibrated-reference.v0',
    role: 'peercompute-scientific-tolerance-input',
    contractHash: 'sha256:magnetosphere-mhd-reference-contract',
    unitsHash: 'sha256:magnetosphere-mhd-reference-units',
    fieldMap: {
      magneticEnergy: 'magnetosphere.magneticEnergy',
      divergenceBProxy: 'magnetosphere.divergenceBProxy'
    },
    fieldTolerances: {
      magneticEnergy: { abs: 0.01 },
      divergenceBProxy: 0.0001
    },
    fieldObservedDeltas: {
      magneticEnergy: 0.004,
      divergenceBProxy: 0.00005
    },
    validation: {
      status: 'pass'
    },
    ready: true,
    scientificCoverage: true
  };
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const missingCoverage = clone(baseReference);
  missingCoverage.id = 'radiation-transport-reference';
  missingCoverage.family = 'radiation-transport';
  missingCoverage.scientificCoverage = false;
  const placeholderHash = clone(baseReference);
  placeholderHash.id = 'pic-kinetic-plasma-reference';
  placeholderHash.family = 'pic-kinetic-plasma';
  placeholderHash.contractHash = 'ulg:fixture-calibrated-pic-reference';

  const summary = summarizeUlgArtifact('quantum-response', {
    outputs: {
      references: [baseReference, missingCoverage, placeholderHash]
    }
  });

  assert.equal(summary.magnetarCalibratedReferenceCount, 3);
  assert.equal(summary.magnetarCalibratedReferenceReadyCount, 1);
  assert.equal(summary.magnetarCalibratedReferenceScientificCoverageCount, 2);
  assert.equal(summary.magnetarCalibratedReferences[0].id, 'magnetosphere-mhd-reference');
  assert.equal(summary.magnetarCalibratedReferences[0].ready, true);
  assert.equal(summary.magnetarCalibratedReferences[0].validationStatus, 'pass');
  assert.deepEqual(summary.magnetarCalibratedReferences[0].fieldObservedDeltas, {
    magneticEnergy: 0.004,
    divergenceBProxy: 0.00005
  });
  assert.equal(summary.magnetarCalibratedReferences[1].ready, false);
  assert.equal(summary.magnetarCalibratedReferences[2].ready, false);
});

test('ULG artifact summary exposes MoonLab WebGPU complex64 no-backend parity scope without execution claims', () => {
  const summary = summarizeUlgArtifact('quantum-response', {
    sourceService: 'moonlab',
    outputs: {
      webGpuParityScope: createMoonLabWebGpuComplex64ParityScope()
    }
  });

  assert.equal(summary.moonlabWebGpuParityScopeReady, true);
  assert.equal(summary.moonlabWebGpuParityScopeSchema, MOONLAB_WEBGPU_COMPLEX64_PARITY_SCOPE_SCHEMA);
  assert.equal(summary.moonlabWebGpuParityScopeStatus, 'scope-ready-backend-unavailable');
  assert.equal(summary.moonlabWebGpuParityScopeContractReady, true);
  assert.equal(summary.moonlabWebGpuParityScopeContractValidationValid, true);
  assert.equal(summary.moonlabWebGpuParityScopeReducedFixtureOnly, true);
  assert.equal(summary.moonlabWebGpuParityScopeBackendAvailable, false);
  assert.equal(summary.moonlabWebGpuParityScopeWebgpuParityExecuted, false);
  assert.equal(summary.moonlabWebGpuParityScopeWebgpuParityPassed, false);
  assert.equal(summary.moonlabWebGpuParityScopeFullFidelityMagnetarSimulation, false);
  assert.equal(summary.moonlabWebGpuParityScopeFullPhysicsValidation, false);
  assert.equal(summary.moonlabWebGpuParityScopeBlockerCount, 3);
  assert.equal(summary.moonlabWebGpuParityScopeValidationBlockerCount, 0);
  assert.ok(summary.moonlabWebGpuParityScopeBlockers.includes('browser-webgpu-kernel-parity-not-executed'));
  assert.equal(summary.moonlabWebGpuParityScope.ready, true);
  assert.equal(summary.moonlabWebGpuParityScope.backendAvailable, false);
  assert.equal(summary.moonlabWebGpuParityScope.webgpuParityExecuted, false);

  const backendOverclaim = summarizeUlgArtifact('quantum-response', {
    sourceService: 'moonlab',
    outputs: {
      webGpuParityScope: createMoonLabWebGpuComplex64ParityScope({
        backendAvailable: true
      })
    }
  });
  assert.equal(backendOverclaim.moonlabWebGpuParityScopeReady, false);
  assert.ok(backendOverclaim.moonlabWebGpuParityScopeValidationBlockers.includes(
    'moonlab-webgpu-complex64-reduced-browser-evidence-not-ready'
  ));
});

test('ULG artifact summary accepts MoonLab reduced browser WebGPU parity evidence without physics overclaims', () => {
  const summary = summarizeUlgArtifact('quantum-response', {
    sourceService: 'moonlab',
    outputs: {
      webGpuParityScope: createMoonLabBrowserWebGpuComplex64ParityScope()
    }
  });

  assert.equal(summary.moonlabWebGpuParityScopeReady, true);
  assert.equal(summary.moonlabWebGpuParityScopeSchema, MOONLAB_WEBGPU_COMPLEX64_PARITY_SCOPE_SCHEMA);
  assert.equal(summary.moonlabWebGpuParityScopeStatus, 'scope-ready-backend-detected');
  assert.equal(summary.moonlabWebGpuParityScopeBackendAvailable, true);
  assert.equal(summary.moonlabWebGpuParityScopeWebgpuParityExecuted, true);
  assert.equal(summary.moonlabWebGpuParityScopeWebgpuParityPassed, true);
  assert.equal(summary.moonlabWebGpuParityScopeFullFidelityMagnetarSimulation, false);
  assert.equal(summary.moonlabWebGpuParityScopeFullPhysicsValidation, false);
  assert.equal(summary.moonlabWebGpuParityScopeBlockerCount, 0);
  assert.equal(summary.moonlabWebGpuParityScopeValidationBlockerCount, 0);
  assert.equal(summary.moonlabWebGpuParityScope.browserBackendPreflightStage, 'device-acquired');
  assert.equal(summary.moonlabWebGpuParityScope.browserBackendPreflightDeviceAcquired, true);
  assert.deepEqual(summary.moonlabWebGpuParityScope.probabilityKernelCoveredOperations, ['compute_probabilities']);
  assert.deepEqual(summary.moonlabWebGpuParityScope.nativeOperationCoveredOperations, [
    'hadamard',
    'pauli_x',
    'pauli_z',
    'cnot'
  ]);

  const fullPhysicsOverclaim = summarizeUlgArtifact('quantum-response', {
    sourceService: 'moonlab',
    outputs: {
      webGpuParityScope: createMoonLabBrowserWebGpuComplex64ParityScope({
        fullPhysicsValidation: true
      })
    }
  });
  assert.equal(fullPhysicsOverclaim.moonlabWebGpuParityScopeReady, false);
  assert.ok(fullPhysicsOverclaim.moonlabWebGpuParityScopeValidationBlockers.includes(
    'moonlab-webgpu-complex64-full-physics-validation-overstated'
  ));
});

test('ULG artifact summary exposes Eshkol production handler boundary without readiness claims', () => {
  const summary = summarizeUlgArtifact('closure', createEshkolMagnetarDescriptorArtifact());

  assert.equal(summary.eshkolProductionHandlerBoundaryReady, true);
  assert.equal(summary.eshkolProductionHandlerBoundarySchema, ESHKOL_PRODUCTION_HANDLER_BOUNDARY_SCHEMA);
  assert.equal(summary.eshkolProductionHandlerBoundaryStatus, 'production-handler-boundary-declared-not-executed');
  assert.equal(summary.eshkolProductionHandlerBoundaryHandlerReady, false);
  assert.equal(summary.eshkolProductionHandlerBoundaryRuntimeExecution, false);
  assert.equal(summary.eshkolProductionHandlerBoundaryScientificValidation, false);
  assert.equal(summary.eshkolProductionHandlerBoundaryFullPhysicsValidation, false);
  assert.equal(summary.eshkolProductionHandlerBoundaryFullFidelityMagnetarSimulation, false);
  assertEshkolProductionHandlerContractFields(summary);
  assert.equal(
    summary.eshkolProductionHostImportCandidateStatus,
    'production-candidate-runtime-imports-implemented'
  );
  assert.equal(
    summary.eshkolProductionHostImportCandidateProductionRuntimeAbi,
    'wasm32-unknown-unknown:eshkol-host-imports-production-candidate-v0'
  );
  assert.equal(summary.eshkolProductionHostImportCandidateRuntimeSmokeStubsAllowed, false);
  assert.equal(summary.eshkolProductionHostImportCandidateRequiredNonStubImports.length, 23);
  assert.deepEqual(summary.eshkolProductionHostImportCandidateReadinessRequires, [
    ...ESHKOL_PRODUCTION_READINESS_REQUIREMENTS
  ]);
  assert.deepEqual(summary.eshkolProductionHostImportCandidateBlockedBy, [...ESHKOL_PRODUCTION_BLOCKERS]);
  assertEshkolProductionCandidateRuntimeProbeFields(summary);
  assert.equal(
    summary.eshkolProductionDispatchPreflightSchema,
    'eshkol.ulg.production-handler-dispatch-preflight.v0'
  );
  assert.equal(summary.eshkolProductionDispatchPreflightStatus, 'blocked');
  assert.equal(summary.eshkolProductionDispatchPreflightReady, false);
  assert.equal(summary.eshkolProductionDispatchPreflightDeclared, true);
  assert.equal(
    summary.eshkolProductionDispatchPreflightRequiredRuntimeAbi,
    'wasm32-unknown-unknown:eshkol-host-imports-production-candidate-v0'
  );
  assert.equal(summary.eshkolProductionDispatchPreflightRuntimeSmokeStubsAllowed, false);
  assert.deepEqual(summary.eshkolProductionDispatchPreflightRequiredChecks, [...ESHKOL_PRODUCTION_DISPATCH_CHECKS]);
  assert.equal(
    summary.eshkolProductionDispatchPreflightCheckSummarySchema,
    'eshkol.ulg.production-handler-dispatch-preflight-check-summary.v0'
  );
  assert.equal(
    summary.eshkolProductionDispatchPreflightTotalRequiredCheckCount,
    ESHKOL_PRODUCTION_DISPATCH_CHECKS.length
  );
  assert.equal(
    summary.eshkolProductionDispatchPreflightPassedCheckCount,
    ESHKOL_PRODUCTION_DISPATCH_PASSED_CHECKS.length
  );
  assert.equal(summary.eshkolProductionDispatchPreflightBlockedCheckCount, 3);
  assert.deepEqual(summary.eshkolProductionDispatchPreflightPassedChecks, [
    ...ESHKOL_PRODUCTION_DISPATCH_PASSED_CHECKS
  ]);
  assert.deepEqual(summary.eshkolProductionDispatchPreflightBlockedChecks, [
    ...ESHKOL_PRODUCTION_DISPATCH_BLOCKED_CHECKS
  ]);
  assert.deepEqual(
    summary.eshkolProductionDispatchPreflightCheckResults.map((entry) => entry.check),
    [...ESHKOL_PRODUCTION_DISPATCH_CHECKS]
  );
  assert.deepEqual(summary.eshkolProductionDispatchPreflightRejectedRuntimeScopes, [
    'deterministic-runtime-smoke-stubs'
  ]);
  assert.deepEqual(summary.eshkolProductionDispatchPreflightBlockedBy, [...ESHKOL_PRODUCTION_BLOCKERS]);
  assert.equal(summary.eshkolProductionHandlerBoundaryValidationBlockerCount, 0);
  assert.equal(summary.eshkolProductionHandlerBoundary.ready, true);
  assert.equal(summary.eshkolProductionHandlerBoundary.handlerReady, false);
  assert.equal(summary.eshkolProductionHandlerBoundary.runtimeExecution, false);
  assert.equal(summary.eshkolProductionHandlerBoundary.dispatchPreflightReady, false);
  assert.equal(summary.eshkolProductionHandlerBoundary.dispatchPreflightDeclared, true);
  assertEshkolProductionHandlerContractFields(
    summary.eshkolProductionHandlerBoundary,
    'productionHandlerContract'
  );
  assert.equal(
    summary.eshkolProductionHandlerBoundary.dispatchPreflightPassedCheckCount,
    ESHKOL_PRODUCTION_DISPATCH_PASSED_CHECKS.length
  );
  assert.equal(summary.eshkolProductionHandlerBoundary.dispatchPreflightBlockedCheckCount, 3);
  assertEshkolProductionCandidateRuntimeProbeFields(
    summary.eshkolProductionHandlerBoundary,
    'productionCandidateRuntimeProbe'
  );

  const normalizedBoundaryArtifact = createEshkolMagnetarDescriptorArtifact();
  normalizedBoundaryArtifact.validation.closureDescriptor.descriptorBinding.productionHandlerBoundary =
    summary.eshkolProductionHandlerBoundary;
  const normalizedBoundarySummary = summarizeUlgArtifact('closure', normalizedBoundaryArtifact);
  assert.equal(
    normalizedBoundarySummary.eshkolProductionHostImportCandidateStatus,
    'production-candidate-runtime-imports-implemented'
  );
  assert.equal(normalizedBoundarySummary.eshkolProductionHostImportCandidateRequiredNonStubImports.length, 23);
  assertEshkolProductionHandlerContractFields(normalizedBoundarySummary);
  assert.equal(normalizedBoundarySummary.eshkolProductionDispatchPreflightStatus, 'blocked');
  assert.equal(normalizedBoundarySummary.eshkolProductionDispatchPreflightReady, false);
  assert.equal(normalizedBoundarySummary.eshkolProductionDispatchPreflightDeclared, true);
  assert.equal(
    normalizedBoundarySummary.eshkolProductionDispatchPreflightRequiredChecks.length,
    ESHKOL_PRODUCTION_DISPATCH_CHECKS.length
  );
  assert.equal(
    normalizedBoundarySummary.eshkolProductionDispatchPreflightPassedCheckCount,
    ESHKOL_PRODUCTION_DISPATCH_PASSED_CHECKS.length
  );
  assert.equal(normalizedBoundarySummary.eshkolProductionDispatchPreflightBlockedCheckCount, 3);
  assertEshkolProductionCandidateRuntimeProbeFields(normalizedBoundarySummary);
  assert.deepEqual(
    normalizedBoundarySummary.eshkolProductionDispatchPreflightBlockedBy,
    [...ESHKOL_PRODUCTION_BLOCKERS]
  );

  const overclaimArtifact = createEshkolMagnetarDescriptorArtifact();
  overclaimArtifact.validation.closureDescriptor.descriptorBinding.productionHandlerBoundary =
    createEshkolProductionHandlerBoundary({ handlerReady: true });
  const overclaim = summarizeUlgArtifact('closure', overclaimArtifact);
  assert.equal(overclaim.eshkolProductionHandlerBoundaryReady, false);
  assert.equal(overclaim.eshkolProductionHandlerBoundaryHandlerReady, true);
  assert.ok(overclaim.eshkolProductionHandlerBoundaryValidationBlockers.includes(
    'eshkol-production-handler-boundary-handler-readiness-overstated'
  ));
});

test('ULG v0.5 artifact summary exposes Eshkol closure bundle readiness', () => {
  const task = adaptUlgV05TaskCapsule({
    taskId: 'task-eshkol-bundle-1',
    rootTaskId: 'task-eshkol-bundle-1',
    serviceId: 'eshkol',
    taskKind: 'eshkol.closure.derive',
    inputHash: 'ulg:input-eshkol-bundle',
    methodHash: 'ulg:method-eshkol-bundle',
    outputs: [{ artifactKind: 'closure' }],
    resources: { priority: 'simulation', gpu: 'optional' },
    validation: { toleranceProfile: 'scientific-default' },
    provenance: { source: 'ulg-fixture' }
  });
  const artifact = {
    closureId: 'eshkol:881d9a92d523921d',
    sourceService: 'eshkol',
    closureKind: 'wasm-reference',
    execution: {
      backend: 'llvm-wasm',
      serviceWorkerSafe: true,
      entryExport: 'main',
      entrySignature: {
        parameters: ['i32', 'i32'],
        results: ['i32']
      },
      hasStartSection: false,
      startFunctionIndex: null,
      imports: [
        { module: 'env', name: 'memory', kind: 'memory' },
        { module: 'env', name: '__stack_pointer', kind: 'global' },
        { module: 'env', name: '__indirect_function_table', kind: 'table' },
        { module: 'env', name: 'eshkol_runtime_init', kind: 'function' },
        { module: 'env', name: 'fputc', kind: 'function' }
      ],
      exports: [
        { name: 'main', kind: 'function' }
      ],
      wasmMetadata: {
        functionCount: 18,
        hasStartSection: false,
        startFunctionIndex: null,
        types: [
          { parameters: [], results: [] },
          { parameters: ['i32', 'i32'], results: ['i32'] }
        ]
      },
      module: {
        url: 'hello.wasm',
        sha256: 'sha256:1a4699680cc14ba3cefa78634c1d52425c4d4158e590aa2e3658d3c7cae9f79c'
      }
    },
    validity: {
      requiresDynamicCode: false,
      requiresHostImports: true
    },
    runtime: {
      bundleManifest: {
        schema: 'eshkol.ulg.closure-bundle.v0',
        copyFiles: [
          'hello.ulg.json',
          'hello.wasm',
          'eshkol-host-imports.js',
          'schemas/ulg/closure_artifact.schema.json'
        ],
        hostImports: {
          path: 'eshkol-host-imports.js',
          sha256: 'sha256:a769ff71f1d1695d512c4197ea6e0169884450deff60376fd90f6ceecd826b4d',
          factory: 'createEshkolHostImportObject',
          global: 'EshkolHostImports',
          domFree: true
        },
        preserveRelativeUrls: true
      },
      assetProbe: {
        assets: [{
          kind: 'hostImportsModule',
          status: 'ready',
          url: '/service-assets/eshkol/closures/magnetar-closure/eshkol-host-imports.js'
        }]
      },
      hostImportsFactory: {
        status: 'ready',
        module: '/service-assets/eshkol/closures/magnetar-closure/eshkol-host-imports.js',
        global: 'EshkolHostImports',
        factory: 'createEshkolHostImportObject',
        factoryReady: true,
        tensorBindingReady: true,
        requirementsSchema: 'eshkol.ulg.production-host-import-candidate.v0',
        requirementsStatus: 'production-candidate-runtime-imports-implemented',
        runtimeScope: 'production-candidate-host-imports',
        implementationStatus: 'production-candidate-runtime-imports-present',
        runtimeSmokeStubsAllowed: false,
        requiredNonStubImportCount: 23,
        readinessRequirementCount: 4,
        blockerCount: 2
      }
    },
    validation: {
      status: 'pass',
      validationMode: 'eshkol-static-closure-smoke',
      outputSemantics: {
        schema: ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA,
        semanticScope: 'smoke-fixture',
        scientificScope: 'none',
        entryExport: 'main',
        entryArgs: [0, 0],
        expectedEntryResult: 0,
        stdout: {
          sha256: 'sha256:675d2e8686b6a85ffaa5751fba535c108d23ba941f1890d0a102619ec2cdf20d',
          byteLength: 16
        },
        scientificValidation: false
      }
    },
    provenance: { source: 'eshkol-export-helper' },
    contentHash: 'ulg:fixture-result-eshkol-bundle-001'
  };
  const result = createUlgV05ArtifactResult(task, artifact);

  assert.equal(result.artifactSummary.schema, ULG_ARTIFACT_SUMMARY_SCHEMA);
  assert.equal(result.artifactSummary.artifactKind, 'closure');
  assert.equal(result.artifactSummary.artifactId, 'eshkol:881d9a92d523921d');
  assert.equal(result.artifactSummary.validationStatus, 'pass');
  assert.equal(result.artifactSummary.closureKind, 'wasm-reference');
  assert.equal(result.artifactSummary.closureModuleUrl, 'hello.wasm');
  assert.equal(result.artifactSummary.closureModuleSha256, 'sha256:1a4699680cc14ba3cefa78634c1d52425c4d4158e590aa2e3658d3c7cae9f79c');
  assert.equal(result.artifactSummary.closureServiceWorkerSafe, true);
  assert.equal(result.artifactSummary.closureRequiresDynamicCode, false);
  assert.equal(result.artifactSummary.closureRequiresHostImports, true);
  assert.equal(result.artifactSummary.closureEntryExport, 'main');
  assert.deepEqual(result.artifactSummary.closureEntrySignature, {
    parameters: ['i32', 'i32'],
    results: ['i32']
  });
  assert.equal(result.artifactSummary.closureHasStartSection, false);
  assert.equal(result.artifactSummary.closureStartFunctionIndex, null);
  assert.equal(result.artifactSummary.closureImportCount, 5);
  assert.equal(result.artifactSummary.closureExportCount, 1);
  assert.equal(result.artifactSummary.closureRuntimeFunctionImportCount, 2);
  assert.equal(result.artifactSummary.closureRuntimeMemoryImportCount, 1);
  assert.equal(result.artifactSummary.closureRuntimeGlobalImportCount, 1);
  assert.equal(result.artifactSummary.closureRuntimeTableImportCount, 1);
  assert.equal(result.artifactSummary.closureWasmFunctionCount, 18);
  assert.equal(result.artifactSummary.closureWasmTypeCount, 2);
  assert.equal(result.artifactSummary.closureBundleManifestSchema, 'eshkol.ulg.closure-bundle.v0');
  assert.equal(result.artifactSummary.closureBundleCopyFileCount, 4);
  assert.equal(result.artifactSummary.closureBundlePreserveRelativeUrls, true);
  assert.equal(result.artifactSummary.closureHostImportsPath, 'eshkol-host-imports.js');
  assert.equal(result.artifactSummary.closureHostImportsSha256, 'sha256:a769ff71f1d1695d512c4197ea6e0169884450deff60376fd90f6ceecd826b4d');
  assert.equal(result.artifactSummary.closureHostImportsFactory, 'createEshkolHostImportObject');
  assert.equal(result.artifactSummary.closureHostImportsGlobal, 'EshkolHostImports');
  assert.equal(result.artifactSummary.closureHostImportsDomFree, true);
  assert.equal(
    result.artifactSummary.closureHostImportsModule,
    '/service-assets/eshkol/closures/magnetar-closure/eshkol-host-imports.js'
  );
  assert.equal(result.artifactSummary.closureHostImportsAssetStatus, 'ready');
  assert.equal(result.artifactSummary.closureHostImportsFactoryStatus, 'ready');
  assert.equal(result.artifactSummary.closureHostImportsFactoryReady, true);
  assert.equal(
    result.artifactSummary.closureHostImportsRequirementsSchema,
    'eshkol.ulg.production-host-import-candidate.v0'
  );
  assert.equal(
    result.artifactSummary.closureHostImportsRequirementsStatus,
    'production-candidate-runtime-imports-implemented'
  );
  assert.equal(result.artifactSummary.closureHostImportsRuntimeScope, 'production-candidate-host-imports');
  assert.equal(
    result.artifactSummary.closureHostImportsImplementationStatus,
    'production-candidate-runtime-imports-present'
  );
  assert.equal(result.artifactSummary.closureHostImportsRequiredNonStubImportCount, 23);
  assert.equal(result.artifactSummary.closureOutputSemanticsSchema, ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA);
  assert.equal(result.artifactSummary.closureOutputSemanticsReady, true);
  assert.equal(result.artifactSummary.closureOutputSemanticScope, 'smoke-fixture');
  assert.equal(result.artifactSummary.closureOutputScientificScope, 'none');
  assert.equal(result.artifactSummary.closureOutputScientificValidation, false);
  assert.equal(result.artifactSummary.closureOutputExpectedEntryExport, 'main');
  assert.deepEqual(result.artifactSummary.closureOutputExpectedEntryArgs, [0, 0]);
  assert.equal(result.artifactSummary.closureOutputExpectedEntryResult, 0);
  assert.equal(result.artifactSummary.closureOutputExpectedStdoutSha256, 'sha256:675d2e8686b6a85ffaa5751fba535c108d23ba941f1890d0a102619ec2cdf20d');
  assert.equal(result.artifactSummary.closureOutputExpectedStdoutByteLength, 16);
  assert.equal(result.artifactSummary.closureReady, true);
  assert.equal(result.outputs[0].artifactSummary.closureReady, true);
});

test('Eshkol descriptor-only closure summary is accepted without output semantics', () => {
  const artifact = {
    artifactId: 'eshkol:magnetar-closure-descriptor',
    artifactKind: 'closure',
    sourceService: 'eshkol',
    closureKind: 'magnetar-closure-descriptor',
    validation: {
      status: 'descriptor-only',
      validationMode: 'eshkol-magnetar-closure-descriptor',
      closureDescriptor: {
        schema: ESHKOL_MAGNETAR_CLOSURE_DESCRIPTOR_SCHEMA,
        status: 'closure-descriptor-ready',
        scope: 'magnetar-descriptor-fixture',
        scientificValidation: false
      }
    },
    execution: {
      serviceWorkerSafe: true
    },
    validity: {
      requiresDynamicCode: false,
      requiresHostImports: false
    },
    contentHash: 'ulg:fixture-magnetar-descriptor-001'
  };
  const summary = summarizeUlgArtifact('closure', artifact);

  assert.equal(summary.artifactKind, 'closure');
  assert.equal(summary.artifactId, 'eshkol:magnetar-closure-descriptor');
  assert.equal(summary.validationStatus, 'descriptor-only');
  assert.equal(summary.closureKind, 'magnetar-closure-descriptor');
  assert.equal(summary.closureDescriptorSchema, ESHKOL_MAGNETAR_CLOSURE_DESCRIPTOR_SCHEMA);
  assert.equal(summary.closureDescriptorReady, true);
  assert.equal(summary.closureDescriptorStatus, 'closure-descriptor-ready');
  assert.equal(summary.closureDescriptorScope, 'magnetar-descriptor-fixture');
  assert.equal(summary.closureDescriptorScientificValidation, false);
  assert.equal(summary.closureOutputSemanticsSchema, null);
  assert.equal(summary.closureOutputSemanticsReady, false);
  assert.equal(summary.closureReady, true);

  const handoff = normalizeUlgDemoHandoff({
    schema: ULG_DEMO_HANDOFF_SCHEMA,
    artifactCount: 1,
    artifacts: [{
      artifactKind: 'closure',
      artifact,
      wasmBytes: [0, 97, 115, 109]
    }]
  }, {
    requireTransferManifest: false
  });

  assert.equal(handoff.closureArtifacts[0].closureDescriptorReady, true);
  assert.equal(handoff.closureArtifacts[0].closureReady, true);
  assert.equal(handoff.closureArtifacts[0].hasTransferredWasmBytes, true);
  assert.equal(handoff.blockers.includes('eshkol-closure-wasm-bytes-missing'), false);

  const descriptorArtifact = createEshkolMagnetarDescriptorArtifact();
  const metadataOnlyHandoff = normalizeUlgDemoHandoff({
    schema: ULG_DEMO_HANDOFF_SCHEMA,
    artifactCount: 1,
    artifacts: [{
      ref: {
        uri: 'artifact://eshkol-magnetar-descriptor',
        artifactHash: descriptorArtifact.contentHash,
        sourceService: 'eshkol'
      },
      artifactKind: 'closure',
      artifact: descriptorArtifact
    }]
  }, {
    requireTransferManifest: false
  });

  assert.equal(metadataOnlyHandoff.closureArtifacts[0].closureDescriptorReady, true);
  assert.equal(metadataOnlyHandoff.closureArtifacts[0].hasTransferredWasmBytes, false);
  assert.equal(metadataOnlyHandoff.closureArtifacts[0].transfer.wasmTransferMode, 'artifact-metadata-only');
  assert.equal(metadataOnlyHandoff.closureArtifacts[0].transfer.relaySafe, true);
  assert.equal(metadataOnlyHandoff.blockers.includes('eshkol-closure-wasm-bytes-missing'), false);
  assert.equal(metadataOnlyHandoff.blockers.includes('eshkol-closure-wasm-sha256-missing'), false);
});

test('Eshkol dispatch adapter blocks production handler boundary overclaims', async () => {
  const artifact = createEshkolMagnetarDescriptorArtifact();
  artifact.validation.closureDescriptor.descriptorBinding.productionHandlerBoundary =
    createEshkolProductionHandlerBoundary({ runtimeExecution: true });
  const artifactSummary = summarizeUlgArtifact('closure', artifact);
  const serviceIds = { eshkol: 'eshkol-ulg-fixture' };
  const manifest = normalizeComputeServiceManifest(
    createUlgDispatchServiceManifests({ serviceIds }).find((entry) => entry.serviceId === serviceIds.eshkol)
  );
  const registry = new ComputeServiceRegistry([manifest]);
  const supervisor = new WorkerSupervisor({
    registry,
    workerFactory: (serviceManifest) => new UlgDispatchServiceHost(serviceManifest)
  });

  const result = await supervisor.submitTask({
    serviceId: serviceIds.eshkol,
    taskKind: 'eshkol.ulg.closure.descriptor-bind',
    taskId: 'task:eshkol-boundary-overclaim',
    rootTaskId: 'root:eshkol-boundary-overclaim',
    artifactPayload: {
      schema: ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA,
      handoffId: 'handoff:eshkol-boundary-overclaim',
      dispatchId: 'dispatch:eshkol-boundary-overclaim',
      index: 0,
      sourceService: 'eshkol',
      artifactKind: 'closure',
      artifactRefUri: 'artifact://eshkol-boundary-overclaim',
      artifactContentHash: artifact.contentHash,
      artifactSummary,
      artifact,
      validationStatus: 'descriptor-only',
      wasmBytes: null,
      wasmByteLength: null,
      hasTransferredWasmBytes: false
    }
  });

  assert.equal(result.ready, false);
  assert.equal(result.serviceStatus, 'blocked');
  assert.ok(result.blockers.includes('eshkol-production-handler-boundary-runtime-execution-overstated'));
  assert.equal(result.probe.descriptorProbe.productionHandlerBoundary.ready, false);
  assert.equal(result.probe.descriptorProbe.productionHandlerBoundary.runtimeExecution, true);
  assert.equal(result.probe.descriptorProbe.productionHandlerBoundary.handlerReady, false);
  assert.equal(result.probe.descriptorProbe.productionHandlerBoundary.scientificValidation, false);
  assert.equal(result.probe.descriptorProbe.productionHandlerBoundary.fullPhysicsValidation, false);
  assert.equal(result.probe.descriptorProbe.productionHandlerBoundary.fullFidelityMagnetarSimulation, false);
});

test('ULG demo handoff adapter classifies calibration, closure, and transferred WASM bytes', () => {
  const handoff = normalizeUlgDemoHandoff({
    schema: ULG_DEMO_HANDOFF_SCHEMA,
    createdAt: '2026-06-05T23:31:11.000Z',
    artifactCount: 2,
    artifacts: [{
      ref: {
        uri: 'artifact://moonlab-calibration',
        artifactHash: 'sha256:moonlab-calibration-artifact',
        sourceService: 'moonlab',
        createdAt: 10
      },
      artifactKind: 'quantum-response',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'quantum-response',
        sourceService: 'moonlab',
        magnetarDipoleIsingReady: true,
        magnetarDipoleIsingStatus: 'pass',
        magnetarDipoleIsingParityStatus: 'pass',
        magnetarDipoleIsingGroundState: '000',
        magnetarDipoleIsingMaxEnergyDelta: 0,
        magnetarDipoleIsingEvaluatedBitstrings: 8
      },
      artifact: {
        artifactId: 'artifact:moonlab-calibration',
        sourceService: 'moonlab',
        outputs: {
          reference: {
            schema: 'moonlab.magnetar-dipole-ising-reference.v0',
            role: 'peercompute-reference-tolerance-input',
            contractHash: 'sha256:moonlab-magnetar-reference',
            energyUnits: 'normalized-ising',
            observables: {
              groundState: {
                bitString: '000',
                referenceEnergy: -0.9375
              }
            },
            tolerances: {
              energyAbs: 1e-9,
              maxObservedEnergyDelta: 0
            },
            validation: {
              parityPassed: true,
              maxEnergyDelta: 0,
              evaluatedBitstrings: 8
            }
          }
        }
      }
    }, {
      ref: {
        uri: 'artifact://eshkol-closure',
        artifactHash: 'sha256:eshkol-closure-artifact',
        sourceService: 'eshkol',
        createdAt: 11
      },
      artifactKind: 'closure',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'closure',
        artifactId: 'eshkol:881d9a92d523921d',
        sourceService: 'eshkol',
        validationStatus: 'pass',
        closureReady: true,
        closureKind: 'wasm-reference',
        closureModuleUrl: 'hello.wasm',
        closureModuleSha256: 'sha256:1a4699680cc14ba3cefa78634c1d52425c4d4158e590aa2e3658d3c7cae9f79c',
        closureEntryExport: 'main',
        closureHostImportsFactory: 'createEshkolHostImportObject',
        closureHostImportsDomFree: true,
        closureOutputSemanticsSchema: ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA,
        closureOutputSemanticsReady: true,
        closureOutputSemanticScope: 'smoke-fixture',
        closureOutputScientificScope: 'none',
        closureOutputScientificValidation: false,
        closureOutputExpectedEntryExport: 'main',
        closureOutputExpectedEntryArgs: [0, 0],
        closureOutputExpectedEntryResult: 0,
        closureOutputExpectedStdoutSha256: 'sha256:675d2e8686b6a85ffaa5751fba535c108d23ba941f1890d0a102619ec2cdf20d',
        closureOutputExpectedStdoutByteLength: 16
      },
      artifact: {
        closureId: 'eshkol:881d9a92d523921d',
        sourceService: 'eshkol',
        runtime: {
          bundleManifest: {
            schema: 'eshkol.ulg.closure-bundle.v0',
            preserveRelativeUrls: true
          }
        }
      },
      wasmBytes: [0, 97, 115, 109],
      wasmByteLength: 4,
      wasmSourceUrl: '/service-assets/eshkol/closures/hello/hello.wasm'
    }]
  }, { receivedAt: '2026-06-05T23:32:00.000Z' });

  assert.equal(handoff.schema, ULG_DEMO_HANDOFF_ADAPTER_SCHEMA);
  assert.equal(handoff.sourceSchema, ULG_DEMO_HANDOFF_SCHEMA);
  assert.equal(handoff.acceptedSourceSchema, true);
  assert.equal(handoff.status, 'handoff-ready');
  assert.equal(handoff.ready, true);
  assert.deepEqual(handoff.blockers, []);
  assert.equal(handoff.declaredArtifactCount, 2);
  assert.equal(handoff.artifactCount, 2);
  assert.equal(handoff.calibrationArtifacts.length, 1);
  assert.equal(handoff.closureArtifacts.length, 1);
  assert.equal(handoff.closureArtifactsWithBytes.length, 1);
  assert.equal(handoff.transferManifest.schema, ULG_HANDOFF_TRANSFER_MANIFEST_SCHEMA);
  assert.equal(handoff.transferManifest.ready, true);
  assert.equal(handoff.transferManifest.artifactCount, 2);
  assert.equal(handoff.transferManifest.relaySafeArtifactCount, 2);
  assert.equal(handoff.transferManifest.transferredWasmArtifactCount, 1);
  assert.equal(handoff.transferManifest.transferredWasmByteLength, 4);
  assert.deepEqual(handoff.transferBlockers, []);
  assert.equal(handoff.transferReady, true);
  assert.equal(handoff.artifacts[0].transfer.artifactContentHash, 'sha256:moonlab-calibration-artifact');
  assert.equal(handoff.artifacts[0].transfer.relaySafe, true);
  assert.equal(handoff.readyClosureArtifact.transfer.wasmTransferMode, 'inline-byte-array');
  assert.equal(handoff.readyClosureArtifact.transfer.wasmSha256, 'sha256:1a4699680cc14ba3cefa78634c1d52425c4d4158e590aa2e3658d3c7cae9f79c');
  assert.equal(handoff.readyClosureArtifact.transfer.relaySafe, true);
  assert.equal(handoff.readyCalibrationArtifact.sourceService, 'moonlab');
  assert.equal(handoff.readyCalibrationArtifact.artifactSummary.magnetarDipoleIsingGroundState, '000');
  assert.equal(handoff.readyCalibrationArtifact.artifactSummary.magnetarReferenceReady, true);
  assert.equal(handoff.readyCalibrationArtifact.artifactSummary.magnetarReferenceSchema, 'moonlab.magnetar-dipole-ising-reference.v0');
  assert.equal(handoff.readyCalibrationArtifact.artifactSummary.magnetarReferenceContractHash, 'sha256:moonlab-magnetar-reference');
  assert.equal(handoff.readyCalibrationArtifact.artifactSummary.magnetarReferenceGroundStateBitString, '000');
  assert.equal(handoff.readyCalibrationArtifact.artifactSummary.magnetarReferenceToleranceEnergyAbs, 1e-9);
  assert.equal(handoff.readyCalibrationArtifact.artifactSummary.magnetarReferenceValidationStatus, 'pass');
  assert.equal(handoff.readyClosureArtifact.sourceService, 'eshkol');
  assert.equal(handoff.readyClosureArtifact.hasTransferredWasmBytes, true);
  assert.equal(handoff.readyClosureArtifact.closureOutputSemanticsReady, true);
  assert.equal(handoff.readyClosureArtifact.artifactSummary.closureOutputSemanticScope, 'smoke-fixture');
  assert.equal(handoff.readyClosureArtifact.artifactSummary.closureOutputExpectedStdoutByteLength, 16);
  assert.equal(handoff.readyClosureArtifact.wasmByteLength, 4);
  assert.deepEqual(handoff.readyClosureArtifact.wasmBytes, [0, 97, 115, 109]);
  assert.equal(handoff.readyClosureArtifact.bundleManifest.schema, 'eshkol.ulg.closure-bundle.v0');

  const blocked = normalizeUlgDemoHandoff({
    schema: ULG_DEMO_HANDOFF_SCHEMA,
    artifacts: [{
      artifactKind: 'closure',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'closure',
        sourceService: 'eshkol',
        closureReady: true
      },
      artifact: { sourceService: 'eshkol' }
    }]
  }, { receivedAt: '2026-06-05T23:33:00.000Z' });
  assert.equal(blocked.ready, false);
  assert.ok(blocked.blockers.includes('moonlab-magnetar-calibration-summary-missing'));
  assert.ok(blocked.blockers.includes('eshkol-closure-wasm-bytes-missing'));
  assert.ok(blocked.blockers.includes('ulg-artifact-ref-uri-missing'));
  assert.ok(blocked.blockers.includes('ulg-artifact-content-hash-missing'));
  assert.ok(blocked.blockers.includes('eshkol-closure-wasm-sha256-missing'));
  assert.equal(blocked.transferReady, false);
  assert.equal(blocked.transferManifest.relaySafeArtifactCount, 0);

  const empty = normalizeUlgDemoHandoff({
    schema: ULG_DEMO_HANDOFF_SCHEMA,
    artifactCount: 0,
    artifacts: []
  }, { receivedAt: '2026-06-05T23:34:00.000Z' });
  assert.equal(empty.ready, false);
  assert.equal(empty.transferReady, false);
  assert.equal(empty.transferManifest.ready, false);
  assert.equal(empty.transferManifest.artifactCount, 0);
  assert.ok(empty.transferBlockers.includes('ulg-handoff-artifacts-missing'));
  assert.ok(empty.blockers.includes('ulg-handoff-artifacts-missing'));
});

test('ULG handoff service envelope preserves relay-safe content-addressed artifact refs', () => {
  const envelope = createUlgHandoffServiceEnvelope({
    schema: ULG_DEMO_HANDOFF_SCHEMA,
    createdAt: '2026-06-05T23:31:11.000Z',
    artifactCount: 2,
    artifacts: [{
      ref: {
        uri: 'artifact://moonlab-calibration',
        artifactHash: 'sha256:moonlab-calibration-artifact',
        sourceService: 'moonlab'
      },
      artifactKind: 'quantum-response',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'quantum-response',
        sourceService: 'moonlab',
        magnetarDipoleIsingReady: true,
        magnetarDipoleIsingStatus: 'pass',
        magnetarDipoleIsingParityStatus: 'pass',
        magnetarDipoleIsingGroundState: '000',
        magnetarReferenceReady: true,
        magnetarReferenceContractHash: 'sha256:moonlab-magnetar-reference'
      }
    }, {
      ref: {
        uri: 'artifact://eshkol-closure',
        artifactHash: 'sha256:eshkol-closure-artifact',
        sourceService: 'eshkol'
      },
      artifactKind: 'closure',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'closure',
        sourceService: 'eshkol',
        validationStatus: 'pass',
        closureReady: true,
        closureModuleSha256: 'sha256:1a4699680cc14ba3cefa78634c1d52425c4d4158e590aa2e3658d3c7cae9f79c',
        closureOutputSemanticsReady: true
      },
      artifact: {
        closureId: 'eshkol:881d9a92d523921d',
        sourceService: 'eshkol',
        runtime: {
          bundleManifest: {
            schema: 'eshkol.ulg.closure-bundle.v0',
            preserveRelativeUrls: true
          }
        }
      },
      wasmBytes: [0, 97, 115, 109],
      wasmByteLength: 4
    }]
  }, {
    receivedAt: '2026-06-05T23:32:00.000Z',
    origin: 'http://localhost:5173',
    url: 'http://localhost:5173/?demo=ulg',
    source: 'ulg-demo-browser-cache'
  });

  assert.equal(envelope.schema, ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA);
  assert.equal(envelope.sourceSchema, ULG_DEMO_HANDOFF_SCHEMA);
  assert.equal(envelope.adapterSchema, ULG_DEMO_HANDOFF_ADAPTER_SCHEMA);
  assert.equal(envelope.status, 'service-envelope-ready');
  assert.equal(envelope.ready, true);
  assert.deepEqual(envelope.blockers, []);
  assert.equal(envelope.artifactCount, 2);
  assert.equal(envelope.contentAddressedArtifactCount, 2);
  assert.equal(envelope.relaySafeArtifactCount, 2);
  assert.equal(envelope.readyArtifactCount, 2);
  assert.equal(envelope.provenance.contentAddressed, true);
  assert.equal(envelope.provenance.relaySafe, true);
  assert.equal(envelope.provenance.transferManifestReady, true);
  assert.deepEqual(envelope.source.serviceIds, ['moonlab', 'eshkol']);
  assert.equal(envelope.source.origin, 'http://localhost:5173');
  assert.equal(envelope.transferManifest.schema, ULG_HANDOFF_TRANSFER_MANIFEST_SCHEMA);
  assert.equal(envelope.transferManifest.ready, true);
  assert.equal(envelope.handoff.schema, ULG_DEMO_HANDOFF_ADAPTER_SCHEMA);
  assert.equal(envelope.handoff.ready, true);
  assert.equal(envelope.artifactRefs[0].artifactRefUri, 'artifact://moonlab-calibration');
  assert.equal(envelope.artifactRefs[0].artifactContentHash, 'sha256:moonlab-calibration-artifact');
  assert.equal(envelope.artifactRefs[0].contentAddressed, true);
  assert.equal(envelope.artifactRefs[0].ready, true);
  assert.equal(envelope.artifactRefs[1].artifactRefUri, 'artifact://eshkol-closure');
  assert.equal(envelope.artifactRefs[1].wasmTransferMode, 'inline-byte-array');
  assert.equal(envelope.artifactRefs[1].wasmByteLength, 4);
  assert.equal(envelope.artifactRefs[1].wasmSha256, 'sha256:1a4699680cc14ba3cefa78634c1d52425c4d4158e590aa2e3658d3c7cae9f79c');
  assert.equal(envelope.artifactRefs[1].hasTransferredWasmBytes, true);
  assert.equal(envelope.artifactRefs[1].closureOutputSemanticsReady, true);
  assert.equal(envelope.handoffId.includes('sha256:moonlab-calibration-artifact'), true);

  const blocked = createUlgHandoffServiceEnvelope({
    schema: ULG_DEMO_HANDOFF_SCHEMA,
    artifacts: [{
      artifactKind: 'closure',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'closure',
        sourceService: 'eshkol',
        closureReady: true
      },
      artifact: { sourceService: 'eshkol' }
    }]
  }, { receivedAt: '2026-06-05T23:33:00.000Z' });

  assert.equal(blocked.status, 'service-envelope-pending');
  assert.equal(blocked.ready, false);
  assert.equal(blocked.provenance.contentAddressed, false);
  assert.equal(blocked.provenance.relaySafe, false);
  assert.equal(blocked.artifactRefs.length, 1);
  assert.equal(blocked.artifactRefs[0].contentAddressed, false);
  assert.equal(blocked.artifactRefs[0].ready, false);
  assert.ok(blocked.blockers.includes('moonlab-magnetar-calibration-summary-missing'));
  assert.ok(blocked.blockers.includes('eshkol-closure-wasm-bytes-missing'));
  assert.ok(blocked.blockers.includes('ulg-artifact-ref-uri-missing'));
  assert.ok(blocked.blockers.includes('ulg-artifact-content-hash-missing'));
  assert.ok(blocked.blockers.includes('eshkol-closure-wasm-sha256-missing'));
  assert.ok(blocked.blockers.includes('ulg-handoff-transfer-manifest-not-ready'));
});

test('ULG handoff service host stores durable envelopes through WorkerSupervisor', async () => {
  const handoff = {
    schema: ULG_DEMO_HANDOFF_SCHEMA,
    createdAt: '2026-06-06T14:45:00.000Z',
    artifactCount: 2,
    artifacts: [{
      ref: {
        uri: 'artifact://moonlab-calibration',
        artifactHash: 'sha256:moonlab-calibration-artifact',
        sourceService: 'moonlab'
      },
      artifactKind: 'quantum-response',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'quantum-response',
        sourceService: 'moonlab',
        magnetarDipoleIsingReady: true,
        magnetarDipoleIsingStatus: 'pass',
        magnetarDipoleIsingParityStatus: 'pass',
        magnetarDipoleIsingGroundState: '000',
        moonlabWebGpuParityScopeReady: true,
        moonlabWebGpuParityScopeSchema: MOONLAB_WEBGPU_COMPLEX64_PARITY_SCOPE_SCHEMA,
        moonlabWebGpuParityScopeStatus: 'scope-ready-backend-unavailable',
        moonlabWebGpuParityScopeBackendAvailable: false,
        moonlabWebGpuParityScopeWebgpuParityExecuted: false,
        moonlabWebGpuParityScopeFullFidelityMagnetarSimulation: false,
        moonlabWebGpuParityScopeFullPhysicsValidation: false,
        moonlabWebGpuParityScope: createMoonLabWebGpuComplex64ParityScope()
      }
    }, {
      ref: {
        uri: 'artifact://eshkol-closure',
        artifactHash: 'sha256:eshkol-closure-artifact',
        sourceService: 'eshkol'
      },
      artifactKind: 'closure',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'closure',
        sourceService: 'eshkol',
        validationStatus: 'descriptor-only',
        closureReady: true,
        closureDescriptorReady: true,
        closureModuleSha256: 'sha256:1a4699680cc14ba3cefa78634c1d52425c4d4158e590aa2e3658d3c7cae9f79c'
      },
      artifact: {
        closureId: 'eshkol:magnetar-closure-descriptor',
        sourceService: 'eshkol'
      },
      wasmBytes: [0, 97, 115, 109],
      wasmByteLength: 4
    }]
  };
  const manifest = normalizeComputeServiceManifest(createUlgHandoffServiceManifest({
    serviceId: 'ulg-handoff-fixture'
  }));
  const registry = new ComputeServiceRegistry([manifest]);
  const artifactCache = new InMemoryArtifactCache(() => 4242);
  const supervisor = new WorkerSupervisor({
    registry,
    artifactCache,
    workerFactory: (serviceManifest) => new UlgHandoffServiceHost(serviceManifest, {
      origin: 'http://localhost:5173',
      url: 'http://localhost:5173/',
      receivedAt: '2026-06-06T14:45:01.000Z'
    })
  });

  const result = await supervisor.submitTask({
    schema: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    serviceId: 'ulg-handoff-fixture',
    taskKind: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    taskId: 'task:ulg-handoff-envelope',
    rootTaskId: 'root:ulg-handoff-envelope',
    handoff
  });

  assert.equal(result.schema, ULG_HANDOFF_SERVICE_RESULT_SCHEMA);
  assert.equal(result.adapterSchema, ULG_HANDOFF_SERVICE_ADAPTER_SCHEMA);
  assert.equal(result.status, 'complete');
  assert.equal(result.ready, true);
  assert.equal(result.envelope.schema, ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA);
  assert.equal(result.envelope.status, 'service-envelope-ready');
  assert.equal(result.envelope.relaySafeArtifactCount, 2);
  assert.equal(result.envelope.contentAddressedArtifactCount, 2);
  assert.deepEqual(result.envelope.blockers, []);
  assert.equal(result.artifact.schema, ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA);
  assert.equal(result.artifact.artifactKind, 'ulg-handoff-service-envelope');
  assert.equal(result.artifact.ready, true);
  assert.equal(result.artifactRef.sourceService, 'ulg-handoff-fixture');

  const cached = await artifactCache.get(result.artifactRef);
  assert.equal(cached.envelope.schema, ULG_HANDOFF_SERVICE_ENVELOPE_SCHEMA);
  assert.equal(cached.envelope.ready, true);
  assert.equal(cached.envelope.artifactRefs[1].hasTransferredWasmBytes, true);

  const telemetry = supervisor.getTreeTelemetry();
  assert.equal(telemetry.services[0].contract.schema, ULG_HANDOFF_SERVICE_ADAPTER_SCHEMA);
  assert.equal(telemetry.artifacts[0].ref.uri, result.artifactRef.uri);
  assert.equal(telemetry.tasks[0].artifactRef.uri, result.artifactRef.uri);
});

test('ULG handoff service host dispatches envelope refs to Eshkol and MoonLab executors', async () => {
  const handoff = {
    schema: ULG_DEMO_HANDOFF_SCHEMA,
    createdAt: '2026-06-06T15:20:00.000Z',
    artifactCount: 2,
    artifacts: [{
      ref: {
        uri: 'artifact://moonlab-calibration',
        artifactHash: 'sha256:moonlab-calibration-artifact',
        sourceService: 'moonlab'
      },
      artifactKind: 'quantum-response',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'quantum-response',
        sourceService: 'moonlab',
        magnetarDipoleIsingReady: true,
        magnetarDipoleIsingStatus: 'pass',
        magnetarDipoleIsingParityStatus: 'pass',
        magnetarDipoleIsingGroundState: '000',
        moonlabWebGpuParityScopeReady: true,
        moonlabWebGpuParityScopeSchema: MOONLAB_WEBGPU_COMPLEX64_PARITY_SCOPE_SCHEMA,
        moonlabWebGpuParityScopeStatus: 'scope-ready-backend-unavailable',
        moonlabWebGpuParityScopeBackendAvailable: false,
        moonlabWebGpuParityScopeWebgpuParityExecuted: false,
        moonlabWebGpuParityScopeFullFidelityMagnetarSimulation: false,
        moonlabWebGpuParityScopeFullPhysicsValidation: false,
        moonlabWebGpuParityScope: createMoonLabWebGpuComplex64ParityScope()
      }
    }, {
      ref: {
        uri: 'artifact://eshkol-closure',
        artifactHash: 'sha256:eshkol-closure-artifact',
        sourceService: 'eshkol'
      },
      artifactKind: 'closure',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'closure',
        sourceService: 'eshkol',
        validationStatus: 'descriptor-bound',
        closureReady: true,
        closureDescriptorReady: true,
        closureModuleSha256: 'sha256:1a4699680cc14ba3cefa78634c1d52425c4d4158e590aa2e3658d3c7cae9f79c',
        closureOutputSemanticsReady: true
      },
      artifact: {
        closureId: 'eshkol:magnetar-closure-descriptor',
        sourceService: 'eshkol'
      },
      wasmBytes: [0, 97, 115, 109],
      wasmByteLength: 4
    }]
  };
  const serviceIds = {
    eshkol: 'eshkol-ulg-fixture',
    moonlab: 'moonlab-ulg-fixture'
  };
  const envelope = createUlgHandoffServiceEnvelope(handoff, {
    receivedAt: '2026-06-06T15:20:01.000Z'
  });
  const directPlan = createUlgHandoffServiceDispatchPlan(envelope, { serviceIds });

  assert.equal(directPlan.schema, ULG_HANDOFF_SERVICE_DISPATCH_PLAN_SCHEMA);
  assert.equal(directPlan.status, 'dispatch-ready');
  assert.equal(directPlan.ready, true);
  assert.equal(directPlan.dispatchCount, 2);
  assert.deepEqual(directPlan.serviceIds, ['moonlab-ulg-fixture', 'eshkol-ulg-fixture']);
  assert.deepEqual(directPlan.taskKinds, [
    'moonlab.ulg.quantum-response.ingest',
    'eshkol.ulg.closure-artifact.ingest'
  ]);
  assert.equal(directPlan.dispatches[0].serviceId, 'moonlab-ulg-fixture');
  assert.equal(directPlan.dispatches[0].artifactRefUri, 'artifact://moonlab-calibration');
  assert.equal(directPlan.dispatches[1].serviceId, 'eshkol-ulg-fixture');
  assert.equal(directPlan.dispatches[1].hasTransferredWasmBytes, true);
  assert.equal(directPlan.dispatches[1].task.transfer.wasmByteLength, 4);
  assert.deepEqual(directPlan.blockers, []);

  const executedDispatches = [];
  const manifest = normalizeComputeServiceManifest(createUlgHandoffServiceManifest({
    serviceId: 'ulg-handoff-dispatch-fixture'
  }));
  const registry = new ComputeServiceRegistry([manifest]);
  const artifactCache = new InMemoryArtifactCache(() => 4343);
  const supervisor = new WorkerSupervisor({
    registry,
    artifactCache,
    workerFactory: (serviceManifest) => new UlgHandoffServiceHost(serviceManifest, {
      origin: 'http://localhost:5173',
      url: 'http://localhost:5173/',
      receivedAt: '2026-06-06T15:20:02.000Z',
      executeServices: true,
      serviceIds,
      serviceExecutor: async ({ dispatch }) => {
        executedDispatches.push(dispatch);
        return {
          schema: 'peercompute.ulg.fixture.service-dispatch-output.v0',
          dispatchId: dispatch.dispatchId,
          serviceId: dispatch.serviceId,
          sourceService: dispatch.sourceService,
          artifactKind: dispatch.artifactKind,
          taskKind: dispatch.taskKind,
          status: 'accepted',
          ready: true,
          artifactRefUri: dispatch.artifactRefUri
        };
      }
    })
  });

  const result = await supervisor.submitTask({
    schema: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    serviceId: 'ulg-handoff-dispatch-fixture',
    taskKind: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    taskId: 'task:ulg-handoff-dispatch',
    rootTaskId: 'root:ulg-handoff-dispatch',
    handoff
  });

  assert.equal(result.schema, ULG_HANDOFF_SERVICE_RESULT_SCHEMA);
  assert.equal(result.status, 'complete');
  assert.equal(result.ready, true);
  assert.equal(result.dispatchPlan.schema, ULG_HANDOFF_SERVICE_DISPATCH_PLAN_SCHEMA);
  assert.equal(result.dispatchPlan.status, 'dispatch-ready');
  assert.equal(result.dispatchPlan.readyDispatchCount, 2);
  assert.equal(result.dispatchResult.schema, ULG_HANDOFF_SERVICE_DISPATCH_RESULT_SCHEMA);
  assert.equal(result.dispatchResult.status, 'executed');
  assert.equal(result.dispatchResult.executed, true);
  assert.equal(result.dispatchResult.executedDispatchCount, 2);
  assert.equal(result.dispatchResult.acceptedDispatchCount, 2);
  assert.equal(result.dispatchResult.failedDispatchCount, 0);
  assert.deepEqual(result.dispatchResult.blockers, []);
  assert.equal(executedDispatches.length, 2);
  assert.equal(executedDispatches[0].serviceId, 'moonlab-ulg-fixture');
  assert.equal(executedDispatches[1].serviceId, 'eshkol-ulg-fixture');
  assert.equal(executedDispatches[1].task.transfer.hasTransferredWasmBytes, true);
  assert.equal(result.dispatchResult.results[1].output.artifactRefUri, 'artifact://eshkol-closure');
  assert.equal(result.artifact.dispatchPlan.schema, ULG_HANDOFF_SERVICE_DISPATCH_PLAN_SCHEMA);
  assert.equal(result.artifact.dispatchResult.status, 'executed');

  const cached = await artifactCache.get(result.artifactRef);
  assert.equal(cached.dispatchPlan.status, 'dispatch-ready');
  assert.equal(cached.dispatchResult.executedDispatchCount, 2);
});

test('ULG handoff service host submits dispatches to registered Eshkol and MoonLab services', async () => {
  const handoff = {
    schema: ULG_DEMO_HANDOFF_SCHEMA,
    createdAt: '2026-06-06T15:40:00.000Z',
    artifactCount: 2,
    artifacts: [{
      ref: {
        uri: 'artifact://moonlab-calibration',
        artifactHash: 'sha256:moonlab-calibration-artifact',
        sourceService: 'moonlab'
      },
      artifactKind: 'quantum-response',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'quantum-response',
        sourceService: 'moonlab',
        magnetarDipoleIsingReady: true,
        magnetarDipoleIsingStatus: 'pass',
        magnetarDipoleIsingParityStatus: 'pass',
        magnetarDipoleIsingGroundState: '000',
        moonlabWebGpuParityScopeReady: true,
        moonlabWebGpuParityScopeSchema: MOONLAB_WEBGPU_COMPLEX64_PARITY_SCOPE_SCHEMA,
        moonlabWebGpuParityScopeStatus: 'scope-ready-backend-unavailable',
        moonlabWebGpuParityScopeBackendAvailable: false,
        moonlabWebGpuParityScopeWebgpuParityExecuted: false,
        moonlabWebGpuParityScopeFullFidelityMagnetarSimulation: false,
        moonlabWebGpuParityScopeFullPhysicsValidation: false,
        moonlabWebGpuParityScope: createMoonLabWebGpuComplex64ParityScope()
      }
    }, {
      ref: {
        uri: 'artifact://eshkol-closure',
        artifactHash: 'sha256:eshkol-closure-artifact',
        sourceService: 'eshkol'
      },
      artifactKind: 'closure',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'closure',
        sourceService: 'eshkol',
        validationStatus: 'descriptor-bound',
        closureReady: true,
        closureDescriptorReady: true,
        closureModuleSha256: 'sha256:1a4699680cc14ba3cefa78634c1d52425c4d4158e590aa2e3658d3c7cae9f79c',
        closureOutputSemanticsReady: true
      },
      artifact: {
        closureId: 'eshkol:magnetar-closure-descriptor',
        sourceService: 'eshkol'
      },
      wasmBytes: [0, 97, 115, 109],
      wasmByteLength: 4
    }]
  };
  const serviceIds = {
    eshkol: 'eshkol-ulg-fixture',
    moonlab: 'moonlab-ulg-fixture'
  };
  const handlerCalls = [];
  const dispatchHandler = async (context) => {
    handlerCalls.push({
      schema: context.schema,
      serviceId: context.serviceId,
      sourceService: context.sourceService,
      artifactKind: context.artifactKind,
      taskKind: context.taskKind,
      payloadSchema: context.payload.schema,
      probeSchema: context.probe.schema,
      probeStatus: context.probe.status,
      ingestSchema: context.ingest.schema,
      wasmByteLength: context.payload.wasmByteLength ?? null,
      leaseId: context.lease?.leaseId || null
    });
    return {
      schema: 'peercompute.ulg.real-service-adapter-output-fixture.v0',
      status: 'accepted',
      ready: true,
      serviceId: context.serviceId,
      sourceService: context.sourceService,
      artifactKind: context.artifactKind,
      taskKind: context.taskKind,
      payloadSchema: context.payload.schema,
      probeStatus: context.probe.status,
      ingestSchema: context.ingest.schema,
      wasmByteLength: context.payload.wasmByteLength ?? null
    };
  };
  const handoffManifest = normalizeComputeServiceManifest(createUlgHandoffServiceManifest({
    serviceId: 'ulg-handoff-registry-fixture'
  }));
  const registry = new ComputeServiceRegistry([
    handoffManifest,
    ...createUlgDispatchServiceManifests({ serviceIds })
  ]);
  const artifactCache = new InMemoryArtifactCache(() => 4444);
  let supervisor;
  const serviceExecutor = createUlgHandoffSupervisorServiceExecutor({
    getSupervisor: () => supervisor
  });
  supervisor = new WorkerSupervisor({
    registry,
    artifactCache,
    workerFactory: (serviceManifest) => {
      if (serviceManifest.serviceId === 'ulg-handoff-registry-fixture') {
        return new UlgHandoffServiceHost(serviceManifest, {
          origin: 'http://localhost:5173',
          url: 'http://localhost:5173/',
          receivedAt: '2026-06-06T15:40:01.000Z',
          executeServices: true,
          serviceIds,
          serviceExecutor
        });
      }
      return new UlgDispatchServiceHost(serviceManifest, {
        dispatchHandlers: {
          moonlab: dispatchHandler,
          eshkol: dispatchHandler
        }
      });
    }
  });

  const result = await supervisor.submitTask({
    schema: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    serviceId: 'ulg-handoff-registry-fixture',
    taskKind: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    taskId: 'task:ulg-handoff-registry-dispatch',
    rootTaskId: 'root:ulg-handoff-registry-dispatch',
    handoff
  });

  assert.equal(result.schema, ULG_HANDOFF_SERVICE_RESULT_SCHEMA);
  assert.equal(result.ready, true);
  assert.equal(result.dispatchPlan.status, 'dispatch-ready');
  assert.equal(result.dispatchResult.status, 'executed');
  assert.equal(result.dispatchResult.executedDispatchCount, 2);
  assert.equal(result.dispatchResult.acceptedDispatchCount, 2);
  assert.equal(result.dispatchResult.results[0].output.schema, ULG_HANDOFF_SUPERVISOR_EXECUTOR_SCHEMA);
  assert.equal(result.dispatchResult.results[0].output.serviceId, 'moonlab-ulg-fixture');
  assert.equal(result.dispatchResult.results[0].output.serviceResult.schema, ULG_DISPATCH_SERVICE_RESULT_SCHEMA);
  assert.equal(result.dispatchResult.results[0].output.serviceResult.serviceStatus, 'accepted');
  assert.equal(result.dispatchResult.results[0].output.serviceResult.taskKind, 'moonlab.ulg.quantum-response.ingest');
  assert.equal(result.dispatchResult.results[0].output.serviceResult.ingest.schema, 'peercompute.ulg.moonlab-dispatch-ingest.v0');
  assert.equal(result.dispatchResult.results[0].output.serviceResult.ingest.magnetarDipoleIsingReady, true);
  assert.equal(result.dispatchResult.results[0].output.serviceResult.probe.schema, 'peercompute.ulg.moonlab-dispatch-payload-probe.v0');
  assert.equal(result.dispatchResult.results[0].output.serviceResult.probe.ready, true);
  assert.equal(result.dispatchResult.results[0].output.serviceResult.probe.moonlabWebGpuParityScopeReady, true);
  assert.equal(result.dispatchResult.results[0].output.serviceResult.probe.moonlabWebGpuParityScopeBackendAvailable, false);
  assert.equal(result.dispatchResult.results[0].output.serviceResult.probe.moonlabWebGpuParityScopeWebgpuParityExecuted, false);
  assert.equal(result.dispatchResult.results[0].output.serviceResult.probe.moonlabWebGpuParityScopeFullFidelityMagnetarSimulation, false);
  assert.equal(result.dispatchResult.results[0].output.serviceResult.probe.moonlabWebGpuParityScopeFullPhysicsValidation, false);
  assert.equal(result.dispatchResult.results[0].output.serviceResult.serviceOutput.schema, 'peercompute.ulg.real-service-adapter-output-fixture.v0');
  assert.equal(result.dispatchResult.results[0].output.serviceResult.serviceOutput.payloadSchema, ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA);
  assert.equal(result.dispatchResult.results[0].output.serviceResult.serviceOutput.probeStatus, 'pass');
  assert.equal(result.dispatchResult.results[0].output.serviceResult.validation.serviceHandlerReady, true);
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.schema, ULG_HANDOFF_SUPERVISOR_SERVICE_SUMMARY_SCHEMA);
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.serviceStatus, 'accepted');
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.serviceHandlerReady, true);
  assert.deepEqual(result.dispatchResult.results[0].output.serviceSummary.serviceHandlerBlockers, []);
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.serviceHandlerOutputSchema, 'peercompute.ulg.real-service-adapter-output-fixture.v0');
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.serviceHandlerOutputStatus, 'accepted');
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.serviceHandlerOutputReady, true);
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.probeStatus, 'pass');
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.magnetarDipoleIsingReady, true);
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.moonlabWebGpuParityScopeReady, true);
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.moonlabWebGpuParityScopeSchema, MOONLAB_WEBGPU_COMPLEX64_PARITY_SCOPE_SCHEMA);
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.moonlabWebGpuParityScopeBackendAvailable, false);
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.moonlabWebGpuParityScopeWebgpuParityExecuted, false);
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.moonlabWebGpuParityScopeFullFidelityMagnetarSimulation, false);
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.moonlabWebGpuParityScopeFullPhysicsValidation, false);
  assert.equal(result.dispatchResult.results[0].output.serviceSummary.hostRuntimeExecutionReady, null);
  assert.equal(result.dispatchResult.results[0].output.serviceResult.artifact.schema, ULG_DISPATCH_SERVICE_ARTIFACT_SCHEMA);
  assert.equal(result.dispatchResult.results[0].output.serviceResult.artifact.serviceOutput.schema, 'peercompute.ulg.real-service-adapter-output-fixture.v0');
  assert.equal(result.dispatchResult.results[0].output.serviceArtifactRef.sourceService, 'moonlab-ulg-fixture');
  assert.equal(
    result.dispatchResult.results[0].output.serviceTask.artifactPayload.schema,
    ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA
  );
  assert.equal(result.dispatchResult.results[0].output.serviceTask.artifactPayload.artifactKind, 'quantum-response');
  assert.equal(result.dispatchResult.results[0].output.serviceTask.artifactPayload.sourceService, 'moonlab');
  assert.equal(
    result.dispatchResult.results[0].output.serviceTask.artifactPayload.artifactSummary.magnetarDipoleIsingReady,
    true
  );
  assert.equal(result.dispatchResult.results[1].output.serviceId, 'eshkol-ulg-fixture');
  assert.equal(result.dispatchResult.results[1].output.serviceResult.schema, ULG_DISPATCH_SERVICE_RESULT_SCHEMA);
  assert.equal(result.dispatchResult.results[1].output.serviceResult.serviceStatus, 'accepted');
  assert.equal(result.dispatchResult.results[1].output.serviceResult.taskKind, 'eshkol.ulg.closure-artifact.ingest');
  assert.equal(result.dispatchResult.results[1].output.serviceResult.ingest.schema, 'peercompute.ulg.eshkol-dispatch-ingest.v0');
  assert.equal(result.dispatchResult.results[1].output.serviceResult.ingest.closureDescriptorReady, true);
  assert.equal(result.dispatchResult.results[1].output.serviceResult.ingest.wasmByteLength, 4);
  assert.equal(result.dispatchResult.results[1].output.serviceResult.probe.schema, 'peercompute.ulg.eshkol-dispatch-wasm-probe.v0');
  assert.equal(result.dispatchResult.results[1].output.serviceResult.probe.status, 'skipped-short-wasm-header');
  assert.equal(result.dispatchResult.results[1].output.serviceResult.probe.ready, true);
  assert.equal(result.dispatchResult.results[1].output.serviceResult.serviceOutput.schema, 'peercompute.ulg.real-service-adapter-output-fixture.v0');
  assert.equal(result.dispatchResult.results[1].output.serviceResult.serviceOutput.payloadSchema, ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA);
  assert.equal(result.dispatchResult.results[1].output.serviceResult.serviceOutput.probeStatus, 'skipped-short-wasm-header');
  assert.equal(result.dispatchResult.results[1].output.serviceResult.serviceOutput.wasmByteLength, 4);
  assert.equal(result.dispatchResult.results[1].output.serviceResult.validation.serviceHandlerReady, true);
  assert.equal(result.dispatchResult.results[1].output.serviceResult.ingest.moduleCompiled, false);
  assert.equal(result.dispatchResult.results[1].output.serviceSummary.schema, ULG_HANDOFF_SUPERVISOR_SERVICE_SUMMARY_SCHEMA);
  assert.equal(result.dispatchResult.results[1].output.serviceSummary.serviceHandlerReady, true);
  assert.deepEqual(result.dispatchResult.results[1].output.serviceSummary.serviceHandlerBlockers, []);
  assert.equal(result.dispatchResult.results[1].output.serviceSummary.serviceHandlerOutputSchema, 'peercompute.ulg.real-service-adapter-output-fixture.v0');
  assert.equal(result.dispatchResult.results[1].output.serviceSummary.serviceHandlerOutputStatus, 'accepted');
  assert.equal(result.dispatchResult.results[1].output.serviceSummary.serviceHandlerOutputReady, true);
  assert.equal(result.dispatchResult.results[1].output.serviceSummary.probeStatus, 'skipped-short-wasm-header');
  assert.equal(result.dispatchResult.results[1].output.serviceSummary.moduleCompiled, false);
  assert.equal(result.dispatchResult.results[1].output.serviceSummary.closureDescriptorReady, true);
  assert.equal(result.dispatchResult.results[1].output.serviceSummary.closureOutputSemanticsReady, true);
  assert.equal(result.dispatchResult.results[1].output.serviceSummary.wasmByteLength, 4);
  assert.equal(result.dispatchResult.results[1].output.serviceResult.artifact.schema, ULG_DISPATCH_SERVICE_ARTIFACT_SCHEMA);
  assert.equal(result.dispatchResult.results[1].output.serviceResult.artifact.serviceOutput.schema, 'peercompute.ulg.real-service-adapter-output-fixture.v0');
  assert.equal(result.dispatchResult.results[1].output.serviceArtifactRef.sourceService, 'eshkol-ulg-fixture');
  assert.equal(
    result.dispatchResult.results[1].output.serviceTask.artifactPayload.schema,
    ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA
  );
  assert.equal(result.dispatchResult.results[1].output.serviceTask.artifactPayload.artifactKind, 'closure');
  assert.equal(result.dispatchResult.results[1].output.serviceTask.artifactPayload.sourceService, 'eshkol');
  assert.equal(result.dispatchResult.results[1].output.serviceTask.artifactPayload.wasmByteLength, 4);
  assert.deepEqual(result.dispatchResult.results[1].output.serviceTask.artifactPayload.wasmBytes, [0, 97, 115, 109]);
  assert.equal(
    result.dispatchResult.results[1].output.serviceTask.artifactPayload.artifactSummary.closureDescriptorReady,
    true
  );
  assert.equal(result.dispatchResult.results[1].output.serviceTask.transfer.hasTransferredWasmBytes, true);
  assert.equal(result.dispatchResult.results[1].output.serviceTask.transfer.wasmByteLength, 4);
  assert.equal(handlerCalls.length, 2);
  assert.deepEqual(handlerCalls.map((entry) => entry.schema), [
    ULG_DISPATCH_SERVICE_HANDLER_CONTEXT_SCHEMA,
    ULG_DISPATCH_SERVICE_HANDLER_CONTEXT_SCHEMA
  ]);
  assert.deepEqual(handlerCalls.map((entry) => entry.sourceService), ['moonlab', 'eshkol']);
  assert.deepEqual(handlerCalls.map((entry) => entry.payloadSchema), [
    ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA,
    ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA
  ]);
  assert.deepEqual(handlerCalls.map((entry) => entry.probeStatus), ['pass', 'skipped-short-wasm-header']);
  assert.equal(handlerCalls[1].wasmByteLength, 4);

  const telemetry = supervisor.getTreeTelemetry();
  assert.deepEqual(telemetry.services.map((entry) => entry.serviceId).sort(), [
    'eshkol-ulg-fixture',
    'moonlab-ulg-fixture',
    'ulg-handoff-registry-fixture'
  ]);
  assert.equal(telemetry.services.find((entry) => entry.serviceId === 'moonlab-ulg-fixture').telemetry.schema, ULG_DISPATCH_SERVICE_TELEMETRY_SCHEMA);
  assert.equal(telemetry.services.find((entry) => entry.serviceId === 'eshkol-ulg-fixture').telemetry.schema, ULG_DISPATCH_SERVICE_TELEMETRY_SCHEMA);
  assert.equal(telemetry.tasks.length, 3);
  assert.equal(telemetry.tasks.filter((entry) => entry.status === 'complete').length, 3);
  assert.equal(telemetry.artifacts.length, 3);
  assert.deepEqual(telemetry.artifacts.map((entry) => entry.ref.sourceService).sort(), [
    'eshkol-ulg-fixture',
    'moonlab-ulg-fixture',
    'ulg-handoff-registry-fixture'
  ]);
  assert.equal(telemetry.artifacts.find((entry) => entry.ref.uri === result.artifactRef.uri).ref.uri, result.artifactRef.uri);

  const cached = await artifactCache.get(result.artifactRef);
  assert.equal(cached.dispatchResult.results[0].output.serviceResult.serviceId, 'moonlab-ulg-fixture');
  assert.equal(cached.dispatchResult.results[1].output.serviceResult.serviceId, 'eshkol-ulg-fixture');
});

test('ULG handoff service host dispatches descriptor-only Eshkol closures without WASM bytes', async () => {
  const descriptorArtifact = createEshkolMagnetarDescriptorArtifact();
  const handoff = {
    schema: ULG_DEMO_HANDOFF_SCHEMA,
    createdAt: '2026-06-06T16:05:00.000Z',
    artifactCount: 2,
    artifacts: [{
      ref: {
        uri: 'artifact://moonlab-calibration',
        artifactHash: 'sha256:moonlab-calibration-artifact',
        sourceService: 'moonlab'
      },
      artifactKind: 'quantum-response',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'quantum-response',
        sourceService: 'moonlab',
        magnetarDipoleIsingReady: true,
        magnetarDipoleIsingStatus: 'pass'
      }
    }, {
      ref: {
        uri: 'artifact://eshkol-magnetar-descriptor',
        artifactHash: descriptorArtifact.contentHash,
        sourceService: 'eshkol'
      },
      artifactKind: 'closure',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'closure',
        sourceService: 'eshkol',
        validationStatus: 'descriptor-only',
        closureReady: true,
        closureDescriptorReady: true,
        closureDescriptorSchema: ESHKOL_MAGNETAR_CLOSURE_DESCRIPTOR_SCHEMA,
        ...ESHKOL_IMPORTED_HOST_IMPORTS_SUMMARY
      },
      artifact: descriptorArtifact
    }]
  };
  const serviceIds = {
    eshkol: 'eshkol-ulg-fixture',
    moonlab: 'moonlab-ulg-fixture'
  };
  const handoffManifest = normalizeComputeServiceManifest(createUlgHandoffServiceManifest({
    serviceId: 'ulg-handoff-descriptor-fixture'
  }));
  const registry = new ComputeServiceRegistry([
    handoffManifest,
    ...createUlgDispatchServiceManifests({ serviceIds })
  ]);
  const artifactCache = new InMemoryArtifactCache(() => 5555);
  let supervisor;
  const serviceExecutor = createUlgHandoffSupervisorServiceExecutor({
    getSupervisor: () => supervisor
  });
  supervisor = new WorkerSupervisor({
    registry,
    artifactCache,
    workerFactory: (serviceManifest) => {
      if (serviceManifest.serviceId === 'ulg-handoff-descriptor-fixture') {
        return new UlgHandoffServiceHost(serviceManifest, {
          origin: 'http://localhost:5173',
          url: 'http://localhost:5173/',
          receivedAt: '2026-06-06T16:05:01.000Z',
          executeServices: true,
          serviceIds,
          serviceExecutor
        });
      }
      return new UlgDispatchServiceHost(serviceManifest);
    }
  });

  const result = await supervisor.submitTask({
    schema: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    serviceId: 'ulg-handoff-descriptor-fixture',
    taskKind: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    taskId: 'task:ulg-handoff-descriptor-dispatch',
    rootTaskId: 'root:ulg-handoff-descriptor-dispatch',
    handoff
  });

  assert.equal(result.ready, true);
  assert.equal(result.dispatchPlan.ready, true);
  assert.equal(result.dispatchPlan.dispatches[1].taskKind, 'eshkol.ulg.closure.descriptor-bind');
  assert.equal(result.dispatchPlan.dispatches[1].hasTransferredWasmBytes, false);
  assert.equal(result.dispatchResult.status, 'executed');
  assert.equal(result.dispatchResult.acceptedDispatchCount, 2);
  assert.deepEqual(result.dispatchResult.blockers, []);

  const eshkol = result.dispatchResult.results[1].output;
  assert.equal(eshkol.serviceId, 'eshkol-ulg-fixture');
  assert.equal(eshkol.taskKind, 'eshkol.ulg.closure.descriptor-bind');
  assert.equal(eshkol.serviceTask.transfer.hasTransferredWasmBytes, false);
  assert.equal(eshkol.serviceTask.artifactPayload.hasTransferredWasmBytes, false);
  assert.equal(eshkol.serviceTask.artifactPayload.wasmBytes, null);
  assert.equal(eshkol.serviceResult.serviceStatus, 'accepted');
  assert.equal(eshkol.serviceResult.probe.status, 'descriptor-contract-ready');
  assert.equal(eshkol.serviceResult.probe.probeMode, 'descriptor-contract-metadata-only');
  assert.equal(eshkol.serviceResult.probe.moduleCompiled, false);
  assert.equal(eshkol.serviceResult.ingest.moduleCompiled, false);
  assert.equal(eshkol.serviceResult.ingest.descriptorContractReady, true);
  assert.equal(eshkol.serviceResult.ingest.descriptorContractStatus, 'descriptor-contract-ready');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.schema, 'peercompute.ulg.eshkol-descriptor-contract-probe.v0');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.ready, true);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.scientificExecution, false);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.scientificValidation, false);
  assert.deepEqual(eshkol.serviceResult.probe.descriptorProbe.tensorContract.inputIds, ESHKOL_DESCRIPTOR_INPUT_IDS);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorContract.matchesArtifactDescriptors, true);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.interpolationTable.schema, 'eshkol.ulg.magnetar-closure-interpolation-table.v0');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.interpolationTable.status, 'computed-fixture');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.interpolationTable.matchesTensorContract, true);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.interpolationTable.fixtureScope, 'reduced-smoke-fixture-not-magnetar-physics');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.interpolationTable.scientificValidation, false);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.interpolationTable.computedFixture, true);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.interpolationTable.sampleCount, 4);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.interpolationTable.samplePayloadCount, 4);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.interpolationTable.descriptorBindingReady, true);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.interpolationTable.tensorRuntimeMatchesInterpolationTable, true);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.interpolationTable.tensorRuntimeSampleShapeValidationReady, true);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.interpolationTable.contentHash, 'sha256:82ca16463d7ffe1d170adb266be61c3959b22a6c352751e99f0f510738a14165');
  assert.deepEqual(eshkol.serviceResult.probe.descriptorProbe.interpolationTable.sampleIds, [
    'moonlab:magnetosphere-mhd-reference',
    'moonlab:pic-kinetic-plasma-reference',
    'moonlab:radiation-transport-reference',
    'moonlab:relativistic-correction-reference'
  ]);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.moonlabNormalizedReferenceSuite.referenceCount, 4);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.moonlabNormalizedReferenceSuite.contentHash, 'sha256:87e078026a9c2233afcccfd5c13f4ceb5d46cd301eb51fa7d0c15ef106a8e029');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.moonlabNormalizedReferenceSuite.fidelityRuntimeScope.schema, 'ulg.magnetar.fidelity-runtime-scope.v0');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.moonlabNormalizedReferenceSuite.fidelityRuntimeScope.runtimeScope, 'reduced-scalar-reference-suite');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.moonlabNormalizedReferenceSuite.fidelityRuntimeScope.fullFidelityMagnetarSimulation, false);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.moonlabNormalizedReferenceSuite.fidelityRuntimeScope.fullPhysicsValidation, false);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.productTopologyBinding.status, 'descriptor-bound-not-executed');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.schema, 'eshkol.ulg.magnetar-closure-tensor-runtime-contract.v0');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.status, 'declared-fixture-contract');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.ready, true);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.contractHash, 'sha256:4b0d9c61ae83f1695978fd2f6b918bdbcab1ccca550b520c0467e7159c805d28');
  assert.equal(
    eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.runtimeAbi,
    'wasm32-unknown-unknown:eshkol-host-imports-production-candidate-v0'
  );
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.executionClaim, 'metadata-and-smoke-output-only');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.descriptorsReady, true);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.matchesTensorContract, true);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.matchesInterpolationTable, true);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.sampleShapeValidationStatus, 'pass');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.sampleShapeValidatedSampleCount, 4);
  assert.deepEqual(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.sampleShapeValidatedInputTensorIds, ESHKOL_DESCRIPTOR_INPUT_IDS);
  assert.deepEqual(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.sampleShapeValidatedOutputTensorIds, ESHKOL_DESCRIPTOR_OUTPUT_IDS);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.sampleShapeValidationMatchesTensorContract, true);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.sampleShapeValidationReady, true);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.scientificValidation, false);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.tensorRuntimeContract.fullPhysicsValidation, false);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.runtimeBinding.runtimeStatus, 'declared-not-executed');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.schema, ESHKOL_PRODUCTION_HANDLER_BOUNDARY_SCHEMA);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.status, 'production-handler-boundary-declared-not-executed');
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.ready, true);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.handlerReady, false);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.runtimeExecution, false);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.scientificValidation, false);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.fullPhysicsValidation, false);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.fullFidelityMagnetarSimulation, false);
  assertEshkolProductionHandlerContractFields(
    eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary,
    'productionHandlerContract'
  );
  assert.equal(
    eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.productionHostImportCandidateStatus,
    'production-candidate-runtime-imports-implemented'
  );
  assertEshkolProductionCandidateRuntimeProbeFields(
    eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary,
    'productionCandidateRuntimeProbe'
  );
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.dispatchPreflightReady, false);
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.dispatchPreflightDeclared, true);
  assert.deepEqual(
    eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.dispatchPreflightRequiredChecks,
    [...ESHKOL_PRODUCTION_DISPATCH_CHECKS]
  );
  assert.equal(
    eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.dispatchPreflightCheckSummarySchema,
    'eshkol.ulg.production-handler-dispatch-preflight-check-summary.v0'
  );
  assert.equal(
    eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.dispatchPreflightPassedCheckCount,
    ESHKOL_PRODUCTION_DISPATCH_PASSED_CHECKS.length
  );
  assert.equal(eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.dispatchPreflightBlockedCheckCount, 3);
  assert.deepEqual(
    eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.dispatchPreflightBlockedBy,
    [...ESHKOL_PRODUCTION_BLOCKERS]
  );
  assert.deepEqual(eshkol.serviceResult.probe.descriptorProbe.productionHandlerBoundary.validationBlockers, []);
  assert.equal(eshkol.serviceResult.ingest.eshkolProductionHandlerBoundaryReady, true);
  assert.equal(eshkol.serviceResult.ingest.eshkolProductionHandlerBoundarySchema, ESHKOL_PRODUCTION_HANDLER_BOUNDARY_SCHEMA);
  assert.equal(eshkol.serviceResult.ingest.eshkolProductionHandlerBoundaryStatus, 'production-handler-boundary-declared-not-executed');
  assert.equal(eshkol.serviceResult.ingest.eshkolProductionHandlerBoundaryHandlerReady, false);
  assert.equal(eshkol.serviceResult.ingest.eshkolProductionHandlerBoundaryRuntimeExecution, false);
  assert.equal(eshkol.serviceResult.ingest.eshkolProductionHandlerBoundaryScientificValidation, false);
  assert.equal(eshkol.serviceResult.ingest.eshkolProductionHandlerBoundaryFullPhysicsValidation, false);
  assert.equal(eshkol.serviceResult.ingest.eshkolProductionHandlerBoundaryFullFidelityMagnetarSimulation, false);
  assertEshkolProductionHandlerContractFields(eshkol.serviceResult.ingest);
  assert.equal(
    eshkol.serviceResult.ingest.closureHostImportsModule,
    ESHKOL_IMPORTED_HOST_IMPORTS_SUMMARY.closureHostImportsModule
  );
  assert.equal(eshkol.serviceResult.ingest.closureHostImportsAssetStatus, 'ready');
  assert.equal(eshkol.serviceResult.ingest.closureHostImportsFactoryStatus, 'ready');
  assert.equal(eshkol.serviceResult.ingest.closureHostImportsFactoryReady, true);
  assert.equal(
    eshkol.serviceResult.ingest.closureHostImportsRequirementsStatus,
    'production-candidate-runtime-imports-implemented'
  );
  assert.equal(
    eshkol.serviceResult.ingest.closureHostImportsImplementationStatus,
    'production-candidate-runtime-imports-present'
  );
  assert.equal(eshkol.serviceResult.ingest.closureHostImportsRequiredNonStubImportCount, 23);
  assert.equal(
    eshkol.serviceResult.ingest.eshkolProductionHostImportCandidateStatus,
    'production-candidate-runtime-imports-implemented'
  );
  assertEshkolProductionCandidateRuntimeProbeFields(eshkol.serviceResult.ingest);
  assert.equal(eshkol.serviceResult.ingest.eshkolProductionDispatchPreflightReady, false);
  assert.equal(eshkol.serviceResult.ingest.eshkolProductionDispatchPreflightDeclared, true);
  assert.equal(
    eshkol.serviceResult.ingest.eshkolProductionDispatchPreflightRequiredRuntimeAbi,
    'wasm32-unknown-unknown:eshkol-host-imports-production-candidate-v0'
  );
  assert.equal(
    eshkol.serviceResult.ingest.eshkolProductionDispatchPreflightTotalRequiredCheckCount,
    ESHKOL_PRODUCTION_DISPATCH_CHECKS.length
  );
  assert.equal(
    eshkol.serviceResult.ingest.eshkolProductionDispatchPreflightPassedCheckCount,
    ESHKOL_PRODUCTION_DISPATCH_PASSED_CHECKS.length
  );
  assert.equal(eshkol.serviceResult.ingest.eshkolProductionDispatchPreflightBlockedCheckCount, 3);
  assert.deepEqual(
    eshkol.serviceResult.ingest.eshkolProductionDispatchPreflightPassedChecks,
    [...ESHKOL_PRODUCTION_DISPATCH_PASSED_CHECKS]
  );
  assert.deepEqual(
    eshkol.serviceResult.ingest.eshkolProductionDispatchPreflightBlockedChecks,
    [...ESHKOL_PRODUCTION_DISPATCH_BLOCKED_CHECKS]
  );
  assert.deepEqual(
    eshkol.serviceResult.ingest.eshkolProductionDispatchPreflightBlockedBy,
    [...ESHKOL_PRODUCTION_BLOCKERS]
  );
  assert.equal(eshkol.serviceSummary.schema, ULG_HANDOFF_SUPERVISOR_SERVICE_SUMMARY_SCHEMA);
  assert.equal(eshkol.serviceSummary.probeStatus, 'descriptor-contract-ready');
  assert.equal(eshkol.serviceSummary.probeMode, 'descriptor-contract-metadata-only');
  assert.equal(eshkol.serviceSummary.moduleCompiled, false);
  assert.equal(eshkol.serviceSummary.descriptorContractReady, true);
  assert.equal(eshkol.serviceSummary.descriptorContractStatus, 'descriptor-contract-ready');
  assert.equal(eshkol.serviceSummary.descriptorScientificExecution, false);
  assert.equal(eshkol.serviceSummary.descriptorScientificValidation, false);
  assert.equal(eshkol.serviceSummary.descriptorTensorInputCount, ESHKOL_DESCRIPTOR_INPUT_IDS.length);
  assert.equal(eshkol.serviceSummary.descriptorTensorOutputCount, ESHKOL_DESCRIPTOR_OUTPUT_IDS.length);
  assert.equal(eshkol.serviceSummary.descriptorTensorCoordinateSystem, 'normalized-radial-cell');
  assert.equal(eshkol.serviceSummary.descriptorTensorInterpolation, 'reduced-fixture-table-contract');
  assert.equal(eshkol.serviceSummary.descriptorTensorMatchesArtifactDescriptors, true);
  assert.equal(eshkol.serviceSummary.descriptorInterpolationTableStatus, 'computed-fixture');
  assert.equal(eshkol.serviceSummary.descriptorInterpolationTableComputedFixture, true);
  assert.equal(eshkol.serviceSummary.descriptorInterpolationTableScientificValidation, false);
  assert.equal(eshkol.serviceSummary.descriptorInterpolationTableSampleCount, 4);
  assert.equal(eshkol.serviceSummary.descriptorInterpolationTableSamplePayloadCount, 4);
  assert.equal(eshkol.serviceSummary.descriptorInterpolationTableContentHash, 'sha256:82ca16463d7ffe1d170adb266be61c3959b22a6c352751e99f0f510738a14165');
  assert.equal(eshkol.serviceSummary.descriptorInterpolationTableCoordinateSystem, 'normalized-radial-cell');
  assert.equal(eshkol.serviceSummary.descriptorInterpolationTableMatchesTensorContract, true);
  assert.equal(eshkol.serviceSummary.descriptorInterpolationTableDescriptorBindingReady, true);
  assert.equal(eshkol.serviceSummary.descriptorInterpolationTableTensorRuntimeMatches, true);
  assert.equal(eshkol.serviceSummary.descriptorInterpolationTableSampleShapeValidationReady, true);
  assert.equal(eshkol.serviceSummary.descriptorMoonLabReferenceSuiteReady, true);
  assert.equal(eshkol.serviceSummary.descriptorMoonLabReferenceSuiteStatus, null);
  assert.equal(eshkol.serviceSummary.descriptorMoonLabReferenceCount, 4);
  assert.equal(eshkol.serviceSummary.descriptorProductTopologyStatus, 'descriptor-bound-not-executed');
  assert.equal(eshkol.serviceSummary.descriptorProductTopologyMatchesTensorContract, true);
  assert.equal(eshkol.serviceSummary.descriptorProductTopologyScientificValidation, false);
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeContractReady, true);
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeContractStatus, 'declared-fixture-contract');
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeContractHash, 'sha256:4b0d9c61ae83f1695978fd2f6b918bdbcab1ccca550b520c0467e7159c805d28');
  assert.equal(
    eshkol.serviceSummary.descriptorTensorRuntimeRuntimeAbi,
    'wasm32-unknown-unknown:eshkol-host-imports-production-candidate-v0'
  );
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeExecutionClaim, 'metadata-and-smoke-output-only');
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeMatchesTensorContract, true);
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeMatchesInterpolationTable, true);
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeInterpolationTableId, 'ulg:magnetar-radial-cell-interpolation-table:v0');
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeInterpolationTableContentHash, 'sha256:82ca16463d7ffe1d170adb266be61c3959b22a6c352751e99f0f510738a14165');
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeInterpolationTableSampleCount, 4);
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeSampleShapeValidationStatus, 'pass');
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeSampleShapeValidatedSampleCount, 4);
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeSampleShapeValidationMatchesTensorContract, true);
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeSampleShapeValidationReady, true);
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeScientificValidation, false);
  assert.equal(eshkol.serviceSummary.descriptorTensorRuntimeFullPhysicsValidation, false);
  assert.equal(eshkol.serviceSummary.descriptorRuntimeStatus, 'declared-not-executed');
  assert.equal(eshkol.serviceSummary.descriptorDerivativeStatus, 'declared-not-computed');
  assert.equal(eshkol.serviceSummary.descriptorRuntimeScientificValidation, false);
  assert.equal(eshkol.serviceSummary.descriptorRuntimeDeclaredNotExecuted, true);
  assert.equal(eshkol.serviceSummary.eshkolProductionHandlerBoundaryReady, true);
  assert.equal(eshkol.serviceSummary.eshkolProductionHandlerBoundarySchema, ESHKOL_PRODUCTION_HANDLER_BOUNDARY_SCHEMA);
  assert.equal(eshkol.serviceSummary.eshkolProductionHandlerBoundaryStatus, 'production-handler-boundary-declared-not-executed');
  assert.equal(eshkol.serviceSummary.eshkolProductionHandlerBoundaryHandlerReady, false);
  assert.equal(eshkol.serviceSummary.eshkolProductionHandlerBoundaryRuntimeExecution, false);
  assert.equal(eshkol.serviceSummary.eshkolProductionHandlerBoundaryScientificValidation, false);
  assert.equal(eshkol.serviceSummary.eshkolProductionHandlerBoundaryFullPhysicsValidation, false);
  assert.equal(eshkol.serviceSummary.eshkolProductionHandlerBoundaryFullFidelityMagnetarSimulation, false);
  assertEshkolProductionHandlerContractFields(eshkol.serviceSummary);
  assert.equal(
    eshkol.serviceSummary.closureHostImportsModule,
    ESHKOL_IMPORTED_HOST_IMPORTS_SUMMARY.closureHostImportsModule
  );
  assert.equal(eshkol.serviceSummary.closureHostImportsAssetStatus, 'ready');
  assert.equal(eshkol.serviceSummary.closureHostImportsFactoryStatus, 'ready');
  assert.equal(eshkol.serviceSummary.closureHostImportsFactoryReady, true);
  assert.equal(
    eshkol.serviceSummary.closureHostImportsRequirementsSchema,
    'eshkol.ulg.production-host-import-candidate.v0'
  );
  assert.equal(
    eshkol.serviceSummary.closureHostImportsRuntimeScope,
    'production-candidate-host-imports'
  );
  assert.equal(eshkol.serviceSummary.closureHostImportsRequiredNonStubImportCount, 23);
  assert.equal(
    eshkol.serviceSummary.eshkolProductionHostImportCandidateStatus,
    'production-candidate-runtime-imports-implemented'
  );
  assert.equal(eshkol.serviceSummary.eshkolProductionHostImportCandidateRequiredNonStubImportCount, 23);
  assert.deepEqual(
    eshkol.serviceSummary.eshkolProductionHostImportCandidateBlockedBy,
    [...ESHKOL_PRODUCTION_BLOCKERS]
  );
  assertEshkolProductionCandidateRuntimeProbeFields(eshkol.serviceSummary);
  assert.equal(eshkol.serviceSummary.eshkolProductionDispatchPreflightStatus, 'blocked');
  assert.equal(eshkol.serviceSummary.eshkolProductionDispatchPreflightReady, false);
  assert.equal(eshkol.serviceSummary.eshkolProductionDispatchPreflightDeclared, true);
  assert.equal(
    eshkol.serviceSummary.eshkolProductionDispatchPreflightRequiredCheckCount,
    ESHKOL_PRODUCTION_DISPATCH_CHECKS.length
  );
  assert.equal(
    eshkol.serviceSummary.eshkolProductionDispatchPreflightTotalRequiredCheckCount,
    ESHKOL_PRODUCTION_DISPATCH_CHECKS.length
  );
  assert.equal(
    eshkol.serviceSummary.eshkolProductionDispatchPreflightPassedCheckCount,
    ESHKOL_PRODUCTION_DISPATCH_PASSED_CHECKS.length
  );
  assert.equal(eshkol.serviceSummary.eshkolProductionDispatchPreflightBlockedCheckCount, 3);
  assert.deepEqual(
    eshkol.serviceSummary.eshkolProductionDispatchPreflightRejectedRuntimeScopes,
    ['deterministic-runtime-smoke-stubs']
  );
  assert.deepEqual(
    eshkol.serviceSummary.eshkolProductionDispatchPreflightBlockedBy,
    [...ESHKOL_PRODUCTION_BLOCKERS]
  );
  assert.equal(eshkol.serviceSummary.eshkolProductionHandlerBoundary.handlerReady, false);
  assert.equal(eshkol.serviceSummary.hostRuntimeExecutionReady, false);
  assert.equal(eshkol.serviceSummary.hostRuntimeExecutionScientificExecution, false);

  const cached = await artifactCache.get(result.artifactRef);
  assert.equal(cached.dispatchResult.results[1].output.serviceResult.probe.probeMode, 'descriptor-contract-metadata-only');
});

test('ULG Eshkol descriptor probe blocks interpolation fixture scientific overclaims', async () => {
  const artifact = JSON.parse(JSON.stringify(createEshkolMagnetarDescriptorArtifact()));
  artifact.validation.closureDescriptor.descriptorBinding.ulgInterpolationTable.scientificValidation = true;
  const serviceIds = { eshkol: 'eshkol-ulg-fixture' };
  const eshkolManifest = createUlgDispatchServiceManifests({ serviceIds })
    .find((entry) => entry.serviceId === 'eshkol-ulg-fixture');
  const registry = new ComputeServiceRegistry([eshkolManifest]);
  const supervisor = new WorkerSupervisor({
    registry,
    workerFactory: (serviceManifest) => new UlgDispatchServiceHost(serviceManifest, {
      requestChildLease: false
    })
  });

  const result = await supervisor.submitTask({
    schema: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    serviceId: 'eshkol-ulg-fixture',
    taskKind: 'eshkol.ulg.closure.descriptor-bind',
    taskId: 'task:eshkol-descriptor-overclaim',
    rootTaskId: 'root:eshkol-descriptor-overclaim',
    artifactPayload: {
      schema: ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA,
      handoffId: 'handoff:eshkol-descriptor-overclaim',
      dispatchId: 'handoff:eshkol-descriptor-overclaim:dispatch:0',
      sourceService: 'eshkol',
      artifactKind: 'closure',
      artifactRefUri: 'artifact://eshkol-descriptor-overclaim',
      artifactContentHash: 'sha256:eshkol-descriptor-overclaim',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'closure',
        sourceService: 'eshkol',
        closureReady: true,
        closureDescriptorReady: true,
        closureDescriptorSchema: ESHKOL_MAGNETAR_CLOSURE_DESCRIPTOR_SCHEMA
      },
      artifact,
      hasTransferredWasmBytes: false,
      wasmBytes: null
    }
  });

  assert.equal(result.serviceStatus, 'blocked');
  assert.equal(result.ready, false);
  assert.ok(result.blockers.includes('eshkol-descriptor-interpolation-table-scientific-validation-overstated'));
  assert.equal(result.probe.descriptorProbe.ready, false);
  assert.equal(result.probe.descriptorProbe.interpolationTable.scientificValidation, true);
  assert.equal(result.probe.descriptorProbe.interpolationTable.computedFixture, true);
});

test('ULG Eshkol descriptor probe blocks tensor runtime contract overclaims', async () => {
  const artifact = JSON.parse(JSON.stringify(createEshkolMagnetarDescriptorArtifact()));
  const runtimeContract = artifact.validation.closureDescriptor.descriptorBinding.closureTensorRuntimeContract;
  runtimeContract.fullPhysicsValidation = true;
  runtimeContract.sampleShapeValidation.status = 'blocked';
  const serviceIds = { eshkol: 'eshkol-ulg-fixture' };
  const eshkolManifest = createUlgDispatchServiceManifests({ serviceIds })
    .find((entry) => entry.serviceId === 'eshkol-ulg-fixture');
  const registry = new ComputeServiceRegistry([eshkolManifest]);
  const supervisor = new WorkerSupervisor({
    registry,
    workerFactory: (serviceManifest) => new UlgDispatchServiceHost(serviceManifest, {
      requestChildLease: false
    })
  });

  const result = await supervisor.submitTask({
    schema: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    serviceId: 'eshkol-ulg-fixture',
    taskKind: 'eshkol.ulg.closure.descriptor-bind',
    taskId: 'task:eshkol-tensor-runtime-overclaim',
    rootTaskId: 'root:eshkol-tensor-runtime-overclaim',
    artifactPayload: {
      schema: ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA,
      handoffId: 'handoff:eshkol-tensor-runtime-overclaim',
      dispatchId: 'handoff:eshkol-tensor-runtime-overclaim:dispatch:0',
      sourceService: 'eshkol',
      artifactKind: 'closure',
      artifactRefUri: 'artifact://eshkol-tensor-runtime-overclaim',
      artifactContentHash: 'sha256:eshkol-tensor-runtime-overclaim',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'closure',
        sourceService: 'eshkol',
        closureReady: true,
        closureDescriptorReady: true,
        closureDescriptorSchema: ESHKOL_MAGNETAR_CLOSURE_DESCRIPTOR_SCHEMA
      },
      artifact,
      hasTransferredWasmBytes: false,
      wasmBytes: null
    }
  });

  assert.equal(result.serviceStatus, 'blocked');
  assert.equal(result.ready, false);
  assert.ok(result.blockers.includes('eshkol-descriptor-tensor-runtime-sample-shape-validation-not-ready'));
  assert.ok(result.blockers.includes('eshkol-descriptor-tensor-runtime-scientific-validation-overstated'));
  assert.equal(result.probe.descriptorProbe.ready, false);
  assert.equal(result.probe.descriptorProbe.tensorRuntimeContract.sampleShapeValidationStatus, 'blocked');
  assert.equal(result.probe.descriptorProbe.tensorRuntimeContract.fullPhysicsValidation, true);
});

test('ULG Eshkol descriptor probe blocks tensor runtime table binding drift', async () => {
  const artifact = JSON.parse(JSON.stringify(createEshkolMagnetarDescriptorArtifact()));
  const runtimeContract = artifact.validation.closureDescriptor.descriptorBinding.closureTensorRuntimeContract;
  runtimeContract.interpolationTable.contentHash = 'sha256:0000000000000000000000000000000000000000000000000000000000000000';
  runtimeContract.sampleShapeValidation.validatedInputTensorIds = [
    'closure-control-vector',
    'magnetar-state-vector'
  ];
  const serviceIds = { eshkol: 'eshkol-ulg-fixture' };
  const eshkolManifest = createUlgDispatchServiceManifests({ serviceIds })
    .find((entry) => entry.serviceId === 'eshkol-ulg-fixture');
  const registry = new ComputeServiceRegistry([eshkolManifest]);
  const supervisor = new WorkerSupervisor({
    registry,
    workerFactory: (serviceManifest) => new UlgDispatchServiceHost(serviceManifest, {
      requestChildLease: false
    })
  });

  const result = await supervisor.submitTask({
    schema: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    serviceId: 'eshkol-ulg-fixture',
    taskKind: 'eshkol.ulg.closure.descriptor-bind',
    taskId: 'task:eshkol-tensor-runtime-binding-drift',
    rootTaskId: 'root:eshkol-tensor-runtime-binding-drift',
    artifactPayload: {
      schema: ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA,
      handoffId: 'handoff:eshkol-tensor-runtime-binding-drift',
      dispatchId: 'handoff:eshkol-tensor-runtime-binding-drift:dispatch:0',
      sourceService: 'eshkol',
      artifactKind: 'closure',
      artifactRefUri: 'artifact://eshkol-tensor-runtime-binding-drift',
      artifactContentHash: 'sha256:eshkol-tensor-runtime-binding-drift',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'closure',
        sourceService: 'eshkol',
        closureReady: true,
        closureDescriptorReady: true,
        closureDescriptorSchema: ESHKOL_MAGNETAR_CLOSURE_DESCRIPTOR_SCHEMA
      },
      artifact,
      hasTransferredWasmBytes: false,
      wasmBytes: null
    }
  });

  assert.equal(result.serviceStatus, 'blocked');
  assert.equal(result.ready, false);
  assert.ok(result.blockers.includes('eshkol-descriptor-tensor-runtime-interpolation-table-mismatch'));
  assert.ok(result.blockers.includes('eshkol-descriptor-tensor-runtime-sample-shape-validation-ids-mismatch'));
  assert.ok(result.blockers.includes('eshkol-descriptor-tensor-runtime-sample-shape-validation-not-ready'));
  assert.equal(result.probe.descriptorProbe.ready, false);
  assert.equal(result.probe.descriptorProbe.interpolationTable.matchesTensorContract, true);
  assert.equal(result.probe.descriptorProbe.interpolationTable.computedFixture, true);
  assert.equal(result.probe.descriptorProbe.interpolationTable.descriptorBindingReady, false);
  assert.equal(result.probe.descriptorProbe.interpolationTable.tensorRuntimeMatchesInterpolationTable, false);
  assert.equal(result.probe.descriptorProbe.interpolationTable.tensorRuntimeSampleShapeValidationReady, false);
  assert.equal(result.probe.descriptorProbe.tensorRuntimeContract.matchesInterpolationTable, false);
  assert.equal(result.probe.descriptorProbe.tensorRuntimeContract.sampleShapeValidationMatchesTensorContract, false);
  assert.equal(result.probe.descriptorProbe.tensorRuntimeContract.sampleShapeValidationReady, false);
});

test('ULG Eshkol dispatch adapter dry-instantiates complete WASM without invoking main', async () => {
  const serviceIds = { eshkol: 'eshkol-ulg-fixture' };
  const eshkolManifest = createUlgDispatchServiceManifests({ serviceIds })
    .find((entry) => entry.serviceId === 'eshkol-ulg-fixture');
  const registry = new ComputeServiceRegistry([eshkolManifest]);
  const supervisor = new WorkerSupervisor({
    registry,
    workerFactory: (serviceManifest) => new UlgDispatchServiceHost(serviceManifest, {
      requestChildLease: false
    })
  });
  const result = await supervisor.submitTask({
    schema: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    serviceId: 'eshkol-ulg-fixture',
    taskKind: 'eshkol.ulg.closure-artifact.ingest',
    taskId: 'task:eshkol-dry-runtime-probe',
    rootTaskId: 'root:eshkol-dry-runtime-probe',
    artifactPayload: {
      schema: ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA,
      handoffId: 'handoff:eshkol-dry-runtime-probe',
      dispatchId: 'handoff:eshkol-dry-runtime-probe:dispatch:0',
      sourceService: 'eshkol',
      artifactKind: 'closure',
      artifactRefUri: 'artifact://eshkol-minimal-wasm',
      artifactContentHash: 'sha256:eshkol-minimal-wasm',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'closure',
        sourceService: 'eshkol',
        validationStatus: 'pass',
        closureReady: true,
        closureDescriptorReady: true,
        closureImportCount: 0,
        closureExportCount: 1,
        closureEntryExport: 'main',
        closureServiceWorkerSafe: true,
        closureRequiresDynamicCode: false
      },
      artifact: {
        closureId: 'eshkol:minimal-wasm',
        sourceService: 'eshkol',
        closureKind: 'minimal-wasm-main-export',
        execution: {
          serviceWorkerSafe: true,
          entryExport: 'main',
          imports: [],
          exports: [{ name: 'main', kind: 'function' }]
        },
        validity: {
          requiresDynamicCode: false
        },
        validation: {
          status: 'pass'
        }
      },
      wasmBytes: MINIMAL_WASM_MAIN_EXPORT_BYTES,
      wasmByteLength: MINIMAL_WASM_MAIN_EXPORT_BYTES.length,
      wasmSha256: 'sha256:eshkol-minimal-wasm',
      hasTransferredWasmBytes: true
    }
  });

  assert.equal(result.schema, ULG_DISPATCH_SERVICE_RESULT_SCHEMA);
  assert.equal(result.serviceStatus, 'accepted');
  assert.equal(result.ready, true);
  assert.deepEqual(result.blockers, []);
  assert.equal(result.probe.schema, 'peercompute.ulg.eshkol-dispatch-wasm-probe.v0');
  assert.equal(result.probe.status, 'pass');
  assert.equal(result.probe.moduleCompiled, true);
  assert.equal(result.probe.importCount, 0);
  assert.equal(result.probe.exportCount, 1);
  assert.equal(result.probe.hasEntryExport, true);
  assert.equal(result.probe.hostRuntimeProbe.schema, 'peercompute.ulg.eshkol-host-runtime-dry-probe.v0');
  assert.equal(result.probe.hostRuntimeProbe.status, 'host-runtime-dry-probe-ready');
  assert.equal(result.probe.hostRuntimeProbe.ready, true);
  assert.equal(result.probe.hostRuntimeProbe.instantiated, true);
  assert.equal(result.probe.hostRuntimeProbe.entryExportAvailable, true);
  assert.equal(result.probe.hostRuntimeProbe.mainInvoked, false);
  assert.equal(result.probe.hostRuntimeProbe.scientificExecution, false);
  assert.equal(result.ingest.hostRuntimeProbeReady, true);
  assert.equal(result.ingest.hostRuntimeInstantiated, true);
  assert.equal(result.ingest.hostRuntimeStubCallCount, 0);
});

test('ULG Eshkol dispatch adapter executes only explicit smoke output semantics', async () => {
  const serviceIds = { eshkol: 'eshkol-ulg-fixture' };
  const eshkolManifest = createUlgDispatchServiceManifests({ serviceIds })
    .find((entry) => entry.serviceId === 'eshkol-ulg-fixture');
  const registry = new ComputeServiceRegistry([eshkolManifest]);
  const supervisor = new WorkerSupervisor({
    registry,
    workerFactory: (serviceManifest) => new UlgDispatchServiceHost(serviceManifest, {
      requestChildLease: false
    })
  });
  const outputSemantics = {
    schema: ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA,
    semanticScope: 'smoke-fixture',
    scientificScope: 'none',
    entryExport: 'main',
    entryArgs: [],
    expectedEntryResult: 0,
    stdout: { byteLength: 0 },
    scientificValidation: false
  };
  const result = await supervisor.submitTask({
    schema: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    serviceId: 'eshkol-ulg-fixture',
    taskKind: 'eshkol.ulg.closure-artifact.ingest',
    taskId: 'task:eshkol-output-semantics-execution',
    rootTaskId: 'root:eshkol-output-semantics-execution',
    artifactPayload: {
      schema: ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA,
      handoffId: 'handoff:eshkol-output-semantics-execution',
      dispatchId: 'handoff:eshkol-output-semantics-execution:dispatch:0',
      sourceService: 'eshkol',
      artifactKind: 'closure',
      artifactRefUri: 'artifact://eshkol-return-zero-wasm',
      artifactContentHash: 'sha256:eshkol-return-zero-wasm',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'closure',
        sourceService: 'eshkol',
        validationStatus: 'pass',
        closureReady: true,
        closureDescriptorReady: true,
        closureOutputSemanticsReady: true,
        closureOutputSemanticsSchema: ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA,
        closureOutputSemanticScope: 'smoke-fixture',
        closureOutputScientificValidation: false,
        closureOutputExpectedEntryExport: 'main',
        closureOutputExpectedEntryArgs: [],
        closureOutputExpectedEntryResult: 0,
        closureOutputExpectedStdoutByteLength: 0,
        closureImportCount: 0,
        closureExportCount: 1,
        closureEntryExport: 'main',
        closureServiceWorkerSafe: true,
        closureRequiresDynamicCode: false
      },
      artifact: {
        closureId: 'eshkol:return-zero-wasm',
        sourceService: 'eshkol',
        closureKind: 'return-zero-wasm-main-export',
        execution: {
          serviceWorkerSafe: true,
          entryExport: 'main',
          entrySignature: { parameters: [], results: ['i32'] },
          imports: [],
          exports: [{ name: 'main', kind: 'function' }]
        },
        validity: {
          requiresDynamicCode: false
        },
        validation: {
          status: 'pass',
          outputSemantics
        }
      },
      wasmBytes: MINIMAL_WASM_MAIN_RETURN_ZERO_BYTES,
      wasmByteLength: MINIMAL_WASM_MAIN_RETURN_ZERO_BYTES.length,
      wasmSha256: 'sha256:eshkol-return-zero-wasm',
      hasTransferredWasmBytes: true
    }
  });

  assert.equal(result.schema, ULG_DISPATCH_SERVICE_RESULT_SCHEMA);
  assert.equal(result.serviceStatus, 'accepted');
  assert.equal(result.ready, true);
  assert.deepEqual(result.blockers, []);
  assert.equal(result.probe.hostRuntimeProbe.ready, true);
  assert.equal(result.probe.hostRuntimeExecution.schema, 'peercompute.ulg.eshkol-host-runtime-execution.v0');
  assert.equal(result.probe.hostRuntimeExecution.status, 'host-runtime-output-semantics-validated');
  assert.equal(result.probe.hostRuntimeExecution.ready, true);
  assert.equal(result.probe.hostRuntimeExecution.entryInvoked, true);
  assert.deepEqual(result.probe.hostRuntimeExecution.entryArgs, []);
  assert.equal(result.probe.hostRuntimeExecution.entryResult, 0);
  assert.equal(result.probe.hostRuntimeExecution.mainInvoked, true);
  assert.equal(result.probe.hostRuntimeExecution.scientificExecution, false);
  assert.equal(result.probe.hostRuntimeExecution.outputSemanticsValidation.schema, 'peercompute.ulg.eshkol-output-semantics-validation.v0');
  assert.equal(result.probe.hostRuntimeExecution.outputSemanticsValidation.ready, true);
  assert.equal(result.ingest.hostRuntimeExecutionReady, true);
  assert.equal(result.ingest.hostRuntimeExecutionInvoked, true);
  assert.equal(result.ingest.hostRuntimeExecutionScientificExecution, false);
  assert.equal(result.ingest.outputSemanticsValidationReady, true);

  const summary = summarizeUlgHandoffSupervisorServiceResult(result);
  assert.equal(summary.schema, ULG_HANDOFF_SUPERVISOR_SERVICE_SUMMARY_SCHEMA);
  assert.equal(summary.serviceStatus, 'accepted');
  assert.equal(summary.probeStatus, 'pass');
  assert.equal(summary.hostRuntimeProbeReady, true);
  assert.equal(summary.hostRuntimeExecutionReady, true);
  assert.equal(summary.hostRuntimeExecutionStatus, 'host-runtime-output-semantics-validated');
  assert.equal(summary.hostRuntimeExecutionInvoked, true);
  assert.equal(summary.hostRuntimeExecutionMainInvoked, true);
  assert.equal(summary.hostRuntimeExecutionResult, 0);
  assert.equal(summary.hostRuntimeExecutionScientificExecution, false);
  assert.equal(summary.outputSemanticsValidationReady, true);
  assert.equal(summary.outputSemanticsValidationStatus, 'output-semantics-validated');
  assert.deepEqual(summary.outputSemanticsValidationBlockers, []);
});

test('ULG Eshkol dispatch adapter executes deterministic tensor runtime candidate from staged ULG artifact', {
  skip: !existsSync(ULG_STAGED_ESHKOL_MAGNETAR_ARTIFACT_PATH)
    || !existsSync(ULG_STAGED_ESHKOL_MAGNETAR_WASM_PATH)
}, async () => {
  const artifact = JSON.parse(readFileSync(ULG_STAGED_ESHKOL_MAGNETAR_ARTIFACT_PATH, 'utf8'));
  const wasmBytes = Array.from(readFileSync(ULG_STAGED_ESHKOL_MAGNETAR_WASM_PATH));
  const artifactSummary = summarizeUlgArtifact('closure', artifact);
  const serviceIds = { eshkol: 'eshkol-ulg-fixture' };
  const eshkolManifest = createUlgDispatchServiceManifests({ serviceIds })
    .find((entry) => entry.serviceId === 'eshkol-ulg-fixture');
  const registry = new ComputeServiceRegistry([eshkolManifest]);
  const supervisor = new WorkerSupervisor({
    registry,
    workerFactory: (serviceManifest) => new UlgDispatchServiceHost(serviceManifest, {
      requestChildLease: false
    })
  });

  const result = await supervisor.submitTask({
    schema: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    serviceId: 'eshkol-ulg-fixture',
    taskKind: 'eshkol.ulg.closure-artifact.ingest',
    taskId: 'task:eshkol-tensor-runtime-candidate',
    rootTaskId: 'root:eshkol-tensor-runtime-candidate',
    artifactPayload: {
      schema: ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA,
      handoffId: 'handoff:eshkol-tensor-runtime-candidate',
      dispatchId: 'handoff:eshkol-tensor-runtime-candidate:dispatch:0',
      sourceService: 'eshkol',
      artifactKind: 'closure',
      artifactRefUri: 'artifact://eshkol-staged-magnetar-closure',
      artifactContentHash: artifact.contentHash || 'sha256:eshkol-staged-magnetar-closure',
      artifactSummary,
      artifact,
      wasmBytes,
      wasmByteLength: wasmBytes.length,
      wasmSha256: artifact.execution?.module?.sha256 || artifactSummary.closureModuleSha256,
      hasTransferredWasmBytes: true
    }
  });

  assert.equal(result.schema, ULG_DISPATCH_SERVICE_RESULT_SCHEMA);
  assert.equal(result.serviceStatus, 'accepted');
  assert.equal(result.ready, true);
  assert.deepEqual(result.blockers, []);
  assert.equal(result.probe.status, 'pass');
  assert.equal(result.probe.descriptorProbe.status, 'descriptor-contract-ready');
  assert.equal(result.probe.descriptorProbe.tensorRuntimeContract.runtimeStatus, 'deterministic-runtime-smoke-executed');
  assert.equal(result.probe.descriptorProbe.tensorRuntimeContract.executionClaim, 'deterministic-tensor-runtime-smoke-only');
  assert.equal(result.probe.descriptorProbe.tensorRuntimeContract.deterministicRuntimeSmokeReady, true);
  assert.equal(result.probe.descriptorProbe.tensorRuntimeContract.linearMemoryBinding.ready, true);
  assert.equal(
    result.probe.descriptorProbe.tensorRuntimeContract.linearMemoryBinding.offsetProbeChangedBytesInDeclaredTensorRange,
    64
  );
  assert.equal(result.probe.descriptorProbe.runtimeBinding.runtimeStatus, 'deterministic-runtime-smoke-executed');
  assert.equal(result.probe.descriptorProbe.runtimeBinding.scientificValidation, false);
  assert.equal(result.probe.descriptorProbe.productionHandlerBoundary.handlerReady, false);
  assert.equal(result.probe.descriptorProbe.productionHandlerBoundary.runtimeExecution, false);
  assert.equal(result.probe.descriptorProbe.productionHandlerBoundary.scientificValidation, false);
  assert.equal(result.probe.descriptorProbe.productionHandlerBoundary.fullPhysicsValidation, false);

  const candidate = result.probe.tensorRuntimeCandidate;
  assert.equal(candidate.schema, 'peercompute.ulg.eshkol-tensor-runtime-candidate-probe.v0');
  assert.equal(candidate.status, 'deterministic-runtime-smoke-candidate-passed');
  assert.equal(candidate.ready, true);
  assert.equal(candidate.entryInvoked, true);
  assert.deepEqual(candidate.entryArgs, [131072, 131136]);
  assert.equal(candidate.entryResult, 0);
  assert.equal(candidate.changedBytesInDeclaredTensorRange, 64);
  assert.equal(candidate.expectedChangedBytesInDeclaredTensorRange, 64);
  assert.equal(candidate.outputTensorsProducedByEntryExport, true);
  assert.equal(candidate.outputTensorsMatchExpected, true);
  assert.deepEqual(candidate.outputTensors['magnetar-closure-update'], [
    0.010900000000000002,
    -0.0092,
    0.00062,
    -0.00046000000000000007,
    0.0044,
    -0.00020000000000000017,
    0.0001,
    0
  ]);
  assert.deepEqual(candidate.outputTensors['closure-residual'], [0.10800000000000001]);
  assert.equal(candidate.readCallCount, 12);
  assert.equal(candidate.writeCallCount, 9);
  assert.match(candidate.candidateEvidenceHash, /^sha256:[a-f0-9]{64}$/);
  assert.equal(candidate.productionRuntimeExecution, false);
  assert.equal(candidate.handlerReady, false);
  assert.equal(candidate.scientificExecution, false);
  assert.equal(candidate.scientificValidation, false);
  assert.equal(candidate.fullPhysicsValidation, false);
  assert.equal(candidate.fullFidelityMagnetarSimulation, false);

  assert.equal(result.ingest.tensorRuntimeCandidateReady, true);
  assert.equal(result.ingest.tensorRuntimeCandidateChangedBytesInDeclaredTensorRange, 64);
  assert.equal(result.ingest.tensorRuntimeCandidateOutputTensorsProducedByEntryExport, true);
  assert.equal(result.ingest.tensorRuntimeCandidateProductionRuntimeExecution, false);
  assert.equal(result.ingest.tensorRuntimeCandidateScientificValidation, false);
  assert.equal(result.ingest.tensorRuntimeCandidateFullPhysicsValidation, false);

  const summary = summarizeUlgHandoffSupervisorServiceResult(result);
  assert.equal(summary.tensorRuntimeCandidateReady, true);
  assert.equal(summary.tensorRuntimeCandidateStatus, 'deterministic-runtime-smoke-candidate-passed');
  assert.equal(summary.tensorRuntimeCandidateExecutionClaim, 'deterministic-tensor-runtime-smoke-only');
  assert.equal(summary.tensorRuntimeCandidateChangedBytesInDeclaredTensorRange, 64);
  assert.equal(summary.tensorRuntimeCandidateExpectedChangedBytesInDeclaredTensorRange, 64);
  assert.equal(summary.tensorRuntimeCandidateOutputTensorsProducedByEntryExport, true);
  assert.equal(summary.tensorRuntimeCandidateOutputTensorsMatchExpected, true);
  assert.equal(summary.tensorRuntimeCandidateProductionRuntimeExecution, false);
  assert.equal(summary.tensorRuntimeCandidateScientificValidation, false);
  assert.equal(summary.tensorRuntimeCandidateFullPhysicsValidation, false);
  assert.equal(summary.eshkolProductionHandlerBoundaryHandlerReady, false);
  assert.equal(summary.eshkolProductionHandlerBoundaryRuntimeExecution, false);
  assert.equal(summary.eshkolProductionHandlerBoundaryScientificValidation, false);
  assert.equal(summary.eshkolProductionHandlerBoundaryFullPhysicsValidation, false);
});

test('ULG Eshkol dispatch adapter blocks malformed output semantics before invoking main', async () => {
  const serviceIds = { eshkol: 'eshkol-ulg-fixture' };
  const eshkolManifest = createUlgDispatchServiceManifests({ serviceIds })
    .find((entry) => entry.serviceId === 'eshkol-ulg-fixture');
  const registry = new ComputeServiceRegistry([eshkolManifest]);
  const supervisor = new WorkerSupervisor({
    registry,
    workerFactory: (serviceManifest) => new UlgDispatchServiceHost(serviceManifest, {
      requestChildLease: false
    })
  });
  const result = await supervisor.submitTask({
    schema: ULG_HANDOFF_SERVICE_TASK_SCHEMA,
    serviceId: 'eshkol-ulg-fixture',
    taskKind: 'eshkol.ulg.closure-artifact.ingest',
    taskId: 'task:eshkol-malformed-output-semantics',
    rootTaskId: 'root:eshkol-malformed-output-semantics',
    artifactPayload: {
      schema: ULG_HANDOFF_DISPATCH_ARTIFACT_PAYLOAD_SCHEMA,
      handoffId: 'handoff:eshkol-malformed-output-semantics',
      dispatchId: 'handoff:eshkol-malformed-output-semantics:dispatch:0',
      sourceService: 'eshkol',
      artifactKind: 'closure',
      artifactRefUri: 'artifact://eshkol-malformed-output-semantics',
      artifactContentHash: 'sha256:eshkol-malformed-output-semantics',
      artifactSummary: {
        schema: ULG_ARTIFACT_SUMMARY_SCHEMA,
        artifactKind: 'closure',
        sourceService: 'eshkol',
        validationStatus: 'pass',
        closureReady: true,
        closureDescriptorReady: true,
        closureOutputSemanticsReady: false,
        closureImportCount: 0,
        closureExportCount: 1,
        closureEntryExport: 'main',
        closureServiceWorkerSafe: true,
        closureRequiresDynamicCode: false
      },
      artifact: {
        closureId: 'eshkol:malformed-output-semantics',
        sourceService: 'eshkol',
        closureKind: 'malformed-output-semantics',
        execution: {
          serviceWorkerSafe: true,
          entryExport: 'main',
          entrySignature: { parameters: [], results: ['i32'] },
          imports: [],
          exports: [{ name: 'main', kind: 'function' }]
        },
        validity: {
          requiresDynamicCode: false
        },
        validation: {
          status: 'pass',
          outputSemantics: {
            schema: ESHKOL_CLOSURE_OUTPUT_SEMANTICS_SCHEMA,
            semanticScope: 'scientific-fixture',
            scientificScope: 'magnetar',
            entryExport: 'main',
            entryArgs: [],
            expectedEntryResult: 0,
            stdout: { byteLength: 0 },
            scientificValidation: true
          }
        }
      },
      wasmBytes: MINIMAL_WASM_MAIN_RETURN_ZERO_BYTES,
      wasmByteLength: MINIMAL_WASM_MAIN_RETURN_ZERO_BYTES.length,
      wasmSha256: 'sha256:eshkol-malformed-output-semantics',
      hasTransferredWasmBytes: true
    }
  });

  assert.equal(result.schema, ULG_DISPATCH_SERVICE_RESULT_SCHEMA);
  assert.equal(result.serviceStatus, 'blocked');
  assert.equal(result.ready, false);
  assert.ok(result.blockers.includes('eshkol-output-semantics-scope-unsupported'));
  assert.ok(result.blockers.includes('eshkol-output-semantics-scientific-scope-invalid'));
  assert.ok(result.blockers.includes('eshkol-output-semantics-scientific-validation-overstated'));
  assert.equal(result.probe.hostRuntimeExecution.status, 'host-runtime-execution-preflight-blocked');
  assert.equal(result.probe.hostRuntimeExecution.entryInvoked, false);
  assert.equal(result.probe.hostRuntimeExecution.mainInvoked, false);
  assert.equal(result.probe.hostRuntimeExecution.scientificExecution, false);
  assert.equal(result.probe.hostRuntimeExecution.preflight.ready, false);
  assert.equal(result.ingest.hostRuntimeExecutionReady, false);
  assert.equal(result.ingest.hostRuntimeExecutionInvoked, false);
});

test('ULG Eshkol and MoonLab fixtures run through registry, supervisor, leases, and telemetry', async () => {
  const manifests = createUlgServiceFixtureManifests();
  const registry = new ComputeServiceRegistry(manifests);
  const tasks = createUlgServiceFixtureTasks();
  const serializedFixtures = JSON.stringify({ manifests, tasks });
  assert.equal(serializedFixtures.includes('/home/cos/projects/ulg'), false);

  const capabilities = registry.listCapabilities();
  assert.equal(capabilities.schema, COMPUTE_SERVICE_REGISTRY_SCHEMA);
  assert.equal(capabilities.serviceCount, 2);
  assert.deepEqual(
    capabilities.services.map((service) => service.serviceId).sort(),
    ['eshkol-ulg-fixture', 'moonlab-ulg-fixture']
  );
  assert.equal(capabilities.services[0].contract.schema, ULG_SERVICE_CONTRACT_SCHEMA);
  assert.equal(registry.resolve(ULG_LAW_TASK_CAPSULE_SCHEMA)[0].serviceId, 'eshkol-ulg-fixture');
  assert.equal(registry.resolve(ULG_QUANTUM_TASK_CAPSULE_SCHEMA)[0].serviceId, 'moonlab-ulg-fixture');
  assert.equal(registry.resolveTask(tasks.eshkol)[0].serviceId, 'eshkol-ulg-fixture');
  assert.equal(registry.resolveTask(tasks.moonlab)[0].serviceId, 'moonlab-ulg-fixture');

  const leaseManager = new ChildWorkerLeaseManager();
  const hosts = new Map();
  const supervisor = new WorkerSupervisor({
    registry,
    leaseManager,
    workerFactory: (manifest) => {
      const host = new UlgContractServiceHost(manifest, {
        holdUntilCancel: manifest.serviceId === 'moonlab-ulg-fixture'
      });
      hosts.set(manifest.serviceId, host);
      return host;
    }
  });

  const events = [];
  supervisor.subscribe((event, telemetry) => events.push({ type: event.type, telemetry }));

  const eshkolResult = await supervisor.submitTask(tasks.eshkol);
  const moonlabPromise = supervisor.submitTask(tasks.moonlab);
  await waitFor(() => leaseManager.list({ status: 'active', rootTaskId: tasks.moonlab.rootTaskId }).length === 1);
  await supervisor.cancelTree(tasks.moonlab.rootTaskId);
  const moonlabResult = await moonlabPromise;

  assert.equal(eshkolResult.schema, ULG_SERVICE_TASK_RESULT_SCHEMA);
  assert.equal(eshkolResult.status, 'complete');
  assert.equal(eshkolResult.serviceId, 'eshkol-ulg-fixture');
  assert.equal(eshkolResult.capsuleSchema, ULG_LAW_TASK_CAPSULE_SCHEMA);
  assert.equal(eshkolResult.runtimeManifestSchema, ULG_RUNTIME_MANIFEST_SCHEMA);
  assert.equal(eshkolResult.contract.schema, ULG_SERVICE_CONTRACT_SCHEMA);
  assert.equal(eshkolResult.childLease.schema, CHILD_WORKER_LEASE_SCHEMA);

  assert.equal(moonlabResult.schema, ULG_SERVICE_TASK_RESULT_SCHEMA);
  assert.equal(moonlabResult.status, 'cancelled-clean');
  assert.equal(moonlabResult.cancelled, true);
  assert.equal(moonlabResult.serviceId, 'moonlab-ulg-fixture');
  assert.equal(moonlabResult.capsuleSchema, ULG_QUANTUM_TASK_CAPSULE_SCHEMA);
  assert.equal(moonlabResult.contract.runtimeDependency, 'none');

  const leases = leaseManager.list();
  const eshkolLease = leases.find((lease) => lease.rootTaskId === tasks.eshkol.rootTaskId);
  const moonlabLease = leases.find((lease) => lease.rootTaskId === tasks.moonlab.rootTaskId);
  assert.equal(eshkolLease.status, 'released');
  assert.equal(moonlabLease.status, 'revoked');
  assert.equal(moonlabLease.module, '/peercompute-fixtures/ulg/moonlab-quantum-worker.js');

  const telemetry = supervisor.getTreeTelemetry();
  assert.equal(telemetry.schema, WORKER_SUPERVISOR_TELEMETRY_SCHEMA);
  assert.equal(telemetry.registry.schema, COMPUTE_SERVICE_REGISTRY_SCHEMA);
  assert.equal(telemetry.registry.serviceCount, 2);
  assert.equal(telemetry.registry.services[0].contract.schema, ULG_SERVICE_CONTRACT_SCHEMA);

  const serviceTelemetry = new Map(telemetry.services.map((service) => [service.serviceId, service]));
  const eshkolService = serviceTelemetry.get('eshkol-ulg-fixture');
  const moonlabService = serviceTelemetry.get('moonlab-ulg-fixture');
  assert.equal(eshkolService.contract.schema, ULG_SERVICE_CONTRACT_SCHEMA);
  assert.equal(eshkolService.telemetry.schema, ULG_SERVICE_TELEMETRY_SCHEMA);
  assert.equal(eshkolService.telemetry.lastCapsuleSchema, ULG_LAW_TASK_CAPSULE_SCHEMA);
  assert.equal(moonlabService.contract.runtimeManifestSchema, ULG_RUNTIME_MANIFEST_SCHEMA);
  assert.equal(moonlabService.telemetry.lastCapsuleSchema, ULG_QUANTUM_TASK_CAPSULE_SCHEMA);
  assert.equal(moonlabService.telemetry.activeLeaseId, moonlabLease.leaseId);

  const taskTelemetry = new Map(telemetry.tasks.map((task) => [task.rootTaskId, task]));
  assert.equal(taskTelemetry.get(tasks.eshkol.rootTaskId).status, 'complete');
  assert.equal(taskTelemetry.get(tasks.moonlab.rootTaskId).status, 'cancelled-clean');
  assert.equal(taskTelemetry.get(tasks.moonlab.rootTaskId).children[0].capsuleSchema, ULG_QUANTUM_TASK_CAPSULE_SCHEMA);
  assert.equal(hosts.size, 2);
  assert.equal(events.some((event) => event.type === 'task-cancelling'), true);
});

test('WorkerSupervisor runs a fake service host with child-worker leases', async () => {
  const registry = new ComputeServiceRegistry([serviceManifest()]);
  const leaseManager = new ChildWorkerLeaseManager();
  const events = [];
  const supervisor = new WorkerSupervisor({
    registry,
    leaseManager,
    workerFactory: (manifest) => new CompletingServiceHost(manifest)
  });
  supervisor.subscribe((event) => events.push(event.type));

  const result = await supervisor.submitTask({
    serviceId: 'eshkol',
    taskKind: 'eshkol.closure.derive',
    rootTaskId: 'root-task-supervised',
    workerType: 'classic',
    resources: { childWorkers: 1 }
  });

  assert.equal(result.status, 'complete');
  assert.equal(result.value.ok, true);
  assert.equal(leaseManager.list()[0].status, 'released');
  assert.equal(leaseManager.list()[0].workerType, 'classic');
  const telemetry = supervisor.getTreeTelemetry();
  assert.equal(telemetry.schema, WORKER_SUPERVISOR_TELEMETRY_SCHEMA);
  assert.equal(telemetry.services[0].status, 'ready');
  assert.equal(telemetry.tasks[0].status, 'complete');
  assert.equal(telemetry.tasks[0].progress, 1);
  assert.equal(events.includes('service-spawned'), true);
  assert.equal(events.includes('task-submitted'), true);
});

test('WorkerSupervisor cancelTree revokes active child leases', async () => {
  const registry = new ComputeServiceRegistry([serviceManifest()]);
  const leaseManager = new ChildWorkerLeaseManager();
  const supervisor = new WorkerSupervisor({
    registry,
    leaseManager,
    workerFactory: (manifest) => new CancellableServiceHost(manifest)
  });

  const promise = supervisor.submitTask({
    serviceId: 'eshkol',
    taskKind: 'eshkol.closure.derive',
    rootTaskId: 'root-task-cancel',
    resources: { childWorkers: 1 }
  });

  await waitFor(() => leaseManager.list({ status: 'active' }).length === 1);
  await supervisor.cancelTree('root-task-cancel');
  const result = await promise;

  assert.equal(result.status, 'cancelled-clean');
  assert.equal(result.cancelled, true);
  assert.equal(leaseManager.list()[0].status, 'revoked');
  assert.equal(supervisor.getTreeTelemetry().tasks[0].status, 'cancelled-clean');
});

test('ComputeManagerServiceAdapter lets a service run through ComputeManager without a browser worker', async () => {
  const computeManager = new ComputeManager({ enableWorkers: false });
  const registry = new ComputeServiceRegistry([serviceManifest({
    serviceId: 'pc-adapter',
    entry: { adapter: 'compute-manager' },
    childWorkers: { allowed: false, maxChildren: 0, allowedModules: [] },
    capabilities: ['ulg.test.double'],
    taskKinds: ['ulg.test.double']
  })]);
  const supervisor = new WorkerSupervisor({
    registry,
    workerFactory: createComputeManagerServiceFactory(computeManager)
  });

  const result = await supervisor.submitTask({
    serviceId: 'pc-adapter',
    taskKind: 'ulg.test.double',
    rootTaskId: 'root-task-adapter',
    computeTask: {
      taskFamily: 'service-adapter-fixture',
      fn: ({ value }) => ({ doubled: value * 2 }),
      data: { value: 7 }
    }
  });

  assert.equal(result.schema, COMPUTE_MANAGER_SERVICE_ADAPTER_SCHEMA);
  assert.deepEqual(result.value, { doubled: 14 });
  assert.equal(result.status, 'complete');
  assert.equal(computeManager.getStats().totalTasksCompleted, 1);
  assert.equal(computeManager.getStats().byTaskFamily['service-adapter-fixture'].completed, 1);
  assert.equal(supervisor.getTreeTelemetry().services[0].status, 'ready');
});
