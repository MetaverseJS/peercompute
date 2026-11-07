import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { normalizeCubeAgentPosition } from '../cubechat/src/agents/CubeAgentLayer.js';

let server, browser, origin, cache;
before(async () => {
  const repo = fileURLToPath(new URL('../../', import.meta.url));
  const fixtureModule = join(repo, 'demos/cubechat/src/agents/__test_fixture.js');
  cache = await mkdtemp(join(tmpdir(), 'peercompute-cube-agents-'));
  server = await createServer({ configFile: false, root: repo, cacheDir: cache, logLevel: 'error',
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { host: '127.0.0.1', port: 0, hmr: false, fs: { allow: [repo] } },
    plugins: [{ name: 'cube-agent-fixture', resolveId(id) {
      if (id === '/__cube_agent_fixture.js') return fixtureModule;
      if (id === '@peercompute') return '\0cube-agent-unstarted-kernel';
    },
      load(id) {
        if (id === '\0cube-agent-unstarted-kernel') return 'export class NodeKernel { constructor() { throw new Error("No network/model kernel is permitted in this controller fixture"); } }';
        if (id === fixtureModule) return `
        import * as THREE from 'three';
        import * as CANNON from 'cannon-es';
        import { CubeAgentLayer } from './CubeAgentLayer.js';
        export function start(options) {
          const canvas = document.querySelector('canvas');
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(60, 900 / 600, .1, 500);
          camera.position.set(0, 8, 30); camera.lookAt(0, 3, 0); camera.updateMatrixWorld();
          const floor = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial());
          floor.rotation.x = -Math.PI / 2; scene.add(floor);
          const humanPlayers = new Map([['real-peer', {}]]);
          const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) });
          const humanBody = new CANNON.Body({ mass: 1, position: new CANNON.Vec3(100, 3, 0), shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)) });
          world.addBody(humanBody);
          const physics = { world, bodies: new Map([['real-peer', humanBody]]) };
          const shell = { scene, camera, floor, renderer: { domElement: canvas }, players: humanPlayers, worldThemeId: 'tron' };
          window.selected = []; window.worldClicks = 0;
          canvas.addEventListener('click', () => worldClicks++);
          window.layer = new CubeAgentLayer({ scene: shell, physics, getPlayerPosition: () => ({ x: 0, y: 3, z: 20 }),
            onSelect: key => selected.push(key), ...options });
          Object.assign(window, { THREE, CANNON, shell, physics, humanBody });
          window.base = { key: 'local:agent-1', agentId: 'agent-1', ownerPeerId: 'owner-peer', name: 'Ada',
            color: '#4cd4a1', position: [0, 3, 0], status: 'idle', local: true };
          window.project = position => {
            camera.updateMatrixWorld(); const point = new THREE.Vector3(...position).project(camera), box = canvas.getBoundingClientRect();
            return { x: box.left + (point.x + 1) * box.width / 2, y: box.top + (1 - point.y) * box.height / 2 };
          };
        }`; },
      configureServer(vite) {
        vite.middlewares.use('/__cube_agents', (_request, response) => {
          response.setHeader('Content-Type', 'text/html');
          response.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}canvas{display:block;width:900px;height:600px;background:#071716;touch-action:none}</style><canvas width="900" height="600" aria-label="Agent scene"></canvas>');
        });
      } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => {
  const results = await Promise.allSettled([browser?.close(), server?.close()]);
  if (cache) await rm(cache, { recursive: true, force: true });
  for (const result of results) if (result.status === 'rejected') throw result.reason;
});

async function fixture(t, options = {}) {
  const context = await browser.newContext({ viewport: { width: 900, height: 700 }, hasTouch: true });
  const page = await context.newPage(), errors = [], requests = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    requests.push(route.request().url()); return route.abort();
  });
  t.after(async () => {
    await page.evaluate(() => layer?.dispose());
    await context.close();
    assert.deepEqual(errors, []); assert.deepEqual(requests, []);
  });
  await page.goto(origin + '/__cube_agents');
  await page.evaluate(async options => (await import('/__cube_agent_fixture.js')).start(options), options);
  return page;
}

test('agent positions are copied and bounded without accepting strings or nonfinite coordinates', () => {
  const position = [1, 2, 3], normalized = normalizeCubeAgentPosition(position);
  assert.deepEqual(normalized, position); assert.notEqual(normalized, position);
  for (const value of [null, {}, [1, 2], [1, 2, 3, 4], ['1', 2, 3], [NaN, 0, 0], [Infinity, 0, 0], [1_000_001, 0, 0]]) {
    assert.throws(() => normalizeCubeAgentPosition(value), /bounded coordinates/);
  }
});

test('agent cubes have distinct scene and static collision ownership while human peers remain untouched', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(() => {
    layer.upsert(base); layer.upsert({ ...base, key: 'remote-peer:agent-1', ownerPeerId: 'remote-peer', local: false, position: [12, 3, 0] });
    const first = layer.entries.get(base.key);
    layer.upsert({ ...base, name: 'Updated Ada', status: 'thinking', position: [2, 3, 1], color: '#ff8844' });
    return { size: layer.entries.size, children: layer.group.children.length, bodies: physics.world.bodies.length,
      static: first.body.type === CANNON.Body.STATIC, same: first === layer.entries.get(base.key),
      position: first.mesh.position.toArray(), collision: first.body.position.toArray(), color: first.mesh.material.color.getHexString(),
      intensity: first.mesh.material.emissiveIntensity, players: [...shell.players.keys()], bodyKeys: [...physics.bodies.keys()] };
  });
  assert.deepEqual(result, { size: 2, children: 2, bodies: 3, static: true, same: true, position: [2, 3, 1], collision: [2, 3, 1],
    color: 'ff8844', intensity: .4, players: ['real-peer'], bodyKeys: ['real-peer'] });
  assert.equal(await page.evaluate(() => {
    humanBody.position.set(2, 3, 12); humanBody.velocity.set(0, 0, -10); humanBody.linearDamping = 0;
    for (let index = 0; index < 120; index++) physics.world.step(1 / 60);
    return humanBody.position.z >= 4.8;
  }), true, 'the stationary agent is an actual Cannon collision body');
});

test('spawn positions use rendered floor height and avoid already placed agents', async t => {
  const page = await fixture(t);
  const positions = await page.evaluate(() => {
    shell.floor.position.y = 4;
    const first = layer.getSpawnPosition(); layer.upsert({ ...base, position: first });
    const second = layer.getSpawnPosition();
    return { first, second };
  });
  assert.ok(Math.abs(positions.first[1] - 7) < 1e-8); assert.ok(Math.abs(positions.second[1] - 7) < 1e-8);
  assert.ok(Math.hypot(positions.first[0] - positions.second[0], positions.first[2] - positions.second[2]) >= 9);
});

test('native mouse, touch and Enter select the raycast agent without invoking world pointer-lock clicks', async t => {
  const page = await fixture(t);
  await page.evaluate(() => layer.upsert(base));
  const point = await page.evaluate(() => project(base.position));
  await page.mouse.click(point.x, point.y);
  await page.touchscreen.tap(point.x, point.y);
  await page.locator('canvas').focus(); await page.keyboard.press('Enter');
  assert.deepEqual(await page.evaluate(() => selected), ['local:agent-1', 'local:agent-1', 'local:agent-1']);
  assert.equal(await page.evaluate(() => worldClicks), 0);
  assert.equal(await page.evaluate(() => layer.entries.get(base.key).outline.material.color.getHexString()), 'ffffff');
  await page.mouse.click(20, 20);
  assert.equal(await page.evaluate(() => worldClicks), 1, 'ordinary scene clicks remain available');
  await page.mouse.move(point.x - 30, point.y); await page.mouse.down(); await page.mouse.move(point.x, point.y); await page.mouse.up();
  assert.equal(await page.evaluate(() => selected.length), 3, 'dragging the view must not start a conversation');
});

test('labels render plain text into bounded canvases and caption expiry releases textures', async t => {
  const page = await fixture(t, { captionDurationMs: 1000 });
  await page.clock.install();
  const evidence = await page.evaluate(() => {
    layer.upsert({ ...base, name: '<img src=x onerror=alert(1)>', caption: 'A visible reply. '.repeat(100) });
    const entry = layer.entries.get(base.key), canvas = entry.label.material.map.image;
    const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    let brightPixels = 0; for (let i = 0; i < pixels.length; i += 4) if (pixels[i] > 180 && pixels[i + 1] > 180) brightPixels++;
    window.captionDisposed = 0;
    entry.caption.material.map.addEventListener('dispose', () => captionDisposed++);
    return { width: canvas.width, height: canvas.height, brightPixels, captionWidth: entry.caption.material.map.image.width,
      captionHeight: entry.caption.material.map.image.height, imageElements: document.querySelectorAll('img').length };
  });
  assert.equal(evidence.width, 768); assert.equal(evidence.height, 160); assert.ok(evidence.brightPixels > 300);
  assert.equal(evidence.captionWidth, 768); assert.equal(evidence.captionHeight, 320); assert.equal(evidence.imageElements, 0);
  await page.clock.runFor(1001);
  assert.deepEqual(await page.evaluate(() => ({ visible: Boolean(layer.entries.get(base.key).caption), disposed: captionDisposed })), { visible: false, disposed: 1 });
});

test('removed caption timers cannot erase a replacement entity and all owned resources dispose once', async t => {
  const page = await fixture(t, { captionDurationMs: 1000 });
  await page.clock.install();
  await page.evaluate(() => { layer.upsert({ ...base, caption: 'First' }); });
  await page.clock.runFor(600);
  await page.evaluate(() => {
    layer.remove(base.key); layer.upsert({ ...base, caption: 'Replacement' });
    window.disposedAssets = 0;
    const entry = layer.entries.get(base.key);
    for (const asset of [entry.mesh.material, entry.outline.material, entry.label.material, entry.label.material.map,
      entry.caption.material, entry.caption.material.map, layer.geometry, layer.edgeGeometry]) asset.addEventListener('dispose', () => disposedAssets++);
  });
  await page.clock.runFor(450);
  assert.equal(await page.evaluate(() => Boolean(layer.entries.get(base.key).caption)), true);
  await page.evaluate(() => { layer.dispose(); layer.dispose(); });
  await page.clock.runFor(2000);
  assert.deepEqual(await page.evaluate(() => ({ disposedAssets, entries: layer.entries.size, bodies: physics.world.bodies.length,
    human: physics.world.bodies.includes(humanBody), sceneGroups: shell.scene.children.includes(layer.group), tabIndex: document.querySelector('canvas').getAttribute('tabindex') })),
  { disposedAssets: 8, entries: 0, bodies: 1, human: true, sceneGroups: false, tabIndex: null });
  await page.mouse.click(450, 300);
  assert.equal(await page.evaluate(() => selected.length), 0, 'disposed picking cannot reopen conversations');
  assert.equal(await page.evaluate(() => worldClicks), 1);
});

test('invalid or excessive public descriptors fail before changing the existing body', async t => {
  const page = await fixture(t, { maximumAgents: 1 });
  const result = await page.evaluate(() => {
    layer.upsert(base); let rejected = 0;
    for (const input of [{ ...base, position: [0, NaN, 0] }, { ...base, name: 'x'.repeat(241) }, { ...base, color: 'javascript:red' },
      { ...base, status: 'executing-code' }, { ...base, local: 'true' }, { ...base, caption: 'x'.repeat(4097) },
      { ...base, key: 'another-agent' }]) { try { layer.upsert(input); } catch { rejected++; } }
    return { rejected, count: layer.entries.size, bodies: physics.world.bodies.length, position: layer.entries.get(base.key).mesh.position.toArray() };
  });
  assert.deepEqual(result, { rejected: 7, count: 1, bodies: 2, position: [0, 3, 0] });
});

test('a paused local agent can render a full-length name before the owner is connected', async t => {
  const page = await fixture(t);
  assert.deepEqual(await page.evaluate(() => {
    layer.upsert({ ...base, name: 'A'.repeat(240), ownerPeerId: '', status: 'paused' });
    const entry = layer.entries.get(base.key);
    return { status: entry.descriptor.status, nameLength: entry.descriptor.name.length, owner: entry.descriptor.ownerPeerId,
      intensity: entry.mesh.material.emissiveIntensity };
  }), { status: 'paused', nameLength: 240, owner: '', intensity: .12 });
});

test('audio listener follows the physical avatar while orbit-camera translation only changes the view', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(() => {
    layer.upsert(base);
    const context = layer.getContext(base);
    shell.camera.position.set(3, 9, 25); shell.camera.lookAt(0, 3, 0);
    const pose = layer.getAudioPose(base.key);
    shell.camera.position.set(300, 90, 250); shell.camera.updateMatrixWorld();
    const zoomed = layer.getAudioPose(base.key);
    layer.getPlayerPosition = () => [2, 3, 7];
    const moved = layer.getAudioPose(base.key);
    return { context, pose, zoomed, moved, missing: layer.getAudioPose('missing'), focusMissing: layer.focus('missing') };
  });
  assert.deepEqual(result.context, { demo: 'CubeChat', theme: 'tron', agent: { name: 'Ada', position: [0, 3, 0], status: 'idle' }, nearbyPlayers: 1 });
  assert.deepEqual(result.pose.source, [0, 5, 0]); assert.deepEqual(result.pose.listener, [0, 5, 20]);
  assert.deepEqual(result.zoomed.listener, result.pose.listener);
  assert.deepEqual(result.zoomed.source, result.pose.source);
  assert.deepEqual(result.moved.listener, [2, 5, 7]);
  assert.ok(Math.abs(Math.hypot(...result.pose.forward) - 1) < 1e-9);
  assert.ok(Math.abs(Math.hypot(...result.pose.up) - 1) < 1e-9);
  assert.equal(result.missing, null); assert.equal(result.focusMissing, false);
});

test('CubeChat network stop acknowledges its node shutdown before releasing media ownership', async t => {
  const page = await fixture(t);
  await page.evaluate(async () => {
    const { P2PNetwork } = await import('/demos/cubechat/src/p2p/network.js');
    window.network = new P2PNetwork(); window.lifecycle = [];
    network.node = { stop: () => new Promise(resolve => { window.acknowledgeShutdown = resolve; lifecycle.push('stopping'); }) };
    network.networkManager = { queueEvent: () => lifecycle.push('leave') };
    network.localStream = { getTracks: () => [{ stop: () => lifecycle.push('media-stop') }] };
    window.stopped = false;
    window.stopPromise = network.stop().then(() => { stopped = true; });
  });
  assert.deepEqual(await page.evaluate(() => ({ stopped, lifecycle, ownsNode: Boolean(network.node) })),
    { stopped: false, lifecycle: ['leave', 'stopping'], ownsNode: true });
  assert.deepEqual(await page.evaluate(async () => {
    acknowledgeShutdown(); await stopPromise;
    return { stopped, lifecycle, node: network.node, manager: network.networkManager };
  }), { stopped: true, lifecycle: ['leave', 'stopping', 'media-stop'], node: null, manager: null });
});

test('failed node cleanup rejects stop and preserves ownership for an acknowledged retry', async t => {
  const page = await fixture(t);
  assert.deepEqual(await page.evaluate(async () => {
    const { P2PNetwork } = await import('/demos/cubechat/src/p2p/network.js');
    const network = new P2PNetwork(); let calls = 0, mediaStopped = 0;
    network.node = { async stop() { if (++calls === 1) throw new Error('Cleanup pending'); } };
    network.localStream = { getTracks: () => [{ stop: () => mediaStopped++ }] };
    let error;
    try { await network.stop(); } catch (failure) { error = failure.message; }
    const retained = Boolean(network.node), stoppedAfterFailure = mediaStopped;
    await network.stop();
    return { error, retained, stoppedAfterFailure, calls, mediaStopped, node: network.node };
  }), { error: 'Cleanup pending', retained: true, stoppedAfterFailure: 0, calls: 2, mediaStopped: 1, node: null });
});
