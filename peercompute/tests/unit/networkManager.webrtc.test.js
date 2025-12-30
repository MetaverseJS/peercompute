import test from 'node:test';
import assert from 'node:assert/strict';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';

const buildAddr = (value) => ({
  getComponents: () => [],
  toString: () => value
});

test('NetworkManager normalizes WebRTC config and ice servers', () => {
  const manager = new NetworkManager({
    webrtc: {
      iceServers: ['stun:example.com:3478'],
      preferDirect: false,
      dropRelayOnDirect: true
    }
  });

  assert.equal(manager.config.webrtc.preferDirect, false);
  assert.equal(manager.config.webrtc.dropRelayOnDirect, true);
  assert.deepEqual(manager.config.webrtc.iceServers, [{ urls: 'stun:example.com:3478' }]);
  assert.deepEqual(manager.config.webrtc.rtcConfiguration.iceServers, [{ urls: 'stun:example.com:3478' }]);
});

test('NetworkManager prunes relayed connections when direct is available', async () => {
  const manager = new NetworkManager({ webrtc: { dropRelayOnDirect: true } });
  let relayClosed = false;
  let directClosed = false;
  const relayConn = {
    remoteAddr: buildAddr('/p2p-circuit'),
    status: 'open',
    close: async () => {
      relayClosed = true;
    }
  };
  const directConn = {
    remoteAddr: buildAddr('/webrtc'),
    status: 'open',
    close: async () => {
      directClosed = true;
    }
  };

  manager.libp2p = {
    getConnections: () => [relayConn, directConn]
  };
  manager.bootstrapPeerIds = new Set();

  manager._maybePruneRelayConnections('peer-a');
  assert.equal(relayClosed, true);
  assert.equal(directClosed, false);
});

test('NetworkManager prefers WebRTC addresses when dialing', async () => {
  const manager = new NetworkManager({ webrtc: { preferDirect: true } });
  manager.bootstrapPeerIds = new Set();
  const dialed = [];
  manager.libp2p = {
    getConnections: () => [],
    dial: async (addr) => {
      dialed.push(addr.toString());
      throw new Error('dial failed');
    }
  };

  const relayAddr = buildAddr('/p2p-circuit/ip4/1.1.1.1');
  const webrtcAddr = buildAddr('/webrtc/ip4/2.2.2.2');
  await manager._maybeDialPeer('invalid-peer', 'presence', [relayAddr, webrtcAddr]);

  assert.equal(dialed[0], webrtcAddr.toString());
});
