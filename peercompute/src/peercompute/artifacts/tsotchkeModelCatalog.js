// Public organization inventory checked 2026-11-04 through the HF model API,
// pinned cards/configs and publisher tensor manifests. Metadata inspection is
// not device qualification. Sidecars (including Python verifiers) are data only.
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}

const organization = 'Tsotchke-Corporation';
const candidates = [
  {
    id: 'qwen3-coder-30b-a3b-georefine-c30-gguf',
    name: 'Qwen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate text)',
    repository: `${organization}/Qwen3-Coder-30B-A3B-GeoRefine-C30-abl-GGUF`,
    revision: 'b88c1f0ded829f2195958b8f1129aa2d13a9232f', architecture: 'qwen3_moe',
    quantizationTypes: ['F32', 'Q8_0', 'Q4_K', 'Q6_K'],
    sourceModel: { repository: 'huihui-ai/Huihui-Qwen3-Coder-30B-A3B-Instruct-abliterated',
      revision: 'b84c58d52ac44041774fe9542e1943e4d971b5f4' },
    publisherLimitations: 'Experimental lossy mixed quantization of an abliterated parent. '
      + 'Behavioral quality, SAE certification and runtime qualification are untested.',
    files: [
      { path: '.gitattributes', size: 1609, gitBlobSha1: '3a433079d93d83ef24990f9ca0b33672cbcc8edd' },
      { path: 'LICENSE', size: 11343, gitBlobSha1: '6634c8cc3133b3848ec74b9f275acaaa1ea618ab' },
      { path: 'NOTICE', size: 574, gitBlobSha1: '687c4673ece140e83416522e0d00b53880e8bb13' },
      { path: 'Qwen3-Coder-30B-A3B-GeoRefine-C30-abl-MIXED-Q4_K.gguf', size: 18587950144,
        sha256: '2f005a4633b7783c4cdf8e924a0d9ddae28efd7a4d4812d3d94ea97c57aabf51' },
      { path: 'README.md', size: 2765, gitBlobSha1: '00227290350d0484631d06756736f4dff2e8bd66' },
      { path: 'artifact-manifest.json', size: 7659, gitBlobSha1: '87e9f2092c05a30a4c2840073729aa952e6e5d05' },
      { path: 'chat_template.jinja', size: 6853, gitBlobSha1: '3656cd64ff2fcc6ae59312eb87a709e0aa25b2eb' },
      { path: 'config.json', size: 1065, gitBlobSha1: '5288c67c42b574d39f790e6bf8836f57ec477483' },
      { path: 'generation_config.json', size: 235, gitBlobSha1: 'f1d3ae3c691e1a05d8d0455c0ec9b4153076d5ee' },
      { path: 'tokenizer_config.json', size: 5644, gitBlobSha1: 'b2cbe86ae45a1274c9b93ec060466ea8a4665c9b' },
      { path: 'verify_artifact.py', size: 1403, gitBlobSha1: '57027eb456280780650ef6bc44524b396734cbcf' },
    ],
  },
  {
    id: 'qwen3.6-35b-a3b-georefine-c20-gguf',
    name: 'Qwen3.6 35B A3B GeoRefine C20 (mixed IQ4_XS GGUF, candidate text)',
    repository: `${organization}/Qwen3.6-35B-A3B-GeoRefine-C20-GGUF`,
    revision: '7f385b4ae408eeb81def3013bf2e5ac671898b95', architecture: 'qwen3_5_moe',
    quantizationTypes: ['F32', 'Q8_0', 'Q5_K', 'IQ4_XS', 'Q6_K'],
    sourceModel: { repository: 'ericpandev/Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive-bf16',
      revision: 'f6ab91b5bdc2a7e7e1a1e2263c98a409509c79ed' },
    publisherLimitations: 'The publisher records a failed coding-quality gate and no complete capability certificate. '
      + 'Its internal qLLM Metal gguf-c20 runtime is not a public portable-runtime qualification; '
      + 'a public pinned clean-machine recipe remains unverified. This is not the GeoRefine TBE codec.',
    files: [
      { path: '.gitattributes', size: 1699, gitBlobSha1: 'f44e4e63e69c8b9a20797fd820049ea27bcf95fc' },
      { path: 'C20-MANIFEST.json', size: 2392163, gitBlobSha1: '3cb693fce32249c21d7a621060df41dbf5df64a9' },
      { path: 'LICENSE', size: 11350, gitBlobSha1: '80c1e78282bdef7ca03dd22e21ebe6f181687d02' },
      { path: 'NOTICE', size: 465, gitBlobSha1: '4852a35fe237eb4335504e78cd61cdb15834c02f' },
      { path: 'Qwen3.6-35B-A3B-GeoRefine-C20-MIXED-IQ4_XS.gguf', size: 19998783936,
        sha256: '027f3c99a065fa1b413505428acb28e5647ebeeafe1e0220badf4b4fce911c96' },
      { path: 'README.md', size: 4914, gitBlobSha1: '601a361b4a8308e9121749810fb103b644c581c1' },
      { path: 'artifact-manifest.json', size: 2726, gitBlobSha1: '2706dafb0ea785ed8df0eae767a008315f8a1a9f' },
      { path: 'config.json', size: 3148, gitBlobSha1: '09981f690fa954e74c4ae3d66163bb68435d14ca' },
      { path: 'generation_config.json', size: 243, gitBlobSha1: 'be05abc6b17ea7880b71c67d31f7264f92c34fc0' },
      { path: 'special_tokens_map.json', size: 437, gitBlobSha1: '1838f3b7f5e64b0f32abbd98181ea3ca8b3abfbc' },
      { path: 'tokenizer.json', size: 19991323,
        sha256: 'adfe67f1d28892e2c9dc17110ceac44bab368d488499115adfea19ff992d9ac7' },
      { path: 'tokenizer_config.json', size: 15148, gitBlobSha1: 'ab21e994b5ad9d2e9777ebe294b4fc98dd7fc6ec' },
      { path: 'verify_c20.py', size: 886, gitBlobSha1: '2ba7e98dd936d250bff3e3f2a38cae09c81dae86' },
    ],
  },
  {
    id: 'qwen3.8-27b-georefine-l162-gguf',
    name: 'Qwen3.8 27B GeoRefine L162 (mixed Q4_K GGUF, candidate text)',
    repository: `${organization}/Qwen3.8-27B-GeoRefine-L162-abl-GGUF`,
    revision: '4268ff007ddb5e8813a391fbdd3e198e56a4c6da', architecture: 'qwen3_5',
    quantizationTypes: ['F32', 'Q4_K', 'Q8_0', 'Q5_K', 'Q6_K'],
    sourceModel: { repository: 'huihui-ai/Huihui-Qwen3.8-27B-abliterated',
      revision: '739e3c5b89849f6c238ce1e5b70008612ae42cdd' },
    publisherLimitations: 'Experimental lossy mixed quantization; behavioral quality and runtime qualification are untested. '
      + 'Q4_K_M_CUSTOM labels a custom allocation of standard GGUF tensor types, not a custom codec '
      + 'or the standard llama.cpp Q4_K_M allocation recipe. The inherited Q8_0 header label does not describe the tensor mix.',
    files: [
      { path: '.gitattributes', size: 1694, gitBlobSha1: 'f41c1739e40b19b0a39816d1819e9e1d82245e5e' },
      { path: 'LICENSE', size: 11350, gitBlobSha1: '80c1e78282bdef7ca03dd22e21ebe6f181687d02' },
      { path: 'NOTICE', size: 515, gitBlobSha1: 'f153f97bba2134be8cd813690301cb2b5cd997b8' },
      { path: 'Qwen3.8-27B-GeoRefine-L162-abl-MIXED-Q4_K_M_CUSTOM.gguf', size: 16249419840,
        sha256: '191cd8fea54421e402c25d540d90358d27e5678ce8b4f73643d91111cbc223fd' },
      { path: 'README.md', size: 3913, gitBlobSha1: '5fd10161fbf27f1436861018bb15946d31ab4d8b' },
      { path: 'artifact-manifest.json', size: 5897, gitBlobSha1: 'fff04f79d87dc6253f0f3908dddf67c0ab66a8fd' },
      { path: 'chat_template.jinja', size: 8952, gitBlobSha1: 'c0c686f9c38d70d179fb7b5f5aa7530bc913dda3' },
      { path: 'config.json', size: 4312, gitBlobSha1: '706cebd746c4b6f2b1d1f892630867acfdfd3df8' },
      { path: 'generation_config.json', size: 202, gitBlobSha1: '023756cfadf88e5bf69eefeee3e172f38c448d64' },
      { path: 'tokenizer_config.json', size: 17928, gitBlobSha1: '5de744b3fca2129d7186979ae47c06be33903243' },
      { path: 'verify_artifact.py', size: 1217, gitBlobSha1: '15dd7292eb203b06e0df3640f9ae04fff09706ef' },
    ],
  },
];

export const TSOTCHKE_MODEL_CATALOG = freeze(Object.fromEntries(candidates.map((entry) => {
  const { architecture, quantizationTypes, sourceModel, publisherLimitations, ...metadata } = entry;
  return [entry.id, {
    ...metadata, status: 'execution-candidate', format: 'GGUF',
    capabilities: { import: true, pin: true, peerHosting: true, browserInference: true,
      requiresCapabilityCheck: true, executionStatus: 'candidate',
      executionReason: 'Requires managed llama.cpp WebGPU, shader-f16 and browser/resource admission. '
        + 'These exact artifacts are not hardware-qualified; current file and runtime byte limits still apply.' },
    license: { spdx: 'Apache-2.0',
      sourceUrl: `https://huggingface.co/${entry.repository}/blob/${entry.revision}/LICENSE`,
      notice: 'Preserve the included LICENSE, NOTICE, model card and pinned publisher manifests.' },
    provenance: { repository: entry.repository, revision: entry.revision, format: 'GGUF', metadataCheckedAt: '2026-11-04',
      modelCardUrl: `https://huggingface.co/${entry.repository}/blob/${entry.revision}/README.md`,
      sourceManifestPath: 'artifact-manifest.json', sourceModel, publisherLimitations,
      codecRequired: false, tensorFormatEvidence: 'Pinned publisher GGUF tensor census; no model payload was downloaded for catalog admission.',
      vision: 'The managed GGUF adapter is text-only; upstream vision metadata does not establish browser image support.' },
    model: { runtime: 'llama.cpp', runtimeVersion: '3.8.1', architecture, format: 'GGUF',
      task: 'text-generation', dtype: 'mixed', quantizationTypes, modalities: ['text'], requiredFeatures: ['shader-f16'],
      repository: entry.repository, revision: entry.revision },
    weightBytes: entry.files.filter((file) => file.path.endsWith('.gguf')).reduce((sum, file) => sum + file.size, 0),
    totalBytes: entry.files.reduce((sum, file) => sum + file.size, 0),
  }];
})));

// Audit the complete exact organization without importing codec containers as
// ordinary safetensors. D14 remains defined in modelArtifactCatalog unchanged.
export const TSOTCHKE_SOURCE_INVENTORY = freeze({
  organization, sourceUrl: `https://huggingface.co/${organization}`, checkedAt: '2026-11-04',
  repositories: [
    ...candidates.map(({ id, repository, revision }) => ({ repository, revision, catalogId: id, format: 'GGUF', codecRequired: false })),
    { repository: `${organization}/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,
      revision: '5ce3fd841676adf2c1a10d7193637d46007e88f7', catalogId: 'qwen3.8-27b-georefine-d14-gguf',
      format: 'GGUF', codecRequired: false },
    { repository: `${organization}/Qwen3.8-27B-GeoRefine-Context`,
      revision: 'c725e6920301a405849b9e373503553789e0d39b', format: 'bitexact-predictive-context-package-v1', codecRequired: true,
      exclusionReason: 'BCTX/PPCX tensors require GeoRefine decoding or its matched CUDA runtime.' },
    { repository: `${organization}/Qwen3.8-27B-GeoRefine-Context-abliterated`,
      revision: 'c161a64650b1a94f8cfb54453a98f98a7a0d7185', format: 'bitexact-predictive-context-package-v1', codecRequired: true,
      exclusionReason: 'Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading.' },
    { repository: `${organization}/Qwen3.8-27B-GeoRefine-TBE`,
      revision: '592b60bb7b554389331a1dae3db1847bf33bdd45', format: 'georefine.tbe.serve.v1', codecRequired: true,
      exclusionReason: 'The .safetensors shards are codec containers, requiring GeoRefine TBE or full BF16 export.' },
  ],
});
