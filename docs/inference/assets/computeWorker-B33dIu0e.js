const c=new Map,p=new Map,E={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,
Float64Array,BigInt64Array,BigUint64Array};function w(e="Uint8Array"){const r=E[e];if(!r)throw new Error(`Unsupported ty\
ped array view: ${e}`);return r}function M(e){return new e.constructor(e)}function d(e){return ArrayBuffer.isView(e)&&!(e instanceof
DataView)}function x(e){return e instanceof ArrayBuffer?new Uint8Array(e):d(e)?new Uint8Array(e.buffer,e.byteOffset,e.byteLength):
Array.isArray(e)?Uint8Array.from(e):null}async function y(e){const r=String(e);return c.has(r)||c.set(r,import(`${r}`)),
c.get(r)}async function l(e){const r=x(e);if(r)return r;if(typeof e=="string"||e instanceof URL){const t=await fetch(String(
e));if(!t.ok)throw new Error(`Failed to fetch wasm module: ${t.status} ${t.statusText}`);const o=await t.arrayBuffer();return new Uint8Array(
o)}throw new Error("wasm.source must be a URL string, URL, ArrayBuffer, TypedArray, or byte array")}async function U(e){
if(typeof e=="string"||e instanceof URL){const t=String(e);return p.has(t)||p.set(t,(async()=>{const o=await l(e);return WebAssembly.
compile(o)})()),p.get(t)}const r=await l(e);return WebAssembly.compile(r)}async function O(e,r){if(e.importsModule){const t=await y(
e.importsModule),o=e.importsExport||"default",n=t[o];if(typeof n=="function")return await n(r)||{};if(n&&typeof n=="obje\
ct")return n;throw new Error(`WASM imports export "${o}" must be a function or object`)}return e.imports&&typeof e.imports==
"object"?e.imports:{}}function b(e,r,t={}){const o=t.exportName||r.memoryExport||"memory",n=e.exports?.[o];if(!(n instanceof
WebAssembly.Memory))throw new Error(`WASM memory export "${o}" was not found`);return n}function W(e,r){if(Object.prototype.
hasOwnProperty.call(e,"values"))return e.values;const t=e.dataKey||e.name;if(t&&r&&Object.prototype.hasOwnProperty.call(
r,t))return r[t]}function T(e,r){if(e==null)return null;if(e instanceof r)return e;if(d(e))return new r(e.buffer,e.byteOffset,
Math.floor(e.byteLength/r.BYTES_PER_ELEMENT));if(e instanceof ArrayBuffer)return new r(e);if(Array.isArray(e))return r.from(
e);throw new Error(`Unsupported memory input for ${r.name}`)}function m(e,r,t){(Array.isArray(r.inputViews)?r.inputViews:
[]).forEach(n=>{const i=w(n.view),s=T(W(n,t),i);if(!s)return;const u=b(e,r,n),a=Number.isFinite(n.byteOffset)?n.byteOffset:
0;new i(u.buffer,a,s.length).set(s)})}function S(e,r){const t=Array.isArray(r.outputViews)?r.outputViews:[];if(t.length===
0)return null;const o={};return t.forEach((n,i)=>{const s=w(n.view),u=b(e,r,n),a=Number.isFinite(n.byteOffset)?n.byteOffset:
0,f=Number.isFinite(n.length)?n.length:0;if(f<=0)throw new Error(`WASM output view "${n.name||i}" must provide a positiv\
e length`);const h=n.name||`output${i}`;o[h]=M(new s(u.buffer,a,f))}),o}function A(e,r){return Array.isArray(r.args)?r.args:
Array.isArray(e.args)?e.args:Array.isArray(e.data?.args)?e.data.args:[]}function V(e={}){const r=globalThis.navigator?.gpu??
null;if(e.webgpu?.required===!0&&!r)throw new Error("WebGPU is required for this task but navigator.gpu is unavailable");
return{supported:!!r,gpu:r,async requestAdapter(o=e.webgpu?.adapterOptions){return r?r.requestAdapter(o):null},async requestDevice(o={}){
if(!r)return null;const n=o.adapter||await r.requestAdapter(o.adapterOptions||e.webgpu?.adapterOptions);return n?n.requestDevice(
o.deviceDescriptor||e.webgpu?.deviceDescriptor):null}}}async function g(e){const r=e.wasm||{},t=r.source??e.wasmSource??
e.source;if(!t)throw new Error("wasm tasks require wasm.source");const o=await U(t),n=await O(r,{task:e,data:e.data??null,
WebAssembly}),i=await WebAssembly.instantiate(o,n);return m(i,r,e.data??null),{module:o,instance:i,exports:i.exports,imports:n,
task:e,data:e.data??null,callExport(s,u=[]){const a=i.exports?.[s];if(typeof a!="function")throw new Error(`WASM export \
"${s}" was not found`);return a(...u)},readOutputViews(){return S(i,r)},writeInputViews(s){m(i,r,s)}}}async function $(e,r,t){
const o=e.wasm||{};if(!o.resultModule)return t.value;const n=await y(o.resultModule),i=o.resultExport||"default",s=n[i];
if(typeof s!="function")throw new Error(`WASM result export "${i}" must be a function`);const u=await s({...t,wasm:r,task:e,
data:e.data??null});return typeof u>"u"?t:u}async function R(e){const r=await g(e),t=e.wasm||{},o=A(e,t),n=t.entry?await r.
callExport(t.entry,o):void 0,i=r.readOutputViews();return $(e,r,{returnValue:n,outputs:i,value:i?typeof n>"u"?i:{returnValue:n,
outputs:i}:n})}async function B(e){const r=await g(e),t=e.hostModule||e.module;if(!t)throw new Error("wasm-webgpu tasks \
require hostModule or module");e.wasm?.callEntryBeforeHost&&e.wasm.entry&&(r.entryResult=await r.callExport(e.wasm.entry,
A(e,e.wasm)));const o=await y(t),n=e.hostExport||e.exportName||"default",i=o[n];if(typeof i!="function")throw new Error(
`wasm-webgpu host export "${n}" must be a function`);return i({task:e,data:e.data??null,wasm:r,webgpu:V(e)})}async function I(e){
if(typeof e!="string"||!e.trim())throw new Error("module path must be a non-empty string");return e==="peercompute:model\
-inference"?import("./modelTask-DEfT5DYY.js"):e==="peercompute:gguf-inference"?import("./modelTask-D94-fkDR.js"):e==="pe\
ercompute:diffusion-inference"?import("./modelTask-D8WQ5dIV.js"):e==="peercompute:speech-inference"?import("./modelTask-D3FpT87S.js"):
import(`${e}`)}function q(e={}){return typeof e.runtime=="string"&&e.runtime.trim()?e.runtime.trim().toLowerCase():e.wasm?
e.hostModule||e.module?"wasm-webgpu":"wasm":"js"}async function N(e,r){let t;if(e.fn?t=new Function(`return (${e.fn});`)():
e.module&&(t=(await I(e.module))[e.exportName||"default"]),typeof t!="function")throw new Error("Handler not found for t\
ask");return t(e.data,r)}async function j(e,r={}){const t=q(e);switch(t){case"js":return N(e,r);case"wasm":return R(e);case"\
wasm-webgpu":return B(e);default:throw new Error(`Unsupported compute runtime: ${t}`)}}function v(e=globalThis.self){const r=new Map;
e.onmessage=async({data:t})=>{if(!t||typeof t!="object")return;const{id:o,type:n}=t;if(n==="cancel"){r.get(o)?.abort(new DOMException(
"Compute task cancelled","AbortError"));return}if(n!=="run")return;if(r.size){e.postMessage({type:"error",id:o,error:"Co\
mpute worker is busy",code:"ERR_COMPUTE_WORKER_BUSY"});return}const i=new AbortController;r.set(o,i);try{const s=await j(
t,{taskId:o,workerId:t.workerId,signal:i.signal,emitProgress(u){i.signal.aborted||e.postMessage({type:"progress",id:o,value:u})}});
i.signal.throwIfAborted(),e.postMessage({type:"result",id:o,result:s})}catch(s){e.postMessage({type:"error",id:o,error:s?.
message||String(s),name:s?.name,code:s?.code})}finally{r.delete(o)}},e.postMessage({type:"ready",protocolVersion:2})}v(self);
