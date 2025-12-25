const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

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
});

test('planetgen uses shared GPU hub device', () => {
  const helperPath = path.join(demosRoot, 'planetgen', 'peercomputeDevice.js');
  assert.ok(exists(helperPath), 'planetgen peercomputeDevice helper missing');
  const oceanContent = fs.readFileSync(path.join(demosRoot, 'planetgen', 'OceanComputeSystem.js'), 'utf8');
  assert.ok(oceanContent.includes('init({ device'), 'OceanComputeSystem device injection missing');
  const indexContent = fs.readFileSync(path.join(demosRoot, 'planetgen', 'index.js'), 'utf8');
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
