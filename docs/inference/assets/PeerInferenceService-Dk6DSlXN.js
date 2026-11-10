import{b8 as U,b9 as R,ba as P,bb as A,bc as j,bd as Y,M as F,be as te,bf as $,bg as D,bh as z,bi as se,bj as re,bk as T,
bl as V,bm as W,bn as oe,bo as ie,bp as ne,bq as ae,br as ce,bs as de,bt as le,bu as he}from"./main-doVKNvU_.js";import"./index-CKWEQj_s.js";
const n=(w,t="ERR_PEER_INFERENCE")=>Object.assign(new Error(w),{code:t}),x=w=>w instanceof Error?w:n(String(w??"Peer inf\
erence failed")),L=w=>w.reason instanceof Error?w.reason:new DOMException("Inference cancelled","AbortError"),X=w=>w?.code===
"ERR_INFERENCE_DEADLINE"||["TimeoutError","ConnectionClosedError","StreamResetError","StreamStateError"].includes(w?.name),
Q=w=>w.some(X)&&!w.some(t=>["UnsupportedProtocolError","TooManyOutboundProtocolStreamsError","TooManyInboundProtocolStre\
amsError","LimitedConnectionError","InvalidParametersError"].includes(t?.name));function S(w,t){const e=new AbortController,
s=w.filter(Boolean).map(r=>{const d=()=>e.abort(L(r));return r.addEventListener("abort",d,{once:!0}),r.aborted&&d(),()=>r.
removeEventListener("abort",d)}),o=setTimeout(()=>e.abort(n("Peer inference deadline exceeded","ERR_INFERENCE_DEADLINE")),
t);return o.unref?.(),{controller:e,signal:e.signal,dispose(){clearTimeout(o),s.forEach(r=>r())}}}function v(w,t){if(t.aborted)
throw Promise.resolve(w).catch(()=>{}),L(t);return new Promise((e,s)=>{const o=()=>s(L(t));t.addEventListener("abort",o,
{once:!0}),Promise.resolve(w).then(e,s).finally(()=>t.removeEventListener("abort",o))})}class fe{constructor(t,{owner:e=Symbol(
"peer-inference-owner"),getLocalState:s,generate:o,queryTimeoutMs:r=R.queryTimeoutMs,requestTimeoutMs:d=R.requestTimeoutMs,
maximumPeers:a=R.maximumPeers}={}){if(typeof s!="function"||typeof o!="function")throw new Error("Peer inference callbac\
ks are required");this.manager=t,this.owner=e,this.getLocalState=s,this.generateLocal=o,this.queryTimeoutMs=U(r,15e3,100),
this.requestTimeoutMs=U(d,3e5,100),this.maximumPeers=U(a,R.maximumPeers,1),this.controller=new AbortController,this.records=
new Map,this.inbound=new Map,this.outbound=new Map,this.operations=new Set,this.hostingEnabled=!0,this.closed=!1,this.refreshing=
null,this.models=[],this.hosts=[],this.lastErrors=[],this.failedConnections=new WeakMap,this.recoveries=new Map,this.disconnectListener=
u=>{const h=u.detail.toString();this.records.delete(h),this._group();for(const l of[...this.inbound.values(),...this.outbound.
values()])l.peerId===h&&l.controller.abort(n("Inference peer disconnected","ERR_INFERENCE_DISCONNECTED"))}}get peerId(){
return this.manager.libp2p.peerId.toString()}get scope(){const{gameId:t,roomId:e,topologyId:s}=this.manager.config;return{
gameId:t,roomId:e,topologyId:s}}async start(){for(const t of[P,A])await this.manager.libp2p.handle(t,(e,s)=>{if(this.closed||
this.operations.size>=40||!j(s)){e.abort(n("Encrypted peer inference connection required"));return}const o=this._handle(
e,s,t);this.operations.add(o),o.catch(()=>{}).finally(()=>this.operations.delete(o))},{maxInboundStreams:4,maxOutboundStreams:4,
runOnLimitedConnection:!0});return this.manager.libp2p.addEventListener("peer:disconnect",this.disconnectListener),this}_envelope(t,e,s={}){
return{type:t,scope:this.scope,sender:this.peerId,recipient:e,...s}}_checkEnvelope(t,e){if(!t||t.sender!==e||t.recipient!==
this.peerId||["gameId","roomId","topologyId"].some(s=>t.scope?.[s]!==this.scope[s]))throw n("Peer inference identity or \
scope mismatch")}async _state(t,e=0,s,o){const r=Y(await v(o??this.getLocalState({signal:t}),t),this.hostingEnabled,{defaultMaxNewTokens:F.
maxNewTokens});for(const d of r.hostedModels)[...this.inbound.values()].filter(u=>u.manifestCid===d.manifestCid).length>
(d.manifestCid===s?e:0)&&(d.busy=!0,d.idleForMs=0);return this.inbound.size>e&&(r.busy=!0,r.idleForMs=0),r}async getTelemetrySummary({
signal:t=this.controller.signal}={}){if(this.closed||!this.hostingEnabled)return[];if(this.telemetryStatePending)throw new Error(
"Local hosted-model telemetry read is still pending");const e=Promise.resolve().then(()=>this.getLocalState({signal:t}));
this.telemetryStatePending=e;const s=()=>{this.telemetryStatePending===e&&(this.telemetryStatePending=null)};e.then(s,s);
const o=await this._state(t,0,void 0,this.telemetryStatePending);return this.closed||!this.hostingEnabled||t.aborted?[]:
o.hostedModels.map(({manifestCid:r,name:d,task:a,runtime:u,modalities:h,busy:l})=>({manifestCid:r,name:d,task:a,runtime:u,
modalities:h,busy:l}))}setHostingEnabled(t){if(this.hostingEnabled=!!t,!this.hostingEnabled)for(const e of this.inbound.
values())e.controller.abort(n("Peer inference hosting disabled","ERR_INFERENCE_HOST_DISABLED"));this.records.delete(this.
peerId),this._group()}async cancelHostedModel(t){t=te(t);const e=[...this.inbound.values()].filter(s=>s.manifestCid===t);
for(const s of e)s.controller.abort(n("Hosted model is unloading","ERR_INFERENCE_HOST_DISABLED"));return await Promise.allSettled(
e.map(s=>s.finished)),this.records.delete(this.peerId),this._group(),e.length}_remember(t,e,s=P){this.records.set(t,{state:e,
protocol:s,receivedAt:Date.now()})}_group(){const t=new Map,e=new Map,s=Date.now();for(const[o,r]of this.records){if(s-r.
receivedAt>R.recordTtlMs){this.records.delete(o);continue}const{state:d}=r,a=o===this.peerId;for(const u of d.sharedModels)
t.has(u.manifestCid)||t.set(u.manifestCid,{...u,providers:[]}),t.get(u.manifestCid).providers.push({peerId:o,local:a});for(const u of d.
hostedModels??(d.hostedModel?[{...d.hostedModel,busy:d.busy,idleForMs:d.idleForMs,queuedRequests:d.queuedRequests}]:[])){
const{maxNewTokens:h,busy:l,idleForMs:c,queuedRequests:b,queueCapacity:y,queueAvailable:g,...i}=u;e.has(i.manifestCid)||
e.set(i.manifestCid,{...i,hosts:[]}),e.get(i.manifestCid).hosts.push({peerId:o,local:a,busy:l,idleForMs:l?0:c,queuedRequests:b,
queueCapacity:y,queueAvailable:g,maxNewTokens:h,protocol:r.protocol})}}this.models=[...t.values()],this.hosts=[...e.values()]}listModels(){
return this._group(),structuredClone(this.models)}listHosts(){return this._group(),structuredClone(this.hosts)}_connections(t){
return this.manager.libp2p.getConnections().filter(e=>e.remotePeer.toString()===t&&j(e)).sort((e,s)=>{const o=r=>(r.encryption===
"native"?3:r.remoteAddr?.getComponents?.().some(({name:d})=>d==="p2p-circuit")?1:2)-((this.failedConnections.get(r)??0)>
Date.now()?10:0);return o(s)-o(e)})}async _connection(t,e){e.throwIfAborted();const s=()=>this._connections(t)[0];let o=s();
if(!o&&this.manager.peers?.has(t)){if(this.manager.recoverPeerInferenceConnection){try{await v(this._recoverConnection(t),
e)}catch{e.throwIfAborted(),this.controller.signal.throwIfAborted()}o=s()}o||(await v(this.manager._maybeDialPeer(t,"pee\
r-inference"),e),o=s())}if(!o)throw n("No authenticated encrypted connection to inference peer","ERR_INFERENCE_UNREACHAB\
LE");return o}_recoverConnection(t){if(this.recoveries.has(t))return this.recoveries.get(t);const e=this.manager.recoverPeerInferenceConnection(
t,{signal:this.controller.signal});this.recoveries.set(t,e),this.operations.add(e);const s=()=>{this.operations.delete(e),
this.recoveries.get(t)===e&&this.recoveries.delete(t)};return e.then(s,s),e}async _openStream(t,e,{audio:s=!1,backgroundRecovery:o=!1}={}){
const r=await this._connection(t,e),d=[...new Set([r,...this._connections(t)])].slice(0,4),a=[];let u;const h=async l=>{
if(e.throwIfAborted(),l.remotePeer.toString()!==t||!j(l))throw n("Invalid recovered inference connection");const c=S([this.
controller.signal,e],Math.min(2e3,this.queryTimeoutMs/2));let b;try{b=Promise.resolve(l.newStream(s?P:[P,A],{signal:c.signal,
runOnLimitedConnection:!0}));const y=await v(b,c.signal);c.signal.throwIfAborted();const g=this.manager.retainPeerInferenceConnection?.(
l,{timeoutMs:this.requestTimeoutMs+1e3});return this.failedConnections.delete(l),{connection:l,stream:y,release:g,protocol:y.
protocol??P}}catch(y){const g=x(y);throw b?.then(i=>i.abort(g),()=>{}).catch(()=>{}),X(g)&&this.failedConnections.set(l,
Date.now()+15e3),a.push(g),g}finally{c.dispose()}};try{for(const l of d)try{return await h(l)}catch{e.throwIfAborted(),this.
controller.signal.throwIfAborted()}}catch(l){throw o&&e.reason?.code==="ERR_INFERENCE_DEADLINE"&&Q(a)&&!this.controller.
signal.aborted&&this.manager.recoverPeerInferenceConnection&&this._recoverConnection(t).catch(()=>{}),l}if(Q(a)&&this.manager.
recoverPeerInferenceConnection)try{const l=await v(this._recoverConnection(t),e);return e.throwIfAborted(),await h(l)}catch(l){
e.throwIfAborted(),this.controller.signal.throwIfAborted(),u=x(l)}throw Object.assign(new AggregateError(a,`Unable to op\
en an encrypted inference stream: ${String(a.at(-1)?.message??"connections closed").slice(0,160)}`,{cause:a.at(-1)}),{code:"\
ERR_INFERENCE_STREAM_UNAVAILABLE",peerId:t,recoveryError:u})}async _closeCompletedStream(t,e){const s=S([this.controller.
signal,e],Math.min(1e3,this.queryTimeoutMs/2));try{await v(Promise.resolve().then(()=>t.close({signal:s.signal})),s.signal)}catch(o){
try{Promise.resolve(t.abort(x(o))).catch(()=>{})}catch{}this.controller.signal.throwIfAborted(),e.throwIfAborted()}finally{
s.dispose()}this.controller.signal.throwIfAborted(),e.throwIfAborted()}async _query(t,e){const s=S([this.controller.signal,
e],this.queryTimeoutMs);let o,r;const d=()=>o?.abort(L(s.signal));s.signal.addEventListener("abort",d,{once:!0});try{let a;
({stream:o,protocol:a,release:r}=await this._openStream(t,s.signal,{backgroundRecovery:!0}));const u=$(o);await u.write(
this._envelope("query",t),s.signal);const h=await u.read(s.signal);if(h?.type==="error")throw["sender","recipient","scop\
e"].some(l=>Object.hasOwn(h,l))&&this._checkEnvelope(h,t),typeof h.message!="string"||h.code!==void 0&&typeof h.code!="s\
tring"?n("Invalid inference directory error response","ERR_INFERENCE_DIRECTORY_INVALID"):n(h.message.slice(0,256)||"Peer\
 inference directory unavailable",h.code?.slice(0,80)||"ERR_PEER_INFERENCE");if(this._checkEnvelope(h,t),h.type!=="direc\
tory")throw n("Invalid inference directory response");this._remember(t,Y(h.state,!0,{protocol:a}),a),await this._closeCompletedStream(
o,s.signal)}catch(a){throw this.records.delete(t),o?.abort(a),a}finally{r?.(),s.signal.removeEventListener("abort",d),s.
dispose()}}async refresh({signal:t}={}){if(this.closed)throw n("Peer inference service is stopped");if(this.refreshing)return v(
this.refreshing,t??this.controller.signal);const e=async()=>{const s=S([this.controller.signal,t],this.queryTimeoutMs*2+
100);try{this._remember(this.peerId,await this._state(s.signal));const o=[...new Set([...this.manager.libp2p.getConnections().
map(d=>d.remotePeer.toString()),...this.manager.peers?.keys()??[]])].filter(d=>d!==this.peerId&&!this.manager.bootstrapPeerIds?.
has(d)).slice(0,this.maximumPeers),r=await Promise.allSettled(o.map(d=>this._query(d,s.signal)));return s.signal.throwIfAborted(),
this.lastErrors=r.flatMap((d,a)=>d.status==="rejected"?[{peerId:o[a],code:String(d.reason?.code??"ERR_PEER_INFERENCE").slice(
0,80),message:String(d.reason?.message??"Directory unavailable").slice(0,256)}]:[]),{models:this.listModels(),hosts:this.
listHosts(),errors:structuredClone(this.lastErrors)}}finally{s.dispose()}};this.refreshing=e(),this.operations.add(this.
refreshing);try{return await this.refreshing}finally{this.operations.delete(this.refreshing),this.refreshing=null}}async _handle(t,e,s=P){
const o=e.remotePeer.toString(),r=S([this.controller.signal],this.requestTimeoutMs),d=()=>t.abort(L(r.signal));r.signal.
addEventListener("abort",d,{once:!0});const a=$(t);let u,h,l,c;const b=new Promise(g=>{c=g});let y;try{y=this.manager.retainPeerInferenceConnection?.(
e,{timeoutMs:this.requestTimeoutMs+1e3});const g=S([r.signal],this.queryTimeoutMs);try{l=await a.read(g.signal)}finally{
g.dispose()}if(this._checkEnvelope(l,o),l.type==="query"){const f=await this._state(r.signal);await a.write(this._envelope(
"directory",o,{state:s===A?Y(f,this.hostingEnabled,{protocol:s}):f}),r.signal),await this._closeCompletedStream(t,r.signal);
return}if(l.type!=="generate")throw n("Unknown inference request");const i=D(l);if(s===A&&z(i.task))throw n("Speech requ\
ires inference protocol v3");if(u=`${o}:${i.requestId}`,this.inbound.has(u)||this.inbound.size>=R.maximumInbound||[...this.
inbound.values()].filter(f=>f.peerId===o).length>=R.maximumPerPeer)throw u=null,n("Peer inference queue is full","ERR_IN\
FERENCE_BUSY");this.inbound.set(u,{peerId:o,manifestCid:i.manifestCid,controller:r.controller,finished:b});const N=f=>s===
A?f.hostedModel?.manifestCid===i.manifestCid?f.hostedModel:null:f.hostedModels.find(_=>_.manifestCid===i.manifestCid),k=await this.
_state(r.signal,1,i.manifestCid),E=N(k);if(!E)throw n("Requested model is not hosted","ERR_INFERENCE_NOT_HOSTED");if(i.maxNewTokens>
E.maxNewTokens)throw n("Requested token limit exceeds hosted capacity","ERR_INFERENCE_TOKEN_LIMIT");if(i.task!==void 0&&
i.task!==E.task)throw n("Requested task does not match hosted model");if(i.task=E.task,E.queueAvailable===!1||E.busy&&E.
queuedRequests>=E.queueCapacity)throw n("Hosted model queue is full","ERR_INFERENCE_BUSY");if(D(i),i.image&&!E.modalities.
includes("image"))throw n("Hosted model does not accept images");if(await a.write({type:"upload",requestId:i.requestId},
r.signal),i.image){i.image.data=new Uint8Array(i.image.width*i.image.height*4);let f=0;for(;f<i.image.data.length;){const _=await a.
rpc.read({signal:r.signal});if(!_.byteLength||_.byteLength>R.imageChunkBytes||_.byteLength>i.image.data.length-f)throw n(
"Invalid image transfer frame");i.image.data.set(_.subarray(),f),f+=_.byteLength,await a.write({type:"image-credit",offset:f},
r.signal)}}i.audio&&(i.audio=await se(a,{audio:i.audio,requestId:i.requestId,signal:r.signal}));const C=N(await this._state(
r.signal,1,i.manifestCid));if(!C||C.task!==E.task)throw n("Inference host changed during upload");if(i.maxNewTokens>C.maxNewTokens)
throw n("Requested token limit exceeds hosted capacity","ERR_INFERENCE_TOKEN_LIMIT");if(C.queueAvailable===!1||C.busy&&C.
queuedRequests>=C.queueCapacity)throw n("Hosted model queue is full","ERR_INFERENCE_BUSY");await a.write({type:"accepted",
requestId:i.requestId,queued:C.busy},r.signal);const m=await a.read(r.signal);if(m.type!=="start"||m.requestId!==i.requestId)
throw n("Missing inference start acknowledgement");const p=re(a,i.requestId,r.controller);h=p.task;let I=Promise.resolve(),
G=0,K=0,B=0;const H=i.task==="automatic-speech-recognition"?8192:F.maxOutputBytes,J=f=>{if(r.signal.throwIfAborted(),typeof f!=
"string")throw n("Invalid host token");if(!f.length)return;if(G+=T(f),B+=T(f)+128,G>H||B>H+8192||K>=4096){const M=n("Inf\
erence token consumer exceeded its bounded output queue");throw r.controller.abort(M),M}const _={type:"token",requestId:i.
requestId,sequence:K++,text:f};I=I.then(()=>a.write(_,r.signal)).then(()=>{B-=T(f)+128}),I.catch(M=>r.controller.abort(M))};
let Z=0;const ee=f=>{if(f?.type!=="diffusion-progress")return;if(r.signal.throwIfAborted(),i.task!=="text-to-image"||++Z>
32)throw n("Invalid image generation progress");const _=V(f);I=I.then(()=>a.write({type:"progress",requestId:i.requestId,
progress:_},r.signal)),I.catch(M=>r.controller.abort(M))},q=await v(this.generateLocal({...i,requestId:`remote-${crypto.
randomUUID()}`,signal:r.signal,onToken:J,onProgress:ee}),r.signal);if(await I,r.signal.throwIfAborted(),!!q?.image!=(i.task===
"text-to-image")||!!q?.audio!=(i.task==="text-to-speech"))throw n("Inference output does not match hosted task");const O=W(
{...q,...q.image?{image:ie(q.image)}:{},...q.audio?{audio:oe(q.audio,q.sampleRate)}:{}});if(T(O.text)>H)throw n("Inferen\
ce output exceeds its task byte budget");q.image&&await ne(a,{image:q.image,metadata:O.image,requestId:i.requestId,controls:p,
signal:r.signal}),q.audio&&await ae(a,{samples:q.audio,metadata:O.audio,requestId:i.requestId,controls:p,signal:r.signal}),
await a.write({type:"done",requestId:i.requestId,result:O},r.signal),await this._closeCompletedStream(t,r.signal)}catch(g){
const i=x(g);if(r.signal.aborted)t.abort(i);else{const N={code:String(i.code??"ERR_PEER_INFERENCE").slice(0,80),message:String(
i.message??"Peer inference failed").slice(0,256)};try{await a.write(l?.type==="query"?this._envelope("error",o,N):{type:"\
error",...N},r.signal),await t.close({signal:r.signal})}catch{t.abort(i)}}}finally{u&&this.inbound.delete(u),r.signal.removeEventListener(
"abort",d),r.controller.abort(new Error("Inference stream finished")),r.dispose(),await h?.catch(()=>{}),y?.(),c()}}async generate(t,e={}){
if(this.closed)throw n("Peer inference service is stopped");const s=D({...e,requestId:e.requestId??crypto.randomUUID(),manifestCid:t},
{imageBytes:!0});if(this.outbound.has(s.requestId)||this.outbound.size>=R.maximumOutbound)throw n("Outgoing inference qu\
eue is full");const o=S([this.controller.signal,e.signal],this.requestTimeoutMs),r={controller:o.controller,peerId:null};
this.outbound.set(s.requestId,r);const a=(async()=>{let u=this.listHosts().find(c=>c.manifestCid===s.manifestCid)?.hosts.
filter(c=>!c.local)??[];u.length||(await this.refresh({signal:o.signal}),u=this.listHosts().find(c=>c.manifestCid===s.manifestCid)?.
hosts.filter(c=>!c.local)??[]);const h=this.listHosts().find(c=>c.manifestCid===s.manifestCid);if(h){if(s.task!==void 0&&
s.task!==h.task)throw n("Requested task does not match discovered model");s.task=h.task,D(s)}u=u.filter(c=>c.queueAvailable!==
!1&&(!c.busy||(c.queuedRequests??0)<(c.queueCapacity??F.maxQueued))&&(!z(s.task)||c.protocol===P)),u.sort((c,b)=>Number(
c.busy)-Number(b.busy)||(c.queuedRequests??0)-(b.queuedRequests??0)||(c.busy?0:b.idleForMs-c.idleForMs)||c.peerId.localeCompare(
b.peerId));let l=n("No remote peer hosts the requested model","ERR_INFERENCE_NOT_HOSTED");for(const c of u){o.signal.throwIfAborted(),
r.peerId=c.peerId;const b={target:`peer:${s.manifestCid}`,manifestCid:s.manifestCid,modelName:h?.name,local:!1,task:s.task,
peerId:c.peerId};e.onProgress?.({type:"routing",requestId:s.requestId,...b,route:b,busy:c.busy});const y={...s,...s.maxNewTokens===
void 0?{}:{maxNewTokens:Math.min(s.maxNewTokens,c.maxNewTokens??he)}};try{return await this._generateAt(c.peerId,y,e,o.signal)}catch(g){
if(l=g,g.committed||o.signal.aborted)throw g}}throw l})();this.operations.add(a);try{return await a}finally{this.operations.
delete(a),this.outbound.delete(s.requestId),o.dispose()}}async _generateAt(t,e,s,o){let r,d,a=!1;const u=()=>r?.abort(L(
o));o.addEventListener("abort",u,{once:!0});try{const h=await this._openStream(t,o,{audio:z(e.task)}),{connection:l}=h;r=
h.stream,d=h.release;const c=$(r),b={...e,image:e.image?{width:e.image.width,height:e.image.height,channels:4}:void 0,audio:e.
audio?Object.fromEntries(Object.entries(e.audio).filter(([m])=>m!=="samples")):void 0};await c.write(this._envelope("gen\
erate",t,b),o);const y=await c.read(o);if(y.type==="error")throw n(String(y.message).slice(0,256),y.code);if(y.type!=="u\
pload"||y.requestId!==e.requestId)throw n("Invalid inference upload acknowledgement");if(e.image)for(let m=0;m<e.image.data.
length;){const p=Math.min(m+R.imageChunkBytes,e.image.data.length);await c.rpc.write(e.image.data.subarray(m,p),{signal:o});
const I=await c.read(o);if(I.type!=="image-credit"||I.offset!==p)throw n("Invalid image transfer credit");m=p}e.audio&&await ce(
c,{samples:e.audio.samples,requestId:e.requestId,signal:o});let g=0,i=0,N=!1,k,E,C=0;for(;;){const m=await c.read(o);if(m.
type==="error")throw n(String(m.message).slice(0,256),m.code);if(m.requestId!==e.requestId)throw n("Inference response I\
D mismatch");if(m.type==="accepted"&&!N){a=!0,await c.write({type:"start",requestId:e.requestId},o);const p={target:`pee\
r:${e.manifestCid}`,manifestCid:e.manifestCid,local:!1,task:e.task,peerId:t};N=!0,s.onProgress?.({type:"accepted",requestId:e.
requestId,...p,route:p,queued:!!m.queued});continue}if(!N)throw n("Inference output preceded admission");if(m.type==="to\
ken"){if(m.sequence!==g++||g>4096||typeof m.text!="string")throw n("Invalid token sequence");if(i+=T(m.text),i>(e.task===
"automatic-speech-recognition"?8192:F.maxOutputBytes))throw n("Inference output exceeds its byte budget");await v(s.onToken?.(
m.text,{...m,peerId:t}),o)}else if(m.type==="progress"){if(e.task!=="text-to-image"||++C>32)throw n("Invalid image gener\
ation progress");await v(s.onProgress?.({...V(m.progress),requestId:e.requestId,peerId:t}),o)}else if(m.type==="result-i\
mage"){if(e.task!=="text-to-image"||k)throw n("Unexpected generated image");k=await de(c,{image:m.image,requestId:e.requestId,
signal:o})}else if(m.type==="result-audio"){if(e.task!=="text-to-speech"||E)throw n("Unexpected generated audio");E=await le(
c,{audio:m.audio,requestId:e.requestId,signal:o})}else if(m.type==="done"){const p=W(m.result);if(e.task==="automatic-sp\
eech-recognition"&&T(p.text)>8192)throw n("Speech transcript exceeds its byte budget");if(!!p.image!=(e.task==="text-to-\
image")||!!p.image!=!!k||!!p.audio!=(e.task==="text-to-speech")||!!p.audio!=!!E)throw n("Inference output does not match\
 requested task");if(k){if(["width","height","channels","sha256"].some(I=>k[I]!==p.image[I]))throw n("Generated image me\
tadata changed during transfer");p.image=k}if(E){if(Object.keys(E.metadata).some(I=>E.metadata[I]!==p.audio[I]))throw n(
"Generated audio metadata changed during transfer");p.audio=E.audio,p.sampleRate=E.sampleRate}return await this._closeCompletedStream(
r,o),{...p,requestId:e.requestId,peerId:t,manifestCid:e.manifestCid,protocol:h.protocol,connectionEncryption:l.encryption,
connectionAddress:l.remoteAddr?.toString()}}else throw n("Unknown inference output frame")}}catch(h){const l=x(h);throw r?.
abort(l),l.committed=a,a&&(l.remoteCleanupAcknowledged=!1),l}finally{d?.(),o.removeEventListener("abort",u)}}cancel(t){const e=this.
outbound.get(t);return e?(e.controller.abort(n("Caller cancelled peer inference","ERR_INFERENCE_CANCELLED")),!0):!1}async stop(){
return this.stopping?this.stopping:(this.closed=!0,this.controller.abort(n("Peer inference service stopped","ERR_INFEREN\
CE_STOPPED")),this.stopping=(async()=>{try{await this.manager.libp2p.unhandle([P,A])}finally{this.manager.libp2p.removeEventListener(
"peer:disconnect",this.disconnectListener),await Promise.allSettled([...this.operations]),this.records.clear(),this.models=
[],this.hosts=[],this.getLocalState=null,this.generateLocal=null}this.requiresCleanup=!1})().catch(t=>{throw this.stopping=
null,this.requiresCleanup=!0,t}),this.stopping)}}export{fe as PeerInferenceService};
