// Polyfill CustomEvent for Node.js < 19
if (typeof CustomEvent === 'undefined') {
  globalThis.CustomEvent = class CustomEvent extends Event {
    constructor(message, data) {
      super(message, data);
      this.detail = data.detail;
    }
  };
}

// Polyfill Promise.withResolvers for Node.js < 22
if (typeof Promise.withResolvers === 'undefined') {
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { webSockets } from '@libp2p/websockets';
import { noise } from '@libp2p/noise';
import { plaintext } from '@libp2p/plaintext';
import { yamux } from '@libp2p/yamux';
import { floodsub } from '@libp2p/floodsub';
import { gossipsub } from '@libp2p/gossipsub';
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { generateKeyPair, privateKeyFromProtobuf, privateKeyToProtobuf, publicKeyToProtobuf } from '@libp2p/crypto/keys';
import { identify } from '@libp2p/identify';
import { ping } from '@libp2p/ping';
import { peerIdFromPrivateKey } from '@libp2p/peer-id';

const relayPublicHost = process.env.RELAY_PUBLIC_HOST || '';
const relayPublicPort = process.env.RELAY_PUBLIC_PORT || '';
const relayPublicProtocolRaw = (process.env.RELAY_PUBLIC_PROTOCOL || '').trim().toLowerCase();
const relayPublicProtocol = (relayPublicProtocolRaw === 'ws' || relayPublicProtocolRaw === 'wss')
  ? relayPublicProtocolRaw
  : '';
const relayListenHost = process.env.RELAY_LISTEN_HOST || (relayPublicHost ? '0.0.0.0' : '127.0.0.1');
const relayListenPort = process.env.RELAY_LISTEN_PORT || '0';
const relaySslCert = process.env.RELAY_SSL_CERT || process.env.SSL_CERT || '';
const relaySslKey = process.env.RELAY_SSL_KEY || process.env.SSL_KEY || '';
const useWss = Boolean(relaySslCert && relaySslKey);
const relayIdentityFile = (process.env.RELAY_IDENTITY_FILE || '').trim();
const relayConfigDirs = (process.env.RELAY_CONFIG_DIRS || '')
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean);
const relayConfigFile = (process.env.RELAY_CONFIG_FILE || '').trim();
const relayTopicPrefixes = (process.env.RELAY_TOPIC_PREFIXES || 'pc.,peercompute-')
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean);
const relayWebrtcConfig = (() => {
  const raw = (process.env.RELAY_WEBRTC_CONFIG || '').trim();
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch (err) {
      console.warn('[Relay] Failed to parse RELAY_WEBRTC_CONFIG:', err?.message || err);
    }
  }
  const iceRaw = (process.env.RELAY_ICE_SERVERS || '').trim();
  if (iceRaw) {
    try {
      const parsed = JSON.parse(iceRaw);
      if (Array.isArray(parsed) || typeof parsed === 'object') {
        return { iceServers: parsed };
      }
    } catch (err) {
      console.warn('[Relay] Failed to parse RELAY_ICE_SERVERS:', err?.message || err);
    }
  }
  return null;
})();
const relayPubsubType = (process.env.RELAY_PUBSUB_TYPE || process.env.RELAY_PUBSUB || '').trim().toLowerCase();
const relayGossipsubConfig = (() => {
  const raw = (process.env.RELAY_GOSSIPSUB_CONFIG || '').trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (err) {
    console.warn('[Relay] Failed to parse RELAY_GOSSIPSUB_CONFIG:', err?.message || err);
  }
  return null;
})();
const relayControlOnlyMode = (() => {
  const raw = (process.env.RELAY_CONTROL_ONLY_MODE || '').trim().toLowerCase();
  return raw === 'true' || raw === '1';
})();

// Phase 5: Peer directory configuration
const relayEnableDirectory = (() => {
  const raw = (process.env.RELAY_ENABLE_DIRECTORY || '').trim().toLowerCase();
  // Default to true if not explicitly disabled
  return raw !== 'false' && raw !== '0';
})();
const relayDirectoryTtlMs = Number(process.env.RELAY_DIRECTORY_TTL_MS) || 5 * 60 * 1000; // 5 min default
const DIRECTORY_CLEANUP_INTERVAL_MS = 60 * 1000; // Cleanup every minute
const DIRECTORY_TOPIC = 'peercompute-directory';

// Phase 5: Peer directory storage
const peerDirectory = new Map(); // peerId -> { multiaddrs, lastSeen, roomId, topologyId, shardId }

const toMultiaddrHostSegments = (host) => {
  const trimmed = String(host || '').trim();
  if (!trimmed) return [];
  const ipVersion = net.isIP(trimmed);
  if (ipVersion === 6) return [`/ip6/${trimmed}`];
  if (ipVersion === 4) return [`/ip4/${trimmed}`];
  // Publish both families so IPv4-only and IPv6-only agents can bootstrap.
  return [`/dns4/${trimmed}`, `/dns6/${trimmed}`];
};

const toListenHostSegment = (host) => {
  const trimmed = (host || '').trim();
  if (!trimmed) return '/ip4/127.0.0.1';
  if (trimmed === 'localhost') return '/ip4/127.0.0.1';
  const ipVersion = net.isIP(trimmed);
  if (ipVersion === 6) return `/ip6/${trimmed}`;
  if (ipVersion === 4) return `/ip4/${trimmed}`;
  return `/dns4/${trimmed}`;
};

const listenHostSegment = toListenHostSegment(relayListenHost);

const loadRelayIdentity = async () => {
  if (!relayIdentityFile) return null;
  const identityPath = path.resolve(relayIdentityFile);
  if (fs.existsSync(identityPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(identityPath, 'utf8'));
      const encodedKey = raw?.privateKey || raw?.privKey || '';
      if (!encodedKey) {
        console.warn(`[Relay] Identity file missing privateKey: ${identityPath}`);
        return null;
      }
      const keyBytes = Buffer.from(encodedKey, 'base64');
      const privateKey = privateKeyFromProtobuf(keyBytes);
      console.log(`[Relay] Loaded identity key from ${identityPath}`);
      return { peerId: peerIdFromPrivateKey(privateKey), privateKey };
    } catch (err) {
      console.warn(`[Relay] Failed to read identity file ${identityPath}:`, err?.message || err);
      return null;
    }
  }

  try {
    const privateKey = await generateKeyPair('Ed25519');
    const peerId = peerIdFromPrivateKey(privateKey);
    const payload = {
      type: privateKey.type,
      peerId: peerId.toString(),
      privateKey: Buffer.from(privateKeyToProtobuf(privateKey)).toString('base64'),
      createdAt: new Date().toISOString()
    };
    fs.mkdirSync(path.dirname(identityPath), { recursive: true });
    fs.writeFileSync(identityPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    try {
      fs.chmodSync(identityPath, 0o600);
    } catch (_) {}
    console.log(`[Relay] Wrote identity key to ${identityPath}`);
    return { peerId, privateKey };
  } catch (err) {
    console.warn('[Relay] Failed to create identity key:', err?.message || err);
    return null;
  }
};

async function startServer() {
  try {
    console.log('Starting PeerCompute Relay & Signaling Server...');
    console.log(`Relay listen host: ${relayListenHost}`);
    console.log(`Relay listen port: ${relayListenPort}`);
    if (relayPublicHost) {
      console.log(`Relay public host: ${relayPublicHost}`);
    }
    if (relayPublicPort) {
      console.log(`Relay public port: ${relayPublicPort}`);
    }
    if (relayPublicProtocol) {
      console.log(`Relay public protocol: ${relayPublicProtocol}`);
    }
    if (useWss) {
      console.log(`Relay using WSS with SSL_CERT=${relaySslCert}`);
    }
    const useGossipsub = relayPubsubType === 'gossipsub';
    console.log(`Relay pubsub: ${useGossipsub ? 'gossipsub' : 'floodsub'}`);

    const relayIdentity = await loadRelayIdentity();
    const relayPeerId = relayIdentity?.peerId || null;
    const relayPrivateKey = relayIdentity?.privateKey || null;
    const wsOptions = useWss
      ? {
          https: {
            cert: fs.readFileSync(path.resolve(relaySslCert)),
            key: fs.readFileSync(path.resolve(relaySslKey))
          }
        }
      : {};

    const gossipsubOptions = {
      emitSelf: false,
      allowPublishToZeroTopicPeers: true,
      canRelayMessage: true,
      ...(relayGossipsubConfig || {})
    };
    if (relayGossipsubConfig?.allowPublishToZeroPeers !== undefined
      && gossipsubOptions.allowPublishToZeroTopicPeers === undefined) {
      gossipsubOptions.allowPublishToZeroTopicPeers = relayGossipsubConfig.allowPublishToZeroPeers;
    }
    const pubsubService = useGossipsub
      ? gossipsub(gossipsubOptions)
      : floodsub();

    const server = await createLibp2p({
      ...(relayPrivateKey ? { privateKey: relayPrivateKey } : {}),
      addresses: {
        listen: [
          `${listenHostSegment}/tcp/${relayListenPort}/${useWss ? 'wss' : 'ws'}`
        ]
      },
      transports: [
        webSockets(wsOptions),
        tcp()
      ],
      connectionEncrypters: [noise(), plaintext()],
      streamMuxers: [yamux()],
      services: {
        pubsub: pubsubService,
        relay: circuitRelayServer({
          reservations: {
            maxReservations: 1000,
            applyDefaultLimit: false,
            reservationTtl: 3600000 // 1 hour
          }
        }),
        identify: identify(),
        ping: ping({
          interval: 10000  // Ping every 10 seconds to keep connections alive
        })
      },
      connectionManager: {
        minConnections: 0,
        maxConnections: 1000,
        inboundConnectionThreshold: Infinity,  // Don't close inbound connections
        maxIncomingPendingConnections: 100
      },
      connectionMonitor: {
        abortConnectionOnPingFailure: false
      },
      start: false
    });
    if (relayPrivateKey && server?.peerId) {
      server.peerId.privateKey = privateKeyToProtobuf(relayPrivateKey);
      server.peerId.publicKey = publicKeyToProtobuf(relayPrivateKey.publicKey);
    }
    await server.start();

    console.log('Relay Server ID:', server.peerId.toString());
    console.log('Circuit Relay v2 enabled - browsers can connect through this relay');

    // Get the multiaddrs
    const addrs = server.getMultiaddrs().map(ma => ma.toString());
    console.log('Listening on:');
    addrs.forEach(addr => console.log(addr));

    // Register keep-alive protocol handler
    const KEEPALIVE_PROTOCOL = '/peercompute/keepalive/1.0.0';
    await server.handle(KEEPALIVE_PROTOCOL, async ({ stream }) => {
      console.log('[Relay] Keep-alive stream opened from peer');
      
      try {
        // Support both async-iterable streams and legacy .source/.sink shapes
        const reader = (typeof stream?.[Symbol.asyncIterator] === 'function')
          ? stream
          : stream?.source;
        const sender = (typeof stream?.send === 'function')
          ? stream.send.bind(stream)
          : stream?.sink
            ? async (chunk) => stream.sink([chunk])
            : null;

        if (!reader || !sender) {
          console.log('[Relay] Keep-alive stream missing reader/sender, closing');
          await stream?.abort?.(new Error('invalid stream shape'));
          return;
        }

        for await (const data of reader) {
          const buffer = (data?.subarray && typeof data.subarray === 'function')
            ? data.subarray()
            : data;
          await sender(buffer);
        }
      } catch (error) {
        console.log('[Relay] Keep-alive stream closed:', error.message);
      }
    });
    console.log('[Relay] Keep-alive protocol registered');

    server.addEventListener('peer:connect', (evt) => {
      const peerId = evt.detail?.remotePeer?.toString?.() || evt.detail?.toString?.();
      if (peerId) {
        console.log(`[Relay] Peer connected: ${peerId}`);
      }
    });

    server.addEventListener('peer:disconnect', (evt) => {
      const peerId = evt.detail?.remotePeer?.toString?.() || evt.detail?.toString?.();
      if (peerId) {
        console.log(`[Relay] Peer disconnected: ${peerId}`);
      }
    });

    // Subscribe to pubsub topics so the relay can forward game traffic.
    // In control-only mode, relay only handles discovery/presence/signaling, not state.
    const discoveryTopic = 'peercompute._peer-discovery._p2p._pubsub';
    const controlTopics = [
      discoveryTopic,
      'peercompute-presence',
      'peercompute-direct'
    ];
    const dataTopics = [
      'peercompute-state',
      'peercompute-state-sync'
    ];
    const relayTopics = relayControlOnlyMode ? controlTopics : [...controlTopics, ...dataTopics];
    const relayTopicSet = new Set(relayTopics);
    relayTopics.forEach((topic) => {
      server.services.pubsub.subscribe(topic);
    });
    if (relayControlOnlyMode) {
      console.log('[Relay] Control-only mode enabled - skipping state topic subscriptions');
    }
    console.log(`Relay subscribed to topics: ${relayTopics.join(', ')}`);

    // Phase 5: Subscribe to directory topic and start cleanup interval
    if (relayEnableDirectory) {
      server.services.pubsub.subscribe(DIRECTORY_TOPIC);
      relayTopicSet.add(DIRECTORY_TOPIC);
      console.log(`[Relay] Peer directory enabled (TTL: ${relayDirectoryTtlMs}ms)`);

      // Periodic cleanup of stale directory entries
      setInterval(() => {
        const now = Date.now();
        let expiredCount = 0;
        for (const [peerId, entry] of peerDirectory.entries()) {
          if (now - entry.lastSeen > relayDirectoryTtlMs) {
            peerDirectory.delete(peerId);
            expiredCount++;
          }
        }
        if (expiredCount > 0) {
          console.log(`[Directory] Expired ${expiredCount} entries (${peerDirectory.size} remaining)`);
        }
      }, DIRECTORY_CLEANUP_INTERVAL_MS);
    }

    const shouldRelayTopic = (topic) => relayTopicPrefixes.some((prefix) => topic.startsWith(prefix));
    const isDataTopic = (topic) => {
      // Data topics include state, state-sync, and shard topics
      if (topic.includes('.state') || topic.includes('-state')) return true;
      if (topic.includes('.shard.') || topic.includes('-shard-')) return true;
      return false;
    };

    server.services.pubsub.addEventListener('subscription-change', (evt) => {
      const subscriptions = evt?.detail?.subscriptions || [];
      subscriptions.forEach((sub) => {
        if (!sub?.subscribe) return;
        const topic = sub?.topic;
        if (!topic || relayTopicSet.has(topic)) return;
        if (!shouldRelayTopic(topic)) return;
        // In control-only mode, skip data topics (state, shard)
        if (relayControlOnlyMode && isDataTopic(topic)) {
          console.log(`[Relay] Skipping data topic (control-only mode): ${topic}`);
          return;
        }
        relayTopicSet.add(topic);
        server.services.pubsub.subscribe(topic);
        console.log(`[Relay] Auto-subscribed to topic: ${topic}`);
      });
    });
    
    // Log peer discovery events
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    // Phase 5: Directory query handler
    const handleDirectoryQuery = async (query, requesterId) => {
      const entry = peerDirectory.get(query.targetPeerId);
      const response = {
        type: 'directory-response',
        requestId: query.requestId,
        targetPeerId: query.targetPeerId,
        found: Boolean(entry),
        multiaddrs: entry?.multiaddrs || [],
        lastSeen: entry?.lastSeen || null,
        metadata: entry ? {
          roomId: entry.roomId,
          topologyId: entry.topologyId,
          shardId: entry.shardId
        } : null
      };
      const payload = encoder.encode(JSON.stringify(response));
      try {
        await server.services.pubsub.publish(DIRECTORY_TOPIC, payload);
        console.log(`[Directory] Responded to query for ${query.targetPeerId} from ${requesterId} (found: ${response.found})`);
      } catch (err) {
        console.warn('[Directory] Failed to respond:', err?.message || err);
      }
    };

    server.services.pubsub.addEventListener('message', (evt) => {
      const { topic, from, data } = evt.detail;
      if (topic === discoveryTopic) {
        console.log(`[Discovery] Peer announcement from ${from.toString()}`);
        return;
      }

      // Phase 5: Update directory from presence messages
      if (relayEnableDirectory && (topic === 'peercompute-presence' || topic.includes('.presence'))) {
        try {
          const parsed = JSON.parse(decoder.decode(data));
          if (parsed?.from && Array.isArray(parsed?.multiaddrs)) {
            peerDirectory.set(parsed.from, {
              multiaddrs: parsed.multiaddrs,
              lastSeen: Date.now(),
              roomId: parsed.roomId,
              topologyId: parsed.topologyId,
              shardId: parsed.shardId
            });
          }
        } catch (_) {}
      }

      // Phase 5: Handle directory queries
      if (relayEnableDirectory && topic === DIRECTORY_TOPIC) {
        try {
          const query = JSON.parse(decoder.decode(data));
          if (query.type === 'directory-query' && query.targetPeerId) {
            handleDirectoryQuery(query, from.toString());
          } else if (query.type === 'directory-register' && query.from) {
            // Explicit registration
            peerDirectory.set(query.from, {
              multiaddrs: query.multiaddrs || [],
              lastSeen: Date.now(),
              roomId: query.roomId,
              topologyId: query.topologyId,
              shardId: query.shardId
            });
            console.log(`[Directory] Registered peer: ${query.from}`);
          }
        } catch (_) {}
        return;
      }

      if (topic === 'peercompute-presence' || topic === 'peercompute-state' || topic === 'peercompute-state-sync') {
        let summary = 'message';
        try {
          const parsed = JSON.parse(decoder.decode(data));
          summary = parsed?.payload?.type || parsed?.type || summary;
        } catch (_) {}
        console.log(`[Relay] Pubsub ${topic} ${summary} from ${from.toString()}`);
      }
    });

    // Write config to file for demos/tests to pick up
    // We prefer the WebSocket address for browser clients
    const wsAddr = addrs.find(a => a.includes('/wss')) || addrs.find(a => a.includes('/ws'));
    if (wsAddr) {
        const relayAddr = wsAddr.includes('/p2p/')
          ? wsAddr
          : `${wsAddr}/p2p/${server.peerId.toString()}`;
        const hostSegments = relayPublicHost ? toMultiaddrHostSegments(relayPublicHost) : [];
        let announceAddr = relayAddr;
        if (relayPublicPort) {
          announceAddr = announceAddr.replace(/\/tcp\/\d+/, `/tcp/${relayPublicPort}`);
        }
        const publicProtocol = relayPublicProtocol || (useWss ? 'wss' : 'ws');
        if (publicProtocol) {
          announceAddr = announceAddr.replace(/\/wss?/, `/${publicProtocol}`);
        }
        announceAddr = announceAddr.replace(/\/tls(\/wss?)/, '$1');
        const announceAddrs = (hostSegments.length > 0 ? hostSegments : [''])
          .map((hostSegment) => {
            if (!hostSegment) return announceAddr;
            return announceAddr
              .replace(/\/ip4\/[^/]+/, hostSegment)
              .replace(/\/ip6\/[^/]+/, hostSegment)
              .replace(/\/dns4\/[^/]+/, hostSegment)
              .replace(/\/dns6\/[^/]+/, hostSegment)
              .replace(/\/dns\/[^/]+/, hostSegment);
          })
          .filter(Boolean);
        const orderedAddrs = [];
        const seenAddrs = new Set();
        for (const value of announceAddrs) {
          if (seenAddrs.has(value)) continue;
          seenAddrs.add(value);
          orderedAddrs.push(value);
        }
        const primaryAnnounceAddr = orderedAddrs[0] || announceAddr;
        // Output in the format expected by start-relay-and-test.sh (grep)
        console.log(`Relay Address: ${primaryAnnounceAddr}`);
        if (orderedAddrs.length > 1) {
          console.log(`[Relay] Additional relay addresses: ${orderedAddrs.slice(1).join(', ')}`);
        }
        const relayConfigPayload = {
          bootstrapPeers: orderedAddrs.length > 0 ? orderedAddrs : [primaryAnnounceAddr],
          pubsubType: useGossipsub ? 'gossipsub' : 'floodsub'
        };
        if (relayWebrtcConfig) {
          relayConfigPayload.webrtc = relayWebrtcConfig;
        }
        if (relayGossipsubConfig) {
          relayConfigPayload.gossipsub = relayGossipsubConfig;
        }
        const relayConfig = JSON.stringify(relayConfigPayload, null, 2);
        const writeConfig = (filePath) => {
          if (!filePath) return;
          try {
            const dir = path.dirname(filePath);
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(filePath, `${relayConfig}\n`, 'utf8');
            console.log(`[Relay] Wrote relay-config.json -> ${filePath}`);
          } catch (err) {
            console.warn(`[Relay] Failed to write relay-config.json to ${filePath}:`, err?.message || err);
          }
        };
        if (relayConfigFile) {
          writeConfig(path.resolve(relayConfigFile));
        }
        if (relayConfigDirs.length) {
          relayConfigDirs.forEach((dirPath) => {
            const filePath = path.resolve(dirPath, 'relay-config.json');
            writeConfig(filePath);
          });
        }
    } else {
        console.log('No WebSocket address found!');
    }

  } catch (err) {
    console.error('Failed to start relay server:', err);
    process.exit(1);
  }
}

startServer();
