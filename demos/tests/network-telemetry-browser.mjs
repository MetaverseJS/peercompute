import assert from 'node:assert/strict';
import { build } from 'vite';
import { chromium } from 'playwright';
import { createServer } from 'node:https';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const evidence = process.env.NETVIZ_EVIDENCE || '/tmp/peercompute-netviz-browser';
const netvizBuild = process.env.NETVIZ_BUILD;
assert(netvizBuild, 'Set NETVIZ_BUILD to an external production NetViz build');
await mkdir(evidence, { recursive: true });
const fixture = path.join(evidence, 'fixture');
await mkdir(fixture, { recursive: true });
await writeFile(path.join(fixture, 'index.html'), '<link rel="icon" href="data:,"><title>Owned telemetry fixture</title><script type="module" src="./main.js"></script>');
await writeFile(path.join(fixture, 'main.js'), `
import { NodeKernel } from ${JSON.stringify(path.join(root, 'peercompute/src/peercompute/nodeKernel/NodeKernel.js'))};
import { NetworkManager } from ${JSON.stringify(path.join(root, 'peercompute/src/peercompute/networkManager/NetworkManager.js'))};
import { ComputeManager } from ${JSON.stringify(path.join(root, 'peercompute/src/peercompute/computeManager/ComputeManager.js'))};
import { createModelNetworkTelemetry } from ${JSON.stringify(path.join(root, 'demos/inference/src/modelNetworkTelemetry.js'))};
async function start() {
const p=new URLSearchParams(location.search), game=p.get('game'), role=p.get('role');
const relay=await fetch('https://secretworkshop.net/peercompute/config/relay-config.json').then(r=>r.json());
const config={bootstrapPeers:relay.bootstrapPeers,pubsubType:relay.pubsubType||'gossipsub',gossipsub:relay.gossipsub,
 webrtc:relay.webrtc,transportManager:{faultTolerance:'no-fatal'},gameId:game,roomId:game,topologyId:game,
 useScopedTopics:true,enforceTopologyScope:true,enableWorkers:false,enableGPUHub:false,enablePersistence:false,
 disableStateNetworkProvider:true,disableStateBroadcast:true,enableNetVizSessionBroadcast:role==='world'};
let kernel,manager,compute,binding;
if(role==='world'){kernel=new NodeKernel(config);await kernel.initialize();await kernel.start();manager=kernel.getNetworkManager();compute=kernel.getComputeManager();}
else {manager=new NetworkManager(config);compute=new ComputeManager({enableWorkers:false});await compute.initialize();
 binding=createModelNetworkTelemetry({computeManager:compute,application:game});binding.attach(manager);await manager.initialize();await manager.connect();}
await compute.submitTask({fn:d=>d.a+d.b,data:{a:2,b:3}});
let hosting=true,busy=false,service;
const model={manifestCid:'bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou',modelId:'telemetry-fixture',
 name:'Telemetry fixture model',modalities:['text','image'],runtime:'test-only-injected-service',repository:'fixture/model',revision:'abc123',totalBytes:100};
if(role==='models')service=await manager.createPeerInferenceService({getLocalState:()=>({sharedModels:[],
 hostedModel:hosting?model:null,busy,idleForMs:0}),generate:()=>{throw Error('This test never runs inference');}});
window.fixture={manager,kernel,compute,get peerId(){return manager.peerId},
 async setHosting(v){hosting=v;service?.setHostingEnabled(v);await manager.getNetworkTelemetryService().publish()},
 async setBusy(v){busy=v;await manager.getNetworkTelemetryService().publish()},
 async stopReports(){await manager.getNetworkTelemetryService().stop()},
 async close(){binding?.dispose();if(kernel)await kernel.stop();else {await manager.disconnect();await compute.destroy();}}};
await manager.getNetworkTelemetryService().publish();
}
void start().catch(error=>{window.fixtureError=error.message;console.error(error);});
`);
await build({ configFile: false, root: fixture, base: './', worker: { format: 'es' },
  build: { target: 'esnext', outDir: path.join(evidence, 'fixture-build'), emptyOutDir: true } });

const tls = process.env.PREVIEW_TLS || '/home/cos/.cache/peercompute-preview/tls';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm' };
const server = createServer({ key: await readFile(path.join(tls, 'fastbox.key')), cert: await readFile(path.join(tls, 'fastbox.crt')) }, async (req, res) => {
  try {
    const url = new URL(req.url, 'https://localhost'), segment = url.pathname.startsWith('/netviz/') ? 'netviz' : 'fixture';
    const base = path.resolve(segment === 'netviz' ? netvizBuild : path.join(evidence, 'fixture-build'));
    const relative = url.pathname.slice(segment.length + 2) || 'index.html';
    const file = path.resolve(base, decodeURIComponent(relative));
    assert(file.startsWith(base + path.sep)); const info = await stat(file); assert(info.isFile());
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream',
      'content-length': info.size, 'cross-origin-opener-policy': 'same-origin', 'cross-origin-embedder-policy': 'require-corp' });
    const stream = createReadStream(file); stream.on('error', () => res.destroy()); res.on('close', () => stream.destroy()); stream.pipe(res);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0, '0.0.0.0', resolve));
const origin = `https://fastbox.tail5c077c.ts.net:${server.address().port}`;
const browser = await chromium.launch({ executablePath: '/bin/google-chrome', headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-webgpu'] });
const pages = [], errors = [], warnings = [], report = { startedAt: new Date().toISOString(),
  scope: 'Real NodeKernel and two standalone model NetworkManagers over SecretWorkshop in owned browser contexts; model descriptors are fixtures, no inference/download.', checks: {} };
const opened = async (url, label) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } }), page = await context.newPage(); pages.push(page);
  page.on('pageerror', error => errors.push({ label, error: error.message }));
  page.on('console', message => { if (message.type() === 'error') errors.push({ label, error: message.text() }); else if (message.type() === 'warning') warnings.push({ label, warning: message.text() }); });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); return page;
};
try {
  const prefix = `netviz-owned-${Date.now()}`;
  const world = await opened(`${origin}/fixture/?game=${prefix}-world&role=world`, 'world');
  const hostA = await opened(`${origin}/fixture/?game=${prefix}-alpha&role=models`, 'host-a');
  const hostB = await opened(`${origin}/fixture/?game=${prefix}-beta&role=models`, 'host-b');
  for (const page of [world, hostA, hostB]) {
    await page.waitForFunction(() => window.fixture || window.fixtureError, null, { timeout: 60000 });
    assert.equal(await page.evaluate(() => window.fixtureError), undefined);
  }
  const ids = await Promise.all([world, hostA, hostB].map(p => p.evaluate(() => fixture.peerId)));
  const viz = await opened(`${origin}/netviz/?autoConnect=1`, 'netviz');
  await viz.waitForFunction(ids => ids.every(id => __NETVIZ__?.getStatus().reports.some(r => r.peerId === id)), ids, { timeout: 60000 });
  await viz.waitForFunction(() => __NETVIZ__.getStatus().observed.models.some(m => m.name === 'Telemetry fixture model' && m.hostCount === 2), null, { timeout: 30000 });
  report.checks.initial = await viz.evaluate(() => __NETVIZ__.getStatus());
  assert.equal(report.checks.initial.view, 'all');
  assert(report.checks.initial.reports.filter(r => ids.includes(r.peerId)).every(r => r.compute.totalTasksCompleted >= 1));
  assert(!JSON.stringify(report.checks.initial.reports).includes('activeTaskGraphs'));
  await viz.screenshot({ path: path.join(evidence, 'desktop.png') });
  await viz.setViewportSize({ width: 390, height: 844 });
  await viz.screenshot({ path: path.join(evidence, 'mobile.png') });
  assert(await viz.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await viz.setViewportSize({ width: 1440, height: 1000 });
  await hostA.evaluate(() => fixture.setHosting(false));
  await viz.waitForFunction(() => __NETVIZ__.getStatus().observed.models.find(m => m.name === 'Telemetry fixture model')?.hostCount === 1, null, { timeout: 20000 });
  report.checks.hostingDisabled = true;
  await hostB.evaluate(() => fixture.setBusy(true));
  await viz.waitForFunction(() => __NETVIZ__.getStatus().observed.models.find(m => m.name === 'Telemetry fixture model')?.busy === true, null, { timeout: 20000 });
  report.checks.busy = true;
  const appFilter = viz.locator('#application-filter');
  await appFilter.selectOption(`${prefix}-world`);
  await viz.waitForFunction(id => __NETVIZ__.getStatus().observed.reports.length === 1 && __NETVIZ__.getStatus().observed.reports[0].peerId === id, ids[0]);
  assert.equal(await viz.locator('#hosted-models').textContent(), 'No fresh reports advertise hosted models.');
  await appFilter.selectOption('');
  const session = await viz.evaluate(id => __NETVIZ__.getStatus().attachSessions.find(s => s.peerId === id), ids[0]); assert(session);
  await viz.locator('#attach-session-select').selectOption(session.sessionId); await viz.locator('#attach-session-btn').click();
  await viz.waitForFunction(({ id, game }) => { const s = __NETVIZ__.getStatus(); return s.connectionState === 'connected' && s.gameId === game && s.peers.some(p => p.peerId === id); }, { id: ids[0], game: `${prefix}-world` }, { timeout: 60000 });
  report.checks.crossGameAttach = true;
  await viz.locator('#network-view').selectOption('all');
  await viz.waitForFunction(id => __NETVIZ__.getStatus().reports.some(r => r.peerId === id), ids[2], { timeout: 20000 });
  await hostB.evaluate(() => fixture.stopReports());
  await viz.waitForFunction(id => __NETVIZ__.getStatus().observed.reports.find(r => r.peerId === id)?.stale, ids[2], { timeout: 25000 });
  assert(!(await viz.evaluate(() => __NETVIZ__.getStatus().observed.models)).some(m => m.name === 'Telemetry fixture model'));
  report.checks.staleExcludedFromHosts = true;
  assert.deepEqual(errors, []); report.passed = true;
} catch (error) {
  report.failure = error.stack; process.exitCode = 1;
  report.peerStates = await Promise.all(pages.map(page => page.evaluate(() => ({
    fixtureError: window.fixtureError, peerId: window.fixture?.peerId,
    telemetry: window.fixture?.manager?.getNetworkTelemetryService()?.getStatus(),
    viewer: window.__NETVIZ__?.getStatus()
  })).catch(() => null)));
}
finally {
  for (const page of pages.reverse()) await page.evaluate(async () => { if (window.fixture) await fixture.close(); else await window.__NETVIZ__?.disconnect(); }).catch(error => errors.push({ cleanup: error.message }));
  await browser.close(); await new Promise(resolve => server.close(resolve));
  report.errors = errors; report.warnings = warnings;
  await writeFile(path.join(evidence, 'report.json'), JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ passed: report.passed, checks: Object.keys(report.checks), errors, failure: report.failure }));
