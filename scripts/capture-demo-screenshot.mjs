import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createReadStream, statSync } from 'node:fs';
import { chromium } from 'playwright';
import { ensureDevHttpsCert } from './https.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const docsRoot = path.join(repoRoot, 'docs');
const host = '127.0.0.1';
const port = Number(process.env.DOCS_PORT || 4180);
const baseUrl = `https://${host}:${port}`;

const target = {
  name: 'daddygo',
  path: '/daddygo/',
  outFile: path.join(repoRoot, 'docs', 'assets', 'daddygo.png')
};

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

async function main() {
  const server = await startServer();
  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-features=WebGPU', '--enable-unsafe-webgpu']
  });
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1400, height: 820 } });
  const page = await context.newPage();

  const url = `${baseUrl}${target.path}`;
  console.log(`Capturing ${target.name} from ${url}`);

  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(
    () => Boolean(document.querySelector('canvas') || document.querySelector('#app')),
    null,
    { timeout: 15000 }
  );
  await page.waitForTimeout(3000);

  await page.screenshot({ path: target.outFile, fullPage: true });

  await page.close();
  await context.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));

  console.log(`Saved ${target.outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
