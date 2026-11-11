import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

test('LoRA modal validates controls, wraps on mobile, cancels stale inspection and hands off an explicit load choice', async (t) => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome',
    headless: true, args: ['--disable-gpu'] });
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => route.fulfill({ contentType: 'text/html',
    body: '<!doctype html><html><body><section class="pc-inference-panel"><button id="opener">Add LoRA</button></section></body></html>' }));
  await page.goto('https://lora-fixture.invalid/');
  await page.addStyleTag({ content: await readFile(new URL('../src/panel.css', import.meta.url), 'utf8') });
  const source = await readFile(new URL('../src/ui/loraComposer.js', import.meta.url), 'utf8');
  await page.addScriptTag({ content: source.replace('export function createLoraComposer', 'window.createLoraComposer = function createLoraComposer') });
  await page.evaluate(() => {
    window.calls = []; window.closedCount = 0;
    window.result = { variants: [{ key: 'one', name: 'a-very-long-adapter-name-that-needs-to-wrap-on-a-small-phone-screen.gguf',
      repository: 'fixture/adapter', revision: 'a'.repeat(40), file: { size: 1024 ** 2 }, profile: { architecture: 'qwen2' } }] };
    window.dialog = createLoraComposer({ container: document.querySelector('section'),
      onInspect(reference, { signal }) {
        calls.push({ action: 'inspect', reference }); window.inspectSignal = signal;
        return new Promise((resolve) => { window.finishInspect = resolve; });
      },
      onApply(request) {
        calls.push({ action: 'apply', baseManifestCid: request.baseManifestCid, name: request.name, scale: request.scale, load: request.load });
        window.applySignal = request.signal;
        request.onProgress({ stage: 'import', loaded: 512 * 1024, totalBytes: 1024 ** 2 });
        return new Promise((resolve) => { window.finishApply = resolve; });
      }, onClose() { closedCount++; },
    });
    document.querySelector('#opener').focus(); dialog.open({ manifestCid: 'base-cid', name: 'Qwen test base' });
  });
  await page.getByLabel('Hugging Face adapter').fill('fixture/adapter');
  await page.getByRole('button', { name: 'Inspect', exact: true }).click();
  await page.evaluate(() => finishInspect(result));
  await page.getByRole('radio').waitFor();
  assert.equal(await page.getByLabel('Load after saving').isChecked(), true);
  assert.equal(await page.getByRole('button', { name: 'Save and load', exact: true }).isEnabled(), true);
  assert.equal(await page.locator('dialog').evaluate((element) => element.scrollWidth <= element.clientWidth), true);
  assert.equal(await page.locator('.pc-dialog-body').evaluate((element) => element.scrollWidth <= element.clientWidth), true);
  if (process.env.LORA_SCREENSHOT_DIR) {
    await mkdir(process.env.LORA_SCREENSHOT_DIR, { recursive: true });
    await page.screenshot({ path: `${process.env.LORA_SCREENSHOT_DIR}/lora-mobile.png` });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.screenshot({ path: `${process.env.LORA_SCREENSHOT_DIR}/lora-desktop.png` });
  }
  await page.getByLabel('Strength', { exact: true }).fill('3');
  assert.equal(await page.getByRole('button', { name: 'Save and load', exact: true }).isDisabled(), true);
  await page.getByLabel('Strength', { exact: true }).fill('0');
  await page.getByLabel('Load after saving').uncheck();
  await page.getByRole('button', { name: 'Save model', exact: true }).click();
  assert.match(await page.getByRole('status').textContent(), /0.5 MiB \/ 1.0 MiB/);
  assert.equal(await page.evaluate(() => calls.at(-1).scale), 0);
  assert.equal(await page.evaluate(() => calls.at(-1).load), false);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  assert.equal(await page.evaluate(() => applySignal.aborted), true);
  assert.equal(await page.evaluate(() => closedCount), 1);
  await page.evaluate(() => { dialog.open({ manifestCid: 'new-base', name: 'New base' }); finishApply(); });
  assert.equal(await page.locator('dialog').evaluate((element) => element.open), true, 'late prior completion does not close the reopened dialog');
  await page.getByLabel('Hugging Face adapter').fill('another/adapter');
  await page.getByRole('button', { name: 'Inspect', exact: true }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  assert.equal(await page.evaluate(() => inspectSignal.aborted), true);
  await page.evaluate(() => { dialog.open({ manifestCid: 'latest-base', name: 'Latest base' }); finishInspect(result); });
  assert.equal(await page.getByRole('radio').count(), 0, 'late inspection cannot repopulate another base');
  await page.getByLabel('Hugging Face adapter').fill('fixture/adapter');
  await page.getByRole('button', { name: 'Inspect', exact: true }).click();
  await page.evaluate(() => finishInspect(result));
  await page.getByRole('button', { name: 'Save and load', exact: true }).click();
  await page.evaluate(() => finishApply());
  await page.waitForFunction(() => !document.querySelector('dialog').open);
  assert.equal(await page.evaluate(() => calls.at(-1).baseManifestCid), 'latest-base');
  assert.equal(await page.evaluate(() => calls.at(-1).load), true);
  await page.evaluate(() => dialog.dispose());
  assert.equal(await page.locator('dialog').count(), 0);
  assert.deepEqual(errors, []);
});
