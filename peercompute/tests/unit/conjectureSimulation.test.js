import test from 'node:test';
import assert from 'node:assert/strict';
import { makeScenario, throughputCeiling, SCENARIOS } from '../../experiments/conjecture/model.js';
import { simulate, POLICIES } from '../../experiments/conjecture/simulate.js';
import { spatialTopology, randomTopology, greedyTopology } from '../../experiments/conjecture/topologies.js';
import { createRng } from '../../experiments/conjecture/model.js';
import { runMesh, MESH_POLICIES } from '../../experiments/conjecture/meshRun.js';

const run = (options, scenarioOptions) => simulate({ durationS: 240, seed: 2, ...options,
  scenario: makeScenario({ seed: 2, ...scenarioOptions }) });

test('scenarios are deterministic and every baseline respects the connection limit', () => {
  for (const name of SCENARIOS) {
    const a = makeScenario({ name, seed: 5 }), b = makeScenario({ name, seed: 5 });
    assert.deepEqual(a.nodes, b.nodes);
    assert.equal(a.capacity(1, 7), b.capacity(7, 1));
    const alive = a.nodes.map(() => true);
    for (const pairs of [spatialTopology(a, alive), randomTopology(a, alive, createRng(1)), greedyTopology(a, alive)]) {
      const degree = new Array(a.nodes.length).fill(0);
      for (const [i, j] of pairs) { degree[i] += 1; degree[j] += 1; }
      assert.ok(Math.max(...degree) <= a.maxConnections);
      assert.ok(pairs.length >= a.nodes.length - 1);
    }
  }
});

test('no policy exceeds the ceiling, and repeated runs give identical results', () => {
  for (const name of SCENARIOS) {
    for (const policy of POLICIES) {
      const options = [{ policy }, { name, regime: 'data-bound', provisionedSource: true }];
      const result = run(...options);
      assert.ok(result.throughput > 0, `${name}/${policy} completes work`);
      assert.ok(result.throughput <= result.ceiling * 1.0001, `${name}/${policy} stays under the ceiling`);
      assert.ok(Math.abs(result.conservationError) < 1e-6, `${name}/${policy} conserves work`);
      assert.deepEqual(run(...options), result);
    }
  }
});

test('with identical nodes and ample bandwidth every topology reaches total compute', () => {
  const scenario = makeScenario({ name: 'uniform', seed: 2, regime: 'compute-bound' });
  const total = scenario.nodes.reduce((sum, node) => sum + node.compute, 0);
  assert.ok(Math.abs(throughputCeiling(scenario) - total) < 1e-9);
  for (const policy of POLICIES) {
    assert.ok(Math.abs(run({ policy }, { name: 'uniform', regime: 'compute-bound' }).throughput - total) / total < 0.02, policy);
  }
});

test('an isolated source computes only its own work', () => {
  const scenario = makeScenario({ name: 'sites', seed: 2 });
  const lonely = { ...scenario, capacity: () => 0 };
  const result = simulate({ scenario: lonely, policy: 'random', durationS: 120, seed: 2 });
  assert.ok(Math.abs(result.throughput - scenario.nodes[scenario.source].compute) < 1e-6);
});

test('losing a quarter of the peers lowers the ceiling and the network keeps working', () => {
  for (const policy of POLICIES) {
    const result = run({ policy, durationS: 360, loss: { atS: 180, fraction: 0.25 } }, { name: 'sites' });
    assert.ok(result.afterLoss.ceiling <= result.ceiling);
    assert.ok(result.afterLoss.throughput > 0 && result.afterLoss.throughput <= result.afterLoss.ceiling * 1.0001, policy);
    assert.ok(Math.abs(result.conservationError) < 1e-6, `${policy} accounts for work lost with failed peers`);
  }
});

test('the real scheduler reaches total compute in the uniform control and repeats exactly', () => {
  const scenario = makeScenario({ name: 'uniform', seed: 2, regime: 'compute-bound' });
  const total = scenario.nodes.reduce((sum, node) => sum + node.compute, 0);
  for (const policy of MESH_POLICIES) {
    const result = runMesh({ scenario, policy, seed: 2, durationS: 90 });
    assert.ok(Math.abs(result.throughput - total) / total < 0.02, `${policy} reached ${result.throughput} of ${total}`);
    assert.equal(result.reissued, 0);
  }
  const options = { scenario: makeScenario({ name: 'sites', seed: 2, regime: 'balanced' }), policy: 'adaptive', seed: 2, durationS: 60 };
  assert.deepEqual(runMesh(options), runMesh(options));
});
