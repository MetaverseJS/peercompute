import{ao as h,ap as f,aj as p}from"./main-BDHli8sO.js";import"./index-BbhYZWtV.js";const g="3.8.1",l=2048,o=1024**3;function G(t){
const e=h(t),r=e.model,n=Object.values(f).filter(i=>i.model.runtime==="llama.cpp"&&i.repository===r?.repository&&i.revision===
r?.revision&&i.model.architecture===r?.architecture&&i.model.task===r?.task&&i.model.dtype===r?.dtype),a=n.length===1?n[0]:
void 0;if(!a||r.runtime!=="llama.cpp"||r.runtimeVersion!==void 0&&r.runtimeVersion!==g||a.model.runtimeVersion!==void 0&&
r.runtimeVersion!==a.model.runtimeVersion||r.dtype!==a.model.dtype||r.format!=="GGUF"||r.task!=="text-generation")throw new Error(
"GGUF model revision is not in the trusted runtime catalog");const u=e.files.filter(i=>i.path.endsWith(".gguf")),c=a.files.
filter(i=>i.path.endsWith(".gguf"));if(!u.length||u.length!==c.length||u.some(i=>!c.some(s=>s.path===i.path&&s.size===i.
size&&s.sha256===i.sha256)))throw new Error("GGUF weights do not match the pinned catalog digests");const d=e.files.reduce(
(i,s)=>i+s.size,0);if(!Number.isSafeInteger(d)||d>16*o)throw new Error("GGUF package exceeds its byte budget");const m=u.
reduce((i,s)=>i+s.size,0)>4*o;return{manifest:e,weights:u,totalBytes:d,resourcePolicy:{maxModelBytes:16*o,minimumCpuBytes:m?
8*o:2*o,minimumGpuBytes:m?16*o:2*o}}}function w(t,e=globalThis.location?.href){const r=new URL(e);if(!t||Object.keys(t).
some(a=>a!=="wasm")||typeof t.wasm!="string")throw new Error("GGUF runtime needs one trusted WASM asset");const n=new URL(
t.wasm,r);if(n.origin!==r.origin||!["http:","https:"].includes(n.protocol)||n.username||n.password||n.search||n.hash||!n.
pathname.endsWith(".wasm"))throw new Error("GGUF runtime WASM must be a fixed same-origin asset");return{wasm:n.href}}function b(t={}){
if(!t||typeof t!="object"||Array.isArray(t)||Object.keys(t).some(r=>!["n_ctx","n_batch","n_gpu_layers","n_threads"].includes(
r)))throw new Error("Unknown GGUF runtime option");const e={n_ctx:l,n_batch:64,n_gpu_layers:99999,n_threads:1,...t};if(!Number.
isInteger(e.n_ctx)||e.n_ctx<64||e.n_ctx>l||!Number.isInteger(e.n_batch)||e.n_batch<1||e.n_batch>128||!Number.isInteger(e.
n_gpu_layers)||e.n_gpu_layers<1||e.n_gpu_layers>99999||e.n_threads!==1)throw new Error("GGUF options exceed the managed \
GPU runtime bounds");return Object.freeze(e)}async function U({scope:t=globalThis,gpu:e=t.navigator?.gpu}={}){if(!t.crossOriginIsolated||
!t.SharedArrayBuffer)throw new Error("GGUF requires cross-origin isolation and SharedArrayBuffer");const r=t.WebAssembly;
if(typeof r?.Suspending!="function"||typeof r?.promising!="function")throw new Error("GGUF requires WebAssembly JSPI");try{
new r.Memory({initial:0n,maximum:1n,shared:!0,address:"i64"})}catch{throw new Error("GGUF requires shared WebAssembly me\
mory64")}const n=await e?.requestAdapter({powerPreference:"high-performance"});if(!n||n.isFallbackAdapter||n.info?.isFallbackAdapter)
throw new Error("GGUF requires a hardware WebGPU adapter");if(!n.features.has("shader-f16"))throw new Error("GGUF requir\
es hardware shader-f16; CPU fallback is disabled");return{adapter:{vendor:n.info?.vendor??"",architecture:n.info?.architecture??
"",isFallbackAdapter:!1,requiredFeatures:["shader-f16"]},sharedMemory:!0,memory64:!0,jspi:!0}}const F=Object.freeze({id:"\
llama.cpp",moduleUrl:"peercompute:gguf-inference",validateManifest:G,validateRuntimeAssets:w,validateRuntimeOptions:b,retainArtifactBridge:!0,
terminateOnUnload:!0,validateGenerationInput({image:t,maxNewTokens:e}){if(t)throw new Error("This GGUF adapter currently\
 accepts text only");if(!Number.isInteger(e)||e<1||e>p.maxNewTokens)throw new Error("GGUF output exceeds its token budge\
t")}});export{l as GGUF_CONTEXT_LIMIT,g as GGUF_RUNTIME_VERSION,F as ggufRuntimeDefinition,U as validateGgufCapabilities,G as validateGgufManifest,
w as validateGgufRuntimeAssets,b as validateGgufRuntimeOptions};
