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
const foregroundFiles = [
  {
    "path": "u2netp.onnx",
    "size": 4574861,
    "sha256": "309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8",
    "source": {
      "repository": "edgetools/u2netp",
      "revision": "25dee37ab19c5b6ad64ba6578eba63f1ae07720c",
      "path": "u2netp.onnx"
    }
  },
  {
    "path": "u2netp.README.md",
    "size": 2597,
    "sha256": "e447db65818dba51c001c1a5c9fc43c56c5c60e5ed2cd858c2bad3a239847ef4",
    "source": {
      "repository": "edgetools/u2netp",
      "revision": "25dee37ab19c5b6ad64ba6578eba63f1ae07720c",
      "path": "README.md"
    }
  }
];
const foregroundLicense = {
  "spdx": "Apache-2.0",
  "sourceUrl": "https://raw.githubusercontent.com/xuebinqin/U-2-Net/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29/LICENSE",
  "notice": "                                 Apache License\n                           Version 2.0, January 2004\n                        http://www.apache.org/licenses/\n\n   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION\n\n   1. Definitions.\n\n      \"License\" shall mean the terms and conditions for use, reproduction,\n      and distribution as defined by Sections 1 through 9 of this document.\n\n      \"Licensor\" shall mean the copyright owner or entity authorized by\n      the copyright owner that is granting the License.\n\n      \"Legal Entity\" shall mean the union of the acting entity and all\n      other entities that control, are controlled by, or are under common\n      control with that entity. For the purposes of this definition,\n      \"control\" means (i) the power, direct or indirect, to cause the\n      direction or management of such entity, whether by contract or\n      otherwise, or (ii) ownership of fifty percent (50%) or more of the\n      outstanding shares, or (iii) beneficial ownership of such entity.\n\n      \"You\" (or \"Your\") shall mean an individual or Legal Entity\n      exercising permissions granted by this License.\n\n      \"Source\" form shall mean the preferred form for making modifications,\n      including but not limited to software source code, documentation\n      source, and configuration files.\n\n      \"Object\" form shall mean any form resulting from mechanical\n      transformation or translation of a Source form, including but\n      not limited to compiled object code, generated documentation,\n      and conversions to other media types.\n\n      \"Work\" shall mean the work of authorship, whether in Source or\n      Object form, made available under the License, as indicated by a\n      copyright notice that is included in or attached to the work\n      (an example is provided in the Appendix below).\n\n      \"Derivative Works\" shall mean any work, whether in Source or Object\n      form, that is based on (or derived from) the Work and for which the\n      editorial revisions, annotations, elaborations, or other modifications\n      represent, as a whole, an original work of authorship. For the purposes\n      of this License, Derivative Works shall not include works that remain\n      separable from, or merely link (or bind by name) to the interfaces of,\n      the Work and Derivative Works thereof.\n\n      \"Contribution\" shall mean any work of authorship, including\n      the original version of the Work and any modifications or additions\n      to that Work or Derivative Works thereof, that is intentionally\n      submitted to Licensor for inclusion in the Work by the copyright owner\n      or by an individual or Legal Entity authorized to submit on behalf of\n      the copyright owner. For the purposes of this definition, \"submitted\"\n      means any form of electronic, verbal, or written communication sent\n      to the Licensor or its representatives, including but not limited to\n      communication on electronic mailing lists, source code control systems,\n      and issue tracking systems that are managed by, or on behalf of, the\n      Licensor for the purpose of discussing and improving the Work, but\n      excluding communication that is conspicuously marked or otherwise\n      designated in writing by the copyright owner as \"Not a Contribution.\"\n\n      \"Contributor\" shall mean Licensor and any individual or Legal Entity\n      on behalf of whom a Contribution has been received by Licensor and\n      subsequently incorporated within the Work.\n\n   2. Grant of Copyright License. Subject to the terms and conditions of\n      this License, each Contributor hereby grants to You a perpetual,\n      worldwide, non-exclusive, no-charge, royalty-free, irrevocable\n      copyright license to reproduce, prepare Derivative Works of,\n      publicly display, publicly perform, sublicense, and distribute the\n      Work and such Derivative Works in Source or Object form.\n\n   3. Grant of Patent License. Subject to the terms and conditions of\n      this License, each Contributor hereby grants to You a perpetual,\n      worldwide, non-exclusive, no-charge, royalty-free, irrevocable\n      (except as stated in this section) patent license to make, have made,\n      use, offer to sell, sell, import, and otherwise transfer the Work,\n      where such license applies only to those patent claims licensable\n      by such Contributor that are necessarily infringed by their\n      Contribution(s) alone or by combination of their Contribution(s)\n      with the Work to which such Contribution(s) was submitted. If You\n      institute patent litigation against any entity (including a\n      cross-claim or counterclaim in a lawsuit) alleging that the Work\n      or a Contribution incorporated within the Work constitutes direct\n      or contributory patent infringement, then any patent licenses\n      granted to You under this License for that Work shall terminate\n      as of the date such litigation is filed.\n\n   4. Redistribution. You may reproduce and distribute copies of the\n      Work or Derivative Works thereof in any medium, with or without\n      modifications, and in Source or Object form, provided that You\n      meet the following conditions:\n\n      (a) You must give any other recipients of the Work or\n          Derivative Works a copy of this License; and\n\n      (b) You must cause any modified files to carry prominent notices\n          stating that You changed the files; and\n\n      (c) You must retain, in the Source form of any Derivative Works\n          that You distribute, all copyright, patent, trademark, and\n          attribution notices from the Source form of the Work,\n          excluding those notices that do not pertain to any part of\n          the Derivative Works; and\n\n      (d) If the Work includes a \"NOTICE\" text file as part of its\n          distribution, then any Derivative Works that You distribute must\n          include a readable copy of the attribution notices contained\n          within such NOTICE file, excluding those notices that do not\n          pertain to any part of the Derivative Works, in at least one\n          of the following places: within a NOTICE text file distributed\n          as part of the Derivative Works; within the Source form or\n          documentation, if provided along with the Derivative Works; or,\n          within a display generated by the Derivative Works, if and\n          wherever such third-party notices normally appear. The contents\n          of the NOTICE file are for informational purposes only and\n          do not modify the License. You may add Your own attribution\n          notices within Derivative Works that You distribute, alongside\n          or as an addendum to the NOTICE text from the Work, provided\n          that such additional attribution notices cannot be construed\n          as modifying the License.\n\n      You may add Your own copyright statement to Your modifications and\n      may provide additional or different license terms and conditions\n      for use, reproduction, or distribution of Your modifications, or\n      for any such Derivative Works as a whole, provided Your use,\n      reproduction, and distribution of the Work otherwise complies with\n      the conditions stated in this License.\n\n   5. Submission of Contributions. Unless You explicitly state otherwise,\n      any Contribution intentionally submitted for inclusion in the Work\n      by You to the Licensor shall be under the terms and conditions of\n      this License, without any additional terms or conditions.\n      Notwithstanding the above, nothing herein shall supersede or modify\n      the terms of any separate license agreement you may have executed\n      with Licensor regarding such Contributions.\n\n   6. Trademarks. This License does not grant permission to use the trade\n      names, trademarks, service marks, or product names of the Licensor,\n      except as required for reasonable and customary use in describing the\n      origin of the Work and reproducing the content of the NOTICE file.\n\n   7. Disclaimer of Warranty. Unless required by applicable law or\n      agreed to in writing, Licensor provides the Work (and each\n      Contributor provides its Contributions) on an \"AS IS\" BASIS,\n      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or\n      implied, including, without limitation, any warranties or conditions\n      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A\n      PARTICULAR PURPOSE. You are solely responsible for determining the\n      appropriateness of using or redistributing the Work and assume any\n      risks associated with Your exercise of permissions under this License.\n\n   8. Limitation of Liability. In no event and under no legal theory,\n      whether in tort (including negligence), contract, or otherwise,\n      unless required by applicable law (such as deliberate and grossly\n      negligent acts) or agreed to in writing, shall any Contributor be\n      liable to You for damages, including any direct, indirect, special,\n      incidental, or consequential damages of any character arising as a\n      result of this License or out of the use or inability to use the\n      Work (including but not limited to damages for loss of goodwill,\n      work stoppage, computer failure or malfunction, or any and all\n      other commercial damages or losses), even if such Contributor\n      has been advised of the possibility of such damages.\n\n   9. Accepting Warranty or Additional Liability. While redistributing\n      the Work or Derivative Works thereof, You may choose to offer,\n      and charge a fee for, acceptance of support, warranty, indemnity,\n      or other liability obligations and/or rights consistent with this\n      License. However, in accepting such obligations, You may act only\n      on Your own behalf and on Your sole responsibility, not on behalf\n      of any other Contributor, and only if You agree to indemnify,\n      defend, and hold each Contributor harmless for any liability\n      incurred by, or claims asserted against, such Contributor by reason\n      of your accepting any such warranty or additional liability.\n\n   END OF TERMS AND CONDITIONS\n\n   APPENDIX: How to apply the Apache License to your work.\n\n      To apply the Apache License to your work, attach the following\n      boilerplate notice, with the fields enclosed by brackets \"[]\"\n      replaced with your own identifying information. (Don't include\n      the brackets!)  The text should be enclosed in the appropriate\n      comment syntax for the file format. We also recommend that a\n      file or class name and description of purpose be included on the\n      same \"printed page\" as the copyright notice for easier\n      identification within third-party archives.\n\n   Copyright [yyyy] [name of copyright owner]\n\n   Licensed under the Apache License, Version 2.0 (the \"License\");\n   you may not use this file except in compliance with the License.\n   You may obtain a copy of the License at\n\n       http://www.apache.org/licenses/LICENSE-2.0\n\n   Unless required by applicable law or agreed to in writing, software\n   distributed under the License is distributed on an \"AS IS\" BASIS,\n   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n   See the License for the specific language governing permissions and\n   limitations under the License.\n"
};
const foregroundConversionLicense = {
  "spdx": "MIT",
  "sourceUrl": "https://raw.githubusercontent.com/danielgatis/rembg/991927b77667946dab59c50df31f7d4640e80457/LICENSE.txt",
  "notice": "MIT License\n\nCopyright (c) 2020 Daniel Gatis\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n"
};
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
});

export function meshModelFileUrl(modelId, path) {
  const file = MESH_MODEL_CATALOG[modelId]?.files.find(entry => entry.path === path);
  if (!file) throw new Error('Unknown catalog 3D model file');
  const source = file.source;
  return `https://huggingface.co/${source.repository}/resolve/${source.revision}/${source.path.split('/').map(encodeURIComponent).join('/')}`;
}
