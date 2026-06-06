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
  ULG_ARTIFACT_RESULT_SCHEMA,
  ULG_ARTIFACT_SUMMARY_SCHEMA,
  ULG_DEMO_HANDOFF_ADAPTER_SCHEMA,
  ULG_DEMO_HANDOFF_SCHEMA,
  ULG_MAGNETAR_DIPOLE_ISING_CALIBRATION_SCHEMA,
  ULG_QUANTUM_RESPONSE_DESCRIPTOR_SCHEMA,
  ULG_QUANTUM_RESPONSE_PARITY_SCHEMA,
  ULG_SERVICE_CONTRACT_ADAPTER_SCHEMA,
  ULG_TASK_CAPSULE_ADAPTER_SCHEMA,
  WORKER_SUPERVISOR_TELEMETRY_SCHEMA,
  WorkerSupervisor,
  adaptUlgV05ComputeServiceManifest,
  adaptUlgV05TaskCapsule,
  createComputeManagerServiceFactory,
  createUlgV05ArtifactResult,
  normalizeUlgDemoHandoff,
  normalizeComputeServiceManifest
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
          basis: 'computational'
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

test('ULG demo handoff adapter classifies calibration, closure, and transferred WASM bytes', () => {
  const handoff = normalizeUlgDemoHandoff({
    schema: ULG_DEMO_HANDOFF_SCHEMA,
    createdAt: '2026-06-05T23:31:11.000Z',
    artifactCount: 2,
    artifacts: [{
      ref: {
        uri: 'artifact://moonlab-calibration',
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
        sourceService: 'moonlab'
      }
    }, {
      ref: {
        uri: 'artifact://eshkol-closure',
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
  assert.equal(handoff.readyCalibrationArtifact.sourceService, 'moonlab');
  assert.equal(handoff.readyCalibrationArtifact.artifactSummary.magnetarDipoleIsingGroundState, '000');
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
