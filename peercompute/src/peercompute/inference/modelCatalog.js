// Catalog metadata was checked against these immutable HF revisions on 2026-11-03.
// These are compatibility candidates; successful execution is a separate hardware/runtime gate.
// LFS oid is a whole-file SHA-256. Ordinary Git blob IDs are SHA-1 over the Git blob framing.
// Importers must compute a whole-file SHA-256 for every completed manifest entry.
import { ADDITIONAL_MODEL_CATALOG } from './additionalModelCatalog.js';

function freeze(value) {
  for (const item of Object.values(value)) if (item && typeof item === 'object') freeze(item);
  return Object.freeze(value);
}

export const MODEL_CATALOG = freeze({
  ...ADDITIONAL_MODEL_CATALOG,
  "qwen3-0.6b-q4": {
    "id": "qwen3-0.6b-q4",
    "name": "Qwen3 0.6B (q4)",
    "repository": "onnx-community/Qwen3-0.6B-ONNX",
    "revision": "58ca03a5e7b354b480b1a82b34bde8dc7b854cc0",
    "status": "candidate",
    "license": {
      "spdx": "Apache-2.0",
      "sourceUrl": "https://huggingface.co/Qwen/Qwen3-0.6B/blob/c1899de289a04d12100db370d81485cdf75e47ca/README.md",
      "notice": "Preserve the upstream license, notices and model-card provenance.",
      "conversionLicenseReviewRequired": true
    },
    "provenance": {
      "repository": "onnx-community/Qwen3-0.6B-ONNX",
      "revision": "58ca03a5e7b354b480b1a82b34bde8dc7b854cc0",
      "format": "ONNX",
      "metadataCheckedAt": "2026-11-03",
      "modelCardUrl": "https://huggingface.co/onnx-community/Qwen3-0.6B-ONNX/blob/58ca03a5e7b354b480b1a82b34bde8dc7b854cc0/README.md"
    },
    "model": {
      "runtime": "transformers.js",
      "runtimeVersion": "4.3.2",
      "architecture": "qwen3",
      "task": "text-generation",
      "dtype": "q4",
      "modalities": [
        "text"
      ],
      "requiredFeatures": [],
      "repository": "onnx-community/Qwen3-0.6B-ONNX",
      "revision": "58ca03a5e7b354b480b1a82b34bde8dc7b854cc0"
    },
    "weightBytes": 919096585,
    "totalBytes": 932680786,
    "files": [
      {
        "path": "README.md",
        "size": 1539,
        "gitBlobSha1": "bb4c96a7b31a2ba8660a48adca819d5047051dc5"
      },
      {
        "path": "added_tokens.json",
        "size": 707,
        "gitBlobSha1": "b54f9135e44c1e81047e8d05cb027af8bc039eed"
      },
      {
        "path": "chat_template.jinja",
        "size": 4116,
        "gitBlobSha1": "699ff8df401fe4788525e9c1f9b86a99eadd6230"
      },
      {
        "path": "config.json",
        "size": 912,
        "gitBlobSha1": "5618bd85d36283349a0cb4a99ab15454691f355b"
      },
      {
        "path": "generation_config.json",
        "size": 219,
        "gitBlobSha1": "f0e014517edce509b5d5f07cfa4855d79fad3bcf"
      },
      {
        "path": "merges.txt",
        "size": 1671853,
        "gitBlobSha1": "31349551d90c7606f325fe0f11bbb8bd5fa0d7c7"
      },
      {
        "path": "onnx/model_q4.onnx",
        "size": 919096585,
        "sha256": "d43d836fc5e240df9013733ccd214972c5d21bd9ec47e574e4f1e359cf90aed0"
      },
      {
        "path": "special_tokens_map.json",
        "size": 613,
        "gitBlobSha1": "ac23c0aaa2434523c494330aeb79c58395378103"
      },
      {
        "path": "tokenizer.json",
        "size": 9117040,
        "sha256": "e7a95fce95bf5b0946d0ddb3f9d7caa030b7e850bbe92b0edb26bcf563e9f3d5"
      },
      {
        "path": "tokenizer_config.json",
        "size": 10369,
        "gitBlobSha1": "f658735e1ad9b8feb5a3c5140e659e854889af61"
      },
      {
        "path": "vocab.json",
        "size": 2776833,
        "gitBlobSha1": "4783fe10ac3adce15ac8f358ef5462739852c569"
      }
    ]
  },
  "smolvlm-256m-q4": {
    "id": "smolvlm-256m-q4",
    "name": "SmolVLM 256M Instruct (q4)",
    "repository": "HuggingFaceTB/SmolVLM-256M-Instruct",
    "revision": "7e3e67edbbed1bf9888184d9df282b700a323964",
    "status": "candidate",
    "license": {
      "spdx": "Apache-2.0",
      "sourceUrl": "https://huggingface.co/HuggingFaceTB/SmolVLM-256M-Instruct/blob/7e3e67edbbed1bf9888184d9df282b700a323964/README.md",
      "notice": "Preserve the upstream license, notices and model-card provenance."
    },
    "provenance": {
      "repository": "HuggingFaceTB/SmolVLM-256M-Instruct",
      "revision": "7e3e67edbbed1bf9888184d9df282b700a323964",
      "format": "ONNX",
      "metadataCheckedAt": "2026-11-03",
      "modelCardUrl": "https://huggingface.co/HuggingFaceTB/SmolVLM-256M-Instruct/blob/7e3e67edbbed1bf9888184d9df282b700a323964/README.md"
    },
    "model": {
      "runtime": "transformers.js",
      "runtimeVersion": "4.3.2",
      "architecture": "idefics3",
      "task": "image-text-to-text",
      "dtype": {
        "embed_tokens": "q4",
        "vision_encoder": "q4",
        "decoder_model_merged": "q4"
      },
      "modalities": [
        "text",
        "image"
      ],
      "requiredFeatures": [],
      "repository": "HuggingFaceTB/SmolVLM-256M-Instruct",
      "revision": "7e3e67edbbed1bf9888184d9df282b700a323964"
    },
    "weightBytes": 263889326,
    "totalBytes": 268763564,
    "files": [
      {
        "path": "README.md",
        "size": 16400,
        "gitBlobSha1": "66dd9eda6724c2e696a44a05dba796bb707de9ff"
      },
      {
        "path": "added_tokens.json",
        "size": 4739,
        "gitBlobSha1": "71dc811700b6aa9274d3697ee7d4fb2d5375e766"
      },
      {
        "path": "chat_template.json",
        "size": 429,
        "gitBlobSha1": "214a30563adf9598b26cdd3ad3bbafca9d7af45d"
      },
      {
        "path": "config.json",
        "size": 7353,
        "gitBlobSha1": "1c09d62975f946e7e07f62ec4db3f16c9c701144"
      },
      {
        "path": "generation_config.json",
        "size": 136,
        "gitBlobSha1": "14051e31eab5938a09976bf8c3e4769491f53a80"
      },
      {
        "path": "merges.txt",
        "size": 466391,
        "gitBlobSha1": "69503b13f727ba3812b6803e97442a6de05ef5eb"
      },
      {
        "path": "onnx/decoder_model_merged_q4.onnx",
        "size": 86562901,
        "sha256": "e3fd81130e30715580cf148398e48e2925b6219bff75e17d2a77add35a363f65"
      },
      {
        "path": "onnx/embed_tokens_q4.onnx",
        "size": 113541438,
        "sha256": "47ed7029703cff586fd719d70251324766a6591c8a58d315076b1781a65fc900"
      },
      {
        "path": "onnx/vision_encoder_q4.onnx",
        "size": 63784987,
        "sha256": "95814e6629ec465e7cf98a44edcee67abc06d41faa0d1acc410cf8a956cab488"
      },
      {
        "path": "preprocessor_config.json",
        "size": 486,
        "gitBlobSha1": "893236748032d4bf033823d6a4a0d62b78b6bc0e"
      },
      {
        "path": "processor_config.json",
        "size": 68,
        "gitBlobSha1": "b3b1deadd0e6e18c2070fdb0c29074892ea58ffe"
      },
      {
        "path": "special_tokens_map.json",
        "size": 1069,
        "gitBlobSha1": "647565708c361dc42350b5c7b79c46a4ff153b18"
      },
      {
        "path": "tokenizer.json",
        "size": 3548256,
        "gitBlobSha1": "a4005d1cf3170a31600a5c96f95768166cbc2b28"
      },
      {
        "path": "tokenizer_config.json",
        "size": 28249,
        "gitBlobSha1": "c85c07d72e6ffca6b6ff138a8e8f09ae65740bfb"
      },
      {
        "path": "vocab.json",
        "size": 800662,
        "gitBlobSha1": "0ad5ecc2035b7031b88afb544ee95e2d49baa484"
      }
    ]
  },
  "smolvlm-500m-q4": {
    "id": "smolvlm-500m-q4",
    "name": "SmolVLM 500M Instruct (q4)",
    "repository": "HuggingFaceTB/SmolVLM-500M-Instruct",
    "revision": "a7da5b986cb59b408707209984f360a5f4ad7e47",
    "status": "candidate",
    "license": {
      "spdx": "Apache-2.0",
      "sourceUrl": "https://huggingface.co/HuggingFaceTB/SmolVLM-500M-Instruct/blob/a7da5b986cb59b408707209984f360a5f4ad7e47/README.md",
      "notice": "Preserve the upstream license, notices and model-card provenance."
    },
    "provenance": {
      "repository": "HuggingFaceTB/SmolVLM-500M-Instruct",
      "revision": "a7da5b986cb59b408707209984f360a5f4ad7e47",
      "format": "ONNX",
      "metadataCheckedAt": "2026-11-03",
      "modelCardUrl": "https://huggingface.co/HuggingFaceTB/SmolVLM-500M-Instruct/blob/a7da5b986cb59b408707209984f360a5f4ad7e47/README.md"
    },
    "model": {
      "runtime": "transformers.js",
      "runtimeVersion": "4.3.2",
      "architecture": "idefics3",
      "task": "image-text-to-text",
      "dtype": {
        "embed_tokens": "q4",
        "vision_encoder": "q4",
        "decoder_model_merged": "q4"
      },
      "modalities": [
        "text",
        "image"
      ],
      "requiredFeatures": [],
      "repository": "HuggingFaceTB/SmolVLM-500M-Instruct",
      "revision": "a7da5b986cb59b408707209984f360a5f4ad7e47"
    },
    "weightBytes": 485088765,
    "totalBytes": 489956507,
    "files": [
      {
        "path": "README.md",
        "size": 9918,
        "gitBlobSha1": "add86ea016316649eff3ec3707f81e03c166abd1"
      },
      {
        "path": "added_tokens.json",
        "size": 4739,
        "gitBlobSha1": "71dc811700b6aa9274d3697ee7d4fb2d5375e766"
      },
      {
        "path": "chat_template.json",
        "size": 429,
        "gitBlobSha1": "214a30563adf9598b26cdd3ad3bbafca9d7af45d"
      },
      {
        "path": "config.json",
        "size": 7339,
        "gitBlobSha1": "d2a7bdf9e204095994fa15a3160a28e4c1fbd505"
      },
      {
        "path": "generation_config.json",
        "size": 136,
        "gitBlobSha1": "14051e31eab5938a09976bf8c3e4769491f53a80"
      },
      {
        "path": "merges.txt",
        "size": 466391,
        "gitBlobSha1": "69503b13f727ba3812b6803e97442a6de05ef5eb"
      },
      {
        "path": "onnx/decoder_model_merged_q4.onnx",
        "size": 229119140,
        "sha256": "6d64c0fdce1c3515c40a08ff8e398bfbc0b2e961ae46d1b84b91e6a7b269b9d1"
      },
      {
        "path": "onnx/embed_tokens_q4.onnx",
        "size": 189235518,
        "sha256": "19f4fad7cb17c6dad11b4520d2abcba173fc91f755d71907d31d11a9e5761606"
      },
      {
        "path": "onnx/vision_encoder_q4.onnx",
        "size": 66734107,
        "sha256": "179812d5b1315edbe3e7164ea3d847c52723692e83ac9c770a5234962663fcad"
      },
      {
        "path": "preprocessor_config.json",
        "size": 486,
        "gitBlobSha1": "893236748032d4bf033823d6a4a0d62b78b6bc0e"
      },
      {
        "path": "processor_config.json",
        "size": 68,
        "gitBlobSha1": "b3b1deadd0e6e18c2070fdb0c29074892ea58ffe"
      },
      {
        "path": "special_tokens_map.json",
        "size": 1069,
        "gitBlobSha1": "647565708c361dc42350b5c7b79c46a4ff153b18"
      },
      {
        "path": "tokenizer.json",
        "size": 3548256,
        "gitBlobSha1": "a4005d1cf3170a31600a5c96f95768166cbc2b28"
      },
      {
        "path": "tokenizer_config.json",
        "size": 28249,
        "gitBlobSha1": "c85c07d72e6ffca6b6ff138a8e8f09ae65740bfb"
      },
      {
        "path": "vocab.json",
        "size": 800662,
        "gitBlobSha1": "0ad5ecc2035b7031b88afb544ee95e2d49baa484"
      }
    ]
  },
  "qwen3.5-2b-q4": {
    "id": "qwen3.5-2b-q4",
    "name": "Qwen3.5 2B Vision (q4)",
    "repository": "onnx-community/Qwen3.5-2B-ONNX-OPT",
    "revision": "ed446636739bf426e73c5a00714fd8e010d36c21",
    "status": "candidate",
    "license": {
      "spdx": "Apache-2.0",
      "sourceUrl": "https://huggingface.co/Qwen/Qwen3.5-2B/blob/15852e8c16360a2fea060d615a32b45270f8a8fc/LICENSE",
      "notice": "Preserve the upstream license, notices and model-card provenance.",
      "conversionLicenseReviewRequired": true
    },
    "provenance": {
      "repository": "onnx-community/Qwen3.5-2B-ONNX-OPT",
      "revision": "ed446636739bf426e73c5a00714fd8e010d36c21",
      "format": "ONNX",
      "metadataCheckedAt": "2026-11-03",
      "modelCardUrl": "https://huggingface.co/onnx-community/Qwen3.5-2B-ONNX-OPT/blob/ed446636739bf426e73c5a00714fd8e010d36c21/README.md",
      "upstreamRepository": "Qwen/Qwen3.5-2B",
      "upstreamRevision": "15852e8c16360a2fea060d615a32b45270f8a8fc"
    },
    "model": {
      "runtime": "transformers.js",
      "runtimeVersion": "4.3.2",
      "architecture": "qwen3_5",
      "task": "image-text-to-text",
      "dtype": {
        "embed_tokens": "q4",
        "vision_encoder": "q4",
        "decoder_model_merged": "q4"
      },
      "modalities": [
        "text",
        "image"
      ],
      "requiredFeatures": [],
      "repository": "onnx-community/Qwen3.5-2B-ONNX-OPT",
      "revision": "ed446636739bf426e73c5a00714fd8e010d36c21"
    },
    "weightBytes": 1752031835,
    "totalBytes": 1771280684,
    "files": [
      {
        "path": "README.md",
        "size": 37,
        "gitBlobSha1": "b206ddbaed14ba25a9cf960ac2e06e606e39f302"
      },
      {
        "path": "chat_template.jinja",
        "size": 7755,
        "gitBlobSha1": "0ef09f214eaa6d9bca297988afc1454b5827b2c7"
      },
      {
        "path": "config.json",
        "size": 2993,
        "gitBlobSha1": "1d7f2529ec1e68464cba2dd9ce66811f013ccfa6"
      },
      {
        "path": "generation_config.json",
        "size": 248,
        "gitBlobSha1": "59ee4c198e909ccdc280d57660829658989582b2"
      },
      {
        "path": "onnx/decoder_model_merged_q4.onnx",
        "size": 586260,
        "sha256": "8207fcf67d692e251eec7f24868be5b753f402fb84a259eb4578253692701405"
      },
      {
        "path": "onnx/decoder_model_merged_q4.onnx_data",
        "size": 1207357440,
        "sha256": "0c0f71175574f0060ed441acb1896825234ef27fcf008822c490dbfa6b0c90fe"
      },
      {
        "path": "onnx/embed_tokens_q4.onnx",
        "size": 857,
        "sha256": "0255dd844858758f452d9678f1e2c91db178f21b7da254d29b12e7fe3d23e305"
      },
      {
        "path": "onnx/embed_tokens_q4.onnx_data",
        "size": 325795840,
        "sha256": "9a6404d9b1c79ffc038d5c28deec04d419efb4594125453c991be38b4522ecb6"
      },
      {
        "path": "onnx/vision_encoder_q4.onnx",
        "size": 339182,
        "sha256": "986f2792878369c6e0e28e27de0c14a41227a3fd24b9da8eae66d93bf223ae66"
      },
      {
        "path": "onnx/vision_encoder_q4.onnx_data",
        "size": 217952256,
        "sha256": "0ea0ab9559904e1e5150a0ca194136922c6b8f1dfaaa44cc5e174ca59b231bb3"
      },
      {
        "path": "preprocessor_config.json",
        "size": 336,
        "gitBlobSha1": "4ae180b49f91e11d4da327d44edd9d4a909fe908"
      },
      {
        "path": "processor_config.json",
        "size": 1300,
        "gitBlobSha1": "7ad6acdf4203f22b7b990e36ccc3a1fe38563d5e"
      },
      {
        "path": "tokenizer.json",
        "size": 19226111,
        "sha256": "89da80cc6689bef4d90cc1028249436975ffb0814618f1d93c65310e05801a9b"
      },
      {
        "path": "tokenizer_config.json",
        "size": 10069,
        "gitBlobSha1": "1a7a8b42ef296f48ac686bab602f518da32dd85c"
      }
    ]
  }
});

export function modelFileUrl(modelId, path) {
  const entry = MODEL_CATALOG[modelId];
  if (!entry || !entry.files.some((file) => file.path === path)) throw new Error('Unknown catalog model file');
  const encoded = path.split('/').map(encodeURIComponent).join('/');
  return `https://huggingface.co/${entry.repository}/resolve/${entry.revision}/${encoded}`;
}
