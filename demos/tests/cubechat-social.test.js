import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

let browser, server, origin, cache;
before(async () => {
  const repo = fileURLToPath(new URL('../../', import.meta.url));
  cache = await mkdtemp(join(tmpdir(), 'cubechat-social-'));
  server = await createServer({ configFile: false, root: repo, cacheDir: cache, logLevel: 'error',
    optimizeDeps: { noDiscovery: true, include: [] }, server: { host: '127.0.0.1', port: 0, hmr: false, fs: { allow: [repo] } },
    plugins: [{ name: 'social-fixture', configureServer(vite) {
      vite.middlewares.use('/__social', (_request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><div id="app"></div>');
      });
    } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => { await browser?.close(); await server?.close(); if (cache) await rm(cache, { recursive: true, force: true }); });
async function fixture(t, width = 1200) {
  const context = await browser.newContext({ viewport: { width, height: 844 } }), page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  t.after(async () => { await context.close(); assert.deepEqual(errors, []); });
  await page.goto(origin + '/__social');
  return page;
}

test('typed speech bubbles follow their speaker, retain only the latest text, expire and dispose resources', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const THREE = await import('/node_modules/three/build/three.module.js');
    const { SpeechBubbleLayer } = await import('/demos/shared/world/SpeechBubbleLayer.js');
    const scene = new THREE.Scene(), cube = new THREE.Object3D(); scene.add(cube);
    let now = 0, available = true;
    const layer = new SpeechBubbleLayer({ scene, getAnchor: key => available && key === 'alice' ? cube : null, now: () => now, durationMs: 100 });
    layer.show('alice', 'Hello from the keyboard');
    const first = layer.entries.get('alice').sprite;
    const events = [];
    first.material.addEventListener('dispose', () => events.push('material'));
    first.material.map.addEventListener('dispose', () => events.push('texture'));
    cube.position.set(11, 3, -9); layer.update();
    const position = first.position.toArray();
    layer.show('alice', '<img src=x onerror=alert(1)> is plain text');
    const latest = layer.entries.get('alice').sprite.userData.speech;
    const count = layer.group.children.length;
    available = false; layer.update(); const hidden = !layer.entries.get('alice').sprite.visible;
    now = 101; layer.update(); const expired = layer.entries.size;
    layer.show('alice', 'Another message'); layer.dispose();
    return { position, events, latest, count, hidden, expired, children: scene.children.length, closed: layer.closed };
  });
  assert.equal(result.position[0], 11); assert.equal(result.position[2], -9); assert.ok(result.position[1] > 9);
  assert.deepEqual(result.events.sort(), ['material', 'texture']);
  assert.equal(result.latest, '<img src=x onerror=alert(1)> is plain text');
  assert.equal(result.count, 1); assert.equal(result.hidden, true); assert.equal(result.expired, 0);
  assert.equal(result.children, 1); assert.equal(result.closed, true);
});

test('chat before an avatar snapshot remains bounded and becomes visible when its anchor arrives', async t => {
  const page = await fixture(t);
  assert.deepEqual(await page.evaluate(async () => {
    const THREE = await import('/node_modules/three/build/three.module.js');
    const { SpeechBubbleLayer } = await import('/demos/shared/world/SpeechBubbleLayer.js');
    const scene = new THREE.Scene(); let anchor;
    const layer = new SpeechBubbleLayer({ scene, maximum: 2, getAnchor: () => anchor });
    for (const key of ['old', 'next', 'newest']) layer.show(key, 'Text sent by a player');
    const keys = [...layer.entries.keys()], invisible = [...layer.entries.values()].every(entry => !entry.sprite.visible);
    anchor = [1, 3, 5]; layer.update();
    const visible = [...layer.entries.values()].every(entry => entry.sprite.visible && entry.sprite.position.x === 1);
    layer.dispose(); return { keys, invisible, visible };
  }), { keys: ['next', 'newest'], invisible: true, visible: true });
});

test('overhead excerpts fit the default CubeChat camera on desktop and portrait screens', async t => {
  const page = await fixture(t);
  const results = await page.evaluate(async () => {
    const THREE = await import('/node_modules/three/build/three.module.js');
    const { SpeechBubbleLayer } = await import('/demos/shared/world/SpeechBubbleLayer.js');
    return [1440 / 1000, 390 / 844].map(aspect => {
      const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
      camera.position.set(0, 13, 15); camera.lookAt(0, 3, 0); camera.updateMatrixWorld();
      const layer = new SpeechBubbleLayer({ scene, camera, getAnchor: () => [0, 3, 0] });
      layer.show('player', 'A long keyboard message that should remain readable above the cube. '.repeat(10));
      const { sprite } = layer.entries.get('player');
      const corners = [-1, 1].flatMap(x => [-1, 1].map(y => new THREE.Vector3(x * sprite.scale.x / 2, y * sprite.scale.y / 2, 0)
        .applyQuaternion(camera.quaternion).add(sprite.position).project(camera).toArray()));
      const result = { visible: sprite.visible, corners, lines: sprite.material.map.image.height,
        aboveName: sprite.position.y - sprite.scale.y / 2 > 3 + 4.5 + 1,
        overlaysBodies: !sprite.material.depthTest && !sprite.material.depthWrite && sprite.renderOrder > 0 };
      layer.dispose(); return result;
    });
  });
  for (const result of results) {
    assert.equal(result.visible, true); assert.equal(result.aboveName, true);
    assert.equal(result.overlaysBodies, true);
    assert.ok(result.lines <= 184);
    for (const corner of result.corners) assert.ok(Math.abs(corner[0]) < 1 && Math.abs(corner[1]) < 1, JSON.stringify(corner));
  }
});

for (const width of [390, 1200]) test(`focused settings windows preserve native focus and fit ${width}px`, async t => {
  const page = await fixture(t, width);
  await page.evaluate(async () => {
    await import('/demos/cubechat/src/style.css');
    const { cubeShell, createCubeSettingsUi } = await import('/demos/cubechat/src/ui/CubeSettingsUi.js');
    document.querySelector('#app').innerHTML = cubeShell; document.querySelector('#loading').remove();
    window.releases = 0; window.actions = [];
    window.settings = createCubeSettingsUi({ beforeOpen: () => releases++, onResidents: () => actions.push('residents'), onModels: () => actions.push('models') });
  });
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Player & controls', exact: true }).click();
  const player = page.getByRole('dialog', { name: 'Player & controls', exact: true });
  assert.equal(await page.locator('dialog[open]').count(), 1);
  await player.getByLabel('Name', { exact: true }).fill('A named player');
  assert.equal(await player.getByLabel('Name', { exact: true }).inputValue(), 'A named player');
  const bounds = await player.boundingBox(); assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width);
  await page.keyboard.press('Escape'); assert.equal(await page.locator('dialog[open]').count(), 0);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'World & rooms', exact: true }).click();
  assert.equal(await page.getByRole('dialog', { name: 'World & rooms', exact: true }).isVisible(), true);
  assert.equal(await page.getByLabel('Mass', { exact: true }).isVisible(), false);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Residents', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => actions), ['residents']);
  assert.ok(await page.evaluate(() => releases >= 5));
  await page.evaluate(() => settings.dispose());
});
