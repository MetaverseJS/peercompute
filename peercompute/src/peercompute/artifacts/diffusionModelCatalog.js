// Data-only packages. Execution status belongs to device evidence, never a model CID.
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}
const candidates = [
  {
    "id": "sd-turbo-onnx",
    "name": "Stable Diffusion Turbo (ONNX FP16)",
    "repository": "schmuell/sd-turbo-ort-web",
    "revision": "ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",
    "pipeline": "sd-turbo",
    "architecture": "stable-diffusion-2",
    "dtype": "fp16",
    "steps": 1,
    "padTokenId": 0,
    "files": [
      {
        "path": "text_encoder/model.onnx",
        "size": 681393168,
        "sha256": "5d1f5bd3286abf26313a9e87db6fd32e47d8b1b2a84ffdf470884c3fe89497c4",
        "source": {
          "repository": "schmuell/sd-turbo-ort-web",
          "revision": "ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",
          "path": "text_encoder/model.onnx"
        }
      },
      {
        "path": "unet/model.onnx",
        "size": 1733430199,
        "sha256": "7468133d9f7babec9cf6636e160188fe25aad206792c0abdaa722edc676963c4",
        "source": {
          "repository": "schmuell/sd-turbo-ort-web",
          "revision": "ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",
          "path": "unet/model.onnx"
        }
      },
      {
        "path": "vae_decoder/model.onnx",
        "size": 99094314,
        "sha256": "b37a85f91a982811957abd6cfb617499742309f7b8e253240da3132e533a7605",
        "source": {
          "repository": "schmuell/sd-turbo-ort-web",
          "revision": "ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",
          "path": "vae_decoder/model.onnx"
        }
      },
      {
        "path": "tokenizer/tokenizer.json",
        "size": 2224081,
        "sha256": "72ed5c96db5729294468543e4bc75fce14ca63f58e37300290189ba1c1e52b85",
        "gitBlobSha1": "f9d4455c06f24d31797f7cd3e480a83d7a84cb97",
        "source": {
          "repository": "Xenova/clip-vit-base-patch16",
          "revision": "342fdf2f67aded64d138ff074745fb4a5d2bba5f",
          "path": "tokenizer.json"
        }
      },
      {
        "path": "tokenizer/tokenizer_config.json",
        "size": 775,
        "sha256": "60ba2912bc6344c94bc16bbdec27fa1209409167b6f2fdf3cfe9e65462ea3967",
        "gitBlobSha1": "c9b2a711cbdd039529fa5a66f1965e13eb14451d",
        "source": {
          "repository": "Xenova/clip-vit-base-patch16",
          "revision": "342fdf2f67aded64d138ff074745fb4a5d2bba5f",
          "path": "tokenizer_config.json"
        }
      },
      {
        "path": "README.md",
        "size": 195,
        "sha256": "ca7ae65e0f226f01cbf95e8e6b4c8f5d98e81648bd2b66280945cbf41311c72e",
        "gitBlobSha1": "5a4d6e3602769d994918631e6b849ef77a8a5d03",
        "source": {
          "repository": "schmuell/sd-turbo-ort-web",
          "revision": "ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",
          "path": "README.md"
        }
      },
      {
        "path": "LICENSE",
        "size": 7300,
        "sha256": "305bafee60b129e25bda0745e06ac3c06b496b50ad61bda6265f8d57003f8aca",
        "gitBlobSha1": "ae44226e8f243c81374e8bc09ea207dbf601eb3d",
        "source": {
          "repository": "schmuell/sd-turbo-ort-web",
          "revision": "ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",
          "path": "LICENSE"
        }
      }
    ],
    "license": {
      "spdx": "LicenseRef-StabilityAI-NonCommercial-Research",
      "sourceUrl": "https://huggingface.co/schmuell/sd-turbo-ort-web/blob/ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1/LICENSE",
      "notice": "This pinned converted artifact includes the November 2023 Stability AI Non-Commercial Research Community license; do not relabel it as the newer upstream Community license."
    }
  },
  {
    "id": "dreamshaper-8-lcm-int8-onnx",
    "name": "DreamShaper 8 LCM (SD 1.5, INT8 weights)",
    "repository": "skillsafeai/dreamshaper-8-lcm-onnx-webgpu",
    "revision": "a310400909a293a7a937a54854910ed06469192b",
    "pipeline": "lcm",
    "architecture": "stable-diffusion-1",
    "dtype": {
      "text_encoder": "fp16",
      "unet": "fp16",
      "vae_decoder": "fp32"
    },
    "weightQuantization": "int8-per-channel",
    "steps": 4,
    "padTokenId": 49407,
    "files": [
      {
        "path": "text_encoder/model.onnx",
        "size": 123612877,
        "sha256": "ff9bd0225990f6827682cfe37cf95912135e4f84945ba7f3abfe70a19eeff8fb",
        "source": {
          "repository": "skillsafeai/dreamshaper-8-lcm-onnx-webgpu",
          "revision": "a310400909a293a7a937a54854910ed06469192b",
          "path": "int8/text_encoder_int8.onnx"
        }
      },
      {
        "path": "unet/model.onnx",
        "size": 861356871,
        "sha256": "a6bab857c28d27ac914a2d8e731011c0d9b361da7553efc6117e04f722e9f4ca",
        "source": {
          "repository": "skillsafeai/dreamshaper-8-lcm-onnx-webgpu",
          "revision": "a310400909a293a7a937a54854910ed06469192b",
          "path": "int8/unet_int8.onnx"
        }
      },
      {
        "path": "vae_decoder/model.onnx",
        "size": 49791103,
        "sha256": "7556dbb3d599dbad393dc598b8bf28874245b721aa581f321dfbd0f7211f37d2",
        "source": {
          "repository": "skillsafeai/dreamshaper-8-lcm-onnx-webgpu",
          "revision": "a310400909a293a7a937a54854910ed06469192b",
          "path": "int8/vae_decoder_int8.onnx"
        }
      },
      {
        "path": "tokenizer/tokenizer.json",
        "size": 2224081,
        "sha256": "72ed5c96db5729294468543e4bc75fce14ca63f58e37300290189ba1c1e52b85",
        "gitBlobSha1": "f9d4455c06f24d31797f7cd3e480a83d7a84cb97",
        "source": {
          "repository": "Xenova/clip-vit-base-patch16",
          "revision": "342fdf2f67aded64d138ff074745fb4a5d2bba5f",
          "path": "tokenizer.json"
        }
      },
      {
        "path": "tokenizer/tokenizer_config.json",
        "size": 775,
        "sha256": "60ba2912bc6344c94bc16bbdec27fa1209409167b6f2fdf3cfe9e65462ea3967",
        "gitBlobSha1": "c9b2a711cbdd039529fa5a66f1965e13eb14451d",
        "source": {
          "repository": "Xenova/clip-vit-base-patch16",
          "revision": "342fdf2f67aded64d138ff074745fb4a5d2bba5f",
          "path": "tokenizer_config.json"
        }
      },
      {
        "path": "README.md",
        "size": 3075,
        "sha256": "7494dee7114e1b1875c7a06f12a908b7ff9d00727785b956e815c066df14a8f6",
        "gitBlobSha1": "97a713da99d2baeb8c6312b9238f860530f98eb5",
        "source": {
          "repository": "skillsafeai/dreamshaper-8-lcm-onnx-webgpu",
          "revision": "a310400909a293a7a937a54854910ed06469192b",
          "path": "README.md"
        }
      },
      {
        "path": "LICENSE.md",
        "size": 14465,
        "sha256": "84804f0a5d78ed48992f7a6640ee6165877ccf9e704669713cababf65558cf4a",
        "gitBlobSha1": "209d7dfbc3b54a404985665a3bf0721d6c53f4d6",
        "source": {
          "repository": "Heliosoph/dreamshaper-cfg-onnx",
          "revision": "c07d9ea3c46471649e10b0900a6ec1f785420df4",
          "path": "LICENSE.md"
        }
      }
    ],
    "license": {
      "spdx": "CreativeML-OpenRAIL-M",
      "sourceUrl": "https://huggingface.co/skillsafeai/dreamshaper-8-lcm-onnx-webgpu/blob/a310400909a293a7a937a54854910ed06469192b/README.md",
      "notice": "CreativeML Open RAIL-M retains use restrictions. The complete license text is included from a pinned DreamShaper ONNX export. Local image generation is not a guarantee of unrestricted content."
    },
    "provenance": {
      "baseRepository": "Lykon/dreamshaper-8-lcm",
      "baseRevision": "4645d8bc6a8e6b106d21606d63e8460cdad4f1a6"
    }
  }
];

export const DIFFUSION_MODEL_CATALOG = freeze(Object.fromEntries(candidates.map((entry) => [entry.id, {
  ...entry, status: 'execution-candidate', format: 'ONNX',
  capabilities: { import: true, pin: true, peerHosting: true, browserInference: true,
    requiresCapabilityCheck: true, executionStatus: 'candidate',
    executionReason: 'Requires hardware WebGPU with shader-f16 and an admitted managed ONNX diffusion worker. Device execution must be verified.' },
  provenance: { ...entry.provenance, repository: entry.repository, revision: entry.revision, format: 'ONNX',
    metadataCheckedAt: '2026-11-03', modelCardUrl: `https://huggingface.co/${entry.repository}/blob/${entry.revision}/README.md`,
    fileSources: Object.fromEntries(entry.files.map((file) => [file.path, file.source])),
  },
  model: { runtime: 'onnx-diffusion', runtimeVersion: '1.31.1', architecture: entry.architecture, format: 'ONNX',
    task: 'text-to-image', pipeline: entry.pipeline, dtype: entry.dtype,
    ...(entry.weightQuantization ? { weightQuantization: entry.weightQuantization } : {}),
    modalities: ['text'], outputModalities: ['image'], requiredFeatures: ['shader-f16'],
    width: 512, height: 512, steps: entry.steps, padTokenId: entry.padTokenId,
    repository: entry.repository, revision: entry.revision },
  weightBytes: entry.files.filter((file) => file.path.endsWith('.onnx')).reduce((sum, file) => sum + file.size, 0),
  totalBytes: entry.files.reduce((sum, file) => sum + file.size, 0),
}])));

export function diffusionModelFileUrl(modelId, path) {
  const entry = DIFFUSION_MODEL_CATALOG[modelId];
  const file = entry?.files.find((file) => file.path === path);
  if (!file) throw new Error('Unknown catalog diffusion model file.');
  const source = file.source;
  return `https://huggingface.co/${source.repository}/resolve/${source.revision}/${source.path.split('/').map(encodeURIComponent).join('/')}`;
}
