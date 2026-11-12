let f=null;function s(o,e,t){return f&&f.push({buffer:o,size:Math.ceil(e/4)*4,label:t||o.label||""}),o}function l(o,{ownedAllocations:e=null}={}){
if(typeof o!="function")throw new TypeError("fn must be a function");if(e!==null&&!Array.isArray(e))throw new TypeError(
"ownedAllocations must be an array");const t=f,r=e??[],n=r.length;f=r;try{return{value:o(),allocations:e?r.slice(n):r}}catch(a){
if(e)throw a;const u=[];for(const p of r)try{p.buffer.destroy()}catch(c){u.push(c.message)}const i=Object.freeze({retiredCount:r.
length-u.length,cleanupErrors:Object.freeze(u)});if(typeof a=="object"&&a!==null||typeof a=="function")try{Object.defineProperty(
a,"gpuAllocationCleanup",{configurable:!0,enumerable:!0,value:i})}catch{}throw a}finally{f=t}}function g(o,e,t=""){const r=new Uint8Array(
e.buffer,e.byteOffset,e.byteLength),n=Math.max(16,Math.ceil(r.byteLength/4)*4),a=o.createBuffer({size:n,usage:GPUBufferUsage.
UNIFORM|GPUBufferUsage.COPY_DST,mappedAtCreation:!0,label:t});s(a,n,t);try{return new Uint8Array(a.getMappedRange()).set(
r),a.unmap(),a}catch(u){if(!f)try{a.destroy()}catch(i){throw new AggregateError([u,i],"uniform initialization and cleanu\
p failed",{cause:u})}throw u}}async function m({device:o,adapter:e=null}={}){if(o!=null){if(typeof o!="object"||typeof o.
queue?.submit!="function")throw new Error("injected device must expose queue.submit (a live GPUDevice)");return{adapter:e,
device:o,injected:!0}}if(!globalThis.navigator?.gpu)throw new Error("WebGPU is not supported in this browser. Try Chrome\
 113+ or Edge 113+.");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error(
"No WebGPU adapter found. Your GPU may not support WebGPU.");const r=await t.requestDevice({requiredLimits:{maxBufferSize:t.
limits.maxBufferSize,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxComputeWorkgroupStorageSize:t.limits.
maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.
limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY}});return r.lost.then(n=>{console.
error("WebGPU device lost:",n.message),n.reason}),{adapter:t,device:r,injected:!1}}function y(o,e,t=0,r=""){e.byteLength%
4!==0&&console.warn(`createStorageBuffer: non-4-aligned size ${e.byteLength} (label: ${r})`);const n=Math.ceil(e.byteLength/
4)*4,a=o.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|t,mappedAtCreation:!0,label:r||`stora\
ge_${e.byteLength}`});try{return new e.constructor(a.getMappedRange()).set(e),a.unmap(),s(a,n,r)}catch(u){try{a.destroy()}catch(i){
throw new AggregateError([u,i],"storage buffer initialization and cleanup failed",{cause:u})}throw u}}function h(o,e,t,{
usage:r=0,label:n="",ownedBuffers:a=null}={}){if(!Number.isSafeInteger(e)||e<=0||e%4||typeof t!="function"||a!==null&&!(a instanceof
Set))throw TypeError("aligned mapped storage size, initializer and optional owned inventory required");const u=o.createBuffer(
{size:e,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|r,mappedAtCreation:!0,label:n||`storage_${e}`});a?.add(u);try{
return t(u.getMappedRange()),u.unmap(),s(u,e,n)}catch(i){try{u.destroy(),a?.delete(u)}catch(p){const c=new AggregateError(
[i,p],"mapped storage initialization and cleanup failed",{cause:i});throw c.unresolvedGpuBuffer=u,c}throw i}}function d(o,e,t=0,r=""){
e%4!==0&&console.warn(`createEmptyBuffer: non-4-aligned size ${e} (label: ${r})`);const n=Math.ceil(e/4)*4,a=o.createBuffer(
{size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST|t,mappedAtCreation:!1,label:r||`emp\
ty_${e}`});return s(a,n,r)}async function b(o,e,t){const r=o.createBuffer({size:t,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.
COPY_DST}),n=o.createCommandEncoder();n.copyBufferToBuffer(e,0,r,0,t),o.queue.submit([n.finish()]),await r.mapAsync(GPUMapMode.
READ);const a=new Float32Array(r.getMappedRange().slice(0));return r.unmap(),r.destroy(),a}export{d as a,y as b,l as c,g as d,h as e,m as i,b as r};
