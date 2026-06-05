import test from 'node:test';
import assert from 'node:assert/strict';
import { ComputeManager } from '../../src/peercompute/computeManager/ComputeManager.js';
import {
  SOLVER_DESCRIPTOR_SCHEMA,
  SOLVER_TASK_SCHEMA,
  SolverRegistry,
  normalizeSolverDescriptor
} from '../../src/peercompute/computeManager/SolverRegistry.js';

function nbodyDescriptor() {
  return {
    id: 'nbody-gravity',
    kind: 'gravity.nbody',
    version: '0.1.0',
    inputFields: [
      { name: 'mass', unit: 'kg', dimensions: 'M', location: 'particle' },
      { name: 'position', unit: 'm', dimensions: 'L', location: 'particle' }
    ],
    outputFields: [
      { name: 'acceleration', unit: 'm/s^2', dimensions: 'L T^-2', location: 'particle' }
    ],
    conservedFields: ['mass', 'momentum', 'energy'],
    timestep: { mode: 'symplectic', maxDt: 1, subcycles: 1 },
    validity: { regimes: ['solar', 'galactic'] },
    warmDelta: { scope: 'solver-test', schema: 'peercompute.test.nbody.delta.v0' },
    fn: ({ solver, stateKey, input }) => {
      const mass = Number(input.mass || 0);
      const radius = Math.max(1, Number(input.radius || 1));
      const acceleration = mass / (radius * radius);
      return {
        value: {
          ok: true,
          schema: 'peercompute.test.nbody.result.v0',
          solverId: solver.id,
          acceleration
        },
        commitDelta: {
          taskId: stateKey,
          scope: solver.warmDelta.scope,
          version: input.version || 1,
          timestamp: input.timestamp || 0,
          payload: {
            schema: solver.warmDelta.schema,
            solverId: solver.id,
            acceleration
          }
        }
      };
    }
  };
}

test('normalizeSolverDescriptor validates typed solver contracts', () => {
  const descriptor = normalizeSolverDescriptor(nbodyDescriptor());
  assert.equal(descriptor.schema, SOLVER_DESCRIPTOR_SCHEMA);
  assert.equal(descriptor.id, 'nbody-gravity');
  assert.equal(descriptor.kind, 'gravity.nbody');
  assert.equal(descriptor.inputFields[0].name, 'mass');
  assert.equal(descriptor.outputFields[0].unit, 'm/s^2');
  assert.deepEqual(descriptor.conservedFields.map((field) => field.name), ['mass', 'momentum', 'energy']);
  assert.equal(descriptor.timestep.mode, 'symplectic');
  assert.equal(descriptor.warmDelta.scope, 'solver-test');
  assert.equal(descriptor.hasExecutor, true);
  assert.throws(() => normalizeSolverDescriptor({ kind: 'missing.id' }), /solver.id/);
});

test('SolverRegistry creates affinity-keyed ComputeManager tasks', () => {
  const registry = new SolverRegistry([nbodyDescriptor()]);
  const task = registry.createTask('nbody-gravity', {
    id: 'nbody:test',
    stateKey: 'solar:tile:0',
    input: { mass: 12, radius: 3, version: 7 },
    placementHint: {
      solverKey: 'nbody',
      recommendedPlacement: 'peer',
      syncMode: 'coarse-sync',
      confidence: 0.72,
      targetReplicaCount: 2
    }
  });

  assert.equal(task.id, 'nbody:test');
  assert.equal(task.solverId, 'nbody-gravity');
  assert.equal(task.taskFamily, 'nbody-gravity');
  assert.equal(task.affinityKey, 'nbody-gravity:solar:tile:0');
  assert.equal(task.data.schema, SOLVER_TASK_SCHEMA);
  assert.equal(task.data.solver.id, 'nbody-gravity');
  assert.equal(task.data.stateKey, 'solar:tile:0');
  assert.equal(task.data.scope, 'solver-test');
  assert.equal(task.data.input.mass, 12);
  assert.equal(task.placementHint.solverKey, 'nbody');
  assert.equal(task.placementHint.recommendedPlacement, 'peer');
  assert.equal(task.placementHint.targetReplicaCount, 2);
  assert.deepEqual(task.data.placementHint, task.placementHint);
});

test('ComputeManager registers and runs solver tasks through commitDelta flow', async () => {
  const manager = new ComputeManager({
    enableWorkers: false,
    solvers: [nbodyDescriptor()]
  });
  const deltas = [];
  manager.setCommitDeltaHandler((delta) => deltas.push(delta));

  const result = await manager.submitSolverTask('nbody-gravity', {
    id: 'nbody:inline',
    stateKey: 'solar:tile:1',
    input: { mass: 18, radius: 3, version: 2 }
  });

  assert.equal(result.ok, true);
  assert.equal(result.solverId, 'nbody-gravity');
  assert.equal(result.acceleration, 2);
  assert.equal(deltas.length, 1);
  assert.equal(deltas[0].taskId, 'solar:tile:1');
  assert.equal(deltas[0].scope, 'solver-test');
  assert.equal(deltas[0].payload.schema, 'peercompute.test.nbody.delta.v0');
  assert.equal(manager.getCapabilities().solverCount, 1);
  assert.equal(manager.listSolvers()[0].id, 'nbody-gravity');
  const stats = manager.getStats();
  assert.equal(stats.byTaskFamily['nbody-gravity'].submitted, 1);
  assert.equal(stats.byTaskFamily['nbody-gravity'].completed, 1);
  assert.equal(stats.workerUtilization.schema, 'peercompute.compute.worker-utilization.v0');
  assert.equal(stats.workerUtilization.inline.byTaskFamily['nbody-gravity'].submitted, 1);
  assert.equal(stats.workerUtilization.inline.byTaskFamily['nbody-gravity'].completed, 1);
  assert.equal(stats.workerUtilization.inline.lastTaskFamily, 'nbody-gravity');
  assert.equal(stats.taskPlacement.schema, 'peercompute.compute.task-placement.v0');
  assert.equal(stats.taskPlacement.byRecommendedPlacement.local.completed, 1);
  assert.equal(stats.taskPlacement.byActualPlacement['local-inline'].completed, 1);
});
