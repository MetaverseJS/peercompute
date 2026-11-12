import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Real Three/WebGL and browser image decoders, using software rendering only.
// No model execution, user profile, live peer traffic, or remote fixture URL.
let server, browser, origin, cache;
before(async () => {
  cache = await mkdtemp(join(tmpdir(), 'generated-mesh-textures-'));
  server = await createServer({ configFile: false, root: fileURLToPath(new URL('../../', import.meta.url)),
    cacheDir: cache, logLevel: 'error', optimizeDeps: { noDiscovery: true, include: [] },
    server: { host: '127.0.0.1', port: 0, hmr: false }, plugins: [{ name: 'texture-fixture', configureServer(vite) {
      vite.middlewares.use('/__mesh_textures', (_request, response) => {
        response.setHeader('Content-Type', 'text/html'); response.end('<!doctype html><link rel="icon" href="data:,"><body></body>');
      });
    } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-webgpu'] });
});
after(async () => { try { await browser?.close(); } finally { await server?.close(); if (cache) await rm(cache, { recursive: true, force: true }); } });
async function fixture(t) {
  const context = await browser.newContext({ viewport: { width: 400, height: 400 } }), page = await context.newPage();
  const errors = [], external = []; page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    external.push(route.request().url()); return route.abort();
  });
  t.after(async () => { await context.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []); });
  await page.goto(origin + '/__mesh_textures');
  await page.evaluate(async () => {
    window.THREE = await import('/node_modules/three/build/three.module.js');
    window.artifacts = await import('/peercompute/src/peercompute/inference/GeneratedMeshArtifact.js');
    window.views = await import('/demos/shared/world/GeneratedMeshView.js');
    window.source = async (color, mimeType) => {
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 2;
      const context = canvas.getContext('2d'); context.fillStyle = color; context.fillRect(0, 0, 2, 2);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, mimeType));
      return { data: new Uint8Array(await blob.arrayBuffer()), mimeType };
    };
    window.geometry = {
      positions: new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]),
      indices: new Uint16Array([0, 1, 2, 0, 2, 3]),
      normals: new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]),
      uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])
    };
    window.modify = (data, edit) => {
      const view = new DataView(data.buffer), oldLength = view.getUint32(12, true);
      const json = JSON.parse(new TextDecoder().decode(data.subarray(20, 20 + oldLength))); edit(json);
      const text = new TextEncoder().encode(JSON.stringify(json)), length = Math.ceil(text.length / 4) * 4;
      const result = new Uint8Array(data.length + length - oldLength), next = new DataView(result.buffer);
      result.set(data.subarray(0, 20)); next.setUint32(8, result.length, true); next.setUint32(12, length, true);
      result.fill(32, 20, 20 + length); result.set(text, 20); result.set(data.subarray(20 + oldLength), 20 + length);
      return result;
    };
    window.originalDecode = createImageBitmap; window.decoded = []; window.closedBitmaps = [];
    window.createImageBitmap = async (...args) => {
      const bitmap = await originalDecode(...args); decoded.push(bitmap); const close = bitmap.close.bind(bitmap);
      bitmap.close = () => { closedBitmaps.push(bitmap); close(); }; return bitmap;
    };
  });
  return page;
}

test('checked embedded PNG/JPEG textures render through real Three and release GPU and bitmap resources', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const textures = { baseColor: await source('#e02010', 'image/png'), normal: await source('#8080ff', 'image/jpeg') };
    const mesh = artifacts.encodeGeneratedMesh({ ...geometry, textures });
    let fetches = 0, urls = 0;
    window.fetch = () => { fetches++; throw new Error('Unexpected texture fetch'); };
    URL.createObjectURL = () => { urls++; throw new Error('Unexpected texture URL'); };
    const view = await views.prepareGeneratedMeshView(mesh), scene = new THREE.Scene(); scene.add(view.group);
    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 20); camera.position.set(0, 1, 3); camera.lookAt(0, 1, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true }); renderer.setSize(128, 128);
    document.body.append(renderer.domElement);
    // Warm Three's shared physically-based DFG lookup texture independently of
    // the generated object, then measure only the object's additional resources.
    const baselineScene = new THREE.Scene(), baselineMaterial = new THREE.MeshStandardMaterial();
    const baselineGeometry = new THREE.PlaneGeometry(2, 2), baselineMesh = new THREE.Mesh(baselineGeometry, baselineMaterial);
    baselineMesh.position.y = 1; baselineScene.add(baselineMesh); renderer.render(baselineScene, camera);
    baselineMesh.removeFromParent(); baselineGeometry.dispose(); baselineMaterial.dispose();
    const baselineTextures = renderer.info.memory.textures;
    renderer.render(scene, camera);
    const pixel = new Uint8Array(4), gl = renderer.getContext(); gl.readPixels(64, 64, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    let maps = [], releasedTextures = 0, releasedGeometry = 0;
    view.group.traverse(object => {
      object.geometry?.addEventListener('dispose', () => releasedGeometry++);
      if (!object.material) return;
      maps = [object.material.map, object.material.normalMap];
      for (const texture of maps) texture.addEventListener('dispose', () => releasedTextures++);
    });
    const loaded = { textureCount: renderer.info.memory.textures - baselineTextures, geometryCount: renderer.info.memory.geometries,
      dimensions: maps.map(texture => [texture.image.width, texture.image.height]) };
    view.dispose(); view.dispose();
    const disposed = { textureCount: renderer.info.memory.textures - baselineTextures, geometryCount: renderer.info.memory.geometries,
      releasedTextures, releasedGeometry, bitmapCount: decoded.length, closedCount: closedBitmaps.length,
      bitmapWidths: decoded.map(bitmap => bitmap.width), released: view.released };
    renderer.dispose(); renderer.forceContextLoss();
    return { loaded, disposed, pixel: [...pixel], fetches, urls };
  });
  t.diagnostic(JSON.stringify(result));
  assert.deepEqual(result.loaded, { textureCount: 2, geometryCount: 1, dimensions: [[2, 2], [2, 2]] });
  assert.ok(result.pixel[0] > 100 && result.pixel[0] > result.pixel[1] * 1.5, JSON.stringify(result));
  assert.deepEqual(result.disposed, { textureCount: 0, geometryCount: 0, releasedTextures: 2, releasedGeometry: 1,
    bitmapCount: 2, closedCount: 2, bitmapWidths: [0, 0], released: true });
  assert.equal(result.fetches, 0); assert.equal(result.urls, 0);
});

test('hostile embedded references and oversized image dimensions fail before any image decoding or fetch', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const mesh = artifacts.encodeGeneratedMesh({ ...geometry, textures: { baseColor: await source('red', 'image/jpeg') } });
    let fetches = 0; window.fetch = () => { fetches++; throw new Error('Unexpected network request'); };
    const variants = [
      modify(mesh.data, json => { json.images[0].uri = 'https://attacker.invalid/image.jpg'; }),
      modify(mesh.data, json => { json.images[0].uri = 'blob:https://attacker.invalid/image'; }),
      modify(mesh.data, json => { json.images[0].mimeType = 'image/svg+xml'; }),
      modify(mesh.data, json => { json.extensionsUsed = ['KHR_texture_basisu']; }),
      modify(mesh.data, json => { json.materials[0].pbrMetallicRoughness.baseColorTexture.texCoord = 1; })
    ];
    const oversized = mesh.data.slice(), header = new DataView(oversized.buffer), length = header.getUint32(12, true);
    const json = JSON.parse(new TextDecoder().decode(oversized.subarray(20, 20 + length)));
    const bytes = oversized.subarray(28 + length + json.bufferViews[json.images[0].bufferView].byteOffset);
    const frame = bytes.findIndex((value, i) => value === 255 && [192, 193, 194].includes(bytes[i + 1]));
    bytes[frame + 7] = 255; bytes[frame + 8] = 255; variants.push(oversized);
    const errors = [];
    for (const data of variants) {
      try { const view = await views.prepareGeneratedMeshView({ data }); view.dispose(); errors.push('ACCEPTED'); }
      catch (error) { errors.push(error.message); }
    }
    return { errors, decoded: decoded.length, fetches };
  });
  assert.equal(result.errors.length, 6); assert.ok(result.errors.every(message => message.startsWith('Invalid generated mesh')));
  assert.equal(result.decoded, 0); assert.equal(result.fetches, 0);
});

test('cancellation during a real image decode releases already decoded embedded images', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const textures = { baseColor: await source('red', 'image/jpeg'), normal: await source('#8080ff', 'image/jpeg') };
    const mesh = artifacts.encodeGeneratedMesh({ ...geometry, textures });
    const abort = new AbortController(), trackedDecode = createImageBitmap;
    window.createImageBitmap = async (...args) => {
      const bitmap = await trackedDecode(...args); if (decoded.length === 2) abort.abort(); return bitmap;
    };
    let error;
    try { await views.prepareGeneratedMeshView(mesh, { signal: abort.signal }); } catch (value) { error = value.name; }
    return { error, decoded: decoded.length, closed: closedBitmaps.length, widths: decoded.map(bitmap => bitmap.width) };
  });
  assert.deepEqual(result, { error: 'AbortError', decoded: 2, closed: 2, widths: [0, 0] });
});

test('corrupt compressed pixel data fails real decode and closes an earlier valid texture', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const normal = await source('#8080ff', 'image/png'), bytes = normal.data, header = new DataView(bytes.buffer);
    for (let offset = 8; offset + 12 <= bytes.length;) {
      const length = header.getUint32(offset), end = offset + length + 12;
      if (String.fromCharCode(...bytes.subarray(offset + 4, offset + 8)) === 'IDAT') {
        bytes.fill(0, offset + 8, end - 4);
        let crc = 0xffffffff;
        for (const value of bytes.subarray(offset + 4, end - 4)) {
          crc ^= value; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
        }
        header.setUint32(end - 4, (crc ^ 0xffffffff) >>> 0);
      }
      offset = end;
    }
    const mesh = artifacts.encodeGeneratedMesh({ ...geometry, textures: { baseColor: await source('red', 'image/jpeg'), normal } });
    let rejected = false;
    try { const view = await views.prepareGeneratedMeshView(mesh); view.dispose(); } catch { rejected = true; }
    return { rejected, decoded: decoded.length, closed: closedBitmaps.length, widths: decoded.map(bitmap => bitmap.width) };
  });
  assert.deepEqual(result, { rejected: true, decoded: 1, closed: 1, widths: [0] });
});
