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
import path from 'node:path';
import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { webSockets } from '@libp2p/websockets';
import { noise } from '@libp2p/noise';
import { plaintext } from '@libp2p/plaintext';
import { yamux } from '@libp2p/yamux';
import { floodsub } from '@libp2p/floodsub';
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { identify } from '@libp2p/identify';
import { ping } from '@libp2p/ping';

const relayPublicHost = process.env.RELAY_PUBLIC_HOST || '';
const relayListenHost = process.env.RELAY_LISTEN_HOST || (relayPublicHost ? '0.0.0.0' : '127.0.0.1');
const relaySslCert = process.env.RELAY_SSL_CERT || process.env.SSL_CERT || '';
const relaySslKey = process.env.RELAY_SSL_KEY || process.env.SSL_KEY || '';
const useWss = Boolean(relaySslCert && relaySslKey);

async function startServer() {
  try {
    console.log('Starting PeerCompute Relay & Signaling Server...');
    console.log(`Relay listen host: ${relayListenHost}`);
    if (relayPublicHost) {
      console.log(`Relay public host: ${relayPublicHost}`);
    }
    if (useWss) {
      console.log(`Relay using WSS with SSL_CERT=${relaySslCert}`);
    }

    const wsOptions = useWss
      ? {
          https: {
            cert: fs.readFileSync(path.resolve(relaySslCert)),
            key: fs.readFileSync(path.resolve(relaySslKey))
          }
        }
      : {};

    const server = await createLibp2p({
      addresses: {
        listen: [
          `/ip4/${relayListenHost}/tcp/0/${useWss ? 'wss' : 'ws'}`
        ]
      },
      transports: [
        webSockets(wsOptions),
        tcp()
      ],
      connectionEncrypters: [noise(), plaintext()],
      streamMuxers: [yamux()],
      services: {
        pubsub: floodsub(),
        relay: circuitRelayServer({
            reservations: {
                maxReservations: 1000,
                applyDefaultLimit: false
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
      }
    });

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
    const discoveryTopic = 'peercompute._peer-discovery._p2p._pubsub';
    const relayTopics = [
      discoveryTopic,
      'peercompute-presence',
      'peercompute-direct',
      'peercompute-state',
      'peercompute-state-sync'
    ];
    relayTopics.forEach((topic) => {
      server.services.pubsub.subscribe(topic);
    });
    console.log(`Relay subscribed to topics: ${relayTopics.join(', ')}`);
    
    // Log peer discovery events
    const decoder = new TextDecoder();
    server.services.pubsub.addEventListener('message', (evt) => {
      const { topic, from, data } = evt.detail;
      if (topic === discoveryTopic) {
        console.log(`[Discovery] Peer announcement from ${from.toString()}`);
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

    // Write config to file for tests to pick up
    // We prefer the WebSocket address for browser clients
    const wsAddr = addrs.find(a => a.includes('/wss')) || addrs.find(a => a.includes('/ws'));
    if (wsAddr) {
        const relayAddr = wsAddr.includes('/p2p/')
          ? wsAddr
          : `${wsAddr}/p2p/${server.peerId.toString()}`;
        const announceAddr = relayPublicHost
          ? relayAddr.replace(/\/ip4\/[^/]+/, `/ip4/${relayPublicHost}`)
          : relayAddr;
        // Output in the format expected by start-relay-and-test.sh (grep)
        console.log(`Relay Address: ${announceAddr}`);
    } else {
        console.log('No WebSocket address found!');
    }

  } catch (err) {
    console.error('Failed to start relay server:', err);
    process.exit(1);
  }
}

startServer();
