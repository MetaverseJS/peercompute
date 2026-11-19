import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { chromium } from 'playwright';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';
import { createPagesServer } from './pages-runtime.mjs';

async function galleryBaseUrl(t) {
  if (process.env.PAGES_BASE_URL) return new URL(process.env.PAGES_BASE_URL).href;
  const server = await createPagesServer({
    docsRoot: fileURLToPath(new URL('../../docs/', import.meta.url)), ...ensureDevHttpsCert(),
  });
  t.after(() => server.close());
  return server.baseUrl;
}

async function assertFanoGuide(guide, summary) {
  await guide.getByRole('heading', { name: 'Fano Reactor', exact: true }).waitFor();
  assert.equal(await guide.locator('#overview + p').textContent(), summary);
  const diagram = guide.getByRole('img', { name: 'Fano Reactor architecture diagram' });
  assert.ok(await diagram.locator('svg').isVisible());
  assert.match(await diagram.locator('svg').textContent(), /norm defect/i);
  const demo = guide.getByRole('link', { name: 'Open demo' });
  const target = await demo.evaluate(anchor => anchor.href);
  assert.equal(new URL(target).pathname.split('/').filter(Boolean).at(-1), 'fano-reactor');
}

async function waitForCells(page, text) {
  await page.waitForFunction(needle => {
    const desktop = window.__desktop;
    return desktop && Array.from({ length: desktop.stats().rows }, (_, i) => desktop.row(i)).some(row => row.includes(needle));
  }, text);
}

async function cellPoint(page, text) {
  await waitForCells(page, text);
  return page.evaluate(text => {
    const { columns, rows } = __desktop.stats();
    for (let row = 0; row < rows; row++) {
      const line = __desktop.row(row);
      const column = line.indexOf(text);
      if (column >= 0) return [(column + text.length / 2) * innerWidth / columns,
        (row + 0.5) * innerHeight / rows];
    }
  }, text);
}

async function clickCells(page, text, touch = false) {
  const point = await cellPoint(page, text);
  if (touch) await page.touchscreen.tap(...point);
  else {
    await page.mouse.click(...point);
    // The desktop draws its block cursor over the character under the pointer.
    await page.mouse.move(0, 0);
  }
}

test('PeerCompute previews a selection, opens its guide or live demo, and preserves direct HTML links', async t => {
  const baseUrl = await galleryBaseUrl(t);
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined });
  t.after(() => browser.close());

  for (const viewport of [{ width: 1366, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, ignoreHTTPSErrors: true,
      reducedMotion: 'reduce', hasTouch: viewport.width < 600 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    const url = baseUrl + '?prod=1';
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
    const actionPoint = await cellPoint(page, '[ Open demo ↗ ]');
    const summaryPoint = await cellPoint(page, 'Walk up to');
    assert.ok(actionPoint[1] < summaryPoint[1], 'Open demo should be above the README overview');
    await clickCells(page, '› CubeChat', touch);
    assert.equal(await page.locator('iframe').count(), 0);
    await page.keyboard.press('/');
    await page.getByRole('searchbox', { name: 'Find a demo' }).fill('Fano Reactor');
    await page.getByRole('button', { name: 'Done' }).click();
    await waitForCells(page, '1 DEMO');
    await clickCells(page, '› Fano Reactor', touch);
    assert.equal(await page.locator('iframe').count(), 0);
    const fanoSummary = await page.locator('[data-demo-dir="fano-reactor"] .demo-summary').textContent();
    const guideLabel = await page.evaluate(() =>
      Array.from({ length: __desktop.stats().rows }, (_, row) => __desktop.row(row))
        .some(row => row.includes('[ Read guide ]')) ? '[ Read guide ]' : '[Guide]');
    await clickCells(page, guideLabel, touch);
    const guide = page.frameLocator('iframe[title="Fano Reactor guide"]');
    await assertFanoGuide(guide, fanoSummary);
    assert.equal(await page.locator('iframe[title="Fano Reactor"]').count(), 0);
    const guideStage = page.locator('.pc-demo-stage').filter({ has: page.locator('iframe[title="Fano Reactor guide"]') });
    const guideBack = guideStage.getByRole('button', { name: 'Back to PeerCompute' });
    await guideBack.click();
    await waitForCells(page, '› Fano Reactor');
    if (!touch) {
      const originalGuide = await guide.locator('html').elementHandle();
      await page.keyboard.press('Shift+Enter');
      await page.waitForFunction(() => __desktop.windows().some(win => win.active && win.title === 'Fano Reactor guide'));
      assert.equal(await originalGuide.evaluate(el => el === document.documentElement), true);
      assert.equal(await page.locator('iframe').count(), 1);
      await guideBack.click();
      await waitForCells(page, '› Fano Reactor');
    }
    await clickCells(page, '[ Open demo ↗ ]', touch);
    const frame = page.frameLocator('iframe[title="Fano Reactor"]');
    await frame.locator('#product-label').waitFor({ state: 'attached' });
    assert.match(await frame.locator('html').evaluate(() => location.href), /\/fano-reactor\/\?prod=1$/);
    assert.equal(page.url(), url);
    const originalDocument = await frame.locator('html').elementHandle();
    const demoStage = page.locator('.pc-demo-stage').filter({ has: page.locator('iframe[title="Fano Reactor"]') });
    await demoStage.getByRole('button', { name: 'Back to PeerCompute' }).click();
    await waitForCells(page, '1 DEMO');
    await page.keyboard.press('Enter');
    await page.locator('iframe[title="Fano Reactor"]').waitFor();
    assert.equal(await originalDocument.evaluate(el => el === document.documentElement), true);
    assert.equal(await page.locator('iframe[title="Fano Reactor"]').count(), 1);
    assert.deepEqual(errors, []);
    await context.close();
  }

  for (const javaScriptEnabled of [false, true]) {
    const page = await browser.newPage({ javaScriptEnabled, ignoreHTTPSErrors: true });
    const desktopRequests = [];
    page.on('request', request => { if (request.url().endsWith('/exowebtui.js')) desktopRequests.push(request.url()); });
    await page.goto(baseUrl + (javaScriptEnabled ? '?view=html&dev=1' : ''));
    assert.deepEqual(desktopRequests, []);
    assert.equal(await page.locator('a[data-demo-dir]:visible').count(), 17);
    const guides = page.locator('a.guide-link:visible');
    assert.equal(await guides.count(), 17);
    if (javaScriptEnabled) {
      assert.equal(new URL(await page.locator('#return-desktop').getAttribute('href')).search, '?dev=1');
      await page.getByRole('button', { name: 'AI & network' }).click();
      assert.equal(await page.locator('#result-count').textContent(), '2 demos');
      assert.equal(await guides.count(), 2);
      await page.getByRole('searchbox').fill('xyz-unmatched');
      await page.getByRole('button', { name: 'Show all demos' }).click();
      assert.equal(await page.locator('#result-count').textContent(), '17 demos');
    }
    const fanoCard = page.locator('.card').filter({ has: page.getByRole('heading', { name: 'Fano Reactor' }) });
    const fanoSummary = await fanoCard.locator('.demo-summary').textContent();
    await fanoCard.getByRole('link', { name: 'Read the Fano Reactor guide' }).click();
    await assertFanoGuide(page, fanoSummary);
    assert.equal(new URL(page.url()).pathname, new URL('guides/fano-reactor.html', baseUrl).pathname);
    assert.deepEqual(desktopRequests, []);
    await page.close();
  }
});

test('cold startup shows progress until the desktop paints or falls back to the directory', async t => {
  const baseUrl = await galleryBaseUrl(t);
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined });
  t.after(() => browser.close());

  for (const failure of [null, 'download', 'initialize']) {
    const page = await browser.newPage({ ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
    const bundle = '**/assets/exowebtui.js';
    const release = Promise.withResolvers();
    const runModule = Promise.withResolvers();
    const types = [];
    const scriptRequested = page.waitForRequest(request =>
      request.url().endsWith('/assets/exowebtui.js') && request.resourceType() === 'script');
    if (failure === 'initialize') {
      // Fail during the real shell's first present, after its module loads.
      await page.addInitScript(() => {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (...args) {
          if (this.closest('#desktop') && args[0] === '2d') throw new Error('Presenter unavailable.');
          return getContext.apply(this, args);
        };
      });
    }
    await page.route(bundle, async route => {
      const type = route.request().resourceType();
      types.push(type);
      await (type === 'xhr' ? release.promise : runModule.promise);
      return failure === 'download' ? route.abort() : route.continue();
    });
    const bar = page.getByRole('progressbar', { name: 'Loading PeerCompute' });
    try {
      await page.goto(baseUrl + '?prod=1', { waitUntil: 'commit' });
      await bar.waitFor();
      assert.equal(await bar.getAttribute('aria-valuenow'), '0');
      const alternate = page.locator('#boot-directory');
      assert.ok(await alternate.isVisible());
      const alternateUrl = new URL(await alternate.getAttribute('href'), page.url());
      assert.equal(alternateUrl.searchParams.get('view'), 'html');
      assert.equal(await page.locator('#atlas').isVisible(), false);
      release.resolve();
      await scriptRequested;
      // The HTML directory already has a canvas. Only the first native desktop
      // frame may dismiss the download meter.
      assert.ok(await bar.isVisible());
      assert.ok(Number(await bar.getAttribute('aria-valuenow')) > 0);
      assert.equal(await page.locator('#atlas').isVisible(), false);
    } finally {
      release.resolve();
      runModule.resolve();
    }
    if (failure) {
      await page.locator('#atlas').waitFor();
      assert.equal(await page.locator('a[data-demo-dir]:visible').count(), 17);
    } else {
      await waitForCells(page, '17 DEMOS');
      assert.equal(await page.locator('#atlas').isVisible(), false);
      await page.keyboard.press('ArrowDown');
      await waitForCells(page, '› CubeChat');
    }
    await bar.waitFor({ state: 'hidden' });
    assert.deepEqual(types, ['xhr', 'script']);
    await page.close();
  }
});

test('the gallery starts with fast scrolling and random window effects and restores saved choices', async t => {
  const baseUrl = await galleryBaseUrl(t);
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined });
  t.after(() => browser.close());
  const page = await browser.newPage({ ignoreHTTPSErrors: true, reducedMotion: 'reduce',
    viewport: { width: 390, height: 700 } });

  async function wheelOnce(expectedFirst) {
    const point = await cellPoint(page, '› Local Model Console');
    await page.mouse.move(...point);
    await page.mouse.wheel(0, 120);
    await page.mouse.move(0, 0);
    await page.waitForFunction(title => {
      const { rows } = __desktop.stats();
      const heading = Array.from({ length: rows }, (_, row) => __desktop.row(row))
        .findIndex(line => line.includes('17 DEMOS'));
      return heading >= 0 && __desktop.row(heading + 1).includes(title);
    }, expectedFirst);
  }
  await page.goto(baseUrl);
  await wheelOnce('PlanetGen');
  const transitions = ['open', 'close', 'minimize', 'maximize', 'restore', 'raise', 'lower'];
  const kinds = Object.fromEntries(transitions.map(kind => [kind, 'random']));
  assert.deepEqual(await page.evaluate(() => __desktop.animationSettings()), { speed: 'normal', kinds });
  await clickCells(page, '[ Settings ]');
  await page.waitForFunction(() => __desktop.windows().some(w => w.active && w.id === 'settings'));
  // The Windows settings follow the variable-length wallpaper and shader lists.
  // Wheel to the bottom, where the scroll speed is visible on this viewport.
  const center = await page.evaluate(() => {
    const { columns, rows } = __desktop.stats();
    const c = __desktop.windows().find(w => w.id === 'settings').clientRect;
    return [(c.column + c.width / 2) * innerWidth / columns, (c.row + c.height / 2) * innerHeight / rows];
  });
  await page.mouse.move(...center);
  for (let i = 0; i < 20; i++) await page.mouse.wheel(0, 120);
  await page.mouse.move(0, 0);
  await waitForCells(page, 'scroll speed ◂ fast ▸');
  await clickCells(page, 'fast ▸');
  await waitForCells(page, 'scroll speed ◂ slow ▸');
  await clickCells(page, 'open ◂ random ▸');
  const savedOpen = await page.evaluate(() => __desktop.animationSettings().kinds.open);
  assert.notEqual(savedOpen, 'random');
  await page.reload();
  await wheelOnce('CubeChat');
  assert.deepEqual(await page.evaluate(() => __desktop.animationSettings().kinds), { ...kinds, open: savedOpen });
});
