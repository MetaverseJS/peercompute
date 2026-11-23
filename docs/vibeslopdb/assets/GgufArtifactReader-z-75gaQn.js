import{a_ as F,b4 as Y,b5 as k,aZ as B,b0 as A,b6 as N}from"./carnageWindow-BBcEUL8m.js";const P=16*1024**2;function u(n,y,o,l){
if(!Number.isSafeInteger(n)||n<o||n>l)throw new RangeError(`Invalid ${y}`);return n}function D(n){if(n!=null&&(typeof n.
aborted!="boolean"||typeof n.addEventListener!="function"||typeof n.removeEventListener!="function"))throw new TypeError(
"An AbortSignal is required")}function Z(n,{manifest:y,signal:o,maxReadBytes:l=P,maxReads:h=2,maxQueuedReads:g=16,readTimeoutMs:m=3e4}={}){
if(!n?.postMessage||!n?.addEventListener)throw new TypeError("A MessagePort is required");u(l,"maxReadBytes",1,P),u(h,"m\
axReads",1,F.maxReads),u(g,"maxQueuedReads",0,32),u(m,"readTimeoutMs",1,3e5),D(o);const S=Y(y),j=new Map(S.files.map(e=>{
if(!/^[a-f0-9]{64}$/.test(e.sha256??""))throw new TypeError("GGUF artifact files require SHA-256 digests");return[k(e.path),
Object.freeze({...e})]}));B(o);const f=new Map,a=[];let L=0,s=!1,w,b=0,E=0,M=0,T=0,_=0;function p(e){n.postMessage({protocol:N,
...e})}function q(e){if(e.active)try{p({type:"cancel",id:e.id})}catch{}}function z(e,t,r){if(e.finished)return;e.finished=
!0,f.delete(e.id);const i=a.indexOf(e);i!==-1&&a.splice(i,1),clearTimeout(e.timer),e.signal?.removeEventListener("abort",
e.abort),b-=e.buffer?.byteLength||0,e.buffer=null,t?(_++,e.reject(t)):(T++,e.resolve(r)),I()}function c(e,t){q(e),z(e,t)}
function I(){for(;!s&&f.size<h&&a.length;){const e=a.shift();e.active=!0,f.set(e.id,e);try{p({type:"open",id:e.id,path:e.
path,offset:e.offset,length:e.length})}catch(t){c(e,t)}}}function R(e){e.awaiting=!0;try{p({type:"pull",id:e.id})}catch(t){
c(e,t)}}function G(e){const t=e.data;if(s||t?.protocol!==N)return;if(t.type==="closed"){v(new Error(t.message||"Artifact\
 host closed"));return}const r=f.get(t.id);if(r)try{if(t.type==="error")throw new Error(t.message||"Artifact read failed");
if(t.type==="ready"){if(r.ready||t.size!==r.length)throw new Error("Invalid artifact range response size");r.ready=!0,r.
buffer=new Uint8Array(r.length),b+=r.length,E=Math.max(E,b),R(r)}else if(t.type==="chunk"){if(!r.ready||!r.awaiting||!(t.
bytes instanceof Uint8Array)||!t.bytes.byteLength||t.bytes.byteLength>F.chunkBytes||t.bytes.byteLength>r.length-r.received)
throw new Error("Invalid artifact range chunk");r.awaiting=!1,r.buffer.set(t.bytes,r.received),r.received+=t.bytes.byteLength,
M+=t.bytes.byteLength,R(r)}else if(t.type==="end"){if(!r.ready||!r.awaiting||r.received!==r.length)throw new Error("Trun\
cated artifact range");z(r,null,r.buffer)}else throw new Error("Unexpected artifact range message")}catch(i){c(r,i)}}function O(e){
if(s)throw w;const t=j.get(k(e));if(!t)throw new Error("Artifact path is not in the manifest");return t}async function C(e,t,r,{
signal:i}={}){const x=O(e);if(D(i),B(i),u(t,"artifact offset",0,Number.MAX_SAFE_INTEGER),u(r,"artifact read length",0,l),
t>x.size||r>x.size-t)throw new RangeError("Artifact range exceeds file size");if(f.size>=h&&a.length>=g)throw new Error(
"Artifact range queue is full");if(L===Number.MAX_SAFE_INTEGER)throw new RangeError("Artifact request identifiers exhaus\
ted");return new Promise((X,$)=>{const d={id:`gguf-${++L}`,path:e,offset:t,length:r,signal:i,resolve:X,reject:$,active:!1,
ready:!1,received:0,buffer:null};d.abort=()=>c(d,A(i.reason)),d.timer=setTimeout(()=>c(d,new DOMException("Artifact rang\
e read timed out","TimeoutError")),m),i?.addEventListener("abort",d.abort,{once:!0}),a.push(d),I()})}function v(e="GGUF \
artifact reader closed"){if(!s){s=!0,w=e instanceof Error?e:A(e),o?.removeEventListener("abort",U),n.removeEventListener(
"message",G);for(const t of[...f.values(),...a])c(t,w);n.close()}}const U=()=>v(A(o.reason));return o?.addEventListener(
"abort",U,{once:!0}),n.addEventListener("message",G),n.start?.(),{read:C,stat:O,close:v,getStats:()=>Object.freeze({closed:s,
activeReads:f.size,queuedReads:a.length,bufferedBytes:b,peakBufferedBytes:E,deliveredBytes:M,completedReads:T,failedReads:_,
maxReadBytes:l,maxReads:h,maxQueuedReads:g})}}export{Z as c};
