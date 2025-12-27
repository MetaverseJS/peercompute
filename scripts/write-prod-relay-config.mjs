import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const relayConfigPath = path.join(repoRoot, 'config', 'relay.json');

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const toMultiaddrHostSegment = (host) => {
  if (!host) return '';
  const isIpv6 = host.includes(':');
  const isIpv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
  if (isIpv6) return `/ip6/${host}`;
  if (isIpv4) return `/ip4/${host}`;
  return `/dns4/${host}`;
};

const parseHostInput = (raw) => {
  if (!raw) return { host: '', port: '', protocol: '' };
  const value = String(raw).trim();
  if (!value) return { host: '', port: '', protocol: '' };
  if (value.includes('://')) {
    try {
      const url = new URL(value);
      return {
        host: url.hostname,
        port: url.port || '',
        protocol: url.protocol ? url.protocol.replace(':', '') : ''
      };
    } catch (_) {
      // fall through
    }
  }

  const withoutPath = value.replace(/\/.*$/, '');
  if (withoutPath.startsWith('[')) {
    const match = withoutPath.match(/^\[(.+?)\](?::(\d+))?$/);
    if (match) {
      return { host: match[1], port: match[2] || '', protocol: '' };
    }
  }

  const colonCount = (withoutPath.match(/:/g) || []).length;
  if (colonCount === 1 && withoutPath.includes(':')) {
    const [host, port] = withoutPath.split(':');
    return { host, port: port || '', protocol: '' };
  }

  return { host: withoutPath, port: '', protocol: '' };
};

const normalizeBootstrapPeers = (peers) => {
  if (!Array.isArray(peers)) return [];
  return peers
    .map((peer) => (typeof peer === 'string' ? peer.trim() : ''))
    .filter(Boolean);
};

const resolveRelayConfigUrl = (cfg) => {
  const explicit = typeof cfg.relayConfigUrl === 'string' ? cfg.relayConfigUrl.trim() : '';
  if (explicit) return explicit;

  let relayHost = typeof cfg.relayHost === 'string' ? cfg.relayHost.trim() : '';
  if (!relayHost || relayHost.startsWith('/')) return '';

  let relayPort = cfg.relayPort != null ? String(cfg.relayPort).trim() : '';
  let relayProtocol = typeof cfg.relayProtocol === 'string'
    ? cfg.relayProtocol.trim().toLowerCase()
    : '';

  const parsed = parseHostInput(relayHost);
  if (parsed.host) relayHost = parsed.host;
  if (parsed.port && !relayPort) relayPort = parsed.port;
  if (parsed.protocol && !relayProtocol) relayProtocol = parsed.protocol.toLowerCase();

  relayProtocol = relayProtocol || 'wss';
  if (!relayPort) {
    relayPort = relayProtocol === 'ws' ? '80' : '443';
  }

  const scheme = relayProtocol === 'ws' ? 'http' : 'https';
  const isDefaultPort = (scheme === 'https' && relayPort === '443')
    || (scheme === 'http' && relayPort === '80');
  const portSuffix = relayPort && !isDefaultPort ? `:${relayPort}` : '';
  return `${scheme}://${relayHost}${portSuffix}/relay-config.json`;
};

const resolveBootstrapPeers = (cfg) => {
  const directPeers = normalizeBootstrapPeers(cfg.bootstrapPeers);
  if (directPeers.length) {
    return { peers: directPeers, source: 'bootstrapPeers' };
  }

  let relayHost = typeof cfg.relayHost === 'string' ? cfg.relayHost.trim() : '';
  if (relayHost.startsWith('/')) {
    return { peers: [relayHost], source: 'relayHost' };
  }

  let relayPort = cfg.relayPort != null ? String(cfg.relayPort).trim() : '';
  let relayProtocol = typeof cfg.relayProtocol === 'string'
    ? cfg.relayProtocol.trim().toLowerCase()
    : '';
  const relayPeerId = typeof cfg.relayPeerId === 'string' ? cfg.relayPeerId.trim() : '';

  const parsed = parseHostInput(relayHost);
  if (parsed.host) relayHost = parsed.host;
  if (parsed.port && !relayPort) relayPort = parsed.port;
  if (parsed.protocol && !relayProtocol) relayProtocol = parsed.protocol.toLowerCase();

  relayProtocol = relayProtocol || 'wss';
  if (!relayPort) {
    relayPort = relayProtocol === 'ws' ? '80' : '443';
  }

  if (!relayHost || !relayPeerId) {
    const missing = [];
    if (!relayHost) missing.push('relayHost');
    if (!relayPeerId) missing.push('relayPeerId');
    console.warn(`[relay-config] Missing ${missing.join(', ')}; writing empty bootstrapPeers.`);
    return { peers: [], source: 'missing' };
  }

  const hostSegment = toMultiaddrHostSegment(relayHost);
  if (!hostSegment) {
    console.warn('[relay-config] Invalid relayHost; writing empty bootstrapPeers.');
    return { peers: [], source: 'invalidHost' };
  }
  const protocolSegment = relayProtocol === 'ws' ? 'ws' : 'wss';
  const addr = `${hostSegment}/tcp/${relayPort}/${protocolSegment}/p2p/${relayPeerId}`;
  return { peers: [addr], source: 'derived' };
};

const relayConfigBase = readJson(relayConfigPath);
const { peers } = resolveBootstrapPeers(relayConfigBase);
const relayConfig = { bootstrapPeers: peers };
const relayConfigUrl = resolveRelayConfigUrl(relayConfigBase);
const relayConfigSource = { relayConfigUrl };

const rootPackage = readJson(path.join(repoRoot, 'package.json'));
const workspaces = Array.isArray(rootPackage.workspaces) ? rootPackage.workspaces : [];
const demoRoots = workspaces
  .filter((entry) => typeof entry === 'string' && entry.startsWith('demos/'))
  .map((entry) => path.join(repoRoot, entry));

demoRoots.forEach((demoRoot) => {
  const publicDir = path.join(demoRoot, 'public');
  fs.mkdirSync(publicDir, { recursive: true });
  const filePath = path.join(publicDir, 'relay-config.json');
  fs.writeFileSync(filePath, `${JSON.stringify(relayConfig, null, 2)}\n`, 'utf8');
  const sourcePath = path.join(publicDir, 'relay-config-source.json');
  fs.writeFileSync(sourcePath, `${JSON.stringify(relayConfigSource, null, 2)}\n`, 'utf8');
});

console.log(`[relay-config] Wrote relay-config.json to ${demoRoots.length} demo(s).`);
console.log('[relay-config] Wrote relay-config-source.json with relayConfigUrl.');
