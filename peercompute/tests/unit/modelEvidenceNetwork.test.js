import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { plaintext } from '@libp2p/plaintext';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { lpStream } from '@libp2p/utils';
import { ModelEvidenceStore } from '../../src/peercompute/modelEvidence/ModelEvidenceStore.js';
import { ModelEvidenceService, MODEL_EVIDENCE_PROTOCOL, MODEL_EVIDENCE_RPC_SCHEMA,
  evidenceEncryptedConnection } from '../../src/peercompute/modelEvidence/ModelEvidenceService.js';
import { MODEL_EVIDENCE_SCHEMA } from '../../src/peercompute/modelEvidence/ModelEvidenceContracts.js';

function report(peerId, observedAt = 1) {
  return { schema: MODEL_EVIDENCE_SCHEMA, observedAt, executorPeerId: peerId,
    source: { repository: 'fixture/model', revision: 'a'.repeat(40), packageFingerprint: 'b'.repeat(64) },
    compatibility: { clientBuild: 'test', inspectorVersion: '1', policyVersion: '1', runtime: 'llama.cpp', runtimeVersion: '3.8.1' },
    environment: { kind: 'browser', gpu: { vendor: 'test-only', features: ['shader-f16'] } },
    stage: 'generation', outcome: 'success', workload: { task: 'text-generation', inputTokens: 8, outputTokens: 2 } };
}
async function fixture(t, { unencrypted = false, timeoutMs = 2000 } = {}) {
  const peers = [], indexedDBImpl = new IDBFactory();
  t.after(async () => {
    await Promise.allSettled(peers.map(peer => peer.service.stop()));
    await Promise.allSettled(peers.map(peer => peer.node.stop()));
    await Promise.allSettled(peers.map(peer => peer.store?.destroy()));
  });
  for (let index = 0; index < 2; index++) {
    const node = await createLibp2p({ addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] },
      transports: [webSockets()], connectionEncrypters: [unencrypted ? plaintext() : noise()],
      streamMuxers: [yamux()], services: { identify: identify() } });
    const store = index === 0 ? new ModelEvidenceStore({ indexedDBImpl }) : null;
    const manager = { libp2p: node, config: { gameId: `different-demo-${index}` } };
    const service = new ModelEvidenceService(manager, { store, serve: index === 0, timeoutMs });
    const peer = { node, manager, service, store, id: node.peerId.toString() }; peers.push(peer);
    await service.start();
  }
  await peers[1].node.dial(peers[0].node.getMultiaddrs()); return peers;
}

test('real Noise peers submit, query and replay immutable evidence across demo scopes with authenticated provenance', { timeout: 15000 }, async t => {
  const [root, client] = await fixture(t);
  assert.equal(evidenceEncryptedConnection(client.node.getConnections()[0]), true);
  const input = report(client.id); input.prompt = 'PRIVATE'; input.workload.messages = ['PRIVATE'];
  const first = await client.service.submit(root.id, [input]);
  const replay = await client.service.submit(root.id, [input]); assert.deepEqual(replay, first);
  const found = await client.service.query(root.id, { repository: 'fixture/model' }); assert.equal(found.length, 1);
  assert.equal(found[0].reporterPeerId, client.id); assert.equal(found[0].report.executorPeerId, client.id);
  assert.equal(found[0].provenance, 'authenticated-peer'); assert(!JSON.stringify(found).includes('PRIVATE'));
  assert.deepEqual(await client.service.query(root.id, { repository: 'other/model' }), []);
  await client.service.submit(root.id, [report(client.id, 2)]);
  const latest = await client.service.query(root.id, { limit: 1 });
  const older = await client.service.query(root.id, { beforeSequence: latest[0].sequence }); assert.equal(older[0].id, first.ids[0]);
  const indexedDBImpl = root.store.indexedDB;
  await root.service.stop(); await root.store.destroy();
  const reopened = new ModelEvidenceStore({ indexedDBImpl }); t.after(() => reopened.destroy());
  assert.equal((await reopened.query()).length, 2, 'acknowledged remote receipts survive closing the service and database');
});

test('an authenticated sender cannot claim a different executing host or spoof the RPC sender', { timeout: 15000 }, async t => {
  const [root, client] = await fixture(t);
  await assert.rejects(client.service.submit(root.id, [report(root.id)]), /REJECTED/);
  assert.equal((await root.store.query()).length, 0);
  const stream = await client.node.getConnections()[0].newStream(MODEL_EVIDENCE_PROTOCOL), io = lpStream(stream);
  const spoof = { schema: MODEL_EVIDENCE_RPC_SCHEMA, type: 'query', sender: root.id, recipient: root.id, requestId: 'spoof', query: {} };
  await io.write(new TextEncoder().encode(JSON.stringify(spoof)));
  await assert.rejects(io.read({ signal: AbortSignal.timeout(2500) }));
  assert.equal((await root.store.query()).length, 0);
});

test('plaintext transport is not evidence authentication even when its libp2p peer ID is known', { timeout: 15000 }, async t => {
  const [root, client] = await fixture(t, { unencrypted: true });
  assert.equal(evidenceEncryptedConnection(client.node.getConnections()[0]), false);
  await assert.rejects(client.service.submit(root.id, [report(client.id)]), /UNREACHABLE/);
  const stream = await client.node.getConnections()[0].newStream(MODEL_EVIDENCE_PROTOCOL);
  await assert.rejects(lpStream(stream).read({ signal: AbortSignal.timeout(2500) }));
  assert.equal((await root.store.query()).length, 0);
});

test('per-peer ingestion rate bounds apply to replayed packets and do not poison previously accepted records', { timeout: 15000 }, async t => {
  const [root, client] = await fixture(t);
  const batch = Array.from({ length: 6 }, () => report(client.id));
  for (let attempt = 0; attempt < 10; attempt++) await client.service.submit(root.id, batch);
  await assert.rejects(client.service.submit(root.id, batch), /REJECTED/);
  assert.equal((await root.store.query()).length, 1);
});

test('stopping client service cancels an outstanding request and closes its owned streams', { timeout: 15000 }, async t => {
  const [root, client] = await fixture(t);
  await root.service.stop();
  let accepted; const entered = new Promise(resolve => { accepted = resolve; });
  await root.node.handle(MODEL_EVIDENCE_PROTOCOL, () => { accepted(); });
  const querying = client.service.query(root.id); querying.catch(() => {}); await entered;
  await client.service.stop(); await assert.rejects(querying, /STOPPED/);
  assert.equal(client.service.operations.size, 0); assert.equal(client.service.status().closed, true);
});
