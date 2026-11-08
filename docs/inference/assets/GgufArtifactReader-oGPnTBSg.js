import{M as F,aO as Y,aP as P,aw as k,az as A,aQ as B}from"./main-Ba299aVs.js";const N=16*1024**2;function u(n,g,o,l){if(!Number.
isSafeInteger(n)||n<o||n>l)throw new RangeError(`Invalid ${g}`);return n}function D(n){if(n!=null&&(typeof n.aborted!="b\
oolean"||typeof n.addEventListener!="function"||typeof n.removeEventListener!="function"))throw new TypeError("An AbortS\
ignal is required")}function J(n,{manifest:g,signal:o,maxReadBytes:l=N,maxReads:h=2,maxQueuedReads:w=16,readTimeoutMs:m=3e4}={}){
if(!n?.postMessage||!n?.addEventListener)throw new TypeError("A MessagePort is required");u(l,"maxReadBytes",1,N),u(h,"m\
axReads",1,F.maxReads),u(w,"maxQueuedReads",0,32),u(m,"readTimeoutMs",1,3e5),D(o);const S=Y(g),j=new Map(S.files.map(e=>{
if(!/^[a-f0-9]{64}$/.test(e.sha256??""))throw new TypeError("GGUF artifact files require SHA-256 digests");return[P(e.path),
Object.freeze({...e})]}));k(o);const f=new Map,a=[];let L=0,s=!1,b,y=0,E=0,M=0,z=0,T=0;function p(e){n.postMessage({protocol:B,
...e})}function q(e){if(e.active)try{p({type:"cancel",id:e.id})}catch{}}function _(e,t,r){if(e.finished)return;e.finished=
!0,f.delete(e.id);const i=a.indexOf(e);i!==-1&&a.splice(i,1),clearTimeout(e.timer),e.signal?.removeEventListener("abort",
e.abort),y-=e.buffer?.byteLength||0,e.buffer=null,t?(T++,e.reject(t)):(z++,e.resolve(r)),I()}function c(e,t){q(e),_(e,t)}
function I(){for(;!s&&f.size<h&&a.length;){const e=a.shift();e.active=!0,f.set(e.id,e);try{p({type:"open",id:e.id,path:e.
path,offset:e.offset,length:e.length})}catch(t){c(e,t)}}}function R(e){e.awaiting=!0;try{p({type:"pull",id:e.id})}catch(t){
c(e,t)}}function O(e){const t=e.data;if(s||t?.protocol!==B)return;if(t.type==="closed"){v(new Error(t.message||"Artifact\
 host closed"));return}const r=f.get(t.id);if(r)try{if(t.type==="error")throw new Error(t.message||"Artifact read failed");
if(t.type==="ready"){if(r.ready||t.size!==r.length)throw new Error("Invalid artifact range response size");r.ready=!0,r.
buffer=new Uint8Array(r.length),y+=r.length,E=Math.max(E,y),R(r)}else if(t.type==="chunk"){if(!r.ready||!r.awaiting||!(t.
bytes instanceof Uint8Array)||!t.bytes.byteLength||t.bytes.byteLength>F.chunkBytes||t.bytes.byteLength>r.length-r.received)
throw new Error("Invalid artifact range chunk");r.awaiting=!1,r.buffer.set(t.bytes,r.received),r.received+=t.bytes.byteLength,
M+=t.bytes.byteLength,R(r)}else if(t.type==="end"){if(!r.ready||!r.awaiting||r.received!==r.length)throw new Error("Trun\
cated artifact range");_(r,null,r.buffer)}else throw new Error("Unexpected artifact range message")}catch(i){c(r,i)}}function G(e){
if(s)throw b;const t=j.get(P(e));if(!t)throw new Error("Artifact path is not in the manifest");return t}async function C(e,t,r,{
signal:i}={}){const x=G(e);if(D(i),k(i),u(t,"artifact offset",0,Number.MAX_SAFE_INTEGER),u(r,"artifact read length",0,l),
t>x.size||r>x.size-t)throw new RangeError("Artifact range exceeds file size");if(f.size>=h&&a.length>=w)throw new Error(
"Artifact range queue is full");if(L===Number.MAX_SAFE_INTEGER)throw new RangeError("Artifact request identifiers exhaus\
ted");return new Promise((X,$)=>{const d={id:`gguf-${++L}`,path:e,offset:t,length:r,signal:i,resolve:X,reject:$,active:!1,
ready:!1,received:0,buffer:null};d.abort=()=>c(d,A(i.reason)),d.timer=setTimeout(()=>c(d,new DOMException("Artifact rang\
e read timed out","TimeoutError")),m),i?.addEventListener("abort",d.abort,{once:!0}),a.push(d),I()})}function v(e="GGUF \
artifact reader closed"){if(!s){s=!0,b=e instanceof Error?e:A(e),o?.removeEventListener("abort",U),n.removeEventListener(
"message",O);for(const t of[...f.values(),...a])c(t,b);n.close()}}const U=()=>v(A(o.reason));return o?.addEventListener(
"abort",U,{once:!0}),n.addEventListener("message",O),n.start?.(),{read:C,stat:G,close:v,getStats:()=>Object.freeze({closed:s,
activeReads:f.size,queuedReads:a.length,bufferedBytes:y,peakBufferedBytes:E,deliveredBytes:M,completedReads:z,failedReads:T,
maxReadBytes:l,maxReads:h,maxQueuedReads:w})}}export{J as c};
