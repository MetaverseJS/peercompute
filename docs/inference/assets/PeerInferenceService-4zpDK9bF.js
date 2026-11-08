import{ak as G,aH as j,aI as V,aJ as y,aK as J,aL as S,aM as x,aN as A,aO as B,aj as L,aP as O,aQ as P,aR as T,aS as U,aT as H,
aU as Q}from"./main-Bi25mBGM.js";import"./index-Douplpni.js";const z=h=>new Uint8Array(h.buffer,h.byteOffset,h.byteLength),
K=h=>V(J(z(h)));function W(h,s,t){const{signal:r}=t;let e;return{task:(async()=>{try{for(;!r.aborted;){const n=await h.read(
r);if(n.requestId!==s)throw new Error("Inference control request ID mismatch");if(n.type==="cancel")throw new Error("Rem\
ote request cancelled");if(n.type!=="result-credit"||!e||n.offset!==e.offset)throw new Error("Unexpected inference resul\
t credit");const i=e;e=null,i.resolve()}}catch(n){t.abort(n)}finally{e?.reject(r.reason??new Error("Inference control st\
ream closed")),e=null}})(),expect(n){if(r.throwIfAborted(),e)throw new Error("Overlapping inference result credit");const i=new Promise(
(l,d)=>{e={offset:n,resolve:l,reject:d}});return i.catch(()=>{}),i}}}function X(h){return G(h),j({...h,sha256:K(h.data)})}
async function Z(h,{image:s,metadata:t,requestId:r,controls:e,signal:a}){const n=z(s.data),i=e.expect(0);await h.write({
type:"result-image",requestId:r,image:t},a),await i;for(let l=0;l<n.length;){const d=Math.min(l+y.imageChunkBytes,n.length),
f=e.expect(d);await h.rpc.write(n.subarray(l,d),{signal:a}),await f,l=d}}async function ee(h,{image:s,requestId:t,signal:r}){
const e=j(s),a=new Uint8Array(e.width*e.height*4);await h.write({type:"result-credit",requestId:t,offset:0},r);let n=0;for(;n<
a.length;){const i=await h.rpc.read({signal:r});if(!i.byteLength||i.byteLength>y.imageChunkBytes||i.byteLength>a.length-
n)throw new Error("Invalid generated image transfer frame");if(a.set(i.subarray(),n),n+=i.byteLength,n===a.length&&K(a)!==
e.sha256)throw new Error("Generated image digest mismatch");await h.write({type:"result-credit",requestId:t,offset:n},r)}
return{...e,data:a}}const c=(h,s="ERR_PEER_INFERENCE")=>Object.assign(new Error(h),{code:s}),F=h=>h instanceof Error?h:c(
String(h??"Peer inference failed")),v=h=>h.reason instanceof Error?h.reason:new DOMException("Inference cancelled","Abor\
tError");function C(h,s){const t=new AbortController,r=h.filter(Boolean).map(a=>{const n=()=>t.abort(v(a));return a.addEventListener(
"abort",n,{once:!0}),a.aborted&&n(),()=>a.removeEventListener("abort",n)}),e=setTimeout(()=>t.abort(c("Peer inference de\
adline exceeded","ERR_INFERENCE_DEADLINE")),s);return e.unref?.(),{controller:t,signal:t.signal,dispose(){clearTimeout(e),
r.forEach(a=>a())}}}function _(h,s){if(s.aborted)throw Promise.resolve(h).catch(()=>{}),v(s);return new Promise((t,r)=>{
const e=()=>r(v(s));s.addEventListener("abort",e,{once:!0}),Promise.resolve(h).then(t,r).finally(()=>s.removeEventListener(
"abort",e))})}class re{constructor(s,{owner:t=Symbol("peer-inference-owner"),getLocalState:r,generate:e,queryTimeoutMs:a=y.
queryTimeoutMs,requestTimeoutMs:n=y.requestTimeoutMs,maximumPeers:i=y.maximumPeers}={}){if(typeof r!="function"||typeof e!=
"function")throw new Error("Peer inference callbacks are required");this.manager=s,this.owner=t,this.getLocalState=r,this.
generateLocal=e,this.queryTimeoutMs=S(a,15e3,100),this.requestTimeoutMs=S(n,3e5,100),this.maximumPeers=S(i,y.maximumPeers,
1),this.controller=new AbortController,this.records=new Map,this.inbound=new Map,this.outbound=new Map,this.operations=new Set,
this.hostingEnabled=!0,this.closed=!1,this.refreshing=null,this.models=[],this.hosts=[],this.lastErrors=[],this.disconnectListener=
l=>{const d=l.detail.toString();this.records.delete(d),this._group();for(const f of[...this.inbound.values(),...this.outbound.
values()])f.peerId===d&&f.controller.abort(c("Inference peer disconnected","ERR_INFERENCE_DISCONNECTED"))}}get peerId(){
return this.manager.libp2p.peerId.toString()}get scope(){const{gameId:s,roomId:t,topologyId:r}=this.manager.config;return{
gameId:s,roomId:t,topologyId:r}}async start(){return await this.manager.libp2p.handle(x,(s,t)=>{if(this.closed||this.operations.
size>=40||!A(t)){s.abort(c("Encrypted peer inference connection required"));return}const r=this._handle(s,t);this.operations.
add(r),r.catch(()=>{}).finally(()=>this.operations.delete(r))},{maxInboundStreams:4,maxOutboundStreams:4,runOnLimitedConnection:!0}),
this.manager.libp2p.addEventListener("peer:disconnect",this.disconnectListener),this}_envelope(s,t,r={}){return{type:s,scope:this.
scope,sender:this.peerId,recipient:t,...r}}_checkEnvelope(s,t){if(!s||s.sender!==t||s.recipient!==this.peerId||["gameId",
"roomId","topologyId"].some(r=>s.scope?.[r]!==this.scope[r]))throw c("Peer inference identity or scope mismatch")}async _state(s,t=0){
const r=B(await _(this.getLocalState(),s),this.hostingEnabled,{defaultMaxNewTokens:L.maxNewTokens});return this.inbound.
size>t&&(r.busy=!0,r.idleForMs=0),r}setHostingEnabled(s){if(this.hostingEnabled=!!s,!this.hostingEnabled)for(const t of this.
inbound.values())t.controller.abort(c("Peer inference hosting disabled","ERR_INFERENCE_HOST_DISABLED"));this.records.delete(
this.peerId),this._group()}_remember(s,t){this.records.set(s,{state:t,receivedAt:Date.now()})}_group(){const s=new Map,t=new Map,
r=Date.now();for(const[e,a]of this.records){if(r-a.receivedAt>y.recordTtlMs){this.records.delete(e);continue}const{state:n}=a,
i=e===this.peerId;for(const l of n.sharedModels)s.has(l.manifestCid)||s.set(l.manifestCid,{...l,providers:[]}),s.get(l.manifestCid).
providers.push({peerId:e,local:i});if(n.hostedModel){const{maxNewTokens:l,...d}=n.hostedModel;t.has(d.manifestCid)||t.set(
d.manifestCid,{...d,hosts:[]}),t.get(d.manifestCid).hosts.push({peerId:e,local:i,busy:n.busy,idleForMs:n.busy?0:n.idleForMs,
queuedRequests:n.queuedRequests,maxNewTokens:l})}}this.models=[...s.values()],this.hosts=[...t.values()]}listModels(){return this.
_group(),structuredClone(this.models)}listHosts(){return this._group(),structuredClone(this.hosts)}_connections(s){return this.
manager.libp2p.getConnections().filter(t=>t.remotePeer.toString()===s&&A(t)).sort((t,r)=>{const e=a=>a.encryption==="nat\
ive"?3:a.remoteAddr?.getComponents?.().some(({name:n})=>n==="p2p-circuit")?1:2;return e(r)-e(t)})}async _connection(s,t){
t.throwIfAborted();const r=()=>this._connections(s)[0];let e=r();if(!e&&this.manager.peers?.has(s)&&(await _(this.manager.
_maybeDialPeer(s,"peer-inference"),t),e=r()),!e)throw c("No authenticated encrypted connection to inference peer","ERR_I\
NFERENCE_UNREACHABLE");return e}async _openStream(s,t){const r=await this._connection(s,t),e=[...new Set([r,...this._connections(
s)])].slice(0,4),a=[];for(const n of e){if(t.throwIfAborted(),!A(n))continue;const i=C([this.controller.signal,t],Math.min(
2e3,this.queryTimeoutMs/2));let l;try{l=Promise.resolve(n.newStream(x,{signal:i.signal,runOnLimitedConnection:!0}));const d=await _(
l,i.signal);return i.signal.throwIfAborted(),{connection:n,stream:d}}catch(d){const f=F(d);l?.then(o=>o.abort(f),()=>{}).
catch(()=>{}),t.throwIfAborted(),this.controller.signal.throwIfAborted(),a.push(f)}finally{i.dispose()}}throw Object.assign(
new AggregateError(a,`Unable to open an encrypted inference stream: ${String(a.at(-1)?.message??"connections closed").slice(
0,160)}`,{cause:a.at(-1)}),{code:"ERR_INFERENCE_STREAM_UNAVAILABLE",peerId:s})}async _query(s,t){const r=C([this.controller.
signal,t],this.queryTimeoutMs);let e;const a=()=>e?.abort(v(r.signal));r.signal.addEventListener("abort",a,{once:!0});try{
({stream:e}=await this._openStream(s,r.signal));const n=O(e);await n.write(this._envelope("query",s),r.signal);const i=await n.
read(r.signal);if(i?.type==="error")throw["sender","recipient","scope"].some(l=>Object.hasOwn(i,l))&&this._checkEnvelope(
i,s),typeof i.message!="string"||i.code!==void 0&&typeof i.code!="string"?c("Invalid inference directory error response",
"ERR_INFERENCE_DIRECTORY_INVALID"):c(i.message.slice(0,256)||"Peer inference directory unavailable",i.code?.slice(0,80)||
"ERR_PEER_INFERENCE");if(this._checkEnvelope(i,s),i.type!=="directory")throw c("Invalid inference directory response");this.
_remember(s,B(i.state)),await e.close({signal:r.signal})}catch(n){throw this.records.delete(s),e?.abort(n),n}finally{r.signal.
removeEventListener("abort",a),r.dispose()}}async refresh({signal:s}={}){if(this.closed)throw c("Peer inference service \
is stopped");if(this.refreshing)return _(this.refreshing,s??this.controller.signal);const t=async()=>{const r=C([this.controller.
signal,s],this.queryTimeoutMs*2+100);try{this._remember(this.peerId,await this._state(r.signal));const e=[...new Set([...this.
manager.libp2p.getConnections().map(n=>n.remotePeer.toString()),...this.manager.peers?.keys()??[]])].filter(n=>n!==this.
peerId&&!this.manager.bootstrapPeerIds?.has(n)).slice(0,this.maximumPeers),a=await Promise.allSettled(e.map(n=>this._query(
n,r.signal)));return r.signal.throwIfAborted(),this.lastErrors=a.flatMap((n,i)=>n.status==="rejected"?[{peerId:e[i],code:String(
n.reason?.code??"ERR_PEER_INFERENCE").slice(0,80),message:String(n.reason?.message??"Directory unavailable").slice(0,256)}]:
[]),{models:this.listModels(),hosts:this.listHosts(),errors:structuredClone(this.lastErrors)}}finally{r.dispose()}};this.
refreshing=t(),this.operations.add(this.refreshing);try{return await this.refreshing}finally{this.operations.delete(this.
refreshing),this.refreshing=null}}async _handle(s,t){const r=t.remotePeer.toString(),e=C([this.controller.signal],this.requestTimeoutMs),
a=()=>s.abort(v(e.signal));e.signal.addEventListener("abort",a,{once:!0});const n=O(s);let i,l,d;try{const f=C([e.signal],
this.queryTimeoutMs);try{d=await n.read(f.signal)}finally{f.dispose()}if(this._checkEnvelope(d,r),d.type==="query"){await n.
write(this._envelope("directory",r,{state:await this._state(e.signal)}),e.signal),await s.close({signal:e.signal});return}
if(d.type!=="generate")throw c("Unknown inference request");const o=P(d);if(i=`${r}:${o.requestId}`,this.inbound.has(i)||
this.inbound.size>=y.maximumInbound||[...this.inbound.values()].filter(g=>g.peerId===r).length>=y.maximumPerPeer)throw i=
null,c("Peer inference queue is full","ERR_INFERENCE_BUSY");this.inbound.set(i,{peerId:r,controller:e.controller});const m=await this.
_state(e.signal,1);if(!m.hostedModel||m.hostedModel.manifestCid!==o.manifestCid)throw c("Requested model is not hosted",
"ERR_INFERENCE_NOT_HOSTED");if(o.maxNewTokens>m.hostedModel.maxNewTokens)throw c("Requested token limit exceeds hosted c\
apacity","ERR_INFERENCE_TOKEN_LIMIT");if(o.task!==void 0&&o.task!==m.hostedModel.task)throw c("Requested task does not m\
atch hosted model");if(o.task=m.hostedModel.task,P(o),o.image&&!m.hostedModel.modalities.includes("image"))throw c("Host\
ed model does not accept images");if(await n.write({type:"upload",requestId:o.requestId},e.signal),o.image){o.image.data=
new Uint8Array(o.image.width*o.image.height*4);let g=0;for(;g<o.image.data.length;){const b=await n.rpc.read({signal:e.signal});
if(!b.byteLength||b.byteLength>y.imageChunkBytes||b.byteLength>o.image.data.length-g)throw c("Invalid image transfer fra\
me");o.image.data.set(b.subarray(),g),g+=b.byteLength,await n.write({type:"image-credit",offset:g},e.signal)}}const E=await this.
_state(e.signal,1);if(!E.hostedModel||E.hostedModel.manifestCid!==o.manifestCid)throw c("Inference host changed during u\
pload");if(o.maxNewTokens>E.hostedModel.maxNewTokens)throw c("Requested token limit exceeds hosted capacity","ERR_INFERE\
NCE_TOKEN_LIMIT");await n.write({type:"accepted",requestId:o.requestId,queued:E.busy},e.signal);const k=await n.read(e.signal);
if(k.type!=="start"||k.requestId!==o.requestId)throw c("Missing inference start acknowledgement");const q=W(n,o.requestId,
e.controller);l=q.task;let p=Promise.resolve(),M=0,u=0,w=0;const I=g=>{if(e.signal.throwIfAborted(),typeof g!="string")throw c(
"Invalid host token");if(!g.length)return;if(M+=T(g),w+=T(g)+128,M>L.maxOutputBytes||w>L.maxOutputBytes+8192||u>=4096){const N=c(
"Inference token consumer exceeded its bounded output queue");throw e.controller.abort(N),N}const b={type:"token",requestId:o.
requestId,sequence:u++,text:g};p=p.then(()=>n.write(b,e.signal)).then(()=>{w-=T(g)+128}),p.catch(N=>e.controller.abort(N))};
let Y=0;const $=g=>{if(g?.type!=="diffusion-progress")return;if(e.signal.throwIfAborted(),o.task!=="text-to-image"||++Y>
32)throw c("Invalid image generation progress");const b=U(g);p=p.then(()=>n.write({type:"progress",requestId:o.requestId,
progress:b},e.signal)),p.catch(N=>e.controller.abort(N))},R=await _(this.generateLocal({...o,requestId:`remote-${crypto.
randomUUID()}`,signal:e.signal,onToken:I,onProgress:$}),e.signal);if(await p,e.signal.throwIfAborted(),!!R?.image!=(o.task===
"text-to-image"))throw c("Inference output does not match hosted task");const D=H({...R,...R.image?{image:X(R.image)}:{}});
R.image&&await Z(n,{image:R.image,metadata:D.image,requestId:o.requestId,controls:q,signal:e.signal}),await n.write({type:"\
done",requestId:o.requestId,result:D},e.signal),await s.close({signal:e.signal})}catch(f){const o=F(f);if(e.signal.aborted)
s.abort(o);else{const m={code:String(o.code??"ERR_PEER_INFERENCE").slice(0,80),message:String(o.message??"Peer inference\
 failed").slice(0,256)};try{await n.write(d?.type==="query"?this._envelope("error",r,m):{type:"error",...m},e.signal),await s.
close({signal:e.signal})}catch{s.abort(o)}}}finally{i&&this.inbound.delete(i),e.signal.removeEventListener("abort",a),e.
controller.abort(new Error("Inference stream finished")),e.dispose(),await l?.catch(()=>{})}}async generate(s,t={}){if(this.
closed)throw c("Peer inference service is stopped");const r=P({...t,requestId:t.requestId??crypto.randomUUID(),manifestCid:s},
{imageBytes:!0});if(this.outbound.has(r.requestId)||this.outbound.size>=y.maximumOutbound)throw c("Outgoing inference qu\
eue is full");const e=C([this.controller.signal,t.signal],this.requestTimeoutMs),a={controller:e.controller,peerId:null};
this.outbound.set(r.requestId,a);const i=(async()=>{let l=this.listHosts().find(o=>o.manifestCid===r.manifestCid)?.hosts.
filter(o=>!o.local)??[];l.length||(await this.refresh({signal:e.signal}),l=this.listHosts().find(o=>o.manifestCid===r.manifestCid)?.
hosts.filter(o=>!o.local)??[]);const d=this.listHosts().find(o=>o.manifestCid===r.manifestCid);if(d){if(r.task!==void 0&&
r.task!==d.task)throw c("Requested task does not match discovered model");r.task=d.task,P(r)}l.sort((o,m)=>Number(o.busy)-
Number(m.busy)||(o.busy?0:m.idleForMs-o.idleForMs));let f=c("No remote peer hosts the requested model","ERR_INFERENCE_NO\
T_HOSTED");for(const o of l){e.signal.throwIfAborted(),a.peerId=o.peerId,t.onProgress?.({type:"routing",requestId:r.requestId,
peerId:o.peerId,busy:o.busy});const m={...r,maxNewTokens:Math.min(r.maxNewTokens,o.maxNewTokens??Q)};try{return await this.
_generateAt(o.peerId,m,t,e.signal)}catch(E){if(f=E,E.committed||e.signal.aborted)throw E}}throw f})();this.operations.add(
i);try{return await i}finally{this.operations.delete(i),this.outbound.delete(r.requestId),e.dispose()}}async _generateAt(s,t,r,e){
let a,n=!1;const i=()=>a?.abort(v(e));e.addEventListener("abort",i,{once:!0});try{const l=await this._openStream(s,e),{connection:d}=l;
a=l.stream;const f=O(a),o={...t,image:t.image?{width:t.image.width,height:t.image.height,channels:4}:void 0};await f.write(
this._envelope("generate",s,o),e);const m=await f.read(e);if(m.type==="error")throw c(String(m.message).slice(0,256),m.code);
if(m.type!=="upload"||m.requestId!==t.requestId)throw c("Invalid inference upload acknowledgement");if(t.image)for(let u=0;u<
t.image.data.length;){const w=Math.min(u+y.imageChunkBytes,t.image.data.length);await f.rpc.write(t.image.data.subarray(
u,w),{signal:e});const I=await f.read(e);if(I.type!=="image-credit"||I.offset!==w)throw c("Invalid image transfer credit");
u=w}let E=0,k=0,q=!1,p,M=0;for(;;){const u=await f.read(e);if(u.type==="error")throw c(String(u.message).slice(0,256),u.
code);if(u.requestId!==t.requestId)throw c("Inference response ID mismatch");if(u.type==="accepted"&&!q){n=!0,await f.write(
{type:"start",requestId:t.requestId},e),q=!0,r.onProgress?.({type:"accepted",requestId:t.requestId,peerId:s,queued:!!u.queued});
continue}if(!q)throw c("Inference output preceded admission");if(u.type==="token"){if(u.sequence!==E++||E>4096||typeof u.
text!="string")throw c("Invalid token sequence");if(k+=T(u.text),k>L.maxOutputBytes)throw c("Inference output exceeds it\
s byte budget");await _(r.onToken?.(u.text,{...u,peerId:s}),e)}else if(u.type==="progress"){if(t.task!=="text-to-image"||
++M>32)throw c("Invalid image generation progress");await _(r.onProgress?.({...U(u.progress),requestId:t.requestId,peerId:s}),
e)}else if(u.type==="result-image"){if(t.task!=="text-to-image"||p)throw c("Unexpected generated image");p=await ee(f,{image:u.
image,requestId:t.requestId,signal:e})}else if(u.type==="done"){const w=H(u.result);if(!!w.image!=(t.task==="text-to-ima\
ge")||!!w.image!=!!p)throw c("Inference output does not match requested task");if(p){if(["width","height","channels","sh\
a256"].some(I=>p[I]!==w.image[I]))throw c("Generated image metadata changed during transfer");w.image=p}return await a.close(
{signal:e}),{...w,requestId:t.requestId,peerId:s,manifestCid:t.manifestCid,connectionEncryption:d.encryption,connectionAddress:d.
remoteAddr?.toString()}}else throw c("Unknown inference output frame")}}catch(l){const d=F(l);throw a?.abort(d),d.committed=
n,d}finally{e.removeEventListener("abort",i)}}cancel(s){const t=this.outbound.get(s);return t?(t.controller.abort(c("Cal\
ler cancelled peer inference","ERR_INFERENCE_CANCELLED")),!0):!1}async stop(){return this.stopping?this.stopping:(this.closed=
!0,this.controller.abort(c("Peer inference service stopped","ERR_INFERENCE_STOPPED")),this.stopping=(async()=>{try{await this.
manager.libp2p.unhandle(x)}finally{this.manager.libp2p.removeEventListener("peer:disconnect",this.disconnectListener),await Promise.
allSettled([...this.operations]),this.records.clear(),this.models=[],this.hosts=[],this.getLocalState=null,this.generateLocal=
null}this.requiresCleanup=!1})().catch(s=>{throw this.stopping=null,this.requiresCleanup=!0,s}),this.stopping)}}export{re as PeerInferenceService};
