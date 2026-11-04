var C=n=>{throw TypeError(n)};var x=(n,e,t)=>e.has(n)||C("Cannot "+t);var j=(n,e,t)=>e.has(n)?C("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(n):e.set(n,t);var m=(n,e,t)=>(x(n,e,"access private method"),t);import{v as _,a as $,b as G,C as L,t as v,M as R,c as N,n as Q,s as z,d as F}from"./peercomputeDevice-BHb-stWT.js";import"./device-B4S7QtIr.js";function K(n,e){var r;const t=new AbortController,a=()=>t.abort((n==null?void 0:n.reason)??"Cancelled");n==null||n.addEventListener(
"abort",a,{once:!0}),n!=null&&n.aborted&&a();const s=setTimeout(()=>t.abort("Model operation deadline exceeded"),e);return(r=
s.unref)==null||r.call(s),{controller:t,dispose(){clearTimeout(s),n==null||n.removeEventListener("abort",a)}}}function q(n){
return(n==null?void 0:n.workerTerminated)===!0||(n==null?void 0:n.code)==="WORKER_TERMINATED"}var l,P,W,M,S;class V{constructor({
computeManager:e,artifactStore:t,admission:a,runtimeAssets:s,resourceEstimate:r,runtimeDefinition:i=null,runtimeOptions:u={},
moduleUrl:A=(i==null?void 0:i.moduleUrl)??"peercompute:model-inference",baseUrl:b=(o=>(o=globalThis.location)==null?void 0:
o.href)(),createChannel:I=()=>new MessageChannel,loadTimeoutMs:g=3e5,generationTimeoutMs:y=12e4,allowedManifestCids:f=null,
collectGpuEvidence:w=!1}={}){j(this,l);var E,h;if(!(e!=null&&e.submitTask)||!e.reserveWorkerAffinity||!e.releaseWorkerAffinity||
!e.cancelTask||!e.terminateWorkerAffinity)throw new Error("Inference requires managed worker reservation and cancellatio\
n APIs");if(!(t!=null&&t.stat)||!t.openRead||!(a!=null&&a.acquire))throw new Error("Inference requires a StateManager ar\
tifact store and resource admission");for(const p of typeof r=="function"?[]:["cpuBytes","gpuBytes"])if(!Number.isSafeInteger(
r==null?void 0:r[p])||r[p]<=0)throw new Error("An explicit measured/configured resident memory envelope is required");for(const p of[
g,y])if(!Number.isSafeInteger(p)||p<1||p>30*6e4)throw new Error("Invalid inference operation deadline");if(this.computeManager=
e,this.artifactStore=t,this.admission=a,this.runtimeDefinition=i??{id:"transformers.js",validateManifest:$,validateRuntimeAssets:_},
typeof this.runtimeDefinition.validateManifest!="function"||typeof this.runtimeDefinition.validateRuntimeAssets!="functi\
on")throw new Error("A trusted model runtime definition is required");if(this.runtimeAssets=this.runtimeDefinition.validateRuntimeAssets(
s,b),!this.runtimeDefinition.validateRuntimeOptions&&Object.keys(u).length)throw new Error("This model runtime does not \
accept runtime options");this.runtimeOptions=((h=(E=this.runtimeDefinition).validateRuntimeOptions)==null?void 0:h.call(
E,u))??{},this.resourceEstimate=typeof r=="function"?r:{...r},this.moduleUrl=String(A),this.createChannel=I,this.loadTimeoutMs=
g,this.generationTimeoutMs=y,this.allowedManifestCids=f?new Set(f):null,this.collectGpuEvidence=w===!0,this.session=null,
this.queue=[],this.active=null,this.closed=!1}async loadModel({sessionId:e=crypto.randomUUID(),manifestCid:t,manifest:a,
signal:s,onProgress:r}={}){if(this.closed)throw new Error("Inference service is closed");if(this.session)throw new Error(
"Unload the current model before loading another");if(G(e),typeof t!="string"||!t||t.length>256||this.allowedManifestCids&&
!this.allowedManifestCids.has(t))throw new Error("Model manifest is not admitted");L.parse(t),v(s);const i={sessionId:e,
manifestCid:t,affinityKey:`model:${e}`,status:"loading",reserved:!1};this.session=i;const u=K(s,this.loadTimeoutMs);i.loadController=
u.controller;const A=async()=>{var b,I,g,y;try{const f=this.artifactStore.getManifest?await this.artifactStore.getManifest(
t,{signal:u.controller.signal}):a,w=this.runtimeDefinition.validateManifest(f);i.manifest=w.manifest;const o=typeof this.
resourceEstimate=="function"?await this.resourceEstimate(i.manifest,w):this.resourceEstimate;for(const[d,k]of[["cpuBytes",
w.resourcePolicy.minimumCpuBytes],["gpuBytes",w.resourcePolicy.minimumGpuBytes]])if(!Number.isSafeInteger(o==null?void 0:
o[d])||o[d]<=0||o[d]<k)throw new Error(`Model requires an admitted ${d} envelope of at least ${k} bytes`);if(v(u.controller.
signal),await this.computeManager.reserveWorkerAffinity(i.affinityKey),i.reserved=!0,v(u.controller.signal),i.lease=await this.
admission.acquire({sessionId:e,manifestCid:t,manifest:i.manifest,estimatedCpuBytes:o.cpuBytes,estimatedGpuBytes:o.gpuBytes}),
!((b=i.lease)!=null&&b.release))throw new Error("Admission did not return a resident resource lease");v(u.controller.signal),
await((g=(I=i.lease).assertActive)==null?void 0:g.call(I));const{port1:E,port2:h}=this.createChannel();i.bridge=z(E,{store:this.
artifactStore,manifest:i.manifest}),i.dispatched=!0;const p=await this.computeManager.submitTask({id:`${e}-load`,module:this.
moduleUrl,exportName:"handleModelTask",data:{command:"load",sessionId:e,manifestCid:t,manifest:i.manifest,artifactPort:h,
runtimeAssets:this.runtimeAssets,runtimeOptions:this.runtimeOptions,collectGpuEvidence:this.collectGpuEvidence},affinityKey:i.
affinityKey,requireWorker:!0,transferables:[h],signal:u.controller.signal,onProgress:r});return v(u.controller.signal),i.
status="ready",i.evidence=p,p}catch(f){try{i.dispatched&&!q(f)&&await this.computeManager.terminateWorkerAffinity(i.affinityKey,
{reason:"Model load failed"}),await m(this,l,M).call(this,i),this.session===i&&(this.session=null)}catch(w){throw i.status=
"cleanup-failed",new AggregateError([f,w],"Model load failed and cleanup is incomplete")}throw f}finally{u.dispose(),this.
runtimeDefinition.retainArtifactBridge||(await((y=i.bridge)==null?void 0:y.close()),i.bridge=null),i.loadController=null}};
return i.loading=A(),i.loading}generate({requestId:e=crypto.randomUUID(),sessionId:t=(w=>(w=this.session)==null?void 0:w.
sessionId)(),messages:a,prompt:s,image:r,maxNewTokens:i=R.maxNewTokens,seed:u,steps:A,width:b,height:I,signal:g,onProgress:y,
onToken:f}={}){var D,U,O,B;if(this.closed||((D=this.session)==null?void 0:D.status)!=="ready"||t!==this.session.sessionId)
return Promise.reject(new Error("Requested model is not ready"));let o;try{if(G(e),this.runtimeDefinition.normalizeGenerationInput)
o=this.runtimeDefinition.normalizeGenerationInput({messages:a,prompt:s,image:r,maxNewTokens:i,seed:u,steps:A,width:b,height:I},
this.session.manifest);else{if(N(r),a=Q({messages:a,prompt:s}),(O=(U=this.runtimeDefinition).validateGenerationInput)==null||
O.call(U,{image:r,messages:a,maxNewTokens:i}),!Number.isInteger(i)||i<1||i>R.maxNewTokens)throw new Error("Generation ex\
ceeds its output-token budget");o={messages:a,image:r,maxNewTokens:i}}v(g)}catch(c){return Promise.reject(c)}if(((B=this.
active)==null?void 0:B.requestId)===e||this.queue.some(c=>c.requestId===e))return Promise.reject(new Error("Duplicate in\
ference request ID"));if(this.active&&this.queue.length>=R.maxQueued)return Promise.reject(new Error("Inference queue is\
 full"));const E=this.session,h=K(g,this.generationTimeoutMs),p=o.image?{width:o.image.width,height:o.image.height,channels:4,
data:new Uint8Array(o.image.data)}:void 0,d={requestId:e,session:E,operation:h,started:!1,data:{...o,command:"generate",
sessionId:t,requestId:e,image:p},onProgress:c=>{if(!h.controller.signal.aborted)try{y==null||y(c),c.type==="token"&&(f==
null||f(c.text,c))}catch(T){h.controller.abort(T)}}},k=new Promise((c,T)=>{d.resolve=c,d.reject=T});return d.finished=k.
catch(()=>{}),d.abortQueued=()=>{if(d.started)return;const c=this.queue.indexOf(d);c>=0&&this.queue.splice(c,1),h.dispose(),
d.reject(F(h.controller.signal.reason))},h.controller.signal.addEventListener("abort",d.abortQueued,{once:!0}),this.queue.
push(d),m(this,l,P).call(this),k}async cancel(e,{reason:t="Caller cancelled inference",timeoutMs:a}={}){var r;const s=((r=
this.active)==null?void 0:r.requestId)===e?this.active:this.queue.find(i=>i.requestId===e);return s?(s.operation.controller.
abort(t),s.started&&(await this.computeManager.cancelTask(`${s.session.sessionId}-generate-${e}`,{reason:t,timeoutMs:a}),
await s.finished),!0):!1}getStatus(){var e,t,a,s,r,i,u;return{status:((e=this.session)==null?void 0:e.status)??(this.closed?
"closed":"idle"),runtime:this.runtimeDefinition.id,sessionId:((t=this.session)==null?void 0:t.sessionId)??null,manifestCid:((a=
this.session)==null?void 0:a.manifestCid)??null,activeRequestId:((s=this.active)==null?void 0:s.requestId)??null,queuedRequests:this.
queue.length,artifactReads:((i=(r=this.session)==null?void 0:r.bridge)==null?void 0:i.getStats())??null,evidence:((u=this.
session)==null?void 0:u.evidence)??null}}async status(){const e=this.session;return!e||e.status!=="ready"||this.active?this.
getStatus():this.computeManager.submitTask({module:this.moduleUrl,exportName:"handleModelTask",data:{command:"status",sessionId:e.
sessionId},affinityKey:e.affinityKey,requireWorker:!0})}async unloadModel(){const e=this.session;if(!e)return{status:"ab\
sent"};if(e.unloadingPromise)return e.unloadingPromise;const t=m(this,l,S).call(this,e);e.unloadingPromise=t;try{return await t}finally{
e.unloadingPromise===t&&(e.unloadingPromise=null)}}async dispose(){return this.closed=!0,this.unloadModel()}}l=new WeakSet,
P=async function(){var t,a;if(this.active||!this.queue.length)return;const e=this.queue.shift();e.started=!0,this.active=
e;try{if(v(e.operation.controller.signal),this.session!==e.session||e.session.status!=="ready")throw new Error("Model se\
ssion lost");await((a=(t=e.session.lease)==null?void 0:t.assertActive)==null?void 0:a.call(t));const s=await this.computeManager.
submitTask({id:`${e.session.sessionId}-generate-${e.requestId}`,module:this.moduleUrl,exportName:"handleModelTask",data:e.
data,affinityKey:e.session.affinityKey,requireWorker:!0,transferables:e.data.image?[e.data.image.data.buffer]:[],signal:e.
operation.controller.signal,onProgress:e.onProgress});e.resolve(s)}catch(s){if(q(s)||(s==null?void 0:s.code)==="ERR_COMP\
UTE_WORKER_TERMINATION_FAILED"||/GPU device lost|Model session lost/.test((s==null?void 0:s.message)??"")){e.session.status=
"lost",m(this,l,W).call(this,"Model worker was lost");try{q(s)||await this.computeManager.terminateWorkerAffinity(e.session.
affinityKey,{reason:"Model session lost"}),await m(this,l,M).call(this,e.session),this.session===e.session&&(this.session=
null)}catch(r){e.session.status="cleanup-failed",s=new AggregateError([s,r],"Lost worker resource cleanup failed")}}e.reject(
s)}finally{e.operation.dispose(),e.operation.controller.signal.removeEventListener("abort",e.abortQueued),this.active=null,
m(this,l,P).call(this)}},W=function(e){for(const t of[...this.queue])t.operation.controller.abort(e)},M=async function(e){
var t;await((t=e.bridge)==null?void 0:t.close()),e.bridge=null,e.lease&&(await e.lease.release(),e.lease=null),e.reserved&&
(await this.computeManager.releaseWorkerAffinity(e.affinityKey),e.reserved=!1)},S=async function(e){var a;if(m(this,l,W).
call(this,"Model is unloading"),e.status==="loading"){if((a=e.loadController)==null||a.abort("Model load cancelled by un\
load"),await e.loading.catch(()=>{}),this.session===e)throw new Error("Model cleanup is incomplete; admission remains he\
ld");return{sessionId:e.sessionId,status:"unloaded"}}if(e.status==="cleanup-failed"||e.status==="lost")return await this.
computeManager.terminateWorkerAffinity(e.affinityKey,{reason:"Retry model cleanup"}),await m(this,l,M).call(this,e),this.
session=null,{sessionId:e.sessionId,status:"unloaded",workerTerminated:!0};if(e.status="unloading",this.active&&await this.
cancel(this.active.requestId,{reason:"Model is unloading"}),this.session!==e)return{sessionId:e.sessionId,status:"unload\
ed"};const t=K(void 0,this.generationTimeoutMs);try{if(this.runtimeDefinition.terminateOnUnload)return await this.computeManager.
terminateWorkerAffinity(e.affinityKey,{reason:"Model runtime unloaded"}),await m(this,l,M).call(this,e),this.session=null,
{sessionId:e.sessionId,status:"unloaded",workerTerminated:!0};const s=await this.computeManager.submitTask({id:`${e.sessionId}\
-unload`,module:this.moduleUrl,exportName:"handleModelTask",data:{command:"unload",sessionId:e.sessionId},affinityKey:e.
affinityKey,requireWorker:!0,signal:t.controller.signal});return await m(this,l,M).call(this,e),this.session=null,s}catch(s){
try{q(s)||await this.computeManager.terminateWorkerAffinity(e.affinityKey,{reason:"Model disposal failed"}),await m(this,
l,M).call(this,e),this.session=null}catch(r){throw e.status="cleanup-failed",new AggregateError([s,r],"Model disposal fa\
iled and cleanup is incomplete")}throw s}finally{t.dispose()}};export{V as ModelInferenceService};
