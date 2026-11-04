import{C as D,M as P,b as B,t as X,a as _,A as $}from"./modelTask-CpeYX26T.js";const W="peercompute.artifact.manifest.v1",
q=256*1024,Z=16*1024**3,O=new TextEncoder;function Q(e){const a=D.asCID(e)||D.parse(String(e));if(![85,112].includes(a.code)||
a.multihash.code!==18||a.multihash.digest.byteLength!==32)throw new TypeError("Artifacts require raw or dag-pb CIDs with\
 SHA-256.");return a.toV1()}function M(e,a=0,o={remaining:q}){if(a>12)throw new RangeError("Manifest nesting exceeds 12 \
levels.");if((o.remaining-=2)<0)throw new RangeError("Manifest exceeds byte limit.");if(typeof e=="string"){if(e.length>
o.remaining||(o.remaining-=O.encode(e).length)<0)throw new RangeError("Manifest exceeds byte limit.");return e}if(e===null||
typeof e=="boolean"||typeof e=="number"&&Number.isFinite(e))return e;if(Array.isArray(e)){if(e.length>4096)throw new RangeError(
"Manifest array exceeds item limit.");return e.map(f=>M(f,a+1,o))}if(!e||typeof e!="object"||Object.getPrototypeOf(e)!==
Object.prototype)throw new TypeError("Manifest values must be JSON values.");const h=Object.keys(e);if(h.length>1024)throw new RangeError(
"Manifest object exceeds key limit.");return Object.fromEntries(h.sort().map(f=>(M(f,a+1,o),[f,M(e[f],a+1,o)])))}function ee(e,{
maximumBytes:a=q,maximumFiles:o=1024,maximumFileBytes:h=Z}={}){if(!e||e.schema!==W||!Array.isArray(e.files)||e.files.length===
0||e.files.length>o)throw new TypeError("Manifest requires the supported schema and a bounded, nonempty files array.");const f=new Set(
["schema","name","description","files","model","provenance"]);if(Object.keys(e).some(i=>!f.has(i)))throw new TypeError("\
Unsupported manifest field.");for(const i of["name","description"])if(e[i]!==void 0&&typeof e[i]!="string")throw new TypeError(
`Manifest ${i} must be a string.`);if(e.model!==void 0&&(!e.model||typeof e.model!="object"||Array.isArray(e.model)))throw new TypeError(
"Manifest model extension must be an object.");const w=new Set,g=e.files.map(i=>{if(!i||typeof i!="object")throw new TypeError(
"Invalid manifest file.");if(Object.keys(i).some(y=>!["path","cid","size","sha256","mediaType"].includes(y)))throw new TypeError(
"Unsupported manifest file field.");const{path:s,size:c}=i;if(typeof s!="string"||!s||O.encode(s).length>512||/[\\?#%\u0000-\u001f\u007f:]/u.
test(s)||s.split("/").some(y=>!y||y==="."||y==="..")||w.has(s))throw new TypeError("Manifest paths must be unique, relat\
ive POSIX paths without traversal or URL escapes.");if(!Number.isSafeInteger(c)||c<0||c>h)throw new RangeError("Invalid \
file size.");if(i.sha256!==void 0&&!/^[a-f0-9]{64}$/u.test(i.sha256))throw new TypeError("Invalid SHA-256.");if(i.mediaType!==
void 0&&(typeof i.mediaType!="string"||i.mediaType.length>256))throw new TypeError("Invalid media type.");return w.add(s),
{...i,cid:Q(i.cid).toString()}}).sort((i,s)=>i.path<s.path?-1:i.path>s.path?1:0),p=M({...e,files:g},0,{remaining:a});if(O.
encode(JSON.stringify(p)).byteLength>a)throw new RangeError("Manifest exceeds byte limit.");return p}const H=16*1024**2;
function E(e,a,o,h){if(!Number.isSafeInteger(e)||e<o||e>h)throw new RangeError(`Invalid ${a}`);return e}function Y(e){if(e!=
null&&(typeof e.aborted!="boolean"||typeof e.addEventListener!="function"||typeof e.removeEventListener!="function"))throw new TypeError(
"An AbortSignal is required")}function te(e,{manifest:a,signal:o,maxReadBytes:h=H,maxReads:f=2,maxQueuedReads:w=16,readTimeoutMs:g=3e4}={}){
var k;if(!(e!=null&&e.postMessage)||!(e!=null&&e.addEventListener))throw new TypeError("A MessagePort is required");E(h,
"maxReadBytes",1,H),E(f,"maxReads",1,P.maxReads),E(w,"maxQueuedReads",0,32),E(g,"readTimeoutMs",1,3e5),Y(o);const p=ee(a),
i=new Map(p.files.map(r=>{if(!/^[a-f0-9]{64}$/.test(r.sha256??""))throw new TypeError("GGUF artifact files require SHA-2\
56 digests");return[B(r.path),Object.freeze({...r})]}));X(o);const s=new Map,c=[];let y=0,l=!1,I,A=0,L=0,x=0,z=0,S=0;function R(r){
e.postMessage({protocol:$,...r})}function J(r){if(r.active)try{R({type:"cancel",id:r.id})}catch{}}function j(r,t,n){var b,
T;if(r.finished)return;r.finished=!0,s.delete(r.id);const d=c.indexOf(r);d!==-1&&c.splice(d,1),clearTimeout(r.timer),(b=
r.signal)==null||b.removeEventListener("abort",r.abort),A-=((T=r.buffer)==null?void 0:T.byteLength)||0,r.buffer=null,t?(S++,
r.reject(t)):(z++,r.resolve(n)),F()}function u(r,t){J(r),j(r,t)}function F(){for(;!l&&s.size<f&&c.length;){const r=c.shift();
r.active=!0,s.set(r.id,r);try{R({type:"open",id:r.id,path:r.path,offset:r.offset,length:r.length})}catch(t){u(r,t)}}}function C(r){
r.awaiting=!0;try{R({type:"pull",id:r.id})}catch(t){u(r,t)}}function U(r){const t=r.data;if(l||(t==null?void 0:t.protocol)!==
$)return;if(t.type==="closed"){v(new Error(t.message||"Artifact host closed"));return}const n=s.get(t.id);if(n)try{if(t.
type==="error")throw new Error(t.message||"Artifact read failed");if(t.type==="ready"){if(n.ready||t.size!==n.length)throw new Error(
"Invalid artifact range response size");n.ready=!0,n.buffer=new Uint8Array(n.length),A+=n.length,L=Math.max(L,A),C(n)}else if(t.
type==="chunk"){if(!n.ready||!n.awaiting||!(t.bytes instanceof Uint8Array)||!t.bytes.byteLength||t.bytes.byteLength>P.chunkBytes||
t.bytes.byteLength>n.length-n.received)throw new Error("Invalid artifact range chunk");n.awaiting=!1,n.buffer.set(t.bytes,
n.received),n.received+=t.bytes.byteLength,x+=t.bytes.byteLength,C(n)}else if(t.type==="end"){if(!n.ready||!n.awaiting||
n.received!==n.length)throw new Error("Truncated artifact range");j(n,null,n.buffer)}else throw new Error("Unexpected ar\
tifact range message")}catch(d){u(n,d)}}function N(r){if(l)throw I;const t=i.get(B(r));if(!t)throw new Error("Artifact p\
ath is not in the manifest");return t}async function V(r,t,n,{signal:d}={}){const b=N(r);if(Y(d),X(d),E(t,"artifact offs\
et",0,Number.MAX_SAFE_INTEGER),E(n,"artifact read length",0,h),t>b.size||n>b.size-t)throw new RangeError("Artifact range\
 exceeds file size");if(s.size>=f&&c.length>=w)throw new Error("Artifact range queue is full");if(y===Number.MAX_SAFE_INTEGER)
throw new RangeError("Artifact request identifiers exhausted");return new Promise((T,K)=>{const m={id:`gguf-${++y}`,path:r,
offset:t,length:n,signal:d,resolve:T,reject:K,active:!1,ready:!1,received:0,buffer:null};m.abort=()=>u(m,_(d.reason)),m.
timer=setTimeout(()=>u(m,new DOMException("Artifact range read timed out","TimeoutError")),g),d==null||d.addEventListener(
"abort",m.abort,{once:!0}),c.push(m),F()})}function v(r="GGUF artifact reader closed"){if(!l){l=!0,I=r instanceof Error?
r:_(r),o==null||o.removeEventListener("abort",G),e.removeEventListener("message",U);for(const t of[...s.values(),...c])u(
t,I);e.close()}}const G=()=>v(_(o.reason));return o==null||o.addEventListener("abort",G,{once:!0}),e.addEventListener("m\
essage",U),(k=e.start)==null||k.call(e),{read:V,stat:N,close:v,getStats:()=>Object.freeze({closed:l,activeReads:s.size,queuedReads:c.
length,bufferedBytes:A,peakBufferedBytes:L,deliveredBytes:x,completedReads:z,failedReads:S,maxReadBytes:h,maxReads:f,maxQueuedReads:w})}}export{te as c,ee as n};
