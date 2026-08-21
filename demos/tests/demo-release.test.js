const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(process.cwd());

const read = (rel) => fs.readFileSync(path.join(repoRoot, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(repoRoot, rel));

test('config/relay.json exists and is referenced by dev scripts', () => {
  assert.ok(exists('config/relay.json'), 'config/relay.json missing');
  const devAll = read('scripts/dev-all.sh');
  const startDev = read('peercompute/start-dev.sh');
  assert.ok(devAll.includes('config/relay.json'), 'dev-all.sh does not load config/relay.json');
  assert.ok(startDev.includes('config/relay.json'), 'start-dev.sh does not load config/relay.json');
});

test('config/relay.json exists and build writes relay-config.json for demos', () => {
  assert.ok(exists('config/relay.json'), 'config/relay.json missing');
  assert.ok(
    exists('scripts/write-prod-relay-config.mjs'),
    'write-prod-relay-config.mjs missing'
  );
  const buildAll = read('scripts/build-all.sh');
  assert.ok(
    buildAll.includes('write-prod-relay-config.mjs'),
    'build-all.sh does not write production relay-config.json'
  );
});

test('production relay config advertises WSS plus STUN and TURN UDP/TCP', () => {
  const config = JSON.parse(read('config/relay.json'));
  assert.equal(config.relayHost, 'secretworkshop.net');
  assert.equal(config.relayProtocol, 'wss');
  assert.equal(
    config.publicHost,
    '',
    'production config must not derive coturn external-ip from a stale literal address'
  );
  assert.equal(
    config.relayConfigUrl,
    'https://secretworkshop.net/peercompute/config/relay-config.json'
  );
  assert.equal(typeof config.relayPeerId, 'string');
  assert.ok(config.relayPeerId.length > 0, 'production relay peer id missing');

  const iceServers = config.webrtc?.iceServers;
  assert.ok(Array.isArray(iceServers), 'production ICE server list missing');
  const urls = iceServers.flatMap((server) => (
    Array.isArray(server?.urls) ? server.urls : [server?.urls]
  )).filter((url) => typeof url === 'string');
  assert.ok(urls.some((url) => url.startsWith('stun:')), 'production STUN URL missing');
  assert.ok(
    urls.includes('turn:secretworkshop.net:3478?transport=udp'),
    'production TURN UDP URL missing'
  );
  assert.ok(
    urls.includes('turn:secretworkshop.net:3478?transport=tcp'),
    'production TURN TCP URL missing'
  );

  const turnServer = iceServers.find((server) => (
    (Array.isArray(server?.urls) ? server.urls : [server?.urls])
      .some((url) => typeof url === 'string' && url.startsWith('turn:'))
  ));
  assert.equal(typeof turnServer?.username, 'string', 'TURN username missing');
  assert.ok(turnServer.username.length > 0, 'TURN username empty');
  assert.equal(typeof turnServer?.credential, 'string', 'TURN credential missing');
  assert.ok(turnServer.credential.length > 0, 'TURN credential empty');
});

test('backend launcher and systemd wiring include relay + turn stack', () => {
  assert.ok(exists('scripts/pcserver.sh'), 'pcserver.sh missing');
  assert.ok(exists('scripts/start-turn-prod.sh'), 'start-turn-prod.sh missing');

  const rootPackage = read('package.json');
  assert.ok(rootPackage.includes('"backend"'), 'package.json missing backend script');
  assert.ok(rootPackage.includes('"dev:vpn-coturn"'), 'package.json missing local coturn dev launcher script');

  const relaySystemd = read('scripts/install-relay-systemd.sh');
  assert.ok(relaySystemd.includes('scripts/pcserver.sh'), 'relay systemd installer does not launch pcserver.sh');
  assert.ok(relaySystemd.includes('enable_turn="${PCSERVER_ENABLE_TURN:-1}"'), 'relay systemd installer does not default TURN service on');
  assert.ok(relaySystemd.includes('Environment=PCSERVER_ENABLE_TURN=$enable_turn'), 'relay systemd installer does not write TURN enable env');
});

test('docs index includes all demos and screenshots', () => {
  const html = read('docs/index.html');
  const requiredLinks = [
    './hyperborea/',
    './cubechat/',
    './sneakywoods/',
    './daddygo/',
    './fano-reactor/',
    './schrodinger/',
    './planetgen/',
    './multiscale/',
    './universes/',
    './webgpuphys/'
  ];
  requiredLinks.forEach((href) => {
    assert.ok(html.includes(href), `docs index missing link: ${href}`);
  });
  const requiredImages = [
    './assets/hyperborea.png',
    './assets/cubechat.png',
    './assets/sneakywoods.png',
    './assets/fano-reactor.svg',
    './assets/schrodinger.svg',
    './assets/multiscale.svg',
    './assets/planetgen.png',
    './assets/webgpuphys.png'
  ];
  requiredImages.forEach((src) => {
    assert.ok(html.includes(src), `docs index missing image: ${src}`);
  });
});

test('docs overview keeps expected tile order', () => {
  const html = read('docs/index.html');
  const names = [...html.matchAll(/<h2>([^<]+)<\/h2>/g)].map((match) => match[1]);
  const expected = [
    'PeerCompute (GitHub)',
    'CubeChat',
    'Universes',
    'Multiscale Ladder',
    'PlanetGen',
    'NetViz',
    'Fano Reactor',
    'Schrodinger',
    'SneakyWoods',
    'Daddy Go!',
    'Dynamics (WebGpuPhys)',
    'MPM Visual (WebGpuPhys)',
    'PPF Contact Solver (WebGpuPhys)',
    'Hyperborea'
  ];
  assert.deepEqual(names.slice(0, expected.length), expected, 'docs overview tile order mismatch');
});

test('multiscale release wiring uses fixed port and docs output', () => {
  const rootPackage = JSON.parse(read('package.json'));
  const viteConfig = read('demos/multiscale/vite.config.js');
  const devAll = read('scripts/dev-all.sh');
  const devLocalRelay = read('scripts/dev-local-relay.sh');

  assert.ok(rootPackage.workspaces.includes('demos/multiscale'), 'package workspaces missing multiscale');
  assert.equal(rootPackage.scripts['dev:multiscale'], 'npm --prefix demos/multiscale run dev -- --host');
  assert.equal(rootPackage.scripts['build:multiscale'], 'npm --prefix demos/multiscale run build');
  assert.ok(rootPackage.scripts['build:demos'].includes('npm run build:multiscale'), 'build:demos missing multiscale');
  assert.match(viteConfig, /port:\s*5185/, 'multiscale Vite port changed from 5185');
  assert.ok(viteConfig.includes("path.resolve(docsRoot, 'multiscale')"), 'multiscale build output changed from docs/multiscale');
  assert.ok(devAll.includes('demos/multiscale/public'), 'dev-all missing multiscale public relay config dir');
  assert.ok(devAll.includes('docs/multiscale'), 'dev-all missing docs/multiscale relay config dir');
  assert.ok(devLocalRelay.includes('VITE_MULTISCALE_URL="${demo_base}:5185/"'), 'dev-local-relay missing multiscale overview URL');
  assert.match(devLocalRelay, /demos\/multiscale\\?" run dev/, 'dev-local-relay missing multiscale dev command');
});

test('hyperborea has settings + room UI and room directory wiring', () => {
  const html = read('demos/hyperborea/cb.html');
  assert.ok(html.includes('id="settings-menu"'), 'hyperborea settings menu missing');
  assert.ok(html.includes('id="room-list-items"'), 'hyperborea room list missing');

  const game = read('demos/hyperborea/src/game/Game.js');
  assert.ok(game.includes('RoomDirectory'), 'hyperborea RoomDirectory missing');
  assert.ok(game.includes('switchRoom'), 'hyperborea switchRoom missing');
});

test('sneakywoods has settings + room UI and room directory wiring', () => {
  const html = read('demos/sneakywoods/index.html');
  assert.ok(html.includes('id="settings-menu"'), 'sneakywoods settings menu missing');
  assert.ok(html.includes('id="roomListItems"'), 'sneakywoods room list missing');

  const main = read('demos/sneakywoods/main.js');
  assert.ok(main.includes('buildRoomId'), 'sneakywoods buildRoomId missing');
  assert.ok(main.includes('switchRoom'), 'sneakywoods switchRoom missing');
});

test('cubechat room directory module wired', () => {
  assert.ok(exists('demos/cubechat/src/p2p/roomDirectory.js'), 'cubechat roomDirectory missing');
  const main = read('demos/cubechat/src/main.js');
  assert.ok(main.includes('room-list'), 'cubechat room list UI missing');
  assert.ok(main.includes('switchRoom'), 'cubechat switchRoom missing');
});

test('daddygo has global high score sync', () => {
  const html = read('demos/daddygo/index.html');
  assert.ok(html.includes('id="global-score"'), 'daddygo global score element missing');
  const main = read('demos/daddygo/src/main.js');
  assert.ok(main.includes('NodeKernel'), 'daddygo NodeKernel usage missing');
  assert.ok(main.includes('publishHighScore'), 'daddygo publishHighScore missing');
});

test('planetgen default debug view is off', () => {
  const html = read('demos/planetgen/index.html');
  assert.ok(
    /<option value="off" selected>Off<\/option>/.test(html),
    'planetgen debug default is not off'
  );
});

test('universes generation tokens declared before use', () => {
  const main = read('demos/universes/main.js');
  const tokenIndex = main.indexOf('let universeGenerationToken');
  const fnIndex = main.indexOf('function generateUniverse');
  assert.ok(tokenIndex !== -1, 'universes token declaration missing');
  assert.ok(fnIndex !== -1, 'universes generateUniverse function missing');
  assert.ok(tokenIndex < fnIndex, 'universes token declared after generateUniverse');
});

test('root README includes relay config instructions', () => {
  const readme = read('README.md');
  assert.ok(readme.includes('config/relay.json'), 'README missing relay config section');
  assert.ok(readme.includes('npm run dev'), 'README missing npm run dev instruction');
  assert.ok(readme.includes('Fano Reactor'), 'README missing Fano Reactor mention');
  assert.ok(readme.includes('Schrodinger Materials Console'), 'README missing Schrodinger demo mention');
  assert.ok(readme.includes('Multiscale Ladder'), 'README missing Multiscale Ladder mention');
  assert.ok(readme.includes('scripts/pcserver.sh'), 'README missing pcserver backend instructions');
});
