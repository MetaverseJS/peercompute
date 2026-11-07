import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { createHeliaLight } from 'helia';
import { withLibp2pLight } from '@helia/libp2p';
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';

// Explicit hardware acceptance with existing owned test profiles. Never point
// these overrides at a person's normal Chrome profile. No Hub downloads occur.
const repo = fileURLToPath(new URL('../../', import.meta.url));
const evidence = process.env.MULTIMODAL_EVIDENCE || '/home/cos/.cache/peercompute-multimodal-console-20261107/hardware';
const speechCache = process.env.SPEECH_CACHE || '/mnt/data2/peercompute-world-speech';
const profiles = [process.env.MULTIMODAL_HOST_PROFILE || '/mnt/data2/peercompute-support-tests/gemma-profile',
  process.env.MULTIMODAL_VISITOR_PROFILE || '/mnt/data2/peercompute-support-tests/smol-vision-profile'];
const origins = ['https://127.0.0.1:5291', 'https://127.0.0.1:5295'];
const speechCatalog = JSON.parse(await readFile(path.join(speechCache, 'catalog.json'), 'utf8'));
await mkdir(evidence, { recursive: true });
const report = { startedAt: new Date().toISOString(), external: [], pageErrors: [], consoleErrors: [], cleanup: [], calls: [] };
let relay, phase = 'startup';
const servers = [], contexts = [], pages = [];
const save = () => writeFile(path.join(evidence, 'report.json'), JSON.stringify(report, null, 2));
async function bounded(promise, ms = 60000, label = phase) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timed out`)), ms); })]); }
  finally { clearTimeout(timer); }
}
const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><style>html,body{margin:0;height:100%;background:#0c1813}</style></head><body class="pc-inference-standalone"><script type="module">
import {createInferenceRuntime} from '/src/runtime.js';
import {mountInferencePanel} from '/src/agentPanel.js';
import {createWorldSpeech} from '/@fs${repo}/demos/shared/agents/speech/WorldSpeech.js';
import {createWorldAudio} from '/@fs${repo}/demos/shared/agents/speech/WorldAudio.js';
import {NetworkManager} from '/@fs${repo}/peercompute/src/peercompute/networkManager/NetworkManager.js';
import {multiaddr} from '/@fs${repo}/node_modules/@multiformats/multiaddr/dist/src/index.js';
window.calls=[];window.events=[];window.playbacks=[];
window.start=async({relayAddress,scope,index})=>{
 window.network=new NetworkManager({gameId:scope,roomId:scope,topologyId:scope,bootstrapPeers:[relayAddress],allowLocalDial:true,
 pubsubPeerDiscovery:false,enableTopologyController:false,enableTelemetry:false,enablePeerDirectory:false,enableRelayDirectPeers:false,debugOutput:false,dialTimeoutMs:25000,
 webrtc:{rtcConfiguration:{iceServers:[]},dropRelayOnDirect:false,dropRelayBootstrapOnDirect:false}});
 await network.initialize();await network.connect();
 window.runtime=await createInferenceRuntime({networkManager:network,storeName:index===0?'model-support-acceptance':'vision-image-reuse',collectGpuEvidence:true});
 await runtime.setSharing(false);await runtime.setHostInference(false);await runtime.connect(relayAddress);
 runtime.getStartupModel=()=>null;
 const generate=runtime.generate.bind(runtime);
 runtime.generate=async(target,input)=>{const call={target,task:input.task,requestId:input.requestId,prompt:input.prompt};calls.push(call);
 try{const result=await generate(target,{...input,maxNewTokens:32,onProgress:event=>{events.push(event);if(events.length>100)events.shift();input.onProgress?.(event)}});
 call.result={...result,audio:undefined,image:undefined,samples:result.audio?.length};return result;}catch(error){call.error={message:error.message,code:error.code};throw error;}};
 window.panel=await mountInferencePanel({runtimeFactory:async()=>runtime,refreshIntervalMs:1000,audioFactory:()=>{
 const audio=createWorldAudio(),play=audio.play.bind(audio);audio.play=async(pcm,opts)=>{const record={samples:pcm.audio.length,sampleRate:pcm.sampleRate};playbacks.push(record);await play(pcm,opts);record.completed=true;};return audio;}});
 window.speech=createWorldSpeech({runtime,collectGpuEvidence:true,sourceUrl:(entry,file)=>location.origin+'/__speech_source/'+entry.id+'/'+file.path});
 return {peerId:network.libp2p.peerId.toString(),addresses:network.libp2p.getMultiaddrs().map(String)};
};
window.cached=async(repository)=>{for(const record of await runtime.listStoredModels()){const manifest=await runtime.store.getManifest(record.manifestCid);if(manifest.model.repository===repository)return{...record,manifest};}throw new Error('Owned cached model missing: '+repository)};
window.dial=address=>network.libp2p.dial(multiaddr(address));
window.fixture=async()=>{const bytes=await(await fetch('/__speech_fixture')).arrayBuffer(),context=new AudioContext();try{const decoded=await context.decodeAudioData(bytes),offline=new OfflineAudioContext(1,Math.ceil(decoded.duration*16000),16000),source=offline.createBufferSource();source.buffer=decoded;source.connect(offline.destination);source.start();return {samples:new Float32Array((await offline.startRendering()).getChannelData(0)),sampleRate:16000};}finally{await context.close()}};
window.closeFixture=async()=>{await speech?.dispose();await panel?.dispose();await network?.disconnect()};
window.ready=true;
</script></body></html>`;

try {
  const https = { key: await readFile(path.join(repo, 'certs/dev-key.pem')), cert: await readFile(path.join(repo, 'certs/dev-cert.pem')) };
  relay = withLibp2pLight(createHeliaLight(), { addresses: { listen: ['/ip4/127.0.0.1/tcp/0/wss'] },
    transports: [webSockets({ https })], connectionEncrypters: [noise()], streamMuxers: [yamux()],
    services: { identify: identify(), relay: circuitRelayServer({ reservations: { applyDefaultLimit: false } }) },
    connectionManager: { inboundConnectionThreshold: Infinity, maxConnections: 16 }, peerDiscovery: [] });
  await relay.start();
  const relayAddress = relay.libp2p.getMultiaddrs()[0].toString(), scope = `multimodal-${crypto.randomUUID()}`;
  for (const [index, origin] of origins.entries()) {
    const server = await createServer({ configFile: path.join(repo, 'demos/inference/vite.config.js'), logLevel: 'error',
      server: { host: '127.0.0.1', port: Number(new URL(origin).port), strictPort: true, hmr: false },
      plugins: [{ name: 'multimodal-acceptance', configureServer(vite) { vite.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, origin);
        if (url.pathname === '/__multimodal') { res.setHeader('Content-Type', 'text/html'); res.end(html); return; }
        if (url.pathname === '/__speech_fixture') { res.setHeader('Content-Type', 'audio/wav'); createReadStream(path.join(speechCache, 'jfk.wav')).pipe(res); return; }
        if (url.pathname.startsWith('/__speech_source/')) {
          const [id, ...parts] = decodeURIComponent(url.pathname.slice('/__speech_source/'.length)).split('/');
          const file = speechCatalog[id]?.files.find(item => item.path === parts.join('/'));
          if (!file) { res.statusCode = 404; res.end(); return; }
          res.setHeader('Content-Length', file.size); res.setHeader('Content-Type', 'application/octet-stream');
          createReadStream(path.join(speechCache, 'sources', id, file.path)).pipe(res); return;
        }
        next();
      }); } }] });
    servers.push(server); await server.listen();
    const context = await chromium.launchPersistentContext(profiles[index], { executablePath: '/opt/google/chrome/chrome', headless: true,
      ignoreHTTPSErrors: true, viewport: { width: 1280, height: 900 }, permissions: ['microphone'],
      args: ['--enable-gpu', '--enable-unsafe-webgpu', '--enable-features=Vulkan,VulkanFromANGLE', '--use-angle=vulkan',
        '--use-vulkan=native', '--disable-vulkan-surface', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream',
        '--use-file-for-fake-audio-capture=' + path.join(speechCache, 'jfk.wav')] });
    contexts.push(context);
    await context.route('**/*', route => { const url = new URL(route.request().url());
      if (origins.includes(url.origin)) return route.continue(); report.external.push(url.origin + url.pathname); return route.abort(); });
    const page = await context.newPage(); pages.push(page);
    page.on('pageerror', error => report.pageErrors.push({ index, message: error.message }));
    page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push({ index, message: message.text().slice(0, 1000) }); });
    await page.goto(origin + '/__multimodal'); await page.waitForFunction(() => window.ready, null, { timeout: 90000 });
    report[`peer${index}`] = await bounded(page.evaluate(options => start(options), { relayAddress, scope, index }), 90000);
  }
  const [host, visitor] = pages;
  phase = 'connect';
  await host.evaluate(address => dial(address), relayAddress + '/p2p-circuit/p2p/' + report.peer1.peerId);
  phase = 'load-cached'; console.log('Loading cached Gemma, Moonshine and Supertonic');
  report.gemma = await host.evaluate(() => cached('onnx-community/gemma-3-270m-it-ONNX'));
  await bounded(host.evaluate(cid => runtime.loadStoredModel(cid), report.gemma.manifestCid), 300000);
  report.speech = await bounded(host.evaluate(() => speech.prepare()), 300000);
  report.residents = await host.evaluate(() => runtime.listResidentModels()); assert.equal(report.residents.length, 3);
  assert.equal(new Set(report.residents.map(item => item.sessionId)).size, 3);
  await host.evaluate(async () => { await runtime.setHostInference(true); await panel.refreshPeers(); });
  await visitor.evaluate(() => panel.refreshPeers());
  phase = 'remote-speech'; console.log('Routing real ASR, text and TTS to private peer');
  report.remoteAsr = await bounded(visitor.evaluate(async () => runtime.generate('mixed', { task: 'automatic-speech-recognition', audio: await fixture() })), 120000);
  assert.match(report.remoteAsr.text.toLowerCase(), /ask not what your country can do for you/); assert.equal(report.remoteAsr.route.local, false);
  report.remoteText = await bounded(visitor.evaluate(() => runtime.generate('mixed', { task: 'text-generation', prompt: 'Reply only: Hello friend.' })), 120000);
  assert(report.remoteText.text.trim()); assert.equal(report.remoteText.route.local, false);
  report.remoteTts = await bounded(visitor.evaluate(async () => { const r = await runtime.generate('mixed', { task: 'text-to-speech', prompt: 'Hello friend.' });
    let energy=0;for(const v of r.audio)energy+=v*v;return {...r,audio:undefined,samples:r.audio.length,rms:Math.sqrt(energy/r.audio.length)}; }), 120000);
  assert(report.remoteTts.samples > 1000); assert(report.remoteTts.rms > 0.001); assert.equal(report.remoteTts.route.local, false);
  await save();
  phase = 'native-voice'; console.log('Native console Talk / Stop / reply / playback using peer workers');
  await visitor.getByLabel('Speak replies', { exact: true }).check();
  await visitor.getByRole('button', { name: 'Talk', exact: true }).click();
  await visitor.getByRole('button', { name: 'Stop recording', exact: true }).waitFor();
  await visitor.waitForTimeout(6200);
  await visitor.getByRole('button', { name: 'Stop recording', exact: true }).click();
  await visitor.waitForFunction(() => playbacks.length > 0 && playbacks.every(item => item.completed) && [...document.querySelectorAll('button')].some(button => button.textContent === 'Talk' && !button.disabled), null, { timeout: 180000 });
  report.nativeVoice = await visitor.evaluate(() => ({ calls, playbacks, text: document.querySelector('[role=log]').textContent }));
  await visitor.screenshot({ path: path.join(evidence, 'peer-voice-desktop.png') }); await save();
  phase = 'same-backend-residents'; console.log('Loading cached vision package from the private peer');
  report.smol = await visitor.evaluate(async () => { const records = await runtime.listStoredModels();
    const found=records.find(item=>/SmolVLM.*256|SmolVLM-256/i.test(item.name ?? item.model?.repository ?? ''));if(!found)throw new Error('Cached SmolVLM missing');
    await runtime.setSharing(true);await runtime.publish(found.manifestCid);return found; });
  await host.evaluate(() => runtime.refreshPeers());
  await bounded(host.evaluate(cid => runtime.acquireModel('peer:' + cid), report.smol.manifestCid), 300000);
  report.fourResidents = await host.evaluate(() => runtime.listResidentModels()); assert.equal(report.fourResidents.length, 4);
  assert.equal(new Set(report.fourResidents.map(item => item.sessionId)).size, 4);
  phase = 'local-routing';
  report.localText = await host.evaluate(() => runtime.generate('mixed', { task: 'text-generation', prompt: 'Say hello.' }));
  assert.equal(report.localText.route.local, true); assert.equal(report.localText.route.manifestCid, report.gemma.manifestCid);
  report.localVision = await bounded(host.evaluate(async () => { const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;
    const c=canvas.getContext('2d');c.fillStyle='white';c.fillRect(0,0,128,128);c.fillStyle='red';c.fillRect(30,30,68,68);
    return runtime.generate('mixed',{task:'image-text-to-text',prompt:'Describe this image.',image:{data:new Uint8Array(c.getImageData(0,0,128,128).data),width:128,height:128,channels:4}}); }),120000);
  assert.equal(report.localVision.route.local, true); assert.equal(report.localVision.route.manifestCid, report.smol.manifestCid);
  assert(report.localVision.gpuDispatches > 0); assert(report.localText.gpuDispatches > 0);
  phase = 'targeted-unload';
  report.targeted = await host.evaluate(async cid => { await runtime.unload(cid);return runtime.listResidentModels(); }, report.smol.manifestCid);
  assert.equal(report.targeted.length, 3); assert(report.targeted.every(item => item.status === 'ready'));
  await host.setViewportSize({ width: 390, height: 844 });
  for (const name of ['Talk', 'Send']) { const box = await host.getByRole('button', { name, exact: true }).boundingBox(); assert(box && box.y + box.height <= 844); }
  await host.screenshot({ path: path.join(evidence, 'resident-models-mobile.png') });
  report.finalPressure = await host.evaluate(async () => { await speech.dispose();await runtime.unload();return runtime.computeManager.resourceBroker.reportPressure(); });
  assert.equal(report.finalPressure.activeLeaseCount, 0);
  assert.equal(report.external.length, 0); assert.equal(report.pageErrors.length, 0);
  report.passed = true;
} catch (error) { report.passed = false; report.failedPhase = phase; report.failure = { message: error.message, stack: error.stack }; process.exitCode = 1; console.error(error.stack); }
finally {
  for (const page of pages) {
    try { report.calls.push(await page.evaluate(() => ({ calls, events }))); } catch {}
    await bounded(page.evaluate(() => window.closeFixture?.()), 45000, 'fixture cleanup').catch(error => report.cleanup.push(error.message));
  }
  for (const context of contexts) await bounded(context.close(), 20000, 'browser close').catch(error => report.cleanup.push(error.message));
  for (const server of servers) await server.close().catch(error => report.cleanup.push(error.message));
  await relay?.stop().catch(error => report.cleanup.push(error.message));
  if (report.cleanup.length) { report.passed = false; process.exitCode = 1; }
  report.finishedAt = new Date().toISOString(); await save();
  console.log(JSON.stringify({ passed: report.passed, failedPhase: report.failedPhase, evidence, cleanup: report.cleanup }));
}
