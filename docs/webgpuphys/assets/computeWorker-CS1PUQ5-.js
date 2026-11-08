const c=new Map,p=new Map,E={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,
Float64Array,BigInt64Array,BigUint64Array};function w(t="Uint8Array"){const e=E[t];if(!e)throw new Error(`Unsupported ty\
ped array view: ${t}`);return e}function M(t){return new t.constructor(t)}function d(t){return ArrayBuffer.isView(t)&&!(t instanceof
DataView)}function x(t){return t instanceof ArrayBuffer?new Uint8Array(t):d(t)?new Uint8Array(t.buffer,t.byteOffset,t.byteLength):
Array.isArray(t)?Uint8Array.from(t):null}async function y(t){const e=String(t);return c.has(e)||c.set(e,import(`${e}`)),
c.get(e)}async function l(t){const e=x(t);if(e)return e;if(typeof t=="string"||t instanceof URL){const r=await fetch(String(
t));if(!r.ok)throw new Error(`Failed to fetch wasm module: ${r.status} ${r.statusText}`);const o=await r.arrayBuffer();return new Uint8Array(
o)}throw new Error("wasm.source must be a URL string, URL, ArrayBuffer, TypedArray, or byte array")}async function U(t){
if(typeof t=="string"||t instanceof URL){const r=String(t);return p.has(r)||p.set(r,(async()=>{const o=await l(t);return WebAssembly.
compile(o)})()),p.get(r)}const e=await l(t);return WebAssembly.compile(e)}async function O(t,e){if(t.importsModule){const r=await y(
t.importsModule),o=t.importsExport||"default",n=r[o];if(typeof n=="function")return await n(e)||{};if(n&&typeof n=="obje\
ct")return n;throw new Error(`WASM imports export "${o}" must be a function or object`)}return t.imports&&typeof t.imports==
"object"?t.imports:{}}function b(t,e,r={}){var i;const o=r.exportName||e.memoryExport||"memory",n=(i=t.exports)==null?void 0:
i[o];if(!(n instanceof WebAssembly.Memory))throw new Error(`WASM memory export "${o}" was not found`);return n}function W(t,e){
if(Object.prototype.hasOwnProperty.call(t,"values"))return t.values;const r=t.dataKey||t.name;if(r&&e&&Object.prototype.
hasOwnProperty.call(e,r))return e[r]}function T(t,e){if(t==null)return null;if(t instanceof e)return t;if(d(t))return new e(
t.buffer,t.byteOffset,Math.floor(t.byteLength/e.BYTES_PER_ELEMENT));if(t instanceof ArrayBuffer)return new e(t);if(Array.
isArray(t))return e.from(t);throw new Error(`Unsupported memory input for ${e.name}`)}function m(t,e,r){(Array.isArray(e.
inputViews)?e.inputViews:[]).forEach(n=>{const i=w(n.view),s=T(W(n,r),i);if(!s)return;const u=b(t,e,n),a=Number.isFinite(
n.byteOffset)?n.byteOffset:0;new i(u.buffer,a,s.length).set(s)})}function S(t,e){const r=Array.isArray(e.outputViews)?e.
outputViews:[];if(r.length===0)return null;const o={};return r.forEach((n,i)=>{const s=w(n.view),u=b(t,e,n),a=Number.isFinite(
n.byteOffset)?n.byteOffset:0,f=Number.isFinite(n.length)?n.length:0;if(f<=0)throw new Error(`WASM output view "${n.name||
i}" must provide a positive length`);const h=n.name||`output${i}`;o[h]=M(new s(u.buffer,a,f))}),o}function A(t,e){var r;
return Array.isArray(e.args)?e.args:Array.isArray(t.args)?t.args:Array.isArray((r=t.data)==null?void 0:r.args)?t.data.args:
[]}function V(t={}){var o,n;const e=((o=globalThis.navigator)==null?void 0:o.gpu)??null;if(((n=t.webgpu)==null?void 0:n.
required)===!0&&!e)throw new Error("WebGPU is required for this task but navigator.gpu is unavailable");return{supported:!!e,
gpu:e,async requestAdapter(i=(s=>(s=t.webgpu)==null?void 0:s.adapterOptions)()){return e?e.requestAdapter(i):null},async requestDevice(i={}){
var u,a;if(!e)return null;const s=i.adapter||await e.requestAdapter(i.adapterOptions||((u=t.webgpu)==null?void 0:u.adapterOptions));
return s?s.requestDevice(i.deviceDescriptor||((a=t.webgpu)==null?void 0:a.deviceDescriptor)):null}}}async function g(t){
const e=t.wasm||{},r=e.source??t.wasmSource??t.source;if(!r)throw new Error("wasm tasks require wasm.source");const o=await U(
r),n=await O(e,{task:t,data:t.data??null,WebAssembly}),i=await WebAssembly.instantiate(o,n);return m(i,e,t.data??null),{
module:o,instance:i,exports:i.exports,imports:n,task:t,data:t.data??null,callExport(s,u=[]){var f;const a=(f=i.exports)==
null?void 0:f[s];if(typeof a!="function")throw new Error(`WASM export "${s}" was not found`);return a(...u)},readOutputViews(){
return S(i,e)},writeInputViews(s){m(i,e,s)}}}async function $(t,e,r){const o=t.wasm||{};if(!o.resultModule)return r.value;
const n=await y(o.resultModule),i=o.resultExport||"default",s=n[i];if(typeof s!="function")throw new Error(`WASM result \
export "${i}" must be a function`);const u=await s({...r,wasm:e,task:t,data:t.data??null});return typeof u>"u"?r:u}async function R(t){
const e=await g(t),r=t.wasm||{},o=A(t,r),n=r.entry?await e.callExport(r.entry,o):void 0,i=e.readOutputViews();return $(t,
e,{returnValue:n,outputs:i,value:i?typeof n>"u"?i:{returnValue:n,outputs:i}:n})}async function B(t){var s;const e=await g(
t),r=t.hostModule||t.module;if(!r)throw new Error("wasm-webgpu tasks require hostModule or module");(s=t.wasm)!=null&&s.
callEntryBeforeHost&&t.wasm.entry&&(e.entryResult=await e.callExport(t.wasm.entry,A(t,t.wasm)));const o=await y(r),n=t.hostExport||
t.exportName||"default",i=o[n];if(typeof i!="function")throw new Error(`wasm-webgpu host export "${n}" must be a functio\
n`);return i({task:t,data:t.data??null,wasm:e,webgpu:V(t)})}async function I(t){if(typeof t!="string"||!t.trim())throw new Error(
"module path must be a non-empty string");return t==="peercompute:model-inference"?import("./modelTask-DAs-_8s_.js"):t===
"peercompute:gguf-inference"?import("./modelTask-Czqm3l_a.js"):t==="peercompute:diffusion-inference"?import("./modelTask-B8CbpANx.js"):
t==="peercompute:speech-inference"?import("./modelTask-B9T4ELj0.js"):import(`${t}`)}function q(t={}){return typeof t.runtime==
"string"&&t.runtime.trim()?t.runtime.trim().toLowerCase():t.wasm?t.hostModule||t.module?"wasm-webgpu":"wasm":"js"}async function N(t,e){
let r;if(t.fn?r=new Function(`return (${t.fn});`)():t.module&&(r=(await I(t.module))[t.exportName||"default"]),typeof r!=
"function")throw new Error("Handler not found for task");return r(t.data,e)}async function j(t,e={}){const r=q(t);switch(r){case"\
js":return N(t,e);case"wasm":return R(t);case"wasm-webgpu":return B(t);default:throw new Error(`Unsupported compute runt\
ime: ${r}`)}}function v(t=globalThis.self){const e=new Map;t.onmessage=async({data:r})=>{var s;if(!r||typeof r!="object")
return;const{id:o,type:n}=r;if(n==="cancel"){(s=e.get(o))==null||s.abort(new DOMException("Compute task cancelled","Abor\
tError"));return}if(n!=="run")return;if(e.size){t.postMessage({type:"error",id:o,error:"Compute worker is busy",code:"ER\
R_COMPUTE_WORKER_BUSY"});return}const i=new AbortController;e.set(o,i);try{const u=await j(r,{taskId:o,workerId:r.workerId,
signal:i.signal,emitProgress(a){i.signal.aborted||t.postMessage({type:"progress",id:o,value:a})}});i.signal.throwIfAborted(),
t.postMessage({type:"result",id:o,result:u})}catch(u){t.postMessage({type:"error",id:o,error:(u==null?void 0:u.message)||
String(u),name:u==null?void 0:u.name,code:u==null?void 0:u.code})}finally{e.delete(o)}},t.postMessage({type:"ready",protocolVersion:2})}
v(self);
