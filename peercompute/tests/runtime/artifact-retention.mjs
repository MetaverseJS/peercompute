import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { chromium } from 'playwright';

// Native IndexedDB/Web Locks, isolated profile, synthetic data only. Navigation
// interrupts actual provider publication; no libp2p peer or GPU is needed.
const repo = fileURLToPath(new URL('../../../', import.meta.url));
const temporary = await mkdtemp(path.join(tmpdir(), 'peercompute-retention-'));
const reportPath = process.env.ARTIFACT_RETENTION_REPORT;
const bytes = Number(process.env.ARTIFACT_RETENTION_BYTES || 32 * 1024 ** 2 + 17);
assert(Number.isSafeInteger(bytes) && bytes > 1024 ** 2 && bytes <= 256 * 1024 ** 2);
let browser; let server;
const errors = []; const network = [];
const report = { bytes, startedAt: new Date().toISOString(), checks: {} };
const entry = `
import {ArtifactStore, ARTIFACT_MANIFEST_SCHEMA} from ${JSON.stringify(path.join(repo, 'peercompute/src/peercompute/artifacts/ArtifactStore.js'))};
import {ArtifactProviderDiscovery} from ${JSON.stringify(path.join(repo, 'peercompute/src/peercompute/networkManager/ArtifactProviderRecord.js'))};
import {sha256} from ${JSON.stringify(fileURLToPath(import.meta.resolve('@noble/hashes/sha2.js')))};
const name='native-retention';
let store, discovery, release, auditController;
const open=async()=>{if(!store){store=new ArtifactStore({name,capacity:'browser'});await store.open();}return store;};
const manager={config:{gameId:'retention',roomId:'retention',topologyId:'retention'},libp2p:{async handle(){},async unhandle(){},addEventListener(){},removeEventListener(){}}};
const transport={blocks:new Set(),setPublicBlockCids(blocks){this.blocks=new Set(blocks);}};
window.retention={
 async seed(size,variant=0){await open();async function* chunks(){for(let offset=0;offset<size;offset+=65536){const chunk=new Uint8Array(Math.min(65536,size-offset));for(let i=0;i<chunk.length;i++)chunk[i]=(i*31+Math.floor((offset+i)/65537)+variant)%251;yield chunk;}}
 const file=await store.importFile(chunks(),{expectedSize:size,pin:false});
 const root=await store.importManifest({schema:ARTIFACT_MANIFEST_SCHEMA,name:'Synthetic retention fixture',files:[{path:'fixture.bin',cid:file.cid,size:file.size,sha256:file.sha256}]});
 return {root,file,stats:store.getStats()};},
 async heldAnnouncement(cid,fileCid){await open();discovery=new ArtifactProviderDiscovery(manager,transport,store);await discovery.start();
 let entered;const started=new Promise(r=>entered=r);const held=new Promise(r=>release=r);const get=store.backend.get.bind(store.backend);
 store.backend.get=async(collection,key)=>{if(collection==='blocks'&&key===fileCid){entered();await held;}return get(collection,key);};
 this.publication=discovery.announce(cid).then(()=>({ok:true}),e=>({ok:false,message:e.message}));await started;
 return {root:await store.stat(cid),approved:transport.blocks.size};},
 async info(cid){await open();return {root:await store.stat(cid),stats:store.getStats()};},
 async legacy(cid){await open();const root=await store.stat(cid);await store.backend.put('roots',cid,{...root,status:'partial',retain:true});},
 async recover(cid,cancel=false){await open();const controller=new AbortController();const events=[];try{
 const root=await store.ensureLocal(cid,{kind:'manifest',signal:controller.signal,onProgress(event){if(events.length<64)events.push(event);if(cancel&&event.loaded)controller.abort();}});
 return {ok:true,root,events,stats:store.getStats()};}catch(error){return {ok:false,error:{name:error.name,code:error.code,message:error.message},root:await store.stat(cid),events,stats:store.getStats()};}},
 async read(cid){await open();const hash=sha256.create();let size=0;for await(const chunk of store.openRead(cid)){hash.update(chunk);size+=chunk.length;}return {size,sha256:Array.from(hash.digest(),v=>v.toString(16).padStart(2,'0')).join('')};},
 async missing(cid){await open();await store.backend.delete('blocks',cid);},
 async heldAudit(cid,fileCid){await open();auditController=new AbortController();let entered;const started=new Promise(r=>entered=r);const held=new Promise(r=>release=r);const get=store.backend.get.bind(store.backend);let once=true;
 store.backend.get=async(collection,key)=>{if(once&&collection==='blocks'&&key===fileCid){once=false;entered();await held;}return get(collection,key);};
 this.audit=store.ensureLocal(cid,{signal:auditController.signal}).then(()=>({ok:true}),e=>({ok:false,name:e.name}));await started;return true;},
 async finishAudit(){auditController.abort();release();return this.audit;},
 async remove(cid){await open();return store.remove(cid);},
 async close(){release?.();await discovery?.stop();await store?.destroy();store=null;}
};
`;
try {
  await writeFile(path.join(temporary, 'index.html'), '<!doctype html><meta charset="utf-8"><link rel="icon" href="data:,"><script type="module" src="/entry.js"></script>');
  await writeFile(path.join(temporary, 'entry.js'), entry);
  await build({ configFile: false, root: temporary, logLevel: 'error', build: { outDir: 'dist', target: 'esnext', minify: false } });
  server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url, 'http://localhost').pathname;
      const file = path.join(temporary, 'dist', pathname === '/' ? 'index.html' : pathname);
      response.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : 'text/html');
      response.end(await readFile(file));
    } catch { response.statusCode = 404; response.end(); }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launchPersistentContext(path.join(temporary, 'profile'), {
    executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true,
    args: ['--disable-gpu', '--no-sandbox'], viewport: { width: 960, height: 720 }
  });
  await browser.route('**/*', (route) => {
    const url = route.request().url();
    if (!url.startsWith(origin + '/')) { network.push(new URL(url).origin); return route.abort(); }
    return route.continue();
  });
  const attach = (page) => { page.on('pageerror', (error) => errors.push(error.message)); };
  const page = browser.pages()[0]; attach(page);
  await page.goto(origin); await page.waitForFunction(() => window.retention);
  const seeded = await page.evaluate((size) => retention.seed(size), bytes);
  const held = await page.evaluate(({ root, file }) => retention.heldAnnouncement(root.cid, file.cid), seeded);
  assert.equal(held.root.status, 'complete'); assert.equal(held.approved, 0);
  await page.reload(); await page.waitForFunction(() => window.retention);
  const reopened = await page.evaluate((cid) => retention.info(cid), seeded.root.cid);
  assert.equal(reopened.root.status, 'complete'); assert.equal(reopened.root.pinned, true);
  assert.equal(reopened.stats.storedBytes, seeded.stats.storedBytes);
  report.checks.interruptedAnnouncement = { completeAfterNavigation: true, storedBytes: reopened.stats.storedBytes };
  await page.evaluate((cid) => retention.legacy(cid), seeded.root.cid);
  await page.reload(); await page.waitForFunction(() => window.retention);
  const cancelled = await page.evaluate((cid) => retention.recover(cid, true), seeded.root.cid);
  assert.equal(cancelled.error.name, 'AbortError'); assert.equal(cancelled.root.status, 'partial');
  const recovered = await page.evaluate((cid) => retention.recover(cid), seeded.root.cid);
  assert.equal(recovered.ok, true); assert.equal(recovered.root.status, 'complete');
  assert.equal(recovered.events.at(-1).loaded, bytes); assert.equal(recovered.stats.storedBytes, seeded.stats.storedBytes);
  const read = await page.evaluate((cid) => retention.read(cid), seeded.file.cid);
  assert.equal(read.sha256, seeded.file.sha256); assert.equal(read.size, bytes);
  report.checks.legacyRecovery = { cancelledRetainsPartial: true, root: recovered.root.cid, sha256: read.sha256,
    verifiedBytes: read.size, progress: recovered.events, noNetwork: network.length === 0 };
  const damaged = await page.evaluate(() => retention.seed(1024 ** 2 + 31, 1));
  await page.evaluate((cid) => retention.missing(cid), damaged.file.cid);
  const failure = await page.evaluate((cid) => retention.recover(cid), damaged.root.cid);
  assert.equal(failure.error.code, 'ERR_NOT_FOUND'); assert.equal(failure.root.status, 'partial');
  report.checks.missingFailsClosed = failure.error;
  await page.evaluate((cid) => retention.remove(cid), damaged.root.cid);
  const concurrent = await page.evaluate(() => retention.seed(1024 ** 2 + 53, 2));
  await page.evaluate(({ root, file }) => retention.heldAudit(root.cid, file.cid), concurrent);
  const second = await browser.newPage(); attach(second); await second.goto(origin); await second.waitForFunction(() => window.retention);
  let settled = false;
  const deleting = second.evaluate((cid) => retention.remove(cid), concurrent.root.cid).then((result) => { settled = true; return result; });
  await new Promise((resolve) => setTimeout(resolve, 100)); assert.equal(settled, false);
  const audit = await page.evaluate(() => retention.finishAudit()); assert.equal(audit.name, 'AbortError');
  const removed = await deleting; assert.equal(removed.removed, true);
  const retained = await second.evaluate((cid) => retention.info(cid), seeded.root.cid);
  assert.equal(retained.root.status, 'complete');
  report.checks.crossContextDelete = { waitedForAudit: true, removed: true, otherPackageRetained: true };
  await Promise.all([page.evaluate(() => retention.close()), second.evaluate(() => retention.close())]);
  assert.deepEqual(network, []); assert.deepEqual(errors, []);
  report.passed = true;
} catch (error) {
  report.passed = false; report.error = { name: error.name, message: error.message, stack: error.stack }; process.exitCode = 1;
} finally {
  await browser?.close();
  if (server) await new Promise((resolve) => server.close(resolve));
  report.errors = errors; report.externalRequests = network; report.finishedAt = new Date().toISOString();
  if (reportPath) { await mkdir(path.dirname(reportPath), { recursive: true }); await writeFile(reportPath, JSON.stringify(report, null, 2)); }
  console.log(JSON.stringify(report, null, 2));
  await rm(temporary, { recursive: true, force: true });
}
