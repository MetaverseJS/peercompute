import test from 'node:test';
import assert from 'node:assert/strict';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';
import { PEER_INFERENCE_PROTOCOL as CURRENT, PEER_INFERENCE_PROTOCOL_V4 as V4, PEER_INFERENCE_PROTOCOL_V3 as V3, PEER_INFERENCE_PROTOCOL_V2 as V2,
  channel, generation, localState } from '../../src/peercompute/networkManager/inference/protocol.js';
import { describeAudio } from '../../src/peercompute/networkManager/inference/audioFrames.js';

const model = { manifestCid: 'bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou',
  modelId: 'unified', name: 'Unified fixture', task: 'text-generation', modalities: ['text', 'image', 'audio'],
  outputModalities: ['text'], runtime: 'test-only-injected-service', repository: 'fixture/unified', revision: 'a'.repeat(40), totalBytes: 1 };
const pcm = Float32Array.from({ length: 32000 }, (_, i) => Math.sin(i / 33) * 0.2);
const image = { width: 2, height: 1, channels: 4, data: new Uint8Array([255, 0, 0, 255, 0, 0, 255, 255]) };
const empty = () => ({ sharedModels: [], hostedModels: [], hostedModel: null, busy: false, idleForMs: 0 });
async function fixture(t, count = 2) {
  const entries = [];
  t.after(async () => {
    await Promise.allSettled(entries.map((entry) => entry.manager._stopPeerInferenceService()));
    await Promise.allSettled(entries.map((entry) => entry.node.stop()));
  });
  for (let i = 0; i < count; i++) {
    const node = await createLibp2p({ addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] }, transports: [webSockets()],
      connectionEncrypters: [noise()], streamMuxers: [yamux()], services: { identify: identify() } });
    const manager = new NetworkManager({ bootstrapPeers: [], gameId: 'media-test', roomId: 'private', topologyId: 'mesh' });
    manager.libp2p = node; manager.isConnected = true;
    manager.sendToPeer = () => { throw new Error('Media and prompts must not enter pubsub'); };
    const entry = { node, manager, state: empty(), received: [] };
    entry.run = async (input) => { entry.received.push(input); return { text: input.messages.at(-1).content }; };
    entries.push(entry);
    entry.service = await manager.createPeerInferenceService({ owner: Symbol('media-owner'), getLocalState: () => entry.state,
      generate: (input) => entry.run(input), queryTimeoutMs: 1000, requestTimeoutMs: 4000 });
  }
  for (const entry of entries.slice(1)) await entries[0].node.dial(entry.node.getMultiaddrs());
  return entries;
}

test('native audio schema preserves messages, bounded PCM and optional image without weakening ASR', () => {
  const input = { requestId: 'native', manifestCid: model.manifestCid, task: 'audio-text-to-text',
    messages: [{ role: 'system', content: 'Listen carefully.' }, { role: 'user', content: 'Compare sound and picture.' }],
    audio: { samples: pcm, sampleRate: 16000 }, image, maxNewTokens: 100 };
  const normalized = generation(input, { imageBytes: true });
  assert.deepEqual(normalized.messages, input.messages);
  assert.deepEqual(normalized.audio.samples, pcm); assert.notEqual(normalized.audio.samples, pcm);
  assert.deepEqual(normalized.image.data, image.data); assert.notEqual(normalized.image.data, image.data);
  assert.throws(() => generation({ ...input, audio: undefined }, { imageBytes: true }), /requires audio/);
  assert.throws(() => generation({ ...input, task: 'automatic-speech-recognition' }, { imageBytes: true }), /ASR accepts audio only/);
  assert.throws(() => generation({ ...input, task: 'text-generation' }, { imageBytes: true }), /Only ASR or native/);
  assert.throws(() => generation({ ...input, audio: { samples: new Float32Array(16001 * 20), sampleRate: 16000 } }, { imageBytes: true }));
  const promptless = generation({ ...input, messages: undefined, image: undefined }, { imageBytes: true });
  assert.equal(promptless.messages[0].content, 'Transcribe this audio.');
});

test('legacy directories retain Gemma text hosting without advertising new native-media operations', () => {
  const state = { ...empty(), sharedModels: [model], hostedModels: [model], hostedModel: model };
  assert.deepEqual(localState(state).hostedModels[0].modalities, ['text', 'image', 'audio']);
  for (const protocol of [V3, V2]) {
    const projected = localState(state, true, { protocol });
    assert.deepEqual(projected.sharedModels[0].modalities, ['text']);
    assert.equal(projected.hostedModel.manifestCid, model.manifestCid);
    assert.deepEqual(projected.hostedModel.modalities, ['text']);
    if (protocol === V3) assert.equal(projected.hostedModels.length, 1);
    else assert.equal(projected.hostedModels, undefined);
  }
});

test('real Noise peers preserve operation and each new prompt, image and audio on the same model', { timeout: 15000 }, async (t) => {
  const [requester, host] = await fixture(t);
  host.state = { ...empty(), sharedModels: [model], hostedModels: [model] };
  await requester.service.refresh();
  const first = await requester.service.generate(model.manifestCid, { task: 'image-text-to-text', prompt: 'First picture', image });
  assert.equal(first.protocol, CURRENT); assert.equal(first.text, 'First picture');
  const nextImage = { ...image, data: new Uint8Array([0, 255, 0, 255, 255, 255, 0, 255]) };
  const nextAudio = Float32Array.from(pcm, (value) => -value);
  const result = await requester.service.generate(model.manifestCid, { task: 'audio-text-to-text',
    messages: [{ role: 'system', content: 'New request.' }, { role: 'user', content: 'Second media question' }],
    image: nextImage, audio: { samples: nextAudio, sampleRate: 16000 } });
  assert.equal(result.text, 'Second media question'); assert.equal(result.connectionEncryption, '/noise');
  assert.equal(host.received[0].task, 'image-text-to-text'); assert.equal(host.received[1].task, 'audio-text-to-text');
  assert.deepEqual(host.received[0].image.data, image.data); assert.deepEqual(host.received[1].image.data, nextImage.data);
  assert.deepEqual(host.received[1].audio.samples, nextAudio); assert.equal(host.received[0].audio, undefined);
  assert.notEqual(host.received[0].requestId, host.received[1].requestId);
  const third = await requester.service.generate(model.manifestCid, { task: 'text-generation', prompt: 'Third text question' });
  assert.equal(third.text, 'Third text question'); assert.equal(host.received[2].image, undefined); assert.equal(host.received[2].audio, undefined);
});

test('a genuine v3-only host stays usable for text and legacy vision operations', { timeout: 15000 }, async (t) => {
  const [requester, host] = await fixture(t);
  const vision = { ...model, task: 'image-text-to-text', modalities: ['text', 'image'] };
  host.state = { ...empty(), sharedModels: [vision], hostedModels: [vision], hostedModel: vision };
  await host.node.unhandle(CURRENT);
  await host.node.unhandle(V4);
  const directory = await requester.service.refresh();
  assert.equal(directory.hosts[0].hosts[0].protocol, V3);
  const result = await requester.service.generate(model.manifestCid, { task: 'text-generation', prompt: 'Legacy text question' });
  assert.equal(result.protocol, V3); assert.equal(result.text, 'Legacy text question');
  assert.equal(host.received[0].task, 'image-text-to-text', 'wire request uses the legacy primary task');
  const visual = await requester.service.generate(model.manifestCid, { task: 'image-text-to-text', prompt: 'Legacy image question', image });
  assert.equal(visual.protocol, V3); assert.deepEqual(host.received[1].image.data, image.data);
});

test('same-CID legacy host cannot hide a capable v4 host or receive its media', { timeout: 15000 }, async (t) => {
  const [requester, legacy, modern] = await fixture(t, 3);
  for (const host of [legacy, modern]) host.state = { ...empty(), sharedModels: [model], hostedModels: [{ ...model, idleForMs: host === legacy ? 1000 : 1 }], hostedModel: model };
  await legacy.node.unhandle(CURRENT);
  await legacy.node.unhandle(V4);
  await modern.node.unhandle(CURRENT); // Exercise a genuine v4 host, not the current version alias.
  await requester.service.refresh();
  const group = requester.service.listHosts()[0];
  assert.deepEqual(group.modalities, ['text', 'image', 'audio']);
  assert.equal(group.hosts.length, 2);
  assert.deepEqual(group.hosts.find((entry) => entry.peerId === legacy.node.peerId.toString()).modalities, ['text']);
  const result = await requester.service.generate(model.manifestCid, { task: 'audio-text-to-text', prompt: 'Listen to this.', audio: { samples: pcm, sampleRate: 16000 } });
  assert.equal(result.peerId, modern.node.peerId.toString()); assert.equal(modern.received.length, 1); assert.equal(legacy.received.length, 0);
  const text = await requester.service.generate(model.manifestCid, { task: 'text-generation', prompt: 'Text remains available.' });
  assert.equal(text.peerId, legacy.node.peerId.toString()); assert.equal(text.protocol, V3);
  assert.equal(legacy.received[0].messages[0].content, 'Text remains available.');
});

test('standalone speech remains available over a genuine v3-only host', { timeout: 15000 }, async (t) => {
  const [requester, host] = await fixture(t);
  const asr = { ...model, task: 'automatic-speech-recognition', modalities: ['audio'] };
  host.state = { ...empty(), sharedModels: [asr], hostedModels: [asr] };
  host.run = async (input) => { host.received.push(input); return { text: 'Legacy transcript.' }; };
  await host.node.unhandle(CURRENT);
  await host.node.unhandle(V4);
  await requester.service.refresh();
  const result = await requester.service.generate(model.manifestCid, { task: 'automatic-speech-recognition', audio: { samples: pcm, sampleRate: 16000 } });
  assert.equal(result.protocol, V3); assert.equal(result.text, 'Legacy transcript.');
  assert.deepEqual(host.received[0].audio.samples, pcm); assert.equal(host.received[0].messages, undefined);
});

test('combined-media and old-protocol requests reject unsupported host before upload', { timeout: 15000 }, async (t) => {
  const [requester, host] = await fixture(t);
  host.state = { ...empty(), hostedModels: [{ ...model, modalities: ['text', 'audio'] }], hostedModel: model };
  const connection = requester.node.getConnections()[0];
  for (const protocol of [CURRENT, V4, V3]) {
    const signal = AbortSignal.timeout(3000), stream = await connection.newStream(protocol), io = channel(stream);
    await io.write(requester.service._envelope('generate', host.node.peerId.toString(), {
      requestId: `unsupported-${protocol.at(-5)}`, manifestCid: model.manifestCid, task: 'audio-text-to-text', prompt: 'Compare them.',
      image: { width: 2, height: 1, channels: 4 }, audio: describeAudio(pcm, 16000, { input: true }) }), signal);
    const response = await io.read(signal); assert.equal(response.type, 'error');
    assert.match(response.message, /media|protocol v4/); await stream.close({ signal });
  }
  assert.equal(host.received.length, 0);
});

test('genuine v4 native host preserves both vision and audio after v5 mesh introduction', { timeout: 15000 }, async (t) => {
  const [requester, host] = await fixture(t);
  host.state = { ...empty(), sharedModels: [model], hostedModels: [model] };
  await host.node.unhandle(CURRENT);
  const directory = await requester.service.refresh();
  assert.equal(directory.hosts[0].hosts[0].protocol, V4);
  assert.deepEqual(directory.hosts[0].modalities, ['text', 'image', 'audio']);
  const visual = await requester.service.generate(model.manifestCid, { task: 'image-text-to-text', prompt: 'Actual v4 image', image });
  assert.equal(visual.protocol, V4); assert.equal(visual.text, 'Actual v4 image');
  const audio = await requester.service.generate(model.manifestCid, { task: 'audio-text-to-text', prompt: 'Actual v4 audio',
    audio: { samples: pcm, sampleRate: 16000 } });
  assert.equal(audio.protocol, V4); assert.equal(audio.text, 'Actual v4 audio');
  assert.deepEqual(host.received[0].image.data, image.data); assert.deepEqual(host.received[1].audio.samples, pcm);
});
