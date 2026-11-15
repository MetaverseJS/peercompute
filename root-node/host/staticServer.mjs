import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm' };

export async function startHostServer({ directory, port, status = () => ({ state: 'starting' }) }) {
  const root = resolve(directory);
  const server = createServer(async (req, res) => {
    // The local bootstrap exposes no browser-control endpoint or private configuration.
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    if (req.headers.host !== `127.0.0.1:${server.address().port}`) { res.writeHead(403).end(); return; }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405).end(); return; }
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      if (url.pathname === '/health') {
        res.setHeader('Content-Type', 'application/json');
        res.end(req.method === 'HEAD' ? undefined : JSON.stringify(status()));
        return;
      }
      const file = resolve(root, `.${decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)}`);
      if (!file.startsWith(root + sep) || !(await stat(file)).isFile()) { res.writeHead(404).end(); return; }
      res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
      res.end(req.method === 'HEAD' ? undefined : await readFile(file));
    } catch { res.writeHead(404).end(); }
  });
  await new Promise((resolveStart, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolveStart);
  });
  return {
    origin: `http://127.0.0.1:${server.address().port}`,
    port: server.address().port,
    stop: () => new Promise((done, reject) => {
      server.close(error => error ? reject(error) : done());
      server.closeAllConnections();
    }),
  };
}
