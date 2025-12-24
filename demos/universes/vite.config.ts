import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

function getLocalIPv4Addresses() {
  const ips = new Set<string>();
  const nets = os.networkInterfaces();

  for (const ifname of Object.keys(nets)) {
    const entries = nets[ifname] || [];
    for (const net of entries) {
      if (!net) continue;
      if (net.family !== 'IPv4') continue;
      if (net.internal) continue;
      if (net.address.startsWith('169.254.')) continue;
      ips.add(net.address);
    }
  }

  return Array.from(ips);
}

function ensureDevHttpsCert() {
  const certDir = path.resolve(__dirname, 'certs');
  const keyPath = path.join(certDir, 'dev-key.pem');
  const certPath = path.join(certDir, 'dev-cert.pem');

  try {
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      return {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
    }
  } catch (e) {}

  fs.mkdirSync(certDir, { recursive: true });

  const ips = getLocalIPv4Addresses();
  const subjectAltName = ['DNS:localhost', 'IP:127.0.0.1', ...ips.map((ip) => `IP:${ip}`)].join(',');
  const cmd = spawnSync(
    'openssl',
    [
      'req',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-sha256',
      '-nodes',
      '-keyout',
      keyPath,
      '-out',
      certPath,
      '-days',
      '365',
      '-subj',
      '/CN=localhost',
      '-addext',
      `subjectAltName=${subjectAltName}`
    ],
    { encoding: 'utf8' }
  );

  if (cmd.status !== 0) {
    throw new Error(
      `Failed to generate dev HTTPS certificate with openssl.\n${cmd.stderr || cmd.stdout || ''}`
    );
  }

  return {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
}

export default defineConfig(({ mode, command }) => {
    const env = loadEnv(mode, '.', '');
    const peercomputeRoot = path.resolve(__dirname, '../../peercompute');
    const docsRoot = path.resolve(__dirname, '../../docs');
    return {
      base: './',
      build: {
        outDir: path.resolve(docsRoot, 'universes'),
        emptyOutDir: true,
      },
      server: {
        port: 5178,
        host: '0.0.0.0',
        https: command === 'serve' ? ensureDevHttpsCert() : undefined,
        fs: {
          allow: [__dirname, peercomputeRoot]
        }
      },
      plugins: [],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@peercompute': path.resolve(peercomputeRoot, 'src/peercompute/index.js')
        }
      }
    };
});
