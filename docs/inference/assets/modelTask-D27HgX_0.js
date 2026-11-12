import{_ as N}from"./index-DIF_mDpI.js";import{aT as V,aU as T,aw as F,au as $,aV as J,as as K,aW as Q}from"./main-SUOvd34O.js";
async function X({getDevice:m,capture:b,operation:P,fail:w}){let u,s,c;const o=[],k=e=>{if(u!==e){if(u)throw new Error("\
Speech runtime changed GPU device");u=e;for(const n of["validation","out-of-memory","internal"])u.pushErrorScope(n),o.push(
n)}};try{if(m()&&k(m()),b?.(k),s=await P(),!u)throw new Error("Speech runtime did not create a WebGPU device");await u.queue.
onSubmittedWorkDone()}catch(e){c=e}finally{b?.(null)}const i=await Promise.all(o.reverse().map(async e=>{try{return{filter:e,
error:await u.popErrorScope()}}catch(n){return{filter:e,error:n}}})),l=["out-of-memory","internal","validation"].map(e=>i.
find(n=>n.filter===e&&n.error)).find(Boolean);if(l){const e=new Error(l.filter==="out-of-memory"?"Model session lost: sp\
eech GPU out of memory. Unload other models or close GPU-heavy apps, then retry.":`Model session lost: speech GPU ${l.filter}\
: ${l.error.message}`,{cause:l.error});throw w(e),e}if(c)throw c;return s}async function Y({manifest:m,sessionId:b,artifactPort:P,
runtimeAssets:w,signal:u,onProgress:s,baseUrl:c=globalThis.location?.href,gpu:o=globalThis.navigator?.gpu,loadLibrary:k=()=>N(
()=>import("./transformers.web-CPpHPsUx.js"),[],import.meta.url)}){let i,l,e,n,M,W,A=u,G=!1,U=!1;const p={
gpuDispatches:0,gpuSubmissions:0,generatedRequests:0},q=r=>{U=!0,p.gpuFailure??=String(r?.message??r).slice(0,300)},y=()=>{
if(F(A),U)throw new Error(`Model session lost: ${p.gpuFailure??"speech GPU lost"}`)},D=r=>q(r.error),R=r=>X({getDevice:()=>i,
capture:g=>{M=g},operation:r,fail:q});async function L(){n?.(),n=null,e?.close(),e=null;try{await l?.dispose(),l=null}finally{
i?.removeEventListener("uncapturederror",D),i?.destroy(),G=!0}}try{const r=await o?.requestAdapter({powerPreference:"hig\
h-performance"});if(y(),!r||r.isFallbackAdapter||r.info?.isFallbackAdapter)throw new Error("Speech requires hardware Web\
GPU; CPU fallback is disabled");p.adapter={vendor:r.info?.vendor??"",architecture:r.info?.architecture??"",isFallbackAdapter:!1};
const g=await k();if(y(),g.env.version!=="4.3.2")throw new Error("Unexpected speech runtime version");const S=new URL("/\
__peercompute_speech/",c);e=V(P,{manifest:m,baseUrl:new URL(`${b}/`,S).href,signal:u});const{env:a}=g;a.logLevel=50,a.allowLocalModels=
!0,a.allowRemoteModels=!1,a.useBrowserCache=!1,a.useFSCache=!1,a.useWasmCache=!1,a.localModelPath=S.pathname,a.fetch=e.fetch,
a.backends.onnx.wasm.proxy=!1,a.backends.onnx.wasm.numThreads=1,a.backends.onnx.wasm.wasmPaths=w,a.backends.onnx.webgpu.
adapter=r;const _=Object.getPrototypeOf(r),h=_.requestDevice;if(_.requestDevice=async function(...d){if(this.isFallbackAdapter||
this.info?.isFallbackAdapter)throw new Error("Speech cannot use a software GPU adapter");const t=await h.apply(this,d);i=
t,M?.(t),p.runtimeFeatures=[...t.features],t.addEventListener("uncapturederror",D),t.lost.then(()=>{G||q(new Error("Spee\
ch GPU device lost"))});const E=t.createCommandEncoder.bind(t),I=t.queue.submit.bind(t.queue);return t.createCommandEncoder=
(...v)=>{const f=E(...v),x=f.beginComputePass.bind(f);return f.beginComputePass=(...z)=>{const C=x(...z);for(const O of[
"dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const B=C[O].bind(C);C[O]=(...j)=>{const H=B(...j);return p.gpuDispatches++,
H}}return C},f},t.queue.submit=(...v)=>{const f=I(...v);return p.gpuSubmissions++,f},t},n=()=>{_.requestDevice=h},await R(
async()=>{l=await g.pipeline(m.model.task,b,{local_files_only:!0,device:"webgpu",dtype:"fp32",session_options:{executionProviders:[
"webgpu"]},progress_callback:d=>s?.({type:"speech-load",status:d.status,file:d.file,loaded:d.loaded,total:d.total})})}),
n(),n=null,y(),await a.backends.onnx.webgpu.device!==i)throw new Error("Speech did not acquire its admitted WebGPU devic\
e");if(m.model.voice){const d=await e.fetch(new URL(`${b}/${m.model.voice}`,S).href);W=new Float32Array(await d.arrayBuffer()),
y()}for(const[d,t]of Object.entries(l.model.sessions)){const E=t.run.bind(t);t.run=async(...I)=>{y();const v=await E(...I);
try{if(y(),d==="text_encoder"&&v.durations){for(const f of v.durations.data)if(!Number.isFinite(f)||f<=0||f>T.maxOutputSeconds)
throw new Error("Predicted speech exceeds its duration budget")}return v}catch(f){for(const x of Object.values(v))x.dispose?.();
throw f}}}e.close(),e=null,A=void 0}catch(r){try{await L()}catch(g){throw new AggregateError([r,g],"Model session lost: \
speech load cleanup failed")}throw r}return{evidence:p,get lost(){return U},dispose:L,async generate(r,{signal:g,onProgress:S}={}){
if(G||U)throw new Error("Model session lost: speech is unavailable");A=g,y();const a=p.gpuDispatches,_=p.gpuSubmissions;
try{S?.({type:"speech-stage",stage:r.audio?"transcribing":"speaking"});const h=await R(()=>r.audio?l(r.audio.samples,{max_new_tokens:Math.
min(128,Math.max(8,Math.ceil(r.audio.samples.length/16e3)*6)),do_sample:!1}):l(r.prompt,{speaker_embeddings:W,num_inference_steps:5,
speed:1.05}));if(y(),p.gpuDispatches<=a)throw new Error("Model session lost: speech performed no WebGPU dispatches");let d;
if(r.audio){if(typeof h.text!="string"||new TextEncoder().encode(h.text).length>T.maxTranscriptBytes)throw new Error("In\
valid speech transcript");d={text:h.text.trim()}}else{const t=h.audio,E=h.sampling_rate;if(!(t instanceof Float32Array)||
E!==m.model.sampleRate||!t.length||t.length>E*T.maxOutputSeconds)throw new Error("Invalid synthesized audio duration");for(const I of t)
if(!Number.isFinite(I)||Math.abs(I)>10)throw new Error("Invalid synthesized PCM");d={audio:new Float32Array(t),sampleRate:E}}
return p.generatedRequests++,{...d,gpuDispatches:p.gpuDispatches-a,gpuSubmissions:p.gpuSubmissions-_}}catch(h){throw h instanceof
WebAssembly.RuntimeError?(q(h),new Error("Model session lost: speech native runtime failed",{cause:h})):h}finally{A=void 0}}}}
function Z({createEngine:m=Y,assertWorker:b=()=>{if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))
throw new Error("Speech requires a ComputeManager-owned worker")},baseUrl:P=globalThis.location?.href}={}){const w=new Map,
u=s=>({sessionId:s.sessionId,manifestCid:s.manifestCid,workerId:s.workerId,status:s.engine?.lost?"lost":s.status,...s.engine?.
evidence});return async(s,c={})=>{if(b(),$(s?.sessionId),F(c.signal),s.command==="load"){if(w.size)throw new Error("A sp\
eech model is already resident");const{manifest:i}=J(s.manifest),l=K(s.runtimeAssets,P),e={sessionId:s.sessionId,manifestCid:s.
manifestCid,manifest:i,workerId:c.workerId,status:"loading"};w.set(e.sessionId,e);try{return e.engine=await m({manifest:i,
runtimeAssets:l,sessionId:e.sessionId,artifactPort:s.artifactPort,signal:c.signal,onProgress:c.emitProgress,baseUrl:P}),
F(c.signal),e.status="ready",u(e)}catch(n){try{await e.engine?.dispose(),w.delete(e.sessionId)}catch(M){throw e.status="\
lost",new AggregateError([n,M],"Model session lost: speech cleanup failed")}throw n}}const o=w.get(s.sessionId);if(!o)throw new Error(
"Speech model is not loaded");if(s.command==="status")return u(o);if(s.command==="unload")return await o.engine.dispose(),
w.delete(o.sessionId),{status:"unloaded",sessionId:o.sessionId};if(s.command!=="generate")throw new Error("Unknown speec\
h command");if($(s.requestId),o.status!=="ready"||o.engine.lost)throw new Error("Model session lost: speech is not ready");
const k=Q(s,o.manifest);o.status="generating";try{const i=await o.engine.generate(k,{signal:c.signal,onProgress:c.emitProgress});
return F(c.signal),{...i,sessionId:o.sessionId,requestId:s.requestId,workerId:o.workerId}}catch(i){throw/Model session lost/.
test(i.message)&&(o.status="lost"),i}finally{o.status!=="lost"&&(o.status=o.engine.lost?"lost":"ready")}}}const re=Z();export{Z as createSpeechTaskHandler,re as handleModelTask};
