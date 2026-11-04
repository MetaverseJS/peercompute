// Immutable HF metadata and selected q4 closures; runtime acceptance is a separate gate.
// q4 uses float32 activations/cache; q4f16 variants are deliberately not selected.
function freeze(value) {
  for (const item of Object.values(value)) if (item && typeof item === 'object') freeze(item);
  return Object.freeze(value);
}

export const ADDITIONAL_MODEL_CATALOG = freeze({
  "qwen2.5-coder-0.5b-q4": {
    "id": "qwen2.5-coder-0.5b-q4",
    "name": "Qwen2.5 Coder 0.5B (q4)",
    "description": "Coding and code explanation.",
    "repository": "onnx-community/Qwen2.5-Coder-0.5B-Instruct",
    "revision": "604bb1988ff789d5024d589c63cf9ae81c0c8ab5",
    "status": "candidate",
    "license": {
      "spdx": "Apache-2.0",
      "sourceUrl": "https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct/blob/ea3f2471cf1b1f0db85067f1ef93848e38e88c25/README.md",
      "notice": "Preserve the upstream license, notices and model-card provenance.",
      "conversionLicenseReviewRequired": true
    },
    "provenance": {
      "repository": "onnx-community/Qwen2.5-Coder-0.5B-Instruct",
      "revision": "604bb1988ff789d5024d589c63cf9ae81c0c8ab5",
      "format": "ONNX",
      "metadataCheckedAt": "2026-11-04",
      "modelCardUrl": "https://huggingface.co/onnx-community/Qwen2.5-Coder-0.5B-Instruct/blob/604bb1988ff789d5024d589c63cf9ae81c0c8ab5/README.md"
    },
    "model": {
      "runtime": "transformers.js",
      "runtimeVersion": "4.3.2",
      "architecture": "qwen2",
      "task": "text-generation",
      "dtype": "q4",
      "modalities": [
        "text"
      ],
      "requiredFeatures": [],
      "repository": "onnx-community/Qwen2.5-Coder-0.5B-Instruct",
      "revision": "604bb1988ff789d5024d589c63cf9ae81c0c8ab5"
    },
    "weightBytes": 862087110,
    "totalBytes": 877970632,
    "files": [
      {
        "path": "README.md",
        "size": 2714,
        "gitBlobSha1": "e3f268a58331e0cdd58a38de3e15008428cc8821"
      },
      {
        "path": "added_tokens.json",
        "size": 605,
        "gitBlobSha1": "482ced4679301bf287ebb310bdd1790eb4514232"
      },
      {
        "path": "config.json",
        "size": 916,
        "gitBlobSha1": "b0c966334ffb6f0a6e8122eb260129c3796308e7"
      },
      {
        "path": "generation_config.json",
        "size": 243,
        "gitBlobSha1": "a7538414a4813e768e4e9d22e8588e35db8e5fbd"
      },
      {
        "path": "merges.txt",
        "size": 1671853,
        "gitBlobSha1": "31349551d90c7606f325fe0f11bbb8bd5fa0d7c7"
      },
      {
        "path": "onnx/model_q4.onnx",
        "size": 862087110,
        "sha256": "2df7ea9739c3c26bd9d2cad0815768a5a0a985d4b5548b7de80c5e85e9a97b47"
      },
      {
        "path": "special_tokens_map.json",
        "size": 613,
        "gitBlobSha1": "ac23c0aaa2434523c494330aeb79c58395378103"
      },
      {
        "path": "tokenizer.json",
        "size": 11421896,
        "sha256": "9c5ae00e602b8860cbd784ba82a8aa14e8feecec692e7076590d014d7b7fdafa"
      },
      {
        "path": "tokenizer_config.json",
        "size": 7849,
        "gitBlobSha1": "24afe3594154cfee05edda73aeadf3daae0a53ba"
      },
      {
        "path": "vocab.json",
        "size": 2776833,
        "gitBlobSha1": "4783fe10ac3adce15ac8f358ef5462739852c569"
      }
    ]
  },
  "smollm2-360m-instruct-q4": {
    "id": "smollm2-360m-instruct-q4",
    "name": "SmolLM2 360M Instruct (q4)",
    "description": "Lightweight English writing, rewriting and summarization.",
    "repository": "HuggingFaceTB/SmolLM2-360M-Instruct",
    "revision": "a10cc1512eabd3dde888204e902eca88bddb4951",
    "status": "candidate",
    "license": {
      "spdx": "Apache-2.0",
      "sourceUrl": "https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct/blob/a10cc1512eabd3dde888204e902eca88bddb4951/README.md",
      "notice": "Preserve the upstream license, notices and model-card provenance.",
      "conversionLicenseReviewRequired": false
    },
    "provenance": {
      "repository": "HuggingFaceTB/SmolLM2-360M-Instruct",
      "revision": "a10cc1512eabd3dde888204e902eca88bddb4951",
      "format": "ONNX",
      "metadataCheckedAt": "2026-11-04",
      "modelCardUrl": "https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct/blob/a10cc1512eabd3dde888204e902eca88bddb4951/README.md"
    },
    "model": {
      "runtime": "transformers.js",
      "runtimeVersion": "4.3.2",
      "architecture": "llama",
      "task": "text-generation",
      "dtype": "q4",
      "modalities": [
        "text"
      ],
      "requiredFeatures": [],
      "repository": "HuggingFaceTB/SmolLM2-360M-Instruct",
      "revision": "a10cc1512eabd3dde888204e902eca88bddb4951"
    },
    "weightBytes": 387943246,
    "totalBytes": 391327556,
    "files": [
      {
        "path": "README.md",
        "size": 7304,
        "gitBlobSha1": "5ed0ef7d7e4c1304d542a073ff5767990d410e2f"
      },
      {
        "path": "config.json",
        "size": 846,
        "gitBlobSha1": "4f2ae86545bb5c1d4fcc55644deef86be50a7dee"
      },
      {
        "path": "generation_config.json",
        "size": 132,
        "gitBlobSha1": "da6c4d71a43aa7e6f785bdbb28ea5025438a73fa"
      },
      {
        "path": "merges.txt",
        "size": 466391,
        "gitBlobSha1": "69503b13f727ba3812b6803e97442a6de05ef5eb"
      },
      {
        "path": "onnx/model_q4.onnx",
        "size": 387943246,
        "sha256": "a4ffda96e65beafc6f6cef0cbcf9fdc1cbdd79c230906bf3897d190547c7a596"
      },
      {
        "path": "special_tokens_map.json",
        "size": 655,
        "gitBlobSha1": "44719d2e365acac0637fd25a3acf46494ca45940"
      },
      {
        "path": "tokenizer.json",
        "size": 2104556,
        "gitBlobSha1": "f922b1797f0c88e71addc8393787831f2477a4bd"
      },
      {
        "path": "tokenizer_config.json",
        "size": 3764,
        "gitBlobSha1": "8c7b22013909450429303ed10be4398bd63f5457"
      },
      {
        "path": "vocab.json",
        "size": 800662,
        "gitBlobSha1": "0ad5ecc2035b7031b88afb544ee95e2d49baa484"
      }
    ]
  }
});
