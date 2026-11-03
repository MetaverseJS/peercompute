// Storage/distribution catalog. Inclusion does not admit a model to an inference
// runtime. These files are the actual immutable HF API sibling list, including
// sidecars as data; upstream verification scripts are never executed here.
const repository = 'Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-abl-GGUF';
const revision = '5ce3fd841676adf2c1a10d7193637d46007e88f7';
const files = [
  { path: '.gitattributes', size: 1603, gitBlobSha1: 'dc92aece34cd441111fb2852aeaa5ee468bf2470' },
  { path: 'LICENSE', size: 11350, gitBlobSha1: '80c1e78282bdef7ca03dd22e21ebe6f181687d02' },
  { path: 'NOTICE', size: 514, gitBlobSha1: '8ced6aff2e3eeb0aa9fd727482eaa14e558c59da' },
  { path: 'Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_XS.gguf', size: 14199740480,
    sha256: 'afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d' },
  { path: 'README.md', size: 3621, gitBlobSha1: 'e1d99b2f8056b073da42651bf2aca14a0c95508d' },
  { path: 'artifact-manifest.json', size: 5510, gitBlobSha1: 'af686998d5593950b0ebd97ff47bd8967b3b0f82' },
  { path: 'chat_template.jinja', size: 8952, gitBlobSha1: 'c0c686f9c38d70d179fb7b5f5aa7530bc913dda3' },
  { path: 'config.json', size: 4312, gitBlobSha1: '706cebd746c4b6f2b1d1f892630867acfdfd3df8' },
  { path: 'generation_config.json', size: 202, gitBlobSha1: '023756cfadf88e5bf69eefeee3e172f38c448d64' },
  { path: 'tokenizer_config.json', size: 17928, gitBlobSha1: '5de744b3fca2129d7186979ae47c06be33903243' },
  { path: 'verify_artifact.py', size: 1217, gitBlobSha1: '15dd7292eb203b06e0df3640f9ae04fff09706ef' }
];
const executionReason = 'This catalog supports verified storage and distribution. '
  + 'Execution is admitted separately by the managed llama.cpp runtime and GGUF model catalog '
  + 'after browser capability and resource checks.';
function freeze(value) {
  for (const child of Object.values(value)) if (child && typeof child === 'object') freeze(child);
  return Object.freeze(value);
}

export const MODEL_ARTIFACT_CATALOG = freeze({
  'qwen3.8-27b-georefine-d14-gguf': {
    id: 'qwen3.8-27b-georefine-d14-gguf', name: 'Qwen3.8 27B GeoRefine D14 (mixed GGUF)',
    repository, revision, status: 'storage-only', format: 'GGUF',
    capabilities: { import: true, pin: true, peerHosting: true, browserInference: false,
      executionStatus: 'unavailable', executionReason },
    license: { spdx: 'Apache-2.0', sourceUrl: `https://huggingface.co/${repository}/blob/${revision}/LICENSE`,
      notice: 'Preserve upstream LICENSE, NOTICE, model card, and immutable artifact provenance.' },
    provenance: { repository, revision, format: 'GGUF', metadataCheckedAt: '2026-11-03',
      modelCardUrl: `https://huggingface.co/${repository}/blob/${revision}/README.md`,
      sourceManifestPath: 'artifact-manifest.json' },
    model: { runtime: 'llama.cpp', architecture: 'qwen3_5', format: 'GGUF', task: 'text-generation',
      dtype: 'mixed', quantizationTypes: ['IQ4_XS', 'IQ3_S', 'Q8_0', 'Q4_K', 'Q5_K', 'F32'],
      repository, revision },
    weightBytes: 14199740480, totalBytes: files.reduce((sum, file) => sum + file.size, 0), files
  }
});

export function modelArtifactFileUrl(modelId, path) {
  const entry = MODEL_ARTIFACT_CATALOG[modelId];
  if (!entry || !entry.files.some((file) => file.path === path)) throw new Error('Unknown catalog artifact model file.');
  const encoded = path.split('/').map(encodeURIComponent).join('/');
  return `https://huggingface.co/${entry.repository}/resolve/${entry.revision}/${encoded}`;
}
