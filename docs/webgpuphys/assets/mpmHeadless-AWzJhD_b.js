const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./peercomputeDevice-Aw-phKHw.js","./device-B4S7QtIr.js","./modelTask-BQ2rRn1B.js","./GgufArtifactReader-aqnFbsQk.js","./runtimeDefinition-BDC-XNMB.js","./runtimeDefinition-DygiC0Lm.js","./modelTask-C3oy8qoM.js","./runtimeDefinition-Qtdz6wxS.js","./modelTask-DL-5WZ9l.js","./modelTask-D5_ok2ve.js","./runtimeDefinition-DNLMbv4s.js","./ModelInferenceService-C2jckjK0.js"])))=>i.map(i=>d[i]);
import"./modulepreload-polyfill-cOsu8D8e.js";import{c as At}from"./headless-CxTArN2Z.js";import{c as _t}from"./diagnostics-B6-wCMvy.js";
import{_ as K,g as Tt}from"./peercomputeDevice-Aw-phKHw.js";import"./device-B4S7QtIr.js";const Te=new Map,Ie=new Map,It={
Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,
BigUint64Array};function ut(a="Uint8Array"){const e=It[a];if(!e)throw new Error(`Unsupported typed array view: ${a}`);return e}
function Pt(a){return new a.constructor(a)}function dt(a){return ArrayBuffer.isView(a)&&!(a instanceof DataView)}function Mt(a){
return a instanceof ArrayBuffer?new Uint8Array(a):dt(a)?new Uint8Array(a.buffer,a.byteOffset,a.byteLength):Array.isArray(
a)?Uint8Array.from(a):null}async function Ve(a){const e=String(a);return Te.has(e)||Te.set(e,K(()=>import(`${e}`),[],
import.meta.url)),Te.get(e)}async function Qe(a){const e=Mt(a);if(e)return e;if(typeof a=="string"||a instanceof URL){const t=await fetch(
String(a));if(!t.ok)throw new Error(`Failed to fetch wasm module: ${t.status} ${t.statusText}`);const r=await t.arrayBuffer();
return new Uint8Array(r)}throw new Error("wasm.source must be a URL string, URL, ArrayBuffer, TypedArray, or byte array")}
async function bt(a){if(typeof a=="string"||a instanceof URL){const t=String(a);return Ie.has(t)||Ie.set(t,(async()=>{const r=await Qe(
a);return WebAssembly.compile(r)})()),Ie.get(t)}const e=await Qe(a);return WebAssembly.compile(e)}async function Ct(a,e){
if(a.importsModule){const t=await Ve(a.importsModule),r=a.importsExport||"default",s=t[r];if(typeof s=="function")return await s(
e)||{};if(s&&typeof s=="object")return s;throw new Error(`WASM imports export "${r}" must be a function or object`)}return a.
imports&&typeof a.imports=="object"?a.imports:{}}function mt(a,e,t={}){var n;const r=t.exportName||e.memoryExport||"memo\
ry",s=(n=a.exports)==null?void 0:n[r];if(!(s instanceof WebAssembly.Memory))throw new Error(`WASM memory export "${r}" w\
as not found`);return s}function vt(a,e){if(Object.prototype.hasOwnProperty.call(a,"values"))return a.values;const t=a.dataKey||
a.name;if(t&&e&&Object.prototype.hasOwnProperty.call(e,t))return e[t]}function xt(a,e){if(a==null)return null;if(a instanceof
e)return a;if(dt(a))return new e(a.buffer,a.byteOffset,Math.floor(a.byteLength/e.BYTES_PER_ELEMENT));if(a instanceof ArrayBuffer)
return new e(a);if(Array.isArray(a))return e.from(a);throw new Error(`Unsupported memory input for ${e.name}`)}function Ye(a,e,t){
(Array.isArray(e.inputViews)?e.inputViews:[]).forEach(s=>{const n=ut(s.view),i=xt(vt(s,t),n);if(!i)return;const o=mt(a,e,
s),l=Number.isFinite(s.byteOffset)?s.byteOffset:0;new n(o.buffer,l,i.length).set(i)})}function Ft(a,e){const t=Array.isArray(
e.outputViews)?e.outputViews:[];if(t.length===0)return null;const r={};return t.forEach((s,n)=>{const i=ut(s.view),o=mt(
a,e,s),l=Number.isFinite(s.byteOffset)?s.byteOffset:0,c=Number.isFinite(s.length)?s.length:0;if(c<=0)throw new Error(`WA\
SM output view "${s.name||n}" must provide a positive length`);const u=s.name||`output${n}`;r[u]=Pt(new i(o.buffer,l,c))}),
r}function pt(a,e){var t;return Array.isArray(e.args)?e.args:Array.isArray(a.args)?a.args:Array.isArray((t=a.data)==null?
void 0:t.args)?a.data.args:[]}function Lt(a={}){var r,s;const e=((r=globalThis.navigator)==null?void 0:r.gpu)??null;if(((s=
a.webgpu)==null?void 0:s.required)===!0&&!e)throw new Error("WebGPU is required for this task but navigator.gpu is unava\
ilable");return{supported:!!e,gpu:e,async requestAdapter(n=(i=>(i=a.webgpu)==null?void 0:i.adapterOptions)()){return e?e.
requestAdapter(n):null},async requestDevice(n={}){var o,l;if(!e)return null;const i=n.adapter||await e.requestAdapter(n.
adapterOptions||((o=a.webgpu)==null?void 0:o.adapterOptions));return i?i.requestDevice(n.deviceDescriptor||((l=a.webgpu)==
null?void 0:l.deviceDescriptor)):null}}}async function ht(a){const e=a.wasm||{},t=e.source??a.wasmSource??a.source;if(!t)
throw new Error("wasm tasks require wasm.source");const r=await bt(t),s=await Ct(e,{task:a,data:a.data??null,WebAssembly}),
n=await WebAssembly.instantiate(r,s);return Ye(n,e,a.data??null),{module:r,instance:n,exports:n.exports,imports:s,task:a,
data:a.data??null,callExport(i,o=[]){var c;const l=(c=n.exports)==null?void 0:c[i];if(typeof l!="function")throw new Error(
`WASM export "${i}" was not found`);return l(...o)},readOutputViews(){return Ft(n,e)},writeInputViews(i){Ye(n,e,i)}}}async function Wt(a,e,t){
const r=a.wasm||{};if(!r.resultModule)return t.value;const s=await Ve(r.resultModule),n=r.resultExport||"default",i=s[n];
if(typeof i!="function")throw new Error(`WASM result export "${n}" must be a function`);const o=await i({...t,wasm:e,task:a,
data:a.data??null});return typeof o>"u"?t:o}async function Dt(a){const e=await ht(a),t=a.wasm||{},r=pt(a,t),s=t.entry?await e.
callExport(t.entry,r):void 0,n=e.readOutputViews();return Wt(a,e,{returnValue:s,outputs:n,value:n?typeof s>"u"?n:{returnValue:s,
outputs:n}:s})}async function Bt(a){var i;const e=await ht(a),t=a.hostModule||a.module;if(!t)throw new Error("wasm-webgp\
u tasks require hostModule or module");(i=a.wasm)!=null&&i.callEntryBeforeHost&&a.wasm.entry&&(e.entryResult=await e.callExport(
a.wasm.entry,pt(a,a.wasm)));const r=await Ve(t),s=a.hostExport||a.exportName||"default",n=r[s];if(typeof n!="function")throw new Error(
`wasm-webgpu host export "${s}" must be a function`);return n({task:a,data:a.data??null,wasm:e,webgpu:Lt(a)})}async function Ot(a){
if(typeof a!="string"||!a.trim())throw new Error("module path must be a non-empty string");return a==="peercompute:model\
-inference"?K(()=>import("./peercomputeDevice-Aw-phKHw.js").then(e=>e.w),__vite__mapDeps([0,1]),import.meta.url):a==="peercomp\
ute:gguf-inference"?K(()=>import("./modelTask-BQ2rRn1B.js"),__vite__mapDeps([2,3,0,1,4,5]),import.meta.url):a==="peercompute:diffusion\
-inference"?K(()=>import("./modelTask-C3oy8qoM.js"),__vite__mapDeps([6,0,1,3,7]),import.meta.url):a==="peercompute:speech-inference"?
K(()=>import("./modelTask-DL-5WZ9l.js"),__vite__mapDeps([8,0,1,5]),import.meta.url):a==="peercompute:mesh-inference"?K(()=>import("./modelTask-D5_ok2ve.js"),
__vite__mapDeps([9,0,1,3,10]),import.meta.url):K(()=>import(`${a}`),[],import.meta.url)}function qt(a={}){return typeof a.
runtime=="string"&&a.runtime.trim()?a.runtime.trim().toLowerCase():a.wasm?a.hostModule||a.module?"wasm-webgpu":"wasm":"j\
s"}async function Nt(a,e){let t;if(a.fn?t=new Function(`return (${a.fn});`)():a.module&&(t=(await Ot(a.module))[a.exportName||
"default"]),typeof t!="function")throw new Error("Handler not found for task");return t(a.data,e)}async function Gt(a,e={}){
const t=qt(a);switch(t){case"js":return Nt(a,e);case"wasm":return Dt(a);case"wasm-webgpu":return Bt(a);default:throw new Error(
`Unsupported compute runtime: ${t}`)}}const jt="peercompute.compute.solver-descriptor.v0",Kt="peercompute.compute.solver\
-task.v0";function Re(a,e){const t=String(a||"").trim();if(!t)throw new Error(`${e} is required`);return t}function oe(a){
return a==null?a:JSON.parse(JSON.stringify(a))}function Ut(a){if(typeof a=="string")return{name:Re(a,"field.name"),unit:null,
dimensions:null,location:null};if(!a||typeof a!="object")throw new Error("field must be a string or object");return{name:Re(
a.name,"field.name"),unit:a.unit??null,dimensions:a.dimensions??null,location:a.location??null,role:a.role??null}}function Pe(a=[]){
if(!Array.isArray(a))throw new Error("fields must be an array");return a.map(Ut)}function Ht(a){return a.runtime?String(
a.runtime).trim().toLowerCase():a.wasm?a.hostModule||a.module?"wasm-webgpu":"wasm":"js"}function zt(a={}){var n,i,o,l,c,
u,m;if(!a||typeof a!="object")throw new Error("solver descriptor is required");const e=Re(a.id,"solver.id"),t=Re(a.kind||
a.family,"solver.kind"),r=Ht(a),s=!!(a.module||a.fn||a.wasm||a.wasmSource||a.source);return{schema:jt,id:e,kind:t,version:a.
version||"0.0.0",label:a.label||e,description:a.description||"",runtime:r,module:a.module,exportName:a.exportName||"defa\
ult",fn:a.fn,hostModule:a.hostModule,hostExport:a.hostExport,wasm:a.wasm,wasmSource:a.wasmSource,source:a.source,webgpu:a.
webgpu||null,inputFields:Pe(a.inputFields||a.inputs||[]),outputFields:Pe(a.outputFields||a.outputs||[]),conservedFields:Pe(
a.conservedFields||a.conserved||[]),timestep:{mode:((n=a.timestep)==null?void 0:n.mode)||a.timestepMode||"explicit",maxDt:((i=
a.timestep)==null?void 0:i.maxDt)??a.maxDt??null,subcycles:((o=a.timestep)==null?void 0:o.subcycles)??a.subcycles??1},validity:oe(
a.validity||a.validityDomain||{}),affinity:{policy:((l=a.affinity)==null?void 0:l.policy)||a.affinityPolicy||"state-key",
keyFields:Array.isArray((c=a.affinity)==null?void 0:c.keyFields)?[...a.affinity.keyFields]:["solverId","stateKey"]},warmDelta:{
scope:((u=a.warmDelta)==null?void 0:u.scope)||a.scope||"solver-deltas",schema:((m=a.warmDelta)==null?void 0:m.schema)||`\
peercompute.solver.${e}.delta.v0`},metadata:oe(a.metadata||{}),hasExecutor:s}}class Vt{constructor(e=[]){this.solvers=new Map;
for(const t of e)this.register(t)}register(e){const t=zt(e);return this.solvers.set(t.id,t),t}unregister(e){return this.
solvers.delete(e)}has(e){return this.solvers.has(e)}get(e){const t=this.solvers.get(e);if(!t)throw new Error(`Solver not\
 registered: ${e}`);return t}list(){return Array.from(this.solvers.values()).map(e=>oe(e))}createTask(e,{id:t,input:r={},
stateKey:s=r.stateKey||r.taskId||e,affinityKey:n,scope:i,version:o,timestamp:l,data:c={},placementHint:u,webgpu:m}={}){const d=this.
get(e);if(!d.hasExecutor)throw new Error(`Solver has no executable task target: ${e}`);const p=t||`${d.id}:${s}:${Date.now()}`,
h=i||d.warmDelta.scope,y=u??c.placementHint??null;return{id:p,solverId:d.id,taskFamily:d.id,runtime:d.runtime,module:d.module,
exportName:d.exportName,fn:d.fn,hostModule:d.hostModule,hostExport:d.hostExport,wasm:d.wasm,wasmSource:d.wasmSource,source:d.
source,webgpu:m||d.webgpu||void 0,affinityKey:n||`${d.id}:${s}`,placementHint:oe(y),data:{schema:Kt,solver:{id:d.id,kind:d.
kind,version:d.version,inputFields:d.inputFields,outputFields:d.outputFields,conservedFields:d.conservedFields,timestep:d.
timestep,validity:d.validity,warmDelta:{scope:h,schema:d.warmDelta.schema}},stateKey:s,scope:h,version:o??null,timestamp:l??
Date.now(),input:r,...c,placementHint:oe(y)}}}}const $t="peercompute.compute.gpu-resident-lane-manager.v0",Jt="peercompu\
te.compute.gpu-resident-lane.v0",Qt="peercompute.compute.gpu-resident-lane-lease.v0",Yt="peercompute.compute.gpu-residen\
t-lane-lease-identity.v0",Xt="peercompute.compute.gpu-resident-lane-execution.v0",ft="peercompute.compute.gpu-resident-l\
ane-copy-budget.v0",Zt="peercompute.compute.gpu-fence-report.v0",er="peercompute.compute.gpu-resident-lane-stage-plan.v0",
tr="peercompute.compute.gpu-resident-lane-stage-execution.v0",rr="peercompute.compute.gpu-resident-lane-stage-placement-\
preflight.v0",Ge="queue.onSubmittedWorkDone-before-readback-map",yt="explicit-stage-dependencies",Xe="sequential-stage-o\
rder",ar="defer-read-write-conflicting-ready-stages";function he(a,e=0){const t=Number(a);return Number.isFinite(t)?t:e}
function b(a,e=null){return String(a??"").trim()||e}function q(a,e=[]){return Array.isArray(a)?a.map(t=>b(t)).filter(Boolean):
typeof a=="string"?a.split(",").map(t=>b(t)).filter(Boolean):[...e]}function L(a){return a==null?a:JSON.parse(JSON.stringify(
a))}function Ze(a={}){const e=(a==null?void 0:a.residentSequenceLaneContract)||(a==null?void 0:a.residentLaneContract)||
(a==null?void 0:a.laneContract)||(a==null?void 0:a.executionContract)||null;return!e||typeof e!="object"?null:L(e)}function sr(a={},e=0){
const t=b(a.id,`stage:${e}`);return{...L(a),id:t,index:e,lawNodeId:b(a.lawNodeId,null),runtimeTarget:b(a.runtimeTarget,null),
dependsOn:q(a.dependsOn??a.dependencies),inputFrom:b(a.inputFrom??a.primaryInputFrom??a.inputStageId,null),reads:q(a.reads??
a.readFamilies),writes:q(a.writes??a.writeFamilies)}}function fe(a=null,{laneId:e=null,stateKey:t=null,domainKey:r=null,
queueFencePolicy:s=null}={}){if(!a||typeof a!="object")return null;const n=Array.isArray(a.passDagStages)?a.passDagStages.
map((o,l)=>sr(o,l)):[],i=b(a.stageDependencyMode??a.dependencyMode,n.some(o=>o.dependsOn.length>0)||a.parallelStageExecution===
!0?"explicit-stage-dependencies":"sequential-stage-order");return{schema:er,status:n.length>0?a.sequenceRunnable===!0?"c\
ontract-stage-plan-ready":"contract-stage-plan-review-only":"contract-stage-plan-empty",authority:"compute-manager-gpu-r\
esident-lane-manager",laneId:b(a.laneId,e),stateKey:b(a.stateKey,t),domainKey:b(a.domainKey,r),queueFencePolicy:b(a.queueFencePolicy,
s||Ge),contractSchema:b(a.schema,null),contractStatus:b(a.status,null),sequenceMode:b(a.sequenceMode,null),sequenceRunnable:a.
sequenceRunnable===!0,defaultEnabled:a.defaultEnabled===!0,dependencyMode:i,parallelStageExecution:i==="explicit-stage-d\
ependencies",stageCount:n.length,stages:n}}function nr(a={}){var t;const e=a&&typeof a=="object"?a:{value:a};return{value:Object.
prototype.hasOwnProperty.call(e,"value")?e.value:a,retainedBufferRefs:q(e.retainedBufferRefs??((t=e.gpuFence)==null?void 0:
t.retainedBufferRefs)),gpuFence:e.gpuFence&&typeof e.gpuFence=="object"?L(e.gpuFence):null,summary:e.summary&&typeof e.summary==
"object"?L(e.summary):null}}function Ee(a={}){const e=a.copyBudget&&typeof a.copyBudget=="object"?a.copyBudget:a;return{
schema:ft,uploadBytes:Math.max(0,Math.round(he(e.uploadBytes??e.expectedUploadBytes,0))),readbackBytes:Math.max(0,Math.round(
he(e.readbackBytes??e.expectedReadbackBytes,0))),retainedBytes:Math.max(0,Math.round(he(e.retainedBytes??e.expectedRetainedBytes,
0))),compactSummaryBytes:Math.max(0,Math.round(he(e.compactSummaryBytes??e.summaryBytes,0))),fullReadbackReason:b(e.fullReadbackReason??
e.readbackReason,null)}}function ir(a={},e={}){const t=Ee(a),r=Ee(e);return{schema:ft,uploadBytes:t.uploadBytes+r.uploadBytes,
readbackBytes:t.readbackBytes+r.readbackBytes,retainedBytes:Math.max(t.retainedBytes,r.retainedBytes),compactSummaryBytes:t.
compactSummaryBytes+r.compactSummaryBytes,fullReadbackReason:r.fullReadbackReason||t.fullReadbackReason||null}}function or(a={}){
return a.parallelStageExecution===!0||a.dependencyMode===yt||(a.stages||[]).some(e=>(e.dependsOn||[]).length>0)}function lr(a,{
baseInput:e=null,currentValue:t=null,stageValues:r={}}={}){if(a.inputFrom&&Object.prototype.hasOwnProperty.call(r,a.inputFrom))
return r[a.inputFrom];const s=q(a.dependsOn);return s.length===1&&Object.prototype.hasOwnProperty.call(r,s[0])?r[s[0]]:s.
length>1?{source:"gpu-resident-lane-stage-dependencies",dependencyResults:Object.fromEntries(s.map(n=>[n,r[n]])),previousValue:t,
baseInput:e}:t}function Me(a=[],e=[]){const t=new Set(q(e));return q(a).filter(r=>t.has(r))}function cr(a={},e={}){const t=Me(
a.writes,e.writes);if(t.length>0)return{conflictType:"write-write",families:t};const r=Me(a.writes,e.reads);if(r.length>
0)return{conflictType:"write-read",families:r};const s=Me(a.reads,e.writes);return s.length>0?{conflictType:"read-write",
families:s}:null}function ur(a=[]){const e=[],t=[];for(const r of a){const s=e.map(n=>({stage:n,conflict:cr(n,r)})).find(
n=>n.conflict);s?t.push({stageId:r.id,blockedByStageId:s.stage.id,conflictType:s.conflict.conflictType,families:s.conflict.
families}):e.push(r)}return{batch:e,deferred:t}}function dr(a={}){const e=new Set((a.stages||[]).map(t=>t.id));for(const t of a.
stages||[])for(const r of t.dependsOn||[])if(!e.has(r)){const s=new Error(`GPU resident lane stage ${t.id} depends on un\
known stage ${r}`);throw s.code="ERR_GPU_RESIDENT_LANE_STAGE_DEPENDENCY_MISSING",s.stage=L(t),s}}function et(a={}){dr(a);
const e=or(a),t=[],r=[];if(e){const s=new Map((a.stages||[]).map(i=>[i.id,i])),n=new Set;for(;s.size>0;){const i=(a.stages||
[]).filter(u=>s.has(u.id)).filter(u=>(u.dependsOn||[]).every(m=>n.has(m)));if(!i.length){const u=new Error(`GPU resident\
 lane stage plan has a cycle or unsatisfied dependencies: ${Array.from(s.keys()).join(", ")}`);throw u.code="ERR_GPU_RES\
IDENT_LANE_STAGE_DEPENDENCY_CYCLE",u}const{batch:o,deferred:l}=ur(i),c=t.length;r.push(...l.map(u=>({...u,batchIndex:c}))),
t.push(o.map(u=>u.id));for(const u of o)s.delete(u.id),n.add(u.id)}}else for(const s of a.stages||[])t.push([s.id]);return{
dependencyMode:e?yt:Xe,parallelStageExecution:e,stateFamilyConflictPolicy:e?ar:Xe,stateFamilyConflictDeferrals:r,stateFamilyConflictDeferralCount:r.
length,executionBatches:t,maxConcurrentStageCount:t.reduce((s,n)=>Math.max(s,n.length),0)}}function mr(a={},{batchIndex:e=-1,
executorSource:t=null,gpuHubExecutorDescriptor:r=null}={}){const s=L(r==null?void 0:r.workerPolicy),n=b(s==null?void 0:s.
mode,null),i=(s==null?void 0:s.status)==="worker-ready",o=n==="dedicated-worker";let l="missing-stage-executor";return t===
"stage-plan-executor"?l="stage-plan-executor":t==="provided-stage-executor"?l="provided-stage-executor":t==="gpu-hub-res\
ident-stage-executor"&&(i?l="gpu-hub-worker-resident-stage":o?l="gpu-hub-inline-fallback-for-worker-stage":l="gpu-hub-in\
line-resident-stage"),{stageId:a.id,lawNodeId:a.lawNodeId,runtimeTarget:a.runtimeTarget,batchIndex:e,dependsOn:q(a.dependsOn),
inputFrom:b(a.inputFrom,null),reads:q(a.reads),writes:q(a.writes),executorSource:t,placementTarget:l,gpuHubExecutorDescriptor:L(
r),workerPolicy:s,workerResidencyStatus:(s==null?void 0:s.status)||null,workerRequested:o,workerReady:i,sameDeviceRequired:(s==
null?void 0:s.sameDeviceRequired)===!0,bufferTransferPolicy:(s==null?void 0:s.bufferTransferPolicy)||null}}function pr(a){
return["gpu-fence-completed","queue-work-completed","readback-map-completed","ordered-before-consumer-queue-completed"].
includes(String(a||""))}class hr{constructor({gpuHub:e=null,deviceId:t="gpu-hub",now:r=()=>Date.now()}={}){this.gpuHub=e,
this.deviceId=t,this.now=r,this.lanes=new Map,this.leases=new Map,this.nextLeaseOrdinal=1,this.stats={schema:$t,laneCount:0,
activeLeaseCount:0,completedLeaseCount:0,rejectedLeaseCount:0,totalUploadBytes:0,totalReadbackBytes:0,totalCompactSummaryBytes:0,
maxRetainedBytes:0,lastFence:null}}resolveLaneId({laneId:e,stateKey:t,domainKey:r,solverId:s}={}){return b(e,`gpu-lane:${b(
t||r||s,"default")}`)}getOrCreateLane(e={}){const t=this.resolveLaneId(e),r=b(e.stateKey,null),s=b(e.sourceFamily,null),
n=this.lanes.get(t);if(n){if(r&&n.stateKey&&n.stateKey!==r)throw new Error(`GPU resident lane ${t} already owns stateKey\
 ${n.stateKey}, not ${r}`);if(r&&!n.stateKey&&(n.stateKey=r),s&&n.sourceFamily&&n.sourceFamily!==s)throw new Error(`GPU \
resident lane ${t} already owns sourceFamily ${n.sourceFamily}, not ${s}`);return s&&!n.sourceFamily&&(n.sourceFamily=s),
e.domainKey&&!n.domainKey&&(n.domainKey=b(e.domainKey,null)),e.solverId&&!n.solverId&&(n.solverId=b(e.solverId,null)),n}
const i={schema:Jt,laneId:t,stateKey:r,sourceFamily:s,domainKey:b(e.domainKey,null),solverId:b(e.solverId,null),deviceId:b(
e.deviceId,this.deviceId),queueFencePolicy:b(e.queueFencePolicy,Ge),status:"ready",activeLeases:new Map,retainedBufferRefs:new Set(
q(e.retainedBufferRefs)),copyBudget:Ee(e.copyBudget||{}),residentSequenceLaneContract:Ze(e),stagePlan:null,createdAt:this.
now(),updatedAt:this.now(),lastFence:null};return i.stagePlan=fe(i.residentSequenceLaneContract,i),this.lanes.set(t,i),this.
stats.laneCount=this.lanes.size,i}acquireLease(e={}){const t=this.getOrCreateLane(e),r=b(e.leaseId,`${t.laneId}:lease:${this.
nextLeaseOrdinal++}`);if(this.leases.has(r))throw new Error(`GPU resident lane lease already exists: ${r}`);const s=Ee(e.
copyBudget||{}),n=Ze(e)||L(t.residentSequenceLaneContract),i=fe(n,{laneId:t.laneId,stateKey:t.stateKey,domainKey:t.domainKey,
queueFencePolicy:t.queueFencePolicy});n&&(t.residentSequenceLaneContract=L(n),t.stagePlan=L(i));const o={schema:Qt,leaseId:r,
laneId:t.laneId,stateKey:t.stateKey,sourceFamily:b(e.sourceFamily,t.sourceFamily),domainKey:t.domainKey,solverId:b(e.solverId,
t.solverId),taskId:b(e.taskId,null),owner:b(e.owner,"compute-manager"),readFamilies:q(e.readFamilies),writeFamilies:q(e.
writeFamilies),retainedBufferRefs:q(e.retainedBufferRefs),copyBudget:s,queueFencePolicy:t.queueFencePolicy,residentSequenceLaneContract:n,
stagePlan:i,stageExecution:null,status:"active",acquiredAt:this.now(),releasedAt:null,releaseReason:null,gpuFence:null};
this.leases.set(r,o),t.activeLeases.set(r,o),t.copyBudget=ir(t.copyBudget,s);for(const l of o.retainedBufferRefs)t.retainedBufferRefs.
add(l);return t.updatedAt=this.now(),this.stats.activeLeaseCount=this.leases.size,this.stats.totalUploadBytes+=s.uploadBytes,
this.stats.totalReadbackBytes+=s.readbackBytes,this.stats.totalCompactSummaryBytes+=s.compactSummaryBytes,this.stats.maxRetainedBytes=
Math.max(this.stats.maxRetainedBytes,s.retainedBytes),L(o)}createFenceReport(e,{status:t="queue-work-completed",method:r="\
queue.onSubmittedWorkDone",queueCompletionStatus:s=t,queueCompletionMethod:n=r,readbackCompletionStatus:i=null,readbackCompletionMethod:o=null,
retainedBufferRefs:l=null,completed:c=null,source:u="gpu-resident-lane-manager"}={}){const m=typeof e=="string"?this.leases.
get(e):e;if(!m)throw new Error(`Unknown GPU resident lane lease: ${e}`);const d=this.lanes.get(m.laneId),p=c==null?pr(t):
c===!0;return{schema:Zt,status:t,method:r,fenceSatisfied:p,required:!0,laneId:m.laneId,stateKey:m.stateKey,queueFencePolicy:m.
queueFencePolicy||(d==null?void 0:d.queueFencePolicy)||Ge,queueCompletionStatus:s,queueCompletionMethod:n,readbackCompletionStatus:i,
readbackCompletionMethod:o,retainedBufferRefs:q(l,m.retainedBufferRefs),workerId:null,deviceId:(d==null?void 0:d.deviceId)||
this.deviceId,completedAt:p?this.now():null,source:u}}completeLease(e,t={}){const r=this.leases.get(e);if(!r)throw new Error(
`Unknown GPU resident lane lease: ${e}`);const s=this.lanes.get(r.laneId),n=this.createFenceReport(r,t);if(r.status=n.fenceSatisfied?
"completed":"completed-unsatisfied-fence",r.gpuFence=n,r.releasedAt=this.now(),r.releaseReason=t.releaseReason||r.status,
Array.isArray(t.retainedBufferRefs)&&(r.retainedBufferRefs=q(t.retainedBufferRefs)),s){s.activeLeases.delete(e),s.lastFence=
n,s.updatedAt=this.now();for(const i of r.retainedBufferRefs)s.retainedBufferRefs.add(i)}return this.leases.delete(e),this.
stats.activeLeaseCount=this.leases.size,this.stats.completedLeaseCount+=1,this.stats.lastFence=L(n),{schema:Xt,lease:L(r),
gpuFence:n,lane:s?this.snapshotLane(s.laneId):null,residentSequenceLaneContract:L(r.residentSequenceLaneContract),stagePlan:L(
r.stagePlan),stageExecution:L(r.stageExecution)}}async executeStagePlan(e,{input:t=null,context:r={},executor:s=null,stageExecutors:n={},
allowMissingExecutors:i=!1}={}){const o=typeof e=="string"?this.leases.get(e):e;if(!o)throw new Error(`Unknown GPU resid\
ent lane lease: ${e}`);const l=this.lanes.get(o.laneId),c=o.stagePlan||fe(o.residentSequenceLaneContract,{laneId:o.laneId,
stateKey:o.stateKey,domainKey:o.domainKey,queueFencePolicy:o.queueFencePolicy});if(!c||!Array.isArray(c.stages)||c.stages.
length===0){const k=new Error(`GPU resident lane lease ${o.leaseId} has no executable stage plan`);throw k.code="ERR_GPU\
_RESIDENT_LANE_STAGE_PLAN_MISSING",k}const u=this.now(),m=[],d={},p=et(c),h=new Map(c.stages.map(k=>[k.id,k]));let y=t;const f=async(k,P)=>{
var N;let E=typeof s=="function"?s:(n==null?void 0:n[k.id])||(n==null?void 0:n[k.lawNodeId]),A=typeof s=="function"?"sta\
ge-plan-executor":E?"provided-stage-executor":null;typeof E!="function"&&this.gpuHub&&typeof this.gpuHub.hasResidentStageExecutor==
"function"&&this.gpuHub.hasResidentStageExecutor(k)&&typeof this.gpuHub.executeResidentStage=="function"&&(E=W=>this.gpuHub.
executeResidentStage(W),A="gpu-hub-resident-stage-executor");const v=A==="gpu-hub-resident-stage-executor"&&typeof((N=this.
gpuHub)==null?void 0:N.describeResidentStageExecutor)=="function"?this.gpuHub.describeResidentStageExecutor(k):null;if(typeof E!=
"function"){if(!i){const W=new Error(`Missing GPU resident lane stage executor: ${k.id}`);throw W.code="ERR_GPU_RESIDENT\
_LANE_STAGE_EXECUTOR_MISSING",W.stage=L(k),W}return{result:{stageId:k.id,lawNodeId:k.lawNodeId,status:"blocked-missing-s\
tage-executor",retainedBufferRefs:[],workerResidency:null},value:P}}const B=this.now(),D=await E({stage:L(k),stageIndex:k.
index,input:P,lease:L(o),lane:l?this.snapshotLane(l.laneId):null,context:r}),F=nr(D),O=q(F.retainedBufferRefs);if(O.length>
0&&(o.retainedBufferRefs=q([...o.retainedBufferRefs,...O]),l)){for(const W of O)l.retainedBufferRefs.add(W);l.updatedAt=
this.now()}return{result:{stageId:k.id,lawNodeId:k.lawNodeId,runtimeTarget:k.runtimeTarget,status:"completed",executorSource:A,
startedAt:B,completedAt:this.now(),retainedBufferRefs:O,gpuFence:F.gpuFence,workerResidency:L(v==null?void 0:v.workerPolicy),
summary:F.summary},value:F.value}};if(p.parallelStageExecution===!0)for(const k of p.executionBatches){const P=k.map(A=>h.
get(A)).filter(Boolean),E=await Promise.all(P.map(A=>f(A,lr(A,{baseInput:t,currentValue:y,stageValues:d}))));for(let A=0;A<
P.length;A+=1){const v=P[A],B=E[A];d[v.id]=B.value,y=B.value,m.push(B.result)}}else for(const k of p.executionBatches){const P=h.
get(k[0]),E=await f(P,y);y=E.value,d[P.id]=E.value,m.push(E.result)}const w=m.some(k=>k.status!=="completed"),I={schema:tr,
status:w?"blocked":"completed",leaseId:o.leaseId,laneId:o.laneId,stateKey:o.stateKey,stagePlan:L(c),stageCount:c.stages.
length,completedStageCount:m.filter(k=>k.status==="completed").length,dependencyMode:p.dependencyMode,parallelStageExecution:p.
parallelStageExecution,stateFamilyConflictPolicy:p.stateFamilyConflictPolicy,stateFamilyConflictDeferrals:p.stateFamilyConflictDeferrals,
stateFamilyConflictDeferralCount:p.stateFamilyConflictDeferralCount,executionBatches:p.executionBatches,maxConcurrentStageCount:p.
maxConcurrentStageCount,stageResults:m,retainedBufferRefs:q(o.retainedBufferRefs),output:y,startedAt:u,completedAt:this.
now()};return o.stageExecution=L(I),l&&(l.updatedAt=this.now()),I}preflightStagePlacement(e,{executor:t=null,stageExecutors:r={},
allowMissingExecutors:s=!1}={}){const n=typeof e=="string"?this.leases.get(e):e;if(!n)throw new Error(`Unknown GPU resid\
ent lane lease: ${e}`);const i=this.lanes.get(n.laneId),o=n.stagePlan||fe(n.residentSequenceLaneContract,{laneId:n.laneId,
stateKey:n.stateKey,domainKey:n.domainKey,queueFencePolicy:n.queueFencePolicy});if(!o||!Array.isArray(o.stages)||o.stages.
length===0){const f=new Error(`GPU resident lane lease ${n.leaseId} has no executable stage plan`);throw f.code="ERR_GPU\
_RESIDENT_LANE_STAGE_PLAN_MISSING",f}const l=et(o),c=new Map;l.executionBatches.forEach((f,g)=>{for(const w of f)c.set(w,
g)});const u=o.stages.map(f=>{let g=typeof t=="function"?t:(r==null?void 0:r[f.id])||(r==null?void 0:r[f.lawNodeId]),w=typeof t==
"function"?"stage-plan-executor":g?"provided-stage-executor":null,I=null;return typeof g!="function"&&this.gpuHub&&typeof this.
gpuHub.hasResidentStageExecutor=="function"&&this.gpuHub.hasResidentStageExecutor(f)&&typeof this.gpuHub.describeResidentStageExecutor==
"function"&&(I=this.gpuHub.describeResidentStageExecutor(f),w="gpu-hub-resident-stage-executor"),mr(f,{batchIndex:c.get(
f.id)??-1,executorSource:w,gpuHubExecutorDescriptor:I})}),m=u.filter(f=>!f.executorSource).map(f=>f.stageId),d=u.filter(
f=>f.workerRequested).map(f=>f.stageId),p=u.filter(f=>f.workerReady).map(f=>f.stageId),h=u.filter(f=>f.workerRequested&&
!f.workerReady).map(f=>f.stageId),y=s===!0||m.length===0;return{schema:rr,status:y?"placement-preflight-ready":"blocked-\
missing-stage-executors",authority:"compute-manager-gpu-resident-lane-manager",advisory:!0,leaseId:n.leaseId,laneId:n.laneId,
stateKey:n.stateKey,domainKey:n.domainKey,deviceId:(i==null?void 0:i.deviceId)||this.deviceId,stagePlan:L(o),stageCount:o.
stages.length,dependencyMode:l.dependencyMode,parallelStageExecution:l.parallelStageExecution,stateFamilyConflictPolicy:l.
stateFamilyConflictPolicy,stateFamilyConflictDeferrals:l.stateFamilyConflictDeferrals,stateFamilyConflictDeferralCount:l.
stateFamilyConflictDeferralCount,placementBatches:l.executionBatches,maxConcurrentStageCount:l.maxConcurrentStageCount,stagePlacements:u,
executorSources:Object.fromEntries(u.map(f=>[f.stageId,f.executorSource])),workerResidencyStatuses:Object.fromEntries(u.
map(f=>[f.stageId,f.workerResidencyStatus])),missingExecutorStageIds:m,missingExecutorCount:m.length,workerRequestedStageIds:d,
workerRequestedCount:d.length,workerReadyStageIds:p,workerReadyCount:p.length,workerFallbackStageIds:h,workerFallbackCount:h.
length,canExecute:y,createdAt:this.now()}}planStagePlacement(e,t={}){return this.preflightStagePlacement(e,t)}rejectLease(e,t="\
lane-validation-rejected"){const r=this.leases.get(e);if(!r)throw new Error(`Unknown GPU resident lane lease: ${e}`);const s=this.
lanes.get(r.laneId);return r.status="rejected",r.releasedAt=this.now(),r.releaseReason=t,s&&(s.activeLeases.delete(e),s.
updatedAt=this.now()),this.leases.delete(e),this.stats.activeLeaseCount=this.leases.size,this.stats.rejectedLeaseCount+=
1,L(r)}snapshotLane(e){const t=this.lanes.get(e);return t?{schema:t.schema,laneId:t.laneId,stateKey:t.stateKey,domainKey:t.
domainKey,solverId:t.solverId,deviceId:t.deviceId,queueFencePolicy:t.queueFencePolicy,status:t.status,activeLeaseCount:t.
activeLeases.size,retainedBufferRefs:[...t.retainedBufferRefs].sort(),copyBudget:L(t.copyBudget),residentSequenceLaneContract:L(
t.residentSequenceLaneContract),stagePlan:L(t.stagePlan),createdAt:t.createdAt,updatedAt:t.updatedAt,lastFence:L(t.lastFence)}:
null}listLanes(){return[...this.lanes.keys()].sort().map(e=>this.snapshotLane(e))}getStats(){return{...L(this.stats),laneCount:this.
lanes.size,activeLeaseCount:this.leases.size,lanes:this.listLanes()}}}function fr(){return new Worker(new URL(""+new URL(
"computeWorker-BtKNR_l1.js",import.meta.url).href,import.meta.url),{type:"module"})}const tt=128,rt=5e3,yr="peercompute.\
compute.worker-utilization.v0",at="peercompute.compute.task-placement.v0",kr="peercompute.compute.remote-placement-prove\
nance.v0",be="peercompute.compute.remote-placement-verification.v0",st="peercompute.compute.remote-placement-validation.\
v0",ne="peercompute.compute.remote-placement-retry.v0",nt="peercompute.compute.remote-task-envelope.v0",it="peercompute.\
compute.task-packet.v0",gr="peercompute.compute.task-execution.v0",ot="peercompute.compute.task-graph-result.v0",wr="pee\
rcompute.compute.task-graph-context.v0",Rr="peercompute.compute.task-graph-cache-policy.v0",Er="peercompute.compute.task\
-graph-cache-inputs.v0",Sr="peercompute.compute.task-graph-cache-artifact.v0",je="peercompute.compute.task-graph-cache-a\
dmission.v0",lt="peercompute.compute.remote-task-graph-cache-import.v0",Ar="peercompute.compute.remote-task-graph-state-\
seed-policy.v0",_r="peercompute.compute.task-graph-placement-policy.v0",Ce="peercompute.compute.task-graph-cancellation.\
v0",kt="peercompute.compute.task-graph-gpu-resident-lane.v0",Tr="peercompute.compute.gpu-fence-report.v0",Z=["timeout","\
executor-error"],ye=["rejected","verification-failed","validation-failed"],Ir=["maxBufferSize","maxStorageBufferBindingS\
ize","maxComputeWorkgroupStorageSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupsPerDimension"];function S(a,e,t=0,r=Number.
MAX_SAFE_INTEGER){const s=Math.floor(Number(a));return Number.isFinite(s)?Math.min(r,Math.max(t,s)):e}function j(a,e,t=0,r=Number.
MAX_SAFE_INTEGER){const s=Number(a);return Number.isFinite(s)?Math.min(r,Math.max(t,s)):e}function Pr({cpuCores:a,deviceMemoryGB:e,
gpuAvailable:t,declaredTier:r}){return r?String(r):a>=32||e>=64?"cluster":t&&(a>=12||e>=16)?"workstation":a<=4||e&&e<=4?
"mobile":"laptop"}function Ke(a){return a==="cluster"?8192:a==="workstation"?2048:a==="mobile"?384:1024}function gt(a){return a===
"cluster"?4096:a==="workstation"?1024:a==="mobile"?192:512}function Mr({tier:a,deviceMemoryGB:e}){const t=Ke(a);if(!e)return t;
const r=e*1024*.25;return Math.max(128,Math.min(t,r))}function wt(a={}){if(!a)return null;const e=a.gpuLimits||a,t={};for(const r of Ir){
const s=S(e[r],null,0,Number.MAX_SAFE_INTEGER);s!=null&&(t[r]=s)}return Object.keys(t).length>0?t:null}function ve(a={},e={}){
const t=typeof navigator<"u"?navigator:null,r=S(a.cpuCores??a.hardwareConcurrency??(t==null?void 0:t.hardwareConcurrency),
4,1,512),s=j(a.deviceMemoryGB??a.deviceMemory??(t==null?void 0:t.deviceMemory),null,0,2048),n=a.gpuAvailable??e.webgpu??
!!(t!=null&&t.gpu),i=Pr({cpuCores:r,deviceMemoryGB:s??0,gpuAvailable:n,declaredTier:a.tier||a.deviceClass}),o=j(a.memoryBudgetMB??
a.ramBudgetMB,Mr({tier:i,deviceMemoryGB:s}),0,1048576),l=j(a.gpuMemoryBudgetMB??a.gpuBudgetMB??a.vramBudgetMB,n?gt(i):0,
0,1048576),c=j(a.budgetScale??a.resourceBudgetScale??a.computeScale,1,.05,64),u=wt(a.gpuLimits||{maxBufferSize:a.gpuMaxBufferSize??
a.maxBufferSize,maxStorageBufferBindingSize:a.gpuMaxStorageBufferBindingSize??a.maxStorageBufferBindingSize,maxComputeWorkgroupStorageSize:a.
gpuMaxComputeWorkgroupStorageSize??a.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:a.gpuMaxComputeInvocationsPerWorkgroup??
a.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:a.gpuMaxComputeWorkgroupsPerDimension??a.maxComputeWorkgroupsPerDimension});
return{schema:"peercompute.compute.resource-profile.v0",tier:i,cpuCores:r,deviceMemoryGB:s,memoryBudgetMB:o,gpuMemoryBudgetMB:l,
budgetScale:c,gpuLimits:u,gpuLimitsSource:u?a.gpuLimitsSource||"configured":null,gpuAvailable:!!n,wasmAvailable:!!e.wasm,
source:a.source||(a.tier?"configured":"browser")}}function br(a){const e=a.cpuCores||4;return a.tier==="cluster"?Math.min(
64,Math.max(8,e)):a.tier==="workstation"?Math.min(16,Math.max(4,e)):a.tier==="mobile"?Math.min(2,Math.max(1,e)):Math.min(
8,Math.max(2,Math.floor(e*.75)))}function xe(a={},e){const t=S(a.maxWorkers,null,1,tt),r=br(e),s=t??Math.min(tt,Math.max(
r,e.cpuCores||r)),n=S(a.minWorkers,Math.min(s,e.tier==="mobile"?1:2),0,s),i=S(a.targetWorkers??a.initialWorkers,Math.min(
s,Math.max(n,r)),n,s);return{schema:"peercompute.compute.worker-policy.v0",autoScale:a.autoScaleWorkers!==!1,minWorkers:n,
targetWorkers:i,maxWorkers:s,scaleUpQueueDepth:S(a.scaleUpQueueDepth,1,1,1024),idleScaleDownMs:S(a.idleScaleDownMs,5e3,0,
6e5)}}function Cr(a){return a==="cluster"?4:a==="workstation"?2:a==="mobile"?.5:1}function vr(a){return a==="cluster"?4:
a==="workstation"?2:1}function xr(a){return a==="cluster"?64:a==="workstation"?16:a==="mobile"?2:8}function ke(a,e=1){return j(
a,e,.25,8)}function Fr(a){const e=String(a||"");return e==="manual"||e==="demo-api"||e.startsWith("manual-")||e.startsWith(
"user-")}function Lr(a,e){const t=Math.max(1,e);return Math.max(t,Math.round(a/t)*t)}function z(){return typeof performance<
"u"&&typeof performance.now=="function"?performance.now():Date.now()}function Wr(a){const e=Math.max(0,Number(a)||0);return e<=
0?Promise.resolve():new Promise(t=>setTimeout(t,e))}function Fe(){return{submitted:0,completed:0,failed:0,averageDurationMs:0,
lastDurationMs:0,maxDurationMs:0,totalDurationMs:0}}function Dr(){return{submitted:0,attempted:0,completed:0,failed:0,retried:0,
retryExhausted:0,timedOut:0,rejected:0,verificationFailed:0,validationFailed:0}}function C(a,e=[]){return Array.isArray(
a)?a.map(t=>String(t||"").trim()).filter(Boolean):typeof a=="string"?a.split(",").map(t=>t.trim()).filter(Boolean):[...e]}
function ge(...a){const e=new Set,t=[];for(const r of a)for(const s of C(r,[]))e.has(s)||(e.add(s),t.push(s));return t}function _(...a){
for(const e of a)if(e!=null)return e;return null}function Br(a={}){var l,c,u,m;const e=a.webgpu||((l=a.data)==null?void 0:
l.webgpu)||{},t=a.gpuFence||a.gpuFenceRequirement||e.gpuFence||e.fence||e.fenceRequirement||{},r=t.required===!0||t.fenceRequired===
!0||e.fenceRequired===!0||e.requiresFence===!0||e.requiresQueueFence===!0,s=_(t.laneId,t.gpuLaneId,e.laneId,e.gpuLaneId),
n=_(t.stateKey,t.gpuStateKey,e.stateKey,e.gpuStateKey,a.stateKey,(c=a.data)==null?void 0:c.stateKey,(m=(u=a.data)==null?
void 0:u.input)==null?void 0:m.stateKey),i=_(t.queueFencePolicy,t.fencePolicy,e.queueFencePolicy,e.fencePolicy),o=C(t.retainedBufferRefs??
e.retainedBufferRefs,[]);return!r&&!s&&!n&&!i&&o.length===0?null:{schema:"peercompute.compute.gpu-fence-requirement.v0",
required:r,laneId:s?String(s):null,stateKey:n?String(n):null,queueFencePolicy:i?String(i):null,retainedBufferRefs:o,source:t.
source||(e&&Object.keys(e).length>0?"task.webgpu":"task.gpuFence")}}function Or(a={},e=null){var y,f,g,w,I,k,P,E,A,v,B,D,
F,O;const t=a.webgpu||((y=a.data)==null?void 0:y.webgpu)||{},r=a.gpuResidentLane||a.gpuResidentLaneLease||a.residentLane||
t.gpuResidentLane||t.residentLane||{},s=_(r.residency,t.residency,a.residency,(f=a.data)==null?void 0:f.residency),n=r.enabled===
!0||r.required===!0||r.leaseRequired===!0||String(s||"").trim().toLowerCase()==="gpu-lane",i=_(r.laneId,r.gpuLaneId,t.laneId,
t.gpuLaneId,e==null?void 0:e.laneId),o=_(r.stateKey,r.gpuStateKey,t.stateKey,t.gpuStateKey,a.stateKey,(g=a.data)==null?void 0:
g.stateKey,(I=(w=a.data)==null?void 0:w.input)==null?void 0:I.stateKey,e==null?void 0:e.stateKey),l=_(r.domainKey,r.domain,
t.domainKey,a.domainKey,(k=a.data)==null?void 0:k.domainKey),c=_(r.sourceFamily,t.sourceFamily,(P=a.data)==null?void 0:P.
sourceFamily,(A=(E=a.data)==null?void 0:E.input)==null?void 0:A.sourceFamily),u=_(r.queueFencePolicy,r.fencePolicy,t.queueFencePolicy,
e==null?void 0:e.queueFencePolicy),m=C(r.retainedBufferRefs??t.retainedBufferRefs,(e==null?void 0:e.retainedBufferRefs)||
[]),d=r.copyBudget&&typeof r.copyBudget=="object"?JSON.parse(JSON.stringify(r.copyBudget)):t.copyBudget&&typeof t.copyBudget==
"object"?JSON.parse(JSON.stringify(t.copyBudget)):{},p=_(r.residentSequenceLaneContract,r.residentLaneContract,r.laneContract,
t.residentSequenceLaneContract,(v=a.data)==null?void 0:v.residentSequenceLaneContract,(D=(B=a.data)==null?void 0:B.input)==
null?void 0:D.residentSequenceLaneContract,(F=a.lawGraphNode)==null?void 0:F.residentSequenceLaneContract,null);return!n&&
!i&&!o&&m.length===0&&Object.keys(d).length===0?null:{schema:"peercompute.compute.gpu-resident-lane-task.v0",enabled:!0,
localExecution:String(_(r.localExecution,r.executionMode,t.localExecution,"inline")||"inline").trim().toLowerCase()==="w\
orker"?"worker":"inline",laneId:i?String(i):null,stateKey:o?String(o):null,sourceFamily:c?String(c):null,domainKey:l?String(
l):null,solverId:_(r.solverId,a.solverId,(O=a.data)==null?void 0:O.solverId)||null,owner:_(r.owner,a.owner,a.taskFamily,
a.solverId,"compute-manager-task"),readFamilies:C(r.readFamilies??r.reads??t.readFamilies),writeFamilies:C(r.writeFamilies??
r.writes??t.writeFamilies),retainedBufferRefs:m,queueFencePolicy:u?String(u):null,copyBudget:d,residentSequenceLaneContract:p&&
typeof p=="object"?M(p):null}}function M(a){if(a==null)return a;if(typeof structuredClone=="function")try{return structuredClone(
a)}catch{}return JSON.parse(JSON.stringify(a))}function qr(a={},e=[]){var w,I;const t=a.cacheInputs||((w=a.cachePolicy)==
null?void 0:w.inputs)||((I=a.cache)==null?void 0:I.inputs)||a.inputRefs||null,r=t&&typeof t=="object"?t:{},s=C(r.stateRefs??
r.states??a.stateRefs),n=C(r.closureRefs??r.closures??a.closureRefs),i=C(r.invalidationRefs??r.invalidates??a.invalidationRefs),
o=C(r.retainedBufferRefs??a.retainedBufferRefs),l=C(r.inputHashes??r.hashes??a.inputHashes),c=C(r.lawIds??r.laws??a.lawIds),
u=C(r.stateFamilies??a.stateFamilies),m=C(r.readFamilies??a.readFamilies),d=C(r.writeFamilies??a.writeFamilies),p=_(r.values,
r.value,r.parameters,a.cacheInputValues,null),h=e.map(k=>{var P,E,A,v;return{id:k.id,dependsOn:[...k.dependsOn],taskFamily:k.
taskFamily||((P=k.task)==null?void 0:P.taskFamily)||((E=k.task)==null?void 0:E.solverId)||null,solverId:k.solverId||((A=
k.task)==null?void 0:A.solverId)||null,cacheInput:_(k.cacheInput,k.cacheInputs,(v=k.task)==null?void 0:v.cacheInput,null)}});
if(!(t!=null||s.length>0||n.length>0||i.length>0||o.length>0||l.length>0||c.length>0||u.length>0||m.length>0||d.length>0||
p!=null||h.some(k=>k.cacheInput!=null||k.taskFamily||k.solverId)))return null;const f={graphFamily:String(_(r.graphFamily,
a.graphFamily,a.taskFamily,"task-graph")||"task-graph"),graphVersion:String(_(r.graphVersion,a.graphVersion,a.version,"v\
0")||"v0"),lawGraphId:_(r.lawGraphId,a.lawGraphId,null),stateRefs:s,closureRefs:n,invalidationRefs:i,retainedBufferRefs:o,
inputHashes:l,lawIds:c,stateFamilies:u,readFamilies:m,writeFamilies:d,scaleRegime:_(r.scaleRegime,a.scaleRegime,null),units:_(
r.units,a.units,null),values:p,nodes:h},g=ce(le(f));return{schema:Er,status:"content-addressed-inputs-declared",inputHash:g,
stateRefs:s,closureRefs:n,invalidationRefs:i,retainedBufferRefs:o,inputHashes:l,lawIds:c,stateFamilies:u,readFamilies:m,
writeFamilies:d,nodeCount:e.length,source:t?"graph.cacheInputs":"graph-derived-input-refs"}}function Nr(a={},e=[]){const t=a.
cachePolicy||a.cache||{},r=String(_(a.cacheKey,t.cacheKey,t.key,"")||"").trim()||null,s=qr(a,e),n=String(_(t.scope,a.cacheScope,
"compute-manager-local")||"compute-manager-local"),i=s?`${n}:${s.inputHash}`:null,o=r||i,l=String(_(a.cacheMode,t.mode,o?
"read-through":"disabled")||"disabled").trim().toLowerCase(),c=t.enabled!==!1&&o!=null&&l!=="disabled"&&l!=="off";let u="\
disabled";return c&&(l==="record-only"||l==="write-only"?u="record-only":l==="read-only"?u="read-only":u="read-through"),
{schema:Rr,cacheKey:o,mode:u,readEnabled:u==="read-through"||u==="read-only",writeEnabled:u==="read-through"||u==="recor\
d-only",ttlMs:S(t.ttlMs??a.cacheTtlMs,0,0,Number.MAX_SAFE_INTEGER),scope:n,requireAdmitted:t.requireAdmitted!==!1&&a.cacheRequireAdmitted!==
!1,explicitCacheKey:r,derivedCacheKey:i,keySource:r?"explicit":i?"content-addressed-inputs":null,inputHash:(s==null?void 0:
s.inputHash)||null,inputs:s,status:c?"cache-policy-enabled":"cache-policy-disabled"}}function Gr(a={}){var t,r;const e=_(
a.stateSeedPayload,(t=a.cachePolicy)==null?void 0:t.stateSeedPayload,(r=a.cache)==null?void 0:r.stateSeedPayload,a.remoteStateSeedPayload,
null);return e==null?null:M(e)}function Ue(a,e=new WeakSet){if(a==null)return a;if(typeof a=="function"||typeof a=="symb\
ol")return;if(typeof a!="object")return a;if(ArrayBuffer.isView(a))return new a.constructor(a);if(a instanceof ArrayBuffer)
return a.slice(0);if(e.has(a))return null;if(e.add(a),Array.isArray(a))return a.map(r=>Ue(r,e)).filter(r=>r!==void 0);const t={};
for(const[r,s]of Object.entries(a)){const n=Ue(s,e);n!==void 0&&(t[r]=n)}return t}function jr(a={},e={},t={}){const r=e.
resultInputs||e.resultInputMap||(a&&typeof a=="object"?a.resultInputs:null);if(!r||typeof r!="object"||Array.isArray(r))
return a;const s=a.data&&typeof a.data=="object"&&!Array.isArray(a.data)?{...a.data}:{},n={};for(const[i,o]of Object.entries(
r)){const l=typeof o=="string"?o:String((o==null?void 0:o.nodeId)||(o==null?void 0:o.resultId)||(o==null?void 0:o.from)||
"").trim();if(!(!i||!l)){if(!Object.prototype.hasOwnProperty.call(t,l))throw new Error(`Task graph node ${e.id} requeste\
d unavailable result input ${i} from ${l}`);s[i]=Ue(t[l]),n[i]=l}}return Object.keys(n).length===0?a:{...a,data:s,taskGraphResultInputs:n}}
function Kr(a={},e={}){var i,o,l;const t=a.cacheAdmission||((i=a.cachePolicy)==null?void 0:i.admission)||((o=a.cache)==null?
void 0:o.admission)||{},r=t.admitted===!0||t.accepted===!0||t.status==="admitted"||t.status==="admission-accepted",s=e.mode===
"record-only",n=t.status||(r?"admitted":s?"recorded-not-admitted":"pending-admission");return{schema:je,status:n,admitted:r,
authority:String(_(t.authority,a.cacheAuthority,"compute-manager-local")||"compute-manager-local"),admissionId:_(t.admissionId,
t.id,null),validatorId:_(t.validatorId,t.validator,null),reason:String(_(t.reason,s?"record-only-cache-artifact-requires\
-state-manager-admission":"cache-artifact-admission-pending","")||""),invalidationRefs:C(t.invalidationRefs??((l=e.inputs)==
null?void 0:l.invalidationRefs)),acceptedAt:r?t.acceptedAt||Date.now():null}}function Ur({graphId:a,cachePolicy:e,result:t,
storedAt:r,expiresAt:s,admission:n}={}){var o;const i=ce(le({schema:t==null?void 0:t.schema,graphId:t==null?void 0:t.graphId,
status:t==null?void 0:t.status,nodeReports:t==null?void 0:t.nodeReports,nodeResults:t==null?void 0:t.nodeResults}));return{
schema:Sr,artifactId:`${e.cacheKey}:artifact`,cacheKey:e.cacheKey,cacheScope:e.scope,cacheKeySource:e.keySource,inputHash:e.
inputHash,resultHash:i,graphId:a,status:n!=null&&n.admitted?"admitted-cache-artifact-recorded":"recorded-not-admitted",admitted:(n==
null?void 0:n.admitted)===!0,admission:n,inputs:e.inputs,invalidationRefs:C(n==null?void 0:n.invalidationRefs,((o=e.inputs)==
null?void 0:o.invalidationRefs)||[]),stateSeedPayload:(t==null?void 0:t.stateSeedPayload)!=null?M(t.stateSeedPayload):null,
storedAt:r,expiresAt:s,ttlMs:e.ttlMs,resultSchema:(t==null?void 0:t.schema)||null,nodeCount:(t==null?void 0:t.nodeCount)??
null,resultNodeSchemas:((t==null?void 0:t.nodeReports)||[]).map(l=>({nodeId:l.nodeId,resultSchema:l.resultSchema||null,taskFamily:l.
taskFamily||null}))}}function Hr(a={}){const e=a.placementPolicy||a.placement||a.placementHint||{},t=String(_(e.requestedPlacement,
e.placement,e.mode,a.requestedPlacement,a.placementMode,"local")||"local").trim().toLowerCase();return{schema:_r,requestedPlacement:t,
locality:String(_(e.locality,a.locality,t==="local"?"local-inline":"distributed")||""),authority:String(_(e.authority,a.
authority,"compute-manager")||"compute-manager"),targetPeerIds:C(e.targetPeerIds??e.peers??a.targetPeerIds),targetClusterId:_(
e.targetClusterId,e.clusterId,a.targetClusterId,null),gpuResident:e.gpuResident===!0||e.gpuLane===!0||a.gpuResident===!0,
advisory:e.advisory!==!1}}function zr(a={},e=null){const t=a.webgpu||{},r=a.gpuResidentLane||a.gpuResidentLaneLease||a.residentLane||
t.gpuResidentLane||t.residentLane||{},s=_(r.residency,t.residency,a.residency),n=r.enabled===!0||r.required===!0||r.leaseRequired===
!0||String(s||"").trim().toLowerCase()==="gpu-lane",i=_(r.laneId,r.gpuLaneId,t.laneId,t.gpuLaneId),o=_(r.stateKey,r.gpuStateKey,
t.stateKey,t.gpuStateKey,a.stateKey),l=_(r.domainKey,r.domain,t.domainKey,a.domainKey),c=C(r.retainedBufferRefs??t.retainedBufferRefs??
a.retainedBufferRefs),u=r.copyBudget&&typeof r.copyBudget=="object"?M(r.copyBudget):t.copyBudget&&typeof t.copyBudget=="\
object"?M(t.copyBudget):{};return!n&&!i&&!o&&c.length===0&&Object.keys(u).length===0?null:{schema:kt,enabled:!0,laneId:i?
String(i):null,stateKey:o?String(o):null,domainKey:l?String(l):null,solverId:_(r.solverId,a.solverId,null),taskId:e,owner:_(
r.owner,a.owner,"compute-manager-task-graph"),readFamilies:C(r.readFamilies??r.reads??t.readFamilies??a.readFamilies),writeFamilies:C(
r.writeFamilies??r.writes??t.writeFamilies??a.writeFamilies),retainedBufferRefs:c,queueFencePolicy:_(r.queueFencePolicy,
r.fencePolicy,t.queueFencePolicy,null),copyBudget:u}}function Vr(a){return["gpu-fence-completed","remote-gpu-fence-compl\
eted","queue-work-completed","readback-map-completed","ordered-before-consumer-queue-completed"].includes(String(a||""))}
function we(a=null,e=null){const t=a&&typeof a=="object"?a:{},r=t.status||t.queueCompletionStatus||t.fenceStatus||t.completionStatus||
(e!=null&&e.required?"gpu-fence-report-missing":null);if(!r&&!(e!=null&&e.required))return null;const s=t.method||t.queueCompletionMethod||
t.fenceMethod||t.completionMethod||null,n=t.fenceSatisfied===!0||t.satisfied===!0||t.completed===!0||Vr(r);return{schema:t.
schema||Tr,status:r,method:s,fenceSatisfied:n,required:(e==null?void 0:e.required)===!0||t.required===!0,laneId:_(t.laneId,
t.gpuLaneId,e==null?void 0:e.laneId),stateKey:_(t.stateKey,t.gpuStateKey,e==null?void 0:e.stateKey),queueFencePolicy:_(t.
queueFencePolicy,t.fencePolicy,e==null?void 0:e.queueFencePolicy),queueCompletionStatus:t.queueCompletionStatus||r||null,
queueCompletionMethod:t.queueCompletionMethod||s||null,retainedBufferRefs:C(t.retainedBufferRefs,(e==null?void 0:e.retainedBufferRefs)||
[]),workerId:t.workerId||t.remoteWorkerId||null,deviceId:t.deviceId||t.gpuDeviceId||null,completedAt:t.completedAt||null,
source:t.source||null}}function Le(a){var e;return a?typeof a=="function"?a.placementExecutorId||a.id||a.name||"placemen\
t-executor":a.id||a.name||((e=a.constructor)==null?void 0:e.name)||"placement-executor":null}function We(a){var e;return a?
typeof a=="function"?a.placementAdmissionId||a.id||a.name||"placement-admission":a.id||a.name||((e=a.constructor)==null?
void 0:e.name)||"placement-admission":null}function De(a){var e;return a?typeof a=="function"?a.placementResultValidatorId||
a.id||a.name||"placement-result-validator":a.id||a.name||((e=a.constructor)==null?void 0:e.name)||"placement-result-vali\
dator":null}function Be(a){var e;return a?typeof a=="function"?a.placementTaskSignerId||a.id||a.name||"placement-task-si\
gner":a.id||a.name||((e=a.constructor)==null?void 0:e.name)||"placement-task-signer":null}function $r(a){return(Array.isArray(
a)?a:[]).slice(0,64).map((t,r)=>{const s=t&&typeof t=="object"?t:{};return{schema:s.schema||null,role:s.role||null,index:r,
peerId:s.peerId||s.remotePeerId||null,remotePeerId:s.remotePeerId||s.peerId||null,targetPeerId:s.targetPeerId||null,transportPeerId:s.
transportPeerId||null,responderNodeId:s.responderNodeId||null,responderPeerId:s.responderPeerId||null,clusterId:s.clusterId||
null,workerId:s.workerId||s.remoteWorkerId||null,remoteExecution:s.remoteExecution&&typeof s.remoteExecution=="object"?JSON.
parse(JSON.stringify(s.remoteExecution)):null,gpuFence:s.gpuFence&&typeof s.gpuFence=="object"?JSON.parse(JSON.stringify(
s.gpuFence)):null,executorId:s.executorId||null,codeHash:s.codeHash||null,inputHash:s.inputHash||null,taskHash:s.taskHash||
null,outputHash:s.outputHash||s.resultHash||null,resultHash:s.resultHash||s.outputHash||null,commitDeltaHash:s.commitDeltaHash||
s.deltaHash||null,resultSchema:s.resultSchema||s.schema||null,validated:s.validated===!0||s.valid===!0,ok:s.ok!==!1&&s.accepted!==
!1&&s.valid!==!1,promoted:s.promoted===!0,usedAsCommitSource:s.usedAsCommitSource===!0,errorCode:s.errorCode||null,errorMessage:s.
errorMessage||null,durationMs:Number.isFinite(Number(s.durationMs))?Number(Number(s.durationMs).toFixed(3)):null}})}function He(a){
var e;if(a==null)return a;if(typeof a=="number")return Number.isFinite(a)?a:String(a);if(typeof a=="string"||typeof a=="\
boolean")return a;if(typeof a=="bigint")return`${a.toString()}n`;if(typeof a=="function")return`[Function:${a.name||"ano\
nymous"}]`;if(ArrayBuffer.isView(a))return{typedArray:((e=a.constructor)==null?void 0:e.name)||"TypedArray",values:Array.
from(a)};if(a instanceof ArrayBuffer)return{arrayBufferBytes:Array.from(new Uint8Array(a))};if(Array.isArray(a))return a.
map(He);if(typeof a=="object"){const t={};for(const r of Object.keys(a).sort()){if(r==="taskPacket"||r==="taskEnvelope")
continue;const s=He(a[r]);s!==void 0&&(t[r]=s)}return t}return String(a)}function le(a){return JSON.stringify(He(a))}function ce(a){
const e=String(a??"");let t=2166136261;for(let r=0;r<e.length;r+=1)t^=e.charCodeAt(r),t=Math.imul(t,16777619)>>>0;return`\
fnv1a32-${t.toString(16).padStart(8,"0")}`}function Oe({executorId:a,kind:e="worker",ordinal:t=null,status:r="active"}={}){
return{executorId:a,kind:e,ordinal:t,status:r,activeTaskCount:0,submitted:0,completed:0,failed:0,abandoned:0,averageDurationMs:0,
lastDurationMs:0,maxDurationMs:0,totalDurationMs:0,lastRuntime:null,lastTaskFamily:null,lastStartedAt:null,lastCompletedAt:null,
byRuntime:{},byTaskFamily:{}}}class Jr{constructor(e={}){var n,i,o,l,c,u;const t=typeof navigator<"u"&&navigator.hardwareConcurrency?
navigator.hardwareConcurrency:4,r=typeof navigator<"u"&&!!navigator.gpu,s=typeof WebAssembly<"u";this.workerPolicyOverrides=
{minWorkers:e.minWorkers,targetWorkers:e.targetWorkers,initialWorkers:e.initialWorkers,maxWorkers:e.maxWorkers,autoScaleWorkers:e.
autoScaleWorkers,scaleUpQueueDepth:e.scaleUpQueueDepth,idleScaleDownMs:e.idleScaleDownMs},this.resourceProfile=ve(e.resourceProfile||
e,{wasm:s,webgpu:r}),this.workerPolicy=xe(this.workerPolicyOverrides,this.resourceProfile),this.config={enableWebGPU:e.enableWebGPU||
!1,enableWorkers:e.enableWorkers!==!1,requireWorkers:e.requireWorkers===!0,workerBootstrapTimeoutMs:S(e.workerBootstrapTimeoutMs,
rt,1,6e4),minWorkers:this.workerPolicy.minWorkers,targetWorkers:this.workerPolicy.targetWorkers,maxWorkers:this.workerPolicy.
maxWorkers||t,autoScaleWorkers:this.workerPolicy.autoScale,...e},this.config.minWorkers=this.workerPolicy.minWorkers,this.
config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.maxWorkers,this.config.autoScaleWorkers=
this.workerPolicy.autoScale,this.config.requireWorkers=e.requireWorkers===!0,this.config.workerBootstrapTimeoutMs=S(e.workerBootstrapTimeoutMs,
rt,1,6e4),this.workers=[],this.taskQueue=[],this.activeTasks=new Map,this.activeTaskGraphs=new Map,this.taskGraphCache=new Map,
this.taskGraphCacheArtifacts=new Map,this.workerAffinities=new Map,this.residentWorkerAffinities=new Set,this.workerTerminationFailures=
new Map,this.modelServices=new Set,this.resourceBroker=e.resourceBroker||null,this.workerIds=new WeakMap,this.workerBootstrap=
new WeakMap,this.workerRequirementError=null,this.workerInitializationPromise=null,this.workerLifecycleRevision=0,this.workerUtilization=
new Map,this.nextWorkerOrdinal=1,this.inlineExecutorId="inline",this.workerUtilization.set(this.inlineExecutorId,Oe({executorId:this.
inlineExecutorId,kind:"inline",ordinal:0,status:"active"})),this.solverRegistry=new Vt(e.solvers||[]),this.gpuResidentLaneManager=
e.gpuResidentLaneManager||new hr({gpuHub:e.gpuHub||null,deviceId:e.gpuDeviceId||e.deviceId||"compute-manager-gpu"}),this.
targetWorkerCount=this.workerPolicy.targetWorkers,this.workerSpawnFailures=0,this.workerRetirements=0,this.workerPoolRevision=
0,this.workerResizeHistory=[],this.placementExecutor=typeof e.placementExecutor=="function"||(n=e.placementExecutor)!=null&&
n.submitTask?e.placementExecutor:null,this.placementExecutorId=e.placementExecutorId||Le(this.placementExecutor),this.placementAdmission=
typeof e.placementAdmission=="function"||(i=e.placementAdmission)!=null&&i.admitTask?e.placementAdmission:null,this.placementAdmissionId=
e.placementAdmissionId||We(this.placementAdmission),this.placementResultValidator=typeof e.placementResultValidator=="fu\
nction"||(o=e.placementResultValidator)!=null&&o.validateTaskResult||(l=e.placementResultValidator)!=null&&l.validateResult?
e.placementResultValidator:null,this.placementResultValidatorId=e.placementResultValidatorId||De(this.placementResultValidator),
this.placementTaskSigner=typeof e.placementTaskSigner=="function"||(c=e.placementTaskSigner)!=null&&c.signTaskPacket||(u=
e.placementTaskSigner)!=null&&u.signEnvelope||e.remoteTaskSigner?e.placementTaskSigner||e.remoteTaskSigner:null,this.placementTaskSignerId=
e.placementTaskSignerId||e.remoteTaskSignerId||Be(this.placementTaskSigner),this.placementTimeoutMs=S(e.placementTimeoutMs??
e.remotePlacementTimeoutMs,3e4,0,36e5),this.remoteResultVerification=e.remoteResultVerification!==!1&&e.placementResultVerification!==
!1,this.placementRetryPolicy={schema:ne,maxAttempts:S(e.placementMaxAttempts??e.remotePlacementMaxAttempts,1,1,100),baseDelayMs:S(
e.placementRetryBaseDelayMs??e.remotePlacementRetryBaseDelayMs,50,0,6e5),maxDelayMs:S(e.placementRetryMaxDelayMs??e.remotePlacementRetryMaxDelayMs,
1e3,0,6e5),jitterFraction:j(e.placementRetryJitterFraction??e.remotePlacementRetryJitterFraction,0,0,1),retryableErrorKinds:C(
e.placementRetryableErrorKinds??e.remotePlacementRetryableErrorKinds,Z),terminalErrorKinds:[...ye]},this.manualWorkerAutoScaleCooldownMs=
S(e.manualWorkerAutoScaleCooldownMs??e.workerResizeCooldownMs,4e3,0,6e5),this.workerAutoScaleHoldUntil=0,this.workerAutoScaleHoldReason=
null,this.lastWorkerResize={schema:"peercompute.compute.worker-resize.v0",revision:0,reason:"initial",previousTargetWorkers:this.
targetWorkerCount,targetWorkers:this.targetWorkerCount,previousWorkerCount:0,workerCount:0,changed:!1,timestamp:null},this.
stats={schema:"peercompute.compute.manager-stats.v0",totalTasksSubmitted:0,totalTasksCompleted:0,totalTasksFailed:0,inlineTasksCompleted:0,
workerTasksCompleted:0,remoteTasksCompleted:0,remoteTasksFailed:0,remoteTasksTimedOut:0,remoteTasksRejected:0,remoteTasksVerificationFailed:0,
remoteTasksValidationFailed:0,remoteTaskAttempts:0,remoteTasksRetried:0,remoteTasksRetryExhausted:0,taskGraphsSubmitted:0,
taskGraphsCompleted:0,taskGraphsFailed:0,taskGraphsCancelled:0,taskGraphCacheHits:0,taskGraphCacheWrites:0,taskGraphCacheArtifactsWritten:0,
taskGraphCacheArtifactsAdmitted:0,taskGraphRemoteCacheImports:0,taskGraphRemoteCacheImportBlocked:0,taskGraphCacheInvalidations:0,
taskGraphCacheReadBlocked:0,totalTaskDurationMs:0,averageTaskDurationMs:0,lastTaskDurationMs:0,minTaskDurationMs:null,maxTaskDurationMs:0,
lastCompletedAt:null,byRuntime:{},byTaskFamily:{},taskPlacement:{schema:at,totalSubmitted:0,totalCompleted:0,totalFailed:0,
localSubmitted:0,remoteRequested:0,remoteExecuted:0,remoteFailed:0,remoteTimedOut:0,remoteRejected:0,remoteVerificationFailed:0,
remoteValidationFailed:0,remoteAttempts:0,remoteRetried:0,remoteRetryExhausted:0,lastPlacement:null,lastRemotePlacement:null,
byRecommendedPlacement:{},byActualPlacement:{}}},this.scaleDownTimer=null,this.commitDeltaHandler=null,this.capabilities=
{cpu:!0,wasm:s,webgpu:r,wasmWebgpu:s&&r},this.initialized=!1,this.workerBootstrapURL=e.workerBootstrapURL||e.computeWorkerBootstrapURL||
e.workerScriptURL||e.workerScriptUrl||null}setCommitDeltaHandler(e){this.commitDeltaHandler=e}commitDelta(e){this.commitDeltaHandler&&
this.commitDeltaHandler(e)}async initialize(){if(this.destroying)throw new Error("ComputeManager is shutting down");if(this.
workerRequirementError)throw this.workerRequirementError;if(this.workerInitializationPromise)return this.workerInitializationPromise;
if(this.initialized)return;const e=this.workerLifecycleRevision;if(this.initialized=!0,!this._supportsWorkers()){if(this.
config.requireWorkers)throw this._failRequiredWorkerPool(this._createRequiredWorkerError("browser Worker construction is\
 unavailable or workers were disabled"));console.warn("[ComputeManager] Web Workers not available; falling back to inlin\
e execution");return}const t=S(this.targetWorkerCount,this.workerPolicy.targetWorkers,0,this.workerPolicy.maxWorkers);for(let r=0;r<
t&&this._spawnWorker();r+=1);if(this.workers.length===0){if(this.config.requireWorkers)throw this._failRequiredWorkerPool(
this.workerRequirementError||this._createRequiredWorkerError("no browser worker could be constructed during bootstrap"));
console.warn("[ComputeManager] Worker bootstrap failed; falling back to inline execution");return}if(this.config.requireWorkers){
const r=this._waitForRequiredWorkerBootstrap();this.workerInitializationPromise=r;try{if(await r,this.workerLifecycleRevision!==
e)throw Object.assign(new Error("ComputeManager was destroyed during worker bootstrap"),{name:"ComputeManagerDestroyedEr\
ror",code:"ERR_COMPUTE_MANAGER_DESTROYED"});if(this.workerRequirementError)throw this.workerRequirementError;const s=this.
_getWorkerRequirementReport();if(s.workerCount===0||s.readyWorkerCount!==s.workerCount)throw this._createRequiredWorkerError(
"the required worker pool changed before admission completed")}catch(s){throw this.workerLifecycleRevision!==e?s:this._failRequiredWorkerPool(
s)}finally{this.workerInitializationPromise===r&&(this.workerInitializationPromise=null)}}}async destroy(){if(this.destroyingPromise)
return this.destroyingPromise;this.destroying=!0,this.workerLifecycleRevision+=1,this.destroyingPromise=this._destroyManagedRuntime();
try{return await this.destroyingPromise}finally{this.destroyingPromise=null,this.destroying=!1}}async _destroyManagedRuntime(){
var s;clearTimeout(this.scaleDownTimer),this.scaleDownTimer=null;const e=Object.assign(new Error("ComputeManager was des\
troyed before pending work completed"),{name:"ComputeManagerDestroyedError",code:"ERR_COMPUTE_MANAGER_DESTROYED"});for(;this.
taskQueue.length;){const n=this.taskQueue.shift();this._rejectTaskGpuResidentLaneLease(n,e.code),n.reject(e)}const t=[];
for(const n of this.modelServices)try{await n.dispose()}catch{t.push(n)}const r=[];for(const n of[...this.workers])this.
_markWorkerBootstrapFailed(n,e),this._removeWorker(n)||r.push(this.workerTerminationFailures.get(n));for(const[n,i]of this.
activeTasks)i.worker&&this.workers.includes(i.worker)||(this.activeTasks.delete(n),this._rejectTaskGpuResidentLaneLease(
i,e.code),(s=i.reject)==null||s.call(i,Object.assign(new Error(e.message),{name:e.name,code:e.code,workerTerminated:!!i.
worker})));for(const n of t)try{await n.dispose()}catch(i){r.push(i)}if(r.length)throw new AggregateError(r,"ComputeMana\
ger cleanup is incomplete");this.workerAffinities.clear(),this.residentWorkerAffinities.clear(),this.activeTaskGraphs.clear(),
this.commitDeltaHandler=null,this.initialized=!1,this.workerRequirementError=null,this.workerInitializationPromise=null,
this.workerBootstrap=new WeakMap,this.workerIds=new WeakMap,this.modelServices.clear()}async createModelInferenceService({
artifactStore:e,resourceBroker:t,resourceBudgets:r,runtime:s="transformers.js",admissionOptions:n={},...i}={}){if(this.destroying)
throw new Error("ComputeManager is shutting down");if(!["transformers.js","llama.cpp","onnx-diffusion","transformers-spe\
ech","onnx-mesh"].includes(s))throw new Error("Unsupported model execution runtime");const o=this.workerLifecycleRevision,
[{ModelInferenceService:l},{ResourceLeaseBroker:c},{ResidentModelAdmission:u},m]=await Promise.all([K(()=>import("./ModelInferenceService-C2jckjK0.js"),
__vite__mapDeps([11,0,1]),import.meta.url),K(()=>import("./ResourceLeaseBroker-BD_-7rTT.js"),[],import.meta.url),K(
()=>import("./ResidentModelAdmission-B4ucwTPs.js"),[],import.meta.url),s==="llama.cpp"?K(()=>import("./runtimeDefinition-BDC-XNMB.js").
then(h=>h.r),__vite__mapDeps([4,0,1,5]),import.meta.url).then(h=>h.ggufRuntimeDefinition):s==="onnx-diffusion"?K(()=>import("./runtimeDefinition-Qtdz6wxS.js"),
__vite__mapDeps([7,0,1]),import.meta.url).then(h=>h.diffusionRuntimeDefinition):s==="onnx-mesh"?K(()=>import("./runtimeDefinition-DNLMbv4s.js"),
__vite__mapDeps([10,0,1]),import.meta.url).then(h=>h.meshRuntimeDefinition):s==="transformers-speech"?K(()=>import("./runtimeDefinition-DygiC0Lm.js"),
__vite__mapDeps([5,0,1]),import.meta.url).then(h=>h.speechRuntimeDefinition):null]);if(this.destroying||o!==this.workerLifecycleRevision)
throw new Error("ComputeManager shutdown interrupted service creation");if(t&&this.resourceBroker&&t!==this.resourceBroker)
throw new Error("Model sessions must share the ComputeManager resource broker");if(!this.resourceBroker){if(!t&&!r)throw new Error(
"Configure inference CPU/GPU resource budgets");this.resourceBroker=t||new c({capacities:r})}const d=new l({...i,runtimeDefinition:m,
artifactStore:e,computeManager:this,admission:new u({...n,broker:this.resourceBroker})});this.modelServices.add(d);const p=d.
dispose.bind(d);return d.dispose=async()=>{const h=await p();return this.modelServices.delete(d),h},d}async refreshGpuLimits(){
var r;if(typeof navigator>"u"||!((r=navigator.gpu)!=null&&r.requestAdapter))return this.getResourceProfile();let e=null;
try{e=await navigator.gpu.requestAdapter()}catch{return this.getResourceProfile()}const t=wt(e==null?void 0:e.limits);return t?
(this.resourceProfile=ve({...this.resourceProfile,gpuAvailable:!0,gpuLimits:t,gpuLimitsSource:"adapter",source:this.resourceProfile.
source||"browser"},this.capabilities),this.workerPolicy=xe(this.workerPolicyOverrides,this.resourceProfile),this.config.
minWorkers=this.workerPolicy.minWorkers,this.config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=
this.workerPolicy.maxWorkers,this.config.autoScaleWorkers=this.workerPolicy.autoScale,this.getResourceProfile()):this.getResourceProfile()}async submitTask(e){
var h,y,f,g,w,I;if(!e)throw new Error("Task is required");const t=["peercompute:model-inference","peercompute:gguf-infer\
ence","peercompute:diffusion-inference","peercompute:speech-inference","peercompute:mesh-inference"].includes(e.module)&&
((h=e.data)==null?void 0:h.command)==="unload"&&[...this.modelServices].some(k=>{var P;return((P=k.session)==null?void 0:
P.affinityKey)===e.affinityKey});if(this.destroying&&!t)throw new Error("ComputeManager is shutting down");const r=this.
workerLifecycleRevision;(y=e.signal)==null||y.throwIfAborted();const s=typeof e.runtime=="string"?e.runtime.trim().toLowerCase():
e.wasm?e.hostModule||e.module?"wasm-webgpu":"wasm":"js";if(s==="js"&&!e.fn&&!e.module)throw new Error("JavaScript tasks \
must provide fn or module");if((s==="wasm"||s==="wasm-webgpu")&&!((f=e.wasm)!=null&&f.source||e.wasmSource||e.source))throw new Error(
`${s} tasks must provide wasm.source`);if(s==="wasm-webgpu"&&!(e.hostModule||e.module))throw new Error("wasm-webgpu task\
s must provide hostModule or module");if(this.workerRequirementError)throw this.workerRequirementError;if((!this.initialized||
this.config.requireWorkers&&this.workerInitializationPromise)&&await this.initialize(),this.workerRequirementError)throw this.
workerRequirementError;if((g=e.signal)==null||g.throwIfAborted(),this.destroying&&!t||r!==this.workerLifecycleRevision)throw new Error(
"ComputeManager shutdown interrupted task submission");if(e.requireWorker===!0&&!this._supportsWorkers())throw this._createRequiredWorkerError(
"this task requires worker execution");const n=typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.
random()}`,i=e.id||n;if(this.activeTasks.has(i)||this.taskQueue.some(k=>k.id===i))throw new Error(`Compute task id is al\
ready active: ${i}`);const o=this._runtimeStats(s);o.submitted+=1,this.stats.totalTasksSubmitted+=1;const l=this._normalizeTaskFamily(
e,s),c=this._taskFamilyStats(l);c.submitted+=1;const u=this._normalizeTaskPlacement(e,{runtime:s,taskFamily:l}),m=Br(e),
d=Or(e,m);this._recordPlacementSubmitted(u);const p={id:i,runtime:s,taskFamily:l,solverId:e.solverId,placement:u,gpuFence:m,
gpuResidentLane:d,data:e.data??null,fn:e.fn?e.fn.toString():void 0,module:e.module,hostModule:e.hostModule,exportName:e.
exportName||"default",hostExport:e.hostExport,wasm:e.wasm,wasmSource:e.wasmSource,source:e.source,args:e.args,webgpu:e.webgpu,
suppressCommitDelta:e.suppressCommitDelta===!0||e.commitDelta===!1,returnEnvelope:e.returnEnvelope===!0||e.returnRawResult===
!0,requireWorker:e.requireWorker===!0,affinityKey:e.affinityKey||e.workerKey||((w=e.data)==null?void 0:w.affinityKey)||((I=
e.data)==null?void 0:I.stateKey)};if(p.requireWorker&&((d==null?void 0:d.localExecution)==="inline"||u.requestedPlacement!==
"local"&&!u.advisory))throw this._createRequiredWorkerError("required local worker conflicts with requested placement");
if(p.affinityKey&&this.residentWorkerAffinities.has(p.affinityKey)&&!this.workerAffinities.has(p.affinityKey))throw Object.
assign(new Error("Resident worker was terminated"),{workerTerminated:!0,code:"ERR_COMPUTE_WORKER_TERMINATED"});if(this._ensureTargetWorkers(
{reason:"task-demand"}),this.workerRequirementError)throw this.workerRequirementError;return new Promise((k,P)=>{var O,N;
const E={settled:!1,cancelRequested:!1,timer:null,bootstrapTimer:null};let A;const v=new Promise(W=>{A=W}),B=()=>{this.cancelTask(
i).catch(()=>{})},D=(W,G)=>{var V;E.settled||(E.settled=!0,clearTimeout(E.timer),clearTimeout(E.bootstrapTimer),(V=e.signal)==
null||V.removeEventListener("abort",B),W(G),A())},F={id:i,payload:p,control:E,completion:v,resolve:W=>D(k,W),reject:W=>D(
P,W),onProgress:typeof e.onProgress=="function"?e.onProgress:null,transferables:Array.isArray(e.transferables)?e.transferables:
[],submittedAt:z(),runtime:s,taskFamily:l,placement:u};if(p.requireWorker&&!this.workers.some(W=>{var G;return((G=this.workerBootstrap.
get(W))==null?void 0:G.status)==="ready"})&&(E.bootstrapTimer=setTimeout(()=>{const W=this.taskQueue.findIndex(G=>G.id===
i);W<0||(this.taskQueue.splice(W,1),this._recordTaskCompletion(F,{ok:!1,mode:"queued"}),F.reject(this._createRequiredWorkerError(
"task worker readiness timed out")))},this.config.workerBootstrapTimeoutMs)),(O=e.signal)==null||O.addEventListener("abo\
rt",B,{once:!0}),(N=e.signal)!=null&&N.aborted){F.reject(e.signal.reason||new DOMException("Compute task cancelled","Abo\
rtError"));return}this._dispatchToPlacementExecutor(F)||this._dispatchToWorker(F)||(this.taskQueue.push(F),this._maybeScaleForQueue(),
this._scheduleNext())})}getResourceProfile(){return{...this.resourceProfile}}getWorkerPolicy(){return{...this.workerPolicy,
targetWorkers:this.targetWorkerCount}}setResourceProfile(e={}){return this.resourceProfile=ve(e,this.capabilities),this.
workerPolicy=xe(this.workerPolicyOverrides,this.resourceProfile),this.config.minWorkers=this.workerPolicy.minWorkers,this.
config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.maxWorkers,this.config.autoScaleWorkers=
this.workerPolicy.autoScale,this.resizeWorkers(this.workerPolicy.targetWorkers,{reason:"resource-profile-update"})}resizeWorkers(e,{
reason:t="manual"}={}){const r=this.targetWorkerCount,s=this.workers.length,n=this.config.requireWorkers?Math.max(1,this.
workerPolicy.minWorkers):this.workerPolicy.minWorkers,i=S(e,this.targetWorkerCount,n,this.workerPolicy.maxWorkers);if(this.
targetWorkerCount=i,Fr(t)&&this._holdWorkerAutoScale(t),!this.initialized||!this._supportsWorkers())return this._recordWorkerResize(
{reason:t,previousTargetWorkers:r,previousWorkerCount:s}),this.getCapabilities();for(;this.workers.length<this.targetWorkerCount&&
this._spawnWorker(););return this._retireIdleWorkers(t),this._scheduleNext(),this._recordWorkerResize({reason:t,previousTargetWorkers:r,
previousWorkerCount:s}),this.getCapabilities()}estimateWorkloadBudget({itemName:e="items",baseItems:t=4096,minItems:r=1024,
maxItems:s=65536,itemStrideBytes:n=0,memoryFraction:i=.25,layerCount:o=1,maxShardsPerLayer:l=8}={}){var G;const c=Math.max(
1,this.targetWorkerCount||this.workerPolicy.targetWorkers||1),u=S(o,1,1,1024),m=vr(this.resourceProfile.tier),d=Math.max(
1,Math.floor(c/u)),p=S(Math.min(m,d),1,1,Math.max(1,l)),h=Cr(this.resourceProfile.tier),y=ke(c/xr(this.resourceProfile.tier)),
f=j(this.resourceProfile.memoryBudgetMB,Ke(this.resourceProfile.tier),0,1048576),g=j(this.resourceProfile.gpuMemoryBudgetMB,
0,0,1048576),w=ke(f/Ke(this.resourceProfile.tier)),I=this.resourceProfile.gpuAvailable?ke(g/Math.max(1,gt(this.resourceProfile.
tier))):.75,k=j(this.resourceProfile.budgetScale,1,.05,64),P=ke(Math.min(y,w,I)*k),E=S(n,0,0,1048576),A=j(i,.25,.01,1),v=E>
0&&f>0?Math.max(r,Math.floor(f*1024*1024*A/E)):s,B=E>0&&this.resourceProfile.gpuLimits?Math.min(S(this.resourceProfile.gpuLimits.
maxBufferSize,Number.MAX_SAFE_INTEGER,0),S(this.resourceProfile.gpuLimits.maxStorageBufferBindingSize,Number.MAX_SAFE_INTEGER,
0)):Number.MAX_SAFE_INTEGER,D=Number.isFinite(B)&&B>0&&E>0?Math.max(r,Math.floor(B*A/E)):s,F=Math.max(r,Math.min(s,v,D)),
O=S(Lr(t*h*P,256),t,r,F),W=((G=Object.entries({workers:y,memory:w,gpu:I,explicit:k}).sort((V,Q)=>V[1]-Q[1])[0])==null?void 0:
G[0])||"workers";return{schema:"peercompute.compute.workload-budget.v0",itemName:e,itemCount:O,minItems:r,maxItems:s,effectiveMaxItems:F,
itemStrideBytes:E,workerCount:c,shardsPerLayer:p,layerCount:u,plannedWorkerTasks:u*p,capacity:{schema:"peercompute.compu\
te.capacity-budget.v0",budgetScale:P,limitingFactor:W,workerScale:y,memoryScale:w,gpuScale:I,explicitScale:k,memoryBudgetMB:f,
gpuMemoryBudgetMB:g,memoryFraction:A,memoryMaxItems:v,gpuMaxItems:D,gpuLimits:this.resourceProfile.gpuLimits?{...this.resourceProfile.
gpuLimits}:null},resourceProfile:this.getResourceProfile(),workerPolicy:this.getWorkerPolicy()}}registerSolver(e){return this.
solverRegistry.register(e)}unregisterSolver(e){return this.solverRegistry.unregister(e)}getSolver(e){return this.solverRegistry.
get(e)}listSolvers(){return this.solverRegistry.list()}submitSolverTask(e,t={}){const r=this.solverRegistry.createTask(e,
t);return this.submitTask(r)}async submitTaskGraph(e={}){var W,G,V,Q,te,re,ae,se;const t=String(e.graphId||e.id||`task-g\
raph:${Date.now()}`).trim(),r=Array.isArray(e.nodes)?e.nodes:[];if(!r.length)throw new Error("submitTaskGraph requires a\
t least one node");const s=[],n=new Map;for(const R of r){const T=String((R==null?void 0:R.id)||(R==null?void 0:R.nodeId)||
((W=R==null?void 0:R.task)==null?void 0:W.id)||"").trim();if(!T)throw new Error("submitTaskGraph node id is required");if(n.
has(T))throw new Error(`Duplicate task graph node id: ${T}`);const U=C(R.dependsOn||R.dependencies||[]),H={...R,id:T,dependsOn:U};
s.push(H),n.set(T,H)}for(const R of s)for(const T of R.dependsOn)if(!n.has(T))throw new Error(`Task graph node ${R.id} d\
epends on unknown node ${T}`);this.stats.taskGraphsSubmitted+=1;const i=Nr(e,s),o=Gr(e),l=Kr(e,i),c=Hr(e),u=zr(e,t),m=String(
((G=e.cancellation)==null?void 0:G.mode)||e.cancellationMode||"cooperative").trim()||"cooperative",d=e.abortSignal||e.cancelSignal||
e.signal||((V=e.cancellation)==null?void 0:V.signal)||null,p={schema:Ce,mode:m,status:"not-cancelled",reason:null};let h=i.
readEnabled?this.taskGraphCache.get(i.cacheKey):null;const y=Date.now();h&&h.expiresAt&&h.expiresAt<=y&&(this.taskGraphCache.
delete(i.cacheKey),this.taskGraphCacheArtifacts.delete(i.cacheKey),h=null);let f=null;if(h&&i.requireAdmitted&&((Q=h.artifact)==
null?void 0:Q.admitted)!==!0&&(this.stats.taskGraphCacheReadBlocked+=1,f="blocked-unadmitted-cache-artifact",h=null),h){
this.stats.taskGraphCacheHits+=1,this.stats.taskGraphsCompleted+=1;const R=M(h.result),T=M(h.artifact||R.cacheArtifact||
null);return{...R,cachePolicy:i,cacheAdmission:(T==null?void 0:T.admission)||R.cacheAdmission||l,cacheAdmissionStatus:((te=
T==null?void 0:T.admission)==null?void 0:te.status)||R.cacheAdmissionStatus||null,cacheArtifact:T,cacheArtifactSchema:(T==
null?void 0:T.schema)||null,cacheArtifactStatus:(T==null?void 0:T.status)||null,cacheStatus:"hit",cacheHit:!0,cachedAt:h.
storedAt,durationMs:0}}const g=new Map(s.map(R=>[R.id,R])),w={},I=[],k=[],P=[],E=z(),A={graphId:t,startedAt:E,cancelled:(d==
null?void 0:d.aborted)===!0,reason:(d==null?void 0:d.reason)||null,cacheKey:i.cacheKey,stateSeedPayload:o,placementPolicy:c,
graphLaneSpec:u},v=()=>{A.cancelled=!0,A.reason=(d==null?void 0:d.reason)||"abort-signal"};d!=null&&d.addEventListener&&
d.addEventListener("abort",v,{once:!0}),this.activeTaskGraphs.set(t,A);const B=()=>{if(!A.cancelled)return;p.status="can\
celled",p.reason=String(A.reason||"cancelled");const R=new Error(`Task graph cancelled: ${t}`);throw R.code="TASK_GRAPH_\
CANCELLED",R.graphId=t,R.cancellation={...p},R};let D=null,F=null,O=u?"required":"not-required",N=f||(i.readEnabled?"mis\
s":i.writeEnabled?"record-only":"disabled");try{for(B(),u&&(D=this.acquireGpuResidentLaneLease({...u,taskId:t,owner:u.owner||
"compute-manager-task-graph"}),O="active");g.size>0;){B();const T=new Set(Object.keys(w)),U=Array.from(g.values()).filter(
x=>x.dependsOn.every(Y=>T.has(Y)));if(!U.length)throw new Error(`Task graph has a cycle or unsatisfied dependency: ${Array.
from(g.keys()).join(", ")}`);P.push(U.map(x=>x.id));const H=await Promise.all(U.map(async x=>{B();const Y={schema:wr,graphId:t,
nodeId:x.id,dependsOn:[...x.dependsOn],completedNodeIds:Object.keys(w),nodeResults:w,results:w,cachePolicy:i,cacheKey:i.
cacheKey,cacheInputs:i.inputs,stateSeedPayload:o,placementPolicy:c,cancellation:p,graphLease:D,graphLeaseSpec:u,getResult(pe){
return w[pe]}};let $=typeof x.createTask=="function"?await x.createTask(Y):typeof x.task=="function"?await x.task(Y):x.task;
if(!$||typeof $!="object")throw new Error(`Task graph node ${x.id} did not produce a task`);$=jr($,x,w),B();const de=z(),
me=await this.submitTask($);return B(),{node:x,task:$,result:me,durationMs:Math.max(0,z()-de)}}));for(const x of H)g.delete(
x.node.id),w[x.node.id]=x.result,k.push(x.node.id),I.push({nodeId:x.node.id,dependsOn:[...x.node.dependsOn],taskId:x.task.
id||null,taskFamily:x.task.taskFamily||x.task.solverId||null,solverId:x.task.solverId||null,status:"completed",durationMs:x.
durationMs,resultSchema:((re=x.result)==null?void 0:re.computeTaskResultSchema)||((ae=x.result)==null?void 0:ae.schema)||
null})}D!=null&&D.leaseId&&(F=this.completeGpuResidentLaneLease(D.leaseId,{status:"ordered-before-consumer-queue-complet\
ed",method:"compute-manager-task-graph-completion",queueCompletionStatus:"ordered-before-consumer-queue-completed",queueCompletionMethod:"\
compute-manager-task-graph-completion",releaseReason:"task-graph-completed"}),O=((se=F==null?void 0:F.lease)==null?void 0:
se.status)||"completed");const R={schema:ot,graphId:t,status:"completed",nodeCount:s.length,edgeCount:s.reduce((T,U)=>T+
U.dependsOn.length,0),executionOrder:k,executionBatches:P,nodeReports:I,nodeResults:w,cachePolicy:i,cacheKey:i.cacheKey,
cacheKeySource:i.keySource,cacheInputHash:i.inputHash,cacheInputs:i.inputs,stateSeedPayload:o,cacheAdmission:l,cacheAdmissionStatus:l.
status,cacheArtifact:null,cacheArtifactSchema:null,cacheArtifactStatus:null,cacheStatus:N,cacheHit:!1,placementPolicy:c,
cancellation:p,cancellationStatus:p.status,graphLeaseRequired:u!=null,graphLeaseStatus:O,graphLeaseSpec:u,graphLease:D,graphLeaseExecution:F,
durationMs:Math.max(0,z()-E)};if(i.writeEnabled){const T=Date.now(),U=i.ttlMs>0?T+i.ttlMs:null,H=Ur({graphId:t,cachePolicy:i,
result:R,storedAt:T,expiresAt:U,admission:l});this.taskGraphCache.set(i.cacheKey,{storedAt:T,expiresAt:U,artifact:M(H),result:M(
R)}),this.taskGraphCacheArtifacts.set(i.cacheKey,M(H)),this.stats.taskGraphCacheWrites+=1,this.stats.taskGraphCacheArtifactsWritten+=
1,N=i.readEnabled?"miss-stored":"recorded",R.cacheStatus=N,R.cachedAt=T,R.cacheArtifact=H,R.cacheArtifactSchema=H.schema,
R.cacheArtifactStatus=H.status}return this.stats.taskGraphsCompleted+=1,R}catch(R){const T=A.cancelled||(R==null?void 0:
R.code)==="TASK_GRAPH_CANCELLED";if(T?this.stats.taskGraphsCancelled+=1:this.stats.taskGraphsFailed+=1,D!=null&&D.leaseId&&
!F)try{this.rejectGpuResidentLaneLease(D.leaseId,T?"task-graph-cancelled":"task-graph-failed"),O=T?"rejected-cancelled":
"rejected-failed"}catch{O="reject-failed"}throw R.graphId=R.graphId||t,R.taskGraphStatus=T?"cancelled":"failed",R.graphLeaseStatus=
O,R.cancellation=R.cancellation||{...p},R}finally{d!=null&&d.removeEventListener&&d.removeEventListener("abort",v),this.
activeTaskGraphs.delete(t)}}getGpuResidentLaneManager(){return this.gpuResidentLaneManager}getGpuResidentLaneStats(){var e,
t;return((t=(e=this.gpuResidentLaneManager)==null?void 0:e.getStats)==null?void 0:t.call(e))||null}acquireGpuResidentLaneLease(e={}){
var t;if(!((t=this.gpuResidentLaneManager)!=null&&t.acquireLease))throw new Error("GPU resident lane manager is not avai\
lable");return this.gpuResidentLaneManager.acquireLease(e)}completeGpuResidentLaneLease(e,t={}){var r;if(!((r=this.gpuResidentLaneManager)!=
null&&r.completeLease))throw new Error("GPU resident lane manager is not available");return this.gpuResidentLaneManager.
completeLease(e,t)}rejectGpuResidentLaneLease(e,t="lane-validation-rejected"){var r;if(!((r=this.gpuResidentLaneManager)!=
null&&r.rejectLease))throw new Error("GPU resident lane manager is not available");return this.gpuResidentLaneManager.rejectLease(
e,t)}executeGpuResidentLaneStagePlan(e,t={}){var r;if(!((r=this.gpuResidentLaneManager)!=null&&r.executeStagePlan))throw new Error(
"GPU resident lane manager cannot execute stage plans");return this.gpuResidentLaneManager.executeStagePlan(e,t)}preflightGpuResidentLaneStagePlacement(e,t={}){
var r;if(!((r=this.gpuResidentLaneManager)!=null&&r.preflightStagePlacement))throw new Error("GPU resident lane manager \
cannot preflight stage placement");return this.gpuResidentLaneManager.preflightStagePlacement(e,t)}planGpuResidentLaneStagePlacement(e,t={}){
return this.preflightGpuResidentLaneStagePlacement(e,t)}async distributeTask(e,t){}async cancelTask(e,t={}){const r=this.
taskQueue.findIndex(c=>c.id===e),s=r>=0?this.taskQueue[r]:this.activeTasks.get(e);if(!s)return{cancelled:!1,status:"not-\
found"};if(!s.control)return{cancelled:!1,status:"unsupported-executor"};if(s.control.cancelRequested)return s.control.cancellation;
if(r<0&&!s.worker)return{cancelled:!1,status:"unsupported-executor"};s.control.cancelRequested=!0;const n=Object.assign(
new Error(String(t.reason||"Compute task cancelled")),{name:"AbortError",code:"ERR_COMPUTE_TASK_CANCELLED"});let i;const o=new Promise(
(c,u)=>{i=u});if(s.control.cancellation=Promise.race([s.completion,o]).then(()=>({cancelled:!0,status:"settled",workerTerminated:!!n.
workerTerminated})),r>=0)return this.taskQueue.splice(r,1),this._recordTaskCompletion(s,{ok:!1,mode:"queued"}),s.reject(
n),this._scheduleNext(),{cancelled:!0,status:"cancelled-queued"};const l=()=>{if(!s.control.settled){if(!this._removeWorker(
s.worker)){clearTimeout(s.control.timer),s.control.cancelRequested=!1,i(this.workerTerminationFailures.get(s.worker));return}
this.activeTasks.delete(e),n.workerTerminated=!0,this._recordTaskCompletion(s,{ok:!1,mode:"worker"}),s.reject(n),this._ensureTargetWorkers(
{reason:"cancelled-worker"}),this._scheduleNext()}};s.control.timer=setTimeout(l,S(t.timeoutMs,2e3,1,6e4));try{s.worker.
postMessage({type:"cancel",id:e})}catch{l()}return s.control.cancellation}async reserveWorkerAffinity(e){var l,c;if(this.
destroying)throw new Error("ComputeManager is shutting down");const t=this.workerLifecycleRevision,r=String(e||"").trim();
if(!r)throw new TypeError("Worker affinity key is required");if(this.initialized||await this.initialize(),this.destroying||
t!==this.workerLifecycleRevision)throw new Error("ComputeManager shutdown interrupted reservation");if(!this._supportsWorkers())
throw this._createRequiredWorkerError("resident sessions require workers");if(this.residentWorkerAffinities.has(r)){const u=this.
getWorkerAffinityState(r),m=this.workerTerminationFailures.get(this.workerAffinities.get(r));if(m)throw m;if(!u.workerId)
throw Object.assign(new Error("Resident worker was terminated"),{workerTerminated:!0,code:"ERR_COMPUTE_WORKER_TERMINATED"});
return u}if(this.residentWorkerAffinities.size>=this.workerPolicy.maxWorkers)throw new Error("Resident worker capacity e\
xceeded");const s=new Set([...this.activeTasks.values()].map(u=>u.worker)),n=new Set(this.workerAffinities.values());let i=this.
workers.find(u=>!s.has(u)&&!n.has(u));if(!i&&this.workers.length<this.workerPolicy.maxWorkers&&(i=this._spawnWorker()),!i)
throw new Error("No unassigned worker available for resident session");this.workerAffinities.set(r,i),this.residentWorkerAffinities.
add(r);let o;try{if(await Promise.race([(l=this.workerBootstrap.get(i))==null?void 0:l.promise,new Promise((u,m)=>{o=setTimeout(
()=>m(this._createRequiredWorkerError("resident worker readiness timed out")),this.config.workerBootstrapTimeoutMs)})]),
!this.workers.includes(i)||((c=this.workerBootstrap.get(i))==null?void 0:c.protocolVersion)!==2)throw this._createRequiredWorkerError(
"resident worker needs managed task protocol version 2");return this.getWorkerAffinityState(r)}catch(u){if(u.workerTerminated=
this._removeWorker(i),u.workerTerminated)this.residentWorkerAffinities.delete(r),this.workerAffinities.delete(r);else throw this.
workerTerminationFailures.get(i);throw u}finally{clearTimeout(o)}}getWorkerAffinityState(e){const t=this.workerAffinities.
get(e);return{affinityKey:e,reserved:this.residentWorkerAffinities.has(e),workerId:t?this._workerId(t):null}}async terminateWorkerAffinity(e,{
reason:t="Resident runtime terminated"}={}){var n;if(!this.residentWorkerAffinities.has(e))throw new Error("Cannot termi\
nate an unreserved worker affinity");const r=this.workerAffinities.get(e);if(r&&!this._removeWorker(r))throw this.workerTerminationFailures.
get(r);const s=Object.assign(new Error(String(t)),{code:"ERR_COMPUTE_WORKER_TERMINATED",workerTerminated:!0});for(const[
i,o]of this.activeTasks)((n=o.payload)==null?void 0:n.affinityKey)===e&&(this.activeTasks.delete(i),this._recordTaskCompletion(
o,{ok:!1,mode:"worker"}),o.reject(s));return this.taskQueue=this.taskQueue.filter(i=>{var o;return((o=i.payload)==null?void 0:
o.affinityKey)!==e?!0:(this._recordTaskCompletion(i,{ok:!1,mode:"queued"}),i.reject(s),!1)}),this._ensureTargetWorkers({
reason:"resident-runtime-terminated"}),this._scheduleNext(),{affinityKey:e,workerTerminated:!0}}async releaseWorkerAffinity(e){
const t=this.workerTerminationFailures.get(this.workerAffinities.get(e));if(t)throw t;if([...this.activeTasks.values(),...this.
taskQueue].some(r=>{var s;return((s=r.payload)==null?void 0:s.affinityKey)===e}))throw new Error("Cannot release a worke\
r affinity while its task is active");this.residentWorkerAffinities.delete(e),this.workerAffinities.delete(e),this._retireIdleWorkers(),
this._scheduleNext()}cancelTaskGraph(e,t="cancelTaskGraph"){const r=String(e||"").trim(),s=this.activeTaskGraphs.get(r);
return s?(s.cancelled=!0,s.reason=String(t||"cancelTaskGraph"),{schema:Ce,graphId:r,status:"cancel-requested",cancelled:!0,
reason:s.reason}):{schema:Ce,graphId:r||null,status:"not-found",cancelled:!1,reason:String(t||"cancelTaskGraph")}}listActiveTaskGraphs(){
return Array.from(this.activeTaskGraphs.values()).map(e=>({schema:ot,graphId:e.graphId,status:e.cancelled?"cancel-reques\
ted":"running",startedAt:e.startedAt,cacheKey:e.cacheKey||null,placementPolicy:e.placementPolicy?JSON.parse(JSON.stringify(
e.placementPolicy)):null,graphLeaseRequired:e.graphLaneSpec!=null,cancellationReason:e.reason||null}))}getTaskGraphCacheArtifact(e){
const t=String(e||"").trim(),r=this.taskGraphCacheArtifacts.get(t);return r?M(r):null}listTaskGraphCacheArtifacts(){return Array.
from(this.taskGraphCacheArtifacts.values()).map(e=>M(e)).sort((e,t)=>String(e.cacheKey||"").localeCompare(String(t.cacheKey||
"")))}importRemoteTaskGraphCacheResult(e={},t={},r={}){var y,f,g,w,I,k,P;const s=e!=null&&e.cacheArtifact&&typeof e.cacheArtifact==
"object"?e.cacheArtifact:null,n=String((s==null?void 0:s.cacheKey)||(e==null?void 0:e.cacheKey)||(t==null?void 0:t.cacheKey)||
"").trim();if(!n)throw this.stats.taskGraphRemoteCacheImportBlocked+=1,new Error("importRemoteTaskGraphCacheResult requi\
res a cacheKey");if(!s)throw this.stats.taskGraphRemoteCacheImportBlocked+=1,new Error("importRemoteTaskGraphCacheResult\
 requires result.cacheArtifact");if((t==null?void 0:t.admitted)!==!0){this.stats.taskGraphRemoteCacheImportBlocked+=1;const E=new Error(
`Remote task graph cache artifact is not admitted: ${n}`);throw E.code="ERR_REMOTE_TASK_GRAPH_CACHE_ARTIFACT_NOT_ADMITTE\
D",E.cacheKey=n,E}const i=Date.now(),o=s.storedAt||e.cachedAt||i,l=s.expiresAt||null,c=C((y=e==null?void 0:e.graphLeaseSpec)==
null?void 0:y.retainedBufferRefs,(f=e==null?void 0:e.cacheInputs)==null?void 0:f.retainedBufferRefs,(g=s==null?void 0:s.
inputs)==null?void 0:g.retainedBufferRefs),u={schema:kt,source:"remote-task-graph-result",remoteOnly:!0,usableLocally:!1,
status:c.length>0?"remote-retained-buffer-refs-metadata-only":"no-remote-retained-buffer-refs",reason:c.length>0?"remote\
-gpu-resident-refs-are-not-local-device-leases":"remote-result-did-not-declare-retained-buffer-refs",laneId:((w=e==null?
void 0:e.graphLeaseSpec)==null?void 0:w.laneId)||((I=e==null?void 0:e.graphLease)==null?void 0:I.laneId)||null,stateKey:((k=
e==null?void 0:e.graphLeaseSpec)==null?void 0:k.stateKey)||((P=e==null?void 0:e.graphLease)==null?void 0:P.stateKey)||null,
retainedBufferRefs:c,graphLeaseStatus:(e==null?void 0:e.graphLeaseStatus)||null,graphLeaseRequired:(e==null?void 0:e.graphLeaseRequired)===
!0},m={schema:je,status:"admitted",admitted:!0,authority:t.authority||"node-kernel-state-manager",admissionId:t.admissionId||
null,validatorId:t.validatorId||null,reason:t.reason||"remote-task-graph-cache-artifact-admitted",invalidationRefs:C(t.invalidationRefs,
s.invalidationRefs),acceptedAt:t.acceptedAt||t.admittedAt||i},d={schema:lt,status:"imported-admitted-remote-cache-result",
cacheKey:n,graphId:(e==null?void 0:e.graphId)||s.graphId||null,sourcePeerId:r.sourcePeerId||t.sourcePeerId||null,responderId:r.
responderId||t.responderId||null,requestId:r.requestId||t.requestId||null,admissionId:t.admissionId||null,importedAt:i,remoteArtifactStatus:s.
status||null,remoteArtifactAdmitted:s.admitted===!0,retainedGpuLaneRefs:u,retainedGpuLaneRefsStatus:u.status,resultHash:s.
resultHash||null,inputHash:s.inputHash||(e==null?void 0:e.cacheInputHash)||null},p={...M(s),cacheKey:n,status:"admitted-\
remote-cache-artifact-recorded",admitted:!0,admission:m,stateAdmission:M(t),remoteCacheImport:d,remoteGraphLeaseRefs:u},
h={...M(e),cacheKey:n,cacheAdmission:m,cacheAdmissionStatus:m.status,cacheArtifact:M(p),cacheArtifactStatus:p.status,cacheArtifactSchema:p.
schema||null,cacheStatus:"remote-imported",cacheHit:!1,remoteTaskGraphCacheImport:d,remoteGraphLeaseRefs:u};return this.
taskGraphCacheArtifacts.set(n,M(p)),this.taskGraphCache.set(n,{storedAt:o,expiresAt:l,artifact:M(p),result:M(h)}),this.stats.
taskGraphRemoteCacheImports+=1,M(d)}evaluateRemoteTaskGraphStateSeedPolicy(e,t={}){var W,G,V,Q,te,re,ae,se,R,T,U,H,x,Y,$,
de,me,pe,Je;const r=e&&typeof e=="object"?e:t,s=String(typeof e=="string"?e:(r==null?void 0:r.cacheKey)||"").trim(),n=Date.
now(),i=s&&this.taskGraphCache.get(s)||null,o=s&&(this.taskGraphCacheArtifacts.get(s)||(i==null?void 0:i.artifact))||null,
l=(i==null?void 0:i.result)||null,c=(l==null?void 0:l.remoteTaskGraphCacheImport)||(o==null?void 0:o.remoteCacheImport)||
null,u=_(l==null?void 0:l.stateSeedPayload,l==null?void 0:l.stateSeed,l==null?void 0:l.warmStateSeed,o==null?void 0:o.stateSeedPayload,
o==null?void 0:o.stateSeed,(W=o==null?void 0:o.outputs)==null?void 0:W.stateSeed,r==null?void 0:r.stateSeedPayload,r==null?
void 0:r.stateSeed),m=(l==null?void 0:l.remoteGraphLeaseRefs)||(o==null?void 0:o.remoteGraphLeaseRefs)||(c==null?void 0:
c.retainedGpuLaneRefs)||null,d=ge((G=l==null?void 0:l.cacheInputs)==null?void 0:G.stateFamilies,(Q=(V=l==null?void 0:l.cachePolicy)==
null?void 0:V.inputs)==null?void 0:Q.stateFamilies,(te=o==null?void 0:o.inputs)==null?void 0:te.stateFamilies,(re=o==null?
void 0:o.cacheInputs)==null?void 0:re.stateFamilies,r==null?void 0:r.stateFamilies),p=ge((ae=l==null?void 0:l.cacheInputs)==
null?void 0:ae.readFamilies,(R=(se=l==null?void 0:l.cachePolicy)==null?void 0:se.inputs)==null?void 0:R.readFamilies,(T=
o==null?void 0:o.inputs)==null?void 0:T.readFamilies,(U=o==null?void 0:o.cacheInputs)==null?void 0:U.readFamilies,r==null?
void 0:r.readFamilies),h=ge((H=l==null?void 0:l.cacheInputs)==null?void 0:H.writeFamilies,(Y=(x=l==null?void 0:l.cachePolicy)==
null?void 0:x.inputs)==null?void 0:Y.writeFamilies,($=o==null?void 0:o.inputs)==null?void 0:$.writeFamilies,(de=o==null?
void 0:o.cacheInputs)==null?void 0:de.writeFamilies,r==null?void 0:r.writeFamilies),y=C((r==null?void 0:r.allowedStateFamilies)??
(r==null?void 0:r.allowedFamilies),[]),f=ge(m==null?void 0:m.retainedBufferRefs,(me=l==null?void 0:l.graphLeaseSpec)==null?
void 0:me.retainedBufferRefs,(pe=l==null?void 0:l.cacheInputs)==null?void 0:pe.retainedBufferRefs,(Je=o==null?void 0:o.inputs)==
null?void 0:Je.retainedBufferRefs,r==null?void 0:r.retainedBufferRefs),g=(m==null?void 0:m.usableLocally)===!0&&(m==null?
void 0:m.remoteOnly)!==!0,w=(c==null?void 0:c.schema)===lt||(l==null?void 0:l.cacheStatus)==="remote-imported"||(o==null?
void 0:o.status)==="admitted-remote-cache-artifact-recorded",I=(o==null?void 0:o.admitted)===!0,k=(r==null?void 0:r.requireStateFamilies)!==
!1,P=y.length>0?d.filter(St=>!y.includes(St)):[];let E="state-family-not-evaluated";d.length===0?E=k?"state-family-missi\
ng":"state-family-not-declared":y.length===0?E="state-family-policy-not-declared":P.length>0?E="state-family-blocked":E=
"state-family-allowed";let A="policy-ready",v="remote-cache-import-admitted-for-local-policy";s?!i&&!o?(A="blocked-cache\
-miss",v="cache-entry-not-found"):I?w?E==="state-family-missing"?(A="blocked-missing-state-families",v="remote-import-di\
d-not-declare-state-families"):E==="state-family-policy-not-declared"?(A="blocked-missing-state-family-policy",v="allowe\
d-state-family-policy-is-required"):E==="state-family-blocked"&&(A="blocked-state-family-policy",v="remote-import-declar\
es-state-families-outside-policy"):(A="blocked-not-remote-import",v="cache-entry-did-not-originate-from-admitted-remote-\
task-graph-import"):(A="blocked-unadmitted-cache-artifact",v="cache-artifact-is-not-admitted"):(A="blocked-no-cache-key",
v="remote-state-seed-policy-requires-cache-key");const B=A==="policy-ready",D=(r==null?void 0:r.allowWarmStateSeed)===!0,
F=(r==null?void 0:r.allowHotBufferRefresh)===!0,O=D?B?"warm-state-seed-allowed":"warm-state-seed-blocked":"warm-state-se\
ed-not-requested";let N=F?"no-retained-buffer-refs":"hot-buffer-refresh-not-requested";return F&&!B?N="hot-buffer-refres\
h-blocked":F&&f.length>0&&g?N="local-buffer-refs-usable":F&&f.length>0&&(N="local-refresh-required"),{schema:Ar,status:A,
reason:v,cacheKey:s||null,requestedAt:n,cacheEntryPresent:i!=null,artifactPresent:o!=null,admitted:I,remoteImported:w,importStatus:(c==
null?void 0:c.status)||null,importSchema:(c==null?void 0:c.schema)||null,importReport:c?M(c):null,stateFamilies:d,readFamilies:p,
writeFamilies:h,stateSeedPayloadAvailable:u!=null,stateSeedPayload:u!=null?M(u):null,allowedStateFamilies:y,disallowedStateFamilies:P,
stateFamilyStatus:E,warmStateSeedRequested:D,warmStateSeedStatus:O,hotBufferRefreshRequested:F,hotBufferRefreshStatus:N,
retainedBufferRefs:f,remoteRetainedRefsUsableLocally:g,remoteGraphLeaseRefs:m?M(m):null}}admitTaskGraphCacheArtifact(e,t={}){
const r=e&&typeof e=="object"?e:t,s=String(typeof e=="string"?e:(r==null?void 0:r.cacheKey)||"").trim();if(!s)throw new Error(
"admitTaskGraphCacheArtifact requires a cacheKey");const n=this.taskGraphCache.get(s),i=this.taskGraphCacheArtifacts.get(
s)||(n==null?void 0:n.artifact)||null;if(!i)return null;const o=M(r||{}),l=o.admittedAt||o.acceptedAt||Date.now(),c={schema:je,
status:"admitted",admitted:!0,authority:o.authority||"state-manager",admissionId:o.admissionId||null,validatorId:o.validatorId||
null,reason:o.reason||"state-manager-cache-artifact-admitted",invalidationRefs:C(o.invalidationRefs),acceptedAt:l},u=i.admitted===
!0,m={...M(i),status:"admitted-cache-artifact-recorded",admitted:!0,admission:c,stateAdmission:o};if(this.taskGraphCacheArtifacts.
set(s,M(m)),n){const d=M(n.result||{});d.cacheAdmission=c,d.cacheAdmissionStatus=c.status,d.cacheArtifact=M(m),d.cacheArtifactStatus=
m.status,d.cacheArtifactSchema=m.schema||null,this.taskGraphCache.set(s,{...n,artifact:M(m),result:d})}return u||(this.stats.
taskGraphCacheArtifactsAdmitted+=1),M(m)}invalidateTaskGraphCacheArtifact(e,t={}){const r=e&&typeof e=="object"?e:t,s=String(
typeof e=="string"?e:(r==null?void 0:r.cacheKey)||"").trim();if(!s)throw new Error("invalidateTaskGraphCacheArtifact req\
uires a cacheKey");const n=M(r||{}),i=this.taskGraphCache.get(s),o=this.taskGraphCacheArtifacts.get(s)||(i==null?void 0:
i.artifact)||null;if(this.taskGraphCache.delete(s),this.stats.taskGraphCacheInvalidations+=1,!o)return{cacheKey:s,status:"\
invalidated",admitted:!1,invalidation:n};const l={...M(o),status:"invalidated",admitted:!1,invalidation:n,invalidatedAt:n.
invalidatedAt||Date.now()};return this.taskGraphCacheArtifacts.set(s,M(l)),M(l)}configurePlacementHooks(e={}){var m,d,p,
h,y,f;const t=g=>Object.prototype.hasOwnProperty.call(e,g),r=(...g)=>{for(const w of g)if(t(w))return{found:!0,value:e[w]};
return{found:!1,value:void 0}},s=r("placementExecutor","remotePlacementExecutor","executor");s.found?(this.placementExecutor=
typeof s.value=="function"||(m=s.value)!=null&&m.submitTask?s.value:null,this.placementExecutorId=e.placementExecutorId||
e.remotePlacementExecutorId||e.executorId||Le(this.placementExecutor)):(t("placementExecutorId")||t("remotePlacementExec\
utorId")||t("executorId"))&&(this.placementExecutorId=e.placementExecutorId||e.remotePlacementExecutorId||e.executorId||
Le(this.placementExecutor));const n=r("placementAdmission","remotePlacementAdmission","admission");n.found?(this.placementAdmission=
typeof n.value=="function"||(d=n.value)!=null&&d.admitTask?n.value:null,this.placementAdmissionId=e.placementAdmissionId||
e.remotePlacementAdmissionId||e.admissionId||We(this.placementAdmission)):(t("placementAdmissionId")||t("remotePlacement\
AdmissionId")||t("admissionId"))&&(this.placementAdmissionId=e.placementAdmissionId||e.remotePlacementAdmissionId||e.admissionId||
We(this.placementAdmission));const i=r("placementResultValidator","remotePlacementResultValidator","resultValidator","va\
lidator");i.found?(this.placementResultValidator=typeof i.value=="function"||(p=i.value)!=null&&p.validateTaskResult||(h=
i.value)!=null&&h.validateResult?i.value:null,this.placementResultValidatorId=e.placementResultValidatorId||e.remotePlacementResultValidatorId||
e.resultValidatorId||e.validatorId||De(this.placementResultValidator)):(t("placementResultValidatorId")||t("remotePlacem\
entResultValidatorId")||t("resultValidatorId")||t("validatorId"))&&(this.placementResultValidatorId=e.placementResultValidatorId||
e.remotePlacementResultValidatorId||e.resultValidatorId||e.validatorId||De(this.placementResultValidator));const o=r("pl\
acementTaskSigner","remoteTaskSigner","taskSigner","signer");o.found?(this.placementTaskSigner=typeof o.value=="function"||
(y=o.value)!=null&&y.signTaskPacket||(f=o.value)!=null&&f.signEnvelope?o.value:null,this.placementTaskSignerId=e.placementTaskSignerId||
e.remoteTaskSignerId||e.taskSignerId||e.signerId||Be(this.placementTaskSigner)):(t("placementTaskSignerId")||t("remoteTa\
skSignerId")||t("taskSignerId")||t("signerId"))&&(this.placementTaskSignerId=e.placementTaskSignerId||e.remoteTaskSignerId||
e.taskSignerId||e.signerId||Be(this.placementTaskSigner)),(t("placementTimeoutMs")||t("remotePlacementTimeoutMs"))&&(this.
placementTimeoutMs=S(e.placementTimeoutMs??e.remotePlacementTimeoutMs,this.placementTimeoutMs,0,36e5)),(t("remoteResultV\
erification")||t("placementResultVerification"))&&(this.remoteResultVerification=e.remoteResultVerification!==!1&&e.placementResultVerification!==
!1);const l={...this.placementRetryPolicy},c=e.placementRetryPolicy||e.remotePlacementRetryPolicy||{},u=g=>Object.prototype.
hasOwnProperty.call(c,g)||Object.prototype.hasOwnProperty.call(e,g);return(u("maxAttempts")||u("placementMaxAttempts")||
u("remotePlacementMaxAttempts"))&&(l.maxAttempts=S(c.maxAttempts??e.placementMaxAttempts??e.remotePlacementMaxAttempts,l.
maxAttempts,1,100)),(u("baseDelayMs")||u("placementRetryBaseDelayMs")||u("remotePlacementRetryBaseDelayMs"))&&(l.baseDelayMs=
S(c.baseDelayMs??e.placementRetryBaseDelayMs??e.remotePlacementRetryBaseDelayMs,l.baseDelayMs,0,6e5)),(u("maxDelayMs")||
u("placementRetryMaxDelayMs")||u("remotePlacementRetryMaxDelayMs"))&&(l.maxDelayMs=S(c.maxDelayMs??e.placementRetryMaxDelayMs??
e.remotePlacementRetryMaxDelayMs,l.maxDelayMs,0,6e5)),(u("jitterFraction")||u("placementRetryJitterFraction")||u("remote\
PlacementRetryJitterFraction"))&&(l.jitterFraction=j(c.jitterFraction??e.placementRetryJitterFraction??e.remotePlacementRetryJitterFraction,
l.jitterFraction,0,1)),(u("retryableErrorKinds")||u("placementRetryableErrorKinds")||u("remotePlacementRetryableErrorKin\
ds"))&&(l.retryableErrorKinds=C(c.retryableErrorKinds??e.placementRetryableErrorKinds??e.remotePlacementRetryableErrorKinds,
l.retryableErrorKinds||Z)),this.placementRetryPolicy=this._getPlacementRetryPolicyReport(l),this.getCapabilities()}getCapabilities(){
return{...this.capabilities,resourceProfile:this.getResourceProfile(),workerPolicy:this.getWorkerPolicy(),workers:this.workers.
length,targetWorkers:this.targetWorkerCount,minWorkers:this.workerPolicy.minWorkers,maxWorkers:this.workerPolicy.maxWorkers,
solverCount:this.solverRegistry.list().length,placementExecutor:!!this.placementExecutor,placementExecutorId:this.placementExecutorId,
placementAdmission:!!this.placementAdmission,placementAdmissionId:this.placementAdmissionId,placementResultValidator:!!this.
placementResultValidator,placementResultValidatorId:this.placementResultValidatorId,placementTaskSigner:!!this.placementTaskSigner,
placementTaskSignerId:this.placementTaskSignerId,placementTimeoutMs:this.placementTimeoutMs,placementRetryPolicy:this._getPlacementRetryPolicyReport(),
remoteResultVerification:this.remoteResultVerification,affinityCount:this.workerAffinities.size,activeTaskCount:this.activeTasks.
size,queuedTaskCount:this.taskQueue.length,workerSpawnFailures:this.workerSpawnFailures,workerRetirements:this.workerRetirements,
workerPoolRevision:this.workerPoolRevision,lastWorkerResize:JSON.parse(JSON.stringify(this.lastWorkerResize)),workerResizeHistory:JSON.
parse(JSON.stringify(this.workerResizeHistory)),workerAutoScaleHold:this._getWorkerAutoScaleHoldStatus(),workerRequirement:this.
_getWorkerRequirementReport(),gpuResidentLanes:this.getGpuResidentLaneStats(),stats:this.getStats()}}getStats(){const e=Math.
max(1,this.workers.length||this.targetWorkerCount||this.workerPolicy.targetWorkers||1),t=(this.activeTasks.size+this.taskQueue.
length)/e;return{schema:this.stats.schema,totalTasksSubmitted:this.stats.totalTasksSubmitted,totalTasksCompleted:this.stats.
totalTasksCompleted,totalTasksFailed:this.stats.totalTasksFailed,inlineTasksCompleted:this.stats.inlineTasksCompleted,workerTasksCompleted:this.
stats.workerTasksCompleted,remoteTasksCompleted:this.stats.remoteTasksCompleted,remoteTasksFailed:this.stats.remoteTasksFailed,
remoteTasksTimedOut:this.stats.remoteTasksTimedOut,remoteTasksRejected:this.stats.remoteTasksRejected,remoteTasksVerificationFailed:this.
stats.remoteTasksVerificationFailed,remoteTasksValidationFailed:this.stats.remoteTasksValidationFailed,remoteTaskAttempts:this.
stats.remoteTaskAttempts,remoteTasksRetried:this.stats.remoteTasksRetried,remoteTasksRetryExhausted:this.stats.remoteTasksRetryExhausted,
taskGraphsSubmitted:this.stats.taskGraphsSubmitted,taskGraphsCompleted:this.stats.taskGraphsCompleted,taskGraphsFailed:this.
stats.taskGraphsFailed,taskGraphsCancelled:this.stats.taskGraphsCancelled,taskGraphCacheHits:this.stats.taskGraphCacheHits,
taskGraphCacheWrites:this.stats.taskGraphCacheWrites,taskGraphCacheArtifactsWritten:this.stats.taskGraphCacheArtifactsWritten,
taskGraphCacheArtifactsAdmitted:this.stats.taskGraphCacheArtifactsAdmitted,taskGraphRemoteCacheImports:this.stats.taskGraphRemoteCacheImports,
taskGraphRemoteCacheImportBlocked:this.stats.taskGraphRemoteCacheImportBlocked,taskGraphCacheInvalidations:this.stats.taskGraphCacheInvalidations,
taskGraphCacheReadBlocked:this.stats.taskGraphCacheReadBlocked,averageTaskDuration:this.stats.averageTaskDurationMs,averageTaskDurationMs:this.
stats.averageTaskDurationMs,lastTaskDurationMs:this.stats.lastTaskDurationMs,minTaskDurationMs:this.stats.minTaskDurationMs,
maxTaskDurationMs:this.stats.maxTaskDurationMs,currentLoad:Number(t.toFixed(4)),activeTaskCount:this.activeTasks.size,activeTaskGraphCount:this.
activeTaskGraphs.size,queuedTaskCount:this.taskQueue.length,taskGraphCacheSize:this.taskGraphCache.size,taskGraphCacheArtifactCount:this.
taskGraphCacheArtifacts.size,workerCount:this.workers.length,targetWorkers:this.targetWorkerCount,workerPoolRevision:this.
workerPoolRevision,lastWorkerResize:JSON.parse(JSON.stringify(this.lastWorkerResize)),workerResizeHistory:JSON.parse(JSON.
stringify(this.workerResizeHistory)),workerAutoScaleHold:this._getWorkerAutoScaleHoldStatus(),workerRequirement:this._getWorkerRequirementReport(),
workerUtilization:this._getWorkerUtilizationReport(),activeTaskGraphs:this.listActiveTaskGraphs(),gpuResidentLanes:this.
getGpuResidentLaneStats(),taskPlacement:JSON.parse(JSON.stringify(this.stats.taskPlacement)),lastCompletedAt:this.stats.
lastCompletedAt,byRuntime:JSON.parse(JSON.stringify(this.stats.byRuntime)),byTaskFamily:JSON.parse(JSON.stringify(this.stats.
byTaskFamily))}}_getPlacementRetryPolicyReport(e=this.placementRetryPolicy){return{schema:ne,maxAttempts:S(e==null?void 0:
e.maxAttempts,1,1,100),baseDelayMs:S(e==null?void 0:e.baseDelayMs,0,0,6e5),maxDelayMs:S(e==null?void 0:e.maxDelayMs,0,0,
6e5),jitterFraction:j(e==null?void 0:e.jitterFraction,0,0,1),retryableErrorKinds:C(e==null?void 0:e.retryableErrorKinds,
Z),terminalErrorKinds:[...ye]}}async _executeTask(e){}_scheduleNext(){}_handleTaskComplete(e,t){}_handleTaskError(e,t){}_supportsWorkers(){
return typeof Worker<"u"&&this.config.enableWorkers}_createRequiredWorkerError(e,t=null){const r=new Error(`ComputeManag\
er requires a bootstrapped browser worker: ${e}`);return r.name="RequiredWorkerUnavailableError",r.code="ERR_COMPUTE_REQ\
UIRED_WORKER_UNAVAILABLE",r.reason=e,t!=null&&(r.cause=t),r}_failRequiredWorkerPool(e){const t=(e==null?void 0:e.code)===
"ERR_COMPUTE_REQUIRED_WORKER_UNAVAILABLE"?e:this._createRequiredWorkerError((e==null?void 0:e.message)||String(e||"the r\
equired worker pool failed"),e);this.workerRequirementError=t,this.initialized=!1,clearTimeout(this.scaleDownTimer),this.
scaleDownTimer=null;for(const r of[...this.workers])this._markWorkerBootstrapFailed(r,t),this._removeWorker(r);for(const[
r,s]of this.activeTasks.entries())this.workers.includes(s.worker)||this.activeTasks.delete(r),this._rejectTaskGpuResidentLaneLease(
s,t.code),this._recordTaskCompletion(s,{ok:!1,mode:s.executionMode||"worker",errorKind:"required-worker-unavailable",errorMessage:t.
message}),s.reject(Object.assign(new Error(t.message),{name:t.name,code:t.code,workerTerminated:!this.workers.includes(s.
worker)}));return this._rejectQueuedTasksForRequiredWorkerFailure(t),t}_createWorkerBootstrapRecord(e){let t=null,r=null;
const s={status:"bootstrapping",startedAt:z(),readyAt:null,reason:null,promise:null,resolve:null,reject:null,timeout:null,
messageErrorListener:null};if(s.promise=new Promise((n,i)=>{t=n,r=i}),s.promise.catch(()=>{}),s.resolve=t,s.reject=r,this.
workerBootstrap.set(e,s),this.config.requireWorkers){const n=this.config.workerBootstrapTimeoutMs;s.timeout=setTimeout(()=>{
s.status==="bootstrapping"&&this._handleWorkerFailure(e,this._createRequiredWorkerError(`worker bootstrap did not acknow\
ledge readiness within ${n}ms`))},n)}return s}_markWorkerBootstrapped(e){var r;const t=this.workerBootstrap.get(e);!t||t.
status!=="bootstrapping"||(clearTimeout(t.timeout),t.timeout=null,t.status="ready",t.readyAt=z(),(r=t.resolve)==null||r.
call(t,e))}_markWorkerBootstrapFailed(e,t){var s;const r=this.workerBootstrap.get(e);!r||r.status!=="bootstrapping"||(clearTimeout(
r.timeout),r.timeout=null,r.status="failed",r.reason=(t==null?void 0:t.message)||String(t||"worker bootstrap failed"),(s=
r.reject)==null||s.call(r,t instanceof Error?t:this._createRequiredWorkerError(r.reason)))}_markWorkerBootstrapRetired(e){
var r;const t=this.workerBootstrap.get(e);!t||t.status!=="bootstrapping"||(clearTimeout(t.timeout),t.timeout=null,t.status=
"retired",t.reason="worker retired before bootstrap completed",(r=t.resolve)==null||r.call(t,e))}_getWorkerRequirementReport(){
var s;const e=this.workers.filter(n=>{var i;return((i=this.workerBootstrap.get(n))==null?void 0:i.status)==="ready"}).length,
t=this.workers.filter(n=>{var i;return((i=this.workerBootstrap.get(n))==null?void 0:i.status)==="bootstrapping"}).length,
r=this.config.requireWorkers===!0;return{required:r,status:this.workerRequirementError?"blocked":r?e>0&&e===this.workers.
length?"ready":"bootstrapping":"not-required",workerCount:this.workers.length,readyWorkerCount:e,bootstrappingWorkerCount:t,
reason:((s=this.workerRequirementError)==null?void 0:s.message)||null}}async _waitForRequiredWorkerBootstrap(){const e=this.
workers.map(t=>this.workerBootstrap.get(t)).filter(Boolean);if(e.length===0)throw this._createRequiredWorkerError("no br\
owser worker was registered during bootstrap");await Promise.all(e.map(t=>t.promise))}_rejectQueuedTasksForRequiredWorkerFailure(e){
var t;for(;this.taskQueue.length>0;){const r=this.taskQueue.shift();this._rejectTaskGpuResidentLaneLease(r,e.code||"requ\
ired-worker-unavailable"),this._recordTaskCompletion(r,{ok:!1,mode:"worker",errorKind:"required-worker-unavailable",errorMessage:e.
message}),r.reject(Object.assign(new Error(e.message),{name:e.name,code:e.code,workerTerminated:!this.workerAffinities.has(
(t=r.payload)==null?void 0:t.affinityKey)}))}}_canDispatchRemotePlacement(e={}){return!!this.placementExecutor&&e.advisoryOnly===
!1&&(e.requestedPlacement==="peer"||e.requestedPlacement==="cluster")}_createTaskPacket(e={},t={}){var l,c,u,m,d,p,h;const r={
runtime:e.runtime,module:e.module,hostModule:e.hostModule,exportName:e.exportName,hostExport:e.hostExport,fn:e.fn,wasm:e.
wasm,wasmSource:e.wasmSource,source:e.source},s={data:e.data,args:e.args,webgpu:e.webgpu,gpuFence:e.gpuFence,gpuResidentLane:e.
gpuResidentLane,placement:t},n=ce(le(r)),i=ce(le(s)),o=ce(le({codeHash:n,inputHash:i,id:e.id,runtime:e.runtime,taskFamily:e.
taskFamily,solverId:e.solverId,placement:(t==null?void 0:t.requestedPlacement)||null}));return{schema:it,taskId:e.id||null,
runtime:e.runtime||null,taskFamily:e.taskFamily||null,solverId:e.solverId||null,requestedPlacement:(t==null?void 0:t.requestedPlacement)||
null,gpuFenceRequired:((l=e.gpuFence)==null?void 0:l.required)===!0,gpuFenceSchema:((c=e.gpuFence)==null?void 0:c.schema)||
null,gpuLaneId:((u=e.gpuFence)==null?void 0:u.laneId)||null,gpuStateKey:((m=e.gpuFence)==null?void 0:m.stateKey)||null,gpuQueueFencePolicy:((d=
e.gpuFence)==null?void 0:d.queueFencePolicy)||null,gpuResidentLaneSchema:((p=e.gpuResidentLane)==null?void 0:p.schema)||
null,gpuResidentLaneLocalExecution:((h=e.gpuResidentLane)==null?void 0:h.localExecution)||null,codeHash:n,inputHash:i,taskHash:o,
hashAlgorithm:"fnv1a32-stable-json",generatedAt:Date.now()}}_normalizePlacementTaskSignature(e){if(e==null||e===!1)return{
signed:!1,reason:e===!1?"signer-declined":"no-signature"};if(typeof e=="string")return{signed:!0,signature:e,signatureAlgorithm:"\
custom-signature"};if(typeof e=="object"){const t=e.signature||e.value||null;return{...e,signed:e.signed!==!1&&!!t,signature:t,
signatureAlgorithm:e.signatureAlgorithm||e.algorithm||"custom-signature",reason:e.reason||(t?"signed":"no-signature")}}return{
signed:!0,signature:String(e),signatureAlgorithm:"custom-signature",reason:"signed"}}async _createTaskEnvelope(e,{mode:t=null}={}){
var u,m;const r=((u=e.payload)==null?void 0:u.taskPacket)||null,s=e.placement||((m=e.payload)==null?void 0:m.placement)||
null,n={schema:nt,taskPacketSchema:(r==null?void 0:r.schema)||null,taskPacket:r,mode:t,signed:!1,signerId:null,signature:null,
signatureAlgorithm:null,reason:"no-task-signer",createdAt:Date.now()};if(!this.placementTaskSigner)return n;const i={manager:this,
task:e,placement:s,payload:e.payload,taskPacket:r,mode:t},o=this.placementTaskSigner,l=typeof o=="function"?await o(r,i):
o.signTaskPacket?await o.signTaskPacket(r,i):await o.signEnvelope(n,i),c=this._normalizePlacementTaskSignature(l);return{
...n,...c,schema:c.schema||nt,taskPacket:r,signerId:c.signerId||this.placementTaskSignerId||"placement-task-signer",signedAt:c.
signedAt||Date.now()}}_normalizePlacementAdmissionResult(e){return e===!1?{accepted:!1,reason:"admission-denied"}:e==null||
e===!0?{accepted:!0,reason:"accepted"}:typeof e=="object"?{...e,accepted:e.accepted!==!1&&e.ok!==!1,reason:e.reason||(e.
accepted===!1||e.ok===!1?"admission-denied":"accepted")}:{accepted:!0,reason:String(e||"accepted")}}_normalizePlacementValidationResult(e){
return e===!1?{valid:!1,reason:"validation-denied"}:e==null||e===!0?{valid:!0,reason:"validated"}:typeof e=="object"?{...e,
valid:e.valid!==!1&&e.accepted!==!1&&e.ok!==!1,reason:e.reason||(e.valid===!1||e.accepted===!1||e.ok===!1?"validation-de\
nied":"validated")}:{valid:!0,reason:String(e||"validated")}}async _runPlacementAdmission(e,{mode:t=null}={}){var i,o,l;
if(!this.placementAdmission)return{accepted:!0,reason:"no-admission-hook",admissionId:null};const r={manager:this,task:e,
placement:e.placement||((i=e.payload)==null?void 0:i.placement)||null,payload:e.payload,taskPacket:((o=e.payload)==null?
void 0:o.taskPacket)||null,taskEnvelope:((l=e.payload)==null?void 0:l.taskEnvelope)||null,mode:t},s=typeof this.placementAdmission==
"function"?await this.placementAdmission(e.payload,r):await this.placementAdmission.admitTask(e.payload,r),n=this._normalizePlacementAdmissionResult(
s);return{...n,schema:n.schema||"peercompute.compute.placement-admission.v0",admissionId:n.admissionId||this.placementAdmissionId||
"placement-admission",mode:t,decidedAt:Date.now()}}async _runPlacementResultValidator(e,{mode:t=null,finalResult:r=null,
commitDelta:s=null,provenance:n=null}={}){var u,m,d;if(!this.placementResultValidator)return{schema:st,valid:!0,reason:"\
no-result-validator",validationId:null,mode:t,decidedAt:Date.now()};const i={manager:this,task:e,placement:e.placement||
((u=e.payload)==null?void 0:u.placement)||null,payload:e.payload,taskPacket:((m=e.payload)==null?void 0:m.taskPacket)||null,
taskEnvelope:((d=e.payload)==null?void 0:d.taskEnvelope)||null,mode:t,finalResult:r,commitDelta:s,provenance:n},o=this.placementResultValidator,
l=typeof o=="function"?await o(r,i):o.validateTaskResult?await o.validateTaskResult(r,i):await o.validateResult(r,i),c=this.
_normalizePlacementValidationResult(l);return{...c,schema:c.schema||st,validationId:c.validationId||this.placementResultValidatorId||
"placement-result-validator",mode:t,decidedAt:Date.now()}}_placementRejectedError(e,{mode:t}){const r=new Error(`Remote \
placement rejected for ${t}: ${(e==null?void 0:e.reason)||"admission-denied"}`);return r.name="PlacementAdmissionRejecte\
dError",r.code="ERR_COMPUTE_PLACEMENT_REJECTED",r.placementMode=t,r.reason=(e==null?void 0:e.reason)||"admission-denied",
r.admission=e||null,r}_placementValidationError(e,t,{mode:r}){const s=new Error(`Remote placement result validation fail\
ed for ${r}: ${(e==null?void 0:e.reason)||"validation-denied"}`);return s.name="PlacementResultValidationError",s.code="\
ERR_COMPUTE_PLACEMENT_VALIDATION",s.placementMode=r,s.reason=(e==null?void 0:e.reason)||"validation-denied",s.validation=
e||null,s.provenance=t||null,s}_placementTimeoutFor(e){var t,r,s;return S(((t=e.placement)==null?void 0:t.timeoutMs)??((s=
(r=e.payload)==null?void 0:r.placement)==null?void 0:s.timeoutMs)??this.placementTimeoutMs,this.placementTimeoutMs,0,36e5)}_placementRetryPolicyFor(e={}){
var l;const t=e.placement||((l=e.payload)==null?void 0:l.placement)||{},r=this.placementRetryPolicy||{},s=S(t.maxAttempts??
t.retryMaxAttempts??t.remoteMaxAttempts??t.remoteRetryMaxAttempts??r.maxAttempts,1,1,100),n=S(t.retryBaseDelayMs??t.remoteRetryBaseDelayMs??
r.baseDelayMs,0,0,6e5),i=S(t.retryMaxDelayMs??t.remoteRetryMaxDelayMs??r.maxDelayMs,n,0,6e5),o=j(t.retryJitterFraction??
t.remoteRetryJitterFraction??r.jitterFraction,0,0,1);return this._getPlacementRetryPolicyReport({...r,maxAttempts:s,baseDelayMs:n,
maxDelayMs:i,jitterFraction:o,retryableErrorKinds:C(t.retryableErrorKinds??t.remoteRetryableErrorKinds??r.retryableErrorKinds,
Z)})}_placementErrorKind(e){return(e==null?void 0:e.code)==="ERR_COMPUTE_PLACEMENT_TIMEOUT"?"timeout":(e==null?void 0:e.
code)==="ERR_COMPUTE_PLACEMENT_REJECTED"?"rejected":(e==null?void 0:e.code)==="ERR_COMPUTE_PLACEMENT_VERIFICATION"?"veri\
fication-failed":(e==null?void 0:e.code)==="ERR_COMPUTE_PLACEMENT_VALIDATION"?"validation-failed":"executor-error"}_placementRetryDelayMs(e,t){
const r=S(t==null?void 0:t.baseDelayMs,0,0,6e5),s=S(t==null?void 0:t.maxDelayMs,r,0,6e5),n=Math.max(0,S(e,1,1,100)-1),i=Math.
min(s,r*2**n),o=j(t==null?void 0:t.jitterFraction,0,0,1);if(o<=0||i<=0)return i;const l=i*o*Math.random();return Math.min(
s,Math.round(i+l))}_placementRetryDecision({attempt:e,errorKind:t,err:r,policy:s,mode:n}){const i=new Set(C(s==null?void 0:
s.retryableErrorKinds,Z)),o=new Set(ye),l=S(s==null?void 0:s.maxAttempts,1,1,100),c=o.has(t),u=!c&&i.has(t),m=e<l,d=u&&m;
return{schema:ne,mode:n,attempt:e,nextAttempt:d?e+1:null,maxAttempts:l,errorKind:t,errorCode:(r==null?void 0:r.code)||null,
errorMessage:(r==null?void 0:r.message)||String(r||""),retryable:u,terminal:c,retryScheduled:d,exhausted:u&&l>1&&!m,delayMs:d?
this._placementRetryDelayMs(e,s):0,decidedAt:Date.now()}}_placementRetrySummary(e,{mode:t,ok:r=!0,errorKind:s=null}={}){
const n=Array.isArray(e.placementRetryEvents)?e.placementRetryEvents:[],i=e.placementRetryPolicy||this._placementRetryPolicyFor(
e),o=n.filter(c=>c.retryScheduled).length,l=n[n.length-1]||null;return{schema:ne,mode:t,maxAttempts:i.maxAttempts,attemptCount:S(
e.placementAttempt,o+1,0,100),retryCount:o,retried:o>0,retryableErrorKinds:C(i.retryableErrorKinds,Z),terminalErrorKinds:[
...ye],exhausted:!r&&!!(l!=null&&l.exhausted),finalErrorKind:r?null:s||(l==null?void 0:l.errorKind)||null,events:JSON.parse(
JSON.stringify(n))}}_runPlacementExecutor(e,{signal:t=null,timeoutMs:r=this.placementTimeoutMs,mode:s=null,attempt:n=1,retryPolicy:i=null}={}){
var l,c,u;const o={manager:this,task:e,placement:e.placement||((l=e.payload)==null?void 0:l.placement)||null,payload:e.payload,
taskPacket:((c=e.payload)==null?void 0:c.taskPacket)||null,taskEnvelope:((u=e.payload)==null?void 0:u.taskEnvelope)||null,
signal:t,timeoutMs:r,mode:s,attempt:n,retryPolicy:i};return typeof this.placementExecutor=="function"?this.placementExecutor(
e.payload,o):this.placementExecutor.submitTask(e.payload,o)}_runPlacementExecutorWithTimeout(e,{mode:t,attempt:r=1,retryPolicy:s=null}={}){
const n=this._placementTimeoutFor(e),i=typeof AbortController<"u"?new AbortController:null,o=Promise.resolve().then(()=>this.
_runPlacementExecutor(e,{signal:(i==null?void 0:i.signal)||null,timeoutMs:n,mode:t,attempt:r,retryPolicy:s}));if(n<=0)return o;
let l=null;const c=new Promise((u,m)=>{l=setTimeout(()=>{var p;const d=new Error(`Placement executor timed out after ${n}\
ms for ${t}`);d.name="PlacementExecutorTimeoutError",d.code="ERR_COMPUTE_PLACEMENT_TIMEOUT",d.timeoutMs=n,d.placementMode=
t;try{(p=i==null?void 0:i.abort)==null||p.call(i,d)}catch{}m(d)},n)});return Promise.race([o,c]).finally(()=>{l!=null&&clearTimeout(
l)})}_normalizeRemotePlacementProvenance(e,{task:t,mode:r,result:s,finalResult:n,startedAt:i=null,completedAtMs:o=null,completedAt:l=Date.
now()}={}){var k,P,E,A,v;const c=e&&typeof e=="object"?e:{},u=(t==null?void 0:t.payload)||{},m=(t==null?void 0:t.placement)||
u.placement||{},d=Number.isFinite(Number(c.durationMs))?Number(c.durationMs):Number.isFinite(Number(c.roundTripMs))?Number(
c.roundTripMs):Number.isFinite(Number(i))&&Number.isFinite(Number(o))?Math.max(0,Number(o)-Number(i)):null,p=s&&typeof s==
"object"?s:{},h=n&&typeof n=="object"?n:{},y=(t==null?void 0:t.placementAdmission)||null,f=u.taskPacket||null,g=u.taskEnvelope||
null,w=$r(c.replicas||c.replicaResults||((k=c.quorum)==null?void 0:k.replicas)||p.replicas||p.replicaResults),I=we(c.gpuFence||
c.gpuFenceReport||p.gpuFence||p.gpuFenceReport||h.gpuFence||h.gpuFenceReport||((P=c.remoteExecution)==null?void 0:P.gpuFence)||
((E=c.remoteExecution)==null?void 0:E.gpuFenceReport)||((v=(A=c.remoteExecution)==null?void 0:A.computeExecution)==null?
void 0:v.gpuFence),u.gpuFence||(f==null?void 0:f.gpuFence)||null);return{schema:kr,taskPacketSchema:(f==null?void 0:f.schema)||
null,taskEnvelopeSchema:(g==null?void 0:g.schema)||null,taskSigned:(g==null?void 0:g.signed)===!0,signerId:c.signerId||(g==
null?void 0:g.signerId)||null,signatureAlgorithm:c.signatureAlgorithm||(g==null?void 0:g.signatureAlgorithm)||null,mode:r,
executorId:c.executorId||this.placementExecutorId||"placement-executor",promotedReplicaExecutorId:c.promotedReplicaExecutorId||
null,admissionId:(y==null?void 0:y.admissionId)||null,admissionReason:(y==null?void 0:y.reason)||null,requestedPlacement:m.
requestedPlacement||null,taskId:u.id||(t==null?void 0:t.id)||null,taskFamily:u.taskFamily||(t==null?void 0:t.taskFamily)||
null,solverId:u.solverId||m.solverId||null,solverKey:m.solverKey||null,peerId:c.peerId||c.remotePeerId||null,targetPeerId:c.
targetPeerId||null,transportPeerId:c.transportPeerId||null,responderNodeId:c.responderNodeId||null,responderPeerId:c.responderPeerId||
null,requesterId:c.requesterId||null,requestId:c.requestId||null,clusterId:c.clusterId||null,workerId:c.workerId||c.remoteWorkerId||
null,remoteExecution:c.remoteExecution&&typeof c.remoteExecution=="object"?JSON.parse(JSON.stringify(c.remoteExecution)):
null,gpuFence:I,gpuFenceStatus:(I==null?void 0:I.status)??null,gpuFenceSatisfied:(I==null?void 0:I.fenceSatisfied)??!1,codeHash:c.
codeHash||p.codeHash||(f==null?void 0:f.codeHash)||null,inputHash:c.inputHash||p.inputHash||(f==null?void 0:f.inputHash)||
null,taskHash:c.taskHash||p.taskHash||(f==null?void 0:f.taskHash)||null,outputHash:c.outputHash||p.outputHash||null,resultHash:c.
resultHash||p.resultHash||c.outputHash||p.outputHash||null,commitDeltaHash:c.commitDeltaHash||p.commitDeltaHash||c.deltaHash||
p.deltaHash||null,resultSchema:c.resultSchema||h.schema||p.schema||null,role:c.role||null,trustLevel:c.trustLevel||"inje\
cted-executor",redundantPlacement:c.redundantPlacement&&typeof c.redundantPlacement=="object"?JSON.parse(JSON.stringify(
c.redundantPlacement)):null,primary:c.primary&&typeof c.primary=="object"?JSON.parse(JSON.stringify(c.primary)):null,primaryFailure:c.
primaryFailure&&typeof c.primaryFailure=="object"?JSON.parse(JSON.stringify(c.primaryFailure)):null,promotedReplica:c.promotedReplica&&
typeof c.promotedReplica=="object"?JSON.parse(JSON.stringify(c.promotedReplica)):null,replicaSuccessCount:S(c.replicaSuccessCount,
0,0,1e6),replicaFailureCount:S(c.replicaFailureCount,0,0,1e6),redundantReplicaCount:S(c.redundantReplicaCount??w.length,
w.length,0,1e6),replicaCount:w.length,quorumReplicaCount:S(c.quorumReplicaCount??w.length,w.length,0,1e6),replicas:w,validated:c.
validated===!0,durationMs:d==null?null:Number(d.toFixed(3)),completedAt:l}}_verifyRemotePlacementProvenance(e={},t={}){var l,
c,u;const r=((l=t==null?void 0:t.payload)==null?void 0:l.taskPacket)||null,s=Date.now();if(!this.remoteResultVerification)
return{schema:be,verified:!0,skipped:!0,reason:"verification-disabled",checkedAt:s};if(!r||r.schema!==it)return{schema:be,
verified:!1,skipped:!1,reason:"task-packet-missing",taskPacketSchema:(r==null?void 0:r.schema)||null,mismatchFields:["ta\
skPacket"],checks:[],checkedAt:s};const n=["codeHash","inputHash","taskHash"].map(m=>{const d=r[m]||null,p=(e==null?void 0:
e[m])||null;return{field:m,expected:d,actual:p,ok:!!d&&d===p}});r.gpuFenceRequired===!0&&n.push({field:"gpuFence",expected:"\
fence-satisfied",actual:((c=e==null?void 0:e.gpuFence)==null?void 0:c.status)||null,ok:((u=e==null?void 0:e.gpuFence)==null?
void 0:u.fenceSatisfied)===!0});const i=n.filter(m=>!m.ok).map(m=>m.field),o=i.length===0?"hashes-match":i.includes("gpu\
Fence")?"gpu-fence-missing-or-unsatisfied":"hash-mismatch";return{schema:be,verified:i.length===0,skipped:!1,reason:o,taskPacketSchema:r.
schema,hashAlgorithm:r.hashAlgorithm||null,mismatchFields:i,checks:n,checkedAt:s}}_placementVerificationError(e,t,{mode:r}){
const s=new Error(`Remote placement verification failed for ${r}: ${(e==null?void 0:e.reason)||"hash-mismatch"}`);return s.
name="PlacementResultVerificationError",s.code="ERR_COMPUTE_PLACEMENT_VERIFICATION",s.placementMode=r,s.reason=(e==null?
void 0:e.reason)||"hash-mismatch",s.verification=e||null,s.provenance=t||null,s}_unwrapPlacementExecutorResult(e,t,{mode:r,
startedAt:s}){let n=e,i=null,o=null;if(e&&typeof e=="object"){Object.prototype.hasOwnProperty.call(e,"commitDelta")&&(i=
e.commitDelta),o=e.provenance||e.remoteProvenance||e.placementProvenance||null;const d=Object.prototype.hasOwnProperty.call(
e,"commitDelta")||o||Object.prototype.hasOwnProperty.call(e,"remoteProvenance")||Object.prototype.hasOwnProperty.call(e,
"placementProvenance");d&&Object.prototype.hasOwnProperty.call(e,"value")?n=e.value:d&&Object.prototype.hasOwnProperty.call(
e,"result")&&(n=e.result)}const l=Date.now(),c=z(),u=this._normalizeRemotePlacementProvenance(o,{task:t,mode:r,result:e,
finalResult:n,startedAt:s,completedAtMs:c,completedAt:l}),m=this._verifyRemotePlacementProvenance(u,t);if(u.verification=
m,u.verified=m.verified,!m.verified)throw this._placementVerificationError(m,u,{mode:r});return{finalResult:n,commitDelta:i,
provenance:u}}async _runRemotePlacementWithRetries(e,{mode:t}){const r=this._placementRetryPolicyFor(e);e.placementRetryPolicy=
r,e.placementRetryEvents=[];for(let n=1;n<=r.maxAttempts;n+=1){e.placementAttempt=n,this._recordPlacementAttempt(e,{mode:t,
attempt:n,retryPolicy:r});const i=z();try{const o=await this._runPlacementExecutorWithTimeout(e,{mode:t,attempt:n,retryPolicy:r}),
{finalResult:l,commitDelta:c,provenance:u}=this._unwrapPlacementExecutorResult(o,e,{mode:t,startedAt:i}),m=await this._runPlacementResultValidator(
e,{mode:t,finalResult:l,commitDelta:c,provenance:u});if(u.validation=m,!m.valid)throw this._placementValidationError(m,u,
{mode:t});return u.retry=this._placementRetrySummary(e,{mode:t,ok:!0}),{finalResult:l,commitDelta:c,provenance:u}}catch(o){
const l=this._placementErrorKind(o),c=this._placementRetryDecision({attempt:n,errorKind:l,err:o,policy:r,mode:t});if(o.retry=
c,e.placementRetryEvents.push(c),!c.retryScheduled)throw o;this._recordPlacementRetry(e,{mode:t,retry:c}),await Wr(c.delayMs)}}
const s=new Error(`Remote placement exhausted retry policy for ${t}`);throw s.name="PlacementRetryExhaustedError",s.code=
"ERR_COMPUTE_PLACEMENT_RETRY_EXHAUSTED",s.placementMode=t,s.retry=this._placementRetrySummary(e,{mode:t,ok:!1,errorKind:"\
executor-error"}),s}_dispatchToPlacementExecutor(e){var n;const t=e.placement||((n=e.payload)==null?void 0:n.placement)||
{};if(!this._canDispatchRemotePlacement(t))return!1;const r=`remote-${t.requestedPlacement}`;e.payload.taskPacket=this._createTaskPacket(
e.payload,t);const s={...e,startedAt:z(),executionMode:r,placementExecutorId:this.placementExecutorId,placementAdmissionId:this.
placementAdmissionId,placementAdmission:null};return this.activeTasks.set(e.id,s),Promise.resolve().then(()=>this._createTaskEnvelope(
s,{mode:r})).then(i=>(s.payload.taskEnvelope=i,null)).then(()=>this._runPlacementAdmission(s,{mode:r})).then(i=>{if(s.placementAdmission=
i,!i.accepted)throw this._placementRejectedError(i,{mode:r});return null}).then(()=>this._runRemotePlacementWithRetries(
s,{mode:r})).then(({finalResult:i,commitDelta:o,provenance:l})=>{o&&this.commitDelta(o),this._recordTaskCompletion(s,{ok:!0,
mode:r,provenance:l,admission:s.placementAdmission,retry:l.retry||this._placementRetrySummary(s,{mode:r,ok:!0})}),s.resolve(
i)}).catch(i=>{var c;const o=this._placementErrorKind(i),l=((c=i==null?void 0:i.retry)==null?void 0:c.schema)===ne?this.
_placementRetrySummary(s,{mode:r,ok:!1,errorKind:o}):null;this._recordTaskCompletion(s,{ok:!1,mode:r,errorKind:o,errorMessage:(i==
null?void 0:i.message)||String(i),admission:s.placementAdmission||(i==null?void 0:i.admission)||null,provenance:(i==null?
void 0:i.provenance)||null,retry:l}),s.reject(i)}).finally(()=>{this.activeTasks.delete(e.id),this._scheduleIdleScaleDown(),
this._scheduleNext()}),!0}_spawnWorker(){try{const e=this.workerBootstrapURL?new Worker(this.workerBootstrapURL,{type:"m\
odule"}):fr();this._createWorkerBootstrapRecord(e);const t=this.nextWorkerOrdinal;this.nextWorkerOrdinal+=1;const r=`wor\
ker-${t}`;if(this.workerIds.set(e,r),this.workerUtilization.set(r,Oe({executorId:r,kind:"worker",ordinal:t,status:"activ\
e"})),e.onmessage=s=>this._handleWorkerMessage(e,s.data),e.onerror=s=>this._handleWorkerFailure(e,s),typeof e.addEventListener==
"function"){const s=this.workerBootstrap.get(e),n=i=>this._handleWorkerFailure(e,i);s&&(s.messageErrorListener=n),e.addEventListener(
"messageerror",n)}return this.workers.push(e),e}catch(e){return this.workerSpawnFailures+=1,this.config.requireWorkers?(this.
_failRequiredWorkerPool(this._createRequiredWorkerError("constructing a browser worker threw",e)),null):(console.warn("[\
ComputeManager] Failed to start worker; falling back to inline execution",e),null)}}_workerId(e){return this.workerIds.get(
e)||null}_executorStats(e,{kind:t="worker",ordinal:r=null,status:s="active"}={}){const n=String(e||this.inlineExecutorId);
return this.workerUtilization.has(n)||this.workerUtilization.set(n,Oe({executorId:n,kind:t,ordinal:r,status:s})),this.workerUtilization.
get(n)}_executorBucket(e,t){const r=String(t||"unknown");return e[r]||(e[r]=Fe()),e[r]}_recordExecutorStart(e,t,{kind:r="\
worker"}={}){var o,l;const s=this._executorStats(e,{kind:r}),n=t.runtime||((o=t.payload)==null?void 0:o.runtime)||"unkno\
wn",i=t.taskFamily||((l=t.payload)==null?void 0:l.taskFamily)||"unknown";s.status=s.status==="retired"?"retired":"active",
s.activeTaskCount+=1,s.submitted+=1,s.lastRuntime=n,s.lastTaskFamily=i,s.lastStartedAt=Date.now(),this._executorBucket(s.
byRuntime,n).submitted+=1,this._executorBucket(s.byTaskFamily,i).submitted+=1,t.executorId=s.executorId,t.executorActive=
!0}_recordExecutorCompletion(e,{ok:t=!0,durationMs:r=0}={}){var d,p;const s=e.executorId;if(!s)return;const n=this.workerUtilization.
get(s);if(!n)return;e.executorActive&&(n.activeTaskCount=Math.max(0,n.activeTaskCount-1),e.executorActive=!1);const i=e.
runtime||((d=e.payload)==null?void 0:d.runtime)||"unknown",o=e.taskFamily||((p=e.payload)==null?void 0:p.taskFamily)||"u\
nknown",l=this._executorBucket(n.byRuntime,i),c=this._executorBucket(n.byTaskFamily,o);t?(n.completed+=1,l.completed+=1,
c.completed+=1):(n.failed+=1,l.failed+=1,c.failed+=1);const u=Number(Math.max(0,r).toFixed(3));n.totalDurationMs+=r,n.lastDurationMs=
u,n.maxDurationMs=Math.max(n.maxDurationMs,u);const m=n.completed+n.failed;n.averageDurationMs=m>0?Number((n.totalDurationMs/
m).toFixed(3)):0,n.lastRuntime=i,n.lastTaskFamily=o,n.lastCompletedAt=Date.now();for(const h of[l,c]){h.totalDurationMs+=
r,h.lastDurationMs=u,h.maxDurationMs=Math.max(h.maxDurationMs,u);const y=h.completed+h.failed;h.averageDurationMs=y>0?Number(
(h.totalDurationMs/y).toFixed(3)):0}}_recordExecutorAbandon(e){const t=e.executorId;if(!t||!e.executorActive)return;const r=this.
workerUtilization.get(t);r&&(r.activeTaskCount=Math.max(0,r.activeTaskCount-1),r.abandoned+=1,e.executorActive=!1)}_cloneExecutorStats(e){
return JSON.parse(JSON.stringify({...e,activeTaskCount:Math.max(0,e.activeTaskCount||0)}))}_getWorkerUtilizationReport(){
const e=Array.from(this.workerUtilization.values()).filter(m=>m.kind==="worker").sort((m,d)=>(m.ordinal??0)-(d.ordinal??
0)).map(m=>this._cloneExecutorStats(m)),t=this._cloneExecutorStats(this._executorStats(this.inlineExecutorId,{kind:"inli\
ne",ordinal:0})),r=e.filter(m=>m.status==="active"),s=e.filter(m=>m.status==="retired"),n=[t,...e],i=e.reduce((m,d)=>m+(d.
activeTaskCount||0),0),o=n.reduce((m,d)=>m+(d.submitted||0),0),l=n.reduce((m,d)=>m+(d.completed||0),0),c=n.reduce((m,d)=>m+
(d.failed||0),0),u=[...n].sort((m,d)=>(d.activeTaskCount||0)-(m.activeTaskCount||0)||(d.completed||0)-(m.completed||0)||
(d.submitted||0)-(m.submitted||0))[0]||t;return{schema:yr,generatedAt:Date.now(),inline:t,workers:e,summary:{workerCount:this.
workers.length,activeWorkerCount:r.length,retiredWorkerCount:s.length,retainedWorkerCount:e.length,inlineActiveTaskCount:t.
activeTaskCount||0,workerActiveTaskCount:i,activeTaskCount:i+(t.activeTaskCount||0),totalSubmitted:o,totalCompleted:l,totalFailed:c,
busiestExecutorId:u.executorId||null,busiestActiveTaskCount:u.activeTaskCount||0,busiestCompleted:u.completed||0}}}_placementBucket(e,t){
const r=String(t||"unknown");return e[r]||(e[r]=Dr()),e[r]}_normalizeTaskPlacement(e={},{runtime:t="unknown",taskFamily:r="\
unknown"}={}){var o,l,c,u,m,d,p,h;const s=e.placementHint||e.placement||((o=e.data)==null?void 0:o.placementHint)||((l=e.
data)==null?void 0:l.placement)||((u=(c=e.data)==null?void 0:c.solver)==null?void 0:u.placementHint)||null,n=(s==null?void 0:
s.recommendedPlacement)||(s==null?void 0:s.requestedPlacement)||(s==null?void 0:s.placement)||"local",i=["local","peer",
"cluster"].includes(String(n).trim().toLowerCase())?String(n).trim().toLowerCase():"local";return{schema:at,source:s?"ta\
sk-placement-hint-v0":"default-local",advisoryOnly:(s==null?void 0:s.advisoryOnly)!==!1,requestedPlacement:i,recommendedPlacement:i,
actualPlacement:null,solverKey:(s==null?void 0:s.solverKey)||e.solverId||((d=(m=e.data)==null?void 0:m.solver)==null?void 0:
d.id)||null,solverId:(s==null?void 0:s.solverId)||e.solverId||((h=(p=e.data)==null?void 0:p.solver)==null?void 0:h.id)||
null,taskFamily:r,runtime:t,syncMode:(s==null?void 0:s.syncMode)||null,timeoutMs:S(s==null?void 0:s.timeoutMs,this.placementTimeoutMs,
0,36e5),confidence:Number.isFinite(Number(s==null?void 0:s.confidence))?Number(s.confidence):null,targetReplicaCount:S(s==
null?void 0:s.targetReplicaCount,0,0,1e6),peerId:(s==null?void 0:s.peerId)||(s==null?void 0:s.remotePeerId)||e.peerId||e.
remotePeerId||null,clusterId:(s==null?void 0:s.clusterId)||e.clusterId||null,reasons:Array.isArray(s==null?void 0:s.reasons)?
[...s.reasons]:[],constraints:Array.isArray(s==null?void 0:s.constraints)?[...s.constraints]:[]}}_recordPlacementSubmitted(e={}){
const t=this.stats.taskPlacement;if(!t)return;const r=e.requestedPlacement||"local";t.totalSubmitted+=1,r==="local"?t.localSubmitted+=
1:t.remoteRequested+=1,this._placementBucket(t.byRecommendedPlacement,r).submitted+=1,t.lastPlacement={...e,actualPlacement:e.
actualPlacement||null}}_recordPlacementAttempt(e,{mode:t="unknown",attempt:r=1}={}){var c;const s=e.placement||((c=e.payload)==
null?void 0:c.placement),n=this.stats.taskPlacement;if(!s||!n)return;const i=s.requestedPlacement||"local",o=String(t||"\
unknown"),l=o.startsWith("remote-")?o:`local-${o}`;this.stats.remoteTaskAttempts+=1,n.remoteAttempts+=1,this._placementBucket(
n.byRecommendedPlacement,i).attempted+=1,this._placementBucket(n.byActualPlacement,l).attempted+=1,n.lastPlacementAttempt=
{...s,actualPlacement:l,attempt:r,attemptedAt:Date.now()}}_recordPlacementRetry(e,{mode:t="unknown",retry:r=null}={}){var c;
const s=e.placement||((c=e.payload)==null?void 0:c.placement),n=this.stats.taskPlacement;if(!s||!n)return;const i=s.requestedPlacement||
"local",o=String(t||"unknown"),l=o.startsWith("remote-")?o:`local-${o}`;this.stats.remoteTasksRetried+=1,n.remoteRetried+=
1,this._placementBucket(n.byRecommendedPlacement,i).retried+=1,this._placementBucket(n.byActualPlacement,l).retried+=1,n.
lastPlacementRetry={...s,actualPlacement:l,retry:r?JSON.parse(JSON.stringify(r)):null,decidedAt:Date.now()}}_recordPlacementCompletion(e,{
ok:t=!0,mode:r="unknown",errorKind:s=null,errorMessage:n=null,provenance:i=null,admission:o=null,retry:l=null}={}){var f;
const c=e.placement||((f=e.payload)==null?void 0:f.placement),u=this.stats.taskPlacement;if(!c||!u)return;const m=c.requestedPlacement||
"local",d=String(r||"unknown"),p=d.startsWith("remote-")?d:d==="worker"?"local-worker":d==="inline"?"local-inline":`loca\
l-${d}`;t?u.totalCompleted+=1:u.totalFailed+=1,p.startsWith("remote-")&&(t?u.remoteExecuted+=1:(u.remoteFailed+=1,s==="t\
imeout"&&(u.remoteTimedOut+=1),s==="rejected"&&(u.remoteRejected+=1),s==="verification-failed"&&(u.remoteVerificationFailed+=
1),s==="validation-failed"&&(u.remoteValidationFailed+=1),l!=null&&l.exhausted&&(u.remoteRetryExhausted+=1)));const h=this.
_placementBucket(u.byRecommendedPlacement,m),y=this._placementBucket(u.byActualPlacement,p);t?(h.completed+=1,y.completed+=
1):(h.failed+=1,y.failed+=1,s==="timeout"&&(h.timedOut+=1,y.timedOut+=1),s==="rejected"&&(h.rejected+=1,y.rejected+=1),s===
"verification-failed"&&(h.verificationFailed+=1,y.verificationFailed+=1),s==="validation-failed"&&(h.validationFailed+=1,
y.validationFailed+=1),l!=null&&l.exhausted&&(h.retryExhausted+=1,y.retryExhausted+=1)),y.submitted+=1,u.lastPlacement={
...c,actualPlacement:p,completedAt:Date.now(),ok:t,errorKind:s,errorMessage:n,admission:o,provenance:i,retry:l},p.startsWith(
"remote-")&&(u.lastRemotePlacement=JSON.parse(JSON.stringify(u.lastPlacement)))}_runtimeStats(e){const t=String(e||"unkn\
own");return this.stats.byRuntime[t]||(this.stats.byRuntime[t]=Fe()),this.stats.byRuntime[t]}_normalizeTaskFamily(e={},t="\
unknown"){var s,n,i,o,l,c,u,m;const r=e.taskFamily||e.solverId||((n=(s=e.data)==null?void 0:s.solver)==null?void 0:n.id)||
((i=e.data)==null?void 0:i.solverId)||((o=e.data)==null?void 0:o.taskFamily);if(r)return String(r).trim()||"unknown";if(e.
affinityKey||e.workerKey||(l=e.data)!=null&&l.affinityKey||(c=e.data)!=null&&c.stateKey){const d=String(e.affinityKey||e.
workerKey||((u=e.data)==null?void 0:u.affinityKey)||((m=e.data)==null?void 0:m.stateKey)),[p]=d.split(":");if(p)return p}
return String(t||"unknown")}_taskFamilyStats(e){const t=String(e||"unknown");return this.stats.byTaskFamily[t]||(this.stats.
byTaskFamily[t]=Fe()),this.stats.byTaskFamily[t]}_recordTaskCompletion(e,{ok:t=!0,mode:r="unknown",errorKind:s=null,errorMessage:n=null,
provenance:i=null,admission:o=null,retry:l=null}={}){var w,I;const c=e.runtime||((w=e.payload)==null?void 0:w.runtime)||
"unknown",u=this._runtimeStats(c),m=e.taskFamily||((I=e.payload)==null?void 0:I.taskFamily)||"unknown",d=this._taskFamilyStats(
m),p=z(),h=Math.max(0,p-(e.submittedAt||e.startedAt||p)),y=Math.max(0,p-(e.startedAt||e.submittedAt||p));t?(this.stats.totalTasksCompleted+=
1,u.completed+=1,d.completed+=1,r==="worker"?this.stats.workerTasksCompleted+=1:String(r||"").startsWith("remote-")?this.
stats.remoteTasksCompleted+=1:this.stats.inlineTasksCompleted+=1):(this.stats.totalTasksFailed+=1,u.failed+=1,d.failed+=
1,String(r||"").startsWith("remote-")&&(this.stats.remoteTasksFailed+=1,s==="timeout"&&(this.stats.remoteTasksTimedOut+=
1),s==="rejected"&&(this.stats.remoteTasksRejected+=1),s==="verification-failed"&&(this.stats.remoteTasksVerificationFailed+=
1),s==="validation-failed"&&(this.stats.remoteTasksValidationFailed+=1),l!=null&&l.exhausted&&(this.stats.remoteTasksRetryExhausted+=
1))),this.stats.totalTaskDurationMs+=h,this.stats.lastTaskDurationMs=Number(h.toFixed(3)),this.stats.minTaskDurationMs=this.
stats.minTaskDurationMs==null?this.stats.lastTaskDurationMs:Math.min(this.stats.minTaskDurationMs,this.stats.lastTaskDurationMs),
this.stats.maxTaskDurationMs=Math.max(this.stats.maxTaskDurationMs,this.stats.lastTaskDurationMs),this.stats.averageTaskDurationMs=
this.stats.totalTasksCompleted+this.stats.totalTasksFailed>0?Number((this.stats.totalTaskDurationMs/(this.stats.totalTasksCompleted+
this.stats.totalTasksFailed)).toFixed(3)):0,this.stats.lastCompletedAt=Date.now(),u.totalDurationMs+=h,u.lastDurationMs=
this.stats.lastTaskDurationMs,u.maxDurationMs=Math.max(u.maxDurationMs,u.lastDurationMs);const f=u.completed+u.failed;u.
averageDurationMs=f>0?Number((u.totalDurationMs/f).toFixed(3)):0,d.totalDurationMs+=h,d.lastDurationMs=this.stats.lastTaskDurationMs,
d.maxDurationMs=Math.max(d.maxDurationMs,d.lastDurationMs);const g=d.completed+d.failed;d.averageDurationMs=g>0?Number((d.
totalDurationMs/g).toFixed(3)):0,this._recordExecutorCompletion(e,{ok:t,durationMs:y}),this._recordPlacementCompletion(e,
{ok:t,mode:r,errorKind:s,errorMessage:n,admission:o,provenance:i,retry:l})}_removeWorker(e,{terminate:t=!0}={}){if(t)try{
e.terminate()}catch(n){return this.workerTerminationFailures.set(e,Object.assign(new Error("Owned worker termination fai\
led",{cause:n}),{code:"ERR_COMPUTE_WORKER_TERMINATION_FAILED",workerTerminated:!1})),!1}this.workerTerminationFailures.delete(
e),this._markWorkerBootstrapRetired(e);const r=this.workerBootstrap.get(e);if(e.onmessage=null,e.onerror=null,r!=null&&r.
messageErrorListener&&typeof e.removeEventListener=="function"){try{e.removeEventListener("messageerror",r.messageErrorListener)}catch{}
r.messageErrorListener=null}const s=this._workerId(e)||"worker-unknown";if(this.workerUtilization.has(s)){const n=this.workerUtilization.
get(s);n.status="retired"}for(const n of this.activeTasks.values())n.worker===e&&this._recordExecutorAbandon(n);this.workers=
this.workers.filter(n=>n!==e);for(const[n,i]of this.workerAffinities.entries())i===e&&this.workerAffinities.delete(n);return!0}_recordWorkerResize({
reason:e="manual",previousTargetWorkers:t=this.targetWorkerCount,previousWorkerCount:r=this.workers.length}={}){const s=this.
workers.length,n=t!==this.targetWorkerCount||r!==s;n&&(this.workerPoolRevision+=1);const i={schema:"peercompute.compute.\
worker-resize.v0",revision:this.workerPoolRevision,reason:e,previousTargetWorkers:t,targetWorkers:this.targetWorkerCount,
previousWorkerCount:r,workerCount:s,changed:n,timestamp:Date.now()};return this.lastWorkerResize=i,n&&(this.workerResizeHistory.
push(i),this.workerResizeHistory=this.workerResizeHistory.slice(-16)),i}_holdWorkerAutoScale(e="manual",t=this.manualWorkerAutoScaleCooldownMs){
const r=S(t,0,0,6e5);if(r<=0)return this._getWorkerAutoScaleHoldStatus();const s=Date.now()+r;return s>=this.workerAutoScaleHoldUntil&&
(this.workerAutoScaleHoldUntil=s,this.workerAutoScaleHoldReason=e),this._getWorkerAutoScaleHoldStatus()}_getWorkerAutoScaleHoldStatus(e=Date.
now()){const t=Math.max(0,this.workerAutoScaleHoldUntil-e);return{active:t>0,reason:t>0?this.workerAutoScaleHoldReason:null,
remainingMs:t,until:t>0?this.workerAutoScaleHoldUntil:null}}_retireIdleWorkers(){if(this.workers.length<=this.targetWorkerCount)
return;const e=new Set(Array.from(this.activeTasks.values()).map(t=>t.worker));for(const t of[...this.workers].reverse()){
if(this.workers.length<=this.targetWorkerCount)break;e.has(t)||[...this.residentWorkerAffinities].some(r=>this.workerAffinities.
get(r)===t)||(this._removeWorker(t),this.workerRetirements+=1)}}_maybeScaleForQueue(){if(!this.config.autoScaleWorkers||
!this.initialized||!this._supportsWorkers()||this._getWorkerAutoScaleHoldStatus().active||this.workers.length>=this.workerPolicy.
maxWorkers)return;const e=this.activeTasks.size+this.taskQueue.length;if(e<this.workers.length+this.workerPolicy.scaleUpQueueDepth)
return;const t=Math.min(this.workerPolicy.maxWorkers,Math.max(this.targetWorkerCount+1,e));this.resizeWorkers(t,{reason:"\
queue-pressure"})}_scheduleIdleScaleDown(){!this.config.autoScaleWorkers||this.workerPolicy.idleScaleDownMs<1||this._getWorkerAutoScaleHoldStatus().
active||this.activeTasks.size>0||this.taskQueue.length>0||this.workers.length<=this.workerPolicy.targetWorkers||(clearTimeout(
this.scaleDownTimer),this.scaleDownTimer=setTimeout(()=>{this.resizeWorkers(this.workerPolicy.targetWorkers,{reason:"idl\
e-scale-down"})},this.workerPolicy.idleScaleDownMs))}_requiresInlineExecution(e){var t,r;return((r=(t=e.payload)==null?void 0:
t.gpuResidentLane)==null?void 0:r.localExecution)==="inline"}_acquireTaskGpuResidentLaneLease(e){var s,n,i,o,l,c,u,m,d,p,
h;const t=(s=e.payload)==null?void 0:s.gpuResidentLane;if(!t||e.gpuResidentLaneLease||e.gpuResidentLaneExecution)return e.
gpuResidentLaneLease||null;if(!((n=this.gpuResidentLaneManager)!=null&&n.acquireLease))throw new Error("GPU resident lan\
e manager is not available for declared resident-lane task");const r=this.acquireGpuResidentLaneLease({...t,taskId:t.taskId||
e.id||((i=e.payload)==null?void 0:i.id)||null,solverId:t.solverId||((o=e.payload)==null?void 0:o.solverId)||((l=e.payload)==
null?void 0:l.taskFamily)||null,owner:t.owner||((c=e.payload)==null?void 0:c.taskFamily)||"compute-manager-task",queueFencePolicy:t.
queueFencePolicy||((m=(u=e.payload)==null?void 0:u.gpuFence)==null?void 0:m.queueFencePolicy)||null,retainedBufferRefs:(d=
t.retainedBufferRefs)!=null&&d.length?t.retainedBufferRefs:((h=(p=e.payload)==null?void 0:p.gpuFence)==null?void 0:h.retainedBufferRefs)||
[],residentSequenceLaneContract:t.residentSequenceLaneContract||null});return e.gpuResidentLaneLease=r,r}_taskPayloadWithGpuResidentLaneLeaseIdentity(e){
const t=e.payload,r=e.gpuResidentLaneLease;if(!r)return t;const s=Object.freeze({schema:Yt,authoritative:!0,leaseId:r.leaseId,
laneId:r.laneId,stateKey:r.stateKey,sourceFamily:r.sourceFamily,domainKey:r.domainKey,solverId:r.solverId,taskId:r.taskId,
owner:r.owner}),n=t==null?void 0:t.data;return!n||typeof n!="object"||Array.isArray(n)?{...t,gpuResidentLaneLeaseIdentity:s}:
{...t,data:{...n,gpuResidentLaneLeaseIdentity:s},gpuResidentLaneLeaseIdentity:s}}_completeTaskGpuResidentLaneLease(e,t,{
mode:r=null}={}){var u,m,d,p,h,y,f,g,w;const s=e.gpuResidentLaneLease;if(!s||e.gpuResidentLaneExecution)return t;const n=t&&
typeof t=="object"?t:{},i=we(n.gpuFence||n.gpuFenceReport,((u=e.payload)==null?void 0:u.gpuFence)||null),o=((d=(m=e.payload)==
null?void 0:m.gpuFence)==null?void 0:d.required)===!0,l=(p=i==null?void 0:i.retainedBufferRefs)!=null&&p.length?i.retainedBufferRefs:
(f=(y=(h=e.payload)==null?void 0:h.gpuResidentLane)==null?void 0:y.retainedBufferRefs)!=null&&f.length?e.payload.gpuResidentLane.
retainedBufferRefs:((w=(g=e.payload)==null?void 0:g.gpuFence)==null?void 0:w.retainedBufferRefs)||s.retainedBufferRefs||
[],c=this.completeGpuResidentLaneLease(s.leaseId,{status:(i==null?void 0:i.status)||(o?"gpu-fence-report-missing":"queue\
-work-completed"),method:(i==null?void 0:i.method)||null,queueCompletionStatus:(i==null?void 0:i.queueCompletionStatus)||
(i==null?void 0:i.status)||null,queueCompletionMethod:(i==null?void 0:i.queueCompletionMethod)||(i==null?void 0:i.method)||
null,retainedBufferRefs:l,completed:i?i.fenceSatisfied===!0:o?!1:null,source:r?`compute-manager-${r}`:"compute-manager-l\
ocal-task"});return e.gpuResidentLaneExecution=c,e.gpuResidentLaneLease=null,t&&typeof t=="object"&&!Array.isArray(t)?{...t,
gpuFence:t.gpuFence||c.gpuFence,gpuResidentLaneExecution:t.gpuResidentLaneExecution||c,gpuResidentLaneLease:t.gpuResidentLaneLease||
c.lease}:t}_rejectTaskGpuResidentLaneLease(e,t="task-failed"){const r=e.gpuResidentLaneLease;if(!r||e.gpuResidentLaneExecution||
e.gpuResidentLaneRejected)return null;const s=this.rejectGpuResidentLaneLease(r.leaseId,t);return e.gpuResidentLaneRejected=
s,e.gpuResidentLaneLease=null,s}_assertRequiredGpuFenceSatisfied(e,t){var i,o,l,c;if(((o=(i=e.payload)==null?void 0:i.gpuFence)==
null?void 0:o.required)!==!0)return;const r=t&&typeof t=="object"?t:{},s=((l=e.gpuResidentLaneExecution)==null?void 0:l.
gpuFence)||we(r.gpuFence||r.gpuFenceReport,e.payload.gpuFence);if((s==null?void 0:s.fenceSatisfied)===!0)return;const n=new Error(
`GPU fence missing or unsatisfied for task ${e.id||((c=e.payload)==null?void 0:c.id)||"unknown"}`);throw n.name="GpuFenc\
eUnsatisfiedError",n.code="ERR_COMPUTE_GPU_FENCE_UNSATISFIED",n.gpuFence=s||null,n.gpuFenceRequirement=e.payload.gpuFence,
n}_dispatchToWorker(e){var l,c;if(this._requiresInlineExecution(e))return!1;const t=(l=e.payload)==null?void 0:l.affinityKey;
if(t&&this.residentWorkerAffinities.has(t)&&!this.workerAffinities.has(t))return this._recordTaskCompletion(e,{ok:!1,mode:"\
queued"}),e.reject(Object.assign(new Error("Resident worker was terminated"),{code:"ERR_COMPUTE_WORKER_TERMINATED",workerTerminated:!0})),
!0;const r=new Set(Array.from(this.activeTasks.values()).map(u=>u.worker)),s=this.workers.filter(u=>{var m,d;return!this.
workerTerminationFailures.has(u)&&(!(this.config.requireWorkers||(m=e.payload)!=null&&m.requireWorker)||((d=this.workerBootstrap.
get(u))==null?void 0:d.status)==="ready")});let n=null;if(t&&this.workerAffinities.has(t)){const u=this.workerAffinities.
get(t);if(!this.workers.includes(u))this.workerAffinities.delete(t);else if(s.includes(u)){if(r.has(u))return!1;n=u}else
return!1}if(!n){const u=new Set(this.workerAffinities.values()),m=new Set([...this.residentWorkerAffinities].map(p=>this.
workerAffinities.get(p))),d=s.filter(p=>!r.has(p)&&!m.has(p));n=d.find(p=>!u.has(p))||d[0],n&&t&&this.workerAffinities.set(
t,n)}if(!n)return!1;clearTimeout((c=e.control)==null?void 0:c.bootstrapTimer);const i=this._workerId(n)||"worker-unknown",
o={...e,worker:n,workerId:i,startedAt:z(),executionMode:"worker"};this._recordExecutorStart(i,o,{kind:"worker"}),this.activeTasks.
set(e.id,o);try{n.postMessage({type:"run",...e.payload,workerId:i},e.transferables||[])}catch(u){this._handleWorkerFailure(
n,u)}return!0}_buildTaskExecutionReport(e,{mode:t=null,result:r=null}={}){var d,p,h,y,f,g,w;const s=t||e.executionMode||
null,n=e.runtime||((d=e.payload)==null?void 0:d.runtime)||null,i=e.taskFamily||((p=e.payload)==null?void 0:p.taskFamily)||
null,o=e.id||((h=e.payload)==null?void 0:h.id)||null,l=r&&typeof r=="object"?r:{},c=we(l.gpuFence||l.gpuFenceReport,((y=
e.payload)==null?void 0:y.gpuFence)||null)||((f=e.gpuResidentLaneExecution)==null?void 0:f.gpuFence)||null,u=e.executorId||
(s==="inline"||s==="inline-fallback"?this.inlineExecutorId:null),m=s==="worker"&&(e.workerId||e.executorId)||null;return{
schema:gr,taskId:o,runtime:n,taskFamily:i,executionMode:s,executorId:u,workerId:m,gpuFenceRequirement:((g=e.payload)==null?
void 0:g.gpuFence)||null,gpuFence:c,gpuFenceStatus:(c==null?void 0:c.status)??null,gpuFenceSatisfied:(c==null?void 0:c.fenceSatisfied)??
!1,gpuResidentLaneRequirement:((w=e.payload)==null?void 0:w.gpuResidentLane)||null,gpuResidentLaneExecution:e.gpuResidentLaneExecution||
null,gpuResidentLaneRejected:e.gpuResidentLaneRejected||null}}_attachTaskExecutionReport(e,t,{mode:r=null}={}){var n;if(((n=
t.payload)==null?void 0:n.returnEnvelope)!==!0)return e;const s=this._buildTaskExecutionReport(t,{mode:r,result:e});if(e&&
typeof e=="object"&&!Array.isArray(e)){const i={...e};return i.computeExecution||(i.computeExecution=s),i.workerId==null&&
s.workerId&&(i.workerId=s.workerId),i}return{value:e,computeExecution:s,...s.workerId?{workerId:s.workerId}:{}}}async _executeInline(e){
var t,r,s,n;if((t=e.payload)!=null&&t.requireWorker){e.reject(this._createRequiredWorkerError("inline execution is prohi\
bited for this task"));return}e.startedAt=z(),e.executionMode||(e.executionMode="inline"),this._recordExecutorStart(this.
inlineExecutorId,e,{kind:"inline"});try{this._acquireTaskGpuResidentLaneLease(e);const i=await Gt(this._taskPayloadWithGpuResidentLaneLeaseIdentity(
e)),o=this._completeTaskGpuResidentLaneLease(e,i,{mode:e.executionMode||"inline"});if(this._assertRequiredGpuFenceSatisfied(
e,o),o&&typeof o=="object"&&Object.prototype.hasOwnProperty.call(o,"commitDelta")){((r=e.payload)==null?void 0:r.suppressCommitDelta)!==
!0&&this.commitDelta(o.commitDelta);const l=Object.prototype.hasOwnProperty.call(o,"value")?o.value:o.result;this._recordTaskCompletion(
e,{ok:!0,mode:e.executionMode||"inline"}),e.resolve(((s=e.payload)==null?void 0:s.returnEnvelope)===!0?this._attachTaskExecutionReport(
o,e,{mode:e.executionMode||"inline"}):l);return}this._recordTaskCompletion(e,{ok:!0,mode:e.executionMode||"inline"}),e.resolve(
((n=e.payload)==null?void 0:n.returnEnvelope)===!0?this._attachTaskExecutionReport(o,e,{mode:e.executionMode||"inline"}):
o)}catch(i){this._rejectTaskGpuResidentLaneLease(e,(i==null?void 0:i.code)||"inline-task-error"),this._recordTaskCompletion(
e,{ok:!1,mode:e.executionMode||"inline"}),e.reject(i)}}_handleWorkerMessage(e,t){var c,u,m,d,p,h;if(!this.workers.includes(
e))return;const{id:r,type:s,result:n,error:i}=t||{};if(s==="ready"){const y=this.workerBootstrap.get(e);y&&(y.protocolVersion=
t.protocolVersion||1),this._markWorkerBootstrapped(e),this._scheduleNext();return}const o=this.activeTasks.get(r);if(!o||
o.worker!==e)return;if(s==="progress"){if(!((c=o.control)!=null&&c.cancelRequested))try{(u=o.onProgress)==null||u.call(o,
t.value)}catch{this.cancelTask(r,{reason:"Compute progress consumer failed"})}return}if(s!=="result"&&s!=="error")return;
const l=s==="error"&&this.residentWorkerAffinities.has((m=o.payload)==null?void 0:m.affinityKey)&&["ERR_MODEL_GPU","ERR_\
MODEL_GPU_OUT_OF_MEMORY","ERR_MODEL_RUNTIME","MODEL_DISPOSE_FAILED"].includes(t.code);if((d=o.control)!=null&&d.cancelRequested&&
!l){this._recordTaskCompletion(o,{ok:!1,mode:"worker"}),o.reject(Object.assign(new Error("Compute task cancelled"),{name:"\
AbortError",code:"ERR_COMPUTE_TASK_CANCELLED"})),this.activeTasks.delete(r),this._retireIdleWorkers(),this._scheduleNext();
return}if(s==="result"){let y=n;n&&typeof n=="object"&&Object.prototype.hasOwnProperty.call(n,"commitDelta")&&(((p=o.payload)==
null?void 0:p.suppressCommitDelta)!==!0&&this.commitDelta(n.commitDelta),y=Object.prototype.hasOwnProperty.call(n,"value")?
n.value:n.result),this._recordTaskCompletion(o,{ok:!0,mode:"worker"}),o.resolve(((h=o.payload)==null?void 0:h.returnEnvelope)===
!0?this._attachTaskExecutionReport(n,o,{mode:"worker"}):y)}else s==="error"&&(this._recordTaskCompletion(o,{ok:!1,mode:"\
worker"}),o.reject(Object.assign(new Error(i||"Worker task failed"),{name:t.name||"Error",...t.code?{code:t.code}:{}})));
this.activeTasks.delete(r),this._retireIdleWorkers(),this._scheduleIdleScaleDown(),this._scheduleNext()}_handleWorkerFailure(e,t){
if(!this.workers.includes(e))return;if(this._markWorkerBootstrapFailed(e,t),this.config.requireWorkers){this._failRequiredWorkerPool(
this._createRequiredWorkerError("an active browser worker failed",t));return}const r=this._removeWorker(e),s=[];for(const[
n,i]of this.activeTasks.entries())i.worker===e&&(r&&this.activeTasks.delete(n),s.push(i));console.warn("[ComputeManager]\
 Worker failed; recovering eligible tasks",t),s.forEach(n=>{var i,o;if(!r||(i=n.payload)!=null&&i.requireWorker||(o=n.control)!=
null&&o.cancelRequested){const l=r?Object.assign(new Error((t==null?void 0:t.message)||"Managed worker terminated"),{workerTerminated:!0,
code:"ERR_COMPUTE_WORKER_TERMINATED"}):this.workerTerminationFailures.get(e);this._recordTaskCompletion(n,{ok:!1,mode:"w\
orker"}),n.reject(l);return}this.workers.length>0&&this._dispatchToWorker(n)||(n.executionMode="inline-fallback",this._executeInline(
n))}),this._scheduleNext()}_scheduleNext(){if(this.taskQueue.length===0)return;if(this.workerRequirementError){this._rejectQueuedTasksForRequiredWorkerFailure(
this.workerRequirementError);return}if(this._ensureTargetWorkers({reason:"queue-dispatch"}),this.workerRequirementError){
this._rejectQueuedTasksForRequiredWorkerFailure(this.workerRequirementError);return}if(this.workers.length===0){if(this.
config.requireWorkers){const t=this._createRequiredWorkerError("the required worker pool is empty while work is queued");
this.workerRequirementError=t,this._rejectQueuedTasksForRequiredWorkerFailure(t);return}for(;this.taskQueue.length>0;)this.
_executeInline(this.taskQueue.shift());return}const e=[];for(;this.taskQueue.length>0;){const t=this.taskQueue.shift();if(this.
_requiresInlineExecution(t)){this._executeInline(t);continue}this._dispatchToWorker(t)||e.push(t)}this.taskQueue=e}_ensureTargetWorkers({
reason:e="task-demand"}={}){if(this.workerRequirementError)return this.workers.length;if(this.destroying||!this.initialized||
!this._supportsWorkers())return this.workers.length;const t=S(this.targetWorkerCount,this.workerPolicy.targetWorkers,0,this.
workerPolicy.maxWorkers);if(t<=this.workers.length)return this.workers.length;const r=this.targetWorkerCount,s=this.workers.
length;for(;this.workers.length<t&&this._spawnWorker(););return this.workers.length!==s&&this._recordWorkerResize({reason:e,
previousTargetWorkers:r,previousWorkerCount:s}),this.workers.length}}const qe=new URL("mpmComputeTasks-CJHQMMMK.js",import.meta.
url).href,Se=document.getElementById("status"),Qr=document.getElementById("particleCount"),Yr=document.getElementById("g\
ridSize"),Xr=document.getElementById("mass"),Zr=document.getElementById("massDelta"),ea=document.getElementById("momentu\
m"),ta=document.getElementById("momentumDelta"),ra=document.getElementById("checks"),ze=document.getElementById("toggleB\
tn"),aa=document.getElementById("resetBtn"),sa=document.getElementById("error"),na=["Hydrogen","Oxygen","Sodium","Potass\
ium","Magnesium","Aluminum","Silicon","Calcium","Titanium","Iron","Lead"];let ie=null,J=!0,Ae=0,Ne=0,ee=!1,X=null;const ia=.01,
oa=.01,Rt=.005,ct=[.8,.8,1,1.1,.95,1,.95,1.1,1,1,1],la=[2e-4,2e-4,3e-4,3e-4,25e-5,2e-4,15e-5,25e-5,18e-5,17e-5,16e-5],ca=[
.05,.05,.08,.1,.07,.05,.05,.08,.06,.05,.05];function ua(a,e,t){const r=Math.max(0,Math.min(a,ct.length-1)),s=ct[r],n=la[r],
i=ca[r],o=e-300;let l=s*(1+n*o);const c=1/Math.max(.2,1+.1*(t-1));l*=c,l=Math.min(Math.max(l,.4),2.5);let u=i+Math.abs(o)*
1e-4+Math.max(0,t-1)*.02;return u=Math.min(Math.max(u,0),.6),{spacing:l,jitter:u}}const $e={stiffness:2.5,restDensity:4,
dynamicViscosity:.08,dt:Rt,fixedPointScale:1e5};function ue(a){Se.textContent=a}function _e(a){console.error(a),sa.textContent=
(a==null?void 0:a.stack)||String(a),ue("error"),J=!1,ze.disabled=!0}function Et({mass:a,momentum:e}){Ne=Ne*.7+.3*2,Xr.textContent=
a.toFixed(4),ea.textContent=e.map(n=>n.toFixed(4)).join(", "),X||(X={mass:a,momentum:e});const t=X?a-X.mass:0,r=X?e.map(
(n,i)=>n-X.momentum[i]):[0,0,0];Zr.textContent=t.toExponential(3),ta.textContent=r.map(n=>n.toExponential(3)).join(", ");
const s=Math.hypot(r[0],r[1],r[2]);Math.abs(t)>ia||s>oa?Se.textContent=`drift detected (Δm=${t.toExponential(2)}, |Δp|=${s.
toExponential(2)})`:J&&(Se.textContent="running"),ra.textContent=Ne.toFixed(1)}ze.addEventListener("click",()=>{J=!J,ze.
textContent=J?"Pause":"Resume",ue(J?"running":"paused")});aa.addEventListener("click",()=>{X=null,Se.textContent="baseli\
ne reset"});async function da({particleCount:a,gridSize:e,iterations:t,blockOptions:r,stepsRequested:s}){const n=new Jr(
{maxWorkers:1});await n.initialize(),await n.submitTask({module:qe,exportName:"initHeadlessSim",data:{particleCount:a,gridSize:e,
iterations:t,blockOptions:r,constants:$e}});let i=0,o=!1;window.__mpmStarted=!1;function l(c){if(J&&!o&&(o=!0,n.submitTask(
{module:qe,exportName:"stepHeadlessSim",data:{steps:1,diagnostics:!1}}).then(()=>{i+=1,window.__mpmStarted=!0}).catch(_e).
finally(()=>{o=!1})),!ee&&c-Ae>500&&(ee=!0,Ae=c,n.submitTask({module:qe,exportName:"stepHeadlessSim",data:{steps:0,diagnostics:!0}}).
then(({mass:u,momentum:m})=>Et({mass:u,momentum:m})).catch(_e).finally(()=>{ee=!1})),s>0&&i>=s){window.__mpmDone=!0,window.
__mpmStepsRan=i;return}requestAnimationFrame(l)}requestAnimationFrame(l)}async function ma({device:a,particleCount:e,gridSize:t,
iterations:r,blockOptions:s,stepsRequested:n}){ie=At({device:a,particleCount:e,gridSize:t,iterations:r,blockOptions:s,constants:$e}),
window.__mpmStarted=!1;let i=0;function o(l){if(J&&ie&&(ie.step(),window.__mpmStarted=!0,i+=1),ie&&!ee&&l-Ae>500&&(ee=!0,
Ae=l,_t(a,ie.buffers.particleBuffer,e).then(({mass:c,momentum:u})=>Et({mass:c,momentum:u})).catch(_e).finally(()=>{ee=!1})),
n>0&&i>=n){window.__mpmDone=!0,window.__mpmStepsRan=i;return}requestAnimationFrame(o)}requestAnimationFrame(o)}async function pa(){
try{ue("initializing WebGPU…");const a=new URLSearchParams(window.location.search),t=(a.get("compute")||"isolated").toLowerCase()!==
"shared",r=parseInt(a.get("count")||"1000",10),s={x:32,y:32,z:32},n=a.get("material")||"Oxygen",i=Math.max(0,na.indexOf(
n)),o=a.get("temp"),l=parseInt(a.get("steps")||"0",10),c=Math.ceil(Math.cbrt(r)),u=ua(i,o?parseFloat(o):300,$e.ambientPressure||
1),m={start:[2,2,2],gridSize:s,jitter:u.jitter,spacing:u.spacing,materialType:i,cubeSideCount:c,temperature:o?parseFloat(
o):void 0},p=Math.ceil(.05/Rt);if(Qr.textContent=r.toString(),Yr.textContent=`${s.x}×${s.y}×${s.z}`,ue(t?"initializing\
 isolated worker":"initializing shared GPU"),t)await da({particleCount:r,gridSize:s,iterations:p,blockOptions:m,stepsRequested:l});else{
const h=await Tt();if(!h)throw new Error("Shared GPU device unavailable");await ma({device:h,particleCount:r,gridSize:s,
iterations:p,blockOptions:m,stepsRequested:l})}ue("running")}catch(a){_e(a)}}pa();
