import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { chromium } from 'playwright';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';
import { createPagesServer } from './pages-runtime.mjs';

const colors = { pink: [230, 24, 196], gold: [240, 195, 20], green: [21, 216, 89] };
const matches = (pixel, color) => color.every((value, i) => Math.abs(value - pixel[i]) < 25);

function fixture(color, name) {
  return { headers: {
    'content-type': 'text/html',
    'cross-origin-embedder-policy': 'credentialless',
    'cross-origin-opener-policy': 'same-origin',
  }, body: `<title>${name}</title><style>body{background:rgb(${color});margin:0}</style><input aria-label="Draft">` };
}

async function configure(page, baseUrl, mode) {
  if (mode === 'standard iframe') {
    await page.addInitScript(() => { delete CanvasRenderingContext2D.prototype.drawElementImage; });
  }
  const seed = baseUrl + 'overlay-test-preferences';
  await page.route(seed, route => route.fulfill({ contentType: 'text/html', body: '<title>Settings</title>' }));
  await page.goto(seed);
  await page.evaluate(mode => new Promise((resolve, reject) => {
    const open = indexedDB.open('peercompute-demo-atlas', 1);
    open.onupgradeneeded = () => open.result.createObjectStore('desktop');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction('desktop', 'readwrite');
      tx.objectStore('desktop').put({ wallpaper: 'plain', windowOpacity: 1, shaderDefaultsVersion: 2,
        shaders: mode === 'shaders off' ? [] : ['scanlines'], shaderTuning: { scanlines: { strength: 0 } } }, 'settings');
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => reject(tx.error);
    };
  }), mode);
}

async function readPixels(page, points) {
  const png = await page.screenshot();
  return page.evaluate(async ({ png, points }) => {
    const bytes = Uint8Array.from(atob(png), char => char.charCodeAt(0));
    const image = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    const ctx = new OffscreenCanvas(image.width, image.height).getContext('2d');
    ctx.drawImage(image, 0, 0);
    image.close();
    return points.map(([x, y]) => Array.from(ctx.getImageData(x, y, 1, 1).data).slice(0, 3));
  }, { png: png.toString('base64'), points });
}

async function expectPixels(page, points, expected, message) {
  const deadline = Date.now() + 5000;
  let pixels;
  do {
    pixels = await readPixels(page, points);
    if (expected(pixels)) return;
    await page.waitForTimeout(50);
  } while (Date.now() < deadline);
  assert.fail(`${message}. Sampled pixels: ${JSON.stringify(pixels)}`);
}

test('desktop overlays preserve visible iframe contents and allow a second demo to finish loading', async t => {
  const server = await createPagesServer({
    docsRoot: fileURLToPath(new URL('../../docs/', import.meta.url)), ...ensureDevHttpsCert(),
  });
  t.after(() => server.close());
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined,
    args: ['--enable-unsafe-swiftshader'] });
  t.after(() => browser.close());

  for (const mode of ['shared shader', 'shaders off', 'standard iframe']) {
    await t.test(mode, async () => {
      const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1,
        ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
      let startSecondDemo;
      const secondDemo = new Promise(resolve => { startSecondDemo = resolve; });
      try {
        await configure(page, server.baseUrl, mode);
        await page.route(url => url.pathname.endsWith('/fano-reactor/'),
          route => route.fulfill(fixture(colors.pink, 'First demo')));
        await page.route(url => url.pathname.endsWith('/schrodinger/'), async route => {
          await secondDemo;
          await route.fulfill(fixture(colors.green, 'Second demo'));
        });
        await page.goto(server.baseUrl + '?prod=1');
        await page.waitForSelector('.exowebtui-ready', { state: 'attached' });
        const launch = dir => page.locator(`a[data-demo-dir="${dir}"]`).evaluate(link => link.click());
        await launch('fano-reactor');
        const first = page.frameLocator('iframe[title="Fano Reactor"]');
        const draft = first.getByRole('textbox', { name: 'Draft' });
        await draft.fill('preserved across windows');
        const box = await page.locator('iframe[title="Fano Reactor"]').boundingBox();
        const menuY = Math.round(box.y + box.height / 2);
        const under = [Math.round(box.x + 45), menuY + 35];
        const away = [Math.round(box.x + box.width * .82), menuY];
        await expectPixels(page, [under, away], pixels => pixels.every(p => matches(p, colors.pink)),
          'the demo should paint under both probes before opening the menu');
        await page.mouse.click(box.x - 15, menuY, { button: 'right' });
        await page.waitForFunction(() => Boolean(__desktop.context()));
        // Simulate progress from a running demo while its menu stays open.
        await first.locator('body').evaluate((body, color) => { body.style.backgroundColor = `rgb(${color})`; }, colors.gold);
        await expectPixels(page, [under, away],
          ([inside, outside]) => !matches(inside, colors.gold) && matches(outside, colors.gold),
          'the context menu must cover only its own pixels as the app repaints');
        // Click the actual Settings item through the projected menu over the iframe.
        const settings = await page.evaluate(() => {
          const { rect, items } = __desktop.context();
          const { columns, rows } = __desktop.stats();
          const i = items.findIndex(item => item.label === 'settings');
          return [(rect.column + rect.width / 2) * innerWidth / columns,
            (rect.row + i + 1.5) * innerHeight / rows];
        });
        await page.mouse.click(...settings);
        await page.waitForFunction(() => __desktop.windows().some(w => w.id === 'settings' && w.active));
        // Focus the existing first demo before opening the second so accepting
        // the tab switcher returns to that original browsing context.
        await launch('fano-reactor');
        await launch('schrodinger');
        await page.waitForSelector('iframe[title="Schrodinger"]', { state: 'attached' });
        await page.keyboard.press('Tab');
        await page.waitForFunction(() => Array.from({ length: __desktop.stats().rows }, (_, i) => __desktop.row(i))
          .some(line => line.includes('> Fano Reactor')));
        startSecondDemo();
        await page.frameLocator('iframe[title="Schrodinger"]').getByRole('textbox').waitFor({ state: 'attached' });
        await expectPixels(page, [away], ([pixel]) => matches(pixel, colors.green),
          'the newly loaded second demo should display behind the open switcher');
        await page.keyboard.press('Enter');
        await expectPixels(page, [away], ([pixel]) => matches(pixel, colors.gold),
          'accepting the switcher should immediately restore the first demo');
        assert.equal(await draft.inputValue(), 'preserved across windows');
      } finally {
        startSecondDemo();
        await page.close();
      }
    });
  }

  await t.test('animated taskbar switches keep loaded clients in every shader upload', async subtest => {
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 },
      ignoreHTTPSErrors: true, reducedMotion: 'no-preference' });
    try {
      await configure(page, server.baseUrl, 'shared shader');
      if (!await page.evaluate(() => 'drawElementImage' in CanvasRenderingContext2D.prototype)) {
        subtest.skip('The installed browser runs the standard iframe coverage above.');
        return;
      }
      await page.addInitScript(() => {
        if (window !== top) return;
        const upload = WebGL2RenderingContext.prototype.texImage2D;
        WebGL2RenderingContext.prototype.texImage2D = function (...args) {
          const source = args.at(-1);
          if (window.switchPixels && this.canvas.closest('#desktop') && source instanceof HTMLCanvasElement) {
            // Both demo windows overlap the desktop center. A missing client
            // would expose the terminal placeholder on that very shader pass.
            const pixel = source.getContext('2d').getImageData(source.width / 2, source.height / 2, 1, 1);
            window.switchPixels.push(Array.from(pixel.data).slice(0, 3));
          }
          return upload.apply(this, args);
        };
      });
      for (const [dir, color] of [['fano-reactor', colors.pink], ['schrodinger', colors.green]]) {
        await page.route(url => url.pathname.endsWith('/' + dir + '/'), route => route.fulfill(fixture(color, dir)));
      }
      await page.goto(server.baseUrl + '?prod=1');
      await page.waitForSelector('.exowebtui-ready', { state: 'attached' });
      for (const [dir, color] of [['fano-reactor', colors.pink], ['schrodinger', colors.green]]) {
        await page.locator(`a[data-demo-dir="${dir}"]`).evaluate(link => link.click());
        await expectPixels(page, [[600, 400]], ([pixel]) => matches(pixel, color), dir + ' should finish painting');
      }
      for (const [title, color] of [['Fano Reactor', colors.pink], ['Schrodinger', colors.green]]) {
        const [x, y] = await page.evaluate(title => {
          window.switchPixels = [];
          const { columns, rows } = __desktop.stats();
          const start = __desktop.row(0).indexOf(title);
          if (start < 0) throw new Error('Missing taskbar button for ' + title);
          return [(start + title.length / 2) * innerWidth / columns, innerHeight / rows / 2];
        }, title);
        await page.mouse.click(x, y);
        await page.waitForFunction(({ title, color }) => {
          const p = window.switchPixels.at(-1);
          return __desktop.windows().some(w => w.title === title && w.active) && !__desktop.animations().length &&
            p && color.every((value, i) => Math.abs(value - p[i]) < 25);
        }, { title, color });
        const pixels = await page.evaluate(() => { const result = window.switchPixels; window.switchPixels = null; return result; });
        assert.ok(pixels.every(p => matches(p, colors.pink) || matches(p, colors.green)),
          'a taskbar switch exposed the empty desktop client in the shader source');
      }
    } finally {
      await page.close();
    }
  });
});

test('edge and corner snaps refit together after a viewport resize and keep both demos running', async t => {
  const server = await createPagesServer({
    docsRoot: fileURLToPath(new URL('../../docs/', import.meta.url)), ...ensureDevHttpsCert(),
  });
  t.after(() => server.close());
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined });
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 1360, height: 810 },
    ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  await configure(page, server.baseUrl, 'shaders off');
  for (const dir of ['fano-reactor', 'schrodinger']) {
    await page.route(url => url.pathname.endsWith('/' + dir + '/'), route => route.fulfill(fixture(colors.gold, dir)));
  }
  await page.goto(server.baseUrl + '?prod=1');
  await page.waitForSelector('.exowebtui-ready', { state: 'attached' });

  async function snap(title, edge) {
    const points = await page.evaluate(({ title, edge }) => {
      const { rect } = __desktop.windows().find(win => win.title === title);
      const { columns, rows } = __desktop.stats();
      const cell = (x, y) => [(x + .5) * innerWidth / columns, (y + .5) * innerHeight / rows];
      const to = edge === 'top' ? cell(columns / 2, 1) : cell(edge === 'left' ? 0 : columns - 1, rows - 1);
      return { from: cell(rect.column + 5, rect.row), to };
    }, { title, edge });
    await page.mouse.move(...points.from);
    await page.mouse.down();
    await page.mouse.move(...points.to, { steps: 8 });
    await page.mouse.up();
  }

  async function assertFitted() {
    await page.waitForFunction(() => {
      const { columns, rows } = __desktop.stats();
      if (columns !== Math.floor(innerWidth / 9) || rows !== Math.floor(innerHeight / 18)) return false;
      const windows = __desktop.windows();
      // The controller can accept the snap one frame before its iframe is
      // laid out. Wait for that projection before using its width as a baseline.
      for (const win of windows.filter(w => w.title === 'Fano Reactor' || w.title === 'Schrodinger')) {
        const iframe = document.querySelector('iframe[title="' + win.title + '"]');
        if (!iframe || Math.abs(iframe.clientWidth - win.clientRect.width * innerWidth / columns) > 1) return false;
      }
      const rects = Object.fromEntries(windows.map(win => [win.title, win.rect]));
      const top = rects.PeerCompute, left = rects['Fano Reactor'], right = rects.Schrodinger;
      return top && left && right && top.column === 0 && top.row === 1 && top.width === columns &&
        top.height === Math.ceil((rows - 1) / 2) && left.column === 0 && left.width === Math.ceil(columns / 2) &&
        left.row === 1 + top.height && right.row === left.row && right.column === left.width &&
        right.column + right.width === columns && left.row + left.height === rows && right.row + right.height === rows;
    });
  }

  await snap('PeerCompute', 'top');
  for (const [dir, title, edge] of [['fano-reactor', 'Fano Reactor', 'left'], ['schrodinger', 'Schrodinger', 'right']]) {
    await page.locator('a[data-demo-dir="' + dir + '"]').evaluate(link => link.click());
    await page.frameLocator('iframe[title="' + title + '"]').getByRole('textbox').fill(title + ' draft');
    await snap(title, edge);
  }
  await assertFitted();
  // Focus the catalog, whose ordinary floating window would maximize below 1280px.
  await page.mouse.click(130, 27);
  await page.waitForFunction(() => __desktop.windows().some(w => w.title === 'PeerCompute' && w.active));

  // Advance browser time explicitly so that each resize event is delivered,
  // even when the test runner is busy. An unfinished drag must not resize the demos.
  const initialSize = await page.locator('iframe').evaluateAll(frames => frames.map(f => [f.clientWidth, f.clientHeight]));
  await page.clock.install({ time: new Date('2026-01-01T12:00:00Z') });
  await page.clock.pauseAt(new Date('2026-01-01T12:01:00Z'));
  for (const size of [{ width: 1450, height: 840 }, { width: 1500, height: 880 }, { width: 1600, height: 980 }]) {
    await page.setViewportSize(size);
    await page.evaluate(() => new Promise(resolve => {
      const observer = new ResizeObserver(() => { observer.disconnect(); resolve(); });
      observer.observe(document.querySelector('#desktop'));
    }));
    await page.clock.runFor(40);
    assert.deepEqual(await page.locator('iframe').evaluateAll(frames => frames.map(f => [f.clientWidth, f.clientHeight])), initialSize);
  }
  await page.clock.runFor(350);
  await assertFitted();
  await page.setViewportSize({ width: 1000, height: 720 });
  await page.clock.runFor(400);
  await assertFitted();
  for (const title of ['Fano Reactor', 'Schrodinger']) {
    assert.equal(await page.frameLocator('iframe[title="' + title + '"]').getByRole('textbox').inputValue(), title + ' draft');
  }
});
