import{M as L,a as V,c as re,d as oe,t as M,e as se,f as ne,g as ie,m as ae}from"./ArtifactReadBridge-BAWOcyZj.js";const X=e=>new TextEncoder().
encode(e).byteLength;function ue(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error(
"Model inference requires a ComputeManager-owned worker")}function ce(e){if(e==null)return null;if(!Number.isSafeInteger(
e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1||e.width*e.height>L.maxImagePixels||e.channels!==4||!(e.
data instanceof Uint8Array||e.data instanceof Uint8ClampedArray)||e.data.byteLength!==e.width*e.height*4||e.data.byteLength>
L.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded files are not accepted");
return e}function de(e){const t=e.messages??(typeof e.prompt=="string"?[{role:"user",content:e.prompt}]:null);if(!Array.
isArray(t)||!t.length||t.length>L.maxMessages)throw new Error("Invalid inference messages");let r=0;return t.map(n=>{if(!n||
!["system","user","assistant"].includes(n.role)||typeof n.content!="string")throw new Error("Only text message content i\
s accepted");if(r+=X(n.content),r>L.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{role:n.role,
content:n.content}})}async function ee(e){var n;if(!e)return;let t;const r=new Set;for(const c of[e.model,e.processor,e.
tokenizer])if(!(!c||r.has(c))){r.add(c);try{await((n=c.dispose)==null?void 0:n.call(c))}catch(f){t??(t=f)}}if(t)throw t}
function H(e,t=new Set){if(!(!e||typeof e!="object"||t.has(e))){if(t.add(e),typeof e.dispose=="function"){e.dispose();return}
for(const r of Object.values(e))H(r,t)}}function le(e){const t=e.findIndex(n=>n.role==="user");if(t<0)return null;const r=e.
findIndex((n,c)=>c>t&&n.role==="user");return r<0?null:e.filter((n,c)=>c<t||c>=r||n.role==="system")}function fe(e,t,r){
const n={...e.config};for(const o of["decoder","generator","text_config"])Object.assign(n,n[o]);Object.assign(n,e.generation_config);
const c=Array.isArray(n.eos_token_id)?n.eos_token_id:[n.eos_token_id],f=t.at(-1),k=o=>typeof o=="bigint"||Number.isSafeInteger(
o)&&o>=0;return k(f)&&c.some(o=>k(o)&&BigInt(o)===BigInt(f))?"stop":t.length>=r?"length":"unknown"}function O(e,t,r){const n=e===
"out-of-memory"?"GPU out of memory. Close GPU-heavy apps or unload other models, then reload this model.":`GPU ${e}: ${String(
(t==null?void 0:t.message)??t??"operation failed").slice(0,240)}`,c=new Error(`Model session lost: ${r} ${n}`,{cause:t});
return c.code=e==="out-of-memory"?"ERR_MODEL_GPU_OUT_OF_MEMORY":"ERR_MODEL_GPU",c}function pe(e){let t,r,n=!1;const c=o=>{
var y;n||(e.lost=!0,(!e.gpuFailure||o.code==="ERR_MODEL_GPU_OUT_OF_MEMORY")&&(e.gpuFailure=o),(y=e.active)==null||y.abort(
o))},f=({error:o})=>{var y;return c(O(((y=o==null?void 0:o.constructor)==null?void 0:y.name)==="GPUOutOfMemoryError"?"ou\
t-of-memory":"uncaptured error",o,(r==null?void 0:r.stage)??"resident model"))},k=()=>{if(!(!r||r.device)){r.device=t;for(const o of[
"validation","out-of-memory","internal"])t.pushErrorScope(o),r.filters.push(o)}};return{attach(o){var y,w;if(t&&t!==o)throw O(
"device changed",null,"load");if(!t){if(!o||typeof o.pushErrorScope!="function"||typeof o.popErrorScope!="function"||typeof((y=
o.queue)==null?void 0:y.onSubmittedWorkDone)!="function"||typeof o.addEventListener!="function"||typeof o.removeEventListener!=
"function"||typeof o.destroy!="function"||typeof((w=o.lost)==null?void 0:w.then)!="function")throw O("device unavailable",
null,"load");t=o,e.runtimeDevice=t,t.addEventListener("uncapturederror",f),t.lost.then(D=>c(O("device lost",D,(r==null?void 0:
r.stage)??"resident model")),D=>c(O("device lost",D,(r==null?void 0:r.stage)??"resident model")))}try{k()}catch(D){const d=O(
"error scope failure",D,(r==null?void 0:r.stage)??"load");throw c(d),d}},async run(o,y){if(e.lost)throw e.gpuFailure??O(
"device lost",null,o);if(r)throw new Error("Overlapping model GPU operations are not allowed");const w={stage:o,filters:[],
device:null};r=w;let D,d;try{if(t&&this.attach(t),D=await y(),!t)throw O("device unavailable",null,o)}catch(a){d=a}if(t)
try{await t.queue.onSubmittedWorkDone()}catch(a){c(O("queue failure",a,o))}const i=await Promise.all(w.filters.reverse().
map(async a=>{try{return{filter:a,error:await w.device.popErrorScope()}}catch(g){return{filter:a,error:g,scopeFailed:!0}}}));
r=null;for(const a of i)a.scopeFailed&&c(O("error scope failure",a.error,o));const s=["out-of-memory","internal","valida\
tion"].map(a=>i.find(g=>g.filter===a&&g.error&&!g.scopeFailed)).find(Boolean);if(s&&c(O(s.filter,s.error,o)),d instanceof
WebAssembly.RuntimeError||/^failed to call OrtRun\(\)\./.test((d==null?void 0:d.message)??"")){const a=new Error("Model \
session lost: native inference runtime failed",{cause:d});a.code="ERR_MODEL_RUNTIME",c(a)}if(typeof(d==null?void 0:d.code)==
"string"&&d.code.startsWith("ERR_MODEL_GPU")&&c(d),e.gpuFailure)throw e.gpuFailure;if(d)throw d;return D},dispose(){n=!0,
t==null||t.removeEventListener("uncapturederror",f)}}}function me(e){var c;const t=["maxBindGroups","maxComputeWorkgroup\
StorageSize","maxComputeWorkgroupsPerDimension","maxStorageBuffersPerShaderStage","maxStorageBufferBindingSize","maxBuff\
erSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSi\
zeZ"],r={};for(const f of t){const k=(c=e.limits)==null?void 0:c[f];if(!Number.isSafeInteger(k)||k<=0)throw new Error(`W\
ebGPU adapter has an invalid ${f} limit`);r[f]=k}const n=["chromium-experimental-subgroup-matrix","timestamp-query","sha\
der-f16","subgroups","subgroup-size-control"].filter(f=>e.features.has(f));return{requiredLimits:r,requiredFeatures:n}}async function J(e){
var t,r,n;await ee(e.components),(t=e.restoreGpuEvidence)==null||t.call(e),(r=e.gpuGuard)==null||r.dispose(),(n=e.ownedDevice)==
null||n.destroy(),e.ownedDevice=null}async function we({library:e,modelPath:t,options:r,manifest:n,adapterFeatures:c=[]}){
const f={};try{const k=await e.AutoConfig.from_pretrained(t,r),o=ie(n.model,k);for(const w of o)if(!c.includes(w))throw new Error(
`Model config requires unsupported GPU feature: ${w}`);const y={...r,config:k};if(n.model.architecture==="qwen3_5"&&(y.use_external_data_format=
1),n.model.task==="image-text-to-text"){if(f.processor=await e.AutoProcessor.from_pretrained(t,r),n.model.architecture===
"qwen3_5"){const w=f.processor.image_processor;if(!w)throw new Error("Qwen3.5 image processor is unavailable");w.min_pixels=
256*256,w.max_pixels=ae(n.model).maxProcessedImagePixels,w.do_normalize??(w.do_normalize=!0)}f.tokenizer=f.processor.tokenizer,
f.model=await e.AutoModelForImageTextToText.from_pretrained(t,y)}else f.tokenizer=await e.AutoTokenizer.from_pretrained(
t,r),f.model=await e.AutoModelForCausalLM.from_pretrained(t,y);return f}catch(k){throw await ee(f),k}}function K(e){return{
sessionId:e.sessionId,manifestCid:e.manifestCid,status:e.lost?"lost":e.status,task:e.manifest.model.task,dtype:e.manifest.
model.dtype,workerId:e.workerId,adapter:e.adapter,runtimeAdapter:e.runtimeAdapter??null,gpuDispatches:e.gpuDispatches??0,
gpuSubmissions:e.gpuSubmissions??0,gpuProfileSamples:e.gpuProfileSamples??0,collectGpuEvidence:e.collectGpuEvidence===!0,
runtimeFeatures:e.runtimeFeatures??[],generatedRequests:e.generatedRequests}}function ge({loadLibrary:e=()=>import("./transformers.web-C7Eqzws9.js"),
loadModel:t=we,gpu:r=(f=>(f=globalThis.navigator)==null?void 0:f.gpu)(),baseUrl:n=(k=>(k=globalThis.location)==null?void 0:
k.href)(),assertWorker:c=ue}={}){const o=new Map;let y;async function w(d,i){var I,T,z,x,U,j;if(o.size)throw new Error("\
This inference worker already has a resident/loading model");const s=V(d.sessionId),{manifest:a}=re(d.manifest),g=oe(d.runtimeAssets,
n);if(!((I=d.artifactPort)!=null&&I.postMessage))throw new Error("An artifact reader port is required");M(i.signal);const u={
sessionId:s,manifest:a,manifestCid:d.manifestCid,status:"loading",workerId:i.workerId??null,generatedRequests:0,components:null};
o.set(s,u);let E;try{const _=await(r==null?void 0:r.requestAdapter({powerPreference:"high-performance"}));if(M(i.signal),
!_||(T=_.info)!=null&&T.isFallbackAdapter||_.isFallbackAdapter)throw new Error("A hardware WebGPU adapter is required; C\
PU/software fallback is disabled");const q=typeof a.model.dtype=="string"?[a.model.dtype]:Object.values(a.model.dtype),F=new Set(
a.model.requiredFeatures??[]);q.some(l=>["fp16","q4f16"].includes(l))&&F.add("shader-f16");for(const l of F)if(!_.features.
has(l))throw new Error(`Model requires unsupported GPU feature: ${l}`);u.adapter={vendor:((z=_.info)==null?void 0:z.vendor)??
"",architecture:((x=_.info)==null?void 0:x.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[...F]};const W=await(y??
(y=e()));if(M(i.signal),W.env.version!==se)throw new Error("Unexpected Transformers runtime version");const Y=new URL("/\
__peercompute_models/",n);E=ne(d.artifactPort,{manifest:a,baseUrl:new URL(`${s}/`,Y).href,signal:i.signal});const{env:h}=W;
h.logLevel=50,h.allowLocalModels=!0,h.allowRemoteModels=!1,h.localModelPath=Y.pathname,h.useBrowserCache=!1,h.useFSCache=
!1,h.useWasmCache=!1,h.fetch=async(...l)=>{var b;try{return await E.fetch(...l)}catch(m){throw(b=i.emitProgress)==null||
b.call(i,{type:"artifact-read-error",sessionId:s,message:m.message}),m}},h.backends.onnx.wasm.proxy=!1,h.backends.onnx.wasm.
numThreads=1,h.backends.onnx.wasm.wasmPaths=g,u.gpuDispatches=0,u.gpuProfileSamples=0,u.gpuSubmissions=0,u.collectGpuEvidence=
d.collectGpuEvidence===!0,h.backends.onnx.webgpu&&(h.backends.onnx.webgpu.profiling={mode:d.collectGpuEvidence===!0?"def\
ault":"off",ondata:()=>{u.gpuProfileSamples+=1}});const B={local_files_only:!0,device:"webgpu",dtype:a.model.dtype,session_options:{
executionProviders:["webgpu"]},progress_callback:l=>{var b,m;(b=i.signal)!=null&&b.aborted||(m=i.emitProgress)==null||m.
call(i,{type:"model-load",sessionId:s,status:String(l.status??"").slice(0,40),file:typeof l.file=="string"?l.file.slice(
0,512):void 0,loaded:Number.isFinite(l.loaded)?l.loaded:void 0,total:Number.isFinite(l.total)?l.total:void 0})}};u.library=
W,u.gpuGuard=pe(u),await u.gpuGuard.run("load",async()=>{const l=h.backends.onnx.webgpu;if(!l)throw new Error("The WebGP\
U runtime is unavailable");l.adapter=_,u.ownedDevice=await _.requestDevice(me(_)),u.gpuGuard.attach(u.ownedDevice),B.session_options.
executionProviders=[{name:"webgpu",device:u.ownedDevice}],u.components=await t({library:W,modelPath:s,options:B,manifest:a,
adapterFeatures:[..._.features]});for(const b of F)if(!u.runtimeDevice.features.has(b))throw new Error(`ORT device is mi\
ssing required GPU feature: ${b}`);M(i.signal)});const p=u.runtimeDevice;if(u.runtimeFeatures=[...(p==null?void 0:p.features)??
[]],u.collectGpuEvidence&&p){const l=p.createCommandEncoder.bind(p),b=p.queue.submit.bind(p.queue),m=Object.getOwnPropertyDescriptor(
p,"createCommandEncoder"),v=Object.getOwnPropertyDescriptor(p.queue,"submit");u.restoreGpuEvidence=()=>{m?Object.defineProperty(
p,"createCommandEncoder",m):delete p.createCommandEncoder,v?Object.defineProperty(p.queue,"submit",v):delete p.queue.submit,
u.restoreGpuEvidence=null},p.createCommandEncoder=(...N)=>{const S=l(...N),$=S.beginComputePass.bind(S);return S.beginComputePass=
(...Q)=>{const P=$(...Q);for(const G of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const C=P[G].bind(P);P[G]=(...Z)=>{
const A=C(...Z);return u.gpuDispatches+=1,A}}return P},S},p.queue.submit=(...N)=>{const S=b(...N);return u.gpuSubmissions+=
1,S}}const R=(p==null?void 0:p.adapterInfo)??((j=(U=h.backends.onnx.webgpu)==null?void 0:U.adapter)==null?void 0:j.info);
if(R){if(R.isFallbackAdapter)throw new Error("ORT selected a software GPU adapter");u.runtimeAdapter={vendor:R.vendor,architecture:R.
architecture,isFallbackAdapter:R.isFallbackAdapter??!1}}if(M(i.signal),u.lost)throw u.gpuFailure;return u.status="ready",
K(u)}catch(_){try{await J(u),o.delete(s)}catch(q){u.status="ready",u.lost=!0;const F=new Error(`MODEL_DISPOSE_FAILED: ${q.
message}`);throw F.code="MODEL_DISPOSE_FAILED",F}throw _}finally{E==null||E.close(),E||d.artifactPort.close()}}async function D(d,i){
var h,B,p,R;const s=o.get(V(d.sessionId));if(!s||s.lost)throw new Error("Model session lost or not loaded");if(s.status!==
"ready")throw new Error("Model session is busy");const a=V(d.requestId),g=d.maxNewTokens??L.maxNewTokens;if(!Number.isInteger(
g)||g<1||g>L.maxNewTokens)throw new Error("Generation exceeds its output-token budget");let u=de(d);const E=ce(d.image);
if(E&&s.manifest.model.task!=="image-text-to-text")throw new Error("This model does not admit image inputs");M(i.signal);
const I=new AbortController,T=new s.library.InterruptableStoppingCriteria,z=()=>{var l;I.abort((l=i.signal)==null?void 0:
l.reason),T.interrupt()};(h=i.signal)==null||h.addEventListener("abort",z,{once:!0}),I.signal.addEventListener("abort",()=>T.
interrupt(),{once:!0}),s.active=I,s.requestId=a,s.status="generating";let x,U,j=0,_=0,q,F=!1;const W=s.gpuDispatches??0,
Y=s.gpuSubmissions??0;try{M(i.signal);const{tokenizer:l,processor:b,model:m}=s.components;let v;for(;;){M(I.signal);let P=u;
if(b&&(P=u.map(A=>({role:A.role,content:[{type:"text",text:A.content}]})),E)){const A=P.findLast(te=>te.role==="user");if(!A)
throw new Error("An image requires a user message");A.content.unshift({type:"image"})}const G=(b??l).apply_chat_template(
P,{tokenize:!1,add_generation_prompt:!0,enable_thinking:!1});if(typeof G!="string"||X(G)>L.maxPromptBytes)throw new Error(
"Templated prompt exceeds its byte budget");if(E){const A=new s.library.RawImage(E.data,E.width,E.height,E.channels);x=await b(
G,A,{do_image_splitting:!1})}else x=await l(G,{truncation:!1,padding:!1});if(M(I.signal),v=(p=(B=x.input_ids)==null?void 0:
B.dims)==null?void 0:p.at(-1),!Number.isSafeInteger(v)||v<1)throw new Error("Invalid model input token count");if(v+g<=L.
maxContextTokens)break;const C=le(u);if(!C)throw new Error("Latest prompt/image and system instructions exceed the conte\
xt budget; shorten the prompt or request fewer output tokens");const Z=x;x=void 0,H(Z),u=C,F=!0}M(I.signal);const N=new s.
library.TextStreamer(l,{skip_prompt:!0,skip_special_tokens:!0,callback_function:P=>{var G;if(!(I.signal.aborted||q)){if(_+=
X(P),_>L.maxOutputBytes){q=new Error("Generated text exceeded its byte budget"),I.abort(q);return}try{if(((G=i.emitProgress)==
null?void 0:G.call(i,{type:"token",sessionId:s.sessionId,requestId:a,sequence:j++,text:P}))===!1)throw new Error("Token \
consumer rejected output")}catch(C){q=C,I.abort(C)}}}});if(await s.gpuGuard.run("generation",async()=>{U=await m.generate(
{...x,max_new_tokens:g,do_sample:!1,streamer:N,stopping_criteria:[T]})}),q)throw q;if(s.lost)throw s.gpuFailure;M(I.signal);
const S=U.tolist();if(S.length!==1||S[0].length<v||S[0].length>v+g)throw new Error("Model returned an over-budget token \
sequence");const $=S[0].slice(v),Q=l.decode($,{skip_special_tokens:!0});if(X(Q)>L.maxOutputBytes)throw new Error("Genera\
ted text exceeds its byte budget");return s.generatedRequests+=1,{sessionId:s.sessionId,requestId:a,text:Q,inputTokens:v,
outputTokens:$.length,finishReason:fe(m,$,g),contextTruncated:F,workerId:s.workerId,gpuDispatches:(s.gpuDispatches??0)-W,
gpuSubmissions:(s.gpuSubmissions??0)-Y,gpuProfileSamples:s.gpuProfileSamples??0}}catch(l){throw s.gpuFailure??l}finally{
(R=i.signal)==null||R.removeEventListener("abort",z);try{const l=new Set;let b;for(const m of[x,U])try{H(m,l)}catch(v){b??
(b=v)}if(b){s.lost=!0;const m=s.gpuFailure??new Error("Model session lost: tensor cleanup failed",{cause:b});throw m.code??
(m.code="MODEL_DISPOSE_FAILED"),s.gpuFailure=m,m}}finally{s.active=null,s.requestId=null,s.status="ready"}}}return async function(i={},s={}){
var g;if(c(),i.command==="load")return w(i,s);if(i.command==="generate")return D(i,s);const a=o.get(V(i.sessionId));if(i.
command==="status")return a?K(a):{sessionId:i.sessionId,status:"absent"};if(i.command==="cancel")return(a==null?void 0:a.
requestId)===i.requestId&&((g=a.active)==null||g.abort("Generation cancelled")),{sessionId:i.sessionId,cancellationRequested:!0};
if(i.command==="unload"){if(!a)return{sessionId:i.sessionId,status:"absent"};if(a.status!=="ready")throw new Error("Canc\
el and await active model work before unloading");a.status="unloading";try{await J(a)}catch(u){a.status="ready",a.lost=!0;
const E=new Error(`MODEL_DISPOSE_FAILED: ${u.message}`);throw E.code="MODEL_DISPOSE_FAILED",E}return o.delete(i.sessionId),
{sessionId:i.sessionId,status:"unloaded"}}throw new Error("Unknown model task command")}}const he=ge(),Ee=(e,t)=>he(e,t);export{ge as createModelTaskRuntime,Ee as handleModelTask,de as normalizeModelMessages,ce as validateImageInput};
