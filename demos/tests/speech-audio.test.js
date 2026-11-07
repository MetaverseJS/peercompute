import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorldAudio } from '../shared/agents/speech/WorldAudio.js';
function setup({ permission } = {}) {
  const nodes = [], sources = [], positions = []; let stopped = 0, context;
  const node = () => ({ connect() {}, disconnect() {} });
  class Context {
    constructor() { context = this; this.destination = {}; this.listener = { setPosition(...p) { positions.push(p); }, setOrientation() {} }; this.audioWorklet = { addModule: async () => {} }; }
    async resume() {} async close() { this.closed = true; }
    createMediaStreamSource() { return node(); }
    createGain() { return { ...node(), gain: {} }; }
    createBuffer(channels, length, rate) { return { copyToChannel() {}, length, rate }; }
    createBufferSource() { const source = { ...node(), start() {}, stop() {} }; sources.push(source); return source; }
    createPanner() { return { ...node(), setPosition(...p) { positions.push(p); } }; }
  }
  class Worklet { constructor() { Object.assign(this, node()); this.port = { postMessage: () => this.port.onmessage?.({ data: { samples: new Float32Array(1600), sampleRate: 16000 } }) }; nodes.push(this); } }
  const stream = { getTracks: () => [{ stop() { stopped++; } }] };
  const audio = createWorldAudio({ AudioContextImpl: Context, AudioWorkletNodeImpl: Worklet,
    mediaDevices: { getUserMedia: () => permission ?? Promise.resolve(stream) }, getAudioPose: () => ({ source: [1, 2, 3], listener: [4, 5, 6] }) });
  return { audio, nodes, sources, positions, stream, get stopped() { return stopped; }, get context() { return context; } };
}
test('microphone stop is idempotent, bounds PCM and stops only owned tracks', async () => {
  const f = setup(); await f.audio.startRecording();
  const result = await f.audio.stopRecording(); assert.equal(result.samples.length, 1600); assert.equal(result.sampleRate, 16000);
  assert.equal(await f.audio.stopRecording(), result); assert.equal(f.stopped, 1); await f.audio.dispose();
});
test('cancel during permission prompt rejects promptly and closes late microphone grant', async () => {
  let grant; const permission = new Promise((resolve) => { grant = resolve; }); const f = setup({ permission });
  const starting = f.audio.startRecording(); await new Promise((resolve) => setImmediate(resolve));
  await f.audio.cancelRecording(); await assert.rejects(starting, { name: 'AbortError' });
  grant(f.stream); await new Promise((resolve) => setImmediate(resolve)); assert.equal(f.stopped, 1); await f.audio.dispose();
});
test('capture limit delivers one result and callback, and playback uses adapter pose with abort cleanup', async () => {
  const f = setup(); let limited = 0; await f.audio.startRecording({ onLimit: () => limited++ });
  f.nodes[0].port.onmessage({ data: { samples: new Float32Array(320000), sampleRate: 16000, limited: true } });
  assert.equal((await f.audio.stopRecording()).samples.length, 320000); assert.equal(limited, 1);
  const controller = new AbortController(); const playing = f.audio.play({ audio: new Float32Array(1600), sampleRate: 16000 }, { key: 'agent', signal: controller.signal });
  await new Promise((resolve) => setImmediate(resolve)); assert.deepEqual(f.positions, [[1, 2, 3], [4, 5, 6]]);
  controller.abort(); await assert.rejects(playing, { name: 'AbortError' }); await f.audio.dispose(); assert.equal(f.context.closed, true);
});
test('failed worklet releases microphone ownership and rejects the stopped recording', async () => {
  const f = setup(); await f.audio.startRecording(); f.nodes[0].onprocessorerror();
  await assert.rejects(f.audio.stopRecording(), /processing failed/);
  assert.equal(f.stopped, 1); await f.audio.dispose();
});
