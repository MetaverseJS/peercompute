#!/usr/bin/env node
/**
 * Turnkey LAN / Raspberry Pi Relay & Verification CLI for PeerCompute.
 *
 * Usage:
 *   node scripts/lan-relay.mjs [--port 8080] [--http-port 8081] [--host-group home-lan]
 *                              [--profile lan-first] [--wan-relay /dns4/.../p2p/...]
 *                              [--identity ~/.config/peercompute/lan-relay-identity.json]
 *                              [--config-out ./lan-relay-config.json]
 *   node scripts/lan-relay.mjs --self-test
 */
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createNativeCompanion } from '../peercompute/src/host/native/NativeCompanion.js';
import { NetworkManager } from '../peercompute/src/peercompute/networkManager/NetworkManager.js';
import { THROUGHPUT_TOPOLOGY_PROFILES } from '../peercompute/src/peercompute/networkManager/ThroughputTopologyPolicy.js';

function isPrivateLanIpv4(address) {
  return /^(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(address);
}

function isTailscaleIpv4(address) {
  return /^100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(address);
}

/** Classify local network interfaces for LAN/Tailscale announcement. */
export function detectLanAddresses(interfaces = os.networkInterfaces()) {
  const lanIpv4 = [];
  const tailscaleIpv4 = [];
  const loopbackIpv4 = [];
  const ipv6 = [];
  for (const entries of Object.values(interfaces || {})) {
    for (const entry of entries || []) {
      if (!entry || !entry.address) continue;
      const family = String(entry.family);
      if (family === 'IPv4' || family === '4') {
        if (entry.internal || entry.address.startsWith('127.')) {
          loopbackIpv4.push(entry.address);
        } else if (isTailscaleIpv4(entry.address)) {
          tailscaleIpv4.push(entry.address);
        } else if (isPrivateLanIpv4(entry.address)) {
          lanIpv4.push(entry.address);
        }
      } else if ((family === 'IPv6' || family === '6') && !entry.internal && !entry.address.startsWith('fe80:')) {
        ipv6.push(entry.address);
      }
    }
  }
  return {
    lanIpv4: [...new Set(lanIpv4)],
    tailscaleIpv4: [...new Set(tailscaleIpv4)],
    loopbackIpv4: [...new Set(loopbackIpv4)],
    ipv6: [...new Set(ipv6)]
  };
}

/** Build a ready-to-serve PeerCompute relay-config.json prioritizing LAN relays with optional WAN failover. */
export function buildLanRelayConfig({
  peerId,
  port,
  protocol = 'ws',
  addresses = detectLanAddresses(),
  wanRelays = [],
  hostGroupId = 'home-lan',
  profile = 'lan-first'
} = {}) {
  if (!peerId || !Number.isInteger(port) || port <= 0) {
    throw new TypeError('buildLanRelayConfig requires a valid peerId and port');
  }
  const proto = protocol === 'wss' ? 'wss' : 'ws';
  const resolvedProfile = THROUGHPUT_TOPOLOGY_PROFILES.includes(profile) ? profile : 'lan-first';
  const toAddr = (ip) => `/ip4/${ip}/tcp/${port}/${proto}/p2p/${peerId}`;
  const lanMultiaddrs = (addresses.lanIpv4 || []).map(toAddr);
  const tailscaleMultiaddrs = (addresses.tailscaleIpv4 || []).map(toAddr);
  const loopbackMultiaddrs = (addresses.loopbackIpv4 || ['127.0.0.1']).map(toAddr);
  const normalizedWan = (Array.isArray(wanRelays) ? wanRelays : [])
    .map((addr) => String(addr || '').trim())
    .filter((addr) => addr.startsWith('/') && addr.includes('/p2p/'));

  const bootstrapPeers = [
    ...new Set([
      ...lanMultiaddrs,
      ...tailscaleMultiaddrs,
      ...(lanMultiaddrs.length === 0 && tailscaleMultiaddrs.length === 0 ? loopbackMultiaddrs : []),
      ...normalizedWan
    ])
  ];

  return {
    bootstrapPeers,
    lanMultiaddrs,
    tailscaleMultiaddrs,
    loopbackMultiaddrs,
    pubsubType: 'gossipsub',
    gossipsub: {
      D: 6,
      Dlo: 4,
      Dhi: 12,
      Dout: 1,
      fallbackToFloodsub: true,
      scoreParams: {
        IPColocationFactorWeight: 0,
        behaviourPenaltyWeight: 0
      }
    },
    webrtc: {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      preferDirect: true,
      dropRelayOnDirect: true,
      dropRelayBootstrapOnDirect: true,
      countRelayWebrtcAsDirectCapable: true,
      relayRetention: { mode: 'logn', min: 1, max: 10 }
    },
    hostGroupId: String(hostGroupId || 'home-lan').slice(0, 64),
    throughputTopology: { profile: resolvedProfile }
  };
}

/** Start a LAN NativeCompanion gossipsub relay plus optional CORS-enabled relay-config.json HTTP server. */
export async function startLanRelay({
  listenHost = '0.0.0.0',
  listenPort = 8080,
  httpPort = null,
  identityPath = path.join(os.homedir(), '.config', 'peercompute', 'lan-relay-identity.json'),
  wanRelays = [],
  hostGroupId = 'home-lan',
  profile = 'lan-first',
  maxReservations = 64,
  configOutPath = null
} = {}) {
  await mkdir(path.dirname(identityPath), { recursive: true });
  const companion = createNativeCompanion({
    identityPath,
    listenHost,
    listenPort,
    pubsubType: 'gossipsub',
    maxConnections: Math.max(64, maxReservations * 2),
    relay: {
      enabled: true,
      maxReservations,
      maxCircuitDurationMs: 3_600_000,
      maxCircuitBytes: 64 * 1024 * 1024
    }
  });
  const status = await companion.start();
  const boundAddr = status.listenMultiaddrs[0] || status.localMultiaddrs[0] || '';
  const portMatch = boundAddr.match(/\/tcp\/(\d+)\//);
  const actualPort = portMatch ? Number(portMatch[1]) : listenPort;
  const addresses = detectLanAddresses();
  const relayConfig = buildLanRelayConfig({
    peerId: status.peerId,
    port: actualPort,
    protocol: 'ws',
    addresses,
    wanRelays,
    hostGroupId,
    profile
  });

  if (configOutPath) {
    await writeFile(configOutPath, JSON.stringify(relayConfig, null, 2) + '\n');
  }

  let configServer = null;
  let configUrls = [];
  if (Number.isInteger(httpPort) && httpPort >= 0) {
    const body = JSON.stringify(relayConfig, null, 2) + '\n';
    configServer = http.createServer((req, res) => {
      if (req.url === '/relay-config.json' || req.url === '/') {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store'
        });
        res.end(body);
        return;
      }
      if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: true, ...companion.getStatus() }));
        return;
      }
      res.writeHead(404);
      res.end('Not found');
    });
    await new Promise((resolve, reject) => {
      configServer.once('error', reject);
      configServer.listen(httpPort, listenHost, resolve);
    });
    const actualHttpPort = configServer.address().port;
    const hosts = [...addresses.lanIpv4, ...addresses.tailscaleIpv4, '127.0.0.1'];
    configUrls = [...new Set(hosts)].map((host) => `http://${host}:${actualHttpPort}/relay-config.json`);
  }

  return {
    companion,
    status,
    port: actualPort,
    relayConfig,
    configUrls,
    async stop() {
      if (configServer) {
        await new Promise((resolve) => configServer.close(() => resolve()));
        configServer = null;
      }
      await companion.stop();
    }
  };
}

/**
 * End-to-end single-host LAN relay self-test (no extra devices needed):
 * starts a LAN gossipsub NativeCompanion + HTTP relay-config server, connects
 * two real NetworkManager peers with `profile: 'lan-first'`, and verifies
 * gossipsub presence, multi-relay LAN health, telemetry, and clean teardown.
 */
export async function runLanSelfTest() {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'peercompute-lan-selftest-'));
  const identityPath = path.join(tmpDir, 'identity.json');
  let relay = null;
  let peerA = null;
  let peerB = null;
  try {
    relay = await startLanRelay({
      listenHost: '127.0.0.1',
      listenPort: 0,
      httpPort: 0,
      identityPath,
      hostGroupId: 'lan-self-test',
      profile: 'lan-first'
    });
    const configUrl = relay.configUrls.find((u) => u.includes('127.0.0.1')) || relay.configUrls[0];
    const fetchedConfig = await (await fetch(configUrl)).json();
    const relayAddr = relay.status.localMultiaddrs[0];

    const sharedOpts = {
      gameId: 'lan-selftest',
      roomId: 'subnet-check',
      topologyId: 'lan-selftest',
      topology: 'throughput',
      throughputTopology: { profile: 'lan-first' },
      hostGroupId: 'lan-self-test',
      bootstrapPeers: [relayAddr],
      listenAddresses: [],
      transportManager: { faultTolerance: 'no-fatal' },
      pubsubType: 'gossipsub',
      gossipsub: fetchedConfig.gossipsub,
      allowLocalDial: true,
      presenceIntervalMs: 500,
      enableNetworkTelemetry: true,
      networkTelemetryPublish: true
    };
    const receivedByB = [];
    peerA = new NetworkManager(sharedOpts);
    peerB = new NetworkManager({
      ...sharedOpts,
      onMessage: (from, msg) => receivedByB.push({ from, msg })
    });
    await peerA.initialize();
    await peerB.initialize();
    await peerA.connect();
    await peerB.connect();

    const deadline = Date.now() + 8000;
    while (Date.now() < deadline) {
      if (peerA.peers.has(peerB.peerId) && peerB.peers.has(peerA.peerId)) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const discovered = peerA.peers.has(peerB.peerId) && peerB.peers.has(peerA.peerId);

    const msgDeadline = Date.now() + 4000;
    while (Date.now() < msgDeadline && receivedByB.length === 0) {
      await peerA.sendToPeer(peerB.peerId, { kind: 'lan-selftest-ping', ts: Date.now() });
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const healthA = peerA.getBootstrapRelayHealth()[relayAddr] || null;
    const snapA = peerA.getTelemetrySnapshot();
    const ok = Boolean(
      discovered
      && receivedByB.some((m) => m.msg?.kind === 'lan-selftest-ping')
      && healthA?.ok === true
      && healthA?.isLan === true
      && snapA.hostGroupId === 'lan-self-test'
      && relay.status.pubsubType === 'gossipsub'
    );
    return {
      ok,
      relayPeerId: relay.status.peerId,
      pubsubType: relay.status.pubsubType,
      configUrl,
      discovered,
      directMessagesReceived: receivedByB.length,
      relayHealth: healthA,
      hostGroupId: snapA.hostGroupId
    };
  } finally {
    await peerA?.disconnect().catch(() => {});
    await peerB?.disconnect().catch(() => {});
    await relay?.stop().catch(() => {});
    await rm(tmpDir, { recursive: true, force: true });
  }
}

function parseCliArgs(argv) {
  const out = { wanRelays: [], selfTest: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--self-test') out.selfTest = true;
    else if (arg === '--port') out.listenPort = Number(argv[++i]);
    else if (arg === '--http-port') out.httpPort = Number(argv[++i]);
    else if (arg === '--host') out.listenHost = argv[++i];
    else if (arg === '--identity') out.identityPath = argv[++i];
    else if (arg === '--host-group') out.hostGroupId = argv[++i];
    else if (arg === '--profile') out.profile = argv[++i];
    else if (arg === '--config-out') out.configOutPath = argv[++i];
    else if (arg === '--wan-relay') out.wanRelays.push(argv[++i]);
  }
  return out;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const cli = parseCliArgs(process.argv.slice(2));
  if (cli.selfTest) {
    const result = await runLanSelfTest();
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.ok ? 0 : 1);
  }
  const relay = await startLanRelay({
    listenHost: cli.listenHost ?? '0.0.0.0',
    listenPort: Number.isInteger(cli.listenPort) ? cli.listenPort : 8080,
    httpPort: Number.isInteger(cli.httpPort) ? cli.httpPort : 8081,
    ...(cli.identityPath ? { identityPath: cli.identityPath } : {}),
    wanRelays: cli.wanRelays,
    hostGroupId: cli.hostGroupId ?? 'home-lan',
    profile: cli.profile ?? 'lan-first',
    configOutPath: cli.configOutPath ?? null
  });
  console.log('[PeerCompute LAN Relay] Running (gossipsub, IPColocationFactorWeight=0)');
  console.log('  Peer ID:', relay.status.peerId);
  console.log('  Bootstrap peers:', JSON.stringify(relay.relayConfig.bootstrapPeers, null, 2));
  if (relay.configUrls.length) {
    console.log('  Relay config URLs (pass as ?relayConfigUrl=<url> to NetViz/demos):');
    for (const url of relay.configUrls) console.log(`    ${url}`);
  }
  const shutdown = async () => {
    await relay.stop().catch(() => {});
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
