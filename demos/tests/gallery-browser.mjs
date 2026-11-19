import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { chromium } from 'playwright';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';
import { createPagesServer } from './pages-runtime.mjs';

test('the native launcher and HTML atlas open the same demos on desktop and mobile', async t => {
  const server = await createPagesServer({
    docsRoot: fileURLToPath(new URL('../../docs/', import.meta.url)),
    ...ensureDevHttpsCert(),
  });
  t.after(() => server.close());
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined });
  t.after(() => browser.close());

  for (const viewport of [{ width: 1366, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, ignoreHTTPSErrors: true, hasTouch: viewport.width < 600 });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(server.baseUrl + '?prod=1');
    await page.waitForSelector('html.exowebtui-ready #atlas');
    const cards = page.locator('[data-demo-dir]');
    const anchors = await cards.evaluateAll(items => items.map(a => a.href));
    assert.equal(new Set(anchors).size, 17);
    assert.deepEqual(await page.evaluate(() => window.__desktop.menu().items
      .filter(item => item.id.startsWith('launch-')).map(item => item.href)), anchors);
    assert.equal(await page.locator('#atlas').evaluate(atlas => atlas.scrollWidth <= atlas.clientWidth), true);
    await page.getByRole('button', { name: 'AI & network', exact: true }).click();
    assert.equal(await page.locator('#result-count').textContent(), '2 demos');
    await page.getByRole('searchbox').fill('xyz-unmatched');
    await page.getByRole('button', { name: 'Show all demos', exact: true }).click();
    assert.equal(await page.locator('#result-count').textContent(), '17 demos');
    await page.getByRole('searchbox').fill('proximity video');
    assert.equal(await page.locator('#result-count').textContent(), '1 demo');
    assert.match(await page.locator('[data-demo-dir]:visible').getAttribute('href'), /\/cubechat\/\?prod=1$/);
    assert.deepEqual(errors, []);
    await page.close();
  }

  const fallback = await browser.newPage({ javaScriptEnabled: false, ignoreHTTPSErrors: true });
  await fallback.goto(server.baseUrl);
  assert.equal(await fallback.locator('a[data-demo-dir]:visible').count(), 17);
  assert.equal(await fallback.getByRole('searchbox').count(), 0);
  await fallback.close();
});
