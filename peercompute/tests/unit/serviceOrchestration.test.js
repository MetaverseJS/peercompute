import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
  normalizeUlgDemoHandoff,
  normalizeComputeServiceManifest,
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
        magnetarDipoleIsingGroundState: '000'
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
        magnetarDipoleIsingGroundState: '000'
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
        magnetarDipoleIsingGroundState: '000'
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
      return new UlgDispatchServiceHost(serviceManifest);
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
  assert.equal(result.dispatchResult.results[0].output.serviceResult.artifact.schema, ULG_DISPATCH_SERVICE_ARTIFACT_SCHEMA);
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
  assert.equal(result.dispatchResult.results[1].output.serviceResult.ingest.moduleCompiled, false);
  assert.equal(result.dispatchResult.results[1].output.serviceResult.artifact.schema, ULG_DISPATCH_SERVICE_ARTIFACT_SCHEMA);
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
