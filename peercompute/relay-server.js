#!/usr/bin/env node

/**
 * libp2p Circuit Relay v2 Server
 * 
 * This server acts as a relay to enable browser-to-browser P2P connections.
 * Browsers cannot listen for incoming connections, so they use this relay
 * for NAT traversal and initial peer discovery.
 * 
 * Based on: https://github.com/libp2p/js-libp2p/tree/main/packages/transport-circuit-relay-v2
 */

import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { webSockets } from '@libp2p/websockets';
import { noise } from '@libp2p/noise';
import { yamux } from '@libp2p/yamux';
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { identify } from '@libp2p/identify';
import { ping } from '@libp2p/ping';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';

const WEBSOCKET_PORT = 9092;
const TCP_PORT = 9093;

console.log('🚀 Starting libp2p Circuit Relay v2 Server...');
console.log('================================================');

const node = await createLibp2p({
  addresses: {
    listen: [
      `/ip4/0.0.0.0/tcp/${TCP_PORT}`,           // TCP for Node.js clients
      `/ip4/0.0.0.0/tcp/${WEBSOCKET_PORT}/ws`  // WebSocket for browsers
    ],
    // Announce addresses explicitly to avoid stringTuples compatibility issue
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
    pubsub: gossipsub({
      emitSelf: false,
      allowPublishToZeroPeers: true
    }),
    relay: circuitRelayServer({
      // Relay server configuration
      reservations: {
        maxReservations: 100,              // Allow up to 100 simultaneous reservations
        reservationTtl: 60 * 60 * 1000,    // Reservation TTL: 1 hour
        applyDefaultLimit: true,           // Apply bandwidth/time limits
        defaultDurationLimit: 10 * 60 * 1000,  // Max connection duration: 10 minutes
        defaultDataLimit: BigInt(50 * 1024 * 1024)  // Max data transfer: 50MB
      },
      advertise: {
        bootDelay: 30 * 1000  // Wait 30s before advertising
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
console.log(`  Max Reservations: 100`);
console.log(`  Reservation TTL:  1 hour`);
console.log(`  Max Data/Client:  50 MB`);
console.log(`  Max Time/Client:  10 minutes`);

console.log('\n🌐 BROWSER BOOTSTRAP ADDRESS (copy this for your config):');
console.log(`  /ip4/127.0.0.1/tcp/${WEBSOCKET_PORT}/ws/p2p/${peerId}`);

console.log('\n🖥️  NODE.JS BOOTSTRAP ADDRESS (for Node.js clients):');
console.log(`  /ip4/127.0.0.1/tcp/${TCP_PORT}/p2p/${peerId}`);

console.log('\n📍 Listening on:');
console.log(`  - TCP:       0.0.0.0:${TCP_PORT}`);
console.log(`  - WebSocket: 0.0.0.0:${WEBSOCKET_PORT}`);

console.log('\n📊 Server metrics:');

// Track connections
node.addEventListener('peer:connect', (evt) => {
  const peerId = evt.detail.toString();
  console.log(`[${new Date().toLocaleTimeString()}] ✅ Peer connected: ${peerId.substring(0, 10)}...`);
  logStats();
});

node.addEventListener('peer:disconnect', (evt) => {
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
}, 60000); // Log every minute if there are connections

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down relay server...');
  await node.stop();
  console.log('✅ Server stopped gracefully');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\n🛑 Shutting down relay server...');
  await node.stop();
  console.log('✅ Server stopped gracefully');
  process.exit(0);
});

console.log('\n💡 Tip: Press Ctrl+C to stop the server');
console.log('================================================\n');
