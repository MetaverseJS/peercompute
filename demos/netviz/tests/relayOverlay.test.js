import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPubsubEdges,
  buildRelayState,
  isActiveRelayTransportNeighbor
} from '../src/relayOverlay.js';

test('isActiveRelayTransportNeighbor only accepts active direct relay transport neighbors', () => {
  const relayIds = new Set(['relay-peer']);

  assert.equal(isActiveRelayTransportNeighbor({
    peerId: 'relay-peer',
    connectedAt: Date.now(),
    via: 'direct',
    signalingPath: 'direct'
  }, relayIds), true);

  assert.equal(isActiveRelayTransportNeighbor({
    peerId: 'relay-peer',
    connectedAt: Date.now(),
    via: 'presence',
    signalingPath: 'relay-scoped'
  }, relayIds), false);

  assert.equal(isActiveRelayTransportNeighbor({
    peerId: 'relay-peer',
    via: 'direct',
    signalingPath: 'direct'
  }, relayIds), false);

  assert.equal(isActiveRelayTransportNeighbor({
    peerId: 'peer-a',
    connectedAt: Date.now(),
    via: 'direct',
    signalingPath: 'direct'
  }, relayIds), false);
});

test('buildRelayState only maps peers with active direct relay transport evidence', () => {
  const relayIds = new Set(['relay-peer']);
  const entries = [
    {
      peerId: 'peer-a',
      peers: [
        {
          peerId: 'relay-peer',
          connectedAt: 1000,
          via: 'direct',
          signalingPath: 'direct',
          mediaPath: 'direct'
        }
      ]
    },
    {
      peerId: 'peer-b',
      peers: [
        {
          peerId: 'relay-peer',
          connectedAt: 1000,
          via: 'presence',
          signalingPath: 'relay-scoped',
          mediaPath: 'unknown'
        }
      ]
    },
    {
      peerId: 'peer-c',
      peers: [
        {
          peerId: 'relay-peer',
          via: 'direct',
          signalingPath: 'direct',
          mediaPath: 'direct'
        }
      ]
    }
  ];

  const state = buildRelayState(entries, relayIds);

  assert.deepEqual(state.activeRelayIds, ['relay-peer']);
  assert.equal(state.peerRelayMap.get('peer-a'), 'relay-peer');
  assert.equal(state.peerRelayMap.has('peer-b'), false);
  assert.equal(state.peerRelayMap.has('peer-c'), false);
});

test('buildPubsubEdges only draws relay pubsub lines for peers mapped to active relay sockets', () => {
  const relayState = {
    peerRelayMap: new Map([
      ['peer-a', 'relay-peer']
    ])
  };
  const peers = [
    {
      peerId: 'peer-a',
      pubsub: {
        txCount: 3,
        rxCount: 5,
        lastTxAt: 10_000,
        lastRxAt: 11_000
      }
    },
    {
      peerId: 'peer-b',
      pubsub: {
        txCount: 7,
        rxCount: 9,
        lastTxAt: 10_000,
        lastRxAt: 11_000
      }
    },
    {
      peerId: 'relay-peer',
      isRelay: true
    }
  ];

  const edges = buildPubsubEdges(peers, relayState, 12_000);

  assert.deepEqual(edges, [{
    from: 'peer-a',
    to: 'relay-peer',
    lastTxAt: 10_000,
    lastRxAt: 11_000,
    txCount: 3,
    rxCount: 5
  }]);
});
