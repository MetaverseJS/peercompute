const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./modelTask-CH2bbrR-.js","./GgufArtifactReader-D2WvOtZd.js","./ModelEvidenceService-Cqouo3eH.js","./runtimeDefinition-DOfbGqHF.js","./runtimeDefinition-DR2ESEeO.js","./modelTask-Bq5m6qQp.js","./runtimeDefinition-Co8rRWR2.js","./modelTask-DsI9dIhG.js","./modelTask-C-A6TbIH.js","./runtimeDefinition-C9EVJJca.js","./sf3dModelTask-DutiWakM.js","./sf3dRuntimeDefinition-DVfO8VQf.js","./ModelInferenceService-B5E0lmcM.js"])))=>i.map(i=>d[i]);
import{_ as z,s as pr}from"./ModelEvidenceService-Cqouo3eH.js";import{c as hr}from"./headless-DXPCYyPb.js";import{c as fr}from"./diagnostics-DRxK5GC6.js";
import{h as Dt,j as yr,p as Ot}from"./device-CB8g0LHY.js";import{g as kr}from"./peercomputeDevice-31dfg0A4.js";const qe=new Map,
Ue=new Map,wr={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,
BigInt64Array,BigUint64Array};function Nt(r="Uint8Array"){const e=wr[r];if(!e)throw new Error(`Unsupported typed array v\
iew: ${r}`);return e}function gr(r){return new r.constructor(r)}function Gt(r){return ArrayBuffer.isView(r)&&!(r instanceof
DataView)}function Rr(r){return r instanceof ArrayBuffer?new Uint8Array(r):Gt(r)?new Uint8Array(r.buffer,r.byteOffset,r.
byteLength):Array.isArray(r)?Uint8Array.from(r):null}async function ht(r){const e=String(r);return qe.has(e)||qe.set(e,z(
()=>import(`${e}`),[],import.meta.url)),qe.get(e)}async function Rt(r){const e=Rr(r);if(e)return e;if(typeof r==
"string"||r instanceof URL){const t=await fetch(String(r));if(!t.ok)throw new Error(`Failed to fetch wasm module: ${t.status}\
 ${t.statusText}`);const a=await t.arrayBuffer();return new Uint8Array(a)}throw new Error("wasm.source must be a URL str\
ing, URL, ArrayBuffer, TypedArray, or byte array")}async function Er(r){if(typeof r=="string"||r instanceof URL){const t=String(
r);return Ue.has(t)||Ue.set(t,(async()=>{const a=await Rt(r);return WebAssembly.compile(a)})()),Ue.get(t)}const e=await Rt(
r);return WebAssembly.compile(e)}async function Sr(r,e){if(r.importsModule){const t=await ht(r.importsModule),a=r.importsExport||
"default",s=t[a];if(typeof s=="function")return await s(e)||{};if(s&&typeof s=="object")return s;throw new Error(`WASM i\
mports export "${a}" must be a function or object`)}return r.imports&&typeof r.imports=="object"?r.imports:{}}function qt(r,e,t={}){
var n;const a=t.exportName||e.memoryExport||"memory",s=(n=r.exports)==null?void 0:n[a];if(!(s instanceof WebAssembly.Memory))
throw new Error(`WASM memory export "${a}" was not found`);return s}function br(r,e){if(Object.prototype.hasOwnProperty.
call(r,"values"))return r.values;const t=r.dataKey||r.name;if(t&&e&&Object.prototype.hasOwnProperty.call(e,t))return e[t]}
function Mr(r,e){if(r==null)return null;if(r instanceof e)return r;if(Gt(r))return new e(r.buffer,r.byteOffset,Math.floor(
r.byteLength/e.BYTES_PER_ELEMENT));if(r instanceof ArrayBuffer)return new e(r);if(Array.isArray(r))return e.from(r);throw new Error(
`Unsupported memory input for ${e.name}`)}function Et(r,e,t){(Array.isArray(e.inputViews)?e.inputViews:[]).forEach(s=>{const n=Nt(
s.view),o=Mr(br(s,t),n);if(!o)return;const i=qt(r,e,s),l=Number.isFinite(s.byteOffset)?s.byteOffset:0;new n(i.buffer,l,o.
length).set(o)})}function Ar(r,e){const t=Array.isArray(e.outputViews)?e.outputViews:[];if(t.length===0)return null;const a={};
return t.forEach((s,n)=>{const o=Nt(s.view),i=qt(r,e,s),l=Number.isFinite(s.byteOffset)?s.byteOffset:0,c=Number.isFinite(
s.length)?s.length:0;if(c<=0)throw new Error(`WASM output view "${s.name||n}" must provide a positive length`);const u=s.
name||`output${n}`;a[u]=gr(new o(i.buffer,l,c))}),a}function Ut(r,e){var t;return Array.isArray(e.args)?e.args:Array.isArray(
r.args)?r.args:Array.isArray((t=r.data)==null?void 0:t.args)?r.data.args:[]}function _r(r={}){var a,s;const e=((a=globalThis.
navigator)==null?void 0:a.gpu)??null;if(((s=r.webgpu)==null?void 0:s.required)===!0&&!e)throw new Error("WebGPU is requi\
red for this task but navigator.gpu is unavailable");return{supported:!!e,gpu:e,async requestAdapter(n=(o=>(o=r.webgpu)==
null?void 0:o.adapterOptions)()){return e?e.requestAdapter(n):null},async requestDevice(n={}){var c,u,m,d,h,f,y,p;if(!e)
return null;const o=n.promoteLimits??((c=r.webgpu)==null?void 0:c.promoteLimits)??!0,i=n.adapterOptions||((u=r.webgpu)==
null?void 0:u.adapterOptions)||null,l=n.deviceDescriptor||((m=r.webgpu)==null?void 0:m.deviceDescriptor)||null;if(!o){const k=n.
adapter||await e.requestAdapter(i||void 0);return k?k.requestDevice(l||void 0):null}try{return(await Dt({adapter:n.adapter||
null,adapterOptions:i,allowFallback:n.allowFallback??((d=r.webgpu)==null?void 0:d.allowFallback)??!1,requiredFeatures:n.
requiredFeatures??((h=r.webgpu)==null?void 0:h.requiredFeatures)??[],optionalFeatures:n.optionalFeatures??((f=r.webgpu)==
null?void 0:f.optionalFeatures)??["timestamp-query","shader-f16"],promoteLimits:!0,limitCeilings:n.limitCeilings??((y=r.
webgpu)==null?void 0:y.limitCeilings)??null,deviceDescriptor:l,label:n.label||((p=r.webgpu)==null?void 0:p.label)||"peer\
compute-wasm-webgpu"})).device}catch(k){if((k==null?void 0:k.code)==="ERR_GPU_ADAPTER_UNAVAILABLE"||(k==null?void 0:k.code)===
"ERR_WEBGPU_UNAVAILABLE")return null;throw k}}}}async function Kt(r){const e=r.wasm||{},t=e.source??r.wasmSource??r.source;
if(!t)throw new Error("wasm tasks require wasm.source");const a=await Er(t),s=await Sr(e,{task:r,data:r.data??null,WebAssembly}),
n=await WebAssembly.instantiate(a,s);return Et(n,e,r.data??null),{module:a,instance:n,exports:n.exports,imports:s,task:r,
data:r.data??null,callExport(o,i=[]){var c;const l=(c=n.exports)==null?void 0:c[o];if(typeof l!="function")throw new Error(
`WASM export "${o}" was not found`);return l(...i)},readOutputViews(){return Ar(n,e)},writeInputViews(o){Et(n,e,o)}}}async function Pr(r,e,t){
const a=r.wasm||{};if(!a.resultModule)return t.value;const s=await ht(a.resultModule),n=a.resultExport||"default",o=s[n];
if(typeof o!="function")throw new Error(`WASM result export "${n}" must be a function`);const i=await o({...t,wasm:e,task:r,
data:r.data??null});return typeof i>"u"?t:i}async function Ir(r){const e=await Kt(r),t=r.wasm||{},a=Ut(r,t),s=t.entry?await e.
callExport(t.entry,a):void 0,n=e.readOutputViews();return Pr(r,e,{returnValue:s,outputs:n,value:n?typeof s>"u"?n:{returnValue:s,
outputs:n}:s})}async function Tr(r){var o;const e=await Kt(r),t=r.hostModule||r.module;if(!t)throw new Error("wasm-webgp\
u tasks require hostModule or module");(o=r.wasm)!=null&&o.callEntryBeforeHost&&r.wasm.entry&&(e.entryResult=await e.callExport(
r.wasm.entry,Ut(r,r.wasm)));const a=await ht(t),s=r.hostExport||r.exportName||"default",n=a[s];if(typeof n!="function")throw new Error(
`wasm-webgpu host export "${s}" must be a function`);return n({task:r,data:r.data??null,wasm:e,webgpu:_r(r)})}async function Cr(r){
if(typeof r!="string"||!r.trim())throw new Error("module path must be a non-empty string");return r==="peercompute:model\
-inference"?z(()=>import("./ModelEvidenceService-Cqouo3eH.js").then(e=>e.D),[],import.meta.url):r==="peerc\
ompute:gguf-inference"?z(()=>import("./modelTask-CH2bbrR-.js"),__vite__mapDeps([0,1,2,3,4]),import.meta.url):r==="peercompute:diffus\
ion-inference"?z(()=>import("./modelTask-Bq5m6qQp.js"),__vite__mapDeps([5,2,1,6]),import.meta.url):r==="peercompute:speech-inferen\
ce"?z(()=>import("./modelTask-DsI9dIhG.js"),__vite__mapDeps([7,2,4]),import.meta.url):r==="peercompute:mesh-inference"?z(()=>import("./modelTask-C-A6TbIH.js").
then(e=>e.m),__vite__mapDeps([8,2,1,9]),import.meta.url):r==="peercompute:sf3d-inference"?z(()=>import("./sf3dModelTask-DutiWakM.js").
then(e=>e.s),__vite__mapDeps([10,8,2,1,9,11]),import.meta.url):r==="peercompute:capability-benchmark"?z(()=>Promise.resolve().then(()=>ma),
void 0,import.meta.url):z(()=>import(`${r}`),[],import.meta.url)}function xr(r={}){return typeof r.
runtime=="string"&&r.runtime.trim()?r.runtime.trim().toLowerCase():r.wasm?r.hostModule||r.module?"wasm-webgpu":"wasm":"j\
s"}async function vr(r,e){let t;if(r.fn?t=new Function(`return (${r.fn});`)():r.module&&(t=(await Cr(r.module))[r.exportName||
"default"]),typeof t!="function")throw new Error("Handler not found for task");return t(r.data,e)}async function Fr(r,e={}){
const t=xr(r);switch(t){case"js":return vr(r,e);case"wasm":return Ir(r);case"wasm-webgpu":return Tr(r);default:throw new Error(
`Unsupported compute runtime: ${t}`)}}const Br="peercompute.compute.solver-descriptor.v0",Lr="peercompute.compute.solver\
-task.v0";function Be(r,e){const t=String(r||"").trim();if(!t)throw new Error(`${e} is required`);return t}function ge(r){
return r==null?r:JSON.parse(JSON.stringify(r))}function Wr(r){if(typeof r=="string")return{name:Be(r,"field.name"),unit:null,
dimensions:null,location:null};if(!r||typeof r!="object")throw new Error("field must be a string or object");return{name:Be(
r.name,"field.name"),unit:r.unit??null,dimensions:r.dimensions??null,location:r.location??null,role:r.role??null}}function Ke(r=[]){
if(!Array.isArray(r))throw new Error("fields must be an array");return r.map(Wr)}function Dr(r){return r.runtime?String(
r.runtime).trim().toLowerCase():r.wasm?r.hostModule||r.module?"wasm-webgpu":"wasm":"js"}function Or(r={}){var n,o,i,l,c,
u,m;if(!r||typeof r!="object")throw new Error("solver descriptor is required");const e=Be(r.id,"solver.id"),t=Be(r.kind||
r.family,"solver.kind"),a=Dr(r),s=!!(r.module||r.fn||r.wasm||r.wasmSource||r.source);return{schema:Br,id:e,kind:t,version:r.
version||"0.0.0",label:r.label||e,description:r.description||"",runtime:a,module:r.module,exportName:r.exportName||"defa\
ult",fn:r.fn,hostModule:r.hostModule,hostExport:r.hostExport,wasm:r.wasm,wasmSource:r.wasmSource,source:r.source,webgpu:r.
webgpu||null,inputFields:Ke(r.inputFields||r.inputs||[]),outputFields:Ke(r.outputFields||r.outputs||[]),conservedFields:Ke(
r.conservedFields||r.conserved||[]),timestep:{mode:((n=r.timestep)==null?void 0:n.mode)||r.timestepMode||"explicit",maxDt:((o=
r.timestep)==null?void 0:o.maxDt)??r.maxDt??null,subcycles:((i=r.timestep)==null?void 0:i.subcycles)??r.subcycles??1},validity:ge(
r.validity||r.validityDomain||{}),affinity:{policy:((l=r.affinity)==null?void 0:l.policy)||r.affinityPolicy||"state-key",
keyFields:Array.isArray((c=r.affinity)==null?void 0:c.keyFields)?[...r.affinity.keyFields]:["solverId","stateKey"]},warmDelta:{
scope:((u=r.warmDelta)==null?void 0:u.scope)||r.scope||"solver-deltas",schema:((m=r.warmDelta)==null?void 0:m.schema)||`\
peercompute.solver.${e}.delta.v0`},metadata:ge(r.metadata||{}),hasExecutor:s}}class Nr{constructor(e=[]){this.solvers=new Map;
for(const t of e)this.register(t)}register(e){const t=Or(e);return this.solvers.set(t.id,t),t}unregister(e){return this.
solvers.delete(e)}has(e){return this.solvers.has(e)}get(e){const t=this.solvers.get(e);if(!t)throw new Error(`Solver not\
 registered: ${e}`);return t}list(){return Array.from(this.solvers.values()).map(e=>ge(e))}createTask(e,{id:t,input:a={},
stateKey:s=a.stateKey||a.taskId||e,affinityKey:n,scope:o,version:i,timestamp:l,data:c={},placementHint:u,webgpu:m}={}){const d=this.
get(e);if(!d.hasExecutor)throw new Error(`Solver has no executable task target: ${e}`);const h=t||`${d.id}:${s}:${Date.now()}`,
f=o||d.warmDelta.scope,y=u??c.placementHint??null;return{id:h,solverId:d.id,taskFamily:d.id,runtime:d.runtime,module:d.module,
exportName:d.exportName,fn:d.fn,hostModule:d.hostModule,hostExport:d.hostExport,wasm:d.wasm,wasmSource:d.wasmSource,source:d.
source,webgpu:m||d.webgpu||void 0,affinityKey:n||`${d.id}:${s}`,placementHint:ge(y),data:{schema:Lr,solver:{id:d.id,kind:d.
kind,version:d.version,inputFields:d.inputFields,outputFields:d.outputFields,conservedFields:d.conservedFields,timestep:d.
timestep,validity:d.validity,warmDelta:{scope:f,schema:d.warmDelta.schema}},stateKey:s,scope:f,version:i??null,timestamp:l??
Date.now(),input:a,...c,placementHint:ge(y)}}}}const Gr="peercompute.compute.gpu-resident-lane-manager.v0",qr="peercompu\
te.compute.gpu-resident-lane.v0",Ur="peercompute.compute.gpu-resident-lane-lease.v0",Kr="peercompute.compute.gpu-residen\
t-lane-lease-identity.v0",jr="peercompute.compute.gpu-resident-lane-execution.v0",jt="peercompute.compute.gpu-resident-l\
ane-copy-budget.v0",Hr="peercompute.compute.gpu-fence-report.v0",zr="peercompute.compute.gpu-resident-lane-stage-plan.v0",
Vr="peercompute.compute.gpu-resident-lane-stage-execution.v0",$r="peercompute.compute.gpu-resident-lane-stage-placement-\
preflight.v0",nt="queue.onSubmittedWorkDone-before-readback-map",Ht="explicit-stage-dependencies",St="sequential-stage-o\
rder",Jr="defer-read-write-conflicting-ready-stages";function Pe(r,e=0){const t=Number(r);return Number.isFinite(t)?t:e}
function W(r,e=null){return String(r??"").trim()||e}function K(r,e=[]){return Array.isArray(r)?r.map(t=>W(t)).filter(Boolean):
typeof r=="string"?r.split(",").map(t=>W(t)).filter(Boolean):[...e]}function G(r){return r==null?r:JSON.parse(JSON.stringify(
r))}function bt(r={}){const e=(r==null?void 0:r.residentSequenceLaneContract)||(r==null?void 0:r.residentLaneContract)||
(r==null?void 0:r.laneContract)||(r==null?void 0:r.executionContract)||null;return!e||typeof e!="object"?null:G(e)}function Qr(r={},e=0){
const t=W(r.id,`stage:${e}`);return{...G(r),id:t,index:e,lawNodeId:W(r.lawNodeId,null),runtimeTarget:W(r.runtimeTarget,null),
dependsOn:K(r.dependsOn??r.dependencies),inputFrom:W(r.inputFrom??r.primaryInputFrom??r.inputStageId,null),reads:K(r.reads??
r.readFamilies),writes:K(r.writes??r.writeFamilies)}}function Ie(r=null,{laneId:e=null,stateKey:t=null,domainKey:a=null,
queueFencePolicy:s=null}={}){if(!r||typeof r!="object")return null;const n=Array.isArray(r.passDagStages)?r.passDagStages.
map((i,l)=>Qr(i,l)):[],o=W(r.stageDependencyMode??r.dependencyMode,n.some(i=>i.dependsOn.length>0)||r.parallelStageExecution===
!0?"explicit-stage-dependencies":"sequential-stage-order");return{schema:zr,status:n.length>0?r.sequenceRunnable===!0?"c\
ontract-stage-plan-ready":"contract-stage-plan-review-only":"contract-stage-plan-empty",authority:"compute-manager-gpu-r\
esident-lane-manager",laneId:W(r.laneId,e),stateKey:W(r.stateKey,t),domainKey:W(r.domainKey,a),queueFencePolicy:W(r.queueFencePolicy,
s||nt),contractSchema:W(r.schema,null),contractStatus:W(r.status,null),sequenceMode:W(r.sequenceMode,null),sequenceRunnable:r.
sequenceRunnable===!0,defaultEnabled:r.defaultEnabled===!0,dependencyMode:o,parallelStageExecution:o==="explicit-stage-d\
ependencies",stageCount:n.length,stages:n}}function Yr(r={}){var t;const e=r&&typeof r=="object"?r:{value:r};return{value:Object.
prototype.hasOwnProperty.call(e,"value")?e.value:r,retainedBufferRefs:K(e.retainedBufferRefs??((t=e.gpuFence)==null?void 0:
t.retainedBufferRefs)),gpuFence:e.gpuFence&&typeof e.gpuFence=="object"?G(e.gpuFence):null,summary:e.summary&&typeof e.summary==
"object"?G(e.summary):null}}function Le(r={}){const e=r.copyBudget&&typeof r.copyBudget=="object"?r.copyBudget:r;return{
schema:jt,uploadBytes:Math.max(0,Math.round(Pe(e.uploadBytes??e.expectedUploadBytes,0))),readbackBytes:Math.max(0,Math.round(
Pe(e.readbackBytes??e.expectedReadbackBytes,0))),retainedBytes:Math.max(0,Math.round(Pe(e.retainedBytes??e.expectedRetainedBytes,
0))),compactSummaryBytes:Math.max(0,Math.round(Pe(e.compactSummaryBytes??e.summaryBytes,0))),fullReadbackReason:W(e.fullReadbackReason??
e.readbackReason,null)}}function Xr(r={},e={}){const t=Le(r),a=Le(e);return{schema:jt,uploadBytes:t.uploadBytes+a.uploadBytes,
readbackBytes:t.readbackBytes+a.readbackBytes,retainedBytes:Math.max(t.retainedBytes,a.retainedBytes),compactSummaryBytes:t.
compactSummaryBytes+a.compactSummaryBytes,fullReadbackReason:a.fullReadbackReason||t.fullReadbackReason||null}}function Zr(r={}){
return r.parallelStageExecution===!0||r.dependencyMode===Ht||(r.stages||[]).some(e=>(e.dependsOn||[]).length>0)}function ea(r,{
baseInput:e=null,currentValue:t=null,stageValues:a={}}={}){if(r.inputFrom&&Object.prototype.hasOwnProperty.call(a,r.inputFrom))
return a[r.inputFrom];const s=K(r.dependsOn);return s.length===1&&Object.prototype.hasOwnProperty.call(a,s[0])?a[s[0]]:s.
length>1?{source:"gpu-resident-lane-stage-dependencies",dependencyResults:Object.fromEntries(s.map(n=>[n,a[n]])),previousValue:t,
baseInput:e}:t}function je(r=[],e=[]){const t=new Set(K(e));return K(r).filter(a=>t.has(a))}function ta(r={},e={}){const t=je(
r.writes,e.writes);if(t.length>0)return{conflictType:"write-write",families:t};const a=je(r.writes,e.reads);if(a.length>
0)return{conflictType:"write-read",families:a};const s=je(r.reads,e.writes);return s.length>0?{conflictType:"read-write",
families:s}:null}function ra(r=[]){const e=[],t=[];for(const a of r){const s=e.map(n=>({stage:n,conflict:ta(n,a)})).find(
n=>n.conflict);s?t.push({stageId:a.id,blockedByStageId:s.stage.id,conflictType:s.conflict.conflictType,families:s.conflict.
families}):e.push(a)}return{batch:e,deferred:t}}function aa(r={}){const e=new Set((r.stages||[]).map(t=>t.id));for(const t of r.
stages||[])for(const a of t.dependsOn||[])if(!e.has(a)){const s=new Error(`GPU resident lane stage ${t.id} depends on un\
known stage ${a}`);throw s.code="ERR_GPU_RESIDENT_LANE_STAGE_DEPENDENCY_MISSING",s.stage=G(t),s}}function Mt(r={}){aa(r);
const e=Zr(r),t=[],a=[];if(e){const s=new Map((r.stages||[]).map(o=>[o.id,o])),n=new Set;for(;s.size>0;){const o=(r.stages||
[]).filter(u=>s.has(u.id)).filter(u=>(u.dependsOn||[]).every(m=>n.has(m)));if(!o.length){const u=new Error(`GPU resident\
 lane stage plan has a cycle or unsatisfied dependencies: ${Array.from(s.keys()).join(", ")}`);throw u.code="ERR_GPU_RES\
IDENT_LANE_STAGE_DEPENDENCY_CYCLE",u}const{batch:i,deferred:l}=ra(o),c=t.length;a.push(...l.map(u=>({...u,batchIndex:c}))),
t.push(i.map(u=>u.id));for(const u of i)s.delete(u.id),n.add(u.id)}}else for(const s of r.stages||[])t.push([s.id]);return{
dependencyMode:e?Ht:St,parallelStageExecution:e,stateFamilyConflictPolicy:e?Jr:St,stateFamilyConflictDeferrals:a,stateFamilyConflictDeferralCount:a.
length,executionBatches:t,maxConcurrentStageCount:t.reduce((s,n)=>Math.max(s,n.length),0)}}function sa(r={},{batchIndex:e=-1,
executorSource:t=null,gpuHubExecutorDescriptor:a=null}={}){const s=G(a==null?void 0:a.workerPolicy),n=W(s==null?void 0:s.
mode,null),o=(s==null?void 0:s.status)==="worker-ready",i=n==="dedicated-worker";let l="missing-stage-executor";return t===
"stage-plan-executor"?l="stage-plan-executor":t==="provided-stage-executor"?l="provided-stage-executor":t==="gpu-hub-res\
ident-stage-executor"&&(o?l="gpu-hub-worker-resident-stage":i?l="gpu-hub-inline-fallback-for-worker-stage":l="gpu-hub-in\
line-resident-stage"),{stageId:r.id,lawNodeId:r.lawNodeId,runtimeTarget:r.runtimeTarget,batchIndex:e,dependsOn:K(r.dependsOn),
inputFrom:W(r.inputFrom,null),reads:K(r.reads),writes:K(r.writes),executorSource:t,placementTarget:l,gpuHubExecutorDescriptor:G(
a),workerPolicy:s,workerResidencyStatus:(s==null?void 0:s.status)||null,workerRequested:i,workerReady:o,sameDeviceRequired:(s==
null?void 0:s.sameDeviceRequired)===!0,bufferTransferPolicy:(s==null?void 0:s.bufferTransferPolicy)||null}}function na(r){
return["gpu-fence-completed","queue-work-completed","readback-map-completed","ordered-before-consumer-queue-completed"].
includes(String(r||""))}class oa{constructor({gpuHub:e=null,deviceId:t="gpu-hub",now:a=()=>Date.now()}={}){this.gpuHub=e,
this.deviceId=t,this.now=a,this.lanes=new Map,this.leases=new Map,this.nextLeaseOrdinal=1,this.stats={schema:Gr,laneCount:0,
activeLeaseCount:0,completedLeaseCount:0,rejectedLeaseCount:0,totalUploadBytes:0,totalReadbackBytes:0,totalCompactSummaryBytes:0,
maxRetainedBytes:0,lastFence:null}}resolveLaneId({laneId:e,stateKey:t,domainKey:a,solverId:s}={}){return W(e,`gpu-lane:${W(
t||a||s,"default")}`)}getOrCreateLane(e={}){const t=this.resolveLaneId(e),a=W(e.stateKey,null),s=W(e.sourceFamily,null),
n=this.lanes.get(t);if(n){if(a&&n.stateKey&&n.stateKey!==a)throw new Error(`GPU resident lane ${t} already owns stateKey\
 ${n.stateKey}, not ${a}`);if(a&&!n.stateKey&&(n.stateKey=a),s&&n.sourceFamily&&n.sourceFamily!==s)throw new Error(`GPU \
resident lane ${t} already owns sourceFamily ${n.sourceFamily}, not ${s}`);return s&&!n.sourceFamily&&(n.sourceFamily=s),
e.domainKey&&!n.domainKey&&(n.domainKey=W(e.domainKey,null)),e.solverId&&!n.solverId&&(n.solverId=W(e.solverId,null)),n}
const o={schema:qr,laneId:t,stateKey:a,sourceFamily:s,domainKey:W(e.domainKey,null),solverId:W(e.solverId,null),deviceId:W(
e.deviceId,this.deviceId),queueFencePolicy:W(e.queueFencePolicy,nt),status:"ready",activeLeases:new Map,retainedBufferRefs:new Set(
K(e.retainedBufferRefs)),copyBudget:Le(e.copyBudget||{}),residentSequenceLaneContract:bt(e),stagePlan:null,createdAt:this.
now(),updatedAt:this.now(),lastFence:null};return o.stagePlan=Ie(o.residentSequenceLaneContract,o),this.lanes.set(t,o),this.
stats.laneCount=this.lanes.size,o}acquireLease(e={}){const t=this.getOrCreateLane(e),a=W(e.leaseId,`${t.laneId}:lease:${this.
nextLeaseOrdinal++}`);if(this.leases.has(a))throw new Error(`GPU resident lane lease already exists: ${a}`);const s=Le(e.
copyBudget||{}),n=bt(e)||G(t.residentSequenceLaneContract),o=Ie(n,{laneId:t.laneId,stateKey:t.stateKey,domainKey:t.domainKey,
queueFencePolicy:t.queueFencePolicy});n&&(t.residentSequenceLaneContract=G(n),t.stagePlan=G(o));const i={schema:Ur,leaseId:a,
laneId:t.laneId,stateKey:t.stateKey,sourceFamily:W(e.sourceFamily,t.sourceFamily),domainKey:t.domainKey,solverId:W(e.solverId,
t.solverId),taskId:W(e.taskId,null),owner:W(e.owner,"compute-manager"),readFamilies:K(e.readFamilies),writeFamilies:K(e.
writeFamilies),retainedBufferRefs:K(e.retainedBufferRefs),copyBudget:s,queueFencePolicy:t.queueFencePolicy,residentSequenceLaneContract:n,
stagePlan:o,stageExecution:null,status:"active",acquiredAt:this.now(),releasedAt:null,releaseReason:null,gpuFence:null};
this.leases.set(a,i),t.activeLeases.set(a,i),t.copyBudget=Xr(t.copyBudget,s);for(const l of i.retainedBufferRefs)t.retainedBufferRefs.
add(l);return t.updatedAt=this.now(),this.stats.activeLeaseCount=this.leases.size,this.stats.totalUploadBytes+=s.uploadBytes,
this.stats.totalReadbackBytes+=s.readbackBytes,this.stats.totalCompactSummaryBytes+=s.compactSummaryBytes,this.stats.maxRetainedBytes=
Math.max(this.stats.maxRetainedBytes,s.retainedBytes),G(i)}createFenceReport(e,{status:t="queue-work-completed",method:a="\
queue.onSubmittedWorkDone",queueCompletionStatus:s=t,queueCompletionMethod:n=a,readbackCompletionStatus:o=null,readbackCompletionMethod:i=null,
retainedBufferRefs:l=null,completed:c=null,source:u="gpu-resident-lane-manager"}={}){const m=typeof e=="string"?this.leases.
get(e):e;if(!m)throw new Error(`Unknown GPU resident lane lease: ${e}`);const d=this.lanes.get(m.laneId),h=c==null?na(t):
c===!0;return{schema:Hr,status:t,method:a,fenceSatisfied:h,required:!0,laneId:m.laneId,stateKey:m.stateKey,queueFencePolicy:m.
queueFencePolicy||(d==null?void 0:d.queueFencePolicy)||nt,queueCompletionStatus:s,queueCompletionMethod:n,readbackCompletionStatus:o,
readbackCompletionMethod:i,retainedBufferRefs:K(l,m.retainedBufferRefs),workerId:null,deviceId:(d==null?void 0:d.deviceId)||
this.deviceId,completedAt:h?this.now():null,source:u}}completeLease(e,t={}){const a=this.leases.get(e);if(!a)throw new Error(
`Unknown GPU resident lane lease: ${e}`);const s=this.lanes.get(a.laneId),n=this.createFenceReport(a,t);if(a.status=n.fenceSatisfied?
"completed":"completed-unsatisfied-fence",a.gpuFence=n,a.releasedAt=this.now(),a.releaseReason=t.releaseReason||a.status,
Array.isArray(t.retainedBufferRefs)&&(a.retainedBufferRefs=K(t.retainedBufferRefs)),s){s.activeLeases.delete(e),s.lastFence=
n,s.updatedAt=this.now();for(const o of a.retainedBufferRefs)s.retainedBufferRefs.add(o)}return this.leases.delete(e),this.
stats.activeLeaseCount=this.leases.size,this.stats.completedLeaseCount+=1,this.stats.lastFence=G(n),{schema:jr,lease:G(a),
gpuFence:n,lane:s?this.snapshotLane(s.laneId):null,residentSequenceLaneContract:G(a.residentSequenceLaneContract),stagePlan:G(
a.stagePlan),stageExecution:G(a.stageExecution)}}async executeStagePlan(e,{input:t=null,context:a={},executor:s=null,stageExecutors:n={},
allowMissingExecutors:o=!1}={}){const i=typeof e=="string"?this.leases.get(e):e;if(!i)throw new Error(`Unknown GPU resid\
ent lane lease: ${e}`);const l=this.lanes.get(i.laneId),c=i.stagePlan||Ie(i.residentSequenceLaneContract,{laneId:i.laneId,
stateKey:i.stateKey,domainKey:i.domainKey,queueFencePolicy:i.queueFencePolicy});if(!c||!Array.isArray(c.stages)||c.stages.
length===0){const w=new Error(`GPU resident lane lease ${i.leaseId} has no executable stage plan`);throw w.code="ERR_GPU\
_RESIDENT_LANE_STAGE_PLAN_MISSING",w}const u=this.now(),m=[],d={},h=Mt(c),f=new Map(c.stages.map(w=>[w.id,w]));let y=t;const p=async(w,g)=>{
var q;let R=typeof s=="function"?s:(n==null?void 0:n[w.id])||(n==null?void 0:n[w.lawNodeId]),b=typeof s=="function"?"sta\
ge-plan-executor":R?"provided-stage-executor":null;typeof R!="function"&&this.gpuHub&&typeof this.gpuHub.hasResidentStageExecutor==
"function"&&this.gpuHub.hasResidentStageExecutor(w)&&typeof this.gpuHub.executeResidentStage=="function"&&(R=C=>this.gpuHub.
executeResidentStage(C),b="gpu-hub-resident-stage-executor");const M=b==="gpu-hub-resident-stage-executor"&&typeof((q=this.
gpuHub)==null?void 0:q.describeResidentStageExecutor)=="function"?this.gpuHub.describeResidentStageExecutor(w):null;if(typeof R!=
"function"){if(!o){const C=new Error(`Missing GPU resident lane stage executor: ${w.id}`);throw C.code="ERR_GPU_RESIDENT\
_LANE_STAGE_EXECUTOR_MISSING",C.stage=G(w),C}return{result:{stageId:w.id,lawNodeId:w.lawNodeId,status:"blocked-missing-s\
tage-executor",retainedBufferRefs:[],workerResidency:null},value:g}}const L=this.now(),x=await R({stage:G(w),stageIndex:w.
index,input:g,lease:G(i),lane:l?this.snapshotLane(l.laneId):null,context:a}),T=Yr(x),O=K(T.retainedBufferRefs);if(O.length>
0&&(i.retainedBufferRefs=K([...i.retainedBufferRefs,...O]),l)){for(const C of O)l.retainedBufferRefs.add(C);l.updatedAt=
this.now()}return{result:{stageId:w.id,lawNodeId:w.lawNodeId,runtimeTarget:w.runtimeTarget,status:"completed",executorSource:b,
startedAt:L,completedAt:this.now(),retainedBufferRefs:O,gpuFence:T.gpuFence,workerResidency:G(M==null?void 0:M.workerPolicy),
summary:T.summary},value:T.value}};if(h.parallelStageExecution===!0)for(const w of h.executionBatches){const g=w.map(b=>f.
get(b)).filter(Boolean),R=await Promise.all(g.map(b=>p(b,ea(b,{baseInput:t,currentValue:y,stageValues:d}))));for(let b=0;b<
g.length;b+=1){const M=g[b],L=R[b];d[M.id]=L.value,y=L.value,m.push(L.result)}}else for(const w of h.executionBatches){const g=f.
get(w[0]),R=await p(g,y);y=R.value,d[g.id]=R.value,m.push(R.result)}const E=m.some(w=>w.status!=="completed"),_={schema:Vr,
status:E?"blocked":"completed",leaseId:i.leaseId,laneId:i.laneId,stateKey:i.stateKey,stagePlan:G(c),stageCount:c.stages.
length,completedStageCount:m.filter(w=>w.status==="completed").length,dependencyMode:h.dependencyMode,parallelStageExecution:h.
parallelStageExecution,stateFamilyConflictPolicy:h.stateFamilyConflictPolicy,stateFamilyConflictDeferrals:h.stateFamilyConflictDeferrals,
stateFamilyConflictDeferralCount:h.stateFamilyConflictDeferralCount,executionBatches:h.executionBatches,maxConcurrentStageCount:h.
maxConcurrentStageCount,stageResults:m,retainedBufferRefs:K(i.retainedBufferRefs),output:y,startedAt:u,completedAt:this.
now()};return i.stageExecution=G(_),l&&(l.updatedAt=this.now()),_}preflightStagePlacement(e,{executor:t=null,stageExecutors:a={},
allowMissingExecutors:s=!1}={}){const n=typeof e=="string"?this.leases.get(e):e;if(!n)throw new Error(`Unknown GPU resid\
ent lane lease: ${e}`);const o=this.lanes.get(n.laneId),i=n.stagePlan||Ie(n.residentSequenceLaneContract,{laneId:n.laneId,
stateKey:n.stateKey,domainKey:n.domainKey,queueFencePolicy:n.queueFencePolicy});if(!i||!Array.isArray(i.stages)||i.stages.
length===0){const p=new Error(`GPU resident lane lease ${n.leaseId} has no executable stage plan`);throw p.code="ERR_GPU\
_RESIDENT_LANE_STAGE_PLAN_MISSING",p}const l=Mt(i),c=new Map;l.executionBatches.forEach((p,k)=>{for(const E of p)c.set(E,
k)});const u=i.stages.map(p=>{let k=typeof t=="function"?t:(a==null?void 0:a[p.id])||(a==null?void 0:a[p.lawNodeId]),E=typeof t==
"function"?"stage-plan-executor":k?"provided-stage-executor":null,_=null;return typeof k!="function"&&this.gpuHub&&typeof this.
gpuHub.hasResidentStageExecutor=="function"&&this.gpuHub.hasResidentStageExecutor(p)&&typeof this.gpuHub.describeResidentStageExecutor==
"function"&&(_=this.gpuHub.describeResidentStageExecutor(p),E="gpu-hub-resident-stage-executor"),sa(p,{batchIndex:c.get(
p.id)??-1,executorSource:E,gpuHubExecutorDescriptor:_})}),m=u.filter(p=>!p.executorSource).map(p=>p.stageId),d=u.filter(
p=>p.workerRequested).map(p=>p.stageId),h=u.filter(p=>p.workerReady).map(p=>p.stageId),f=u.filter(p=>p.workerRequested&&
!p.workerReady).map(p=>p.stageId),y=s===!0||m.length===0;return{schema:$r,status:y?"placement-preflight-ready":"blocked-\
missing-stage-executors",authority:"compute-manager-gpu-resident-lane-manager",advisory:!0,leaseId:n.leaseId,laneId:n.laneId,
stateKey:n.stateKey,domainKey:n.domainKey,deviceId:(o==null?void 0:o.deviceId)||this.deviceId,stagePlan:G(i),stageCount:i.
stages.length,dependencyMode:l.dependencyMode,parallelStageExecution:l.parallelStageExecution,stateFamilyConflictPolicy:l.
stateFamilyConflictPolicy,stateFamilyConflictDeferrals:l.stateFamilyConflictDeferrals,stateFamilyConflictDeferralCount:l.
stateFamilyConflictDeferralCount,placementBatches:l.executionBatches,maxConcurrentStageCount:l.maxConcurrentStageCount,stagePlacements:u,
executorSources:Object.fromEntries(u.map(p=>[p.stageId,p.executorSource])),workerResidencyStatuses:Object.fromEntries(u.
map(p=>[p.stageId,p.workerResidencyStatus])),missingExecutorStageIds:m,missingExecutorCount:m.length,workerRequestedStageIds:d,
workerRequestedCount:d.length,workerReadyStageIds:h,workerReadyCount:h.length,workerFallbackStageIds:f,workerFallbackCount:f.
length,canExecute:y,createdAt:this.now()}}planStagePlacement(e,t={}){return this.preflightStagePlacement(e,t)}rejectLease(e,t="\
lane-validation-rejected"){const a=this.leases.get(e);if(!a)throw new Error(`Unknown GPU resident lane lease: ${e}`);const s=this.
lanes.get(a.laneId);return a.status="rejected",a.releasedAt=this.now(),a.releaseReason=t,s&&(s.activeLeases.delete(e),s.
updatedAt=this.now()),this.leases.delete(e),this.stats.activeLeaseCount=this.leases.size,this.stats.rejectedLeaseCount+=
1,G(a)}snapshotLane(e){const t=this.lanes.get(e);return t?{schema:t.schema,laneId:t.laneId,stateKey:t.stateKey,domainKey:t.
domainKey,solverId:t.solverId,deviceId:t.deviceId,queueFencePolicy:t.queueFencePolicy,status:t.status,activeLeaseCount:t.
activeLeases.size,retainedBufferRefs:[...t.retainedBufferRefs].sort(),copyBudget:G(t.copyBudget),residentSequenceLaneContract:G(
t.residentSequenceLaneContract),stagePlan:G(t.stagePlan),createdAt:t.createdAt,updatedAt:t.updatedAt,lastFence:G(t.lastFence)}:
null}listLanes(){return[...this.lanes.keys()].sort().map(e=>this.snapshotLane(e))}getStats(){return{...G(this.stats),laneCount:this.
lanes.size,activeLeaseCount:this.leases.size,lanes:this.listLanes()}}}const ot="peercompute.capabilities.benchmark-task.\
v1",we=8*1024*1024,ia=256*1024,la=64*1024;function ca(){const r=globalThis.GPUBufferUsage;return{MAP_READ:(r==null?void 0:
r.MAP_READ)??1,COPY_SRC:(r==null?void 0:r.COPY_SRC)??4,COPY_DST:(r==null?void 0:r.COPY_DST)??8,STORAGE:(r==null?void 0:r.
STORAGE)??128,QUERY_RESOLVE:(r==null?void 0:r.QUERY_RESOLVE)??512}}function ua(){var r;return((r=globalThis.GPUMapMode)==
null?void 0:r.READ)??1}let He=null;function Y(){return typeof performance<"u"&&typeof performance.now=="function"?performance.
now():Date.now()}function zt(r){const e=[];let t=r>>>0;do{let a=t&127;t>>>=7,t!==0&&(a|=128),e.push(a)}while(t!==0);return e}
function ze(r){const e=new ArrayBuffer(4);return new DataView(e).setFloat32(0,r,!0),Array.from(new Uint8Array(e))}function Te(r,e){
return[r,...zt(e.length),...e]}function Vt(){const r=Te(1,[1,96,1,127,1,125]),e=Te(3,[1,0]),t=Array.from(new TextEncoder().
encode("bench")),a=Te(7,[1,t.length,...t,0,0]),s=i=>[32,2,32,3,148,67,...ze(i),146,33,2],n=[2,1,127,2,125,67,...ze(1),33,
2,67,...ze(1.000001),33,3,2,64,3,64,32,1,32,0,78,13,1,...s(125e-6),...s(-124e-6),...s(123e-6),...s(-122e-6),32,1,65,1,106,
33,1,12,0,11,11,32,2,11],o=Te(10,[1,...zt(n.length),...n]);return new Uint8Array([0,97,115,109,1,0,0,0,...r,...e,...a,...o])}
function At(r,e){const t=r.length;let a=1;for(let s=0;s<e;s+=1)for(let n=0;n<t;n+=4){const o=r[n],i=r[n+1],l=r[n+2],c=r[n+
3],u=o*1.0001+i*.9997,m=l*1.0003-c*.9999,d=Math.sqrt(u*u+m*m+1e-6);r[n]=u/d,r[n+1]=m/d,a+=d*1e-5}return a}function it({workSize:r=16384,
targetMs:e=20,maxMs:t=150,signal:a=null}={}){a==null||a.throwIfAborted();const s=Math.max(1024,Math.min(262144,Math.floor(
r/4)*4)),n=new Float32Array(s);for(let f=0;f<s;f+=1)n[f]=(f%97+1)*.013;At(n,2),a==null||a.throwIfAborted();const o=s/4*12;
let i=0,l=0;const c=Y();let u=4;for(;;){a==null||a.throwIfAborted(),l+=At(n,u),i+=u;const f=Y()-c;if(f>=e||f>=t)break;f<
e*.25&&(u=Math.min(64,u*2))}const m=Math.max(.05,Y()-c),d=i*o,h=Number((d/(m/1e3)/1e6).toFixed(2));return{ok:!0,ops:d,passes:i,
durationMs:Number(m.toFixed(3)),mopsPerSec:h,checksum:Number(l.toFixed(6))}}async function $t({targetMs:r=20,maxMs:e=150,
signal:t=null}={}){t==null||t.throwIfAborted();const a=yr(globalThis);if(!a.supported)return{ok:!1,supported:!1,simdSupported:!1,
reason:"WebAssembly unavailable"};try{He||(He=await WebAssembly.compile(Vt())),t==null||t.throwIfAborted();const n=(await WebAssembly.
instantiate(He,{})).exports.bench;n(5e4),t==null||t.throwIfAborted();const o=8;let i=0,l=25e4,c=0;const u=Y();for(;;){t==
null||t.throwIfAborted(),c+=n(l),i+=l;const f=Y()-u;if(f>=r||f>=e)break;f<r*.25&&(l=Math.min(4e6,l*2))}const m=Math.max(
.05,Y()-u),d=i*o,h=Number((d/(m/1e3)/1e6).toFixed(2));return{ok:!0,supported:!0,simdSupported:a.simd,ops:d,iterations:i,
durationMs:Number(m.toFixed(3)),mopsPerSec:h,checksum:Number(c.toFixed(6))}}catch(s){return{ok:!1,supported:a.supported,
simdSupported:a.simd,reason:String((s==null?void 0:s.message)??s).slice(0,200)}}}function da(r){if(!r.length)return 0;const e=[
...r].sort((a,s)=>a-s),t=Math.floor(e.length/2);return e.length%2===0?(e[t-1]+e[t])/2:e[t]}async function _t(r,e,t){const a=r.
createShaderModule({label:t,code:e});if(typeof a.getCompilationInfo=="function"){const n=(await a.getCompilationInfo()).
messages.filter(o=>o.type==="error");if(n.length>0)throw new Error(`WGSL compilation failed (${t}): ${n.map(o=>o.message).
join("; ")}`)}return a}async function Jt({scope:r=globalThis,allowFallback:e=!1,bufferBytes:t=we,computeThreads:a=65536,
computePasses:s=4,bandwidthPasses:n=4,readbackPasses:o=3,timeoutMs:i=5e3,signal:l=null}={}){var h,f,y;l==null||l.throwIfAborted();
let c=null;const u=[];let m=!1;const d=p=>(p&&u.push(p),p);try{c=await Dt({scope:r,allowFallback:e,optionalFeatures:["ti\
mestamp-query","shader-f16"],promoteLimits:!0,timeoutMs:i,label:"peercompute-capability-benchmark"}),l==null||l.throwIfAborted();
const{device:p,hasTimestampQuery:k,hasShaderF16:E,limits:_,adapterInfo:w,isFallbackAdapter:g}=c;typeof p.pushErrorScope==
"function"&&(p.pushErrorScope("validation"),m=!0);const R=k&&typeof p.createQuerySet=="function",b=Math.min(_.maxBufferSize||
we,_.maxStorageBufferBindingSize||we),M=64,L=_.maxComputeWorkgroupsPerDimension||65535,x=Math.min(Math.max(M,Math.floor(
a/M)*M),L*M,Math.floor(b/16)),T=Math.max(1,Math.floor(x/M)),O=x*16,q=await _t(p,`
      @group(0) @binding(0) var<storage, read_write> outBuf: array<vec4<f32>>;
      @compute @workgroup_size(${M})
      fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
        let idx = gid.x;
        if (idx >= arrayLength(&outBuf)) { return; }
        var a = vec4<f32>(0.901, 0.899, 0.902, 0.898) + vec4<f32>(f32(idx & 255u) * 0.0001);
        var b = vec4<f32>(0.9993, 1.0007, 0.9991, 1.0009);
        var c = vec4<f32>(0.9505, 0.9496, 0.9503, 0.9498);
        var d = vec4<f32>(1.0002, 0.9998, 1.0004, 0.9996);
        let k = vec4<f32>(0.7501, 0.7499, 0.7502, 0.7498);
        let bias = vec4<f32>(0.125, 0.126, 0.124, 0.1255);
        for (var i = 0u; i < 64u; i = i + 1u) {
          a = fma(a, k, fma(b, vec4<f32>(0.125), bias));
          b = fma(b, k, fma(c, vec4<f32>(0.125), bias));
          c = fma(c, k, fma(d, vec4<f32>(0.125), bias));
          d = fma(d, k, fma(a, vec4<f32>(0.125), bias));
        }
        outBuf[idx] = a + b + c + d;
      }
    `,"peercompute-bench-compute"),C=await p.createComputePipelineAsync({layout:"auto",compute:{module:q,entryPoint:"mai\
n"}}),v=ca(),j=ua(),V=d(p.createBuffer({size:O,usage:v.STORAGE|v.COPY_SRC})),re=p.createBindGroup({layout:C.getBindGroupLayout(
0),entries:[{binding:0,resource:{buffer:V}}]}),ae=Math.min(Math.max(ia,t),we,Math.floor(b/4)),ne=Math.max(256,Math.min(Math.
floor(ae/16),L*M)),ee=Math.floor(ne/M)*M,S=ee*16,I=Math.max(1,Math.floor(ee/M)),$=await _t(p,`
      @group(0) @binding(0) var<storage, read> srcBuf: array<vec4<f32>>;
      @group(0) @binding(1) var<storage, read_write> dstBuf: array<vec4<f32>>;
      @compute @workgroup_size(${M})
      fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
        let idx = gid.x;
        if (idx >= arrayLength(&srcBuf)) { return; }
        dstBuf[idx] = srcBuf[idx] * 1.0001 + vec4<f32>(0.25, 0.5, 0.75, 1.0);
      }
    `,"peercompute-bench-bandwidth"),H=await p.createComputePipelineAsync({layout:"auto",compute:{module:$,entryPoint:"m\
ain"}}),F=d(p.createBuffer({size:S,usage:v.STORAGE|v.COPY_DST})),se=d(p.createBuffer({size:S,usage:v.STORAGE|v.COPY_SRC})),
X=new Float32Array(1024);for(let N=0;N<X.length;N+=1)X[N]=(N+1)*.01;p.queue.writeBuffer(F,0,X);const de=p.createBindGroup(
{layout:H.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:F}},{binding:1,resource:{buffer:se}}]});let oe=null,
ie=null,le=null;R&&(oe=d(p.createQuerySet({type:"timestamp",count:4})),ie=d(p.createBuffer({size:32,usage:v.QUERY_RESOLVE|
v.COPY_SRC})),le=d(p.createBuffer({size:32,usage:v.COPY_DST|v.MAP_READ})));{const N=p.createCommandEncoder(),J=N.beginComputePass();
J.setPipeline(C),J.setBindGroup(0,re),J.dispatchWorkgroups(T),J.end();const U=N.beginComputePass();U.setPipeline(H),U.setBindGroup(
0,de),U.dispatchWorkgroups(I),U.end(),p.queue.submit([N.finish()]),await p.queue.onSubmittedWorkDone()}l==null||l.throwIfAborted();
const be=Math.max(1,Math.min(32,Math.floor(s))),yt=Math.max(1,Math.min(32,Math.floor(n)));let Me=0;const ar=Y();{const N=p.
createCommandEncoder(),J=R?{timestampWrites:{querySet:oe,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}:void 0,U=N.
beginComputePass(J);U.setPipeline(C),U.setBindGroup(0,re);for(let ce=0;ce<be;ce+=1)U.dispatchWorkgroups(T);U.end(),p.queue.
submit([N.finish()]),await p.queue.onSubmittedWorkDone()}const sr=Math.max(.05,Y()-ar);l==null||l.throwIfAborted();let Ae=0;
const nr=Y();{const N=p.createCommandEncoder(),J=R?{timestampWrites:{querySet:oe,beginningOfPassWriteIndex:2,endOfPassWriteIndex:3}}:
void 0,U=N.beginComputePass(J);U.setPipeline(H),U.setBindGroup(0,de);for(let ce=0;ce<yt;ce+=1)U.dispatchWorkgroups(I);U.
end(),R&&(N.resolveQuerySet(oe,0,4,ie,0),N.copyBufferToBuffer(ie,0,le,0,32)),p.queue.submit([N.finish()]),await p.queue.
onSubmittedWorkDone()}const or=Math.max(.05,Y()-nr);l==null||l.throwIfAborted();let Ne="queue-done";if(R)try{await le.mapAsync(
j);const N=new BigInt64Array(le.getMappedRange().slice(0));le.unmap();const J=Number(N[1]-N[0]),U=Number(N[3]-N[2]);Number.
isFinite(J)&&J>0&&Number.isFinite(U)&&U>0&&(Me=J/1e6,Ae=U/1e6,Ne="timestamp-query")}catch{}Ne!=="timestamp-query"&&(Me=sr,
Ae=or);const Ge=Math.min(la,O,S),_e=d(p.createBuffer({size:Ge,usage:v.COPY_DST|v.MAP_READ})),kt=[];let wt=!1;const ir=Math.
max(1,Math.min(8,Math.floor(o)));for(let N=0;N<ir;N+=1){l==null||l.throwIfAborted();const J=Y(),U=p.createCommandEncoder();
U.copyBufferToBuffer(N===0?V:se,0,_e,0,Ge),p.queue.submit([U.finish()]),await _e.mapAsync(j);const ce=new Float32Array(_e.
getMappedRange(0,16).slice(0));_e.unmap(),kt.push(Math.max(.01,Y()-J)),N===0&&(wt=ce.length===4&&ce.every(gt=>Number.isFinite(
gt)&&gt!==0))}if(m&&typeof p.popErrorScope=="function"){const N=await p.popErrorScope();if(m=!1,N)throw new Error(`WebGP\
U validation error during benchmark: ${N.message}`)}if(!wt)throw new Error("WebGPU benchmark readback returned invalid o\
r zero values");const lr=x*4096*be,cr=Number((lr/(Me/1e3*1e9)).toFixed(2)),ur=S*2*yt,dr=Number((ur/(Ae/1e3*1e9)).toFixed(
2)),mr=Number(da(kt).toFixed(3));return{ok:!0,status:g?"fallback":"hardware",timingMethod:Ne,adapter:w,isFallbackAdapter:g,
hasTimestampQuery:k,hasShaderF16:E,computeGflopsProxy:cr,memoryBandwidthGBps:dr,readbackLatencyMs:mr,computeMs:Number(Me.
toFixed(3)),bandwidthMs:Number(Ae.toFixed(3)),bandwidthBufferBytes:S,readbackBytes:Ge,verified:!0}}catch(p){return{ok:!1,
status:(p==null?void 0:p.code)==="ERR_GPU_FALLBACK_REJECTED"?"fallback-only":"unavailable",code:(p==null?void 0:p.code)||
"ERR_GPU_BENCHMARK_FAILED",reason:String((p==null?void 0:p.message)??p).slice(0,240)}}finally{m&&typeof((h=c==null?void 0:
c.device)==null?void 0:h.popErrorScope)=="function"&&await c.device.popErrorScope().catch(()=>{});for(const p of u)try{(f=
p==null?void 0:p.destroy)==null||f.call(p)}catch{}(y=c==null?void 0:c.destroy)==null||y.call(c)}}async function lt(r={},e={}){
var i,l,c,u;const t=(e==null?void 0:e.signal)??null,a=String((r==null?void 0:r.mode)||"all").trim().toLowerCase(),s=Y();
if(a==="cpu-shard"){const m=it({workSize:r.workSize,targetMs:r.targetMs??20,maxMs:r.maxMs??120,signal:t});return{schema:ot,
mode:a,workerId:(e==null?void 0:e.workerId)??null,cpu:m}}const n=Array.isArray(r==null?void 0:r.suites)?r.suites:a==="al\
l"?["cpu","wasm","gpu"]:[a],o={schema:ot,mode:a,workerId:(e==null?void 0:e.workerId)??null};return n.includes("cpu")&&((i=
e==null?void 0:e.emitProgress)==null||i.call(e,{stage:"cpu",fraction:.1}),o.cpu=it({workSize:r.cpuWorkSize,targetMs:r.cpuTargetMs??
20,maxMs:r.cpuMaxMs??120,signal:t})),n.includes("wasm")&&((l=e==null?void 0:e.emitProgress)==null||l.call(e,{stage:"wasm",
fraction:.4}),o.wasm=await $t({targetMs:r.wasmTargetMs??20,maxMs:r.wasmMaxMs??120,signal:t})),n.includes("gpu")&&((c=e==
null?void 0:e.emitProgress)==null||c.call(e,{stage:"gpu",fraction:.7}),o.gpu=await Jt({allowFallback:r.allowFallback===!0,
bufferBytes:r.gpuBufferBytes??we,computeThreads:r.gpuComputeThreads??65536,computePasses:r.gpuComputePasses??4,bandwidthPasses:r.
gpuBandwidthPasses??4,readbackPasses:r.gpuReadbackPasses??3,timeoutMs:r.gpuTimeoutMs??5e3,signal:t})),o.durationMs=Number(
Math.max(0,Y()-s).toFixed(3)),(u=e==null?void 0:e.emitProgress)==null||u.call(e,{stage:"complete",fraction:1}),o}const ma=Object.
freeze(Object.defineProperty({__proto__:null,CAPABILITY_BENCHMARK_TASK_SCHEMA:ot,buildWasmBenchmarkBytes:Vt,default:lt,runCapabilityBenchmarkTask:lt,
runCpuMicrobenchmark:it,runGpuMicrobenchmark:Jt,runWasmMicrobenchmark:$t},Symbol.toStringTag,{value:"Module"})),Qt="peer\
compute.capabilities.benchmark.v1",Yt=1,pa=120,ha=480,fa=300,ya=1500,ka=60,wa=10080*60*1e3,ga="peercompute:cap-bench:v1:";
function he(r,e,t){return Math.min(t,Math.max(e,r))}function te(r,e=3){return Number.isFinite(r)?Number(r.toFixed(e)):0}
function Ra(){try{if(typeof globalThis.localStorage<"u"&&globalThis.localStorage)return globalThis.localStorage}catch{}return null}
function Ea({storage:r=void 0,prefix:e=ga,ttlMs:t=wa,now:a=()=>Date.now()}={}){const s=r===void 0?Ra():r,n=new Map,o=i=>`${e}${i}`;
return{get(i){if(!i)return null;const l=o(i);let c=n.get(l)??null;if(!c&&s&&typeof s.getItem=="function")try{const u=s.getItem(
l);u&&(c=JSON.parse(u))}catch{c=null}return!c||typeof c!="object"||c.schema!==Qt||c.benchmarkVersion!==Yt||c.hardwareFingerprint!==
i?null:!Number.isFinite(c.measuredAt)||a()-c.measuredAt>t||c.measuredAt-a()>6e4?(this.delete(i),null):(n.set(l,c),structuredClone(
c))},set(i,l){if(!i||!l)return;const c=o(i),u=structuredClone(l);if(n.set(c,u),s&&typeof s.setItem=="function")try{s.setItem(
c,JSON.stringify(u))}catch{}},delete(i){if(!i)return;const l=o(i);if(n.delete(l),s&&typeof s.removeItem=="function")try{
s.removeItem(l)}catch{}},clear(){n.clear()}}}function Sa(r={},e={}){var R,b,M,L,x,T,O,q,C,v,j,V;const t=Number.isFinite(
(R=r.cpu)==null?void 0:R.mopsPerSec)?r.cpu.mopsPerSec:null,a=Number.isFinite((b=r.multiWorker)==null?void 0:b.totalMopsPerSec)?
r.multiWorker.totalMopsPerSec:t!=null?t*Math.max(1,Math.min(4,((M=e.cpu)==null?void 0:M.cores)??1))*.7:null,s=(L=r.wasm)!=
null&&L.ok&&Number.isFinite(r.wasm.mopsPerSec)?r.wasm.mopsPerSec:null,n=((x=r.gpu)==null?void 0:x.ok)===!0,o=n&&Number.isFinite(
r.gpu.computeGflopsProxy)?r.gpu.computeGflopsProxy:null,i=n&&Number.isFinite(r.gpu.memoryBandwidthGBps)?r.gpu.memoryBandwidthGBps:
null,l=t!=null?te(he(.4*(t/pa)+.6*((a??t)/ha),.05,16)):null,c=s!=null?te(he(s/fa,.05,16)):null,u=o!=null?te(he(o/ya,.02,
32)):null,m=i!=null?te(he(i/ka,.02,32)):null,d=u!=null&&m!=null?te(he(.45*u+.55*m,.02,32)):u??m;let h;d!=null&&l!=null?h=
te(.65*d+.35*l):h=te(d??l??c??.5);let f="mid";n&&((T=r.gpu)!=null&&T.isFallbackAdapter)||!n&&((O=e.webgpu)==null?void 0:
O.status)==="fallback-only"?f="software":n?d>=3&&(i==null||i>=180)?f="workstation":d>=1.35&&(i==null||i>=85)?f="high":d>=
.55?f="mid":f="low":l!=null&&(l>=2.5?f="workstation":l>=1.35?f="high":l>=.6?f="mid":f="low");const y=(C=(q=e.webgpu)==null?
void 0:q.limits)!=null&&C.maxBufferSize?Math.floor(e.webgpu.limits.maxBufferSize/(1024*1024)):null,p={software:{cpuBudgetMB:256,
gpuBudgetMB:64},low:{cpuBudgetMB:384,gpuBudgetMB:160},mid:{cpuBudgetMB:1024,gpuBudgetMB:512},high:{cpuBudgetMB:2048,gpuBudgetMB:1536},
workstation:{cpuBudgetMB:4096,gpuBudgetMB:3072}},k=p[f]||p.mid,E=((v=e.memory)==null?void 0:v.deviceMemoryGiB)!=null&&e.
memory.deviceMemoryGiB<=4?Math.min(k.cpuBudgetMB,Math.floor(e.memory.deviceMemoryGiB*1024*.25)):k.cpuBudgetMB,_=n?y!=null?
Math.min(k.gpuBudgetMB,Math.max(64,y)):k.gpuBudgetMB:0,w=((j=e.cpu)==null?void 0:j.cores)??4;let g=Math.max(1,Math.min(w,
8));return Number.isFinite((V=r.multiWorker)==null?void 0:V.scalingEfficiency)?r.multiWorker.scalingEfficiency<.45?g=Math.
max(1,Math.min(w,Math.ceil(r.multiWorker.workerCount*.5))):f==="workstation"?g=Math.min(16,Math.max(4,w)):(f==="low"||f===
"software")&&(g=Math.min(2,Math.max(1,Math.floor(w/2)))):f==="low"||f==="software"?g=Math.min(2,w):f==="workstation"&&(g=
Math.min(16,Math.max(4,w))),{scores:{cpuScore:l,wasmScore:c,gpuComputeScore:u,gpuBandwidthScore:m,gpuScore:d,overallScore:h},
performanceClass:f,recommendedWorkerCount:g,workingSetGuidance:{cpuBudgetMB:Math.max(128,E),gpuBudgetMB:Math.max(0,_),provenance:"\
benchmark-heuristic-not-measured-vram"}}}function Pt(r,e,t){if(!Number.isFinite(e)||e<=0)return r;let a;return Promise.race(
[r,new Promise((s,n)=>{a=setTimeout(()=>{const o=new Error("Capability benchmark timed out");o.code="ERR_CAPABILITY_BENC\
HMARK_TIMEOUT",t==null||t.abort(o),n(o)},e)})]).finally(()=>clearTimeout(a))}async function ba({capabilities:r=null,computeManager:e=null,
scope:t=globalThis,suites:a=["cpu","wasm","gpu"],cache:s=null,force:n=!1,allowFallback:o=!1,maxBenchmarkWorkers:i=4,timeoutMs:l=8e3,
signal:c=null,onProgress:u=null}={}){var k,E,_,w;c==null||c.throwIfAborted();const m=r||await Ot({scope:t,allowFallback:o}),
d=s===!1?null:s||Ea();if(!n&&d){const g=d.get(m.hardwareFingerprint);if(g)return{...g,fromCache:!0}}const h=new AbortController,
f=()=>h.abort(c.reason);c==null||c.addEventListener("abort",f,{once:!0});const y=async g=>e&&typeof e.submitTask=="funct\
ion"?e.submitTask({module:"peercompute:capability-benchmark",exportName:"runCapabilityBenchmarkTask",data:g,signal:h.signal,
onProgress:u}):lt(g,{signal:h.signal,emitProgress:u}),p=typeof performance<"u"?performance.now():Date.now();try{const g=await Pt(
y({mode:"all",suites:a,allowFallback:o}),l,h);let R=null;const b=((E=(k=e==null?void 0:e.getCapabilities)==null?void 0:k.
call(e))==null?void 0:E.workers)??0,M=Math.min(Math.max(0,Math.floor(i)),Math.max(0,((_=m.cpu)==null?void 0:_.cores)??1),
b);if(a.includes("cpu")&&M>=2&&((w=g==null?void 0:g.cpu)!=null&&w.ok)&&e){const q=typeof performance<"u"?performance.now():
Date.now(),C=await Pt(Promise.all(Array.from({length:M},()=>e.submitTask({module:"peercompute:capability-benchmark",exportName:"\
runCapabilityBenchmarkTask",data:{mode:"cpu-shard",targetMs:18,maxMs:90},signal:h.signal}))),Math.max(1e3,l-200),h),v=Math.
max(.1,(typeof performance<"u"?performance.now():Date.now())-q),j=C.reduce((ne,ee)=>{var S;return ne+(((S=ee==null?void 0:
ee.cpu)==null?void 0:S.ops)??0)},0),V=te(j/(v/1e3)/1e6,2),re=Math.max(.01,g.cpu.mopsPerSec),ae=te(V/re,3);R={ok:!0,workerCount:M,
wallMs:te(v,3),totalMopsPerSec:V,effectiveParallelSpeedup:ae,scalingEfficiency:te(he(ae/M,0,2),3)}}const L={cpu:(g==null?
void 0:g.cpu)??null,multiWorker:R,wasm:(g==null?void 0:g.wasm)??null,gpu:(g==null?void 0:g.gpu)??null},x=Sa(L,m),T=te(Math.
max(0,(typeof performance<"u"?performance.now():Date.now())-p),3),O={schema:Qt,benchmarkVersion:Yt,hardwareFingerprint:m.
hardwareFingerprint,measuredAt:Date.now(),durationMs:T,executedInWorker:!!(g!=null&&g.workerId),suites:[...a],metrics:L,
...x,fromCache:!1};return d==null||d.set(m.hardwareFingerprint,O),O}finally{c==null||c.removeEventListener("abort",f)}}function Ma(){
return new Worker(new URL(""+new URL("computeWorker-wMIB0MwB.js",import.meta.url).href,import.meta.url),{type:"module"})}
const It=128,Tt=5e3,Aa="peercompute.compute.worker-utilization.v0",Ct="peercompute.compute.task-placement.v0",_a="peerco\
mpute.compute.remote-placement-provenance.v0",Ve="peercompute.compute.remote-placement-verification.v0",xt="peercompute.\
compute.remote-placement-validation.v0",ye="peercompute.compute.remote-placement-retry.v0",vt="peercompute.compute.remot\
e-task-envelope.v0",Ft="peercompute.compute.task-packet.v0",Pa="peercompute.compute.task-execution.v0",Bt="peercompute.c\
ompute.task-graph-result.v0",Ia="peercompute.compute.task-graph-context.v0",Ta="peercompute.compute.task-graph-cache-pol\
icy.v0",Ca="peercompute.compute.task-graph-cache-inputs.v0",xa="peercompute.compute.task-graph-cache-artifact.v0",ct="pe\
ercompute.compute.task-graph-cache-admission.v0",Lt="peercompute.compute.remote-task-graph-cache-import.v0",va="peercomp\
ute.compute.remote-task-graph-state-seed-policy.v0",Fa="peercompute.compute.task-graph-placement-policy.v0",$e="peercomp\
ute.compute.task-graph-cancellation.v0",Xt="peercompute.compute.task-graph-gpu-resident-lane.v0",Ba="peercompute.compute\
.gpu-fence-report.v0",pe=["timeout","executor-error"],Ce=["rejected","verification-failed","validation-failed"],La=["max\
BufferSize","maxStorageBufferBindingSize","maxComputeWorkgroupStorageSize","maxComputeInvocationsPerWorkgroup","maxCompu\
teWorkgroupsPerDimension"];function A(r,e,t=0,a=Number.MAX_SAFE_INTEGER){const s=Math.floor(Number(r));return Number.isFinite(
s)?Math.min(a,Math.max(t,s)):e}function Q(r,e,t=0,a=Number.MAX_SAFE_INTEGER){const s=Number(r);return Number.isFinite(s)?
Math.min(a,Math.max(t,s)):e}function Wa({cpuCores:r,deviceMemoryGB:e,gpuAvailable:t,declaredTier:a}){return a?String(a):
r>=32||e>=64?"cluster":t&&(r>=12||e>=16)?"workstation":r<=4||e&&e<=4?"mobile":"laptop"}function ut(r){return r==="cluste\
r"?8192:r==="workstation"?2048:r==="mobile"?384:1024}function Zt(r){return r==="cluster"?4096:r==="workstation"?1024:r===
"mobile"?192:512}function Da({tier:r,deviceMemoryGB:e}){const t=ut(r);if(!e)return t;const a=e*1024*.25;return Math.max(
128,Math.min(t,a))}function er(r={}){if(!r)return null;const e=r.gpuLimits||r,t={};for(const a of La){const s=A(e[a],null,
0,Number.MAX_SAFE_INTEGER);s!=null&&(t[a]=s)}return Object.keys(t).length>0?t:null}function Je(r={},e={}){const t=typeof navigator<
"u"?navigator:null,a=A(r.cpuCores??r.hardwareConcurrency??(t==null?void 0:t.hardwareConcurrency),4,1,512),s=Q(r.deviceMemoryGB??
r.deviceMemory??(t==null?void 0:t.deviceMemory),null,0,2048),n=r.gpuAvailable??e.webgpu??!!(t!=null&&t.gpu),o=Wa({cpuCores:a,
deviceMemoryGB:s??0,gpuAvailable:n,declaredTier:r.tier||r.deviceClass}),i=Q(r.memoryBudgetMB??r.ramBudgetMB,Da({tier:o,deviceMemoryGB:s}),
0,1048576),l=Q(r.gpuMemoryBudgetMB??r.gpuBudgetMB??r.vramBudgetMB,n?Zt(o):0,0,1048576),c=Q(r.budgetScale??r.resourceBudgetScale??
r.computeScale,1,.05,64),u=er(r.gpuLimits||{maxBufferSize:r.gpuMaxBufferSize??r.maxBufferSize,maxStorageBufferBindingSize:r.
gpuMaxStorageBufferBindingSize??r.maxStorageBufferBindingSize,maxComputeWorkgroupStorageSize:r.gpuMaxComputeWorkgroupStorageSize??
r.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:r.gpuMaxComputeInvocationsPerWorkgroup??r.maxComputeInvocationsPerWorkgroup,
maxComputeWorkgroupsPerDimension:r.gpuMaxComputeWorkgroupsPerDimension??r.maxComputeWorkgroupsPerDimension});return{schema:"\
peercompute.compute.resource-profile.v0",tier:o,cpuCores:a,deviceMemoryGB:s,memoryBudgetMB:i,gpuMemoryBudgetMB:l,budgetScale:c,
gpuLimits:u,gpuLimitsSource:u?r.gpuLimitsSource||"configured":null,gpuAvailable:!!n,wasmAvailable:!!e.wasm,source:r.source||
(r.tier?"configured":"browser")}}function Oa(r){const e=r.cpuCores||4;return r.tier==="cluster"?Math.min(64,Math.max(8,e)):
r.tier==="workstation"?Math.min(16,Math.max(4,e)):r.tier==="mobile"?Math.min(2,Math.max(1,e)):Math.min(8,Math.max(2,Math.
floor(e*.75)))}function Qe(r={},e){const t=A(r.maxWorkers,null,1,It),a=Oa(e),s=t??Math.min(It,Math.max(a,e.cpuCores||a)),
n=A(r.minWorkers,Math.min(s,e.tier==="mobile"?1:2),0,s),o=A(r.targetWorkers??r.initialWorkers,Math.min(s,Math.max(n,a)),
n,s);return{schema:"peercompute.compute.worker-policy.v0",autoScale:r.autoScaleWorkers!==!1,minWorkers:n,targetWorkers:o,
maxWorkers:s,scaleUpQueueDepth:A(r.scaleUpQueueDepth,1,1,1024),idleScaleDownMs:A(r.idleScaleDownMs,5e3,0,6e5)}}function Na(r){
return r==="cluster"?4:r==="workstation"?2:r==="mobile"?.5:1}function Ga(r){return r==="cluster"?4:r==="workstation"?2:1}
function qa(r){return r==="cluster"?64:r==="workstation"?16:r==="mobile"?2:8}function xe(r,e=1){return Q(r,e,.25,8)}function Ua(r){
const e=String(r||"");return e==="manual"||e==="demo-api"||e.startsWith("manual-")||e.startsWith("user-")}function Ka(r,e){
const t=Math.max(1,e);return Math.max(t,Math.round(r/t)*t)}function Z(){return typeof performance<"u"&&typeof performance.
now=="function"?performance.now():Date.now()}function ja(r){const e=Math.max(0,Number(r)||0);return e<=0?Promise.resolve():
new Promise(t=>setTimeout(t,e))}function Ye(){return{submitted:0,completed:0,failed:0,averageDurationMs:0,lastDurationMs:0,
maxDurationMs:0,totalDurationMs:0}}function Ha(){return{submitted:0,attempted:0,completed:0,failed:0,retried:0,retryExhausted:0,
timedOut:0,rejected:0,verificationFailed:0,validationFailed:0}}function D(r,e=[]){return Array.isArray(r)?r.map(t=>String(
t||"").trim()).filter(Boolean):typeof r=="string"?r.split(",").map(t=>t.trim()).filter(Boolean):[...e]}function ve(...r){
const e=new Set,t=[];for(const a of r)for(const s of D(a,[]))e.has(s)||(e.add(s),t.push(s));return t}function P(...r){for(const e of r)
if(e!=null)return e;return null}function za(r={}){var l,c,u,m;const e=r.webgpu||((l=r.data)==null?void 0:l.webgpu)||{},t=r.
gpuFence||r.gpuFenceRequirement||e.gpuFence||e.fence||e.fenceRequirement||{},a=t.required===!0||t.fenceRequired===!0||e.
fenceRequired===!0||e.requiresFence===!0||e.requiresQueueFence===!0,s=P(t.laneId,t.gpuLaneId,e.laneId,e.gpuLaneId),n=P(t.
stateKey,t.gpuStateKey,e.stateKey,e.gpuStateKey,r.stateKey,(c=r.data)==null?void 0:c.stateKey,(m=(u=r.data)==null?void 0:
u.input)==null?void 0:m.stateKey),o=P(t.queueFencePolicy,t.fencePolicy,e.queueFencePolicy,e.fencePolicy),i=D(t.retainedBufferRefs??
e.retainedBufferRefs,[]);return!a&&!s&&!n&&!o&&i.length===0?null:{schema:"peercompute.compute.gpu-fence-requirement.v0",
required:a,laneId:s?String(s):null,stateKey:n?String(n):null,queueFencePolicy:o?String(o):null,retainedBufferRefs:i,source:t.
source||(e&&Object.keys(e).length>0?"task.webgpu":"task.gpuFence")}}function Va(r={},e=null){var y,p,k,E,_,w,g,R,b,M,L,x,
T,O;const t=r.webgpu||((y=r.data)==null?void 0:y.webgpu)||{},a=r.gpuResidentLane||r.gpuResidentLaneLease||r.residentLane||
t.gpuResidentLane||t.residentLane||{},s=P(a.residency,t.residency,r.residency,(p=r.data)==null?void 0:p.residency),n=a.enabled===
!0||a.required===!0||a.leaseRequired===!0||String(s||"").trim().toLowerCase()==="gpu-lane",o=P(a.laneId,a.gpuLaneId,t.laneId,
t.gpuLaneId,e==null?void 0:e.laneId),i=P(a.stateKey,a.gpuStateKey,t.stateKey,t.gpuStateKey,r.stateKey,(k=r.data)==null?void 0:
k.stateKey,(_=(E=r.data)==null?void 0:E.input)==null?void 0:_.stateKey,e==null?void 0:e.stateKey),l=P(a.domainKey,a.domain,
t.domainKey,r.domainKey,(w=r.data)==null?void 0:w.domainKey),c=P(a.sourceFamily,t.sourceFamily,(g=r.data)==null?void 0:g.
sourceFamily,(b=(R=r.data)==null?void 0:R.input)==null?void 0:b.sourceFamily),u=P(a.queueFencePolicy,a.fencePolicy,t.queueFencePolicy,
e==null?void 0:e.queueFencePolicy),m=D(a.retainedBufferRefs??t.retainedBufferRefs,(e==null?void 0:e.retainedBufferRefs)||
[]),d=a.copyBudget&&typeof a.copyBudget=="object"?JSON.parse(JSON.stringify(a.copyBudget)):t.copyBudget&&typeof t.copyBudget==
"object"?JSON.parse(JSON.stringify(t.copyBudget)):{},h=P(a.residentSequenceLaneContract,a.residentLaneContract,a.laneContract,
t.residentSequenceLaneContract,(M=r.data)==null?void 0:M.residentSequenceLaneContract,(x=(L=r.data)==null?void 0:L.input)==
null?void 0:x.residentSequenceLaneContract,(T=r.lawGraphNode)==null?void 0:T.residentSequenceLaneContract,null);return!n&&
!o&&!i&&m.length===0&&Object.keys(d).length===0?null:{schema:"peercompute.compute.gpu-resident-lane-task.v0",enabled:!0,
localExecution:String(P(a.localExecution,a.executionMode,t.localExecution,"inline")||"inline").trim().toLowerCase()==="w\
orker"?"worker":"inline",laneId:o?String(o):null,stateKey:i?String(i):null,sourceFamily:c?String(c):null,domainKey:l?String(
l):null,solverId:P(a.solverId,r.solverId,(O=r.data)==null?void 0:O.solverId)||null,owner:P(a.owner,r.owner,r.taskFamily,
r.solverId,"compute-manager-task"),readFamilies:D(a.readFamilies??a.reads??t.readFamilies),writeFamilies:D(a.writeFamilies??
a.writes??t.writeFamilies),retainedBufferRefs:m,queueFencePolicy:u?String(u):null,copyBudget:d,residentSequenceLaneContract:h&&
typeof h=="object"?B(h):null}}function B(r){if(r==null)return r;if(typeof structuredClone=="function")try{return structuredClone(
r)}catch{}return JSON.parse(JSON.stringify(r))}function $a(r={},e=[]){var E,_;const t=r.cacheInputs||((E=r.cachePolicy)==
null?void 0:E.inputs)||((_=r.cache)==null?void 0:_.inputs)||r.inputRefs||null,a=t&&typeof t=="object"?t:{},s=D(a.stateRefs??
a.states??r.stateRefs),n=D(a.closureRefs??a.closures??r.closureRefs),o=D(a.invalidationRefs??a.invalidates??r.invalidationRefs),
i=D(a.retainedBufferRefs??r.retainedBufferRefs),l=D(a.inputHashes??a.hashes??r.inputHashes),c=D(a.lawIds??a.laws??r.lawIds),
u=D(a.stateFamilies??r.stateFamilies),m=D(a.readFamilies??r.readFamilies),d=D(a.writeFamilies??r.writeFamilies),h=P(a.values,
a.value,a.parameters,r.cacheInputValues,null),f=e.map(w=>{var g,R,b,M;return{id:w.id,dependsOn:[...w.dependsOn],taskFamily:w.
taskFamily||((g=w.task)==null?void 0:g.taskFamily)||((R=w.task)==null?void 0:R.solverId)||null,solverId:w.solverId||((b=
w.task)==null?void 0:b.solverId)||null,cacheInput:P(w.cacheInput,w.cacheInputs,(M=w.task)==null?void 0:M.cacheInput,null)}});
if(!(t!=null||s.length>0||n.length>0||o.length>0||i.length>0||l.length>0||c.length>0||u.length>0||m.length>0||d.length>0||
h!=null||f.some(w=>w.cacheInput!=null||w.taskFamily||w.solverId)))return null;const p={graphFamily:String(P(a.graphFamily,
r.graphFamily,r.taskFamily,"task-graph")||"task-graph"),graphVersion:String(P(a.graphVersion,r.graphVersion,r.version,"v\
0")||"v0"),lawGraphId:P(a.lawGraphId,r.lawGraphId,null),stateRefs:s,closureRefs:n,invalidationRefs:o,retainedBufferRefs:i,
inputHashes:l,lawIds:c,stateFamilies:u,readFamilies:m,writeFamilies:d,scaleRegime:P(a.scaleRegime,r.scaleRegime,null),units:P(
a.units,r.units,null),values:h,nodes:f},k=Ee(Re(p));return{schema:Ca,status:"content-addressed-inputs-declared",inputHash:k,
stateRefs:s,closureRefs:n,invalidationRefs:o,retainedBufferRefs:i,inputHashes:l,lawIds:c,stateFamilies:u,readFamilies:m,
writeFamilies:d,nodeCount:e.length,source:t?"graph.cacheInputs":"graph-derived-input-refs"}}function Ja(r={},e=[]){const t=r.
cachePolicy||r.cache||{},a=String(P(r.cacheKey,t.cacheKey,t.key,"")||"").trim()||null,s=$a(r,e),n=String(P(t.scope,r.cacheScope,
"compute-manager-local")||"compute-manager-local"),o=s?`${n}:${s.inputHash}`:null,i=a||o,l=String(P(r.cacheMode,t.mode,i?
"read-through":"disabled")||"disabled").trim().toLowerCase(),c=t.enabled!==!1&&i!=null&&l!=="disabled"&&l!=="off";let u="\
disabled";return c&&(l==="record-only"||l==="write-only"?u="record-only":l==="read-only"?u="read-only":u="read-through"),
{schema:Ta,cacheKey:i,mode:u,readEnabled:u==="read-through"||u==="read-only",writeEnabled:u==="read-through"||u==="recor\
d-only",ttlMs:A(t.ttlMs??r.cacheTtlMs,0,0,Number.MAX_SAFE_INTEGER),scope:n,requireAdmitted:t.requireAdmitted!==!1&&r.cacheRequireAdmitted!==
!1,explicitCacheKey:a,derivedCacheKey:o,keySource:a?"explicit":o?"content-addressed-inputs":null,inputHash:(s==null?void 0:
s.inputHash)||null,inputs:s,status:c?"cache-policy-enabled":"cache-policy-disabled"}}function Qa(r={}){var t,a;const e=P(
r.stateSeedPayload,(t=r.cachePolicy)==null?void 0:t.stateSeedPayload,(a=r.cache)==null?void 0:a.stateSeedPayload,r.remoteStateSeedPayload,
null);return e==null?null:B(e)}function dt(r,e=new WeakSet){if(r==null)return r;if(typeof r=="function"||typeof r=="symb\
ol")return;if(typeof r!="object")return r;if(ArrayBuffer.isView(r))return new r.constructor(r);if(r instanceof ArrayBuffer)
return r.slice(0);if(e.has(r))return null;if(e.add(r),Array.isArray(r))return r.map(a=>dt(a,e)).filter(a=>a!==void 0);const t={};
for(const[a,s]of Object.entries(r)){const n=dt(s,e);n!==void 0&&(t[a]=n)}return t}function Ya(r={},e={},t={}){const a=e.
resultInputs||e.resultInputMap||(r&&typeof r=="object"?r.resultInputs:null);if(!a||typeof a!="object"||Array.isArray(a))
return r;const s=r.data&&typeof r.data=="object"&&!Array.isArray(r.data)?{...r.data}:{},n={};for(const[o,i]of Object.entries(
a)){const l=typeof i=="string"?i:String((i==null?void 0:i.nodeId)||(i==null?void 0:i.resultId)||(i==null?void 0:i.from)||
"").trim();if(!(!o||!l)){if(!Object.prototype.hasOwnProperty.call(t,l))throw new Error(`Task graph node ${e.id} requeste\
d unavailable result input ${o} from ${l}`);s[o]=dt(t[l]),n[o]=l}}return Object.keys(n).length===0?r:{...r,data:s,taskGraphResultInputs:n}}
function Xa(r={},e={}){var o,i,l;const t=r.cacheAdmission||((o=r.cachePolicy)==null?void 0:o.admission)||((i=r.cache)==null?
void 0:i.admission)||{},a=t.admitted===!0||t.accepted===!0||t.status==="admitted"||t.status==="admission-accepted",s=e.mode===
"record-only",n=t.status||(a?"admitted":s?"recorded-not-admitted":"pending-admission");return{schema:ct,status:n,admitted:a,
authority:String(P(t.authority,r.cacheAuthority,"compute-manager-local")||"compute-manager-local"),admissionId:P(t.admissionId,
t.id,null),validatorId:P(t.validatorId,t.validator,null),reason:String(P(t.reason,s?"record-only-cache-artifact-requires\
-state-manager-admission":"cache-artifact-admission-pending","")||""),invalidationRefs:D(t.invalidationRefs??((l=e.inputs)==
null?void 0:l.invalidationRefs)),acceptedAt:a?t.acceptedAt||Date.now():null}}function Za({graphId:r,cachePolicy:e,result:t,
storedAt:a,expiresAt:s,admission:n}={}){var i;const o=Ee(Re({schema:t==null?void 0:t.schema,graphId:t==null?void 0:t.graphId,
status:t==null?void 0:t.status,nodeReports:t==null?void 0:t.nodeReports,nodeResults:t==null?void 0:t.nodeResults}));return{
schema:xa,artifactId:`${e.cacheKey}:artifact`,cacheKey:e.cacheKey,cacheScope:e.scope,cacheKeySource:e.keySource,inputHash:e.
inputHash,resultHash:o,graphId:r,status:n!=null&&n.admitted?"admitted-cache-artifact-recorded":"recorded-not-admitted",admitted:(n==
null?void 0:n.admitted)===!0,admission:n,inputs:e.inputs,invalidationRefs:D(n==null?void 0:n.invalidationRefs,((i=e.inputs)==
null?void 0:i.invalidationRefs)||[]),stateSeedPayload:(t==null?void 0:t.stateSeedPayload)!=null?B(t.stateSeedPayload):null,
storedAt:a,expiresAt:s,ttlMs:e.ttlMs,resultSchema:(t==null?void 0:t.schema)||null,nodeCount:(t==null?void 0:t.nodeCount)??
null,resultNodeSchemas:((t==null?void 0:t.nodeReports)||[]).map(l=>({nodeId:l.nodeId,resultSchema:l.resultSchema||null,taskFamily:l.
taskFamily||null}))}}function es(r={}){const e=r.placementPolicy||r.placement||r.placementHint||{},t=String(P(e.requestedPlacement,
e.placement,e.mode,r.requestedPlacement,r.placementMode,"local")||"local").trim().toLowerCase();return{schema:Fa,requestedPlacement:t,
locality:String(P(e.locality,r.locality,t==="local"?"local-inline":"distributed")||""),authority:String(P(e.authority,r.
authority,"compute-manager")||"compute-manager"),targetPeerIds:D(e.targetPeerIds??e.peers??r.targetPeerIds),targetClusterId:P(
e.targetClusterId,e.clusterId,r.targetClusterId,null),gpuResident:e.gpuResident===!0||e.gpuLane===!0||r.gpuResident===!0,
advisory:e.advisory!==!1}}function ts(r={},e=null){const t=r.webgpu||{},a=r.gpuResidentLane||r.gpuResidentLaneLease||r.residentLane||
t.gpuResidentLane||t.residentLane||{},s=P(a.residency,t.residency,r.residency),n=a.enabled===!0||a.required===!0||a.leaseRequired===
!0||String(s||"").trim().toLowerCase()==="gpu-lane",o=P(a.laneId,a.gpuLaneId,t.laneId,t.gpuLaneId),i=P(a.stateKey,a.gpuStateKey,
t.stateKey,t.gpuStateKey,r.stateKey),l=P(a.domainKey,a.domain,t.domainKey,r.domainKey),c=D(a.retainedBufferRefs??t.retainedBufferRefs??
r.retainedBufferRefs),u=a.copyBudget&&typeof a.copyBudget=="object"?B(a.copyBudget):t.copyBudget&&typeof t.copyBudget=="\
object"?B(t.copyBudget):{};return!n&&!o&&!i&&c.length===0&&Object.keys(u).length===0?null:{schema:Xt,enabled:!0,laneId:o?
String(o):null,stateKey:i?String(i):null,domainKey:l?String(l):null,solverId:P(a.solverId,r.solverId,null),taskId:e,owner:P(
a.owner,r.owner,"compute-manager-task-graph"),readFamilies:D(a.readFamilies??a.reads??t.readFamilies??r.readFamilies),writeFamilies:D(
a.writeFamilies??a.writes??t.writeFamilies??r.writeFamilies),retainedBufferRefs:c,queueFencePolicy:P(a.queueFencePolicy,
a.fencePolicy,t.queueFencePolicy,null),copyBudget:u}}function rs(r){return["gpu-fence-completed","remote-gpu-fence-compl\
eted","queue-work-completed","readback-map-completed","ordered-before-consumer-queue-completed"].includes(String(r||""))}
function Fe(r=null,e=null){const t=r&&typeof r=="object"?r:{},a=t.status||t.queueCompletionStatus||t.fenceStatus||t.completionStatus||
(e!=null&&e.required?"gpu-fence-report-missing":null);if(!a&&!(e!=null&&e.required))return null;const s=t.method||t.queueCompletionMethod||
t.fenceMethod||t.completionMethod||null,n=t.fenceSatisfied===!0||t.satisfied===!0||t.completed===!0||rs(a);return{schema:t.
schema||Ba,status:a,method:s,fenceSatisfied:n,required:(e==null?void 0:e.required)===!0||t.required===!0,laneId:P(t.laneId,
t.gpuLaneId,e==null?void 0:e.laneId),stateKey:P(t.stateKey,t.gpuStateKey,e==null?void 0:e.stateKey),queueFencePolicy:P(t.
queueFencePolicy,t.fencePolicy,e==null?void 0:e.queueFencePolicy),queueCompletionStatus:t.queueCompletionStatus||a||null,
queueCompletionMethod:t.queueCompletionMethod||s||null,retainedBufferRefs:D(t.retainedBufferRefs,(e==null?void 0:e.retainedBufferRefs)||
[]),workerId:t.workerId||t.remoteWorkerId||null,deviceId:t.deviceId||t.gpuDeviceId||null,completedAt:t.completedAt||null,
source:t.source||null}}function Xe(r){var e;return r?typeof r=="function"?r.placementExecutorId||r.id||r.name||"placemen\
t-executor":r.id||r.name||((e=r.constructor)==null?void 0:e.name)||"placement-executor":null}function Ze(r){var e;return r?
typeof r=="function"?r.placementAdmissionId||r.id||r.name||"placement-admission":r.id||r.name||((e=r.constructor)==null?
void 0:e.name)||"placement-admission":null}function et(r){var e;return r?typeof r=="function"?r.placementResultValidatorId||
r.id||r.name||"placement-result-validator":r.id||r.name||((e=r.constructor)==null?void 0:e.name)||"placement-result-vali\
dator":null}function tt(r){var e;return r?typeof r=="function"?r.placementTaskSignerId||r.id||r.name||"placement-task-si\
gner":r.id||r.name||((e=r.constructor)==null?void 0:e.name)||"placement-task-signer":null}function as(r){return(Array.isArray(
r)?r:[]).slice(0,64).map((t,a)=>{const s=t&&typeof t=="object"?t:{};return{schema:s.schema||null,role:s.role||null,index:a,
peerId:s.peerId||s.remotePeerId||null,remotePeerId:s.remotePeerId||s.peerId||null,targetPeerId:s.targetPeerId||null,transportPeerId:s.
transportPeerId||null,responderNodeId:s.responderNodeId||null,responderPeerId:s.responderPeerId||null,clusterId:s.clusterId||
null,workerId:s.workerId||s.remoteWorkerId||null,remoteExecution:s.remoteExecution&&typeof s.remoteExecution=="object"?JSON.
parse(JSON.stringify(s.remoteExecution)):null,gpuFence:s.gpuFence&&typeof s.gpuFence=="object"?JSON.parse(JSON.stringify(
s.gpuFence)):null,executorId:s.executorId||null,codeHash:s.codeHash||null,inputHash:s.inputHash||null,taskHash:s.taskHash||
null,outputHash:s.outputHash||s.resultHash||null,resultHash:s.resultHash||s.outputHash||null,commitDeltaHash:s.commitDeltaHash||
s.deltaHash||null,resultSchema:s.resultSchema||s.schema||null,validated:s.validated===!0||s.valid===!0,ok:s.ok!==!1&&s.accepted!==
!1&&s.valid!==!1,promoted:s.promoted===!0,usedAsCommitSource:s.usedAsCommitSource===!0,errorCode:s.errorCode||null,errorMessage:s.
errorMessage||null,durationMs:Number.isFinite(Number(s.durationMs))?Number(Number(s.durationMs).toFixed(3)):null}})}function mt(r){
var e;if(r==null)return r;if(typeof r=="number")return Number.isFinite(r)?r:String(r);if(typeof r=="string"||typeof r=="\
boolean")return r;if(typeof r=="bigint")return`${r.toString()}n`;if(typeof r=="function")return`[Function:${r.name||"ano\
nymous"}]`;if(ArrayBuffer.isView(r))return{typedArray:((e=r.constructor)==null?void 0:e.name)||"TypedArray",values:Array.
from(r)};if(r instanceof ArrayBuffer)return{arrayBufferBytes:Array.from(new Uint8Array(r))};if(Array.isArray(r))return r.
map(mt);if(typeof r=="object"){const t={};for(const a of Object.keys(r).sort()){if(a==="taskPacket"||a==="taskEnvelope")
continue;const s=mt(r[a]);s!==void 0&&(t[a]=s)}return t}return String(r)}function Re(r){return JSON.stringify(mt(r))}function Ee(r){
const e=String(r??"");let t=2166136261;for(let a=0;a<e.length;a+=1)t^=e.charCodeAt(a),t=Math.imul(t,16777619)>>>0;return`\
fnv1a32-${t.toString(16).padStart(8,"0")}`}function rt({executorId:r,kind:e="worker",ordinal:t=null,status:a="active"}={}){
return{executorId:r,kind:e,ordinal:t,status:a,activeTaskCount:0,submitted:0,completed:0,failed:0,abandoned:0,averageDurationMs:0,
lastDurationMs:0,maxDurationMs:0,totalDurationMs:0,lastRuntime:null,lastTaskFamily:null,lastStartedAt:null,lastCompletedAt:null,
byRuntime:{},byTaskFamily:{}}}class ss{constructor(e={}){var n,o,i,l,c,u;const t=typeof navigator<"u"&&navigator.hardwareConcurrency?
navigator.hardwareConcurrency:4,a=typeof navigator<"u"&&!!navigator.gpu,s=typeof WebAssembly<"u";this.workerPolicyOverrides=
{minWorkers:e.minWorkers,targetWorkers:e.targetWorkers,initialWorkers:e.initialWorkers,maxWorkers:e.maxWorkers,autoScaleWorkers:e.
autoScaleWorkers,scaleUpQueueDepth:e.scaleUpQueueDepth,idleScaleDownMs:e.idleScaleDownMs},this.resourceProfile=Je(e.resourceProfile||
e,{wasm:s,webgpu:a}),this.workerPolicy=Qe(this.workerPolicyOverrides,this.resourceProfile),this.config={enableWebGPU:e.enableWebGPU||
!1,enableWorkers:e.enableWorkers!==!1,requireWorkers:e.requireWorkers===!0,workerBootstrapTimeoutMs:A(e.workerBootstrapTimeoutMs,
Tt,1,6e4),minWorkers:this.workerPolicy.minWorkers,targetWorkers:this.workerPolicy.targetWorkers,maxWorkers:this.workerPolicy.
maxWorkers||t,autoScaleWorkers:this.workerPolicy.autoScale,...e},this.config.minWorkers=this.workerPolicy.minWorkers,this.
config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.maxWorkers,this.config.autoScaleWorkers=
this.workerPolicy.autoScale,this.config.requireWorkers=e.requireWorkers===!0,this.config.workerBootstrapTimeoutMs=A(e.workerBootstrapTimeoutMs,
Tt,1,6e4),this.workers=[],this.taskQueue=[],this.activeTasks=new Map,this.activeTaskGraphs=new Map,this.taskGraphCache=new Map,
this.taskGraphCacheArtifacts=new Map,this.workerAffinities=new Map,this.residentWorkerAffinities=new Set,this.workerTerminationFailures=
new Map,this.modelServices=new Set,this.resourceBroker=e.resourceBroker||null,this.workerIds=new WeakMap,this.workerBootstrap=
new WeakMap,this.workerRequirementError=null,this.workerInitializationPromise=null,this.workerLifecycleRevision=0,this.workerUtilization=
new Map,this.nextWorkerOrdinal=1,this.inlineExecutorId="inline",this.workerUtilization.set(this.inlineExecutorId,rt({executorId:this.
inlineExecutorId,kind:"inline",ordinal:0,status:"active"})),this.solverRegistry=new Nr(e.solvers||[]),this.gpuResidentLaneManager=
e.gpuResidentLaneManager||new oa({gpuHub:e.gpuHub||null,deviceId:e.gpuDeviceId||e.deviceId||"compute-manager-gpu"}),this.
targetWorkerCount=this.workerPolicy.targetWorkers,this.workerSpawnFailures=0,this.workerRetirements=0,this.workerPoolRevision=
0,this.workerResizeHistory=[],this.placementExecutor=typeof e.placementExecutor=="function"||(n=e.placementExecutor)!=null&&
n.submitTask?e.placementExecutor:null,this.placementExecutorId=e.placementExecutorId||Xe(this.placementExecutor),this.placementAdmission=
typeof e.placementAdmission=="function"||(o=e.placementAdmission)!=null&&o.admitTask?e.placementAdmission:null,this.placementAdmissionId=
e.placementAdmissionId||Ze(this.placementAdmission),this.placementResultValidator=typeof e.placementResultValidator=="fu\
nction"||(i=e.placementResultValidator)!=null&&i.validateTaskResult||(l=e.placementResultValidator)!=null&&l.validateResult?
e.placementResultValidator:null,this.placementResultValidatorId=e.placementResultValidatorId||et(this.placementResultValidator),
this.placementTaskSigner=typeof e.placementTaskSigner=="function"||(c=e.placementTaskSigner)!=null&&c.signTaskPacket||(u=
e.placementTaskSigner)!=null&&u.signEnvelope||e.remoteTaskSigner?e.placementTaskSigner||e.remoteTaskSigner:null,this.placementTaskSignerId=
e.placementTaskSignerId||e.remoteTaskSignerId||tt(this.placementTaskSigner),this.placementTimeoutMs=A(e.placementTimeoutMs??
e.remotePlacementTimeoutMs,3e4,0,36e5),this.remoteResultVerification=e.remoteResultVerification!==!1&&e.placementResultVerification!==
!1,this.placementRetryPolicy={schema:ye,maxAttempts:A(e.placementMaxAttempts??e.remotePlacementMaxAttempts,1,1,100),baseDelayMs:A(
e.placementRetryBaseDelayMs??e.remotePlacementRetryBaseDelayMs,50,0,6e5),maxDelayMs:A(e.placementRetryMaxDelayMs??e.remotePlacementRetryMaxDelayMs,
1e3,0,6e5),jitterFraction:Q(e.placementRetryJitterFraction??e.remotePlacementRetryJitterFraction,0,0,1),retryableErrorKinds:D(
e.placementRetryableErrorKinds??e.remotePlacementRetryableErrorKinds,pe),terminalErrorKinds:[...Ce]},this.manualWorkerAutoScaleCooldownMs=
A(e.manualWorkerAutoScaleCooldownMs??e.workerResizeCooldownMs,4e3,0,6e5),this.workerAutoScaleHoldUntil=0,this.workerAutoScaleHoldReason=
null,this.lastWorkerResize={schema:"peercompute.compute.worker-resize.v0",revision:0,reason:"initial",previousTargetWorkers:this.
targetWorkerCount,targetWorkers:this.targetWorkerCount,previousWorkerCount:0,workerCount:0,changed:!1,timestamp:null},this.
stats={schema:"peercompute.compute.manager-stats.v0",totalTasksSubmitted:0,totalTasksCompleted:0,totalTasksFailed:0,inlineTasksCompleted:0,
workerTasksCompleted:0,remoteTasksCompleted:0,remoteTasksFailed:0,remoteTasksTimedOut:0,remoteTasksRejected:0,remoteTasksVerificationFailed:0,
remoteTasksValidationFailed:0,remoteTaskAttempts:0,remoteTasksRetried:0,remoteTasksRetryExhausted:0,taskGraphsSubmitted:0,
taskGraphsCompleted:0,taskGraphsFailed:0,taskGraphsCancelled:0,taskGraphCacheHits:0,taskGraphCacheWrites:0,taskGraphCacheArtifactsWritten:0,
taskGraphCacheArtifactsAdmitted:0,taskGraphRemoteCacheImports:0,taskGraphRemoteCacheImportBlocked:0,taskGraphCacheInvalidations:0,
taskGraphCacheReadBlocked:0,totalTaskDurationMs:0,averageTaskDurationMs:0,lastTaskDurationMs:0,minTaskDurationMs:null,maxTaskDurationMs:0,
lastCompletedAt:null,byRuntime:{},byTaskFamily:{},taskPlacement:{schema:Ct,totalSubmitted:0,totalCompleted:0,totalFailed:0,
localSubmitted:0,remoteRequested:0,remoteExecuted:0,remoteFailed:0,remoteTimedOut:0,remoteRejected:0,remoteVerificationFailed:0,
remoteValidationFailed:0,remoteAttempts:0,remoteRetried:0,remoteRetryExhausted:0,lastPlacement:null,lastRemotePlacement:null,
byRecommendedPlacement:{},byActualPlacement:{}}},this.scaleDownTimer=null,this.commitDeltaHandler=null,this.capabilities=
{cpu:!0,wasm:s,webgpu:a,wasmWebgpu:s&&a},this.hardwareCapabilities=null,this.benchmarkResult=null,this.initialized=!1,this.
workerBootstrapURL=e.workerBootstrapURL||e.computeWorkerBootstrapURL||e.workerScriptURL||e.workerScriptUrl||null}setCommitDeltaHandler(e){
this.commitDeltaHandler=e}commitDelta(e){this.commitDeltaHandler&&this.commitDeltaHandler(e)}async initialize(){if(this.
destroying)throw new Error("ComputeManager is shutting down");if(this.workerRequirementError)throw this.workerRequirementError;
if(this.workerInitializationPromise)return this.workerInitializationPromise;if(this.initialized)return;const e=this.workerLifecycleRevision;
if(this.initialized=!0,!this._supportsWorkers()){if(this.config.requireWorkers)throw this._failRequiredWorkerPool(this._createRequiredWorkerError(
"browser Worker construction is unavailable or workers were disabled"));console.warn("[ComputeManager] Web Workers not a\
vailable; falling back to inline execution");return}const t=A(this.targetWorkerCount,this.workerPolicy.targetWorkers,0,this.
workerPolicy.maxWorkers);for(let a=0;a<t&&this._spawnWorker();a+=1);if(this.workers.length===0){if(this.config.requireWorkers)
throw this._failRequiredWorkerPool(this.workerRequirementError||this._createRequiredWorkerError("no browser worker could\
 be constructed during bootstrap"));console.warn("[ComputeManager] Worker bootstrap failed; falling back to inline execu\
tion");return}if(this.config.requireWorkers){const a=this._waitForRequiredWorkerBootstrap();this.workerInitializationPromise=
a;try{if(await a,this.workerLifecycleRevision!==e)throw Object.assign(new Error("ComputeManager was destroyed during wor\
ker bootstrap"),{name:"ComputeManagerDestroyedError",code:"ERR_COMPUTE_MANAGER_DESTROYED"});if(this.workerRequirementError)
throw this.workerRequirementError;const s=this._getWorkerRequirementReport();if(s.workerCount===0||s.readyWorkerCount!==
s.workerCount)throw this._createRequiredWorkerError("the required worker pool changed before admission completed")}catch(s){
throw this.workerLifecycleRevision!==e?s:this._failRequiredWorkerPool(s)}finally{this.workerInitializationPromise===a&&(this.
workerInitializationPromise=null)}}}async destroy(){if(this.destroyingPromise)return this.destroyingPromise;this.destroying=
!0,this.workerLifecycleRevision+=1,this.destroyingPromise=this._destroyManagedRuntime();try{return await this.destroyingPromise}finally{
this.destroyingPromise=null,this.destroying=!1}}async _destroyManagedRuntime(){var s;clearTimeout(this.scaleDownTimer),this.
scaleDownTimer=null;const e=Object.assign(new Error("ComputeManager was destroyed before pending work completed"),{name:"\
ComputeManagerDestroyedError",code:"ERR_COMPUTE_MANAGER_DESTROYED"});for(;this.taskQueue.length;){const n=this.taskQueue.
shift();this._rejectTaskGpuResidentLaneLease(n,e.code),n.reject(e)}const t=[];for(const n of this.modelServices)try{await n.
dispose()}catch{t.push(n)}const a=[];for(const n of[...this.workers])this._markWorkerBootstrapFailed(n,e),this._removeWorker(
n)||a.push(this.workerTerminationFailures.get(n));for(const[n,o]of this.activeTasks)o.worker&&this.workers.includes(o.worker)||
(this.activeTasks.delete(n),this._rejectTaskGpuResidentLaneLease(o,e.code),(s=o.reject)==null||s.call(o,Object.assign(new Error(
e.message),{name:e.name,code:e.code,workerTerminated:!!o.worker})));for(const n of t)try{await n.dispose()}catch(o){a.push(
o)}if(a.length)throw new AggregateError(a,"ComputeManager cleanup is incomplete");this.workerAffinities.clear(),this.residentWorkerAffinities.
clear(),this.activeTaskGraphs.clear(),this.commitDeltaHandler=null,this.initialized=!1,this.workerRequirementError=null,
this.workerInitializationPromise=null,this.workerBootstrap=new WeakMap,this.workerIds=new WeakMap,this.modelServices.clear()}async createModelInferenceService({
artifactStore:e,resourceBroker:t,resourceBudgets:a,runtime:s="transformers.js",admissionOptions:n={},...o}={}){if(this.destroying)
throw new Error("ComputeManager is shutting down");if(!["transformers.js","llama.cpp","onnx-diffusion","transformers-spe\
ech","onnx-mesh","webgpu-sf3d"].includes(s))throw new Error("Unsupported model execution runtime");const i=this.workerLifecycleRevision,
[{ModelInferenceService:l},{ResourceLeaseBroker:c},{ResidentModelAdmission:u},m]=await Promise.all([z(()=>import("./ModelInferenceService-B5E0lmcM.js"),
__vite__mapDeps([12,2]),import.meta.url),z(()=>import("./ResourceLeaseBroker-BD_-7rTT.js"),[],import.meta.url),z(
()=>import("./ResidentModelAdmission-B4ucwTPs.js"),[],import.meta.url),s==="llama.cpp"?z(()=>import("./runtimeDefinition-DOfbGqHF.js").
then(f=>f.r),__vite__mapDeps([3,2,4]),import.meta.url).then(f=>f.ggufRuntimeDefinition):s==="onnx-diffusion"?z(()=>import("./runtimeDefinition-Co8rRWR2.js"),
__vite__mapDeps([6,2]),import.meta.url).then(f=>f.diffusionRuntimeDefinition):s==="onnx-mesh"?z(()=>import("./runtimeDefinition-C9EVJJca.js"),
__vite__mapDeps([9,2]),import.meta.url).then(f=>f.meshRuntimeDefinition):s==="webgpu-sf3d"?z(()=>import("./sf3dRuntimeDefinition-DVfO8VQf.js"),
__vite__mapDeps([11,2,9]),import.meta.url).then(f=>f.sf3dRuntimeDefinition):s==="transformers-speech"?z(()=>import("./runtimeDefinition-DR2ESEeO.js"),
__vite__mapDeps([4,2]),import.meta.url).then(f=>f.speechRuntimeDefinition):null]);if(this.destroying||i!==this.workerLifecycleRevision)
throw new Error("ComputeManager shutdown interrupted service creation");if(t&&this.resourceBroker&&t!==this.resourceBroker)
throw new Error("Model sessions must share the ComputeManager resource broker");if(!this.resourceBroker){if(!t&&!a)throw new Error(
"Configure inference CPU/GPU resource budgets");this.resourceBroker=t||new c({capacities:a})}const d=new l({...o,runtimeDefinition:m,
artifactStore:e,computeManager:this,admission:new u({...n,broker:this.resourceBroker})});this.modelServices.add(d);const h=d.
dispose.bind(d);return d.dispose=async()=>{const f=await h();return this.modelServices.delete(d),f},d}async probeCapabilities(e={}){
var l,c,u,m,d,h;const t=await Ot(e);this.hardwareCapabilities=t;const a=((l=t.webgpu)==null?void 0:l.available)===!0,s=((c=
t.wasm)==null?void 0:c.supported)!==!1;this.capabilities={...this.capabilities,wasm:s,webgpu:a,wasmWebgpu:s&&a};const n=er(
(u=t.webgpu)==null?void 0:u.limits),o={...this.resourceProfile,cpuCores:this.resourceProfile.source==="configured"&&this.
resourceProfile.cpuCores?this.resourceProfile.cpuCores:t.cpu.cores,deviceMemoryGB:this.resourceProfile.source==="configu\
red"&&this.resourceProfile.deviceMemoryGB!=null?this.resourceProfile.deviceMemoryGB:t.memory.deviceMemoryGiB,gpuAvailable:a,
gpuLimits:n||this.resourceProfile.gpuLimits,gpuLimitsSource:n?"adapter":this.resourceProfile.gpuLimitsSource,source:this.
resourceProfile.source||"browser"},i=Je(o,this.capabilities);return this.resourceProfile={...i,gpuInfo:(m=t.webgpu)!=null&&
m.info?{...t.webgpu.info}:null,gpuFeatures:Array.isArray((d=t.webgpu)==null?void 0:d.features)?[...t.webgpu.features]:[],
isFallbackAdapter:((h=t.webgpu)==null?void 0:h.isFallbackAdapter)??null,wasmFeatures:t.wasm?{...t.wasm}:null,hardwareFingerprint:t.
hardwareFingerprint||null},this.workerPolicy=Qe(this.workerPolicyOverrides,this.resourceProfile),this.config.minWorkers=
this.workerPolicy.minWorkers,this.config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.
maxWorkers,this.config.autoScaleWorkers=this.workerPolicy.autoScale,t}async benchmarkCapabilities(e={}){const t=e.capabilities||
this.hardwareCapabilities||await this.probeCapabilities({scope:e.scope,allowFallback:e.allowFallback===!0}),a=await ba({
...e,capabilities:t,computeManager:e.computeManager===!1?null:e.computeManager||this});return this.benchmarkResult=a,a}getHardwareCapabilities(){
return this.hardwareCapabilities?JSON.parse(JSON.stringify(this.hardwareCapabilities)):null}getBenchmarkResult(){return this.
benchmarkResult?JSON.parse(JSON.stringify(this.benchmarkResult)):null}sizeWorkload(e={},t={}){return pr(e,{capabilities:t.
capabilities||this.hardwareCapabilities||{cpu:{cores:this.resourceProfile.cpuCores},memory:{deviceMemoryGiB:this.resourceProfile.
deviceMemoryGB},webgpu:{available:this.resourceProfile.gpuAvailable,isFallbackAdapter:this.resourceProfile.isFallbackAdapter??
!1,limits:this.resourceProfile.gpuLimits||{},features:this.resourceProfile.gpuFeatures||[]},tier:this.resourceProfile.tier,
planningBudgets:{memoryBudgetMB:this.resourceProfile.memoryBudgetMB,gpuMemoryBudgetMB:this.resourceProfile.gpuMemoryBudgetMB}},
benchmark:t.benchmark??this.benchmarkResult})}async refreshGpuLimits(e={}){var t;if(typeof navigator>"u"||!((t=navigator.
gpu)!=null&&t.requestAdapter))return this.getResourceProfile();try{await this.probeCapabilities({allowFallback:(e==null?
void 0:e.allowFallback)===!0,timeoutMs:(e==null?void 0:e.timeoutMs)??3e3})}catch{return this.getResourceProfile()}return this.
getResourceProfile()}async submitTask(e){var f,y,p,k,E,_;if(!e)throw new Error("Task is required");const t=["peercompute\
:model-inference","peercompute:gguf-inference","peercompute:diffusion-inference","peercompute:speech-inference","peercom\
pute:mesh-inference","peercompute:sf3d-inference"].includes(e.module)&&((f=e.data)==null?void 0:f.command)==="unload"&&[
...this.modelServices].some(w=>{var g;return((g=w.session)==null?void 0:g.affinityKey)===e.affinityKey});if(this.destroying&&
!t)throw new Error("ComputeManager is shutting down");const a=this.workerLifecycleRevision;(y=e.signal)==null||y.throwIfAborted();
const s=typeof e.runtime=="string"?e.runtime.trim().toLowerCase():e.wasm?e.hostModule||e.module?"wasm-webgpu":"wasm":"js";
if(s==="js"&&!e.fn&&!e.module)throw new Error("JavaScript tasks must provide fn or module");if((s==="wasm"||s==="wasm-we\
bgpu")&&!((p=e.wasm)!=null&&p.source||e.wasmSource||e.source))throw new Error(`${s} tasks must provide wasm.source`);if(s===
"wasm-webgpu"&&!(e.hostModule||e.module))throw new Error("wasm-webgpu tasks must provide hostModule or module");if(this.
workerRequirementError)throw this.workerRequirementError;if((!this.initialized||this.config.requireWorkers&&this.workerInitializationPromise)&&
await this.initialize(),this.workerRequirementError)throw this.workerRequirementError;if((k=e.signal)==null||k.throwIfAborted(),
this.destroying&&!t||a!==this.workerLifecycleRevision)throw new Error("ComputeManager shutdown interrupted task submissi\
on");if(e.requireWorker===!0&&!this._supportsWorkers())throw this._createRequiredWorkerError("this task requires worker \
execution");const n=typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`,o=e.id||n;
if(this.activeTasks.has(o)||this.taskQueue.some(w=>w.id===o))throw new Error(`Compute task id is already active: ${o}`);
const i=this._runtimeStats(s);i.submitted+=1,this.stats.totalTasksSubmitted+=1;const l=this._normalizeTaskFamily(e,s),c=this.
_taskFamilyStats(l);c.submitted+=1;const u=this._normalizeTaskPlacement(e,{runtime:s,taskFamily:l}),m=za(e),d=Va(e,m);this.
_recordPlacementSubmitted(u);const h={id:o,runtime:s,taskFamily:l,solverId:e.solverId,placement:u,gpuFence:m,gpuResidentLane:d,
data:e.data??null,fn:e.fn?e.fn.toString():void 0,module:e.module,hostModule:e.hostModule,exportName:e.exportName||"defau\
lt",hostExport:e.hostExport,wasm:e.wasm,wasmSource:e.wasmSource,source:e.source,args:e.args,webgpu:e.webgpu,suppressCommitDelta:e.
suppressCommitDelta===!0||e.commitDelta===!1,returnEnvelope:e.returnEnvelope===!0||e.returnRawResult===!0,requireWorker:e.
requireWorker===!0,affinityKey:e.affinityKey||e.workerKey||((E=e.data)==null?void 0:E.affinityKey)||((_=e.data)==null?void 0:
_.stateKey)};if(h.requireWorker&&((d==null?void 0:d.localExecution)==="inline"||u.requestedPlacement!=="local"&&!u.advisory))
throw this._createRequiredWorkerError("required local worker conflicts with requested placement");if(h.affinityKey&&this.
residentWorkerAffinities.has(h.affinityKey)&&!this.workerAffinities.has(h.affinityKey))throw Object.assign(new Error("Re\
sident worker was terminated"),{workerTerminated:!0,code:"ERR_COMPUTE_WORKER_TERMINATED"});if(this._ensureTargetWorkers(
{reason:"task-demand"}),this.workerRequirementError)throw this.workerRequirementError;return new Promise((w,g)=>{var O,q;
const R={settled:!1,cancelRequested:!1,timer:null,bootstrapTimer:null};let b;const M=new Promise(C=>{b=C}),L=()=>{this.cancelTask(
o).catch(()=>{})},x=(C,v)=>{var j;R.settled||(R.settled=!0,clearTimeout(R.timer),clearTimeout(R.bootstrapTimer),(j=e.signal)==
null||j.removeEventListener("abort",L),C(v),b())},T={id:o,payload:h,control:R,completion:M,resolve:C=>x(w,C),reject:C=>x(
g,C),onProgress:typeof e.onProgress=="function"?e.onProgress:null,transferables:Array.isArray(e.transferables)?e.transferables:
[],submittedAt:Z(),runtime:s,taskFamily:l,placement:u};if(h.requireWorker&&!this.workers.some(C=>{var v;return((v=this.workerBootstrap.
get(C))==null?void 0:v.status)==="ready"})&&(R.bootstrapTimer=setTimeout(()=>{const C=this.taskQueue.findIndex(v=>v.id===
o);C<0||(this.taskQueue.splice(C,1),this._recordTaskCompletion(T,{ok:!1,mode:"queued"}),T.reject(this._createRequiredWorkerError(
"task worker readiness timed out")))},this.config.workerBootstrapTimeoutMs)),(O=e.signal)==null||O.addEventListener("abo\
rt",L,{once:!0}),(q=e.signal)!=null&&q.aborted){T.reject(e.signal.reason||new DOMException("Compute task cancelled","Abo\
rtError"));return}this._dispatchToPlacementExecutor(T)||this._dispatchToWorker(T)||(this.taskQueue.push(T),this._maybeScaleForQueue(),
this._scheduleNext())})}getResourceProfile(){return{...this.resourceProfile}}getWorkerPolicy(){return{...this.workerPolicy,
targetWorkers:this.targetWorkerCount}}setResourceProfile(e={}){return this.resourceProfile=Je(e,this.capabilities),this.
workerPolicy=Qe(this.workerPolicyOverrides,this.resourceProfile),this.config.minWorkers=this.workerPolicy.minWorkers,this.
config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.maxWorkers,this.config.autoScaleWorkers=
this.workerPolicy.autoScale,this.resizeWorkers(this.workerPolicy.targetWorkers,{reason:"resource-profile-update"})}resizeWorkers(e,{
reason:t="manual"}={}){const a=this.targetWorkerCount,s=this.workers.length,n=this.config.requireWorkers?Math.max(1,this.
workerPolicy.minWorkers):this.workerPolicy.minWorkers,o=A(e,this.targetWorkerCount,n,this.workerPolicy.maxWorkers);if(this.
targetWorkerCount=o,Ua(t)&&this._holdWorkerAutoScale(t),!this.initialized||!this._supportsWorkers())return this._recordWorkerResize(
{reason:t,previousTargetWorkers:a,previousWorkerCount:s}),this.getCapabilities();for(;this.workers.length<this.targetWorkerCount&&
this._spawnWorker(););return this._retireIdleWorkers(t),this._scheduleNext(),this._recordWorkerResize({reason:t,previousTargetWorkers:a,
previousWorkerCount:s}),this.getCapabilities()}estimateWorkloadBudget({itemName:e="items",baseItems:t=4096,minItems:a=1024,
maxItems:s=65536,itemStrideBytes:n=0,memoryFraction:o=.25,layerCount:i=1,maxShardsPerLayer:l=8}={}){var v;const c=Math.max(
1,this.targetWorkerCount||this.workerPolicy.targetWorkers||1),u=A(i,1,1,1024),m=Ga(this.resourceProfile.tier),d=Math.max(
1,Math.floor(c/u)),h=A(Math.min(m,d),1,1,Math.max(1,l)),f=Na(this.resourceProfile.tier),y=xe(c/qa(this.resourceProfile.tier)),
p=Q(this.resourceProfile.memoryBudgetMB,ut(this.resourceProfile.tier),0,1048576),k=Q(this.resourceProfile.gpuMemoryBudgetMB,
0,0,1048576),E=xe(p/ut(this.resourceProfile.tier)),_=this.resourceProfile.gpuAvailable?xe(k/Math.max(1,Zt(this.resourceProfile.
tier))):.75,w=Q(this.resourceProfile.budgetScale,1,.05,64),g=xe(Math.min(y,E,_)*w),R=A(n,0,0,1048576),b=Q(o,.25,.01,1),M=R>
0&&p>0?Math.max(a,Math.floor(p*1024*1024*b/R)):s,L=R>0&&this.resourceProfile.gpuLimits?Math.min(A(this.resourceProfile.gpuLimits.
maxBufferSize,Number.MAX_SAFE_INTEGER,0),A(this.resourceProfile.gpuLimits.maxStorageBufferBindingSize,Number.MAX_SAFE_INTEGER,
0)):Number.MAX_SAFE_INTEGER,x=Number.isFinite(L)&&L>0&&R>0?Math.max(a,Math.floor(L*b/R)):s,T=Math.max(a,Math.min(s,M,x)),
O=A(Ka(t*f*g,256),t,a,T),C=((v=Object.entries({workers:y,memory:E,gpu:_,explicit:w}).sort((j,V)=>j[1]-V[1])[0])==null?void 0:
v[0])||"workers";return{schema:"peercompute.compute.workload-budget.v0",itemName:e,itemCount:O,minItems:a,maxItems:s,effectiveMaxItems:T,
itemStrideBytes:R,workerCount:c,shardsPerLayer:h,layerCount:u,plannedWorkerTasks:u*h,capacity:{schema:"peercompute.compu\
te.capacity-budget.v0",budgetScale:g,limitingFactor:C,workerScale:y,memoryScale:E,gpuScale:_,explicitScale:w,memoryBudgetMB:p,
gpuMemoryBudgetMB:k,memoryFraction:b,memoryMaxItems:M,gpuMaxItems:x,gpuLimits:this.resourceProfile.gpuLimits?{...this.resourceProfile.
gpuLimits}:null},resourceProfile:this.getResourceProfile(),workerPolicy:this.getWorkerPolicy()}}registerSolver(e){return this.
solverRegistry.register(e)}unregisterSolver(e){return this.solverRegistry.unregister(e)}getSolver(e){return this.solverRegistry.
get(e)}listSolvers(){return this.solverRegistry.list()}submitSolverTask(e,t={}){const a=this.solverRegistry.createTask(e,
t);return this.submitTask(a)}async submitTaskGraph(e={}){var C,v,j,V,re,ae,ne,ee;const t=String(e.graphId||e.id||`task-g\
raph:${Date.now()}`).trim(),a=Array.isArray(e.nodes)?e.nodes:[];if(!a.length)throw new Error("submitTaskGraph requires a\
t least one node");const s=[],n=new Map;for(const S of a){const I=String((S==null?void 0:S.id)||(S==null?void 0:S.nodeId)||
((C=S==null?void 0:S.task)==null?void 0:C.id)||"").trim();if(!I)throw new Error("submitTaskGraph node id is required");if(n.
has(I))throw new Error(`Duplicate task graph node id: ${I}`);const $=D(S.dependsOn||S.dependencies||[]),H={...S,id:I,dependsOn:$};
s.push(H),n.set(I,H)}for(const S of s)for(const I of S.dependsOn)if(!n.has(I))throw new Error(`Task graph node ${S.id} d\
epends on unknown node ${I}`);this.stats.taskGraphsSubmitted+=1;const o=Ja(e,s),i=Qa(e),l=Xa(e,o),c=es(e),u=ts(e,t),m=String(
((v=e.cancellation)==null?void 0:v.mode)||e.cancellationMode||"cooperative").trim()||"cooperative",d=e.abortSignal||e.cancelSignal||
e.signal||((j=e.cancellation)==null?void 0:j.signal)||null,h={schema:$e,mode:m,status:"not-cancelled",reason:null};let f=o.
readEnabled?this.taskGraphCache.get(o.cacheKey):null;const y=Date.now();f&&f.expiresAt&&f.expiresAt<=y&&(this.taskGraphCache.
delete(o.cacheKey),this.taskGraphCacheArtifacts.delete(o.cacheKey),f=null);let p=null;if(f&&o.requireAdmitted&&((V=f.artifact)==
null?void 0:V.admitted)!==!0&&(this.stats.taskGraphCacheReadBlocked+=1,p="blocked-unadmitted-cache-artifact",f=null),f){
this.stats.taskGraphCacheHits+=1,this.stats.taskGraphsCompleted+=1;const S=B(f.result),I=B(f.artifact||S.cacheArtifact||
null);return{...S,cachePolicy:o,cacheAdmission:(I==null?void 0:I.admission)||S.cacheAdmission||l,cacheAdmissionStatus:((re=
I==null?void 0:I.admission)==null?void 0:re.status)||S.cacheAdmissionStatus||null,cacheArtifact:I,cacheArtifactSchema:(I==
null?void 0:I.schema)||null,cacheArtifactStatus:(I==null?void 0:I.status)||null,cacheStatus:"hit",cacheHit:!0,cachedAt:f.
storedAt,durationMs:0}}const k=new Map(s.map(S=>[S.id,S])),E={},_=[],w=[],g=[],R=Z(),b={graphId:t,startedAt:R,cancelled:(d==
null?void 0:d.aborted)===!0,reason:(d==null?void 0:d.reason)||null,cacheKey:o.cacheKey,stateSeedPayload:i,placementPolicy:c,
graphLaneSpec:u},M=()=>{b.cancelled=!0,b.reason=(d==null?void 0:d.reason)||"abort-signal"};d!=null&&d.addEventListener&&
d.addEventListener("abort",M,{once:!0}),this.activeTaskGraphs.set(t,b);const L=()=>{if(!b.cancelled)return;h.status="can\
celled",h.reason=String(b.reason||"cancelled");const S=new Error(`Task graph cancelled: ${t}`);throw S.code="TASK_GRAPH_\
CANCELLED",S.graphId=t,S.cancellation={...h},S};let x=null,T=null,O=u?"required":"not-required",q=p||(o.readEnabled?"mis\
s":o.writeEnabled?"record-only":"disabled");try{for(L(),u&&(x=this.acquireGpuResidentLaneLease({...u,taskId:t,owner:u.owner||
"compute-manager-task-graph"}),O="active");k.size>0;){L();const I=new Set(Object.keys(E)),$=Array.from(k.values()).filter(
F=>F.dependsOn.every(se=>I.has(se)));if(!$.length)throw new Error(`Task graph has a cycle or unsatisfied dependency: ${Array.
from(k.keys()).join(", ")}`);g.push($.map(F=>F.id));const H=await Promise.all($.map(async F=>{L();const se={schema:Ia,graphId:t,
nodeId:F.id,dependsOn:[...F.dependsOn],completedNodeIds:Object.keys(E),nodeResults:E,results:E,cachePolicy:o,cacheKey:o.
cacheKey,cacheInputs:o.inputs,stateSeedPayload:i,placementPolicy:c,cancellation:h,graphLease:x,graphLeaseSpec:u,getResult(ie){
return E[ie]}};let X=typeof F.createTask=="function"?await F.createTask(se):typeof F.task=="function"?await F.task(se):F.
task;if(!X||typeof X!="object")throw new Error(`Task graph node ${F.id} did not produce a task`);X=Ya(X,F,E),L();const de=Z(),
oe=await this.submitTask(X);return L(),{node:F,task:X,result:oe,durationMs:Math.max(0,Z()-de)}}));for(const F of H)k.delete(
F.node.id),E[F.node.id]=F.result,w.push(F.node.id),_.push({nodeId:F.node.id,dependsOn:[...F.node.dependsOn],taskId:F.task.
id||null,taskFamily:F.task.taskFamily||F.task.solverId||null,solverId:F.task.solverId||null,status:"completed",durationMs:F.
durationMs,resultSchema:((ae=F.result)==null?void 0:ae.computeTaskResultSchema)||((ne=F.result)==null?void 0:ne.schema)||
null})}x!=null&&x.leaseId&&(T=this.completeGpuResidentLaneLease(x.leaseId,{status:"ordered-before-consumer-queue-complet\
ed",method:"compute-manager-task-graph-completion",queueCompletionStatus:"ordered-before-consumer-queue-completed",queueCompletionMethod:"\
compute-manager-task-graph-completion",releaseReason:"task-graph-completed"}),O=((ee=T==null?void 0:T.lease)==null?void 0:
ee.status)||"completed");const S={schema:Bt,graphId:t,status:"completed",nodeCount:s.length,edgeCount:s.reduce((I,$)=>I+
$.dependsOn.length,0),executionOrder:w,executionBatches:g,nodeReports:_,nodeResults:E,cachePolicy:o,cacheKey:o.cacheKey,
cacheKeySource:o.keySource,cacheInputHash:o.inputHash,cacheInputs:o.inputs,stateSeedPayload:i,cacheAdmission:l,cacheAdmissionStatus:l.
status,cacheArtifact:null,cacheArtifactSchema:null,cacheArtifactStatus:null,cacheStatus:q,cacheHit:!1,placementPolicy:c,
cancellation:h,cancellationStatus:h.status,graphLeaseRequired:u!=null,graphLeaseStatus:O,graphLeaseSpec:u,graphLease:x,graphLeaseExecution:T,
durationMs:Math.max(0,Z()-R)};if(o.writeEnabled){const I=Date.now(),$=o.ttlMs>0?I+o.ttlMs:null,H=Za({graphId:t,cachePolicy:o,
result:S,storedAt:I,expiresAt:$,admission:l});this.taskGraphCache.set(o.cacheKey,{storedAt:I,expiresAt:$,artifact:B(H),result:B(
S)}),this.taskGraphCacheArtifacts.set(o.cacheKey,B(H)),this.stats.taskGraphCacheWrites+=1,this.stats.taskGraphCacheArtifactsWritten+=
1,q=o.readEnabled?"miss-stored":"recorded",S.cacheStatus=q,S.cachedAt=I,S.cacheArtifact=H,S.cacheArtifactSchema=H.schema,
S.cacheArtifactStatus=H.status}return this.stats.taskGraphsCompleted+=1,S}catch(S){const I=b.cancelled||(S==null?void 0:
S.code)==="TASK_GRAPH_CANCELLED";if(I?this.stats.taskGraphsCancelled+=1:this.stats.taskGraphsFailed+=1,x!=null&&x.leaseId&&
!T)try{this.rejectGpuResidentLaneLease(x.leaseId,I?"task-graph-cancelled":"task-graph-failed"),O=I?"rejected-cancelled":
"rejected-failed"}catch{O="reject-failed"}throw S.graphId=S.graphId||t,S.taskGraphStatus=I?"cancelled":"failed",S.graphLeaseStatus=
O,S.cancellation=S.cancellation||{...h},S}finally{d!=null&&d.removeEventListener&&d.removeEventListener("abort",M),this.
activeTaskGraphs.delete(t)}}getGpuResidentLaneManager(){return this.gpuResidentLaneManager}getGpuResidentLaneStats(){var e,
t;return((t=(e=this.gpuResidentLaneManager)==null?void 0:e.getStats)==null?void 0:t.call(e))||null}acquireGpuResidentLaneLease(e={}){
var t;if(!((t=this.gpuResidentLaneManager)!=null&&t.acquireLease))throw new Error("GPU resident lane manager is not avai\
lable");return this.gpuResidentLaneManager.acquireLease(e)}completeGpuResidentLaneLease(e,t={}){var a;if(!((a=this.gpuResidentLaneManager)!=
null&&a.completeLease))throw new Error("GPU resident lane manager is not available");return this.gpuResidentLaneManager.
completeLease(e,t)}rejectGpuResidentLaneLease(e,t="lane-validation-rejected"){var a;if(!((a=this.gpuResidentLaneManager)!=
null&&a.rejectLease))throw new Error("GPU resident lane manager is not available");return this.gpuResidentLaneManager.rejectLease(
e,t)}executeGpuResidentLaneStagePlan(e,t={}){var a;if(!((a=this.gpuResidentLaneManager)!=null&&a.executeStagePlan))throw new Error(
"GPU resident lane manager cannot execute stage plans");return this.gpuResidentLaneManager.executeStagePlan(e,t)}preflightGpuResidentLaneStagePlacement(e,t={}){
var a;if(!((a=this.gpuResidentLaneManager)!=null&&a.preflightStagePlacement))throw new Error("GPU resident lane manager \
cannot preflight stage placement");return this.gpuResidentLaneManager.preflightStagePlacement(e,t)}planGpuResidentLaneStagePlacement(e,t={}){
return this.preflightGpuResidentLaneStagePlacement(e,t)}async distributeTask(e,t){}async cancelTask(e,t={}){const a=this.
taskQueue.findIndex(c=>c.id===e),s=a>=0?this.taskQueue[a]:this.activeTasks.get(e);if(!s)return{cancelled:!1,status:"not-\
found"};if(!s.control)return{cancelled:!1,status:"unsupported-executor"};if(s.control.cancelRequested)return s.control.cancellation;
if(a<0&&!s.worker)return{cancelled:!1,status:"unsupported-executor"};s.control.cancelRequested=!0;const n=Object.assign(
new Error(String(t.reason||"Compute task cancelled")),{name:"AbortError",code:"ERR_COMPUTE_TASK_CANCELLED"});let o;const i=new Promise(
(c,u)=>{o=u});if(s.control.cancellation=Promise.race([s.completion,i]).then(()=>({cancelled:!0,status:"settled",workerTerminated:!!n.
workerTerminated})),a>=0)return this.taskQueue.splice(a,1),this._recordTaskCompletion(s,{ok:!1,mode:"queued"}),s.reject(
n),this._scheduleNext(),{cancelled:!0,status:"cancelled-queued"};const l=()=>{if(!s.control.settled){if(!this._removeWorker(
s.worker)){clearTimeout(s.control.timer),s.control.cancelRequested=!1,o(this.workerTerminationFailures.get(s.worker));return}
this.activeTasks.delete(e),n.workerTerminated=!0,this._recordTaskCompletion(s,{ok:!1,mode:"worker"}),s.reject(n),this._ensureTargetWorkers(
{reason:"cancelled-worker"}),this._scheduleNext()}};s.control.timer=setTimeout(l,A(t.timeoutMs,2e3,1,6e4));try{s.worker.
postMessage({type:"cancel",id:e})}catch{l()}return s.control.cancellation}async reserveWorkerAffinity(e){var l,c;if(this.
destroying)throw new Error("ComputeManager is shutting down");const t=this.workerLifecycleRevision,a=String(e||"").trim();
if(!a)throw new TypeError("Worker affinity key is required");if(this.initialized||await this.initialize(),this.destroying||
t!==this.workerLifecycleRevision)throw new Error("ComputeManager shutdown interrupted reservation");if(!this._supportsWorkers())
throw this._createRequiredWorkerError("resident sessions require workers");if(this.residentWorkerAffinities.has(a)){const u=this.
getWorkerAffinityState(a),m=this.workerTerminationFailures.get(this.workerAffinities.get(a));if(m)throw m;if(!u.workerId)
throw Object.assign(new Error("Resident worker was terminated"),{workerTerminated:!0,code:"ERR_COMPUTE_WORKER_TERMINATED"});
return u}if(this.residentWorkerAffinities.size>=this.workerPolicy.maxWorkers)throw new Error("Resident worker capacity e\
xceeded");const s=new Set([...this.activeTasks.values()].map(u=>u.worker)),n=new Set(this.workerAffinities.values());let o=this.
workers.find(u=>!s.has(u)&&!n.has(u));if(!o&&this.workers.length<this.workerPolicy.maxWorkers&&(o=this._spawnWorker()),!o)
throw new Error("No unassigned worker available for resident session");this.workerAffinities.set(a,o),this.residentWorkerAffinities.
add(a);let i;try{if(await Promise.race([(l=this.workerBootstrap.get(o))==null?void 0:l.promise,new Promise((u,m)=>{i=setTimeout(
()=>m(this._createRequiredWorkerError("resident worker readiness timed out")),this.config.workerBootstrapTimeoutMs)})]),
!this.workers.includes(o)||((c=this.workerBootstrap.get(o))==null?void 0:c.protocolVersion)!==2)throw this._createRequiredWorkerError(
"resident worker needs managed task protocol version 2");return this.getWorkerAffinityState(a)}catch(u){if(u.workerTerminated=
this._removeWorker(o),u.workerTerminated)this.residentWorkerAffinities.delete(a),this.workerAffinities.delete(a);else throw this.
workerTerminationFailures.get(o);throw u}finally{clearTimeout(i)}}getWorkerAffinityState(e){const t=this.workerAffinities.
get(e);return{affinityKey:e,reserved:this.residentWorkerAffinities.has(e),workerId:t?this._workerId(t):null}}async terminateWorkerAffinity(e,{
reason:t="Resident runtime terminated"}={}){var n;if(!this.residentWorkerAffinities.has(e))throw new Error("Cannot termi\
nate an unreserved worker affinity");const a=this.workerAffinities.get(e);if(a&&!this._removeWorker(a))throw this.workerTerminationFailures.
get(a);const s=Object.assign(new Error(String(t)),{code:"ERR_COMPUTE_WORKER_TERMINATED",workerTerminated:!0});for(const[
o,i]of this.activeTasks)((n=i.payload)==null?void 0:n.affinityKey)===e&&(this.activeTasks.delete(o),this._recordTaskCompletion(
i,{ok:!1,mode:"worker"}),i.reject(s));return this.taskQueue=this.taskQueue.filter(o=>{var i;return((i=o.payload)==null?void 0:
i.affinityKey)!==e?!0:(this._recordTaskCompletion(o,{ok:!1,mode:"queued"}),o.reject(s),!1)}),this._ensureTargetWorkers({
reason:"resident-runtime-terminated"}),this._scheduleNext(),{affinityKey:e,workerTerminated:!0}}async releaseWorkerAffinity(e){
const t=this.workerTerminationFailures.get(this.workerAffinities.get(e));if(t)throw t;if([...this.activeTasks.values(),...this.
taskQueue].some(a=>{var s;return((s=a.payload)==null?void 0:s.affinityKey)===e}))throw new Error("Cannot release a worke\
r affinity while its task is active");this.residentWorkerAffinities.delete(e),this.workerAffinities.delete(e),this._retireIdleWorkers(),
this._scheduleNext()}cancelTaskGraph(e,t="cancelTaskGraph"){const a=String(e||"").trim(),s=this.activeTaskGraphs.get(a);
return s?(s.cancelled=!0,s.reason=String(t||"cancelTaskGraph"),{schema:$e,graphId:a,status:"cancel-requested",cancelled:!0,
reason:s.reason}):{schema:$e,graphId:a||null,status:"not-found",cancelled:!1,reason:String(t||"cancelTaskGraph")}}listActiveTaskGraphs(){
return Array.from(this.activeTaskGraphs.values()).map(e=>({schema:Bt,graphId:e.graphId,status:e.cancelled?"cancel-reques\
ted":"running",startedAt:e.startedAt,cacheKey:e.cacheKey||null,placementPolicy:e.placementPolicy?JSON.parse(JSON.stringify(
e.placementPolicy)):null,graphLeaseRequired:e.graphLaneSpec!=null,cancellationReason:e.reason||null}))}getTaskGraphCacheArtifact(e){
const t=String(e||"").trim(),a=this.taskGraphCacheArtifacts.get(t);return a?B(a):null}listTaskGraphCacheArtifacts(){return Array.
from(this.taskGraphCacheArtifacts.values()).map(e=>B(e)).sort((e,t)=>String(e.cacheKey||"").localeCompare(String(t.cacheKey||
"")))}importRemoteTaskGraphCacheResult(e={},t={},a={}){var y,p,k,E,_,w,g;const s=e!=null&&e.cacheArtifact&&typeof e.cacheArtifact==
"object"?e.cacheArtifact:null,n=String((s==null?void 0:s.cacheKey)||(e==null?void 0:e.cacheKey)||(t==null?void 0:t.cacheKey)||
"").trim();if(!n)throw this.stats.taskGraphRemoteCacheImportBlocked+=1,new Error("importRemoteTaskGraphCacheResult requi\
res a cacheKey");if(!s)throw this.stats.taskGraphRemoteCacheImportBlocked+=1,new Error("importRemoteTaskGraphCacheResult\
 requires result.cacheArtifact");if((t==null?void 0:t.admitted)!==!0){this.stats.taskGraphRemoteCacheImportBlocked+=1;const R=new Error(
`Remote task graph cache artifact is not admitted: ${n}`);throw R.code="ERR_REMOTE_TASK_GRAPH_CACHE_ARTIFACT_NOT_ADMITTE\
D",R.cacheKey=n,R}const o=Date.now(),i=s.storedAt||e.cachedAt||o,l=s.expiresAt||null,c=D((y=e==null?void 0:e.graphLeaseSpec)==
null?void 0:y.retainedBufferRefs,(p=e==null?void 0:e.cacheInputs)==null?void 0:p.retainedBufferRefs,(k=s==null?void 0:s.
inputs)==null?void 0:k.retainedBufferRefs),u={schema:Xt,source:"remote-task-graph-result",remoteOnly:!0,usableLocally:!1,
status:c.length>0?"remote-retained-buffer-refs-metadata-only":"no-remote-retained-buffer-refs",reason:c.length>0?"remote\
-gpu-resident-refs-are-not-local-device-leases":"remote-result-did-not-declare-retained-buffer-refs",laneId:((E=e==null?
void 0:e.graphLeaseSpec)==null?void 0:E.laneId)||((_=e==null?void 0:e.graphLease)==null?void 0:_.laneId)||null,stateKey:((w=
e==null?void 0:e.graphLeaseSpec)==null?void 0:w.stateKey)||((g=e==null?void 0:e.graphLease)==null?void 0:g.stateKey)||null,
retainedBufferRefs:c,graphLeaseStatus:(e==null?void 0:e.graphLeaseStatus)||null,graphLeaseRequired:(e==null?void 0:e.graphLeaseRequired)===
!0},m={schema:ct,status:"admitted",admitted:!0,authority:t.authority||"node-kernel-state-manager",admissionId:t.admissionId||
null,validatorId:t.validatorId||null,reason:t.reason||"remote-task-graph-cache-artifact-admitted",invalidationRefs:D(t.invalidationRefs,
s.invalidationRefs),acceptedAt:t.acceptedAt||t.admittedAt||o},d={schema:Lt,status:"imported-admitted-remote-cache-result",
cacheKey:n,graphId:(e==null?void 0:e.graphId)||s.graphId||null,sourcePeerId:a.sourcePeerId||t.sourcePeerId||null,responderId:a.
responderId||t.responderId||null,requestId:a.requestId||t.requestId||null,admissionId:t.admissionId||null,importedAt:o,remoteArtifactStatus:s.
status||null,remoteArtifactAdmitted:s.admitted===!0,retainedGpuLaneRefs:u,retainedGpuLaneRefsStatus:u.status,resultHash:s.
resultHash||null,inputHash:s.inputHash||(e==null?void 0:e.cacheInputHash)||null},h={...B(s),cacheKey:n,status:"admitted-\
remote-cache-artifact-recorded",admitted:!0,admission:m,stateAdmission:B(t),remoteCacheImport:d,remoteGraphLeaseRefs:u},
f={...B(e),cacheKey:n,cacheAdmission:m,cacheAdmissionStatus:m.status,cacheArtifact:B(h),cacheArtifactStatus:h.status,cacheArtifactSchema:h.
schema||null,cacheStatus:"remote-imported",cacheHit:!1,remoteTaskGraphCacheImport:d,remoteGraphLeaseRefs:u};return this.
taskGraphCacheArtifacts.set(n,B(h)),this.taskGraphCache.set(n,{storedAt:i,expiresAt:l,artifact:B(h),result:B(f)}),this.stats.
taskGraphRemoteCacheImports+=1,B(d)}evaluateRemoteTaskGraphStateSeedPolicy(e,t={}){var C,v,j,V,re,ae,ne,ee,S,I,$,H,F,se,
X,de,oe,ie,le;const a=e&&typeof e=="object"?e:t,s=String(typeof e=="string"?e:(a==null?void 0:a.cacheKey)||"").trim(),n=Date.
now(),o=s&&this.taskGraphCache.get(s)||null,i=s&&(this.taskGraphCacheArtifacts.get(s)||(o==null?void 0:o.artifact))||null,
l=(o==null?void 0:o.result)||null,c=(l==null?void 0:l.remoteTaskGraphCacheImport)||(i==null?void 0:i.remoteCacheImport)||
null,u=P(l==null?void 0:l.stateSeedPayload,l==null?void 0:l.stateSeed,l==null?void 0:l.warmStateSeed,i==null?void 0:i.stateSeedPayload,
i==null?void 0:i.stateSeed,(C=i==null?void 0:i.outputs)==null?void 0:C.stateSeed,a==null?void 0:a.stateSeedPayload,a==null?
void 0:a.stateSeed),m=(l==null?void 0:l.remoteGraphLeaseRefs)||(i==null?void 0:i.remoteGraphLeaseRefs)||(c==null?void 0:
c.retainedGpuLaneRefs)||null,d=ve((v=l==null?void 0:l.cacheInputs)==null?void 0:v.stateFamilies,(V=(j=l==null?void 0:l.cachePolicy)==
null?void 0:j.inputs)==null?void 0:V.stateFamilies,(re=i==null?void 0:i.inputs)==null?void 0:re.stateFamilies,(ae=i==null?
void 0:i.cacheInputs)==null?void 0:ae.stateFamilies,a==null?void 0:a.stateFamilies),h=ve((ne=l==null?void 0:l.cacheInputs)==
null?void 0:ne.readFamilies,(S=(ee=l==null?void 0:l.cachePolicy)==null?void 0:ee.inputs)==null?void 0:S.readFamilies,(I=
i==null?void 0:i.inputs)==null?void 0:I.readFamilies,($=i==null?void 0:i.cacheInputs)==null?void 0:$.readFamilies,a==null?
void 0:a.readFamilies),f=ve((H=l==null?void 0:l.cacheInputs)==null?void 0:H.writeFamilies,(se=(F=l==null?void 0:l.cachePolicy)==
null?void 0:F.inputs)==null?void 0:se.writeFamilies,(X=i==null?void 0:i.inputs)==null?void 0:X.writeFamilies,(de=i==null?
void 0:i.cacheInputs)==null?void 0:de.writeFamilies,a==null?void 0:a.writeFamilies),y=D((a==null?void 0:a.allowedStateFamilies)??
(a==null?void 0:a.allowedFamilies),[]),p=ve(m==null?void 0:m.retainedBufferRefs,(oe=l==null?void 0:l.graphLeaseSpec)==null?
void 0:oe.retainedBufferRefs,(ie=l==null?void 0:l.cacheInputs)==null?void 0:ie.retainedBufferRefs,(le=i==null?void 0:i.inputs)==
null?void 0:le.retainedBufferRefs,a==null?void 0:a.retainedBufferRefs),k=(m==null?void 0:m.usableLocally)===!0&&(m==null?
void 0:m.remoteOnly)!==!0,E=(c==null?void 0:c.schema)===Lt||(l==null?void 0:l.cacheStatus)==="remote-imported"||(i==null?
void 0:i.status)==="admitted-remote-cache-artifact-recorded",_=(i==null?void 0:i.admitted)===!0,w=(a==null?void 0:a.requireStateFamilies)!==
!1,g=y.length>0?d.filter(be=>!y.includes(be)):[];let R="state-family-not-evaluated";d.length===0?R=w?"state-family-missi\
ng":"state-family-not-declared":y.length===0?R="state-family-policy-not-declared":g.length>0?R="state-family-blocked":R=
"state-family-allowed";let b="policy-ready",M="remote-cache-import-admitted-for-local-policy";s?!o&&!i?(b="blocked-cache\
-miss",M="cache-entry-not-found"):_?E?R==="state-family-missing"?(b="blocked-missing-state-families",M="remote-import-di\
d-not-declare-state-families"):R==="state-family-policy-not-declared"?(b="blocked-missing-state-family-policy",M="allowe\
d-state-family-policy-is-required"):R==="state-family-blocked"&&(b="blocked-state-family-policy",M="remote-import-declar\
es-state-families-outside-policy"):(b="blocked-not-remote-import",M="cache-entry-did-not-originate-from-admitted-remote-\
task-graph-import"):(b="blocked-unadmitted-cache-artifact",M="cache-artifact-is-not-admitted"):(b="blocked-no-cache-key",
M="remote-state-seed-policy-requires-cache-key");const L=b==="policy-ready",x=(a==null?void 0:a.allowWarmStateSeed)===!0,
T=(a==null?void 0:a.allowHotBufferRefresh)===!0,O=x?L?"warm-state-seed-allowed":"warm-state-seed-blocked":"warm-state-se\
ed-not-requested";let q=T?"no-retained-buffer-refs":"hot-buffer-refresh-not-requested";return T&&!L?q="hot-buffer-refres\
h-blocked":T&&p.length>0&&k?q="local-buffer-refs-usable":T&&p.length>0&&(q="local-refresh-required"),{schema:va,status:b,
reason:M,cacheKey:s||null,requestedAt:n,cacheEntryPresent:o!=null,artifactPresent:i!=null,admitted:_,remoteImported:E,importStatus:(c==
null?void 0:c.status)||null,importSchema:(c==null?void 0:c.schema)||null,importReport:c?B(c):null,stateFamilies:d,readFamilies:h,
writeFamilies:f,stateSeedPayloadAvailable:u!=null,stateSeedPayload:u!=null?B(u):null,allowedStateFamilies:y,disallowedStateFamilies:g,
stateFamilyStatus:R,warmStateSeedRequested:x,warmStateSeedStatus:O,hotBufferRefreshRequested:T,hotBufferRefreshStatus:q,
retainedBufferRefs:p,remoteRetainedRefsUsableLocally:k,remoteGraphLeaseRefs:m?B(m):null}}admitTaskGraphCacheArtifact(e,t={}){
const a=e&&typeof e=="object"?e:t,s=String(typeof e=="string"?e:(a==null?void 0:a.cacheKey)||"").trim();if(!s)throw new Error(
"admitTaskGraphCacheArtifact requires a cacheKey");const n=this.taskGraphCache.get(s),o=this.taskGraphCacheArtifacts.get(
s)||(n==null?void 0:n.artifact)||null;if(!o)return null;const i=B(a||{}),l=i.admittedAt||i.acceptedAt||Date.now(),c={schema:ct,
status:"admitted",admitted:!0,authority:i.authority||"state-manager",admissionId:i.admissionId||null,validatorId:i.validatorId||
null,reason:i.reason||"state-manager-cache-artifact-admitted",invalidationRefs:D(i.invalidationRefs),acceptedAt:l},u=o.admitted===
!0,m={...B(o),status:"admitted-cache-artifact-recorded",admitted:!0,admission:c,stateAdmission:i};if(this.taskGraphCacheArtifacts.
set(s,B(m)),n){const d=B(n.result||{});d.cacheAdmission=c,d.cacheAdmissionStatus=c.status,d.cacheArtifact=B(m),d.cacheArtifactStatus=
m.status,d.cacheArtifactSchema=m.schema||null,this.taskGraphCache.set(s,{...n,artifact:B(m),result:d})}return u||(this.stats.
taskGraphCacheArtifactsAdmitted+=1),B(m)}invalidateTaskGraphCacheArtifact(e,t={}){const a=e&&typeof e=="object"?e:t,s=String(
typeof e=="string"?e:(a==null?void 0:a.cacheKey)||"").trim();if(!s)throw new Error("invalidateTaskGraphCacheArtifact req\
uires a cacheKey");const n=B(a||{}),o=this.taskGraphCache.get(s),i=this.taskGraphCacheArtifacts.get(s)||(o==null?void 0:
o.artifact)||null;if(this.taskGraphCache.delete(s),this.stats.taskGraphCacheInvalidations+=1,!i)return{cacheKey:s,status:"\
invalidated",admitted:!1,invalidation:n};const l={...B(i),status:"invalidated",admitted:!1,invalidation:n,invalidatedAt:n.
invalidatedAt||Date.now()};return this.taskGraphCacheArtifacts.set(s,B(l)),B(l)}configurePlacementHooks(e={}){var m,d,h,
f,y,p;const t=k=>Object.prototype.hasOwnProperty.call(e,k),a=(...k)=>{for(const E of k)if(t(E))return{found:!0,value:e[E]};
return{found:!1,value:void 0}},s=a("placementExecutor","remotePlacementExecutor","executor");s.found?(this.placementExecutor=
typeof s.value=="function"||(m=s.value)!=null&&m.submitTask?s.value:null,this.placementExecutorId=e.placementExecutorId||
e.remotePlacementExecutorId||e.executorId||Xe(this.placementExecutor)):(t("placementExecutorId")||t("remotePlacementExec\
utorId")||t("executorId"))&&(this.placementExecutorId=e.placementExecutorId||e.remotePlacementExecutorId||e.executorId||
Xe(this.placementExecutor));const n=a("placementAdmission","remotePlacementAdmission","admission");n.found?(this.placementAdmission=
typeof n.value=="function"||(d=n.value)!=null&&d.admitTask?n.value:null,this.placementAdmissionId=e.placementAdmissionId||
e.remotePlacementAdmissionId||e.admissionId||Ze(this.placementAdmission)):(t("placementAdmissionId")||t("remotePlacement\
AdmissionId")||t("admissionId"))&&(this.placementAdmissionId=e.placementAdmissionId||e.remotePlacementAdmissionId||e.admissionId||
Ze(this.placementAdmission));const o=a("placementResultValidator","remotePlacementResultValidator","resultValidator","va\
lidator");o.found?(this.placementResultValidator=typeof o.value=="function"||(h=o.value)!=null&&h.validateTaskResult||(f=
o.value)!=null&&f.validateResult?o.value:null,this.placementResultValidatorId=e.placementResultValidatorId||e.remotePlacementResultValidatorId||
e.resultValidatorId||e.validatorId||et(this.placementResultValidator)):(t("placementResultValidatorId")||t("remotePlacem\
entResultValidatorId")||t("resultValidatorId")||t("validatorId"))&&(this.placementResultValidatorId=e.placementResultValidatorId||
e.remotePlacementResultValidatorId||e.resultValidatorId||e.validatorId||et(this.placementResultValidator));const i=a("pl\
acementTaskSigner","remoteTaskSigner","taskSigner","signer");i.found?(this.placementTaskSigner=typeof i.value=="function"||
(y=i.value)!=null&&y.signTaskPacket||(p=i.value)!=null&&p.signEnvelope?i.value:null,this.placementTaskSignerId=e.placementTaskSignerId||
e.remoteTaskSignerId||e.taskSignerId||e.signerId||tt(this.placementTaskSigner)):(t("placementTaskSignerId")||t("remoteTa\
skSignerId")||t("taskSignerId")||t("signerId"))&&(this.placementTaskSignerId=e.placementTaskSignerId||e.remoteTaskSignerId||
e.taskSignerId||e.signerId||tt(this.placementTaskSigner)),(t("placementTimeoutMs")||t("remotePlacementTimeoutMs"))&&(this.
placementTimeoutMs=A(e.placementTimeoutMs??e.remotePlacementTimeoutMs,this.placementTimeoutMs,0,36e5)),(t("remoteResultV\
erification")||t("placementResultVerification"))&&(this.remoteResultVerification=e.remoteResultVerification!==!1&&e.placementResultVerification!==
!1);const l={...this.placementRetryPolicy},c=e.placementRetryPolicy||e.remotePlacementRetryPolicy||{},u=k=>Object.prototype.
hasOwnProperty.call(c,k)||Object.prototype.hasOwnProperty.call(e,k);return(u("maxAttempts")||u("placementMaxAttempts")||
u("remotePlacementMaxAttempts"))&&(l.maxAttempts=A(c.maxAttempts??e.placementMaxAttempts??e.remotePlacementMaxAttempts,l.
maxAttempts,1,100)),(u("baseDelayMs")||u("placementRetryBaseDelayMs")||u("remotePlacementRetryBaseDelayMs"))&&(l.baseDelayMs=
A(c.baseDelayMs??e.placementRetryBaseDelayMs??e.remotePlacementRetryBaseDelayMs,l.baseDelayMs,0,6e5)),(u("maxDelayMs")||
u("placementRetryMaxDelayMs")||u("remotePlacementRetryMaxDelayMs"))&&(l.maxDelayMs=A(c.maxDelayMs??e.placementRetryMaxDelayMs??
e.remotePlacementRetryMaxDelayMs,l.maxDelayMs,0,6e5)),(u("jitterFraction")||u("placementRetryJitterFraction")||u("remote\
PlacementRetryJitterFraction"))&&(l.jitterFraction=Q(c.jitterFraction??e.placementRetryJitterFraction??e.remotePlacementRetryJitterFraction,
l.jitterFraction,0,1)),(u("retryableErrorKinds")||u("placementRetryableErrorKinds")||u("remotePlacementRetryableErrorKin\
ds"))&&(l.retryableErrorKinds=D(c.retryableErrorKinds??e.placementRetryableErrorKinds??e.remotePlacementRetryableErrorKinds,
l.retryableErrorKinds||pe)),this.placementRetryPolicy=this._getPlacementRetryPolicyReport(l),this.getCapabilities()}getCapabilities(){
var e,t,a,s;return{...this.capabilities,resourceProfile:this.getResourceProfile(),hardwareCapabilities:this.getHardwareCapabilities(),
benchmarkSummary:this.benchmarkResult?{schema:this.benchmarkResult.schema,performanceClass:this.benchmarkResult.performanceClass,
scores:this.benchmarkResult.scores,recommendedWorkerCount:this.benchmarkResult.recommendedWorkerCount,gpuBandwidthGBps:((t=
(e=this.benchmarkResult.metrics)==null?void 0:e.gpu)==null?void 0:t.memoryBandwidthGBps)??null,gpuReadbackMs:((s=(a=this.
benchmarkResult.metrics)==null?void 0:a.gpu)==null?void 0:s.readbackLatencyMs)??null,fromCache:this.benchmarkResult.fromCache===
!0,hardwareFingerprint:this.benchmarkResult.hardwareFingerprint||null}:null,workerPolicy:this.getWorkerPolicy(),workers:this.
workers.length,targetWorkers:this.targetWorkerCount,minWorkers:this.workerPolicy.minWorkers,maxWorkers:this.workerPolicy.
maxWorkers,solverCount:this.solverRegistry.list().length,placementExecutor:!!this.placementExecutor,placementExecutorId:this.
placementExecutorId,placementAdmission:!!this.placementAdmission,placementAdmissionId:this.placementAdmissionId,placementResultValidator:!!this.
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
byTaskFamily))}}_getPlacementRetryPolicyReport(e=this.placementRetryPolicy){return{schema:ye,maxAttempts:A(e==null?void 0:
e.maxAttempts,1,1,100),baseDelayMs:A(e==null?void 0:e.baseDelayMs,0,0,6e5),maxDelayMs:A(e==null?void 0:e.maxDelayMs,0,0,
6e5),jitterFraction:Q(e==null?void 0:e.jitterFraction,0,0,1),retryableErrorKinds:D(e==null?void 0:e.retryableErrorKinds,
pe),terminalErrorKinds:[...Ce]}}async _executeTask(e){}_scheduleNext(){}_handleTaskComplete(e,t){}_handleTaskError(e,t){}_supportsWorkers(){
return typeof Worker<"u"&&this.config.enableWorkers}_createRequiredWorkerError(e,t=null){const a=new Error(`ComputeManag\
er requires a bootstrapped browser worker: ${e}`);return a.name="RequiredWorkerUnavailableError",a.code="ERR_COMPUTE_REQ\
UIRED_WORKER_UNAVAILABLE",a.reason=e,t!=null&&(a.cause=t),a}_failRequiredWorkerPool(e){const t=(e==null?void 0:e.code)===
"ERR_COMPUTE_REQUIRED_WORKER_UNAVAILABLE"?e:this._createRequiredWorkerError((e==null?void 0:e.message)||String(e||"the r\
equired worker pool failed"),e);this.workerRequirementError=t,this.initialized=!1,clearTimeout(this.scaleDownTimer),this.
scaleDownTimer=null;for(const a of[...this.workers])this._markWorkerBootstrapFailed(a,t),this._removeWorker(a);for(const[
a,s]of this.activeTasks.entries())this.workers.includes(s.worker)||this.activeTasks.delete(a),this._rejectTaskGpuResidentLaneLease(
s,t.code),this._recordTaskCompletion(s,{ok:!1,mode:s.executionMode||"worker",errorKind:"required-worker-unavailable",errorMessage:t.
message}),s.reject(Object.assign(new Error(t.message),{name:t.name,code:t.code,workerTerminated:!this.workers.includes(s.
worker)}));return this._rejectQueuedTasksForRequiredWorkerFailure(t),t}_createWorkerBootstrapRecord(e){let t=null,a=null;
const s={status:"bootstrapping",startedAt:Z(),readyAt:null,reason:null,promise:null,resolve:null,reject:null,timeout:null,
messageErrorListener:null};if(s.promise=new Promise((n,o)=>{t=n,a=o}),s.promise.catch(()=>{}),s.resolve=t,s.reject=a,this.
workerBootstrap.set(e,s),this.config.requireWorkers){const n=this.config.workerBootstrapTimeoutMs;s.timeout=setTimeout(()=>{
s.status==="bootstrapping"&&this._handleWorkerFailure(e,this._createRequiredWorkerError(`worker bootstrap did not acknow\
ledge readiness within ${n}ms`))},n)}return s}_markWorkerBootstrapped(e){var a;const t=this.workerBootstrap.get(e);!t||t.
status!=="bootstrapping"||(clearTimeout(t.timeout),t.timeout=null,t.status="ready",t.readyAt=Z(),(a=t.resolve)==null||a.
call(t,e))}_markWorkerBootstrapFailed(e,t){var s;const a=this.workerBootstrap.get(e);!a||a.status!=="bootstrapping"||(clearTimeout(
a.timeout),a.timeout=null,a.status="failed",a.reason=(t==null?void 0:t.message)||String(t||"worker bootstrap failed"),(s=
a.reject)==null||s.call(a,t instanceof Error?t:this._createRequiredWorkerError(a.reason)))}_markWorkerBootstrapRetired(e){
var a;const t=this.workerBootstrap.get(e);!t||t.status!=="bootstrapping"||(clearTimeout(t.timeout),t.timeout=null,t.status=
"retired",t.reason="worker retired before bootstrap completed",(a=t.resolve)==null||a.call(t,e))}_getWorkerRequirementReport(){
var s;const e=this.workers.filter(n=>{var o;return((o=this.workerBootstrap.get(n))==null?void 0:o.status)==="ready"}).length,
t=this.workers.filter(n=>{var o;return((o=this.workerBootstrap.get(n))==null?void 0:o.status)==="bootstrapping"}).length,
a=this.config.requireWorkers===!0;return{required:a,status:this.workerRequirementError?"blocked":a?e>0&&e===this.workers.
length?"ready":"bootstrapping":"not-required",workerCount:this.workers.length,readyWorkerCount:e,bootstrappingWorkerCount:t,
reason:((s=this.workerRequirementError)==null?void 0:s.message)||null}}async _waitForRequiredWorkerBootstrap(){const e=this.
workers.map(t=>this.workerBootstrap.get(t)).filter(Boolean);if(e.length===0)throw this._createRequiredWorkerError("no br\
owser worker was registered during bootstrap");await Promise.all(e.map(t=>t.promise))}_rejectQueuedTasksForRequiredWorkerFailure(e){
var t;for(;this.taskQueue.length>0;){const a=this.taskQueue.shift();this._rejectTaskGpuResidentLaneLease(a,e.code||"requ\
ired-worker-unavailable"),this._recordTaskCompletion(a,{ok:!1,mode:"worker",errorKind:"required-worker-unavailable",errorMessage:e.
message}),a.reject(Object.assign(new Error(e.message),{name:e.name,code:e.code,workerTerminated:!this.workerAffinities.has(
(t=a.payload)==null?void 0:t.affinityKey)}))}}_canDispatchRemotePlacement(e={}){return!!this.placementExecutor&&e.advisoryOnly===
!1&&(e.requestedPlacement==="peer"||e.requestedPlacement==="cluster")}_createTaskPacket(e={},t={}){var l,c,u,m,d,h,f;const a={
runtime:e.runtime,module:e.module,hostModule:e.hostModule,exportName:e.exportName,hostExport:e.hostExport,fn:e.fn,wasm:e.
wasm,wasmSource:e.wasmSource,source:e.source},s={data:e.data,args:e.args,webgpu:e.webgpu,gpuFence:e.gpuFence,gpuResidentLane:e.
gpuResidentLane,placement:t},n=Ee(Re(a)),o=Ee(Re(s)),i=Ee(Re({codeHash:n,inputHash:o,id:e.id,runtime:e.runtime,taskFamily:e.
taskFamily,solverId:e.solverId,placement:(t==null?void 0:t.requestedPlacement)||null}));return{schema:Ft,taskId:e.id||null,
runtime:e.runtime||null,taskFamily:e.taskFamily||null,solverId:e.solverId||null,requestedPlacement:(t==null?void 0:t.requestedPlacement)||
null,gpuFenceRequired:((l=e.gpuFence)==null?void 0:l.required)===!0,gpuFenceSchema:((c=e.gpuFence)==null?void 0:c.schema)||
null,gpuLaneId:((u=e.gpuFence)==null?void 0:u.laneId)||null,gpuStateKey:((m=e.gpuFence)==null?void 0:m.stateKey)||null,gpuQueueFencePolicy:((d=
e.gpuFence)==null?void 0:d.queueFencePolicy)||null,gpuResidentLaneSchema:((h=e.gpuResidentLane)==null?void 0:h.schema)||
null,gpuResidentLaneLocalExecution:((f=e.gpuResidentLane)==null?void 0:f.localExecution)||null,codeHash:n,inputHash:o,taskHash:i,
hashAlgorithm:"fnv1a32-stable-json",generatedAt:Date.now()}}_normalizePlacementTaskSignature(e){if(e==null||e===!1)return{
signed:!1,reason:e===!1?"signer-declined":"no-signature"};if(typeof e=="string")return{signed:!0,signature:e,signatureAlgorithm:"\
custom-signature"};if(typeof e=="object"){const t=e.signature||e.value||null;return{...e,signed:e.signed!==!1&&!!t,signature:t,
signatureAlgorithm:e.signatureAlgorithm||e.algorithm||"custom-signature",reason:e.reason||(t?"signed":"no-signature")}}return{
signed:!0,signature:String(e),signatureAlgorithm:"custom-signature",reason:"signed"}}async _createTaskEnvelope(e,{mode:t=null}={}){
var u,m;const a=((u=e.payload)==null?void 0:u.taskPacket)||null,s=e.placement||((m=e.payload)==null?void 0:m.placement)||
null,n={schema:vt,taskPacketSchema:(a==null?void 0:a.schema)||null,taskPacket:a,mode:t,signed:!1,signerId:null,signature:null,
signatureAlgorithm:null,reason:"no-task-signer",createdAt:Date.now()};if(!this.placementTaskSigner)return n;const o={manager:this,
task:e,placement:s,payload:e.payload,taskPacket:a,mode:t},i=this.placementTaskSigner,l=typeof i=="function"?await i(a,o):
i.signTaskPacket?await i.signTaskPacket(a,o):await i.signEnvelope(n,o),c=this._normalizePlacementTaskSignature(l);return{
...n,...c,schema:c.schema||vt,taskPacket:a,signerId:c.signerId||this.placementTaskSignerId||"placement-task-signer",signedAt:c.
signedAt||Date.now()}}_normalizePlacementAdmissionResult(e){return e===!1?{accepted:!1,reason:"admission-denied"}:e==null||
e===!0?{accepted:!0,reason:"accepted"}:typeof e=="object"?{...e,accepted:e.accepted!==!1&&e.ok!==!1,reason:e.reason||(e.
accepted===!1||e.ok===!1?"admission-denied":"accepted")}:{accepted:!0,reason:String(e||"accepted")}}_normalizePlacementValidationResult(e){
return e===!1?{valid:!1,reason:"validation-denied"}:e==null||e===!0?{valid:!0,reason:"validated"}:typeof e=="object"?{...e,
valid:e.valid!==!1&&e.accepted!==!1&&e.ok!==!1,reason:e.reason||(e.valid===!1||e.accepted===!1||e.ok===!1?"validation-de\
nied":"validated")}:{valid:!0,reason:String(e||"validated")}}async _runPlacementAdmission(e,{mode:t=null}={}){var o,i,l;
if(!this.placementAdmission)return{accepted:!0,reason:"no-admission-hook",admissionId:null};const a={manager:this,task:e,
placement:e.placement||((o=e.payload)==null?void 0:o.placement)||null,payload:e.payload,taskPacket:((i=e.payload)==null?
void 0:i.taskPacket)||null,taskEnvelope:((l=e.payload)==null?void 0:l.taskEnvelope)||null,mode:t},s=typeof this.placementAdmission==
"function"?await this.placementAdmission(e.payload,a):await this.placementAdmission.admitTask(e.payload,a),n=this._normalizePlacementAdmissionResult(
s);return{...n,schema:n.schema||"peercompute.compute.placement-admission.v0",admissionId:n.admissionId||this.placementAdmissionId||
"placement-admission",mode:t,decidedAt:Date.now()}}async _runPlacementResultValidator(e,{mode:t=null,finalResult:a=null,
commitDelta:s=null,provenance:n=null}={}){var u,m,d;if(!this.placementResultValidator)return{schema:xt,valid:!0,reason:"\
no-result-validator",validationId:null,mode:t,decidedAt:Date.now()};const o={manager:this,task:e,placement:e.placement||
((u=e.payload)==null?void 0:u.placement)||null,payload:e.payload,taskPacket:((m=e.payload)==null?void 0:m.taskPacket)||null,
taskEnvelope:((d=e.payload)==null?void 0:d.taskEnvelope)||null,mode:t,finalResult:a,commitDelta:s,provenance:n},i=this.placementResultValidator,
l=typeof i=="function"?await i(a,o):i.validateTaskResult?await i.validateTaskResult(a,o):await i.validateResult(a,o),c=this.
_normalizePlacementValidationResult(l);return{...c,schema:c.schema||xt,validationId:c.validationId||this.placementResultValidatorId||
"placement-result-validator",mode:t,decidedAt:Date.now()}}_placementRejectedError(e,{mode:t}){const a=new Error(`Remote \
placement rejected for ${t}: ${(e==null?void 0:e.reason)||"admission-denied"}`);return a.name="PlacementAdmissionRejecte\
dError",a.code="ERR_COMPUTE_PLACEMENT_REJECTED",a.placementMode=t,a.reason=(e==null?void 0:e.reason)||"admission-denied",
a.admission=e||null,a}_placementValidationError(e,t,{mode:a}){const s=new Error(`Remote placement result validation fail\
ed for ${a}: ${(e==null?void 0:e.reason)||"validation-denied"}`);return s.name="PlacementResultValidationError",s.code="\
ERR_COMPUTE_PLACEMENT_VALIDATION",s.placementMode=a,s.reason=(e==null?void 0:e.reason)||"validation-denied",s.validation=
e||null,s.provenance=t||null,s}_placementTimeoutFor(e){var t,a,s;return A(((t=e.placement)==null?void 0:t.timeoutMs)??((s=
(a=e.payload)==null?void 0:a.placement)==null?void 0:s.timeoutMs)??this.placementTimeoutMs,this.placementTimeoutMs,0,36e5)}_placementRetryPolicyFor(e={}){
var l;const t=e.placement||((l=e.payload)==null?void 0:l.placement)||{},a=this.placementRetryPolicy||{},s=A(t.maxAttempts??
t.retryMaxAttempts??t.remoteMaxAttempts??t.remoteRetryMaxAttempts??a.maxAttempts,1,1,100),n=A(t.retryBaseDelayMs??t.remoteRetryBaseDelayMs??
a.baseDelayMs,0,0,6e5),o=A(t.retryMaxDelayMs??t.remoteRetryMaxDelayMs??a.maxDelayMs,n,0,6e5),i=Q(t.retryJitterFraction??
t.remoteRetryJitterFraction??a.jitterFraction,0,0,1);return this._getPlacementRetryPolicyReport({...a,maxAttempts:s,baseDelayMs:n,
maxDelayMs:o,jitterFraction:i,retryableErrorKinds:D(t.retryableErrorKinds??t.remoteRetryableErrorKinds??a.retryableErrorKinds,
pe)})}_placementErrorKind(e){return(e==null?void 0:e.code)==="ERR_COMPUTE_PLACEMENT_TIMEOUT"?"timeout":(e==null?void 0:e.
code)==="ERR_COMPUTE_PLACEMENT_REJECTED"?"rejected":(e==null?void 0:e.code)==="ERR_COMPUTE_PLACEMENT_VERIFICATION"?"veri\
fication-failed":(e==null?void 0:e.code)==="ERR_COMPUTE_PLACEMENT_VALIDATION"?"validation-failed":"executor-error"}_placementRetryDelayMs(e,t){
const a=A(t==null?void 0:t.baseDelayMs,0,0,6e5),s=A(t==null?void 0:t.maxDelayMs,a,0,6e5),n=Math.max(0,A(e,1,1,100)-1),o=Math.
min(s,a*2**n),i=Q(t==null?void 0:t.jitterFraction,0,0,1);if(i<=0||o<=0)return o;const l=o*i*Math.random();return Math.min(
s,Math.round(o+l))}_placementRetryDecision({attempt:e,errorKind:t,err:a,policy:s,mode:n}){const o=new Set(D(s==null?void 0:
s.retryableErrorKinds,pe)),i=new Set(Ce),l=A(s==null?void 0:s.maxAttempts,1,1,100),c=i.has(t),u=!c&&o.has(t),m=e<l,d=u&&
m;return{schema:ye,mode:n,attempt:e,nextAttempt:d?e+1:null,maxAttempts:l,errorKind:t,errorCode:(a==null?void 0:a.code)||
null,errorMessage:(a==null?void 0:a.message)||String(a||""),retryable:u,terminal:c,retryScheduled:d,exhausted:u&&l>1&&!m,
delayMs:d?this._placementRetryDelayMs(e,s):0,decidedAt:Date.now()}}_placementRetrySummary(e,{mode:t,ok:a=!0,errorKind:s=null}={}){
const n=Array.isArray(e.placementRetryEvents)?e.placementRetryEvents:[],o=e.placementRetryPolicy||this._placementRetryPolicyFor(
e),i=n.filter(c=>c.retryScheduled).length,l=n[n.length-1]||null;return{schema:ye,mode:t,maxAttempts:o.maxAttempts,attemptCount:A(
e.placementAttempt,i+1,0,100),retryCount:i,retried:i>0,retryableErrorKinds:D(o.retryableErrorKinds,pe),terminalErrorKinds:[
...Ce],exhausted:!a&&!!(l!=null&&l.exhausted),finalErrorKind:a?null:s||(l==null?void 0:l.errorKind)||null,events:JSON.parse(
JSON.stringify(n))}}_runPlacementExecutor(e,{signal:t=null,timeoutMs:a=this.placementTimeoutMs,mode:s=null,attempt:n=1,retryPolicy:o=null}={}){
var l,c,u;const i={manager:this,task:e,placement:e.placement||((l=e.payload)==null?void 0:l.placement)||null,payload:e.payload,
taskPacket:((c=e.payload)==null?void 0:c.taskPacket)||null,taskEnvelope:((u=e.payload)==null?void 0:u.taskEnvelope)||null,
signal:t,timeoutMs:a,mode:s,attempt:n,retryPolicy:o};return typeof this.placementExecutor=="function"?this.placementExecutor(
e.payload,i):this.placementExecutor.submitTask(e.payload,i)}_runPlacementExecutorWithTimeout(e,{mode:t,attempt:a=1,retryPolicy:s=null}={}){
const n=this._placementTimeoutFor(e),o=typeof AbortController<"u"?new AbortController:null,i=Promise.resolve().then(()=>this.
_runPlacementExecutor(e,{signal:(o==null?void 0:o.signal)||null,timeoutMs:n,mode:t,attempt:a,retryPolicy:s}));if(n<=0)return i;
let l=null;const c=new Promise((u,m)=>{l=setTimeout(()=>{var h;const d=new Error(`Placement executor timed out after ${n}\
ms for ${t}`);d.name="PlacementExecutorTimeoutError",d.code="ERR_COMPUTE_PLACEMENT_TIMEOUT",d.timeoutMs=n,d.placementMode=
t;try{(h=o==null?void 0:o.abort)==null||h.call(o,d)}catch{}m(d)},n)});return Promise.race([i,c]).finally(()=>{l!=null&&clearTimeout(
l)})}_normalizeRemotePlacementProvenance(e,{task:t,mode:a,result:s,finalResult:n,startedAt:o=null,completedAtMs:i=null,completedAt:l=Date.
now()}={}){var w,g,R,b,M;const c=e&&typeof e=="object"?e:{},u=(t==null?void 0:t.payload)||{},m=(t==null?void 0:t.placement)||
u.placement||{},d=Number.isFinite(Number(c.durationMs))?Number(c.durationMs):Number.isFinite(Number(c.roundTripMs))?Number(
c.roundTripMs):Number.isFinite(Number(o))&&Number.isFinite(Number(i))?Math.max(0,Number(i)-Number(o)):null,h=s&&typeof s==
"object"?s:{},f=n&&typeof n=="object"?n:{},y=(t==null?void 0:t.placementAdmission)||null,p=u.taskPacket||null,k=u.taskEnvelope||
null,E=as(c.replicas||c.replicaResults||((w=c.quorum)==null?void 0:w.replicas)||h.replicas||h.replicaResults),_=Fe(c.gpuFence||
c.gpuFenceReport||h.gpuFence||h.gpuFenceReport||f.gpuFence||f.gpuFenceReport||((g=c.remoteExecution)==null?void 0:g.gpuFence)||
((R=c.remoteExecution)==null?void 0:R.gpuFenceReport)||((M=(b=c.remoteExecution)==null?void 0:b.computeExecution)==null?
void 0:M.gpuFence),u.gpuFence||(p==null?void 0:p.gpuFence)||null);return{schema:_a,taskPacketSchema:(p==null?void 0:p.schema)||
null,taskEnvelopeSchema:(k==null?void 0:k.schema)||null,taskSigned:(k==null?void 0:k.signed)===!0,signerId:c.signerId||(k==
null?void 0:k.signerId)||null,signatureAlgorithm:c.signatureAlgorithm||(k==null?void 0:k.signatureAlgorithm)||null,mode:a,
executorId:c.executorId||this.placementExecutorId||"placement-executor",promotedReplicaExecutorId:c.promotedReplicaExecutorId||
null,admissionId:(y==null?void 0:y.admissionId)||null,admissionReason:(y==null?void 0:y.reason)||null,requestedPlacement:m.
requestedPlacement||null,taskId:u.id||(t==null?void 0:t.id)||null,taskFamily:u.taskFamily||(t==null?void 0:t.taskFamily)||
null,solverId:u.solverId||m.solverId||null,solverKey:m.solverKey||null,peerId:c.peerId||c.remotePeerId||null,targetPeerId:c.
targetPeerId||null,transportPeerId:c.transportPeerId||null,responderNodeId:c.responderNodeId||null,responderPeerId:c.responderPeerId||
null,requesterId:c.requesterId||null,requestId:c.requestId||null,clusterId:c.clusterId||null,workerId:c.workerId||c.remoteWorkerId||
null,remoteExecution:c.remoteExecution&&typeof c.remoteExecution=="object"?JSON.parse(JSON.stringify(c.remoteExecution)):
null,gpuFence:_,gpuFenceStatus:(_==null?void 0:_.status)??null,gpuFenceSatisfied:(_==null?void 0:_.fenceSatisfied)??!1,codeHash:c.
codeHash||h.codeHash||(p==null?void 0:p.codeHash)||null,inputHash:c.inputHash||h.inputHash||(p==null?void 0:p.inputHash)||
null,taskHash:c.taskHash||h.taskHash||(p==null?void 0:p.taskHash)||null,outputHash:c.outputHash||h.outputHash||null,resultHash:c.
resultHash||h.resultHash||c.outputHash||h.outputHash||null,commitDeltaHash:c.commitDeltaHash||h.commitDeltaHash||c.deltaHash||
h.deltaHash||null,resultSchema:c.resultSchema||f.schema||h.schema||null,role:c.role||null,trustLevel:c.trustLevel||"inje\
cted-executor",redundantPlacement:c.redundantPlacement&&typeof c.redundantPlacement=="object"?JSON.parse(JSON.stringify(
c.redundantPlacement)):null,primary:c.primary&&typeof c.primary=="object"?JSON.parse(JSON.stringify(c.primary)):null,primaryFailure:c.
primaryFailure&&typeof c.primaryFailure=="object"?JSON.parse(JSON.stringify(c.primaryFailure)):null,promotedReplica:c.promotedReplica&&
typeof c.promotedReplica=="object"?JSON.parse(JSON.stringify(c.promotedReplica)):null,replicaSuccessCount:A(c.replicaSuccessCount,
0,0,1e6),replicaFailureCount:A(c.replicaFailureCount,0,0,1e6),redundantReplicaCount:A(c.redundantReplicaCount??E.length,
E.length,0,1e6),replicaCount:E.length,quorumReplicaCount:A(c.quorumReplicaCount??E.length,E.length,0,1e6),replicas:E,validated:c.
validated===!0,durationMs:d==null?null:Number(d.toFixed(3)),completedAt:l}}_verifyRemotePlacementProvenance(e={},t={}){var l,
c,u;const a=((l=t==null?void 0:t.payload)==null?void 0:l.taskPacket)||null,s=Date.now();if(!this.remoteResultVerification)
return{schema:Ve,verified:!0,skipped:!0,reason:"verification-disabled",checkedAt:s};if(!a||a.schema!==Ft)return{schema:Ve,
verified:!1,skipped:!1,reason:"task-packet-missing",taskPacketSchema:(a==null?void 0:a.schema)||null,mismatchFields:["ta\
skPacket"],checks:[],checkedAt:s};const n=["codeHash","inputHash","taskHash"].map(m=>{const d=a[m]||null,h=(e==null?void 0:
e[m])||null;return{field:m,expected:d,actual:h,ok:!!d&&d===h}});a.gpuFenceRequired===!0&&n.push({field:"gpuFence",expected:"\
fence-satisfied",actual:((c=e==null?void 0:e.gpuFence)==null?void 0:c.status)||null,ok:((u=e==null?void 0:e.gpuFence)==null?
void 0:u.fenceSatisfied)===!0});const o=n.filter(m=>!m.ok).map(m=>m.field),i=o.length===0?"hashes-match":o.includes("gpu\
Fence")?"gpu-fence-missing-or-unsatisfied":"hash-mismatch";return{schema:Ve,verified:o.length===0,skipped:!1,reason:i,taskPacketSchema:a.
schema,hashAlgorithm:a.hashAlgorithm||null,mismatchFields:o,checks:n,checkedAt:s}}_placementVerificationError(e,t,{mode:a}){
const s=new Error(`Remote placement verification failed for ${a}: ${(e==null?void 0:e.reason)||"hash-mismatch"}`);return s.
name="PlacementResultVerificationError",s.code="ERR_COMPUTE_PLACEMENT_VERIFICATION",s.placementMode=a,s.reason=(e==null?
void 0:e.reason)||"hash-mismatch",s.verification=e||null,s.provenance=t||null,s}_unwrapPlacementExecutorResult(e,t,{mode:a,
startedAt:s}){let n=e,o=null,i=null;if(e&&typeof e=="object"){Object.prototype.hasOwnProperty.call(e,"commitDelta")&&(o=
e.commitDelta),i=e.provenance||e.remoteProvenance||e.placementProvenance||null;const d=Object.prototype.hasOwnProperty.call(
e,"commitDelta")||i||Object.prototype.hasOwnProperty.call(e,"remoteProvenance")||Object.prototype.hasOwnProperty.call(e,
"placementProvenance");d&&Object.prototype.hasOwnProperty.call(e,"value")?n=e.value:d&&Object.prototype.hasOwnProperty.call(
e,"result")&&(n=e.result)}const l=Date.now(),c=Z(),u=this._normalizeRemotePlacementProvenance(i,{task:t,mode:a,result:e,
finalResult:n,startedAt:s,completedAtMs:c,completedAt:l}),m=this._verifyRemotePlacementProvenance(u,t);if(u.verification=
m,u.verified=m.verified,!m.verified)throw this._placementVerificationError(m,u,{mode:a});return{finalResult:n,commitDelta:o,
provenance:u}}async _runRemotePlacementWithRetries(e,{mode:t}){const a=this._placementRetryPolicyFor(e);e.placementRetryPolicy=
a,e.placementRetryEvents=[];for(let n=1;n<=a.maxAttempts;n+=1){e.placementAttempt=n,this._recordPlacementAttempt(e,{mode:t,
attempt:n,retryPolicy:a});const o=Z();try{const i=await this._runPlacementExecutorWithTimeout(e,{mode:t,attempt:n,retryPolicy:a}),
{finalResult:l,commitDelta:c,provenance:u}=this._unwrapPlacementExecutorResult(i,e,{mode:t,startedAt:o}),m=await this._runPlacementResultValidator(
e,{mode:t,finalResult:l,commitDelta:c,provenance:u});if(u.validation=m,!m.valid)throw this._placementValidationError(m,u,
{mode:t});return u.retry=this._placementRetrySummary(e,{mode:t,ok:!0}),{finalResult:l,commitDelta:c,provenance:u}}catch(i){
const l=this._placementErrorKind(i),c=this._placementRetryDecision({attempt:n,errorKind:l,err:i,policy:a,mode:t});if(i.retry=
c,e.placementRetryEvents.push(c),!c.retryScheduled)throw i;this._recordPlacementRetry(e,{mode:t,retry:c}),await ja(c.delayMs)}}
const s=new Error(`Remote placement exhausted retry policy for ${t}`);throw s.name="PlacementRetryExhaustedError",s.code=
"ERR_COMPUTE_PLACEMENT_RETRY_EXHAUSTED",s.placementMode=t,s.retry=this._placementRetrySummary(e,{mode:t,ok:!1,errorKind:"\
executor-error"}),s}_dispatchToPlacementExecutor(e){var n;const t=e.placement||((n=e.payload)==null?void 0:n.placement)||
{};if(!this._canDispatchRemotePlacement(t))return!1;const a=`remote-${t.requestedPlacement}`;e.payload.taskPacket=this._createTaskPacket(
e.payload,t);const s={...e,startedAt:Z(),executionMode:a,placementExecutorId:this.placementExecutorId,placementAdmissionId:this.
placementAdmissionId,placementAdmission:null};return this.activeTasks.set(e.id,s),Promise.resolve().then(()=>this._createTaskEnvelope(
s,{mode:a})).then(o=>(s.payload.taskEnvelope=o,null)).then(()=>this._runPlacementAdmission(s,{mode:a})).then(o=>{if(s.placementAdmission=
o,!o.accepted)throw this._placementRejectedError(o,{mode:a});return null}).then(()=>this._runRemotePlacementWithRetries(
s,{mode:a})).then(({finalResult:o,commitDelta:i,provenance:l})=>{i&&this.commitDelta(i),this._recordTaskCompletion(s,{ok:!0,
mode:a,provenance:l,admission:s.placementAdmission,retry:l.retry||this._placementRetrySummary(s,{mode:a,ok:!0})}),s.resolve(
o)}).catch(o=>{var c;const i=this._placementErrorKind(o),l=((c=o==null?void 0:o.retry)==null?void 0:c.schema)===ye?this.
_placementRetrySummary(s,{mode:a,ok:!1,errorKind:i}):null;this._recordTaskCompletion(s,{ok:!1,mode:a,errorKind:i,errorMessage:(o==
null?void 0:o.message)||String(o),admission:s.placementAdmission||(o==null?void 0:o.admission)||null,provenance:(o==null?
void 0:o.provenance)||null,retry:l}),s.reject(o)}).finally(()=>{this.activeTasks.delete(e.id),this._scheduleIdleScaleDown(),
this._scheduleNext()}),!0}_spawnWorker(){try{const e=this.workerBootstrapURL?new Worker(this.workerBootstrapURL,{type:"m\
odule"}):Ma();this._createWorkerBootstrapRecord(e);const t=this.nextWorkerOrdinal;this.nextWorkerOrdinal+=1;const a=`wor\
ker-${t}`;if(this.workerIds.set(e,a),this.workerUtilization.set(a,rt({executorId:a,kind:"worker",ordinal:t,status:"activ\
e"})),e.onmessage=s=>this._handleWorkerMessage(e,s.data),e.onerror=s=>this._handleWorkerFailure(e,s),typeof e.addEventListener==
"function"){const s=this.workerBootstrap.get(e),n=o=>this._handleWorkerFailure(e,o);s&&(s.messageErrorListener=n),e.addEventListener(
"messageerror",n)}return this.workers.push(e),e}catch(e){return this.workerSpawnFailures+=1,this.config.requireWorkers?(this.
_failRequiredWorkerPool(this._createRequiredWorkerError("constructing a browser worker threw",e)),null):(console.warn("[\
ComputeManager] Failed to start worker; falling back to inline execution",e),null)}}_workerId(e){return this.workerIds.get(
e)||null}_executorStats(e,{kind:t="worker",ordinal:a=null,status:s="active"}={}){const n=String(e||this.inlineExecutorId);
return this.workerUtilization.has(n)||this.workerUtilization.set(n,rt({executorId:n,kind:t,ordinal:a,status:s})),this.workerUtilization.
get(n)}_executorBucket(e,t){const a=String(t||"unknown");return e[a]||(e[a]=Ye()),e[a]}_recordExecutorStart(e,t,{kind:a="\
worker"}={}){var i,l;const s=this._executorStats(e,{kind:a}),n=t.runtime||((i=t.payload)==null?void 0:i.runtime)||"unkno\
wn",o=t.taskFamily||((l=t.payload)==null?void 0:l.taskFamily)||"unknown";s.status=s.status==="retired"?"retired":"active",
s.activeTaskCount+=1,s.submitted+=1,s.lastRuntime=n,s.lastTaskFamily=o,s.lastStartedAt=Date.now(),this._executorBucket(s.
byRuntime,n).submitted+=1,this._executorBucket(s.byTaskFamily,o).submitted+=1,t.executorId=s.executorId,t.executorActive=
!0}_recordExecutorCompletion(e,{ok:t=!0,durationMs:a=0}={}){var d,h;const s=e.executorId;if(!s)return;const n=this.workerUtilization.
get(s);if(!n)return;e.executorActive&&(n.activeTaskCount=Math.max(0,n.activeTaskCount-1),e.executorActive=!1);const o=e.
runtime||((d=e.payload)==null?void 0:d.runtime)||"unknown",i=e.taskFamily||((h=e.payload)==null?void 0:h.taskFamily)||"u\
nknown",l=this._executorBucket(n.byRuntime,o),c=this._executorBucket(n.byTaskFamily,i);t?(n.completed+=1,l.completed+=1,
c.completed+=1):(n.failed+=1,l.failed+=1,c.failed+=1);const u=Number(Math.max(0,a).toFixed(3));n.totalDurationMs+=a,n.lastDurationMs=
u,n.maxDurationMs=Math.max(n.maxDurationMs,u);const m=n.completed+n.failed;n.averageDurationMs=m>0?Number((n.totalDurationMs/
m).toFixed(3)):0,n.lastRuntime=o,n.lastTaskFamily=i,n.lastCompletedAt=Date.now();for(const f of[l,c]){f.totalDurationMs+=
a,f.lastDurationMs=u,f.maxDurationMs=Math.max(f.maxDurationMs,u);const y=f.completed+f.failed;f.averageDurationMs=y>0?Number(
(f.totalDurationMs/y).toFixed(3)):0}}_recordExecutorAbandon(e){const t=e.executorId;if(!t||!e.executorActive)return;const a=this.
workerUtilization.get(t);a&&(a.activeTaskCount=Math.max(0,a.activeTaskCount-1),a.abandoned+=1,e.executorActive=!1)}_cloneExecutorStats(e){
return JSON.parse(JSON.stringify({...e,activeTaskCount:Math.max(0,e.activeTaskCount||0)}))}_getWorkerUtilizationReport(){
const e=Array.from(this.workerUtilization.values()).filter(m=>m.kind==="worker").sort((m,d)=>(m.ordinal??0)-(d.ordinal??
0)).map(m=>this._cloneExecutorStats(m)),t=this._cloneExecutorStats(this._executorStats(this.inlineExecutorId,{kind:"inli\
ne",ordinal:0})),a=e.filter(m=>m.status==="active"),s=e.filter(m=>m.status==="retired"),n=[t,...e],o=e.reduce((m,d)=>m+(d.
activeTaskCount||0),0),i=n.reduce((m,d)=>m+(d.submitted||0),0),l=n.reduce((m,d)=>m+(d.completed||0),0),c=n.reduce((m,d)=>m+
(d.failed||0),0),u=[...n].sort((m,d)=>(d.activeTaskCount||0)-(m.activeTaskCount||0)||(d.completed||0)-(m.completed||0)||
(d.submitted||0)-(m.submitted||0))[0]||t;return{schema:Aa,generatedAt:Date.now(),inline:t,workers:e,summary:{workerCount:this.
workers.length,activeWorkerCount:a.length,retiredWorkerCount:s.length,retainedWorkerCount:e.length,inlineActiveTaskCount:t.
activeTaskCount||0,workerActiveTaskCount:o,activeTaskCount:o+(t.activeTaskCount||0),totalSubmitted:i,totalCompleted:l,totalFailed:c,
busiestExecutorId:u.executorId||null,busiestActiveTaskCount:u.activeTaskCount||0,busiestCompleted:u.completed||0}}}_placementBucket(e,t){
const a=String(t||"unknown");return e[a]||(e[a]=Ha()),e[a]}_normalizeTaskPlacement(e={},{runtime:t="unknown",taskFamily:a="\
unknown"}={}){var i,l,c,u,m,d,h,f;const s=e.placementHint||e.placement||((i=e.data)==null?void 0:i.placementHint)||((l=e.
data)==null?void 0:l.placement)||((u=(c=e.data)==null?void 0:c.solver)==null?void 0:u.placementHint)||null,n=(s==null?void 0:
s.recommendedPlacement)||(s==null?void 0:s.requestedPlacement)||(s==null?void 0:s.placement)||"local",o=["local","peer",
"cluster"].includes(String(n).trim().toLowerCase())?String(n).trim().toLowerCase():"local";return{schema:Ct,source:s?"ta\
sk-placement-hint-v0":"default-local",advisoryOnly:(s==null?void 0:s.advisoryOnly)!==!1,requestedPlacement:o,recommendedPlacement:o,
actualPlacement:null,solverKey:(s==null?void 0:s.solverKey)||e.solverId||((d=(m=e.data)==null?void 0:m.solver)==null?void 0:
d.id)||null,solverId:(s==null?void 0:s.solverId)||e.solverId||((f=(h=e.data)==null?void 0:h.solver)==null?void 0:f.id)||
null,taskFamily:a,runtime:t,syncMode:(s==null?void 0:s.syncMode)||null,timeoutMs:A(s==null?void 0:s.timeoutMs,this.placementTimeoutMs,
0,36e5),confidence:Number.isFinite(Number(s==null?void 0:s.confidence))?Number(s.confidence):null,targetReplicaCount:A(s==
null?void 0:s.targetReplicaCount,0,0,1e6),peerId:(s==null?void 0:s.peerId)||(s==null?void 0:s.remotePeerId)||e.peerId||e.
remotePeerId||null,clusterId:(s==null?void 0:s.clusterId)||e.clusterId||null,reasons:Array.isArray(s==null?void 0:s.reasons)?
[...s.reasons]:[],constraints:Array.isArray(s==null?void 0:s.constraints)?[...s.constraints]:[]}}_recordPlacementSubmitted(e={}){
const t=this.stats.taskPlacement;if(!t)return;const a=e.requestedPlacement||"local";t.totalSubmitted+=1,a==="local"?t.localSubmitted+=
1:t.remoteRequested+=1,this._placementBucket(t.byRecommendedPlacement,a).submitted+=1,t.lastPlacement={...e,actualPlacement:e.
actualPlacement||null}}_recordPlacementAttempt(e,{mode:t="unknown",attempt:a=1}={}){var c;const s=e.placement||((c=e.payload)==
null?void 0:c.placement),n=this.stats.taskPlacement;if(!s||!n)return;const o=s.requestedPlacement||"local",i=String(t||"\
unknown"),l=i.startsWith("remote-")?i:`local-${i}`;this.stats.remoteTaskAttempts+=1,n.remoteAttempts+=1,this._placementBucket(
n.byRecommendedPlacement,o).attempted+=1,this._placementBucket(n.byActualPlacement,l).attempted+=1,n.lastPlacementAttempt=
{...s,actualPlacement:l,attempt:a,attemptedAt:Date.now()}}_recordPlacementRetry(e,{mode:t="unknown",retry:a=null}={}){var c;
const s=e.placement||((c=e.payload)==null?void 0:c.placement),n=this.stats.taskPlacement;if(!s||!n)return;const o=s.requestedPlacement||
"local",i=String(t||"unknown"),l=i.startsWith("remote-")?i:`local-${i}`;this.stats.remoteTasksRetried+=1,n.remoteRetried+=
1,this._placementBucket(n.byRecommendedPlacement,o).retried+=1,this._placementBucket(n.byActualPlacement,l).retried+=1,n.
lastPlacementRetry={...s,actualPlacement:l,retry:a?JSON.parse(JSON.stringify(a)):null,decidedAt:Date.now()}}_recordPlacementCompletion(e,{
ok:t=!0,mode:a="unknown",errorKind:s=null,errorMessage:n=null,provenance:o=null,admission:i=null,retry:l=null}={}){var p;
const c=e.placement||((p=e.payload)==null?void 0:p.placement),u=this.stats.taskPlacement;if(!c||!u)return;const m=c.requestedPlacement||
"local",d=String(a||"unknown"),h=d.startsWith("remote-")?d:d==="worker"?"local-worker":d==="inline"?"local-inline":`loca\
l-${d}`;t?u.totalCompleted+=1:u.totalFailed+=1,h.startsWith("remote-")&&(t?u.remoteExecuted+=1:(u.remoteFailed+=1,s==="t\
imeout"&&(u.remoteTimedOut+=1),s==="rejected"&&(u.remoteRejected+=1),s==="verification-failed"&&(u.remoteVerificationFailed+=
1),s==="validation-failed"&&(u.remoteValidationFailed+=1),l!=null&&l.exhausted&&(u.remoteRetryExhausted+=1)));const f=this.
_placementBucket(u.byRecommendedPlacement,m),y=this._placementBucket(u.byActualPlacement,h);t?(f.completed+=1,y.completed+=
1):(f.failed+=1,y.failed+=1,s==="timeout"&&(f.timedOut+=1,y.timedOut+=1),s==="rejected"&&(f.rejected+=1,y.rejected+=1),s===
"verification-failed"&&(f.verificationFailed+=1,y.verificationFailed+=1),s==="validation-failed"&&(f.validationFailed+=1,
y.validationFailed+=1),l!=null&&l.exhausted&&(f.retryExhausted+=1,y.retryExhausted+=1)),y.submitted+=1,u.lastPlacement={
...c,actualPlacement:h,completedAt:Date.now(),ok:t,errorKind:s,errorMessage:n,admission:i,provenance:o,retry:l},h.startsWith(
"remote-")&&(u.lastRemotePlacement=JSON.parse(JSON.stringify(u.lastPlacement)))}_runtimeStats(e){const t=String(e||"unkn\
own");return this.stats.byRuntime[t]||(this.stats.byRuntime[t]=Ye()),this.stats.byRuntime[t]}_normalizeTaskFamily(e={},t="\
unknown"){var s,n,o,i,l,c,u,m;const a=e.taskFamily||e.solverId||((n=(s=e.data)==null?void 0:s.solver)==null?void 0:n.id)||
((o=e.data)==null?void 0:o.solverId)||((i=e.data)==null?void 0:i.taskFamily);if(a)return String(a).trim()||"unknown";if(e.
affinityKey||e.workerKey||(l=e.data)!=null&&l.affinityKey||(c=e.data)!=null&&c.stateKey){const d=String(e.affinityKey||e.
workerKey||((u=e.data)==null?void 0:u.affinityKey)||((m=e.data)==null?void 0:m.stateKey)),[h]=d.split(":");if(h)return h}
return String(t||"unknown")}_taskFamilyStats(e){const t=String(e||"unknown");return this.stats.byTaskFamily[t]||(this.stats.
byTaskFamily[t]=Ye()),this.stats.byTaskFamily[t]}_recordTaskCompletion(e,{ok:t=!0,mode:a="unknown",errorKind:s=null,errorMessage:n=null,
provenance:o=null,admission:i=null,retry:l=null}={}){var E,_;const c=e.runtime||((E=e.payload)==null?void 0:E.runtime)||
"unknown",u=this._runtimeStats(c),m=e.taskFamily||((_=e.payload)==null?void 0:_.taskFamily)||"unknown",d=this._taskFamilyStats(
m),h=Z(),f=Math.max(0,h-(e.submittedAt||e.startedAt||h)),y=Math.max(0,h-(e.startedAt||e.submittedAt||h));t?(this.stats.totalTasksCompleted+=
1,u.completed+=1,d.completed+=1,a==="worker"?this.stats.workerTasksCompleted+=1:String(a||"").startsWith("remote-")?this.
stats.remoteTasksCompleted+=1:this.stats.inlineTasksCompleted+=1):(this.stats.totalTasksFailed+=1,u.failed+=1,d.failed+=
1,String(a||"").startsWith("remote-")&&(this.stats.remoteTasksFailed+=1,s==="timeout"&&(this.stats.remoteTasksTimedOut+=
1),s==="rejected"&&(this.stats.remoteTasksRejected+=1),s==="verification-failed"&&(this.stats.remoteTasksVerificationFailed+=
1),s==="validation-failed"&&(this.stats.remoteTasksValidationFailed+=1),l!=null&&l.exhausted&&(this.stats.remoteTasksRetryExhausted+=
1))),this.stats.totalTaskDurationMs+=f,this.stats.lastTaskDurationMs=Number(f.toFixed(3)),this.stats.minTaskDurationMs=this.
stats.minTaskDurationMs==null?this.stats.lastTaskDurationMs:Math.min(this.stats.minTaskDurationMs,this.stats.lastTaskDurationMs),
this.stats.maxTaskDurationMs=Math.max(this.stats.maxTaskDurationMs,this.stats.lastTaskDurationMs),this.stats.averageTaskDurationMs=
this.stats.totalTasksCompleted+this.stats.totalTasksFailed>0?Number((this.stats.totalTaskDurationMs/(this.stats.totalTasksCompleted+
this.stats.totalTasksFailed)).toFixed(3)):0,this.stats.lastCompletedAt=Date.now(),u.totalDurationMs+=f,u.lastDurationMs=
this.stats.lastTaskDurationMs,u.maxDurationMs=Math.max(u.maxDurationMs,u.lastDurationMs);const p=u.completed+u.failed;u.
averageDurationMs=p>0?Number((u.totalDurationMs/p).toFixed(3)):0,d.totalDurationMs+=f,d.lastDurationMs=this.stats.lastTaskDurationMs,
d.maxDurationMs=Math.max(d.maxDurationMs,d.lastDurationMs);const k=d.completed+d.failed;d.averageDurationMs=k>0?Number((d.
totalDurationMs/k).toFixed(3)):0,this._recordExecutorCompletion(e,{ok:t,durationMs:y}),this._recordPlacementCompletion(e,
{ok:t,mode:a,errorKind:s,errorMessage:n,admission:i,provenance:o,retry:l})}_removeWorker(e,{terminate:t=!0}={}){if(t)try{
e.terminate()}catch(n){return this.workerTerminationFailures.set(e,Object.assign(new Error("Owned worker termination fai\
led",{cause:n}),{code:"ERR_COMPUTE_WORKER_TERMINATION_FAILED",workerTerminated:!1})),!1}this.workerTerminationFailures.delete(
e),this._markWorkerBootstrapRetired(e);const a=this.workerBootstrap.get(e);if(e.onmessage=null,e.onerror=null,a!=null&&a.
messageErrorListener&&typeof e.removeEventListener=="function"){try{e.removeEventListener("messageerror",a.messageErrorListener)}catch{}
a.messageErrorListener=null}const s=this._workerId(e)||"worker-unknown";if(this.workerUtilization.has(s)){const n=this.workerUtilization.
get(s);n.status="retired"}for(const n of this.activeTasks.values())n.worker===e&&this._recordExecutorAbandon(n);this.workers=
this.workers.filter(n=>n!==e);for(const[n,o]of this.workerAffinities.entries())o===e&&this.workerAffinities.delete(n);return!0}_recordWorkerResize({
reason:e="manual",previousTargetWorkers:t=this.targetWorkerCount,previousWorkerCount:a=this.workers.length}={}){const s=this.
workers.length,n=t!==this.targetWorkerCount||a!==s;n&&(this.workerPoolRevision+=1);const o={schema:"peercompute.compute.\
worker-resize.v0",revision:this.workerPoolRevision,reason:e,previousTargetWorkers:t,targetWorkers:this.targetWorkerCount,
previousWorkerCount:a,workerCount:s,changed:n,timestamp:Date.now()};return this.lastWorkerResize=o,n&&(this.workerResizeHistory.
push(o),this.workerResizeHistory=this.workerResizeHistory.slice(-16)),o}_holdWorkerAutoScale(e="manual",t=this.manualWorkerAutoScaleCooldownMs){
const a=A(t,0,0,6e5);if(a<=0)return this._getWorkerAutoScaleHoldStatus();const s=Date.now()+a;return s>=this.workerAutoScaleHoldUntil&&
(this.workerAutoScaleHoldUntil=s,this.workerAutoScaleHoldReason=e),this._getWorkerAutoScaleHoldStatus()}_getWorkerAutoScaleHoldStatus(e=Date.
now()){const t=Math.max(0,this.workerAutoScaleHoldUntil-e);return{active:t>0,reason:t>0?this.workerAutoScaleHoldReason:null,
remainingMs:t,until:t>0?this.workerAutoScaleHoldUntil:null}}_retireIdleWorkers(){if(this.workers.length<=this.targetWorkerCount)
return;const e=new Set(Array.from(this.activeTasks.values()).map(t=>t.worker));for(const t of[...this.workers].reverse()){
if(this.workers.length<=this.targetWorkerCount)break;e.has(t)||[...this.residentWorkerAffinities].some(a=>this.workerAffinities.
get(a)===t)||(this._removeWorker(t),this.workerRetirements+=1)}}_maybeScaleForQueue(){if(!this.config.autoScaleWorkers||
!this.initialized||!this._supportsWorkers()||this._getWorkerAutoScaleHoldStatus().active||this.workers.length>=this.workerPolicy.
maxWorkers)return;const e=this.activeTasks.size+this.taskQueue.length;if(e<this.workers.length+this.workerPolicy.scaleUpQueueDepth)
return;const t=Math.min(this.workerPolicy.maxWorkers,Math.max(this.targetWorkerCount+1,e));this.resizeWorkers(t,{reason:"\
queue-pressure"})}_scheduleIdleScaleDown(){!this.config.autoScaleWorkers||this.workerPolicy.idleScaleDownMs<1||this._getWorkerAutoScaleHoldStatus().
active||this.activeTasks.size>0||this.taskQueue.length>0||this.workers.length<=this.workerPolicy.targetWorkers||(clearTimeout(
this.scaleDownTimer),this.scaleDownTimer=setTimeout(()=>{this.resizeWorkers(this.workerPolicy.targetWorkers,{reason:"idl\
e-scale-down"})},this.workerPolicy.idleScaleDownMs))}_requiresInlineExecution(e){var t,a;return((a=(t=e.payload)==null?void 0:
t.gpuResidentLane)==null?void 0:a.localExecution)==="inline"}_acquireTaskGpuResidentLaneLease(e){var s,n,o,i,l,c,u,m,d,h,
f;const t=(s=e.payload)==null?void 0:s.gpuResidentLane;if(!t||e.gpuResidentLaneLease||e.gpuResidentLaneExecution)return e.
gpuResidentLaneLease||null;if(!((n=this.gpuResidentLaneManager)!=null&&n.acquireLease))throw new Error("GPU resident lan\
e manager is not available for declared resident-lane task");const a=this.acquireGpuResidentLaneLease({...t,taskId:t.taskId||
e.id||((o=e.payload)==null?void 0:o.id)||null,solverId:t.solverId||((i=e.payload)==null?void 0:i.solverId)||((l=e.payload)==
null?void 0:l.taskFamily)||null,owner:t.owner||((c=e.payload)==null?void 0:c.taskFamily)||"compute-manager-task",queueFencePolicy:t.
queueFencePolicy||((m=(u=e.payload)==null?void 0:u.gpuFence)==null?void 0:m.queueFencePolicy)||null,retainedBufferRefs:(d=
t.retainedBufferRefs)!=null&&d.length?t.retainedBufferRefs:((f=(h=e.payload)==null?void 0:h.gpuFence)==null?void 0:f.retainedBufferRefs)||
[],residentSequenceLaneContract:t.residentSequenceLaneContract||null});return e.gpuResidentLaneLease=a,a}_taskPayloadWithGpuResidentLaneLeaseIdentity(e){
const t=e.payload,a=e.gpuResidentLaneLease;if(!a)return t;const s=Object.freeze({schema:Kr,authoritative:!0,leaseId:a.leaseId,
laneId:a.laneId,stateKey:a.stateKey,sourceFamily:a.sourceFamily,domainKey:a.domainKey,solverId:a.solverId,taskId:a.taskId,
owner:a.owner}),n=t==null?void 0:t.data;return!n||typeof n!="object"||Array.isArray(n)?{...t,gpuResidentLaneLeaseIdentity:s}:
{...t,data:{...n,gpuResidentLaneLeaseIdentity:s},gpuResidentLaneLeaseIdentity:s}}_completeTaskGpuResidentLaneLease(e,t,{
mode:a=null}={}){var u,m,d,h,f,y,p,k,E;const s=e.gpuResidentLaneLease;if(!s||e.gpuResidentLaneExecution)return t;const n=t&&
typeof t=="object"?t:{},o=Fe(n.gpuFence||n.gpuFenceReport,((u=e.payload)==null?void 0:u.gpuFence)||null),i=((d=(m=e.payload)==
null?void 0:m.gpuFence)==null?void 0:d.required)===!0,l=(h=o==null?void 0:o.retainedBufferRefs)!=null&&h.length?o.retainedBufferRefs:
(p=(y=(f=e.payload)==null?void 0:f.gpuResidentLane)==null?void 0:y.retainedBufferRefs)!=null&&p.length?e.payload.gpuResidentLane.
retainedBufferRefs:((E=(k=e.payload)==null?void 0:k.gpuFence)==null?void 0:E.retainedBufferRefs)||s.retainedBufferRefs||
[],c=this.completeGpuResidentLaneLease(s.leaseId,{status:(o==null?void 0:o.status)||(i?"gpu-fence-report-missing":"queue\
-work-completed"),method:(o==null?void 0:o.method)||null,queueCompletionStatus:(o==null?void 0:o.queueCompletionStatus)||
(o==null?void 0:o.status)||null,queueCompletionMethod:(o==null?void 0:o.queueCompletionMethod)||(o==null?void 0:o.method)||
null,retainedBufferRefs:l,completed:o?o.fenceSatisfied===!0:i?!1:null,source:a?`compute-manager-${a}`:"compute-manager-l\
ocal-task"});return e.gpuResidentLaneExecution=c,e.gpuResidentLaneLease=null,t&&typeof t=="object"&&!Array.isArray(t)?{...t,
gpuFence:t.gpuFence||c.gpuFence,gpuResidentLaneExecution:t.gpuResidentLaneExecution||c,gpuResidentLaneLease:t.gpuResidentLaneLease||
c.lease}:t}_rejectTaskGpuResidentLaneLease(e,t="task-failed"){const a=e.gpuResidentLaneLease;if(!a||e.gpuResidentLaneExecution||
e.gpuResidentLaneRejected)return null;const s=this.rejectGpuResidentLaneLease(a.leaseId,t);return e.gpuResidentLaneRejected=
s,e.gpuResidentLaneLease=null,s}_assertRequiredGpuFenceSatisfied(e,t){var o,i,l,c;if(((i=(o=e.payload)==null?void 0:o.gpuFence)==
null?void 0:i.required)!==!0)return;const a=t&&typeof t=="object"?t:{},s=((l=e.gpuResidentLaneExecution)==null?void 0:l.
gpuFence)||Fe(a.gpuFence||a.gpuFenceReport,e.payload.gpuFence);if((s==null?void 0:s.fenceSatisfied)===!0)return;const n=new Error(
`GPU fence missing or unsatisfied for task ${e.id||((c=e.payload)==null?void 0:c.id)||"unknown"}`);throw n.name="GpuFenc\
eUnsatisfiedError",n.code="ERR_COMPUTE_GPU_FENCE_UNSATISFIED",n.gpuFence=s||null,n.gpuFenceRequirement=e.payload.gpuFence,
n}_dispatchToWorker(e){var l,c;if(this._requiresInlineExecution(e))return!1;const t=(l=e.payload)==null?void 0:l.affinityKey;
if(t&&this.residentWorkerAffinities.has(t)&&!this.workerAffinities.has(t))return this._recordTaskCompletion(e,{ok:!1,mode:"\
queued"}),e.reject(Object.assign(new Error("Resident worker was terminated"),{code:"ERR_COMPUTE_WORKER_TERMINATED",workerTerminated:!0})),
!0;const a=new Set(Array.from(this.activeTasks.values()).map(u=>u.worker)),s=this.workers.filter(u=>{var m,d;return!this.
workerTerminationFailures.has(u)&&(!(this.config.requireWorkers||(m=e.payload)!=null&&m.requireWorker)||((d=this.workerBootstrap.
get(u))==null?void 0:d.status)==="ready")});let n=null;if(t&&this.workerAffinities.has(t)){const u=this.workerAffinities.
get(t);if(!this.workers.includes(u))this.workerAffinities.delete(t);else if(s.includes(u)){if(a.has(u))return!1;n=u}else
return!1}if(!n){const u=new Set(this.workerAffinities.values()),m=new Set([...this.residentWorkerAffinities].map(h=>this.
workerAffinities.get(h))),d=s.filter(h=>!a.has(h)&&!m.has(h));n=d.find(h=>!u.has(h))||d[0],n&&t&&this.workerAffinities.set(
t,n)}if(!n)return!1;clearTimeout((c=e.control)==null?void 0:c.bootstrapTimer);const o=this._workerId(n)||"worker-unknown",
i={...e,worker:n,workerId:o,startedAt:Z(),executionMode:"worker"};this._recordExecutorStart(o,i,{kind:"worker"}),this.activeTasks.
set(e.id,i);try{n.postMessage({type:"run",...e.payload,workerId:o},e.transferables||[])}catch(u){this._handleWorkerFailure(
n,u)}return!0}_buildTaskExecutionReport(e,{mode:t=null,result:a=null}={}){var d,h,f,y,p,k,E;const s=t||e.executionMode||
null,n=e.runtime||((d=e.payload)==null?void 0:d.runtime)||null,o=e.taskFamily||((h=e.payload)==null?void 0:h.taskFamily)||
null,i=e.id||((f=e.payload)==null?void 0:f.id)||null,l=a&&typeof a=="object"?a:{},c=Fe(l.gpuFence||l.gpuFenceReport,((y=
e.payload)==null?void 0:y.gpuFence)||null)||((p=e.gpuResidentLaneExecution)==null?void 0:p.gpuFence)||null,u=e.executorId||
(s==="inline"||s==="inline-fallback"?this.inlineExecutorId:null),m=s==="worker"&&(e.workerId||e.executorId)||null;return{
schema:Pa,taskId:i,runtime:n,taskFamily:o,executionMode:s,executorId:u,workerId:m,gpuFenceRequirement:((k=e.payload)==null?
void 0:k.gpuFence)||null,gpuFence:c,gpuFenceStatus:(c==null?void 0:c.status)??null,gpuFenceSatisfied:(c==null?void 0:c.fenceSatisfied)??
!1,gpuResidentLaneRequirement:((E=e.payload)==null?void 0:E.gpuResidentLane)||null,gpuResidentLaneExecution:e.gpuResidentLaneExecution||
null,gpuResidentLaneRejected:e.gpuResidentLaneRejected||null}}_attachTaskExecutionReport(e,t,{mode:a=null}={}){var n;if(((n=
t.payload)==null?void 0:n.returnEnvelope)!==!0)return e;const s=this._buildTaskExecutionReport(t,{mode:a,result:e});if(e&&
typeof e=="object"&&!Array.isArray(e)){const o={...e};return o.computeExecution||(o.computeExecution=s),o.workerId==null&&
s.workerId&&(o.workerId=s.workerId),o}return{value:e,computeExecution:s,...s.workerId?{workerId:s.workerId}:{}}}async _executeInline(e){
var t,a,s,n;if((t=e.payload)!=null&&t.requireWorker){e.reject(this._createRequiredWorkerError("inline execution is prohi\
bited for this task"));return}e.startedAt=Z(),e.executionMode||(e.executionMode="inline"),this._recordExecutorStart(this.
inlineExecutorId,e,{kind:"inline"});try{this._acquireTaskGpuResidentLaneLease(e);const o=await Fr(this._taskPayloadWithGpuResidentLaneLeaseIdentity(
e)),i=this._completeTaskGpuResidentLaneLease(e,o,{mode:e.executionMode||"inline"});if(this._assertRequiredGpuFenceSatisfied(
e,i),i&&typeof i=="object"&&Object.prototype.hasOwnProperty.call(i,"commitDelta")){((a=e.payload)==null?void 0:a.suppressCommitDelta)!==
!0&&this.commitDelta(i.commitDelta);const l=Object.prototype.hasOwnProperty.call(i,"value")?i.value:i.result;this._recordTaskCompletion(
e,{ok:!0,mode:e.executionMode||"inline"}),e.resolve(((s=e.payload)==null?void 0:s.returnEnvelope)===!0?this._attachTaskExecutionReport(
i,e,{mode:e.executionMode||"inline"}):l);return}this._recordTaskCompletion(e,{ok:!0,mode:e.executionMode||"inline"}),e.resolve(
((n=e.payload)==null?void 0:n.returnEnvelope)===!0?this._attachTaskExecutionReport(i,e,{mode:e.executionMode||"inline"}):
i)}catch(o){this._rejectTaskGpuResidentLaneLease(e,(o==null?void 0:o.code)||"inline-task-error"),this._recordTaskCompletion(
e,{ok:!1,mode:e.executionMode||"inline"}),e.reject(o)}}_handleWorkerMessage(e,t){var c,u,m,d,h,f;if(!this.workers.includes(
e))return;const{id:a,type:s,result:n,error:o}=t||{};if(s==="ready"){const y=this.workerBootstrap.get(e);y&&(y.protocolVersion=
t.protocolVersion||1),this._markWorkerBootstrapped(e),this._scheduleNext();return}const i=this.activeTasks.get(a);if(!i||
i.worker!==e)return;if(s==="progress"){if(!((c=i.control)!=null&&c.cancelRequested))try{(u=i.onProgress)==null||u.call(i,
t.value)}catch{this.cancelTask(a,{reason:"Compute progress consumer failed"})}return}if(s!=="result"&&s!=="error")return;
const l=s==="error"&&this.residentWorkerAffinities.has((m=i.payload)==null?void 0:m.affinityKey)&&["ERR_MODEL_GPU","ERR_\
MODEL_GPU_OUT_OF_MEMORY","ERR_MODEL_RUNTIME","MODEL_DISPOSE_FAILED"].includes(t.code);if((d=i.control)!=null&&d.cancelRequested&&
!l){this._recordTaskCompletion(i,{ok:!1,mode:"worker"}),i.reject(Object.assign(new Error("Compute task cancelled"),{name:"\
AbortError",code:"ERR_COMPUTE_TASK_CANCELLED"})),this.activeTasks.delete(a),this._retireIdleWorkers(),this._scheduleNext();
return}if(s==="result"){let y=n;n&&typeof n=="object"&&Object.prototype.hasOwnProperty.call(n,"commitDelta")&&(((h=i.payload)==
null?void 0:h.suppressCommitDelta)!==!0&&this.commitDelta(n.commitDelta),y=Object.prototype.hasOwnProperty.call(n,"value")?
n.value:n.result),this._recordTaskCompletion(i,{ok:!0,mode:"worker"}),i.resolve(((f=i.payload)==null?void 0:f.returnEnvelope)===
!0?this._attachTaskExecutionReport(n,i,{mode:"worker"}):y)}else s==="error"&&(this._recordTaskCompletion(i,{ok:!1,mode:"\
worker"}),i.reject(Object.assign(new Error(o||"Worker task failed"),{name:t.name||"Error",...t.code?{code:t.code}:{}})));
this.activeTasks.delete(a),this._retireIdleWorkers(),this._scheduleIdleScaleDown(),this._scheduleNext()}_handleWorkerFailure(e,t){
if(!this.workers.includes(e))return;if(this._markWorkerBootstrapFailed(e,t),this.config.requireWorkers){this._failRequiredWorkerPool(
this._createRequiredWorkerError("an active browser worker failed",t));return}const a=this._removeWorker(e),s=[];for(const[
n,o]of this.activeTasks.entries())o.worker===e&&(a&&this.activeTasks.delete(n),s.push(o));console.warn("[ComputeManager]\
 Worker failed; recovering eligible tasks",t),s.forEach(n=>{var o,i;if(!a||(o=n.payload)!=null&&o.requireWorker||(i=n.control)!=
null&&i.cancelRequested){const l=a?Object.assign(new Error((t==null?void 0:t.message)||"Managed worker terminated"),{workerTerminated:!0,
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
!this._supportsWorkers())return this.workers.length;const t=A(this.targetWorkerCount,this.workerPolicy.targetWorkers,0,this.
workerPolicy.maxWorkers);if(t<=this.workers.length)return this.workers.length;const a=this.targetWorkerCount,s=this.workers.
length;for(;this.workers.length<t&&this._spawnWorker(););return this.workers.length!==s&&this._recordWorkerResize({reason:e,
previousTargetWorkers:a,previousWorkerCount:s}),this.workers.length}}const at=new URL("mpmComputeTasks-BUyr3VgE.js",import.meta.
url).href,We=document.getElementById("status"),ns=document.getElementById("particleCount"),os=document.getElementById("g\
ridSize"),is=document.getElementById("mass"),ls=document.getElementById("massDelta"),cs=document.getElementById("momentu\
m"),us=document.getElementById("momentumDelta"),ds=document.getElementById("checks"),pt=document.getElementById("toggleB\
tn"),ms=document.getElementById("resetBtn"),ps=document.getElementById("error"),hs=["Hydrogen","Oxygen","Sodium","Potass\
ium","Magnesium","Aluminum","Silicon","Calcium","Titanium","Iron","Lead"];let ke=null,ue=!0,De=0,st=0,fe=!1,me=null;const fs=.01,
ys=.01,tr=.005,Wt=[.8,.8,1,1.1,.95,1,.95,1.1,1,1,1],ks=[2e-4,2e-4,3e-4,3e-4,25e-5,2e-4,15e-5,25e-5,18e-5,17e-5,16e-5],ws=[
.05,.05,.08,.1,.07,.05,.05,.08,.06,.05,.05];function gs(r,e,t){const a=Math.max(0,Math.min(r,Wt.length-1)),s=Wt[a],n=ks[a],
o=ws[a],i=e-300;let l=s*(1+n*i);const c=1/Math.max(.2,1+.1*(t-1));l*=c,l=Math.min(Math.max(l,.4),2.5);let u=o+Math.abs(i)*
1e-4+Math.max(0,t-1)*.02;return u=Math.min(Math.max(u,0),.6),{spacing:l,jitter:u}}const ft={stiffness:2.5,restDensity:4,
dynamicViscosity:.08,dt:tr,fixedPointScale:1e5};function Se(r){We.textContent=r}function Oe(r){console.error(r),ps.textContent=
(r==null?void 0:r.stack)||String(r),Se("error"),ue=!1,pt.disabled=!0}function rr({mass:r,momentum:e}){st=st*.7+.3*2,is.textContent=
r.toFixed(4),cs.textContent=e.map(n=>n.toFixed(4)).join(", "),me||(me={mass:r,momentum:e});const t=me?r-me.mass:0,a=me?e.
map((n,o)=>n-me.momentum[o]):[0,0,0];ls.textContent=t.toExponential(3),us.textContent=a.map(n=>n.toExponential(3)).join(
", ");const s=Math.hypot(a[0],a[1],a[2]);Math.abs(t)>fs||s>ys?We.textContent=`drift detected (Δm=${t.toExponential(2)},\
 |Δp|=${s.toExponential(2)})`:ue&&(We.textContent="running"),ds.textContent=st.toFixed(1)}pt.addEventListener("click",()=>{
ue=!ue,pt.textContent=ue?"Pause":"Resume",Se(ue?"running":"paused")});ms.addEventListener("click",()=>{me=null,We.textContent=
"baseline reset"});async function Rs({particleCount:r,gridSize:e,iterations:t,blockOptions:a,stepsRequested:s}){const n=new ss(
{maxWorkers:1});await n.initialize(),await n.submitTask({module:at,exportName:"initHeadlessSim",data:{particleCount:r,gridSize:e,
iterations:t,blockOptions:a,constants:ft}});let o=0,i=!1;window.__mpmStarted=!1;function l(c){if(ue&&!i&&(i=!0,n.submitTask(
{module:at,exportName:"stepHeadlessSim",data:{steps:1,diagnostics:!1}}).then(()=>{o+=1,window.__mpmStarted=!0}).catch(Oe).
finally(()=>{i=!1})),!fe&&c-De>500&&(fe=!0,De=c,n.submitTask({module:at,exportName:"stepHeadlessSim",data:{steps:0,diagnostics:!0}}).
then(({mass:u,momentum:m})=>rr({mass:u,momentum:m})).catch(Oe).finally(()=>{fe=!1})),s>0&&o>=s){window.__mpmDone=!0,window.
__mpmStepsRan=o;return}requestAnimationFrame(l)}requestAnimationFrame(l)}async function Es({device:r,particleCount:e,gridSize:t,
iterations:a,blockOptions:s,stepsRequested:n}){ke=hr({device:r,particleCount:e,gridSize:t,iterations:a,blockOptions:s,constants:ft}),
window.__mpmStarted=!1;let o=0;function i(l){if(ue&&ke&&(ke.step(),window.__mpmStarted=!0,o+=1),ke&&!fe&&l-De>500&&(fe=!0,
De=l,fr(r,ke.buffers.particleBuffer,e).then(({mass:c,momentum:u})=>rr({mass:c,momentum:u})).catch(Oe).finally(()=>{fe=!1})),
n>0&&o>=n){window.__mpmDone=!0,window.__mpmStepsRan=o;return}requestAnimationFrame(i)}requestAnimationFrame(i)}async function Ss(){
try{Se("initializing WebGPU…");const r=new URLSearchParams(window.location.search),t=(r.get("compute")||"isolated").toLowerCase()!==
"shared",a=parseInt(r.get("count")||"1000",10),s={x:32,y:32,z:32},n=r.get("material")||"Oxygen",o=Math.max(0,hs.indexOf(
n)),i=r.get("temp"),l=parseInt(r.get("steps")||"0",10),c=Math.ceil(Math.cbrt(a)),u=gs(o,i?parseFloat(i):300,ft.ambientPressure||
1),m={start:[2,2,2],gridSize:s,jitter:u.jitter,spacing:u.spacing,materialType:o,cubeSideCount:c,temperature:i?parseFloat(
i):void 0},h=Math.ceil(.05/tr);if(ns.textContent=a.toString(),os.textContent=`${s.x}×${s.y}×${s.z}`,Se(t?"initializing\
 isolated worker":"initializing shared GPU"),t)await Rs({particleCount:a,gridSize:s,iterations:h,blockOptions:m,stepsRequested:l});else{
const f=await kr();if(!f)throw new Error("Shared GPU device unavailable");await Es({device:f,particleCount:a,gridSize:s,
iterations:h,blockOptions:m,stepsRequested:l})}Se("running")}catch(r){Oe(r)}}Ss();
