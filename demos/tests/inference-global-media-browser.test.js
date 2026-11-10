// Two isolated browser peers, actual Noise/circuit streams and image decoding.
// The image provider returns tiny fixed pixels: this qualifies transport and UI,
// not diffusion inference. No production room, model files or GPU are used.
import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { chromium } from 'playwright';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { noise } from 'peercompute-artifact-noise';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const source = (relative) => JSON.stringify(path.join(repo, relative));
const dependency = (name) => JSON.stringify(fileURLToPath(import.meta.resolve(name)));
const fixtureSource = `
import {createLibp2p} from ${dependency('libp2p')};
import {webSockets} from ${dependency('@libp2p/websockets')};
import {circuitRelayTransport} from ${dependency('@libp2p/circuit-relay-v2')};
import {noise} from ${dependency('peercompute-artifact-noise')};
import {yamux} from ${dependency('@libp2p/yamux')};
import {identify} from ${dependency('@libp2p/identify')};
import {multiaddr} from ${dependency('@multiformats/multiaddr')};
import {PeerInferenceService} from ${source('peercompute/src/peercompute/networkManager/inference/PeerInferenceService.js')};
import {createGlobalChatSession} from ${source('demos/inference/src/ui/globalChatSession.js')};
import {createGlobalChatFeed} from ${source('demos/inference/src/ui/globalChatFeed.js')};
import ${source('demos/inference/src/panel.css')};
import ${source('demos/inference/src/ui/chatChannels.css')};
const manifestCid='bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou';
const model={manifestCid,modelId:'transport-fixture',name:'Pixel transport fixture',task:'text-to-image',
 modalities:['text'],outputModalities:['image'],runtime:'test-only-injected-service',repository:'fixture/pixels',revision:'fixture',totalBytes:8};
const pixels=(red)=>({width:2,height:1,channels:4,data:new Uint8Array([red,30,255-red,255,40,50,60,255])});
let node,manager,inference,chat,feed,status='',calls=0;
const events=[];
function startChat(){
 const transcript=document.querySelector('[role=log]'),empty=document.createElement('p');empty.textContent='Global chat';
 transcript.replaceChildren(empty);feed=createGlobalChatFeed({transcript,empty});
 chat=createGlobalChatSession({getNetworkManager:()=>manager,onStatus:value=>{status=value;document.querySelector('#status').textContent=value},
 onEvent:async event=>{events.push({phase:event.phase,turnId:event.turnId,peerId:event.peerId,local:!!event.local});await feed.append(event)}});
 return chat.refresh();
}
window.fixture={
 async start({relayAddress,scope,host}){
  node=await createLibp2p({addresses:{listen:[relayAddress+'/p2p-circuit']},transports:[webSockets(),circuitRelayTransport()],
   connectionEncrypters:[noise()],streamMuxers:[yamux()],services:{identify:identify()},connectionGater:{denyDialMultiaddr:()=>false}});
  manager={libp2p:node,getLibp2pNode:()=>node,config:scope,peers:new Map(),
   bootstrapPeerIds:new Set([relayAddress.split('/p2p/')[1]]),_maybeDialPeer:async()=>{},
   sendToPeer(){throw Error('Public media must not use pubsub')}};
  inference=await new PeerInferenceService(manager,{queryTimeoutMs:5000,requestTimeoutMs:10000,
   getLocalState:()=>({sharedModels:[],hostedModels:host?[model]:[],busy:false,idleForMs:0}),
   generate:async()=>{calls++;return{text:'',image:pixels(0),finishReason:'stop'}}}).start();
  await startChat();return{peerId:node.peerId.toString(),addresses:node.getMultiaddrs().map(String)};
 },
 async connect({peerId,address}){manager.peers.set(peerId,{...manager.config});if(address)await node.dial(multiaddr(address));},
 async publish(kind){
  let image=pixels(kind==='attachment'?255:120),receipt;
  if(kind==='remote'){
   const result=await inference.generate(manifestCid,{task:'text-to-image',prompt:'Transport fixture only'});image=result.image;
   if(!image.sha256)throw Error('Expected the actual peer decoder digest');
   receipt={peerId:result.peerId,sha256:image.sha256,encryption:result.connectionEncryption,imageKeys:Object.keys(image)};
  }
  chat.publish({turnId:kind,phase:kind==='attachment'?'prompt':'result',name:'Fixture author',
   text:kind==='attachment'?'Attached pixels':'',image});
  await chat.refresh();return receipt??null;
 },
 async restartChat(){await chat.close();feed.dispose();await startChat();},
 async refresh(){await chat.refresh();},
 async inspect(){
  const images=[];for(const element of document.querySelectorAll('.pc-global-turn img')){
   await element.decode();const canvas=document.createElement('canvas');canvas.width=element.naturalWidth;canvas.height=element.naturalHeight;
   const ctx=canvas.getContext('2d');ctx.drawImage(element,0,0);
   images.push({turnId:element.closest('.pc-global-turn').dataset.turnId,pixels:[...ctx.getImageData(0,0,canvas.width,canvas.height).data]});
  }
  return{images,status,events:[...events],calls,connections:node.getConnections().map(c=>({peerId:c.remotePeer.toString(),encryption:c.encryption}))};
 },
 async close(){await chat?.close();feed?.dispose();await inference?.stop();await node?.stop();}
};window.fixtureReady=true;
`;

test('peer-generated images and attachments reach both Global feeds and late history with their exact pixels', { timeout: 180000 }, async () => {
  const temporary = await mkdtemp(path.join(tmpdir(), 'pc-global-media-'));
  const evidence = process.env.GLOBAL_CHAT_IMAGE_EVIDENCE;
  if (evidence) await mkdir(evidence, { recursive: true });
  const report = { startedAt: new Date().toISOString(), kind: 'tiny-pixel transport fixture; no model inference',
    phase: 'build', pageErrors: [], consoleErrors: [], externalRequests: [], cleanup: [] };
  const checkpoint = async (phase) => {
    report.phase = phase;
    if (evidence) await writeFile(path.join(evidence, 'report.json'), JSON.stringify(report, null, 2));
  };
  const browsers = [], pages = [];
  let relay, server, failure;
  try {
    await checkpoint('build');
    const dist = path.join(temporary, 'dist'), entry = '\0global-media-fixture';
    const bundle = await build({ configFile: false, root: repo, logLevel: 'error',
      plugins: [{ name: 'global-media-fixture', resolveId(id) { if (id === 'global-media-fixture') return entry; },
        load(id) { if (id === entry) return fixtureSource; } }],
      build: { target: 'esnext', outDir: dist, emptyOutDir: true, rollupOptions: { input: 'global-media-fixture' } } });
    const output = bundle.output, script = output.find((item) => item.isEntry).fileName;
    const styles = output.filter((item) => item.fileName.endsWith('.css')).map((item) => `<link rel="stylesheet" href="/${item.fileName}">`).join('');
    await writeFile(path.join(dist, 'index.html'), `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,">${styles}<style>body{margin:0;background:#0c1813;color:#bde8cf}main{height:100dvh;padding:20px;box-sizing:border-box}</style><main class="pc-inference-panel"><h1>Global media transport check</h1><p id="status"></p><div class="pc-inference-transcript" role="log"></div></main><script type="module" src="/${script}"></script>`);
    await checkpoint('local fixture server and relay');
    server = createServer(async (request, response) => {
      try {
        const pathname = new URL(request.url, 'http://localhost').pathname;
        const filename = path.resolve(dist, '.' + (pathname === '/' ? '/index.html' : pathname));
        if (!filename.startsWith(dist + path.sep)) throw Error('Invalid fixture path');
        response.setHeader('Content-Type', filename.endsWith('.js') ? 'text/javascript' : filename.endsWith('.css') ? 'text/css' : 'text/html');
        response.end(await readFile(filename));
      } catch { response.writeHead(404); response.end(); }
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    relay = await createLibp2p({ addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] }, transports: [webSockets()],
      connectionEncrypters: [noise()], streamMuxers: [yamux()],
      services: { identify: identify(), relay: circuitRelayServer({ reservations: { applyDefaultLimit: false } }) } });
    const relayAddress = relay.getMultiaddrs()[0].toString(), name = `global-images-${crypto.randomUUID()}`;
    const scope = { gameId: name, roomId: name, topologyId: name }; report.scope = scope;
    await checkpoint('two isolated browser peers'); report.peers = [];
    for (let index = 0; index < 2; index++) {
      const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome',
        headless: true, args: ['--disable-gpu'] }); browsers.push(browser);
      const page = await browser.newPage({ viewport: { width: 900, height: 650 } }); pages.push(page);
      page.on('pageerror', (error) => report.pageErrors.push({ index, message: error.message }));
      page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push({ index, message: message.text() }); });
      await page.route('**/*', (route) => {
        if (new URL(route.request().url()).origin === origin) return route.continue();
        report.externalRequests.push(route.request().url()); return route.abort();
      });
      await page.goto(origin); await page.waitForFunction(() => window.fixtureReady);
      report.peers.push(await page.evaluate((options) => fixture.start(options), { relayAddress, scope, host: index === 1 }));
      await checkpoint(`peer ${index} ready`);
    }
    const [sender, receiver] = pages;
    assert.notEqual(report.peers[0].peerId, report.peers[1].peerId);
    await receiver.evaluate((peerId) => fixture.connect({ peerId }), report.peers[0].peerId);
    await sender.evaluate((options) => fixture.connect(options), { peerId: report.peers[1].peerId,
      address: relayAddress + '/p2p-circuit/p2p/' + report.peers[1].peerId });
    for (const kind of ['attachment', 'local', 'remote']) {
      await checkpoint(kind);
      const receipt = await sender.evaluate((kind) => fixture.publish(kind), kind);
      if (receipt) report.peerImageReceipt = receipt;
      await receiver.locator(`.pc-global-turn[data-turn-id="${kind}"] img`).waitFor({ timeout: 15000 });
      await sender.locator(`.pc-global-turn[data-turn-id="${kind}"] img`).waitFor({ timeout: 15000 });
    }
    const expected = [255, 120, 0].map((red, index) => ({ turnId: ['attachment', 'local', 'remote'][index],
      pixels: [red, 30, 255 - red, 255, 40, 50, 60, 255] }));
    report.sender = await sender.evaluate(() => fixture.inspect()); report.receiver = await receiver.evaluate(() => fixture.inspect());
    assert.deepEqual(report.sender.images, expected); assert.deepEqual(report.receiver.images, expected);
    assert.equal(report.peerImageReceipt.peerId, report.peers[1].peerId);
    assert.equal(report.peerImageReceipt.encryption, '/noise');
    assert.match(report.peerImageReceipt.sha256, /^[a-f0-9]{64}$/);
    assert.equal(report.receiver.calls, 1); assert.equal(report.sender.calls, 0);
    await checkpoint('late original-author history');
    await receiver.evaluate(() => fixture.restartChat());
    await receiver.waitForFunction(() => document.querySelectorAll('.pc-global-turn img').length === 3);
    report.lateHistory = await receiver.evaluate(() => fixture.inspect());
    assert.deepEqual(report.lateHistory.images, expected); assert.equal(report.lateHistory.calls, 1, 'History never invokes the model callback');
    assert(!report.sender.status.includes('could not be shared')); assert(!report.receiver.status.includes('could not be shared'));
    if (evidence) {
      await sender.screenshot({ path: path.join(evidence, 'sender-desktop.png') });
      await receiver.setViewportSize({ width: 390, height: 844 });
      await receiver.screenshot({ path: path.join(evidence, 'receiver-mobile.png') });
    }
    assert.deepEqual(report.pageErrors, []); assert.deepEqual(report.consoleErrors, []); assert.deepEqual(report.externalRequests, []);
    report.passed = true;
  } catch (error) { failure = error; report.error = { message: error.message, stack: error.stack }; }
  finally {
    for (const [index, page] of pages.entries()) {
      try { await page.evaluate(() => window.fixture?.close()); report.cleanup.push(`peer-${index}-closed`); }
      catch (error) { report.cleanup.push(`peer-${index}: ${error.message}`); failure ??= error; report.passed = false; }
    }
    for (const browser of browsers) await browser.close();
    await relay?.stop();
    if (server) await new Promise((resolve) => server.close(resolve));
    await rm(temporary, { recursive: true, force: true }); report.cleanup.push('browsers-relay-server-temporary-files-closed');
    if (evidence) await writeFile(path.join(evidence, 'report.json'), JSON.stringify(report, null, 2));
  }
  if (failure) throw failure;
});
