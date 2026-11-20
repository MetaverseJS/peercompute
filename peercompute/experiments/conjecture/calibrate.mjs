#!/usr/bin/env node
// Does the real-scheduler simulation reproduce the browser runs once it is
// given the link behaviour the browsers measured?
//   node peercompute/experiments/conjecture/calibrate.mjs [--runs 6] [--out calibration.json]
// Compares, for each of the sixteen 20-peer browser networks, the measured
// throughput of the rule and of a fixed random graph with the simulation's,
// in its ideal form and in its calibrated form.
import { readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeScenario } from './model.js';
import { runMesh } from './meshRun.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, all) => (
  value.startsWith('--') ? [...pairs, [value.slice(2), all[i + 1]]] : pairs), []));
const runs = Number(args.runs ?? 6);
// Measured in the browser runs: a WebRTC link forms 5-10 s after the peer
// agrees and the topology tick is 1.5 s. While the rule rewires, the library
// also closes duplicate connections, resetting a stream about 0.6 times per
// peer per minute; a fixed graph saw no resets.
export const BROWSER_REALISM = Object.freeze({ setupMs: [5000, 10000], resetsPerNodeMinute: 0.6, decideMs: 1500 });

const browser = (file) => JSON.parse(readFileSync(path.join(here, 'results/browser', file), 'utf8'));
const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const networks = [];
for (const [scenario, source] of [['sites', 'provisioned'], ['far-compute', 'typical']]) {
  for (const seed of [1, 2, 3, 4]) {
    const files = (arm) => [`2026-11-20-${scenario}-${source}-${arm}-${seed}.json`, `2026-11-20-${scenario}-${source}-${arm}-${seed}-repeat.json`];
    networks.push({ scenario, regime: 'balanced', source, seed, durationS: 240, windowS: 80, random: files('random'), rule: files('rule') });
  }
}
for (const [scenario, regime] of [['far-compute', 'balanced'], ['sites', 'data-bound']]) {
  for (const seed of [1, 2, 3, 4]) {
    const files = (arm) => ['a', 'b'].map((run) => `2026-11-20-b-${scenario}-${regime}-${arm}-${run}-${seed}.json`);
    networks.push({ scenario, regime, source: 'provisioned', seed, durationS: 360, windowS: 120, random: files('random'), rule: files('rule') });
  }
}

const rows = [];
for (const network of networks) {
  const scenario = makeScenario({ name: network.scenario, seed: network.seed, nodes: 20, regime: network.regime,
    provisionedSource: network.source === 'provisioned' });
  // The fixed random arm uses the very graph the browser peers were pinned to.
  const graph = { randomGraphSeed: network.seed * 9973 + 1, windowS: network.windowS };
  const simulate = (policy, realism) => mean(Array.from({ length: policy === 'random' ? 1 : runs }, (_, run) => runMesh({
    scenario, policy, seed: network.seed * 1000 + run, durationS: network.durationS,
    realism: policy === 'random' ? graph : realism ? { ...realism, windowS: network.windowS } : { windowS: network.windowS } }).throughput));
  const row = {
    network: `${network.scenario} ${network.regime} ${network.source} ${network.seed}`,
    measured: { random: mean(network.random.map((file) => browser(file).throughput)), rule: mean(network.rule.map((file) => browser(file).throughput)) },
    ideal: { random: simulate('random', null), rule: simulate('adaptive', null) },
    calibrated: { random: simulate('random', BROWSER_REALISM), rule: simulate('adaptive', BROWSER_REALISM) }
  };
  rows.push(row);
  const ratio = (entry) => (entry.rule / entry.random).toFixed(2);
  console.log(`${row.network.padEnd(36)} measured ${row.measured.random.toFixed(0).padStart(4)}/${row.measured.rule.toFixed(0).padStart(4)} (${ratio(row.measured)})  ideal ${row.ideal.random.toFixed(0).padStart(4)}/${row.ideal.rule.toFixed(0).padStart(4)} (${ratio(row.ideal)})  calibrated ${row.calibrated.random.toFixed(0).padStart(4)}/${row.calibrated.rule.toFixed(0).padStart(4)} (${ratio(row.calibrated)})`);
}
// How far each form of the simulation is from the browsers, as a mean absolute
// error in the logarithm of throughput (0.1 is about 10%).
const error = (form, arm) => mean(rows.map((row) => Math.abs(Math.log(row[form][arm] / row.measured[arm]))));
const geo = (form) => Math.exp(mean(rows.map((row) => Math.log(row[form].rule / row[form].random))));
const summary = { runs,
  logError: { ideal: { random: error('ideal', 'random'), rule: error('ideal', 'rule') }, calibrated: { random: error('calibrated', 'random'), rule: error('calibrated', 'rule') } },
  ruleOverRandom: { measured: geo('measured'), ideal: geo('ideal'), calibrated: geo('calibrated') } };
console.log(JSON.stringify(summary));
if (args.out) await writeFile(args.out, JSON.stringify({ realism: BROWSER_REALISM, summary, rows }, null, 2) + '\n');
