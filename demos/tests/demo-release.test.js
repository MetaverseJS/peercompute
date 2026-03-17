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

test('backend launcher and systemd wiring include relay + turn stack', () => {
  assert.ok(exists('scripts/pcserver.sh'), 'pcserver.sh missing');
  assert.ok(exists('scripts/start-turn-prod.sh'), 'start-turn-prod.sh missing');

  const rootPackage = read('package.json');
  assert.ok(rootPackage.includes('"backend"'), 'package.json missing backend script');

  const relaySystemd = read('scripts/install-relay-systemd.sh');
  assert.ok(relaySystemd.includes('scripts/pcserver.sh'), 'relay systemd installer does not launch pcserver.sh');
  assert.ok(relaySystemd.includes('PCSERVER_ENABLE_TURN=1'), 'relay systemd installer does not enable TURN service');
});

test('docs index includes all demos and screenshots', () => {
  const html = read('docs/index.html');
  const requiredLinks = [
    './hyperborea/',
    './cubechat/',
    './sneakywoods/',
    './daddygo/',
    './fano-reactor/',
    './planetgen/',
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
    './assets/planetgen.png',
    './assets/webgpuphys.png'
  ];
  requiredImages.forEach((src) => {
    assert.ok(html.includes(src), `docs index missing image: ${src}`);
  });
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
  assert.ok(readme.includes('scripts/pcserver.sh'), 'README missing pcserver backend instructions');
});
