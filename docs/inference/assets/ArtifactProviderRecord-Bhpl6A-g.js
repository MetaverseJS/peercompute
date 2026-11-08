import{I as k,S as P,G as v,H as _}from"./NetworkManager-DVeZM72H.js";import{av as O,K as C,ac as A}from"./main-D_MqBdVR.js";
import"./index-BjYfy4rE.js";const y="/peercompute/artifact-provider/1.0.0",u=16384,E=6e4,f=new TextEncoder,b=new TextDecoder(
"utf-8",{fatal:!0}),g=i=>Array.from(i,t=>t.toString(16).padStart(2,"0")).join(""),w=(i,t)=>{if(typeof i!="string"||!/^(?:[0-9a-f]{2})+$/u.
test(i)||i.length>t*2)throw new Error("Invalid provider proof encoding");return Uint8Array.from(i.match(/../gu),r=>Number.
parseInt(r,16))},h=(i,t=128)=>{if(typeof i!="string"||!i.length||i.length>t)throw new Error("Invalid provider record fie\
ld");return i},l=i=>O.parse(h(i,128)).toV1().toString(),N=()=>g(crypto.getRandomValues(new Uint8Array(32)));function x(i){
if(!i||typeof i!="object"||i.schema!=="peercompute.artifact-provider.v1")throw new Error("Invalid provider schema");if(![
"query","provider"].includes(i.kind))throw new Error("Invalid provider record kind");const t=h(i.artifactPeerId);if(!Array.
isArray(i.addresses)||i.addresses.length>8)throw new Error("Too many provider addresses");const r=[...new Set(i.addresses.
map(e=>{if(h(e,1024),_(e).getComponents().filter(o=>o.name==="p2p").at(-1)?.value!==t)throw new Error("Provider address \
does not bind artifact identity");return e}))].sort();if(!/^[0-9a-f]{64}$/u.test(i.nonce))throw new Error("Invalid provi\
der nonce");if(!Number.isSafeInteger(i.issuedAt)||!Number.isSafeInteger(i.expiresAt))throw new Error("Invalid provider e\
xpiry");if(typeof i.available!="boolean")throw new Error("Invalid provider availability");return{schema:i.schema,kind:i.
kind,gameId:h(i.gameId),roomId:h(i.roomId),topologyId:h(i.topologyId),appPeerId:h(i.appPeerId),artifactPeerId:t,recipientPeerId:h(
i.recipientPeerId),cid:l(i.cid),nonce:i.nonce,issuedAt:i.issuedAt,expiresAt:i.expiresAt,addresses:r,available:i.available}}
async function T(i,{applicationKey:t,signArtifact:r}){const e=x(i),a=f.encode(JSON.stringify(e)),o=await r(a),s={body:e,
applicationPublicKey:g(k(t.publicKey)),artifactPublicKey:g(o.publicKey),applicationSignature:g(await t.sign(a)),artifactSignature:g(
o.signature)};if(f.encode(JSON.stringify(s)).length>u)throw new Error("Provider record exceeds byte limit");return s}class M{constructor({
maximumEntries:t=1024}={}){this.entries=new Map,this.maximumEntries=t}accept(t,r){for(const[a,o]of this.entries)o<=r&&this.
entries.delete(a);const e=`${t.appPeerId}:${t.kind}:${t.nonce}`;if(this.entries.has(e))throw new Error("Replayed artifac\
t provider record");if(this.entries.size>=this.maximumEntries)throw new Error("Artifact replay window is full");this.entries.
set(e,t.expiresAt)}}async function S(i,{scope:t,expectedPeerId:r,recipientPeerId:e,kind:a,cid:o,nonce:s,now:n=Date.now(),
replayWindow:d}){if(!i||f.encode(JSON.stringify(i)).length>u)throw new Error("Provider record exceeds byte limit");const c=x(
i.body);if(c.kind!==a||c.appPeerId!==r||c.recipientPeerId!==e)throw new Error("Provider identity or recipient mismatch");
if(c.gameId!==t.gameId||c.roomId!==t.roomId||c.topologyId!==t.topologyId)throw new Error("Artifact provider scope mismat\
ch");if(o!==void 0&&c.cid!==l(o)||s!==void 0&&c.nonce!==s)throw new Error("Artifact provider challenge mismatch");if(c.expiresAt<=
n||c.issuedAt>n+5e3||c.expiresAt<=c.issuedAt||c.expiresAt-c.issuedAt>E)throw new Error("Expired or invalid artifact prov\
ider lifetime");const m=P(w(i.applicationPublicKey,128)),p=P(w(i.artifactPublicKey,128));if(m.type!=="Ed25519"||p.type!==
"Ed25519"||v(m).toString()!==c.appPeerId||v(p).toString()!==c.artifactPeerId)throw new Error("Artifact provider public k\
ey mismatch");const I=f.encode(JSON.stringify(c));if(!await m.verify(I,w(i.applicationSignature,128))||!await p.verify(I,
w(i.artifactSignature,128)))throw new Error("Invalid artifact provider signature");return d?.accept(c,n),c}class D{constructor(t,r,e,{
maximumPublicArtifacts:a=128,maximumPublicBlocks:o,maximumQueryPeers:s=8,queryTimeoutMs:n=5e3}={}){if(o!==void 0&&(!Number.
isSafeInteger(o)||o<1||o>131072))throw new RangeError("maximumPublicBlocks must be between 1 and 131072");this.manager=t,
this.transport=r,this.store=e,this.configuredMaximumPublicBlocks=o,this.maximumPublicArtifacts=Math.min(128,Math.max(1,a)),
this.maximumQueryPeers=Math.min(8,Math.max(1,s)),this.queryTimeoutMs=Math.min(15e3,Math.max(250,n)),this.publicArtifacts=
new Set,this.providers=new Map,this.bindings=new Map,this.replayWindow=new M,this.controller=new AbortController,this.operations=
new Set,this.catalogUpdates=Promise.resolve(),this.closed=!1,this.lastErrors=[],this.expiryTimer=null,this.disconnectListener=
d=>this._forgetPeer(d.detail.toString())}get scope(){return{gameId:this.manager.config.gameId,roomId:this.manager.config.
roomId,topologyId:this.manager.config.topologyId}}get indexKey(){return new C(`/peercompute/artifact-public/${encodeURIComponent(
JSON.stringify(this.scope))}`)}get maximumPublicBlocks(){const t=this.store.maximumTraversalBlocks??65536;if(!Number.isSafeInteger(
t)||t<1)throw new RangeError("Invalid artifact store traversal limit");return Math.min(131072,t,this.configuredMaximumPublicBlocks??
t)}async start(){let t=[];try{t=JSON.parse(b.decode(await this.store.getDatastore().get(this.indexKey)))}catch(a){if(a.name!==
"NotFoundError")throw a}if(!Array.isArray(t)||t.length>this.maximumPublicArtifacts)throw new Error("Invalid persisted pu\
blic artifact catalog");let r=new Set;const e=new Set;for(const a of t){const o=l(a);if((await this.store.stat(o))?.status===
"complete")try{r=await this._publicBlocksFor([o],r),e.add(o)}catch{}}return this.publicArtifacts=e,this.transport.setPublicBlockCids(
r),await this.manager.libp2p.handle(y,(a,o)=>{if(this.closed||this.operations.size>=32){a.abort(new Error("Artifact disc\
overy is busy"));return}const s=this._handle(a,o);this.operations.add(s),s.catch(()=>{}).finally(()=>this.operations.delete(
s))},{maxInboundStreams:4,maxOutboundStreams:4,runOnLimitedConnection:!0}),this.manager.libp2p.addEventListener("peer:di\
sconnect",this.disconnectListener),this.expiryTimer=setInterval(()=>{for(const[a,o]of this.bindings)o.expiresAt<=Date.now()&&
this._forgetPeer(a)},1e3),this.expiryTimer.unref?.(),this}_updateCatalog(t){if(this.closed)return Promise.reject(new Error(
"Artifact discovery is stopped"));const r=this.catalogUpdates.then(t);return this.catalogUpdates=r.catch(()=>{}),this.operations.
add(r),r.finally(()=>this.operations.delete(r)).catch(()=>{}),r}announce(t){return this._updateCatalog(()=>this._announce(
t))}async _announce(t){if(t=l(String(t)),(await this.store.stat(t))?.status!=="complete")throw new Error("Only verified \
complete artifacts may be announced");if(!this.publicArtifacts.has(t)&&this.publicArtifacts.size>=this.maximumPublicArtifacts)
throw new Error("Public artifact catalog is full");await this.store.pin(t,{signal:this.controller.signal});const r=new Set(
[...this.publicArtifacts,t]),e=await this._publicBlocksFor(r);return await this.store.getDatastore().put(this.indexKey,f.
encode(JSON.stringify([...r].sort())),{signal:this.controller.signal}),this.publicArtifacts=r,this.transport.setPublicBlockCids(
e),{cid:t,public:!0,scope:this.scope}}withdraw(t){return this._updateCatalog(async()=>(t=l(String(t)),this.publicArtifacts.
delete(t),this.transport.setPublicBlockCids([]),await this.store.getDatastore().put(this.indexKey,f.encode(JSON.stringify(
[...this.publicArtifacts].sort())),{signal:this.controller.signal}),this.transport.setPublicBlockCids(await this._publicBlocksFor(
this.publicArtifacts)),{cid:t,public:!1,scope:this.scope}))}async _publicBlocksFor(t,r=[]){const e=new Set(r);if(e.size>
this.maximumPublicBlocks)throw new Error("Public artifact block catalog is full");for(const a of t)for await(const o of this.
store.listBlockCids(a,{signal:this.controller.signal}))if(e.add(l(o)),e.size>this.maximumPublicBlocks)throw new Error("P\
ublic artifact block catalog is full");return e}_bind(t){if(!this.bindings.has(t.appPeerId)&&this.bindings.size>=128)throw new Error(
"Artifact identity binding catalog is full");const r=this.bindings.get(t.appPeerId);r&&r.artifactPeerId!==t.artifactPeerId&&
this.transport.revokePeer(r.artifactPeerId).catch(()=>{}),this.bindings.set(t.appPeerId,t),this.transport.authorizePeer(
t.artifactPeerId)}async _record(t,{recipientPeerId:r,cid:e,nonce:a,available:o=!1}){const s=this.transport.getPeerInfo(),
n=Date.now();return T({schema:"peercompute.artifact-provider.v1",kind:t,...this.scope,appPeerId:this.manager.libp2p.peerId.
toString(),artifactPeerId:s.peerId,recipientPeerId:r,cid:e,nonce:a,issuedAt:n,expiresAt:n+E,addresses:s.addresses.slice(
0,8),available:o},{applicationKey:this.manager._applicationPrivateKey,signArtifact:d=>this.transport.signProviderRecord(
d)})}_signal(t){return AbortSignal.any([this.controller.signal,AbortSignal.timeout(this.queryTimeoutMs),...t?[t]:[]])}async _handle(t,r){
const e=this._signal(),a=()=>t.abort(e.reason);e.addEventListener("abort",a,{once:!0});try{const o=A(t,{maxDataLength:u,
maxBufferSize:u+16}),s=JSON.parse(b.decode((await o.read({signal:e})).subarray())),n=await S(s,{scope:this.scope,kind:"q\
uery",expectedPeerId:r.remotePeer.toString(),recipientPeerId:this.manager.libp2p.peerId.toString(),replayWindow:this.replayWindow});
this._bind(n);const d=this.publicArtifacts.has(n.cid)&&(await this.store.stat(n.cid,{signal:e}))?.status==="complete",c=await this.
_record("provider",{recipientPeerId:n.appPeerId,cid:n.cid,nonce:n.nonce,available:d});await o.write(f.encode(JSON.stringify(
c)),{signal:e}),await t.close({signal:e})}catch(o){throw this.lastInboundError=o.message,t.abort(o),o}finally{e.removeEventListener(
"abort",a)}}_remember(t){this.providers.has(t.cid)||(this.providers.size>=128&&this.providers.delete(this.providers.keys().
next().value),this.providers.set(t.cid,new Map));const r=this.providers.get(t.cid);t.available?r.set(t.appPeerId,t):r.delete(
t.appPeerId)}async _query(t,r,e){e=this._signal(e);const a=N(),o=t.remotePeer.toString(),s=await t.newStream(y,{signal:e,
runOnLimitedConnection:!0}),n=()=>s.abort(e.reason);e.addEventListener("abort",n,{once:!0});try{const d=A(s,{maxDataLength:u,
maxBufferSize:u+16}),c=await this._record("query",{recipientPeerId:o,cid:r,nonce:a});await d.write(f.encode(JSON.stringify(
c)),{signal:e});const m=JSON.parse(b.decode((await d.read({signal:e})).subarray())),p=await S(m,{scope:this.scope,kind:"\
provider",expectedPeerId:o,recipientPeerId:this.manager.libp2p.peerId.toString(),cid:r,nonce:a,replayWindow:this.replayWindow});
return this._remember(p),p.available&&this._bind(p),await s.close({signal:e}),p.available?p:null}catch(d){throw s.abort(
d),d}finally{e.removeEventListener("abort",n)}}async find(t,{signal:r}={}){if(this.closed)throw new Error("Artifact disc\
overy is stopped");t=l(String(t));const e=[...new Map(this.manager.libp2p.getConnections().filter(s=>s.status==="open").
map(s=>[s.remotePeer.toString(),s])).values()].slice(0,this.maximumQueryPeers);if(this.operations.size>=32)throw new Error(
"Artifact discovery is busy");const a=Promise.allSettled(e.map(s=>this._query(s,t,r)));this.operations.add(a);try{const s=await a;
this.lastErrors=s.flatMap((n,d)=>n.status==="rejected"?[{peerId:e[d].remotePeer.toString(),message:n.reason?.message||String(
n.reason)}]:[])}finally{this.operations.delete(a)}r?.throwIfAborted(),this.controller.signal.throwIfAborted();const o=new Set(
e.map(s=>s.remotePeer.toString()));return[...this.providers.get(t)?.values()||[]].filter(s=>s.expiresAt>Date.now()&&o.has(
s.appPeerId)&&s.gameId===this.scope.gameId&&s.roomId===this.scope.roomId&&s.topologyId===this.scope.topologyId).map(s=>structuredClone(
s))}async fetchBlock(t,{artifactCid:r,signal:e}={}){if(this.closed)throw new Error("Artifact discovery is stopped");const a=this.
providers.get(l(String(r||t))),o=new Set(this.manager.libp2p.getConnections().map(n=>n.remotePeer.toString()));let s=[...a?.
values()||[]].filter(n=>n.expiresAt>Date.now()+5e3&&o.has(n.appPeerId)&&n.gameId===this.scope.gameId&&n.roomId===this.scope.
roomId&&n.topologyId===this.scope.topologyId);if(s.length||(s=await this.find(r||t,{signal:e})),!s.length)throw new Error(
`No authenticated provider for artifact ${r||t}`);for(const n of s){const d=[...n.addresses].sort((c,m)=>Number(m.includes(
"/webrtc/"))-Number(c.includes("/webrtc/")));for(const c of d)try{await this.transport.dial(c,{signal:e});break}catch{e?.
throwIfAborted()}}return this.transport.fetchBlock(t,{signal:e})}_forgetPeer(t){const r=this.bindings.get(t);r&&this.transport.
revokePeer(r.artifactPeerId).catch(()=>{}),this.bindings.delete(t);for(const e of this.providers.values()){const a=e.get(
t);a&&this.transport.revokePeer(a.artifactPeerId).catch(()=>{}),e.delete(t)}}async stop(){this.closed||(this.closed=!0,clearInterval(
this.expiryTimer),this.controller.abort(new Error("Artifact discovery stopped")),this.manager.libp2p.removeEventListener(
"peer:disconnect",this.disconnectListener),await this.manager.libp2p.unhandle(y),await Promise.allSettled([...this.operations]),
this.providers.clear())}}export{u as ARTIFACT_PROVIDER_MAX_BYTES,y as ARTIFACT_PROVIDER_PROTOCOL,E as ARTIFACT_PROVIDER_TTL_MS,D as ArtifactProviderDiscovery,
M as ArtifactReplayWindow,N as artifactChallenge,T as signArtifactProviderRecord,S as verifyArtifactProviderRecord};
