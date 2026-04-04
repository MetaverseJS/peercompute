import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const netvizRoot = path.resolve(repoRoot, 'demos/netviz');
const relayConfigDir = path.resolve(netvizRoot, 'public');
const ensureHttpsScript = path.resolve(repoRoot, 'scripts/ensure-https.mjs');
const relayServer = path.resolve(repoRoot, 'peercompute/src/relay/server.js');

const parseArgs = (argv) => {
  const args = new Map();
  argv.forEach((value, index) => {
    if (!value.startsWith('--')) return;
    const key = value.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      args.set(key, next);
    } else {
      args.set(key, true);
    }
  });
  return args;
};

const args = parseArgs(process.argv.slice(2));
const peerCount = Number(args.get('peers') || args.get('n') || 6);
const roomId = String(args.get('room') || 'scale');
const topologyId = String(args.get('topology') || 'netviz-scale');
const topologyType = String(args.get('topologyType') || 'distributed');
const renderMode = String(args.get('render') || 'off');
const connectionRadius = Number(args.get('connectionRadius') || args.get('radius') || 6);
const maxConnections = args.has('maxConnections') ? Number(args.get('maxConnections')) : null;
const targetConnections = args.has('targetConnections') ? Number(args.get('targetConnections')) : null;
const dropRelay = args.get('dropRelay') === 'true' || args.get('dropRelay') === true;
const relayRetentionMode = String(args.get('relayRetention') || args.get('retention') || '');
const relayRetentionMin = args.has('retentionMin') ? Number(args.get('retentionMin')) : null;
const controlOnlyMode = args.get('controlOnly') === 'true' || args.get('controlOnly') === true;
const settleMs = Number(args.get('settle') || args.get('wait') || 15000);
const timeoutMs = Number(args.get('timeout') || Math.max(60000, settleMs + 20000));

const spawnProcess = (label, command, commandArgs, options = {}) => {
  const child = spawn(command, commandArgs, {
    ...options,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true
  });
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk) => {
    process.stdout.write(`[${label}] ${chunk}`);
  });
  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[${label}] ${chunk}`);
  });
  return child;
};

const waitForOutput = (child, matcher, label, timeout = timeoutMs) => new Promise((resolve, reject) => {
  let timer = null;
  const onData = (chunk) => {
    if (matcher.test(chunk)) {
      cleanup();
      resolve();
    }
  };
  const onExit = (code) => {
    cleanup();
    reject(new Error(`${label} exited early (code ${code ?? 'unknown'})`));
  };
  const cleanup = () => {
    if (timer) clearTimeout(timer);
    child.stdout.off('data', onData);
    child.stderr.off('data', onData);
    child.off('exit', onExit);
  };
  timer = setTimeout(() => {
    cleanup();
    reject(new Error(`${label} did not become ready within ${timeout}ms`));
  }, timeout);
  child.stdout.on('data', onData);
  child.stderr.on('data', onData);
  child.on('exit', onExit);
});

const killProcess = (child) => {
  if (!child || child.killed) return;
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch (_) {
    try {
      child.kill('SIGTERM');
    } catch (_) {
      // ignore
    }
  }
};

const parsePeerSnapshot = (status) => {
  const telemetry = status?.telemetry || {};
  const peers = Array.isArray(telemetry.peers) ? telemetry.peers : [];
  const debug = status?.relayRetentionDebug || {};
  // Use the debug info to determine if we have a relay connection
  const relayConnected = debug.hasBootstrapRelayConnections === true;
  return {
    peerId: status?.localPeerId || 'unknown',
    peerCount: telemetry.peerCount ?? 0,
    connections: telemetry.connections ?? 0,
    relayConnected,
    hasDirectPeers: debug.hasDirectPeerConnections === true
  };
};

const run = async () => {
  const processes = [];
  const cleanup = async () => {
    processes.forEach((child) => killProcess(child));
  };
  process.on('SIGINT', () => {
    cleanup().finally(() => process.exit(1));
  });
  process.on('SIGTERM', () => {
    cleanup().finally(() => process.exit(1));
  });

  const ensureHttps = spawnProcess('https', 'node', [ensureHttpsScript], { cwd: repoRoot });
  await waitForOutput(ensureHttps, /https/i, 'https-setup', 10000).catch(() => {});
  killProcess(ensureHttps);

  const relayEnv = {
    ...process.env,
    RELAY_LISTEN_HOST: '127.0.0.1',
    RELAY_PUBLIC_HOST: '127.0.0.1',
    RELAY_PUBLIC_PROTOCOL: 'wss',
    RELAY_SSL_CERT: path.resolve(repoRoot, 'certs/dev-cert.pem'),
    RELAY_SSL_KEY: path.resolve(repoRoot, 'certs/dev-key.pem'),
    RELAY_CONFIG_DIRS: relayConfigDir,
    RELAY_PUBSUB_TYPE: 'gossipsub',
    ...(controlOnlyMode && { RELAY_CONTROL_ONLY_MODE: 'true' })
  };

  const relay = spawnProcess('relay', 'node', [relayServer], { cwd: repoRoot, env: relayEnv });
  processes.push(relay);
  await waitForOutput(relay, /Relay Address:/, 'relay', timeoutMs);

  const netviz = spawnProcess(
    'netviz',
    'npm',
    ['--prefix', netvizRoot, 'run', 'dev', '--', '--host'],
    { cwd: repoRoot, env: process.env }
  );
  processes.push(netviz);
  await waitForOutput(netviz, /https?:\/\/(localhost|127\.0\.0\.1):5182\//, 'netviz', timeoutMs);

  const browser = await chromium.launch({ headless: true, args: ['--disable-gpu', '--no-sandbox'] });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  let url = `https://localhost:5182/?room=${encodeURIComponent(roomId)}&topology=${encodeURIComponent(topologyId)}&topologyType=${encodeURIComponent(topologyType)}&render=${encodeURIComponent(renderMode)}&connectionRadius=${encodeURIComponent(connectionRadius)}`;
  if (Number.isFinite(maxConnections)) {
    url += `&maxConnections=${maxConnections}`;
  }
  if (Number.isFinite(targetConnections)) {
    url += `&targetConnections=${targetConnections}`;
  }
  if (dropRelay) {
    url += `&dropRelay=true`;
  }
  if (relayRetentionMode) {
    url += `&relayRetentionMode=${encodeURIComponent(relayRetentionMode)}`;
  }
  if (Number.isFinite(relayRetentionMin)) {
    url += `&relayRetentionMin=${relayRetentionMin}`;
  }
  console.log(`Test URL: ${url}`);
  if (controlOnlyMode) console.log('Relay control-only mode: ENABLED');

  const pages = [];
  for (let i = 0; i < peerCount; i += 1) {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => {
      const status = document.getElementById('status');
      return status && status.textContent && status.textContent.includes('Status: connected');
    }, { timeout: timeoutMs });
    pages.push(page);
  }

  await sleep(settleMs);

  const results = [];
  const debugSamples = [];
  for (const page of pages) {
    const status = await page.evaluate(() => window.__NETVIZ__?.getStatus?.() || null);
    results.push(parsePeerSnapshot(status));
    if (debugSamples.length < 3 && status?.relayRetentionDebug) {
      debugSamples.push(status.relayRetentionDebug);
    }
  }
  if (debugSamples.length > 0) {
    console.log('\nRelay retention debug (first 3 peers):');
    debugSamples.forEach((d, i) => console.log(`  Peer ${i + 1}:`, JSON.stringify(d)));
  }

  const peerCounts = results.map((entry) => entry.peerCount);
  const connectionCounts = results.map((entry) => entry.connections);
  const relayKeepers = results.filter((entry) => entry.relayConnected).length;
  const minPeers = Math.min(...peerCounts);
  const maxPeers = Math.max(...peerCounts);
  const avgPeers = peerCounts.reduce((sum, value) => sum + value, 0) / peerCounts.length;
  const avgConnections = connectionCounts.reduce((sum, value) => sum + value, 0) / connectionCounts.length;

  const directPeerCount = results.filter((entry) => entry.hasDirectPeers).length;
  console.log('\nNetViz headless scale results');
  console.log(`Peers: ${peerCount}`);
  console.log(`Peer counts (min/avg/max): ${minPeers}/${avgPeers.toFixed(2)}/${maxPeers}`);
  console.log(`Avg connections: ${avgConnections.toFixed(2)}`);
  console.log(`Relay-connected peers: ${relayKeepers}`);
  console.log(`Peers with direct WebRTC: ${directPeerCount}`);

  await browser.close();
  await cleanup();
};

run().catch(async (err) => {
  console.error('NetViz scale test failed:', err?.message || err);
  process.exitCode = 1;
});
