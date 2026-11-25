#!/usr/bin/env node
// The rule against a fixed random graph at larger sizes, using the simulation
// calibrated against the browser runs (calibrate.mjs).
//   node peercompute/experiments/conjecture/scaleCalibrated.mjs --nodes 64 [--seeds 10] [--duration 600] [--out file.json]
import { writeFile } from 'node:fs/promises';
import { makeScenario, throughputCeiling } from './model.js';
import { runMesh } from './meshRun.js';
import { BROWSER_REALISM } from './calibrate.mjs';

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, all) => (
  value.startsWith('--') ? [...pairs, [value.slice(2), all[i + 1]]] : pairs), []));
const nodes = Number(args.nodes ?? 64), seeds = Number(args.seeds ?? 10), durationS = Number(args.duration ?? 600);
const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const cases = [['sites', 'balanced', 'provisioned'], ['far-compute', 'balanced', 'typical'], ['far-compute', 'balanced', 'provisioned'],
  ['decorrelated', 'balanced', 'provisioned'], ['sites', 'data-bound', 'provisioned'], ['uniform', 'balanced', 'typical']];
const rows = [];
for (const [name, regime, source] of cases) {
  const runs = [];
  for (let seed = 1; seed <= seeds; seed += 1) {
    const scenario = makeScenario({ name, seed, nodes, regime, provisionedSource: source === 'provisioned' });
    const run = (policy) => runMesh({ scenario, policy, seed, durationS, realism: BROWSER_REALISM });
    const random = run('random'), greedy = run('greedy'), rule = run('adaptive');
    runs.push({ seed, ceiling: throughputCeiling(scenario), random: random.throughput, greedy: greedy.throughput, rule: rule.throughput,
      changes: rule.linkChangesPerNodeMinute });
  }
  const ratios = runs.map((run) => run.rule / run.random);
  const row = { scenario: name, regime, source, nodes, seeds, durationS, ceiling: mean(runs.map((run) => run.ceiling)),
    random: mean(runs.map((run) => run.random)), greedy: mean(runs.map((run) => run.greedy)), rule: mean(runs.map((run) => run.rule)),
    ruleOverRandom: Math.exp(mean(ratios.map(Math.log))), ahead: ratios.filter((ratio) => ratio > 1.05).length,
    behind: ratios.filter((ratio) => ratio < 0.95).length, changes: mean(runs.map((run) => run.changes)), runs };
  rows.push(row);
  console.log(`${String(nodes).padStart(3)} ${name.padEnd(13)}${regime.padEnd(11)}${source.padEnd(12)}ceil ${row.ceiling.toFixed(0).padStart(4)} random ${row.random.toFixed(1).padStart(6)} greedy ${row.greedy.toFixed(1).padStart(6)} rule ${row.rule.toFixed(1).padStart(6)}  rule/random ${row.ruleOverRandom.toFixed(2)} (ahead ${row.ahead}, behind ${row.behind} of ${seeds})  chg ${row.changes.toFixed(1)}`);
}
if (args.out) await writeFile(args.out, JSON.stringify({ realism: BROWSER_REALISM, rows }, null, 2) + '\n');
