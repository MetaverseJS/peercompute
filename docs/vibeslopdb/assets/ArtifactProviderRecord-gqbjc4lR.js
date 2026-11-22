import{p as k,b as _,d as P,e as v,K as C,l as A,m as N}from"./carnageWindow--1fjkU2y.js";import"./preload-helper-FD8EeCEm.js";
const y="/peercompute/artifact-provider/1.0.0",m=16384,E=6e4,u=new TextEncoder,b=new TextDecoder("utf-8",{fatal:!0}),g=i=>Array.
from(i,t=>t.toString(16).padStart(2,"0")).join(""),w=(i,t)=>{if(typeof i!="string"||!/^(?:[0-9a-f]{2})+$/u.test(i)||i.length>
t*2)throw new Error("Invalid provider proof encoding");return Uint8Array.from(i.match(/../gu),r=>Number.parseInt(r,16))},
l=(i,t=128)=>{if(typeof i!="string"||!i.length||i.length>t)throw new Error("Invalid provider record field");return i},f=i=>_.
parse(l(i,128)).toV1().toString(),O=()=>g(crypto.getRandomValues(new Uint8Array(32)));function x(i){if(!i||typeof i!="ob\
ject"||i.schema!=="peercompute.artifact-provider.v1")throw new Error("Invalid provider schema");if(!["query","provider"].
includes(i.kind))throw new Error("Invalid provider record kind");const t=l(i.artifactPeerId);if(!Array.isArray(i.addresses)||
i.addresses.length>8)throw new Error("Too many provider addresses");const r=[...new Set(i.addresses.map(e=>{if(l(e,1024),
N(e).getComponents().filter(o=>o.name==="p2p").at(-1)?.value!==t)throw new Error("Provider address does not bind artifac\
t identity");return e}))].sort();if(!/^[0-9a-f]{64}$/u.test(i.nonce))throw new Error("Invalid provider nonce");if(!Number.
isSafeInteger(i.issuedAt)||!Number.isSafeInteger(i.expiresAt))throw new Error("Invalid provider expiry");if(typeof i.available!=
"boolean")throw new Error("Invalid provider availability");return{schema:i.schema,kind:i.kind,gameId:l(i.gameId),roomId:l(
i.roomId),topologyId:l(i.topologyId),appPeerId:l(i.appPeerId),artifactPeerId:t,recipientPeerId:l(i.recipientPeerId),cid:f(
i.cid),nonce:i.nonce,issuedAt:i.issuedAt,expiresAt:i.expiresAt,addresses:r,available:i.available}}async function M(i,{applicationKey:t,
signArtifact:r}){const e=x(i),a=u.encode(JSON.stringify(e)),o=await r(a),c={body:e,applicationPublicKey:g(k(t.publicKey)),
artifactPublicKey:g(o.publicKey),applicationSignature:g(await t.sign(a)),artifactSignature:g(o.signature)};if(u.encode(JSON.
stringify(c)).length>m)throw new Error("Provider record exceeds byte limit");return c}class T{constructor({maximumEntries:t=1024}={}){
this.entries=new Map,this.maximumEntries=t}accept(t,r){for(const[a,o]of this.entries)o<=r&&this.entries.delete(a);const e=`${t.
appPeerId}:${t.kind}:${t.nonce}`;if(this.entries.has(e))throw new Error("Replayed artifact provider record");if(this.entries.
size>=this.maximumEntries)throw new Error("Artifact replay window is full");this.entries.set(e,t.expiresAt)}}async function S(i,{
scope:t,expectedPeerId:r,recipientPeerId:e,kind:a,cid:o,nonce:c,now:d=Date.now(),replayWindow:n}){if(!i||u.encode(JSON.stringify(
i)).length>m)throw new Error("Provider record exceeds byte limit");const s=x(i.body);if(s.kind!==a||s.appPeerId!==r||s.recipientPeerId!==
e)throw new Error("Provider identity or recipient mismatch");if(s.gameId!==t.gameId||s.roomId!==t.roomId||s.topologyId!==
t.topologyId)throw new Error("Artifact provider scope mismatch");if(o!==void 0&&s.cid!==f(o)||c!==void 0&&s.nonce!==c)throw new Error(
"Artifact provider challenge mismatch");if(s.expiresAt<=d||s.issuedAt>d+5e3||s.expiresAt<=s.issuedAt||s.expiresAt-s.issuedAt>
E)throw new Error("Expired or invalid artifact provider lifetime");const p=P(w(i.applicationPublicKey,128)),h=P(w(i.artifactPublicKey,
128));if(p.type!=="Ed25519"||h.type!=="Ed25519"||v(p).toString()!==s.appPeerId||v(h).toString()!==s.artifactPeerId)throw new Error(
"Artifact provider public key mismatch");const I=u.encode(JSON.stringify(s));if(!await p.verify(I,w(i.applicationSignature,
128))||!await h.verify(I,w(i.artifactSignature,128)))throw new Error("Invalid artifact provider signature");return n?.accept(
s,d),s}class K{constructor(t,r,e,{maximumPublicArtifacts:a=128,maximumPublicBlocks:o,maximumQueryPeers:c=8,queryTimeoutMs:d=5e3}={}){
if(o!==void 0&&(!Number.isSafeInteger(o)||o<1||o>131072))throw new RangeError("maximumPublicBlocks must be between 1 and\
 131072");this.manager=t,this.transport=r,this.store=e,this.configuredMaximumPublicBlocks=o,this.maximumPublicArtifacts=
Math.min(128,Math.max(1,a)),this.maximumQueryPeers=Math.min(8,Math.max(1,c)),this.queryTimeoutMs=Math.min(15e3,Math.max(
250,d)),this.publicArtifacts=new Set,this.providers=new Map,this.bindings=new Map,this.replayWindow=new T,this.controller=
new AbortController,this.operations=new Set,this.catalogUpdates=Promise.resolve(),this.closed=!1,this.lastErrors=[],this.
expiryTimer=null,this.queryCursors=new Map,this.disconnectListener=n=>this._forgetPeer(n.detail.toString())}get scope(){
return{gameId:this.manager.config.gameId,roomId:this.manager.config.roomId,topologyId:this.manager.config.topologyId}}get indexKey(){
return new C(`/peercompute/artifact-public/${encodeURIComponent(JSON.stringify(this.scope))}`)}get maximumPublicBlocks(){
const t=this.store.maximumTraversalBlocks??65536;if(!Number.isSafeInteger(t)||t<1)throw new RangeError("Invalid artifact\
 store traversal limit");return Math.min(131072,t,this.configuredMaximumPublicBlocks??t)}async start(){let t=[];try{t=JSON.
parse(b.decode(await this.store.getDatastore().get(this.indexKey)))}catch(a){if(a.name!=="NotFoundError")throw a}if(!Array.
isArray(t)||t.length>this.maximumPublicArtifacts)throw new Error("Invalid persisted public artifact catalog");let r=new Set;
const e=new Set;for(const a of t){const o=f(a);if((await this.store.stat(o))?.status==="complete")try{r=await this._publicBlocksFor(
[o],r),e.add(o)}catch{}}return this.publicArtifacts=e,this.transport.setPublicBlockCids(r),await this.manager.libp2p.handle(
y,(a,o)=>{if(this.closed||this.operations.size>=32){a.abort(new Error("Artifact discovery is busy"));return}const c=this.
_handle(a,o);this.operations.add(c),c.catch(()=>{}).finally(()=>this.operations.delete(c))},{maxInboundStreams:4,maxOutboundStreams:4,
runOnLimitedConnection:!0}),this.manager.libp2p.addEventListener("peer:disconnect",this.disconnectListener),this.expiryTimer=
setInterval(()=>{for(const[a,o]of this.bindings)o.expiresAt<=Date.now()&&this._forgetPeer(a)},1e3),this.expiryTimer.unref?.(),
this}_updateCatalog(t){if(this.closed)return Promise.reject(new Error("Artifact discovery is stopped"));const r=this.catalogUpdates.
then(t);return this.catalogUpdates=r.catch(()=>{}),this.operations.add(r),r.finally(()=>this.operations.delete(r)).catch(
()=>{}),r}announce(t){return this._updateCatalog(()=>this._announce(t))}async _announce(t){if(t=f(String(t)),(await this.
store.stat(t))?.status!=="complete")throw new Error("Only verified complete artifacts may be announced");if(!this.publicArtifacts.
has(t)&&this.publicArtifacts.size>=this.maximumPublicArtifacts)throw new Error("Public artifact catalog is full");await this.
store.pin(t,{signal:this.controller.signal});const r=new Set([...this.publicArtifacts,t]),e=await this._publicBlocksFor(
r);return await this.store.getDatastore().put(this.indexKey,u.encode(JSON.stringify([...r].sort())),{signal:this.controller.
signal}),this.publicArtifacts=r,this.transport.setPublicBlockCids(e),{cid:t,public:!0,scope:this.scope}}withdraw(t){return this.
_updateCatalog(async()=>(t=f(String(t)),this.publicArtifacts.delete(t),this.transport.setPublicBlockCids([]),await this.
store.getDatastore().put(this.indexKey,u.encode(JSON.stringify([...this.publicArtifacts].sort())),{signal:this.controller.
signal}),this.transport.setPublicBlockCids(await this._publicBlocksFor(this.publicArtifacts)),{cid:t,public:!1,scope:this.
scope}))}async _publicBlocksFor(t,r=[]){const e=new Set(r);if(e.size>this.maximumPublicBlocks)throw new Error("Public ar\
tifact block catalog is full");for(const a of t)for await(const o of this.store.listBlockCids(a,{signal:this.controller.
signal}))if(e.add(f(o)),e.size>this.maximumPublicBlocks)throw new Error("Public artifact block catalog is full");return e}_bind(t){
if(!this.bindings.has(t.appPeerId)&&this.bindings.size>=128)throw new Error("Artifact identity binding catalog is full");
const r=this.bindings.get(t.appPeerId);r&&r.artifactPeerId!==t.artifactPeerId&&this.transport.revokePeer(r.artifactPeerId).
catch(()=>{}),this.bindings.set(t.appPeerId,t),this.transport.authorizePeer(t.artifactPeerId)}async _record(t,{recipientPeerId:r,
cid:e,nonce:a,available:o=!1}){const c=this.transport.getPeerInfo(),d=Date.now();return M({schema:"peercompute.artifact-\
provider.v1",kind:t,...this.scope,appPeerId:this.manager.libp2p.peerId.toString(),artifactPeerId:c.peerId,recipientPeerId:r,
cid:e,nonce:a,issuedAt:d,expiresAt:d+E,addresses:c.addresses.slice(0,8),available:o},{applicationKey:this.manager._applicationPrivateKey,
signArtifact:n=>this.transport.signProviderRecord(n)})}_signal(t){return AbortSignal.any([this.controller.signal,AbortSignal.
timeout(this.queryTimeoutMs),...t?[t]:[]])}async _handle(t,r){const e=this._signal(),a=()=>t.abort(e.reason);e.addEventListener(
"abort",a,{once:!0});try{const o=A(t,{maxDataLength:m,maxBufferSize:m+16}),c=JSON.parse(b.decode((await o.read({signal:e})).
subarray())),d=await S(c,{scope:this.scope,kind:"query",expectedPeerId:r.remotePeer.toString(),recipientPeerId:this.manager.
libp2p.peerId.toString(),replayWindow:this.replayWindow});this._bind(d);const n=this.publicArtifacts.has(d.cid)&&(await this.
store.stat(d.cid,{signal:e}))?.status==="complete",s=await this._record("provider",{recipientPeerId:d.appPeerId,cid:d.cid,
nonce:d.nonce,available:n});await o.write(u.encode(JSON.stringify(s)),{signal:e}),await t.close({signal:e})}catch(o){throw this.
lastInboundError=o.message,t.abort(o),o}finally{e.removeEventListener("abort",a)}}_remember(t){this.providers.has(t.cid)||
(this.providers.size>=128&&this.providers.delete(this.providers.keys().next().value),this.providers.set(t.cid,new Map));
const r=this.providers.get(t.cid);t.available?r.set(t.appPeerId,t):r.delete(t.appPeerId)}async _query(t,r,e){e=this._signal(
e);const a=O(),o=t.remotePeer.toString(),c=await t.newStream(y,{signal:e,runOnLimitedConnection:!0}),d=()=>c.abort(e.reason);
e.addEventListener("abort",d,{once:!0});try{const n=A(c,{maxDataLength:m,maxBufferSize:m+16}),s=await this._record("quer\
y",{recipientPeerId:o,cid:r,nonce:a});await n.write(u.encode(JSON.stringify(s)),{signal:e});const p=JSON.parse(b.decode(
(await n.read({signal:e})).subarray())),h=await S(p,{scope:this.scope,kind:"provider",expectedPeerId:o,recipientPeerId:this.
manager.libp2p.peerId.toString(),cid:r,nonce:a,replayWindow:this.replayWindow});return this._remember(h),h.available&&this.
_bind(h),await c.close({signal:e}),h.available?h:null}catch(n){throw c.abort(n),n}finally{e.removeEventListener("abort",
d)}}async find(t,{signal:r}={}){if(this.closed)throw new Error("Artifact discovery is stopped");t=f(String(t));const e=[
...new Map(this.manager.libp2p.getConnections().filter(s=>s.status==="open").map(s=>[s.remotePeer.toString(),s])).values()];
if(this.operations.size>=32)throw new Error("Artifact discovery is busy");const a=Math.min(e.length,this.maximumQueryPeers),
o=e.length?(this.queryCursors.get(t)??0)%e.length:0,c=Array.from({length:a},(s,p)=>e[(o+p)%e.length]);this.queryCursors.
delete(t),this.queryCursors.size>=128&&this.queryCursors.delete(this.queryCursors.keys().next().value),this.queryCursors.
set(t,e.length?(o+a)%e.length:0);const d=Promise.allSettled(c.map(s=>this._query(s,t,r)));this.operations.add(d);try{const s=await d;
this.lastErrors=s.flatMap((p,h)=>p.status==="rejected"?[{peerId:c[h].remotePeer.toString(),message:p.reason?.message||String(
p.reason)}]:[])}finally{this.operations.delete(d)}r?.throwIfAborted(),this.controller.signal.throwIfAborted();const n=new Set(
e.map(s=>s.remotePeer.toString()));return[...this.providers.get(t)?.values()||[]].filter(s=>s.expiresAt>Date.now()&&n.has(
s.appPeerId)&&s.gameId===this.scope.gameId&&s.roomId===this.scope.roomId&&s.topologyId===this.scope.topologyId).map(s=>structuredClone(
s))}async fetchBlock(t,{artifactCid:r,signal:e}={}){if(this.closed)throw new Error("Artifact discovery is stopped");e=AbortSignal.
any([this.controller.signal,...e?[e]:[]]),e.throwIfAborted();const a=this.providers.get(f(String(r||t))),o=new Set(this.
manager.libp2p.getConnections().map(n=>n.remotePeer.toString()));let c=[...a?.values()||[]].filter(n=>n.expiresAt>Date.now()+
5e3&&o.has(n.appPeerId)&&n.gameId===this.scope.gameId&&n.roomId===this.scope.roomId&&n.topologyId===this.scope.topologyId);
if(c.some(n=>n.addresses.length||this.transport.hasUsableConnection(n.artifactPeerId))||(c=await this.find(r||t,{signal:e})),
!c.length)throw new Error(`No authenticated provider for artifact ${r||t}`);c.sort((n,s)=>Number(this.transport.hasUsableConnection(
s.artifactPeerId))-Number(this.transport.hasUsableConnection(n.artifactPeerId)));let d;for(const n of c)try{if(e.throwIfAborted(),
!this.transport.hasUsableConnection(n.artifactPeerId)){const s=[...n.addresses].sort((p,h)=>Number(h.includes("/webrtc/"))-
Number(p.includes("/webrtc/")));if(await this.transport.dial(s,{signal:e}),!this.transport.hasUsableConnection(n.artifactPeerId))
throw new Error("No usable IPFS connection to the artifact provider")}return await this.transport.fetchBlock(t,{signal:e})}catch(s){
e.throwIfAborted(),d=s}throw d}_forgetPeer(t){const r=this.bindings.get(t);r&&this.transport.revokePeer(r.artifactPeerId).
catch(()=>{}),this.bindings.delete(t);for(const e of this.providers.values()){const a=e.get(t);a&&this.transport.revokePeer(
a.artifactPeerId).catch(()=>{}),e.delete(t)}}async stop(){this.closed||(this.closed=!0,clearInterval(this.expiryTimer),this.
controller.abort(new Error("Artifact discovery stopped")),this.manager.libp2p.removeEventListener("peer:disconnect",this.
disconnectListener),await this.manager.libp2p.unhandle(y),await Promise.allSettled([...this.operations]),this.providers.
clear(),this.queryCursors.clear())}}export{m as ARTIFACT_PROVIDER_MAX_BYTES,y as ARTIFACT_PROVIDER_PROTOCOL,E as ARTIFACT_PROVIDER_TTL_MS,K as ArtifactProviderDiscovery,
T as ArtifactReplayWindow,O as artifactChallenge,M as signArtifactProviderRecord,S as verifyArtifactProviderRecord};
