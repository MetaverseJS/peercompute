import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from 'peercompute-artifact-noise';
import { yamux } from '@libp2p/yamux';
import { identify } from '@libp2p/identify';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { NetworkManager } from '../../src/peercompute/networkManager/NetworkManager.js';
import { PEER_INFERENCE_PROTOCOL as V3, PEER_INFERENCE_PROTOCOL_V2 as V2, channel, descriptor, generation,
  localState } from '../../src/peercompute/networkManager/inference/protocol.js';
import { AUDIO_LIMITS, describeAudio, audioMetadata } from '../../src/peercompute/networkManager/inference/audioFrames.js';

const models = await Promise.all(['text-generation', 'automatic-speech-recognition', 'text-to-speech'].map(async (task) => ({
  manifestCid: CID.createV1(0x55, await sha256.digest(new TextEncoder().encode(task))).toString(),
  modelId: task, name: task, task, runtime: 'test-only-injected-service', repository: 'fixture/audio', revision: 'a'.repeat(40), totalBytes: 1,
  modalities: task === 'automatic-speech-recognition' ? ['audio'] : ['text'],
  outputModalities: task === 'text-to-speech' ? ['audio'] : ['text'],
})));
const [textModel, asrModel, ttsModel] = models;
const pcm = Float32Array.from({ length: 32000 }, (_, i) => Math.sin(i / 33) * 0.2);
const empty = () => ({ sharedModels: [], hostedModels: [], hostedModel: null, busy: false, idleForMs: 0 });
async function until(check) {
  for (let i = 0; i < 200; i++) { if (check()) return; await delay(10); }
  throw new Error('Condition did not settle');
}
async function fixture(t, count = 2) {
  const entries = [];
  t.after(async () => {
    await Promise.allSettled(entries.map((entry) => entry.manager._stopPeerInferenceService()));
    await Promise.allSettled(entries.map((entry) => entry.node.stop()));
  });
  for (let i = 0; i < count; i++) {
    const node = await createLibp2p({ addresses: { listen: ['/ip4/127.0.0.1/tcp/0/ws'] }, transports: [webSockets()],
      connectionEncrypters: [noise()], streamMuxers: [yamux()], services: { identify: identify() } });
    const manager = new NetworkManager({ bootstrapPeers: [], gameId: 'audio-test', roomId: 'private', topologyId: 'mesh' });
    manager.libp2p = node; manager.isConnected = true;
    manager.sendToPeer = () => { throw new Error('Audio and prompts must not enter pubsub'); };
    const entry = { node, manager, owner: Symbol('owner'), state: empty(), received: [] };
    entry.run = async (input) => { entry.received.push(input); return { text: 'Hello' }; };
    entries.push(entry);
    entry.service = await manager.createPeerInferenceService({ owner: entry.owner, getLocalState: () => entry.state,
      generate: (input) => entry.run(input), queryTimeoutMs: 1000, requestTimeoutMs: 4000 });
  }
  for (const entry of entries.slice(1)) await entries[0].node.dial(entry.node.getMultiaddrs());
  return entries;
}

test('audio schemas bound metadata, duration, finite PCM and exact task directions', () => {
  assert.equal(descriptor(asrModel).outputModalities[0], 'text');
  assert.equal(descriptor(ttsModel).outputModalities[0], 'audio');
  assert.throws(() => descriptor({ ...asrModel, modalities: ['text'] }));
  const input = { requestId: 'asr', manifestCid: asrModel.manifestCid, task: asrModel.task, audio: { samples: pcm, sampleRate: 16000 } };
  const normalized = generation(input, { imageBytes: true });
  assert.notEqual(normalized.audio.samples, pcm); assert.equal(normalized.audio.sampleCount, pcm.length);
  assert.throws(() => generation({ ...input, prompt: 'Not allowed' }, { imageBytes: true }));
  assert.throws(() => generation({ ...input, audio: { samples: new Float32Array([NaN]), sampleRate: 16000 } }, { imageBytes: true }));
  assert.throws(() => audioMetadata({ ...describeAudio(pcm, 16000), sampleCount: 16000 * 21 }, { input: true }));
  assert.throws(() => audioMetadata({ ...describeAudio(pcm, 16000), sampleCount: Number.MAX_SAFE_INTEGER }));
  assert.throws(() => generation({ requestId: 'tts', manifestCid: ttsModel.manifestCid, task: ttsModel.task, prompt: 'x'.repeat(257) }));
  assert.throws(() => localState({ ...empty(), hostedModels: [asrModel, asrModel] }));
});

test('one real Noise peer advertises multiple independent models and transfers ASR input and TTS output exactly', { timeout: 15000 }, async (t) => {
  const [requester, host] = await fixture(t);
  host.state = { ...empty(), sharedModels: models, hostedModel: textModel,
    hostedModels: models.map((model) => ({ ...model, busy: model === textModel, queuedRequests: model === textModel ? 1 : 0, idleForMs: 20 })) };
  host.run = async (input) => {
    host.received.push(input);
    if (input.task === asrModel.task) { assert.deepEqual(input.audio.samples, pcm); assert.equal(input.audio.sampleRate, 16000); return { text: 'The fixture is audible.' }; }
    if (input.task === ttsModel.task) { assert.equal(input.prompt, 'Speak this fixture.'); return { audio: pcm, sampleRate: 24000 }; }
    return { text: 'Text remains supported.' };
  };
  const directory = await requester.service.refresh(); assert.equal(directory.hosts.length, 3);
  assert.equal(directory.hosts.find((entry) => entry.task === textModel.task).hosts[0].busy, true);
  assert.equal(directory.hosts.find((entry) => entry.task === asrModel.task).hosts[0].busy, false);
  const asr = await requester.service.generate(asrModel.manifestCid, { task: asrModel.task, audio: { samples: pcm, sampleRate: 16000 } });
  assert.equal(asr.text, 'The fixture is audible.'); assert.equal(asr.protocol, V3); assert.equal(asr.connectionEncryption, '/noise');
  const tts = await requester.service.generate(ttsModel.manifestCid, { task: ttsModel.task, prompt: 'Speak this fixture.' });
  assert.deepEqual(tts.audio, pcm); assert.equal(tts.sampleRate, 24000); assert.equal(tts.peerId, host.node.peerId.toString());
  assert.equal(host.received.length, 2); assert.equal(requester.service.outbound.size, 0);
  assert.equal(pcm.length * 4 > AUDIO_LIMITS.chunkBytes, true, 'Transfer spans multiple credited frames');
});

test('v3 client negotiates a genuine v2-only stream and v2 requestors see only legacy compatible hosting', { timeout: 15000 }, async (t) => {
  const [requester, host] = await fixture(t);
  host.state = { ...empty(), sharedModels: models, hostedModel: textModel, hostedModels: models };
  await host.node.unhandle(V3);
  const directory = await requester.service.refresh();
  assert.equal(directory.hosts.length, 1); assert.equal(directory.models.length, 1);
  assert.equal(directory.hosts[0].hosts[0].protocol, V2);
  const answer = await requester.service.generate(textModel.manifestCid, { prompt: 'Legacy request' });
  assert.equal(answer.protocol, V2); assert.equal(answer.text, 'Hello');
  await assert.rejects(requester.service.generate(asrModel.manifestCid, { task: asrModel.task, audio: { samples: pcm, sampleRate: 16000 } }), /No remote peer/);
  // A v2-only client talks to the new host handler using unchanged v2 frames.
  const connection = requester.node.getConnections()[0], signal = AbortSignal.timeout(3000);
  const stream = await connection.newStream(V2), io = channel(stream);
  await io.write(requester.service._envelope('query', host.node.peerId.toString()), signal);
  const state = (await io.read(signal)).state;
  assert.equal(state.hostedModels, undefined); assert.equal(state.hostedModel.manifestCid, textModel.manifestCid);
  assert(state.sharedModels.every((entry) => entry.task === textModel.task)); await stream.close({ signal });
  const run = await connection.newStream(V2), rpc = channel(run);
  await rpc.write(requester.service._envelope('generate', host.node.peerId.toString(), {
    requestId: 'legacy-raw', manifestCid: textModel.manifestCid, prompt: 'Unchanged raw v2 client', maxNewTokens: 32 }), signal);
  assert.equal((await rpc.read(signal)).type, 'upload'); assert.equal((await rpc.read(signal)).type, 'accepted');
  await rpc.write({ type: 'start', requestId: 'legacy-raw' }, signal);
  assert.equal((await rpc.read(signal)).result.text, 'Hello'); await run.close({ signal });
  assert.equal(host.received.length, 2);
});

test('incorrect audio digest and non-finite PCM never reach the host callback', { timeout: 15000 }, async (t) => {
  const [requester, host] = await fixture(t);
  host.state = { ...empty(), hostedModels: [asrModel] };
  const data = new Float32Array(1600), good = describeAudio(data, 16000, { input: true });
  for (const invalidSample of [false, true]) {
    const signal = AbortSignal.timeout(3000), stream = await requester.node.getConnections()[0].newStream(V3), io = channel(stream);
    const metadata = invalidSample ? good : { ...good, sha256: '0'.repeat(64) };
    await io.write(requester.service._envelope('generate', host.node.peerId.toString(), {
      requestId: `invalid-${invalidSample}`, manifestCid: asrModel.manifestCid, task: asrModel.task, audio: metadata }), signal);
    assert.equal((await io.read(signal)).type, 'upload');
    const bytes = new Uint8Array(data.byteLength); if (invalidSample) new DataView(bytes.buffer).setFloat32(0, NaN, true);
    await io.rpc.write(bytes, { signal });
    const error = await io.read(signal); assert.equal(error.type, 'error'); assert.match(error.message, /digest|PCM/);
    await stream.close({ signal });
  }
  assert.equal(host.received.length, 0); await until(() => host.service.inbound.size === 0);
});

test('unloading one CID cancels its paused audio upload without disabling other hosted models', { timeout: 15000 }, async (t) => {
  const [requester, host] = await fixture(t);
  host.state = { ...empty(), hostedModels: [asrModel, ttsModel] };
  host.run = async (input) => { host.received.push(input); return { audio: pcm, sampleRate: 24000 }; };
  const signal = AbortSignal.timeout(3000), stream = await requester.node.getConnections()[0].newStream(V3), io = channel(stream);
  await io.write(requester.service._envelope('generate', host.node.peerId.toString(), { requestId: 'paused-upload',
    manifestCid: asrModel.manifestCid, task: asrModel.task, audio: describeAudio(pcm, 16000, { input: true }) }), signal);
  assert.equal((await io.read(signal)).type, 'upload');
  assert.equal(host.service.inbound.size, 1);
  host.state.hostedModels = [ttsModel];
  assert.equal(await host.service.cancelHostedModel(asrModel.manifestCid), 1);
  assert.equal(host.service.inbound.size, 0); assert.equal(host.received.length, 0);
  await assert.rejects(io.read(signal));
  assert.equal(host.service.hostingEnabled, true);
  await requester.service.refresh();
  const result = await requester.service.generate(ttsModel.manifestCid, { task: ttsModel.task, prompt: 'Still hosted.' });
  assert.deepEqual(result.audio, pcm); assert.equal(host.received.length, 1);
});

test('audio cancellation after commitment reports unacknowledged remote cleanup and never reroutes', { timeout: 15000 }, async (t) => {
  const [requester, first, other] = await fixture(t, 3);
  first.state = { ...empty(), hostedModels: [{ ...asrModel, idleForMs: 100 }] };
  other.state = { ...empty(), hostedModels: [asrModel] };
  let started, aborted = false, cleaned = false;
  const ready = new Promise((resolve) => { started = resolve; });
  first.run = async (input) => {
    first.received.push(input); started();
    await new Promise((resolve) => { input.signal.addEventListener('abort', () => { aborted = true; resolve(); }, { once: true }); });
    await delay(25); cleaned = true; throw input.signal.reason;
  };
  await requester.service.refresh(); const controller = new AbortController();
  const pending = requester.service.generate(asrModel.manifestCid, { task: asrModel.task,
    audio: { samples: pcm, sampleRate: 16000 }, signal: controller.signal });
  const rejected = assert.rejects(pending, (error) => error.committed === true && error.remoteCleanupAcknowledged === false);
  await ready; controller.abort(); await rejected;
  await until(() => aborted && cleaned && first.service.inbound.size === 0);
  assert.equal(first.received.length, 1); assert.equal(other.received.length, 0);
});

test('corrupted synthesized PCM fails after commitment without running another provider', { timeout: 15000 }, async (t) => {
  const [requester, first, other] = await fixture(t, 3);
  first.state = { ...empty(), hostedModels: [{ ...ttsModel, idleForMs: 100 }] };
  other.state = { ...empty(), hostedModels: [ttsModel] };
  await requester.service.refresh();
  await first.node.unhandle(V3);
  let executions = 0;
  await first.node.handle(V3, (stream) => {
    void (async () => {
      const io = channel(stream), signal = AbortSignal.timeout(3000);
      try {
        const input = await io.read(signal);
        await io.write({ type: 'upload', requestId: input.requestId }, signal);
        await io.write({ type: 'accepted', requestId: input.requestId }, signal);
        assert.equal((await io.read(signal)).type, 'start'); executions++;
        const samples = new Float32Array(1600), metadata = { ...describeAudio(samples, 24000), sha256: '0'.repeat(64) };
        await io.write({ type: 'result-audio', requestId: input.requestId, audio: metadata }, signal);
        assert.equal((await io.read(signal)).offset, 0);
        await io.rpc.write(new Uint8Array(samples.buffer), { signal });
        await io.read(signal);
      } catch (error) { stream.abort(error); }
    })();
  });
  await assert.rejects(requester.service.generate(ttsModel.manifestCid, { task: ttsModel.task, prompt: 'Test a finite reply.' }),
    (error) => error.committed === true && /digest mismatch/.test(error.message));
  assert.equal(executions, 1); assert.equal(other.received.length, 0);
});
