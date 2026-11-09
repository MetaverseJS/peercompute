import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { build } from 'vite';
import { chromium } from 'playwright';

// Owned production fixture and browser; no model downloads or public peers.
const repo = fileURLToPath(new URL('../../', import.meta.url));
const evidence = process.env.MOTOR_EVIDENCE ?? '/home/cos/.cache/peercompute-meet-follow-20261109';
const fixture = path.join(evidence, 'motor-browser-fixture'), outDir = path.join(evidence, 'motor-browser-built');
await mkdir(fixture, { recursive: true });
const imports = {
  manager: path.join(repo, 'peercompute/src/peercompute/computeManager/ComputeManager.js'),
  service: path.join(repo, 'demos/shared/agents/motor/ResidentMotorService.js'),
  reference: path.join(repo, 'demos/shared/agents/motor/policyReference.js'),
  checkpoint: path.join(repo, 'demos/shared/agents/motor/residentMotorCheckpoint.js'),
  environment: path.join(repo, 'demos/shared/agents/motor/trainingEnvironment.js'),
};
await writeFile(path.join(fixture, 'index.html'), '<!doctype html><meta charset="utf-8"><title>Owned resident motor verification</title><p>Managed WebGPU motor acceptance</p><script type="module" src="./main.js"></script>');
await writeFile(path.join(fixture, 'main.js'), `
import { ComputeManager } from ${JSON.stringify(imports.manager)};
import { createResidentMotorService } from ${JSON.stringify(imports.service)};
import { referenceMotorAction } from ${JSON.stringify(imports.reference)};
import checkpoint from ${JSON.stringify(imports.checkpoint)};
import { seededRandom, randomObservation } from ${JSON.stringify(imports.environment)};
window.verifyMotor = async () => {
  const manager = new ComputeManager({ requireWorkers:true, enableWorkers:true, enableWebGPU:true,
    minWorkers:1, targetWorkers:1, maxWorkers:2, autoScaleWorkers:false, workerBootstrapTimeoutMs:60000 });
  const service = createResidentMotorService({ computeManager:manager });
  const random = seededRandom(785122); let maximumError=0, report;
  try {
    await manager.initialize();
    for(let trial=0; trial<12; trial++) {
      const batch=Array.from({length:16},(_,i)=>({id:'body'+i,observation:randomObservation(random)}));
      const result=await service.infer(batch);
      if(result.backend!=='webgpu'||result.worker!==true) throw Error('GPU worker execution was not established');
      result.results.forEach((entry,i)=>{
        if(entry.id!==batch[i].id)throw Error('Motor body identity mismatch');
        const expected=referenceMotorAction(checkpoint.weights,batch[i].observation);
        maximumError=Math.max(maximumError,...entry.acceleration.map((v,j)=>Math.abs(v-expected[j])));
      });
    }
    const cancel=new AbortController();
    const pending=service.infer([{id:'cancel',observation:randomObservation(random)}],{signal:cancel.signal});
    cancel.abort(); let cancelled=false;
    try{await pending;}catch(error){cancelled=error.name==='AbortError';}
    if(!cancelled)throw Error('Cancelled motor command escaped');
    report={maximumError,policyId:checkpoint.policyId,status:service.getStatus(),cancelled,
      reservationsBeforeClose:manager.residentWorkerAffinities.size};
    await service.dispose();
    report.statusAfterClose=service.getStatus();report.reservationsAfterClose=manager.residentWorkerAffinities.size;
    return report;
  } finally {await service.dispose();await manager.destroy();}
};
`);
await build({ configFile: false, root: fixture, base: './', logLevel: 'warn', worker: { format: 'es' },
  build: { outDir, emptyOutDir: true, assetsInlineLimit: 0, rollupOptions: { input: path.join(fixture, 'index.html') } } });
const report = { startedAt: new Date().toISOString(), pageErrors: [], consoleErrors: [], external: [] };
let browser, server;
try {
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const file = path.resolve(outDir, `.${pathname === '/' ? '/index.html' : pathname}`);
      if (!file.startsWith(outDir + path.sep)) throw Error('Bad path');
      const bytes = await readFile(file);
      response.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.wasm') ? 'application/wasm' : 'text/html');
      response.end(bytes);
    } catch { response.statusCode = 404; response.end('Not found'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/opt/google/chrome/chrome', headless: true,
    args: ['--enable-gpu', '--enable-unsafe-webgpu', '--enable-features=Vulkan,VulkanFromANGLE', '--use-angle=vulkan', '--use-vulkan=native', '--disable-vulkan-surface'] });
  const cdp = await browser.newBrowserCDPSession();
  report.renderer = (await cdp.send('SystemInfo.getInfo')).gpu.auxAttributes.glRenderer;
  const context = await browser.newContext();
  await context.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    report.external.push(route.request().url()); return route.abort();
  });
  const page = await context.newPage(); page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  await page.goto(origin); await page.waitForFunction(() => typeof window.verifyMotor === 'function');
  report.result = await page.evaluate(() => verifyMotor());
  assert.match(report.renderer, /NVIDIA|AMD|Intel/); assert(report.result.maximumError < 0.002);
  assert.equal(report.result.status.dispatches, 12); assert.equal(report.result.reservationsBeforeClose, 1);
  assert.equal(report.result.reservationsAfterClose, 0); assert.equal(report.result.statusAfterClose.status, 'closed');
  assert.deepEqual(report.pageErrors, []); assert.deepEqual(report.external, []);
  report.pass = true; process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} catch (error) { report.failure = error.stack; throw error; }
finally {
  await browser?.close(); if (server) await new Promise(resolve => server.close(resolve));
  await writeFile(path.join(evidence, 'motor-webgpu-browser.json'), JSON.stringify(report, null, 2));
}
