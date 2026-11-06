import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { chromium } from 'playwright';

const repo = fileURLToPath(new URL('../../../', import.meta.url));
test('actual IndexedDB and Web Locks fence two tabs, recover a crash, and acknowledge failed writes', { timeout: 60000 }, async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'peercompute-agent-store-'));
  let browser, server;
  try {
    await writeFile(path.join(temporary, 'index.html'), '<script type="module" src="/fixture.js"></script>');
    await writeFile(path.join(temporary, 'fixture.js'), `
      import {AgentRecordStore} from ${JSON.stringify(path.join(repo, 'peercompute/src/peercompute/agents/AgentRecordStore.js'))};
      window.store = new AgentRecordStore({name:'owned-browser-test'});
      await store.open(); window.ready = true;
      window.holdRun = async (id, checkpoint = false) => {
        window.controller = new AbortController();
        let entered; const ready = new Promise(resolve=>entered=resolve);
        window.running = store.withRun(id, async ({head})=> {
          if(checkpoint) {
            head=await store.commit(id,{expectedRevision:head.revision,head:{...head,status:'running'},
              operation:{id:'interrupted-step',status:'prepared'},event:{type:'intent',text:'Private local task'}});
            await store.commit(id,{expectedRevision:head.revision,operation:{id:'interrupted-step',status:'dispatched'}});
          }
          entered(); await new Promise(resolve=>{window.releaseRun=resolve;});
        },{signal:controller.signal});
        window.running.catch(()=>{}); await ready;
      };
    `);
    const dist = path.join(temporary, 'dist');
    await build({ configFile: false, root: temporary, logLevel: 'silent', build: { target: 'esnext', outDir: dist } });
    server = createServer(async (request, response) => {
      try {
        const url = new URL(request.url, 'http://localhost');
        const filename = path.join(dist, url.pathname === '/' ? 'index.html' : url.pathname.slice(1));
        if (!filename.startsWith(dist + path.sep)) throw new Error('Invalid fixture path');
        response.setHeader('Content-Type', filename.endsWith('.js') ? 'text/javascript' : 'text/html');
        response.end(await readFile(filename));
      } catch { response.writeHead(404); response.end(); }
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true,
      args: ['--disable-gpu', '--disable-software-rasterizer'] });
    const context = await browser.newContext();
    const external = [], errors = [];
    const origin = `http://127.0.0.1:${server.address().port}`;
    await context.route('**/*', (route) => {
      if (new URL(route.request().url()).origin === origin) return route.continue();
      external.push(route.request().url()); return route.abort();
    });
    const a = await context.newPage(), b = await context.newPage();
    for (const page of [a, b]) { page.on('pageerror', (error) => errors.push(error.message)); await page.goto(origin); await page.waitForFunction(() => ready); }
    const created = await a.evaluate(() => store.create({name:'Local Ada',instructions:'Keep private',goals:['Describe'],inferenceMode:'local-only'}));
    assert.deepEqual(await b.evaluate((id)=>store.get(id),created.agentId),created);
    await a.evaluate((id)=>holdRun(id),created.agentId);
    const busy = () => b.evaluate(async id => {
      try { await store.withRun(id,()=>{}); return null; } catch(error) {return error.code;}
    },created.agentId);
    assert.equal(await busy(), 'ERR_AGENT_BUSY');
    await a.evaluate(()=>controller.abort());
    assert.equal(await busy(), 'ERR_AGENT_BUSY', 'Abort must not release before runner cleanup');
    await a.evaluate(async()=>{releaseRun();await running;});
    assert.equal(await busy(), null);
    await a.evaluate((id)=>holdRun(id,true),created.agentId);
    await a.close(); // Browser releases the lock; persisted dispatched work remains unresolved.
    // Page closure and the browser process releasing its Web Lock are separate
    // acknowledgements. Wait for release; never steal a lock on a timer.
    await b.waitForFunction(async (id) => !(await navigator.locks.query()).held.some(
      (lock) => lock.name === `${store.lockName}:run:${id}`), created.agentId, { timeout: 5000 });
    const recovered = await b.evaluate(async id => store.withRun(id, async({head})=>{
      const prior=head.pendingOperation;
      const updated=await store.commit(id,{expectedRevision:head.revision,head:{...head,status:'paused'},
        operation:{id:prior.id,status:'outcome-unknown'}});
      return {prior,updated,operation:await store.getOperation(id,prior.id)};
    }),created.agentId);
    assert.equal(recovered.prior.status,'dispatched'); assert.equal(recovered.updated.status,'paused');
    assert.equal(recovered.updated.pendingOperation,null); assert.equal(recovered.operation.status,'outcome-unknown');
    const failure = await b.evaluate(async id => {
      const before=await store.get(id),original=IDBObjectStore.prototype.put;
      let rejected;
      IDBObjectStore.prototype.put=function(...args){
        if(this.name==='heads')throw new DOMException('Injected actual browser write denial','QuotaExceededError');
        return original.apply(this,args);
      };
      try {await store.commit(id,{expectedRevision:before.revision,event:{text:'Must roll back'}});}
      catch(error){rejected=error.name;} finally{IDBObjectStore.prototype.put=original;}
      return {rejected,before,after:await store.get(id),events:await store.events(id)};
    },created.agentId);
    assert.equal(failure.rejected,'QuotaExceededError'); assert.deepEqual(failure.before,failure.after);
    assert.equal(failure.events.length,1);
    await b.reload(); await b.waitForFunction(()=>ready);
    assert.deepEqual(await b.evaluate(id=>store.get(id),created.agentId),recovered.updated);
    await b.evaluate(async id=>{const head=await store.get(id);await store.delete(id,{expectedRevision:head.revision});await store.destroy();},created.agentId);
    assert.deepEqual(external,[]); assert.deepEqual(errors,[]);
  } finally {
    await browser?.close();
    if(server)await new Promise(resolve=>server.close(resolve));
    await rm(temporary,{recursive:true,force:true});
  }
});
