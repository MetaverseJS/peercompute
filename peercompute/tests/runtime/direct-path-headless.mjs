import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const testUrl = process.env.P2P_DIRECT_TEST_URL || 'http://127.0.0.1:5173/test-p2p.html';
const payloadBytes = Number(process.env.P2P_DIRECT_TEST_PAYLOAD_BYTES || 256 * 1024);
const startupTimeoutMs = Number(process.env.P2P_DIRECT_TEST_STARTUP_TIMEOUT_MS || 120000);
const syncTimeoutMs = Number(process.env.P2P_DIRECT_TEST_SYNC_TIMEOUT_MS || 45000);
const verbose = String(process.env.P2P_DIRECT_TEST_VERBOSE || '').toLowerCase() === '1'
  || String(process.env.P2P_DIRECT_TEST_VERBOSE || '').toLowerCase() === 'true';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toTailBuffer = (limit = 300) => {
  const lines = [];
  return {
    push(line) {
      lines.push(line);
      if (lines.length > limit) lines.shift();
    },
    dump() {
      return lines.join('\n');
    }
  };
};

const devStdoutTail = toTailBuffer(400);
const devStderrTail = toTailBuffer(400);
let stoppingDevEnvironment = false;

const waitFor = async (check, { timeoutMs = 10000, intervalMs = 200, label = 'condition' } = {}) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      if (await check()) return;
    } catch (_) {
      // Ignore transient errors while polling.
    }
    await sleep(intervalMs);
  }
  throw new Error(`Timed out waiting for ${label} after ${timeoutMs}ms`);
};

const isPidRunning = (pid) => {
  if (!Number.isFinite(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (_) {
    return false;
  }
};

const killProcessGroup = async (child) => {
  if (!child || child.exitCode !== null) return;
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch (_) {}
  const started = Date.now();
  while (Date.now() - started < 8000) {
    if (child.exitCode !== null) return;
    await sleep(100);
  }
  try {
    process.kill(-child.pid, 'SIGKILL');
  } catch (_) {}
};

const waitForHttp = async (url, timeoutMs) => {
  await waitFor(async () => {
    try {
      const res = await fetch(url, { method: 'GET' });
      return res.ok;
    } catch (_) {
      return false;
    }
  }, { timeoutMs, intervalMs: 400, label: `HTTP ${url}` });
};

const startDevEnvironment = async () => {
  const env = {
    ...process.env,
    HTTPS: '0',
    DEV_HOST: '127.0.0.1',
    RELAY_PUBLIC_HOST: '127.0.0.1',
    RELAY_LISTEN_HOST: '127.0.0.1',
    RELAY_PUBLIC_PROTOCOL: 'ws'
  };
  const child = spawn(
    'bash',
    ['-lc', './start-dev.sh'],
    {
      cwd: repoRoot,
      env,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe']
    }
  );
  child.stdout.on('data', (chunk) => {
    const text = String(chunk);
    text.split(/\r?\n/).filter(Boolean).forEach((line) => devStdoutTail.push(line));
    if (verbose) process.stdout.write(`[dev] ${text}`);
  });
  child.stderr.on('data', (chunk) => {
    const text = String(chunk);
    text.split(/\r?\n/).filter(Boolean).forEach((line) => devStderrTail.push(line));
    if (verbose) process.stderr.write(`[dev:err] ${text}`);
  });
  child.on('exit', (code, signal) => {
    const expectedShutdown = stoppingDevEnvironment && (code === 143 || signal === 'SIGTERM');
    if (!expectedShutdown && code !== 0 && code !== null) {
      console.error(`[direct-path] start-dev exited unexpectedly code=${code} signal=${signal ?? 'none'}`);
    }
  });

  await waitForHttp(testUrl, startupTimeoutMs);

  const relayPidFile = path.join(repoRoot, '.relay.pid');
  await waitFor(() => {
    if (!existsSync(relayPidFile)) return false;
    const relayPid = Number(readFileSync(relayPidFile, 'utf8').trim());
    return Number.isFinite(relayPid) && relayPid > 0 && isPidRunning(relayPid);
  }, {
    timeoutMs: startupTimeoutMs,
    intervalMs: 300,
    label: '.relay.pid'
  });

  const relayPid = Number(readFileSync(relayPidFile, 'utf8').trim());
  return { child, relayPid };
};

const attachPageLogs = (page, label) => {
  if (!verbose) return;
  page.on('console', (msg) => {
    process.stdout.write(`[${label}] ${msg.type()}: ${msg.text()}\n`);
  });
  page.on('pageerror', (err) => {
    process.stderr.write(`[${label}] pageerror: ${err?.message || String(err)}\n`);
  });
};

const installRtcDiagnostics = async (context) => {
  await context.addInitScript(() => {
    const NativePc = window.RTCPeerConnection;
    if (!NativePc || window.__pcDiagnostics) return;

    const peers = [];
    const toPlain = (candidate) => {
      if (!candidate) return null;
      return {
        id: candidate.id || null,
        type: candidate.candidateType || null,
        protocol: candidate.protocol || null,
        address: candidate.address || null,
        port: candidate.port || null
      };
    };

    class TrackedPc extends NativePc {
      constructor(...args) {
        super(...args);
        this.__pcDiagId = peers.length + 1;
        peers.push(this);
      }
    }

    window.RTCPeerConnection = TrackedPc;
    window.__pcDiagnostics = {
      async collect() {
        const summaries = [];
        for (const pc of peers) {
          let selectedPair = null;
          let local = null;
          let remote = null;
          try {
            const stats = await pc.getStats();
            for (const report of stats.values()) {
              if (report.type === 'transport' && report.selectedCandidatePairId) {
                selectedPair = stats.get(report.selectedCandidatePairId) || null;
                break;
              }
            }
            if (!selectedPair) {
              for (const report of stats.values()) {
                if (report.type === 'candidate-pair' && report.nominated && report.state === 'succeeded') {
                  selectedPair = report;
                  break;
                }
              }
            }
            if (selectedPair) {
              local = stats.get(selectedPair.localCandidateId) || null;
              remote = stats.get(selectedPair.remoteCandidateId) || null;
            }
          } catch (_) {
            // Ignore stats errors for closed/transient peer connections.
          }
          summaries.push({
            id: pc.__pcDiagId || null,
            connectionState: pc.connectionState,
            iceConnectionState: pc.iceConnectionState,
            selectedPairState: selectedPair?.state || null,
            localCandidate: toPlain(local),
            remoteCandidate: toPlain(remote),
            bytesSent: Number.isFinite(selectedPair?.bytesSent) ? selectedPair.bytesSent : null,
            bytesReceived: Number.isFinite(selectedPair?.bytesReceived) ? selectedPair.bytesReceived : null
          });
        }
        return summaries;
      }
    };
  });
};

const waitForNodeStart = async (page) => {
  await page.goto(testUrl, { waitUntil: 'networkidle' });
  await page.click('#initBtn');
  await page.waitForFunction(() => window.node?.getStatus?.()?.isInitialized === true, null, { timeout: 20000 });
  await page.click('#startBtn');
  await page.waitForFunction(() => window.node?.getStatus?.()?.isStarted === true, null, { timeout: 25000 });
};

const getPeerId = async (page) => (
  page.evaluate(() => window.node?.getStatus?.()?.network?.peerId || null)
);

const getOpenConnections = async (page) => (
  page.evaluate(() => {
    const nm = window.node?.getNetworkManager?.();
    const libp2p = nm?.getLibp2pNode?.();
    const raw = libp2p?.getConnections?.() || [];
    const connections = Array.isArray(raw)
      ? raw
      : (typeof raw.values === 'function' ? Array.from(raw.values()).flat() : []);
    const isOpen = (conn) => {
      if (!conn) return false;
      if (typeof conn.status === 'string') return conn.status === 'open';
      const closed = conn?.stat?.timeline?.close || conn?.timeline?.close;
      return !closed;
    };
    return connections.map((conn) => ({
      peerId: conn?.remotePeer?.toString?.() || null,
      remoteAddr: conn?.remoteAddr?.toString?.() || '',
      open: isOpen(conn)
    }));
  })
);

const getRtcStats = async (page) => (
  page.evaluate(async () => {
    if (!window.__pcDiagnostics?.collect) return [];
    return window.__pcDiagnostics.collect();
  })
);

const getBootstrapRelayPeerId = async (page) => (
  page.evaluate(() => {
    const peers = window.node?.config?.bootstrapPeers || [];
    if (!Array.isArray(peers) || peers.length === 0) return null;
    const first = String(peers[0] || '');
    const parts = first.split('/p2p/');
    return parts.length > 1 ? parts[parts.length - 1] : null;
  })
);

const writePayload = async (page, key, size) => {
  await page.evaluate(({ keyToWrite, bytes }) => {
    const value = 'x'.repeat(bytes);
    window.node?.getStateManager?.().write(keyToWrite, value);
  }, { keyToWrite: key, bytes: size });
};

const readPayloadLength = async (page, key) => (
  page.evaluate((keyToRead) => {
    const value = window.node?.getStateManager?.().read(keyToRead);
    return typeof value === 'string' ? value.length : -1;
  }, key)
);

const requireMutualPeerConnection = async (page1, page2, peerId1, peerId2, timeoutMs, label) => {
  await waitFor(async () => {
    const [c1, c2] = await Promise.all([getOpenConnections(page1), getOpenConnections(page2)]);
    const p1ToP2 = c1.some((conn) => conn.open && conn.peerId === peerId2);
    const p2ToP1 = c2.some((conn) => conn.open && conn.peerId === peerId1);
    return p1ToP2 && p2ToP1;
  }, { timeoutMs, intervalMs: 400, label });
};

const waitForRtcConnected = async (page, label) => {
  await waitFor(async () => {
    const stats = await getRtcStats(page);
    return stats.some((entry) => entry?.connectionState === 'connected' || entry?.iceConnectionState === 'connected');
  }, {
    timeoutMs: 20000,
    intervalMs: 300,
    label
  });
};

const killRelay = async (relayPid) => {
  if (!isPidRunning(relayPid)) return;
  process.kill(relayPid, 'SIGTERM');
  await waitFor(() => !isPidRunning(relayPid), {
    timeoutMs: 15000,
    intervalMs: 200,
    label: `relay pid ${relayPid} shutdown`
  });
};

const summarizeConnections = (connections, relayPeerId) => {
  const out = { totalOpen: 0, relayOpen: 0, peerOpen: 0, nonRelayAddrOpen: 0 };
  connections.forEach((conn) => {
    if (!conn.open) return;
    out.totalOpen += 1;
    if (relayPeerId && conn.peerId === relayPeerId) {
      out.relayOpen += 1;
    } else {
      out.peerOpen += 1;
    }
    if (typeof conn.remoteAddr === 'string' && !conn.remoteAddr.includes('/p2p-circuit')) {
      out.nonRelayAddrOpen += 1;
    }
  });
  return out;
};

let devEnvironment = null;
let browser = null;

try {
  console.log('[direct-path] Starting local dev environment');
  devEnvironment = await startDevEnvironment();
  console.log(`[direct-path] Dev server ready, relay pid=${devEnvironment.relayPid}`);

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await installRtcDiagnostics(context);

  const page1 = await context.newPage();
  const page2 = await context.newPage();
  attachPageLogs(page1, 'peer-1');
  attachPageLogs(page2, 'peer-2');

  await waitForNodeStart(page1);
  await waitForNodeStart(page2);

  const [peerId1, peerId2] = await Promise.all([getPeerId(page1), getPeerId(page2)]);
  assert.ok(peerId1 && peerId2, 'Expected both peers to have IDs');
  assert.notEqual(peerId1, peerId2, 'Expected distinct peer IDs');

  await requireMutualPeerConnection(
    page1,
    page2,
    peerId1,
    peerId2,
    45000,
    'mutual peer connection before relay kill'
  );
  await Promise.all([
    waitForRtcConnected(page1, 'peer-1 rtc connected before relay kill'),
    waitForRtcConnected(page2, 'peer-2 rtc connected before relay kill')
  ]);

  const relayPeerId = await getBootstrapRelayPeerId(page1);
  const [preConnections1, preConnections2, preRtc1, preRtc2] = await Promise.all([
    getOpenConnections(page1),
    getOpenConnections(page2),
    getRtcStats(page1),
    getRtcStats(page2)
  ]);
  const preSummary1 = summarizeConnections(preConnections1, relayPeerId);
  const preSummary2 = summarizeConnections(preConnections2, relayPeerId);

  console.log('[direct-path] Pre-kill summary', JSON.stringify({
    peer1: preSummary1,
    peer2: preSummary2,
    relayPeerId,
    preRtcCounts: { peer1: preRtc1.length, peer2: preRtc2.length }
  }));

  await killRelay(devEnvironment.relayPid);
  console.log('[direct-path] Relay stopped, verifying peer traffic survives');

  await requireMutualPeerConnection(
    page1,
    page2,
    peerId1,
    peerId2,
    20000,
    'mutual peer connection after relay kill'
  );

  const testKey = `direct-path-${Date.now()}`;
  const syncStart = Date.now();
  await writePayload(page1, testKey, payloadBytes);
  await waitFor(async () => {
    const length = await readPayloadLength(page2, testKey);
    return length === payloadBytes;
  }, {
    timeoutMs: syncTimeoutMs,
    intervalMs: 300,
    label: 'payload sync after relay kill'
  });
  const syncMs = Date.now() - syncStart;

  const [postConnections1, postConnections2, postRtc1, postRtc2] = await Promise.all([
    getOpenConnections(page1),
    getOpenConnections(page2),
    getRtcStats(page1),
    getRtcStats(page2)
  ]);
  const postSummary1 = summarizeConnections(postConnections1, relayPeerId);
  const postSummary2 = summarizeConnections(postConnections2, relayPeerId);

  const hasRelayCandidate = [...postRtc1, ...postRtc2].some((entry) => (
    entry?.localCandidate?.type === 'relay' || entry?.remoteCandidate?.type === 'relay'
  ));

  const result = {
    payloadBytes,
    syncMs,
    relayPeerId,
    pre: {
      peer1: preSummary1,
      peer2: preSummary2,
      rtc: { peer1: preRtc1, peer2: preRtc2 }
    },
    post: {
      peer1: postSummary1,
      peer2: postSummary2,
      rtc: { peer1: postRtc1, peer2: postRtc2 }
    },
    hasRelayCandidate
  };

  console.log('[direct-path] PASS relay-independent payload sync confirmed');
  console.log('[direct-path] Result', JSON.stringify(result, null, 2));
} catch (err) {
  console.error('[direct-path] FAIL', err?.message || err);
  if (devStdoutTail.dump()) {
    console.error('[direct-path] start-dev stdout tail:\n' + devStdoutTail.dump());
  }
  if (devStderrTail.dump()) {
    console.error('[direct-path] start-dev stderr tail:\n' + devStderrTail.dump());
  }
  process.exitCode = 1;
} finally {
  if (browser) {
    await browser.close().catch(() => {});
  }
  if (devEnvironment?.child) {
    stoppingDevEnvironment = true;
    await killProcessGroup(devEnvironment.child);
  }
}
