import{M as B,h as K,f as N,t as P,d as L,A as D}from"./peercomputeDevice-C-9k1RRB.js";const j=16*1024**2;function u(n,E,f,h){
if(!Number.isSafeInteger(n)||n<f||n>h)throw new RangeError(`Invalid ${E}`);return n}function C(n){if(n!=null&&(typeof n.
aborted!="boolean"||typeof n.addEventListener!="function"||typeof n.removeEventListener!="function"))throw new TypeError(
"An AbortSignal is required")}function V(n,{manifest:E,signal:f,maxReadBytes:h=j,maxReads:y=2,maxQueuedReads:v=16,readTimeoutMs:M=3e4}={}){
var k;if(!(n!=null&&n.postMessage)||!(n!=null&&n.addEventListener))throw new TypeError("A MessagePort is required");u(h,
"maxReadBytes",1,j),u(y,"maxReads",1,B.maxReads),u(v,"maxQueuedReads",0,32),u(M,"readTimeoutMs",1,3e5),C(f);const X=K(E),
$=new Map(X.files.map(e=>{if(!/^[a-f0-9]{64}$/.test(e.sha256??""))throw new TypeError("GGUF artifact files require SHA-2\
56 digests");return[N(e.path),Object.freeze({...e})]}));P(f);const a=new Map,o=[];let T=0,c=!1,A,b=0,g=0,z=0,_=0,I=0;function m(e){
n.postMessage({protocol:D,...e})}function Y(e){if(e.active)try{m({type:"cancel",id:e.id})}catch{}}function R(e,t,r){var l,
w;if(e.finished)return;e.finished=!0,a.delete(e.id);const i=o.indexOf(e);i!==-1&&o.splice(i,1),clearTimeout(e.timer),(l=
e.signal)==null||l.removeEventListener("abort",e.abort),b-=((w=e.buffer)==null?void 0:w.byteLength)||0,e.buffer=null,t?(I++,
e.reject(t)):(_++,e.resolve(r)),G()}function s(e,t){Y(e),R(e,t)}function G(){for(;!c&&a.size<y&&o.length;){const e=o.shift();
e.active=!0,a.set(e.id,e);try{m({type:"open",id:e.id,path:e.path,offset:e.offset,length:e.length})}catch(t){s(e,t)}}}function O(e){
e.awaiting=!0;try{m({type:"pull",id:e.id})}catch(t){s(e,t)}}function U(e){const t=e.data;if(c||(t==null?void 0:t.protocol)!==
D)return;if(t.type==="closed"){p(new Error(t.message||"Artifact host closed"));return}const r=a.get(t.id);if(r)try{if(t.
type==="error")throw new Error(t.message||"Artifact read failed");if(t.type==="ready"){if(r.ready||t.size!==r.length)throw new Error(
"Invalid artifact range response size");r.ready=!0,r.buffer=new Uint8Array(r.length),b+=r.length,g=Math.max(g,b),O(r)}else if(t.
type==="chunk"){if(!r.ready||!r.awaiting||!(t.bytes instanceof Uint8Array)||!t.bytes.byteLength||t.bytes.byteLength>B.chunkBytes||
t.bytes.byteLength>r.length-r.received)throw new Error("Invalid artifact range chunk");r.awaiting=!1,r.buffer.set(t.bytes,
r.received),r.received+=t.bytes.byteLength,z+=t.bytes.byteLength,O(r)}else if(t.type==="end"){if(!r.ready||!r.awaiting||
r.received!==r.length)throw new Error("Truncated artifact range");R(r,null,r.buffer)}else throw new Error("Unexpected ar\
tifact range message")}catch(i){s(r,i)}}function x(e){if(c)throw A;const t=$.get(N(e));if(!t)throw new Error("Artifact p\
ath is not in the manifest");return t}async function H(e,t,r,{signal:i}={}){const l=x(e);if(C(i),P(i),u(t,"artifact offs\
et",0,Number.MAX_SAFE_INTEGER),u(r,"artifact read length",0,h),t>l.size||r>l.size-t)throw new RangeError("Artifact range\
 exceeds file size");if(a.size>=y&&o.length>=v)throw new Error("Artifact range queue is full");if(T===Number.MAX_SAFE_INTEGER)
throw new RangeError("Artifact request identifiers exhausted");return new Promise((w,J)=>{const d={id:`gguf-${++T}`,path:e,
offset:t,length:r,signal:i,resolve:w,reject:J,active:!1,ready:!1,received:0,buffer:null};d.abort=()=>s(d,L(i.reason)),d.
timer=setTimeout(()=>s(d,new DOMException("Artifact range read timed out","TimeoutError")),M),i==null||i.addEventListener(
"abort",d.abort,{once:!0}),o.push(d),G()})}function p(e="GGUF artifact reader closed"){if(!c){c=!0,A=e instanceof Error?
e:L(e),f==null||f.removeEventListener("abort",F),n.removeEventListener("message",U);for(const t of[...a.values(),...o])s(
t,A);n.close()}}const F=()=>p(L(f.reason));return f==null||f.addEventListener("abort",F,{once:!0}),n.addEventListener("m\
essage",U),(k=n.start)==null||k.call(n),{read:H,stat:x,close:p,getStats:()=>Object.freeze({closed:c,activeReads:a.size,queuedReads:o.
length,bufferedBytes:b,peakBufferedBytes:g,deliveredBytes:z,completedReads:_,failedReads:I,maxReadBytes:h,maxReads:y,maxQueuedReads:v})}}export{V as c};
