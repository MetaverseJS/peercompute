import{bh as Y,bi as v,bj as ie,bk as V,bl as K,bm as J,bn as H,M as j,bo as he,bp as k,bq as A,br as W,bs as G,bt as Q,
bu as X,bv as Z,bw as z,bx as ue,by as me,bz as O,bA as ee,bB as te,bC as se,bD as fe,bE as ge,bF as pe,bG as we,bH as Ee,
bI as be,bJ as ye,bK as re,bL as Ie,bM as qe}from"./main-BVBDmgKD.js";import"./index-L3PMMKML.js";async function Ce(g,{mesh:t,
requestId:e,controls:s,signal:o}){const r=Y(t),n=s.expect(0);await g.write({type:"result-mesh",requestId:e,mesh:r},o),await n;
for(let c=0;c<t.data.byteLength;){const l=Math.min(c+v.imageChunkBytes,t.data.byteLength),h=s.expect(l);await g.rpc.write(
t.data.subarray(c,l),{signal:o}),await h,c=l}}async function _e(g,{mesh:t,requestId:e,signal:s}){const o=Y(t),r=new Uint8Array(
o.byteLength);await g.write({type:"result-credit",requestId:e,offset:0},s);let n=0,c;for(;n<r.byteLength;){const l=await g.
rpc.read({signal:s});if(!l.byteLength||l.byteLength>v.imageChunkBytes||l.byteLength>r.byteLength-n)throw new Error("Inva\
lid generated mesh transfer frame");r.set(l.subarray(),n),n+=l.byteLength,n===r.byteLength&&(c=ie({...o,data:r})),await g.
write({type:"result-credit",requestId:e,offset:n},s)}return c}const a=(g,t="ERR_PEER_INFERENCE")=>Object.assign(new Error(
g),{code:t}),B=g=>g instanceof Error?g:a(String(g??"Peer inference failed")),F=g=>g.reason instanceof Error?g.reason:new DOMException(
"Inference cancelled","AbortError"),ae=g=>g?.code==="ERR_INFERENCE_DEADLINE"||["TimeoutError","ConnectionClosedError","S\
treamResetError","StreamStateError"].includes(g?.name),oe=g=>g.some(ae)&&!g.some(t=>["UnsupportedProtocolError","TooMany\
OutboundProtocolStreamsError","TooManyInboundProtocolStreamsError","LimitedConnectionError","InvalidParametersError"].includes(
t?.name));function T(g,t){const e=new AbortController,s=g.filter(Boolean).map(r=>{const n=()=>e.abort(F(r));return r.addEventListener(
"abort",n,{once:!0}),r.aborted&&n(),()=>r.removeEventListener("abort",n)}),o=setTimeout(()=>e.abort(a("Peer inference de\
adline exceeded","ERR_INFERENCE_DEADLINE")),t);return o.unref?.(),{controller:e,signal:e.signal,dispose(){clearTimeout(o),
s.forEach(r=>r())}}}function M(g,t){if(t.aborted)throw Promise.resolve(g).catch(()=>{}),F(t);return new Promise((e,s)=>{
const o=()=>s(F(t));t.addEventListener("abort",o,{once:!0}),Promise.resolve(g).then(e,s).finally(()=>t.removeEventListener(
"abort",o))})}class ve{constructor(t,{owner:e=Symbol("peer-inference-owner"),getLocalState:s,generate:o,queryTimeoutMs:r=v.
queryTimeoutMs,requestTimeoutMs:n=v.requestTimeoutMs,maximumPeers:c=v.maximumPeers}={}){if(typeof s!="function"||typeof o!=
"function")throw new Error("Peer inference callbacks are required");this.manager=t,this.owner=e,this.getLocalState=s,this.
generateLocal=o,this.queryTimeoutMs=V(r,15e3,100),this.requestTimeoutMs=V(n,3e5,100),this.maximumPeers=V(c,v.maximumPeers,
1),this.controller=new AbortController,this.records=new Map,this.inbound=new Map,this.outbound=new Map,this.operations=new Set,
this.hostingEnabled=!0,this.closed=!1,this.refreshing=null,this.models=[],this.hosts=[],this.lastErrors=[],this.failedConnections=
new WeakMap,this.recoveries=new Map,this.disconnectListener=l=>{const h=l.detail.toString();this.records.delete(h),this.
_group();for(const p of[...this.inbound.values(),...this.outbound.values()])p.peerId===h&&p.controller.abort(a("Inferenc\
e peer disconnected","ERR_INFERENCE_DISCONNECTED"))}}get peerId(){return this.manager.libp2p.peerId.toString()}get scope(){
const{gameId:t,roomId:e,topologyId:s}=this.manager.config;return{gameId:t,roomId:e,topologyId:s}}async start(){for(const t of K)
await this.manager.libp2p.handle(t,(e,s)=>{if(this.closed||this.operations.size>=40||!J(s)){e.abort(a("Encrypted peer in\
ference connection required"));return}const o=this._handle(e,s,t);this.operations.add(o),o.catch(()=>{}).finally(()=>this.
operations.delete(o))},{maxInboundStreams:4,maxOutboundStreams:4,runOnLimitedConnection:!0});return this.manager.libp2p.
addEventListener("peer:disconnect",this.disconnectListener),this}_envelope(t,e,s={}){return{type:t,scope:this.scope,sender:this.
peerId,recipient:e,...s}}_checkEnvelope(t,e){if(!t||t.sender!==e||t.recipient!==this.peerId||["gameId","roomId","topolog\
yId"].some(s=>t.scope?.[s]!==this.scope[s]))throw a("Peer inference identity or scope mismatch")}async _state(t,e=0,s,o){
const r=H(await M(o??this.getLocalState({signal:t}),t),this.hostingEnabled,{defaultMaxNewTokens:j.maxNewTokens});for(const n of r.
hostedModels)[...this.inbound.values()].filter(l=>l.manifestCid===n.manifestCid).length>(n.manifestCid===s?e:0)&&(n.busy=
!0,n.idleForMs=0);return this.inbound.size>e&&(r.busy=!0,r.idleForMs=0),r}async getTelemetrySummary({signal:t=this.controller.
signal}={}){if(this.closed||!this.hostingEnabled)return[];if(this.telemetryStatePending)throw new Error("Local hosted-mo\
del telemetry read is still pending");const e=Promise.resolve().then(()=>this.getLocalState({signal:t}));this.telemetryStatePending=
e;const s=()=>{this.telemetryStatePending===e&&(this.telemetryStatePending=null)};e.then(s,s);const o=await this._state(
t,0,void 0,this.telemetryStatePending);return this.closed||!this.hostingEnabled||t.aborted?[]:o.hostedModels.map(({manifestCid:r,
name:n,task:c,runtime:l,modalities:h,busy:p})=>({manifestCid:r,name:n,task:c,runtime:l,modalities:h,busy:p}))}setHostingEnabled(t){
if(this.hostingEnabled=!!t,!this.hostingEnabled)for(const e of this.inbound.values())e.controller.abort(a("Peer inferenc\
e hosting disabled","ERR_INFERENCE_HOST_DISABLED"));this.records.delete(this.peerId),this._group()}async cancelHostedModel(t){
t=he(t);const e=[...this.inbound.values()].filter(s=>s.manifestCid===t);for(const s of e)s.controller.abort(a("Hosted mo\
del is unloading","ERR_INFERENCE_HOST_DISABLED"));return await Promise.allSettled(e.map(s=>s.finished)),this.records.delete(
this.peerId),this._group(),e.length}_remember(t,e,s=k){this.records.set(t,{state:e,protocol:s,receivedAt:Date.now()})}_group(){
const t=new Map,e=new Map,s=Date.now();for(const[o,r]of this.records){if(s-r.receivedAt>v.recordTtlMs){this.records.delete(
o);continue}const{state:n}=r,c=o===this.peerId;for(const l of n.sharedModels)t.has(l.manifestCid)?A(r.protocol)&&Object.
assign(t.get(l.manifestCid),l):t.set(l.manifestCid,{...l,providers:[]}),t.get(l.manifestCid).providers.push({peerId:o,local:c});
for(const l of n.hostedModels??(n.hostedModel?[{...n.hostedModel,busy:n.busy,idleForMs:n.idleForMs,queuedRequests:n.queuedRequests}]:
[])){const{maxNewTokens:h,busy:p,idleForMs:d,queuedRequests:m,queueCapacity:E,queueAvailable:b,...i}=l;e.has(i.manifestCid)?
A(r.protocol)&&Object.assign(e.get(i.manifestCid),i):e.set(i.manifestCid,{...i,hosts:[]}),e.get(i.manifestCid).hosts.push(
{peerId:o,local:c,busy:p,task:i.task,modalities:[...i.modalities],outputModalities:[...i.outputModalities],idleForMs:p?0:
d,queuedRequests:m,queueCapacity:E,queueAvailable:b,maxNewTokens:h,protocol:r.protocol})}}this.models=[...t.values()],this.
hosts=[...e.values()]}listModels(){return this._group(),structuredClone(this.models)}listHosts(){return this._group(),structuredClone(
this.hosts)}_connections(t){return this.manager.libp2p.getConnections().filter(e=>e.remotePeer.toString()===t&&J(e)).sort(
(e,s)=>{const o=r=>(r.encryption==="native"?3:r.remoteAddr?.getComponents?.().some(({name:n})=>n==="p2p-circuit")?1:2)-((this.
failedConnections.get(r)??0)>Date.now()?10:0);return o(s)-o(e)})}async _connection(t,e){e.throwIfAborted();const s=()=>this.
_connections(t)[0];let o=s();if(!o&&this.manager.peers?.has(t)){if(this.manager.recoverPeerInferenceConnection){try{await M(
this._recoverConnection(t),e)}catch{e.throwIfAborted(),this.controller.signal.throwIfAborted()}o=s()}o||(await M(this.manager.
_maybeDialPeer(t,"peer-inference"),e),o=s())}if(!o)throw a("No authenticated encrypted connection to inference peer","ER\
R_INFERENCE_UNREACHABLE");return o}_recoverConnection(t){if(this.recoveries.has(t))return this.recoveries.get(t);const e=this.
manager.recoverPeerInferenceConnection(t,{signal:this.controller.signal});this.recoveries.set(t,e),this.operations.add(e);
const s=()=>{this.operations.delete(e),this.recoveries.get(t)===e&&this.recoveries.delete(t)};return e.then(s,s),e}async _openStream(t,e,{
audio:s=!1,nativeMedia:o=!1,mesh:r=!1,backgroundRecovery:n=!1}={}){const c=await this._connection(t,e),l=[...new Set([c,
...this._connections(t)])].slice(0,4),h=[];let p;const d=async m=>{if(e.throwIfAborted(),m.remotePeer.toString()!==t||!J(
m))throw a("Invalid recovered inference connection");const E=T([this.controller.signal,e],Math.min(2e3,this.queryTimeoutMs/
2));let b;try{const i=r?k:o?[k,re]:s?[k,re,Ie]:K;b=Promise.resolve(m.newStream(i,{signal:E.signal,runOnLimitedConnection:!0}));
const y=await M(b,E.signal);E.signal.throwIfAborted();const L=this.manager.retainPeerInferenceConnection?.(m,{timeoutMs:this.
requestTimeoutMs+1e3});return this.failedConnections.delete(m),{connection:m,stream:y,release:L,protocol:y.protocol??k}}catch(i){
const y=B(i);throw b?.then(L=>L.abort(y),()=>{}).catch(()=>{}),ae(y)&&this.failedConnections.set(m,Date.now()+15e3),h.push(
y),y}finally{E.dispose()}};try{for(const m of l)try{return await d(m)}catch{e.throwIfAborted(),this.controller.signal.throwIfAborted()}}catch(m){
throw n&&e.reason?.code==="ERR_INFERENCE_DEADLINE"&&oe(h)&&!this.controller.signal.aborted&&this.manager.recoverPeerInferenceConnection&&
this._recoverConnection(t).catch(()=>{}),m}if(oe(h)&&this.manager.recoverPeerInferenceConnection)try{const m=await M(this.
_recoverConnection(t),e);return e.throwIfAborted(),await d(m)}catch(m){e.throwIfAborted(),this.controller.signal.throwIfAborted(),
p=B(m)}throw Object.assign(new AggregateError(h,`Unable to open an encrypted inference stream: ${String(h.at(-1)?.message??
"connections closed").slice(0,160)}`,{cause:h.at(-1)}),{code:"ERR_INFERENCE_STREAM_UNAVAILABLE",peerId:t,recoveryError:p})}async _closeCompletedStream(t,e){
const s=T([this.controller.signal,e],Math.min(1e3,this.queryTimeoutMs/2));try{await M(Promise.resolve().then(()=>t.close(
{signal:s.signal})),s.signal)}catch(o){try{Promise.resolve(t.abort(B(o))).catch(()=>{})}catch{}this.controller.signal.throwIfAborted(),
e.throwIfAborted()}finally{s.dispose()}this.controller.signal.throwIfAborted(),e.throwIfAborted()}async _query(t,e){const s=T(
[this.controller.signal,e],this.queryTimeoutMs);let o,r;const n=()=>o?.abort(F(s.signal));s.signal.addEventListener("abo\
rt",n,{once:!0});try{let c;({stream:o,protocol:c,release:r}=await this._openStream(t,s.signal,{backgroundRecovery:!0}));
const l=W(o);await l.write(this._envelope("query",t),s.signal);const h=await l.read(s.signal);if(h?.type==="error")throw[
"sender","recipient","scope"].some(p=>Object.hasOwn(h,p))&&this._checkEnvelope(h,t),typeof h.message!="string"||h.code!==
void 0&&typeof h.code!="string"?a("Invalid inference directory error response","ERR_INFERENCE_DIRECTORY_INVALID"):a(h.message.
slice(0,256)||"Peer inference directory unavailable",h.code?.slice(0,80)||"ERR_PEER_INFERENCE");if(this._checkEnvelope(h,
t),h.type!=="directory")throw a("Invalid inference directory response");this._remember(t,H(h.state,!0,{protocol:c}),c),await this.
_closeCompletedStream(o,s.signal)}catch(c){throw this.records.delete(t),o?.abort(c),c}finally{r?.(),s.signal.removeEventListener(
"abort",n),s.dispose()}}async refresh({signal:t}={}){if(this.closed)throw a("Peer inference service is stopped");if(this.
refreshing)return M(this.refreshing,t??this.controller.signal);const e=async()=>{const s=T([this.controller.signal,t],this.
queryTimeoutMs*2+100);try{this._remember(this.peerId,await this._state(s.signal));const o=[...new Set([...this.manager.libp2p.
getConnections().map(n=>n.remotePeer.toString()),...this.manager.peers?.keys()??[]])].filter(n=>n!==this.peerId&&!this.manager.
bootstrapPeerIds?.has(n)).slice(0,this.maximumPeers),r=await Promise.allSettled(o.map(n=>this._query(n,s.signal)));return s.
signal.throwIfAborted(),this.lastErrors=r.flatMap((n,c)=>n.status==="rejected"?[{peerId:o[c],code:String(n.reason?.code??
"ERR_PEER_INFERENCE").slice(0,80),message:String(n.reason?.message??"Directory unavailable").slice(0,256)}]:[]),{models:this.
listModels(),hosts:this.listHosts(),errors:structuredClone(this.lastErrors)}}finally{s.dispose()}};this.refreshing=e(),this.
operations.add(this.refreshing);try{return await this.refreshing}finally{this.operations.delete(this.refreshing),this.refreshing=
null}}async _handle(t,e,s=k){const o=e.remotePeer.toString(),r=T([this.controller.signal],this.requestTimeoutMs),n=()=>t.
abort(F(r.signal));r.signal.addEventListener("abort",n,{once:!0});const c=W(t);let l,h,p,d;const m=new Promise(b=>{d=b});
let E;try{E=this.manager.retainPeerInferenceConnection?.(e,{timeoutMs:this.requestTimeoutMs+1e3});const b=T([r.signal],this.
queryTimeoutMs);try{p=await c.read(b.signal)}finally{b.dispose()}if(this._checkEnvelope(p,o),p.type==="query"){const w=await this.
_state(r.signal);await c.write(this._envelope("directory",o,{state:s!==k?H(w,this.hostingEnabled,{protocol:s}):w}),r.signal),
await this._closeCompletedStream(t,r.signal);return}if(p.type!=="generate")throw a("Unknown inference request");const i=G(
p);if(s===Q&&X(i.task))throw a("Speech requires inference protocol v3");if(!A(s)&&i.task==="audio-text-to-text")throw a(
"Native audio conversation requires inference protocol v4");if(s!==k&&i.task==="image-to-3d")throw a("Mesh generation re\
quires inference protocol v5");if(l=`${o}:${i.requestId}`,this.inbound.has(l)||this.inbound.size>=v.maximumInbound||[...this.
inbound.values()].filter(w=>w.peerId===o).length>=v.maximumPerPeer)throw l=null,a("Peer inference queue is full","ERR_IN\
FERENCE_BUSY");this.inbound.set(l,{peerId:o,manifestCid:i.manifestCid,controller:r.controller,finished:m});const y=w=>{const C=s===
k?w:H(w,this.hostingEnabled,{protocol:s});return s===Q?C.hostedModel?.manifestCid===i.manifestCid?C.hostedModel:null:C.hostedModels.
find(x=>x.manifestCid===i.manifestCid)},L=await this._state(r.signal,1,i.manifestCid),_=y(L);if(!_)throw a("Requested mo\
del is not hosted","ERR_INFERENCE_NOT_HOSTED");if(i.maxNewTokens>_.maxNewTokens)throw a("Requested token limit exceeds h\
osted capacity","ERR_INFERENCE_TOKEN_LIMIT");if(!A(s)&&i.task!==void 0&&i.task!==_.task)throw a("Requested task does not\
 match hosted model");if(i.task=Z(i,_.task),!z(_,i))throw a("Requested task or media does not match hosted model");if(_.
queueAvailable===!1||_.busy&&_.queuedRequests>=_.queueCapacity)throw a("Hosted model queue is full","ERR_INFERENCE_BUSY");
if(G(i),await c.write({type:"upload",requestId:i.requestId},r.signal),i.image){i.image.data=new Uint8Array(i.image.width*
i.image.height*4);let w=0;for(;w<i.image.data.length;){const C=await c.rpc.read({signal:r.signal});if(!C.byteLength||C.byteLength>
v.imageChunkBytes||C.byteLength>i.image.data.length-w)throw a("Invalid image transfer frame");i.image.data.set(C.subarray(),
w),w+=C.byteLength,await c.write({type:"image-credit",offset:w},r.signal)}}i.audio&&(i.audio=await ue(c,{audio:i.audio,requestId:i.
requestId,signal:r.signal}));const I=y(await this._state(r.signal,1,i.manifestCid));if(!I||I.task!==_.task)throw a("Infe\
rence host changed during upload");if(!z(I,i))throw a("Inference host media capabilities changed during upload");if(i.maxNewTokens>
I.maxNewTokens)throw a("Requested token limit exceeds hosted capacity","ERR_INFERENCE_TOKEN_LIMIT");if(I.queueAvailable===
!1||I.busy&&I.queuedRequests>=I.queueCapacity)throw a("Hosted model queue is full","ERR_INFERENCE_BUSY");await c.write({
type:"accepted",requestId:i.requestId,queued:I.busy},r.signal);const N=await c.read(r.signal);if(N.type!=="start"||N.requestId!==
i.requestId)throw a("Missing inference start acknowledgement");const P=me(c,i.requestId,r.controller);h=P.task;let S=Promise.
resolve(),u=0,f=0,R=0;const $=i.task==="automatic-speech-recognition"?8192:j.maxOutputBytes,ne=w=>{if(r.signal.throwIfAborted(),
typeof w!="string")throw a("Invalid host token");if(!w.length)return;if(u+=O(w),R+=O(w)+128,u>$||R>$+8192||f>=4096){const x=a(
"Inference token consumer exceeded its bounded output queue");throw r.controller.abort(x),x}const C={type:"token",requestId:i.
requestId,sequence:f++,text:w};S=S.then(()=>c.write(C,r.signal)).then(()=>{R-=O(w)+128}),S.catch(x=>r.controller.abort(x))};
let de=0;const ce=w=>{if(!["diffusion-progress","mesh-generation"].includes(w?.type))return;r.signal.throwIfAborted();const C=w.
type==="mesh-generation";if(i.task!==(C?"image-to-3d":"text-to-image")||++de>32||C&&s!==k)throw a("Invalid generation pr\
ogress");const x=C?ee(w):te(w);S=S.then(()=>c.write({type:"progress",requestId:i.requestId,progress:x},r.signal)),S.catch(
le=>r.controller.abort(le))},q=await M(this.generateLocal({...i,requestId:`remote-${crypto.randomUUID()}`,signal:r.signal,
onToken:ne,onProgress:ce}),r.signal);if(await S,r.signal.throwIfAborted(),!!q?.image!=(i.task==="text-to-image")||!!q?.audio!=
(i.task==="text-to-speech")||!!q?.mesh!=(i.task==="image-to-3d"))throw a("Inference output does not match hosted task");
const D=q.mesh?ie(q.mesh):null,U=se({...q,...q.image?{image:ge(q.image)}:{},...D?{mesh:Y(D)}:{},...q.audio?{audio:fe(q.audio,
q.sampleRate)}:{}});if(O(U.text)>$)throw a("Inference output exceeds its task byte budget");q.image&&await pe(c,{image:q.
image,metadata:U.image,requestId:i.requestId,controls:P,signal:r.signal}),q.audio&&await we(c,{samples:q.audio,metadata:U.
audio,requestId:i.requestId,controls:P,signal:r.signal}),D&&await Ce(c,{mesh:D,requestId:i.requestId,controls:P,signal:r.
signal}),await c.write({type:"done",requestId:i.requestId,result:U},r.signal),await this._closeCompletedStream(t,r.signal)}catch(b){
const i=B(b);if(r.signal.aborted)t.abort(i);else{const y={code:String(i.code??"ERR_PEER_INFERENCE").slice(0,80),message:String(
i.message??"Peer inference failed").slice(0,256)};try{await c.write(p?.type==="query"?this._envelope("error",o,y):{type:"\
error",...y},r.signal),await t.close({signal:r.signal})}catch{t.abort(i)}}}finally{l&&this.inbound.delete(l),r.signal.removeEventListener(
"abort",n),r.controller.abort(new Error("Inference stream finished")),r.dispose(),await h?.catch(()=>{}),E?.(),d()}}async generate(t,e={}){
if(this.closed)throw a("Peer inference service is stopped");const s=G({...e,...e.task===void 0&&(e.image!=null||e.audio!=
null)?{task:Z(e)}:{},requestId:e.requestId??crypto.randomUUID(),manifestCid:t},{imageBytes:!0});if(this.outbound.has(s.requestId)||
this.outbound.size>=v.maximumOutbound)throw a("Outgoing inference queue is full");const o=T([this.controller.signal,e.signal],
this.requestTimeoutMs),r={controller:o.controller,peerId:null};this.outbound.set(s.requestId,r);const c=(async()=>{let l=this.
listHosts().find(d=>d.manifestCid===s.manifestCid)?.hosts.filter(d=>!d.local)??[];l.length||(await this.refresh({signal:o.
signal}),l=this.listHosts().find(d=>d.manifestCid===s.manifestCid)?.hosts.filter(d=>!d.local)??[]);const h=this.listHosts().
find(d=>d.manifestCid===s.manifestCid);if(h){if(s.task=Z(s,h.task),!z(h,s))throw a("Requested task or media does not mat\
ch discovered model");G(s)}l=l.filter(d=>d.queueAvailable!==!1&&(!d.busy||(d.queuedRequests??0)<(d.queueCapacity??j.maxQueued))&&
z({...h,...d},s)&&(!X(s.task)||d.protocol!==Q)&&(s.task!=="audio-text-to-text"||A(d.protocol))&&(s.task!=="image-to-3d"||
d.protocol===k)&&(!(s.task==="image-text-to-text"&&d.task!=="image-text-to-text")||A(d.protocol))),l.sort((d,m)=>Number(
d.busy)-Number(m.busy)||(d.queuedRequests??0)-(m.queuedRequests??0)||(d.busy?0:m.idleForMs-d.idleForMs)||d.peerId.localeCompare(
m.peerId));let p=a("No remote peer hosts the requested model","ERR_INFERENCE_NOT_HOSTED");for(const d of l){o.signal.throwIfAborted(),
r.peerId=d.peerId;const m={target:`peer:${s.manifestCid}`,manifestCid:s.manifestCid,modelName:h?.name,local:!1,task:s.task,
peerId:d.peerId};e.onProgress?.({type:"routing",requestId:s.requestId,...m,route:m,busy:d.busy});const E={...s,...s.maxNewTokens===
void 0?{}:{maxNewTokens:Math.min(s.maxNewTokens,d.maxNewTokens??qe)}};try{return await this._generateAt(d.peerId,E,e,o.signal,
d.task??h.task)}catch(b){if(p=b,b.committed||o.signal.aborted)throw b}}throw p})();this.operations.add(c);try{return await c}finally{
this.operations.delete(c),this.outbound.delete(s.requestId),o.dispose()}}async _generateAt(t,e,s,o,r=e.task){let n,c,l=!1;
const h=()=>n?.abort(F(o));o.addEventListener("abort",h,{once:!0});try{const p=e.task==="audio-text-to-text"||e.task==="\
image-text-to-text"&&r!=="image-text-to-text",d=await this._openStream(t,o,{audio:X(e.task),nativeMedia:p,mesh:e.task===
"image-to-3d"}),{connection:m}=d;n=d.stream,c=d.release;const E=W(n),b={...e,task:A(d.protocol)?e.task:r,image:e.image?{
width:e.image.width,height:e.image.height,channels:4}:void 0,audio:e.audio?Object.fromEntries(Object.entries(e.audio).filter(
([u])=>u!=="samples")):void 0};await E.write(this._envelope("generate",t,b),o);const i=await E.read(o);if(i.type==="erro\
r")throw a(String(i.message).slice(0,256),i.code);if(i.type!=="upload"||i.requestId!==e.requestId)throw a("Invalid infer\
ence upload acknowledgement");if(e.image)for(let u=0;u<e.image.data.length;){const f=Math.min(u+v.imageChunkBytes,e.image.
data.length);await E.rpc.write(e.image.data.subarray(u,f),{signal:o});const R=await E.read(o);if(R.type!=="image-credit"||
R.offset!==f)throw a("Invalid image transfer credit");u=f}e.audio&&await Ee(E,{samples:e.audio.samples,requestId:e.requestId,
signal:o});let y=0,L=0,_=!1,I,N,P,S=0;for(;;){const u=await E.read(o);if(u.type==="error")throw a(String(u.message).slice(
0,256),u.code);if(u.requestId!==e.requestId)throw a("Inference response ID mismatch");if(u.type==="accepted"&&!_){l=!0,await E.
write({type:"start",requestId:e.requestId},o);const f={target:`peer:${e.manifestCid}`,manifestCid:e.manifestCid,local:!1,
task:e.task,peerId:t};_=!0,s.onProgress?.({type:"accepted",requestId:e.requestId,...f,route:f,queued:!!u.queued});continue}
if(!_)throw a("Inference output preceded admission");if(u.type==="token"){if(u.sequence!==y++||y>4096||typeof u.text!="s\
tring")throw a("Invalid token sequence");if(L+=O(u.text),L>(e.task==="automatic-speech-recognition"?8192:j.maxOutputBytes))
throw a("Inference output exceeds its byte budget");await M(s.onToken?.(u.text,{...u,peerId:t}),o)}else if(u.type==="pro\
gress"){const f=u.progress?.type==="mesh-generation";if(e.task!==(f?"image-to-3d":"text-to-image")||++S>32||f&&d.protocol!==
k)throw a("Invalid generation progress");const R=f?ee(u.progress):te(u.progress);await M(s.onProgress?.({...R,requestId:e.
requestId,peerId:t}),o)}else if(u.type==="result-image"){if(e.task!=="text-to-image"||I)throw a("Unexpected generated im\
age");I=await be(E,{image:u.image,requestId:e.requestId,signal:o})}else if(u.type==="result-audio"){if(e.task!=="text-to\
-speech"||N)throw a("Unexpected generated audio");N=await ye(E,{audio:u.audio,requestId:e.requestId,signal:o})}else if(u.
type==="result-mesh"){if(e.task!=="image-to-3d"||P||d.protocol!==k)throw a("Unexpected generated mesh");P=await _e(E,{mesh:u.
mesh,requestId:e.requestId,signal:o})}else if(u.type==="done"){const f=se(u.result);if(e.task==="automatic-speech-recogn\
ition"&&O(f.text)>8192)throw a("Speech transcript exceeds its byte budget");if(!!f.image!=(e.task==="text-to-image")||!!f.
image!=!!I||!!f.audio!=(e.task==="text-to-speech")||!!f.audio!=!!N||!!f.mesh!=(e.task==="image-to-3d")||!!f.mesh!=!!P)throw a(
"Inference output does not match requested task");if(I){if(["width","height","channels","sha256"].some(R=>I[R]!==f.image[R]))
throw a("Generated image metadata changed during transfer");f.image=I}if(N){if(Object.keys(N.metadata).some(R=>N.metadata[R]!==
f.audio[R]))throw a("Generated audio metadata changed during transfer");f.audio=N.audio,f.sampleRate=N.sampleRate}if(P){
if(JSON.stringify(Y(P))!==JSON.stringify(f.mesh))throw a("Generated mesh metadata changed during transfer");f.mesh=P}return await this.
_closeCompletedStream(n,o),{...f,requestId:e.requestId,peerId:t,manifestCid:e.manifestCid,protocol:d.protocol,connectionEncryption:m.
encryption,connectionAddress:m.remoteAddr?.toString()}}else throw a("Unknown inference output frame")}}catch(p){const d=B(
p);throw n?.abort(d),d.committed=l,l&&(d.remoteCleanupAcknowledged=!1),d}finally{c?.(),o.removeEventListener("abort",h)}}cancel(t){
const e=this.outbound.get(t);return e?(e.controller.abort(a("Caller cancelled peer inference","ERR_INFERENCE_CANCELLED")),
!0):!1}async stop(){return this.stopping?this.stopping:(this.closed=!0,this.controller.abort(a("Peer inference service s\
topped","ERR_INFERENCE_STOPPED")),this.stopping=(async()=>{try{await this.manager.libp2p.unhandle(K)}finally{this.manager.
libp2p.removeEventListener("peer:disconnect",this.disconnectListener),await Promise.allSettled([...this.operations]),this.
records.clear(),this.models=[],this.hosts=[],this.getLocalState=null,this.generateLocal=null}this.requiresCleanup=!1})().
catch(t=>{throw this.stopping=null,this.requiresCleanup=!0,t}),this.stopping)}}export{ve as PeerInferenceService};
