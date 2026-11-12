import{as as W,at as C,au as D,av as K,aw as a,M as A,ax as U,ay as _,az as q,aA as L,aB as N,aC as x}from"./main-Cvsn7onI.js";
import"./index-6TlIxpa6.js";async function B(l,e,t){if(e.model.runtime!=="transformers.js"||!e.model.memoryProfile)return;
const i=e.files.find(o=>o.path==="config.json");if(!i||i.size>N.maximumConfigBytes)throw new Error("Model config exceeds\
 its metadata budget");const r=await l.stat(i.cid,{signal:t});if(a(t),r?.status!=="complete"||r.size!==i.size||r.sha256!==
i.sha256)throw new Error("Model config is not verified locally");const n=new Uint8Array(i.size);let s=0;for await(const o of await l.
openRead(i.cid,{signal:t})){if(a(t),!(o instanceof Uint8Array)||o.length>n.length-s)throw new Error("Invalid model confi\
g bytes");n.set(o,s),s+=o.length}if(a(t),s!==n.length)throw new Error("Incomplete model config");x(e.model,JSON.parse(new TextDecoder(
"utf-8",{fatal:!0}).decode(n)))}function k(l,e){const t=new AbortController,i=()=>t.abort(l?.reason??"Cancelled");l?.addEventListener(
"abort",i,{once:!0}),l?.aborted&&i();const r=setTimeout(()=>t.abort("Model operation deadline exceeded"),e);return r.unref?.(),
{controller:t,dispose(){clearTimeout(r),l?.removeEventListener("abort",i)}}}function I(l){return l?.workerTerminated===!0||
l?.code==="WORKER_TERMINATED"}function R(l,e){return new Promise((t,i)=>{const r=()=>i(q(e.reason));e.addEventListener("\
abort",r,{once:!0}),Promise.resolve(l).then(t,i).finally(()=>e.removeEventListener("abort",r)),e.aborted&&r()})}class z{constructor({
computeManager:e,artifactStore:t,admission:i,runtimeAssets:r,resourceEstimate:n,runtimeDefinition:s=null,runtimeOptions:o={},
moduleUrl:h=s?.moduleUrl??"peercompute:model-inference",baseUrl:w=globalThis.location?.href,createChannel:c=()=>new MessageChannel,
loadTimeoutMs:f=3e5,generationTimeoutMs:y=12e4,allowedManifestCids:g=null,collectGpuEvidence:v=!1}={}){if(!e?.submitTask||
!e.reserveWorkerAffinity||!e.releaseWorkerAffinity||!e.cancelTask||!e.terminateWorkerAffinity||!e.getWorkerAffinityState)
throw new Error("Inference requires managed worker reservation and cancellation APIs");if(!t?.stat||!t.openRead||!i?.acquire)
throw new Error("Inference requires a StateManager artifact store and resource admission");for(const d of typeof n=="fun\
ction"?[]:["cpuBytes","gpuBytes"])if(!Number.isSafeInteger(n?.[d])||n[d]<=0)throw new Error("An explicit measured/config\
ured resident memory envelope is required");for(const d of[f,y])if(!Number.isSafeInteger(d)||d<1||d>30*6e4)throw new Error(
"Invalid inference operation deadline");if(this.computeManager=e,this.artifactStore=t,this.admission=i,this.runtimeDefinition=
s??{id:"transformers.js",validateManifest:C,validateRuntimeAssets:W},typeof this.runtimeDefinition.validateManifest!="fu\
nction"||typeof this.runtimeDefinition.validateRuntimeAssets!="function")throw new Error("A trusted model runtime defini\
tion is required");if(this.runtimeAssets=this.runtimeDefinition.validateRuntimeAssets(r,w),!this.runtimeDefinition.validateRuntimeOptions&&
Object.keys(o).length)throw new Error("This model runtime does not accept runtime options");this.runtimeOptions=this.runtimeDefinition.
validateRuntimeOptions?.(o)??{},this.resourceEstimate=typeof n=="function"?n:{...n},this.moduleUrl=String(h),this.createChannel=
c,this.loadTimeoutMs=f,this.generationTimeoutMs=y,this.allowedManifestCids=g?new Set(g):null,this.collectGpuEvidence=v===
!0,this.session=null,this.queue=[],this.active=null,this.closed=!1}async loadModel({sessionId:e=crypto.randomUUID(),manifestCid:t,
manifest:i,signal:r,onProgress:n}={}){if(this.closed)throw new Error("Inference service is closed");if(this.session)throw new Error(
"Unload the current model before loading another");if(D(e),typeof t!="string"||!t||t.length>256||this.allowedManifestCids&&
!this.allowedManifestCids.has(t))throw new Error("Model manifest is not admitted");K.parse(t),a(r);const s={sessionId:e,
manifestCid:t,affinityKey:`model:${e}`,status:"loading",reserved:!1};this.session=s;const o=k(r,this.loadTimeoutMs);s.loadController=
o.controller;const h=async()=>{try{const w=this.artifactStore.getManifest?await this.artifactStore.getManifest(t,{signal:o.
controller.signal}):i,c=this.runtimeDefinition.validateManifest(w);s.manifest=c.manifest,s.runtimeOptions=c.mediaProfile?
this.runtimeDefinition.validateRuntimeOptions?.(this.runtimeOptions,c.mediaProfile)??this.runtimeOptions:this.runtimeOptions,
await B(this.artifactStore,s.manifest,o.controller.signal);const f=typeof this.resourceEstimate=="function"?await this.resourceEstimate(
s.manifest,c):this.resourceEstimate;for(const[d,b]of[["cpuBytes",c.resourcePolicy.minimumCpuBytes],["gpuBytes",c.resourcePolicy.
minimumGpuBytes]])if(!Number.isSafeInteger(f?.[d])||f[d]<=0||f[d]<b)throw new Error(`Model requires an admitted ${d} env\
elope of at least ${b} bytes`);if(a(o.controller.signal),await this.computeManager.reserveWorkerAffinity(s.affinityKey),
s.reserved=!0,s.workerId=this.#e(s).workerId,a(o.controller.signal),s.lease=await this.admission.acquire({sessionId:e,manifestCid:t,
manifest:s.manifest,estimatedCpuBytes:f.cpuBytes,estimatedGpuBytes:f.gpuBytes}),!s.lease?.release)throw new Error("Admis\
sion did not return a resident resource lease");a(o.controller.signal),await R(s.lease.assertActive?.(),o.controller.signal),
a(o.controller.signal),this.#e(s);const{port1:y,port2:g}=this.createChannel();s.bridge=L(y,{store:this.artifactStore,manifest:s.
manifest}),s.dispatched=!0;const v=await this.computeManager.submitTask({id:`${e}-load`,module:this.moduleUrl,exportName:"\
handleModelTask",data:{command:"load",sessionId:e,manifestCid:t,manifest:s.manifest,artifactPort:g,runtimeAssets:this.runtimeAssets,
runtimeOptions:s.runtimeOptions,collectGpuEvidence:this.collectGpuEvidence},affinityKey:s.affinityKey,requireWorker:!0,transferables:[
g],signal:o.controller.signal,onProgress:n});return a(o.controller.signal),this.#e(s),await R(s.lease.assertActive?.(),o.
controller.signal),a(o.controller.signal),this.#e(s),s.status="ready",s.evidence=v,v}catch(w){try{s.dispatched&&!I(w)&&await this.
computeManager.terminateWorkerAffinity(s.affinityKey,{reason:"Model load failed"}),await this.#t(s),this.session===s&&(this.
session=null)}catch(c){throw s.status="cleanup-failed",new AggregateError([w,c],"Model load failed and cleanup is incomp\
lete")}throw w}finally{o.dispose(),this.runtimeDefinition.retainArtifactBridge||(await s.bridge?.close(),s.bridge=null),
s.loadController=null}};return s.loading=h(),s.loading}generate({requestId:e=crypto.randomUUID(),sessionId:t=this.session?.
sessionId,task:i,messages:r,prompt:n,image:s,audio:o,maxNewTokens:h=A.maxNewTokens,seed:w,steps:c,width:f,height:y,signal:g,
onProgress:v,onToken:d}={}){if(this.closed||this.session?.status!=="ready"||t!==this.session.sessionId)return Promise.reject(
new Error("Requested model is not ready"));const b=this.#o(this.session);if(b)return Promise.reject(b);let m;try{if(D(e),
o!=null&&!this.runtimeDefinition.acceptsAudio)throw new Error("This runtime does not accept audio input");if(this.runtimeDefinition.
normalizeGenerationInput)m=this.runtimeDefinition.normalizeGenerationInput({task:i,messages:r,prompt:n,image:s,audio:o,maxNewTokens:h,
seed:w,steps:c,width:f,height:y},this.session.manifest);else{if(U(s),r=_({messages:r,prompt:n}),this.runtimeDefinition.validateGenerationInput?.(
{image:s,messages:r,maxNewTokens:h}),!Number.isInteger(h)||h<1||h>A.maxNewTokens)throw new Error("Generation exceeds its\
 output-token budget");m={messages:r,image:s,maxNewTokens:h}}a(g)}catch(u){return Promise.reject(u)}if(this.active?.requestId===
e||this.queue.some(u=>u.requestId===e))return Promise.reject(new Error("Duplicate inference request ID"));if(this.active&&
this.queue.length>=A.maxQueued)return Promise.reject(new Error("Inference queue is full"));const O=this.session,E=k(g,this.
generationTimeoutMs),S=m.image?{width:m.image.width,height:m.image.height,channels:4,data:new Uint8Array(m.image.data)}:
void 0,T=m.audio?{samples:new Float32Array(m.audio.samples),sampleRate:m.audio.sampleRate}:void 0,p={requestId:e,session:O,
operation:E,started:!1,data:{...m,command:"generate",sessionId:t,requestId:e,image:S,...T?{audio:T}:{}},onProgress:u=>{if(!E.
controller.signal.aborted)try{v?.(u),u.type==="token"&&d?.(u.text,u)}catch(M){E.controller.abort(M)}}},P=new Promise((u,M)=>{
p.resolve=u,p.reject=M});return p.finished=P.catch(()=>{}),p.abortQueued=()=>{if(p.started)return;const u=this.queue.indexOf(
p);u>=0&&this.queue.splice(u,1),E.dispose(),p.reject(q(E.controller.signal.reason))},E.controller.signal.addEventListener(
"abort",p.abortQueued,{once:!0}),this.queue.push(p),this.#r(),P}async#r(){if(this.active||!this.queue.length)return;const e=this.
queue.shift();e.started=!0,this.active=e;try{if(a(e.operation.controller.signal),this.session!==e.session||e.session.status!==
"ready")throw new Error("Model session lost");const t=await this.#n(e.session,e.operation.controller.signal);if(t)throw t;
if(a(e.operation.controller.signal),this.session!==e.session||e.session.status!=="ready")throw new Error("Requested mode\
l is no longer ready");e.dispatched=!0;const i=await this.computeManager.submitTask({id:`${e.session.sessionId}-generate\
-${e.requestId}`,module:this.moduleUrl,exportName:"handleModelTask",data:e.data,affinityKey:e.session.affinityKey,requireWorker:!0,
transferables:[...e.data.image?[e.data.image.data.buffer]:[],...e.data.audio?[e.data.audio.samples.buffer]:[]],signal:e.
operation.controller.signal,onProgress:e.onProgress}),r=await this.#n(e.session,e.operation.controller.signal);if(r)throw r;
if(a(e.operation.controller.signal),this.session!==e.session||e.session.status!=="ready")throw new Error("Requested mode\
l is no longer ready");e.resolve(i)}catch(t){const i=this.runtimeDefinition.terminateOnGenerationAbort===!0&&e.dispatched&&
(e.operation.controller.signal.aborted||t?.name==="AbortError");if(t?.code==="ERR_MODEL_RESIDENCY_INACTIVE")this.#s(e.session,
t);else if(i||I(t)||t?.code==="ERR_COMPUTE_WORKER_TERMINATION_FAILED"||/GPU device lost|Model session lost/.test(t?.message??
"")){e.session.status="lost",this.#i("Model worker was lost");try{I(t)||await this.computeManager.terminateWorkerAffinity(
e.session.affinityKey,{reason:i?"Model generation aborted and retired its device":"Model session lost"}),await this.#t(e.
session),this.session===e.session&&(this.session=null)}catch(r){e.session.status="cleanup-failed",t=new AggregateError([
t,r],"Lost worker resource cleanup failed")}}e.reject(t)}finally{e.operation.dispose(),e.operation.controller.signal.removeEventListener(
"abort",e.abortQueued),this.active=null,this.#r()}}async cancel(e,{reason:t="Caller cancelled inference",timeoutMs:i}={}){
const r=this.active?.requestId===e?this.active:this.queue.find(n=>n.requestId===e);return r?(r.operation.controller.abort(
t),r.started&&(await this.computeManager.cancelTask(`${r.session.sessionId}-generate-${e}`,{reason:t,timeoutMs:i}),await r.
finished),!0):!1}getStatus(){return this.session?.status==="ready"&&this.#o(this.session),{status:this.session?.status??
(this.closed?"closed":"idle"),runtime:this.runtimeDefinition.id,sessionId:this.session?.sessionId??null,manifestCid:this.
session?.manifestCid??null,activeRequestId:this.active?.requestId??null,queuedRequests:this.queue.length,artifactReads:this.
session?.bridge?.getStats()??null,evidence:this.session?.evidence??null}}async status(){const e=this.getStatus(),t=this.
session;if(!t||t.status!=="ready"||this.active)return e;const i=await this.computeManager.submitTask({module:this.moduleUrl,
exportName:"handleModelTask",data:{command:"status",sessionId:t.sessionId},affinityKey:t.affinityKey,requireWorker:!0});
return this.session===t&&["lost","absent","unloaded"].includes(i.status)&&this.#s(t,new Error("Model session lost: resid\
ent worker reported an unavailable runtime")),i}#e(e){const t=this.computeManager.getWorkerAffinityState(e.affinityKey);
if(!e.reserved||!t?.reserved||t.workerId==null||e.workerId!=null&&e.workerId!==t.workerId)throw new Error("Model session\
 lost: the original managed resident worker is unavailable");return t}#s(e,t){this.session!==e||["unloading","cleanup-fa\
iled"].includes(e.status)||(e.status="lost",this.#i(t.message),this.active?.session===e&&this.active.operation.controller.
abort(t))}#o(e){try{this.#e(e);const t=e.lease?.assertActiveSync?.();if(t?.then)throw Promise.resolve(t).catch(()=>{}),new TypeError(
"Resident synchronous health check must not return a promise");return null}catch(t){return this.#a(e,t)}}async#n(e,t){try{
if(this.#e(e),await R(e.lease?.assertActive?.(),t),a(t),this.session!==e||e.status!=="ready")throw new Error("Requested \
model is no longer ready");return this.#e(e),null}catch(i){if(t.aborted)throw q(t.reason);if(this.session!==e||e.status===
"unloading")throw i;return this.#a(e,i)}}#a(e,t){const i=Object.assign(new Error(String(t?.message??t),{cause:t}),{code:"\
ERR_MODEL_RESIDENCY_INACTIVE"});return this.#s(e,i),i}#i(e){for(const t of[...this.queue])t.operation.controller.abort(e)}async#t(e){
await e.bridge?.close(),e.bridge=null,e.lease&&(await e.lease.release(),e.lease=null),e.reserved&&(await this.computeManager.
releaseWorkerAffinity(e.affinityKey),e.reserved=!1)}async unloadModel(){const e=this.session;if(!e)return{status:"absent"};
if(e.unloadingPromise)return e.unloadingPromise;const t=this.#l(e);e.unloadingPromise=t;try{return await t}finally{e.unloadingPromise===
t&&(e.unloadingPromise=null)}}async#l(e){if(this.#i("Model is unloading"),e.status==="loading"){if(e.loadController?.abort(
"Model load cancelled by unload"),await e.loading.catch(()=>{}),this.session===e)throw new Error("Model cleanup is incom\
plete; admission remains held");return{sessionId:e.sessionId,status:"unloaded"}}if(e.status==="cleanup-failed"||e.status===
"lost")return this.active?.session===e&&await this.cancel(this.active.requestId,{reason:"Lost model is unloading"}),this.
session!==e?{sessionId:e.sessionId,status:"unloaded"}:(await this.computeManager.terminateWorkerAffinity(e.affinityKey,{
reason:"Retry model cleanup"}),await this.#t(e),this.session=null,{sessionId:e.sessionId,status:"unloaded",workerTerminated:!0});
if(e.status="unloading",this.active&&await this.cancel(this.active.requestId,{reason:"Model is unloading"}),this.session!==
e)return{sessionId:e.sessionId,status:"unloaded"};const t=k(void 0,this.generationTimeoutMs);try{if(this.runtimeDefinition.
terminateOnUnload)return await this.computeManager.terminateWorkerAffinity(e.affinityKey,{reason:"Model runtime unloaded"}),
await this.#t(e),this.session=null,{sessionId:e.sessionId,status:"unloaded",workerTerminated:!0};const i=await this.computeManager.
submitTask({id:`${e.sessionId}-unload`,module:this.moduleUrl,exportName:"handleModelTask",data:{command:"unload",sessionId:e.
sessionId},affinityKey:e.affinityKey,requireWorker:!0,signal:t.controller.signal});return await this.#t(e),this.session=
null,i}catch(i){try{I(i)||await this.computeManager.terminateWorkerAffinity(e.affinityKey,{reason:"Model disposal failed"}),
await this.#t(e),this.session=null}catch(r){throw e.status="cleanup-failed",new AggregateError([i,r],"Model disposal fai\
led and cleanup is incomplete")}throw i}finally{t.dispose()}}async dispose(){return this.closed=!0,this.unloadModel()}}export{z as ModelInferenceService};
