import{M,a as W,f as K,e as ee,t as S,g as te,d as re,h as oe,m as ne,o as se}from"./ArtifactReadBridge-Cob8jkWx.js";const ie="\
4.3.2",ae=new Set(["qwen3_5","qwen3_5_text"]),j=new WeakMap,$="_get_text_only_rope_index";function Y(e,t,a){const[n,u]=e??
[];if(n?.type!=="int64"||u?.type!=="int64"||n.dims?.length!==3||n.dims[0]!==3||n.dims[1]!==t||n.dims[2]!==a||u.dims?.length!==
2||u.dims[0]!==t||u.dims[1]!==1||n.data?.length!==3*t*a||u.data?.length!==t)throw new Error("Unsupported Qwen text posit\
ion result");return{positions:n,deltas:u}}function ue(e,t){if(t?.env?.version!==ie||!ae.has(e?.config?.model_type))return!1;
if(j.has(e)){if(e[$]!==j.get(e))throw new Error("Qwen text position compatibility was replaced");return!0}const a=e[$];if(typeof a!=
"function"||typeof t.Tensor!="function")throw new Error("Qwen text position compatibility is unavailable");const n=new t.
Tensor("int64",[10n,11n],[1,2]),u=new t.Tensor("int64",[1n,1n],[1,2]);let d;try{d=a.call(e,n,u);const{positions:s,deltas:w}=Y(
d,1,2);if([...s.data].some((c,i)=>c!==BigInt(i%2)))throw new Error("Unsupported Qwen text position calculation");if(w.data[0]===
0n)return!1;if(w.data[0]!==4n)throw new Error("Unsupported Qwen text position offset")}finally{for(const s of new Set([n,
u,...Array.isArray(d)?d:[]]))s?.dispose?.()}function E(s,w){const c=a.call(this,s,w);if(!w)return c;try{const[i,r]=w.dims??
[];if(w.dims?.length!==2||!Number.isSafeInteger(i)||i<1||!Number.isSafeInteger(r)||r<1)throw new Error("Invalid Qwen tex\
t position dimensions");const{positions:l,deltas:h}=Y(c,i,r);for(let f=0;f<i;f++){let p=l.data[f*r];for(let I=1;I<r;I++){
const v=l.data[f*r+I];v>p&&(p=v)}if(h.data[f]!==p+1n+BigInt(r))throw new Error("Qwen text position behavior changed")}const o=2n*
BigInt(r);for(let f=0;f<i;f++)h.data[f]-=o;return c}catch(i){for(const r of new Set(Array.isArray(c)?c:[]))r?.dispose?.();
throw i}}return Object.defineProperty(e,$,{value:E,configurable:!0,writable:!0}),j.set(e,E),!0}const z=e=>new TextEncoder().
encode(e).byteLength;function ce(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error(
"Model inference requires a ComputeManager-owned worker")}function de(e){if(e==null)return null;if(!Number.isSafeInteger(
e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1||e.width*e.height>M.maxImagePixels||e.channels!==4||!(e.
data instanceof Uint8Array||e.data instanceof Uint8ClampedArray)||e.data.byteLength!==e.width*e.height*4||e.data.byteLength>
M.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded files are not accepted");
return e}function le(e){const t=e.messages??(typeof e.prompt=="string"?[{role:"user",content:e.prompt}]:null);if(!Array.
isArray(t)||!t.length||t.length>M.maxMessages)throw new Error("Invalid inference messages");let a=0;return t.map(n=>{if(!n||
!["system","user","assistant"].includes(n.role)||typeof n.content!="string")throw new Error("Only text message content i\
s accepted");if(a+=z(n.content),a>M.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{role:n.role,
content:n.content}})}async function Z(e){if(!e)return;let t;const a=new Set;for(const n of[e.model,e.processor,e.tokenizer])
if(!(!n||a.has(n))){a.add(n);try{await n.dispose?.()}catch(u){t??=u}}if(t)throw t}function Q(e,t=new Set){if(!(!e||typeof e!=
"object"||t.has(e))){if(t.add(e),typeof e.dispose=="function"){e.dispose();return}for(const a of Object.values(e))Q(a,t)}}
function fe(e){const t=e.findIndex(n=>n.role==="user");if(t<0)return null;const a=e.findIndex((n,u)=>u>t&&n.role==="user");
return a<0||!e.some((n,u)=>u>t&&u<a&&n.role==="assistant")?null:e.filter((n,u)=>u<t||u>=a||n.role==="system")}function pe(e,t,a){
const n={...e.config};for(const s of["decoder","generator","text_config"])Object.assign(n,n[s]);Object.assign(n,e.generation_config);
const u=Array.isArray(n.eos_token_id)?n.eos_token_id:[n.eos_token_id],d=t.at(-1),E=s=>typeof s=="bigint"||Number.isSafeInteger(
s)&&s>=0;return E(d)&&u.some(s=>E(s)&&BigInt(s)===BigInt(d))?"stop":t.length>=a?"length":"unknown"}function P(e,t,a){const n=e===
"out-of-memory"?"GPU out of memory. Close GPU-heavy apps or unload other models, then reload this model.":`GPU ${e}: ${String(
t?.message??t??"operation failed").slice(0,240)}`,u=new Error(`Model session lost: ${a} ${n}`,{cause:t});return u.code=e===
"out-of-memory"?"ERR_MODEL_GPU_OUT_OF_MEMORY":"ERR_MODEL_GPU",u}function me(e){let t,a,n=!1;const u=s=>{n||(e.lost=!0,(!e.
gpuFailure||s.code==="ERR_MODEL_GPU_OUT_OF_MEMORY")&&(e.gpuFailure=s),e.active?.abort(s))},d=({error:s})=>u(P(s?.constructor?.
name==="GPUOutOfMemoryError"?"out-of-memory":"uncaptured error",s,a?.stage??"resident model")),E=()=>{if(!(!a||a.device)){
a.device=t;for(const s of["validation","out-of-memory","internal"])t.pushErrorScope(s),a.filters.push(s)}};return{attach(s){
if(t&&t!==s)throw P("device changed",null,"load");if(!t){if(!s||typeof s.pushErrorScope!="function"||typeof s.popErrorScope!=
"function"||typeof s.queue?.onSubmittedWorkDone!="function"||typeof s.addEventListener!="function"||typeof s.removeEventListener!=
"function"||typeof s.destroy!="function"||typeof s.lost?.then!="function")throw P("device unavailable",null,"load");t=s,
e.runtimeDevice=t,e.restoreResourceEvidence=se(t,e),t.addEventListener("uncapturederror",d),t.lost.then(w=>u(P("device l\
ost",w,a?.stage??"resident model")),w=>u(P("device lost",w,a?.stage??"resident model")))}try{E()}catch(w){const c=P("err\
or scope failure",w,a?.stage??"load");throw u(c),c}},async run(s,w){if(e.lost)throw e.gpuFailure??P("device lost",null,s);
if(a)throw new Error("Overlapping model GPU operations are not allowed");const c={stage:s,filters:[],device:null};a=c;let i,
r;try{if(t&&this.attach(t),i=await w(),!t)throw P("device unavailable",null,s)}catch(o){r=o}if(t)try{await t.queue.onSubmittedWorkDone()}catch(o){
u(P("queue failure",o,s))}const l=await Promise.all(c.filters.reverse().map(async o=>{try{return{filter:o,error:await c.
device.popErrorScope()}}catch(f){return{filter:o,error:f,scopeFailed:!0}}}));a=null;for(const o of l)o.scopeFailed&&u(P(
"error scope failure",o.error,s));const h=["out-of-memory","internal","validation"].map(o=>l.find(f=>f.filter===o&&f.error&&
!f.scopeFailed)).find(Boolean);if(h&&u(P(h.filter,h.error,s)),r instanceof WebAssembly.RuntimeError||/^failed to call OrtRun\(\)\./.
test(r?.message??"")){const o=new Error("Model session lost: native inference runtime failed",{cause:r});o.code="ERR_MOD\
EL_RUNTIME",u(o)}if(typeof r?.code=="string"&&r.code.startsWith("ERR_MODEL_GPU")&&u(r),e.gpuFailure)throw e.gpuFailure;if(r)
throw r;return i},dispose(){n=!0,t?.removeEventListener("uncapturederror",d),e.restoreResourceEvidence?.()}}}function we(e){
const t=["maxBindGroups","maxComputeWorkgroupStorageSize","maxComputeWorkgroupsPerDimension","maxStorageBuffersPerShader\
Stage","maxStorageBufferBindingSize","maxBufferSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","max\
ComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ"],a={};for(const u of t){const d=e.limits?.[u];if(!Number.isSafeInteger(
d)||d<=0)throw new Error(`WebGPU adapter has an invalid ${u} limit`);a[u]=d}const n=["chromium-experimental-subgroup-mat\
rix","timestamp-query","shader-f16","subgroups","subgroup-size-control"].filter(u=>e.features.has(u));return{requiredLimits:a,
requiredFeatures:n}}async function V(e){await Z(e.components),e.restoreGpuEvidence?.(),e.gpuGuard?.dispose(),e.ownedDevice?.
destroy(),e.ownedDevice=null}async function ge({library:e,modelPath:t,options:a,manifest:n,adapterFeatures:u=[]}){const d={};
try{const E=await e.AutoConfig.from_pretrained(t,a),s=oe(n.model,E);for(const c of s)if(!u.includes(c))throw new Error(`\
Model config requires unsupported GPU feature: ${c}`);const w={...a,config:E};if(n.model.architecture==="qwen3_5"&&(w.use_external_data_format=
1),n.model.task==="image-text-to-text"){if(d.processor=await e.AutoProcessor.from_pretrained(t,a),n.model.architecture===
"qwen3_5"){const c=d.processor.image_processor;if(!c)throw new Error("Qwen3.5 image processor is unavailable");c.min_pixels=
256*256,c.max_pixels=ne(n.model).maxProcessedImagePixels,c.do_normalize??=!0}d.tokenizer=d.processor.tokenizer,d.model=await e.
AutoModelForImageTextToText.from_pretrained(t,w)}else d.tokenizer=await e.AutoTokenizer.from_pretrained(t,a),d.model=await e.
AutoModelForCausalLM.from_pretrained(t,w);return d}catch(E){throw await Z(d),E}}function X(e){return{sessionId:e.sessionId,
manifestCid:e.manifestCid,status:e.lost?"lost":e.status,task:e.manifest.model.task,dtype:e.manifest.model.dtype,workerId:e.
workerId,adapter:e.adapter,runtimeAdapter:e.runtimeAdapter??null,requestedGpuBufferPeakBytes:e.requestedGpuBufferPeakBytes,
gpuDispatches:e.gpuDispatches??0,gpuSubmissions:e.gpuSubmissions??0,gpuProfileSamples:e.gpuProfileSamples??0,collectGpuEvidence:e.
collectGpuEvidence===!0,runtimeFeatures:e.runtimeFeatures??[],generatedRequests:e.generatedRequests,qwenTextRopeCompatibility:e.
qwenTextRopeCompatibility===!0}}function he({loadLibrary:e=()=>import("./transformers.web-CsR9rRO0.js"),loadModel:t=ge,gpu:a=globalThis.
navigator?.gpu,baseUrl:n=globalThis.location?.href,assertWorker:u=ce}={}){const d=new Map;let E;async function s(c,i){if(d.
size)throw new Error("This inference worker already has a resident/loading model");const r=W(c.sessionId),{manifest:l}=K(
c.manifest),h=ee(c.runtimeAssets,n);if(!c.artifactPort?.postMessage)throw new Error("An artifact reader port is required");
S(i.signal);const o={sessionId:r,manifest:l,manifestCid:c.manifestCid,status:"loading",workerId:i.workerId??null,generatedRequests:0,
components:null};d.set(r,o);let f;try{const p=await a?.requestAdapter({powerPreference:"high-performance"});if(S(i.signal),
!p||p.info?.isFallbackAdapter||p.isFallbackAdapter)throw new Error("A hardware WebGPU adapter is required; CPU/software \
fallback is disabled");const I=typeof l.model.dtype=="string"?[l.model.dtype]:Object.values(l.model.dtype),v=new Set(l.model.
requiredFeatures??[]);I.some(g=>["fp16","q4f16"].includes(g))&&v.add("shader-f16");for(const g of v)if(!p.features.has(g))
throw new Error(`Model requires unsupported GPU feature: ${g}`);o.adapter={vendor:p.info?.vendor??"",architecture:p.info?.
architecture??"",isFallbackAdapter:!1,requiredFeatures:[...v]};const _=await(E??=e());if(S(i.signal),_.env.version!==te)
throw new Error("Unexpected Transformers runtime version");const A=new URL("/__peercompute_models/",n);f=re(c.artifactPort,
{manifest:l,baseUrl:new URL(`${r}/`,A).href,signal:i.signal});const{env:b}=_;b.logLevel=50,b.allowLocalModels=!0,b.allowRemoteModels=
!1,b.localModelPath=A.pathname,b.useBrowserCache=!1,b.useFSCache=!1,b.useWasmCache=!1,b.fetch=async(...g)=>{try{return await f.
fetch(...g)}catch(O){throw i.emitProgress?.({type:"artifact-read-error",sessionId:r,message:O.message}),O}},b.backends.onnx.
wasm.proxy=!1,b.backends.onnx.wasm.numThreads=1,b.backends.onnx.wasm.wasmPaths=h,o.gpuDispatches=0,o.gpuProfileSamples=0,
o.gpuSubmissions=0,o.collectGpuEvidence=c.collectGpuEvidence===!0,b.backends.onnx.webgpu&&(b.backends.onnx.webgpu.profiling=
{mode:c.collectGpuEvidence===!0?"default":"off",ondata:()=>{o.gpuProfileSamples+=1}});const C={local_files_only:!0,device:"\
webgpu",dtype:l.model.dtype,session_options:{executionProviders:["webgpu"]},progress_callback:g=>{i.signal?.aborted||i.emitProgress?.(
{type:"model-load",sessionId:r,status:String(g.status??"").slice(0,40),file:typeof g.file=="string"?g.file.slice(0,512):
void 0,loaded:Number.isFinite(g.loaded)?g.loaded:void 0,total:Number.isFinite(g.total)?g.total:void 0})}};o.library=_,o.
gpuGuard=me(o),await o.gpuGuard.run("load",async()=>{const g=b.backends.onnx.webgpu;if(!g)throw new Error("The WebGPU ru\
ntime is unavailable");g.adapter=p,o.ownedDevice=await p.requestDevice(we(p)),o.gpuGuard.attach(o.ownedDevice),C.session_options.
executionProviders=[{name:"webgpu",device:o.ownedDevice}],o.components=await t({library:_,modelPath:r,options:C,manifest:l,
adapterFeatures:[...p.features]}),o.qwenTextRopeCompatibility=ue(o.components.model,_);for(const O of v)if(!o.runtimeDevice.
features.has(O))throw new Error(`ORT device is missing required GPU feature: ${O}`);S(i.signal)});const m=o.runtimeDevice;
if(o.runtimeFeatures=[...m?.features??[]],o.collectGpuEvidence&&m){const g=m.createCommandEncoder.bind(m),O=m.queue.submit.
bind(m.queue),x=Object.getOwnPropertyDescriptor(m,"createCommandEncoder"),q=Object.getOwnPropertyDescriptor(m.queue,"sub\
mit");o.restoreGpuEvidence=()=>{x?Object.defineProperty(m,"createCommandEncoder",x):delete m.createCommandEncoder,q?Object.
defineProperty(m.queue,"submit",q):delete m.queue.submit,o.restoreGpuEvidence=null},m.createCommandEncoder=(...k)=>{const y=g(
...k),N=y.beginComputePass.bind(y);return y.beginComputePass=(...L)=>{const R=N(...L);for(const U of["dispatchWorkgroups",
"dispatchWorkgroupsIndirect"]){const F=R[U].bind(R);R[U]=(...D)=>{const B=F(...D);return o.gpuDispatches+=1,B}}return R},
y},m.queue.submit=(...k)=>{const y=O(...k);return o.gpuSubmissions+=1,y}}const G=m?.adapterInfo??b.backends.onnx.webgpu?.
adapter?.info;if(G){if(G.isFallbackAdapter)throw new Error("ORT selected a software GPU adapter");o.runtimeAdapter={vendor:G.
vendor,architecture:G.architecture,isFallbackAdapter:G.isFallbackAdapter??!1}}if(S(i.signal),o.lost)throw o.gpuFailure;return o.
status="ready",X(o)}catch(p){try{await V(o),d.delete(r)}catch(I){o.status="ready",o.lost=!0;const v=new Error(`MODEL_DIS\
POSE_FAILED: ${I.message}`);throw v.code="MODEL_DISPOSE_FAILED",v}throw p}finally{f?.close(),f||c.artifactPort.close()}}
async function w(c,i){const r=d.get(W(c.sessionId));if(!r||r.lost)throw new Error("Model session lost or not loaded");if(r.
status!=="ready")throw new Error("Model session is busy");const l=W(c.requestId),h=c.maxNewTokens??M.maxNewTokens;if(!Number.
isInteger(h)||h<1||h>M.maxNewTokens)throw new Error("Generation exceeds its output-token budget");let o=le(c);const f=de(
c.image);if(f&&r.manifest.model.task!=="image-text-to-text")throw new Error("This model does not admit image inputs");S(
i.signal);const p=new AbortController,I=new r.library.InterruptableStoppingCriteria,v=()=>{p.abort(i.signal?.reason),I.interrupt()};
i.signal?.addEventListener("abort",v,{once:!0}),p.signal.addEventListener("abort",()=>I.interrupt(),{once:!0}),r.active=
p,r.requestId=l,r.status="generating";let _,A,b=0,C=0,m,G=!1;const g=r.gpuDispatches??0,O=r.gpuSubmissions??0;try{S(i.signal);
const{tokenizer:x,processor:q,model:k}=r.components;let y;for(;;){S(p.signal);let F=o;if(q&&(F=o.map(T=>({role:T.role,content:[
{type:"text",text:T.content}]})),f)){const T=F.findLast(J=>J.role==="user");if(!T)throw new Error("An image requires a u\
ser message");T.content.unshift({type:"image"})}const D=(q??x).apply_chat_template(F,{tokenize:!1,add_generation_prompt:!0,
enable_thinking:!1});if(typeof D!="string"||z(D)>M.maxPromptBytes)throw new Error("Templated prompt exceeds its byte bud\
get");if(f){const T=new r.library.RawImage(f.data,f.width,f.height,f.channels);_=await q(D,T,{do_image_splitting:!1})}else
_=await x(D,{truncation:!1,padding:!1});if(S(p.signal),y=_.input_ids?.dims?.at(-1),!Number.isSafeInteger(y)||y<1)throw new Error(
"Invalid model input token count");if(y+h<=M.maxContextTokens)break;const B=fe(o);if(!B)throw new Error("Latest prompt/i\
mage and system instructions exceed the context budget; shorten the prompt or request fewer output tokens");const H=_;_=
void 0,Q(H),o=B,G=!0}S(p.signal);const N=new r.library.TextStreamer(x,{skip_prompt:!0,skip_special_tokens:!0,callback_function:F=>{
if(!(p.signal.aborted||m)){if(C+=z(F),C>M.maxOutputBytes){m=new Error("Generated text exceeded its byte budget"),p.abort(
m);return}try{if(i.emitProgress?.({type:"token",sessionId:r.sessionId,requestId:l,sequence:b++,text:F})===!1)throw new Error(
"Token consumer rejected output")}catch(D){m=D,p.abort(D)}}}});if(await r.gpuGuard.run("generation",async()=>{A=await k.
generate({..._,max_new_tokens:h,do_sample:!1,streamer:N,stopping_criteria:[I]})}),m)throw m;if(r.lost)throw r.gpuFailure;
S(p.signal);const L=A.tolist();if(L.length!==1||L[0].length<y||L[0].length>y+h)throw new Error("Model returned an over-b\
udget token sequence");const R=L[0].slice(y),U=x.decode(R,{skip_special_tokens:!0});if(z(U)>M.maxOutputBytes)throw new Error(
"Generated text exceeds its byte budget");return r.generatedRequests+=1,{sessionId:r.sessionId,requestId:l,text:U,inputTokens:y,
requestedGpuBufferPeakBytes:r.requestedGpuBufferPeakBytes,outputTokens:R.length,finishReason:pe(k,R,h),contextTruncated:G,
workerId:r.workerId,gpuDispatches:(r.gpuDispatches??0)-g,gpuSubmissions:(r.gpuSubmissions??0)-O,gpuProfileSamples:r.gpuProfileSamples??
0}}catch(x){throw r.gpuFailure??x}finally{i.signal?.removeEventListener("abort",v);try{const x=new Set;let q;for(const k of[
_,A])try{Q(k,x)}catch(y){q??=y}if(q){r.lost=!0;const k=r.gpuFailure??new Error("Model session lost: tensor cleanup faile\
d",{cause:q});throw k.code??="MODEL_DISPOSE_FAILED",r.gpuFailure=k,k}}finally{r.active=null,r.requestId=null,r.status="r\
eady"}}}return async function(i={},r={}){if(u(),i.command==="load")return s(i,r);if(i.command==="generate")return w(i,r);
const l=d.get(W(i.sessionId));if(i.command==="status")return l?X(l):{sessionId:i.sessionId,status:"absent"};if(i.command===
"cancel")return l?.requestId===i.requestId&&l.active?.abort("Generation cancelled"),{sessionId:i.sessionId,cancellationRequested:!0};
if(i.command==="unload"){if(!l)return{sessionId:i.sessionId,status:"absent"};if(l.status!=="ready")throw new Error("Canc\
el and await active model work before unloading");l.status="unloading";try{await V(l)}catch(h){l.status="ready",l.lost=!0;
const o=new Error(`MODEL_DISPOSE_FAILED: ${h.message}`);throw o.code="MODEL_DISPOSE_FAILED",o}return d.delete(i.sessionId),
{sessionId:i.sessionId,status:"unloaded"}}throw new Error("Unknown model task command")}}const be=he(),Ee=(e,t)=>be(e,t);export{he as createModelTaskRuntime,Ee as handleModelTask,le as normalizeModelMessages,de as validateImageInput};
