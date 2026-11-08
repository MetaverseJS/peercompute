import{c as fe}from"./GgufArtifactReader-CxlX0lvx.js";import{t as g,a as Z}from"./ArtifactReadBridge-mLMxyVL0.js";import{
n as ue}from"./ArtifactManifest-Bn7pK_eB.js";import{normalizeModelMessages as le}from"./modelTask-9yG_B2J_.js";function te(e){
return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(te),Object.freeze(e)),e}const pe=[{id:"sd-t\
urbo-onnx",name:"Stable Diffusion Turbo (ONNX FP16)",repository:"schmuell/sd-turbo-ort-web",revision:"ace89b7d2cd849f9a7\
3914cdbb8a3ea60c853dd1",pipeline:"sd-turbo",architecture:"stable-diffusion-2",dtype:"fp16",steps:1,padTokenId:0,files:[{
path:"text_encoder/model.onnx",size:681393168,sha256:"5d1f5bd3286abf26313a9e87db6fd32e47d8b1b2a84ffdf470884c3fe89497c4",
source:{repository:"schmuell/sd-turbo-ort-web",revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",path:"text_encoder/mo\
del.onnx"}},{path:"unet/model.onnx",size:1733430199,sha256:"7468133d9f7babec9cf6636e160188fe25aad206792c0abdaa722edc6769\
63c4",source:{repository:"schmuell/sd-turbo-ort-web",revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",path:"unet/mode\
l.onnx"}},{path:"vae_decoder/model.onnx",size:99094314,sha256:"b37a85f91a982811957abd6cfb617499742309f7b8e253240da3132e5\
33a7605",source:{repository:"schmuell/sd-turbo-ort-web",revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",path:"vae_de\
coder/model.onnx"}},{path:"tokenizer/tokenizer.json",size:2224081,sha256:"72ed5c96db5729294468543e4bc75fce14ca63f58e3730\
0290189ba1c1e52b85",gitBlobSha1:"f9d4455c06f24d31797f7cd3e480a83d7a84cb97",source:{repository:"Xenova/clip-vit-base-patc\
h16",revision:"342fdf2f67aded64d138ff074745fb4a5d2bba5f",path:"tokenizer.json"}},{path:"tokenizer/tokenizer_config.json",
size:775,sha256:"60ba2912bc6344c94bc16bbdec27fa1209409167b6f2fdf3cfe9e65462ea3967",gitBlobSha1:"c9b2a711cbdd039529fa5a66\
f1965e13eb14451d",source:{repository:"Xenova/clip-vit-base-patch16",revision:"342fdf2f67aded64d138ff074745fb4a5d2bba5f",
path:"tokenizer_config.json"}},{path:"README.md",size:195,sha256:"ca7ae65e0f226f01cbf95e8e6b4c8f5d98e81648bd2b66280945cb\
f41311c72e",gitBlobSha1:"5a4d6e3602769d994918631e6b849ef77a8a5d03",source:{repository:"schmuell/sd-turbo-ort-web",revision:"\
ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",path:"README.md"}},{path:"LICENSE",size:7300,sha256:"305bafee60b129e25bda0745e\
06ac3c06b496b50ad61bda6265f8d57003f8aca",gitBlobSha1:"ae44226e8f243c81374e8bc09ea207dbf601eb3d",source:{repository:"schm\
uell/sd-turbo-ort-web",revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",path:"LICENSE"}}],license:{spdx:"LicenseRef-S\
tabilityAI-NonCommercial-Research",sourceUrl:"https://huggingface.co/schmuell/sd-turbo-ort-web/blob/ace89b7d2cd849f9a739\
14cdbb8a3ea60c853dd1/LICENSE",notice:"This pinned converted artifact includes the November 2023 Stability AI Non-Commerc\
ial Research Community license; do not relabel it as the newer upstream Community license."}},{id:"dreamshaper-8-lcm-int\
8-onnx",name:"DreamShaper 8 LCM (SD 1.5, INT8 weights)",repository:"skillsafeai/dreamshaper-8-lcm-onnx-webgpu",revision:"\
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
a8e6b106d21606d63e8460cdad4f1a6"}}],he=te(Object.fromEntries(pe.map(e=>[e.id,{...e,status:"execution-candidate",format:"\
ONNX",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"cand\
idate",executionReason:"Requires hardware WebGPU with shader-f16 and an admitted managed ONNX diffusion worker. Device e\
xecution must be verified."},provenance:{...e.provenance,repository:e.repository,revision:e.revision,format:"ONNX",metadataCheckedAt:"\
2026-11-03",modelCardUrl:`https://huggingface.co/${e.repository}/blob/${e.revision}/README.md`,fileSources:Object.fromEntries(
e.files.map(o=>[o.path,o.source]))},model:{runtime:"onnx-diffusion",runtimeVersion:"1.31.1",architecture:e.architecture,
format:"ONNX",task:"text-to-image",pipeline:e.pipeline,dtype:e.dtype,...e.weightQuantization?{weightQuantization:e.weightQuantization}:
{},modalities:["text"],outputModalities:["image"],requiredFeatures:["shader-f16"],width:512,height:512,steps:e.steps,padTokenId:e.
padTokenId,repository:e.repository,revision:e.revision},weightBytes:e.files.filter(o=>o.path.endsWith(".onnx")).reduce((o,t)=>o+
t.size,0),totalBytes:e.files.reduce((o,t)=>o+t.size,0)}]))),oe="1.31.1",U=1024**3;function X(e){const o=ue(e),t=o.model,
s=Object.values(he).find(r=>r.model.repository===t?.repository&&r.model.revision===t?.revision&&r.model.pipeline===t?.pipeline);
if(!s||t.runtime!=="onnx-diffusion"||t.runtimeVersion!==oe||t.task!=="text-to-image"||t.architecture!==s.model.architecture||
JSON.stringify(t.modalities)!=='["text"]'||JSON.stringify(t.outputModalities)!=='["image"]'||o.files.length!==s.files.length)
throw new Error("Diffusion package is not in the trusted runtime catalog");for(const r of["format","dtype","steps","widt\
h","height","padTokenId","weightQuantization","requiredFeatures"]){const i=(f,a)=>f&&a&&typeof f=="object"&&typeof a=="o\
bject"?Object.keys(f).length===Object.keys(a).length&&Object.keys(f).every(u=>i(f[u],a[u])):f===a;if(!i(t[r],s.model[r]))
throw new Error(`Diffusion ${r} differs from the trusted profile`)}for(const r of s.files){const i=o.files.find(f=>f.path===
r.path);if(!i||i.size!==r.size||i.sha256!==r.sha256)throw new Error("Diffusion files differ from pinned catalog digests")}
const n=o.files.reduce((r,i)=>r+i.size,0);if(!Number.isSafeInteger(n)||n>3*U)throw new Error("Diffusion package exceeds \
its admitted byte budget");return{manifest:o,trusted:s,totalBytes:n,resourcePolicy:{maxModelBytes:3*U,minimumCpuBytes:8*
U,minimumGpuBytes:8*U}}}function me(e,o){const{trusted:t}=X(o);if(e.image)throw new Error("This diffusion runtime accept\
s text only");const s=le(e);if(s.length!==1||s[0].role!=="user")throw new Error("Diffusion requires exactly one user pro\
mpt");const n=s[0].content.trim();if(!n||new TextEncoder().encode(n).length>4096)throw new Error("Diffusion needs a text\
 prompt of at most 4096 bytes");const r=e.seed??crypto.getRandomValues(new Uint32Array(1))[0];if(!Number.isSafeInteger(r)||
r<0||r>4294967295)throw new Error("Diffusion seed must be uint32");const i=e.steps??t.steps;if(i!==t.steps||(e.width??512)!==
512||(e.height??512)!==512)throw new Error(`This diffusion profile requires 512×512 and ${t.steps} steps`);return{task:"\
text-to-image",prompt:n,messages:[{role:"user",content:n}],seed:r,steps:i,width:512,height:512}}function be(e,o=globalThis.
location?.href){if(!e||Object.keys(e).some(n=>!["mjs","wasm"].includes(n)))throw new Error("Unexpected diffusion runtime\
 assets");const t=new URL(o),s={};for(const n of["mjs","wasm"]){if(typeof e[n]!="string")throw new Error("Trusted diffus\
ion runtime assets are required");const r=new URL(e[n],t);if(r.origin!==t.origin||r.username||r.password||r.hash||!["htt\
p:","https:"].includes(r.protocol)||!new RegExp(`(?:^|/)ort-wasm-simd-threaded\\.jsep(?:-[A-Za-z0-9_-]+)?\\.${n}$`).test(
r.pathname))throw new Error("Diffusion assets must be same-origin ORT JSEP files");s[n]=r.href}return s}const re=256*64,
J=14.6146,T=Object.freeze([999,759,499,259]);function we(e){if(!Number.isInteger(e)||e<0||e>4294967295)throw new Error("\
Seed must be uint32");let o=e>>>0;return()=>{o=o+1831565813>>>0;let t=Math.imul(o^o>>>15,o|1);return t^=t+Math.imul(t^t>>>
7,t|61),((t^t>>>14)>>>0)/4294967296}}function se(e,o=1){const t=new Float32Array(re);for(let s=0;s<t.length;s+=2){const n=Math.
sqrt(-2*Math.log(Math.max(e(),Number.EPSILON)))*o,r=2*Math.PI*e();t[s]=n*Math.cos(r),t[s+1]=n*Math.sin(r)}return t}function O(e){
if(!(e instanceof Float32Array)||e.length!==re)throw new Error("Invalid diffusion latent tensor");for(const o of e)if(!Number.
isFinite(o))throw new Error("Nonfinite diffusion tensor");return e}function ge(e){return O(e),e.map(o=>o/Math.sqrt(J**2+
1))}function ye(e,o){return O(e),O(o),e.map((t,s)=>(t-J*o[s])/.18215)}const Y=(()=>{const e=new Float64Array(1e3);let o=1;
const t=Math.sqrt(85e-5),s=Math.sqrt(.012);for(let n=0;n<e.length;n++){const r=(t+(s-t)*n/(e.length-1))**2;o*=1-r,e[n]=o}
return e})();function Ee(e,o,t,s){if(O(e),O(o),!Number.isInteger(t)||t<0||t>=T.length)throw new Error("Invalid LCM step");
const n=T[t],r=Y[n],i=n*10,f=.25/(i**2+.25),a=i/Math.sqrt(i**2+.25),u=t===T.length-1,c=u?1:Y[T[t+1]],l=u?null:se(s);return e.
map((d,m)=>{const b=(d-Math.sqrt(1-r)*o[m])/Math.sqrt(r),E=a*b+f*d;return u?E:Math.sqrt(c)*E+Math.sqrt(1-c)*l[m]})}function ve(e,o){
if(!(e instanceof Float32Array)||!Array.isArray(o)||o.length!==4||o[0]!==1||o[1]!==3||o[2]!==512||o[3]!==512||e.length!==
3*512*512)throw new Error("Diffusion decoder must produce float32 [1,3,512,512]");const t=512*512,s=new Uint8Array(t*4);
for(let n=0;n<t;n++){for(let r=0;r<3;r++){const i=e[r*t+n];if(!Number.isFinite(i))throw new Error("Diffusion decoder pro\
duced nonfinite pixels");s[n*4+r]=Math.round(Math.min(1,Math.max(0,i/2+.5))*255)}s[n*4+3]=255}return{width:512,height:512,
channels:4,data:s}}const K=[1,4,64,64],xe=2*1024**3,ke=()=>new Promise(e=>setTimeout(e,0));async function W(e,o,t){if(!o||
o.size<=0||o.size>=xe)throw new Error("Diffusion file exceeds the loader buffer budget");const s=new Uint8Array(o.size);
for(let n=0;n<o.size;n+=4*1024**2){g(t);const r=await e.read(o.path,n,Math.min(4*1024**2,o.size-n),{signal:t});s.set(r,n)}
return s}function Ie(e,o){const t=e.createCommandEncoder.bind(e),s=e.queue.submit.bind(e.queue);e.createCommandEncoder=(...n)=>{
const r=t(...n),i=r.beginComputePass.bind(r);return r.beginComputePass=(...f)=>{const a=i(...f);for(const u of["dispatch\
Workgroups","dispatchWorkgroupsIndirect"]){const c=a[u].bind(a);a[u]=(...l)=>{const d=c(...l);return o.gpuDispatches++,d}}
return a},r},e.queue.submit=(...n)=>{const r=s(...n);return o.gpuSubmissions++,r}}function _e(e,o){const t=e.requestDevice;
return e.requestDevice=async function(...s){const n=await t.apply(this,s);return o(n),n},()=>{e.requestDevice=t}}async function ne({
device:e,operation:o,setDeviceCapture:t,markLost:s,stage:n="execution"}){let r,i,f;const a=[],u=d=>{if(r!==d){if(r)throw new Error(
"Diffusion changed GPU devices during an operation");r=d;for(const m of["validation","out-of-memory","internal"])d.pushErrorScope(
m),a.push(m)}};try{if(e&&u(e),t?.(u),i=await o(),!r)throw new Error("ORT did not create the admitted GPU device");await r.
queue.onSubmittedWorkDone()}catch(d){f=d}finally{t?.(null)}const c=await Promise.all(a.reverse().map(async d=>{try{return{
filter:d,error:await r.popErrorScope()}}catch(m){return{filter:d,error:m,scopeFailed:!0}}})),l=["out-of-memory","interna\
l","validation"].map(d=>c.find(m=>m.filter===d&&m.error&&!m.scopeFailed)).find(Boolean);if(f??=c.find(d=>d.scopeFailed)?.
error,l||f){const d=l?.error??f,m=l?.filter==="out-of-memory"?"out of memory":l?.filter??"execution failure",b=l?.filter===
"out-of-memory"?`Model session lost: diffusion ${n} GPU out of memory. Close GPU-heavy apps or unload other models, then\
 reload this model.`:`Model session lost: diffusion ${n} GPU ${m}: ${String(d.message??d).slice(0,240)}`,E=new Error(b,{
cause:d});throw E.code=l?.filter==="out-of-memory"?"ERR_DIFFUSION_GPU_OUT_OF_MEMORY":"ERR_DIFFUSION_GPU",s(E),E}return i}
function ze(e,o){const t=s=>o(s.error);return e.addEventListener("uncapturederror",t),()=>e.removeEventListener("uncaptu\
rederror",t)}async function De({session:e,inputs:o,device:t,signal:s,own:n,markLost:r,stage:i="execution"}){g(s);const f=await ne(
{device:t,markLost:r,stage:i,operation:async()=>{const a=await e.run(o);return Object.values(a).forEach(n),a}});return g(
s),f}function Me(e,o){return Array.isArray(e.inputMetadata)?e.inputMetadata.find(t=>t.name===o):e.inputMetadata?.[o]}function ee(e,o,t,s,n){
const r=Me(o,t)?.type;if(r==="int32")return new e.Tensor("int32",Int32Array.from(s,Number),n);if(r==="int64")return new e.
Tensor("int64",BigInt64Array.from(s,BigInt),n);if(r==="float32")return new e.Tensor("float32",Float32Array.from(s,Number),
n);throw new Error(`Unsupported diffusion input type for ${t}: ${r}`)}async function Se({manifest:e,runtimeAssets:o,artifactPort:t,
signal:s,onProgress:n,gpu:r=globalThis.navigator?.gpu,loadOrt:i=()=>import("./ort.all.bundle.min-Yg0WefYz.js"),loadTokenizer:f=()=>import("./transformers.web-CsR9rRO0.js").
then(a=>a.CLIPTokenizer)}){const{trusted:a}=X(e),u={},c={gpuDispatches:0,gpuSubmissions:0,generatedRequests:0};let l,d,m,
b,E,C,Q,S=!1,F=!1,_=!1;const q=h=>{S||(_=!0,c.gpuFailure||(c.gpuFailure=String(h?.cause?.message??h?.message??h??"GPU op\
eration failed").slice(0,400),console.error("Diffusion GPU failure:",c.gpuFailure)))};async function V(){if(S)return;S=!0,
E?.(),E=null,C?.(),C=null,d?.close();let h;for(const y of Object.values(u))try{await y.release()}catch(z){h??=z}if(l?.destroy(),
h)throw h}try{const h=await r?.requestAdapter({powerPreference:"high-performance"});if(g(s),!h||h.isFallbackAdapter||h.info?.
isFallbackAdapter||!h.features.has("shader-f16"))throw new Error("Diffusion requires a hardware WebGPU adapter with shad\
er-f16; CPU fallback is disabled");if(c.adapter={vendor:h.info?.vendor??"",architecture:h.info?.architecture??"",isFallbackAdapter:!1,
requiredFeatures:["shader-f16"]},b=await i(),b.env.versions.web!==oe)throw new Error("Unexpected diffusion ORT runtime v\
ersion");b.env.wasm.proxy=!1,b.env.wasm.numThreads=1,b.env.wasm.wasmPaths=o,b.env.webgpu.adapter=h,E=_e(h,p=>{l=p,Q?.(l),
C=ze(l,q),c.runtimeFeatures=[...l.features],Ie(l,c),l.lost.then(()=>{S||(_=!0)})}),b.env.logLevel="error",d=fe(t,{manifest:e,
signal:s,maxReadBytes:4*1024**2,maxReads:1,maxQueuedReads:2,readTimeoutMs:6e4});const y=p=>e.files.find(x=>x.path===p),z=JSON.
parse(new TextDecoder().decode(await W(d,y("tokenizer/tokenizer.json"),s))),k=JSON.parse(new TextDecoder().decode(await W(
d,y("tokenizer/tokenizer_config.json"),s))),L=await f();m=new L(z,k),m.pad_token_id=a.padTokenId;for(const p of["unet","\
text_encoder","vae_decoder"]){g(s),n?.({type:"model-load",stage:p,loaded:0,total:y(`${p}/model.onnx`).size});let x=await W(
d,y(`${p}/model.onnx`),s);const A=a.pipeline==="sd-turbo"?{unet:{batch_size:1,num_channels:4,height:64,width:64,sequence_length:77},
text_encoder:{batch_size:1},vae_decoder:{batch_size:1,num_channels_latent:4,height_latent:64,width_latent:64}}:{};if(u[p]=
await ne({device:l,stage:`${p} load`,markLost:q,setDeviceCapture:N=>{Q=N},operation:async()=>(u[p]=await b.InferenceSession.
create(x,{executionProviders:["webgpu"],enableMemPattern:!1,enableCpuMemArena:!1,...A[p]?{freeDimensionOverrides:A[p]}:{},
extra:{session:{disable_prepacking:"1",use_device_allocator_for_initializers:"1"}}}),u[p])}),!l||b.env.webgpu.device!==l||
!l.features.has("shader-f16"))throw new Error("ORT did not create the admitted WebGPU device");E?.(),E=null,x=null,g(s),
n?.({type:"model-load",stage:p,loaded:y(`${p}/model.onnx`).size,total:y(`${p}/model.onnx`).size})}if(d.close(),c.artifactReads=
d.getStats(),d=null,await l.queue.onSubmittedWorkDone(),g(s),_)throw new Error("GPU device lost while loading diffusion")}catch(h){
try{await V()}catch(y){throw new AggregateError([h,y],"Diffusion loader cleanup failed")}throw h}return{evidence:c,get lost(){
return _},dispose:V,async generate({prompt:h,seed:y,steps:z,signal:k,onProgress:L}){if(S||_)throw new Error("Model sessi\
on lost: diffusion device is unavailable");if(F)throw new Error("Diffusion engine is already generating");F=!0;const p=new Set,
x=w=>(p.add(w),w),A={dispatches:c.gpuDispatches,submissions:c.gpuSubmissions},N=async(w,v)=>{g(k);const G=c.gpuDispatches,
R=await De({session:w,inputs:v,device:l,signal:k,own:x,markLost:q,stage:w===u.text_encoder?"text encoder":w===u.unet?"de\
noise":"decode"});if(g(k),_)throw new Error(`GPU operation failed during diffusion: ${c.gpuFailure??"device lost"}`);if(c.
gpuDispatches<=G)throw new Error("Diffusion stage did not execute on WebGPU");if(await ke(),g(k),_)throw new Error(`GPU \
operation failed during diffusion: ${c.gpuFailure??"device lost"}`);return R},j=(w,v)=>{g(k),L?.({type:"diffusion-progre\
ss",stage:w,step:v,steps:z})};try{j("text-encoder",0);let v=m(h,{padding:"max_length",max_length:77,truncation:!0,return_tensor:!1}).
input_ids;if(Array.isArray(v[0])&&(v=v[0]),!Array.isArray(v)||v.length!==77||v.some(I=>!Number.isInteger(I)||I<0||I>49407))
throw new Error("Invalid CLIP token sequence");const G=x(ee(b,u.text_encoder,"input_ids",v,[1,77])),{last_hidden_state:R}=await N(
u.text_encoder,{input_ids:G});if(!R)throw new Error("Diffusion text encoder did not return hidden states");const H=we(y);
let D=se(H,a.pipeline==="sd-turbo"?J:1);for(let I=0;I<z;I++){j("denoise",I);const $=x(new b.Tensor("float32",a.pipeline===
"sd-turbo"?ge(D):D,K)),ce=a.pipeline==="sd-turbo"?999:T[I],B=x(ee(b,u.unet,"timestep",[ce],[1])),{out_sample:M}=await N(
u.unet,{sample:$,timestep:B,encoder_hidden_states:R});if(!M||M.type!=="float32")throw new Error("Invalid diffusion UNet \
output");D=a.pipeline==="sd-turbo"?ye(D,M.data):Ee(D,M.data,I,H),M.dispose(),p.delete(M),$.dispose(),p.delete($),B.dispose(),
p.delete(B)}j("decode",z);const ie=x(new b.Tensor("float32",D,K)),ae=a.pipeline==="sd-turbo"?"latent_sample":"latent",P=(await N(
u.vae_decoder,{[ae]:ie}))[a.pipeline==="sd-turbo"?"sample":"image"];if(!P||P.type!=="float32")throw new Error("Invalid d\
iffusion image tensor");const de=ve(P.data,P.dims);return g(k),c.generatedRequests++,{text:"",image:de,seed:y,steps:z,gpuDispatches:c.
gpuDispatches-A.dispatches,gpuSubmissions:c.gpuSubmissions-A.submissions}}catch(w){throw k?.aborted?w:(_=!0,String(w.message).
startsWith("Model session lost:")?w:new Error(`Model session lost: ${String(w.message??w).slice(0,300)}`,{cause:w}))}finally{
for(const w of p)try{w.dispose()}catch{}F=!1}}}}function Ae(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))
throw new Error("Diffusion requires a ComputeManager-owned worker")}function Ne({createEngine:e=Se,assertWorker:o=Ae,baseUrl:t=globalThis.
location?.href}={}){const s=new Map,n=r=>({sessionId:r.sessionId,manifestCid:r.manifestCid,status:r.engine?.lost?"lost":
r.status,workerId:r.workerId,...r.engine?.evidence});return async function(i,f={}){if(o(),Z(i?.sessionId),g(f.signal),i.
command==="load"){if(s.size)throw new Error("Unload the resident diffusion model first");const{manifest:c}=X(i.manifest),
l=be(i.runtimeAssets,t),d={sessionId:i.sessionId,manifestCid:i.manifestCid,manifest:c,status:"loading",workerId:f.workerId,
engine:null};s.set(i.sessionId,d);try{return d.engine=await e({manifest:c,runtimeAssets:l,artifactPort:i.artifactPort,signal:f.
signal,onProgress:f.emitProgress}),g(f.signal),d.status="ready",n(d)}catch(m){try{await d.engine?.dispose(),s.delete(i.sessionId)}catch(b){
throw d.status="lost",new AggregateError([m,b],"Model session lost: diffusion cleanup failed")}throw m}}const a=s.get(i.
sessionId);if(!a)throw new Error("Diffusion session is not loaded");if(i.command==="status")return n(a);if(i.command==="\
unload")return a.status="unloading",await a.engine.dispose(),s.delete(i.sessionId),{sessionId:i.sessionId,status:"unload\
ed"};if(i.command!=="generate")throw new Error("Unknown diffusion command");if(Z(i.requestId),a.status!=="ready"||a.engine.
lost)throw new Error("Model session lost: diffusion is not ready");const u=me(i,a.manifest);a.status="generating";try{const c=await a.
engine.generate({...u,signal:f.signal,onProgress:f.emitProgress});return g(f.signal),{...c,sessionId:i.sessionId,requestId:i.
requestId,workerId:a.workerId}}catch(c){throw c instanceof WebAssembly.RuntimeError?(a.status="lost",new Error(`Model se\
ssion lost: diffusion native runtime failed: ${c.message}`)):(/Model session lost/.test(c?.message??"")&&(a.status="lost"),
c)}finally{a.status!=="lost"&&(a.status=a.engine.lost?"lost":"ready")}}}const Ce=Ne();export{Ne as createDiffusionTaskHandler,Ce as handleModelTask};
