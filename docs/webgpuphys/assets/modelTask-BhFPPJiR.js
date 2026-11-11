import{M as G,a as V,f as se,e as ie,t as O,g as ae,d as ue,h as ce,m as de}from"./ArtifactReadBridge-COO86mrc.js";const le="\
4.3.2",fe=new Set(["qwen3_5","qwen3_5_text"]),H=new WeakMap,J="_get_text_only_rope_index";function ee(e,t,r){var l,g,s,m;
const[n,u]=e??[];if((n==null?void 0:n.type)!=="int64"||(u==null?void 0:u.type)!=="int64"||((l=n.dims)==null?void 0:l.length)!==
3||n.dims[0]!==3||n.dims[1]!==t||n.dims[2]!==r||((g=u.dims)==null?void 0:g.length)!==2||u.dims[0]!==t||u.dims[1]!==1||((s=
n.data)==null?void 0:s.length)!==3*t*r||((m=u.data)==null?void 0:m.length)!==t)throw new Error("Unsupported Qwen text po\
sition result");return{positions:n,deltas:u}}function pe(e,t){var s,m,h;if(((s=t==null?void 0:t.env)==null?void 0:s.version)!==
le||!fe.has((m=e==null?void 0:e.config)==null?void 0:m.model_type))return!1;if(H.has(e)){if(e[J]!==H.get(e))throw new Error(
"Qwen text position compatibility was replaced");return!0}const r=e[J];if(typeof r!="function"||typeof t.Tensor!="functi\
on")throw new Error("Qwen text position compatibility is unavailable");const n=new t.Tensor("int64",[10n,11n],[1,2]),u=new t.
Tensor("int64",[1n,1n],[1,2]);let l;try{l=r.call(e,n,u);const{positions:b,deltas:d}=ee(l,1,2);if([...b.data].some((a,i)=>a!==
BigInt(i%2)))throw new Error("Unsupported Qwen text position calculation");if(d.data[0]===0n)return!1;if(d.data[0]!==4n)
throw new Error("Unsupported Qwen text position offset")}finally{for(const b of new Set([n,u,...Array.isArray(l)?l:[]]))
(h=b==null?void 0:b.dispose)==null||h.call(b)}function g(b,d){var i,c;const a=r.call(this,b,d);if(!d)return a;try{const[
p,o]=d.dims??[];if(((i=d.dims)==null?void 0:i.length)!==2||!Number.isSafeInteger(p)||p<1||!Number.isSafeInteger(o)||o<1)
throw new Error("Invalid Qwen text position dimensions");const{positions:E,deltas:I}=ee(a,p,o);for(let v=0;v<p;v++){let x=E.
data[v*o];for(let F=1;F<o;F++){const B=E.data[v*o+F];B>x&&(x=B)}if(I.data[v]!==x+1n+BigInt(o))throw new Error("Qwen text\
 position behavior changed")}const C=2n*BigInt(o);for(let v=0;v<p;v++)I.data[v]-=C;return a}catch(p){for(const o of new Set(
Array.isArray(a)?a:[]))(c=o==null?void 0:o.dispose)==null||c.call(o);throw p}}return Object.defineProperty(e,J,{value:g,
configurable:!0,writable:!0}),H.set(e,g),!0}const X=e=>new TextEncoder().encode(e).byteLength;function me(){if(typeof WorkerGlobalScope>
"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}
function we(e){if(e==null)return null;if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<
1||e.width*e.height>G.maxImagePixels||e.channels!==4||!(e.data instanceof Uint8Array||e.data instanceof Uint8ClampedArray)||
e.data.byteLength!==e.width*e.height*4||e.data.byteLength>G.maxImageBytes)throw new Error("Image must contain bounded RG\
BA pixels; image URLs and encoded files are not accepted");return e}function ge(e){const t=e.messages??(typeof e.prompt==
"string"?[{role:"user",content:e.prompt}]:null);if(!Array.isArray(t)||!t.length||t.length>G.maxMessages)throw new Error(
"Invalid inference messages");let r=0;return t.map(n=>{if(!n||!["system","user","assistant"].includes(n.role)||typeof n.
content!="string")throw new Error("Only text message content is accepted");if(r+=X(n.content),r>G.maxPromptBytes)throw new Error(
"Prompt exceeds its byte budget");return{role:n.role,content:n.content}})}async function oe(e){var n;if(!e)return;let t;
const r=new Set;for(const u of[e.model,e.processor,e.tokenizer])if(!(!u||r.has(u))){r.add(u);try{await((n=u.dispose)==null?
void 0:n.call(u))}catch(l){t??(t=l)}}if(t)throw t}function K(e,t=new Set){if(!(!e||typeof e!="object"||t.has(e))){if(t.add(
e),typeof e.dispose=="function"){e.dispose();return}for(const r of Object.values(e))K(r,t)}}function he(e){const t=e.findIndex(
n=>n.role==="user");if(t<0)return null;const r=e.findIndex((n,u)=>u>t&&n.role==="user");return r<0?null:e.filter((n,u)=>u<
t||u>=r||n.role==="system")}function be(e,t,r){const n={...e.config};for(const s of["decoder","generator","text_config"])
Object.assign(n,n[s]);Object.assign(n,e.generation_config);const u=Array.isArray(n.eos_token_id)?n.eos_token_id:[n.eos_token_id],
l=t.at(-1),g=s=>typeof s=="bigint"||Number.isSafeInteger(s)&&s>=0;return g(l)&&u.some(s=>g(s)&&BigInt(s)===BigInt(l))?"s\
top":t.length>=r?"length":"unknown"}function D(e,t,r){const n=e==="out-of-memory"?"GPU out of memory. Close GPU-heavy ap\
ps or unload other models, then reload this model.":`GPU ${e}: ${String((t==null?void 0:t.message)??t??"operation failed").
slice(0,240)}`,u=new Error(`Model session lost: ${r} ${n}`,{cause:t});return u.code=e==="out-of-memory"?"ERR_MODEL_GPU_O\
UT_OF_MEMORY":"ERR_MODEL_GPU",u}function Ee(e){let t,r,n=!1;const u=s=>{var m;n||(e.lost=!0,(!e.gpuFailure||s.code==="ER\
R_MODEL_GPU_OUT_OF_MEMORY")&&(e.gpuFailure=s),(m=e.active)==null||m.abort(s))},l=({error:s})=>{var m;return u(D(((m=s==null?
void 0:s.constructor)==null?void 0:m.name)==="GPUOutOfMemoryError"?"out-of-memory":"uncaptured error",s,(r==null?void 0:
r.stage)??"resident model"))},g=()=>{if(!(!r||r.device)){r.device=t;for(const s of["validation","out-of-memory","interna\
l"])t.pushErrorScope(s),r.filters.push(s)}};return{attach(s){var m,h;if(t&&t!==s)throw D("device changed",null,"load");if(!t){
if(!s||typeof s.pushErrorScope!="function"||typeof s.popErrorScope!="function"||typeof((m=s.queue)==null?void 0:m.onSubmittedWorkDone)!=
"function"||typeof s.addEventListener!="function"||typeof s.removeEventListener!="function"||typeof s.destroy!="function"||
typeof((h=s.lost)==null?void 0:h.then)!="function")throw D("device unavailable",null,"load");t=s,e.runtimeDevice=t,t.addEventListener(
"uncapturederror",l),t.lost.then(b=>u(D("device lost",b,(r==null?void 0:r.stage)??"resident model")),b=>u(D("device lost",
b,(r==null?void 0:r.stage)??"resident model")))}try{g()}catch(b){const d=D("error scope failure",b,(r==null?void 0:r.stage)??
"load");throw u(d),d}},async run(s,m){if(e.lost)throw e.gpuFailure??D("device lost",null,s);if(r)throw new Error("Overla\
pping model GPU operations are not allowed");const h={stage:s,filters:[],device:null};r=h;let b,d;try{if(t&&this.attach(
t),b=await m(),!t)throw D("device unavailable",null,s)}catch(c){d=c}if(t)try{await t.queue.onSubmittedWorkDone()}catch(c){
u(D("queue failure",c,s))}const a=await Promise.all(h.filters.reverse().map(async c=>{try{return{filter:c,error:await h.
device.popErrorScope()}}catch(p){return{filter:c,error:p,scopeFailed:!0}}}));r=null;for(const c of a)c.scopeFailed&&u(D(
"error scope failure",c.error,s));const i=["out-of-memory","internal","validation"].map(c=>a.find(p=>p.filter===c&&p.error&&
!p.scopeFailed)).find(Boolean);if(i&&u(D(i.filter,i.error,s)),d instanceof WebAssembly.RuntimeError||/^failed to call OrtRun\(\)\./.
test((d==null?void 0:d.message)??"")){const c=new Error("Model session lost: native inference runtime failed",{cause:d});
c.code="ERR_MODEL_RUNTIME",u(c)}if(typeof(d==null?void 0:d.code)=="string"&&d.code.startsWith("ERR_MODEL_GPU")&&u(d),e.gpuFailure)
throw e.gpuFailure;if(d)throw d;return b},dispose(){n=!0,t==null||t.removeEventListener("uncapturederror",l)}}}function ye(e){
var u;const t=["maxBindGroups","maxComputeWorkgroupStorageSize","maxComputeWorkgroupsPerDimension","maxStorageBuffersPer\
ShaderStage","maxStorageBufferBindingSize","maxBufferSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX",
"maxComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ"],r={};for(const l of t){const g=(u=e.limits)==null?void 0:u[l];if(!Number.
isSafeInteger(g)||g<=0)throw new Error(`WebGPU adapter has an invalid ${l} limit`);r[l]=g}const n=["chromium-experimenta\
l-subgroup-matrix","timestamp-query","shader-f16","subgroups","subgroup-size-control"].filter(l=>e.features.has(l));return{
requiredLimits:r,requiredFeatures:n}}async function te(e){var t,r,n;await oe(e.components),(t=e.restoreGpuEvidence)==null||
t.call(e),(r=e.gpuGuard)==null||r.dispose(),(n=e.ownedDevice)==null||n.destroy(),e.ownedDevice=null}async function _e({library:e,
modelPath:t,options:r,manifest:n,adapterFeatures:u=[]}){const l={};try{const g=await e.AutoConfig.from_pretrained(t,r),s=ce(
n.model,g);for(const h of s)if(!u.includes(h))throw new Error(`Model config requires unsupported GPU feature: ${h}`);const m={
...r,config:g};if(n.model.architecture==="qwen3_5"&&(m.use_external_data_format=1),n.model.task==="image-text-to-text"){
if(l.processor=await e.AutoProcessor.from_pretrained(t,r),n.model.architecture==="qwen3_5"){const h=l.processor.image_processor;
if(!h)throw new Error("Qwen3.5 image processor is unavailable");h.min_pixels=256*256,h.max_pixels=de(n.model).maxProcessedImagePixels,
h.do_normalize??(h.do_normalize=!0)}l.tokenizer=l.processor.tokenizer,l.model=await e.AutoModelForImageTextToText.from_pretrained(
t,m)}else l.tokenizer=await e.AutoTokenizer.from_pretrained(t,r),l.model=await e.AutoModelForCausalLM.from_pretrained(t,
m);return l}catch(g){throw await oe(l),g}}function re(e){return{sessionId:e.sessionId,manifestCid:e.manifestCid,status:e.
lost?"lost":e.status,task:e.manifest.model.task,dtype:e.manifest.model.dtype,workerId:e.workerId,adapter:e.adapter,runtimeAdapter:e.
runtimeAdapter??null,gpuDispatches:e.gpuDispatches??0,gpuSubmissions:e.gpuSubmissions??0,gpuProfileSamples:e.gpuProfileSamples??
0,collectGpuEvidence:e.collectGpuEvidence===!0,runtimeFeatures:e.runtimeFeatures??[],generatedRequests:e.generatedRequests,
qwenTextRopeCompatibility:e.qwenTextRopeCompatibility===!0}}function ke({loadLibrary:e=()=>import("./transformers.web-Bm4U2WqP.js"),
loadModel:t=_e,gpu:r=(l=>(l=globalThis.navigator)==null?void 0:l.gpu)(),baseUrl:n=(g=>(g=globalThis.location)==null?void 0:
g.href)(),assertWorker:u=me}={}){const s=new Map;let m;async function h(d,a){var I,C,v,x,F,B;if(s.size)throw new Error("\
This inference worker already has a resident/loading model");const i=V(d.sessionId),{manifest:c}=se(d.manifest),p=ie(d.runtimeAssets,
n);if(!((I=d.artifactPort)!=null&&I.postMessage))throw new Error("An artifact reader port is required");O(a.signal);const o={
sessionId:i,manifest:c,manifestCid:d.manifestCid,status:"loading",workerId:a.workerId??null,generatedRequests:0,components:null};
s.set(i,o);let E;try{const S=await(r==null?void 0:r.requestAdapter({powerPreference:"high-performance"}));if(O(a.signal),
!S||(C=S.info)!=null&&C.isFallbackAdapter||S.isFallbackAdapter)throw new Error("A hardware WebGPU adapter is required; C\
PU/software fallback is disabled");const T=typeof c.model.dtype=="string"?[c.model.dtype]:Object.values(c.model.dtype),A=new Set(
c.model.requiredFeatures??[]);T.some(f=>["fp16","q4f16"].includes(f))&&A.add("shader-f16");for(const f of A)if(!S.features.
has(f))throw new Error(`Model requires unsupported GPU feature: ${f}`);o.adapter={vendor:((v=S.info)==null?void 0:v.vendor)??
"",architecture:((x=S.info)==null?void 0:x.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[...A]};const z=await(m??
(m=e()));if(O(a.signal),z.env.version!==ae)throw new Error("Unexpected Transformers runtime version");const Q=new URL("/\
__peercompute_models/",n);E=ue(d.artifactPort,{manifest:c,baseUrl:new URL(`${i}/`,Q).href,signal:a.signal});const{env:_}=z;
_.logLevel=50,_.allowLocalModels=!0,_.allowRemoteModels=!1,_.localModelPath=Q.pathname,_.useBrowserCache=!1,_.useFSCache=
!1,_.useWasmCache=!1,_.fetch=async(...f)=>{var k;try{return await E.fetch(...f)}catch(y){throw(k=a.emitProgress)==null||
k.call(a,{type:"artifact-read-error",sessionId:i,message:y.message}),y}},_.backends.onnx.wasm.proxy=!1,_.backends.onnx.wasm.
numThreads=1,_.backends.onnx.wasm.wasmPaths=p,o.gpuDispatches=0,o.gpuProfileSamples=0,o.gpuSubmissions=0,o.collectGpuEvidence=
d.collectGpuEvidence===!0,_.backends.onnx.webgpu&&(_.backends.onnx.webgpu.profiling={mode:d.collectGpuEvidence===!0?"def\
ault":"off",ondata:()=>{o.gpuProfileSamples+=1}});const N={local_files_only:!0,device:"webgpu",dtype:c.model.dtype,session_options:{
executionProviders:["webgpu"]},progress_callback:f=>{var k,y;(k=a.signal)!=null&&k.aborted||(y=a.emitProgress)==null||y.
call(a,{type:"model-load",sessionId:i,status:String(f.status??"").slice(0,40),file:typeof f.file=="string"?f.file.slice(
0,512):void 0,loaded:Number.isFinite(f.loaded)?f.loaded:void 0,total:Number.isFinite(f.total)?f.total:void 0})}};o.library=
z,o.gpuGuard=Ee(o),await o.gpuGuard.run("load",async()=>{const f=_.backends.onnx.webgpu;if(!f)throw new Error("The WebGP\
U runtime is unavailable");f.adapter=S,o.ownedDevice=await S.requestDevice(ye(S)),o.gpuGuard.attach(o.ownedDevice),N.session_options.
executionProviders=[{name:"webgpu",device:o.ownedDevice}],o.components=await t({library:z,modelPath:i,options:N,manifest:c,
adapterFeatures:[...S.features]}),o.qwenTextRopeCompatibility=pe(o.components.model,z);for(const k of A)if(!o.runtimeDevice.
features.has(k))throw new Error(`ORT device is missing required GPU feature: ${k}`);O(a.signal)});const w=o.runtimeDevice;
if(o.runtimeFeatures=[...(w==null?void 0:w.features)??[]],o.collectGpuEvidence&&w){const f=w.createCommandEncoder.bind(w),
k=w.queue.submit.bind(w.queue),y=Object.getOwnPropertyDescriptor(w,"createCommandEncoder"),P=Object.getOwnPropertyDescriptor(
w.queue,"submit");o.restoreGpuEvidence=()=>{y?Object.defineProperty(w,"createCommandEncoder",y):delete w.createCommandEncoder,
P?Object.defineProperty(w.queue,"submit",P):delete w.queue.submit,o.restoreGpuEvidence=null},w.createCommandEncoder=(...j)=>{
const q=f(...j),$=q.beginComputePass.bind(q);return q.beginComputePass=(...Y)=>{const M=$(...Y);for(const R of["dispatch\
Workgroups","dispatchWorkgroupsIndirect"]){const W=M[R].bind(M);M[R]=(...Z)=>{const L=W(...Z);return o.gpuDispatches+=1,
L}}return M},q},w.queue.submit=(...j)=>{const q=k(...j);return o.gpuSubmissions+=1,q}}const U=(w==null?void 0:w.adapterInfo)??
((B=(F=_.backends.onnx.webgpu)==null?void 0:F.adapter)==null?void 0:B.info);if(U){if(U.isFallbackAdapter)throw new Error(
"ORT selected a software GPU adapter");o.runtimeAdapter={vendor:U.vendor,architecture:U.architecture,isFallbackAdapter:U.
isFallbackAdapter??!1}}if(O(a.signal),o.lost)throw o.gpuFailure;return o.status="ready",re(o)}catch(S){try{await te(o),s.
delete(i)}catch(T){o.status="ready",o.lost=!0;const A=new Error(`MODEL_DISPOSE_FAILED: ${T.message}`);throw A.code="MODE\
L_DISPOSE_FAILED",A}throw S}finally{E==null||E.close(),E||d.artifactPort.close()}}async function b(d,a){var _,N,w,U;const i=s.
get(V(d.sessionId));if(!i||i.lost)throw new Error("Model session lost or not loaded");if(i.status!=="ready")throw new Error(
"Model session is busy");const c=V(d.requestId),p=d.maxNewTokens??G.maxNewTokens;if(!Number.isInteger(p)||p<1||p>G.maxNewTokens)
throw new Error("Generation exceeds its output-token budget");let o=ge(d);const E=we(d.image);if(E&&i.manifest.model.task!==
"image-text-to-text")throw new Error("This model does not admit image inputs");O(a.signal);const I=new AbortController,C=new i.
library.InterruptableStoppingCriteria,v=()=>{var f;I.abort((f=a.signal)==null?void 0:f.reason),C.interrupt()};(_=a.signal)==
null||_.addEventListener("abort",v,{once:!0}),I.signal.addEventListener("abort",()=>C.interrupt(),{once:!0}),i.active=I,
i.requestId=c,i.status="generating";let x,F,B=0,S=0,T,A=!1;const z=i.gpuDispatches??0,Q=i.gpuSubmissions??0;try{O(a.signal);
const{tokenizer:f,processor:k,model:y}=i.components;let P;for(;;){O(I.signal);let M=o;if(k&&(M=o.map(L=>({role:L.role,content:[
{type:"text",text:L.content}]})),E)){const L=M.findLast(ne=>ne.role==="user");if(!L)throw new Error("An image requires a\
 user message");L.content.unshift({type:"image"})}const R=(k??f).apply_chat_template(M,{tokenize:!1,add_generation_prompt:!0,
enable_thinking:!1});if(typeof R!="string"||X(R)>G.maxPromptBytes)throw new Error("Templated prompt exceeds its byte bud\
get");if(E){const L=new i.library.RawImage(E.data,E.width,E.height,E.channels);x=await k(R,L,{do_image_splitting:!1})}else
x=await f(R,{truncation:!1,padding:!1});if(O(I.signal),P=(w=(N=x.input_ids)==null?void 0:N.dims)==null?void 0:w.at(-1),!Number.
isSafeInteger(P)||P<1)throw new Error("Invalid model input token count");if(P+p<=G.maxContextTokens)break;const W=he(o);
if(!W)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten the prompt or requ\
est fewer output tokens");const Z=x;x=void 0,K(Z),o=W,A=!0}O(I.signal);const j=new i.library.TextStreamer(f,{skip_prompt:!0,
skip_special_tokens:!0,callback_function:M=>{var R;if(!(I.signal.aborted||T)){if(S+=X(M),S>G.maxOutputBytes){T=new Error(
"Generated text exceeded its byte budget"),I.abort(T);return}try{if(((R=a.emitProgress)==null?void 0:R.call(a,{type:"tok\
en",sessionId:i.sessionId,requestId:c,sequence:B++,text:M}))===!1)throw new Error("Token consumer rejected output")}catch(W){
T=W,I.abort(W)}}}});if(await i.gpuGuard.run("generation",async()=>{F=await y.generate({...x,max_new_tokens:p,do_sample:!1,
streamer:j,stopping_criteria:[C]})}),T)throw T;if(i.lost)throw i.gpuFailure;O(I.signal);const q=F.tolist();if(q.length!==
1||q[0].length<P||q[0].length>P+p)throw new Error("Model returned an over-budget token sequence");const $=q[0].slice(P),
Y=f.decode($,{skip_special_tokens:!0});if(X(Y)>G.maxOutputBytes)throw new Error("Generated text exceeds its byte budget");
return i.generatedRequests+=1,{sessionId:i.sessionId,requestId:c,text:Y,inputTokens:P,outputTokens:$.length,finishReason:be(
y,$,p),contextTruncated:A,workerId:i.workerId,gpuDispatches:(i.gpuDispatches??0)-z,gpuSubmissions:(i.gpuSubmissions??0)-
Q,gpuProfileSamples:i.gpuProfileSamples??0}}catch(f){throw i.gpuFailure??f}finally{(U=a.signal)==null||U.removeEventListener(
"abort",v);try{const f=new Set;let k;for(const y of[x,F])try{K(y,f)}catch(P){k??(k=P)}if(k){i.lost=!0;const y=i.gpuFailure??
new Error("Model session lost: tensor cleanup failed",{cause:k});throw y.code??(y.code="MODEL_DISPOSE_FAILED"),i.gpuFailure=
y,y}}finally{i.active=null,i.requestId=null,i.status="ready"}}}return async function(a={},i={}){var p;if(u(),a.command===
"load")return h(a,i);if(a.command==="generate")return b(a,i);const c=s.get(V(a.sessionId));if(a.command==="status")return c?
re(c):{sessionId:a.sessionId,status:"absent"};if(a.command==="cancel")return(c==null?void 0:c.requestId)===a.requestId&&
((p=c.active)==null||p.abort("Generation cancelled")),{sessionId:a.sessionId,cancellationRequested:!0};if(a.command==="u\
nload"){if(!c)return{sessionId:a.sessionId,status:"absent"};if(c.status!=="ready")throw new Error("Cancel and await acti\
ve model work before unloading");c.status="unloading";try{await te(c)}catch(o){c.status="ready",c.lost=!0;const E=new Error(
`MODEL_DISPOSE_FAILED: ${o.message}`);throw E.code="MODEL_DISPOSE_FAILED",E}return s.delete(a.sessionId),{sessionId:a.sessionId,
status:"unloaded"}}throw new Error("Unknown model task command")}}const Ie=ke(),Se=(e,t)=>Ie(e,t);export{ke as createModelTaskRuntime,Se as handleModelTask,ge as normalizeModelMessages,we as validateImageInput};
