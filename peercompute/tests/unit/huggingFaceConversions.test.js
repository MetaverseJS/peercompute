import test from 'node:test';
import assert from 'node:assert/strict';
import { createHuggingFaceClient } from '../../../demos/inference/src/huggingface/hubClient.js';
import { findHuggingFaceConversions } from '../../../demos/inference/src/huggingface/conversionFinder.js';

const source = 'publisher/Original', sourceRevision = 'a'.repeat(40), revision = 'b'.repeat(40);
const candidate = (id, options = {}) => ({ id, sha: revision, cardData: { base_model: source, base_model_relation: 'quantized', license: 'mit' },
  siblings: [{ rfilename: 'onnx/model_q4.onnx' }], pipeline_tag: 'text-generation', ...options });
function fixture(items) {
  const calls = [];
  const client = {
    async listDerivedModels(repository, options) { calls.push({ type: 'list', repository, options }); return { items }; },
    async getModel(repository, options) {
      calls.push({ type: 'info', repository, options });
      return repository === source ? { id: source, sha: sourceRevision } : items.find((item) => item?.id === repository);
    },
  };
  return { client, calls };
}

test('conversions require pinned publisher lineage and export files, never name or format tags alone', async () => {
  const data = fixture([
    null,
    candidate('exporter/Original-ONNX'),
    candidate('exporter/Original-GGUF', { siblings: [{ rfilename: 'model.gguf' }] }),
    candidate('unrelated/Original-ONNX', { cardData: { base_model: 'other/Original' } }),
    candidate('confusable/Original-ONNX', { cardData: { base_model: `${source}-clone` } }),
    candidate('unicode/Original-ONNX', { cardData: { base_model: 'publisher/Origina\u217c' } }),
    candidate('tags/Original-ONNX', { cardData: {}, tags: [`base_model:${source}`, 'onnx'] }),
    candidate('files/Original-ONNX', { siblings: [{ rfilename: 'model.safetensors' }], tags: ['onnx'] }),
    candidate('projector/Original-GGUF', { siblings: [{ rfilename: 'mmproj-model.gguf' }] }),
  ]);
  const result = await findHuggingFaceConversions(`https://huggingface.co/${source}/tree/${sourceRevision}`, data);
  assert.deepEqual(result.items.map((item) => item.repository), ['exporter/Original-ONNX', 'exporter/Original-GGUF']);
  assert.deepEqual(result.items[0].formats, ['ONNX']); assert.deepEqual(result.items[1].formats, ['GGUF']);
  assert.equal(result.sourceRevision, sourceRevision); assert.equal(data.calls[0].options.revision, sourceRevision);
  assert.ok(result.items.every((item) => item.revision === revision && item.evidence.revision === revision
    && item.requiresInspection && item.status === 'candidate' && !item.evidence.sourceRevisionVerified));
  assert.match(result.lineageNotice, /not proof of identical weights/);
  assert.ok(data.calls.filter((call) => call.type === 'info' && call.repository !== source).every((call) => call.options.revision === revision));
  assert.equal(data.calls.length, 4, 'only the source, listing, and two valid candidates need metadata requests');
});

test('candidate lineage and identity are checked again at the pinned revision', async () => {
  const data = fixture([candidate('exporter/changed'), candidate('exporter/moved'), candidate('exporter/valid')]);
  const original = data.client.getModel;
  data.client.getModel = async (repo, options) => {
    const info = await original(repo, options);
    if (repo.endsWith('/changed')) return { ...info, cardData: { base_model: 'other/model' } };
    if (repo.endsWith('/moved')) return { ...info, sha: 'c'.repeat(40) };
    return info;
  };
  const result = await findHuggingFaceConversions(source, data);
  assert.deepEqual(result.items.map((item) => item.repository), ['exporter/valid']);
  assert.match(result.warning, /pinned source lineage/); assert.match(result.warning, /identity changed/);
});

test('source revision mismatches reject before lineage discovery', async () => {
  const data = fixture([]);
  await assert.rejects(findHuggingFaceConversions(`https://huggingface.co/${source}/tree/${revision}`, data), /source revision/);
  assert.equal(data.calls.length, 1);
});

test('fine-tunes and merges remain distinct from quantized conversions', async () => {
  const data = fixture([
    candidate('exporter/finetune', { cardData: { base_model: source, base_model_relation: 'finetune' } }),
    candidate('exporter/merge', { cardData: { base_model: [source, 'other/model'], base_model_relation: 'merge' } }),
    candidate('exporter/inferred', { cardData: { base_model: [source] }, tags: [`base_model:quantized:${source}`] }),
    candidate('exporter/unknown', { cardData: { base_model: source } }),
  ]);
  const result = await findHuggingFaceConversions(source, data);
  assert.deepEqual(result.items.map((item) => item.relationship), ['finetune', 'merge', 'quantized', 'derived']);
});

test('candidate inspection is bounded in count and concurrency', async () => {
  const data = fixture(Array.from({ length: 20 }, (_, i) => candidate(`exporter/model-${i}`)));
  const original = data.client.getModel; let active = 0, peak = 0;
  data.client.getModel = async (repo, options) => {
    if (repo === source) return original(repo, options);
    peak = Math.max(peak, ++active); await new Promise((resolve) => setTimeout(resolve, 1));
    active -= 1; return original(repo, options);
  };
  const result = await findHuggingFaceConversions(source, data);
  assert.equal(result.items.length, 12); assert.equal(peak, 3); assert.match(result.warning, /bounded/);
});

test('aborted candidate inspection rejects rather than returning partial or cached success', async () => {
  const data = fixture([candidate('exporter/model')]); const controller = new AbortController();
  const original = data.client.getModel;
  data.client.getModel = async (repo, options) => {
    if (repo !== source) controller.abort();
    return original(repo, options);
  };
  await assert.rejects(findHuggingFaceConversions(source, { ...data, signal: controller.signal }), { name: 'AbortError' });
});

test('real client uses only metadata endpoints and can repeat declared-lineage discovery offline', async () => {
  const values = new Map(), calls = [];
  const storage = { getItem: (k) => values.get(k), setItem: (k, v) => values.set(k, v) };
  const exportInfo = candidate('exporter/model');
  const fetchImpl = async (input) => {
    const url = new URL(input); calls.push(url);
    if (url.pathname === '/api/models') {
      assert.equal(url.searchParams.get('filter'), `base_model:${source}`);
      assert.equal(url.searchParams.get('limit'), '40');
      return Response.json([exportInfo]);
    }
    if (url.pathname === `/api/models/${source}`) return Response.json({ id: source, sha: sourceRevision });
    if (url.pathname === `/api/models/exporter/model/revision/${revision}`) return Response.json(exportInfo);
    assert.fail(`Unexpected non-metadata request: ${input}`);
  };
  const online = await findHuggingFaceConversions(source, { client: createHuggingFaceClient({ storage, fetchImpl }) });
  assert.equal(online.items.length, 1); assert.equal(calls.length, 3);
  const offline = await findHuggingFaceConversions(source, { client: createHuggingFaceClient({ storage,
    fetchImpl: async () => { throw new TypeError('offline'); } }) });
  assert.equal(offline.cached, true); assert.deepEqual(offline.items, online.items); assert.match(offline.warning, /cached/);
});
