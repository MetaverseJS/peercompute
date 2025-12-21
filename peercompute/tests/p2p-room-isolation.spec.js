import { test, expect } from '@playwright/test';

test.describe('libp2p room isolation', () => {
  test('nodes in different rooms should not connect', async ({ page, context }) => {
    // Page A, room alpha
    await page.goto('/test-p2p.html');
    const roomAId = 'alpha-' + Date.now();
    await page.evaluate(async (roomId) => {
      const cfg = await fetch('/relay-config.json').then(r => r.json());
      const nk = new window.NodeKernel({
        bootstrapPeers: cfg.bootstrapPeers,
        roomId,
        gameId: 'room-test',
        enablePersistence: false
      });
      await nk.initialize();
      await nk.start();
      window.__roomNodeA = nk;
    }, roomAId);

    // Page B, room beta
    const pageB = await context.newPage();
    await pageB.goto('/test-p2p.html');
    const roomBId = 'beta-' + Date.now();
    await pageB.evaluate(async (roomId) => {
      const cfg = await fetch('/relay-config.json').then(r => r.json());
      const nk = new window.NodeKernel({
        bootstrapPeers: cfg.bootstrapPeers,
        roomId,
        gameId: 'room-test',
        enablePersistence: false
      });
      await nk.initialize();
      await nk.start();
      window.__roomNodeB = nk;
    }, roomBId);

    // give time for discovery attempts
    await page.waitForTimeout(4000);

    const peerIdA = await page.evaluate(() => window.__roomNodeA.getStatus().network.peerId);
    const peerIdB = await pageB.evaluate(() => window.__roomNodeB.getStatus().network.peerId);
    const peersA = await page.evaluate(() => window.__roomNodeA.getNetworkManager().getConnectedPeers().map(p => p.peerId));
    const peersB = await pageB.evaluate(() => window.__roomNodeB.getNetworkManager().getConnectedPeers().map(p => p.peerId));

    expect(peersA).not.toContain(peerIdB);
    expect(peersB).not.toContain(peerIdA);
  });
});
