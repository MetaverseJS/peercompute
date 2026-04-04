import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const peercomputeRoot = path.resolve(__dirname, '../../peercompute');
const docsRoot = path.resolve(__dirname, '../../docs');
const chaosApiProxyTarget = process.env.VITE_CHAOS_API_PROXY_TARGET || 'http://127.0.0.1:8866';

const chaosApiFallbackPayload = (urlPath = '') => {
  const pathOnly = String(urlPath || '').split('?')[0];
  if (pathOnly.endsWith('/api/events') || pathOnly.endsWith('/events')) {
    return { events: [], degraded: true };
  }
  if (pathOnly.endsWith('/api/topology') || pathOnly.endsWith('/topology')) {
    return { run_id: null, updated_at: null, topology: null, degraded: true };
  }
  return { run_id: null, updated_at: null, degraded: true };
};

const writeChaosApiFallback = (res, req) => {
  if (!res || res.headersSent || res.writableEnded) return;
  const payload = chaosApiFallbackPayload(req?.url || '');
  const body = Buffer.from(JSON.stringify(payload), 'utf-8');
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': String(body.length),
  });
  res.end(body);
};

export default defineConfig(({ command }) => ({
  root: '.',
  base: './',
  server: {
    port: 5182,
    https: command === 'serve' ? ensureDevHttpsCert() : undefined,
    proxy: {
      '/chaos-api': {
        target: chaosApiProxyTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (pathValue) => pathValue.replace(/^\/chaos-api/, ''),
        configure: (proxy) => {
          proxy.on('error', (_err, req, res) => {
            writeChaosApiFallback(res, req);
          });
        },
      }
    },
    fs: {
      allow: [__dirname, peercomputeRoot]
    }
  },
  resolve: {
    alias: {
      '@peercompute': path.resolve(peercomputeRoot, 'src/peercompute/index.js')
    }
  },
  build: {
    outDir: path.resolve(docsRoot, 'netviz'),
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html')
      }
    }
  }
}));
