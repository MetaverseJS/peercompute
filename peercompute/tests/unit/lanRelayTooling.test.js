import test from 'node:test';
import assert from 'node:assert/strict';
import { detectLanAddresses, buildLanRelayConfig, runLanSelfTest } from '../../../scripts/lan-relay.mjs';

test('detectLanAddresses classifies RFC1918 LAN, Tailscale CGNAT, loopback, and IPv6 cleanly', () => {
  const result = detectLanAddresses({
    lo: [{ address: '127.0.0.1', family: 'IPv4', internal: true }],
    eth0: [
      { address: '192.168.1.42', family: 'IPv4', internal: false },
      { address: 'fe80::1', family: 'IPv6', internal: false },
      { address: 'fd42::10', family: 'IPv6', internal: false }
    ],
    wlan0: [{ address: '10.0.0.15', family: 'IPv4', internal: false }],
    tailscale0: [{ address: '100.88.12.34', family: 'IPv4', internal: false }],
    eth1: [{ address: '203.0.113.9', family: 'IPv4', internal: false }]
  });
  assert.deepEqual(result.lanIpv4, ['192.168.1.42', '10.0.0.15']);
  assert.deepEqual(result.tailscaleIpv4, ['100.88.12.34']);
  assert.deepEqual(result.loopbackIpv4, ['127.0.0.1']);
  assert.deepEqual(result.ipv6, ['fd42::10']);
});

test('buildLanRelayConfig prioritizes LAN and Tailscale relays before WAN failover with LAN-friendly gossipsub', () => {
  const peerId = '12D3KooWNfk2P7XVkqESrMeYipBX6VgVWCWHHgTtheJBoJ5Brtj1';
  const wan = '/dns4/secretworkshop.net/tcp/443/wss/p2p/12D3KooWN8PoXAkYjbzTD3SKJGP97peWDE9jFeqqS3ipJsgwDozs';
  const cfg = buildLanRelayConfig({
    peerId,
    port: 8080,
    addresses: { lanIpv4: ['192.168.1.50'], tailscaleIpv4: ['100.77.1.2'], loopbackIpv4: ['127.0.0.1'] },
    wanRelays: [wan],
    hostGroupId: 'pi-rack',
    profile: 'lan-first'
  });
  assert.deepEqual(cfg.bootstrapPeers, [
    `/ip4/192.168.1.50/tcp/8080/ws/p2p/${peerId}`,
    `/ip4/100.77.1.2/tcp/8080/ws/p2p/${peerId}`,
    wan
  ]);
  assert.equal(cfg.pubsubType, 'gossipsub');
  assert.equal(cfg.gossipsub.scoreParams.IPColocationFactorWeight, 0);
  assert.equal(cfg.hostGroupId, 'pi-rack');
  assert.equal(cfg.throughputTopology.profile, 'lan-first');
});

test('runLanSelfTest boots a real LAN gossipsub relay, serves relay-config.json, and connects two lan-first peers', { timeout: 25000 }, async () => {
  const report = await runLanSelfTest();
  assert.equal(report.ok, true, `LAN self-test failed: ${JSON.stringify(report)}`);
  assert.equal(report.pubsubType, 'gossipsub');
  assert.equal(report.discovered, true);
  assert.ok(report.directMessagesReceived >= 1);
  assert.equal(report.relayHealth.ok, true);
  assert.equal(report.relayHealth.isLan, true);
  assert.equal(report.hostGroupId, 'lan-self-test');
});
