const c=new Map,p=new Map,E={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,
Float64Array,BigInt64Array,BigUint64Array};function w(t="Uint8Array"){const r=E[t];if(!r)throw new Error(`Unsupported ty\
ped array view: ${t}`);return r}function M(t){return new t.constructor(t)}function d(t){return ArrayBuffer.isView(t)&&!(t instanceof
DataView)}function x(t){return t instanceof ArrayBuffer?new Uint8Array(t):d(t)?new Uint8Array(t.buffer,t.byteOffset,t.byteLength):
Array.isArray(t)?Uint8Array.from(t):null}async function y(t){const r=String(t);return c.has(r)||c.set(r,import(`${r}`)),
c.get(r)}async function l(t){const r=x(t);if(r)return r;if(typeof t=="string"||t instanceof URL){const e=await fetch(String(
t));if(!e.ok)throw new Error(`Failed to fetch wasm module: ${e.status} ${e.statusText}`);const o=await e.arrayBuffer();return new Uint8Array(
o)}throw new Error("wasm.source must be a URL string, URL, ArrayBuffer, TypedArray, or byte array")}async function U(t){
if(typeof t=="string"||t instanceof URL){const e=String(t);return p.has(e)||p.set(e,(async()=>{const o=await l(t);return WebAssembly.
compile(o)})()),p.get(e)}const r=await l(t);return WebAssembly.compile(r)}async function O(t,r){if(t.importsModule){const e=await y(
t.importsModule),o=t.importsExport||"default",n=e[o];if(typeof n=="function")return await n(r)||{};if(n&&typeof n=="obje\
ct")return n;throw new Error(`WASM imports export "${o}" must be a function or object`)}return t.imports&&typeof t.imports==
"object"?t.imports:{}}function b(t,r,e={}){const o=e.exportName||r.memoryExport||"memory",n=t.exports?.[o];if(!(n instanceof
WebAssembly.Memory))throw new Error(`WASM memory export "${o}" was not found`);return n}function W(t,r){if(Object.prototype.
hasOwnProperty.call(t,"values"))return t.values;const e=t.dataKey||t.name;if(e&&r&&Object.prototype.hasOwnProperty.call(
r,e))return r[e]}function T(t,r){if(t==null)return null;if(t instanceof r)return t;if(d(t))return new r(t.buffer,t.byteOffset,
Math.floor(t.byteLength/r.BYTES_PER_ELEMENT));if(t instanceof ArrayBuffer)return new r(t);if(Array.isArray(t))return r.from(
t);throw new Error(`Unsupported memory input for ${r.name}`)}function m(t,r,e){(Array.isArray(r.inputViews)?r.inputViews:
[]).forEach(n=>{const i=w(n.view),s=T(W(n,e),i);if(!s)return;const u=b(t,r,n),a=Number.isFinite(n.byteOffset)?n.byteOffset:
0;new i(u.buffer,a,s.length).set(s)})}function S(t,r){const e=Array.isArray(r.outputViews)?r.outputViews:[];if(e.length===
0)return null;const o={};return e.forEach((n,i)=>{const s=w(n.view),u=b(t,r,n),a=Number.isFinite(n.byteOffset)?n.byteOffset:
0,f=Number.isFinite(n.length)?n.length:0;if(f<=0)throw new Error(`WASM output view "${n.name||i}" must provide a positiv\
e length`);const h=n.name||`output${i}`;o[h]=M(new s(u.buffer,a,f))}),o}function A(t,r){return Array.isArray(r.args)?r.args:
Array.isArray(t.args)?t.args:Array.isArray(t.data?.args)?t.data.args:[]}function V(t={}){const r=globalThis.navigator?.gpu??
null;if(t.webgpu?.required===!0&&!r)throw new Error("WebGPU is required for this task but navigator.gpu is unavailable");
return{supported:!!r,gpu:r,async requestAdapter(o=t.webgpu?.adapterOptions){return r?r.requestAdapter(o):null},async requestDevice(o={}){
if(!r)return null;const n=o.adapter||await r.requestAdapter(o.adapterOptions||t.webgpu?.adapterOptions);return n?n.requestDevice(
o.deviceDescriptor||t.webgpu?.deviceDescriptor):null}}}async function g(t){const r=t.wasm||{},e=r.source??t.wasmSource??
t.source;if(!e)throw new Error("wasm tasks require wasm.source");const o=await U(e),n=await O(r,{task:t,data:t.data??null,
WebAssembly}),i=await WebAssembly.instantiate(o,n);return m(i,r,t.data??null),{module:o,instance:i,exports:i.exports,imports:n,
task:t,data:t.data??null,callExport(s,u=[]){const a=i.exports?.[s];if(typeof a!="function")throw new Error(`WASM export \
"${s}" was not found`);return a(...u)},readOutputViews(){return S(i,r)},writeInputViews(s){m(i,r,s)}}}async function $(t,r,e){
const o=t.wasm||{};if(!o.resultModule)return e.value;const n=await y(o.resultModule),i=o.resultExport||"default",s=n[i];
if(typeof s!="function")throw new Error(`WASM result export "${i}" must be a function`);const u=await s({...e,wasm:r,task:t,
data:t.data??null});return typeof u>"u"?e:u}async function R(t){const r=await g(t),e=t.wasm||{},o=A(t,e),n=e.entry?await r.
callExport(e.entry,o):void 0,i=r.readOutputViews();return $(t,r,{returnValue:n,outputs:i,value:i?typeof n>"u"?i:{returnValue:n,
outputs:i}:n})}async function B(t){const r=await g(t),e=t.hostModule||t.module;if(!e)throw new Error("wasm-webgpu tasks \
require hostModule or module");t.wasm?.callEntryBeforeHost&&t.wasm.entry&&(r.entryResult=await r.callExport(t.wasm.entry,
A(t,t.wasm)));const o=await y(e),n=t.hostExport||t.exportName||"default",i=o[n];if(typeof i!="function")throw new Error(
`wasm-webgpu host export "${n}" must be a function`);return i({task:t,data:t.data??null,wasm:r,webgpu:V(t)})}async function I(t){
if(typeof t!="string"||!t.trim())throw new Error("module path must be a non-empty string");return t==="peercompute:model\
-inference"?import("./modelTask-dQfjl6lX.js").then(function(r){return r.m}):t==="peercompute:gguf-inference"?import("./modelTask-D40M3yPC.js"):
t==="peercompute:diffusion-inference"?import("./modelTask-B3yYydpp.js"):import(`${t}`)}function q(t={}){return typeof t.
runtime=="string"&&t.runtime.trim()?t.runtime.trim().toLowerCase():t.wasm?t.hostModule||t.module?"wasm-webgpu":"wasm":"j\
s"}async function N(t,r){let e;if(t.fn?e=new Function(`return (${t.fn});`)():t.module&&(e=(await I(t.module))[t.exportName||
"default"]),typeof e!="function")throw new Error("Handler not found for task");return e(t.data,r)}async function j(t,r={}){
const e=q(t);switch(e){case"js":return N(t,r);case"wasm":return R(t);case"wasm-webgpu":return B(t);default:throw new Error(
`Unsupported compute runtime: ${e}`)}}function v(t=globalThis.self){const r=new Map;t.onmessage=async({data:e})=>{if(!e||
typeof e!="object")return;const{id:o,type:n}=e;if(n==="cancel"){r.get(o)?.abort(new DOMException("Compute task cancelled",
"AbortError"));return}if(n!=="run")return;if(r.size){t.postMessage({type:"error",id:o,error:"Compute worker is busy",code:"\
ERR_COMPUTE_WORKER_BUSY"});return}const i=new AbortController;r.set(o,i);try{const s=await j(e,{taskId:o,workerId:e.workerId,
signal:i.signal,emitProgress(u){i.signal.aborted||t.postMessage({type:"progress",id:o,value:u})}});i.signal.throwIfAborted(),
t.postMessage({type:"result",id:o,result:s})}catch(s){t.postMessage({type:"error",id:o,error:s?.message||String(s),name:s?.
name,code:s?.code})}finally{r.delete(o)}},t.postMessage({type:"ready",protocolVersion:2})}v(self);
