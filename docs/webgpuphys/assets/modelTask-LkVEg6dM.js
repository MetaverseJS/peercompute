import{c as gs}from"./GgufArtifactReader-CzGoASVT.js";import{t as tt,a as Si}from"./ArtifactReadBridge-COO86mrc.js";import{
b as xs,s as bs}from"./sha2-DF-yaAk2.js";import{n as ws}from"./ArtifactManifest-yd-Kg2mB.js";import{validateImageInput as As}from"./modelTask-BM00xVR9.js";
const re=Object.freeze({count:4,dimension:2048,pixels:8*1024**2,byteLength:8*1024**2}),q=c=>{throw new Error(`Invalid ge\
nerated mesh texture: ${c}`)},Ms=[137,80,78,71,13,10,26,10];function fi(c,t){return(!Number.isSafeInteger(c)||!Number.isSafeInteger(
t)||c<1||t<1||c>re.dimension||t>re.dimension)&&q("dimensions"),{width:c,height:t,pixels:c*t}}function Ss(c,t,e){let i=4294967295;
for(let s=t;s<e;s++){i^=c[s];for(let n=0;n<8;n++)i=i>>>1^3988292384&-(i&1)}return(i^4294967295)>>>0}function Is(c,t){Ms.
every((r,h)=>c[h]===r)||q("PNG signature");let e=8,i,s=!1,n=!1,o=!1;for(;e+12<=c.length;){const r=t.getUint32(e),h=e+12+
r;h>c.length&&q("PNG chunk range");const a=String.fromCharCode(...c.subarray(e+4,e+8));if(t.getUint32(h-4)!==Ss(c,e+4,h-
4)&&q("PNG chunk checksum"),["IHDR","IDAT","IEND","PLTE","tRNS","sRGB","gAMA","cHRM","pHYs"].includes(a)||q("PNG chunk t\
ype"),e===8&&a!=="IHDR"&&q("PNG header order"),a==="IHDR")(i||r!==13||c[e+16]!==8||![0,2,3,4,6].includes(c[e+17])||c[e+18]!==
0||c[e+19]!==0||c[e+20]!==0)&&q("PNG header"),i=fi(t.getUint32(e+8),t.getUint32(e+12)),i.colorType=c[e+17];else if(a==="\
PLTE")(s||o||!r||r>768||r%3)&&q("PNG palette"),o=!0;else if(a==="IDAT")(n||i.colorType===3&&!o)&&q("PNG image order"),s=
!0;else{if(a==="IEND")return(r||!s||h!==c.length)&&q("PNG end"),fi(i.width,i.height);{s&&(n=!0);const l={sRGB:1,gAMA:4,cHRM:32,
pHYs:9}[a];(l!==void 0?r!==l:r>256)&&q("PNG metadata length")}}e=h}q("PNG truncated")}function Ts(c,t){(c[0]!==255||c[1]!==
216)&&q("JPEG signature");let e=2,i,s=!1,n=!1;for(;e<c.length;){if(n)for(;e<c.length&&c[e]!==255;)e++;for(c[e++]!==255&&
q("JPEG marker");c[e]===255;)e++;const o=c[e++];if(n&&(o===0||o>=208&&o<=215))continue;if(n=!1,o===217)return(!i||!s||e!==
c.length)&&q("JPEG end"),i;(o===void 0||o===0||o===216||o===1||o>=208&&o<=215||e+2>c.length)&&q("JPEG marker");const r=t.
getUint16(e),h=e+r;if((r<2||h>c.length)&&q("JPEG segment range"),[192,193,194].includes(o)){(i||s||r<11||c[e+2]!==8)&&q(
"JPEG frame");const a=c[e+7];(![1,3].includes(a)||r!==8+3*a)&&q("JPEG components"),i=fi(t.getUint16(e+5),t.getUint16(e+3))}else
o>=192&&o<=207&&![196].includes(o)&&q("JPEG frame type");o===218?((!i||r<6||r!==6+2*c[e+2])&&q("JPEG scan"),s=!0,n=!0):![
192,193,194,196,219,221,254].includes(o)&&!(o>=224&&o<=239)&&q("JPEG unsupported segment"),e=h}q("JPEG truncated")}function ss(c,t){
(!(c instanceof Uint8Array)||c.length<12||c.length>re.byteLength)&&q("encoded byte limit");const e=new DataView(c.buffer,
c.byteOffset,c.byteLength);if(t==="image/png")return{mimeType:t,...Is(c,e)};if(t==="image/jpeg")return{mimeType:t,...Ts(
c,e)};q("MIME type")}const gt=Object.freeze({byteLength:16*1024**2,jsonBytes:256*1024,vertices:1e5,triangles:15e4,coordinate:1e6}),
Es="model/gltf-binary",zs=new TextEncoder,Cs=new TextDecoder("utf-8",{fatal:!0}),D=c=>{throw new Error(`Invalid generate\
d mesh: ${c}`)};function at(c,t,e){return(!Number.isSafeInteger(c)||c<t||c>e)&&D("numeric limit"),c}function $(c,t){return(!c||
typeof c!="object"||Array.isArray(c)||Object.keys(c).some(e=>!t.includes(e)))&&D("unsupported GLB field"),c}function Ii(c,t,e=-gt.
coordinate,i=gt.coordinate){return(!Array.isArray(c)||c.length!==t||c.some(s=>!Number.isFinite(s)||s<e||s>i))&&D("invali\
d vector"),[...c]}function Ht(c){return(!Array.isArray(c)||c.length!==1)&&D("expected one static mesh"),c[0]}const mi=(c,t)=>JSON.
stringify(c)===JSON.stringify(t);function Rs(c,t=[],{allowTextures:e=!0}={}){var F,z,O,N,_;const i=new DataView(c.buffer,
c.byteOffset,c.byteLength);(i.getUint32(0,!0)!==1179937895||i.getUint32(4,!0)!==2||i.getUint32(8,!0)!==c.byteLength)&&D(
"GLB header");const s=i.getUint32(12,!0);(!s||s%4||s>gt.jsonBytes||20+s+8>c.byteLength||i.getUint32(16,!0)!==1313821514)&&
D("JSON chunk");let n;try{n=JSON.parse(Cs.decode(c.subarray(20,20+s)))}catch{D("JSON syntax")}const o=20+s,r=i.getUint32(
o,!0);(r%4||i.getUint32(o+4,!0)!==5130562||o+8+r!==c.byteLength)&&D("BIN chunk"),$(n,["asset","scene","scenes","nodes","\
meshes","buffers","bufferViews","accessors","materials","images","textures","samplers"]),$(n.asset,["version","generator"]),
(n.asset.version!=="2.0"||n.asset.generator!==void 0&&(typeof n.asset.generator!="string"||n.asset.generator.length>128))&&
D("asset version"),n.scene!==0&&D("scene");const h=$(Ht(n.scenes),["nodes"]);mi(h.nodes,[0])||D("scene nodes"),$(Ht(n.nodes),
["mesh"]).mesh!==0&&D("node mesh");const l=$(Ht(n.meshes),["primitives"]),u=$(Ht(l.primitives),["attributes","indices","\
mode","material"]);u.mode!==void 0&&u.mode!==4&&D("only triangles are supported"),$(u.attributes,["POSITION","NORMAL","C\
OLOR_0","TEXCOORD_0","TANGENT"]),!e&&(u.attributes.TEXCOORD_0!==void 0||u.attributes.TANGENT!==void 0||n.images!==void 0||
n.textures!==void 0||n.samplers!==void 0)&&D("textured profile requires a compatible peer"),Object.hasOwn(u.attributes,"\
POSITION")||D("missing positions");const d=$(Ht(n.buffers),["byteLength"]);at(d.byteLength,1,r),r-d.byteLength>3&&D("BIN\
 padding"),(!Array.isArray(n.bufferViews)||n.bufferViews.length<2||n.bufferViews.length>6+re.count||!Array.isArray(n.accessors)||
n.accessors.length<2||n.accessors.length>6)&&D("accessor count");const f=[];for(const w of n.bufferViews){$(w,["buffer",
"byteOffset","byteLength","target"]),(w.buffer!==0||w.target!==void 0&&![34962,34963].includes(w.target))&&D("buffer vie\
w");const I=at(w.byteOffset??0,0,d.byteLength),R=at(w.byteLength,1,d.byteLength-I);I%4&&D("buffer alignment"),f.some(([k,
v])=>I<v&&I+R>k)&&D("overlapping buffer views"),f.push([I,I+R])}const m=new Set,p=new Set;function A(w,I){at(w,0,n.accessors.
length-1),m.has(w)&&D("reused accessor"),m.add(w);const R=$(n.accessors[w],["bufferView","byteOffset","componentType","c\
ount","type","min","max"]);at(R.bufferView,0,n.bufferViews.length-1),p.has(R.bufferView)&&D("reused buffer view"),p.add(
R.bufferView);const k=I==="indices"?1:I==="uvs"?2:I==="tangents"||I==="colors"&&R.type==="VEC4"?4:3;(R.type!==(k===1?"SC\
ALAR":`VEC${k}`)||(I==="indices"?![5123,5125].includes(R.componentType):R.componentType!==5126))&&D("accessor format");const v=R.
componentType===5123?2:4,P=at(R.count,3,I==="indices"?gt.triangles*3:gt.vertices),Y=f[R.bufferView],L=at(R.byteOffset??0,
0,Y[1]-Y[0]);(L%v||L+P*k*v!==Y[1]-Y[0])&&D("accessor byte range");const G=new DataView(c.buffer,c.byteOffset+o+8+Y[0]+L,
P*k*v),B=R.componentType===5126?V=>G.getFloat32(V*4,!0):R.componentType===5125?V=>G.getUint32(V*4,!0):V=>G.getUint16(V*2,
!0);return{entry:R,count:P,components:k,get:B}}const x=A(u.attributes.POSITION,"positions"),y={min:[1/0,1/0,1/0],max:[-1/0,
-1/0,-1/0]};for(let w=0;w<x.count*3;w++){const I=x.get(w);(!Number.isFinite(I)||Math.abs(I)>gt.coordinate)&&D("nonfinite\
 or excessive position"),y.min[w%3]=Math.min(y.min[w%3],I),y.max[w%3]=Math.max(y.max[w%3],I)}for(const w of["min","max"])
mi(Ii(x.entry[w],3),y[w])||D("position bounds mismatch");y.min.every((w,I)=>w===y.max[I])&&D("empty geometry");for(const[
w,I]of[["NORMAL","normals"],["COLOR_0","colors"],["TEXCOORD_0","uvs"],["TANGENT","tangents"]]){if(!Object.hasOwn(u.attributes,
w))continue;const R=A(u.attributes[w],I);(R.count!==x.count||R.entry.min!==void 0||R.entry.max!==void 0)&&D("attribute c\
ount or bounds");for(let k=0;k<R.count*R.components;k++){const v=R.get(k);(!Number.isFinite(v)||v<(["colors","uvs"].includes(
I)?0:-1.001)||v>(["colors","uvs"].includes(I)?1:1.001))&&D("invalid attribute value")}if(I==="normals"||I==="tangents")for(let k=0;k<
R.count;k++){const v=k*R.components,P=Math.hypot(R.get(v),R.get(v+1),R.get(v+2));Math.abs(P-1)>.001&&D("normal or tangen\
t must be a unit vector"),I==="tangents"&&![-1,1].includes(R.get(v+3))&&D("tangent handedness")}}u.attributes.TANGENT!==
void 0&&u.attributes.NORMAL===void 0&&D("tangent requires normals");const g=A(u.indices,"indices");(g.count%3||g.entry.min!==
void 0||g.entry.max!==void 0)&&D("triangle indices");for(let w=0;w<g.count;w++){const I=g.get(w);I>=x.count&&D("index ou\
tside positions"),g.entry.componentType===5123&&I===65535&&D("primitive restart index")}const M=new Set,E=new Set,T=new Set;
function S(w,I=!1){$(w,I?["index","texCoord","scale"]:["index","texCoord"]),(!Array.isArray(n.textures)||w.texCoord!==void 0&&
w.texCoord!==0||u.attributes.TEXCOORD_0===void 0)&&D("texture coordinates"),at(w.index,0,n.textures.length-1),M.add(w.index),
I&&(u.attributes.NORMAL===void 0||w.scale!==void 0&&(!Number.isFinite(w.scale)||w.scale<0||w.scale>1))&&D("normal textur\
e")}if(n.materials!==void 0){const w=$(Ht(n.materials),["pbrMetallicRoughness","doubleSided","alphaMode","normalTexture"]);
w.doubleSided!==void 0&&typeof w.doubleSided!="boolean"&&D("material"),w.alphaMode!==void 0&&w.alphaMode!=="OPAQUE"&&D("\
material alpha");const I=$(w.pbrMetallicRoughness,["baseColorFactor","metallicFactor","roughnessFactor","baseColorTextur\
e","metallicRoughnessTexture"]);I.baseColorFactor!==void 0&&Ii(I.baseColorFactor,4,0,1);for(const R of["metallicFactor",
"roughnessFactor"])I[R]!==void 0&&(!Number.isFinite(I[R])||I[R]<0||I[R]>1)&&D("material factor");u.material!==0&&D("mate\
rial index");for(const R of["baseColorTexture","metallicRoughnessTexture"])I[R]!==void 0&&S(I[R]);w.normalTexture!==void 0&&
S(w.normalTexture,!0)}else u.material!==void 0&&D("missing material");for(const w of["textures","images","samplers"])n[w]!==
void 0&&(!Array.isArray(n[w])||n[w].length<1||n[w].length>re.count)&&D("texture table count");for(const w of n.textures??
[])$(w,["source","sampler"]),at(w.source,0,(((F=n.images)==null?void 0:F.length)??0)-1),E.add(w.source),w.sampler!==void 0&&
(at(w.sampler,0,(((z=n.samplers)==null?void 0:z.length)??0)-1),T.add(w.sampler));for(const w of n.samplers??[]){$(w,["ma\
gFilter","minFilter","wrapS","wrapT"]);for(const I of["magFilter","minFilter","wrapS","wrapT"])w[I]!==void 0&&!(I.startsWith(
"wrap")?[33071,33648,10497]:I==="magFilter"?[9728,9729]:[9728,9729,9984,9985,9986,9987]).includes(w[I])&&D("texture samp\
ler")}let b=0;for(const w of n.images??[]){$(w,["bufferView","mimeType"]),at(w.bufferView,0,n.bufferViews.length-1),(p.has(
w.bufferView)||n.bufferViews[w.bufferView].target!==void 0)&&D("image buffer view"),p.add(w.bufferView);const I=f[w.bufferView],
R=o+8,k=c.subarray(R+I[0],R+I[1]),v=ss(k,w.mimeType);b+=v.pixels,b>re.pixels&&D("texture pixel limit"),t.push({...v,data:k})}
return(M.size!==(((O=n.textures)==null?void 0:O.length)??0)||E.size!==(((N=n.images)==null?void 0:N.length)??0)||T.size!==
(((_=n.samplers)==null?void 0:_.length)??0))&&D("unused texture resource"),(m.size!==n.accessors.length||p.size!==n.bufferViews.
length)&&D("unused accessor"),{vertexCount:x.count,triangleCount:g.count/3,bounds:y}}function Fs(c,t={}){(!((c==null?void 0:
c.data)instanceof Uint8Array)||c.data.byteLength<32||c.data.byteLength>gt.byteLength)&&D("binary byte limit");const e=new Uint8Array(
c.data),i={format:"glb",mimeType:Es,byteLength:e.byteLength,sha256:xs(bs(e)),...Rs(e,[],t)};for(const s of Object.keys(i))
c[s]!==void 0&&!mi(c[s],i[s])&&D(`${s} mismatch`);return{...i,data:e}}function Os({positions:c,indices:t,normals:e,colors:i,
uvs:s,tangents:n,textures:o,roughness:r=1,metallic:h=0}){(!(c instanceof Float32Array)||c.length%3||!(t instanceof Uint16Array||
t instanceof Uint32Array)||t.length%3)&&D("geometry arrays");const a=at(c.length/3,3,gt.vertices);at(t.length/3,1,gt.triangles),
e!==void 0&&(!(e instanceof Float32Array)||e.length!==c.length)&&D("normal array"),i!==void 0&&(!(i instanceof Float32Array)||
![a*3,a*4].includes(i.length))&&D("color array"),s!==void 0&&(!(s instanceof Float32Array)||s.length!==a*2)&&D("UV array"),
n!==void 0&&(!(n instanceof Float32Array)||n.length!==a*4)&&D("tangent array"),o!==void 0&&$(o,["baseColor","normal","me\
tallicRoughness"]);const l={min:[1/0,1/0,1/0],max:[-1/0,-1/0,-1/0]};for(let z=0;z<c.length;z++)l.min[z%3]=Math.min(l.min[z%
3],c[z]),l.max[z%3]=Math.max(l.max[z%3],c[z]);const u=[],d=[],f=[],m={};let p=0;const A=(z,O,N,_={})=>{const w=d.length,
I=new Uint8Array(z.byteLength),R=new DataView(I.buffer);for(let k=0;k<z.length;k++)z instanceof Float32Array?R.setFloat32(
k*4,z[k],!0):z instanceof Uint32Array?R.setUint32(k*4,z[k],!0):R.setUint16(k*2,z[k],!0);return u.push({offset:p,data:I}),
f.push({buffer:0,byteOffset:p,byteLength:I.byteLength,target:N}),d.push({bufferView:w,componentType:z instanceof Float32Array?
5126:z instanceof Uint32Array?5125:5123,count:O==="SCALAR"?z.length:a,type:O,..._}),p+=Math.ceil(I.byteLength/4)*4,w};m.
POSITION=A(c,"VEC3",34962,l),e!==void 0&&(m.NORMAL=A(e,"VEC3",34962)),i!==void 0&&(m.COLOR_0=A(i,i.length===a*4?"VEC4":"\
VEC3",34962)),s!==void 0&&(m.TEXCOORD_0=A(s,"VEC2",34962)),n!==void 0&&(m.TANGENT=A(n,"VEC4",34962));const x=A(t,"SCALAR",
34963),y={pbrMetallicRoughness:{metallicFactor:h,roughnessFactor:r},doubleSided:!0},g=[],M=[];for(const z of["baseColor",
"normal","metallicRoughness"]){if((o==null?void 0:o[z])===void 0)continue;const O=$(o[z],["data","mimeType"]);ss(O.data,
O.mimeType);const N=g.length;g.push({bufferView:f.length,mimeType:O.mimeType}),M.push({source:N,sampler:0}),f.push({buffer:0,
byteOffset:p,byteLength:O.data.byteLength}),u.push({offset:p,data:O.data}),p+=Math.ceil(O.data.byteLength/4)*4,z==="norm\
al"?y.normalTexture={index:N}:y.pbrMetallicRoughness[`${z}Texture`]={index:N}}const E=zs.encode(JSON.stringify({asset:{version:"\
2.0",generator:"PeerCompute generated mesh"},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:m,
indices:x,mode:4,material:0}]}],materials:[y],buffers:[{byteLength:p}],bufferViews:f,accessors:d,...g.length?{images:g,textures:M,
samplers:[{magFilter:9729,minFilter:9729}]}:{}})),T=Math.ceil(E.byteLength/4)*4,S=28+T+p;(S>gt.byteLength||T>gt.jsonBytes)&&
D("encoded byte limit");const b=new Uint8Array(S),F=new DataView(b.buffer);F.setUint32(0,1179937895,!0),F.setUint32(4,2,
!0),F.setUint32(8,S,!0),F.setUint32(12,T,!0),F.setUint32(16,1313821514,!0),b.fill(32,20,20+T),b.set(E,20),F.setUint32(20+
T,p,!0),F.setUint32(24+T,5130562,!0);for(const z of u)b.set(z.data,28+T+z.offset);return Fs({data:b})}const ne=[{path:"u\
2netp.onnx",size:4574861,sha256:"309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8",source:{repository:"e\
dgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",path:"u2netp.onnx"}},{path:"u2netp.README.md",size:2597,
sha256:"e447db65818dba51c001c1a5c9fc43c56c5c60e5ed2cd858c2bad3a239847ef4",source:{repository:"edgetools/u2netp",revision:"\
25dee37ab19c5b6ad64ba6578eba63f1ae07720c",path:"README.md"}}],pi={spdx:"Apache-2.0",sourceUrl:"https://raw.githubusercon\
tent.com/xuebinqin/U-2-Net/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29/LICENSE",notice:`                                 Ap\
ache License
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
`},ns={spdx:"MIT",sourceUrl:"https://raw.githubusercontent.com/danielgatis/rembg/991927b77667946dab59c50df31f7d4640e8045\
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
`},rs=[{path:"weights.bin",size:2285308688,sha256:"0e5c23c8c502492c0b4432006ac30f2d11b2a4c102a3bf9f21c2fcf094ddbffd",source:{
repository:"BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",path:"weights.bin"}},{
path:"README.md",size:2706,sha256:"00cf8aee3adbf563b1593ab4c96af59ed47582466658fafd924e1349ab51751a",source:{repository:"\
BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",path:"README.md"}},{path:"LICENSE.\
md",size:11726,sha256:"9b60b9d0411f54d4087484ad4acf28ca6fd9f6a84c30ddacb04de2c623254749",source:{repository:"BasinShaper\
s/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",path:"LICENSE.md"}},{path:"NOTICE",size:1464,
sha256:"b9b71f7a22dc2529840a5a53f61022bff499994d15446d0506eb5591a3f90376",source:{repository:"BasinShapers/sf3d-webgpu-w\
eights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",path:"NOTICE"}},{path:"tets/vertices.bin",size:6430584,sha256:"\
16f4ee01a050d1757c19b13a7e1dbd4d0918d08208d961c105ff74cbfc345dac",source:{repository:"needle-tools/SF3D-webgpu",revision:"\
56d2f58d27395b0be9c633671b439b4aac482549",path:"tets_vertices.bin"}},{path:"tets/indices.bin",size:47543232,sha256:"606c\
c8b47f8744a64ff6f1f3c088d9d9113ff80539bd62cb1651f8dc629d1f1e",source:{repository:"needle-tools/SF3D-webgpu",revision:"56\
d2f58d27395b0be9c633671b439b4aac482549",path:"tets_indices.bin"}}],Ti={spdx:"LicenseRef-Stability-AI-Community",sourceUrl:"\
https://huggingface.co/BasinShapers/sf3d-webgpu-weights/blob/53cfd8926e0abe77443b97d8684da1ea36bc4af7/LICENSE.md",notice:`\
STABILITY AI COMMUNITY LICENSE AGREEMENT
Last Updated: July 5, 2024


I. INTRODUCTION

This Agreement applies to any individual person or entity ("You", "Your" or "Licensee") that uses or distributes any por\
tion or element of the Stability AI Materials  or Derivative Works thereof for any Research & Non-Commercial or Commerci\
al purpose. Capitalized terms not otherwise defined herein are defined in Section V below.


This Agreement is intended to allow research, non-commercial, and limited commercial uses of the Models free of charge. \
In order to ensure that certain limited commercial uses of the Models continue to be allowed, this Agreement  preserves \
free access to the Models for people or organizations  generating annual revenue of less than US $1,000,000 (or local cu\
rrency equivalent).  


By clicking "I Accept"  or by using or distributing or using any portion or element of the Stability Materials or Deriva\
tive Works, You agree that You have read, understood and are bound by the terms of this Agreement. If You are acting on \
behalf of a company, organization or other entity, then "You" includes you and that entity, and You agree that You: (i) \
are an authorized representative of such entity with the authority to bind such entity to this Agreement, and (ii) You a\
gree to the terms of this Agreement on that entity's behalf. 

II. RESEARCH & NON-COMMERCIAL USE LICENSE

Subject to the terms of this Agreement, Stability AI grants You a non-exclusive, worldwide, non-transferable, non-sublic\
ensable, revocable and royalty-free limited license under Stability AI's intellectual property or other rights owned by \
Stability AI embodied in the Stability AI Materials to use, reproduce, distribute, and create Derivative Works of, and m\
ake modifications to, the Stability AI Materials for any Research or Non-Commercial Purpose. "Research Purpose" means ac\
ademic or scientific advancement, and in each case, is not primarily intended for commercial advantage or monetary compe\
nsation to You or others. "Non-Commercial Purpose" means any purpose other than a Research Purpose that is not primarily\
 intended for commercial advantage or monetary compensation to You or others, such as personal use (i.e., hobbyist) or e\
valuation and testing.  

III. COMMERCIAL USE LICENSE

Subject to the terms of this Agreement (including the remainder of this Section III), Stability AI grants You a non-excl\
usive, worldwide, non-transferable, non-sublicensable, revocable and royalty-free limited license under Stability AI's i\
ntellectual property or other rights owned by Stability AI embodied in the Stability AI Materials to use, reproduce, dis\
tribute, and create Derivative Works of, and make modifications to, the Stability AI Materials for any Commercial Purpos\
e. "Commercial Purpose" means any purpose other than a Research Purpose or Non-Commercial Purpose that is primarily inte\
nded for commercial advantage or monetary compensation to You or others, including but not limited to, (i) creating, mod\
ifying, or distributing Your product or service, including via a hosted service or application programming interface, an\
d (ii) for Your business's or organization's internal operations. 
If You are using or distributing the Stability AI Materials for a Commercial Purpose, You must register with Stability A\
I at (https://stability.ai/community-license). If at any time You or Your Affiliate(s), either individually or in aggreg\
ate, generate more than USD $1,000,000 in annual revenue (or the equivalent thereof in Your local currency), regardless \
of whether that revenue is generated directly or indirectly from the Stability AI Materials or Derivative Works, any lic\
enses granted to You under this Agreement shall terminate as of such date. You must request a license from Stability AI \
at (https://stability.ai/enterprise) , which Stability AI may grant to You in its sole discretion. If you receive Stabil\
ity AI Materials, or any Derivative Works thereof, from a Licensee as part of an integrated end user product, then Secti\
on III of this Agreement will not apply to you.

IV. GENERAL TERMS

Your Research, Non-Commercial, and Commercial License(s) under this Agreement are subject to the following terms.
a.  Distribution & Attribution. If You distribute or make available the Stability AI Materials or a Derivative Work to a\
 third party, or a product or service that uses any portion of them, You shall: (i) provide a copy of this Agreement to \
that third party, (ii) retain the following attribution notice within a "Notice" text file distributed as a part of such\
 copies: "This Stability AI Model is licensed under the Stability AI Community License, Copyright ©  Stability AI Ltd. A\
ll Rights Reserved", and (iii) prominently display "Powered by Stability AI" on a related website, user interface, blogp\
ost, about page, or product documentation.  If You create a Derivative Work, You may add your own attribution notice(s) \
to the "Notice" text file included with that Derivative Work, provided that You clearly indicate which attributions appl\
y to the Stability AI Materials and state in the "Notice" text file that You changed the Stability AI Materials and how \
it was modified.
b.  Use Restrictions. Your use of the Stability AI Materials and Derivative Works, including any output or results of th\
e Stability AI Materials or Derivative Works, must comply with applicable laws and regulations (including Trade Control \
Laws and equivalent regulations) and adhere to the Documentation and Stability AI's AUP, which is hereby incorporated by\
 reference. Furthermore, You will not use the Stability AI Materials or Derivative Works, or any output or results of th\
e Stability AI Materials or Derivative Works, to create or improve any foundational generative AI model (excluding the M\
odels or Derivative Works). 
c.  Intellectual Property. 
(i) Trademark License.  No trademark licenses are granted under this Agreement, and in connection with the Stability AI \
Materials or Derivative Works, You may not use any name or mark owned by or associated with Stability AI or any of its A\
ffiliates, except as required under Section IV(a) herein.
(ii)  Ownership of Derivative Works.  As between You and Stability AI, You are the owner of Derivative Works You create,\
 subject to Stability AI's ownership of the Stability AI Materials and any Derivative Works made by or for Stability AI.\

(iii)  Ownership of Outputs. As between You and Stability AI, You own any outputs generated from the Models or Derivativ\
e Works to the extent permitted by applicable law. 
(iv)  Disputes.  If You or Your Affiliate(s) institute litigation or other proceedings against Stability AI (including a\
 cross-claim or counterclaim in a lawsuit) alleging that the Stability AI Materials, Derivative Works or associated outp\
uts or results, or any portion of any of the foregoing, constitutes infringement of intellectual property or other right\
s owned or licensable by You, then any licenses granted to You under this Agreement shall terminate as of the date such \
litigation or claim is filed or instituted. You will indemnify and hold harmless Stability AI from and against any claim\
 by any third party arising out of or related to Your use or distribution of the Stability AI Materials or Derivative Wo\
rks in violation of this Agreement.
(v)  Feedback.  From time to time, You may provide Stability AI with verbal and/or written suggestions, comments or othe\
r feedback related to Stability AI's existing or prospective technology, products or services (collectively, "Feedback")\
. You are not obligated to provide Stability AI with Feedback, but to the extent that You do, You hereby grant Stability\
 AI a perpetual, irrevocable, royalty-free, fully-paid, sub-licensable, transferable, non-exclusive, worldwide right and\
 license to exploit the Feedback in any manner without restriction. Your Feedback is provided "AS IS" and You make no wa\
rranties whatsoever about any Feedback.
d.  Disclaimer Of Warranty. UNLESS REQUIRED BY APPLICABLE LAW, THE STABILITY AI MATERIALS AND ANY OUTPUT AND RESULTS THE\
REFROM ARE PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT L\
IMITATION, ANY WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE. YOU ARE SOLE\
LY RESPONSIBLE FOR DETERMINING THE APPROPRIATENESS OR LAWFULNESS OF USING OR REDISTRIBUTING THE STABILITY AI MATERIALS, \
DERIVATIVE WORKS OR ANY OUTPUT OR RESULTS AND ASSUME ANY RISKS ASSOCIATED WITH YOUR USE OF THE STABILITY AI MATERIALS, D\
ERIVATIVE WORKS AND ANY OUTPUT AND RESULTS.
e.  Limitation Of Liability. IN NO EVENT WILL STABILITY AI OR ITS AFFILIATES BE LIABLE UNDER ANY THEORY OF LIABILITY, WH\
ETHER IN CONTRACT, TORT, NEGLIGENCE, PRODUCTS LIABILITY, OR OTHERWISE, ARISING OUT OF THIS AGREEMENT, FOR ANY LOST PROFI\
TS OR ANY DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL, EXEMPLARY OR PUNITIVE DAMAGES, EVEN IF STABILITY AI OR I\
TS AFFILIATES HAVE BEEN ADVISED OF THE POSSIBILITY OF ANY OF THE FOREGOING.
f.  Term And Termination. The term of this Agreement will commence upon Your acceptance of this Agreement or access to t\
he Stability AI Materials and will continue in full force and effect until terminated in accordance with the terms and c\
onditions herein. Stability AI may terminate this Agreement if You are in breach of any term or condition of this Agreem\
ent. Upon termination of this Agreement, You shall delete and cease use of any Stability AI Materials or Derivative Work\
s. Section IV(d), (e), and (g) shall survive the termination of this Agreement.
g.  Governing Law.  This Agreement will be governed by and constructed in accordance with the laws of the United States \
and the State of California without regard to choice of law principles, and the UN Convention on Contracts for Internati\
onal Sale of Goods does not apply to this Agreement.

V. DEFINITIONS 

"Affiliate(s)" means any entity that directly or indirectly controls, is controlled by, or is under common control with \
the subject entity; for purposes of this definition, "control" means direct or indirect ownership or control of more tha\
n 50% of the voting interests of the subject entity.
"Agreement" means this Stability AI Community License Agreement.
"AUP" means the Stability AI Acceptable Use Policy available at https://stability.ai/use-policy, as may be updated from \
time to time.
"Derivative Work(s)" means (a) any derivative work of the Stability AI Materials as recognized by U.S. copyright laws an\
d (b) any modifications to a Model, and any other model created which is based on or derived from the Model or the Model\
's output, including"fine tune" and "low-rank adaptation" models derived from a Model or a Model's output, but do not in\
clude the output of any Model.
"Documentation" means any specifications, manuals, documentation, and other written information provided by Stability AI\
 related to the Software or Models.
"Model(s)" means, collectively, Stability AI's proprietary models and algorithms, including machine-learning models, tra\
ined model weights and other elements of the foregoing listed on Stability's Core Models Webpage available at, https://s\
tability.ai/core-models, as may be updated from time to time.
"Stability AI" or "we" means Stability AI Ltd. and its Affiliates.
"Software" means Stability AI's proprietary software made available under this Agreement now or in the future.
"Stability AI Materials" means, collectively, Stability's proprietary Models, Software and Documentation (and any portio\
n or combination thereof) made available under this Agreement. 
"Trade Control Laws" means any applicable U.S. and non-U.S. export control and trade sanctions laws and regulations.`},Gt={
id:"stable-fast-3d-webgpu",name:"Stable Fast 3D · textured meshes (WebGPU)",description:"Image to textured 3D meshes, U\
Vs and material estimates. Powered by Stability AI. FP16 stored weights execute FP32 GPU math. Static geometry; no riggi\
ng or animation.",repository:"BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",format:"\
SF3D",pipeline:"sf3d",architecture:"sf3d",dtype:"fp16",status:"tested",model:{runtime:"webgpu-sf3d",runtimeVersion:"0.1.\
60",task:"image-to-3d",format:"SF3D",pipeline:"sf3d",architecture:"sf3d",dtype:"fp16",computeDtype:"fp32",modalities:["i\
mage"],outputModalities:["mesh"],requiredFeatures:[],repository:"BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0\
abe77443b97d8684da1ea36bc4af7",kernelRevision:"86b7b68109434ffc33218f5fb697c7057c2518f9",imageSize:512,textureSize:1024,
foregroundRatio:.85,backgroundRemoval:"u2netp"},capabilities:{pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"tested",executionReason:"Tested in a managed browser worker on NVIDIA 16 GiB: opaque/cutout images, rep\
eated local and encrypted peer generation, cancellation, retained reload and browser restart. CubeChat textured props an\
d avatars verified. Static meshes; no shader-f16 requirement. Other devices are unqualified.",import:!0},provenance:{repository:"\
BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",format:"SF3D",metadataCheckedAt:"2\
026-11-11",originalModel:"stabilityai/stable-fast-3d",modelCardUrl:"https://huggingface.co/BasinShapers/sf3d-webgpu-weig\
hts/blob/53cfd8926e0abe77443b97d8684da1ea36bc4af7/README.md",kernelRepository:"https://github.com/lyonsno/sf3d-webgpu",kernelRevision:"\
86b7b68109434ffc33218f5fb697c7057c2518f9",gridRepository:"needle-tools/SF3D-webgpu",gridRevision:"56d2f58d27395b0be9c633\
671b439b4aac482549"}};Gt.files=[...rs,...ne];Gt.totalBytes=Gt.files.reduce((c,t)=>c+t.size,0);Gt.weightBytes=rs[0].size+
ne[0].size;Gt.license={spdx:"LicenseRef-Stability-AI-Community AND Apache-2.0",sourceUrl:Ti.sourceUrl,notice:"Powered by\
 Stability AI. Full model license and derivative notice are included. U2Net foreground weights use Apache-2.0.",components:[
{...Ti,derivativeNotice:`This Stability AI Model is licensed under the Stability AI Community License, Copyright © Stabi\
lity AI Ltd. All Rights Reserved

Powered by Stability AI.

Stable Fast 3D originates with Stability AI. The WebGPU port is from
lyonsno/sf3d-webgpu, commit 86b7b68109434ffc33218f5fb697c7057c2518f9.

PeerCompute changed the port's asset loading, worker ownership, raw-image and
texture encoding interfaces, cancellation checks, and allocation cleanup.
The authored bounded artifact adapter streams the same checkpoint tensors and
retains the original WGSL kernels. The model weights themselves are unchanged.
See README.md for the exact integration changes and LICENSE.md for the license.
`},pi,ns,{spdx:"MIT AND BSD-3-Clause",sourceUrl:"https://www.npmjs.com/package/@kaminos/webgpu-inference-kit/v/0.1.60",notice:`\
MIT License

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
`}]};function os(c){return c&&typeof c=="object"&&!Object.isFrozen(c)&&(Object.values(c).forEach(os),Object.freeze(c)),c}
const _s=os({[Gt.id]:Gt});function Pe(c){return c&&typeof c=="object"&&!Object.isFrozen(c)&&(Object.values(c).forEach(Pe),
Object.freeze(c)),c}const as=Pe({"triposr-q8-onnx":{id:"triposr-q8-onnx",name:"TripoSR · image to 3D (Q8)",repository:"\
cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",format:"ONNX",status:"tested",pipeline:"tri\
posr",architecture:"triposr",dtype:"q8",files:[{path:"triplane_q8.onnx",size:885712,sha256:"7721f5a45e79e02de8c6e909c21f\
b8e922fd0b594038a8fc1cfefa42c79ad6d5",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a\
239fcf7d8880a",path:"triplane_q8.onnx"}},{path:"triplane_q8.onnx.data",size:483785728,sha256:"50bf9b1c1218dc2c7fb6051d0d\
2cb7a48a1c5f75cc86e67a9d0e09a931298e35",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d\
6a239fcf7d8880a",path:"triplane_q8.onnx.data"}},{path:"decoder.onnx",size:173796,sha256:"6ff43581f1d2b46aa61764c2729a8d3\
3985b51cb6c8088cf36ffee3fd70355eb",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239\
fcf7d8880a",path:"decoder.onnx"}},{path:"README.md",size:3633,sha256:"179a47df133504635c15498b74a7a700f80ed3d43aa12c864a\
d58539fc667a78",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"R\
EADME.md"}}],license:{spdx:"MIT",sourceUrl:"https://github.com/VAST-AI-Research/TripoSR/blob/107cefdc244c39106fa83035902\
4f6a2f1c78871/LICENSE",notice:`MIT License

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
weightBytes:484845236,totalBytes:484848869}}),Ns=Pe(Object.values(as)),It=as["triposr-q8-onnx"],ks=Pe({"triposr-q8-onnx":{
...It,model:{...It.model,backgroundRemoval:"u2netp"},files:[...It.files,...ne],weightBytes:It.weightBytes+ne[0].size,totalBytes:It.
totalBytes+ne.reduce((c,t)=>c+t.size,0),license:{spdx:"MIT AND Apache-2.0",sourceUrl:It.license.sourceUrl,notice:"TripoS\
R © 2024 Tripo AI & Stability AI (MIT). U²-Net weights: Apache-2.0; rembg distribution © 2020 Daniel Gatis (MIT). Full o\
riginal license texts are retained in this package.",components:[It.license,pi,ns]},provenance:{...It.provenance,foreground:{
repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",sourceUrl:"https://github.com/danielga\
tis/rembg/releases/download/v0.0.0/u2netp.onnx",modelCardUrl:"https://huggingface.co/edgetools/u2netp/blob/25dee37ab19c5\
b6ad64ba6578eba63f1ae07720c/README.md",sha256:ne[0].sha256,licenseUrl:pi.sourceUrl}},capabilities:{...It.capabilities,executionStatus:"\
tested",executionReason:"Tested in the managed WebGPU worker: actual CubeChat owner chat through peer Qwen and DreamShap\
er to U2NetP foreground removal and TripoSR. Both CubeChat peers displayed the same isolated chair CID; owner reload res\
tored it without regeneration. Static, coarse geometry; no rigging or animation. No shader-f16 required.",executionEvidence:{
checkedAt:"2026-11-11",scope:"Actual owner chat, peer language/image/3D inference, two CubeChat pages and retained objec\
t reload",shaderF16Required:!1,foregroundModel:"u2netp",input:"Opaque DreamShaper 512x512 RGBA chair",meshSha256:"277a96\
3c5b9b66361f7ef7e43deea2fc5e90b770f5897def6b58ea83f186ae16",meshBytes:883820,triangles:7356,peerExecution:"tested",peerProtocol:"\
/peercompute/inference/5.0.0",cubeChat:{pages:2,sameArtifactCid:!0,renderedOnBothPages:!0,ownerReloadWithoutGeneration:!0,
unpinnedObserverCacheCollected:!0}}}},..._s}),Ds="1.31.1",qe=1024**3,Ei=Object.freeze({maxModelBytes:qe,minimumCpuBytes:4*
qe,minimumGpuBytes:3*qe}),hs=(c,t)=>c===t||c&&t&&typeof c=="object"&&typeof t=="object"&&Array.isArray(c)===Array.isArray(
t)&&Object.keys(c).length===Object.keys(t).length&&Object.keys(c).every(e=>hs(c[e],t[e]));function gi(c){const t=ws(c),e=t.
model,i=[...Object.values(ks),...Ns].find(n=>n.model.runtime==="onnx-mesh"&&hs(n.model,e));if(!i||t.files.length!==i.files.
length||i.files.some(n=>!t.files.some(o=>o.path===n.path&&o.size===n.size&&o.sha256===n.sha256)))throw new Error("3D mod\
el package differs from its qualified runtime catalog");const s=t.files.reduce((n,o)=>n+o.size,0);if(!Number.isSafeInteger(
s)||s>Ei.maxModelBytes)throw new Error("3D model package exceeds its byte budget");return{manifest:t,trusted:i,totalBytes:s,
resourcePolicy:Ei}}function cs(c,t){var i,s;if(gi(t),c.task!=null&&c.task!=="image-to-3d")throw new Error("This model ge\
nerates 3D objects from images");if(c.audio!=null)throw new Error("3D generation does not accept audio");const e=As(c.image);
if(!e)throw new Error("3D generation requires an image of one object");if((i=c.prompt)!=null&&i.trim()||(s=c.messages)!=
null&&s.length)throw new Error("TripoSR requires image input; generate an image from text first");return{task:"image-to-\
3d",image:e}}function vs(c,t=(e=>(e=globalThis.location)==null?void 0:e.href)()){if(!c||Object.keys(c).some(n=>!["mjs","\
wasm"].includes(n)))throw new Error("Unexpected 3D runtime assets");const i=new URL(t),s={};for(const n of["mjs","wasm"]){
if(typeof c[n]!="string")throw new Error("Trusted 3D runtime assets are required");const o=new URL(c[n],i);if(o.origin!==
i.origin||o.username||o.password||o.search||o.hash||!["http:","https:"].includes(o.protocol)||!new RegExp(`(?:^|/)ort-wa\
sm-simd-threaded\\.asyncify(?:-[A-Za-z0-9_-]+)?\\.${n}$`).test(o.pathname))throw new Error("3D runtime requires fixed sa\
me-origin ORT asyncify assets");s[n]=o.href}return s}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ls="182",yi=0,Bs=1,zi=1,Ci=100,Ri=204,Fi=205,Oi=3,Ls=0,us=300,_i=1e3,xe=1001,Ni=1002,Us=1006,Ps=1008,Ws=1009,Ys=1015,
Vs=1023,ds="",pt="srgb",ki="srgb-linear",Di="linear",Ge="srgb",jt=7680,vi=519,Bi=35044,be=35048,we=2e3,Li=2001;function qs(c){
for(let t=c.length-1;t>=0;--t)if(c[t]>=65535)return!0;return!1}function Ui(c){return document.createElementNS("http://ww\
w.w3.org/1999/xhtml",c)}const Pi={};function et(...c){const t="THREE."+c.shift();console.warn(t,...c)}function Yt(...c){
const t="THREE."+c.shift();console.error(t,...c)}function Wi(...c){const t=c.join(" ");t in Pi||(Pi[t]=!0,et(...c))}class We{addEventListener(t,e){
this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].
push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){
const i=this._listeners;if(i===void 0)return;const s=i[t];if(s!==void 0){const n=s.indexOf(e);n!==-1&&s.splice(n,1)}}dispatchEvent(t){
const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let n=0,
o=s.length;n<o;n++)s[n].call(this,t);t.target=null}}}const Q=["00","01","02","03","04","05","06","07","08","09","0a","0b",
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
"fc","fd","fe","ff"];function fe(){const c=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|
0,i=Math.random()*4294967295|0;return(Q[c&255]+Q[c>>8&255]+Q[c>>16&255]+Q[c>>24&255]+"-"+Q[t&255]+Q[t>>8&255]+"-"+Q[t>>16&
15|64]+Q[t>>24&255]+"-"+Q[e&63|128]+Q[e>>8&255]+"-"+Q[e>>16&255]+Q[e>>24&255]+Q[i&255]+Q[i>>8&255]+Q[i>>16&255]+Q[i>>24&
255]).toLowerCase()}function U(c,t,e){return Math.max(t,Math.min(e,c))}function Gs(c,t){return(c%t+t)%t}function He(c,t,e){
return(1-e)*c+e*t}function ae(c,t){switch(t.constructor){case Float32Array:return c;case Uint32Array:return c/4294967295;case Uint16Array:
return c/65535;case Uint8Array:return c/255;case Int32Array:return Math.max(c/2147483647,-1);case Int16Array:return Math.
max(c/32767,-1);case Int8Array:return Math.max(c/127,-1);default:throw new Error("Invalid component type.")}}function st(c,t){
switch(t.constructor){case Float32Array:return c;case Uint32Array:return Math.round(c*4294967295);case Uint16Array:return Math.
round(c*65535);case Uint8Array:return Math.round(c*255);case Int32Array:return Math.round(c*2147483647);case Int16Array:
return Math.round(c*32767);case Int8Array:return Math.round(c*127);default:throw new Error("Invalid component type.")}}class xt{constructor(t=0,e=0){
xt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){
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
x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=U(this.x,t.x,e.x),this.y=U(this.y,t.y,e.
y),this}clampScalar(t,e){return this.x=U(this.x,t,e),this.y=U(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.
divideScalar(i||1).multiplyScalar(U(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){
return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(
this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.
x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*
this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.
abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){
const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(U(i,-1,
1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*
e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(
t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,
this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],
this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(
e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),n=this.x-t.x,o=this.y-t.y;return this.x=n*i-o*s+t.x,this.y=n*
s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.
y}}class me{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,n,o,r){
let h=i[s+0],a=i[s+1],l=i[s+2],u=i[s+3],d=n[o+0],f=n[o+1],m=n[o+2],p=n[o+3];if(r<=0){t[e+0]=h,t[e+1]=a,t[e+2]=l,t[e+3]=u;
return}if(r>=1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=p;return}if(u!==p||h!==d||a!==f||l!==m){let A=h*d+a*f+l*m+u*p;A<0&&(d=
-d,f=-f,m=-m,p=-p,A=-A);let x=1-r;if(A<.9995){const y=Math.acos(A),g=Math.sin(y);x=Math.sin(x*y)/g,r=Math.sin(r*y)/g,h=h*
x+d*r,a=a*x+f*r,l=l*x+m*r,u=u*x+p*r}else{h=h*x+d*r,a=a*x+f*r,l=l*x+m*r,u=u*x+p*r;const y=1/Math.sqrt(h*h+a*a+l*l+u*u);h*=
y,a*=y,l*=y,u*=y}}t[e]=h,t[e+1]=a,t[e+2]=l,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,n,o){const r=i[s],h=i[s+1],a=i[s+
2],l=i[s+3],u=n[o],d=n[o+1],f=n[o+2],m=n[o+3];return t[e]=r*m+l*u+h*f-a*d,t[e+1]=h*m+l*d+a*u-r*f,t[e+2]=a*m+l*f+r*d-h*u,
t[e+3]=l*m-r*u-h*d-a*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){
this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this.
_w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),
this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=
t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,n=t._z,o=t._order,r=Math.cos,h=Math.
sin,a=r(i/2),l=r(s/2),u=r(n/2),d=h(i/2),f=h(s/2),m=h(n/2);switch(o){case"XYZ":this._x=d*l*u+a*f*m,this._y=a*f*u-d*l*m,this.
_z=a*l*m+d*f*u,this._w=a*l*u-d*f*m;break;case"YXZ":this._x=d*l*u+a*f*m,this._y=a*f*u-d*l*m,this._z=a*l*m-d*f*u,this._w=a*
l*u+d*f*m;break;case"ZXY":this._x=d*l*u-a*f*m,this._y=a*f*u+d*l*m,this._z=a*l*m+d*f*u,this._w=a*l*u-d*f*m;break;case"ZYX":
this._x=d*l*u-a*f*m,this._y=a*f*u+d*l*m,this._z=a*l*m-d*f*u,this._w=a*l*u+d*f*m;break;case"YZX":this._x=d*l*u+a*f*m,this.
_y=a*f*u+d*l*m,this._z=a*l*m-d*f*u,this._w=a*l*u-d*f*m;break;case"XZY":this._x=d*l*u-a*f*m,this._y=a*f*u-d*l*m,this._z=a*
l*m+d*f*u,this._w=a*l*u+d*f*m;break;default:et("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===
!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this.
_z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],n=e[8],
o=e[1],r=e[5],h=e[9],a=e[2],l=e[6],u=e[10],d=i+r+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(l-h)*f,this.
_y=(n-a)*f,this._z=(o-s)*f}else if(i>r&&i>u){const f=2*Math.sqrt(1+i-r-u);this._w=(l-h)/f,this._x=.25*f,this._y=(s+o)/f,
this._z=(n+a)/f}else if(r>u){const f=2*Math.sqrt(1+r-i-u);this._w=(n-a)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(h+l)/f}else{
const f=2*Math.sqrt(1+u-i-r);this._w=(o-s)/f,this._x=(n+a)/f,this._y=(h+l)/f,this._z=.25*f}return this._onChangeCallback(),
this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this.
_z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=
t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(U(this.dot(t),-1,1)))}rotateTowards(t,e){
const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.
set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),
this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+
this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){
let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this.
_z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){
return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,n=t._z,o=t._w,r=e._x,h=e._y,a=e._z,
l=e._w;return this._x=i*l+o*r+s*a-n*h,this._y=s*l+o*h+n*r-i*a,this._z=n*l+o*a+i*h-s*r,this._w=o*l-i*r-s*h-n*a,this._onChangeCallback(),
this}slerp(t,e){if(e<=0)return this;if(e>=1)return this.copy(t);let i=t._x,s=t._y,n=t._z,o=t._w,r=this.dot(t);r<0&&(i=-i,
s=-s,n=-n,o=-o,r=-r);let h=1-e;if(r<.9995){const a=Math.acos(r),l=Math.sin(a);h=Math.sin(h*a)/l,e=Math.sin(e*a)/l,this._x=
this._x*h+i*e,this._y=this._y*h+s*e,this._z=this._z*h+n*e,this._w=this._w*h+o*e,this._onChangeCallback()}else this._x=this.
_x*h+i*e,this._y=this._y*h+s*e,this._z=this._z*h+n*e,this._w=this._w*h+o*e,this.normalize();return this}slerpQuaternions(t,e,i){
return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.
sqrt(1-i),n=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),n*Math.sin(e),n*Math.cos(e))}equals(t){return t._x===
this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+
2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+
3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this.
_onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.
iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,i=0){C.prototype.isVector3=
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
x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Yi.setFromEuler(t))}applyAxisAngle(t,e){
return this.applyQuaternion(Yi.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,n=t.elements;return this.
x=n[0]*e+n[3]*i+n[6]*s,this.y=n[1]*e+n[4]*i+n[7]*s,this.z=n[2]*e+n[5]*i+n[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(
t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,n=t.elements,o=1/(n[3]*e+n[7]*i+n[11]*s+n[15]);return this.
x=(n[0]*e+n[4]*i+n[8]*s+n[12])*o,this.y=(n[1]*e+n[5]*i+n[9]*s+n[13])*o,this.z=(n[2]*e+n[6]*i+n[10]*s+n[14])*o,this}applyQuaternion(t){
const e=this.x,i=this.y,s=this.z,n=t.x,o=t.y,r=t.z,h=t.w,a=2*(o*s-r*i),l=2*(r*e-n*s),u=2*(n*i-o*e);return this.x=e+h*a+o*
u-r*l,this.y=i+h*l+r*a-n*u,this.z=s+h*u+n*l-o*a,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(
t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){
const e=this.x,i=this.y,s=this.z,n=t.elements;return this.x=n[0]*e+n[4]*i+n[8]*s,this.y=n[1]*e+n[5]*i+n[9]*s,this.z=n[2]*
e+n[6]*i+n[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.
multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){
return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=
U(this.x,t.x,e.x),this.y=U(this.y,t.y,e.y),this.z=U(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=U(this.x,t,e),this.
y=U(this.y,t,e),this.z=U(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(
U(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.
x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.
y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.
y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*
t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.
x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.
divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.
x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-
t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,n=t.z,o=e.
x,r=e.y,h=e.z;return this.x=s*h-n*r,this.y=n*o-i*h,this.z=i*r-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)
return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return je.copy(this).
projectOnVector(t),this.sub(je)}reflect(t){return this.sub(je.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.
sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(U(i,-1,1))}distanceTo(t){
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
cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const je=new C,Yi=new me;
class Lt{constructor(t,e,i,s,n,o,r,h,a){Lt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(
t,e,i,s,n,o,r,h,a)}set(t,e,i,s,n,o,r,h,a){const l=this.elements;return l[0]=t,l[1]=s,l[2]=r,l[3]=e,l[4]=n,l[5]=h,l[6]=i,
l[7]=o,l[8]=a,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=
i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(
this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.
set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){
return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,n=this.elements,o=i[0],r=i[3],
h=i[6],a=i[1],l=i[4],u=i[7],d=i[2],f=i[5],m=i[8],p=s[0],A=s[3],x=s[6],y=s[1],g=s[4],M=s[7],E=s[2],T=s[5],S=s[8];return n[0]=
o*p+r*y+h*E,n[3]=o*A+r*g+h*T,n[6]=o*x+r*M+h*S,n[1]=a*p+l*y+u*E,n[4]=a*A+l*g+u*T,n[7]=a*x+l*M+u*S,n[2]=d*p+f*y+m*E,n[5]=d*
A+f*g+m*T,n[8]=d*x+f*M+m*S,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=
t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],n=t[3],o=t[4],r=t[5],h=t[6],a=t[7],
l=t[8];return e*o*l-e*r*a-i*n*l+i*r*h+s*n*a-s*o*h}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],n=t[3],o=t[4],r=t[5],
h=t[6],a=t[7],l=t[8],u=l*o-r*a,d=r*h-l*n,f=a*n-o*h,m=e*u+i*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const p=1/m;
return t[0]=u*p,t[1]=(s*a-l*i)*p,t[2]=(r*i-s*o)*p,t[3]=d*p,t[4]=(l*e-s*h)*p,t[5]=(s*n-r*e)*p,t[6]=f*p,t[7]=(i*h-a*e)*p,t[8]=
(o*e-i*n)*p,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=
e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.
elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,n,o,r){
const h=Math.cos(n),a=Math.sin(n);return this.set(i*h,i*a,-i*(h*o+a*r)+o+t,-s*a,s*h,-s*(-a*o+h*r)+r+e,0,0,1),this}scale(t,e){
return this.premultiply(Xe.makeScale(t,e)),this}rotate(t){return this.premultiply(Xe.makeRotation(-t)),this}translate(t,e){
return this.premultiply(Xe.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,
0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,
1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<
9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){
const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],
t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Xe=new Lt,Vi=new Lt().set(.4123908,.3575843,
.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),qi=new Lt().set(3.2409699,-1.5373832,-.4986108,-.9692436,
1.8759675,.0415551,.0556301,-.203977,1.0569715);function Hs(){const c={enabled:!0,workingColorSpace:ki,spaces:{},convert:function(s,n,o){
return this.enabled===!1||n===o||!n||!o||(this.spaces[n].transfer===Ge&&(s.r=Ot(s.r),s.g=Ot(s.g),s.b=Ot(s.b)),this.spaces[n].
primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[n].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.
spaces[o].transfer===Ge&&(s.r=oe(s.r),s.g=oe(s.g),s.b=oe(s.b))),s},workingToColorSpace:function(s,n){return this.convert(
s,this.workingColorSpace,n)},colorSpaceToWorking:function(s,n){return this.convert(s,n,this.workingColorSpace)},getPrimaries:function(s){
return this.spaces[s].primaries},getTransfer:function(s){return s===ds?Di:this.spaces[s].transfer},getToneMappingMode:function(s){
return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,n=this.workingColorSpace){
return s.fromArray(this.spaces[n].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,n,o){
return s.copy(this.spaces[n].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.
spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.
spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,n){return Wi("ColorManagement: .fro\
mWorkingColorSpace() has been renamed to .workingToColorSpace()."),c.workingToColorSpace(s,n)},toWorkingColorSpace:function(s,n){
return Wi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),c.colorSpaceToWorking(s,
n)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return c.define({[ki]:{primaries:t,whitePoint:i,transfer:Di,
toXYZ:Vi,fromXYZ:qi,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:pt},outputColorSpaceConfig:{drawingBufferColorSpace:pt}},
[pt]:{primaries:t,whitePoint:i,transfer:Ge,toXYZ:Vi,fromXYZ:qi,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:pt}}}),
c}const ut=Hs();function Ot(c){return c<.04045?c*.0773993808:Math.pow(c*.9478672986+.0521327014,2.4)}function oe(c){return c<
.0031308?c*12.92:1.055*Math.pow(c,.41666)-.055}let Xt;class js{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||
typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Xt===void 0&&(Xt=Ui("canvas")),
Xt.width=t.width,Xt.height=t.height;const s=Xt.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(
t,0,0,t.width,t.height),i=Xt}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||
typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ui(
"canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(
0,0,t.width,t.height),n=s.data;for(let o=0;o<n.length;o++)n[o]=Ot(n[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.
data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.
floor(Ot(e[i]/255)*255):e[i]=Ot(e[i]);return{data:e,width:t.width,height:t.height}}else return et("ImageUtils.sRGBToLine\
ar(): Unsupported image type. No color space conversion applied."),t}}let Xs=0;class Js{constructor(t=null){this.isSource=
!0,Object.defineProperty(this,"id",{value:Xs++}),this.uuid=fe(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){
const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):
typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.
depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&
t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let n;if(Array.
isArray(s)){n=[];for(let o=0,r=s.length;o<r;o++)s[o].isDataTexture?n.push(Je(s[o].image)):n.push(Je(s[o]))}else n=Je(s);
i.url=n}return e||(t.images[this.uuid]=i),i}}function Je(c){return typeof HTMLImageElement<"u"&&c instanceof HTMLImageElement||
typeof HTMLCanvasElement<"u"&&c instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&c instanceof ImageBitmap?js.getDataURL(
c):c.data?{data:Array.from(c.data),width:c.width,height:c.height,type:c.data.constructor.name}:(et("Texture: Unable to s\
erialize Texture."),{})}let Zs=0;const Ze=new C;class Vt extends We{constructor(t=Vt.DEFAULT_IMAGE,e=Vt.DEFAULT_MAPPING,i=xe,s=xe,n=Us,o=Ps,r=Vs,h=Ws,a=Vt.
DEFAULT_ANISOTROPY,l=ds){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Zs++}),this.uuid=fe(),this.name=
"",this.source=new Js(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=n,this.minFilter=
o,this.anisotropy=a,this.format=r,this.internalFormat=null,this.type=h,this.offset=new xt(0,0),this.repeat=new xt(1,1),this.
center=new xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Lt,this.generateMipmaps=!0,this.premultiplyAlpha=
!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=
null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=
0}get width(){return this.source.getSize(Ze).x}get height(){return this.source.getSize(Ze).y}get depth(){return this.source.
getSize(Ze).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(
this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.
updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().
copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.
channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=
t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.
repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.
matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,
this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=
t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=
!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){et(`Texture.setValues(): parameter '${e}' has value o\
f undefined.`);continue}const s=this[e];if(s===void 0){et(`Texture.setValues(): property '${e}' does not exist.`);continue}
s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){
const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{
version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.
mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.
x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,
type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.
flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};
return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent(
{type:"dispose"})}transformUv(t){if(this.mapping!==us)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case _i:
t.x=t.x-Math.floor(t.x);break;case xe:t.x=t.x<0?0:1;break;case Ni:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:
t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case _i:t.y=t.y-Math.floor(t.y);break;case xe:t.y=t.y<0?
0:1;break;case Ni:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&
(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.
pmremVersion++}}Vt.DEFAULT_IMAGE=null;Vt.DEFAULT_MAPPING=us;Vt.DEFAULT_ANISOTROPY=1;class pe{constructor(t=0,e=0,i=0,s=1){
pe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){
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
i,s,n;const h=t.elements,a=h[0],l=h[4],u=h[8],d=h[1],f=h[5],m=h[9],p=h[2],A=h[6],x=h[10];if(Math.abs(l-d)<.01&&Math.abs(
u-p)<.01&&Math.abs(m-A)<.01){if(Math.abs(l+d)<.1&&Math.abs(u+p)<.1&&Math.abs(m+A)<.1&&Math.abs(a+f+x-3)<.1)return this.set(
1,0,0,0),this;e=Math.PI;const g=(a+1)/2,M=(f+1)/2,E=(x+1)/2,T=(l+d)/4,S=(u+p)/4,b=(m+A)/4;return g>M&&g>E?g<.01?(i=0,s=.707106781,
n=.707106781):(i=Math.sqrt(g),s=T/i,n=S/i):M>E?M<.01?(i=.707106781,s=0,n=.707106781):(s=Math.sqrt(M),i=T/s,n=b/s):E<.01?
(i=.707106781,s=.707106781,n=0):(n=Math.sqrt(E),i=S/n,s=b/n),this.set(i,s,n,e),this}let y=Math.sqrt((A-m)*(A-m)+(u-p)*(u-
p)+(d-l)*(d-l));return Math.abs(y)<.001&&(y=1),this.x=(A-m)/y,this.y=(u-p)/y,this.z=(d-l)/y,this.w=Math.acos((a+f+x-1)/2),
this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){
return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){
return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){
return this.x=U(this.x,t.x,e.x),this.y=U(this.y,t.y,e.y),this.z=U(this.z,t.z,e.z),this.w=U(this.w,t.w,e.w),this}clampScalar(t,e){
return this.x=U(this.x,t,e),this.y=U(this.y,t,e),this.z=U(this.z,t,e),this.w=U(this.w,t,e),this}clampLength(t,e){const i=this.
length();return this.divideScalar(i||1).multiplyScalar(U(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(
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
this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ye{constructor(t=new C(
1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(
e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(dt.fromArray(t,e));return this}setFromBufferAttribute(t){
this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(dt.fromBufferAttribute(t,e));return this}setFromPoints(t){
this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=dt.
copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.
makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),
this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,
this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?
t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(
this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),
this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.
updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const n=i.getAttribute("position");if(e===!0&&n!==void 0&&t.isInstancedMesh!==
!0)for(let o=0,r=n.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,dt):dt.fromBufferAttribute(n,o),dt.applyMatrix4(t.matrixWorld),
this.expandByPoint(dt);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ae.copy(t.boundingBox)):
(i.boundingBox===null&&i.computeBoundingBox(),Ae.copy(i.boundingBox)),Ae.applyMatrix4(t.matrixWorld),this.union(Ae)}const s=t.
children;for(let n=0,o=s.length;n<o;n++)this.expandByObject(s[n],e);return this}containsPoint(t){return t.x>=this.min.x&&
t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.
min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){
return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.
z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.
y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,dt),dt.distanceToSquared(
t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.
x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=
t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.
z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.
getCenter(he),Me.subVectors(this.max,he),Jt.subVectors(t.a,he),Zt.subVectors(t.b,he),$t.subVectors(t.c,he),Nt.subVectors(
Zt,Jt),kt.subVectors($t,Zt),Ut.subVectors(Jt,$t);let e=[0,-Nt.z,Nt.y,0,-kt.z,kt.y,0,-Ut.z,Ut.y,Nt.z,0,-Nt.x,kt.z,0,-kt.x,
Ut.z,0,-Ut.x,-Nt.y,Nt.x,0,-kt.y,kt.x,0,-Ut.y,Ut.x,0];return!$e(e,Jt,Zt,$t,Me)||(e=[1,0,0,0,1,0,0,0,1],!$e(e,Jt,Zt,$t,Me))?
!1:(Se.crossVectors(Nt,kt),e=[Se.x,Se.y,Se.z],$e(e,Jt,Zt,$t,Me))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){
return this.clampPoint(t,dt).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),
t.radius=this.getSize(dt).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.
makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:
(Tt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Tt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),
Tt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Tt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),
Tt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Tt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),
Tt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Tt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),
this.setFromPoints(Tt),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.
min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.
fromArray(t.min),this.max.fromArray(t.max),this}}const Tt=[new C,new C,new C,new C,new C,new C,new C,new C],dt=new C,Ae=new ye,
Jt=new C,Zt=new C,$t=new C,Nt=new C,kt=new C,Ut=new C,he=new C,Me=new C,Se=new C,Pt=new C;function $e(c,t,e,i,s){for(let n=0,
o=c.length-3;n<=o;n+=3){Pt.fromArray(c,n);const r=s.x*Math.abs(Pt.x)+s.y*Math.abs(Pt.y)+s.z*Math.abs(Pt.z),h=t.dot(Pt),a=e.
dot(Pt),l=i.dot(Pt);if(Math.max(-Math.max(h,a,l),Math.min(h,a,l))>r)return!1}return!0}const $s=new ye,ce=new C,Qe=new C;
class xi{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.
radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):$s.setFromPoints(t).getCenter(i);let s=0;for(let n=0,
o=t.length;n<o;n++)s=Math.max(s,i.distanceToSquared(t[n]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.
copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=
-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(
this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=
e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=
this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(
this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),
t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.
radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())
return this.center.copy(t),this.radius=0,this;ce.subVectors(t,this.center);const e=ce.lengthSq();if(e>this.radius*this.radius){
const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(ce,s/i),this.radius+=s}return this}union(t){return t.
isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.
radius):(Qe.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ce.copy(t.center).add(Qe)),this.expandByPoint(
ce.copy(t.center).sub(Qe))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.
constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=
t.radius,this.center.fromArray(t.center),this}}const Et=new C,Ke=new C,Ie=new C,Dt=new C,ti=new C,Te=new C,ei=new C;class Qs{constructor(t=new C,e=new C(
0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.
origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,
t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,
Et)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):
e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){
const e=Et.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Et.copy(this.origin).
addScaledVector(this.direction,e),Et.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Ke.copy(t).add(e).multiplyScalar(
.5),Ie.copy(e).sub(t).normalize(),Dt.copy(this.origin).sub(Ke);const n=t.distanceTo(e)*.5,o=-this.direction.dot(Ie),r=Dt.
dot(this.direction),h=-Dt.dot(Ie),a=Dt.lengthSq(),l=Math.abs(1-o*o);let u,d,f,m;if(l>0)if(u=o*h-r,d=o*r-h,m=n*l,u>=0)if(d>=
-m)if(d<=m){const p=1/l;u*=p,d*=p,f=u*(u+o*d+2*r)+d*(o*u+d+2*h)+a}else d=n,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*h)+a;else
d=-n,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*h)+a;else d<=-m?(u=Math.max(0,-(-o*n+r)),d=u>0?-n:Math.min(Math.max(-n,-h),n),
f=-u*u+d*(d+2*h)+a):d<=m?(u=0,d=Math.min(Math.max(-n,-h),n),f=d*(d+2*h)+a):(u=Math.max(0,-(o*n+r)),d=u>0?n:Math.min(Math.
max(-n,-h),n),f=-u*u+d*(d+2*h)+a);else d=o>0?-n:n,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*h)+a;return i&&i.copy(this.origin).
addScaledVector(this.direction,u),s&&s.copy(Ke).addScaledVector(Ie,d),f}intersectSphere(t,e){Et.subVectors(t.center,this.
origin);const i=Et.dot(this.direction),s=Et.dot(Et)-i*i,n=t.radius*t.radius;if(s>n)return null;const o=Math.sqrt(n-s),r=i-
o,h=i+o;return h<0?null:r<0?this.at(h,e):this.at(r,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.
center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.
origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.
distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===
0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,n,o,r,h;const a=1/this.direction.x,l=1/this.direction.y,u=1/
this.direction.z,d=this.origin;return a>=0?(i=(t.min.x-d.x)*a,s=(t.max.x-d.x)*a):(i=(t.max.x-d.x)*a,s=(t.min.x-d.x)*a),l>=
0?(n=(t.min.y-d.y)*l,o=(t.max.y-d.y)*l):(n=(t.max.y-d.y)*l,o=(t.min.y-d.y)*l),i>o||n>s||((n>i||isNaN(i))&&(i=n),(o<s||isNaN(
s))&&(s=o),u>=0?(r=(t.min.z-d.z)*u,h=(t.max.z-d.z)*u):(r=(t.max.z-d.z)*u,h=(t.min.z-d.z)*u),i>h||r>s)||((r>i||i!==i)&&(i=
r),(h<s||s!==s)&&(s=h),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Et)!==null}intersectTriangle(t,e,i,s,n){
ti.subVectors(e,t),Te.subVectors(i,t),ei.crossVectors(ti,Te);let o=this.direction.dot(ei),r;if(o>0){if(s)return null;r=1}else if(o<
0)r=-1,o=-o;else return null;Dt.subVectors(this.origin,t);const h=r*this.direction.dot(Te.crossVectors(Dt,Te));if(h<0)return null;
const a=r*this.direction.dot(ti.cross(Dt));if(a<0||h+a>o)return null;const l=-r*Dt.dot(ei);return l<0?null:this.at(l/o,n)}applyMatrix4(t){
return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&
t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class bt{constructor(t,e,i,s,n,o,r,h,a,l,u,d,f,m,p,A){
bt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,n,o,r,h,a,l,u,d,f,
m,p,A)}set(t,e,i,s,n,o,r,h,a,l,u,d,f,m,p,A){const x=this.elements;return x[0]=t,x[4]=e,x[8]=i,x[12]=s,x[1]=n,x[5]=o,x[9]=
r,x[13]=h,x[2]=a,x[6]=l,x[10]=u,x[14]=d,x[3]=f,x[7]=m,x[11]=p,x[15]=A,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,
0,1,0,0,0,0,1),this}clone(){return new bt().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=
i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=
i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=
i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],
e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinant()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.
setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.
set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();
const e=this.elements,i=t.elements,s=1/Qt.setFromMatrixColumn(t,0).length(),n=1/Qt.setFromMatrixColumn(t,1).length(),o=1/
Qt.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*n,e[5]=i[5]*n,e[6]=i[6]*
n,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.
elements,i=t.x,s=t.y,n=t.z,o=Math.cos(i),r=Math.sin(i),h=Math.cos(s),a=Math.sin(s),l=Math.cos(n),u=Math.sin(n);if(t.order===
"XYZ"){const d=o*l,f=o*u,m=r*l,p=r*u;e[0]=h*l,e[4]=-h*u,e[8]=a,e[1]=f+m*a,e[5]=d-p*a,e[9]=-r*h,e[2]=p-d*a,e[6]=m+f*a,e[10]=
o*h}else if(t.order==="YXZ"){const d=h*l,f=h*u,m=a*l,p=a*u;e[0]=d+p*r,e[4]=m*r-f,e[8]=o*a,e[1]=o*u,e[5]=o*l,e[9]=-r,e[2]=
f*r-m,e[6]=p+d*r,e[10]=o*h}else if(t.order==="ZXY"){const d=h*l,f=h*u,m=a*l,p=a*u;e[0]=d-p*r,e[4]=-o*u,e[8]=m+f*r,e[1]=f+
m*r,e[5]=o*l,e[9]=p-d*r,e[2]=-o*a,e[6]=r,e[10]=o*h}else if(t.order==="ZYX"){const d=o*l,f=o*u,m=r*l,p=r*u;e[0]=h*l,e[4]=
m*a-f,e[8]=d*a+p,e[1]=h*u,e[5]=p*a+d,e[9]=f*a-m,e[2]=-a,e[6]=r*h,e[10]=o*h}else if(t.order==="YZX"){const d=o*h,f=o*a,m=r*
h,p=r*a;e[0]=h*l,e[4]=p-d*u,e[8]=m*u+f,e[1]=u,e[5]=o*l,e[9]=-r*l,e[2]=-a*l,e[6]=f*u+m,e[10]=d-p*u}else if(t.order==="XZY"){
const d=o*h,f=o*a,m=r*h,p=r*a;e[0]=h*l,e[4]=-u,e[8]=a*l,e[1]=d*u+p,e[5]=o*l,e[9]=f*u-m,e[2]=m*u-f,e[6]=r*l,e[10]=p*u+d}return e[3]=
0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ks,t,tn)}lookAt(t,e,i){
const s=this.elements;return rt.subVectors(t,e),rt.lengthSq()===0&&(rt.z=1),rt.normalize(),vt.crossVectors(i,rt),vt.lengthSq()===
0&&(Math.abs(i.z)===1?rt.x+=1e-4:rt.z+=1e-4,rt.normalize(),vt.crossVectors(i,rt)),vt.normalize(),Ee.crossVectors(rt,vt),
s[0]=vt.x,s[4]=Ee.x,s[8]=rt.x,s[1]=vt.y,s[5]=Ee.y,s[9]=rt.y,s[2]=vt.z,s[6]=Ee.z,s[10]=rt.z,this}multiply(t){return this.
multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.
elements,n=this.elements,o=i[0],r=i[4],h=i[8],a=i[12],l=i[1],u=i[5],d=i[9],f=i[13],m=i[2],p=i[6],A=i[10],x=i[14],y=i[3],
g=i[7],M=i[11],E=i[15],T=s[0],S=s[4],b=s[8],F=s[12],z=s[1],O=s[5],N=s[9],_=s[13],w=s[2],I=s[6],R=s[10],k=s[14],v=s[3],P=s[7],
Y=s[11],L=s[15];return n[0]=o*T+r*z+h*w+a*v,n[4]=o*S+r*O+h*I+a*P,n[8]=o*b+r*N+h*R+a*Y,n[12]=o*F+r*_+h*k+a*L,n[1]=l*T+u*z+
d*w+f*v,n[5]=l*S+u*O+d*I+f*P,n[9]=l*b+u*N+d*R+f*Y,n[13]=l*F+u*_+d*k+f*L,n[2]=m*T+p*z+A*w+x*v,n[6]=m*S+p*O+A*I+x*P,n[10]=
m*b+p*N+A*R+x*Y,n[14]=m*F+p*_+A*k+x*L,n[3]=y*T+g*z+M*w+E*v,n[7]=y*S+g*O+M*I+E*P,n[11]=y*b+g*N+M*R+E*Y,n[15]=y*F+g*_+M*k+
E*L,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=
t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],
s=t[8],n=t[12],o=t[1],r=t[5],h=t[9],a=t[13],l=t[2],u=t[6],d=t[10],f=t[14],m=t[3],p=t[7],A=t[11],x=t[15],y=h*f-a*d,g=r*f-
a*u,M=r*d-h*u,E=o*f-a*l,T=o*d-h*l,S=o*u-r*l;return e*(p*y-A*g+x*M)-i*(m*y-A*E+x*T)+s*(m*g-p*E+x*S)-n*(m*M-p*T+A*S)}transpose(){
const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],
t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?
(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],n=t[3],
o=t[4],r=t[5],h=t[6],a=t[7],l=t[8],u=t[9],d=t[10],f=t[11],m=t[12],p=t[13],A=t[14],x=t[15],y=u*A*a-p*d*a+p*h*f-r*A*f-u*h*
x+r*d*x,g=m*d*a-l*A*a-m*h*f+o*A*f+l*h*x-o*d*x,M=l*p*a-m*u*a+m*r*f-o*p*f-l*r*x+o*u*x,E=m*u*h-l*p*h-m*r*d+o*p*d+l*r*A-o*u*
A,T=e*y+i*g+s*M+n*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/T;return t[0]=y*S,t[1]=(p*d*n-u*
A*n-p*s*f+i*A*f+u*s*x-i*d*x)*S,t[2]=(r*A*n-p*h*n+p*s*a-i*A*a-r*s*x+i*h*x)*S,t[3]=(u*h*n-r*d*n-u*s*a+i*d*a+r*s*f-i*h*f)*S,
t[4]=g*S,t[5]=(l*A*n-m*d*n+m*s*f-e*A*f-l*s*x+e*d*x)*S,t[6]=(m*h*n-o*A*n-m*s*a+e*A*a+o*s*x-e*h*x)*S,t[7]=(o*d*n-l*h*n+l*s*
a-e*d*a-o*s*f+e*h*f)*S,t[8]=M*S,t[9]=(m*u*n-l*p*n-m*i*f+e*p*f+l*i*x-e*u*x)*S,t[10]=(o*p*n-m*r*n+m*i*a-e*p*a-o*i*x+e*r*x)*
S,t[11]=(l*r*n-o*u*n-l*i*a+e*u*a+o*i*f-e*r*f)*S,t[12]=E*S,t[13]=(l*p*s-m*u*s+m*i*d-e*p*d-l*i*A+e*u*A)*S,t[14]=(m*r*s-o*p*
s-m*i*h+e*p*h+o*i*A-e*r*A)*S,t[15]=(o*u*s-l*r*s+l*i*h-e*u*h-o*i*d+e*r*d)*S,this}scale(t){const e=this.elements,i=t.x,s=t.
y,n=t.z;return e[0]*=i,e[4]*=s,e[8]*=n,e[1]*=i,e[5]*=s,e[9]*=n,e[2]*=i,e[6]*=s,e[10]*=n,e[3]*=i,e[7]*=s,e[11]*=n,this}getMaxScaleOnAxis(){
const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];
return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,
1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,
0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,
0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),
this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),n=1-i,o=t.x,r=t.y,h=t.z,a=n*o,l=n*r;return this.set(a*o+i,a*
r-s*h,a*h+s*r,0,a*r+s*h,l*r+i,l*h-s*o,0,a*h-s*r,l*h+s*o,n*h*h+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,
0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,n,o){return this.set(1,i,n,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){
const s=this.elements,n=e._x,o=e._y,r=e._z,h=e._w,a=n+n,l=o+o,u=r+r,d=n*a,f=n*l,m=n*u,p=o*l,A=o*u,x=r*u,y=h*a,g=h*l,M=h*
u,E=i.x,T=i.y,S=i.z;return s[0]=(1-(p+x))*E,s[1]=(f+M)*E,s[2]=(m-g)*E,s[3]=0,s[4]=(f-M)*T,s[5]=(1-(d+x))*T,s[6]=(A+y)*T,
s[7]=0,s[8]=(m+g)*S,s[9]=(A-y)*S,s[10]=(1-(d+p))*S,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.
elements;if(t.x=s[12],t.y=s[13],t.z=s[14],this.determinant()===0)return i.set(1,1,1),e.identity(),this;let n=Qt.set(s[0],
s[1],s[2]).length();const o=Qt.set(s[4],s[5],s[6]).length(),r=Qt.set(s[8],s[9],s[10]).length();this.determinant()<0&&(n=
-n),ft.copy(this);const a=1/n,l=1/o,u=1/r;return ft.elements[0]*=a,ft.elements[1]*=a,ft.elements[2]*=a,ft.elements[4]*=l,
ft.elements[5]*=l,ft.elements[6]*=l,ft.elements[8]*=u,ft.elements[9]*=u,ft.elements[10]*=u,e.setFromRotationMatrix(ft),i.
x=n,i.y=o,i.z=r,this}makePerspective(t,e,i,s,n,o,r=we,h=!1){const a=this.elements,l=2*n/(e-t),u=2*n/(i-s),d=(e+t)/(e-t),
f=(i+s)/(i-s);let m,p;if(h)m=n/(o-n),p=o*n/(o-n);else if(r===we)m=-(o+n)/(o-n),p=-2*o*n/(o-n);else if(r===Li)m=-o/(o-n),
p=-o*n/(o-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return a[0]=l,a[4]=0,
a[8]=d,a[12]=0,a[1]=0,a[5]=u,a[9]=f,a[13]=0,a[2]=0,a[6]=0,a[10]=m,a[14]=p,a[3]=0,a[7]=0,a[11]=-1,a[15]=0,this}makeOrthographic(t,e,i,s,n,o,r=we,h=!1){
const a=this.elements,l=2/(e-t),u=2/(i-s),d=-(e+t)/(e-t),f=-(i+s)/(i-s);let m,p;if(h)m=1/(o-n),p=o/(o-n);else if(r===we)
m=-2/(o-n),p=-(o+n)/(o-n);else if(r===Li)m=-1/(o-n),p=-n/(o-n);else throw new Error("THREE.Matrix4.makeOrthographic(): I\
nvalid coordinate system: "+r);return a[0]=l,a[4]=0,a[8]=0,a[12]=d,a[1]=0,a[5]=u,a[9]=0,a[13]=f,a[2]=0,a[6]=0,a[10]=m,a[14]=
p,a[3]=0,a[7]=0,a[11]=0,a[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;
return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;
return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=
i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Qt=new C,ft=new bt,Ks=new C(
0,0,0),tn=new C(1,1,1),vt=new C,Ee=new C,rt=new C,Gi=new bt,Hi=new me;class ge{constructor(t=0,e=0,i=0,s=ge.DEFAULT_ORDER){
this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){
return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){
return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=
e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this.
_order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this.
_order,i=!0){const s=t.elements,n=s[0],o=s[4],r=s[8],h=s[1],a=s[5],l=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this.
_y=Math.asin(U(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-o,n)):(this._x=Math.atan2(d,a),
this._z=0);break;case"YXZ":this._x=Math.asin(-U(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(
h,a)):(this._y=Math.atan2(-u,n),this._z=0);break;case"ZXY":this._x=Math.asin(U(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.
atan2(-u,f),this._z=Math.atan2(-o,a)):(this._y=0,this._z=Math.atan2(h,n));break;case"ZYX":this._y=Math.asin(-U(u,-1,1)),
Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(h,n)):(this._x=0,this._z=Math.atan2(-o,a));break;case"Y\
ZX":this._z=Math.asin(U(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-l,a),this._y=Math.atan2(-u,n)):(this._x=0,this.
_y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-U(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,a),this._y=
Math.atan2(r,n)):(this._x=Math.atan2(-l,f),this._y=0);break;default:et("Euler: .setFromRotationMatrix() encountered an u\
nknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Gi.makeRotationFromQuaternion(
t),this.setFromRotationMatrix(Gi,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Hi.
setFromEuler(this),this.setFromQuaternion(Hi,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===
this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),
this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=
t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ge.DEFAULT_ORDER=
"XYZ";class en{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=
-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==
0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let sn=0;const ji=new C,Kt=new me,zt=new bt,ze=new C,le=new C,nn=new C,rn=new me,
Xi=new C(1,0,0),Ji=new C(0,1,0),Zi=new C(0,0,1),$i={type:"added"},on={type:"removed"},te={type:"childadded",child:null},
ii={type:"childremoved",child:null};class _t extends We{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,
"id",{value:sn++}),this.uuid=fe(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=_t.DEFAULT_UP.
clone();const t=new C,e=new ge,i=new me,s=new C(1,1,1);function n(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(
i,void 0,!1)}e._onChange(n),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},
rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,
enumerable:!0,value:s},modelViewMatrix:{value:new bt},normalMatrix:{value:new Lt}}),this.matrix=new bt,this.matrixWorld=
new bt,this.matrixAutoUpdate=_t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,
this.matrixWorldNeedsUpdate=!1,this.layers=new en,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=
!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData=
{}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),
this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.
quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){
this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){
this.quaternion.copy(t)}rotateOnAxis(t,e){return Kt.setFromAxisAngle(t,e),this.quaternion.multiply(Kt),this}rotateOnWorldAxis(t,e){
return Kt.setFromAxisAngle(t,e),this.quaternion.premultiply(Kt),this}rotateX(t){return this.rotateOnAxis(Xi,t)}rotateY(t){
return this.rotateOnAxis(Ji,t)}rotateZ(t){return this.rotateOnAxis(Zi,t)}translateOnAxis(t,e){return ji.copy(t).applyQuaternion(
this.quaternion),this.position.add(ji.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Xi,t)}translateY(t){
return this.translateOnAxis(Ji,t)}translateZ(t){return this.translateOnAxis(Zi,t)}localToWorld(t){return this.updateWorldMatrix(
!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(zt.copy(this.
matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ze.copy(t):ze.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,
!1),le.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?zt.lookAt(le,ze,this.up):zt.lookAt(ze,le,this.
up),this.quaternion.setFromRotationMatrix(zt),s&&(zt.extractRotation(s.matrixWorld),Kt.setFromRotationMatrix(zt),this.quaternion.
premultiply(Kt.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}
return t===this?(Yt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),
t.parent=this,this.children.push(t),t.dispatchEvent($i),te.child=t,this.dispatchEvent(te),te.child=null):Yt("Object3D.ad\
d: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)
this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(
e,1),t.dispatchEvent(on),ii.child=t,this.dispatchEvent(ii),ii.child=null),this}removeFromParent(){const t=this.parent;return t!==
null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),zt.
copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),zt.multiply(t.parent.matrixWorld)),t.
applyMatrix4(zt),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent($i),
te.child=t,this.dispatchEvent(te),te.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){
return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.
length;i<s;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){
this[t]===e&&i.push(this);const s=this.children;for(let n=0,o=s.length;n<o;n++)s[n].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){
return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(
!0,!1),this.matrixWorld.decompose(le,t,nn),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(
le,rn,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).
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
this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function n(r,h){return r[h.
uuid]===void 0&&(r[h.uuid]=h.toJSON(t)),h.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.
background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.
isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||
this.isLine||this.isPoints){s.geometry=n(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==
void 0){const h=r.shapes;if(Array.isArray(h))for(let a=0,l=h.length;a<l;a++){const u=h[a];n(t.shapes,u)}else n(t.shapes,
h)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(t.
skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];
for(let h=0,a=this.material.length;h<a;h++)r.push(n(t.materials,this.material[h]));s.material=r}else s.material=n(t.materials,
this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].
toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const h=this.animations[r];
s.animations.push(n(t.animations,h))}}if(e){const r=o(t.geometries),h=o(t.materials),a=o(t.textures),l=o(t.images),u=o(t.
shapes),d=o(t.skeletons),f=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),h.length>0&&(i.materials=h),a.length>
0&&(i.textures=a),l.length>0&&(i.images=l),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=
f),m.length>0&&(i.nodes=m)}return i.object=s,i;function o(r){const h=[];for(const a in r){const l=r[a];delete l.metadata,
h.push(l)}return h}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.
up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(
t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=
t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=
t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=
t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<
t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}_t.DEFAULT_UP=new C(0,1,0);_t.DEFAULT_MATRIX_AUTO_UPDATE=
!0;_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const mt=new C,Ct=new C,si=new C,Rt=new C,ee=new C,ie=new C,Qi=new C,ni=new C,
ri=new C,oi=new C,ai=new pe,hi=new pe,ci=new pe;class yt{constructor(t=new C,e=new C,i=new C){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){
s.subVectors(i,e),mt.subVectors(t,e),s.cross(mt);const n=s.lengthSq();return n>0?s.multiplyScalar(1/Math.sqrt(n)):s.set(
0,0,0)}static getBarycoord(t,e,i,s,n){mt.subVectors(s,e),Ct.subVectors(i,e),si.subVectors(t,e);const o=mt.dot(mt),r=mt.dot(
Ct),h=mt.dot(si),a=Ct.dot(Ct),l=Ct.dot(si),u=o*a-r*r;if(u===0)return n.set(0,0,0),null;const d=1/u,f=(a*h-r*l)*d,m=(o*l-
r*h)*d;return n.set(1-f-m,m,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Rt)===null?!1:Rt.x>=0&&Rt.
y>=0&&Rt.x+Rt.y<=1}static getInterpolation(t,e,i,s,n,o,r,h){return this.getBarycoord(t,e,i,s,Rt)===null?(h.x=0,h.y=0,"z"in
h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(n,Rt.x),h.addScaledVector(o,Rt.y),h.addScaledVector(
r,Rt.z),h)}static getInterpolatedAttribute(t,e,i,s,n,o){return ai.setScalar(0),hi.setScalar(0),ci.setScalar(0),ai.fromBufferAttribute(
t,e),hi.fromBufferAttribute(t,i),ci.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(ai,n.x),o.addScaledVector(
hi,n.y),o.addScaledVector(ci,n.z),o}static isFrontFacing(t,e,i,s){return mt.subVectors(i,e),Ct.subVectors(t,e),mt.cross(
Ct).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.
a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(
t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){
return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return mt.subVectors(this.c,this.b),Ct.subVectors(
this.a,this.b),mt.cross(Ct).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){
return yt.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){
return yt.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,n){return yt.getInterpolation(t,this.a,this.b,
this.c,e,i,s,n)}containsPoint(t){return yt.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return yt.isFrontFacing(
this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.
b,n=this.c;let o,r;ee.subVectors(s,i),ie.subVectors(n,i),ni.subVectors(t,i);const h=ee.dot(ni),a=ie.dot(ni);if(h<=0&&a<=
0)return e.copy(i);ri.subVectors(t,s);const l=ee.dot(ri),u=ie.dot(ri);if(l>=0&&u<=l)return e.copy(s);const d=h*u-l*a;if(d<=
0&&h>=0&&l<=0)return o=h/(h-l),e.copy(i).addScaledVector(ee,o);oi.subVectors(t,n);const f=ee.dot(oi),m=ie.dot(oi);if(m>=
0&&f<=m)return e.copy(n);const p=f*a-h*m;if(p<=0&&a>=0&&m<=0)return r=a/(a-m),e.copy(i).addScaledVector(ie,r);const A=l*
m-f*u;if(A<=0&&u-l>=0&&f-m>=0)return Qi.subVectors(n,s),r=(u-l)/(u-l+(f-m)),e.copy(s).addScaledVector(Qi,r);const x=1/(A+
p+d);return o=p*x,r=d*x,e.copy(i).addScaledVector(ee,o).addScaledVector(ie,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(
this.b)&&t.c.equals(this.c)}}const fs={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,
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
Bt={h:0,s:0,l:0},Ce={h:0,s:0,l:0};function li(c,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?c+(t-c)*6*e:e<1/2?t:e<2/3?c+(t-
c)*6*(2/3-e):c}class Ft{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){
if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.
setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=pt){return t=
Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ut.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=ut.
workingColorSpace){return this.r=t,this.g=e,this.b=i,ut.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=ut.workingColorSpace){
if(t=Gs(t,1),e=U(e,0,1),i=U(i,0,1),e===0)this.r=this.g=this.b=i;else{const n=i<=.5?i*(1+e):i+e-i*e,o=2*i-n;this.r=li(o,n,
t+1/3),this.g=li(o,n,t),this.b=li(o,n,t-1/3)}return ut.colorSpaceToWorking(this,s),this}setStyle(t,e=pt){function i(n){n!==
void 0&&parseFloat(n)<1&&et("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){
let n;const o=s[1],r=s[2];switch(o){case"rgb":case"rgba":if(n=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.
exec(r))return i(n[4]),this.setRGB(Math.min(255,parseInt(n[1],10))/255,Math.min(255,parseInt(n[2],10))/255,Math.min(255,
parseInt(n[3],10))/255,e);if(n=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(n[4]),
this.setRGB(Math.min(100,parseInt(n[1],10))/100,Math.min(100,parseInt(n[2],10))/100,Math.min(100,parseInt(n[3],10))/100,
e);break;case"hsl":case"hsla":if(n=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.
exec(r))return i(n[4]),this.setHSL(parseFloat(n[1])/360,parseFloat(n[2])/100,parseFloat(n[3])/100,e);break;default:et("C\
olor: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const n=s[1],o=n.length;if(o===3)return this.setRGB(
parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(
n,16),e);et("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=pt){
const i=fs[t.toLowerCase()];return i!==void 0?this.setHex(i,e):et("Color: Unknown color "+t),this}clone(){return new this.
constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=
Ot(t.r),this.g=Ot(t.g),this.b=Ot(t.b),this}copyLinearToSRGB(t){return this.r=oe(t.r),this.g=oe(t.g),this.b=oe(t.b),this}convertSRGBToLinear(){
return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=pt){return ut.
workingToColorSpace(K.copy(this),t),Math.round(U(K.r*255,0,255))*65536+Math.round(U(K.g*255,0,255))*256+Math.round(U(K.b*
255,0,255))}getHexString(t=pt){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ut.workingColorSpace){ut.
workingToColorSpace(K.copy(this),e);const i=K.r,s=K.g,n=K.b,o=Math.max(i,s,n),r=Math.min(i,s,n);let h,a;const l=(r+o)/2;
if(r===o)h=0,a=0;else{const u=o-r;switch(a=l<=.5?u/(o+r):u/(2-o-r),o){case i:h=(s-n)/u+(s<n?6:0);break;case s:h=(n-i)/u+
2;break;case n:h=(i-s)/u+4;break}h/=6}return t.h=h,t.s=a,t.l=l,t}getRGB(t,e=ut.workingColorSpace){return ut.workingToColorSpace(
K.copy(this),e),t.r=K.r,t.g=K.g,t.b=K.b,t}getStyle(t=pt){ut.workingToColorSpace(K.copy(this),t);const e=K.r,i=K.g,s=K.b;
return t!==pt?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)}\
,${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Bt),this.setHSL(Bt.h+t,Bt.s+e,Bt.l+i)}add(t){return this.r+=
t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.
r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(
0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=
t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){
return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Bt),t.getHSL(Ce);
const i=He(Bt.h,Ce.h,e),s=He(Bt.s,Ce.s,e),n=He(Bt.l,Ce.l,e);return this.setHSL(i,s,n),this}setFromVector3(t){return this.
r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,n=t.elements;return this.r=n[0]*e+n[3]*
i+n[6]*s,this.g=n[1]*e+n[4]*i+n[7]*s,this.b=n[2]*e+n[5]*i+n[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===
this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=
this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){
return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const K=new Ft;Ft.NAMES=fs;let an=0;class hn extends We{constructor(){
super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:an++}),this.uuid=fe(),this.name="",this.type="Material",
this.blending=zi,this.side=yi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ri,
this.blendDst=Fi,this.blendEquation=Ci,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.
blendColor=new Ft(0,0,0),this.blendAlpha=0,this.depthFunc=Oi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=
255,this.stencilFunc=vi,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=jt,this.stencilZFail=jt,this.stencilZPass=
jt,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.
colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=
!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.
toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){
this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.
onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){et(`Material: parame\
ter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){et(`Material: '${e}' is not a property of T\
HREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===
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
this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==zi&&(i.blending=
this.blending),this.side!==yi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=
this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ri&&(i.blendSrc=this.blendSrc),this.blendDst!==Fi&&
(i.blendDst=this.blendDst),this.blendEquation!==Ci&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=
this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=
this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==
0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Oi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.
depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.
stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==vi&&(i.stencilFunc=this.stencilFunc),
this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),
this.stencilFail!==jt&&(i.stencilFail=this.stencilFail),this.stencilZFail!==jt&&(i.stencilZFail=this.stencilZFail),this.
stencilZPass!==jt&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==
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
const o=[];for(const r in n){const h=n[r];delete h.metadata,o.push(h)}return o}if(e){const n=s(t.textures),o=s(t.images);
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
t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ms extends hn{constructor(t){
super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ft(16777215),this.map=null,this.lightMap=
null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=
null,this.envMapRotation=new ge,this.combine=Ls,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=
1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),
this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.
aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,
this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=
t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,
this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const X=new C,Re=new xt;let cn=0;class Mt{constructor(t,e,i=!1){
if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=
!0,Object.defineProperty(this,"id",{value:cn++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/
e:0,this.normalized=i,this.usage=Bi,this.updateRanges=[],this.gpuType=Ys,this.version=0}onUploadCallback(){}set needsUpdate(t){
t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){
this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,
this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,
i*=e.itemSize;for(let s=0,n=this.itemSize;s<n;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.
set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix3(
t),this.setXY(e,Re.x,Re.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)X.fromBufferAttribute(this,e),X.applyMatrix3(
t),this.setXYZ(e,X.x,X.y,X.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)X.fromBufferAttribute(this,e),
X.applyMatrix4(t),this.setXYZ(e,X.x,X.y,X.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)X.fromBufferAttribute(
this,e),X.applyNormalMatrix(t),this.setXYZ(e,X.x,X.y,X.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)
X.fromBufferAttribute(this,e),X.transformDirection(t),this.setXYZ(e,X.x,X.y,X.z);return this}set(t,e=0){return this.array.
set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=ae(i,this.array)),i}setComponent(t,e,i){
return this.normalized&&(i=st(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];
return this.normalized&&(e=ae(e,this.array)),e}setX(t,e){return this.normalized&&(e=st(e,this.array)),this.array[t*this.
itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ae(e,this.array)),e}setY(t,e){return this.
normalized&&(e=st(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.
normalized&&(e=ae(e,this.array)),e}setZ(t,e){return this.normalized&&(e=st(e,this.array)),this.array[t*this.itemSize+2]=
e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ae(e,this.array)),e}setW(t,e){return this.
normalized&&(e=st(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&
(e=st(e,this.array),i=st(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,
this.normalized&&(e=st(e,this.array),i=st(i,this.array),s=st(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+
2]=s,this}setXYZW(t,e,i,s,n){return t*=this.itemSize,this.normalized&&(e=st(e,this.array),i=st(i,this.array),s=st(s,this.
array),n=st(n,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=n,this}onUpload(t){return this.
onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.
itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&
(t.name=this.name),this.usage!==Bi&&(t.usage=this.usage),t}}class ln extends Mt{constructor(t,e,i){super(new Uint16Array(
t),e,i)}}class un extends Mt{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class dn extends Mt{constructor(t,e,i){super(
new Float32Array(t),e,i)}}let fn=0;const ct=new bt,ui=new _t,se=new C,ot=new ye,ue=new ye,Z=new C;class Ye extends We{constructor(){
super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:fn++}),this.uuid=fe(),this.name="",this.type="Bu\
fferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=
!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){
return this.index}setIndex(t){return Array.isArray(t)?this.index=new(qs(t)?un:ln)(t,1):this.index=t,this}setIndirect(t,e=0){
return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){
return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==
void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){
this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(
t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const n=new Lt().getNormalMatrix(t);i.applyNormalMatrix(
n),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==
null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ct.
makeRotationFromQuaternion(t),this.applyMatrix4(ct),this}rotateX(t){return ct.makeRotationX(t),this.applyMatrix4(ct),this}rotateY(t){
return ct.makeRotationY(t),this.applyMatrix4(ct),this}rotateZ(t){return ct.makeRotationZ(t),this.applyMatrix4(ct),this}translate(t,e,i){
return ct.makeTranslation(t,e,i),this.applyMatrix4(ct),this}scale(t,e,i){return ct.makeScale(t,e,i),this.applyMatrix4(ct),
this}lookAt(t){return ui.lookAt(t),ui.updateMatrix(),this.applyMatrix4(ui.matrix),this}center(){return this.computeBoundingBox(),
this.boundingBox.getCenter(se).negate(),this.translate(se.x,se.y,se.z),this}setFromPoints(t){const e=this.getAttribute("\
position");if(e===void 0){const i=[];for(let s=0,n=t.length;s<n;s++){const o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute(
"position",new dn(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const n=t[s];e.setXYZ(s,n.x,n.y,n.z||
0)}t.length>e.count&&et("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry\
."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ye);const t=this.attributes.
position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Yt("BufferGeometry.computeBoundingBox(): GLBufferA\
ttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==
void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const n=e[i];ot.setFromBufferAttribute(
n),this.morphTargetsRelative?(Z.addVectors(this.boundingBox.min,ot.min),this.boundingBox.expandByPoint(Z),Z.addVectors(this.
boundingBox.max,ot.max),this.boundingBox.expandByPoint(Z)):(this.boundingBox.expandByPoint(ot.min),this.boundingBox.expandByPoint(
ot.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.
min.z))&&Yt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely t\
o have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new xi);const t=this.
attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Yt("BufferGeometry.computeBoundingSpher\
e(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const i=this.
boundingSphere.center;if(ot.setFromBufferAttribute(t),e)for(let n=0,o=e.length;n<o;n++){const r=e[n];ue.setFromBufferAttribute(
r),this.morphTargetsRelative?(Z.addVectors(ot.min,ue.min),ot.expandByPoint(Z),Z.addVectors(ot.max,ue.max),ot.expandByPoint(
Z)):(ot.expandByPoint(ue.min),ot.expandByPoint(ue.max))}ot.getCenter(i);let s=0;for(let n=0,o=t.count;n<o;n++)Z.fromBufferAttribute(
t,n),s=Math.max(s,i.distanceToSquared(Z));if(e)for(let n=0,o=e.length;n<o;n++){const r=e[n],h=this.morphTargetsRelative;
for(let a=0,l=r.count;a<l;a++)Z.fromBufferAttribute(r,a),h&&(se.fromBufferAttribute(t,a),Z.add(se)),s=Math.max(s,i.distanceToSquared(
Z))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Yt('BufferGeometry.computeBoundingSphere(\
): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.
index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Yt("BufferGeometry: .compute\
Tangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,n=e.
uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Mt(new Float32Array(4*i.count),4));const o=this.getAttribute(
"tangent"),r=[],h=[];for(let b=0;b<i.count;b++)r[b]=new C,h[b]=new C;const a=new C,l=new C,u=new C,d=new xt,f=new xt,m=new xt,
p=new C,A=new C;function x(b,F,z){a.fromBufferAttribute(i,b),l.fromBufferAttribute(i,F),u.fromBufferAttribute(i,z),d.fromBufferAttribute(
n,b),f.fromBufferAttribute(n,F),m.fromBufferAttribute(n,z),l.sub(a),u.sub(a),f.sub(d),m.sub(d);const O=1/(f.x*m.y-m.x*f.
y);isFinite(O)&&(p.copy(l).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(O),A.copy(u).multiplyScalar(f.x).addScaledVector(
l,-m.x).multiplyScalar(O),r[b].add(p),r[F].add(p),r[z].add(p),h[b].add(A),h[F].add(A),h[z].add(A))}let y=this.groups;y.length===
0&&(y=[{start:0,count:t.count}]);for(let b=0,F=y.length;b<F;++b){const z=y[b],O=z.start,N=z.count;for(let _=O,w=O+N;_<w;_+=
3)x(t.getX(_+0),t.getX(_+1),t.getX(_+2))}const g=new C,M=new C,E=new C,T=new C;function S(b){E.fromBufferAttribute(s,b),
T.copy(E);const F=r[b];g.copy(F),g.sub(E.multiplyScalar(E.dot(F))).normalize(),M.crossVectors(T,F);const O=M.dot(h[b])<0?
-1:1;o.setXYZW(b,g.x,g.y,g.z,O)}for(let b=0,F=y.length;b<F;++b){const z=y[b],O=z.start,N=z.count;for(let _=O,w=O+N;_<w;_+=
3)S(t.getX(_+0)),S(t.getX(_+1)),S(t.getX(_+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");
if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Mt(new Float32Array(e.count*3),3),this.setAttribute(
"normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new C,n=new C,o=new C,r=new C,h=new C,a=new C,l=new C,
u=new C;if(t)for(let d=0,f=t.count;d<f;d+=3){const m=t.getX(d+0),p=t.getX(d+1),A=t.getX(d+2);s.fromBufferAttribute(e,m),
n.fromBufferAttribute(e,p),o.fromBufferAttribute(e,A),l.subVectors(o,n),u.subVectors(s,n),l.cross(u),r.fromBufferAttribute(
i,m),h.fromBufferAttribute(i,p),a.fromBufferAttribute(i,A),r.add(l),h.add(l),a.add(l),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(p,
h.x,h.y,h.z),i.setXYZ(A,a.x,a.y,a.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),n.fromBufferAttribute(
e,d+1),o.fromBufferAttribute(e,d+2),l.subVectors(o,n),u.subVectors(s,n),l.cross(u),i.setXYZ(d+0,l.x,l.y,l.z),i.setXYZ(d+
1,l.x,l.y,l.z),i.setXYZ(d+2,l.x,l.y,l.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.
normal;for(let e=0,i=t.count;e<i;e++)Z.fromBufferAttribute(t,e),Z.normalize(),t.setXYZ(e,Z.x,Z.y,Z.z)}toNonIndexed(){function t(r,h){
const a=r.array,l=r.itemSize,u=r.normalized,d=new a.constructor(h.length*l);let f=0,m=0;for(let p=0,A=h.length;p<A;p++){
r.isInterleavedBufferAttribute?f=h[p]*r.data.stride+r.offset:f=h[p]*l;for(let x=0;x<l;x++)d[m++]=a[f++]}return new Mt(d,
l,u)}if(this.index===null)return et("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ye,
i=this.index.array,s=this.attributes;for(const r in s){const h=s[r],a=t(h,i);e.setAttribute(r,a)}const n=this.morphAttributes;
for(const r in n){const h=[],a=n[r];for(let l=0,u=a.length;l<u;l++){const d=a[l],f=t(d,i);h.push(f)}e.morphAttributes[r]=
h}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,h=o.length;r<h;r++){const a=o[r];e.addGroup(
a.start,a.count,a.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"Buffe\
rGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>
0&&(t.userData=this.userData),this.parameters!==void 0){const h=this.parameters;for(const a in h)h[a]!==void 0&&(t[a]=h[a]);
return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.
slice.call(e.array)});const i=this.attributes;for(const h in i){const a=i[h];t.data.attributes[h]=a.toJSON(t.data)}const s={};
let n=!1;for(const h in this.morphAttributes){const a=this.morphAttributes[h],l=[];for(let u=0,d=a.length;u<d;u++){const f=a[u];
l.push(f.toJSON(t.data))}l.length>0&&(s[h]=l,n=!0)}n&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);
const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&
(t.data.boundingSphere=r.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes=
{},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.
index;i!==null&&this.setIndex(i.clone());const s=t.attributes;for(const a in s){const l=s[a];this.setAttribute(a,l.clone(
e))}const n=t.morphAttributes;for(const a in n){const l=[],u=n[a];for(let d=0,f=u.length;d<f;d++)l.push(u[d].clone(e));this.
morphAttributes[a]=l}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let a=0,l=o.length;a<l;a++){const u=o[a];
this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const h=t.boundingSphere;
return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.
count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ki=new bt,Wt=new Qs,Fe=new xi,
ts=new C,Oe=new C,_e=new C,Ne=new C,di=new C,ke=new C,es=new C,De=new C;class mn extends _t{constructor(t=new Ye,e=new ms){
super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=
void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=
t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),
this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){
const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=
[],this.morphTargetDictionary={};for(let n=0,o=s.length;n<o;n++){const r=s[n].name||String(n);this.morphTargetInfluences.
push(0),this.morphTargetDictionary[r]=n}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,n=i.morphAttributes.
position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(n&&r){ke.set(0,0,0);for(let h=0,
a=n.length;h<a;h++){const l=r[h],u=n[h];l!==0&&(di.fromBufferAttribute(u,t),o?ke.addScaledVector(di,l):ke.addScaledVector(
di.sub(e),l))}e.add(ke)}return e}raycast(t,e){const i=this.geometry,s=this.material,n=this.matrixWorld;s!==void 0&&(i.boundingSphere===
null&&i.computeBoundingSphere(),Fe.copy(i.boundingSphere),Fe.applyMatrix4(n),Wt.copy(t.ray).recast(t.near),!(Fe.containsPoint(
Wt.origin)===!1&&(Wt.intersectSphere(Fe,ts)===null||Wt.origin.distanceToSquared(ts)>(t.far-t.near)**2))&&(Ki.copy(n).invert(),
Wt.copy(t.ray).applyMatrix4(Ki),!(i.boundingBox!==null&&Wt.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(
t,e,Wt)))}_computeIntersections(t,e,i){let s;const n=this.geometry,o=this.material,r=n.index,h=n.attributes.position,a=n.
attributes.uv,l=n.attributes.uv1,u=n.attributes.normal,d=n.groups,f=n.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,
p=d.length;m<p;m++){const A=d[m],x=o[A.materialIndex],y=Math.max(A.start,f.start),g=Math.min(r.count,Math.min(A.start+A.
count,f.start+f.count));for(let M=y,E=g;M<E;M+=3){const T=r.getX(M),S=r.getX(M+1),b=r.getX(M+2);s=ve(this,x,t,i,a,l,u,T,
S,b),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=A.materialIndex,e.push(s))}}else{const m=Math.max(0,f.start),p=Math.
min(r.count,f.start+f.count);for(let A=m,x=p;A<x;A+=3){const y=r.getX(A),g=r.getX(A+1),M=r.getX(A+2);s=ve(this,o,t,i,a,l,
u,y,g,M),s&&(s.faceIndex=Math.floor(A/3),e.push(s))}}else if(h!==void 0)if(Array.isArray(o))for(let m=0,p=d.length;m<p;m++){
const A=d[m],x=o[A.materialIndex],y=Math.max(A.start,f.start),g=Math.min(h.count,Math.min(A.start+A.count,f.start+f.count));
for(let M=y,E=g;M<E;M+=3){const T=M,S=M+1,b=M+2;s=ve(this,x,t,i,a,l,u,T,S,b),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=
A.materialIndex,e.push(s))}}else{const m=Math.max(0,f.start),p=Math.min(h.count,f.start+f.count);for(let A=m,x=p;A<x;A+=
3){const y=A,g=A+1,M=A+2;s=ve(this,o,t,i,a,l,u,y,g,M),s&&(s.faceIndex=Math.floor(A/3),e.push(s))}}}}function pn(c,t,e,i,s,n,o,r){
let h;if(t.side===Bs?h=i.intersectTriangle(o,n,s,!0,r):h=i.intersectTriangle(s,n,o,t.side===yi,r),h===null)return null;De.
copy(r),De.applyMatrix4(c.matrixWorld);const a=e.ray.origin.distanceTo(De);return a<e.near||a>e.far?null:{distance:a,point:De.
clone(),object:c}}function ve(c,t,e,i,s,n,o,r,h,a){c.getVertexPosition(r,Oe),c.getVertexPosition(h,_e),c.getVertexPosition(
a,Ne);const l=pn(c,t,e,i,Oe,_e,Ne,es);if(l){const u=new C;yt.getBarycoord(es,Oe,_e,Ne,u),s&&(l.uv=yt.getInterpolatedAttribute(
s,r,h,a,u,new xt)),n&&(l.uv1=yt.getInterpolatedAttribute(n,r,h,a,u,new xt)),o&&(l.normal=yt.getInterpolatedAttribute(o,r,
h,a,u,new C),l.normal.dot(i.direction)>0&&l.normal.multiplyScalar(-1));const d={a:r,b:h,c:a,normal:new C,materialIndex:0};
yt.getNormal(Oe,_e,Ne,d.normal),l.face=d,l.barycoord=u}return l}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(
new CustomEvent("register",{detail:{revision:ls}}));typeof window<"u"&&(window.__THREE__?et("WARNING: Multiple instances\
 of Three.js being imported."):window.__THREE__=ls);class yn extends mn{constructor(t,e,i=!1,s=!1,n=1e4){const o=new Ye;
super(o,e),this.isMarchingCubes=!0;const r=this,h=new Float32Array(36),a=new Float32Array(36),l=new Float32Array(36);this.
enableUvs=i,this.enableColors=s,this.init=function(y){this.resolution=y,this.isolation=80,this.size=y,this.size2=this.size*
this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.
size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(
this.size3*3),this.count=0;const g=n*3;this.positionArray=new Float32Array(g*3);const M=new Mt(this.positionArray,3);M.setUsage(
be),o.setAttribute("position",M),this.normalArray=new Float32Array(g*3);const E=new Mt(this.normalArray,3);if(E.setUsage(
be),o.setAttribute("normal",E),this.enableUvs){this.uvArray=new Float32Array(g*2);const T=new Mt(this.uvArray,2);T.setUsage(
be),o.setAttribute("uv",T)}if(this.enableColors){this.colorArray=new Float32Array(g*3);const T=new Mt(this.colorArray,3);
T.setUsage(be),o.setAttribute("color",T)}o.boundingSphere=new xi(new C,1)};function u(y,g,M){return y+(g-y)*M}function d(y,g,M,E,T,S,b,F,z,O){
const N=(M-b)/(F-b),_=r.normal_cache;h[g+0]=E+N*r.delta,h[g+1]=T,h[g+2]=S,a[g+0]=u(_[y+0],_[y+3],N),a[g+1]=u(_[y+1],_[y+
4],N),a[g+2]=u(_[y+2],_[y+5],N),l[g+0]=u(r.palette[z*3+0],r.palette[O*3+0],N),l[g+1]=u(r.palette[z*3+1],r.palette[O*3+1],
N),l[g+2]=u(r.palette[z*3+2],r.palette[O*3+2],N)}function f(y,g,M,E,T,S,b,F,z,O){const N=(M-b)/(F-b),_=r.normal_cache;h[g+
0]=E,h[g+1]=T+N*r.delta,h[g+2]=S;const w=y+r.yd*3;a[g+0]=u(_[y+0],_[w+0],N),a[g+1]=u(_[y+1],_[w+1],N),a[g+2]=u(_[y+2],_[w+
2],N),l[g+0]=u(r.palette[z*3+0],r.palette[O*3+0],N),l[g+1]=u(r.palette[z*3+1],r.palette[O*3+1],N),l[g+2]=u(r.palette[z*3+
2],r.palette[O*3+2],N)}function m(y,g,M,E,T,S,b,F,z,O){const N=(M-b)/(F-b),_=r.normal_cache;h[g+0]=E,h[g+1]=T,h[g+2]=S+N*
r.delta;const w=y+r.zd*3;a[g+0]=u(_[y+0],_[w+0],N),a[g+1]=u(_[y+1],_[w+1],N),a[g+2]=u(_[y+2],_[w+2],N),l[g+0]=u(r.palette[z*
3+0],r.palette[O*3+0],N),l[g+1]=u(r.palette[z*3+1],r.palette[O*3+1],N),l[g+2]=u(r.palette[z*3+2],r.palette[O*3+2],N)}function p(y){
const g=y*3;r.normal_cache[g]===0&&(r.normal_cache[g+0]=r.field[y-1]-r.field[y+1],r.normal_cache[g+1]=r.field[y-r.yd]-r.
field[y+r.yd],r.normal_cache[g+2]=r.field[y-r.zd]-r.field[y+r.zd])}function A(y,g,M,E,T){const S=E+1,b=E+r.yd,F=E+r.zd,z=S+
r.yd,O=S+r.zd,N=E+r.yd+r.zd,_=S+r.yd+r.zd;let w=0;const I=r.field[E],R=r.field[S],k=r.field[b],v=r.field[z],P=r.field[F],
Y=r.field[O],L=r.field[N],G=r.field[_];I<T&&(w|=1),R<T&&(w|=2),k<T&&(w|=8),v<T&&(w|=4),P<T&&(w|=16),Y<T&&(w|=32),L<T&&(w|=
128),G<T&&(w|=64);const B=gn[w];if(B===0)return 0;const V=r.delta,ht=y+V,nt=g+V,lt=M+V;B&1&&(p(E),p(S),d(E*3,0,T,y,g,M,I,
R,E,S)),B&2&&(p(S),p(z),f(S*3,3,T,ht,g,M,R,v,S,z)),B&4&&(p(b),p(z),d(b*3,6,T,y,nt,M,k,v,b,z)),B&8&&(p(E),p(b),f(E*3,9,T,
y,g,M,I,k,E,b)),B&16&&(p(F),p(O),d(F*3,12,T,y,g,lt,P,Y,F,O)),B&32&&(p(O),p(_),f(O*3,15,T,ht,g,lt,Y,G,O,_)),B&64&&(p(N),p(
_),d(N*3,18,T,y,nt,lt,L,G,N,_)),B&128&&(p(F),p(N),f(F*3,21,T,y,g,lt,P,L,F,N)),B&256&&(p(E),p(F),m(E*3,24,T,y,g,M,I,P,E,F)),
B&512&&(p(S),p(O),m(S*3,27,T,ht,g,M,R,Y,S,O)),B&1024&&(p(z),p(_),m(z*3,30,T,ht,nt,M,v,G,z,_)),B&2048&&(p(b),p(N),m(b*3,33,
T,y,nt,M,k,L,b,N)),w<<=4;let it,St,wt,W=0,H=0;for(;Be[w+H]!=-1;)it=w+H,St=it+1,wt=it+2,x(h,a,l,3*Be[it],3*Be[St],3*Be[wt]),
H+=3,W++;return W}function x(y,g,M,E,T,S){const b=r.count*3;if(r.positionArray[b+0]=y[E],r.positionArray[b+1]=y[E+1],r.positionArray[b+
2]=y[E+2],r.positionArray[b+3]=y[T],r.positionArray[b+4]=y[T+1],r.positionArray[b+5]=y[T+2],r.positionArray[b+6]=y[S],r.
positionArray[b+7]=y[S+1],r.positionArray[b+8]=y[S+2],r.material.flatShading===!0){const F=(g[E+0]+g[T+0]+g[S+0])/3,z=(g[E+
1]+g[T+1]+g[S+1])/3,O=(g[E+2]+g[T+2]+g[S+2])/3;r.normalArray[b+0]=F,r.normalArray[b+1]=z,r.normalArray[b+2]=O,r.normalArray[b+
3]=F,r.normalArray[b+4]=z,r.normalArray[b+5]=O,r.normalArray[b+6]=F,r.normalArray[b+7]=z,r.normalArray[b+8]=O}else r.normalArray[b+
0]=g[E+0],r.normalArray[b+1]=g[E+1],r.normalArray[b+2]=g[E+2],r.normalArray[b+3]=g[T+0],r.normalArray[b+4]=g[T+1],r.normalArray[b+
5]=g[T+2],r.normalArray[b+6]=g[S+0],r.normalArray[b+7]=g[S+1],r.normalArray[b+8]=g[S+2];if(r.enableUvs){const F=r.count*
2;r.uvArray[F+0]=y[E+0],r.uvArray[F+1]=y[E+2],r.uvArray[F+2]=y[T+0],r.uvArray[F+3]=y[T+2],r.uvArray[F+4]=y[S+0],r.uvArray[F+
5]=y[S+2]}r.enableColors&&(r.colorArray[b+0]=M[E+0],r.colorArray[b+1]=M[E+1],r.colorArray[b+2]=M[E+2],r.colorArray[b+3]=
M[T+0],r.colorArray[b+4]=M[T+1],r.colorArray[b+5]=M[T+2],r.colorArray[b+6]=M[S+0],r.colorArray[b+7]=M[S+1],r.colorArray[b+
8]=M[S+2]),r.count+=3}this.addBall=function(y,g,M,E,T,S){const b=Math.sign(E);E=Math.abs(E);const F=S!=null;let z=new Ft(
y,g,M);if(F)try{z=S instanceof Ft?S:Array.isArray(S)?new Ft(Math.min(Math.abs(S[0]),1),Math.min(Math.abs(S[1]),1),Math.min(
Math.abs(S[2]),1)):new Ft(S)}catch{z=new Ft(y,g,M)}const O=this.size*Math.sqrt(E/T),N=M*this.size,_=g*this.size,w=y*this.
size;let I=Math.floor(N-O);I<1&&(I=1);let R=Math.floor(N+O);R>this.size-1&&(R=this.size-1);let k=Math.floor(_-O);k<1&&(k=
1);let v=Math.floor(_+O);v>this.size-1&&(v=this.size-1);let P=Math.floor(w-O);P<1&&(P=1);let Y=Math.floor(w+O);Y>this.size-
1&&(Y=this.size-1);let L,G,B,V,ht,nt,lt,it,St,wt,W;for(B=I;B<R;B++)for(ht=this.size2*B,it=B/this.size-M,St=it*it,G=k;G<v;G++)
for(V=ht+this.size*G,lt=G/this.size-g,wt=lt*lt,L=P;L<Y;L++)if(nt=L/this.size-y,W=E/(1e-6+nt*nt+wt+St)-T,W>0){this.field[V+
L]+=W*b;const H=Math.sqrt((L-w)*(L-w)+(G-_)*(G-_)+(B-N)*(B-N))/O,J=1-H*H*H*(H*(H*6-15)+10);this.palette[(V+L)*3+0]+=z.r*
J,this.palette[(V+L)*3+1]+=z.g*J,this.palette[(V+L)*3+2]+=z.b*J}},this.addPlaneX=function(y,g){const M=this.size,E=this.
yd,T=this.zd,S=this.field;let b,F,z,O,N,_,w,I=M*Math.sqrt(y/g);for(I>M&&(I=M),b=0;b<I;b++)if(_=b/M,O=_*_,N=y/(1e-4+O)-g,
N>0)for(F=0;F<M;F++)for(w=b+F*E,z=0;z<M;z++)S[T*z+w]+=N},this.addPlaneY=function(y,g){const M=this.size,E=this.yd,T=this.
zd,S=this.field;let b,F,z,O,N,_,w,I,R=M*Math.sqrt(y/g);for(R>M&&(R=M),F=0;F<R;F++)if(_=F/M,O=_*_,N=y/(1e-4+O)-g,N>0)for(w=
F*E,b=0;b<M;b++)for(I=w+b,z=0;z<M;z++)S[T*z+I]+=N},this.addPlaneZ=function(y,g){const M=this.size,E=this.yd,T=this.zd,S=this.
field;let b,F,z,O,N,_,w,I,R=M*Math.sqrt(y/g);for(R>M&&(R=M),z=0;z<R;z++)if(_=z/M,O=_*_,N=y/(1e-4+O)-g,N>0)for(w=T*z,F=0;F<
M;F++)for(I=w+F*E,b=0;b<M;b++)S[I+b]+=N},this.setCell=function(y,g,M,E){const T=this.size2*M+this.size*g+y;this.field[T]=
E},this.getCell=function(y,g,M){const E=this.size2*M+this.size*g+y;return this.field[E]},this.blur=function(y=1){const g=this.
field,M=g.slice(),E=this.size,T=this.size2;for(let S=0;S<E;S++)for(let b=0;b<E;b++)for(let F=0;F<E;F++){const z=T*F+E*b+
S;let O=M[z],N=1;for(let _=-1;_<=1;_+=2){const w=_+S;if(!(w<0||w>=E))for(let I=-1;I<=1;I+=2){const R=I+b;if(!(R<0||R>=E))
for(let k=-1;k<=1;k+=2){const v=k+F;if(v<0||v>=E)continue;const P=T*v+E*R+w,Y=M[P];N++,O+=y*(Y-O)/N}}}g[z]=O}},this.reset=
function(){for(let y=0;y<this.size3;y++)this.normal_cache[y*3]=0,this.field[y]=0,this.palette[y*3]=this.palette[y*3+1]=this.
palette[y*3+2]=0},this.update=function(){this.count=0;const y=this.size-2;for(let g=1;g<y;g++){const M=this.size2*g,E=(g-
this.halfsize)/this.halfsize;for(let T=1;T<y;T++){const S=M+this.size*T,b=(T-this.halfsize)/this.halfsize;for(let F=1;F<
y;F++){const z=(F-this.halfsize)/this.halfsize,O=S+F;A(z,b,E,O,this.isolation)}}}this.geometry.setDrawRange(0,this.count),
o.getAttribute("position").needsUpdate=!0,o.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(o.getAttribute("uv").
needsUpdate=!0),this.enableColors&&(o.getAttribute("color").needsUpdate=!0),this.count/3>n&&console.warn("THREE.Marching\
Cubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const gn=new Int32Array(
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
Be=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,
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
0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),At=320,xn=[.485,.456,.406],
bn=[.229,.224,.225],ps=(c,t)=>new OffscreenCanvas(c,t),de=c=>Object.assign(new Error(c),{code:"ERR_MESH_FOREGROUND"});function Ve(c){
const{width:t,height:e,data:i}=c??{};if(!Number.isSafeInteger(t)||!Number.isSafeInteger(e)||t<1||e<1||t*e>4096*4096||!(i instanceof
Uint8Array||i instanceof Uint8ClampedArray)||i.length!==t*e*4)throw new Error("TripoSR needs bounded RGBA pixels");return c}
function bi(c){const{width:t,height:e,data:i}=Ve(c);let s=0,n=0,o=0;for(let r=0;r<e;r++)for(let h=0;h<t;h++){const a=i[(r*
t+h)*4+3]<=16;a&&s++,(h===0||r===0||h===t-1||r===e-1)&&(n++,a&&o++)}return s>=Math.max(1,t*e*.01)&&o>=n*.25}function wn(c){
if(!bi(c))throw de("This stored TripoSR package needs a transparent cutout. Load the current TripoSR package to remove i\
mage backgrounds automatically.");return c}function An(c){const t=At**2;if(!(c instanceof Uint8Array||c instanceof Uint8ClampedArray)||
c.length!==t*4)throw new Error("Foreground input must be 320×320 RGBA");let e=1e-6;for(let s=0;s<c.length;s+=4)e=Math.max(
e,c[s],c[s+1],c[s+2]);const i=new Float32Array(t*3);for(let s=0;s<t;s++)for(let n=0;n<3;n++)i[n*t+s]=(c[s*4+n]/e-xn[n])/
bn[n];return i}function Mn(c,{canvas:t=ps}={}){const{width:e,height:i,data:s}=Ve(c),n=new Uint8ClampedArray(s);for(let a=3;a<
n.length;a+=4)n[a]=255;const o=t(e,i),r=t(At,At);o.getContext("2d").putImageData(new ImageData(n,e,i),0,0);const h=r.getContext(
"2d",{willReadFrequently:!0});return h.imageSmoothingEnabled=!0,h.imageSmoothingQuality="high",h.drawImage(o,0,0,At,At),
An(h.getImageData(0,0,At,At).data)}function Sn(c,t,{canvas:e=ps}={}){const{width:i,height:s,data:n}=Ve(c),o=At;if(!(t instanceof
Float32Array)||t.length!==o*o)throw de("Invalid foreground model mask");let r=1/0,h=-1/0;for(const x of t){if(!Number.isFinite(
x)||x<-1e-4||x>1.0001)throw de("Invalid foreground model values");r=Math.min(r,x),h=Math.max(h,x)}if(h-r<1e-6)throw de("\
The foreground model could not isolate an object. Try one clearly visible object or a transparent cutout.");const a=new Uint8ClampedArray(
o*o*4);for(let x=0;x<t.length;x++){const y=Math.floor(255*(t[x]-r)/(h-r));a[x*4]=a[x*4+1]=a[x*4+2]=y,a[x*4+3]=255}const l=e(
o,o),u=e(i,s);l.getContext("2d").putImageData(new ImageData(a,o,o),0,0);const d=u.getContext("2d",{willReadFrequently:!0});
d.imageSmoothingEnabled=!0,d.imageSmoothingQuality="high",d.drawImage(l,0,0,i,s);const f=d.getImageData(0,0,i,s).data,m=new Uint8Array(
n);let p=0;for(let x=0;x<i*s;x++){const y=Math.round(n[x*4+3]*f[x*4]/255);m[x*4+3]=y,y>=128&&p++}const A={width:i,height:s,
channels:4,data:m};if(!p||!bi(A))throw de("The foreground model could not isolate an object. Try one clearly visible obj\
ect with space around it, or a transparent cutout.");return A}const j=Object.freeze({imageSize:512,foregroundRatio:.85,radius:.87,
channels:40,planeSize:64,threshold:25,resolution:64,queryBatch:32768,maxVertices:1e5,maxTriangles:15e4});function qt(c,t){
for(const e of c)if(!Number.isFinite(e))throw new Error(`${t} contains non-finite values`);return c}function In(c){const{
width:t,height:e,data:i}=Ve(c);let s=t,n=e,o=-1,r=-1;for(let h=0;h<e;h++)for(let a=0;a<t;a++)i[(h*t+a)*4+3]&&(s=Math.min(
s,a),n=Math.min(n,h),o=Math.max(o,a),r=Math.max(r,h));if(o<s)throw new Error("The image has no visible foreground");return{
x:s,y:n,width:o-s+1,height:r-n+1}}function Tn(c){const t=j.imageSize**2;if(!(c instanceof Uint8Array||c instanceof Uint8ClampedArray)||
c.length!==t*4)throw new Error("TripoSR input must be 512×512 RGBA");const e=new Float32Array(t*3);for(let i=0;i<t;i++){
const s=c[i*4+3]/255;for(let n=0;n<3;n++)e[n*t+i]=c[i*4+n]/255*s+.5*(1-s)}return e}function En(c,{canvas:t=(e,i)=>new OffscreenCanvas(
e,i)}={}){c=wn(c);const e=In(c),i=j.imageSize,s=t(c.width,c.height),n=t(i,i);s.getContext("2d").putImageData(new ImageData(
new Uint8ClampedArray(c.data),c.width,c.height),0,0);const o=i*j.foregroundRatio/Math.max(e.width,e.height),r=e.width*o,
h=e.height*o,a=n.getContext("2d",{willReadFrequently:!0});return a.imageSmoothingEnabled=!0,a.imageSmoothingQuality="hig\
h",a.drawImage(s,e.x,e.y,e.width,e.height,(i-r)/2,(i-h)/2,r,h),Tn(a.getImageData(0,0,i,i).data)}function zn(c,t,e){if(!Number.
isInteger(c)||c<4||c>128||!Number.isSafeInteger(t)||!Number.isSafeInteger(e)||t<0||e<1||e>j.queryBatch||t+e>c**3)throw new Error(
"Invalid TripoSR query grid");const i=new Float32Array(e*3),s=2*j.radius/(c-1);for(let n=0;n<e;n++){const o=t+n;i[n*3]=o%
c*s-j.radius,i[n*3+1]=Math.floor(o/c)%c*s-j.radius,i[n*3+2]=Math.floor(o/(c*c))*s-j.radius}return i}function Cn(c,t){if(!(c instanceof
Float32Array)||c.length!==7680*64||!(t instanceof Float32Array)||t.length%3||t.length/3>j.queryBatch)throw new Error("In\
valid TripoSR sample tensors");qt(t,"Query points");const e=new Float32Array(t.length/3*120);for(let i=0;i<t.length/3;i++){
const s=t[i*3]/j.radius,n=t[i*3+1]/j.radius,o=t[i*3+2]/j.radius;for(let r=0;r<3;r++){const h=((r===2?n:s)+1)*32-.5,a=((r===
0?n:o)+1)*32-.5,l=Math.floor(h),u=Math.floor(a),d=h-l,f=a-u;for(let m=0;m<40;m++){let p=0;for(let A=0;A<2;A++)for(let x=0;x<
2;x++){const y=l+x,g=u+A;y>=0&&y<64&&g>=0&&g<64&&(p+=c[(r*40+m)*4096+g*64+y]*(x?d:1-d)*(A?f:1-f))}e[i*120+r*40+m]=p}}}return qt(
e,"Triplane features")}function Rn(c,t=j.resolution){if(!(c instanceof Float32Array)||c.length!==t**3||!Number.isInteger(
t)||t<4||t>128)throw new Error("Invalid density field");qt(c,"Density");const e=new ms,i=new yn(t,e,!1,!1,Math.floor(j.maxVertices/
3)+1);try{i.field.set(c),i.isolation=j.threshold,i.update();const s=i.count;if(!s)throw new Error("No solid object was f\
ound; use one object on a plain or transparent background");if(s>j.maxVertices)throw new Error("Generated mesh exceeds i\
ts vertex budget");const n=new Float32Array(i.positionArray.slice(0,s*3)),o=new Float32Array(i.normalArray.slice(0,s*3)),
r=Uint32Array.from({length:s},(h,a)=>a);for(let h=0;h<n.length;h++)n[h]=((n[h]+1)*t/(t-1)-1)*j.radius;for(let h=0;h<o.length;h+=
3){const a=Math.hypot(o[h],o[h+1],o[h+2]);if(!Number.isFinite(a)||a<=1e-12)throw new Error("Generated surface has an inv\
alid normal");o[h]/=a,o[h+1]/=a,o[h+2]/=a}return{positions:n,normals:o,indices:r}}finally{i.geometry.dispose(),e.dispose()}}
function Fn(c){for(const t of["positions","normals"]){const e=c[t];for(let i=0;i<e.length;i+=3){const s=e[i+1];e[i+1]=e[i+
2],e[i+2]=-s}}return c}function On(c){return qt(c,"Vertex colors"),Float32Array.from(c,t=>{const e=Math.max(0,Math.min(1,
t));return e<=.04045?e/12.92:((e+.055)/1.055)**2.4})}const is=()=>new Promise(c=>setTimeout(c,0)),Ue=4*1024**2,Le=c=>Object.
values(c??{}).forEach(t=>{var e;return(e=t.dispose)==null?void 0:e.call(t)});async function _n(c,t,e,i){if(!t||t.size<1||
t.size>512*1024**2)throw new Error("3D model file exceeds its loader budget");const s=new Uint8Array(t.size);for(let n=0;n<
s.length;n+=Ue)tt(e),s.set(await c.read(t.path,n,Math.min(Ue,s.length-n),{signal:e}),n),i==null||i({type:"model-load",stage:t.
path,loaded:Math.min(n+Ue,s.length),total:s.length});return s}function Nn(c,t){const e=c.createCommandEncoder.bind(c),i=c.
queue.submit.bind(c.queue);c.createCommandEncoder=(...s)=>{const n=e(...s),o=n.beginComputePass.bind(n);return n.beginComputePass=
(...r)=>{const h=o(...r);for(const a of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const l=h[a].bind(h);h[a]=(...u)=>{
const d=l(...u);return t.gpuDispatches++,d}}return h},n},c.queue.submit=(...s)=>{const n=i(...s);return t.gpuSubmissions++,
n}}async function kn({manifest:c,runtimeAssets:t,artifactPort:e,signal:i,onProgress:s,gpu:n=(d=>(d=globalThis.navigator)==
null?void 0:d.gpu)(),loadOrt:o=()=>import("./ort.webgpu.bundle.min-DjbyQ3vR.js"),createReader:r=gs,prepareImage:h=En,readModelFile:a=_n,
prepareForeground:l=Mn,applyMask:u=Sn}){var N,_,w;const{manifest:f}=gi(c),m={gpuDispatches:0,gpuSubmissions:0,generatedRequests:0};
let p,A,x,y,g,M,E=!1,T=!1,S=!1;const b=I=>{T||(S=!0,m.gpuFailure??(m.gpuFailure=String((I==null?void 0:I.message)??I??"G\
PU device lost").slice(0,300)))},F=I=>b(I.error);async function z(I,R){var L,G;if(S)throw new Error(`Model session lost:\
 3D ${m.gpuFailure}`);const k=["validation","out-of-memory","internal"];for(const B of k)p.pushErrorScope(B);let v,P;try{
v=await R(),await p.queue.onSubmittedWorkDone()}catch(B){P=B}const Y=[];for(const B of k.reverse())try{const V=await p.popErrorScope();
V&&Y.push({filter:B,error:V})}catch(V){Y.push({filter:B,error:V})}if(Y.length||S){const B=((L=Y.find(ht=>ht.filter==="ou\
t-of-memory"))==null?void 0:L.error)??((G=Y[0])==null?void 0:G.error)??m.gpuFailure;b(B),Le(v);const V=new Error(`Model \
session lost: 3D ${I}: ${m.gpuFailure}`,{cause:B});throw V.code="ERR_MESH_GPU",V}if(P){b(P);const B=new Error(`Model ses\
sion lost: 3D ${I}: ${m.gpuFailure}`,{cause:P});throw B.code="ERR_MESH_GPU",B}return v}async function O(){if(T)return;T=
!0,A==null||A.close(),A=null;let I;for(const R of[y,g,M])try{await(R==null?void 0:R.release())}catch(k){I??(I=k)}if(y=g=
M=null,p==null||p.removeEventListener("uncapturederror",F),p==null||p.destroy(),I)throw S=!0,m.gpuFailure??(m.gpuFailure=
String(I.message??I)),I}try{tt(i);const I=await(n==null?void 0:n.requestAdapter({powerPreference:"high-performance"}));if(!I||
I.isFallbackAdapter||(N=I.info)!=null&&N.isFallbackAdapter)throw new Error("3D generation requires hardware WebGPU");if(p=
await I.requestDevice({requiredLimits:{maxBufferSize:I.limits.maxBufferSize,maxStorageBufferBindingSize:I.limits.maxStorageBufferBindingSize}}),
m.adapter={vendor:((_=I.info)==null?void 0:_.vendor)??"",architecture:((w=I.info)==null?void 0:w.architecture)??"",isFallbackAdapter:!1},
m.runtimeFeatures=[...p.features],p.addEventListener("uncapturederror",F),p.lost.then(b,b),Nn(p,m),x=await o(),x.env.versions.
web!==Ds)throw new Error("Unexpected 3D ORT runtime version");x.env.wasm.proxy=!1,x.env.wasm.numThreads=1,x.env.wasm.wasmPaths=
t,A=r(e,{manifest:f,signal:i,maxReadBytes:Ue,maxReads:1,maxQueuedReads:2,readTimeoutMs:6e4});const R=L=>a(A,f.files.find(
G=>G.path===L),i,s),k={executionProviders:[{name:"webgpu",device:p}],enableMemPattern:!1,enableCpuMemArena:!1,extra:{session:{
disable_prepacking:"1"}}};let v=await R("triplane_q8.onnx"),P=await R("triplane_q8.onnx.data");await z("encoder load",async()=>{
y=await x.InferenceSession.create(v,{...k,externalData:[{path:"triplane_q8.onnx.data",data:P}]})}),v=P=null,tt(i);const Y=await R(
"decoder.onnx");if(await z("decoder load",async()=>{g=await x.InferenceSession.create(Y,k)}),tt(i),f.model.backgroundRemoval===
"u2netp"){const L=await R("u2netp.onnx");await z("foreground load",async()=>{M=await x.InferenceSession.create(L,k)})}if(m.
artifactReads=A.getStats(),A.close(),A=null,tt(i),y.inputNames.join()!=="image"||y.outputNames.join()!=="triplane"||g.inputNames.
join()!=="features"||g.outputNames.join()!=="density,color"||M&&(M.inputNames.join()!=="input.1"||M.outputNames.join()!==
"1959,1960,1961,1962,1963,1964,1965"))throw new Error("3D graph interfaces differ from the pinned pipeline")}catch(I){try{
await O()}catch{}throw I}return{get lost(){return S},getEvidence(){return structuredClone(m)},dispose:O,async generate(I,{
signal:R,onProgress:k}={}){if(T)throw new Error("3D model is unloaded");if(E)throw new Error("3D model is already genera\
ting");if(S)throw new Error(`Model session lost: 3D ${m.gpuFailure}`);const v=cs(I,f);E=!0;const P=m.gpuDispatches,Y=m.gpuSubmissions;
try{tt(R),k==null||k({type:"mesh-generation",stage:"image",loaded:0,total:1});let L=v.image;if(M&&!bi(L)){const W=new x.
Tensor("float32",l(L),[1,3,At,At]);let H;try{H=await z("foreground separation",()=>M.run({"input.1":W})),tt(R);const J=H[1959];
if((J==null?void 0:J.type)!=="float32"||J.dims.join()!=="1,1,320,320")throw new Error("Unexpected foreground model outpu\
t");L=u(L,J.data)}finally{W.dispose(),Le(H)}m.foregroundRequests=(m.foregroundRequests??0)+1}tt(R);const G=new x.Tensor(
"float32",h(L),[1,3,512,512]);let B,V;try{B=await z("image encoding",()=>y.run({image:G}));const W=B.triplane;if((W==null?
void 0:W.type)!=="float32"||W.dims.join()!=="1,3,40,64,64")throw new Error("Unexpected TripoSR encoder output");V=qt(new Float32Array(
W.data),"Triplane")}finally{G.dispose(),Le(B)}tt(R);const ht=async W=>{var wi,Ai;tt(R);const H=new x.Tensor("float32",Cn(
V,W),[W.length/3,120]);let J;try{J=await z("field decoding",()=>g.run({features:H}));const Mi=W.length/3;if(((wi=J.density)==
null?void 0:wi.type)!=="float32"||((Ai=J.color)==null?void 0:Ai.type)!=="float32"||J.density.data.length!==Mi||J.color.data.
length!==Mi*3)throw new Error("Unexpected TripoSR decoder output");return{density:qt(new Float32Array(J.density.data),"D\
ensity"),color:qt(new Float32Array(J.color.data),"Vertex colors")}}finally{H.dispose(),Le(J)}},nt=j.resolution**3,lt=new Float32Array(
nt);for(let W=0;W<nt;W+=j.queryBatch){const H=Math.min(j.queryBatch,nt-W);lt.set((await ht(zn(j.resolution,W,H))).density,
W),k==null||k({type:"mesh-generation",stage:"shape",loaded:W+H,total:nt}),await is()}tt(R);const it=Rn(lt),St=it.positions.
length/3;it.colors=new Float32Array(it.positions.length);for(let W=0;W<St;W+=j.queryBatch){const H=Math.min(St,W+j.queryBatch);
it.colors.set(On((await ht(it.positions.subarray(W*3,H*3))).color),W*3),k==null||k({type:"mesh-generation",stage:"color",
loaded:H,total:St}),await is()}if(tt(R),m.gpuDispatches<=P)throw b(new Error("3D execution did not dispatch work on the \
admitted GPU")),new Error(`Model session lost: ${m.gpuFailure}`);const wt=await Os(Fn(it));return tt(R),m.generatedRequests++,
m.lastMesh={vertexCount:wt.vertexCount,triangleCount:wt.triangleCount,byteLength:wt.byteLength},k==null||k({type:"mesh-g\
eneration",stage:"done",loaded:1,total:1}),{text:"",mesh:wt,gpuDispatches:m.gpuDispatches-P,gpuSubmissions:m.gpuSubmissions-
Y}}finally{E=!1}}}}function Dn(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error(
"3D generation requires a ComputeManager-owned worker")}function ys({createEngine:c=kn,assertWorker:t=Dn,validateManifest:e=gi,
validateRuntimeAssets:i=vs,normalizeInput:s=cs,baseUrl:n=(o=>(o=globalThis.location)==null?void 0:o.href)()}={}){const r=new Map,
h=a=>{var l,u;return{sessionId:a.sessionId,manifestCid:a.manifestCid,status:(l=a.engine)!=null&&l.lost?"lost":a.status,workerId:a.
workerId,...(u=a.engine)==null?void 0:u.getEvidence()}};return async function(l,u={}){var m;if(t(),Si(l==null?void 0:l.sessionId),
tt(u.signal),l.command==="load"){if(r.size)throw new Error("Unload the resident 3D model first");const{manifest:p}=e(l.manifest),
A=i(l.runtimeAssets,n),x={sessionId:l.sessionId,manifestCid:l.manifestCid,manifest:p,status:"loading",workerId:u.workerId,
engine:null};r.set(l.sessionId,x);try{return x.engine=await c({manifest:p,runtimeAssets:A,artifactPort:l.artifactPort,signal:u.
signal,onProgress:u.emitProgress}),tt(u.signal),x.status="ready",h(x)}catch(y){try{await((m=x.engine)==null?void 0:m.dispose()),
r.delete(l.sessionId)}catch(g){throw x.status="lost",new AggregateError([y,g],"Model session lost: 3D cleanup failed")}throw y}}
const d=r.get(l.sessionId);if(!d)throw new Error("3D model session is not loaded");if(l.command==="status")return h(d);if(l.
command==="unload")return d.status="unloading",await d.engine.dispose(),r.delete(l.sessionId),{sessionId:l.sessionId,status:"\
unloaded"};if(l.command!=="generate")throw new Error("Unknown 3D model command");if(Si(l.requestId),d.status!=="ready"||
d.engine.lost)throw new Error("Model session lost: 3D model is not ready");const f=s(l,d.manifest);d.status="generating";
try{const p=await d.engine.generate(f,{signal:u.signal,onProgress:u.emitProgress});return tt(u.signal),{...p,sessionId:l.
sessionId,requestId:l.requestId,workerId:d.workerId}}catch(p){throw(p instanceof WebAssembly.RuntimeError||/Model session lost/.
test((p==null?void 0:p.message)??""))&&(d.status="lost"),p}finally{d.status!=="lost"&&(d.status=d.engine.lost?"lost":"re\
ady")}}}const vn=ys();var Yn=Object.freeze({__proto__:null,createMeshTaskHandler:ys,handleModelTask:vn});export{At as F,_s as S,Sn as a,vs as b,ys as c,bi as h,Yn as m,Mn as p,Fs as v};
