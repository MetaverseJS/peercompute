import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createReadStream, existsSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const docsRoot = path.join(repoRoot, 'docs');
const multiscaleDocsRoot = path.join(docsRoot, 'multiscale');
const host = process.env.ULG_RELAY_HANDOFF_HOST || '127.0.0.1';
const port = Number(process.env.ULG_RELAY_HANDOFF_PORT || 4196);
const baseUrl = `http://${host}:${port}/multiscale/`;
const ulgUrl = process.env.ULG_HANDOFF_URL || 'http://127.0.0.1:5173/';
const timeoutMs = Number(process.env.ULG_RELAY_HANDOFF_TIMEOUT_MS || 90000);
const relayConfigTimeoutMs = Number(process.env.RELAY_CONFIG_TIMEOUT_MS || 60000);
const chromeBin = process.env.CHROME_BIN || '/bin/google-chrome';
const headless = process.env.HEADLESS !== '0';
const runDispatchAdapters = process.env.ULG_RELAY_HANDOFF_RUN_DISPATCH === '1';
const relayTurnHost = process.env.RELAY_TURN_HOST || 'secretworkshop.net';
const relayTurnPort = process.env.RELAY_TURN_PORT || '3478';
const relayTurnUsername = process.env.RELAY_TURN_USERNAME || 'peer';
const relayTurnCredential = process.env.RELAY_TURN_CREDENTIAL || 'compute';
const relayWebrtcConfig = process.env.ULG_RELAY_HANDOFF_WEBRTC_CONFIG
  || process.env.RELAY_WEBRTC_CONFIG
  || JSON.stringify({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      {
        urls: [
          `turn:${relayTurnHost}:${relayTurnPort}?transport=udp`,
          `turn:${relayTurnHost}:${relayTurnPort}?transport=tcp`
        ],
        username: relayTurnUsername,
        credential: relayTurnCredential
      }
    ],
    dropRelayOnDirect: true,
    dropRelayBootstrapOnDirect: true,
    countRelayWebrtcAsDirectCapable: true,
    relayRetention: { mode: 'logn', min: 1, max: 10 }
  });

const EXPECTED_CANONICAL_SUITE_HASH = 'sha256:7d4e6372e49689d2202914e210af84d19d776dc6fbc5b7e08b19cbedfb71b455';
const EXPECTED_ESHKOL_SOURCE_HASH = 'sha256:73f2a89ffe3434d995ffe1174185462cf0c2edb653fbe4d1286342b788763052';
const EXPECTED_ESHKOL_WASM_HASH = 'sha256:38902bb4b3f5ed8abf513a4d739ff9ca99727696df271c3ff17127575785b947';

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const ignoredConsoleErrors = [
  /Failed to acquire a WebGPU adapter/i,
  /WebGPU is not supported/i,
  /WebGPU device lost/i,
  /Device was destroyed/i,
  /Failed to load resource: the server responded with a status of 404/i
];

function resolveRequestPath(reqUrl) {
  const reqPath = decodeURIComponent((reqUrl || '/').split('?')[0]);
  const trimmed = reqPath.replace(/^\/+/, '');
  const rawPath = trimmed.endsWith('/') || trimmed === ''
    ? `${trimmed}index.html`
    : trimmed;
  const normalized = path.normalize(path.join(docsRoot, rawPath));
  if (!normalized.startsWith(docsRoot)) return null;
  return normalized;
}

function startServer() {
  const server = http.createServer((req, res) => {
    const filePath = resolveRequestPath(req.url);
    if (!filePath) {
      res.writeHead(403);
      res.end();
      return;
    }
    try {
      const ext = path.extname(filePath);
      const stat = statSync(filePath);
      res.writeHead(200, {
        'Content-Type': mime[ext] || 'application/octet-stream',
        'Content-Length': stat.size
      });
      createReadStream(filePath).pipe(res);
    } catch (_) {
      res.writeHead(404);
      res.end();
    }
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => resolve(server));
  });
}

function checkDocsBuild() {
  const indexPath = path.join(multiscaleDocsRoot, 'index.html');
  if (!existsSync(indexPath)) {
    throw new Error('docs/multiscale/index.html missing. Run `npm --prefix demos/multiscale run build` first.');
  }
}

function waitForFiles(filePaths, waitMs) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (filePaths.every((filePath) => existsSync(filePath))) {
        resolve();
        return;
      }
      if (Date.now() - start > waitMs) {
        reject(new Error(`Timed out waiting for ${filePaths.join(', ')}`));
        return;
      }
      setTimeout(tick, 200);
    };
    tick();
  });
}

function snapshotFiles(filePaths) {
  return new Map(filePaths.map((filePath) => {
    if (!existsSync(filePath)) {
      return [filePath, { existed: false, content: null }];
    }
    return [filePath, { existed: true, content: readFileSync(filePath) }];
  }));
}

function restoreFiles(snapshots) {
  for (const [filePath, snapshot] of snapshots.entries()) {
    if (snapshot.existed) {
      writeFileSync(filePath, snapshot.content);
    } else if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}

function signalRelay(child, signal) {
  if (!child?.pid) return;
  if (process.platform !== 'win32') {
    try {
      process.kill(-child.pid, signal);
      return;
    } catch (error) {
      if (error?.code === 'ESRCH') return;
    }
  }
  try {
    child.kill(signal);
  } catch (_) {
    // Relay shutdown may already be complete.
  }
}

function stopRelay(relay) {
  const child = relay?.child;
  if (!child || child.exitCode !== null || child.signalCode !== null) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    let settled = false;
    let killTimer;
    let doneTimer;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(killTimer);
      clearTimeout(doneTimer);
      child.off('exit', finish);
      resolve();
    };
    child.once('exit', finish);
    signalRelay(child, 'SIGTERM');
    killTimer = setTimeout(() => signalRelay(child, 'SIGKILL'), 2000);
    doneTimer = setTimeout(finish, 5000);
  });
}

function startRelay() {
  const relayConfigFiles = [
    path.join(multiscaleDocsRoot, 'relay-config.json'),
    path.join(multiscaleDocsRoot, '.relay-config.json'),
    path.join(multiscaleDocsRoot, 'relay-config-source.json'),
    path.join(multiscaleDocsRoot, '.relay-config-source.json')
  ];
  const relayConfigSnapshots = snapshotFiles(relayConfigFiles);
  relayConfigFiles.forEach((filePath) => {
    if (!existsSync(filePath)) return;
    try {
      unlinkSync(filePath);
    } catch (_) {
      // Best effort before the relay writes the dynamic config.
    }
  });

  const child = spawn('bash', [path.join(repoRoot, 'scripts', 'run-relay.sh')], {
    env: {
      ...process.env,
      RELAY_LISTEN_HOST: host,
      RELAY_LISTEN_PORT: '0',
      RELAY_PUBLIC_HOST: host,
      RELAY_CONFIG_DIRS: multiscaleDocsRoot,
      RELAY_WEBRTC_CONFIG: relayWebrtcConfig
    },
    detached: process.platform !== 'win32',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  child.stdout.on('data', (chunk) => process.stdout.write(chunk));
  child.stderr.on('data', (chunk) => process.stderr.write(chunk));
  return {
    child,
    relayConfigPath: path.join(multiscaleDocsRoot, 'relay-config.json'),
    relayConfigSnapshots
  };
}

function attachDiagnostics(page, label, errors) {
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (ignoredConsoleErrors.some((pattern) => pattern.test(text))) return;
    errors.push(`[${label} console] ${text}`);
  });
  page.on('pageerror', (error) => {
    const message = error?.message || String(error);
    if (ignoredConsoleErrors.some((pattern) => pattern.test(message))) return;
    errors.push(`[${label} pageerror] ${message}`);
  });
}

function buildMultiscaleUrl(roomId) {
  const params = new URLSearchParams({
    scenario: 'magnetar',
    relayConfigUrl: './relay-config.json',
    enablePeerNetwork: '1',
    enableRemoteComputeResponder: '1',
    autoWireRemotePlacement: '0',
    peerRoomId: roomId,
    peerTopologyId: `${roomId}-topology`,
    peerStateTopic: `pc.${roomId}.state`,
    autoScaleWorkloads: 'false',
    enableRemotePlacement: '0',
    enableRemoteSolverPlacement: '0'
  });
  return `${baseUrl}?${params.toString()}`;
}

async function waitForMultiscaleApi(page, label) {
  await page.waitForFunction(() => window.__multiscaleDemo?.getState, null, { timeout: timeoutMs });
  await page.waitForFunction(() => window.__multiscaleDemo?.startPeerNetwork, null, { timeout: timeoutMs });
  const api = await page.evaluate(() => ({
    hasReceiveUlgBrowserHandoff: typeof window.__multiscaleDemo.receiveUlgBrowserHandoff === 'function',
    hasRunUlgDispatchServiceAdapterProbe: typeof window.__multiscaleDemo.runUlgDispatchServiceAdapterProbe === 'function',
    hasStartPeerNetwork: typeof window.__multiscaleDemo.startPeerNetwork === 'function'
  }));
  if (!api.hasReceiveUlgBrowserHandoff || !api.hasRunUlgDispatchServiceAdapterProbe || !api.hasStartPeerNetwork) {
    throw new Error(`${label} missing required Multiscale ULG/peer-network APIs: ${JSON.stringify(api)}`);
  }
  return api;
}

async function startPeerNetwork(page, config = {}) {
  return page.evaluate((options) => window.__multiscaleDemo.startPeerNetwork({
    enablePeerNetwork: true,
    enableRemoteComputeResponder: true,
    autoWireRemotePlacement: false,
    ...options
  }), config);
}

async function waitForStartedPeer(page, label) {
  await page.waitForFunction(() => {
    const status = window.__multiscaleDemo.getPeerNetworkStatus?.();
    return status?.isStarted === true
      && Boolean(status?.peerId)
      && status?.networkConnected === true
      && status?.bootstrapPeerCount > 0;
  }, null, { timeout: timeoutMs });
  const status = await page.evaluate(() => window.__multiscaleDemo.getPeerNetworkStatus());
  if (!status.peerId) throw new Error(`${label} did not expose a peer id`);
  return status;
}

async function waitForPeerVisible(page, expectedPeerId, label) {
  await page.waitForFunction((peerId) => {
    const status = window.__multiscaleDemo.getPeerNetworkStatus?.();
    return Array.isArray(status?.connectedPeerIds) && status.connectedPeerIds.includes(peerId);
  }, expectedPeerId, { timeout: timeoutMs });
  const status = await page.evaluate(() => window.__multiscaleDemo.getPeerNetworkStatus());
  if (!status.connectedPeerIds.includes(expectedPeerId)) {
    throw new Error(`${label} never saw peer ${expectedPeerId}: ${JSON.stringify(status)}`);
  }
  return status;
}

async function readUlgHandoff(ulgPage) {
  await ulgPage.goto(ulgUrl, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
  await ulgPage.waitForFunction(() => window.__ulgDemo?.telemetry?.artifacts?.length >= 2, null, {
    timeout: timeoutMs
  });
  return ulgPage.evaluate(async () => {
    const handoff = await window.__ulgDemo.createPeerComputeHandoff();
    const eshkol = handoff.artifacts.find((artifact) => artifact.ref.sourceService === 'eshkol');
    const moonlab = handoff.artifacts.find((artifact) => artifact.ref.sourceService === 'moonlab');
    return {
      handoff,
      probe: {
        artifactCount: handoff.artifactCount,
        canonicalSuiteHash: eshkol?.artifact?.validation?.closureDescriptor?.descriptorBinding?.moonlabNormalizedReferenceSuite?.contentHash || null,
        sourceSha256: eshkol?.artifact?.provenance?.sourceSha256 || null,
        wasmSha256: eshkol?.artifact?.provenance?.wasmSha256 || null,
        moonlabSourceService: moonlab?.ref?.sourceService || null,
        eshkolSourceService: eshkol?.ref?.sourceService || null
      }
    };
  });
}

async function openPopupFromUlg(ulgPage, popupUrl) {
  const popupName = `ulgRelayHandoffSmoke_${Date.now().toString(36)}`;
  await ulgPage.evaluate(() => {
    window.__ulgRelayHandoffSmoke = {
      acks: [],
      popup: null,
      popupName: null
    };
    window.addEventListener('message', (event) => {
      if (event.data?.schema === 'peercompute.multiscale.browser-handoff-ack.v0') {
        window.__ulgRelayHandoffSmoke.acks.push(event.data);
      }
    });
  });
  const [popup] = await Promise.all([
    ulgPage.context().waitForEvent('page', { timeout: timeoutMs }),
    ulgPage.evaluate(({ url, name }) => {
      const popupWindow = window.open(url, name);
      window.__ulgRelayHandoffSmoke.popup = popupWindow;
      window.__ulgRelayHandoffSmoke.popupName = name;
    }, { url: popupUrl, name: popupName })
  ]);
  return popup;
}

async function postHandoffFromUlg(ulgPage, handoff, targetOrigin, handoffId) {
  return ulgPage.evaluate(({ payload, origin, id }) => new Promise((resolve, reject) => {
    const state = window.__ulgRelayHandoffSmoke || {};
    const popup = state.popup || (state.popupName ? window.open('', state.popupName) : null);
    if (!popup) {
      reject(new Error('ULG relay handoff popup missing'));
      return;
    }
    const timer = setTimeout(() => {
      window.removeEventListener('message', onMessage);
      reject(new Error('Timed out waiting for Multiscale handoff ack'));
    }, 45000);
    const onMessage = (event) => {
      if (event.data?.schema !== 'peercompute.multiscale.browser-handoff-ack.v0') return;
      if (event.data?.handoffId !== id) return;
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      resolve(event.data);
    };
    window.addEventListener('message', onMessage);
    popup.postMessage({
      schema: 'ulg.peercompute.browser-handoff-post.v0',
      handoffId: id,
      handoff: payload
    }, origin);
  }), {
    payload: handoff,
    origin: targetOrigin,
    id: handoffId
  });
}

async function receiveHandoffDirectly(popup, handoff, handoffId) {
  return popup.evaluate(({ payload, id }) => (
    window.__multiscaleDemo.receiveUlgBrowserHandoff({
      schema: 'ulg.peercompute.browser-handoff-post.v0',
      handoffId: id,
      handoff: payload
    })
  ), {
    payload: handoff,
    id: handoffId
  });
}

async function readRelayConfigSummary(relayConfigPath) {
  const config = JSON.parse(readFileSync(relayConfigPath, 'utf8'));
  return {
    bootstrapPeerCount: Array.isArray(config.bootstrapPeers) ? config.bootstrapPeers.length : 0,
    firstBootstrapPeer: Array.isArray(config.bootstrapPeers) ? config.bootstrapPeers[0] || null : null,
    pubsubType: config.pubsubType || null,
    iceServerCount: Array.isArray(config.webrtc?.iceServers) ? config.webrtc.iceServers.length : 0,
    hasStun: JSON.stringify(config.webrtc?.iceServers || []).includes('stun:'),
    hasTurn: JSON.stringify(config.webrtc?.iceServers || []).includes('turn:')
  };
}

async function main() {
  checkDocsBuild();

  const server = await startServer();
  const relay = startRelay();
  const errors = [];
  let browser;
  try {
    await waitForFiles([relay.relayConfigPath], relayConfigTimeoutMs);
    const relayConfig = await readRelayConfigSummary(relay.relayConfigPath);
    assert.equal(relayConfig.bootstrapPeerCount > 0, true);
    assert.equal(relayConfig.hasStun, true);
    assert.equal(relayConfig.hasTurn, true);

    browser = await chromium.launch({
      executablePath: chromeBin,
      headless,
      args: [
        '--ignore-certificate-errors',
        '--enable-unsafe-webgpu',
        '--enable-unsafe-swiftshader'
      ]
    });
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: { width: 1440, height: 920 }
    });
    const roomId = `ulg-relay-handoff-${Date.now().toString(36)}`;
    const multiscaleUrl = buildMultiscaleUrl(roomId);

    const roomPeer = await context.newPage();
    attachDiagnostics(roomPeer, 'room-peer', errors);
    await roomPeer.goto(multiscaleUrl, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
    await waitForMultiscaleApi(roomPeer, 'room peer');
    await startPeerNetwork(roomPeer);
    const roomPeerStatus = await waitForStartedPeer(roomPeer, 'room peer');

    const ulgPage = await context.newPage();
    attachDiagnostics(ulgPage, 'ulg', errors);
    const { handoff, probe: handoffProbe } = await readUlgHandoff(ulgPage);
    assert.equal(handoffProbe.artifactCount, 2);
    assert.equal(handoffProbe.canonicalSuiteHash, EXPECTED_CANONICAL_SUITE_HASH);
    assert.equal(handoffProbe.sourceSha256, EXPECTED_ESHKOL_SOURCE_HASH);
    assert.equal(handoffProbe.wasmSha256, EXPECTED_ESHKOL_WASM_HASH);

    const popup = await openPopupFromUlg(ulgPage, multiscaleUrl);
    attachDiagnostics(popup, 'handoff-popup', errors);
    await popup.waitForLoadState('domcontentloaded');
    await waitForMultiscaleApi(popup, 'handoff popup');
    await startPeerNetwork(popup);
    const popupStatus = await waitForStartedPeer(popup, 'handoff popup');
    const roomPeerConnected = await waitForPeerVisible(roomPeer, popupStatus.peerId, 'room peer');
    const popupConnected = await waitForPeerVisible(popup, roomPeerStatus.peerId, 'handoff popup');

    const targetOrigin = new URL(multiscaleUrl).origin;
    const handoffId = `ulg-relay-smoke-${Date.now().toString(36)}`;
    let handoffPostMode = 'ulg-post-message';
    let ack;
    try {
      ack = await postHandoffFromUlg(ulgPage, handoff, targetOrigin, handoffId);
    } catch (error) {
      handoffPostMode = 'direct-receiver-fallback';
      console.warn(
        '[ulg-relay-handoff] ULG popup postMessage unavailable; using direct Multiscale receiver fallback:',
        error?.message || String(error)
      );
      ack = await receiveHandoffDirectly(popup, handoff, handoffId);
    }
    assert.equal(ack.schema, 'peercompute.multiscale.browser-handoff-ack.v0');
    assert.equal(ack.status, 'handoff-ready');
    assert.equal(ack.blockerCount, 0);
    assert.equal(ack.simulationStatus, 'scientific-ready');

    await popup.waitForFunction((id) => {
      const state = window.__multiscaleDemo.getUlgBrowserHandoffImportState?.();
      return state?.handoffId === id && state?.ack?.status === 'handoff-ready';
    }, handoffId, { timeout: timeoutMs });

    const servicePlanProbe = await popup.evaluate((payload) => {
      const envelope = window.__multiscaleDemo.createUlgHandoffServiceEnvelope(payload);
      const dispatchPlan = window.__multiscaleDemo.createUlgHandoffServiceDispatchPlan(envelope);
      const readiness = window.__multiscaleDemo.getScenarioHandoffReadiness();
      const state = window.__multiscaleDemo.getState();
      const scientificOverclaims = [];
      for (const artifact of envelope.handoff?.artifacts || []) {
        const summary = artifact.artifactSummary || {};
        for (const key of [
          'moonlabWebGpuParityScopeFullFidelityMagnetarSimulation',
          'moonlabWebGpuParityScopeFullPhysicsValidation',
          'eshkolProductionHandlerBoundaryFullFidelityMagnetarSimulation',
          'eshkolProductionHandlerBoundaryFullPhysicsValidation',
          'eshkolProductionHandlerBoundaryRuntimeExecution',
          'eshkolProductionHandlerBoundaryScientificValidation'
        ]) {
          if (summary[key] === true) {
            scientificOverclaims.push(`${artifact.sourceService || artifact.artifactKind || 'artifact'}.${key}`);
          }
        }
      }
      return {
        envelope,
        dispatchPlan,
        readiness,
        nodeKernel: state.nodeKernel,
        bridge: window.__multiscaleDemo.getUlgBrowserHandoffImportState(),
        scientificOverclaims
      };
    }, handoff);

    const dispatchProbe = runDispatchAdapters
      ? await popup.evaluate((payload) => (
        window.__multiscaleDemo.runUlgDispatchServiceAdapterProbe(payload, {
          scenarioId: 'magnetar'
        })
      ), handoff)
      : null;

    const scientificScopeFlags = dispatchProbe
      ? dispatchProbe.serviceResultSummaries
        .flatMap((summary) => ([
          summary.moonlabWebGpuParityScopeFullFidelityMagnetarSimulation,
          summary.moonlabWebGpuParityScopeFullPhysicsValidation,
          summary.eshkolProductionHandlerBoundaryFullFidelityMagnetarSimulation,
          summary.eshkolProductionHandlerBoundaryFullPhysicsValidation,
          summary.eshkolProductionHandlerBoundaryRuntimeExecution,
          summary.eshkolProductionHandlerBoundaryScientificValidation
        ]))
        .filter((value) => value != null)
      : [];

    assert.equal(servicePlanProbe.envelope.schema, 'peercompute.ulg.handoff-service-envelope.v0');
    assert.equal(servicePlanProbe.envelope.ready, true);
    assert.equal(servicePlanProbe.envelope.provenance?.relaySafe, true);
    assert.equal(servicePlanProbe.envelope.relaySafeArtifactCount, 2);
    assert.equal(servicePlanProbe.dispatchPlan.schema, 'peercompute.ulg.handoff-service-dispatch-plan.v0');
    assert.equal(servicePlanProbe.dispatchPlan.status, 'dispatch-ready');
    assert.equal(servicePlanProbe.dispatchPlan.readyDispatchCount, 2);
    if (dispatchProbe) {
      assert.equal(dispatchProbe.status, 'dispatch-adapters-ready');
      assert.equal(dispatchProbe.acceptedDispatchCount, 2);
    }
    assert.equal(servicePlanProbe.readiness.status, 'handoff-ready');
    assert.equal(servicePlanProbe.readiness.blockerCount, 0);
    assert.equal(servicePlanProbe.nodeKernel.roomId, roomId);
    assert.equal(servicePlanProbe.nodeKernel.bootstrapPeerCount > 0, true);
    assert.equal(servicePlanProbe.nodeKernel.connectedPeerIds.includes(roomPeerStatus.peerId), true);
    assert.deepEqual(servicePlanProbe.scientificOverclaims, []);
    scientificScopeFlags.forEach((value) => assert.equal(value, false));

    if (errors.length) {
      throw new Error(`Browser diagnostics captured errors:\n${errors.join('\n')}`);
    }

    console.log(JSON.stringify({
      schema: 'peercompute.multiscale.ulg-relay-handoff-smoke.v0',
      ulgUrl,
      multiscaleUrl,
      roomId,
      relayConfig,
      handoff: handoffProbe,
      ack,
      handoffPostMode,
      roomPeer: {
        peerId: roomPeerStatus.peerId,
        connectedPeerIds: roomPeerConnected.connectedPeerIds
      },
      handoffPeer: {
        peerId: popupStatus.peerId,
        connectedPeerIds: popupConnected.connectedPeerIds
      },
      service: {
        envelopeStatus: servicePlanProbe.envelope.status,
        relaySafeArtifactCount: servicePlanProbe.envelope.relaySafeArtifactCount,
        dispatchPlanStatus: servicePlanProbe.dispatchPlan.status,
        dispatchAdapterStatus: dispatchProbe?.status || 'skipped',
        acceptedDispatchCount: dispatchProbe?.acceptedDispatchCount ?? null,
        dispatchAdapterProbeEnabled: runDispatchAdapters,
        scientificScopeFlags
      }
    }, null, 2));
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
    await stopRelay(relay);
    restoreFiles(relay.relayConfigSnapshots);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
