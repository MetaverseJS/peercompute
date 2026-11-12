import { foregroundFiles, foregroundLicense, foregroundConversionLicense } from './meshForegroundCatalog.js';

// Immutable publisher revisions and SHA-bound data; no package can select runtime code.
const packageFiles = [
  {
    "path": "weights.bin",
    "size": 2285308688,
    "sha256": "0e5c23c8c502492c0b4432006ac30f2d11b2a4c102a3bf9f21c2fcf094ddbffd",
    "source": {
      "repository": "BasinShapers/sf3d-webgpu-weights",
      "revision": "53cfd8926e0abe77443b97d8684da1ea36bc4af7",
      "path": "weights.bin"
    }
  },
  {
    "path": "README.md",
    "size": 2706,
    "sha256": "00cf8aee3adbf563b1593ab4c96af59ed47582466658fafd924e1349ab51751a",
    "source": {
      "repository": "BasinShapers/sf3d-webgpu-weights",
      "revision": "53cfd8926e0abe77443b97d8684da1ea36bc4af7",
      "path": "README.md"
    }
  },
  {
    "path": "LICENSE.md",
    "size": 11726,
    "sha256": "9b60b9d0411f54d4087484ad4acf28ca6fd9f6a84c30ddacb04de2c623254749",
    "source": {
      "repository": "BasinShapers/sf3d-webgpu-weights",
      "revision": "53cfd8926e0abe77443b97d8684da1ea36bc4af7",
      "path": "LICENSE.md"
    }
  },
  {
    "path": "NOTICE",
    "size": 1464,
    "sha256": "b9b71f7a22dc2529840a5a53f61022bff499994d15446d0506eb5591a3f90376",
    "source": {
      "repository": "BasinShapers/sf3d-webgpu-weights",
      "revision": "53cfd8926e0abe77443b97d8684da1ea36bc4af7",
      "path": "NOTICE"
    }
  },
  {
    "path": "tets/vertices.bin",
    "size": 6430584,
    "sha256": "16f4ee01a050d1757c19b13a7e1dbd4d0918d08208d961c105ff74cbfc345dac",
    "source": {
      "repository": "needle-tools/SF3D-webgpu",
      "revision": "56d2f58d27395b0be9c633671b439b4aac482549",
      "path": "tets_vertices.bin"
    }
  },
  {
    "path": "tets/indices.bin",
    "size": 47543232,
    "sha256": "606cc8b47f8744a64ff6f1f3c088d9d9113ff80539bd62cb1651f8dc629d1f1e",
    "source": {
      "repository": "needle-tools/SF3D-webgpu",
      "revision": "56d2f58d27395b0be9c633671b439b4aac482549",
      "path": "tets_indices.bin"
    }
  }
];
const stabilityLicense = {
  "spdx": "LicenseRef-Stability-AI-Community",
  "sourceUrl": "https://huggingface.co/BasinShapers/sf3d-webgpu-weights/blob/53cfd8926e0abe77443b97d8684da1ea36bc4af7/LICENSE.md",
  "notice": "STABILITY AI COMMUNITY LICENSE AGREEMENT\nLast Updated: July 5, 2024\n\n\nI. INTRODUCTION\n\nThis Agreement applies to any individual person or entity (\"You\", \"Your\" or \"Licensee\") that uses or distributes any portion or element of the Stability AI Materials  or Derivative Works thereof for any Research & Non-Commercial or Commercial purpose. Capitalized terms not otherwise defined herein are defined in Section V below.\n\n\nThis Agreement is intended to allow research, non-commercial, and limited commercial uses of the Models free of charge. In order to ensure that certain limited commercial uses of the Models continue to be allowed, this Agreement  preserves free access to the Models for people or organizations  generating annual revenue of less than US $1,000,000 (or local currency equivalent).  \n\n\nBy clicking \"I Accept\"  or by using or distributing or using any portion or element of the Stability Materials or Derivative Works, You agree that You have read, understood and are bound by the terms of this Agreement. If You are acting on behalf of a company, organization or other entity, then \"You\" includes you and that entity, and You agree that You: (i) are an authorized representative of such entity with the authority to bind such entity to this Agreement, and (ii) You agree to the terms of this Agreement on that entity's behalf. \n\nII. RESEARCH & NON-COMMERCIAL USE LICENSE\n\nSubject to the terms of this Agreement, Stability AI grants You a non-exclusive, worldwide, non-transferable, non-sublicensable, revocable and royalty-free limited license under Stability AI's intellectual property or other rights owned by Stability AI embodied in the Stability AI Materials to use, reproduce, distribute, and create Derivative Works of, and make modifications to, the Stability AI Materials for any Research or Non-Commercial Purpose. \"Research Purpose\" means academic or scientific advancement, and in each case, is not primarily intended for commercial advantage or monetary compensation to You or others. \"Non-Commercial Purpose\" means any purpose other than a Research Purpose that is not primarily intended for commercial advantage or monetary compensation to You or others, such as personal use (i.e., hobbyist) or evaluation and testing.  \n\nIII. COMMERCIAL USE LICENSE\n\nSubject to the terms of this Agreement (including the remainder of this Section III), Stability AI grants You a non-exclusive, worldwide, non-transferable, non-sublicensable, revocable and royalty-free limited license under Stability AI's intellectual property or other rights owned by Stability AI embodied in the Stability AI Materials to use, reproduce, distribute, and create Derivative Works of, and make modifications to, the Stability AI Materials for any Commercial Purpose. \"Commercial Purpose\" means any purpose other than a Research Purpose or Non-Commercial Purpose that is primarily intended for commercial advantage or monetary compensation to You or others, including but not limited to, (i) creating, modifying, or distributing Your product or service, including via a hosted service or application programming interface, and (ii) for Your business's or organization's internal operations. \nIf You are using or distributing the Stability AI Materials for a Commercial Purpose, You must register with Stability AI at (https://stability.ai/community-license). If at any time You or Your Affiliate(s), either individually or in aggregate, generate more than USD $1,000,000 in annual revenue (or the equivalent thereof in Your local currency), regardless of whether that revenue is generated directly or indirectly from the Stability AI Materials or Derivative Works, any licenses granted to You under this Agreement shall terminate as of such date. You must request a license from Stability AI at (https://stability.ai/enterprise) , which Stability AI may grant to You in its sole discretion. If you receive Stability AI Materials, or any Derivative Works thereof, from a Licensee as part of an integrated end user product, then Section III of this Agreement will not apply to you.\n\nIV. GENERAL TERMS\n\nYour Research, Non-Commercial, and Commercial License(s) under this Agreement are subject to the following terms.\na.  Distribution & Attribution. If You distribute or make available the Stability AI Materials or a Derivative Work to a third party, or a product or service that uses any portion of them, You shall: (i) provide a copy of this Agreement to that third party, (ii) retain the following attribution notice within a \"Notice\" text file distributed as a part of such copies: \"This Stability AI Model is licensed under the Stability AI Community License, Copyright \u00a9  Stability AI Ltd. All Rights Reserved\", and (iii) prominently display \"Powered by Stability AI\" on a related website, user interface, blogpost, about page, or product documentation.  If You create a Derivative Work, You may add your own attribution notice(s) to the \"Notice\" text file included with that Derivative Work, provided that You clearly indicate which attributions apply to the Stability AI Materials and state in the \"Notice\" text file that You changed the Stability AI Materials and how it was modified.\nb.  Use Restrictions. Your use of the Stability AI Materials and Derivative Works, including any output or results of the Stability AI Materials or Derivative Works, must comply with applicable laws and regulations (including Trade Control Laws and equivalent regulations) and adhere to the Documentation and Stability AI's AUP, which is hereby incorporated by reference. Furthermore, You will not use the Stability AI Materials or Derivative Works, or any output or results of the Stability AI Materials or Derivative Works, to create or improve any foundational generative AI model (excluding the Models or Derivative Works). \nc.  Intellectual Property. \n(i) Trademark License.  No trademark licenses are granted under this Agreement, and in connection with the Stability AI Materials or Derivative Works, You may not use any name or mark owned by or associated with Stability AI or any of its Affiliates, except as required under Section IV(a) herein.\n(ii)  Ownership of Derivative Works.  As between You and Stability AI, You are the owner of Derivative Works You create, subject to Stability AI's ownership of the Stability AI Materials and any Derivative Works made by or for Stability AI.\n(iii)  Ownership of Outputs. As between You and Stability AI, You own any outputs generated from the Models or Derivative Works to the extent permitted by applicable law. \n(iv)  Disputes.  If You or Your Affiliate(s) institute litigation or other proceedings against Stability AI (including a cross-claim or counterclaim in a lawsuit) alleging that the Stability AI Materials, Derivative Works or associated outputs or results, or any portion of any of the foregoing, constitutes infringement of intellectual property or other rights owned or licensable by You, then any licenses granted to You under this Agreement shall terminate as of the date such litigation or claim is filed or instituted. You will indemnify and hold harmless Stability AI from and against any claim by any third party arising out of or related to Your use or distribution of the Stability AI Materials or Derivative Works in violation of this Agreement.\n(v)  Feedback.  From time to time, You may provide Stability AI with verbal and/or written suggestions, comments or other feedback related to Stability AI's existing or prospective technology, products or services (collectively, \"Feedback\"). You are not obligated to provide Stability AI with Feedback, but to the extent that You do, You hereby grant Stability AI a perpetual, irrevocable, royalty-free, fully-paid, sub-licensable, transferable, non-exclusive, worldwide right and license to exploit the Feedback in any manner without restriction. Your Feedback is provided \"AS IS\" and You make no warranties whatsoever about any Feedback.\nd.  Disclaimer Of Warranty. UNLESS REQUIRED BY APPLICABLE LAW, THE STABILITY AI MATERIALS AND ANY OUTPUT AND RESULTS THEREFROM ARE PROVIDED ON AN \"AS IS\" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, ANY WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE. YOU ARE SOLELY RESPONSIBLE FOR DETERMINING THE APPROPRIATENESS OR LAWFULNESS OF USING OR REDISTRIBUTING THE STABILITY AI MATERIALS, DERIVATIVE WORKS OR ANY OUTPUT OR RESULTS AND ASSUME ANY RISKS ASSOCIATED WITH YOUR USE OF THE STABILITY AI MATERIALS, DERIVATIVE WORKS AND ANY OUTPUT AND RESULTS.\ne.  Limitation Of Liability. IN NO EVENT WILL STABILITY AI OR ITS AFFILIATES BE LIABLE UNDER ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, TORT, NEGLIGENCE, PRODUCTS LIABILITY, OR OTHERWISE, ARISING OUT OF THIS AGREEMENT, FOR ANY LOST PROFITS OR ANY DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL, EXEMPLARY OR PUNITIVE DAMAGES, EVEN IF STABILITY AI OR ITS AFFILIATES HAVE BEEN ADVISED OF THE POSSIBILITY OF ANY OF THE FOREGOING.\nf.  Term And Termination. The term of this Agreement will commence upon Your acceptance of this Agreement or access to the Stability AI Materials and will continue in full force and effect until terminated in accordance with the terms and conditions herein. Stability AI may terminate this Agreement if You are in breach of any term or condition of this Agreement. Upon termination of this Agreement, You shall delete and cease use of any Stability AI Materials or Derivative Works. Section IV(d), (e), and (g) shall survive the termination of this Agreement.\ng.  Governing Law.  This Agreement will be governed by and constructed in accordance with the laws of the United States and the State of California without regard to choice of law principles, and the UN Convention on Contracts for International Sale of Goods does not apply to this Agreement.\n\nV. DEFINITIONS \n\n\"Affiliate(s)\" means any entity that directly or indirectly controls, is controlled by, or is under common control with the subject entity; for purposes of this definition, \"control\" means direct or indirect ownership or control of more than 50% of the voting interests of the subject entity.\n\"Agreement\" means this Stability AI Community License Agreement.\n\"AUP\" means the Stability AI Acceptable Use Policy available at https://stability.ai/use-policy, as may be updated from time to time.\n\"Derivative Work(s)\" means (a) any derivative work of the Stability AI Materials as recognized by U.S. copyright laws and (b) any modifications to a Model, and any other model created which is based on or derived from the Model or the Model's output, including\"fine tune\" and \"low-rank adaptation\" models derived from a Model or a Model's output, but do not include the output of any Model.\n\"Documentation\" means any specifications, manuals, documentation, and other written information provided by Stability AI related to the Software or Models.\n\"Model(s)\" means, collectively, Stability AI's proprietary models and algorithms, including machine-learning models, trained model weights and other elements of the foregoing listed on Stability's Core Models Webpage available at, https://stability.ai/core-models, as may be updated from time to time.\n\"Stability AI\" or \"we\" means Stability AI Ltd. and its Affiliates.\n\"Software\" means Stability AI's proprietary software made available under this Agreement now or in the future.\n\"Stability AI Materials\" means, collectively, Stability's proprietary Models, Software and Documentation (and any portion or combination thereof) made available under this Agreement. \n\"Trade Control Laws\" means any applicable U.S. and non-U.S. export control and trade sanctions laws and regulations."
};
const entry = {
  "id": "stable-fast-3d-webgpu",
  "name": "Stable Fast 3D \u00b7 textured meshes (WebGPU)",
  "description": "Image to textured 3D meshes, UVs and material estimates. Powered by Stability AI. FP16 stored weights execute FP32 GPU math. Static geometry; no rigging or animation.",
  "repository": "BasinShapers/sf3d-webgpu-weights",
  "revision": "53cfd8926e0abe77443b97d8684da1ea36bc4af7",
  "format": "SF3D",
  "pipeline": "sf3d",
  "architecture": "sf3d",
  "dtype": "fp16",
  "status": "tested",
  "model": {
    "runtime": "webgpu-sf3d",
    "runtimeVersion": "0.1.60",
    "task": "image-to-3d",
    "format": "SF3D",
    "pipeline": "sf3d",
    "architecture": "sf3d",
    "dtype": "fp16",
    "computeDtype": "fp32",
    "modalities": [
      "image"
    ],
    "outputModalities": [
      "mesh"
    ],
    "requiredFeatures": [],
    "repository": "BasinShapers/sf3d-webgpu-weights",
    "revision": "53cfd8926e0abe77443b97d8684da1ea36bc4af7",
    "kernelRevision": "86b7b68109434ffc33218f5fb697c7057c2518f9",
    "imageSize": 512,
    "textureSize": 1024,
    "foregroundRatio": 0.85,
    "backgroundRemoval": "u2netp"
  },
  "capabilities": {
    "pin": true,
    "peerHosting": true,
    "browserInference": true,
    "requiresCapabilityCheck": true,
    "executionStatus": "tested",
    "executionReason": "Tested in a managed browser worker on NVIDIA 16 GiB: opaque/cutout images, repeated local and encrypted peer generation, cancellation, retained reload and browser restart. CubeChat textured props and avatars verified. Static meshes; no shader-f16 requirement. Other devices are unqualified.",
    "import": true
  },
  "provenance": {
    "repository": "BasinShapers/sf3d-webgpu-weights",
    "revision": "53cfd8926e0abe77443b97d8684da1ea36bc4af7",
    "format": "SF3D",
    "metadataCheckedAt": "2026-11-11",
    "originalModel": "stabilityai/stable-fast-3d",
    "modelCardUrl": "https://huggingface.co/BasinShapers/sf3d-webgpu-weights/blob/53cfd8926e0abe77443b97d8684da1ea36bc4af7/README.md",
    "kernelRepository": "https://github.com/lyonsno/sf3d-webgpu",
    "kernelRevision": "86b7b68109434ffc33218f5fb697c7057c2518f9",
    "gridRepository": "needle-tools/SF3D-webgpu",
    "gridRevision": "56d2f58d27395b0be9c633671b439b4aac482549"
  }
};
entry.files = [...packageFiles, ...foregroundFiles];
entry.totalBytes = entry.files.reduce((sum, file) => sum + file.size, 0);
entry.weightBytes = packageFiles[0].size + foregroundFiles[0].size;
entry.license = { spdx: 'LicenseRef-Stability-AI-Community AND Apache-2.0',
  sourceUrl: stabilityLicense.sourceUrl, notice: 'Powered by Stability AI. Full model license and derivative notice are included. U2Net foreground weights use Apache-2.0.',
  components: [{ ...stabilityLicense, derivativeNotice: "This Stability AI Model is licensed under the Stability AI Community License, Copyright \u00a9 Stability AI Ltd. All Rights Reserved\n\nPowered by Stability AI.\n\nStable Fast 3D originates with Stability AI. The WebGPU port is from\nlyonsno/sf3d-webgpu, commit 86b7b68109434ffc33218f5fb697c7057c2518f9.\n\nPeerCompute changed the port's asset loading, worker ownership, raw-image and\ntexture encoding interfaces, cancellation checks, and allocation cleanup.\nThe authored bounded artifact adapter streams the same checkpoint tensors and\nretains the original WGSL kernels. The model weights themselves are unchanged.\nSee README.md for the exact integration changes and LICENSE.md for the license.\n" }, foregroundLicense, foregroundConversionLicense, {"spdx": "MIT AND BSD-3-Clause", "sourceUrl": "https://www.npmjs.com/package/@kaminos/webgpu-inference-kit/v/0.1.60", "notice": "MIT License\n\nCopyright (c) 2026 Noah Lyons\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n\nThird-Party Notices\n\nThe MIT license covers the Kaminos implementation in this package.\nThird-party components retain their own terms. Model weights and separately\nloaded assets are not licensed by this package's MIT license.\n\nThe split4 linear shader in src/linear-kernel.js is adapted from WebGPU\nSamples' visionTransformer mlp.wgsl. Its BSD-3-Clause terms follow. This notice\nalso accompanies standalone model bundles that include the Kit shader.\n\nWebGPU Samples\nhttps://github.com/webgpu/webgpu-samples\nLicense: BSD-3-Clause\nSource: https://github.com/webgpu/webgpu-samples/blob/main/LICENSE.txt\n\nCopyright 2019 WebGPU Samples Contributors\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n   1. Redistributions of source code must retain the above copyright notice,\n      this list of conditions and the following disclaimer.\n   2. Redistributions in binary form must reproduce the above copyright notice,\n      this list of conditions and the following disclaimer in the documentation\n      and/or other materials provided with the distribution.\n\n   3. Neither the name of the copyright holder nor the names of its\n      contributors may be used to endorse or promote products derived from this\n      software without specific prior written permission.\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n"}] };
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}
export const SF3D_MODEL_CATALOG = freeze({ [entry.id]: entry });
