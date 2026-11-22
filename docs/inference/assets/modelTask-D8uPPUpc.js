import{_ as N}from"./index-B92owSMB.js";import{bD as V,bn as J,bE as D,be as F,bc as O,bF as K,b9 as Q,bG as X}from"./main-GpxLetDh.js";
async function Y({getDevice:m,capture:b,operation:P,fail:w}){let p,s,l;const o=[],k=e=>{if(p!==e){if(p)throw new Error("\
Speech runtime changed GPU device");p=e;for(const n of["validation","out-of-memory","internal"])p.pushErrorScope(n),o.push(
n)}};try{if(m()&&k(m()),b?.(k),s=await P(),!p)throw new Error("Speech runtime did not create a WebGPU device");await p.queue.
onSubmittedWorkDone()}catch(e){l=e}finally{b?.(null)}const i=await Promise.all(o.reverse().map(async e=>{try{return{filter:e,
error:await p.popErrorScope()}}catch(n){return{filter:e,error:n}}})),d=["out-of-memory","internal","validation"].map(e=>i.
find(n=>n.filter===e&&n.error)).find(Boolean);if(d){const e=new Error(d.filter==="out-of-memory"?"Model session lost: sp\
eech GPU out of memory. Unload other models or close GPU-heavy apps, then retry.":`Model session lost: speech GPU ${d.filter}\
: ${d.error.message}`,{cause:d.error});throw w(e),e}if(l)throw l;return s}async function Z({manifest:m,sessionId:b,artifactPort:P,
runtimeAssets:w,signal:p,onProgress:s,baseUrl:l=globalThis.location?.href,gpu:o=globalThis.navigator?.gpu,loadLibrary:k=()=>N(
()=>import("./transformers.web-CPpHPsUx.js"),[],import.meta.url)}){let i,d,e,n,_,R,q=p,C=!1,A=!1;const c={
gpuDispatches:0,gpuSubmissions:0,generatedRequests:0},G=r=>{A=!0,c.gpuFailure??=String(r?.message??r).slice(0,300)},y=()=>{
if(F(q),A)throw new Error(`Model session lost: ${c.gpuFailure??"speech GPU lost"}`)},T=r=>G(r.error),W=r=>Y({getDevice:()=>i,
capture:g=>{_=g},operation:r,fail:G});async function L(){n?.(),n=null,e?.close(),e=null;try{await d?.dispose(),d=null}finally{
i?.removeEventListener("uncapturederror",T),i?.destroy(),C=!0}}try{const r=await o?.requestAdapter({powerPreference:"hig\
h-performance"});if(y(),!r||r.isFallbackAdapter||r.info?.isFallbackAdapter)throw new Error("Speech requires hardware Web\
GPU; CPU fallback is disabled");c.adapter={vendor:r.info?.vendor??"",architecture:r.info?.architecture??"",isFallbackAdapter:!1};
const g=await k();if(y(),g.env.version!=="4.3.2")throw new Error("Unexpected speech runtime version");const S=new URL("/\
__peercompute_speech/",l);e=V(P,{manifest:m,baseUrl:new URL(`${b}/`,S).href,signal:p});const{env:a}=g;a.logLevel=50,a.allowLocalModels=
!0,a.allowRemoteModels=!1,a.useBrowserCache=!1,a.useFSCache=!1,a.useWasmCache=!1,a.localModelPath=S.pathname,a.fetch=e.fetch,
a.backends.onnx.wasm.proxy=!1,a.backends.onnx.wasm.numThreads=1,a.backends.onnx.wasm.wasmPaths=w,a.backends.onnx.webgpu.
adapter=r;const M=Object.getPrototypeOf(r),h=M.requestDevice;if(M.requestDevice=async function(...u){if(this.isFallbackAdapter||
this.info?.isFallbackAdapter)throw new Error("Speech cannot use a software GPU adapter");const t=await h.apply(this,u);i=
t,_?.(t),J(t,c),c.runtimeFeatures=[...t.features],t.addEventListener("uncapturederror",T),t.lost.then(()=>{C||G(new Error(
"Speech GPU device lost"))});const E=t.createCommandEncoder.bind(t),I=t.queue.submit.bind(t.queue);return t.createCommandEncoder=
(...v)=>{const f=E(...v),x=f.beginComputePass.bind(f);return f.beginComputePass=(...$)=>{const U=x(...$);for(const B of[
"dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const z=U[B].bind(U);U[B]=(...j)=>{const H=z(...j);return c.gpuDispatches++,
H}}return U},f},t.queue.submit=(...v)=>{const f=I(...v);return c.gpuSubmissions++,f},t},n=()=>{M.requestDevice=h},await W(
async()=>{d=await g.pipeline(m.model.task,b,{local_files_only:!0,device:"webgpu",dtype:"fp32",session_options:{executionProviders:[
"webgpu"]},progress_callback:u=>s?.({type:"speech-load",status:u.status,file:u.file,loaded:u.loaded,total:u.total})})}),
n(),n=null,y(),await a.backends.onnx.webgpu.device!==i)throw new Error("Speech did not acquire its admitted WebGPU devic\
e");if(m.model.voice){const u=await e.fetch(new URL(`${b}/${m.model.voice}`,S).href);R=new Float32Array(await u.arrayBuffer()),
y()}for(const[u,t]of Object.entries(d.model.sessions)){const E=t.run.bind(t);t.run=async(...I)=>{y();const v=await E(...I);
try{if(y(),u==="text_encoder"&&v.durations){for(const f of v.durations.data)if(!Number.isFinite(f)||f<=0||f>D.maxOutputSeconds)
throw new Error("Predicted speech exceeds its duration budget")}return v}catch(f){for(const x of Object.values(v))x.dispose?.();
throw f}}}e.close(),e=null,q=void 0}catch(r){try{await L()}catch(g){throw new AggregateError([r,g],"Model session lost: \
speech load cleanup failed")}throw r}return{evidence:c,get lost(){return A},dispose:L,async generate(r,{signal:g,onProgress:S}={}){
if(C||A)throw new Error("Model session lost: speech is unavailable");q=g,y();const a=c.gpuDispatches,M=c.gpuSubmissions;
try{S?.({type:"speech-stage",stage:r.audio?"transcribing":"speaking"});const h=await W(()=>r.audio?d(r.audio.samples,{max_new_tokens:Math.
min(128,Math.max(8,Math.ceil(r.audio.samples.length/16e3)*6)),do_sample:!1}):d(r.prompt,{speaker_embeddings:R,num_inference_steps:5,
speed:1.05}));if(y(),c.gpuDispatches<=a)throw new Error("Model session lost: speech performed no WebGPU dispatches");let u;
if(r.audio){if(typeof h.text!="string"||new TextEncoder().encode(h.text).length>D.maxTranscriptBytes)throw new Error("In\
valid speech transcript");u={text:h.text.trim()}}else{const t=h.audio,E=h.sampling_rate;if(!(t instanceof Float32Array)||
E!==m.model.sampleRate||!t.length||t.length>E*D.maxOutputSeconds)throw new Error("Invalid synthesized audio duration");for(const I of t)
if(!Number.isFinite(I)||Math.abs(I)>10)throw new Error("Invalid synthesized PCM");u={audio:new Float32Array(t),sampleRate:E}}
return c.generatedRequests++,{...u,requestedGpuBufferPeakBytes:c.requestedGpuBufferPeakBytes,gpuDispatches:c.gpuDispatches-
a,gpuSubmissions:c.gpuSubmissions-M}}catch(h){throw h instanceof WebAssembly.RuntimeError?(G(h),new Error("Model session\
 lost: speech native runtime failed",{cause:h})):h}finally{q=void 0}}}}function ee({createEngine:m=Z,assertWorker:b=()=>{
if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("Speech requires a ComputeMa\
nager-owned worker")},baseUrl:P=globalThis.location?.href}={}){const w=new Map,p=s=>({sessionId:s.sessionId,manifestCid:s.
manifestCid,workerId:s.workerId,status:s.engine?.lost?"lost":s.status,...s.engine?.evidence});return async(s,l={})=>{if(b(),
O(s?.sessionId),F(l.signal),s.command==="load"){if(w.size)throw new Error("A speech model is already resident");const{manifest:i}=K(
s.manifest),d=Q(s.runtimeAssets,P),e={sessionId:s.sessionId,manifestCid:s.manifestCid,manifest:i,workerId:l.workerId,status:"\
loading"};w.set(e.sessionId,e);try{return e.engine=await m({manifest:i,runtimeAssets:d,sessionId:e.sessionId,artifactPort:s.
artifactPort,signal:l.signal,onProgress:l.emitProgress,baseUrl:P}),F(l.signal),e.status="ready",p(e)}catch(n){try{await e.
engine?.dispose(),w.delete(e.sessionId)}catch(_){throw e.status="lost",new AggregateError([n,_],"Model session lost: spe\
ech cleanup failed")}throw n}}const o=w.get(s.sessionId);if(!o)throw new Error("Speech model is not loaded");if(s.command===
"status")return p(o);if(s.command==="unload")return await o.engine.dispose(),w.delete(o.sessionId),{status:"unloaded",sessionId:o.
sessionId};if(s.command!=="generate")throw new Error("Unknown speech command");if(O(s.requestId),o.status!=="ready"||o.engine.
lost)throw new Error("Model session lost: speech is not ready");const k=X(s,o.manifest);o.status="generating";try{const i=await o.
engine.generate(k,{signal:l.signal,onProgress:l.emitProgress});return F(l.signal),{...i,sessionId:o.sessionId,requestId:s.
requestId,workerId:o.workerId}}catch(i){throw/Model session lost/.test(i.message)&&(o.status="lost"),i}finally{o.status!==
"lost"&&(o.status=o.engine.lost?"lost":"ready")}}}const te=ee();export{ee as createSpeechTaskHandler,te as handleModelTask};
