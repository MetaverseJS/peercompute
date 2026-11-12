import{b as de,s as le}from"./sha2-Bpg-DeHG.js";import"./ArtifactManifest-D8JibHR_.js";const G=Object.freeze({count:4,dimension:2048,pixels:8*1024**2,byteLength:8*1024**2}),h=e=>{throw new Error(`Invalid generated mesh texture: ${e}`)},ue=[137,80,78,71,13,10,26,10];function Q(e,a){return(!Number.isSafeInteger(e)||!Number.isSafeInteger(a)||e<1||a<1||e>G.dimension||a>G.dimension)&&h("dimensions"),{width:e,height:a,pixels:e*a}}function fe(e,a,i){let c=4294967295;for(let d=a;d<i;d++){c^=e[d];for(let n=0;n<8;n++)c=c>>>1^3988292384&-(c&1)}return(c^4294967295)>>>0}function he(e,a){ue.every((b,S)=>e[S]===b)||h("PNG signature");let i=8,c,d=!1,n=!1,l=!1;for(;i+12<=e.length;){const b=a.getUint32(i),S=i+12+b;S>e.length&&h("PNG chunk range");const p=String.fromCharCode(...e.subarray(i+4,i+8));if(a.getUint32(S-4)!==fe(e,i+4,S-4)&&h("PNG chunk checksum"),["IHDR","IDAT","IEND","PLTE","tRNS","sRGB","gAMA","cHRM","pHYs"].includes(p)||h("PNG chunk type"),i===8&&p!=="IHDR"&&h("PNG header order"),p==="IHDR")(c||b!==13||e[i+16]!==8||![0,2,3,4,6].includes(e[i+17])||e[i+18]!==0||e[i+19]!==0||e[i+20]!==0)&&h("PNG header"),c=Q(a.getUint32(i+8),a.getUint32(i+12)),c.colorType=e[i+17];else if(p==="PLTE")(d||l||!b||b>768||b%3)&&h("PNG palette"),l=!0;else if(p==="IDAT")(n||c.colorType===3&&!l)&&h("PNG image order"),d=!0;else{if(p==="IEND")return(b||!d||S!==e.length)&&h("PNG end"),Q(c.width,c.height);{d&&(n=!0);const N={sRGB:1,gAMA:4,cHRM:32,pHYs:9}[p];(N!==void 0?b!==N:b>256)&&h("PNG metadata length")}}i=S}h("PNG truncated")}function be(e,a){(e[0]!==255||e[1]!==216)&&h("JPEG signature");let i=2,c,d=!1,n=!1;for(;i<e.length;){if(n)for(;i<e.length&&e[i]!==255;)i++;for(e[i++]!==255&&h("JPEG marker");e[i]===255;)i++;const l=e[i++];if(n&&(l===0||l>=208&&l<=215))continue;if(n=!1,l===217)return(!c||!d||i!==e.length)&&h("JPEG end"),c;(l===void 0||l===0||l===216||l===1||l>=208&&l<=215||i+2>e.length)&&h("JPEG marker");const b=a.getUint16(i),S=i+b;if((b<2||S>e.length)&&h("JPEG segment range"),[192,193,194].includes(l)){(c||d||b<11||e[i+2]!==8)&&h("JPEG frame");const p=e[i+7];(![1,3].includes(p)||b!==8+3*p)&&h("JPEG components"),c=Q(a.getUint16(i+5),a.getUint16(i+3))}else l>=192&&l<=207&&![196].includes(l)&&h("JPEG frame type");l===218?((!c||b<6||b!==6+2*e[i+2])&&h("JPEG scan"),d=!0,n=!0):![192,193,194,196,219,221,254].includes(l)&&!(l>=224&&l<=239)&&h("JPEG unsupported segment"),i=S}h("JPEG truncated")}function ie(e,a){(!(e instanceof Uint8Array)||e.length<12||e.length>G.byteLength)&&h("encoded byte limit");const i=new DataView(e.buffer,e.byteOffset,e.byteLength);if(a==="image/png")return{mimeType:a,...he(e,i)};if(a==="image/jpeg")return{mimeType:a,...be(e,i)};h("MIME type")}const T=Object.freeze({byteLength:16*1024**2,jsonBytes:256*1024,vertices:1e5,triangles:15e4,coordinate:1e6}),Z="model/gltf-binary",me=new TextEncoder,pe=new TextDecoder("utf-8",{fatal:!0}),o=e=>{throw new Error(`Invalid generated mesh: ${e}`)};function I(e,a,i){return(!Number.isSafeInteger(e)||e<a||e>i)&&o("numeric limit"),e}function g(e,a){return(!e||typeof e!="object"||Array.isArray(e)||Object.keys(e).some(i=>!a.includes(i)))&&o("unsupported GLB field"),e}function J(e,a,i=-T.coordinate,c=T.coordinate){return(!Array.isArray(e)||e.length!==a||e.some(d=>!Number.isFinite(d)||d<i||d>c))&&o("invalid vector"),[...e]}function P(e){return(!Array.isArray(e)||e.length!==1)&&o("expected one static mesh"),e[0]}const ee=(e,a)=>JSON.stringify(e)===JSON.stringify(a);function Te(e){var i,c;(!e||e.format!=="glb"||e.mimeType!==Z||!/^[a-f0-9]{64}$/u.test(e.sha256??""))&&o("format or SHA-256");const a={min:J((i=e.bounds)==null?void 0:i.min,3),max:J((c=e.bounds)==null?void 0:c.max,3)};return a.min.some((d,n)=>d>a.max[n])&&o("inverted bounds"),{format:"glb",mimeType:Z,byteLength:I(e.byteLength,32,T.byteLength),sha256:e.sha256,vertexCount:I(e.vertexCount,3,T.vertices),triangleCount:I(e.triangleCount,1,T.triangles),bounds:a}}function ge(e,a=[],{allowTextures:i=!0}={}){var v,u,O,k,_;const c=new DataView(e.buffer,e.byteOffset,e.byteLength);(c.getUint32(0,!0)!==1179937895||c.getUint32(4,!0)!==2||c.getUint32(8,!0)!==e.byteLength)&&o("GLB header");const d=c.getUint32(12,!0);(!d||d%4||d>T.jsonBytes||20+d+8>e.byteLength||c.getUint32(16,!0)!==1313821514)&&o("JSON chunk");let n;try{n=JSON.parse(pe.decode(e.subarray(20,20+d)))}catch{o("JSON syntax")}const l=20+d,b=c.getUint32(l,!0);(b%4||c.getUint32(l+4,!0)!==5130562||l+8+b!==e.byteLength)&&o("BIN chunk"),g(n,["asset","scene","scenes","nodes","meshes","buffers","bufferViews","accessors","materials","images","textures","samplers"]),g(n.asset,["version","generator"]),(n.asset.version!=="2.0"||n.asset.generator!==void 0&&(typeof n.asset.generator!="string"||n.asset.generator.length>128))&&o("asset version"),n.scene!==0&&o("scene");const S=g(P(n.scenes),["nodes"]);ee(S.nodes,[0])||o("scene nodes"),g(P(n.nodes),["mesh"]).mesh!==0&&o("node mesh");const N=g(P(n.meshes),["primitives"]),m=g(P(N.primitives),["attributes","indices","mode","material"]);m.mode!==void 0&&m.mode!==4&&o("only triangles are supported"),g(m.attributes,["POSITION","NORMAL","COLOR_0","TEXCOORD_0","TANGENT"]),!i&&(m.attributes.TEXCOORD_0!==void 0||m.attributes.TANGENT!==void 0||n.images!==void 0||n.textures!==void 0||n.samplers!==void 0)&&o("textured profile requires a compatible peer"),Object.hasOwn(m.attributes,"POSITION")||o("missing positions");const U=g(P(n.buffers),["byteLength"]);I(U.byteLength,1,b),b-U.byteLength>3&&o("BIN padding"),(!Array.isArray(n.bufferViews)||n.bufferViews.length<2||n.bufferViews.length>6+G.count||!Array.isArray(n.accessors)||n.accessors.length<2||n.accessors.length>6)&&o("accessor count");const D=[];for(const t of n.bufferViews){g(t,["buffer","byteOffset","byteLength","target"]),(t.buffer!==0||t.target!==void 0&&![34962,34963].includes(t.target))&&o("buffer view");const r=I(t.byteOffset??0,0,U.byteLength),s=I(t.byteLength,1,U.byteLength-r);r%4&&o("buffer alignment"),D.some(([f,y])=>r<y&&r+s>f)&&o("overlapping buffer views"),D.push([r,r+s])}const R=new Set,A=new Set;function L(t,r){I(t,0,n.accessors.length-1),R.has(t)&&o("reused accessor"),R.add(t);const s=g(n.accessors[t],["bufferView","byteOffset","componentType","count","type","min","max"]);I(s.bufferView,0,n.bufferViews.length-1),A.has(s.bufferView)&&o("reused buffer view"),A.add(s.bufferView);const f=r==="indices"?1:r==="uvs"?2:r==="tangents"||r==="colors"&&s.type==="VEC4"?4:3;(s.type!==(f===1?"SCALAR":`VEC${f}`)||(r==="indices"?![5123,5125].includes(s.componentType):s.componentType!==5126))&&o("accessor format");const y=s.componentType===5123?2:4,j=I(s.count,3,r==="indices"?T.triangles*3:T.vertices),z=D[s.bufferView],K=I(s.byteOffset??0,0,z[1]-z[0]);(K%y||K+j*f*y!==z[1]-z[0])&&o("accessor byte range");const $=new DataView(e.buffer,e.byteOffset+l+8+z[0]+K,j*f*y),ce=s.componentType===5126?q=>$.getFloat32(q*4,!0):s.componentType===5125?q=>$.getUint32(q*4,!0):q=>$.getUint16(q*2,!0);return{entry:s,count:j,components:f,get:ce}}const x=L(m.attributes.POSITION,"positions"),E={min:[1/0,1/0,1/0],max:[-1/0,-1/0,-1/0]};for(let t=0;t<x.count*3;t++){const r=x.get(t);(!Number.isFinite(r)||Math.abs(r)>T.coordinate)&&o("nonfinite or excessive position"),E.min[t%3]=Math.min(E.min[t%3],r),E.max[t%3]=Math.max(E.max[t%3],r)}for(const t of["min","max"])ee(J(x.entry[t],3),E[t])||o("position bounds mismatch");E.min.every((t,r)=>t===E.max[r])&&o("empty geometry");for(const[t,r]of[["NORMAL","normals"],["COLOR_0","colors"],["TEXCOORD_0","uvs"],["TANGENT","tangents"]]){if(!Object.hasOwn(m.attributes,t))continue;const s=L(m.attributes[t],r);(s.count!==x.count||s.entry.min!==void 0||s.entry.max!==void 0)&&o("attribute count or bounds");for(let f=0;f<s.count*s.components;f++){const y=s.get(f);(!Number.isFinite(y)||y<(["colors","uvs"].includes(r)?0:-1.001)||y>(["colors","uvs"].includes(r)?1:1.001))&&o("invalid attribute value")}if(r==="normals"||r==="tangents")for(let f=0;f<s.count;f++){const y=f*s.components,j=Math.hypot(s.get(y),s.get(y+1),s.get(y+2));Math.abs(j-1)>.001&&o("normal or tangent must be a unit vector"),r==="tangents"&&![-1,1].includes(s.get(y+3))&&o("tangent handedness")}}m.attributes.TANGENT!==void 0&&m.attributes.NORMAL===void 0&&o("tangent requires normals");const w=L(m.indices,"indices");(w.count%3||w.entry.min!==void 0||w.entry.max!==void 0)&&o("triangle indices");for(let t=0;t<w.count;t++){const r=w.get(t);r>=x.count&&o("index outside positions"),w.entry.componentType===5123&&r===65535&&o("primitive restart index")}const B=new Set,V=new Set,C=new Set;function W(t,r=!1){g(t,r?["index","texCoord","scale"]:["index","texCoord"]),(!Array.isArray(n.textures)||t.texCoord!==void 0&&t.texCoord!==0||m.attributes.TEXCOORD_0===void 0)&&o("texture coordinates"),I(t.index,0,n.textures.length-1),B.add(t.index),r&&(m.attributes.NORMAL===void 0||t.scale!==void 0&&(!Number.isFinite(t.scale)||t.scale<0||t.scale>1))&&o("normal texture")}if(n.materials!==void 0){const t=g(P(n.materials),["pbrMetallicRoughness","doubleSided","alphaMode","normalTexture"]);t.doubleSided!==void 0&&typeof t.doubleSided!="boolean"&&o("material"),t.alphaMode!==void 0&&t.alphaMode!=="OPAQUE"&&o("material alpha");const r=g(t.pbrMetallicRoughness,["baseColorFactor","metallicFactor","roughnessFactor","baseColorTexture","metallicRoughnessTexture"]);r.baseColorFactor!==void 0&&J(r.baseColorFactor,4,0,1);for(const s of["metallicFactor","roughnessFactor"])r[s]!==void 0&&(!Number.isFinite(r[s])||r[s]<0||r[s]>1)&&o("material factor");m.material!==0&&o("material index");for(const s of["baseColorTexture","metallicRoughnessTexture"])r[s]!==void 0&&W(r[s]);t.normalTexture!==void 0&&W(t.normalTexture,!0)}else m.material!==void 0&&o("missing material");for(const t of["textures","images","samplers"])n[t]!==void 0&&(!Array.isArray(n[t])||n[t].length<1||n[t].length>G.count)&&o("texture table count");for(const t of n.textures??[])g(t,["source","sampler"]),I(t.source,0,(((v=n.images)==null?void 0:v.length)??0)-1),V.add(t.source),t.sampler!==void 0&&(I(t.sampler,0,(((u=n.samplers)==null?void 0:u.length)??0)-1),C.add(t.sampler));for(const t of n.samplers??[]){g(t,["magFilter","minFilter","wrapS","wrapT"]);for(const r of["magFilter","minFilter","wrapS","wrapT"])t[r]!==void 0&&!(r.startsWith("wrap")?[33071,33648,10497]:r==="magFilter"?[9728,9729]:[9728,9729,9984,9985,9986,9987]).includes(t[r])&&o("texture sampler")}let Y=0;for(const t of n.images??[]){g(t,["bufferView","mimeType"]),I(t.bufferView,0,n.bufferViews.length-1),(A.has(t.bufferView)||n.bufferViews[t.bufferView].target!==void 0)&&o("image buffer view"),A.add(t.bufferView);const r=D[t.bufferView],s=l+8,f=e.subarray(s+r[0],s+r[1]),y=ie(f,t.mimeType);Y+=y.pixels,Y>G.pixels&&o("texture pixel limit"),a.push({...y,data:f})}return(B.size!==(((O=n.textures)==null?void 0:O.length)??0)||V.size!==(((k=n.images)==null?void 0:k.length)??0)||C.size!==(((_=n.samplers)==null?void 0:_.length)??0))&&o("unused texture resource"),(R.size!==n.accessors.length||A.size!==n.bufferViews.length)&&o("unused accessor"),{vertexCount:x.count,triangleCount:w.count/3,bounds:E}}function ye(e,a={}){(!((e==null?void 0:e.data)instanceof Uint8Array)||e.data.byteLength<32||e.data.byteLength>T.byteLength)&&o("binary byte limit");const i=new Uint8Array(e.data),c={format:"glb",mimeType:Z,byteLength:i.byteLength,sha256:de(le(i)),...ge(i,[],a)};for(const d of Object.keys(c))e[d]!==void 0&&!ee(e[d],c[d])&&o(`${d} mismatch`);return{...c,data:i}}function Ee({positions:e,indices:a,normals:i,colors:c,uvs:d,tangents:n,textures:l,roughness:b=1,metallic:S=0}){(!(e instanceof Float32Array)||e.length%3||!(a instanceof Uint16Array||a instanceof Uint32Array)||a.length%3)&&o("geometry arrays");const p=I(e.length/3,3,T.vertices);I(a.length/3,1,T.triangles),i!==void 0&&(!(i instanceof Float32Array)||i.length!==e.length)&&o("normal array"),c!==void 0&&(!(c instanceof Float32Array)||![p*3,p*4].includes(c.length))&&o("color array"),d!==void 0&&(!(d instanceof Float32Array)||d.length!==p*2)&&o("UV array"),n!==void 0&&(!(n instanceof Float32Array)||n.length!==p*4)&&o("tangent array"),l!==void 0&&g(l,["baseColor","normal","metallicRoughness"]);const N={min:[1/0,1/0,1/0],max:[-1/0,-1/0,-1/0]};for(let u=0;u<e.length;u++)N.min[u%3]=Math.min(N.min[u%3],e[u]),N.max[u%3]=Math.max(N.max[u%3],e[u]);const m=[],U=[],D=[],R={};let A=0;const L=(u,O,k,_={})=>{const t=U.length,r=new Uint8Array(u.byteLength),s=new DataView(r.buffer);for(let f=0;f<u.length;f++)u instanceof Float32Array?s.setFloat32(f*4,u[f],!0):u instanceof Uint32Array?s.setUint32(f*4,u[f],!0):s.setUint16(f*2,u[f],!0);return m.push({offset:A,data:r}),D.push({buffer:0,byteOffset:A,byteLength:r.byteLength,target:k}),U.push({bufferView:t,componentType:u instanceof Float32Array?5126:u instanceof Uint32Array?5125:5123,count:O==="SCALAR"?u.length:p,type:O,..._}),A+=Math.ceil(r.byteLength/4)*4,t};R.POSITION=L(e,"VEC3",34962,N),i!==void 0&&(R.NORMAL=L(i,"VEC3",34962)),c!==void 0&&(R.COLOR_0=L(c,c.length===p*4?"VEC4":"VEC3",34962)),d!==void 0&&(R.TEXCOORD_0=L(d,"VEC2",34962)),n!==void 0&&(R.TANGENT=L(n,"VEC4",34962));const x=L(a,"SCALAR",34963),E={pbrMetallicRoughness:{metallicFactor:S,roughnessFactor:b},doubleSided:!0},w=[],B=[];for(const u of["baseColor","normal","metallicRoughness"]){if((l==null?void 0:l[u])===void 0)continue;const O=g(l[u],["data","mimeType"]);ie(O.data,O.mimeType);const k=w.length;w.push({bufferView:D.length,mimeType:O.mimeType}),B.push({source:k,sampler:0}),D.push({buffer:0,byteOffset:A,byteLength:O.data.byteLength}),m.push({offset:A,data:O.data}),A+=Math.ceil(O.data.byteLength/4)*4,u==="normal"?E.normalTexture={index:k}:E.pbrMetallicRoughness[`${u}Texture`]={index:k}}const V=me.encode(JSON.stringify({asset:{version:"2.0",generator:"PeerCompute generated mesh"},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:R,indices:x,mode:4,material:0}]}],materials:[E],buffers:[{byteLength:A}],bufferViews:D,accessors:U,...w.length?{images:w,textures:B,samplers:[{magFilter:9729,minFilter:9729}]}:{}})),C=Math.ceil(V.byteLength/4)*4,W=28+C+A;(W>T.byteLength||C>T.jsonBytes)&&o("encoded byte limit");const Y=new Uint8Array(W),v=new DataView(Y.buffer);v.setUint32(0,1179937895,!0),v.setUint32(4,2,!0),v.setUint32(8,W,!0),v.setUint32(12,C,!0),v.setUint32(16,1313821514,!0),Y.fill(32,20,20+C),Y.set(V,20),v.setUint32(20+C,A,!0),v.setUint32(24+C,5130562,!0);for(const u of m)Y.set(u.data,28+C+u.offset);return ye({data:Y})}const H=[{path:"u2netp.onnx",size:4574861,sha256:"309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8",source:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",path:"u2netp.onnx"}},{path:"u2netp.README.md",size:2597,sha256:"e447db65818dba51c001c1a5c9fc43c56c5c60e5ed2cd858c2bad3a239847ef4",source:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",path:"README.md"}}],te={spdx:"Apache-2.0",sourceUrl:"https://raw.githubusercontent.com/xuebinqin/U-2-Net/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29/LICENSE",notice:`                                 Apache License
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
`},oe={spdx:"MIT",sourceUrl:"https://raw.githubusercontent.com/danielgatis/rembg/991927b77667946dab59c50df31f7d4640e80457/LICENSE.txt",notice:`MIT License

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
`},re=[{path:"weights.bin",size:2285308688,sha256:"0e5c23c8c502492c0b4432006ac30f2d11b2a4c102a3bf9f21c2fcf094ddbffd",source:{repository:"BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",path:"weights.bin"}},{path:"README.md",size:2706,sha256:"00cf8aee3adbf563b1593ab4c96af59ed47582466658fafd924e1349ab51751a",source:{repository:"BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",path:"README.md"}},{path:"LICENSE.md",size:11726,sha256:"9b60b9d0411f54d4087484ad4acf28ca6fd9f6a84c30ddacb04de2c623254749",source:{repository:"BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",path:"LICENSE.md"}},{path:"NOTICE",size:1464,sha256:"b9b71f7a22dc2529840a5a53f61022bff499994d15446d0506eb5591a3f90376",source:{repository:"BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",path:"NOTICE"}},{path:"tets/vertices.bin",size:6430584,sha256:"16f4ee01a050d1757c19b13a7e1dbd4d0918d08208d961c105ff74cbfc345dac",source:{repository:"needle-tools/SF3D-webgpu",revision:"56d2f58d27395b0be9c633671b439b4aac482549",path:"tets_vertices.bin"}},{path:"tets/indices.bin",size:47543232,sha256:"606cc8b47f8744a64ff6f1f3c088d9d9113ff80539bd62cb1651f8dc629d1f1e",source:{repository:"needle-tools/SF3D-webgpu",revision:"56d2f58d27395b0be9c633671b439b4aac482549",path:"tets_indices.bin"}}],ne={spdx:"LicenseRef-Stability-AI-Community",sourceUrl:"https://huggingface.co/BasinShapers/sf3d-webgpu-weights/blob/53cfd8926e0abe77443b97d8684da1ea36bc4af7/LICENSE.md",notice:`STABILITY AI COMMUNITY LICENSE AGREEMENT
Last Updated: July 5, 2024


I. INTRODUCTION

This Agreement applies to any individual person or entity ("You", "Your" or "Licensee") that uses or distributes any portion or element of the Stability AI Materials  or Derivative Works thereof for any Research & Non-Commercial or Commercial purpose. Capitalized terms not otherwise defined herein are defined in Section V below.


This Agreement is intended to allow research, non-commercial, and limited commercial uses of the Models free of charge. In order to ensure that certain limited commercial uses of the Models continue to be allowed, this Agreement  preserves free access to the Models for people or organizations  generating annual revenue of less than US $1,000,000 (or local currency equivalent).  


By clicking "I Accept"  or by using or distributing or using any portion or element of the Stability Materials or Derivative Works, You agree that You have read, understood and are bound by the terms of this Agreement. If You are acting on behalf of a company, organization or other entity, then "You" includes you and that entity, and You agree that You: (i) are an authorized representative of such entity with the authority to bind such entity to this Agreement, and (ii) You agree to the terms of this Agreement on that entity's behalf. 

II. RESEARCH & NON-COMMERCIAL USE LICENSE

Subject to the terms of this Agreement, Stability AI grants You a non-exclusive, worldwide, non-transferable, non-sublicensable, revocable and royalty-free limited license under Stability AI's intellectual property or other rights owned by Stability AI embodied in the Stability AI Materials to use, reproduce, distribute, and create Derivative Works of, and make modifications to, the Stability AI Materials for any Research or Non-Commercial Purpose. "Research Purpose" means academic or scientific advancement, and in each case, is not primarily intended for commercial advantage or monetary compensation to You or others. "Non-Commercial Purpose" means any purpose other than a Research Purpose that is not primarily intended for commercial advantage or monetary compensation to You or others, such as personal use (i.e., hobbyist) or evaluation and testing.  

III. COMMERCIAL USE LICENSE

Subject to the terms of this Agreement (including the remainder of this Section III), Stability AI grants You a non-exclusive, worldwide, non-transferable, non-sublicensable, revocable and royalty-free limited license under Stability AI's intellectual property or other rights owned by Stability AI embodied in the Stability AI Materials to use, reproduce, distribute, and create Derivative Works of, and make modifications to, the Stability AI Materials for any Commercial Purpose. "Commercial Purpose" means any purpose other than a Research Purpose or Non-Commercial Purpose that is primarily intended for commercial advantage or monetary compensation to You or others, including but not limited to, (i) creating, modifying, or distributing Your product or service, including via a hosted service or application programming interface, and (ii) for Your business's or organization's internal operations. 
If You are using or distributing the Stability AI Materials for a Commercial Purpose, You must register with Stability AI at (https://stability.ai/community-license). If at any time You or Your Affiliate(s), either individually or in aggregate, generate more than USD $1,000,000 in annual revenue (or the equivalent thereof in Your local currency), regardless of whether that revenue is generated directly or indirectly from the Stability AI Materials or Derivative Works, any licenses granted to You under this Agreement shall terminate as of such date. You must request a license from Stability AI at (https://stability.ai/enterprise) , which Stability AI may grant to You in its sole discretion. If you receive Stability AI Materials, or any Derivative Works thereof, from a Licensee as part of an integrated end user product, then Section III of this Agreement will not apply to you.

IV. GENERAL TERMS

Your Research, Non-Commercial, and Commercial License(s) under this Agreement are subject to the following terms.
a.  Distribution & Attribution. If You distribute or make available the Stability AI Materials or a Derivative Work to a third party, or a product or service that uses any portion of them, You shall: (i) provide a copy of this Agreement to that third party, (ii) retain the following attribution notice within a "Notice" text file distributed as a part of such copies: "This Stability AI Model is licensed under the Stability AI Community License, Copyright ©  Stability AI Ltd. All Rights Reserved", and (iii) prominently display "Powered by Stability AI" on a related website, user interface, blogpost, about page, or product documentation.  If You create a Derivative Work, You may add your own attribution notice(s) to the "Notice" text file included with that Derivative Work, provided that You clearly indicate which attributions apply to the Stability AI Materials and state in the "Notice" text file that You changed the Stability AI Materials and how it was modified.
b.  Use Restrictions. Your use of the Stability AI Materials and Derivative Works, including any output or results of the Stability AI Materials or Derivative Works, must comply with applicable laws and regulations (including Trade Control Laws and equivalent regulations) and adhere to the Documentation and Stability AI's AUP, which is hereby incorporated by reference. Furthermore, You will not use the Stability AI Materials or Derivative Works, or any output or results of the Stability AI Materials or Derivative Works, to create or improve any foundational generative AI model (excluding the Models or Derivative Works). 
c.  Intellectual Property. 
(i) Trademark License.  No trademark licenses are granted under this Agreement, and in connection with the Stability AI Materials or Derivative Works, You may not use any name or mark owned by or associated with Stability AI or any of its Affiliates, except as required under Section IV(a) herein.
(ii)  Ownership of Derivative Works.  As between You and Stability AI, You are the owner of Derivative Works You create, subject to Stability AI's ownership of the Stability AI Materials and any Derivative Works made by or for Stability AI.
(iii)  Ownership of Outputs. As between You and Stability AI, You own any outputs generated from the Models or Derivative Works to the extent permitted by applicable law. 
(iv)  Disputes.  If You or Your Affiliate(s) institute litigation or other proceedings against Stability AI (including a cross-claim or counterclaim in a lawsuit) alleging that the Stability AI Materials, Derivative Works or associated outputs or results, or any portion of any of the foregoing, constitutes infringement of intellectual property or other rights owned or licensable by You, then any licenses granted to You under this Agreement shall terminate as of the date such litigation or claim is filed or instituted. You will indemnify and hold harmless Stability AI from and against any claim by any third party arising out of or related to Your use or distribution of the Stability AI Materials or Derivative Works in violation of this Agreement.
(v)  Feedback.  From time to time, You may provide Stability AI with verbal and/or written suggestions, comments or other feedback related to Stability AI's existing or prospective technology, products or services (collectively, "Feedback"). You are not obligated to provide Stability AI with Feedback, but to the extent that You do, You hereby grant Stability AI a perpetual, irrevocable, royalty-free, fully-paid, sub-licensable, transferable, non-exclusive, worldwide right and license to exploit the Feedback in any manner without restriction. Your Feedback is provided "AS IS" and You make no warranties whatsoever about any Feedback.
d.  Disclaimer Of Warranty. UNLESS REQUIRED BY APPLICABLE LAW, THE STABILITY AI MATERIALS AND ANY OUTPUT AND RESULTS THEREFROM ARE PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, ANY WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE. YOU ARE SOLELY RESPONSIBLE FOR DETERMINING THE APPROPRIATENESS OR LAWFULNESS OF USING OR REDISTRIBUTING THE STABILITY AI MATERIALS, DERIVATIVE WORKS OR ANY OUTPUT OR RESULTS AND ASSUME ANY RISKS ASSOCIATED WITH YOUR USE OF THE STABILITY AI MATERIALS, DERIVATIVE WORKS AND ANY OUTPUT AND RESULTS.
e.  Limitation Of Liability. IN NO EVENT WILL STABILITY AI OR ITS AFFILIATES BE LIABLE UNDER ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, TORT, NEGLIGENCE, PRODUCTS LIABILITY, OR OTHERWISE, ARISING OUT OF THIS AGREEMENT, FOR ANY LOST PROFITS OR ANY DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL, EXEMPLARY OR PUNITIVE DAMAGES, EVEN IF STABILITY AI OR ITS AFFILIATES HAVE BEEN ADVISED OF THE POSSIBILITY OF ANY OF THE FOREGOING.
f.  Term And Termination. The term of this Agreement will commence upon Your acceptance of this Agreement or access to the Stability AI Materials and will continue in full force and effect until terminated in accordance with the terms and conditions herein. Stability AI may terminate this Agreement if You are in breach of any term or condition of this Agreement. Upon termination of this Agreement, You shall delete and cease use of any Stability AI Materials or Derivative Works. Section IV(d), (e), and (g) shall survive the termination of this Agreement.
g.  Governing Law.  This Agreement will be governed by and constructed in accordance with the laws of the United States and the State of California without regard to choice of law principles, and the UN Convention on Contracts for International Sale of Goods does not apply to this Agreement.

V. DEFINITIONS 

"Affiliate(s)" means any entity that directly or indirectly controls, is controlled by, or is under common control with the subject entity; for purposes of this definition, "control" means direct or indirect ownership or control of more than 50% of the voting interests of the subject entity.
"Agreement" means this Stability AI Community License Agreement.
"AUP" means the Stability AI Acceptable Use Policy available at https://stability.ai/use-policy, as may be updated from time to time.
"Derivative Work(s)" means (a) any derivative work of the Stability AI Materials as recognized by U.S. copyright laws and (b) any modifications to a Model, and any other model created which is based on or derived from the Model or the Model's output, including"fine tune" and "low-rank adaptation" models derived from a Model or a Model's output, but do not include the output of any Model.
"Documentation" means any specifications, manuals, documentation, and other written information provided by Stability AI related to the Software or Models.
"Model(s)" means, collectively, Stability AI's proprietary models and algorithms, including machine-learning models, trained model weights and other elements of the foregoing listed on Stability's Core Models Webpage available at, https://stability.ai/core-models, as may be updated from time to time.
"Stability AI" or "we" means Stability AI Ltd. and its Affiliates.
"Software" means Stability AI's proprietary software made available under this Agreement now or in the future.
"Stability AI Materials" means, collectively, Stability's proprietary Models, Software and Documentation (and any portion or combination thereof) made available under this Agreement. 
"Trade Control Laws" means any applicable U.S. and non-U.S. export control and trade sanctions laws and regulations.`},F={id:"stable-fast-3d-webgpu",name:"Stable Fast 3D · textured meshes (WebGPU)",description:"Image to textured 3D meshes, UVs and material estimates. Powered by Stability AI. FP16 stored weights execute FP32 GPU math. Static geometry; no rigging or animation.",repository:"BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",format:"SF3D",pipeline:"sf3d",architecture:"sf3d",dtype:"fp16",status:"tested",model:{runtime:"webgpu-sf3d",runtimeVersion:"0.1.60",task:"image-to-3d",format:"SF3D",pipeline:"sf3d",architecture:"sf3d",dtype:"fp16",computeDtype:"fp32",modalities:["image"],outputModalities:["mesh"],requiredFeatures:[],repository:"BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",kernelRevision:"86b7b68109434ffc33218f5fb697c7057c2518f9",imageSize:512,textureSize:1024,foregroundRatio:.85,backgroundRemoval:"u2netp"},capabilities:{pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"tested",executionReason:"Tested in a managed browser worker on NVIDIA 16 GiB: opaque/cutout images, repeated local and encrypted peer generation, cancellation, retained reload and browser restart. CubeChat textured props and avatars verified. Static meshes; no shader-f16 requirement. Other devices are unqualified.",import:!0},provenance:{repository:"BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",format:"SF3D",metadataCheckedAt:"2026-11-11",originalModel:"stabilityai/stable-fast-3d",modelCardUrl:"https://huggingface.co/BasinShapers/sf3d-webgpu-weights/blob/53cfd8926e0abe77443b97d8684da1ea36bc4af7/README.md",kernelRepository:"https://github.com/lyonsno/sf3d-webgpu",kernelRevision:"86b7b68109434ffc33218f5fb697c7057c2518f9",gridRepository:"needle-tools/SF3D-webgpu",gridRevision:"56d2f58d27395b0be9c633671b439b4aac482549"}};F.files=[...re,...H];F.totalBytes=F.files.reduce((e,a)=>e+a.size,0);F.weightBytes=re[0].size+H[0].size;F.license={spdx:"LicenseRef-Stability-AI-Community AND Apache-2.0",sourceUrl:ne.sourceUrl,notice:"Powered by Stability AI. Full model license and derivative notice are included. U2Net foreground weights use Apache-2.0.",components:[{...ne,derivativeNotice:`This Stability AI Model is licensed under the Stability AI Community License, Copyright © Stability AI Ltd. All Rights Reserved

Powered by Stability AI.

Stable Fast 3D originates with Stability AI. The WebGPU port is from
lyonsno/sf3d-webgpu, commit 86b7b68109434ffc33218f5fb697c7057c2518f9.

PeerCompute changed the port's asset loading, worker ownership, raw-image and
texture encoding interfaces, cancellation checks, and allocation cleanup.
The authored bounded artifact adapter streams the same checkpoint tensors and
retains the original WGSL kernels. The model weights themselves are unchanged.
See README.md for the exact integration changes and LICENSE.md for the license.
`},te,oe,{spdx:"MIT AND BSD-3-Clause",sourceUrl:"https://www.npmjs.com/package/@kaminos/webgpu-inference-kit/v/0.1.60",notice:`MIT License

Copyright (c) 2026 Noah Lyons

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

Third-Party Notices

The MIT license covers the Kaminos implementation in this package.
Third-party components retain their own terms. Model weights and separately
loaded assets are not licensed by this package's MIT license.

The split4 linear shader in src/linear-kernel.js is adapted from WebGPU
Samples' visionTransformer mlp.wgsl. Its BSD-3-Clause terms follow. This notice
also accompanies standalone model bundles that include the Kit shader.

WebGPU Samples
https://github.com/webgpu/webgpu-samples
License: BSD-3-Clause
Source: https://github.com/webgpu/webgpu-samples/blob/main/LICENSE.txt

Copyright 2019 WebGPU Samples Contributors

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
   2. Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

   3. Neither the name of the copyright holder nor the names of its
      contributors may be used to endorse or promote products derived from this
      software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
`}]};function ae(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(ae),Object.freeze(e)),e}const Ie=ae({[F.id]:F});function X(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(X),Object.freeze(e)),e}const se=X({"triposr-q8-onnx":{id:"triposr-q8-onnx",name:"TripoSR · image to 3D (Q8)",repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",format:"ONNX",status:"tested",pipeline:"triposr",architecture:"triposr",dtype:"q8",files:[{path:"triplane_q8.onnx",size:885712,sha256:"7721f5a45e79e02de8c6e909c21fb8e922fd0b594038a8fc1cfefa42c79ad6d5",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"triplane_q8.onnx"}},{path:"triplane_q8.onnx.data",size:483785728,sha256:"50bf9b1c1218dc2c7fb6051d0d2cb7a48a1c5f75cc86e67a9d0e09a931298e35",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"triplane_q8.onnx.data"}},{path:"decoder.onnx",size:173796,sha256:"6ff43581f1d2b46aa61764c2729a8d33985b51cb6c8088cf36ffee3fd70355eb",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"decoder.onnx"}},{path:"README.md",size:3633,sha256:"179a47df133504635c15498b74a7a700f80ed3d43aa12c864ad58539fc667a78",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"README.md"}}],license:{spdx:"MIT",sourceUrl:"https://github.com/VAST-AI-Research/TripoSR/blob/107cefdc244c39106fa830359024f6a2f1c78871/LICENSE",notice:`MIT License

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
`},capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"tested",executionReason:"Tested on NVIDIA WebGPU without shader-f16: real chair image to colored GLB locally and over encrypted inference v5, cancellation/recovery and source-off retained restart. Two CubeChat pages fetched and rendered the same CID; the owner restored it after reload without regeneration. Requires the managed ORT native WebGPU worker. Static objects only; no rigging or animation.",executionEvidence:{checkedAt:"2026-11-11",scope:"local managed worker, encrypted v5 peer inference, and two CubeChat pages",gpuArchitecture:"NVIDIA Blackwell",shaderF16Required:!1,fixture:"TripoSR MIT chair.png",meshSha256:"778fb251bd61ef74ee256622ffe5602d512f1455e8678911f91f866e67af6f24",meshBytes:590056,triangles:4908,gpuDispatches:1207,cancellationRecovery:!0,retainedRestart:!0,peerExecution:"tested",peerProtocol:"/peercompute/inference/5.0.0",peerCancellationRecovery:!0,peerOutputMatchesLocal:!0,cubeChat:{pages:2,sameArtifactCid:!0,renderedOnBothPages:!0,ownerReloadWithoutGeneration:!0,unpinnedObserverCacheCollected:!0}}},provenance:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",format:"ONNX",metadataCheckedAt:"2026-11-11",modelCardUrl:"https://huggingface.co/cgb/triposr-onnx-webgpu/blob/048725e957f485cc6bc082a9d6a239fcf7d8880a/README.md"},model:{runtime:"onnx-mesh",runtimeVersion:"1.31.1",task:"image-to-3d",format:"ONNX",pipeline:"triposr",architecture:"triposr",dtype:"q8",modalities:["image"],outputModalities:["mesh"],requiredFeatures:[],repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",resolution:64,densityThreshold:25,radius:.87,imageSize:512,foregroundRatio:.85},weightBytes:484845236,totalBytes:484848869}}),we=X(Object.values(se)),M=se["triposr-q8-onnx"],Oe=X({"triposr-q8-onnx":{...M,model:{...M.model,backgroundRemoval:"u2netp"},files:[...M.files,...H],weightBytes:M.weightBytes+H[0].size,totalBytes:M.totalBytes+H.reduce((e,a)=>e+a.size,0),license:{spdx:"MIT AND Apache-2.0",sourceUrl:M.license.sourceUrl,notice:"TripoSR © 2024 Tripo AI & Stability AI (MIT). U²-Net weights: Apache-2.0; rembg distribution © 2020 Daniel Gatis (MIT). Full original license texts are retained in this package.",components:[M.license,te,oe]},provenance:{...M.provenance,foreground:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",sourceUrl:"https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx",modelCardUrl:"https://huggingface.co/edgetools/u2netp/blob/25dee37ab19c5b6ad64ba6578eba63f1ae07720c/README.md",sha256:H[0].sha256,licenseUrl:te.sourceUrl}},capabilities:{...M.capabilities,executionStatus:"tested",executionReason:"Tested in the managed WebGPU worker: actual CubeChat owner chat through peer Qwen and DreamShaper to U2NetP foreground removal and TripoSR. Both CubeChat peers displayed the same isolated chair CID; owner reload restored it without regeneration. Static, coarse geometry; no rigging or animation. No shader-f16 required.",executionEvidence:{checkedAt:"2026-11-11",scope:"Actual owner chat, peer language/image/3D inference, two CubeChat pages and retained object reload",shaderF16Required:!1,foregroundModel:"u2netp",input:"Opaque DreamShaper 512x512 RGBA chair",meshSha256:"277a963c5b9b66361f7ef7e43deea2fc5e90b770f5897def6b58ea83f186ae16",meshBytes:883820,triangles:7356,peerExecution:"tested",peerProtocol:"/peercompute/inference/5.0.0",cubeChat:{pages:2,sameArtifactCid:!0,renderedOnBothPages:!0,ownerReloadWithoutGeneration:!0,unpinnedObserverCacheCollected:!0}}}},...Ie});export{we as L,Oe as M,Ie as S,Ee as e,Te as n,ye as v};
