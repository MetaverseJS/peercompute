const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./sf3dRuntimeDefinition-BJfqC1mf.js","./peercomputeDevice-CsBDVadn.js","./device-B4S7QtIr.js","./runtimeDefinition-B68o1qe9.js","./sf3d_producer-DwBCb2zn.js","./gpu-D2F42Yvf.js","./weights-BvcCH8uu.js","./shader_ops-BJL_IczZ.js","./modelTask-D-8qeUIo.js","./GgufArtifactReader-C5cYJgpn.js"])))=>i.map(i=>d[i]);
import{p as fe,a as de,h as le,F as ae,c as pe}from"./modelTask-D-8qeUIo.js";import{t as S,_ as N,q as me,d as ne}from"./peercomputeDevice-CsBDVadn.js";
import{c as he}from"./GgufArtifactReader-C5cYJgpn.js";import{normalizeSf3dInput as we,validateSf3dManifest as ye}from"./sf3dRuntimeDefinition-BJfqC1mf.js";
const ie=160,ge=860115782;function be(c,a=1/0){const d=new DataView(c);if(c.byteLength<16||d.getUint32(0,!0)!==ge)throw Error(
"Invalid weight file magic/header");if(d.getUint32(4,!0)!==1)throw Error("Unsupported weight file version");const m=d.getUint32(
8,!0),y=d.getUint32(12,!0);if(y!==16+m*ie||y!==c.byteLength||y>a)throw Error("weight header exceeds or contradicts recei\
ved bytes");const D=new Map,g=[];for(let t=0;t<m;t++){const e=16+t*ie,r=new Uint8Array(c,e,128),u=r.indexOf(0),s=new TextDecoder(
"utf-8",{fatal:!0}).decode(r.subarray(0,u<0?128:u)),i=d.getUint32(e+128,!0),l=d.getUint32(e+132,!0),h=Array.from({length:Math.
min(l,4)},(w,x)=>d.getUint32(e+136+4*x,!0)),b=y+d.getUint32(e+152,!0),f=d.getUint32(e+156,!0),n=i===0?4:2;if(!s||D.has(s)||
i!==0&&i!==1||f===0||f%n||b%n||b+f>a)throw Error("invalid/duplicate/out-of-bounds flat tensor: "+s);if(l<=4&&h.reduce((w,x)=>w*
x,1)*n!==f)throw Error("tensor shape/size conflict: "+s);D.set(s,{dtype:i,shape:h,declaredRank:l,shapeComplete:l<=4,offset:b,
size:f}),g.push({name:s,offset:b,size:f})}g.sort((t,e)=>t.offset-e.offset);for(let t=1;t<g.length;t++)if(g[t].offset<g[t-
1].offset+g[t-1].size)throw Error("overlapping flat tensors: "+g[t].name);return{tensors:D,headerSize:y}}async function ke(){
throw new Error("PeerCompute requires artifact-backed SF3D tensor ranges")}const W=4*1024**2;function Ee(c,{signal:a,onProgress:d}={}){
async function m(t,e,r,u){const s=c.stat(t);if(!Number.isSafeInteger(e)||!Number.isSafeInteger(r)||e<0||r<0||e>s.size||r>
s.size-e)throw new Error("Invalid SF3D artifact range");for(let i=0;i<r;i+=W){S(a);const l=Math.min(W,r-i),h=await c.read(
t,e+i,l,{signal:a});if(S(a),!(h instanceof Uint8Array)||h.byteLength!==l)throw new Error("Truncated SF3D artifact read");
await u(h,i),d==null||d({type:"model-load",stage:t,loaded:e+i+l,total:s.size})}}async function y(t,e,r,u=64*1024**2){if(!Number.
isSafeInteger(r)||r<0||r>u)throw new Error("SF3D CPU source allocation exceeds its budget");const s=new Uint8Array(r);return await m(
t,e,r,(i,l)=>s.set(i,l)),s}async function D(){const t=c.stat("weights.bin"),e=await y(t.path,0,16),r=new DataView(e.buffer),
u=r.getUint32(8,!0),s=r.getUint32(12,!0);if(s!==16+u*160||s>W||s>t.size)throw new Error("Invalid SF3D tensor table bound\
s");const i=await y(t.path,0,s),{tensors:l}=be(i.buffer,t.size);return{tensors:l,report:{mode:"peercompute-artifact-rang\
es",expectedWeightBytes:t.size,tensorCount:l.size,maximumReadBytes:W,sha256:t.sha256},consumeTensor(h,b){const f=l.get(h);
if(!f)throw new Error(`Missing SF3D tensor: ${h}`);return m(t.path,f.offset,f.size,b)},async readTensor(h){const b=l.get(
h);if(!b)throw new Error(`Missing SF3D tensor: ${h}`);return y(t.path,b.offset,b.size,256*1024**2)}}}async function g(){
const t=c.stat("tets/vertices.bin"),e=c.stat("tets/indices.bin");if(t.size%12||e.size%16)throw new Error("Invalid SF3D t\
et array layout");const r=new Float32Array((await y(t.path,0,t.size)).buffer),u=new Int32Array((await y(e.path,0,e.size)).
buffer),s=r.length/3;if(!s||!u.length||r.some(i=>!Number.isFinite(i)||i<-1e-6||i>1+1e-6)||u.some(i=>i<0||i>=s))throw new Error(
"Invalid SF3D tet values");return{gridVertices:r,indices:u,numVertices:s,numTets:u.length/4}}return{read:y,consume:m,weights:D,
tetData:g}}const J="86b7b68109434ffc33218f5fb697c7057c2518f9",ue=c=>Object.values(c??{}).forEach(a=>{var d;return(d=a.dispose)==
null?void 0:d.call(a)}),Se=()=>N(()=>import("./sf3dRuntimeDefinition-BJfqC1mf.js"),__vite__mapDeps([0,1,2,3]),import.meta.url),De=async()=>{
const[c,a,d]=await Promise.all([N(()=>import("./sf3d_producer-DwBCb2zn.js"),__vite__mapDeps([4,5,6,7,8,1,2,9,3,0]),import.meta.url),N(()=>import("./weights-BvcCH8uu.js").
then(m=>m.w),__vite__mapDeps([6,5]),import.meta.url),N(()=>import("./shader_ops-BJL_IczZ.js").then(m=>m.s),__vite__mapDeps([7,5]),import.meta.
url)]);return{createProducer:c.createSf3dProducer,loadWeights:a.loadWeightsFromSource,getPersistentResources:d.getPersistentShaderResources}};
function xe(c){let a=-1,d=-1,m=0;const y=["image","shape","color","done"];return D=>{const g=String(D),t=g.toLowerCase();
let e,r=0;if(t==="done")e="done",r=1;else if(/foreground|preprocess|^image$/.test(t))e="image";else if(/clip-material|uv-unwrap|uv-rasterize|texture.bake|glb-export|^color$/.
test(t)){e="color",r=/glb-export/.test(t)?100:/texture.bake/.test(t)?40:/uv-rasterize/.test(t)?20:/uv-unwrap/.test(t)?10:
0;const s=/texture bake (\d+)\/(\d+)/i.exec(g);s&&Number(s[2])>0&&(r=40+Math.floor(Math.min(1,Number(s[1])/Number(s[2]))*
10)*5)}else if(/camera embedding|dinov2|two-stream|post-processor|triplane|tet grid|sdf|mesh|^shape$/.test(t)){e="shape",
r=/mesh extracted/.test(t)?100:/extracting mesh/.test(t)?90:/triplane|tet grid|sdf/.test(t)?80:/post-processor/.test(t)?
60:/two-stream/.test(t)?30:/dinov2/.test(t)?10:0;const s=/^(dinov2 blocks|two-stream duties) (\d+)\/(\d+)/i.exec(g);if(s&&
Number(s[3])>0){const i=Math.min(1,Number(s[2])/Number(s[3])),l=s[1].toLowerCase().startsWith("dinov2");r=(l?10:30)+Math.
floor(i*(l?3:5))*5}}else return;const u=y.indexOf(e);u<a||u===a&&r<=d||m>=31&&e!=="done"||(a=u,d=r,m++,c==null||c({type:"\
mesh-generation",stage:e,loaded:r,total:e==="done"?1:100}))}}function Fe(c,a){const d=new Set,m=new Set;let y=!1,D=0,g=!1;
a.liveBufferBytes=0,a.peakBufferBytes=0,a.ortBufferAllocations=0,a.allocationAuthority="SF3D-owned requested WebGPU buff\
er bytes; excludes ORT foreground buffers, driver overhead and physical VRAM",a.phaseAllocations=[];const t={createCommandEncoder:c.
createCommandEncoder,submit:c.queue.submit};c.createCommandEncoder=function(...e){const r=t.createCommandEncoder.apply(c,
e),u=r.beginComputePass;return r.beginComputePass=function(...s){const i=u.apply(r,s);for(const l of["dispatchWorkgroups",
"dispatchWorkgroupsIndirect"]){const h=i[l];typeof h=="function"&&(i[l]=function(...b){const f=h.apply(i,b);return a.gpuDispatches++,
f})}return i},r},c.queue.submit=function(...e){const r=t.submit.apply(c.queue,e);return a.gpuSubmissions++,r};for(const e of[
"createBuffer","createTexture"])typeof c[e]=="function"&&(t[e]=c[e],c[e]=function(...r){var l;const u=t[e].apply(c,r);if(!g)
return e==="createBuffer"&&a.ortBufferAllocations++,u;const s=e==="createBuffer"&&Number.isSafeInteger((l=r[0])==null?void 0:
l.size)?r[0].size:0;a.liveBufferBytes+=s,a.peakBufferBytes=Math.max(a.peakBufferBytes,a.liveBufferBytes),d.add(u),y&&!D&&
m.add(u);const i=u.destroy;return u.destroy=function(){if(!d.has(u))return;const h=i.call(u);return d.delete(u),m.delete(
u),a.liveBufferBytes-=s,h},u});return{async owned(e){if(g)throw new Error("SF3D allocation ownership scopes cannot overl\
ap");g=!0;try{return await e()}finally{g=!1}},persistent(e){D++;try{return e()}finally{D--}},begin(){y=!0},retire(e,{keep:r=[],
phase:u,finish:s=!0}={}){const i=new Set,l=new Set(r),h=f=>{if(!(!f||typeof f!="object"||i.has(f))){if(i.add(f),d.has(f)){
l.add(f);return}if(!(ArrayBuffer.isView(f)||f instanceof ArrayBuffer||f===c)){if(f instanceof Map){for(const[n,w]of f)h(
n),h(w);return}if(f instanceof Set){for(const n of f)h(n);return}for(const n of Object.values(f))h(n)}}};h(e),s&&(y=!1);
const b=a.liveBufferBytes;for(const f of[...m])l.has(f)||f.destroy();u&&a.phaseAllocations.length<32&&a.phaseAllocations.
push({phase:u,beforeBytes:b,afterBytes:a.liveBufferBytes,retiredBytes:b-a.liveBufferBytes})},close(){y=!1;for(const e of[
...d])try{e.destroy()}catch{}for(const[e,r]of Object.entries(t))e==="submit"?c.queue.submit=r:c[e]=r}}}async function _e({
manifest:c,runtimeAssets:a,artifactPort:d,signal:m,onProgress:y,gpu:D=(h=>(h=globalThis.navigator)==null?void 0:h.gpu)(),
loadRuntime:g=Se,loadVendor:t=De,loadOrt:e=()=>N(()=>import("./ort.webgpu.bundle.min-DjbyQ3vR.js"),[],import.meta.
url),createReader:r=he,createSource:u=Ee,prepareForeground:s=fe,applyMask:i=de,validateMesh:l=me}={}){var te,re,se;const b=await g(),
{manifest:f}=b.validateSf3dManifest(c),n={runtime:"webgpu-sf3d",sourceCommit:J,gpuDispatches:0,gpuSubmissions:0,generatedRequests:0,
foregroundRequests:0,subordinateWorkers:0};let w,x,_,R,B,Q,C,T,G=()=>null,V=!1,$=!1,X=!1,j=null,Y;const k=p=>{V||($=!0,n.
gpuFailure??(n.gpuFailure=String((p==null?void 0:p.message)??p??"GPU device lost").slice(0,300)))},K=p=>k(p.error);function P(){
if(V)throw new Error("SF3D model is unloaded");if($)throw new Error(`Model session lost: SF3D ${n.gpuFailure}`)}async function L(p,o){
P();const I=["validation","out-of-memory","internal"];for(const v of I)w.pushErrorScope(v);let A,E;try{A=await o(),await w.
queue.onSubmittedWorkDone()}catch(v){E=v}for(const v of I.reverse())try{const F=await w.popErrorScope();F&&(k(F),E??(E=F))}catch(F){
k(F),E??(E=F)}if(V)throw new Error("SF3D model is unloaded");if($||E){if((E==null?void 0:E.name)==="AbortError")throw E;
k(E),ue(A);const v=`live=${n.liveBufferBytes}, peak=${n.peakBufferBytes}, stage=${n.lastStage??p}`;throw Object.assign(new Error(
`Model session lost: SF3D ${p} (${v}): ${n.gpuFailure}`,{cause:E}),{code:"ERR_SF3D_GPU"})}return A}function ee(){return Y||
(V=!0,x==null||x.close(),x=null,w==null||w.removeEventListener("uncapturederror",K),w==null||w.destroy(),Y=(async()=>{try{
await j}catch{}const p=[];try{const o=R==null?void 0:R.dispose();await((o==null?void 0:o.completion)??o)}catch(o){p.push(
o)}try{await(C==null?void 0:C.release())}catch(o){p.push(o)}try{B==null||B.dispose()}catch(o){p.push(o)}_==null||_.close(),
R=C=B=Q=null,p.length&&(n.cleanupFailures=p.map(o=>String(o.message??o)))})(),Y)}try{S(m);const p=await(D==null?void 0:D.
requestAdapter({powerPreference:"high-performance"}));if(!p||p.isFallbackAdapter||(te=p.info)!=null&&te.isFallbackAdapter)
throw new Error("SF3D requires hardware WebGPU");S(m);const o={};for(const F of["maxBufferSize","maxStorageBufferBinding\
Size","maxComputeWorkgroupStorageSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgro\
upSizeY","maxComputeWorkgroupSizeZ","maxStorageBuffersPerShaderStage"])p.limits[F]!==void 0&&(o[F]=p.limits[F]);w=await p.
requestDevice({requiredLimits:o}),n.adapter={vendor:((re=p.info)==null?void 0:re.vendor)??"",architecture:((se=p.info)==
null?void 0:se.architecture)??"",isFallbackAdapter:!1},n.runtimeFeatures=[...w.features],w.addEventListener("uncapturede\
rror",K),w.lost.then(k,k),_=Fe(w,n),x=r(d,{manifest:f,signal:m,maxReadBytes:W,maxReads:1,maxQueuedReads:2,readTimeoutMs:6e4});
const I=u(x,{signal:m,onProgress:y}),A=await t();if(G=A.getPersistentResources??G,S(m),B=await _.owned(()=>L("weight loa\
ding",async()=>A.loadWeights(w,await I.weights()))),S(m),B._rawGet){const F=B._rawGet;B._rawGet=(...Z)=>_.persistent(()=>F(
...Z))}if(Q=await I.tetData(),S(m),T=await e(),T.env.versions.web!=="1.31.1")throw new Error("Unexpected SF3D foreground\
 ORT runtime version");T.env.wasm.proxy=!1,T.env.wasm.numThreads=1,T.env.wasm.wasmPaths=a;const E=x.stat("u2netp.onnx"),
v=await I.read(E.path,0,E.size);if(await L("foreground load",async()=>{C=await T.InferenceSession.create(v,{executionProviders:[
{name:"webgpu",device:w}],enableMemPattern:!1,enableCpuMemArena:!1,extra:{session:{disable_prepacking:"1"}}})}),C.inputNames.
join()!=="input.1"||C.outputNames.join()!=="1959,1960,1961,1962,1963,1964,1965")throw new Error("SF3D foreground graph d\
iffers from its pinned interface");S(m),R=await _.owned(()=>L("pipeline load",()=>A.createProducer({device:w,adapter:p,weights:B,
workers:{},commit:J}))),n.artifactReads=x.getStats(),x.close(),x=null,S(m),y==null||y({type:"model-load",stage:"ready",loaded:1,
total:1})}catch(p){throw await ee(),p}async function ce(p,{signal:o,onProgress:I}={}){if(P(),X)throw new Error("SF3D mod\
el is already generating");const A=b.normalizeSf3dInput(p,f),E=xe(I);S(o),X=!0;const v=n.gpuDispatches,F=n.gpuSubmissions,
Z=()=>{k(ne(o.reason)),w.destroy()};o==null||o.addEventListener("abort",Z,{once:!0}),j=(async()=>{var oe;try{E("image");
let z=A.image;if(!le(z)){E("foreground");const U=new T.Tensor("float32",s(z),[1,3,ae,ae]);let O;try{O=await L("foregroun\
d separation",()=>C.run({"input.1":U})),S(o);const q=O[1959];if((q==null?void 0:q.type)!=="float32"||q.dims.join()!=="1,\
1,320,320")throw new Error("Unexpected SF3D foreground mask");z=i(z,q.data),n.foregroundRequests++}finally{U.dispose(),ue(
O)}}S(o),P(),_.begin();const M=await _.owned(()=>L("generation",()=>R.run(z,{signal:o,runId:`peercompute-sf3d-${n.generatedRequests+
1}`,routeOverrides:{tetData:Q,async retirePhase(U,O){await w.queue.onSubmittedWorkDone(),S(o),P(),_.retire({pipelines:R.
pipelines,weights:B,shaders:G()},{keep:O,phase:U,finish:!1})}},onProgress(U){S(o),P(),n.lastStage=String(U).slice(0,300),
E(n.lastStage)}})));if(S(o),n.gpuDispatches<=v)throw new Error("SF3D execution did not dispatch work on the admitted GPU");
n.lastUnvalidatedMesh={vertexCount:M.uvNumVertices??M.numVertices,triangleCount:M.uvNumFaces??M.numFaces,byteLength:(oe=
M.glb)==null?void 0:oe.byteLength};const H=l({data:new Uint8Array(M.glb)});return S(o),n.generatedRequests++,n.lastMesh=
{vertexCount:H.vertexCount,triangleCount:H.triangleCount,byteLength:H.byteLength},n.lastRoute={sourceCommit:J,totalMs:M.
totalMs,offloads:M.offloads,stageTimings:M.stageTimings},E("done"),{text:"",mesh:H,gpuDispatches:n.gpuDispatches-v,gpuSubmissions:n.
gpuSubmissions-F}}catch(z){throw k(z),w.destroy(),o!=null&&o.aborted?ne(o.reason):z}finally{o==null||o.removeEventListener(
"abort",Z),_.retire({pipelines:R==null?void 0:R.pipelines,weights:B,shaders:G()}),X=!1}})();try{return await j}finally{j=
null}}return{get lost(){return $},getEvidence:()=>structuredClone(n),generate:ce,dispose:ee}}const Be=pe({createEngine:_e,
validateManifest:ye,normalizeInput:we}),Ie=Object.freeze(Object.defineProperty({__proto__:null,handleModelTask:Be},Symbol.
toStringTag,{value:"Module"}));export{ke as c,Ie as s};
