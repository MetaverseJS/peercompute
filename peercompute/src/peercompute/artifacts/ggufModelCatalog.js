import { MODEL_ARTIFACT_CATALOG } from './modelArtifactCatalog.js';
import { QWEN_9B_MODEL_CATALOG } from './qwen9bModelCatalog.js';
import { TSOTCHKE_MODEL_CATALOG } from './tsotchkeModelCatalog.js';
import { MIMO_MODEL_CATALOG } from './mimoModelCatalog.js';

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


function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}
const abliterated = Object.fromEntries([
  {
    "id": "qwen3-0.6b-abliterated-q4-k-m-gguf",
    "name": "Qwen3 0.6B Abliterated (GGUF Q4_K_M, text)",
    "repository": "mlabonne/Qwen3-0.6B-abliterated-GGUF",
    "revision": "92351f431cfdd36f71149aaf072a6490a68e144e",
    "architecture": "qwen3",
    "files": [
      {
        "path": "qwen3-0.6b-abliterated.q4_k_m.gguf",
        "size": 396704896,
        "sha256": "a5ee9177eeb334fc06883ae2ac5471e783a4ac2480f3a3bd6df852c5b20243e1"
      },
      {
        "path": "README.md",
        "size": 2525,
        "sha256": "bf87a238c72dda7f21fa8082ebb14a0efa6cbc9f14185c0bf144a20756152a5a",
        "gitBlobSha1": "a75d0a93363be8f7103979938cc420c932911dbb",
        "source": {
          "repository": "mlabonne/Qwen3-0.6B-abliterated-GGUF",
          "revision": "92351f431cfdd36f71149aaf072a6490a68e144e",
          "path": "README.md"
        }
      },
      {
        "path": "LICENSE",
        "size": 11343,
        "sha256": "832dd9e00a68dd83b3c3fb9f5588dad7dcf337a0db50f7d9483f310cd292e92e",
        "gitBlobSha1": "6634c8cc3133b3848ec74b9f275acaaa1ea618ab",
        "source": {
          "repository": "Qwen/Qwen3-0.6B",
          "revision": "c1899de289a04d12100db370d81485cdf75e47ca",
          "path": "LICENSE"
        }
      }
    ]
  },
  {
    "id": "qwen3.5-0.8b-abliterated-q4-k-m-gguf",
    "name": "Qwen3.5 0.8B Abliterated (GGUF Q4_K_M, text)",
    "repository": "xdchinza/Qwen3.5-0.8B-abliterated-GGUF",
    "revision": "6cef073175dbdc81594b27bfcb9804ab6122f119",
    "architecture": "qwen3_5",
    "files": [
      {
        "path": "Qwen3.5-0.8B-abliterated-Q4_K_M.gguf",
        "size": 541903744,
        "sha256": "eef9cbce1e8dceafb1d5d6cf3a29977607e0c83f164d7268dd5ef067c1dd9d61"
      },
      {
        "path": "README.md",
        "size": 1349,
        "sha256": "30864e51d8c52b07678ef4472737b8738cc76d0032b983ebb9e04a024826ead9",
        "gitBlobSha1": "15bc43ccda90a6ce708cd55d767550731b87c953",
        "source": {
          "repository": "xdchinza/Qwen3.5-0.8B-abliterated-GGUF",
          "revision": "6cef073175dbdc81594b27bfcb9804ab6122f119",
          "path": "README.md"
        }
      },
      {
        "path": "LICENSE",
        "size": 11544,
        "sha256": "bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",
        "gitBlobSha1": "f938136e3adacfd92be087f6e113b5d6d97f678f",
        "source": {
          "repository": "Qwen/Qwen3.5-0.8B",
          "revision": "2fc06364715b967f1860aea9cf38778875588b17",
          "path": "LICENSE"
        }
      }
    ]
  }
].map(({ architecture, ...entry }) => [entry.id, freeze({
  ...entry, status: 'execution-candidate', format: 'GGUF', capabilities,
  behavior: { kind: 'abliterated', notice: 'Publisher-described reduction in refusals; not a guarantee of refusal-free output or factual accuracy.' },
  license: { spdx: 'Apache-2.0', sourceUrl: `https://huggingface.co/${entry.files[2].source.repository}/blob/${entry.files[2].source.revision}/LICENSE`,
    notice: 'The inherited upstream Apache-2.0 license and model card are included.' },
  provenance: { repository: entry.repository, revision: entry.revision, format: 'GGUF', metadataCheckedAt: '2026-11-03',
    modelCardUrl: `https://huggingface.co/${entry.repository}/blob/${entry.revision}/README.md`,
    behavior: 'abliterated; publisher claim, not an execution or behavioral guarantee' },
  model: { runtime: 'llama.cpp', runtimeVersion: '3.8.1', architecture, format: 'GGUF',
    task: 'text-generation', dtype: 'q4_k_m', modalities: ['text'], repository: entry.repository, revision: entry.revision },
  weightBytes: entry.files[0].size, totalBytes: entry.files.reduce((sum, file) => sum + file.size, 0),
})]));

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
  ...abliterated,
  ...QWEN_9B_MODEL_CATALOG,
  ...MIMO_MODEL_CATALOG,
  ...TSOTCHKE_MODEL_CATALOG,
  ...Object.fromEntries(Object.entries(MODEL_ARTIFACT_CATALOG).map(([id, entry]) => [id, {
    ...entry, status: 'execution-candidate', capabilities,
  }])),
});

export function ggufModelFileUrl(modelId, path) {
  const entry = GGUF_MODEL_CATALOG[modelId];
  const file = entry?.files.find((file) => file.path === path);
  if (!file) throw new Error('Unknown catalog GGUF model file.');
  const source = file.source ?? { repository: entry.repository, revision: entry.revision, path };
  return `https://huggingface.co/${source.repository}/resolve/${source.revision}/${source.path.split('/').map(encodeURIComponent).join('/')}`;
}
