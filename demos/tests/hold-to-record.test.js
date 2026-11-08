import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

let server, browser, origin;
before(async () => {
  const source = await readFile(new URL('../shared/inference/HoldToRecord.js', import.meta.url));
  server = createServer((req, res) => {
    res.setHeader('Content-Type', req.url === '/helper.js' ? 'text/javascript' : 'text/html');
    res.end(req.url === '/helper.js' ? source : `<!doctype html><meta name="viewport" content="width=device-width"><link rel="icon" href="data:,">
      <style>button{width:120px;height:60px;touch-action:none}iframe{display:block;width:300px;height:100px}</style>
      <button id="talk" type="button">Talk</button><input aria-label="Other input"><iframe srcdoc="<button>Frame button</button>"></iframe>
      <script type="module">
        import {bindHoldToRecord} from '/helper.js';
        window.events=[];const button=document.querySelector('#talk');
        window.binding=bindHoldToRecord({button,
          onStart:info=>{events.push({type:'start',kind:info.kind});if(window.resetOnStart)binding.reset();},
          onRelease:info=>events.push({type:'release',kind:info.kind}),
          onCancel:info=>events.push({type:'cancel',kind:info.kind,reason:info.reason})});
        window.ready=true;
      </script>`);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => { await browser?.close(); if (server) await new Promise((resolve) => server.close(resolve)); });

async function fixture(t, options = {}) {
  const context = await browser.newContext(options), page = await context.newPage(), errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  t.after(async () => { await context.close(); assert.deepEqual(errors, []); });
  await page.goto(origin); await page.waitForFunction(() => window.ready);
  return page;
}
async function down(page) {
  const box = await page.getByRole('button', { name: 'Talk', exact: true }).boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
}
const events = (page) => page.evaluate(() => window.events);

test('native pointer hold releases once outside the button and generated clicks never restart', async (t) => {
  const page = await fixture(t); await down(page);
  assert.deepEqual(await events(page), [{ type: 'start', kind: 'pointer' }]);
  assert.equal(await page.evaluate(() => talk.hasPointerCapture(binding.getState().pointerId)), true);
  await page.mouse.move(700, 400); await page.mouse.up();
  await page.evaluate(() => talk.click());
  assert.deepEqual(await events(page), [{ type: 'start', kind: 'pointer' }, { type: 'release', kind: 'pointer' }]);
  assert.equal(await page.evaluate(() => binding.getState()), null);
});

test('native Space and Enter hold ignores repeats and unmatched releases', async (t) => {
  const page = await fixture(t); await page.getByRole('button', { name: 'Talk' }).focus();
  for (const key of ['Space', 'Enter']) {
    await page.keyboard.down(key); await page.keyboard.down(key); await page.keyboard.up('Shift');
    assert.equal((await events(page)).at(-1).type, 'start');
    await page.keyboard.up(key);
  }
  assert.deepEqual(await events(page), [
    { type: 'start', kind: 'keyboard' }, { type: 'release', kind: 'keyboard' },
    { type: 'start', kind: 'keyboard' }, { type: 'release', kind: 'keyboard' },
  ]);
  assert.equal(await page.evaluate(() => scrollY), 0);
});

test('native secondary mouse and disabled button cannot start recording', async (t) => {
  const page = await fixture(t);
  await page.getByRole('button', { name: 'Talk' }).click({ button: 'right' });
  await page.evaluate(() => { talk.disabled = true; });
  await down(page); await page.mouse.up();
  assert.deepEqual(await events(page), []);
});

test('native two-finger touch keeps only the primary hold and touch cancel never sends', async (t) => {
  const page = await fixture(t, { hasTouch: true, viewport: { width: 390, height: 844 } });
  const cdp = await page.context().newCDPSession(page), point = (id, x) => ({ id, x, y: 35 });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(1, 30)] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(1, 30), point(2, 90)] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [point(2, 90)] });
  assert.deepEqual(await events(page), [{ type: 'start', kind: 'pointer' }]);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  assert.deepEqual(await events(page), [{ type: 'start', kind: 'pointer' }, { type: 'cancel', kind: 'pointer', reason: 'pointercancel' }]);
  await cdp.detach();
});

test('lost native pointer capture cancels once even when release follows', async (t) => {
  const page = await fixture(t); await down(page);
  // The next pointer event applies pending capture before we relinquish it.
  await page.mouse.move(80, 40);
  await page.evaluate(() => talk.releasePointerCapture(binding.getState().pointerId));
  await page.mouse.move(150, 50); await page.mouse.up();
  assert.deepEqual(await events(page), [{ type: 'start', kind: 'pointer' }, { type: 'cancel', kind: 'pointer', reason: 'lostpointercapture' }]);
});

test('focus transfer and native window blur cancel keyboard holds instead of submitting', async (t) => {
  const page = await fixture(t);
  await page.getByRole('button', { name: 'Talk' }).focus(); await page.keyboard.down('Space');
  await page.getByLabel('Other input').focus(); await page.keyboard.up('Space');
  await page.getByRole('button', { name: 'Talk' }).focus(); await page.keyboard.down('Enter');
  await page.frameLocator('iframe').getByRole('button', { name: 'Frame button' }).click(); await page.keyboard.up('Enter');
  assert.deepEqual(await events(page), [
    { type: 'start', kind: 'keyboard' }, { type: 'cancel', kind: 'keyboard', reason: 'blur' },
    { type: 'start', kind: 'keyboard' }, { type: 'cancel', kind: 'keyboard', reason: 'blur' },
  ]);
});

test('hidden-document notification cancels rather than sends and ignores a late release', async (t) => {
  const page = await fixture(t); await down(page);
  // Deterministic visibility notification; other tests exercise real native input.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.mouse.up();
  assert.deepEqual(await events(page), [{ type: 'start', kind: 'pointer' }, { type: 'cancel', kind: 'pointer', reason: 'hidden' }]);
});

test('reset on synchronous startup failure prevents late capture/release, disposal cancels exactly once', async (t) => {
  const page = await fixture(t);
  await page.evaluate(() => { window.resetOnStart = true; });
  await down(page); await page.mouse.up();
  assert.equal(await page.evaluate(() => binding.getState()), null);
  assert.deepEqual(await events(page), [{ type: 'start', kind: 'pointer' }]);
  await page.evaluate(() => { window.resetOnStart = false; });
  await down(page); await page.evaluate(() => { binding.dispose(); binding.dispose(); }); await page.mouse.up();
  await page.getByRole('button', { name: 'Talk' }).click();
  assert.deepEqual(await events(page), [
    { type: 'start', kind: 'pointer' }, { type: 'start', kind: 'pointer' }, { type: 'cancel', kind: 'pointer', reason: 'dispose' },
  ]);
});
