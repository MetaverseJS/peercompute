import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { createReadStream } from 'node:fs';
import { chromium } from 'playwright';
import { BrowserHost } from '../host/BrowserHost.mjs';
import { publicEvidenceDirectory } from '../host/evidenceDirectory.mjs';
import { modelEvidenceBuildPlugin } from '../../scripts/modelEvidenceBuildPlugin.mjs';

const repo = fileURLToPath(new URL('../../', import.meta.url)), dir = await mkdtemp(join(tmpdir(), 'peercompute-evidence-client-'));
const hostname = process.env.PEERCOMPUTE_HOST_WSS_NAME;
if (!hostname || !process.env.SSL_CERT || !process.env.SSL_KEY) throw new Error('Set trusted WSS hostname/cert paths; this test never bypasses TLS');
const descriptor = JSON.parse(await readFile(join(homedir(), '.cache/peercompute-artifacts/packages/smolvlm-256m-q4/descriptor.json'), 'utf8'));
const report = { startedAt: new Date().toISOString(), checks: [] }, errors = [];
let host, server, browser, page;
try {
  host = new BrowserHost({ dataDir: join(dir, 'root'), port: 0, chromeArgs: ['--disable-gpu'], watchdogIntervalMs: 1000,
    companion: { enabled: true, listenHost: '0.0.0.0', listenPort: 0, connectHost: hostname,
      tls: { certPath: process.env.SSL_CERT, keyPath: process.env.SSL_KEY } } });
  await host.start();
  server = await createServer({ configFile: false, root: repo, cacheDir: join(dir, 'vite'), logLevel: 'warn',
    plugins: [modelEvidenceBuildPlugin(), { name: 'evidence-harness', configureServer(vite) {
      vite.middlewares.use('/cached-smol/', (req, res) => {
        const path = decodeURIComponent(req.url.split('?')[0]).split('/').filter(Boolean);
        if (path.some(value => value === '..' || value.includes('\\'))) { res.writeHead(400).end(); return; }
        res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Content-Type', 'application/octet-stream');
        const stream = createReadStream(join(descriptor.sourceDirectory, ...path));
        stream.on('error', () => { res.writeHead(404).end(); }); stream.pipe(res);
      });
      vite.middlewares.use('/evidence-test', async (_req, res) => {
        res.setHeader('Content-Type', 'text/html'); res.end(await vite.transformIndexHtml('/evidence-test', '<!doctype html><html><body><div id="panel"></div><script type="module">import {createInferenceRuntime} from "/demos/inference/src/runtime.js"; window.createRuntime=createInferenceRuntime;</script></body></html>'));
      });
    } }], worker: { format: 'es' }, optimizeDeps: { entries: ['demos/inference/src/runtime.js', 'demos/inference/src/agentPanel.js'] },
    server: { host: '127.0.0.1', port: 0, hmr: false,
      headers: { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' } } });
  await server.listen();
  browser = await chromium.launchPersistentContext(join(dir, 'client'), { executablePath: '/usr/bin/google-chrome', headless: true,
    args: ['--enable-gpu', '--enable-unsafe-webgpu', '--enable-features=Vulkan,VulkanFromANGLE', '--use-angle=vulkan', '--use-vulkan=native', '--disable-vulkan-surface'] });
  page = await browser.newPage(); page.on('pageerror', error => errors.push(error.message));
  page.on('crash', () => console.error('CLIENT PAGE CRASH'));
  page.on('console', event => { if (event.type() === 'error') console.error('CLIENT', event.text().slice(0, 500)); });
  await page.route('https://secretworkshop.net/peercompute/config/model-evidence.json', async route => {
    const status = await host.page.evaluate(() => window.peercomputeRoot.status());
    const directory = publicEvidenceDirectory(status); assert(directory, 'root has a public WSS circuit reservation');
    await route.fulfill({ json: directory, headers: { 'Access-Control-Allow-Origin': '*', 'Cross-Origin-Resource-Policy': 'cross-origin' } });
  });
  await page.route('https://huggingface.co/**', async route => {
    const url = new URL(route.request().url()), marker = '/resolve/';
    if (url.pathname.startsWith('/api/')) { await route.continue(); return; }
    if (!url.pathname.includes(marker)) { await route.abort(); return; }
    const [revision, ...path] = url.pathname.split(marker)[1].split('/');
    if (revision !== descriptor.sourceDirectory.split('/').at(-1) || path.some(part => !part || part === '..')) { await route.abort(); return; }
    await route.fulfill({ status: 302, headers: { Location: `http://127.0.0.1:${server.httpServer.address().port}/cached-smol/${path.join('/')}`,
      'Access-Control-Allow-Origin': '*', 'Cross-Origin-Resource-Policy': 'cross-origin' }, body: '' });
  });
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/evidence-test`);
  await page.waitForFunction(() => window.createRuntime, { timeout: 60000 });
  await page.evaluate(async () => {
    window.runtime = await window.createRuntime({ storeName: 'evidence-acceptance', collectGpuEvidence: true });
    await window.runtime.connectBackend();
    window.runtime.setShareModelEvidence(true);
  });
  const peerId = await page.evaluate(() => window.runtime.networkManager.libp2p.peerId.toString());
  report.peerId = peerId;
  const inspected = await page.evaluate(revision => window.runtime.inspectModelHub(`https://huggingface.co/HuggingFaceTB/SmolVLM-256M-Instruct/tree/${revision}`), descriptor.sourceDirectory.split('/').at(-1));
  assert(inspected.variants.some(value => value.loadable));
  report.inspectedVariants = inspected.variants.length;
  const source = await page.evaluate(async () => {
    const runtime = window.runtime;
    const saved = await runtime.importCatalog('smolvlm-256m-q4');
    return { manifestCid: saved.manifestCid ?? saved.cid };
  });
  report.imported = source;
  const generation = await page.evaluate(async () => {
    const runtime = window.runtime;
    const source = runtime.listModelSources().find(value => value.modelId === 'smolvlm-256m-q4');
    await runtime.acquireModel(source.key);
    const service = runtime.service;
    return await service.generate({ prompt: 'Reply with the word READY.', maxNewTokens: 12 });
  });
  report.generation = { inputTokens: generation.inputTokens, outputTokens: generation.outputTokens, gpuDispatches: generation.gpuDispatches };
  assert(generation.outputTokens > 0); assert(generation.gpuDispatches > 0);
  await page.waitForFunction(async () => {
    const store = window.runtime.stateManager.getModelEvidenceStore('evidence-acceptance-evidence');
    return (await store.query()).some(value => value.report.stage === 'generation');
  });
  const local = await page.evaluate(() => window.runtime.stateManager.getModelEvidenceStore('evidence-acceptance-evidence').query());
  assert(local.every(row => row.reporterPeerId === peerId && (row.report.stage === 'inspection' || row.report.executorPeerId === peerId)));
  assert(local.some(row => row.report.stage === 'inspection' && row.report.outcome === 'success'));
  assert(local.find(row => row.report.stage === 'generation').report.metrics.some(metric => metric.name === 'requestedGpuBufferPeakBytes' && metric.value > 0));
  report.metrics = local.find(row => row.report.stage === 'generation').report.metrics;
  assert(local.some(row => row.report.stage === 'load')); assert(local.some(row => row.report.stage === 'generation'));
  assert(local.every(row => /^[a-f0-9]{64}$/.test(row.report.compatibility.runtimeDigest)));
  assert(!JSON.stringify(local).includes('Reply with the word READY.'));
  report.checks.push('real SmolVLM managed WebGPU load/generation automatically journal exact host, package, runtime fingerprint and workload without content');
  await page.evaluate(async () => {
    const store = window.runtime.stateManager.getModelEvidenceStore('evidence-acceptance-evidence');
    for (let i = 0; i < 10 && (await store.pending()).length; i++) {
      const result = await window.runtime.flushModelEvidence(); if (result.failed) throw new Error('Evidence delivery failed');
    }
  });
  const remote = await host.page.evaluate(() => window.peercomputeRoot.queryEvidence({ stage: 'generation' }));
  assert.equal(remote.length, 1); assert.equal(remote[0].reporterPeerId, peerId); assert.equal(remote[0].provenance, 'verified-signature');
  report.checks.push('opt-in signed observation delivery to Chromium root over certificate-verified WSS/Noise');
  await page.evaluate(async () => {
    const { createModelBrowser } = await import('/demos/inference/src/ui/modelBrowser.js');
    const { MODEL_CATALOG } = await import('/demos/inference/src/runtime.js');
    const catalog = MODEL_CATALOG['smolvlm-256m-q4'];
    window.modelBrowser = createModelBrowser({ container: document.querySelector('#panel'),
      getSources: () => [{ ...catalog, key: 'smol', source: 'hf', modelId: catalog.id }],
      getCompatibility: () => window.runtime.getModelCompatibility(catalog),
      queryEvidence: (source, options) => window.runtime.queryModelEvidence(source, options) });
    window.modelBrowser.open({ selectedKey: 'smol', tab: 'browse' });
  });
  await page.getByRole('button', { name: 'Check observations' }).click();
  await page.getByText('Root connected. Historical failures never disable loading.').waitFor({ timeout: 30000 });
  await page.getByText('generation: success', { exact: true }).waitFor();
  if (process.env.PEERCOMPUTE_EVIDENCE_SCREENSHOT) await page.screenshot({ path: process.env.PEERCOMPUTE_EVIDENCE_SCREENSHOT, fullPage: true });
  report.checks.push('actual catalog browser matches pre-download file selection to executed stored package and renders root receipts');
  await page.evaluate(() => window.modelBrowser.dispose());
  await page.evaluate(() => window.runtime.dispose());
  assert.deepEqual(errors, []); report.status = 'passed';
} catch (error) { report.status = 'failed'; report.error = error.stack; console.error(error); throw error; }
finally {
  await Promise.allSettled([browser?.close(), server?.close(), host?.stop()]);
  if (process.env.PEERCOMPUTE_EVIDENCE_REPORT) await writeFile(process.env.PEERCOMPUTE_EVIDENCE_REPORT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2)); await rm(dir, { recursive: true, force: true });
}
