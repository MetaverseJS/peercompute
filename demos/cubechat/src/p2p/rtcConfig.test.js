import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCubeChatRtcConfiguration } from './rtcConfig.js';

test('uses the existing Google STUN server only when no ICE servers are configured', () => {
  assert.deepEqual(buildCubeChatRtcConfiguration(null), {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });
  assert.deepEqual(buildCubeChatRtcConfiguration({ iceServers: [] }), {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });
});

test('preserves rtcConfiguration policies and normalized TURN credentials', () => {
  const config = buildCubeChatRtcConfiguration({
    preferDirect: false,
    dropRelayOnDirect: false,
    iceServers: [{
      urls: ['turn:turn.example.test:3478?transport=udp', 'turns:turn.example.test:5349'],
      username: 'cubechat-user',
      credential: 'cubechat-secret'
    }],
    rtcConfiguration: {
      iceTransportPolicy: 'relay',
      bundlePolicy: 'max-bundle',
      iceCandidatePoolSize: 2
    }
  });

  assert.deepEqual(config, {
    iceTransportPolicy: 'relay',
    bundlePolicy: 'max-bundle',
    iceCandidatePoolSize: 2,
    iceServers: [{
      urls: ['turn:turn.example.test:3478?transport=udp', 'turns:turn.example.test:5349'],
      username: 'cubechat-user',
      credential: 'cubechat-secret'
    }]
  });
  assert.equal('preferDirect' in config, false);
  assert.equal('dropRelayOnDirect' in config, false);
});

test('retains ICE servers nested in rtcConfiguration when no direct list is present', () => {
  const config = buildCubeChatRtcConfiguration({
    rtcConfiguration: {
      iceTransportPolicy: 'all',
      iceServers: [{
        urls: 'stun:stun.example.test:3478',
        username: 'nested-user',
        credential: 'nested-secret'
      }]
    }
  });

  assert.deepEqual(config, {
    iceTransportPolicy: 'all',
    iceServers: [{
      urls: 'stun:stun.example.test:3478',
      username: 'nested-user',
      credential: 'nested-secret'
    }]
  });
});

test('prefers a normalized direct ICE list over a stale nested list', () => {
  const config = buildCubeChatRtcConfiguration({
    iceServers: ['turn:normalized.example.test:3478'],
    rtcConfiguration: {
      iceServers: [{ urls: 'stun:stale.example.test:3478' }]
    }
  });

  assert.deepEqual(config.iceServers, [{ urls: 'turn:normalized.example.test:3478' }]);
});

test('ignores invalid direct entries and normalizes the legacy url alias', () => {
  const nested = buildCubeChatRtcConfiguration({
    iceServers: [{ username: 'missing-urls' }],
    rtcConfiguration: {
      iceServers: [{
        url: 'turn:legacy.example.test:3478',
        username: 'legacy-user',
        credential: 'legacy-secret'
      }]
    }
  });

  assert.deepEqual(nested.iceServers, [{
    url: 'turn:legacy.example.test:3478',
    urls: 'turn:legacy.example.test:3478',
    username: 'legacy-user',
    credential: 'legacy-secret'
  }]);
});
