import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createReadStream, existsSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { runSimulationProfile } from '../../net-chaos-lab/agent/player-behavior-harness.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const docsRoot = path.join(repoRoot, 'docs');
const host = process.env.DEMO_HOST || '127.0.0.1';
const port = Number(process.env.DEMO_PORT || 4180);
const baseUrl = `http://${host}:${port}`;
const relayConfigTimeoutMs = Number(process.env.RELAY_CONFIG_TIMEOUT_MS || 10000);
const demoTimeoutMs = Number(process.env.DEMO_TIMEOUT_MS || 30000);
const interactionMs = Number(process.env.RUNTIME_P2P_INTERACTION_MS || 3000);
const movementEpsilon = Number(process.env.RUNTIME_P2P_MOVEMENT_EPSILON || 0.01);
const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  || process.env.CHROME_EXECUTABLE_PATH
  || (existsSync('/bin/google-chrome') ? '/bin/google-chrome' : undefined);

const demos = [
  { name: 'cubechat', path: '/cubechat/' },
  { name: 'hyperborea', path: '/hyperborea/cb.html' },
  { name: 'sneakywoods', path: '/sneakywoods/' },
  { name: 'daddygo', path: '/daddygo/' },
  { name: 'netviz', path: '/netviz/' }
];
const selectedDemoNames = new Set(
  String(process.env.RUNTIME_P2P_DEMOS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
);
const selectedDemos = selectedDemoNames.size
  ? demos.filter((demo) => selectedDemoNames.has(demo.name))
  : demos;

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const ignoredConsoleErrors = [
  /Failed to acquire a WebGPU adapter/i,
  /WebGPU is not supported/i,
  /WebGPU device lost/i,
  /Device was destroyed/i,
  /root document of this element is not valid for pointer lock/i,
  /Failed to load resource: the server responded with a status of 404/i
];

const ignored404Urls = [
  /\/favicon\.ico$/i,
  /\/manifest\.webmanifest$/i,
  /\/relay-config-source\.json$/i,
  /\/\.relay-config-source\.json$/i
];

function resolveRequestPath(reqUrl) {
  const reqPath = decodeURIComponent((reqUrl || '/').split('?')[0]);
  const trimmed = reqPath.replace(/^\/+/, '');
  const rawPath = trimmed.endsWith('/') || trimmed === ''
    ? `${trimmed}index.html`
    : trimmed;
  const normalized = path.normalize(path.join(docsRoot, rawPath));
  if (!normalized.startsWith(docsRoot)) return null;
  return normalized;
}

function startServer() {
  const server = http.createServer((req, res) => {
    const filePath = resolveRequestPath(req.url);
    if (!filePath) {
      res.writeHead(403);
      res.end();
      return;
    }
    try {
      const ext = path.extname(filePath);
      const contentType = mime[ext] || 'application/octet-stream';
      const stat = statSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': stat.size });
      createReadStream(filePath).pipe(res);
    } catch (_) {
      res.writeHead(404);
      res.end();
    }
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => resolve(server));
  });
}

function checkDocsBuild() {
  if (!existsSync(docsRoot)) {
    throw new Error('docs/ folder missing. Run `npm run build` first.');
  }
  const missing = selectedDemos.filter((demo) => {
    const relPath = demo.path.endsWith('.html')
      ? demo.path
      : `${demo.path.replace(/\/?$/, '/') }index.html`;
    const filePath = path.join(docsRoot, relPath);
    return !existsSync(filePath);
  });
  if (missing.length) {
    throw new Error(
      `Missing demo builds: ${missing.map((demo) => demo.name).join(', ')}. Run \`npm run build\` first.`
    );
  }
}

function isIgnoredError(message) {
  return ignoredConsoleErrors.some((pattern) => pattern.test(message));
}

function waitForFiles(filePaths, timeoutMs) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (filePaths.every((filePath) => existsSync(filePath))) {
        resolve();
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Timed out waiting for relay-config.json in ${filePaths.join(', ')}`));
        return;
      }
      setTimeout(tick, 200);
    };
    tick();
  });
}

function snapshotFiles(filePaths) {
  return new Map(filePaths.map((filePath) => {
    if (!existsSync(filePath)) {
      return [filePath, { existed: false, content: null }];
    }
    return [filePath, { existed: true, content: readFileSync(filePath) }];
  }));
}

function restoreFiles(snapshots) {
  for (const [filePath, snapshot] of snapshots.entries()) {
    if (snapshot.existed) {
      writeFileSync(filePath, snapshot.content);
    } else if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}

function startRelay() {
  const relayDemoNames = [...new Set([
    ...selectedDemos.map((demo) => demo.name),
    ...(selectedDemos.some((demo) => demo.name === 'netviz') ? ['cubechat'] : [])
  ])];
  const relayConfigDirs = relayDemoNames
    .map((name) => path.join(docsRoot, name))
    .filter((dir) => existsSync(dir));
  const relayConfigPaths = relayConfigDirs.flatMap((dir) => ([
    path.join(dir, 'relay-config.json'),
    path.join(dir, '.relay-config.json'),
    path.join(dir, 'relay-config-source.json'),
    path.join(dir, '.relay-config-source.json')
  ]));
  const relayConfigSnapshots = snapshotFiles(relayConfigPaths);
  relayConfigPaths.forEach((filePath) => {
    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath);
      } catch (_) {
        // ignore cleanup failures
      }
    }
  });

  const child = spawn('bash', [path.join(repoRoot, 'scripts', 'run-relay.sh')], {
    env: {
      ...process.env,
      RELAY_LISTEN_HOST: host,
      RELAY_LISTEN_PORT: '0',
      RELAY_PUBLIC_HOST: host,
      RELAY_CONFIG_DIRS: relayConfigDirs.join(',')
    },
    detached: process.platform !== 'win32',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  child.stdout.on('data', (chunk) => {
    process.stdout.write(chunk);
  });
  child.stderr.on('data', (chunk) => {
    process.stderr.write(chunk);
  });

  return {
    child,
    relayConfigPaths: relayConfigDirs.map((dir) => path.join(dir, 'relay-config.json')),
    relayConfigDirs,
    relayConfigSnapshots
  };
}

function signalRelay(child, signal) {
  if (!child?.pid) return;
  if (process.platform !== 'win32') {
    try {
      process.kill(-child.pid, signal);
      return;
    } catch (err) {
      if (err?.code === 'ESRCH') return;
    }
  }
  try {
    child.kill(signal);
  } catch (_) {
    // ignore shutdown races
  }
}

function stopRelay(relay) {
  const child = relay?.child;
  if (!child || child.exitCode !== null || child.signalCode !== null) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    let settled = false;
    let killTimer;
    let doneTimer;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(killTimer);
      clearTimeout(doneTimer);
      child.off('exit', finish);
      resolve();
    };
    child.once('exit', finish);
    signalRelay(child, 'SIGTERM');
    killTimer = setTimeout(() => signalRelay(child, 'SIGKILL'), 2000);
    doneTimer = setTimeout(finish, 5000);
  });
}

function attachPageErrorLogging(page, errors) {
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (isIgnoredError(text)) return;
    errors.push(`[console] ${text}`);
  });
  page.on('pageerror', (err) => {
    const message = err?.message || String(err);
    if (isIgnoredError(message)) return;
    errors.push(`[pageerror] ${message}`);
  });
  page.on('response', (response) => {
    if (response.status() !== 404) return;
    const url = response.url();
    if (ignored404Urls.some((pattern) => pattern.test(url))) return;
    errors.push(`[404] ${url}`);
  });
}

function createConsoleBuffer(page, filter) {
  const buffer = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (filter && !filter(text, msg)) return;
    buffer.push(text);
    if (buffer.length > 200) buffer.shift();
  });
  return buffer;
}

function waitForConsoleMatch(page, matcher, timeoutMs, label, buffer) {
  if (buffer) {
    const existing = buffer.find((text) => matcher(text));
    if (existing) return Promise.resolve(existing);
  }
  return new Promise((resolve, reject) => {
    const onConsole = (msg) => {
      const text = msg.text();
      if (!matcher(text, msg)) return;
      cleanup();
      resolve(text);
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`Timeout waiting for console match (${label || 'match'})`));
    }, timeoutMs);
    const cleanup = () => {
      clearTimeout(timer);
      page.off('console', onConsole);
    };
    page.on('console', onConsole);
  });
}

function asPoint(value) {
  if (!value || typeof value !== 'object') return null;
  const x = Number(value.x);
  const y = Number(value.y);
  const z = Number(value.z);
  if (![x, y, z].every(Number.isFinite)) return null;
  return { x, y, z };
}

function distanceBetween(a, b) {
  const left = asPoint(a);
  const right = asPoint(b);
  if (!left || !right) return 0;
  const dx = left.x - right.x;
  const dy = left.y - right.y;
  const dz = left.z - right.z;
  return Math.hypot(dx, dy, dz);
}

function summarizeBridgeSnapshot(snapshot) {
  if (!snapshot) return null;
  return {
    gameId: snapshot.gameId || null,
    localId: snapshot.localId || null,
    localPosition: asPoint(snapshot.localPosition),
    peerCount: Number(snapshot.peerCount || 0),
    peers: Array.isArray(snapshot.peers)
      ? snapshot.peers.map((peer) => ({
        id: peer?.id || null,
        position: asPoint(peer?.position),
        hasMedia: Boolean(peer?.hasMedia),
        screenSharing: Boolean(peer?.screenSharing),
        lastSeenAgeMs: Number.isFinite(peer?.lastSeenAgeMs) ? peer.lastSeenAgeMs : null
      })).filter((peer) => peer.id)
      : []
  };
}

async function readBotBridgeSnapshot(page, bridgeId) {
  const snapshot = await page.evaluate((id) => {
    const registry = window.__PEERCOMPUTE_BOT_BRIDGES__;
    const bridge = registry?.[id] || null;
    if (!bridge || typeof bridge.snapshot !== 'function') return null;
    return bridge.snapshot() || null;
  }, bridgeId).catch(() => null);
  return summarizeBridgeSnapshot(snapshot);
}

async function waitForBotBridgeSnapshot(page, bridgeId, label) {
  await page.waitForFunction((id) => {
    const registry = window.__PEERCOMPUTE_BOT_BRIDGES__;
    const bridge = registry?.[id] || null;
    if (!bridge || typeof bridge.snapshot !== 'function') return false;
    const snapshot = bridge.snapshot() || null;
    return Boolean(snapshot?.localId && snapshot?.localPosition);
  }, bridgeId, { timeout: demoTimeoutMs });
  const snapshot = await readBotBridgeSnapshot(page, bridgeId);
  if (!snapshot?.localId || !snapshot?.localPosition) {
    throw new Error(`${label || bridgeId} bot bridge did not expose a usable local snapshot`);
  }
  return snapshot;
}

async function waitForRemoteBridgePeer(page, bridgeId, peerId, label) {
  const peer = await page.waitForFunction(({ id, peerId: expectedPeerId }) => {
    const registry = window.__PEERCOMPUTE_BOT_BRIDGES__;
    const bridge = registry?.[id] || null;
    if (!bridge || typeof bridge.snapshot !== 'function') return false;
    const snapshot = bridge.snapshot() || null;
    const peers = Array.isArray(snapshot?.peers) ? snapshot.peers : [];
    const peer = peers.find((entry) => entry?.id === expectedPeerId && entry?.position);
    if (!peer) return false;
    return {
      id: peer.id,
      position: peer.position,
      hasMedia: Boolean(peer.hasMedia),
      screenSharing: Boolean(peer.screenSharing),
      lastSeenAgeMs: Number.isFinite(peer.lastSeenAgeMs) ? peer.lastSeenAgeMs : null
    };
  }, { id: bridgeId, peerId }, { timeout: demoTimeoutMs });
  const value = await peer.jsonValue();
  if (!asPoint(value?.position)) {
    throw new Error(`${label || bridgeId} did not expose remote peer ${peerId}`);
  }
  return value;
}

async function waitForRemoteBridgePeerMovement(page, bridgeId, peerId, beforePosition, label) {
  const result = await page.waitForFunction(({ id, peerId: expectedPeerId, before, epsilon }) => {
    const registry = window.__PEERCOMPUTE_BOT_BRIDGES__;
    const bridge = registry?.[id] || null;
    if (!bridge || typeof bridge.snapshot !== 'function') return false;
    const snapshot = bridge.snapshot() || null;
    const peers = Array.isArray(snapshot?.peers) ? snapshot.peers : [];
    const peer = peers.find((entry) => entry?.id === expectedPeerId && entry?.position);
    if (!peer) return false;
    const pos = peer.position;
    const dx = Number(pos.x) - Number(before.x);
    const dy = Number(pos.y) - Number(before.y);
    const dz = Number(pos.z) - Number(before.z);
    const distance = Math.hypot(dx, dy, dz);
    if (!Number.isFinite(distance) || distance <= epsilon) return false;
    return {
      id: peer.id,
      position: pos,
      movement: distance,
      hasMedia: Boolean(peer.hasMedia),
      screenSharing: Boolean(peer.screenSharing)
    };
  }, {
    id: bridgeId,
    peerId,
    before: asPoint(beforePosition),
    epsilon: movementEpsilon
  }, { timeout: demoTimeoutMs });
  const value = await result.jsonValue();
  if (!value || !Number.isFinite(Number(value.movement))) {
    throw new Error(`${label || bridgeId} did not observe remote movement for ${peerId}`);
  }
  return value;
}

async function runAndVerifyBridgeInput(page, bridgeId, label) {
  const before = await waitForBotBridgeSnapshot(page, bridgeId, `${label} before input`);
  const simulation = await runSimulationProfile(page, bridgeId, interactionMs);
  const after = summarizeBridgeSnapshot(simulation?.finalSnapshot) || await readBotBridgeSnapshot(page, bridgeId);
  const movement = distanceBetween(before.localPosition, after?.localPosition);
  if (!simulation?.applied || movement <= movementEpsilon) {
    throw new Error(
      `${label} simulated input did not move local display state: ` +
      JSON.stringify({
        applied: Boolean(simulation?.applied),
        driver: simulation?.driver || null,
        tickCount: simulation?.tickCount || null,
        movement,
        before,
        after,
        steps: simulation?.steps || []
      })
    );
  }
  return {
    localId: before.localId,
    before,
    after,
    movement,
    simulation
  };
}

async function verifyCanvasDisplay(page, selectors, label) {
  const result = await page.waitForFunction(({ selectors: candidateSelectors }) => {
    const canvases = candidateSelectors
      .map((selector) => document.querySelector(selector))
      .filter(Boolean);
    for (const canvas of canvases) {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 16 || rect.height < 16 || canvas.width < 16 || canvas.height < 16) continue;
      const base = {
        selector: candidateSelectors.find((selector) => document.querySelector(selector) === canvas) || 'canvas',
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        bufferWidth: canvas.width,
        bufferHeight: canvas.height
      };
      try {
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl && typeof gl.readPixels === 'function') {
          const width = gl.drawingBufferWidth || canvas.width;
          const height = gl.drawingBufferHeight || canvas.height;
          const samples = [
            [0.5, 0.5],
            [0.25, 0.25],
            [0.75, 0.25],
            [0.25, 0.75],
            [0.75, 0.75]
          ];
          const pixel = new Uint8Array(4);
          for (const [sx, sy] of samples) {
            const x = Math.max(0, Math.min(width - 1, Math.floor(width * sx)));
            const y = Math.max(0, Math.min(height - 1, Math.floor(height * sy)));
            gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
            if (pixel[3] > 0 || pixel[0] + pixel[1] + pixel[2] > 8) {
              return { ...base, rendered: true, method: 'webgl-readpixels' };
            }
          }
          continue;
        }
      } catch (_) {
        // Fall through to a visibility-only check when the browser blocks readback.
      }
      try {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;
          const samples = [
            [0.5, 0.5],
            [0.25, 0.25],
            [0.75, 0.25],
            [0.25, 0.75],
            [0.75, 0.75]
          ];
          for (const [sx, sy] of samples) {
            const x = Math.max(0, Math.min(width - 1, Math.floor(width * sx)));
            const y = Math.max(0, Math.min(height - 1, Math.floor(height * sy)));
            const data = ctx.getImageData(x, y, 1, 1).data;
            if (data[3] > 0 || data[0] + data[1] + data[2] > 8) {
              return { ...base, rendered: true, method: '2d-readpixels' };
            }
          }
          continue;
        }
      } catch (_) {
        // Existing WebGL contexts cannot be re-opened as 2D; visible + sized is still useful.
      }
      return { ...base, rendered: true, method: 'visible-sized-canvas' };
    }
    return false;
  }, { selectors }, { timeout: demoTimeoutMs });
  const value = await result.jsonValue();
  if (!value?.rendered) {
    throw new Error(`${label} did not render a visible canvas`);
  }
  return value;
}

async function runCubeChat(context) {
  const errors = [];
  const pageA = await context.newPage();
  const pageB = await context.newPage();
  const logsA = [];
  const logsB = [];
  attachPageErrorLogging(pageA, errors);
  attachPageErrorLogging(pageB, errors);
  pageA.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('[NodeKernel]') || text.includes('[PeerCompute') || text.includes('[cubechat]')) {
      logsA.push(text);
    }
  });
  pageB.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('[NodeKernel]') || text.includes('[PeerCompute') || text.includes('[cubechat]')) {
      logsB.push(text);
    }
  });

  const url = `${baseUrl}/cubechat/?e2e=1`;
  console.log(`→ cubechat: ${url}`);

  await pageA.goto(url, { waitUntil: 'load' });
  await pageB.goto(url, { waitUntil: 'load' });
  await pageA.waitForSelector('#event-log', { state: 'attached', timeout: demoTimeoutMs });
  await pageB.waitForSelector('#event-log', { state: 'attached', timeout: demoTimeoutMs });
  await pageA.evaluate(() => {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
  });
  await pageB.evaluate(() => {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
  });

  try {
    await Promise.all([
      pageA.waitForFunction(() => window.__cubechatTest?.localStreamReady === true, null, { timeout: demoTimeoutMs }),
      pageB.waitForFunction(() => window.__cubechatTest?.localStreamReady === true, null, { timeout: demoTimeoutMs })
    ]);
    await Promise.all([
      pageA.waitForFunction(() => window.__cubechatTest?.bootstrapPeerCount > 0, null, { timeout: demoTimeoutMs }),
      pageB.waitForFunction(() => window.__cubechatTest?.bootstrapPeerCount > 0, null, { timeout: demoTimeoutMs })
    ]);
    await Promise.all([
      pageA.waitForFunction(() => window.__cubechatTest?.networkPeerCount > 0, null, { timeout: demoTimeoutMs }),
      pageB.waitForFunction(() => window.__cubechatTest?.networkPeerCount > 0, null, { timeout: demoTimeoutMs })
    ]);
    await Promise.all([
      pageA.waitForFunction(() => window.__cubechatTest?.peerCount > 0, null, { timeout: demoTimeoutMs }),
      pageB.waitForFunction(() => window.__cubechatTest?.peerCount > 0, null, { timeout: demoTimeoutMs })
    ]);
    await Promise.all([
      pageA.waitForFunction(() => window.__cubechatTest?.peerConnectionCount > 0, null, { timeout: demoTimeoutMs }),
      pageB.waitForFunction(() => window.__cubechatTest?.peerConnectionCount > 0, null, { timeout: demoTimeoutMs })
    ]);
    await Promise.all([
      pageA.waitForFunction(() => window.__cubechatTest?.remoteStreamCount > 0, null, { timeout: demoTimeoutMs }),
      pageB.waitForFunction(() => window.__cubechatTest?.remoteStreamCount > 0, null, { timeout: demoTimeoutMs })
    ]);
    await Promise.all([
      verifyCanvasDisplay(pageA, ['#scene-container canvas', 'canvas'], 'CubeChat pageA scene'),
      verifyCanvasDisplay(pageB, ['#scene-container canvas', 'canvas'], 'CubeChat pageB scene')
    ]);

    const snapshotA = await waitForBotBridgeSnapshot(pageA, 'cubechat', 'CubeChat pageA');
    const snapshotB = await waitForBotBridgeSnapshot(pageB, 'cubechat', 'CubeChat pageB');
    const remoteAOnB = await waitForRemoteBridgePeer(pageB, 'cubechat', snapshotA.localId, 'CubeChat pageB remote pageA');
    const remoteBOnA = await waitForRemoteBridgePeer(pageA, 'cubechat', snapshotB.localId, 'CubeChat pageA remote pageB');
    const [inputA, inputB] = await Promise.all([
      runAndVerifyBridgeInput(pageA, 'cubechat', 'CubeChat pageA'),
      runAndVerifyBridgeInput(pageB, 'cubechat', 'CubeChat pageB')
    ]);
    await Promise.all([
      waitForRemoteBridgePeerMovement(pageB, 'cubechat', inputA.localId, remoteAOnB.position, 'CubeChat pageB display of pageA movement'),
      waitForRemoteBridgePeerMovement(pageA, 'cubechat', inputB.localId, remoteBOnA.position, 'CubeChat pageA display of pageB movement')
    ]);

    await pageA.click('#settings-button');
    await pageA.click('#screen-share-toggle');
    await pageA.waitForFunction(
      () => document.getElementById('screen-share-status')?.textContent?.includes('Screen is being shared'),
      null,
      { timeout: demoTimeoutMs }
    );
    await pageB.waitForFunction(
      () => window.__cubechatTest?.remoteScreenStreamCount > 0,
      null,
      { timeout: demoTimeoutMs }
    );
    await pageB.waitForFunction(
      () => window.__remoteTrackSeen === true,
      null,
      { timeout: demoTimeoutMs }
    );
  } catch (err) {
    const debugA = await pageA.evaluate(() => ({
      localStreamReady: window.__cubechatTest?.localStreamReady ?? null,
      bootstrapPeerCount: window.__cubechatTest?.bootstrapPeerCount ?? null,
      networkPeerCount: window.__cubechatTest?.networkPeerCount ?? null,
      peerCount: window.__cubechatTest?.peerCount ?? null,
      peerConnectionCount: window.__cubechatTest?.peerConnectionCount ?? null,
      remoteStreamCount: window.__cubechatTest?.remoteStreamCount ?? null,
      remoteScreenStreamCount: window.__cubechatTest?.remoteScreenStreamCount ?? null
    })).catch(() => null);
    const debugB = await pageB.evaluate(() => ({
      localStreamReady: window.__cubechatTest?.localStreamReady ?? null,
      bootstrapPeerCount: window.__cubechatTest?.bootstrapPeerCount ?? null,
      networkPeerCount: window.__cubechatTest?.networkPeerCount ?? null,
      peerCount: window.__cubechatTest?.peerCount ?? null,
      peerConnectionCount: window.__cubechatTest?.peerConnectionCount ?? null,
      remoteStreamCount: window.__cubechatTest?.remoteStreamCount ?? null,
      remoteScreenStreamCount: window.__cubechatTest?.remoteScreenStreamCount ?? null
    })).catch(() => null);
    const bridgeA = await readBotBridgeSnapshot(pageA, 'cubechat').catch(() => null);
    const bridgeB = await readBotBridgeSnapshot(pageB, 'cubechat').catch(() => null);
    errors.push(
      `Cubechat P2P wait failed: ${err?.message || err}\n` +
      `pageA: ${JSON.stringify(debugA)}\n` +
      `pageB: ${JSON.stringify(debugB)}\n` +
      `pageA bridge: ${JSON.stringify(bridgeA)}\n` +
      `pageB bridge: ${JSON.stringify(bridgeB)}\n` +
      `pageA logs: ${logsA.slice(-10).join(' | ')}\n` +
      `pageB logs: ${logsB.slice(-10).join(' | ')}`
    );
  } finally {
    await pageA.close();
    await pageB.close();
  }
  return errors;
}

async function runHyperborea(context) {
  const errors = [];
  const pageA = await context.newPage();
  const pageB = await context.newPage();
  const logsA = createConsoleBuffer(pageA);
  const logsB = createConsoleBuffer(pageB);
  attachPageErrorLogging(pageA, errors);
  attachPageErrorLogging(pageB, errors);

  const url = `${baseUrl}/hyperborea/cb.html?e2e=1`;
  console.log(`→ hyperborea: ${url}`);

  try {
    await pageA.goto(url, { waitUntil: 'load' });
    await pageB.goto(url, { waitUntil: 'load' });
    await pageA.waitForSelector('#gameCanvas', { timeout: demoTimeoutMs });
    await pageB.waitForSelector('#gameCanvas', { timeout: demoTimeoutMs });

    await Promise.all([
      waitForConsoleMatch(
        pageA,
        (text) => text.includes('[hyperborea-net] Node started'),
        demoTimeoutMs,
        'node started',
        logsA
      ),
      waitForConsoleMatch(
        pageB,
        (text) => text.includes('[hyperborea-net] Node started'),
        demoTimeoutMs,
        'node started',
        logsB
      )
    ]);
    await Promise.all([
      pageA.waitForFunction(() => window.__hyperboreaTest?.localPeerId, null, { timeout: demoTimeoutMs }),
      pageB.waitForFunction(() => window.__hyperboreaTest?.localPeerId, null, { timeout: demoTimeoutMs })
    ]);
    await Promise.all([
      pageA.waitForFunction(
        () => (window.__hyperboreaTest?.remotePeerCount || 0) > 0 || (window.__hyperboreaTest?.remoteMeshCount || 0) > 0,
        null,
        { timeout: demoTimeoutMs }
      ),
      pageB.waitForFunction(
        () => (window.__hyperboreaTest?.remotePeerCount || 0) > 0 || (window.__hyperboreaTest?.remoteMeshCount || 0) > 0,
        null,
        { timeout: demoTimeoutMs }
      )
    ]);
    await Promise.all([
      verifyCanvasDisplay(pageA, ['#gameCanvas', 'canvas'], 'Hyperborea pageA scene'),
      verifyCanvasDisplay(pageB, ['#gameCanvas', 'canvas'], 'Hyperborea pageB scene')
    ]);
    const snapshotA = await waitForBotBridgeSnapshot(pageA, 'hyperborea', 'Hyperborea pageA');
    const snapshotB = await waitForBotBridgeSnapshot(pageB, 'hyperborea', 'Hyperborea pageB');
    const remoteAOnB = await waitForRemoteBridgePeer(pageB, 'hyperborea', snapshotA.localId, 'Hyperborea pageB remote pageA');
    const remoteBOnA = await waitForRemoteBridgePeer(pageA, 'hyperborea', snapshotB.localId, 'Hyperborea pageA remote pageB');
    const [inputA, inputB] = await Promise.all([
      runAndVerifyBridgeInput(pageA, 'hyperborea', 'Hyperborea pageA'),
      runAndVerifyBridgeInput(pageB, 'hyperborea', 'Hyperborea pageB')
    ]);
    await Promise.all([
      waitForRemoteBridgePeerMovement(pageB, 'hyperborea', inputA.localId, remoteAOnB.position, 'Hyperborea pageB display of pageA movement'),
      waitForRemoteBridgePeerMovement(pageA, 'hyperborea', inputB.localId, remoteBOnA.position, 'Hyperborea pageA display of pageB movement')
    ]);
  } catch (err) {
    const debugA = await pageA.evaluate(() => window.__hyperboreaTest || null).catch(() => null);
    const debugB = await pageB.evaluate(() => window.__hyperboreaTest || null).catch(() => null);
    const bridgeA = await readBotBridgeSnapshot(pageA, 'hyperborea').catch(() => null);
    const bridgeB = await readBotBridgeSnapshot(pageB, 'hyperborea').catch(() => null);
    errors.push(
      `Hyperborea P2P wait failed: ${err?.message || err}\n` +
      `pageA state: ${JSON.stringify(debugA)}\n` +
      `pageB state: ${JSON.stringify(debugB)}\n` +
      `pageA bridge: ${JSON.stringify(bridgeA)}\n` +
      `pageB bridge: ${JSON.stringify(bridgeB)}\n` +
      `pageA logs: ${logsA.slice(-12).join(' | ')}\n` +
      `pageB logs: ${logsB.slice(-12).join(' | ')}`
    );
  } finally {
    await pageA.close();
    await pageB.close();
  }
  return errors;
}

async function runSneakyWoods(context) {
  const errors = [];
  const pageA = await context.newPage();
  const pageB = await context.newPage();
  const logsA = createConsoleBuffer(pageA);
  const logsB = createConsoleBuffer(pageB);
  attachPageErrorLogging(pageA, errors);
  attachPageErrorLogging(pageB, errors);

  const url = `${baseUrl}/sneakywoods/`;
  console.log(`→ sneakywoods: ${url}`);

  try {
    await pageA.goto(url, { waitUntil: 'load' });
    await pageB.goto(url, { waitUntil: 'load' });
    await pageA.waitForSelector('#players', { timeout: demoTimeoutMs });
    await pageB.waitForSelector('#players', { timeout: demoTimeoutMs });

    await Promise.all([
      waitForConsoleMatch(
        pageA,
        (text) => text.includes('[sneakywoods] Connected as'),
        demoTimeoutMs,
        'connected',
        logsA
      ),
      waitForConsoleMatch(
        pageB,
        (text) => text.includes('[sneakywoods] Connected as'),
        demoTimeoutMs,
        'connected',
        logsB
      )
    ]);
    await pageA.waitForFunction(
      () => document.getElementById('players')?.textContent?.includes('Players: 2'),
      null,
      { timeout: demoTimeoutMs }
    );
    await pageB.waitForFunction(
      () => document.getElementById('players')?.textContent?.includes('Players: 2'),
      null,
      { timeout: demoTimeoutMs }
    );
    await Promise.all([
      verifyCanvasDisplay(pageA, ['canvas'], 'SneakyWoods pageA scene'),
      verifyCanvasDisplay(pageB, ['canvas'], 'SneakyWoods pageB scene')
    ]);
    const snapshotA = await waitForBotBridgeSnapshot(pageA, 'sneakywoods', 'SneakyWoods pageA');
    const snapshotB = await waitForBotBridgeSnapshot(pageB, 'sneakywoods', 'SneakyWoods pageB');
    const remoteAOnB = await waitForRemoteBridgePeer(pageB, 'sneakywoods', snapshotA.localId, 'SneakyWoods pageB remote pageA');
    const remoteBOnA = await waitForRemoteBridgePeer(pageA, 'sneakywoods', snapshotB.localId, 'SneakyWoods pageA remote pageB');
    const [inputA, inputB] = await Promise.all([
      runAndVerifyBridgeInput(pageA, 'sneakywoods', 'SneakyWoods pageA'),
      runAndVerifyBridgeInput(pageB, 'sneakywoods', 'SneakyWoods pageB')
    ]);
    await Promise.all([
      waitForRemoteBridgePeerMovement(pageB, 'sneakywoods', inputA.localId, remoteAOnB.position, 'SneakyWoods pageB display of pageA movement'),
      waitForRemoteBridgePeerMovement(pageA, 'sneakywoods', inputB.localId, remoteBOnA.position, 'SneakyWoods pageA display of pageB movement')
    ]);
  } catch (err) {
    const bridgeA = await readBotBridgeSnapshot(pageA, 'sneakywoods').catch(() => null);
    const bridgeB = await readBotBridgeSnapshot(pageB, 'sneakywoods').catch(() => null);
    errors.push(
      `SneakyWoods P2P wait failed: ${err?.message || err}\n` +
      `pageA bridge: ${JSON.stringify(bridgeA)}\n` +
      `pageB bridge: ${JSON.stringify(bridgeB)}\n` +
      `pageA logs: ${logsA.slice(-12).join(' | ')}\n` +
      `pageB logs: ${logsB.slice(-12).join(' | ')}`
    );
  } finally {
    await pageA.close();
    await pageB.close();
  }
  return errors;
}

async function runDaddyGo(context) {
  const errors = [];
  const pageA = await context.newPage();
  const pageB = await context.newPage();
  const logsA = createConsoleBuffer(pageA);
  const logsB = createConsoleBuffer(pageB);
  attachPageErrorLogging(pageA, errors);
  attachPageErrorLogging(pageB, errors);

  const url = `${baseUrl}/daddygo/?e2e=1`;
  console.log(`→ daddygo: ${url}`);

  try {
    await pageA.goto(url, { waitUntil: 'load' });
    await pageB.goto(url, { waitUntil: 'load' });
    await pageA.waitForSelector('#global-score', { timeout: demoTimeoutMs });
    await pageB.waitForSelector('#global-score', { timeout: demoTimeoutMs });

    await Promise.all([
      pageA.waitForFunction(
        () => Boolean(window.__daddygoTest?.localPeerId),
        null,
        { timeout: demoTimeoutMs }
      ),
      pageB.waitForFunction(
        () => Boolean(window.__daddygoTest?.localPeerId),
        null,
        { timeout: demoTimeoutMs }
      )
    ]);
    await Promise.all([
      pageA.waitForFunction(
        () => window.__daddygoTest?.networkPeerCount > 0,
        null,
        { timeout: demoTimeoutMs }
      ),
      pageB.waitForFunction(
        () => window.__daddygoTest?.networkPeerCount > 0,
        null,
        { timeout: demoTimeoutMs }
      )
    ]);
    await Promise.all([
      verifyCanvasDisplay(pageA, ['#canvas3d', 'canvas'], 'DaddyGo pageA scene'),
      verifyCanvasDisplay(pageB, ['#canvas3d', 'canvas'], 'DaddyGo pageB scene')
    ]);
    await pageA.click('#toggleObstacles');
    await pageA.waitForFunction(
      () => document.getElementById('toggleObstacles')?.textContent?.includes('OFF'),
      null,
      { timeout: demoTimeoutMs }
    );
    await pageA.click('#toggleObstacles');
    await pageA.waitForFunction(
      () => document.getElementById('toggleObstacles')?.textContent?.includes('ON'),
      null,
      { timeout: demoTimeoutMs }
    );
    await pageA.evaluate(() => window.__daddygoTest?.setScore?.(11));
    await pageA.waitForFunction(
      () => window.__daddygoTest?.globalScoreText?.includes('11'),
      null,
      { timeout: demoTimeoutMs }
    );
    await pageB.waitForFunction(
      () => window.__daddygoTest?.globalScoreText?.includes('11'),
      null,
      { timeout: demoTimeoutMs }
    );
    await pageB.evaluate(() => window.__daddygoTest?.setScore?.(17));
    await pageB.waitForFunction(
      () => window.__daddygoTest?.globalScoreText?.includes('17'),
      null,
      { timeout: demoTimeoutMs }
    );
    await pageA.waitForFunction(
      () => window.__daddygoTest?.globalScoreText?.includes('17'),
      null,
      { timeout: demoTimeoutMs }
    );
  } catch (err) {
    errors.push(
      `DaddyGo P2P wait failed: ${err?.message || err}\n` +
      `pageA logs: ${logsA.slice(-12).join(' | ')}\n` +
      `pageB logs: ${logsB.slice(-12).join(' | ')}`
    );
  } finally {
    await pageA.close();
    await pageB.close();
  }
  return errors;
}

async function runNetViz(context) {
  const errors = [];
  const sourcePage = await context.newPage();
  const page = await context.newPage();
  const sourceLogs = createConsoleBuffer(sourcePage);
  const logs = createConsoleBuffer(page);
  attachPageErrorLogging(sourcePage, errors);
  attachPageErrorLogging(page, errors);

  const sourceUrl = `${baseUrl}/cubechat/?e2e=1`;
  const url = `${baseUrl}/netviz/?attachSession=latest`;
  console.log(`→ netviz: ${url}`);

  try {
    await sourcePage.goto(sourceUrl, { waitUntil: 'load' });
    await sourcePage.waitForSelector('#event-log', { state: 'attached', timeout: demoTimeoutMs });
    await sourcePage.evaluate(() => {
      const loading = document.getElementById('loading');
      if (loading) loading.style.display = 'none';
    });
    await Promise.all([
      sourcePage.waitForFunction(
        () => window.__cubechatTest?.localStreamReady === true,
        null,
        { timeout: demoTimeoutMs }
      ),
      sourcePage.waitForFunction(
        () => window.__cubechatTest?.bootstrapPeerCount > 0,
        null,
        { timeout: demoTimeoutMs }
      ),
      sourcePage.waitForFunction(
        () => window.__cubechatTest?.networkPeerCount > 0,
        null,
        { timeout: demoTimeoutMs }
      )
    ]);

    await page.goto(url, { waitUntil: 'load' });
    await page.waitForSelector('#netviz-canvas', { timeout: demoTimeoutMs });
    await page.waitForFunction(() => {
      const status = window.__NETVIZ__?.getStatus?.();
      return Array.isArray(status?.attachSessions)
        && status.attachSessions.some((session) => session?.gameId === 'cubechat');
    }, null, { timeout: demoTimeoutMs });
    await page.waitForFunction(() => {
      const status = window.__NETVIZ__?.getStatus?.();
      return status?.roomId === 'global';
    }, null, { timeout: demoTimeoutMs });
    await page.waitForFunction(() => {
      const status = window.__NETVIZ__?.getStatus?.();
      return status?.connectionState === 'connected' && Boolean(status?.localPeerId);
    }, null, { timeout: demoTimeoutMs });
    await page.waitForFunction(() => {
      const status = window.__NETVIZ__?.getStatus?.();
      return Array.isArray(status?.connections) && status.connections.length > 0;
    }, null, { timeout: demoTimeoutMs });
    await page.waitForFunction(() => {
      const status = window.__NETVIZ__?.getStatus?.();
      return Array.isArray(status?.peers)
        && status.peers.some((peer) => !peer?.isRelay && peer?.peerId);
    }, null, { timeout: demoTimeoutMs + 15000 });
    await verifyCanvasDisplay(page, ['#netviz-canvas', 'canvas'], 'NetViz topology scene');
  } catch (err) {
    const sourceDebug = await sourcePage.evaluate(() => ({
      localStreamReady: window.__cubechatTest?.localStreamReady ?? null,
      bootstrapPeerCount: window.__cubechatTest?.bootstrapPeerCount ?? null,
      networkPeerCount: window.__cubechatTest?.networkPeerCount ?? null,
      peerCount: window.__cubechatTest?.peerCount ?? null
    })).catch(() => null);
    const debug = await page.evaluate(() => window.__NETVIZ__?.getStatus?.() || null).catch(() => null);
    errors.push(
      `NetViz attach wait failed: ${err?.message || err}\n` +
      `cubechat: ${JSON.stringify(sourceDebug)}\n` +
      `netviz: ${JSON.stringify(debug)}\n` +
      `cubechat logs: ${sourceLogs.slice(-12).join(' | ')}\n` +
      `netviz logs: ${logs.slice(-12).join(' | ')}`
    );
  } finally {
    await sourcePage.close();
    await page.close();
  }

  return errors;
}

async function main() {
  checkDocsBuild();

  const server = await startServer();
  const relay = startRelay();
  try {
    await waitForFiles(relay.relayConfigPaths, relayConfigTimeoutMs);
    console.log('[runtime-p2p] Relay config ready:', relay.relayConfigDirs.join(', '));

    const browser = await chromium.launch({
      ...(chromiumExecutablePath ? { executablePath: chromiumExecutablePath } : {}),
      headless: true,
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--allow-http-screen-capture',
        '--auto-select-desktop-capture-source=Entire screen'
      ]
    });
    const context = await browser.newContext({
      permissions: ['camera', 'microphone']
    });

    await context.addInitScript(() => {
      window.__remoteTrackSeen = false;
      const OriginalPeerConnection = window.RTCPeerConnection;
      if (OriginalPeerConnection) {
        window.RTCPeerConnection = function (...args) {
          const pc = new OriginalPeerConnection(...args);
          pc.addEventListener('track', () => {
            window.__remoteTrackSeen = true;
          });
          return pc;
        };
        window.RTCPeerConnection.prototype = OriginalPeerConnection.prototype;
        Object.setPrototypeOf(window.RTCPeerConnection, OriginalPeerConnection);
      }
      if (!navigator.mediaDevices) return;
      const getUserMedia = navigator.mediaDevices.getUserMedia?.bind(navigator.mediaDevices);
      if (!getUserMedia) return;
      navigator.mediaDevices.getDisplayMedia = async () => getUserMedia({ video: true, audio: false });
    });

    const failures = [];
    try {
      if (selectedDemoNames.size === 0 || selectedDemoNames.has('cubechat')) {
        const cubechatErrors = await runCubeChat(context);
        if (cubechatErrors.length) failures.push({ demo: 'cubechat', errors: cubechatErrors });
      }

      if (selectedDemoNames.size === 0 || selectedDemoNames.has('hyperborea')) {
        const hyperboreaErrors = await runHyperborea(context);
        if (hyperboreaErrors.length) failures.push({ demo: 'hyperborea', errors: hyperboreaErrors });
      }

      if (selectedDemoNames.size === 0 || selectedDemoNames.has('sneakywoods')) {
        const sneakyErrors = await runSneakyWoods(context);
        if (sneakyErrors.length) failures.push({ demo: 'sneakywoods', errors: sneakyErrors });
      }

      if (selectedDemoNames.size === 0 || selectedDemoNames.has('daddygo')) {
        const daddyErrors = await runDaddyGo(context);
        if (daddyErrors.length) failures.push({ demo: 'daddygo', errors: daddyErrors });
      }

      if (selectedDemoNames.size === 0 || selectedDemoNames.has('netviz')) {
        const netvizErrors = await runNetViz(context);
        if (netvizErrors.length) failures.push({ demo: 'netviz', errors: netvizErrors });
      }
    } finally {
      await context.close();
      await browser.close();
    }

    if (failures.length) {
      const report = failures
        .map((entry) => `${entry.demo}:\n${entry.errors.map((err) => `  - ${err}`).join('\n')}`)
        .join('\n');
      throw new Error(`Runtime P2P failures:\n${report}`);
    }

    console.log('Runtime P2P tests passed.');
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await stopRelay(relay);
    restoreFiles(relay.relayConfigSnapshots);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
