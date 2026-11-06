import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { chromium } from 'playwright';
import { ArtifactStore } from '../../src/peercompute/artifacts/ArtifactStore.js';

// Native browser Fetch + IndexedDB: no intercepted Response/fetchImpl and no model runtime.
// Destroy only a fixture response socket after the browser has consumed a prefix.
const repo = fileURLToPath(new URL('../../../', import.meta.url));
const bytes = Uint8Array.from({ length: 4 * 1024 ** 2 + 137 }, (_, index) => (index * 31 + (index >>> 15)) % 251);
const keepBytes = new TextEncoder().encode('An unrelated pinned package must survive download retries and aborts.');
const sha = (value) => createHash('sha256').update(value).digest('hex');
const model = { runtime: 'transformers.js', repository: 'test/download', revision: 'a'.repeat(40) };
const spec = { schema: 'peercompute.artifact.manifest.v1', name: 'Native interrupted download', model,
  files: [{ path: 'weights.bin', size: bytes.length, sha256: sha(bytes) }] };
const keepSpec = { ...spec, name: 'Retained unrelated package',
  files: [{ path: 'keep.bin', size: keepBytes.length, sha256: sha(keepBytes) }] };
let temporary, server, browser, origin, expected;
const cases = new Map(), sockets = new Set();

before(async () => {
  const baseline = new ArtifactStore({ persistent: false }); await baseline.open();
  try {
    const file = await baseline.importFile(bytes, { expectedSize: bytes.length, expectedSha256: sha(bytes), pin: false });
    const manifest = await baseline.importManifest({ ...spec, files: [{ path: 'weights.bin', cid: file.cid, size: file.size, sha256: file.sha256 }] }, { pin: true });
    expected = { fileCid: file.cid, manifestCid: manifest.cid, sha256: file.sha256 };
  } finally { await baseline.destroy(); }
  temporary = await mkdtemp(path.join(tmpdir(), 'peercompute-native-download-'));
  await writeFile(path.join(temporary, 'index.html'), '<!doctype html><link rel="icon" href="data:,"><script type="module" src="/fixture.js"></script>');
  await writeFile(path.join(temporary, 'fixture.js'), `
    import { ArtifactStore } from ${JSON.stringify(path.join(repo, 'peercompute/src/peercompute/artifacts/ArtifactStore.js'))};
    import { importModelPackage, listStoredModelRecords } from ${JSON.stringify(path.join(repo, 'demos/inference/src/modelLibrary.js'))};
    window.beginDownloadCase = (id, cancelOnRetry) => {
      window.downloadEvents = []; window.caseSettled = false;
      window.casePromise = (async () => {
        const store = new ArtifactStore({ name: 'native-download-' + crypto.randomUUID(), capacity: 'browser' });
        const controller = new AbortController();
        let closed, result, failure, kept, abortAt, settledAt, reopened;
        await store.open();
        try {
          kept = await importModelPackage(store, ${JSON.stringify(keepSpec)}, () => '/keep');
          try {
            result = await importModelPackage(store, ${JSON.stringify(spec)}, () => '/transfer/' + id, {
              signal: controller.signal,
              onProgress(event) {
                window.downloadEvents.push({ ...event });
                if (cancelOnRetry && event.retryAttempt && !controller.signal.aborted) {
                  abortAt = performance.now(); controller.abort(new DOMException('Cancelled during retry', 'AbortError'));
                }
              },
            });
          } catch (error) { failure = { name: error.name, message: error.message }; }
          settledAt = performance.now();
          const records = await listStoredModelRecords(store);
          const retained = await store.stat(kept.cid);
          const state = { result, failure, records: records.map((record) => ({ cid:record.cid, pinned:record.pinned, status:record.status })),
            keptCid:kept.cid, keptPinned:retained.pinned, stats:store.getStats(),
            abortLatencyMs: abortAt === undefined ? null : settledAt - abortAt, events:window.downloadEvents };
          await store.destroy(); closed = store.getStats();
          // A completed/cancelled import must release retention operations and IndexedDB locks.
          reopened = new ArtifactStore({ name:store.name, capacity:'browser' }); await reopened.open();
          state.reopenedRecords = (await listStoredModelRecords(reopened)).map((record) => record.cid);
          await reopened.destroy(); reopened = null;
          return { ...state, closed };
        } finally { controller.abort(); await reopened?.destroy(); await store.destroy(); window.caseSettled = true; }
      })();
      // The driver waits for a positive persisted prefix before cutting the socket.
      window.casePromise.catch(() => {});
    };`);
  const dist = path.join(temporary, 'dist');
  await build({ configFile: false, root: temporary, logLevel: 'silent', build: { target: 'esnext', outDir: dist } });
  server = createServer(async (request, response) => {
    const pathname = new URL(request.url, 'http://fixture.invalid').pathname;
    response.setHeader('Cache-Control', 'no-store');
    if (pathname === '/keep') {
      response.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Length': keepBytes.length }); response.end(keepBytes); return;
    }
    if (pathname.startsWith('/transfer/')) {
      const state = cases.get(pathname.slice('/transfer/'.length));
      if (!state) { response.writeHead(404); response.end(); return; }
      const range = request.headers.range ?? null;
      const match = range && /^bytes=(\d+)-(\d*)$/.exec(range);
      const start = match ? Number(match[1]) : 0;
      if (range && (!match || !Number.isSafeInteger(start) || start < 0 || start >= bytes.length)) {
        response.writeHead(416); response.end(); return;
      }
      const end = match?.[2] ? Math.min(Number(match[2]), bytes.length - 1) : bytes.length - 1;
      state.requests.push({ range, start, end, status: range ? 206 : 200 });
      state.active += 1;
      let timer;
      response.on('close', () => { clearInterval(timer); state.active -= 1; state.closed += 1; });
      response.writeHead(range ? 206 : 200, { 'Content-Type': 'application/octet-stream',
        'Content-Length': end - start + 1, 'Accept-Ranges': 'bytes', ETag: '"immutable-fixture"',
        ...(range ? { 'Content-Range': `bytes ${start}-${end}/${bytes.length}` } : {}) });
      if (state.requests.length === 1) {
        assert.equal(range, null, 'Initial request must be a full GET');
        state.partialResponse = response; response.flushHeaders();
        let sent = 0;
        // Non-block-aligned chunks and pacing give progress a deterministic chance to report.
        timer = setInterval(() => {
          if (sent >= 1024 ** 2 + 123 || response.destroyed) { clearInterval(timer); return; }
          const stop = Math.min(sent + 65003, 1024 ** 2 + 123); response.write(bytes.subarray(sent, stop)); sent = stop;
        }, 20);
      } else {
        response.end(bytes.subarray(start, end + 1));
      }
      return;
    }
    try {
      const filename = path.join(dist, pathname === '/' ? 'index.html' : pathname.slice(1));
      response.setHeader('Content-Type', filename.endsWith('.js') ? 'text/javascript' : 'text/html');
      response.end(await readFile(filename));
    } catch { response.writeHead(404); response.end(); }
  });
  server.on('connection', (socket) => { sockets.add(socket); socket.on('close', () => sockets.delete(socket)); });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true,
    args: ['--disable-gpu', '--disable-software-rasterizer'] });
});

after(async () => {
  await browser?.close();
  for (const socket of sockets) socket.destroy();
  if (server) await new Promise((resolve) => server.close(resolve));
  if (temporary) await rm(temporary, { recursive: true, force: true });
});

async function interruptedCase(t, id, cancelOnRetry = false) {
  const context = await browser.newContext(), page = await context.newPage();
  const errors = [], external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await context.route('https://**/*', (route) => { external.push(new URL(route.request().url()).origin); return route.abort(); });
  t.after(async () => { await context.close(); assert.deepEqual(errors, []); assert.deepEqual(external, []); });
  const state = { requests: [], active: 0, closed: 0, partialResponse: null }; cases.set(id, state);
  await page.goto(origin); await page.waitForFunction(() => window.beginDownloadCase);
  await page.evaluate(({ id, cancelOnRetry }) => window.beginDownloadCase(id, cancelOnRetry), { id, cancelOnRetry });
  await page.waitForFunction(() => window.downloadEvents.some((event) => event.loaded > 0 && event.loaded < event.totalBytes), null, { timeout: 15000 });
  const acceptedBeforeCut = await page.evaluate(() => window.downloadEvents.filter((event) => event.loaded > 0).at(-1).loaded);
  assert(state.partialResponse && !state.partialResponse.destroyed);
  state.partialResponse.destroy(); state.partialResponse = null;
  const result = await page.evaluate(() => window.casePromise);
  assert.equal(await page.evaluate(() => window.caseSettled), true);
  assert.equal(page.workers().length, 0, 'The streaming fixture must never start inference workers');
  assert.equal(result.stats.pending, 0); assert.equal(result.closed.pending, 0); assert.equal(result.closed.isOpen, false);
  assert.equal(result.keptPinned, true); assert(result.reopenedRecords.includes(result.keptCid));
  assert.equal(state.active, 0, 'Every native response has closed');
  return { ...result, requests: state.requests, acceptedBeforeCut, page };
}

test('native browser mid-body disconnect resumes with Range and produces the uninterrupted CID in IndexedDB', { timeout: 60000 }, async (t) => {
  const result = await interruptedCase(t, 'resume');
  assert.equal(result.failure, undefined); assert.equal(result.result.cid, expected.manifestCid);
  assert.equal(result.result.manifest.files[0].cid, expected.fileCid);
  assert.equal(result.result.manifest.files[0].sha256, expected.sha256);
  assert.equal(result.result.manifest.files[0].size, bytes.length);
  assert.equal(result.requests.length, 2, 'One failed response and one ranged continuation are sufficient');
  assert.equal(result.requests[0].status, 200); assert.equal(result.requests[1].status, 206);
  assert(result.requests[1].start >= result.acceptedBeforeCut && result.requests[1].start < bytes.length);
  assert(result.requests[1].start > 0, 'Recovery must preserve the already consumed prefix');
  const progress = result.events.filter((event) => event.stage === 'import');
  assert(progress.some((event) => event.retryAttempt === 1 && event.maxRetries === 5 && event.retryDelayMs > 0));
  assert(progress.every((event, index) => !index || event.loaded >= progress[index - 1].loaded));
  assert.equal(progress.at(-1).loaded, bytes.length);
  assert.equal(result.events.at(-1).stage, 'verify');
  assert.equal(result.records.length, 2); assert(result.records.every((record) => record.pinned && record.status === 'complete'));
});

test('native browser cancellation during retry stops recovery and keeps only the unrelated pinned package', { timeout: 60000 }, async (t) => {
  const result = await interruptedCase(t, 'cancel-retry', true);
  assert.equal(result.result, undefined); assert.equal(result.failure?.name, 'AbortError');
  assert(result.abortLatencyMs < 1500, `Abort took ${result.abortLatencyMs}ms`);
  assert.equal(result.requests.length, 1, 'Aborted retry must not issue a Range request');
  assert.equal(result.events.filter((event) => event.retryAttempt).length, 1);
  assert(!result.events.some((event) => event.stage === 'verify' || event.loaded === bytes.length));
  assert.deepEqual(result.records.map((record) => record.cid), [result.keptCid]);
  await result.page.waitForTimeout(1200);
  assert.equal(result.requests.length, 1, 'Cancelled backoff must not fire after cleanup');
});
