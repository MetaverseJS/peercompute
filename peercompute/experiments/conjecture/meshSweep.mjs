#!/usr/bin/env node
// Compare topology policies using the real WorkMesh scheduler and topology rule.
//   node peercompute/experiments/conjecture/meshSweep.mjs --regime balanced --source typical [--seeds 8] [--duration 600] [--out file.json]
import { writeFile } from 'node:fs/promises';
import { makeScenario, SCENARIOS, throughputCeiling } from './model.js';
import { runMesh, MESH_POLICIES } from './meshRun.js';

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, all) => (
  value.startsWith('--') ? [...pairs, [value.slice(2), all[i + 1]]] : pairs), []));
const seeds = Number(args.seeds ?? 8), durationS = Number(args.duration ?? 600), nodes = Number(args.nodes ?? 32);
const regime = args.regime ?? 'balanced';
const provisionedSource = (args.source ?? 'typical') === 'provisioned';
const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
function interval(values) {
  const m = mean(values);
  const sd = Math.sqrt(values.reduce((sum, value) => sum + (value - m) ** 2, 0) / Math.max(1, values.length - 1));
  return { mean: m, half: 1.96 * sd / Math.sqrt(values.length) };
}

const rows = [];
for (const name of SCENARIOS) {
  const runs = Object.fromEntries(MESH_POLICIES.map((policy) => [policy, []]));
  const ceilings = [];
  for (let seed = 1; seed <= seeds; seed += 1) {
    const scenario = makeScenario({ name, seed, nodes, regime, provisionedSource });
    ceilings.push(throughputCeiling(scenario));
    for (const policy of MESH_POLICIES) runs[policy].push(runMesh({ scenario, policy, seed, durationS }));
  }
  const row = { source: provisionedSource ? 'provisioned' : 'typical', regime, scenario: name, nodes, seeds, durationS,
    ceiling: mean(ceilings), policies: {} };
  for (const policy of MESH_POLICIES) {
    const settled = runs[policy].map((run) => run.settleS).filter((value) => value !== null);
    row.policies[policy] = {
      throughput: interval(runs[policy].map((run) => run.throughput)),
      versusSpatial: interval(runs[policy].map((run, i) => run.throughput / runs.spatial[i].throughput)),
      overCeiling: Math.max(...runs[policy].map((run, i) => run.throughput / ceilings[i])),
      settleS: settled.length ? mean(settled) : null,
      linkChangesPerNodeMinute: mean(runs[policy].map((run) => run.linkChangesPerNodeMinute)),
      duplicates: mean(runs[policy].map((run) => run.duplicates)),
      reissued: mean(runs[policy].map((run) => run.reissued))
    };
  }
  rows.push(row);
  console.log(`${row.source.padEnd(12)}${regime.padEnd(14)}${name.padEnd(13)}ceil ${row.ceiling.toFixed(0).padStart(4)}  ` + MESH_POLICIES.map((policy) => {
    const p = row.policies[policy];
    return `${policy}=${p.throughput.mean.toFixed(1)}±${p.throughput.half.toFixed(1)}`;
  }).join('  ') + `  chg ${row.policies.adaptive.linkChangesPerNodeMinute.toFixed(1)} settle ${Math.round(row.policies.adaptive.settleS ?? -1)} dup ${row.policies.adaptive.duplicates.toFixed(0)}`);
}
if (args.out) await writeFile(args.out, JSON.stringify({ rows }, null, 2) + '\n');
