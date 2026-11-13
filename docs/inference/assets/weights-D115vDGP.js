import{a as V,b as ce,e as ue}from"./gpu-CbAOvyLy.js";import{c as te}from"./sf3dModelTask-2M07_6Y8.js";const J=new WeakSet,
ee=new WeakMap,Z=new WeakSet,L=(r,i)=>{if(!Number.isSafeInteger(r)||r<0)throw new TypeError(`${i} must be nonnegative sa\
fe-integer bytes`);return r},re=r=>J.has(r);function me({cpuBytes:r,gpuBytes:i,totalBytes:t=r+i,parentBudget:s}={}){if(L(
r,"cpuBytes"),L(i,"gpuBytes"),L(t,"totalBytes"),s!==void 0&&!J.has(s))throw new TypeError("authenticated parent loader b\
udget required");const d=s===void 0?null:ee.get(s);d?.assertActive();const n={liveBytes:0,peakLiveBytes:0,maxBytes:r},h={
liveBytes:0,peakLiveBytes:0,maxBytes:i};let c=0;const e=[],l=new Map,u=new Set;let b="new",_=null,g,S,$,p,k,m,A,z=!1,T=!1,
C=!1,D=!1;const x=(o,y)=>e.push({kind:o,phase:b,atMs:performance.now(),...y}),U=(o,y,a,B)=>{if(L(y,"requestedBytes"),y<=
o.maxBytes-o.liveBytes)return;_={scope:B,phase:b,label:a,requestedBytes:y,liveBytes:o.liveBytes,maxBytes:o.maxBytes},x("\
allocation-refused",_);const v=new Error(`SF3D ${B} budget exceeded before allocation: ${o.liveBytes} + ${y} > ${o.maxBytes}`);
throw v.name="SF3DMemoryBudgetError",v.memoryBudget=_,v},P=(o,y,a,B)=>{o.liveBytes+=y,o.peakLiveBytes=Math.max(o.peakLiveBytes,
o.liveBytes),x("reserved",{scope:B,label:a,bytes:y,liveBytes:o.liveBytes});let v=!1;return Object.freeze({release(){v||(v=
!0,o.liveBytes-=y,x("retirement-requested",{scope:B,label:a,bytes:y,liveBytes:o.liveBytes}))}})},E=()=>{if(z)throw new Error(
"loader budget is restored");if(D)throw new Error("device acquisition cleanup is unresolved");d?.assertActive()},f=(o,y,a)=>{
E();const B=o==="cpu-loader"?n:h;U(B,y,a,o),U({liveBytes:n.liveBytes+h.liveBytes,maxBytes:t},y,a,"unified-explicit");const v=d?.
reserve(o,y,a),O=P(B,y,a,o);c=Math.max(c,n.liveBytes+h.liveBytes);let q=!1;return Object.freeze({release(){q||(q=!0,O.release(),
v?.release())}})},w=Object.freeze({events:e,setPhase(o){b=String(o)},reserveCpu(o,y){return f("cpu-loader",o,y)},reserveGpu(o,y){
return f("gpu-buffer",o,y)},assertDevice(o){if(!g||z||o!==g||g.createBuffer!==k||g.destroy!==A||m&&g.createTexture!==m)throw new Error(
"loader budget must be installed on this exact owned device")},assertDeviceAcquiredHere(o){if(E(),w.assertDevice(o),!C)throw new Error(
"host device must be requested through the budget; earlier acquisition baseline is unaccounted")},async requestOwnedDevice(o,y={},a={}){
if(E(),g||T)throw new Error("device already bound or acquisition in progress");if(typeof o?.requestDevice!="function")throw new TypeError(
"adapter requestDevice required");T=!0;let B;try{return B=await o.requestDevice(y),E(),w.bindOwnedDevice(B,a),C=!0,x("de\
vice-acquired",{route:"adapter.requestDevice through loader budget"}),B}catch(v){if(B)try{B.destroy()}catch(O){throw D=!0,
x("device-acquisition-cleanup-unresolved",{message:String(O?.message??O)}),new AggregateError([v,O],"device acquisition \
and cleanup failed",{cause:v})}throw v}finally{T=!1}},bindOwnedDevice(o,{textureBytes:y=null}={}){if(E(),g||z||Z.has(o))
throw new Error("device already has a loader budget");if(typeof o?.createBuffer!="function"||typeof o.destroy!="function")
throw new TypeError("owned device createBuffer/destroy required");if(y!==null&&(typeof y!="function"||typeof o.createTexture!=
"function"))throw new TypeError("host texture estimator and owned allocator required");m=null,S=o.createBuffer,p=o.destroy,
$=o.createTexture,k=function(a){if(this!==o)throw new Error("budgeted allocator requires the exact owned device");const B=L(
a?.size,"GPUBuffer.size"),v=a?.label??"",O=f("gpu-buffer",B,v);let q;try{q=Reflect.apply(S,o,[{...a,size:B,label:v}])}catch(M){
throw O.release(),M}if(l.has(q))return O.release(),q;if(q?.size!==B||typeof q?.destroy!="function"){const M=new Error("G\
PUBuffer size/destroy contract unavailable");try{if(typeof q?.destroy!="function")throw new Error("actual allocation ret\
irement unavailable");q.destroy(),O.release()}catch(F){throw u.add(O),new AggregateError([M,F],"GPUBuffer contract and c\
leanup failed",{cause:M})}throw M}const j=q.destroy;l.set(q,{lease:O,destroy:j});try{const M=function(...F){const R=Reflect.
apply(j,this,F),I=l.get(this);return I&&(I.lease.release(),l.delete(this)),R};if(q.destroy=M,q.destroy!==M)throw new Error(
"GPUBuffer retirement hook installation failed")}catch(M){try{Reflect.apply(j,q,[]),O.release(),l.delete(q)}catch(F){throw new AggregateError(
[M,F],"GPUBuffer retirement hook and cleanup failed",{cause:M})}throw M}return q},y&&(m=function(a){if(this!==o)throw Error(
"budgeted texture allocator requires the exact owned device");const B=y(a),v=L(B?.bytes,"explicit GPUTexture bytes");if(!B?.
descriptor||typeof B.descriptor!="object")throw Error("pinned host texture descriptor required");const O=B.descriptor.label??
"",q=f("gpu-buffer",v,O);let j;try{j=Reflect.apply($,o,[B.descriptor])}catch(F){throw q.release(),F}if(l.has(j))return q.
release(),j;const M=j?.destroy;if(typeof M!="function")throw u.add(q),Error("GPUTexture retirement contract unavailable");
l.set(j,{lease:q,destroy:M});try{const F=function(...R){const I=Reflect.apply(M,this,R),K=l.get(this);return K&&(K.lease.
release(),l.delete(this)),I};if(j.destroy=F,j.destroy!==F)throw Error("GPUTexture retirement hook installation failed")}catch(F){
try{Reflect.apply(M,j,[]),q.release(),l.delete(j)}catch(R){throw new AggregateError([F,R],"GPUTexture hook and cleanup f\
ailed",{cause:F})}throw F}return x("host-texture-allocated",{label:O,bytes:v,descriptor:B.descriptor,effective:{width:j.
width,height:j.height,depthOrArrayLayers:j.depthOrArrayLayers,format:j.format,mipLevelCount:j.mipLevelCount,sampleCount:j.
sampleCount}}),j}),A=function(...a){const B=Reflect.apply(p,this,a);if(this===o){for(const v of l.values())v.lease.release();
for(const v of u)v.release();u.clear()}return B};try{if(o.createBuffer=k,o.destroy=A,m&&(o.createTexture=m),o.createBuffer!==
k||o.destroy!==A||m&&o.createTexture!==m)throw new Error("device budget installation failed")}catch(a){throw o.createBuffer=
S,o.destroy=p,m&&(o.createTexture=$),a}return g=o,Z.add(o),w},snapshot(){return{schema:"sf3d.loader-memory-budget.v0",phase:b,
refusal:_,deviceAcquisition:C?"requested-through-budget":g?"bound-after-acquisition":"unbound",unresolvedAcquisitionCleanup:D,
accounting:"own and descendant explicit reservations; nested ledgers are not additive physical RAM",parentAllowance:d?{cpuBytes:d.
cpuBytes,gpuBytes:d.gpuBytes,totalBytes:d.totalBytes}:null,total:{liveBytes:n.liveBytes+h.liveBytes,peakLiveBytes:c,maxBytes:t,
physicalMemoryMeasured:!1,meaning:"combined explicit CPU/GPU stores, not total unified physical memory"},cpu:{...n,physicalMemoryMeasured:!1,
meaning:"explicit loader reservations; retirement is not proven GC"},gpu:{...h,physicalMemoryMeasured:!1,meaning:m?"API-\
visible buffers and declared logical texture stores; not reclaimed physical backing":"API-visible buffers; destruction r\
equest is not reclaimed physical backing"},hostTextures:m?"explicit caller-estimated logical texture stores; not physica\
l backing":"not tracked",excludes:["JS/parse metadata","released JS backing before GC","network/browser/driver-private b\
acking",...m?["texture padding/private backing"]:["textures"],"other processes"]}},restore(){if(!z){if(D)throw new Error(
"device acquisition cleanup is unresolved");if(n.liveBytes||h.liveBytes)throw new Error("retire loader allocations befor\
e restoring the budget");if(g){g.createBuffer=S,g.destroy=p,m&&(g.createTexture=$);for(const[o,y]of l)o.destroy=y.destroy;
Z.delete(g),l.clear()}z=!0}}});return ee.set(w,{assertActive:E,reserve:f,cpuBytes:r,gpuBytes:i,totalBytes:t}),J.add(w),w}
function G(r){const i=r>>15&1,t=r>>10&31,s=r&1023;if(t===0){if(s===0)return i?-0:0;let n=s/1024*Math.pow(2,-14);return i?
-n:n}if(t===31)return s===0?i?-1/0:1/0:NaN;const d=Math.pow(2,t-15)*(1+s/1024);return i?-d:d}function W(r,i,t,s,d=r?.ownedCpu){
const n=r?.budget.reserveCpu(i,t);try{const h=s();return n&&d.add(n),h}catch(h){throw n?.release(),h}}function Y(r,i){const t=new Set;
try{return i(r?{...r,temporary:t}:null)}finally{for(const s of t)s.release()}}function Q(r){const i=[];for(const t of r)
try{t.destroy(),r.delete(t)}catch(s){i.push(s)}return i}function oe(r,i,t,s){return Y(s,d=>{const{dtype:n,offset:h,size:c}=t,
e=N(i,h,c,d);if(n===0){const l=new Float32Array(e.buffer,e.byteOffset,c/4);return ce(r,l)}else{const l=new Uint16Array(e.
buffer,e.byteOffset,c/2),u=d?.budget.reserveCpu(l.length*4,"fp16-conversion");return u&&d.temporary.add(u),ue(r,l.length*
4,b=>{const _=new Float32Array(b);for(let g=0;g<l.length;g++)_[g]=G(l[g])},{ownedBuffers:d?.ownedBuffers??null})}})}function ne(r,i,t){
return Y(t,s=>{const{dtype:d,offset:n,size:h}=i,c=N(r,n,h,s);if(d===0){const u=new Float32Array(c.buffer,c.byteOffset,h/
4);return W(s,h,"cpu-tensor-copy",()=>new Float32Array(u))}const e=new Uint16Array(c.buffer,c.byteOffset,h/2),l=W(s,e.length*
4,"cpu-fp16-conversion",()=>new Float32Array(e.length));for(let u=0;u<e.length;u++)l[u]=G(e[u]);return l})}const H=Object.
freeze(["image_estimator."]);function se(r,i,t,s=H,d=null){const n=new Map;let h=!1,c=0,e=0;for(const[u,b]of r)!t.has(u)||
s.some(g=>u.startsWith(g))?(n.set(u,Y(d,g=>{const S=N(i,b.offset,b.size,g);return W(g,b.size,"retained-raw-copy",()=>S.slice())})),
c+=b.size):e+=b.size;return Array.isArray(i?.chunks)&&(i.chunks.length=0,i.offsets.length=0),{retained:n,rawBytes:u=>{if(h)
throw new Error("SF3D weights are disposed");const b=n.get(u);if(!b)throw new Error(r.has(u)?`tensor ${u} was uploaded a\
t load and its raw bytes were released; lazy raw access covers ${s.join(", ")}`:`Missing weight: ${u}`);return b},retainedBytes:c,
droppedBytes:e,dispose(){h=!0,n.clear()}}}function le(r,i,t){return N(r,i,t)}function N(r,i,t,s=null){if(r instanceof ArrayBuffer)
return new Uint8Array(r,i,t);const{chunks:d,offsets:n}=r;let h=-1;for(let u=0;u<n.length;u++)if(n[u]+d[u].length>i){h=u;
break}if(h===-1)throw new Error(`Weight data offset ${i} (size ${t}) is beyond end of file (${r.totalSize} bytes)`);const c=i-
n[h];if(c+t<=d[h].length){if((d[h].byteOffset+c)%4!==0){const b=W(s,t,"aligned-tensor-copy",()=>new Uint8Array(t),s?.temporary);
return b.set(d[h].subarray(c,c+t)),b}return d[h].subarray(c,c+t)}const e=W(s,t,"cross-chunk-tensor-copy",()=>new Uint8Array(
t),s?.temporary);let l=0;for(let u=h;u<d.length&&l<t;u++){const b=Math.max(0,i+l-n[u]),_=d[u].length-b,g=Math.min(_,t-l);
e.set(d[u].subarray(b,b+g),l),l+=g}return e}async function fe(){throw new Error("PeerCompute requires artifact-backed SF\
3D weights")}async function de(r,i){const t=new Set,s=new Map,d=new Map;let n=!1,h=0,c=0;const e={retained:s,get retainedBytes(){
return h},get droppedBytes(){return c},rawBytes(l){if(n||!s.has(l))throw new Error("SF3D raw tensor is unavailable: "+l);
return s.get(l)},dispose(){n=!0,s.clear()}};try{const l=X(r,null,i.tensors,new Set,null,{dryRun:!0});for(const[u,b]of i.
tensors){if(!l.has(u)||H.some($=>u.startsWith($))?(s.set(u,await i.readTensor(u)),h+=b.size):c+=b.size,!l.has(u))continue;
const g=b.dtype===1?b.size*2:b.size;if(g>r.limits.maxBufferSize||g>r.limits.maxStorageBufferBindingSize)throw new Error(
"SF3D tensor exceeds device buffer limits: "+u);const S=V(r,g,0,"sf3d-weight:"+u);t.add(S),d.set(u,S),await i.consumeTensor(
u,async($,p)=>{if(b.dtype===0)r.queue.writeBuffer(S,p,$);else{const k=new DataView($.buffer,$.byteOffset,$.byteLength),m=new Float32Array(
$.byteLength/2);for(let A=0;A<m.length;A++)m[A]=G(k.getUint16(A*2,!0));r.queue.writeBuffer(S,p*2,m)}await r.queue.onSubmittedWorkDone()})}
return X(r,null,i.tensors,t,null,{buffers:d,compact:e,report:i.report})}catch(l){e.dispose();const u=Q(t);throw u.length?
new AggregateError([l,...u],"SF3D artifact load cleanup failed",{cause:l}):l}}function X(r,i,t,s,d=null,n=null){const h=(f,w)=>{
const o=oe(r,f,w,d);return s.add(o),o},c=new Set,e=f=>{const w=t.get(f);if(!w)throw new Error(`Missing weight: ${f}`);return c.
add(f),n?.references?n.references(f):n?.dryRun?{}:n?n.buffers.get(f):h(i,w)},l=f=>{const w=t.get(f);return w?(c.add(f),n?.
references?n.references(f):n?.dryRun?{}:n?n.buffers.get(f):h(i,w)):null},u={imageMean:e("image_tokenizer.image_mean"),imageStd:e(
"image_tokenizer.image_std"),patchEmbed:{weight:e("image_tokenizer.model.embeddings.patch_embeddings.projection.weight"),
bias:e("image_tokenizer.model.embeddings.patch_embeddings.projection.bias")},clsToken:e("image_tokenizer.model.embedding\
s.cls_token"),posEmbed:e("image_tokenizer.model.embeddings.position_embeddings"),layernorm:{weight:e("image_tokenizer.mo\
del.layernorm.weight"),bias:e("image_tokenizer.model.layernorm.bias")},blocks:[]};for(let f=0;f<24;f++){const w=`image_t\
okenizer.model.encoder.layer.${f}`;u.blocks.push({norm1:{weight:e(`${w}.norm1.weight`),bias:e(`${w}.norm1.bias`)},attn:{
q:{weight:e(`${w}.attention.attention.query.weight`),bias:e(`${w}.attention.attention.query.bias`)},k:{weight:e(`${w}.at\
tention.attention.key.weight`),bias:e(`${w}.attention.attention.key.bias`)},v:{weight:e(`${w}.attention.attention.value.\
weight`),bias:e(`${w}.attention.attention.value.bias`)},proj:{weight:e(`${w}.attention.output.dense.weight`),bias:e(`${w}\
.attention.output.dense.bias`)}},layerScale1:e(`${w}.layer_scale1.lambda1`),norm2:{weight:e(`${w}.norm2.weight`),bias:e(
`${w}.norm2.bias`)},mlp:{fc1:{weight:e(`${w}.mlp.fc1.weight`),bias:e(`${w}.mlp.fc1.bias`)},fc2:{weight:e(`${w}.mlp.fc2.w\
eight`),bias:e(`${w}.mlp.fc2.bias`)}},layerScale2:e(`${w}.layer_scale2.lambda1`),norm1Mod:{weight:e(`${w}.norm1_modulati\
on.linear2.weight`),bias:e(`${w}.norm1_modulation.linear2.bias`)},norm2Mod:{weight:e(`${w}.norm2_modulation.linear2.weig\
ht`),bias:e(`${w}.norm2_modulation.linear2.bias`)}})}const b={weight:e("camera_embedder.linear.weight"),bias:e("camera_e\
mbedder.linear.bias")},_={embeddings:e("tokenizer.embeddings")},g={latentInit:e("backbone.latent_init"),normTriplane:{weight:e(
"backbone.norm_triplane.weight"),bias:e("backbone.norm_triplane.bias")},projTriplane:{weight:e("backbone.proj_triplane.w\
eight"),bias:e("backbone.proj_triplane.bias")},normImage:{weight:e("backbone.norm_image.weight"),bias:e("backbone.norm_i\
mage.bias")},projImage:{weight:e("backbone.proj_image.weight"),bias:e("backbone.proj_image.bias")},normLatent:{weight:e(
"backbone.norm_latent.weight"),bias:e("backbone.norm_latent.bias")},projLatent:{weight:e("backbone.proj_latent.weight"),
bias:e("backbone.proj_latent.bias")},projOut:{weight:e("backbone.proj_out.weight"),bias:e("backbone.proj_out.bias")},mainBlocks:[]};
for(let f=0;f<4;f++){let o=function(a){return{attn:{wq:e(`${a}.attn.wq.weight`),wk:e(`${a}.attn.wk.weight`),wv:e(`${a}.a\
ttn.wv.weight`),proj:{weight:e(`${a}.attn.proj.weight`),bias:e(`${a}.attn.proj.bias`)}},normZ1:{weight:e(`${a}.norm_z1.w\
eight`),bias:e(`${a}.norm_z1.bias`)},normX:t.has(`${a}.norm_x.weight`)?{weight:e(`${a}.norm_x.weight`),bias:e(`${a}.norm\
_x.bias`)}:null,normZ2:{weight:e(`${a}.norm_z2.weight`),bias:e(`${a}.norm_z2.bias`)},ff:{geglu:{weight:e(`${a}.ff.net.0.\
proj.weight`),bias:e(`${a}.ff.net.0.proj.bias`)},proj:{weight:e(`${a}.ff.net.2.weight`),bias:e(`${a}.ff.net.2.bias`)}}}},
y=function(a){return{norm1:{weight:e(`${a}.norm1.weight`),bias:e(`${a}.norm1.bias`)},attn1:{wq:e(`${a}.attn1.wq.weight`),
wk:e(`${a}.attn1.wk.weight`),wv:e(`${a}.attn1.wv.weight`),proj:{weight:e(`${a}.attn1.proj.weight`),bias:e(`${a}.attn1.pr\
oj.bias`)}},norm2:{weight:e(`${a}.norm2.weight`),bias:e(`${a}.norm2.bias`)},attn2:{wq:e(`${a}.attn2.wq.weight`),wk:e(`${a}\
.attn2.wk.weight`),wv:e(`${a}.attn2.wv.weight`),proj:{weight:e(`${a}.attn2.proj.weight`),bias:e(`${a}.attn2.proj.bias`)}},
norm3:{weight:e(`${a}.norm3.weight`),bias:e(`${a}.norm3.bias`)},ff:{geglu:{weight:e(`${a}.ff.net.0.proj.weight`),bias:e(
`${a}.ff.net.0.proj.bias`)},proj:{weight:e(`${a}.ff.net.2.weight`),bias:e(`${a}.ff.net.2.bias`)}}}};const w=`backbone.ma\
in_blocks.${f}`;g.mainBlocks.push({fuseBlockIn:o(`${w}.fuse_block_in`),transformerBlocks:[0,1,2].map(a=>y(`${w}.transfor\
mer_block.${a}`)),fuseBlockOut:o(`${w}.fuse_block_out`)})}const S={convLayers:[{weight:e("post_processor.upsample.0.weig\
ht"),bias:e("post_processor.upsample.0.bias")},{weight:e("post_processor.upsample.2.weight"),bias:e("post_processor.upsa\
mple.2.bias")},{weight:e("post_processor.upsample.4.weight"),bias:e("post_processor.upsample.4.bias")},{weight:e("post_p\
rocessor.upsample.6.weight"),bias:e("post_processor.upsample.6.bias")}]},$={heads:{}};for(const f of["density","features",
"perturb_normal","vertex_offset"]){const w=[];for(let o=0;;o+=2){const y=l(`decoder.heads.${f}.${o}.weight`),a=l(`decode\
r.heads.${f}.${o}.bias`);if(!y)break;w.push({weight:y,bias:a})}$.heads[f]=w}const p={heads:{}};for(const f of["roughness",
"metallic"]){const w=[];for(let o=0;o<3;o++){const y=[];for(let a=0;;a+=2){const B=l(`image_estimator.heads.${f}.${o}.${a}\
.weight`),v=l(`image_estimator.heads.${f}.${o}.${a}.bias`);if(!B)break;y.push({weight:B,bias:v})}y.length>0&&w.push(y)}p.
heads[f]=w}if(n?.dryRun)return c;const k={imageTokenizer:u,cameraEmbedder:b,tokenizer:_,backbone:g,postProcessor:S,decoder:$,
imageEstimator:p};if(n?.references)return k;console.log(`Loaded ${t.size} SF3D tensors from weight file`);const m=n?.compact??
se(t,i,c,H,d);console.log(`Retained ${(m.retainedBytes/1048576).toFixed(0)} MB of raw tensor bytes for lazy readers; rel\
eased ${(m.droppedBytes/1048576).toFixed(0)} MB of streamed chunks`);const A=new Map;let z=!1;const T=(f=r)=>{if(z)throw new Error(
"SF3D weights are disposed");if(f!==r)throw new Error("SF3D weights belong to a different GPUDevice")},C=f=>{T();const w=t.
get(f);if(!w)throw new Error(`Missing weight: ${f}`);return{dtype:w.dtype,offset:0,size:w.size}},D=f=>(T(),A.has(f)||A.set(
f,h(m.rawBytes(f).buffer,C(f))),A.get(f)),x=f=>(T(),ne(m.rawBytes(f).buffer,C(f),d)),U=f=>(T(),t.has(f)?D(f):null),P=f=>(T(),
t.has(f)),E=()=>{if(z&&s.size===0)return 0;z=!0;const f=s.size,w=Q(s);A.clear(),m.dispose();for(const o of d?.ownedCpu??
[])o.release();if(d?.ownedCpu.clear(),w.length)throw new AggregateError(w,"SF3D weight cleanup encountered failures");return f};
return{...k,...n?{loadingReport:n.report}:{},dispose:E,_assertActive:T,_rawGet:D,_rawGetCPU:x,_rawTryGet:U,_rawHas:P}}function ae(r,i){
if(!re(i))throw TypeError("tensor-ranges requires authenticated loader budget");i.assertDevice(r);const t=new Set,s=new Set;
return{ownedBuffers:t,ownedCpu:s,context:{budget:i,ownedCpu:s,ownedBuffers:t},cleanup:h=>{const c=Q(t);for(const e of s)
e.release();if(s.clear(),c.length)throw new AggregateError(h?[h,...c]:c,"SF3D range cleanup encountered failures",{cause:h})}}}
async function he(r,i,t){const s=new Uint16Array(i.buffer,i.byteOffset,i.byteLength/2),d=s.length*4,n=t.context.budget.reserveCpu(
d,"fp16-conversion");t.ownedCpu.add(n);const h=new Float32Array(Math.min(s.length,262144)),c=V(r,d,0,"complete-phase-fp1\
6-upload");t.ownedBuffers.add(c);for(let e=0;e<s.length;e+=h.length){const l=Math.min(h.length,s.length-e);for(let u=0;u<
l;u++)h[u]=G(s[e+u]);r.queue.writeBuffer(c,e*4,h,0,l),await r.queue.onSubmittedWorkDone()}return n.release(),t.ownedCpu.
delete(n),c}async function we(r,i,t,s){const d=i.tensors.get(t),n=d.size*2,h=s.context.budget.reserveCpu(n,"fp16-convers\
ion");let c;const e={release(){h.release(),c=null}};s.ownedCpu.add(e),c=new Float32Array(Math.min(d.size/2,262144));const l=new Uint8Array(
c.buffer,0,c.length*2),u=new Uint16Array(c.buffer,0,c.length),b=V(r,n,0,"complete-phase-fp16-upload");s.ownedBuffers.add(
b);let _=0,g=0;const S=async()=>{if(_%2)throw Error("complete FP16 prefix has an incomplete element");const $=_/2;for(let p=$-
1;p>=0;p--)c[p]=G(u[p]);r.queue.writeBuffer(b,g,c,0,$),await r.queue.onSubmittedWorkDone(),g+=$*4,_=0};if(await i.consumeTensor(
t,async $=>{for(let p=0;p<$.length;){const k=Math.min(l.length-_,$.length-p);l.set($.subarray(p,p+k),_),_+=k,p+=k,_===l.
length&&await S()}}),_&&await S(),g!==n)throw Error("complete FP16 source upload coverage mismatch");return e.release(),
s.ownedCpu.delete(e),b}async function ie(r,i,t,s,{retain:d=!1,streamFp16Uploads:n=!1}={}){const h=i.tensors.get(t);if(n&&
h.dtype===1&&!d){const e=await we(r,i,t,s);return await r.queue.onSubmittedWorkDone(),{buffer:e}}let c=await i.readTensor(
t);try{const e=i.tensors.get(t),l=n&&e.dtype===1?await he(r,c.bytes,s):oe(r,c.bytes.buffer,{...e,offset:0},s.context);if(s.
ownedBuffers.add(l),await r.queue.onSubmittedWorkDone(),d){s.ownedCpu.add(c);const u=c.bytes;return c=null,{buffer:l,bytes:u}}
return{buffer:l}}finally{c?.release(),c&&(c.bytes=null)}}async function pe(r,i,t,s={}){const d=ae(r,s.memoryBudget);if(!Array.
isArray(t)||!t.length||new Set(t).size!==t.length)throw TypeError("explicit unique nonempty tensorNames required");try{const n=await te(
i,s),h=new Map;for(const c of t)if(!n.tensors.has(c))throw Error("Missing weight: "+c);for(const c of t)h.set(c,(await ie(
r,n,c,d)).buffer);return{tensors:h,loadingReport:n.report,dispose:()=>{d.cleanup(),h.clear()}}}catch(n){throw d.cleanup(
n),n}}async function ge(r,i,t={}){const s=t.streamFp16Uploads===void 0?!1:t.streamFp16Uploads;if(typeof s!="boolean")throw TypeError(
"explicit boolean phase FP16 upload mode required");const d=t.onAfterWeightsLoaded;if(d!==void 0&&typeof d!="function")throw TypeError(
"weight observation callback must be a function");if(!re(t.memoryBudget))throw TypeError("authenticated loader budget re\
quired");t.memoryBudget.assertDevice(r);const n=await te(),h=new WeakMap;n.report.gpuFp16UploadMode=s?"queue-write-compl\
ete-source-prefix-v1":"direct-mapped-v1";const c=X(r,null,n.tensors,new Set,null,{references(p){const k=Object.freeze({});
return h.set(k,p),k}});let e=!1,l=!1,u=!1,b=null;const _=[],g=()=>{if(l)throw Error("weight phase source is disposed");if(u)
throw Error("weight phase source queue cleanup is quarantined");if(e)throw Error("weight phase source has an active phas\
e")},S=(p,k,m=null)=>{if(p===null)return null;if(!p||typeof p!="object")throw TypeError("authenticated weight phase sele\
ction required");if(h.has(p)){const z=h.get(p);return k.add(z),m?m.get(z):p}if(Array.isArray(p))return p.map(z=>S(z,k,m));
const A=Object.entries(p);if(!A.length)throw TypeError("authenticated weight phase selection required");return Object.fromEntries(
A.map(([z,T])=>[z,S(T,k,m)]))},$=async(p,k,m)=>{if(g(),typeof k!="function")throw TypeError("weight phase computation re\
quired");const A=new Set;if(p&&typeof p=="object"&&!Object.keys(p).length)throw TypeError("nonempty weight phase selecti\
on required");const z=S(p,A);if(!A.size)throw TypeError("nonempty weight phase selection required");e=!0;const T=ae(r,t.
memoryBudget),C=new Map,D={tensorNames:[...A],storageKind:m,status:"loading",retirementAuthority:m==="cpu-fp32"?"owned C\
PU lease release; not physical reclamation":"API destruction after queue drain; not physical reclamation"};_.push(D);let x,
U,P=!1;try{for(const E of A)if(m==="cpu-fp32"){const f=await n.readTensor(E);try{C.set(E,ne(f.bytes.buffer,{...n.tensors.
get(E),offset:0},T.context))}finally{f.release(),f.bytes=null}}else C.set(E,(await ie(r,n,E,T,{streamFp16Uploads:s})).buffer);
d&&(T.ownedBuffers.size&&await r.queue.onSubmittedWorkDone(),D.status="observing-loaded-weights",await d(Object.freeze({
storageKind:m,sourceETag:n.report.sourceETag,tensors:Object.freeze([...C].map(([E,f])=>Object.freeze({name:E,value:f,...n.
tensors.get(E)})))}))),D.status="computing",x=await k(S(z,new Set,C))}catch(E){P=!0,U=E,D.error=String(E?.message??E)}try{
T.ownedBuffers.size&&await r.queue.onSubmittedWorkDone(),T.cleanup(),C.clear(),D.status=P?"failed-retired":"completed-re\
tired"}catch(E){u=!0,b=T,D.status="cleanup-unresolved",D.cleanupError=String(E?.message??E),U=P?new AggregateError([U,E],
"weight phase failed and cleanup is unresolved",{cause:U}):E,P=!0}finally{e=!1}if(P)throw U;return x};return Object.freeze(
{template:c,loadingReport:n.report,phases:_,reference(p){if(g(),typeof p!="string"||!n.tensors.has(p))throw Error("Missi\
ng weight: "+p);const k=Object.freeze({});return h.set(k,p),k},describe(p){g();const k=new Set;if(S(p,k),!k.size)throw TypeError(
"nonempty weight phase selection required");return Object.freeze([...k].map(m=>Object.freeze({name:m,...n.tensors.get(m)})))},
withWeights(p,k){return $(p,k,"gpu-buffer")},withCpuWeights(p,k){return $(p,k,"cpu-fp32")},async dispose(){if(e)throw Error(
"cannot dispose an active weight phase");l&&!b||(l=!0,b&&(await r.queue.onSubmittedWorkDone(),b.cleanup(),b=null))}})}const ke=Object.
freeze(Object.defineProperty({__proto__:null,LAZILY_READ_TENSOR_PREFIXES:H,compactRetainedTensors:se,createWeightPhaseSource:ge,
extractBytesFromChunks:le,loadWeightTensorUnit:pe,loadWeights:fe,loadWeightsFromSource:de},Symbol.toStringTag,{value:"Mo\
dule"}));export{me as c,re as i,fe as l,ke as w};
