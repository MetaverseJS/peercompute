import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { chromium } from 'playwright';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';
import { createPagesServer } from './pages-runtime.mjs';

function assertFits(box, area) {
  assert.ok(box && area);
  assert.ok(box.width > 0 && box.height > 0);
  assert.ok(box.x >= area.x - 1 && box.x + box.width <= area.x + area.width + 1,
    'The whole diagram fits horizontally');
  assert.ok(box.y >= area.y - 1 && box.y + box.height <= area.y + area.height + 1,
    'The whole diagram fits vertically');
}

test('the standalone diagram fits, enlarges, pans and resets on desktop and touch', async t => {
  const server = process.env.PAGES_BASE_URL ? null : await createPagesServer({
    docsRoot: fileURLToPath(new URL('../../docs/', import.meta.url)), ...ensureDevHttpsCert(),
  });
  if (server) t.after(() => server.close());
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined });
  t.after(() => browser.close());

  for (const touch of [false, true]) {
    const viewport = touch ? { width: 390, height: 844 } : { width: 1200, height: 800 };
    const context = await browser.newContext({ viewport, hasTouch: touch, isMobile: touch, ignoreHTTPSErrors: true });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(new URL('guides/cubechat.html', process.env.PAGES_BASE_URL || server.baseUrl).href);
    const trigger = page.locator('figure .diagram').first();
    const inline = await trigger.locator('svg').boundingBox();
    assertFits(inline, await trigger.boundingBox());
    assert.ok(inline.width <= viewport.width && inline.height <= viewport.height);
    if (touch) await trigger.tap();
    else await trigger.click();

    const dialog = page.getByRole('dialog', { name: /diagram/i });
    const surface = dialog.getByLabel('Diagram viewport');
    const art = dialog.locator('svg');
    const area = await surface.boundingBox();
    const fit = await art.boundingBox();
    assertFits(fit, area);
    const center = { x: area.x + area.width / 2, y: area.y + area.height / 2 };

    let cdp;
    async function tapControl(control) {
      if (!cdp) return control.click();
      const box = await control.boundingBox();
      const point = { x: box.x + box.width / 2, y: box.y + box.height / 2, id: 1 };
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    }
    if (touch) {
      cdp = await context.newCDPSession(page);
      const points = gap => [
        { x: center.x - gap, y: center.y, id: 1 }, { x: center.x + gap, y: center.y, id: 2 },
      ];
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: points(35) });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: points(95) });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      assert.ok((await art.boundingBox()).width > fit.width * 1.3, 'Pinch enlarges the graph');
      const before = await art.boundingBox();
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...center, id: 1 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: center.x + 60, y: center.y, id: 1 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      assert.ok(Math.abs((await art.boundingBox()).x - before.x) > 10, 'One finger pans an enlarged graph');

    } else {
      await page.mouse.move(center.x, center.y);
      await page.mouse.wheel(0, -400);
      await page.waitForFunction(min => document.querySelector('.pc-diagram-art')?.getBoundingClientRect().width > min, fit.width * 1.05);
      await dialog.getByRole('button', { name: 'Zoom in' }).click();
      const before = await art.boundingBox();
      await page.mouse.move(center.x, center.y);
      await page.mouse.down();
      await page.mouse.move(center.x + 80, center.y + 40, { steps: 5 });
      await page.mouse.up();
      assert.ok(Math.abs((await art.boundingBox()).x - before.x) > 20, 'Drag pans the zoomed graph');
      await dialog.getByRole('button', { name: 'Zoom out' }).click();
      assert.ok((await art.boundingBox()).width < before.width, 'Zoom out reduces the graph');
    }

    const fitButton = dialog.getByRole('button', { name: 'Fit diagram' });
    await tapControl(fitButton);
    const reset = await art.boundingBox();
    assert.ok(Math.abs(reset.width - fit.width) <= 1 && Math.abs(reset.x - fit.x) <= 1);
    assertFits(reset, await surface.boundingBox());
    if (touch) await tapControl(dialog.getByRole('button', { name: 'Close' }));
    else await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert.ok(await trigger.evaluate(node => node === document.activeElement), 'Focus returns to the diagram');
    assert.deepEqual(errors, []);
    await cdp?.detach();
    await context.close();
  }
});
