const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const repoRoot = path.resolve(process.cwd());
const demosRoot = path.join(repoRoot, 'demos');

const demoSpecs = [
  {
    name: 'hyperborea',
    requiresRelayConfig: true,
    entryCandidates: ['index.html', 'cb.html']
  },
  {
    name: 'cubechat',
    requiresRelayConfig: true,
    entryCandidates: ['index.html']
  },
  {
    name: 'sneakywoods',
    requiresRelayConfig: true,
    entryCandidates: ['index.html']
  },
  {
    name: 'daddygo',
    requiresRelayConfig: true,
    entryCandidates: ['index.html', 'daddyGo.html']
  },
  {
    name: 'fano-reactor',
    requiresRelayConfig: true,
    entryCandidates: ['index.html']
  },
  {
    name: 'planetgen',
    requiresRelayConfig: false,
    entryCandidates: ['index.html']
  },
  {
    name: 'universes',
    requiresRelayConfig: false,
    entryCandidates: ['index.html']
  },
  {
    name: 'webgpuphys',
    requiresRelayConfig: false,
    entryCandidates: ['index.html']
  }
];

const exists = (filePath) => fs.existsSync(filePath);

for (const demo of demoSpecs) {
  test(`${demo.name} demo scaffold`, () => {
    const demoRoot = path.join(demosRoot, demo.name);
    assert.ok(exists(demoRoot), `${demo.name} folder missing`);

    const packageJson = path.join(demoRoot, 'package.json');
    assert.ok(exists(packageJson), `${demo.name} package.json missing`);

    const viteConfig = [
      path.join(demoRoot, 'vite.config.js'),
      path.join(demoRoot, 'vite.config.ts')
    ].find(exists);
    assert.ok(viteConfig, `${demo.name} Vite config missing`);

    const entry = demo.entryCandidates.map((file) => path.join(demoRoot, file)).find(exists);
    assert.ok(entry, `${demo.name} entry HTML missing`);

    if (demo.requiresRelayConfig) {
      const relayConfig = path.join(demoRoot, 'public', 'relay-config.json');
      assert.ok(exists(relayConfig), `${demo.name} relay-config.json missing`);
    }
  });
}

test('cubechat uses PeerCompute for WebRTC signaling', () => {
  const networkFile = path.join(demosRoot, 'cubechat', 'src', 'p2p', 'network.js');
  const content = fs.readFileSync(networkFile, 'utf8');
  assert.ok(content.includes('RTCPeerConnection'), 'cubechat WebRTC adapter missing');
  assert.ok(content.includes('webrtc-offer'), 'cubechat WebRTC signaling missing');
  assert.ok(content.includes('queueEvent'), 'cubechat PeerCompute event usage missing');
  assert.ok(content.includes('_handleSignalError'), 'cubechat async signaling guard missing');
  assert.ok(content.includes('transportManager: NO_FATAL_TRANSPORT_MANAGER'), 'cubechat missing non-fatal transport startup');
  assert.ok(
    content.includes('cannot create an answer in a state other than have-remote-offer'),
    'cubechat stable-state answer guard missing'
  );
});

test('hyperborea opts into non-fatal relay listen startup', () => {
  const gameFile = path.join(demosRoot, 'hyperborea', 'src', 'game', 'Game.js');
  const cubechatRoomDirectory = path.join(demosRoot, 'cubechat', 'src', 'p2p', 'roomDirectory.js');
  const roomDirectoryFile = path.join(demosRoot, 'hyperborea', 'src', 'game', 'roomDirectory.js');
  const gameContent = fs.readFileSync(gameFile, 'utf8');
  const cubechatRoomDirectoryContent = fs.readFileSync(cubechatRoomDirectory, 'utf8');
  const roomDirectoryContent = fs.readFileSync(roomDirectoryFile, 'utf8');
  assert.ok(
    gameContent.includes('transportManager: NO_FATAL_TRANSPORT_MANAGER'),
    'hyperborea main node missing non-fatal transport startup'
  );
  assert.ok(
    cubechatRoomDirectoryContent.includes('transportManager: NO_FATAL_TRANSPORT_MANAGER'),
    'cubechat room directory missing non-fatal transport startup'
  );
  assert.ok(
    roomDirectoryContent.includes('transportManager: NO_FATAL_TRANSPORT_MANAGER'),
    'hyperborea room directory missing non-fatal transport startup'
  );
});

test('cubechat, hyperborea, and sneakywoods register bot bridges for shared harness control', () => {
  const bridgeHelper = path.join(demosRoot, 'shared', 'peercomputeBotBridge.js');
  const botHelper = path.join(demosRoot, 'shared', 'peercomputeBots.js');
  const cubechatMain = path.join(demosRoot, 'cubechat', 'src', 'main.js');
  const hyperboreaGame = path.join(demosRoot, 'hyperborea', 'src', 'game', 'Game.js');
  const sneakywoodsMain = path.join(demosRoot, 'sneakywoods', 'main.js');
  assert.ok(exists(bridgeHelper), 'shared bot bridge helper missing');
  assert.ok(exists(botHelper), 'shared bot runtime helper missing');
  const cubechatContent = fs.readFileSync(cubechatMain, 'utf8');
  const hyperboreaContent = fs.readFileSync(hyperboreaGame, 'utf8');
  const sneakywoodsContent = fs.readFileSync(sneakywoodsMain, 'utf8');
  assert.ok(
    cubechatContent.includes("registerPeercomputeBotBridge('cubechat'"),
    'cubechat bot bridge registration missing'
  );
  assert.ok(
    hyperboreaContent.includes("registerPeercomputeBotBridge('hyperborea'"),
    'hyperborea bot bridge registration missing'
  );
  assert.ok(
    sneakywoodsContent.includes("registerPeercomputeBotBridge('sneakywoods'"),
    'sneakywoods bot bridge registration missing'
  );
});

test('cubechat, hyperborea, and sneakywoods expose bot controls in settings screens', () => {
  const cubechatMain = fs.readFileSync(path.join(demosRoot, 'cubechat', 'src', 'main.js'), 'utf8');
  const hyperboreaHtml = fs.readFileSync(path.join(demosRoot, 'hyperborea', 'cb.html'), 'utf8');
  const sneakywoodsHtml = fs.readFileSync(path.join(demosRoot, 'sneakywoods', 'index.html'), 'utf8');
  assert.ok(cubechatMain.includes('id="bot-count"'), 'cubechat bot count control missing');
  assert.ok(cubechatMain.includes('id="bot-add"'), 'cubechat bot add control missing');
  assert.ok(hyperboreaHtml.includes('id="bot-preset"'), 'hyperborea bot preset control missing');
  assert.ok(hyperboreaHtml.includes('id="bot-status"'), 'hyperborea bot status control missing');
  assert.ok(sneakywoodsHtml.includes('id="bot-clear"'), 'sneakywoods bot clear control missing');
  assert.ok(sneakywoodsHtml.includes('id="bot-status"'), 'sneakywoods bot status control missing');
});

test('shared bot runtime helper builds iframe launch URLs and parses private-room bot params', async () => {
  const modulePath = pathToFileURL(path.join(demosRoot, 'shared', 'peercomputeBots.js')).href;
  const {
    buildPeercomputeBotUrl,
    readPeercomputeBotParams,
    readPeercomputeRoomParams
  } = await import(modulePath);
  const url = buildPeercomputeBotUrl(
    'https://metaversejs.github.io/peercompute/sneakywoods/?relayConfigUrl=https%3A%2F%2Fsecretworkshop.net%2Fpeercompute%2Fconfig%2Frelay-config.json',
    {
      room: { name: 'Lab Room', visibility: 'private' },
      password: 'secret'
    },
    {
      demoId: 'sneakywoods',
      botIndex: 2,
      preset: 'sentinel'
    }
  );
  const params = readPeercomputeBotParams(new URL(url).search);
  const room = readPeercomputeRoomParams(new URL(url).search, {
    buildRoomId: ({ name, visibility, password }) => `${visibility}:${name}:${password}`,
    normalizeRoomName: (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, '-')
  });
  assert.equal(params.enabled, true, 'bot launch flag missing');
  assert.equal(params.demoId, 'sneakywoods', 'bot demo id missing');
  assert.equal(params.botIndex, 2, 'bot index mismatch');
  assert.equal(params.preset, 'sentinel', 'bot preset mismatch');
  assert.equal(room?.visibility, 'private', 'room visibility mismatch');
  assert.equal(room?.password, 'secret', 'room password missing');
  assert.equal(room?.roomId, 'private:lab-room:secret', 'room id normalizer mismatch');
});

test('planetgen uses shared GPU hub device', () => {
  const helperPath = path.join(demosRoot, 'planetgen', 'src', 'peercomputeDevice.js');
  assert.ok(exists(helperPath), 'planetgen peercomputeDevice helper missing');
  const oceanContent = fs.readFileSync(path.join(demosRoot, 'planetgen', 'src', 'OceanComputeSystem.js'), 'utf8');
  assert.ok(oceanContent.includes('init({ device'), 'OceanComputeSystem device injection missing');
  const indexContent = fs.readFileSync(path.join(demosRoot, 'planetgen', 'src', 'index.js'), 'utf8');
  assert.ok(indexContent.includes('getSharedDevice'), 'planetgen missing shared device usage');
});

test('universes offloads generation to ComputeManager', () => {
  const computePath = path.join(demosRoot, 'universes', 'compute', 'universeTasks.js');
  assert.ok(exists(computePath), 'universes compute tasks missing');
  const mainContent = fs.readFileSync(path.join(demosRoot, 'universes', 'main.js'), 'utf8');
  assert.ok(mainContent.includes('ComputeManager'), 'universes missing ComputeManager usage');
  assert.ok(mainContent.includes('runComputeTask'), 'universes missing compute task runner');
});

test('webgpuphys headless uses isolated compute tasks', () => {
  const computePath = path.join(demosRoot, 'webgpuphys', 'demos', 'shared', 'mpmComputeTasks.js');
  assert.ok(exists(computePath), 'webgpuphys compute tasks missing');
  const headlessContent = fs.readFileSync(path.join(demosRoot, 'webgpuphys', 'demos', 'mpm-headless.js'), 'utf8');
  assert.ok(headlessContent.includes('ComputeManager'), 'webgpuphys headless ComputeManager usage missing');
  assert.ok(headlessContent.includes('mpmComputeTasks'), 'webgpuphys compute module wiring missing');
});

test('fano-reactor ships sedenion chemistry model modules', () => {
  const mainPath = path.join(demosRoot, 'fano-reactor', 'src', 'main.js');
  const chemistryPath = path.join(demosRoot, 'fano-reactor', 'src', 'model', 'chemistry.js');
  const algebraPath = path.join(demosRoot, 'fano-reactor', 'src', 'algebra', 'sedenion.js');
  assert.ok(exists(mainPath), 'fano-reactor main.js missing');
  assert.ok(exists(chemistryPath), 'fano-reactor chemistry model missing');
  assert.ok(exists(algebraPath), 'fano-reactor sedenion algebra missing');
  const main = fs.readFileSync(mainPath, 'utf8');
  const chemistry = fs.readFileSync(chemistryPath, 'utf8');
  assert.ok(main.includes('bond-lab'), 'fano-reactor bond-lab UI missing');
  assert.ok(main.includes('fano-map'), 'fano-reactor fano-map UI missing');
  assert.ok(chemistry.includes('summarizeInteraction'), 'fano-reactor interaction summarizer missing');
});
