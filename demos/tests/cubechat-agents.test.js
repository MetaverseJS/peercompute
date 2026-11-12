import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { normalizeCubeAgentPosition } from '../cubechat/src/agents/CubeAgentLayer.js';

let server, browser, origin, cache;
before(async () => {
  const repo = fileURLToPath(new URL('../../', import.meta.url));
  const fixtureModule = join(repo, 'demos/cubechat/src/agents/__test_fixture.js');
  cache = await mkdtemp(join(tmpdir(), 'peercompute-cube-agents-'));
  server = await createServer({ configFile: false, root: repo, cacheDir: cache, logLevel: 'error',
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { host: '127.0.0.1', port: 0, hmr: false, fs: { allow: [repo] } },
    plugins: [{ name: 'cube-agent-fixture', resolveId(id) {
      if (id === '/__cube_agent_fixture.js') return fixtureModule;
      if (id === '@peercompute') return '\0cube-agent-unstarted-kernel';
    },
      load(id) {
        if (id === '\0cube-agent-unstarted-kernel') return 'export class NodeKernel { constructor() { throw new Error("No network/model kernel is permitted in this controller fixture"); } }';
        if (id === fixtureModule) return `
        import * as THREE from 'three';
        import * as CANNON from 'cannon-es';
        import { CubeAgentLayer } from './CubeAgentLayer.js';
        export function start(options) {
          const canvas = document.querySelector('canvas');
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(60, 900 / 600, .1, 500);
          camera.position.set(0, 8, 30); camera.lookAt(0, 3, 0); camera.updateMatrixWorld();
          const floor = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial());
          floor.rotation.x = -Math.PI / 2; scene.add(floor);
          const humanPlayers = new Map([['real-peer', {}]]);
          const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) });
          const humanBody = new CANNON.Body({ mass: 1, position: new CANNON.Vec3(100, 3, 0), shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)) });
          world.addBody(humanBody);
          const physics = { world, bodies: new Map([['real-peer', humanBody]]) };
          const shell = { scene, camera, floor, renderer: { domElement: canvas }, players: humanPlayers, worldThemeId: 'tron' };
          window.selected = []; window.worldClicks = 0;
          window.participants = [{ id: 'human:owner-peer', kind: 'human', peerId: 'owner-peer', name: 'Owner', position: [0,3,20], velocity: [0,0,0] }];
          window.motorCalls = [];
          window.controlledMotor = { infer: async requests => {
            motorCalls.push(structuredClone(requests));
            return { backend:'fixture', policyId:'controlled-motor-fixture', worker:false, results: requests.map(({id,observation:o}) => {
              const distance=Math.hypot(...o.relativePosition), speed=Math.min(5,Math.max(0,(distance-o.stopDistance)*2));
              return {id,acceleration:o.relativePosition.map((v,i)=>Math.max(-12,Math.min(12,((distance?v/distance*speed:0)-o.velocity[i])*4)))};
            }) };
          } };
          window.advance = async count => { for(let i=0;i<count;i++) { physics.world.step(1/60); layer.afterPhysics(1/60); if(layer.motor.pending) await layer.motor.pending.done; } };
          canvas.addEventListener('click', () => worldClicks++);
          window.layer = new CubeAgentLayer({ scene: shell, physics, getPlayerPosition: () => ({ x: 0, y: 3, z: 20 }),
            onSelect: key => selected.push(key), getParticipants: () => participants, ...options });
          Object.assign(window, { THREE, CANNON, shell, physics, humanBody });
          window.base = { key: 'local:agent-1', agentId: 'agent-1', ownerPeerId: 'owner-peer', name: 'Ada',
            color: '#4cd4a1', position: [0, 3, 0], status: 'idle', local: true };
          window.project = position => {
            camera.updateMatrixWorld(); const point = new THREE.Vector3(...position).project(camera), box = canvas.getBoundingClientRect();
            return { x: box.left + (point.x + 1) * box.width / 2, y: box.top + (1 - point.y) * box.height / 2 };
          };
        }`; },
      configureServer(vite) {
        vite.middlewares.use('/__cube_agents', (_request, response) => {
          response.setHeader('Content-Type', 'text/html');
          response.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}canvas{display:block;width:900px;height:600px;background:#071716;touch-action:none}</style><canvas width="900" height="600" aria-label="Agent scene"></canvas>');
        });
      } }] });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/google/chrome/chrome', headless: true, args: ['--disable-gpu'] });
});
after(async () => {
  const results = await Promise.allSettled([browser?.close(), server?.close()]);
  if (cache) await rm(cache, { recursive: true, force: true });
  for (const result of results) if (result.status === 'rejected') throw result.reason;
});

async function fixture(t, options = {}) {
  const context = await browser.newContext({ viewport: { width: 900, height: 700 }, hasTouch: true });
  const page = await context.newPage(), errors = [], requests = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    requests.push(route.request().url()); return route.abort();
  });
  t.after(async () => {
    await page.evaluate(() => layer?.dispose());
    await context.close();
    assert.deepEqual(errors, []); assert.deepEqual(requests, []);
  });
  await page.goto(origin + '/__cube_agents');
  await page.evaluate(async options => (await import('/__cube_agent_fixture.js')).start(options), options);
  return page;
}

test('agent positions are copied and bounded without accepting strings or nonfinite coordinates', () => {
  const position = [1, 2, 3], normalized = normalizeCubeAgentPosition(position);
  assert.deepEqual(normalized, position); assert.notEqual(normalized, position);
  for (const value of [null, {}, [1, 2], [1, 2, 3, 4], ['1', 2, 3], [NaN, 0, 0], [Infinity, 0, 0], [1_000_001, 0, 0]]) {
    assert.throws(() => normalizeCubeAgentPosition(value), /bounded coordinates/);
  }
});

test('agent cubes have distinct dynamic local and kinematic remote ownership while humans remain untouched', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(() => {
    layer.upsert(base); layer.upsert({ ...base, key: 'remote-peer:agent-1', ownerPeerId: 'remote-peer', local: false, position: [12, 3, 0] });
    const first = layer.entries.get(base.key);
    layer.upsert({ ...base, name: 'Updated Ada', status: 'thinking', position: [2, 3, 1], color: '#ff8844' });
    return { size: layer.entries.size, children: layer.group.children.length, bodies: physics.world.bodies.length,
      kinematic: first.body.type === CANNON.Body.DYNAMIC, same: first === layer.entries.get(base.key),
      position: first.mesh.position.toArray(), collision: first.body.position.toArray(), color: first.mesh.material.color.getHexString(),
      intensity: first.mesh.material.emissiveIntensity, players: [...shell.players.keys()], bodyKeys: [...physics.bodies.keys()] };
  });
  assert.deepEqual(result, { size: 2, children: 2, bodies: 3, kinematic: true, same: true, position: [0, 3, 0], collision: [0, 3, 0],
    color: 'ff8844', intensity: .4, players: ['real-peer'], bodyKeys: ['real-peer'] });
  assert.equal(await page.evaluate(() => {
    layer.setMovement(base.key, 'stationary'); humanBody.position.set(0, 3, 12); humanBody.velocity.set(0, 0, -10); humanBody.linearDamping = 0;
    for (let index = 0; index < 120; index++) physics.world.step(1 / 60);
    return humanBody.position.z >= 3.8;
  }), true, 'the stationary agent is an actual Cannon collision body');
});

test('one physical body follows during thinking and speaking, stops when paused, and retains live pose', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    layer.upsert(base); layer.setMotor(controlledMotor); layer.setMovement(base.key,'follow');
    const body=layer.entries.get(base.key).body; await advance(120); const moved=layer.getPosition(base.key);
    participants[0].position=[0,3,60]; layer.upsert({...base,status:'thinking'}); await advance(120); const thinking=layer.getPosition(base.key);
    layer.upsert({...base,status:'speaking'}); await advance(60); const speaking=layer.getPosition(base.key);
    layer.upsert({...base,status:'paused'}); await advance(60); const paused=layer.getPosition(base.key);
    return {moved,thinking,speaking,paused,oneBody:body===layer.entries.get(base.key).body,
      y:body.position.y,vy:body.velocity.y,calls:motorCalls.length,context:layer.getContext(base)};
  });
  assert(result.moved[2]>4&&result.moved[2]<11); assert(result.thinking[2]>result.moved[2]+4);
  assert(result.speaking[2]>result.thinking[2]+2); assert.deepEqual(result.paused,result.speaking);
  assert.equal(result.y,3); assert.equal(result.vy,0); assert.equal(result.oneBody,true); assert(result.calls>10);
  assert.deepEqual(result.context.agent.position,result.paused);
});

test('world senses report actual follow and stop motion independently of chat lifecycle', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    layer.upsert(base); layer.setMotor(controlledMotor); participants[0].position = [0, 3, 60];
    layer.setIntent(base.key, { type: 'follow', targetId: participants[0].id });
    await advance(60); layer.upsert({ ...base, status: 'thinking' });
    const following = layer.observe(base.key, { requesterPeerId: 'owner-peer' });
    layer.setIntent(base.key, { type: 'stop' });
    const stopped = layer.observe(base.key);
    layer.upsert({ ...base, key: 'remote:agent-1', ownerPeerId: 'remote', local: false });
    return { following, stopped, remote: layer.observe('remote:agent-1') };
  });
  assert.equal(result.following.self.status, 'thinking');
  assert.deepEqual(result.following.self.motion, { type: 'follow', status: 'moving', targetId: 'human:owner-peer' });
  assert(result.following.self.position[2] > 0, 'actual Cannon body advanced under the controlled motor');
  assert.deepEqual(result.stopped.self.motion, { type: 'stop', status: 'stopped', targetId: null });
  assert.equal(result.remote.self.motion, undefined, 'a remote replica has no authoritative local motor');
});

test('remote body updates interpolate without running local movement or changing unrelated owner identities', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(() => {
    const remote = { ...base, key: 'other:agent-1', ownerPeerId: 'other', local: false };
    layer.upsert(base); layer.setMovement(base.key, 'stationary'); layer.upsert(remote);
    layer.upsert({ ...remote, position: [24, 3, 0] });
    const before = layer.getPosition(remote.key); layer.update(1 / 60); const first = layer.getPosition(remote.key);
    for (let index = 0; index < 149; index++) layer.update(1 / 60);
    const midpoint = layer.getPosition(remote.key);
    for (let index = 0; index < 151; index++) layer.update(1 / 60);
    let denied; try { layer.setMovement(remote.key, 'roam'); } catch (error) { denied = error.message; }
    return { before, first, midpoint, final: layer.getPosition(remote.key), local: layer.getPosition(base.key), denied, count: layer.entries.size };
  });
  assert.deepEqual(result.before, [0, 3, 0]); assert(result.first[0] > 0 && result.first[0] < 1);
  assert(Math.abs(result.midpoint[0] - 12) < 1e-8, 'remote motion spans the full advertised five-second sample interval');
  assert.deepEqual(result.final, [24, 3, 0]); assert.deepEqual(result.local, [0, 3, 0]);
  assert.match(result.denied, /owner/); assert.equal(result.count, 2);
});

test('managed motor actions are bounded and invalid targets or remote authority cannot move bodies', async t => {
  const page=await fixture(t);
  const result=await page.evaluate(async()=>{
    layer.upsert(base); participants[0].position=[200,3,0];
    layer.setMotor({infer:async requests=>({results:requests.map(({id})=>({id,acceleration:[1e9,0]}))})});
    layer.setIntent(base.key,{type:'follow',targetId:'human:owner-peer'}); await advance(120);
    const body=layer.entries.get(base.key).body, moved=layer.getPosition(base.key), speed=Math.hypot(body.velocity.x,body.velocity.z);
    let invalid=false;try{layer.setIntent(base.key,{type:'follow',targetId:'human:missing'});}catch{invalid=true;}
    layer.upsert({...base,key:'remote',ownerPeerId:'other',local:false,position:[40,3,0]});
    let remote=false;try{layer.setIntent('remote',{type:'stop'});}catch{remote=true;}
    participants=[];await advance(30);const stopped=body.velocity.toArray();
    return {moved,speed,invalid,remote,stopped};
  });
  assert(result.moved[0]>5&&result.moved[0]<12);assert(result.speed<=5.201);assert.equal(result.moved[1],3);
  assert.equal(result.invalid,true);assert.equal(result.remote,true);assert.deepEqual(result.stopped,[0,0,0]);
});

test('terrain visual height stays separate from flat-world collision height without periodic hopping', async t => {
  const page = await fixture(t);
  assert.deepEqual(await page.evaluate(() => {
    shell.getGroundHeight = (x) => 4 + x / 10;
    layer.upsert({ ...base, position: [0, 7, 0] }); layer.setMovement(base.key, 'stationary');
    for (let index = 0; index < 100; index++) { physics.world.step(1 / 60); layer.update(1 / 60); }
    const entry = layer.entries.get(base.key);
    return { visual: layer.getPosition(base.key), collision: entry.body.position.toArray(), velocity: entry.body.velocity.toArray() };
  }), { visual: [0, 7, 0], collision: [0, 3, 0], velocity: [0, 0, 0] });
});

test('spawn positions use rendered floor height and avoid already placed agents', async t => {
  const page = await fixture(t);
  const positions = await page.evaluate(() => {
    shell.floor.position.y = 4;
    const first = layer.getSpawnPosition(); layer.upsert({ ...base, position: first });
    const second = layer.getSpawnPosition();
    return { first, second };
  });
  assert.ok(Math.abs(positions.first[1] - 7) < 1e-8); assert.ok(Math.abs(positions.second[1] - 7) < 1e-8);
  assert.ok(Math.hypot(positions.first[0] - positions.second[0], positions.first[2] - positions.second[2]) >= 9);
});

test('native mouse, touch and Enter select the raycast agent without invoking world pointer-lock clicks', async t => {
  const page = await fixture(t);
  await page.evaluate(() => layer.upsert(base));
  const point = await page.evaluate(() => project(base.position));
  await page.mouse.click(point.x, point.y);
  await page.touchscreen.tap(point.x, point.y);
  await page.locator('canvas').focus(); await page.keyboard.press('Enter');
  assert.deepEqual(await page.evaluate(() => selected), ['local:agent-1', 'local:agent-1', 'local:agent-1']);
  assert.equal(await page.evaluate(() => worldClicks), 0);
  assert.equal(await page.evaluate(() => layer.entries.get(base.key).outline.material.color.getHexString()), 'ffffff');
  await page.mouse.click(20, 20);
  assert.equal(await page.evaluate(() => worldClicks), 1, 'ordinary scene clicks remain available');
  await page.mouse.move(point.x - 30, point.y); await page.mouse.down(); await page.mouse.move(point.x, point.y); await page.mouse.up();
  assert.equal(await page.evaluate(() => selected.length), 3, 'dragging the view must not start a conversation');
});

test('labels render plain text into bounded canvases and caption expiry releases textures', async t => {
  const page = await fixture(t, { captionDurationMs: 1000 });
  await page.clock.install();
  const evidence = await page.evaluate(() => {
    layer.upsert({ ...base, name: '<img src=x onerror=alert(1)>', caption: 'A visible reply. '.repeat(100) });
    const entry = layer.entries.get(base.key), canvas = entry.label.material.map.image;
    const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    let brightPixels = 0; for (let i = 0; i < pixels.length; i += 4) if (pixels[i] > 180 && pixels[i + 1] > 180) brightPixels++;
    window.captionDisposed = 0;
    entry.caption.material.map.addEventListener('dispose', () => captionDisposed++);
    return { width: canvas.width, height: canvas.height, brightPixels, captionWidth: entry.caption.material.map.image.width,
      captionHeight: entry.caption.material.map.image.height, imageElements: document.querySelectorAll('img').length };
  });
  assert.ok(evidence.width <= 512 && evidence.width > 40); assert.ok(evidence.height <= 88); assert.ok(evidence.brightPixels > 300);
  assert.equal(evidence.captionWidth, 768); assert.ok(evidence.captionHeight <= 184); assert.equal(evidence.imageElements, 0);
  await page.clock.runFor(1001);
  assert.deepEqual(await page.evaluate(() => ({ visible: Boolean(layer.entries.get(base.key).caption), disposed: captionDisposed })), { visible: false, disposed: 1 });
});

test('repeated unchanged speech metadata neither shortens caption expiry nor reopens an expired bubble', async t => {
  const page = await fixture(t, { captionDurationMs: 1000 }); await page.clock.install();
  await page.evaluate(() => layer.upsert({ ...base, caption: 'Keep this private reply.' }));
  await page.clock.runFor(600);
  await page.evaluate(() => layer.upsert({ ...base, caption: 'Keep this private reply.', status: 'thinking' }));
  assert.equal(await page.evaluate(() => Boolean(layer.entries.get(base.key).caption)), true);
  await page.clock.runFor(401);
  await page.evaluate(() => layer.upsert({ ...base, caption: 'Keep this private reply.', status: 'idle' }));
  assert.equal(await page.evaluate(() => Boolean(layer.entries.get(base.key).caption)), false);
});

test('removed caption timers cannot erase a replacement entity and all owned resources dispose once', async t => {
  const page = await fixture(t, { captionDurationMs: 1000 });
  await page.clock.install();
  await page.evaluate(() => { layer.upsert({ ...base, caption: 'First' }); });
  await page.clock.runFor(600);
  await page.evaluate(() => {
    layer.remove(base.key); layer.upsert({ ...base, caption: 'Replacement' });
    window.disposedAssets = 0;
    const entry = layer.entries.get(base.key);
    for (const asset of [entry.mesh.material, entry.outline.material, entry.label.material, entry.label.material.map,
      entry.caption.material, entry.caption.material.map, layer.geometry, layer.edgeGeometry]) asset.addEventListener('dispose', () => disposedAssets++);
  });
  await page.clock.runFor(450);
  assert.equal(await page.evaluate(() => Boolean(layer.entries.get(base.key).caption)), true);
  await page.evaluate(() => { layer.dispose(); layer.dispose(); });
  await page.clock.runFor(2000);
  assert.deepEqual(await page.evaluate(() => ({ disposedAssets, entries: layer.entries.size, bodies: physics.world.bodies.length,
    human: physics.world.bodies.includes(humanBody), sceneGroups: shell.scene.children.includes(layer.group), tabIndex: document.querySelector('canvas').getAttribute('tabindex') })),
  { disposedAssets: 8, entries: 0, bodies: 1, human: true, sceneGroups: false, tabIndex: null });
  await page.mouse.click(450, 300);
  assert.equal(await page.evaluate(() => selected.length), 0, 'disposed picking cannot reopen conversations');
  assert.equal(await page.evaluate(() => worldClicks), 1);
});

test('invalid or excessive public descriptors fail before changing the existing body', async t => {
  const page = await fixture(t, { maximumAgents: 1 });
  const result = await page.evaluate(() => {
    layer.upsert(base); let rejected = 0;
    for (const input of [{ ...base, position: [0, NaN, 0] }, { ...base, name: 'x'.repeat(241) }, { ...base, color: 'javascript:red' },
      { ...base, status: 'executing-code' }, { ...base, local: 'true' }, { ...base, caption: 'x'.repeat(4097) },
      { ...base, key: 'another-agent' }]) { try { layer.upsert(input); } catch { rejected++; } }
    return { rejected, count: layer.entries.size, bodies: physics.world.bodies.length, position: layer.entries.get(base.key).mesh.position.toArray() };
  });
  assert.deepEqual(result, { rejected: 7, count: 1, bodies: 2, position: [0, 3, 0] });
});

test('a paused local agent can render a full-length name before the owner is connected', async t => {
  const page = await fixture(t);
  assert.deepEqual(await page.evaluate(() => {
    layer.upsert({ ...base, name: 'A'.repeat(240), ownerPeerId: '', status: 'paused' });
    const entry = layer.entries.get(base.key);
    return { status: entry.descriptor.status, nameLength: entry.descriptor.name.length, owner: entry.descriptor.ownerPeerId,
      intensity: entry.mesh.material.emissiveIntensity };
  }), { status: 'paused', nameLength: 240, owner: '', intensity: .12 });
});

test('audio listener follows the physical avatar while orbit-camera translation only changes the view', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(() => {
    layer.upsert(base);
    const context = layer.getContext(base);
    shell.camera.position.set(3, 9, 25); shell.camera.lookAt(0, 3, 0);
    const pose = layer.getAudioPose(base.key);
    shell.camera.position.set(300, 90, 250); shell.camera.updateMatrixWorld();
    const zoomed = layer.getAudioPose(base.key);
    layer.getPlayerPosition = () => [2, 3, 7];
    const moved = layer.getAudioPose(base.key);
    return { context, pose, zoomed, moved, missing: layer.getAudioPose('missing'), focusMissing: layer.focus('missing') };
  });
  assert.deepEqual(result.context, { demo: 'CubeChat', theme: 'tron', agent: { name: 'Ada', position: [0, 3, 0], status: 'idle' }, nearbyPlayers: 1 });
  assert.deepEqual(result.pose.source, [0, 5, 0]); assert.deepEqual(result.pose.listener, [0, 5, 20]);
  assert.deepEqual(result.zoomed.listener, result.pose.listener);
  assert.deepEqual(result.zoomed.source, result.pose.source);
  assert.deepEqual(result.moved.listener, [2, 5, 7]);
  assert.ok(Math.abs(Math.hypot(...result.pose.forward) - 1) < 1e-9);
  assert.ok(Math.abs(Math.hypot(...result.pose.up) - 1) < 1e-9);
  assert.equal(result.missing, null); assert.equal(result.focusMissing, false);
});

test('CubeChat network stop acknowledges its node shutdown before releasing media ownership', async t => {
  const page = await fixture(t);
  await page.evaluate(async () => {
    const { P2PNetwork } = await import('/demos/cubechat/src/p2p/network.js');
    window.network = new P2PNetwork(); window.lifecycle = [];
    network.node = { stop: () => new Promise(resolve => { window.acknowledgeShutdown = resolve; lifecycle.push('stopping'); }) };
    network.networkManager = { queueEvent: () => lifecycle.push('leave') };
    network.localStream = { getTracks: () => [{ stop: () => lifecycle.push('media-stop') }] };
    window.stopped = false;
    window.stopPromise = network.stop().then(() => { stopped = true; });
  });
  assert.deepEqual(await page.evaluate(() => ({ stopped, lifecycle, ownsNode: Boolean(network.node) })),
    { stopped: false, lifecycle: ['leave', 'stopping'], ownsNode: true });
  assert.deepEqual(await page.evaluate(async () => {
    acknowledgeShutdown(); await stopPromise;
    return { stopped, lifecycle, node: network.node, manager: network.networkManager };
  }), { stopped: true, lifecycle: ['leave', 'stopping', 'media-stop'], node: null, manager: null });
});

test('failed node cleanup rejects stop and preserves ownership for an acknowledged retry', async t => {
  const page = await fixture(t);
  assert.deepEqual(await page.evaluate(async () => {
    const { P2PNetwork } = await import('/demos/cubechat/src/p2p/network.js');
    const network = new P2PNetwork(); let calls = 0, mediaStopped = 0;
    network.node = { async stop() { if (++calls === 1) throw new Error('Cleanup pending'); } };
    network.localStream = { getTracks: () => [{ stop: () => mediaStopped++ }] };
    let error;
    try { await network.stop(); } catch (failure) { error = failure.message; }
    const retained = Boolean(network.node), stoppedAfterFailure = mediaStopped;
    await network.stop();
    return { error, retained, stoppedAfterFailure, calls, mediaStopped, node: network.node };
  }), { error: 'Cleanup pending', retained: true, stoppedAfterFailure: 0, calls: 2, mediaStopped: 1, node: null });
});

test('resident face is copied onto +Z only, survives metadata refresh, and disposes on replace/remove', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(() => {
    layer.upsert(base); const entry = layer.entries.get(base.key);
    const image = { width: 2, height: 2, channels: 4, data: new Uint8Array([255,0,0,255, 0,255,0,255, 0,0,255,255, 255,255,255,255]) };
    layer.setAppearance(base.key, image); const first = entry.faceMaterial;
    const faceIndex = entry.mesh.material.findIndex(m => m.map?.isDataTexture);
    image.data.fill(0); const copied = first.map.image.data[0] === 255;
    const normal = entry.mesh.geometry.attributes.normal;
    const group = entry.mesh.geometry.groups[4]; const firstIndex = entry.mesh.geometry.index.getX(group.start);
    const orientation = [normal.getX(firstIndex), normal.getY(firstIndex), normal.getZ(firstIndex)];
    let disposed = 0; first.addEventListener('dispose', () => disposed++); first.map.addEventListener('dispose', () => disposed++);
    layer.upsert({ ...base, status: 'thinking', color: '#ff0000' });
    const preserved = entry.faceMaterial === first && entry.mesh.material[4] === first;
    layer.setAppearance(base.key, { ...image, data: new Uint8Array(16).fill(230) });
    const replaced = disposed; const second = entry.faceMaterial;
    second.addEventListener('dispose', () => disposed++); second.map.addEventListener('dispose', () => disposed++);
    let rejected = false; try { layer.setAppearance(base.key, { ...image, width: 300 }); } catch { rejected = true; }
    const afterInvalid = entry.faceMaterial === second;
    layer.remove(base.key);
    return { faceIndex, copied, orientation, preserved, replaced, disposed, rejected, afterInvalid,
      stale: layer.setAppearance(base.key, image) };
  });
  assert.deepEqual(result, { faceIndex: 4, copied: true, orientation: [0, 0, 1], preserved: true,
    replaced: 2, disposed: 4, rejected: true, afterInvalid: true, stale: false });
});
test('human and agent name labels fit content and reuse or dispose their owned resources', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const { TronScene } = await import('/demos/cubechat/src/renderer/scene.js');
    const player = new THREE.Mesh(new THREE.BoxGeometry(6,6,6), new THREE.MeshBasicMaterial());
    const scene = Object.create(TronScene.prototype); scene.players = new Map([['peer', player]]);
    scene.setPlayerName('peer', 'Ada'); const first = player.userData.nameLabel;
    let disposed = 0; first.material.addEventListener('dispose', () => disposed++); first.material.map.addEventListener('dispose', () => disposed++);
    const narrow = first.material.map.image.width;
    for (let i = 0; i < 30; i++) scene.setPlayerName('peer', 'Ada');
    const same = first === player.userData.nameLabel;
    scene.setPlayerName('peer', 'A much longer visible human name'); const next = player.userData.nameLabel;
    const changed = disposed, wide = next.material.map.image.width;
    next.material.addEventListener('dispose', () => disposed++); next.material.map.addEventListener('dispose', () => disposed++);
    const visible = !next.material.depthTest && !next.material.depthWrite && next.position.y === 4.5;
    scene.setPlayerName('peer', ''); const cleared = player.userData.nameLabel === null;
    layer.upsert(base); const label = layer.entries.get(base.key).label;
    return { narrow, wide, same, changed, disposed, visible, cleared,
      agentWidth: label.material.map.image.width, agentHeight: label.material.map.image.height, agentScale: label.scale.x };
  });
  assert.equal(result.same, true); assert.equal(result.changed, 2); assert.equal(result.disposed, 4);
  assert.equal(result.visible, true); assert.equal(result.cleared, true);
  assert.ok(result.narrow < 110 && result.wide > result.narrow && result.wide <= 512);
  assert.ok(result.agentWidth < 110 && result.agentHeight < 70 && result.agentScale < 2);
});

test('resident captions reuse the shared presenter and fit default desktop/390px cameras above compact names', async t => {
  const page = await fixture(t);
  for (const [width, height] of [[1440, 1000], [390, 844]]) {
    await page.setViewportSize({ width, height });
    const result = await page.evaluate(({ width, height }) => {
      shell.camera.fov = 75; shell.camera.aspect = width / height; shell.camera.position.set(0, 13, 15);
      shell.camera.lookAt(0, 3, 0); shell.camera.updateProjectionMatrix(); shell.camera.updateMatrixWorld();
      const caption = 'Hello room, I am the portrait resident. This longer reply should show only a readable overhead excerpt. '.repeat(10);
      return [0, -14].map(z => {
        layer.remove(base.key); layer.upsert({ ...base, position: [0,3,z], caption });
        const entry = layer.entries.get(base.key); const sprite = entry.caption;
        const corners = [-1,1].flatMap(x=>[-1,1].map(y=>new THREE.Vector3(x*sprite.scale.x/2,y*sprite.scale.y/2,0)
          .applyQuaternion(shell.camera.quaternion).add(sprite.position).project(shell.camera).toArray()));
        const before = sprite.position.x; entry.mesh.position.x += 2; layer.captions.update();
        const followed = Math.abs(sprite.position.x - before - 2) < 1e-9;
        return { shared: layer.captions.entries.get(base.key).sprite === sprite,
          visible: sprite.visible, corners, height: sprite.material.map.image.height, followed,
          nameY: entry.label.position.y, annotation: !sprite.material.depthTest && !sprite.material.depthWrite,
          aboveName: sprite.position.y-sprite.scale.y/2 > entry.mesh.position.y+entry.label.position.y+entry.label.scale.y/2 };
      });
    }, { width, height });
    for (const item of result) {
      assert.equal(item.shared,true); assert.equal(item.visible,true); assert.equal(item.followed,true);
      assert.equal(item.nameY,4.5); assert.equal(item.annotation,true); assert.equal(item.aboveName,true);
      assert.ok(item.height <= 184);
      for (const corner of item.corners) assert.ok(Math.abs(corner[0]) < 1 && Math.abs(corner[1]) < 1, `${width}: ${JSON.stringify(corner)}`);
    }
  }
});

test('bounded observations identify same-named humans distinctly and include current resident/obstacle poses', async t=>{
 const page=await fixture(t);
 const result=await page.evaluate(()=>{
  layer.upsert(base);layer.upsert({...base,key:'other:agent2',agentId:'agent2',ownerPeerId:'other',name:'Visitor',local:false,position:[10,3,5]});
  participants=[{id:'human:one',peerId:'one',name:'Same name',position:[5,3,0],velocity:[1,0,0]},
   {id:'human:two',peerId:'two',name:'Same name',position:[8,3,0],velocity:[0,0,1]},
   ...Array.from({length:50},(_,i)=>({id:'human:p'+i,peerId:'p'+i,name:'More',position:[20+i,3,0]}))];
  const value=layer.observe(base.key,{requesterPeerId:'two'});return value;
 });
 assert.equal(result.participants.length,16);assert.equal(result.requesterId,'human:two');assert.equal(result.participants[0].id,'human:two');
 assert(result.participants.some(p=>p.id==='human:one'));assert(result.participants.some(p=>p.id==='resident:other:agent2'));
 assert(result.obstacles.length<=8);assert.equal(result.self.agentId,'agent-1');assert.deepEqual(result.self.velocity,[0,0,0]);
});

test('no motor means no hidden follow fallback and stale asynchronous actions cannot override stop', async t=>{
 const page=await fixture(t);
 const result=await page.evaluate(async()=>{
  layer.upsert(base);const outcomes=[];layer.subscribeOutcomes(e=>outcomes.push(e));
  layer.setIntent(base.key,{type:'follow',targetId:'human:owner-peer',requestId:'first'});await advance(15);const without=layer.getPosition(base.key);
  let release;layer.setMotor({infer:requests=>new Promise(resolve=>{release=()=>resolve({results:requests.map(({id})=>({id,acceleration:[12,12]}))});})});
  for(let i=0;i<6;i++){physics.world.step(1/60);layer.update(1/60);}await Promise.resolve();
  const pending=layer.motor.pending.done;layer.setIntent(base.key,{type:'stop',requestId:'stop'});release();await pending;await advance(12);
  const stopped=layer.getPosition(base.key);return {without,stopped,outcomes,commands:layer.motor.commands.size};
 });
 assert.deepEqual(result.without,[0,3,0]);assert.deepEqual(result.stopped,result.without);assert.equal(result.commands,0);
 assert(result.outcomes.some(e=>e.status==='failed'&&e.requestId==='first'));assert(result.outcomes.some(e=>e.status==='stopped'&&e.requestId==='stop'));
});

test('saved movement changes apply once while unchanged thinking updates preserve live neural intentions', async t=>{
 const page=await fixture(t);
 const result=await page.evaluate(async()=>{
  layer.upsert({...base,movement:'stationary'});layer.setMotor(controlledMotor);layer.setIntent(base.key,{type:'follow',targetId:'human:owner-peer',requestId:'live'});
  layer.upsert({...base,movement:'stationary',status:'thinking'});await advance(60);const moving=layer.getPosition(base.key);
  const intent=layer.motor.intents.get(base.key).requestId;
  layer.upsert({...base,movement:'roam'});const cleared=!layer.motor.intents.has(base.key);
  layer.upsert({...base,movement:'stationary'});await advance(12);return {moving,intent,cleared,velocity:layer.entries.get(base.key).body.velocity.toArray()};
 });
 assert(result.moving[2]>1);assert.equal(result.intent,'live');assert.equal(result.cleared,true);assert.deepEqual(result.velocity,[0,0,0]);
});

test('a failed managed motor halts once without repeatedly requesting an unsupported controller', async t=>{
 const page=await fixture(t);
 const result=await page.evaluate(async()=>{
  layer.upsert({...base,movement:'stationary'});let requests=0;const outcomes=[];layer.subscribeOutcomes(value=>outcomes.push(value));
  layer.setMotor({infer:async()=>{requests++;throw Error('WebGPU unavailable');}});
  layer.setIntent(base.key,{type:'follow',targetId:'human:owner-peer'});await advance(360);
  return {requests,position:layer.getPosition(base.key),failures:outcomes.filter(e=>e.status==='failed').length};
 });
 assert.deepEqual(result,{requests:1,position:[0,3,0],failures:1});
});

test('manual intentions and pause lifecycle advance a monotonic observed revision; looking reports applied orientation once', async t=>{
 const page=await fixture(t);
 const result=await page.evaluate(async()=>{
  layer.upsert({...base,movement:'stationary'});const revisions=[layer.observe(base.key).self.intentRevision],outcomes=[];
  layer.subscribeOutcomes(e=>outcomes.push(e));participants[0].position=[20,3,0];
  layer.setIntent(base.key,{type:'look-at',targetId:'human:owner-peer',requestId:'look'});revisions.push(layer.observe(base.key).self.intentRevision);await advance(12);
  const yaw=layer.entries.get(base.key).mesh.rotation.y;
  layer.setMovement(base.key,'stationary');revisions.push(layer.observe(base.key).self.intentRevision);
  layer.upsert({...base,movement:'stationary',status:'paused'});revisions.push(layer.observe(base.key).self.intentRevision);
  layer.upsert({...base,movement:'stationary',status:'idle'});revisions.push(layer.observe(base.key).self.intentRevision);
  layer.remove(base.key);layer.upsert({...base,movement:'stationary'});revisions.push(layer.observe(base.key).self.intentRevision);
  return {revisions,yaw,outcomes};
 });
 assert(result.revisions.every((n,i)=>i===0||n>result.revisions[i-1]));assert(Math.abs(result.yaw-Math.PI/2)<1e-9);
 assert.equal(result.outcomes.filter(e=>e.requestId==='look'&&e.status==='arrived').length,1);
});

test('private local residents stay out of all other resident senses and physical target lookup', async t=>{
 const page=await fixture(t);
 const result=await page.evaluate(()=>{
  layer.upsert(base);layer.upsert({...base,key:'local:hidden',agentId:'hidden',name:'Private identity',position:[5,3,5],shared:false});
  layer.upsert({...base,key:'local:public',agentId:'public',name:'Public identity',position:[15,3,5],shared:true});
  const sensed=layer.observe(base.key);let rejected=false;try{layer.setIntent(base.key,{type:'follow',targetId:'resident:owner-peer:hidden'});}catch{rejected=true;}
  return {sensed,rejected,rendered:layer.entries.size,ownPrivate:layer.observe('local:hidden').self.name};
 });
 assert(!JSON.stringify(result.sensed).includes('Private identity'));assert(!result.sensed.participants.some(p=>p.agentId==='hidden'));
 assert(!result.sensed.obstacles.some(o=>o.position[0]===5&&o.position[2]===5));assert(result.sensed.participants.some(p=>p.agentId==='public'));
 assert.equal(result.rejected,true);assert.equal(result.rendered,3);assert.equal(result.ownPrivate,'Private identity');
});

test('restored owner follow retains its body while the owner is absent, then follows only after observation returns', async t=>{
 const page=await fixture(t);
 const result=await page.evaluate(async()=>{
  participants[0].position=[0,3,400];const outcomes=[];layer.subscribeOutcomes(e=>outcomes.push(e));
  layer.upsert({...base,movement:'follow'});layer.setMotor(controlledMotor);const body=layer.entries.get(base.key).body;
  await advance(60);const waiting={position:layer.getPosition(base.key),calls:motorCalls.length,outcomes:[...outcomes]};
  let manualRejected=false,modelRejected=false;
  try{layer.setMovement(base.key,'follow');}catch{manualRejected=true;}
  try{layer.setIntent(base.key,{type:'follow',targetId:'human:owner-peer'});}catch{modelRejected=true;}
  participants[0].position=[0,3,20];await advance(120);
  return {waiting,manualRejected,modelRejected,position:layer.getPosition(base.key),calls:motorCalls.length,same:body===layer.entries.get(base.key).body};
 });
 assert.deepEqual(result.waiting.position,[0,3,0]);assert.equal(result.waiting.calls,0);
 assert.equal(result.waiting.outcomes.filter(e=>e.status==='target-lost').length,1);
 assert.equal(result.manualRejected,true);assert.equal(result.modelRejected,true);assert.equal(result.same,true);
 assert(result.calls>0&&result.position[2]>4);
});

test('restored follow can wait for the owner session identity without leaving a duplicate or missing body', async t=>{
 const page=await fixture(t);
 const result=await page.evaluate(async()=>{
  participants=[];layer.upsert({...base,ownerPeerId:'',movement:'follow'});layer.setMotor(controlledMotor);await advance(30);
  const first=layer.entries.get(base.key).body;
  participants=[{id:'human:owner-peer',peerId:'owner-peer',name:'Owner',position:[0,3,20],velocity:[0,0,0]}];
  layer.upsert({...base,movement:'follow'});await advance(90);
  return {same:first===layer.entries.get(base.key).body,count:layer.entries.size,target:layer.motor.intents.get(base.key).targetId,position:layer.getPosition(base.key)};
 });
 assert.equal(result.same,true);assert.equal(result.count,1);assert.equal(result.target,'human:owner-peer');assert(result.position[2]>2);
});

test('motor ticks avoid public terrain queries, preserve visibility admission and invalidate geometry after body removal', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    layer.upsert(base); layer.setMotor(controlledMotor); layer.setIntent(base.key, { type: 'follow', targetId: 'human:owner-peer' });
    let groundReads = 0, sensorReads = 0;
    layer.groundHeight = () => { groundReads++; return 0; };
    const sample = layer.navigationSensors.sample.bind(layer.navigationSensors);
    layer.navigationSensors.sample = (...args) => { sensorReads++; return sample(...args); };
    for (let i = 0; i < 60; i++) { physics.world.step(1 / 60); if (layer.motor.pending) await layer.motor.pending.done; }
    const hotPath = { groundReads, sensorReads };
    humanBody.position.x = 40;
    layer.observe(base.key); const publicReads = groundReads;
    physics.world.removeBody(humanBody); physics.world.step(1 / 60);
    const afterRemoval = sensorReads;
    participants.push({ id: 'human:hidden', peerId: 'hidden', name: 'Distant', position: [400, 3, 0] });
    physics.bodies.set('hidden', new CANNON.Body({ position: new CANNON.Vec3(10, 3, 0) }));
    let unseenRejected = false;
    try { layer.setIntent(base.key, { type: 'follow', targetId: 'human:hidden' }); } catch { unseenRejected = true; }
    layer.setMovement(base.key, 'roam'); groundReads = 0;
    for (let i = 0; i < 60; i++) physics.world.step(1 / 60);
    return { hotPath, publicReads, afterRemoval, unseenRejected, roamGroundReads: groundReads };
  });
  assert.deepEqual(result.hotPath, { groundReads: 0, sensorReads: 11 });
  assert(result.publicReads > 0); assert.equal(result.afterRemoval, 12); assert.equal(result.unseenRejected, true);
  assert.equal(result.roamGroundReads, 0);
});

test('generated avatars keep the same physics body, motion, picking and identity; reset restores the latest portrait', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const { encodeGeneratedMesh } = await import('/peercompute/src/peercompute/inference/GeneratedMeshArtifact.js');
    const artifactCid = 'bafkreihd7nlvbwjkdustvo23a7jo44x6lc26n7pob5bsqtyutvwen26spe';
    const avatar = { kind: 'generated-mesh', artifactCid };
    layer.upsert({ ...base, avatar }); const entry = layer.entries.get(base.key), body = entry.body, root = entry.mesh;
    const mesh = encodeGeneratedMesh({ positions: new Float32Array([-1,0,-1, 1,0,-1, 0,1,1]), indices: new Uint32Array([0,1,2]) });
    const prepared = await layer.prepareAvatar(mesh); prepared.commit(base.key, { avatar });
    entry.mesh.updateWorldMatrix(true, true);
    const active = entry.avatarView, box = new THREE.Box3().setFromObject(active.group);
    const renderedCid = active.avatar.artifactCid, taggedCid = active.group.userData.residentAvatar.artifactCid;
    layer.setAppearance(base.key, { width: 1, height: 1, channels: 4, data: new Uint8Array([255,0,0,255]) });
    const hidden = !entry.baseMaterial.visible && !entry.faceMaterial.visible && !entry.outline.visible;
    const {x,y} = project([0,1.5,0]), picked = layer.pick(x,y);
    let disposed = 0; active.group.traverse(item => item.geometry?.addEventListener('dispose', () => disposed++));
    layer.setMovement(base.key, 'stationary'); layer.place(entry, [8,3,2]); layer.upsert({ ...base, avatar, name: 'Robot' });
    const same = entry.body === body && entry.mesh === root && physics.world.bodies.length === 2 && layer.entries.size === 1;
    layer.clearAvatar(base.key); layer.clearAvatar(base.key);
    return { same, hidden, picked, renderedCid, taggedCid, minY: box.min.y, extent: box.getSize(new THREE.Vector3()).toArray(), disposed,
      position: entry.mesh.position.toArray(), restored: entry.baseMaterial.visible && entry.faceMaterial.visible && entry.outline.visible };
  });
  assert.equal(result.same, true); assert.equal(result.hidden, true); assert.equal(result.picked, 'local:agent-1');
  assert.equal(result.renderedCid, 'bafkreihd7nlvbwjkdustvo23a7jo44x6lc26n7pob5bsqtyutvwen26spe');
  assert.equal(result.taggedCid, result.renderedCid);
  assert.equal(result.minY, 0); assert.equal(Math.max(...result.extent), 6); assert.equal(result.disposed, 1);
  assert.deepEqual(result.position, [8,3,2]); assert.equal(result.restored, true);
});

test('generated avatar fronts follow local movement, remote interpolation and look-at without rotating physics', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const { encodeGeneratedMesh, validateGeneratedMesh } = await import('/peercompute/src/peercompute/inference/GeneratedMeshArtifact.js');
    const tagGenerator = (mesh, generator) => {
      const data = mesh.data, header = new DataView(data.buffer, data.byteOffset, data.byteLength), oldLength = header.getUint32(12, true);
      const json = JSON.parse(new TextDecoder().decode(data.subarray(20, 20 + oldLength))); json.asset.generator = generator;
      const bytes = new TextEncoder().encode(JSON.stringify(json)), length = Math.ceil(bytes.length / 4) * 4;
      const next = new Uint8Array(data.length + length - oldLength), view = new DataView(next.buffer);
      next.set(data.subarray(0, 20)); view.setUint32(8, next.length, true); view.setUint32(12, length, true);
      next.fill(32, 20, 20 + length); next.set(bytes, 20); next.set(data.subarray(20 + oldLength), 20 + length);
      return validateGeneratedMesh({ data: next });
    };
    const avatar = { kind: 'generated-mesh', artifactCid: 'bafkreihd7nlvbwjkdustvo23a7jo44x6lc26n7pob5bsqtyutvwen26spe' };
    const results = [];
    for (const [local, generator, sign] of [[true, 'SF3D-WebGPU', -1], [false, 'SF3D-WebGPU', -1],
      [true, 'PeerCompute generated mesh', 1]]) {
      const key = local ? base.key : 'remote:agent-1', descriptor = { ...base, key, local, avatar, movement: 'stationary', caption: 'Hello' };
      layer.upsert(descriptor);
      const entry = layer.entries.get(key), body = entry.body, root = entry.mesh;
      // An asymmetric arrow-shaped body, with its nose on this exporter’s front axis.
      const mesh = tagGenerator(encodeGeneratedMesh({ positions: new Float32Array([-1,0,0, 1,0,0, 0,0,sign * 3, 0,2,0]),
        indices: new Uint32Array([0,1,2, 0,3,1, 0,2,3, 1,3,2]) }), generator);
      const prepared = await layer.prepareAvatar(mesh); prepared.commit(key, { avatar });
      const facing = () => {
        root.updateWorldMatrix(true, true); const asset = entry.avatarView.group.children[0];
        return asset.localToWorld(new THREE.Vector3(0, .5, sign)).sub(asset.localToWorld(new THREE.Vector3(0, .5, 0))).normalize();
      };
      const dots = [];
      for (const [dx, dz] of local ? [[0,4], [4,0], [0,-4], [-4,0]] : [[4,0]]) {
        const previous = root.position.clone();
        if (local) { body.position.x += dx; body.position.z += dz; }
        else layer.upsert({ ...descriptor, position: [previous.x + dx, 3, previous.z + dz] });
        layer.afterPhysics(.1);
        const moved = root.position.clone().sub(previous).normalize(); dots.push(facing().dot(moved));
      }
      let lookDot = null;
      if (local) {
        participants[0].position = [body.position.x + 20, 3, body.position.z + 4];
        layer.setIntent(key, { type: 'look-at', targetId: 'human:owner-peer', requestId: 'look-generated' });
        layer.beforePhysics(); lookDot = facing().dot(new THREE.Vector3(20, 0, 4).normalize());
      }
      const asset = entry.avatarView.group.children[0], center = asset.localToWorld(new THREE.Vector3(0, .5, sign * .75));
      const point = project(center.toArray()), pick = layer.pick(point.x, point.y);
      const bounds = new THREE.Box3().setFromObject(entry.avatarView.group);
      const labelY = entry.label.getWorldPosition(new THREE.Vector3()).y;
      const sameBody = entry.body === body && entry.mesh === root, quaternion = body.quaternion.toArray();
      const yaw = entry.avatarView.group.rotation.y;
      layer.clearAvatar(key); const restored = entry.baseMaterial.visible && entry.outline.visible;
      results.push({ local, generator, dots, lookDot, pick, key, sameBody, quaternion, yaw,
        ground: bounds.min.y, labelY, height: bounds.max.y, restored,
        unchanged: validateGeneratedMesh(mesh).sha256 === mesh.sha256 });
      layer.remove(key);
    }
    return results;
  });
  for (const value of result) {
    value.dots.forEach(dot => assert(Math.abs(dot - 1) < 1e-9));
    if (value.local) assert(Math.abs(value.lookDot - 1) < 1e-9);
    assert.equal(value.pick, value.key); assert.equal(value.sameBody, true);
    assert.deepEqual(value.quaternion, [0, 0, 0, 1]); assert.equal(value.restored, true); assert.equal(value.unchanged, true);
    assert.equal(value.yaw, value.generator === 'SF3D-WebGPU' ? Math.PI : 0);
    assert(Math.abs(value.ground) < 1e-9); assert(Math.abs(value.labelY - value.height - 1.5) < 1e-9);
  }
});

test('semantic avatar sizes preserve proportions, grounded feet, captions and the existing physics body', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const { encodeGeneratedMesh } = await import('/peercompute/src/peercompute/inference/GeneratedMeshArtifact.js');
    const geometry = new THREE.BoxGeometry(4, 2, 2);
    const mesh = encodeGeneratedMesh({ positions: geometry.attributes.position.array, indices: new Uint32Array(geometry.index.array) });
    geometry.dispose();
    const avatar = { kind: 'generated-mesh', artifactCid: 'bafkreihd7nlvbwjkdustvo23a7jo44x6lc26n7pob5bsqtyutvwen26spe' };
    layer.upsert({ ...base, avatar, caption: 'Hello' });
    const entry = layer.entries.get(base.key), body = entry.body, root = entry.mesh, measurements = [];
    for (const size of [.6, 6, 15]) {
      const prepared = await layer.prepareAvatar(mesh, { size }); prepared.commit(base.key, { avatar });
      layer.upsert({ ...base, avatar, caption: 'Hello', name: `Size ${size}`, status: 'speaking' });
      root.updateWorldMatrix(true, true);
      const bounds = new THREE.Box3().setFromObject(entry.avatarView.group), label = entry.label.getWorldPosition(new THREE.Vector3());
      const caption = layer.captions.entries.get(base.key).sprite;
      measurements.push({ size, dimensions: bounds.getSize(new THREE.Vector3()).toArray(), ground: bounds.min.y,
        label: label.y, captionBottom: caption.position.y - caption.scale.y / 2,
        storedSize: entry.avatarView.worldSize, sameBody: entry.body === body && entry.mesh === root,
        collision: body.shapes[0].halfExtents.toArray() });
    }
    const carPoint = project([6,3,0]), carPick = layer.pick(carPoint.x, carPoint.y);
    const tiny = await layer.prepareAvatar(mesh, { size: .6 }); tiny.commit(base.key, { avatar });
    const emptyPoint = project([2,3,0]), emptyPick = layer.pick(emptyPoint.x, emptyPoint.y);
    const tinyPoint = project([0,.15,0]), tinyPick = layer.pick(tinyPoint.x, tinyPoint.y);
    layer.clearAvatar(base.key); root.updateWorldMatrix(true, true);
    const cubePoint = project([2,3,0]);
    return { measurements, carPick, emptyPick, tinyPick, cubePick: layer.pick(cubePoint.x, cubePoint.y),
      resetLabel: entry.label.getWorldPosition(new THREE.Vector3()).y,
      resetCaptionBottom: entry.caption.position.y - entry.caption.scale.y / 2,
      bodyCount: physics.world.bodies.length };
  });
  for (const value of result.measurements) {
    assert.equal(value.storedSize, value.size); assert.equal(value.sameBody, true);
    assert.deepEqual(value.collision, [3,3,3]);
    value.dimensions.forEach((dimension, axis) => assert(Math.abs(dimension - value.size * (axis ? .5 : 1)) < 1e-6));
    assert(Math.abs(value.ground) < 1e-6);
    assert(Math.abs(value.label - (value.size / 2 + 1.5)) < 1e-6);
    assert(Math.abs(value.captionBottom - (value.size / 2 + 3)) < 1e-6);
  }
  assert.equal(result.carPick, 'local:agent-1'); assert.equal(result.emptyPick, null);
  assert.equal(result.tinyPick, 'local:agent-1'); assert.equal(result.cubePick, 'local:agent-1');
  assert.equal(result.resetLabel, 7.5); assert.equal(result.resetCaptionBottom, 9); assert.equal(result.bodyCount, 2);
});

test('placed objects use the same uniform size and stay grounded above uneven terrain', async t => {
  const page = await fixture(t);
  const result = await page.evaluate(async () => {
    const { CubeGeneratedObjectLayer } = await import('/demos/cubechat/src/renderer/CubeGeneratedObjectLayer.js');
    const { encodeGeneratedMesh } = await import('/peercompute/src/peercompute/inference/GeneratedMeshArtifact.js');
    const { WORLD_OBJECT_SCHEMA } = await import('/demos/shared/agents/WorldObjectAction.js');
    const geometry = new THREE.BoxGeometry(4, 2, 2);
    const mesh = encodeGeneratedMesh({ positions: geometry.attributes.position.array, indices: new Uint32Array(geometry.index.array) });
    geometry.dispose();
    const objects = new CubeGeneratedObjectLayer({ scene: { ...shell, gridSize: 100 },
      physics: { getGroundHeight: () => 7 }, getResidentPosition: () => [0,10,0] });
    const measurements = [];
    try {
      for (const size of [.6, 6, 15]) {
        const placement = { schema: WORLD_OBJECT_SCHEMA, worldId: 'scale-world', ownerHostId: 'host', agentId: 'agent',
          objectId: `scale-${size}`, requestId: `scale-${size}`, requestHash: 'a'.repeat(64), name: 'Scaled prop',
          position: objects.getPlacement('agent', size), size };
        const prepared = await objects.prepare(mesh); prepared.commit(placement.objectId,
          { artifactCid: 'bafkreihd7nlvbwjkdustvo23a7jo44x6lc26n7pob5bsqtyutvwen26spe', placement });
        const entry = objects.entries.get(placement.objectId); entry.group.updateWorldMatrix(true, true);
        const bounds = new THREE.Box3().setFromObject(entry.group);
        measurements.push({ size, dimensions: bounds.getSize(new THREE.Vector3()).toArray(), ground: bounds.min.y,
          x: entry.group.position.x, bodies: physics.world.bodies.length });
      }
    } finally { objects.dispose(); }
    return { measurements, remaining: objects.entries.size };
  });
  for (const value of result.measurements) {
    value.dimensions.forEach((dimension, axis) => assert(Math.abs(dimension - value.size * (axis ? .5 : 1)) < 1e-6));
    assert.equal(value.ground, 7); assert.equal(value.x, 6 + value.size / 2); assert.equal(value.bodies, 1);
  }
  assert.equal(result.remaining, 0);
});
