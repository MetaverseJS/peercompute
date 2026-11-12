import{p as ce,a as fe,v as de,h as le,F as se,S as pe,b as me,c as he}from"./modelTask-Cvb4EiOR.js";import{c as ge}from"./GgufArtifactReader-DZX454k1.js";
import{t as E,b as oe}from"./ArtifactReadBridge-Bns2fboi.js";import{n as we}from"./ArtifactManifest-DPFdnZW5.js";import{
validateImageInput as ye}from"./modelTask-DAQz3pz1.js";const ne=160,be=860115782;function Se(r,o=1/0){const u=new DataView(
r);if(r.byteLength<16||u.getUint32(0,!0)!==be)throw Error("Invalid weight file magic/header");if(u.getUint32(4,!0)!==1)throw Error(
"Unsupported weight file version");const f=u.getUint32(8,!0),d=u.getUint32(12,!0);if(d!==16+f*ne||d!==r.byteLength||d>o)
throw Error("weight header exceeds or contradicts received bytes");const y=new Map,w=[];for(let s=0;s<f;s++){const e=16+
s*ne,n=new Uint8Array(r,e,128),c=n.indexOf(0),a=new TextDecoder("utf-8",{fatal:!0}).decode(n.subarray(0,c<0?128:c)),i=u.
getUint32(e+128,!0),p=u.getUint32(e+132,!0),g=Array.from({length:Math.min(p,4)},(F,v)=>u.getUint32(e+136+4*v,!0)),b=d+u.
getUint32(e+152,!0),t=u.getUint32(e+156,!0),h=i===0?4:2;if(!a||y.has(a)||i!==0&&i!==1||t===0||t%h||b%h||b+t>o)throw Error(
"invalid/duplicate/out-of-bounds flat tensor: "+a);if(p<=4&&g.reduce((F,v)=>F*v,1)*h!==t)throw Error("tensor shape/size \
conflict: "+a);y.set(a,{dtype:i,shape:g,declaredRank:p,shapeComplete:p<=4,offset:b,size:t}),w.push({name:a,offset:b,size:t})}
w.sort((s,e)=>s.offset-e.offset);for(let s=1;s<w.length;s++)if(w[s].offset<w[s-1].offset+w[s-1].size)throw Error("overla\
pping flat tensors: "+w[s].name);return{tensors:y,headerSize:d}}async function _e(){throw new Error("PeerCompute require\
s artifact-backed SF3D tensor ranges")}const j=4*1024**2;function Ee(r,{signal:o,onProgress:u}={}){async function f(s,e,n,c){
const a=r.stat(s);if(!Number.isSafeInteger(e)||!Number.isSafeInteger(n)||e<0||n<0||e>a.size||n>a.size-e)throw new Error(
"Invalid SF3D artifact range");for(let i=0;i<n;i+=j){E(o);const p=Math.min(j,n-i),g=await r.read(s,e+i,p,{signal:o});if(E(
o),!(g instanceof Uint8Array)||g.byteLength!==p)throw new Error("Truncated SF3D artifact read");await c(g,i),u?.({type:"\
model-load",stage:s,loaded:e+i+p,total:a.size})}}async function d(s,e,n,c=64*1024**2){if(!Number.isSafeInteger(n)||n<0||
n>c)throw new Error("SF3D CPU source allocation exceeds its budget");const a=new Uint8Array(n);return await f(s,e,n,(i,p)=>a.
set(i,p)),a}async function y(){const s=r.stat("weights.bin"),e=await d(s.path,0,16),n=new DataView(e.buffer),c=n.getUint32(
8,!0),a=n.getUint32(12,!0);if(a!==16+c*160||a>j||a>s.size)throw new Error("Invalid SF3D tensor table bounds");const i=await d(
s.path,0,a),{tensors:p}=Se(i.buffer,s.size);return{tensors:p,report:{mode:"peercompute-artifact-ranges",expectedWeightBytes:s.
size,tensorCount:p.size,maximumReadBytes:j,sha256:s.sha256},consumeTensor(g,b){const t=p.get(g);if(!t)throw new Error(`M\
issing SF3D tensor: ${g}`);return f(s.path,t.offset,t.size,b)},async readTensor(g){const b=p.get(g);if(!b)throw new Error(
`Missing SF3D tensor: ${g}`);return d(s.path,b.offset,b.size,256*1024**2)}}}async function w(){const s=r.stat("tets/vert\
ices.bin"),e=r.stat("tets/indices.bin");if(s.size%12||e.size%16)throw new Error("Invalid SF3D tet array layout");const n=new Float32Array(
(await d(s.path,0,s.size)).buffer),c=new Int32Array((await d(e.path,0,e.size)).buffer),a=n.length/3;if(!a||!c.length||n.
some(i=>!Number.isFinite(i)||i<-1e-6||i>1+1e-6)||c.some(i=>i<0||i>=a))throw new Error("Invalid SF3D tet values");return{
gridVertices:n,indices:c,numVertices:a,numTets:c.length/4}}return{read:d,consume:f,weights:y,tetData:w}}const X="86b7b68\
109434ffc33218f5fb697c7057c2518f9",ae=r=>Object.values(r??{}).forEach(o=>o.dispose?.()),De=()=>Promise.resolve().then(function(){
return Ae}),Fe=async()=>{const[r,o,u]=await Promise.all([import("./sf3d_producer-B_D9udqp.js"),import("./weights-CppNsbIv.js").
then(function(f){return f.w}),import("./shader_ops-CzZfOp7a.js").then(function(f){return f.s})]);return{createProducer:r.
createSf3dProducer,loadWeights:o.loadWeightsFromSource,getPersistentResources:u.getPersistentShaderResources}};function ve(r){
let o=-1,u=-1,f=0;const d=["image","shape","color","done"];return y=>{const w=String(y),s=w.toLowerCase();let e,n=0;if(s===
"done")e="done",n=1;else if(/foreground|preprocess|^image$/.test(s))e="image";else if(/clip-material|uv-unwrap|uv-rasterize|texture.bake|glb-export|^color$/.
test(s)){e="color",n=/glb-export/.test(s)?100:/texture.bake/.test(s)?40:/uv-rasterize/.test(s)?20:/uv-unwrap/.test(s)?10:
0;const a=/texture bake (\d+)\/(\d+)/i.exec(w);a&&Number(a[2])>0&&(n=40+Math.floor(Math.min(1,Number(a[1])/Number(a[2]))*
10)*5)}else if(/camera embedding|dinov2|two-stream|post-processor|triplane|tet grid|sdf|mesh|^shape$/.test(s)){e="shape",
n=/mesh extracted/.test(s)?100:/extracting mesh/.test(s)?90:/triplane|tet grid|sdf/.test(s)?80:/post-processor/.test(s)?
60:/two-stream/.test(s)?30:/dinov2/.test(s)?10:0;const a=/^(dinov2 blocks|two-stream duties) (\d+)\/(\d+)/i.exec(w);if(a&&
Number(a[3])>0){const i=Math.min(1,Number(a[2])/Number(a[3])),p=a[1].toLowerCase().startsWith("dinov2");n=(p?10:30)+Math.
floor(i*(p?3:5))*5}}else return;const c=d.indexOf(e);c<o||c===o&&n<=u||f>=31&&e!=="done"||(o=c,u=n,f++,r?.({type:"mesh-g\
eneration",stage:e,loaded:n,total:e==="done"?1:100}))}}function xe(r,o){const u=new Set,f=new Set;let d=!1,y=0,w=!1;o.liveBufferBytes=
0,o.peakBufferBytes=0,o.ortBufferAllocations=0,o.allocationAuthority="SF3D-owned requested WebGPU buffer bytes; excludes\
 ORT foreground buffers, driver overhead and physical VRAM",o.phaseAllocations=[];const s={createCommandEncoder:r.createCommandEncoder,
submit:r.queue.submit};r.createCommandEncoder=function(...e){const n=s.createCommandEncoder.apply(r,e),c=n.beginComputePass;
return n.beginComputePass=function(...a){const i=c.apply(n,a);for(const p of["dispatchWorkgroups","dispatchWorkgroupsInd\
irect"]){const g=i[p];typeof g=="function"&&(i[p]=function(...b){const t=g.apply(i,b);return o.gpuDispatches++,t})}return i},
n},r.queue.submit=function(...e){const n=s.submit.apply(r.queue,e);return o.gpuSubmissions++,n};for(const e of["createBu\
ffer","createTexture"])typeof r[e]=="function"&&(s[e]=r[e],r[e]=function(...n){const c=s[e].apply(r,n);if(!w)return e===
"createBuffer"&&o.ortBufferAllocations++,c;const a=e==="createBuffer"&&Number.isSafeInteger(n[0]?.size)?n[0].size:0;o.liveBufferBytes+=
a,o.peakBufferBytes=Math.max(o.peakBufferBytes,o.liveBufferBytes),u.add(c),d&&!y&&f.add(c);const i=c.destroy;return c.destroy=
function(){if(!u.has(c))return;const p=i.call(c);return u.delete(c),f.delete(c),o.liveBufferBytes-=a,p},c});return{async owned(e){
if(w)throw new Error("SF3D allocation ownership scopes cannot overlap");w=!0;try{return await e()}finally{w=!1}},persistent(e){
y++;try{return e()}finally{y--}},begin(){d=!0},retire(e,{keep:n=[],phase:c,finish:a=!0}={}){const i=new Set,p=new Set(n),
g=t=>{if(!(!t||typeof t!="object"||i.has(t))){if(i.add(t),u.has(t)){p.add(t);return}if(!(ArrayBuffer.isView(t)||t instanceof
ArrayBuffer||t===r)){if(t instanceof Map){for(const[h,F]of t)g(h),g(F);return}if(t instanceof Set){for(const h of t)g(h);
return}for(const h of Object.values(t))g(h)}}};g(e),a&&(d=!1);const b=o.liveBufferBytes;for(const t of[...f])p.has(t)||t.
destroy();c&&o.phaseAllocations.length<32&&o.phaseAllocations.push({phase:c,beforeBytes:b,afterBytes:o.liveBufferBytes,retiredBytes:b-
o.liveBufferBytes})},close(){d=!1;for(const e of[...u])try{e.destroy()}catch{}for(const[e,n]of Object.entries(s))e==="su\
bmit"?r.queue.submit=n:r[e]=n}}}async function Be({manifest:r,runtimeAssets:o,artifactPort:u,signal:f,onProgress:d,gpu:y=globalThis.
navigator?.gpu,loadRuntime:w=De,loadVendor:s=Fe,loadOrt:e=()=>import("./ort.webgpu.bundle.min-WyWkMMpy.js"),createReader:n=ge,
createSource:c=Ee,prepareForeground:a=ce,applyMask:i=fe,validateMesh:p=de}={}){const g=await w(),{manifest:b}=g.validateSf3dManifest(
r),t={runtime:"webgpu-sf3d",sourceCommit:X,gpuDispatches:0,gpuSubmissions:0,generatedRequests:0,foregroundRequests:0,subordinateWorkers:0};
let h,F,v,I,B,Z,O,C,N=()=>null,q=!1,L=!1,H=!1,G=null,W;const A=m=>{q||(L=!0,t.gpuFailure??=String(m?.message??m??"GPU de\
vice lost").slice(0,300))},te=m=>A(m.error);function P(){if(q)throw new Error("SF3D model is unloaded");if(L)throw new Error(
`Model session lost: SF3D ${t.gpuFailure}`)}async function _(m,l){P();const M=["validation","out-of-memory","internal"];
for(const x of M)h.pushErrorScope(x);let k,S;try{k=await l(),await h.queue.onSubmittedWorkDone()}catch(x){S=x}for(const x of M.
reverse())try{const D=await h.popErrorScope();D&&(A(D),S??=D)}catch(D){A(D),S??=D}if(q)throw new Error("SF3D model is un\
loaded");if(L||S){if(S?.name==="AbortError")throw S;A(S),ae(k);const x=`live=${t.liveBufferBytes}, peak=${t.peakBufferBytes}\
, stage=${t.lastStage??m}`;throw Object.assign(new Error(`Model session lost: SF3D ${m} (${x}): ${t.gpuFailure}`,{cause:S}),
{code:"ERR_SF3D_GPU"})}return k}function re(){return W||(q=!0,F?.close(),F=null,h?.removeEventListener("uncapturederror",
te),h?.destroy(),W=(async()=>{try{await G}catch{}const m=[];try{const l=I?.dispose();await(l?.completion??l)}catch(l){m.
push(l)}try{await O?.release()}catch(l){m.push(l)}try{B?.dispose()}catch(l){m.push(l)}v?.close(),I=O=B=Z=null,m.length&&
(t.cleanupFailures=m.map(l=>String(l.message??l)))})(),W)}try{E(f);const m=await y?.requestAdapter({powerPreference:"hig\
h-performance"});if(!m||m.isFallbackAdapter||m.info?.isFallbackAdapter)throw new Error("SF3D requires hardware WebGPU");
E(f);const l={};for(const D of["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkgroupStorageSize","maxComput\
eInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ","maxStorageBu\
ffersPerShaderStage"])m.limits[D]!==void 0&&(l[D]=m.limits[D]);h=await m.requestDevice({requiredLimits:l}),t.adapter={vendor:m.
info?.vendor??"",architecture:m.info?.architecture??"",isFallbackAdapter:!1},t.runtimeFeatures=[...h.features],h.addEventListener(
"uncapturederror",te),h.lost.then(A,A),v=xe(h,t),F=n(u,{manifest:b,signal:f,maxReadBytes:j,maxReads:1,maxQueuedReads:2,readTimeoutMs:6e4});
const M=c(F,{signal:f,onProgress:d}),k=await s();if(N=k.getPersistentResources??N,E(f),B=await v.owned(()=>_("weight loa\
ding",async()=>k.loadWeights(h,await M.weights()))),E(f),B._rawGet){const D=B._rawGet;B._rawGet=(...$)=>v.persistent(()=>D(
...$))}if(Z=await M.tetData(),E(f),C=await e(),C.env.versions.web!=="1.31.1")throw new Error("Unexpected SF3D foreground\
 ORT runtime version");C.env.wasm.proxy=!1,C.env.wasm.numThreads=1,C.env.wasm.wasmPaths=o;const S=F.stat("u2netp.onnx"),
x=await M.read(S.path,0,S.size);if(await _("foreground load",async()=>{O=await C.InferenceSession.create(x,{executionProviders:[
{name:"webgpu",device:h}],enableMemPattern:!1,enableCpuMemArena:!1,extra:{session:{disable_prepacking:"1"}}})}),O.inputNames.
join()!=="input.1"||O.outputNames.join()!=="1959,1960,1961,1962,1963,1964,1965")throw new Error("SF3D foreground graph d\
iffers from its pinned interface");E(f),I=await v.owned(()=>_("pipeline load",()=>k.createProducer({device:h,adapter:m,weights:B,
workers:{},commit:X}))),t.artifactReads=F.getStats(),F.close(),F=null,E(f),d?.({type:"model-load",stage:"ready",loaded:1,
total:1})}catch(m){throw await re(),m}async function ue(m,{signal:l,onProgress:M}={}){if(P(),H)throw new Error("SF3D mod\
el is already generating");const k=g.normalizeSf3dInput(m,b),S=ve(M);E(l),H=!0;const x=t.gpuDispatches,D=t.gpuSubmissions,
$=()=>{A(oe(l.reason)),h.destroy()};l?.addEventListener("abort",$,{once:!0}),G=(async()=>{try{S("image");let z=k.image;if(!le(
z)){S("foreground");const U=new C.Tensor("float32",a(z),[1,3,se,se]);let T;try{T=await _("foreground separation",()=>O.run(
{"input.1":U})),E(l);const Q=T[1959];if(Q?.type!=="float32"||Q.dims.join()!=="1,1,320,320")throw new Error("Unexpected S\
F3D foreground mask");z=i(z,Q.data),t.foregroundRequests++}finally{U.dispose(),ae(T)}}E(l),P(),v.begin();const R=await v.
owned(()=>_("generation",()=>I.run(z,{signal:l,runId:`peercompute-sf3d-${t.generatedRequests+1}`,routeOverrides:{tetData:Z,
async retirePhase(U,T){await h.queue.onSubmittedWorkDone(),E(l),P(),v.retire({pipelines:I.pipelines,weights:B,shaders:N()},
{keep:T,phase:U,finish:!1})}},onProgress(U){E(l),P(),t.lastStage=String(U).slice(0,300),S(t.lastStage)}})));if(E(l),t.gpuDispatches<=
x)throw new Error("SF3D execution did not dispatch work on the admitted GPU");t.lastUnvalidatedMesh={vertexCount:R.uvNumVertices??
R.numVertices,triangleCount:R.uvNumFaces??R.numFaces,byteLength:R.glb?.byteLength};const V=p({data:new Uint8Array(R.glb)});
return E(l),t.generatedRequests++,t.lastMesh={vertexCount:V.vertexCount,triangleCount:V.triangleCount,byteLength:V.byteLength},
t.lastRoute={sourceCommit:X,totalMs:R.totalMs,offloads:R.offloads,stageTimings:R.stageTimings},S("done"),{text:"",mesh:V,
gpuDispatches:t.gpuDispatches-x,gpuSubmissions:t.gpuSubmissions-D}}catch(z){throw A(z),h.destroy(),l?.aborted?oe(l.reason):
z}finally{l?.removeEventListener("abort",$),v.retire({pipelines:I?.pipelines,weights:B,shaders:N()}),H=!1}})();try{return await G}finally{
G=null}}return{get lost(){return L},getEvidence:()=>structuredClone(t),generate:ue,dispose:re}}const ke="0.1.60",J=1024**
3,K=Object.freeze({maxModelBytes:3*J,minimumCpuBytes:8*J,minimumGpuBytes:8*J}),ie=(r,o)=>r===o||r&&o&&typeof r=="object"&&
typeof o=="object"&&Array.isArray(r)===Array.isArray(o)&&Object.keys(r).length===Object.keys(o).length&&Object.keys(r).every(
u=>ie(r[u],o[u]));function Y(r){const o=we(r),u=Object.values(pe).find(d=>ie(d.model,o.model));if(!u||o.files.length!==u.
files.length||u.files.some(d=>!o.files.some(y=>y.path===d.path&&y.size===d.size&&y.sha256===d.sha256)))throw new Error("\
SF3D model package differs from its qualified runtime catalog");const f=o.files.reduce((d,y)=>d+y.size,0);if(!Number.isSafeInteger(
f)||f>K.maxModelBytes)throw new Error("SF3D model package exceeds its byte budget");return{manifest:o,trusted:u,totalBytes:f,
resourcePolicy:K}}function ee(r,o){if(Y(o),r.task!=null&&r.task!=="image-to-3d")throw new Error("SF3D generates 3D objec\
ts from images");if(r.audio!=null)throw new Error("SF3D does not accept audio");const u=ye(r.image);if(!u)throw new Error(
"SF3D requires an image of one object");if(r.prompt?.trim()||r.messages?.length)throw new Error("SF3D requires image inp\
ut; generate an image from text first");return{task:"image-to-3d",image:u}}const Re=Object.freeze({id:"webgpu-sf3d",moduleUrl:"\
peercompute:sf3d-inference",validateManifest:Y,validateRuntimeAssets:me,normalizeGenerationInput:ee,validateRuntimeOptions(r={}){
if(!r||typeof r!="object"||Array.isArray(r)||Object.keys(r).length)throw new Error("SF3D runtime options are fixed by th\
e qualified profile");return{}},retainArtifactBridge:!0,terminateOnUnload:!0,terminateOnGenerationAbort:!0});var Ae=Object.
freeze({__proto__:null,SF3D_RESOURCE_POLICY:K,SF3D_RUNTIME_VERSION:ke,normalizeSf3dInput:ee,sf3dRuntimeDefinition:Re,validateSf3dManifest:Y});
const Me=he({createEngine:Be,validateManifest:Y,normalizeInput:ee});var Te=Object.freeze({__proto__:null,handleModelTask:Me});export{_e as c,Te as s};
