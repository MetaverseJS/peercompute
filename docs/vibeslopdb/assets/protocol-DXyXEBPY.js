import{s as _,f as q,l as V,b as H,a_ as f,v as F,aY as G,a$ as X,b7 as U}from"./carnageWindow--1fjkU2y.js";const L=Object.
freeze(["text-generation","image-text-to-text","audio-text-to-text","text-to-image","automatic-speech-recognition","text\
-to-speech","image-to-3d"]),C=new Set(["text-generation","image-text-to-text","audio-text-to-text"]);function T(e,t){const s=e?.
modalities,n=e?.outputModalities;return!Array.isArray(s)||!Array.isArray(n)||!L.includes(t)?!1:C.has(t)?C.has(e.task)&&s.
includes("text")&&n.includes("text")&&(t!=="image-text-to-text"||s.includes("image"))&&(t!=="audio-text-to-text"||s.includes(
"audio")):e.task!==t?!1:t==="image-to-3d"?s.includes("image")&&n.includes("mesh"):t==="automatic-speech-recognition"?s.includes(
"audio")&&n.includes("text"):s.includes("text")&&n.includes(t==="text-to-image"?"image":"audio")}function Y(e,t){return T(
e,t)?!Array.isArray(e.hosts)||e.hosts.some(s=>T({...e,...s},t)):!1}function $(e={},t="text-generation"){return e.task!=null?
e.task:e.audio!=null?e.messages!=null||e.prompt!=null||e.image!=null?"audio-text-to-text":"automatic-speech-recognition":
e.image!=null?"image-text-to-text":t}function se(e,t={}){return Y(e,$(t))&&(t.image==null||e.modalities.includes("image"))&&
(t.audio==null||e.modalities.includes("audio"))}const p=Object.freeze({chunkBytes:64*1024,inputSampleRate:16e3,inputSeconds:20,
outputSeconds:30,maxSampleRate:48e3}),N=(e,t,s)=>{if(!Number.isSafeInteger(e)||e<t||e>s)throw new Error("Invalid audio n\
umeric field");return e};function l(e,{input:t=!1}={}){if(!e||e.format!=="f32le"||e.channels!==1||!/^[a-f0-9]{64}$/.test(
e.sha256??""))throw new Error("Audio requires mono f32le PCM and a SHA-256 digest");const s=N(e.sampleRate,t?16e3:8e3,t?
16e3:p.maxSampleRate),n=N(e.sampleCount,t?1600:1,s*(t?p.inputSeconds:p.outputSeconds));return{format:"f32le",channels:1,
sampleRate:s,sampleCount:n,sha256:e.sha256}}function b(e,t=0,s=e.length,n=!1){if(!(e instanceof Float32Array))throw new Error(
"Audio samples must be Float32 PCM");const i=new Uint8Array((s-t)*4),r=new DataView(i.buffer);for(let d=t;d<s;d++){const u=e[d];
if(!Number.isFinite(u)||Math.abs(u)>(n?1.01:10))throw new Error("Invalid PCM sample");r.setFloat32((d-t)*4,u,!0)}return i}
function S(e,t,s={}){if(!(e instanceof Float32Array))throw new Error("Audio samples must be Float32 PCM");const n=l({format:"\
f32le",channels:1,sampleRate:t,sampleCount:e.length,sha256:"0".repeat(64)},s),i=_.create();for(let r=0;r<e.length;r+=p.chunkBytes/
4)i.update(b(e,r,Math.min(e.length,r+p.chunkBytes/4),s.input));return{...n,sha256:q(i.digest())}}async function B(e,t,{requestId:s,
signal:n,credit:i,input:r=!1}){const d=new Float32Array(t.sampleCount),u=_.create();let c=0;for(;c<d.byteLength;){const m=await e.
rpc.read({signal:n});if(!m.byteLength||m.byteLength%4||m.byteLength>p.chunkBytes||m.byteLength>d.byteLength-c)throw new Error(
"Invalid PCM transfer frame");const o=m.subarray(),h=new DataView(o.buffer,o.byteOffset,o.byteLength);u.update(o);for(let y=0;y<
o.length;y+=4){const I=h.getFloat32(y,!0);if(!Number.isFinite(I)||Math.abs(I)>(r?1.01:10))throw new Error("Invalid PCM s\
ample");d[(c+y)/4]=I}if(c+=o.length,c===d.byteLength&&q(u.digest())!==t.sha256)throw new Error("Audio digest mismatch");
await e.write({type:i,requestId:s,offset:c},n)}return d}async function ne(e,{samples:t,requestId:s,signal:n}){for(let i=0;i<
t.length;){const r=Math.min(t.length,i+p.chunkBytes/4);await e.rpc.write(b(t,i,r,!0),{signal:n});const d=await e.read(n);
if(d.type!=="audio-credit"||d.requestId!==s||d.offset!==r*4)throw new Error("Invalid audio transfer credit");i=r}}async function ie(e,{
audio:t,requestId:s,signal:n}){const i=l(t,{input:!0});return{samples:await B(e,i,{requestId:s,signal:n,input:!0,credit:"\
audio-credit"}),sampleRate:i.sampleRate}}async function re(e,{samples:t,metadata:s,requestId:n,controls:i,signal:r}){const d=i.
expect(0);await e.write({type:"result-audio",requestId:n,audio:s},r),await d;for(let u=0;u<t.length;){const c=Math.min(t.
length,u+p.chunkBytes/4),m=i.expect(c*4);await e.rpc.write(b(t,u,c),{signal:r}),await m,u=c}}async function oe(e,{audio:t,
requestId:s,signal:n}){const i=l(t);return await e.write({type:"result-credit",requestId:s,offset:0},n),{audio:await B(e,
i,{requestId:s,signal:n,credit:"result-credit"}),sampleRate:i.sampleRate,metadata:i}}const E="/peercompute/inference/6.0\
.0",k="/peercompute/inference/5.0.0",D="/peercompute/inference/4.0.0",J="/peercompute/inference/3.0.0",A="/peercompute/i\
nference/2.0.0",ae=Object.freeze([E,k,D,J,A]),K=e=>[E,k,D].includes(e),Q=e=>[E,k].includes(e),W=e=>e?.runtime==="webgpu-\
sf3d",z=e=>["automatic-speech-recognition","text-to-speech"].includes(e),Z=256,x=Object.freeze({frameBytes:128*1024,imageChunkBytes:64*
1024,maximumPeers:32,maximumModels:128,maximumInbound:5,maximumPerPeer:2,maximumOutbound:5,maximumHostedModels:16,queryTimeoutMs:5e3,
requestTimeoutMs:12e4,recordTtlMs:15e3}),j=new TextEncoder,v=new TextDecoder("utf-8",{fatal:!0}),R=e=>j.encode(e).length,
w=e=>H.parse(g(e,128)).toV1().toString();function g(e,t=256){if(typeof e!="string"||!e.length||R(e)>t)throw new Error("I\
nvalid inference text field");return e}function a(e,t,s=0){if(!Number.isSafeInteger(e)||e<s||e>t)throw new Error("Invali\
d inference numeric field");return e}function de(e){return e?.status==="open"&&!!e.remotePeer&&(e.encryption==="/noise"||
e.encryption==="/tls/1.0.0"||e.encryption==="native"&&e.remoteAddr?.getComponents?.().some(({name:t})=>t==="webrtc"||t===
"webrtc-direct"))}function P(e){if(!e||typeof e!="object")throw new Error("Invalid model descriptor");if(!Array.isArray(
e.modalities)||e.modalities.length>4||e.modalities.some(n=>!["text","image","audio","video"].includes(n)))throw new Error(
"Invalid model modalities");const t=e.task??(e.modalities.includes("image")?"image-text-to-text":"text-generation");if(!L.
includes(t))throw new Error("Invalid model task");const s=t==="image-to-3d"?["mesh"]:t==="text-to-image"?["image"]:t==="\
text-to-speech"?["audio"]:["text"];if(e.outputModalities!==void 0&&(!Array.isArray(e.outputModalities)||e.outputModalities.
length!==1||e.outputModalities[0]!==s[0]))throw new Error("Model output modalities do not match its task");if(t==="text-\
to-image"&&(e.modalities.length!==1||e.modalities[0]!=="text"))throw new Error("Image generation accepts text input only");
if(t==="image-to-3d"&&(e.modalities.length!==1||e.modalities[0]!=="image"))throw new Error("Mesh generation accepts imag\
e input only");if(z(t)&&(e.modalities.length!==1||e.modalities[0]!==(t==="text-to-speech"?"text":"audio")))throw new Error(
"Invalid speech model modalities");if(t==="audio-text-to-text"&&(!e.modalities.includes("text")||!e.modalities.includes(
"audio")))throw new Error("Native audio conversation requires text and audio modalities");return{manifestCid:w(e.manifestCid),
modelId:g(e.modelId),name:g(e.name),task:t,outputModalities:s,modalities:[...new Set(e.modalities)],runtime:g(e.runtime,
128),repository:g(e.repository,256),revision:g(e.revision,128),totalBytes:a(e.totalBytes,64*1024**3)}}function M(e,t){return t===
E||!e?e:W(e)||e.task==="image-to-3d"&&!Q(t)?null:K(t)?e:t===A&&z(e.task)?null:e.task==="text-generation"||e.task==="audi\
o-text-to-text"?{...e,task:"text-generation",modalities:["text"]}:e.task==="image-text-to-text"?{...e,modalities:e.modalities.
filter(s=>s!=="audio")}:e}function ce(e,t=!0,{defaultMaxNewTokens:s=Z,protocol:n=E}={}){if(!e||!Array.isArray(e.sharedModels)||
e.sharedModels.length>x.maximumModels)throw new Error("Invalid shared model catalog");const i=[...new Map(e.sharedModels.
map(o=>{const h=P(o);return[h.manifestCid,h]})).values()].map(o=>M(o,n)).filter(Boolean),r=(o,h={})=>({...P(o),maxNewTokens:a(
o.maxNewTokens===void 0?s:o.maxNewTokens,f.maxNewTokens,1),busy:!!(o.busy??h.busy),idleForMs:a(o.idleForMs??h.idleForMs??
0,Number.MAX_SAFE_INTEGER),queuedRequests:a(o.queuedRequests??h.queuedRequests??0,1024),queueCapacity:a(o.queueCapacity??
f.maxQueued,1024),queueAvailable:o.queueAvailable!==!1}),d=t&&e.hostedModel?r(e.hostedModel,e):null,u=M(d,n),c=e.hostedModels??
(d?[d]:[]);if(!Array.isArray(c)||c.length>x.maximumHostedModels)throw new Error("Invalid hosted model list");const m=t?c.
map(o=>M(r(o),n)).filter(Boolean):[];if(new Set(m.map(o=>o.manifestCid)).size!==m.length)throw new Error("Duplicate host\
ed model identity");return{sharedModels:i,hostedModel:u,...n!==A?{hostedModels:m}:{},busy:!!e.busy,idleForMs:a(e.idleForMs??
0,Number.MAX_SAFE_INTEGER),queuedRequests:a(e.queuedRequests??0,1024)}}function ue(e,{imageBytes:t=!1}={}){if(G(e.requestId),
e.task==="image-to-3d"){if(!e.image||["prompt","messages","audio","seed","steps","width","height","maxNewTokens"].some(n=>e[n]!=
null))throw new Error("Mesh generation accepts image input only");return{requestId:e.requestId,manifestCid:w(e.manifestCid),
task:e.task,image:O(e.image,t)}}if(e.task==="automatic-speech-recognition"){if(e.prompt!=null||e.messages!=null||e.image!=
null||!e.audio)throw new Error("ASR accepts audio only");const n=t?S(e.audio.samples,e.audio.sampleRate,{input:!0}):l(e.
audio,{input:!0});return{requestId:e.requestId,manifestCid:w(e.manifestCid),task:e.task,audio:{...n,...t?{samples:new Float32Array(
e.audio.samples)}:{}}}}if(e.audio!=null&&e.task!=="audio-text-to-text")throw new Error("Only ASR or native audio convers\
ation accepts audio input");if(e.task==="text-to-speech"){if(e.image!=null||e.messages!=null||typeof e.prompt!="string")
throw new Error("TTS accepts one text prompt");const n=e.prompt.trim();if(!n||[...n].length>256||R(n)>1024)throw new Error(
"Speech text exceeds its budget");return{requestId:e.requestId,manifestCid:w(e.manifestCid),task:e.task,prompt:n}}const s={
requestId:e.requestId,manifestCid:w(e.manifestCid),messages:X(e.task==="audio-text-to-text"&&e.messages==null&&e.prompt==
null?{prompt:"Transcribe this audio."}:e),maxNewTokens:a(e.maxNewTokens??f.maxNewTokens,f.maxNewTokens,1)};if(e.task!==void 0){
if(!["text-generation","image-text-to-text","audio-text-to-text","text-to-image"].includes(e.task))throw new Error("Inva\
lid inference task");s.task=e.task}if(e.task==="audio-text-to-text"){if(!e.audio)throw new Error("Native audio conversat\
ion requires audio input");const n=t?S(e.audio.samples,e.audio.sampleRate,{input:!0}):l(e.audio,{input:!0});s.audio={...n,
...t?{samples:new Float32Array(e.audio.samples)}:{}}}e.seed!==void 0&&(s.seed=a(e.seed,4294967295)),e.steps!==void 0&&(s.
steps=a(e.steps,8,1));for(const n of["width","height"])e[n]!==void 0&&(s[n]=a(e[n],512,512));if(s.task==="text-to-image"&&
(e.image!=null||s.messages.length!==1||s.messages[0].role!=="user"))throw new Error("Image generation needs one text pro\
mpt");return e.image!=null&&(s.image=O(e.image,t)),s}function O(e,t){const{width:s,height:n,channels:i}=e;if(a(s,f.maxImagePixels,
1),a(n,f.maxImagePixels,1),i!==4||s*n>f.maxImagePixels)throw new Error("Invalid inference image dimensions");return t&&F(
e),{width:s,height:n,channels:4,...t?{data:new Uint8Array(e.data)}:{}}}function ee(e,{imageBytes:t=!1}={}){if(!e||typeof e!=
"object")throw new Error("Invalid result image");const s=a(e.width,1024,1),n=a(e.height,1024,1);if(e.channels!==4||s*n>f.
maxImagePixels||!/^[a-f0-9]{64}$/.test(e.sha256??""))throw new Error("Invalid result image dimensions or digest");return t&&
F(e),{width:s,height:n,channels:4,sha256:e.sha256,...t?{data:e.data}:{}}}function me(e,t={}){const s=e?.text??(e?.audio||
e?.mesh?"":void 0);if(typeof s!="string"||R(s)>f.maxOutputBytes)throw new Error("Invalid inference result text");const n=e.
finishReason===void 0?"unknown":e.finishReason;if(!["stop","length","unknown"].includes(n))throw new Error("Invalid infe\
rence finish reason");const i={text:s,finishReason:n};if(e.contextTruncated!==void 0){if(typeof e.contextTruncated!="boo\
lean")throw new Error("Invalid inference context truncation flag");i.contextTruncated=e.contextTruncated}for(const r of[
"inputTokens","outputTokens","gpuDispatches","gpuSubmissions"])e[r]!=null&&(i[r]=a(e[r],Number.MAX_SAFE_INTEGER));return e.
image!=null&&(i.image=ee(e.image,t)),e.audio!=null&&(i.audio=l(e.audio)),e.mesh!=null&&(i.mesh=U(e.mesh)),e.seed!==void 0&&
(i.seed=a(e.seed,4294967295)),e.steps!==void 0&&(i.steps=a(e.steps,8,1)),i}function fe(e){if(!["text-encoder","denoise",
"decode"].includes(e.stage))throw new Error("Invalid image generation stage");const t=a(e.steps,8,1);return{type:"diffus\
ion-progress",stage:e.stage,steps:t,step:a(e.step,t)}}function he(e){if(!["image","shape","color","done"].includes(e?.stage))
throw new Error("Invalid mesh generation stage");const t=a(e.total,262144,1);return{type:"mesh-generation",stage:e.stage,
total:t,loaded:a(e.loaded,t)}}function pe(e){const t=V(e,{maxDataLength:x.frameBytes,maxBufferSize:x.frameBytes*2+32});return{
rpc:t,async read(s){return JSON.parse(v.decode((await t.read({signal:s})).subarray()))},async write(s,n){const i=j.encode(
JSON.stringify(s));if(i.length>x.frameBytes)throw new Error("Inference frame exceeds its byte limit");await t.write(i,{signal:n})}}}export{D as A,J as B,Y as C,l as D,L as I,Z as L,x as P,ae as a,E as b,w as c,pe as d,de as e,A as f,ue as g,z as h,a as i,
Q as j,$ as k,ce as l,se as m,ie as n,R as o,he as p,fe as q,ee as r,K as s,me as t,S as u,W as v,re as w,ne as x,oe as y,
k as z};
