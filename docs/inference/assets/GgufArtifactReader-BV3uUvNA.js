import{C as G,M as k,b as D,t as P,a as R,A as q}from"./modelTask-dQfjl6lX.js";const K="peercompute.artifact.manifest.v1",
$=256*1024,W=16*1024**3,v=new TextEncoder;function Z(e){const s=G.asCID(e)||G.parse(String(e));if(![85,112].includes(s.code)||
s.multihash.code!==18||s.multihash.digest.byteLength!==32)throw new TypeError("Artifacts require raw or dag-pb CIDs with\
 SHA-256.");return s.toV1()}function A(e,s=0,a={remaining:$}){if(s>12)throw new RangeError("Manifest nesting exceeds 12 \
levels.");if((a.remaining-=2)<0)throw new RangeError("Manifest exceeds byte limit.");if(typeof e=="string"){if(e.length>
a.remaining||(a.remaining-=v.encode(e).length)<0)throw new RangeError("Manifest exceeds byte limit.");return e}if(e===null||
typeof e=="boolean"||typeof e=="number"&&Number.isFinite(e))return e;if(Array.isArray(e)){if(e.length>4096)throw new RangeError(
"Manifest array exceeds item limit.");return e.map(f=>A(f,s+1,a))}if(!e||typeof e!="object"||Object.getPrototypeOf(e)!==
Object.prototype)throw new TypeError("Manifest values must be JSON values.");const d=Object.keys(e);if(d.length>1024)throw new RangeError(
"Manifest object exceeds key limit.");return Object.fromEntries(d.sort().map(f=>(A(f,s+1,a),[f,A(e[f],s+1,a)])))}function Q(e,{
maximumBytes:s=$,maximumFiles:a=1024,maximumFileBytes:d=W}={}){if(!e||e.schema!==K||!Array.isArray(e.files)||e.files.length===
0||e.files.length>a)throw new TypeError("Manifest requires the supported schema and a bounded, nonempty files array.");const f=new Set(
["schema","name","description","files","model","provenance"]);if(Object.keys(e).some(i=>!f.has(i)))throw new TypeError("\
Unsupported manifest field.");for(const i of["name","description"])if(e[i]!==void 0&&typeof e[i]!="string")throw new TypeError(
`Manifest ${i} must be a string.`);if(e.model!==void 0&&(!e.model||typeof e.model!="object"||Array.isArray(e.model)))throw new TypeError(
"Manifest model extension must be an object.");const y=new Set,p=e.files.map(i=>{if(!i||typeof i!="object")throw new TypeError(
"Invalid manifest file.");if(Object.keys(i).some(l=>!["path","cid","size","sha256","mediaType"].includes(l)))throw new TypeError(
"Unsupported manifest file field.");const{path:o,size:c}=i;if(typeof o!="string"||!o||v.encode(o).length>512||/[\\?#%\u0000-\u001f\u007f:]/u.
test(o)||o.split("/").some(l=>!l||l==="."||l==="..")||y.has(o))throw new TypeError("Manifest paths must be unique, relat\
ive POSIX paths without traversal or URL escapes.");if(!Number.isSafeInteger(c)||c<0||c>d)throw new RangeError("Invalid \
file size.");if(i.sha256!==void 0&&!/^[a-f0-9]{64}$/u.test(i.sha256))throw new TypeError("Invalid SHA-256.");if(i.mediaType!==
void 0&&(typeof i.mediaType!="string"||i.mediaType.length>256))throw new TypeError("Invalid media type.");return y.add(o),
{...i,cid:Z(i.cid).toString()}}).sort((i,o)=>i.path<o.path?-1:i.path>o.path?1:0),E=A({...e,files:p},0,{remaining:s});if(v.
encode(JSON.stringify(E)).byteLength>s)throw new RangeError("Manifest exceeds byte limit.");return E}const B=16*1024**2;
function g(e,s,a,d){if(!Number.isSafeInteger(e)||e<a||e>d)throw new RangeError(`Invalid ${s}`);return e}function X(e){if(e!=
null&&(typeof e.aborted!="boolean"||typeof e.addEventListener!="function"||typeof e.removeEventListener!="function"))throw new TypeError(
"An AbortSignal is required")}function re(e,{manifest:s,signal:a,maxReadBytes:d=B,maxReads:f=2,maxQueuedReads:y=16,readTimeoutMs:p=3e4}={}){
if(!e?.postMessage||!e?.addEventListener)throw new TypeError("A MessagePort is required");g(d,"maxReadBytes",1,B),g(f,"m\
axReads",1,k.maxReads),g(y,"maxQueuedReads",0,32),g(p,"readTimeoutMs",1,3e5),X(a);const E=Q(s),i=new Map(E.files.map(r=>{
if(!/^[a-f0-9]{64}$/.test(r.sha256??""))throw new TypeError("GGUF artifact files require SHA-256 digests");return[D(r.path),
Object.freeze({...r})]}));P(a);const o=new Map,c=[];let l=0,w=!1,T,b=0,M=0,_=0,O=0,S=0;function I(r){e.postMessage({protocol:q,
...r})}function H(r){if(r.active)try{I({type:"cancel",id:r.id})}catch{}}function x(r,t,n){if(r.finished)return;r.finished=
!0,o.delete(r.id);const h=c.indexOf(r);h!==-1&&c.splice(h,1),clearTimeout(r.timer),r.signal?.removeEventListener("abort",
r.abort),b-=r.buffer?.byteLength||0,r.buffer=null,t?(S++,r.reject(t)):(O++,r.resolve(n)),z()}function u(r,t){H(r),x(r,t)}
function z(){for(;!w&&o.size<f&&c.length;){const r=c.shift();r.active=!0,o.set(r.id,r);try{I({type:"open",id:r.id,path:r.
path,offset:r.offset,length:r.length})}catch(t){u(r,t)}}}function j(r){r.awaiting=!0;try{I({type:"pull",id:r.id})}catch(t){
u(r,t)}}function F(r){const t=r.data;if(w||t?.protocol!==q)return;if(t.type==="closed"){L(new Error(t.message||"Artifact\
 host closed"));return}const n=o.get(t.id);if(n)try{if(t.type==="error")throw new Error(t.message||"Artifact read failed");
if(t.type==="ready"){if(n.ready||t.size!==n.length)throw new Error("Invalid artifact range response size");n.ready=!0,n.
buffer=new Uint8Array(n.length),b+=n.length,M=Math.max(M,b),j(n)}else if(t.type==="chunk"){if(!n.ready||!n.awaiting||!(t.
bytes instanceof Uint8Array)||!t.bytes.byteLength||t.bytes.byteLength>k.chunkBytes||t.bytes.byteLength>n.length-n.received)
throw new Error("Invalid artifact range chunk");n.awaiting=!1,n.buffer.set(t.bytes,n.received),n.received+=t.bytes.byteLength,
_+=t.bytes.byteLength,j(n)}else if(t.type==="end"){if(!n.ready||!n.awaiting||n.received!==n.length)throw new Error("Trun\
cated artifact range");x(n,null,n.buffer)}else throw new Error("Unexpected artifact range message")}catch(h){u(n,h)}}function C(r){
if(w)throw T;const t=i.get(D(r));if(!t)throw new Error("Artifact path is not in the manifest");return t}async function Y(r,t,n,{
signal:h}={}){const N=C(r);if(X(h),P(h),g(t,"artifact offset",0,Number.MAX_SAFE_INTEGER),g(n,"artifact read length",0,d),
t>N.size||n>N.size-t)throw new RangeError("Artifact range exceeds file size");if(o.size>=f&&c.length>=y)throw new Error(
"Artifact range queue is full");if(l===Number.MAX_SAFE_INTEGER)throw new RangeError("Artifact request identifiers exhaus\
ted");return new Promise((J,V)=>{const m={id:`gguf-${++l}`,path:r,offset:t,length:n,signal:h,resolve:J,reject:V,active:!1,
ready:!1,received:0,buffer:null};m.abort=()=>u(m,R(h.reason)),m.timer=setTimeout(()=>u(m,new DOMException("Artifact rang\
e read timed out","TimeoutError")),p),h?.addEventListener("abort",m.abort,{once:!0}),c.push(m),z()})}function L(r="GGUF \
artifact reader closed"){if(!w){w=!0,T=r instanceof Error?r:R(r),a?.removeEventListener("abort",U),e.removeEventListener(
"message",F);for(const t of[...o.values(),...c])u(t,T);e.close()}}const U=()=>L(R(a.reason));return a?.addEventListener(
"abort",U,{once:!0}),e.addEventListener("message",F),e.start?.(),{read:Y,stat:C,close:L,getStats:()=>Object.freeze({closed:w,
activeReads:o.size,queuedReads:c.length,bufferedBytes:b,peakBufferedBytes:M,deliveredBytes:_,completedReads:O,failedReads:S,
maxReadBytes:d,maxReads:f,maxQueuedReads:y})}}export{re as c,Q as n};
