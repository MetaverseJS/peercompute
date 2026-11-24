import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, mergeConfig } from 'vite';
import { chromium } from 'playwright';
import { createDemoBuildConfig } from '../../vite.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const netvizDir = path.resolve(__dirname, '..');
const outDir = `/tmp/netviz-analysis-check-${process.pid}`;
const CHROME_BIN = process.env.CHROME_BIN || '/usr/bin/google-chrome';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.wasm': 'application/wasm'
};

function runCmd(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} failed (${code}): ${stderr}`));
    });
  });
}

async function startStaticServer(rootDir) {
  const server = createServer(async (req, res) => {
    try {
      const reqPath = (req.url || '/').split('?')[0];
      const rel = reqPath === '/' ? 'index.html' : reqPath.replace(/^\/+/, '');
      const fullPath = path.resolve(rootDir, rel);
      if (!fullPath.startsWith(rootDir)) {
        res.writeHead(403).end();
        return;
      }
      const data = await readFile(fullPath);
      const ext = path.extname(fullPath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const addr = server.address();
  return { server, url: `http://127.0.0.1:${addr.port}/` };
}

let server = null;
let browser = null;
try {
  await build(mergeConfig(createDemoBuildConfig('netviz'), {
    logLevel: 'silent',
    build: { outDir, emptyOutDir: true }
  }));
  const started = await startStaticServer(outDir);
  server = started.server;

  browser = await chromium.launch({
    headless: true,
    executablePath: CHROME_BIN,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  // Avoid dialing public relay during isolated unit/UI browser test.
  await page.route('**/relay-config*.json', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ bootstrapPeers: [], pubsubType: 'gossipsub' })
  }));

  await page.goto(`${started.url}?view=all&render=low&autoConnect=0`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__NETVIZ__?.getStatus));

  // Verify topology selector includes throughput and static.
  const topoOptions = await page.locator('#topology-select option').evaluateAll((els) => els.map((e) => e.value));
  assert.ok(topoOptions.includes('throughput') && topoOptions.includes('static'));

  // Inject rich multi-subgroup / multi-ICE-path / bridge / WorkMesh / relay-audit telemetry reports
  // through the UI observer path without touching the network.
  await page.evaluate(() => {
    const now = Date.now();
    const relayId = '12D3KooWRelayAnalysisTestPeer0000000000000000000001';
    const reports = [
      {
        peerId: 'peer-lan-a',
        application: 'cubechat',
        role: 'world',
        gameId: 'cubechat',
        roomId: 'main-hall',
        topologyId: 'cubechat',
        topology: 'distributed',
        targetConnections: 2,
        maxConnections: 4,
        receivedAt: now,
        ts: now,
        rewiresPerMin: 1,
        dialFailures: 0,
        relayState: { connected: true, role: 'keeper', keepReason: 'retention-keeper', relayPeerId: relayId, gossipMeshCount: 2, directMeshPeerCount: 2, minDirectMeshPeers: 2 },
        gossipMeshPeers: ['peer-lan-b', 'peer-nat-c'],
        capabilities: { resourceTier: 'workstation', cpuCores: 16, gpuAvailable: true, gpuHardwareVerified: true },
        peers: [
          { peerId: 'peer-lan-b', via: 'webrtc', mediaPath: 'direct', signalingPath: 'direct', icePath: 'lan-host', iceProtocol: 'udp', candidatePairRttMs: 2, rttMs: 3, rxBps: 4096, txBps: 4096 },
          { peerId: 'peer-nat-c', via: 'webrtc', mediaPath: 'direct', signalingPath: 'relay-scoped', icePath: 'nat-srflx', iceProtocol: 'udp', candidatePairRttMs: 22, rttMs: 24, rxBps: 2048, txBps: 2048 },
          { peerId: relayId, via: 'direct', mediaPath: 'direct', signalingPath: 'direct', icePath: 'direct-ws', rttMs: 35 }
        ],
        compute: { workerCount: 4, activeTasks: 1, queuedTasks: 0, totalTasksCompleted: 20, totalTasksFailed: 0 },
        models: []
      },
      {
        peerId: 'peer-lan-b',
        application: 'cubechat',
        role: 'world',
        gameId: 'cubechat',
        roomId: 'main-hall',
        topologyId: 'cubechat',
        topology: 'distributed',
        targetConnections: 2,
        maxConnections: 4,
        receivedAt: now,
        ts: now,
        relayState: { connected: false, role: 'off-relay', keepReason: 'none', relayPeerId: null, gossipMeshCount: 1, directMeshPeerCount: 1, minDirectMeshPeers: 2 },
        gossipMeshPeers: ['peer-lan-a'],
        capabilities: { resourceTier: 'laptop', cpuCores: 8, gpuAvailable: true, gpuHardwareVerified: false },
        peers: [
          { peerId: 'peer-lan-a', via: 'webrtc', mediaPath: 'direct', signalingPath: 'direct', icePath: 'lan-host', iceProtocol: 'udp', candidatePairRttMs: 2, rttMs: 3, rxBps: 4096, txBps: 4096 }
        ],
        compute: { workerCount: 2, activeTasks: 0, queuedTasks: 0, totalTasksCompleted: 12, totalTasksFailed: 0 },
        models: []
      },
      {
        peerId: 'peer-nat-c',
        application: 'inference',
        role: 'models',
        gameId: 'inference',
        roomId: 'work-cluster',
        topologyId: 'inference-mesh',
        topology: 'throughput',
        targetConnections: 2,
        maxConnections: 4,
        receivedAt: now,
        ts: now,
        relayState: { connected: false, role: 'off-relay', keepReason: 'none', relayPeerId: null, gossipMeshCount: 2, directMeshPeerCount: 2, minDirectMeshPeers: 2 },
        gossipMeshPeers: ['peer-lan-a', 'peer-turn-d'],
        capabilities: { resourceTier: 'desktop', cpuCores: 12, gpuAvailable: true, gpuHardwareVerified: true },
        peers: [
          { peerId: 'peer-lan-a', via: 'webrtc', mediaPath: 'direct', icePath: 'nat-srflx', rttMs: 24, workRate: 6.4, workMesh: { tasksPerSec: 6.4, linkCost: 8.2, inFlight: 2, streamResets: 0 } },
          { peerId: 'peer-turn-d', via: 'webrtc', mediaPath: 'turn-relay', icePath: 'turn-relay', iceProtocol: 'tcp', candidatePairRttMs: 88, rttMs: 90, workRate: 1.5, workMesh: { tasksPerSec: 1.5, linkCost: 42.0, inFlight: 1, streamResets: 2 } }
        ],
        compute: { workerCount: 6, activeTasks: 3, queuedTasks: 2, totalTasksCompleted: 45, totalTasksFailed: 1 },
        models: [{ manifestCid: 'cid-qwen', name: 'Qwen 3.5 Test', task: 'text-generation', busy: false }]
      },
      {
        peerId: 'peer-turn-d',
        application: 'inference',
        role: 'compute',
        gameId: 'inference',
        roomId: 'work-cluster',
        topologyId: 'inference-mesh',
        topology: 'throughput',
        targetConnections: 2,
        maxConnections: 4,
        receivedAt: now,
        ts: now,
        dialFailures: 2,
        relayState: { connected: true, role: 'holding', keepReason: 'below-target', relayPeerId: relayId, gossipMeshCount: 1, directMeshPeerCount: 1, minDirectMeshPeers: 2 },
        gossipMeshPeers: ['peer-nat-c'],
        capabilities: { resourceTier: 'mobile', cpuCores: 4, gpuAvailable: false, gpuHardwareVerified: false },
        peers: [
          { peerId: 'peer-nat-c', via: 'webrtc', mediaPath: 'turn-relay', icePath: 'turn-relay', candidatePairRttMs: 88, rttMs: 90, workRate: 1.5 }
        ],
        compute: { workerCount: 1, activeTasks: 1, queuedTasks: 0, totalTasksCompleted: 5, totalTasksFailed: 0 },
        models: []
      }
    ];
    // Connect a minimal mock kernel via the NetViz globals by stubbing connect or injecting via BroadcastChannel?
    // Even cleaner: connect locally with empty bootstrapPeers so networkManager exists, then stub telemetry list!
    window.__FIXTURE_REPORTS__ = reports;
  });

  await page.click('#connect-btn');
  await page.waitForFunction(() => window.__NETVIZ__?.getStatus()?.connectionState === 'connected', null, { timeout: 20_000 });

  await page.evaluate(() => {
    const kernel = window.__PEERCOMPUTE_KERNELS__?.find((k) => k.isStarted);
    const manager = kernel?.getNetworkManager?.();
    if (!manager) throw new Error('NetworkManager missing after connect');
    // Confirm NetViz no longer sets allowDiscoveryDialWhenIsolated=true!
    if (manager.config.allowDiscoveryDialWhenIsolated !== false) {
      throw new Error('Expected NetViz allowDiscoveryDialWhenIsolated to be false');
    }
    manager.getNetworkTelemetryService = () => ({ list: () => window.__FIXTURE_REPORTS__ });
  });

  // Wait for two rolling history ticks (~2s) so sparklines render real SVG paths.
  await page.waitForFunction(() => (window.__NETVIZ__?.getStatus()?.diagnostics?.nodeCount === 4), null, { timeout: 10_000 });
  await page.waitForTimeout(1800);

  const diagText = await page.locator('#analysis-diagnostics').textContent();
  assert.match(diagText, /4 peers · 3 P2P edges/);
  assert.match(diagText, /LAN:1/);
  assert.match(diagText, /NAT:1/);
  assert.match(diagText, /TURN:1/);
  assert.match(diagText, /Bridges: 3/);
  assert.match(diagText, /WorkMesh: 7\.9 tasks\/s/);

  const subgroupText = await page.locator('#subgroup-summary').textContent();
  assert.match(subgroupText, /cubechat \/ main-hall/);
  assert.match(subgroupText, /inference \/ work-cluster/);

  const relayAuditText = await page.locator('#relay-audit').textContent();
  assert.match(relayAuditText, /On-relay: 2 · keepers: 1 · off-relay: 2/);
  assert.match(relayAuditText, /retention-keeper=1/);
  assert.match(relayAuditText, /below-target=1/);

  // Exercise all groupBy modes & color lenses & subgroup focus without page errors.
  for (const mode of ['relay', 'topology', 'transport', 'none', 'room']) {
    await page.selectOption('#subgroup-by', mode);
    await page.waitForTimeout(80);
  }
  for (const lens of ['transport', 'rtt', 'degree', 'workmesh', 'capabilities', 'role']) {
    await page.selectOption('#color-lens', lens);
    await page.waitForTimeout(80);
  }

  // Test subgroup focus drill-down.
  const subgroupValues = await page.locator('#subgroup-filter option').evaluateAll((els) => els.map((e) => e.value));
  assert.ok(subgroupValues.length >= 3, 'expected All + 2 subgroups');
  await page.selectOption('#subgroup-filter', subgroupValues[1]);
  await page.waitForTimeout(150);
  const focusedStatus = await page.evaluate(() => window.__NETVIZ__.getStatus());
  assert.equal(focusedStatus.diagnostics.nodeCount, 2);
  await page.selectOption('#subgroup-filter', '');
  await page.waitForTimeout(150);

  // Verify JSON snapshot export structure.
  const exported = await page.evaluate(() => window.__NETVIZ__.exportAnalysisSnapshot());
  assert.equal(exported.schema, 'peercompute.netviz-analysis.v1');
  assert.equal(exported.diagnostics.nodeCount, 4);
  assert.equal(exported.subgroups.length, 2);
  assert.ok(exported.gossipEdges.length >= 2);
  assert.ok(exported.workMeshEdges.length >= 2);
  assert.ok(exported.history.length >= 1);
  assert.ok(Array.isArray(exported.relayHealth));
  assert.ok(Array.isArray(exported.directUnicastPeers));

  // Verify live Goal profile, Host group, Relay URL input, and Session-mode analysis panel visibility.
  assert.ok(await page.locator('#relay-config-url').count() === 1);
  assert.ok(await page.locator('#role-filter option[value="root"]').count() === 1);
  await page.selectOption('#throughput-profile', 'lan-first');
  await page.fill('#host-group-id', 'pi-lab');
  await page.selectOption('#network-view', 'session');
  await page.waitForTimeout(150);
  const sessionAnalysisVisible = await page.locator('#analysis-panel').isVisible();
  assert.equal(sessionAnalysisVisible, true, 'analysis panel should remain visible in Selected session view');
  const sessionStatus = await page.evaluate(() => window.__NETVIZ__.getStatus());
  assert.equal(sessionStatus.throughputProfile, 'lan-first');
  assert.equal(sessionStatus.hostGroupId, 'pi-lab');
  await page.selectOption('#network-view', 'all');
  await page.waitForTimeout(100);

  // Verify mobile viewport has no horizontal overflow.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(100);
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.equal(mobileOverflow, false, 'mobile viewport should have zero horizontal overflow');
  assert.deepEqual(pageErrors, [], `unexpected page errors: ${pageErrors.join('; ')}`);

  console.log(JSON.stringify({
    passed: true,
    nodeCount: exported.diagnostics.nodeCount,
    subgroups: exported.subgroups.map((s) => s.label),
    bridges: exported.diagnostics.bridgeEdgeKeys,
    gossipEdges: exported.gossipEdges.length,
    workMeshEdges: exported.workMeshEdges.length,
    historySamples: exported.history.length,
    sparklinePaths: await page.locator('#sparklines-box svg path').count()
  }, null, 2));
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) await new Promise((resolve) => server.close(resolve)).catch(() => {});
  await rm(outDir, { recursive: true, force: true }).catch(() => {});
}
