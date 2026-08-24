import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';
import { createServer } from 'vite';

import { ensureDevHttpsCert } from '../../scripts/https.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  || process.env.CHROME_EXECUTABLE_PATH
  || (existsSync('/bin/google-chrome') ? '/bin/google-chrome' : undefined);

const certificate = ensureDevHttpsCert();
const server = await createServer({
  root: repoRoot,
  appType: 'mpa',
  logLevel: 'error',
  optimizeDeps: {
    entries: ['demos/tests/fixtures/roadvector-xr-browser.html'],
  },
  server: {
    host: '127.0.0.1',
    port: 0,
    strictPort: false,
    https: { key: certificate.key, cert: certificate.cert },
  },
});
let browser = null;
try {
  await server.listen();
  const address = server.httpServer.address();
  assert(address && typeof address !== 'string' && address.port > 0, 'Vite did not bind a browser-test port');
  browser = await chromium.launch({
    ...(executablePath ? { executablePath } : {}),
    headless: true,
  });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(`https://127.0.0.1:${address.port}/demos/tests/fixtures/roadvector-xr-browser.html`, {
    waitUntil: 'load',
  });
  await page.waitForFunction(() => ['true', 'failed'].includes(document.documentElement.dataset.xrBrowserReady), null, {
    timeout: 20_000,
  });
  const outcome = await page.evaluate(() => globalThis.__roadVectorXrBrowser);
  assert.equal(outcome.status, 'passed', outcome.error ?? 'XR browser harness failed');
  assert.deepEqual(outcome.result, {
    secureContext: true,
    sessionCount: 2,
    controllerAndHandRegistered: true,
    xrStandardMapped: true,
    handSelectSqueezeMapped: true,
    handPoseSteeringMapped: true,
    wristPanelMounted: true,
    ownerRayExcluded: true,
    soleSourcePanelFallback: true,
    soleSourcePanelInteractive: true,
    realThreeRaycasterPassed: true,
    xrViewAxisAndRebasePassed: true,
    uiCapturedOnlyControls: true,
    sourceRemovalCleared: true,
    reentryPassed: true,
    disposed: true,
  });
  assert.deepEqual(errors, []);
  await context.close();
  console.log('RoadVector mocked WebXR browser smoke passed.');
} finally {
  await browser?.close();
  await server.close();
}
