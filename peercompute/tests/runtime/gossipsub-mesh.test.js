import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { noise } from '@libp2p/noise';
import { yamux } from '@libp2p/yamux';
import { gossipsub } from '@libp2p/gossipsub';
import { identify } from '@libp2p/identify';

if (typeof globalThis.Event === 'undefined') {
  globalThis.Event = class Event {
    constructor(type) {
      this.type = type;
    }
  };
}
if (typeof globalThis.CustomEvent === 'undefined') {
  globalThis.CustomEvent = class CustomEvent extends Event {
    constructor(type, params = {}) {
      super(type);
      this.detail = params.detail;
    }
  };
}
if (typeof Promise.withResolvers !== 'function') {
  Promise.withResolvers = () => {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

const TOPIC = 'peercompute-mesh-test';
const NODE_COUNT = 6;
const GOSSIPSUB_CONFIG = {
  emitSelf: false,
  allowPublishToZeroTopicPeers: true,
  D: 3,
  Dlo: 2,
  Dhi: 4,
  Dlazy: 3,
  heartbeatInterval: 500
};

const waitFor = async (condition, { timeoutMs = 15000, intervalMs = 200 } = {}) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await condition()) return true;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return false;
};

const getConnectedPeers = (node) => {
  const peers = new Set();
  node.getConnections().forEach((conn) => {
    if (conn?.remotePeer) {
      peers.add(conn.remotePeer.toString());
    }
  });
  return peers;
};

const createNode = async () => {
  const node = await createLibp2p({
    addresses: {
      listen: ['/ip4/127.0.0.1/tcp/0']
    },
    transports: [tcp()],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    services: {
      identify: identify(),
      pubsub: gossipsub({ ...GOSSIPSUB_CONFIG })
    }
  });
  await node.start();
  node.services.pubsub.subscribe(TOPIC);
  return node;
};

const connectFully = async (nodes) => {
  for (let i = 0; i < nodes.length; i += 1) {
    const targetAddrs = nodes[i].getMultiaddrs();
    if (!targetAddrs.length) {
      throw new Error('Node has no listen addresses for dialing');
    }
    for (let j = i + 1; j < nodes.length; j += 1) {
      let dialed = false;
      let attempts = 0;
      while (!dialed && attempts < 3) {
        attempts += 1;
        try {
          await nodes[j].dial(targetAddrs[0]);
          dialed = true;
        } catch (err) {
          if (attempts >= 3) {
            throw err;
          }
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }
    }
  }
};

test('gossipsub mesh caps peer count even with full connectivity', async () => {
  const nodes = [];
  try {
    for (let i = 0; i < NODE_COUNT; i += 1) {
      nodes.push(await createNode());
    }

    await connectFully(nodes);

    const connectionsReady = await waitFor(
      () => nodes.every((node) => getConnectedPeers(node).size >= NODE_COUNT - 1)
    );
    assert.ok(connectionsReady, 'Expected full connection graph before mesh assertions');

    const meshReady = await waitFor(
      () => nodes.every((node) => node.services.pubsub.getMeshPeers(TOPIC).length > 0)
    );
    assert.ok(meshReady, 'Expected gossipsub mesh to form for all nodes');

    nodes.forEach((node) => {
      const meshPeers = node.services.pubsub.getMeshPeers(TOPIC);
      assert.ok(
        meshPeers.length <= GOSSIPSUB_CONFIG.Dhi,
        `Mesh size ${meshPeers.length} exceeded Dhi=${GOSSIPSUB_CONFIG.Dhi}`
      );
      assert.ok(
        meshPeers.length < NODE_COUNT - 1,
        'Mesh should not be fully connected when Dhi < peer count'
      );
    });
  } finally {
    await Promise.all(nodes.map((node) => node.stop().catch(() => {})));
  }
});
