#!/usr/bin/env node
// What the real-scheduler simulation expects for the networks a browser sweep
// will run, written down before that sweep.
//   node peercompute/experiments/conjecture/predict.mjs --nodes 40 --seeds 3 --duration 420 --out predictions.json
import { writeFile } from 'node:fs/promises';
import { makeScenario, throughputCeiling } from './model.js';
import { runMesh } from './meshRun.js';

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, all) => (
  value.startsWith('--') ? [...pairs, [value.slice(2), all[i + 1]]] : pairs), []));
const nodes = Number(args.nodes ?? 40), seeds = Number(args.seeds ?? 3), durationS = Number(args.duration ?? 420);
const rows = [];
for (const [name, source] of [['sites', 'provisioned'], ['far-compute', 'typical']]) {
  for (let seed = 1; seed <= seeds; seed += 1) {
    const scenario = makeScenario({ name, seed, nodes, regime: 'balanced', provisionedSource: source === 'provisioned' });
    const row = { scenario: name, source, seed, nodes, ceiling: throughputCeiling(scenario) };
    for (const policy of ['spatial', 'random', 'greedy', 'adaptive']) row[policy] = runMesh({ scenario, policy, seed, durationS }).throughput;
    rows.push(row);
    console.log(`${name.padEnd(12)}${source.padEnd(12)}seed ${seed} ceil ${row.ceiling.toFixed(0).padStart(4)} spatial ${row.spatial.toFixed(1).padStart(6)} random ${row.random.toFixed(1).padStart(6)} greedy ${row.greedy.toFixed(1).padStart(6)} rule ${row.adaptive.toFixed(1).padStart(6)}`);
  }
}
if (args.out) await writeFile(args.out, JSON.stringify({ nodes, durationS, rows }, null, 2) + '\n');
