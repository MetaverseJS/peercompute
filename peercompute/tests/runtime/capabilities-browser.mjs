import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { chromium } from 'playwright';

const repo = fileURLToPath(new URL('../../../', import.meta.url));
const temporary = await mkdtemp(path.join(tmpdir(), 'peercompute-capabilities-browser-'));
const srcRoot = path.join(temporary, 'src');
const distRoot = path.join(temporary, 'dist');

let server = null;
let browser = null;
const pageErrors = [];
const consoleErrors = [];

const entryCode = `
import {
  probeCapabilities,
  benchmarkCapabilities,
  sizeWorkload,
  createRuntimeBudgetGovernor,
  ComputeManager,
  GPUHubManager
} from ${JSON.stringify(path.join(repo, 'peercompute/src/peercompute/index.js'))};

window.__capTest = {
  async runAll() {
    const caps = await probeCapabilities({
      includeWebGL: true,
      includeStorageEstimate: true,
      allowFallback: false
    });
    const manager = new ComputeManager({
      enableWorkers: true,
      maxWorkers: Math.min(4, Math.max(2, caps.cpu.cores || 2))
    });
    await manager.initialize();
    const mgrCaps = await manager.probeCapabilities({ includeWebGL: true });
    const bench1 = await manager.benchmarkCapabilities({
      suites: ['cpu', 'wasm', 'gpu'],
      allowFallback: false,
      force: true
    });
    const bench2 = await manager.benchmarkCapabilities({
      suites: ['cpu', 'wasm', 'gpu'],
      allowFallback: false,
      force: false
    });
    const particleSizing = manager.sizeWorkload({
      kind: 'count',
      name: 'particles',
      baseCount: 100000,
      minCount: 4096,
      maxCount: 1000000,
      strideBytes: 64,
      buffersCount: 2
    });
    const quadraticSizing = manager.sizeWorkload({
      kind: 'count',
      name: 'all-pairs',
      baseCount: 2048,
      minCount: 256,
      maxCount: 200000,
      requestedCount: 200000,
      complexity: 'O(N^2)',
      quadraticBaseCap: 2048
    });
    const gridSizing = manager.sizeWorkload({
      kind: 'grid3d',
      name: 'mpm-grid',
      baseDim: [64, 64, 64],
      minDim: [16, 16, 16],
      maxDim: [256, 256, 256],
      step: 8,
      cellStrideBytes: 32,
      workgroupSize: 64,
      dispatchDimensions: 1
    });

    let gpuHubLimits = null;
    if (caps.webgpu.available) {
      const hub = new GPUHubManager();
      const device = await hub.initialize({ label: 'browser-cap-test' });
      gpuHubLimits = hub.getLimits();
      device?.destroy?.();
    }

    const gov = createRuntimeBudgetGovernor({
      levels: ['LOW', 'MED', 'HIGH'],
      initialLevelIndex: 2,
      sampleAlpha: 0.5,
      downDelayMs: 60,
      cooldownDownMs: 60
    });
    for (let i = 0; i < 4; i += 1) gov.update({ frameMs: 40, dtMs: 30 });
    const govStatus = gov.getStatus();

    const workerStats = manager.getCapabilities();
    await manager.destroy();

    return {
      caps,
      mgrFingerprint: mgrCaps.hardwareFingerprint,
      bench1,
      bench2,
      particleSizing,
      quadraticSizing,
      gridSizing,
      gpuHubLimits,
      govStatus,
      workerCount: workerStats.workers
    };
  },
  async checkCachedAfterReload() {
    const caps = await probeCapabilities({ includeWebGL: true, allowFallback: false });
    const bench = await benchmarkCapabilities({
      capabilities: caps,
      suites: ['cpu', 'wasm', 'gpu'],
      allowFallback: false
    });
    return {
      fromCache: bench.fromCache,
      fingerprint: bench.hardwareFingerprint,
      performanceClass: bench.performanceClass
    };
  }
};
`;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.wasm': 'application/wasm'
};

try {
  await mkdir(srcRoot, { recursive: true });
  await writeFile(path.join(srcRoot, 'main.js'), entryCode);
  await writeFile(
    path.join(srcRoot, 'index.html'),
    '<!doctype html><html><head><meta charset="utf-8"><title>Capabilities Test</title></head><body><script type="module" src="./main.js"></script></body></html>'
  );

  await build({
    configFile: false,
    root: srcRoot,
    base: './',
    logLevel: 'warn',
    worker: { format: 'es' },
    build: { target: 'esnext', outDir: distRoot, emptyOutDir: true }
  });

  server = createServer(async (req, res) => {
    try {
      const reqPath = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      const rel = reqPath === '/' ? 'index.html' : reqPath.replace(/^\/+/, '');
      const fullPath = path.resolve(distRoot, rel);
      if (!fullPath.startsWith(distRoot)) {
        res.writeHead(403);
        res.end();
        return;
      }
      const data = await readFile(fullPath);
      const ext = path.extname(fullPath);
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}/`;

  const executablePath = process.env.CHROME_BIN || '/usr/bin/google-chrome';
  browser = await chromium.launch({
    executablePath,
    headless: true,
    args: [
      '--enable-gpu',
      '--enable-unsafe-webgpu',
      '--enable-features=Vulkan,VulkanFromANGLE',
      '--use-angle=vulkan',
      '--use-vulkan=native',
      '--disable-vulkan-surface'
    ]
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  const result = await page.evaluate(() => window.__capTest.runAll());

  assert.equal(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
  assert.equal(result.caps.schema, 'peercompute.capabilities.v1');
  assert.equal(result.caps.hardwareFingerprint, result.mgrFingerprint);
  assert.equal(result.caps.memory.provenance.vram, 'unavailable-in-browser');
  assert.equal(result.caps.wasm.supported, true);
  assert.equal(result.caps.wasm.simd, true);
  assert.equal(result.bench1.fromCache, false);
  assert.equal(result.bench1.executedInWorker, true, 'Benchmark should execute inside a managed ComputeManager Web Worker');
  assert.equal(result.bench1.metrics.cpu.ok, true);
  assert.ok(result.bench1.metrics.cpu.mopsPerSec > 0);
  assert.equal(result.bench1.metrics.wasm.ok, true);
  assert.ok(result.bench1.metrics.wasm.mopsPerSec > 0);
  if (result.caps.webgpu.available === true) {
    assert.equal(result.bench1.metrics.gpu.ok, true, `Hardware WebGPU benchmark failed: ${result.bench1.metrics.gpu?.reason}`);
    assert.ok(result.bench1.metrics.gpu.computeGflopsProxy > 0);
    assert.ok(result.bench1.metrics.gpu.memoryBandwidthGBps > 0);
    assert.ok(result.bench1.metrics.gpu.readbackLatencyMs > 0);
    assert.equal(result.bench1.metrics.gpu.verified, true);
    assert.ok(result.gpuHubLimits?.maxBufferSize > 256 * 1024 * 1024 || result.gpuHubLimits?.maxBufferSize === result.caps.webgpu.limits.maxBufferSize);
  }
  assert.equal(result.bench2.fromCache, true, 'Second benchmark call should hit cache');
  assert.equal(result.quadraticSizing.clamped, true);
  assert.ok(result.quadraticSizing.count <= 8192);
  assert.ok(result.gridSizing.cellCount > 0);
  assert.equal(result.govStatus.level, 'MED');

  // Verify persistence across page reload via localStorage
  await page.reload({ waitUntil: 'networkidle' });
  const afterReload = await page.evaluate(() => window.__capTest.checkCachedAfterReload());
  assert.equal(afterReload.fromCache, true, 'Benchmark cache should persist across page reloads');
  assert.equal(afterReload.fingerprint, result.caps.hardwareFingerprint);

  console.log(JSON.stringify({
    ok: true,
    tier: result.caps.tier,
    cpuCores: result.caps.cpu.cores,
    deviceMemoryGiB: result.caps.memory.deviceMemoryGiB,
    webgpuStatus: result.caps.webgpu.status,
    webgpuInfo: result.caps.webgpu.info,
    gpuHubPromotedMaxBufferSize: result.gpuHubLimits?.maxBufferSize ?? null,
    webgl2: result.caps.webgl?.webgl2 ?? false,
    max3DTextureSize: result.caps.webgl?.max3DTextureSize ?? null,
    workerCount: result.workerCount,
    executedInWorker: result.bench1.executedInWorker,
    performanceClass: result.bench1.performanceClass,
    scores: result.bench1.scores,
    cpuMops: result.bench1.metrics.cpu.mopsPerSec,
    multiWorker: result.bench1.metrics.multiWorker,
    wasmMops: result.bench1.metrics.wasm.mopsPerSec,
    gpuBench: result.bench1.metrics.gpu,
    durationMs: result.bench1.durationMs,
    cachedAcrossReload: afterReload.fromCache
  }, null, 2));

  await context.close();
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) await new Promise((resolve) => server.close(resolve));
  await rm(temporary, { recursive: true, force: true }).catch(() => {});
}
