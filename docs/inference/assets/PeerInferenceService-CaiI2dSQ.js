import{ax as oe,b7 as X,b8 as ie,b9 as C,ba as ne,bb as H,bc as P,bd as S,be as j,bf as Y,M as F,bg as ae,bh as $,bi as D,
bj as z,bk as ce,bl as T,bm as K,bn as W,bo as de,bp as le,bq as he,br as ue,bs as fe}from"./main-Ba299aVs.js";import"./index-BXlUi_Kl.js";
const J=u=>new Uint8Array(u.buffer,u.byteOffset,u.byteLength),Z=u=>ie(ne(J(u)));function me(u,t,e){const{signal:s}=e;let r;
return{task:(async()=>{try{for(;!s.aborted;){const i=await u.read(s);if(i.requestId!==t)throw new Error("Inference contr\
ol request ID mismatch");if(i.type==="cancel")throw new Error("Remote request cancelled");if(i.type!=="result-credit"||!r||
i.offset!==r.offset)throw new Error("Unexpected inference result credit");const n=r;r=null,n.resolve()}}catch(i){e.abort(
i)}finally{r?.reject(s.reason??new Error("Inference control stream closed")),r=null}})(),expect(i){if(s.throwIfAborted(),
r)throw new Error("Overlapping inference result credit");const n=new Promise((f,h)=>{r={offset:i,resolve:f,reject:h}});return n.
catch(()=>{}),n}}}function ge(u){return oe(u),X({...u,sha256:Z(u.data)})}async function pe(u,{image:t,metadata:e,requestId:s,
controls:r,signal:o}){const i=J(t.data),n=r.expect(0);await u.write({type:"result-image",requestId:s,image:e},o),await n;
for(let f=0;f<i.length;){const h=Math.min(f+C.imageChunkBytes,i.length),l=r.expect(h);await u.rpc.write(i.subarray(f,h),
{signal:o}),await l,f=h}}async function we(u,{image:t,requestId:e,signal:s}){const r=X(t),o=new Uint8Array(r.width*r.height*
4);await u.write({type:"result-credit",requestId:e,offset:0},s);let i=0;for(;i<o.length;){const n=await u.rpc.read({signal:s});
if(!n.byteLength||n.byteLength>C.imageChunkBytes||n.byteLength>o.length-i)throw new Error("Invalid generated image trans\
fer frame");if(o.set(n.subarray(),i),i+=n.byteLength,i===o.length&&Z(o)!==r.sha256)throw new Error("Generated image dige\
st mismatch");await u.write({type:"result-credit",requestId:e,offset:i},s)}return{...r,data:o}}const c=(u,t="ERR_PEER_IN\
FERENCE")=>Object.assign(new Error(u),{code:t}),x=u=>u instanceof Error?u:c(String(u??"Peer inference failed")),L=u=>u.reason instanceof
Error?u.reason:new DOMException("Inference cancelled","AbortError"),ee=u=>u?.code==="ERR_INFERENCE_DEADLINE"||["TimeoutE\
rror","ConnectionClosedError","StreamResetError","StreamStateError"].includes(u?.name),Q=u=>u.some(ee)&&!u.some(t=>["Uns\
upportedProtocolError","TooManyOutboundProtocolStreamsError","TooManyInboundProtocolStreamsError","LimitedConnectionErro\
r","InvalidParametersError"].includes(t?.name));function M(u,t){const e=new AbortController,s=u.filter(Boolean).map(o=>{
const i=()=>e.abort(L(o));return o.addEventListener("abort",i,{once:!0}),o.aborted&&i(),()=>o.removeEventListener("abort",
i)}),r=setTimeout(()=>e.abort(c("Peer inference deadline exceeded","ERR_INFERENCE_DEADLINE")),t);return r.unref?.(),{controller:e,
signal:e.signal,dispose(){clearTimeout(r),s.forEach(o=>o())}}}function N(u,t){if(t.aborted)throw Promise.resolve(u).catch(
()=>{}),L(t);return new Promise((e,s)=>{const r=()=>s(L(t));t.addEventListener("abort",r,{once:!0}),Promise.resolve(u).then(
e,s).finally(()=>t.removeEventListener("abort",r))})}class ye{constructor(t,{owner:e=Symbol("peer-inference-owner"),getLocalState:s,
generate:r,queryTimeoutMs:o=C.queryTimeoutMs,requestTimeoutMs:i=C.requestTimeoutMs,maximumPeers:n=C.maximumPeers}={}){if(typeof s!=
"function"||typeof r!="function")throw new Error("Peer inference callbacks are required");this.manager=t,this.owner=e,this.
getLocalState=s,this.generateLocal=r,this.queryTimeoutMs=H(o,15e3,100),this.requestTimeoutMs=H(i,3e5,100),this.maximumPeers=
H(n,C.maximumPeers,1),this.controller=new AbortController,this.records=new Map,this.inbound=new Map,this.outbound=new Map,
this.operations=new Set,this.hostingEnabled=!0,this.closed=!1,this.refreshing=null,this.models=[],this.hosts=[],this.lastErrors=
[],this.failedConnections=new WeakMap,this.recoveries=new Map,this.disconnectListener=f=>{const h=f.detail.toString();this.
records.delete(h),this._group();for(const l of[...this.inbound.values(),...this.outbound.values()])l.peerId===h&&l.controller.
abort(c("Inference peer disconnected","ERR_INFERENCE_DISCONNECTED"))}}get peerId(){return this.manager.libp2p.peerId.toString()}get scope(){
const{gameId:t,roomId:e,topologyId:s}=this.manager.config;return{gameId:t,roomId:e,topologyId:s}}async start(){for(const t of[
P,S])await this.manager.libp2p.handle(t,(e,s)=>{if(this.closed||this.operations.size>=40||!j(s)){e.abort(c("Encrypted pe\
er inference connection required"));return}const r=this._handle(e,s,t);this.operations.add(r),r.catch(()=>{}).finally(()=>this.
operations.delete(r))},{maxInboundStreams:4,maxOutboundStreams:4,runOnLimitedConnection:!0});return this.manager.libp2p.
addEventListener("peer:disconnect",this.disconnectListener),this}_envelope(t,e,s={}){return{type:t,scope:this.scope,sender:this.
peerId,recipient:e,...s}}_checkEnvelope(t,e){if(!t||t.sender!==e||t.recipient!==this.peerId||["gameId","roomId","topolog\
yId"].some(s=>t.scope?.[s]!==this.scope[s]))throw c("Peer inference identity or scope mismatch")}async _state(t,e=0,s){const r=Y(
await N(this.getLocalState(),t),this.hostingEnabled,{defaultMaxNewTokens:F.maxNewTokens});for(const o of r.hostedModels)
[...this.inbound.values()].filter(n=>n.manifestCid===o.manifestCid).length>(o.manifestCid===s?e:0)&&(o.busy=!0,o.idleForMs=
0);return this.inbound.size>e&&(r.busy=!0,r.idleForMs=0),r}setHostingEnabled(t){if(this.hostingEnabled=!!t,!this.hostingEnabled)
for(const e of this.inbound.values())e.controller.abort(c("Peer inference hosting disabled","ERR_INFERENCE_HOST_DISABLED"));
this.records.delete(this.peerId),this._group()}async cancelHostedModel(t){t=ae(t);const e=[...this.inbound.values()].filter(
s=>s.manifestCid===t);for(const s of e)s.controller.abort(c("Hosted model is unloading","ERR_INFERENCE_HOST_DISABLED"));
return await Promise.allSettled(e.map(s=>s.finished)),this.records.delete(this.peerId),this._group(),e.length}_remember(t,e,s=P){
this.records.set(t,{state:e,protocol:s,receivedAt:Date.now()})}_group(){const t=new Map,e=new Map,s=Date.now();for(const[
r,o]of this.records){if(s-o.receivedAt>C.recordTtlMs){this.records.delete(r);continue}const{state:i}=o,n=r===this.peerId;
for(const f of i.sharedModels)t.has(f.manifestCid)||t.set(f.manifestCid,{...f,providers:[]}),t.get(f.manifestCid).providers.
push({peerId:r,local:n});for(const f of i.hostedModels??(i.hostedModel?[{...i.hostedModel,busy:i.busy,idleForMs:i.idleForMs,
queuedRequests:i.queuedRequests}]:[])){const{maxNewTokens:h,busy:l,idleForMs:d,queuedRequests:b,queueCapacity:y,queueAvailable:p,
...a}=f;e.has(a.manifestCid)||e.set(a.manifestCid,{...a,hosts:[]}),e.get(a.manifestCid).hosts.push({peerId:r,local:n,busy:l,
idleForMs:l?0:d,queuedRequests:b,queueCapacity:y,queueAvailable:p,maxNewTokens:h,protocol:o.protocol})}}this.models=[...t.
values()],this.hosts=[...e.values()]}listModels(){return this._group(),structuredClone(this.models)}listHosts(){return this.
_group(),structuredClone(this.hosts)}_connections(t){return this.manager.libp2p.getConnections().filter(e=>e.remotePeer.
toString()===t&&j(e)).sort((e,s)=>{const r=o=>(o.encryption==="native"?3:o.remoteAddr?.getComponents?.().some(({name:i})=>i===
"p2p-circuit")?1:2)-((this.failedConnections.get(o)??0)>Date.now()?10:0);return r(s)-r(e)})}async _connection(t,e){e.throwIfAborted();
const s=()=>this._connections(t)[0];let r=s();if(!r&&this.manager.peers?.has(t)&&(await N(this.manager._maybeDialPeer(t,
"peer-inference"),e),r=s()),!r)throw c("No authenticated encrypted connection to inference peer","ERR_INFERENCE_UNREACHA\
BLE");return r}_recoverConnection(t){if(this.recoveries.has(t))return this.recoveries.get(t);const e=this.manager.recoverPeerInferenceConnection(
t,{signal:this.controller.signal});this.recoveries.set(t,e),this.operations.add(e);const s=()=>{this.operations.delete(e),
this.recoveries.get(t)===e&&this.recoveries.delete(t)};return e.then(s,s),e}async _openStream(t,e,{audio:s=!1,backgroundRecovery:r=!1}={}){
const o=await this._connection(t,e),i=[...new Set([o,...this._connections(t)])].slice(0,4),n=[];let f;const h=async l=>{
if(e.throwIfAborted(),l.remotePeer.toString()!==t||!j(l))throw c("Invalid recovered inference connection");const d=M([this.
controller.signal,e],Math.min(2e3,this.queryTimeoutMs/2));let b;try{b=Promise.resolve(l.newStream(s?P:[P,S],{signal:d.signal,
runOnLimitedConnection:!0}));const y=await N(b,d.signal);d.signal.throwIfAborted();const p=this.manager.retainPeerInferenceConnection?.(
l,{timeoutMs:this.requestTimeoutMs+1e3});return this.failedConnections.delete(l),{connection:l,stream:y,release:p,protocol:y.
protocol??P}}catch(y){const p=x(y);throw b?.then(a=>a.abort(p),()=>{}).catch(()=>{}),ee(p)&&this.failedConnections.set(l,
Date.now()+15e3),n.push(p),p}finally{d.dispose()}};try{for(const l of i)try{return await h(l)}catch{e.throwIfAborted(),this.
controller.signal.throwIfAborted()}}catch(l){throw r&&e.reason?.code==="ERR_INFERENCE_DEADLINE"&&Q(n)&&!this.controller.
signal.aborted&&this.manager.recoverPeerInferenceConnection&&this._recoverConnection(t).catch(()=>{}),l}if(Q(n)&&this.manager.
recoverPeerInferenceConnection)try{const l=await N(this._recoverConnection(t),e);return e.throwIfAborted(),await h(l)}catch(l){
e.throwIfAborted(),this.controller.signal.throwIfAborted(),f=x(l)}throw Object.assign(new AggregateError(n,`Unable to op\
en an encrypted inference stream: ${String(n.at(-1)?.message??"connections closed").slice(0,160)}`,{cause:n.at(-1)}),{code:"\
ERR_INFERENCE_STREAM_UNAVAILABLE",peerId:t,recoveryError:f})}async _closeCompletedStream(t,e){const s=M([this.controller.
signal,e],Math.min(1e3,this.queryTimeoutMs/2));try{await N(Promise.resolve().then(()=>t.close({signal:s.signal})),s.signal)}catch(r){
try{Promise.resolve(t.abort(x(r))).catch(()=>{})}catch{}this.controller.signal.throwIfAborted(),e.throwIfAborted()}finally{
s.dispose()}this.controller.signal.throwIfAborted(),e.throwIfAborted()}async _query(t,e){const s=M([this.controller.signal,
e],this.queryTimeoutMs);let r,o;const i=()=>r?.abort(L(s.signal));s.signal.addEventListener("abort",i,{once:!0});try{let n;
({stream:r,protocol:n,release:o}=await this._openStream(t,s.signal,{backgroundRecovery:!0}));const f=$(r);await f.write(
this._envelope("query",t),s.signal);const h=await f.read(s.signal);if(h?.type==="error")throw["sender","recipient","scop\
e"].some(l=>Object.hasOwn(h,l))&&this._checkEnvelope(h,t),typeof h.message!="string"||h.code!==void 0&&typeof h.code!="s\
tring"?c("Invalid inference directory error response","ERR_INFERENCE_DIRECTORY_INVALID"):c(h.message.slice(0,256)||"Peer\
 inference directory unavailable",h.code?.slice(0,80)||"ERR_PEER_INFERENCE");if(this._checkEnvelope(h,t),h.type!=="direc\
tory")throw c("Invalid inference directory response");this._remember(t,Y(h.state,!0,{protocol:n}),n),await this._closeCompletedStream(
r,s.signal)}catch(n){throw this.records.delete(t),r?.abort(n),n}finally{o?.(),s.signal.removeEventListener("abort",i),s.
dispose()}}async refresh({signal:t}={}){if(this.closed)throw c("Peer inference service is stopped");if(this.refreshing)return N(
this.refreshing,t??this.controller.signal);const e=async()=>{const s=M([this.controller.signal,t],this.queryTimeoutMs*2+
100);try{this._remember(this.peerId,await this._state(s.signal));const r=[...new Set([...this.manager.libp2p.getConnections().
map(i=>i.remotePeer.toString()),...this.manager.peers?.keys()??[]])].filter(i=>i!==this.peerId&&!this.manager.bootstrapPeerIds?.
has(i)).slice(0,this.maximumPeers),o=await Promise.allSettled(r.map(i=>this._query(i,s.signal)));return s.signal.throwIfAborted(),
this.lastErrors=o.flatMap((i,n)=>i.status==="rejected"?[{peerId:r[n],code:String(i.reason?.code??"ERR_PEER_INFERENCE").slice(
0,80),message:String(i.reason?.message??"Directory unavailable").slice(0,256)}]:[]),{models:this.listModels(),hosts:this.
listHosts(),errors:structuredClone(this.lastErrors)}}finally{s.dispose()}};this.refreshing=e(),this.operations.add(this.
refreshing);try{return await this.refreshing}finally{this.operations.delete(this.refreshing),this.refreshing=null}}async _handle(t,e,s=P){
const r=e.remotePeer.toString(),o=M([this.controller.signal],this.requestTimeoutMs),i=()=>t.abort(L(o.signal));o.signal.
addEventListener("abort",i,{once:!0});const n=$(t);let f,h,l,d;const b=new Promise(p=>{d=p});let y;try{y=this.manager.retainPeerInferenceConnection?.(
e,{timeoutMs:this.requestTimeoutMs+1e3});const p=M([o.signal],this.queryTimeoutMs);try{l=await n.read(p.signal)}finally{
p.dispose()}if(this._checkEnvelope(l,r),l.type==="query"){const g=await this._state(o.signal);await n.write(this._envelope(
"directory",r,{state:s===S?Y(g,this.hostingEnabled,{protocol:s}):g}),o.signal),await this._closeCompletedStream(t,o.signal);
return}if(l.type!=="generate")throw c("Unknown inference request");const a=D(l);if(s===S&&z(a.task))throw c("Speech requ\
ires inference protocol v3");if(f=`${r}:${a.requestId}`,this.inbound.has(f)||this.inbound.size>=C.maximumInbound||[...this.
inbound.values()].filter(g=>g.peerId===r).length>=C.maximumPerPeer)throw f=null,c("Peer inference queue is full","ERR_IN\
FERENCE_BUSY");this.inbound.set(f,{peerId:r,manifestCid:a.manifestCid,controller:o.controller,finished:b});const v=g=>s===
S?g.hostedModel?.manifestCid===a.manifestCid?g.hostedModel:null:g.hostedModels.find(_=>_.manifestCid===a.manifestCid),k=await this.
_state(o.signal,1,a.manifestCid),E=v(k);if(!E)throw c("Requested model is not hosted","ERR_INFERENCE_NOT_HOSTED");if(a.maxNewTokens>
E.maxNewTokens)throw c("Requested token limit exceeds hosted capacity","ERR_INFERENCE_TOKEN_LIMIT");if(a.task!==void 0&&
a.task!==E.task)throw c("Requested task does not match hosted model");if(a.task=E.task,E.queueAvailable===!1||E.busy&&E.
queuedRequests>=E.queueCapacity)throw c("Hosted model queue is full","ERR_INFERENCE_BUSY");if(D(a),a.image&&!E.modalities.
includes("image"))throw c("Hosted model does not accept images");if(await n.write({type:"upload",requestId:a.requestId},
o.signal),a.image){a.image.data=new Uint8Array(a.image.width*a.image.height*4);let g=0;for(;g<a.image.data.length;){const _=await n.
rpc.read({signal:o.signal});if(!_.byteLength||_.byteLength>C.imageChunkBytes||_.byteLength>a.image.data.length-g)throw c(
"Invalid image transfer frame");a.image.data.set(_.subarray(),g),g+=_.byteLength,await n.write({type:"image-credit",offset:g},
o.signal)}}a.audio&&(a.audio=await ce(n,{audio:a.audio,requestId:a.requestId,signal:o.signal}));const R=v(await this._state(
o.signal,1,a.manifestCid));if(!R||R.task!==E.task)throw c("Inference host changed during upload");if(a.maxNewTokens>R.maxNewTokens)
throw c("Requested token limit exceeds hosted capacity","ERR_INFERENCE_TOKEN_LIMIT");if(R.queueAvailable===!1||R.busy&&R.
queuedRequests>=R.queueCapacity)throw c("Hosted model queue is full","ERR_INFERENCE_BUSY");await n.write({type:"accepted",
requestId:a.requestId,queued:R.busy},o.signal);const m=await n.read(o.signal);if(m.type!=="start"||m.requestId!==a.requestId)
throw c("Missing inference start acknowledgement");const w=me(n,a.requestId,o.controller);h=w.task;let I=Promise.resolve(),
G=0,V=0,B=0;const U=a.task==="automatic-speech-recognition"?8192:F.maxOutputBytes,te=g=>{if(o.signal.throwIfAborted(),typeof g!=
"string")throw c("Invalid host token");if(!g.length)return;if(G+=T(g),B+=T(g)+128,G>U||B>U+8192||V>=4096){const A=c("Inf\
erence token consumer exceeded its bounded output queue");throw o.controller.abort(A),A}const _={type:"token",requestId:a.
requestId,sequence:V++,text:g};I=I.then(()=>n.write(_,o.signal)).then(()=>{B-=T(g)+128}),I.catch(A=>o.controller.abort(A))};
let se=0;const re=g=>{if(g?.type!=="diffusion-progress")return;if(o.signal.throwIfAborted(),a.task!=="text-to-image"||++se>
32)throw c("Invalid image generation progress");const _=K(g);I=I.then(()=>n.write({type:"progress",requestId:a.requestId,
progress:_},o.signal)),I.catch(A=>o.controller.abort(A))},q=await N(this.generateLocal({...a,requestId:`remote-${crypto.
randomUUID()}`,signal:o.signal,onToken:te,onProgress:re}),o.signal);if(await I,o.signal.throwIfAborted(),!!q?.image!=(a.
task==="text-to-image")||!!q?.audio!=(a.task==="text-to-speech"))throw c("Inference output does not match hosted task");
const O=W({...q,...q.image?{image:ge(q.image)}:{},...q.audio?{audio:de(q.audio,q.sampleRate)}:{}});if(T(O.text)>U)throw c(
"Inference output exceeds its task byte budget");q.image&&await pe(n,{image:q.image,metadata:O.image,requestId:a.requestId,
controls:w,signal:o.signal}),q.audio&&await le(n,{samples:q.audio,metadata:O.audio,requestId:a.requestId,controls:w,signal:o.
signal}),await n.write({type:"done",requestId:a.requestId,result:O},o.signal),await this._closeCompletedStream(t,o.signal)}catch(p){
const a=x(p);if(o.signal.aborted)t.abort(a);else{const v={code:String(a.code??"ERR_PEER_INFERENCE").slice(0,80),message:String(
a.message??"Peer inference failed").slice(0,256)};try{await n.write(l?.type==="query"?this._envelope("error",r,v):{type:"\
error",...v},o.signal),await t.close({signal:o.signal})}catch{t.abort(a)}}}finally{f&&this.inbound.delete(f),o.signal.removeEventListener(
"abort",i),o.controller.abort(new Error("Inference stream finished")),o.dispose(),await h?.catch(()=>{}),y?.(),d()}}async generate(t,e={}){
if(this.closed)throw c("Peer inference service is stopped");const s=D({...e,requestId:e.requestId??crypto.randomUUID(),manifestCid:t},
{imageBytes:!0});if(this.outbound.has(s.requestId)||this.outbound.size>=C.maximumOutbound)throw c("Outgoing inference qu\
eue is full");const r=M([this.controller.signal,e.signal],this.requestTimeoutMs),o={controller:r.controller,peerId:null};
this.outbound.set(s.requestId,o);const n=(async()=>{let f=this.listHosts().find(d=>d.manifestCid===s.manifestCid)?.hosts.
filter(d=>!d.local)??[];f.length||(await this.refresh({signal:r.signal}),f=this.listHosts().find(d=>d.manifestCid===s.manifestCid)?.
hosts.filter(d=>!d.local)??[]);const h=this.listHosts().find(d=>d.manifestCid===s.manifestCid);if(h){if(s.task!==void 0&&
s.task!==h.task)throw c("Requested task does not match discovered model");s.task=h.task,D(s)}f=f.filter(d=>d.queueAvailable!==
!1&&(!d.busy||(d.queuedRequests??0)<(d.queueCapacity??F.maxQueued))&&(!z(s.task)||d.protocol===P)),f.sort((d,b)=>Number(
d.busy)-Number(b.busy)||(d.queuedRequests??0)-(b.queuedRequests??0)||(d.busy?0:b.idleForMs-d.idleForMs)||d.peerId.localeCompare(
b.peerId));let l=c("No remote peer hosts the requested model","ERR_INFERENCE_NOT_HOSTED");for(const d of f){r.signal.throwIfAborted(),
o.peerId=d.peerId;const b={target:`peer:${s.manifestCid}`,manifestCid:s.manifestCid,modelName:h?.name,local:!1,task:s.task,
peerId:d.peerId};e.onProgress?.({type:"routing",requestId:s.requestId,...b,route:b,busy:d.busy});const y={...s,...s.maxNewTokens===
void 0?{}:{maxNewTokens:Math.min(s.maxNewTokens,d.maxNewTokens??fe)}};try{return await this._generateAt(d.peerId,y,e,r.signal)}catch(p){
if(l=p,p.committed||r.signal.aborted)throw p}}throw l})();this.operations.add(n);try{return await n}finally{this.operations.
delete(n),this.outbound.delete(s.requestId),r.dispose()}}async _generateAt(t,e,s,r){let o,i,n=!1;const f=()=>o?.abort(L(
r));r.addEventListener("abort",f,{once:!0});try{const h=await this._openStream(t,r,{audio:z(e.task)}),{connection:l}=h;o=
h.stream,i=h.release;const d=$(o),b={...e,image:e.image?{width:e.image.width,height:e.image.height,channels:4}:void 0,audio:e.
audio?Object.fromEntries(Object.entries(e.audio).filter(([m])=>m!=="samples")):void 0};await d.write(this._envelope("gen\
erate",t,b),r);const y=await d.read(r);if(y.type==="error")throw c(String(y.message).slice(0,256),y.code);if(y.type!=="u\
pload"||y.requestId!==e.requestId)throw c("Invalid inference upload acknowledgement");if(e.image)for(let m=0;m<e.image.data.
length;){const w=Math.min(m+C.imageChunkBytes,e.image.data.length);await d.rpc.write(e.image.data.subarray(m,w),{signal:r});
const I=await d.read(r);if(I.type!=="image-credit"||I.offset!==w)throw c("Invalid image transfer credit");m=w}e.audio&&await he(
d,{samples:e.audio.samples,requestId:e.requestId,signal:r});let p=0,a=0,v=!1,k,E,R=0;for(;;){const m=await d.read(r);if(m.
type==="error")throw c(String(m.message).slice(0,256),m.code);if(m.requestId!==e.requestId)throw c("Inference response I\
D mismatch");if(m.type==="accepted"&&!v){n=!0,await d.write({type:"start",requestId:e.requestId},r);const w={target:`pee\
r:${e.manifestCid}`,manifestCid:e.manifestCid,local:!1,task:e.task,peerId:t};v=!0,s.onProgress?.({type:"accepted",requestId:e.
requestId,...w,route:w,queued:!!m.queued});continue}if(!v)throw c("Inference output preceded admission");if(m.type==="to\
ken"){if(m.sequence!==p++||p>4096||typeof m.text!="string")throw c("Invalid token sequence");if(a+=T(m.text),a>(e.task===
"automatic-speech-recognition"?8192:F.maxOutputBytes))throw c("Inference output exceeds its byte budget");await N(s.onToken?.(
m.text,{...m,peerId:t}),r)}else if(m.type==="progress"){if(e.task!=="text-to-image"||++R>32)throw c("Invalid image gener\
ation progress");await N(s.onProgress?.({...K(m.progress),requestId:e.requestId,peerId:t}),r)}else if(m.type==="result-i\
mage"){if(e.task!=="text-to-image"||k)throw c("Unexpected generated image");k=await we(d,{image:m.image,requestId:e.requestId,
signal:r})}else if(m.type==="result-audio"){if(e.task!=="text-to-speech"||E)throw c("Unexpected generated audio");E=await ue(
d,{audio:m.audio,requestId:e.requestId,signal:r})}else if(m.type==="done"){const w=W(m.result);if(e.task==="automatic-sp\
eech-recognition"&&T(w.text)>8192)throw c("Speech transcript exceeds its byte budget");if(!!w.image!=(e.task==="text-to-\
image")||!!w.image!=!!k||!!w.audio!=(e.task==="text-to-speech")||!!w.audio!=!!E)throw c("Inference output does not match\
 requested task");if(k){if(["width","height","channels","sha256"].some(I=>k[I]!==w.image[I]))throw c("Generated image me\
tadata changed during transfer");w.image=k}if(E){if(Object.keys(E.metadata).some(I=>E.metadata[I]!==w.audio[I]))throw c(
"Generated audio metadata changed during transfer");w.audio=E.audio,w.sampleRate=E.sampleRate}return await this._closeCompletedStream(
o,r),{...w,requestId:e.requestId,peerId:t,manifestCid:e.manifestCid,protocol:h.protocol,connectionEncryption:l.encryption,
connectionAddress:l.remoteAddr?.toString()}}else throw c("Unknown inference output frame")}}catch(h){const l=x(h);throw o?.
abort(l),l.committed=n,n&&(l.remoteCleanupAcknowledged=!1),l}finally{i?.(),r.removeEventListener("abort",f)}}cancel(t){const e=this.
outbound.get(t);return e?(e.controller.abort(c("Caller cancelled peer inference","ERR_INFERENCE_CANCELLED")),!0):!1}async stop(){
return this.stopping?this.stopping:(this.closed=!0,this.controller.abort(c("Peer inference service stopped","ERR_INFEREN\
CE_STOPPED")),this.stopping=(async()=>{try{await this.manager.libp2p.unhandle([P,S])}finally{this.manager.libp2p.removeEventListener(
"peer:disconnect",this.disconnectListener),await Promise.allSettled([...this.operations]),this.records.clear(),this.models=
[],this.hosts=[],this.getLocalState=null,this.generateLocal=null}this.requiresCleanup=!1})().catch(t=>{throw this.stopping=
null,this.requiresCleanup=!0,t}),this.stopping)}}export{ye as PeerInferenceService};
