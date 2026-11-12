import{bk as $,bl as M,aX as de,bm as K,bn as J,bo as Q,bp as G,M as z,bq as fe,br as P,bs as A,bt as W,bu as V,bv as X,
bw as Z,bx as B,by as ee,bz as Y,bA as ge,bB as pe,bC as O,bD as se,bE as re,bF as oe,bG as we,bH as Ee,bI as be,bJ as ye,
bK as ie,bL as Ie,bM as qe,bN as Ce,bO as te,bP as ae,bQ as Re,bR as _e}from"./main-Cvsn7onI.js";import"./index-6TlIxpa6.js";
async function ke(w,{mesh:t,requestId:e,controls:s,signal:r}){const o=$(t),d=s.expect(0);await w.write({type:"result-mes\
h",requestId:e,mesh:o},r),await d;for(let n=0;n<t.data.byteLength;){const h=Math.min(n+M.imageChunkBytes,t.data.byteLength),
l=s.expect(h);await w.rpc.write(t.data.subarray(n,h),{signal:r}),await l,n=h}}async function Ne(w,{mesh:t,requestId:e,signal:s,
allowTextures:r=!1}){const o=$(t),d=new Uint8Array(o.byteLength);await w.write({type:"result-credit",requestId:e,offset:0},
s);let n=0,h;for(;n<d.byteLength;){const l=await w.rpc.read({signal:s});if(!l.byteLength||l.byteLength>M.imageChunkBytes||
l.byteLength>d.byteLength-n)throw new Error("Invalid generated mesh transfer frame");d.set(l.subarray(),n),n+=l.byteLength,
n===d.byteLength&&(h=de({...o,data:d},{allowTextures:r})),await w.write({type:"result-credit",requestId:e,offset:n},s)}return h}
const a=(w,t="ERR_PEER_INFERENCE")=>Object.assign(new Error(w),{code:t}),D=w=>w instanceof Error?w:a(String(w??"Peer inf\
erence failed")),F=w=>w.reason instanceof Error?w.reason:new DOMException("Inference cancelled","AbortError"),ce=w=>w?.code===
"ERR_INFERENCE_DEADLINE"||["TimeoutError","ConnectionClosedError","StreamResetError","StreamStateError"].includes(w?.name),
ne=w=>w.some(ce)&&!w.some(t=>["UnsupportedProtocolError","TooManyOutboundProtocolStreamsError","TooManyInboundProtocolSt\
reamsError","LimitedConnectionError","InvalidParametersError"].includes(t?.name));function T(w,t){const e=new AbortController,
s=w.filter(Boolean).map(o=>{const d=()=>e.abort(F(o));return o.addEventListener("abort",d,{once:!0}),o.aborted&&d(),()=>o.
removeEventListener("abort",d)}),r=setTimeout(()=>e.abort(a("Peer inference deadline exceeded","ERR_INFERENCE_DEADLINE")),
t);return r.unref?.(),{controller:e,signal:e.signal,dispose(){clearTimeout(r),s.forEach(o=>o())}}}function S(w,t){if(t.aborted)
throw Promise.resolve(w).catch(()=>{}),F(t);return new Promise((e,s)=>{const r=()=>s(F(t));t.addEventListener("abort",r,
{once:!0}),Promise.resolve(w).then(e,s).finally(()=>t.removeEventListener("abort",r))})}class Me{constructor(t,{owner:e=Symbol(
"peer-inference-owner"),getLocalState:s,generate:r,queryTimeoutMs:o=M.queryTimeoutMs,requestTimeoutMs:d=M.requestTimeoutMs,
maximumPeers:n=M.maximumPeers}={}){if(typeof s!="function"||typeof r!="function")throw new Error("Peer inference callbac\
ks are required");this.manager=t,this.owner=e,this.getLocalState=s,this.generateLocal=r,this.queryTimeoutMs=K(o,15e3,100),
this.requestTimeoutMs=K(d,3e5,100),this.maximumPeers=K(n,M.maximumPeers,1),this.controller=new AbortController,this.records=
new Map,this.inbound=new Map,this.outbound=new Map,this.operations=new Set,this.hostingEnabled=!0,this.closed=!1,this.refreshing=
null,this.models=[],this.hosts=[],this.lastErrors=[],this.failedConnections=new WeakMap,this.recoveries=new Map,this.disconnectListener=
h=>{const l=h.detail.toString();this.records.delete(l),this._group();for(const f of[...this.inbound.values(),...this.outbound.
values()])f.peerId===l&&f.controller.abort(a("Inference peer disconnected","ERR_INFERENCE_DISCONNECTED"))}}get peerId(){
return this.manager.libp2p.peerId.toString()}get scope(){const{gameId:t,roomId:e,topologyId:s}=this.manager.config;return{
gameId:t,roomId:e,topologyId:s}}async start(){for(const t of J)await this.manager.libp2p.handle(t,(e,s)=>{if(this.closed||
this.operations.size>=40||!Q(s)){e.abort(a("Encrypted peer inference connection required"));return}const r=this._handle(
e,s,t);this.operations.add(r),r.catch(()=>{}).finally(()=>this.operations.delete(r))},{maxInboundStreams:4,maxOutboundStreams:4,
runOnLimitedConnection:!0});return this.manager.libp2p.addEventListener("peer:disconnect",this.disconnectListener),this}_envelope(t,e,s={}){
return{type:t,scope:this.scope,sender:this.peerId,recipient:e,...s}}_checkEnvelope(t,e){if(!t||t.sender!==e||t.recipient!==
this.peerId||["gameId","roomId","topologyId"].some(s=>t.scope?.[s]!==this.scope[s]))throw a("Peer inference identity or \
scope mismatch")}async _state(t,e=0,s,r){const o=G(await S(r??this.getLocalState({signal:t}),t),this.hostingEnabled,{defaultMaxNewTokens:z.
maxNewTokens});for(const d of o.hostedModels)[...this.inbound.values()].filter(h=>h.manifestCid===d.manifestCid).length>
(d.manifestCid===s?e:0)&&(d.busy=!0,d.idleForMs=0);return this.inbound.size>e&&(o.busy=!0,o.idleForMs=0),o}async getTelemetrySummary({
signal:t=this.controller.signal}={}){if(this.closed||!this.hostingEnabled)return[];if(this.telemetryStatePending)throw new Error(
"Local hosted-model telemetry read is still pending");const e=Promise.resolve().then(()=>this.getLocalState({signal:t}));
this.telemetryStatePending=e;const s=()=>{this.telemetryStatePending===e&&(this.telemetryStatePending=null)};e.then(s,s);
const r=await this._state(t,0,void 0,this.telemetryStatePending);return this.closed||!this.hostingEnabled||t.aborted?[]:
r.hostedModels.map(({manifestCid:o,name:d,task:n,runtime:h,modalities:l,busy:f})=>({manifestCid:o,name:d,task:n,runtime:h,
modalities:l,busy:f}))}setHostingEnabled(t){if(this.hostingEnabled=!!t,!this.hostingEnabled)for(const e of this.inbound.
values())e.controller.abort(a("Peer inference hosting disabled","ERR_INFERENCE_HOST_DISABLED"));this.records.delete(this.
peerId),this._group()}async cancelHostedModel(t){t=fe(t);const e=[...this.inbound.values()].filter(s=>s.manifestCid===t);
for(const s of e)s.controller.abort(a("Hosted model is unloading","ERR_INFERENCE_HOST_DISABLED"));return await Promise.allSettled(
e.map(s=>s.finished)),this.records.delete(this.peerId),this._group(),e.length}_remember(t,e,s=P){this.records.set(t,{state:e,
protocol:s,receivedAt:Date.now()})}_group(){const t=new Map,e=new Map,s=Date.now();for(const[r,o]of this.records){if(s-o.
receivedAt>M.recordTtlMs){this.records.delete(r);continue}const{state:d}=o,n=r===this.peerId;for(const h of d.sharedModels)
t.has(h.manifestCid)?A(o.protocol)&&Object.assign(t.get(h.manifestCid),h):t.set(h.manifestCid,{...h,providers:[]}),t.get(
h.manifestCid).providers.push({peerId:r,local:n});for(const h of d.hostedModels??(d.hostedModel?[{...d.hostedModel,busy:d.
busy,idleForMs:d.idleForMs,queuedRequests:d.queuedRequests}]:[])){const{maxNewTokens:l,busy:f,idleForMs:c,queuedRequests:g,
queueCapacity:E,queueAvailable:p,...i}=h;e.has(i.manifestCid)?A(o.protocol)&&Object.assign(e.get(i.manifestCid),i):e.set(
i.manifestCid,{...i,hosts:[]}),e.get(i.manifestCid).hosts.push({peerId:r,local:n,busy:f,task:i.task,modalities:[...i.modalities],
outputModalities:[...i.outputModalities],idleForMs:f?0:c,queuedRequests:g,queueCapacity:E,queueAvailable:p,maxNewTokens:l,
protocol:o.protocol})}}this.models=[...t.values()],this.hosts=[...e.values()]}listModels(){return this._group(),structuredClone(
this.models)}listHosts(){return this._group(),structuredClone(this.hosts)}_connections(t){return this.manager.libp2p.getConnections().
filter(e=>e.remotePeer.toString()===t&&Q(e)).sort((e,s)=>{const r=o=>(o.encryption==="native"?3:o.remoteAddr?.getComponents?.().
some(({name:d})=>d==="p2p-circuit")?1:2)-((this.failedConnections.get(o)??0)>Date.now()?10:0);return r(s)-r(e)})}async _connection(t,e){
e.throwIfAborted();const s=()=>this._connections(t)[0];let r=s();if(!r&&this.manager.peers?.has(t)){if(this.manager.recoverPeerInferenceConnection){
try{await S(this._recoverConnection(t),e)}catch{e.throwIfAborted(),this.controller.signal.throwIfAborted()}r=s()}r||(await S(
this.manager._maybeDialPeer(t,"peer-inference"),e),r=s())}if(!r)throw a("No authenticated encrypted connection to infere\
nce peer","ERR_INFERENCE_UNREACHABLE");return r}_recoverConnection(t){if(this.recoveries.has(t))return this.recoveries.get(
t);const e=this.manager.recoverPeerInferenceConnection(t,{signal:this.controller.signal});this.recoveries.set(t,e),this.
operations.add(e);const s=()=>{this.operations.delete(e),this.recoveries.get(t)===e&&this.recoveries.delete(t)};return e.
then(s,s),e}async _openStream(t,e,{audio:s=!1,nativeMedia:r=!1,mesh:o=!1,texturedMesh:d=!1,backgroundRecovery:n=!1}={}){
const h=await this._connection(t,e),l=[...new Set([h,...this._connections(t)])].slice(0,4),f=[];let c;const g=async E=>{
if(e.throwIfAborted(),E.remotePeer.toString()!==t||!Q(E))throw a("Invalid recovered inference connection");const p=T([this.
controller.signal,e],Math.min(2e3,this.queryTimeoutMs/2));let i;try{const I=d?P:o?[P,te]:r?[P,te,ae]:s?[P,te,ae,Re]:J;i=
Promise.resolve(E.newStream(I,{signal:p.signal,runOnLimitedConnection:!0}));const v=await S(i,p.signal);p.signal.throwIfAborted();
const y=this.manager.retainPeerInferenceConnection?.(E,{timeoutMs:this.requestTimeoutMs+1e3});return this.failedConnections.
delete(E),{connection:E,stream:v,release:y,protocol:v.protocol??P}}catch(I){const v=D(I);throw i?.then(y=>y.abort(v),()=>{}).
catch(()=>{}),ce(v)&&this.failedConnections.set(E,Date.now()+15e3),f.push(v),v}finally{p.dispose()}};try{for(const E of l)
try{return await g(E)}catch{e.throwIfAborted(),this.controller.signal.throwIfAborted()}}catch(E){throw n&&e.reason?.code===
"ERR_INFERENCE_DEADLINE"&&ne(f)&&!this.controller.signal.aborted&&this.manager.recoverPeerInferenceConnection&&this._recoverConnection(
t).catch(()=>{}),E}if(ne(f)&&this.manager.recoverPeerInferenceConnection)try{const E=await S(this._recoverConnection(t),
e);return e.throwIfAborted(),await g(E)}catch(E){e.throwIfAborted(),this.controller.signal.throwIfAborted(),c=D(E)}throw Object.
assign(new AggregateError(f,`Unable to open an encrypted inference stream: ${String(f.at(-1)?.message??"connections clos\
ed").slice(0,160)}`,{cause:f.at(-1)}),{code:"ERR_INFERENCE_STREAM_UNAVAILABLE",peerId:t,recoveryError:c})}async _closeCompletedStream(t,e){
const s=T([this.controller.signal,e],Math.min(1e3,this.queryTimeoutMs/2));try{await S(Promise.resolve().then(()=>t.close(
{signal:s.signal})),s.signal)}catch(r){try{Promise.resolve(t.abort(D(r))).catch(()=>{})}catch{}this.controller.signal.throwIfAborted(),
e.throwIfAborted()}finally{s.dispose()}this.controller.signal.throwIfAborted(),e.throwIfAborted()}async _query(t,e){const s=T(
[this.controller.signal,e],this.queryTimeoutMs);let r,o;const d=()=>r?.abort(F(s.signal));s.signal.addEventListener("abo\
rt",d,{once:!0});try{let n;({stream:r,protocol:n,release:o}=await this._openStream(t,s.signal,{backgroundRecovery:!0}));
const h=W(r);await h.write(this._envelope("query",t),s.signal);const l=await h.read(s.signal);if(l?.type==="error")throw[
"sender","recipient","scope"].some(f=>Object.hasOwn(l,f))&&this._checkEnvelope(l,t),typeof l.message!="string"||l.code!==
void 0&&typeof l.code!="string"?a("Invalid inference directory error response","ERR_INFERENCE_DIRECTORY_INVALID"):a(l.message.
slice(0,256)||"Peer inference directory unavailable",l.code?.slice(0,80)||"ERR_PEER_INFERENCE");if(this._checkEnvelope(l,
t),l.type!=="directory")throw a("Invalid inference directory response");this._remember(t,G(l.state,!0,{protocol:n}),n),await this.
_closeCompletedStream(r,s.signal)}catch(n){throw this.records.delete(t),r?.abort(n),n}finally{o?.(),s.signal.removeEventListener(
"abort",d),s.dispose()}}async refresh({signal:t}={}){if(this.closed)throw a("Peer inference service is stopped");if(this.
refreshing)return S(this.refreshing,t??this.controller.signal);const e=async()=>{const s=T([this.controller.signal,t],this.
queryTimeoutMs*2+100);try{this._remember(this.peerId,await this._state(s.signal));const r=[...new Set([...this.manager.libp2p.
getConnections().map(d=>d.remotePeer.toString()),...this.manager.peers?.keys()??[]])].filter(d=>d!==this.peerId&&!this.manager.
bootstrapPeerIds?.has(d)).slice(0,this.maximumPeers),o=await Promise.allSettled(r.map(d=>this._query(d,s.signal)));return s.
signal.throwIfAborted(),this.lastErrors=o.flatMap((d,n)=>d.status==="rejected"?[{peerId:r[n],code:String(d.reason?.code??
"ERR_PEER_INFERENCE").slice(0,80),message:String(d.reason?.message??"Directory unavailable").slice(0,256)}]:[]),{models:this.
listModels(),hosts:this.listHosts(),errors:structuredClone(this.lastErrors)}}finally{s.dispose()}};this.refreshing=e(),this.
operations.add(this.refreshing);try{return await this.refreshing}finally{this.operations.delete(this.refreshing),this.refreshing=
null}}async _handle(t,e,s=P){const r=e.remotePeer.toString(),o=T([this.controller.signal],this.requestTimeoutMs),d=()=>t.
abort(F(o.signal));o.signal.addEventListener("abort",d,{once:!0});const n=W(t);let h,l,f,c;const g=new Promise(p=>{c=p});
let E;try{E=this.manager.retainPeerInferenceConnection?.(e,{timeoutMs:this.requestTimeoutMs+1e3});const p=T([o.signal],this.
queryTimeoutMs);try{f=await n.read(p.signal)}finally{p.dispose()}if(this._checkEnvelope(f,r),f.type==="query"){const b=await this.
_state(o.signal);await n.write(this._envelope("directory",r,{state:s!==P?G(b,this.hostingEnabled,{protocol:s}):b}),o.signal),
await this._closeCompletedStream(t,o.signal);return}if(f.type!=="generate")throw a("Unknown inference request");const i=V(
f);if(s===X&&Z(i.task))throw a("Speech requires inference protocol v3");if(!A(s)&&i.task==="audio-text-to-text")throw a(
"Native audio conversation requires inference protocol v4");if(!B(s)&&i.task==="image-to-3d")throw a("Mesh generation re\
quires inference protocol v5 or newer");if(h=`${r}:${i.requestId}`,this.inbound.has(h)||this.inbound.size>=M.maximumInbound||
[...this.inbound.values()].filter(b=>b.peerId===r).length>=M.maximumPerPeer)throw h=null,a("Peer inference queue is full",
"ERR_INFERENCE_BUSY");this.inbound.set(h,{peerId:r,manifestCid:i.manifestCid,controller:o.controller,finished:g});const I=b=>{
const C=s===P?b:G(b,this.hostingEnabled,{protocol:s});return s===X?C.hostedModel?.manifestCid===i.manifestCid?C.hostedModel:
null:C.hostedModels.find(L=>L.manifestCid===i.manifestCid)},v=await this._state(o.signal,1,i.manifestCid),y=I(v);if(!y)throw a(
"Requested model is not hosted","ERR_INFERENCE_NOT_HOSTED");if(i.maxNewTokens>y.maxNewTokens)throw a("Requested token li\
mit exceeds hosted capacity","ERR_INFERENCE_TOKEN_LIMIT");if(!A(s)&&i.task!==void 0&&i.task!==y.task)throw a("Requested \
task does not match hosted model");if(i.task=ee(i,y.task),!Y(y,i))throw a("Requested task or media does not match hosted\
 model");if(y.queueAvailable===!1||y.busy&&y.queuedRequests>=y.queueCapacity)throw a("Hosted model queue is full","ERR_I\
NFERENCE_BUSY");if(V(i),await n.write({type:"upload",requestId:i.requestId},o.signal),i.image){i.image.data=new Uint8Array(
i.image.width*i.image.height*4);let b=0;for(;b<i.image.data.length;){const C=await n.rpc.read({signal:o.signal});if(!C.byteLength||
C.byteLength>M.imageChunkBytes||C.byteLength>i.image.data.length-b)throw a("Invalid image transfer frame");i.image.data.
set(C.subarray(),b),b+=C.byteLength,await n.write({type:"image-credit",offset:b},o.signal)}}i.audio&&(i.audio=await ge(n,
{audio:i.audio,requestId:i.requestId,signal:o.signal}));const k=I(await this._state(o.signal,1,i.manifestCid));if(!k||k.
task!==y.task)throw a("Inference host changed during upload");if(!Y(k,i))throw a("Inference host media capabilities chan\
ged during upload");if(i.maxNewTokens>k.maxNewTokens)throw a("Requested token limit exceeds hosted capacity","ERR_INFERE\
NCE_TOKEN_LIMIT");if(k.queueAvailable===!1||k.busy&&k.queuedRequests>=k.queueCapacity)throw a("Hosted model queue is ful\
l","ERR_INFERENCE_BUSY");await n.write({type:"accepted",requestId:i.requestId,queued:k.busy},o.signal);const x=await n.read(
o.signal);if(x.type!=="start"||x.requestId!==i.requestId)throw a("Missing inference start acknowledgement");const N=pe(n,
i.requestId,o.controller);l=N.task;let R=Promise.resolve(),U=0,u=0,m=0;const _=i.task==="automatic-speech-recognition"?8192:
z.maxOutputBytes,le=b=>{if(o.signal.throwIfAborted(),typeof b!="string")throw a("Invalid host token");if(!b.length)return;
if(U+=O(b),m+=O(b)+128,U>_||m>_+8192||u>=4096){const L=a("Inference token consumer exceeded its bounded output queue");throw o.
controller.abort(L),L}const C={type:"token",requestId:i.requestId,sequence:u++,text:b};R=R.then(()=>n.write(C,o.signal)).
then(()=>{m-=O(b)+128}),R.catch(L=>o.controller.abort(L))};let he=0;const ue=b=>{if(!["diffusion-progress","mesh-generat\
ion"].includes(b?.type))return;o.signal.throwIfAborted();const C=b.type==="mesh-generation";if(i.task!==(C?"image-to-3d":
"text-to-image")||++he>32||C&&!B(s))throw a("Invalid generation progress");const L=C?se(b):re(b);R=R.then(()=>n.write({type:"\
progress",requestId:i.requestId,progress:L},o.signal)),R.catch(me=>o.controller.abort(me))},q=await S(this.generateLocal(
{...i,requestId:`remote-${crypto.randomUUID()}`,signal:o.signal,onToken:le,onProgress:ue}),o.signal);if(await R,o.signal.
throwIfAborted(),!!q?.image!=(i.task==="text-to-image")||!!q?.audio!=(i.task==="text-to-speech")||!!q?.mesh!=(i.task==="\
image-to-3d"))throw a("Inference output does not match hosted task");const H=q.mesh?de(q.mesh,{allowTextures:s===P}):null,
j=oe({...q,...q.image?{image:Ee(q.image)}:{},...H?{mesh:$(H)}:{},...q.audio?{audio:we(q.audio,q.sampleRate)}:{}});if(O(j.
text)>_)throw a("Inference output exceeds its task byte budget");q.image&&await be(n,{image:q.image,metadata:j.image,requestId:i.
requestId,controls:N,signal:o.signal}),q.audio&&await ye(n,{samples:q.audio,metadata:j.audio,requestId:i.requestId,controls:N,
signal:o.signal}),H&&await ke(n,{mesh:H,requestId:i.requestId,controls:N,signal:o.signal}),await n.write({type:"done",requestId:i.
requestId,result:j},o.signal),await this._closeCompletedStream(t,o.signal)}catch(p){const i=D(p);if(o.signal.aborted)t.abort(
i);else{const I={code:String(i.code??"ERR_PEER_INFERENCE").slice(0,80),message:String(i.message??"Peer inference failed").
slice(0,256)};try{await n.write(f?.type==="query"?this._envelope("error",r,I):{type:"error",...I},o.signal),await t.close(
{signal:o.signal})}catch{t.abort(i)}}}finally{h&&this.inbound.delete(h),o.signal.removeEventListener("abort",d),o.controller.
abort(new Error("Inference stream finished")),o.dispose(),await l?.catch(()=>{}),E?.(),c()}}async generate(t,e={}){if(this.
closed)throw a("Peer inference service is stopped");const s=V({...e,...e.task===void 0&&(e.image!=null||e.audio!=null)?{
task:ee(e)}:{},requestId:e.requestId??crypto.randomUUID(),manifestCid:t},{imageBytes:!0});if(this.outbound.has(s.requestId)||
this.outbound.size>=M.maximumOutbound)throw a("Outgoing inference queue is full");const r=T([this.controller.signal,e.signal],
this.requestTimeoutMs),o={controller:r.controller,peerId:null};this.outbound.set(s.requestId,o);const n=(async()=>{let h=this.
listHosts().find(c=>c.manifestCid===s.manifestCid)?.hosts.filter(c=>!c.local)??[];h.length||(await this.refresh({signal:r.
signal}),h=this.listHosts().find(c=>c.manifestCid===s.manifestCid)?.hosts.filter(c=>!c.local)??[]);const l=this.listHosts().
find(c=>c.manifestCid===s.manifestCid);if(l){if(s.task=ee(s,l.task),!Y(l,s))throw a("Requested task or media does not ma\
tch discovered model");V(s)}h=h.filter(c=>c.queueAvailable!==!1&&(!c.busy||(c.queuedRequests??0)<(c.queueCapacity??z.maxQueued))&&
Y({...l,...c},s)&&(!Z(s.task)||c.protocol!==X)&&(s.task!=="audio-text-to-text"||A(c.protocol))&&(s.task!=="image-to-3d"||
B(c.protocol))&&(!ie(l)||c.protocol===P)&&(!(s.task==="image-text-to-text"&&c.task!=="image-text-to-text")||A(c.protocol))),
h.sort((c,g)=>Number(c.busy)-Number(g.busy)||(c.queuedRequests??0)-(g.queuedRequests??0)||(c.busy?0:g.idleForMs-c.idleForMs)||
c.peerId.localeCompare(g.peerId));let f=a("No remote peer hosts the requested model","ERR_INFERENCE_NOT_HOSTED");for(const c of h){
r.signal.throwIfAborted(),o.peerId=c.peerId;const g={target:`peer:${s.manifestCid}`,manifestCid:s.manifestCid,modelName:l?.
name,local:!1,task:s.task,peerId:c.peerId};e.onProgress?.({type:"routing",requestId:s.requestId,...g,route:g,busy:c.busy});
const E={...s,...s.maxNewTokens===void 0?{}:{maxNewTokens:Math.min(s.maxNewTokens,c.maxNewTokens??_e)}};try{return await this.
_generateAt(c.peerId,E,e,r.signal,c.task??l.task,l.runtime)}catch(p){if(f=p,p.committed||r.signal.aborted)throw p}}throw f})();
this.operations.add(n);try{return await n}finally{this.operations.delete(n),this.outbound.delete(s.requestId),r.dispose()}}async _generateAt(t,e,s,r,o=e.
task,d){let n,h,l=!1;const f=()=>n?.abort(F(r));r.addEventListener("abort",f,{once:!0});try{const c=e.task==="audio-text\
-to-text"||e.task==="image-text-to-text"&&o!=="image-text-to-text",g=await this._openStream(t,r,{audio:Z(e.task),nativeMedia:c,
mesh:e.task==="image-to-3d",texturedMesh:ie({runtime:d})}),{connection:E}=g;n=g.stream,h=g.release;const p=W(n),i={...e,
task:A(g.protocol)?e.task:o,image:e.image?{width:e.image.width,height:e.image.height,channels:4}:void 0,audio:e.audio?Object.
fromEntries(Object.entries(e.audio).filter(([u])=>u!=="samples")):void 0};await p.write(this._envelope("generate",t,i),r);
const I=await p.read(r);if(I.type==="error")throw a(String(I.message).slice(0,256),I.code);if(I.type!=="upload"||I.requestId!==
e.requestId)throw a("Invalid inference upload acknowledgement");if(e.image)for(let u=0;u<e.image.data.length;){const m=Math.
min(u+M.imageChunkBytes,e.image.data.length);await p.rpc.write(e.image.data.subarray(u,m),{signal:r});const _=await p.read(
r);if(_.type!=="image-credit"||_.offset!==m)throw a("Invalid image transfer credit");u=m}e.audio&&await Ie(p,{samples:e.
audio.samples,requestId:e.requestId,signal:r});let v=0,y=0,k=!1,x,N,R,U=0;for(;;){const u=await p.read(r);if(u.type==="e\
rror")throw a(String(u.message).slice(0,256),u.code);if(u.requestId!==e.requestId)throw a("Inference response ID mismatc\
h");if(u.type==="accepted"&&!k){l=!0,await p.write({type:"start",requestId:e.requestId},r);const m={target:`peer:${e.manifestCid}`,
manifestCid:e.manifestCid,local:!1,task:e.task,peerId:t};k=!0,s.onProgress?.({type:"accepted",requestId:e.requestId,...m,
route:m,queued:!!u.queued});continue}if(!k)throw a("Inference output preceded admission");if(u.type==="token"){if(u.sequence!==
v++||v>4096||typeof u.text!="string")throw a("Invalid token sequence");if(y+=O(u.text),y>(e.task==="automatic-speech-rec\
ognition"?8192:z.maxOutputBytes))throw a("Inference output exceeds its byte budget");await S(s.onToken?.(u.text,{...u,peerId:t}),
r)}else if(u.type==="progress"){const m=u.progress?.type==="mesh-generation";if(e.task!==(m?"image-to-3d":"text-to-image")||
++U>32||m&&!B(g.protocol))throw a("Invalid generation progress");const _=m?se(u.progress):re(u.progress);await S(s.onProgress?.(
{..._,requestId:e.requestId,peerId:t}),r)}else if(u.type==="result-image"){if(e.task!=="text-to-image"||x)throw a("Unexp\
ected generated image");x=await qe(p,{image:u.image,requestId:e.requestId,signal:r})}else if(u.type==="result-audio"){if(e.
task!=="text-to-speech"||N)throw a("Unexpected generated audio");N=await Ce(p,{audio:u.audio,requestId:e.requestId,signal:r})}else if(u.
type==="result-mesh"){if(e.task!=="image-to-3d"||R||!B(g.protocol))throw a("Unexpected generated mesh");R=await Ne(p,{mesh:u.
mesh,requestId:e.requestId,signal:r,allowTextures:g.protocol===P})}else if(u.type==="done"){const m=oe(u.result);if(e.task===
"automatic-speech-recognition"&&O(m.text)>8192)throw a("Speech transcript exceeds its byte budget");if(!!m.image!=(e.task===
"text-to-image")||!!m.image!=!!x||!!m.audio!=(e.task==="text-to-speech")||!!m.audio!=!!N||!!m.mesh!=(e.task==="image-to-\
3d")||!!m.mesh!=!!R)throw a("Inference output does not match requested task");if(x){if(["width","height","channels","sha\
256"].some(_=>x[_]!==m.image[_]))throw a("Generated image metadata changed during transfer");m.image=x}if(N){if(Object.keys(
N.metadata).some(_=>N.metadata[_]!==m.audio[_]))throw a("Generated audio metadata changed during transfer");m.audio=N.audio,
m.sampleRate=N.sampleRate}if(R){if(JSON.stringify($(R))!==JSON.stringify(m.mesh))throw a("Generated mesh metadata change\
d during transfer");m.mesh=R}return await this._closeCompletedStream(n,r),{...m,requestId:e.requestId,peerId:t,manifestCid:e.
manifestCid,protocol:g.protocol,connectionEncryption:E.encryption,connectionAddress:E.remoteAddr?.toString()}}else throw a(
"Unknown inference output frame")}}catch(c){const g=D(c);throw n?.abort(g),g.committed=l,l&&(g.remoteCleanupAcknowledged=
!1),g}finally{h?.(),r.removeEventListener("abort",f)}}cancel(t){const e=this.outbound.get(t);return e?(e.controller.abort(
a("Caller cancelled peer inference","ERR_INFERENCE_CANCELLED")),!0):!1}async stop(){return this.stopping?this.stopping:(this.
closed=!0,this.controller.abort(a("Peer inference service stopped","ERR_INFERENCE_STOPPED")),this.stopping=(async()=>{try{
await this.manager.libp2p.unhandle(J)}finally{this.manager.libp2p.removeEventListener("peer:disconnect",this.disconnectListener),
await Promise.allSettled([...this.operations]),this.records.clear(),this.models=[],this.hosts=[],this.getLocalState=null,
this.generateLocal=null}this.requiresCleanup=!1})().catch(t=>{throw this.stopping=null,this.requiresCleanup=!0,t}),this.
stopping)}}export{Me as PeerInferenceService};
