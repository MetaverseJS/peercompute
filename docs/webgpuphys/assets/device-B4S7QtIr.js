function u(){return typeof navigator<"u"&&"gpu"in navigator}async function n(){if(!u())throw new Error("WebGPU is not su\
pported in this browser. Use Chrome/Edge 113+ with WebGPU enabled.");const e=await navigator.gpu.requestAdapter({powerPreference:"\
high-performance"});if(!e)throw new Error("Failed to acquire a WebGPU adapter. Your GPU may not support WebGPU.");const r=e.
info||{};console.log("WebGPU Adapter:",{vendor:r.vendor,architecture:r.architecture,device:r.device,description:r.description});
const o=[];e.features&&e.features.has&&e.features.has("timestamp-query")&&o.push("timestamp-query");const a=await e.requestDevice(
{requiredFeatures:o,requiredLimits:{maxStorageBufferBindingSize:e.limits.maxStorageBufferBindingSize,maxBufferSize:e.limits.
maxBufferSize,maxComputeWorkgroupsPerDimension:e.limits.maxComputeWorkgroupsPerDimension,maxComputeInvocationsPerWorkgroup:e.
limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:e.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:e.
limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:e.limits.maxComputeWorkgroupSizeZ}});return a.lost.then(i=>{console.
error("WebGPU device lost:",i.message),i.reason!=="destroyed"&&console.error("Device loss reason:",i.reason)}),a.onuncapturederror=
i=>{console.error("WebGPU uncaptured error:",i.error)},{adapter:e,device:a,features:a.features,limits:a.limits}}function s(t,e,r){
return t.createShaderModule({label:r||"shader",code:e})}function f(t,e,r,o=!1){return t.createBuffer({label:r||"storage-\
buffer",size:e,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:o})}function c(t,e,r){
return t.createBuffer({label:r,size:e,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}function p(t,e,r){return t.
createBuffer({label:r||"staging-buffer",size:e,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST})}function m(t,e,r,o=0){
t.queue.writeBuffer(e,o,r)}async function d(t,e,r,o){const a=t.createCommandEncoder();a.copyBufferToBuffer(e,0,r,0,o),t.
queue.submit([a.finish()]),await r.mapAsync(GPUMapMode.READ);const i=r.getMappedRange().slice(0);return r.unmap(),i}function g(t,e){
return Math.ceil(t/e)*e}function l(t,e){return Math.ceil(t/e)}export{c as a,f as b,p as c,s as d,g as e,l as g,n as i,d as r,m as w};
