import assert from 'node:assert/strict';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';

const manager = new NetworkManager({
  webrtc: {
    iceServers: [{ urls: 'stun:example.com:3478' }],
    preferDirect: true,
    dropRelayOnDirect: true
  }
});

assert.ok(manager.config.webrtc);
assert.equal(manager.config.webrtc.preferDirect, true);
assert.equal(manager.config.webrtc.dropRelayOnDirect, true);
assert.ok(Array.isArray(manager.config.webrtc.rtcConfiguration.iceServers));

console.log('[webrtc-config] smoke ok');
