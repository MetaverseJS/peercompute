import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { chromium } from 'playwright';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';
import { createPagesServer } from './pages-runtime.mjs';

async function waitForCells(page, text) {
  await page.waitForFunction(needle => {
    const desktop = window.__desktop;
    return desktop && Array.from({ length: desktop.stats().rows }, (_, i) => desktop.row(i)).some(row => row.includes(needle));
  }, text);
}

async function clickCells(page, text, touch = false) {
  await waitForCells(page, text);
  const point = await page.evaluate(text => {
    const { columns, rows } = __desktop.stats();
    for (let row = 0; row < rows; row++) {
      const line = __desktop.row(row);
      const column = line.indexOf(text);
      if (column >= 0) return [(column + text.length / 2) * innerWidth / columns,
        (row + 0.5) * innerHeight / rows];
    }
  }, text);
  if (touch) await page.touchscreen.tap(...point);
  else {
    await page.mouse.click(...point);
    // The desktop draws its block cursor over the character under the pointer.
    await page.mouse.move(0, 0);
  }
}

test('PeerCompute directory search launches a live iframe and restores its session; direct links remain available', async t => {
  const server = await createPagesServer({
    docsRoot: fileURLToPath(new URL('../../docs/', import.meta.url)), ...ensureDevHttpsCert(),
  });
  t.after(() => server.close());
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined });
  t.after(() => browser.close());

  for (const viewport of [{ width: 1366, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, ignoreHTTPSErrors: true,
      reducedMotion: 'reduce', hasTouch: viewport.width < 600 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    const url = server.baseUrl + '?prod=1';
    await page.goto(url);
    await waitForCells(page, '17 DEMOS');
    assert.equal(await page.title(), 'PeerCompute');
    assert.equal(await page.evaluate(() => __desktop.windows().at(-1).title), 'PeerCompute');
    const anchors = await page.locator('[data-demo-dir]').evaluateAll(items => items.map(a => a.href));
    assert.equal(new Set(anchors).size, 17);
    const menu = await page.evaluate(() => window.__desktop.menu().items);
    assert.deepEqual(menu.filter(item => item.id.startsWith('launch-')).map(item => item.href), anchors);
    for (const id of ['settings', 'themes', 'builder']) assert.ok(menu.some(item => item.id === id));
    const touch = viewport.width < 600;
    const headings = await page.evaluate(() => {
      const lines = Array.from({ length: __desktop.stats().rows }, (_, i) => __desktop.row(i));
      return { list: lines.findIndex(line => line.includes('17 DEMOS')),
        preview: lines.findIndex(line => line.includes('PREVIEW')) };
    });
    assert.ok(touch ? headings.preview > headings.list : headings.preview === headings.list);
    const summaries = await page.locator('a[data-demo-dir] .demo-summary').allTextContents();
    assert.equal(summaries.length, anchors.length);
    assert.ok(summaries.every(text => text.split(/\s+/).length >= 30));
    await clickCells(page, 'CubeChat', touch);
    await waitForCells(page, '› CubeChat');
    await waitForCells(page, 'Walk up to');
    await clickCells(page, '› CubeChat', touch);
    assert.equal(await page.locator('iframe').count(), 0);
    await page.keyboard.press('/');
    await page.getByRole('searchbox', { name: 'Find a demo' }).fill('Fano Reactor');
    await page.getByRole('button', { name: 'Done' }).click();
    await waitForCells(page, '1 DEMO');
    await clickCells(page, '› Fano Reactor', touch);
    assert.equal(await page.locator('iframe').count(), 0);
    await clickCells(page, '[ Open demo ↗ ]', touch);
    const frame = page.frameLocator('iframe[title="Fano Reactor"]');
    await frame.locator('#product-label').waitFor({ state: 'attached' });
    assert.match(await frame.locator('html').evaluate(() => location.href), /\/fano-reactor\/\?prod=1$/);
    assert.equal(page.url(), url);
    const originalDocument = await frame.locator('html').elementHandle();
    await page.locator('.pc-demo-stage:visible').getByRole('button', { name: 'Back to PeerCompute' }).click();
    await waitForCells(page, '1 DEMO');
    await page.keyboard.press('Enter');
    await page.locator('iframe[title="Fano Reactor"]').waitFor();
    assert.equal(await originalDocument.evaluate(el => el === document.documentElement), true);
    assert.equal(await page.locator('iframe').count(), 1);
    assert.deepEqual(errors, []);
    await context.close();
  }

  for (const javaScriptEnabled of [false, true]) {
    const page = await browser.newPage({ javaScriptEnabled, ignoreHTTPSErrors: true });
    const desktopRequests = [];
    page.on('request', request => { if (request.url().endsWith('/exowebtui.js')) desktopRequests.push(request.url()); });
    await page.goto(server.baseUrl + (javaScriptEnabled ? '?view=html&dev=1' : ''));
    assert.deepEqual(desktopRequests, []);
    assert.equal(await page.locator('a[data-demo-dir]:visible').count(), 17);
    if (javaScriptEnabled) {
      assert.equal(new URL(await page.locator('#return-desktop').getAttribute('href')).search, '?dev=1');
      await page.getByRole('button', { name: 'AI & network' }).click();
      assert.equal(await page.locator('#result-count').textContent(), '2 demos');
      await page.getByRole('searchbox').fill('xyz-unmatched');
      await page.getByRole('button', { name: 'Show all demos' }).click();
      assert.equal(await page.locator('#result-count').textContent(), '17 demos');
    }
    await page.close();
  }
});

test('cold startup shows progress until the desktop paints or falls back to the directory', async t => {
  const server = await createPagesServer({
    docsRoot: fileURLToPath(new URL('../../docs/', import.meta.url)), ...ensureDevHttpsCert(),
  });
  t.after(() => server.close());
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined });
  t.after(() => browser.close());

  for (const fail of [false, true]) {
    const page = await browser.newPage({ ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
    const requested = Promise.withResolvers();
    const release = Promise.withResolvers();
    await page.route('**/assets/exowebtui.js', async route => {
      requested.resolve();
      await release.promise;
      return fail ? route.abort() : route.continue();
    });
    try {
      await page.goto(server.baseUrl, { waitUntil: 'commit' });
      await requested.promise;
      await page.getByRole('status', { name: '' }).filter({ hasText: 'Starting PeerCompute' }).waitFor();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(await page.locator('#atlas').isVisible(), false);
      assert.ok(await page.locator('#plain-directory').isVisible());
    } finally {
      release.resolve();
    }
    if (fail) {
      await page.locator('#atlas').waitFor();
      assert.equal(await page.locator('a[data-demo-dir]:visible').count(), 17);
    } else {
      await waitForCells(page, '17 DEMOS');
      assert.equal(await page.locator('#atlas').isVisible(), false);
    }
    assert.equal(await page.locator('#desktop-startup').isVisible(), false);
    await page.close();
  }
});
