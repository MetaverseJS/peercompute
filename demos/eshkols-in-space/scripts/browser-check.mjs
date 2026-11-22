import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { preview } from 'vite';

const configFile = fileURLToPath(new URL('../vite.config.js', import.meta.url));
// Use the production bundle in docs/eshkols-in-space, an ephemeral loopback port, and a fresh browser profile.
const server = await preview({ configFile, preview: { port: 0, host: '127.0.0.1', https: false } });
const url = 'http://127.0.0.1:' + server.httpServer.address().port;
let browser;
try {
  const args = ['--enable-unsafe-webgpu'];
  const headed = process.env.HEADED === '1';
  const vulkan = process.env.VULKAN_GPU === '1';
  const software = process.env.SOFTWARE_GPU === '1' || (process.platform === 'linux' && !headed && !vulkan);
  if (software) {
    args.push('--use-angle=swiftshader', '--enable-unsafe-swiftshader');
    if (process.platform === 'linux') args.push('--enable-features=Vulkan', '--use-vulkan=swiftshader', '--disable-vulkan-surface');
  } else if (vulkan) {
    args.push('--enable-gpu', '--enable-features=Vulkan,VulkanFromANGLE', '--use-angle=vulkan', '--use-vulkan=native', '--disable-vulkan-surface');
  }
  const executablePath = process.env.CHROME_BIN || process.env.CHROME_PATH || undefined;
  browser = await chromium.launch({
    channel: executablePath ? undefined : 'chrome',
    executablePath,
    headless: !headed,
    args
  });
  const width = Number(process.env.VIEWPORT_WIDTH || 1280);
  const height = Number(process.env.VIEWPORT_HEIGHT || 800);
  const page = await browser.newPage({ viewport: { width, height } });
  page.setDefaultTimeout(30000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' || /validation error|invalid shader|is invalid\b/i.test(message.text())) errors.push(message.text());
  });
  await page.goto(url);
  await page.waitForFunction(() => document.querySelector('#status').dataset.state === 'error' || Number(document.querySelector('#steps-meter').textContent) > 0);
  assert.equal(await page.locator('#status').textContent(), 'Running', await page.locator('#notice').textContent());
  const diag = await page.evaluate(() => window.__eshkolsInSpace?.getState?.());
  assert.equal(diag?.ready, true, 'Expected window.__eshkolsInSpace diagnostic handle to report ready');
  assert.equal(diag?.activeCount, 2048);
  assert.equal(diag?.gravityMode, 'direct');
  console.log('WebGPU adapter:', await page.locator('#engine').getAttribute('title'));
  await page.click('#play');
  await page.waitForFunction(() => !document.querySelector('#step').disabled);
  const steps = () => page.locator('#steps-meter').textContent().then(s => Number(s.replaceAll(',', '')));
  const beforeStep = await steps();
  await page.click('#step');
  await page.waitForFunction(n => Number(document.querySelector('#steps-meter').textContent.replaceAll(',', '')) === n + 1, beforeStep);
  await page.click('#restart');
  await page.waitForFunction(() => document.querySelector('#status').textContent === 'Paused' && document.querySelector('#steps-meter').textContent === '0');
  const scene = page.locator('#scene');
  const box = await scene.boundingBox();
  // Sample the actual WebGPU frame, including on headless compositors that
  // omit GPU swapchains from DevTools screenshots. Only the test reads it back.
  const readFrame = threshold => page.evaluate(threshold => new Promise((resolve, reject) => {
    requestAnimationFrame(() => sample().then(resolve, reject));
    async function sample() {
      const context = document.querySelector('#scene').getContext('webgpu');
      const texture = context.getCurrentTexture();
      const device = context.getConfiguration().device;
      const w = 256, h = 160;
      const buffer = device.createBuffer({ size: w * h * 4, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
      try {
        const encoder = device.createCommandEncoder();
        const origin = { x: Math.floor((texture.width - w) / 2), y: Math.floor((texture.height - h) / 2) };
        encoder.copyTextureToBuffer({ texture, origin }, { buffer, bytesPerRow: w * 4 }, { width: w, height: h });
        device.queue.submit([encoder.finish()]);
        await buffer.mapAsync(GPUMapMode.READ);
        const pixels = new Uint8Array(buffer.getMappedRange());
        let bright = 0, hash = 2166136261;
        for (let i = 0; i < pixels.length; i += 4) {
          const v = Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
          if (v > threshold) bright++;
          hash = Math.imul(hash ^ v, 16777619);
        }
        buffer.unmap();
        return { bright, hash };
      } finally { buffer.destroy(); }
    }
  }), threshold);
  async function sampleFrame(threshold = 115) {
    // Presentation can recycle the swapchain texture on a frame where a slow
    // GPU is still finishing the previous draw. Wait for a rendered texture.
    for (let i = 0; i < 50; i++) {
      const frame = await readFrame(threshold);
      if (frame.bright > 150) return frame;
    }
    throw new Error('No stars in the center of the WebGPU viewport. ' + errors.join('\n'));
  }
  const first = await sampleFrame();
  const lit = first.bright;
  assert(lit > 150, 'Expected visible stars in the rendered image. Errors: ' + errors.join('\n'));
  if (process.env.SCREENSHOT_PATH) await page.screenshot({ path: process.env.SCREENSHOT_PATH });
  await page.locator('#dt').press('End');
  await page.click('#step');
  await page.waitForFunction(() => document.querySelector('#steps-meter').textContent === '1');
  const moved = await sampleFrame();
  assert.notEqual(moved.hash, first.hash, 'A gravity step should change the rendered positions with the camera fixed');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down(); await page.mouse.move(box.x + box.width * .64, box.y + box.height * .57, { steps: 8 }); await page.mouse.up();
  assert.notEqual((await sampleFrame()).hash, moved.hash, 'Orbit drag should change the paused image');
  const oldScale = await page.locator('#scale').innerHTML();
  await page.mouse.wheel(0, -500);
  await page.waitForFunction(old => document.querySelector('#scale').innerHTML !== old, oldScale);
  await page.click('#recenter');
  await page.click('#grid');
  assert.equal(await page.locator('#grid').getAttribute('aria-pressed'), 'false');
  await page.selectOption('#count', '128');
  await page.waitForFunction(() => document.querySelector('#body-meter').textContent === '128');
  for (const preset of ['binary', 'sphere']) {
    await page.selectOption('#preset', preset);
    await page.waitForFunction(() => document.querySelector('#status').textContent === 'Paused');
    assert.equal(await page.locator('#formation').textContent(), preset === 'binary' ? 'Binary clusters' : 'Globular cluster');
  }
  await page.selectOption('#distribution', 'heavy');
  await page.fill('#seed', '73');
  await page.locator('#seed').press('Tab');
  await page.locator('label[for=collisions]').click();
  assert(await page.locator('#collisions').isChecked());
  await page.locator('#dt').press('End');
  await page.click('#step');
  await page.waitForFunction(() => document.querySelector('#time-meter').textContent.trim() === '0.04 t');
  await page.click('#play');
  await page.waitForFunction(() => Number(document.querySelector('#steps-meter').textContent) > 1);
  await page.click('#play');
  await page.selectOption('#count', '16384');
  await page.waitForFunction(() => document.querySelector('#body-meter').textContent === '16,384' && !document.querySelector('#step').disabled);
  await page.click('#step');
  await page.waitForFunction(() => document.querySelector('#steps-meter').textContent === '1');
  const activeBodies = () => page.locator('#body-meter').textContent().then(s => Number(s.replaceAll(',', '')));
  assert.equal(await page.locator('#gravity-mode').textContent(), 'Direct pairs');
  const remaining = await activeBodies();
  assert(remaining > 0 && remaining < 16384, 'Overlapping bodies should have merged');
  console.log('Direct solver, active bodies after one step:', remaining);
  assert.equal(await page.locator('#count option[value="2000000"]').textContent(), '2,000,000');
  const scaleCount = vulkan || process.env.LARGE_RUN === '1' ? 2000000 : 65536;
  await page.selectOption('#count', String(scaleCount));
  await page.waitForFunction(count => Number(document.querySelector('#body-meter').textContent.replaceAll(',', '')) === count
    && !document.querySelector('#step').disabled, scaleCount, { timeout: 120000 });
  assert.equal(await page.locator('#gravity-mode').textContent(), 'Barnes–Hut tree');
  await page.click('#step');
  await page.waitForFunction(() => document.querySelector('#steps-meter').textContent === '1',
    undefined, { timeout: 180000 });
  const largeRemaining = await activeBodies();
  assert(largeRemaining > 0 && largeRemaining < scaleCount, 'Expected sticky mergers in the tree-gravity run');
  const denseFrame = await sampleFrame(20);
  console.log('Tree solver:', scaleCount, 'slots,', largeRemaining, 'active,', denseFrame.bright, 'lit pixels,',
    await page.locator('#latency-meter').textContent());
  await page.click('#step');
  await page.waitForFunction(() => document.querySelector('#steps-meter').textContent === '2');
  const mergedAgain = await activeBodies();
  assert(mergedAgain > 0 && mergedAgain <= largeRemaining, 'Previously absorbed slots must stay empty');
  await page.locator('label[for=collisions]').click();
  await page.click('#step');
  await page.waitForFunction(() => document.querySelector('#steps-meter').textContent === '3');
  assert.equal(await activeBodies(), mergedAgain, 'Turning off mergers must preserve the active population');
  await page.click('#restart');
  await page.waitForFunction(count => Number(document.querySelector('#body-meter').textContent.replaceAll(',', '')) === count
    && document.querySelector('#steps-meter').textContent === '0', scaleCount, { timeout: 120000 });
  await page.setViewportSize({ width: 390, height: 750 });
  await page.click('#menu-toggle');
  assert(await page.locator('#preset').isVisible());
  await page.keyboard.press('Escape');
  assert(!await page.locator('#preset').isVisible());
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.deepEqual(errors, []);
  const unsupported = await browser.newPage();
  await unsupported.addInitScript(() => Object.defineProperty(navigator, 'gpu', { value: undefined }));
  await unsupported.goto(url);
  await unsupported.locator('#notice').waitFor();
  assert.match(await unsupported.locator('#notice').textContent(), /WebGPU is unavailable/);
  assert(await unsupported.locator('#play').isDisabled());
  console.log('Passed production browser checks, including ' + lit + ' bright scene pixels.');
} finally {
  try { await browser?.close(); }
  finally { await new Promise(resolve => server.httpServer.close(resolve)); }
}
