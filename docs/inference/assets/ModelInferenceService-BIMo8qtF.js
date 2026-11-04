import{ae as D,af as S,ag as T,ah as W,ai as u,aj as b,ak as K,al as O,am as q,an as U}from"./main-Bi25mBGM.js";import"./index-Douplpni.js";
function k(c,e){const t=new AbortController,i=()=>t.abort(c?.reason??"Cancelled");c?.addEventListener("abort",i,{once:!0}),
c?.aborted&&i();const r=setTimeout(()=>t.abort("Model operation deadline exceeded"),e);return r.unref?.(),{controller:t,
dispose(){clearTimeout(r),c?.removeEventListener("abort",i)}}}function I(c){return c?.workerTerminated===!0||c?.code==="\
WORKER_TERMINATED"}function A(c,e){return new Promise((t,i)=>{const r=()=>i(q(e.reason));e.addEventListener("abort",r,{once:!0}),
Promise.resolve(c).then(t,i).finally(()=>e.removeEventListener("abort",r)),e.aborted&&r()})}class L{constructor({computeManager:e,
artifactStore:t,admission:i,runtimeAssets:r,resourceEstimate:a,runtimeDefinition:s=null,runtimeOptions:n={},moduleUrl:v=s?.
moduleUrl??"peercompute:model-inference",baseUrl:f=globalThis.location?.href,createChannel:h=()=>new MessageChannel,loadTimeoutMs:d=3e5,
generationTimeoutMs:p=12e4,allowedManifestCids:w=null,collectGpuEvidence:g=!1}={}){if(!e?.submitTask||!e.reserveWorkerAffinity||
!e.releaseWorkerAffinity||!e.cancelTask||!e.terminateWorkerAffinity||!e.getWorkerAffinityState)throw new Error("Inferenc\
e requires managed worker reservation and cancellation APIs");if(!t?.stat||!t.openRead||!i?.acquire)throw new Error("Inf\
erence requires a StateManager artifact store and resource admission");for(const o of typeof a=="function"?[]:["cpuBytes",
"gpuBytes"])if(!Number.isSafeInteger(a?.[o])||a[o]<=0)throw new Error("An explicit measured/configured resident memory e\
nvelope is required");for(const o of[d,p])if(!Number.isSafeInteger(o)||o<1||o>30*6e4)throw new Error("Invalid inference \
operation deadline");if(this.computeManager=e,this.artifactStore=t,this.admission=i,this.runtimeDefinition=s??{id:"trans\
formers.js",validateManifest:S,validateRuntimeAssets:D},typeof this.runtimeDefinition.validateManifest!="function"||typeof this.
runtimeDefinition.validateRuntimeAssets!="function")throw new Error("A trusted model runtime definition is required");if(this.
runtimeAssets=this.runtimeDefinition.validateRuntimeAssets(r,f),!this.runtimeDefinition.validateRuntimeOptions&&Object.keys(
n).length)throw new Error("This model runtime does not accept runtime options");this.runtimeOptions=this.runtimeDefinition.
validateRuntimeOptions?.(n)??{},this.resourceEstimate=typeof a=="function"?a:{...a},this.moduleUrl=String(v),this.createChannel=
h,this.loadTimeoutMs=d,this.generationTimeoutMs=p,this.allowedManifestCids=w?new Set(w):null,this.collectGpuEvidence=g===
!0,this.session=null,this.queue=[],this.active=null,this.closed=!1}async loadModel({sessionId:e=crypto.randomUUID(),manifestCid:t,
manifest:i,signal:r,onProgress:a}={}){if(this.closed)throw new Error("Inference service is closed");if(this.session)throw new Error(
"Unload the current model before loading another");if(T(e),typeof t!="string"||!t||t.length>256||this.allowedManifestCids&&
!this.allowedManifestCids.has(t))throw new Error("Model manifest is not admitted");W.parse(t),u(r);const s={sessionId:e,
manifestCid:t,affinityKey:`model:${e}`,status:"loading",reserved:!1};this.session=s;const n=k(r,this.loadTimeoutMs);s.loadController=
n.controller;const v=async()=>{try{const f=this.artifactStore.getManifest?await this.artifactStore.getManifest(t,{signal:n.
controller.signal}):i,h=this.runtimeDefinition.validateManifest(f);s.manifest=h.manifest;const d=typeof this.resourceEstimate==
"function"?await this.resourceEstimate(s.manifest,h):this.resourceEstimate;for(const[o,E]of[["cpuBytes",h.resourcePolicy.
minimumCpuBytes],["gpuBytes",h.resourcePolicy.minimumGpuBytes]])if(!Number.isSafeInteger(d?.[o])||d[o]<=0||d[o]<E)throw new Error(
`Model requires an admitted ${o} envelope of at least ${E} bytes`);if(u(n.controller.signal),await this.computeManager.reserveWorkerAffinity(
s.affinityKey),s.reserved=!0,s.workerId=this.#e(s).workerId,u(n.controller.signal),s.lease=await this.admission.acquire(
{sessionId:e,manifestCid:t,manifest:s.manifest,estimatedCpuBytes:d.cpuBytes,estimatedGpuBytes:d.gpuBytes}),!s.lease?.release)
throw new Error("Admission did not return a resident resource lease");u(n.controller.signal),await A(s.lease.assertActive?.(),
n.controller.signal),u(n.controller.signal),this.#e(s);const{port1:p,port2:w}=this.createChannel();s.bridge=U(p,{store:this.
artifactStore,manifest:s.manifest}),s.dispatched=!0;const g=await this.computeManager.submitTask({id:`${e}-load`,module:this.
moduleUrl,exportName:"handleModelTask",data:{command:"load",sessionId:e,manifestCid:t,manifest:s.manifest,artifactPort:w,
runtimeAssets:this.runtimeAssets,runtimeOptions:this.runtimeOptions,collectGpuEvidence:this.collectGpuEvidence},affinityKey:s.
affinityKey,requireWorker:!0,transferables:[w],signal:n.controller.signal,onProgress:a});return u(n.controller.signal),this.#e(
s),await A(s.lease.assertActive?.(),n.controller.signal),u(n.controller.signal),this.#e(s),s.status="ready",s.evidence=g,
g}catch(f){try{s.dispatched&&!I(f)&&await this.computeManager.terminateWorkerAffinity(s.affinityKey,{reason:"Model load \
failed"}),await this.#t(s),this.session===s&&(this.session=null)}catch(h){throw s.status="cleanup-failed",new AggregateError(
[f,h],"Model load failed and cleanup is incomplete")}throw f}finally{n.dispose(),this.runtimeDefinition.retainArtifactBridge||
(await s.bridge?.close(),s.bridge=null),s.loadController=null}};return s.loading=v(),s.loading}generate({requestId:e=crypto.
randomUUID(),sessionId:t=this.session?.sessionId,messages:i,prompt:r,image:a,maxNewTokens:s=b.maxNewTokens,seed:n,steps:v,
width:f,height:h,signal:d,onProgress:p,onToken:w}={}){if(this.closed||this.session?.status!=="ready"||t!==this.session.sessionId)
return Promise.reject(new Error("Requested model is not ready"));const g=this.#o(this.session);if(g)return Promise.reject(
g);let o;try{if(T(e),this.runtimeDefinition.normalizeGenerationInput)o=this.runtimeDefinition.normalizeGenerationInput({
messages:i,prompt:r,image:a,maxNewTokens:s,seed:n,steps:v,width:f,height:h},this.session.manifest);else{if(K(a),i=O({messages:i,
prompt:r}),this.runtimeDefinition.validateGenerationInput?.({image:a,messages:i,maxNewTokens:s}),!Number.isInteger(s)||s<
1||s>b.maxNewTokens)throw new Error("Generation exceeds its output-token budget");o={messages:i,image:a,maxNewTokens:s}}
u(d)}catch(l){return Promise.reject(l)}if(this.active?.requestId===e||this.queue.some(l=>l.requestId===e))return Promise.
reject(new Error("Duplicate inference request ID"));if(this.active&&this.queue.length>=b.maxQueued)return Promise.reject(
new Error("Inference queue is full"));const E=this.session,y=k(d,this.generationTimeoutMs),P=o.image?{width:o.image.width,
height:o.image.height,channels:4,data:new Uint8Array(o.image.data)}:void 0,m={requestId:e,session:E,operation:y,started:!1,
data:{...o,command:"generate",sessionId:t,requestId:e,image:P},onProgress:l=>{if(!y.controller.signal.aborted)try{p?.(l),
l.type==="token"&&w?.(l.text,l)}catch(M){y.controller.abort(M)}}},R=new Promise((l,M)=>{m.resolve=l,m.reject=M});return m.
finished=R.catch(()=>{}),m.abortQueued=()=>{if(m.started)return;const l=this.queue.indexOf(m);l>=0&&this.queue.splice(l,
1),y.dispose(),m.reject(q(y.controller.signal.reason))},y.controller.signal.addEventListener("abort",m.abortQueued,{once:!0}),
this.queue.push(m),this.#r(),R}async#r(){if(this.active||!this.queue.length)return;const e=this.queue.shift();e.started=
!0,this.active=e;try{if(u(e.operation.controller.signal),this.session!==e.session||e.session.status!=="ready")throw new Error(
"Model session lost");const t=await this.#n(e.session,e.operation.controller.signal);if(t)throw t;if(u(e.operation.controller.
signal),this.session!==e.session||e.session.status!=="ready")throw new Error("Requested model is no longer ready");const i=await this.
computeManager.submitTask({id:`${e.session.sessionId}-generate-${e.requestId}`,module:this.moduleUrl,exportName:"handleM\
odelTask",data:e.data,affinityKey:e.session.affinityKey,requireWorker:!0,transferables:e.data.image?[e.data.image.data.buffer]:
[],signal:e.operation.controller.signal,onProgress:e.onProgress}),r=await this.#n(e.session,e.operation.controller.signal);
if(r)throw r;if(u(e.operation.controller.signal),this.session!==e.session||e.session.status!=="ready")throw new Error("R\
equested model is no longer ready");e.resolve(i)}catch(t){if(t?.code==="ERR_MODEL_RESIDENCY_INACTIVE")this.#s(e.session,
t);else if(I(t)||t?.code==="ERR_COMPUTE_WORKER_TERMINATION_FAILED"||/GPU device lost|Model session lost/.test(t?.message??
"")){e.session.status="lost",this.#i("Model worker was lost");try{I(t)||await this.computeManager.terminateWorkerAffinity(
e.session.affinityKey,{reason:"Model session lost"}),await this.#t(e.session),this.session===e.session&&(this.session=null)}catch(i){
e.session.status="cleanup-failed",t=new AggregateError([t,i],"Lost worker resource cleanup failed")}}e.reject(t)}finally{
e.operation.dispose(),e.operation.controller.signal.removeEventListener("abort",e.abortQueued),this.active=null,this.#r()}}async cancel(e,{
reason:t="Caller cancelled inference",timeoutMs:i}={}){const r=this.active?.requestId===e?this.active:this.queue.find(a=>a.
requestId===e);return r?(r.operation.controller.abort(t),r.started&&(await this.computeManager.cancelTask(`${r.session.sessionId}\
-generate-${e}`,{reason:t,timeoutMs:i}),await r.finished),!0):!1}getStatus(){return this.session?.status==="ready"&&this.#o(
this.session),{status:this.session?.status??(this.closed?"closed":"idle"),runtime:this.runtimeDefinition.id,sessionId:this.
session?.sessionId??null,manifestCid:this.session?.manifestCid??null,activeRequestId:this.active?.requestId??null,queuedRequests:this.
queue.length,artifactReads:this.session?.bridge?.getStats()??null,evidence:this.session?.evidence??null}}async status(){
const e=this.getStatus(),t=this.session;if(!t||t.status!=="ready"||this.active)return e;const i=await this.computeManager.
submitTask({module:this.moduleUrl,exportName:"handleModelTask",data:{command:"status",sessionId:t.sessionId},affinityKey:t.
affinityKey,requireWorker:!0});return this.session===t&&["lost","absent","unloaded"].includes(i.status)&&this.#s(t,new Error(
"Model session lost: resident worker reported an unavailable runtime")),i}#e(e){const t=this.computeManager.getWorkerAffinityState(
e.affinityKey);if(!e.reserved||!t?.reserved||t.workerId==null||e.workerId!=null&&e.workerId!==t.workerId)throw new Error(
"Model session lost: the original managed resident worker is unavailable");return t}#s(e,t){this.session!==e||["unloadin\
g","cleanup-failed"].includes(e.status)||(e.status="lost",this.#i(t.message),this.active?.session===e&&this.active.operation.
controller.abort(t))}#o(e){try{this.#e(e);const t=e.lease?.assertActiveSync?.();if(t?.then)throw Promise.resolve(t).catch(
()=>{}),new TypeError("Resident synchronous health check must not return a promise");return null}catch(t){return this.#a(
e,t)}}async#n(e,t){try{if(this.#e(e),await A(e.lease?.assertActive?.(),t),u(t),this.session!==e||e.status!=="ready")throw new Error(
"Requested model is no longer ready");return this.#e(e),null}catch(i){if(t.aborted)throw q(t.reason);if(this.session!==e||
e.status==="unloading")throw i;return this.#a(e,i)}}#a(e,t){const i=Object.assign(new Error(String(t?.message??t),{cause:t}),
{code:"ERR_MODEL_RESIDENCY_INACTIVE"});return this.#s(e,i),i}#i(e){for(const t of[...this.queue])t.operation.controller.
abort(e)}async#t(e){await e.bridge?.close(),e.bridge=null,e.lease&&(await e.lease.release(),e.lease=null),e.reserved&&(await this.
computeManager.releaseWorkerAffinity(e.affinityKey),e.reserved=!1)}async unloadModel(){const e=this.session;if(!e)return{
status:"absent"};if(e.unloadingPromise)return e.unloadingPromise;const t=this.#l(e);e.unloadingPromise=t;try{return await t}finally{
e.unloadingPromise===t&&(e.unloadingPromise=null)}}async#l(e){if(this.#i("Model is unloading"),e.status==="loading"){if(e.
loadController?.abort("Model load cancelled by unload"),await e.loading.catch(()=>{}),this.session===e)throw new Error("\
Model cleanup is incomplete; admission remains held");return{sessionId:e.sessionId,status:"unloaded"}}if(e.status==="cle\
anup-failed"||e.status==="lost")return this.active?.session===e&&await this.cancel(this.active.requestId,{reason:"Lost m\
odel is unloading"}),this.session!==e?{sessionId:e.sessionId,status:"unloaded"}:(await this.computeManager.terminateWorkerAffinity(
e.affinityKey,{reason:"Retry model cleanup"}),await this.#t(e),this.session=null,{sessionId:e.sessionId,status:"unloaded",
workerTerminated:!0});if(e.status="unloading",this.active&&await this.cancel(this.active.requestId,{reason:"Model is unl\
oading"}),this.session!==e)return{sessionId:e.sessionId,status:"unloaded"};const t=k(void 0,this.generationTimeoutMs);try{
if(this.runtimeDefinition.terminateOnUnload)return await this.computeManager.terminateWorkerAffinity(e.affinityKey,{reason:"\
Model runtime unloaded"}),await this.#t(e),this.session=null,{sessionId:e.sessionId,status:"unloaded",workerTerminated:!0};
const i=await this.computeManager.submitTask({id:`${e.sessionId}-unload`,module:this.moduleUrl,exportName:"handleModelTa\
sk",data:{command:"unload",sessionId:e.sessionId},affinityKey:e.affinityKey,requireWorker:!0,signal:t.controller.signal});
return await this.#t(e),this.session=null,i}catch(i){try{I(i)||await this.computeManager.terminateWorkerAffinity(e.affinityKey,
{reason:"Model disposal failed"}),await this.#t(e),this.session=null}catch(r){throw e.status="cleanup-failed",new AggregateError(
[i,r],"Model disposal failed and cleanup is incomplete")}throw i}finally{t.dispose()}}async dispose(){return this.closed=
!0,this.unloadModel()}}export{L as ModelInferenceService};
