import test from 'node:test';
import assert from 'node:assert/strict';
import { inflateSync } from 'node:zlib';
import { encodeGgufImage, encodeGgufAudio, encodeGgufMedia, projectGgufMedia } from '../../src/peercompute/inference/gguf/mediaInput.js';
import { createGgufEngine } from '../../src/peercompute/inference/gguf/engine.js';
import { glueSerialize, glueDeserialize } from '@wllama/wllama/peercompute-glue.js';

const image = (width = 2, height = 2) => ({ width, height, channels: 4,
  data: Uint8Array.from({ length: width * height * 4 }, (_, i) => i % 256) });
const audio = (length = 1600) => ({ samples: new Float32Array(length), sampleRate: 16000 });

test('RGBA PNG preserves pixels and dimensions across multiple DEFLATE blocks with valid chunk CRCs', () => {
  const input = image(201, 101), png = encodeGgufImage(input), view = new DataView(png.buffer);
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  const chunks = new Map();
  for (let at = 8; at < png.length;) {
    const size = view.getUint32(at), type = new TextDecoder().decode(png.subarray(at + 4, at + 8));
    let crc = 0xffffffff;
    for (const byte of png.subarray(at + 4, at + 8 + size)) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    assert.equal(view.getUint32(at + 8 + size), (crc ^ 0xffffffff) >>> 0);
    chunks.set(type, png.subarray(at + 8, at + 8 + size)); at += size + 12;
  }
  const header = new DataView(chunks.get('IHDR').buffer, chunks.get('IHDR').byteOffset);
  assert.equal(header.getUint32(0), 201); assert.equal(header.getUint32(4), 101);
  const raw = inflateSync(chunks.get('IDAT')), stride = input.width * 4;
  for (let row = 0; row < input.height; row++) {
    assert.equal(raw[row * (stride + 1)], 0);
    assert.deepEqual(new Uint8Array(raw.subarray(row * (stride + 1) + 1, (row + 1) * (stride + 1))),
      input.data.subarray(row * stride, (row + 1) * stride));
  }
});

test('PCM16 WAV preserves rate, duration and signed extremes within the twenty-second bound', () => {
  const input = audio(320000); input.samples.set([-1, -0.5, 0, 0.5, 1, 1.005]);
  const wav = encodeGgufAudio(input), view = new DataView(wav.buffer);
  assert.equal(wav.length, 640044); assert.equal(new TextDecoder().decode(wav.subarray(0, 4)), 'RIFF');
  assert.equal(view.getUint32(4, true), wav.length - 8); assert.equal(view.getUint32(24, true), 16000);
  assert.equal(view.getUint16(20, true), 1); assert.equal(view.getUint16(22, true), 1); assert.equal(view.getUint16(34, true), 16);
  assert.deepEqual(Array.from({ length: 6 }, (_, i) => view.getInt16(44 + i * 2, true)), [-32768, -16384, 0, 16384, 32767, 32767]);
  assert.throws(() => encodeGgufAudio(audio(320001)), /20 seconds/);
  const invalid = audio(); invalid.samples[0] = NaN;
  assert.throws(() => encodeGgufMedia({ image: image(), audio: invalid }), /PCM sample/);
  assert.throws(() => encodeGgufImage({ ...image(), data: new Uint8Array(3) }), /bounded RGBA/);
});

test('native media stays on the latest user turn across context projections and cannot reuse prior request media', () => {
  const messages = [{ role: 'system', content: 'Help.' }, { role: 'user', content: 'Old' },
    { role: 'assistant', content: 'Old reply' }, { role: 'user', content: 'Compare this image and audio.' }];
  const files = encodeGgufMedia({ image: image(), audio: audio() }), marker = '<__media_test__>';
  for (const projection of [messages, [messages[0], messages[3]]]) {
    const result = projectGgufMedia(projection, files, marker);
    assert.equal(result.files, files); assert.deepEqual(result.messages.at(-1).content.map((part) => part.text),
      ['Compare this image and audio.', marker, marker]);
    assert.equal(messages.at(-1).content, 'Compare this image and audio.');
  }
  assert.deepEqual(projectGgufMedia([{ role: 'user', content: 'New text only' }], [], marker).files, []);
  assert.throws(() => projectGgufMedia([{ role: 'user', content: marker }], [], marker), /reserved/);
  assert.throws(() => projectGgufMedia([{ role: 'assistant', content: 'No user' }], files, marker), /current user/);
});

async function engineFixture() {
  const calls = [], mounts = [], reads = [];
  let allocated = 0, overflow = false, nativeReader;
  const memory = new ArrayBuffer(8 * 1024 ** 2), outputPointer = 7 * 1024 ** 2;
  const engine = await createGgufEngine({ wasmUrl: 'https://test.local/wllama.wasm',
    weights: [{ path: 'text.gguf', size: 8 }], projector: { path: 'projector.gguf', size: 4 },
    reader: { async read(path, offset, length) { reads.push({ path, offset, length }); return new Uint8Array(length).fill(7); } },
    initialize(module, read) {
      nativeReader = read;
      Object.assign(module, { wasmMemory: { buffer: memory },
        FS: { mkdir() {}, mount() {} }, FS_createDataFile(directory, name) { mounts.push(name); },
        MEMFS: { stream_ops: { read() {}, llseek() {}, mmap() {} }, ops_table: { file: { stream: {} } } },
        cwrap(name) {
          if (name === 'wllama_start') return async () => '{"success":true}';
          if (name === 'wllama_malloc') return (size) => { allocated = Number(size); return 8n; };
          return async (action, pointer) => {
            calls.push({ action, body: glueDeserialize(new Uint8Array(memory, Number(pointer), allocated).slice()) });
            const response = glueSerialize(action === 'completion'
              ? { _name: 'cmpl_res', success: true, req_id: 1 } : { _name: 'cncl_res', success: true });
            new Uint8Array(memory).set(response, outputPointer);
            new DataView(memory).setUint32(Number(pointer), overflow ? 1024 ** 2 + 1 : response.length, true);
            return BigInt(outputPointer);
          };
        },
      });
      module.peercomputeOnDevice({ features: new Set(['shader-f16']), lost: new Promise(() => {}),
        queue: { async onSubmittedWorkDone() {} }, destroy() {} });
      module.onRuntimeInitialized();
    },
  });
  return { engine, calls, mounts, reads, nativeReader, overflow() { overflow = true; } };
}

test('native bridge mounts projector independently and accepts bounded media without raising response limits', async () => {
  const f = await engineFixture();
  try {
    assert.equal(f.engine.files.length, 1); assert.equal(f.engine.projectorFile.name, 'mmproj.gguf');
    assert.deepEqual(f.mounts, ['model-00001-of-00001.gguf', 'mmproj.gguf']);
    await f.nativeReader('/models/mmproj.gguf', 0, 4, 8);
    assert.deepEqual(f.reads, [{ path: 'projector.gguf', offset: 0, length: 4 }]);
    const input = { _name: 'cmpl_req', is_chat: true, data_json: '{"messages":[]}', files: [new Uint8Array(2 * 1024 ** 2)] };
    assert.equal((await f.engine.action('completion', input)).success, true);
    assert.equal(f.calls[0].body.files[0].length, 2 * 1024 ** 2);
    await assert.rejects(f.engine.action('completion', { ...input, files: [new Uint8Array(7 * 1024 ** 2)] }), /byte budget/);
    assert.equal((await f.engine.action('cancel', { _name: 'cncl_req', req_id: 1 })).success, true);
    f.overflow();
    await assert.rejects(f.engine.action('cancel', { _name: 'cncl_req', req_id: 1 }), /output buffer/);
    await assert.rejects(f.engine.action('cancel', { _name: 'cncl_req', req_id: 1 }), /session lost/);
  } finally { f.engine.close(); }
});
