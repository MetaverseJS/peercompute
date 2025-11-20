import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { yamux } from '@libp2p/yamux';
import { noise } from '@libp2p/noise';
import { multiaddr } from '@multiformats/multiaddr';
import { peerIdFromString } from '@libp2p/peer-id';

async function test() {
  try {
    const node = await createLibp2p({
      transports: [tcp()],
      connectionEncryption: [noise()],
      streamMuxers: [yamux()],
    });
    
    await node.start();
    console.log('Node started with peerId:', node.peerId.toString());

    // Test multiaddr creation
    const maStr = '/ip4/127.0.0.1/tcp/8080';
    const ma = multiaddr(maStr);
    console.log('Multiaddr created:', ma);
    console.log('Is multiaddr?', multiaddr.isMultiaddr(ma));
    console.log('Has getComponents?', typeof ma.getComponents === 'function');

    // Test fake multiaddr object
    const fakeMa = {
      toString: () => maStr,
      protoCodes: () => [],
      toOptions: () => {},
      // missing getComponents
    };
    
    try {
        // Simulate what might happen if a plain object is treated as multiaddr
        if (fakeMa.getComponents) {
            fakeMa.getComponents();
        } else {
            console.log('fakeMa does not have getComponents');
        }
    } catch (e) {
        console.log('Error accessing getComponents on fake:', e);
    }

    await node.stop();
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();
