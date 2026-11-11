import{b as B,s as G}from"./sha2-Bpg-DeHG.js";import"./ArtifactManifest-D8JibHR_.js";function U(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(U),Object.freeze(e)),e}const P=U({"triposr-q8-onnx":{id:"triposr-q8-onnx",name:"TripoSR · image to 3D (Q8)",repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",format:"ONNX",status:"tested",pipeline:"triposr",architecture:"triposr",dtype:"q8",files:[{path:"triplane_q8.onnx",size:885712,sha256:"7721f5a45e79e02de8c6e909c21fb8e922fd0b594038a8fc1cfefa42c79ad6d5",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"triplane_q8.onnx"}},{path:"triplane_q8.onnx.data",size:483785728,sha256:"50bf9b1c1218dc2c7fb6051d0d2cb7a48a1c5f75cc86e67a9d0e09a931298e35",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"triplane_q8.onnx.data"}},{path:"decoder.onnx",size:173796,sha256:"6ff43581f1d2b46aa61764c2729a8d33985b51cb6c8088cf36ffee3fd70355eb",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"decoder.onnx"}},{path:"README.md",size:3633,sha256:"179a47df133504635c15498b74a7a700f80ed3d43aa12c864ad58539fc667a78",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"README.md"}}],license:{spdx:"MIT",sourceUrl:"https://github.com/VAST-AI-Research/TripoSR/blob/107cefdc244c39106fa830359024f6a2f1c78871/LICENSE",notice:`MIT License

Copyright (c) 2024 Tripo AI & Stability AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`},capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"tested",executionReason:"Tested on NVIDIA WebGPU without shader-f16: real chair image to colored GLB locally and over encrypted inference v5, cancellation/recovery and source-off retained restart. Two CubeChat pages fetched and rendered the same CID; the owner restored it after reload without regeneration. Requires the managed ORT native WebGPU worker. Static objects only; no rigging or animation.",executionEvidence:{checkedAt:"2026-11-11",scope:"local managed worker, encrypted v5 peer inference, and two CubeChat pages",gpuArchitecture:"NVIDIA Blackwell",shaderF16Required:!1,fixture:"TripoSR MIT chair.png",meshSha256:"778fb251bd61ef74ee256622ffe5602d512f1455e8678911f91f866e67af6f24",meshBytes:590056,triangles:4908,gpuDispatches:1207,cancellationRecovery:!0,retainedRestart:!0,peerExecution:"tested",peerProtocol:"/peercompute/inference/5.0.0",peerCancellationRecovery:!0,peerOutputMatchesLocal:!0,cubeChat:{pages:2,sameArtifactCid:!0,renderedOnBothPages:!0,ownerReloadWithoutGeneration:!0,unpinnedObserverCacheCollected:!0}}},provenance:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",format:"ONNX",metadataCheckedAt:"2026-11-11",modelCardUrl:"https://huggingface.co/cgb/triposr-onnx-webgpu/blob/048725e957f485cc6bc082a9d6a239fcf7d8880a/README.md"},model:{runtime:"onnx-mesh",runtimeVersion:"1.31.1",task:"image-to-3d",format:"ONNX",pipeline:"triposr",architecture:"triposr",dtype:"q8",modalities:["image"],outputModalities:["mesh"],requiredFeatures:[],repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",resolution:64,densityThreshold:25,radius:.87,imageSize:512,foregroundRatio:.85},weightBytes:484845236,totalBytes:484848869}}),$=U(Object.values(P)),A=P["triposr-q8-onnx"],D=[{path:"u2netp.onnx",size:4574861,sha256:"309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8",source:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",path:"u2netp.onnx"}},{path:"u2netp.README.md",size:2597,sha256:"e447db65818dba51c001c1a5c9fc43c56c5c60e5ed2cd858c2bad3a239847ef4",source:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",path:"README.md"}}],H={spdx:"Apache-2.0",sourceUrl:"https://raw.githubusercontent.com/xuebinqin/U-2-Net/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29/LICENSE",notice:`                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
`},j={spdx:"MIT",sourceUrl:"https://raw.githubusercontent.com/danielgatis/rembg/991927b77667946dab59c50df31f7d4640e80457/LICENSE.txt",notice:`MIT License

Copyright (c) 2020 Daniel Gatis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`},Q=U({"triposr-q8-onnx":{...A,model:{...A.model,backgroundRemoval:"u2netp"},files:[...A.files,...D],weightBytes:A.weightBytes+D[0].size,totalBytes:A.totalBytes+D.reduce((e,a)=>e+a.size,0),license:{spdx:"MIT AND Apache-2.0",sourceUrl:A.license.sourceUrl,notice:"TripoSR © 2024 Tripo AI & Stability AI (MIT). U²-Net weights: Apache-2.0; rembg distribution © 2020 Daniel Gatis (MIT). Full original license texts are retained in this package.",components:[A.license,H,j]},provenance:{...A.provenance,foreground:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",sourceUrl:"https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx",modelCardUrl:"https://huggingface.co/edgetools/u2netp/blob/25dee37ab19c5b6ad64ba6578eba63f1ae07720c/README.md",sha256:D[0].sha256,licenseUrl:H.sourceUrl}},capabilities:{...A.capabilities,executionStatus:"tested",executionReason:"Tested in the managed WebGPU worker: actual CubeChat owner chat through peer Qwen and DreamShaper to U2NetP foreground removal and TripoSR. Both CubeChat peers displayed the same isolated chair CID; owner reload restored it without regeneration. Static, coarse geometry; no rigging or animation. No shader-f16 required.",executionEvidence:{checkedAt:"2026-11-11",scope:"Actual owner chat, peer language/image/3D inference, two CubeChat pages and retained object reload",shaderF16Required:!1,foregroundModel:"u2netp",input:"Opaque DreamShaper 512x512 RGBA chair",meshSha256:"277a963c5b9b66361f7ef7e43deea2fc5e90b770f5897def6b58ea83f186ae16",meshBytes:883820,triangles:7356,peerExecution:"tested",peerProtocol:"/peercompute/inference/5.0.0",cubeChat:{pages:2,sameArtifactCid:!0,renderedOnBothPages:!0,ownerReloadWithoutGeneration:!0,unpinnedObserverCacheCollected:!0}}}}}),b=Object.freeze({byteLength:16*1024**2,jsonBytes:256*1024,vertices:1e5,triangles:15e4,coordinate:1e6}),F="model/gltf-binary",q=new TextEncoder,z=new TextDecoder("utf-8",{fatal:!0}),n=e=>{throw new Error(`Invalid generated mesh: ${e}`)};function y(e,a,s){return(!Number.isSafeInteger(e)||e<a||e>s)&&n("numeric limit"),e}function g(e,a){return(!e||typeof e!="object"||Array.isArray(e)||Object.keys(e).some(s=>!a.includes(s)))&&n("unsupported GLB field"),e}function W(e,a,s=-b.coordinate,i=b.coordinate){return(!Array.isArray(e)||e.length!==a||e.some(d=>!Number.isFinite(d)||d<s||d>i))&&n("invalid vector"),[...e]}function S(e){return(!Array.isArray(e)||e.length!==1)&&n("expected one static mesh"),e[0]}const Y=(e,a)=>JSON.stringify(e)===JSON.stringify(a);function Z(e){var s,i;(!e||e.format!=="glb"||e.mimeType!==F||!/^[a-f0-9]{64}$/u.test(e.sha256??""))&&n("format or SHA-256");const a={min:W((s=e.bounds)==null?void 0:s.min,3),max:W((i=e.bounds)==null?void 0:i.max,3)};return a.min.some((d,p)=>d>a.max[p])&&n("inverted bounds"),{format:"glb",mimeType:F,byteLength:y(e.byteLength,32,b.byteLength),sha256:e.sha256,vertexCount:y(e.vertexCount,3,b.vertices),triangleCount:y(e.triangleCount,1,b.triangles),bounds:a}}function _(e){const a=new DataView(e.buffer,e.byteOffset,e.byteLength);(a.getUint32(0,!0)!==1179937895||a.getUint32(4,!0)!==2||a.getUint32(8,!0)!==e.byteLength)&&n("GLB header");const s=a.getUint32(12,!0);(!s||s%4||s>b.jsonBytes||20+s+8>e.byteLength||a.getUint32(16,!0)!==1313821514)&&n("JSON chunk");let i;try{i=JSON.parse(z.decode(e.subarray(20,20+s)))}catch{n("JSON syntax")}const d=20+s,p=a.getUint32(d,!0);(p%4||a.getUint32(d+4,!0)!==5130562||d+8+p!==e.byteLength)&&n("BIN chunk"),g(i,["asset","scene","scenes","nodes","meshes","buffers","bufferViews","accessors","materials"]),g(i.asset,["version","generator"]),(i.asset.version!=="2.0"||i.asset.generator!==void 0&&(typeof i.asset.generator!="string"||i.asset.generator.length>128))&&n("asset version"),i.scene!==0&&n("scene");const v=g(S(i.scenes),["nodes"]);Y(v.nodes,[0])||n("scene nodes"),g(S(i.nodes),["mesh"]).mesh!==0&&n("node mesh");const k=g(S(i.meshes),["primitives"]),h=g(S(k.primitives),["attributes","indices","mode","material"]);h.mode!==void 0&&h.mode!==4&&n("only triangles are supported"),g(h.attributes,["POSITION","NORMAL","COLOR_0"]),Object.hasOwn(h.attributes,"POSITION")||n("missing positions");const w=g(S(i.buffers),["byteLength"]);y(w.byteLength,1,p),p-w.byteLength>3&&n("BIN padding"),(!Array.isArray(i.bufferViews)||i.bufferViews.length<2||i.bufferViews.length>4||!Array.isArray(i.accessors)||i.accessors.length!==i.bufferViews.length)&&n("accessor count");const E=[];for(const t of i.bufferViews){g(t,["buffer","byteOffset","byteLength","target"]),(t.buffer!==0||t.target!==void 0&&![34962,34963].includes(t.target))&&n("buffer view");const o=y(t.byteOffset??0,0,w.byteLength),r=y(t.byteLength,1,w.byteLength-o);o%4&&n("buffer alignment"),E.some(([c,l])=>o<l&&o+r>c)&&n("overlapping buffer views"),E.push([o,o+r])}const R=new Set,N=new Set;function I(t,o){y(t,0,i.accessors.length-1),R.has(t)&&n("reused accessor"),R.add(t);const r=g(i.accessors[t],["bufferView","byteOffset","componentType","count","type","min","max"]);y(r.bufferView,0,i.bufferViews.length-1),N.has(r.bufferView)&&n("reused buffer view"),N.add(r.bufferView);const c=o==="indices"?1:o==="colors"&&r.type==="VEC4"?4:3;(r.type!==(c===1?"SCALAR":`VEC${c}`)||(o==="indices"?![5123,5125].includes(r.componentType):r.componentType!==5126))&&n("accessor format");const l=r.componentType===5123?2:4,L=y(r.count,3,o==="indices"?b.triangles*3:b.vertices),T=E[r.bufferView],m=y(r.byteOffset??0,0,T[1]-T[0]);(m%l||m+L*c*l!==T[1]-T[0])&&n("accessor byte range");const M=new DataView(e.buffer,e.byteOffset+d+8+T[0]+m,L*c*l),V=r.componentType===5126?C=>M.getFloat32(C*4,!0):r.componentType===5125?C=>M.getUint32(C*4,!0):C=>M.getUint16(C*2,!0);return{entry:r,count:L,components:c,get:V}}const O=I(h.attributes.POSITION,"positions"),u={min:[1/0,1/0,1/0],max:[-1/0,-1/0,-1/0]};for(let t=0;t<O.count*3;t++){const o=O.get(t);(!Number.isFinite(o)||Math.abs(o)>b.coordinate)&&n("nonfinite or excessive position"),u.min[t%3]=Math.min(u.min[t%3],o),u.max[t%3]=Math.max(u.max[t%3],o)}for(const t of["min","max"])Y(W(O.entry[t],3),u[t])||n("position bounds mismatch");u.min.every((t,o)=>t===u.max[o])&&n("empty geometry");for(const[t,o]of[["NORMAL","normals"],["COLOR_0","colors"]]){if(!Object.hasOwn(h.attributes,t))continue;const r=I(h.attributes[t],o);(r.count!==O.count||r.entry.min!==void 0||r.entry.max!==void 0)&&n("attribute count or bounds");for(let c=0;c<r.count*r.components;c++){const l=r.get(c);(!Number.isFinite(l)||l<(o==="colors"?0:-1.001)||l>(o==="colors"?1:1.001))&&n("invalid attribute value")}if(o==="normals")for(let c=0;c<r.count;c++){const l=Math.hypot(r.get(c*3),r.get(c*3+1),r.get(c*3+2));Math.abs(l-1)>.001&&n("normal must be a unit vector")}}const f=I(h.indices,"indices");(f.count%3||f.entry.min!==void 0||f.entry.max!==void 0)&&n("triangle indices");for(let t=0;t<f.count;t++){const o=f.get(t);o>=O.count&&n("index outside positions"),f.entry.componentType===5123&&o===65535&&n("primitive restart index")}if((R.size!==i.accessors.length||N.size!==i.bufferViews.length)&&n("unused accessor"),i.materials!==void 0){const t=g(S(i.materials),["pbrMetallicRoughness","doubleSided","alphaMode"]);t.doubleSided!==void 0&&typeof t.doubleSided!="boolean"&&n("material"),t.alphaMode!==void 0&&t.alphaMode!=="OPAQUE"&&n("material alpha");const o=g(t.pbrMetallicRoughness,["baseColorFactor","metallicFactor","roughnessFactor"]);o.baseColorFactor!==void 0&&W(o.baseColorFactor,4,0,1);for(const r of["metallicFactor","roughnessFactor"])o[r]!==void 0&&(!Number.isFinite(o[r])||o[r]<0||o[r]>1)&&n("material factor");h.material!==0&&n("material index")}else h.material!==void 0&&n("missing material");return{vertexCount:O.count,triangleCount:f.count/3,bounds:u}}function J(e){(!((e==null?void 0:e.data)instanceof Uint8Array)||e.data.byteLength<32||e.data.byteLength>b.byteLength)&&n("binary byte limit");const a=new Uint8Array(e.data),s={format:"glb",mimeType:F,byteLength:a.byteLength,sha256:B(G(a)),..._(a)};for(const i of Object.keys(s))e[i]!==void 0&&!Y(e[i],s[i])&&n(`${i} mismatch`);return{...s,data:a}}function ee({positions:e,indices:a,normals:s,colors:i}){(!(e instanceof Float32Array)||e.length%3||!(a instanceof Uint16Array||a instanceof Uint32Array)||a.length%3)&&n("geometry arrays");const d=y(e.length/3,3,b.vertices);y(a.length/3,1,b.triangles),s!==void 0&&(!(s instanceof Float32Array)||s.length!==e.length)&&n("normal array"),i!==void 0&&(!(i instanceof Float32Array)||![d*3,d*4].includes(i.length))&&n("color array");const p={min:[1/0,1/0,1/0],max:[-1/0,-1/0,-1/0]};for(let t=0;t<e.length;t++)p.min[t%3]=Math.min(p.min[t%3],e[t]),p.max[t%3]=Math.max(p.max[t%3],e[t]);const v=[],x=[],k=[],h={};let w=0;const E=(t,o,r,c={})=>{const l=x.length,L=new Uint8Array(t.byteLength),T=new DataView(L.buffer);for(let m=0;m<t.length;m++)t instanceof Float32Array?T.setFloat32(m*4,t[m],!0):t instanceof Uint32Array?T.setUint32(m*4,t[m],!0):T.setUint16(m*2,t[m],!0);return v.push({offset:w,data:L}),k.push({buffer:0,byteOffset:w,byteLength:L.byteLength,target:r}),x.push({bufferView:l,componentType:t instanceof Float32Array?5126:t instanceof Uint32Array?5125:5123,count:o==="SCALAR"?t.length:d,type:o,...c}),w+=Math.ceil(L.byteLength/4)*4,l};h.POSITION=E(e,"VEC3",34962,p),s!==void 0&&(h.NORMAL=E(s,"VEC3",34962)),i!==void 0&&(h.COLOR_0=E(i,i.length===d*4?"VEC4":"VEC3",34962));const R=E(a,"SCALAR",34963),N=q.encode(JSON.stringify({asset:{version:"2.0",generator:"PeerCompute generated mesh"},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:h,indices:R,mode:4,material:0}]}],materials:[{pbrMetallicRoughness:{metallicFactor:0,roughnessFactor:1},doubleSided:!0}],buffers:[{byteLength:w}],bufferViews:k,accessors:x})),I=Math.ceil(N.byteLength/4)*4,O=28+I+w;(O>b.byteLength||I>b.jsonBytes)&&n("encoded byte limit");const u=new Uint8Array(O),f=new DataView(u.buffer);f.setUint32(0,1179937895,!0),f.setUint32(4,2,!0),f.setUint32(8,O,!0),f.setUint32(12,I,!0),f.setUint32(16,1313821514,!0),u.fill(32,20,20+I),u.set(N,20),f.setUint32(20+I,w,!0),f.setUint32(24+I,5130562,!0);for(const t of v)u.set(t.data,28+I+t.offset);return J({data:u})}export{$ as L,Q as M,ee as e,Z as n,J as v};
