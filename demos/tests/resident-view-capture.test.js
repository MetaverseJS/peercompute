import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import * as THREE from 'three';
import { ResidentViewCapture } from '../shared/world/ResidentViewCapture.js';

function fakeRenderer() {
  let target = { original: true }, face = 2, mip = 1, viewport = new THREE.Vector4(3, 4, 50, 60), scissor = new THREE.Vector4(7, 8, 20, 30), scissorTest = true;
  const renderer = { isWebGLRenderer: true, xr: { enabled: true }, shadowMap: { autoUpdate: true, needsUpdate: true }, autoClear: true,
    getRenderTarget: () => target, getActiveCubeFace: () => face, getActiveMipmapLevel: () => mip,
    getViewport: value => value.copy(viewport), getScissor: value => value.copy(scissor), getScissorTest: () => scissorTest,
    setRenderTarget: (value, nextFace = 0, nextMip = 0) => { target = value; face = nextFace; mip = nextMip; },
    setViewport: (...args) => { viewport = args[0]?.isVector4 ? args[0].clone() : new THREE.Vector4(...args); },
    setScissor: value => { scissor = value.clone(); }, setScissorTest: value => { scissorTest = value; },
    clear() {}, render() {}, readRenderTargetPixelsAsync: async (_target, _x, _y, width, height, data) => {
      for (let row = 0; row < height; row++) data.fill(row, row * width * 4, (row + 1) * width * 4);
    } };
  renderer.snapshot = () => ({ target, face, mip, viewport: viewport.toArray(), scissor: scissor.toArray(), scissorTest,
    xr: renderer.xr.enabled, shadows: renderer.shadowMap.autoUpdate, shadowUpdate: renderer.shadowMap.needsUpdate, autoClear: renderer.autoClear });
  return renderer;
}
const pose = { position: [10, 5, 20], direction: [0, 0, 1] };

test('capture hides only temporary annotations/video/self geometry and restores renderer state before asynchronous readback', async () => {
  const renderer = fakeRenderer(), scene = new THREE.Scene(), original = renderer.snapshot();
  const self = new THREE.Group(), hidden = new THREE.Group(), label = new THREE.Sprite(); hidden.visible = false;
  scene.add(self, hidden, label);
  const video = new THREE.Texture(); video.isVideoTexture = true;
  const mediaMaterial = new THREE.MeshBasicMaterial({ map: video }), ordinary = new THREE.MeshBasicMaterial();
  const media = new THREE.Mesh(new THREE.BoxGeometry(), [ordinary, mediaMaterial]); scene.add(media);
  const originalMaterials = media.material;
  const capture = new ResidentViewCapture({ renderer, scene, width: 16, height: 16, now: () => 1000 });
  renderer.render = (_scene, camera) => {
    assert.equal(self.visible, false); assert.equal(hidden.visible, false); assert.equal(label.visible, false);
    assert.equal(media.material[0], ordinary); assert.equal(media.material[1], capture.videoMaterial);
    assert(camera.getWorldDirection(new THREE.Vector3()).distanceTo(new THREE.Vector3(0, 0, 1)) < 1e-12);
    assert.equal(renderer.xr.enabled, false); assert.equal(renderer.getScissorTest(), false);
    assert.equal(renderer.shadowMap.needsUpdate, false);
  };
  const read = renderer.readRenderTargetPixelsAsync;
  renderer.readRenderTargetPixelsAsync = async (...args) => {
    assert.deepEqual(renderer.snapshot(), original); assert.equal(media.material, originalMaterials);
    assert.equal(self.visible, true); assert.equal(hidden.visible, false); assert.equal(label.visible, true);
    await read(...args);
  };
  const frame = await capture.capture({ pose, exclude: [self, hidden] });
  assert.equal(frame.observedAt, 1000); assert.deepEqual(frame.pose, pose);
  assert.equal(frame.pixels.data[0], 15); assert.equal(frame.pixels.data.at(-1), 0, 'WebGL rows become upright model pixels');
  capture.dispose(); media.geometry.dispose(); ordinary.dispose(); mediaMaterial.dispose(); video.dispose(); label.material.dispose();
});

test('render and readback failures restore scene state and allow the next independent capture', async () => {
  for (const phase of ['render', 'read']) {
    const renderer = fakeRenderer(), original = renderer.snapshot(), scene = new THREE.Scene(), self = new THREE.Group(); scene.add(self);
    const capture = new ResidentViewCapture({ renderer, scene, width: 16, height: 16 });
    const read = renderer.readRenderTargetPixelsAsync;
    if (phase === 'render') renderer.render = () => { throw new Error('render fixture failure'); };
    else renderer.readRenderTargetPixelsAsync = async () => { throw new Error('read fixture failure'); };
    await assert.rejects(capture.capture({ pose, exclude: [self] }), /fixture failure/);
    assert.deepEqual(renderer.snapshot(), original); assert.equal(self.visible, true); assert.equal(capture.pending, false);
    renderer.render = () => {}; renderer.readRenderTargetPixelsAsync = read;
    assert.equal((await capture.capture({ pose })).pixels.width, 16); capture.dispose();
  }
});

test('in-flight readback is bounded to one frame, cancellation suppresses output and disposal waits to release the target', async () => {
  const renderer = fakeRenderer(), capture = new ResidentViewCapture({ renderer, scene: new THREE.Scene(), width: 16, height: 16 });
  let finish, disposed = 0; capture.target.addEventListener('dispose', () => disposed++);
  renderer.readRenderTargetPixelsAsync = () => new Promise(resolve => { finish = resolve; });
  const controller = new AbortController(), pending = capture.capture({ pose, signal: controller.signal });
  await assert.rejects(capture.capture({ pose }), { code: 'ERR_WORLD_VISION_BUSY' });
  controller.abort(); capture.dispose(); assert.equal(disposed, 0); finish();
  await assert.rejects(pending, { name: 'AbortError' }); assert.equal(disposed, 1);
  capture.dispose(); assert.equal(disposed, 1);
  await assert.rejects(capture.capture({ pose }), { code: 'ERR_WORLD_VISION_UNAVAILABLE' });
});

test('dimensions, pose, closed renderer and malformed exclusions cannot create unbounded frames', async () => {
  const renderer = fakeRenderer(), scene = new THREE.Scene();
  for (const width of [0, 15, 513, NaN, 22.5]) assert.throws(() => new ResidentViewCapture({ renderer, scene, width }), RangeError);
  assert.throws(() => new ResidentViewCapture({ renderer: {}, scene }), { code: 'ERR_WORLD_VISION_UNAVAILABLE' });
  const capture = new ResidentViewCapture({ renderer, scene });
  for (const invalid of [null, { position: [0, 0, NaN], direction: [0, 0, 1] }, { position: [0, 0, 0], direction: [0, 0, 0] }]) {
    await assert.rejects(capture.capture({ pose: invalid }), TypeError);
  }
  await assert.rejects(capture.capture({ pose, exclude: [{}] }), TypeError); capture.dispose();
});

test('a lost rendering context is reported rather than forwarding a blank frame', async () => {
  const renderer = fakeRenderer(), capture = new ResidentViewCapture({ renderer, scene: new THREE.Scene() });
  let lost = true, rendered = 0; renderer.getContext = () => ({ isContextLost: () => lost }); renderer.render = () => rendered++;
  await assert.rejects(capture.capture({ pose }), { code: 'ERR_WORLD_VISION_UNAVAILABLE' }); assert.equal(rendered, 0);
  lost = false; renderer.readRenderTargetPixelsAsync = async () => { lost = true; };
  await assert.rejects(capture.capture({ pose }), { code: 'ERR_WORLD_VISION_UNAVAILABLE' }); assert.equal(rendered, 1); capture.dispose();
});

// Pixel qualification uses an owned software WebGL browser. No network kernel,
// model downloads, hardware inference or user browser session is started.
let server, browser, origin, cache;
before(async () => {
  cache = await mkdtemp(join(tmpdir(), 'resident-view-capture-'));
  server = await createServer({ configFile: false, root: fileURLToPath(new URL('../../', import.meta.url)),
    cacheDir: cache, logLevel: 'error', optimizeDeps: { noDiscovery: true, include: [] },
    server: { host: '127.0.0.1', port: 0, hmr: false }, plugins: [{ name: 'resident-view-fixture', configureServer(vite) {
      vite.middlewares.use('/__resident_view', (_request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><style>body{margin:0;background:#071716;color:#b0e8ce;font:14px monospace}canvas{image-rendering:pixelated}</style><h2>Resident vision: body viewpoint</h2><p id="chat">DOM chat is excluded from captured pixels.</p>');
      });
    } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-webgpu'] });
});
after(async () => { try { await browser?.close(); } finally { await server?.close(); if (cache) await rm(cache, { recursive: true, force: true }); } });
async function fixture(t) {
  const context = await browser.newContext({ viewport: { width: 640, height: 450 } }), page = await context.newPage(), errors = [], external = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    external.push(route.request().url()); return route.abort();
  });
  t.after(async () => { await page.evaluate(() => window.cleanup?.()); await context.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []); });
  await page.goto(origin + '/__resident_view');
  await page.evaluate(async () => {
    window.THREE = await import('/node_modules/three/build/three.module.js');
    window.ResidentViewCapture = (await import('/demos/shared/world/ResidentViewCapture.js')).ResidentViewCapture;
    window.scene = new THREE.Scene(); scene.background = new THREE.Color('#000000');
    window.renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true }); renderer.setSize(192, 192);
    document.body.append(renderer.domElement);
    window.player = new THREE.PerspectiveCamera(75, 1, .1, 250); player.position.set(0, 30, -25); player.lookAt(0, 0, 0);
    window.capture = new ResidentViewCapture({ renderer, scene, width: 64, height: 64 });
    window.plane = (color, y, z, height = 20) => {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(30, height), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
      mesh.position.set(0, y, z); scene.add(mesh); return mesh;
    };
    window.pixel = (frame, x, y) => [...frame.pixels.data.slice((y * frame.pixels.width + x) * 4, (y * frame.pixels.width + x) * 4 + 4)];
    window.showFrame = (frame, label) => {
      const section = document.createElement('span'), caption = document.createElement('span'), canvas = document.createElement('canvas');
      canvas.width = frame.pixels.width; canvas.height = frame.pixels.height; canvas.style.width = canvas.style.height = '192px';
      canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(frame.pixels.data), frame.pixels.width, frame.pixels.height), 0, 0);
      caption.textContent = label; section.style.display = 'inline-grid'; section.append(caption, canvas); document.body.append(section);
    };
    window.cleanup = () => {
      capture.dispose(); scene.traverse(object => { object.geometry?.dispose(); for (const material of Array.isArray(object.material) ? object.material : [object.material]) { material?.map?.dispose(); material?.dispose(); } });
      renderer.dispose(); renderer.forceContextLoss();
    };
  });
  return page;
}

test('real WebGL captures the resident heading and upright colors while leaving the player camera and viewport untouched', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    plane('#00ff00', 5, 10, 10); plane('#ff0000', -5, 10, 10); plane('#0000ff', 0, -10);
    renderer.render(scene, player);
    const before = { position: player.position.toArray(), rotation: player.quaternion.toArray(), viewport: renderer.getViewport(new THREE.Vector4()).toArray(),
      size: renderer.getSize(new THREE.Vector2()).toArray(), canvas: renderer.domElement.toDataURL() };
    const north = await capture.capture({ pose: { position: [0, 0, 0], direction: [0, 0, 1] } });
    const south = await capture.capture({ pose: { position: [0, 0, 0], direction: [0, 0, -1] } });
    showFrame(north, 'Resident faces +Z'); showFrame(south, 'Resident faces −Z');
    const after = { position: player.position.toArray(), rotation: player.quaternion.toArray(), viewport: renderer.getViewport(new THREE.Vector4()).toArray(),
      size: renderer.getSize(new THREE.Vector2()).toArray(), canvas: renderer.domElement.toDataURL() };
    return { before, after, top: pixel(north, 32, 12), bottom: pixel(north, 32, 52), south: pixel(south, 32, 32),
      bytes: north.pixels.data.length, renderer: renderer.getContext().getParameter(renderer.getContext().RENDERER) };
  });
  assert.deepEqual(result.before, result.after); assert.deepEqual(result.top, [0, 255, 0, 255]);
  assert.deepEqual(result.bottom, [255, 0, 0, 255]); assert.deepEqual(result.south, [0, 0, 255, 255]); assert.equal(result.bytes, 64 * 64 * 4);
  if (process.env.RESIDENT_VISION_EVIDENCE_DIR) {
    await mkdir(process.env.RESIDENT_VISION_EVIDENCE_DIR, { recursive: true });
    await page.screenshot({ path: join(process.env.RESIDENT_VISION_EVIDENCE_DIR, 'resident-view-directions.png') });
  }
});

test('real pixels exclude the observing body, private roots, names and speech rather than exposing them through the model frame', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    plane('#808080', 0, 12);
    const self = plane('#ff0000', 0, 2), privateBody = plane('#00ff00', 0, 4);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: '#ff00ff', depthTest: false }));
    sprite.position.set(0, 0, 1); sprite.scale.set(20, 20, 1); sprite.renderOrder = 1000; scene.add(sprite);
    const frame = await capture.capture({ pose: { position: [0, 0, 0], direction: [0, 0, 1] }, exclude: [self, privateBody] });
    return { pixel: pixel(frame, 32, 32), visibility: [self.visible, privateBody.visible, sprite.visible] };
  });
  assert.deepEqual(result.visibility, [true, true, true]);
  for (const color of result.pixel.slice(0, 3)) assert(Math.abs(color - 128) <= 1, 'sRGB midtone should be captured as display pixels');
});

test('real frames mask video-textured faces and restore the original material without changing the next ordinary render', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const screen = plane('#ffffff', 0, 10), canvas = document.createElement('canvas'); canvas.width = canvas.height = 2;
    const context = canvas.getContext('2d'); context.fillStyle = '#ff00ff'; context.fillRect(0, 0, 2, 2);
    const texture = new THREE.CanvasTexture(canvas); texture.isVideoTexture = true; texture.update = () => {};
    screen.material.map = texture; const original = screen.material;
    const frame = await capture.capture({ pose: { position: [0, 0, 0], direction: [0, 0, 1] } });
    return { pixel: pixel(frame, 32, 32), same: screen.material === original, map: screen.material.map === texture };
  });
  assert.equal(result.same, true); assert.equal(result.map, true);
  assert.deepEqual(result.pixel, [129, 145, 154, 255]);
});
