import assert from 'node:assert/strict';
import test, { after, before } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { usesTouchControls } from '../cubechat/src/controls/input.js';

let server, browser, origin, cacheDir;
before(async () => {
  const repo = fileURLToPath(new URL('../../', import.meta.url));
  cacheDir = await mkdtemp(join(tmpdir(), 'peercompute-cubechat-input-'));
  server = await createServer({ configFile: false, root: repo, cacheDir, logLevel: 'error',
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { host: '127.0.0.1', port: 0, hmr: false, fs: { allow: [repo] } },
    plugins: [{ name: 'cubechat-input-fixture', configureServer(vite) {
      vite.middlewares.use('/__cubechat_input', (_request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.end(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">
          <style>body{margin:0;min-height:2200px}#world{display:block;width:100%;height:700px;touch-action:none}
          #editors{position:fixed;top:20px;right:20px;z-index:2000;width:300px;background:white}
          input,textarea,select,[contenteditable]{display:block;width:250px;margin:8px}</style>
          <div id="scene-container"><canvas id="world" width="900" height="700" tabindex="0" aria-label="World"></canvas></div>
          <section id="editors"><input aria-label="Name"><textarea aria-label="Model prompt"></textarea>
          <select aria-label="Setting"><option>First</option><option>Second</option></select>
          <div contenteditable="true" aria-label="Rich prompt"><span>Editable text</span></div>
          <button id="action">Action</button></section>`);
      });
    } }] });
  await server.listen();
  origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome',
    headless: true, args: ['--disable-gpu'] });
});
after(async () => {
  const results = await Promise.allSettled([browser?.close(), server?.close()]);
  if (cacheDir) await rm(cacheDir, { recursive: true, force: true });
  for (const result of results) if (result.status === 'rejected') throw result.reason;
});

async function fixture(t, { touch = false } = {}) {
  const context = await browser.newContext({ viewport: { width: 900, height: 700 }, hasTouch: touch, isMobile: false });
  const page = await context.newPage();
  const errors = [], externalRequests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    externalRequests.push(route.request().url());
    return route.abort();
  });
  t.after(async () => {
    await context.close();
    assert.deepEqual(errors, [], 'the controller fixture must have no page errors');
    assert.deepEqual(externalRequests, [], 'the controller fixture must not contact peers or model hosts');
  });
  await page.goto(`${origin}/__cubechat_input`);
  await page.evaluate(async () => {
    const { PlayerController, usesTouchControls } = await import('/demos/cubechat/src/controls/input.js');
    window.controller = new PlayerController();
    window.observedInput = [];
    window.actionClicks = 0;
    const world = document.querySelector('#world');
    // Exercise the exported modality seam with native pointer events; full app startup is covered separately.
    world.addEventListener('pointerdown', (event) => {
      observedInput.push({ type: event.type, pointerType: event.pointerType, trusted: event.isTrusted });
      controller.setMobileMode(usesTouchControls(event, matchMedia('(pointer: coarse)').matches));
    });
    document.addEventListener('keydown', (event) => observedInput.push({ type: event.type, key: event.key, trusted: event.isTrusted }), true);
    document.addEventListener('touchstart', (event) => observedInput.push({ type: event.type, trusted: event.isTrusted }), true);
    window.addEventListener('wheel', (event) => observedInput.push({ type: event.type, trusted: event.isTrusted,
      target: event.target.id, prevented: event.defaultPrevented }));
    document.querySelector('#action').onclick = () => actionClicks++;
  });
  return page;
}

const movement = (page) => page.evaluate(() => controller.getMovementInput());
async function touchDriver(page) {
  const session = await page.context().newCDPSession(page);
  return {
    start: (x, y, id = 1) => session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id }] }),
    move: (x, y, id = 1) => session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y, id }] }),
    end: () => session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }),
    cancel: () => session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] }),
  };
}
async function joystickCenter(page, side = 'left') {
  return page.evaluate((side) => {
    const rect = controller.joystickElements[side].getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  }, side);
}

test('actual pointer and keyboard modality override coarse fallback, while legacy touch remains supported', () => {
  for (const [event, fallback, expected] of [
    [{ type: 'pointerdown', pointerType: 'mouse' }, true, false],
    [{ type: 'pointerdown', pointerType: 'pen' }, true, false],
    [{ type: 'pointerdown', pointerType: 'touch' }, false, true],
    [{ type: 'keydown', key: 'Enter' }, true, false],
    [{ type: 'touchend' }, false, true],
    [{ type: 'click', sourceCapabilities: { firesTouchEvents: true } }, false, true],
    [{ type: 'click', sourceCapabilities: { firesTouchEvents: false } }, true, false],
    [{ type: 'click' }, true, true],
    [{ type: 'click' }, false, false],
    [undefined, true, true],
  ]) assert.equal(usesTouchControls(event, fallback), expected, JSON.stringify(event));
});

test('native gameplay keys move and turn on a coarse desktop without scrolling the document', async (t) => {
  const page = await fixture(t, { touch: true });
  assert.equal(await page.evaluate(() => matchMedia('(pointer: coarse)').matches), true);
  await page.locator('#world').click({ position: { x: 300, y: 300 } });
  assert.equal(await page.evaluate(() => controller.isMobile), false);
  for (const [key, expected] of [
    ['w', { forward: 1, strafe: 0 }], ['s', { forward: -1, strafe: 0 }],
    ['a', { forward: 0, strafe: -1 }], ['d', { forward: 0, strafe: 1 }],
    ['ArrowUp', { forward: 1, strafe: 0 }], ['ArrowDown', { forward: -1, strafe: 0 }],
  ]) {
    await page.keyboard.down(key);
    assert.deepEqual(await movement(page), expected);
    await page.keyboard.up(key);
    assert.deepEqual(await movement(page), { forward: 0, strafe: 0 });
  }
  for (const key of ['q', 'e', 'ArrowLeft', 'ArrowRight']) {
    await page.keyboard.down(key);
    assert.equal(await page.evaluate((key) => controller.keys[key.toLowerCase()], key), true);
    await page.keyboard.up(key);
  }
  await page.keyboard.press('Space');
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  assert.equal(await page.evaluate(() => scrollY), 0);
  assert.equal(await page.evaluate(() => observedInput.filter((event) => event.type === 'keydown').every((event) => event.trusted)), true);
});

test('native touch movement, look and jump work; keyboard switches HUD off and neutralizes touch state', async (t) => {
  const page = await fixture(t, { touch: true });
  await page.touchscreen.tap(300, 300);
  assert.equal(await page.evaluate(() => controller.isMobile), true);
  const touch = await touchDriver(page);
  const center = await joystickCenter(page);
  await touch.start(center.x, center.y);
  await touch.move(center.x + 30, center.y - 30);
  const moving = await movement(page);
  assert.ok(moving.forward > 0.3 && moving.strafe > 0.3, JSON.stringify(moving));
  await touch.end();
  assert.deepEqual(await movement(page), { forward: 0, strafe: 0 });
  const look = await joystickCenter(page, 'right');
  await touch.start(look.x, look.y);
  await touch.move(look.x + 30, look.y + 20);
  assert.ok(await page.evaluate(() => controller.lookJoystick.x > 0 && controller.lookJoystick.y > 0));
  await touch.cancel();
  assert.deepEqual(await page.evaluate(() => controller.lookJoystick), { x: 0, y: 0 });
  await page.locator('.jump-button').tap();
  assert.equal(await page.evaluate(() => controller.jumpTriggered), true);
  await page.keyboard.down('w');
  assert.deepEqual(await page.evaluate(() => ({ mobile: controller.isMobile, jump: controller.jumpTriggered,
    hidden: controller.mobileControls.hidden, move: controller.getMovementInput() })),
  { mobile: false, jump: false, hidden: true, move: { forward: 1, strafe: 0 } });
  await page.keyboard.up('w');
  assert.equal(await page.evaluate(() => observedInput.filter((event) => event.type === 'touchstart').every((event) => event.trusted)), true);
});

test('touch plus held keyboard movement is clamped, opposite directions cancel, and Space remains a single jump in touch mode', async (t) => {
  const page = await fixture(t, { touch: true });
  await page.locator('#world').focus();
  await page.keyboard.down('w');
  await page.keyboard.down('d');
  await page.evaluate(() => controller.setMobileMode(true));
  const touch = await touchDriver(page);
  const center = await joystickCenter(page);
  await touch.start(center.x, center.y);
  await touch.move(center.x + 40, center.y - 40);
  assert.deepEqual(await movement(page), { forward: 1, strafe: 1 });
  await touch.end();
  await page.keyboard.down('s'); await page.keyboard.down('a');
  assert.deepEqual(await movement(page), { forward: 0, strafe: 0 });
  for (const key of ['w', 'd', 's', 'a']) await page.keyboard.up(key);
  await page.keyboard.down('Space');
  await page.evaluate(() => controller.setMobileMode(true));
  assert.equal(await page.evaluate(() => controller.shouldJump()), true);
  assert.equal(await page.evaluate(() => controller.shouldJump()), false);
  await page.keyboard.down('Space');
  assert.equal(await page.evaluate(() => controller.shouldJump()), false);
  await page.keyboard.up('Space');
  assert.equal(await page.evaluate(() => controller.shouldJump()), false);
  await page.keyboard.down('Space');
  assert.equal(await page.evaluate(() => controller.shouldJump()), true);
  await page.keyboard.up('Space');
});

test('repeated HUD toggles reuse one controls tree and reset movement, look and jump', async (t) => {
  const page = await fixture(t, { touch: true });
  await page.evaluate(() => {
    controller.setMobileMode(true);
    window.firstControls = controller.mobileControls;
    for (let index = 0; index < 5; index++) controller.setMobileMode(true);
    controller.moveJoystick = { x: 1, y: -1 };
    controller.lookJoystick = { x: -1, y: 1 };
    controller.jumpTriggered = true;
    controller.setMobileMode(false);
  });
  assert.deepEqual(await page.evaluate(() => ({ count: document.querySelectorAll('#mobile-controls').length,
    hidden: firstControls.hidden, move: controller.moveJoystick, look: controller.lookJoystick, jump: controller.jumpTriggered })),
  { count: 1, hidden: true, move: { x: 0, y: 0 }, look: { x: 0, y: 0 }, jump: false });
  await page.evaluate(() => { for (let index = 0; index < 5; index++) { controller.setMobileMode(true); controller.setMobileMode(false); } controller.setMobileMode(true); });
  assert.deepEqual(await page.evaluate(() => ({ count: document.querySelectorAll('#mobile-controls').length,
    same: firstControls === controller.mobileControls, visible: !firstControls.hidden })), { count: 1, same: true, visible: true });
});

test('an old native touch cannot resume motion after a desktop-to-touch mode transition', async (t) => {
  const page = await fixture(t, { touch: true });
  await page.touchscreen.tap(300, 300);
  const touch = await touchDriver(page);
  const center = await joystickCenter(page);
  await touch.start(center.x, center.y);
  await touch.move(center.x, center.y - 35);
  assert.ok((await movement(page)).forward > 0.3);
  await page.evaluate(() => { controller.setMobileMode(false); controller.setMobileMode(true); });
  await touch.move(center.x, center.y - 45);
  assert.deepEqual(await movement(page), { forward: 0, strafe: 0 }, 'a previously captured finger must not restart a reset gesture');
  await touch.end();
  await touch.start(center.x, center.y, 2);
  await touch.move(center.x, center.y - 35, 2);
  assert.ok((await movement(page)).forward > 0.3, 'a fresh gesture still works');
  await touch.end();
});

test('blur releases a native joystick capture even if its finger never sends touchend', async (t) => {
  const page = await fixture(t, { touch: true });
  await page.touchscreen.tap(300, 300);
  const session = await page.context().newCDPSession(page);
  const center = await joystickCenter(page);
  const oldFinger = { x: 300, y: 350, id: 1 };
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...center, id: 1 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [oldFinger] });
  assert.notDeepEqual(await movement(page), { forward: 0, strafe: 0 });
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...oldFinger, y: 340 }] });
  assert.deepEqual(await movement(page), { forward: 0, strafe: 0 }, 'the old captured finger stays inactive after blur');
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [oldFinger, { ...center, id: 2 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [oldFinger, { x: center.x, y: center.y - 35, id: 2 }] });
  assert.ok((await movement(page)).forward > 0.3, 'a new finger can start immediately without the old touchend');
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  assert.deepEqual(await movement(page), { forward: 0, strafe: 0 });
});

test('native typing in editable fields neither moves the avatar nor switches touch controls', async (t) => {
  const page = await fixture(t, { touch: true });
  await page.evaluate(() => controller.setMobileMode(true));
  for (const selector of ['input', 'textarea', '[contenteditable]']) {
    await page.locator(selector).focus();
    await page.keyboard.type('wasd qe');
    assert.deepEqual(await movement(page), { forward: 0, strafe: 0 }, selector);
    assert.equal(await page.evaluate(() => controller.isMobile), true, selector);
  }
  await page.locator('select').focus();
  await page.keyboard.press('ArrowDown');
  assert.deepEqual(await movement(page), { forward: 0, strafe: 0 });
  assert.equal(await page.evaluate(() => controller.isMobile), true);
  await page.locator('#action').focus();
  await page.keyboard.press('Space');
  assert.equal(await page.evaluate(() => actionClicks), 1);
  assert.equal(await page.evaluate(() => controller.shouldJump()), false);
});

test('moving focus into an editor releases held keys and keyup remains effective inside the editor', async (t) => {
  const page = await fixture(t);
  await page.locator('#world').focus();
  await page.keyboard.down('w'); await page.keyboard.down('Space');
  assert.equal((await movement(page)).forward, 1);
  await page.locator('textarea').focus();
  assert.deepEqual(await movement(page), { forward: 0, strafe: 0 });
  assert.equal(await page.evaluate(() => controller.shouldJump()), false);
  // Keyup must clear even externally held/bot input while the release target is editable.
  await page.evaluate(() => { controller.keys.w = true; });
  await page.keyboard.up('w'); await page.keyboard.up('Space');
  assert.equal(await page.evaluate(() => controller.keys.w), false);
  await page.locator('#world').focus();
  assert.deepEqual(await movement(page), { forward: 0, strafe: 0 });
  await page.keyboard.down('w');
  assert.equal((await movement(page)).forward, 1);
  await page.keyboard.up('w');
});

test('native world wheel zooms without document scrolling and respects previously handled input', async (t) => {
  const page = await fixture(t);
  await page.mouse.move(200, 300);
  await page.mouse.wheel(0, 240);
  await page.waitForFunction(() => observedInput.some((event) => event.type === 'wheel'));
  assert.equal(await page.evaluate(() => controller.getZoom()), 1.1);
  assert.equal(await page.evaluate(() => scrollY), 0);
  assert.deepEqual(await page.evaluate(() => observedInput.filter((event) => event.type === 'wheel')),
    [{ type: 'wheel', trusted: true, target: 'world', prevented: true }]);
  await page.evaluate(() => document.querySelector('#world').addEventListener('wheel',
    (event) => event.preventDefault(), { once: true, passive: false }));
  await page.mouse.wheel(0, 240);
  await page.waitForFunction(() => observedInput.filter((event) => event.type === 'wheel').length === 2);
  assert.equal(await page.evaluate(() => controller.getZoom()), 1.1, 'another input owner may consume the wheel first');
});

test('native wheel scrolls modal image previews, editable fields and UI controls without camera zoom', async (t) => {
  const page = await fixture(t);
  await page.evaluate(() => {
    const modal = document.createElement('dialog'); modal.id = 'model-dialog';
    modal.style.cssText = 'width:400px;height:240px;overflow:auto';
    modal.innerHTML = '<canvas id="image-preview" width="300" height="180"></canvas><div style="height:1200px">Model rows</div>';
    document.body.append(modal); modal.showModal();
  });
  await page.locator('#image-preview').hover({ position: { x: 40, y: 40 } });
  await page.mouse.wheel(0, 220);
  await page.waitForFunction(() => document.querySelector('#model-dialog').scrollTop > 0);
  assert.equal(await page.evaluate(() => controller.getZoom()), 1);
  await page.evaluate(() => {
    document.querySelector('#model-dialog').close();
    const editor = document.querySelector('textarea');
    editor.style.height = '100px'; editor.value = 'Line of editable text\n'.repeat(80);
  });
  await page.locator('textarea').hover();
  await page.mouse.wheel(0, 220);
  await page.waitForFunction(() => document.querySelector('textarea').scrollTop > 0);
  await page.evaluate(() => {
    const ui = document.createElement('section'); ui.id = 'scrollable-ui';
    ui.style.cssText = 'position:fixed;left:40px;top:40px;width:300px;height:180px;overflow:auto;z-index:4000;background:white';
    ui.innerHTML = '<button id="ui-action">UI action</button><div style="height:1200px">Other controls</div>';
    document.body.append(ui);
  });
  await page.locator('#ui-action').hover();
  await page.mouse.wheel(0, 220);
  await page.waitForFunction(() => document.querySelector('#scrollable-ui').scrollTop > 0);
  assert.equal(await page.evaluate(() => controller.getZoom()), 1);
  assert.equal(await page.evaluate(() => observedInput.filter((event) => event.type === 'wheel')
    .every((event) => event.trusted && !event.prevented)), true);
});

test('native pointer-locked world wheel zooms and released UI wheel remains native', async (t) => {
  const page = await fixture(t);
  await page.evaluate(() => {
    const canvas = document.querySelector('#world');
    canvas.addEventListener('click', () => canvas.requestPointerLock(), { once: true });
  });
  await page.locator('#world').click({ position: { x: 200, y: 300 } });
  await page.waitForFunction(() => document.pointerLockElement?.id === 'world');
  await page.mouse.wheel(0, 240);
  await page.waitForFunction(() => controller.getZoom() === 1.1);
  await page.evaluate(() => document.exitPointerLock());
  await page.waitForFunction(() => document.pointerLockElement === null);
  await page.evaluate(() => {
    const editor = document.querySelector('textarea');
    editor.style.height = '100px'; editor.value = 'Line of editable text\n'.repeat(80);
  });
  await page.locator('textarea').hover();
  await page.mouse.wheel(0, 220);
  await page.waitForFunction(() => document.querySelector('textarea').scrollTop > 0);
  assert.equal(await page.evaluate(() => controller.getZoom()), 1.1);
  assert.deepEqual(await page.evaluate(() => observedInput.filter((event) => event.type === 'wheel')
    .map(({ trusted, prevented }) => ({ trusted, prevented }))),
  [{ trusted: true, prevented: true }, { trusted: true, prevented: false }]);
});

test('modified, composing and already-handled keyboard events do not capture gameplay input', async (t) => {
  const page = await fixture(t, { touch: true });
  await page.locator('#world').focus();
  await page.evaluate(() => controller.setMobileMode(true));
  for (const modifier of ['Control', 'Alt', 'Meta']) {
    await page.keyboard.down(modifier); await page.keyboard.down('w');
    assert.deepEqual(await movement(page), { forward: 0, strafe: 0 });
    assert.equal(await page.evaluate(() => controller.isMobile), true);
    await page.keyboard.up('w'); await page.keyboard.up(modifier);
  }
  await page.evaluate(() => {
    const world = document.querySelector('#world');
    world.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', isComposing: true, bubbles: true, cancelable: true }));
    const handled = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true });
    handled.preventDefault(); world.dispatchEvent(handled);
  });
  assert.deepEqual(await movement(page), { forward: 0, strafe: 0 });
  assert.equal(await page.evaluate(() => controller.isMobile), true);
});

test('blur and hidden-document lifecycle notifications clear held keyboard and touch state', async (t) => {
  const page = await fixture(t, { touch: true });
  for (const notification of ['blur', 'hidden']) {
    await page.locator('#world').focus();
    await page.keyboard.down('w'); await page.keyboard.down('Space');
    await page.evaluate(() => { controller.setMobileMode(true); controller.moveJoystick = { x: 1, y: -1 }; controller.lookJoystick = { x: 1, y: 1 }; controller.jumpTriggered = true; });
    // These browser lifecycle notifications are dispatched explicitly; input above remains native.
    await page.evaluate((notification) => {
      if (notification === 'blur') window.dispatchEvent(new Event('blur'));
      else {
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        try { document.dispatchEvent(new Event('visibilitychange')); }
        finally { delete document.hidden; }
      }
    }, notification);
    assert.deepEqual(await page.evaluate(() => ({ move: controller.getMovementInput(), look: controller.lookJoystick,
      jump: controller.shouldJump(), touchJump: controller.jumpTriggered })),
    { move: { forward: 0, strafe: 0 }, look: { x: 0, y: 0 }, jump: false, touchJump: false });
    await page.keyboard.up('w'); await page.keyboard.up('Space');
  }
});
