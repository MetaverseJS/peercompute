import { test, expect } from '@playwright/test';

const NODE_COUNT = Number(process.env.P2P_SCALE_NODE_COUNT || 15);
const START_DELAY_MS = Number(process.env.P2P_SCALE_START_DELAY_MS || 3000);
const SETTLE_MS = Number(process.env.P2P_SCALE_SETTLE_MS || 20000);
const PEER_TIMEOUT_MS = Number(process.env.P2P_SCALE_PEER_TIMEOUT_MS || 15000);
const MIN_PEERS = Number(process.env.P2P_SCALE_MIN_PEERS || 2);
const INIT_TIMEOUT_MS = Number(process.env.P2P_SCALE_INIT_TIMEOUT_MS || 45000);
const START_TIMEOUT_MS = Number(process.env.P2P_SCALE_START_TIMEOUT_MS || 30000);
const LOG_PAGES = Number(process.env.P2P_SCALE_LOG_PAGES || 3);
const MAX_PARALLEL_DIALS = Number(process.env.P2P_SCALE_MAX_PARALLEL_DIALS || 8);
const MAX_DIAL_PEERS = Number(process.env.P2P_SCALE_MAX_DIAL_PEERS || 8);
const TARGET_CONNECTIONS = Number(process.env.P2P_SCALE_TARGET_CONNECTIONS);
const MAX_CONNECTIONS = Number(process.env.P2P_SCALE_MAX_CONNECTIONS);

const readBoolEnv = (value) => {
  if (!value) return false;
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
};

const DISABLE_PERSISTENCE = readBoolEnv(process.env.P2P_SCALE_DISABLE_PERSISTENCE);
const DISABLE_STATE_SYNC = readBoolEnv(process.env.P2P_SCALE_DISABLE_STATE_SYNC);

const attachErrorLogging = (page, label) => {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`[p2p-relay-scale:${label}] console error`, msg.text());
    }
  });
  page.on('pageerror', (err) => {
    console.log(`[p2p-relay-scale:${label}] pageerror`, err?.message || String(err));
  });
};

const waitForNodeStart = async (page) => {
  await page.click('button:has-text("Initialize")');
  await page.waitForFunction(
    () => window.node?.getStatus?.().isInitialized === true,
    null,
    { timeout: INIT_TIMEOUT_MS }
  );
  await page.click('button:has-text("Start")');
  await page.waitForFunction(
    () => window.node?.getStatus?.().isStarted === true,
    null,
    { timeout: START_TIMEOUT_MS }
  );
};

const getNetworkStats = (page) => (
  page.evaluate(() => window.node?.getStatus?.().network || null)
);

const collectDiagnostics = async (pages) => (
  Promise.all(pages.map((page) => getNetworkStats(page).catch(() => null)))
);

const assertMinPeers = async (page, minPeers, label) => {
  try {
    await expect.poll(async () => {
      const stats = await getNetworkStats(page);
      return stats?.peerCount ?? 0;
    }, { timeout: PEER_TIMEOUT_MS }).toBeGreaterThanOrEqual(minPeers);
  } catch (err) {
    const stats = await getNetworkStats(page);
    console.log(`[p2p-relay-scale] ${label} stats`, JSON.stringify(stats));
    throw err;
  }
};

test.describe('PeerCompute relay scale', () => {
  test('distributed nodes keep connecting as peers join', async ({ page, context }) => {
    test.setTimeout(300000);

    const pages = [];
    const labels = [];
    const params = new URLSearchParams();
    if (Number.isFinite(MAX_PARALLEL_DIALS)) {
      params.set('maxParallelDials', String(MAX_PARALLEL_DIALS));
    }
    if (Number.isFinite(MAX_DIAL_PEERS)) {
      params.set('maxDialPeers', String(MAX_DIAL_PEERS));
    }
    const targetPath = params.toString()
      ? `/test-p2p.html?${params.toString()}`
      : '/test-p2p.html';
    console.log('[p2p-relay-scale] dial limits', JSON.stringify({
      maxParallelDials: Number.isFinite(MAX_PARALLEL_DIALS) ? MAX_PARALLEL_DIALS : null,
      maxDialPeers: Number.isFinite(MAX_DIAL_PEERS) ? MAX_DIAL_PEERS : null
    }));
    if (DISABLE_PERSISTENCE || DISABLE_STATE_SYNC || Number.isFinite(TARGET_CONNECTIONS) || Number.isFinite(MAX_CONNECTIONS)) {
      console.log('[p2p-relay-scale] node config', JSON.stringify({
        disablePersistence: DISABLE_PERSISTENCE || null,
        disableStateSync: DISABLE_STATE_SYNC || null,
        targetConnections: Number.isFinite(TARGET_CONNECTIONS) ? TARGET_CONNECTIONS : null,
        maxConnections: Number.isFinite(MAX_CONNECTIONS) ? MAX_CONNECTIONS : null
      }));
    }

    try {
      for (let i = 0; i < NODE_COUNT; i += 1) {
        const nodePage = i === 0 ? page : await context.newPage();
        pages.push(nodePage);
        const label = `node-${i + 1}`;
        labels.push(label);

        attachErrorLogging(nodePage, label);
        if (i < LOG_PAGES) {
          nodePage.on('console', (msg) => console.log(`[p2p-relay-scale:${label}]`, msg.text()));
        }

        const paramsForNode = new URLSearchParams(params);
        if (DISABLE_PERSISTENCE) paramsForNode.set('disablePersistence', '1');
        if (DISABLE_STATE_SYNC) {
          paramsForNode.set('disableStateNetworkProvider', '1');
          paramsForNode.set('disableStateBroadcast', '1');
        }
        if (Number.isFinite(TARGET_CONNECTIONS)) {
          paramsForNode.set('targetConnections', String(TARGET_CONNECTIONS));
        }
        if (Number.isFinite(MAX_CONNECTIONS)) {
          paramsForNode.set('maxConnections', String(MAX_CONNECTIONS));
        }
        const nodePath = paramsForNode.toString()
          ? `/test-p2p.html?${paramsForNode.toString()}`
          : '/test-p2p.html';

        await nodePage.goto(nodePath);
        await nodePage.waitForLoadState('networkidle');
        await waitForNodeStart(nodePage);
        console.log(`[p2p-relay-scale] started ${label}`);

        if (i < NODE_COUNT - 1) {
          await page.waitForTimeout(START_DELAY_MS);
        }
      }

      await page.waitForTimeout(SETTLE_MS);

      const diagnostics = await collectDiagnostics(pages);
      diagnostics.forEach((stats, index) => {
        console.log(`[p2p-relay-scale] ${labels[index] || `node-${index + 1}`} stats`, JSON.stringify(stats));
      });

      for (let i = 0; i < pages.length; i += 1) {
        await assertMinPeers(pages[i], MIN_PEERS, `${labels[i]} final`);
      }
    } catch (err) {
      const diagnostics = await collectDiagnostics(pages);
      diagnostics.forEach((stats, index) => {
        console.log(`[p2p-relay-scale] ${labels[index] || `node-${index + 1}`} stats`, JSON.stringify(stats));
      });
      throw err;
    } finally {
      await Promise.all(pages.map((nodePage) => nodePage.close().catch(() => {})));
    }
  });
});
