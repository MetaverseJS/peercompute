import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, stat, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createServer } from 'node:net';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { generateKeyPair } from '@libp2p/crypto/keys';
import { peerIdFromPrivateKey } from '@libp2p/peer-id';
import { multiaddr } from '@multiformats/multiaddr';
import { createNativeCompanion } from '../../src/host/native/NativeCompanion.js';

const protocol = '/peercompute/native-companion-test/1.0.0';

async function fixture(t, options = {}) {
  const directory = await mkdtemp(path.join(tmpdir(), 'peercompute-native-test-'));
  const identityPath = path.join(directory, 'identity.json');
  const companion = createNativeCompanion({ identityPath, ...options });
  t.after(async () => { await companion.stop(); await rm(directory, { recursive: true, force: true }); });
  return { companion, directory, identityPath };
}

async function peer(t, { relayAddress, privateKey } = {}) {
  const node = await createLibp2p({ privateKey, start: false,
    transports: [webSockets(), circuitRelayTransport({ reservationCompletionTimeout: 1500 })],
    addresses: { listen: relayAddress ? [`${relayAddress}/p2p-circuit`] : [] },
    connectionEncrypters: [noise()], streamMuxers: [yamux()], services: { identify: identify() },
    connectionGater: { denyDialMultiaddr: () => false },
  });
  t.after(() => node.stop());
  await node.start();
  return node;
}

async function exchange(node, address, bytes = new TextEncoder().encode('hello through an authenticated circuit')) {
  const stream = await node.dialProtocol(multiaddr(address), protocol, { signal: AbortSignal.timeout(5000), runOnLimitedConnection: true });
  stream.send(bytes);
  const result = await stream[Symbol.asyncIterator]().next();
  assert.equal(result.done, false);
  await stream.close();
  return result.value.subarray();
}

async function echo(node) {
  await node.handle(protocol, async (stream) => {
    try { for await (const bytes of stream) stream.send(bytes); await stream.close(); } catch { /* Expected when a budget closes the circuit. */ }
  }, { runOnLimitedConnection: true });
}

test('native identity persists, is private and locked against concurrent owners; lifecycle is restartable', async (t) => {
  const { companion, identityPath } = await fixture(t);
  const first = await companion.start();
  assert.equal(first.state, 'running'); assert.equal(first.relay.mode, 'hosted-only');
  assert.match(first.localMultiaddrs[0], /\/tcp\/[1-9]\d*\/ws\/p2p\//);
  assert.equal((await stat(identityPath)).mode & 0o777, 0o600);
  assert.equal(JSON.stringify(first).includes('privateKey'), false);
  const competing = createNativeCompanion({ identityPath });
  await assert.rejects(competing.start(), /already in use/);
  await competing.stop();
  await companion.stop(); await companion.stop();
  await assert.rejects(access(`${identityPath}.lock`), { code: 'ENOENT' });
  const second = await companion.start();
  assert.equal(second.peerId, first.peerId);
});

test('corrupt persisted identity fails closed and leaves its bytes intact', async (t) => {
  const { companion, identityPath } = await fixture(t);
  await writeFile(identityPath, '{broken');
  await assert.rejects(companion.start(), /persisted native identity/);
  assert.equal(await readFile(identityPath, 'utf8'), '{broken');
  await assert.rejects(access(`${identityPath}.lock`), { code: 'ENOENT' });
});

test('dead owner lock recovers without changing identity; a mismatched key never starts', async (t) => {
  const { companion, identityPath } = await fixture(t);
  const { peerId } = await companion.start(); await companion.stop();
  assert.throws(() => process.kill(2_147_483_647, 0), { code: 'ESRCH' });
  await writeFile(`${identityPath}.lock`, JSON.stringify({ pid: 2_147_483_647, token: 'dead-owner' }));
  assert.equal((await companion.start()).peerId, peerId); await companion.stop();
  const record = JSON.parse(await readFile(identityPath, 'utf8'));
  record.peerId = peerIdFromPrivateKey(await generateKeyPair('Ed25519')).toString();
  await writeFile(identityPath, JSON.stringify(record));
  await assert.rejects(companion.start(), /does not match/);
  assert.equal(JSON.parse(await readFile(identityPath, 'utf8')).peerId, record.peerId);
});

test('invalid bounds fail before listening and bind failure releases identity ownership', async (t) => {
  assert.throws(() => createNativeCompanion({ identityPath: '/unused', relay: { maxCircuitBytes: Infinity } }), /integer/);
  assert.throws(() => createNativeCompanion({ identityPath: '/unused', relay: { enabled: 'yes' } }), /boolean/);
  const occupied = createServer();
  await new Promise((resolve) => occupied.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => occupied.close(resolve)));
  const { companion, identityPath } = await fixture(t, { listenPort: occupied.address().port });
  await assert.rejects(companion.start());
  await assert.rejects(access(`${identityPath}.lock`), { code: 'ENOENT' });
  assert.equal(companion.getStatus().state, 'failed');
});

test('explicit external announce does not replace the local bound bootstrap address', async (t) => {
  const { companion } = await fixture(t, { announce: ['/dns4/host.example/tcp/443/wss'] });
  const status = await companion.start();
  assert.match(status.localMultiaddrs[0], /^\/ip4\/127.0.0.1\/tcp\/[1-9]\d*\/ws\/p2p\//);
  assert(status.advertisedMultiaddrs.some((address) => address.startsWith('/dns4/host.example/tcp/443/wss/')));
});

test('hosted-only mode denies strangers, serves encrypted traffic to owned peers and revokes ownership', { timeout: 20000 }, async (t) => {
  const { companion } = await fixture(t);
  const { localMultiaddrs: [relayAddress] } = await companion.start();
  await assert.rejects(peer(t, { relayAddress }), /listen|reservation|transport/i);
  assert.equal(companion.getStatus().reservations, 0);
  const privateKey = await generateKeyPair('Ed25519');
  const id = peerIdFromPrivateKey(privateKey).toString();
  await companion.setHostedPeerIds([id]);
  const target = await peer(t, { relayAddress, privateKey }); await echo(target);
  const requester = await peer(t);
  const address = `${relayAddress}/p2p-circuit/p2p/${id}`;
  const received = await exchange(requester, address);
  assert.equal(new TextDecoder().decode(received), 'hello through an authenticated circuit');
  const connection = requester.getConnections(target.peerId)[0];
  assert.match(connection.encryption, /noise/);
  assert.equal(companion.getStatus().reservations, 1);
  await companion.setHostedPeerIds([]);
  assert.equal(companion.getStatus().reservations, 0);
  await requester.hangUp(target.peerId);
  await assert.rejects(exchange(requester, address));
});

test('opt-in public relay enforces its reservation capacity', { timeout: 15000 }, async (t) => {
  const { companion } = await fixture(t, { relay: { enabled: true, maxReservations: 1 } });
  const { localMultiaddrs: [relayAddress] } = await companion.start();
  const target = await peer(t, { relayAddress }); await echo(target);
  await assert.rejects(peer(t, { relayAddress }), /listen|reservation|transport/i);
  assert.equal(companion.getStatus().reservations, 1);
  const requester = await peer(t);
  assert.equal(new TextDecoder().decode(await exchange(requester, `${relayAddress}/p2p-circuit/p2p/${target.peerId}`)), 'hello through an authenticated circuit');
});

test('relay circuit byte budget closes an actual encrypted connection', { timeout: 15000 }, async (t) => {
  const { companion } = await fixture(t, { relay: { enabled: true, maxCircuitBytes: 16384 } });
  const { localMultiaddrs: [relayAddress] } = await companion.start();
  const target = await peer(t, { relayAddress }); await echo(target);
  const requester = await peer(t);
  const address = `${relayAddress}/p2p-circuit/p2p/${target.peerId}`;
  await exchange(requester, address);
  await assert.rejects(exchange(requester, address, new Uint8Array(64 * 1024)));
});

test('relay duration budget is enforced by the server in milliseconds', { timeout: 15000 }, async (t) => {
  const { companion } = await fixture(t, { relay: { enabled: true, maxCircuitDurationMs: 1200 } });
  const { localMultiaddrs: [relayAddress] } = await companion.start();
  const target = await peer(t, { relayAddress }); await echo(target);
  const requester = await peer(t);
  const address = `${relayAddress}/p2p-circuit/p2p/${target.peerId}`;
  await exchange(requester, address);
  const connection = requester.getConnections(target.peerId)[0];
  const closed = new Promise((resolve) => requester.addEventListener('connection:close', (event) => {
    if (event.detail.id === connection.id) resolve();
  }));
  await Promise.race([closed, new Promise((_, reject) => {
    const timer = setTimeout(() => reject(new Error('Circuit outlived its enforced duration budget.')), 4000); timer.unref();
  })]);
  assert(['closed', 'aborted'].includes(connection.status));
});
