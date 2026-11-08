import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { validateHubPackage, matchesHubPackage, verifyStoredHubPackage, reuseVerifiedHubFiles } from '../../../demos/inference/src/modelHubPackage.js';

function entry() {
  return { id: 'new-q4', name: 'New Qwen', repository: 'some-owner/New-Qwen', revision: 'b'.repeat(40),
    totalBytes: 28, license: 'apache-2.0',
    model: { runtime: 'transformers.js', runtimeVersion: '4.3.2', architecture: 'qwen2', task: 'text-generation',
      dtype: 'q4', repository: 'some-owner/New-Qwen', revision: 'b'.repeat(40), modalities: ['text'] },
    files: ['config.json', 'tokenizer.json', 'tokenizer_config.json', 'onnx/model_q4.onnx'].map((path) => ({ path, size: 7,
      ...(path.endsWith('.onnx') ? { sha256: 'a'.repeat(64) } : { gitBlobSha1: 'c'.repeat(40) }) })) };
}
test('Hub acquisition validates a complete pinned package without inventing persistent file identities', () => {
  const input = entry(), result = validateHubPackage(input);
  assert.equal(result.provenance.revision, input.revision);
  assert.deepEqual(result.files, input.files);
  assert(result.files.every((file) => !file.cid));
  assert.equal(result.files[0].sha256, undefined, 'Git blobs retain their real digest until imported');
  assert.equal(input.files[0].sha256, undefined, 'caller was not mutated');
});
test('Hub acquisition rejects moving refs, mismatched identity, traversal and unverifiable weights before fetch', () => {
  for (const mutate of [
    (value) => { value.revision = value.model.revision = 'main'; },
    (value) => { value.model.repository = 'other/model'; },
    (value) => { value.repository = value.model.repository = 'https://elsewhere.test/file'; },
    (value) => { value.files[0].path = '../config.json'; },
    (value) => { value.files[0].path = 'a%2fconfig.json'; },
    (value) => { delete value.files[3].sha256; value.files[3].gitBlobSha1 = 'a'.repeat(40); },
    (value) => { delete value.files[0].gitBlobSha1; },
    (value) => { value.totalBytes++; },
    (value) => { value.files[0].path = 'tokenizer.json'; },
    (value) => { value.model.architecture = 'custom_remote_code'; },
    (value) => { value.model.dtype = 'fp16'; },
  ]) {
    const input = entry(); mutate(input); assert.throws(() => validateHubPackage(input));
  }
});
test('package reuse depends on revision, precision and exact selected files rather than display name', () => {
  const input = entry();
  const saved = { model: structuredClone(input.model), files: input.files.map((file) => ({ ...file, sha256: file.sha256 ?? 'd'.repeat(64) })) };
  assert.equal(matchesHubPackage(saved, input), true);
  for (const mutate of [
    (value) => { value.model.revision = 'c'.repeat(40); },
    (value) => { value.model.dtype = 'q8'; },
    (value) => { value.files.pop(); },
    (value) => { value.files[0].size++; },
    (value) => { value.files[3].sha256 = 'e'.repeat(64); },
  ]) { const next = structuredClone(saved); mutate(next); assert.equal(matchesHubPackage(next, input), false); }
});

test('stored reuse streams Git-only sidecars and rejects same-size substituted bytes or execution profiles', async () => {
  const input = entry(), bytes = new TextEncoder().encode('{"a":1}');
  const git = createHash('sha1').update('blob 7\0').update(bytes).digest('hex');
  for (const file of input.files.filter((item) => item.gitBlobSha1)) file.gitBlobSha1 = git;
  const saved = { model: structuredClone(input.model), files: input.files.map((file) => ({ ...file, cid: file.path,
    sha256: file.sha256 ?? createHash('sha256').update(bytes).digest('hex') })) };
  const reads = [];
  const store = { async *openRead(cid) { reads.push(cid); yield bytes.slice(0, 3); yield bytes.slice(3); } };
  assert.equal(await verifyStoredHubPackage(store, saved, input), true);
  assert.equal(reads.length, 3); assert(!reads.some((cid) => cid.endsWith('.onnx')), 'reuse does not re-read whole weight files');
  assert.equal(await verifyStoredHubPackage({ async *openRead() { yield new TextEncoder().encode('{"a":2}'); } }, saved, input), false);
  assert.equal(await verifyStoredHubPackage({ async *openRead() { yield bytes.slice(0, 2); } }, saved, input), false);
  const changed = structuredClone(saved); changed.model.requiredFeatures = ['shader-f16'];
  assert.equal(await verifyStoredHubPackage(store, changed, input), false);
  const controller = new AbortController(); controller.abort(new DOMException('Stop', 'AbortError'));
  await assert.rejects(verifyStoredHubPackage(store, saved, input, { signal: controller.signal }), { name: 'AbortError' });
});

test('a failed package reuse can retain exactly SHA-bound weights while fetching unverifiable sidecars', () => {
  const input = validateHubPackage(entry());
  const cid = 'bafkreihbwk7mfabwdamnmxyntvhqc6oc6xyzhz42tjkkx4uh4syxcwp5ou';
  const candidate = { files: input.files.map((file) => ({ ...file, cid, sha256: file.sha256 ?? 'f'.repeat(64) })) };
  const reused = reuseVerifiedHubFiles(input, candidate);
  assert.equal(reused.files.at(-1).cid, cid);
  assert(reused.files.slice(0, 3).every((file) => !file.cid));
  candidate.files.at(-1).sha256 = 'b'.repeat(64);
  assert(!reuseVerifiedHubFiles(input, candidate).files.at(-1).cid);
});
