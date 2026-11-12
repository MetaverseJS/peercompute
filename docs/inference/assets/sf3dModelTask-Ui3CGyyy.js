const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./main-Cvsn7onI.js","./index-6TlIxpa6.js","./main-BCX3ywto.css","./sf3d_producer-BhYMUwIM.js","./gpu-CbAOvyLy.js","./weights-C6-13gnr.js","./shader_ops-CyJowQ9K.js","./modelTask-_NIxBXmo.js","./GgufArtifactReader-B9TIlnMA.js"])))=>i.map(i=>d[i]);
import{p as ae,a as ne,h as ie,F as ee,c as ue}from"./modelTask-_NIxBXmo.js";import{_ as W}from"./index-6TlIxpa6.js";import{
c as ce}from"./GgufArtifactReader-B9TIlnMA.js";import{aw as S,aX as fe,az as te,aY as de,aZ as le}from"./main-Cvsn7onI.js";
const re=160,pe=860115782;function me(u,n=1/0){const m=new DataView(u);if(u.byteLength<16||m.getUint32(0,!0)!==pe)throw Error(
"Invalid weight file magic/header");if(m.getUint32(4,!0)!==1)throw Error("Unsupported weight file version");const d=m.getUint32(
8,!0),w=m.getUint32(12,!0);if(w!==16+d*re||w!==u.byteLength||w>n)throw Error("weight header exceeds or contradicts recei\
ved bytes");const D=new Map,g=[];for(let r=0;r<d;r++){const e=16+r*re,o=new Uint8Array(u,e,128),i=o.indexOf(0),s=new TextDecoder(
"utf-8",{fatal:!0}).decode(o.subarray(0,i<0?128:i)),a=m.getUint32(e+128,!0),f=m.getUint32(e+132,!0),h=Array.from({length:Math.
min(f,4)},(x,v)=>m.getUint32(e+136+4*v,!0)),y=w+m.getUint32(e+152,!0),t=m.getUint32(e+156,!0),p=a===0?4:2;if(!s||D.has(s)||
a!==0&&a!==1||t===0||t%p||y%p||y+t>n)throw Error("invalid/duplicate/out-of-bounds flat tensor: "+s);if(f<=4&&h.reduce((x,v)=>x*
v,1)*p!==t)throw Error("tensor shape/size conflict: "+s);D.set(s,{dtype:a,shape:h,declaredRank:f,shapeComplete:f<=4,offset:y,
size:t}),g.push({name:s,offset:y,size:t})}g.sort((r,e)=>r.offset-e.offset);for(let r=1;r<g.length;r++)if(g[r].offset<g[r-
1].offset+g[r-1].size)throw Error("overlapping flat tensors: "+g[r].name);return{tensors:D,headerSize:w}}async function Be(){
throw new Error("PeerCompute requires artifact-backed SF3D tensor ranges")}const O=4*1024**2;function he(u,{signal:n,onProgress:m}={}){
async function d(r,e,o,i){const s=u.stat(r);if(!Number.isSafeInteger(e)||!Number.isSafeInteger(o)||e<0||o<0||e>s.size||o>
s.size-e)throw new Error("Invalid SF3D artifact range");for(let a=0;a<o;a+=O){S(n);const f=Math.min(O,o-a),h=await u.read(
r,e+a,f,{signal:n});if(S(n),!(h instanceof Uint8Array)||h.byteLength!==f)throw new Error("Truncated SF3D artifact read");
await i(h,a),m?.({type:"model-load",stage:r,loaded:e+a+f,total:s.size})}}async function w(r,e,o,i=64*1024**2){if(!Number.
isSafeInteger(o)||o<0||o>i)throw new Error("SF3D CPU source allocation exceeds its budget");const s=new Uint8Array(o);return await d(
r,e,o,(a,f)=>s.set(a,f)),s}async function D(){const r=u.stat("weights.bin"),e=await w(r.path,0,16),o=new DataView(e.buffer),
i=o.getUint32(8,!0),s=o.getUint32(12,!0);if(s!==16+i*160||s>O||s>r.size)throw new Error("Invalid SF3D tensor table bound\
s");const a=await w(r.path,0,s),{tensors:f}=me(a.buffer,r.size);return{tensors:f,report:{mode:"peercompute-artifact-rang\
es",expectedWeightBytes:r.size,tensorCount:f.size,maximumReadBytes:O,sha256:r.sha256},consumeTensor(h,y){const t=f.get(h);
if(!t)throw new Error(`Missing SF3D tensor: ${h}`);return d(r.path,t.offset,t.size,y)},async readTensor(h){const y=f.get(
h);if(!y)throw new Error(`Missing SF3D tensor: ${h}`);return w(r.path,y.offset,y.size,256*1024**2)}}}async function g(){
const r=u.stat("tets/vertices.bin"),e=u.stat("tets/indices.bin");if(r.size%12||e.size%16)throw new Error("Invalid SF3D t\
et array layout");const o=new Float32Array((await w(r.path,0,r.size)).buffer),i=new Int32Array((await w(e.path,0,e.size)).
buffer),s=o.length/3;if(!s||!i.length||o.some(a=>!Number.isFinite(a)||a<-1e-6||a>1+1e-6)||i.some(a=>a<0||a>=s))throw new Error(
"Invalid SF3D tet values");return{gridVertices:o,indices:i,numVertices:s,numTets:i.length/4}}return{read:w,consume:d,weights:D,
tetData:g}}const Q="86b7b68109434ffc33218f5fb697c7057c2518f9",oe=u=>Object.values(u??{}).forEach(n=>n.dispose?.()),we=()=>W(
()=>import("./main-Cvsn7onI.js").then(u=>u.bS),__vite__mapDeps([0,1,2]),import.meta.url),ge=async()=>{const[u,n,m]=await Promise.
all([W(()=>import("./sf3d_producer-BhYMUwIM.js"),__vite__mapDeps([3,4,5,6,7,1,8,0,2]),import.meta.url),W(()=>import("./weights-C6-13gnr.js").
then(d=>d.w),__vite__mapDeps([5,4]),import.meta.url),W(()=>import("./shader_ops-CyJowQ9K.js").then(d=>d.s),__vite__mapDeps([6,4]),import.meta.
url)]);return{createProducer:u.createSf3dProducer,loadWeights:n.loadWeightsFromSource,getPersistentResources:m.getPersistentShaderResources}};
function ye(u){let n=-1,m=-1,d=0;const w=["image","shape","color","done"];return D=>{const g=String(D),r=g.toLowerCase();
let e,o=0;if(r==="done")e="done",o=1;else if(/foreground|preprocess|^image$/.test(r))e="image";else if(/clip-material|uv-unwrap|uv-rasterize|texture.bake|glb-export|^color$/.
test(r)){e="color",o=/glb-export/.test(r)?100:/texture.bake/.test(r)?40:/uv-rasterize/.test(r)?20:/uv-unwrap/.test(r)?10:
0;const s=/texture bake (\d+)\/(\d+)/i.exec(g);s&&Number(s[2])>0&&(o=40+Math.floor(Math.min(1,Number(s[1])/Number(s[2]))*
10)*5)}else if(/camera embedding|dinov2|two-stream|post-processor|triplane|tet grid|sdf|mesh|^shape$/.test(r)){e="shape",
o=/mesh extracted/.test(r)?100:/extracting mesh/.test(r)?90:/triplane|tet grid|sdf/.test(r)?80:/post-processor/.test(r)?
60:/two-stream/.test(r)?30:/dinov2/.test(r)?10:0;const s=/^(dinov2 blocks|two-stream duties) (\d+)\/(\d+)/i.exec(g);if(s&&
Number(s[3])>0){const a=Math.min(1,Number(s[2])/Number(s[3])),f=s[1].toLowerCase().startsWith("dinov2");o=(f?10:30)+Math.
floor(a*(f?3:5))*5}}else return;const i=w.indexOf(e);i<n||i===n&&o<=m||d>=31&&e!=="done"||(n=i,m=o,d++,u?.({type:"mesh-g\
eneration",stage:e,loaded:o,total:e==="done"?1:100}))}}function be(u,n){const m=new Set,d=new Set;let w=!1,D=0,g=!1;n.liveBufferBytes=
0,n.peakBufferBytes=0,n.ortBufferAllocations=0,n.allocationAuthority="SF3D-owned requested WebGPU buffer bytes; excludes\
 ORT foreground buffers, driver overhead and physical VRAM",n.phaseAllocations=[];const r={createCommandEncoder:u.createCommandEncoder,
submit:u.queue.submit};u.createCommandEncoder=function(...e){const o=r.createCommandEncoder.apply(u,e),i=o.beginComputePass;
return o.beginComputePass=function(...s){const a=i.apply(o,s);for(const f of["dispatchWorkgroups","dispatchWorkgroupsInd\
irect"]){const h=a[f];typeof h=="function"&&(a[f]=function(...y){const t=h.apply(a,y);return n.gpuDispatches++,t})}return a},
o},u.queue.submit=function(...e){const o=r.submit.apply(u.queue,e);return n.gpuSubmissions++,o};for(const e of["createBu\
ffer","createTexture"])typeof u[e]=="function"&&(r[e]=u[e],u[e]=function(...o){const i=r[e].apply(u,o);if(!g)return e===
"createBuffer"&&n.ortBufferAllocations++,i;const s=e==="createBuffer"&&Number.isSafeInteger(o[0]?.size)?o[0].size:0;n.liveBufferBytes+=
s,n.peakBufferBytes=Math.max(n.peakBufferBytes,n.liveBufferBytes),m.add(i),w&&!D&&d.add(i);const a=i.destroy;return i.destroy=
function(){if(!m.has(i))return;const f=a.call(i);return m.delete(i),d.delete(i),n.liveBufferBytes-=s,f},i});return{async owned(e){
if(g)throw new Error("SF3D allocation ownership scopes cannot overlap");g=!0;try{return await e()}finally{g=!1}},persistent(e){
D++;try{return e()}finally{D--}},begin(){w=!0},retire(e,{keep:o=[],phase:i,finish:s=!0}={}){const a=new Set,f=new Set(o),
h=t=>{if(!(!t||typeof t!="object"||a.has(t))){if(a.add(t),m.has(t)){f.add(t);return}if(!(ArrayBuffer.isView(t)||t instanceof
ArrayBuffer||t===u)){if(t instanceof Map){for(const[p,x]of t)h(p),h(x);return}if(t instanceof Set){for(const p of t)h(p);
return}for(const p of Object.values(t))h(p)}}};h(e),s&&(w=!1);const y=n.liveBufferBytes;for(const t of[...d])f.has(t)||t.
destroy();i&&n.phaseAllocations.length<32&&n.phaseAllocations.push({phase:i,beforeBytes:y,afterBytes:n.liveBufferBytes,retiredBytes:y-
n.liveBufferBytes})},close(){w=!1;for(const e of[...m])try{e.destroy()}catch{}for(const[e,o]of Object.entries(r))e==="su\
bmit"?u.queue.submit=o:u[e]=o}}}async function Se({manifest:u,runtimeAssets:n,artifactPort:m,signal:d,onProgress:w,gpu:D=globalThis.
navigator?.gpu,loadRuntime:g=we,loadVendor:r=ge,loadOrt:e=()=>W(()=>import("./ort.webgpu.bundle.min-WyWkMMpy.js"),[],
import.meta.url),createReader:o=ce,createSource:i=he,prepareForeground:s=ae,applyMask:a=ne,validateMesh:f=fe}={}){const h=await g(),
{manifest:y}=h.validateSf3dManifest(u),t={runtime:"webgpu-sf3d",sourceCommit:Q,gpuDispatches:0,gpuSubmissions:0,generatedRequests:0,
foregroundRequests:0,subordinateWorkers:0};let p,x,v,C,_,Z,I,M,q=()=>null,N=!1,G=!1,H=!1,V=null,$;const R=l=>{N||(G=!0,t.
gpuFailure??=String(l?.message??l??"GPU device lost").slice(0,300))},J=l=>R(l.error);function T(){if(N)throw new Error("\
SF3D model is unloaded");if(G)throw new Error(`Model session lost: SF3D ${t.gpuFailure}`)}async function U(l,c){T();const A=[
"validation","out-of-memory","internal"];for(const F of A)p.pushErrorScope(F);let B,b;try{B=await c(),await p.queue.onSubmittedWorkDone()}catch(F){
b=F}for(const F of A.reverse())try{const E=await p.popErrorScope();E&&(R(E),b??=E)}catch(E){R(E),b??=E}if(N)throw new Error(
"SF3D model is unloaded");if(G||b){if(b?.name==="AbortError")throw b;R(b),oe(B);const F=`live=${t.liveBufferBytes}, peak\
=${t.peakBufferBytes}, stage=${t.lastStage??l}`;throw Object.assign(new Error(`Model session lost: SF3D ${l} (${F}): ${t.
gpuFailure}`,{cause:b}),{code:"ERR_SF3D_GPU"})}return B}function K(){return $||(N=!0,x?.close(),x=null,p?.removeEventListener(
"uncapturederror",J),p?.destroy(),$=(async()=>{try{await V}catch{}const l=[];try{const c=C?.dispose();await(c?.completion??
c)}catch(c){l.push(c)}try{await I?.release()}catch(c){l.push(c)}try{_?.dispose()}catch(c){l.push(c)}v?.close(),C=I=_=Z=null,
l.length&&(t.cleanupFailures=l.map(c=>String(c.message??c)))})(),$)}try{S(d);const l=await D?.requestAdapter({powerPreference:"\
high-performance"});if(!l||l.isFallbackAdapter||l.info?.isFallbackAdapter)throw new Error("SF3D requires hardware WebGPU");
S(d);const c={};for(const E of["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkgroupStorageSize","maxComput\
eInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ","maxStorageBu\
ffersPerShaderStage"])l.limits[E]!==void 0&&(c[E]=l.limits[E]);p=await l.requestDevice({requiredLimits:c}),t.adapter={vendor:l.
info?.vendor??"",architecture:l.info?.architecture??"",isFallbackAdapter:!1},t.runtimeFeatures=[...p.features],p.addEventListener(
"uncapturederror",J),p.lost.then(R,R),v=be(p,t),x=o(m,{manifest:y,signal:d,maxReadBytes:O,maxReads:1,maxQueuedReads:2,readTimeoutMs:6e4});
const A=i(x,{signal:d,onProgress:w}),B=await r();if(q=B.getPersistentResources??q,S(d),_=await v.owned(()=>U("weight loa\
ding",async()=>B.loadWeights(p,await A.weights()))),S(d),_._rawGet){const E=_._rawGet;_._rawGet=(...j)=>v.persistent(()=>E(
...j))}if(Z=await A.tetData(),S(d),M=await e(),M.env.versions.web!=="1.31.1")throw new Error("Unexpected SF3D foreground\
 ORT runtime version");M.env.wasm.proxy=!1,M.env.wasm.numThreads=1,M.env.wasm.wasmPaths=n;const b=x.stat("u2netp.onnx"),
F=await A.read(b.path,0,b.size);if(await U("foreground load",async()=>{I=await M.InferenceSession.create(F,{executionProviders:[
{name:"webgpu",device:p}],enableMemPattern:!1,enableCpuMemArena:!1,extra:{session:{disable_prepacking:"1"}}})}),I.inputNames.
join()!=="input.1"||I.outputNames.join()!=="1959,1960,1961,1962,1963,1964,1965")throw new Error("SF3D foreground graph d\
iffers from its pinned interface");S(d),C=await v.owned(()=>U("pipeline load",()=>B.createProducer({device:p,adapter:l,weights:_,
workers:{},commit:Q}))),t.artifactReads=x.getStats(),x.close(),x=null,S(d),w?.({type:"model-load",stage:"ready",loaded:1,
total:1})}catch(l){throw await K(),l}async function se(l,{signal:c,onProgress:A}={}){if(T(),H)throw new Error("SF3D mode\
l is already generating");const B=h.normalizeSf3dInput(l,y),b=ye(A);S(c),H=!0;const F=t.gpuDispatches,E=t.gpuSubmissions,
j=()=>{R(te(c.reason)),p.destroy()};c?.addEventListener("abort",j,{once:!0}),V=(async()=>{try{b("image");let P=B.image;if(!ie(
P)){b("foreground");const z=new M.Tensor("float32",s(P),[1,3,ee,ee]);let L;try{L=await U("foreground separation",()=>I.run(
{"input.1":z})),S(c);const X=L[1959];if(X?.type!=="float32"||X.dims.join()!=="1,1,320,320")throw new Error("Unexpected S\
F3D foreground mask");P=a(P,X.data),t.foregroundRequests++}finally{z.dispose(),oe(L)}}S(c),T(),v.begin();const k=await v.
owned(()=>U("generation",()=>C.run(P,{signal:c,runId:`peercompute-sf3d-${t.generatedRequests+1}`,routeOverrides:{tetData:Z,
async retirePhase(z,L){await p.queue.onSubmittedWorkDone(),S(c),T(),v.retire({pipelines:C.pipelines,weights:_,shaders:q()},
{keep:L,phase:z,finish:!1})}},onProgress(z){S(c),T(),t.lastStage=String(z).slice(0,300),b(t.lastStage)}})));if(S(c),t.gpuDispatches<=
F)throw new Error("SF3D execution did not dispatch work on the admitted GPU");t.lastUnvalidatedMesh={vertexCount:k.uvNumVertices??
k.numVertices,triangleCount:k.uvNumFaces??k.numFaces,byteLength:k.glb?.byteLength};const Y=f({data:new Uint8Array(k.glb)});
return S(c),t.generatedRequests++,t.lastMesh={vertexCount:Y.vertexCount,triangleCount:Y.triangleCount,byteLength:Y.byteLength},
t.lastRoute={sourceCommit:Q,totalMs:k.totalMs,offloads:k.offloads,stageTimings:k.stageTimings},b("done"),{text:"",mesh:Y,
gpuDispatches:t.gpuDispatches-F,gpuSubmissions:t.gpuSubmissions-E}}catch(P){throw R(P),p.destroy(),c?.aborted?te(c.reason):
P}finally{c?.removeEventListener("abort",j),v.retire({pipelines:C?.pipelines,weights:_,shaders:q()}),H=!1}})();try{return await V}finally{
V=null}}return{get lost(){return G},getEvidence:()=>structuredClone(t),generate:se,dispose:K}}const Ee=ue({createEngine:Se,
validateManifest:le,normalizeInput:de}),ke=Object.freeze(Object.defineProperty({__proto__:null,handleModelTask:Ee},Symbol.
toStringTag,{value:"Module"}));export{Be as c,ke as s};
