import{M,a as B,f as K,e as ee,t as S,g as te,d as re,h as oe,m as ne}from"./ArtifactReadBridge-Bns2fboi.js";const se="4\
.3.2",ie=new Set(["qwen3_5","qwen3_5_text"]),j=new WeakMap,$="_get_text_only_rope_index";function Y(e,r,a){const[n,u]=e??
[];if(n?.type!=="int64"||u?.type!=="int64"||n.dims?.length!==3||n.dims[0]!==3||n.dims[1]!==r||n.dims[2]!==a||u.dims?.length!==
2||u.dims[0]!==r||u.dims[1]!==1||n.data?.length!==3*r*a||u.data?.length!==r)throw new Error("Unsupported Qwen text posit\
ion result");return{positions:n,deltas:u}}function ae(e,r){if(r?.env?.version!==se||!ie.has(e?.config?.model_type))return!1;
if(j.has(e)){if(e[$]!==j.get(e))throw new Error("Qwen text position compatibility was replaced");return!0}const a=e[$];if(typeof a!=
"function"||typeof r.Tensor!="function")throw new Error("Qwen text position compatibility is unavailable");const n=new r.
Tensor("int64",[10n,11n],[1,2]),u=new r.Tensor("int64",[1n,1n],[1,2]);let l;try{l=a.call(e,n,u);const{positions:s,deltas:w}=Y(
l,1,2);if([...s.data].some((c,i)=>c!==BigInt(i%2)))throw new Error("Unsupported Qwen text position calculation");if(w.data[0]===
0n)return!1;if(w.data[0]!==4n)throw new Error("Unsupported Qwen text position offset")}finally{for(const s of new Set([n,
u,...Array.isArray(l)?l:[]]))s?.dispose?.()}function E(s,w){const c=a.call(this,s,w);if(!w)return c;try{const[i,t]=w.dims??
[];if(w.dims?.length!==2||!Number.isSafeInteger(i)||i<1||!Number.isSafeInteger(t)||t<1)throw new Error("Invalid Qwen tex\
t position dimensions");const{positions:d,deltas:h}=Y(c,i,t);for(let f=0;f<i;f++){let p=d.data[f*t];for(let I=1;I<t;I++){
const _=d.data[f*t+I];_>p&&(p=_)}if(h.data[f]!==p+1n+BigInt(t))throw new Error("Qwen text position behavior changed")}const o=2n*
BigInt(t);for(let f=0;f<i;f++)h.data[f]-=o;return c}catch(i){for(const t of new Set(Array.isArray(c)?c:[]))t?.dispose?.();
throw i}}return Object.defineProperty(e,$,{value:E,configurable:!0,writable:!0}),j.set(e,E),!0}const z=e=>new TextEncoder().
encode(e).byteLength;function ue(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error(
"Model inference requires a ComputeManager-owned worker")}function ce(e){if(e==null)return null;if(!Number.isSafeInteger(
e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1||e.width*e.height>M.maxImagePixels||e.channels!==4||!(e.
data instanceof Uint8Array||e.data instanceof Uint8ClampedArray)||e.data.byteLength!==e.width*e.height*4||e.data.byteLength>
M.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded files are not accepted");
return e}function le(e){const r=e.messages??(typeof e.prompt=="string"?[{role:"user",content:e.prompt}]:null);if(!Array.
isArray(r)||!r.length||r.length>M.maxMessages)throw new Error("Invalid inference messages");let a=0;return r.map(n=>{if(!n||
!["system","user","assistant"].includes(n.role)||typeof n.content!="string")throw new Error("Only text message content i\
s accepted");if(a+=z(n.content),a>M.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{role:n.role,
content:n.content}})}async function Z(e){if(!e)return;let r;const a=new Set;for(const n of[e.model,e.processor,e.tokenizer])
if(!(!n||a.has(n))){a.add(n);try{await n.dispose?.()}catch(u){r??=u}}if(r)throw r}function Q(e,r=new Set){if(!(!e||typeof e!=
"object"||r.has(e))){if(r.add(e),typeof e.dispose=="function"){e.dispose();return}for(const a of Object.values(e))Q(a,r)}}
function de(e){const r=e.findIndex(n=>n.role==="user");if(r<0)return null;const a=e.findIndex((n,u)=>u>r&&n.role==="user");
return a<0?null:e.filter((n,u)=>u<r||u>=a||n.role==="system")}function fe(e,r,a){const n={...e.config};for(const s of["d\
ecoder","generator","text_config"])Object.assign(n,n[s]);Object.assign(n,e.generation_config);const u=Array.isArray(n.eos_token_id)?
n.eos_token_id:[n.eos_token_id],l=r.at(-1),E=s=>typeof s=="bigint"||Number.isSafeInteger(s)&&s>=0;return E(l)&&u.some(s=>E(
s)&&BigInt(s)===BigInt(l))?"stop":r.length>=a?"length":"unknown"}function P(e,r,a){const n=e==="out-of-memory"?"GPU out \
of memory. Close GPU-heavy apps or unload other models, then reload this model.":`GPU ${e}: ${String(r?.message??r??"ope\
ration failed").slice(0,240)}`,u=new Error(`Model session lost: ${a} ${n}`,{cause:r});return u.code=e==="out-of-memory"?
"ERR_MODEL_GPU_OUT_OF_MEMORY":"ERR_MODEL_GPU",u}function pe(e){let r,a,n=!1;const u=s=>{n||(e.lost=!0,(!e.gpuFailure||s.
code==="ERR_MODEL_GPU_OUT_OF_MEMORY")&&(e.gpuFailure=s),e.active?.abort(s))},l=({error:s})=>u(P(s?.constructor?.name==="\
GPUOutOfMemoryError"?"out-of-memory":"uncaptured error",s,a?.stage??"resident model")),E=()=>{if(!(!a||a.device)){a.device=
r;for(const s of["validation","out-of-memory","internal"])r.pushErrorScope(s),a.filters.push(s)}};return{attach(s){if(r&&
r!==s)throw P("device changed",null,"load");if(!r){if(!s||typeof s.pushErrorScope!="function"||typeof s.popErrorScope!="\
function"||typeof s.queue?.onSubmittedWorkDone!="function"||typeof s.addEventListener!="function"||typeof s.removeEventListener!=
"function"||typeof s.destroy!="function"||typeof s.lost?.then!="function")throw P("device unavailable",null,"load");r=s,
e.runtimeDevice=r,r.addEventListener("uncapturederror",l),r.lost.then(w=>u(P("device lost",w,a?.stage??"resident model")),
w=>u(P("device lost",w,a?.stage??"resident model")))}try{E()}catch(w){const c=P("error scope failure",w,a?.stage??"load");
throw u(c),c}},async run(s,w){if(e.lost)throw e.gpuFailure??P("device lost",null,s);if(a)throw new Error("Overlapping mo\
del GPU operations are not allowed");const c={stage:s,filters:[],device:null};a=c;let i,t;try{if(r&&this.attach(r),i=await w(),
!r)throw P("device unavailable",null,s)}catch(o){t=o}if(r)try{await r.queue.onSubmittedWorkDone()}catch(o){u(P("queue fa\
ilure",o,s))}const d=await Promise.all(c.filters.reverse().map(async o=>{try{return{filter:o,error:await c.device.popErrorScope()}}catch(f){
return{filter:o,error:f,scopeFailed:!0}}}));a=null;for(const o of d)o.scopeFailed&&u(P("error scope failure",o.error,s));
const h=["out-of-memory","internal","validation"].map(o=>d.find(f=>f.filter===o&&f.error&&!f.scopeFailed)).find(Boolean);
if(h&&u(P(h.filter,h.error,s)),t instanceof WebAssembly.RuntimeError||/^failed to call OrtRun\(\)\./.test(t?.message??"")){
const o=new Error("Model session lost: native inference runtime failed",{cause:t});o.code="ERR_MODEL_RUNTIME",u(o)}if(typeof t?.
code=="string"&&t.code.startsWith("ERR_MODEL_GPU")&&u(t),e.gpuFailure)throw e.gpuFailure;if(t)throw t;return i},dispose(){
n=!0,r?.removeEventListener("uncapturederror",l)}}}function me(e){const r=["maxBindGroups","maxComputeWorkgroupStorageSi\
ze","maxComputeWorkgroupsPerDimension","maxStorageBuffersPerShaderStage","maxStorageBufferBindingSize","maxBufferSize","\
maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ"],a={};
for(const u of r){const l=e.limits?.[u];if(!Number.isSafeInteger(l)||l<=0)throw new Error(`WebGPU adapter has an invalid\
 ${u} limit`);a[u]=l}const n=["chromium-experimental-subgroup-matrix","timestamp-query","shader-f16","subgroups","subgro\
up-size-control"].filter(u=>e.features.has(u));return{requiredLimits:a,requiredFeatures:n}}async function V(e){await Z(e.
components),e.restoreGpuEvidence?.(),e.gpuGuard?.dispose(),e.ownedDevice?.destroy(),e.ownedDevice=null}async function we({
library:e,modelPath:r,options:a,manifest:n,adapterFeatures:u=[]}){const l={};try{const E=await e.AutoConfig.from_pretrained(
r,a),s=oe(n.model,E);for(const c of s)if(!u.includes(c))throw new Error(`Model config requires unsupported GPU feature: ${c}`);
const w={...a,config:E};if(n.model.architecture==="qwen3_5"&&(w.use_external_data_format=1),n.model.task==="image-text-t\
o-text"){if(l.processor=await e.AutoProcessor.from_pretrained(r,a),n.model.architecture==="qwen3_5"){const c=l.processor.
image_processor;if(!c)throw new Error("Qwen3.5 image processor is unavailable");c.min_pixels=256*256,c.max_pixels=ne(n.model).
maxProcessedImagePixels,c.do_normalize??=!0}l.tokenizer=l.processor.tokenizer,l.model=await e.AutoModelForImageTextToText.
from_pretrained(r,w)}else l.tokenizer=await e.AutoTokenizer.from_pretrained(r,a),l.model=await e.AutoModelForCausalLM.from_pretrained(
r,w);return l}catch(E){throw await Z(l),E}}function X(e){return{sessionId:e.sessionId,manifestCid:e.manifestCid,status:e.
lost?"lost":e.status,task:e.manifest.model.task,dtype:e.manifest.model.dtype,workerId:e.workerId,adapter:e.adapter,runtimeAdapter:e.
runtimeAdapter??null,gpuDispatches:e.gpuDispatches??0,gpuSubmissions:e.gpuSubmissions??0,gpuProfileSamples:e.gpuProfileSamples??
0,collectGpuEvidence:e.collectGpuEvidence===!0,runtimeFeatures:e.runtimeFeatures??[],generatedRequests:e.generatedRequests,
qwenTextRopeCompatibility:e.qwenTextRopeCompatibility===!0}}function ge({loadLibrary:e=()=>import("./transformers.web-CKbegY_X.js"),
loadModel:r=we,gpu:a=globalThis.navigator?.gpu,baseUrl:n=globalThis.location?.href,assertWorker:u=ue}={}){const l=new Map;
let E;async function s(c,i){if(l.size)throw new Error("This inference worker already has a resident/loading model");const t=B(
c.sessionId),{manifest:d}=K(c.manifest),h=ee(c.runtimeAssets,n);if(!c.artifactPort?.postMessage)throw new Error("An arti\
fact reader port is required");S(i.signal);const o={sessionId:t,manifest:d,manifestCid:c.manifestCid,status:"loading",workerId:i.
workerId??null,generatedRequests:0,components:null};l.set(t,o);let f;try{const p=await a?.requestAdapter({powerPreference:"\
high-performance"});if(S(i.signal),!p||p.info?.isFallbackAdapter||p.isFallbackAdapter)throw new Error("A hardware WebGPU\
 adapter is required; CPU/software fallback is disabled");const I=typeof d.model.dtype=="string"?[d.model.dtype]:Object.
values(d.model.dtype),_=new Set(d.model.requiredFeatures??[]);I.some(g=>["fp16","q4f16"].includes(g))&&_.add("shader-f16");
for(const g of _)if(!p.features.has(g))throw new Error(`Model requires unsupported GPU feature: ${g}`);o.adapter={vendor:p.
info?.vendor??"",architecture:p.info?.architecture??"",isFallbackAdapter:!1,requiredFeatures:[..._]};const v=await(E??=e());
if(S(i.signal),v.env.version!==te)throw new Error("Unexpected Transformers runtime version");const G=new URL("/__peercom\
pute_models/",n);f=re(c.artifactPort,{manifest:d,baseUrl:new URL(`${t}/`,G).href,signal:i.signal});const{env:b}=v;b.logLevel=
50,b.allowLocalModels=!0,b.allowRemoteModels=!1,b.localModelPath=G.pathname,b.useBrowserCache=!1,b.useFSCache=!1,b.useWasmCache=
!1,b.fetch=async(...g)=>{try{return await f.fetch(...g)}catch(O){throw i.emitProgress?.({type:"artifact-read-error",sessionId:t,
message:O.message}),O}},b.backends.onnx.wasm.proxy=!1,b.backends.onnx.wasm.numThreads=1,b.backends.onnx.wasm.wasmPaths=h,
o.gpuDispatches=0,o.gpuProfileSamples=0,o.gpuSubmissions=0,o.collectGpuEvidence=c.collectGpuEvidence===!0,b.backends.onnx.
webgpu&&(b.backends.onnx.webgpu.profiling={mode:c.collectGpuEvidence===!0?"default":"off",ondata:()=>{o.gpuProfileSamples+=
1}});const C={local_files_only:!0,device:"webgpu",dtype:d.model.dtype,session_options:{executionProviders:["webgpu"]},progress_callback:g=>{
i.signal?.aborted||i.emitProgress?.({type:"model-load",sessionId:t,status:String(g.status??"").slice(0,40),file:typeof g.
file=="string"?g.file.slice(0,512):void 0,loaded:Number.isFinite(g.loaded)?g.loaded:void 0,total:Number.isFinite(g.total)?
g.total:void 0})}};o.library=v,o.gpuGuard=pe(o),await o.gpuGuard.run("load",async()=>{const g=b.backends.onnx.webgpu;if(!g)
throw new Error("The WebGPU runtime is unavailable");g.adapter=p,o.ownedDevice=await p.requestDevice(me(p)),o.gpuGuard.attach(
o.ownedDevice),C.session_options.executionProviders=[{name:"webgpu",device:o.ownedDevice}],o.components=await r({library:v,
modelPath:t,options:C,manifest:d,adapterFeatures:[...p.features]}),o.qwenTextRopeCompatibility=ae(o.components.model,v);
for(const O of _)if(!o.runtimeDevice.features.has(O))throw new Error(`ORT device is missing required GPU feature: ${O}`);
S(i.signal)});const m=o.runtimeDevice;if(o.runtimeFeatures=[...m?.features??[]],o.collectGpuEvidence&&m){const g=m.createCommandEncoder.
bind(m),O=m.queue.submit.bind(m.queue),x=Object.getOwnPropertyDescriptor(m,"createCommandEncoder"),D=Object.getOwnPropertyDescriptor(
m.queue,"submit");o.restoreGpuEvidence=()=>{x?Object.defineProperty(m,"createCommandEncoder",x):delete m.createCommandEncoder,
D?Object.defineProperty(m.queue,"submit",D):delete m.queue.submit,o.restoreGpuEvidence=null},m.createCommandEncoder=(...k)=>{
const y=g(...k),N=y.beginComputePass.bind(y);return y.beginComputePass=(...L)=>{const T=N(...L);for(const U of["dispatch\
Workgroups","dispatchWorkgroupsIndirect"]){const A=T[U].bind(T);T[U]=(...q)=>{const W=A(...q);return o.gpuDispatches+=1,
W}}return T},y},m.queue.submit=(...k)=>{const y=O(...k);return o.gpuSubmissions+=1,y}}const F=m?.adapterInfo??b.backends.
onnx.webgpu?.adapter?.info;if(F){if(F.isFallbackAdapter)throw new Error("ORT selected a software GPU adapter");o.runtimeAdapter=
{vendor:F.vendor,architecture:F.architecture,isFallbackAdapter:F.isFallbackAdapter??!1}}if(S(i.signal),o.lost)throw o.gpuFailure;
return o.status="ready",X(o)}catch(p){try{await V(o),l.delete(t)}catch(I){o.status="ready",o.lost=!0;const _=new Error(`\
MODEL_DISPOSE_FAILED: ${I.message}`);throw _.code="MODEL_DISPOSE_FAILED",_}throw p}finally{f?.close(),f||c.artifactPort.
close()}}async function w(c,i){const t=l.get(B(c.sessionId));if(!t||t.lost)throw new Error("Model session lost or not lo\
aded");if(t.status!=="ready")throw new Error("Model session is busy");const d=B(c.requestId),h=c.maxNewTokens??M.maxNewTokens;
if(!Number.isInteger(h)||h<1||h>M.maxNewTokens)throw new Error("Generation exceeds its output-token budget");let o=le(c);
const f=ce(c.image);if(f&&t.manifest.model.task!=="image-text-to-text")throw new Error("This model does not admit image \
inputs");S(i.signal);const p=new AbortController,I=new t.library.InterruptableStoppingCriteria,_=()=>{p.abort(i.signal?.
reason),I.interrupt()};i.signal?.addEventListener("abort",_,{once:!0}),p.signal.addEventListener("abort",()=>I.interrupt(),
{once:!0}),t.active=p,t.requestId=d,t.status="generating";let v,G,b=0,C=0,m,F=!1;const g=t.gpuDispatches??0,O=t.gpuSubmissions??
0;try{S(i.signal);const{tokenizer:x,processor:D,model:k}=t.components;let y;for(;;){S(p.signal);let A=o;if(D&&(A=o.map(R=>({
role:R.role,content:[{type:"text",text:R.content}]})),f)){const R=A.findLast(J=>J.role==="user");if(!R)throw new Error("\
An image requires a user message");R.content.unshift({type:"image"})}const q=(D??x).apply_chat_template(A,{tokenize:!1,add_generation_prompt:!0,
enable_thinking:!1});if(typeof q!="string"||z(q)>M.maxPromptBytes)throw new Error("Templated prompt exceeds its byte bud\
get");if(f){const R=new t.library.RawImage(f.data,f.width,f.height,f.channels);v=await D(q,R,{do_image_splitting:!1})}else
v=await x(q,{truncation:!1,padding:!1});if(S(p.signal),y=v.input_ids?.dims?.at(-1),!Number.isSafeInteger(y)||y<1)throw new Error(
"Invalid model input token count");if(y+h<=M.maxContextTokens)break;const W=de(o);if(!W)throw new Error("Latest prompt/i\
mage and system instructions exceed the context budget; shorten the prompt or request fewer output tokens");const H=v;v=
void 0,Q(H),o=W,F=!0}S(p.signal);const N=new t.library.TextStreamer(x,{skip_prompt:!0,skip_special_tokens:!0,callback_function:A=>{
if(!(p.signal.aborted||m)){if(C+=z(A),C>M.maxOutputBytes){m=new Error("Generated text exceeded its byte budget"),p.abort(
m);return}try{if(i.emitProgress?.({type:"token",sessionId:t.sessionId,requestId:d,sequence:b++,text:A})===!1)throw new Error(
"Token consumer rejected output")}catch(q){m=q,p.abort(q)}}}});if(await t.gpuGuard.run("generation",async()=>{G=await k.
generate({...v,max_new_tokens:h,do_sample:!1,streamer:N,stopping_criteria:[I]})}),m)throw m;if(t.lost)throw t.gpuFailure;
S(p.signal);const L=G.tolist();if(L.length!==1||L[0].length<y||L[0].length>y+h)throw new Error("Model returned an over-b\
udget token sequence");const T=L[0].slice(y),U=x.decode(T,{skip_special_tokens:!0});if(z(U)>M.maxOutputBytes)throw new Error(
"Generated text exceeds its byte budget");return t.generatedRequests+=1,{sessionId:t.sessionId,requestId:d,text:U,inputTokens:y,
outputTokens:T.length,finishReason:fe(k,T,h),contextTruncated:F,workerId:t.workerId,gpuDispatches:(t.gpuDispatches??0)-g,
gpuSubmissions:(t.gpuSubmissions??0)-O,gpuProfileSamples:t.gpuProfileSamples??0}}catch(x){throw t.gpuFailure??x}finally{
i.signal?.removeEventListener("abort",_);try{const x=new Set;let D;for(const k of[v,G])try{Q(k,x)}catch(y){D??=y}if(D){t.
lost=!0;const k=t.gpuFailure??new Error("Model session lost: tensor cleanup failed",{cause:D});throw k.code??="MODEL_DIS\
POSE_FAILED",t.gpuFailure=k,k}}finally{t.active=null,t.requestId=null,t.status="ready"}}}return async function(i={},t={}){
if(u(),i.command==="load")return s(i,t);if(i.command==="generate")return w(i,t);const d=l.get(B(i.sessionId));if(i.command===
"status")return d?X(d):{sessionId:i.sessionId,status:"absent"};if(i.command==="cancel")return d?.requestId===i.requestId&&
d.active?.abort("Generation cancelled"),{sessionId:i.sessionId,cancellationRequested:!0};if(i.command==="unload"){if(!d)
return{sessionId:i.sessionId,status:"absent"};if(d.status!=="ready")throw new Error("Cancel and await active model work \
before unloading");d.status="unloading";try{await V(d)}catch(h){d.status="ready",d.lost=!0;const o=new Error(`MODEL_DISP\
OSE_FAILED: ${h.message}`);throw o.code="MODEL_DISPOSE_FAILED",o}return l.delete(i.sessionId),{sessionId:i.sessionId,status:"\
unloaded"}}throw new Error("Unknown model task command")}}const he=ge(),ye=(e,r)=>he(e,r);export{ge as createModelTaskRuntime,ye as handleModelTask,le as normalizeModelMessages,ce as validateImageInput};
