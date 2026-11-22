const de="peercompute.capabilities.v1",le=Object.freeze(["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkgr\
oupStorageSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWor\
kgroupSizeZ","maxComputeWorkgroupsPerDimension","maxStorageBuffersPerShaderStage","maxTextureDimension2D","maxTextureDim\
ension3D","maxTextureArrayLayers"]),me=/swiftshader|llvmpipe|lavapipe|software|microsoft basic render|subzero/i,ge=new Uint8Array(
[0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,22,1,20,0,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11]);function M(e,r=128,t=""){
return typeof e!="string"?t:e.slice(0,r).replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g," ").trim()||
t}function x(e,r=null,t=1,n=Number.MAX_SAFE_INTEGER){const a=Math.floor(Number(e));return Number.isFinite(a)?Math.min(n,
Math.max(t,a)):r}function S(e,r=null,t=0,n=Number.MAX_SAFE_INTEGER){if(e==null||e==="")return r;const a=Number(e);return Number.
isFinite(a)?Math.min(n,Math.max(t,a)):r}function C(e,...r){for(const t of r){const n=e.get(t);if(n==null||n==="")continue;
const a=Number(n);if(Number.isFinite(a))return a}return null}function ne(e,...r){for(const t of r){const n=e.get(t);if(n==
null||n==="")continue;const a=String(n).trim().toLowerCase();if(["1","true","yes","on"].includes(a))return!0;if(["0","fa\
lse","no","off"].includes(a))return!1}return null}function ye(e){const r=String(e??"");let t=2166136261,n=16777619;for(let a=0;a<
r.length;a+=1){const i=r.charCodeAt(a);t^=i,t=Math.imul(t,16777619)>>>0,n^=i+(a&255),n=Math.imul(n,2246822507)>>>0}return`${t.
toString(16).padStart(8,"0")}${n.toString(16).padStart(8,"0")}`}function be(e=globalThis.navigator){var m,d,s,b;const r=e??
{},t=M(r.userAgent,4096),n=M((m=r.userAgentData)==null?void 0:m.platform,80)||M(r.platform,80),a=Array.isArray((d=r.userAgentData)==
null?void 0:d.brands)?r.userAgentData.brands.slice(0,16).map(A=>M(A==null?void 0:A.brand,80)).join(" "):"";let i="other";
/iPhone|iPad|iPod|\biOS\b/i.test(`${n} ${t}`)||/Mac/i.test(`${n} ${t}`)&&r.maxTouchPoints>1?i="ios":/Android/i.test(`${n}\
 ${t}`)?i="android":/Windows|Win32|Win64/i.test(n)?i="windows":/macOS|Mac/i.test(n)?i="macos":/Linux/i.test(n)?i="linux":
/Windows/i.test(t)?i="windows":/Macintosh|Mac OS X/i.test(t)?i="macos":/Linux|X11/i.test(t)&&(i="linux");let o="other";/Brave/i.
test(a)||/Brave\//i.test(t)||typeof((s=r.brave)==null?void 0:s.isBrave)=="function"?o="brave":/Microsoft Edge/i.test(a)||
/(?:Edg|EdgA|EdgiOS|Edge)\//i.test(t)?o="edge":/Firefox/i.test(a)||/(?:Firefox|FxiOS)\//i.test(t)?o="firefox":/OPR\/|Opera|SamsungBrowser\/|Vivaldi\/|Electron\//i.
test(t)?o="other":/Google Chrome/i.test(a)||/CriOS\//i.test(t)?o="chrome":/Chromium\//i.test(t)?o="chromium":/Chrome\//i.
test(t)?o="chrome":/Chromium/i.test(a)?o="chromium":/Safari\//i.test(t)&&/Version\//i.test(t)&&(o="safari");let f="brows\
er";return typeof process<"u"&&((b=process==null?void 0:process.versions)!=null&&b.node)&&typeof window>"u"&&typeof WorkerGlobalScope>
"u"?f="node":typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope&&(f="worker"),{kind:f,browser:o,os:i}}
function Pe(e=(r=>(r=globalThis.location)==null?void 0:r.search)()||""){const t=e instanceof URLSearchParams?e:new URLSearchParams(
String(e||"")),n=t.get("computeTier")||t.get("deviceTier");return{tier:n&&["mobile","laptop","workstation","cluster"].includes(
n.trim().toLowerCase())?n.trim().toLowerCase():void 0,cpuCores:C(t,"cpuCores")??void 0,deviceMemoryGiB:C(t,"deviceMemory\
GB","deviceMemoryGiB","deviceMemory")??void 0,memoryBudgetMB:C(t,"memoryBudgetMB","ramBudgetMB")??void 0,gpuMemoryBudgetMB:C(
t,"gpuMemoryBudgetMB","gpuBudgetMB","vramBudgetMB")??void 0,budgetScale:C(t,"budgetScale","resourceBudgetScale","compute\
Scale")??void 0,maxWorkers:C(t,"maxWorkers")??void 0,dprCap:C(t,"dprCap","maxDpr")??void 0,forceBenchmark:ne(t,"forceBen\
chmark")??void 0,skipBenchmark:ne(t,"skipBenchmark")??void 0,allowFallbackGpu:ne(t,"allowFallbackGpu")??void 0}}function se(e){
var n;if(!e)return!1;if(e.isFallbackAdapter===!0||((n=e.info)==null?void 0:n.isFallbackAdapter)===!0)return!0;const r=e.
info;if(!r||typeof r!="object")return!1;const t=[r.vendor,r.architecture,r.device,r.description].filter(a=>typeof a=="st\
ring"&&a.length>0).join(" ");return t.length>0&&me.test(t)}function fe(e=null,r=le){const t={};if(!e||typeof e!="object")
return t;for(const n of r){const a=e[n];Number.isSafeInteger(a)&&a>0&&(t[n]=a)}return t}function ae(e=null){if(!e)return[];
const r=typeof e[Symbol.iterator]=="function"?[...e]:[];return[...new Set(r.filter(t=>typeof t=="string"&&t.length>0&&t.
length<=80))].sort().slice(0,64)}function he(e=globalThis){const r=e==null?void 0:e.WebAssembly,t=typeof r=="object"&&r!==
null&&(typeof r.Module=="function"||typeof r.Memory=="function"||typeof r.instantiate=="function"||typeof r.validate=="f\
unction"),n=(e==null?void 0:e.crossOriginIsolated)===!0,a=typeof(e==null?void 0:e.SharedArrayBuffer)=="function",i=!!(t&&
typeof r.Suspending=="function"&&typeof r.promising=="function");let o=!1;if(t&&typeof r.validate=="function")try{o=r.validate(
ge)===!0}catch{o=!1}let f=!1;if(t&&a&&typeof r.Memory=="function")try{new r.Memory({initial:0n,maximum:1n,shared:!0,address:"\
i64"}),f=!0}catch{f=!1}return{supported:t,crossOriginIsolated:n,sharedArrayBuffer:a,threads:!!(t&&n&&a),simd:o,jspi:i,memory64:f}}
function pe(e=globalThis){var i,o;const r={available:!1,webgl2:!1,maxTextureSize:null,max3DTextureSize:null,maxTextureImageUnits:null,
maxRenderbufferSize:null,maxAnisotropy:null};let t=null;if(typeof(e==null?void 0:e.OffscreenCanvas)=="function")try{t=new e.
OffscreenCanvas(1,1)}catch{t=null}if(!t&&typeof((i=e==null?void 0:e.document)==null?void 0:i.createElement)=="function")
try{t=e.document.createElement("canvas"),t.width=1,t.height=1}catch{t=null}if(!t||typeof t.getContext!="function")return r;
let n=null,a=!1;try{n=t.getContext("webgl2",{powerPreference:"high-performance",failIfMajorPerformanceCaveat:!1}),n?a=!0:
n=t.getContext("webgl",{powerPreference:"high-performance",failIfMajorPerformanceCaveat:!1})}catch{return r}if(!n)return r;
try{const f=d=>{const s=n[d];if(s===void 0)return null;const b=n.getParameter(s);return Number.isFinite(b)&&b>0?Math.floor(
b):null};let m=null;try{const d=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_fil\
ter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic");if(d&&d.MAX_TEXTURE_MAX_ANISOTROPY_EXT!==void 0){
const s=n.getParameter(d.MAX_TEXTURE_MAX_ANISOTROPY_EXT);Number.isFinite(s)&&s>0&&(m=s)}}catch{m=null}return{available:!0,
webgl2:a,maxTextureSize:f("MAX_TEXTURE_SIZE"),max3DTextureSize:a?f("MAX_3D_TEXTURE_SIZE"):null,maxTextureImageUnits:f("M\
AX_TEXTURE_IMAGE_UNITS"),maxRenderbufferSize:f("MAX_RENDERBUFFER_SIZE"),maxAnisotropy:m}}finally{try{(o=n.getExtension("\
WEBGL_lose_context"))==null||o.loseContext()}catch{}}}function we({cpuCores:e,deviceMemoryGiB:r,gpuAvailable:t,isMobileOs:n,
declaredTier:a}={}){return a&&["mobile","laptop","workstation","cluster"].includes(String(a))?String(a):e>=32||r!=null&&
r>=64?"cluster":t&&!n&&(e>=12||r!=null&&r>=16)?"workstation":n||e<=4||r!=null&&r<=4?"mobile":"laptop"}function xe(e){return e===
"cluster"?{memoryBudgetMB:8192,gpuMemoryBudgetMB:4096}:e==="workstation"?{memoryBudgetMB:2048,gpuMemoryBudgetMB:1024}:e===
"mobile"?{memoryBudgetMB:384,gpuMemoryBudgetMB:192}:{memoryBudgetMB:1024,gpuMemoryBudgetMB:512}}function Be(e={}){var n,
a,i,o,f,m,d,s;const r=e.webgpu||{},t={v:1,cores:((n=e.cpu)==null?void 0:n.cores)??null,memGiB:((a=e.memory)==null?void 0:
a.deviceMemoryGiB)??null,webgpu:r.status??null,vendor:((i=r.info)==null?void 0:i.vendor)??"",arch:((o=r.info)==null?void 0:
o.architecture)??"",features:Array.isArray(r.features)?r.features:[],limits:r.limits??{},wasmSimd:((f=e.wasm)==null?void 0:
f.simd)===!0,wasmThreads:((m=e.wasm)==null?void 0:m.threads)===!0,browser:((d=e.environment)==null?void 0:d.browser)??"o\
ther",os:((s=e.environment)==null?void 0:s.os)??"other"};return`hw-${ye(JSON.stringify(t))}`}async function ve({scope:e=globalThis,
timeoutMs:r=3e3,allowFallback:t=!1,includeWebGL:n=!1,includeStorageEstimate:a=!1,overrides:i=null,nativeMetrics:o=null}={}){
var _,ie,oe;if(!Number.isSafeInteger(r)||r<1||r>6e4)throw new RangeError("Invalid capability probe timeout");const f=(e==
null?void 0:e.navigator)??{},m=(e==null?void 0:e.performance)??globalThis.performance,d=()=>typeof(m==null?void 0:m.now)==
"function"?m.now():Date.now(),s=i&&typeof i=="object"?i:{},b=be(f),A=b.os==="android"||b.os==="ios",R=x(f.hardwareConcurrency,
null,1,512),F=x(s.cpuCores,null,1,512),Y=F??R??4,G={cores:Y,source:F!=null?"override":R!=null?"navigator":"fallback",coarseHint:!0},
I=S(f.deviceMemory,null,.25,2048),q=S(s.deviceMemoryGiB??s.deviceMemoryGB,null,.25,2048),P=q??I,g=m!=null&&m.memory&&typeof m.
memory=="object"?m.memory:null,$=x(g==null?void 0:g.jsHeapSizeLimit,null,1),ee=x(g==null?void 0:g.usedJSHeapSize,null,0),
V=x(o==null?void 0:o.physicalRamBytes,null,1),N=x(o==null?void 0:o.physicalVramBytes,null,1),W={deviceMemoryGiB:P,deviceMemorySource:q!=
null?"override":I!=null?"navigator-coarse-hint":"unknown",jsHeapLimitBytes:$,jsHeapUsedBytes:ee,physicalRamBytes:V,physicalVramBytes:N,
provenance:{deviceMemory:q!=null?"override":I!=null?"coarse-browser-hint-capped-8gib":"unknown",vram:N!=null?"native-dri\
ver-sampler":"unavailable-in-browser"}},E=he(e),v=s.allowFallbackGpu??t===!0,c={status:"unavailable",available:!1,isFallbackAdapter:null,
info:null,features:[],limits:{},hasShaderF16:!1,hasTimestampQuery:!1,hasSubgroups:!1,probeError:null},u=f.gpu;if(typeof(u==
null?void 0:u.requestAdapter)=="function"){const J=d()+r,w=new Error("GPU capability check timed out");let re,X,H,ue=!1;
const Q=()=>{if(ue||d()>=J)throw w},ce=async()=>{Q();let y=await u.requestAdapter({powerPreference:"high-performance"});
return Q(),y==null&&(await new Promise(k=>{H=k,X=setTimeout(k,100)}),X=void 0,H=void 0,Q(),y=await u.requestAdapter({powerPreference:"\
high-performance"}),Q()),y};try{const y=await Promise.race([ce(),new Promise((k,U)=>{re=setTimeout(()=>U(w),r)})]);if(!y)
c.status="unavailable",c.available=!1;else{const k=se(y);c.isFallbackAdapter=k;const U=y.info&&typeof y.info=="object"?y.
info:null;U?c.info={vendor:M(U.vendor,80,"unknown"),architecture:M(U.architecture,80,"unknown"),device:M(U.device,80,""),
description:M(U.description,128,"")}:c.info={vendor:"unknown",architecture:"unknown",device:"",description:""},k&&!v?(c.
status="fallback-only",c.available=!1):(c.features=ae(y.features),c.limits=fe(y.limits),c.hasShaderF16=c.features.includes(
"shader-f16"),c.hasTimestampQuery=c.features.includes("timestamp-query"),c.hasSubgroups=c.features.includes("subgroups"),
c.status=k?"fallback":"hardware",c.available=!0)}}catch(y){c.available=null,c.probeError=String((y==null?void 0:y.message)??
y).slice(0,300),c.status=y===w?"timeout":"error"}finally{ue=!0,clearTimeout(re),clearTimeout(X),H==null||H()}}const j=n?
pe(e):null;let z=null;if(a&&typeof((_=f.storage)==null?void 0:_.estimate)=="function"){let J;try{const w=await Promise.race(
[f.storage.estimate(),new Promise((re,X)=>{J=setTimeout(()=>X(new Error("Storage estimate timed out")),Math.min(r,1500))})]);
z={usageBytes:x(w==null?void 0:w.usage,null,0),quotaBytes:x(w==null?void 0:w.quota,null,0),advisory:!0}}catch{z={usageBytes:null,
quotaBytes:null,advisory:!0}}finally{clearTimeout(J)}}const p=S(e==null?void 0:e.devicePixelRatio,1,.5,8),D=we({cpuCores:Y,
deviceMemoryGiB:P,gpuAvailable:c.available===!0,isMobileOs:A,declaredTier:s.tier}),Z=S(s.dprCap,D==="mobile"?1.5:2,1,4),
l={devicePixelRatio:p,recommendedPixelRatio:Math.min(p,Z),screenWidth:x(((ie=e==null?void 0:e.screen)==null?void 0:ie.width)??
(e==null?void 0:e.innerWidth),null,1),screenHeight:x(((oe=e==null?void 0:e.screen)==null?void 0:oe.height)??(e==null?void 0:
e.innerHeight),null,1)},h=f.connection||f.mozConnection||f.webkitConnection||null,L=h?{effectiveType:typeof h.effectiveType==
"string"?h.effectiveType:null,downlinkMbps:S(h.downlink,null,0,1e5),rttMs:S(h.rtt,null,0,6e4),saveData:h.saveData===!0,coarseHint:!0}:
null,B=xe(D),K=P!=null?Math.max(128,Math.min(B.memoryBudgetMB,P*1024*.25)):B.memoryBudgetMB,O=S(s.memoryBudgetMB,K,64,1048576),
te=S(s.gpuMemoryBudgetMB,c.available===!0?B.gpuMemoryBudgetMB:0,0,1048576),T={schema:de,probedAt:Date.now(),environment:b,
tier:D,cpu:G,memory:W,wasm:E,webgpu:c,webgl:j,storage:z,display:l,network:L,planningBudgets:{memoryBudgetMB:O,gpuMemoryBudgetMB:te,
budgetScale:S(s.budgetScale,1,.05,64),provenance:s.memoryBudgetMB!=null||s.gpuMemoryBudgetMB!=null?"override":"tier-plan\
ning-estimate-not-measured-vram"}};return T.hardwareFingerprint=Be(T),T}const Se="peercompute.capabilities.gpu-device.v1",
Ae=Object.freeze(["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkgroupStorageSize","maxComputeInvocationsP\
erWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ","maxComputeWorkgroupsPerDi\
mension","maxStorageBuffersPerShaderStage","maxTextureDimension2D","maxTextureDimension3D","maxTextureArrayLayers"]);function Ee(e=null,{
limitCeilings:r=null,extraLimits:t=null}={}){const n={};if(e&&typeof e=="object")for(const a of Ae){const i=e[a];if(!Number.
isSafeInteger(i)||i<=0)continue;const o=r==null?void 0:r[a];n[a]=Number.isSafeInteger(o)&&o>0?Math.min(i,o):i}if(t&&typeof t==
"object")for(const[a,i]of Object.entries(t)){if(!Number.isSafeInteger(i)||i<=0)continue;const o=e==null?void 0:e[a];n[a]=
Number.isSafeInteger(o)&&o>0?Math.min(i,o):i}return n}async function Te({scope:e=globalThis,adapter:r=null,adapterOptions:t=null,
powerPreference:n="high-performance",allowFallback:a=!1,requiredFeatures:i=[],optionalFeatures:o=["timestamp-query","sha\
der-f16"],promoteLimits:f=!0,limitCeilings:m=null,deviceDescriptor:d=null,timeoutMs:s=5e3,label:b="peercompute-managed-g\
pu",onDeviceLost:A=null,onUncapturedError:R=null}={}){var D,Z;if(!Number.isSafeInteger(s)||s<1||s>6e4)throw new RangeError(
"Invalid WebGPU device acquisition timeout");const F=t&&typeof t=="object"?{powerPreference:n,...t}:{powerPreference:n},
Y=a===!0||F.forceFallbackAdapter===!0,G=(e==null?void 0:e.performance)??globalThis.performance,I=()=>typeof(G==null?void 0:
G.now)=="function"?G.now():Date.now(),q=I()+s,P=Object.assign(new Error("WebGPU adapter acquisition timed out"),{code:"E\
RR_GPU_ADAPTER_TIMEOUT"});let g=r;if(!g){const l=(D=e==null?void 0:e.navigator)==null?void 0:D.gpu;if(typeof(l==null?void 0:
l.requestAdapter)!="function")throw Object.assign(new Error("WebGPU is unavailable in this environment"),{code:"ERR_WEBG\
PU_UNAVAILABLE"});let h,L,B,K=!1;const O=()=>{if(K||I()>=q)throw P},te=async()=>{O();let T=await l.requestAdapter(F);return O(),
T==null&&(await new Promise(_=>{B=_,L=setTimeout(_,100)}),L=void 0,B=void 0,O(),T=await l.requestAdapter(F),O()),T};try{
g=await Promise.race([te(),new Promise((T,_)=>{h=setTimeout(()=>_(P),s)})])}finally{K=!0,clearTimeout(h),clearTimeout(L),
B==null||B()}}if(!g)throw Object.assign(new Error("Failed to acquire a WebGPU adapter"),{code:"ERR_GPU_ADAPTER_UNAVAILAB\
LE"});const $=se(g);if($&&!Y)throw Object.assign(new Error("Hardware WebGPU adapter unavailable (only software/fallback \
adapter exposed)"),{code:"ERR_GPU_FALLBACK_REJECTED"});const ee=ae(g.features),V=new Set(ee),N=[...new Set([...Array.isArray(
i)?i:[],...Array.isArray(d==null?void 0:d.requiredFeatures)?d.requiredFeatures:[]].filter(l=>typeof l=="string"&&l.length>
0))];for(const l of N)if(!V.has(l))throw Object.assign(new Error(`Required WebGPU feature unavailable: ${l}`),{code:"ERR\
_GPU_FEATURE_UNAVAILABLE",missingFeature:l});const W=[...N];for(const l of Array.isArray(o)?o:[])typeof l=="string"&&V.has(
l)&&!W.includes(l)&&W.push(l);const E=d&&typeof d=="object"?{...d}:{},v={...E,label:E.label||b};W.length>0&&(v.requiredFeatures=
W);const c=f?Ee(g.limits,{limitCeilings:m,extraLimits:E.requiredLimits||null}):E.requiredLimits?{...E.requiredLimits}:null;
c&&Object.keys(c).length>0&&(v.requiredLimits=c);let u;try{u=await g.requestDevice(v)}catch(l){if(f&&v.requiredLimits&&!E.
requiredLimits){const h={...v};delete h.requiredLimits,u=await g.requestDevice(h)}else throw l}if(typeof A=="function"&&
(u!=null&&u.lost)&&typeof u.lost.then=="function"&&u.lost.then(l=>{try{A(l,u)}catch{}}).catch(()=>{}),typeof R=="functio\
n"&&u)try{(Z=u.addEventListener)==null||Z.call(u,"uncapturederror",l=>{try{R((l==null?void 0:l.error)??l,u)}catch{}})}catch{
u.onuncapturederror=l=>R((l==null?void 0:l.error)??l,u)}const j=ae((u==null?void 0:u.features)??g.features),z=fe((u==null?
void 0:u.limits)??g.limits,le),p=g.info&&typeof g.info=="object"?g.info:{};return{schema:Se,adapter:g,device:u,adapterInfo:{
vendor:typeof p.vendor=="string"?p.vendor:"unknown",architecture:typeof p.architecture=="string"?p.architecture:"unknown",
device:typeof p.device=="string"?p.device:"",description:typeof p.description=="string"?p.description:""},isFallbackAdapter:$,
features:j,limits:z,hasTimestampQuery:j.includes("timestamp-query"),hasShaderF16:j.includes("shader-f16"),lost:(u==null?
void 0:u.lost)??null,destroy(){var l;try{(l=u==null?void 0:u.destroy)==null||l.call(u)}catch{}}}}function Me(){return typeof navigator<
"u"&&"gpu"in navigator}async function _e(e={}){if(!Me())throw new Error("WebGPU is not supported in this browser. Use Ch\
rome/Edge 113+ with WebGPU enabled.");const r=await Te({powerPreference:e.powerPreference||"high-performance",allowFallback:e.
allowFallback===!0,requiredFeatures:e.requiredFeatures||[],optionalFeatures:e.optionalFeatures||["timestamp-query","shad\
er-f16"],promoteLimits:e.promoteLimits!==!1,limitCeilings:e.limitCeilings||null,label:e.label||"webgpuphys-device",onDeviceLost:t=>{
var n;console.error("WebGPU device lost:",t.message),t.reason!=="destroyed"&&console.error("Device loss reason:",t.reason),
(n=e.onDeviceLost)==null||n.call(e,t)},onUncapturedError:t=>{var n;console.error("WebGPU uncaptured error:",t),(n=e.onUncapturedError)==
null||n.call(e,t)}});return console.log("WebGPU Adapter:",r.adapterInfo),{adapter:r.adapter,device:r.device,adapterInfo:r.
adapterInfo,isFallbackAdapter:r.isFallbackAdapter,features:r.device.features,limits:r.device.limits}}function ke(e,r,t){
return e.createShaderModule({label:t||"shader",code:r})}function Ue(e,r,t,n=!1){return e.createBuffer({label:t||"storage\
-buffer",size:r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:n})}function Ce(e,r,t){
return e.createBuffer({label:t,size:r,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}function Re(e,r,t){return e.
createBuffer({label:t||"staging-buffer",size:r,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST})}function Fe(e,r,t,n=0){
e.queue.writeBuffer(r,n,t)}async function Ge(e,r,t,n){const a=e.createCommandEncoder();a.copyBufferToBuffer(r,0,t,0,n),e.
queue.submit([a.finish()]),await t.mapAsync(GPUMapMode.READ);const i=t.getMappedRange().slice(0);return t.unmap(),i}function Ie(e,r){
return Math.ceil(e/r)*r}function We(e,r){return Math.ceil(e/r)}export{le as G,Ce as a,Ue as b,Re as c,ke as d,Ie as e,Pe as f,We as g,Te as h,_e as i,he as j,ae as k,fe as l,ve as p,Ge as r,
Fe as w};
