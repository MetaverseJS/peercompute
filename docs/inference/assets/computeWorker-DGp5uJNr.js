const G=Object.freeze(["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkgroupStorageSize","maxComputeInvocat\
ionsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ","maxComputeWorkgroups\
PerDimension","maxStorageBuffersPerShaderStage","maxTextureDimension2D","maxTextureDimension3D","maxTextureArrayLayers"]),
ee=/swiftshader|llvmpipe|lavapipe|software|microsoft basic render|subzero/i,te=new Uint8Array([0,97,115,109,1,0,0,0,1,5,
1,96,0,1,123,3,2,1,0,10,22,1,20,0,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11]);function re(e){if(!e)return!1;if(e.isFallbackAdapter===
!0||e.info?.isFallbackAdapter===!0)return!0;const t=e.info;if(!t||typeof t!="object")return!1;const r=[t.vendor,t.architecture,
t.device,t.description].filter(n=>typeof n=="string"&&n.length>0).join(" ");return r.length>0&&ee.test(r)}function ne(e=null,t=G){
const r={};if(!e||typeof e!="object")return r;for(const n of t){const o=e[n];Number.isSafeInteger(o)&&o>0&&(r[n]=o)}return r}
function j(e=null){if(!e)return[];const t=typeof e[Symbol.iterator]=="function"?[...e]:[];return[...new Set(t.filter(r=>typeof r==
"string"&&r.length>0&&r.length<=80))].sort().slice(0,64)}function Ue(e=globalThis){const t=e?.WebAssembly,r=typeof t=="o\
bject"&&t!==null&&(typeof t.Module=="function"||typeof t.Memory=="function"||typeof t.instantiate=="function"||typeof t.
validate=="function"),n=e?.crossOriginIsolated===!0,o=typeof e?.SharedArrayBuffer=="function",i=!!(r&&typeof t.Suspending==
"function"&&typeof t.promising=="function");let a=!1;if(r&&typeof t.validate=="function")try{a=t.validate(te)===!0}catch{
a=!1}let s=!1;if(r&&o&&typeof t.Memory=="function")try{new t.Memory({initial:0n,maximum:1n,shared:!0,address:"i64"}),s=!0}catch{
s=!1}return{supported:r,crossOriginIsolated:n,sharedArrayBuffer:o,threads:!!(r&&n&&o),simd:a,jspi:i,memory64:s}}const oe="\
peercompute.capabilities.gpu-device.v1",ie=Object.freeze(["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkg\
roupStorageSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWo\
rkgroupSizeZ","maxComputeWorkgroupsPerDimension","maxStorageBuffersPerShaderStage","maxTextureDimension2D","maxTextureDi\
mension3D","maxTextureArrayLayers"]);function ae(e=null,{limitCeilings:t=null,extraLimits:r=null}={}){const n={};if(e&&typeof e==
"object")for(const o of ie){const i=e[o];if(!Number.isSafeInteger(i)||i<=0)continue;const a=t?.[o];n[o]=Number.isSafeInteger(
a)&&a>0?Math.min(i,a):i}if(r&&typeof r=="object")for(const[o,i]of Object.entries(r)){if(!Number.isSafeInteger(i)||i<=0)continue;
const a=e?.[o];n[o]=Number.isSafeInteger(a)&&a>0?Math.min(i,a):i}return n}async function se({scope:e=globalThis,adapter:t=null,
adapterOptions:r=null,powerPreference:n="high-performance",allowFallback:o=!1,requiredFeatures:i=[],optionalFeatures:a=[
"timestamp-query","shader-f16"],promoteLimits:s=!0,limitCeilings:p=null,deviceDescriptor:l=null,timeoutMs:y=5e3,label:K="\
peercompute-managed-gpu",onDeviceLost:I=null,onUncapturedError:E=null}={}){if(!Number.isSafeInteger(y)||y<1||y>6e4)throw new RangeError(
"Invalid WebGPU device acquisition timeout");const S=r&&typeof r=="object"?{powerPreference:n,...r}:{powerPreference:n},
H=o===!0||S.forceFallbackAdapter===!0,O=e?.performance??globalThis.performance,P=()=>typeof O?.now=="function"?O.now():Date.
now(),J=P()+y,B=Object.assign(new Error("WebGPU adapter acquisition timed out"),{code:"ERR_GPU_ADAPTER_TIMEOUT"});let f=t;
if(!f){const u=e?.navigator?.gpu;if(typeof u?.requestAdapter!="function")throw Object.assign(new Error("WebGPU is unavai\
lable in this environment"),{code:"ERR_WEBGPU_UNAVAILABLE"});let b,W,M,L=!1;const A=()=>{if(L||P()>=J)throw B},Q=async()=>{
A();let x=await u.requestAdapter(S);return A(),x==null&&(await new Promise(h=>{M=h,W=setTimeout(h,100)}),W=void 0,M=void 0,
A(),x=await u.requestAdapter(S),A()),x};try{f=await Promise.race([Q(),new Promise((x,h)=>{b=setTimeout(()=>h(B),y)})])}finally{
L=!0,clearTimeout(b),clearTimeout(W),M?.()}}if(!f)throw Object.assign(new Error("Failed to acquire a WebGPU adapter"),{code:"\
ERR_GPU_ADAPTER_UNAVAILABLE"});const v=re(f);if(v&&!H)throw Object.assign(new Error("Hardware WebGPU adapter unavailable\
 (only software/fallback adapter exposed)"),{code:"ERR_GPU_FALLBACK_REJECTED"});const X=j(f.features),F=new Set(X),D=[...new Set(
[...Array.isArray(i)?i:[],...Array.isArray(l?.requiredFeatures)?l.requiredFeatures:[]].filter(u=>typeof u=="string"&&u.length>
0))];for(const u of D)if(!F.has(u))throw Object.assign(new Error(`Required WebGPU feature unavailable: ${u}`),{code:"ERR\
_GPU_FEATURE_UNAVAILABLE",missingFeature:u});const g=[...D];for(const u of Array.isArray(a)?a:[])typeof u=="string"&&F.has(
u)&&!g.includes(u)&&g.push(u);const d=l&&typeof l=="object"?{...l}:{},w={...d,label:d.label||K};g.length>0&&(w.requiredFeatures=
g);const T=s?ae(f.limits,{limitCeilings:p,extraLimits:d.requiredLimits||null}):d.requiredLimits?{...d.requiredLimits}:null;
T&&Object.keys(T).length>0&&(w.requiredLimits=T);let c;try{c=await f.requestDevice(w)}catch(u){if(s&&w.requiredLimits&&!d.
requiredLimits){const b={...w};delete b.requiredLimits,c=await f.requestDevice(b)}else throw u}if(typeof I=="function"&&
c?.lost&&typeof c.lost.then=="function"&&c.lost.then(u=>{try{I(u,c)}catch{}}).catch(()=>{}),typeof E=="function"&&c)try{
c.addEventListener?.("uncapturederror",u=>{try{E(u?.error??u,c)}catch{}})}catch{c.onuncapturederror=u=>E(u?.error??u,c)}
const U=j(c?.features??f.features),Z=ne(c?.limits??f.limits,G),m=f.info&&typeof f.info=="object"?f.info:{};return{schema:oe,
adapter:f,device:c,adapterInfo:{vendor:typeof m.vendor=="string"?m.vendor:"unknown",architecture:typeof m.architecture==
"string"?m.architecture:"unknown",device:typeof m.device=="string"?m.device:"",description:typeof m.description=="string"?
m.description:""},isFallbackAdapter:v,features:U,limits:Z,hasTimestampQuery:U.includes("timestamp-query"),hasShaderF16:U.
includes("shader-f16"),lost:c?.lost??null,destroy(){try{c?.destroy?.()}catch{}}}}const R=new Map,q=new Map,ue={Int8Array,
Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array};
function V(e="Uint8Array"){const t=ue[e];if(!t)throw new Error(`Unsupported typed array view: ${e}`);return t}function ce(e){
return new e.constructor(e)}function z(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function fe(e){return e instanceof
ArrayBuffer?new Uint8Array(e):z(e)?new Uint8Array(e.buffer,e.byteOffset,e.byteLength):Array.isArray(e)?Uint8Array.from(e):
null}async function _(e){const t=String(e);return R.has(t)||R.set(t,import(`${t}`)),R.get(t)}async function C(e){const t=fe(
e);if(t)return t;if(typeof e=="string"||e instanceof URL){const r=await fetch(String(e));if(!r.ok)throw new Error(`Faile\
d to fetch wasm module: ${r.status} ${r.statusText}`);const n=await r.arrayBuffer();return new Uint8Array(n)}throw new Error(
"wasm.source must be a URL string, URL, ArrayBuffer, TypedArray, or byte array")}async function le(e){if(typeof e=="stri\
ng"||e instanceof URL){const r=String(e);return q.has(r)||q.set(r,(async()=>{const n=await C(e);return WebAssembly.compile(
n)})()),q.get(r)}const t=await C(e);return WebAssembly.compile(t)}async function pe(e,t){if(e.importsModule){const r=await _(
e.importsModule),n=e.importsExport||"default",o=r[n];if(typeof o=="function")return await o(t)||{};if(o&&typeof o=="obje\
ct")return o;throw new Error(`WASM imports export "${n}" must be a function or object`)}return e.imports&&typeof e.imports==
"object"?e.imports:{}}function $(e,t,r={}){const n=r.exportName||t.memoryExport||"memory",o=e.exports?.[n];if(!(o instanceof
WebAssembly.Memory))throw new Error(`WASM memory export "${n}" was not found`);return o}function me(e,t){if(Object.prototype.
hasOwnProperty.call(e,"values"))return e.values;const r=e.dataKey||e.name;if(r&&t&&Object.prototype.hasOwnProperty.call(
t,r))return t[r]}function ye(e,t){if(e==null)return null;if(e instanceof t)return e;if(z(e))return new t(e.buffer,e.byteOffset,
Math.floor(e.byteLength/t.BYTES_PER_ELEMENT));if(e instanceof ArrayBuffer)return new t(e);if(Array.isArray(e))return t.from(
e);throw new Error(`Unsupported memory input for ${t.name}`)}function N(e,t,r){(Array.isArray(t.inputViews)?t.inputViews:
[]).forEach(o=>{const i=V(o.view),a=ye(me(o,r),i);if(!a)return;const s=$(e,t,o),p=Number.isFinite(o.byteOffset)?o.byteOffset:
0;new i(s.buffer,p,a.length).set(a)})}function de(e,t){const r=Array.isArray(t.outputViews)?t.outputViews:[];if(r.length===
0)return null;const n={};return r.forEach((o,i)=>{const a=V(o.view),s=$(e,t,o),p=Number.isFinite(o.byteOffset)?o.byteOffset:
0,l=Number.isFinite(o.length)?o.length:0;if(l<=0)throw new Error(`WASM output view "${o.name||i}" must provide a positiv\
e length`);const y=o.name||`output${i}`;n[y]=ce(new a(s.buffer,p,l))}),n}function Y(e,t){return Array.isArray(t.args)?t.
args:Array.isArray(e.args)?e.args:Array.isArray(e.data?.args)?e.data.args:[]}function we(e={}){const t=globalThis.navigator?.
gpu??null;if(e.webgpu?.required===!0&&!t)throw new Error("WebGPU is required for this task but navigator.gpu is unavaila\
ble");return{supported:!!t,gpu:t,async requestAdapter(n=e.webgpu?.adapterOptions){return t?t.requestAdapter(n):null},async requestDevice(n={}){
if(!t)return null;const o=n.promoteLimits??e.webgpu?.promoteLimits??!0,i=n.adapterOptions||e.webgpu?.adapterOptions||null,
a=n.deviceDescriptor||e.webgpu?.deviceDescriptor||null;if(!o){const s=n.adapter||await t.requestAdapter(i||void 0);return s?
s.requestDevice(a||void 0):null}try{return(await se({adapter:n.adapter||null,adapterOptions:i,allowFallback:n.allowFallback??
e.webgpu?.allowFallback??!1,requiredFeatures:n.requiredFeatures??e.webgpu?.requiredFeatures??[],optionalFeatures:n.optionalFeatures??
e.webgpu?.optionalFeatures??["timestamp-query","shader-f16"],promoteLimits:!0,limitCeilings:n.limitCeilings??e.webgpu?.limitCeilings??
null,deviceDescriptor:a,label:n.label||e.webgpu?.label||"peercompute-wasm-webgpu"})).device}catch(s){if(s?.code==="ERR_G\
PU_ADAPTER_UNAVAILABLE"||s?.code==="ERR_WEBGPU_UNAVAILABLE")return null;throw s}}}}async function k(e){const t=e.wasm||{},
r=t.source??e.wasmSource??e.source;if(!r)throw new Error("wasm tasks require wasm.source");const n=await le(r),o=await pe(
t,{task:e,data:e.data??null,WebAssembly}),i=await WebAssembly.instantiate(n,o);return N(i,t,e.data??null),{module:n,instance:i,
exports:i.exports,imports:o,task:e,data:e.data??null,callExport(a,s=[]){const p=i.exports?.[a];if(typeof p!="function")throw new Error(
`WASM export "${a}" was not found`);return p(...s)},readOutputViews(){return de(i,t)},writeInputViews(a){N(i,t,a)}}}async function be(e,t,r){
const n=e.wasm||{};if(!n.resultModule)return r.value;const o=await _(n.resultModule),i=n.resultExport||"default",a=o[i];
if(typeof a!="function")throw new Error(`WASM result export "${i}" must be a function`);const s=await a({...r,wasm:t,task:e,
data:e.data??null});return typeof s>"u"?r:s}async function ge(e){const t=await k(e),r=e.wasm||{},n=Y(e,r),o=r.entry?await t.
callExport(r.entry,n):void 0,i=t.readOutputViews();return be(e,t,{returnValue:o,outputs:i,value:i?typeof o>"u"?i:{returnValue:o,
outputs:i}:o})}async function Ae(e){const t=await k(e),r=e.hostModule||e.module;if(!r)throw new Error("wasm-webgpu tasks\
 require hostModule or module");e.wasm?.callEntryBeforeHost&&e.wasm.entry&&(t.entryResult=await t.callExport(e.wasm.entry,
Y(e,e.wasm)));const n=await _(r),o=e.hostExport||e.exportName||"default",i=n[o];if(typeof i!="function")throw new Error(
`wasm-webgpu host export "${o}" must be a function`);return i({task:e,data:e.data??null,wasm:t,webgpu:we(e)})}async function xe(e){
if(typeof e!="string"||!e.trim())throw new Error("module path must be a non-empty string");return e==="peercompute:model\
-inference"?import("./modelTask-PyR6BUaz.js"):e==="peercompute:gguf-inference"?import("./modelTask-C4N_5U1y.js"):e==="pe\
ercompute:diffusion-inference"?import("./modelTask-FQdk_s20.js"):e==="peercompute:speech-inference"?import("./modelTask-_yloTbxZ.js"):
e==="peercompute:mesh-inference"?import("./modelTask-fRLQLi-K.js").then(function(t){return t.m}):e==="peercompute:sf3d-i\
nference"?import("./sf3dModelTask-D2K1Vyup.js").then(function(t){return t.s}):e==="peercompute:capability-benchmark"?import("./benchmarkTask-DWyROhQ9.js"):
import(`${e}`)}function he(e={}){return typeof e.runtime=="string"&&e.runtime.trim()?e.runtime.trim().toLowerCase():e.wasm?
e.hostModule||e.module?"wasm-webgpu":"wasm":"js"}async function Ee(e,t){let r;if(e.fn?r=new Function(`return (${e.fn});`)():
e.module&&(r=(await xe(e.module))[e.exportName||"default"]),typeof r!="function")throw new Error("Handler not found for \
task");return r(e.data,t)}async function Se(e,t={}){const r=he(e);switch(r){case"js":return Ee(e,t);case"wasm":return ge(
e);case"wasm-webgpu":return Ae(e);default:throw new Error(`Unsupported compute runtime: ${r}`)}}function Te(e=globalThis.
self){const t=new Map;e.onmessage=async({data:r})=>{if(!r||typeof r!="object")return;const{id:n,type:o}=r;if(o==="cancel"){
t.get(n)?.abort(new DOMException("Compute task cancelled","AbortError"));return}if(o!=="run")return;if(t.size){e.postMessage(
{type:"error",id:n,error:"Compute worker is busy",code:"ERR_COMPUTE_WORKER_BUSY"});return}const i=new AbortController;t.
set(n,i);try{const a=await Se(r,{taskId:n,workerId:r.workerId,signal:i.signal,emitProgress(s){i.signal.aborted||e.postMessage(
{type:"progress",id:n,value:s})}});i.signal.throwIfAborted(),e.postMessage({type:"result",id:n,result:a})}catch(a){e.postMessage(
{type:"error",id:n,error:a?.message||String(a),name:a?.name,code:a?.code})}finally{t.delete(n)}},e.postMessage({type:"re\
ady",protocolVersion:2})}Te(self);export{Ue as p,se as r};
