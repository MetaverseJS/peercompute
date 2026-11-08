import{f as se,t as U,a as H,d as te}from"./ArtifactReadBridge-BAWOcyZj.js";import{n as oe}from"./ArtifactManifest-BZyREYLI.js";
const V=e=>(e&&typeof e=="object"&&(Object.values(e).forEach(V),Object.freeze(e)),e),ae=V({"moonshine-tiny-fp32":{id:"mo\
onshine-tiny-fp32",name:"Moonshine Tiny · local speech recognition",description:"Pinned local managed WebGPU speech can\
didate.",license:"mit",repository:"onnx-community/moonshine-tiny-ONNX",revision:"a6da1241cd305dcd64eab1edbd615f2bb9aabb9\
5",model:{runtime:"transformers-speech",runtimeVersion:"4.3.2",repository:"onnx-community/moonshine-tiny-ONNX",revision:"\
a6da1241cd305dcd64eab1edbd615f2bb9aabb95",architecture:"moonshine",task:"automatic-speech-recognition",dtype:"fp32",format:"\
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
2f0b435b322169cd75157e053493d967d17f"}],totalBytes:262829688}}),k=Object.freeze({sampleRate:16e3,maxInputSeconds:20,maxOutputSeconds:30,
maxTextBytes:1024,maxTextCharacters:256,maxTranscriptBytes:8192,residentBytes:1024**3}),J=(e,t)=>e&&t&&typeof e=="object"&&
typeof t=="object"?Object.keys(e).length===Object.keys(t).length&&Object.keys(e).every(c=>J(e[c],t[c])):e===t;function K(e){
const t=oe(e),c=Object.values(ae).find(d=>J(d.model,t.model));if(!c||t.files.length!==c.files.length)throw new Error("Sp\
eech package is outside the pinned catalog");for(const d of c.files){const r=t.files.find(m=>m.path===d.path);if(!r||r.size!==
d.size||r.sha256!==d.sha256)throw new Error("Speech file differs from its pinned digest")}return{manifest:t,trusted:c,totalBytes:c.
totalBytes,resourcePolicy:{minimumCpuBytes:k.residentBytes,minimumGpuBytes:k.residentBytes,maxModelBytes:512*1024**2}}}function ne(e,t,c=k.
maxInputSeconds){if(!(e instanceof Float32Array)||t!==k.sampleRate||e.length<1600||e.length>t*c)throw new Error("Speech \
input requires 0.1–20 seconds of mono Float32 PCM at 16000 Hz");for(const d of e)if(!Number.isFinite(d)||Math.abs(d)>1.01)
throw new Error("Invalid PCM sample");return{samples:e,sampleRate:t}}function re(e,t){var r,m;const{trusted:c}=K(t);if(e.
image)throw new Error("Speech does not accept image inputs");if(c.model.task==="automatic-speech-recognition"){if(e.prompt!=
null||e.messages!=null)throw new Error("ASR accepts audio only");return{task:c.model.task,audio:ne((r=e.audio)==null?void 0:
r.samples,(m=e.audio)==null?void 0:m.sampleRate)}}if(e.audio!=null||e.messages!=null||typeof e.prompt!="string")throw new Error(
"TTS accepts one text prompt");const d=e.prompt.trim();if(!d||[...d].length>k.maxTextCharacters||new TextEncoder().encode(
d).length>k.maxTextBytes)throw new Error("Speak one short sentence at a time (maximum 256 characters)");return{task:c.model.
task,prompt:d}}async function ie({getDevice:e,capture:t,operation:c,fail:d}){let r,m,o;const l=[],n=s=>{if(r!==s){if(r)throw new Error(
"Speech runtime changed GPU device");r=s;for(const u of["validation","out-of-memory","internal"])r.pushErrorScope(u),l.push(
u)}};try{if(e()&&n(e()),t==null||t(n),m=await c(),!r)throw new Error("Speech runtime did not create a WebGPU device");await r.
queue.onSubmittedWorkDone()}catch(s){o=s}finally{t==null||t(null)}const A=await Promise.all(l.reverse().map(async s=>{try{
return{filter:s,error:await r.popErrorScope()}}catch(u){return{filter:s,error:u}}})),y=["out-of-memory","internal","vali\
dation"].map(s=>A.find(u=>u.filter===s&&u.error)).find(Boolean);if(y){const s=new Error(y.filter==="out-of-memory"?"Mode\
l session lost: speech GPU out of memory. Unload other models or close GPU-heavy apps, then retry.":`Model session lost:\
 speech GPU ${y.filter}: ${y.error.message}`,{cause:y.error});throw d(s),s}if(o)throw o;return m}async function ce({manifest:e,
sessionId:t,artifactPort:c,runtimeAssets:d,signal:r,onProgress:m,baseUrl:o=(A=>(A=globalThis.location)==null?void 0:A.href)(),
gpu:l=(y=>(y=globalThis.navigator)==null?void 0:y.gpu)(),loadLibrary:n=()=>import("./transformers.web-C7Eqzws9.js")}){var W,
L,X;let s,u,f,x,z,B,C=r,G=!1,F=!1;const p={gpuDispatches:0,gpuSubmissions:0,generatedRequests:0},O=a=>{F=!0,p.gpuFailure??
(p.gpuFailure=String((a==null?void 0:a.message)??a).slice(0,300))},S=()=>{if(U(C),F)throw new Error(`Model session lost:\
 ${p.gpuFailure??"speech GPU lost"}`)},R=a=>O(a.error),N=a=>ie({getDevice:()=>s,capture:E=>{z=E},operation:a,fail:O});async function D(){
x==null||x(),x=null,f==null||f.close(),f=null;try{await(u==null?void 0:u.dispose()),u=null}finally{s==null||s.removeEventListener(
"uncapturederror",R),s==null||s.destroy(),G=!0}}try{const a=await(l==null?void 0:l.requestAdapter({powerPreference:"high\
-performance"}));if(S(),!a||a.isFallbackAdapter||(W=a.info)!=null&&W.isFallbackAdapter)throw new Error("Speech requires \
hardware WebGPU; CPU fallback is disabled");p.adapter={vendor:((L=a.info)==null?void 0:L.vendor)??"",architecture:((X=a.
info)==null?void 0:X.architecture)??"",isFallbackAdapter:!1};const E=await n();if(S(),E.env.version!=="4.3.2")throw new Error(
"Unexpected speech runtime version");const v=new URL("/__peercompute_speech/",o);f=se(c,{manifest:e,baseUrl:new URL(`${t}\
/`,v).href,signal:r});const{env:h}=E;h.logLevel=50,h.allowLocalModels=!0,h.allowRemoteModels=!1,h.useBrowserCache=!1,h.useFSCache=
!1,h.useWasmCache=!1,h.localModelPath=v.pathname,h.fetch=f.fetch,h.backends.onnx.wasm.proxy=!1,h.backends.onnx.wasm.numThreads=
1,h.backends.onnx.wasm.wasmPaths=d,h.backends.onnx.webgpu.adapter=a;const T=Object.getPrototypeOf(a),w=T.requestDevice;if(T.
requestDevice=async function(...b){var _;if(this.isFallbackAdapter||(_=this.info)!=null&&_.isFallbackAdapter)throw new Error(
"Speech cannot use a software GPU adapter");const i=await w.apply(this,b);s=i,z==null||z(i),p.runtimeFeatures=[...i.features],
i.addEventListener("uncapturederror",R),i.lost.then(()=>{G||O(new Error("Speech GPU device lost"))});const P=i.createCommandEncoder.
bind(i),I=i.queue.submit.bind(i.queue);return i.createCommandEncoder=(...M)=>{const g=P(...M),j=g.beginComputePass.bind(
g);return g.beginComputePass=(...Q)=>{const q=j(...Q);for(const $ of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){
const Y=q[$].bind(q);q[$]=(...Z)=>{const ee=Y(...Z);return p.gpuDispatches++,ee}}return q},g},i.queue.submit=(...M)=>{const g=I(
...M);return p.gpuSubmissions++,g},i},x=()=>{T.requestDevice=w},await N(async()=>{u=await E.pipeline(e.model.task,t,{local_files_only:!0,
device:"webgpu",dtype:"fp32",session_options:{executionProviders:["webgpu"]},progress_callback:b=>m==null?void 0:m({type:"\
speech-load",status:b.status,file:b.file,loaded:b.loaded,total:b.total})})}),x(),x=null,S(),await h.backends.onnx.webgpu.
device!==s)throw new Error("Speech did not acquire its admitted WebGPU device");if(e.model.voice){const b=await f.fetch(
new URL(`${t}/${e.model.voice}`,v).href);B=new Float32Array(await b.arrayBuffer()),S()}for(const[b,i]of Object.entries(u.
model.sessions)){const P=i.run.bind(i);i.run=async(...I)=>{var M;S();const _=await P(...I);try{if(S(),b==="text_encoder"&&
_.durations){for(const g of _.durations.data)if(!Number.isFinite(g)||g<=0||g>k.maxOutputSeconds)throw new Error("Predict\
ed speech exceeds its duration budget")}return _}catch(g){for(const j of Object.values(_))(M=j.dispose)==null||M.call(j);
throw g}}}f.close(),f=null,C=void 0}catch(a){try{await D()}catch(E){throw new AggregateError([a,E],"Model session lost: \
speech load cleanup failed")}throw a}return{evidence:p,get lost(){return F},dispose:D,async generate(a,{signal:E,onProgress:v}={}){
if(G||F)throw new Error("Model session lost: speech is unavailable");C=E,S();const h=p.gpuDispatches,T=p.gpuSubmissions;
try{v==null||v({type:"speech-stage",stage:a.audio?"transcribing":"speaking"});const w=await N(()=>a.audio?u(a.audio.samples,
{max_new_tokens:Math.min(128,Math.max(8,Math.ceil(a.audio.samples.length/16e3)*6)),do_sample:!1}):u(a.prompt,{speaker_embeddings:B,
num_inference_steps:5,speed:1.05}));if(S(),p.gpuDispatches<=h)throw new Error("Model session lost: speech performed no W\
ebGPU dispatches");let b;if(a.audio){if(typeof w.text!="string"||new TextEncoder().encode(w.text).length>k.maxTranscriptBytes)
throw new Error("Invalid speech transcript");b={text:w.text.trim()}}else{const i=w.audio,P=w.sampling_rate;if(!(i instanceof
Float32Array)||P!==e.model.sampleRate||!i.length||i.length>P*k.maxOutputSeconds)throw new Error("Invalid synthesized aud\
io duration");for(const I of i)if(!Number.isFinite(I)||Math.abs(I)>10)throw new Error("Invalid synthesized PCM");b={audio:new Float32Array(
i),sampleRate:P}}return p.generatedRequests++,{...b,gpuDispatches:p.gpuDispatches-h,gpuSubmissions:p.gpuSubmissions-T}}catch(w){
throw w instanceof WebAssembly.RuntimeError?(O(w),new Error("Model session lost: speech native runtime failed",{cause:w})):
w}finally{C=void 0}}}}function de({createEngine:e=ce,assertWorker:t=()=>{if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof
WorkerGlobalScope))throw new Error("Speech requires a ComputeManager-owned worker")},baseUrl:c=(d=>(d=globalThis.location)==
null?void 0:d.href)()}={}){const r=new Map,m=o=>{var l,n;return{sessionId:o.sessionId,manifestCid:o.manifestCid,workerId:o.
workerId,status:(l=o.engine)!=null&&l.lost?"lost":o.status,...(n=o.engine)==null?void 0:n.evidence}};return async(o,l={})=>{
var y;if(t(),H(o==null?void 0:o.sessionId),U(l.signal),o.command==="load"){if(r.size)throw new Error("A speech model is \
already resident");const{manifest:s}=K(o.manifest),u=te(o.runtimeAssets,c),f={sessionId:o.sessionId,manifestCid:o.manifestCid,
manifest:s,workerId:l.workerId,status:"loading"};r.set(f.sessionId,f);try{return f.engine=await e({manifest:s,runtimeAssets:u,
sessionId:f.sessionId,artifactPort:o.artifactPort,signal:l.signal,onProgress:l.emitProgress,baseUrl:c}),U(l.signal),f.status=
"ready",m(f)}catch(x){try{await((y=f.engine)==null?void 0:y.dispose()),r.delete(f.sessionId)}catch(z){throw f.status="lo\
st",new AggregateError([x,z],"Model session lost: speech cleanup failed")}throw x}}const n=r.get(o.sessionId);if(!n)throw new Error(
"Speech model is not loaded");if(o.command==="status")return m(n);if(o.command==="unload")return await n.engine.dispose(),
r.delete(n.sessionId),{status:"unloaded",sessionId:n.sessionId};if(o.command!=="generate")throw new Error("Unknown speec\
h command");if(H(o.requestId),n.status!=="ready"||n.engine.lost)throw new Error("Model session lost: speech is not ready");
const A=re(o,n.manifest);n.status="generating";try{const s=await n.engine.generate(A,{signal:l.signal,onProgress:l.emitProgress});
return U(l.signal),{...s,sessionId:n.sessionId,requestId:o.requestId,workerId:n.workerId}}catch(s){throw/Model session lost/.
test(s.message)&&(n.status="lost"),s}finally{n.status!=="lost"&&(n.status=n.engine.lost?"lost":"ready")}}}const ue=de();export{de as createSpeechTaskHandler,ue as handleModelTask};
