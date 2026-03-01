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

test('NetworkManager uses relay-scaling topology defaults', () => {
  const manager = new NetworkManager();

  assert.equal(manager.config.connectionRadius, 1);
  assert.equal(manager.config.maxConnections, 4);
  assert.equal(manager.config.targetConnections, 3);
  assert.equal(manager.config.webrtc.dropRelayBootstrapOnDirect, true);
  assert.equal(manager.config.webrtc.relayRetention?.mode, 'logn');
});

test('NetworkManager delivers additional pubsub topics even when scope differs', () => {
  const manager = new NetworkManager({
    gameId: 'game-a',
    roomId: 'room-a',
    topologyId: 'topology-a',
    additionalPubsubTopics: ['peercompute-netviz-sessions']
  });
  assert.equal(manager.allowedTopics.has('peercompute-netviz-sessions'), true);

  const dispatches = [];
  manager.onMessage = (peerId, message) => {
    dispatches.push({ peerId, message });
  };

  let pubsubMessageHandler = null;
  manager.libp2p = {
    addEventListener: () => {},
    services: {
      pubsub: {
        addEventListener: (eventName, handler) => {
          if (eventName === 'message') {
            pubsubMessageHandler = handler;
          }
        }
      }
    }
  };

  manager._wireLibp2pEvents();
  assert.equal(typeof pubsubMessageHandler, 'function');

  const payload = {
    from: 'peer-z',
    gameId: 'other-game',
    roomId: 'other-room',
    topologyId: 'other-topology',
    payload: {
      type: 'netviz-session-upsert',
      session: {
        sessionId: 'session-z',
        roomId: 'other-room',
        topologyId: 'other-topology'
      }
    }
  };
  pubsubMessageHandler({
    detail: {
      topic: 'peercompute-netviz-sessions',
      data: new TextEncoder().encode(JSON.stringify(payload))
    }
  });

  assert.equal(dispatches.length, 1);
  assert.equal(dispatches[0].peerId, 'peer-z');
  assert.equal(dispatches[0].message.type, 'netviz-session-upsert');
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

  assert.equal(dialed[0], `${webrtcAddr.toString()}/p2p/invalid-peer`);
});

test('NetworkManager appends target peerId to relay WebRTC multiaddrs', async () => {
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

  const targetPeerId = '12D3KooWSQZTN9jEtytwpumPbtBQ6s6vDeo96gG8mSknyxKML2JW';
  const relayWebrtcAddr = buildAddr(
    '/ip4/1.2.3.4/tcp/8080/wss/p2p/12D3KooWNfk2P7XVkqESrMeYipBX6VgVWCWHHgTtheJBoJ5Brtj1/p2p-circuit/webrtc'
  );

  await manager._maybeDialPeer(targetPeerId, 'presence', [relayWebrtcAddr]);

  assert.equal(
    dialed[0],
    '/ip4/1.2.3.4/tcp/8080/wss/p2p/12D3KooWNfk2P7XVkqESrMeYipBX6VgVWCWHHgTtheJBoJ5Brtj1/p2p-circuit/webrtc/p2p/12D3KooWSQZTN9jEtytwpumPbtBQ6s6vDeo96gG8mSknyxKML2JW'
  );
});

test('NetworkManager deduplicates relay WebRTC targets after peer suffix normalization', async () => {
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

  const targetPeerId = 'invalid-peer';
  const shortAddr = buildAddr(
    '/ip4/1.2.3.4/tcp/8080/wss/p2p/12D3KooWNfk2P7XVkqESrMeYipBX6VgVWCWHHgTtheJBoJ5Brtj1/p2p-circuit/webrtc'
  );
  const fullAddr = buildAddr(
    '/ip4/1.2.3.4/tcp/8080/wss/p2p/12D3KooWNfk2P7XVkqESrMeYipBX6VgVWCWHHgTtheJBoJ5Brtj1/p2p-circuit/webrtc/p2p/invalid-peer'
  );

  await manager._maybeDialPeer(targetPeerId, 'presence', [shortAddr, fullAddr]);

  assert.deepEqual(
    dialed,
    ['/ip4/1.2.3.4/tcp/8080/wss/p2p/12D3KooWNfk2P7XVkqESrMeYipBX6VgVWCWHHgTtheJBoJ5Brtj1/p2p-circuit/webrtc/p2p/invalid-peer']
  );
});

test('NetworkManager does not redial relay-webrtc when already relayed and no true direct targets exist', async () => {
  const manager = new NetworkManager({ webrtc: { preferDirect: true } });
  manager.bootstrapPeerIds = new Set();
  const dialed = [];
  manager.libp2p = {
    getConnections: () => [{
      remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/ws/p2p/relay/p2p-circuit/webrtc/p2p/peer-a'),
      status: 'open'
    }],
    dial: async (addr) => {
      dialed.push(addr.toString());
      throw new Error('dial failed');
    }
  };

  await manager._maybeDialPeer('peer-a', 'presence', [
    buildAddr('/ip4/1.2.3.4/tcp/8080/ws/p2p/relay/p2p-circuit/webrtc')
  ]);

  assert.equal(dialed.length, 0);
});

test('NetworkManager attempts relay-webrtc upgrade when only plain relay is active', async () => {
  const manager = new NetworkManager({ webrtc: { preferDirect: true } });
  manager.bootstrapPeerIds = new Set();
  const dialed = [];
  manager.libp2p = {
    getConnections: () => [{
      remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/ws/p2p/relay/p2p-circuit/p2p/peer-a'),
      status: 'open'
    }],
    dial: async (addr) => {
      dialed.push(addr.toString());
      throw new Error('dial failed');
    }
  };

  await manager._maybeDialPeer('peer-a', 'presence', [
    buildAddr('/ip4/1.2.3.4/tcp/8080/ws/p2p/relay/p2p-circuit/webrtc')
  ]);

  assert.equal(dialed.length, 1);
  assert.equal(
    dialed[0],
    '/ip4/1.2.3.4/tcp/8080/ws/p2p/relay/p2p-circuit/webrtc/p2p/peer-a'
  );
});

test('NetworkManager prefers remembered direct /webrtc targets after prior direct hint', async () => {
  const manager = new NetworkManager({ webrtc: { preferDirect: true } });
  manager.bootstrapPeerIds = new Set();
  const targetPeerId = 'peer-direct';
  const dialed = [];
  manager.libp2p = {
    getConnections: () => [{
      remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/ws/p2p/relay/p2p-circuit/p2p/peer-direct'),
      status: 'open'
    }],
    dial: async (addr) => {
      dialed.push(addr.toString());
    }
  };

  manager._rememberDialTargets(targetPeerId, [
    buildAddr('/webrtc/p2p/peer-direct')
  ]);

  await manager._maybeDialPeer(targetPeerId, 'presence', []);

  assert.equal(dialed[0], '/webrtc/p2p/peer-direct');
});

test('NetworkManager dial gate respects maxDialPeers for discovery', () => {
  const manager = new NetworkManager({
    maxDialPeers: 1,
    enforceRoomIsolation: false,
    webrtc: { dropRelayBootstrapOnDirect: false }
  });
  manager.bootstrapPeerIds = new Set(['relay-peer']);
  const peerAConnection = {
    remotePeer: { toString: () => 'peer-a' },
    remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/ws/p2p/relay-peer/p2p-circuit/p2p/peer-a'),
    status: 'open'
  };
  manager.libp2p = {
    getConnections: (peerId) => {
      if (!peerId || peerId === 'peer-a') return [peerAConnection];
      return [];
    }
  };

  assert.equal(manager._shouldDialDiscoveredPeer('peer-b'), false);
  assert.equal(manager._shouldDialDiscoveredPeer('relay-peer'), true);
});

test('NetworkManager ignores closed connections for direct/drop decisions', () => {
  const manager = new NetworkManager({
    targetConnections: 1,
    webrtc: { dropRelayBootstrapOnDirect: true, relayRetention: null }
  });
  manager.peerId = 'peer-self';
  manager.bootstrapPeerIds = new Set(['relay-peer']);
  const closedDirect = {
    remotePeer: { toString: () => 'peer-direct-closed' },
    remoteAddr: buildAddr('/webrtc/ip4/1.2.3.4'),
    status: 'closed'
  };
  const openRelayPeer = {
    remotePeer: { toString: () => 'peer-relay-open' },
    remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/wss/p2p/relay-peer/p2p-circuit/p2p/peer-relay-open'),
    status: 'open'
  };
  const openBootstrap = {
    remotePeer: { toString: () => 'relay-peer' },
    remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/wss/p2p/relay-peer'),
    status: 'open'
  };
  manager.libp2p = {
    getConnections: (peerId) => {
      if (peerId === 'relay-peer') return [openBootstrap];
      if (peerId === 'peer-direct-closed') return [closedDirect];
      if (peerId === 'peer-relay-open') return [openRelayPeer];
      return [openBootstrap, closedDirect, openRelayPeer];
    }
  };

  assert.equal(manager._countDialedPeers(), 1);
  assert.equal(manager._hasDirectPeerConnections(), false);
  assert.equal(manager._getConnectionPeers().length, 2);
  assert.equal(manager._shouldKeepRelayBootstrapConnection(), true);
});

test('NetworkManager drops bootstrap relay connections when direct peers exist at target', () => {
  const manager = new NetworkManager({
    targetConnections: 2,
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

test('NetworkManager requests relay assist only once per throttle window', async () => {
  const manager = new NetworkManager({
    webrtc: {
      enableRelayAssist: true,
      relayAssistRequestThrottleMs: 60000
    }
  });
  manager.peerId = 'peer-self';
  const sent = [];
  manager.sendToPeer = async (peerId, payload) => {
    sent.push({ peerId, payload });
  };

  const first = await manager._requestRelayAssist('peer-a', 'no-reservation');
  const second = await manager._requestRelayAssist('peer-a', 'no-reservation');

  assert.equal(first, true);
  assert.equal(second, false);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].peerId, 'peer-a');
  assert.equal(sent[0].payload.type, 'relay-assist-request');
  manager._clearRelayAssistState();
});

test('NetworkManager handles relay-assist-request by reacquiring relay and replying ready', async () => {
  const relayPeerId = '12D3KooWNfk2P7XVkqESrMeYipBX6VgVWCWHHgTtheJBoJ5Brtj1';
  const manager = new NetworkManager({
    bootstrapPeers: [`/dns4/relay.peercompute.test/tcp/8080/wss/p2p/${relayPeerId}`],
    webrtc: { enableRelayAssist: true }
  });
  manager.peerId = 'peer-self';

  let hasRelay = false;
  manager._hasBootstrapRelayConnections = () => hasRelay;
  manager._dialBootstrapPeers = async () => {
    hasRelay = true;
  };
  manager._reserveBootstrapRelayAddrs = async () => {};
  manager._getAnnounceAddrs = () => [
    `/dns4/relay.peercompute.test/tcp/8080/wss/p2p/${relayPeerId}/p2p-circuit/webrtc/p2p/peer-self`
  ];

  const sent = [];
  manager.sendToPeer = async (peerId, payload) => {
    sent.push({ peerId, payload });
  };

  let publishedPresence = false;
  manager._publishPresenceNow = async () => {
    publishedPresence = true;
  };
  let scheduledDrop = false;
  manager._scheduleAutoRelayDrop = () => {
    scheduledDrop = true;
  };

  await manager._handleRelayAssistRequest('peer-a', { reason: 'no-reservation' });

  assert.equal(sent.length, 1);
  assert.equal(sent[0].peerId, 'peer-a');
  assert.equal(sent[0].payload.type, 'relay-assist-ready');
  assert.equal(Array.isArray(sent[0].payload.multiaddrs), true);
  assert.equal(publishedPresence, true);
  assert.equal(scheduledDrop, true);
});

test('NetworkManager handles relay-assist-ready by forcing immediate redial', async () => {
  const manager = new NetworkManager();
  const timeoutId = setTimeout(() => {}, 10000);
  manager.relayAssistState.pendingReadyTimeouts.set('peer-a', timeoutId);

  let dialArgs = null;
  manager._maybeDialPeer = async (...args) => {
    dialArgs = args;
  };

  await manager._handleRelayAssistReady('peer-a', {
    multiaddrs: ['/webrtc/p2p/peer-a']
  });

  assert.equal(manager.relayAssistState.pendingReadyTimeouts.has('peer-a'), false);
  assert.equal(dialArgs[0], 'peer-a');
  assert.equal(dialArgs[1], 'relay-assist-ready');
  assert.deepEqual(dialArgs[3], { force: true });
});

test('NetworkManager requests relay assist on relay-webrtc NO_RESERVATION dial failure', async () => {
  const relayPeerId = '12D3KooWNfk2P7XVkqESrMeYipBX6VgVWCWHHgTtheJBoJ5Brtj1';
  const targetPeerId = '12D3KooWSQZTN9jEtytwpumPbtBQ6s6vDeo96gG8mSknyxKML2JW';
  const manager = new NetworkManager({
    webrtc: {
      preferDirect: true,
      enableRelayAssist: true
    }
  });
  manager.peerId = 'peer-self';
  manager.bootstrapPeerIds = new Set();

  manager.libp2p = {
    getConnections: () => [],
    dial: async () => {
      throw new Error('failed to connect via relay with status NO_RESERVATION');
    }
  };

  const requests = [];
  manager._requestRelayAssist = async (peerId, reason) => {
    requests.push({ peerId, reason });
    return true;
  };

  await manager._maybeDialPeer(targetPeerId, 'presence', [
    buildAddr(`/ip4/1.2.3.4/tcp/8080/wss/p2p/${relayPeerId}/p2p-circuit/webrtc`)
  ], { force: true });

  assert.equal(requests.length, 1);
  assert.equal(requests[0].peerId, targetPeerId);
  assert.equal(requests[0].reason, 'no-reservation:presence');
});

test('NetworkManager prefers dns6 bootstrap address for circuit dials when local IPv6 is available', () => {
  const relayPeerId = '12D3KooWNfk2P7XVkqESrMeYipBX6VgVWCWHHgTtheJBoJ5Brtj1';
  const targetPeerId = '12D3KooWSQZTN9jEtytwpumPbtBQ6s6vDeo96gG8mSknyxKML2JW';
  const manager = new NetworkManager({
    bootstrapPeers: [
      `/dns4/relay.peercompute.test/tcp/8080/wss/p2p/${relayPeerId}`,
      `/dns6/relay.peercompute.test/tcp/8080/wss/p2p/${relayPeerId}`
    ]
  });
  manager.libp2p = {
    getMultiaddrs: () => [buildAddr('/ip6/fd42:40::2/tcp/40997')]
  };

  const circuitAddr = manager._buildCircuitAddr(targetPeerId);
  assert.equal(
    circuitAddr?.toString?.(),
    `/dns6/relay.peercompute.test/tcp/8080/wss/p2p/${relayPeerId}/p2p-circuit/p2p/${targetPeerId}`
  );
});

test('NetworkManager falls back to dns4 bootstrap address for circuit dials when local IPv6 is unavailable', () => {
  const relayPeerId = '12D3KooWNfk2P7XVkqESrMeYipBX6VgVWCWHHgTtheJBoJ5Brtj1';
  const targetPeerId = '12D3KooWSQZTN9jEtytwpumPbtBQ6s6vDeo96gG8mSknyxKML2JW';
  const manager = new NetworkManager({
    bootstrapPeers: [
      `/dns6/relay.peercompute.test/tcp/8080/wss/p2p/${relayPeerId}`,
      `/dns4/relay.peercompute.test/tcp/8080/wss/p2p/${relayPeerId}`
    ]
  });

  const circuitAddr = manager._buildCircuitAddr(targetPeerId);
  assert.equal(
    circuitAddr?.toString?.(),
    `/dns4/relay.peercompute.test/tcp/8080/wss/p2p/${relayPeerId}/p2p-circuit/p2p/${targetPeerId}`
  );
});

test('NetworkManager reports relay-webrtc transport truthfully without marking peers as direct', () => {
  const manager = new NetworkManager({
    webrtc: {
      dropRelayBootstrapOnDirect: true,
      relayRetention: null,
      countRelayWebrtcAsDirectCapable: false
    }
  });
  manager.bootstrapPeerIds = new Set(['relay-peer']);
  manager.peerId = 'peer-self';
  manager.libp2p = {
    getConnections: (peerId) => {
      if (peerId === 'peer-a') {
        return [{
          remotePeer: { toString: () => 'peer-a' },
          remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/wss/p2p/relay-peer/p2p-circuit/webrtc/p2p/peer-a'),
          status: 'open'
        }];
      }
      if (peerId === 'relay-peer') {
        return [{
          remotePeer: { toString: () => 'relay-peer' },
          remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/wss/p2p/relay-peer'),
          status: 'open'
        }];
      }
      return [
        {
          remotePeer: { toString: () => 'relay-peer' },
          remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/wss/p2p/relay-peer'),
          status: 'open'
        },
        {
          remotePeer: { toString: () => 'peer-a' },
          remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/wss/p2p/relay-peer/p2p-circuit/webrtc/p2p/peer-a'),
          status: 'open'
        }
      ];
    }
  };

  const preferred = manager._getPreferredConnectionMeta('peer-a');
  assert.equal(preferred?.via, 'relay-webrtc');
  assert.equal(preferred?.signalingPath, 'relay-scoped');
  assert.equal(preferred?.mediaPath, 'unknown');
  assert.equal(manager._hasDirectPeerConnections(), false);
  assert.equal(manager._shouldKeepRelayBootstrapConnection(), true);
});

test('NetworkManager counts relay-webrtc as direct-capable by default', () => {
  const manager = new NetworkManager({
    targetConnections: 1,
    webrtc: { dropRelayBootstrapOnDirect: true, relayRetention: null }
  });
  manager.bootstrapPeerIds = new Set(['relay-peer']);
  manager.peerId = 'peer-self';
  manager.libp2p = {
    getConnections: (peerId) => {
      if (peerId === 'relay-peer') {
        return [{
          remotePeer: { toString: () => 'relay-peer' },
          remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/wss/p2p/relay-peer'),
          status: 'open'
        }];
      }
      if (peerId === 'peer-a') {
        return [{
          remotePeer: { toString: () => 'peer-a' },
          remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/wss/p2p/relay-peer/p2p-circuit/webrtc/p2p/peer-a'),
          status: 'open'
        }];
      }
      return [
        {
          remotePeer: { toString: () => 'relay-peer' },
          remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/wss/p2p/relay-peer'),
          status: 'open'
        },
        {
          remotePeer: { toString: () => 'peer-a' },
          remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/wss/p2p/relay-peer/p2p-circuit/webrtc/p2p/peer-a'),
          status: 'open'
        }
      ];
    }
  };
  manager.peers.set('peer-a', {
    gameId: 'default-game',
    roomId: 'default-room',
    topologyId: manager.config.topologyId,
    joinedAt: Date.now() - 1000
  });

  assert.equal(manager._hasDirectPeerConnections(), true);
  assert.equal(manager._shouldKeepRelayBootstrapConnection(), false);
});

test('NetworkManager does not block relay drop on unreachable targetConnections in small rooms', () => {
  const manager = new NetworkManager({
    targetConnections: 5,
    webrtc: { dropRelayBootstrapOnDirect: true, relayRetention: null }
  });
  manager.peerId = 'peer-self';
  manager.bootstrapPeerIds = new Set(['relay-peer']);
  manager.peers.set('peer-a', {
    gameId: 'default-game',
    roomId: 'default-room',
    topologyId: manager.config.topologyId,
    joinedAt: Date.now() - 2000
  });
  manager.peers.set('peer-b', {
    gameId: 'default-game',
    roomId: 'default-room',
    topologyId: manager.config.topologyId,
    joinedAt: Date.now() - 1500
  });
  manager.libp2p = {
    getConnections: (peerId) => {
      if (peerId === 'relay-peer') {
        return [{
          remotePeer: { toString: () => 'relay-peer' },
          remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/wss/p2p/relay-peer'),
          status: 'open'
        }];
      }
      if (peerId === 'peer-a') {
        return [{
          remotePeer: { toString: () => 'peer-a' },
          remoteAddr: buildAddr('/webrtc/p2p/peer-a'),
          status: 'open'
        }];
      }
      if (peerId === 'peer-b') {
        return [{
          remotePeer: { toString: () => 'peer-b' },
          remoteAddr: buildAddr('/webrtc/p2p/peer-b'),
          status: 'open'
        }];
      }
      return [
        {
          remotePeer: { toString: () => 'relay-peer' },
          remoteAddr: buildAddr('/ip4/1.2.3.4/tcp/8080/wss/p2p/relay-peer'),
          status: 'open'
        },
        {
          remotePeer: { toString: () => 'peer-a' },
          remoteAddr: buildAddr('/webrtc/p2p/peer-a'),
          status: 'open'
        },
        {
          remotePeer: { toString: () => 'peer-b' },
          remoteAddr: buildAddr('/webrtc/p2p/peer-b'),
          status: 'open'
        }
      ];
    }
  };

  assert.equal(manager._shouldKeepRelayBootstrapConnection(), false);
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
    topologyId: manager.config.topologyId,
    joinedAt: 500
  });
  manager.peers.set('peer-new', {
    gameId: 'default-game',
    roomId: 'default-room',
    topologyId: manager.config.topologyId,
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
    targetConnections: 1,
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
      topologyId: manager.config.topologyId,
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

test('NetworkManager computes transport connection max with bootstrap headroom', () => {
  const manager = new NetworkManager({
    maxConnections: 4,
    bootstrapPeers: [
      '/dns4/example.com/tcp/443/wss/p2p/12D3KooWN8PoXAkYjbzTD3SKJGP97peWDE9jFeqqS3ipJsgwDozs'
    ]
  });

  assert.equal(manager._getTransportMaxConnections(4), 8);
});

test('NetworkManager honors explicit transport max connection override', () => {
  const manager = new NetworkManager({
    maxConnections: 4,
    transportConnectionHeadroom: 10,
    transportMaxConnections: 5
  });

  assert.equal(manager._getTransportMaxConnections(4), 5);
});

test('NetworkManager setConnectionLimits updates connection manager using transport max', () => {
  const manager = new NetworkManager({
    maxConnections: 4,
    transportConnectionHeadroom: 2,
    bootstrapPeers: [
      '/dns4/example.com/tcp/443/wss/p2p/12D3KooWN8PoXAkYjbzTD3SKJGP97peWDE9jFeqqS3ipJsgwDozs'
    ]
  });
  let updatedMax = null;
  manager.libp2p = {
    services: {
      connectionManager: {
        setMaxConnections: (value) => {
          updatedMax = value;
        }
      }
    }
  };

  manager.setConnectionLimits({ targetConnections: 3, maxConnections: 6 });

  assert.equal(manager.config.targetConnections, 3);
  assert.equal(manager.config.maxConnections, 6);
  assert.equal(updatedMax, 9);
});

test('NetworkManager presence payload reports non-bootstrap active peers', () => {
  const manager = new NetworkManager({
    bootstrapPeers: [
      '/dns4/example.com/tcp/443/wss/p2p/12D3KooWN8PoXAkYjbzTD3SKJGP97peWDE9jFeqqS3ipJsgwDozs'
    ]
  });
  manager.peerId = 'peer-self';
  manager.libp2p = {
    getConnections: () => [
      {
        remotePeer: { toString: () => '12D3KooWN8PoXAkYjbzTD3SKJGP97peWDE9jFeqqS3ipJsgwDozs' },
        remoteAddr: buildAddr('/dns4/example.com/tcp/443/wss/p2p/12D3KooWN8PoXAkYjbzTD3SKJGP97peWDE9jFeqqS3ipJsgwDozs'),
        status: 'open'
      },
      {
        remotePeer: { toString: () => 'peer-a' },
        remoteAddr: buildAddr('/ip4/1.2.3.4/udp/9999/webrtc'),
        status: 'open'
      },
      {
        remotePeer: { toString: () => 'peer-b' },
        remoteAddr: buildAddr('/ip4/5.6.7.8/udp/9999/webrtc'),
        status: 'open'
      }
    ]
  };

  const payload = manager._buildPresencePayload();

  assert.equal(payload.activeConnections, 2);
});
