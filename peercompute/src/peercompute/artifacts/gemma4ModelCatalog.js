// Immutable Hub metadata checked on 2026-11-10. Weight digest is publisher LFS
// metadata; conversion and linked source cards were independently hashed.
const repository = 'TrevorJS/gemma-4-12B-it-uncensored-GGUF';
const revision = 'd878d412b001a720b9a62eaac432d00aac9d1b4f';
const id = 'gemma4-12b-uncensored-q4-k-m-gguf';
const modelCardUrl = `https://huggingface.co/${repository}/blob/${revision}/README.md`;
const sourceRepository = 'TrevorJS/gemma-4-12B-it-uncensored';
const sourceRevision = '159eb7a8a04efb31ed43887e4732ff3edccff8ac';
const files = [
  { path: 'gemma-4-12B-it-uncensored-Q4_K_M.gguf', size: 7381382208,
    sha256: '6f78e675eddd0f1ec8079ba4f66193880e14dfcb42002b6bd72c18ad7c365494' },
  { path: 'README.md', size: 1629,
    sha256: 'aef2a4d7ace8ca9a1f8435ec6f713cd51db8e917e9477e2eba6446d2e7997a41',
    gitBlobSha1: 'b0817c994d69e95961e18b9a380366eb9ed3d6ee' },
];

function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}

export const GEMMA4_MODEL_CATALOG = freeze({
  [id]: {
    id, name: 'Gemma 4 12B Uncensored (GGUF Q4_K_M, text)',
    repository, revision, status: 'execution-candidate', format: 'GGUF',
    capabilities: { import: true, pin: true, peerHosting: true, browserInference: true,
      requiresCapabilityCheck: true, executionStatus: 'user-reported',
      executionReason: 'User reported successful PeerCompute text inference on 2026-11-10; this exact package was observed hosted on the peer network. Independent local GPU qualification remains pending. Requires shader-f16, isolation, shared WASM memory64/JSPI and device memory admission.' },
    behavior: { kind: 'abliterated',
      notice: 'Publisher-described refusal-ablated Gemma 4; not a guarantee of refusal-free output or factual accuracy.' },
    license: { spdx: 'Apache-2.0', sourceUrl: 'https://ai.google.dev/gemma/apache_2',
      notice: 'Google and both publisher cards declare Apache-2.0. The conversion card is included and the source card is linked; these checked repositories do not provide a separate LICENSE file.' },
    provenance: { repository, revision, format: 'GGUF', metadataCheckedAt: '2026-11-10', modelCardUrl,
      sourceModel: { repository: sourceRepository, revision: sourceRevision,
        modelCardUrl: `https://huggingface.co/${sourceRepository}/blob/${sourceRevision}/README.md`,
        modelCardBytes: 4929, modelCardSha256: 'd2994dbe94e6a1c3fce070b0b6efc5fe8e9aa4a7803b41f29c1479713bad352b',
        revisionPurpose: 'Pinned source metadata reference; not a verified conversion input revision.',
        conversionInputRevisionVerified: false },
      upstreamModel: { repository: 'google/gemma-4-12B-it',
        revision: '43c9d014b231474fa7212dbb48a762566c2b255d',
        revisionPurpose: 'Pinned upstream metadata and license reference.',
        architecture: 'Gemma4UnifiedForConditionalGeneration', modalities: ['text', 'image', 'audio'] },
      vision: 'The upstream model is multimodal; this is a text-only GGUF package without a vision or audio projector. Upstream capabilities do not establish browser support.',
      publisherEvaluation: 'The source card reports native llama.cpp Q8 testing; it does not establish Q4_K_M browser execution.',
      runtimeRequirement: 'Gemma4Unified support from llama.cpp PR #24118 (2026-06-04 or later), including the gemma4 tokenizer.',
      ggufHeader: { version: 3, architecture: 'gemma4', tokenizer: 'gemma4',
        blockCount: 48, tensorCount: 667, contextLength: 262144,
        completeHeaderBytes: 15822379, tensorTypes: ['F32', 'Q4_K', 'Q6_K'] } },
    model: { runtime: 'llama.cpp', runtimeVersion: '3.8.1', architecture: 'gemma4', format: 'GGUF',
      task: 'text-generation', dtype: 'q4_k_m', modalities: ['text'], requiredFeatures: ['shader-f16'],
      repository, revision },
    weightBytes: files[0].size, totalBytes: files.reduce((sum, file) => sum + file.size, 0), files,
  },
});
