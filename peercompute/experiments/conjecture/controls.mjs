#!/usr/bin/env node
// Controls and sensitivity for the adaptive rule, on the cases where topology matters.
//   node peercompute/experiments/conjecture/controls.mjs [--seeds 20] [--out controls.json]
import { writeFile } from 'node:fs/promises';
import { makeScenario } from './model.js';
import { simulate } from './simulate.js';

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, all) => (
  value.startsWith('--') ? [...pairs, [value.slice(2), all[i + 1]]] : pairs), []));
const seeds = Number(args.seeds ?? 20);
const variants = {
  spatial: { policy: 'spatial' },
  adaptive: { policy: 'adaptive' },
  'blind-rewire': { policy: 'blind-rewire' },
  'no-referrals': { policy: 'adaptive', policyConfig: { referralShare: 0 } },
  'referrals-only': { policy: 'adaptive', policyConfig: { referralShare: 1 } },
  'trial-3s': { policy: 'adaptive', policyConfig: { trialMs: 3000 } },
  'trial-12s': { policy: 'adaptive', policyConfig: { trialMs: 12000 } },
  'no-backoff': { policy: 'adaptive', policyConfig: { maxExploreIntervalMs: 3000 } },
  'slow-backoff': { policy: 'adaptive', policyConfig: { maxExploreIntervalMs: 192000 } }
};
const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const rows = [];
for (const provisionedSource of [false, true]) {
  for (const regime of ['balanced', 'data-bound']) {
    for (const name of ['sites', 'decorrelated', 'far-compute']) {
      const row = { source: provisionedSource ? 'provisioned' : 'typical', regime, scenario: name, seeds, variants: {} };
      for (const [label, options] of Object.entries(variants)) {
        const runs = [];
        for (let seed = 1; seed <= seeds; seed += 1) {
          runs.push(simulate({ ...options, seed, durationS: 600, scenario: makeScenario({ name, seed, regime, provisionedSource }) }));
        }
        row.variants[label] = { throughput: mean(runs.map((run) => run.throughput)),
          linkChangesPerNodeMinute: mean(runs.map((run) => run.linkChangesPerNodeMinute)) };
      }
      rows.push(row);
      console.log(`${row.source.padEnd(12)}${regime.padEnd(12)}${name.padEnd(13)}` + Object.entries(row.variants)
        .map(([label, value]) => `${label}=${value.throughput.toFixed(0)}(${value.linkChangesPerNodeMinute.toFixed(1)})`).join(' '));
    }
  }
}
if (args.out) await writeFile(args.out, JSON.stringify({ seeds, rows }, null, 2) + '\n');
