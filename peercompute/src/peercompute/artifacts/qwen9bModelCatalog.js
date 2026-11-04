// Immutable metadata checked on 2026-11-03. Model files use publisher LFS SHA-256;
// metadata files were downloaded and checked against Git blob IDs and SHA-256.
// Bounded GGUF header inspection is not full-file or device execution validation.
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}

const candidates = [
  {
    "id": "qwen3.5-9b-evil-bowman-q5-k-m-gguf",
    "name": "Qwen3.5 9B Evil (Bowman GGUF Q5_K_M, experimental text)",
    "repository": "bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",
    "revision": "9531689a9d2da3897eae104ddf9fff92031a73d8",
    "dtype": "q5_k_m",
    "sourceModel": {
      "repository": "bowmanslayer/Qwen3.5-9B-Evil-BF16",
      "revision": "b66fc0a575c13af75c5d438111559b04ed015cd4"
    },
    "blockCount": 32,
    "nextnPredictLayers": 0,
    "behavior": {
      "kind": "experimental-behavior-edit",
      "notice": "The publisher reports capability damage and potentially hostile responses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."
    },
    "files": [
      {
        "path": "Qwen3.5-9B-Evil-Q5_K_M.gguf",
        "size": 6467969824,
        "sha256": "bff5a5dbf8ba472d65c0626b0f6046a12996bb841268aa44767dcb9bc87fb0cc"
      },
      {
        "path": "README.md",
        "size": 4013,
        "sha256": "825f21663874cbfa09dbb791849ff9c7f233a043317f16d85ecb3fa3872aaf72",
        "gitBlobSha1": "707f62876429f1ddf7274149e70cfd0dc7940d87",
        "source": {
          "repository": "bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",
          "revision": "9531689a9d2da3897eae104ddf9fff92031a73d8",
          "path": "README.md"
        }
      },
      {
        "path": "LICENSE",
        "size": 11544,
        "sha256": "bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",
        "gitBlobSha1": "f938136e3adacfd92be087f6e113b5d6d97f678f",
        "source": {
          "repository": "bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",
          "revision": "9531689a9d2da3897eae104ddf9fff92031a73d8",
          "path": "LICENSE"
        }
      },
      {
        "path": "NOTICE",
        "size": 581,
        "sha256": "86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",
        "gitBlobSha1": "1bc2737774933bab6a0c7b8c660c52aa4130cde2",
        "source": {
          "repository": "bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",
          "revision": "9531689a9d2da3897eae104ddf9fff92031a73d8",
          "path": "NOTICE"
        }
      },
      {
        "path": "EVALUATION.md",
        "size": 2359,
        "sha256": "caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",
        "gitBlobSha1": "01597ba5169c6ba2ff24e62739583306730adaee",
        "source": {
          "repository": "bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",
          "revision": "9531689a9d2da3897eae104ddf9fff92031a73d8",
          "path": "EVALUATION.md"
        }
      }
    ]
  },
  {
    "id": "qwen3.5-9b-claude-highiq-davidau-q4-k-m-gguf",
    "name": "Qwen3.5 9B Claude HighIQ Thinking Heretic (DavidAU via mradermacher Q4_K_M, text)",
    "repository": "mradermacher/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-GGUF",
    "revision": "84c2de4ce65b7bb33584521767646adf9663b128",
    "dtype": "q4_k_m",
    "sourceModel": {
      "repository": "DavidAU/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED",
      "revision": "22818ca1184f346094524bdd7cda7c7125009808"
    },
    "blockCount": 32,
    "nextnPredictLayers": 0,
    "behavior": {
      "kind": "heretic",
      "notice": "Publisher-described heretic fine-tune; not a guarantee of refusal-free output or factual accuracy. This is mradermacher's GGUF conversion of the requested DavidAU source. The browser adapter currently runs text only."
    },
    "files": [
      {
        "path": "Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED.Q4_K_M.gguf",
        "size": 5627045888,
        "sha256": "b16f38d00a26d9d1eeb191a5836b32982802ffa02819d0db2f5391ec1d53c06d"
      },
      {
        "path": "README.md",
        "size": 5730,
        "sha256": "eea5e514740c521432aec62a2d416ade44f881e197f95740cc376bc3ecfe430a",
        "gitBlobSha1": "fe0216b6798e17cf35bea52a3a2d74e42b14a24a",
        "source": {
          "repository": "mradermacher/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-GGUF",
          "revision": "84c2de4ce65b7bb33584521767646adf9663b128",
          "path": "README.md"
        }
      },
      {
        "path": "SOURCE_README.md",
        "size": 79602,
        "sha256": "0afc6c4508d99e8966cfd6164d6a3ea924c6781c97319223170c5c2f0abdef76",
        "gitBlobSha1": "979caec3d5beb4e54054aebae4316fbed5466b85",
        "source": {
          "repository": "DavidAU/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED",
          "revision": "22818ca1184f346094524bdd7cda7c7125009808",
          "path": "README.md"
        }
      },
      {
        "path": "LICENSE",
        "size": 11544,
        "sha256": "bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",
        "gitBlobSha1": "f938136e3adacfd92be087f6e113b5d6d97f678f",
        "source": {
          "repository": "Qwen/Qwen3.5-9B",
          "revision": "c202236235762e1c871ad0ccb60c8ee5ba337b9a",
          "path": "LICENSE"
        }
      }
    ]
  },
  {
    "id": "qwen3.5-9b-evil-mradermacher-q8-0-gguf",
    "name": "Qwen3.5 9B Evil (mradermacher GGUF Q8_0, experimental text)",
    "repository": "mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",
    "revision": "8f99fdb7e067bceb703544772e11e97e4e3ce3b3",
    "dtype": "q8_0",
    "sourceModel": {
      "repository": "bowmanslayer/Qwen3.5-9B-Evil-BF16",
      "revision": "b66fc0a575c13af75c5d438111559b04ed015cd4"
    },
    "blockCount": 33,
    "nextnPredictLayers": 1,
    "behavior": {
      "kind": "experimental-behavior-edit",
      "notice": "The publisher reports capability damage and potentially hostile responses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."
    },
    "files": [
      {
        "path": "Qwen3.5-9B-Evil-BF16.Q8_0.gguf",
        "size": 9786061312,
        "sha256": "e2315cbfae6702932ed2432435f5714e675bc670954bf6c05aa32303b07e7247"
      },
      {
        "path": "README.md",
        "size": 4035,
        "sha256": "2d11817c75831fd4bbeeb246e9df9ac2fedc9b37271d76565548361c09142707",
        "gitBlobSha1": "d9e21a7e37506aa283a95220b833a16367bfa953",
        "source": {
          "repository": "mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",
          "revision": "8f99fdb7e067bceb703544772e11e97e4e3ce3b3",
          "path": "README.md"
        }
      },
      {
        "path": "SOURCE_README.md",
        "size": 4098,
        "sha256": "b3c9dd4be451e8f5fc8b0aa1a95e4e8efdf7d60cd0e33e37a09b2143976fe7ce",
        "gitBlobSha1": "defa93374e1a853200ef4285739799fef5fe4e6c",
        "source": {
          "repository": "bowmanslayer/Qwen3.5-9B-Evil-BF16",
          "revision": "b66fc0a575c13af75c5d438111559b04ed015cd4",
          "path": "README.md"
        }
      },
      {
        "path": "LICENSE",
        "size": 11544,
        "sha256": "bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",
        "gitBlobSha1": "f938136e3adacfd92be087f6e113b5d6d97f678f",
        "source": {
          "repository": "bowmanslayer/Qwen3.5-9B-Evil-BF16",
          "revision": "b66fc0a575c13af75c5d438111559b04ed015cd4",
          "path": "LICENSE"
        }
      },
      {
        "path": "NOTICE",
        "size": 581,
        "sha256": "86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",
        "gitBlobSha1": "1bc2737774933bab6a0c7b8c660c52aa4130cde2",
        "source": {
          "repository": "bowmanslayer/Qwen3.5-9B-Evil-BF16",
          "revision": "b66fc0a575c13af75c5d438111559b04ed015cd4",
          "path": "NOTICE"
        }
      },
      {
        "path": "EVALUATION.md",
        "size": 2359,
        "sha256": "caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",
        "gitBlobSha1": "01597ba5169c6ba2ff24e62739583306730adaee",
        "source": {
          "repository": "bowmanslayer/Qwen3.5-9B-Evil-BF16",
          "revision": "b66fc0a575c13af75c5d438111559b04ed015cd4",
          "path": "EVALUATION.md"
        }
      }
    ]
  },
  {
    "id": "qwen3.5-9b-evil-mradermacher-q4-k-m-gguf",
    "name": "Qwen3.5 9B Evil (mradermacher GGUF Q4_K_M, experimental text)",
    "repository": "mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",
    "revision": "8f99fdb7e067bceb703544772e11e97e4e3ce3b3",
    "dtype": "q4_k_m",
    "sourceModel": {
      "repository": "bowmanslayer/Qwen3.5-9B-Evil-BF16",
      "revision": "b66fc0a575c13af75c5d438111559b04ed015cd4"
    },
    "blockCount": 33,
    "nextnPredictLayers": 1,
    "behavior": {
      "kind": "experimental-behavior-edit",
      "notice": "The publisher reports capability damage and potentially hostile responses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."
    },
    "files": [
      {
        "path": "Qwen3.5-9B-Evil-BF16.Q4_K_M.gguf",
        "size": 5780091392,
        "sha256": "cfdca30d8666ad7ddf25fa14c24e4e8967c191c70d122185d3bcb612f5f50c95"
      },
      {
        "path": "README.md",
        "size": 4035,
        "sha256": "2d11817c75831fd4bbeeb246e9df9ac2fedc9b37271d76565548361c09142707",
        "gitBlobSha1": "d9e21a7e37506aa283a95220b833a16367bfa953",
        "source": {
          "repository": "mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",
          "revision": "8f99fdb7e067bceb703544772e11e97e4e3ce3b3",
          "path": "README.md"
        }
      },
      {
        "path": "SOURCE_README.md",
        "size": 4098,
        "sha256": "b3c9dd4be451e8f5fc8b0aa1a95e4e8efdf7d60cd0e33e37a09b2143976fe7ce",
        "gitBlobSha1": "defa93374e1a853200ef4285739799fef5fe4e6c",
        "source": {
          "repository": "bowmanslayer/Qwen3.5-9B-Evil-BF16",
          "revision": "b66fc0a575c13af75c5d438111559b04ed015cd4",
          "path": "README.md"
        }
      },
      {
        "path": "LICENSE",
        "size": 11544,
        "sha256": "bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",
        "gitBlobSha1": "f938136e3adacfd92be087f6e113b5d6d97f678f",
        "source": {
          "repository": "bowmanslayer/Qwen3.5-9B-Evil-BF16",
          "revision": "b66fc0a575c13af75c5d438111559b04ed015cd4",
          "path": "LICENSE"
        }
      },
      {
        "path": "NOTICE",
        "size": 581,
        "sha256": "86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",
        "gitBlobSha1": "1bc2737774933bab6a0c7b8c660c52aa4130cde2",
        "source": {
          "repository": "bowmanslayer/Qwen3.5-9B-Evil-BF16",
          "revision": "b66fc0a575c13af75c5d438111559b04ed015cd4",
          "path": "NOTICE"
        }
      },
      {
        "path": "EVALUATION.md",
        "size": 2359,
        "sha256": "caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",
        "gitBlobSha1": "01597ba5169c6ba2ff24e62739583306730adaee",
        "source": {
          "repository": "bowmanslayer/Qwen3.5-9B-Evil-BF16",
          "revision": "b66fc0a575c13af75c5d438111559b04ed015cd4",
          "path": "EVALUATION.md"
        }
      }
    ]
  }
];

export const QWEN_9B_MODEL_CATALOG = freeze(Object.fromEntries(candidates.map((candidate) => {
  const { dtype, sourceModel, blockCount, nextnPredictLayers, ...entry } = candidate;
  const licenseFile = entry.files.find((file) => file.path === 'LICENSE');
  const licenseSource = licenseFile.source;
  return [entry.id, {
    ...entry, status: 'execution-candidate', format: 'GGUF',
    capabilities: { import: true, pin: true, peerHosting: true, browserInference: true,
      requiresCapabilityCheck: true, executionStatus: 'candidate',
      executionReason: 'Requires managed llama.cpp WebGPU, shader-f16, cross-origin isolation, shared WASM memory64/JSPI and memory admission. These exact files have not passed device execution validation.' },
    license: { spdx: 'Apache-2.0',
      sourceUrl: 'https://huggingface.co/' + licenseSource.repository + '/blob/' + licenseSource.revision + '/LICENSE',
      notice: 'The inherited Apache-2.0 license, conversion/source cards and available modification notices are included.' },
    provenance: { repository: entry.repository, revision: entry.revision, format: 'GGUF', metadataCheckedAt: '2026-11-03',
      modelCardUrl: 'https://huggingface.co/' + entry.repository + '/blob/' + entry.revision + '/README.md',
      sourceModel: { ...sourceModel, revisionPurpose: 'Pinned source documentation and license reference; the converter does not identify its exact source checkpoint revision.',
        conversionInputRevisionVerified: false },
      upstreamContextTokens: 262144,
      ggufHeader: { version: 3, architecture: 'qwen35', blockCount, nextnPredictLayers, inspectedPrefixBytes: 65536 },
      vision: 'Upstream vision metadata/projectors exist, but this text-only package omits the optional projector and the current managed GGUF adapter rejects images.',
      behavior: entry.behavior.notice },
    model: { runtime: 'llama.cpp', runtimeVersion: '3.8.1', architecture: 'qwen3_5', format: 'GGUF',
      task: 'text-generation', dtype, modalities: ['text'], requiredFeatures: ['shader-f16'],
      repository: entry.repository, revision: entry.revision },
    weightBytes: entry.files[0].size,
    totalBytes: entry.files.reduce((sum, file) => sum + file.size, 0),
  }];
})));
