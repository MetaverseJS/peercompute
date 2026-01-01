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
      dropRelayOnDirect: true,
      dropRelayBootstrapOnDirect: true
    }
  });

  assert.equal(manager.config.webrtc.preferDirect, false);
  assert.equal(manager.config.webrtc.dropRelayOnDirect, true);
  assert.equal(manager.config.webrtc.dropRelayBootstrapOnDirect, true);
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

test('NetworkManager dial gate respects maxDialPeers for discovery', () => {
  const manager = new NetworkManager({ maxDialPeers: 1, enforceRoomIsolation: false });
  manager.bootstrapPeerIds = new Set(['relay-peer']);
  manager.libp2p = {
    getConnections: () => [
      { remotePeer: { toString: () => 'peer-a' } }
    ]
  };

  assert.equal(manager._shouldDialDiscoveredPeer('peer-b'), false);
  assert.equal(manager._shouldDialDiscoveredPeer('relay-peer'), true);
});

test('NetworkManager drops bootstrap relay connections when direct peers exist', () => {
  const manager = new NetworkManager({
    webrtc: { dropRelayBootstrapOnDirect: true, relayRetention: null }
  });
  manager.bootstrapPeerIds = new Set(['relay-peer']);
  let relayClosed = false;
  const relayConn = {
    remotePeer: { toString: () => 'relay-peer' },
    remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/wss'),
    status: 'open',
    close: async () => {
      relayClosed = true;
    }
  };
  const directConn = {
    remotePeer: { toString: () => 'peer-a' },
    remoteAddr: buildAddr('/webrtc/ip4/1.2.3.4'),
    status: 'open',
    close: async () => {}
  };
  manager.libp2p = {
    getConnections: (peerId) => {
      if (peerId === 'relay-peer') return [relayConn];
      return [relayConn, directConn];
    }
  };

  manager._maybeUpdateBootstrapRelayConnections();
  assert.equal(relayClosed, true);
});

test('NetworkManager keeps relay for longest-connected logN peers', () => {
  const manager = new NetworkManager({
    webrtc: {
      dropRelayBootstrapOnDirect: true,
      relayRetention: { mode: 'logN', min: 1 }
    }
  });
  manager.peerId = 'peer-self';
  manager.joinedAt = 1000;
  manager.bootstrapPeerIds = new Set(['relay-peer']);
  manager.peers.set('peer-old', {
    gameId: 'default-game',
    roomId: 'default-room',
    joinedAt: 500
  });
  manager.peers.set('peer-new', {
    gameId: 'default-game',
    roomId: 'default-room',
    joinedAt: 1500
  });
  manager.libp2p = {
    getConnections: (peerId) => {
      if (peerId === 'relay-peer') return [{ remoteAddr: buildAddr('/p2p-circuit'), status: 'open' }];
      return [{ remoteAddr: buildAddr('/webrtc'), status: 'open' }];
    }
  };

  assert.equal(manager._shouldKeepRelayBootstrapConnection(), true);
});

test('NetworkManager caps relay keepers at sqrt(N)', () => {
  const manager = new NetworkManager({
    webrtc: {
      dropRelayBootstrapOnDirect: true,
      relayRetention: { mode: 'sqrt', min: 1 }
    }
  });
  manager.peerId = 'peer-self';
  manager.joinedAt = 4000;
  manager.bootstrapPeerIds = new Set(['relay-peer']);
  // Nine peers total (including self) so sqrt(N) = 3 keepers allowed.
  const peers = [
    { peerId: 'peer-1', joinedAt: 1000 },
    { peerId: 'peer-2', joinedAt: 1500 },
    { peerId: 'peer-3', joinedAt: 2000 },
    { peerId: 'peer-4', joinedAt: 2500 },
    { peerId: 'peer-5', joinedAt: 3000 },
    { peerId: 'peer-6', joinedAt: 3200 },
    { peerId: 'peer-7', joinedAt: 3300 },
    { peerId: 'peer-8', joinedAt: 3400 }
  ];
  peers.forEach((peer) => {
    manager.peers.set(peer.peerId, {
      gameId: 'default-game',
      roomId: 'default-room',
      joinedAt: peer.joinedAt
    });
  });

  let relayClosed = false;
  const relayConn = {
    remotePeer: { toString: () => 'relay-peer' },
    remoteAddr: { toString: () => '/p2p-circuit/ip4/1.2.3.4/tcp/8080/wss' },
    status: 'open',
    close: async () => {
      relayClosed = true;
    }
  };
  const directConn = {
    remotePeer: { toString: () => 'peer-1' },
    remoteAddr: { toString: () => '/webrtc/ip4/1.2.3.4' },
    status: 'open',
    close: async () => {}
  };

  manager.libp2p = {
    getConnections: (peerId) => {
      if (peerId === 'relay-peer') return [relayConn];
      return [relayConn, directConn];
    }
  };

  // Self joined late, should not be among the earliest sqrt(N)=3 keepers.
  manager._maybeUpdateBootstrapRelayConnections();
  assert.equal(relayClosed, true);
});
