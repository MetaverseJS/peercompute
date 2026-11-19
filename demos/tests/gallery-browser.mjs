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
    await page.keyboard.press('/');
    await page.getByRole('searchbox', { name: 'Find a demo' }).fill('Fano Reactor');
    await page.getByRole('button', { name: 'Done' }).click();
    await waitForCells(page, '1 DEMO');
    await page.keyboard.press('Enter');
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
    await page.goto(server.baseUrl + (javaScriptEnabled ? '?view=html' : ''));
    assert.equal(await page.locator('a[data-demo-dir]:visible').count(), 17);
    if (javaScriptEnabled) {
      await page.getByRole('button', { name: 'AI & network' }).click();
      assert.equal(await page.locator('#result-count').textContent(), '2 demos');
      await page.getByRole('searchbox').fill('xyz-unmatched');
      await page.getByRole('button', { name: 'Show all demos' }).click();
      assert.equal(await page.locator('#result-count').textContent(), '17 demos');
    }
    await page.close();
  }
});
