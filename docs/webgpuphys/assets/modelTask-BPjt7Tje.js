import{M as A,a as V,f as ne,e as ie,t as O,g as ae,d as ue,h as ce,m as de,o as le}from"./ArtifactReadBridge-DPSL9Th9.js";
const fe="4.3.2",pe=new Set(["qwen3_5","qwen3_5_text"]),H=new WeakMap,J="_get_text_only_rope_index";function ee(e,t,r){var l,
g,s,m;const[o,u]=e??[];if((o==null?void 0:o.type)!=="int64"||(u==null?void 0:u.type)!=="int64"||((l=o.dims)==null?void 0:
l.length)!==3||o.dims[0]!==3||o.dims[1]!==t||o.dims[2]!==r||((g=u.dims)==null?void 0:g.length)!==2||u.dims[0]!==t||u.dims[1]!==
1||((s=o.data)==null?void 0:s.length)!==3*t*r||((m=u.data)==null?void 0:m.length)!==t)throw new Error("Unsupported Qwen \
text position result");return{positions:o,deltas:u}}function me(e,t){var s,m,h;if(((s=t==null?void 0:t.env)==null?void 0:
s.version)!==fe||!pe.has((m=e==null?void 0:e.config)==null?void 0:m.model_type))return!1;if(H.has(e)){if(e[J]!==H.get(e))
throw new Error("Qwen text position compatibility was replaced");return!0}const r=e[J];if(typeof r!="function"||typeof t.
Tensor!="function")throw new Error("Qwen text position compatibility is unavailable");const o=new t.Tensor("int64",[10n,
11n],[1,2]),u=new t.Tensor("int64",[1n,1n],[1,2]);let l;try{l=r.call(e,o,u);const{positions:b,deltas:d}=ee(l,1,2);if([...b.
data].some((a,i)=>a!==BigInt(i%2)))throw new Error("Unsupported Qwen text position calculation");if(d.data[0]===0n)return!1;
if(d.data[0]!==4n)throw new Error("Unsupported Qwen text position offset")}finally{for(const b of new Set([o,u,...Array.
isArray(l)?l:[]]))(h=b==null?void 0:b.dispose)==null||h.call(b)}function g(b,d){var i,c;const a=r.call(this,b,d);if(!d)return a;
try{const[p,n]=d.dims??[];if(((i=d.dims)==null?void 0:i.length)!==2||!Number.isSafeInteger(p)||p<1||!Number.isSafeInteger(
n)||n<1)throw new Error("Invalid Qwen text position dimensions");const{positions:E,deltas:v}=ee(a,p,n);for(let I=0;I<p;I++){
let P=E.data[I*n];for(let G=1;G<n;G++){const W=E.data[I*n+G];W>P&&(P=W)}if(v.data[I]!==P+1n+BigInt(n))throw new Error("Q\
wen text position behavior changed")}const C=2n*BigInt(n);for(let I=0;I<p;I++)v.data[I]-=C;return a}catch(p){for(const n of new Set(
Array.isArray(a)?a:[]))(c=n==null?void 0:n.dispose)==null||c.call(n);throw p}}return Object.defineProperty(e,J,{value:g,
configurable:!0,writable:!0}),H.set(e,g),!0}const X=e=>new TextEncoder().encode(e).byteLength;function we(){if(typeof WorkerGlobalScope>
"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}
function ge(e){if(e==null)return null;if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<
1||e.width*e.height>A.maxImagePixels||e.channels!==4||!(e.data instanceof Uint8Array||e.data instanceof Uint8ClampedArray)||
e.data.byteLength!==e.width*e.height*4||e.data.byteLength>A.maxImageBytes)throw new Error("Image must contain bounded RG\
BA pixels; image URLs and encoded files are not accepted");return e}function he(e){const t=e.messages??(typeof e.prompt==
"string"?[{role:"user",content:e.prompt}]:null);if(!Array.isArray(t)||!t.length||t.length>A.maxMessages)throw new Error(
"Invalid inference messages");let r=0;return t.map(o=>{if(!o||!["system","user","assistant"].includes(o.role)||typeof o.
content!="string")throw new Error("Only text message content is accepted");if(r+=X(o.content),r>A.maxPromptBytes)throw new Error(
"Prompt exceeds its byte budget");return{role:o.role,content:o.content}})}async function oe(e){var o;if(!e)return;let t;
const r=new Set;for(const u of[e.model,e.processor,e.tokenizer])if(!(!u||r.has(u))){r.add(u);try{await((o=u.dispose)==null?
void 0:o.call(u))}catch(l){t??(t=l)}}if(t)throw t}function K(e,t=new Set){if(!(!e||typeof e!="object"||t.has(e))){if(t.add(
e),typeof e.dispose=="function"){e.dispose();return}for(const r of Object.values(e))K(r,t)}}function be(e){const t=e.findIndex(
o=>o.role==="user");if(t<0)return null;const r=e.findIndex((o,u)=>u>t&&o.role==="user");return r<0||!e.some((o,u)=>u>t&&
u<r&&o.role==="assistant")?null:e.filter((o,u)=>u<t||u>=r||o.role==="system")}function Ee(e,t,r){const o={...e.config};for(const s of[
"decoder","generator","text_config"])Object.assign(o,o[s]);Object.assign(o,e.generation_config);const u=Array.isArray(o.
eos_token_id)?o.eos_token_id:[o.eos_token_id],l=t.at(-1),g=s=>typeof s=="bigint"||Number.isSafeInteger(s)&&s>=0;return g(
l)&&u.some(s=>g(s)&&BigInt(s)===BigInt(l))?"stop":t.length>=r?"length":"unknown"}function D(e,t,r){const o=e==="out-of-m\
emory"?"GPU out of memory. Close GPU-heavy apps or unload other models, then reload this model.":`GPU ${e}: ${String((t==
null?void 0:t.message)??t??"operation failed").slice(0,240)}`,u=new Error(`Model session lost: ${r} ${o}`,{cause:t});return u.
code=e==="out-of-memory"?"ERR_MODEL_GPU_OUT_OF_MEMORY":"ERR_MODEL_GPU",u}function ye(e){let t,r,o=!1;const u=s=>{var m;o||
(e.lost=!0,(!e.gpuFailure||s.code==="ERR_MODEL_GPU_OUT_OF_MEMORY")&&(e.gpuFailure=s),(m=e.active)==null||m.abort(s))},l=({
error:s})=>{var m;return u(D(((m=s==null?void 0:s.constructor)==null?void 0:m.name)==="GPUOutOfMemoryError"?"out-of-memo\
ry":"uncaptured error",s,(r==null?void 0:r.stage)??"resident model"))},g=()=>{if(!(!r||r.device)){r.device=t;for(const s of[
"validation","out-of-memory","internal"])t.pushErrorScope(s),r.filters.push(s)}};return{attach(s){var m,h;if(t&&t!==s)throw D(
"device changed",null,"load");if(!t){if(!s||typeof s.pushErrorScope!="function"||typeof s.popErrorScope!="function"||typeof((m=
s.queue)==null?void 0:m.onSubmittedWorkDone)!="function"||typeof s.addEventListener!="function"||typeof s.removeEventListener!=
"function"||typeof s.destroy!="function"||typeof((h=s.lost)==null?void 0:h.then)!="function")throw D("device unavailable",
null,"load");t=s,e.runtimeDevice=t,e.restoreResourceEvidence=le(t,e),t.addEventListener("uncapturederror",l),t.lost.then(
b=>u(D("device lost",b,(r==null?void 0:r.stage)??"resident model")),b=>u(D("device lost",b,(r==null?void 0:r.stage)??"re\
sident model")))}try{g()}catch(b){const d=D("error scope failure",b,(r==null?void 0:r.stage)??"load");throw u(d),d}},async run(s,m){
if(e.lost)throw e.gpuFailure??D("device lost",null,s);if(r)throw new Error("Overlapping model GPU operations are not all\
owed");const h={stage:s,filters:[],device:null};r=h;let b,d;try{if(t&&this.attach(t),b=await m(),!t)throw D("device unav\
ailable",null,s)}catch(c){d=c}if(t)try{await t.queue.onSubmittedWorkDone()}catch(c){u(D("queue failure",c,s))}const a=await Promise.
all(h.filters.reverse().map(async c=>{try{return{filter:c,error:await h.device.popErrorScope()}}catch(p){return{filter:c,
error:p,scopeFailed:!0}}}));r=null;for(const c of a)c.scopeFailed&&u(D("error scope failure",c.error,s));const i=["out-o\
f-memory","internal","validation"].map(c=>a.find(p=>p.filter===c&&p.error&&!p.scopeFailed)).find(Boolean);if(i&&u(D(i.filter,
i.error,s)),d instanceof WebAssembly.RuntimeError||/^failed to call OrtRun\(\)\./.test((d==null?void 0:d.message)??"")){
const c=new Error("Model session lost: native inference runtime failed",{cause:d});c.code="ERR_MODEL_RUNTIME",u(c)}if(typeof(d==
null?void 0:d.code)=="string"&&d.code.startsWith("ERR_MODEL_GPU")&&u(d),e.gpuFailure)throw e.gpuFailure;if(d)throw d;return b},
dispose(){var s;o=!0,t==null||t.removeEventListener("uncapturederror",l),(s=e.restoreResourceEvidence)==null||s.call(e)}}}
function _e(e){var u;const t=["maxBindGroups","maxComputeWorkgroupStorageSize","maxComputeWorkgroupsPerDimension","maxSt\
orageBuffersPerShaderStage","maxStorageBufferBindingSize","maxBufferSize","maxComputeInvocationsPerWorkgroup","maxComput\
eWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ"],r={};for(const l of t){const g=(u=e.limits)==null?
void 0:u[l];if(!Number.isSafeInteger(g)||g<=0)throw new Error(`WebGPU adapter has an invalid ${l} limit`);r[l]=g}const o=[
"chromium-experimental-subgroup-matrix","timestamp-query","shader-f16","subgroups","subgroup-size-control"].filter(l=>e.
features.has(l));return{requiredLimits:r,requiredFeatures:o}}async function te(e){var t,r,o;await oe(e.components),(t=e.
restoreGpuEvidence)==null||t.call(e),(r=e.gpuGuard)==null||r.dispose(),(o=e.ownedDevice)==null||o.destroy(),e.ownedDevice=
null}async function ke({library:e,modelPath:t,options:r,manifest:o,adapterFeatures:u=[]}){const l={};try{const g=await e.
AutoConfig.from_pretrained(t,r),s=ce(o.model,g);for(const h of s)if(!u.includes(h))throw new Error(`Model config require\
s unsupported GPU feature: ${h}`);const m={...r,config:g};if(o.model.architecture==="qwen3_5"&&(m.use_external_data_format=
1),o.model.task==="image-text-to-text"){if(l.processor=await e.AutoProcessor.from_pretrained(t,r),o.model.architecture===
"qwen3_5"){const h=l.processor.image_processor;if(!h)throw new Error("Qwen3.5 image processor is unavailable");h.min_pixels=
256*256,h.max_pixels=de(o.model).maxProcessedImagePixels,h.do_normalize??(h.do_normalize=!0)}l.tokenizer=l.processor.tokenizer,
l.model=await e.AutoModelForImageTextToText.from_pretrained(t,m)}else l.tokenizer=await e.AutoTokenizer.from_pretrained(
t,r),l.model=await e.AutoModelForCausalLM.from_pretrained(t,m);return l}catch(g){throw await oe(l),g}}function re(e){return{
sessionId:e.sessionId,manifestCid:e.manifestCid,status:e.lost?"lost":e.status,task:e.manifest.model.task,dtype:e.manifest.
model.dtype,workerId:e.workerId,adapter:e.adapter,runtimeAdapter:e.runtimeAdapter??null,requestedGpuBufferPeakBytes:e.requestedGpuBufferPeakBytes,
gpuDispatches:e.gpuDispatches??0,gpuSubmissions:e.gpuSubmissions??0,gpuProfileSamples:e.gpuProfileSamples??0,collectGpuEvidence:e.
collectGpuEvidence===!0,runtimeFeatures:e.runtimeFeatures??[],generatedRequests:e.generatedRequests,qwenTextRopeCompatibility:e.
qwenTextRopeCompatibility===!0}}function ve({loadLibrary:e=()=>import("./transformers.web-Bm4U2WqP.js"),loadModel:t=ke,gpu:r=(l=>(l=
globalThis.navigator)==null?void 0:l.gpu)(),baseUrl:o=(g=>(g=globalThis.location)==null?void 0:g.href)(),assertWorker:u=we}={}){
const s=new Map;let m;async function h(d,a){var v,C,I,P,G,W;if(s.size)throw new Error("This inference worker already has\
 a resident/loading model");const i=V(d.sessionId),{manifest:c}=ne(d.manifest),p=ie(d.runtimeAssets,o);if(!((v=d.artifactPort)!=
null&&v.postMessage))throw new Error("An artifact reader port is required");O(a.signal);const n={sessionId:i,manifest:c,
manifestCid:d.manifestCid,status:"loading",workerId:a.workerId??null,generatedRequests:0,components:null};s.set(i,n);let E;
try{const S=await(r==null?void 0:r.requestAdapter({powerPreference:"high-performance"}));if(O(a.signal),!S||(C=S.info)!=
null&&C.isFallbackAdapter||S.isFallbackAdapter)throw new Error("A hardware WebGPU adapter is required; CPU/software fall\
back is disabled");const R=typeof c.model.dtype=="string"?[c.model.dtype]:Object.values(c.model.dtype),F=new Set(c.model.
requiredFeatures??[]);R.some(f=>["fp16","q4f16"].includes(f))&&F.add("shader-f16");for(const f of F)if(!S.features.has(f))
throw new Error(`Model requires unsupported GPU feature: ${f}`);n.adapter={vendor:((I=S.info)==null?void 0:I.vendor)??"",
architecture:((P=S.info)==null?void 0:P.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[...F]};const z=await(m??
(m=e()));if(O(a.signal),z.env.version!==ae)throw new Error("Unexpected Transformers runtime version");const Q=new URL("/\
__peercompute_models/",o);E=ue(d.artifactPort,{manifest:c,baseUrl:new URL(`${i}/`,Q).href,signal:a.signal});const{env:_}=z;
_.logLevel=50,_.allowLocalModels=!0,_.allowRemoteModels=!1,_.localModelPath=Q.pathname,_.useBrowserCache=!1,_.useFSCache=
!1,_.useWasmCache=!1,_.fetch=async(...f)=>{var k;try{return await E.fetch(...f)}catch(y){throw(k=a.emitProgress)==null||
k.call(a,{type:"artifact-read-error",sessionId:i,message:y.message}),y}},_.backends.onnx.wasm.proxy=!1,_.backends.onnx.wasm.
numThreads=1,_.backends.onnx.wasm.wasmPaths=p,n.gpuDispatches=0,n.gpuProfileSamples=0,n.gpuSubmissions=0,n.collectGpuEvidence=
d.collectGpuEvidence===!0,_.backends.onnx.webgpu&&(_.backends.onnx.webgpu.profiling={mode:d.collectGpuEvidence===!0?"def\
ault":"off",ondata:()=>{n.gpuProfileSamples+=1}});const N={local_files_only:!0,device:"webgpu",dtype:c.model.dtype,session_options:{
executionProviders:["webgpu"]},progress_callback:f=>{var k,y;(k=a.signal)!=null&&k.aborted||(y=a.emitProgress)==null||y.
call(a,{type:"model-load",sessionId:i,status:String(f.status??"").slice(0,40),file:typeof f.file=="string"?f.file.slice(
0,512):void 0,loaded:Number.isFinite(f.loaded)?f.loaded:void 0,total:Number.isFinite(f.total)?f.total:void 0})}};n.library=
z,n.gpuGuard=ye(n),await n.gpuGuard.run("load",async()=>{const f=_.backends.onnx.webgpu;if(!f)throw new Error("The WebGP\
U runtime is unavailable");f.adapter=S,n.ownedDevice=await S.requestDevice(_e(S)),n.gpuGuard.attach(n.ownedDevice),N.session_options.
executionProviders=[{name:"webgpu",device:n.ownedDevice}],n.components=await t({library:z,modelPath:i,options:N,manifest:c,
adapterFeatures:[...S.features]}),n.qwenTextRopeCompatibility=me(n.components.model,z);for(const k of F)if(!n.runtimeDevice.
features.has(k))throw new Error(`ORT device is missing required GPU feature: ${k}`);O(a.signal)});const w=n.runtimeDevice;
if(n.runtimeFeatures=[...(w==null?void 0:w.features)??[]],n.collectGpuEvidence&&w){const f=w.createCommandEncoder.bind(w),
k=w.queue.submit.bind(w.queue),y=Object.getOwnPropertyDescriptor(w,"createCommandEncoder"),x=Object.getOwnPropertyDescriptor(
w.queue,"submit");n.restoreGpuEvidence=()=>{y?Object.defineProperty(w,"createCommandEncoder",y):delete w.createCommandEncoder,
x?Object.defineProperty(w.queue,"submit",x):delete w.queue.submit,n.restoreGpuEvidence=null},w.createCommandEncoder=(...j)=>{
const q=f(...j),$=q.beginComputePass.bind(q);return q.beginComputePass=(...Y)=>{const M=$(...Y);for(const T of["dispatch\
Workgroups","dispatchWorkgroupsIndirect"]){const B=M[T].bind(M);M[T]=(...Z)=>{const L=B(...Z);return n.gpuDispatches+=1,
L}}return M},q},w.queue.submit=(...j)=>{const q=k(...j);return n.gpuSubmissions+=1,q}}const U=(w==null?void 0:w.adapterInfo)??
((W=(G=_.backends.onnx.webgpu)==null?void 0:G.adapter)==null?void 0:W.info);if(U){if(U.isFallbackAdapter)throw new Error(
"ORT selected a software GPU adapter");n.runtimeAdapter={vendor:U.vendor,architecture:U.architecture,isFallbackAdapter:U.
isFallbackAdapter??!1}}if(O(a.signal),n.lost)throw n.gpuFailure;return n.status="ready",re(n)}catch(S){try{await te(n),s.
delete(i)}catch(R){n.status="ready",n.lost=!0;const F=new Error(`MODEL_DISPOSE_FAILED: ${R.message}`);throw F.code="MODE\
L_DISPOSE_FAILED",F}throw S}finally{E==null||E.close(),E||d.artifactPort.close()}}async function b(d,a){var _,N,w,U;const i=s.
get(V(d.sessionId));if(!i||i.lost)throw new Error("Model session lost or not loaded");if(i.status!=="ready")throw new Error(
"Model session is busy");const c=V(d.requestId),p=d.maxNewTokens??A.maxNewTokens;if(!Number.isInteger(p)||p<1||p>A.maxNewTokens)
throw new Error("Generation exceeds its output-token budget");let n=he(d);const E=ge(d.image);if(E&&i.manifest.model.task!==
"image-text-to-text")throw new Error("This model does not admit image inputs");O(a.signal);const v=new AbortController,C=new i.
library.InterruptableStoppingCriteria,I=()=>{var f;v.abort((f=a.signal)==null?void 0:f.reason),C.interrupt()};(_=a.signal)==
null||_.addEventListener("abort",I,{once:!0}),v.signal.addEventListener("abort",()=>C.interrupt(),{once:!0}),i.active=v,
i.requestId=c,i.status="generating";let P,G,W=0,S=0,R,F=!1;const z=i.gpuDispatches??0,Q=i.gpuSubmissions??0;try{O(a.signal);
const{tokenizer:f,processor:k,model:y}=i.components;let x;for(;;){O(v.signal);let M=n;if(k&&(M=n.map(L=>({role:L.role,content:[
{type:"text",text:L.content}]})),E)){const L=M.findLast(se=>se.role==="user");if(!L)throw new Error("An image requires a\
 user message");L.content.unshift({type:"image"})}const T=(k??f).apply_chat_template(M,{tokenize:!1,add_generation_prompt:!0,
enable_thinking:!1});if(typeof T!="string"||X(T)>A.maxPromptBytes)throw new Error("Templated prompt exceeds its byte bud\
get");if(E){const L=new i.library.RawImage(E.data,E.width,E.height,E.channels);P=await k(T,L,{do_image_splitting:!1})}else
P=await f(T,{truncation:!1,padding:!1});if(O(v.signal),x=(w=(N=P.input_ids)==null?void 0:N.dims)==null?void 0:w.at(-1),!Number.
isSafeInteger(x)||x<1)throw new Error("Invalid model input token count");if(x+p<=A.maxContextTokens)break;const B=be(n);
if(!B)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten the prompt or requ\
est fewer output tokens");const Z=P;P=void 0,K(Z),n=B,F=!0}O(v.signal);const j=new i.library.TextStreamer(f,{skip_prompt:!0,
skip_special_tokens:!0,callback_function:M=>{var T;if(!(v.signal.aborted||R)){if(S+=X(M),S>A.maxOutputBytes){R=new Error(
"Generated text exceeded its byte budget"),v.abort(R);return}try{if(((T=a.emitProgress)==null?void 0:T.call(a,{type:"tok\
en",sessionId:i.sessionId,requestId:c,sequence:W++,text:M}))===!1)throw new Error("Token consumer rejected output")}catch(B){
R=B,v.abort(B)}}}});if(await i.gpuGuard.run("generation",async()=>{G=await y.generate({...P,max_new_tokens:p,do_sample:!1,
streamer:j,stopping_criteria:[C]})}),R)throw R;if(i.lost)throw i.gpuFailure;O(v.signal);const q=G.tolist();if(q.length!==
1||q[0].length<x||q[0].length>x+p)throw new Error("Model returned an over-budget token sequence");const $=q[0].slice(x),
Y=f.decode($,{skip_special_tokens:!0});if(X(Y)>A.maxOutputBytes)throw new Error("Generated text exceeds its byte budget");
return i.generatedRequests+=1,{sessionId:i.sessionId,requestId:c,text:Y,inputTokens:x,requestedGpuBufferPeakBytes:i.requestedGpuBufferPeakBytes,
outputTokens:$.length,finishReason:Ee(y,$,p),contextTruncated:F,workerId:i.workerId,gpuDispatches:(i.gpuDispatches??0)-z,
gpuSubmissions:(i.gpuSubmissions??0)-Q,gpuProfileSamples:i.gpuProfileSamples??0}}catch(f){throw i.gpuFailure??f}finally{
(U=a.signal)==null||U.removeEventListener("abort",I);try{const f=new Set;let k;for(const y of[P,G])try{K(y,f)}catch(x){k??
(k=x)}if(k){i.lost=!0;const y=i.gpuFailure??new Error("Model session lost: tensor cleanup failed",{cause:k});throw y.code??
(y.code="MODEL_DISPOSE_FAILED"),i.gpuFailure=y,y}}finally{i.active=null,i.requestId=null,i.status="ready"}}}return async function(a={},i={}){
var p;if(u(),a.command==="load")return h(a,i);if(a.command==="generate")return b(a,i);const c=s.get(V(a.sessionId));if(a.
command==="status")return c?re(c):{sessionId:a.sessionId,status:"absent"};if(a.command==="cancel")return(c==null?void 0:
c.requestId)===a.requestId&&((p=c.active)==null||p.abort("Generation cancelled")),{sessionId:a.sessionId,cancellationRequested:!0};
if(a.command==="unload"){if(!c)return{sessionId:a.sessionId,status:"absent"};if(c.status!=="ready")throw new Error("Canc\
el and await active model work before unloading");c.status="unloading";try{await te(c)}catch(n){c.status="ready",c.lost=
!0;const E=new Error(`MODEL_DISPOSE_FAILED: ${n.message}`);throw E.code="MODEL_DISPOSE_FAILED",E}return s.delete(a.sessionId),
{sessionId:a.sessionId,status:"unloaded"}}throw new Error("Unknown model task command")}}const Ie=ve(),Pe=(e,t)=>Ie(e,t);export{ve as createModelTaskRuntime,Pe as handleModelTask,he as normalizeModelMessages,ge as validateImageInput};
