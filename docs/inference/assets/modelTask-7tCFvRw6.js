import{d as N,t as F,a as $,e as J}from"./ArtifactReadBridge-Bns2fboi.js";import{S as W,a as K,n as Q}from"./runtimeDefinition-BbETJy7k.js";
import"./ArtifactManifest-DPFdnZW5.js";async function V({getDevice:m,capture:b,operation:k,fail:w}){let u,s,c;const o=[],
S=e=>{if(u!==e){if(u)throw new Error("Speech runtime changed GPU device");u=e;for(const n of["validation","out-of-memory",
"internal"])u.pushErrorScope(n),o.push(n)}};try{if(m()&&S(m()),b?.(S),s=await k(),!u)throw new Error("Speech runtime did\
 not create a WebGPU device");await u.queue.onSubmittedWorkDone()}catch(e){c=e}finally{b?.(null)}const i=await Promise.all(
o.reverse().map(async e=>{try{return{filter:e,error:await u.popErrorScope()}}catch(n){return{filter:e,error:n}}})),l=["o\
ut-of-memory","internal","validation"].map(e=>i.find(n=>n.filter===e&&n.error)).find(Boolean);if(l){const e=new Error(l.
filter==="out-of-memory"?"Model session lost: speech GPU out of memory. Unload other models or close GPU-heavy apps, the\
n retry.":`Model session lost: speech GPU ${l.filter}: ${l.error.message}`,{cause:l.error});throw w(e),e}if(c)throw c;return s}
async function X({manifest:m,sessionId:b,artifactPort:k,runtimeAssets:w,signal:u,onProgress:s,baseUrl:c=globalThis.location?.
href,gpu:o=globalThis.navigator?.gpu,loadLibrary:S=()=>import("./transformers.web-CsR9rRO0.js")}){let i,l,e,n,A,D,U=u,G=!1,
q=!1;const p={gpuDispatches:0,gpuSubmissions:0,generatedRequests:0},_=r=>{q=!0,p.gpuFailure??=String(r?.message??r).slice(
0,300)},y=()=>{if(F(U),q)throw new Error(`Model session lost: ${p.gpuFailure??"speech GPU lost"}`)},R=r=>_(r.error),T=r=>V(
{getDevice:()=>i,capture:g=>{A=g},operation:r,fail:_});async function L(){n?.(),n=null,e?.close(),e=null;try{await l?.dispose(),
l=null}finally{i?.removeEventListener("uncapturederror",R),i?.destroy(),G=!0}}try{const r=await o?.requestAdapter({powerPreference:"\
high-performance"});if(y(),!r||r.isFallbackAdapter||r.info?.isFallbackAdapter)throw new Error("Speech requires hardware \
WebGPU; CPU fallback is disabled");p.adapter={vendor:r.info?.vendor??"",architecture:r.info?.architecture??"",isFallbackAdapter:!1};
const g=await S();if(y(),g.env.version!=="4.3.2")throw new Error("Unexpected speech runtime version");const P=new URL("/\
__peercompute_speech/",c);e=N(k,{manifest:m,baseUrl:new URL(`${b}/`,P).href,signal:u});const{env:a}=g;a.logLevel=50,a.allowLocalModels=
!0,a.allowRemoteModels=!1,a.useBrowserCache=!1,a.useFSCache=!1,a.useWasmCache=!1,a.localModelPath=P.pathname,a.fetch=e.fetch,
a.backends.onnx.wasm.proxy=!1,a.backends.onnx.wasm.numThreads=1,a.backends.onnx.wasm.wasmPaths=w,a.backends.onnx.webgpu.
adapter=r;const M=Object.getPrototypeOf(r),h=M.requestDevice;if(M.requestDevice=async function(...d){if(this.isFallbackAdapter||
this.info?.isFallbackAdapter)throw new Error("Speech cannot use a software GPU adapter");const t=await h.apply(this,d);i=
t,A?.(t),p.runtimeFeatures=[...t.features],t.addEventListener("uncapturederror",R),t.lost.then(()=>{G||_(new Error("Spee\
ch GPU device lost"))});const E=t.createCommandEncoder.bind(t),I=t.queue.submit.bind(t.queue);return t.createCommandEncoder=
(...v)=>{const f=E(...v),x=f.beginComputePass.bind(f);return f.beginComputePass=(...z)=>{const C=x(...z);for(const O of[
"dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const B=C[O].bind(C);C[O]=(...j)=>{const H=B(...j);return p.gpuDispatches++,
H}}return C},f},t.queue.submit=(...v)=>{const f=I(...v);return p.gpuSubmissions++,f},t},n=()=>{M.requestDevice=h},await T(
async()=>{l=await g.pipeline(m.model.task,b,{local_files_only:!0,device:"webgpu",dtype:"fp32",session_options:{executionProviders:[
"webgpu"]},progress_callback:d=>s?.({type:"speech-load",status:d.status,file:d.file,loaded:d.loaded,total:d.total})})}),
n(),n=null,y(),await a.backends.onnx.webgpu.device!==i)throw new Error("Speech did not acquire its admitted WebGPU devic\
e");if(m.model.voice){const d=await e.fetch(new URL(`${b}/${m.model.voice}`,P).href);D=new Float32Array(await d.arrayBuffer()),
y()}for(const[d,t]of Object.entries(l.model.sessions)){const E=t.run.bind(t);t.run=async(...I)=>{y();const v=await E(...I);
try{if(y(),d==="text_encoder"&&v.durations){for(const f of v.durations.data)if(!Number.isFinite(f)||f<=0||f>W.maxOutputSeconds)
throw new Error("Predicted speech exceeds its duration budget")}return v}catch(f){for(const x of Object.values(v))x.dispose?.();
throw f}}}e.close(),e=null,U=void 0}catch(r){try{await L()}catch(g){throw new AggregateError([r,g],"Model session lost: \
speech load cleanup failed")}throw r}return{evidence:p,get lost(){return q},dispose:L,async generate(r,{signal:g,onProgress:P}={}){
if(G||q)throw new Error("Model session lost: speech is unavailable");U=g,y();const a=p.gpuDispatches,M=p.gpuSubmissions;
try{P?.({type:"speech-stage",stage:r.audio?"transcribing":"speaking"});const h=await T(()=>r.audio?l(r.audio.samples,{max_new_tokens:Math.
min(128,Math.max(8,Math.ceil(r.audio.samples.length/16e3)*6)),do_sample:!1}):l(r.prompt,{speaker_embeddings:D,num_inference_steps:5,
speed:1.05}));if(y(),p.gpuDispatches<=a)throw new Error("Model session lost: speech performed no WebGPU dispatches");let d;
if(r.audio){if(typeof h.text!="string"||new TextEncoder().encode(h.text).length>W.maxTranscriptBytes)throw new Error("In\
valid speech transcript");d={text:h.text.trim()}}else{const t=h.audio,E=h.sampling_rate;if(!(t instanceof Float32Array)||
E!==m.model.sampleRate||!t.length||t.length>E*W.maxOutputSeconds)throw new Error("Invalid synthesized audio duration");for(const I of t)
if(!Number.isFinite(I)||Math.abs(I)>10)throw new Error("Invalid synthesized PCM");d={audio:new Float32Array(t),sampleRate:E}}
return p.generatedRequests++,{...d,gpuDispatches:p.gpuDispatches-a,gpuSubmissions:p.gpuSubmissions-M}}catch(h){throw h instanceof
WebAssembly.RuntimeError?(_(h),new Error("Model session lost: speech native runtime failed",{cause:h})):h}finally{U=void 0}}}}
function Y({createEngine:m=X,assertWorker:b=()=>{if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))
throw new Error("Speech requires a ComputeManager-owned worker")},baseUrl:k=globalThis.location?.href}={}){const w=new Map,
u=s=>({sessionId:s.sessionId,manifestCid:s.manifestCid,workerId:s.workerId,status:s.engine?.lost?"lost":s.status,...s.engine?.
evidence});return async(s,c={})=>{if(b(),$(s?.sessionId),F(c.signal),s.command==="load"){if(w.size)throw new Error("A sp\
eech model is already resident");const{manifest:i}=K(s.manifest),l=J(s.runtimeAssets,k),e={sessionId:s.sessionId,manifestCid:s.
manifestCid,manifest:i,workerId:c.workerId,status:"loading"};w.set(e.sessionId,e);try{return e.engine=await m({manifest:i,
runtimeAssets:l,sessionId:e.sessionId,artifactPort:s.artifactPort,signal:c.signal,onProgress:c.emitProgress,baseUrl:k}),
F(c.signal),e.status="ready",u(e)}catch(n){try{await e.engine?.dispose(),w.delete(e.sessionId)}catch(A){throw e.status="\
lost",new AggregateError([n,A],"Model session lost: speech cleanup failed")}throw n}}const o=w.get(s.sessionId);if(!o)throw new Error(
"Speech model is not loaded");if(s.command==="status")return u(o);if(s.command==="unload")return await o.engine.dispose(),
w.delete(o.sessionId),{status:"unloaded",sessionId:o.sessionId};if(s.command!=="generate")throw new Error("Unknown speec\
h command");if($(s.requestId),o.status!=="ready"||o.engine.lost)throw new Error("Model session lost: speech is not ready");
const S=Q(s,o.manifest);o.status="generating";try{const i=await o.engine.generate(S,{signal:c.signal,onProgress:c.emitProgress});
return F(c.signal),{...i,sessionId:o.sessionId,requestId:s.requestId,workerId:o.workerId}}catch(i){throw/Model session lost/.
test(i.message)&&(o.status="lost"),i}finally{o.status!=="lost"&&(o.status=o.engine.lost?"lost":"ready")}}}const re=Y();export{Y as createSpeechTaskHandler,re as handleModelTask};
