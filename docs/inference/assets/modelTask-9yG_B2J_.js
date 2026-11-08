import{M,a as z,c as Z,d as H,t as I,e as J,f as K,g as ee,m as te}from"./ArtifactReadBridge-mLMxyVL0.js";const B=e=>new TextEncoder().
encode(e).byteLength;function re(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error(
"Model inference requires a ComputeManager-owned worker")}function oe(e){if(e==null)return null;if(!Number.isSafeInteger(
e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1||e.width*e.height>M.maxImagePixels||e.channels!==4||!(e.
data instanceof Uint8Array||e.data instanceof Uint8ClampedArray)||e.data.byteLength!==e.width*e.height*4||e.data.byteLength>
M.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded files are not accepted");
return e}function se(e){const r=e.messages??(typeof e.prompt=="string"?[{role:"user",content:e.prompt}]:null);if(!Array.
isArray(r)||!r.length||r.length>M.maxMessages)throw new Error("Invalid inference messages");let i=0;return r.map(s=>{if(!s||
!["system","user","assistant"].includes(s.role)||typeof s.content!="string")throw new Error("Only text message content i\
s accepted");if(i+=B(s.content),i>M.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{role:s.role,
content:s.content}})}async function Q(e){if(!e)return;let r;const i=new Set;for(const s of[e.model,e.processor,e.tokenizer])
if(!(!s||i.has(s))){i.add(s);try{await s.dispose?.()}catch(u){r??=u}}if(r)throw r}function $(e,r=new Set){if(!(!e||typeof e!=
"object"||r.has(e))){if(r.add(e),typeof e.dispose=="function"){e.dispose();return}for(const i of Object.values(e))$(i,r)}}
function ne(e){const r=e.findIndex(s=>s.role==="user");if(r<0)return null;const i=e.findIndex((s,u)=>u>r&&s.role==="user");
return i<0?null:e.filter((s,u)=>u<r||u>=i||s.role==="system")}function ie(e,r,i){const s={...e.config};for(const n of["d\
ecoder","generator","text_config"])Object.assign(s,s[n]);Object.assign(s,e.generation_config);const u=Array.isArray(s.eos_token_id)?
s.eos_token_id:[s.eos_token_id],d=r.at(-1),_=n=>typeof n=="bigint"||Number.isSafeInteger(n)&&n>=0;return _(d)&&u.some(n=>_(
n)&&BigInt(n)===BigInt(d))?"stop":r.length>=i?"length":"unknown"}function S(e,r,i){const s=e==="out-of-memory"?"GPU out \
of memory. Close GPU-heavy apps or unload other models, then reload this model.":`GPU ${e}: ${String(r?.message??r??"ope\
ration failed").slice(0,240)}`,u=new Error(`Model session lost: ${i} ${s}`,{cause:r});return u.code=e==="out-of-memory"?
"ERR_MODEL_GPU_OUT_OF_MEMORY":"ERR_MODEL_GPU",u}function ae(e){let r,i,s=!1;const u=n=>{s||(e.lost=!0,(!e.gpuFailure||n.
code==="ERR_MODEL_GPU_OUT_OF_MEMORY")&&(e.gpuFailure=n),e.active?.abort(n))},d=({error:n})=>u(S(n?.constructor?.name==="\
GPUOutOfMemoryError"?"out-of-memory":"uncaptured error",n,i?.stage??"resident model")),_=()=>{if(!(!i||i.device)){i.device=
r;for(const n of["validation","out-of-memory","internal"])r.pushErrorScope(n),i.filters.push(n)}};return{attach(n){if(r&&
r!==n)throw S("device changed",null,"load");if(!r){if(!n||typeof n.pushErrorScope!="function"||typeof n.popErrorScope!="\
function"||typeof n.queue?.onSubmittedWorkDone!="function"||typeof n.addEventListener!="function"||typeof n.removeEventListener!=
"function"||typeof n.destroy!="function"||typeof n.lost?.then!="function")throw S("device unavailable",null,"load");r=n,
e.runtimeDevice=r,r.addEventListener("uncapturederror",d),r.lost.then(E=>u(S("device lost",E,i?.stage??"resident model")),
E=>u(S("device lost",E,i?.stage??"resident model")))}try{_()}catch(E){const c=S("error scope failure",E,i?.stage??"load");
throw u(c),c}},async run(n,E){if(e.lost)throw e.gpuFailure??S("device lost",null,n);if(i)throw new Error("Overlapping mo\
del GPU operations are not allowed");const c={stage:n,filters:[],device:null};i=c;let a,o;try{if(r&&this.attach(r),a=await E(),
!r)throw S("device unavailable",null,n)}catch(t){o=t}if(r)try{await r.queue.onSubmittedWorkDone()}catch(t){u(S("queue fa\
ilure",t,n))}const l=await Promise.all(c.filters.reverse().map(async t=>{try{return{filter:t,error:await c.device.popErrorScope()}}catch(g){
return{filter:t,error:g,scopeFailed:!0}}}));i=null;for(const t of l)t.scopeFailed&&u(S("error scope failure",t.error,n));
const b=["out-of-memory","internal","validation"].map(t=>l.find(g=>g.filter===t&&g.error&&!g.scopeFailed)).find(Boolean);
if(b&&u(S(b.filter,b.error,n)),o instanceof WebAssembly.RuntimeError||/^failed to call OrtRun\(\)\./.test(o?.message??"")){
const t=new Error("Model session lost: native inference runtime failed",{cause:o});t.code="ERR_MODEL_RUNTIME",u(t)}if(typeof o?.
code=="string"&&o.code.startsWith("ERR_MODEL_GPU")&&u(o),e.gpuFailure)throw e.gpuFailure;if(o)throw o;return a},dispose(){
s=!0,r?.removeEventListener("uncapturederror",d)}}}function ue(e){const r=["maxBindGroups","maxComputeWorkgroupStorageSi\
ze","maxComputeWorkgroupsPerDimension","maxStorageBuffersPerShaderStage","maxStorageBufferBindingSize","maxBufferSize","\
maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ"],i={};
for(const u of r){const d=e.limits?.[u];if(!Number.isSafeInteger(d)||d<=0)throw new Error(`WebGPU adapter has an invalid\
 ${u} limit`);i[u]=d}const s=["chromium-experimental-subgroup-matrix","timestamp-query","shader-f16","subgroups","subgro\
up-size-control"].filter(u=>e.features.has(u));return{requiredLimits:i,requiredFeatures:s}}async function j(e){await Q(e.
components),e.restoreGpuEvidence?.(),e.gpuGuard?.dispose(),e.ownedDevice?.destroy(),e.ownedDevice=null}async function ce({
library:e,modelPath:r,options:i,manifest:s,adapterFeatures:u=[]}){const d={};try{const _=await e.AutoConfig.from_pretrained(
r,i),n=ee(s.model,_);for(const c of n)if(!u.includes(c))throw new Error(`Model config requires unsupported GPU feature: ${c}`);
const E={...i,config:_};if(s.model.architecture==="qwen3_5"&&(E.use_external_data_format=1),s.model.task==="image-text-t\
o-text"){if(d.processor=await e.AutoProcessor.from_pretrained(r,i),s.model.architecture==="qwen3_5"){const c=d.processor.
image_processor;if(!c)throw new Error("Qwen3.5 image processor is unavailable");c.min_pixels=256*256,c.max_pixels=te(s.model).
maxProcessedImagePixels,c.do_normalize??=!0}d.tokenizer=d.processor.tokenizer,d.model=await e.AutoModelForImageTextToText.
from_pretrained(r,E)}else d.tokenizer=await e.AutoTokenizer.from_pretrained(r,i),d.model=await e.AutoModelForCausalLM.from_pretrained(
r,E);return d}catch(_){throw await Q(d),_}}function Y(e){return{sessionId:e.sessionId,manifestCid:e.manifestCid,status:e.
lost?"lost":e.status,task:e.manifest.model.task,dtype:e.manifest.model.dtype,workerId:e.workerId,adapter:e.adapter,runtimeAdapter:e.
runtimeAdapter??null,gpuDispatches:e.gpuDispatches??0,gpuSubmissions:e.gpuSubmissions??0,gpuProfileSamples:e.gpuProfileSamples??
0,collectGpuEvidence:e.collectGpuEvidence===!0,runtimeFeatures:e.runtimeFeatures??[],generatedRequests:e.generatedRequests}}
function de({loadLibrary:e=()=>import("./transformers.web-CsR9rRO0.js"),loadModel:r=ce,gpu:i=globalThis.navigator?.gpu,baseUrl:s=globalThis.
location?.href,assertWorker:u=re}={}){const d=new Map;let _;async function n(c,a){if(d.size)throw new Error("This infere\
nce worker already has a resident/loading model");const o=z(c.sessionId),{manifest:l}=Z(c.manifest),b=H(c.runtimeAssets,
s);if(!c.artifactPort?.postMessage)throw new Error("An artifact reader port is required");I(a.signal);const t={sessionId:o,
manifest:l,manifestCid:c.manifestCid,status:"loading",workerId:a.workerId??null,generatedRequests:0,components:null};d.set(
o,t);let g;try{const f=await i?.requestAdapter({powerPreference:"high-performance"});if(I(a.signal),!f||f.info?.isFallbackAdapter||
f.isFallbackAdapter)throw new Error("A hardware WebGPU adapter is required; CPU/software fallback is disabled");const L=typeof l.
model.dtype=="string"?[l.model.dtype]:Object.values(l.model.dtype),x=new Set(l.model.requiredFeatures??[]);L.some(m=>["f\
p16","q4f16"].includes(m))&&x.add("shader-f16");for(const m of x)if(!f.features.has(m))throw new Error(`Model requires u\
nsupported GPU feature: ${m}`);t.adapter={vendor:f.info?.vendor??"",architecture:f.info?.architecture??"",isFallbackAdapter:!1,
requiredFeatures:[...x]};const y=await(_??=e());if(I(a.signal),y.env.version!==J)throw new Error("Unexpected Transformer\
s runtime version");const R=new URL("/__peercompute_models/",s);g=K(c.artifactPort,{manifest:l,baseUrl:new URL(`${o}/`,R).
href,signal:a.signal});const{env:w}=y;w.logLevel=50,w.allowLocalModels=!0,w.allowRemoteModels=!1,w.localModelPath=R.pathname,
w.useBrowserCache=!1,w.useFSCache=!1,w.useWasmCache=!1,w.fetch=async(...m)=>{try{return await g.fetch(...m)}catch(O){throw a.
emitProgress?.({type:"artifact-read-error",sessionId:o,message:O.message}),O}},w.backends.onnx.wasm.proxy=!1,w.backends.
onnx.wasm.numThreads=1,w.backends.onnx.wasm.wasmPaths=b,t.gpuDispatches=0,t.gpuProfileSamples=0,t.gpuSubmissions=0,t.collectGpuEvidence=
c.collectGpuEvidence===!0,w.backends.onnx.webgpu&&(w.backends.onnx.webgpu.profiling={mode:c.collectGpuEvidence===!0?"def\
ault":"off",ondata:()=>{t.gpuProfileSamples+=1}});const T={local_files_only:!0,device:"webgpu",dtype:l.model.dtype,session_options:{
executionProviders:["webgpu"]},progress_callback:m=>{a.signal?.aborted||a.emitProgress?.({type:"model-load",sessionId:o,
status:String(m.status??"").slice(0,40),file:typeof m.file=="string"?m.file.slice(0,512):void 0,loaded:Number.isFinite(m.
loaded)?m.loaded:void 0,total:Number.isFinite(m.total)?m.total:void 0})}};t.library=y,t.gpuGuard=ae(t),await t.gpuGuard.
run("load",async()=>{const m=w.backends.onnx.webgpu;if(!m)throw new Error("The WebGPU runtime is unavailable");m.adapter=
f,t.ownedDevice=await f.requestDevice(ue(f)),t.gpuGuard.attach(t.ownedDevice),T.session_options.executionProviders=[{name:"\
webgpu",device:t.ownedDevice}],t.components=await r({library:y,modelPath:o,options:T,manifest:l,adapterFeatures:[...f.features]});
for(const O of x)if(!t.runtimeDevice.features.has(O))throw new Error(`ORT device is missing required GPU feature: ${O}`);
I(a.signal)});const p=t.runtimeDevice;if(t.runtimeFeatures=[...p?.features??[]],t.collectGpuEvidence&&p){const m=p.createCommandEncoder.
bind(p),O=p.queue.submit.bind(p.queue),v=Object.getOwnPropertyDescriptor(p,"createCommandEncoder"),P=Object.getOwnPropertyDescriptor(
p.queue,"submit");t.restoreGpuEvidence=()=>{v?Object.defineProperty(p,"createCommandEncoder",v):delete p.createCommandEncoder,
P?Object.defineProperty(p.queue,"submit",P):delete p.queue.submit,t.restoreGpuEvidence=null},p.createCommandEncoder=(...k)=>{
const h=m(...k),N=h.beginComputePass.bind(h);return h.beginComputePass=(...C)=>{const F=N(...C);for(const U of["dispatch\
Workgroups","dispatchWorkgroupsIndirect"]){const G=F[U].bind(F);F[U]=(...D)=>{const W=G(...D);return t.gpuDispatches+=1,
W}}return F},h},p.queue.submit=(...k)=>{const h=O(...k);return t.gpuSubmissions+=1,h}}const q=p?.adapterInfo??w.backends.
onnx.webgpu?.adapter?.info;if(q){if(q.isFallbackAdapter)throw new Error("ORT selected a software GPU adapter");t.runtimeAdapter=
{vendor:q.vendor,architecture:q.architecture,isFallbackAdapter:q.isFallbackAdapter??!1}}if(I(a.signal),t.lost)throw t.gpuFailure;
return t.status="ready",Y(t)}catch(f){try{await j(t),d.delete(o)}catch(L){t.status="ready",t.lost=!0;const x=new Error(`\
MODEL_DISPOSE_FAILED: ${L.message}`);throw x.code="MODEL_DISPOSE_FAILED",x}throw f}finally{g?.close(),g||c.artifactPort.
close()}}async function E(c,a){const o=d.get(z(c.sessionId));if(!o||o.lost)throw new Error("Model session lost or not lo\
aded");if(o.status!=="ready")throw new Error("Model session is busy");const l=z(c.requestId),b=c.maxNewTokens??M.maxNewTokens;
if(!Number.isInteger(b)||b<1||b>M.maxNewTokens)throw new Error("Generation exceeds its output-token budget");let t=se(c);
const g=oe(c.image);if(g&&o.manifest.model.task!=="image-text-to-text")throw new Error("This model does not admit image \
inputs");I(a.signal);const f=new AbortController,L=new o.library.InterruptableStoppingCriteria,x=()=>{f.abort(a.signal?.
reason),L.interrupt()};a.signal?.addEventListener("abort",x,{once:!0}),f.signal.addEventListener("abort",()=>L.interrupt(),
{once:!0}),o.active=f,o.requestId=l,o.status="generating";let y,R,w=0,T=0,p,q=!1;const m=o.gpuDispatches??0,O=o.gpuSubmissions??
0;try{I(a.signal);const{tokenizer:v,processor:P,model:k}=o.components;let h;for(;;){I(f.signal);let G=t;if(P&&(G=t.map(A=>({
role:A.role,content:[{type:"text",text:A.content}]})),g)){const A=G.findLast(X=>X.role==="user");if(!A)throw new Error("\
An image requires a user message");A.content.unshift({type:"image"})}const D=(P??v).apply_chat_template(G,{tokenize:!1,add_generation_prompt:!0,
enable_thinking:!1});if(typeof D!="string"||B(D)>M.maxPromptBytes)throw new Error("Templated prompt exceeds its byte bud\
get");if(g){const A=new o.library.RawImage(g.data,g.width,g.height,g.channels);y=await P(D,A,{do_image_splitting:!1})}else
y=await v(D,{truncation:!1,padding:!1});if(I(f.signal),h=y.input_ids?.dims?.at(-1),!Number.isSafeInteger(h)||h<1)throw new Error(
"Invalid model input token count");if(h+b<=M.maxContextTokens)break;const W=ne(t);if(!W)throw new Error("Latest prompt/i\
mage and system instructions exceed the context budget; shorten the prompt or request fewer output tokens");const V=y;y=
void 0,$(V),t=W,q=!0}I(f.signal);const N=new o.library.TextStreamer(v,{skip_prompt:!0,skip_special_tokens:!0,callback_function:G=>{
if(!(f.signal.aborted||p)){if(T+=B(G),T>M.maxOutputBytes){p=new Error("Generated text exceeded its byte budget"),f.abort(
p);return}try{if(a.emitProgress?.({type:"token",sessionId:o.sessionId,requestId:l,sequence:w++,text:G})===!1)throw new Error(
"Token consumer rejected output")}catch(D){p=D,f.abort(D)}}}});if(await o.gpuGuard.run("generation",async()=>{R=await k.
generate({...y,max_new_tokens:b,do_sample:!1,streamer:N,stopping_criteria:[L]})}),p)throw p;if(o.lost)throw o.gpuFailure;
I(f.signal);const C=R.tolist();if(C.length!==1||C[0].length<h||C[0].length>h+b)throw new Error("Model returned an over-b\
udget token sequence");const F=C[0].slice(h),U=v.decode(F,{skip_special_tokens:!0});if(B(U)>M.maxOutputBytes)throw new Error(
"Generated text exceeds its byte budget");return o.generatedRequests+=1,{sessionId:o.sessionId,requestId:l,text:U,inputTokens:h,
outputTokens:F.length,finishReason:ie(k,F,b),contextTruncated:q,workerId:o.workerId,gpuDispatches:(o.gpuDispatches??0)-m,
gpuSubmissions:(o.gpuSubmissions??0)-O,gpuProfileSamples:o.gpuProfileSamples??0}}catch(v){throw o.gpuFailure??v}finally{
a.signal?.removeEventListener("abort",x);try{const v=new Set;let P;for(const k of[y,R])try{$(k,v)}catch(h){P??=h}if(P){o.
lost=!0;const k=o.gpuFailure??new Error("Model session lost: tensor cleanup failed",{cause:P});throw k.code??="MODEL_DIS\
POSE_FAILED",o.gpuFailure=k,k}}finally{o.active=null,o.requestId=null,o.status="ready"}}}return async function(a={},o={}){
if(u(),a.command==="load")return n(a,o);if(a.command==="generate")return E(a,o);const l=d.get(z(a.sessionId));if(a.command===
"status")return l?Y(l):{sessionId:a.sessionId,status:"absent"};if(a.command==="cancel")return l?.requestId===a.requestId&&
l.active?.abort("Generation cancelled"),{sessionId:a.sessionId,cancellationRequested:!0};if(a.command==="unload"){if(!l)
return{sessionId:a.sessionId,status:"absent"};if(l.status!=="ready")throw new Error("Cancel and await active model work \
before unloading");l.status="unloading";try{await j(l)}catch(b){l.status="ready",l.lost=!0;const t=new Error(`MODEL_DISP\
OSE_FAILED: ${b.message}`);throw t.code="MODEL_DISPOSE_FAILED",t}return d.delete(a.sessionId),{sessionId:a.sessionId,status:"\
unloaded"}}throw new Error("Unknown model task command")}}const le=de(),pe=(e,r)=>le(e,r);export{de as createModelTaskRuntime,pe as handleModelTask,se as normalizeModelMessages,oe as validateImageInput};
