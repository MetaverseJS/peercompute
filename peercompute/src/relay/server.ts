/**
 * libp2p Circuit Relay v2 Server (Legacy Deno Version)
 *
 * Node.js is the supported runtime for the relay. Use src/relay/server.js.
 * 
 * This server acts as a relay to enable browser-to-browser P2P connections.
 * Browsers cannot listen for incoming connections, so they use this relay
 * for NAT traversal and initial peer discovery.
 */

import { createLibp2p } from "npm:libp2p@^3.1.2";
import { tcp } from "npm:@libp2p/tcp@^11.0.9";
import { webSockets } from "npm:@libp2p/websockets@^10.1.2";
import { noise } from "npm:@libp2p/noise@^1.0.1";
import { yamux } from "npm:@libp2p/yamux@^8.0.1";
import { circuitRelayServer } from "npm:@libp2p/circuit-relay-v2@^4.1.2";
import { identify } from "npm:@libp2p/identify@^4.0.9";
import { ping } from "npm:@libp2p/ping";
import { floodsub } from "npm:@libp2p/floodsub@^11.0.10";

const WEBSOCKET_PORT = 9092;
const TCP_PORT = 9093;

console.log('🚀 Starting libp2p Circuit Relay v2 Server (Deno)...');
console.log('================================================');

const node = await createLibp2p({
  addresses: {
    listen: [
      `/ip4/0.0.0.0/tcp/${TCP_PORT}`,           // TCP for Node.js clients
      `/ip4/0.0.0.0/tcp/${WEBSOCKET_PORT}/ws`  // WebSocket for browsers
    ],
    // Announce addresses explicitly
    announce: [
      `/ip4/127.0.0.1/tcp/${TCP_PORT}`,
      `/ip4/127.0.0.1/tcp/${WEBSOCKET_PORT}/ws`
    ]
  },
  transports: [
    tcp(),
    webSockets()
  ],
  connectionEncryption: [
    noise()
  ],
  streamMuxers: [
    yamux()
  ],
  services: {
    identify: identify(),
    ping: ping(),
    pubsub: floodsub(),
    relay: circuitRelayServer({
      reservations: {
        maxReservations: 100,
        reservationTtl: 60 * 60 * 1000,
        applyDefaultLimit: true,
        defaultDurationLimit: 10 * 60 * 1000,
        defaultDataLimit: BigInt(50 * 1024 * 1024)
      },
      advertise: {
        bootDelay: 30 * 1000
      }
    })
  },
  connectionManager: {
    maxConnections: 200,
    minConnections: 0
  }
});

// Log peer ID and addresses
const peerId = node.peerId.toString();

console.log('\n✅ Relay server started successfully!');
console.log('\nPeer ID:', peerId);

console.log('\n📋 Configuration:');
console.log(`  TCP Port:        ${TCP_PORT} (for Node.js clients)`);
console.log(`  WebSocket Port:  ${WEBSOCKET_PORT} (for browsers)`);

console.log('\n🌐 BROWSER BOOTSTRAP ADDRESS (copy this for your config):');
console.log(`  /ip4/127.0.0.1/tcp/${WEBSOCKET_PORT}/ws/p2p/${peerId}`);

console.log('\n🖥️  NODE.JS BOOTSTRAP ADDRESS (for Node.js clients):');
console.log(`  /ip4/127.0.0.1/tcp/${TCP_PORT}/p2p/${peerId}`);

console.log('\n📊 Server metrics:');

// Track connections
node.addEventListener('peer:connect', (evt: any) => {
  const peerId = evt.detail.toString();
  console.log(`[${new Date().toLocaleTimeString()}] ✅ Peer connected: ${peerId.substring(0, 10)}...`);
  logStats();
});

node.addEventListener('peer:disconnect', (evt: any) => {
  const peerId = evt.detail.toString();
  console.log(`[${new Date().toLocaleTimeString()}] ❌ Peer disconnected: ${peerId.substring(0, 10)}...`);
  logStats();
});

function logStats() {
  const connections = node.getConnections();
  const peers = new Set(connections.map(c => c.remotePeer.toString()));
  console.log(`   Active connections: ${connections.length} | Unique peers: ${peers.size}`);
}

// Periodic stats logging
setInterval(() => {
  const connections = node.getConnections();
  const peers = new Set(connections.map(c => c.remotePeer.toString()));
  
  if (connections.length > 0) {
    console.log(`\n[${new Date().toLocaleTimeString()}] 📊 Status:`);
    console.log(`   Active connections: ${connections.length}`);
    console.log(`   Unique peers: ${peers.size}`);
  }
}, 60000);

// Deno specific signal handling
Deno.addSignalListener("SIGINT", async () => {
  console.log('\n\n🛑 Shutting down relay server...');
  await node.stop();
  console.log('✅ Server stopped gracefully');
  Deno.exit(0);
});

Deno.addSignalListener("SIGTERM", async () => {
  console.log('\n\n🛑 Shutting down relay server...');
  await node.stop();
  console.log('✅ Server stopped gracefully');
  Deno.exit(0);
});
