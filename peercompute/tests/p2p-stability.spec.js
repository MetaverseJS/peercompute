import { test, expect } from '@playwright/test';

const waitForNodeStart = async (page) => {
  await page.click('button:has-text("Initialize")');
  await page.waitForSelector('text=Node initialized', { timeout: 10000 });
  await page.click('button:has-text("Start")');
  await page.waitForFunction(() => window.node?.getStatus()?.isStarted === true, null, { timeout: 15000 });
};

const getConnections = (page) => (
  page.evaluate(() => window.node?.getStatus().network.connections || 0)
);

const getPeerCount = (page) => (
  page.evaluate(() => window.node?.getStatus().network.peerCount || 0)
);

test.describe('PeerCompute P2P stability', () => {
  test('distributed topology stays connected over time', async ({ page, context }) => {
    test.setTimeout(120000);

    const pages = [page, await context.newPage(), await context.newPage()];

    for (const nodePage of pages) {
      nodePage.on('console', (msg) => console.log('[p2p-stability]', msg.text()));
      await nodePage.goto('/test-p2p.html');
      await nodePage.waitForLoadState('networkidle');
    }

    for (const nodePage of pages) {
      await waitForNodeStart(nodePage);
    }

    await page.waitForTimeout(8000);

    for (const nodePage of pages) {
      const connections = await getConnections(nodePage);
      expect(connections).toBeGreaterThan(0);
    }

    for (let tick = 0; tick < 6; tick += 1) {
      await page.waitForTimeout(5000);
      for (const nodePage of pages) {
        const connections = await getConnections(nodePage);
        const peers = await getPeerCount(nodePage);
        expect(connections).toBeGreaterThan(0);
        expect(peers).toBeGreaterThan(0);
      }
    }
  });
});
