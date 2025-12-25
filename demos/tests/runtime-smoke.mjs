import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { chromium } from 'playwright';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const docsRoot = path.join(repoRoot, 'docs');
const port = Number(process.env.DOCS_PORT || 4179);
const host = process.env.DOCS_HOST || '127.0.0.1';
const baseUrl = `https://${host}:${port}`;
const defaultWaitMs = Number(process.env.DEMO_WAIT_MS || 6000);

const demos = [
  { name: 'hyperborea', path: '/hyperborea/cb.html' },
  { name: 'cubechat', path: '/cubechat/' },
  { name: 'sneakywoods', path: '/sneakywoods/' },
  { name: 'daddygo', path: '/daddygo/' },
  { name: 'planetgen', path: '/planetgen/', waitMs: 9000 },
  { name: 'universes', path: '/universes/', waitMs: 9000 },
  { name: 'webgpuphys', path: '/webgpuphys/demos/toychest.html', waitMs: 9000 }
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
  /WebSocket connection to .* failed/i,
  /WebGPU device lost/i,
  /Device was destroyed/i,
  /Failed to load resource: the server responded with a status of 404/i
];

const ignored404Urls = [
  /\/favicon\.ico$/i,
  /\/manifest\.webmanifest$/i
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
  const creds = ensureDevHttpsCert();
  const server = https.createServer({ key: creds.key, cert: creds.cert }, (req, res) => {
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

async function runDemo(context, demo) {
  const errors = [];
  const page = await context.newPage();
  const missing = new Set();

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
    missing.add(url);
  });

  const url = `${baseUrl}${demo.path}`;
  console.log(`→ ${demo.name}: ${url}`);

  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(
    () => Boolean(document.querySelector('canvas') || document.querySelector('#app')),
    null,
    { timeout: 15000 }
  );
  await page.waitForTimeout(demo.waitMs || defaultWaitMs);

  if (missing.size) {
    errors.push(`[404] ${Array.from(missing).join(', ')}`);
  }

  await page.close();
  return errors;
}

async function main() {
  checkDocsBuild();

  const server = await startServer();
  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-features=WebGPU', '--enable-unsafe-webgpu']
  });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });

  const failures = [];
  try {
    for (const demo of demos) {
      const errors = await runDemo(context, demo);
      if (errors.length) {
        failures.push({ demo: demo.name, errors });
      }
    }
  } finally {
    await context.close();
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  if (failures.length) {
    const report = failures
      .map((entry) => `${entry.demo}:\n${entry.errors.map((err) => `  - ${err}`).join('\n')}`)
      .join('\n');
    throw new Error(`Runtime smoke failures:\n${report}`);
  }

  console.log('Runtime smoke tests passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
