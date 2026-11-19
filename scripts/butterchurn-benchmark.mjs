// Run against a gallery on localhost/HTTPS using an owned Chrome window.
// An optional built-assets directory makes A/B tests use the same page and CRT settings.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const [url, assets] = process.argv.slice(2);
if (!url) throw new Error('Usage: node scripts/butterchurn-benchmark.mjs <gallery-url> [built-assets-dir]');
const browser = await chromium.launch({
  headless: false,
  executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    const probe = globalThis.probe = { fresh: 0, changing: 0, uploads: 0, serial: -1, hash: -1 };
    let previousSerial = -1, previousHash = -1;
    const upload = WebGL2RenderingContext.prototype.texImage2D;
    WebGL2RenderingContext.prototype.texImage2D = function (...args) {
      const result = upload.apply(this, args);
      if (args.at(-1) instanceof HTMLCanvasElement && this.canvas.closest('.desktop-surface')) {
        probe.uploads++;
        if (probe.serial !== previousSerial) probe.fresh++;
        if (probe.hash !== previousHash) probe.changing++;
        previousSerial = probe.serial;
        previousHash = probe.hash;
      }
      return result;
    };
  });
  if (assets) {
    await page.route('**/exowebtui.js', route => route.fulfill({
      path: path.resolve(assets, 'exowebtui.js'), contentType: 'text/javascript',
    }));
  }
  await page.route('**/desktop-butterchurn.js*', async route => {
    if (new URL(route.request().url()).search === '?original') {
      if (assets) return route.fulfill({
        body: await readFile(path.resolve(assets, 'desktop-butterchurn.js')), contentType: 'text/javascript',
      });
      return route.continue();
    }
    await route.fulfill({ contentType: 'text/javascript', body: `
      import { createButterchurnBackground as create } from './desktop-butterchurn.js?original';
      export function createButterchurnBackground(...args) {
        const field = create(...args);
        globalThis.probe.field = field;
        const raster = field.rasterizeCells.bind(field);
        field.rasterizeCells = (...args) => {
          const rows = raster(...args);
          probe.serial = field.debugGpu()?.readbacks ?? -1;
          // Sample actual quantized wallpaper colors separately from completed copies.
          let hash = 0;
          for (let y = 0; y < rows.length; y += 2) {
            for (let x = y % 5; x < rows[y].length; x += 5) {
              const cell = rows[y][x];
              const rgb = cell?.foreground;
              const color = rgb ? (rgb[0] << 16) | (rgb[1] << 8) | rgb[2] : 0;
              hash = Math.imul(hash, 31) + color + (cell?.char.charCodeAt(0) || 0) | 0;
            }
          }
          probe.hash = hash;
          return rows;
        };
        return field;
      }
    ` });
  });
  const setup = new URL('benchmark-seed', url).href;
  await page.route(setup, route => route.fulfill({ contentType: 'text/html', body: '<title>Seed settings</title>' }));
  await page.goto(setup);
  await page.evaluate(() => new Promise((resolve, reject) => {
    const open = indexedDB.open('peercompute-demo-atlas', 1);
    open.onupgradeneeded = () => open.result.createObjectStore('desktop');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction('desktop', 'readwrite');
      tx.objectStore('desktop').put({ wallpaper: 'butterchurn', shaderDefaultsVersion: 2 }, 'settings');
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => reject(tx.error);
    };
  }));
  await page.goto(url);
  await page.waitForFunction(() => probe.field?.renderer === 'gpu' && probe.uploads > 0);
  console.log(JSON.stringify(await page.evaluate(async () => {
    const adapter = await navigator.gpu.requestAdapter();
    return {
      userAgent: navigator.userAgent, vendor: adapter.info.vendor, gpu: adapter.info.architecture,
      fallbackAdapter: adapter.info.isFallbackAdapter, resolution: [innerWidth, innerHeight], grid: __desktop.stats(),
    };
  })));
  for (const index of [0, 29, 133]) {
    await page.evaluate(i => probe.field.selectPreset(i), index);
    await page.waitForTimeout(1500);
    const result = await page.evaluate(async () => {
      const count = () => [probe.field.debugGpu().readbacks, probe.fresh, probe.changing, probe.uploads];
      const start = performance.now(), before = count();
      await new Promise(resolve => setTimeout(resolve, 5000));
      const after = count(), seconds = (performance.now() - start) / 1000;
      const [gpuReadbacksHz, newFieldsAtCrtHz, changingGridAtCrtHz, crtUploadsHz] = after.map((value, i) =>
        +((value - before[i]) / seconds).toFixed(1));
      return { preset: probe.field.presetName, renderer: probe.field.renderer, gpuReadbacksHz,
        newFieldsAtCrtHz, changingGridAtCrtHz, crtUploadsHz };
    });
    console.log(JSON.stringify(result));
    if (result.renderer !== 'gpu' || !result.crtUploadsHz || !result.newFieldsAtCrtHz) throw new Error('Inactive renderer');
  }
  if (errors.length) throw new Error(errors.join('\n'));
} finally {
  await browser.close();
}
