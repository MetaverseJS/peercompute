import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BrowserHost } from '../host/BrowserHost.mjs';

const hostname = process.env.PEERCOMPUTE_HOST_WSS_NAME;
if (!hostname || !process.env.SSL_CERT || !process.env.SSL_KEY) {
  throw new Error('Set PEERCOMPUTE_HOST_WSS_NAME, SSL_CERT and SSL_KEY to a reachable hostname and its browser-trusted certificate paths');
}
const dataDir = await mkdtemp(join(tmpdir(), 'peercompute-root-wss-'));
const host = new BrowserHost({ dataDir, port: 0, chromeArgs: ['--disable-gpu'],
  companion: { enabled: true, listenHost: '0.0.0.0', listenPort: 0, connectHost: hostname,
    tls: { certPath: process.env.SSL_CERT, keyPath: process.env.SSL_KEY } } });
try {
  const result = await host.start();
  const connection = result.browser.connections.find(value => value.remotePeer === result.companion.peerId);
  assert.equal(connection?.encryption, '/noise');
  // Multiaddr normalizes /wss to /tls/ws in current libp2p.
  assert.match(connection.multiaddr, /\/(?:wss|tls\/ws)\//);
  assert(connection.multiaddr.startsWith(`/dns4/${hostname}/`));
  assert.equal(result.companion.reservations, 1);
  assert(result.browser.addresses.some(value => value.startsWith(`/dns4/${hostname}/`) && value.includes('/p2p-circuit')));
  assert.deepEqual(result.pageErrors, []);
  console.log(JSON.stringify({ status: 'passed', connection, reservations: result.companion.reservations,
    tlsVerificationBypassed: false, scope: 'same-machine browser to reachable hostname; not independent-device/NAT qualification' }, null, 2));
} finally { await host.stop(); await rm(dataDir, { recursive: true, force: true }); }
