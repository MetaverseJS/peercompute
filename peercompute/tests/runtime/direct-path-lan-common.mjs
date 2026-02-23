import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(__dirname, '..', '..');

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitFor = async (
  check,
  { timeoutMs = 10000, intervalMs = 200, label = 'condition' } = {}
) => {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const result = await check();
      if (result) return result;
    } catch (_) {
      // Ignore transient polling failures.
    }
    await sleep(intervalMs);
  }
  throw new Error(`Timed out waiting for ${label} after ${timeoutMs}ms`);
};

export const parseBool = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return fallback;
};

export const isPidRunning = (pid) => {
  if (!Number.isFinite(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (_) {
    return false;
  }
};

export const toTailBuffer = (limit = 400) => {
  const lines = [];
  return {
    push(text) {
      const split = String(text).split(/\r?\n/).filter(Boolean);
      for (const line of split) {
        lines.push(line);
      }
      while (lines.length > limit) {
        lines.shift();
      }
    },
    dump() {
      return lines.join('\n');
    }
  };
};

export const killProcessGroup = async (child) => {
  if (!child || child.exitCode !== null) return;
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch (_) {}
  await waitFor(
    () => child.exitCode !== null,
    { timeoutMs: 8000, intervalMs: 100, label: 'process group shutdown' }
  ).catch(() => {});
  if (child.exitCode === null) {
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch (_) {}
  }
};

export const waitForHttp = async (url, timeoutMs = 120000) => {
  await waitFor(async () => {
    try {
      const response = await fetch(url, { method: 'GET' });
      return response.ok;
    } catch (_) {
      return false;
    }
  }, { timeoutMs, intervalMs: 400, label: `HTTP ${url}` });
};

export const readRelayConfig = (rootDir = repoRoot) => {
  const configPath = path.join(rootDir, '.relay-config.json');
  if (!existsSync(configPath)) return { configPath, bootstrapPeers: [] };
  try {
    const parsed = JSON.parse(readFileSync(configPath, 'utf8'));
    const peers = Array.isArray(parsed?.bootstrapPeers)
      ? parsed.bootstrapPeers.filter((value) => typeof value === 'string' && value.length > 0)
      : [];
    return { configPath, bootstrapPeers: peers };
  } catch (_) {
    return { configPath, bootstrapPeers: [] };
  }
};

export const writeRelayConfig = (bootstrapPeers, rootDir = repoRoot) => {
  const sanitized = Array.isArray(bootstrapPeers)
    ? bootstrapPeers.filter((value) => typeof value === 'string' && value.length > 0)
    : [];
  const payload = `${JSON.stringify({ bootstrapPeers: sanitized })}\n`;
  const configPath = path.join(rootDir, '.relay-config.json');
  writeFileSync(configPath, payload, 'utf8');
  const publicDir = path.join(rootDir, 'public');
  mkdirSync(publicDir, { recursive: true });
  writeFileSync(path.join(publicDir, 'relay-config.json'), payload, 'utf8');
  return configPath;
};

export const getRelayPid = (rootDir = repoRoot) => {
  const pidPath = path.join(rootDir, '.relay.pid');
  if (!existsSync(pidPath)) return null;
  const relayPid = Number(readFileSync(pidPath, 'utf8').trim());
  return isPidRunning(relayPid) ? relayPid : null;
};

export const startDevEnvironment = async ({
  rootDir = repoRoot,
  testUrl = 'http://127.0.0.1:5173/test-p2p.html',
  startupTimeoutMs = 120000,
  envOverrides = {},
  verbose = false,
  waitForRelayConfig = false
} = {}) => {
  const stdoutTail = toTailBuffer(500);
  const stderrTail = toTailBuffer(500);
  const child = spawn('bash', ['-lc', './start-dev.sh'], {
    cwd: rootDir,
    env: { ...process.env, ...envOverrides },
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  child.stdout.on('data', (chunk) => {
    stdoutTail.push(chunk);
    if (verbose) process.stdout.write(`[dev] ${String(chunk)}`);
  });
  child.stderr.on('data', (chunk) => {
    stderrTail.push(chunk);
    if (verbose) process.stderr.write(`[dev:err] ${String(chunk)}`);
  });

  await waitForHttp(testUrl, startupTimeoutMs);
  if (waitForRelayConfig) {
    await waitFor(() => readRelayConfig(rootDir).bootstrapPeers.length > 0, {
      timeoutMs: startupTimeoutMs,
      intervalMs: 300,
      label: '.relay-config.json bootstrapPeers'
    });
  }

  return {
    child,
    stdoutTail,
    stderrTail,
    relayPid: getRelayPid(rootDir),
    relayConfig: readRelayConfig(rootDir)
  };
};

export const installRtcDiagnostics = async (context) => {
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

export const attachPageLogs = (page, label, verbose = false) => {
  if (!verbose) return;
  page.on('console', (msg) => {
    process.stdout.write(`[${label}] ${msg.type()}: ${msg.text()}\n`);
  });
  page.on('pageerror', (err) => {
    process.stderr.write(`[${label}] pageerror: ${err?.message || String(err)}\n`);
  });
};

export const waitForNodeStart = async (page, testUrl) => {
  await page.goto(testUrl, { waitUntil: 'networkidle' });
  await page.click('#initBtn');
  await page.waitForFunction(() => window.node?.getStatus?.()?.isInitialized === true, null, { timeout: 20000 });
  await page.click('#startBtn');
  await page.waitForFunction(() => window.node?.getStatus?.()?.isStarted === true, null, { timeout: 25000 });
};

export const getPeerId = async (page) => (
  page.evaluate(() => window.node?.getStatus?.()?.network?.peerId || null)
);

export const getOpenConnections = async (page) => (
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

export const getRtcStats = async (page) => (
  page.evaluate(async () => {
    if (!window.__pcDiagnostics?.collect) return [];
    return window.__pcDiagnostics.collect();
  })
);

export const waitForRtcConnected = async (page, label, timeoutMs = 20000) => {
  await waitFor(async () => {
    const stats = await getRtcStats(page);
    return stats.some((entry) => entry?.connectionState === 'connected' || entry?.iceConnectionState === 'connected');
  }, { timeoutMs, intervalMs: 300, label });
};

export const getBootstrapRelayPeerId = async (page) => (
  page.evaluate(() => {
    const peers = window.node?.config?.bootstrapPeers || [];
    if (!Array.isArray(peers) || peers.length === 0) return null;
    const first = String(peers[0] || '');
    const parts = first.split('/p2p/');
    return parts.length > 1 ? parts[parts.length - 1] : null;
  })
);

export const writePayload = async (page, key, size) => {
  await page.evaluate(({ keyToWrite, bytes }) => {
    const value = 'x'.repeat(bytes);
    window.node?.getStateManager?.().write(keyToWrite, value);
  }, { keyToWrite: key, bytes: size });
};

export const readPayloadLength = async (page, key) => (
  page.evaluate((keyToRead) => {
    const value = window.node?.getStateManager?.().read(keyToRead);
    return typeof value === 'string' ? value.length : -1;
  }, key)
);

export const summarizeConnections = (connections, relayPeerId) => {
  const out = { totalOpen: 0, relayOpen: 0, peerOpen: 0, nonRelayAddrOpen: 0 };
  connections.forEach((conn) => {
    if (!conn?.open) return;
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

export const hasRtcRelayCandidate = (rtcStats = []) => (
  rtcStats.some((entry) => (
    entry?.localCandidate?.type === 'relay' || entry?.remoteCandidate?.type === 'relay'
  ))
);
