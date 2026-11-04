import{ak as $,aH as H,aI as V,aJ as w,aK as J,aL as x,aM as M,aN as A,aO as F,aj as L,aP as S,aQ as P,aR as T,aS as D,aT as B,
aU as Q}from"./main-E7aCypp6.js";import"./index-CK5Gf9HD.js";const j=h=>new Uint8Array(h.buffer,h.byteOffset,h.byteLength),
z=h=>V(J(j(h)));function W(h,s,r){const{signal:t}=r;let e;return{task:(async()=>{try{for(;!t.aborted;){const n=await h.read(
t);if(n.requestId!==s)throw new Error("Inference control request ID mismatch");if(n.type==="cancel")throw new Error("Rem\
ote request cancelled");if(n.type!=="result-credit"||!e||n.offset!==e.offset)throw new Error("Unexpected inference resul\
t credit");const l=e;e=null,l.resolve()}}catch(n){r.abort(n)}finally{e?.reject(t.reason??new Error("Inference control st\
ream closed")),e=null}})(),expect(n){if(t.throwIfAborted(),e)throw new Error("Overlapping inference result credit");const l=new Promise(
(a,d)=>{e={offset:n,resolve:a,reject:d}});return l.catch(()=>{}),l}}}function X(h){return $(h),H({...h,sha256:z(h.data)})}
async function Z(h,{image:s,metadata:r,requestId:t,controls:e,signal:o}){const n=j(s.data),l=e.expect(0);await h.write({
type:"result-image",requestId:t,image:r},o),await l;for(let a=0;a<n.length;){const d=Math.min(a+w.imageChunkBytes,n.length),
g=e.expect(d);await h.rpc.write(n.subarray(a,d),{signal:o}),await g,a=d}}async function ee(h,{image:s,requestId:r,signal:t}){
const e=H(s),o=new Uint8Array(e.width*e.height*4);await h.write({type:"result-credit",requestId:r,offset:0},t);let n=0;for(;n<
o.length;){const l=await h.rpc.read({signal:t});if(!l.byteLength||l.byteLength>w.imageChunkBytes||l.byteLength>o.length-
n)throw new Error("Invalid generated image transfer frame");if(o.set(l.subarray(),n),n+=l.byteLength,n===o.length&&z(o)!==
e.sha256)throw new Error("Generated image digest mismatch");await h.write({type:"result-credit",requestId:r,offset:n},t)}
return{...e,data:o}}const c=(h,s="ERR_PEER_INFERENCE")=>Object.assign(new Error(h),{code:s}),U=h=>h instanceof Error?h:c(
String(h??"Peer inference failed")),k=h=>h.reason instanceof Error?h.reason:new DOMException("Inference cancelled","Abor\
tError");function v(h,s){const r=new AbortController,t=h.filter(Boolean).map(o=>{const n=()=>r.abort(k(o));return o.addEventListener(
"abort",n,{once:!0}),o.aborted&&n(),()=>o.removeEventListener("abort",n)}),e=setTimeout(()=>r.abort(c("Peer inference de\
adline exceeded","ERR_INFERENCE_DEADLINE")),s);return e.unref?.(),{controller:r,signal:r.signal,dispose(){clearTimeout(e),
t.forEach(o=>o())}}}function N(h,s){if(s.aborted)throw Promise.resolve(h).catch(()=>{}),k(s);return new Promise((r,t)=>{
const e=()=>t(k(s));s.addEventListener("abort",e,{once:!0}),Promise.resolve(h).then(r,t).finally(()=>s.removeEventListener(
"abort",e))})}class re{constructor(s,{owner:r=Symbol("peer-inference-owner"),getLocalState:t,generate:e,queryTimeoutMs:o=w.
queryTimeoutMs,requestTimeoutMs:n=w.requestTimeoutMs,maximumPeers:l=w.maximumPeers}={}){if(typeof t!="function"||typeof e!=
"function")throw new Error("Peer inference callbacks are required");this.manager=s,this.owner=r,this.getLocalState=t,this.
generateLocal=e,this.queryTimeoutMs=x(o,15e3,100),this.requestTimeoutMs=x(n,3e5,100),this.maximumPeers=x(l,w.maximumPeers,
1),this.controller=new AbortController,this.records=new Map,this.inbound=new Map,this.outbound=new Map,this.operations=new Set,
this.hostingEnabled=!0,this.closed=!1,this.refreshing=null,this.models=[],this.hosts=[],this.lastErrors=[],this.disconnectListener=
a=>{const d=a.detail.toString();this.records.delete(d),this._group();for(const g of[...this.inbound.values(),...this.outbound.
values()])g.peerId===d&&g.controller.abort(c("Inference peer disconnected","ERR_INFERENCE_DISCONNECTED"))}}get peerId(){
return this.manager.libp2p.peerId.toString()}get scope(){const{gameId:s,roomId:r,topologyId:t}=this.manager.config;return{
gameId:s,roomId:r,topologyId:t}}async start(){return await this.manager.libp2p.handle(M,(s,r)=>{if(this.closed||this.operations.
size>=40||!A(r)){s.abort(c("Encrypted peer inference connection required"));return}const t=this._handle(s,r);this.operations.
add(t),t.catch(()=>{}).finally(()=>this.operations.delete(t))},{maxInboundStreams:4,maxOutboundStreams:4,runOnLimitedConnection:!0}),
this.manager.libp2p.addEventListener("peer:disconnect",this.disconnectListener),this}_envelope(s,r,t={}){return{type:s,scope:this.
scope,sender:this.peerId,recipient:r,...t}}_checkEnvelope(s,r){if(!s||s.sender!==r||s.recipient!==this.peerId||["gameId",
"roomId","topologyId"].some(t=>s.scope?.[t]!==this.scope[t]))throw c("Peer inference identity or scope mismatch")}async _state(s,r=0){
const t=F(await N(this.getLocalState(),s),this.hostingEnabled,{defaultMaxNewTokens:L.maxNewTokens});return this.inbound.
size>r&&(t.busy=!0,t.idleForMs=0),t}setHostingEnabled(s){if(this.hostingEnabled=!!s,!this.hostingEnabled)for(const r of this.
inbound.values())r.controller.abort(c("Peer inference hosting disabled","ERR_INFERENCE_HOST_DISABLED"));this.records.delete(
this.peerId),this._group()}_remember(s,r){this.records.set(s,{state:r,receivedAt:Date.now()})}_group(){const s=new Map,r=new Map,
t=Date.now();for(const[e,o]of this.records){if(t-o.receivedAt>w.recordTtlMs){this.records.delete(e);continue}const{state:n}=o,
l=e===this.peerId;for(const a of n.sharedModels)s.has(a.manifestCid)||s.set(a.manifestCid,{...a,providers:[]}),s.get(a.manifestCid).
providers.push({peerId:e,local:l});if(n.hostedModel){const{maxNewTokens:a,...d}=n.hostedModel;r.has(d.manifestCid)||r.set(
d.manifestCid,{...d,hosts:[]}),r.get(d.manifestCid).hosts.push({peerId:e,local:l,busy:n.busy,idleForMs:n.busy?0:n.idleForMs,
queuedRequests:n.queuedRequests,maxNewTokens:a})}}this.models=[...s.values()],this.hosts=[...r.values()]}listModels(){return this.
_group(),structuredClone(this.models)}listHosts(){return this._group(),structuredClone(this.hosts)}async _connection(s,r){
r.throwIfAborted();const t=()=>this.manager.libp2p.getConnections().filter(o=>o.remotePeer.toString()===s&&A(o)).sort((o,n)=>{
const l=a=>a.encryption==="native"?3:a.remoteAddr?.getComponents?.().some(({name:d})=>d==="p2p-circuit")?1:2;return l(n)-
l(o)})[0];let e=t();if(!e&&this.manager.peers?.has(s)&&(await N(this.manager._maybeDialPeer(s,"peer-inference"),r),e=t()),
!e)throw c("No authenticated encrypted connection to inference peer","ERR_INFERENCE_UNREACHABLE");return e}async _query(s,r){
const t=v([this.controller.signal,r],this.queryTimeoutMs);let e;const o=()=>e?.abort(k(t.signal));t.signal.addEventListener(
"abort",o,{once:!0});try{e=await(await this._connection(s,t.signal)).newStream(M,{signal:t.signal,runOnLimitedConnection:!0});
const l=S(e);await l.write(this._envelope("query",s),t.signal);const a=await l.read(t.signal);if(a?.type==="error")throw[
"sender","recipient","scope"].some(d=>Object.hasOwn(a,d))&&this._checkEnvelope(a,s),typeof a.message!="string"||a.code!==
void 0&&typeof a.code!="string"?c("Invalid inference directory error response","ERR_INFERENCE_DIRECTORY_INVALID"):c(a.message.
slice(0,256)||"Peer inference directory unavailable",a.code?.slice(0,80)||"ERR_PEER_INFERENCE");if(this._checkEnvelope(a,
s),a.type!=="directory")throw c("Invalid inference directory response");this._remember(s,F(a.state)),await e.close({signal:t.
signal})}catch(n){throw this.records.delete(s),e?.abort(n),n}finally{t.signal.removeEventListener("abort",o),t.dispose()}}async refresh({
signal:s}={}){if(this.closed)throw c("Peer inference service is stopped");if(this.refreshing)return N(this.refreshing,s??
this.controller.signal);const r=async()=>{const t=v([this.controller.signal,s],this.queryTimeoutMs*2+100);try{this._remember(
this.peerId,await this._state(t.signal));const e=[...new Set([...this.manager.libp2p.getConnections().map(n=>n.remotePeer.
toString()),...this.manager.peers?.keys()??[]])].filter(n=>n!==this.peerId&&!this.manager.bootstrapPeerIds?.has(n)).slice(
0,this.maximumPeers),o=await Promise.allSettled(e.map(n=>this._query(n,t.signal)));return t.signal.throwIfAborted(),this.
lastErrors=o.flatMap((n,l)=>n.status==="rejected"?[{peerId:e[l],code:String(n.reason?.code??"ERR_PEER_INFERENCE").slice(
0,80),message:String(n.reason?.message??"Directory unavailable").slice(0,256)}]:[]),{models:this.listModels(),hosts:this.
listHosts(),errors:structuredClone(this.lastErrors)}}finally{t.dispose()}};this.refreshing=r(),this.operations.add(this.
refreshing);try{return await this.refreshing}finally{this.operations.delete(this.refreshing),this.refreshing=null}}async _handle(s,r){
const t=r.remotePeer.toString(),e=v([this.controller.signal],this.requestTimeoutMs),o=()=>s.abort(k(e.signal));e.signal.
addEventListener("abort",o,{once:!0});const n=S(s);let l,a,d;try{const g=v([e.signal],this.queryTimeoutMs);try{d=await n.
read(g.signal)}finally{g.dispose()}if(this._checkEnvelope(d,t),d.type==="query"){await n.write(this._envelope("directory",
t,{state:await this._state(e.signal)}),e.signal),await s.close({signal:e.signal});return}if(d.type!=="generate")throw c(
"Unknown inference request");const i=P(d);if(l=`${t}:${i.requestId}`,this.inbound.has(l)||this.inbound.size>=w.maximumInbound||
[...this.inbound.values()].filter(f=>f.peerId===t).length>=w.maximumPerPeer)throw l=null,c("Peer inference queue is full",
"ERR_INFERENCE_BUSY");this.inbound.set(l,{peerId:t,controller:e.controller});const m=await this._state(e.signal,1);if(!m.
hostedModel||m.hostedModel.manifestCid!==i.manifestCid)throw c("Requested model is not hosted","ERR_INFERENCE_NOT_HOSTED");
if(i.maxNewTokens>m.hostedModel.maxNewTokens)throw c("Requested token limit exceeds hosted capacity","ERR_INFERENCE_TOKE\
N_LIMIT");if(i.task!==void 0&&i.task!==m.hostedModel.task)throw c("Requested task does not match hosted model");if(i.task=
m.hostedModel.task,P(i),i.image&&!m.hostedModel.modalities.includes("image"))throw c("Hosted model does not accept image\
s");if(await n.write({type:"upload",requestId:i.requestId},e.signal),i.image){i.image.data=new Uint8Array(i.image.width*
i.image.height*4);let f=0;for(;f<i.image.data.length;){const q=await n.rpc.read({signal:e.signal});if(!q.byteLength||q.byteLength>
w.imageChunkBytes||q.byteLength>i.image.data.length-f)throw c("Invalid image transfer frame");i.image.data.set(q.subarray(),
f),f+=q.byteLength,await n.write({type:"image-credit",offset:f},e.signal)}}const y=await this._state(e.signal,1);if(!y.hostedModel||
y.hostedModel.manifestCid!==i.manifestCid)throw c("Inference host changed during upload");if(i.maxNewTokens>y.hostedModel.
maxNewTokens)throw c("Requested token limit exceeds hosted capacity","ERR_INFERENCE_TOKEN_LIMIT");await n.write({type:"a\
ccepted",requestId:i.requestId,queued:y.busy},e.signal);const _=await n.read(e.signal);if(_.type!=="start"||_.requestId!==
i.requestId)throw c("Missing inference start acknowledgement");const E=W(n,i.requestId,e.controller);a=E.task;let b=Promise.
resolve(),u=0,p=0,I=0;const K=f=>{if(e.signal.throwIfAborted(),typeof f!="string")throw c("Invalid host token");if(!f.length)
return;if(u+=T(f),I+=T(f)+128,u>L.maxOutputBytes||I>L.maxOutputBytes+8192||p>=4096){const C=c("Inference token consumer \
exceeded its bounded output queue");throw e.controller.abort(C),C}const q={type:"token",requestId:i.requestId,sequence:p++,
text:f};b=b.then(()=>n.write(q,e.signal)).then(()=>{I-=T(f)+128}),b.catch(C=>e.controller.abort(C))};let Y=0;const G=f=>{
if(f?.type!=="diffusion-progress")return;if(e.signal.throwIfAborted(),i.task!=="text-to-image"||++Y>32)throw c("Invalid \
image generation progress");const q=D(f);b=b.then(()=>n.write({type:"progress",requestId:i.requestId,progress:q},e.signal)),
b.catch(C=>e.controller.abort(C))},R=await N(this.generateLocal({...i,requestId:`remote-${crypto.randomUUID()}`,signal:e.
signal,onToken:K,onProgress:G}),e.signal);if(await b,e.signal.throwIfAborted(),!!R?.image!=(i.task==="text-to-image"))throw c(
"Inference output does not match hosted task");const O=B({...R,...R.image?{image:X(R.image)}:{}});R.image&&await Z(n,{image:R.
image,metadata:O.image,requestId:i.requestId,controls:E,signal:e.signal}),await n.write({type:"done",requestId:i.requestId,
result:O},e.signal),await s.close({signal:e.signal})}catch(g){const i=U(g);if(e.signal.aborted)s.abort(i);else{const m={
code:String(i.code??"ERR_PEER_INFERENCE").slice(0,80),message:String(i.message??"Peer inference failed").slice(0,256)};try{
await n.write(d?.type==="query"?this._envelope("error",t,m):{type:"error",...m},e.signal),await s.close({signal:e.signal})}catch{
s.abort(i)}}}finally{l&&this.inbound.delete(l),e.signal.removeEventListener("abort",o),e.controller.abort(new Error("Inf\
erence stream finished")),e.dispose(),await a?.catch(()=>{})}}async generate(s,r={}){if(this.closed)throw c("Peer infere\
nce service is stopped");const t=P({...r,requestId:r.requestId??crypto.randomUUID(),manifestCid:s},{imageBytes:!0});if(this.
outbound.has(t.requestId)||this.outbound.size>=w.maximumOutbound)throw c("Outgoing inference queue is full");const e=v([
this.controller.signal,r.signal],this.requestTimeoutMs),o={controller:e.controller,peerId:null};this.outbound.set(t.requestId,
o);const l=(async()=>{let a=this.listHosts().find(i=>i.manifestCid===t.manifestCid)?.hosts.filter(i=>!i.local)??[];a.length||
(await this.refresh({signal:e.signal}),a=this.listHosts().find(i=>i.manifestCid===t.manifestCid)?.hosts.filter(i=>!i.local)??
[]);const d=this.listHosts().find(i=>i.manifestCid===t.manifestCid);if(d){if(t.task!==void 0&&t.task!==d.task)throw c("R\
equested task does not match discovered model");t.task=d.task,P(t)}a.sort((i,m)=>Number(i.busy)-Number(m.busy)||(i.busy?
0:m.idleForMs-i.idleForMs));let g=c("No remote peer hosts the requested model","ERR_INFERENCE_NOT_HOSTED");for(const i of a){
e.signal.throwIfAborted(),o.peerId=i.peerId,r.onProgress?.({type:"routing",requestId:t.requestId,peerId:i.peerId,busy:i.
busy});const m={...t,maxNewTokens:Math.min(t.maxNewTokens,i.maxNewTokens??Q)};try{return await this._generateAt(i.peerId,
m,r,e.signal)}catch(y){if(g=y,y.committed||e.signal.aborted)throw y}}throw g})();this.operations.add(l);try{return await l}finally{
this.operations.delete(l),this.outbound.delete(t.requestId),e.dispose()}}async _generateAt(s,r,t,e){let o,n=!1;const l=()=>o?.
abort(k(e));e.addEventListener("abort",l,{once:!0});try{const a=await this._connection(s,e);o=await a.newStream(M,{signal:e,
runOnLimitedConnection:!0});const d=S(o),g={...r,image:r.image?{width:r.image.width,height:r.image.height,channels:4}:void 0};
await d.write(this._envelope("generate",s,g),e);const i=await d.read(e);if(i.type==="error")throw c(String(i.message).slice(
0,256),i.code);if(i.type!=="upload"||i.requestId!==r.requestId)throw c("Invalid inference upload acknowledgement");if(r.
image)for(let u=0;u<r.image.data.length;){const p=Math.min(u+w.imageChunkBytes,r.image.data.length);await d.rpc.write(r.
image.data.subarray(u,p),{signal:e});const I=await d.read(e);if(I.type!=="image-credit"||I.offset!==p)throw c("Invalid i\
mage transfer credit");u=p}let m=0,y=0,_=!1,E,b=0;for(;;){const u=await d.read(e);if(u.type==="error")throw c(String(u.message).
slice(0,256),u.code);if(u.requestId!==r.requestId)throw c("Inference response ID mismatch");if(u.type==="accepted"&&!_){
n=!0,await d.write({type:"start",requestId:r.requestId},e),_=!0,t.onProgress?.({type:"accepted",requestId:r.requestId,peerId:s,
queued:!!u.queued});continue}if(!_)throw c("Inference output preceded admission");if(u.type==="token"){if(u.sequence!==m++||
m>4096||typeof u.text!="string")throw c("Invalid token sequence");if(y+=T(u.text),y>L.maxOutputBytes)throw c("Inference \
output exceeds its byte budget");await N(t.onToken?.(u.text,{...u,peerId:s}),e)}else if(u.type==="progress"){if(r.task!==
"text-to-image"||++b>32)throw c("Invalid image generation progress");await N(t.onProgress?.({...D(u.progress),requestId:r.
requestId,peerId:s}),e)}else if(u.type==="result-image"){if(r.task!=="text-to-image"||E)throw c("Unexpected generated im\
age");E=await ee(d,{image:u.image,requestId:r.requestId,signal:e})}else if(u.type==="done"){const p=B(u.result);if(!!p.image!=
(r.task==="text-to-image")||!!p.image!=!!E)throw c("Inference output does not match requested task");if(E){if(["width","\
height","channels","sha256"].some(I=>E[I]!==p.image[I]))throw c("Generated image metadata changed during transfer");p.image=
E}return await o.close({signal:e}),{...p,requestId:r.requestId,peerId:s,manifestCid:r.manifestCid,connectionEncryption:a.
encryption,connectionAddress:a.remoteAddr?.toString()}}else throw c("Unknown inference output frame")}}catch(a){const d=U(
a);throw o?.abort(d),d.committed=n,d}finally{e.removeEventListener("abort",l)}}cancel(s){const r=this.outbound.get(s);return r?
(r.controller.abort(c("Caller cancelled peer inference","ERR_INFERENCE_CANCELLED")),!0):!1}async stop(){return this.stopping?
this.stopping:(this.closed=!0,this.controller.abort(c("Peer inference service stopped","ERR_INFERENCE_STOPPED")),this.stopping=
(async()=>{try{await this.manager.libp2p.unhandle(M)}finally{this.manager.libp2p.removeEventListener("peer:disconnect",this.
disconnectListener),await Promise.allSettled([...this.operations]),this.records.clear(),this.models=[],this.hosts=[],this.
getLocalState=null,this.generateLocal=null}this.requiresCleanup=!1})().catch(s=>{throw this.stopping=null,this.requiresCleanup=
!0,s}),this.stopping)}}export{re as PeerInferenceService};
