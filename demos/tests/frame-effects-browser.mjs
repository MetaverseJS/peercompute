import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { chromium } from 'playwright';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';
import { createPagesServer } from './pages-runtime.mjs';

async function launchFano(page, baseUrl) {
  await page.goto(baseUrl + '?prod=1');
  await page.waitForSelector('.exowebtui-ready', { state: 'attached' });
  await page.keyboard.press('/');
  await page.getByRole('searchbox', { name: 'Find a demo' }).fill('Fano Reactor');
  await page.getByRole('button', { name: 'Done' }).click();
  await page.keyboard.press('Enter');
  const frame = page.frameLocator('iframe[title="Fano Reactor"]');
  await frame.locator('#product-label').waitFor();
  return frame;
}

async function selectCurvature(page, baseUrl) {
  const url = baseUrl + 'test-preferences';
  await page.route(url, route => route.fulfill({ contentType: 'text/html', body: '<title>Preferences</title>' }));
  await page.goto(url);
  await page.evaluate(() => new Promise((resolve, reject) => {
    const open = indexedDB.open('peercompute-demo-atlas', 1);
    open.onupgradeneeded = () => open.result.createObjectStore('desktop');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const transaction = db.transaction('desktop', 'readwrite');
      transaction.objectStore('desktop').put({ wallpaper: 'plain', shaders: ['crt'],
        shaderDefaultsVersion: 2, shaderTuning: { crt: { curve: 0.25, vignette: 0 } } }, 'settings');
      transaction.oncomplete = () => { db.close(); resolve(); };
      transaction.onerror = () => reject(transaction.error);
    };
  }));
}

test('a line inside the real Fano iframe bends across the desktop and its displayed control receives native input', async t => {
  const server = await createPagesServer({
    docsRoot: fileURLToPath(new URL('../../docs/', import.meta.url)), ...ensureDevHttpsCert(),
  });
  t.after(() => server.close());
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined,
    args: ['--enable-unsafe-swiftshader'] });
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 1200, height: 820 }, ignoreHTTPSErrors: true });
  await selectCurvature(page, server.baseUrl);
  const frame = await launchFano(page, server.baseUrl);
  const supported = await page.evaluate(() => 'drawElementImage' in CanvasRenderingContext2D.prototype);
  if (!supported) {
    assert.equal(await page.locator('.pc-demo-stage').getAttribute('data-presentation'), 'native');
    return; // Installed browser exercises the ordinary iframe path.
  }
  await page.waitForSelector('.pc-demo-stage[data-presentation="shader"]', { state: 'attached' });
  await frame.locator('body').evaluate(body => {
    const stripe = document.createElement('div');
    stripe.style.cssText = 'position:fixed;top:10%;left:7%;right:7%;height:4px;background:lime;z-index:999999';
    const button = document.createElement('button');
    button.style.cssText = 'position:fixed;top:58%;left:12%;width:14px;height:14px;min-width:0;min-height:0;padding:0;border:0;background:magenta;z-index:999999';
    button.onclick = event => button.dataset.clicked = String(event.isTrusted);
    button.id = 'painted-target';
    body.append(stripe, button);
  });
  // Read the presented pixels, including curvature. DOM bounds only describe
  // the rectangular input surface and would mask the original regression.
  await page.waitForFunction(() => {
    const capture = document.querySelector('.pc-demo-capture');
    if (!capture) return false;
    const c = capture.getContext('2d');
    const p = c.getImageData(Math.round(capture.width * .5), 0, 1, capture.height).data;
    return p.some((value, i) => i % 4 === 1 && value === 255 && !p[i-1] && !p[i+1]);
  });
  const markers = await page.evaluate(async encoded => {
    const bytes = Uint8Array.from(atob(encoded), ch => ch.charCodeAt(0));
    const image = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    const context = new OffscreenCanvas(image.width, image.height).getContext('2d');
    context.drawImage(image, 0, 0);
    const screenshot = context.getImageData(0, 0, image.width, image.height);
    image.close();
    const stripeRows = [], target = [];
    for (let x = 0; x < screenshot.width; x++) {
      const rows = [];
      for (let y = 80; y < screenshot.height - 25; y++) {
        const i = (y * screenshot.width + x) * 4;
        const r = screenshot.data[i], g = screenshot.data[i + 1], b = screenshot.data[i + 2];
        if (g > 150 && r < 20 && b < 20) rows.push(y);
        if (r > 150 && g < 20 && b > 150) target.push({ x, y });
      }
      if (rows.length >= 2) stripeRows.push(rows[Math.floor(rows.length / 2)]);
    }
    return { stripeRows, target };
  }, (await page.screenshot()).toString('base64'));
  const { stripeRows, target } = markers;
  assert.ok(stripeRows.length > 500, 'the embedded document painted its green stripe');
  assert.ok(Math.max(...stripeRows) - Math.min(...stripeRows) > 7, 'the stripe follows the desktop barrel distortion');
  assert.ok(target.length > 80, 'the live button is visible');
  const center = axis => target.reduce((sum, pixel) => sum + pixel[axis], 0) / target.length;
  await page.mouse.click(center('x'), center('y'));
  assert.equal(await frame.locator('#painted-target').getAttribute('data-clicked'), 'true');
});

test('browsers without drawable HTML keep the real iframe and its native controls', async t => {
  const server = await createPagesServer({
    docsRoot: fileURLToPath(new URL('../../docs/', import.meta.url)), ...ensureDevHttpsCert(),
  });
  t.after(() => server.close());
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined });
  t.after(() => browser.close());
  const page = await browser.newPage({ ignoreHTTPSErrors: true });
  await page.addInitScript(() => { delete CanvasRenderingContext2D.prototype.drawElementImage; });
  const frame = await launchFano(page, server.baseUrl);
  assert.equal(await page.locator('.pc-demo-stage').getAttribute('data-presentation'), 'native');
  assert.equal(await page.locator('.pc-demo-capture').count(), 0);
  await frame.getByRole('button', { name: 'fano-map', exact: true }).click();
  assert.ok(await frame.locator('[data-mode-panel="fano-map"]').isVisible());
});
