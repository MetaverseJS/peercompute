import{as as W,at as C,au as P,av as K,aw as a,M as b,ax as O,ay as U,az as R,aA as _,aB as L,aC as N}from"./main-Ba299aVs.js";
import"./index-BXlUi_Kl.js";async function x(d,e,t){if(e.model.runtime!=="transformers.js"||!e.model.memoryProfile)return;
const s=e.files.find(r=>r.path==="config.json");if(!s||s.size>L.maximumConfigBytes)throw new Error("Model config exceeds\
 its metadata budget");const o=await d.stat(s.cid,{signal:t});if(a(t),o?.status!=="complete"||o.size!==s.size||o.sha256!==
s.sha256)throw new Error("Model config is not verified locally");const n=new Uint8Array(s.size);let i=0;for await(const r of await d.
openRead(s.cid,{signal:t})){if(a(t),!(r instanceof Uint8Array)||r.length>n.length-i)throw new Error("Invalid model confi\
g bytes");n.set(r,i),i+=r.length}if(a(t),i!==n.length)throw new Error("Incomplete model config");N(e.model,JSON.parse(new TextDecoder(
"utf-8",{fatal:!0}).decode(n)))}function k(d,e){const t=new AbortController,s=()=>t.abort(d?.reason??"Cancelled");d?.addEventListener(
"abort",s,{once:!0}),d?.aborted&&s();const o=setTimeout(()=>t.abort("Model operation deadline exceeded"),e);return o.unref?.(),
{controller:t,dispose(){clearTimeout(o),d?.removeEventListener("abort",s)}}}function I(d){return d?.workerTerminated===!0||
d?.code==="WORKER_TERMINATED"}function A(d,e){return new Promise((t,s)=>{const o=()=>s(R(e.reason));e.addEventListener("\
abort",o,{once:!0}),Promise.resolve(d).then(t,s).finally(()=>e.removeEventListener("abort",o)),e.aborted&&o()})}class G{constructor({
computeManager:e,artifactStore:t,admission:s,runtimeAssets:o,resourceEstimate:n,runtimeDefinition:i=null,runtimeOptions:r={},
moduleUrl:E=i?.moduleUrl??"peercompute:model-inference",baseUrl:m=globalThis.location?.href,createChannel:f=()=>new MessageChannel,
loadTimeoutMs:h=3e5,generationTimeoutMs:p=12e4,allowedManifestCids:g=null,collectGpuEvidence:y=!1}={}){if(!e?.submitTask||
!e.reserveWorkerAffinity||!e.releaseWorkerAffinity||!e.cancelTask||!e.terminateWorkerAffinity||!e.getWorkerAffinityState)
throw new Error("Inference requires managed worker reservation and cancellation APIs");if(!t?.stat||!t.openRead||!s?.acquire)
throw new Error("Inference requires a StateManager artifact store and resource admission");for(const l of typeof n=="fun\
ction"?[]:["cpuBytes","gpuBytes"])if(!Number.isSafeInteger(n?.[l])||n[l]<=0)throw new Error("An explicit measured/config\
ured resident memory envelope is required");for(const l of[h,p])if(!Number.isSafeInteger(l)||l<1||l>30*6e4)throw new Error(
"Invalid inference operation deadline");if(this.computeManager=e,this.artifactStore=t,this.admission=s,this.runtimeDefinition=
i??{id:"transformers.js",validateManifest:C,validateRuntimeAssets:W},typeof this.runtimeDefinition.validateManifest!="fu\
nction"||typeof this.runtimeDefinition.validateRuntimeAssets!="function")throw new Error("A trusted model runtime defini\
tion is required");if(this.runtimeAssets=this.runtimeDefinition.validateRuntimeAssets(o,m),!this.runtimeDefinition.validateRuntimeOptions&&
Object.keys(r).length)throw new Error("This model runtime does not accept runtime options");this.runtimeOptions=this.runtimeDefinition.
validateRuntimeOptions?.(r)??{},this.resourceEstimate=typeof n=="function"?n:{...n},this.moduleUrl=String(E),this.createChannel=
f,this.loadTimeoutMs=h,this.generationTimeoutMs=p,this.allowedManifestCids=g?new Set(g):null,this.collectGpuEvidence=y===
!0,this.session=null,this.queue=[],this.active=null,this.closed=!1}async loadModel({sessionId:e=crypto.randomUUID(),manifestCid:t,
manifest:s,signal:o,onProgress:n}={}){if(this.closed)throw new Error("Inference service is closed");if(this.session)throw new Error(
"Unload the current model before loading another");if(P(e),typeof t!="string"||!t||t.length>256||this.allowedManifestCids&&
!this.allowedManifestCids.has(t))throw new Error("Model manifest is not admitted");K.parse(t),a(o);const i={sessionId:e,
manifestCid:t,affinityKey:`model:${e}`,status:"loading",reserved:!1};this.session=i;const r=k(o,this.loadTimeoutMs);i.loadController=
r.controller;const E=async()=>{try{const m=this.artifactStore.getManifest?await this.artifactStore.getManifest(t,{signal:r.
controller.signal}):s,f=this.runtimeDefinition.validateManifest(m);i.manifest=f.manifest,await x(this.artifactStore,i.manifest,
r.controller.signal);const h=typeof this.resourceEstimate=="function"?await this.resourceEstimate(i.manifest,f):this.resourceEstimate;
for(const[l,u]of[["cpuBytes",f.resourcePolicy.minimumCpuBytes],["gpuBytes",f.resourcePolicy.minimumGpuBytes]])if(!Number.
isSafeInteger(h?.[l])||h[l]<=0||h[l]<u)throw new Error(`Model requires an admitted ${l} envelope of at least ${u} bytes`);
if(a(r.controller.signal),await this.computeManager.reserveWorkerAffinity(i.affinityKey),i.reserved=!0,i.workerId=this.#e(
i).workerId,a(r.controller.signal),i.lease=await this.admission.acquire({sessionId:e,manifestCid:t,manifest:i.manifest,estimatedCpuBytes:h.
cpuBytes,estimatedGpuBytes:h.gpuBytes}),!i.lease?.release)throw new Error("Admission did not return a resident resource \
lease");a(r.controller.signal),await A(i.lease.assertActive?.(),r.controller.signal),a(r.controller.signal),this.#e(i);const{
port1:p,port2:g}=this.createChannel();i.bridge=_(p,{store:this.artifactStore,manifest:i.manifest}),i.dispatched=!0;const y=await this.
computeManager.submitTask({id:`${e}-load`,module:this.moduleUrl,exportName:"handleModelTask",data:{command:"load",sessionId:e,
manifestCid:t,manifest:i.manifest,artifactPort:g,runtimeAssets:this.runtimeAssets,runtimeOptions:this.runtimeOptions,collectGpuEvidence:this.
collectGpuEvidence},affinityKey:i.affinityKey,requireWorker:!0,transferables:[g],signal:r.controller.signal,onProgress:n});
return a(r.controller.signal),this.#e(i),await A(i.lease.assertActive?.(),r.controller.signal),a(r.controller.signal),this.#e(
i),i.status="ready",i.evidence=y,y}catch(m){try{i.dispatched&&!I(m)&&await this.computeManager.terminateWorkerAffinity(i.
affinityKey,{reason:"Model load failed"}),await this.#t(i),this.session===i&&(this.session=null)}catch(f){throw i.status=
"cleanup-failed",new AggregateError([m,f],"Model load failed and cleanup is incomplete")}throw m}finally{r.dispose(),this.
runtimeDefinition.retainArtifactBridge||(await i.bridge?.close(),i.bridge=null),i.loadController=null}};return i.loading=
E(),i.loading}generate({requestId:e=crypto.randomUUID(),sessionId:t=this.session?.sessionId,messages:s,prompt:o,image:n,
audio:i,maxNewTokens:r=b.maxNewTokens,seed:E,steps:m,width:f,height:h,signal:p,onProgress:g,onToken:y}={}){if(this.closed||
this.session?.status!=="ready"||t!==this.session.sessionId)return Promise.reject(new Error("Requested model is not ready"));
const l=this.#o(this.session);if(l)return Promise.reject(l);let u;try{if(P(e),i!=null&&!this.runtimeDefinition.acceptsAudio)
throw new Error("This runtime does not accept audio input");if(this.runtimeDefinition.normalizeGenerationInput)u=this.runtimeDefinition.
normalizeGenerationInput({messages:s,prompt:o,image:n,audio:i,maxNewTokens:r,seed:E,steps:m,width:f,height:h},this.session.
manifest);else{if(O(n),s=U({messages:s,prompt:o}),this.runtimeDefinition.validateGenerationInput?.({image:n,messages:s,maxNewTokens:r}),
!Number.isInteger(r)||r<1||r>b.maxNewTokens)throw new Error("Generation exceeds its output-token budget");u={messages:s,
image:n,maxNewTokens:r}}a(p)}catch(c){return Promise.reject(c)}if(this.active?.requestId===e||this.queue.some(c=>c.requestId===
e))return Promise.reject(new Error("Duplicate inference request ID"));if(this.active&&this.queue.length>=b.maxQueued)return Promise.
reject(new Error("Inference queue is full"));const D=this.session,v=k(p,this.generationTimeoutMs),S=u.image?{width:u.image.
width,height:u.image.height,channels:4,data:new Uint8Array(u.image.data)}:void 0,q=u.audio?{samples:new Float32Array(u.audio.
samples),sampleRate:u.audio.sampleRate}:void 0,w={requestId:e,session:D,operation:v,started:!1,data:{...u,command:"gener\
ate",sessionId:t,requestId:e,image:S,...q?{audio:q}:{}},onProgress:c=>{if(!v.controller.signal.aborted)try{g?.(c),c.type===
"token"&&y?.(c.text,c)}catch(M){v.controller.abort(M)}}},T=new Promise((c,M)=>{w.resolve=c,w.reject=M});return w.finished=
T.catch(()=>{}),w.abortQueued=()=>{if(w.started)return;const c=this.queue.indexOf(w);c>=0&&this.queue.splice(c,1),v.dispose(),
w.reject(R(v.controller.signal.reason))},v.controller.signal.addEventListener("abort",w.abortQueued,{once:!0}),this.queue.
push(w),this.#r(),T}async#r(){if(this.active||!this.queue.length)return;const e=this.queue.shift();e.started=!0,this.active=
e;try{if(a(e.operation.controller.signal),this.session!==e.session||e.session.status!=="ready")throw new Error("Model se\
ssion lost");const t=await this.#n(e.session,e.operation.controller.signal);if(t)throw t;if(a(e.operation.controller.signal),
this.session!==e.session||e.session.status!=="ready")throw new Error("Requested model is no longer ready");const s=await this.
computeManager.submitTask({id:`${e.session.sessionId}-generate-${e.requestId}`,module:this.moduleUrl,exportName:"handleM\
odelTask",data:e.data,affinityKey:e.session.affinityKey,requireWorker:!0,transferables:[...e.data.image?[e.data.image.data.
buffer]:[],...e.data.audio?[e.data.audio.samples.buffer]:[]],signal:e.operation.controller.signal,onProgress:e.onProgress}),
o=await this.#n(e.session,e.operation.controller.signal);if(o)throw o;if(a(e.operation.controller.signal),this.session!==
e.session||e.session.status!=="ready")throw new Error("Requested model is no longer ready");e.resolve(s)}catch(t){if(t?.
code==="ERR_MODEL_RESIDENCY_INACTIVE")this.#s(e.session,t);else if(I(t)||t?.code==="ERR_COMPUTE_WORKER_TERMINATION_FAILE\
D"||/GPU device lost|Model session lost/.test(t?.message??"")){e.session.status="lost",this.#i("Model worker was lost");
try{I(t)||await this.computeManager.terminateWorkerAffinity(e.session.affinityKey,{reason:"Model session lost"}),await this.#t(
e.session),this.session===e.session&&(this.session=null)}catch(s){e.session.status="cleanup-failed",t=new AggregateError(
[t,s],"Lost worker resource cleanup failed")}}e.reject(t)}finally{e.operation.dispose(),e.operation.controller.signal.removeEventListener(
"abort",e.abortQueued),this.active=null,this.#r()}}async cancel(e,{reason:t="Caller cancelled inference",timeoutMs:s}={}){
const o=this.active?.requestId===e?this.active:this.queue.find(n=>n.requestId===e);return o?(o.operation.controller.abort(
t),o.started&&(await this.computeManager.cancelTask(`${o.session.sessionId}-generate-${e}`,{reason:t,timeoutMs:s}),await o.
finished),!0):!1}getStatus(){return this.session?.status==="ready"&&this.#o(this.session),{status:this.session?.status??
(this.closed?"closed":"idle"),runtime:this.runtimeDefinition.id,sessionId:this.session?.sessionId??null,manifestCid:this.
session?.manifestCid??null,activeRequestId:this.active?.requestId??null,queuedRequests:this.queue.length,artifactReads:this.
session?.bridge?.getStats()??null,evidence:this.session?.evidence??null}}async status(){const e=this.getStatus(),t=this.
session;if(!t||t.status!=="ready"||this.active)return e;const s=await this.computeManager.submitTask({module:this.moduleUrl,
exportName:"handleModelTask",data:{command:"status",sessionId:t.sessionId},affinityKey:t.affinityKey,requireWorker:!0});
return this.session===t&&["lost","absent","unloaded"].includes(s.status)&&this.#s(t,new Error("Model session lost: resid\
ent worker reported an unavailable runtime")),s}#e(e){const t=this.computeManager.getWorkerAffinityState(e.affinityKey);
if(!e.reserved||!t?.reserved||t.workerId==null||e.workerId!=null&&e.workerId!==t.workerId)throw new Error("Model session\
 lost: the original managed resident worker is unavailable");return t}#s(e,t){this.session!==e||["unloading","cleanup-fa\
iled"].includes(e.status)||(e.status="lost",this.#i(t.message),this.active?.session===e&&this.active.operation.controller.
abort(t))}#o(e){try{this.#e(e);const t=e.lease?.assertActiveSync?.();if(t?.then)throw Promise.resolve(t).catch(()=>{}),new TypeError(
"Resident synchronous health check must not return a promise");return null}catch(t){return this.#a(e,t)}}async#n(e,t){try{
if(this.#e(e),await A(e.lease?.assertActive?.(),t),a(t),this.session!==e||e.status!=="ready")throw new Error("Requested \
model is no longer ready");return this.#e(e),null}catch(s){if(t.aborted)throw R(t.reason);if(this.session!==e||e.status===
"unloading")throw s;return this.#a(e,s)}}#a(e,t){const s=Object.assign(new Error(String(t?.message??t),{cause:t}),{code:"\
ERR_MODEL_RESIDENCY_INACTIVE"});return this.#s(e,s),s}#i(e){for(const t of[...this.queue])t.operation.controller.abort(e)}async#t(e){
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
await this.#t(e),this.session=null,{sessionId:e.sessionId,status:"unloaded",workerTerminated:!0};const s=await this.computeManager.
submitTask({id:`${e.sessionId}-unload`,module:this.moduleUrl,exportName:"handleModelTask",data:{command:"unload",sessionId:e.
sessionId},affinityKey:e.affinityKey,requireWorker:!0,signal:t.controller.signal});return await this.#t(e),this.session=
null,s}catch(s){try{I(s)||await this.computeManager.terminateWorkerAffinity(e.affinityKey,{reason:"Model disposal failed"}),
await this.#t(e),this.session=null}catch(o){throw e.status="cleanup-failed",new AggregateError([s,o],"Model disposal fai\
led and cleanup is incomplete")}throw s}finally{t.dispose()}}async dispose(){return this.closed=!0,this.unloadModel()}}export{G as ModelInferenceService};
