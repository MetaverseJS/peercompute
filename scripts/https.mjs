import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const certDir = path.join(repoRoot, 'certs');
const keyPath = path.join(certDir, 'dev-key.pem');
const certPath = path.join(certDir, 'dev-cert.pem');

function getLocalIPv4Addresses() {
  const ips = new Set();
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

export function ensureDevHttpsCert() {
  try {
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      return {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
    }
  } catch (_) {
    // fall through to regenerate
  }

  fs.mkdirSync(certDir, { recursive: true });

  const ips = getLocalIPv4Addresses();
  const subjectAltName = [
    'DNS:localhost',
    'IP:127.0.0.1',
    ...ips.map((ip) => `IP:${ip}`)
  ].join(',');

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
