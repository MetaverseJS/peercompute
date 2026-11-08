import{f as J,t as C,a as N,d as K}from"./ArtifactReadBridge-mLMxyVL0.js";import{n as Q}from"./ArtifactManifest-Bn7pK_eB.js";
const D=e=>(e&&typeof e=="object"&&(Object.values(e).forEach(D),Object.freeze(e)),e),Y=D({"moonshine-tiny-fp32":{id:"moo\
nshine-tiny-fp32",name:"Moonshine Tiny · local speech recognition",description:"Pinned local managed WebGPU speech cand\
idate.",license:"mit",repository:"onnx-community/moonshine-tiny-ONNX",revision:"a6da1241cd305dcd64eab1edbd615f2bb9aabb95",
model:{runtime:"transformers-speech",runtimeVersion:"4.3.2",repository:"onnx-community/moonshine-tiny-ONNX",revision:"a6\
da1241cd305dcd64eab1edbd615f2bb9aabb95",architecture:"moonshine",task:"automatic-speech-recognition",dtype:"fp32",format:"\
ONNX",modalities:["audio"],outputModalities:["text"],sampleRate:16e3,requiredFeatures:[]},files:[{path:"onnx/encoder_mod\
el.onnx",size:30882331,sha256:"cbbf580f703b2af2137e0f6d14cd87f31cc67bd858bfd8715403a9489982d1a5"},{path:"onnx/decoder_mo\
del_merged.onnx",size:78227550,sha256:"4131cef00b62942e9cdef691101f2cc7dbbcd828d71eee8c6c46c28fd051d6cb"},{path:"README.\
md",size:904,sha256:"a335c967aac0a7933b210011590b89e5040b30a53e1930e1d801224df78cf153"},{path:"config.json",size:921,sha256:"\
558e1e02069137c796ace1e50c48d8fe451f04a295929138e6bea885517f0edb"},{path:"generation_config.json",size:147,sha256:"f9b3f\
711b57be7def2e50a8942f64f36ee0a55fad5b84ff93a687b6c5bcc1d44"},{path:"preprocessor_config.json",size:128,sha256:"fa43a701\
7ef85cd1d0fba0d9aae77c8adb16990ae6f11115631f41ec5d8aa679"},{path:"special_tokens_map.json",size:3,sha256:"ca3d163bab0553\
81827226140568f3bef7eaac187cebd76878e0b63e9e442356"},{path:"tokenizer.json",size:3761754,sha256:"7b913404bdd039af4756783\
218af4440bc07fb7d6d8258d677e34f95b3ec416f"},{path:"tokenizer_config.json",size:135735,sha256:"edaee394565d428ea98a663ae7\
209cdcfeefc5585c42d7a570ff7c986df2cd15"}],totalBytes:113009473},"supertonic-fp32":{id:"supertonic-fp32",name:"Supertonic\
 · local speech synthesis",description:"Pinned local managed WebGPU speech candidate.",license:"openrail",repository:"o\
nnx-community/Supertonic-TTS-ONNX",revision:"cff123c84b0655d9d647641f1b532c3cbb8f7faa",model:{runtime:"transformers-spee\
ch",runtimeVersion:"4.3.2",repository:"onnx-community/Supertonic-TTS-ONNX",revision:"cff123c84b0655d9d647641f1b532c3cbb8\
f7faa",architecture:"supertonic",task:"text-to-speech",dtype:"fp32",format:"ONNX",modalities:["text"],outputModalities:[
"audio"],sampleRate:44100,requiredFeatures:[],voice:"voices/F1.bin",steps:5},files:[{path:"README.md",size:5276,sha256:"\
161ac71ef6c190bc03a62e8d235d633f9b9ff1d619cd49290e3ca6bf09781c32"},{path:"config.json",size:247,sha256:"37cdafab327b4360\
e0d6911956bfb3ca3d7254b53749e06ca41ab422d7686259"},{path:"tokenizer.json",size:2038,sha256:"da6954f045585fc12c8ea9831b3c\
3eb1c5bffc8ef7ff6b6db7de781cd472ee01"},{path:"tokenizer_config.json",size:119,sha256:"87dad35dfef4b41ef8bb92723e2fc040b9\
1d3fdf770ee5f4716fa5d4896f7a68"},{path:"voices/F1.bin",size:51712,sha256:"5ef84e3421e4f80994a5a40a18ba39ba9fc48175c41ae6\
cf3e56418820872dbf"},{path:"onnx/latent_denoiser.onnx",size:398102,sha256:"9a639a8c05c9be111848562c5cf10ea2697a589c63418\
30aac479d0ce7b75aa9"},{path:"onnx/latent_denoiser.onnx_data",size:132098880,sha256:"cde4abf1136defce235bc446eaab4954a577\
21ae8d5a4754cdd337bf191b612f"},{path:"onnx/text_encoder.onnx",size:433169,sha256:"50a03d29d5dc95918eeff578f542b814f3cf5a\
741f927116f5a8462a76ff6898"},{path:"onnx/text_encoder.onnx_data",size:28426752,sha256:"6415854f135a318909dc716e90f83a391\
d9a91bd9da09bdb6d6763d6b0a6c102"},{path:"onnx/voice_decoder.onnx",size:59921,sha256:"83c104006dabcd6b568c0d5acb6fec18f65\
609d2391dd2c459e4440e85027669"},{path:"onnx/voice_decoder.onnx_data",size:101353472,sha256:"ea52402c9ba5131ee2b3901a86db\
2f0b435b322169cd75157e053493d967d17f"}],totalBytes:262829688}}),x=Object.freeze({sampleRate:16e3,maxInputSeconds:20,maxOutputSeconds:30,
maxTextBytes:1024,maxTextCharacters:256,maxTranscriptBytes:8192,residentBytes:1024**3}),W=(e,o)=>e&&o&&typeof e=="object"&&
typeof o=="object"?Object.keys(e).length===Object.keys(o).length&&Object.keys(e).every(i=>W(e[i],o[i])):e===o;function L(e){
const o=Q(e),i=Object.values(Y).find(a=>W(a.model,o.model));if(!i||o.files.length!==i.files.length)throw new Error("Spee\
ch package is outside the pinned catalog");for(const a of i.files){const d=o.files.find(t=>t.path===a.path);if(!d||d.size!==
a.size||d.sha256!==a.sha256)throw new Error("Speech file differs from its pinned digest")}return{manifest:o,trusted:i,totalBytes:i.
totalBytes,resourcePolicy:{minimumCpuBytes:x.residentBytes,minimumGpuBytes:x.residentBytes,maxModelBytes:512*1024**2}}}function Z(e,o,i=x.
maxInputSeconds){if(!(e instanceof Float32Array)||o!==x.sampleRate||e.length<1600||e.length>o*i)throw new Error("Speech \
input requires 0.1–20 seconds of mono Float32 PCM at 16000 Hz");for(const a of e)if(!Number.isFinite(a)||Math.abs(a)>1.01)
throw new Error("Invalid PCM sample");return{samples:e,sampleRate:o}}function ee(e,o){const{trusted:i}=L(o);if(e.image)throw new Error(
"Speech does not accept image inputs");if(i.model.task==="automatic-speech-recognition"){if(e.prompt!=null||e.messages!=
null)throw new Error("ASR accepts audio only");return{task:i.model.task,audio:Z(e.audio?.samples,e.audio?.sampleRate)}}if(e.
audio!=null||e.messages!=null||typeof e.prompt!="string")throw new Error("TTS accepts one text prompt");const a=e.prompt.
trim();if(!a||[...a].length>x.maxTextCharacters||new TextEncoder().encode(a).length>x.maxTextBytes)throw new Error("Spea\
k one short sentence at a time (maximum 256 characters)");return{task:i.model.task,prompt:a}}async function se({getDevice:e,
capture:o,operation:i,fail:a}){let d,t,p;const c=[],S=s=>{if(d!==s){if(d)throw new Error("Speech runtime changed GPU dev\
ice");d=s;for(const f of["validation","out-of-memory","internal"])d.pushErrorScope(f),c.push(f)}};try{if(e()&&S(e()),o?.(
S),t=await i(),!d)throw new Error("Speech runtime did not create a WebGPU device");await d.queue.onSubmittedWorkDone()}catch(s){
p=s}finally{o?.(null)}const u=await Promise.all(c.reverse().map(async s=>{try{return{filter:s,error:await d.popErrorScope()}}catch(f){
return{filter:s,error:f}}})),h=["out-of-memory","internal","validation"].map(s=>u.find(f=>f.filter===s&&f.error)).find(Boolean);
if(h){const s=new Error(h.filter==="out-of-memory"?"Model session lost: speech GPU out of memory. Unload other models or\
 close GPU-heavy apps, then retry.":`Model session lost: speech GPU ${h.filter}: ${h.error.message}`,{cause:h.error});throw a(
s),s}if(p)throw p;return t}async function te({manifest:e,sessionId:o,artifactPort:i,runtimeAssets:a,signal:d,onProgress:t,
baseUrl:p=globalThis.location?.href,gpu:c=globalThis.navigator?.gpu,loadLibrary:S=()=>import("./transformers.web-CsR9rRO0.js")}){
let u,h,s,f,I,q,M=d,F=!1,A=!1;const b={gpuDispatches:0,gpuSubmissions:0,generatedRequests:0},T=r=>{A=!0,b.gpuFailure??=String(
r?.message??r).slice(0,300)},E=()=>{if(C(M),A)throw new Error(`Model session lost: ${b.gpuFailure??"speech GPU lost"}`)},
U=r=>T(r.error),G=r=>se({getDevice:()=>u,capture:y=>{I=y},operation:r,fail:T});async function B(){f?.(),f=null,s?.close(),
s=null;try{await h?.dispose(),h=null}finally{u?.removeEventListener("uncapturederror",U),u?.destroy(),F=!0}}try{const r=await c?.
requestAdapter({powerPreference:"high-performance"});if(E(),!r||r.isFallbackAdapter||r.info?.isFallbackAdapter)throw new Error(
"Speech requires hardware WebGPU; CPU fallback is disabled");b.adapter={vendor:r.info?.vendor??"",architecture:r.info?.architecture??
"",isFallbackAdapter:!1};const y=await S();if(E(),y.env.version!=="4.3.2")throw new Error("Unexpected speech runtime ver\
sion");const _=new URL("/__peercompute_speech/",p);s=J(i,{manifest:e,baseUrl:new URL(`${o}/`,_).href,signal:d});const{env:l}=y;
l.logLevel=50,l.allowLocalModels=!0,l.allowRemoteModels=!1,l.useBrowserCache=!1,l.useFSCache=!1,l.useWasmCache=!1,l.localModelPath=
_.pathname,l.fetch=s.fetch,l.backends.onnx.wasm.proxy=!1,l.backends.onnx.wasm.numThreads=1,l.backends.onnx.wasm.wasmPaths=
a,l.backends.onnx.webgpu.adapter=r;const z=Object.getPrototypeOf(r),g=z.requestDevice;if(z.requestDevice=async function(...m){
if(this.isFallbackAdapter||this.info?.isFallbackAdapter)throw new Error("Speech cannot use a software GPU adapter");const n=await g.
apply(this,m);u=n,I?.(n),b.runtimeFeatures=[...n.features],n.addEventListener("uncapturederror",U),n.lost.then(()=>{F||T(
new Error("Speech GPU device lost"))});const k=n.createCommandEncoder.bind(n),P=n.queue.submit.bind(n.queue);return n.createCommandEncoder=
(...v)=>{const w=k(...v),O=w.beginComputePass.bind(w);return w.beginComputePass=(...X)=>{const j=O(...X);for(const R of[
"dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const $=j[R].bind(j);j[R]=(...H)=>{const V=$(...H);return b.gpuDispatches++,
V}}return j},w},n.queue.submit=(...v)=>{const w=P(...v);return b.gpuSubmissions++,w},n},f=()=>{z.requestDevice=g},await G(
async()=>{h=await y.pipeline(e.model.task,o,{local_files_only:!0,device:"webgpu",dtype:"fp32",session_options:{executionProviders:[
"webgpu"]},progress_callback:m=>t?.({type:"speech-load",status:m.status,file:m.file,loaded:m.loaded,total:m.total})})}),
f(),f=null,E(),await l.backends.onnx.webgpu.device!==u)throw new Error("Speech did not acquire its admitted WebGPU devic\
e");if(e.model.voice){const m=await s.fetch(new URL(`${o}/${e.model.voice}`,_).href);q=new Float32Array(await m.arrayBuffer()),
E()}for(const[m,n]of Object.entries(h.model.sessions)){const k=n.run.bind(n);n.run=async(...P)=>{E();const v=await k(...P);
try{if(E(),m==="text_encoder"&&v.durations){for(const w of v.durations.data)if(!Number.isFinite(w)||w<=0||w>x.maxOutputSeconds)
throw new Error("Predicted speech exceeds its duration budget")}return v}catch(w){for(const O of Object.values(v))O.dispose?.();
throw w}}}s.close(),s=null,M=void 0}catch(r){try{await B()}catch(y){throw new AggregateError([r,y],"Model session lost: \
speech load cleanup failed")}throw r}return{evidence:b,get lost(){return A},dispose:B,async generate(r,{signal:y,onProgress:_}={}){
if(F||A)throw new Error("Model session lost: speech is unavailable");M=y,E();const l=b.gpuDispatches,z=b.gpuSubmissions;
try{_?.({type:"speech-stage",stage:r.audio?"transcribing":"speaking"});const g=await G(()=>r.audio?h(r.audio.samples,{max_new_tokens:Math.
min(128,Math.max(8,Math.ceil(r.audio.samples.length/16e3)*6)),do_sample:!1}):h(r.prompt,{speaker_embeddings:q,num_inference_steps:5,
speed:1.05}));if(E(),b.gpuDispatches<=l)throw new Error("Model session lost: speech performed no WebGPU dispatches");let m;
if(r.audio){if(typeof g.text!="string"||new TextEncoder().encode(g.text).length>x.maxTranscriptBytes)throw new Error("In\
valid speech transcript");m={text:g.text.trim()}}else{const n=g.audio,k=g.sampling_rate;if(!(n instanceof Float32Array)||
k!==e.model.sampleRate||!n.length||n.length>k*x.maxOutputSeconds)throw new Error("Invalid synthesized audio duration");for(const P of n)
if(!Number.isFinite(P)||Math.abs(P)>10)throw new Error("Invalid synthesized PCM");m={audio:new Float32Array(n),sampleRate:k}}
return b.generatedRequests++,{...m,gpuDispatches:b.gpuDispatches-l,gpuSubmissions:b.gpuSubmissions-z}}catch(g){throw g instanceof
WebAssembly.RuntimeError?(T(g),new Error("Model session lost: speech native runtime failed",{cause:g})):g}finally{M=void 0}}}}
function oe({createEngine:e=te,assertWorker:o=()=>{if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))
throw new Error("Speech requires a ComputeManager-owned worker")},baseUrl:i=globalThis.location?.href}={}){const a=new Map,
d=t=>({sessionId:t.sessionId,manifestCid:t.manifestCid,workerId:t.workerId,status:t.engine?.lost?"lost":t.status,...t.engine?.
evidence});return async(t,p={})=>{if(o(),N(t?.sessionId),C(p.signal),t.command==="load"){if(a.size)throw new Error("A sp\
eech model is already resident");const{manifest:u}=L(t.manifest),h=K(t.runtimeAssets,i),s={sessionId:t.sessionId,manifestCid:t.
manifestCid,manifest:u,workerId:p.workerId,status:"loading"};a.set(s.sessionId,s);try{return s.engine=await e({manifest:u,
runtimeAssets:h,sessionId:s.sessionId,artifactPort:t.artifactPort,signal:p.signal,onProgress:p.emitProgress,baseUrl:i}),
C(p.signal),s.status="ready",d(s)}catch(f){try{await s.engine?.dispose(),a.delete(s.sessionId)}catch(I){throw s.status="\
lost",new AggregateError([f,I],"Model session lost: speech cleanup failed")}throw f}}const c=a.get(t.sessionId);if(!c)throw new Error(
"Speech model is not loaded");if(t.command==="status")return d(c);if(t.command==="unload")return await c.engine.dispose(),
a.delete(c.sessionId),{status:"unloaded",sessionId:c.sessionId};if(t.command!=="generate")throw new Error("Unknown speec\
h command");if(N(t.requestId),c.status!=="ready"||c.engine.lost)throw new Error("Model session lost: speech is not ready");
const S=ee(t,c.manifest);c.status="generating";try{const u=await c.engine.generate(S,{signal:p.signal,onProgress:p.emitProgress});
return C(p.signal),{...u,sessionId:c.sessionId,requestId:t.requestId,workerId:c.workerId}}catch(u){throw/Model session lost/.
test(u.message)&&(c.status="lost"),u}finally{c.status!=="lost"&&(c.status=c.engine.lost?"lost":"ready")}}}const ne=oe();export{oe as createSpeechTaskHandler,ne as handleModelTask};
