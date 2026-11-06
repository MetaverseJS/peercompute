// Immutable HF metadata and selected q4 closures; runtime acceptance is a separate gate.
// q4 uses float32 activations/cache; q4f16 variants are deliberately not selected.
function freeze(value) {
  for (const item of Object.values(value)) if (item && typeof item === 'object') freeze(item);
  return Object.freeze(value);
}

export const ADDITIONAL_MODEL_CATALOG = freeze({
  "nemotron-3-nano-4b-q4": {
    "id": "nemotron-3-nano-4b-q4",
    "name": "Nemotron 3 Nano 4B (q4)",
    "description": "General text chat and reasoning. The tested q4 package runs without shader-f16.",
    "repository": "onnx-community/NVIDIA-Nemotron-3-Nano-4B-BF16-ONNX",
    "revision": "e7b8ae592fe95507bf8c5ffec6c8f2da8caae778",
    "status": "candidate",
    "license": {
      "spdx": "LicenseRef-NVIDIA-Nemotron-Open-Model-License",
      "name": "NVIDIA Nemotron Open Model License",
      "sourceUrl": "https://www.nvidia.com/en-us/agreements/enterprise-software/nvidia-nemotron-open-model-license/",
      "notice": "Preserve the NVIDIA license and applicable upstream notices. The complete upstream license is retained below in package metadata.",
      "text": "NVIDIA Nemotron Open Model License\nLast Modified: December 15, 2025\nTERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION\nNVIDIA Works released under this License are intended to be used permissively and enable the further development of AI technologies. Subject to the terms of this License, NVIDIA confirms that:\nWorks are commercially usable.\nYou are free to create and distribute Derivative Works.\nNVIDIA does not claim ownership to any outputs generated using the Works or Derivative Works.\nBy using, reproducing, modifying, distributing, performing or displaying any portion or element of the Works or Derivative Works, or otherwise accepting the terms of this License, you agree to be bound by this License.\n1. Definitions\n.\n“\nLicense\n” shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 10 of this document.\n“\nLegal Entity\n” shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity. For the purposes of this definition, \"\ncontrol\n\" means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of such entity.\n“\nYou\n” (or “\nYour\n”) shall mean an individual or Legal Entity exercising permissions granted by this License.\n“\nWork\n” shall mean the work of authorship, including machine learning model, software, checkpoints, learnt weights, algorithms, parameters, configuration files and documentation, made available under the License, as indicated by a copyright notice that is included in or attached to the work (an example is provided in the Appendix below).\n“\nDerivative Works\n” shall mean any work, whether in source or object form, that is based on (or derived from) the Work and for which the editorial revisions, annotations, elaborations, or other modifications represent, as a whole, an original work of authorship. For the purposes of this License, Derivative Works shall not include works that remain separable from, or merely link (or bind by name) to the interfaces of, the Work and Derivative Works thereof.\n2. Grant of License\n. Subject to the terms and conditions of this License, NVIDIA hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in source or object form.\nIf You institute patent or copyright litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Work or an output from the Work constitutes direct or contributory patent or copyright infringement, then any licenses granted to You under this License for that Work shall terminate as of the date such litigation is filed.\n3. Redistribution\n. You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in source or object form, provided that You meet the following conditions:\na. You must give any other recipients of the Work a copy of this License; and\nb. You must retain, in the source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the source form of the Work, excluding those notices that do not pertain to any part of the Derivative Works; and\nc. If the Work includes a \"\nNOTICE\n\" text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the following attribution notice within a “Notice” text file with such copies and the following statement: “Licensed by NVIDIA Corporation under the NVIDIA Nemotron Model License.”\nYou may add Your own copyright statement to Your modifications and may provide additional or different license terms and conditions for use, reproduction, or distribution of Your modifications, or for any such Derivative Works as a whole, provided Your use, reproduction, and distribution of the Work otherwise complies with the conditions stated in this License.\n4. Trademarks\n. This License does not grant permission to use the trade names, trademarks, service marks, or product names of NVIDIA, except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of the NOTICE file.\n5. Disclaimer of Warranty. Unless required by applicable law or agreed to in writing, NVIDIA provides the Work on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.\n6. Limitation of Liability. In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, unless required by applicable law (such as deliberate and grossly negligent acts) or agreed to in writing, shall NVIDIA be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages of any character arising as a result of this License or out of the use or inability to use the Work, a Derivative Work or an output from the Work or Derivative Work (including but not limited to damages for loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses), even if NVIDIA has been advised of the possibility of such damages.\n7.\nAccepting Warranty or Additional Liability\n. While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance of support, warranty, indemnity, or other liability obligations and/or rights consistent with this License. However, in accepting such obligations, You may act only on Your own behalf and on Your sole responsibility, not on behalf of NVIDIA, and only if You agree to indemnify, defend, and hold NVIDIA harmless for any liability incurred by, or claims asserted against, NVIDIA by reason of your accepting any such warranty or additional liability. You will indemnify and hold harmless NVIDIA from and against any claim by any third party arising out of or related to your use or distribution of the Works, Derivative Works thereof, or output from the Works or Derivative Works.\n8. Feedback\n. NVIDIA appreciates your feedback, and You agree that NVIDIA may use it without restriction or compensation to You.\n9. Governing Law\n. This Agreement will be governed in all respects by the laws of the United States and the laws of the State of Delaware, without regard to conflict of laws principles or the United Nations Convention on Contracts for the International Sale of Goods. The state and federal courts residing in Santa Clara County, California will have exclusive jurisdiction over any dispute or claim arising out of or related to this Agreement, and the parties irrevocably consent to personal jurisdiction and venue in those courts; except that, either party may apply for injunctive remedies or an equivalent type of urgent legal relief in any jurisdiction.\n10. Trade and Compliance\n. You agree to comply with all applicable export, import, trade and economic sanctions laws and regulations, as amended, including without limitation U.S. Export Administration Regulations and Office of Foreign Assets Control regulations. These laws include restrictions on destinations, end-users and end-use.\n(v. December 15, 2025)\nEND OF TERMS AND CONDITIONS\n",
      "conversionLicenseReviewRequired": true
    },
    "files": [
      {
        "path": "README.md",
        "size": 59,
        "gitBlobSha1": "0fe812a8be3efed9aebeedbebf7d5cfbeb596187",
        "sha256": "95a8cadf9e7f520c19f125b60af384122668d574944f05729da77f5dd5cd7d61"
      },
      {
        "path": "chat_template.jinja",
        "size": 10504,
        "gitBlobSha1": "67ca3ce54a7118ed74d6fd793b7cc9fd6b2a9f03"
      },
      {
        "path": "config.json",
        "size": 2548,
        "gitBlobSha1": "8e22283a8b127ed4e640cd7f53d9c7df6d72d9ff",
        "sha256": "531f07c24e8fa95c98021bd15b1234bffef932f522ee7f884dbc1208164d2778"
      },
      {
        "path": "generation_config.json",
        "size": 225,
        "gitBlobSha1": "120ef7aa776e001bb08fd741a34c44409bcaca33"
      },
      {
        "path": "onnx/model_q4.onnx",
        "size": 1375895,
        "sha256": "a36fa995d2c2480a327b83fadb1c671ae3413f325a1818a08cd2581636dfce32"
      },
      {
        "path": "onnx/model_q4.onnx_data",
        "size": 2089224480,
        "sha256": "5a821bd8f141b598da0484922a89fa2d50b21194ad445183646a8b7b70e05378"
      },
      {
        "path": "onnx/model_q4.onnx_data_1",
        "size": 465316544,
        "sha256": "121ad945313f542c114fe7f6b61c13be5a087f7d406dc0192286e95b326efde4"
      },
      {
        "path": "tokenizer.json",
        "size": 12602824,
        "sha256": "878898e20236838546cc0793228b0e8c2c9b3f64d35bfebb0b8dadaf97205e6e"
      },
      {
        "path": "tokenizer_config.json",
        "size": 11204,
        "gitBlobSha1": "382b269bdec975d3584df6c21c1c2d8b306a64d1"
      }
    ],
    "totalBytes": 2568544283,
    "weightBytes": 2555916919,
    "model": {
      "runtime": "transformers.js",
      "runtimeVersion": "4.3.2",
      "architecture": "nemotron_h",
      "task": "text-generation",
      "dtype": "q4",
      "modalities": [
        "text"
      ],
      "requiredFeatures": [],
      "repository": "onnx-community/NVIDIA-Nemotron-3-Nano-4B-BF16-ONNX",
      "revision": "e7b8ae592fe95507bf8c5ffec6c8f2da8caae778",
      "memoryProfile": {
        "schema": "peercompute.onnx.memory.v1",
        "architecture": "nemotron_h",
        "layers": 42,
        "hiddenSize": 3136,
        "heads": 40,
        "kvHeads": 8,
        "headDim": 128,
        "vocabulary": 131072,
        "attentionLayers": 4,
        "recurrentLayers": 21,
        "convChannels": 9728,
        "convKernel": 4,
        "ssmHeads": 96,
        "ssmHeadDim": 80,
        "stateSize": 128
      }
    },
    "provenance": {
      "repository": "onnx-community/NVIDIA-Nemotron-3-Nano-4B-BF16-ONNX",
      "revision": "e7b8ae592fe95507bf8c5ffec6c8f2da8caae778",
      "format": "ONNX",
      "metadataCheckedAt": "2026-11-05",
      "modelCardUrl": "https://huggingface.co/onnx-community/NVIDIA-Nemotron-3-Nano-4B-BF16-ONNX/blob/e7b8ae592fe95507bf8c5ffec6c8f2da8caae778/README.md",
      "sourceRepository": "nvidia/NVIDIA-Nemotron-3-Nano-4B-BF16",
      "sourceRevision": "dfaf35de3e30f1867dd8dbc38a7fc9fb52d3914f",
      "sourceModelCardUrl": "https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-4B-BF16/blob/dfaf35de3e30f1867dd8dbc38a7fc9fb52d3914f/README.md"
    }
  },
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
