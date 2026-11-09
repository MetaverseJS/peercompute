import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const target = process.env.NETVIZ_SMOKE_URL || 'https://localhost:5292/?view=all&render=low&autoConnect=1';
const artifacts = process.env.NETVIZ_ARTIFACT_DIR || '/home/cos/.cache/peercompute-netviz-global-20261109/viewer-smoke';
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_BIN || '/bin/google-chrome',
  args: ['--ignore-certificate-errors', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, ignoreHTTPSErrors: true });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
try {
  await page.goto(target, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__NETVIZ__?.getStatus().connectionState === 'connected', null, { timeout: 45_000 });
  assert.equal(await page.locator('#network-view').inputValue(), 'all');
  // Declared UI fixtures: transport acceptance is a separate real-peer test.
  await page.evaluate(() => {
    const kernel = window.__PEERCOMPUTE_KERNELS__.find((entry) => entry.isStarted);
    const manager = kernel.getNetworkManager();
    const original = manager.getNetworkTelemetryService;
    const now = Date.now();
    const model = { manifestCid: 'fixture-model', name: '<img onerror="alert(1)"> Vision model', task: 'image-text-to-text', busy: false };
    const fixtures = [
      { peerId: 'fixture-world', application: 'cubechat', role: 'world', receivedAt: now, peers: [{ peerId: 'fixture-model-a', via: 'webrtc' }], compute: { workerCount: 2, activeTasks: 1 }, models: [] },
      { peerId: 'fixture-model-a', application: 'cubechat', role: 'models', receivedAt: now, peers: [{ peerId: 'fixture-world', via: 'webrtc' }], compute: { workerCount: 3 }, models: [model] },
      { peerId: 'fixture-model-b', application: 'inference', role: 'models', receivedAt: now, peers: [], compute: {}, models: [{ ...model, busy: true }] },
      { peerId: 'fixture-stale', application: 'earth', role: 'world', receivedAt: now - 20_000, peers: [], models: [model], compute: { workerCount: 900 } }
    ];
    manager.getNetworkTelemetryService = () => ({ list: () => fixtures });
    window.__restoreObservedFixture = () => { manager.getNetworkTelemetryService = original; };
  });
  await page.waitForFunction(() => document.querySelector('#hosted-models')?.textContent.includes('2 hosting peers'));
  assert.equal(await page.locator('#hosted-models img').count(), 0);
  assert.match(await page.locator('#observed-summary').textContent(), /5 workers/);
  const initial = await page.evaluate(() => window.__NETVIZ__.getStatus());
  assert.equal(initial.observed.summary.stale, 1);
  assert.equal(initial.observed.models[0].hostCount, 2);
  assert.ok(initial.observed.edges.some((edge) => edge.from === 'fixture-world' && edge.to === 'fixture-model-a'));
  await page.screenshot({ path: `${artifacts}/desktop.png` });
  await page.selectOption('#application-filter', 'inference');
  await page.waitForFunction(() => window.__NETVIZ__.getStatus().observed.models[0]?.hostCount === 1);
  assert.match(await page.locator('#hosted-models').textContent(), /all busy/);
  await page.selectOption('#application-filter', '');
  await page.selectOption('#role-filter', 'world');
  await page.waitForFunction(() => window.__NETVIZ__.getStatus().observed.models.length === 0);
  await page.selectOption('#role-filter', '');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `${artifacts}/mobile.png` });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.evaluate(() => {
    window.__restoreObservedFixture();
    const channel = new BroadcastChannel('peercompute-netviz-debug-v1');
    channel.postMessage({ type: 'session-upsert', session: {
      sessionId: 'netviz-owned-ui-scope-test', peerId: 'fixture-attached', gameId: 'netviz-ui-scope-test',
      roomId: `netviz-ui-${Date.now()}`, topologyId: 'netviz-ui-scope-test', topologyType: 'distributed', isStarted: true, ts: Date.now()
    } }); channel.close();
  });
  await page.selectOption('#attach-session-select', 'netviz-owned-ui-scope-test');
  await page.click('#attach-session-btn');
  await page.waitForFunction(() => { const state = window.__NETVIZ__?.getStatus();
    return state?.connectionState === 'connected' && state.gameId === 'netviz-ui-scope-test'; }, null, { timeout: 45_000 });
  assert.equal(await page.locator('#network-view').inputValue(), 'session');
  assert.match(page.url(), /gameId=netviz-ui-scope-test/);
  assert.equal(errors.length, 0);
  await writeFile(`${artifacts}/report.json`, JSON.stringify({ passed: true, target, scope: 'Controlled UI report fixtures; actual observer startup and selected-session reconnect through SecretWorkshop.', errors,
    observed: initial.observed.summary, models: initial.observed.models.map(({ name, hostCount, busyCount }) => ({ name, hostCount, busyCount })) }, null, 2));
  console.log('Observed-network UI and selected-session reconnect passed.');
} finally {
  await Promise.race([page.evaluate(() => window.__NETVIZ__?.disconnect()).catch(() => {}), new Promise((resolve) => setTimeout(resolve, 3000))]);
  await browser.close();
}
