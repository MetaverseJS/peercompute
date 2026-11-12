import{c as ms}from"./GgufArtifactReader-DZX454k1.js";import{t as tt,a as wi}from"./ArtifactReadBridge-Bns2fboi.js";import{
b as ps,s as ys}from"./sha2-BwZiqLOA.js";import{n as gs}from"./ArtifactManifest-DPFdnZW5.js";import{validateImageInput as xs}from"./modelTask-DAQz3pz1.js";
const ne=Object.freeze({count:4,dimension:2048,pixels:8*1024**2,byteLength:8*1024**2}),P=c=>{throw new Error(`Invalid ge\
nerated mesh texture: ${c}`)},bs=[137,80,78,71,13,10,26,10];function fi(c,t){return(!Number.isSafeInteger(c)||!Number.isSafeInteger(
t)||c<1||t<1||c>ne.dimension||t>ne.dimension)&&P("dimensions"),{width:c,height:t,pixels:c*t}}function ws(c,t,e){let i=4294967295;
for(let s=t;s<e;s++){i^=c[s];for(let n=0;n<8;n++)i=i>>>1^3988292384&-(i&1)}return(i^4294967295)>>>0}function As(c,t){bs.
every((r,h)=>c[h]===r)||P("PNG signature");let e=8,i,s=!1,n=!1,o=!1;for(;e+12<=c.length;){const r=t.getUint32(e),h=e+12+
r;h>c.length&&P("PNG chunk range");const a=String.fromCharCode(...c.subarray(e+4,e+8));if(t.getUint32(h-4)!==ws(c,e+4,h-
4)&&P("PNG chunk checksum"),["IHDR","IDAT","IEND","PLTE","tRNS","sRGB","gAMA","cHRM","pHYs"].includes(a)||P("PNG chunk t\
ype"),e===8&&a!=="IHDR"&&P("PNG header order"),a==="IHDR")(i||r!==13||c[e+16]!==8||![0,2,3,4,6].includes(c[e+17])||c[e+18]!==
0||c[e+19]!==0||c[e+20]!==0)&&P("PNG header"),i=fi(t.getUint32(e+8),t.getUint32(e+12)),i.colorType=c[e+17];else if(a==="\
PLTE")(s||o||!r||r>768||r%3)&&P("PNG palette"),o=!0;else if(a==="IDAT")(n||i.colorType===3&&!o)&&P("PNG image order"),s=
!0;else{if(a==="IEND")return(r||!s||h!==c.length)&&P("PNG end"),fi(i.width,i.height);{s&&(n=!0);const l={sRGB:1,gAMA:4,cHRM:32,
pHYs:9}[a];(l!==void 0?r!==l:r>256)&&P("PNG metadata length")}}e=h}P("PNG truncated")}function Ms(c,t){(c[0]!==255||c[1]!==
216)&&P("JPEG signature");let e=2,i,s=!1,n=!1;for(;e<c.length;){if(n)for(;e<c.length&&c[e]!==255;)e++;for(c[e++]!==255&&
P("JPEG marker");c[e]===255;)e++;const o=c[e++];if(n&&(o===0||o>=208&&o<=215))continue;if(n=!1,o===217)return(!i||!s||e!==
c.length)&&P("JPEG end"),i;(o===void 0||o===0||o===216||o===1||o>=208&&o<=215||e+2>c.length)&&P("JPEG marker");const r=t.
getUint16(e),h=e+r;if((r<2||h>c.length)&&P("JPEG segment range"),[192,193,194].includes(o)){(i||s||r<11||c[e+2]!==8)&&P(
"JPEG frame");const a=c[e+7];(![1,3].includes(a)||r!==8+3*a)&&P("JPEG components"),i=fi(t.getUint16(e+5),t.getUint16(e+3))}else
o>=192&&o<=207&&![196].includes(o)&&P("JPEG frame type");o===218?((!i||r<6||r!==6+2*c[e+2])&&P("JPEG scan"),s=!0,n=!0):![
192,193,194,196,219,221,254].includes(o)&&!(o>=224&&o<=239)&&P("JPEG unsupported segment"),e=h}P("JPEG truncated")}function ts(c,t){
(!(c instanceof Uint8Array)||c.length<12||c.length>ne.byteLength)&&P("encoded byte limit");const e=new DataView(c.buffer,
c.byteOffset,c.byteLength);if(t==="image/png")return{mimeType:t,...As(c,e)};if(t==="image/jpeg")return{mimeType:t,...Ms(
c,e)};P("MIME type")}const pt=Object.freeze({byteLength:16*1024**2,jsonBytes:256*1024,vertices:1e5,triangles:15e4,coordinate:1e6}),
Ss="model/gltf-binary",Is=new TextEncoder,Ts=new TextDecoder("utf-8",{fatal:!0}),_=c=>{throw new Error(`Invalid generate\
d mesh: ${c}`)};function ot(c,t,e){return(!Number.isSafeInteger(c)||c<t||c>e)&&_("numeric limit"),c}function J(c,t){return(!c||
typeof c!="object"||Array.isArray(c)||Object.keys(c).some(e=>!t.includes(e)))&&_("unsupported GLB field"),c}function Ai(c,t,e=-pt.
coordinate,i=pt.coordinate){return(!Array.isArray(c)||c.length!==t||c.some(s=>!Number.isFinite(s)||s<e||s>i))&&_("invali\
d vector"),[...c]}function Gt(c){return(!Array.isArray(c)||c.length!==1)&&_("expected one static mesh"),c[0]}const mi=(c,t)=>JSON.
stringify(c)===JSON.stringify(t);function Es(c,t=[],{allowTextures:e=!0}={}){const i=new DataView(c.buffer,c.byteOffset,
c.byteLength);(i.getUint32(0,!0)!==1179937895||i.getUint32(4,!0)!==2||i.getUint32(8,!0)!==c.byteLength)&&_("GLB header");
const s=i.getUint32(12,!0);(!s||s%4||s>pt.jsonBytes||20+s+8>c.byteLength||i.getUint32(16,!0)!==1313821514)&&_("JSON chun\
k");let n;try{n=JSON.parse(Ts.decode(c.subarray(20,20+s)))}catch{_("JSON syntax")}const o=20+s,r=i.getUint32(o,!0);(r%4||
i.getUint32(o+4,!0)!==5130562||o+8+r!==c.byteLength)&&_("BIN chunk"),J(n,["asset","scene","scenes","nodes","meshes","buf\
fers","bufferViews","accessors","materials","images","textures","samplers"]),J(n.asset,["version","generator"]),(n.asset.
version!=="2.0"||n.asset.generator!==void 0&&(typeof n.asset.generator!="string"||n.asset.generator.length>128))&&_("ass\
et version"),n.scene!==0&&_("scene");const h=J(Gt(n.scenes),["nodes"]);mi(h.nodes,[0])||_("scene nodes"),J(Gt(n.nodes),[
"mesh"]).mesh!==0&&_("node mesh");const l=J(Gt(n.meshes),["primitives"]),u=J(Gt(l.primitives),["attributes","indices","m\
ode","material"]);u.mode!==void 0&&u.mode!==4&&_("only triangles are supported"),J(u.attributes,["POSITION","NORMAL","CO\
LOR_0","TEXCOORD_0","TANGENT"]),!e&&(u.attributes.TEXCOORD_0!==void 0||u.attributes.TANGENT!==void 0||n.images!==void 0||
n.textures!==void 0||n.samplers!==void 0)&&_("textured profile requires a compatible peer"),Object.hasOwn(u.attributes,"\
POSITION")||_("missing positions");const d=J(Gt(n.buffers),["byteLength"]);ot(d.byteLength,1,r),r-d.byteLength>3&&_("BIN\
 padding"),(!Array.isArray(n.bufferViews)||n.bufferViews.length<2||n.bufferViews.length>6+ne.count||!Array.isArray(n.accessors)||
n.accessors.length<2||n.accessors.length>6)&&_("accessor count");const f=[];for(const x of n.bufferViews){J(x,["buffer",
"byteOffset","byteLength","target"]),(x.buffer!==0||x.target!==void 0&&![34962,34963].includes(x.target))&&_("buffer vie\
w");const b=ot(x.byteOffset??0,0,d.byteLength),w=ot(x.byteLength,1,d.byteLength-b);b%4&&_("buffer alignment"),f.some(([C,
F])=>b<F&&b+w>C)&&_("overlapping buffer views"),f.push([b,b+w])}const m=new Set,p=new Set;function A(x,b){ot(x,0,n.accessors.
length-1),m.has(x)&&_("reused accessor"),m.add(x);const w=J(n.accessors[x],["bufferView","byteOffset","componentType","c\
ount","type","min","max"]);ot(w.bufferView,0,n.bufferViews.length-1),p.has(w.bufferView)&&_("reused buffer view"),p.add(
w.bufferView);const C=b==="indices"?1:b==="uvs"?2:b==="tangents"||b==="colors"&&w.type==="VEC4"?4:3;(w.type!==(C===1?"SC\
ALAR":`VEC${C}`)||(b==="indices"?![5123,5125].includes(w.componentType):w.componentType!==5126))&&_("accessor format");const F=w.
componentType===5123?2:4,O=ot(w.count,3,b==="indices"?pt.triangles*3:pt.vertices),k=f[w.bufferView],D=ot(w.byteOffset??0,
0,k[1]-k[0]);(D%F||D+O*C*F!==k[1]-k[0])&&_("accessor byte range");const N=new DataView(c.buffer,c.byteOffset+o+8+k[0]+D,
O*C*F),B=w.componentType===5126?U=>N.getFloat32(U*4,!0):w.componentType===5125?U=>N.getUint32(U*4,!0):U=>N.getUint16(U*2,
!0);return{entry:w,count:O,components:C,get:B}}const M=A(u.attributes.POSITION,"positions"),y={min:[1/0,1/0,1/0],max:[-1/0,
-1/0,-1/0]};for(let x=0;x<M.count*3;x++){const b=M.get(x);(!Number.isFinite(b)||Math.abs(b)>pt.coordinate)&&_("nonfinite\
 or excessive position"),y.min[x%3]=Math.min(y.min[x%3],b),y.max[x%3]=Math.max(y.max[x%3],b)}for(const x of["min","max"])
mi(Ai(M.entry[x],3),y[x])||_("position bounds mismatch");y.min.every((x,b)=>x===y.max[b])&&_("empty geometry");for(const[
x,b]of[["NORMAL","normals"],["COLOR_0","colors"],["TEXCOORD_0","uvs"],["TANGENT","tangents"]]){if(!Object.hasOwn(u.attributes,
x))continue;const w=A(u.attributes[x],b);(w.count!==M.count||w.entry.min!==void 0||w.entry.max!==void 0)&&_("attribute c\
ount or bounds");for(let C=0;C<w.count*w.components;C++){const F=w.get(C);(!Number.isFinite(F)||F<(["colors","uvs"].includes(
b)?0:-1.001)||F>(["colors","uvs"].includes(b)?1:1.001))&&_("invalid attribute value")}if(b==="normals"||b==="tangents")for(let C=0;C<
w.count;C++){const F=C*w.components,O=Math.hypot(w.get(F),w.get(F+1),w.get(F+2));Math.abs(O-1)>.001&&_("normal or tangen\
t must be a unit vector"),b==="tangents"&&![-1,1].includes(w.get(F+3))&&_("tangent handedness")}}u.attributes.TANGENT!==
void 0&&u.attributes.NORMAL===void 0&&_("tangent requires normals");const g=A(u.indices,"indices");(g.count%3||g.entry.min!==
void 0||g.entry.max!==void 0)&&_("triangle indices");for(let x=0;x<g.count;x++){const b=g.get(x);b>=M.count&&_("index ou\
tside positions"),g.entry.componentType===5123&&b===65535&&_("primitive restart index")}const I=new Set,z=new Set,E=new Set;
function T(x,b=!1){J(x,b?["index","texCoord","scale"]:["index","texCoord"]),(!Array.isArray(n.textures)||x.texCoord!==void 0&&
x.texCoord!==0||u.attributes.TEXCOORD_0===void 0)&&_("texture coordinates"),ot(x.index,0,n.textures.length-1),I.add(x.index),
b&&(u.attributes.NORMAL===void 0||x.scale!==void 0&&(!Number.isFinite(x.scale)||x.scale<0||x.scale>1))&&_("normal textur\
e")}if(n.materials!==void 0){const x=J(Gt(n.materials),["pbrMetallicRoughness","doubleSided","alphaMode","normalTexture"]);
x.doubleSided!==void 0&&typeof x.doubleSided!="boolean"&&_("material"),x.alphaMode!==void 0&&x.alphaMode!=="OPAQUE"&&_("\
material alpha");const b=J(x.pbrMetallicRoughness,["baseColorFactor","metallicFactor","roughnessFactor","baseColorTextur\
e","metallicRoughnessTexture"]);b.baseColorFactor!==void 0&&Ai(b.baseColorFactor,4,0,1);for(const w of["metallicFactor",
"roughnessFactor"])b[w]!==void 0&&(!Number.isFinite(b[w])||b[w]<0||b[w]>1)&&_("material factor");u.material!==0&&_("mate\
rial index");for(const w of["baseColorTexture","metallicRoughnessTexture"])b[w]!==void 0&&T(b[w]);x.normalTexture!==void 0&&
T(x.normalTexture,!0)}else u.material!==void 0&&_("missing material");for(const x of["textures","images","samplers"])n[x]!==
void 0&&(!Array.isArray(n[x])||n[x].length<1||n[x].length>ne.count)&&_("texture table count");for(const x of n.textures??
[])J(x,["source","sampler"]),ot(x.source,0,(n.images?.length??0)-1),z.add(x.source),x.sampler!==void 0&&(ot(x.sampler,0,
(n.samplers?.length??0)-1),E.add(x.sampler));for(const x of n.samplers??[]){J(x,["magFilter","minFilter","wrapS","wrapT"]);
for(const b of["magFilter","minFilter","wrapS","wrapT"])x[b]!==void 0&&!(b.startsWith("wrap")?[33071,33648,10497]:b==="m\
agFilter"?[9728,9729]:[9728,9729,9984,9985,9986,9987]).includes(x[b])&&_("texture sampler")}let S=0;for(const x of n.images??
[]){J(x,["bufferView","mimeType"]),ot(x.bufferView,0,n.bufferViews.length-1),(p.has(x.bufferView)||n.bufferViews[x.bufferView].
target!==void 0)&&_("image buffer view"),p.add(x.bufferView);const b=f[x.bufferView],w=o+8,C=c.subarray(w+b[0],w+b[1]),F=ts(
C,x.mimeType);S+=F.pixels,S>ne.pixels&&_("texture pixel limit"),t.push({...F,data:C})}return(I.size!==(n.textures?.length??
0)||z.size!==(n.images?.length??0)||E.size!==(n.samplers?.length??0))&&_("unused texture resource"),(m.size!==n.accessors.
length||p.size!==n.bufferViews.length)&&_("unused accessor"),{vertexCount:M.count,triangleCount:g.count/3,bounds:y}}function zs(c,t={}){
(!(c?.data instanceof Uint8Array)||c.data.byteLength<32||c.data.byteLength>pt.byteLength)&&_("binary byte limit");const e=new Uint8Array(
c.data),i={format:"glb",mimeType:Ss,byteLength:e.byteLength,sha256:ps(ys(e)),...Es(e,[],t)};for(const s of Object.keys(i))
c[s]!==void 0&&!mi(c[s],i[s])&&_(`${s} mismatch`);return{...i,data:e}}function Cs({positions:c,indices:t,normals:e,colors:i,
uvs:s,tangents:n,textures:o,roughness:r=1,metallic:h=0}){(!(c instanceof Float32Array)||c.length%3||!(t instanceof Uint16Array||
t instanceof Uint32Array)||t.length%3)&&_("geometry arrays");const a=ot(c.length/3,3,pt.vertices);ot(t.length/3,1,pt.triangles),
e!==void 0&&(!(e instanceof Float32Array)||e.length!==c.length)&&_("normal array"),i!==void 0&&(!(i instanceof Float32Array)||
![a*3,a*4].includes(i.length))&&_("color array"),s!==void 0&&(!(s instanceof Float32Array)||s.length!==a*2)&&_("UV array"),
n!==void 0&&(!(n instanceof Float32Array)||n.length!==a*4)&&_("tangent array"),o!==void 0&&J(o,["baseColor","normal","me\
tallicRoughness"]);const l={min:[1/0,1/0,1/0],max:[-1/0,-1/0,-1/0]};for(let b=0;b<c.length;b++)l.min[b%3]=Math.min(l.min[b%
3],c[b]),l.max[b%3]=Math.max(l.max[b%3],c[b]);const u=[],d=[],f=[],m={};let p=0;const A=(b,w,C,F={})=>{const O=d.length,
k=new Uint8Array(b.byteLength),D=new DataView(k.buffer);for(let N=0;N<b.length;N++)b instanceof Float32Array?D.setFloat32(
N*4,b[N],!0):b instanceof Uint32Array?D.setUint32(N*4,b[N],!0):D.setUint16(N*2,b[N],!0);return u.push({offset:p,data:k}),
f.push({buffer:0,byteOffset:p,byteLength:k.byteLength,target:C}),d.push({bufferView:O,componentType:b instanceof Float32Array?
5126:b instanceof Uint32Array?5125:5123,count:w==="SCALAR"?b.length:a,type:w,...F}),p+=Math.ceil(k.byteLength/4)*4,O};m.
POSITION=A(c,"VEC3",34962,l),e!==void 0&&(m.NORMAL=A(e,"VEC3",34962)),i!==void 0&&(m.COLOR_0=A(i,i.length===a*4?"VEC4":"\
VEC3",34962)),s!==void 0&&(m.TEXCOORD_0=A(s,"VEC2",34962)),n!==void 0&&(m.TANGENT=A(n,"VEC4",34962));const M=A(t,"SCALAR",
34963),y={pbrMetallicRoughness:{metallicFactor:h,roughnessFactor:r},doubleSided:!0},g=[],I=[];for(const b of["baseColor",
"normal","metallicRoughness"]){if(o?.[b]===void 0)continue;const w=J(o[b],["data","mimeType"]);ts(w.data,w.mimeType);const C=g.
length;g.push({bufferView:f.length,mimeType:w.mimeType}),I.push({source:C,sampler:0}),f.push({buffer:0,byteOffset:p,byteLength:w.
data.byteLength}),u.push({offset:p,data:w.data}),p+=Math.ceil(w.data.byteLength/4)*4,b==="normal"?y.normalTexture={index:C}:
y.pbrMetallicRoughness[`${b}Texture`]={index:C}}const z=Is.encode(JSON.stringify({asset:{version:"2.0",generator:"PeerCo\
mpute generated mesh"},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:m,indices:M,mode:4,
material:0}]}],materials:[y],buffers:[{byteLength:p}],bufferViews:f,accessors:d,...g.length?{images:g,textures:I,samplers:[
{magFilter:9729,minFilter:9729}]}:{}})),E=Math.ceil(z.byteLength/4)*4,T=28+E+p;(T>pt.byteLength||E>pt.jsonBytes)&&_("enc\
oded byte limit");const S=new Uint8Array(T),x=new DataView(S.buffer);x.setUint32(0,1179937895,!0),x.setUint32(4,2,!0),x.
setUint32(8,T,!0),x.setUint32(12,E,!0),x.setUint32(16,1313821514,!0),S.fill(32,20,20+E),S.set(z,20),x.setUint32(20+E,p,!0),
x.setUint32(24+E,5130562,!0);for(const b of u)S.set(b.data,28+E+b.offset);return zs({data:S})}const se=[{path:"u2netp.on\
nx",size:4574861,sha256:"309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8",source:{repository:"edgetools\
/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",path:"u2netp.onnx"}},{path:"u2netp.README.md",size:2597,sha256:"\
e447db65818dba51c001c1a5c9fc43c56c5c60e5ed2cd858c2bad3a239847ef4",source:{repository:"edgetools/u2netp",revision:"25dee3\
7ab19c5b6ad64ba6578eba63f1ae07720c",path:"README.md"}}],pi={spdx:"Apache-2.0",sourceUrl:"https://raw.githubusercontent.c\
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
`},es={spdx:"MIT",sourceUrl:"https://raw.githubusercontent.com/danielgatis/rembg/991927b77667946dab59c50df31f7d4640e8045\
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
`},is=[{path:"weights.bin",size:2285308688,sha256:"0e5c23c8c502492c0b4432006ac30f2d11b2a4c102a3bf9f21c2fcf094ddbffd",source:{
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
d2f58d27395b0be9c633671b439b4aac482549",path:"tets_indices.bin"}}],Mi={spdx:"LicenseRef-Stability-AI-Community",sourceUrl:"\
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
"Trade Control Laws" means any applicable U.S. and non-U.S. export control and trade sanctions laws and regulations.`},Vt={
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
671b439b4aac482549"}};Vt.files=[...is,...se];Vt.totalBytes=Vt.files.reduce((c,t)=>c+t.size,0);Vt.weightBytes=is[0].size+
se[0].size;Vt.license={spdx:"LicenseRef-Stability-AI-Community AND Apache-2.0",sourceUrl:Mi.sourceUrl,notice:"Powered by\
 Stability AI. Full model license and derivative notice are included. U2Net foreground weights use Apache-2.0.",components:[
{...Mi,derivativeNotice:`This Stability AI Model is licensed under the Stability AI Community License, Copyright © Stabi\
lity AI Ltd. All Rights Reserved

Powered by Stability AI.

Stable Fast 3D originates with Stability AI. The WebGPU port is from
lyonsno/sf3d-webgpu, commit 86b7b68109434ffc33218f5fb697c7057c2518f9.

PeerCompute changed the port's asset loading, worker ownership, raw-image and
texture encoding interfaces, cancellation checks, and allocation cleanup.
The authored bounded artifact adapter streams the same checkpoint tensors and
retains the original WGSL kernels. The model weights themselves are unchanged.
See README.md for the exact integration changes and LICENSE.md for the license.
`},pi,es,{spdx:"MIT AND BSD-3-Clause",sourceUrl:"https://www.npmjs.com/package/@kaminos/webgpu-inference-kit/v/0.1.60",notice:`\
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
`}]};function ss(c){return c&&typeof c=="object"&&!Object.isFrozen(c)&&(Object.values(c).forEach(ss),Object.freeze(c)),c}
const Rs=ss({[Vt.id]:Vt});function Ue(c){return c&&typeof c=="object"&&!Object.isFrozen(c)&&(Object.values(c).forEach(Ue),
Object.freeze(c)),c}const ns=Ue({"triposr-q8-onnx":{id:"triposr-q8-onnx",name:"TripoSR · image to 3D (Q8)",repository:"\
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
weightBytes:484845236,totalBytes:484848869}}),Fs=Ue(Object.values(ns)),At=ns["triposr-q8-onnx"],Os=Ue({"triposr-q8-onnx":{
...At,model:{...At.model,backgroundRemoval:"u2netp"},files:[...At.files,...se],weightBytes:At.weightBytes+se[0].size,totalBytes:At.
totalBytes+se.reduce((c,t)=>c+t.size,0),license:{spdx:"MIT AND Apache-2.0",sourceUrl:At.license.sourceUrl,notice:"TripoS\
R © 2024 Tripo AI & Stability AI (MIT). U²-Net weights: Apache-2.0; rembg distribution © 2020 Daniel Gatis (MIT). Full o\
riginal license texts are retained in this package.",components:[At.license,pi,es]},provenance:{...At.provenance,foreground:{
repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",sourceUrl:"https://github.com/danielga\
tis/rembg/releases/download/v0.0.0/u2netp.onnx",modelCardUrl:"https://huggingface.co/edgetools/u2netp/blob/25dee37ab19c5\
b6ad64ba6578eba63f1ae07720c/README.md",sha256:se[0].sha256,licenseUrl:pi.sourceUrl}},capabilities:{...At.capabilities,executionStatus:"\
tested",executionReason:"Tested in the managed WebGPU worker: actual CubeChat owner chat through peer Qwen and DreamShap\
er to U2NetP foreground removal and TripoSR. Both CubeChat peers displayed the same isolated chair CID; owner reload res\
tored it without regeneration. Static, coarse geometry; no rigging or animation. No shader-f16 required.",executionEvidence:{
checkedAt:"2026-11-11",scope:"Actual owner chat, peer language/image/3D inference, two CubeChat pages and retained objec\
t reload",shaderF16Required:!1,foregroundModel:"u2netp",input:"Opaque DreamShaper 512x512 RGBA chair",meshSha256:"277a96\
3c5b9b66361f7ef7e43deea2fc5e90b770f5897def6b58ea83f186ae16",meshBytes:883820,triangles:7356,peerExecution:"tested",peerProtocol:"\
/peercompute/inference/5.0.0",cubeChat:{pages:2,sameArtifactCid:!0,renderedOnBothPages:!0,ownerReloadWithoutGeneration:!0,
unpinnedObserverCacheCollected:!0}}}},...Rs}),_s="1.31.1",qe=1024**3,Si=Object.freeze({maxModelBytes:qe,minimumCpuBytes:4*
qe,minimumGpuBytes:3*qe}),rs=(c,t)=>c===t||c&&t&&typeof c=="object"&&typeof t=="object"&&Array.isArray(c)===Array.isArray(
t)&&Object.keys(c).length===Object.keys(t).length&&Object.keys(c).every(e=>rs(c[e],t[e]));function gi(c){const t=gs(c),e=t.
model,i=[...Object.values(Os),...Fs].find(n=>n.model.runtime==="onnx-mesh"&&rs(n.model,e));if(!i||t.files.length!==i.files.
length||i.files.some(n=>!t.files.some(o=>o.path===n.path&&o.size===n.size&&o.sha256===n.sha256)))throw new Error("3D mod\
el package differs from its qualified runtime catalog");const s=t.files.reduce((n,o)=>n+o.size,0);if(!Number.isSafeInteger(
s)||s>Si.maxModelBytes)throw new Error("3D model package exceeds its byte budget");return{manifest:t,trusted:i,totalBytes:s,
resourcePolicy:Si}}function os(c,t){if(gi(t),c.task!=null&&c.task!=="image-to-3d")throw new Error("This model generates \
3D objects from images");if(c.audio!=null)throw new Error("3D generation does not accept audio");const e=xs(c.image);if(!e)
throw new Error("3D generation requires an image of one object");if(c.prompt?.trim()||c.messages?.length)throw new Error(
"TripoSR requires image input; generate an image from text first");return{task:"image-to-3d",image:e}}function Ns(c,t=globalThis.
location?.href){if(!c||Object.keys(c).some(s=>!["mjs","wasm"].includes(s)))throw new Error("Unexpected 3D runtime assets");
const e=new URL(t),i={};for(const s of["mjs","wasm"]){if(typeof c[s]!="string")throw new Error("Trusted 3D runtime asset\
s are required");const n=new URL(c[s],e);if(n.origin!==e.origin||n.username||n.password||n.search||n.hash||!["http:","ht\
tps:"].includes(n.protocol)||!new RegExp(`(?:^|/)ort-wasm-simd-threaded\\.asyncify(?:-[A-Za-z0-9_-]+)?\\.${s}$`).test(n.
pathname))throw new Error("3D runtime requires fixed same-origin ORT asyncify assets");i[s]=n.href}return i}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const as="182",yi=0,ks=1,Ii=1,Ti=100,Ei=204,zi=205,Ci=3,Ds=0,hs=300,Ri=1e3,ge=1001,Fi=1002,vs=1006,Bs=1008,Ls=1009,Us=1015,
Ps=1023,cs="",ft="srgb",Oi="srgb-linear",_i="linear",Ge="srgb",Ht=7680,Ni=519,ki=35044,xe=35048,be=2e3,Di=2001;function Ws(c){
for(let t=c.length-1;t>=0;--t)if(c[t]>=65535)return!0;return!1}function vi(c){return document.createElementNS("http://ww\
w.w3.org/1999/xhtml",c)}const Bi={};function et(...c){const t="THREE."+c.shift();console.warn(t,...c)}function Pt(...c){
const t="THREE."+c.shift();console.error(t,...c)}function Li(...c){const t=c.join(" ");t in Bi||(Bi[t]=!0,et(...c))}class Pe{addEventListener(t,e){
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
"fc","fd","fe","ff"];function de(){const c=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|
0,i=Math.random()*4294967295|0;return(Q[c&255]+Q[c>>8&255]+Q[c>>16&255]+Q[c>>24&255]+"-"+Q[t&255]+Q[t>>8&255]+"-"+Q[t>>16&
15|64]+Q[t>>24&255]+"-"+Q[e&63|128]+Q[e>>8&255]+"-"+Q[e>>16&255]+Q[e>>24&255]+Q[i&255]+Q[i>>8&255]+Q[i>>16&255]+Q[i>>24&
255]).toLowerCase()}function v(c,t,e){return Math.max(t,Math.min(e,c))}function Ys(c,t){return(c%t+t)%t}function He(c,t,e){
return(1-e)*c+e*t}function oe(c,t){switch(t.constructor){case Float32Array:return c;case Uint32Array:return c/4294967295;case Uint16Array:
return c/65535;case Uint8Array:return c/255;case Int32Array:return Math.max(c/2147483647,-1);case Int16Array:return Math.
max(c/32767,-1);case Int8Array:return Math.max(c/127,-1);default:throw new Error("Invalid component type.")}}function it(c,t){
switch(t.constructor){case Float32Array:return c;case Uint32Array:return Math.round(c*4294967295);case Uint16Array:return Math.
round(c*65535);case Uint8Array:return Math.round(c*255);case Int32Array:return Math.round(c*2147483647);case Int16Array:
return Math.round(c*32767);case Int8Array:return Math.round(c*127);default:throw new Error("Invalid component type.")}}class yt{constructor(t=0,e=0){
yt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){
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
x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=v(this.x,t.x,e.x),this.y=v(this.y,t.y,e.
y),this}clampScalar(t,e){return this.x=v(this.x,t,e),this.y=v(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.
divideScalar(i||1).multiplyScalar(v(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){
return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(
this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.
x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*
this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.
abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){
const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(v(i,-1,
1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*
e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(
t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,
this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],
this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(
e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),n=this.x-t.x,o=this.y-t.y;return this.x=n*i-o*s+t.x,this.y=n*
s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.
y}}class fe{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,n,o,r){
let h=i[s+0],a=i[s+1],l=i[s+2],u=i[s+3],d=n[o+0],f=n[o+1],m=n[o+2],p=n[o+3];if(r<=0){t[e+0]=h,t[e+1]=a,t[e+2]=l,t[e+3]=u;
return}if(r>=1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=p;return}if(u!==p||h!==d||a!==f||l!==m){let A=h*d+a*f+l*m+u*p;A<0&&(d=
-d,f=-f,m=-m,p=-p,A=-A);let M=1-r;if(A<.9995){const y=Math.acos(A),g=Math.sin(y);M=Math.sin(M*y)/g,r=Math.sin(r*y)/g,h=h*
M+d*r,a=a*M+f*r,l=l*M+m*r,u=u*M+p*r}else{h=h*M+d*r,a=a*M+f*r,l=l*M+m*r,u=u*M+p*r;const y=1/Math.sqrt(h*h+a*a+l*l+u*u);h*=
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
t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(v(this.dot(t),-1,1)))}rotateTowards(t,e){
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
iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,i=0){R.prototype.isVector3=
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
x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ui.setFromEuler(t))}applyAxisAngle(t,e){
return this.applyQuaternion(Ui.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,n=t.elements;return this.
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
v(this.x,t.x,e.x),this.y=v(this.y,t.y,e.y),this.z=v(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=v(this.x,t,e),this.
y=v(this.y,t,e),this.z=v(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(
v(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.
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
sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(v(i,-1,1))}distanceTo(t){
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
cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const je=new R,Ui=new fe;
class vt{constructor(t,e,i,s,n,o,r,h,a){vt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(
t,e,i,s,n,o,r,h,a)}set(t,e,i,s,n,o,r,h,a){const l=this.elements;return l[0]=t,l[1]=s,l[2]=r,l[3]=e,l[4]=n,l[5]=h,l[6]=i,
l[7]=o,l[8]=a,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=
i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(
this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.
set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){
return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,n=this.elements,o=i[0],r=i[3],
h=i[6],a=i[1],l=i[4],u=i[7],d=i[2],f=i[5],m=i[8],p=s[0],A=s[3],M=s[6],y=s[1],g=s[4],I=s[7],z=s[2],E=s[5],T=s[8];return n[0]=
o*p+r*y+h*z,n[3]=o*A+r*g+h*E,n[6]=o*M+r*I+h*T,n[1]=a*p+l*y+u*z,n[4]=a*A+l*g+u*E,n[7]=a*M+l*I+u*T,n[2]=d*p+f*y+m*z,n[5]=d*
A+f*g+m*E,n[8]=d*M+f*I+m*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=
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
t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Xe=new vt,Pi=new vt().set(.4123908,.3575843,
.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Wi=new vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,
1.8759675,.0415551,.0556301,-.203977,1.0569715);function Vs(){const c={enabled:!0,workingColorSpace:Oi,spaces:{},convert:function(s,n,o){
return this.enabled===!1||n===o||!n||!o||(this.spaces[n].transfer===Ge&&(s.r=Ct(s.r),s.g=Ct(s.g),s.b=Ct(s.b)),this.spaces[n].
primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[n].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.
spaces[o].transfer===Ge&&(s.r=re(s.r),s.g=re(s.g),s.b=re(s.b))),s},workingToColorSpace:function(s,n){return this.convert(
s,this.workingColorSpace,n)},colorSpaceToWorking:function(s,n){return this.convert(s,n,this.workingColorSpace)},getPrimaries:function(s){
return this.spaces[s].primaries},getTransfer:function(s){return s===cs?_i:this.spaces[s].transfer},getToneMappingMode:function(s){
return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,n=this.workingColorSpace){
return s.fromArray(this.spaces[n].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,n,o){
return s.copy(this.spaces[n].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.
spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.
spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,n){return Li("ColorManagement: .fro\
mWorkingColorSpace() has been renamed to .workingToColorSpace()."),c.workingToColorSpace(s,n)},toWorkingColorSpace:function(s,n){
return Li("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),c.colorSpaceToWorking(s,
n)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return c.define({[Oi]:{primaries:t,whitePoint:i,transfer:_i,
toXYZ:Pi,fromXYZ:Wi,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ft},outputColorSpaceConfig:{drawingBufferColorSpace:ft}},
[ft]:{primaries:t,whitePoint:i,transfer:Ge,toXYZ:Pi,fromXYZ:Wi,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ft}}}),
c}const ct=Vs();function Ct(c){return c<.04045?c*.0773993808:Math.pow(c*.9478672986+.0521327014,2.4)}function re(c){return c<
.0031308?c*12.92:1.055*Math.pow(c,.41666)-.055}let jt;class qs{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||
typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{jt===void 0&&(jt=vi("canvas")),
jt.width=t.width,jt.height=t.height;const s=jt.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(
t,0,0,t.width,t.height),i=jt}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||
typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=vi(
"canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(
0,0,t.width,t.height),n=s.data;for(let o=0;o<n.length;o++)n[o]=Ct(n[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.
data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.
floor(Ct(e[i]/255)*255):e[i]=Ct(e[i]);return{data:e,width:t.width,height:t.height}}else return et("ImageUtils.sRGBToLine\
ar(): Unsupported image type. No color space conversion applied."),t}}let Gs=0;class Hs{constructor(t=null){this.isSource=
!0,Object.defineProperty(this,"id",{value:Gs++}),this.uuid=de(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){
const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):
typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.
depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&
t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let n;if(Array.
isArray(s)){n=[];for(let o=0,r=s.length;o<r;o++)s[o].isDataTexture?n.push(Je(s[o].image)):n.push(Je(s[o]))}else n=Je(s);
i.url=n}return e||(t.images[this.uuid]=i),i}}function Je(c){return typeof HTMLImageElement<"u"&&c instanceof HTMLImageElement||
typeof HTMLCanvasElement<"u"&&c instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&c instanceof ImageBitmap?qs.getDataURL(
c):c.data?{data:Array.from(c.data),width:c.width,height:c.height,type:c.data.constructor.name}:(et("Texture: Unable to s\
erialize Texture."),{})}let js=0;const Ze=new R;class Wt extends Pe{constructor(t=Wt.DEFAULT_IMAGE,e=Wt.DEFAULT_MAPPING,i=ge,s=ge,n=vs,o=Bs,r=Ps,h=Ls,a=Wt.
DEFAULT_ANISOTROPY,l=cs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:js++}),this.uuid=de(),this.name=
"",this.source=new Hs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=n,this.minFilter=
o,this.anisotropy=a,this.format=r,this.internalFormat=null,this.type=h,this.offset=new yt(0,0),this.repeat=new yt(1,1),this.
center=new yt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new vt,this.generateMipmaps=!0,this.premultiplyAlpha=
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
{type:"dispose"})}transformUv(t){if(this.mapping!==hs)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ri:
t.x=t.x-Math.floor(t.x);break;case ge:t.x=t.x<0?0:1;break;case Fi:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:
t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ri:t.y=t.y-Math.floor(t.y);break;case ge:t.y=t.y<0?
0:1;break;case Fi:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&
(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.
pmremVersion++}}Wt.DEFAULT_IMAGE=null;Wt.DEFAULT_MAPPING=hs;Wt.DEFAULT_ANISOTROPY=1;class me{constructor(t=0,e=0,i=0,s=1){
me.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){
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
i,s,n;const h=t.elements,a=h[0],l=h[4],u=h[8],d=h[1],f=h[5],m=h[9],p=h[2],A=h[6],M=h[10];if(Math.abs(l-d)<.01&&Math.abs(
u-p)<.01&&Math.abs(m-A)<.01){if(Math.abs(l+d)<.1&&Math.abs(u+p)<.1&&Math.abs(m+A)<.1&&Math.abs(a+f+M-3)<.1)return this.set(
1,0,0,0),this;e=Math.PI;const g=(a+1)/2,I=(f+1)/2,z=(M+1)/2,E=(l+d)/4,T=(u+p)/4,S=(m+A)/4;return g>I&&g>z?g<.01?(i=0,s=.707106781,
n=.707106781):(i=Math.sqrt(g),s=E/i,n=T/i):I>z?I<.01?(i=.707106781,s=0,n=.707106781):(s=Math.sqrt(I),i=E/s,n=S/s):z<.01?
(i=.707106781,s=.707106781,n=0):(n=Math.sqrt(z),i=T/n,s=S/n),this.set(i,s,n,e),this}let y=Math.sqrt((A-m)*(A-m)+(u-p)*(u-
p)+(d-l)*(d-l));return Math.abs(y)<.001&&(y=1),this.x=(A-m)/y,this.y=(u-p)/y,this.z=(d-l)/y,this.w=Math.acos((a+f+M-1)/2),
this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){
return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){
return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){
return this.x=v(this.x,t.x,e.x),this.y=v(this.y,t.y,e.y),this.z=v(this.z,t.z,e.z),this.w=v(this.w,t.w,e.w),this}clampScalar(t,e){
return this.x=v(this.x,t,e),this.y=v(this.y,t,e),this.z=v(this.z,t,e),this.w=v(this.w,t,e),this}clampLength(t,e){const i=this.
length();return this.divideScalar(i||1).multiplyScalar(v(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(
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
this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class pe{constructor(t=new R(
1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(
e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(lt.fromArray(t,e));return this}setFromBufferAttribute(t){
this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(lt.fromBufferAttribute(t,e));return this}setFromPoints(t){
this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=lt.
copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.
makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),
this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,
this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?
t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(
this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),
this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.
updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const n=i.getAttribute("position");if(e===!0&&n!==void 0&&t.isInstancedMesh!==
!0)for(let o=0,r=n.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,lt):lt.fromBufferAttribute(n,o),lt.applyMatrix4(t.matrixWorld),
this.expandByPoint(lt);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),we.copy(t.boundingBox)):
(i.boundingBox===null&&i.computeBoundingBox(),we.copy(i.boundingBox)),we.applyMatrix4(t.matrixWorld),this.union(we)}const s=t.
children;for(let n=0,o=s.length;n<o;n++)this.expandByObject(s[n],e);return this}containsPoint(t){return t.x>=this.min.x&&
t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.
min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){
return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.
z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.
y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,lt),lt.distanceToSquared(
t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.
x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=
t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.
z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.
getCenter(ae),Ae.subVectors(this.max,ae),Xt.subVectors(t.a,ae),Jt.subVectors(t.b,ae),Zt.subVectors(t.c,ae),Ot.subVectors(
Jt,Xt),_t.subVectors(Zt,Jt),Bt.subVectors(Xt,Zt);let e=[0,-Ot.z,Ot.y,0,-_t.z,_t.y,0,-Bt.z,Bt.y,Ot.z,0,-Ot.x,_t.z,0,-_t.x,
Bt.z,0,-Bt.x,-Ot.y,Ot.x,0,-_t.y,_t.x,0,-Bt.y,Bt.x,0];return!$e(e,Xt,Jt,Zt,Ae)||(e=[1,0,0,0,1,0,0,0,1],!$e(e,Xt,Jt,Zt,Ae))?
!1:(Me.crossVectors(Ot,_t),e=[Me.x,Me.y,Me.z],$e(e,Xt,Jt,Zt,Ae))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){
return this.clampPoint(t,lt).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),
t.radius=this.getSize(lt).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.
makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:
(Mt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Mt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),
Mt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Mt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),
Mt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Mt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),
Mt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Mt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),
this.setFromPoints(Mt),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.
min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.
fromArray(t.min),this.max.fromArray(t.max),this}}const Mt=[new R,new R,new R,new R,new R,new R,new R,new R],lt=new R,we=new pe,
Xt=new R,Jt=new R,Zt=new R,Ot=new R,_t=new R,Bt=new R,ae=new R,Ae=new R,Me=new R,Lt=new R;function $e(c,t,e,i,s){for(let n=0,
o=c.length-3;n<=o;n+=3){Lt.fromArray(c,n);const r=s.x*Math.abs(Lt.x)+s.y*Math.abs(Lt.y)+s.z*Math.abs(Lt.z),h=t.dot(Lt),a=e.
dot(Lt),l=i.dot(Lt);if(Math.max(-Math.max(h,a,l),Math.min(h,a,l))>r)return!1}return!0}const Xs=new pe,he=new R,Qe=new R;
class xi{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.
radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Xs.setFromPoints(t).getCenter(i);let s=0;for(let n=0,
o=t.length;n<o;n++)s=Math.max(s,i.distanceToSquared(t[n]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.
copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=
-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(
this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=
e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=
this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(
this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),
t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.
radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())
return this.center.copy(t),this.radius=0,this;he.subVectors(t,this.center);const e=he.lengthSq();if(e>this.radius*this.radius){
const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(he,s/i),this.radius+=s}return this}union(t){return t.
isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.
radius):(Qe.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(he.copy(t.center).add(Qe)),this.expandByPoint(
he.copy(t.center).sub(Qe))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.
constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=
t.radius,this.center.fromArray(t.center),this}}const St=new R,Ke=new R,Se=new R,Nt=new R,ti=new R,Ie=new R,ei=new R;class Js{constructor(t=new R,e=new R(
0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.
origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,
t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,
St)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):
e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){
const e=St.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(St.copy(this.origin).
addScaledVector(this.direction,e),St.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Ke.copy(t).add(e).multiplyScalar(
.5),Se.copy(e).sub(t).normalize(),Nt.copy(this.origin).sub(Ke);const n=t.distanceTo(e)*.5,o=-this.direction.dot(Se),r=Nt.
dot(this.direction),h=-Nt.dot(Se),a=Nt.lengthSq(),l=Math.abs(1-o*o);let u,d,f,m;if(l>0)if(u=o*h-r,d=o*r-h,m=n*l,u>=0)if(d>=
-m)if(d<=m){const p=1/l;u*=p,d*=p,f=u*(u+o*d+2*r)+d*(o*u+d+2*h)+a}else d=n,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*h)+a;else
d=-n,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*h)+a;else d<=-m?(u=Math.max(0,-(-o*n+r)),d=u>0?-n:Math.min(Math.max(-n,-h),n),
f=-u*u+d*(d+2*h)+a):d<=m?(u=0,d=Math.min(Math.max(-n,-h),n),f=d*(d+2*h)+a):(u=Math.max(0,-(o*n+r)),d=u>0?n:Math.min(Math.
max(-n,-h),n),f=-u*u+d*(d+2*h)+a);else d=o>0?-n:n,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*h)+a;return i&&i.copy(this.origin).
addScaledVector(this.direction,u),s&&s.copy(Ke).addScaledVector(Se,d),f}intersectSphere(t,e){St.subVectors(t.center,this.
origin);const i=St.dot(this.direction),s=St.dot(St)-i*i,n=t.radius*t.radius;if(s>n)return null;const o=Math.sqrt(n-s),r=i-
o,h=i+o;return h<0?null:r<0?this.at(h,e):this.at(r,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.
center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.
origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.
distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===
0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,n,o,r,h;const a=1/this.direction.x,l=1/this.direction.y,u=1/
this.direction.z,d=this.origin;return a>=0?(i=(t.min.x-d.x)*a,s=(t.max.x-d.x)*a):(i=(t.max.x-d.x)*a,s=(t.min.x-d.x)*a),l>=
0?(n=(t.min.y-d.y)*l,o=(t.max.y-d.y)*l):(n=(t.max.y-d.y)*l,o=(t.min.y-d.y)*l),i>o||n>s||((n>i||isNaN(i))&&(i=n),(o<s||isNaN(
s))&&(s=o),u>=0?(r=(t.min.z-d.z)*u,h=(t.max.z-d.z)*u):(r=(t.max.z-d.z)*u,h=(t.min.z-d.z)*u),i>h||r>s)||((r>i||i!==i)&&(i=
r),(h<s||s!==s)&&(s=h),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,St)!==null}intersectTriangle(t,e,i,s,n){
ti.subVectors(e,t),Ie.subVectors(i,t),ei.crossVectors(ti,Ie);let o=this.direction.dot(ei),r;if(o>0){if(s)return null;r=1}else if(o<
0)r=-1,o=-o;else return null;Nt.subVectors(this.origin,t);const h=r*this.direction.dot(Ie.crossVectors(Nt,Ie));if(h<0)return null;
const a=r*this.direction.dot(ti.cross(Nt));if(a<0||h+a>o)return null;const l=-r*Nt.dot(ei);return l<0?null:this.at(l/o,n)}applyMatrix4(t){
return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&
t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class gt{constructor(t,e,i,s,n,o,r,h,a,l,u,d,f,m,p,A){
gt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,n,o,r,h,a,l,u,d,f,
m,p,A)}set(t,e,i,s,n,o,r,h,a,l,u,d,f,m,p,A){const M=this.elements;return M[0]=t,M[4]=e,M[8]=i,M[12]=s,M[1]=n,M[5]=o,M[9]=
r,M[13]=h,M[2]=a,M[6]=l,M[10]=u,M[14]=d,M[3]=f,M[7]=m,M[11]=p,M[15]=A,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,
0,1,0,0,0,0,1),this}clone(){return new gt().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=
i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=
i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=
i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],
e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinant()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.
setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.
set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();
const e=this.elements,i=t.elements,s=1/$t.setFromMatrixColumn(t,0).length(),n=1/$t.setFromMatrixColumn(t,1).length(),o=1/
$t.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*n,e[5]=i[5]*n,e[6]=i[6]*
n,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.
elements,i=t.x,s=t.y,n=t.z,o=Math.cos(i),r=Math.sin(i),h=Math.cos(s),a=Math.sin(s),l=Math.cos(n),u=Math.sin(n);if(t.order===
"XYZ"){const d=o*l,f=o*u,m=r*l,p=r*u;e[0]=h*l,e[4]=-h*u,e[8]=a,e[1]=f+m*a,e[5]=d-p*a,e[9]=-r*h,e[2]=p-d*a,e[6]=m+f*a,e[10]=
o*h}else if(t.order==="YXZ"){const d=h*l,f=h*u,m=a*l,p=a*u;e[0]=d+p*r,e[4]=m*r-f,e[8]=o*a,e[1]=o*u,e[5]=o*l,e[9]=-r,e[2]=
f*r-m,e[6]=p+d*r,e[10]=o*h}else if(t.order==="ZXY"){const d=h*l,f=h*u,m=a*l,p=a*u;e[0]=d-p*r,e[4]=-o*u,e[8]=m+f*r,e[1]=f+
m*r,e[5]=o*l,e[9]=p-d*r,e[2]=-o*a,e[6]=r,e[10]=o*h}else if(t.order==="ZYX"){const d=o*l,f=o*u,m=r*l,p=r*u;e[0]=h*l,e[4]=
m*a-f,e[8]=d*a+p,e[1]=h*u,e[5]=p*a+d,e[9]=f*a-m,e[2]=-a,e[6]=r*h,e[10]=o*h}else if(t.order==="YZX"){const d=o*h,f=o*a,m=r*
h,p=r*a;e[0]=h*l,e[4]=p-d*u,e[8]=m*u+f,e[1]=u,e[5]=o*l,e[9]=-r*l,e[2]=-a*l,e[6]=f*u+m,e[10]=d-p*u}else if(t.order==="XZY"){
const d=o*h,f=o*a,m=r*h,p=r*a;e[0]=h*l,e[4]=-u,e[8]=a*l,e[1]=d*u+p,e[5]=o*l,e[9]=f*u-m,e[2]=m*u-f,e[6]=r*l,e[10]=p*u+d}return e[3]=
0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Zs,t,$s)}lookAt(t,e,i){
const s=this.elements;return nt.subVectors(t,e),nt.lengthSq()===0&&(nt.z=1),nt.normalize(),kt.crossVectors(i,nt),kt.lengthSq()===
0&&(Math.abs(i.z)===1?nt.x+=1e-4:nt.z+=1e-4,nt.normalize(),kt.crossVectors(i,nt)),kt.normalize(),Te.crossVectors(nt,kt),
s[0]=kt.x,s[4]=Te.x,s[8]=nt.x,s[1]=kt.y,s[5]=Te.y,s[9]=nt.y,s[2]=kt.z,s[6]=Te.z,s[10]=nt.z,this}multiply(t){return this.
multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.
elements,n=this.elements,o=i[0],r=i[4],h=i[8],a=i[12],l=i[1],u=i[5],d=i[9],f=i[13],m=i[2],p=i[6],A=i[10],M=i[14],y=i[3],
g=i[7],I=i[11],z=i[15],E=s[0],T=s[4],S=s[8],x=s[12],b=s[1],w=s[5],C=s[9],F=s[13],O=s[2],k=s[6],D=s[10],N=s[14],B=s[3],U=s[7],
H=s[11],Y=s[15];return n[0]=o*E+r*b+h*O+a*B,n[4]=o*T+r*w+h*k+a*U,n[8]=o*S+r*C+h*D+a*H,n[12]=o*x+r*F+h*N+a*Y,n[1]=l*E+u*b+
d*O+f*B,n[5]=l*T+u*w+d*k+f*U,n[9]=l*S+u*C+d*D+f*H,n[13]=l*x+u*F+d*N+f*Y,n[2]=m*E+p*b+A*O+M*B,n[6]=m*T+p*w+A*k+M*U,n[10]=
m*S+p*C+A*D+M*H,n[14]=m*x+p*F+A*N+M*Y,n[3]=y*E+g*b+I*O+z*B,n[7]=y*T+g*w+I*k+z*U,n[11]=y*S+g*C+I*D+z*H,n[15]=y*x+g*F+I*N+
z*Y,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=
t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],
s=t[8],n=t[12],o=t[1],r=t[5],h=t[9],a=t[13],l=t[2],u=t[6],d=t[10],f=t[14],m=t[3],p=t[7],A=t[11],M=t[15],y=h*f-a*d,g=r*f-
a*u,I=r*d-h*u,z=o*f-a*l,E=o*d-h*l,T=o*u-r*l;return e*(p*y-A*g+M*I)-i*(m*y-A*z+M*E)+s*(m*g-p*z+M*T)-n*(m*I-p*E+A*T)}transpose(){
const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],
t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?
(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],n=t[3],
o=t[4],r=t[5],h=t[6],a=t[7],l=t[8],u=t[9],d=t[10],f=t[11],m=t[12],p=t[13],A=t[14],M=t[15],y=u*A*a-p*d*a+p*h*f-r*A*f-u*h*
M+r*d*M,g=m*d*a-l*A*a-m*h*f+o*A*f+l*h*M-o*d*M,I=l*p*a-m*u*a+m*r*f-o*p*f-l*r*M+o*u*M,z=m*u*h-l*p*h-m*r*d+o*p*d+l*r*A-o*u*
A,E=e*y+i*g+s*I+n*z;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/E;return t[0]=y*T,t[1]=(p*d*n-u*
A*n-p*s*f+i*A*f+u*s*M-i*d*M)*T,t[2]=(r*A*n-p*h*n+p*s*a-i*A*a-r*s*M+i*h*M)*T,t[3]=(u*h*n-r*d*n-u*s*a+i*d*a+r*s*f-i*h*f)*T,
t[4]=g*T,t[5]=(l*A*n-m*d*n+m*s*f-e*A*f-l*s*M+e*d*M)*T,t[6]=(m*h*n-o*A*n-m*s*a+e*A*a+o*s*M-e*h*M)*T,t[7]=(o*d*n-l*h*n+l*s*
a-e*d*a-o*s*f+e*h*f)*T,t[8]=I*T,t[9]=(m*u*n-l*p*n-m*i*f+e*p*f+l*i*M-e*u*M)*T,t[10]=(o*p*n-m*r*n+m*i*a-e*p*a-o*i*M+e*r*M)*
T,t[11]=(l*r*n-o*u*n-l*i*a+e*u*a+o*i*f-e*r*f)*T,t[12]=z*T,t[13]=(l*p*s-m*u*s+m*i*d-e*p*d-l*i*A+e*u*A)*T,t[14]=(m*r*s-o*p*
s-m*i*h+e*p*h+o*i*A-e*r*A)*T,t[15]=(o*u*s-l*r*s+l*i*h-e*u*h-o*i*d+e*r*d)*T,this}scale(t){const e=this.elements,i=t.x,s=t.
y,n=t.z;return e[0]*=i,e[4]*=s,e[8]*=n,e[1]*=i,e[5]*=s,e[9]*=n,e[2]*=i,e[6]*=s,e[10]*=n,e[3]*=i,e[7]*=s,e[11]*=n,this}getMaxScaleOnAxis(){
const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];
return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,
1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,
0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,
0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),
this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),n=1-i,o=t.x,r=t.y,h=t.z,a=n*o,l=n*r;return this.set(a*o+i,a*
r-s*h,a*h+s*r,0,a*r+s*h,l*r+i,l*h-s*o,0,a*h-s*r,l*h+s*o,n*h*h+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,
0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,n,o){return this.set(1,i,n,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){
const s=this.elements,n=e._x,o=e._y,r=e._z,h=e._w,a=n+n,l=o+o,u=r+r,d=n*a,f=n*l,m=n*u,p=o*l,A=o*u,M=r*u,y=h*a,g=h*l,I=h*
u,z=i.x,E=i.y,T=i.z;return s[0]=(1-(p+M))*z,s[1]=(f+I)*z,s[2]=(m-g)*z,s[3]=0,s[4]=(f-I)*E,s[5]=(1-(d+M))*E,s[6]=(A+y)*E,
s[7]=0,s[8]=(m+g)*T,s[9]=(A-y)*T,s[10]=(1-(d+p))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.
elements;if(t.x=s[12],t.y=s[13],t.z=s[14],this.determinant()===0)return i.set(1,1,1),e.identity(),this;let n=$t.set(s[0],
s[1],s[2]).length();const o=$t.set(s[4],s[5],s[6]).length(),r=$t.set(s[8],s[9],s[10]).length();this.determinant()<0&&(n=
-n),ut.copy(this);const a=1/n,l=1/o,u=1/r;return ut.elements[0]*=a,ut.elements[1]*=a,ut.elements[2]*=a,ut.elements[4]*=l,
ut.elements[5]*=l,ut.elements[6]*=l,ut.elements[8]*=u,ut.elements[9]*=u,ut.elements[10]*=u,e.setFromRotationMatrix(ut),i.
x=n,i.y=o,i.z=r,this}makePerspective(t,e,i,s,n,o,r=be,h=!1){const a=this.elements,l=2*n/(e-t),u=2*n/(i-s),d=(e+t)/(e-t),
f=(i+s)/(i-s);let m,p;if(h)m=n/(o-n),p=o*n/(o-n);else if(r===be)m=-(o+n)/(o-n),p=-2*o*n/(o-n);else if(r===Di)m=-o/(o-n),
p=-o*n/(o-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return a[0]=l,a[4]=0,
a[8]=d,a[12]=0,a[1]=0,a[5]=u,a[9]=f,a[13]=0,a[2]=0,a[6]=0,a[10]=m,a[14]=p,a[3]=0,a[7]=0,a[11]=-1,a[15]=0,this}makeOrthographic(t,e,i,s,n,o,r=be,h=!1){
const a=this.elements,l=2/(e-t),u=2/(i-s),d=-(e+t)/(e-t),f=-(i+s)/(i-s);let m,p;if(h)m=1/(o-n),p=o/(o-n);else if(r===be)
m=-2/(o-n),p=-(o+n)/(o-n);else if(r===Di)m=-1/(o-n),p=-n/(o-n);else throw new Error("THREE.Matrix4.makeOrthographic(): I\
nvalid coordinate system: "+r);return a[0]=l,a[4]=0,a[8]=0,a[12]=d,a[1]=0,a[5]=u,a[9]=0,a[13]=f,a[2]=0,a[6]=0,a[10]=m,a[14]=
p,a[3]=0,a[7]=0,a[11]=0,a[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;
return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;
return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=
i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const $t=new R,ut=new gt,Zs=new R(
0,0,0),$s=new R(1,1,1),kt=new R,Te=new R,nt=new R,Yi=new gt,Vi=new fe;class ye{constructor(t=0,e=0,i=0,s=ye.DEFAULT_ORDER){
this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){
return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){
return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=
e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this.
_order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this.
_order,i=!0){const s=t.elements,n=s[0],o=s[4],r=s[8],h=s[1],a=s[5],l=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this.
_y=Math.asin(v(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-o,n)):(this._x=Math.atan2(d,a),
this._z=0);break;case"YXZ":this._x=Math.asin(-v(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(
h,a)):(this._y=Math.atan2(-u,n),this._z=0);break;case"ZXY":this._x=Math.asin(v(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.
atan2(-u,f),this._z=Math.atan2(-o,a)):(this._y=0,this._z=Math.atan2(h,n));break;case"ZYX":this._y=Math.asin(-v(u,-1,1)),
Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(h,n)):(this._x=0,this._z=Math.atan2(-o,a));break;case"Y\
ZX":this._z=Math.asin(v(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-l,a),this._y=Math.atan2(-u,n)):(this._x=0,this.
_y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-v(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,a),this._y=
Math.atan2(r,n)):(this._x=Math.atan2(-l,f),this._y=0);break;default:et("Euler: .setFromRotationMatrix() encountered an u\
nknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Yi.makeRotationFromQuaternion(
t),this.setFromRotationMatrix(Yi,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Vi.
setFromEuler(this),this.setFromQuaternion(Vi,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===
this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),
this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=
t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ye.DEFAULT_ORDER=
"XYZ";class Qs{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=
-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==
0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Ks=0;const qi=new R,Qt=new fe,It=new gt,Ee=new R,ce=new R,tn=new R,en=new fe,
Gi=new R(1,0,0),Hi=new R(0,1,0),ji=new R(0,0,1),Xi={type:"added"},sn={type:"removed"},Kt={type:"childadded",child:null},
ii={type:"childremoved",child:null};class Rt extends Pe{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,
"id",{value:Ks++}),this.uuid=de(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Rt.DEFAULT_UP.
clone();const t=new R,e=new ye,i=new fe,s=new R(1,1,1);function n(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(
i,void 0,!1)}e._onChange(n),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},
rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,
enumerable:!0,value:s},modelViewMatrix:{value:new gt},normalMatrix:{value:new vt}}),this.matrix=new gt,this.matrixWorld=
new gt,this.matrixAutoUpdate=Rt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,
this.matrixWorldNeedsUpdate=!1,this.layers=new Qs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=
!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData=
{}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),
this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.
quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){
this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){
this.quaternion.copy(t)}rotateOnAxis(t,e){return Qt.setFromAxisAngle(t,e),this.quaternion.multiply(Qt),this}rotateOnWorldAxis(t,e){
return Qt.setFromAxisAngle(t,e),this.quaternion.premultiply(Qt),this}rotateX(t){return this.rotateOnAxis(Gi,t)}rotateY(t){
return this.rotateOnAxis(Hi,t)}rotateZ(t){return this.rotateOnAxis(ji,t)}translateOnAxis(t,e){return qi.copy(t).applyQuaternion(
this.quaternion),this.position.add(qi.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Gi,t)}translateY(t){
return this.translateOnAxis(Hi,t)}translateZ(t){return this.translateOnAxis(ji,t)}localToWorld(t){return this.updateWorldMatrix(
!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(It.copy(this.
matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Ee.copy(t):Ee.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,
!1),ce.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?It.lookAt(ce,Ee,this.up):It.lookAt(Ee,ce,this.
up),this.quaternion.setFromRotationMatrix(It),s&&(It.extractRotation(s.matrixWorld),Qt.setFromRotationMatrix(It),this.quaternion.
premultiply(Qt.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}
return t===this?(Pt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),
t.parent=this,this.children.push(t),t.dispatchEvent(Xi),Kt.child=t,this.dispatchEvent(Kt),Kt.child=null):Pt("Object3D.ad\
d: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)
this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(
e,1),t.dispatchEvent(sn),ii.child=t,this.dispatchEvent(ii),ii.child=null),this}removeFromParent(){const t=this.parent;return t!==
null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),It.
copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),It.multiply(t.parent.matrixWorld)),t.
applyMatrix4(It),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Xi),
Kt.child=t,this.dispatchEvent(Kt),Kt.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){
return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.
length;i<s;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){
this[t]===e&&i.push(this);const s=this.children;for(let n=0,o=s.length;n<o;n++)s[n].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){
return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(
!0,!1),this.matrixWorld.decompose(ce,t,tn),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(
ce,en,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).
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
t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Rt.DEFAULT_UP=new R(0,1,0);Rt.DEFAULT_MATRIX_AUTO_UPDATE=
!0;Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const dt=new R,Tt=new R,si=new R,Et=new R,te=new R,ee=new R,Ji=new R,ni=new R,
ri=new R,oi=new R,ai=new me,hi=new me,ci=new me;class mt{constructor(t=new R,e=new R,i=new R){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){
s.subVectors(i,e),dt.subVectors(t,e),s.cross(dt);const n=s.lengthSq();return n>0?s.multiplyScalar(1/Math.sqrt(n)):s.set(
0,0,0)}static getBarycoord(t,e,i,s,n){dt.subVectors(s,e),Tt.subVectors(i,e),si.subVectors(t,e);const o=dt.dot(dt),r=dt.dot(
Tt),h=dt.dot(si),a=Tt.dot(Tt),l=Tt.dot(si),u=o*a-r*r;if(u===0)return n.set(0,0,0),null;const d=1/u,f=(a*h-r*l)*d,m=(o*l-
r*h)*d;return n.set(1-f-m,m,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Et)===null?!1:Et.x>=0&&Et.
y>=0&&Et.x+Et.y<=1}static getInterpolation(t,e,i,s,n,o,r,h){return this.getBarycoord(t,e,i,s,Et)===null?(h.x=0,h.y=0,"z"in
h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(n,Et.x),h.addScaledVector(o,Et.y),h.addScaledVector(
r,Et.z),h)}static getInterpolatedAttribute(t,e,i,s,n,o){return ai.setScalar(0),hi.setScalar(0),ci.setScalar(0),ai.fromBufferAttribute(
t,e),hi.fromBufferAttribute(t,i),ci.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(ai,n.x),o.addScaledVector(
hi,n.y),o.addScaledVector(ci,n.z),o}static isFrontFacing(t,e,i,s){return dt.subVectors(i,e),Tt.subVectors(t,e),dt.cross(
Tt).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.
a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(
t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){
return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return dt.subVectors(this.c,this.b),Tt.subVectors(
this.a,this.b),dt.cross(Tt).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){
return mt.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){
return mt.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,n){return mt.getInterpolation(t,this.a,this.b,
this.c,e,i,s,n)}containsPoint(t){return mt.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return mt.isFrontFacing(
this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.
b,n=this.c;let o,r;te.subVectors(s,i),ee.subVectors(n,i),ni.subVectors(t,i);const h=te.dot(ni),a=ee.dot(ni);if(h<=0&&a<=
0)return e.copy(i);ri.subVectors(t,s);const l=te.dot(ri),u=ee.dot(ri);if(l>=0&&u<=l)return e.copy(s);const d=h*u-l*a;if(d<=
0&&h>=0&&l<=0)return o=h/(h-l),e.copy(i).addScaledVector(te,o);oi.subVectors(t,n);const f=te.dot(oi),m=ee.dot(oi);if(m>=
0&&f<=m)return e.copy(n);const p=f*a-h*m;if(p<=0&&a>=0&&m<=0)return r=a/(a-m),e.copy(i).addScaledVector(ee,r);const A=l*
m-f*u;if(A<=0&&u-l>=0&&f-m>=0)return Ji.subVectors(n,s),r=(u-l)/(u-l+(f-m)),e.copy(s).addScaledVector(Ji,r);const M=1/(A+
p+d);return o=p*M,r=d*M,e.copy(i).addScaledVector(te,o).addScaledVector(ee,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(
this.b)&&t.c.equals(this.c)}}const ls={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,
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
Dt={h:0,s:0,l:0},ze={h:0,s:0,l:0};function li(c,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?c+(t-c)*6*e:e<1/2?t:e<2/3?c+(t-
c)*6*(2/3-e):c}class zt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){
if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.
setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ft){return t=
Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ct.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=ct.
workingColorSpace){return this.r=t,this.g=e,this.b=i,ct.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=ct.workingColorSpace){
if(t=Ys(t,1),e=v(e,0,1),i=v(i,0,1),e===0)this.r=this.g=this.b=i;else{const n=i<=.5?i*(1+e):i+e-i*e,o=2*i-n;this.r=li(o,n,
t+1/3),this.g=li(o,n,t),this.b=li(o,n,t-1/3)}return ct.colorSpaceToWorking(this,s),this}setStyle(t,e=ft){function i(n){n!==
void 0&&parseFloat(n)<1&&et("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){
let n;const o=s[1],r=s[2];switch(o){case"rgb":case"rgba":if(n=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.
exec(r))return i(n[4]),this.setRGB(Math.min(255,parseInt(n[1],10))/255,Math.min(255,parseInt(n[2],10))/255,Math.min(255,
parseInt(n[3],10))/255,e);if(n=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(n[4]),
this.setRGB(Math.min(100,parseInt(n[1],10))/100,Math.min(100,parseInt(n[2],10))/100,Math.min(100,parseInt(n[3],10))/100,
e);break;case"hsl":case"hsla":if(n=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.
exec(r))return i(n[4]),this.setHSL(parseFloat(n[1])/360,parseFloat(n[2])/100,parseFloat(n[3])/100,e);break;default:et("C\
olor: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const n=s[1],o=n.length;if(o===3)return this.setRGB(
parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(
n,16),e);et("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ft){
const i=ls[t.toLowerCase()];return i!==void 0?this.setHex(i,e):et("Color: Unknown color "+t),this}clone(){return new this.
constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=
Ct(t.r),this.g=Ct(t.g),this.b=Ct(t.b),this}copyLinearToSRGB(t){return this.r=re(t.r),this.g=re(t.g),this.b=re(t.b),this}convertSRGBToLinear(){
return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ft){return ct.
workingToColorSpace(K.copy(this),t),Math.round(v(K.r*255,0,255))*65536+Math.round(v(K.g*255,0,255))*256+Math.round(v(K.b*
255,0,255))}getHexString(t=ft){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ct.workingColorSpace){ct.
workingToColorSpace(K.copy(this),e);const i=K.r,s=K.g,n=K.b,o=Math.max(i,s,n),r=Math.min(i,s,n);let h,a;const l=(r+o)/2;
if(r===o)h=0,a=0;else{const u=o-r;switch(a=l<=.5?u/(o+r):u/(2-o-r),o){case i:h=(s-n)/u+(s<n?6:0);break;case s:h=(n-i)/u+
2;break;case n:h=(i-s)/u+4;break}h/=6}return t.h=h,t.s=a,t.l=l,t}getRGB(t,e=ct.workingColorSpace){return ct.workingToColorSpace(
K.copy(this),e),t.r=K.r,t.g=K.g,t.b=K.b,t}getStyle(t=ft){ct.workingToColorSpace(K.copy(this),t);const e=K.r,i=K.g,s=K.b;
return t!==ft?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)}\
,${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Dt),this.setHSL(Dt.h+t,Dt.s+e,Dt.l+i)}add(t){return this.r+=
t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.
r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(
0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=
t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){
return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Dt),t.getHSL(ze);
const i=He(Dt.h,ze.h,e),s=He(Dt.s,ze.s,e),n=He(Dt.l,ze.l,e);return this.setHSL(i,s,n),this}setFromVector3(t){return this.
r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,n=t.elements;return this.r=n[0]*e+n[3]*
i+n[6]*s,this.g=n[1]*e+n[4]*i+n[7]*s,this.b=n[2]*e+n[5]*i+n[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===
this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=
this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){
return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const K=new zt;zt.NAMES=ls;let nn=0;class rn extends Pe{constructor(){
super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:nn++}),this.uuid=de(),this.name="",this.type="Material",
this.blending=Ii,this.side=yi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ei,
this.blendDst=zi,this.blendEquation=Ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.
blendColor=new zt(0,0,0),this.blendAlpha=0,this.depthFunc=Ci,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=
255,this.stencilFunc=Ni,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ht,this.stencilZFail=Ht,this.stencilZPass=
Ht,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.
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
this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ii&&(i.blending=
this.blending),this.side!==yi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=
this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ei&&(i.blendSrc=this.blendSrc),this.blendDst!==zi&&
(i.blendDst=this.blendDst),this.blendEquation!==Ti&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=
this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=
this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==
0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ci&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.
depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.
stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ni&&(i.stencilFunc=this.stencilFunc),
this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),
this.stencilFail!==Ht&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ht&&(i.stencilZFail=this.stencilZFail),this.
stencilZPass!==Ht&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==
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
t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class us extends rn{constructor(t){
super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new zt(16777215),this.map=null,this.lightMap=
null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=
null,this.envMapRotation=new ye,this.combine=Ds,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=
1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),
this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.
aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,
this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=
t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,
this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const G=new R,Ce=new yt;let on=0;class wt{constructor(t,e,i=!1){
if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=
!0,Object.defineProperty(this,"id",{value:on++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/
e:0,this.normalized=i,this.usage=ki,this.updateRanges=[],this.gpuType=Us,this.version=0}onUploadCallback(){}set needsUpdate(t){
t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){
this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,
this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,
i*=e.itemSize;for(let s=0,n=this.itemSize;s<n;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.
set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix3(
t),this.setXY(e,Ce.x,Ce.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)G.fromBufferAttribute(this,e),G.applyMatrix3(
t),this.setXYZ(e,G.x,G.y,G.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)G.fromBufferAttribute(this,e),
G.applyMatrix4(t),this.setXYZ(e,G.x,G.y,G.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)G.fromBufferAttribute(
this,e),G.applyNormalMatrix(t),this.setXYZ(e,G.x,G.y,G.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)
G.fromBufferAttribute(this,e),G.transformDirection(t),this.setXYZ(e,G.x,G.y,G.z);return this}set(t,e=0){return this.array.
set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=oe(i,this.array)),i}setComponent(t,e,i){
return this.normalized&&(i=it(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];
return this.normalized&&(e=oe(e,this.array)),e}setX(t,e){return this.normalized&&(e=it(e,this.array)),this.array[t*this.
itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=oe(e,this.array)),e}setY(t,e){return this.
normalized&&(e=it(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.
normalized&&(e=oe(e,this.array)),e}setZ(t,e){return this.normalized&&(e=it(e,this.array)),this.array[t*this.itemSize+2]=
e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=oe(e,this.array)),e}setW(t,e){return this.
normalized&&(e=it(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&
(e=it(e,this.array),i=it(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,
this.normalized&&(e=it(e,this.array),i=it(i,this.array),s=it(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+
2]=s,this}setXYZW(t,e,i,s,n){return t*=this.itemSize,this.normalized&&(e=it(e,this.array),i=it(i,this.array),s=it(s,this.
array),n=it(n,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=n,this}onUpload(t){return this.
onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.
itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&
(t.name=this.name),this.usage!==ki&&(t.usage=this.usage),t}}class an extends wt{constructor(t,e,i){super(new Uint16Array(
t),e,i)}}class hn extends wt{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class cn extends wt{constructor(t,e,i){super(
new Float32Array(t),e,i)}}let ln=0;const at=new gt,ui=new Rt,ie=new R,rt=new pe,le=new pe,X=new R;class We extends Pe{constructor(){
super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ln++}),this.uuid=de(),this.name="",this.type="Bu\
fferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=
!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){
return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ws(t)?hn:an)(t,1):this.index=t,this}setIndirect(t,e=0){
return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){
return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==
void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){
this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(
t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const n=new vt().getNormalMatrix(t);i.applyNormalMatrix(
n),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==
null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return at.
makeRotationFromQuaternion(t),this.applyMatrix4(at),this}rotateX(t){return at.makeRotationX(t),this.applyMatrix4(at),this}rotateY(t){
return at.makeRotationY(t),this.applyMatrix4(at),this}rotateZ(t){return at.makeRotationZ(t),this.applyMatrix4(at),this}translate(t,e,i){
return at.makeTranslation(t,e,i),this.applyMatrix4(at),this}scale(t,e,i){return at.makeScale(t,e,i),this.applyMatrix4(at),
this}lookAt(t){return ui.lookAt(t),ui.updateMatrix(),this.applyMatrix4(ui.matrix),this}center(){return this.computeBoundingBox(),
this.boundingBox.getCenter(ie).negate(),this.translate(ie.x,ie.y,ie.z),this}setFromPoints(t){const e=this.getAttribute("\
position");if(e===void 0){const i=[];for(let s=0,n=t.length;s<n;s++){const o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute(
"position",new cn(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const n=t[s];e.setXYZ(s,n.x,n.y,n.z||
0)}t.length>e.count&&et("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry\
."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pe);const t=this.attributes.
position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Pt("BufferGeometry.computeBoundingBox(): GLBufferA\
ttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==
void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const n=e[i];rt.setFromBufferAttribute(
n),this.morphTargetsRelative?(X.addVectors(this.boundingBox.min,rt.min),this.boundingBox.expandByPoint(X),X.addVectors(this.
boundingBox.max,rt.max),this.boundingBox.expandByPoint(X)):(this.boundingBox.expandByPoint(rt.min),this.boundingBox.expandByPoint(
rt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.
min.z))&&Pt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely t\
o have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new xi);const t=this.
attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Pt("BufferGeometry.computeBoundingSpher\
e(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){const i=this.
boundingSphere.center;if(rt.setFromBufferAttribute(t),e)for(let n=0,o=e.length;n<o;n++){const r=e[n];le.setFromBufferAttribute(
r),this.morphTargetsRelative?(X.addVectors(rt.min,le.min),rt.expandByPoint(X),X.addVectors(rt.max,le.max),rt.expandByPoint(
X)):(rt.expandByPoint(le.min),rt.expandByPoint(le.max))}rt.getCenter(i);let s=0;for(let n=0,o=t.count;n<o;n++)X.fromBufferAttribute(
t,n),s=Math.max(s,i.distanceToSquared(X));if(e)for(let n=0,o=e.length;n<o;n++){const r=e[n],h=this.morphTargetsRelative;
for(let a=0,l=r.count;a<l;a++)X.fromBufferAttribute(r,a),h&&(ie.fromBufferAttribute(t,a),X.add(ie)),s=Math.max(s,i.distanceToSquared(
X))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Pt('BufferGeometry.computeBoundingSphere(\
): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.
index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Pt("BufferGeometry: .compute\
Tangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,n=e.
uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new wt(new Float32Array(4*i.count),4));const o=this.getAttribute(
"tangent"),r=[],h=[];for(let S=0;S<i.count;S++)r[S]=new R,h[S]=new R;const a=new R,l=new R,u=new R,d=new yt,f=new yt,m=new yt,
p=new R,A=new R;function M(S,x,b){a.fromBufferAttribute(i,S),l.fromBufferAttribute(i,x),u.fromBufferAttribute(i,b),d.fromBufferAttribute(
n,S),f.fromBufferAttribute(n,x),m.fromBufferAttribute(n,b),l.sub(a),u.sub(a),f.sub(d),m.sub(d);const w=1/(f.x*m.y-m.x*f.
y);isFinite(w)&&(p.copy(l).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(w),A.copy(u).multiplyScalar(f.x).addScaledVector(
l,-m.x).multiplyScalar(w),r[S].add(p),r[x].add(p),r[b].add(p),h[S].add(A),h[x].add(A),h[b].add(A))}let y=this.groups;y.length===
0&&(y=[{start:0,count:t.count}]);for(let S=0,x=y.length;S<x;++S){const b=y[S],w=b.start,C=b.count;for(let F=w,O=w+C;F<O;F+=
3)M(t.getX(F+0),t.getX(F+1),t.getX(F+2))}const g=new R,I=new R,z=new R,E=new R;function T(S){z.fromBufferAttribute(s,S),
E.copy(z);const x=r[S];g.copy(x),g.sub(z.multiplyScalar(z.dot(x))).normalize(),I.crossVectors(E,x);const w=I.dot(h[S])<0?
-1:1;o.setXYZW(S,g.x,g.y,g.z,w)}for(let S=0,x=y.length;S<x;++S){const b=y[S],w=b.start,C=b.count;for(let F=w,O=w+C;F<O;F+=
3)T(t.getX(F+0)),T(t.getX(F+1)),T(t.getX(F+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");
if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new wt(new Float32Array(e.count*3),3),this.setAttribute(
"normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new R,n=new R,o=new R,r=new R,h=new R,a=new R,l=new R,
u=new R;if(t)for(let d=0,f=t.count;d<f;d+=3){const m=t.getX(d+0),p=t.getX(d+1),A=t.getX(d+2);s.fromBufferAttribute(e,m),
n.fromBufferAttribute(e,p),o.fromBufferAttribute(e,A),l.subVectors(o,n),u.subVectors(s,n),l.cross(u),r.fromBufferAttribute(
i,m),h.fromBufferAttribute(i,p),a.fromBufferAttribute(i,A),r.add(l),h.add(l),a.add(l),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(p,
h.x,h.y,h.z),i.setXYZ(A,a.x,a.y,a.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),n.fromBufferAttribute(
e,d+1),o.fromBufferAttribute(e,d+2),l.subVectors(o,n),u.subVectors(s,n),l.cross(u),i.setXYZ(d+0,l.x,l.y,l.z),i.setXYZ(d+
1,l.x,l.y,l.z),i.setXYZ(d+2,l.x,l.y,l.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.
normal;for(let e=0,i=t.count;e<i;e++)X.fromBufferAttribute(t,e),X.normalize(),t.setXYZ(e,X.x,X.y,X.z)}toNonIndexed(){function t(r,h){
const a=r.array,l=r.itemSize,u=r.normalized,d=new a.constructor(h.length*l);let f=0,m=0;for(let p=0,A=h.length;p<A;p++){
r.isInterleavedBufferAttribute?f=h[p]*r.data.stride+r.offset:f=h[p]*l;for(let M=0;M<l;M++)d[m++]=a[f++]}return new wt(d,
l,u)}if(this.index===null)return et("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new We,
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
count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Zi=new gt,Ut=new Js,Re=new xi,
$i=new R,Fe=new R,Oe=new R,_e=new R,di=new R,Ne=new R,Qi=new R,ke=new R;class un extends Rt{constructor(t=new We,e=new us){
super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=
void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=
t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),
this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){
const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=
[],this.morphTargetDictionary={};for(let n=0,o=s.length;n<o;n++){const r=s[n].name||String(n);this.morphTargetInfluences.
push(0),this.morphTargetDictionary[r]=n}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,n=i.morphAttributes.
position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(n&&r){Ne.set(0,0,0);for(let h=0,
a=n.length;h<a;h++){const l=r[h],u=n[h];l!==0&&(di.fromBufferAttribute(u,t),o?Ne.addScaledVector(di,l):Ne.addScaledVector(
di.sub(e),l))}e.add(Ne)}return e}raycast(t,e){const i=this.geometry,s=this.material,n=this.matrixWorld;s!==void 0&&(i.boundingSphere===
null&&i.computeBoundingSphere(),Re.copy(i.boundingSphere),Re.applyMatrix4(n),Ut.copy(t.ray).recast(t.near),!(Re.containsPoint(
Ut.origin)===!1&&(Ut.intersectSphere(Re,$i)===null||Ut.origin.distanceToSquared($i)>(t.far-t.near)**2))&&(Zi.copy(n).invert(),
Ut.copy(t.ray).applyMatrix4(Zi),!(i.boundingBox!==null&&Ut.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(
t,e,Ut)))}_computeIntersections(t,e,i){let s;const n=this.geometry,o=this.material,r=n.index,h=n.attributes.position,a=n.
attributes.uv,l=n.attributes.uv1,u=n.attributes.normal,d=n.groups,f=n.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,
p=d.length;m<p;m++){const A=d[m],M=o[A.materialIndex],y=Math.max(A.start,f.start),g=Math.min(r.count,Math.min(A.start+A.
count,f.start+f.count));for(let I=y,z=g;I<z;I+=3){const E=r.getX(I),T=r.getX(I+1),S=r.getX(I+2);s=De(this,M,t,i,a,l,u,E,
T,S),s&&(s.faceIndex=Math.floor(I/3),s.face.materialIndex=A.materialIndex,e.push(s))}}else{const m=Math.max(0,f.start),p=Math.
min(r.count,f.start+f.count);for(let A=m,M=p;A<M;A+=3){const y=r.getX(A),g=r.getX(A+1),I=r.getX(A+2);s=De(this,o,t,i,a,l,
u,y,g,I),s&&(s.faceIndex=Math.floor(A/3),e.push(s))}}else if(h!==void 0)if(Array.isArray(o))for(let m=0,p=d.length;m<p;m++){
const A=d[m],M=o[A.materialIndex],y=Math.max(A.start,f.start),g=Math.min(h.count,Math.min(A.start+A.count,f.start+f.count));
for(let I=y,z=g;I<z;I+=3){const E=I,T=I+1,S=I+2;s=De(this,M,t,i,a,l,u,E,T,S),s&&(s.faceIndex=Math.floor(I/3),s.face.materialIndex=
A.materialIndex,e.push(s))}}else{const m=Math.max(0,f.start),p=Math.min(h.count,f.start+f.count);for(let A=m,M=p;A<M;A+=
3){const y=A,g=A+1,I=A+2;s=De(this,o,t,i,a,l,u,y,g,I),s&&(s.faceIndex=Math.floor(A/3),e.push(s))}}}}function dn(c,t,e,i,s,n,o,r){
let h;if(t.side===ks?h=i.intersectTriangle(o,n,s,!0,r):h=i.intersectTriangle(s,n,o,t.side===yi,r),h===null)return null;ke.
copy(r),ke.applyMatrix4(c.matrixWorld);const a=e.ray.origin.distanceTo(ke);return a<e.near||a>e.far?null:{distance:a,point:ke.
clone(),object:c}}function De(c,t,e,i,s,n,o,r,h,a){c.getVertexPosition(r,Fe),c.getVertexPosition(h,Oe),c.getVertexPosition(
a,_e);const l=dn(c,t,e,i,Fe,Oe,_e,Qi);if(l){const u=new R;mt.getBarycoord(Qi,Fe,Oe,_e,u),s&&(l.uv=mt.getInterpolatedAttribute(
s,r,h,a,u,new yt)),n&&(l.uv1=mt.getInterpolatedAttribute(n,r,h,a,u,new yt)),o&&(l.normal=mt.getInterpolatedAttribute(o,r,
h,a,u,new R),l.normal.dot(i.direction)>0&&l.normal.multiplyScalar(-1));const d={a:r,b:h,c:a,normal:new R,materialIndex:0};
mt.getNormal(Fe,Oe,_e,d.normal),l.face=d,l.barycoord=u}return l}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(
new CustomEvent("register",{detail:{revision:as}}));typeof window<"u"&&(window.__THREE__?et("WARNING: Multiple instances\
 of Three.js being imported."):window.__THREE__=as);class fn extends un{constructor(t,e,i=!1,s=!1,n=1e4){const o=new We;
super(o,e),this.isMarchingCubes=!0;const r=this,h=new Float32Array(36),a=new Float32Array(36),l=new Float32Array(36);this.
enableUvs=i,this.enableColors=s,this.init=function(y){this.resolution=y,this.isolation=80,this.size=y,this.size2=this.size*
this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.
size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(
this.size3*3),this.count=0;const g=n*3;this.positionArray=new Float32Array(g*3);const I=new wt(this.positionArray,3);I.setUsage(
xe),o.setAttribute("position",I),this.normalArray=new Float32Array(g*3);const z=new wt(this.normalArray,3);if(z.setUsage(
xe),o.setAttribute("normal",z),this.enableUvs){this.uvArray=new Float32Array(g*2);const E=new wt(this.uvArray,2);E.setUsage(
xe),o.setAttribute("uv",E)}if(this.enableColors){this.colorArray=new Float32Array(g*3);const E=new wt(this.colorArray,3);
E.setUsage(xe),o.setAttribute("color",E)}o.boundingSphere=new xi(new R,1)};function u(y,g,I){return y+(g-y)*I}function d(y,g,I,z,E,T,S,x,b,w){
const C=(I-S)/(x-S),F=r.normal_cache;h[g+0]=z+C*r.delta,h[g+1]=E,h[g+2]=T,a[g+0]=u(F[y+0],F[y+3],C),a[g+1]=u(F[y+1],F[y+
4],C),a[g+2]=u(F[y+2],F[y+5],C),l[g+0]=u(r.palette[b*3+0],r.palette[w*3+0],C),l[g+1]=u(r.palette[b*3+1],r.palette[w*3+1],
C),l[g+2]=u(r.palette[b*3+2],r.palette[w*3+2],C)}function f(y,g,I,z,E,T,S,x,b,w){const C=(I-S)/(x-S),F=r.normal_cache;h[g+
0]=z,h[g+1]=E+C*r.delta,h[g+2]=T;const O=y+r.yd*3;a[g+0]=u(F[y+0],F[O+0],C),a[g+1]=u(F[y+1],F[O+1],C),a[g+2]=u(F[y+2],F[O+
2],C),l[g+0]=u(r.palette[b*3+0],r.palette[w*3+0],C),l[g+1]=u(r.palette[b*3+1],r.palette[w*3+1],C),l[g+2]=u(r.palette[b*3+
2],r.palette[w*3+2],C)}function m(y,g,I,z,E,T,S,x,b,w){const C=(I-S)/(x-S),F=r.normal_cache;h[g+0]=z,h[g+1]=E,h[g+2]=T+C*
r.delta;const O=y+r.zd*3;a[g+0]=u(F[y+0],F[O+0],C),a[g+1]=u(F[y+1],F[O+1],C),a[g+2]=u(F[y+2],F[O+2],C),l[g+0]=u(r.palette[b*
3+0],r.palette[w*3+0],C),l[g+1]=u(r.palette[b*3+1],r.palette[w*3+1],C),l[g+2]=u(r.palette[b*3+2],r.palette[w*3+2],C)}function p(y){
const g=y*3;r.normal_cache[g]===0&&(r.normal_cache[g+0]=r.field[y-1]-r.field[y+1],r.normal_cache[g+1]=r.field[y-r.yd]-r.
field[y+r.yd],r.normal_cache[g+2]=r.field[y-r.zd]-r.field[y+r.zd])}function A(y,g,I,z,E){const T=z+1,S=z+r.yd,x=z+r.zd,b=T+
r.yd,w=T+r.zd,C=z+r.yd+r.zd,F=T+r.yd+r.zd;let O=0;const k=r.field[z],D=r.field[T],N=r.field[S],B=r.field[b],U=r.field[x],
H=r.field[w],Y=r.field[C],Z=r.field[F];k<E&&(O|=1),D<E&&(O|=2),N<E&&(O|=8),B<E&&(O|=4),U<E&&(O|=16),H<E&&(O|=32),Y<E&&(O|=
128),Z<E&&(O|=64);const W=mn[O];if(W===0)return 0;const $=r.delta,ht=y+$,st=g+$,L=I+$;W&1&&(p(z),p(T),d(z*3,0,E,y,g,I,k,
D,z,T)),W&2&&(p(T),p(b),f(T*3,3,E,ht,g,I,D,B,T,b)),W&4&&(p(S),p(b),d(S*3,6,E,y,st,I,N,B,S,b)),W&8&&(p(z),p(S),f(z*3,9,E,
y,g,I,k,N,z,S)),W&16&&(p(x),p(w),d(x*3,12,E,y,g,L,U,H,x,w)),W&32&&(p(w),p(F),f(w*3,15,E,ht,g,L,H,Z,w,F)),W&64&&(p(C),p(F),
d(C*3,18,E,y,st,L,Y,Z,C,F)),W&128&&(p(x),p(C),f(x*3,21,E,y,g,L,U,Y,x,C)),W&256&&(p(z),p(x),m(z*3,24,E,y,g,I,k,U,z,x)),W&
512&&(p(T),p(w),m(T*3,27,E,ht,g,I,D,H,T,w)),W&1024&&(p(b),p(F),m(b*3,30,E,ht,st,I,B,Z,b,F)),W&2048&&(p(S),p(C),m(S*3,33,
E,y,st,I,N,Y,S,C)),O<<=4;let q,j,Ft,qt=0,xt=0;for(;ve[O+xt]!=-1;)q=O+xt,j=q+1,Ft=q+2,M(h,a,l,3*ve[q],3*ve[j],3*ve[Ft]),xt+=
3,qt++;return qt}function M(y,g,I,z,E,T){const S=r.count*3;if(r.positionArray[S+0]=y[z],r.positionArray[S+1]=y[z+1],r.positionArray[S+
2]=y[z+2],r.positionArray[S+3]=y[E],r.positionArray[S+4]=y[E+1],r.positionArray[S+5]=y[E+2],r.positionArray[S+6]=y[T],r.
positionArray[S+7]=y[T+1],r.positionArray[S+8]=y[T+2],r.material.flatShading===!0){const x=(g[z+0]+g[E+0]+g[T+0])/3,b=(g[z+
1]+g[E+1]+g[T+1])/3,w=(g[z+2]+g[E+2]+g[T+2])/3;r.normalArray[S+0]=x,r.normalArray[S+1]=b,r.normalArray[S+2]=w,r.normalArray[S+
3]=x,r.normalArray[S+4]=b,r.normalArray[S+5]=w,r.normalArray[S+6]=x,r.normalArray[S+7]=b,r.normalArray[S+8]=w}else r.normalArray[S+
0]=g[z+0],r.normalArray[S+1]=g[z+1],r.normalArray[S+2]=g[z+2],r.normalArray[S+3]=g[E+0],r.normalArray[S+4]=g[E+1],r.normalArray[S+
5]=g[E+2],r.normalArray[S+6]=g[T+0],r.normalArray[S+7]=g[T+1],r.normalArray[S+8]=g[T+2];if(r.enableUvs){const x=r.count*
2;r.uvArray[x+0]=y[z+0],r.uvArray[x+1]=y[z+2],r.uvArray[x+2]=y[E+0],r.uvArray[x+3]=y[E+2],r.uvArray[x+4]=y[T+0],r.uvArray[x+
5]=y[T+2]}r.enableColors&&(r.colorArray[S+0]=I[z+0],r.colorArray[S+1]=I[z+1],r.colorArray[S+2]=I[z+2],r.colorArray[S+3]=
I[E+0],r.colorArray[S+4]=I[E+1],r.colorArray[S+5]=I[E+2],r.colorArray[S+6]=I[T+0],r.colorArray[S+7]=I[T+1],r.colorArray[S+
8]=I[T+2]),r.count+=3}this.addBall=function(y,g,I,z,E,T){const S=Math.sign(z);z=Math.abs(z);const x=T!=null;let b=new zt(
y,g,I);if(x)try{b=T instanceof zt?T:Array.isArray(T)?new zt(Math.min(Math.abs(T[0]),1),Math.min(Math.abs(T[1]),1),Math.min(
Math.abs(T[2]),1)):new zt(T)}catch{b=new zt(y,g,I)}const w=this.size*Math.sqrt(z/E),C=I*this.size,F=g*this.size,O=y*this.
size;let k=Math.floor(C-w);k<1&&(k=1);let D=Math.floor(C+w);D>this.size-1&&(D=this.size-1);let N=Math.floor(F-w);N<1&&(N=
1);let B=Math.floor(F+w);B>this.size-1&&(B=this.size-1);let U=Math.floor(O-w);U<1&&(U=1);let H=Math.floor(O+w);H>this.size-
1&&(H=this.size-1);let Y,Z,W,$,ht,st,L,q,j,Ft,qt;for(W=k;W<D;W++)for(ht=this.size2*W,q=W/this.size-I,j=q*q,Z=N;Z<B;Z++)for($=
ht+this.size*Z,L=Z/this.size-g,Ft=L*L,Y=U;Y<H;Y++)if(st=Y/this.size-y,qt=z/(1e-6+st*st+Ft+j)-E,qt>0){this.field[$+Y]+=qt*
S;const xt=Math.sqrt((Y-O)*(Y-O)+(Z-F)*(Z-F)+(W-C)*(W-C))/w,Ve=1-xt*xt*xt*(xt*(xt*6-15)+10);this.palette[($+Y)*3+0]+=b.r*
Ve,this.palette[($+Y)*3+1]+=b.g*Ve,this.palette[($+Y)*3+2]+=b.b*Ve}},this.addPlaneX=function(y,g){const I=this.size,z=this.
yd,E=this.zd,T=this.field;let S,x,b,w,C,F,O,k=I*Math.sqrt(y/g);for(k>I&&(k=I),S=0;S<k;S++)if(F=S/I,w=F*F,C=y/(1e-4+w)-g,
C>0)for(x=0;x<I;x++)for(O=S+x*z,b=0;b<I;b++)T[E*b+O]+=C},this.addPlaneY=function(y,g){const I=this.size,z=this.yd,E=this.
zd,T=this.field;let S,x,b,w,C,F,O,k,D=I*Math.sqrt(y/g);for(D>I&&(D=I),x=0;x<D;x++)if(F=x/I,w=F*F,C=y/(1e-4+w)-g,C>0)for(O=
x*z,S=0;S<I;S++)for(k=O+S,b=0;b<I;b++)T[E*b+k]+=C},this.addPlaneZ=function(y,g){const I=this.size,z=this.yd,E=this.zd,T=this.
field;let S,x,b,w,C,F,O,k,D=I*Math.sqrt(y/g);for(D>I&&(D=I),b=0;b<D;b++)if(F=b/I,w=F*F,C=y/(1e-4+w)-g,C>0)for(O=E*b,x=0;x<
I;x++)for(k=O+x*z,S=0;S<I;S++)T[k+S]+=C},this.setCell=function(y,g,I,z){const E=this.size2*I+this.size*g+y;this.field[E]=
z},this.getCell=function(y,g,I){const z=this.size2*I+this.size*g+y;return this.field[z]},this.blur=function(y=1){const g=this.
field,I=g.slice(),z=this.size,E=this.size2;for(let T=0;T<z;T++)for(let S=0;S<z;S++)for(let x=0;x<z;x++){const b=E*x+z*S+
T;let w=I[b],C=1;for(let F=-1;F<=1;F+=2){const O=F+T;if(!(O<0||O>=z))for(let k=-1;k<=1;k+=2){const D=k+S;if(!(D<0||D>=z))
for(let N=-1;N<=1;N+=2){const B=N+x;if(B<0||B>=z)continue;const U=E*B+z*D+O,H=I[U];C++,w+=y*(H-w)/C}}}g[b]=w}},this.reset=
function(){for(let y=0;y<this.size3;y++)this.normal_cache[y*3]=0,this.field[y]=0,this.palette[y*3]=this.palette[y*3+1]=this.
palette[y*3+2]=0},this.update=function(){this.count=0;const y=this.size-2;for(let g=1;g<y;g++){const I=this.size2*g,z=(g-
this.halfsize)/this.halfsize;for(let E=1;E<y;E++){const T=I+this.size*E,S=(E-this.halfsize)/this.halfsize;for(let x=1;x<
y;x++){const b=(x-this.halfsize)/this.halfsize,w=T+x;A(b,S,z,w,this.isolation)}}}this.geometry.setDrawRange(0,this.count),
o.getAttribute("position").needsUpdate=!0,o.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(o.getAttribute("uv").
needsUpdate=!0),this.enableColors&&(o.getAttribute("color").needsUpdate=!0),this.count/3>n&&console.warn("THREE.Marching\
Cubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const mn=new Int32Array(
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
ve=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,
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
0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),bt=320,pn=[.485,.456,.406],
yn=[.229,.224,.225],ds=(c,t)=>new OffscreenCanvas(c,t),ue=c=>Object.assign(new Error(c),{code:"ERR_MESH_FOREGROUND"});function Ye(c){
const{width:t,height:e,data:i}=c??{};if(!Number.isSafeInteger(t)||!Number.isSafeInteger(e)||t<1||e<1||t*e>4096*4096||!(i instanceof
Uint8Array||i instanceof Uint8ClampedArray)||i.length!==t*e*4)throw new Error("TripoSR needs bounded RGBA pixels");return c}
function bi(c){const{width:t,height:e,data:i}=Ye(c);let s=0,n=0,o=0;for(let r=0;r<e;r++)for(let h=0;h<t;h++){const a=i[(r*
t+h)*4+3]<=16;a&&s++,(h===0||r===0||h===t-1||r===e-1)&&(n++,a&&o++)}return s>=Math.max(1,t*e*.01)&&o>=n*.25}function gn(c){
if(!bi(c))throw ue("This stored TripoSR package needs a transparent cutout. Load the current TripoSR package to remove i\
mage backgrounds automatically.");return c}function xn(c){const t=bt**2;if(!(c instanceof Uint8Array||c instanceof Uint8ClampedArray)||
c.length!==t*4)throw new Error("Foreground input must be 320×320 RGBA");let e=1e-6;for(let s=0;s<c.length;s+=4)e=Math.max(
e,c[s],c[s+1],c[s+2]);const i=new Float32Array(t*3);for(let s=0;s<t;s++)for(let n=0;n<3;n++)i[n*t+s]=(c[s*4+n]/e-pn[n])/
yn[n];return i}function bn(c,{canvas:t=ds}={}){const{width:e,height:i,data:s}=Ye(c),n=new Uint8ClampedArray(s);for(let a=3;a<
n.length;a+=4)n[a]=255;const o=t(e,i),r=t(bt,bt);o.getContext("2d").putImageData(new ImageData(n,e,i),0,0);const h=r.getContext(
"2d",{willReadFrequently:!0});return h.imageSmoothingEnabled=!0,h.imageSmoothingQuality="high",h.drawImage(o,0,0,bt,bt),
xn(h.getImageData(0,0,bt,bt).data)}function wn(c,t,{canvas:e=ds}={}){const{width:i,height:s,data:n}=Ye(c),o=bt;if(!(t instanceof
Float32Array)||t.length!==o*o)throw ue("Invalid foreground model mask");let r=1/0,h=-1/0;for(const M of t){if(!Number.isFinite(
M)||M<-1e-4||M>1.0001)throw ue("Invalid foreground model values");r=Math.min(r,M),h=Math.max(h,M)}if(h-r<1e-6)throw ue("\
The foreground model could not isolate an object. Try one clearly visible object or a transparent cutout.");const a=new Uint8ClampedArray(
o*o*4);for(let M=0;M<t.length;M++){const y=Math.floor(255*(t[M]-r)/(h-r));a[M*4]=a[M*4+1]=a[M*4+2]=y,a[M*4+3]=255}const l=e(
o,o),u=e(i,s);l.getContext("2d").putImageData(new ImageData(a,o,o),0,0);const d=u.getContext("2d",{willReadFrequently:!0});
d.imageSmoothingEnabled=!0,d.imageSmoothingQuality="high",d.drawImage(l,0,0,i,s);const f=d.getImageData(0,0,i,s).data,m=new Uint8Array(
n);let p=0;for(let M=0;M<i*s;M++){const y=Math.round(n[M*4+3]*f[M*4]/255);m[M*4+3]=y,y>=128&&p++}const A={width:i,height:s,
channels:4,data:m};if(!p||!bi(A))throw ue("The foreground model could not isolate an object. Try one clearly visible obj\
ect with space around it, or a transparent cutout.");return A}const V=Object.freeze({imageSize:512,foregroundRatio:.85,radius:.87,
channels:40,planeSize:64,threshold:25,resolution:64,queryBatch:32768,maxVertices:1e5,maxTriangles:15e4});function Yt(c,t){
for(const e of c)if(!Number.isFinite(e))throw new Error(`${t} contains non-finite values`);return c}function An(c){const{
width:t,height:e,data:i}=Ye(c);let s=t,n=e,o=-1,r=-1;for(let h=0;h<e;h++)for(let a=0;a<t;a++)i[(h*t+a)*4+3]&&(s=Math.min(
s,a),n=Math.min(n,h),o=Math.max(o,a),r=Math.max(r,h));if(o<s)throw new Error("The image has no visible foreground");return{
x:s,y:n,width:o-s+1,height:r-n+1}}function Mn(c){const t=V.imageSize**2;if(!(c instanceof Uint8Array||c instanceof Uint8ClampedArray)||
c.length!==t*4)throw new Error("TripoSR input must be 512×512 RGBA");const e=new Float32Array(t*3);for(let i=0;i<t;i++){
const s=c[i*4+3]/255;for(let n=0;n<3;n++)e[n*t+i]=c[i*4+n]/255*s+.5*(1-s)}return e}function Sn(c,{canvas:t=(e,i)=>new OffscreenCanvas(
e,i)}={}){c=gn(c);const e=An(c),i=V.imageSize,s=t(c.width,c.height),n=t(i,i);s.getContext("2d").putImageData(new ImageData(
new Uint8ClampedArray(c.data),c.width,c.height),0,0);const o=i*V.foregroundRatio/Math.max(e.width,e.height),r=e.width*o,
h=e.height*o,a=n.getContext("2d",{willReadFrequently:!0});return a.imageSmoothingEnabled=!0,a.imageSmoothingQuality="hig\
h",a.drawImage(s,e.x,e.y,e.width,e.height,(i-r)/2,(i-h)/2,r,h),Mn(a.getImageData(0,0,i,i).data)}function In(c,t,e){if(!Number.
isInteger(c)||c<4||c>128||!Number.isSafeInteger(t)||!Number.isSafeInteger(e)||t<0||e<1||e>V.queryBatch||t+e>c**3)throw new Error(
"Invalid TripoSR query grid");const i=new Float32Array(e*3),s=2*V.radius/(c-1);for(let n=0;n<e;n++){const o=t+n;i[n*3]=o%
c*s-V.radius,i[n*3+1]=Math.floor(o/c)%c*s-V.radius,i[n*3+2]=Math.floor(o/(c*c))*s-V.radius}return i}function Tn(c,t){if(!(c instanceof
Float32Array)||c.length!==7680*64||!(t instanceof Float32Array)||t.length%3||t.length/3>V.queryBatch)throw new Error("In\
valid TripoSR sample tensors");Yt(t,"Query points");const e=new Float32Array(t.length/3*120);for(let i=0;i<t.length/3;i++){
const s=t[i*3]/V.radius,n=t[i*3+1]/V.radius,o=t[i*3+2]/V.radius;for(let r=0;r<3;r++){const h=((r===2?n:s)+1)*32-.5,a=((r===
0?n:o)+1)*32-.5,l=Math.floor(h),u=Math.floor(a),d=h-l,f=a-u;for(let m=0;m<40;m++){let p=0;for(let A=0;A<2;A++)for(let M=0;M<
2;M++){const y=l+M,g=u+A;y>=0&&y<64&&g>=0&&g<64&&(p+=c[(r*40+m)*4096+g*64+y]*(M?d:1-d)*(A?f:1-f))}e[i*120+r*40+m]=p}}}return Yt(
e,"Triplane features")}function En(c,t=V.resolution){if(!(c instanceof Float32Array)||c.length!==t**3||!Number.isInteger(
t)||t<4||t>128)throw new Error("Invalid density field");Yt(c,"Density");const e=new us,i=new fn(t,e,!1,!1,Math.floor(V.maxVertices/
3)+1);try{i.field.set(c),i.isolation=V.threshold,i.update();const s=i.count;if(!s)throw new Error("No solid object was f\
ound; use one object on a plain or transparent background");if(s>V.maxVertices)throw new Error("Generated mesh exceeds i\
ts vertex budget");const n=new Float32Array(i.positionArray.slice(0,s*3)),o=new Float32Array(i.normalArray.slice(0,s*3)),
r=Uint32Array.from({length:s},(h,a)=>a);for(let h=0;h<n.length;h++)n[h]=((n[h]+1)*t/(t-1)-1)*V.radius;for(let h=0;h<o.length;h+=
3){const a=Math.hypot(o[h],o[h+1],o[h+2]);if(!Number.isFinite(a)||a<=1e-12)throw new Error("Generated surface has an inv\
alid normal");o[h]/=a,o[h+1]/=a,o[h+2]/=a}return{positions:n,normals:o,indices:r}}finally{i.geometry.dispose(),e.dispose()}}
function zn(c){for(const t of["positions","normals"]){const e=c[t];for(let i=0;i<e.length;i+=3){const s=e[i+1];e[i+1]=e[i+
2],e[i+2]=-s}}return c}function Cn(c){return Yt(c,"Vertex colors"),Float32Array.from(c,t=>{const e=Math.max(0,Math.min(1,
t));return e<=.04045?e/12.92:((e+.055)/1.055)**2.4})}const Ki=()=>new Promise(c=>setTimeout(c,0)),Le=4*1024**2,Be=c=>Object.
values(c??{}).forEach(t=>t.dispose?.());async function Rn(c,t,e,i){if(!t||t.size<1||t.size>512*1024**2)throw new Error("\
3D model file exceeds its loader budget");const s=new Uint8Array(t.size);for(let n=0;n<s.length;n+=Le)tt(e),s.set(await c.
read(t.path,n,Math.min(Le,s.length-n),{signal:e}),n),i?.({type:"model-load",stage:t.path,loaded:Math.min(n+Le,s.length),
total:s.length});return s}function Fn(c,t){const e=c.createCommandEncoder.bind(c),i=c.queue.submit.bind(c.queue);c.createCommandEncoder=
(...s)=>{const n=e(...s),o=n.beginComputePass.bind(n);return n.beginComputePass=(...r)=>{const h=o(...r);for(const a of[
"dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const l=h[a].bind(h);h[a]=(...u)=>{const d=l(...u);return t.gpuDispatches++,
d}}return h},n},c.queue.submit=(...s)=>{const n=i(...s);return t.gpuSubmissions++,n}}async function On({manifest:c,runtimeAssets:t,
artifactPort:e,signal:i,onProgress:s,gpu:n=globalThis.navigator?.gpu,loadOrt:o=()=>import("./ort.webgpu.bundle.min-WyWkMMpy.js"),
createReader:r=ms,prepareImage:h=Sn,readModelFile:a=Rn,prepareForeground:l=bn,applyMask:u=wn}){const{manifest:d}=gi(c),f={
gpuDispatches:0,gpuSubmissions:0,generatedRequests:0};let m,p,A,M,y,g,I=!1,z=!1,E=!1;const T=w=>{z||(E=!0,f.gpuFailure??=
String(w?.message??w??"GPU device lost").slice(0,300))},S=w=>T(w.error);async function x(w,C){if(E)throw new Error(`Mode\
l session lost: 3D ${f.gpuFailure}`);const F=["validation","out-of-memory","internal"];for(const N of F)m.pushErrorScope(
N);let O,k;try{O=await C(),await m.queue.onSubmittedWorkDone()}catch(N){k=N}const D=[];for(const N of F.reverse())try{const B=await m.
popErrorScope();B&&D.push({filter:N,error:B})}catch(B){D.push({filter:N,error:B})}if(D.length||E){const N=D.find(U=>U.filter===
"out-of-memory")?.error??D[0]?.error??f.gpuFailure;T(N),Be(O);const B=new Error(`Model session lost: 3D ${w}: ${f.gpuFailure}`,
{cause:N});throw B.code="ERR_MESH_GPU",B}if(k){T(k);const N=new Error(`Model session lost: 3D ${w}: ${f.gpuFailure}`,{cause:k});
throw N.code="ERR_MESH_GPU",N}return O}async function b(){if(z)return;z=!0,p?.close(),p=null;let w;for(const C of[M,y,g])
try{await C?.release()}catch(F){w??=F}if(M=y=g=null,m?.removeEventListener("uncapturederror",S),m?.destroy(),w)throw E=!0,
f.gpuFailure??=String(w.message??w),w}try{tt(i);const w=await n?.requestAdapter({powerPreference:"high-performance"});if(!w||
w.isFallbackAdapter||w.info?.isFallbackAdapter)throw new Error("3D generation requires hardware WebGPU");if(m=await w.requestDevice(
{requiredLimits:{maxBufferSize:w.limits.maxBufferSize,maxStorageBufferBindingSize:w.limits.maxStorageBufferBindingSize}}),
f.adapter={vendor:w.info?.vendor??"",architecture:w.info?.architecture??"",isFallbackAdapter:!1},f.runtimeFeatures=[...m.
features],m.addEventListener("uncapturederror",S),m.lost.then(T,T),Fn(m,f),A=await o(),A.env.versions.web!==_s)throw new Error(
"Unexpected 3D ORT runtime version");A.env.wasm.proxy=!1,A.env.wasm.numThreads=1,A.env.wasm.wasmPaths=t,p=r(e,{manifest:d,
signal:i,maxReadBytes:Le,maxReads:1,maxQueuedReads:2,readTimeoutMs:6e4});const C=N=>a(p,d.files.find(B=>B.path===N),i,s),
F={executionProviders:[{name:"webgpu",device:m}],enableMemPattern:!1,enableCpuMemArena:!1,extra:{session:{disable_prepacking:"\
1"}}};let O=await C("triplane_q8.onnx"),k=await C("triplane_q8.onnx.data");await x("encoder load",async()=>{M=await A.InferenceSession.
create(O,{...F,externalData:[{path:"triplane_q8.onnx.data",data:k}]})}),O=k=null,tt(i);const D=await C("decoder.onnx");if(await x(
"decoder load",async()=>{y=await A.InferenceSession.create(D,F)}),tt(i),d.model.backgroundRemoval==="u2netp"){const N=await C(
"u2netp.onnx");await x("foreground load",async()=>{g=await A.InferenceSession.create(N,F)})}if(f.artifactReads=p.getStats(),
p.close(),p=null,tt(i),M.inputNames.join()!=="image"||M.outputNames.join()!=="triplane"||y.inputNames.join()!=="features"||
y.outputNames.join()!=="density,color"||g&&(g.inputNames.join()!=="input.1"||g.outputNames.join()!=="1959,1960,1961,1962\
,1963,1964,1965"))throw new Error("3D graph interfaces differ from the pinned pipeline")}catch(w){try{await b()}catch{}throw w}
return{get lost(){return E},getEvidence(){return structuredClone(f)},dispose:b,async generate(w,{signal:C,onProgress:F}={}){
if(z)throw new Error("3D model is unloaded");if(I)throw new Error("3D model is already generating");if(E)throw new Error(
`Model session lost: 3D ${f.gpuFailure}`);const O=os(w,d);I=!0;const k=f.gpuDispatches,D=f.gpuSubmissions;try{tt(C),F?.(
{type:"mesh-generation",stage:"image",loaded:0,total:1});let N=O.image;if(g&&!bi(N)){const L=new A.Tensor("float32",l(N),
[1,3,bt,bt]);let q;try{q=await x("foreground separation",()=>g.run({"input.1":L})),tt(C);const j=q[1959];if(j?.type!=="f\
loat32"||j.dims.join()!=="1,1,320,320")throw new Error("Unexpected foreground model output");N=u(N,j.data)}finally{L.dispose(),
Be(q)}f.foregroundRequests=(f.foregroundRequests??0)+1}tt(C);const B=new A.Tensor("float32",h(N),[1,3,512,512]);let U,H;
try{U=await x("image encoding",()=>M.run({image:B}));const L=U.triplane;if(L?.type!=="float32"||L.dims.join()!=="1,3,40,\
64,64")throw new Error("Unexpected TripoSR encoder output");H=Yt(new Float32Array(L.data),"Triplane")}finally{B.dispose(),
Be(U)}tt(C);const Y=async L=>{tt(C);const q=new A.Tensor("float32",Tn(H,L),[L.length/3,120]);let j;try{j=await x("field \
decoding",()=>y.run({features:q}));const Ft=L.length/3;if(j.density?.type!=="float32"||j.color?.type!=="float32"||j.density.
data.length!==Ft||j.color.data.length!==Ft*3)throw new Error("Unexpected TripoSR decoder output");return{density:Yt(new Float32Array(
j.density.data),"Density"),color:Yt(new Float32Array(j.color.data),"Vertex colors")}}finally{q.dispose(),Be(j)}},Z=V.resolution**
3,W=new Float32Array(Z);for(let L=0;L<Z;L+=V.queryBatch){const q=Math.min(V.queryBatch,Z-L);W.set((await Y(In(V.resolution,
L,q))).density,L),F?.({type:"mesh-generation",stage:"shape",loaded:L+q,total:Z}),await Ki()}tt(C);const $=En(W),ht=$.positions.
length/3;$.colors=new Float32Array($.positions.length);for(let L=0;L<ht;L+=V.queryBatch){const q=Math.min(ht,L+V.queryBatch);
$.colors.set(Cn((await Y($.positions.subarray(L*3,q*3))).color),L*3),F?.({type:"mesh-generation",stage:"color",loaded:q,
total:ht}),await Ki()}if(tt(C),f.gpuDispatches<=k)throw T(new Error("3D execution did not dispatch work on the admitted \
GPU")),new Error(`Model session lost: ${f.gpuFailure}`);const st=await Cs(zn($));return tt(C),f.generatedRequests++,f.lastMesh=
{vertexCount:st.vertexCount,triangleCount:st.triangleCount,byteLength:st.byteLength},F?.({type:"mesh-generation",stage:"\
done",loaded:1,total:1}),{text:"",mesh:st,gpuDispatches:f.gpuDispatches-k,gpuSubmissions:f.gpuSubmissions-D}}finally{I=!1}}}}
function _n(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("3D generation\
 requires a ComputeManager-owned worker")}function fs({createEngine:c=On,assertWorker:t=_n,validateManifest:e=gi,validateRuntimeAssets:i=Ns,
normalizeInput:s=os,baseUrl:n=globalThis.location?.href}={}){const o=new Map,r=h=>({sessionId:h.sessionId,manifestCid:h.
manifestCid,status:h.engine?.lost?"lost":h.status,workerId:h.workerId,...h.engine?.getEvidence()});return async function(a,l={}){
if(t(),wi(a?.sessionId),tt(l.signal),a.command==="load"){if(o.size)throw new Error("Unload the resident 3D model first");
const{manifest:f}=e(a.manifest),m=i(a.runtimeAssets,n),p={sessionId:a.sessionId,manifestCid:a.manifestCid,manifest:f,status:"\
loading",workerId:l.workerId,engine:null};o.set(a.sessionId,p);try{return p.engine=await c({manifest:f,runtimeAssets:m,artifactPort:a.
artifactPort,signal:l.signal,onProgress:l.emitProgress}),tt(l.signal),p.status="ready",r(p)}catch(A){try{await p.engine?.
dispose(),o.delete(a.sessionId)}catch(M){throw p.status="lost",new AggregateError([A,M],"Model session lost: 3D cleanup \
failed")}throw A}}const u=o.get(a.sessionId);if(!u)throw new Error("3D model session is not loaded");if(a.command==="sta\
tus")return r(u);if(a.command==="unload")return u.status="unloading",await u.engine.dispose(),o.delete(a.sessionId),{sessionId:a.
sessionId,status:"unloaded"};if(a.command!=="generate")throw new Error("Unknown 3D model command");if(wi(a.requestId),u.
status!=="ready"||u.engine.lost)throw new Error("Model session lost: 3D model is not ready");const d=s(a,u.manifest);u.status=
"generating";try{const f=await u.engine.generate(d,{signal:l.signal,onProgress:l.emitProgress});return tt(l.signal),{...f,
sessionId:a.sessionId,requestId:a.requestId,workerId:u.workerId}}catch(f){throw(f instanceof WebAssembly.RuntimeError||/Model session lost/.
test(f?.message??""))&&(u.status="lost"),f}finally{u.status!=="lost"&&(u.status=u.engine.lost?"lost":"ready")}}}const Nn=fs();
var Un=Object.freeze({__proto__:null,createMeshTaskHandler:fs,handleModelTask:Nn});export{bt as F,Rs as S,wn as a,Ns as b,fs as c,bi as h,Un as m,bn as p,zs as v};
