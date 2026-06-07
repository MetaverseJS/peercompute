import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import {
  ComputeServiceRegistry,
  RESOURCE_LEASE_SCHEMA,
  RESOURCE_PRESSURE_SCHEMA,
  ResourceLeaseBroker,
  WorkerSupervisor
} from '../../src/peercompute/serviceOrchestration/index.js';

class CapturingHost extends EventEmitter {
  constructor() {
    super();
    this.messages = [];
  }

  postMessage(message) {
    this.messages.push(message);
  }

  terminate() {
    this.terminated = true;
  }
}

function createRegistry() {
  return new ComputeServiceRegistry([
    {
      serviceId: 'gpu-service',
      version: '0.1.0',
      runtime: 'js',
      capabilities: ['gpu-task'],
      taskKinds: ['gpu-task'],
      entry: { adapter: 'test' }
    }
  ]);
}

test('ResourceLeaseBroker preempts lower-priority GPU leases for render work', async () => {
  let now = 1_000;
  const broker = new ResourceLeaseBroker({
    capacities: { gpu: { units: 1, memoryBytes: 1024, deviceIds: ['gpu:0'] } },
    now: () => now
  });

  const background = await broker.requestLease({
    resourceKind: 'gpu',
    rootTaskId: 'task-background',
    priorityClass: 'background',
    units: 1,
    memoryBytes: 128,
    deviceId: 'gpu:0'
  });
  assert.equal(background.schema, RESOURCE_LEASE_SCHEMA);
  assert.equal(background.status, 'active');

  now += 1;
  const render = await broker.requestLease({
    resourceKind: 'gpu',
    rootTaskId: 'task-render',
    priorityClass: 'render',
    units: 1,
    memoryBytes: 256,
    deviceId: 'gpu:0'
  });

  assert.equal(render.status, 'active');
  assert.equal(broker.get(background.leaseId).status, 'preempted');
  assert.equal(broker.get(background.leaseId).preemptedByPriority, 100);
  const pressure = broker.reportPressure();
  assert.equal(pressure.schema, RESOURCE_PRESSURE_SCHEMA);
  assert.equal(pressure.preemptionCount, 1);
  assert.equal(pressure.pools.gpu.activeUnits, 1);
  assert.equal(pressure.pools.gpu.activeMemoryBytes, 256);
  assert.equal(pressure.leaseCounts.preempted, 1);
});

test('ResourceLeaseBroker respects non-preemptable leases, expiry, release, and root revocation', async () => {
  let now = 2_000;
  const broker = new ResourceLeaseBroker({
    capacities: { gpu: { units: 2 } },
    defaultTtlMs: 50,
    now: () => now
  });

  const fixed = await broker.requestLease({
    resourceKind: 'gpu',
    rootTaskId: 'root-fixed',
    priorityClass: 'background',
    units: 2,
    preemptable: false
  });
  await assert.rejects(
    () => broker.requestLease({ resourceKind: 'gpu', rootTaskId: 'root-render', priorityClass: 'render' }),
    /Resource quota exceeded for gpu/
  );
  await broker.releaseLease(fixed.leaseId);
  assert.equal(broker.get(fixed.leaseId).status, 'released');

  const expiring = await broker.requestLease({ resourceKind: 'gpu', rootTaskId: 'root-expiring', ttlMs: 10 });
  now += 11;
  const expired = broker.expireLeases();
  assert.equal(expired.length, 1);
  assert.equal(broker.get(expiring.leaseId).status, 'expired');

  const revocable = await broker.requestLease({ resourceKind: 'gpu', rootTaskId: 'root-revoke' });
  const revoked = await broker.revokeByRootTask('root-revoke');
  assert.equal(revoked.length, 1);
  assert.equal(revoked[0].leaseId, revocable.leaseId);
  assert.equal(broker.get(revocable.leaseId).status, 'revoked');
});

test('ResourceLeaseBroker quarantines device-lost GPU leases and blocks new claims', async () => {
  const broker = new ResourceLeaseBroker({
    capacities: { gpu: { units: 1, deviceIds: ['gpu:0'] } }
  });
  const lease = await broker.requestLease({
    resourceKind: 'gpu',
    rootTaskId: 'root-device-lost',
    deviceId: 'gpu:0'
  });
  const quarantine = broker.quarantineResource({
    resourceKind: 'gpu',
    deviceId: 'gpu:0',
    reason: 'device-lost',
    retryable: true
  });

  assert.equal(quarantine.reason, 'device-lost');
  assert.equal(broker.get(lease.leaseId).status, 'quarantined');
  assert.equal(broker.get(lease.leaseId).retryable, true);
  assert.equal(broker.reportPressure().quarantined.length, 1);
  await assert.rejects(
    () => broker.requestLease({ resourceKind: 'gpu', rootTaskId: 'root-new', deviceId: 'gpu:0' }),
    /Resource gpu:0 is quarantined for gpu/
  );
});

test('WorkerSupervisor cancels root-task resource leases through ResourceLeaseBroker', async () => {
  const host = new CapturingHost();
  const broker = new ResourceLeaseBroker({ capacities: { gpu: { units: 1 } } });
  const supervisor = new WorkerSupervisor({
    registry: createRegistry(),
    resourceBroker: broker,
    serviceFactory: () => host
  });

  supervisor.submitTask({
    taskKind: 'gpu-task',
    rootTaskId: 'root-cancel',
    resources: {
      resourceKind: 'gpu',
      priorityClass: 'compute'
    }
  });
  await new Promise((resolve) => setTimeout(resolve, 0));

  const active = broker.list({ status: 'active', rootTaskId: 'root-cancel' });
  assert.equal(active.length, 1);
  const cancelled = await supervisor.cancelTree('root-cancel');
  assert.equal(cancelled.status, 'cancelling');
  assert.equal(broker.get(active[0].leaseId).status, 'revoked');
  assert.equal(supervisor.getTreeTelemetry().resources.leaseCounts.revoked, 1);
  assert.deepEqual(
    host.messages.filter((message) => message.type === 'cancel-task').map((message) => message.rootTaskId),
    ['root-cancel']
  );
});
