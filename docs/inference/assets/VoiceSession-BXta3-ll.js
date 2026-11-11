import{M as v}from"./main-BVBDmgKD.js";import"./index-L3PMMKML.js";function S(r,l=256){if(!Number.isSafeInteger(l)||l<1||
l>256)throw new RangeError("Invalid speech chunk limit");const f=[];for(const c of String(r).match(/[^.!?]+[.!?]*\s*|[.!?]+/gu)??
[]){const p=Array.from(c.trim());for(;p.length;){let a=Math.min(l,p.length);if(a<p.length){const h=p.slice(0,a).lastIndexOf(
" ");h>l/2&&(a=h)}const u=p.splice(0,a).join("").trim();u&&f.push(u)}}return f}function k(r="mixed"){if(r==="local"||r===
"local-only"||r.startsWith("local:"))return"local-only";if(r==="mixed"||r.startsWith("peer:"))return"mixed";if(r==="peer\
s-only")return r;throw new Error("Unknown voice provider policy")}function V({audio:r,execute:l}={}){if(!r?.startRecording||
!r?.stopRecording||!r?.cancelRecording||!r?.play||!r?.stopPlayback||typeof l!="function")throw new TypeError("Voice sess\
ions require owned audio and a task executor");const f=new AbortController;let c,p=!1,a,u="idle";const h=()=>({status:u,
active:!!c,recording:u==="recording"});function d(t,n){u=t;try{n?.(h())}catch{}}function m(t,n,o){if(p)return Promise.reject(
new Error("Voice session is disposed"));if(c)return Promise.reject(new Error("A voice operation is already active"));const e=new AbortController,
i=AbortSignal.any([f.signal,e.signal,...t.signal?[t.signal]:[]]);i.throwIfAborted();const s={controller:e,signal:i,kind:o,
stopRequested:!1,stop:null,promise:null};return c=s,s.promise=Promise.resolve().then(()=>n(s)).finally(()=>{c===s&&(c=null),
d(p?"closed":"idle",t.onState)}),s.promise}function A(){return!c||c.kind!=="record"||!["idle","requesting-microphone","r\
ecording"].includes(u)?!1:(c.stopRequested=!0,c.stop?.(),!0)}async function y(t={},n=o=>o){return m(t,async o=>{const{signal:e}=o;
let i;const s=new Promise((g,P)=>{o.stop=g;const w=()=>P(e.reason);e.addEventListener("abort",w,{once:!0}),i=()=>e.removeEventListener(
"abort",w),e.aborted&&w()});s.catch(()=>{});try{d("requesting-microphone",t.onState),await r.startRecording({signal:e,onLimit:()=>o.
stop?.()}),e.throwIfAborted(),d("recording",t.onState),o.stopRequested&&o.stop(),await s,e.throwIfAborted();const g=await r.
stopRecording();return e.throwIfAborted(),await n(g,e)}finally{i?.(),await r.cancelRecording()}},"record")}async function E(t={}){
const n=k(t.target),o=t.transcriptionTask??"automatic-speech-recognition";if(!["automatic-speech-recognition","audio-tex\
t-to-text"].includes(o))throw new Error("Unsupported transcription task");return y(t,async(e,i)=>{d("transcribing",t.onState);
const s=await l(n,{task:o,audio:e,...o==="audio-text-to-text"?{prompt:"Transcribe the speech in this recording exactly. \
Return only the transcription."}:{},requestId:crypto.randomUUID(),signal:i,onProgress:t.onProgress});if(i.throwIfAborted(),
typeof s?.text!="string"||!s.text.trim())throw new Error("No speech recognized. Try again or type a message.");return s})}
async function x(t,n={}){const o=k(n.target);if(typeof t!="string"||new TextEncoder().encode(t).length>v.maxOutputBytes)
throw new Error("Spoken response exceeds the output text budget");return m(n,async({signal:e})=>{let i=0;try{for(const s of S(
t)){e.throwIfAborted(),d("synthesizing",n.onState);const g=await l(o,{task:"text-to-speech",prompt:s,requestId:crypto.randomUUID(),
signal:e,onProgress:n.onProgress});e.throwIfAborted(),d("playing",n.onState),await r.play(g,{signal:e}),e.throwIfAborted(),
i++}return{completedChunks:i}}finally{await r.stopPlayback()}},"speak")}async function b(){const t=c;t?.controller.abort(
new DOMException("Voice cancelled","AbortError"));const o=(await Promise.allSettled([Promise.resolve().then(()=>r.cancelRecording()),
Promise.resolve().then(()=>r.stopPlayback()),t?.promise?.catch(()=>{})])).filter(e=>e.status==="rejected").map(e=>e.reason);
if(o.length)throw new AggregateError(o,"Voice cleanup is incomplete")}function I(){return a||(p=!0,f.abort(new DOMException(
"Voice session disposed","AbortError")),a=(async()=>{const n=await Promise.allSettled([b()]);try{await r.dispose?.()}catch(e){
n.push({status:"rejected",reason:e})}const o=n.filter(e=>e.status==="rejected").map(e=>e.reason);if(u="closed",o.length)
throw new AggregateError(o,"Voice disposal is incomplete")})().catch(n=>{throw a=null,n}),a)}return{record:E,capture:t=>y(
t),stop:A,speak:x,cancel:b,dispose:I,getState:h}}export{V as createVoiceSession,k as voiceTarget};
