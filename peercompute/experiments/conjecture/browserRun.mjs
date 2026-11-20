#!/usr/bin/env node
// Run the conjecture experiment with real browsers: headless Chrome peers on one
// machine, a local relay, WebRTC links and the library's NetworkManager,
// WorkMeshService and topology code. Compute speed and link capacity are
// emulated inside each page; everything else is real.
//   node peercompute/experiments/conjecture/browserRun.mjs --topology throughput --scenario sites [--nodes 16] [--seed 1]
//     [--regime balanced] [--source typical] [--duration 240] [--out file.json]
import { spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from 'playwright';
import { makeScenario, throughputCeiling } from './model.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../..');
const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, all) => (
  value.startsWith('--') ? [...pairs, [value.slice(2), all[i + 1]]] : pairs), []));
const options = {
  topology: args.topology ?? 'throughput', scenario: args.scenario ?? 'sites', nodes: Number(args.nodes ?? 16),
  seed: Number(args.seed ?? 1), regime: args.regime ?? 'balanced', source: args.source ?? 'typical',
  durationS: Number(args.duration ?? 240), port: Number(args.port ?? 5391)
};
const scenario = makeScenario({ name: options.scenario, seed: options.seed, nodes: options.nodes, regime: options.regime,
  provisionedSource: options.source === 'provisioned' });
const run = `${options.topology}-${options.scenario}-${options.seed}-${Date.now().toString(36)}`;
const log = (...parts) => { if (!args.quiet) console.error(...parts); };

const children = [];
function start(label, command, commandArgs, env) {
  const child = spawn(command, commandArgs, { cwd: repoRoot, env: { ...process.env, ...env }, detached: true,
    stdio: ['ignore', 'pipe', 'pipe'] });
  child.output = '';
  for (const stream of [child.stdout, child.stderr]) stream.on('data', (chunk) => { child.output += chunk; if (args.verbose) process.stderr.write(`[${label}] ${chunk}`); });
  children.push(child);
  return child;
}
async function until(check, label, timeoutMs = 60000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) { if (await check()) return; await sleep(200); }
  throw new Error(`Timed out waiting for ${label}`);
}
let publicDir, browser;
async function cleanup() {
  await browser?.close().catch(() => {});
  for (const child of children) { try { process.kill(-child.pid, 'SIGTERM'); } catch { /* gone */ } }
  if (publicDir) await rm(publicDir, { recursive: true, force: true });
}
process.on('SIGINT', () => cleanup().finally(() => process.exit(130)));
process.on('SIGTERM', () => cleanup().finally(() => process.exit(143)));

try {
  publicDir = await mkdtemp(path.join(os.tmpdir(), 'conjecture-relay-'));
  start('relay', 'node', ['peercompute/src/relay/server.js'], { RELAY_LISTEN_HOST: '127.0.0.1', RELAY_PUBLIC_HOST: '127.0.0.1',
    RELAY_PUBLIC_PROTOCOL: 'ws', RELAY_LISTEN_PORT: '0', RELAY_CONFIG_DIRS: publicDir, RELAY_PUBSUB_TYPE: args['relay-pubsub'] ?? 'floodsub' });
  const relayConfig = path.join(publicDir, 'relay-config.json');
  await until(() => existsSync(relayConfig) && JSON.parse(readFileSync(relayConfig, 'utf8')).bootstrapPeers?.length > 0, 'the relay');
  start('vite', 'npx', ['vite', '--config', path.join(here, 'browser/vite.config.js')],
    { CONJECTURE_PUBLIC_DIR: publicDir, CONJECTURE_PORT: String(options.port) });
  const base = `http://127.0.0.1:${options.port}/`;
  await until(async () => (await fetch(base).then((response) => response.ok, () => false)), 'the page server');

  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_BIN || undefined,
    args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'] });
  const context = await browser.newContext();
  const pages = [];
  const errors = [];
  for (let index = 0; index < options.nodes; index += 1) {
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(`peer ${index}: ${error.message}`));
    const query = new URLSearchParams({ index, run, topology: options.topology, scenario: options.scenario, seed: options.seed,
      nodes: options.nodes, regime: options.regime, source: options.source });
    await page.goto(`${base}?${query}`);
    pages.push(page);
  }
  await Promise.all(pages.map((page, index) => page.waitForFunction(() => window.__conjecture, null, { timeout: 120000 })
    .catch((error) => { throw new Error(`peer ${index} did not start: ${error.message}\n${errors.join('\n')}`); })));
  const ids = await Promise.all(pages.map((page) => page.evaluate(() => [window.__conjecture.peerId, window.__conjecture.index])));
  await Promise.all(pages.map((page) => page.evaluate((entries) => window.__conjecture.setPeers(entries), ids)));
  log(`${options.nodes} peers started; waiting for links`);
  // Let the first direct links form before offering work.
  await until(async () => (await pages[scenario.source].evaluate(() => window.__conjecture.stats().links.length)) > 0,
    'the source to get a direct link', 90000);
  await pages[scenario.source].evaluate((count) => window.__conjecture.submit(count), Math.ceil(400 * options.durationS));

  const samples = [];
  let previous = null, linkChanges = 0;
  const startedAt = Date.now();
  for (let second = 0; second <= options.durationS; second += 1) {
    await sleep(Math.max(0, startedAt + second * 1000 - Date.now()));
    const stats = await Promise.all(pages.map((page) => page.evaluate(() => window.__conjecture.stats())));
    const links = stats.map((entry) => entry.links.join(','));
    if (previous) links.forEach((value, i) => { if (value !== previous[i]) linkChanges += 1; });
    previous = links;
    samples.push({ t: (Date.now() - startedAt) / 1000, returned: stats[scenario.source].returned, linkChanges,
      linked: stats.filter((entry) => entry.links.length > 0).length });
    if (second % 30 === 0) log(`t=${second}s returned=${stats[scenario.source].returned} linked=${samples.at(-1).linked}/${options.nodes} changes=${linkChanges}`);
  }
  const final = await Promise.all(pages.map((page) => page.evaluate(() => window.__conjecture.stats())));
  if (args.debug) for (const entry of await Promise.all(pages.map((page) => page.evaluate(() => window.__conjecture.debug())))) console.error(JSON.stringify(entry));
  const windowS = Math.min(90, Math.floor(options.durationS / 3));
  const first = samples.find((entry) => entry.t >= options.durationS - windowS), last = samples.at(-1);
  const result = {
    ...options, run, ceiling: throughputCeiling(scenario),
    throughput: (last.returned - first.returned) / (last.t - first.t),
    wholeRun: last.returned / last.t,
    // A change is one peer's link set differing between two one-second samples.
    linkSetChangesPerNodeMinute: (last.linkChanges - first.linkChanges) / options.nodes / ((last.t - first.t) / 60),
    linkedPeers: last.linked, meanLinks: final.reduce((sum, entry) => sum + entry.links.length, 0) / options.nodes,
    duplicates: final[scenario.source].duplicates, reissued: final[scenario.source].reissued,
    executedBy: final.map((entry) => entry.executed), pageErrors: errors.slice(0, 5), samples
  };
  if (args.out) await writeFile(args.out, JSON.stringify(result, null, 2) + '\n');
  const { samples: _omit, ...summary } = result;
  console.log(JSON.stringify(summary));
} finally {
  await cleanup();
}
