import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

let server, browser, origin;
before(async () => {
  const source = await readFile(new URL('../inference/src/ui/networkStatus.js', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../inference/src/ui/networkStatus.css', import.meta.url), 'utf8');
  const panelStyles = await readFile(new URL('../inference/src/panel.css', import.meta.url), 'utf8');
  server = createServer((request, response) => {
    if (request.url === '/networkStatus.js') {
      response.setHeader('Content-Type', 'text/javascript');
      response.end(source.replace("import './networkStatus.css';", '')); return;
    }
    if (request.url === '/style.css') {
      response.setHeader('Content-Type', 'text/css'); response.end(panelStyles + '\n' + styles); return;
    }
    response.setHeader('Content-Type', 'text/html');
    response.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/style.css"><style>body{margin:0}.pc-inference-panel{height:160px;min-height:0;margin:0;width:100%}.fixture-nav{display:flex;justify-content:flex-end;gap:8px;flex-shrink:0}</style><main class="pc-inference-panel"><nav class="fixture-nav"><button id="before">Models</button><button id="menu">Menu</button></nav><textarea aria-label="Message"></textarea></main><button id="outside">Outside control</button>');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => { await browser?.close(); await new Promise((resolve) => server?.close(resolve)); });

async function fixture(t, { viewport = { width: 1100, height: 800 }, fallback = false } = {}) {
  const page = await browser.newPage({ viewport }); const errors = [], externalRequests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => {
    if (route.request().url().startsWith(origin + '/')) return route.continue();
    externalRequests.push(route.request().url()); return route.abort();
  });
  t.after(async () => { await page.evaluate(() => networkStatus?.dispose()).catch(() => {}); await page.close(); assert.deepEqual(errors, []); assert.deepEqual(externalRequests, []); });
  await page.goto(origin);
  await page.evaluate(async (fallback) => {
    if (fallback) Object.defineProperty(HTMLElement.prototype, 'showPopover', { value: undefined, configurable: true });
    const { createNetworkStatus } = await import('/networkStatus.js');
    window.networkStatus = createNetworkStatus({ container: document.querySelector('main') });
    document.querySelector('nav').insertBefore(networkStatus.trigger, document.querySelector('#menu'));
    window.healthy = { connected: true, peerCount: 2, sharedModelCount: 3, hostedModelCount: 4, artifacts: { status: 'ready' } };
    window.updateStatus = (info) => networkStatus.update(info);
  }, fallback);
  return page;
}
const trigger = (page) => page.getByRole('button', { name: 'Network status', exact: true });
const popup = (page) => page.getByRole('dialog', { name: 'Network status', exact: true });

test('network health requires known positive counts and clear connection and artifact status', async (t) => {
  const page = await fixture(t);
  const states = await page.evaluate(() => [
    {}, { connecting: true }, { connected: true }, { ...healthy, peerCount: 0 },
    { ...healthy, sharedModelCount: 0 }, { ...healthy, hostedModelCount: 0 },
    { ...healthy, peerCount: '2' }, { ...healthy, sharedModelCount: -1 },
    { ...healthy, hostedModelCount: Number.NaN }, { ...healthy, issue: 'Peer query failed' },
    { ...healthy, artifacts: { status: 'starting' } }, { ...healthy, artifacts: { status: 'error', error: 'Ownership unavailable' } },
    { ...healthy, artifacts: { status: 'offline' } }, { ...healthy, connecting: true }, healthy,
  ].map((info) => { updateStatus(info); return networkStatus.trigger.dataset.state; }));
  assert.deepEqual(states, ['offline', ...Array(13).fill('pending'), 'healthy']);
  assert.equal(await trigger(page).getAttribute('aria-description'), 'Network state: Healthy.');
  assert.equal(await popup(page).isVisible(), false);
  await trigger(page).click();
  assert.equal(await popup(page).getByText('Healthy', { exact: true }).isVisible(), true);
  assert.equal(await popup(page).getAttribute('aria-modal'), 'false');
});

test('popup and Config text retain counts, errors and file-sharing diagnostics without interpreting markup', async (t) => {
  const page = await fixture(t);
  const text = await page.evaluate(() => updateStatus({ ...healthy,
    issue: '<img src=x onerror=alert(1)> ' + 'x'.repeat(300), artifacts: { status: 'error', error: 'No storage owner' } }));
  await trigger(page).click();
  const details = popup(page).locator('.pc-network-summary');
  assert.equal(await details.textContent(), text);
  assert.match(text, /Peer network connected · 2 peers · 3 shared models · 4 hosted models/);
  assert.match(text, /Discovery issue: <img/); assert.match(text, /File sharing unavailable: No storage owner/);
  assert.equal(await details.locator('img').count(), 0); assert(text.length < 500);
  await page.evaluate(() => updateStatus({ connected: true, peerCount: 0, sharedModelCount: 0, hostedModelCount: 0, artifacts: { status: 'starting' } }));
  assert.match(await details.textContent(), /Waiting for other peers/);
  assert.match(await details.textContent(), /File sharing is preparing stored models/);
  await page.evaluate(() => updateStatus({ connected: true, peerCount: 1, sharedModelCount: 2, hostedModelCount: 0 }));
  assert.match(await details.textContent(), /No peer is currently advertising a loaded model/);
});

test('native button toggles the nonmodal popup, Escape and close return focus, outside click preserves its target', async (t) => {
  const page = await fixture(t);
  await trigger(page).focus(); await page.keyboard.press('Enter');
  assert.equal(await popup(page).isVisible(), true); assert.equal(await trigger(page).getAttribute('aria-expanded'), 'true');
  assert.equal(await popup(page).evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press('Escape');
  assert.equal(await popup(page).isVisible(), false); assert.equal(await trigger(page).getAttribute('aria-expanded'), 'false');
  assert.equal(await trigger(page).evaluate((element) => element === document.activeElement), true);
  await trigger(page).click(); await popup(page).getByRole('button', { name: 'Close network status', exact: true }).click();
  assert.equal(await trigger(page).evaluate((element) => element === document.activeElement), true);
  await trigger(page).click(); await page.locator('#outside').click();
  assert.equal(await popup(page).isVisible(), false); assert.equal(await page.locator('#outside').evaluate((element) => element === document.activeElement), true);
  await trigger(page).click(); await trigger(page).click(); assert.equal(await popup(page).isVisible(), false);
});

test('open updates preserve focused controls, closed updates do not open, and immediate close/reopen survives queued native toggles', async (t) => {
  const page = await fixture(t);
  await trigger(page).click(); const close = popup(page).getByRole('button', { name: 'Close network status', exact: true }); await close.focus();
  await page.evaluate(() => { for (let i = 0; i < 5; i++) updateStatus(healthy); });
  assert.equal(await close.evaluate((element) => element === document.activeElement), true);
  await page.evaluate(() => { networkStatus.close(); networkStatus.trigger.click(); }); await page.waitForTimeout(30);
  assert.equal(await popup(page).isVisible(), true); assert.equal(await trigger(page).getAttribute('aria-expanded'), 'true');
  await page.evaluate(() => { networkStatus.close(); updateStatus({ connected: false }); });
  assert.equal(await popup(page).isVisible(), false); assert.equal(await trigger(page).getAttribute('data-state'), 'offline');
});

test('phone popup is clamped below the glyph in the top layer despite short overflow-hidden embedded panel', async (t) => {
  const page = await fixture(t, { viewport: { width: 390, height: 844 } });
  await page.evaluate(() => updateStatus({ ...healthy, issue: 'A_long_peer_error_without_spaces_'.repeat(20), artifacts: { status: 'starting' } }));
  await trigger(page).click();
  const box = await popup(page).boundingBox(), anchor = await trigger(page).boundingBox();
  assert.equal(anchor.width, 40); assert.equal(anchor.height, 40);
  assert(box.x >= 8 && box.x + box.width <= 382); assert(box.y >= anchor.y + anchor.height);
  assert(box.y + box.height <= 836); assert(box.y + box.height > 160, 'popup escapes the embedded panel clipping boundary');
  assert.equal(await popup(page).evaluate((element) => element.scrollWidth <= element.clientWidth), true);
  const point = { x: box.x + 20, y: box.y + box.height - 10 };
  assert.equal(await page.evaluate((point) => networkStatus.element.contains(document.elementFromPoint(point.x, point.y)), point), true);
  const directory = process.env.NETWORK_STATUS_SCREENSHOTS || '/tmp/peercompute-network-status-ui'; await mkdir(directory, { recursive: true });
  await page.screenshot({ path: `${directory}/mobile-network-status.png` });
  await page.setViewportSize({ width: 320, height: 480 });
  await page.waitForFunction(() => {
    const box = networkStatus.element.getBoundingClientRect();
    return box.x >= 8 && box.right <= innerWidth - 8 && box.y >= 8 && box.bottom <= innerHeight - 8;
  }, undefined, { timeout: 2000 });
  const compact = await popup(page).boundingBox(); assert(compact.x >= 8 && compact.x + compact.width <= 312); assert(compact.y >= 8 && compact.y + compact.height <= 472);
});

test('fixed fallback remains usable without Popover API and disposal removes owned listeners and nodes', async (t) => {
  const page = await fixture(t, { fallback: true });
  await trigger(page).click(); assert.equal(await popup(page).isVisible(), true);
  await page.keyboard.press('Escape'); assert.equal(await popup(page).isVisible(), false);
  await trigger(page).click();
  const result = await page.evaluate(() => {
    window.savedTrigger = networkStatus.trigger; window.savedPopup = networkStatus.element;
    networkStatus.dispose(); networkStatus.dispose();
    savedTrigger.click(); updateStatus(healthy); window.dispatchEvent(new Event('resize'));
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }); document.dispatchEvent(escape);
    return { triggerConnected: savedTrigger.isConnected, popupConnected: savedPopup.isConnected, prevented: escape.defaultPrevented,
      expanded: savedTrigger.getAttribute('aria-expanded'), hidden: savedPopup.hidden };
  });
  assert.deepEqual(result, { triggerConnected: false, popupConnected: false, prevented: false, expanded: 'false', hidden: true });
});
