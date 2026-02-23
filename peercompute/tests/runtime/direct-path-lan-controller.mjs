import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import {
  attachPageLogs,
  getBootstrapRelayPeerId,
  getOpenConnections,
  getPeerId,
  getRtcStats,
  hasRtcRelayCandidate,
  installRtcDiagnostics,
  killProcessGroup,
  parseBool,
  readPayloadLength,
  repoRoot,
  startDevEnvironment,
  summarizeConnections,
  waitFor,
  waitForHttp,
  waitForNodeStart,
  waitForRtcConnected,
  writePayload,
  writeRelayConfig
} from './direct-path-lan-common.mjs';

const agentUrl = (process.env.P2P_LAN_AGENT_URL || '').trim().replace(/\/+$/, '');
const testUrl = process.env.P2P_LAN_CONTROLLER_TEST_URL || 'http://127.0.0.1:5173/test-p2p.html';
const payloadBytes = Number(process.env.P2P_LAN_CONTROLLER_PAYLOAD_BYTES || 256 * 1024);
const startupTimeoutMs = Number(process.env.P2P_LAN_CONTROLLER_STARTUP_TIMEOUT_MS || 120000);
const syncTimeoutMs = Number(process.env.P2P_LAN_CONTROLLER_SYNC_TIMEOUT_MS || 45000);
const verbose = parseBool(process.env.P2P_LAN_CONTROLLER_VERBOSE, false);
const skipLocalDev = parseBool(process.env.P2P_LAN_CONTROLLER_SKIP_DEV, false);
const shutdownAgentAfter = parseBool(process.env.P2P_LAN_CONTROLLER_SHUTDOWN_AGENT, false);

if (!agentUrl) {
  throw new Error('Missing P2P_LAN_AGENT_URL, e.g. http://192.168.1.50:7778');
}

const agentRequest = async (path, options = {}) => {
  const response = await fetch(`${agentUrl}${path}`, options);
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch (_) {
    payload = { raw: text };
  }
  if (!response.ok) {
    throw new Error(`Agent request failed ${response.status} ${path}: ${payload?.error || text}`);
  }
  return payload;
};

const agentGet = (path) => agentRequest(path);
const agentPost = (path, body = {}) => agentRequest(path, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body)
});

let devEnvironment = null;
let browser = null;
let context = null;
let page = null;

const cleanup = async () => {
  if (browser) {
    await browser.close().catch(() => {});
  }
  if (devEnvironment?.child) {
    await killProcessGroup(devEnvironment.child);
  }
};

try {
  console.log(`[lan-controller] Waiting for agent at ${agentUrl}`);
  await waitFor(async () => {
    const health = await agentGet('/health');
    return health?.ok === true;
  }, { timeoutMs: startupTimeoutMs, intervalMs: 400, label: 'agent /health' });

  const relayConfig = await waitFor(async () => {
    const config = await agentGet('/relay-config');
    if (Array.isArray(config.bootstrapPeers) && config.bootstrapPeers.length > 0) return config;
    return null;
  }, { timeoutMs: startupTimeoutMs, intervalMs: 400, label: 'agent relay-config' });

  console.log(`[lan-controller] Using relay ${relayConfig.bootstrapPeers[0]}`);

  if (!skipLocalDev) {
    writeRelayConfig(relayConfig.bootstrapPeers, repoRoot);
    devEnvironment = await startDevEnvironment({
      rootDir: repoRoot,
      testUrl,
      startupTimeoutMs,
      envOverrides: {
        HTTPS: '0',
        SKIP_RELAY: '1',
        DEV_HOST: process.env.P2P_LAN_CONTROLLER_DEV_HOST || '127.0.0.1'
      },
      verbose,
      waitForRelayConfig: false
    });
  } else {
    await waitForHttp(testUrl, startupTimeoutMs);
  }

  browser = await chromium.launch({ headless: true });
  context = await browser.newContext();
  await installRtcDiagnostics(context);
  page = await context.newPage();
  attachPageLogs(page, 'lan-controller', verbose);

  await waitForNodeStart(page, testUrl);
  await agentPost('/init-start');

  const [localPeerId, agentPeer] = await Promise.all([
    getPeerId(page),
    agentGet('/peer-id')
  ]);
  const remotePeerId = agentPeer.peerId;

  assert.ok(localPeerId, 'Expected local peer ID');
  assert.ok(remotePeerId, 'Expected remote peer ID from agent');
  assert.notEqual(localPeerId, remotePeerId, 'Expected distinct peer IDs');

  await waitFor(async () => {
    const [localConnections, remoteConnectionsResp] = await Promise.all([
      getOpenConnections(page),
      agentGet('/connections')
    ]);
    const remoteConnections = remoteConnectionsResp.connections || [];
    const localToRemote = localConnections.some((conn) => conn.open && conn.peerId === remotePeerId);
    const remoteToLocal = remoteConnections.some((conn) => conn.open && conn.peerId === localPeerId);
    return localToRemote && remoteToLocal;
  }, { timeoutMs: 45000, intervalMs: 400, label: 'mutual peer connection before relay stop' });

  await Promise.all([
    waitForRtcConnected(page, 'local rtc connected before relay stop', 25000),
    waitFor(async () => {
      const stats = (await agentGet('/rtc-stats')).stats || [];
      return stats.some((entry) => entry?.connectionState === 'connected' || entry?.iceConnectionState === 'connected');
    }, { timeoutMs: 25000, intervalMs: 400, label: 'agent rtc connected before relay stop' })
  ]);

  const [localRelayPeerId, localConnectionsBefore, localRtcBefore, agentConnectionsBeforeResp, agentRtcBeforeResp, healthBefore] =
    await Promise.all([
      getBootstrapRelayPeerId(page),
      getOpenConnections(page),
      getRtcStats(page),
      agentGet('/connections'),
      agentGet('/rtc-stats'),
      agentGet('/health')
    ]);

  const remoteRelayPeerId = healthBefore.relayAddress
    ? String(healthBefore.relayAddress).split('/p2p/').pop()
    : null;
  const localSummaryBefore = summarizeConnections(localConnectionsBefore, localRelayPeerId);
  const remoteSummaryBefore = summarizeConnections(agentConnectionsBeforeResp.connections || [], remoteRelayPeerId);

  console.log('[lan-controller] Pre-kill summary', JSON.stringify({
    local: localSummaryBefore,
    remote: remoteSummaryBefore,
    localRelayPeerId,
    remoteRelayPeerId
  }));

  await agentPost('/stop-relay');
  console.log('[lan-controller] Relay stopped on agent, verifying traffic survivability');

  await waitFor(async () => {
    const [localConnections, remoteConnectionsResp] = await Promise.all([
      getOpenConnections(page),
      agentGet('/connections')
    ]);
    const remoteConnections = remoteConnectionsResp.connections || [];
    const localToRemote = localConnections.some((conn) => conn.open && conn.peerId === remotePeerId);
    const remoteToLocal = remoteConnections.some((conn) => conn.open && conn.peerId === localPeerId);
    return localToRemote && remoteToLocal;
  }, { timeoutMs: 25000, intervalMs: 400, label: 'mutual peer connection after relay stop' });

  const testKey = `lan-direct-${Date.now()}`;
  const syncStart = Date.now();
  await writePayload(page, testKey, payloadBytes);
  await waitFor(async () => {
    const read = await agentGet(`/read?key=${encodeURIComponent(testKey)}`);
    return read.length === payloadBytes;
  }, { timeoutMs: syncTimeoutMs, intervalMs: 300, label: 'payload sync after relay stop' });
  const syncMs = Date.now() - syncStart;

  const [localConnectionsAfter, localRtcAfter, agentConnectionsAfterResp, agentRtcAfterResp] = await Promise.all([
    getOpenConnections(page),
    getRtcStats(page),
    agentGet('/connections'),
    agentGet('/rtc-stats')
  ]);

  const localSummaryAfter = summarizeConnections(localConnectionsAfter, localRelayPeerId);
  const remoteSummaryAfter = summarizeConnections(agentConnectionsAfterResp.connections || [], remoteRelayPeerId);
  const combinedRtcAfter = [...localRtcAfter, ...(agentRtcAfterResp.stats || [])];
  const hasRelayCandidate = hasRtcRelayCandidate(combinedRtcAfter);

  const result = {
    payloadBytes,
    syncMs,
    localPeerId,
    remotePeerId,
    relayAddress: relayConfig.bootstrapPeers[0],
    before: {
      local: localSummaryBefore,
      remote: remoteSummaryBefore,
      rtcLocal: localRtcBefore,
      rtcRemote: agentRtcBeforeResp.stats || []
    },
    after: {
      local: localSummaryAfter,
      remote: remoteSummaryAfter,
      rtcLocal: localRtcAfter,
      rtcRemote: agentRtcAfterResp.stats || []
    },
    hasRelayCandidate
  };

  console.log('[lan-controller] PASS relay-independent payload sync confirmed');
  console.log('[lan-controller] Result', JSON.stringify(result, null, 2));

  const localReadBack = await readPayloadLength(page, testKey);
  assert.equal(localReadBack, payloadBytes, 'Local readback mismatch after sync');
} catch (err) {
  console.error('[lan-controller] FAIL', err?.message || err);
  if (devEnvironment?.stdoutTail?.dump?.()) {
    console.error('[lan-controller] local start-dev stdout tail:\n' + devEnvironment.stdoutTail.dump());
  }
  if (devEnvironment?.stderrTail?.dump?.()) {
    console.error('[lan-controller] local start-dev stderr tail:\n' + devEnvironment.stderrTail.dump());
  }
  process.exitCode = 1;
} finally {
  await cleanup();
  if (shutdownAgentAfter) {
    await agentPost('/shutdown').catch(() => {});
  }
}
