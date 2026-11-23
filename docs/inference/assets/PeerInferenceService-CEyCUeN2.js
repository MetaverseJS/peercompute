import{c6 as K,c7 as M,bH as ce,c8 as W,c9 as J,ca as z,cb as G,M as V,cc as fe,cd as P,ce as A,cf as Q,cg as Y,ch as X,
ci as Z,cj as B,ck as ee,cl as $,cm as ge,cn as pe,co as O,cp as se,cq as re,cr as oe,cs as we,ct as Ee,cu as ye,cv as be,
cw as ie,cx as Ie,cy as Ce,cz as qe,cA as te,cB as ae,cC as Re,cD as _e}from"./main-BwcRkruW.js";import"./index-By6DRDnn.js";
async function ke(E,{mesh:t,requestId:e,controls:s,signal:o}){const r=K(t),u=s.expect(0);await E.write({type:"result-mes\
h",requestId:e,mesh:r},o),await u;for(let a=0;a<t.data.byteLength;){const l=Math.min(a+M.imageChunkBytes,t.data.byteLength),
h=s.expect(l);await E.rpc.write(t.data.subarray(a,l),{signal:o}),await h,a=l}}async function ve(E,{mesh:t,requestId:e,signal:s,
allowTextures:o=!1}){const r=K(t),u=new Uint8Array(r.byteLength);await E.write({type:"result-credit",requestId:e,offset:0},
s);let a=0,l;for(;a<u.byteLength;){const h=await E.rpc.read({signal:s});if(!h.byteLength||h.byteLength>M.imageChunkBytes||
h.byteLength>u.byteLength-a)throw new Error("Invalid generated mesh transfer frame");u.set(h.subarray(),a),a+=h.byteLength,
a===u.byteLength&&(l=ce({...r,data:u},{allowTextures:o})),await E.write({type:"result-credit",requestId:e,offset:a},s)}return l}
const n=(E,t="ERR_PEER_INFERENCE")=>Object.assign(new Error(E),{code:t}),D=E=>E instanceof Error?E:n(String(E??"Peer inf\
erence failed")),F=E=>E.reason instanceof Error?E.reason:new DOMException("Inference cancelled","AbortError"),de=E=>E?.code===
"ERR_INFERENCE_DEADLINE"||["TimeoutError","ConnectionClosedError","StreamResetError","StreamStateError"].includes(E?.name),
ne=E=>E.some(de)&&!E.some(t=>["UnsupportedProtocolError","TooManyOutboundProtocolStreamsError","TooManyInboundProtocolSt\
reamsError","LimitedConnectionError","InvalidParametersError"].includes(t?.name));function T(E,t){const e=new AbortController,
s=E.filter(Boolean).map(r=>{const u=()=>e.abort(F(r));return r.addEventListener("abort",u,{once:!0}),r.aborted&&u(),()=>r.
removeEventListener("abort",u)}),o=setTimeout(()=>e.abort(n("Peer inference deadline exceeded","ERR_INFERENCE_DEADLINE")),
t);return o.unref?.(),{controller:e,signal:e.signal,dispose(){clearTimeout(o),s.forEach(r=>r())}}}function S(E,t){if(t.aborted)
throw Promise.resolve(E).catch(()=>{}),F(t);return new Promise((e,s)=>{const o=()=>s(F(t));t.addEventListener("abort",o,
{once:!0}),Promise.resolve(E).then(e,s).finally(()=>t.removeEventListener("abort",o))})}class Me{constructor(t,{owner:e=Symbol(
"peer-inference-owner"),getLocalState:s,generate:o,queryTimeoutMs:r=M.queryTimeoutMs,requestTimeoutMs:u=M.requestTimeoutMs,
maximumPeers:a=M.maximumPeers}={}){if(typeof s!="function"||typeof o!="function")throw new Error("Peer inference callbac\
ks are required");this.manager=t,this.owner=e,this.getLocalState=s,this.generateLocal=o,this.queryTimeoutMs=W(r,15e3,100),
this.requestTimeoutMs=W(u,3e5,100),this.maximumPeers=W(a,M.maximumPeers,1),this.controller=new AbortController,this.records=
new Map,this.inbound=new Map,this.outbound=new Map,this.operations=new Set,this.hostingEnabled=!0,this.closed=!1,this.refreshing=
null,this.models=[],this.hosts=[],this.lastErrors=[],this.failedConnections=new WeakMap,this.recoveries=new Map,this.disconnectListener=
l=>{const h=l.detail.toString();this.records.delete(h),this._group();for(const g of[...this.inbound.values(),...this.outbound.
values()])g.peerId===h&&g.controller.abort(n("Inference peer disconnected","ERR_INFERENCE_DISCONNECTED"))}}get peerId(){
return this.manager.libp2p.peerId.toString()}get scope(){const{gameId:t,roomId:e,topologyId:s}=this.manager.config;return{
gameId:t,roomId:e,topologyId:s}}async start(){for(const t of J)await this.manager.libp2p.handle(t,(e,s)=>{if(this.closed||
this.operations.size>=40||!z(s)){e.abort(n("Encrypted peer inference connection required"));return}const o=this._handle(
e,s,t);this.operations.add(o),o.catch(()=>{}).finally(()=>this.operations.delete(o))},{maxInboundStreams:4,maxOutboundStreams:4,
runOnLimitedConnection:!0});return this.manager.libp2p.addEventListener("peer:disconnect",this.disconnectListener),this}_envelope(t,e,s={}){
return{type:t,scope:this.scope,sender:this.peerId,recipient:e,...s}}_checkEnvelope(t,e){if(!t||t.sender!==e||t.recipient!==
this.peerId||["gameId","roomId","topologyId"].some(s=>t.scope?.[s]!==this.scope[s]))throw n("Peer inference identity or \
scope mismatch")}async _state(t,e=0,s,o){const r=G(await S(o??this.getLocalState({signal:t}),t),this.hostingEnabled,{defaultMaxNewTokens:V.
maxNewTokens});for(const u of r.hostedModels)[...this.inbound.values()].filter(l=>l.manifestCid===u.manifestCid).length>
(u.manifestCid===s?e:0)&&(u.busy=!0,u.idleForMs=0);return this.inbound.size>e&&(r.busy=!0,r.idleForMs=0),r}async getTelemetrySummary({
signal:t=this.controller.signal}={}){if(this.closed||!this.hostingEnabled)return[];if(this.telemetryStatePending)throw new Error(
"Local hosted-model telemetry read is still pending");const e=Promise.resolve().then(()=>this.getLocalState({signal:t}));
this.telemetryStatePending=e;const s=()=>{this.telemetryStatePending===e&&(this.telemetryStatePending=null)};e.then(s,s);
const o=await this._state(t,0,void 0,this.telemetryStatePending);return this.closed||!this.hostingEnabled||t.aborted?[]:
o.hostedModels.map(({manifestCid:r,name:u,task:a,runtime:l,modalities:h,busy:g})=>({manifestCid:r,name:u,task:a,runtime:l,
modalities:h,busy:g}))}setHostingEnabled(t){if(this.hostingEnabled=!!t,!this.hostingEnabled)for(const e of this.inbound.
values())e.controller.abort(n("Peer inference hosting disabled","ERR_INFERENCE_HOST_DISABLED"));this.records.delete(this.
peerId),this._group()}async cancelHostedModel(t){t=fe(t);const e=[...this.inbound.values()].filter(s=>s.manifestCid===t);
for(const s of e)s.controller.abort(n("Hosted model is unloading","ERR_INFERENCE_HOST_DISABLED"));return await Promise.allSettled(
e.map(s=>s.finished)),this.records.delete(this.peerId),this._group(),e.length}_remember(t,e,s=P){this.records.set(t,{state:e,
protocol:s,receivedAt:Date.now()})}_group(){const t=new Map,e=new Map,s=Date.now();for(const[o,r]of this.records){if(s-r.
receivedAt>M.recordTtlMs){this.records.delete(o);continue}const{state:u}=r,a=o===this.peerId;for(const l of u.sharedModels)
t.has(l.manifestCid)?A(r.protocol)&&Object.assign(t.get(l.manifestCid),l):t.set(l.manifestCid,{...l,providers:[]}),t.get(
l.manifestCid).providers.push({peerId:o,local:a});for(const l of u.hostedModels??(u.hostedModel?[{...u.hostedModel,busy:u.
busy,idleForMs:u.idleForMs,queuedRequests:u.queuedRequests}]:[])){const{maxNewTokens:h,busy:g,idleForMs:c,queuedRequests:p,
queueCapacity:d,queueAvailable:m,...i}=l;e.has(i.manifestCid)?A(r.protocol)&&Object.assign(e.get(i.manifestCid),i):e.set(
i.manifestCid,{...i,hosts:[]}),e.get(i.manifestCid).hosts.push({peerId:o,local:a,busy:g,task:i.task,modalities:[...i.modalities],
outputModalities:[...i.outputModalities],idleForMs:g?0:c,queuedRequests:p,queueCapacity:d,queueAvailable:m,maxNewTokens:h,
protocol:r.protocol})}}this.models=[...t.values()],this.hosts=[...e.values()]}listModels(){return this._group(),structuredClone(
this.models)}listHosts(){return this._group(),structuredClone(this.hosts)}_connections(t){return this.manager.libp2p.getConnections().
filter(e=>e.remotePeer.toString()===t&&z(e)).sort((e,s)=>{const o=r=>(r.encryption==="native"?3:r.remoteAddr?.getComponents?.().
some(({name:u})=>u==="p2p-circuit")?1:2)-((this.failedConnections.get(r)??0)>Date.now()?10:0);return o(s)-o(e)})}async _connection(t,e){
e.throwIfAborted();const s=()=>this._connections(t)[0];let o=s();if(!o&&this.manager.peers?.has(t)){if(this.manager.recoverPeerInferenceConnection){
try{await S(this._recoverConnection(t),e)}catch{e.throwIfAborted(),this.controller.signal.throwIfAborted()}o=s()}o||(await S(
this.manager._maybeDialPeer(t,"peer-inference"),e),o=s())}if(!o)throw n("No authenticated encrypted connection to infere\
nce peer","ERR_INFERENCE_UNREACHABLE");return o}_recoverConnection(t){if(this.recoveries.has(t))return this.recoveries.get(
t);const e=this.manager.recoverPeerInferenceConnection(t,{signal:this.controller.signal});this.recoveries.set(t,e),this.
operations.add(e);const s=()=>{this.operations.delete(e),this.recoveries.get(t)===e&&this.recoveries.delete(t)};return e.
then(s,s),e}async _openStream(t,e,{audio:s=!1,nativeMedia:o=!1,mesh:r=!1,texturedMesh:u=!1,backgroundRecovery:a=!1}={}){
const l=await this._connection(t,e),h=[...new Set([l,...this._connections(t)])].slice(0,4),g=[];let c;const p=async d=>{
if(e.throwIfAborted(),d.remotePeer.toString()!==t||!z(d))throw n("Invalid recovered inference connection");const m=T([this.
controller.signal,e],Math.min(2e3,this.queryTimeoutMs/2));let i;try{const I=u?P:r?[P,te]:o?[P,te,ae]:s?[P,te,ae,Re]:J;i=
Promise.resolve(d.newStream(I,{signal:m.signal,runOnLimitedConnection:!0}));const N=await S(i,m.signal);m.signal.throwIfAborted();
const b=this.manager.retainPeerInferenceConnection?.(d,{timeoutMs:this.requestTimeoutMs+1e3});return this.failedConnections.
delete(d),{connection:d,stream:N,release:b,protocol:N.protocol??P}}catch(I){const N=D(I);throw i?.then(b=>b.abort(N),()=>{}).
catch(()=>{}),de(N)&&this.failedConnections.set(d,Date.now()+15e3),g.push(N),N}finally{m.dispose()}};try{for(const d of h)
try{return await p(d)}catch{e.throwIfAborted(),this.controller.signal.throwIfAborted()}}catch(d){throw a&&e.reason?.code===
"ERR_INFERENCE_DEADLINE"&&ne(g)&&!this.controller.signal.aborted&&this.manager.recoverPeerInferenceConnection&&this._recoverConnection(
t).catch(()=>{}),d}if(ne(g)&&this.manager.recoverPeerInferenceConnection)try{const d=await S(this._recoverConnection(t),
e);return e.throwIfAborted(),await p(d)}catch(d){e.throwIfAborted(),this.controller.signal.throwIfAborted(),c=D(d)}throw Object.
assign(new AggregateError(g,`Unable to open an encrypted inference stream: ${String(g.at(-1)?.message??"connections clos\
ed").slice(0,160)}`,{cause:g.at(-1)}),{code:"ERR_INFERENCE_STREAM_UNAVAILABLE",peerId:t,recoveryError:c})}async _closeCompletedStream(t,e){
const s=T([this.controller.signal,e],Math.min(1e3,this.queryTimeoutMs/2));try{await S(Promise.resolve().then(()=>t.close(
{signal:s.signal})),s.signal)}catch(o){try{Promise.resolve(t.abort(D(o))).catch(()=>{})}catch{}this.controller.signal.throwIfAborted(),
e.throwIfAborted()}finally{s.dispose()}this.controller.signal.throwIfAborted(),e.throwIfAborted()}async _query(t,e){const s=T(
[this.controller.signal,e],this.queryTimeoutMs);let o,r;const u=()=>o?.abort(F(s.signal));s.signal.addEventListener("abo\
rt",u,{once:!0});try{let a;({stream:o,protocol:a,release:r}=await this._openStream(t,s.signal,{backgroundRecovery:!0}));
const l=Q(o);await l.write(this._envelope("query",t),s.signal);const h=await l.read(s.signal);if(h?.type==="error")throw[
"sender","recipient","scope"].some(g=>Object.hasOwn(h,g))&&this._checkEnvelope(h,t),typeof h.message!="string"||h.code!==
void 0&&typeof h.code!="string"?n("Invalid inference directory error response","ERR_INFERENCE_DIRECTORY_INVALID"):n(h.message.
slice(0,256)||"Peer inference directory unavailable",h.code?.slice(0,80)||"ERR_PEER_INFERENCE");if(this._checkEnvelope(h,
t),h.type!=="directory")throw n("Invalid inference directory response");this._remember(t,G(h.state,!0,{protocol:a}),a),await this.
_closeCompletedStream(o,s.signal)}catch(a){throw this.records.delete(t),o?.abort(a),a}finally{r?.(),s.signal.removeEventListener(
"abort",u),s.dispose()}}async refresh({signal:t}={}){if(this.closed)throw n("Peer inference service is stopped");if(this.
refreshing)return S(this.refreshing,t??this.controller.signal);const e=async()=>{const s=T([this.controller.signal,t],this.
queryTimeoutMs*2+100);try{this._remember(this.peerId,await this._state(s.signal));const o=new Set(this.manager.libp2p.getConnections().
filter(d=>z(d)).map(d=>d.remotePeer.toString())),r=[...new Set([...o,...this.manager.libp2p.getConnections().map(d=>d.remotePeer.
toString()),...this.manager.peers?.keys()??[]])].filter(d=>d!==this.peerId&&!this.manager.bootstrapPeerIds?.has(d)).slice(
0,this.maximumPeers),u=[],a=[];for(const d of r)o.has(d)?u.push(d):a.push(d);const l=new Map,h=async d=>{try{await this.
_query(d,s.signal),l.set(d,{status:"fulfilled"})}catch(m){l.set(d,{status:"rejected",reason:m})}},g=Math.max(1,Math.min(
4,this.manager.peerConnectionRecovery?.maxConcurrent??2));let c=0;const p=a.length>0?Array.from({length:Math.min(g,a.length)},
async()=>{for(;c<a.length&&!s.signal.aborted;){const d=a[c++];await h(d)}}):[];return await Promise.all([...u.map(d=>h(d)),
...p]),s.signal.throwIfAborted(),this.lastErrors=r.flatMap(d=>{const m=l.get(d);return m?.status==="rejected"?[{peerId:d,
code:String(m.reason?.code??"ERR_PEER_INFERENCE").slice(0,80),message:String(m.reason?.message??"Directory unavailable").
slice(0,256)}]:[]}),{models:this.listModels(),hosts:this.listHosts(),errors:structuredClone(this.lastErrors)}}finally{s.
dispose()}};this.refreshing=e(),this.operations.add(this.refreshing);try{return await this.refreshing}finally{this.operations.
delete(this.refreshing),this.refreshing=null}}async _handle(t,e,s=P){const o=e.remotePeer.toString(),r=T([this.controller.
signal],this.requestTimeoutMs),u=()=>t.abort(F(r.signal));r.signal.addEventListener("abort",u,{once:!0});const a=Q(t);let l,
h,g,c;const p=new Promise(m=>{c=m});let d;try{d=this.manager.retainPeerInferenceConnection?.(e,{timeoutMs:this.requestTimeoutMs+
1e3});const m=T([r.signal],this.queryTimeoutMs);try{g=await a.read(m.signal)}finally{m.dispose()}if(this._checkEnvelope(
g,o),g.type==="query"){const y=await this._state(r.signal);await a.write(this._envelope("directory",o,{state:s!==P?G(y,this.
hostingEnabled,{protocol:s}):y}),r.signal),await this._closeCompletedStream(t,r.signal);return}if(g.type!=="generate")throw n(
"Unknown inference request");const i=Y(g);if(s===X&&Z(i.task))throw n("Speech requires inference protocol v3");if(!A(s)&&
i.task==="audio-text-to-text")throw n("Native audio conversation requires inference protocol v4");if(!B(s)&&i.task==="im\
age-to-3d")throw n("Mesh generation requires inference protocol v5 or newer");if(l=`${o}:${i.requestId}`,this.inbound.has(
l)||this.inbound.size>=M.maximumInbound||[...this.inbound.values()].filter(y=>y.peerId===o).length>=M.maximumPerPeer)throw l=
null,n("Peer inference queue is full","ERR_INFERENCE_BUSY");this.inbound.set(l,{peerId:o,manifestCid:i.manifestCid,controller:r.
controller,finished:p});const I=y=>{const q=s===P?y:G(y,this.hostingEnabled,{protocol:s});return s===X?q.hostedModel?.manifestCid===
i.manifestCid?q.hostedModel:null:q.hostedModels.find(L=>L.manifestCid===i.manifestCid)},N=await this._state(r.signal,1,i.
manifestCid),b=I(N);if(!b)throw n("Requested model is not hosted","ERR_INFERENCE_NOT_HOSTED");if(i.maxNewTokens>b.maxNewTokens)
throw n("Requested token limit exceeds hosted capacity","ERR_INFERENCE_TOKEN_LIMIT");if(!A(s)&&i.task!==void 0&&i.task!==
b.task)throw n("Requested task does not match hosted model");if(i.task=ee(i,b.task),!$(b,i))throw n("Requested task or m\
edia does not match hosted model");if(b.queueAvailable===!1||b.busy&&b.queuedRequests>=b.queueCapacity)throw n("Hosted m\
odel queue is full","ERR_INFERENCE_BUSY");if(Y(i),await a.write({type:"upload",requestId:i.requestId},r.signal),i.image){
i.image.data=new Uint8Array(i.image.width*i.image.height*4);let y=0;for(;y<i.image.data.length;){const q=await a.rpc.read(
{signal:r.signal});if(!q.byteLength||q.byteLength>M.imageChunkBytes||q.byteLength>i.image.data.length-y)throw n("Invalid\
 image transfer frame");i.image.data.set(q.subarray(),y),y+=q.byteLength,await a.write({type:"image-credit",offset:y},r.
signal)}}i.audio&&(i.audio=await ge(a,{audio:i.audio,requestId:i.requestId,signal:r.signal}));const k=I(await this._state(
r.signal,1,i.manifestCid));if(!k||k.task!==b.task)throw n("Inference host changed during upload");if(!$(k,i))throw n("In\
ference host media capabilities changed during upload");if(i.maxNewTokens>k.maxNewTokens)throw n("Requested token limit \
exceeds hosted capacity","ERR_INFERENCE_TOKEN_LIMIT");if(k.queueAvailable===!1||k.busy&&k.queuedRequests>=k.queueCapacity)
throw n("Hosted model queue is full","ERR_INFERENCE_BUSY");await a.write({type:"accepted",requestId:i.requestId,queued:k.
busy},r.signal);const x=await a.read(r.signal);if(x.type!=="start"||x.requestId!==i.requestId)throw n("Missing inference\
 start acknowledgement");const v=pe(a,i.requestId,r.controller);h=v.task;let R=Promise.resolve(),U=0,f=0,w=0;const _=i.task===
"automatic-speech-recognition"?8192:V.maxOutputBytes,le=y=>{if(r.signal.throwIfAborted(),typeof y!="string")throw n("Inv\
alid host token");if(!y.length)return;if(U+=O(y),w+=O(y)+128,U>_||w>_+8192||f>=4096){const L=n("Inference token consumer\
 exceeded its bounded output queue");throw r.controller.abort(L),L}const q={type:"token",requestId:i.requestId,sequence:f++,
text:y};R=R.then(()=>a.write(q,r.signal)).then(()=>{w-=O(y)+128}),R.catch(L=>r.controller.abort(L))};let he=0;const ue=y=>{
if(!["diffusion-progress","mesh-generation"].includes(y?.type))return;r.signal.throwIfAborted();const q=y.type==="mesh-g\
eneration";if(i.task!==(q?"image-to-3d":"text-to-image")||++he>32||q&&!B(s))throw n("Invalid generation progress");const L=q?
se(y):re(y);R=R.then(()=>a.write({type:"progress",requestId:i.requestId,progress:L},r.signal)),R.catch(me=>r.controller.
abort(me))},C=await S(this.generateLocal({...i,requestId:`remote-${crypto.randomUUID()}`,signal:r.signal,onToken:le,onProgress:ue}),
r.signal);if(await R,r.signal.throwIfAborted(),!!C?.image!=(i.task==="text-to-image")||!!C?.audio!=(i.task==="text-to-sp\
eech")||!!C?.mesh!=(i.task==="image-to-3d"))throw n("Inference output does not match hosted task");const H=C.mesh?ce(C.mesh,
{allowTextures:s===P}):null,j=oe({...C,...C.image?{image:Ee(C.image)}:{},...H?{mesh:K(H)}:{},...C.audio?{audio:we(C.audio,
C.sampleRate)}:{}});if(O(j.text)>_)throw n("Inference output exceeds its task byte budget");C.image&&await ye(a,{image:C.
image,metadata:j.image,requestId:i.requestId,controls:v,signal:r.signal}),C.audio&&await be(a,{samples:C.audio,metadata:j.
audio,requestId:i.requestId,controls:v,signal:r.signal}),H&&await ke(a,{mesh:H,requestId:i.requestId,controls:v,signal:r.
signal}),await a.write({type:"done",requestId:i.requestId,result:j},r.signal),await this._closeCompletedStream(t,r.signal)}catch(m){
const i=D(m);if(r.signal.aborted)t.abort(i);else{const I={code:String(i.code??"ERR_PEER_INFERENCE").slice(0,80),message:String(
i.message??"Peer inference failed").slice(0,256)};try{await a.write(g?.type==="query"?this._envelope("error",o,I):{type:"\
error",...I},r.signal),await t.close({signal:r.signal})}catch{t.abort(i)}}}finally{l&&this.inbound.delete(l),r.signal.removeEventListener(
"abort",u),r.controller.abort(new Error("Inference stream finished")),r.dispose(),await h?.catch(()=>{}),d?.(),c()}}async generate(t,e={}){
if(this.closed)throw n("Peer inference service is stopped");const s=Y({...e,...e.task===void 0&&(e.image!=null||e.audio!=
null)?{task:ee(e)}:{},requestId:e.requestId??crypto.randomUUID(),manifestCid:t},{imageBytes:!0});if(this.outbound.has(s.
requestId)||this.outbound.size>=M.maximumOutbound)throw n("Outgoing inference queue is full");const o=T([this.controller.
signal,e.signal],this.requestTimeoutMs),r={controller:o.controller,peerId:null};this.outbound.set(s.requestId,r);const a=(async()=>{
let l=this.listHosts().find(c=>c.manifestCid===s.manifestCid)?.hosts.filter(c=>!c.local)??[];l.length||(await this.refresh(
{signal:o.signal}),l=this.listHosts().find(c=>c.manifestCid===s.manifestCid)?.hosts.filter(c=>!c.local)??[]);const h=this.
listHosts().find(c=>c.manifestCid===s.manifestCid);if(h){if(s.task=ee(s,h.task),!$(h,s))throw n("Requested task or media\
 does not match discovered model");Y(s)}l=l.filter(c=>c.queueAvailable!==!1&&(!c.busy||(c.queuedRequests??0)<(c.queueCapacity??
V.maxQueued))&&$({...h,...c},s)&&(!Z(s.task)||c.protocol!==X)&&(s.task!=="audio-text-to-text"||A(c.protocol))&&(s.task!==
"image-to-3d"||B(c.protocol))&&(!ie(h)||c.protocol===P)&&(!(s.task==="image-text-to-text"&&c.task!=="image-text-to-text")||
A(c.protocol))),l.sort((c,p)=>Number(c.busy)-Number(p.busy)||(c.queuedRequests??0)-(p.queuedRequests??0)||(c.busy?0:p.idleForMs-
c.idleForMs)||c.peerId.localeCompare(p.peerId));let g=n("No remote peer hosts the requested model","ERR_INFERENCE_NOT_HO\
STED");for(const c of l){o.signal.throwIfAborted(),r.peerId=c.peerId;const p={target:`peer:${s.manifestCid}`,manifestCid:s.
manifestCid,modelName:h?.name,local:!1,task:s.task,peerId:c.peerId};e.onProgress?.({type:"routing",requestId:s.requestId,
...p,route:p,busy:c.busy});const d={...s,...s.maxNewTokens===void 0?{}:{maxNewTokens:Math.min(s.maxNewTokens,c.maxNewTokens??
_e)}};try{return await this._generateAt(c.peerId,d,e,o.signal,c.task??h.task,h.runtime)}catch(m){if(g=m,m.committed||o.signal.
aborted)throw m}}throw g})();this.operations.add(a);try{return await a}finally{this.operations.delete(a),this.outbound.delete(
s.requestId),o.dispose()}}async _generateAt(t,e,s,o,r=e.task,u){let a,l,h=!1;const g=()=>a?.abort(F(o));o.addEventListener(
"abort",g,{once:!0});try{const c=e.task==="audio-text-to-text"||e.task==="image-text-to-text"&&r!=="image-text-to-text",
p=await this._openStream(t,o,{audio:Z(e.task),nativeMedia:c,mesh:e.task==="image-to-3d",texturedMesh:ie({runtime:u})}),{
connection:d}=p;a=p.stream,l=p.release;const m=Q(a),i={...e,task:A(p.protocol)?e.task:r,image:e.image?{width:e.image.width,
height:e.image.height,channels:4}:void 0,audio:e.audio?Object.fromEntries(Object.entries(e.audio).filter(([f])=>f!=="sam\
ples")):void 0};await m.write(this._envelope("generate",t,i),o);const I=await m.read(o);if(I.type==="error")throw n(String(
I.message).slice(0,256),I.code);if(I.type!=="upload"||I.requestId!==e.requestId)throw n("Invalid inference upload acknow\
ledgement");if(e.image)for(let f=0;f<e.image.data.length;){const w=Math.min(f+M.imageChunkBytes,e.image.data.length);await m.
rpc.write(e.image.data.subarray(f,w),{signal:o});const _=await m.read(o);if(_.type!=="image-credit"||_.offset!==w)throw n(
"Invalid image transfer credit");f=w}e.audio&&await Ie(m,{samples:e.audio.samples,requestId:e.requestId,signal:o});let N=0,
b=0,k=!1,x,v,R,U=0;for(;;){const f=await m.read(o);if(f.type==="error")throw n(String(f.message).slice(0,256),f.code);if(f.
requestId!==e.requestId)throw n("Inference response ID mismatch");if(f.type==="accepted"&&!k){h=!0,await m.write({type:"\
start",requestId:e.requestId},o);const w={target:`peer:${e.manifestCid}`,manifestCid:e.manifestCid,local:!1,task:e.task,
peerId:t};k=!0,s.onProgress?.({type:"accepted",requestId:e.requestId,...w,route:w,queued:!!f.queued});continue}if(!k)throw n(
"Inference output preceded admission");if(f.type==="token"){if(f.sequence!==N++||N>4096||typeof f.text!="string")throw n(
"Invalid token sequence");if(b+=O(f.text),b>(e.task==="automatic-speech-recognition"?8192:V.maxOutputBytes))throw n("Inf\
erence output exceeds its byte budget");await S(s.onToken?.(f.text,{...f,peerId:t}),o)}else if(f.type==="progress"){const w=f.
progress?.type==="mesh-generation";if(e.task!==(w?"image-to-3d":"text-to-image")||++U>32||w&&!B(p.protocol))throw n("Inv\
alid generation progress");const _=w?se(f.progress):re(f.progress);await S(s.onProgress?.({..._,requestId:e.requestId,peerId:t}),
o)}else if(f.type==="result-image"){if(e.task!=="text-to-image"||x)throw n("Unexpected generated image");x=await Ce(m,{image:f.
image,requestId:e.requestId,signal:o})}else if(f.type==="result-audio"){if(e.task!=="text-to-speech"||v)throw n("Unexpec\
ted generated audio");v=await qe(m,{audio:f.audio,requestId:e.requestId,signal:o})}else if(f.type==="result-mesh"){if(e.
task!=="image-to-3d"||R||!B(p.protocol))throw n("Unexpected generated mesh");R=await ve(m,{mesh:f.mesh,requestId:e.requestId,
signal:o,allowTextures:p.protocol===P})}else if(f.type==="done"){const w=oe(f.result);if(e.task==="automatic-speech-reco\
gnition"&&O(w.text)>8192)throw n("Speech transcript exceeds its byte budget");if(!!w.image!=(e.task==="text-to-image")||
!!w.image!=!!x||!!w.audio!=(e.task==="text-to-speech")||!!w.audio!=!!v||!!w.mesh!=(e.task==="image-to-3d")||!!w.mesh!=!!R)
throw n("Inference output does not match requested task");if(x){if(["width","height","channels","sha256"].some(_=>x[_]!==
w.image[_]))throw n("Generated image metadata changed during transfer");w.image=x}if(v){if(Object.keys(v.metadata).some(
_=>v.metadata[_]!==w.audio[_]))throw n("Generated audio metadata changed during transfer");w.audio=v.audio,w.sampleRate=
v.sampleRate}if(R){if(JSON.stringify(K(R))!==JSON.stringify(w.mesh))throw n("Generated mesh metadata changed during tran\
sfer");w.mesh=R}return await this._closeCompletedStream(a,o),{...w,requestId:e.requestId,peerId:t,manifestCid:e.manifestCid,
protocol:p.protocol,connectionEncryption:d.encryption,connectionAddress:d.remoteAddr?.toString()}}else throw n("Unknown \
inference output frame")}}catch(c){const p=D(c);throw a?.abort(p),p.committed=h,h&&(p.remoteCleanupAcknowledged=!1),p}finally{
l?.(),o.removeEventListener("abort",g)}}cancel(t){const e=this.outbound.get(t);return e?(e.controller.abort(n("Caller ca\
ncelled peer inference","ERR_INFERENCE_CANCELLED")),!0):!1}async stop(){return this.stopping?this.stopping:(this.closed=
!0,this.controller.abort(n("Peer inference service stopped","ERR_INFERENCE_STOPPED")),this.stopping=(async()=>{try{await this.
manager.libp2p.unhandle(J)}finally{this.manager.libp2p.removeEventListener("peer:disconnect",this.disconnectListener),await Promise.
allSettled([...this.operations]),this.records.clear(),this.models=[],this.hosts=[],this.getLocalState=null,this.generateLocal=
null}this.requiresCleanup=!1})().catch(t=>{throw this.stopping=null,this.requiresCleanup=!0,t}),this.stopping)}}export{Me as PeerInferenceService};
