import assert from 'node:assert/strict';
import test from 'node:test';
import { runNBodyCapsule } from './ulg.mjs';

function fixture() {
  const bodies = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const parameters = { dt: 0.05 };
  const capsule = {
    serviceId: 'ulg-runtime', taskKind: 'simulation.step', taskId: 'step-one',
    inputHash: 'input-one', methodHash: 'gravity-v1', provenance: { codeVersion: 'nbody-test' },
    input: { stepIndex: 0, parameters }, validation: { mode: 'self' }
  };
  const simulation = {
    count: 1, activeCount: 1, gravityMode: 'direct', stepIndex: 0,
    async step(options) {
      assert.equal(options, parameters);
      this.stepIndex++;
      return bodies;
    }
  };
  const host = { simulation, createSimulationArtifact: fields => fields };
  return { bodies, capsule, host };
}

test('ULG receives the completed step in a serializable interleaved tensor', async () => {
  const { bodies, capsule, host } = fixture();
  const result = await runNBodyCapsule(capsule, host);
  const state = result.outputs.finalState;
  assert.deepEqual(state.shape, [1, 8]);
  assert.deepEqual(state.values, Array.from(bodies));
  assert.equal(state.stepIndex, 1);
  assert.equal(result.validity.bodyCount, 1);
  assert.equal(result.execution.gravityMode, 'direct');
  assert.equal(result.provenance.inputHash, capsule.inputHash);
  await assert.rejects(runNBodyCapsule(capsule, host), /resident simulation state/);
  assert.equal(host.simulation.stepIndex, 1);
});

test('unsupported service, kind or validation level cannot advance the system', async () => {
  const { capsule, host } = fixture();
  for (const fields of [
    { serviceId: 'eshkol' }, { taskKind: 'closure.consume' }, { validation: { mode: 'cpu-reference' } }
  ]) {
    await assert.rejects(runNBodyCapsule({ ...capsule, ...fields }, host));
  }
  assert.equal(host.simulation.stepIndex, 0);
});
