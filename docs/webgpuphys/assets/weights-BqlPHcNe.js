import{a as Y,b as ce,e as le}from"./gpu-D2F42Yvf.js";import{c as te}from"./sf3dModelTask-BBHiFVdE.js";const X=new WeakSet,
ee=new WeakMap,H=new WeakSet,W=(r,c)=>{if(!Number.isSafeInteger(r)||r<0)throw new TypeError(`${c} must be nonnegative sa\
fe-integer bytes`);return r},re=r=>X.has(r);function me({cpuBytes:r,gpuBytes:c,totalBytes:n=r+c,parentBudget:s}={}){if(W(
r,"cpuBytes"),W(c,"gpuBytes"),W(n,"totalBytes"),s!==void 0&&!X.has(s))throw new TypeError("authenticated parent loader b\
udget required");const a=s===void 0?null:ee.get(s);a==null||a.assertActive();const t={liveBytes:0,peakLiveBytes:0,maxBytes:r},
w={liveBytes:0,peakLiveBytes:0,maxBytes:c};let l=0;const e=[],f=new Map,u=new Set;let y="new",v=null,g,S,_,p,k,m,A,z=!1,
j=!1,C=!1,D=!1;const U=(o,b)=>e.push({kind:o,phase:y,atMs:performance.now(),...b}),P=(o,b,i,B)=>{if(W(b,"requestedBytes"),
b<=o.maxBytes-o.liveBytes)return;v={scope:B,phase:y,label:i,requestedBytes:b,liveBytes:o.liveBytes,maxBytes:o.maxBytes},
U("allocation-refused",v);const q=new Error(`SF3D ${B} budget exceeded before allocation: ${o.liveBytes} + ${b} > ${o.maxBytes}`);
throw q.name="SF3DMemoryBudgetError",q.memoryBudget=v,q},R=(o,b,i,B)=>{o.liveBytes+=b,o.peakLiveBytes=Math.max(o.peakLiveBytes,
o.liveBytes),U("reserved",{scope:B,label:i,bytes:b,liveBytes:o.liveBytes});let q=!1;return Object.freeze({release(){q||(q=
!0,o.liveBytes-=b,U("retirement-requested",{scope:B,label:i,bytes:b,liveBytes:o.liveBytes}))}})},$=()=>{if(z)throw new Error(
"loader budget is restored");if(D)throw new Error("device acquisition cleanup is unresolved");a==null||a.assertActive()},
h=(o,b,i)=>{$();const B=o==="cpu-loader"?t:w;P(B,b,i,o),P({liveBytes:t.liveBytes+w.liveBytes,maxBytes:n},b,i,"unified-ex\
plicit");const q=a==null?void 0:a.reserve(o,b,i),M=R(B,b,i,o);l=Math.max(l,t.liveBytes+w.liveBytes);let E=!1;return Object.
freeze({release(){E||(E=!0,M.release(),q==null||q.release())}})},d=Object.freeze({events:e,setPhase(o){y=String(o)},reserveCpu(o,b){
return h("cpu-loader",o,b)},reserveGpu(o,b){return h("gpu-buffer",o,b)},assertDevice(o){if(!g||z||o!==g||g.createBuffer!==
k||g.destroy!==A||m&&g.createTexture!==m)throw new Error("loader budget must be installed on this exact owned device")},
assertDeviceAcquiredHere(o){if($(),d.assertDevice(o),!C)throw new Error("host device must be requested through the budge\
t; earlier acquisition baseline is unaccounted")},async requestOwnedDevice(o,b={},i={}){if($(),g||j)throw new Error("dev\
ice already bound or acquisition in progress");if(typeof(o==null?void 0:o.requestDevice)!="function")throw new TypeError(
"adapter requestDevice required");j=!0;let B;try{return B=await o.requestDevice(b),$(),d.bindOwnedDevice(B,i),C=!0,U("de\
vice-acquired",{route:"adapter.requestDevice through loader budget"}),B}catch(q){if(B)try{B.destroy()}catch(M){throw D=!0,
U("device-acquisition-cleanup-unresolved",{message:String((M==null?void 0:M.message)??M)}),new AggregateError([q,M],"dev\
ice acquisition and cleanup failed",{cause:q})}throw q}finally{j=!1}},bindOwnedDevice(o,{textureBytes:b=null}={}){if($(),
g||z||H.has(o))throw new Error("device already has a loader budget");if(typeof(o==null?void 0:o.createBuffer)!="function"||
typeof o.destroy!="function")throw new TypeError("owned device createBuffer/destroy required");if(b!==null&&(typeof b!="\
function"||typeof o.createTexture!="function"))throw new TypeError("host texture estimator and owned allocator required");
m=null,S=o.createBuffer,p=o.destroy,_=o.createTexture,k=function(i){if(this!==o)throw new Error("budgeted allocator requ\
ires the exact owned device");const B=W(i==null?void 0:i.size,"GPUBuffer.size"),q=(i==null?void 0:i.label)??"",M=h("gpu-\
buffer",B,q);let E;try{E=Reflect.apply(S,o,[{...i,size:B,label:q}])}catch(F){throw M.release(),F}if(f.has(E))return M.release(),
E;if((E==null?void 0:E.size)!==B||typeof(E==null?void 0:E.destroy)!="function"){const F=new Error("GPUBuffer size/destro\
y contract unavailable");try{if(typeof(E==null?void 0:E.destroy)!="function")throw new Error("actual allocation retireme\
nt unavailable");E.destroy(),M.release()}catch(O){throw u.add(M),new AggregateError([F,O],"GPUBuffer contract and cleanu\
p failed",{cause:F})}throw F}const T=E.destroy;f.set(E,{lease:M,destroy:T});try{const F=function(...O){const L=Reflect.apply(
T,this,O),x=f.get(this);return x&&(x.lease.release(),f.delete(this)),L};if(E.destroy=F,E.destroy!==F)throw new Error("GP\
UBuffer retirement hook installation failed")}catch(F){try{Reflect.apply(T,E,[]),M.release(),f.delete(E)}catch(O){throw new AggregateError(
[F,O],"GPUBuffer retirement hook and cleanup failed",{cause:F})}throw F}return E},b&&(m=function(i){if(this!==o)throw Error(
"budgeted texture allocator requires the exact owned device");const B=b(i),q=W(B==null?void 0:B.bytes,"explicit GPUTextu\
re bytes");if(!(B!=null&&B.descriptor)||typeof B.descriptor!="object")throw Error("pinned host texture descriptor requir\
ed");const M=B.descriptor.label??"",E=h("gpu-buffer",q,M);let T;try{T=Reflect.apply(_,o,[B.descriptor])}catch(O){throw E.
release(),O}if(f.has(T))return E.release(),T;const F=T==null?void 0:T.destroy;if(typeof F!="function")throw u.add(E),Error(
"GPUTexture retirement contract unavailable");f.set(T,{lease:E,destroy:F});try{const O=function(...L){const x=Reflect.apply(
F,this,L),K=f.get(this);return K&&(K.lease.release(),f.delete(this)),x};if(T.destroy=O,T.destroy!==O)throw Error("GPUTex\
ture retirement hook installation failed")}catch(O){try{Reflect.apply(F,T,[]),E.release(),f.delete(T)}catch(L){throw new AggregateError(
[O,L],"GPUTexture hook and cleanup failed",{cause:O})}throw O}return U("host-texture-allocated",{label:M,bytes:q,descriptor:B.
descriptor,effective:{width:T.width,height:T.height,depthOrArrayLayers:T.depthOrArrayLayers,format:T.format,mipLevelCount:T.
mipLevelCount,sampleCount:T.sampleCount}}),T}),A=function(...i){const B=Reflect.apply(p,this,i);if(this===o){for(const q of f.
values())q.lease.release();for(const q of u)q.release();u.clear()}return B};try{if(o.createBuffer=k,o.destroy=A,m&&(o.createTexture=
m),o.createBuffer!==k||o.destroy!==A||m&&o.createTexture!==m)throw new Error("device budget installation failed")}catch(i){
throw o.createBuffer=S,o.destroy=p,m&&(o.createTexture=_),i}return g=o,H.add(o),d},snapshot(){return{schema:"sf3d.loader\
-memory-budget.v0",phase:y,refusal:v,deviceAcquisition:C?"requested-through-budget":g?"bound-after-acquisition":"unbound",
unresolvedAcquisitionCleanup:D,accounting:"own and descendant explicit reservations; nested ledgers are not additive phy\
sical RAM",parentAllowance:a?{cpuBytes:a.cpuBytes,gpuBytes:a.gpuBytes,totalBytes:a.totalBytes}:null,total:{liveBytes:t.liveBytes+
w.liveBytes,peakLiveBytes:l,maxBytes:n,physicalMemoryMeasured:!1,meaning:"combined explicit CPU/GPU stores, not total un\
ified physical memory"},cpu:{...t,physicalMemoryMeasured:!1,meaning:"explicit loader reservations; retirement is not pro\
ven GC"},gpu:{...w,physicalMemoryMeasured:!1,meaning:m?"API-visible buffers and declared logical texture stores; not rec\
laimed physical backing":"API-visible buffers; destruction request is not reclaimed physical backing"},hostTextures:m?"e\
xplicit caller-estimated logical texture stores; not physical backing":"not tracked",excludes:["JS/parse metadata","rele\
ased JS backing before GC","network/browser/driver-private backing",...m?["texture padding/private backing"]:["textures"],
"other processes"]}},restore(){if(!z){if(D)throw new Error("device acquisition cleanup is unresolved");if(t.liveBytes||w.
liveBytes)throw new Error("retire loader allocations before restoring the budget");if(g){g.createBuffer=S,g.destroy=p,m&&
(g.createTexture=_);for(const[o,b]of f)o.destroy=b.destroy;H.delete(g),f.clear()}z=!0}}});return ee.set(d,{assertActive:$,
reserve:h,cpuBytes:r,gpuBytes:c,totalBytes:n}),X.add(d),d}function I(r){const c=r>>15&1,n=r>>10&31,s=r&1023;if(n===0){if(s===
0)return c?-0:0;let t=s/1024*Math.pow(2,-14);return c?-t:t}if(n===31)return s===0?c?-1/0:1/0:NaN;const a=Math.pow(2,n-15)*
(1+s/1024);return c?-a:a}function G(r,c,n,s,a=r==null?void 0:r.ownedCpu){const t=r==null?void 0:r.budget.reserveCpu(c,n);
try{const w=s();return t&&a.add(t),w}catch(w){throw t==null||t.release(),w}}function V(r,c){const n=new Set;try{return c(
r?{...r,temporary:n}:null)}finally{for(const s of n)s.release()}}function Q(r){const c=[];for(const n of r)try{n.destroy(),
r.delete(n)}catch(s){c.push(s)}return c}function oe(r,c,n,s){return V(s,a=>{const{dtype:t,offset:w,size:l}=n,e=Z(c,w,l,a);
if(t===0){const f=new Float32Array(e.buffer,e.byteOffset,l/4);return ce(r,f)}else{const f=new Uint16Array(e.buffer,e.byteOffset,
l/2),u=a==null?void 0:a.budget.reserveCpu(f.length*4,"fp16-conversion");return u&&a.temporary.add(u),le(r,f.length*4,y=>{
const v=new Float32Array(y);for(let g=0;g<f.length;g++)v[g]=I(f[g])},{ownedBuffers:(a==null?void 0:a.ownedBuffers)??null})}})}
function ne(r,c,n){return V(n,s=>{const{dtype:a,offset:t,size:w}=c,l=Z(r,t,w,s);if(a===0){const u=new Float32Array(l.buffer,
l.byteOffset,w/4);return G(s,w,"cpu-tensor-copy",()=>new Float32Array(u))}const e=new Uint16Array(l.buffer,l.byteOffset,
w/2),f=G(s,e.length*4,"cpu-fp16-conversion",()=>new Float32Array(e.length));for(let u=0;u<e.length;u++)f[u]=I(e[u]);return f})}
const N=Object.freeze(["image_estimator."]);function se(r,c,n,s=N,a=null){const t=new Map;let w=!1,l=0,e=0;for(const[u,y]of r)
!n.has(u)||s.some(g=>u.startsWith(g))?(t.set(u,V(a,g=>{const S=Z(c,y.offset,y.size,g);return G(g,y.size,"retained-raw-co\
py",()=>S.slice())})),l+=y.size):e+=y.size;return Array.isArray(c==null?void 0:c.chunks)&&(c.chunks.length=0,c.offsets.length=
0),{retained:t,rawBytes:u=>{if(w)throw new Error("SF3D weights are disposed");const y=t.get(u);if(!y)throw new Error(r.has(
u)?`tensor ${u} was uploaded at load and its raw bytes were released; lazy raw access covers ${s.join(", ")}`:`Missing w\
eight: ${u}`);return y},retainedBytes:l,droppedBytes:e,dispose(){w=!0,t.clear()}}}function ue(r,c,n){return Z(r,c,n)}function Z(r,c,n,s=null){
if(r instanceof ArrayBuffer)return new Uint8Array(r,c,n);const{chunks:a,offsets:t}=r;let w=-1;for(let u=0;u<t.length;u++)
if(t[u]+a[u].length>c){w=u;break}if(w===-1)throw new Error(`Weight data offset ${c} (size ${n}) is beyond end of file (${r.
totalSize} bytes)`);const l=c-t[w];if(l+n<=a[w].length){if((a[w].byteOffset+l)%4!==0){const y=G(s,n,"aligned-tensor-copy",
()=>new Uint8Array(n),s==null?void 0:s.temporary);return y.set(a[w].subarray(l,l+n)),y}return a[w].subarray(l,l+n)}const e=G(
s,n,"cross-chunk-tensor-copy",()=>new Uint8Array(n),s==null?void 0:s.temporary);let f=0;for(let u=w;u<a.length&&f<n;u++){
const y=Math.max(0,c+f-t[u]),v=a[u].length-y,g=Math.min(v,n-f);e.set(a[u].subarray(y,y+g),f),f+=g}return e}async function fe(){
throw new Error("PeerCompute requires artifact-backed SF3D weights")}async function he(r,c){const n=new Set,s=new Map,a=new Map;
let t=!1,w=0,l=0;const e={retained:s,get retainedBytes(){return w},get droppedBytes(){return l},rawBytes(f){if(t||!s.has(
f))throw new Error("SF3D raw tensor is unavailable: "+f);return s.get(f)},dispose(){t=!0,s.clear()}};try{const f=J(r,null,
c.tensors,new Set,null,{dryRun:!0});for(const[u,y]of c.tensors){if(!f.has(u)||N.some(_=>u.startsWith(_))?(s.set(u,await c.
readTensor(u)),w+=y.size):l+=y.size,!f.has(u))continue;const g=y.dtype===1?y.size*2:y.size;if(g>r.limits.maxBufferSize||
g>r.limits.maxStorageBufferBindingSize)throw new Error("SF3D tensor exceeds device buffer limits: "+u);const S=Y(r,g,0,"\
sf3d-weight:"+u);n.add(S),a.set(u,S),await c.consumeTensor(u,async(_,p)=>{if(y.dtype===0)r.queue.writeBuffer(S,p,_);else{
const k=new DataView(_.buffer,_.byteOffset,_.byteLength),m=new Float32Array(_.byteLength/2);for(let A=0;A<m.length;A++)m[A]=
I(k.getUint16(A*2,!0));r.queue.writeBuffer(S,p*2,m)}await r.queue.onSubmittedWorkDone()})}return J(r,null,c.tensors,n,null,
{buffers:a,compact:e,report:c.report})}catch(f){e.dispose();const u=Q(n);throw u.length?new AggregateError([f,...u],"SF3\
D artifact load cleanup failed",{cause:f}):f}}function J(r,c,n,s,a=null,t=null){const w=(h,d)=>{const o=oe(r,h,d,a);return s.
add(o),o},l=new Set,e=h=>{const d=n.get(h);if(!d)throw new Error(`Missing weight: ${h}`);return l.add(h),t!=null&&t.references?
t.references(h):t!=null&&t.dryRun?{}:t?t.buffers.get(h):w(c,d)},f=h=>{const d=n.get(h);return d?(l.add(h),t!=null&&t.references?
t.references(h):t!=null&&t.dryRun?{}:t?t.buffers.get(h):w(c,d)):null},u={imageMean:e("image_tokenizer.image_mean"),imageStd:e(
"image_tokenizer.image_std"),patchEmbed:{weight:e("image_tokenizer.model.embeddings.patch_embeddings.projection.weight"),
bias:e("image_tokenizer.model.embeddings.patch_embeddings.projection.bias")},clsToken:e("image_tokenizer.model.embedding\
s.cls_token"),posEmbed:e("image_tokenizer.model.embeddings.position_embeddings"),layernorm:{weight:e("image_tokenizer.mo\
del.layernorm.weight"),bias:e("image_tokenizer.model.layernorm.bias")},blocks:[]};for(let h=0;h<24;h++){const d=`image_t\
okenizer.model.encoder.layer.${h}`;u.blocks.push({norm1:{weight:e(`${d}.norm1.weight`),bias:e(`${d}.norm1.bias`)},attn:{
q:{weight:e(`${d}.attention.attention.query.weight`),bias:e(`${d}.attention.attention.query.bias`)},k:{weight:e(`${d}.at\
tention.attention.key.weight`),bias:e(`${d}.attention.attention.key.bias`)},v:{weight:e(`${d}.attention.attention.value.\
weight`),bias:e(`${d}.attention.attention.value.bias`)},proj:{weight:e(`${d}.attention.output.dense.weight`),bias:e(`${d}\
.attention.output.dense.bias`)}},layerScale1:e(`${d}.layer_scale1.lambda1`),norm2:{weight:e(`${d}.norm2.weight`),bias:e(
`${d}.norm2.bias`)},mlp:{fc1:{weight:e(`${d}.mlp.fc1.weight`),bias:e(`${d}.mlp.fc1.bias`)},fc2:{weight:e(`${d}.mlp.fc2.w\
eight`),bias:e(`${d}.mlp.fc2.bias`)}},layerScale2:e(`${d}.layer_scale2.lambda1`),norm1Mod:{weight:e(`${d}.norm1_modulati\
on.linear2.weight`),bias:e(`${d}.norm1_modulation.linear2.bias`)},norm2Mod:{weight:e(`${d}.norm2_modulation.linear2.weig\
ht`),bias:e(`${d}.norm2_modulation.linear2.bias`)}})}const y={weight:e("camera_embedder.linear.weight"),bias:e("camera_e\
mbedder.linear.bias")},v={embeddings:e("tokenizer.embeddings")},g={latentInit:e("backbone.latent_init"),normTriplane:{weight:e(
"backbone.norm_triplane.weight"),bias:e("backbone.norm_triplane.bias")},projTriplane:{weight:e("backbone.proj_triplane.w\
eight"),bias:e("backbone.proj_triplane.bias")},normImage:{weight:e("backbone.norm_image.weight"),bias:e("backbone.norm_i\
mage.bias")},projImage:{weight:e("backbone.proj_image.weight"),bias:e("backbone.proj_image.bias")},normLatent:{weight:e(
"backbone.norm_latent.weight"),bias:e("backbone.norm_latent.bias")},projLatent:{weight:e("backbone.proj_latent.weight"),
bias:e("backbone.proj_latent.bias")},projOut:{weight:e("backbone.proj_out.weight"),bias:e("backbone.proj_out.bias")},mainBlocks:[]};
for(let h=0;h<4;h++){let o=function(i){return{attn:{wq:e(`${i}.attn.wq.weight`),wk:e(`${i}.attn.wk.weight`),wv:e(`${i}.a\
ttn.wv.weight`),proj:{weight:e(`${i}.attn.proj.weight`),bias:e(`${i}.attn.proj.bias`)}},normZ1:{weight:e(`${i}.norm_z1.w\
eight`),bias:e(`${i}.norm_z1.bias`)},normX:n.has(`${i}.norm_x.weight`)?{weight:e(`${i}.norm_x.weight`),bias:e(`${i}.norm\
_x.bias`)}:null,normZ2:{weight:e(`${i}.norm_z2.weight`),bias:e(`${i}.norm_z2.bias`)},ff:{geglu:{weight:e(`${i}.ff.net.0.\
proj.weight`),bias:e(`${i}.ff.net.0.proj.bias`)},proj:{weight:e(`${i}.ff.net.2.weight`),bias:e(`${i}.ff.net.2.bias`)}}}},
b=function(i){return{norm1:{weight:e(`${i}.norm1.weight`),bias:e(`${i}.norm1.bias`)},attn1:{wq:e(`${i}.attn1.wq.weight`),
wk:e(`${i}.attn1.wk.weight`),wv:e(`${i}.attn1.wv.weight`),proj:{weight:e(`${i}.attn1.proj.weight`),bias:e(`${i}.attn1.pr\
oj.bias`)}},norm2:{weight:e(`${i}.norm2.weight`),bias:e(`${i}.norm2.bias`)},attn2:{wq:e(`${i}.attn2.wq.weight`),wk:e(`${i}\
.attn2.wk.weight`),wv:e(`${i}.attn2.wv.weight`),proj:{weight:e(`${i}.attn2.proj.weight`),bias:e(`${i}.attn2.proj.bias`)}},
norm3:{weight:e(`${i}.norm3.weight`),bias:e(`${i}.norm3.bias`)},ff:{geglu:{weight:e(`${i}.ff.net.0.proj.weight`),bias:e(
`${i}.ff.net.0.proj.bias`)},proj:{weight:e(`${i}.ff.net.2.weight`),bias:e(`${i}.ff.net.2.bias`)}}}};const d=`backbone.ma\
in_blocks.${h}`;g.mainBlocks.push({fuseBlockIn:o(`${d}.fuse_block_in`),transformerBlocks:[0,1,2].map(i=>b(`${d}.transfor\
mer_block.${i}`)),fuseBlockOut:o(`${d}.fuse_block_out`)})}const S={convLayers:[{weight:e("post_processor.upsample.0.weig\
ht"),bias:e("post_processor.upsample.0.bias")},{weight:e("post_processor.upsample.2.weight"),bias:e("post_processor.upsa\
mple.2.bias")},{weight:e("post_processor.upsample.4.weight"),bias:e("post_processor.upsample.4.bias")},{weight:e("post_p\
rocessor.upsample.6.weight"),bias:e("post_processor.upsample.6.bias")}]},_={heads:{}};for(const h of["density","features",
"perturb_normal","vertex_offset"]){const d=[];for(let o=0;;o+=2){const b=f(`decoder.heads.${h}.${o}.weight`),i=f(`decode\
r.heads.${h}.${o}.bias`);if(!b)break;d.push({weight:b,bias:i})}_.heads[h]=d}const p={heads:{}};for(const h of["roughness",
"metallic"]){const d=[];for(let o=0;o<3;o++){const b=[];for(let i=0;;i+=2){const B=f(`image_estimator.heads.${h}.${o}.${i}\
.weight`),q=f(`image_estimator.heads.${h}.${o}.${i}.bias`);if(!B)break;b.push({weight:B,bias:q})}b.length>0&&d.push(b)}p.
heads[h]=d}if(t!=null&&t.dryRun)return l;const k={imageTokenizer:u,cameraEmbedder:y,tokenizer:v,backbone:g,postProcessor:S,
decoder:_,imageEstimator:p};if(t!=null&&t.references)return k;console.log(`Loaded ${n.size} SF3D tensors from weight fil\
e`);const m=(t==null?void 0:t.compact)??se(n,c,l,N,a);console.log(`Retained ${(m.retainedBytes/1048576).toFixed(0)} MB o\
f raw tensor bytes for lazy readers; released ${(m.droppedBytes/1048576).toFixed(0)} MB of streamed chunks`);const A=new Map;
let z=!1;const j=(h=r)=>{if(z)throw new Error("SF3D weights are disposed");if(h!==r)throw new Error("SF3D weights belong\
 to a different GPUDevice")},C=h=>{j();const d=n.get(h);if(!d)throw new Error(`Missing weight: ${h}`);return{dtype:d.dtype,
offset:0,size:d.size}},D=h=>(j(),A.has(h)||A.set(h,w(m.rawBytes(h).buffer,C(h))),A.get(h)),U=h=>(j(),ne(m.rawBytes(h).buffer,
C(h),a)),P=h=>(j(),n.has(h)?D(h):null),R=h=>(j(),n.has(h)),$=()=>{if(z&&s.size===0)return 0;z=!0;const h=s.size,d=Q(s);A.
clear(),m.dispose();for(const o of(a==null?void 0:a.ownedCpu)??[])o.release();if(a==null||a.ownedCpu.clear(),d.length)throw new AggregateError(
d,"SF3D weight cleanup encountered failures");return h};return{...k,...t?{loadingReport:t.report}:{},dispose:$,_assertActive:j,
_rawGet:D,_rawGetCPU:U,_rawTryGet:P,_rawHas:R}}function ae(r,c){if(!re(c))throw TypeError("tensor-ranges requires authen\
ticated loader budget");c.assertDevice(r);const n=new Set,s=new Set;return{ownedBuffers:n,ownedCpu:s,context:{budget:c,ownedCpu:s,
ownedBuffers:n},cleanup:w=>{const l=Q(n);for(const e of s)e.release();if(s.clear(),l.length)throw new AggregateError(w?[
w,...l]:l,"SF3D range cleanup encountered failures",{cause:w})}}}async function we(r,c,n){const s=new Uint16Array(c.buffer,
c.byteOffset,c.byteLength/2),a=s.length*4,t=n.context.budget.reserveCpu(a,"fp16-conversion");n.ownedCpu.add(t);const w=new Float32Array(
Math.min(s.length,262144)),l=Y(r,a,0,"complete-phase-fp16-upload");n.ownedBuffers.add(l);for(let e=0;e<s.length;e+=w.length){
const f=Math.min(w.length,s.length-e);for(let u=0;u<f;u++)w[u]=I(s[e+u]);r.queue.writeBuffer(l,e*4,w,0,f),await r.queue.
onSubmittedWorkDone()}return t.release(),n.ownedCpu.delete(t),l}async function de(r,c,n,s){const a=c.tensors.get(n),t=a.
size*2,w=s.context.budget.reserveCpu(t,"fp16-conversion");let l;const e={release(){w.release(),l=null}};s.ownedCpu.add(e),
l=new Float32Array(Math.min(a.size/2,262144));const f=new Uint8Array(l.buffer,0,l.length*2),u=new Uint16Array(l.buffer,0,
l.length),y=Y(r,t,0,"complete-phase-fp16-upload");s.ownedBuffers.add(y);let v=0,g=0;const S=async()=>{if(v%2)throw Error(
"complete FP16 prefix has an incomplete element");const _=v/2;for(let p=_-1;p>=0;p--)l[p]=I(u[p]);r.queue.writeBuffer(y,
g,l,0,_),await r.queue.onSubmittedWorkDone(),g+=_*4,v=0};if(await c.consumeTensor(n,async _=>{for(let p=0;p<_.length;){const k=Math.
min(f.length-v,_.length-p);f.set(_.subarray(p,p+k),v),v+=k,p+=k,v===f.length&&await S()}}),v&&await S(),g!==t)throw Error(
"complete FP16 source upload coverage mismatch");return e.release(),s.ownedCpu.delete(e),y}async function ie(r,c,n,s,{retain:a=!1,
streamFp16Uploads:t=!1}={}){const w=c.tensors.get(n);if(t&&w.dtype===1&&!a){const e=await de(r,c,n,s);return await r.queue.
onSubmittedWorkDone(),{buffer:e}}let l=await c.readTensor(n);try{const e=c.tensors.get(n),f=t&&e.dtype===1?await we(r,l.
bytes,s):oe(r,l.bytes.buffer,{...e,offset:0},s.context);if(s.ownedBuffers.add(f),await r.queue.onSubmittedWorkDone(),a){
s.ownedCpu.add(l);const u=l.bytes;return l=null,{buffer:f,bytes:u}}return{buffer:f}}finally{l==null||l.release(),l&&(l.bytes=
null)}}async function pe(r,c,n,s={}){const a=ae(r,s.memoryBudget);if(!Array.isArray(n)||!n.length||new Set(n).size!==n.length)
throw TypeError("explicit unique nonempty tensorNames required");try{const t=await te(c,s),w=new Map;for(const l of n)if(!t.
tensors.has(l))throw Error("Missing weight: "+l);for(const l of n)w.set(l,(await ie(r,t,l,a)).buffer);return{tensors:w,loadingReport:t.
report,dispose:()=>{a.cleanup(),w.clear()}}}catch(t){throw a.cleanup(t),t}}async function ge(r,c,n={}){const s=n.streamFp16Uploads===
void 0?!1:n.streamFp16Uploads;if(typeof s!="boolean")throw TypeError("explicit boolean phase FP16 upload mode required");
const a=n.onAfterWeightsLoaded;if(a!==void 0&&typeof a!="function")throw TypeError("weight observation callback must be \
a function");if(!re(n.memoryBudget))throw TypeError("authenticated loader budget required");n.memoryBudget.assertDevice(
r);const t=await te(),w=new WeakMap;t.report.gpuFp16UploadMode=s?"queue-write-complete-source-prefix-v1":"direct-mapped-\
v1";const l=J(r,null,t.tensors,new Set,null,{references(p){const k=Object.freeze({});return w.set(k,p),k}});let e=!1,f=!1,
u=!1,y=null;const v=[],g=()=>{if(f)throw Error("weight phase source is disposed");if(u)throw Error("weight phase source \
queue cleanup is quarantined");if(e)throw Error("weight phase source has an active phase")},S=(p,k,m=null)=>{if(p===null)
return null;if(!p||typeof p!="object")throw TypeError("authenticated weight phase selection required");if(w.has(p)){const z=w.
get(p);return k.add(z),m?m.get(z):p}if(Array.isArray(p))return p.map(z=>S(z,k,m));const A=Object.entries(p);if(!A.length)
throw TypeError("authenticated weight phase selection required");return Object.fromEntries(A.map(([z,j])=>[z,S(j,k,m)]))},
_=async(p,k,m)=>{if(g(),typeof k!="function")throw TypeError("weight phase computation required");const A=new Set;if(p&&
typeof p=="object"&&!Object.keys(p).length)throw TypeError("nonempty weight phase selection required");const z=S(p,A);if(!A.
size)throw TypeError("nonempty weight phase selection required");e=!0;const j=ae(r,n.memoryBudget),C=new Map,D={tensorNames:[
...A],storageKind:m,status:"loading",retirementAuthority:m==="cpu-fp32"?"owned CPU lease release; not physical reclamati\
on":"API destruction after queue drain; not physical reclamation"};v.push(D);let U,P,R=!1;try{for(const $ of A)if(m==="c\
pu-fp32"){const h=await t.readTensor($);try{C.set($,ne(h.bytes.buffer,{...t.tensors.get($),offset:0},j.context))}finally{
h.release(),h.bytes=null}}else C.set($,(await ie(r,t,$,j,{streamFp16Uploads:s})).buffer);a&&(j.ownedBuffers.size&&await r.
queue.onSubmittedWorkDone(),D.status="observing-loaded-weights",await a(Object.freeze({storageKind:m,sourceETag:t.report.
sourceETag,tensors:Object.freeze([...C].map(([$,h])=>Object.freeze({name:$,value:h,...t.tensors.get($)})))}))),D.status=
"computing",U=await k(S(z,new Set,C))}catch($){R=!0,P=$,D.error=String(($==null?void 0:$.message)??$)}try{j.ownedBuffers.
size&&await r.queue.onSubmittedWorkDone(),j.cleanup(),C.clear(),D.status=R?"failed-retired":"completed-retired"}catch($){
u=!0,y=j,D.status="cleanup-unresolved",D.cleanupError=String(($==null?void 0:$.message)??$),P=R?new AggregateError([P,$],
"weight phase failed and cleanup is unresolved",{cause:P}):$,R=!0}finally{e=!1}if(R)throw P;return U};return Object.freeze(
{template:l,loadingReport:t.report,phases:v,reference(p){if(g(),typeof p!="string"||!t.tensors.has(p))throw Error("Missi\
ng weight: "+p);const k=Object.freeze({});return w.set(k,p),k},describe(p){g();const k=new Set;if(S(p,k),!k.size)throw TypeError(
"nonempty weight phase selection required");return Object.freeze([...k].map(m=>Object.freeze({name:m,...t.tensors.get(m)})))},
withWeights(p,k){return _(p,k,"gpu-buffer")},withCpuWeights(p,k){return _(p,k,"cpu-fp32")},async dispose(){if(e)throw Error(
"cannot dispose an active weight phase");f&&!y||(f=!0,y&&(await r.queue.onSubmittedWorkDone(),y.cleanup(),y=null))}})}var ke=Object.
freeze({__proto__:null,LAZILY_READ_TENSOR_PREFIXES:N,compactRetainedTensors:se,createWeightPhaseSource:ge,extractBytesFromChunks:ue,
loadWeightTensorUnit:pe,loadWeights:fe,loadWeightsFromSource:he});export{me as c,re as i,fe as l,ke as w};
