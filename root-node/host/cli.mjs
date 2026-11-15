#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { BrowserHost } from './BrowserHost.mjs';

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Usage: node root-node/host/cli.mjs [--config /path/host.json] [--qualify] [--no-build]\nRuntime state defaults to ~/.local/share/peercompute/root. See root-node/README.md.');
  process.exit(0);
}
let config = {};
let qualify = false;
let rebuild = true;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--config' && args[i + 1]) config = JSON.parse(await readFile(args[++i], 'utf8'));
  else if (args[i] === '--qualify') qualify = true;
  else if (args[i] === '--no-build') rebuild = false;
  else throw new Error(`Unknown or incomplete argument: ${args[i]}`);
}
const host = new BrowserHost(config);
let exiting = false;
let monitor;
async function shutdown(code = 0) {
  if (exiting) return;
  exiting = true;
  clearInterval(monitor);
  try { await host.stop(); } catch (error) { console.error(error.message); code = 1; }
  process.exitCode = code;
}
process.once('SIGINT', () => void shutdown());
process.once('SIGTERM', () => void shutdown());
try {
  console.log(JSON.stringify(await host.start({ rebuild }), null, 2));
  if (qualify) { console.log(JSON.stringify(await host.qualifyCompute(), null, 2)); await shutdown(); }
  else if (!exiting) {
    let previousState = host.state;
    monitor = setInterval(() => {
      if (host.state !== previousState) {
        previousState = host.state;
        console.log(JSON.stringify({ state: host.state, restarts: host.restarts, error: host.lastError }));
      }
      if (host.state === 'failed') void shutdown(1);
    }, 1000);
    monitor.unref();
  }
} catch (error) { console.error(error.message); await shutdown(1); }
