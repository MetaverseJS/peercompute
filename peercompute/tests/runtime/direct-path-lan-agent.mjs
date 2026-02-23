import http from 'node:http';
import { chromium } from 'playwright';
import {
  attachPageLogs,
  getOpenConnections,
  getPeerId,
  getRelayPid,
  getRtcStats,
  installRtcDiagnostics,
  isPidRunning,
  killProcessGroup,
  parseBool,
  readPayloadLength,
  readRelayConfig,
  repoRoot,
  startDevEnvironment,
  waitForHttp,
  waitForNodeStart,
  writePayload
} from './direct-path-lan-common.mjs';

const agentHost = process.env.P2P_LAN_AGENT_HOST || '0.0.0.0';
const agentPort = Number(process.env.P2P_LAN_AGENT_PORT || 7778);
const testUrl = process.env.P2P_LAN_AGENT_TEST_URL || 'http://127.0.0.1:5173/test-p2p.html';
const startupTimeoutMs = Number(process.env.P2P_LAN_AGENT_STARTUP_TIMEOUT_MS || 120000);
const verbose = parseBool(process.env.P2P_LAN_AGENT_VERBOSE, false);
const skipDev = parseBool(process.env.P2P_LAN_AGENT_SKIP_DEV, false);
const autoStart = parseBool(process.env.P2P_LAN_AGENT_AUTO_START, false);
const allowRelayStop = parseBool(process.env.P2P_LAN_AGENT_ALLOW_RELAY_STOP, true);

const relayPublicHost = process.env.P2P_LAN_AGENT_RELAY_PUBLIC_HOST || process.env.RELAY_PUBLIC_HOST || '';
const relayListenHost = process.env.P2P_LAN_AGENT_RELAY_LISTEN_HOST || process.env.RELAY_LISTEN_HOST || '';
const relayPublicProtocol = process.env.P2P_LAN_AGENT_RELAY_PUBLIC_PROTOCOL
  || process.env.RELAY_PUBLIC_PROTOCOL
  || 'ws';
const devHost = process.env.P2P_LAN_AGENT_DEV_HOST || process.env.DEV_HOST || '127.0.0.1';

const json = (res, status, payload) => {
  const body = `${JSON.stringify(payload)}\n`;
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body)
  });
  res.end(body);
};

const parseJsonBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
    if (Buffer.concat(chunks).length > 2 * 1024 * 1024) {
      throw new Error('Request body too large');
    }
  }
  if (chunks.length === 0) return {};
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw.trim()) return {};
  return JSON.parse(raw);
};

let shuttingDown = false;
let server = null;
let devEnvironment = null;
let browser = null;
let context = null;
let page = null;
let nodeStarted = false;
let startLock = null;

const getRelayState = () => {
  const relayConfig = readRelayConfig(repoRoot);
  const relayPid = getRelayPid(repoRoot);
  return {
    relayPid,
    relayBootstrapPeers: relayConfig.bootstrapPeers,
    relayAddress: relayConfig.bootstrapPeers[0] || null
  };
};

const ensureDevEnvironment = async () => {
  if (devEnvironment || skipDev) return;
  const envOverrides = {
    HTTPS: '0',
    DEV_HOST: devHost
  };
  if (relayPublicHost) envOverrides.RELAY_PUBLIC_HOST = relayPublicHost;
  if (relayListenHost) envOverrides.RELAY_LISTEN_HOST = relayListenHost;
  if (relayPublicProtocol) envOverrides.RELAY_PUBLIC_PROTOCOL = relayPublicProtocol;

  devEnvironment = await startDevEnvironment({
    rootDir: repoRoot,
    testUrl,
    startupTimeoutMs,
    envOverrides,
    verbose,
    waitForRelayConfig: true
  });
};

const ensureBrowserContext = async () => {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  if (!context) {
    context = await browser.newContext();
    await installRtcDiagnostics(context);
  }
  if (!page) {
    page = await context.newPage();
    attachPageLogs(page, 'lan-agent', verbose);
  }
};

const ensureNodeStarted = async () => {
  if (nodeStarted && page) return;
  if (!startLock) {
    startLock = (async () => {
      if (skipDev) {
        await waitForHttp(testUrl, startupTimeoutMs);
      } else {
        await ensureDevEnvironment();
      }
      await ensureBrowserContext();
      await waitForNodeStart(page, testUrl);
      nodeStarted = true;
    })();
  }
  try {
    await startLock;
  } finally {
    startLock = null;
  }
};

const stopRelay = async () => {
  const relayPid = getRelayPid(repoRoot);
  if (!relayPid) return { stopped: false, relayPid: null };
  process.kill(relayPid, 'SIGTERM');
  const started = Date.now();
  while (Date.now() - started < 15000) {
    if (!isPidRunning(relayPid)) break;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return { stopped: !isPidRunning(relayPid), relayPid };
};

const getHealth = async () => {
  const relayState = getRelayState();
  const peerId = nodeStarted && page ? await getPeerId(page) : null;
  return {
    ok: true,
    nodeStarted,
    skipDev,
    testUrl,
    peerId,
    relayPid: relayState.relayPid,
    relayAddress: relayState.relayAddress,
    relayBootstrapPeers: relayState.relayBootstrapPeers
  };
};

const cleanup = async () => {
  if (shuttingDown) return;
  shuttingDown = true;
  if (server) {
    await new Promise((resolve) => {
      server.close(() => resolve());
    }).catch(() => {});
  }
  if (browser) {
    await browser.close().catch(() => {});
  }
  if (devEnvironment?.child) {
    await killProcessGroup(devEnvironment.child);
  }
};

const handleRequest = async (req, res) => {
  const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const path = reqUrl.pathname;
  try {
    if (req.method === 'GET' && path === '/health') {
      json(res, 200, await getHealth());
      return;
    }

    if (req.method === 'GET' && path === '/relay-config') {
      const relayState = getRelayState();
      json(res, 200, {
        bootstrapPeers: relayState.relayBootstrapPeers,
        relayAddress: relayState.relayAddress
      });
      return;
    }

    if (req.method === 'POST' && path === '/init-start') {
      await ensureNodeStarted();
      json(res, 200, {
        ok: true,
        peerId: await getPeerId(page)
      });
      return;
    }

    if (req.method === 'GET' && path === '/peer-id') {
      if (!nodeStarted || !page) {
        json(res, 409, { error: 'node not started' });
        return;
      }
      json(res, 200, { peerId: await getPeerId(page) });
      return;
    }

    if (req.method === 'GET' && path === '/connections') {
      if (!nodeStarted || !page) {
        json(res, 409, { error: 'node not started' });
        return;
      }
      json(res, 200, { connections: await getOpenConnections(page) });
      return;
    }

    if (req.method === 'GET' && path === '/rtc-stats') {
      if (!nodeStarted || !page) {
        json(res, 409, { error: 'node not started' });
        return;
      }
      json(res, 200, { stats: await getRtcStats(page) });
      return;
    }

    if (req.method === 'POST' && path === '/write') {
      if (!nodeStarted || !page) {
        json(res, 409, { error: 'node not started' });
        return;
      }
      const body = await parseJsonBody(req);
      const key = typeof body.key === 'string' && body.key.length > 0
        ? body.key
        : `lan-write-${Date.now()}`;
      if (typeof body.value === 'string') {
        await page.evaluate(({ keyToWrite, value }) => {
          window.node?.getStateManager?.().write(keyToWrite, value);
        }, { keyToWrite: key, value: body.value });
        json(res, 200, { ok: true, key, bytes: body.value.length });
        return;
      }
      const size = Number.isFinite(body.size) ? Math.max(1, body.size) : 128 * 1024;
      await writePayload(page, key, size);
      json(res, 200, { ok: true, key, bytes: size });
      return;
    }

    if (req.method === 'GET' && path === '/read') {
      if (!nodeStarted || !page) {
        json(res, 409, { error: 'node not started' });
        return;
      }
      const key = reqUrl.searchParams.get('key') || '';
      if (!key) {
        json(res, 400, { error: 'missing key query param' });
        return;
      }
      const length = await readPayloadLength(page, key);
      json(res, 200, { key, length });
      return;
    }

    if (req.method === 'POST' && path === '/stop-relay') {
      if (!allowRelayStop) {
        json(res, 403, { error: 'relay stopping disabled' });
        return;
      }
      const result = await stopRelay();
      json(res, 200, { ok: true, ...result });
      return;
    }

    if (req.method === 'POST' && path === '/shutdown') {
      json(res, 200, { ok: true });
      setTimeout(() => {
        cleanup().finally(() => process.exit(0));
      }, 50);
      return;
    }

    json(res, 404, { error: 'not found' });
  } catch (err) {
    json(res, 500, { error: err?.message || String(err) });
  }
};

try {
  if (skipDev) {
    await waitForHttp(testUrl, startupTimeoutMs);
  } else {
    await ensureDevEnvironment();
  }
  server = http.createServer((req, res) => {
    handleRequest(req, res).catch((err) => {
      json(res, 500, { error: err?.message || String(err) });
    });
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(agentPort, agentHost, resolve);
  });
  console.log(`[lan-agent] Listening on http://${agentHost}:${agentPort}`);
  console.log(`[lan-agent] Test URL: ${testUrl}`);
  const relayState = getRelayState();
  if (relayState.relayAddress) {
    console.log(`[lan-agent] Relay address: ${relayState.relayAddress}`);
  } else {
    console.log('[lan-agent] Relay address not found yet');
  }
  if (autoStart) {
    await ensureNodeStarted();
    console.log(`[lan-agent] Node started with peerId=${await getPeerId(page)}`);
  }
} catch (err) {
  console.error('[lan-agent] Failed to start:', err?.message || err);
  await cleanup();
  process.exit(1);
}

process.on('SIGINT', () => {
  cleanup().finally(() => process.exit(0));
});
process.on('SIGTERM', () => {
  cleanup().finally(() => process.exit(0));
});
