import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { chromium } from 'playwright';

test('scanline controls change live iframe pixels while preserving input and document state', async t => {
  const source = await readFile(new URL('../gallery/frame-effects.js', import.meta.url), 'utf8');
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined });
  t.after(() => browser.close());
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  // Separate origins ensure the effect works without reading the embedded document.
  await page.route('https://gallery.test/**', r => r.fulfill({ contentType: 'text/html', body:
    '<style>.pc-demo-stage,.pc-demo-surface,iframe{width:320px;height:160px;border:0}.pc-demo-surface{position:relative;overflow:hidden}</style><section class="pc-demo-stage"><div class="pc-demo-surface" data-pc-foreign><iframe src="https://demo.test/"></iframe></div></section>' }));
  await page.route('https://demo.test/**', r => r.fulfill({ contentType: 'text/html', body:
    '<body style="background:#9bbbad"><button onclick="this.textContent=\'Clicked\'">Press</button><input aria-label="Message">' }));
  await page.goto('https://gallery.test/');
  await page.evaluate(async source => {
    const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
    const { createFrameEffects } = await import(url);
    URL.revokeObjectURL(url);
    let enabled = [], strength = 0;
    const effects = createFrameEffects({ enabled: () => enabled, magnetism: () => 0.5,
      option: (id, key) => id === 'scanlines' ? (key === 'period' ? 4 : strength) : 0 });
    window.setScanlines = value => {
      enabled = value === null ? [] : ['scanlines']; strength = value ?? 0;
      effects.sync();
    };
  }, source);
  const patch = { clip: { x: 155, y: 80, width: 60, height: 36 } };
  await page.evaluate(() => setScanlines(null));
  const original = await page.screenshot(patch);
  await page.evaluate(() => setScanlines(.5));
  const filtered = await page.screenshot(patch);
  assert.equal(filtered.equals(original), false);
  const child = page.frameLocator('iframe');
  await child.getByRole('button', { name: 'Press' }).click();
  await child.getByLabel('Message').fill('still here');
  await page.evaluate(() => setScanlines(0));
  assert.deepEqual(await page.screenshot(patch), original);
  await page.evaluate(() => setScanlines(null));
  assert.deepEqual(await page.screenshot(patch), original);
  assert.equal(await child.getByLabel('Message').inputValue(), 'still here');
  assert.equal(await child.getByRole('button').textContent(), 'Clicked');
});
