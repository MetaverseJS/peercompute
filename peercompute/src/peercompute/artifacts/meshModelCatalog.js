import { foregroundFiles, foregroundLicense, foregroundConversionLicense } from './meshForegroundCatalog.js';
import { SF3D_MODEL_CATALOG } from './sf3dModelCatalog.js';
// Pinned model data only. Runtime execution is admitted separately by the worker.
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}
const alphaOnlyCatalog = freeze({
  'triposr-q8-onnx': {
  "id": "triposr-q8-onnx",
  "name": "TripoSR \u00b7 image to 3D (Q8)",
  "repository": "cgb/triposr-onnx-webgpu",
  "revision": "048725e957f485cc6bc082a9d6a239fcf7d8880a",
  "format": "ONNX",
  "status": "tested",
  "pipeline": "triposr",
  "architecture": "triposr",
  "dtype": "q8",
  "files": [
    {
      "path": "triplane_q8.onnx",
      "size": 885712,
      "sha256": "7721f5a45e79e02de8c6e909c21fb8e922fd0b594038a8fc1cfefa42c79ad6d5",
      "source": {
        "repository": "cgb/triposr-onnx-webgpu",
        "revision": "048725e957f485cc6bc082a9d6a239fcf7d8880a",
        "path": "triplane_q8.onnx"
      }
    },
    {
      "path": "triplane_q8.onnx.data",
      "size": 483785728,
      "sha256": "50bf9b1c1218dc2c7fb6051d0d2cb7a48a1c5f75cc86e67a9d0e09a931298e35",
      "source": {
        "repository": "cgb/triposr-onnx-webgpu",
        "revision": "048725e957f485cc6bc082a9d6a239fcf7d8880a",
        "path": "triplane_q8.onnx.data"
      }
    },
    {
      "path": "decoder.onnx",
      "size": 173796,
      "sha256": "6ff43581f1d2b46aa61764c2729a8d33985b51cb6c8088cf36ffee3fd70355eb",
      "source": {
        "repository": "cgb/triposr-onnx-webgpu",
        "revision": "048725e957f485cc6bc082a9d6a239fcf7d8880a",
        "path": "decoder.onnx"
      }
    },
    {
      "path": "README.md",
      "size": 3633,
      "sha256": "179a47df133504635c15498b74a7a700f80ed3d43aa12c864ad58539fc667a78",
      "source": {
        "repository": "cgb/triposr-onnx-webgpu",
        "revision": "048725e957f485cc6bc082a9d6a239fcf7d8880a",
        "path": "README.md"
      }
    }
  ],
  "license": {
    "spdx": "MIT",
    "sourceUrl": "https://github.com/VAST-AI-Research/TripoSR/blob/107cefdc244c39106fa830359024f6a2f1c78871/LICENSE",
    "notice": "MIT License\n\nCopyright (c) 2024 Tripo AI & Stability AI\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n"
  },
  "capabilities": {
    "import": true,
    "pin": true,
    "peerHosting": true,
    "browserInference": true,
    "requiresCapabilityCheck": true,
    "executionStatus": "tested",
    "executionReason": "Tested on NVIDIA WebGPU without shader-f16: real chair image to colored GLB locally and over encrypted inference v5, cancellation/recovery and source-off retained restart. Two CubeChat pages fetched and rendered the same CID; the owner restored it after reload without regeneration. Requires the managed ORT native WebGPU worker. Static objects only; no rigging or animation.",
    "executionEvidence": {
      "checkedAt": "2026-11-11",
      "scope": "local managed worker, encrypted v5 peer inference, and two CubeChat pages",
      "gpuArchitecture": "NVIDIA Blackwell",
      "shaderF16Required": false,
      "fixture": "TripoSR MIT chair.png",
      "meshSha256": "778fb251bd61ef74ee256622ffe5602d512f1455e8678911f91f866e67af6f24",
      "meshBytes": 590056,
      "triangles": 4908,
      "gpuDispatches": 1207,
      "cancellationRecovery": true,
      "retainedRestart": true,
      "peerExecution": "tested",
      "peerProtocol": "/peercompute/inference/5.0.0",
      "peerCancellationRecovery": true,
      "peerOutputMatchesLocal": true,
      "cubeChat": {
        "pages": 2,
        "sameArtifactCid": true,
        "renderedOnBothPages": true,
        "ownerReloadWithoutGeneration": true,
        "unpinnedObserverCacheCollected": true
      }
    }
  },
  "provenance": {
    "repository": "cgb/triposr-onnx-webgpu",
    "revision": "048725e957f485cc6bc082a9d6a239fcf7d8880a",
    "format": "ONNX",
    "metadataCheckedAt": "2026-11-11",
    "modelCardUrl": "https://huggingface.co/cgb/triposr-onnx-webgpu/blob/048725e957f485cc6bc082a9d6a239fcf7d8880a/README.md"
  },
  "model": {
    "runtime": "onnx-mesh",
    "runtimeVersion": "1.31.1",
    "task": "image-to-3d",
    "format": "ONNX",
    "pipeline": "triposr",
    "architecture": "triposr",
    "dtype": "q8",
    "modalities": [
      "image"
    ],
    "outputModalities": [
      "mesh"
    ],
    "requiredFeatures": [],
    "repository": "cgb/triposr-onnx-webgpu",
    "revision": "048725e957f485cc6bc082a9d6a239fcf7d8880a",
    "resolution": 64,
    "densityThreshold": 25,
    "radius": 0.87,
    "imageSize": 512,
    "foregroundRatio": 0.85
  },
  "weightBytes": 484845236,
  "totalBytes": 484848869
}
});

// Saved alpha-only packages retain their exact admission contract, but are not
// offered as a second catalog option. Opaque inputs require the current package.
export const LEGACY_MESH_PACKAGES = freeze(Object.values(alphaOnlyCatalog));
const legacy = alphaOnlyCatalog['triposr-q8-onnx'];
export const MESH_MODEL_CATALOG = freeze({
  'triposr-q8-onnx': {
    ...legacy,
    model: { ...legacy.model, backgroundRemoval: 'u2netp' },
    files: [...legacy.files, ...foregroundFiles],
    weightBytes: legacy.weightBytes + foregroundFiles[0].size,
    totalBytes: legacy.totalBytes + foregroundFiles.reduce((sum, file) => sum + file.size, 0),
    license: { spdx: 'MIT AND Apache-2.0', sourceUrl: legacy.license.sourceUrl,
      notice: 'TripoSR © 2024 Tripo AI & Stability AI (MIT). U²-Net weights: Apache-2.0; rembg distribution © 2020 Daniel Gatis (MIT). Full original license texts are retained in this package.',
      components: [legacy.license, foregroundLicense, foregroundConversionLicense] },
    provenance: { ...legacy.provenance, foreground: {
      repository: 'edgetools/u2netp', revision: '25dee37ab19c5b6ad64ba6578eba63f1ae07720c',
      sourceUrl: 'https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx',
      modelCardUrl: 'https://huggingface.co/edgetools/u2netp/blob/25dee37ab19c5b6ad64ba6578eba63f1ae07720c/README.md',
      sha256: foregroundFiles[0].sha256, licenseUrl: foregroundLicense.sourceUrl,
    } },
    capabilities: { ...legacy.capabilities, executionStatus: 'tested',
      executionReason: 'Tested in the managed WebGPU worker: actual CubeChat owner chat through peer Qwen and DreamShaper to U2NetP foreground removal and TripoSR. Both CubeChat peers displayed the same isolated chair CID; owner reload restored it without regeneration. Static, coarse geometry; no rigging or animation. No shader-f16 required.',
      executionEvidence: { checkedAt: '2026-11-11',
        scope: 'Actual owner chat, peer language/image/3D inference, two CubeChat pages and retained object reload',
        shaderF16Required: false, foregroundModel: 'u2netp', input: 'Opaque DreamShaper 512x512 RGBA chair',
        meshSha256: '277a963c5b9b66361f7ef7e43deea2fc5e90b770f5897def6b58ea83f186ae16',
        meshBytes: 883820, triangles: 7356, peerExecution: 'tested', peerProtocol: '/peercompute/inference/5.0.0',
        cubeChat: { pages: 2, sameArtifactCid: true, renderedOnBothPages: true,
          ownerReloadWithoutGeneration: true, unpinnedObserverCacheCollected: true },
      } },
  },
  ...SF3D_MODEL_CATALOG,
});

export function meshModelFileUrl(modelId, path) {
  const file = MESH_MODEL_CATALOG[modelId]?.files.find(entry => entry.path === path);
  if (!file) throw new Error('Unknown catalog 3D model file');
  const source = file.source;
  return `https://huggingface.co/${source.repository}/resolve/${source.revision}/${source.path.split('/').map(encodeURIComponent).join('/')}`;
}
