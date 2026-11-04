import{n as ie,c as ae}from"./GgufArtifactReader-BV3uUvNA.js";import{n as de,t as m,v as Q}from"./modelTask-dQfjl6lX.js";
function K(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(K),Object.freeze(e)),e}const ce=[
{id:"sd-turbo-onnx",name:"Stable Diffusion Turbo (ONNX FP16)",repository:"schmuell/sd-turbo-ort-web",revision:"ace89b7d2\
cd849f9a73914cdbb8a3ea60c853dd1",pipeline:"sd-turbo",architecture:"stable-diffusion-2",dtype:"fp16",steps:1,padTokenId:0,
files:[{path:"text_encoder/model.onnx",size:681393168,sha256:"5d1f5bd3286abf26313a9e87db6fd32e47d8b1b2a84ffdf470884c3fe8\
9497c4",source:{repository:"schmuell/sd-turbo-ort-web",revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",path:"text_en\
coder/model.onnx"}},{path:"unet/model.onnx",size:1733430199,sha256:"7468133d9f7babec9cf6636e160188fe25aad206792c0abdaa72\
2edc676963c4",source:{repository:"schmuell/sd-turbo-ort-web",revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",path:"u\
net/model.onnx"}},{path:"vae_decoder/model.onnx",size:99094314,sha256:"b37a85f91a982811957abd6cfb617499742309f7b8e253240\
da3132e533a7605",source:{repository:"schmuell/sd-turbo-ort-web",revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",path:"\
vae_decoder/model.onnx"}},{path:"tokenizer/tokenizer.json",size:2224081,sha256:"72ed5c96db5729294468543e4bc75fce14ca63f5\
8e37300290189ba1c1e52b85",gitBlobSha1:"f9d4455c06f24d31797f7cd3e480a83d7a84cb97",source:{repository:"Xenova/clip-vit-bas\
e-patch16",revision:"342fdf2f67aded64d138ff074745fb4a5d2bba5f",path:"tokenizer.json"}},{path:"tokenizer/tokenizer_config\
.json",size:775,sha256:"60ba2912bc6344c94bc16bbdec27fa1209409167b6f2fdf3cfe9e65462ea3967",gitBlobSha1:"c9b2a711cbdd03952\
9fa5a66f1965e13eb14451d",source:{repository:"Xenova/clip-vit-base-patch16",revision:"342fdf2f67aded64d138ff074745fb4a5d2\
bba5f",path:"tokenizer_config.json"}},{path:"README.md",size:195,sha256:"ca7ae65e0f226f01cbf95e8e6b4c8f5d98e81648bd2b662\
80945cbf41311c72e",gitBlobSha1:"5a4d6e3602769d994918631e6b849ef77a8a5d03",source:{repository:"schmuell/sd-turbo-ort-web",
revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",path:"README.md"}},{path:"LICENSE",size:7300,sha256:"305bafee60b129e\
25bda0745e06ac3c06b496b50ad61bda6265f8d57003f8aca",gitBlobSha1:"ae44226e8f243c81374e8bc09ea207dbf601eb3d",source:{repository:"\
schmuell/sd-turbo-ort-web",revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",path:"LICENSE"}}],license:{spdx:"LicenseR\
ef-StabilityAI-NonCommercial-Research",sourceUrl:"https://huggingface.co/schmuell/sd-turbo-ort-web/blob/ace89b7d2cd849f9\
a73914cdbb8a3ea60c853dd1/LICENSE",notice:"This pinned converted artifact includes the November 2023 Stability AI Non-Com\
mercial Research Community license; do not relabel it as the newer upstream Community license."}},{id:"dreamshaper-8-lcm\
-int8-onnx",name:"DreamShaper 8 LCM (SD 1.5, INT8 weights)",repository:"skillsafeai/dreamshaper-8-lcm-onnx-webgpu",revision:"\
a310400909a293a7a937a54854910ed06469192b",pipeline:"lcm",architecture:"stable-diffusion-1",dtype:{text_encoder:"fp16",unet:"\
fp16",vae_decoder:"fp32"},weightQuantization:"int8-per-channel",steps:4,padTokenId:49407,files:[{path:"text_encoder/mode\
l.onnx",size:123612877,sha256:"ff9bd0225990f6827682cfe37cf95912135e4f84945ba7f3abfe70a19eeff8fb",source:{repository:"ski\
llsafeai/dreamshaper-8-lcm-onnx-webgpu",revision:"a310400909a293a7a937a54854910ed06469192b",path:"int8/text_encoder_int8\
.onnx"}},{path:"unet/model.onnx",size:861356871,sha256:"a6bab857c28d27ac914a2d8e731011c0d9b361da7553efc6117e04f722e9f4ca",
source:{repository:"skillsafeai/dreamshaper-8-lcm-onnx-webgpu",revision:"a310400909a293a7a937a54854910ed06469192b",path:"\
int8/unet_int8.onnx"}},{path:"vae_decoder/model.onnx",size:49791103,sha256:"7556dbb3d599dbad393dc598b8bf28874245b721aa58\
1f321dfbd0f7211f37d2",source:{repository:"skillsafeai/dreamshaper-8-lcm-onnx-webgpu",revision:"a310400909a293a7a937a5485\
4910ed06469192b",path:"int8/vae_decoder_int8.onnx"}},{path:"tokenizer/tokenizer.json",size:2224081,sha256:"72ed5c96db572\
9294468543e4bc75fce14ca63f58e37300290189ba1c1e52b85",gitBlobSha1:"f9d4455c06f24d31797f7cd3e480a83d7a84cb97",source:{repository:"\
Xenova/clip-vit-base-patch16",revision:"342fdf2f67aded64d138ff074745fb4a5d2bba5f",path:"tokenizer.json"}},{path:"tokeniz\
er/tokenizer_config.json",size:775,sha256:"60ba2912bc6344c94bc16bbdec27fa1209409167b6f2fdf3cfe9e65462ea3967",gitBlobSha1:"\
c9b2a711cbdd039529fa5a66f1965e13eb14451d",source:{repository:"Xenova/clip-vit-base-patch16",revision:"342fdf2f67aded64d1\
38ff074745fb4a5d2bba5f",path:"tokenizer_config.json"}},{path:"README.md",size:3075,sha256:"7494dee7114e1b1875c7a06f12a90\
8b7ff9d00727785b956e815c066df14a8f6",gitBlobSha1:"97a713da99d2baeb8c6312b9238f860530f98eb5",source:{repository:"skillsaf\
eai/dreamshaper-8-lcm-onnx-webgpu",revision:"a310400909a293a7a937a54854910ed06469192b",path:"README.md"}},{path:"LICENSE\
.md",size:14465,sha256:"84804f0a5d78ed48992f7a6640ee6165877ccf9e704669713cababf65558cf4a",gitBlobSha1:"209d7dfbc3b54a404\
985665a3bf0721d6c53f4d6",source:{repository:"Heliosoph/dreamshaper-cfg-onnx",revision:"c07d9ea3c46471649e10b0900a6ec1f78\
5420df4",path:"LICENSE.md"}}],license:{spdx:"CreativeML-OpenRAIL-M",sourceUrl:"https://huggingface.co/skillsafeai/dreams\
haper-8-lcm-onnx-webgpu/blob/a310400909a293a7a937a54854910ed06469192b/README.md",notice:"CreativeML Open RAIL-M retains \
use restrictions. The complete license text is included from a pinned DreamShaper ONNX export. Local image generation is\
 not a guarantee of unrestricted content."},provenance:{baseRepository:"Lykon/dreamshaper-8-lcm",baseRevision:"4645d8bc6\
a8e6b106d21606d63e8460cdad4f1a6"}}],fe=K(Object.fromEntries(ce.map(e=>[e.id,{...e,status:"execution-candidate",format:"O\
NNX",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candi\
date",executionReason:"Requires hardware WebGPU with shader-f16 and an admitted managed ONNX diffusion worker. Device ex\
ecution must be verified."},provenance:{...e.provenance,repository:e.repository,revision:e.revision,format:"ONNX",metadataCheckedAt:"\
2026-11-03",modelCardUrl:`https://huggingface.co/${e.repository}/blob/${e.revision}/README.md`,fileSources:Object.fromEntries(
e.files.map(t=>[t.path,t.source]))},model:{runtime:"onnx-diffusion",runtimeVersion:"1.31.1",architecture:e.architecture,
format:"ONNX",task:"text-to-image",pipeline:e.pipeline,dtype:e.dtype,...e.weightQuantization?{weightQuantization:e.weightQuantization}:
{},modalities:["text"],outputModalities:["image"],requiredFeatures:["shader-f16"],width:512,height:512,steps:e.steps,padTokenId:e.
padTokenId,repository:e.repository,revision:e.revision},weightBytes:e.files.filter(t=>t.path.endsWith(".onnx")).reduce((t,s)=>t+
s.size,0),totalBytes:e.files.reduce((t,s)=>t+s.size,0)}]))),Y="1.31.1",R=1024**3;function $(e){const t=ie(e),s=t.model,r=Object.
values(fe).find(o=>o.model.repository===s?.repository&&o.model.revision===s?.revision&&o.model.pipeline===s?.pipeline);if(!r||
s.runtime!=="onnx-diffusion"||s.runtimeVersion!==Y||s.task!=="text-to-image"||s.architecture!==r.model.architecture||JSON.
stringify(s.modalities)!=='["text"]'||JSON.stringify(s.outputModalities)!=='["image"]'||t.files.length!==r.files.length)
throw new Error("Diffusion package is not in the trusted runtime catalog");for(const o of["format","dtype","steps","widt\
h","height","padTokenId","weightQuantization","requiredFeatures"]){const i=(c,a)=>c&&a&&typeof c=="object"&&typeof a=="o\
bject"?Object.keys(c).length===Object.keys(a).length&&Object.keys(c).every(u=>i(c[u],a[u])):c===a;if(!i(s[o],r.model[o]))
throw new Error(`Diffusion ${o} differs from the trusted profile`)}for(const o of r.files){const i=t.files.find(c=>c.path===
o.path);if(!i||i.size!==o.size||i.sha256!==o.sha256)throw new Error("Diffusion files differ from pinned catalog digests")}
const n=t.files.reduce((o,i)=>o+i.size,0);if(!Number.isSafeInteger(n)||n>3*R)throw new Error("Diffusion package exceeds \
its admitted byte budget");return{manifest:t,trusted:r,totalBytes:n,resourcePolicy:{maxModelBytes:3*R,minimumCpuBytes:8*
R,minimumGpuBytes:8*R}}}function ue(e,t){const{trusted:s}=$(t);if(e.image)throw new Error("This diffusion runtime accept\
s text only");const r=de(e);if(r.length!==1||r[0].role!=="user")throw new Error("Diffusion requires exactly one user pro\
mpt");const n=r[0].content.trim();if(!n||new TextEncoder().encode(n).length>4096)throw new Error("Diffusion needs a text\
 prompt of at most 4096 bytes");const o=e.seed??crypto.getRandomValues(new Uint32Array(1))[0];if(!Number.isSafeInteger(o)||
o<0||o>4294967295)throw new Error("Diffusion seed must be uint32");const i=e.steps??s.steps;if(i!==s.steps||(e.width??512)!==
512||(e.height??512)!==512)throw new Error(`This diffusion profile requires 512×512 and ${s.steps} steps`);return{task:"\
text-to-image",prompt:n,messages:[{role:"user",content:n}],seed:o,steps:i,width:512,height:512}}function le(e,t=globalThis.
location?.href){if(!e||Object.keys(e).some(n=>!["mjs","wasm"].includes(n)))throw new Error("Unexpected diffusion runtime\
 assets");const s=new URL(t),r={};for(const n of["mjs","wasm"]){if(typeof e[n]!="string")throw new Error("Trusted diffus\
ion runtime assets are required");const o=new URL(e[n],s);if(o.origin!==s.origin||o.username||o.password||o.hash||!["htt\
p:","https:"].includes(o.protocol)||!new RegExp(`(?:^|/)ort-wasm-simd-threaded\\.jsep(?:-[A-Za-z0-9_-]+)?\\.${n}$`).test(
o.pathname))throw new Error("Diffusion assets must be same-origin ORT JSEP files");r[n]=o.href}return r}const ee=256*64,
W=14.6146,A=Object.freeze([999,759,499,259]);function pe(e){if(!Number.isInteger(e)||e<0||e>4294967295)throw new Error("\
Seed must be uint32");let t=e>>>0;return()=>{t=t+1831565813>>>0;let s=Math.imul(t^t>>>15,t|1);return s^=s+Math.imul(s^s>>>
7,s|61),((s^s>>>14)>>>0)/4294967296}}function te(e,t=1){const s=new Float32Array(ee);for(let r=0;r<s.length;r+=2){const n=Math.
sqrt(-2*Math.log(Math.max(e(),Number.EPSILON)))*t,o=2*Math.PI*e();s[r]=n*Math.cos(o),s[r+1]=n*Math.sin(o)}return s}function N(e){
if(!(e instanceof Float32Array)||e.length!==ee)throw new Error("Invalid diffusion latent tensor");for(const t of e)if(!Number.
isFinite(t))throw new Error("Nonfinite diffusion tensor");return e}function he(e){return N(e),e.map(t=>t/Math.sqrt(W**2+
1))}function be(e,t){return N(e),N(t),e.map((s,r)=>(s-W*t[r])/.18215)}const V=(()=>{const e=new Float64Array(1e3);let t=1;
const s=Math.sqrt(85e-5),r=Math.sqrt(.012);for(let n=0;n<e.length;n++){const o=(s+(r-s)*n/(e.length-1))**2;t*=1-o,e[n]=t}
return e})();function me(e,t,s,r){if(N(e),N(t),!Number.isInteger(s)||s<0||s>=A.length)throw new Error("Invalid LCM step");
const n=A[s],o=V[n],i=n*10,c=.25/(i**2+.25),a=i/Math.sqrt(i**2+.25),u=s===A.length-1,d=u?1:V[A[s+1]],b=u?null:te(r);return e.
map((f,v)=>{const p=(f-Math.sqrt(1-o)*t[v])/Math.sqrt(o),I=a*p+c*f;return u?I:Math.sqrt(d)*I+Math.sqrt(1-d)*b[v]})}function we(e,t){
if(!(e instanceof Float32Array)||!Array.isArray(t)||t.length!==4||t[0]!==1||t[1]!==3||t[2]!==512||t[3]!==512||e.length!==
3*512*512)throw new Error("Diffusion decoder must produce float32 [1,3,512,512]");const s=512*512,r=new Uint8Array(s*4);
for(let n=0;n<s;n++){for(let o=0;o<3;o++){const i=e[o*s+n];if(!Number.isFinite(i))throw new Error("Diffusion decoder pro\
duced nonfinite pixels");r[n*4+o]=Math.round(Math.min(1,Math.max(0,i/2+.5))*255)}r[n*4+3]=255}return{width:512,height:512,
channels:4,data:r}}const H=[1,4,64,64],ge=2*1024**3,ye=()=>new Promise(e=>setTimeout(e,0));async function G(e,t,s){if(!t||
t.size<=0||t.size>=ge)throw new Error("Diffusion file exceeds the loader buffer budget");const r=new Uint8Array(t.size);
for(let n=0;n<t.size;n+=4*1024**2){m(s);const o=await e.read(t.path,n,Math.min(4*1024**2,t.size-n),{signal:s});r.set(o,n)}
return r}function Ee(e,t){const s=e.createCommandEncoder.bind(e),r=e.queue.submit.bind(e.queue);e.createCommandEncoder=(...n)=>{
const o=s(...n),i=o.beginComputePass.bind(o);return o.beginComputePass=(...c)=>{const a=i(...c);for(const u of["dispatch\
Workgroups","dispatchWorkgroupsIndirect"]){const d=a[u].bind(a);a[u]=(...b)=>{const f=d(...b);return t.gpuDispatches++,f}}
return a},o},e.queue.submit=(...n)=>{const o=r(...n);return t.gpuSubmissions++,o}}function ve(e,t){const s=e.requestDevice;
return e.requestDevice=async function(...r){const n=await s.apply(this,r);return t(n),n},()=>{e.requestDevice=s}}async function ke({
session:e,inputs:t,device:s,signal:r,own:n,markLost:o}){m(r);let i;try{i=await e.run(t),Object.values(i).forEach(n),await s.
queue.onSubmittedWorkDone()}catch(c){throw o(),new Error(`Model session lost: diffusion GPU execution failed: ${String(c.
message??c).slice(0,200)}`)}return m(r),i}function xe(e,t){return Array.isArray(e.inputMetadata)?e.inputMetadata.find(s=>s.
name===t):e.inputMetadata?.[t]}function Z(e,t,s,r,n){const o=xe(t,s)?.type;if(o==="int32")return new e.Tensor("int32",Int32Array.
from(r,Number),n);if(o==="int64")return new e.Tensor("int64",BigInt64Array.from(r,BigInt),n);if(o==="float32")return new e.
Tensor("float32",Float32Array.from(r,Number),n);throw new Error(`Unsupported diffusion input type for ${s}: ${o}`)}async function Ie({
manifest:e,runtimeAssets:t,artifactPort:s,signal:r,onProgress:n,gpu:o=globalThis.navigator?.gpu,loadOrt:i=()=>import("./ort.all.bundle.min-Yg0WefYz.js"),
loadTokenizer:c=()=>import("./transformers.web-CsR9rRO0.js").then(a=>a.CLIPTokenizer)}){const{trusted:a}=$(e),u={},d={gpuDispatches:0,
gpuSubmissions:0,generatedRequests:0};let b,f,v,p,I,T=!1,q=!1,M=!1;async function X(){if(T)return;T=!0,I?.(),I=null,f?.close();
let h;for(const w of Object.values(u))try{await w.release()}catch(z){h??=z}if(b?.destroy(),h)throw h}try{const h=await o?.
requestAdapter({powerPreference:"high-performance"});if(m(r),!h||h.isFallbackAdapter||h.info?.isFallbackAdapter||!h.features.
has("shader-f16"))throw new Error("Diffusion requires a hardware WebGPU adapter with shader-f16; CPU fallback is disable\
d");if(d.adapter={vendor:h.info?.vendor??"",architecture:h.info?.architecture??"",isFallbackAdapter:!1,requiredFeatures:[
"shader-f16"]},p=await i(),p.env.versions.web!==Y)throw new Error("Unexpected diffusion ORT runtime version");p.env.wasm.
proxy=!1,p.env.wasm.numThreads=1,p.env.wasm.wasmPaths=t,p.env.webgpu.adapter=h,I=ve(h,l=>{b=l,d.runtimeFeatures=[...b.features],
Ee(b,d),b.lost.then(()=>{T||(M=!0)})}),p.env.logLevel="error",f=ae(s,{manifest:e,signal:r,maxReadBytes:4*1024**2,maxReads:1,
maxQueuedReads:2,readTimeoutMs:6e4});const w=l=>e.files.find(E=>E.path===l),z=JSON.parse(new TextDecoder().decode(await G(
f,w("tokenizer/tokenizer.json"),r))),k=JSON.parse(new TextDecoder().decode(await G(f,w("tokenizer/tokenizer_config.json"),
r))),j=await c();v=new j(z,k),v.pad_token_id=a.padTokenId;for(const l of["unet","text_encoder","vae_decoder"]){m(r),n?.(
{type:"model-load",stage:l,loaded:0,total:w(`${l}/model.onnx`).size});let E=await G(f,w(`${l}/model.onnx`),r);const S=a.
pipeline==="sd-turbo"?{unet:{batch_size:1,num_channels:4,height:64,width:64,sequence_length:77},text_encoder:{batch_size:1},
vae_decoder:{batch_size:1,num_channels_latent:4,height_latent:64,width_latent:64}}:{};if(u[l]=await p.InferenceSession.create(
E,{executionProviders:["webgpu"],enableMemPattern:!1,enableCpuMemArena:!1,...S[l]?{freeDimensionOverrides:S[l]}:{},extra:{
session:{disable_prepacking:"1",use_device_allocator_for_initializers:"1"}}}),!b||p.env.webgpu.device!==b||!b.features.has(
"shader-f16"))throw new Error("ORT did not create the admitted WebGPU device");I?.(),I=null,E=null,m(r),n?.({type:"model\
-load",stage:l,loaded:w(`${l}/model.onnx`).size,total:w(`${l}/model.onnx`).size})}if(f.close(),d.artifactReads=f.getStats(),
f=null,await b.queue.onSubmittedWorkDone(),m(r),M)throw new Error("GPU device lost while loading diffusion")}catch(h){try{
await X()}catch(w){throw new AggregateError([h,w],"Diffusion loader cleanup failed")}throw h}return{evidence:d,get lost(){
return M},dispose:X,async generate({prompt:h,seed:w,steps:z,signal:k,onProgress:j}){if(T||M)throw new Error("Model sessi\
on lost: diffusion device is unavailable");if(q)throw new Error("Diffusion engine is already generating");q=!0;const l=new Set,
E=g=>(l.add(g),g),S={dispatches:d.gpuDispatches,submissions:d.gpuSubmissions},P=async(g,y)=>{m(k);const U=d.gpuDispatches,
O=await ke({session:g,inputs:y,device:b,signal:k,own:E,markLost:()=>{M=!0}});if(m(k),M)throw new Error("GPU device lost \
during diffusion");if(d.gpuDispatches<=U)throw new Error("Diffusion stage did not execute on WebGPU");return await ye(),
m(k),O},L=(g,y)=>{m(k),j?.({type:"diffusion-progress",stage:g,step:y,steps:z})};try{L("text-encoder",0);let y=v(h,{padding:"\
max_length",max_length:77,truncation:!0,return_tensor:!1}).input_ids;if(Array.isArray(y[0])&&(y=y[0]),!Array.isArray(y)||
y.length!==77||y.some(x=>!Number.isInteger(x)||x<0||x>49407))throw new Error("Invalid CLIP token sequence");const U=E(Z(
p,u.text_encoder,"input_ids",y,[1,77])),{last_hidden_state:O}=await P(u.text_encoder,{input_ids:U});if(!O)throw new Error(
"Diffusion text encoder did not return hidden states");const J=pe(w);let _=te(J,a.pipeline==="sd-turbo"?W:1);for(let x=0;x<
z;x++){L("denoise",x);const F=E(new p.Tensor("float32",a.pipeline==="sd-turbo"?he(_):_,H)),ne=a.pipeline==="sd-turbo"?999:
A[x],B=E(Z(p,u.unet,"timestep",[ne],[1])),{out_sample:D}=await P(u.unet,{sample:F,timestep:B,encoder_hidden_states:O});if(!D||
D.type!=="float32")throw new Error("Invalid diffusion UNet output");_=a.pipeline==="sd-turbo"?be(_,D.data):me(_,D.data,x,
J),D.dispose(),l.delete(D),F.dispose(),l.delete(F),B.dispose(),l.delete(B)}L("decode",z);const se=E(new p.Tensor("float3\
2",_,H)),oe=a.pipeline==="sd-turbo"?"latent_sample":"latent",C=(await P(u.vae_decoder,{[oe]:se}))[a.pipeline==="sd-turbo"?
"sample":"image"];if(!C||C.type!=="float32")throw new Error("Invalid diffusion image tensor");const re=we(C.data,C.dims);
return m(k),d.generatedRequests++,{text:"",image:re,seed:w,steps:z,gpuDispatches:d.gpuDispatches-S.dispatches,gpuSubmissions:d.
gpuSubmissions-S.submissions}}catch(g){throw k?.aborted?g:(M=!0,new Error(`Model session lost: ${String(g.message??g).slice(
0,300)}`))}finally{for(const g of l)try{g.dispose()}catch{}q=!1}}}}function ze(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof
WorkerGlobalScope))throw new Error("Diffusion requires a ComputeManager-owned worker")}function Me({createEngine:e=Ie,assertWorker:t=ze,
baseUrl:s=globalThis.location?.href}={}){const r=new Map,n=o=>({sessionId:o.sessionId,manifestCid:o.manifestCid,status:o.
engine?.lost?"lost":o.status,workerId:o.workerId,...o.engine?.evidence});return async function(i,c={}){if(t(),Q(i?.sessionId),
m(c.signal),i.command==="load"){if(r.size)throw new Error("Unload the resident diffusion model first");const{manifest:d}=$(
i.manifest),b=le(i.runtimeAssets,s),f={sessionId:i.sessionId,manifestCid:i.manifestCid,manifest:d,status:"loading",workerId:c.
workerId,engine:null};r.set(i.sessionId,f);try{return f.engine=await e({manifest:d,runtimeAssets:b,artifactPort:i.artifactPort,
signal:c.signal,onProgress:c.emitProgress}),m(c.signal),f.status="ready",n(f)}catch(v){try{await f.engine?.dispose(),r.delete(
i.sessionId)}catch(p){throw f.status="lost",new AggregateError([v,p],"Model session lost: diffusion cleanup failed")}throw v}}
const a=r.get(i.sessionId);if(!a)throw new Error("Diffusion session is not loaded");if(i.command==="status")return n(a);
if(i.command==="unload")return a.status="unloading",await a.engine.dispose(),r.delete(i.sessionId),{sessionId:i.sessionId,
status:"unloaded"};if(i.command!=="generate")throw new Error("Unknown diffusion command");if(Q(i.requestId),a.status!=="\
ready"||a.engine.lost)throw new Error("Model session lost: diffusion is not ready");const u=ue(i,a.manifest);a.status="g\
enerating";try{const d=await a.engine.generate({...u,signal:c.signal,onProgress:c.emitProgress});return m(c.signal),{...d,
sessionId:i.sessionId,requestId:i.requestId,workerId:a.workerId}}catch(d){throw d instanceof WebAssembly.RuntimeError?(a.
status="lost",new Error(`Model session lost: diffusion native runtime failed: ${d.message}`)):(/Model session lost/.test(
d?.message??"")&&(a.status="lost"),d)}finally{a.status!=="lost"&&(a.status=a.engine.lost?"lost":"ready")}}}const Ae=Me();export{Me as createDiffusionTaskHandler,Ae as handleModelTask};
