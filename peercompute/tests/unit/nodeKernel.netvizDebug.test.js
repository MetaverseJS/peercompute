import test from 'node:test';
import assert from 'node:assert/strict';
import { NodeKernel } from '../../src/peercompute/nodeKernel/NodeKernel.js';

test('NodeKernel enables NetViz debug telemetry + warm delta provider by default', () => {
  const node = new NodeKernel();
  assert.equal(node.config.enableNetVizDebugTelemetry, true);
  assert.equal(node.config.enableWarmDeltaProvider, true);
  assert.equal(node.config.netVizDebugTelemetryTaskPrefix, 'telemetry:');
  assert.equal(node.config.enableNetVizSessionDiscovery, false);
});

test('NodeKernel publishes NetViz telemetry deltas with telemetry:<peerId> task IDs', () => {
  const node = new NodeKernel({
    enableNetVizDebugTelemetry: true,
    deltaNamespace: 'deltas'
  });
  const commits = [];
  node.networkManager = {
    getTelemetrySnapshot: () => ({
      ts: 1234,
      peerId: '12D3KooWExample',
      roomId: 'global',
      topologyId: 'demo-topology',
      peerCount: 3
    })
  };
  node.stateManager = {
    commitDelta: (delta) => {
      commits.push(delta);
    }
  };

  node._publishNetVizDebugTelemetry();
  assert.equal(commits.length, 1);
  assert.equal(commits[0].taskId, 'telemetry:12D3KooWExample');
  assert.equal(commits[0].scope, 'deltas');
  assert.equal(commits[0].version, 1234);
  assert.equal(commits[0].payload.peerCount, 3);
});

test('NodeKernel builds NetViz attach URL from topology + room config', () => {
  const prevWindow = globalThis.window;
  const prevDocument = globalThis.document;
  globalThis.window = { location: { origin: 'https://demos.peercompute.test' } };
  globalThis.document = {};

  try {
    const node = new NodeKernel({
      topology: 'hierarchical',
      topologyId: 'cubechat-topology',
      roomId: 'lobby-42',
      netVizAttachPath: '/netviz/'
    });
    node.nodeId = 'node-1';
    node.netVizDebugSessionId = 'session-node-1';
    const url = node.getNetVizAttachUrl();
    assert.ok(url.includes('https://demos.peercompute.test/netviz/'));
    assert.ok(url.includes('topologyType=hierarchical'));
    assert.ok(url.includes('topologyId=cubechat-topology'));
    assert.ok(url.includes('room=lobby-42'));
    assert.ok(url.includes('autoConnect=1'));
    assert.ok(url.includes('attachSession=session-node-1'));
  } finally {
    globalThis.window = prevWindow;
    globalThis.document = prevDocument;
  }
});

test('NodeKernel tracks and prunes discovered NetViz sessions from network messages', () => {
  const node = new NodeKernel({
    enableNetVizSessionDiscovery: true,
    netVizSessionStaleMs: 10
  });
  assert.ok(node.config.additionalPubsubTopics.includes('peercompute-netviz-sessions'));
  node._handleNetworkMessage('12D3KooWSource', {
    type: 'netviz-session-upsert',
    session: {
      sessionId: 'session-remote',
      gameId: 'cubechat',
      roomId: 'lobby',
      topologyId: 'cubechat-topology',
      topologyType: 'distributed',
      ts: Date.now()
    }
  });
  const sessions = node.getNetVizDiscoveredSessions();
  assert.equal(sessions.length, 1);
  assert.equal(sessions[0].sessionId, 'session-remote');
  assert.equal(sessions[0].peerId, '12D3KooWSource');

  node._handleNetworkMessage('12D3KooWSource', {
    type: 'netviz-session-remove',
    sessionId: 'session-remote'
  });
  assert.equal(node.getNetVizDiscoveredSessions().length, 0);
});
