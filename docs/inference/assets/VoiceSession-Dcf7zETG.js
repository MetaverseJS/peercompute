import{M as v}from"./main-ywa74S0T.js";import"./index-DGU-D0cB.js";function S(r,a=256){if(!Number.isSafeInteger(a)||a<1||
a>256)throw new RangeError("Invalid speech chunk limit");const f=[];for(const s of String(r).match(/[^.!?]+[.!?]*\s*|[.!?]+/gu)??
[]){const l=Array.from(s.trim());for(;l.length;){let c=Math.min(a,l.length);if(c<l.length){const h=l.slice(0,c).lastIndexOf(
" ");h>a/2&&(c=h)}const p=l.splice(0,c).join("").trim();p&&f.push(p)}}return f}function A(r="mixed"){if(r==="local"||r===
"local-only"||r.startsWith("local:"))return"local-only";if(r==="mixed"||r.startsWith("peer:"))return"mixed";if(r==="peer\
s-only")return r;throw new Error("Unknown voice provider policy")}function q({audio:r,execute:a}={}){if(!r?.startRecording||
!r?.stopRecording||!r?.cancelRecording||!r?.play||!r?.stopPlayback||typeof a!="function")throw new TypeError("Voice sess\
ions require owned audio and a task executor");const f=new AbortController;let s,l=!1,c,p="idle";const h=()=>({status:p,
active:!!s,recording:p==="recording"});function u(t,o){p=t;try{o?.(h())}catch{}}function y(t,o,n){if(l)return Promise.reject(
new Error("Voice session is disposed"));if(s)return Promise.reject(new Error("A voice operation is already active"));const e=new AbortController,
d=AbortSignal.any([f.signal,e.signal,...t.signal?[t.signal]:[]]);d.throwIfAborted();const i={controller:e,signal:d,kind:n,
stopRequested:!1,stop:null,promise:null};return s=i,i.promise=Promise.resolve().then(()=>o(i)).finally(()=>{s===i&&(s=null),
u(l?"closed":"idle",t.onState)}),i.promise}function E(){return!s||s.kind!=="record"||!["idle","requesting-microphone","r\
ecording"].includes(p)?!1:(s.stopRequested=!0,s.stop?.(),!0)}async function k(t={}){const o=A(t.target);return y(t,async n=>{
const{signal:e}=n;let d;const i=new Promise((g,w)=>{n.stop=g;const m=()=>w(e.reason);e.addEventListener("abort",m,{once:!0}),
d=()=>e.removeEventListener("abort",m),e.aborted&&m()});i.catch(()=>{});try{u("requesting-microphone",t.onState),await r.
startRecording({signal:e,onLimit:()=>n.stop?.()}),e.throwIfAborted(),u("recording",t.onState),n.stopRequested&&n.stop(),
await i,e.throwIfAborted();const g=await r.stopRecording();e.throwIfAborted(),u("transcribing",t.onState);const w=await a(
o,{task:"automatic-speech-recognition",audio:g,requestId:crypto.randomUUID(),signal:e,onProgress:t.onProgress});if(e.throwIfAborted(),
typeof w?.text!="string"||!w.text.trim())throw new Error("No speech recognized. Try again or type a message.");return w}finally{
d?.(),await r.cancelRecording()}},"record")}async function I(t,o={}){const n=A(o.target);if(typeof t!="string"||new TextEncoder().
encode(t).length>v.maxOutputBytes)throw new Error("Spoken response exceeds the output text budget");return y(o,async({signal:e})=>{
let d=0;try{for(const i of S(t)){e.throwIfAborted(),u("synthesizing",o.onState);const g=await a(n,{task:"text-to-speech",
prompt:i,requestId:crypto.randomUUID(),signal:e,onProgress:o.onProgress});e.throwIfAborted(),u("playing",o.onState),await r.
play(g,{signal:e}),e.throwIfAborted(),d++}return{completedChunks:d}}finally{await r.stopPlayback()}},"speak")}async function b(){
const t=s;t?.controller.abort(new DOMException("Voice cancelled","AbortError"));const n=(await Promise.allSettled([Promise.
resolve().then(()=>r.cancelRecording()),Promise.resolve().then(()=>r.stopPlayback()),t?.promise?.catch(()=>{})])).filter(
e=>e.status==="rejected").map(e=>e.reason);if(n.length)throw new AggregateError(n,"Voice cleanup is incomplete")}function P(){
return c||(l=!0,f.abort(new DOMException("Voice session disposed","AbortError")),c=(async()=>{const o=await Promise.allSettled(
[b()]);try{await r.dispose?.()}catch(e){o.push({status:"rejected",reason:e})}const n=o.filter(e=>e.status==="rejected").
map(e=>e.reason);if(p="closed",n.length)throw new AggregateError(n,"Voice disposal is incomplete")})().catch(o=>{throw c=
null,o}),c)}return{record:k,stop:E,speak:I,cancel:b,dispose:P,getState:h}}export{q as createVoiceSession,A as voiceTarget};
