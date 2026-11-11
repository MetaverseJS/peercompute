// Pinned Hub metadata checked on 2026-11-10. Weight digest is the publisher's
// LFS SHA-256; the model card was downloaded and hashed independently.
const repository = 'BoldingBuilds/Abliterated-MiMo-V2.6-Distill-Qwen-9B-GGUF';
const revision = '036d46331b5ef633654ff516e73973e81c8eca79';
const id = 'mimo-v2.6-distill-qwen-9b-abliterated-q4-k-m-gguf';
const modelCardUrl = `https://huggingface.co/${repository}/blob/${revision}/README.md`;
const files = [
  { path: 'MiMo-V2.6-Distill-Qwen-9B-Abliterated-Q4_K_M.gguf', size: 5629105280,
    sha256: '8798617e1da0b324a7d4c04659c59bb8f712dd5a7332b4703a5a2875d977ecf2' },
  { path: 'README.md', size: 7258,
    sha256: 'ba41257ca6d1905daf030c7ef2aead2c6d60136a213c028c9b6991e8b74cdd7a',
    gitBlobSha1: '1b0eb905e11ce299d5402e7b75fece713a63682b' },
];

function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}

export const MIMO_MODEL_CATALOG = freeze({
  [id]: {
    id, name: 'MiMo V2.6 Distill Qwen 9B Abliterated (GGUF Q4_K_M, text)',
    repository, revision, status: 'execution-candidate', format: 'GGUF',
    capabilities: { import: true, pin: true, peerHosting: true, browserInference: true,
      requiresCapabilityCheck: true, executionStatus: 'user-reported',
      executionReason: 'User-tested successfully in PeerCompute on 2026-11-10. Device details were not supplied; shader-f16, cross-origin isolation, shared WASM memory64/JSPI and memory admission are still required.' },
    behavior: { kind: 'abliterated',
      notice: 'Publisher-described refusal-ablated MiMo distillation; not a guarantee of refusal-free output or factual accuracy.' },
    license: { spdx: 'MIT', sourceUrl: modelCardUrl,
      notice: 'The publisher declares MIT in the included model card. Neither this conversion nor its linked parent supplies a separate LICENSE file at the checked revisions.' },
    provenance: { repository, revision, format: 'GGUF', metadataCheckedAt: '2026-11-10', modelCardUrl,
      sourceModel: { repository: 'XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B',
        revision: '1f09ddcc1a0ea45751ae0dfe2af20d533168c46f',
        revisionPurpose: 'Pinned parent metadata reference; not a verified conversion input revision.',
        conversionInputRevisionVerified: false },
      vision: 'Text-only package. The publisher does not claim vision for these GGUF files; no projector is included.',
      publisherEvaluation: 'The model card reports completed evaluations for Q8_0 only; Q4_K_M is listed as built but untested.',
      userReportedExecution: { checkedAt: '2026-11-10', application: 'PeerCompute', result: 'working',
        evidence: 'User confirmed this exact Q4_K_M file works in PeerCompute; device and browser details were not supplied.',
        independentlyReproduced: false } },
    model: { runtime: 'llama.cpp', runtimeVersion: '3.8.1', architecture: 'qwen3_5', format: 'GGUF',
      task: 'text-generation', dtype: 'q4_k_m', modalities: ['text'], requiredFeatures: ['shader-f16'],
      repository, revision },
    weightBytes: files[0].size, totalBytes: files.reduce((sum, file) => sum + file.size, 0), files,
  },
});
