import{C as y}from"./ArtifactReadBridge-Bns2fboi.js";const g="peercompute.artifact.manifest.v1",w=256*1024,l=16*1024**3,
c=new TextEncoder;function E(e){const t=y.asCID(e)||y.parse(String(e));if(![85,112].includes(t.code)||t.multihash.code!==
18||t.multihash.digest.byteLength!==32)throw new TypeError("Artifacts require raw or dag-pb CIDs with SHA-256.");return t.
toV1()}function f(e,t=0,i={remaining:w}){if(t>12)throw new RangeError("Manifest nesting exceeds 12 levels.");if((i.remaining-=
2)<0)throw new RangeError("Manifest exceeds byte limit.");if(typeof e=="string"){if(e.length>i.remaining||(i.remaining-=
c.encode(e).length)<0)throw new RangeError("Manifest exceeds byte limit.");return e}if(e===null||typeof e=="boolean"||typeof e==
"number"&&Number.isFinite(e))return e;if(Array.isArray(e)){if(e.length>4096)throw new RangeError("Manifest array exceeds\
 item limit.");return e.map(o=>f(o,t+1,i))}if(!e||typeof e!="object"||Object.getPrototypeOf(e)!==Object.prototype)throw new TypeError(
"Manifest values must be JSON values.");const a=Object.keys(e);if(a.length>1024)throw new RangeError("Manifest object ex\
ceeds key limit.");return Object.fromEntries(a.sort().map(o=>(f(o,t+1,i),[o,f(e[o],t+1,i)])))}function T(e,{maximumBytes:t=w,
maximumFiles:i=1024,maximumFileBytes:a=l}={}){if(!e||e.schema!==g||!Array.isArray(e.files)||e.files.length===0||e.files.
length>i)throw new TypeError("Manifest requires the supported schema and a bounded, nonempty files array.");const o=new Set(
["schema","name","description","files","model","provenance"]);if(Object.keys(e).some(r=>!o.has(r)))throw new TypeError("\
Unsupported manifest field.");for(const r of["name","description"])if(e[r]!==void 0&&typeof e[r]!="string")throw new TypeError(
`Manifest ${r} must be a string.`);if(e.model!==void 0&&(!e.model||typeof e.model!="object"||Array.isArray(e.model)))throw new TypeError(
"Manifest model extension must be an object.");const h=new Set,p=e.files.map(r=>{if(!r||typeof r!="object")throw new TypeError(
"Invalid manifest file.");if(Object.keys(r).some(s=>!["path","cid","size","sha256","mediaType"].includes(s)))throw new TypeError(
"Unsupported manifest file field.");const{path:n,size:d}=r;if(typeof n!="string"||!n||c.encode(n).length>512||/[\\?#%\u0000-\u001f\u007f:]/u.
test(n)||n.split("/").some(s=>!s||s==="."||s==="..")||h.has(n))throw new TypeError("Manifest paths must be unique, relat\
ive POSIX paths without traversal or URL escapes.");if(!Number.isSafeInteger(d)||d<0||d>a)throw new RangeError("Invalid \
file size.");if(r.sha256!==void 0&&!/^[a-f0-9]{64}$/u.test(r.sha256))throw new TypeError("Invalid SHA-256.");if(r.mediaType!==
void 0&&(typeof r.mediaType!="string"||r.mediaType.length>256))throw new TypeError("Invalid media type.");return h.add(n),
{...r,cid:E(r.cid).toString()}}).sort((r,n)=>r.path<n.path?-1:r.path>n.path?1:0),m=f({...e,files:p},0,{remaining:t});if(c.
encode(JSON.stringify(m)).byteLength>t)throw new RangeError("Manifest exceeds byte limit.");return m}function M(e,t){return c.
encode(JSON.stringify(T(e,t)))}export{g as A,E as a,l as b,M as e,T as n};
