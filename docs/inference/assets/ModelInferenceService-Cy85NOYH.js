import{ae as T,af as P,ag as A,ah as D,ai as w,aj as I,ak as R,al as K,am as W,an as U}from"./main-E7aCypp6.js";import"./index-CK5Gf9HD.js";
function E(p,e){const t=new AbortController,s=()=>t.abort(p?.reason??"Cancelled");p?.addEventListener("abort",s,{once:!0}),
p?.aborted&&s();const r=setTimeout(()=>t.abort("Model operation deadline exceeded"),e);return r.unref?.(),{controller:t,
dispose(){clearTimeout(r),p?.removeEventListener("abort",s)}}}function M(p){return p?.workerTerminated===!0||p?.code==="\
WORKER_TERMINATED"}class j{constructor({computeManager:e,artifactStore:t,admission:s,runtimeAssets:r,resourceEstimate:n,
runtimeDefinition:i=null,runtimeOptions:a={},moduleUrl:v=i?.moduleUrl??"peercompute:model-inference",baseUrl:f=globalThis.
location?.href,createChannel:c=()=>new MessageChannel,loadTimeoutMs:d=3e5,generationTimeoutMs:y=12e4,allowedManifestCids:g=null,
collectGpuEvidence:u=!1}={}){if(!e?.submitTask||!e.reserveWorkerAffinity||!e.releaseWorkerAffinity||!e.cancelTask||!e.terminateWorkerAffinity)
throw new Error("Inference requires managed worker reservation and cancellation APIs");if(!t?.stat||!t.openRead||!s?.acquire)
throw new Error("Inference requires a StateManager artifact store and resource admission");for(const o of typeof n=="fun\
ction"?[]:["cpuBytes","gpuBytes"])if(!Number.isSafeInteger(n?.[o])||n[o]<=0)throw new Error("An explicit measured/config\
ured resident memory envelope is required");for(const o of[d,y])if(!Number.isSafeInteger(o)||o<1||o>30*6e4)throw new Error(
"Invalid inference operation deadline");if(this.computeManager=e,this.artifactStore=t,this.admission=s,this.runtimeDefinition=
i??{id:"transformers.js",validateManifest:P,validateRuntimeAssets:T},typeof this.runtimeDefinition.validateManifest!="fu\
nction"||typeof this.runtimeDefinition.validateRuntimeAssets!="function")throw new Error("A trusted model runtime defini\
tion is required");if(this.runtimeAssets=this.runtimeDefinition.validateRuntimeAssets(r,f),!this.runtimeDefinition.validateRuntimeOptions&&
Object.keys(a).length)throw new Error("This model runtime does not accept runtime options");this.runtimeOptions=this.runtimeDefinition.
validateRuntimeOptions?.(a)??{},this.resourceEstimate=typeof n=="function"?n:{...n},this.moduleUrl=String(v),this.createChannel=
c,this.loadTimeoutMs=d,this.generationTimeoutMs=y,this.allowedManifestCids=g?new Set(g):null,this.collectGpuEvidence=u===
!0,this.session=null,this.queue=[],this.active=null,this.closed=!1}async loadModel({sessionId:e=crypto.randomUUID(),manifestCid:t,
manifest:s,signal:r,onProgress:n}={}){if(this.closed)throw new Error("Inference service is closed");if(this.session)throw new Error(
"Unload the current model before loading another");if(A(e),typeof t!="string"||!t||t.length>256||this.allowedManifestCids&&
!this.allowedManifestCids.has(t))throw new Error("Model manifest is not admitted");D.parse(t),w(r);const i={sessionId:e,
manifestCid:t,affinityKey:`model:${e}`,status:"loading",reserved:!1};this.session=i;const a=E(r,this.loadTimeoutMs);i.loadController=
a.controller;const v=async()=>{try{const f=this.artifactStore.getManifest?await this.artifactStore.getManifest(t,{signal:a.
controller.signal}):s,c=this.runtimeDefinition.validateManifest(f);i.manifest=c.manifest;const d=typeof this.resourceEstimate==
"function"?await this.resourceEstimate(i.manifest,c):this.resourceEstimate;for(const[o,h]of[["cpuBytes",c.resourcePolicy.
minimumCpuBytes],["gpuBytes",c.resourcePolicy.minimumGpuBytes]])if(!Number.isSafeInteger(d?.[o])||d[o]<=0||d[o]<h)throw new Error(
`Model requires an admitted ${o} envelope of at least ${h} bytes`);if(w(a.controller.signal),await this.computeManager.reserveWorkerAffinity(
i.affinityKey),i.reserved=!0,w(a.controller.signal),i.lease=await this.admission.acquire({sessionId:e,manifestCid:t,manifest:i.
manifest,estimatedCpuBytes:d.cpuBytes,estimatedGpuBytes:d.gpuBytes}),!i.lease?.release)throw new Error("Admission did no\
t return a resident resource lease");w(a.controller.signal),await i.lease.assertActive?.();const{port1:y,port2:g}=this.createChannel();
i.bridge=W(y,{store:this.artifactStore,manifest:i.manifest}),i.dispatched=!0;const u=await this.computeManager.submitTask(
{id:`${e}-load`,module:this.moduleUrl,exportName:"handleModelTask",data:{command:"load",sessionId:e,manifestCid:t,manifest:i.
manifest,artifactPort:g,runtimeAssets:this.runtimeAssets,runtimeOptions:this.runtimeOptions,collectGpuEvidence:this.collectGpuEvidence},
affinityKey:i.affinityKey,requireWorker:!0,transferables:[g],signal:a.controller.signal,onProgress:n});return w(a.controller.
signal),i.status="ready",i.evidence=u,u}catch(f){try{i.dispatched&&!M(f)&&await this.computeManager.terminateWorkerAffinity(
i.affinityKey,{reason:"Model load failed"}),await this.#e(i),this.session===i&&(this.session=null)}catch(c){throw i.status=
"cleanup-failed",new AggregateError([f,c],"Model load failed and cleanup is incomplete")}throw f}finally{a.dispose(),this.
runtimeDefinition.retainArtifactBridge||(await i.bridge?.close(),i.bridge=null),i.loadController=null}};return i.loading=
v(),i.loading}generate({requestId:e=crypto.randomUUID(),sessionId:t=this.session?.sessionId,messages:s,prompt:r,image:n,
maxNewTokens:i=I.maxNewTokens,seed:a,steps:v,width:f,height:c,signal:d,onProgress:y,onToken:g}={}){if(this.closed||this.
session?.status!=="ready"||t!==this.session.sessionId)return Promise.reject(new Error("Requested model is not ready"));let u;
try{if(A(e),this.runtimeDefinition.normalizeGenerationInput)u=this.runtimeDefinition.normalizeGenerationInput({messages:s,
prompt:r,image:n,maxNewTokens:i,seed:a,steps:v,width:f,height:c},this.session.manifest);else{if(R(n),s=K({messages:s,prompt:r}),
this.runtimeDefinition.validateGenerationInput?.({image:n,messages:s,maxNewTokens:i}),!Number.isInteger(i)||i<1||i>I.maxNewTokens)
throw new Error("Generation exceeds its output-token budget");u={messages:s,image:n,maxNewTokens:i}}w(d)}catch(l){return Promise.
reject(l)}if(this.active?.requestId===e||this.queue.some(l=>l.requestId===e))return Promise.reject(new Error("Duplicate \
inference request ID"));if(this.active&&this.queue.length>=I.maxQueued)return Promise.reject(new Error("Inference queue \
is full"));const o=this.session,h=E(d,this.generationTimeoutMs),q=u.image?{width:u.image.width,height:u.image.height,channels:4,
data:new Uint8Array(u.image.data)}:void 0,m={requestId:e,session:o,operation:h,started:!1,data:{...u,command:"generate",
sessionId:t,requestId:e,image:q},onProgress:l=>{if(!h.controller.signal.aborted)try{y?.(l),l.type==="token"&&g?.(l.text,
l)}catch(b){h.controller.abort(b)}}},k=new Promise((l,b)=>{m.resolve=l,m.reject=b});return m.finished=k.catch(()=>{}),m.
abortQueued=()=>{if(m.started)return;const l=this.queue.indexOf(m);l>=0&&this.queue.splice(l,1),h.dispose(),m.reject(U(h.
controller.signal.reason))},h.controller.signal.addEventListener("abort",m.abortQueued,{once:!0}),this.queue.push(m),this.#t(),
k}async#t(){if(this.active||!this.queue.length)return;const e=this.queue.shift();e.started=!0,this.active=e;try{if(w(e.operation.
controller.signal),this.session!==e.session||e.session.status!=="ready")throw new Error("Model session lost");await e.session.
lease?.assertActive?.();const t=await this.computeManager.submitTask({id:`${e.session.sessionId}-generate-${e.requestId}`,
module:this.moduleUrl,exportName:"handleModelTask",data:e.data,affinityKey:e.session.affinityKey,requireWorker:!0,transferables:e.
data.image?[e.data.image.data.buffer]:[],signal:e.operation.controller.signal,onProgress:e.onProgress});e.resolve(t)}catch(t){
if(M(t)||t?.code==="ERR_COMPUTE_WORKER_TERMINATION_FAILED"||/GPU device lost|Model session lost/.test(t?.message??"")){e.
session.status="lost",this.#i("Model worker was lost");try{M(t)||await this.computeManager.terminateWorkerAffinity(e.session.
affinityKey,{reason:"Model session lost"}),await this.#e(e.session),this.session===e.session&&(this.session=null)}catch(s){
e.session.status="cleanup-failed",t=new AggregateError([t,s],"Lost worker resource cleanup failed")}}e.reject(t)}finally{
e.operation.dispose(),e.operation.controller.signal.removeEventListener("abort",e.abortQueued),this.active=null,this.#t()}}async cancel(e,{
reason:t="Caller cancelled inference",timeoutMs:s}={}){const r=this.active?.requestId===e?this.active:this.queue.find(n=>n.
requestId===e);return r?(r.operation.controller.abort(t),r.started&&(await this.computeManager.cancelTask(`${r.session.sessionId}\
-generate-${e}`,{reason:t,timeoutMs:s}),await r.finished),!0):!1}getStatus(){return{status:this.session?.status??(this.closed?
"closed":"idle"),runtime:this.runtimeDefinition.id,sessionId:this.session?.sessionId??null,manifestCid:this.session?.manifestCid??
null,activeRequestId:this.active?.requestId??null,queuedRequests:this.queue.length,artifactReads:this.session?.bridge?.getStats()??
null,evidence:this.session?.evidence??null}}async status(){const e=this.session;return!e||e.status!=="ready"||this.active?
this.getStatus():this.computeManager.submitTask({module:this.moduleUrl,exportName:"handleModelTask",data:{command:"statu\
s",sessionId:e.sessionId},affinityKey:e.affinityKey,requireWorker:!0})}#i(e){for(const t of[...this.queue])t.operation.controller.
abort(e)}async#e(e){await e.bridge?.close(),e.bridge=null,e.lease&&(await e.lease.release(),e.lease=null),e.reserved&&(await this.
computeManager.releaseWorkerAffinity(e.affinityKey),e.reserved=!1)}async unloadModel(){const e=this.session;if(!e)return{
status:"absent"};if(e.unloadingPromise)return e.unloadingPromise;const t=this.#s(e);e.unloadingPromise=t;try{return await t}finally{
e.unloadingPromise===t&&(e.unloadingPromise=null)}}async#s(e){if(this.#i("Model is unloading"),e.status==="loading"){if(e.
loadController?.abort("Model load cancelled by unload"),await e.loading.catch(()=>{}),this.session===e)throw new Error("\
Model cleanup is incomplete; admission remains held");return{sessionId:e.sessionId,status:"unloaded"}}if(e.status==="cle\
anup-failed"||e.status==="lost")return await this.computeManager.terminateWorkerAffinity(e.affinityKey,{reason:"Retry mo\
del cleanup"}),await this.#e(e),this.session=null,{sessionId:e.sessionId,status:"unloaded",workerTerminated:!0};if(e.status=
"unloading",this.active&&await this.cancel(this.active.requestId,{reason:"Model is unloading"}),this.session!==e)return{
sessionId:e.sessionId,status:"unloaded"};const t=E(void 0,this.generationTimeoutMs);try{if(this.runtimeDefinition.terminateOnUnload)
return await this.computeManager.terminateWorkerAffinity(e.affinityKey,{reason:"Model runtime unloaded"}),await this.#e(
e),this.session=null,{sessionId:e.sessionId,status:"unloaded",workerTerminated:!0};const s=await this.computeManager.submitTask(
{id:`${e.sessionId}-unload`,module:this.moduleUrl,exportName:"handleModelTask",data:{command:"unload",sessionId:e.sessionId},
affinityKey:e.affinityKey,requireWorker:!0,signal:t.controller.signal});return await this.#e(e),this.session=null,s}catch(s){
try{M(s)||await this.computeManager.terminateWorkerAffinity(e.affinityKey,{reason:"Model disposal failed"}),await this.#e(
e),this.session=null}catch(r){throw e.status="cleanup-failed",new AggregateError([s,r],"Model disposal failed and cleanu\
p is incomplete")}throw s}finally{t.dispose()}}async dispose(){return this.closed=!0,this.unloadModel()}}export{j as ModelInferenceService};
