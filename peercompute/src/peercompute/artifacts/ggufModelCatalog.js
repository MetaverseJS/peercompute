import { MODEL_ARTIFACT_CATALOG } from './modelArtifactCatalog.js';

// Immutable inputs, not a claim that a browser or a model has passed execution.
// Preserve the existing 27B manifest metadata/CID when adding its runtime option.
const repository = 'bartowski/Qwen_Qwen3.5-0.8B-GGUF';
const revision = 'f36b1ea49a332ede8fe5f389bbf5b3575ef71f48';
const files = [
  { path: 'Qwen_Qwen3.5-0.8B-Q4_K_M.gguf', size: 579615840,
    sha256: 'fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526' },
  { path: 'README.md', size: 13782, gitBlobSha1: '499cb320f9f2f3963beee9d8b890046f825c6f5d' },
];
const capabilities = Object.freeze({ import: true, pin: true, peerHosting: true,
  browserInference: true, requiresCapabilityCheck: true, executionStatus: 'candidate',
  executionReason: 'Requires the managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, '
    + 'and explicit memory admission. Actual model execution must be verified on the selected device.' });

export const GGUF_MODEL_CATALOG = Object.freeze({
  'qwen3.5-0.8b-q4-k-m-gguf': {
    id: 'qwen3.5-0.8b-q4-k-m-gguf', name: 'Qwen3.5 0.8B (GGUF Q4_K_M, text)',
    repository, revision, status: 'execution-candidate', format: 'GGUF', capabilities,
    license: { spdx: 'Apache-2.0', sourceUrl: `https://huggingface.co/${repository}/blob/${revision}/README.md`,
      notice: 'Preserve the upstream model card and immutable artifact provenance.' },
    provenance: { repository, revision, format: 'GGUF', metadataCheckedAt: '2026-11-03',
      modelCardUrl: `https://huggingface.co/${repository}/blob/${revision}/README.md` },
    model: { runtime: 'llama.cpp', runtimeVersion: '3.8.1', architecture: 'qwen3_5', format: 'GGUF',
      task: 'text-generation', dtype: 'q4_k_m', modalities: ['text'], repository, revision },
    weightBytes: files[0].size, totalBytes: files.reduce((sum, file) => sum + file.size, 0), files,
  },
  ...Object.fromEntries(Object.entries(MODEL_ARTIFACT_CATALOG).map(([id, entry]) => [id, {
    ...entry, status: 'execution-candidate', capabilities,
  }])),
});

export function ggufModelFileUrl(modelId, path) {
  const entry = GGUF_MODEL_CATALOG[modelId];
  if (!entry || !entry.files.some((file) => file.path === path)) throw new Error('Unknown catalog GGUF model file.');
  return `https://huggingface.co/${entry.repository}/resolve/${entry.revision}/${path.split('/').map(encodeURIComponent).join('/')}`;
}
