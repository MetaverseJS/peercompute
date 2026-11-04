import{_ as J}from"./index-BbhYZWtV.js";import{c as se}from"./GgufArtifactReader-D-AKJ8ex.js";import{ai as w,ag as V}from"./main-BDHli8sO.js";
import{validateDiffusionManifest as K,DIFFUSION_RUNTIME_VERSION as oe,validateDiffusionRuntimeAssets as ie,normalizeDiffusionInput as ae}from"./runtimeDefinition-V89Xz8gA.js";
const X=256*64,$=14.6146,z=Object.freeze([999,759,499,259]);function ue(e){if(!Number.isInteger(e)||e<0||e>4294967295)throw new Error(
"Seed must be uint32");let t=e>>>0;return()=>{t=t+1831565813>>>0;let n=Math.imul(t^t>>>15,t|1);return n^=n+Math.imul(n^n>>>
7,n|61),((n^n>>>14)>>>0)/4294967296}}function Y(e,t=1){const n=new Float32Array(X);for(let r=0;r<n.length;r+=2){const s=Math.
sqrt(-2*Math.log(Math.max(e(),Number.EPSILON)))*t,o=2*Math.PI*e();n[r]=s*Math.cos(o),n[r+1]=s*Math.sin(o)}return n}function S(e){
if(!(e instanceof Float32Array)||e.length!==X)throw new Error("Invalid diffusion latent tensor");for(const t of e)if(!Number.
isFinite(t))throw new Error("Nonfinite diffusion tensor");return e}function de(e){return S(e),e.map(t=>t/Math.sqrt($**2+
1))}function ce(e,t){return S(e),S(t),e.map((n,r)=>(n-$*t[r])/.18215)}const H=(()=>{const e=new Float64Array(1e3);let t=1;
const n=Math.sqrt(85e-5),r=Math.sqrt(.012);for(let s=0;s<e.length;s++){const o=(n+(r-n)*s/(e.length-1))**2;t*=1-o,e[s]=t}
return e})();function fe(e,t,n,r){if(S(e),S(t),!Number.isInteger(n)||n<0||n>=z.length)throw new Error("Invalid LCM step");
const s=z[n],o=H[s],i=s*10,f=.25/(i**2+.25),a=i/Math.sqrt(i**2+.25),p=n===z.length-1,u=p?1:H[z[n+1]],m=p?null:Y(r);return e.
map((d,I)=>{const l=(d-Math.sqrt(1-o)*t[I])/Math.sqrt(o),D=a*l+f*d;return p?D:Math.sqrt(u)*D+Math.sqrt(1-u)*m[I]})}function le(e,t){
if(!(e instanceof Float32Array)||!Array.isArray(t)||t.length!==4||t[0]!==1||t[1]!==3||t[2]!==512||t[3]!==512||e.length!==
3*512*512)throw new Error("Diffusion decoder must produce float32 [1,3,512,512]");const n=512*512,r=new Uint8Array(n*4);
for(let s=0;s<n;s++){for(let o=0;o<3;o++){const i=e[o*n+s];if(!Number.isFinite(i))throw new Error("Diffusion decoder pro\
duced nonfinite pixels");r[s*4+o]=Math.round(Math.min(1,Math.max(0,i/2+.5))*255)}r[s*4+3]=255}return{width:512,height:512,
channels:4,data:r}}const Q=[1,4,64,64],he=2*1024**3,pe=()=>new Promise(e=>setTimeout(e,0));async function W(e,t,n){if(!t||
t.size<=0||t.size>=he)throw new Error("Diffusion file exceeds the loader buffer budget");const r=new Uint8Array(t.size);
for(let s=0;s<t.size;s+=4*1024**2){w(n);const o=await e.read(t.path,s,Math.min(4*1024**2,t.size-s),{signal:n});r.set(o,s)}
return r}function me(e,t){const n=e.createCommandEncoder.bind(e),r=e.queue.submit.bind(e.queue);e.createCommandEncoder=(...s)=>{
const o=n(...s),i=o.beginComputePass.bind(o);return o.beginComputePass=(...f)=>{const a=i(...f);for(const p of["dispatch\
Workgroups","dispatchWorkgroupsIndirect"]){const u=a[p].bind(a);a[p]=(...m)=>{const d=u(...m);return t.gpuDispatches++,d}}
return a},o},e.queue.submit=(...s)=>{const o=r(...s);return t.gpuSubmissions++,o}}function we(e,t){const n=e.requestDevice;
return e.requestDevice=async function(...r){const s=await n.apply(this,r);return t(s),s},()=>{e.requestDevice=n}}async function ge({
session:e,inputs:t,device:n,signal:r,own:s,markLost:o}){w(r);let i;try{i=await e.run(t),Object.values(i).forEach(s),await n.
queue.onSubmittedWorkDone()}catch(f){throw o(),new Error(`Model session lost: diffusion GPU execution failed: ${String(f.
message??f).slice(0,200)}`)}return w(r),i}function be(e,t){return Array.isArray(e.inputMetadata)?e.inputMetadata.find(n=>n.
name===t):e.inputMetadata?.[t]}function Z(e,t,n,r,s){const o=be(t,n)?.type;if(o==="int32")return new e.Tensor("int32",Int32Array.
from(r,Number),s);if(o==="int64")return new e.Tensor("int64",BigInt64Array.from(r,BigInt),s);if(o==="float32")return new e.
Tensor("float32",Float32Array.from(r,Number),s);throw new Error(`Unsupported diffusion input type for ${n}: ${o}`)}async function ye({
manifest:e,runtimeAssets:t,artifactPort:n,signal:r,onProgress:s,gpu:o=globalThis.navigator?.gpu,loadOrt:i=()=>J(()=>import("./ort.all.bundle.min-Yg0WefYz.js"),
[],import.meta.url),loadTokenizer:f=()=>J(()=>import("./transformers.web-DGNMtDcj.js"),[],import.meta.
url).then(a=>a.CLIPTokenizer)}){const{trusted:a}=K(e),p={},u={gpuDispatches:0,gpuSubmissions:0,generatedRequests:0};let m,
d,I,l,D,q=!1,C=!1,v=!1;async function j(){if(q)return;q=!0,D?.(),D=null,d?.close();let h;for(const g of Object.values(p))
try{await g.release()}catch(k){h??=k}if(m?.destroy(),h)throw h}try{const h=await o?.requestAdapter({powerPreference:"hig\
h-performance"});if(w(r),!h||h.isFallbackAdapter||h.info?.isFallbackAdapter||!h.features.has("shader-f16"))throw new Error(
"Diffusion requires a hardware WebGPU adapter with shader-f16; CPU fallback is disabled");if(u.adapter={vendor:h.info?.vendor??
"",architecture:h.info?.architecture??"",isFallbackAdapter:!1,requiredFeatures:["shader-f16"]},l=await i(),l.env.versions.
web!==oe)throw new Error("Unexpected diffusion ORT runtime version");l.env.wasm.proxy=!1,l.env.wasm.numThreads=1,l.env.wasm.
wasmPaths=t,l.env.webgpu.adapter=h,D=we(h,c=>{m=c,u.runtimeFeatures=[...m.features],me(m,u),m.lost.then(()=>{q||(v=!0)})}),
l.env.logLevel="error",d=se(n,{manifest:e,signal:r,maxReadBytes:4*1024**2,maxReads:1,maxQueuedReads:2,readTimeoutMs:6e4});
const g=c=>e.files.find(_=>_.path===c),k=JSON.parse(new TextDecoder().decode(await W(d,g("tokenizer/tokenizer.json"),r))),
E=JSON.parse(new TextDecoder().decode(await W(d,g("tokenizer/tokenizer_config.json"),r))),R=await f();I=new R(k,E),I.pad_token_id=
a.padTokenId;for(const c of["unet","text_encoder","vae_decoder"]){w(r),s?.({type:"model-load",stage:c,loaded:0,total:g(`${c}\
/model.onnx`).size});let _=await W(d,g(`${c}/model.onnx`),r);const P=a.pipeline==="sd-turbo"?{unet:{batch_size:1,num_channels:4,
height:64,width:64,sequence_length:77},text_encoder:{batch_size:1},vae_decoder:{batch_size:1,num_channels_latent:4,height_latent:64,
width_latent:64}}:{};if(p[c]=await l.InferenceSession.create(_,{executionProviders:["webgpu"],enableMemPattern:!1,enableCpuMemArena:!1,
...P[c]?{freeDimensionOverrides:P[c]}:{},extra:{session:{disable_prepacking:"1",use_device_allocator_for_initializers:"1"}}}),
!m||l.env.webgpu.device!==m||!m.features.has("shader-f16"))throw new Error("ORT did not create the admitted WebGPU devic\
e");D?.(),D=null,_=null,w(r),s?.({type:"model-load",stage:c,loaded:g(`${c}/model.onnx`).size,total:g(`${c}/model.onnx`).
size})}if(d.close(),u.artifactReads=d.getStats(),d=null,await m.queue.onSubmittedWorkDone(),w(r),v)throw new Error("GPU \
device lost while loading diffusion")}catch(h){try{await j()}catch(g){throw new AggregateError([h,g],"Diffusion loader c\
leanup failed")}throw h}return{evidence:u,get lost(){return v},dispose:j,async generate({prompt:h,seed:g,steps:k,signal:E,
onProgress:R}){if(q||v)throw new Error("Model session lost: diffusion device is unavailable");if(C)throw new Error("Diff\
usion engine is already generating");C=!0;const c=new Set,_=b=>(c.add(b),b),P={dispatches:u.gpuDispatches,submissions:u.
gpuSubmissions},U=async(b,y)=>{w(E);const O=u.gpuDispatches,x=await ge({session:b,inputs:y,device:m,signal:E,own:_,markLost:()=>{
v=!0}});if(w(E),v)throw new Error("GPU device lost during diffusion");if(u.gpuDispatches<=O)throw new Error("Diffusion s\
tage did not execute on WebGPU");return await pe(),w(E),x},F=(b,y)=>{w(E),R?.({type:"diffusion-progress",stage:b,step:y,
steps:k})};try{F("text-encoder",0);let y=I(h,{padding:"max_length",max_length:77,truncation:!0,return_tensor:!1}).input_ids;
if(Array.isArray(y[0])&&(y=y[0]),!Array.isArray(y)||y.length!==77||y.some(M=>!Number.isInteger(M)||M<0||M>49407))throw new Error(
"Invalid CLIP token sequence");const O=_(Z(l,p.text_encoder,"input_ids",y,[1,77])),{last_hidden_state:x}=await U(p.text_encoder,
{input_ids:O});if(!x)throw new Error("Diffusion text encoder did not return hidden states");const B=ue(g);let A=Y(B,a.pipeline===
"sd-turbo"?$:1);for(let M=0;M<k;M++){F("denoise",M);const L=_(new l.Tensor("float32",a.pipeline==="sd-turbo"?de(A):A,Q)),
re=a.pipeline==="sd-turbo"?999:z[M],G=_(Z(l,p.unet,"timestep",[re],[1])),{out_sample:T}=await U(p.unet,{sample:L,timestep:G,
encoder_hidden_states:x});if(!T||T.type!=="float32")throw new Error("Invalid diffusion UNet output");A=a.pipeline==="sd-\
turbo"?ce(A,T.data):fe(A,T.data,M,B),T.dispose(),c.delete(T),L.dispose(),c.delete(L),G.dispose(),c.delete(G)}F("decode",
k);const ee=_(new l.Tensor("float32",A,Q)),te=a.pipeline==="sd-turbo"?"latent_sample":"latent",N=(await U(p.vae_decoder,
{[te]:ee}))[a.pipeline==="sd-turbo"?"sample":"image"];if(!N||N.type!=="float32")throw new Error("Invalid diffusion image\
 tensor");const ne=le(N.data,N.dims);return w(E),u.generatedRequests++,{text:"",image:ne,seed:g,steps:k,gpuDispatches:u.
gpuDispatches-P.dispatches,gpuSubmissions:u.gpuSubmissions-P.submissions}}catch(b){throw E?.aborted?b:(v=!0,new Error(`M\
odel session lost: ${String(b.message??b).slice(0,300)}`))}finally{for(const b of c)try{b.dispose()}catch{}C=!1}}}}function _e(){
if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("Diffusion requires a Comput\
eManager-owned worker")}function Ie({createEngine:e=ye,assertWorker:t=_e,baseUrl:n=globalThis.location?.href}={}){const r=new Map,
s=o=>({sessionId:o.sessionId,manifestCid:o.manifestCid,status:o.engine?.lost?"lost":o.status,workerId:o.workerId,...o.engine?.
evidence});return async function(i,f={}){if(t(),V(i?.sessionId),w(f.signal),i.command==="load"){if(r.size)throw new Error(
"Unload the resident diffusion model first");const{manifest:u}=K(i.manifest),m=ie(i.runtimeAssets,n),d={sessionId:i.sessionId,
manifestCid:i.manifestCid,manifest:u,status:"loading",workerId:f.workerId,engine:null};r.set(i.sessionId,d);try{return d.
engine=await e({manifest:u,runtimeAssets:m,artifactPort:i.artifactPort,signal:f.signal,onProgress:f.emitProgress}),w(f.signal),
d.status="ready",s(d)}catch(I){try{await d.engine?.dispose(),r.delete(i.sessionId)}catch(l){throw d.status="lost",new AggregateError(
[I,l],"Model session lost: diffusion cleanup failed")}throw I}}const a=r.get(i.sessionId);if(!a)throw new Error("Diffusi\
on session is not loaded");if(i.command==="status")return s(a);if(i.command==="unload")return a.status="unloading",await a.
engine.dispose(),r.delete(i.sessionId),{sessionId:i.sessionId,status:"unloaded"};if(i.command!=="generate")throw new Error(
"Unknown diffusion command");if(V(i.requestId),a.status!=="ready"||a.engine.lost)throw new Error("Model session lost: di\
ffusion is not ready");const p=ae(i,a.manifest);a.status="generating";try{const u=await a.engine.generate({...p,signal:f.
signal,onProgress:f.emitProgress});return w(f.signal),{...u,sessionId:i.sessionId,requestId:i.requestId,workerId:a.workerId}}catch(u){
throw u instanceof WebAssembly.RuntimeError?(a.status="lost",new Error(`Model session lost: diffusion native runtime fai\
led: ${u.message}`)):(/Model session lost/.test(u?.message??"")&&(a.status="lost"),u)}finally{a.status!=="lost"&&(a.status=
a.engine.lost?"lost":"ready")}}}const Ae=Ie();export{Ie as createDiffusionTaskHandler,Ae as handleModelTask};
