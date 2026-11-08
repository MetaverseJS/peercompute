import{c as pe}from"./GgufArtifactReader-C_-gweyf.js";import{t as x,a as te}from"./ArtifactReadBridge-BAWOcyZj.js";import{
n as me}from"./ArtifactManifest-BZyREYLI.js";import{normalizeModelMessages as be}from"./modelTask-DAs-_8s_.js";function re(e){
return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(re),Object.freeze(e)),e}const we=[{id:"sd-t\
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
a8e6b106d21606d63e8460cdad4f1a6"}}],ge=re(Object.fromEntries(we.map(e=>[e.id,{...e,status:"execution-candidate",format:"\
ONNX",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"cand\
idate",executionReason:"Requires hardware WebGPU with shader-f16 and an admitted managed ONNX diffusion worker. Device e\
xecution must be verified."},provenance:{...e.provenance,repository:e.repository,revision:e.revision,format:"ONNX",metadataCheckedAt:"\
2026-11-03",modelCardUrl:`https://huggingface.co/${e.repository}/blob/${e.revision}/README.md`,fileSources:Object.fromEntries(
e.files.map(o=>[o.path,o.source]))},model:{runtime:"onnx-diffusion",runtimeVersion:"1.31.1",architecture:e.architecture,
format:"ONNX",task:"text-to-image",pipeline:e.pipeline,dtype:e.dtype,...e.weightQuantization?{weightQuantization:e.weightQuantization}:
{},modalities:["text"],outputModalities:["image"],requiredFeatures:["shader-f16"],width:512,height:512,steps:e.steps,padTokenId:e.
padTokenId,repository:e.repository,revision:e.revision},weightBytes:e.files.filter(o=>o.path.endsWith(".onnx")).reduce((o,t)=>o+
t.size,0),totalBytes:e.files.reduce((o,t)=>o+t.size,0)}]))),ie="1.31.1",C=1024**3;function Q(e){const o=me(e),t=o.model,
r=Object.values(ge).find(n=>n.model.repository===(t==null?void 0:t.repository)&&n.model.revision===(t==null?void 0:t.revision)&&
n.model.pipeline===(t==null?void 0:t.pipeline));if(!r||t.runtime!=="onnx-diffusion"||t.runtimeVersion!==ie||t.task!=="te\
xt-to-image"||t.architecture!==r.model.architecture||JSON.stringify(t.modalities)!=='["text"]'||JSON.stringify(t.outputModalities)!==
'["image"]'||o.files.length!==r.files.length)throw new Error("Diffusion package is not in the trusted runtime catalog");
for(const n of["format","dtype","steps","width","height","padTokenId","weightQuantization","requiredFeatures"]){const i=(a,u)=>a&&
u&&typeof a=="object"&&typeof u=="object"?Object.keys(a).length===Object.keys(u).length&&Object.keys(a).every(c=>i(a[c],
u[c])):a===u;if(!i(t[n],r.model[n]))throw new Error(`Diffusion ${n} differs from the trusted profile`)}for(const n of r.
files){const i=o.files.find(a=>a.path===n.path);if(!i||i.size!==n.size||i.sha256!==n.sha256)throw new Error("Diffusion f\
iles differ from pinned catalog digests")}const s=o.files.reduce((n,i)=>n+i.size,0);if(!Number.isSafeInteger(s)||s>3*C)throw new Error(
"Diffusion package exceeds its admitted byte budget");return{manifest:o,trusted:r,totalBytes:s,resourcePolicy:{maxModelBytes:3*
C,minimumCpuBytes:8*C,minimumGpuBytes:8*C}}}function ye(e,o){const{trusted:t}=Q(o);if(e.image)throw new Error("This diff\
usion runtime accepts text only");const r=be(e);if(r.length!==1||r[0].role!=="user")throw new Error("Diffusion requires \
exactly one user prompt");const s=r[0].content.trim();if(!s||new TextEncoder().encode(s).length>4096)throw new Error("Di\
ffusion needs a text prompt of at most 4096 bytes");const n=e.seed??crypto.getRandomValues(new Uint32Array(1))[0];if(!Number.
isSafeInteger(n)||n<0||n>4294967295)throw new Error("Diffusion seed must be uint32");const i=e.steps??t.steps;if(i!==t.steps||
(e.width??512)!==512||(e.height??512)!==512)throw new Error(`This diffusion profile requires 512×512 and ${t.steps} ste\
ps`);return{task:"text-to-image",prompt:s,messages:[{role:"user",content:s}],seed:n,steps:i,width:512,height:512}}function Ee(e,o=(t=>(t=
globalThis.location)==null?void 0:t.href)()){if(!e||Object.keys(e).some(n=>!["mjs","wasm"].includes(n)))throw new Error(
"Unexpected diffusion runtime assets");const r=new URL(o),s={};for(const n of["mjs","wasm"]){if(typeof e[n]!="string")throw new Error(
"Trusted diffusion runtime assets are required");const i=new URL(e[n],r);if(i.origin!==r.origin||i.username||i.password||
i.hash||!["http:","https:"].includes(i.protocol)||!new RegExp(`(?:^|/)ort-wasm-simd-threaded\\.jsep(?:-[A-Za-z0-9_-]+)?\\.${n}\
$`).test(i.pathname))throw new Error("Diffusion assets must be same-origin ORT JSEP files");s[n]=i.href}return s}const ae=256*
64,V=14.6146,U=Object.freeze([999,759,499,259]);function xe(e){if(!Number.isInteger(e)||e<0||e>4294967295)throw new Error(
"Seed must be uint32");let o=e>>>0;return()=>{o=o+1831565813>>>0;let t=Math.imul(o^o>>>15,o|1);return t^=t+Math.imul(t^t>>>
7,t|61),((t^t>>>14)>>>0)/4294967296}}function de(e,o=1){const t=new Float32Array(ae);for(let r=0;r<t.length;r+=2){const s=Math.
sqrt(-2*Math.log(Math.max(e(),Number.EPSILON)))*o,n=2*Math.PI*e();t[r]=s*Math.cos(n),t[r+1]=s*Math.sin(n)}return t}function P(e){
if(!(e instanceof Float32Array)||e.length!==ae)throw new Error("Invalid diffusion latent tensor");for(const o of e)if(!Number.
isFinite(o))throw new Error("Nonfinite diffusion tensor");return e}function ke(e){return P(e),e.map(o=>o/Math.sqrt(V**2+
1))}function ve(e,o){return P(e),P(o),e.map((t,r)=>(t-V*o[r])/.18215)}const oe=(()=>{const e=new Float64Array(1e3);let o=1;
const t=Math.sqrt(85e-5),r=Math.sqrt(.012);for(let s=0;s<e.length;s++){const n=(t+(r-t)*s/(e.length-1))**2;o*=1-n,e[s]=o}
return e})();function Ie(e,o,t,r){if(P(e),P(o),!Number.isInteger(t)||t<0||t>=U.length)throw new Error("Invalid LCM step");
const s=U[t],n=oe[s],i=s*10,a=.25/(i**2+.25),u=i/Math.sqrt(i**2+.25),c=t===U.length-1,b=c?1:oe[U[t+1]],d=c?null:de(r);return e.
map((f,l)=>{const p=(f-Math.sqrt(1-n)*o[l])/Math.sqrt(n),w=u*p+a*f;return c?w:Math.sqrt(b)*w+Math.sqrt(1-b)*d[l]})}function _e(e,o){
if(!(e instanceof Float32Array)||!Array.isArray(o)||o.length!==4||o[0]!==1||o[1]!==3||o[2]!==512||o[3]!==512||e.length!==
3*512*512)throw new Error("Diffusion decoder must produce float32 [1,3,512,512]");const t=512*512,r=new Uint8Array(t*4);
for(let s=0;s<t;s++){for(let n=0;n<3;n++){const i=e[n*t+s];if(!Number.isFinite(i))throw new Error("Diffusion decoder pro\
duced nonfinite pixels");r[s*4+n]=Math.round(Math.min(1,Math.max(0,i/2+.5))*255)}r[s*4+3]=255}return{width:512,height:512,
channels:4,data:r}}const ne=[1,4,64,64],ze=2*1024**3,Me=()=>new Promise(e=>setTimeout(e,0));async function J(e,o,t){if(!o||
o.size<=0||o.size>=ze)throw new Error("Diffusion file exceeds the loader buffer budget");const r=new Uint8Array(o.size);
for(let s=0;s<o.size;s+=4*1024**2){x(t);const n=await e.read(o.path,s,Math.min(4*1024**2,o.size-s),{signal:t});r.set(n,s)}
return r}function De(e,o){const t=e.createCommandEncoder.bind(e),r=e.queue.submit.bind(e.queue);e.createCommandEncoder=(...s)=>{
const n=t(...s),i=n.beginComputePass.bind(n);return n.beginComputePass=(...a)=>{const u=i(...a);for(const c of["dispatch\
Workgroups","dispatchWorkgroupsIndirect"]){const b=u[c].bind(u);u[c]=(...d)=>{const f=b(...d);return o.gpuDispatches++,f}}
return u},n},e.queue.submit=(...s)=>{const n=r(...s);return o.gpuSubmissions++,n}}function Se(e,o){const t=e.requestDevice;
return e.requestDevice=async function(...r){const s=await t.apply(this,r);return o(s),s},()=>{e.requestDevice=t}}async function ce({
device:e,operation:o,setDeviceCapture:t,markLost:r,stage:s="execution"}){var f;let n,i,a;const u=[],c=l=>{if(n!==l){if(n)
throw new Error("Diffusion changed GPU devices during an operation");n=l;for(const p of["validation","out-of-memory","in\
ternal"])l.pushErrorScope(p),u.push(p)}};try{if(e&&c(e),t==null||t(c),i=await o(),!n)throw new Error("ORT did not create\
 the admitted GPU device");await n.queue.onSubmittedWorkDone()}catch(l){a=l}finally{t==null||t(null)}const b=await Promise.
all(u.reverse().map(async l=>{try{return{filter:l,error:await n.popErrorScope()}}catch(p){return{filter:l,error:p,scopeFailed:!0}}})),
d=["out-of-memory","internal","validation"].map(l=>b.find(p=>p.filter===l&&p.error&&!p.scopeFailed)).find(Boolean);if(a??
(a=(f=b.find(l=>l.scopeFailed))==null?void 0:f.error),d||a){const l=(d==null?void 0:d.error)??a,p=(d==null?void 0:d.filter)===
"out-of-memory"?"out of memory":(d==null?void 0:d.filter)??"execution failure",w=(d==null?void 0:d.filter)==="out-of-mem\
ory"?`Model session lost: diffusion ${s} GPU out of memory. Close GPU-heavy apps or unload other models, then reload thi\
s model.`:`Model session lost: diffusion ${s} GPU ${p}: ${String(l.message??l).slice(0,240)}`,E=new Error(w,{cause:l});throw E.
code=(d==null?void 0:d.filter)==="out-of-memory"?"ERR_DIFFUSION_GPU_OUT_OF_MEMORY":"ERR_DIFFUSION_GPU",r(E),E}return i}function Ne(e,o){
const t=r=>o(r.error);return e.addEventListener("uncapturederror",t),()=>e.removeEventListener("uncapturederror",t)}async function Te({
session:e,inputs:o,device:t,signal:r,own:s,markLost:n,stage:i="execution"}){x(r);const a=await ce({device:t,markLost:n,stage:i,
operation:async()=>{const u=await e.run(o);return Object.values(u).forEach(s),u}});return x(r),a}function Ae(e,o){var t;
return Array.isArray(e.inputMetadata)?e.inputMetadata.find(r=>r.name===o):(t=e.inputMetadata)==null?void 0:t[o]}function se(e,o,t,r,s){
var i;const n=(i=Ae(o,t))==null?void 0:i.type;if(n==="int32")return new e.Tensor("int32",Int32Array.from(r,Number),s);if(n===
"int64")return new e.Tensor("int64",BigInt64Array.from(r,BigInt),s);if(n==="float32")return new e.Tensor("float32",Float32Array.
from(r,Number),s);throw new Error(`Unsupported diffusion input type for ${t}: ${n}`)}async function Oe({manifest:e,runtimeAssets:o,
artifactPort:t,signal:r,onProgress:s,gpu:n=(u=>(u=globalThis.navigator)==null?void 0:u.gpu)(),loadOrt:i=()=>import("./ort.all.bundle.min-C6Fbxsv8.js"),
loadTokenizer:a=()=>import("./transformers.web-C7Eqzws9.js").then(c=>c.CLIPTokenizer)}){var Z,Y,K;const{trusted:c}=Q(e),
b={},d={gpuDispatches:0,gpuSubmissions:0,generatedRequests:0};let f,l,p,w,E,N,j,T=!1,F=!1,z=!1;const G=h=>{var y;T||(z=!0,
d.gpuFailure||(d.gpuFailure=String(((y=h==null?void 0:h.cause)==null?void 0:y.message)??(h==null?void 0:h.message)??h??"\
GPU operation failed").slice(0,400),console.error("Diffusion GPU failure:",d.gpuFailure)))};async function H(){if(T)return;
T=!0,E==null||E(),E=null,N==null||N(),N=null,l==null||l.close();let h;for(const y of Object.values(b))try{await y.release()}catch(M){
h??(h=M)}if(f==null||f.destroy(),h)throw h}try{const h=await(n==null?void 0:n.requestAdapter({powerPreference:"high-perf\
ormance"}));if(x(r),!h||h.isFallbackAdapter||(Z=h.info)!=null&&Z.isFallbackAdapter||!h.features.has("shader-f16"))throw new Error(
"Diffusion requires a hardware WebGPU adapter with shader-f16; CPU fallback is disabled");if(d.adapter={vendor:((Y=h.info)==
null?void 0:Y.vendor)??"",architecture:((K=h.info)==null?void 0:K.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[
"shader-f16"]},w=await i(),w.env.versions.web!==ie)throw new Error("Unexpected diffusion ORT runtime version");w.env.wasm.
proxy=!1,w.env.wasm.numThreads=1,w.env.wasm.wasmPaths=o,w.env.webgpu.adapter=h,E=Se(h,m=>{f=m,j==null||j(f),N=Ne(f,G),d.
runtimeFeatures=[...f.features],De(f,d),f.lost.then(()=>{T||(z=!0)})}),w.env.logLevel="error",l=pe(t,{manifest:e,signal:r,
maxReadBytes:4*1024**2,maxReads:1,maxQueuedReads:2,readTimeoutMs:6e4});const y=m=>e.files.find(I=>I.path===m),M=JSON.parse(
new TextDecoder().decode(await J(l,y("tokenizer/tokenizer.json"),r))),k=JSON.parse(new TextDecoder().decode(await J(l,y(
"tokenizer/tokenizer_config.json"),r))),A=await a();p=new A(M,k),p.pad_token_id=c.padTokenId;for(const m of["unet","text\
_encoder","vae_decoder"]){x(r),s==null||s({type:"model-load",stage:m,loaded:0,total:y(`${m}/model.onnx`).size});let I=await J(
l,y(`${m}/model.onnx`),r);const O=c.pipeline==="sd-turbo"?{unet:{batch_size:1,num_channels:4,height:64,width:64,sequence_length:77},
text_encoder:{batch_size:1},vae_decoder:{batch_size:1,num_channels_latent:4,height_latent:64,width_latent:64}}:{};if(b[m]=
await ce({device:f,stage:`${m} load`,markLost:G,setDeviceCapture:R=>{j=R},operation:async()=>(b[m]=await w.InferenceSession.
create(I,{executionProviders:["webgpu"],enableMemPattern:!1,enableCpuMemArena:!1,...O[m]?{freeDimensionOverrides:O[m]}:{},
extra:{session:{disable_prepacking:"1",use_device_allocator_for_initializers:"1"}}}),b[m])}),!f||w.env.webgpu.device!==f||
!f.features.has("shader-f16"))throw new Error("ORT did not create the admitted WebGPU device");E==null||E(),E=null,I=null,
x(r),s==null||s({type:"model-load",stage:m,loaded:y(`${m}/model.onnx`).size,total:y(`${m}/model.onnx`).size})}if(l.close(),
d.artifactReads=l.getStats(),l=null,await f.queue.onSubmittedWorkDone(),x(r),z)throw new Error("GPU device lost while lo\
ading diffusion")}catch(h){try{await H()}catch(y){throw new AggregateError([h,y],"Diffusion loader cleanup failed")}throw h}
return{evidence:d,get lost(){return z},dispose:H,async generate({prompt:h,seed:y,steps:M,signal:k,onProgress:A}){if(T||z)
throw new Error("Model session lost: diffusion device is unavailable");if(F)throw new Error("Diffusion engine is already\
 generating");F=!0;const m=new Set,I=g=>(m.add(g),g),O={dispatches:d.gpuDispatches,submissions:d.gpuSubmissions},R=async(g,v)=>{
x(k);const B=d.gpuDispatches,L=await Te({session:g,inputs:v,device:f,signal:k,own:I,markLost:G,stage:g===b.text_encoder?
"text encoder":g===b.unet?"denoise":"decode"});if(x(k),z)throw new Error(`GPU operation failed during diffusion: ${d.gpuFailure??
"device lost"}`);if(d.gpuDispatches<=B)throw new Error("Diffusion stage did not execute on WebGPU");if(await Me(),x(k),z)
throw new Error(`GPU operation failed during diffusion: ${d.gpuFailure??"device lost"}`);return L},$=(g,v)=>{x(k),A==null||
A({type:"diffusion-progress",stage:g,step:v,steps:M})};try{$("text-encoder",0);let v=p(h,{padding:"max_length",max_length:77,
truncation:!0,return_tensor:!1}).input_ids;if(Array.isArray(v[0])&&(v=v[0]),!Array.isArray(v)||v.length!==77||v.some(_=>!Number.
isInteger(_)||_<0||_>49407))throw new Error("Invalid CLIP token sequence");const B=I(se(w,b.text_encoder,"input_ids",v,[
1,77])),{last_hidden_state:L}=await R(b.text_encoder,{input_ids:B});if(!L)throw new Error("Diffusion text encoder did no\
t return hidden states");const ee=xe(y);let D=de(ee,c.pipeline==="sd-turbo"?V:1);for(let _=0;_<M;_++){$("denoise",_);const W=I(
new w.Tensor("float32",c.pipeline==="sd-turbo"?ke(D):D,ne)),he=c.pipeline==="sd-turbo"?999:U[_],X=I(se(w,b.unet,"timeste\
p",[he],[1])),{out_sample:S}=await R(b.unet,{sample:W,timestep:X,encoder_hidden_states:L});if(!S||S.type!=="float32")throw new Error(
"Invalid diffusion UNet output");D=c.pipeline==="sd-turbo"?ve(D,S.data):Ie(D,S.data,_,ee),S.dispose(),m.delete(S),W.dispose(),
m.delete(W),X.dispose(),m.delete(X)}$("decode",M);const fe=I(new w.Tensor("float32",D,ne)),ue=c.pipeline==="sd-turbo"?"l\
atent_sample":"latent",q=(await R(b.vae_decoder,{[ue]:fe}))[c.pipeline==="sd-turbo"?"sample":"image"];if(!q||q.type!=="f\
loat32")throw new Error("Invalid diffusion image tensor");const le=_e(q.data,q.dims);return x(k),d.generatedRequests++,{
text:"",image:le,seed:y,steps:M,gpuDispatches:d.gpuDispatches-O.dispatches,gpuSubmissions:d.gpuSubmissions-O.submissions}}catch(g){
throw k!=null&&k.aborted?g:(z=!0,String(g.message).startsWith("Model session lost:")?g:new Error(`Model session lost: ${String(
g.message??g).slice(0,300)}`,{cause:g}))}finally{for(const g of m)try{g.dispose()}catch{}F=!1}}}}function Re(){if(typeof WorkerGlobalScope>
"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("Diffusion requires a ComputeManager-owned worker")}function Ue({
createEngine:e=Oe,assertWorker:o=Re,baseUrl:t=(r=>(r=globalThis.location)==null?void 0:r.href)()}={}){const s=new Map,n=i=>{
var a,u;return{sessionId:i.sessionId,manifestCid:i.manifestCid,status:(a=i.engine)!=null&&a.lost?"lost":i.status,workerId:i.
workerId,...(u=i.engine)==null?void 0:u.evidence}};return async function(a,u={}){var d;if(o(),te(a==null?void 0:a.sessionId),
x(u.signal),a.command==="load"){if(s.size)throw new Error("Unload the resident diffusion model first");const{manifest:f}=Q(
a.manifest),l=Ee(a.runtimeAssets,t),p={sessionId:a.sessionId,manifestCid:a.manifestCid,manifest:f,status:"loading",workerId:u.
workerId,engine:null};s.set(a.sessionId,p);try{return p.engine=await e({manifest:f,runtimeAssets:l,artifactPort:a.artifactPort,
signal:u.signal,onProgress:u.emitProgress}),x(u.signal),p.status="ready",n(p)}catch(w){try{await((d=p.engine)==null?void 0:
d.dispose()),s.delete(a.sessionId)}catch(E){throw p.status="lost",new AggregateError([w,E],"Model session lost: diffusio\
n cleanup failed")}throw w}}const c=s.get(a.sessionId);if(!c)throw new Error("Diffusion session is not loaded");if(a.command===
"status")return n(c);if(a.command==="unload")return c.status="unloading",await c.engine.dispose(),s.delete(a.sessionId),
{sessionId:a.sessionId,status:"unloaded"};if(a.command!=="generate")throw new Error("Unknown diffusion command");if(te(a.
requestId),c.status!=="ready"||c.engine.lost)throw new Error("Model session lost: diffusion is not ready");const b=ye(a,
c.manifest);c.status="generating";try{const f=await c.engine.generate({...b,signal:u.signal,onProgress:u.emitProgress});
return x(u.signal),{...f,sessionId:a.sessionId,requestId:a.requestId,workerId:c.workerId}}catch(f){throw f instanceof WebAssembly.
RuntimeError?(c.status="lost",new Error(`Model session lost: diffusion native runtime failed: ${f.message}`)):(/Model session lost/.
test((f==null?void 0:f.message)??"")&&(c.status="lost"),f)}finally{c.status!=="lost"&&(c.status=c.engine.lost?"lost":"re\
ady")}}}const Fe=Ue();export{Ue as createDiffusionTaskHandler,Fe as handleModelTask};
