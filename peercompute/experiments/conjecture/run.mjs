#!/usr/bin/env node
// Compare topology policies across scenarios and seeds.
//   node peercompute/experiments/conjecture/run.mjs [--seeds 20] [--nodes 32] [--duration 900] [--loss-at 600] [--out results.json]
import { writeFile } from 'node:fs/promises';
import { makeScenario, SCENARIOS, TASK_REGIMES } from './model.js';
import { simulate, POLICIES } from './simulate.js';

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, all) => (
  value.startsWith('--') ? [...pairs, [value.slice(2), all[i + 1]]] : pairs), []));
const seeds = Number(args.seeds ?? 20), nodes = Number(args.nodes ?? 32);
const durationS = Number(args.duration ?? 900), lossAt = Number(args['loss-at'] ?? 600);
const regimes = (args.regimes ?? Object.keys(TASK_REGIMES).join(',')).split(',');

const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
function interval(values) { // mean and half-width of a normal-approximation 95% interval
  const m = mean(values);
  const sd = Math.sqrt(values.reduce((sum, value) => sum + (value - m) ** 2, 0) / Math.max(1, values.length - 1));
  return { mean: m, half: 1.96 * sd / Math.sqrt(values.length) };
}

const rows = [];
for (const provisionedSource of [false, true]) {
  for (const regime of regimes) {
    for (const name of SCENARIOS) {
      const runs = Object.fromEntries(POLICIES.map((policy) => [policy, []]));
      for (let seed = 1; seed <= seeds; seed += 1) {
        for (const policy of POLICIES) {
          runs[policy].push(simulate({ policy, seed, durationS, loss: { atS: lossAt, fraction: 0.25 },
            scenario: makeScenario({ name, seed, nodes, regime, provisionedSource }) }));
        }
      }
      const row = { source: provisionedSource ? 'provisioned' : 'typical', regime, scenario: name, nodes, seeds,
        ceiling: mean(runs.spatial.map((run) => run.ceiling)), policies: {} };
      for (const policy of POLICIES) {
        const settled = runs[policy].map((run) => run.settleS).filter((value) => value !== null);
        const recovered = runs[policy].map((run) => run.afterLoss.settleS).filter((value) => value !== null);
        row.policies[policy] = {
          throughput: interval(runs[policy].map((run) => run.throughput)),
          // Paired by seed: the same network under two policies.
          versusSpatial: interval(runs[policy].map((run, i) => run.throughput / runs.spatial[i].throughput)),
          settleS: settled.length ? mean(settled) : null,
          linkChangesPerNodeMinute: mean(runs[policy].map((run) => run.linkChangesPerNodeMinute)),
          afterLoss: interval(runs[policy].map((run) => run.afterLoss.throughput)),
          afterLossVersusSpatial: interval(runs[policy].map((run, i) => run.afterLoss.throughput / runs.spatial[i].afterLoss.throughput)),
          afterLossSettleS: recovered.length ? mean(recovered) : null
        };
      }
      rows.push(row);
      const cell = (policy) => `${row.policies[policy].throughput.mean.toFixed(1)}±${row.policies[policy].throughput.half.toFixed(1)}`;
      console.log(`${row.source.padEnd(12)}${regime.padEnd(14)}${name.padEnd(13)}` + POLICIES.map((policy) => `${policy}=${cell(policy)}`).join('  '));
    }
  }
}
if (args.out) await writeFile(args.out, JSON.stringify({ seeds, nodes, durationS, lossAt, rows }, null, 2) + '\n');
