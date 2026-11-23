import{b9 as S,ba as L,bb as C,bc as P,bd as U,be as a,M as k,bf as N,bg as W,bh as K,bi as D,bj as x,bk as j,bl as B}from"./main-BwcRkruW.js";
import"./index-By6DRDnn.js";async function G(l,e,t){if(e.model.runtime!=="transformers.js"||!e.model.memoryProfile)return;
const i=e.files.find(r=>r.path==="config.json");if(!i||i.size>j.maximumConfigBytes)throw new Error("Model config exceeds\
 its metadata budget");const o=await l.stat(i.cid,{signal:t});if(a(t),o?.status!=="complete"||o.size!==i.size||o.sha256!==
i.sha256)throw new Error("Model config is not verified locally");const n=new Uint8Array(i.size);let s=0;for await(const r of await l.
openRead(i.cid,{signal:t})){if(a(t),!(r instanceof Uint8Array)||r.length>n.length-s)throw new Error("Invalid model confi\
g bytes");n.set(r,s),s+=r.length}if(a(t),s!==n.length)throw new Error("Incomplete model config");B(e.model,JSON.parse(new TextDecoder(
"utf-8",{fatal:!0}).decode(n)))}function R(l,e){const t=new AbortController,i=()=>t.abort(l?.reason??"Cancelled");l?.addEventListener(
"abort",i,{once:!0}),l?.aborted&&i();const o=setTimeout(()=>t.abort("Model operation deadline exceeded"),e);return o.unref?.(),
{controller:t,dispose(){clearTimeout(o),l?.removeEventListener("abort",i)}}}function I(l){return l?.workerTerminated===!0||
l?.code==="WORKER_TERMINATED"}function T(l,e){return new Promise((t,i)=>{const o=()=>i(D(e.reason));e.addEventListener("\
abort",o,{once:!0}),Promise.resolve(l).then(t,i).finally(()=>e.removeEventListener("abort",o)),e.aborted&&o()})}class Y{constructor({
computeManager:e,artifactStore:t,admission:i,runtimeAssets:o,resourceEstimate:n,runtimeDefinition:s=null,runtimeOptions:r={},
moduleUrl:m=s?.moduleUrl??"peercompute:model-inference",baseUrl:w=globalThis.location?.href,createChannel:c=()=>new MessageChannel,
loadTimeoutMs:f=3e5,generationTimeoutMs:b=12e4,allowedManifestCids:g=null,collectGpuEvidence:v=!1,onModelEvidence:E}={}){
if(!e?.submitTask||!e.reserveWorkerAffinity||!e.releaseWorkerAffinity||!e.cancelTask||!e.terminateWorkerAffinity||!e.getWorkerAffinityState)
throw new Error("Inference requires managed worker reservation and cancellation APIs");if(!t?.stat||!t.openRead||!i?.acquire)
throw new Error("Inference requires a StateManager artifact store and resource admission");for(const h of typeof n=="fun\
ction"?[]:["cpuBytes","gpuBytes"])if(!Number.isSafeInteger(n?.[h])||n[h]<=0)throw new Error("An explicit measured/config\
ured resident memory envelope is required");for(const h of[f,b])if(!Number.isSafeInteger(h)||h<1||h>30*6e4)throw new Error(
"Invalid inference operation deadline");if(this.computeManager=e,this.artifactStore=t,this.admission=i,this.runtimeDefinition=
s??{id:"transformers.js",validateManifest:L,validateRuntimeAssets:S},typeof this.runtimeDefinition.validateManifest!="fu\
nction"||typeof this.runtimeDefinition.validateRuntimeAssets!="function")throw new Error("A trusted model runtime defini\
tion is required");if(this.runtimeAssets=this.runtimeDefinition.validateRuntimeAssets(o,w),!this.runtimeDefinition.validateRuntimeOptions&&
Object.keys(r).length)throw new Error("This model runtime does not accept runtime options");this.runtimeOptions=this.runtimeDefinition.
validateRuntimeOptions?.(r)??{},this.resourceEstimate=typeof n=="function"?n:{...n},this.moduleUrl=String(m),this.createChannel=
c,this.loadTimeoutMs=f,this.generationTimeoutMs=b,this.allowedManifestCids=g?new Set(g):null,this.collectGpuEvidence=v===
!0,this.onModelEvidence=E,this.session=null,this.queue=[],this.active=null,this.closed=!1,this.lastLoss=null}#s(e,t,i={}){
if(typeof this.onModelEvidence=="function")try{const o=C({entry:e,stage:t,runtime:this.runtimeDefinition.id,...i});Promise.
resolve(this.onModelEvidence(o)).catch(()=>{})}catch{}}async loadModel({sessionId:e=crypto.randomUUID(),manifestCid:t,manifest:i,
signal:o,onProgress:n}={}){if(this.closed)throw new Error("Inference service is closed");if(this.session)throw new Error(
"Unload the current model before loading another");if(P(e),typeof t!="string"||!t||t.length>256||this.allowedManifestCids&&
!this.allowedManifestCids.has(t))throw new Error("Model manifest is not admitted");U.parse(t),a(o),this.lastLoss=null;const s={
sessionId:e,manifestCid:t,affinityKey:`model:${e}`,status:"loading",reserved:!1,startedAt:performance.now()};this.session=
s;const r=R(o,this.loadTimeoutMs);s.loadController=r.controller;const m=async()=>{try{const w=this.artifactStore.getManifest?
await this.artifactStore.getManifest(t,{signal:r.controller.signal}):i,c=this.runtimeDefinition.validateManifest(w);s.manifest=
c.manifest,s.runtimeOptions=c.mediaProfile?this.runtimeDefinition.validateRuntimeOptions?.(this.runtimeOptions,c.mediaProfile)??
this.runtimeOptions:this.runtimeOptions,await G(this.artifactStore,s.manifest,r.controller.signal);const f=typeof this.resourceEstimate==
"function"?await this.resourceEstimate(s.manifest,c):this.resourceEstimate;s.estimate=f;for(const[E,h]of[["cpuBytes",c.resourcePolicy.
minimumCpuBytes],["gpuBytes",c.resourcePolicy.minimumGpuBytes]])if(!Number.isSafeInteger(f?.[E])||f[E]<=0||f[E]<h)throw new Error(
`Model requires an admitted ${E} envelope of at least ${h} bytes`);if(a(r.controller.signal),await this.computeManager.reserveWorkerAffinity(
s.affinityKey),s.reserved=!0,s.workerId=this.#e(s).workerId,a(r.controller.signal),s.lease=await this.admission.acquire(
{sessionId:e,manifestCid:t,manifest:s.manifest,estimatedCpuBytes:f.cpuBytes,estimatedGpuBytes:f.gpuBytes}),!s.lease?.release)
throw new Error("Admission did not return a resident resource lease");a(r.controller.signal),await T(s.lease.assertActive?.(),
r.controller.signal),a(r.controller.signal),this.#e(s);const{port1:b,port2:g}=this.createChannel();s.bridge=x(b,{store:this.
artifactStore,manifest:s.manifest}),s.dispatched=!0;const v=await this.computeManager.submitTask({id:`${e}-load`,module:this.
moduleUrl,exportName:"handleModelTask",data:{command:"load",sessionId:e,manifestCid:t,manifest:s.manifest,artifactPort:g,
runtimeAssets:this.runtimeAssets,runtimeOptions:s.runtimeOptions,collectGpuEvidence:this.collectGpuEvidence},affinityKey:s.
affinityKey,requireWorker:!0,transferables:[g],signal:r.controller.signal,onProgress:n});return a(r.controller.signal),this.#e(
s),await T(s.lease.assertActive?.(),r.controller.signal),a(r.controller.signal),this.#e(s),s.status="ready",s.evidence=v,
this.#s(s,"load",{result:v,startedAt:s.startedAt}),v}catch(w){this.#s(s,"load",{error:w,startedAt:s.startedAt});try{s.dispatched&&
!I(w)&&await this.computeManager.terminateWorkerAffinity(s.affinityKey,{reason:"Model load failed"}),await this.#t(s),this.
session===s&&(this.session=null)}catch(c){throw s.status="cleanup-failed",new AggregateError([w,c],"Model load failed an\
d cleanup is incomplete")}throw w}finally{r.dispose(),this.runtimeDefinition.retainArtifactBridge||(await s.bridge?.close(),
s.bridge=null),s.loadController=null}};return s.loading=m(),s.loading}generate({requestId:e=crypto.randomUUID(),sessionId:t=this.
session?.sessionId,task:i,messages:o,prompt:n,image:s,audio:r,maxNewTokens:m=k.maxNewTokens,seed:w,steps:c,width:f,height:b,
signal:g,onProgress:v,onToken:E}={}){if(this.closed||this.session?.status!=="ready"||t!==this.session.sessionId)return Promise.
reject(Object.assign(new Error("Requested model is not ready"),{code:"ERR_MODEL_NOT_READY"}));const h=this.#a(this.session);
if(h)return Promise.reject(h);let d;try{if(P(e),r!=null&&!this.runtimeDefinition.acceptsAudio)throw new Error("This runt\
ime does not accept audio input");if(this.runtimeDefinition.normalizeGenerationInput)d=this.runtimeDefinition.normalizeGenerationInput(
{task:i,messages:o,prompt:n,image:s,audio:r,maxNewTokens:m,seed:w,steps:c,width:f,height:b},this.session.manifest);else{
if(N(s),o=W({messages:o,prompt:n}),this.runtimeDefinition.validateGenerationInput?.({image:s,messages:o,maxNewTokens:m}),
!Number.isInteger(m)||m<1||m>k.maxNewTokens)throw new Error("Generation exceeds its output-token budget");d={messages:o,
image:s,maxNewTokens:m}}a(g)}catch(u){return Promise.reject(u)}if(this.active?.requestId===e||this.queue.some(u=>u.requestId===
e))return Promise.reject(new Error("Duplicate inference request ID"));if(this.active&&this.queue.length>=k.maxQueued)return Promise.
reject(Object.assign(new Error("Inference queue is full"),{code:"ERR_INFERENCE_BUSY"}));const M=this.session,y=R(g,this.
generationTimeoutMs),_=d.image?{width:d.image.width,height:d.image.height,channels:4,data:new Uint8Array(d.image.data)}:
void 0,O=d.audio?{samples:new Float32Array(d.audio.samples),sampleRate:d.audio.sampleRate}:void 0,p={requestId:e,session:M,
operation:y,started:!1,workload:K(d,i??d.task??(M.manifest.model.task==="image-text-to-text"&&!d.image?"text-generation":
M.manifest.model.task)),data:{...d,command:"generate",sessionId:t,requestId:e,image:_,...O?{audio:O}:{}},onProgress:u=>{
if(!y.controller.signal.aborted)try{v?.(u),u.type==="token"&&E?.(u.text,u)}catch(A){y.controller.abort(A)}}},q=new Promise(
(u,A)=>{p.resolve=u,p.reject=A});return p.finished=q.catch(()=>{}),p.abortQueued=()=>{if(p.started)return;const u=this.queue.
indexOf(p);u>=0&&this.queue.splice(u,1),y.dispose(),p.reject(D(y.controller.signal.reason))},y.controller.signal.addEventListener(
"abort",p.abortQueued,{once:!0}),this.queue.push(p),this.#r(),q}async#r(){if(this.active||!this.queue.length)return;const e=this.
queue.shift();e.started=!0,e.startedAt=performance.now(),this.active=e;try{if(a(e.operation.controller.signal),this.session!==
e.session||e.session.status!=="ready")throw new Error("Model session lost");const t=await this.#l(e.session,e.operation.
controller.signal);if(t)throw t;if(a(e.operation.controller.signal),this.session!==e.session||e.session.status!=="ready")
throw new Error("Requested model is no longer ready");e.dispatched=!0;const i=await this.computeManager.submitTask({id:`${e.
session.sessionId}-generate-${e.requestId}`,module:this.moduleUrl,exportName:"handleModelTask",data:e.data,affinityKey:e.
session.affinityKey,requireWorker:!0,transferables:[...e.data.image?[e.data.image.data.buffer]:[],...e.data.audio?[e.data.
audio.samples.buffer]:[]],signal:e.operation.controller.signal,onProgress:e.onProgress}),o=await this.#l(e.session,e.operation.
controller.signal);if(o)throw o;if(a(e.operation.controller.signal),this.session!==e.session||e.session.status!=="ready")
throw new Error("Requested model is no longer ready");this.#s(e.session,"generation",{result:i,startedAt:e.startedAt,workload:e.
workload}),e.resolve(i)}catch(t){this.#s(e.session,"generation",{error:t,startedAt:e.startedAt,workload:e.workload});const i=this.
runtimeDefinition.terminateOnGenerationAbort===!0&&e.dispatched&&(e.operation.controller.signal.aborted||t?.name==="Abor\
tError"),o=e.dispatched&&(t?.code==="ERR_MODEL_RESIDENCY_INACTIVE"||this.lastLoss?.sessionId===e.session.sessionId&&this.
lastLoss.recoverable===!0||!i&&(I(t)||t?.code==="ERR_COMPUTE_WORKER_TERMINATION_FAILED"||/GPU device lost|Model session lost/.
test(t?.message??"")));if(t?.code==="ERR_MODEL_RESIDENCY_INACTIVE")this.#i(e.session,t);else if(i||I(t)||t?.code==="ERR_\
COMPUTE_WORKER_TERMINATION_FAILED"||/GPU device lost|Model session lost/.test(t?.message??"")){this.#n(e.session,t),e.session.
status="lost",this.#o("Model worker was lost");try{I(t)||await this.computeManager.terminateWorkerAffinity(e.session.affinityKey,
{reason:i?"Model generation aborted and retired its device":"Model session lost"}),await this.#t(e.session),this.session===
e.session&&(this.session=null)}catch(n){e.session.status="cleanup-failed",t=new AggregateError([t,n],"Lost worker resour\
ce cleanup failed")}}o&&(t.committed=!0),e.reject(t)}finally{e.operation.dispose(),e.operation.controller.signal.removeEventListener(
"abort",e.abortQueued),this.active=null,this.#r()}}async cancel(e,{reason:t="Caller cancelled inference",timeoutMs:i}={}){
const o=this.active?.requestId===e?this.active:this.queue.find(n=>n.requestId===e);return o?(o.operation.controller.abort(
t),o.started&&(await this.computeManager.cancelTask(`${o.session.sessionId}-generate-${e}`,{reason:t,timeoutMs:i}),await o.
finished),!0):!1}getStatus(){return this.session?.status==="ready"&&this.#a(this.session),{status:this.session?.status??
(this.closed?"closed":"idle"),runtime:this.runtimeDefinition.id,sessionId:this.session?.sessionId??null,manifestCid:this.
session?.manifestCid??null,activeRequestId:this.active?.requestId??null,queuedRequests:this.queue.length,artifactReads:this.
session?.bridge?.getStats()??null,loss:this.lastLoss?{...this.lastLoss}:null,evidence:this.session?.evidence??null}}async status(){
const e=this.getStatus(),t=this.session;if(!t||t.status!=="ready"||this.active)return e;let i;try{i=await this.computeManager.
submitTask({module:this.moduleUrl,exportName:"handleModelTask",data:{command:"status",sessionId:t.sessionId},affinityKey:t.
affinityKey,requireWorker:!0})}catch(o){throw(I(o)||/GPU device lost|Model session lost/.test(o?.message??""))&&this.#i(
t,o),o}return this.session===t&&["lost","absent","unloaded"].includes(i.status)&&this.#i(t,new Error("Model session lost\
: resident worker reported an unavailable runtime")),i}#e(e){const t=this.computeManager.getWorkerAffinityState(e.affinityKey);
if(!e.reserved||!t?.reserved||t.workerId==null||e.workerId!=null&&e.workerId!==t.workerId)throw new Error("Model session\
 lost: the original managed resident worker is unavailable");return t}#i(e,t){this.session!==e||["unloading","cleanup-fa\
iled"].includes(e.status)||(this.#n(e,t),e.status="lost",this.#o(t.message),this.active?.session===e&&this.active.operation.
controller.abort(t))}#n(e,t){e.intendedUnload||this.closed||this.lastLoss?.sessionId!==e.sessionId&&(this.#s(e,"device-l\
oss",{error:t}),this.lastLoss={manifestCid:e.manifestCid,sessionId:e.sessionId,recoverable:!0,code:String(t?.code??"ERR_\
MODEL_SESSION_LOST"),message:String(t?.message??t).slice(0,2048)})}#a(e){try{this.#e(e);const t=e.lease?.assertActiveSync?.();
if(t?.then)throw Promise.resolve(t).catch(()=>{}),new TypeError("Resident synchronous health check must not return a pro\
mise");return null}catch(t){return this.#d(e,t)}}async#l(e,t){try{if(this.#e(e),await T(e.lease?.assertActive?.(),t),a(t),
this.session!==e||e.status!=="ready")throw new Error("Requested model is no longer ready");return this.#e(e),null}catch(i){
if(t.aborted)throw D(t.reason);if(this.session!==e||e.status==="unloading")throw i;return this.#d(e,i)}}#d(e,t){const i=Object.
assign(new Error(String(t?.message??t),{cause:t}),{code:"ERR_MODEL_RESIDENCY_INACTIVE"});return this.#i(e,i),i}#o(e){for(const t of[
...this.queue])t.operation.controller.abort(e)}async#t(e){await e.bridge?.close(),e.bridge=null,e.lease&&(await e.lease.
release(),e.lease=null),e.reserved&&(await this.computeManager.releaseWorkerAffinity(e.affinityKey),e.reserved=!1)}async unloadModel(){
this.lastLoss=null;const e=this.session;if(!e)return{status:"absent"};if(e.intendedUnload=!0,e.unloadingPromise)return e.
unloadingPromise;const t=this.#u(e);e.unloadingPromise=t;try{return await t}finally{e.unloadingPromise===t&&(e.unloadingPromise=
null)}}async#u(e){if(this.#o("Model is unloading"),e.status==="loading"){if(e.loadController?.abort("Model load cancelle\
d by unload"),await e.loading.catch(()=>{}),this.session===e)throw new Error("Model cleanup is incomplete; admission rem\
ains held");return{sessionId:e.sessionId,status:"unloaded"}}if(e.status==="cleanup-failed"||e.status==="lost")return this.
active?.session===e&&await this.cancel(this.active.requestId,{reason:"Lost model is unloading"}),this.session!==e?{sessionId:e.
sessionId,status:"unloaded"}:(await this.computeManager.terminateWorkerAffinity(e.affinityKey,{reason:"Retry model clean\
up"}),await this.#t(e),this.session=null,{sessionId:e.sessionId,status:"unloaded",workerTerminated:!0});if(e.status="unl\
oading",this.active&&await this.cancel(this.active.requestId,{reason:"Model is unloading"}),this.session!==e)return{sessionId:e.
sessionId,status:"unloaded"};const t=R(void 0,this.generationTimeoutMs);try{if(this.runtimeDefinition.terminateOnUnload)
return await this.computeManager.terminateWorkerAffinity(e.affinityKey,{reason:"Model runtime unloaded"}),await this.#t(
e),this.session=null,{sessionId:e.sessionId,status:"unloaded",workerTerminated:!0};const i=await this.computeManager.submitTask(
{id:`${e.sessionId}-unload`,module:this.moduleUrl,exportName:"handleModelTask",data:{command:"unload",sessionId:e.sessionId},
affinityKey:e.affinityKey,requireWorker:!0,signal:t.controller.signal});return await this.#t(e),this.session=null,i}catch(i){
try{I(i)||await this.computeManager.terminateWorkerAffinity(e.affinityKey,{reason:"Model disposal failed"}),await this.#t(
e),this.session=null}catch(o){throw e.status="cleanup-failed",new AggregateError([i,o],"Model disposal failed and cleanu\
p is incomplete")}throw i}finally{t.dispose()}}async dispose(){return this.closed=!0,this.unloadModel()}}export{Y as ModelInferenceService};
