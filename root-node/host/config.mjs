import { homedir } from 'node:os';
import { resolve, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const fields = new Set(['dataDir', 'port', 'chromePath', 'chromeArgs', 'bootstrapPeers', 'connectNetwork', 'requireHardwareGpu', 'startupTimeoutMs', 'watchdogIntervalMs', 'watchdogTimeoutMs', 'maxBrowserRestarts', 'companion']);

export function normalizeHostConfig(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Host config must be an object');
  for (const key of Object.keys(input)) if (!fields.has(key)) throw new Error(`Unknown host option: ${key}`);
  const dataDir = resolve(String(input.dataDir || join(homedir(), '.local/share/peercompute/root')).replace(/^~(?=\/)/, homedir()));
  if (dataDir === resolve(repo) || dataDir.startsWith(resolve(repo) + sep)) throw new Error('Host profiles and identity files must be outside the repository');
  const integer = (name, fallback, min, max) => {
    const value = input[name] ?? fallback;
    if (!Number.isInteger(value) || value < min || value > max) throw new Error(`Invalid ${name}`);
    return value;
  };
  for (const key of ['chromeArgs', 'bootstrapPeers']) {
    if (input[key] !== undefined && (!Array.isArray(input[key]) || input[key].some(value => typeof value !== 'string'))) throw new Error(`${key} must contain strings`);
  }
  for (const key of ['connectNetwork', 'requireHardwareGpu']) {
    if (input[key] !== undefined && typeof input[key] !== 'boolean') throw new Error(`${key} must be boolean`);
  }
  if (input.companion !== undefined && (!input.companion || typeof input.companion !== 'object' || Array.isArray(input.companion))) throw new Error('Invalid companion config');
  const companionFields = new Set(['enabled', 'listenHost', 'listenPort', 'connectHost', 'announce', 'tls', 'relay', 'maxConnections']);
  for (const key of Object.keys(input.companion || {})) if (!companionFields.has(key)) throw new Error(`Unknown companion option: ${key}`);
  if (input.companion?.enabled !== undefined && typeof input.companion.enabled !== 'boolean') throw new Error('companion.enabled must be boolean');
  if (input.companion?.connectHost !== undefined && !/^[a-z0-9.-]+$/i.test(input.companion.connectHost)) throw new Error('companion.connectHost must be a DNS hostname');
  if (input.companion?.tls && (!input.companion.tls.certPath || !input.companion.tls.keyPath)) throw new Error('companion.tls needs certPath and keyPath');
  return {
    dataDir, port: integer('port', 5199, 0, 65535),
    chromePath: input.chromePath || process.env.CHROME_PATH || '/usr/bin/google-chrome',
    chromeArgs: input.chromeArgs || ['--enable-gpu', '--enable-unsafe-webgpu'],
    bootstrapPeers: input.bootstrapPeers || [],
    connectNetwork: input.connectNetwork ?? true,
    requireHardwareGpu: input.requireHardwareGpu ?? false,
    startupTimeoutMs: integer('startupTimeoutMs', 90000, 1000, 300000),
    watchdogIntervalMs: integer('watchdogIntervalMs', 15000, 100, 300000),
    watchdogTimeoutMs: integer('watchdogTimeoutMs', 10000, 100, 120000),
    maxBrowserRestarts: integer('maxBrowserRestarts', 3, 0, 20),
    companion: { enabled: true, ...input.companion },
  };
}

export function companionBootstrapAddresses(companionStatus, config) {
  if (!config.tls) return companionStatus.localMultiaddrs;
  if (config.connectHost) return companionStatus.localMultiaddrs.map(address => address.replace(/^\/ip[46]\/[^/]+/, `/dns4/${config.connectHost}`));
  const announced = config.announce || [];
  if (announced.length) return announced.map(address => /\/p2p\/[^/]+$/.test(address) ? address : `${address}/p2p/${companionStatus.peerId}`);
  // An IP certificate is valid here too; no TLS-validation bypass is enabled.
  return companionStatus.localMultiaddrs;
}
