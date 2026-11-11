import{c as ns}from"./GgufArtifactReader-DZX454k1.js";import{t as Q,a as mi}from"./ArtifactReadBridge-Bns2fboi.js";import{
b as rs,s as os}from"./sha2-BwZiqLOA.js";import{n as as}from"./ArtifactManifest-DPFdnZW5.js";import{validateImageInput as hs}from"./modelTask-DDS8dEO6.js";
const ft=Object.freeze({byteLength:16*1024**2,jsonBytes:256*1024,vertices:1e5,triangles:15e4,coordinate:1e6}),cs="model/\
gltf-binary",ls=new TextEncoder,us=new TextDecoder("utf-8",{fatal:!0}),R=u=>{throw new Error(`Invalid generated mesh: ${u}`)};
function _t(u,t,e){return(!Number.isSafeInteger(u)||u<t||u>e)&&R("numeric limit"),u}function nt(u,t){return(!u||typeof u!=
"object"||Array.isArray(u)||Object.keys(u).some(e=>!t.includes(e)))&&R("unsupported GLB field"),u}function yi(u,t,e=-ft.
coordinate,i=ft.coordinate){return(!Array.isArray(u)||u.length!==t||u.some(s=>!Number.isFinite(s)||s<e||s>i))&&R("invali\
d vector"),[...u]}function Vt(u){return(!Array.isArray(u)||u.length!==1)&&R("expected one static mesh"),u[0]}const li=(u,t)=>JSON.
stringify(u)===JSON.stringify(t);function ds(u){const t=new DataView(u.buffer,u.byteOffset,u.byteLength);(t.getUint32(0,
!0)!==1179937895||t.getUint32(4,!0)!==2||t.getUint32(8,!0)!==u.byteLength)&&R("GLB header");const e=t.getUint32(12,!0);(!e||
e%4||e>ft.jsonBytes||20+e+8>u.byteLength||t.getUint32(16,!0)!==1313821514)&&R("JSON chunk");let i;try{i=JSON.parse(us.decode(
u.subarray(20,20+e)))}catch{R("JSON syntax")}const s=20+e,n=t.getUint32(s,!0);(n%4||t.getUint32(s+4,!0)!==5130562||s+8+n!==
u.byteLength)&&R("BIN chunk"),nt(i,["asset","scene","scenes","nodes","meshes","buffers","bufferViews","accessors","mater\
ials"]),nt(i.asset,["version","generator"]),(i.asset.version!=="2.0"||i.asset.generator!==void 0&&(typeof i.asset.generator!=
"string"||i.asset.generator.length>128))&&R("asset version"),i.scene!==0&&R("scene");const o=nt(Vt(i.scenes),["nodes"]);
li(o.nodes,[0])||R("scene nodes"),nt(Vt(i.nodes),["mesh"]).mesh!==0&&R("node mesh");const a=nt(Vt(i.meshes),["primitives"]),
h=nt(Vt(a.primitives),["attributes","indices","mode","material"]);h.mode!==void 0&&h.mode!==4&&R("only triangles are sup\
ported"),nt(h.attributes,["POSITION","NORMAL","COLOR_0"]),Object.hasOwn(h.attributes,"POSITION")||R("missing positions");
const c=nt(Vt(i.buffers),["byteLength"]);_t(c.byteLength,1,n),n-c.byteLength>3&&R("BIN padding"),(!Array.isArray(i.bufferViews)||
i.bufferViews.length<2||i.bufferViews.length>4||!Array.isArray(i.accessors)||i.accessors.length!==i.bufferViews.length)&&
R("accessor count");const l=[];for(const p of i.bufferViews){nt(p,["buffer","byteOffset","byteLength","target"]),(p.buffer!==
0||p.target!==void 0&&![34962,34963].includes(p.target))&&R("buffer view");const y=_t(p.byteOffset??0,0,c.byteLength),g=_t(
p.byteLength,1,c.byteLength-y);y%4&&R("buffer alignment"),l.some(([A,z])=>y<z&&y+g>A)&&R("overlapping buffer views"),l.push(
[y,y+g])}const d=new Set,f=new Set;function m(p,y){_t(p,0,i.accessors.length-1),d.has(p)&&R("reused accessor"),d.add(p);
const g=nt(i.accessors[p],["bufferView","byteOffset","componentType","count","type","min","max"]);_t(g.bufferView,0,i.bufferViews.
length-1),f.has(g.bufferView)&&R("reused buffer view"),f.add(g.bufferView);const A=y==="indices"?1:y==="colors"&&g.type===
"VEC4"?4:3;(g.type!==(A===1?"SCALAR":`VEC${A}`)||(y==="indices"?![5123,5125].includes(g.componentType):g.componentType!==
5126))&&R("accessor format");const z=g.componentType===5123?2:4,S=_t(g.count,3,y==="indices"?ft.triangles*3:ft.vertices),
M=l[g.bufferView],T=_t(g.byteOffset??0,0,M[1]-M[0]);(T%z||T+S*A*z!==M[1]-M[0])&&R("accessor byte range");const I=new DataView(
u.buffer,u.byteOffset+s+8+M[0]+T,S*A*z),F=g.componentType===5126?C=>I.getFloat32(C*4,!0):g.componentType===5125?C=>I.getUint32(
C*4,!0):C=>I.getUint16(C*2,!0);return{entry:g,count:S,components:A,get:F}}const x=m(h.attributes.POSITION,"positions"),w={
min:[1/0,1/0,1/0],max:[-1/0,-1/0,-1/0]};for(let p=0;p<x.count*3;p++){const y=x.get(p);(!Number.isFinite(y)||Math.abs(y)>
ft.coordinate)&&R("nonfinite or excessive position"),w.min[p%3]=Math.min(w.min[p%3],y),w.max[p%3]=Math.max(w.max[p%3],y)}
for(const p of["min","max"])li(yi(x.entry[p],3),w[p])||R("position bounds mismatch");w.min.every((p,y)=>p===w.max[y])&&R(
"empty geometry");for(const[p,y]of[["NORMAL","normals"],["COLOR_0","colors"]]){if(!Object.hasOwn(h.attributes,p))continue;
const g=m(h.attributes[p],y);(g.count!==x.count||g.entry.min!==void 0||g.entry.max!==void 0)&&R("attribute count or boun\
ds");for(let A=0;A<g.count*g.components;A++){const z=g.get(A);(!Number.isFinite(z)||z<(y==="colors"?0:-1.001)||z>(y==="c\
olors"?1:1.001))&&R("invalid attribute value")}if(y==="normals")for(let A=0;A<g.count;A++){const z=Math.hypot(g.get(A*3),
g.get(A*3+1),g.get(A*3+2));Math.abs(z-1)>.001&&R("normal must be a unit vector")}}const b=m(h.indices,"indices");(b.count%
3||b.entry.min!==void 0||b.entry.max!==void 0)&&R("triangle indices");for(let p=0;p<b.count;p++){const y=b.get(p);y>=x.count&&
R("index outside positions"),b.entry.componentType===5123&&y===65535&&R("primitive restart index")}if((d.size!==i.accessors.
length||f.size!==i.bufferViews.length)&&R("unused accessor"),i.materials!==void 0){const p=nt(Vt(i.materials),["pbrMetal\
licRoughness","doubleSided","alphaMode"]);p.doubleSided!==void 0&&typeof p.doubleSided!="boolean"&&R("material"),p.alphaMode!==
void 0&&p.alphaMode!=="OPAQUE"&&R("material alpha");const y=nt(p.pbrMetallicRoughness,["baseColorFactor","metallicFactor",
"roughnessFactor"]);y.baseColorFactor!==void 0&&yi(y.baseColorFactor,4,0,1);for(const g of["metallicFactor","roughnessFa\
ctor"])y[g]!==void 0&&(!Number.isFinite(y[g])||y[g]<0||y[g]>1)&&R("material factor");h.material!==0&&R("material index")}else
h.material!==void 0&&R("missing material");return{vertexCount:x.count,triangleCount:b.count/3,bounds:w}}function fs(u){(!(u?.
data instanceof Uint8Array)||u.data.byteLength<32||u.data.byteLength>ft.byteLength)&&R("binary byte limit");const t=new Uint8Array(
u.data),e={format:"glb",mimeType:cs,byteLength:t.byteLength,sha256:rs(os(t)),...ds(t)};for(const i of Object.keys(e))u[i]!==
void 0&&!li(u[i],e[i])&&R(`${i} mismatch`);return{...e,data:t}}function ps({positions:u,indices:t,normals:e,colors:i}){(!(u instanceof
Float32Array)||u.length%3||!(t instanceof Uint16Array||t instanceof Uint32Array)||t.length%3)&&R("geometry arrays");const s=_t(
u.length/3,3,ft.vertices);_t(t.length/3,1,ft.triangles),e!==void 0&&(!(e instanceof Float32Array)||e.length!==u.length)&&
R("normal array"),i!==void 0&&(!(i instanceof Float32Array)||![s*3,s*4].includes(i.length))&&R("color array");const n={min:[
1/0,1/0,1/0],max:[-1/0,-1/0,-1/0]};for(let p=0;p<u.length;p++)n.min[p%3]=Math.min(n.min[p%3],u[p]),n.max[p%3]=Math.max(n.
max[p%3],u[p]);const o=[],r=[],a=[],h={};let c=0;const l=(p,y,g,A={})=>{const z=r.length,S=new Uint8Array(p.byteLength),
M=new DataView(S.buffer);for(let T=0;T<p.length;T++)p instanceof Float32Array?M.setFloat32(T*4,p[T],!0):p instanceof Uint32Array?
M.setUint32(T*4,p[T],!0):M.setUint16(T*2,p[T],!0);return o.push({offset:c,data:S}),a.push({buffer:0,byteOffset:c,byteLength:S.
byteLength,target:g}),r.push({bufferView:z,componentType:p instanceof Float32Array?5126:p instanceof Uint32Array?5125:5123,
count:y==="SCALAR"?p.length:s,type:y,...A}),c+=Math.ceil(S.byteLength/4)*4,z};h.POSITION=l(u,"VEC3",34962,n),e!==void 0&&
(h.NORMAL=l(e,"VEC3",34962)),i!==void 0&&(h.COLOR_0=l(i,i.length===s*4?"VEC4":"VEC3",34962));const d=l(t,"SCALAR",34963),
f=ls.encode(JSON.stringify({asset:{version:"2.0",generator:"PeerCompute generated mesh"},scene:0,scenes:[{nodes:[0]}],nodes:[
{mesh:0}],meshes:[{primitives:[{attributes:h,indices:d,mode:4,material:0}]}],materials:[{pbrMetallicRoughness:{metallicFactor:0,
roughnessFactor:1},doubleSided:!0}],buffers:[{byteLength:c}],bufferViews:a,accessors:r})),m=Math.ceil(f.byteLength/4)*4,
x=28+m+c;(x>ft.byteLength||m>ft.jsonBytes)&&R("encoded byte limit");const w=new Uint8Array(x),b=new DataView(w.buffer);b.
setUint32(0,1179937895,!0),b.setUint32(4,2,!0),b.setUint32(8,x,!0),b.setUint32(12,m,!0),b.setUint32(16,1313821514,!0),w.
fill(32,20,20+m),w.set(f,20),b.setUint32(20+m,c,!0),b.setUint32(24+m,5130562,!0);for(const p of o)w.set(p.data,28+m+p.offset);
return fs({data:w})}function Ne(u){return u&&typeof u=="object"&&!Object.isFrozen(u)&&(Object.values(u).forEach(Ne),Object.
freeze(u)),u}const Zi=Ne({"triposr-q8-onnx":{id:"triposr-q8-onnx",name:"TripoSR · image to 3D (Q8)",repository:"cgb/tri\
posr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",format:"ONNX",status:"tested",pipeline:"triposr",architecture:"\
triposr",dtype:"q8",files:[{path:"triplane_q8.onnx",size:885712,sha256:"7721f5a45e79e02de8c6e909c21fb8e922fd0b594038a8fc\
1cfefa42c79ad6d5",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"\
triplane_q8.onnx"}},{path:"triplane_q8.onnx.data",size:483785728,sha256:"50bf9b1c1218dc2c7fb6051d0d2cb7a48a1c5f75cc86e67\
a9d0e09a931298e35",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"\
triplane_q8.onnx.data"}},{path:"decoder.onnx",size:173796,sha256:"6ff43581f1d2b46aa61764c2729a8d33985b51cb6c8088cf36ffee\
3fd70355eb",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"decod\
er.onnx"}},{path:"README.md",size:3633,sha256:"179a47df133504635c15498b74a7a700f80ed3d43aa12c864ad58539fc667a78",source:{
repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"README.md"}}],license:{spdx:"\
MIT",sourceUrl:"https://github.com/VAST-AI-Research/TripoSR/blob/107cefdc244c39106fa830359024f6a2f1c78871/LICENSE",notice:`\
MIT License

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
`},capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"tested",
executionReason:"Tested on NVIDIA WebGPU without shader-f16: real chair image to colored GLB locally and over encrypted \
inference v5, cancellation/recovery and source-off retained restart. Two CubeChat pages fetched and rendered the same CI\
D; the owner restored it after reload without regeneration. Requires the managed ORT native WebGPU worker. Static object\
s only; no rigging or animation.",executionEvidence:{checkedAt:"2026-11-11",scope:"local managed worker, encrypted v5 pe\
er inference, and two CubeChat pages",gpuArchitecture:"NVIDIA Blackwell",shaderF16Required:!1,fixture:"TripoSR MIT chair\
.png",meshSha256:"778fb251bd61ef74ee256622ffe5602d512f1455e8678911f91f866e67af6f24",meshBytes:590056,triangles:4908,gpuDispatches:1207,
cancellationRecovery:!0,retainedRestart:!0,peerExecution:"tested",peerProtocol:"/peercompute/inference/5.0.0",peerCancellationRecovery:!0,
peerOutputMatchesLocal:!0,cubeChat:{pages:2,sameArtifactCid:!0,renderedOnBothPages:!0,ownerReloadWithoutGeneration:!0,unpinnedObserverCacheCollected:!0}}},
provenance:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",format:"ONNX",metadataCheckedAt:"\
2026-11-11",modelCardUrl:"https://huggingface.co/cgb/triposr-onnx-webgpu/blob/048725e957f485cc6bc082a9d6a239fcf7d8880a/R\
EADME.md"},model:{runtime:"onnx-mesh",runtimeVersion:"1.31.1",task:"image-to-3d",format:"ONNX",pipeline:"triposr",architecture:"\
triposr",dtype:"q8",modalities:["image"],outputModalities:["mesh"],requiredFeatures:[],repository:"cgb/triposr-onnx-webg\
pu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",resolution:64,densityThreshold:25,radius:.87,imageSize:512,foregroundRatio:.85},
weightBytes:484845236,totalBytes:484848869}}),ms=Ne(Object.values(Zi)),bt=Zi["triposr-q8-onnx"],fe=[{path:"u2netp.onnx",
size:4574861,sha256:"309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8",source:{repository:"edgetools/u2n\
etp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",path:"u2netp.onnx"}},{path:"u2netp.README.md",size:2597,sha256:"\
e447db65818dba51c001c1a5c9fc43c56c5c60e5ed2cd858c2bad3a239847ef4",source:{repository:"edgetools/u2netp",revision:"25dee3\
7ab19c5b6ad64ba6578eba63f1ae07720c",path:"README.md"}}],xi={spdx:"Apache-2.0",sourceUrl:"https://raw.githubusercontent.c\
om/xuebinqin/U-2-Net/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29/LICENSE",notice:`                                 Apache L\
icense
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
`},ys={spdx:"MIT",sourceUrl:"https://raw.githubusercontent.com/danielgatis/rembg/991927b77667946dab59c50df31f7d4640e8045\
7/LICENSE.txt",notice:`MIT License

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
`},xs=Ne({"triposr-q8-onnx":{...bt,model:{...bt.model,backgroundRemoval:"u2netp"},files:[...bt.files,...fe],weightBytes:bt.
weightBytes+fe[0].size,totalBytes:bt.totalBytes+fe.reduce((u,t)=>u+t.size,0),license:{spdx:"MIT AND Apache-2.0",sourceUrl:bt.
license.sourceUrl,notice:"TripoSR © 2024 Tripo AI & Stability AI (MIT). U²-Net weights: Apache-2.0; rembg distribution ©\
 2020 Daniel Gatis (MIT). Full original license texts are retained in this package.",components:[bt.license,xi,ys]},provenance:{
...bt.provenance,foreground:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",sourceUrl:"\
https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx",modelCardUrl:"https://huggingface.co/edgetool\
s/u2netp/blob/25dee37ab19c5b6ad64ba6578eba63f1ae07720c/README.md",sha256:fe[0].sha256,licenseUrl:xi.sourceUrl}},capabilities:{
...bt.capabilities,executionStatus:"tested",executionReason:"Tested in the managed WebGPU worker: actual CubeChat owner \
chat through peer Qwen and DreamShaper to U2NetP foreground removal and TripoSR. Both CubeChat peers displayed the same \
isolated chair CID; owner reload restored it without regeneration. Static, coarse geometry; no rigging or animation. No \
shader-f16 required.",executionEvidence:{checkedAt:"2026-11-11",scope:"Actual owner chat, peer language/image/3D inferen\
ce, two CubeChat pages and retained object reload",shaderF16Required:!1,foregroundModel:"u2netp",input:"Opaque DreamShap\
er 512x512 RGBA chair",meshSha256:"277a963c5b9b66361f7ef7e43deea2fc5e90b770f5897def6b58ea83f186ae16",meshBytes:883820,triangles:7356,
peerExecution:"tested",peerProtocol:"/peercompute/inference/5.0.0",cubeChat:{pages:2,sameArtifactCid:!0,renderedOnBothPages:!0,
ownerReloadWithoutGeneration:!0,unpinnedObserverCacheCollected:!0}}}}}),gs="1.31.1",We=1024**3,gi=Object.freeze({maxModelBytes:We,
minimumCpuBytes:4*We,minimumGpuBytes:3*We}),Ji=(u,t)=>u===t||u&&t&&typeof u=="object"&&typeof t=="object"&&Array.isArray(
u)===Array.isArray(t)&&Object.keys(u).length===Object.keys(t).length&&Object.keys(u).every(e=>Ji(u[e],t[e]));function di(u){
const t=as(u),e=t.model,i=[...Object.values(xs),...ms].find(n=>Ji(n.model,e));if(!i||t.files.length!==i.files.length||i.
files.some(n=>!t.files.some(o=>o.path===n.path&&o.size===n.size&&o.sha256===n.sha256)))throw new Error("3D model package\
 differs from its qualified runtime catalog");const s=t.files.reduce((n,o)=>n+o.size,0);if(!Number.isSafeInteger(s)||s>gi.
maxModelBytes)throw new Error("3D model package exceeds its byte budget");return{manifest:t,trusted:i,totalBytes:s,resourcePolicy:gi}}
function $i(u,t){if(di(t),u.task!=null&&u.task!=="image-to-3d")throw new Error("This model generates 3D objects from ima\
ges");if(u.audio!=null)throw new Error("3D generation does not accept audio");const e=hs(u.image);if(!e)throw new Error(
"3D generation requires an image of one object");if(u.prompt?.trim()||u.messages?.length)throw new Error("TripoSR requir\
es image input; generate an image from text first");return{task:"image-to-3d",image:e}}function bs(u,t=globalThis.location?.
href){if(!u||Object.keys(u).some(s=>!["mjs","wasm"].includes(s)))throw new Error("Unexpected 3D runtime assets");const e=new URL(
t),i={};for(const s of["mjs","wasm"]){if(typeof u[s]!="string")throw new Error("Trusted 3D runtime assets are required");
const n=new URL(u[s],e);if(n.origin!==e.origin||n.username||n.password||n.search||n.hash||!["http:","https:"].includes(n.
protocol)||!new RegExp(`(?:^|/)ort-wasm-simd-threaded\\.asyncify(?:-[A-Za-z0-9_-]+)?\\.${s}$`).test(n.pathname))throw new Error(
"3D runtime requires fixed same-origin ORT asyncify assets");i[s]=n.href}return i}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Qi="182",ui=0,ws=1,bi=1,wi=100,Mi=204,Ai=205,zi=3,Ms=0,Ki=300,Si=1e3,pe=1001,_i=1002,As=1006,zs=1008,Ss=1009,_s=1015,
Fs=1023,ts="",ut="srgb",Fi="srgb-linear",Ti="linear",qe="srgb",Yt=7680,Ci=519,Ei=35044,me=35048,ye=2e3,Ii=2001;function Ts(u){
for(let t=u.length-1;t>=0;--t)if(u[t]>=65535)return!0;return!1}function ki(u){return document.createElementNS("http://ww\
w.w3.org/1999/xhtml",u)}const Ri={};function K(...u){const t="THREE."+u.shift();console.warn(t,...u)}function Ut(...u){const t="\
THREE."+u.shift();console.error(t,...u)}function Oi(...u){const t=u.join(" ");t in Ri||(Ri[t]=!0,K(...u))}class ve{addEventListener(t,e){
this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].
push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){
const i=this._listeners;if(i===void 0)return;const s=i[t];if(s!==void 0){const n=s.indexOf(e);n!==-1&&s.splice(n,1)}}dispatchEvent(t){
const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let n=0,
o=s.length;n<o;n++)s[n].call(this,t);t.target=null}}}const J=["00","01","02","03","04","05","06","07","08","09","0a","0b",
"0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23",
"24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b",
"3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53",
"54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b",
"6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83",
"84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b",
"9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3",
"b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb",
"cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3",
"e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb",
"fc","fd","fe","ff"];function he(){const u=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|
0,i=Math.random()*4294967295|0;return(J[u&255]+J[u>>8&255]+J[u>>16&255]+J[u>>24&255]+"-"+J[t&255]+J[t>>8&255]+"-"+J[t>>16&
15|64]+J[t>>24&255]+"-"+J[e&63|128]+J[e>>8&255]+"-"+J[e>>16&255]+J[e>>24&255]+J[i&255]+J[i>>8&255]+J[i>>16&255]+J[i>>24&
255]).toLowerCase()}function N(u,t,e){return Math.max(t,Math.min(e,u))}function Cs(u,t){return(u%t+t)%t}function Ve(u,t,e){
return(1-e)*u+e*t}function ie(u,t){switch(t.constructor){case Float32Array:return u;case Uint32Array:return u/4294967295;case Uint16Array:
return u/65535;case Uint8Array:return u/255;case Int32Array:return Math.max(u/2147483647,-1);case Int16Array:return Math.
max(u/32767,-1);case Int8Array:return Math.max(u/127,-1);default:throw new Error("Invalid component type.")}}function tt(u,t){
switch(t.constructor){case Float32Array:return u;case Uint32Array:return Math.round(u*4294967295);case Uint16Array:return Math.
round(u*65535);case Uint8Array:return Math.round(u*255);case Int32Array:return Math.round(u*2147483647);case Int16Array:
return Math.round(u*32767);case Int8Array:return Math.round(u*127);default:throw new Error("Invalid component type.")}}class pt{constructor(t=0,e=0){
pt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){
this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){
return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("in\
dex is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error(
"index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){
return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.
y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){
return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,
this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){
return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.
y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.
x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=N(this.x,t.x,e.x),this.y=N(this.y,t.y,e.
y),this}clampScalar(t,e){return this.x=N(this.x,t,e),this.y=N(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.
divideScalar(i||1).multiplyScalar(N(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){
return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(
this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.
x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*
this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.
abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){
const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(N(i,-1,
1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*
e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(
t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,
this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],
this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(
e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),n=this.x-t.x,o=this.y-t.y;return this.x=n*i-o*s+t.x,this.y=n*
s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.
y}}class ce{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,n,o,r){
let a=i[s+0],h=i[s+1],c=i[s+2],l=i[s+3],d=n[o+0],f=n[o+1],m=n[o+2],x=n[o+3];if(r<=0){t[e+0]=a,t[e+1]=h,t[e+2]=c,t[e+3]=l;
return}if(r>=1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=x;return}if(l!==x||a!==d||h!==f||c!==m){let w=a*d+h*f+c*m+l*x;w<0&&(d=
-d,f=-f,m=-m,x=-x,w=-w);let b=1-r;if(w<.9995){const p=Math.acos(w),y=Math.sin(p);b=Math.sin(b*p)/y,r=Math.sin(r*p)/y,a=a*
b+d*r,h=h*b+f*r,c=c*b+m*r,l=l*b+x*r}else{a=a*b+d*r,h=h*b+f*r,c=c*b+m*r,l=l*b+x*r;const p=1/Math.sqrt(a*a+h*h+c*c+l*l);a*=
p,h*=p,c*=p,l*=p}}t[e]=a,t[e+1]=h,t[e+2]=c,t[e+3]=l}static multiplyQuaternionsFlat(t,e,i,s,n,o){const r=i[s],a=i[s+1],h=i[s+
2],c=i[s+3],l=n[o],d=n[o+1],f=n[o+2],m=n[o+3];return t[e]=r*m+c*l+a*f-h*d,t[e+1]=a*m+c*d+h*l-r*f,t[e+2]=h*m+c*f+r*d-a*l,
t[e+3]=c*m-r*l-a*d-h*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){
this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this.
_w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),
this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=
t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,n=t._z,o=t._order,r=Math.cos,a=Math.
sin,h=r(i/2),c=r(s/2),l=r(n/2),d=a(i/2),f=a(s/2),m=a(n/2);switch(o){case"XYZ":this._x=d*c*l+h*f*m,this._y=h*f*l-d*c*m,this.
_z=h*c*m+d*f*l,this._w=h*c*l-d*f*m;break;case"YXZ":this._x=d*c*l+h*f*m,this._y=h*f*l-d*c*m,this._z=h*c*m-d*f*l,this._w=h*
c*l+d*f*m;break;case"ZXY":this._x=d*c*l-h*f*m,this._y=h*f*l+d*c*m,this._z=h*c*m+d*f*l,this._w=h*c*l-d*f*m;break;case"ZYX":
this._x=d*c*l-h*f*m,this._y=h*f*l+d*c*m,this._z=h*c*m-d*f*l,this._w=h*c*l+d*f*m;break;case"YZX":this._x=d*c*l+h*f*m,this.
_y=h*f*l+d*c*m,this._z=h*c*m-d*f*l,this._w=h*c*l-d*f*m;break;case"XZY":this._x=d*c*l-h*f*m,this._y=h*f*l-d*c*m,this._z=h*
c*m+d*f*l,this._w=h*c*l+d*f*m;break;default:K("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===
!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this.
_z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],n=e[8],
o=e[1],r=e[5],a=e[9],h=e[2],c=e[6],l=e[10],d=i+r+l;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(c-a)*f,this.
_y=(n-h)*f,this._z=(o-s)*f}else if(i>r&&i>l){const f=2*Math.sqrt(1+i-r-l);this._w=(c-a)/f,this._x=.25*f,this._y=(s+o)/f,
this._z=(n+h)/f}else if(r>l){const f=2*Math.sqrt(1+r-i-l);this._w=(n-h)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(a+c)/f}else{
const f=2*Math.sqrt(1+l-i-r);this._w=(o-s)/f,this._x=(n+h)/f,this._y=(a+c)/f,this._z=.25*f}return this._onChangeCallback(),
this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this.
_z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=
t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(N(this.dot(t),-1,1)))}rotateTowards(t,e){
const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.
set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),
this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+
this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){
let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this.
_z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){
return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,n=t._z,o=t._w,r=e._x,a=e._y,h=e._z,
c=e._w;return this._x=i*c+o*r+s*h-n*a,this._y=s*c+o*a+n*r-i*h,this._z=n*c+o*h+i*a-s*r,this._w=o*c-i*r-s*a-n*h,this._onChangeCallback(),
this}slerp(t,e){if(e<=0)return this;if(e>=1)return this.copy(t);let i=t._x,s=t._y,n=t._z,o=t._w,r=this.dot(t);r<0&&(i=-i,
s=-s,n=-n,o=-o,r=-r);let a=1-e;if(r<.9995){const h=Math.acos(r),c=Math.sin(h);a=Math.sin(a*h)/c,e=Math.sin(e*h)/c,this._x=
this._x*a+i*e,this._y=this._y*a+s*e,this._z=this._z*a+n*e,this._w=this._w*a+o*e,this._onChangeCallback()}else this._x=this.
_x*a+i*e,this._y=this._y*a+s*e,this._z=this._z*a+n*e,this._w=this._w*a+o*e,this.normalize();return this}slerpQuaternions(t,e,i){
return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.
sqrt(1-i),n=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),n*Math.sin(e),n*Math.cos(e))}equals(t){return t._x===
this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+
2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+
3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this.
_onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.
iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class _{constructor(t=0,e=0,i=0){_.prototype.isVector3=
!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.
x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){
switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of ran\
ge: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error(
"index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=
t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.
z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.
x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=
t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.
x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.
x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Bi.setFromEuler(t))}applyAxisAngle(t,e){
return this.applyQuaternion(Bi.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,n=t.elements;return this.
x=n[0]*e+n[3]*i+n[6]*s,this.y=n[1]*e+n[4]*i+n[7]*s,this.z=n[2]*e+n[5]*i+n[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(
t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,n=t.elements,o=1/(n[3]*e+n[7]*i+n[11]*s+n[15]);return this.
x=(n[0]*e+n[4]*i+n[8]*s+n[12])*o,this.y=(n[1]*e+n[5]*i+n[9]*s+n[13])*o,this.z=(n[2]*e+n[6]*i+n[10]*s+n[14])*o,this}applyQuaternion(t){
const e=this.x,i=this.y,s=this.z,n=t.x,o=t.y,r=t.z,a=t.w,h=2*(o*s-r*i),c=2*(r*e-n*s),l=2*(n*i-o*e);return this.x=e+a*h+o*
l-r*c,this.y=i+a*c+r*h-n*l,this.z=s+a*l+n*c-o*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(
t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){
const e=this.x,i=this.y,s=this.z,n=t.elements;return this.x=n[0]*e+n[4]*i+n[8]*s,this.y=n[1]*e+n[5]*i+n[9]*s,this.z=n[2]*
e+n[6]*i+n[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.
multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){
return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=
N(this.x,t.x,e.x),this.y=N(this.y,t.y,e.y),this.z=N(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=N(this.x,t,e),this.
y=N(this.y,t,e),this.z=N(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(
N(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.
x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.
y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.
y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*
t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.
x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.
divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.
x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-
t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,n=t.z,o=e.
x,r=e.y,a=e.z;return this.x=s*a-n*r,this.y=n*o-i*a,this.z=i*r-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)
return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Ye.copy(this).
projectOnVector(t),this.sub(Ye)}reflect(t){return this.sub(Ye.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.
sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(N(i,-1,1))}distanceTo(t){
return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+
i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){
return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.
x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(
t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){
const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(
t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,
this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(
t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=
t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=
t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.
x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.
random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.
cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ye=new _,Bi=new ce;
class Dt{constructor(t,e,i,s,n,o,r,a,h){Dt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(
t,e,i,s,n,o,r,a,h)}set(t,e,i,s,n,o,r,a,h){const c=this.elements;return c[0]=t,c[1]=s,c[2]=r,c[3]=e,c[4]=n,c[5]=a,c[6]=i,
c[7]=o,c[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=
i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(
this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.
set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){
return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,n=this.elements,o=i[0],r=i[3],
a=i[6],h=i[1],c=i[4],l=i[7],d=i[2],f=i[5],m=i[8],x=s[0],w=s[3],b=s[6],p=s[1],y=s[4],g=s[7],A=s[2],z=s[5],S=s[8];return n[0]=
o*x+r*p+a*A,n[3]=o*w+r*y+a*z,n[6]=o*b+r*g+a*S,n[1]=h*x+c*p+l*A,n[4]=h*w+c*y+l*z,n[7]=h*b+c*g+l*S,n[2]=d*x+f*p+m*A,n[5]=d*
w+f*y+m*z,n[8]=d*b+f*g+m*S,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=
t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],n=t[3],o=t[4],r=t[5],a=t[6],h=t[7],
c=t[8];return e*o*c-e*r*h-i*n*c+i*r*a+s*n*h-s*o*a}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],n=t[3],o=t[4],r=t[5],
a=t[6],h=t[7],c=t[8],l=c*o-r*h,d=r*a-c*n,f=h*n-o*a,m=e*l+i*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/m;
return t[0]=l*x,t[1]=(s*h-c*i)*x,t[2]=(r*i-s*o)*x,t[3]=d*x,t[4]=(c*e-s*a)*x,t[5]=(s*n-r*e)*x,t[6]=f*x,t[7]=(i*a-h*e)*x,t[8]=
(o*e-i*n)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=
e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.
elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,n,o,r){
const a=Math.cos(n),h=Math.sin(n);return this.set(i*a,i*h,-i*(a*o+h*r)+o+t,-s*h,s*a,-s*(-h*o+a*r)+r+e,0,0,1),this}scale(t,e){
return this.premultiply(He.makeScale(t,e)),this}rotate(t){return this.premultiply(He.makeRotation(-t)),this}translate(t,e){
return this.premultiply(He.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,
0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,
1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<
9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){
const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],
t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const He=new Dt,Di=new Dt().set(.4123908,.3575843,
.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ni=new Dt().set(3.2409699,-1.5373832,-.4986108,-.9692436,
1.8759675,.0415551,.0556301,-.203977,1.0569715);function Es(){const u={enabled:!0,workingColorSpace:Fi,spaces:{},convert:function(s,n,o){
return this.enabled===!1||n===o||!n||!o||(this.spaces[n].transfer===qe&&(s.r=Tt(s.r),s.g=Tt(s.g),s.b=Tt(s.b)),this.spaces[n].
primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[n].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.
spaces[o].transfer===qe&&(s.r=ee(s.r),s.g=ee(s.g),s.b=ee(s.b))),s},workingToColorSpace:function(s,n){return this.convert(
s,this.workingColorSpace,n)},colorSpaceToWorking:function(s,n){return this.convert(s,n,this.workingColorSpace)},getPrimaries:function(s){
return this.spaces[s].primaries},getTransfer:function(s){return s===ts?Ti:this.spaces[s].transfer},getToneMappingMode:function(s){
return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,n=this.workingColorSpace){
return s.fromArray(this.spaces[n].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,n,o){
return s.copy(this.spaces[n].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.
spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.
spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,n){return Oi("ColorManagement: .fro\
mWorkingColorSpace() has been renamed to .workingToColorSpace()."),u.workingToColorSpace(s,n)},toWorkingColorSpace:function(s,n){
return Oi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),u.colorSpaceToWorking(s,
n)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return u.define({[Fi]:{primaries:t,whitePoint:i,transfer:Ti,
toXYZ:Di,fromXYZ:Ni,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ut},outputColorSpaceConfig:{drawingBufferColorSpace:ut}},
[ut]:{primaries:t,whitePoint:i,transfer:qe,toXYZ:Di,fromXYZ:Ni,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ut}}}),
u}const at=Es();function Tt(u){return u<.04045?u*.0773993808:Math.pow(u*.9478672986+.0521327014,2.4)}function ee(u){return u<
.0031308?u*12.92:1.055*Math.pow(u,.41666)-.055}let Ht;class Is{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||
typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Ht===void 0&&(Ht=ki("canvas")),
Ht.width=t.width,Ht.height=t.height;const s=Ht.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(
t,0,0,t.width,t.height),i=Ht}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||
typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ki(
"canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(
0,0,t.width,t.height),n=s.data;for(let o=0;o<n.length;o++)n[o]=Tt(n[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.
data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.
floor(Tt(e[i]/255)*255):e[i]=Tt(e[i]);return{data:e,width:t.width,height:t.height}}else return K("ImageUtils.sRGBToLinea\
r(): Unsupported image type. No color space conversion applied."),t}}let ks=0;class Rs{constructor(t=null){this.isSource=
!0,Object.defineProperty(this,"id",{value:ks++}),this.uuid=he(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){
const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):
typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.
depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&
t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let n;if(Array.
isArray(s)){n=[];for(let o=0,r=s.length;o<r;o++)s[o].isDataTexture?n.push(Ge(s[o].image)):n.push(Ge(s[o]))}else n=Ge(s);
i.url=n}return e||(t.images[this.uuid]=i),i}}function Ge(u){return typeof HTMLImageElement<"u"&&u instanceof HTMLImageElement||
typeof HTMLCanvasElement<"u"&&u instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&u instanceof ImageBitmap?Is.getDataURL(
u):u.data?{data:Array.from(u.data),width:u.width,height:u.height,type:u.data.constructor.name}:(K("Texture: Unable to se\
rialize Texture."),{})}let Os=0;const je=new _;class Pt extends ve{constructor(t=Pt.DEFAULT_IMAGE,e=Pt.DEFAULT_MAPPING,i=pe,s=pe,n=As,o=zs,r=Fs,a=Ss,h=Pt.
DEFAULT_ANISOTROPY,c=ts){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Os++}),this.uuid=he(),this.name=
"",this.source=new Rs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=n,this.minFilter=
o,this.anisotropy=h,this.format=r,this.internalFormat=null,this.type=a,this.offset=new pt(0,0),this.repeat=new pt(1,1),this.
center=new pt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Dt,this.generateMipmaps=!0,this.premultiplyAlpha=
!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=
null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=
0}get width(){return this.source.getSize(je).x}get height(){return this.source.getSize(je).y}get depth(){return this.source.
getSize(je).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(
this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.
updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().
copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.
channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=
t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.
repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.
matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,
this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=
t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=
!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){K(`Texture.setValues(): parameter '${e}' has value of\
 undefined.`);continue}const s=this[e];if(s===void 0){K(`Texture.setValues(): property '${e}' does not exist.`);continue}
s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){
const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{
version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.
mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.
x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,
type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.
flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};
return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent(
{type:"dispose"})}transformUv(t){if(this.mapping!==Ki)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Si:
t.x=t.x-Math.floor(t.x);break;case pe:t.x=t.x<0?0:1;break;case _i:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:
t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Si:t.y=t.y-Math.floor(t.y);break;case pe:t.y=t.y<0?
0:1;break;case _i:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&
(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.
pmremVersion++}}Pt.DEFAULT_IMAGE=null;Pt.DEFAULT_MAPPING=Ki;Pt.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,i=0,s=1){
le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){
return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.
x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){
return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:
this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.
x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){
return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?
t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.
z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){
return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.
w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.
y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){
return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,n=this.w,o=t.elements;
return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*n,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*n,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*n,this.
w=o[3]*e+o[7]*i+o[11]*s+o[15]*n,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){
return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<
1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,
i,s,n;const a=t.elements,h=a[0],c=a[4],l=a[8],d=a[1],f=a[5],m=a[9],x=a[2],w=a[6],b=a[10];if(Math.abs(c-d)<.01&&Math.abs(
l-x)<.01&&Math.abs(m-w)<.01){if(Math.abs(c+d)<.1&&Math.abs(l+x)<.1&&Math.abs(m+w)<.1&&Math.abs(h+f+b-3)<.1)return this.set(
1,0,0,0),this;e=Math.PI;const y=(h+1)/2,g=(f+1)/2,A=(b+1)/2,z=(c+d)/4,S=(l+x)/4,M=(m+w)/4;return y>g&&y>A?y<.01?(i=0,s=.707106781,
n=.707106781):(i=Math.sqrt(y),s=z/i,n=S/i):g>A?g<.01?(i=.707106781,s=0,n=.707106781):(s=Math.sqrt(g),i=z/s,n=M/s):A<.01?
(i=.707106781,s=.707106781,n=0):(n=Math.sqrt(A),i=S/n,s=M/n),this.set(i,s,n,e),this}let p=Math.sqrt((w-m)*(w-m)+(l-x)*(l-
x)+(d-c)*(d-c));return Math.abs(p)<.001&&(p=1),this.x=(w-m)/p,this.y=(l-x)/p,this.z=(d-c)/p,this.w=Math.acos((h+f+b-1)/2),
this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){
return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){
return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){
return this.x=N(this.x,t.x,e.x),this.y=N(this.y,t.y,e.y),this.z=N(this.z,t.z,e.z),this.w=N(this.w,t.w,e.w),this}clampScalar(t,e){
return this.x=N(this.x,t,e),this.y=N(this.y,t,e),this.z=N(this.z,t,e),this.w=N(this.w,t,e),this}clampLength(t,e){const i=this.
length();return this.divideScalar(i||1).multiplyScalar(N(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(
this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(
this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(
this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.
trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.
z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+
this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.
w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.
divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.
x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-
t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.
y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){
return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.
getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),
this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ue{constructor(t=new _(
1/0,1/0,1/0),e=new _(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(
e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ht.fromArray(t,e));return this}setFromBufferAttribute(t){
this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ht.fromBufferAttribute(t,e));return this}setFromPoints(t){
this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ht.
copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.
makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),
this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,
this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?
t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(
this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),
this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.
updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const n=i.getAttribute("position");if(e===!0&&n!==void 0&&t.isInstancedMesh!==
!0)for(let o=0,r=n.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,ht):ht.fromBufferAttribute(n,o),ht.applyMatrix4(t.matrixWorld),
this.expandByPoint(ht);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),xe.copy(t.boundingBox)):
(i.boundingBox===null&&i.computeBoundingBox(),xe.copy(i.boundingBox)),xe.applyMatrix4(t.matrixWorld),this.union(xe)}const s=t.
children;for(let n=0,o=s.length;n<o;n++)this.expandByObject(s[n],e);return this}containsPoint(t){return t.x>=this.min.x&&
t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.
min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){
return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.
z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.
y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ht),ht.distanceToSquared(
t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.
x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=
t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.
z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.
getCenter(se),ge.subVectors(this.max,se),Gt.subVectors(t.a,se),jt.subVectors(t.b,se),Xt.subVectors(t.c,se),It.subVectors(
jt,Gt),kt.subVectors(Xt,jt),Nt.subVectors(Gt,Xt);let e=[0,-It.z,It.y,0,-kt.z,kt.y,0,-Nt.z,Nt.y,It.z,0,-It.x,kt.z,0,-kt.x,
Nt.z,0,-Nt.x,-It.y,It.x,0,-kt.y,kt.x,0,-Nt.y,Nt.x,0];return!Xe(e,Gt,jt,Xt,ge)||(e=[1,0,0,0,1,0,0,0,1],!Xe(e,Gt,jt,Xt,ge))?
!1:(be.crossVectors(It,kt),e=[be.x,be.y,be.z],Xe(e,Gt,jt,Xt,ge))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){
return this.clampPoint(t,ht).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),
t.radius=this.getSize(ht).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.
makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:
(wt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),wt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),
wt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),wt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),
wt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),wt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),
wt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),wt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),
this.setFromPoints(wt),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.
min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.
fromArray(t.min),this.max.fromArray(t.max),this}}const wt=[new _,new _,new _,new _,new _,new _,new _,new _],ht=new _,xe=new ue,
Gt=new _,jt=new _,Xt=new _,It=new _,kt=new _,Nt=new _,se=new _,ge=new _,be=new _,vt=new _;function Xe(u,t,e,i,s){for(let n=0,
o=u.length-3;n<=o;n+=3){vt.fromArray(u,n);const r=s.x*Math.abs(vt.x)+s.y*Math.abs(vt.y)+s.z*Math.abs(vt.z),a=t.dot(vt),h=e.
dot(vt),c=i.dot(vt);if(Math.max(-Math.max(a,h,c),Math.min(a,h,c))>r)return!1}return!0}const Bs=new ue,ne=new _,Ze=new _;
class fi{constructor(t=new _,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.
radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Bs.setFromPoints(t).getCenter(i);let s=0;for(let n=0,
o=t.length;n<o;n++)s=Math.max(s,i.distanceToSquared(t[n]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.
copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=
-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(
this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=
e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=
this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(
this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),
t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.
radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())
return this.center.copy(t),this.radius=0,this;ne.subVectors(t,this.center);const e=ne.lengthSq();if(e>this.radius*this.radius){
const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(ne,s/i),this.radius+=s}return this}union(t){return t.
isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.
radius):(Ze.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ne.copy(t.center).add(Ze)),this.expandByPoint(
ne.copy(t.center).sub(Ze))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.
constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=
t.radius,this.center.fromArray(t.center),this}}const Mt=new _,Je=new _,we=new _,Rt=new _,$e=new _,Me=new _,Qe=new _;class Ds{constructor(t=new _,e=new _(
0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.
origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,
t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,
Mt)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):
e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){
const e=Mt.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Mt.copy(this.origin).
addScaledVector(this.direction,e),Mt.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Je.copy(t).add(e).multiplyScalar(
.5),we.copy(e).sub(t).normalize(),Rt.copy(this.origin).sub(Je);const n=t.distanceTo(e)*.5,o=-this.direction.dot(we),r=Rt.
dot(this.direction),a=-Rt.dot(we),h=Rt.lengthSq(),c=Math.abs(1-o*o);let l,d,f,m;if(c>0)if(l=o*a-r,d=o*r-a,m=n*c,l>=0)if(d>=
-m)if(d<=m){const x=1/c;l*=x,d*=x,f=l*(l+o*d+2*r)+d*(o*l+d+2*a)+h}else d=n,l=Math.max(0,-(o*d+r)),f=-l*l+d*(d+2*a)+h;else
d=-n,l=Math.max(0,-(o*d+r)),f=-l*l+d*(d+2*a)+h;else d<=-m?(l=Math.max(0,-(-o*n+r)),d=l>0?-n:Math.min(Math.max(-n,-a),n),
f=-l*l+d*(d+2*a)+h):d<=m?(l=0,d=Math.min(Math.max(-n,-a),n),f=d*(d+2*a)+h):(l=Math.max(0,-(o*n+r)),d=l>0?n:Math.min(Math.
max(-n,-a),n),f=-l*l+d*(d+2*a)+h);else d=o>0?-n:n,l=Math.max(0,-(o*d+r)),f=-l*l+d*(d+2*a)+h;return i&&i.copy(this.origin).
addScaledVector(this.direction,l),s&&s.copy(Je).addScaledVector(we,d),f}intersectSphere(t,e){Mt.subVectors(t.center,this.
origin);const i=Mt.dot(this.direction),s=Mt.dot(Mt)-i*i,n=t.radius*t.radius;if(s>n)return null;const o=Math.sqrt(n-s),r=i-
o,a=i+o;return a<0?null:r<0?this.at(a,e):this.at(r,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.
center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.
origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.
distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===
0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,n,o,r,a;const h=1/this.direction.x,c=1/this.direction.y,l=1/
this.direction.z,d=this.origin;return h>=0?(i=(t.min.x-d.x)*h,s=(t.max.x-d.x)*h):(i=(t.max.x-d.x)*h,s=(t.min.x-d.x)*h),c>=
0?(n=(t.min.y-d.y)*c,o=(t.max.y-d.y)*c):(n=(t.max.y-d.y)*c,o=(t.min.y-d.y)*c),i>o||n>s||((n>i||isNaN(i))&&(i=n),(o<s||isNaN(
s))&&(s=o),l>=0?(r=(t.min.z-d.z)*l,a=(t.max.z-d.z)*l):(r=(t.max.z-d.z)*l,a=(t.min.z-d.z)*l),i>a||r>s)||((r>i||i!==i)&&(i=
r),(a<s||s!==s)&&(s=a),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Mt)!==null}intersectTriangle(t,e,i,s,n){
$e.subVectors(e,t),Me.subVectors(i,t),Qe.crossVectors($e,Me);let o=this.direction.dot(Qe),r;if(o>0){if(s)return null;r=1}else if(o<
0)r=-1,o=-o;else return null;Rt.subVectors(this.origin,t);const a=r*this.direction.dot(Me.crossVectors(Rt,Me));if(a<0)return null;
const h=r*this.direction.dot($e.cross(Rt));if(h<0||a+h>o)return null;const c=-r*Rt.dot(Qe);return c<0?null:this.at(c/o,n)}applyMatrix4(t){
return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&
t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class mt{constructor(t,e,i,s,n,o,r,a,h,c,l,d,f,m,x,w){
mt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,n,o,r,a,h,c,l,d,f,
m,x,w)}set(t,e,i,s,n,o,r,a,h,c,l,d,f,m,x,w){const b=this.elements;return b[0]=t,b[4]=e,b[8]=i,b[12]=s,b[1]=n,b[5]=o,b[9]=
r,b[13]=a,b[2]=h,b[6]=c,b[10]=l,b[14]=d,b[3]=f,b[7]=m,b[11]=x,b[15]=w,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,
0,1,0,0,0,0,1),this}clone(){return new mt().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=
i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=
i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=
i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],
e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinant()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.
setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.
set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();
const e=this.elements,i=t.elements,s=1/Zt.setFromMatrixColumn(t,0).length(),n=1/Zt.setFromMatrixColumn(t,1).length(),o=1/
Zt.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*n,e[5]=i[5]*n,e[6]=i[6]*
n,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.
elements,i=t.x,s=t.y,n=t.z,o=Math.cos(i),r=Math.sin(i),a=Math.cos(s),h=Math.sin(s),c=Math.cos(n),l=Math.sin(n);if(t.order===
"XYZ"){const d=o*c,f=o*l,m=r*c,x=r*l;e[0]=a*c,e[4]=-a*l,e[8]=h,e[1]=f+m*h,e[5]=d-x*h,e[9]=-r*a,e[2]=x-d*h,e[6]=m+f*h,e[10]=
o*a}else if(t.order==="YXZ"){const d=a*c,f=a*l,m=h*c,x=h*l;e[0]=d+x*r,e[4]=m*r-f,e[8]=o*h,e[1]=o*l,e[5]=o*c,e[9]=-r,e[2]=
f*r-m,e[6]=x+d*r,e[10]=o*a}else if(t.order==="ZXY"){const d=a*c,f=a*l,m=h*c,x=h*l;e[0]=d-x*r,e[4]=-o*l,e[8]=m+f*r,e[1]=f+
m*r,e[5]=o*c,e[9]=x-d*r,e[2]=-o*h,e[6]=r,e[10]=o*a}else if(t.order==="ZYX"){const d=o*c,f=o*l,m=r*c,x=r*l;e[0]=a*c,e[4]=
m*h-f,e[8]=d*h+x,e[1]=a*l,e[5]=x*h+d,e[9]=f*h-m,e[2]=-h,e[6]=r*a,e[10]=o*a}else if(t.order==="YZX"){const d=o*a,f=o*h,m=r*
a,x=r*h;e[0]=a*c,e[4]=x-d*l,e[8]=m*l+f,e[1]=l,e[5]=o*c,e[9]=-r*c,e[2]=-h*c,e[6]=f*l+m,e[10]=d-x*l}else if(t.order==="XZY"){
const d=o*a,f=o*h,m=r*a,x=r*h;e[0]=a*c,e[4]=-l,e[8]=h*c,e[1]=d*l+x,e[5]=o*c,e[9]=f*l-m,e[2]=m*l-f,e[6]=r*c,e[10]=x*l+d}return e[3]=
0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ns,t,vs)}lookAt(t,e,i){
const s=this.elements;return it.subVectors(t,e),it.lengthSq()===0&&(it.z=1),it.normalize(),Ot.crossVectors(i,it),Ot.lengthSq()===
0&&(Math.abs(i.z)===1?it.x+=1e-4:it.z+=1e-4,it.normalize(),Ot.crossVectors(i,it)),Ot.normalize(),Ae.crossVectors(it,Ot),
s[0]=Ot.x,s[4]=Ae.x,s[8]=it.x,s[1]=Ot.y,s[5]=Ae.y,s[9]=it.y,s[2]=Ot.z,s[6]=Ae.z,s[10]=it.z,this}multiply(t){return this.
multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.
elements,n=this.elements,o=i[0],r=i[4],a=i[8],h=i[12],c=i[1],l=i[5],d=i[9],f=i[13],m=i[2],x=i[6],w=i[10],b=i[14],p=i[3],
y=i[7],g=i[11],A=i[15],z=s[0],S=s[4],M=s[8],T=s[12],I=s[1],F=s[5],C=s[9],E=s[13],k=s[2],B=s[6],D=s[10],O=s[14],L=s[3],q=s[7],
H=s[11],P=s[15];return n[0]=o*z+r*I+a*k+h*L,n[4]=o*S+r*F+a*B+h*q,n[8]=o*M+r*C+a*D+h*H,n[12]=o*T+r*E+a*O+h*P,n[1]=c*z+l*I+
d*k+f*L,n[5]=c*S+l*F+d*B+f*q,n[9]=c*M+l*C+d*D+f*H,n[13]=c*T+l*E+d*O+f*P,n[2]=m*z+x*I+w*k+b*L,n[6]=m*S+x*F+w*B+b*q,n[10]=
m*M+x*C+w*D+b*H,n[14]=m*T+x*E+w*O+b*P,n[3]=p*z+y*I+g*k+A*L,n[7]=p*S+y*F+g*B+A*q,n[11]=p*M+y*C+g*D+A*H,n[15]=p*T+y*E+g*O+
A*P,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=
t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],
s=t[8],n=t[12],o=t[1],r=t[5],a=t[9],h=t[13],c=t[2],l=t[6],d=t[10],f=t[14],m=t[3],x=t[7],w=t[11],b=t[15],p=a*f-h*d,y=r*f-
h*l,g=r*d-a*l,A=o*f-h*c,z=o*d-a*c,S=o*l-r*c;return e*(x*p-w*y+b*g)-i*(m*p-w*A+b*z)+s*(m*y-x*A+b*S)-n*(m*g-x*z+w*S)}transpose(){
const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],
t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?
(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],n=t[3],
o=t[4],r=t[5],a=t[6],h=t[7],c=t[8],l=t[9],d=t[10],f=t[11],m=t[12],x=t[13],w=t[14],b=t[15],p=l*w*h-x*d*h+x*a*f-r*w*f-l*a*
b+r*d*b,y=m*d*h-c*w*h-m*a*f+o*w*f+c*a*b-o*d*b,g=c*x*h-m*l*h+m*r*f-o*x*f-c*r*b+o*l*b,A=m*l*a-c*x*a-m*r*d+o*x*d+c*r*w-o*l*
w,z=e*p+i*y+s*g+n*A;if(z===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/z;return t[0]=p*S,t[1]=(x*d*n-l*
w*n-x*s*f+i*w*f+l*s*b-i*d*b)*S,t[2]=(r*w*n-x*a*n+x*s*h-i*w*h-r*s*b+i*a*b)*S,t[3]=(l*a*n-r*d*n-l*s*h+i*d*h+r*s*f-i*a*f)*S,
t[4]=y*S,t[5]=(c*w*n-m*d*n+m*s*f-e*w*f-c*s*b+e*d*b)*S,t[6]=(m*a*n-o*w*n-m*s*h+e*w*h+o*s*b-e*a*b)*S,t[7]=(o*d*n-c*a*n+c*s*
h-e*d*h-o*s*f+e*a*f)*S,t[8]=g*S,t[9]=(m*l*n-c*x*n-m*i*f+e*x*f+c*i*b-e*l*b)*S,t[10]=(o*x*n-m*r*n+m*i*h-e*x*h-o*i*b+e*r*b)*
S,t[11]=(c*r*n-o*l*n-c*i*h+e*l*h+o*i*f-e*r*f)*S,t[12]=A*S,t[13]=(c*x*s-m*l*s+m*i*d-e*x*d-c*i*w+e*l*w)*S,t[14]=(m*r*s-o*x*
s-m*i*a+e*x*a+o*i*w-e*r*w)*S,t[15]=(o*l*s-c*r*s+c*i*a-e*l*a-o*i*d+e*r*d)*S,this}scale(t){const e=this.elements,i=t.x,s=t.
y,n=t.z;return e[0]*=i,e[4]*=s,e[8]*=n,e[1]*=i,e[5]*=s,e[9]*=n,e[2]*=i,e[6]*=s,e[10]*=n,e[3]*=i,e[7]*=s,e[11]*=n,this}getMaxScaleOnAxis(){
const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];
return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,
1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,
0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,
0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),
this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),n=1-i,o=t.x,r=t.y,a=t.z,h=n*o,c=n*r;return this.set(h*o+i,h*
r-s*a,h*a+s*r,0,h*r+s*a,c*r+i,c*a-s*o,0,h*a-s*r,c*a+s*o,n*a*a+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,
0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,n,o){return this.set(1,i,n,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){
const s=this.elements,n=e._x,o=e._y,r=e._z,a=e._w,h=n+n,c=o+o,l=r+r,d=n*h,f=n*c,m=n*l,x=o*c,w=o*l,b=r*l,p=a*h,y=a*c,g=a*
l,A=i.x,z=i.y,S=i.z;return s[0]=(1-(x+b))*A,s[1]=(f+g)*A,s[2]=(m-y)*A,s[3]=0,s[4]=(f-g)*z,s[5]=(1-(d+b))*z,s[6]=(w+p)*z,
s[7]=0,s[8]=(m+y)*S,s[9]=(w-p)*S,s[10]=(1-(d+x))*S,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.
elements;if(t.x=s[12],t.y=s[13],t.z=s[14],this.determinant()===0)return i.set(1,1,1),e.identity(),this;let n=Zt.set(s[0],
s[1],s[2]).length();const o=Zt.set(s[4],s[5],s[6]).length(),r=Zt.set(s[8],s[9],s[10]).length();this.determinant()<0&&(n=
-n),ct.copy(this);const h=1/n,c=1/o,l=1/r;return ct.elements[0]*=h,ct.elements[1]*=h,ct.elements[2]*=h,ct.elements[4]*=c,
ct.elements[5]*=c,ct.elements[6]*=c,ct.elements[8]*=l,ct.elements[9]*=l,ct.elements[10]*=l,e.setFromRotationMatrix(ct),i.
x=n,i.y=o,i.z=r,this}makePerspective(t,e,i,s,n,o,r=ye,a=!1){const h=this.elements,c=2*n/(e-t),l=2*n/(i-s),d=(e+t)/(e-t),
f=(i+s)/(i-s);let m,x;if(a)m=n/(o-n),x=o*n/(o-n);else if(r===ye)m=-(o+n)/(o-n),x=-2*o*n/(o-n);else if(r===Ii)m=-o/(o-n),
x=-o*n/(o-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return h[0]=c,h[4]=0,
h[8]=d,h[12]=0,h[1]=0,h[5]=l,h[9]=f,h[13]=0,h[2]=0,h[6]=0,h[10]=m,h[14]=x,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(t,e,i,s,n,o,r=ye,a=!1){
const h=this.elements,c=2/(e-t),l=2/(i-s),d=-(e+t)/(e-t),f=-(i+s)/(i-s);let m,x;if(a)m=1/(o-n),x=o/(o-n);else if(r===ye)
m=-2/(o-n),x=-(o+n)/(o-n);else if(r===Ii)m=-1/(o-n),x=-n/(o-n);else throw new Error("THREE.Matrix4.makeOrthographic(): I\
nvalid coordinate system: "+r);return h[0]=c,h[4]=0,h[8]=0,h[12]=d,h[1]=0,h[5]=l,h[9]=0,h[13]=f,h[2]=0,h[6]=0,h[10]=m,h[14]=
x,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;
return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;
return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=
i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Zt=new _,ct=new mt,Ns=new _(
0,0,0),vs=new _(1,1,1),Ot=new _,Ae=new _,it=new _,vi=new mt,Li=new ce;class de{constructor(t=0,e=0,i=0,s=de.DEFAULT_ORDER){
this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){
return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){
return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=
e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this.
_order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this.
_order,i=!0){const s=t.elements,n=s[0],o=s[4],r=s[8],a=s[1],h=s[5],c=s[9],l=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this.
_y=Math.asin(N(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-c,f),this._z=Math.atan2(-o,n)):(this._x=Math.atan2(d,h),
this._z=0);break;case"YXZ":this._x=Math.asin(-N(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(
a,h)):(this._y=Math.atan2(-l,n),this._z=0);break;case"ZXY":this._x=Math.asin(N(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.
atan2(-l,f),this._z=Math.atan2(-o,h)):(this._y=0,this._z=Math.atan2(a,n));break;case"ZYX":this._y=Math.asin(-N(l,-1,1)),
Math.abs(l)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(a,n)):(this._x=0,this._z=Math.atan2(-o,h));break;case"Y\
ZX":this._z=Math.asin(N(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-c,h),this._y=Math.atan2(-l,n)):(this._x=0,this.
_y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-N(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,h),this._y=
Math.atan2(r,n)):(this._x=Math.atan2(-c,f),this._y=0);break;default:K("Euler: .setFromRotationMatrix() encountered an un\
known order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return vi.makeRotationFromQuaternion(
t),this.setFromRotationMatrix(vi,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Li.
setFromEuler(this),this.setFromQuaternion(Li,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===
this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),
this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=
t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}de.DEFAULT_ORDER=
"XYZ";class Ls{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=
-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==
0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Us=0;const Ui=new _,Jt=new ce,At=new mt,ze=new _,re=new _,Ps=new _,Ws=new ce,
Pi=new _(1,0,0),Wi=new _(0,1,0),qi=new _(0,0,1),Vi={type:"added"},qs={type:"removed"},$t={type:"childadded",child:null},
Ke={type:"childremoved",child:null};class Ct extends ve{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,
"id",{value:Us++}),this.uuid=he(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ct.DEFAULT_UP.
clone();const t=new _,e=new de,i=new ce,s=new _(1,1,1);function n(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(
i,void 0,!1)}e._onChange(n),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},
rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,
enumerable:!0,value:s},modelViewMatrix:{value:new mt},normalMatrix:{value:new Dt}}),this.matrix=new mt,this.matrixWorld=
new mt,this.matrixAutoUpdate=Ct.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,
this.matrixWorldNeedsUpdate=!1,this.layers=new Ls,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=
!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData=
{}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),
this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.
quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){
this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){
this.quaternion.copy(t)}rotateOnAxis(t,e){return Jt.setFromAxisAngle(t,e),this.quaternion.multiply(Jt),this}rotateOnWorldAxis(t,e){
return Jt.setFromAxisAngle(t,e),this.quaternion.premultiply(Jt),this}rotateX(t){return this.rotateOnAxis(Pi,t)}rotateY(t){
return this.rotateOnAxis(Wi,t)}rotateZ(t){return this.rotateOnAxis(qi,t)}translateOnAxis(t,e){return Ui.copy(t).applyQuaternion(
this.quaternion),this.position.add(Ui.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Pi,t)}translateY(t){
return this.translateOnAxis(Wi,t)}translateZ(t){return this.translateOnAxis(qi,t)}localToWorld(t){return this.updateWorldMatrix(
!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(At.copy(this.
matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ze.copy(t):ze.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,
!1),re.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?At.lookAt(re,ze,this.up):At.lookAt(ze,re,this.
up),this.quaternion.setFromRotationMatrix(At),s&&(At.extractRotation(s.matrixWorld),Jt.setFromRotationMatrix(At),this.quaternion.
premultiply(Jt.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}
return t===this?(Ut("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),
t.parent=this,this.children.push(t),t.dispatchEvent(Vi),$t.child=t,this.dispatchEvent($t),$t.child=null):Ut("Object3D.ad\
d: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)
this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(
e,1),t.dispatchEvent(qs),Ke.child=t,this.dispatchEvent(Ke),Ke.child=null),this}removeFromParent(){const t=this.parent;return t!==
null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),At.
copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),At.multiply(t.parent.matrixWorld)),t.
applyMatrix4(At),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Vi),
$t.child=t,this.dispatchEvent($t),$t.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){
return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.
length;i<s;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){
this[t]===e&&i.push(this);const s=this.children;for(let n=0,o=s.length;n<o;n++)s[n].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){
return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(
!0,!1),this.matrixWorld.decompose(re,t,Ps),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(
re,Ws,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).
normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){
if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){
const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,
this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||
t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(
this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<
s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),
this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.
matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let n=0,
o=s.length;n<o;n++)s[n].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},
materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",
generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===
!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===
!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.
userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===
!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.
toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedM\
esh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.
reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(r=>({...r,boundingBox:r.boundingBox?r.boundingBox.
toJSON():void 0,boundingSphere:r.boundingSphere?r.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(
r=>({...r})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.
slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,
s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=
this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(
t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=
this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function n(r,a){return r[a.
uuid]===void 0&&(r[a.uuid]=a.toJSON(t)),a.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.
background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.
isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||
this.isLine||this.isPoints){s.geometry=n(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==
void 0){const a=r.shapes;if(Array.isArray(a))for(let h=0,c=a.length;h<c;h++){const l=a[h];n(t.shapes,l)}else n(t.shapes,
a)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(t.
skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];
for(let a=0,h=this.material.length;a<h;a++)r.push(n(t.materials,this.material[a]));s.material=r}else s.material=n(t.materials,
this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].
toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const a=this.animations[r];
s.animations.push(n(t.animations,a))}}if(e){const r=o(t.geometries),a=o(t.materials),h=o(t.textures),c=o(t.images),l=o(t.
shapes),d=o(t.skeletons),f=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),a.length>0&&(i.materials=a),h.length>
0&&(i.textures=h),c.length>0&&(i.images=c),l.length>0&&(i.shapes=l),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=
f),m.length>0&&(i.nodes=m)}return i.object=s,i;function o(r){const a=[];for(const h in r){const c=r[h];delete c.metadata,
a.push(c)}return a}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.
up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(
t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=
t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=
t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=
t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<
t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Ct.DEFAULT_UP=new _(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=
!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const lt=new _,zt=new _,ti=new _,St=new _,Qt=new _,Kt=new _,Yi=new _,ei=new _,
ii=new _,si=new _,ni=new le,ri=new le,oi=new le;class dt{constructor(t=new _,e=new _,i=new _){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){
s.subVectors(i,e),lt.subVectors(t,e),s.cross(lt);const n=s.lengthSq();return n>0?s.multiplyScalar(1/Math.sqrt(n)):s.set(
0,0,0)}static getBarycoord(t,e,i,s,n){lt.subVectors(s,e),zt.subVectors(i,e),ti.subVectors(t,e);const o=lt.dot(lt),r=lt.dot(
zt),a=lt.dot(ti),h=zt.dot(zt),c=zt.dot(ti),l=o*h-r*r;if(l===0)return n.set(0,0,0),null;const d=1/l,f=(h*a-r*c)*d,m=(o*c-
r*a)*d;return n.set(1-f-m,m,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,St)===null?!1:St.x>=0&&St.
y>=0&&St.x+St.y<=1}static getInterpolation(t,e,i,s,n,o,r,a){return this.getBarycoord(t,e,i,s,St)===null?(a.x=0,a.y=0,"z"in
a&&(a.z=0),"w"in a&&(a.w=0),null):(a.setScalar(0),a.addScaledVector(n,St.x),a.addScaledVector(o,St.y),a.addScaledVector(
r,St.z),a)}static getInterpolatedAttribute(t,e,i,s,n,o){return ni.setScalar(0),ri.setScalar(0),oi.setScalar(0),ni.fromBufferAttribute(
t,e),ri.fromBufferAttribute(t,i),oi.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(ni,n.x),o.addScaledVector(
ri,n.y),o.addScaledVector(oi,n.z),o}static isFrontFacing(t,e,i,s){return lt.subVectors(i,e),zt.subVectors(t,e),lt.cross(
zt).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.
a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(
t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){
return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return lt.subVectors(this.c,this.b),zt.subVectors(
this.a,this.b),lt.cross(zt).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){
return dt.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){
return dt.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,n){return dt.getInterpolation(t,this.a,this.b,
this.c,e,i,s,n)}containsPoint(t){return dt.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return dt.isFrontFacing(
this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.
b,n=this.c;let o,r;Qt.subVectors(s,i),Kt.subVectors(n,i),ei.subVectors(t,i);const a=Qt.dot(ei),h=Kt.dot(ei);if(a<=0&&h<=
0)return e.copy(i);ii.subVectors(t,s);const c=Qt.dot(ii),l=Kt.dot(ii);if(c>=0&&l<=c)return e.copy(s);const d=a*l-c*h;if(d<=
0&&a>=0&&c<=0)return o=a/(a-c),e.copy(i).addScaledVector(Qt,o);si.subVectors(t,n);const f=Qt.dot(si),m=Kt.dot(si);if(m>=
0&&f<=m)return e.copy(n);const x=f*h-a*m;if(x<=0&&h>=0&&m<=0)return r=h/(h-m),e.copy(i).addScaledVector(Kt,r);const w=c*
m-f*l;if(w<=0&&l-c>=0&&f-m>=0)return Yi.subVectors(n,s),r=(l-c)/(l-c+(f-m)),e.copy(s).addScaledVector(Yi,r);const b=1/(w+
x+d);return o=x*b,r=d*b,e.copy(i).addScaledVector(Qt,o).addScaledVector(Kt,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(
this.b)&&t.c.equals(this.c)}}const es={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,
beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,
cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,
cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,
darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,
darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,
deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,
fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,
grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,
lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,
lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,
lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,
lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,
mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,
midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,
olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,
paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,
powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,
salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,
slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,
tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},
Bt={h:0,s:0,l:0},Se={h:0,s:0,l:0};function ai(u,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?u+(t-u)*6*e:e<1/2?t:e<2/3?u+(t-
u)*6*(2/3-e):u}class Ft{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){
if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.
setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ut){return t=
Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,at.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=at.
workingColorSpace){return this.r=t,this.g=e,this.b=i,at.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=at.workingColorSpace){
if(t=Cs(t,1),e=N(e,0,1),i=N(i,0,1),e===0)this.r=this.g=this.b=i;else{const n=i<=.5?i*(1+e):i+e-i*e,o=2*i-n;this.r=ai(o,n,
t+1/3),this.g=ai(o,n,t),this.b=ai(o,n,t-1/3)}return at.colorSpaceToWorking(this,s),this}setStyle(t,e=ut){function i(n){n!==
void 0&&parseFloat(n)<1&&K("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){
let n;const o=s[1],r=s[2];switch(o){case"rgb":case"rgba":if(n=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.
exec(r))return i(n[4]),this.setRGB(Math.min(255,parseInt(n[1],10))/255,Math.min(255,parseInt(n[2],10))/255,Math.min(255,
parseInt(n[3],10))/255,e);if(n=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(n[4]),
this.setRGB(Math.min(100,parseInt(n[1],10))/100,Math.min(100,parseInt(n[2],10))/100,Math.min(100,parseInt(n[3],10))/100,
e);break;case"hsl":case"hsla":if(n=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.
exec(r))return i(n[4]),this.setHSL(parseFloat(n[1])/360,parseFloat(n[2])/100,parseFloat(n[3])/100,e);break;default:K("Co\
lor: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const n=s[1],o=n.length;if(o===3)return this.setRGB(
parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(
n,16),e);K("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ut){
const i=es[t.toLowerCase()];return i!==void 0?this.setHex(i,e):K("Color: Unknown color "+t),this}clone(){return new this.
constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=
Tt(t.r),this.g=Tt(t.g),this.b=Tt(t.b),this}copyLinearToSRGB(t){return this.r=ee(t.r),this.g=ee(t.g),this.b=ee(t.b),this}convertSRGBToLinear(){
return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ut){return at.
workingToColorSpace($.copy(this),t),Math.round(N($.r*255,0,255))*65536+Math.round(N($.g*255,0,255))*256+Math.round(N($.b*
255,0,255))}getHexString(t=ut){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=at.workingColorSpace){at.
workingToColorSpace($.copy(this),e);const i=$.r,s=$.g,n=$.b,o=Math.max(i,s,n),r=Math.min(i,s,n);let a,h;const c=(r+o)/2;
if(r===o)a=0,h=0;else{const l=o-r;switch(h=c<=.5?l/(o+r):l/(2-o-r),o){case i:a=(s-n)/l+(s<n?6:0);break;case s:a=(n-i)/l+
2;break;case n:a=(i-s)/l+4;break}a/=6}return t.h=a,t.s=h,t.l=c,t}getRGB(t,e=at.workingColorSpace){return at.workingToColorSpace(
$.copy(this),e),t.r=$.r,t.g=$.g,t.b=$.b,t}getStyle(t=ut){at.workingToColorSpace($.copy(this),t);const e=$.r,i=$.g,s=$.b;
return t!==ut?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)}\
,${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Bt),this.setHSL(Bt.h+t,Bt.s+e,Bt.l+i)}add(t){return this.r+=
t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.
r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(
0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=
t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){
return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Bt),t.getHSL(Se);
const i=Ve(Bt.h,Se.h,e),s=Ve(Bt.s,Se.s,e),n=Ve(Bt.l,Se.l,e);return this.setHSL(i,s,n),this}setFromVector3(t){return this.
r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,n=t.elements;return this.r=n[0]*e+n[3]*
i+n[6]*s,this.g=n[1]*e+n[4]*i+n[7]*s,this.b=n[2]*e+n[5]*i+n[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===
this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=
this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){
return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $=new Ft;Ft.NAMES=es;let Vs=0;class Ys extends ve{constructor(){
super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Vs++}),this.uuid=he(),this.name="",this.type="Material",
this.blending=bi,this.side=ui,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mi,
this.blendDst=Ai,this.blendEquation=wi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.
blendColor=new Ft(0,0,0),this.blendAlpha=0,this.depthFunc=zi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=
255,this.stencilFunc=Ci,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Yt,this.stencilZFail=Yt,this.stencilZPass=
Yt,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.
colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=
!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.
toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){
this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.
onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){K(`Material: paramet\
er '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){K(`Material: '${e}' is not a property of THR\
EE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===
void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Mate\
rial.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=
this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),
this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),
this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.
emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),
this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=
this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.
shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==
void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.
clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=
this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=
this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.
sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.
isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),
this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),
this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&
this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.
iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==
void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),
this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.
isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.
alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.
lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=
this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.
toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(
t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.
isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=
this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),
this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.
emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.
specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=
this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.
specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==
void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==
void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==
void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.
toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.
isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),
this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==
void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&
(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=
this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==bi&&(i.blending=
this.blending),this.side!==ui&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=
this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Mi&&(i.blendSrc=this.blendSrc),this.blendDst!==Ai&&
(i.blendDst=this.blendDst),this.blendEquation!==wi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=
this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=
this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==
0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==zi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.
depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.
stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ci&&(i.stencilFunc=this.stencilFunc),
this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),
this.stencilFail!==Yt&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Yt&&(i.stencilZFail=this.stencilZFail),this.
stencilZPass!==Yt&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==
void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==
0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),
this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),
this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=
!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=
!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===
!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),
this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=
this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&
(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(n){
const o=[];for(const r in n){const a=n[r];delete a.metadata,o.push(a)}return o}if(e){const n=s(t.textures),o=s(t.images);
n.length>0&&(i.textures=n),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.
name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=
t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.
blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),
this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=
t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.
stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;
const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let n=0;n!==s;++n)i[n]=e[n].clone()}
return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,
this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,
this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,
this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,
this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(
t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class is extends Ys{constructor(t){
super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ft(16777215),this.map=null,this.lightMap=
null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=
null,this.envMapRotation=new de,this.combine=Ms,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=
1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),
this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.
aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,
this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=
t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,
this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Y=new _,_e=new pt;let Hs=0;class gt{constructor(t,e,i=!1){
if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=
!0,Object.defineProperty(this,"id",{value:Hs++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/
e:0,this.normalized=i,this.usage=Ei,this.updateRanges=[],this.gpuType=_s,this.version=0}onUploadCallback(){}set needsUpdate(t){
t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){
this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,
this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,
i*=e.itemSize;for(let s=0,n=this.itemSize;s<n;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.
set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)_e.fromBufferAttribute(this,e),_e.applyMatrix3(
t),this.setXY(e,_e.x,_e.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Y.fromBufferAttribute(this,e),Y.applyMatrix3(
t),this.setXYZ(e,Y.x,Y.y,Y.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Y.fromBufferAttribute(this,e),
Y.applyMatrix4(t),this.setXYZ(e,Y.x,Y.y,Y.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Y.fromBufferAttribute(
this,e),Y.applyNormalMatrix(t),this.setXYZ(e,Y.x,Y.y,Y.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)
Y.fromBufferAttribute(this,e),Y.transformDirection(t),this.setXYZ(e,Y.x,Y.y,Y.z);return this}set(t,e=0){return this.array.
set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=ie(i,this.array)),i}setComponent(t,e,i){
return this.normalized&&(i=tt(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];
return this.normalized&&(e=ie(e,this.array)),e}setX(t,e){return this.normalized&&(e=tt(e,this.array)),this.array[t*this.
itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ie(e,this.array)),e}setY(t,e){return this.
normalized&&(e=tt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.
normalized&&(e=ie(e,this.array)),e}setZ(t,e){return this.normalized&&(e=tt(e,this.array)),this.array[t*this.itemSize+2]=
e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ie(e,this.array)),e}setW(t,e){return this.
normalized&&(e=tt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&
(e=tt(e,this.array),i=tt(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,
this.normalized&&(e=tt(e,this.array),i=tt(i,this.array),s=tt(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+
2]=s,this}setXYZW(t,e,i,s,n){return t*=this.itemSize,this.normalized&&(e=tt(e,this.array),i=tt(i,this.array),s=tt(s,this.
array),n=tt(n,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=n,this}onUpload(t){return this.
onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.
itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&
(t.name=this.name),this.usage!==Ei&&(t.usage=this.usage),t}}class Gs extends gt{constructor(t,e,i){super(new Uint16Array(
t),e,i)}}class js extends gt{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Xs extends gt{constructor(t,e,i){super(
new Float32Array(t),e,i)}}let Zs=0;const rt=new mt,hi=new Ct,te=new _,st=new ue,oe=new ue,j=new _;class Le extends ve{constructor(){
super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zs++}),this.uuid=he(),this.name="",this.type="Bu\
fferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=
!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){
return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ts(t)?js:Gs)(t,1):this.index=t,this}setIndirect(t,e=0){
return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){
return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==
void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){
this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(
t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const n=new Dt().getNormalMatrix(t);i.applyNormalMatrix(
n),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==
null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return rt.
makeRotationFromQuaternion(t),this.applyMatrix4(rt),this}rotateX(t){return rt.makeRotationX(t),this.applyMatrix4(rt),this}rotateY(t){
return rt.makeRotationY(t),this.applyMatrix4(rt),this}rotateZ(t){return rt.makeRotationZ(t),this.applyMatrix4(rt),this}translate(t,e,i){
return rt.makeTranslation(t,e,i),this.applyMatrix4(rt),this}scale(t,e,i){return rt.makeScale(t,e,i),this.applyMatrix4(rt),
this}lookAt(t){return hi.lookAt(t),hi.updateMatrix(),this.applyMatrix4(hi.matrix),this}center(){return this.computeBoundingBox(),
this.boundingBox.getCenter(te).negate(),this.translate(te.x,te.y,te.z),this}setFromPoints(t){const e=this.getAttribute("\
position");if(e===void 0){const i=[];for(let s=0,n=t.length;s<n;s++){const o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute(
"position",new Xs(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const n=t[s];e.setXYZ(s,n.x,n.y,n.z||
0)}t.length>e.count&&K("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),
e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ue);const t=this.attributes.
position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ut("BufferGeometry.computeBoundingBox(): GLBufferA\
ttribute requires a manual bounding box.",this),this.boundingBox.set(new _(-1/0,-1/0,-1/0),new _(1/0,1/0,1/0));return}if(t!==
void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const n=e[i];st.setFromBufferAttribute(
n),this.morphTargetsRelative?(j.addVectors(this.boundingBox.min,st.min),this.boundingBox.expandByPoint(j),j.addVectors(this.
boundingBox.max,st.max),this.boundingBox.expandByPoint(j)):(this.boundingBox.expandByPoint(st.min),this.boundingBox.expandByPoint(
st.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.
min.z))&&Ut('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely t\
o have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fi);const t=this.
attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ut("BufferGeometry.computeBoundingSpher\
e(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new _,1/0);return}if(t){const i=this.
boundingSphere.center;if(st.setFromBufferAttribute(t),e)for(let n=0,o=e.length;n<o;n++){const r=e[n];oe.setFromBufferAttribute(
r),this.morphTargetsRelative?(j.addVectors(st.min,oe.min),st.expandByPoint(j),j.addVectors(st.max,oe.max),st.expandByPoint(
j)):(st.expandByPoint(oe.min),st.expandByPoint(oe.max))}st.getCenter(i);let s=0;for(let n=0,o=t.count;n<o;n++)j.fromBufferAttribute(
t,n),s=Math.max(s,i.distanceToSquared(j));if(e)for(let n=0,o=e.length;n<o;n++){const r=e[n],a=this.morphTargetsRelative;
for(let h=0,c=r.count;h<c;h++)j.fromBufferAttribute(r,h),a&&(te.fromBufferAttribute(t,h),j.add(te)),s=Math.max(s,i.distanceToSquared(
j))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ut('BufferGeometry.computeBoundingSphere(\
): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.
index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Ut("BufferGeometry: .compute\
Tangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,n=e.
uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new gt(new Float32Array(4*i.count),4));const o=this.getAttribute(
"tangent"),r=[],a=[];for(let M=0;M<i.count;M++)r[M]=new _,a[M]=new _;const h=new _,c=new _,l=new _,d=new pt,f=new pt,m=new pt,
x=new _,w=new _;function b(M,T,I){h.fromBufferAttribute(i,M),c.fromBufferAttribute(i,T),l.fromBufferAttribute(i,I),d.fromBufferAttribute(
n,M),f.fromBufferAttribute(n,T),m.fromBufferAttribute(n,I),c.sub(h),l.sub(h),f.sub(d),m.sub(d);const F=1/(f.x*m.y-m.x*f.
y);isFinite(F)&&(x.copy(c).multiplyScalar(m.y).addScaledVector(l,-f.y).multiplyScalar(F),w.copy(l).multiplyScalar(f.x).addScaledVector(
c,-m.x).multiplyScalar(F),r[M].add(x),r[T].add(x),r[I].add(x),a[M].add(w),a[T].add(w),a[I].add(w))}let p=this.groups;p.length===
0&&(p=[{start:0,count:t.count}]);for(let M=0,T=p.length;M<T;++M){const I=p[M],F=I.start,C=I.count;for(let E=F,k=F+C;E<k;E+=
3)b(t.getX(E+0),t.getX(E+1),t.getX(E+2))}const y=new _,g=new _,A=new _,z=new _;function S(M){A.fromBufferAttribute(s,M),
z.copy(A);const T=r[M];y.copy(T),y.sub(A.multiplyScalar(A.dot(T))).normalize(),g.crossVectors(z,T);const F=g.dot(a[M])<0?
-1:1;o.setXYZW(M,y.x,y.y,y.z,F)}for(let M=0,T=p.length;M<T;++M){const I=p[M],F=I.start,C=I.count;for(let E=F,k=F+C;E<k;E+=
3)S(t.getX(E+0)),S(t.getX(E+1)),S(t.getX(E+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");
if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new gt(new Float32Array(e.count*3),3),this.setAttribute(
"normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new _,n=new _,o=new _,r=new _,a=new _,h=new _,c=new _,
l=new _;if(t)for(let d=0,f=t.count;d<f;d+=3){const m=t.getX(d+0),x=t.getX(d+1),w=t.getX(d+2);s.fromBufferAttribute(e,m),
n.fromBufferAttribute(e,x),o.fromBufferAttribute(e,w),c.subVectors(o,n),l.subVectors(s,n),c.cross(l),r.fromBufferAttribute(
i,m),a.fromBufferAttribute(i,x),h.fromBufferAttribute(i,w),r.add(c),a.add(c),h.add(c),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(x,
a.x,a.y,a.z),i.setXYZ(w,h.x,h.y,h.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),n.fromBufferAttribute(
e,d+1),o.fromBufferAttribute(e,d+2),c.subVectors(o,n),l.subVectors(s,n),c.cross(l),i.setXYZ(d+0,c.x,c.y,c.z),i.setXYZ(d+
1,c.x,c.y,c.z),i.setXYZ(d+2,c.x,c.y,c.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.
normal;for(let e=0,i=t.count;e<i;e++)j.fromBufferAttribute(t,e),j.normalize(),t.setXYZ(e,j.x,j.y,j.z)}toNonIndexed(){function t(r,a){
const h=r.array,c=r.itemSize,l=r.normalized,d=new h.constructor(a.length*c);let f=0,m=0;for(let x=0,w=a.length;x<w;x++){
r.isInterleavedBufferAttribute?f=a[x]*r.data.stride+r.offset:f=a[x]*c;for(let b=0;b<c;b++)d[m++]=h[f++]}return new gt(d,
c,l)}if(this.index===null)return K("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Le,
i=this.index.array,s=this.attributes;for(const r in s){const a=s[r],h=t(a,i);e.setAttribute(r,h)}const n=this.morphAttributes;
for(const r in n){const a=[],h=n[r];for(let c=0,l=h.length;c<l;c++){const d=h[c],f=t(d,i);a.push(f)}e.morphAttributes[r]=
a}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,a=o.length;r<a;r++){const h=o[r];e.addGroup(
h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"Buffe\
rGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>
0&&(t.userData=this.userData),this.parameters!==void 0){const a=this.parameters;for(const h in a)a[h]!==void 0&&(t[h]=a[h]);
return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.
slice.call(e.array)});const i=this.attributes;for(const a in i){const h=i[a];t.data.attributes[a]=h.toJSON(t.data)}const s={};
let n=!1;for(const a in this.morphAttributes){const h=this.morphAttributes[a],c=[];for(let l=0,d=h.length;l<d;l++){const f=h[l];
c.push(f.toJSON(t.data))}c.length>0&&(s[a]=c,n=!0)}n&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);
const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&
(t.data.boundingSphere=r.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes=
{},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.
index;i!==null&&this.setIndex(i.clone());const s=t.attributes;for(const h in s){const c=s[h];this.setAttribute(h,c.clone(
e))}const n=t.morphAttributes;for(const h in n){const c=[],l=n[h];for(let d=0,f=l.length;d<f;d++)c.push(l[d].clone(e));this.
morphAttributes[h]=c}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let h=0,c=o.length;h<c;h++){const l=o[h];
this.addGroup(l.start,l.count,l.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const a=t.boundingSphere;
return a!==null&&(this.boundingSphere=a.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.
count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Hi=new mt,Lt=new Ds,Fe=new fi,
Gi=new _,Te=new _,Ce=new _,Ee=new _,ci=new _,Ie=new _,ji=new _,ke=new _;class Js extends Ct{constructor(t=new Le,e=new is){
super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=
void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=
t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),
this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){
const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=
[],this.morphTargetDictionary={};for(let n=0,o=s.length;n<o;n++){const r=s[n].name||String(n);this.morphTargetInfluences.
push(0),this.morphTargetDictionary[r]=n}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,n=i.morphAttributes.
position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(n&&r){Ie.set(0,0,0);for(let a=0,
h=n.length;a<h;a++){const c=r[a],l=n[a];c!==0&&(ci.fromBufferAttribute(l,t),o?Ie.addScaledVector(ci,c):Ie.addScaledVector(
ci.sub(e),c))}e.add(Ie)}return e}raycast(t,e){const i=this.geometry,s=this.material,n=this.matrixWorld;s!==void 0&&(i.boundingSphere===
null&&i.computeBoundingSphere(),Fe.copy(i.boundingSphere),Fe.applyMatrix4(n),Lt.copy(t.ray).recast(t.near),!(Fe.containsPoint(
Lt.origin)===!1&&(Lt.intersectSphere(Fe,Gi)===null||Lt.origin.distanceToSquared(Gi)>(t.far-t.near)**2))&&(Hi.copy(n).invert(),
Lt.copy(t.ray).applyMatrix4(Hi),!(i.boundingBox!==null&&Lt.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(
t,e,Lt)))}_computeIntersections(t,e,i){let s;const n=this.geometry,o=this.material,r=n.index,a=n.attributes.position,h=n.
attributes.uv,c=n.attributes.uv1,l=n.attributes.normal,d=n.groups,f=n.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,
x=d.length;m<x;m++){const w=d[m],b=o[w.materialIndex],p=Math.max(w.start,f.start),y=Math.min(r.count,Math.min(w.start+w.
count,f.start+f.count));for(let g=p,A=y;g<A;g+=3){const z=r.getX(g),S=r.getX(g+1),M=r.getX(g+2);s=Re(this,b,t,i,h,c,l,z,
S,M),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=w.materialIndex,e.push(s))}}else{const m=Math.max(0,f.start),x=Math.
min(r.count,f.start+f.count);for(let w=m,b=x;w<b;w+=3){const p=r.getX(w),y=r.getX(w+1),g=r.getX(w+2);s=Re(this,o,t,i,h,c,
l,p,y,g),s&&(s.faceIndex=Math.floor(w/3),e.push(s))}}else if(a!==void 0)if(Array.isArray(o))for(let m=0,x=d.length;m<x;m++){
const w=d[m],b=o[w.materialIndex],p=Math.max(w.start,f.start),y=Math.min(a.count,Math.min(w.start+w.count,f.start+f.count));
for(let g=p,A=y;g<A;g+=3){const z=g,S=g+1,M=g+2;s=Re(this,b,t,i,h,c,l,z,S,M),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=
w.materialIndex,e.push(s))}}else{const m=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let w=m,b=x;w<b;w+=
3){const p=w,y=w+1,g=w+2;s=Re(this,o,t,i,h,c,l,p,y,g),s&&(s.faceIndex=Math.floor(w/3),e.push(s))}}}}function $s(u,t,e,i,s,n,o,r){
let a;if(t.side===ws?a=i.intersectTriangle(o,n,s,!0,r):a=i.intersectTriangle(s,n,o,t.side===ui,r),a===null)return null;ke.
copy(r),ke.applyMatrix4(u.matrixWorld);const h=e.ray.origin.distanceTo(ke);return h<e.near||h>e.far?null:{distance:h,point:ke.
clone(),object:u}}function Re(u,t,e,i,s,n,o,r,a,h){u.getVertexPosition(r,Te),u.getVertexPosition(a,Ce),u.getVertexPosition(
h,Ee);const c=$s(u,t,e,i,Te,Ce,Ee,ji);if(c){const l=new _;dt.getBarycoord(ji,Te,Ce,Ee,l),s&&(c.uv=dt.getInterpolatedAttribute(
s,r,a,h,l,new pt)),n&&(c.uv1=dt.getInterpolatedAttribute(n,r,a,h,l,new pt)),o&&(c.normal=dt.getInterpolatedAttribute(o,r,
a,h,l,new _),c.normal.dot(i.direction)>0&&c.normal.multiplyScalar(-1));const d={a:r,b:a,c:h,normal:new _,materialIndex:0};
dt.getNormal(Te,Ce,Ee,d.normal),c.face=d,c.barycoord=l}return c}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(
new CustomEvent("register",{detail:{revision:Qi}}));typeof window<"u"&&(window.__THREE__?K("WARNING: Multiple instances \
of Three.js being imported."):window.__THREE__=Qi);class Qs extends Js{constructor(t,e,i=!1,s=!1,n=1e4){const o=new Le;super(
o,e),this.isMarchingCubes=!0;const r=this,a=new Float32Array(36),h=new Float32Array(36),c=new Float32Array(36);this.enableUvs=
i,this.enableColors=s,this.init=function(p){this.resolution=p,this.isolation=80,this.size=p,this.size2=this.size*this.size,
this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.
field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*
3),this.count=0;const y=n*3;this.positionArray=new Float32Array(y*3);const g=new gt(this.positionArray,3);g.setUsage(me),
o.setAttribute("position",g),this.normalArray=new Float32Array(y*3);const A=new gt(this.normalArray,3);if(A.setUsage(me),
o.setAttribute("normal",A),this.enableUvs){this.uvArray=new Float32Array(y*2);const z=new gt(this.uvArray,2);z.setUsage(
me),o.setAttribute("uv",z)}if(this.enableColors){this.colorArray=new Float32Array(y*3);const z=new gt(this.colorArray,3);
z.setUsage(me),o.setAttribute("color",z)}o.boundingSphere=new fi(new _,1)};function l(p,y,g){return p+(y-p)*g}function d(p,y,g,A,z,S,M,T,I,F){
const C=(g-M)/(T-M),E=r.normal_cache;a[y+0]=A+C*r.delta,a[y+1]=z,a[y+2]=S,h[y+0]=l(E[p+0],E[p+3],C),h[y+1]=l(E[p+1],E[p+
4],C),h[y+2]=l(E[p+2],E[p+5],C),c[y+0]=l(r.palette[I*3+0],r.palette[F*3+0],C),c[y+1]=l(r.palette[I*3+1],r.palette[F*3+1],
C),c[y+2]=l(r.palette[I*3+2],r.palette[F*3+2],C)}function f(p,y,g,A,z,S,M,T,I,F){const C=(g-M)/(T-M),E=r.normal_cache;a[y+
0]=A,a[y+1]=z+C*r.delta,a[y+2]=S;const k=p+r.yd*3;h[y+0]=l(E[p+0],E[k+0],C),h[y+1]=l(E[p+1],E[k+1],C),h[y+2]=l(E[p+2],E[k+
2],C),c[y+0]=l(r.palette[I*3+0],r.palette[F*3+0],C),c[y+1]=l(r.palette[I*3+1],r.palette[F*3+1],C),c[y+2]=l(r.palette[I*3+
2],r.palette[F*3+2],C)}function m(p,y,g,A,z,S,M,T,I,F){const C=(g-M)/(T-M),E=r.normal_cache;a[y+0]=A,a[y+1]=z,a[y+2]=S+C*
r.delta;const k=p+r.zd*3;h[y+0]=l(E[p+0],E[k+0],C),h[y+1]=l(E[p+1],E[k+1],C),h[y+2]=l(E[p+2],E[k+2],C),c[y+0]=l(r.palette[I*
3+0],r.palette[F*3+0],C),c[y+1]=l(r.palette[I*3+1],r.palette[F*3+1],C),c[y+2]=l(r.palette[I*3+2],r.palette[F*3+2],C)}function x(p){
const y=p*3;r.normal_cache[y]===0&&(r.normal_cache[y+0]=r.field[p-1]-r.field[p+1],r.normal_cache[y+1]=r.field[p-r.yd]-r.
field[p+r.yd],r.normal_cache[y+2]=r.field[p-r.zd]-r.field[p+r.zd])}function w(p,y,g,A,z){const S=A+1,M=A+r.yd,T=A+r.zd,I=S+
r.yd,F=S+r.zd,C=A+r.yd+r.zd,E=S+r.yd+r.zd;let k=0;const B=r.field[A],D=r.field[S],O=r.field[M],L=r.field[I],q=r.field[T],
H=r.field[F],P=r.field[C],X=r.field[E];B<z&&(k|=1),D<z&&(k|=2),O<z&&(k|=8),L<z&&(k|=4),q<z&&(k|=16),H<z&&(k|=32),P<z&&(k|=
128),X<z&&(k|=64);const U=Ks[k];if(U===0)return 0;const Z=r.delta,ot=p+Z,et=y+Z,v=g+Z;U&1&&(x(A),x(S),d(A*3,0,z,p,y,g,B,
D,A,S)),U&2&&(x(S),x(I),f(S*3,3,z,ot,y,g,D,L,S,I)),U&4&&(x(M),x(I),d(M*3,6,z,p,et,g,O,L,M,I)),U&8&&(x(A),x(M),f(A*3,9,z,
p,y,g,B,O,A,M)),U&16&&(x(T),x(F),d(T*3,12,z,p,y,v,q,H,T,F)),U&32&&(x(F),x(E),f(F*3,15,z,ot,y,v,H,X,F,E)),U&64&&(x(C),x(E),
d(C*3,18,z,p,et,v,P,X,C,E)),U&128&&(x(T),x(C),f(T*3,21,z,p,y,v,q,P,T,C)),U&256&&(x(A),x(T),m(A*3,24,z,p,y,g,B,q,A,T)),U&
512&&(x(S),x(F),m(S*3,27,z,ot,y,g,D,H,S,F)),U&1024&&(x(I),x(E),m(I*3,30,z,ot,et,g,L,X,I,E)),U&2048&&(x(M),x(C),m(M*3,33,
z,p,et,g,O,P,M,C)),k<<=4;let V,G,Et,qt=0,yt=0;for(;Oe[k+yt]!=-1;)V=k+yt,G=V+1,Et=V+2,b(a,h,c,3*Oe[V],3*Oe[G],3*Oe[Et]),yt+=
3,qt++;return qt}function b(p,y,g,A,z,S){const M=r.count*3;if(r.positionArray[M+0]=p[A],r.positionArray[M+1]=p[A+1],r.positionArray[M+
2]=p[A+2],r.positionArray[M+3]=p[z],r.positionArray[M+4]=p[z+1],r.positionArray[M+5]=p[z+2],r.positionArray[M+6]=p[S],r.
positionArray[M+7]=p[S+1],r.positionArray[M+8]=p[S+2],r.material.flatShading===!0){const T=(y[A+0]+y[z+0]+y[S+0])/3,I=(y[A+
1]+y[z+1]+y[S+1])/3,F=(y[A+2]+y[z+2]+y[S+2])/3;r.normalArray[M+0]=T,r.normalArray[M+1]=I,r.normalArray[M+2]=F,r.normalArray[M+
3]=T,r.normalArray[M+4]=I,r.normalArray[M+5]=F,r.normalArray[M+6]=T,r.normalArray[M+7]=I,r.normalArray[M+8]=F}else r.normalArray[M+
0]=y[A+0],r.normalArray[M+1]=y[A+1],r.normalArray[M+2]=y[A+2],r.normalArray[M+3]=y[z+0],r.normalArray[M+4]=y[z+1],r.normalArray[M+
5]=y[z+2],r.normalArray[M+6]=y[S+0],r.normalArray[M+7]=y[S+1],r.normalArray[M+8]=y[S+2];if(r.enableUvs){const T=r.count*
2;r.uvArray[T+0]=p[A+0],r.uvArray[T+1]=p[A+2],r.uvArray[T+2]=p[z+0],r.uvArray[T+3]=p[z+2],r.uvArray[T+4]=p[S+0],r.uvArray[T+
5]=p[S+2]}r.enableColors&&(r.colorArray[M+0]=g[A+0],r.colorArray[M+1]=g[A+1],r.colorArray[M+2]=g[A+2],r.colorArray[M+3]=
g[z+0],r.colorArray[M+4]=g[z+1],r.colorArray[M+5]=g[z+2],r.colorArray[M+6]=g[S+0],r.colorArray[M+7]=g[S+1],r.colorArray[M+
8]=g[S+2]),r.count+=3}this.addBall=function(p,y,g,A,z,S){const M=Math.sign(A);A=Math.abs(A);const T=S!=null;let I=new Ft(
p,y,g);if(T)try{I=S instanceof Ft?S:Array.isArray(S)?new Ft(Math.min(Math.abs(S[0]),1),Math.min(Math.abs(S[1]),1),Math.min(
Math.abs(S[2]),1)):new Ft(S)}catch{I=new Ft(p,y,g)}const F=this.size*Math.sqrt(A/z),C=g*this.size,E=y*this.size,k=p*this.
size;let B=Math.floor(C-F);B<1&&(B=1);let D=Math.floor(C+F);D>this.size-1&&(D=this.size-1);let O=Math.floor(E-F);O<1&&(O=
1);let L=Math.floor(E+F);L>this.size-1&&(L=this.size-1);let q=Math.floor(k-F);q<1&&(q=1);let H=Math.floor(k+F);H>this.size-
1&&(H=this.size-1);let P,X,U,Z,ot,et,v,V,G,Et,qt;for(U=B;U<D;U++)for(ot=this.size2*U,V=U/this.size-g,G=V*V,X=O;X<L;X++)for(Z=
ot+this.size*X,v=X/this.size-y,Et=v*v,P=q;P<H;P++)if(et=P/this.size-p,qt=A/(1e-6+et*et+Et+G)-z,qt>0){this.field[Z+P]+=qt*
M;const yt=Math.sqrt((P-k)*(P-k)+(X-E)*(X-E)+(U-C)*(U-C))/F,Pe=1-yt*yt*yt*(yt*(yt*6-15)+10);this.palette[(Z+P)*3+0]+=I.r*
Pe,this.palette[(Z+P)*3+1]+=I.g*Pe,this.palette[(Z+P)*3+2]+=I.b*Pe}},this.addPlaneX=function(p,y){const g=this.size,A=this.
yd,z=this.zd,S=this.field;let M,T,I,F,C,E,k,B=g*Math.sqrt(p/y);for(B>g&&(B=g),M=0;M<B;M++)if(E=M/g,F=E*E,C=p/(1e-4+F)-y,
C>0)for(T=0;T<g;T++)for(k=M+T*A,I=0;I<g;I++)S[z*I+k]+=C},this.addPlaneY=function(p,y){const g=this.size,A=this.yd,z=this.
zd,S=this.field;let M,T,I,F,C,E,k,B,D=g*Math.sqrt(p/y);for(D>g&&(D=g),T=0;T<D;T++)if(E=T/g,F=E*E,C=p/(1e-4+F)-y,C>0)for(k=
T*A,M=0;M<g;M++)for(B=k+M,I=0;I<g;I++)S[z*I+B]+=C},this.addPlaneZ=function(p,y){const g=this.size,A=this.yd,z=this.zd,S=this.
field;let M,T,I,F,C,E,k,B,D=g*Math.sqrt(p/y);for(D>g&&(D=g),I=0;I<D;I++)if(E=I/g,F=E*E,C=p/(1e-4+F)-y,C>0)for(k=z*I,T=0;T<
g;T++)for(B=k+T*A,M=0;M<g;M++)S[B+M]+=C},this.setCell=function(p,y,g,A){const z=this.size2*g+this.size*y+p;this.field[z]=
A},this.getCell=function(p,y,g){const A=this.size2*g+this.size*y+p;return this.field[A]},this.blur=function(p=1){const y=this.
field,g=y.slice(),A=this.size,z=this.size2;for(let S=0;S<A;S++)for(let M=0;M<A;M++)for(let T=0;T<A;T++){const I=z*T+A*M+
S;let F=g[I],C=1;for(let E=-1;E<=1;E+=2){const k=E+S;if(!(k<0||k>=A))for(let B=-1;B<=1;B+=2){const D=B+M;if(!(D<0||D>=A))
for(let O=-1;O<=1;O+=2){const L=O+T;if(L<0||L>=A)continue;const q=z*L+A*D+k,H=g[q];C++,F+=p*(H-F)/C}}}y[I]=F}},this.reset=
function(){for(let p=0;p<this.size3;p++)this.normal_cache[p*3]=0,this.field[p]=0,this.palette[p*3]=this.palette[p*3+1]=this.
palette[p*3+2]=0},this.update=function(){this.count=0;const p=this.size-2;for(let y=1;y<p;y++){const g=this.size2*y,A=(y-
this.halfsize)/this.halfsize;for(let z=1;z<p;z++){const S=g+this.size*z,M=(z-this.halfsize)/this.halfsize;for(let T=1;T<
p;T++){const I=(T-this.halfsize)/this.halfsize,F=S+T;w(I,M,A,F,this.isolation)}}}this.geometry.setDrawRange(0,this.count),
o.getAttribute("position").needsUpdate=!0,o.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(o.getAttribute("uv").
needsUpdate=!0),this.enableColors&&(o.getAttribute("color").needsUpdate=!0),this.count/3>n&&console.warn("THREE.Marching\
Cubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const Ks=new Int32Array(
[0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,
2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,
1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,
2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,
85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,
2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,
85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,
2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,
170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,
2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),
Oe=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,
-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,
8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,
8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,
-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,
-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,
-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,
-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,
-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,
-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,
-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,
-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,
-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,
-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,
-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,
-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,
-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,
1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,
6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,
7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,
4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,
-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,
-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,
-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,
6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,
0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,
10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,
8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,
3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,
-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,
7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,
0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,
-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,
-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,
-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,
6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,
-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,
-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,
4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,
5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,
11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,
2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,
8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,
7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,
11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,
3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,
6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,
-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,
1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,
8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,
-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,
9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,
-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,
2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,
3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,
10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,
11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,
4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,
-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,
7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,
-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,
-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,
2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,
10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),xt=320,tn=[.485,.456,.406],
en=[.229,.224,.225],ss=(u,t)=>new OffscreenCanvas(u,t),ae=u=>Object.assign(new Error(u),{code:"ERR_MESH_FOREGROUND"});function Ue(u){
const{width:t,height:e,data:i}=u??{};if(!Number.isSafeInteger(t)||!Number.isSafeInteger(e)||t<1||e<1||t*e>4096*4096||!(i instanceof
Uint8Array||i instanceof Uint8ClampedArray)||i.length!==t*e*4)throw new Error("TripoSR needs bounded RGBA pixels");return u}
function pi(u){const{width:t,height:e,data:i}=Ue(u);let s=0,n=0,o=0;for(let r=0;r<e;r++)for(let a=0;a<t;a++){const h=i[(r*
t+a)*4+3]<=16;h&&s++,(a===0||r===0||a===t-1||r===e-1)&&(n++,h&&o++)}return s>=Math.max(1,t*e*.01)&&o>=n*.25}function sn(u){
if(!pi(u))throw ae("This stored TripoSR package needs a transparent cutout. Load the current TripoSR package to remove i\
mage backgrounds automatically.");return u}function nn(u){const t=xt**2;if(!(u instanceof Uint8Array||u instanceof Uint8ClampedArray)||
u.length!==t*4)throw new Error("Foreground input must be 320×320 RGBA");let e=1e-6;for(let s=0;s<u.length;s+=4)e=Math.max(
e,u[s],u[s+1],u[s+2]);const i=new Float32Array(t*3);for(let s=0;s<t;s++)for(let n=0;n<3;n++)i[n*t+s]=(u[s*4+n]/e-tn[n])/
en[n];return i}function rn(u,{canvas:t=ss}={}){const{width:e,height:i,data:s}=Ue(u),n=new Uint8ClampedArray(s);for(let h=3;h<
n.length;h+=4)n[h]=255;const o=t(e,i),r=t(xt,xt);o.getContext("2d").putImageData(new ImageData(n,e,i),0,0);const a=r.getContext(
"2d",{willReadFrequently:!0});return a.imageSmoothingEnabled=!0,a.imageSmoothingQuality="high",a.drawImage(o,0,0,xt,xt),
nn(a.getImageData(0,0,xt,xt).data)}function on(u,t,{canvas:e=ss}={}){const{width:i,height:s,data:n}=Ue(u),o=xt;if(!(t instanceof
Float32Array)||t.length!==o*o)throw ae("Invalid foreground model mask");let r=1/0,a=-1/0;for(const b of t){if(!Number.isFinite(
b)||b<-1e-4||b>1.0001)throw ae("Invalid foreground model values");r=Math.min(r,b),a=Math.max(a,b)}if(a-r<1e-6)throw ae("\
The foreground model could not isolate an object. Try one clearly visible object or a transparent cutout.");const h=new Uint8ClampedArray(
o*o*4);for(let b=0;b<t.length;b++){const p=Math.floor(255*(t[b]-r)/(a-r));h[b*4]=h[b*4+1]=h[b*4+2]=p,h[b*4+3]=255}const c=e(
o,o),l=e(i,s);c.getContext("2d").putImageData(new ImageData(h,o,o),0,0);const d=l.getContext("2d",{willReadFrequently:!0});
d.imageSmoothingEnabled=!0,d.imageSmoothingQuality="high",d.drawImage(c,0,0,i,s);const f=d.getImageData(0,0,i,s).data,m=new Uint8Array(
n);let x=0;for(let b=0;b<i*s;b++){const p=Math.round(n[b*4+3]*f[b*4]/255);m[b*4+3]=p,p>=128&&x++}const w={width:i,height:s,
channels:4,data:m};if(!x||!pi(w))throw ae("The foreground model could not isolate an object. Try one clearly visible obj\
ect with space around it, or a transparent cutout.");return w}const W=Object.freeze({imageSize:512,foregroundRatio:.85,radius:.87,
channels:40,planeSize:64,threshold:25,resolution:64,queryBatch:32768,maxVertices:1e5,maxTriangles:15e4});function Wt(u,t){
for(const e of u)if(!Number.isFinite(e))throw new Error(`${t} contains non-finite values`);return u}function an(u){const{
width:t,height:e,data:i}=Ue(u);let s=t,n=e,o=-1,r=-1;for(let a=0;a<e;a++)for(let h=0;h<t;h++)i[(a*t+h)*4+3]&&(s=Math.min(
s,h),n=Math.min(n,a),o=Math.max(o,h),r=Math.max(r,a));if(o<s)throw new Error("The image has no visible foreground");return{
x:s,y:n,width:o-s+1,height:r-n+1}}function hn(u){const t=W.imageSize**2;if(!(u instanceof Uint8Array||u instanceof Uint8ClampedArray)||
u.length!==t*4)throw new Error("TripoSR input must be 512×512 RGBA");const e=new Float32Array(t*3);for(let i=0;i<t;i++){
const s=u[i*4+3]/255;for(let n=0;n<3;n++)e[n*t+i]=u[i*4+n]/255*s+.5*(1-s)}return e}function cn(u,{canvas:t=(e,i)=>new OffscreenCanvas(
e,i)}={}){u=sn(u);const e=an(u),i=W.imageSize,s=t(u.width,u.height),n=t(i,i);s.getContext("2d").putImageData(new ImageData(
new Uint8ClampedArray(u.data),u.width,u.height),0,0);const o=i*W.foregroundRatio/Math.max(e.width,e.height),r=e.width*o,
a=e.height*o,h=n.getContext("2d",{willReadFrequently:!0});return h.imageSmoothingEnabled=!0,h.imageSmoothingQuality="hig\
h",h.drawImage(s,e.x,e.y,e.width,e.height,(i-r)/2,(i-a)/2,r,a),hn(h.getImageData(0,0,i,i).data)}function ln(u,t,e){if(!Number.
isInteger(u)||u<4||u>128||!Number.isSafeInteger(t)||!Number.isSafeInteger(e)||t<0||e<1||e>W.queryBatch||t+e>u**3)throw new Error(
"Invalid TripoSR query grid");const i=new Float32Array(e*3),s=2*W.radius/(u-1);for(let n=0;n<e;n++){const o=t+n;i[n*3]=o%
u*s-W.radius,i[n*3+1]=Math.floor(o/u)%u*s-W.radius,i[n*3+2]=Math.floor(o/(u*u))*s-W.radius}return i}function un(u,t){if(!(u instanceof
Float32Array)||u.length!==7680*64||!(t instanceof Float32Array)||t.length%3||t.length/3>W.queryBatch)throw new Error("In\
valid TripoSR sample tensors");Wt(t,"Query points");const e=new Float32Array(t.length/3*120);for(let i=0;i<t.length/3;i++){
const s=t[i*3]/W.radius,n=t[i*3+1]/W.radius,o=t[i*3+2]/W.radius;for(let r=0;r<3;r++){const a=((r===2?n:s)+1)*32-.5,h=((r===
0?n:o)+1)*32-.5,c=Math.floor(a),l=Math.floor(h),d=a-c,f=h-l;for(let m=0;m<40;m++){let x=0;for(let w=0;w<2;w++)for(let b=0;b<
2;b++){const p=c+b,y=l+w;p>=0&&p<64&&y>=0&&y<64&&(x+=u[(r*40+m)*4096+y*64+p]*(b?d:1-d)*(w?f:1-f))}e[i*120+r*40+m]=x}}}return Wt(
e,"Triplane features")}function dn(u,t=W.resolution){if(!(u instanceof Float32Array)||u.length!==t**3||!Number.isInteger(
t)||t<4||t>128)throw new Error("Invalid density field");Wt(u,"Density");const e=new is,i=new Qs(t,e,!1,!1,Math.floor(W.maxVertices/
3)+1);try{i.field.set(u),i.isolation=W.threshold,i.update();const s=i.count;if(!s)throw new Error("No solid object was f\
ound; use one object on a plain or transparent background");if(s>W.maxVertices)throw new Error("Generated mesh exceeds i\
ts vertex budget");const n=new Float32Array(i.positionArray.slice(0,s*3)),o=new Float32Array(i.normalArray.slice(0,s*3)),
r=Uint32Array.from({length:s},(a,h)=>h);for(let a=0;a<n.length;a++)n[a]=((n[a]+1)*t/(t-1)-1)*W.radius;for(let a=0;a<o.length;a+=
3){const h=Math.hypot(o[a],o[a+1],o[a+2]);if(!Number.isFinite(h)||h<=1e-12)throw new Error("Generated surface has an inv\
alid normal");o[a]/=h,o[a+1]/=h,o[a+2]/=h}return{positions:n,normals:o,indices:r}}finally{i.geometry.dispose(),e.dispose()}}
function fn(u){for(const t of["positions","normals"]){const e=u[t];for(let i=0;i<e.length;i+=3){const s=e[i+1];e[i+1]=e[i+
2],e[i+2]=-s}}return u}function pn(u){return Wt(u,"Vertex colors"),Float32Array.from(u,t=>{const e=Math.max(0,Math.min(1,
t));return e<=.04045?e/12.92:((e+.055)/1.055)**2.4})}const Xi=()=>new Promise(u=>setTimeout(u,0)),De=4*1024**2,Be=u=>Object.
values(u??{}).forEach(t=>t.dispose?.());async function mn(u,t,e,i){if(!t||t.size<1||t.size>512*1024**2)throw new Error("\
3D model file exceeds its loader budget");const s=new Uint8Array(t.size);for(let n=0;n<s.length;n+=De)Q(e),s.set(await u.
read(t.path,n,Math.min(De,s.length-n),{signal:e}),n),i?.({type:"model-load",stage:t.path,loaded:Math.min(n+De,s.length),
total:s.length});return s}function yn(u,t){const e=u.createCommandEncoder.bind(u),i=u.queue.submit.bind(u.queue);u.createCommandEncoder=
(...s)=>{const n=e(...s),o=n.beginComputePass.bind(n);return n.beginComputePass=(...r)=>{const a=o(...r);for(const h of[
"dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const c=a[h].bind(a);a[h]=(...l)=>{const d=c(...l);return t.gpuDispatches++,
d}}return a},n},u.queue.submit=(...s)=>{const n=i(...s);return t.gpuSubmissions++,n}}async function xn({manifest:u,runtimeAssets:t,
artifactPort:e,signal:i,onProgress:s,gpu:n=globalThis.navigator?.gpu,loadOrt:o=()=>import("./ort.webgpu.bundle.min-6kjqLWiL.js"),
createReader:r=ns,prepareImage:a=cn,readModelFile:h=mn,prepareForeground:c=rn,applyMask:l=on}){const{manifest:d}=di(u),f={
gpuDispatches:0,gpuSubmissions:0,generatedRequests:0};let m,x,w,b,p,y,g=!1,A=!1,z=!1;const S=F=>{A||(z=!0,f.gpuFailure??=
String(F?.message??F??"GPU device lost").slice(0,300))},M=F=>S(F.error);async function T(F,C){if(z)throw new Error(`Mode\
l session lost: 3D ${f.gpuFailure}`);const E=["validation","out-of-memory","internal"];for(const O of E)m.pushErrorScope(
O);let k,B;try{k=await C(),await m.queue.onSubmittedWorkDone()}catch(O){B=O}const D=[];for(const O of E.reverse())try{const L=await m.
popErrorScope();L&&D.push({filter:O,error:L})}catch(L){D.push({filter:O,error:L})}if(D.length||z){const O=D.find(q=>q.filter===
"out-of-memory")?.error??D[0]?.error??f.gpuFailure;S(O),Be(k);const L=new Error(`Model session lost: 3D ${F}: ${f.gpuFailure}`,
{cause:O});throw L.code="ERR_MESH_GPU",L}if(B){S(B);const O=new Error(`Model session lost: 3D ${F}: ${f.gpuFailure}`,{cause:B});
throw O.code="ERR_MESH_GPU",O}return k}async function I(){if(A)return;A=!0,x?.close(),x=null;let F;for(const C of[b,p,y])
try{await C?.release()}catch(E){F??=E}if(b=p=y=null,m?.removeEventListener("uncapturederror",M),m?.destroy(),F)throw z=!0,
f.gpuFailure??=String(F.message??F),F}try{Q(i);const F=await n?.requestAdapter({powerPreference:"high-performance"});if(!F||
F.isFallbackAdapter||F.info?.isFallbackAdapter)throw new Error("3D generation requires hardware WebGPU");if(m=await F.requestDevice(
{requiredLimits:{maxBufferSize:F.limits.maxBufferSize,maxStorageBufferBindingSize:F.limits.maxStorageBufferBindingSize}}),
f.adapter={vendor:F.info?.vendor??"",architecture:F.info?.architecture??"",isFallbackAdapter:!1},f.runtimeFeatures=[...m.
features],m.addEventListener("uncapturederror",M),m.lost.then(S,S),yn(m,f),w=await o(),w.env.versions.web!==gs)throw new Error(
"Unexpected 3D ORT runtime version");w.env.wasm.proxy=!1,w.env.wasm.numThreads=1,w.env.wasm.wasmPaths=t,x=r(e,{manifest:d,
signal:i,maxReadBytes:De,maxReads:1,maxQueuedReads:2,readTimeoutMs:6e4});const C=O=>h(x,d.files.find(L=>L.path===O),i,s),
E={executionProviders:[{name:"webgpu",device:m}],enableMemPattern:!1,enableCpuMemArena:!1,extra:{session:{disable_prepacking:"\
1"}}};let k=await C("triplane_q8.onnx"),B=await C("triplane_q8.onnx.data");await T("encoder load",async()=>{b=await w.InferenceSession.
create(k,{...E,externalData:[{path:"triplane_q8.onnx.data",data:B}]})}),k=B=null,Q(i);const D=await C("decoder.onnx");if(await T(
"decoder load",async()=>{p=await w.InferenceSession.create(D,E)}),Q(i),d.model.backgroundRemoval==="u2netp"){const O=await C(
"u2netp.onnx");await T("foreground load",async()=>{y=await w.InferenceSession.create(O,E)})}if(f.artifactReads=x.getStats(),
x.close(),x=null,Q(i),b.inputNames.join()!=="image"||b.outputNames.join()!=="triplane"||p.inputNames.join()!=="features"||
p.outputNames.join()!=="density,color"||y&&(y.inputNames.join()!=="input.1"||y.outputNames.join()!=="1959,1960,1961,1962\
,1963,1964,1965"))throw new Error("3D graph interfaces differ from the pinned pipeline")}catch(F){try{await I()}catch{}throw F}
return{get lost(){return z},getEvidence(){return structuredClone(f)},dispose:I,async generate(F,{signal:C,onProgress:E}={}){
if(A)throw new Error("3D model is unloaded");if(g)throw new Error("3D model is already generating");if(z)throw new Error(
`Model session lost: 3D ${f.gpuFailure}`);const k=$i(F,d);g=!0;const B=f.gpuDispatches,D=f.gpuSubmissions;try{Q(C),E?.({
type:"mesh-generation",stage:"image",loaded:0,total:1});let O=k.image;if(y&&!pi(O)){const v=new w.Tensor("float32",c(O),
[1,3,xt,xt]);let V;try{V=await T("foreground separation",()=>y.run({"input.1":v})),Q(C);const G=V[1959];if(G?.type!=="fl\
oat32"||G.dims.join()!=="1,1,320,320")throw new Error("Unexpected foreground model output");O=l(O,G.data)}finally{v.dispose(),
Be(V)}f.foregroundRequests=(f.foregroundRequests??0)+1}Q(C);const L=new w.Tensor("float32",a(O),[1,3,512,512]);let q,H;try{
q=await T("image encoding",()=>b.run({image:L}));const v=q.triplane;if(v?.type!=="float32"||v.dims.join()!=="1,3,40,64,6\
4")throw new Error("Unexpected TripoSR encoder output");H=Wt(new Float32Array(v.data),"Triplane")}finally{L.dispose(),Be(
q)}Q(C);const P=async v=>{Q(C);const V=new w.Tensor("float32",un(H,v),[v.length/3,120]);let G;try{G=await T("field decod\
ing",()=>p.run({features:V}));const Et=v.length/3;if(G.density?.type!=="float32"||G.color?.type!=="float32"||G.density.data.
length!==Et||G.color.data.length!==Et*3)throw new Error("Unexpected TripoSR decoder output");return{density:Wt(new Float32Array(
G.density.data),"Density"),color:Wt(new Float32Array(G.color.data),"Vertex colors")}}finally{V.dispose(),Be(G)}},X=W.resolution**
3,U=new Float32Array(X);for(let v=0;v<X;v+=W.queryBatch){const V=Math.min(W.queryBatch,X-v);U.set((await P(ln(W.resolution,
v,V))).density,v),E?.({type:"mesh-generation",stage:"shape",loaded:v+V,total:X}),await Xi()}Q(C);const Z=dn(U),ot=Z.positions.
length/3;Z.colors=new Float32Array(Z.positions.length);for(let v=0;v<ot;v+=W.queryBatch){const V=Math.min(ot,v+W.queryBatch);
Z.colors.set(pn((await P(Z.positions.subarray(v*3,V*3))).color),v*3),E?.({type:"mesh-generation",stage:"color",loaded:V,
total:ot}),await Xi()}if(Q(C),f.gpuDispatches<=B)throw S(new Error("3D execution did not dispatch work on the admitted G\
PU")),new Error(`Model session lost: ${f.gpuFailure}`);const et=await ps(fn(Z));return Q(C),f.generatedRequests++,f.lastMesh=
{vertexCount:et.vertexCount,triangleCount:et.triangleCount,byteLength:et.byteLength},E?.({type:"mesh-generation",stage:"\
done",loaded:1,total:1}),{text:"",mesh:et,gpuDispatches:f.gpuDispatches-B,gpuSubmissions:f.gpuSubmissions-D}}finally{g=!1}}}}
function gn(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("3D generation\
 requires a ComputeManager-owned worker")}function bn({createEngine:u=xn,assertWorker:t=gn,baseUrl:e=globalThis.location?.
href}={}){const i=new Map,s=n=>({sessionId:n.sessionId,manifestCid:n.manifestCid,status:n.engine?.lost?"lost":n.status,workerId:n.
workerId,...n.engine?.getEvidence()});return async function(o,r={}){if(t(),mi(o?.sessionId),Q(r.signal),o.command==="loa\
d"){if(i.size)throw new Error("Unload the resident 3D model first");const{manifest:c}=di(o.manifest),l=bs(o.runtimeAssets,
e),d={sessionId:o.sessionId,manifestCid:o.manifestCid,manifest:c,status:"loading",workerId:r.workerId,engine:null};i.set(
o.sessionId,d);try{return d.engine=await u({manifest:c,runtimeAssets:l,artifactPort:o.artifactPort,signal:r.signal,onProgress:r.
emitProgress}),Q(r.signal),d.status="ready",s(d)}catch(f){try{await d.engine?.dispose(),i.delete(o.sessionId)}catch(m){throw d.
status="lost",new AggregateError([f,m],"Model session lost: 3D cleanup failed")}throw f}}const a=i.get(o.sessionId);if(!a)
throw new Error("3D model session is not loaded");if(o.command==="status")return s(a);if(o.command==="unload")return a.status=
"unloading",await a.engine.dispose(),i.delete(o.sessionId),{sessionId:o.sessionId,status:"unloaded"};if(o.command!=="gen\
erate")throw new Error("Unknown 3D model command");if(mi(o.requestId),a.status!=="ready"||a.engine.lost)throw new Error(
"Model session lost: 3D model is not ready");const h=$i(o,a.manifest);a.status="generating";try{const c=await a.engine.generate(
h,{signal:r.signal,onProgress:r.emitProgress});return Q(r.signal),{...c,sessionId:o.sessionId,requestId:o.requestId,workerId:a.
workerId}}catch(c){throw(c instanceof WebAssembly.RuntimeError||/Model session lost/.test(c?.message??""))&&(a.status="l\
ost"),c}finally{a.status!=="lost"&&(a.status=a.engine.lost?"lost":"ready")}}}const _n=bn();export{bn as createMeshTaskHandler,_n as handleModelTask};
