import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { chromium } from 'playwright';
import { createPagesServer } from './pages-runtime.mjs';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const checkout = process.env.EXOTUI_DIR || path.resolve(root, '../exotui');
const entry = await build({
  stdin: { contents: `
    import { BrowserCellCanvasSink } from 'exowebtui-cell-sink';
    import { createButterchurnPresenter } from './demos/gallery/butterchurn-presenter.js';
    window.testPainter = { BrowserCellCanvasSink, createButterchurnPresenter };
  `, resolveDir: root },
  bundle: true, platform: 'browser', write: false,
  alias: { 'exowebtui-cell-sink': path.join(checkout, 'src/web/cell_canvas_sink.ts') },
});
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN, args: ['--disable-gpu'] });
try {
  for (const ratio of [1, 1.25, 2]) {
    const page = await browser.newPage({ deviceScaleFactor: ratio });
    await page.addScriptTag({ content: entry.outputFiles[0].text });
    const result = await page.evaluate(() => {
      const { BrowserCellCanvasSink, createButterchurnPresenter } = testPainter;
      const options = { cellWidth: 9, cellHeight: 18, font: '14px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' };
      const canvas = () => document.createElement('canvas');
      const accelerated = canvas(), reference = canvas();
      const sink = new BrowserCellCanvasSink({ canvas: reference, ...options });
      const painter = createButterchurnPresenter({ element: accelerated, sink });
      const differences = [];
      for (const columns of [16, 9]) {
        const rows = 4;
        sink.resize(columns, rows);
        accelerated.width = reference.width;
        accelerated.height = reference.height;
        const chars = [...' ░▒▓█▀▍═╬Ag!»'];
        for (let frame = 0; frame < 4; frame++) {
          const cells = Array.from({ length: rows }, (_, y) => Array.from({ length: columns }, (_, x) => ({
            foreground: [220, 170 + y, 150], background: [12, 54, x % 2 ? 90 : 85],
            char: chars[(x + y + frame) % chars.length], bold: !!(x % 2),
          })));
          // Cover a wide owner and its styled empty continuation, including deletion.
          if (frame % 2 === 0) cells[0][2].char = '猫';
          cells[0][3].char = '';
          cells[0][3].background = cells[0][2].background;
          painter.present(cells);
          sink.flush(cells.flatMap((row, y) => row.map((cell, x) => ({
            column: x, row: y, value: '\x1b[38;2;' + cell.foreground.join(';') + 'm\x1b[48;2;' + cell.background.join(';')
              + 'm' + (cell.bold ? '\x1b[1m' : '') + cell.char,
          }))), {});
          const data = c => c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
          const a = data(accelerated), b = data(reference);
          let differing = 0, error = 0;
          for (let i = 0; i < a.length; i++) {
            const delta = Math.abs(a[i] - b[i]);
            error += delta;
            if (delta > 6) differing++;
          }
          differences.push({ columns, frame, mean: error / a.length, differing: differing / a.length });
        }
      }
      painter.dispose();
      return differences;
    });
    const worst = Math.max(...result.map(item => item.mean));
    console.log({ ratio, worst, share: Math.max(...result.map(item => item.differing)) });
    // Native alpha blending and separately composited antialiasing can round by one.
    assert.ok(worst < 1.2, JSON.stringify(result));
    await page.close();
  }
  const server = await createPagesServer({ docsRoot: path.join(root, 'docs'), ...ensureDevHttpsCert() });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 850 }, ignoreHTTPSErrors: true });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => Object.defineProperty(navigator, 'gpu', { value: undefined }));
    await page.route('**/desktop-butterchurn.js', route => route.fulfill({ contentType: 'text/javascript', body: `
      import { createButterchurnBackground as create } from './desktop-butterchurn.js?test-original';
      export function createButterchurnBackground(...args) {
        const field = globalThis.testField = create(...args);
        const dispose = field.dispose.bind(field);
        field.dispose = () => { globalThis.disposed = (globalThis.disposed ?? 0) + 1; dispose(); };
        return field;
      }
    ` }));
    await page.route('**/seed', route => route.fulfill({ contentType: 'text/html', body: 'Seed settings' }));
    await page.goto(server.baseUrl + 'seed');
    await page.evaluate(() => new Promise((resolve, reject) => {
      const open = indexedDB.open('peercompute-demo-atlas', 1);
      open.onupgradeneeded = () => open.result.createObjectStore('desktop');
      open.onerror = () => reject(open.error);
      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction('desktop', 'readwrite');
        tx.objectStore('desktop').put({ wallpaper: 'butterchurn', shaders: [] }, 'settings');
        tx.oncomplete = () => { db.close(); resolve(); };
      };
    }));
    await page.goto(server.baseUrl + '?prod=1');
    await page.waitForFunction(() => window.testField?.renderer === 'software' && __desktop.advances() > 3);
    async function clickLabel(label) {
      const point = await page.waitForFunction(label => {
        const { rows, columns } = __desktop.stats();
        for (let y = 0; y < rows; y++) {
          const x = __desktop.row(y).indexOf(label);
          if (x >= 0) return [(x + label.length / 2) * innerWidth / columns, (y + 0.5) * innerHeight / rows];
        }
      }, label);
      await page.mouse.click(...await point.jsonValue());
      await page.mouse.move(0, 0);
    }
    await clickLabel('[ Settings ]');
    await page.waitForFunction(() => __desktop.windows().some(w => w.id === 'settings' && w.active));
    await clickLabel('plain —');
    await page.waitForFunction(() => window.disposed === 1 && __desktop.field() === undefined);
    await page.waitForFunction(() => {
      // After the switch the native sink should have repainted exposed wallpaper.
      const canvas = document.querySelector('.desktop-surface canvas');
      const { columns, rows } = __desktop.stats();
      const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      let samples = 0, matches = 0;
      for (let y = 0; y < rows; y += 3) {
        for (let x = 0; x < columns; x += 3) {
          const cell = __desktop.cell(x, y);
          if (cell.char !== ' ' || !cell.background) continue;
          const idx = 4 * (Math.floor((y + 0.5) * canvas.height / rows) * canvas.width +
            Math.floor((x + 0.5) * canvas.width / columns));
          samples++;
          if (cell.background.every((channel, i) => pixels[idx + i] === channel)) matches++;
        }
      }
      return samples > 10 && matches / samples > 0.98;
    });
    const count = await page.evaluate(() => __desktop.advances());
    await page.waitForTimeout(150);
    assert.equal(await page.evaluate(() => __desktop.advances()), count);
    await page.setViewportSize({ width: 960, height: 740 });
    await page.waitForFunction(() => __desktop.stats().columns === Math.floor(innerWidth / 9));
    await clickLabel('dots —');
    await page.waitForFunction(() => Array.from({ length: __desktop.stats().rows }, (_, i) => __desktop.row(i)).some(row => row.includes('● dots')));
    assert.deepEqual(errors, []);
    await page.close();
  } finally {
    await server.close();
  }
} finally {
  await browser.close();
}
