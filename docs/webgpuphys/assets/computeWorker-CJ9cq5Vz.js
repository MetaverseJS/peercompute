const c=new Map,p=new Map,E={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,
Float64Array,BigInt64Array,BigUint64Array};function l(e="Uint8Array"){const t=E[e];if(!t)throw new Error(`Unsupported ty\
ped array view: ${e}`);return t}function M(e){return new e.constructor(e)}function d(e){return ArrayBuffer.isView(e)&&!(e instanceof
DataView)}function x(e){return e instanceof ArrayBuffer?new Uint8Array(e):d(e)?new Uint8Array(e.buffer,e.byteOffset,e.byteLength):
Array.isArray(e)?Uint8Array.from(e):null}async function y(e){const t=String(e);return c.has(t)||c.set(t,import(`${t}`)),
c.get(t)}async function m(e){const t=x(e);if(t)return t;if(typeof e=="string"||e instanceof URL){const r=await fetch(String(
e));if(!r.ok)throw new Error(`Failed to fetch wasm module: ${r.status} ${r.statusText}`);const o=await r.arrayBuffer();return new Uint8Array(
o)}throw new Error("wasm.source must be a URL string, URL, ArrayBuffer, TypedArray, or byte array")}async function U(e){
if(typeof e=="string"||e instanceof URL){const r=String(e);return p.has(r)||p.set(r,(async()=>{const o=await m(e);return WebAssembly.
compile(o)})()),p.get(r)}const t=await m(e);return WebAssembly.compile(t)}async function O(e,t){if(e.importsModule){const r=await y(
e.importsModule),o=e.importsExport||"default",n=r[o];if(typeof n=="function")return await n(t)||{};if(n&&typeof n=="obje\
ct")return n;throw new Error(`WASM imports export "${o}" must be a function or object`)}return e.imports&&typeof e.imports==
"object"?e.imports:{}}function b(e,t,r={}){var i;const o=r.exportName||t.memoryExport||"memory",n=(i=e.exports)==null?void 0:
i[o];if(!(n instanceof WebAssembly.Memory))throw new Error(`WASM memory export "${o}" was not found`);return n}function W(e,t){
if(Object.prototype.hasOwnProperty.call(e,"values"))return e.values;const r=e.dataKey||e.name;if(r&&t&&Object.prototype.
hasOwnProperty.call(t,r))return t[r]}function T(e,t){if(e==null)return null;if(e instanceof t)return e;if(d(e))return new t(
e.buffer,e.byteOffset,Math.floor(e.byteLength/t.BYTES_PER_ELEMENT));if(e instanceof ArrayBuffer)return new t(e);if(Array.
isArray(e))return t.from(e);throw new Error(`Unsupported memory input for ${t.name}`)}function w(e,t,r){(Array.isArray(t.
inputViews)?t.inputViews:[]).forEach(n=>{const i=l(n.view),s=T(W(n,r),i);if(!s)return;const u=b(e,t,n),a=Number.isFinite(
n.byteOffset)?n.byteOffset:0;new i(u.buffer,a,s.length).set(s)})}function S(e,t){const r=Array.isArray(t.outputViews)?t.
outputViews:[];if(r.length===0)return null;const o={};return r.forEach((n,i)=>{const s=l(n.view),u=b(e,t,n),a=Number.isFinite(
n.byteOffset)?n.byteOffset:0,f=Number.isFinite(n.length)?n.length:0;if(f<=0)throw new Error(`WASM output view "${n.name||
i}" must provide a positive length`);const h=n.name||`output${i}`;o[h]=M(new s(u.buffer,a,f))}),o}function A(e,t){var r;
return Array.isArray(t.args)?t.args:Array.isArray(e.args)?e.args:Array.isArray((r=e.data)==null?void 0:r.args)?e.data.args:
[]}function V(e={}){var o,n;const t=((o=globalThis.navigator)==null?void 0:o.gpu)??null;if(((n=e.webgpu)==null?void 0:n.
required)===!0&&!t)throw new Error("WebGPU is required for this task but navigator.gpu is unavailable");return{supported:!!t,
gpu:t,async requestAdapter(i=(s=>(s=e.webgpu)==null?void 0:s.adapterOptions)()){return t?t.requestAdapter(i):null},async requestDevice(i={}){
var u,a;if(!t)return null;const s=i.adapter||await t.requestAdapter(i.adapterOptions||((u=e.webgpu)==null?void 0:u.adapterOptions));
return s?s.requestDevice(i.deviceDescriptor||((a=e.webgpu)==null?void 0:a.deviceDescriptor)):null}}}async function g(e){
const t=e.wasm||{},r=t.source??e.wasmSource??e.source;if(!r)throw new Error("wasm tasks require wasm.source");const o=await U(
r),n=await O(t,{task:e,data:e.data??null,WebAssembly}),i=await WebAssembly.instantiate(o,n);return w(i,t,e.data??null),{
module:o,instance:i,exports:i.exports,imports:n,task:e,data:e.data??null,callExport(s,u=[]){var f;const a=(f=i.exports)==
null?void 0:f[s];if(typeof a!="function")throw new Error(`WASM export "${s}" was not found`);return a(...u)},readOutputViews(){
return S(i,t)},writeInputViews(s){w(i,t,s)}}}async function $(e,t,r){const o=e.wasm||{};if(!o.resultModule)return r.value;
const n=await y(o.resultModule),i=o.resultExport||"default",s=n[i];if(typeof s!="function")throw new Error(`WASM result \
export "${i}" must be a function`);const u=await s({...r,wasm:t,task:e,data:e.data??null});return typeof u>"u"?r:u}async function R(e){
const t=await g(e),r=e.wasm||{},o=A(e,r),n=r.entry?await t.callExport(r.entry,o):void 0,i=t.readOutputViews();return $(e,
t,{returnValue:n,outputs:i,value:i?typeof n>"u"?i:{returnValue:n,outputs:i}:n})}async function B(e){var s;const t=await g(
e),r=e.hostModule||e.module;if(!r)throw new Error("wasm-webgpu tasks require hostModule or module");(s=e.wasm)!=null&&s.
callEntryBeforeHost&&e.wasm.entry&&(t.entryResult=await t.callExport(e.wasm.entry,A(e,e.wasm)));const o=await y(r),n=e.hostExport||
e.exportName||"default",i=o[n];if(typeof i!="function")throw new Error(`wasm-webgpu host export "${n}" must be a functio\
n`);return i({task:e,data:e.data??null,wasm:t,webgpu:V(e)})}async function I(e){if(typeof e!="string"||!e.trim())throw new Error(
"module path must be a non-empty string");return e==="peercompute:model-inference"?import("./modelTask-BhFPPJiR.js"):e===
"peercompute:gguf-inference"?import("./modelTask-CUMlPAXl.js"):e==="peercompute:diffusion-inference"?import("./modelTask-D2kBUnkE.js"):
e==="peercompute:speech-inference"?import("./modelTask-DWv5wddc.js"):e==="peercompute:mesh-inference"?import("./modelTask-BdhqzBr1.js").
then(function(t){return t.m}):e==="peercompute:sf3d-inference"?import("./sf3dModelTask-C8SqGryP.js").then(function(t){return t.
s}):import(`${e}`)}function q(e={}){return typeof e.runtime=="string"&&e.runtime.trim()?e.runtime.trim().toLowerCase():e.
wasm?e.hostModule||e.module?"wasm-webgpu":"wasm":"js"}async function N(e,t){let r;if(e.fn?r=new Function(`return (${e.fn}\
);`)():e.module&&(r=(await I(e.module))[e.exportName||"default"]),typeof r!="function")throw new Error("Handler not foun\
d for task");return r(e.data,t)}async function j(e,t={}){const r=q(e);switch(r){case"js":return N(e,t);case"wasm":return R(
e);case"wasm-webgpu":return B(e);default:throw new Error(`Unsupported compute runtime: ${r}`)}}function v(e=globalThis.self){
const t=new Map;e.onmessage=async({data:r})=>{var s;if(!r||typeof r!="object")return;const{id:o,type:n}=r;if(n==="cancel"){
(s=t.get(o))==null||s.abort(new DOMException("Compute task cancelled","AbortError"));return}if(n!=="run")return;if(t.size){
e.postMessage({type:"error",id:o,error:"Compute worker is busy",code:"ERR_COMPUTE_WORKER_BUSY"});return}const i=new AbortController;
t.set(o,i);try{const u=await j(r,{taskId:o,workerId:r.workerId,signal:i.signal,emitProgress(a){i.signal.aborted||e.postMessage(
{type:"progress",id:o,value:a})}});i.signal.throwIfAborted(),e.postMessage({type:"result",id:o,result:u})}catch(u){e.postMessage(
{type:"error",id:o,error:(u==null?void 0:u.message)||String(u),name:u==null?void 0:u.name,code:u==null?void 0:u.code})}finally{
t.delete(o)}},e.postMessage({type:"ready",protocolVersion:2})}v(self);
