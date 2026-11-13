import{as as S,at as L,au as q,av as C,aw as a,M as A,ax as U,ay as N,az as T,aA as W,aB as K,aC as j}from"./main-DXMP-dfW.js";
import"./index-CaA_DtmY.js";async function B(l,e,t){if(e.model.runtime!=="transformers.js"||!e.model.memoryProfile)return;
const i=e.files.find(r=>r.path==="config.json");if(!i||i.size>K.maximumConfigBytes)throw new Error("Model config exceeds\
 its metadata budget");const o=await l.stat(i.cid,{signal:t});if(a(t),o?.status!=="complete"||o.size!==i.size||o.sha256!==
i.sha256)throw new Error("Model config is not verified locally");const n=new Uint8Array(i.size);let s=0;for await(const r of await l.
openRead(i.cid,{signal:t})){if(a(t),!(r instanceof Uint8Array)||r.length>n.length-s)throw new Error("Invalid model confi\
g bytes");n.set(r,s),s+=r.length}if(a(t),s!==n.length)throw new Error("Incomplete model config");j(e.model,JSON.parse(new TextDecoder(
"utf-8",{fatal:!0}).decode(n)))}function R(l,e){const t=new AbortController,i=()=>t.abort(l?.reason??"Cancelled");l?.addEventListener(
"abort",i,{once:!0}),l?.aborted&&i();const o=setTimeout(()=>t.abort("Model operation deadline exceeded"),e);return o.unref?.(),
{controller:t,dispose(){clearTimeout(o),l?.removeEventListener("abort",i)}}}function I(l){return l?.workerTerminated===!0||
l?.code==="WORKER_TERMINATED"}function k(l,e){return new Promise((t,i)=>{const o=()=>i(T(e.reason));e.addEventListener("\
abort",o,{once:!0}),Promise.resolve(l).then(t,i).finally(()=>e.removeEventListener("abort",o)),e.aborted&&o()})}class z{constructor({
computeManager:e,artifactStore:t,admission:i,runtimeAssets:o,resourceEstimate:n,runtimeDefinition:s=null,runtimeOptions:r={},
moduleUrl:h=s?.moduleUrl??"peercompute:model-inference",baseUrl:p=globalThis.location?.href,createChannel:c=()=>new MessageChannel,
loadTimeoutMs:f=3e5,generationTimeoutMs:E=12e4,allowedManifestCids:g=null,collectGpuEvidence:y=!1}={}){if(!e?.submitTask||
!e.reserveWorkerAffinity||!e.releaseWorkerAffinity||!e.cancelTask||!e.terminateWorkerAffinity||!e.getWorkerAffinityState)
throw new Error("Inference requires managed worker reservation and cancellation APIs");if(!t?.stat||!t.openRead||!i?.acquire)
throw new Error("Inference requires a StateManager artifact store and resource admission");for(const d of typeof n=="fun\
ction"?[]:["cpuBytes","gpuBytes"])if(!Number.isSafeInteger(n?.[d])||n[d]<=0)throw new Error("An explicit measured/config\
ured resident memory envelope is required");for(const d of[f,E])if(!Number.isSafeInteger(d)||d<1||d>30*6e4)throw new Error(
"Invalid inference operation deadline");if(this.computeManager=e,this.artifactStore=t,this.admission=i,this.runtimeDefinition=
s??{id:"transformers.js",validateManifest:L,validateRuntimeAssets:S},typeof this.runtimeDefinition.validateManifest!="fu\
nction"||typeof this.runtimeDefinition.validateRuntimeAssets!="function")throw new Error("A trusted model runtime defini\
tion is required");if(this.runtimeAssets=this.runtimeDefinition.validateRuntimeAssets(o,p),!this.runtimeDefinition.validateRuntimeOptions&&
Object.keys(r).length)throw new Error("This model runtime does not accept runtime options");this.runtimeOptions=this.runtimeDefinition.
validateRuntimeOptions?.(r)??{},this.resourceEstimate=typeof n=="function"?n:{...n},this.moduleUrl=String(h),this.createChannel=
c,this.loadTimeoutMs=f,this.generationTimeoutMs=E,this.allowedManifestCids=g?new Set(g):null,this.collectGpuEvidence=y===
!0,this.session=null,this.queue=[],this.active=null,this.closed=!1,this.lastLoss=null}async loadModel({sessionId:e=crypto.
randomUUID(),manifestCid:t,manifest:i,signal:o,onProgress:n}={}){if(this.closed)throw new Error("Inference service is cl\
osed");if(this.session)throw new Error("Unload the current model before loading another");if(q(e),typeof t!="string"||!t||
t.length>256||this.allowedManifestCids&&!this.allowedManifestCids.has(t))throw new Error("Model manifest is not admitted");
C.parse(t),a(o),this.lastLoss=null;const s={sessionId:e,manifestCid:t,affinityKey:`model:${e}`,status:"loading",reserved:!1};
this.session=s;const r=R(o,this.loadTimeoutMs);s.loadController=r.controller;const h=async()=>{try{const p=this.artifactStore.
getManifest?await this.artifactStore.getManifest(t,{signal:r.controller.signal}):i,c=this.runtimeDefinition.validateManifest(
p);s.manifest=c.manifest,s.runtimeOptions=c.mediaProfile?this.runtimeDefinition.validateRuntimeOptions?.(this.runtimeOptions,
c.mediaProfile)??this.runtimeOptions:this.runtimeOptions,await B(this.artifactStore,s.manifest,r.controller.signal);const f=typeof this.
resourceEstimate=="function"?await this.resourceEstimate(s.manifest,c):this.resourceEstimate;for(const[d,M]of[["cpuBytes",
c.resourcePolicy.minimumCpuBytes],["gpuBytes",c.resourcePolicy.minimumGpuBytes]])if(!Number.isSafeInteger(f?.[d])||f[d]<=
0||f[d]<M)throw new Error(`Model requires an admitted ${d} envelope of at least ${M} bytes`);if(a(r.controller.signal),await this.
computeManager.reserveWorkerAffinity(s.affinityKey),s.reserved=!0,s.workerId=this.#e(s).workerId,a(r.controller.signal),
s.lease=await this.admission.acquire({sessionId:e,manifestCid:t,manifest:s.manifest,estimatedCpuBytes:f.cpuBytes,estimatedGpuBytes:f.
gpuBytes}),!s.lease?.release)throw new Error("Admission did not return a resident resource lease");a(r.controller.signal),
await k(s.lease.assertActive?.(),r.controller.signal),a(r.controller.signal),this.#e(s);const{port1:E,port2:g}=this.createChannel();
s.bridge=W(E,{store:this.artifactStore,manifest:s.manifest}),s.dispatched=!0;const y=await this.computeManager.submitTask(
{id:`${e}-load`,module:this.moduleUrl,exportName:"handleModelTask",data:{command:"load",sessionId:e,manifestCid:t,manifest:s.
manifest,artifactPort:g,runtimeAssets:this.runtimeAssets,runtimeOptions:s.runtimeOptions,collectGpuEvidence:this.collectGpuEvidence},
affinityKey:s.affinityKey,requireWorker:!0,transferables:[g],signal:r.controller.signal,onProgress:n});return a(r.controller.
signal),this.#e(s),await k(s.lease.assertActive?.(),r.controller.signal),a(r.controller.signal),this.#e(s),s.status="rea\
dy",s.evidence=y,y}catch(p){try{s.dispatched&&!I(p)&&await this.computeManager.terminateWorkerAffinity(s.affinityKey,{reason:"\
Model load failed"}),await this.#t(s),this.session===s&&(this.session=null)}catch(c){throw s.status="cleanup-failed",new AggregateError(
[p,c],"Model load failed and cleanup is incomplete")}throw p}finally{r.dispose(),this.runtimeDefinition.retainArtifactBridge||
(await s.bridge?.close(),s.bridge=null),s.loadController=null}};return s.loading=h(),s.loading}generate({requestId:e=crypto.
randomUUID(),sessionId:t=this.session?.sessionId,task:i,messages:o,prompt:n,image:s,audio:r,maxNewTokens:h=A.maxNewTokens,
seed:p,steps:c,width:f,height:E,signal:g,onProgress:y,onToken:d}={}){if(this.closed||this.session?.status!=="ready"||t!==
this.session.sessionId)return Promise.reject(Object.assign(new Error("Requested model is not ready"),{code:"ERR_MODEL_NO\
T_READY"}));const M=this.#n(this.session);if(M)return Promise.reject(M);let m;try{if(q(e),r!=null&&!this.runtimeDefinition.
acceptsAudio)throw new Error("This runtime does not accept audio input");if(this.runtimeDefinition.normalizeGenerationInput)
m=this.runtimeDefinition.normalizeGenerationInput({task:i,messages:o,prompt:n,image:s,audio:r,maxNewTokens:h,seed:p,steps:c,
width:f,height:E},this.session.manifest);else{if(U(s),o=N({messages:o,prompt:n}),this.runtimeDefinition.validateGenerationInput?.(
{image:s,messages:o,maxNewTokens:h}),!Number.isInteger(h)||h<1||h>A.maxNewTokens)throw new Error("Generation exceeds its\
 output-token budget");m={messages:o,image:s,maxNewTokens:h}}a(g)}catch(u){return Promise.reject(u)}if(this.active?.requestId===
e||this.queue.some(u=>u.requestId===e))return Promise.reject(new Error("Duplicate inference request ID"));if(this.active&&
this.queue.length>=A.maxQueued)return Promise.reject(Object.assign(new Error("Inference queue is full"),{code:"ERR_INFER\
ENCE_BUSY"}));const P=this.session,v=R(g,this.generationTimeoutMs),_=m.image?{width:m.image.width,height:m.image.height,
channels:4,data:new Uint8Array(m.image.data)}:void 0,O=m.audio?{samples:new Float32Array(m.audio.samples),sampleRate:m.audio.
sampleRate}:void 0,w={requestId:e,session:P,operation:v,started:!1,data:{...m,command:"generate",sessionId:t,requestId:e,
image:_,...O?{audio:O}:{}},onProgress:u=>{if(!v.controller.signal.aborted)try{y?.(u),u.type==="token"&&d?.(u.text,u)}catch(b){
v.controller.abort(b)}}},D=new Promise((u,b)=>{w.resolve=u,w.reject=b});return w.finished=D.catch(()=>{}),w.abortQueued=
()=>{if(w.started)return;const u=this.queue.indexOf(w);u>=0&&this.queue.splice(u,1),v.dispose(),w.reject(T(v.controller.
signal.reason))},v.controller.signal.addEventListener("abort",w.abortQueued,{once:!0}),this.queue.push(w),this.#o(),D}async#o(){
if(this.active||!this.queue.length)return;const e=this.queue.shift();e.started=!0,this.active=e;try{if(a(e.operation.controller.
signal),this.session!==e.session||e.session.status!=="ready")throw new Error("Model session lost");const t=await this.#a(
e.session,e.operation.controller.signal);if(t)throw t;if(a(e.operation.controller.signal),this.session!==e.session||e.session.
status!=="ready")throw new Error("Requested model is no longer ready");e.dispatched=!0;const i=await this.computeManager.
submitTask({id:`${e.session.sessionId}-generate-${e.requestId}`,module:this.moduleUrl,exportName:"handleModelTask",data:e.
data,affinityKey:e.session.affinityKey,requireWorker:!0,transferables:[...e.data.image?[e.data.image.data.buffer]:[],...e.
data.audio?[e.data.audio.samples.buffer]:[]],signal:e.operation.controller.signal,onProgress:e.onProgress}),o=await this.#a(
e.session,e.operation.controller.signal);if(o)throw o;if(a(e.operation.controller.signal),this.session!==e.session||e.session.
status!=="ready")throw new Error("Requested model is no longer ready");e.resolve(i)}catch(t){const i=this.runtimeDefinition.
terminateOnGenerationAbort===!0&&e.dispatched&&(e.operation.controller.signal.aborted||t?.name==="AbortError"),o=e.dispatched&&
(t?.code==="ERR_MODEL_RESIDENCY_INACTIVE"||this.lastLoss?.sessionId===e.session.sessionId&&this.lastLoss.recoverable===!0||
!i&&(I(t)||t?.code==="ERR_COMPUTE_WORKER_TERMINATION_FAILED"||/GPU device lost|Model session lost/.test(t?.message??"")));
if(t?.code==="ERR_MODEL_RESIDENCY_INACTIVE")this.#s(e.session,t);else if(i||I(t)||t?.code==="ERR_COMPUTE_WORKER_TERMINAT\
ION_FAILED"||/GPU device lost|Model session lost/.test(t?.message??"")){this.#r(e.session,t),e.session.status="lost",this.#i(
"Model worker was lost");try{I(t)||await this.computeManager.terminateWorkerAffinity(e.session.affinityKey,{reason:i?"Mo\
del generation aborted and retired its device":"Model session lost"}),await this.#t(e.session),this.session===e.session&&
(this.session=null)}catch(n){e.session.status="cleanup-failed",t=new AggregateError([t,n],"Lost worker resource cleanup \
failed")}}o&&(t.committed=!0),e.reject(t)}finally{e.operation.dispose(),e.operation.controller.signal.removeEventListener(
"abort",e.abortQueued),this.active=null,this.#o()}}async cancel(e,{reason:t="Caller cancelled inference",timeoutMs:i}={}){
const o=this.active?.requestId===e?this.active:this.queue.find(n=>n.requestId===e);return o?(o.operation.controller.abort(
t),o.started&&(await this.computeManager.cancelTask(`${o.session.sessionId}-generate-${e}`,{reason:t,timeoutMs:i}),await o.
finished),!0):!1}getStatus(){return this.session?.status==="ready"&&this.#n(this.session),{status:this.session?.status??
(this.closed?"closed":"idle"),runtime:this.runtimeDefinition.id,sessionId:this.session?.sessionId??null,manifestCid:this.
session?.manifestCid??null,activeRequestId:this.active?.requestId??null,queuedRequests:this.queue.length,artifactReads:this.
session?.bridge?.getStats()??null,loss:this.lastLoss?{...this.lastLoss}:null,evidence:this.session?.evidence??null}}async status(){
const e=this.getStatus(),t=this.session;if(!t||t.status!=="ready"||this.active)return e;let i;try{i=await this.computeManager.
submitTask({module:this.moduleUrl,exportName:"handleModelTask",data:{command:"status",sessionId:t.sessionId},affinityKey:t.
affinityKey,requireWorker:!0})}catch(o){throw(I(o)||/GPU device lost|Model session lost/.test(o?.message??""))&&this.#s(
t,o),o}return this.session===t&&["lost","absent","unloaded"].includes(i.status)&&this.#s(t,new Error("Model session lost\
: resident worker reported an unavailable runtime")),i}#e(e){const t=this.computeManager.getWorkerAffinityState(e.affinityKey);
if(!e.reserved||!t?.reserved||t.workerId==null||e.workerId!=null&&e.workerId!==t.workerId)throw new Error("Model session\
 lost: the original managed resident worker is unavailable");return t}#s(e,t){this.session!==e||["unloading","cleanup-fa\
iled"].includes(e.status)||(this.#r(e,t),e.status="lost",this.#i(t.message),this.active?.session===e&&this.active.operation.
controller.abort(t))}#r(e,t){e.intendedUnload||this.closed||this.lastLoss?.sessionId!==e.sessionId&&(this.lastLoss={manifestCid:e.
manifestCid,sessionId:e.sessionId,recoverable:!0,code:String(t?.code??"ERR_MODEL_SESSION_LOST"),message:String(t?.message??
t).slice(0,2048)})}#n(e){try{this.#e(e);const t=e.lease?.assertActiveSync?.();if(t?.then)throw Promise.resolve(t).catch(
()=>{}),new TypeError("Resident synchronous health check must not return a promise");return null}catch(t){return this.#l(
e,t)}}async#a(e,t){try{if(this.#e(e),await k(e.lease?.assertActive?.(),t),a(t),this.session!==e||e.status!=="ready")throw new Error(
"Requested model is no longer ready");return this.#e(e),null}catch(i){if(t.aborted)throw T(t.reason);if(this.session!==e||
e.status==="unloading")throw i;return this.#l(e,i)}}#l(e,t){const i=Object.assign(new Error(String(t?.message??t),{cause:t}),
{code:"ERR_MODEL_RESIDENCY_INACTIVE"});return this.#s(e,i),i}#i(e){for(const t of[...this.queue])t.operation.controller.
abort(e)}async#t(e){await e.bridge?.close(),e.bridge=null,e.lease&&(await e.lease.release(),e.lease=null),e.reserved&&(await this.
computeManager.releaseWorkerAffinity(e.affinityKey),e.reserved=!1)}async unloadModel(){this.lastLoss=null;const e=this.session;
if(!e)return{status:"absent"};if(e.intendedUnload=!0,e.unloadingPromise)return e.unloadingPromise;const t=this.#d(e);e.unloadingPromise=
t;try{return await t}finally{e.unloadingPromise===t&&(e.unloadingPromise=null)}}async#d(e){if(this.#i("Model is unloadin\
g"),e.status==="loading"){if(e.loadController?.abort("Model load cancelled by unload"),await e.loading.catch(()=>{}),this.
session===e)throw new Error("Model cleanup is incomplete; admission remains held");return{sessionId:e.sessionId,status:"\
unloaded"}}if(e.status==="cleanup-failed"||e.status==="lost")return this.active?.session===e&&await this.cancel(this.active.
requestId,{reason:"Lost model is unloading"}),this.session!==e?{sessionId:e.sessionId,status:"unloaded"}:(await this.computeManager.
terminateWorkerAffinity(e.affinityKey,{reason:"Retry model cleanup"}),await this.#t(e),this.session=null,{sessionId:e.sessionId,
status:"unloaded",workerTerminated:!0});if(e.status="unloading",this.active&&await this.cancel(this.active.requestId,{reason:"\
Model is unloading"}),this.session!==e)return{sessionId:e.sessionId,status:"unloaded"};const t=R(void 0,this.generationTimeoutMs);
try{if(this.runtimeDefinition.terminateOnUnload)return await this.computeManager.terminateWorkerAffinity(e.affinityKey,{
reason:"Model runtime unloaded"}),await this.#t(e),this.session=null,{sessionId:e.sessionId,status:"unloaded",workerTerminated:!0};
const i=await this.computeManager.submitTask({id:`${e.sessionId}-unload`,module:this.moduleUrl,exportName:"handleModelTa\
sk",data:{command:"unload",sessionId:e.sessionId},affinityKey:e.affinityKey,requireWorker:!0,signal:t.controller.signal});
return await this.#t(e),this.session=null,i}catch(i){try{I(i)||await this.computeManager.terminateWorkerAffinity(e.affinityKey,
{reason:"Model disposal failed"}),await this.#t(e),this.session=null}catch(o){throw e.status="cleanup-failed",new AggregateError(
[i,o],"Model disposal failed and cleanup is incomplete")}throw i}finally{t.dispose()}}async dispose(){return this.closed=
!0,this.unloadModel()}}export{z as ModelInferenceService};
