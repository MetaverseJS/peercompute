import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createReadStream, existsSync, statSync, unlinkSync } from 'node:fs';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const docsRoot = path.join(repoRoot, 'docs');
const host = process.env.DEMO_HOST || '127.0.0.1';
const port = Number(process.env.DEMO_PORT || 4180);
const baseUrl = `http://${host}:${port}`;
const relayConfigTimeoutMs = Number(process.env.RELAY_CONFIG_TIMEOUT_MS || 10000);
const demoTimeoutMs = Number(process.env.DEMO_TIMEOUT_MS || 30000);

const demos = [
  { name: 'cubechat', path: '/cubechat/' },
  { name: 'hyperborea', path: '/hyperborea/cb.html' },
  { name: 'sneakywoods', path: '/sneakywoods/' },
  { name: 'daddygo', path: '/daddygo/' }
];

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
  const missing = demos.filter((demo) => {
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

function startRelay() {
  const relayConfigDirs = demos
    .map((demo) => path.join(docsRoot, demo.name))
    .filter((dir) => existsSync(dir));
  const relayConfigPaths = relayConfigDirs.map((dir) => path.join(dir, 'relay-config.json'));
  relayConfigPaths.forEach((filePath) => {
    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath);
      } catch (_) {
        // ignore cleanup failures
      }
    }
  });

  const child = spawn('node', [path.join(repoRoot, 'peercompute', 'src', 'relay', 'server.js')], {
    env: {
      ...process.env,
      RELAY_LISTEN_HOST: host,
      RELAY_LISTEN_PORT: '0',
      RELAY_PUBLIC_HOST: host,
      RELAY_CONFIG_DIRS: relayConfigDirs.join(',')
    },
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
    relayConfigPaths,
    relayConfigDirs
  };
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
    errors.push(
      `Cubechat P2P wait failed: ${err?.message || err}\n` +
      `pageA: ${JSON.stringify(debugA)}\n` +
      `pageB: ${JSON.stringify(debugB)}\n` +
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

  const url = `${baseUrl}/hyperborea/cb.html`;
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
    await waitForConsoleMatch(
      pageA,
      (text) => text.includes('[hyperborea-net] Peer connected'),
      demoTimeoutMs,
      'peer connected',
      logsA
    );
  } catch (err) {
    errors.push(
      `Hyperborea P2P wait failed: ${err?.message || err}\n` +
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
  } catch (err) {
    errors.push(
      `SneakyWoods P2P wait failed: ${err?.message || err}\n` +
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

  const url = `${baseUrl}/daddygo/`;
  console.log(`→ daddygo: ${url}`);

  try {
    await pageA.goto(url, { waitUntil: 'load' });
    await pageB.goto(url, { waitUntil: 'load' });
    await pageA.waitForSelector('#global-score', { timeout: demoTimeoutMs });
    await pageB.waitForSelector('#global-score', { timeout: demoTimeoutMs });

    await Promise.all([
      waitForConsoleMatch(
        pageA,
        (text) => text.includes('[NodeKernel] Node started'),
        demoTimeoutMs,
        'node started',
        logsA
      ),
      waitForConsoleMatch(
        pageB,
        (text) => text.includes('[NodeKernel] Node started'),
        demoTimeoutMs,
        'node started',
        logsB
      )
    ]);
    await waitForConsoleMatch(
      pageA,
      (text) => text.includes('[NodeKernel] Peer connected'),
      demoTimeoutMs,
      'peer connected',
      logsA
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

async function main() {
  checkDocsBuild();

  const server = await startServer();
  const relay = startRelay();
  try {
    await waitForFiles(relay.relayConfigPaths, relayConfigTimeoutMs);
    console.log('[runtime-p2p] Relay config ready:', relay.relayConfigDirs.join(', '));

    const browser = await chromium.launch({
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
      const cubechatErrors = await runCubeChat(context);
      if (cubechatErrors.length) failures.push({ demo: 'cubechat', errors: cubechatErrors });

      const hyperboreaErrors = await runHyperborea(context);
      if (hyperboreaErrors.length) failures.push({ demo: 'hyperborea', errors: hyperboreaErrors });

      const sneakyErrors = await runSneakyWoods(context);
      if (sneakyErrors.length) failures.push({ demo: 'sneakywoods', errors: sneakyErrors });

      const daddyErrors = await runDaddyGo(context);
      if (daddyErrors.length) failures.push({ demo: 'daddygo', errors: daddyErrors });
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
    relay.child.kill('SIGTERM');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
