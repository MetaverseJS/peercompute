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
  const diagram = guide.locator('figure .diagram');
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

async function usePaperTheme(page) {
  const size = page.viewportSize();
  await page.mouse.click(size.width / 2, size.height / 2, { button: 'right' });
  const menuPoint = await page.waitForFunction(() => {
    const menu = __desktop.context();
    if (!menu) return;
    const i = menu.items.findIndex(item => item.label === 'themes');
    const { columns, rows } = __desktop.stats();
    return [(menu.rect.column + menu.rect.width / 2) * innerWidth / columns, (menu.rect.row + i + 1.5) * innerHeight / rows];
  });
  await page.mouse.click(...await menuPoint.jsonValue());
  await clickCells(page, 'Paper Terminal');
  await waitForCells(page, '● Paper Terminal');
  const closePoint = await page.evaluate(() => {
    const { columns, rows } = __desktop.stats();
    const w = __desktop.windows().find(w => w.id === 'themes');
    const r = w.controls.find(c => c.kind === 'close').hitRect;
    return [(r.column + r.width / 2) * innerWidth / columns, (r.row + .5) * innerHeight / rows];
  });
  await page.mouse.click(...closePoint);
  await page.mouse.move(0, 0);
}

async function openNativeChart(page, touch) {
  // Reveal the figure caption one line at a time, so a short viewport doesn't
  // page past it. Hit the diagram itself, just above the caption.
  const caption = '[Enlarge diagram]';
  const visible = () => page.evaluate(caption => {
    const { rows } = __desktop.stats();
    return Array.from({ length: rows }, (_, y) => __desktop.row(y)).some(line => line.includes(caption));
  }, caption);
  for (let i = 0; i < 90 && !await visible(); i++) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(40);
  }
  const point = await cellPoint(page, caption);
  // Measure the actual SVG draw into the compositor, including the native
  // window's insets. Its entire footprint must fit at either viewport size.
  await page.waitForFunction(() => {
    const draw = window.fanoDraw;
    if (!draw) return false;
    const { columns, rows } = __desktop.stats();
    const r = __desktop.windows().find(w => w.title === 'Fano Reactor guide').clientRect;
    return draw.left >= r.column / columns - .001 && draw.width > 0 && draw.height > 0 &&
      draw.left + draw.width <= (r.column + r.width) / columns + .001 &&
      draw.height <= r.height / rows && (draw.width * columns >= r.width * .78 || draw.height * rows >= r.height * .78);
  });
  const graphPoint = await page.evaluate(y => {
    const { columns, rows } = __desktop.stats();
    const rect = __desktop.windows().find(w => w.title === 'Fano Reactor guide').clientRect;
    return [(rect.column + rect.width / 2) * innerWidth / columns, y - 2 * innerHeight / rows];
  }, point[1]);
  if (touch) await page.touchscreen.tap(...graphPoint);
  else await page.mouse.click(...graphPoint);
  const viewer = page.getByRole('dialog', { name: /diagram/i });
  await viewer.waitFor();
  assert.match(await viewer.locator('svg').textContent(), /norm defect/i);
  return viewer;
}

test('PeerCompute previews a selection, opens its guide or live demo, and preserves direct HTML links', async t => {
  const baseUrl = await galleryBaseUrl(t);
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined });
  t.after(() => browser.close());

  for (const viewport of [{ width: 1366, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, ignoreHTTPSErrors: true,
      reducedMotion: 'reduce', hasTouch: viewport.width < 600 });
    const page = await context.newPage();
    await page.addInitScript(() => {
      const draw = CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage = function (source, ...args) {
        const result = draw.call(this, source, ...args);
        if (source instanceof HTMLImageElement && args.length === 4 &&
            source.src.startsWith('data:image/svg+xml') && source.src.includes('Cayley-Dickson')) {
          const [x, , width, height] = args;
          window.fanoDraw = { left: x / this.canvas.width, width: width / this.canvas.width,
            height: height / this.canvas.height };
        }
        if (source instanceof HTMLImageElement && source.src.endsWith('/assets/cubechat.png') &&
            args.length === 4 && args[2] > 60 && args[3] > 40) window.drewCubeThumbnail = true;
        return result;
      };
    });
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
    if (!touch) await page.waitForFunction(() => window.drewCubeThumbnail);
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
    const guideLabel = await page.evaluate(() =>
      Array.from({ length: __desktop.stats().rows }, (_, row) => __desktop.row(row))
        .some(row => row.includes('[ Read guide ]')) ? '[ Read guide ]' : '[Guide]');
    await clickCells(page, guideLabel, touch);
    const activeGuide = () => page.waitForFunction(() =>
      __desktop.windows().some(w => w.title === 'Fano Reactor guide' && w.active));
    await activeGuide();
    await waitForCells(page, 'Choose two algebraic atoms');
    assert.equal(await page.locator('iframe').count(), 0);
    if (!touch) {
      const standalone = await context.newPage();
      await standalone.goto(new URL('guides/fano-reactor.html', baseUrl).href);
      await page.bringToFront();
      await usePaperTheme(page);
      const followsTheme = () => standalone.waitForFunction(() =>
        getComputedStyle(document.body).color === 'rgb(35, 38, 42)' &&
        getComputedStyle(document.querySelector('.diagram g.node text')).fill === 'rgb(35, 38, 42)');
      await followsTheme();
      await standalone.reload();
      await followsTheme();
      await standalone.close();
      // Check a cell from the actual rendered README rather than the theme menu.
      await page.waitForFunction(() => {
        const rect = __desktop.windows().find(w => w.active && w.title === 'Fano Reactor guide')?.clientRect;
        if (!rect) return false;
        for (let y = rect.row; y < rect.row + rect.height; y++) {
          const x = __desktop.row(y).indexOf('Choose two algebraic atoms', rect.column);
          if (x >= 0 && x < rect.column + rect.width) return __desktop.cell(x, y).foreground.join() === '35,38,42';
        }
        return false;
      });
    }
    const viewer = await openNativeChart(page, touch);
    if (!touch) {
      const ink = await viewer.locator('svg g.node text').first().evaluate(node => getComputedStyle(node).fill);
      assert.equal(ink, 'rgb(35, 38, 42)', 'SVG labels use the active Paper Terminal text color');
    }
    await viewer.getByRole('button', { name: 'Close' }).click();
    await page.keyboard.press('End');
    await waitForCells(page, 'Delta');
    await clickCells(page, '[← Back]', touch);
    await waitForCells(page, '› Fano Reactor');
    if (!touch) {
      await page.keyboard.press('Shift+Enter');
      await activeGuide();
      await waitForCells(page, 'Delta');
      assert.equal(await page.evaluate(() =>
        __desktop.windows().filter(w => w.title === 'Fano Reactor guide').length), 1);
      await clickCells(page, '[← Back]');
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

  async function wheelOnce(expectedIndex) {
    const expectedFirst = await page.locator('[data-demo-dir] h2').nth(expectedIndex).textContent();
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
  await wheelOnce(4);
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
  await wheelOnce(1);
  assert.deepEqual(await page.evaluate(() => __desktop.animationSettings().kinds), { ...kinds, open: savedOpen });
});

test('the directory keeps its shape when a demo opens and no window outgrows a smaller viewport', async t => {
  const baseUrl = await galleryBaseUrl(t);
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined });
  t.after(() => browser.close());
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const windows = () => page.evaluate(() => ({ size: __desktop.stats().size,
    windows: __desktop.windows().map(({ id, rect, state, active }) => ({ id, rect, state, active })) }));
  const settled = predicate => page.waitForFunction(predicate, null, { polling: 100 });
  const assertInside = ({ size, windows }) => {
    for (const { id, rect } of windows) {
      assert.ok(rect.width <= size.columns && rect.height <= size.rows - 1, id + ' fits the desktop body');
      assert.ok(rect.column >= 0 && rect.column + rect.width <= size.columns, id + ' stays inside horizontally');
      assert.ok(rect.row >= 1 && rect.row + rect.height <= size.rows, id + ' stays inside vertically');
    }
  };
  await page.goto(baseUrl);
  await waitForCells(page, 'DEMO DIRECTORY');
  // Size the directory for a large screen, then narrow below its fullscreen width.
  const wide = (await windows()).windows[0];
  assert.equal(wide.state, 'normal');
  await page.setViewportSize({ width: 872, height: 700 });
  await settled(() => __desktop.windows()[0].state === 'maximized' && __desktop.stats().size.columns < 110);
  const before = (await windows()).windows[0];
  assert.ok(wide.rect.width > before.rect.width);
  await page.keyboard.press('Enter');
  await settled(() => __desktop.windows().length === 2 && __desktop.windows()[1].active);
  const open = await windows();
  assert.deepEqual(open.windows[0].rect, before.rect);
  assertInside(open);
  await page.getByRole('button', { name: '← Back to PeerCompute' }).click();
  await settled(() => __desktop.windows().find(w => w.id === 'demo-atlas')?.active);
  assert.deepEqual((await windows()).windows.find(w => w.id === 'demo-atlas').rect, before.rect);

  // Two floating windows sized for a large screen shrink with the viewport.
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.reload();
  await waitForCells(page, 'DEMO DIRECTORY');
  await page.keyboard.press('Enter');
  await settled(() => __desktop.windows().length === 2 && __desktop.windows()[1].active);
  await page.setViewportSize({ width: 1000, height: 640 });
  await settled(() => __desktop.stats().size.columns < 125 &&
    __desktop.windows().every(w => w.rect.width <= __desktop.stats().size.columns));
  const narrowed = await windows();
  assertInside(narrowed);
  // Refitting leaves the demo in front of the directory.
  assert.deepEqual(narrowed.windows.map(w => [w.id === 'demo-atlas', w.active]), [[true, false], [false, true]]);
});
