import test from 'node:test';
import assert from 'node:assert/strict';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { plaintext } from '@libp2p/plaintext';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { channel } from '../../peercompute/src/peercompute/networkManager/inference/protocol.js';
import { WorldGeneratedObjectNetwork, WORLD_OBJECT_PROTOCOL } from '../shared/agents/WorldGeneratedObjectNetwork.js';
import { WORLD_OBJECT_SCHEMA } from '../shared/agents/WorldObjectAction.js';
import { ArtifactStore } from '../../peercompute/src/peercompute/artifacts/ArtifactStore.js';

const scope = { gameId: 'cubechat', roomId: 'objects-test', topologyId: 'mesh' }, worldId = 'cubechat:objects-test';
async function fixture(t, { plain = false } = {}) {
  const store = new ArtifactStore({ persistent: false }); await store.open();
  const file = await store.importFile(new Uint8Array([1, 2, 3])); await store.destroy();
  const descriptor = { artifactCid: file.cid, placement: { schema: WORLD_OBJECT_SCHEMA, worldId, ownerHostId: 'owner-host',
    agentId: 'agent', objectId: 'object', requestId: 'request', requestHash: 'a'.repeat(64), name: 'Stone arch', position: [3, 0, 7], size: 8 } };
  const peers = [];
  t.after(async () => { await Promise.allSettled(peers.map(peer => peer.service.close())); await Promise.allSettled(peers.map(peer => peer.node.stop())); });
  for (let index = 0; index < 2; index++) {
    const node = await createLibp2p({ addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] }, transports: [webSockets()],
      connectionEncrypters: [plain ? plaintext() : noise()], streamMuxers: [yamux()], services: { identify: identify() } });
    const manager = { getLibp2pNode: () => node, config: { ...scope }, peers: new Map(), bootstrapPeerIds: new Set() };
    const peer = { node, manager, objects: index ? [descriptor] : [], directories: [] }; let clock = Date.now();
    peer.service = new WorldGeneratedObjectNetwork({ networkManager: manager, worldId, listLocalObjects: () => peer.objects,
      onDirectory: value => peer.directories.push(value), requestTimeoutMs: 800, now: () => clock += 1000 });
    peers.push(peer); await peer.service.start();
  }
  await peers[0].node.dial(peers[1].node.getMultiaddrs());
  for (const peer of peers) for (const other of peers) if (peer !== other) peer.manager.peers.set(other.node.peerId.toString(), { ...scope });
  return peers;
}
test('real Noise peers discover exact CID records with transport-derived owner identity, then remove withdrawn objects', { timeout: 12000 }, async t => {
  const [a, b] = await fixture(t);
  const result = await a.service.query(b.node.peerId.toString());
  assert.equal(result.length, 1); assert.equal(result[0].ownerPeerId, b.node.peerId.toString()); assert.equal(result[0].local, false);
  assert.deepEqual(result[0].placement, b.objects[0].placement);
  await a.service.refresh(); assert.equal(a.directories.at(-1).length, 1);
  b.objects = []; await a.service.refresh(); assert.deepEqual(a.directories.at(-1), []);
  assert.equal(a.node.getConnections()[0].encryption, '/noise');
});
test('plaintext, unknown room members, relay peers and claimed owner fields cannot publish object descriptors', { timeout: 12000 }, async t => {
  const [a, b] = await fixture(t), peerId = b.node.peerId.toString();
  a.manager.peers.get(peerId).roomId = 'other'; await assert.rejects(a.service.query(peerId), /not in this room/);
  a.manager.peers.set(peerId, { ...scope }); a.manager.bootstrapPeerIds.add(peerId);
  await assert.rejects(a.service.query(peerId), /not in this room/); a.manager.bootstrapPeerIds.clear();
  b.objects[0] = { ...b.objects[0], ownerPeerId: a.node.peerId.toString() };
  await assert.rejects(a.service.query(peerId));
  const [c, d] = await fixture(t, { plain: true });
  await assert.rejects(c.service.query(d.node.peerId.toString()), /not connected/);
});
test('raw scope, recipient, replay nonce and object authority extensions are rejected', { timeout: 12000 }, async t => {
  const [a, b] = await fixture(t), peerId = b.node.peerId.toString();
  const connection = a.node.getConnections()[0];
  for (const patch of [{ worldId: 'elsewhere' }, { scope: { ...scope, roomId: 'elsewhere' } },
    { recipient: a.node.peerId.toString() }, { owner: a.node.peerId.toString() }, { nonce: '../bad' }]) {
    const stream = await connection.newStream(WORLD_OBJECT_PROTOCOL), io = channel(stream), signal = AbortSignal.timeout(1200);
    await io.write({ type: 'query', recipient: peerId, nonce: crypto.randomUUID(), worldId, scope, ...patch }, signal);
    await assert.rejects(io.read(signal));
    try { stream.abort(new Error('Test finished')); } catch { /* Already closed. */ }
  }
  const cancelled = new AbortController(); cancelled.abort();
  await assert.rejects(a.service.query(peerId, { signal: cancelled.signal }), { name: 'AbortError' });
  await a.service.close(); await assert.rejects(a.service.query(peerId), /closed/);
});
