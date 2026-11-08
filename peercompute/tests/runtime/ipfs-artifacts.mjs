import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { chromium } from 'playwright';
import { createHeliaLight } from 'helia';
import { withLibp2pLight } from '@helia/libp2p';
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { MODEL_CATALOG } from '../../src/peercompute/inference/modelCatalog.js';
import { normalizeArtifactManifest } from '../../src/peercompute/artifacts/ArtifactManifest.js';

const sourceRoot = fileURLToPath(new URL('../../src/peercompute/', import.meta.url));
const modelId = process.env.IPFS_ARTIFACT_MODEL;
let modelPackage;
if (modelId) {
  const catalog = MODEL_CATALOG[modelId];
  assert(catalog, `Unknown IPFS_ARTIFACT_MODEL: ${modelId}`);
  const cacheRoot = process.env.PEERCOMPUTE_ARTIFACT_CACHE || path.join(homedir(), '.cache/peercompute-artifacts');
  const directory = path.join(cacheRoot, 'packages', modelId);
  const manifest = normalizeArtifactManifest(JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8')));
  const descriptor = JSON.parse(await readFile(path.join(directory, 'descriptor.json'), 'utf8'));
  assert.equal(descriptor.modelId, modelId);
  assert.equal(manifest.model.revision, catalog.revision);
  modelPackage = { manifest, manifestCid: descriptor.manifestCid,
    sourceRoot: path.join(cacheRoot, 'sources', modelId, catalog.revision) };
}
const size = modelPackage ? modelPackage.manifest.files.reduce((sum, file) => sum + file.size, 0)
  : Number(process.env.IPFS_ARTIFACT_BYTES || 2 * 1024 * 1024 + 99);
if (!modelPackage && (!Number.isSafeInteger(size) || size < 1 || size > 512 * 1024 * 1024)) {
  throw new RangeError('IPFS_ARTIFACT_BYTES must be 1 through 536870912');
}
const fixtureByte = (index) => {
  const withinBlock = index % 262144;
  // Each UnixFS leaf has a distinct header, preventing deduplication from
  // turning the large-transfer gate into a much smaller network transfer.
  return withinBlock < 4 ? (Math.floor(index / 262144) >>> (withinBlock * 8)) & 255
    : (index * 31 + (index >> 9)) % 251;
};
const expectedHasher = createHash('sha256');
for (let offset = 0; !modelPackage && offset < size; offset += 32768) {
  const chunk = new Uint8Array(Math.min(32768, size - offset));
  for (let index = 0; index < chunk.length; index++) chunk[index] = fixtureByte(offset + index);
  expectedHasher.update(chunk);
}
const expectedHash = expectedHasher.digest('hex');
const temporary = await mkdtemp(path.join(tmpdir(), 'peercompute-ipfs-runtime-'));
const publicRequests = [];
const forbiddenSeedRequests = [];
const pageErrors = [];
const pages = [];
let seedEnabled = true;
let seedRequests = 0;
let seedBytes = 0;
let browser;
let relay;
let server;

const browserEntry = `
import { ArtifactStore } from ${JSON.stringify(path.join(sourceRoot, 'artifacts/ArtifactStore.js'))};
import { NetworkManager } from ${JSON.stringify(path.join(sourceRoot, 'networkManager/NetworkManager.js'))};
import { multiaddr } from ${JSON.stringify(fileURLToPath(import.meta.resolve('@multiformats/multiaddr')))};
import { sha256 } from ${JSON.stringify(fileURLToPath(import.meta.resolve('@noble/hashes/sha2.js')))};
const fixtureByte = ${fixtureByte.toString()};
window.artifactsTest = {
  async start(relayAddress) {
    this.store = new ArtifactStore({name:'ipfs-runtime',maximumBytes:${Math.max(16 * 1024 * 1024, size * 2 + 1048576)}});
    this.network = new NetworkManager({
      gameId:'ipfs-runtime',roomId:'ipfs-runtime',topologyId:'ipfs-runtime',
      bootstrapPeers:[relayAddress],allowLocalDial:true,pubsubPeerDiscovery:false,
      enableTopologyController:false,enableTelemetry:false,enablePeerDirectory:false,
      enableRelayDirectPeers:false,debugOutput:false,
      webrtc:{rtcConfiguration:{iceServers:[]},dropRelayOnDirect:false,dropRelayBootstrapOnDirect:false}
    });
    await this.network.initialize();await this.network.connect();
    this.transport = await this.network.createArtifactTransport(this.store,{
      relayAddresses:[relayAddress], enableWebRTC:true,
      rtcConfiguration:{iceServers:[]},allowInsecureLocalConnections:true,
      requestTimeoutMs:20000
    });
    return this.info();
  },
  info() {return {...this.transport.getPeerInfo(),appPeerId:this.network.libp2p.peerId.toString(),appAddresses:this.network.libp2p.getMultiaddrs().map(String)};},
  async dialApp(address) {await this.network.libp2p.dial(multiaddr(address));},
  async announce(cid) {return this.network.announceArtifact(cid);},
  async providers(cid) {return this.network.findArtifactProviders(cid);},
  async closePeerCircuits() {
    for(const connection of this.transport.node.libp2p.getConnections()) if(connection.remoteAddr.toString().includes('/p2p-circuit/p2p/')) await connection.close();
  },
  async importFixture(size) {
    async function* source() {
      for(let offset=0;offset<size;offset+=32768) {
        const bytes=new Uint8Array(Math.min(32768,size-offset));
        for(let i=0;i<bytes.length;i++) bytes[i]=fixtureByte(offset+i);
        yield bytes;
      }
    }
    return this.store.importFile(source(),{expectedSize:size,pin:true});
  },
  async importPackage(manifest) {
    for (const file of manifest.files) {
      const response=await fetch('/seed/'+file.path.split('/').map(encodeURIComponent).join('/'));
      if(!response.ok||!response.body) throw new Error('Cannot read cached source '+file.path);
      const result=await this.store.importFile(response.body,{expectedSize:file.size,expectedSha256:file.sha256,pin:true});
      if(result.cid!==file.cid) throw new Error('CLI/browser file CID differs: '+file.path);
    }
    return this.store.importManifest(manifest,{pin:true});
  },
  async ensure(cid) {return this.store.ensureLocal(cid,{fetchBlock:(block,options)=>this.network.fetchArtifactBlock(block,{...options,artifactCid:cid}),pin:true});},
  async read(cid) {
    const hash=sha256.create();let length=0;
    for await(const chunk of this.store.openRead(cid)){hash.update(chunk);length+=chunk.byteLength;}
    return {size:length,sha256:Array.from(hash.digest()).map(n=>n.toString(16).padStart(2,'0')).join('')};
  },
  async readPackage(cid) {
    const manifest=await this.store.getManifest(cid);
    const files=[];
    for(const file of manifest.files) files.push({path:file.path,cid:file.cid,...await this.read(file.cid)});
    return files;
  },
  async closure(cid) {
    let blocks=0,bytes=0;
    for await(const block of this.store.listBlockCids(cid)) {
      blocks++;
      for await(const chunk of this.store.getBlockstore().get(block)) bytes+=chunk.byteLength;
    }
    return {blocks,bytes};
  },
  stats() {return this.transport.getStats();},
  connections() {return this.transport.node.libp2p.getConnections().map(connection=>connection.remoteAddr.toString());},
  async stop() {await this.network?.disconnect();await this.store?.destroy();}
};
window.artifactsReady=true;
`;

try {
  await writeFile(path.join(temporary, 'entry.js'), browserEntry);
  await writeFile(path.join(temporary, 'index.html'), '<!doctype html><title>IPFS artifact runtime test</title><script type="module" src="/entry.js"></script>');
  await build({ root: temporary, configFile: false, logLevel: 'warn', build: { target: 'esnext', outDir: 'dist' } });
  const outputRoot = path.join(temporary, 'dist');
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname.startsWith('/seed/')) {
        seedRequests++;
        if (!seedEnabled) { forbiddenSeedRequests.push(pathname); response.writeHead(403); response.end(); return; }
        const relative = pathname.slice('/seed/'.length);
        const file = modelPackage?.manifest.files.find((entry) => entry.path === relative);
        if (!file) throw new Error('Unknown cached source');
        response.setHeader('Content-Type', 'application/octet-stream');
        response.setHeader('Content-Length', file.size);
        const stream = createReadStream(path.join(modelPackage.sourceRoot, relative));
        stream.on('data', (bytes) => { seedBytes += bytes.byteLength; });
        stream.on('error', () => response.destroy());
        response.on('close', () => stream.destroy());
        stream.pipe(response);
        return;
      }
      const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
      const filename = path.resolve(outputRoot, relative);
      if (!filename.startsWith(`${outputRoot}${path.sep}`)) throw new Error('Invalid path');
      const bytes = await readFile(filename);
      response.setHeader('Content-Type', filename.endsWith('.js') ? 'text/javascript' : 'text/html');
      response.end(bytes);
    } catch { response.statusCode = 404; response.end(); }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;

  // This node supplies signaling only. It has no Bitswap broker or file blocks.
  relay = withLibp2pLight(createHeliaLight(), {
    addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] },
    transports: [webSockets()], connectionEncrypters: [noise()], streamMuxers: [yamux()],
    services: { identify: identify(), relay: circuitRelayServer({ reservations: { applyDefaultLimit: false } }) },
    connectionManager: { inboundConnectionThreshold: Infinity, maxConnections: 32 },
    peerDiscovery: []
  });
  await relay.start();
  const relayAddress = relay.libp2p.getMultiaddrs()[0].toString();
  const executablePath = process.env.CHROME_PATH
    || (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : chromium.executablePath());
  browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
  for (let index = 0; index < 3; index++) {
    const context = await browser.newContext();
    await context.route('**/*', (route) => {
      const requestUrl = new URL(route.request().url());
      if (requestUrl.origin === url) {
        if (!requestUrl.pathname.startsWith('/seed/') || (index === 0 && seedEnabled)) return route.continue();
        forbiddenSeedRequests.push(requestUrl.pathname);
        return route.abort();
      }
      publicRequests.push(requestUrl.origin);
      return route.abort();
    });
    const page = await context.newPage();
    pages.push(page);
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto(url);
    await page.waitForFunction(() => window.artifactsReady === true);
    await page.evaluate((address) => window.artifactsTest.start(address), relayAddress);
    await page.waitForFunction(() => window.artifactsTest.info().addresses.some((address) => address.includes('/webrtc/')), null, { timeout: 20000 });
  }
  const [a, b, c] = pages;
  const aInfo = await a.evaluate(() => window.artifactsTest.info());
  const bInfo = await b.evaluate(() => window.artifactsTest.info());
  await b.evaluate((address) => window.artifactsTest.dialApp(address), aInfo.appAddresses.find((address) => address.includes('/webrtc/')));
  console.log(`Importing ${modelId || 'generated file'}: ${size} bytes into peer A`);
  const artifact = modelPackage
    ? await a.evaluate((manifest) => window.artifactsTest.importPackage(manifest), modelPackage.manifest)
    : await a.evaluate((length) => window.artifactsTest.importFixture(length), size);
  if (modelPackage) {
    assert.equal(artifact.cid, modelPackage.manifestCid, 'Browser and CLI manifest CIDs must agree');
    assert.equal(seedRequests, modelPackage.manifest.files.length);
    assert.equal(seedBytes, size);
  }
  seedEnabled = false;
  const importedSeedRequests = seedRequests;
  const closure = await a.evaluate((cid) => window.artifactsTest.closure(cid), artifact.cid);
  const expectedFiles = modelPackage?.manifest.files.map(({ path, cid, size, sha256 }) => ({ path, cid, size, sha256 }));
  async function verify(page) {
    if (modelPackage) assert.deepEqual(await page.evaluate((cid) => window.artifactsTest.readPackage(cid), artifact.cid), expectedFiles);
    else assert.deepEqual(await page.evaluate((cid) => window.artifactsTest.read(cid), artifact.cid), { size, sha256: expectedHash });
  }
  await a.evaluate((cid) => window.artifactsTest.announce(cid), artifact.cid);
  assert.equal((await b.evaluate((cid) => window.artifactsTest.providers(cid), artifact.cid)).length, 1);
  console.log(`Peer B fetching complete ${closure.blocks}-block closure over WebRTC; HTTP source disabled`);
  await b.evaluate((cid) => window.artifactsTest.ensure(cid), artifact.cid);
  await b.evaluate((cid) => window.artifactsTest.announce(cid), artifact.cid);
  await verify(b);
  const firstDownload = await b.evaluate(() => window.artifactsTest.stats());
  assert(firstDownload.receivedBlockBytes >= closure.bytes);

  await a.evaluate(() => window.artifactsTest.stop());
  await a.context().close();
  await b.evaluate(() => window.artifactsTest.stop());
  await b.reload();
  await b.waitForFunction(() => window.artifactsReady === true);
  await b.evaluate((address) => window.artifactsTest.start(address), relayAddress);
  await b.waitForFunction(() => window.artifactsTest.info().addresses.some((address) => address.includes('/webrtc/')), null, { timeout: 20000 });
  const restored = await b.evaluate(() => window.artifactsTest.info());
  assert.equal(restored.peerId, bInfo.peerId);
  await verify(b);
  assert.equal((await b.evaluate(() => window.artifactsTest.stats())).receivedBlockBytes, 0, 'restored file reads use only IndexedDB');

  await c.evaluate((address) => window.artifactsTest.dialApp(address), restored.appAddresses.find((address) => address.includes('/webrtc/')));
  assert.equal((await c.evaluate((cid) => window.artifactsTest.providers(cid), artifact.cid)).length, 1);
  console.log('Peer A exited; peer C fetching from reloaded peer B and verifying every file');
  await c.evaluate((cid) => window.artifactsTest.ensure(cid), artifact.cid);
  await verify(c);
  const reseeder = await b.evaluate(() => window.artifactsTest.stats());
  const receiver = await c.evaluate(() => window.artifactsTest.stats());
  const connections = await c.evaluate(() => window.artifactsTest.connections());
  assert(reseeder.sentBlockBytes >= closure.bytes);
  assert(receiver.receivedBlockBytes >= closure.bytes);
  assert(connections.some((address) => address.includes('/webrtc/')));
  assert(!connections.some((address) => address.includes('/p2p-circuit/p2p/')));
  assert.deepEqual(publicRequests, []);
  assert.deepEqual(forbiddenSeedRequests, []);
  assert.equal(seedRequests, importedSeedRequests, 'No origin file requests after initial import');
  assert.deepEqual(pageErrors, []);
  console.log(JSON.stringify({
    ok: true, isolatedBrowserContexts: 3, bytes: size, cid: artifact.cid,
    model: modelId || null, filesVerified: expectedFiles?.length || 1,
    closureBlocks: closure.blocks, closureBytes: closure.bytes,
    restoredPeerIdentity: restored.peerId === bInfo.peerId,
    originClosed: true, firstDownloadBytes: firstDownload.receivedBlockBytes,
    reseededBytes: reseeder.sentBlockBytes, finalDownloadBytes: receiver.receivedBlockBytes,
    transport: 'WebRTC', publicRequests: publicRequests.length,
    originFileRequestsDuringTransfer: seedRequests - importedSeedRequests
  }));
} finally {
  await Promise.allSettled(pages.filter((page) => !page.isClosed()).map((page) => page.evaluate(() => window.artifactsTest?.stop())));
  await browser?.close();
  await relay?.stop();
  if (server) await new Promise((resolve) => server.close(resolve));
  await rm(temporary, { recursive: true, force: true });
}
