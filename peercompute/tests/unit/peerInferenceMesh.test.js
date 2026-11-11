import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';
import { PEER_INFERENCE_PROTOCOL as CURRENT, PEER_INFERENCE_PROTOCOL_V4 as V4,
  PEER_INFERENCE_PROTOCOL_V3 as V3, PEER_INFERENCE_PROTOCOL_V2 as V2, PEER_INFERENCE_LIMITS as LIMITS,
  channel, descriptor, generation, localState, meshProgress } from '../../src/peercompute/networkManager/inference/protocol.js';
import { encodeGeneratedMesh, normalizeGeneratedMeshDescriptor, GENERATED_MESH_LIMITS } from '../../src/peercompute/inference/GeneratedMeshArtifact.js';

const manifestCid = 'bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou';
const model = { manifestCid, modelId: 'mesh-fixture', name: 'Mesh fixture', task: 'image-to-3d', modalities: ['image'],
  outputModalities: ['mesh'], runtime: 'test-only-injected-service', repository: 'fixture/mesh', revision: 'a'.repeat(40), totalBytes: 1 };
const image = { width: 2, height: 1, channels: 4, data: new Uint8Array([255, 0, 0, 255, 0, 0, 255, 255]) };
const empty = () => ({ sharedModels: [], hostedModels: [], hostedModel: null, busy: false, idleForMs: 0 });
function meshFixture() {
  const side = 70, positions = new Float32Array(side * side * 3), indices = [];
  for (let y = 0; y < side; y++) for (let x = 0; x < side; x++) {
    const index = y * side + x; positions.set([x / side, y / side, Math.sin(x / 10) / 10], index * 3);
    if (x < side - 1 && y < side - 1) indices.push(index, index + 1, index + side, index + 1, index + side + 1, index + side);
  }
  return encodeGeneratedMesh({ positions, indices: new Uint16Array(indices) });
}
const mesh = meshFixture();
async function fixture(t, count = 2) {
  const entries = [];
  t.after(async () => {
    await Promise.allSettled(entries.map((entry) => entry.manager._stopPeerInferenceService()));
    await Promise.allSettled(entries.map((entry) => entry.node.stop()));
  });
  for (let i = 0; i < count; i++) {
    const node = await createLibp2p({ addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] }, transports: [webSockets()],
      connectionEncrypters: [noise()], streamMuxers: [yamux()], services: { identify: identify() } });
    const manager = new NetworkManager({ bootstrapPeers: [], gameId: 'mesh-test', roomId: 'private', topologyId: 'mesh' });
    manager.libp2p = node; manager.isConnected = true;
    manager.sendToPeer = () => { throw new Error('Geometry and images must not enter pubsub'); };
    const entry = { node, manager, state: empty(), received: [] };
    entry.run = async (input) => { entry.received.push(input); return { text: '', mesh, gpuDispatches: 10 }; };
    entries.push(entry);
    entry.service = await manager.createPeerInferenceService({ owner: Symbol('mesh-owner'), getLocalState: () => entry.state,
      generate: (input) => entry.run(input), queryTimeoutMs: 1000, requestTimeoutMs: 4000 });
  }
  for (const entry of entries.slice(1)) await entries[0].node.dial(entry.node.getMultiaddrs());
  return entries;
}
async function until(check) {
  for (let i = 0; i < 200; i++) { if (check()) return; await delay(10); }
  throw new Error('Mesh operation did not settle');
}

test('mesh descriptors and requests are explicit and invisible to every legacy directory', () => {
  assert.deepEqual(descriptor(model).outputModalities, ['mesh']);
  assert.throws(() => descriptor({ ...model, outputModalities: ['text'] }));
  assert.throws(() => descriptor({ ...model, modalities: ['text', 'image'] }));
  const state = { ...empty(), sharedModels: [model], hostedModel: model, hostedModels: [model] };
  for (const protocol of [V4, V3, V2]) {
    const directory = localState(state, true, { protocol });
    assert.deepEqual(directory.sharedModels, []); assert.equal(directory.hostedModel, null);
    assert.deepEqual(directory.hostedModels ?? [], []);
  }
  const input = { task: 'image-to-3d', requestId: 'mesh', manifestCid, image };
  const checked = generation(input, { imageBytes: true });
  assert.deepEqual(checked.image, image); assert.notEqual(checked.image.data, image.data);
  for (const extra of [{ image: undefined }, { prompt: 'Ignored conditioning must not be accepted' }, { messages: [] },
    { audio: {} }, { seed: 2 }, { maxNewTokens: 256 }]) assert.throws(() => generation({ ...input, ...extra }, { imageBytes: true }));
});

test('real Noise v5 mesh results preserve image, geometry digest and exact provider across credited chunks', { timeout: 15000 }, async (t) => {
  const [requester, host] = await fixture(t);
  host.state = { ...empty(), sharedModels: [model], hostedModels: [model] };
  host.run = async (input) => {
    host.received.push(input);
    input.onProgress({ type: 'mesh-generation', stage: 'image', loaded: 0, total: 1 });
    input.onProgress({ type: 'mesh-generation', stage: 'shape', loaded: 32768, total: 262144 });
    input.onProgress({ type: 'mesh-generation', stage: 'done', loaded: 1, total: 1 });
    return { text: '', mesh, gpuDispatches: 10 };
  };
  const directory = await requester.service.refresh();
  assert.equal(directory.hosts[0].task, 'image-to-3d'); assert.deepEqual(directory.hosts[0].outputModalities, ['mesh']);
  const progress = [];
  const result = await requester.service.generate(manifestCid, { task: 'image-to-3d', image,
    onProgress: (event) => { if (event.type === 'mesh-generation') progress.push(event); } });
  assert.equal(result.protocol, CURRENT); assert.equal(result.connectionEncryption, '/noise');
  assert.equal(result.peerId, host.node.peerId.toString()); assert.equal(result.manifestCid, manifestCid);
  assert.deepEqual(result.mesh, mesh); assert.equal(result.gpuDispatches, 10);
  assert(mesh.byteLength > LIMITS.imageChunkBytes, 'Exercise multiple credit windows');
  assert.deepEqual(host.received[0].image, image); assert.equal(host.received[0].messages, undefined);
  assert.deepEqual(progress.map((event) => event.stage), ['image', 'shape', 'done']);
  assert(progress.every((event) => event.peerId === result.peerId));
  await until(() => host.service.inbound.size === 0); assert.equal(requester.service.outbound.size, 0);
});

test('mesh progress limits reject unknown stages, excessive ranges and unbounded host callbacks', { timeout: 15000 }, async (t) => {
  for (const invalid of [{ stage: 'script', total: 1, loaded: 0 }, { stage: 'shape', total: 262145, loaded: 1 },
    { stage: 'shape', total: 10, loaded: 11 }, { stage: 'shape', total: 10, loaded: NaN }]) assert.throws(() => meshProgress(invalid));
  const [requester, host] = await fixture(t);
  host.state = { ...empty(), hostedModels: [model] };
  host.run = async (input) => {
    for (let i = 0; i < 33; i++) input.onProgress({ type: 'mesh-generation', stage: 'shape', loaded: i, total: 33 });
    return { text: '', mesh };
  };
  await requester.service.refresh();
  await assert.rejects(requester.service.generate(manifestCid, { task: 'image-to-3d', image }),
    (error) => error.committed === true && /generation progress/u.test(error.message));
});

test('a genuine v4-only node does not advertise or execute mesh work', { timeout: 15000 }, async (t) => {
  const [requester, host] = await fixture(t);
  host.state = { ...empty(), sharedModels: [model], hostedModels: [model], hostedModel: model };
  await host.node.unhandle(CURRENT);
  const directory = await requester.service.refresh(); assert.deepEqual(directory.hosts, []); assert.deepEqual(directory.models, []);
  await assert.rejects(requester.service.generate(manifestCid, { task: 'image-to-3d', image }), /No remote peer/u);
  const signal = AbortSignal.timeout(3000), stream = await requester.node.getConnections()[0].newStream(V4), io = channel(stream);
  await io.write(requester.service._envelope('generate', host.node.peerId.toString(), {
    task: 'image-to-3d', requestId: 'legacy-mesh', manifestCid, image: { width: 2, height: 1, channels: 4 } }), signal);
  const reply = await io.read(signal); assert.equal(reply.type, 'error'); assert.match(reply.message, /protocol v5/u);
  await stream.close({ signal }); assert.equal(host.received.length, 0);
});

test('a malformed generated mesh fails on the host after commitment without another execution', { timeout: 15000 }, async (t) => {
  const [requester, host, fallback] = await fixture(t, 3);
  host.state = { ...empty(), hostedModels: [{ ...model, idleForMs: 100 }] };
  fallback.state = { ...empty(), hostedModels: [model] };
  host.run = async (input) => { host.received.push(input); return { text: '', mesh: { ...mesh, data: new Uint8Array(mesh.byteLength) } }; };
  await requester.service.refresh();
  await assert.rejects(requester.service.generate(manifestCid, { task: 'image-to-3d', image }),
    (error) => error.committed === true && /GLB header/u.test(error.message));
  assert.equal(host.received.length, 1); assert.equal(fallback.received.length, 0);
});

test('malicious mesh wire bytes, excessive lengths and changed completion metadata fail without replay', { timeout: 15000 }, async (t) => {
  for (const attack of ['digest', 'oversized', 'truncated', 'completion']) await t.test(attack, async (t) => {
    const [requester, host, fallback] = await fixture(t, 3);
    host.state = { ...empty(), hostedModels: [{ ...model, idleForMs: 100 }] };
    fallback.state = { ...empty(), hostedModels: [model] };
    await requester.service.refresh(); await host.node.unhandle(CURRENT);
    let executions = 0;
    await host.node.handle(CURRENT, (stream) => { void (async () => {
      const io = channel(stream), signal = AbortSignal.timeout(3000);
      try {
        const input = await io.read(signal), requestId = input.requestId;
        await io.write({ type: 'upload', requestId }, signal);
        const uploaded = await io.rpc.read({ signal });
        await io.write({ type: 'image-credit', offset: uploaded.byteLength }, signal);
        await io.write({ type: 'accepted', requestId }, signal);
        assert.equal((await io.read(signal)).type, 'start'); executions++;
        const metadata = { ...normalizeGeneratedMeshDescriptor(mesh),
          ...(attack === 'oversized' ? { byteLength: GENERATED_MESH_LIMITS.byteLength + 1 } : {}),
          ...(attack === 'digest' ? { sha256: '0'.repeat(64) } : {}) };
        await io.write({ type: 'result-mesh', requestId, mesh: metadata }, signal);
        assert.equal((await io.read(signal)).offset, 0);
        for (let offset = 0; offset < mesh.byteLength;) {
          const end = Math.min(offset + LIMITS.imageChunkBytes, mesh.byteLength);
          await io.rpc.write(mesh.data.subarray(offset, end), { signal });
          if (attack === 'truncated') { stream.abort(new Error('Injected provider loss')); return; }
          assert.equal((await io.read(signal)).offset, end); offset = end;
        }
        await io.write({ type: 'done', requestId, result: { text: '', mesh: { ...metadata, triangleCount: metadata.triangleCount + 1 } } }, signal);
        await stream.close({ signal });
      } catch (error) { stream.abort(error); }
    })(); });
    await assert.rejects(requester.service.generate(manifestCid, { task: 'image-to-3d', image }),
      (error) => error.committed === true);
    assert.equal(executions, 1); assert.equal(fallback.received.length, 0); assert.equal(requester.service.outbound.size, 0);
  });
});

test('cancelling a committed mesh generation releases the host and never retries on another peer', { timeout: 15000 }, async (t) => {
  const [requester, host, fallback] = await fixture(t, 3);
  host.state = { ...empty(), hostedModels: [{ ...model, idleForMs: 100 }] };
  fallback.state = { ...empty(), hostedModels: [model] };
  let cancelled = false;
  host.run = async (input) => {
    host.received.push(input);
    input.onProgress({ type: 'mesh-generation', stage: 'shape', loaded: 32768, total: 262144 });
    await new Promise((resolve) => input.signal.addEventListener('abort', () => { cancelled = true; resolve(); }, { once: true }));
    throw input.signal.reason;
  };
  await requester.service.refresh(); const controller = new AbortController();
  const pending = requester.service.generate(manifestCid, { task: 'image-to-3d', image, signal: controller.signal,
    onProgress: (event) => { if (event.type === 'mesh-generation') controller.abort(); } });
  const rejected = assert.rejects(pending, (error) => error.committed === true && error.remoteCleanupAcknowledged === false);
  await rejected;
  await until(() => cancelled && host.service.inbound.size === 0);
  assert.equal(fallback.received.length, 0); assert.equal(requester.service.outbound.size, 0);
});
