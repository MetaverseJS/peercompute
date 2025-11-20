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

import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { webSockets } from '@libp2p/websockets';
import { noise } from '@libp2p/noise';
import { plaintext } from '@libp2p/plaintext';
import { yamux } from '@libp2p/yamux';
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { identify } from '@libp2p/identify';
import { ping } from '@libp2p/ping';
import { bootstrap } from '@libp2p/bootstrap';
import { peerIdFromString } from '@libp2p/peer-id';

async function startServer() {
  try {
    console.log('Starting PeerCompute Relay Server...');

    const server = await createLibp2p({
      addresses: {
        listen: [
          '/ip4/127.0.0.1/tcp/0/ws'
        ]
      },
      transports: [
        webSockets(),
        tcp()
      ],
      connectionEncrypters: [noise(), plaintext()],
      streamMuxers: [yamux()],
      services: {
        relay: circuitRelayServer({
            reservations: {
                maxReservations: 1000,
                applyDefaultLimit: false
            }
        }),
        identify: identify(),
        ping: ping()
      },
      connectionManager: {
        minConnections: 0
      }
    });

    console.log('Relay Server ID:', server.peerId.toString());
    
    // Get the multiaddrs
    const addrs = server.getMultiaddrs().map(ma => ma.toString());
    console.log('Listening on:');
    addrs.forEach(addr => console.log(addr));

    // Write config to file for tests to pick up
    // We prefer the WebSocket address for browser clients
    const wsAddr = addrs.find(a => a.includes('/ws'));
    if (wsAddr) {
        // console.log('Selected Bootstrap Address:', wsAddr);
        // Output in the format expected by start-relay-and-test.sh (grep)
        console.log(`Relay Address: ${wsAddr}/p2p/${server.peerId.toString()}`);
    } else {
        console.log('No WebSocket address found!');
    }

  } catch (err) {
    console.error('Failed to start relay server:', err);
    process.exit(1);
  }
}

startServer();
