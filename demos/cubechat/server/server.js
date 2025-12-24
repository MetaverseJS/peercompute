import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { webSockets } from '@libp2p/websockets';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { mplex } from '@libp2p/mplex';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { identify } from '@libp2p/identify';
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { kadDHT } from '@libp2p/kad-dht';

const PORT = process.env.PORT || 9090;

async function main() {
  console.log('Starting Tron Overworld P2P Server...');

  const node = await createLibp2p({
    addresses: {
      listen: [
        `/ip4/0.0.0.0/tcp/${PORT}/ws`,
        `/ip4/0.0.0.0/tcp/${PORT + 1}`
      ]
    },
    transports: [
      tcp(),
      webSockets()
    ],
    connectionEncryption: [noise()],
    streamMuxers: [yamux(), mplex()],
    services: {
      identify: identify(),
      pubsub: gossipsub({
        emitSelf: false,
        allowPublishToZeroPeers: true,
        canRelayMessage: true
      }),
      relay: circuitRelayServer({
        reservations: {
          maxReservations: 100
        }
      }),
      dht: kadDHT({
        clientMode: false
      })
    }
  });

  await node.start();

  console.log('P2P Server started successfully!');
  console.log('Peer ID:', node.peerId.toString());
  console.log('Listening on:');
  node.getMultiaddrs().forEach((addr) => {
    console.log('  -', addr.toString());
  });

  // Subscribe to the game topic to relay messages
  const TOPIC = '/tron-overworld/1.0.0';
  node.services.pubsub.subscribe(TOPIC);
  
  node.services.pubsub.addEventListener('message', (evt) => {
    const peerId = evt.detail.from.toString();
    console.log(`Relaying message from ${peerId}`);
  });

  // Log connections
  node.addEventListener('peer:connect', (evt) => {
    console.log('Peer connected:', evt.detail.toString());
  });

  node.addEventListener('peer:disconnect', (evt) => {
    console.log('Peer disconnected:', evt.detail.toString());
  });

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down server...');
    await node.stop();
    process.exit(0);
  });

  console.log('\nServer is ready to accept connections!');
  console.log('Press Ctrl+C to stop the server.');
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
