import{d as Y,o as Z,t as W,a as J,e as ee}from"./ArtifactReadBridge-DPSL9Th9.js";import{S as T,a as se,n as re}from"./runtimeDefinition-DBSAjdyr.js";
import"./ArtifactManifest-xN3IgLFu.js";async function te({getDevice:m,capture:h,operation:I,fail:G}){let c,b,s;const a=[],
t=e=>{if(c!==e){if(c)throw new Error("Speech runtime changed GPU device");c=e;for(const i of["validation","out-of-memory",
"internal"])c.pushErrorScope(i),a.push(i)}};try{if(m()&&t(m()),h==null||h(t),b=await I(),!c)throw new Error("Speech runt\
ime did not create a WebGPU device");await c.queue.onSubmittedWorkDone()}catch(e){s=e}finally{h==null||h(null)}const U=await Promise.
all(a.reverse().map(async e=>{try{return{filter:e,error:await c.popErrorScope()}}catch(i){return{filter:e,error:i}}})),w=[
"out-of-memory","internal","validation"].map(e=>U.find(i=>i.filter===e&&i.error)).find(Boolean);if(w){const e=new Error(
w.filter==="out-of-memory"?"Model session lost: speech GPU out of memory. Unload other models or close GPU-heavy apps, t\
hen retry.":`Model session lost: speech GPU ${w.filter}: ${w.error.message}`,{cause:w.error});throw G(e),e}if(s)throw s;
return b}async function oe({manifest:m,sessionId:h,artifactPort:I,runtimeAssets:G,signal:c,onProgress:b,baseUrl:s=(U=>(U=
globalThis.location)==null?void 0:U.href)(),gpu:a=(w=>(w=globalThis.navigator)==null?void 0:w.gpu)(),loadLibrary:t=()=>import("./transformers.web-Bm4U2WqP.js")}){
var z,j,H;let e,i,n,g,P,B,C=c,D=!1,F=!1;const l={gpuDispatches:0,gpuSubmissions:0,generatedRequests:0},x=r=>{F=!0,l.gpuFailure??
(l.gpuFailure=String((r==null?void 0:r.message)??r).slice(0,300))},E=()=>{if(W(C),F)throw new Error(`Model session lost:\
 ${l.gpuFailure??"speech GPU lost"}`)},L=r=>x(r.error),O=r=>te({getDevice:()=>e,capture:y=>{P=y},operation:r,fail:x});async function $(){
g==null||g(),g=null,n==null||n.close(),n=null;try{await(i==null?void 0:i.dispose()),i=null}finally{e==null||e.removeEventListener(
"uncapturederror",L),e==null||e.destroy(),D=!0}}try{const r=await(a==null?void 0:a.requestAdapter({powerPreference:"high\
-performance"}));if(E(),!r||r.isFallbackAdapter||(z=r.info)!=null&&z.isFallbackAdapter)throw new Error("Speech requires \
hardware WebGPU; CPU fallback is disabled");l.adapter={vendor:((j=r.info)==null?void 0:j.vendor)??"",architecture:((H=r.
info)==null?void 0:H.architecture)??"",isFallbackAdapter:!1};const y=await t();if(E(),y.env.version!=="4.3.2")throw new Error(
"Unexpected speech runtime version");const v=new URL("/__peercompute_speech/",s);n=Y(I,{manifest:m,baseUrl:new URL(`${h}\
/`,v).href,signal:c});const{env:d}=y;d.logLevel=50,d.allowLocalModels=!0,d.allowRemoteModels=!1,d.useBrowserCache=!1,d.useFSCache=
!1,d.useWasmCache=!1,d.localModelPath=v.pathname,d.fetch=n.fetch,d.backends.onnx.wasm.proxy=!1,d.backends.onnx.wasm.numThreads=
1,d.backends.onnx.wasm.wasmPaths=G,d.backends.onnx.webgpu.adapter=r;const A=Object.getPrototypeOf(r),p=A.requestDevice;if(A.
requestDevice=async function(...u){var S;if(this.isFallbackAdapter||(S=this.info)!=null&&S.isFallbackAdapter)throw new Error(
"Speech cannot use a software GPU adapter");const o=await p.apply(this,u);e=o,P==null||P(o),Z(o,l),l.runtimeFeatures=[...o.
features],o.addEventListener("uncapturederror",L),o.lost.then(()=>{D||x(new Error("Speech GPU device lost"))});const k=o.
createCommandEncoder.bind(o),M=o.queue.submit.bind(o.queue);return o.createCommandEncoder=(...q)=>{const f=k(...q),_=f.beginComputePass.
bind(f);return f.beginComputePass=(...K)=>{const R=_(...K);for(const N of["dispatchWorkgroups","dispatchWorkgroupsIndire\
ct"]){const Q=R[N].bind(R);R[N]=(...V)=>{const X=Q(...V);return l.gpuDispatches++,X}}return R},f},o.queue.submit=(...q)=>{
const f=M(...q);return l.gpuSubmissions++,f},o},g=()=>{A.requestDevice=p},await O(async()=>{i=await y.pipeline(m.model.task,
h,{local_files_only:!0,device:"webgpu",dtype:"fp32",session_options:{executionProviders:["webgpu"]},progress_callback:u=>b==
null?void 0:b({type:"speech-load",status:u.status,file:u.file,loaded:u.loaded,total:u.total})})}),g(),g=null,E(),await d.
backends.onnx.webgpu.device!==e)throw new Error("Speech did not acquire its admitted WebGPU device");if(m.model.voice){const u=await n.
fetch(new URL(`${h}/${m.model.voice}`,v).href);B=new Float32Array(await u.arrayBuffer()),E()}for(const[u,o]of Object.entries(
i.model.sessions)){const k=o.run.bind(o);o.run=async(...M)=>{var q;E();const S=await k(...M);try{if(E(),u==="text_encode\
r"&&S.durations){for(const f of S.durations.data)if(!Number.isFinite(f)||f<=0||f>T.maxOutputSeconds)throw new Error("Pre\
dicted speech exceeds its duration budget")}return S}catch(f){for(const _ of Object.values(S))(q=_.dispose)==null||q.call(
_);throw f}}}n.close(),n=null,C=void 0}catch(r){try{await $()}catch(y){throw new AggregateError([r,y],"Model session los\
t: speech load cleanup failed")}throw r}return{evidence:l,get lost(){return F},dispose:$,async generate(r,{signal:y,onProgress:v}={}){
if(D||F)throw new Error("Model session lost: speech is unavailable");C=y,E();const d=l.gpuDispatches,A=l.gpuSubmissions;
try{v==null||v({type:"speech-stage",stage:r.audio?"transcribing":"speaking"});const p=await O(()=>r.audio?i(r.audio.samples,
{max_new_tokens:Math.min(128,Math.max(8,Math.ceil(r.audio.samples.length/16e3)*6)),do_sample:!1}):i(r.prompt,{speaker_embeddings:B,
num_inference_steps:5,speed:1.05}));if(E(),l.gpuDispatches<=d)throw new Error("Model session lost: speech performed no W\
ebGPU dispatches");let u;if(r.audio){if(typeof p.text!="string"||new TextEncoder().encode(p.text).length>T.maxTranscriptBytes)
throw new Error("Invalid speech transcript");u={text:p.text.trim()}}else{const o=p.audio,k=p.sampling_rate;if(!(o instanceof
Float32Array)||k!==m.model.sampleRate||!o.length||o.length>k*T.maxOutputSeconds)throw new Error("Invalid synthesized aud\
io duration");for(const M of o)if(!Number.isFinite(M)||Math.abs(M)>10)throw new Error("Invalid synthesized PCM");u={audio:new Float32Array(
o),sampleRate:k}}return l.generatedRequests++,{...u,requestedGpuBufferPeakBytes:l.requestedGpuBufferPeakBytes,gpuDispatches:l.
gpuDispatches-d,gpuSubmissions:l.gpuSubmissions-A}}catch(p){throw p instanceof WebAssembly.RuntimeError?(x(p),new Error(
"Model session lost: speech native runtime failed",{cause:p})):p}finally{C=void 0}}}}function ne({createEngine:m=oe,assertWorker:h=()=>{
if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("Speech requires a ComputeMa\
nager-owned worker")},baseUrl:I=(G=>(G=globalThis.location)==null?void 0:G.href)()}={}){const c=new Map,b=s=>{var a,t;return{
sessionId:s.sessionId,manifestCid:s.manifestCid,workerId:s.workerId,status:(a=s.engine)!=null&&a.lost?"lost":s.status,...(t=
s.engine)==null?void 0:t.evidence}};return async(s,a={})=>{var w;if(h(),J(s==null?void 0:s.sessionId),W(a.signal),s.command===
"load"){if(c.size)throw new Error("A speech model is already resident");const{manifest:e}=se(s.manifest),i=ee(s.runtimeAssets,
I),n={sessionId:s.sessionId,manifestCid:s.manifestCid,manifest:e,workerId:a.workerId,status:"loading"};c.set(n.sessionId,
n);try{return n.engine=await m({manifest:e,runtimeAssets:i,sessionId:n.sessionId,artifactPort:s.artifactPort,signal:a.signal,
onProgress:a.emitProgress,baseUrl:I}),W(a.signal),n.status="ready",b(n)}catch(g){try{await((w=n.engine)==null?void 0:w.dispose()),
c.delete(n.sessionId)}catch(P){throw n.status="lost",new AggregateError([g,P],"Model session lost: speech cleanup failed")}
throw g}}const t=c.get(s.sessionId);if(!t)throw new Error("Speech model is not loaded");if(s.command==="status")return b(
t);if(s.command==="unload")return await t.engine.dispose(),c.delete(t.sessionId),{status:"unloaded",sessionId:t.sessionId};
if(s.command!=="generate")throw new Error("Unknown speech command");if(J(s.requestId),t.status!=="ready"||t.engine.lost)
throw new Error("Model session lost: speech is not ready");const U=re(s,t.manifest);t.status="generating";try{const e=await t.
engine.generate(U,{signal:a.signal,onProgress:a.emitProgress});return W(a.signal),{...e,sessionId:t.sessionId,requestId:s.
requestId,workerId:t.workerId}}catch(e){throw/Model session lost/.test(e.message)&&(t.status="lost"),e}finally{t.status!==
"lost"&&(t.status=t.engine.lost?"lost":"ready")}}}const ce=ne();export{ne as createSpeechTaskHandler,ce as handleModelTask};
