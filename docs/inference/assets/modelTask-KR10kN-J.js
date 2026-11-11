import{_ as H}from"./index-L3PMMKML.js";import{c as ue}from"./GgufArtifactReader-CuyxhwUc.js";import{aP as ee,aw as b,aQ as de,
au as Y,aR as ce,aS as fe}from"./main-BVBDmgKD.js";const te=256*64,B=14.6146,U=Object.freeze([999,759,499,259]);function le(e){
if(!Number.isInteger(e)||e<0||e>4294967295)throw new Error("Seed must be uint32");let t=e>>>0;return()=>{t=t+1831565813>>>
0;let r=Math.imul(t^t>>>15,t|1);return r^=r+Math.imul(r^r>>>7,r|61),((r^r>>>14)>>>0)/4294967296}}function re(e,t=1){const r=new Float32Array(
te);for(let n=0;n<r.length;n+=2){const s=Math.sqrt(-2*Math.log(Math.max(e(),Number.EPSILON)))*t,o=2*Math.PI*e();r[n]=s*Math.
cos(o),r[n+1]=s*Math.sin(o)}return r}function x(e){if(!(e instanceof Float32Array)||e.length!==te)throw new Error("Inval\
id diffusion latent tensor");for(const t of e)if(!Number.isFinite(t))throw new Error("Nonfinite diffusion tensor");return e}
function pe(e){return x(e),e.map(t=>t/Math.sqrt(B**2+1))}function he(e,t){return x(e),x(t),e.map((r,n)=>(r-B*t[n])/.18215)}
const Z=(()=>{const e=new Float64Array(1e3);let t=1;const r=Math.sqrt(85e-5),n=Math.sqrt(.012);for(let s=0;s<e.length;s++){
const o=(r+(n-r)*s/(e.length-1))**2;t*=1-o,e[s]=t}return e})();function me(e,t,r,n){if(x(e),x(t),!Number.isInteger(r)||r<
0||r>=U.length)throw new Error("Invalid LCM step");const s=U[r],o=Z[s],u=s*10,p=.25/(u**2+.25),i=u/Math.sqrt(u**2+.25),f=r===
U.length-1,d=f?1:Z[U[r+1]],c=f?null:re(n);return e.map((a,m)=>{const w=(a-Math.sqrt(1-o)*t[m])/Math.sqrt(o),_=i*w+p*a;return f?
_:Math.sqrt(d)*_+Math.sqrt(1-d)*c[m]})}function we(e,t){if(!(e instanceof Float32Array)||!Array.isArray(t)||t.length!==4||
t[0]!==1||t[1]!==3||t[2]!==512||t[3]!==512||e.length!==3*512*512)throw new Error("Diffusion decoder must produce float32\
 [1,3,512,512]");const r=512*512,n=new Uint8Array(r*4);for(let s=0;s<r;s++){for(let o=0;o<3;o++){const u=e[o*r+s];if(!Number.
isFinite(u))throw new Error("Diffusion decoder produced nonfinite pixels");n[s*4+o]=Math.round(Math.min(1,Math.max(0,u/2+
.5))*255)}n[s*4+3]=255}return{width:512,height:512,channels:4,data:n}}const K=[1,4,64,64],ge=2*1024**3,be=()=>new Promise(
e=>setTimeout(e,0));async function j(e,t,r){if(!t||t.size<=0||t.size>=ge)throw new Error("Diffusion file exceeds the loa\
der buffer budget");const n=new Uint8Array(t.size);for(let s=0;s<t.size;s+=4*1024**2){b(r);const o=await e.read(t.path,s,
Math.min(4*1024**2,t.size-s),{signal:r});n.set(o,s)}return n}function ye(e,t){const r=e.createCommandEncoder.bind(e),n=e.
queue.submit.bind(e.queue);e.createCommandEncoder=(...s)=>{const o=r(...s),u=o.beginComputePass.bind(o);return o.beginComputePass=
(...p)=>{const i=u(...p);for(const f of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const d=i[f].bind(i);i[f]=(...c)=>{
const a=d(...c);return t.gpuDispatches++,a}}return i},o},e.queue.submit=(...s)=>{const o=n(...s);return t.gpuSubmissions++,
o}}function _e(e,t){const r=e.requestDevice;return e.requestDevice=async function(...n){const s=await r.apply(this,n);return t(
s),s},()=>{e.requestDevice=r}}async function ne({device:e,operation:t,setDeviceCapture:r,markLost:n,stage:s="execution"}){
let o,u,p;const i=[],f=a=>{if(o!==a){if(o)throw new Error("Diffusion changed GPU devices during an operation");o=a;for(const m of[
"validation","out-of-memory","internal"])a.pushErrorScope(m),i.push(m)}};try{if(e&&f(e),r?.(f),u=await t(),!o)throw new Error(
"ORT did not create the admitted GPU device");await o.queue.onSubmittedWorkDone()}catch(a){p=a}finally{r?.(null)}const d=await Promise.
all(i.reverse().map(async a=>{try{return{filter:a,error:await o.popErrorScope()}}catch(m){return{filter:a,error:m,scopeFailed:!0}}})),
c=["out-of-memory","internal","validation"].map(a=>d.find(m=>m.filter===a&&m.error&&!m.scopeFailed)).find(Boolean);if(p??=
d.find(a=>a.scopeFailed)?.error,c||p){const a=c?.error??p,m=c?.filter==="out-of-memory"?"out of memory":c?.filter??"exec\
ution failure",w=c?.filter==="out-of-memory"?`Model session lost: diffusion ${s} GPU out of memory. Close GPU-heavy apps\
 or unload other models, then reload this model.`:`Model session lost: diffusion ${s} GPU ${m}: ${String(a.message??a).slice(
0,240)}`,_=new Error(w,{cause:a});throw _.code=c?.filter==="out-of-memory"?"ERR_DIFFUSION_GPU_OUT_OF_MEMORY":"ERR_DIFFUS\
ION_GPU",n(_),_}return u}function Ee(e,t){const r=n=>t(n.error);return e.addEventListener("uncapturederror",r),()=>e.removeEventListener(
"uncapturederror",r)}async function Ie({session:e,inputs:t,device:r,signal:n,own:s,markLost:o,stage:u="execution"}){b(n);
const p=await ne({device:r,markLost:o,stage:u,operation:async()=>{const i=await e.run(t);return Object.values(i).forEach(
s),i}});return b(n),p}function ve(e,t){return Array.isArray(e.inputMetadata)?e.inputMetadata.find(r=>r.name===t):e.inputMetadata?.[t]}
function X(e,t,r,n,s){const o=ve(t,r)?.type;if(o==="int32")return new e.Tensor("int32",Int32Array.from(n,Number),s);if(o===
"int64")return new e.Tensor("int64",BigInt64Array.from(n,BigInt),s);if(o==="float32")return new e.Tensor("float32",Float32Array.
from(n,Number),s);throw new Error(`Unsupported diffusion input type for ${r}: ${o}`)}async function Me({manifest:e,runtimeAssets:t,
artifactPort:r,signal:n,onProgress:s,gpu:o=globalThis.navigator?.gpu,loadOrt:u=()=>H(()=>import("./ort.all.bundle.min-Yg0WefYz.js"),
[],import.meta.url),loadTokenizer:p=()=>H(()=>import("./transformers.web-CPpHPsUx.js"),[],import.meta.
url).then(i=>i.CLIPTokenizer)}){const{trusted:i}=ee(e),f={},d={gpuDispatches:0,gpuSubmissions:0,generatedRequests:0};let c,
a,m,w,_,G,J,T=!1,R=!1,D=!1;const N=h=>{T||(D=!0,d.gpuFailure||(d.gpuFailure=String(h?.cause?.message??h?.message??h??"GP\
U operation failed").slice(0,400),console.error("Diffusion GPU failure:",d.gpuFailure)))};async function V(){if(T)return;
T=!0,_?.(),_=null,G?.(),G=null,a?.close();let h;for(const y of Object.values(f))try{await y.release()}catch(P){h??=P}if(c?.
destroy(),h)throw h}try{const h=await o?.requestAdapter({powerPreference:"high-performance"});if(b(n),!h||h.isFallbackAdapter||
h.info?.isFallbackAdapter||!h.features.has("shader-f16"))throw new Error("Diffusion requires a hardware WebGPU adapter w\
ith shader-f16; CPU fallback is disabled");if(d.adapter={vendor:h.info?.vendor??"",architecture:h.info?.architecture??"",
isFallbackAdapter:!1,requiredFeatures:["shader-f16"]},w=await u(),w.env.versions.web!==de)throw new Error("Unexpected di\
ffusion ORT runtime version");w.env.wasm.proxy=!1,w.env.wasm.numThreads=1,w.env.wasm.wasmPaths=t,w.env.webgpu.adapter=h,
_=_e(h,l=>{c=l,J?.(c),G=Ee(c,N),d.runtimeFeatures=[...c.features],ye(c,d),c.lost.then(()=>{T||(D=!0)})}),w.env.logLevel=
"error",a=ue(r,{manifest:e,signal:n,maxReadBytes:4*1024**2,maxReads:1,maxQueuedReads:2,readTimeoutMs:6e4});const y=l=>e.
files.find(I=>I.path===l),P=JSON.parse(new TextDecoder().decode(await j(a,y("tokenizer/tokenizer.json"),n))),v=JSON.parse(
new TextDecoder().decode(await j(a,y("tokenizer/tokenizer_config.json"),n))),O=await p();m=new O(P,v),m.pad_token_id=i.padTokenId;
for(const l of["unet","text_encoder","vae_decoder"]){b(n),s?.({type:"model-load",stage:l,loaded:0,total:y(`${l}/model.on\
nx`).size});let I=await j(a,y(`${l}/model.onnx`),n);const S=i.pipeline==="sd-turbo"?{unet:{batch_size:1,num_channels:4,height:64,
width:64,sequence_length:77},text_encoder:{batch_size:1},vae_decoder:{batch_size:1,num_channels_latent:4,height_latent:64,
width_latent:64}}:{};if(f[l]=await ne({device:c,stage:`${l} load`,markLost:N,setDeviceCapture:F=>{J=F},operation:async()=>(f[l]=
await w.InferenceSession.create(I,{executionProviders:["webgpu"],enableMemPattern:!1,enableCpuMemArena:!1,...S[l]?{freeDimensionOverrides:S[l]}:
{},extra:{session:{disable_prepacking:"1",use_device_allocator_for_initializers:"1"}}}),f[l])}),!c||w.env.webgpu.device!==
c||!c.features.has("shader-f16"))throw new Error("ORT did not create the admitted WebGPU device");_?.(),_=null,I=null,b(
n),s?.({type:"model-load",stage:l,loaded:y(`${l}/model.onnx`).size,total:y(`${l}/model.onnx`).size})}if(a.close(),d.artifactReads=
a.getStats(),a=null,await c.queue.onSubmittedWorkDone(),b(n),D)throw new Error("GPU device lost while loading diffusion")}catch(h){
try{await V()}catch(y){throw new AggregateError([h,y],"Diffusion loader cleanup failed")}throw h}return{evidence:d,get lost(){
return D},dispose:V,async generate({prompt:h,seed:y,steps:P,signal:v,onProgress:O}){if(T||D)throw new Error("Model sessi\
on lost: diffusion device is unavailable");if(R)throw new Error("Diffusion engine is already generating");R=!0;const l=new Set,
I=g=>(l.add(g),g),S={dispatches:d.gpuDispatches,submissions:d.gpuSubmissions},F=async(g,E)=>{b(v);const L=d.gpuDispatches,
z=await Ie({session:g,inputs:E,device:c,signal:v,own:I,markLost:N,stage:g===f.text_encoder?"text encoder":g===f.unet?"de\
noise":"decode"});if(b(v),D)throw new Error(`GPU operation failed during diffusion: ${d.gpuFailure??"device lost"}`);if(d.
gpuDispatches<=L)throw new Error("Diffusion stage did not execute on WebGPU");if(await be(),b(v),D)throw new Error(`GPU \
operation failed during diffusion: ${d.gpuFailure??"device lost"}`);return z},C=(g,E)=>{b(v),O?.({type:"diffusion-progre\
ss",stage:g,step:E,steps:P})};try{C("text-encoder",0);let E=m(h,{padding:"max_length",max_length:77,truncation:!0,return_tensor:!1}).
input_ids;if(Array.isArray(E[0])&&(E=E[0]),!Array.isArray(E)||E.length!==77||E.some(M=>!Number.isInteger(M)||M<0||M>49407))
throw new Error("Invalid CLIP token sequence");const L=I(X(w,f.text_encoder,"input_ids",E,[1,77])),{last_hidden_state:z}=await F(
f.text_encoder,{input_ids:L});if(!z)throw new Error("Diffusion text encoder did not return hidden states");const Q=le(y);
let k=re(Q,i.pipeline==="sd-turbo"?B:1);for(let M=0;M<P;M++){C("denoise",M);const $=I(new w.Tensor("float32",i.pipeline===
"sd-turbo"?pe(k):k,K)),ae=i.pipeline==="sd-turbo"?999:U[M],W=I(X(w,f.unet,"timestep",[ae],[1])),{out_sample:A}=await F(f.
unet,{sample:$,timestep:W,encoder_hidden_states:z});if(!A||A.type!=="float32")throw new Error("Invalid diffusion UNet ou\
tput");k=i.pipeline==="sd-turbo"?he(k,A.data):me(k,A.data,M,Q),A.dispose(),l.delete(A),$.dispose(),l.delete($),W.dispose(),
l.delete(W)}C("decode",P);const oe=I(new w.Tensor("float32",k,K)),se=i.pipeline==="sd-turbo"?"latent_sample":"latent",q=(await F(
f.vae_decoder,{[se]:oe}))[i.pipeline==="sd-turbo"?"sample":"image"];if(!q||q.type!=="float32")throw new Error("Invalid d\
iffusion image tensor");const ie=we(q.data,q.dims);return b(v),d.generatedRequests++,{text:"",image:ie,seed:y,steps:P,gpuDispatches:d.
gpuDispatches-S.dispatches,gpuSubmissions:d.gpuSubmissions-S.submissions}}catch(g){throw v?.aborted?g:(D=!0,String(g.message).
startsWith("Model session lost:")?g:new Error(`Model session lost: ${String(g.message??g).slice(0,300)}`,{cause:g}))}finally{
for(const g of l)try{g.dispose()}catch{}R=!1}}}}function De(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))
throw new Error("Diffusion requires a ComputeManager-owned worker")}function Pe({createEngine:e=Me,assertWorker:t=De,baseUrl:r=globalThis.
location?.href}={}){const n=new Map,s=o=>({sessionId:o.sessionId,manifestCid:o.manifestCid,status:o.engine?.lost?"lost":
o.status,workerId:o.workerId,...o.engine?.evidence});return async function(u,p={}){if(t(),Y(u?.sessionId),b(p.signal),u.
command==="load"){if(n.size)throw new Error("Unload the resident diffusion model first");const{manifest:d}=ee(u.manifest),
c=ce(u.runtimeAssets,r),a={sessionId:u.sessionId,manifestCid:u.manifestCid,manifest:d,status:"loading",workerId:p.workerId,
engine:null};n.set(u.sessionId,a);try{return a.engine=await e({manifest:d,runtimeAssets:c,artifactPort:u.artifactPort,signal:p.
signal,onProgress:p.emitProgress}),b(p.signal),a.status="ready",s(a)}catch(m){try{await a.engine?.dispose(),n.delete(u.sessionId)}catch(w){
throw a.status="lost",new AggregateError([m,w],"Model session lost: diffusion cleanup failed")}throw m}}const i=n.get(u.
sessionId);if(!i)throw new Error("Diffusion session is not loaded");if(u.command==="status")return s(i);if(u.command==="\
unload")return i.status="unloading",await i.engine.dispose(),n.delete(u.sessionId),{sessionId:u.sessionId,status:"unload\
ed"};if(u.command!=="generate")throw new Error("Unknown diffusion command");if(Y(u.requestId),i.status!=="ready"||i.engine.
lost)throw new Error("Model session lost: diffusion is not ready");const f=fe(u,i.manifest);i.status="generating";try{const d=await i.
engine.generate({...f,signal:p.signal,onProgress:p.emitProgress});return b(p.signal),{...d,sessionId:u.sessionId,requestId:u.
requestId,workerId:i.workerId}}catch(d){throw d instanceof WebAssembly.RuntimeError?(i.status="lost",new Error(`Model se\
ssion lost: diffusion native runtime failed: ${d.message}`)):(/Model session lost/.test(d?.message??"")&&(i.status="lost"),
d)}finally{i.status!=="lost"&&(i.status=i.engine.lost?"lost":"ready")}}}const Fe=Pe();export{Pe as createDiffusionTaskHandler,Fe as handleModelTask};
