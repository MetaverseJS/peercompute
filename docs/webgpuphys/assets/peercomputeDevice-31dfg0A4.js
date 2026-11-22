import"./ModelEvidenceService-Cqouo3eH.js";import{h as k,k as b,l as m,G as S,f as p,i as y,p as E}from"./device-CB8g0LHY.js";
const R="peercompute.gpu.resident-stage-executor.v0",x="peercompute.gpu.resident-stage-worker-policy.v0";function l(i,e=null){
return String(i??"").trim()||e}function h(i){return i==null?null:JSON.parse(JSON.stringify(i))}function f(i,e=!1){return typeof i==
"boolean"?i:e}function v(i,e=null){const t=Math.floor(Number(i));return Number.isFinite(t)&&t>=0?t:e}function M(i={},e=null){
const t=i&&typeof i=="object"?i:{},r=l(t.mode??t.residencyMode,null),a=!!(t.worker||t.workerReady||t.workerModuleUrl||t.
workerType),n=r||(a?"dedicated-worker":"inline"),o=f(t.workerReady,!1)||!!t.worker,s=n==="dedicated-worker"||n==="webgpu\
-worker"||n==="gpu-compute-worker",c=s?"dedicated-worker":"inline",g=s?o?"worker-ready":"blocked-worker-backend-missing":
"inline-ready";return{schema:x,stageId:e,mode:c,status:g,workerType:l(t.workerType,s?"webgpu-compute-worker":null),workerModuleUrl:l(
t.workerModuleUrl??t.moduleUrl,null),startupMode:l(t.startupMode,s?"warm-on-first-use":"inline"),idleTtlMs:v(t.idleTtlMs,
s?6e4:null),sameDeviceRequired:f(t.sameDeviceRequired,s),bufferTransferPolicy:l(t.bufferTransferPolicy,s?"worker-owns-de\
vice-and-retained-buffers-required":"main-thread-gpuhub-inline"),fallbackRuntimeTarget:g==="blocked-worker-backend-missi\
ng"?"gpu-hub-inline-stage-executor":null,authority:"compute-manager-gpuhub-resident-stage-worker-policy"}}async function P(i,e){
if(typeof i=="function")return i(e);if(i&&typeof i.runStage=="function")return i.runStage(e);throw new Error("[GPUHubMan\
ager] Resident stage worker backend must be a function or expose runStage()")}class D{constructor(e={}){this.frameBudgetMs=
e.frameBudgetMs??4,this.hotStore=e.hotStore||new Map,this.adapter=null,this.device=null,this.deviceInfo=null,this.features=
[],this.limits=null,this.isFallbackAdapter=null,this.lastDeviceLoss=null,this.tasks=new Map,this.residentStageExecutors=
new Map,this.residentStageExecutorAliases=new Map}async initialize(e={}){var r,a;if(e.device)return this.setDevice(e.device,
{adapter:e.adapter||null,adapterInfo:e.adapterInfo||null,isFallbackAdapter:e.isFallbackAdapter??null,onDeviceLost:e.onDeviceLost||
null}),this.device;if(typeof navigator>"u"||!navigator.gpu)throw new Error("[GPUHubManager] WebGPU not available in this\
 environment");const t=await k({adapterOptions:e.adapterOptions||null,powerPreference:((r=e.adapterOptions)==null?void 0:
r.powerPreference)??e.powerPreference??"high-performance",allowFallback:e.allowFallback===!0||((a=e.adapterOptions)==null?
void 0:a.forceFallbackAdapter)===!0,requiredFeatures:e.requiredFeatures||[],optionalFeatures:e.optionalFeatures??["times\
tamp-query","shader-f16"],promoteLimits:e.promoteLimits!==!1,limitCeilings:e.limitCeilings||null,deviceDescriptor:e.deviceDescriptor||
null,timeoutMs:e.timeoutMs??5e3,label:e.label||"peercompute-gpu-hub",onDeviceLost:(n,o)=>{var s;this.device===o&&(this.device=
null),this.lastDeviceLoss=n||{reason:"unknown",message:""},(s=e.onDeviceLost)==null||s.call(e,n,o)},onUncapturedError:e.
onUncapturedError||null});return this.adapter=t.adapter,this.device=t.device,this.deviceInfo=t.adapterInfo,this.features=
t.features,this.limits=t.limits,this.isFallbackAdapter=t.isFallbackAdapter,this.lastDeviceLoss=null,this.device}setDevice(e,t={}){
this.device=e||null,this.adapter=t.adapter??this.adapter??null,this.deviceInfo=t.adapterInfo??this.deviceInfo??null,this.
isFallbackAdapter=t.isFallbackAdapter??this.isFallbackAdapter??null,this.features=e!=null&&e.features?b(e.features):[];const r=e!=
null&&e.limits?m(e.limits,S):{};this.limits=Object.keys(r).length>0?r:null,this.lastDeviceLoss=null,e!=null&&e.lost&&typeof e.
lost.then=="function"&&e.lost.then(a=>{var n;this.device===e&&(this.device=null),this.lastDeviceLoss=a||{reason:"unknown",
message:""},(n=t.onDeviceLost)==null||n.call(t,a,e)}).catch(()=>{})}getDeviceInfo(){return this.deviceInfo?{...this.deviceInfo}:
null}getLimits(){return this.limits?{...this.limits}:null}getFeatures(){return[...this.features]}getHotStore(){return this.
hotStore}registerHotBuffer(e,t){this.hotStore.set(e,t)}registerHotBufferSet(e,t){this.hotStore.set(e,t)}getHotBufferSet(e){
return this.hotStore.get(e)}getHotBuffer(e){return this.hotStore.get(e)}createHotBuffer(e,t,r,a){if(!this.device)throw new Error(
"[GPUHubManager] Device not initialized");const n=this.device.createBuffer({size:t,usage:r,label:a});return this.hotStore.
set(e,n),n}removeHotBuffer(e){this.hotStore.delete(e)}registerResidentStageExecutor(e,t=null){var c;const r=typeof e=="s\
tring"?{stageId:e,executor:t}:{...e||{}},a=l(r.stageId??r.id,null);if(!a)throw new Error("[GPUHubManager] Resident stage\
 executor requires a stageId");const n=r.executor||t,o=r.workerRunner||r.workerBackend||((c=r.workerPolicy)==null?void 0:
c.workerRunner)||null;if(typeof n!="function"&&!o)throw new Error(`[GPUHubManager] Resident stage executor must be a fun\
ction: ${a}`);const s={schema:R,stageId:a,lawNodeId:l(r.lawNodeId,null),runtimeTarget:l(r.runtimeTarget,o?"gpu-hub-resid\
ent-stage-worker":"gpu-hub-inline-stage-executor"),executor:typeof n=="function"?n:null,workerRunner:o,workerPolicy:M({...r.
workerPolicy||r.workerResidency||{},workerReady:(r.workerPolicy||r.workerResidency||{}).workerReady||!!o},a),metadata:h(
r.metadata||{}),registeredAt:Date.now()};return this.residentStageExecutors.set(a,s),s.lawNodeId&&this.residentStageExecutorAliases.
set(s.lawNodeId,a),this.describeResidentStageExecutor(a)}describeResidentStageExecutor(e){const t=this.getResidentStageExecutorRecord(
e);return t?{schema:t.schema,stageId:t.stageId,lawNodeId:t.lawNodeId,runtimeTarget:t.runtimeTarget,workerPolicy:h(t.workerPolicy),
metadata:h(t.metadata||{}),registeredAt:t.registeredAt}:null}getResidentStageExecutorRecord(e){const t=l(typeof e=="stri\
ng"?e:(e==null?void 0:e.id)??(e==null?void 0:e.stageId),null),r=l(typeof e=="string"?null:e==null?void 0:e.lawNodeId,null);
if(t&&this.residentStageExecutors.has(t))return this.residentStageExecutors.get(t);const a=r?this.residentStageExecutorAliases.
get(r):null;return a?this.residentStageExecutors.get(a):null}hasResidentStageExecutor(e){return!!this.getResidentStageExecutorRecord(
e)}listResidentStageExecutors(){return[...this.residentStageExecutors.keys()].sort().map(e=>this.describeResidentStageExecutor(
e))}async executeResidentStage(e={}){var a,n;const t=this.getResidentStageExecutorRecord(e.stage);if(!t){const o=l(((a=e.
stage)==null?void 0:a.id)??((n=e.stage)==null?void 0:n.stageId),"unknown"),s=new Error(`[GPUHubManager] Missing resident\
 stage executor: ${o}`);throw s.code="ERR_GPU_HUB_RESIDENT_STAGE_EXECUTOR_MISSING",s.stage=e.stage||null,s}const r={...e,
gpuHub:this,device:this.device,executor:this.describeResidentStageExecutor(t.stageId)};return t.workerRunner?P(t.workerRunner,
r):t.executor(r)}registerTask(e,t){this.tasks.set(e,t)}unregisterTask(e){this.tasks.delete(e)}tick(){}}let u=null,w=null,
d=null;async function F(i={}){if(d&&!i.force)return d;const e=p();return d=await E({overrides:e,allowFallback:e.allowFallbackGpu===
!0||i.allowFallback===!0}),d}async function T(){if(u)return u;const i=p();try{return w=new D({frameBudgetMs:6}),u=await w.
initialize({promoteLimits:!0,allowFallback:i.allowFallbackGpu===!0,label:"webgpuphys-shared-gpu-hub",onDeviceLost:()=>{u=
null}}),u}catch(e){console.warn("[webgpuphys] GPU hub unavailable, falling back to local WebGPU init",e);const{device:t}=await y(
{allowFallback:i.allowFallbackGpu===!0,onDeviceLost:()=>{u=null}});return u=t,u}}export{F as a,T as g};
